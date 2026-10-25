# Design System e Identidade Visual

1. **Estilo Isométrico 3D (Cozy Clay):**
   - Miniaturas isométricas em corte de 30° com textura de massinha/argila macia.
   - Cantos arredondados, iluminação solar difusa e sombras suaves de contato.

2. **Coerência Absoluta com worldsData.ts:**
   - Qualquer imagem de cômodo DEVE conter exatamente todos os itens listados no \worldsData.ts\ daquele mundo.
   - O script \scripts/scene_generator_agent.py\ e o agente \scene-artist\ são responsáveis por manter essa coerência.

3. **Mecânica de Revelação:**
   - A imagem do cômodo inicia desfocada (\lur-md scale-105\).
   - Os cards inferiores mostram os itens misteriosos (\???\) até serem soletrados.
   - Ao completar 100% dos itens do mundo, o desfoque é removido (\ilter-none scale-100\), revelando o cômodo nítido.