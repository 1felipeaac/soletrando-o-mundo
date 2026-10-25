# Padrões de Desenvolvimento e Engenharia

1. **Gerenciador de Pacotes:**
   - Utilize EXCLUSIVAMENTE \pnpm\. NUNCA use \
pm\ ou \yarn\.

2. **Build e Teste:**
   - Build de produção: \pnpm run build\ (\	sc -b && vite build\).
   - Sincronização Android: \pnpm run cap:sync\ (\
px cap sync android\).

3. **Deploy e Netlify:**
   - Todo arquivo TOML (\
etlify.toml\) e de redirecionamento (\_redirects\) deve ser codificado em UTF-8 SEM BOM.
   - URLs de imagens estáticas modificadas devem usar query de versão (ex: \?v=2\) para evitar retenção no cache do Service Worker.