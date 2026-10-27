# 📜 Registro de Decisões Técnicas e Pedagógicas (ADR)
## Soletrando o Mundo 🌍

Este documento registra o histórico de decisões arquiteturais, de design e pedagógicas tomadas durante o desenvolvimento do aplicativo.

---

### ADR 01: Independência Absoluta do Projeto
- **Data:** 24/10/2026
- **Contexto:** O projeto estava inicialmente sendo concebido junto ao repositório de Pokemon.
- **Decisão:** Separar o **Soletrando o Mundo** em um projeto e repositório 100% independentes no GitHub (\1felipeaac/soletrando-o-mundo\), com identidade visual autoral, marcas próprias e foco comercial/educativo.
- **Consequência:** Nenhuma dependência, código ou asset de terceiros/marcas externas no projeto.

---

### ADR 02: Voz Neural de Estúdio (\pt-BR-FranciscaNeural\) vs. Síntese do Navegador
- **Data:** 24/10/2026
- **Contexto:** A API padrão \window.speechSynthesis\ do navegador produz vozes robóticas, com entonação metálica e pronúncia inconsistente de sílabas e fonemas do português brasileiro.
- **Decisão:** Banir o uso de vozes sintetizadas em tempo real pelo navegador. Todo o conteúdo fonético (sílabas, palavras completas, dicas afetivas e reforço pedagógico) é pré-gerado em alta fidelidade via Microsoft Edge TTS Neural com a voz acolhedora da Francisca (\pt-BR-FranciscaNeural\).
- **Consequência:** Experiência afetiva humanizada de estúdio, garantia de pronúncia perfeita e funcionamento 100% offline via PWA.

---

### ADR 03: Baixa Estimulação Sensorial (Neuroeducação & Diretrizes SBP)
- **Data:** 24/10/2026
- **Contexto:** Aplicativos infantis convencionais usam hiperestimulação (cores neon, transições frenéticas, buzinas estridentes, cronômetros de pressão), gerando ansiedade e sobrecarga cognitiva em crianças de 4 a 6 anos.
- **Decisão:** Adotar design calmo e acolhedor:
  - Estilo visual de massinha/argila 3D (diorama isométrico suave).
  - Paleta em tons pastel quentes e iluminação solar difusa.
  - Efeitos sonoros orgânicos gerados via Web Audio API (toques de madeira, sinos mornos).
  - Sem contadores de tempo, sem punição por erro e sem elementos piscantes.

---

### ADR 04: Mecânica de Revelação do Cenário (Foco/Desfoque vs. Stickers)
- **Data:** 24/10/2026
- **Contexto:** A ideia inicial de sobrepor stickers recortados sobre sombras criava poluição visual e inconsistência de iluminação/recorte.
- **Decisão:** O cômodo 3D inicia com um desfoque suave (\lur-md scale-105\). Na esteira inferior, os 8 objetos aparecem como mistério (\???\) até serem soletrados. Ao completar o 8º item do mundo, o desfoque é removido suavemente (\ilter-none scale-100\), revelando o cômodo 100% nítido e iluminado com comemoração.
- **Consequência:** Interface limpa, sensação lúdica de "foco" e clareza para a criança, mantendo a integridade da arte 3D.

---

### ADR 05: Coerência Absoluta entre worldsData.ts e a Arte 3D
- **Data:** 24/10/2026
- **Contexto:** A imagem gerada por IA precisa obrigatoriamente conter todos os itens que a criança soletra no cômodo.
- **Decisão:** Todos os 8 itens listados no \worldsData.ts\ (Quarto: cama, mesa, sofá, bola, urso, porta, tapete, abajur) DEVEM estar presentes de forma reconhecível no diorama 3D. Elementos extras funcionam apenas como decoração de fundo secundária.

---

### ADR 06: Gerador Dinâmico de Cenários com Templates Semânticos
- **Data:** 24/10/2026
- **Contexto:** Dicionários estáticos manuais não escalariam conforme novos mundos e cômodos fossem criados.
- **Decisão:** O script \scripts/scene_generator_agent.py\ adota templates dinâmicos por categoria (\urniture\, \	oy\, \ood\, etc.) e presets por tema (\casa\, \comida\, \escola\), gerando prompts fotográficos consistentes sem código duplicado.

---

### ADR 07: Estratégia de Cache do Service Worker (PWA v2) e Netlify
- **Data:** 24/10/2026
- **Contexto:** O Service Worker PWA com estratégia \Cache First\ impedia os navegadores de verem imagens atualizadas com o mesmo nome de arquivo. Além disso, o parser de TOML do Netlify rejeitou arquivos com UTF-8 BOM.
- **Decisão:** 
  1. Implementar cache-busting em URLs de imagem (\/images/bedroom_scene.jpg?v=2\).
  2. Incrementar a versão do cache no SW para \soletrando-mundo-v2\.
  3. Adicionar cabeçalho \
o-cache\ para o \/sw.js\ no \
etlify.toml\.
  4. Garantir codificação UTF-8 pura estrita sem BOM em todos os arquivos de configuração (`netlify.toml`, `_redirects`).

---

### ADR 08: Contagem de Estrelas 1:1 e Mecânica de Desbloqueio Progressivo por ZPD
- **Data:** 25/10/2026
- **Contexto:** A interface inicial utilizava um multiplicador legado de pontuação (`* 40`), exibindo números na casa dos milhares (ex: `1040 (26/48)`) ao lado do ícone de estrela, o que gerava confusão e incompatibilidade cognitiva com o público-alvo (4 a 6 anos). Além disso, não havia portão gradual para desbloqueio dos 6 novos cômodos da casa.
- **Decisão:**
  1. Adotar correspondência biunívoca direta 1:1: cada palavra soletrada equivale a **1 estrela** (total de 48 estrelas na casa), exibida na Navbar como `⭐ 26 / 48`.
  2. Implementar desbloqueio progressivo baseado na Zona de Desenvolvimento Proximal (ZPD) e Maestria Parcial (60% a 75% das estrelas do cômodo anterior):
     - Quarto: 0 ⭐
     - Cozinha: 5 ⭐
     - Sala: 12 ⭐
     - Banheiro: 20 ⭐
     - Jardim: 28 ⭐
     - Bônus: 36 ⭐
  3. Design de bloqueio não-punitivo: bordas pontilhadas suaves, selo indicando estrelas restantes e aviso acolhedor com som leve de mola ao toque, sem travar a persistência infantil.
- **Consequência:** Interface 100% clara e tangível para crianças em alfabetização, preservando a autonomia e a baixa estimulação sensorial.


---

### ADR 09: Arquitetura Híbrida de Geração de Imagens (Plataforma Nativa + Fallback via API Key)
- **Data:** 27/10/2026
- **Contexto:** A geração massiva de dezenas de itens em alta resolução atinge periodicamente os limites semanais da cota nativa da plataforma Antigravity (`gemini-3.1-flash-image`).
- **Decisão:** Adotar uma estratégia de geração híbrida e resiliente:
  1. **Motor Primário (Nativo da Plataforma):** Prioridade total ao uso das cotas integradas da plataforma Antigravity via agente `scene-artist`, sem consumir créditos ou tokens do usuário.
  2. **Motor Secundário (Fallback Híbrido via API Key):** Em caso de esgotamento de cota (`429 RESOURCE_EXHAUSTED`), se houver uma chave `GEMINI_API_KEY` cadastrada no arquivo `.env` (gitignored), o sistema alterna suavemente para a geração via SDK `google-genai` com `imagen-3.0-generate-002` / `gemini-*-image`.
  3. **Persistência de Fila e Timer Reativo:** Quando ambos atingem seus tetos, o sistema preserva a fila estruturada em `scripts/generation_queue.json` e agenda um timer de despertar automático sem perda de progresso.
- **Consequência:** Máxima economia para o desenvolvedor, alta disponibilidade de geração e zero risco de regressão estética ou vazamento de chaves.
