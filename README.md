# Mentoria de Inglês

Este projeto é uma landing page em Next.js para promover uma mentoria de inglês, com foco em conversão, tracking de eventos e integração com WhatsApp.

## Visão geral

A aplicação renderiza uma página inicial com:

- conteúdo de marketing e CTA principal
- variante A/B de texto para teste de conversão
- botão de WhatsApp com rastreamento de clique
- coleta de eventos com envio para Supabase
- persistência de parâmetros de campanha (`utm_*`, `video`) por sessão

## Stack principal

- Next.js 13
- React 18
- Tailwind CSS
- Supabase JS

## Estrutura do projeto

```text
.
├── components/
│   └── WhatsappButton.js
├── lib/
│   ├── sessionId.js
│   ├── supabaseServer.js
│   ├── testUrls.js
│   ├── track.js
│   ├── urlParams.js
│   └── visitorId.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   └── api/
│       └── events.js
├── styles/
│   └── globals.css
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── README.md
└── .env.local (não aparece no repositório, mas deve existir localmente)
```

## Arquivos principais

### `pages/index.js`

É a página principal da aplicação.

Responsabilidades:

- define a variante A/B com base no cookie `ab_variant`
- envia evento `page_view` no carregamento da página
- renderiza o hero, seções de apresentação e CTA final
- inclui o botão de WhatsApp em diferentes posições

Fluxo resumido:

1. `getServerSideProps` decide a variante da página (`A` ou `B`) com base em:
   - parâmetro `ab_variant` na query
   - cookie `ab_variant`
   - sorteio aleatório se nenhum valor existir
2. a página monta o conteúdo conforme a variante
3. `useEffect` dispara `track('page_view', ...)`

### `components/WhatsappButton.js`

Componente reutilizável para o botão de WhatsApp.

Responsabilidades:

- gera URL do WhatsApp
- envia evento `whatsapp_click`
- abre o link em nova aba
- envia metadados como `button_name`, `page`, `position`, `variant`

### `lib/track.js`

Centraliza o envio de eventos para a API interna.

O que faz:

- monta o payload com `event`, `metadata`, `visitor_id`, `session_id`, `page`
- captura `video`, `utm_source`, `utm_medium`, `utm_campaign`
- usa `navigator.sendBeacon` quando possível
- faz fallback para `fetch` e registra erros no console

### `lib/urlParams.js`

Gerencia parâmetros de URL persistidos em sessão.

Parâmetros rastreados:

- `video`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Isso permite que o projeto acompanhe a origem da visita ao longo da navegação.

### `lib/sessionId.js`

Cria e persiste um identificador de sessão em `sessionStorage`.

### `lib/visitorId.js`

Cria e persiste um identificador de visitante em cookie (`visitor_id`).

### `pages/_app.js`

Executa `initializeUrlParams()` ao carregar a aplicação para inicializar parâmetros vindos da URL.

### `pages/api/events.js`

Endpoint interno para registrar eventos no Supabase.

Responsabilidades:

- validar o método `POST`
- validar o nome do evento e o formato do `metadata`
- inserir os dados na tabela `events`
- registrar mensagens úteis para debug caso o Supabase não esteja configurado

### `lib/supabaseServer.js`

Cria o cliente server-side do Supabase com base em variáveis de ambiente.

## Fluxo de rastreamento

O fluxo geral é:

1. usuário acessa a página
2. `pages/index.js` define a variante A/B
3. `track.js` monta o payload
4. `track.js` envia para `/api/events`
5. `pages/api/events.js` grava no Supabase

## Variável de ambiente esperada

Para rodar corretamente, normalmente o projeto usa estas variáveis:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# ou
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Observação:

- para inserções no servidor, o ideal é usar `SUPABASE_SERVICE_ROLE_KEY`
- o README antigo mencionava `.env.example`, mas neste projeto atual a presença de `.env.local` é a prática mais comum

## Como rodar localmente

```bash
npm install
npm run dev
```

A aplicação normalmente fica disponível em:

```text
http://localhost:3000
```

## Como a página funciona em prática

### 1. A/B testing

O projeto decide a variante em `getServerSideProps`.

- se vier `ab_variant=A` ou `ab_variant=B` na URL, esse valor prevalece
- se não vier, tenta ler cookie `ab_variant`
- se ainda não existir, sorteia aleatoriamente entre `A` e `B`

### 2. Tracking de página

No carregamento da página, o código envia:

- `variant`
- `pathname`
- `referrer`
- `userAgent`
- `screenWidth`
- `screenHeight`

### 3. Tracking de clique no WhatsApp

Quando o usuário clica no botão, o projeto dispara um evento especial:

- `whatsapp_click`
- com metadados da página, botão e variante

### 4. Captação de origem da campanha

Os parâmetros de `URLSearchParams` são gravados em `sessionStorage` e enviados junto com os eventos, o que é útil para entender de onde veio o visitante.

## Observações importantes

- o projeto atualmente não parece ter testes automatizados configurados
- o Tailwind está sendo usado com CDN no HTML antigo, mas a estrutura atual do Next.js sugere que a configuração local deve ser revisada se necessário
- o projeto tem foco comercial/landing page e não é um app full-stack tradicional

## Dicas para entender melhor

Se você quiser navegar no código com mais clareza, comece nesta ordem:

1. `pages/index.js`
2. `components/WhatsappButton.js`
3. `lib/track.js`
4. `pages/api/events.js`
5. `lib/urlParams.js`
6. `lib/supabaseServer.js`

## Resumo curto

Este projeto é uma landing page de conversão em Next.js, com:

- conteúdo de venda
- variantes A/B
- botão de WhatsApp
- rastreamento de eventos
- integração com Supabase

Se quiser, posso continuar e criar uma segunda versão deste README em formato mais técnico, com diagramas de fluxo e explicação linha por linha dos principais arquivos.
