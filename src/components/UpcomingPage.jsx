import { useCallback, useRef, useState } from 'react';
import '../styles/cards.css';
import '../styles/task-row.css';
import TaskRow from './TaskRow';
import TaskEditForm from './TaskEditForm';
import TaskDeleteConfirm from './TaskDeleteConfirm';
import EmptyState from './EmptyState';
import { formatDueDate, isUpcoming, sortUpcomingTasks } from '../utils/dateTime';

export default function UpcomingPage({
  tasks,
  onToggle,
  onOpenDetail,
  onEditTask,
  onDeleteTask,
}) {
  const [activeTaskAction, setActiveTaskAction] = useState(null);
  const lastTriggerRef = useRef(null);

  const pool = tasks
    .filter((t) => isUpcoming(t.dueDate) && !t.completed)
    .sort(sortUpcomingTasks);

  const headings = [];
  const groups = {};
  pool.forEach((task) => {
    const heading = formatDueDate(task.dueDate);
    if (!groups[heading]) {
      groups[heading] = [];
      headings.push(heading);
    }
    groups[heading].push(task);
  });

  const beginEdit = useCallback((task, triggerEl) => {
    lastTriggerRef.current = triggerEl;
    setActiveTaskAction({ taskId: task.id, type: 'edit' });
  }, []);

  const beginDelete = useCallback((task, triggerEl) => {
    lastTriggerRef.current = triggerEl;
    setActiveTaskAction({ taskId: task.id, type: 'delete' });
  }, []);

  const clearAction = useCallback(() => {
    const ref = lastTriggerRef.current;
    setActiveTaskAction(null);
    if (ref && typeof ref.focus === 'function') {
      ref.focus();
    }
    lastTriggerRef.current = null;
  }, []);

  const handleEditSave = useCallback(
    (id, patch) => {
      onEditTask(id, patch);
      clearAction();
    },
    [onEditTask, clearAction],
  );

  const handleDeleteConfirm = useCallback(
    (id) => {
      onDeleteTask(id);
      clearAction();
    },
    [onDeleteTask, clearAction],
  );

  function renderRow(task) {
    const isEditing =
      activeTaskAction?.taskId === task.id && activeTaskAction?.type === 'edit';
    const isDeleting =
      activeTaskAction?.taskId === task.id && activeTaskAction?.type === 'delete';

    if (isEditing) {
      return (
        <TaskEditForm
          key={task.id}
          task={task}
          onSave={handleEditSave}
          onCancel={clearAction}
        />
      );
    }
    if (isDeleting) {
      return (
        <TaskDeleteConfirm
          key={task.id}
          task={task}
          onConfirm={handleDeleteConfirm}
          onCancel={clearAction}
        />
      );
    }
    return (
      <TaskRow
        key={task.id}
        task={task}
        onToggle={onToggle}
        onEdit={(t) => beginEdit(t, document.activeElement)}
        onDelete={(t) => beginDelete(t, document.activeElement)}
        onOpenDetail={onOpenDetail}
      />
    );
  }

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Upcoming</h2>
          <span className="card__count">{pool.length}</span>
        </div>
      </div>

      <div className="card__body">
        {pool.length === 0 ? (
          <EmptyState
            title="Nothing upcoming"
            hint="Tasks with a future due date will appear here."
          />
        ) : (
          <div className="task-list">
            {headings.map((heading) => (
              <div key={heading}>
                <div
                  style={{
                    padding: 'var(--space-3) 0 var(--space-2)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {heading}
                </div>
                {groups[heading].map(renderRow)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
