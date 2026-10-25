# Design System e Identidade Visual

1. **Estilo Isométrico 3D (Cozy Clay):**
   - Miniaturas isométricas em corte de 30° com textura de massinha/argila macia.
   - Cantos arredondados, iluminação solar difusa e sombras suaves de contato.

2. **Coerência Absoluta com worldsData.ts:**
   - Qualquer imagem de cômodo DEVE conter exatamente todos os itens listados no `worldsData.ts` daquele mundo.
   - O script `scripts/scene_generator_agent.py` e o agente `scene-artist` são responsáveis por manter essa coerência.

3. **Mecânica de Revelação:**
   - A imagem do cômodo inicia desfocada (`blur-md scale-105`).
   - Os cards inferiores mostram os itens misteriosos (`???`) até serem soletrados.
   - Ao completar 100% dos itens do mundo, o desfoque é removido (`filter-none scale-100`), revelando o cômodo nítido.

4. **Humanização vs. Estilização Gráfica / Logomarcas:**
   - **Frutas, verduras e alimentos naturais:** NUNCA devem ter olhos, boca ou rostos. Permanecem como alimentos naturais e realistas estilizados em massinha 3D tátil.
   - **Objetos manufaturados e utensílios:** O objeto em si NÃO deve ser humanizado (o copo ou a mesa não têm olhos/boca no corpo da peça). Detalhes fofos são permitidos EXCLUSIVAMENTE se funcionarem como **adornos decorativos, estampas impressas ou logomarcas infantis na peça** (como uma nuvenzinha estampada na lateral do copo).
   - **Animais ou brinquedos que representam animais:** (ex: urso de pelúcia, pato de banho, pássaro, borboleta) possuem olhos e boca amigáveis.
   - Em prompts: "inanimate object, no anthropomorphic face on the object body; cute face motif allowed only as printed decal, brand logo, or graphic pattern".