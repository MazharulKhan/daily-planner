import '../styles/sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', interactive: true, icon: 'dashboard' },
  { id: 'today', label: 'Today', interactive: true, icon: 'today' },
  { id: 'upcoming', label: 'Upcoming', interactive: true, icon: 'upcoming' },
  { id: 'completed', label: 'Completed', interactive: true, icon: 'completed' },
  { id: 'quick-ideas', label: 'Quick Ideas', interactive: true, icon: 'ideas' },
];

function NavIcon({ name }) {
  const common = {
    className: 'sidebar__nav-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'today':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
          <path d="M12 14h1M12 14v4" />
        </svg>
      );
    case 'upcoming':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'completed':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    case 'ideas':
      return (
        <svg {...common}>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z" />
        </svg>
      );
    default:
      return null;
  }
}

function ThemeIcon({ isDark }) {
  const common = {
    className: 'sidebar__theme-icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  if (isDark) {
    return (
      <svg {...common}>
        <path d="M12 3a6 6 0 0 0 9 7.4A8 8 0 1 1 12 3Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export default function Sidebar({
  onAddTask,
  activeView,
  onNavigate,
  addDisabled,
  theme,
  onToggleTheme,
}) {
  const darkModeOn = theme === 'dark';

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-mark" aria-hidden="true">
          D
        </div>
        <div className="sidebar__brand-name">Daily Planner</div>
      </div>

      <button
        type="button"
        className={
          addDisabled ? 'sidebar__add sidebar__add--disabled' : 'sidebar__add'
        }
        onClick={onAddTask}
        disabled={addDisabled}
        aria-disabled={addDisabled || undefined}
      >
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
                <NavIcon name={item.icon} />
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
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar__spacer" />

      <button
        type="button"
        className={
          darkModeOn
            ? 'sidebar__theme-toggle sidebar__theme-toggle--active'
            : 'sidebar__theme-toggle'
        }
        role="switch"
        aria-checked={darkModeOn}
        aria-label="Toggle dark mode"
        onClick={onToggleTheme}
      >
        <span className="sidebar__theme-label">
          <ThemeIcon isDark={darkModeOn} />
          <span>Dark mode</span>
        </span>
        <span className="sidebar__theme-switch" aria-hidden="true">
          <span className="sidebar__theme-thumb" />
        </span>
      </button>
    </aside>
  );
}
