import '../styles/cards.css';
import '../styles/ideas.css';
import IdeaRow from './IdeaRow';
import AddIdeaForm from './AddIdeaForm';
import EmptyState from './EmptyState';
import { TaskSurfacePlaceholder } from './TaskCloudStatus';

export default function QuickIdeasCard({
  ideas,
  onAdd,
  addOpen,
  onRequestAdd,
  onCloseAdd,
  onOpenWorkspace,
  hasServerSnapshot,
  status,
  listenerError,
  canMutate,
  onRetry,
  onSignOut,
}) {
  const newest = [...ideas]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Quick Ideas</h2>
          <span className="card__count">{hasServerSnapshot ? ideas.length : '—'}</span>
        </div>
        <button
          type="button"
          className="card__header-action"
          aria-label="Add a quick idea"
          onClick={onRequestAdd}
          disabled={!canMutate}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="card__body">
        <AddIdeaForm
          open={addOpen}
          onAdd={onAdd}
          onClose={onCloseAdd}
          onRequestOpen={onRequestAdd}
          disabled={!canMutate}
        />

        {!hasServerSnapshot && !listenerError ? (
          <TaskSurfacePlaceholder message="Loading your cloud Quick Ideas..." />
        ) : !hasServerSnapshot && listenerError ? (
          <div className="idea-cloud-state idea-cloud-state--error" role="alert">
            <p>Cloud Quick Ideas could not be loaded.</p>
            <div className="idea-cloud-state__actions">
              <button type="button" onClick={onRetry}>Retry Quick Ideas</button>
              <button type="button" onClick={() => onSignOut()}>Sign out</button>
            </div>
          </div>
        ) : ideas.length === 0 ? (
          <EmptyState
            title="No ideas captured yet"
            hint="Jot down a thought — it stays here for later."
            actionLabel="+ Capture your first idea"
            onAction={onRequestAdd}
          />
        ) : (
          <div className="idea-list">
            {newest.map((idea) => (
              <IdeaRow
                key={idea.id}
                idea={idea}
                onOpen={() => onOpenWorkspace?.(idea.id)}
              />
            ))}
          </div>
        )}

        {hasServerSnapshot && listenerError && (
          <div className="idea-cloud-state idea-cloud-state--degraded" role="alert">
            <span>
              {status === 'listener-error'
                ? 'Quick Ideas are reconnecting. Showing the last confirmed list.'
                : 'Quick Ideas cloud data is temporarily unavailable.'}
            </span>
            <button type="button" onClick={onRetry}>Retry Quick Ideas</button>
          </div>
        )}

        <div className="ideas__footer">
          <button
            type="button"
            className="card__view-all"
            onClick={() => onOpenWorkspace?.(null)}
          >
            View all Quick Ideas
          </button>
        </div>
      </div>
    </div>
  );
}
