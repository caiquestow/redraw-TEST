"use client";

import { useEffect, useState } from 'react';
import { useGeneratedImages, GeneratedImage } from '../../../hooks/useGeneratedImages';
import { useUsername } from '../../../hooks/useUsername';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ImagePage({ params }: PageProps) {
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageId, setImageId] = useState<string>('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const { toggleFavorite, isFavorite } = useGeneratedImages();
  const { username, updateUsername, hasUsername } = useUsername();

  useEffect(() => {
    params.then(({ id }) => {
      setImageId(id);
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('generated_images');
        if (stored) {
          try {
            const images: GeneratedImage[] = JSON.parse(stored);
            const found = images.find(img => img.id === id);
            setImage(found || null);
          } catch (error) {
            console.error('Error parsing images:', error);
            setImage(null);
          }
        } else {
          setImage(null);
        }
        setLoading(false);
      }
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
          Carregando...
        </div>
      </div>
    );
  }

  if (!image) {
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
          padding: 40,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>❌</div>
          <h1 style={{ 
            fontSize: '2rem', 
            color: '#dc2626',
            marginBottom: 15
          }}>
            Imagem não encontrada
          </h1>
          <p style={{ color: '#8e8ea0', marginBottom: 30 }}>
            A imagem que você está procurando não existe ou foi removida.
          </p>
          
          <Link href="/" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#ececf1',
            textDecoration: 'none',
            borderRadius: 6,
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}>
            Voltar ao Início
          </Link>
        </main>
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
        <div style={{ marginBottom: 30 }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            marginBottom: 20
          }}>
            ← Voltar à Galeria
          </Link>
          
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '600',
              color: '#ececf1',
              marginBottom: 10
            }}>
              Detalhes da Imagem
            </h1>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'start'
        }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src={image.url} 
              alt={image.prompt} 
              style={{ 
                width: '100%', 
                maxWidth: 500,
                borderRadius: 6,
                border: '1px solid #565869'
              }} 
            />
          </div>
          
          <div>
            <div style={{ 
              backgroundColor: '#40414f',
              padding: 25,
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #565869'
            }}>
              <h2 style={{ 
                fontSize: '1.3rem', 
                color: '#ececf1',
                marginBottom: 15,
                fontWeight: '600'
              }}>
                Prompt utilizado:
              </h2>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#8e8ea0',
                lineHeight: 1.6,
                margin: 0
              }}>
                {image.prompt}
              </p>
            </div>

            <div style={{ 
              backgroundColor: '#40414f',
              padding: 25,
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #565869'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                color: '#ececf1',
                marginBottom: 15,
                fontWeight: '600'
              }}>
                Informações:
              </h3>
              <div style={{ color: '#8e8ea0', fontSize: '1rem' }}>
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ color: '#ececf1' }}>Data de criação:</strong> {new Date(image.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 15 }}>
              <button 
                onClick={() => toggleFavorite(image.id)}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  backgroundColor: isFavorite(image.id) 
                    ? '#dc2626' 
                    : '#565869',
                  color: '#ececf1',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isFavorite(image.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </button>
              
              <button 
                onClick={() => {
                  if (!hasUsername) {
                    setShowUsernameModal(true);
                    return;
                  }
                  
                  // Adicionar ao perfil do usuário específico
                  const userImages = JSON.parse(localStorage.getItem(`shared_images_${username}`) || '[]');
                  const isAlreadyShared = userImages.includes(image.id);
                  
                  if (!isAlreadyShared) {
                    userImages.push(image.id);
                    localStorage.setItem(`shared_images_${username}`, JSON.stringify(userImages));
                    alert(`Imagem adicionada ao perfil @${username}!`);
                    // Redirecionar para o perfil
                    window.location.href = `/perfil/${username}`;
                  } else {
                    alert('Esta imagem já está no seu perfil público!');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '15px 20px',
                  backgroundColor: '#059669',
                  color: '#ececf1',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Compartilhar no Perfil Público
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal para configurar username */}
      {showUsernameModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#40414f',
            padding: 30,
            borderRadius: 8,
            border: '1px solid #565869',
            maxWidth: 400,
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#ececf1',
              marginBottom: 15,
              fontWeight: '600'
            }}>
              Configure seu Username
            </h3>
            <p style={{
              color: '#8e8ea0',
              marginBottom: 20,
              fontSize: '1rem'
            }}>
              Para adicionar imagens ao seu perfil público, você precisa configurar um username único.
            </p>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Digite seu username"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#343541',
                border: '1px solid #565869',
                borderRadius: 6,
                color: '#ececf1',
                fontSize: '1rem',
                marginBottom: 20
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  if (tempUsername.trim()) {
                    updateUsername(tempUsername.trim());
                    setShowUsernameModal(false);
                    setTempUsername('');
                    // Adicionar a imagem automaticamente após configurar o username
                    if (image) {
                      const userImages = JSON.parse(localStorage.getItem(`shared_images_${tempUsername.trim()}`) || '[]');
                      if (!userImages.includes(image.id)) {
                        userImages.push(image.id);
                        localStorage.setItem(`shared_images_${tempUsername.trim()}`, JSON.stringify(userImages));
                        alert(`Username configurado e imagem adicionada ao perfil @${tempUsername.trim()}!`);
                        // Redirecionar para o perfil
                        window.location.href = `/perfil/${tempUsername.trim()}`;
                      }
                    }
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: '#059669',
                  color: '#ececf1',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setShowUsernameModal(false);
                  setTempUsername('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  backgroundColor: '#565869',
                  color: '#ececf1',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 