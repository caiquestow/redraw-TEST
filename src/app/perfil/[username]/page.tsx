"use client";

import { useEffect, useState } from 'react';
import { GeneratedImage } from '../../../hooks/useGeneratedImages';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ username: string }>;
}

function getSharedImages(username: string): GeneratedImage[] {
  if (typeof window === 'undefined') return [];
  
  // Buscar IDs das imagens compartilhadas pelo usuário
  const sharedIds: string[] = JSON.parse(localStorage.getItem(`shared_images_${username}`) || '[]');
  
  // Buscar todas as imagens geradas
  const stored = localStorage.getItem('generated_images');
  if (!stored) return [];
  
  try {
    const allImages: GeneratedImage[] = JSON.parse(stored);
    // Filtrar apenas as imagens que estão na lista de compartilhadas do usuário
    return allImages.filter(img => sharedIds.includes(img.id));
  } catch (error) {
    console.error('Erro ao carregar imagens do perfil:', error);
    return [];
  }
}

export default function Perfil({ params }: PageProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ username: usernameParam }) => {
      setUsername(usernameParam);
      const userImages = getSharedImages(usernameParam);
      setImages(userImages);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#343541',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          textAlign: 'center',
          color: '#ececf1',
          fontSize: '1.2rem'
        }}>
          Carregando perfil...
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#343541',
      padding: '20px'
    }}>
      <main style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        backgroundColor: '#343541',
        padding: 40
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '600', 
            color: '#ececf1',
            marginBottom: 10
          }}>
            Perfil Público
          </h1>
          <p style={{ color: '#8e8ea0', fontSize: '1.1rem' }}>
            @{username}
          </p>
        </div>

        {images.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 60, 
            color: '#8e8ea0',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 15 }}>📷</div>
            <p>Nenhuma imagem compartilhada neste perfil.</p>
            <p>Este usuário ainda não compartilhou suas criações.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {images.map(img => (
              <Link key={img.id} href={`/image/${img.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  border: '1px solid #565869',
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: '#40414f',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}>
                  <img 
                    src={img.url} 
                    alt={img.prompt} 
                    style={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover' 
                    }} 
                  />
                  <div style={{ 
                    padding: 15, 
                    fontSize: '0.9rem', 
                    color: '#ececf1',
                    lineHeight: 1.4
                  }}>
                    {img.prompt}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 