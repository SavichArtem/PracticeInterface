import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    try {
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme === 'dark') {
        setDarkMode(true);
      } else if (savedTheme === 'light') {
        setDarkMode(false);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
      }
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (darkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [darkMode, isMounted]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Button variant="outline-secondary" onClick={toggleTheme} title={darkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}>
      {darkMode ? (
        <span aria-hidden="true">☀️</span>
      ) : (
        <span aria-hidden="true">🌙</span>
      )}
    </Button>
  );
}