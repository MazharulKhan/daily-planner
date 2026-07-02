import { useCallback, useEffect, useState } from 'react';
import { storage } from '../data/storage';

export function useTasks(initialTasks) {
  const [tasks, setTasks] = useState(() => {
    const saved = storage.loadTasks(null);
    return saved && saved.length >= 0 ? saved : initialTasks;
  });

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }, []);

  return { tasks, addTask, toggleTask };
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
