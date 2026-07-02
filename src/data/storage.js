const KEYS = {
  tasks: 'dp.tasks',
  ideas: 'dp.ideas',
};

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

export const storage = {
  loadTasks: (fallback) => read(KEYS.tasks, fallback),
  loadIdeas: (fallback) => read(KEYS.ideas, fallback),
  saveTasks: (tasks) => write(KEYS.tasks, tasks),
  saveIdeas: (ideas) => write(KEYS.ideas, ideas),
};
