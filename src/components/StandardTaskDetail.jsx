import { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/task-detail.css';
import { deriveChangedFields, getErrorMessage } from '../utils/taskCloud';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TASK_TYPES = [
  { value: 'standard', label: 'Standard Task' },
  { value: 'youtube', label: 'YouTube Task' },
];

const CONTENT_FIELDS = ['title', 'description', 'taskType', 'priority', 'category', 'dueDate', 'time'];

function taskDraft(task) {
  return {
    title: task.title || '',
    description: task.description || '',
    taskType: task.taskType === 'youtube' ? 'youtube' : 'standard',
    priority: task.priority || 'Medium',
    category: task.category || 'Work',
    dueDate: task.dueDate || null,
    time: task.time || null,
    completed: Boolean(task.completed),
  };
}

export default function StandardTaskDetail({
  task,
  originView,
  pendingNavTarget,
  onConfirmNavigation,
  onCancelNavigation,
  onSaveTask,
  onDeleteTask,
}) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [taskType, setTaskType] = useState(
    task.taskType === 'youtube' ? 'youtube' : 'standard',
  );
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [category, setCategory] = useState(task.category || 'Work');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [time, setTime] = useState(task.time || '');
  const [completed, setCompleted] = useState(!!task.completed);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cloudError, setCloudError] = useState('');
  const [baseline, setBaseline] = useState(() => taskDraft(task));
  const [lastTaskSnapshot, setLastTaskSnapshot] = useState(task);

  const titleRef = useRef(null);
  const keepEditingRef = useRef(null);
  const cancelDeleteRef = useRef(null);
  const isDirty = (() => {
    if (title.trim() !== baseline.title.trim()) return true;
    if (description !== baseline.description) return true;
    if (taskType !== baseline.taskType) return true;
    if (priority !== baseline.priority) return true;
    if (category !== baseline.category) return true;
    if ((dueDate || null) !== baseline.dueDate) return true;
    if ((time || null) !== baseline.time) return true;
    if (completed !== baseline.completed) return true;
    return false;
  })();

  if (task !== lastTaskSnapshot) {
    setLastTaskSnapshot(task);
    if (!isDirty) {
      const next = taskDraft(task);
      setBaseline(next);
      setTitle(next.title);
      setDescription(next.description);
      setTaskType(next.taskType);
      setPriority(next.priority);
      setCategory(next.category);
      setDueDate(next.dueDate || '');
      setTime(next.time || '');
      setCompleted(next.completed);
    }
  }

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (pendingNavTarget) {
      if (isDirty) {
        // wait for user decision
      } else {
        onConfirmNavigation(pendingNavTarget);
      }
    }
  }, [pendingNavTarget, isDirty, onConfirmNavigation]);

  const handleSave = useCallback(async () => {
    if (isSaving || isDeleting) return;
    const trimmed = title.trim();
    if (!trimmed) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    setTitleError(false);
    const draft = {
      title: trimmed,
      description,
      taskType,
      priority,
      category,
      dueDate: dueDate || null,
      time: time || null,
    };
    const patch = deriveChangedFields(baseline, draft, CONTENT_FIELDS);
    setIsSaving(true);
    setCloudError('');
    try {
      await onSaveTask(task.id, patch, completed);
      onConfirmNavigation(originView);
    } catch (error) {
      setCloudError(getErrorMessage(
        error,
        'This task could not be saved. Your changes are still here.',
      ));
    } finally {
      setIsSaving(false);
    }
  }, [
    title,
    description,
    taskType,
    priority,
    category,
    dueDate,
    time,
    completed,
    baseline,
    isSaving,
    isDeleting,
    task.id,
    onSaveTask,
    onConfirmNavigation,
    originView,
  ]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      setShowDiscardConfirm(true);
      setShowDeleteConfirm(false);
    } else {
      onConfirmNavigation(originView);
    }
  }, [isDirty, onConfirmNavigation, originView]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    setIsDeleting(true);
    setCloudError('');
    try {
      await onDeleteTask(task.id);
      onConfirmNavigation(originView);
    } catch (error) {
      setCloudError(getErrorMessage(error, 'This task could not be deleted.'));
      setIsDeleting(false);
    }
  }, [onDeleteTask, task.id, onConfirmNavigation, originView]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const discardAndNavigate = useCallback(() => {
    const target = pendingNavTarget || originView;
    setShowDiscardConfirm(false);
    onConfirmNavigation(target);
  }, [pendingNavTarget, onConfirmNavigation, originView]);

  useEffect(() => {
    if (showDeleteConfirm) {
      cancelDeleteRef.current?.focus();
    }
  }, [showDeleteConfirm]);

  useEffect(() => {
    if ((pendingNavTarget || showDiscardConfirm) && isDirty) {
      keepEditingRef.current?.focus();
    }
  }, [pendingNavTarget, showDiscardConfirm, isDirty]);

  const dueDateValue = dueDate || '';
  const timeValue = time || '';
  const showTaskTypeMessage =
    (task.taskType || 'standard') === 'standard' && taskType === 'youtube';

  return (
    <div className="task-detail">
      <div className="task-detail__header">
        <button
          type="button"
          className="task-detail__back"
          onClick={handleBack}
          disabled={isSaving || isDeleting}
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="task-detail__header-actions">
          <button
            type="button"
            className="task-detail__delete"
            onClick={handleDeleteClick}
            disabled={isSaving || isDeleting}
          >
            Delete Task
          </button>
          <button
            type="button"
            className="task-detail__save"
            onClick={handleSave}
            disabled={isSaving || isDeleting}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          className="task-detail__confirm-banner task-detail__confirm-banner--danger"
          role="alertdialog"
          aria-label="Delete confirmation"
        >
          <span>Delete this task permanently?</span>
          <div className="task-detail__confirm-actions">
            <button
              type="button"
              className="task-delete__confirm"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button
              ref={cancelDeleteRef}
              type="button"
              className="task-delete__cancel"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cloudError && <div className="task-detail__cloud-error" role="alert">{cloudError}</div>}

      {(pendingNavTarget || showDiscardConfirm) && isDirty && !showDeleteConfirm && (
        <div
          className="task-detail__confirm-banner task-detail__confirm-banner--warn"
          role="alertdialog"
          aria-label="Unsaved changes"
        >
          <span>Discard unsaved changes?</span>
          <div className="task-detail__confirm-actions">
            <button
              type="button"
              className="task-delete__confirm"
              onClick={discardAndNavigate}
            >
              Discard Changes
            </button>
            <button
              ref={keepEditingRef}
              type="button"
              className="task-delete__cancel"
              onClick={() => {
                setShowDiscardConfirm(false);
                onCancelNavigation();
              }}
            >
              Keep Editing
            </button>
          </div>
        </div>
      )}

      <form
        className="task-detail__form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="task-detail__title-row">
          <input
            id={`task-detail-checkbox-${task.id}`}
            type="checkbox"
            className="task-detail__checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <label htmlFor={`task-detail-checkbox-${task.id}`} className="sr-only">
            Mark as {completed ? 'incomplete' : 'complete'}
          </label>
          <input
            ref={titleRef}
            type="text"
            className="task-detail__title-input"
            placeholder="Task title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(false);
            }}
            aria-label="Task title"
          />
        </div>

        {titleError && (
          <span className="task-detail__validation">
            Task title is required.
          </span>
        )}

        <div className="task-detail__meta">
          <span>
            {completed ? 'Completed' : 'Incomplete'}
          </span>
          <span>·</span>
          <span>
            Last updated {new Date(task.updatedAt).toLocaleString()}
          </span>
        </div>

        <div className="task-detail__divider" />

        {showTaskTypeMessage && (
          <div className="task-detail__helper">
            Save changes to use the YouTube Task workspace.
          </div>
        )}

        <div>
          <label className="task-detail__label" htmlFor={`task-detail-desc-${task.id}`}>
            Description
          </label>
          <textarea
            id={`task-detail-desc-${task.id}`}
            className="task-detail__description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
          />
        </div>

        <div className="task-detail__grid">
          <div className="task-detail__field">
            <label htmlFor={`task-detail-type-${task.id}`}>Task Type</label>
            <select
              id={`task-detail-type-${task.id}`}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              {TASK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="task-detail__field">
            <label htmlFor={`task-detail-priority-${task.id}`}>Priority</label>
            <select
              id={`task-detail-priority-${task.id}`}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="task-detail__field">
            <label htmlFor={`task-detail-due-${task.id}`}>Due date</label>
            <input
              id={`task-detail-due-${task.id}`}
              type="date"
              value={dueDateValue}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="task-detail__field">
            <label htmlFor={`task-detail-category-${task.id}`}>Category</label>
            <select
              id={`task-detail-category-${task.id}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="task-detail__field">
            <label htmlFor={`task-detail-time-${task.id}`}>Time</label>
            <input
              id={`task-detail-time-${task.id}`}
              type="time"
              value={timeValue}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      </form>

      <div className="task-detail__footer">
        <button
          type="button"
          className="task-detail__cancel"
          onClick={handleBack}
          disabled={isSaving || isDeleting}
        >
          Cancel
        </button>
        <button
          type="button"
          className="task-detail__save"
          onClick={handleSave}
          disabled={isSaving || isDeleting}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
