# 🌍 Soletrando o Mundo — Guia do Desenvolvedor & Contexto de IA

Bem-vindo ao **Soletrando o Mundo**! Este arquivo serve como o mapa de contexto e diretrizes primárias para qualquer agente de IA ou desenvolvedor trabalhando neste repositório.

---

## 📌 Identidade e Propósito do Projeto
- **Público-alvo:** Crianças em fase de alfabetização (4 a 6 anos) e famílias.
- **Abordagem Pedagógica:** Método Fônico cadenciado com consciência fonológica e alinhamento à **BNCC** (Educação Infantil e 1º ano).
- **Sensibilidade Sensorial (SBP & Neuroeducação):** Design calmo e de **baixa estimulação sensorial** (cores pastel, texturas de massinha 3D, sons orgânicos de madeira e sinos, sem cronômetros ou sons estridentes de erro).
- **Comercial & Independência:** Projeto 100% autônomo, sem referências a Pokémon ou marcas de terceiros. Repositório oficial: \1felipeaac/soletrando-o-mundo\.

---

## 🛠️ Stack Tecnológica & Dependências
- **Linguagem & Framework:** React 19 + TypeScript (Strict Mode).
- **Build Tool:** Vite 8 com Tailwind CSS v4.
- **Gerenciador de Pacotes:** EXCLUSIVAMENTE \pnpm\ (v10+). Nunca use \
pm\ ou \yarn\.
- **Plataforma Mobile Nativa:** Capacitor 8 com plataforma Android (\com.felipecoelho.soletrando\).
- **PWA & Offline:** Service Worker dedicado (\public/sw.js\ na versão \soletrando-mundo-v2\), manifesto web e meta tags responsivas.
- **Hospedagem Web:** Netlify com build automático via \
etlify.toml\ e \public/_redirects\.

---

## 📂 Estrutura de Diretórios
\\\
soletrando-o-mundo/
├── .agents/                      # Customizações do Antigravity (regras e agentes)
│   ├── agents/scene-artist/      # Agente especializado de geração de arte 3D
│   └── rules/                    # Regras de pedagogia, design e desenvolvimento
├── android/                      # Projeto nativo Android (Capacitor)
├── docs/                         # Documentação profunda (ADR, Walkthrough, BNCC)
│   ├── DECISION_LOG.md           # Histórico de decisões arquiteturais (ADR)
│   ├── FUNDAMENTACAO_PEDAGOGICA.md # Alinhamento BNCC e fonoaudiologia
│   ├── IMPLEMENTATION_PLAN.md    # Plano de evolução arquitetural
│   └── WALKTHROUGH.md            # Documentação técnica detalhada das etapas
├── public/
│   ├── _redirects                # Roteamento SPA do Netlify (sem BOM)
│   ├── audio/                    # Áudios gravados com voz FranciscaNeural
│   ├── icons/                    # Ícones PWA adaptativos
│   ├── images/                   # Cenas 3D e itens ilustrados
│   ├── manifest.webmanifest      # Manifesto PWA
│   └── sw.js                     # Service Worker PWA (soletrando-mundo-v2)
├── scripts/
│   ├── scene_generator_agent.py  # Gerador dinâmico de prompts de cena 3D
│   ├── sync_audio.py             # Gerador/sincronizador de áudio neural TTS
│   └── sync-audio.mjs            # Alternativa JS para geração de áudio
├── src/
│   ├── assets/                   # Imagens e vetores do app
│   ├── components/               # Componentes React da interface
│   │   ├── Footer.tsx            # Rodapé acolhedor
│   │   ├── ItemIllustration.tsx  # Renderizador de itens com fallback suave
│   │   ├── Navbar.tsx            # Cabeçalho com botão PWA e trava parental
│   │   ├── ParentalGateModal.tsx # Trava de segurança para adultos (cálculo simples)
│   │   ├── SceneBuilder.tsx      # Visualizador de cômodos 3D com blur progressivo
│   │   ├── WordArena.tsx         # Arena de soletração silábica tátil
│   │   └── WorldSelect.tsx       # Seletor de mundos e cômodos
│   ├── data/
│   │   └── worldsData.ts         # FONTE DA VERDADE de mundos, itens e sílabas
│   ├── services/
│   │   ├── pwaService.ts         # Detecção e instalação de PWA
│   │   ├── soundService.ts       # Efeitos sonoros táteis via Web Audio API
│   │   ├── speechService.ts      # Reprodução fonética neural cadenciada
│   │   └── storageService.ts     # Persistência de progresso local (localStorage)
│   ├── types/
│   │   └── game.ts               # Tipos TypeScript do jogo
│   ├── App.tsx                   # Fluxo principal e máquina de estados
│   ├── index.css                 # Configuração Tailwind CSS v4
│   └── main.tsx                  # Ponto de entrada React e registro de SW
├── netlify.toml                  # Configuração de build do Netlify (UTF-8 sem BOM)
└── README.md                     # Documentação pública do repositório
\\\

---

## 🎨 Regras de Ouro de Interface & Arte 3D

1. **Mecânica de Foco e Desfoque:**
   - O cômodo 3D inicia com \lur-md scale-105\.
   - Os cards de itens na esteira inferior iniciam como \???\ até serem soletrados.
   - Quando todos os itens do cômodo são completados, o desfoque é removido suavemente para \ilter-none scale-100\.

2. **Coerência de Itens Obrigatórios:**
   - Todo item cadastrado em \src/data/worldsData.ts\ para um cômodo DEVE estar visível e reconhecível na arte 3D daquele cômodo.
   - Quarto (8 itens): \cama\, \mesa\, \sofa\, \ola\, \urso\, \porta\, \	apete\ e \bajur\.
   - Cozinha (8 itens): \olo\, \suco\, \sopa\, \maca\, \copo\, \prato\, \garfo\ e \anana\.

3. **Áudio 100% Neural de Estúdio:**
   - NUNCA use a API nativa \speechSynthesis\ do navegador.
   - Sempre utilize os arquivos de áudio gravados com \pt-BR-FranciscaNeural\ via \speechService.ts\.
   - Ao tocar o botão SOM, execute as sílabas com intervalo de 700ms entre cada uma e pausa de 250ms antes da palavra inteira.

---

## ⚡ Comandos Essenciais

\\\ash
# Instalação
pnpm install

# Desenvolvimento local
pnpm dev

# Build de produção (TypeScript + Vite)
pnpm run build

# Sincronização de novos áudios neurais
pnpm run sync-audio

# Sincronização e execução Android
pnpm run cap:sync
pnpm run cap:android
\\\

---

## 🌐 Cuidados no Deploy (Netlify e PWA)
- **UTF-8 Sem BOM:** Arquivos como \
etlify.toml\ e \public/_redirects\ NUNCA devem ter o caractere invisível BOM (\\xEF\xBB\xBF\), pois quebram o parser do Netlify.
- **Cache Busting:** Imagens e assets estáticos reutilizados devem receber query de versão nas URLs (ex: \/images/bedroom_scene.jpg?v=2\) para evitar persistência no Service Worker.