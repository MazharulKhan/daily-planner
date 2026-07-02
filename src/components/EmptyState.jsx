import '../styles/empty-state.css';

export default function EmptyState({ title, hint, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <svg
        className="empty-state__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 10h8M8 14h5" />
      </svg>
      {title && <div className="empty-state__title">{title}</div>}
      {hint && <div className="empty-state__hint">{hint}</div>}
      {actionLabel && (
        <button type="button" className="empty-state__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
