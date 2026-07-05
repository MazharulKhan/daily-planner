import { useRef } from 'react';
import '../styles/quick-ideas-workspace.css';
import { formatRelativeTime } from '../utils/dateTime';
import IdeaEditForm from './IdeaEditForm';
import IdeaDeleteConfirm from './IdeaDeleteConfirm';

export default function WorkspaceIdeaItem({
  idea,
  expanded,
  action,
  muted,
  onToggleExpand,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDeleteStart,
  onDeleteConfirm,
  onDeleteCancel,
}) {
  const editBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);

  const isEdit = action && action.id === idea.id && action.type === 'edit';
  const isConfirm =
    action && action.id === idea.id && action.type === 'confirm';
  const hasAction = Boolean(action);

  const notesText = typeof idea.notes === 'string' ? idea.notes.trim() : '';

  function handleEditCancel() {
    onEditCancel(idea.id);
    editBtnRef.current?.focus();
  }

  function handleDeleteCancel() {
    onDeleteCancel(idea.id);
    deleteBtnRef.current?.focus();
  }

  return (
    <article
      id={`idea-region-${idea.id}`}
      tabIndex={-1}
      className={
        'qi-idea' +
        (expanded ? ' qi-idea--expanded' : '') +
        (muted ? ' qi-idea--muted' : '')
      }
    >
      <div className="qi-idea__row">
        <button
          type="button"
          className="qi-idea__expand"
          aria-expanded={expanded}
          aria-label={expanded ? `Collapse idea: ${idea.text}` : `Expand idea: ${idea.text}`}
          onClick={() => onToggleExpand(idea.id)}
          disabled={hasAction}
        >
          <svg
            className="qi-idea__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
          </svg>
          <span className="qi-idea__text">{idea.text}</span>
        </button>
        <span className="qi-idea__time">
          {formatRelativeTime(idea.createdAt)}
        </span>
        <span className="qi-idea__chevron" aria-hidden="true">
          {expanded ? '▾' : '▸'}
        </span>
      </div>

      {expanded && !isEdit && !isConfirm && (
        <div className="qi-idea__body">
          <p className="qi-idea__text-full">{idea.text}</p>
          <div className="qi-idea__notes">
            {notesText ? (
              <p className="qi-idea__notes-text">{idea.notes}</p>
            ) : (
              <p className="qi-idea__notes-empty">No notes yet.</p>
            )}
          </div>
          <div className="qi-idea__actions">
            <button
              ref={editBtnRef}
              type="button"
              className="qi-idea__action"
              aria-label={`Edit idea: ${idea.text}`}
              onClick={() => onEditStart(idea.id)}
            >
              Edit
            </button>
            <button
              ref={deleteBtnRef}
              type="button"
              className="qi-idea__action qi-idea__action--danger"
              aria-label={`Delete idea: ${idea.text}`}
              onClick={() => onDeleteStart(idea.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {expanded && isEdit && (
        <IdeaEditForm
          idea={idea}
          onSave={onEditSave}
          onCancel={handleEditCancel}
        />
      )}

      {expanded && isConfirm && (
        <IdeaDeleteConfirm
          idea={idea}
          onConfirm={onDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </article>
  );
}
