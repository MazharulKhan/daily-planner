import { useEffect, useId, useRef, useState } from 'react';
import '../styles/add-task-modal.css';
import { makeId, todayISO } from '../utils/dateTime';
import { validateYouTubeUrl } from '../utils/youtube';

const DEFAULT_PRIORITY = 'Medium';
const DEFAULT_CATEGORY = 'Work';
const DEFAULT_TASK_TYPE = 'standard';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TASK_TYPES = [
  { value: 'standard', label: 'Standard Task' },
  { value: 'youtube', label: 'YouTube Task' },
];

function FieldIcon({ name }) {
  const common = {
    className: 'add-task-modal__field-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'task-type':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1" />
          <rect x="3" y="14" width="18" height="6" rx="1" />
        </svg>
      );
    case 'category':
      return (
        <svg {...common}>
          <path d="M20.59 13.41 13.42 20.59a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" />
          <circle cx="7.5" cy="7.5" r="1.2" />
        </svg>
      );
    case 'priority':
      return (
        <svg {...common}>
          <path d="M4 21V4M4 4l13 4-6 3 6 3-13 1" />
        </svg>
      );
    case 'due-date':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      );
    case 'time':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}

function initialFieldState() {
  return {
    title: '',
    description: '',
    taskType: DEFAULT_TASK_TYPE,
    priority: DEFAULT_PRIORITY,
    category: DEFAULT_CATEGORY,
    time: '',
    dueDate: todayISO(),
    youtubeUrl: '',
  };
}

export default function AddTaskModal({ open, onAdd, onClose }) {
  const [fields, setFields] = useState(initialFieldState);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const titleId = useId();

  // Focus management: on open, save the trigger and focus the title.
  // State resets are deferred (rAF) to avoid synchronous setState in the
  // effect body, which keeps the modal's internal state fresh each open.
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement;
      // Defer focus + reset to after paint.
      const id = window.requestAnimationFrame(() => {
        setHasUserEdited(false);
        setConfirmDiscardOpen(false);
        titleRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(id);
    }
    return undefined;
  }, [open]);

  // Restore focus to the triggering element when the modal closes.
  useEffect(() => {
    if (!open) {
      const el = previouslyFocusedRef.current;
      if (el && typeof el.focus === 'function') {
        el.focus();
      }
      previouslyFocusedRef.current = null;
    }
  }, [open]);

  // Escape key listener while open.
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        requestClose();
      } else if (e.key === 'Tab') {
        trapTab(e);
      }
    }
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasUserEdited, confirmDiscardOpen]);

  function trapTab(e) {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !dialog.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function markEdited() {
    if (!hasUserEdited) setHasUserEdited(true);
  }

  function updateField(key, value) {
    setFields((prev) => ({ ...prev, [key]: value }));
    markEdited();
  }

  function resetFields() {
    setFields(initialFieldState());
    setHasUserEdited(false);
    setUrlError(false);
    setConfirmDiscardOpen(false);
  }

  function requestClose() {
    if (confirmDiscardOpen) {
      // While the discard confirmation is open, treat any close request as
      // "cancel the confirmation" first — the user must explicitly Discard.
      return;
    }
    if (hasUserEdited) {
      setConfirmDiscardOpen(true);
    } else {
      onClose?.();
    }
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
    titleRef.current?.focus();
  }

  function handleDiscard() {
    resetFields();
    onClose?.();
  }

  function handleOverlayClick(e) {
    // Overlay click never closes while dirty. While the discard confirmation
    // is open, also ignore.
    if (hasUserEdited || confirmDiscardOpen) return;
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  }

  function handleCancelClick() {
    requestClose();
  }

  function clearTime() {
    updateField('time', '');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedTitle = fields.title.trim();
    if (!trimmedTitle) return;

    if (fields.taskType === 'youtube') {
      const urlCheck = validateYouTubeUrl(fields.youtubeUrl);
      if (!urlCheck.valid) {
        setUrlError(true);
        return;
      }
      setUrlError(false);
    }

    const trimmedDesc = fields.description.trim();
    onAdd({
      id: makeId('task'),
      title: trimmedTitle,
      description: trimmedDesc,
      taskType: fields.taskType,
      youtubeUrl:
        fields.taskType === 'youtube'
          ? validateYouTubeUrl(fields.youtubeUrl).url
          : '',
      youtubeNotes: '',
      completed: false,
      priority: fields.priority,
      category: fields.category,
      time: fields.time || null,
      dueDate: fields.dueDate || null,
    });
    resetFields();
    onClose?.();
  }

  if (!open) return null;

  const canSubmit = fields.title.trim().length > 0;

  return (
    <div
      className="add-task-modal__overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className="add-task-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="add-task-modal__header">
          <h2 id={titleId} className="add-task-modal__title">
            Add Task
          </h2>
          <button
            type="button"
            className="add-task-modal__close"
            aria-label="Close"
            onClick={handleCancelClick}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="add-task-modal__form" onSubmit={handleSubmit}>
          <label className="add-task-modal__field add-task-modal__field--full">
            <span className="add-task-modal__label">Task title</span>
            <input
              ref={titleRef}
              type="text"
              className="add-task-modal__input"
              placeholder="What do you need to do?"
              value={fields.title}
              onChange={(e) => updateField('title', e.target.value)}
              aria-label="Task title"
            />
          </label>

          <label className="add-task-modal__field add-task-modal__field--full">
            <span className="add-task-modal__label">Description</span>
            <textarea
              className="add-task-modal__textarea"
              rows={3}
              value={fields.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Add details..."
            />
          </label>

          <div className="add-task-modal__grid">
            <label className="add-task-modal__field">
              <span className="add-task-modal__label">
                <FieldIcon name="task-type" />
                Task Type
              </span>
              <select
                value={fields.taskType}
                onChange={(e) => {
                  updateField('taskType', e.target.value);
                  setUrlError(false);
                }}
              >
                {TASK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="add-task-modal__field">
              <span className="add-task-modal__label">
                <FieldIcon name="category" />
                Category
              </span>
              <select
                value={fields.category}
                onChange={(e) => updateField('category', e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="add-task-modal__field">
              <span className="add-task-modal__label">
                <FieldIcon name="priority" />
                Priority
              </span>
              <select
                value={fields.priority}
                onChange={(e) => updateField('priority', e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="add-task-modal__field">
              <span className="add-task-modal__label">
                <FieldIcon name="due-date" />
                Due date
              </span>
              <input
                type="date"
                value={fields.dueDate}
                onChange={(e) => updateField('dueDate', e.target.value)}
              />
            </label>

            <label className="add-task-modal__field">
              <span className="add-task-modal__label">
                <FieldIcon name="time" />
                Time
              </span>
              <div className="add-task-modal__time-row">
                <input
                  type="time"
                  value={fields.time}
                  onChange={(e) => updateField('time', e.target.value)}
                />
                <button
                  type="button"
                  className="add-task-modal__any-time"
                  onClick={clearTime}
                  disabled={!fields.time}
                >
                  Any time
                </button>
              </div>
            </label>
          </div>

          {fields.taskType === 'youtube' && (
            <label className="add-task-modal__field add-task-modal__field--full">
              <span className="add-task-modal__label">
                YouTube video URL (optional)
              </span>
              <input
                type="text"
                className={urlError ? 'add-task-modal__input--error' : ''}
                value={fields.youtubeUrl}
                onChange={(e) => {
                  updateField('youtubeUrl', e.target.value);
                  setUrlError(false);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-label="YouTube video URL"
                aria-describedby={
                  urlError ? 'add-task-modal__url-error' : undefined
                }
              />
              {urlError && (
                <span
                  id="add-task-modal__url-error"
                  className="add-task-modal__error"
                  role="alert"
                >
                  Enter a valid YouTube URL or leave this blank.
                </span>
              )}
            </label>
          )}

          {confirmDiscardOpen && (
            <div className="add-task-modal__confirm" role="alertdialog">
              <div className="add-task-modal__confirm-text">
                Discard changes?
              </div>
              <div className="add-task-modal__confirm-actions">
                <button
                  type="button"
                  className="add-task-modal__confirm-keep"
                  onClick={handleKeepEditing}
                >
                  Keep editing
                </button>
                <button
                  type="button"
                  className="add-task-modal__confirm-discard"
                  onClick={handleDiscard}
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          <div className="add-task-modal__defaults" role="note">
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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="add-task-modal__defaults-text">
              <span className="add-task-modal__defaults-label">Defaults</span>
              <span className="add-task-modal__defaults-value">
                Today + Any time + Medium + Work + Standard Task
              </span>
            </span>
          </div>

          <div className="add-task-modal__footer">
            <button
              type="button"
              className="add-task-modal__cancel"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-task-modal__submit"
              disabled={!canSubmit}
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
