import '../styles/cards.css';
import '../styles/progress.css';

function encouragement(pct) {
  if (pct === 100) return 'Perfect day! Every task done.';
  if (pct >= 75) return 'Almost there — finish strong.';
  if (pct >= 50) return 'Halfway through. Keep going!';
  if (pct > 0) return 'Good start. One step at a time.';
  return 'Ready when you are. Pick a task to begin.';
}

export default function DailyProgressCard({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__title-row">
          <h2 className="card__title">Daily Progress</h2>
        </div>
      </div>

      <div className="card__body">
        <div className="progress">
          <div
            className={`progress__ring${total === 0 ? ' progress__ring--empty' : ''}`}
            style={{ '--pct': pct }}
            role="img"
            aria-label={`${pct}% complete, ${done} of ${total} tasks done`}
          >
            <div className="progress__inner">
              <span className="progress__pct">{pct}%</span>
            </div>
          </div>
          <div className="progress__summary">
            <strong>{done}</strong> of <strong>{total}</strong> tasks completed
            today
          </div>
          <div className="progress__legend">
            <span className="progress__legend-item">
              <span
                className="progress__legend-dot progress__legend-dot--completed"
                aria-hidden="true"
              />
              <span>Completed</span>
            </span>
          </div>
          <div className="progress__note">{encouragement(pct)}</div>
        </div>
      </div>
    </div>
  );
}
