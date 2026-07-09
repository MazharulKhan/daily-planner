import '../styles/cards.css';
import '../styles/task-row.css';
import TaskEditForm from './TaskEditForm';
import TaskDeleteConfirm from './TaskDeleteConfirm';
import EmptyState from './EmptyState';
import { formatDueDate, isUpcoming, sortUpcomingTasks } from '../utils/dateTime';

export default function UpcomingTasksCard({
  tasks,
  activeTaskAction,
  onBeginEdit,
  onBeginDelete,
  onEditSave,
  onDeleteConfirm,
  onActionCancel,
  onOpenDetail,
  onViewAll,
}) {
  const upcoming = tasks
    .filter((t) => isUpcoming(t.dueDate) && !t.completed)
    .sort(sortUpcomingTasks);

  function renderRow(task) {
    const isEditing =
      activeTaskAction?.taskId === task.id && activeTaskAction?.type === 'edit';
    const isDeleting =
      activeTaskAction?.taskId === task.id &&
      activeTaskAction?.type === 'delete';

    if (isEditing) {
      return (
        <TaskEditForm
          key={task.id}
          task={task}
          onSave={onEditSave}
          onCancel={onActionCancel}
        />
      );
    }
    if (isDeleting) {
      return (
        <TaskDeleteConfirm
          key={task.id}
          task={task}
          onConfirm={onDeleteConfirm}
          onCancel={onActionCancel}
        />
      );
    }
    return (
      <UpcomingTaskRow
        key={task.id}
        task={task}
        onEdit={(t) => onBeginEdit(t, document.activeElement)}
        onDelete={(t) => onBeginDelete(t, document.activeElement)}
        onOpenDetail={onOpenDetail}
      />
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Upcoming Tasks</h2>
          <span className="card__count">{upcoming.length}</span>
        </div>
        <button type="button" className="card__view-all" onClick={onViewAll}>
          View all
        </button>
      </div>

      <div className="card__body">
        {upcoming.length === 0 ? (
          <EmptyState
            title="Nothing upcoming"
            hint="Tasks with a future due date will appear here."
          />
        ) : (
          <div className="task-list">
            {upcoming.map(renderRow)}
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingTaskRow({ task, onEdit, onDelete, onOpenDetail }) {
  const completed = !!task.completed;
  const priorityBorderClass = task.priority
    ? `task-row--priority-${task.priority.toLowerCase()}`
    : '';
  return (
    <div
      className={`task-row${completed ? ' task-row--completed' : ''}${priorityBorderClass ? ` ${priorityBorderClass}` : ''}`}
    >
      <button type="button" className="task-row__title-btn" aria-label={`Open details for ${task.title}`} onClick={() => onOpenDetail?.(task)}>
        {task.title}
      </button>
      {task.category && (
        <div className="task-row__badges">
          <span className="badge badge--category">{task.category}</span>
        </div>
      )}
      <span className="task-row__due">{formatDueDate(task.dueDate)}</span>
      <div className="task-row__actions">
        <button
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
