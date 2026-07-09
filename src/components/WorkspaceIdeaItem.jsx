import { useEffect, useRef, useState } from 'react';
import '../styles/quick-ideas-workspace.css';
import { formatRelativeTime } from '../utils/dateTime';
import IdeaDeleteConfirm from './IdeaDeleteConfirm';

export default function WorkspaceIdeaItem({
  idea,
  expanded,
  action,
  muted,
  isNotesDirty,
  draftNotes,
  notesSavedAt,
  onToggleExpand,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDeleteStart,
  onDeleteConfirm,
  onDeleteCancel,
  onNotesChange,
  onNotesSave,
  onNotesCancel,
}) {
  const editBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const notesRef = useRef(null);
  const editTextRef = useRef(null);

  const isEdit = action && action.id === idea.id && action.type === 'edit';
  const isConfirm =
    action && action.id === idea.id && action.type === 'confirm';
  const hasAction = Boolean(action);

  const [editText, setEditText] = useState(idea.text ?? '');

  useEffect(() => {
    if (isEdit && editTextRef.current) {
      editTextRef.current.focus();
      const len = editTextRef.current.value.length;
      editTextRef.current.setSelectionRange(len, len);
    }
  }, [isEdit]);

  useEffect(() => {
    if (expanded && !isEdit && !isConfirm && notesRef.current) {
      const el = notesRef.current;
      el.focus();
      if (el.value.length > 0) {
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  }, [expanded, isEdit, isConfirm]);

  function handleEditCancel() {
    onEditCancel(idea.id);
    editBtnRef.current?.focus();
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleEditCancel();
    }
  }

  function handleEditSave() {
    const trimmed = editText.trim();
    if (!trimmed) {
      editTextRef.current?.focus();
      return;
    }
    onEditSave(idea.id, { text: trimmed });
  }

  function handleDeleteCancel() {
    onDeleteCancel(idea.id);
    deleteBtnRef.current?.focus();
  }

  function handleNotesSave() {
    onNotesSave(idea.id);
    notesRef.current?.focus();
  }

  function handleNotesCancel() {
    onNotesCancel(idea.id);
    notesRef.current?.focus();
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
        {isEdit ? (
          <div className="qi-idea__title-edit">
            <div className="qi-idea__title-edit-row">
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
              <textarea
                ref={editTextRef}
                className="qi-idea__title-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                rows={2}
                aria-label={`Edit title: ${idea.text}`}
              />
            </div>
            <div className="qi-idea__title-edit-actions">
              <button
                type="button"
                className="qi-edit__save"
                onClick={handleEditSave}
                aria-label="Save title"
              >
                Save title
              </button>
              <button
                type="button"
                className="qi-edit__cancel"
                onClick={handleEditCancel}
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
            <span className="qi-idea__time">
              {formatRelativeTime(idea.createdAt)}
            </span>
            <span className="qi-idea__chevron" aria-hidden="true">
              ▾
            </span>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="qi-idea__expand"
              aria-expanded={expanded}
              aria-label={expanded ? `Collapse idea: ${idea.text}` : `Expand idea: ${idea.text}`}
              onClick={() => onToggleExpand(idea.id)}
              disabled={hasAction || isNotesDirty}
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
            {!isEdit && !isConfirm && (
              <>
                <button
                  ref={editBtnRef}
                  type="button"
                  className="qi-idea__edit-title"
                  aria-label={`Edit title: ${idea.text}`}
                  disabled={muted || isNotesDirty}
                  onClick={() => {
                    setEditText(idea.text ?? '');
                    onEditStart(idea.id);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="qi-idea__delete-title"
                  aria-label={`Delete idea: ${idea.text}`}
                  disabled={muted || isNotesDirty}
                  onClick={() => {
                    if (!expanded) {
                      onToggleExpand(idea.id);
                    }
                    onDeleteStart(idea.id);
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                </button>
              </>
            )}
            <span className="qi-idea__time">
              {formatRelativeTime(idea.createdAt)}
            </span>
            <span className="qi-idea__chevron" aria-hidden="true">
              {expanded ? '▾' : '▸'}
            </span>
          </>
        )}
      </div>

      {expanded && !isEdit && !isConfirm && (
        <div className="qi-idea__body">
          <div className="qi-idea__notes-editor">
            <label className="qi-idea__notes-label" htmlFor={`qi-notes-${idea.id}`}>
              Notes
            </label>
            <textarea
              ref={notesRef}
              id={`qi-notes-${idea.id}`}
              className="qi-idea__notes-textarea"
              value={draftNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Add notes..."
              rows={4}
              aria-label={`Notes for idea: ${idea.text}`}
            />
            <div className="qi-idea__notes-actions">
              <button
                type="button"
                className="qi-edit__save"
                disabled={!isNotesDirty}
                onClick={handleNotesSave}
                aria-label="Save notes"
              >
                Save notes
              </button>
              <button
                type="button"
                className="qi-edit__cancel"
                disabled={!isNotesDirty}
                onClick={handleNotesCancel}
                aria-label="Discard unsaved note changes"
              >
                Discard changes
              </button>
            </div>

            {notesSavedAt && (
              <p className="qi-idea__notes-saved" role="status">
                Notes saved at {notesSavedAt}
              </p>
            )}
          </div>

          <div className="qi-idea__actions">
            <button
              ref={deleteBtnRef}
              type="button"
              className="qi-idea__action qi-idea__action--danger"
              disabled={isNotesDirty}
              aria-label={`Delete idea: ${idea.text}`}
              onClick={() => onDeleteStart(idea.id)}
            >
              Delete
            </button>
          </div>
        </div>
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
