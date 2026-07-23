import '../styles/cloud-sync.css';

export function TaskSurfacePlaceholder({ message = 'Loading your cloud tasks...' }) {
  return (
    <div className="cloud-placeholder" aria-hidden="true">
      <span className="cloud-placeholder__pulse" />
      <span>{message}</span>
    </div>
  );
}

export default function TaskCloudStatus({
  globalStatus,
  taskListenerError,
  taskNotices,
  ideaNotices,
  onRetryTasks,
  onSignOut,
  onDismissTaskNotice,
  onDismissIdeaNotice,
}) {
  let liveMessage = '';
  if (globalStatus === 'offline') {
    liveMessage = "You're offline. Changes made in this tab will sync when the connection returns.";
  }
  if (globalStatus === 'reconnecting') liveMessage = 'Reconnecting to your cloud workspace...';
  if (globalStatus === 'cloud-issue') liveMessage = 'Some cloud data is unavailable. Retry the affected section.';

  const notices = [
    ...taskNotices.map((notice) => ({ ...notice, stream: 'task' })),
    ...ideaNotices.map((notice) => ({ ...notice, stream: 'idea' })),
  ];

  return (
    <div className="cloud-status">
      {liveMessage && (
        <div
          className={`cloud-status__notice cloud-status__notice--${globalStatus}`}
          aria-live="polite"
        >
          {liveMessage}
        </div>
      )}

      {taskListenerError && (
        <div className="cloud-status__alert" role="alert">
          <span>
            Cloud tasks could not be loaded.
            {taskListenerError.code?.includes('permission-denied')
              ? ` ${taskListenerError.userMessage}`
              : ''}
          </span>
          <div className="cloud-status__actions">
            <button type="button" onClick={onRetryTasks}>Retry tasks</button>
            <button type="button" onClick={() => onSignOut()}>Sign out</button>
          </div>
        </div>
      )}

      {notices.map((notice) => (
        <div className="cloud-status__alert" role="alert" key={notice.id}>
          <span>{notice.message}</span>
          <button
            type="button"
            className="cloud-status__dismiss"
            aria-label={`Dismiss ${notice.stream} sync message`}
            onClick={() => (
              notice.stream === 'task'
                ? onDismissTaskNotice(notice.id)
                : onDismissIdeaNotice(notice.id)
            )}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
