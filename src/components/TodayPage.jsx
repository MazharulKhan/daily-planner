import { useCallback, useRef, useState } from 'react';
import '../styles/cards.css';
import '../styles/task-row.css';
import '../styles/progress.css';
import TaskRow from './TaskRow';
import TaskEditForm from './TaskEditForm';
import TaskDeleteConfirm from './TaskDeleteConfirm';
import AddTaskTrigger from './AddTaskTrigger';
import EmptyState from './EmptyState';
import { sortTodayTasks, isOverdue, isTodayOrPast, isCompletedToday } from '../utils/dateTime';

const CATEGORIES = ['All', 'Work', 'Learning', 'Personal', 'Health'];
const COMPLETED_PREVIEW_LIMIT = 3;

function encouragement(pct) {
  if (pct === 100) return 'Perfect day! Every task done.';
  if (pct >= 75) return 'Almost there — finish strong.';
  if (pct >= 50) return 'Halfway through. Keep going!';
  if (pct > 0) return 'Good start. One step at a time.';
  return 'Ready when you are. Pick a task to begin.';
}

export default function TodayPage({
  tasks,
  onToggle,
  onOpenDetail,
  onEditTask,
  onDeleteTask,
  onRequestAdd,
  onViewAllCompleted,
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [activeTaskAction, setActiveTaskAction] = useState(null);
  const lastTriggerRef = useRef(null);

  const pool = tasks.filter((t) => isTodayOrPast(t.dueDate));
  const filtered =
    categoryFilter === 'All' ? pool : pool.filter((t) => t.category === categoryFilter);

  const active = filtered.filter((t) => !t.completed).sort(sortTodayTasks);
  const completedToday = filtered.filter(
    (t) => t.completed && isCompletedToday(t.completedAt),
  );
  const completedHasOverflow = completedToday.length > COMPLETED_PREVIEW_LIMIT;
  const completedListExpanded = completedHasOverflow && completedExpanded;
  const visibleCompletedToday =
    completedListExpanded || !completedHasOverflow
      ? completedToday
      : completedToday.slice(0, COMPLETED_PREVIEW_LIMIT);
  const hiddenCompletedTodayCount =
    completedToday.length - visibleCompletedToday.length;
  const overdueActive = active.filter((t) => isOverdue(t.dueDate));
  const restActive = active.filter((t) => !isOverdue(t.dueDate));

  const totalDaily = pool.length;
  const doneDaily = pool.filter((t) => t.completed).length;
  const pctDaily = totalDaily === 0 ? 0 : Math.round((doneDaily / totalDaily) * 100);
  const allDone = filtered.length > 0 && active.length === 0;
  const filteredEmpty = pool.length > 0 && filtered.length === 0;

  function handleCategoryChange(cat) {
    setCategoryFilter(cat);
    setCompletedExpanded(false);
  }

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
          <h2 className="card__title">Today</h2>
          <span className="card__count">{filtered.length}</span>
        </div>
        <button
          type="button"
          className="card__view-all"
          onClick={onViewAllCompleted}
        >
          View Completed
        </button>
      </div>

      {pool.length > 0 && (
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
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      <div className="card__body">
        {pool.length === 0 ? (
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
          <>
            <div
              className="progress__summary"
              style={{ marginBottom: 'var(--space-2)' }}
            >
              <strong>{doneDaily}</strong> of <strong>{totalDaily}</strong>{' '}
              tasks completed today
            </div>
            <div
              className="progress__note"
              style={{
                marginBottom: 'var(--space-4)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              {encouragement(pctDaily)}
            </div>
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
              {completedToday.length > 0 && (
                <div className="completed-divider">
                  <span className="completed-divider__label">
                    Completed Today · {completedToday.length}
                  </span>
                </div>
              )}
              {visibleCompletedToday.map(renderRow)}
              {completedHasOverflow && (
                <button
                  type="button"
                  className="completed-toggle"
                  aria-expanded={completedListExpanded}
                  onClick={() => setCompletedExpanded((expanded) => !expanded)}
                >
                  {completedListExpanded
                    ? 'Show less'
                    : `Show ${hiddenCompletedTodayCount} more`}
                </button>
              )}
            </div>
          </>
        )}

        <AddTaskTrigger onRequestAdd={onRequestAdd} />

        {allDone && (
          <div className="task-list__all-done">
            {categoryFilter === 'All'
              ? 'All done for today. Nice work!'
              : `All ${categoryFilter} tasks are complete.`}
          </div>
        )}
      </div>
    </div>
  );
}
