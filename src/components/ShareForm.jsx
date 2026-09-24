import { useState } from "react";
import api from "../api/axios";

export default function ShareForm({ albumId, sharedWith, onShared }) {
  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emails = input
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    if (emails.length === 0) {
      setError("Enter at least one email");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.post(`/albums/${albumId}/share`, { emails });
      onShared(emails);
      setInput("");
      setMessage(`Shared with ${emails.join(", ")}`);
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

      <input
        type="text"
        placeholder="friend@gmail.com, another@gmail.com"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Sharing..." : "Share"}
      </button>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}