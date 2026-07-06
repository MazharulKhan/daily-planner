import { useState } from 'react';
import '../styles/cards.css';
import '../styles/task-row.css';
import TaskRow from './TaskRow';
import TaskEditForm from './TaskEditForm';
import TaskDeleteConfirm from './TaskDeleteConfirm';
import AddTaskForm from './AddTaskForm';
import EmptyState from './EmptyState';
import { sortTodayTasks, isOverdue } from '../utils/dateTime';

const CATEGORIES = ['All', 'Work', 'Learning', 'Personal', 'Health'];

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
  onOpenDetail,
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredTasks =
    categoryFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.category === categoryFilter);

  const active = filteredTasks.filter((t) => !t.completed).sort(sortTodayTasks);
  const completed = filteredTasks
    .filter((t) => t.completed)
    .sort(sortTodayTasks);
  const allDone = filteredTasks.length > 0 && active.length === 0;

  const overdueActive = active.filter((t) => isOverdue(t.dueDate));
  const restActive = active.filter((t) => !isOverdue(t.dueDate));

  const filteredEmpty = tasks.length > 0 && filteredTasks.length === 0;

  const completionMessage = allDone
    ? categoryFilter === 'All'
      ? 'All done for today. Nice work!'
      : `All ${categoryFilter} tasks are complete.`
    : null;

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
        <TaskRow
          key={task.id}
          task={task}
          onToggle={onToggle}
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
          <h2 className="card__title">Today&apos;s Tasks</h2>
          <span className="card__count">{filteredTasks.length}</span>
        </div>
        <button type="button" className="card__view-all">
          View all
        </button>
      </div>

      {tasks.length > 0 && (
        <div
          className="filter-chips"
          role="group"
          aria-label="Filter tasks by category"
        >
          {CATEGORIES.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`filter-chip${isActive ? ' filter-chip--active' : ''}`}
                aria-pressed={isActive}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="card__body">
        {tasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            hint="Add your first task to get started."
            actionLabel="+ Add a task"
            onAction={onRequestAdd}
          />
        ) : filteredEmpty ? (
          <div className="task-list__filtered-empty">
            No {categoryFilter} tasks for today
          </div>
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

        {completionMessage && (
          <div className="task-list__all-done">{completionMessage}</div>
        )}
      </div>
    </div>
  );
}
