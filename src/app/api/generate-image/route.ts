import { NextRequest, NextResponse } from 'next/server';

// API route para geração de imagens
// Em um projeto real, eu implementaria rate limiting, cache (se fizer sentido) e logs estruturados
// Por enquanto, mantive simples para focar na funcionalidade
export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt é obrigatório' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key é obrigatória' }, { status: 400 });
    }

    const response = await fetch(
      `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 401) {
        return NextResponse.json({ error: 'API Key inválida. Verifique sua chave do Hugging Face.' }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: `Erro na geração da imagem: ${response.status}` 
      }, { status: response.status });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return NextResponse.json({ imageUrl: dataUrl });
  } catch (error) {
    console.error('Erro interno:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 