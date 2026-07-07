import { useEffect, useRef, useState } from 'react';
import { makeId } from '../utils/dateTime';

const DEFAULT_PRIORITY = 'Medium';
const DEFAULT_CATEGORY = 'Work';
const DEFAULT_TASK_TYPE = 'standard';

const PRIORITIES = ['High', 'Medium', 'Low'];
const CATEGORIES = ['Work', 'Learning', 'Personal', 'Health'];
const TASK_TYPES = [
  { value: 'standard', label: 'Standard Task' },
  { value: 'youtube', label: 'YouTube Task' },
];

export default function AddTaskForm({ open, onAdd, onClose, onRequestOpen }) {
  const [title, setTitle] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [taskType, setTaskType] = useState(DEFAULT_TASK_TYPE);
  const [time, setTime] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function resetFields() {
    setTitle('');
    setShowOptions(false);
    setPriority(DEFAULT_PRIORITY);
    setCategory(DEFAULT_CATEGORY);
    setTaskType(DEFAULT_TASK_TYPE);
    setTime('');
    setDueDate('');
    setDescription('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const trimmedDesc = description.trim();
    onAdd({
      id: makeId('task'),
      title: trimmed,
      description: trimmedDesc,
      taskType,
      youtubeUrl: '',
      youtubeNotes: '',
      completed: false,
      priority,
      category,
      time: time || null,
      dueDate: dueDate || null,
    });
    resetFields();
    onClose?.();
  }

  function handleCancel() {
    resetFields();
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
        <button
          type="button"
          className="add-task__cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="add-task__more"
          aria-expanded={showOptions}
          onClick={() => setShowOptions((v) => !v)}
        >
          {showOptions ? 'Fewer options' : 'More options'}
        </button>
        {showOptions && (
          <div className="add-task__options">
            <label className="add-task__field">
              <span className="add-task__label">Description</span>
              <textarea
                className="add-task__textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
              />
            </label>
            <label className="add-task__field">
              <span className="add-task__label">Task Type</span>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
              >
                {TASK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="add-task__field">
              <span className="add-task__label">Priority</span>
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
            <label className="add-task__field">
              <span className="add-task__label">Category</span>
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
            <label className="add-task__field">
              <span className="add-task__label">Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
            <label className="add-task__field">
              <span className="add-task__label">Due date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>
          </div>
        )}
      </form>
    </div>
  );
}
