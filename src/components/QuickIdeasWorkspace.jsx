import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/quick-ideas-workspace.css';
import { makeId } from '../utils/dateTime';
import EmptyState from './EmptyState';
import WorkspaceIdeaItem from './WorkspaceIdeaItem';

export default function QuickIdeasWorkspace({
  ideas,
  onAdd,
  onEditIdea,
  onDeleteIdea,
  selectedIdeaId,
}) {
  const [text, setText] = useState('');
  const [expandedId, setExpandedId] = useState(
    () =>
      selectedIdeaId && ideas.some((i) => i.id === selectedIdeaId)
        ? selectedIdeaId
        : null,
  );
  const [action, setAction] = useState(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [notesSavedAt, setNotesSavedAt] = useState(null);
  const captureRef = useRef(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      captureRef.current?.focus();
      return;
    }
    const now = new Date().toISOString();
    onAdd({
      id: makeId('idea'),
      text: trimmed,
      notes: '',
      createdAt: now,
      updatedAt: now,
    });
    setText('');
    captureRef.current?.focus();
  }

  function handleToggleExpand(id) {
    if (action) return;
    if (isNotesDirty) return;
    if (expandedId === id) {
      setDraftNotes('');
      setNotesSavedAt(null);
      setExpandedId(null);
      return;
    }
    const idea = ideas.find((i) => i.id === id);
    setDraftNotes(idea?.notes ?? '');
    setExpandedId(id);
  }

  function handleEditStart(id) {
    if (isNotesDirty) return;
    setNotesSavedAt(null);
    setAction({ type: 'edit', id });
  }

  function handleEditSave(id, patch) {
    onEditIdea(id, patch);
    setAction(null);
  }

  function handleEditCancel() {
    setAction(null);
  }

  function handleDeleteStart(id) {
    if (isNotesDirty) return;
    setAction({ type: 'confirm', id });
  }

  function handleDeleteConfirm(id) {
    onDeleteIdea(id);
    setAction(null);
    setDraftNotes('');
    setNotesSavedAt(null);
    setExpandedId(null);
  }

  function handleDeleteCancel() {
    setAction(null);
  }

  function handleNotesChange(value) {
    setDraftNotes(value);
    if (notesSavedAt) {
      const idea = ideas.find((i) => i.id === expandedId);
      if (value !== (idea?.notes ?? '')) {
        setNotesSavedAt(null);
      }
    }
  }

  function handleNotesSave() {
    const normalized = draftNotes.trim().length === 0 ? '' : draftNotes;
    onEditIdea(expandedId, { notes: normalized });
    setDraftNotes(normalized);
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    setNotesSavedAt(time);
  }

  function handleNotesCancel() {
    const idea = ideas.find((i) => i.id === expandedId);
    setDraftNotes(idea?.notes ?? '');
    setNotesSavedAt(null);
  }

  return (
    <section className="qi-workspace" aria-labelledby="qi-title">
      <div className="qi-workspace__header">
        <div className="qi-workspace__title-row">
          <h1 id="qi-title" className="qi-workspace__title">
            Quick Ideas
          </h1>
          <span className="qi-workspace__count" aria-label={`${ideas.length} total ideas`}>
            {ideas.length}
          </span>
        </div>
        <p className="qi-workspace__subtitle">
          Capture sparks of thought. Expand any idea to read notes, edit, or delete.
        </p>
        <p className="qi-workspace__storage-note">
          Stored on this browser until Quick Ideas cloud sync is added.
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
          rows={4}
        />
        <div className="qi-capture__actions">
          <button type="submit" className="qi-capture__save">
            Save
          </button>
        </div>
      </form>

      <h2 className="qi-workspace__section-title">Your Ideas</h2>

      {sorted.length === 0 ? (
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
      )}
    </section>
  );
}
