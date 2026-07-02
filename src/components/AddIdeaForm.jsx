import { useEffect, useRef, useState } from 'react';
import { makeId } from '../utils/dateTime';
import '../styles/ideas.css';

export default function AddIdeaForm({ open, onAdd, onClose, onRequestOpen }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({
      id: makeId('idea'),
      text: trimmed,
      createdAt: new Date().toISOString(),
    });
    setText('');
    onClose?.();
  }

  if (!open) {
    return (
      <button
        type="button"
        className="add-idea add-idea--closed"
        onClick={onRequestOpen}
      >
        + Capture a quick idea
      </button>
    );
  }

  return (
    <form className="add-idea" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="add-idea__input"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Idea text"
      />
      <button type="submit" className="add-idea__submit">
        Save
      </button>
    </form>
  );
}
