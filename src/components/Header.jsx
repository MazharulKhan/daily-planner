import '../styles/header.css';
import { greeting, todayLabel } from '../utils/dateTime';

const VIEW_TITLES = {
  dashboard: { title: 'Dashboard', subtitle: `${greeting()}! Here\u0027s your overview for today — ${todayLabel()}.` },
  today: { title: 'Today', subtitle: `${greeting()}! Here is what you need to focus on today.` },
  upcoming: { title: 'Upcoming', subtitle: 'Your upcoming tasks and deadlines.' },
  completed: { title: 'Completed', subtitle: 'Everything you have finished so far.' },
};

export default function Header({ onAddTask, activeView, detailOpen }) {
  const showTitle = activeView !== 'quick-ideas' && !detailOpen;
  const page = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard;

  return (
    <header className="header">
      {showTitle ? (
        <div className="header__title-block">
          <h1 className="header__title">{page.title}</h1>
          <p className="header__subtitle">{page.subtitle}</p>
        </div>
      ) : detailOpen ? (
        <div />
      ) : (
        <div className="header__title-block header__title-block--hidden" aria-hidden="true" />
      )}

      {!detailOpen && (
        <div className="header__actions">
          <div className="header__search">
            <svg
              className="header__search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              className="header__search-input"
              placeholder="Search tasks, ideas, categories..."
              aria-label="Search"
            />
          </div>

          <button type="button" className="header__add" onClick={onAddTask}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Task
          </button>
        </div>
      )}
    </header>
  );
}
