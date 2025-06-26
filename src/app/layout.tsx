"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { useUsername } from "../hooks/useUsername";

const inter = Inter({ subsets: ["latin"] });

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { username, hasUsername } = useUsername();

  return (
    <html lang="pt-BR">
      <head>
        <title>Thark - Gerador de Imagens com IA</title>
        <meta name="description" content="Transforme suas ideias em imagens incríveis usando inteligência artificial" />
      </head>
      <body className={inter.className} style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: 1.6,
        color: '#ececf1',
        backgroundColor: '#343541'
      }}>
        <header style={{
          backgroundColor: '#202123',
          color: '#ececf1',
          padding: '12px 0',
          borderBottom: '1px solid #4a4b53',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <nav style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '600', color: '#ececf1' }}>
             Thark
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <a href="/" style={{ 
                color: '#ececf1', 
                textDecoration: 'none', 
                padding: '8px 16px',
                borderRadius: 6,
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}>
                Início
              </a>
              <a href="/favoritos" style={{ 
                color: '#ececf1', 
                textDecoration: 'none', 
                padding: '8px 16px',
                borderRadius: 6,
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}>
                Favoritos
              </a>
              {hasUsername && (
                <a href={`/perfil/${username}`} style={{ 
                  color: '#ececf1', 
                  textDecoration: 'none', 
                  padding: '8px 16px',
                  borderRadius: 6,
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}>
                  Meu Perfil (@{username})
                </a>
              )}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
