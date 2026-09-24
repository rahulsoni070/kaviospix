import { useRef, useState } from "react";
import api from "../api/axios";

const MAX_SIZE = 5 * 1024 * 1024;

export default function UploadForm({ albumId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const clearFileBox = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0];
    setError("");

    if (!picked) {
      setFile(null);
      return;
    }
    if (!picked.type.startsWith("image/")) {
      setError("Only image files are allowed (jpg, png, gif...)");
      clearFileBox();
      return;
    }
    if (picked.size > MAX_SIZE) {
      setError("Photo must be 5MB or smaller");
      clearFileBox();
      return;
    }
    setFile(picked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please choose a photo");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("tags", tags);
    formData.append("person", person);
    formData.append("isFavorite", isFavorite);

    setUploading(true);
    setError("");

    try {
      await api.post(`/albums/${albumId}/images`, formData);
      clearFileBox();
      setTags("");
      setPerson("");
      setIsFavorite(false);
      onUploaded();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload a photo</h2>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <input
        type="text"
        placeholder="Tags (comma separated): beach, sunset"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <input
        type="text"
        placeholder="Person in photo (optional)"
        value={person}
        onChange={(e) => setPerson(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
        />
        Favorite
      </label>

      <button type="submit" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}