# 🌍 Soletrando o Mundo

> **Jogo educativo e tátil de alfabetização fônica, vocabulário e montagem de cômodos em 3D para crianças de 4 a 6 anos.**  
> Desenvolvido com foco em **baixa estimulação sensorial**, acolhimento afetivo e alinhamento à **BNCC** (Educação Infantil e 1º ano).

---

## 🎯 Proposta Pedagógica & Princípios

- **Método Fônico Cadenciado:** A criança escuta cada sílaba individualmente com intervalo rítmico (700ms), permitindo associar o som da fala (fonema) à representação escrita (grafema), seguido da pronúncia natural da palavra inteira.
- **Voz Neural Acolhedora:** 100% narrado com voz neural expressiva e afetuosa (`pt-BR-FranciscaNeural`), sem uso de vozes robóticas ou sintéticas do navegador.
- **Baixa Estimulação Sensorial (Neuroeducação & SBP):** 
  - Paleta de cores pasteis, texturas suaves de massinha/argila 3D.
  - Efeitos sonoros táteis e orgânicos (madeira, cliques suaves, sinos mornos).
  - Sem contadores de tempo punitivos, sem luzes piscantes hiperestimulantes e sem anúncios.
- **Mecânica de Descoberta & Foco:**
  - O cômodo 3D inicia em desfoque suave (*soft blur*).
  - Na esteira inferior, os objetos permanecem como mistério (`???`) até serem soletrados com sucesso.
  - Ao completar os 8 itens oficiais do mundo, o desfoque é removido suavemente e a criança vê seu cômodo 100% montado e iluminado com comemoração acolhedora!
- **Slots Numerados e Apoio Visual:** Direcionalidade da leitura (1º, 2º, 3º da esquerda para a direita) e pílulas BNCC com curiosidades ortográficas simples.

---

## 🏡 Mundos & Vocabulário

### 🛏️ Mundo 1: Minha Casa — O Quarto Mágico
Contém os 8 itens oficiais integrados harmoniosamente ao diorama 3D:
1. **CAMA** (`CA` - `MA`): Silabação simples consoante-vogal.
2. **MESA** (`ME` - `SA`): S intervocálico com som de Z.
3. **SOFÁ** (`SO` - `FÁ`): Oxítona com acento agudo.
4. **BOLA** (`BO` - `LA`): Vogais abertas e articulação labial fácil.
5. **URSO** (`UR` - `SO`): Coda silábica em R.
6. **PORTA** (`POR` - `TA`): Fechamento labial com coda consonantal.
7. **TAPETE** (`TA` - `PE` - `TE`): Trissílabo cadenciado.
8. **ABAJUR** (`A` - `BA` - `JUR`): Vogal inicial isolada e coda em JUR.

### 🍎 Mundo 2: A Cozinha — Hora do Lanche
Trabalha alimentos saudáveis e utensílios cotidianos:
1. **BOLO** (`BO` - `LO`)
2. **SUCO** (`SU` - `CO`)
3. **SOPA** (`SO` - `PA`)
4. **MAÇÃ** (`MA` - `ÇÃ`)
5. **COPO** (`CO` - `PO`)
6. **PRATO** (`PRA` - `TO`)
7. **GARFO** (`GAR` - `FO`)
8. **BANANA** (`BA` - `NA` - `NA`)

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Linguagem & Framework** | React 19 + TypeScript |
| **Build Tool & Bundler** | Vite 8 |
| **Estilização** | Tailwind CSS v4 |
| **PWA & Offline** | Service Worker dedicado (`sw.js`) + Web App Manifest |
| **Nativo Mobile** | Capacitor 8 (Android) |
| **Voz & Fonética** | Microsoft Edge TTS Neural (`pt-BR-FranciscaNeural`) pré-gerado em alta fidelidade |
| **Efeitos Táteis** | Web Audio API com síntese de harmônicos mornos |

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+

### Instalação
```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```
Acesse `http://localhost:5173` no seu navegador.

---

## 🌐 Deploy no Netlify

O projeto já conta com [`netlify.toml`](./netlify.toml) e [`public/_redirects`](./public/_redirects) pré-configurados:

1. Suba o código para seu repositório no GitHub.
2. No painel do [Netlify](https://app.netlify.com/):
   - Clique em **"Add new site"** > **"Import an existing project"**.
   - Conecte com sua conta do GitHub e selecione o repositório `soletrando-o-mundo`.
   - O Netlify detectará as configurações automaticamente:
     - **Build command:** `pnpm run build`
     - **Publish directory:** `dist`
   - Clique em **Deploy site**.
3. Em poucos segundos o link de produção estará online!

> **💡 Dica para testar no celular/tablet:**
> Ao abrir o link do Netlify no Chrome (Android) ou Safari (iOS), use o menu de opções e toque em **"Adicionar à tela de início"** ou clique no botão **"Instalar App"** no topo da tela para rodar em tela cheia como um aplicativo de verdade!

---

## 📱 Build do Aplicativo Android (Capacitor)

Para gerar e testar a versão Android nativa no dispositivo:

```bash
# Compilar web assets e sincronizar com o projeto Android
pnpm run cap:sync

# Abrir o projeto no Android Studio
pnpm run cap:android
```

---

## 📄 Licença & Propósito

Projeto desenvolvido para alfabetização infantil humanizada e afetiva. Feito para aprender, brincar e soletrar em família! ❤️
