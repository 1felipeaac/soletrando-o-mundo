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

---

### ADR 10: Tratamento Fonético-Computacional dos Róticos no TTS Neural (Tepe Alveolar [ɾ] vs. R Forte /ʁ/)
- **Data:** 27/10/2026
- **Contexto:** No português brasileiro, o grafema "R" possui comportamentos fonotáticos distintos:
  1. No início de palavras ou emissões (`#_V`): é categoricamente realizado como **R forte** (/ʁ/ ou /h/, como em *rato*, *rosa*).
  2. Em posição intervocálica simples (`V_V`): opõe-se como **tepe alveolar [ɾ]** (vibrante simples / R brando tremido, como em *muro* [ˈmu.ɾu] e *árvore* [ˈaɾ.vu.ɾi]).
  No sintetizador neural (`pt-BR-FranciscaNeural`), quando o texto de uma palavra soletrada era quebrado por reticências (`Mú... ro!`), ou quando uma sílaba isolada como `"RO"` ou `"RE"` era reproduzida, o módulo G2P (Grapheme-to-Phoneme) classificava a consoante como início absoluto de enunciado, gerando indevidamente o R forte (som de *rato* / *murro* em vez de *muro*).
- **Decisão:**
  1. **Coarticulação Prosódica com Hífen:** No áudio do objeto (`spoken_name`), substituir pausas pontuadas por hifens contínuos (`"Mú-ro! Muro!"` e `"Ár-vo-re! Árvore!"`), garantindo que o módulo G2P reconheça a posição intervocálica natural do tepe alveolar.
  2. **Sílabas Isoladas Limpas e Acolhedoras:** As sílabas isoladas `RO` e `RE` são sintetizadas canonicamente como `"Rô."` e `"Rê."` (com pontuação suave e tom acolhedor de baixa estimulação sensorial), garantindo que a criança ouça a consoante R diretamente sem qualquer intrusão espúria de vogais prévias ("uro"/"are"). A coarticulação do tepe alveolar pertence estritamente ao fluxo prosódico contínuo da palavra intervocálica (`Mú-ro!`, `Ár-vo-re!`).
  3. **Adoção das 5 Diretrizes Fonotáticas do PB:** Formalizar as regras de Redução Vocálica, Palatização de T/D, Vocalização de L, S Intervocálico (/z/) e Róticos (Tepe [ɾ] vs. R forte) na documentação técnica e pedagógica do projeto.
- **Consequência:** Fidelidade fonoaudiológica e alinhamento rigoroso à BNCC na alfabetização fônica infantil, eliminando distorções fonéticas no aprendizado da leitura e escrita.

---

### ADR 11: Mapeamento Fonológico de Timbre Vocálico Médio (/ɔ/ Aberto vs. /o/ Fechado) em Homógrafos Silábicos
- **Data:** 27/10/2026
- **Contexto:** No português brasileiro, o subsistema de vogais médias possui oposição fonêmica contrastiva distintiva (/ɔ/ aberto vs. /o/ fechado, ex: *bola* [ˈbɔ.lɐ] vs. *bolo* [ˈbo.lu], conforme Câmara Jr., 1970). Como a escrita silábica compartilha o mesmo par de grafemas (ex: `BO`), a síntese estática única forçava um dos vocábulos a soar com timbre incorreto (*"Bô-la"* ou *"Bó-lo"*). Da mesma forma, sufixos derivacionais oxítonos como *-dor* em *regador* estavam sendo sintetizados abertos (*"Re-ga-dór"*) em vez de fechados [doʁ] (*"Re-ga-dôr"*), devido a acentuação inadequada em `SPECIAL_SYLLABLES`.
- **Decisão:**
  1. **Correção de Regador & Sufixos:** No `SPECIAL_SYLLABLES`, corrigir `DOR` de `"Dór"` para `"Dôr."`, garantindo a terminação oxítona fechada [doʁ]. No áudio do objeto, ajustar `spoken_name` para `"Re... ga... dôr! Regador!"`.
  2. **Arquitetura de Variantes de Timbre:** Criar variantes contextuais de timbre aberto:
     - `BO_OPEN.mp3` ("Bó.") para *bola* e *bota* vs. `BO.mp3` ("Bô.") para *bolo* e *boné*.
     - `CO_OPEN.mp3` ("Có.") para *copo* e *sacola* vs. `CO.mp3` ("Cô.") para *escova*.
     - `PO_OPEN.mp3` ("Pó.") para *pote* vs. `PO.mp3` ("Pô.") para *copo* e *sapo*.
     - `RO_OPEN.mp3` ("Ró.") para *rosa* vs. `RO.mp3` ("Rô.") para *muro*.
     - `SO.mp3` corrigido para timbre fechado `"Ssô."` em *sopa* e *sofá*.
     - `COR.mp3` corrigido para timbre fechado `"Côr"` em *cortina*.
  3. **Despacho Dinâmico no `speechService.ts`:** Mapear o `contextItemId` para tocar automaticamente a variante aberta ou fechada correspondente à palavra em soletração.
- **Consequência:** Fidelidade fônica absoluta em todas as vogais médias tônicas do jogo, alinhando a percepção auditiva da criança à norma culta falada do PB e às diretrizes da BNCC.
