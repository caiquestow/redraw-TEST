"use client";

import { useState } from 'react';
import { generateImage } from '../services/huggingface';
import Link from 'next/link';
import { useGeneratedImages } from '../hooks/useGeneratedImages';
import { useCredits } from '../hooks/useCredits';
import { useApiKey } from '../hooks/useApiKey';
import { useUsername } from '../hooks/useUsername';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const { images, addImage, clearImages, toggleFavorite, isFavorite } = useGeneratedImages();
  const { credits, consumeCredits, resetCredits, COST_PER_IMAGE } = useCredits();
  const { apiKey, updateApiKey, hasApiKey } = useApiKey();
  const { username, updateUsername, hasUsername } = useUsername();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasApiKey()) {
      setError('Você precisa configurar uma API Key primeiro');
      setShowApiKeyConfig(true);
      return;
    }
    if (credits < COST_PER_IMAGE) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = await generateImage(prompt, apiKey);
      addImage({ url, prompt });
      consumeCredits();
    } catch (err: any) {
      console.error('Erro ao gerar imagem:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newApiKey = formData.get('apiKey') as string;
    if (newApiKey.trim()) {
      updateApiKey(newApiKey.trim());
      setShowApiKeyConfig(false);
      setError(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-100">
          Thark - Gerador de Imagens IA
        </h1>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 20,
          marginBottom: 30,
          padding: 20,
          backgroundColor: '#40414f',
          borderRadius: 8,
          color: '#ececf1',
          border: '1px solid #565869'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{credits}</div>
            <div style={{ fontSize: '0.9rem', color: '#8e8ea0' }}>Créditos disponíveis</div>
          </div>
          <div style={{ width: 1, height: 40, backgroundColor: '#565869' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{COST_PER_IMAGE}</div>
            <div style={{ fontSize: '0.9rem', color: '#8e8ea0' }}>Custo por imagem</div>
          </div>
          <button 
            onClick={resetCredits} 
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#40414f',
              border: '1px solid #565869',
              borderRadius: 6,
              color: '#ececf1',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
          >
            Resetar
          </button>
        </div>

        <div style={{ 
          marginBottom: 30, 
          padding: 20, 
          backgroundColor: '#40414f',
          borderRadius: 8,
          border: '1px solid #565869'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showApiKeyConfig ? 15 : 0 }}>
            <div>
              <strong style={{ color: '#ececf1', fontSize: '1.1rem', display: 'block', marginBottom: 5 }}>
                API Key do Hugging Face
              </strong>
              <div style={{ color: '#8e8ea0', fontSize: '0.95rem' }}>
                {hasApiKey() ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'Não configurada'}
              </div>
            </div>
            <button 
              onClick={() => setShowApiKeyConfig(!showApiKeyConfig)}
              style={{ 
                fontSize: '0.95rem', 
                padding: '10px 20px',
                backgroundColor: showApiKeyConfig ? '#dc2626' : (hasApiKey() ? '#059669' : '#3b82f6'),
                color: '#ececf1',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
            >
              {showApiKeyConfig ? 'Cancelar' : (hasApiKey() ? 'Alterar' : 'Configurar')}
            </button>
          </div>
          
          {showApiKeyConfig && (
            <div style={{ 
              padding: 20, 
              backgroundColor: '#343541', 
              borderRadius: 6, 
              border: '1px solid #565869',
              marginTop: 15
            }}>
              <div style={{ marginBottom: 15, fontSize: '1rem', color: '#ececf1' }}>
                <strong>Configure sua API Key:</strong>
                <div style={{ fontSize: '0.9rem', color: '#8e8ea0', marginTop: 5 }}>
                  Obtenha sua chave gratuita em{' '}
                  <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" 
                     style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
                    huggingface.co/settings/tokens
                  </a>
                </div>
              </div>
              
              <form onSubmit={handleApiKeySubmit}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', color: '#ececf1', marginBottom: 8, fontWeight: '500' }}>
                      Cole sua API Key:
                    </label>
                    <input
                      type="password"
                      name="apiKey"
                      placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px',
                        border: '1px solid #565869',
                        borderRadius: 6,
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        backgroundColor: '#40414f',
                        color: '#ececf1'
                      }}
                      defaultValue={apiKey}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{ 
                      padding: '12px 24px', 
                      fontSize: '1rem',
                      backgroundColor: '#059669',
                      color: '#ececf1',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {!hasApiKey() && (
          <div style={{ 
            marginBottom: 25, 
            padding: 16, 
            backgroundColor: '#dc2626', 
            border: '1px solid #dc2626', 
            borderRadius: 8,
            color: '#ececf1',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚠</span>
            <span style={{ fontWeight: '500' }}>Você precisa configurar uma API Key do Hugging Face para gerar imagens.</span>
          </div>
        )}
        
        <div style={{ 
          backgroundColor: '#40414f',
          padding: 30,
          borderRadius: 8,
          marginBottom: 30,
          border: '1px solid #565869'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ 
                display: 'block', 
                fontSize: '1.1rem', 
                color: '#ececf1', 
                marginBottom: 10,
                fontWeight: '500'
              }}>
                Descreva a imagem que você quer criar:
              </label>
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                required
                style={{ 
                  width: '100%',
                  padding: '15px 20px',
                  border: '1px solid #565869',
                  borderRadius: 6,
                  fontSize: '1.1rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  opacity: !hasApiKey() ? 0.6 : 1,
                  backgroundColor: '#343541',
                  color: '#ececf1'
                }}
                placeholder="Ex: fachada de casa moderna com madeira e vidro, arquitetura contemporânea"
                disabled={!hasApiKey()}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || credits < COST_PER_IMAGE || !hasApiKey()}
              style={{
                width: '100%',
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: '500',
                backgroundColor: loading || credits < COST_PER_IMAGE || !hasApiKey() 
                  ? '#565869' 
                  : '#059669',
                color: '#ececf1',
                border: 'none',
                borderRadius: 6,
                cursor: loading || credits < COST_PER_IMAGE || !hasApiKey() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Gerando...' : !hasApiKey() ? 'Configure API Key' : credits < COST_PER_IMAGE ? 'Sem créditos' : 'Gerar Imagem'}
            </button>
          </form>
        </div>
        
        {credits < COST_PER_IMAGE && hasApiKey() && (
          <div style={{ 
            color: '#dc2626', 
            marginBottom: 20,
            padding: 15,
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderRadius: 6,
            border: '1px solid rgba(220, 38, 38, 0.3)',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Você não possui créditos suficientes para gerar uma imagem.
          </div>
        )}
        
        {error && (
          <div style={{ 
            color: '#dc2626', 
            marginBottom: 20,
            padding: 15,
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            borderRadius: 6,
            border: '1px solid rgba(220, 38, 38, 0.3)',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 25 }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '600',
            color: '#ececf1',
            marginBottom: 10
          }}>
            Galeria de Imagens
          </h2>
          <p style={{ color: '#8e8ea0', fontSize: '1rem' }}>
            Suas criações ficam salvas aqui
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
            <p>Nenhuma imagem gerada ainda.</p>
            <p>Configure sua API Key e comece a criar!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
            marginTop: 20,
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
