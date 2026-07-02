import '../styles/cards.css';
import '../styles/task-row.css';
import TaskRow from './TaskRow';
import TaskEditForm from './TaskEditForm';
import TaskDeleteConfirm from './TaskDeleteConfirm';
import AddTaskForm from './AddTaskForm';
import EmptyState from './EmptyState';
import { sortTodayTasks, isOverdue } from '../utils/dateTime';

export default function TodayTasksCard({
  tasks,
  onToggle,
  onAdd,
  addOpen,
  onRequestAdd,
  onCloseAdd,
  activeTaskAction,
  onBeginEdit,
  onBeginDelete,
  onEditSave,
  onDeleteConfirm,
  onActionCancel,
}) {
  const active = tasks.filter((t) => !t.completed).sort(sortTodayTasks);
  const completed = tasks.filter((t) => t.completed).sort(sortTodayTasks);
  const allDone = tasks.length > 0 && active.length === 0;

  const overdueActive = active.filter((t) => isOverdue(t.dueDate));
  const restActive = active.filter((t) => !isOverdue(t.dueDate));

  function renderRow(task) {
    const isEditing = activeTaskAction?.taskId === task.id && activeTaskAction?.type === 'edit';
    const isDeleting = activeTaskAction?.taskId === task.id && activeTaskAction?.type === 'delete';

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
      <TaskRow
        key={task.id}
        task={task}
        onToggle={onToggle}
        onEdit={(t) => onBeginEdit(t, document.activeElement)}
        onDelete={(t) => onBeginDelete(t, document.activeElement)}
      />
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Today&apos;s Tasks</h2>
          <span className="card__count">{tasks.length}</span>
        </div>
        <button type="button" className="card__view-all">
          View all
        </button>
      </div>

      <div className="card__body">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            hint="Add your first task to get started."
            actionLabel="+ Add a task"
            onAction={onRequestAdd}
          />
        ) : (
          <div className="task-list">
            {overdueActive.length > 0 && (
              <div className="overdue-divider">
                <span className="overdue-divider__label">
                  Overdue · {overdueActive.length}
                </span>
              </div>
            )}
            {overdueActive.map(renderRow)}
            {restActive.map(renderRow)}
            {completed.length > 0 && (
              <div className="completed-divider">
                <span className="completed-divider__label">
                  Completed · {completed.length}
                </span>
              </div>
            )}
            {completed.map(renderRow)}
          </div>
        )}

        <AddTaskForm
          open={addOpen}
          onAdd={onAdd}
          onClose={onCloseAdd}
          onRequestOpen={onRequestAdd}
        />

        {allDone && (
          <div className="task-list__all-done">
            All done for today. Nice work!
          </div>
        )}
      </div>
    </div>
  );
}
