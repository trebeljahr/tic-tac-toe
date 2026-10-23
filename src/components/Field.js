export default function Field({ handleClick, field, content, winning, disabled }) {
  return (
    <button
      type="button"
      className={`${content} tile${winning ? " winning" : ""}`}
      aria-label={`Row ${field.x + 1}, column ${field.y + 1}: ${content || "empty"}`}
      disabled={disabled}
      onClick={() => handleClick(field)}
    >
      {content && (
        <svg className={`mark mark-${content}`} viewBox="0 0 100 100" aria-hidden="true">
          {content === "X" ? (
            <path d="M20 20 80 80 M80 20 20 80" />
          ) : (
            <circle cx="50" cy="50" r="39" />
          )}
        </svg>
      )}
    </button>
  );
}
