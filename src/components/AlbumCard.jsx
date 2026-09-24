import { useState } from "react";
import { Link } from "react-router";
import api from "../api/axios";

export default function AlbumCard({ album, isOwner, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sharedCount = album.sharedWith.length;

  const startEdit = () => {
    setDescription(album.description || "");
    setError("");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError("");
  };

  const saveDescription = async (e) => {
    e.preventDefault();
    const text = description.trim();

    setSaving(true);
    setError("");

    try {
      const res = await api.put(`/albums/${album._id}`, { description: text });
      onUpdated({ ...album, description: res.data.description ?? text });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update description");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="album-card">
      <Link to={`/albums/${album._id}`} className="album-link">
        <h3>{album.name}</h3>

        {!editing && album.description && (
          <p className="album-desc">{album.description}</p>
        )}
        {!editing && !album.description && isOwner && (
          <p className="muted">No description yet</p>
        )}

        {isOwner ? (
          <small className="muted">
            Shared with {sharedCount} {sharedCount === 1 ? "person" : "people"}
          </small>
        ) : (
          <small className="badge">🔗 Shared with you</small>
        )}
      </Link>
      {isOwner && !editing && (
        <div className="album-actions">
          <button type="button" className="link-btn" onClick={startEdit}>
            ✏️ Edit description
          </button>
        </div>
      )}

      {isOwner && editing && (
        <form className="edit-form" onSubmit={saveDescription}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description..."
            maxLength={300}
            autoFocus
          />
          <div className="edit-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
}