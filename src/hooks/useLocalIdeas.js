import { useCallback, useEffect, useState } from 'react';
import { storage } from '../data/storage';
import { migrateIdeas } from '../data/migrate';

export function useLocalIdeas(initialIdeas) {
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
    setIdeas((current) => [
      {
        notes: '',
        ...idea,
        createdAt: idea.createdAt ?? now,
        updatedAt: idea.updatedAt ?? now,
      },
      ...current,
    ]);
  }, []);

  const editIdea = useCallback((id, patch) => {
    const now = new Date().toISOString();
    setIdeas((current) => current.map((idea) => (
      idea.id === id ? { ...idea, ...patch, updatedAt: now } : idea
    )));
  }, []);

  const deleteIdea = useCallback((id) => {
    setIdeas((current) => current.filter((idea) => idea.id !== id));
  }, []);

  return { ideas, addIdea, editIdea, deleteIdea };
}
