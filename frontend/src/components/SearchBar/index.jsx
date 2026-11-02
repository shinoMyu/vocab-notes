import { Search, X } from "lucide-react";

import "./search-bar.css";

function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel = "搜尋",
  onSubmit,
  submitLabel = "搜尋",
}) {
  const canSubmit = value.trim().length > 0;

  const content = (
    <>
      <Search size={20} />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />

      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => onChange("")}
          aria-label="清除搜尋內容"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}

      {onSubmit && (
        <button type="submit" className="search-bar-submit">
          {submitLabel}
        </button>
      )}
    </>
  );

  if (!onSubmit) {
    return <div className="search-bar">{content}</div>;
  }

  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault();

        if (canSubmit) {
          onSubmit(value.trim());
        }
      }}
    >
      {content}
    </form>
  );
}

export default SearchBar;
