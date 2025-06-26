// Serviço para integração com a API Hugging Face

/**
 * Gera uma imagem usando o modelo Stable Diffusion XL via Hugging Face
 * @param prompt
 * @param apiKey
 */
export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, apiKey }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao gerar imagem');
  }

  const data = await response.json();
  return data.imageUrl;
} 