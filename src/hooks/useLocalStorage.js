import { useCallback, useEffect, useState } from 'react';
import { storage } from '../data/storage';
import { migrateTasks } from '../data/migrate';

export function useTasks(initialTasks) {
  const [tasks, setTasks] = useState(() => {
    const saved = storage.loadTasks(null);
    if (saved && saved.length >= 0) {
      const migrated = migrateTasks(saved);
      storage.saveTasks(migrated);
      return migrated;
    }
    return initialTasks;
  });

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [...prev, { ...task, updatedAt: now }]);
  }, []);

  const editTask = useCallback((id, patch) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: now } : t)),
    );
  }, []);

  const toggleTask = useCallback((id) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, addTask, editTask, toggleTask, deleteTask };
}

export function useIdeas(initialIdeas) {
  const [ideas, setIdeas] = useState(() => {
    const saved = storage.loadIdeas(null);
    return saved && saved.length >= 0 ? saved : initialIdeas;
  });

  useEffect(() => {
    storage.saveIdeas(ideas);
  }, [ideas]);

  const addIdea = useCallback((idea) => {
    setIdeas((prev) => [idea, ...prev]);
  }, []);

  return { ideas, addIdea };
}
