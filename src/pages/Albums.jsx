import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AlbumCard from "../components/AlbumCard";
import CreateAlbumForm from "../components/CreateAlbumForm";

export default function Albums() {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/albums")
      .then((res) => setAlbums(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load albums"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newAlbum) => {
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const myAlbums = albums.filter((a) => a.ownerId === user._id);
  const sharedAlbums = albums.filter((a) => a.ownerId !== user._id);

  if (loading) return <p className="page">Loading albums...</p>;
  if (error) return <p className="page error">{error}</p>;

  return (
    <div className="page">
      <CreateAlbumForm onCreated={handleCreated} />

      <h2>My albums ({myAlbums.length})</h2>
      {myAlbums.length === 0 ? (
        <p className="muted">No albums yet. Create your first one above.</p>
      ) : (
        <div className="album-grid">
          {myAlbums.map((album) => (
            <AlbumCard key={album._id} album={album} isOwner={true} />
          ))}
        </div>
      )}

      <h2>Shared with me ({sharedAlbums.length})</h2>
      {sharedAlbums.length === 0 ? (
        <p className="muted">Nothing shared with you yet.</p>
      ) : (
        <div className="album-grid">
          {sharedAlbums.map((album) => (
            <AlbumCard key={album._id} album={album} isOwner={false} />
          ))}
        </div>
      )}
    </div>
  );
}