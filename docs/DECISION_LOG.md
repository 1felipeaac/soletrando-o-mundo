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

---

### ADR 12: Extração Acústica e Despacho Contextual do Tepe Alveolar [ɾ] (R Brando) em Posição Intervocálica
- **Data:** 27/10/2026
- **Contexto:** 
  1. No português brasileiro, o grafema "R" em posição intervocálica simples (`V_V`, ex: *muro* [ˈmu.ɾu], *árvore* [ˈaɾ.vu.ɾi]) é estritamente realizado como **tepe alveolar [ɾ]** (som brando/tremido, com oclusão lingual de 15 a 25ms contra os alvéolos).
  2. Qualquer motor neural de TTS (incluindo `pt-BR-FranciscaNeural`), ao receber uma sílaba isolada como `"Rô."` ou `"Rê."`, classifica o "R" como início absoluto de enunciado (`#_V`), gerando inevitavelmente o **R forte fricativo [ʁ]** (som de "RR", como em *rato* ou *murro*).
  3. Tentativas anteriores de fatiamento cego por bytes MP3 resultavam em vazamento dos formantes da vogal anterior, fazendo a criança ouvir *"URO"* ou *"ARE"*.
- **Decisão:**
  1. **Algoritmo Acústico Científico em Python (`scripts/sync_audio.py`):** Utilizar `miniaudio`, `numpy` e `lameenc` para analisar o envelope de energia RMS em janelas de 3ms do sinal PCM decodificado. O algoritmo detecta o vale exato da oclusão lingual do tepe [ɾ] no vocábulo natural contínuo, alinha o corte no ponto exato de *zero-crossing* 12ms antes do *burst* (explosão da soltura), aplica fade-in cosseno de 3ms e fade-out suave de 25ms, gerando MP3s puros com codificação LAME CBR.
  2. **Geração dos Assets Canônicos:** Criar `RO_TEPE.mp3` (extraído de *Muro.*) e `RE_TEPE.mp3` (extraído de *Árvore.*), sem nenhum resíduo de vogais prévias e com o autêntico tepe alveolar [ɾ].
  3. **Despacho Contextual Inteligente (`speechService.ts`):** 
     - No contexto de `muro`, o toque na sílaba `RO` despacha `RO_TEPE.mp3`.
     - No contexto de `arvore`, o toque na sílaba `RE` despacha `RE_TEPE.mp3`.
     - No contexto de `rosa`, a sílaba `RO` continua a tocar `RO_OPEN.mp3` (R forte aberto [ʁɔ]).
     - Nos contextos de `relogio` e `regador`, a sílaba `RE` continua a tocar `RE.mp3` (R forte fechado [ʁe]).
  4. **PWA Cache:** Atualização do Service Worker para `soletrando-mundo-v10`, incluindo `RO_TEPE.mp3` e `RE_TEPE.mp3` no pre-cache offline.
- **Consequência:** Solução definitiva e perfeita da oposição fonológica entre o R forte [ʁ] e o tepe brando [ɾ], eliminando qualquer som de "RR", "URO" ou "ARE" e garantindo fidelidade 100% científica à BNCC e à fonoaudiologia infantil.

---

### ADR 13: Refinamento Pedagógico da Máquina de Estados: Feedback Cadenciado de Erro/Acerto e Navegação Sequencial de Cômodos
- **Data:** 27/10/2026
- **Contexto:** 
  1. **Interrupção Prematura de Sílaba no Erro:** Ao colocar a última sílaba incorreta, o aplicativo disparava a dica imediatamente, cancelando o áudio da sílaba recém-tocada antes que a criança pudesse assimilá-la auditivamente.
  2. **Celebração Incompleta no Acerto:** Ao completar a palavra, o jogo executava fanfarra mas não pronunciava a palavra inteira acolhedora nem emitia reforço verbal afetuoso de parabenização.
  3. **Fricção de Navegação entre Ambientes:** Para avançar de um cômodo para outro, a criança era forçada a sair para o mapa geral, quebrando a imersão na exploração da casa.
  4. **Acessibilidade Mobile em Telas Pequenas:** Ao entrar num cômodo em celulares e tablets, a cena 3D ocupava a parte superior da tela e a arena de soletração ficava abaixo da dobra, exigindo rolagem manual.
- **Decisão:**
  1. **Tempo de Assimilação no Erro:** Adotar atraso intencional de 800ms antes de emitir a dica acústica (`speakHint` / `speakInverted`), garantindo que o áudio da sílaba colocada soe por completo e a criança compreenda o fonema que selecionou.
  2. **Celebração Fonética Tripla no Acerto:**
     - Última sílaba conclui seu som suavemente (550ms).
     - Fanfarra suave + confetes táteis + registro do acerto (`onComplete`).
     - A voz neural pronuncia a palavra completa (`/audio/words/${clean}.mp3`).
     - Pausa afetuosa de 300ms seguida da parabenização acolhedora (`/audio/feedback/parabens.mp3`: *"Muito bem! Parabéns!"*).
  3. **Navegação Sequencial Direta de Cômodos:**
     - Adição de botões de navegação sequencial (`[◀ Anterior]` e `[Próximo ▶]`) diretamente no cabeçalho do `SceneBuilder`.
     - No banner de 100% do cômodo concluído, inclusão de botão CTA proativo para viajar ao próximo cômodo.
     - Proteção suave por estrelas: caso o próximo cômodo exija mais estrelas, emite aviso sonoro leve de mola com toast afetuoso (*"Faltam X ⭐ para abrir..."*).
  4. **Auto-Scroll Inteligente para a Soletração:** Ao entrar em um cômodo incompleto (ou ao selecionar um item na esteira), o app rola a página suavemente até `#spelling-arena`. Caso o cômodo esteja 100% concluído, mantém o topo visível para contemplação da arte 3D nítida.
- **Consequência:** Fluxo de jogo altamente acolhedor, ritmo fonoaudiológico respeitado, menor sobrecarga cognitiva e navegação fluida em dispositivos móveis.


---

### ADR 14: Conformidade Jurídica (LGPD Art. 14 / COPPA), Painel da Família & Educador (BNCC) e Controle de Tempo de Tela (SBP)
- **Data:** 28/10/2026
- **Contexto:** Para transformar o aplicativo em um produto comercial e profissional pronto para homologação na Google Play Store (Designed for Families) e Apple App Store (Kids Category), era indispensável:
  1. Estruturar conformidade jurídica explícita com a LGPD (Art. 14) e COPPA (zero coleta de dados pessoais, ausência de identificadores de publicidade e funcionamento prioritariamente offline com dados salvos em LocalStorage).
  2. Fornecer valor tangível aos pais e educadores através de um relatório pedagógico que traduza o progresso do jogo para as competências da BNCC (EF01LP06 e EF01LP08).
  3. Proteger a saúde e o bem-estar infantil com controle de tempo de tela e alertas acolhedores de pausa recomendados pela Sociedade Brasileira de Pediatria (SBP).
- **Decisão:**
  1. **Documentação Legal Pública e Integrada:**
     - Criação de `public/privacidade.html` e `public/termos.html` em layout responsivo com identidade visual acolhedora, além de rotas diretas no Netlify (`/privacidade` e `/termos` via `_redirects` UTF-8 sem BOM).
     - Criação do componente `PrivacyTermsModal.tsx` para leitura direta dos termos dentro do app.
  2. **Evolução do Parental Gate para o Painel da Família (`ParentDashboardModal.tsx`):**
     - A trava matemática permanece como gatekeeper seguro para impedir que a criança acesse configurações ou links externos.
     - Uma vez autenticado o adulto, o painel revela 4 abas estratégicas:
       - 📊 **Relatório Pedagógico (BNCC):** Métricas de estrelas e palavras, análise das habilidades EF01LP06 (sílabas simples) e EF01LP08 (regras contextuais como S com som de Z, R brando e timbres abertos) e detalhamento por cômodo.
       - ⏱️ **Tempo de Tela & Saúde (SBP):** Seletor de limite de sessão (15 min, 20 min padrão SBP, 30 min ou livre) e tempo de jogo decorrido.
       - 🛡️ **Privacidade & Segurança:** Selos de conformidade e links para as políticas.
       - ⚙️ **Gerenciamento de Dados:** Reinício seguro de progresso com dupla confirmação.
  3. **Alerta Afetuoso de Pausa Saudável (`ScreenTimeAlertModal.tsx`):**
     - Pop-up não-punitivo com visual ensolarado e mensagem carinhosa convidando a criança a tomar água e descansar os olhos após o limite configurado pelos pais, com opção suave de "Mais 5 minutinhos".
  4. **Persistência de Configurações:** Integração de `parentSettings` no `storageService.ts` com retrocompatibilidade total.
- **Consequência:** Blindagem jurídica internacional para submissão nas lojas de aplicativos, elevação drástica da percepção de valor por parte dos pais e apoio ético à saúde infantil.


---

### ADR 15: Escolha Arquitetural Pragmática — Adoção de Component-Driven / Feature-Based em Detrimento de DDD e Clean Architecture Formal
- **Data:** 28/10/2026
- **Contexto:** 
  Avaliou-se a conveniência de refatorar a base do aplicativo para padrões corporativos estritos de **Domain-Driven Design (DDD)** e **Clean Architecture** (divisão formal em Camadas de Domínio Puro, Casos de Uso / Aplicação, Entidades com invariantes protegidas, Value Objects, DTOs e Inversão de Dependência com Interfaces de Repositório).
- **Decisão:**
  Decidiu-se **manter a arquitetura pragmática orientada a componentes (Component-Driven / Feature-Based)** com Clean Code idiomático em React + TypeScript, recusando a introdução de DDD formal neste estágio do produto, pelos seguintes fundamentos técnicos:
  1. **Prevenção de Overengineering (YAGNI / KISS):**
     A introdução de camadas formais de Clean Architecture multiplicaria significativamente o número de arquivos, classes e mappers, adicionando carga cognitiva e lentidão iterativa sem agregar valor direto à criança ou às famílias.
  2. **Natureza das Regras de Domínio:**
     O aplicativo não lida com concorrência transacional complexa, contabilidade financeira ou múltiplos serviços externos. Seu núcleo é a **alfabetização fônica serena**, cujas regras (validação de sílabas correspondentes, contagem tangível 1:1 de estrelas e desbloqueio gradual por ZPD) são eficientemente resolvidas por funções puras, tipagem estrita e máquina de estados reativa.
  3. **Linguagem Ubíqua sem Burocracia:**
     Embora não adote entidades DDD clássicas, o projeto preserva o benefício central do DDD: uma **Linguagem Ubíqua rigorosa e coesa** entre fonoaudiologia, pedagogia BNCC e código (`WorldRoom`, `ItemStage`, `Syllable`, `Distractor`, `ParentalGate`, `ScreenTimeLimit`).
  4. **Coesão Sensorial em Interfaces Lúdicas:**
     Em jogos educativos infantis de baixa estimulação sensorial, a experiência depende da sincronia precisa e tátil entre interação gestual, Web Audio API, animações e áudio neural. O acoplamento controlado de apresentação e estado em componentes e hooks favorece a cadência de 500ms a 700ms preconizada pela neuroeducação.
- **Critérios de Gatilho para Refatoração Futura:**
  Fica estabelecido que a evolução para camadas formais de Clean Architecture e desacoplamento de repositórios só ocorrerá quando houver:
  1. *Backend e Sincronização em Nuvem (Cloud Sync):* Momento em que a abstração de `IProgressRepository` (separando `LocalStorageAdapter` de `SupabaseAdapter`/`FirebaseAdapter`) se tornará técnica e economicamente justificada;
  2. *Expansão Massiva de Catálogo (Mundos 2, 3 e além):* Momento de quebrar o arquivo único `worldsData.ts` em módulos isolados por tema/cômodo e separar dados visuais de coordenadas dos metadados fonéticos BNCC;
  3. *Crescimento da Equipe de Engenharia:* Quando o trabalho paralelo em UI e regras de negócio demandar desacoplamento rígido de contratos.
- **Consequência:** Máxima velocidade de lançamento, código limpo e compreensível, zero sobrecarga arquitetural e caminho de transição claramente mapeado para fases futuras.

---

### ADR 16: Jogo da Memória Imagem ↔ Palavra Escrita como Recompensa Pedagógica de Fechamento de Ciclo
- **Data:** 29/10/2026
- **Contexto:** 
  Avaliou-se a inclusão de um minijogo comemorativo ("Jogo da Memória") desbloqueado após a revelação completa de cada cômodo, ponderando se a mecânica poderia dispersar o foco da alfabetização ou se funcionaria como reforço pedagógico motivador.
- **Decisão:**
  Aprovar o **Jogo da Memória Imagem ↔ Palavra Escrita** como recompensa construtiva e consolidação pós-missão, sob as seguintes regras estritas de neuroeducação e design:
  1. **Pareamento Imagem ↔ Palavra Escrita com Áudio Neural:** Conecta simultaneamente os sistemas imagético e verbal (Teoria da Dupla Codificação de Paivio) e estimula o mapeamento ortográfico e léxico (Linnea Ehri).
  2. **Teto Cognitivo de 6 Pares (12 Cartas):** Respeita a capacidade limitada da memória de trabalho visuoespacial em crianças de 4 a 6 anos (Sweller / Baddeley / Cowan), iniciando com 3 pares (6 cartas) no Quarto e escalando suavemente até 6 pares no Bônus.
  3. **Zero Pressão Temporal & Baixa Estimulação Sensorial:** Sem cronômetro, sem contagem regressiva e sem sons de erro (SBP / Christakis), evitando a liberação de cortisol e mantendo o fluxo calmo.
- **Consequência:** Fortalecimento da retenção vocabular, elevação do engajamento intrínseco da criança sem recorrer a recompensas vazias (gacha/moedas) e plena conformidade com a BNCC (EI03EF01, EF01LP08).

---

### ADR 17: Supressão de Atalho Auditivo no Jogo da Memória — Decodificação Ativa com Áudio sob Demanda
- **Data:** 30/10/2026
- **Contexto:** 
  No pareamento Imagem ↔ Palavra Escrita, observou-se que a pronúncia automática imediata da palavra escrita ao virar a carta criava um "atalho auditivo": a criança assimilava a palavra pelo canal fonológico oral (*"Urso!"*) e procurava a figura do urso sem precisar examinar os grafemas (`U-R-S-O`), reduzindo o jogo a um pareamento Som ↔ Imagem e neutralizando o esforço de leitura ativa.
- **Decisão:**
  Refatorar a mecânica sonora do Jogo da Memória com foco na ativação da rota de decodificação visual (Stanislas Dehaene / Linnea Ehri):
  1. **Cartas com Imagem:** Continuam com pronúncia automática no primeiro clique, pois a imagem não contém texto e o áudio ancora o objeto no léxico mental.
  2. **Cartas com Palavra Escrita (Silêncio Inicial para Leitura Ativa):** Ao virar pela primeira vez, a carta vira em silêncio (apenas com o som orgânico tátil de madeira/feltro), exibindo a palavra em destaque para que a criança tente decodificá-la ativamente.
  3. **Áudio sob Demanda (Scaffolding / Apoio Pedagógico):** Se a criança tiver dúvida ou estiver em fase inicial (4 anos), um segundo toque na carta virada (ou no selo `[ 🔊 Ouvir ]`) dispara a voz neural `FranciscaNeural`.
  4. **Validação Fonética na Vitória do Par:** Ao formar o par correto, a voz neural pronuncia a palavra com afeto e celebra, validando que a hipótese de leitura da criança estava correta.
- **Consequência:** Engajamento visual real com a ortografia, estímulo à rota fonológica/lexical, autonomia para crianças em diferentes estágios de letramento e pleno alinhamento com a BNCC (`EI03EF09`, `EF01LP08`).
