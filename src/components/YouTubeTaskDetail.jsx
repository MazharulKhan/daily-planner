import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import '../styles/task-detail.css';
import { parseYouTubeVideoId, formatSeconds, validateYouTubeUrl } from '../utils/youtube';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TASK_TYPES = [
  { value: 'standard', label: 'Standard Task' },
  { value: 'youtube', label: 'YouTube Task' },
];

export default function YouTubeTaskDetail({
  task,
  originView,
  pendingNavTarget,
  onConfirmNavigation,
  onCancelNavigation,
  onEditTask,
  onDeleteTask,
  onEditPlaybackPosition,
}) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [taskType, setTaskType] = useState('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState(task.youtubeUrl || '');
  const [youtubeNotes, setYoutubeNotes] = useState(task.youtubeNotes || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [category, setCategory] = useState(task.category || 'Work');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [time, setTime] = useState(task.time || '');
  const [completed, setCompleted] = useState(!!task.completed);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const [duration, setDuration] = useState(0);

  const titleRef = useRef(null);
  const keepEditingRef = useRef(null);
  const cancelDeleteRef = useRef(null);

  const isDirty = (() => {
    if (title.trim() !== (task.title || '').trim()) return true;
    if (description !== (task.description || '')) return true;
    if (taskType !== (task.taskType || 'youtube')) return true;
    if (youtubeUrl !== (task.youtubeUrl || '')) return true;
    if (youtubeNotes !== (task.youtubeNotes || '')) return true;
    if (priority !== (task.priority || 'Medium')) return true;
    if (category !== (task.category || 'Work')) return true;
    if ((dueDate || '') !== (task.dueDate || '')) return true;
    if ((time || '') !== (task.time || '')) return true;
    if (completed !== !!task.completed) return true;
    return false;
  })();

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

  const handleSave = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }

    const urlCheck = validateYouTubeUrl(youtubeUrl);
    if (!urlCheck.valid) {
      setUrlError(true);
      return;
    }

    setTitleError(false);
    setUrlError(false);

    const patch = {
      title: trimmedTitle,
      description: description.trim(),
      taskType,
      youtubeUrl: urlCheck.url,
      youtubeNotes,
      priority,
      category,
      dueDate: dueDate || null,
      time: time || null,
      completed,
    };

    if (
      urlCheck.url.trim() !== (task.youtubeUrl || '').trim() &&
      urlCheck.url.trim() !== ''
    ) {
      patch.lastWatchedSeconds = 0;
    }

    if (!task.completed && completed) {
      patch.completedAt = new Date().toISOString();
    } else if (task.completed && !completed) {
      patch.completedAt = null;
    }

    onEditTask(task.id, patch);
    onConfirmNavigation(originView);
  }, [
    title,
    description,
    taskType,
    youtubeUrl,
    youtubeNotes,
    priority,
    category,
    dueDate,
    time,
    completed,
    task.id,
    task.completed,
    task.youtubeUrl,
    onEditTask,
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

  const confirmDelete = useCallback(() => {
    onDeleteTask(task.id);
    onConfirmNavigation(originView);
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
  const savedUrl = validateYouTubeUrl(task.youtubeUrl || '');
  const hasOpenVideoLink = savedUrl.valid && savedUrl.url;
  const showTaskTypeMessage = task.taskType === 'youtube' && taskType === 'standard';

  const containerId = `youtube-player-${task.id}`;
  const savedVideoId = useMemo(
    () => (savedUrl.valid ? parseYouTubeVideoId(savedUrl.url) : null),
    [savedUrl.valid, savedUrl.url],
  );

  const urlDraftChanged =
    (youtubeUrl || '').trim() !== (task.youtubeUrl || '').trim();

  const meaningfulResume =
    typeof task.lastWatchedSeconds === 'number' &&
    Number.isFinite(task.lastWatchedSeconds) &&
    task.lastWatchedSeconds >= 5 &&
    !urlDraftChanged &&
    (duration <= 0 || task.lastWatchedSeconds < duration - 3);

  const persistPosition = useCallback(
    (seconds) => {
      if (onEditPlaybackPosition) {
        onEditPlaybackPosition(task.id, seconds);
      }
    },
    [onEditPlaybackPosition, task.id],
  );

  const { seekAndPlay } = useYouTubePlayer({
    containerId,
    videoId: savedVideoId,
    enabled: !!savedVideoId,
    startSeconds: typeof task.lastWatchedSeconds === 'number' ? task.lastWatchedSeconds : 0,
    onReady: (target) => {
      try {
        const d = target.getDuration();
        if (typeof d === 'number' && Number.isFinite(d)) {
          setDuration(d);
        }
      } catch {
        /* ignore */
      }
      setPlayerError(false);
    },
    onPositionChange: (seconds) => {
      persistPosition(seconds);
    },
    onPaused: (seconds) => {
      persistPosition(seconds);
    },
    onEnded: () => {
      persistPosition(0);
    },
    onLeave: (seconds) => {
      persistPosition(seconds);
    },
    onError: () => {
      setPlayerError(true);
    },
  });

  const handleResume = useCallback(() => {
    const seconds = typeof task.lastWatchedSeconds === 'number' ? task.lastWatchedSeconds : 0;
    if (seconds >= 5) {
      seekAndPlay(seconds);
    }
  }, [task.lastWatchedSeconds, seekAndPlay]);

  return (
    <div className="task-detail task-detail--youtube">
      <div className="task-detail__header">
        <button type="button" className="task-detail__back" onClick={handleBack}>
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
          >
            Delete Task
          </button>
          <button type="button" className="task-detail__save" onClick={handleSave}>
            Save Changes
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
            >
              Confirm Delete
            </button>
            <button
              ref={cancelDeleteRef}
              type="button"
              className="task-delete__cancel"
              onClick={cancelDelete}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
          <span className="task-detail__validation">Task title is required.</span>
        )}

        <div className="task-detail__meta">
          <span>{completed ? 'Completed' : 'Incomplete'}</span>
          <span>-</span>
          <span>Last updated {new Date(task.updatedAt).toLocaleString()}</span>
        </div>

        <div className="task-detail__divider" />

        {showTaskTypeMessage && (
          <div className="task-detail__helper">
            Save changes to use the Standard Task workspace.
          </div>
        )}

        <div>
          <label className="task-detail__label" htmlFor={`youtube-task-desc-${task.id}`}>
            Description
          </label>
          <textarea
            id={`youtube-task-desc-${task.id}`}
            className="task-detail__description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details..."
          />
        </div>

        <div className="youtube-detail__workspace">
          <div className="youtube-detail__column">
            <div className="task-detail__field">
              <label htmlFor={`youtube-task-url-${task.id}`}>YouTube video URL</label>
              <input
                id={`youtube-task-url-${task.id}`}
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setUrlError(false);
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-describedby={
                  urlError ? `youtube-task-url-error-${task.id}` : undefined
                }
              />
              {urlError && (
                <span
                  id={`youtube-task-url-error-${task.id}`}
                  className="task-detail__validation"
                >
                  Enter a valid YouTube URL or leave this blank.
                </span>
              )}
            </div>

            {savedVideoId && (
              <div className="youtube-detail__video-card">
                {playerError ? (
                  <div className="youtube-detail__player-error">
                    <p className="youtube-detail__player-error-text">
                      This video can't be played here.
                    </p>
                  </div>
                ) : (
                  <div className="youtube-detail__player-wrapper">
                    <div id={containerId} className="youtube-detail__player-frame" />
                  </div>
                )}

                {!playerError && meaningfulResume && (
                  <button
                    type="button"
                    className="youtube-detail__resume"
                    onClick={handleResume}
                  >
                    Resume from {formatSeconds(task.lastWatchedSeconds)}
                  </button>
                )}
              </div>
            )}

            {hasOpenVideoLink && (
              <a
                className="youtube-detail__open-link"
                href={savedUrl.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open video
              </a>
            )}

            <div className="task-detail__grid youtube-detail__meta-grid">
              <div className="task-detail__field">
                <label htmlFor={`youtube-task-type-${task.id}`}>Task Type</label>
                <select
                  id={`youtube-task-type-${task.id}`}
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
                <label htmlFor={`youtube-task-priority-${task.id}`}>Priority</label>
                <select
                  id={`youtube-task-priority-${task.id}`}
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
                <label htmlFor={`youtube-task-category-${task.id}`}>Category</label>
                <select
                  id={`youtube-task-category-${task.id}`}
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
                <label htmlFor={`youtube-task-due-${task.id}`}>Due Date</label>
                <input
                  id={`youtube-task-due-${task.id}`}
                  type="date"
                  value={dueDateValue}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="task-detail__field">
                <label htmlFor={`youtube-task-time-${task.id}`}>Time</label>
                <input
                  id={`youtube-task-time-${task.id}`}
                  type="time"
                  value={timeValue}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="task-detail__field">
                <label htmlFor={`youtube-task-complete-${task.id}`}>Completion</label>
                <div className="youtube-detail__completion">
                  <input
                    id={`youtube-task-complete-${task.id}`}
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                  />
                  <span>{completed ? 'Completed' : 'Incomplete'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="youtube-detail__column">
            <label className="task-detail__label" htmlFor={`youtube-task-notes-${task.id}`}>
              YouTube Notes
            </label>
            <textarea
              id={`youtube-task-notes-${task.id}`}
              className="youtube-detail__notes"
              value={youtubeNotes}
              onChange={(e) => setYoutubeNotes(e.target.value)}
              placeholder="Add YouTube notes..."
            />
          </div>
        </div>
      </form>

      <div className="task-detail__footer">
        <button type="button" className="task-detail__cancel" onClick={handleBack}>
          Cancel
        </button>
        <button type="button" className="task-detail__save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
