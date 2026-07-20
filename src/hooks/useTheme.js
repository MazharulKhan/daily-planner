import { useCallback, useLayoutEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'dp.theme';

function normalizeTheme(value) {
  return value === 'dark' || value === 'light' ? value : 'light';
}

function loadThemePreference() {
  if (typeof window === 'undefined') return 'light';
  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'light';
  }
}

function saveThemePreference(theme) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(loadThemePreference);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      saveThemePreference(nextTheme);
      return nextTheme;
    });
  }, []);

  return { theme, toggleTheme };
}