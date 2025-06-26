import { useEffect, useState } from 'react';

const STORAGE_KEY = 'user_credits';
const INITIAL_CREDITS = 10;
const COST_PER_IMAGE = 5;

export function useCredits() {
  const [credits, setCredits] = useState(INITIAL_CREDITS);

  // Carrega créditos do localStorage ao inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCredits(Number(stored));
    }
  }, []);

  // Salva créditos no localStorage sempre que houver alteração
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(credits));
    }
  }, [credits]);

  // Consome créditos ao gerar imagem, retorna false se não houver saldo
  function consumeCredits() {
    if (credits >= COST_PER_IMAGE) {
      setCredits(c => c - COST_PER_IMAGE);
      return true;
    }
    return false;
  }

  // Reseta créditos para o valor inicial
  function resetCredits() {
    setCredits(INITIAL_CREDITS);
  }

  return { credits, consumeCredits, resetCredits, COST_PER_IMAGE };
} 