// Service Worker para Soletrando o Mundo (PWA 100% Offline)
const CACHE_NAME = 'soletrando-mundo-v13';

const STATIC_ASSETS = [
  /* BUILD_ASSETS_PLACEHOLDER */
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-maskable.svg',

  // Cenas dos Cômodos 3D
  '/images/bedroom_scene.jpg',
  '/images/kitchen_scene.jpg',
  '/images/living_room_scene.jpg',
  '/images/bathroom_scene.jpg',
  '/images/garden_scene.jpg',
  '/images/house_bonus_scene.jpg',

  // Imagens dos Objetos e Alimentos
  '/images/abajur.jpg',
  '/images/almofada.jpg',
  '/images/arvore.jpg',
  '/images/bacia.jpg',
  '/images/balanco.jpg',
  '/images/banana.jpg',
  '/images/bola.jpg',
  '/images/bolo.jpg',
  '/images/cama.jpg',
  '/images/cerca.jpg',
  '/images/copo.jpg',
  '/images/cortina.jpg',
  '/images/escova.jpg',
  '/images/foto.jpg',
  '/images/garfo.jpg',
  '/images/gato.jpg',
  '/images/janela.jpg',
  '/images/maca.jpg',
  '/images/mesa.jpg',
  '/images/muro.jpg',
  '/images/papel.jpg',
  '/images/pato.jpg',
  '/images/pente.jpg',
  '/images/pia.jpg',
  '/images/porta.jpg',
  '/images/pote.jpg',
  '/images/prato.jpg',
  '/images/pufe.jpg',
  '/images/radio.jpg',
  '/images/regador.jpg',
  '/images/relogio.jpg',
  '/images/rosa.jpg',
  '/images/sabao.jpg',
  '/images/sapato.jpg',
  '/images/sapo.jpg',
  '/images/sofa.jpg',
  '/images/sopa.jpg',
  '/images/suco.jpg',
  '/images/tapete.jpg',
  '/images/urso.jpg',
  '/images/vaso.jpg',

  // Áudios de Feedback e Efeitos
  '/audio/feedback/welcome.mp3',
  '/audio/feedback/parabens.mp3',
  '/audio/feedback/almost.mp3',
  '/audio/feedback/inverted.mp3',
  '/audio/feedback/gotcha.mp3',
  '/audio/feedback/dica-r-brando.mp3',
  '/audio/feedback/dica-r-forte.mp3',

  // Sílabas Fonéticas Críticas
  '/audio/syllables/RO.mp3',
  '/audio/syllables/RO_OPEN.mp3',
  '/audio/syllables/RO_TEPE.mp3',
  '/audio/syllables/RE.mp3',
  '/audio/syllables/RE_TEPE.mp3',
  '/audio/syllables/BO.mp3',
  '/audio/syllables/BO_OPEN.mp3',
  '/audio/syllables/CO.mp3',
  '/audio/syllables/CO_OPEN.mp3',
  '/audio/syllables/PO.mp3',
  '/audio/syllables/PO_OPEN.mp3',
  '/audio/syllables/DOR.mp3'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. Pré-cache resiliente de todos os ativos estáticos
      await Promise.allSettled(
        STATIC_ASSETS.map(async (assetUrl) => {
          try {
            const res = await fetch(assetUrl, { cache: 'no-cache' });
            if (res.ok) {
              await cache.put(assetUrl, res);
            }
          } catch (err) {
            console.warn('[SW] Falha ao pré-cachear:', assetUrl, err);
          }
        })
      );

      // 2. Descoberta e pré-cache dinâmico dos bundles JS e CSS de /index.html
      try {
        const htmlRes = await fetch('/index.html', { cache: 'no-cache' });
        if (htmlRes.ok) {
          const htmlClone = htmlRes.clone();
          await cache.put('/index.html', htmlRes);
          await cache.put('/', htmlClone);

          const htmlText = await htmlClone.text();
          const matches = htmlText.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g);
          const bundles = Array.from(new Set(Array.from(matches, (m) => m[1])));

          for (const bundleUrl of bundles) {
            try {
              const bRes = await fetch(bundleUrl);
              if (bRes.ok) {
                await cache.put(bundleUrl, bRes);
                console.log('[SW] Bundle descoberto e cacheado com sucesso:', bundleUrl);
              }
            } catch (bErr) {
              console.warn('[SW] Falha ao pré-cachear bundle:', bundleUrl, bErr);
            }
          }
        }
      } catch (htmlErr) {
        console.warn('[SW] Falha na descoberta de bundles em index.html:', htmlErr);
      }
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Limpando cache legado:', key);
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Apenas requisições GET
  if (event.request.method !== 'GET') return;

  // Ignora requisições de desenvolvimento do Vite e funções de backend
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules') ||
    url.pathname.startsWith('/.netlify') ||
    url.pathname.startsWith('/api') ||
    url.searchParams.has('token')
  ) {
    return;
  }

  // 1. Requisição de Navegação (HTML principal do app)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Tenta a rede com timeout rápido para não prender a experiência
          const networkPromise = fetch(event.request);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), 2500)
          );

          const networkResponse = await Promise.race([networkPromise, timeoutPromise]);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, networkResponse.clone());
            cache.put('/index.html', networkResponse.clone());
            cache.put('/', networkResponse.clone());
            return networkResponse;
          }
        } catch {
          // Offline ou timeout: busca imediatamente no cache
        }

        // Fallback garantido no cache
        const cached =
          (await caches.match(event.request)) ||
          (await caches.match('/index.html')) ||
          (await caches.match('/'));

        if (cached) return cached;

        return new Response('Offline - Conteúdo não disponível', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      })()
    );
    return;
  }

  // 2. Requisições Estáticas: JS, CSS, Imagens, Áudios e Fontes (Cache First)
  event.respondWith(
    (async () => {
      // Tenta o cache primeiro com suporte a ignoreSearch para query de versão (?v=2)
      const cachedResponse =
        (await caches.match(event.request)) ||
        (await caches.match(event.request, { ignoreSearch: true }));

      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não estiver em cache, busca na rede e guarda dinamicamente
      try {
        const networkResponse = await fetch(event.request);
        if (
          networkResponse &&
          (networkResponse.status === 200 || networkResponse.type === 'opaque')
        ) {
          const responseToCache = networkResponse.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, responseToCache);
        }
        return networkResponse;
      } catch (err) {
        // Fallback suave para imagens se estiver offline
        if (event.request.destination === 'image') {
          const fallbackIcon = await caches.match('/icons/icon-192.svg');
          if (fallbackIcon) return fallbackIcon;
        }
        throw err;
      }
    })()
  );
});
