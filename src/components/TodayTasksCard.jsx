import '../styles/cards.css';
import '../styles/task-row.css';
import TaskRow from './TaskRow';
import AddTaskForm from './AddTaskForm';
import EmptyState from './EmptyState';

export default function TodayTasksCard({
  tasks,
  onToggle,
  onAdd,
  addOpen,
  onRequestAdd,
  onCloseAdd,
}) {
  const todayTasks = tasks;
  const pending = todayTasks.filter((t) => !t.completed).length;

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Today&apos;s Tasks</h2>
          <span className="card__count">{todayTasks.length}</span>
        </div>
        <button type="button" className="card__view-all">
          View all
        </button>
      </div>

      <div className="card__body">
        {todayTasks.length === 0 ? (
          <EmptyState
            title="No tasks for today"
            hint="Add your first task to get started."
            actionLabel="+ Add a task"
            onAction={onRequestAdd}
          />
        ) : (
          <div className="task-list">
            {todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={onToggle} />
            ))}
          </div>
        )}

        <AddTaskForm
          open={addOpen}
          onAdd={onAdd}
          onClose={onCloseAdd}
          onRequestOpen={onRequestAdd}
        />

        {todayTasks.length > 0 && pending === 0 && (
          <div
            style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-faint)',
            }}
          >
            All done for today. Nice work!
          </div>
        )}
      </div>
    </div>
  );
}
