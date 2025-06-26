import { useEffect, useState } from 'react';

const STORAGE_KEY = 'user_api_key';

export function useApiKey() {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setApiKey(stored);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    }
  }, [apiKey]);

  function updateApiKey(newApiKey: string) {
    setApiKey(newApiKey);
  }

  function hasApiKey(): boolean {
    return apiKey.trim().length > 0;
  }

  return { apiKey, updateApiKey, hasApiKey };
} 