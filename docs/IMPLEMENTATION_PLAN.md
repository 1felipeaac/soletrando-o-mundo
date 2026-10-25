# Alinhamento Estrito dos Cenários com worldsData e Criação do Agente de Cenários 🎨

O objetivo desta implementação é garantir coerência absoluta entre a base de dados do jogo ([worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts)) e os cenários visuais, atendendo à solicitação do usuário:
1. **O Quarto (Bedroom)** deve conter estritamente os 8 itens oficiais: `cama`, `mesa`, `sofa`, `bola`, `urso`, `porta`, `tapete` e `abajur` (podendo ter elementos complementares neutros como paredes, janela e chão de madeira, mas com a presença obrigatória e visível de todos os 8 móveis/brinquedos).
2. **Criação do Agente Especializado em Cenários (`scene-artist` / `scene_generator_agent.py`)**: um agente que lê os itens e metadados de qualquer cômodo no `worldsData.ts`, constrói os prompts visuais de alta fidelidade seguindo o Design System infantil (3D isométrico, textura suave de argila/low-poly, paleta pastel acolhedora, baixa estimulação sensorial) e orquestra a geração das 2 imagens por cômodo (completa e sombreada) e stickers.
3. **Geração das Imagens do Quarto**: produzir a nova imagem completa e a nova imagem misteriosa/sombreada contendo os 8 itens nas posições correspondentes, além dos stickers transparentes.
4. **Validação Fonética e Sonora**: garantir que todos os 8 itens possuam seus áudios neurais (palavra inteira, dica acolhedora e sílabas individuais com `pt-BR-FranciscaNeural`).

---

## User Review Required

> [!IMPORTANT]
> **Itens Oficiais do Quarto:**
> Confirmamos o retorno aos 8 itens solicitados:
> - 🛏️ **CAMA** (`CA` - `MA`)
> - 🗄️ **MESA** (`ME` - `SA`)
> - 🛋️ **SOFÁ** (`SO` - `FÁ`)
> - ⚽ **BOLA** (`BO` - `LA`)
> - 🧸 **URSO** (`UR` - `SO`)
> - 🚪 **PORTA** (`POR` - `TA`)
> - 🧶 **TAPETE** (`TA` - `PE` - `TE`)
> - 💡 **ABAJUR** (`A` - `BA` - `JUR`)
>
> Itens temporários adicionados anteriormente (`relogio`, `quadro`, `janela`, `banco`) foram arquivados para outros cômodos (ex: Sala de Estar e Hall).

---

## Proposed Changes

### 1. Base de Dados do Jogo

#### [MODIFY] [worldsData.ts](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/src/data/worldsData.ts)
- Restaurar os 8 itens oficiais do Quarto com suas coordenadas no cômodo (`x`, `y`, `size`), dicas carinhosas e regras fonéticas BNCC.
- Ajustar os caminhos dos stickers (`/images/stickers/bedroom/[item].png` e `/images/stickers/[item].png`).

---

### 2. Agente de Criação de Cenários

#### [NEW] [define_subagent (`scene-artist`)](file:///c:/Users/felip/.gemini/antigravity/brain/8fefa96b-f574-4592-8003-1ffac523e961)
- Registrar o subagente `scene-artist` no ecossistema Antigravity com prompt de sistema contendo a gramática visual do projeto:
  - Estilo: 3D Isometric Miniature Diorama, Soft Clay/Plastilina Render, Chibi/Cozy Kids Art.
  - Paleta: Tons pastel mornos, iluminação solar suave, sombras suaves, sem poluição visual.
  - Regra de Ouro: Cada item listado no `worldsData` deve ter presença geométrica explícita e reconhecível pela criança.

#### [NEW] [scripts/scene_generator_agent.py](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/scripts/scene_generator_agent.py)
- Script Python autônomo que:
  - Lê e parseia `worldsData.ts`.
  - Gera os prompts estruturados para a cena completa e a cena sombreada (silhuetas).
  - Pode ser invocado para qualquer cômodo (Quarto, Cozinha, Sala de Estar, etc.) para garantir consistência perfeita.

---

### 3. Geração e Atualização de Ativos Visuais

#### [NEW/MODIFY] [public/images/bedroom_scene.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene.jpg)
- Gerar via `generate_image` o novo cenário 3D isométrico do quarto infantil contendo:
  - Cama de madeira acolhedora no centro com colcha patchwork
  - Urso de pelúcia fofinho
  - Mesa de desenho com cadeira
  - Abajur com cúpula estrelada
  - Sofazinho infantil confortável
  - Tapete redondo/oval no piso de madeira
  - Bola de brinquedo colorida
  - Porta de madeira charmosa na entrada

#### [NEW/MODIFY] [public/images/bedroom_scene_shadowed.jpg](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/bedroom_scene_shadowed.jpg)
- Gerar a versão com os 8 objetos transformados em silhuetas/sombras misteriosas sobre o piso e paredes vazias, servindo de base para os stickers.

#### [VERIFY/NEW] Stickers em [public/images/stickers/](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/images/stickers/)
- Garantir os stickers com fundo transparente para `cama`, `mesa`, `sofa`, `bola`, `urso`, `porta`, `tapete`, `abajur`.

---

### 4. Áudios e Sílabas dos 8 Itens

#### [VERIFY] [public/audio/](file:///c:/Users/felip/Documents/Projetos/soletrando-o-mundo/public/audio/)
- Garantir a presença dos áudios em `public/audio/words/`, `public/audio/hints/` e `public/audio/syllables/` para todos os 8 itens (incluindo `POR`, `JUR`, `A`, `BA`, etc.).

---

## Verification Plan

### Automated Verification
- Executar `pnpm run build` para garantir validação TypeScript e Vite.
- Executar `npx cap sync android` para sincronizar os novos assets ao Android.
- Executar script de validação de assets sonoros e visuais.

### Manual Verification
- Visualizar os cenários e certificar que todos os 8 objetos são identificáveis na imagem.
- Testar o botão SOM para verificar que a soletração das sílabas e a conclusão da palavra ocorrem sem interrupções.
