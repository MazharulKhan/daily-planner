import { useEffect, useRef, useState } from 'react';
import '../styles/task-row.css';
import { getErrorMessage } from '../utils/taskCloud';

export default function TaskDeleteConfirm({ task, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cloudError, setCloudError] = useState('');

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!isDeleting) onCancel();
    }
  }

  return (
    <div
      className="task-delete"
      onKeyDown={handleKeyDown}
      role="alertdialog"
      aria-label={`Delete task "${task.title}"?`}
      aria-busy={isDeleting}
    >
      <span className="task-delete__text">
        Delete this task?
      </span>
      <div className="task-delete__actions">
        <button
          type="button"
          className="task-delete__confirm"
          onClick={async () => {
            setIsDeleting(true);
            setCloudError('');
            try {
              await onConfirm(task.id);
            } catch (error) {
              setCloudError(getErrorMessage(error, 'This task could not be deleted.'));
            } finally {
              setIsDeleting(false);
            }
          }}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
        <button
          ref={cancelRef}
          type="button"
          className="task-delete__cancel"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </button>
      </div>
      {cloudError && <span className="task-delete__error" role="alert">{cloudError}</span>}
    </div>
  );
}
