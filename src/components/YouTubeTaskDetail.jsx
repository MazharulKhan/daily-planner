import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import '../styles/task-detail.css';
import { parseYouTubeVideoId, formatSeconds, validateYouTubeUrl, parseTimestampNotes } from '../utils/youtube';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import { useTaskPlaybackPersistence } from '../hooks/useTaskPlaybackPersistence';
import { deriveChangedFields, getErrorMessage } from '../utils/taskCloud';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TASK_TYPES = [
  { value: 'standard', label: 'Standard Task' },
  { value: 'youtube', label: 'YouTube Task' },
];

const CONTENT_FIELDS = [
  'title', 'description', 'taskType', 'youtubeUrl', 'youtubeNotes',
  'priority', 'category', 'dueDate', 'time',
];

function taskDraft(task) {
  return {
    title: task.title || '',
    description: task.description || '',
    taskType: task.taskType || 'youtube',
    youtubeUrl: task.youtubeUrl || '',
    youtubeNotes: task.youtubeNotes || '',
    priority: task.priority || 'Medium',
    category: task.category || 'Work',
    dueDate: task.dueDate || null,
    time: task.time || null,
    completed: Boolean(task.completed),
  };
}

export default function YouTubeTaskDetail({
  task,
  originView,
  pendingNavTarget,
  onConfirmNavigation,
  onCancelNavigation,
  onSaveTask,
  onDeleteTask,
  onSavePlayback,
  onPlaybackError,
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
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cloudError, setCloudError] = useState('');
  const [baseline, setBaseline] = useState(() => taskDraft(task));
  const [lastTaskSnapshot, setLastTaskSnapshot] = useState(task);

  const titleRef = useRef(null);
  const keepEditingRef = useRef(null);
  const cancelDeleteRef = useRef(null);
  const notesRef = useRef(null);
  const notesFocusedRef = useRef(false);
  const isDirty = (() => {
    if (title.trim() !== baseline.title.trim()) return true;
    if (description !== baseline.description) return true;
    if (taskType !== baseline.taskType) return true;
    if (youtubeUrl !== baseline.youtubeUrl) return true;
    if (youtubeNotes !== baseline.youtubeNotes) return true;
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
      setYoutubeUrl(next.youtubeUrl);
      setYoutubeNotes(next.youtubeNotes);
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

    const draft = {
      title: trimmedTitle,
      description,
      taskType,
      youtubeUrl: urlCheck.url,
      youtubeNotes,
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
    youtubeUrl,
    youtubeNotes,
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

  const playbackPersistence = useTaskPlaybackPersistence({
    taskId: task.id,
    initialSeconds: task.lastWatchedSeconds || 0,
    onSavePlayback,
    onImmediateError: onPlaybackError,
  });

  const { playerRef, positionRef, seekAndPlay } = useYouTubePlayer({
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
      playbackPersistence.onPositionChange(seconds);
    },
    onPaused: (seconds) => {
      playbackPersistence.onPaused(seconds);
    },
    onEnded: () => {
      playbackPersistence.onEnded();
    },
    onLeave: (seconds) => {
      playbackPersistence.onLeave(seconds);
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

  const insertTimestampEnabled = !!savedVideoId && !playerError;
  const timestampClickEnabled = insertTimestampEnabled;

  const previewSegments = useMemo(
    () => parseTimestampNotes(youtubeNotes),
    [youtubeNotes],
  );

  const handleTimestampClick = useCallback(
    (seconds) => {
      if (!timestampClickEnabled) return;
      try {
        seekAndPlay(seconds);
      } catch {
        /* ignore seek errors */
      }
    },
    [seekAndPlay, timestampClickEnabled],
  );

  const handleNotesKeyDown = useCallback(
    (e) => {
      if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      const textarea = notesRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? 0;
      if (start !== end) return;

      const value = youtubeNotes;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.slice(lineStart, start);

      if (!currentLine.startsWith('-')) {
        return;
      }

      const afterDash = currentLine.slice(1);

      if (afterDash.trim().length === 0) {
        e.preventDefault();
        const next = value.slice(0, lineStart) + value.slice(start);
        setYoutubeNotes(next);
        requestAnimationFrame(() => {
          if (textarea) {
            textarea.focus();
            try {
              textarea.setSelectionRange(lineStart, lineStart);
            } catch {
              /* ignore */
            }
          }
        });
        return;
      }

      e.preventDefault();
      const insertText = '\n- ';
      const next =
        value.slice(0, start) + insertText + value.slice(end);
      setYoutubeNotes(next);
      const caret = start + insertText.length;
      requestAnimationFrame(() => {
        if (textarea) {
          textarea.focus();
          try {
            textarea.setSelectionRange(caret, caret);
          } catch {
            /* ignore */
          }
        }
      });
    },
    [youtubeNotes],
  );

  const handleInsertTimestamp = useCallback(() => {
    let currentSeconds = NaN;
    try {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === 'function') {
        currentSeconds = player.getCurrentTime();
      }
    } catch {
      currentSeconds = NaN;
    }

    if (!Number.isFinite(currentSeconds)) {
      const fallback = positionRef.current;
      if (typeof fallback === 'number' && Number.isFinite(fallback)) {
        currentSeconds = fallback;
      }
    }

    if (!Number.isFinite(currentSeconds)) {
      return;
    }

    const token = `[${formatSeconds(currentSeconds)}] `;
    const textarea = notesRef.current;
    let start;
    let end;
    if (textarea && notesFocusedRef.current) {
      start = textarea.selectionStart ?? 0;
      end = textarea.selectionEnd ?? 0;
    } else {
      start = youtubeNotes.length;
      end = youtubeNotes.length;
    }

    const atLineStart = start === 0 || youtubeNotes[start - 1] === '\n';
    const prefix = atLineStart ? '' : '\n';
    const insertText = prefix + token;
    const next = youtubeNotes.slice(0, start) + insertText + youtubeNotes.slice(end);
    setYoutubeNotes(next);

    const caret = start + insertText.length;
    requestAnimationFrame(() => {
      if (textarea) {
        textarea.focus();
        try {
          textarea.setSelectionRange(caret, caret);
        } catch {
          /* ignore */
        }
      }
    });
  }, [playerRef, positionRef, youtubeNotes]);

  return (
    <div className="task-detail task-detail--youtube">
      <div className="task-detail__header">
        <button type="button" className="task-detail__back" onClick={handleBack} disabled={isSaving || isDeleting}>
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
          <button type="button" className="task-detail__save" onClick={handleSave} disabled={isSaving || isDeleting}>
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
            <div className="youtube-detail__notes-header">
              <label className="task-detail__label" htmlFor={`youtube-task-notes-${task.id}`}>
                YouTube Notes
              </label>
              <button
                type="button"
                className="youtube-detail__insert-timestamp"
                onClick={handleInsertTimestamp}
                disabled={!insertTimestampEnabled}
                aria-label="Insert current video timestamp into notes"
              >
                Insert Timestamp
              </button>
            </div>
            <textarea
              ref={notesRef}
              id={`youtube-task-notes-${task.id}`}
              className="youtube-detail__notes"
              value={youtubeNotes}
              onChange={(e) => setYoutubeNotes(e.target.value)}
              onFocus={() => {
                notesFocusedRef.current = true;
              }}
              onKeyDown={handleNotesKeyDown}
              placeholder="Add YouTube notes..."
            />
            <div
              className="youtube-detail__preview"
              role="region"
              aria-label="Clickable timestamp preview"
            >
              <div className="youtube-detail__preview-heading">
                <span>Clickable Preview</span>
                <button
                  type="button"
                  className="youtube-detail__preview-toggle"
                  onClick={() => setPreviewCollapsed((prev) => !prev)}
                  aria-label={previewCollapsed ? 'Expand clickable preview' : 'Collapse clickable preview'}
                  aria-expanded={!previewCollapsed}
                >
                  {previewCollapsed ? 'Show' : 'Hide'}
                </button>
              </div>
              {!previewCollapsed &&
                (previewSegments.length === 0 ? (
                  <p className="youtube-detail__preview-empty">
                    Timestamped notes will appear here.
                  </p>
                ) : (
                  <div className="youtube-detail__preview-body">
                    {previewSegments.map((segment, index) => {
                      if (segment.type === 'timestamp') {
                        return (
                          <button
                            key={`ts-${index}`}
                            type="button"
                            className="youtube-detail__preview-chip"
                            onClick={() => handleTimestampClick(segment.seconds)}
                            disabled={!timestampClickEnabled}
                            aria-label={`Seek video to ${segment.label} and play`}
                          >
                            {segment.label}
                          </button>
                        );
                      }
                      return (
                        <span key={`txt-${index}`} className="youtube-detail__preview-text">
                          {segment.value}
                        </span>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>

      <div className="task-detail__footer">
        <button type="button" className="task-detail__cancel" onClick={handleBack} disabled={isSaving || isDeleting}>
          Cancel
        </button>
        <button type="button" className="task-detail__save" onClick={handleSave} disabled={isSaving || isDeleting}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
