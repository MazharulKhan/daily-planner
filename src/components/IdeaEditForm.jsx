import { useEffect, useRef, useState } from 'react';
import '../styles/quick-ideas-workspace.css';

export default function IdeaEditForm({ idea, onSave, onCancel }) {
  const [text, setText] = useState(idea.text ?? '');
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current?.focus();
    textRef.current?.setSelectionRange(
      textRef.current.value.length,
      textRef.current.value.length,
    );
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      textRef.current?.focus();
      return;
    }
    onSave(idea.id, { text: trimmed });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel(idea.id);
    }
  }

  return (
    <form
      className="qi-edit"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
    >
      <textarea
        ref={textRef}
        className="qi-edit__text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        aria-label="Edit idea text"
      />
      <div className="qi-edit__actions">
        <button type="submit" className="qi-edit__save" aria-label="Save title">
          Save title
        </button>
        <button
          type="button"
          className="qi-edit__cancel"
          aria-label="Cancel editing"
          onClick={() => onCancel(idea.id)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
