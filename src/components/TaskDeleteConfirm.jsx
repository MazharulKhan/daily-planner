import { useEffect, useRef } from 'react';
import '../styles/task-row.css';

export default function TaskDeleteConfirm({ task, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  }

  return (
    <div
      className="task-delete"
      onKeyDown={handleKeyDown}
      role="alertdialog"
      aria-label={`Delete task "${task.title}"?`}
    >
      <span className="task-delete__text">
        Delete this task?
      </span>
      <div className="task-delete__actions">
        <button
          type="button"
          className="task-delete__confirm"
          onClick={() => onConfirm(task.id)}
        >
          Delete
        </button>
        <button
          ref={cancelRef}
          type="button"
          className="task-delete__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
