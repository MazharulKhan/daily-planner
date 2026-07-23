import '../styles/quick-ideas-workspace.css';

export default function IdeaDeleteConfirm({
  idea,
  onConfirm,
  onCancel,
  pending = false,
  error = null,
  disabled = false,
}) {
  return (
    <div className="qi-confirm" role="status">
      <p className="qi-confirm__message">Delete this idea permanently?</p>
      <div className="qi-confirm__actions">
        <button
          type="button"
          className="qi-confirm__delete"
          aria-label="Confirm delete idea"
          onClick={() => onConfirm(idea.id)}
          disabled={pending || disabled}
          aria-busy={pending}
        >
          {pending ? 'Syncing deletion...' : 'Confirm Delete'}
        </button>
        <button
          type="button"
          className="qi-confirm__cancel"
          aria-label="Cancel delete"
          onClick={() => onCancel(idea.id)}
          disabled={pending}
        >
          Cancel
        </button>
      </div>
      {error && <p className="qi-operation-error" role="alert">{error}</p>}
    </div>
  );
}
