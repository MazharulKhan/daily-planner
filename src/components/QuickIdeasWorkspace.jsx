import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/quick-ideas-workspace.css';
import { getIdeaErrorMessage, resolveIdeaNotesDraft } from '../utils/ideaCloud';
import EmptyState from './EmptyState';
import WorkspaceIdeaItem from './WorkspaceIdeaItem';
import { TaskSurfacePlaceholder } from './TaskCloudStatus';

export default function QuickIdeasWorkspace({
  ideas,
  onAdd,
  onEditIdea,
  onDeleteIdea,
  selectedIdeaId,
  hasServerSnapshot,
  status,
  listenerError,
  canMutate,
  onRetry,
  onSignOut,
  onRemoteDeletion,
  onActiveIdeaRemoved,
}) {
  const selectedIdeaOnMount = selectedIdeaId
    ? ideas.find((idea) => idea.id === selectedIdeaId) || null
    : null;
  const [text, setText] = useState('');
  const [capturePending, setCapturePending] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const [expandedId, setExpandedId] = useState(
    () => selectedIdeaOnMount?.id ?? null,
  );
  const [action, setAction] = useState(null);
  const [draftNotes, setDraftNotes] = useState(
    () => selectedIdeaOnMount?.notes ?? '',
  );
  const [notesSavedAt, setNotesSavedAt] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionError, setActionError] = useState(null);
  const captureRef = useRef(null);
  const headingRef = useRef(null);
  const expectedDeletionRef = useRef(null);
  const handledSelectedIdeaRef = useRef(selectedIdeaOnMount?.id ?? null);
  const notesDraftDirtyRef = useRef(false);
  const shouldFocusSelectedIdeaRef = useRef(false);

  const sorted = useMemo(
    () =>
      [...ideas].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [ideas],
  );

  const isNotesDirty = (() => {
    if (!expandedId) return false;
    const idea = ideas.find((i) => i.id === expandedId);
    if (!idea) return false;
    return draftNotes !== (idea.notes ?? '');
  })();

  useEffect(() => {
    if (!selectedIdeaId || handledSelectedIdeaRef.current === selectedIdeaId) return;
    const selectedNotes = resolveIdeaNotesDraft(ideas, selectedIdeaId);
    if (selectedNotes === null) return;

    const timeoutId = window.setTimeout(() => {
      handledSelectedIdeaRef.current = selectedIdeaId;
      notesDraftDirtyRef.current = false;
      shouldFocusSelectedIdeaRef.current = true;
      setDraftNotes(selectedNotes);
      setNotesSavedAt(null);
      setExpandedId(selectedIdeaId);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [ideas, selectedIdeaId]);

  useEffect(() => {
    if (!expandedId) return;
    const notesOperationPending =
      pendingAction?.type === 'notes' && pendingAction.id === expandedId;
    const notesOperationFailed =
      actionError?.type === 'notes' && actionError.id === expandedId;
    if (notesOperationPending || notesOperationFailed) return;

    const committedNotes = resolveIdeaNotesDraft(ideas, expandedId);
    if (committedNotes === null) return;
    if (notesDraftDirtyRef.current && draftNotes !== committedNotes) return;

    const timeoutId = window.setTimeout(() => {
      if (notesDraftDirtyRef.current) {
        setDraftNotes((current) => {
          if (current === committedNotes) notesDraftDirtyRef.current = false;
          return current;
        });
        return;
      }
      if (draftNotes !== committedNotes) {
        setDraftNotes(committedNotes);
        setNotesSavedAt(null);
      }
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [actionError, draftNotes, expandedId, ideas, pendingAction]);

  useEffect(() => {
    if (
      !shouldFocusSelectedIdeaRef.current
      || !expandedId
      || expandedId !== selectedIdeaId
    ) return;

    shouldFocusSelectedIdeaRef.current = false;
    const region = document.getElementById(`idea-region-${expandedId}`);
    if (region) {
      region.scrollIntoView({ behavior: 'smooth', block: 'center' });
      region.focus();
    }
  }, [expandedId, selectedIdeaId]);

  useEffect(() => {
    const id = expandedId;
    if (id) {
      const region = document.getElementById(`idea-region-${id}`);
      if (region) {
        region.scrollIntoView({ behavior: 'smooth', block: 'center' });
        region.focus();
      }
      return;
    }
    if (captureRef.current) {
      captureRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const activeId = action?.id || expandedId;
    if (!hasServerSnapshot || !activeId || ideas.some((idea) => idea.id === activeId)) return;

    const isLocalDeletePending =
      expectedDeletionRef.current === activeId && pendingAction?.type === 'delete';
    const isLocalDeleteRejected =
      expectedDeletionRef.current === activeId && actionError?.type === 'delete';
    if (isLocalDeletePending || isLocalDeleteRejected) return;

    const wasExpected = expectedDeletionRef.current === activeId;
    const timeoutId = window.setTimeout(() => {
      expectedDeletionRef.current = null;
      setAction(null);
      setPendingAction(null);
      setActionError(null);
      notesDraftDirtyRef.current = false;
      setDraftNotes('');
      setNotesSavedAt(null);
      setExpandedId(null);
      onActiveIdeaRemoved();
      if (!wasExpected) onRemoteDeletion();
      (headingRef.current || captureRef.current)?.focus?.();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [
    action,
    actionError,
    expandedId,
    hasServerSnapshot,
    ideas,
    onActiveIdeaRemoved,
    onRemoteDeletion,
    pendingAction,
  ]);

  useEffect(() => {
    const expectedId = expectedDeletionRef.current;
    if (
      expectedId
      && pendingAction?.type !== 'delete'
      && ideas.some((idea) => idea.id === expectedId)
    ) {
      expectedDeletionRef.current = null;
    }
  }, [ideas, pendingAction]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || capturePending || !canMutate) {
      captureRef.current?.focus();
      return;
    }
    setCapturePending(true);
    setCaptureError('');
    try {
      await onAdd({ text: trimmed, notes: '' });
      setText('');
      captureRef.current?.focus();
    } catch (error) {
      setCaptureError(getIdeaErrorMessage(error, 'This Quick Idea could not be added. Try again.'));
      captureRef.current?.focus();
    } finally {
      setCapturePending(false);
    }
  }

  function handleToggleExpand(id) {
    if (action || pendingAction) return;
    if (isNotesDirty) return;
    if (expandedId === id) {
      notesDraftDirtyRef.current = false;
      setDraftNotes('');
      setNotesSavedAt(null);
      setExpandedId(null);
      return;
    }
    const idea = ideas.find((i) => i.id === id);
    notesDraftDirtyRef.current = false;
    setDraftNotes(idea?.notes ?? '');
    setExpandedId(id);
  }

  function handleEditStart(id) {
    if (isNotesDirty || !canMutate) return;
    setNotesSavedAt(null);
    setActionError(null);
    setAction({ type: 'edit', id });
  }

  async function handleEditSave(id, patch) {
    if (pendingAction) return;
    setPendingAction({ type: 'edit', id });
    setActionError(null);
    try {
      await onEditIdea(id, patch);
      setAction(null);
    } catch (error) {
      setActionError({
        type: 'edit',
        id,
        message: getIdeaErrorMessage(error, 'This Quick Idea title could not be saved.'),
      });
    } finally {
      setPendingAction(null);
    }
  }

  function handleEditCancel() {
    if (pendingAction) return;
    setActionError(null);
    setAction(null);
  }

  function handleDeleteStart(id) {
    if (isNotesDirty || !canMutate) return;
    setActionError(null);
    setAction({ type: 'confirm', id });
  }

  async function handleDeleteConfirm(id) {
    if (pendingAction) return;
    expectedDeletionRef.current = id;
    setPendingAction({ type: 'delete', id });
    setActionError(null);
    try {
      await onDeleteIdea(id);
      expectedDeletionRef.current = null;
      setPendingAction(null);
      setAction(null);
      setActionError(null);
      notesDraftDirtyRef.current = false;
      setDraftNotes('');
      setNotesSavedAt(null);
      setExpandedId(null);
      onActiveIdeaRemoved();
      window.setTimeout(() => {
        (headingRef.current || captureRef.current)?.focus?.();
      }, 0);
    } catch (error) {
      setPendingAction(null);
      setNotesSavedAt(null);
      setActionError({
        type: 'delete',
        id,
        message: getIdeaErrorMessage(error, 'This Quick Idea could not be deleted.'),
      });
    }
  }

  function handleDeleteCancel() {
    if (pendingAction) return;
    expectedDeletionRef.current = null;
    setActionError(null);
    setAction(null);
  }

  function handleNotesChange(value) {
    const idea = ideas.find((i) => i.id === expandedId);
    notesDraftDirtyRef.current = value !== (idea?.notes ?? '');
    setDraftNotes(value);
    if (notesSavedAt) {
      if (value !== (idea?.notes ?? '')) {
        setNotesSavedAt(null);
      }
    }
  }

  async function handleNotesSave() {
    if (pendingAction || !expandedId) return;
    const normalized = draftNotes.trim().length === 0 ? '' : draftNotes;
    const ideaId = expandedId;
    const currentIdea = ideas.find((idea) => idea.id === ideaId);
    if (normalized === (currentIdea?.notes ?? '')) {
      notesDraftDirtyRef.current = false;
      setDraftNotes(normalized);
      setNotesSavedAt(null);
      setActionError(null);
      return;
    }
    setPendingAction({ type: 'notes', id: ideaId });
    setActionError(null);
    setNotesSavedAt(null);
    try {
      const result = await onEditIdea(ideaId, { notes: normalized });
      notesDraftDirtyRef.current = false;
      setDraftNotes(normalized);
      if (result?.written && result?.acknowledged) {
        const now = new Date();
        setNotesSavedAt(now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }));
      } else {
        setNotesSavedAt(null);
      }
    } catch (error) {
      setNotesSavedAt(null);
      if (ideas.some((idea) => idea.id === ideaId)) {
        setActionError({
          type: 'notes',
          id: ideaId,
          message: getIdeaErrorMessage(error, 'Quick Idea notes could not be saved.'),
        });
      }
    } finally {
      setPendingAction(null);
    }
  }

  function handleNotesCancel() {
    if (pendingAction) return;
    const idea = ideas.find((i) => i.id === expandedId);
    notesDraftDirtyRef.current = false;
    setDraftNotes(idea?.notes ?? '');
    setNotesSavedAt(null);
    setActionError(null);
  }

  return (
    <section className="qi-workspace" aria-labelledby="qi-title">
      <div className="qi-workspace__header">
        <div className="qi-workspace__title-row">
          <h1 ref={headingRef} id="qi-title" className="qi-workspace__title" tabIndex={-1}>
            Quick Ideas
          </h1>
          <span className="qi-workspace__count" aria-label={
            hasServerSnapshot ? `${ideas.length} total ideas` : 'Quick Ideas loading'
          }>
            {hasServerSnapshot ? ideas.length : '—'}
          </span>
        </div>
        <p className="qi-workspace__subtitle">
          Capture sparks of thought. Expand any idea to read notes, edit, or delete.
        </p>
      </div>

      <form className="qi-capture" onSubmit={handleSubmit}>
        <textarea
          ref={captureRef}
          className="qi-capture__textarea"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Capture a new idea"
          disabled={!canMutate || capturePending}
          rows={4}
        />
        <div className="qi-capture__actions">
          <button
            type="submit"
            className="qi-capture__save"
            disabled={!canMutate || capturePending || text.trim().length === 0}
            aria-busy={capturePending}
          >
            {capturePending ? 'Syncing...' : 'Save'}
          </button>
        </div>
        {captureError && <p className="qi-operation-error" role="alert">{captureError}</p>}
      </form>

      {!hasServerSnapshot && !listenerError && (
        <TaskSurfacePlaceholder message="Loading your cloud Quick Ideas..." />
      )}

      {!hasServerSnapshot && listenerError && (
        <div className="idea-cloud-state idea-cloud-state--error" role="alert">
          <p>Cloud Quick Ideas could not be loaded.</p>
          <div className="idea-cloud-state__actions">
            <button type="button" onClick={onRetry}>Retry Quick Ideas</button>
            <button type="button" onClick={() => onSignOut()}>Sign out</button>
          </div>
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

      {pendingAction?.type === 'delete'
        && action?.type === 'confirm'
        && !ideas.some((idea) => idea.id === action.id) && (
        <p className="idea-cloud-state" role="status">
          Deletion is syncing. Waiting for cloud confirmation...
        </p>
      )}

      {actionError?.type === 'delete'
        && action?.type === 'confirm'
        && !ideas.some((idea) => idea.id === action.id) && (
        <p className="qi-operation-error" role="alert">
          {actionError.message} The confirmation will remain available if the idea returns.
        </p>
      )}

      {hasServerSnapshot && <h2 className="qi-workspace__section-title">Your Ideas</h2>}

      {hasServerSnapshot && (sorted.length === 0 ? (
        <EmptyState
          title="No ideas yet"
          hint="Capture your first idea above."
        />
      ) : (
        <div className="qi-list">
          {sorted.map((idea) => (
            <WorkspaceIdeaItem
              key={idea.id}
              idea={idea}
              expanded={expandedId === idea.id}
              action={action}
              muted={
                (action !== null && action.id !== idea.id)
                || (isNotesDirty && expandedId !== idea.id)
              }
              isNotesDirty={expandedId === idea.id && isNotesDirty}
              draftNotes={expandedId === idea.id ? draftNotes : ''}
              notesSavedAt={expandedId === idea.id ? notesSavedAt : null}
              pendingAction={pendingAction?.id === idea.id ? pendingAction.type : null}
              operationError={actionError?.id === idea.id ? actionError.message : null}
              mutationDisabled={!canMutate}
              onToggleExpand={handleToggleExpand}
              onEditStart={handleEditStart}
              onEditSave={handleEditSave}
              onEditCancel={handleEditCancel}
              onDeleteStart={handleDeleteStart}
              onDeleteConfirm={handleDeleteConfirm}
              onDeleteCancel={handleDeleteCancel}
              onNotesChange={handleNotesChange}
              onNotesSave={handleNotesSave}
              onNotesCancel={handleNotesCancel}
            />
          ))}
        </div>
      ))}
    </section>
  );
}
