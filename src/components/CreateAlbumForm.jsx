import { useState } from "react";
import api from "../api/axios";

export default function CreateAlbumForm({ onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Album name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await api.post("/albums", {
        name: name.trim(),
        description: description.trim(),
      });
      onCreated(res.data);
      setName("");
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create album");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <h2>Create a new album</h2>

      <input
        type="text"
        placeholder="Album name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" disabled={saving}>
        {saving ? "Creating..." : "Create album"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}