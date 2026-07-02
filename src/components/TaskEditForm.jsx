import { useEffect, useRef, useState } from 'react';
import '../styles/task-row.css';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];

export default function TaskEditForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [category, setCategory] = useState(task.category || 'Work');
  const [time, setTime] = useState(task.time || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(task.id, {
      title: trimmed,
      priority,
      category,
      time: time || null,
      dueDate: dueDate || null,
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }

  const trimmed = title.trim();

  return (
    <div className="task-edit" onKeyDown={handleKeyDown}>
      <form className="task-edit__form" onSubmit={handleSubmit}>
        <input
          ref={titleRef}
          type="text"
          className="task-edit__input"
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
        <div className="task-edit__fields">
          <label className="task-edit__field">
            <span className="task-edit__label">Priority</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="task-edit__field">
            <span className="task-edit__label">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="task-edit__field">
            <span className="task-edit__label">Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </label>
          <label className="task-edit__field">
            <span className="task-edit__label">Due</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        </div>
        <div className="task-edit__actions">
          <button
            type="submit"
            className="task-edit__save"
            disabled={!trimmed}
          >
            Save
          </button>
          <button type="button" className="task-edit__cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
        {!trimmed && (
          <span className="task-edit__validation">Title is required</span>
        )}
      </form>
    </div>
  );
}
