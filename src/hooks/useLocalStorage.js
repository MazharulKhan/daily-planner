import { useCallback, useEffect, useState } from 'react';
import { storage } from '../data/storage';
import { migrateTasks, migrateIdeas } from '../data/migrate';

export function useTasks(initialTasks) {
  const [tasks, setTasks] = useState(() => {
    const saved = storage.loadTasks(null);
    if (saved && saved.length >= 0) {
      const migrated = migrateTasks(saved);
      storage.saveTasks(migrated);
      return migrated;
    }
    return migrateTasks(initialTasks);
  });

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((task) => {
    const now = new Date().toISOString();
    setTasks((prev) => [
      ...prev,
      {
        taskType: 'standard',
        youtubeUrl: '',
        youtubeNotes: '',
        lastWatchedSeconds: 0,
        ...task,
        completedAt: null,
        updatedAt: now,
      },
    ]);
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
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? now : null,
              updatedAt: now,
            }
          : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editPlaybackPosition = useCallback((id, seconds) => {
    const floored =
      typeof seconds === 'number' &&
      Number.isFinite(seconds) &&
      seconds >= 0
        ? Math.floor(seconds)
        : 0;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const current =
          typeof t.lastWatchedSeconds === 'number' &&
          Number.isFinite(t.lastWatchedSeconds) &&
          t.lastWatchedSeconds >= 0
            ? Math.floor(t.lastWatchedSeconds)
            : 0;
        if (current === floored) return t;
        return { ...t, lastWatchedSeconds: floored };
      }),
    );
  }, []);

  return { tasks, addTask, editTask, toggleTask, deleteTask, editPlaybackPosition };
}

export function useIdeas(initialIdeas) {
  const [ideas, setIdeas] = useState(() => {
    const saved = storage.loadIdeas(null);
    if (saved && saved.length >= 0) {
      const migrated = migrateIdeas(saved);
      storage.saveIdeas(migrated);
      return migrated;
    }
    return initialIdeas;
  });

  useEffect(() => {
    storage.saveIdeas(ideas);
  }, [ideas]);

  const addIdea = useCallback((idea) => {
    const now = new Date().toISOString();
    setIdeas((prev) => [
      {
        notes: '',
        ...idea,
        createdAt: idea.createdAt ?? now,
        updatedAt: idea.updatedAt ?? now,
      },
      ...prev,
    ]);
  }, []);

  const editIdea = useCallback((id, patch) => {
    const now = new Date().toISOString();
    setIdeas((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: now } : i)),
    );
  }, []);

  const deleteIdea = useCallback((id) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  return { ideas, addIdea, editIdea, deleteIdea };
}
