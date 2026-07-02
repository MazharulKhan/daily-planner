import '../styles/task-row.css';
import { isOverdue, formatShortDate } from '../utils/dateTime';

function priorityClass(priority) {
  if (!priority) return '';
  const p = priority.toLowerCase();
  if (p === 'high') return 'badge--high';
  if (p === 'medium') return 'badge--medium';
  if (p === 'low') return 'badge--low';
  return '';
}

export default function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
  editBtnRef,
}) {
  const completed = !!task.completed;
  const overdue = !completed && isOverdue(task.dueDate);

  const overdueLabel = overdue
    ? task.time
      ? `Overdue · ${formatShortDate(task.dueDate)} · ${task.time}`
      : `Overdue · ${formatShortDate(task.dueDate)}`
    : null;

  return (
    <div className={`task-row${completed ? ' task-row--completed' : ''}`}>
      <button
        type="button"
        className="task-row__checkbox"
        role="checkbox"
        aria-checked={completed}
        aria-label={
          completed
            ? `Mark "${task.title}" as not done`
            : `Mark "${task.title}" as done`
        }
        onClick={() => onToggle(task.id)}
      >
        <svg
          className="task-row__check"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </button>

      <div className="task-row__main">
        <span className="task-row__title">{task.title}</span>
      </div>

      <div className="task-row__badges">
        {task.priority && (
          <span className={`badge ${priorityClass(task.priority)}`}>
            {task.priority}
          </span>
        )}
        {task.category && (
          <span className="badge badge--category">{task.category}</span>
        )}
      </div>

      {overdue ? (
        <span className="task-row__time task-row__time--overdue">
          {overdueLabel}
        </span>
      ) : task.time ? (
        <span className="task-row__time">{task.time}</span>
      ) : (
        <span className="task-row__time task-row__time--none">Any time</span>
      )}

      <div className="task-row__actions">
        <button
          ref={editBtnRef}
          type="button"
          className="task-row__action task-row__action--edit"
          aria-label={`Edit task "${task.title}"`}
          onClick={() => onEdit(task)}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          className="task-row__action task-row__action--delete"
          aria-label={`Delete task "${task.title}"`}
          onClick={() => onDelete(task)}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
