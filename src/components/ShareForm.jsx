import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ShareForm({ albumId, sharedWith, onShared }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setError("Could not load users"))
      .finally(() => setLoadingUsers(false));
  }, []);

  const available = users.filter((u) => !sharedWith.includes(u.email));

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
        <p className="muted">Shared with: {sharedWith.join(", ")}</p>
      )}

      {loadingUsers ? (
        <p className="muted">Loading users...</p>
      ) : available.length === 0 ? (
        <p className="muted">
          No other users to share with. Ask your friend to sign in to KaviosPix once.
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