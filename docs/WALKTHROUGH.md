# Walkthrough: Projeto Comercial 'Soletrando o Mundo' 🌍

Documentação técnica e pedagógica completa do aplicativo **Soletrando o Mundo**, um jogo educativo de alfabetização fônica, montagem de cômodos em 3D e expansão de vocabulário infantil (BNCC: Educação Infantil e 1º ano do Ensino Fundamental), desenvolvido para Web (PWA) e Android nativo (Capacitor).

---

## 1. Visão Geral e Arquitetura do Projeto

O projeto está localizado no diretório independente:
`c:\Users\felip\Documents\Projetos\soletrando-o-mundo`

### 🛠️ Stack Tecnológica:
- **Frontend & Runtime:** React 19, TypeScript, Vite 8, Tailwind CSS v4.
- **Plataforma Mobile Nativa:** Capacitor 8 com plataforma Android configurada (`com.felipecoelho.soletrando`).
- **Suporte PWA:** Service Worker com cache offline completo, manifesto de aplicativo web, ícones adaptativos e detecção de instalação móvel/desktop.
- **Áudio & Fonética:** 100% Neural de estúdio (`pt-BR-FranciscaNeural`), sem uso de voz robótica sintética do navegador (`speechSynthesis`), com Web Audio API para efeitos sonoros táteis e não-hiperestimulantes (madeira, sinos suaves, cliques orgânicos).
- **Acessibilidade e Ergonomia Infantil:** Atende diretrizes WCAG e recomendações da Sociedade Brasileira de Pediatria (SBP) para telas infantis (botões táteis com área mínima de 64-72px, fontes de alta legibilidade, cores mornas/pastel e baixa estimulação sensorial).

---

## 2. Estrutura Pedagógica & Mundos (worldsData.ts)

A base de dados estruturada em [src/data/worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts) organiza o aprendizado em cômodos e temas do cotidiano da criança.

### 🏡 Mundo 1: Minha Casa — O Quarto Mágico
O quarto infantil foca em palavras bissetoriais e trissilábicas de alta frequência, contendo obrigatoriamente os 8 itens oficiais:
1. 🛏️ **CAMA** (`CA` - `MA`): Bissetorial simples consoante-vogal (C-V).
2. 🗄️ **MESA** (`ME` - `SA`): S com som de Z intervocálico (ME-ZA).
3. 🛋️ **SOFÁ** (`SO` - `FÁ`): Oxítona com acento agudo fonético.
4. ⚽ **BOLA** (`BO` - `LA`): Sílabas orais abertas e transparentes.
5. 🧸 **URSO** (`UR` - `SO`): Coda silábica (vogal + consoante R).
6. 🚪 **PORTA** (`POR` - `TA`): R na primeira sílaba com fechamento labial.
7. 🧶 **TAPETE** (`TA` - `PE` - `TE`): Palavra trissílaba cadenciada.
8. 💡 **ABAJUR** (`A` - `BA` - `JUR`): Vogal inicial isolada e terminação em JUR.

### 🍎 Mundo 2: A Cozinha — Hora do Lanche
O ambiente da cozinha trabalha alimentos e utensílios do cotidiano:
1. 🎂 **BOLO** (`BO` - `LO`)
2. 🧃 **SUCO** (`SU` - `CO`)
3. 🥣 **SOPA** (`SO` - `PA`)
4. 🍎 **MAÇÃ** (`MA` - `ÇÃ`): Som nasal de cedilha.
5. 🥛 **COPO** (`CO` - `PO`)
6. 🍽️ **PRATO** (`PRA` - `TO`): Encontro consonantal complexo (PR).
7. 🍴 **GARFO** (`GAR` - `FO`): Coda silábica em R.
8. 🍌 **BANANA** (`BA` - `NA` - `NA`): Trissílabo com repetição silábica.

---

## 3. Dinâmica de Montagem do Cenário (Mecânica de Revelação por Foco & Desfoque)

Para eliminar poluição visual e manter o mistério, o encantamento e a ergonomia sensorial das crianças:

1. **Imagem Isométrica 3D com Desfoque Suave (`blur-md scale-105`):**
   - O quarto completo em 3D estilo massinha modelada inicia desfocado em segundo plano.
   - Não há manchas pretas, sombras falsas nem pinos de interrogação obstruindo a beleza da imagem.
   
2. **Cards Misteriosos dos Itens:**
   - Na esteira inferior, os itens ainda não soletrados mantêm o nome protegido como `???` (mesmo quando selecionados para jogo), garantindo que a descoberta seja uma recompensa pedagógica.
   - Conforme cada palavra é soletrada com sucesso, seu card é revelado com nome e ilustração colorida com selo dourado de concluído (`✓`).

3. **Desfoque Retirado ao Completar o Cômodo (100% Nítido):**
   - Assim que o 8º item é completado, o filtro de desfoque é removido (`filter-none scale-100 transition-all duration-700`), revelando todo o ambiente 3D nítido e iluminado com os 8 itens coerentes (`cama`, `mesa`, `sofá`, `bola`, `urso`, `porta`, `tapete`, `abajur`).
   - O banner de comemoração *"Quarto Completo! 🏆"* é exibido elegantemente acima do cenário.

4. **Cache-Busting & Atualização Imediata:**
   - URLs de imagens de cena usam versão de cache (ex: `/images/bedroom_scene.jpg?v=2`).
   - O Service Worker PWA (`public/sw.js`) foi atualizado para `soletrando-mundo-v2` para expurgar versões em cache antigo automaticamente na inicialização.

---

## 4. Arena Silábica & Serviço de Áudio Neural (speechService.ts)

1. **Botão SOM (Soletração Compassada):**
   - Toca cada sílaba individualmente com a voz natural acolhedora da Francisca (`pt-BR-FranciscaNeural`).
   - Respeita uma pausa compassada de **700ms** entre cada sílaba para a criança assimilar os fonemas.
   - Pausa de **250ms** e sintetiza a palavra inteira acolhedora.
   - Controle atômico com `currentSequenceId`: tocar em sílabas ou navegar cancela a sequência antiga sem risco de auto-interrupção ou bugs de concorrência.

2. **Botão Dica:**
   - Reproduz a dica em áudio neural acolhedor descrevendo a função e o significado afetivo do objeto.

3. **Pílula Pedagógica BNCC:**
   - Destaca as regras ortográficas e fonéticas (ex: *C com A faz CÁ*, *O S entre duas vogais ganha o som de Z*).

4. **Slots de Encaixe:**
   - Casinhas numeradas (`1º`, `2º`, `3º`) para reforçar a direção da leitura ocidental (esquerda para a direita).
   - Clique tátil devolve a sílaba para a esteira com som suave de madeira.

---

## 5. Responsividade Web e PWA

1. **Progressive Web App (PWA):**
   - [public/manifest.webmanifest](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/manifest.webmanifest) configurado com nome, tema, cores de fundo e ícones vetoriais.
   - [public/sw.js](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/sw.js) gerencia cache com estratégia *Cache First, Network Fallback* para áudios e imagens.
   - [pwaService.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/services/pwaService.ts) detecta o evento `beforeinstallprompt` e exibe o botão discreto *"Instalar App"* no Header.

2. **Responsividade Fluida:**
   - Suporte completo de 320px a telas grandes de desktop e tablets em orientação paisagem e retrato.
   - Ilustrações e cards com centralização estrita (`mx-auto`, `object-contain`).
   - Tipografia responsiva com Tailwind (`text-xs xs:text-sm sm:text-base md:text-lg`).

---

## 6. Trava Parental com Desafio Matemático

- [ParentalGateModal.tsx](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/components/ParentalGateModal.tsx) protege configurações de áudio e reinicialização de progresso contra toques acidentais infantis.
- Desafios simples de adição/subtração com alternativas em grade grande para resposta rápida dos pais.

---

## 7. Agente de Criação de Cenários (Design System & Prompt Generator)

- O agente autônomo registrado no ecossistema (`scene-artist`) e o script [scripts/scene_generator_agent.py](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/scripts/scene_generator_agent.py) leem diretamente o [worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts), extraem os itens obrigatórios e produzem os prompts fotográficos consistentes com o Design System.
- Preserva a iluminação, paleta pastel suave, estilo de argila 3D e geometria isométrica para garantir uniformidade em todos os cômodos presentes e futuros.

---

## 8. Alinhamento Estrito do Quarto & Verificação Concluída 🎯

### 📋 Itens Oficiais do Quarto Sincronizados
Os 8 itens do Quarto no [worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts) foram 100% restabelecidos:
1. 🛏️ **CAMA** (`CA` - `MA`) — x: 46%, y: 44%
2. 🗄️ **MESA** (`ME` - `SA`) — x: 76%, y: 56%
3. 🛋️ **SOFÁ** (`SO` - `FÁ`) — x: 22%, y: 64%
4. ⚽ **BOLA** (`BO` - `LA`) — x: 68%, y: 76%
5. 🧸 **URSO** (`UR` - `SO`) — x: 44%, y: 36%
6. 🚪 **PORTA** (`POR` - `TA`) — x: 14%, y: 30%
7. 🧶 **TAPETE** (`TA` - `PE` - `TE`) — x: 46%, y: 72%
8. 💡 **ABAJUR** (`A` - `BA` - `JUR`) — x: 62%, y: 44%

### 🎨 Cenários e Stickers Atualizados
- **Cena Completa ([bedroom_scene.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene.jpg)):** Contém todos os 8 itens integrados com sombras de contato e harmonia visual do Design System 3D isométrico.
- **Cena Sombreada ([bedroom_scene_shadowed.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene_shadowed.jpg)):** As silhuetas misteriosas reproduzem com exatidão a geometria de cada um dos 8 itens para o encaixe dos stickers durante a soletração.
- **Stickers Transparentes ([public/images/stickers/](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/stickers/)):** Gerados com canal alfa suave para `cama.png`, `mesa.png`, `sofa.png`, `bola.png`, `urso.png`, `porta.png`, `tapete.png` e `abajur.png`.

### 🚀 Validação & Build
- `pnpm run build`: Compilação TypeScript e empacotamento Vite concluídos com sucesso em **2.70s**.
- `npx cap sync android`: Sincronização limpa com o projeto nativo Android em **0.60s**.
- Git Commit: `0c2f468` (`feat: align bedroom items with worldsData, create scene-artist agent and generate synchronized complete and shadowed scenes`).

---

## 9. Agente de Cenários 100% Dinâmico com Variáveis e Templates ⚡

Para suportar a criação de dezenas de novos cômodos sem inflar o código com dicionários estáticos manuais:

### 🧩 Arquitetura Dinâmica Implementada em [scene_generator_agent.py](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/scripts/scene_generator_agent.py):
1. **Templates de Categoria (`CATEGORY_TEMPLATES`):**
   - Usa variáveis interpoladas `{label}`, `{name}` e `{placement}` por categoria semântica (`furniture`, `toy`, `food`, `decoration`, `structure`, `utensil`, `animal`, `plant`, `clothing`, `vehicle`).
   - Exemplo: `a cozy 3D clay {label} ({name}) with smooth rounded edges, positioned {placement}`.
2. **Presets de Iluminação e Paleta por Tema (`THEME_ENVIRONMENTS`):**
   - Injeta dinamicamente as variáveis de ambiente baseadas no tema do mundo (`casa`, `comida`, `natureza`, `escola`, etc.):
     - `{room_type}`
     - `{walls}`
     - `{floor}`
     - `{lighting}`
     - `{palette}`
3. **Extração Automática dos Metadados do [worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts):**
   - O agente lê diretamente os campos já existentes no objeto:
     - `label` (`roomPlacement.label`)
     - `placement` (`roomPlacement.description`)
     - `category`
     - `name` / `displayName`
4. **Override Opcional com `visualPrompt` em [game.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/types/game.ts):**
   - Caso um item específico precise de detalhes artísticos únicos (ex: vela de aniversário no bolo), basta preencher o campo opcional `visualPrompt?: string` no `worldsData.ts`. Se omitido, a síntese dinâmica gera automaticamente a descrição perfeita.
5. **Comandos CLI Paramétricos:**
   - `python scripts/scene_generator_agent.py 1` (gera prompt para o Mundo 1).
   - `python scripts/scene_generator_agent.py 2` (gera prompt para o Mundo 2).
   - `python scripts/scene_generator_agent.py --all` (itera sobre todos os mundos existentes no jogo).

- Git Commit: `5bbe5de` (`feat: make scene_generator_agent dynamic using variables, category templates and worldsData metadata`).

---

## 10. Nova Estratégia Visual Serena: Cenário em Blur e Revelação Progressiva 🖼️

Para eliminar a poluição visual dos blocos escuros e dos botões de interrogação sobrepostos ao cenário:

### 🌟 Mecânica Refinada e Serena:
1. **Fim dos Manchas Escuras e Botões de '?' no Cenário:**
   - A imagem do cômodo é sempre a foto original 3D isométrica limpa e bela ([bedroom_scene.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene.jpg) e [kitchen_scene.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/kitchen_scene.jpg)).
   - Removemos todos os hotspots, manchas pretas e bolhas de interrogação que poluíam a visualização da criança.
2. **Efeito Blur Suave durante o Progresso:**
   - Enquanto o cômodo estiver sendo montado, a imagem original fica com um desfoque suave (`blur-md scale-105`), transmitindo mistério e calma.
   - Uma pílula sutil indica: *"Descubra todos os objetos abaixo para revelar o cômodo!"*.
3. **Itens Ocultos nos Cards da Esteira Inferior:**
   - Os 8 cards de objetos abaixo da imagem representam os mistérios a serem desvendados.
   - Objetos não concluídos permanecem ocultos (silhueta discreta com `?` e texto `'???'`).
   - O objeto selecionado para soletração fica destacado com anel dourado/âmbar.
   - À medida que a criança acerta a palavra na arena, aquele card específico se **revela** (ilustração nítida e colorida, nome completo e selo verde de concluído).
4. **Retirada do Blur e Celebração 100%:**
   - No momento em que o 8º objeto for revelado, o desfoque (`blur`) do cenário é totalmente removido (`filter: none scale-100` com transição suave de 700ms).
   - O banner dourado *"100% Montado! 🏆"* é exibido acima do cenário, deixando a arte do quarto ou da cozinha completamente visível e deslumbrante.

- Git Commit: `c856547` (`feat: simplify room reveal mechanic with clean scene blur, mystery cards below and blur removal on 100% completion`).

---

## 11. Coerência Visual Absoluta: Novo Cenário 3D com Todos os 8 Itens 🛏️

Gerada com sucesso a nova arte do quarto ([bedroom_scene.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene.jpg)), mantendo com fidelidade cirúrgica o estilo 3D de massinha/argila macia, a iluminação solar matinal acolhedora e a paleta pastel suave de baixa estimulação sensorial.

### 🔍 Presença Obrigatória dos 8 Itens do Quarto:
1. 🛏️ **CAMA**: Cama de madeira no centro com colcha patchwork colorida e travesseiro macio (`x: 49%, y: 46%`).
2. 🧸 **URSO**: Ursinho de pelúcia fofinho sentado alegremente sobre a cama (`x: 49%, y: 40%`).
3. 💡 **ABAJUR**: Abajur com cúpula suave sobre a mesinha de cabeceira de madeira (`x: 28%, y: 48%`).
4. 🛋️ **SOFÁ**: Poltrona/sofazinho confortável infantil em tecido pastel no canto frontal esquerdo (`x: 19%, y: 63%`).
5. 🧶 **TAPETE**: Tapete listrado em tons pastel estendido sobre o chão de madeira clara (`x: 42%, y: 74%`).
6. ⚽ **BOLA**: Bola colorida de brinquedo descansando no chão de tacos (`x: 65%, y: 69%`).
7. 🗄️ **MESA**: Escrivaninha de estudos com gaveta, caderno de desenho e porta-lápis colorido (`x: 69%, y: 52%`).
8. 🚪 **PORTA**: Porta de madeira com batente branco e maçaneta na parede lateral direita (`x: 84%, y: 48%`).

### 🚀 Validação & Sincronização
- `pnpm run build`: Compilação TypeScript e empacotamento Vite concluídos com sucesso em **2.71s**.
- `npx cap sync android`: Sincronização limpa com o projeto nativo Android em **0.65s**.
- Git Commit: `648ef8d` (`feat: generate authentic 3D bedroom scene containing all 8 mandatory items with perfect visual coherence`).




