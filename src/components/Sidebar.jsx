import '../styles/sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'learning', label: 'Learning' },
  { id: 'reading', label: 'Reading' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'categories', label: 'Categories' },
];

function NavIcon() {
  return (
    <svg
      className="sidebar__nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Sidebar({ onAddTask }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark" aria-hidden="true">
          D
        </div>
        <div className="sidebar__brand-name">Daily Planner</div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`sidebar__nav-item${
              item.id === 'dashboard' ? ' sidebar__nav-item--active' : ''
            }`}
            aria-current={item.id === 'dashboard' ? 'page' : undefined}
          >
            <NavIcon />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar__spacer" />

      <button type="button" className="sidebar__add" onClick={onAddTask}>
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
    </aside>
  );
}
