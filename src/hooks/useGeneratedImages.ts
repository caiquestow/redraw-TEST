import { useEffect, useState } from 'react';

// Interface que representa uma imagem gerada
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
}

const STORAGE_KEY = 'generated_images';
const FAVORITES_KEY = 'favorite_images';

// Função auxiliar para verificar se localStorage está disponível
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Função auxiliar para salvar no localStorage com tratamento de erro
function safeSetItem(key: string, value: string): boolean {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    return false;
  }
}

// Função auxiliar para ler do localStorage com tratamento de erro
function safeGetItem(key: string): string | null {
  try {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.error(`Erro ao ler ${key}:`, error);
    return null;
  }
}

// Em produção, eu implementaria um backend real com banco de dados
// localStorage foi escolhido para simplificar
export function useGeneratedImages() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega imagens e favoritos do localStorage ao inicializar
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      return;
    }

    // Carregar imagens
    const stored = safeGetItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedImages = JSON.parse(stored);
        if (Array.isArray(parsedImages)) {
          const validImages = parsedImages.filter((img: any) => 
            img && 
            typeof img === 'object' && 
            img.id && 
            img.url && 
            img.prompt && 
            img.createdAt
          );
          setImages(validImages);
        } else {
          setImages([]);
        }
      } catch (error) {
        console.error('Erro ao carregar imagens:', error);
        setImages([]);
      }
    } else {
      setImages([]);
    }
    
    // Carregar favoritos
    const storedFavorites = safeGetItem(FAVORITES_KEY);
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites([]);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Salva imagens no localStorage sempre que houver alteração
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    safeSetItem(STORAGE_KEY, JSON.stringify(images));
  }, [images, isLoaded]);

  // Salva favoritos no localStorage sempre que houver alteração
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    safeSetItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, isLoaded]);

  // Adiciona uma nova imagem gerada, atribuindo id e data únicos
  function addImage(image: Omit<GeneratedImage, 'id' | 'createdAt'>) {
    const newImage: GeneratedImage = {
      ...image,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    setImages(prev => [newImage, ...prev]);
  }

  function clearImages() {
    setImages([]);
  }

  function toggleFavorite(imageId: string) {
    setFavorites(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        return [...prev, imageId];
      }
    });
  }

  function isFavorite(imageId: string): boolean {
    return favorites.includes(imageId);
  }

  return { 
    images, 
    addImage, 
    clearImages, 
    toggleFavorite, 
    isFavorite, 
    isLoaded,
    localStorageAvailable: isLocalStorageAvailable()
  };
} 