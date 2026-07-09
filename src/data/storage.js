const KEYS = {
  tasks: 'dp.tasks',
  ideas: 'dp.ideas',
  activeView: 'dp.activeView',
};

const ACTIVE_VIEW_VALUES = new Set([
  'dashboard',
  'today',
  'upcoming',
  'completed',
  'quick-ideas',
]);

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable or full; fail silently for now
  }
}

function readActiveView(fallback) {
  try {
    const value = localStorage.getItem(KEYS.activeView);
    return ACTIVE_VIEW_VALUES.has(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function writeActiveView(value) {
  if (!ACTIVE_VIEW_VALUES.has(value)) return;
  try {
    localStorage.setItem(KEYS.activeView, value);
  } catch {
    // storage unavailable or full; fail silently for now
  }
}

export const storage = {
  loadTasks: (fallback) => read(KEYS.tasks, fallback),
  loadIdeas: (fallback) => read(KEYS.ideas, fallback),
  saveTasks: (tasks) => write(KEYS.tasks, tasks),
  saveIdeas: (ideas) => write(KEYS.ideas, ideas),
  loadActiveView: (fallback) => readActiveView(fallback),
  saveActiveView: (view) => writeActiveView(view),
};
