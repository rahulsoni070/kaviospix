import { useEffect, useState } from "react";

const MIN_LETTERS = 3;

export default function FilterBar({
  tagFilter,
  showFavorites,
  onApplyTag,
  onToggleFavorites,
}) {
  const [input, setInput] = useState(tagFilter);

  const text = input.trim().toLowerCase();
  const tooShort = text.length > 0 && text.length < MIN_LETTERS;
  useEffect(() => {
    const next = text.length >= MIN_LETTERS ? text : "";
    if (next === tagFilter) return;

    const timer = setTimeout(() => onApplyTag(next), 400);
    return () => clearTimeout(timer);
  }, [text, tagFilter, onApplyTag]);

  // Pressing Enter should not reload the page
  const handleSubmit = (e) => e.preventDefault();

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
          placeholder="Search by tag, e.g. bea → #beach"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {input && (
          <button type="button" onClick={clearTag}>
            Clear
          </button>
        )}
      </form>

      <button
        type="button"
        onClick={handleFavorites}
        className={showFavorites ? "active" : ""}
      >
        {showFavorites ? "⭐ Showing favorites" : "☆ Favorites only"}
      </button>

      {tooShort && (
        <p className="muted filter-hint">
          Type at least {MIN_LETTERS} letters to search
        </p>
      )}
    </div>
  );
}