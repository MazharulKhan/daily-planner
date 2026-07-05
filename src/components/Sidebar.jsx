import '../styles/sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', interactive: true },
  { id: 'today', label: 'Today', interactive: false },
  { id: 'upcoming', label: 'Upcoming', interactive: false },
  { id: 'completed', label: 'Completed', interactive: false },
  { id: 'quick-ideas', label: 'Quick Ideas', interactive: true },
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

export default function Sidebar({ onAddTask, activeView, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark" aria-hidden="true">
          D
        </div>
        <div className="sidebar__brand-name">Daily Planner</div>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeView;
          const className =
            'sidebar__nav-item' +
            (isActive ? ' sidebar__nav-item--active' : '') +
            (item.interactive ? ' sidebar__nav-item--button' : ' sidebar__nav-item--placeholder');

          if (item.interactive) {
            return (
              <button
                key={item.id}
                type="button"
                className={className}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavigate?.(item.id)}
              >
                <NavIcon />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <div
              key={item.id}
              className={className}
              aria-disabled="true"
              title="Coming soon"
            >
              <NavIcon />
              <span>{item.label}</span>
            </div>
          );
        })}
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
