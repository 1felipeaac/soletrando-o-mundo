# Diretrizes Pedagógicas, Fonéticas e Sensoriais

1. **Método Fônico Cadenciado:**
   - Toda soletração deve tocar as sílabas de forma compassada com pausa de 700ms entre elas e 250ms antes da palavra completa.
   - Isso permite que crianças de 4 a 6 anos processem a relação grafema-fonema sem sobrecarga.

2. **Áudio 100% Neural de Estúdio:**
   - NUNCA utilize \window.speechSynthesis\ do navegador.
   - Todo áudio falado deve vir dos arquivos pré-gerados em \public/audio/\ gravados com a voz \pt-BR-FranciscaNeural\.
   - Se novos termos forem adicionados, utilize \pnpm run sync-audio\ para gerar as novas faixas em alta resolução.

3. **Baixa Estimulação Sensorial:**
   - Paleta de cores pasteis quentes e terrosas.
   - Efeitos sonoros táteis e orgânicos (madeira, sinos suaves).
   - Sem contadores regressivos, sem buzinas de erro, sem luzes estroboscópicas ou elementos hiperestimulantes.

4. **Ergonomia e Acessibilidade Infantil:**
   - Botões com área de toque mínima de 64px a 72px para mãos infantis em desenvolvimento motor.
   - Slots de encaixe numerados (1º, 2º, 3º) para reforçar a direcionalidade ocidental de leitura.