import { useState } from "react";

export default function FilterBar({ tagFilter, showFavorites, onApplyTag, onToggleFavorites }) {
  const [input, setInput] = useState(tagFilter);

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyTag(input.trim().toLowerCase());
  };

  const clearTag = () => {
    setInput("");
    onApplyTag("");
  };

  const handleFavorites = () => {
    setInput("");
    onToggleFavorites();
  };

  return (
    <div className="filter-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Filter by tag: beach"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Search</button>
        {tagFilter && (
          <button type="button" onClick={clearTag}>Clear</button>
        )}
      </form>

      <button
        type="button"
        onClick={handleFavorites}
        className={showFavorites ? "active" : ""}
      >
        {showFavorites ? "⭐ Showing favorites" : "☆ Favorites only"}
      </button>
    </div>
  );
}