import '../styles/cards.css';
import '../styles/task-row.css';
import EmptyState from './EmptyState';
import { formatDueDate, isUpcoming } from '../utils/dateTime';

export default function UpcomingTasksCard({ tasks }) {
  const upcoming = tasks
    .filter((t) => isUpcoming(t.dueDate))
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Upcoming Tasks</h2>
          <span className="card__count">{upcoming.length}</span>
        </div>
        <button type="button" className="card__view-all">
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
            {upcoming.map((task) => (
              <div className="task-row" key={task.id}>
                <div className="task-row__main">
                  <span className="task-row__title">{task.title}</span>
                </div>
                {task.category && (
                  <div className="task-row__badges">
                    <span className="badge badge--category">{task.category}</span>
                  </div>
                )}
                <span className="task-row__due">{formatDueDate(task.dueDate)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
