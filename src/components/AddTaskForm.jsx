import { useEffect, useRef, useState } from 'react';
import { makeId, todayISO } from '../utils/dateTime';

const DEFAULT_PRIORITY = 'Medium';
const DEFAULT_CATEGORY = 'Work';
const DEFAULT_TIME = '09:00';

export default function AddTaskForm({ open, onAdd, onClose, onRequestOpen }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({
      id: makeId('task'),
      title: trimmed,
      completed: false,
      priority: DEFAULT_PRIORITY,
      category: DEFAULT_CATEGORY,
      time: DEFAULT_TIME,
      dueDate: todayISO(),
    });
    setTitle('');
    onClose?.();
  }

  function handleCancel() {
    setTitle('');
    onClose?.();
  }

  if (!open) {
    return (
      <div className="add-task">
        <button
          type="button"
          className="add-task__trigger"
          onClick={onRequestOpen}
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
          Add a task
        </button>
      </div>
    );
  }

  return (
    <div className="add-task">
      <form className="add-task__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="add-task__input"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
        <button type="submit" className="add-task__submit">
          Add
        </button>
        <button type="button" className="add-task__cancel" onClick={handleCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}
