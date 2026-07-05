import '../styles/quick-ideas-workspace.css';

export default function IdeaDeleteConfirm({ idea, onConfirm, onCancel }) {
  return (
    <div className="qi-confirm" role="status">
      <p className="qi-confirm__message">Delete this idea permanently?</p>
      <div className="qi-confirm__actions">
        <button
          type="button"
          className="qi-confirm__delete"
          aria-label="Confirm delete idea"
          onClick={() => onConfirm(idea.id)}
        >
          Confirm Delete
        </button>
        <button
          type="button"
          className="qi-confirm__cancel"
          aria-label="Cancel delete"
          onClick={() => onCancel(idea.id)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
