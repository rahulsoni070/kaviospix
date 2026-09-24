import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../api/axios";
import ImageCard from "../components/ImageCard";
import UploadForm from "../components/UploadForm";
import FilterBar from "../components/FilterBar";
import ShareForm from "../components/ShareForm";

const LIMIT = 12;

export default function AlbumPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [albumError, setAlbumError] = useState("");

  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [tagFilter, setTagFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    api.get(`/albums/${albumId}`)
      .then((res) => setAlbum(res.data))
      .catch((err) =>
        setAlbumError(err.response?.data?.message || "Could not load album")
      );
  }, [albumId]);

  useEffect(() => {
    setImagesLoading(true);

    const request = showFavorites
      ? api.get(`/albums/${albumId}/images/favorites`)
      : api.get(`/albums/${albumId}/images`, {
          params: { page, limit: LIMIT, tags: tagFilter || undefined },
        });

    request
      .then((res) => {
        if (Array.isArray(res.data)) {
          setImages(res.data);
          setTotalPages(1);
        } else {
          setImages(res.data.images);
          setTotalPages(res.data.totalPages);
          if (res.data.totalPages > 0 && page > res.data.totalPages) {
            setPage(res.data.totalPages);
          }
        }
      })
      .catch(() => setImages([]))
      .finally(() => setImagesLoading(false));
  }, [albumId, page, refreshKey, tagFilter, showFavorites]);


  const handleUploaded = () => {
    setAlbum((prev) => ({ ...prev, imageCount: prev.imageCount + 1 }));
    setShowFavorites(false);
    setTagFilter("");
    setPage(1);
    setRefreshKey((k) => k + 1);
  };

  const handleImageChange = (updated) => {
    if (showFavorites && !updated.isFavorite) {
      setImages((prev) => prev.filter((img) => img._id !== updated._id));
      return;
    }
    setImages((prev) =>
      prev.map((img) => (img._id === updated._id ? updated : img))
    );
  };

  const handleImageDelete = () => {
    setAlbum((prev) => ({ ...prev, imageCount: prev.imageCount - 1 }));
    setRefreshKey((k) => k + 1);
  };

  const handleApplyTag = (tag) => {
    setShowFavorites(false);
    setTagFilter(tag);
    setPage(1);
  };

  const handleToggleFavorites = () => {
    setShowFavorites((f) => !f);
    setTagFilter("");
    setPage(1);
  };

  const handleShared = (emails) => {
    setAlbum((prev) => ({
      ...prev,
      sharedWith: [...new Set([...prev.sharedWith, ...emails])],
    }));
  };

  const handleDeleteAlbum = async () => {
    const ok = window.confirm(
      `Delete "${album.name}" and ALL ${album.imageCount} photos? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await api.delete(`/albums/${albumId}`);
      navigate("/albums", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete album");
    }
  };


  if (albumError) {
    return (
      <div className="page">
        <Link to="/albums">← Back to albums</Link>
        <p className="error">{albumError}</p>
      </div>
    );
  }

  if (!album) return <p className="page">Loading album...</p>;

  const filtering = tagFilter || showFavorites;

  return (
    <div className="page">
      <Link to="/albums">← Back to albums</Link>

      <div className="album-header">
        <h1>{album.name}</h1>
        {album.description && <p>{album.description}</p>}
        <p className="muted">
          by {album.ownerId.name} · {album.imageCount} photos
          {!album.isOwner && " · 🔗 Shared with you"}
        </p>
      </div>

      {album.isOwner && (
        <div className="owner-panel">
          <UploadForm albumId={albumId} onUploaded={handleUploaded} />
          <ShareForm
            albumId={albumId}
            sharedWith={album.sharedWith}
            onShared={handleShared}
          />
          <button className="danger" onClick={handleDeleteAlbum}>
            🗑 Delete album
          </button>
        </div>
      )}

      <FilterBar
        tagFilter={tagFilter}
        showFavorites={showFavorites}
        onApplyTag={handleApplyTag}
        onToggleFavorites={handleToggleFavorites}
      />

      {tagFilter && <p className="muted">Showing photos tagged #{tagFilter}</p>}

      {imagesLoading ? (
        <p>Loading photos...</p>
      ) : images.length === 0 ? (
        <p className="muted">
          {filtering ? "No photos match this filter." : "No photos in this album yet."}
        </p>
      ) : (
        <div className="image-grid">
          {images.map((image) => (
            <ImageCard
              key={image._id}
              image={image}
              albumId={albumId}
              isOwner={album.isOwner}
              onChange={handleImageChange}
              onDelete={handleImageDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}