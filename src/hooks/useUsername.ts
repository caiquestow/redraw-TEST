import { useState, useEffect } from 'react';

const USERNAME_KEY = 'user_username';

export function useUsername() {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(USERNAME_KEY);
      if (stored) {
        setUsername(stored);
      }
    }
  }, []);

  const updateUsername = (newUsername: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USERNAME_KEY, newUsername);
      setUsername(newUsername);
    }
  };

  const hasUsername = username.trim().length > 0;

  return { username, updateUsername, hasUsername };
} 