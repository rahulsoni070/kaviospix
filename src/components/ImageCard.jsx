import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ImageCard({ image, albumId, isOwner, onChange, onDelete }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const base = `/albums/${albumId}/images/${image._id}`;

  const toggleFavorite = async () => {
    const newValue = !image.isFavorite;
    setBusy(true);
    setError("");
    try {
      await api.put(`${base}/favorite`, { isFavorite: newValue });
      onChange({ ...image, isFavorite: newValue });
    } catch (err) {
      setError(err.response?.data?.message || "Could not update favorite");
    } finally {
      setBusy(false);
    }
  };

  const deleteImage = async () => {
    const ok = window.confirm(`Delete "${image.name}"? This cannot be undone.`);
    if (!ok) return;

    setBusy(true);
    setError("");
    try {
      await api.delete(base);
      onDelete(image._id);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete photo");
      setBusy(false);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();

    if (!text) return;
    if (text.length > 500) {
      setError("Comment must be 500 characters or less");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await api.post(`${base}/comments`, { comment: text });
      onChange({ ...image, comments: [...image.comments, res.data] });
      setCommentText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add comment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-card">
      <img src={image.imageUrl} alt={image.name} loading="lazy" />

      <div className="image-info">
        <p className="image-name">{image.name}</p>

        {image.person && <p className="muted">👤 {image.person}</p>}

        {image.tags.length > 0 && (
          <div className="tags">
            {image.tags.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="image-actions">
          {isOwner ? (
            <button
              onClick={toggleFavorite}
              disabled={busy}
              title={image.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {image.isFavorite ? "⭐" : "☆"}
            </button>
          ) : (
            image.isFavorite && <span>⭐</span>
          )}

          <button onClick={() => setShowComments((s) => !s)}>
            💬 {image.comments.length}
          </button>

          {isOwner && (
            <button onClick={deleteImage} disabled={busy} className="danger" title="Delete photo">
              🗑
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        {showComments && (
          <div className="comments">
            {image.comments.length === 0 && (
              <p className="muted">No comments yet.</p>
            )}

            {image.comments.map((c) => {
                const author = typeof c.userId === "object" ? c.userId : null;
                const authorId = author ? author._id : c.userId;
                const isMe = authorId === user._id;
                const name = isMe ? "You" : author?.name || "Friend";

                return (
                    <div key={c._id} className="comment">
                    {author?.avatar && (
                        <img
                        src={author.avatar}
                        alt=""
                        width="20"
                        height="20"
                        referrerPolicy="no-referrer"
                        className="comment-avatar"
                        />
                    )}
                    <div>
                        <strong>{name}</strong>{" "}
                        <span className="muted comment-time">
                        {new Date(c.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "numeric",
                            minute: "2-digit",
                            })}
                        </span>
                        <p>{c.text}</p>
                    </div>
                    </div>
                );
                })}

            <form onSubmit={addComment} className="comment-form">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
              />
              <button type="submit" disabled={busy}>Post</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}