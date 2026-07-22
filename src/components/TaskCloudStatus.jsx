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
  status,
  isConfirmedEmpty,
  listenerError,
  notices,
  onRetry,
  onSignOut,
  onDismissNotice,
}) {
  let liveMessage = '';
  if (status === 'initial-loading') liveMessage = 'Loading your cloud tasks...';
  if (status === 'offline') liveMessage = "You're offline. Task changes will sync when the connection returns.";
  if (status === 'reconnecting') liveMessage = 'Reconnecting to task cloud sync...';
  if (status === 'ready' && isConfirmedEmpty) {
    liveMessage = 'Your cloud task list starts empty. Tasks from the local edition were not imported.';
  }

  return (
    <div className="cloud-status">
      {liveMessage && (
        <div className={`cloud-status__notice cloud-status__notice--${status}`} aria-live="polite">
          {liveMessage}
        </div>
      )}

      {listenerError && (
        <div className="cloud-status__alert" role="alert">
          <span>
            Cloud tasks could not be loaded.
            {listenerError.code?.includes('permission-denied')
              ? ` ${listenerError.userMessage}`
              : ''}
          </span>
          <div className="cloud-status__actions">
            <button type="button" onClick={onRetry}>Retry</button>
            <button type="button" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      )}

      {notices.map((notice) => (
        <div className="cloud-status__alert" role="alert" key={notice.id}>
          <span>{notice.message}</span>
          <button
            type="button"
            className="cloud-status__dismiss"
            aria-label="Dismiss task sync message"
            onClick={() => onDismissNotice(notice.id)}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
