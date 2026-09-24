import { Link } from "react-router";

export default function AlbumCard({ album, isOwner }) {
  return (
    <Link to={`/albums/${album._id}`} className="album-card">
      <h3>{album.name}</h3>

      {album.description && <p>{album.description}</p>}

      {isOwner ? (
        <small>
            Shared with {album.sharedWith.length}{" "}
            {album.sharedWith.length === 1 ? "person" : "people"}
        </small>
      ) : (
        <small className="badge">🔗 Shared with you</small>
      )}
    </Link>
  );
}