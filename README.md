# Thark

Aplicação web para geração de imagens com IA a partir de prompts, utilizando Next.js, React e integração com API pública de geração de imagens.

> **Nota**: Meu background é mais voltado para backend e devops/cloud, mas já atuei como apoio de times frontend qdo necessário apesar de nao ser a minha zona de conforto resolvi fazer o projeto todo em next.js para simplificar.


## Stack Utilizada
- Next.js
- React
- API pública de geração de imagens (Hugging Face - Stable Diffusion XL)

## Instruções de Instalação e Execução

```bash
npm install
npm run dev
```

## Configuração da API

1. Configure sua API Key do Hugging Face diretamente no WEB da aplicação
2. Para obter a chave gratuita: https://huggingface.co/settings/tokens

## Docker

Para rodar via Docker:
```bash
docker build -t thark-web .
docker run -p 3000:3000 thark-web
```

## Funcionalidades
- **Geração de imagens via prompt**: O usuário insere um texto e gera uma imagem usando IA.
- **Galeria responsiva**: Todas as imagens geradas são exibidas em uma galeria adaptada para desktop e mobile.
- **Página de detalhes da imagem**: Cada imagem possui uma página dedicada com visualização ampliada, prompt, data, favoritar e compartilhar no perfil.
- **Favoritar imagens**: O usuário pode favoritar imagens, que ficam salvas no localStorage. A seção "Favoritos" exibe todas as favoritas.
- **Sistema de créditos fictício**: O usuário começa com 10 créditos. Cada geração consome 5 créditos. O botão de gerar imagem é desabilitado quando não há créditos suficientes. (É possível resetar os créditos para testes)
- **Compartilhar imagem em perfil público**: O usuário pode compartilhar uma imagem em um perfil público, acessível pela rota `/perfil/[username]`, que lista todas as imagens compartilhadas por esse usuário.
- **Navegação**: Header fixo com links para Home,  Favoritos e Perfil se já criado ao add uma imagem.

## O que foi implementado vs O que não foi implementado

### ✅ Implementado
- Geração de imagens com IA (Hugging Face - Stable Diffusion XL)
- Galeria responsiva para desktop e mobile
- Página de detalhes da imagem com todas as funcionalidades
- Sistema de favoritos com localStorage
- Sistema de créditos fictício (10 iniciais, 5 por imagem)
- Perfil público compartilhável via `/perfil/[username]`
- Interface responsiva
- Containerização com Docker
- Gerenciamento de estado com localstorage

### ❌ Não implementado
- Sistema de login/autenticação
- Backend próprio (utiliza API externa)
- Banco de dados (apenas localStorage)
- Edição de imagens
- Compartilhamento social
- Testes automatizados

## Explicações Técnicas

- Decidi usar o localstorage como armazenamento das imagens e estados para simplificar o processo a fins de demostração e não precisar da configuração de um banco de dados.
- O sistema de créditos pode ser resetado para facilitar testes.
- As chaves de API são configuradas diretamente na aplicação para facilitar o uso de chaves proprias e simplificar o sistema. O ideal seria armazenar essa chave em um local seguro como secrets do git se for uma chave de aplicação.
- Foi optado para realizar tudo em next.js dado que só seria necessario a chamada para o HF do lado do servidor, mas outra opção seria apartar o backend do projeto para simplificar a manutenção caso deixe de ser um BFF.

### Estrutura de Rotas
- `/`: Página principal com geração de imagens e galeria
- `/favoritos`: Página de imagens favoritadas
- `/image/[id]`: Página de detalhes da imagem
- `/perfil/[username]`: Perfil público do usuário
---

> Projeto desenvolvido para desafio técnico.
