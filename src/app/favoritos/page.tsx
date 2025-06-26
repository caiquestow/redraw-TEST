"use client";

import { useGeneratedImages } from '../../hooks/useGeneratedImages';
import Link from 'next/link';

export default function Favoritos() {
  const { images, isFavorite } = useGeneratedImages();
  
  // Filtrar apenas as imagens favoritadas
  const favoriteImages = images.filter(img => isFavorite(img.id));

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
            Favoritos
          </h1>
          <p style={{ color: '#8e8ea0', fontSize: '1.1rem' }}>
            Suas imagens favoritas em um só lugar
          </p>
        </div>

        {favoriteImages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 60, 
            color: '#8e8ea0',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 15 }}>📷</div>
            <p>Nenhuma imagem favoritada ainda.</p>
            <p>Gere algumas imagens e marque-as como favoritas!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
          }}>
            {favoriteImages.map(img => (
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