import '../styles/task-row.css';

function priorityClass(priority) {
  if (!priority) return '';
  const p = priority.toLowerCase();
  if (p === 'high') return 'badge--high';
  if (p === 'medium') return 'badge--medium';
  if (p === 'low') return 'badge--low';
  return '';
}

export default function TaskRow({ task, onToggle }) {
  const completed = !!task.completed;

  return (
    <div
      className={`task-row${completed ? ' task-row--completed' : ''}`}
    >
      <button
        type="button"
        className="task-row__checkbox"
        role="checkbox"
        aria-checked={completed}
        aria-label={
          completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`
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

      {task.time ? (
        <span className="task-row__time">{task.time}</span>
      ) : null}
    </div>
  );
}
