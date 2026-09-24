import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ShareForm({ albumId, sharedWith, onShared }) {
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setUsersError(err.response?.data?.message || "Could not load users")
      )
      .finally(() => setLoadingUsers(false));
  }, []);

  const available = users.filter((u) => !sharedWith.includes(u.email));

  const everyoneHasAccess = users.length > 0 && available.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected) {
      setError("Please choose a user");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.post(`/albums/${albumId}/share`, { emails: [selected] });
      onShared([selected]);
      setMessage(`Shared with ${selected}`);
      setSelected("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not share album");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="share-form">
      <h3>Share this album</h3>

      {sharedWith.length > 0 && (
        <div className="shared-list">
          <span className="muted">Shared with:</span>
          {sharedWith.map((email) => (
            <span key={email} className="chip" title={email}>
              {email}
            </span>
          ))}
        </div>
      )}

      {loadingUsers ? (
        <p className="muted">Loading users...</p>
      ) : usersError ? (
        <p className="error">{usersError}</p>
      ) : everyoneHasAccess ? (
        <p className="muted">This album is already shared with everyone on KaviosPix.</p>
      ) : available.length === 0 ? (
        <p className="muted">
          No other users yet. Ask your friend to sign in to KaviosPix once.
        </p>
      ) : (
        <>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select a user...</option>
            {available.map((u) => (
              <option key={u._id} value={u.email}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button type="submit" disabled={saving || !selected}>
            {saving ? "Sharing..." : "Share"}
          </button>
        </>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}