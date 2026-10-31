import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function pwaAssetInjectorPlugin(): Plugin {
  return {
    name: 'pwa-asset-injector',
    apply: 'build',
    closeBundle() {
      const swDistPath = path.resolve('dist/sw.js');
      if (!fs.existsSync(swDistPath)) return;

      const assetsDir = path.resolve('dist/assets');
      const buildAssets = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).map((f) => `/assets/${f}`)
        : [];

      let swContent = fs.readFileSync(swDistPath, 'utf8');

      // 1. Atualiza o CACHE_NAME com versão de build única baseada em timestamp
      const buildVersion = `soletrando-mundo-v${Date.now()}`;
      swContent = swContent.replace(
        /const CACHE_NAME = ['"][^'"]+['"];/,
        `const CACHE_NAME = '${buildVersion}';`
      );

      // 2. Injeta os bundles compilados diretamente na lista de STATIC_ASSETS
      if (buildAssets.length > 0) {
        const assetsFormatted = buildAssets.map((a) => `  '${a}',`).join('\n');
        swContent = swContent.replace(
          /\/\* BUILD_ASSETS_PLACEHOLDER \*\//,
          `${assetsFormatted}\n  /* BUILD_ASSETS_INJECTED */`
        );
      }

      fs.writeFileSync(swDistPath, swContent, 'utf8');
      console.log(`\n[PWA Plugin] Bundles compilados injetados em dist/sw.js:`, buildAssets);
      console.log(`[PWA Plugin] CACHE_NAME atualizado para: ${buildVersion}\n`);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pwaAssetInjectorPlugin(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
});
