import { useEffect, useRef, useState } from 'react';
import { getIdeaErrorMessage } from '../utils/ideaCloud';
import '../styles/ideas.css';

export default function AddIdeaForm({ open, onAdd, onClose, onRequestOpen, disabled = false }) {
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || pending || disabled) return;
    setPending(true);
    setError('');
    try {
      await onAdd({ text: trimmed, notes: '' });
      setText('');
      onClose?.();
    } catch (submissionError) {
      setError(getIdeaErrorMessage(
        submissionError,
        'This Quick Idea could not be added. Try again.',
      ));
      inputRef.current?.focus();
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className="add-idea add-idea--closed"
        onClick={onRequestOpen}
        disabled={disabled}
      >
        + Capture a quick idea
      </button>
    );
  }

  return (
    <form className="add-idea" onSubmit={handleSubmit}>
      <textarea
        ref={inputRef}
        className="add-idea__input"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Idea text"
        disabled={disabled || pending}
        rows={2}
      />
      <div className="add-idea__actions">
        <button
          type="submit"
          className="add-idea__submit"
          disabled={disabled || pending || text.trim().length === 0}
          aria-busy={pending}
        >
          {pending ? 'Syncing...' : 'Save'}
        </button>
        {error && <p className="add-idea__error" role="alert">{error}</p>}
      </div>
    </form>
  );
}
