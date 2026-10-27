// Service Worker para Soletrando o Mundo (PWA Offline)
const CACHE_NAME = 'soletrando-mundo-v9';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/images/bedroom_scene.jpg?v=3',
  '/images/bedroom_scene.jpg',
  '/images/kitchen_scene.jpg?v=2',
  '/images/kitchen_scene.jpg',
  '/images/living_room_scene.jpg?v=3',
  '/images/living_room_scene.jpg',
  '/images/bathroom_scene.jpg?v=3',
  '/images/bathroom_scene.jpg',
  '/images/garden_scene.jpg?v=2',
  '/images/garden_scene.jpg',
  '/images/house_bonus_scene.jpg?v=2',
  '/images/house_bonus_scene.jpg',
  '/images/papel.jpg',
  '/images/pote.jpg',
  '/images/escova.jpg',
  '/images/pente.jpg',
  '/images/bacia.jpg',
  '/images/rosa.jpg',
  '/images/gato.jpg',
  '/images/muro.jpg',
  '/images/sapo.jpg',
  '/images/arvore.jpg',
  '/images/regador.jpg',
  '/images/balanco.jpg',
  '/images/cerca.jpg',
  '/audio/syllables/RO.mp3',
  '/audio/syllables/RO_OPEN.mp3',
  '/audio/syllables/RE.mp3',
  '/audio/syllables/BO.mp3',
  '/audio/syllables/BO_OPEN.mp3',
  '/audio/syllables/CO.mp3',
  '/audio/syllables/CO_OPEN.mp3',
  '/audio/syllables/PO.mp3',
  '/audio/syllables/PO_OPEN.mp3',
  '/audio/syllables/DOR.mp3',
  '/audio/feedback/inverted.mp3',
  '/audio/feedback/welcome.mp3',
  '/audio/feedback/almost.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Somente tratar requisições do mesmo domínio ou áudio/imagens locais
  if (event.request.method !== 'GET') return;

  // Ignora requisições de desenvolvimento do Vite (HMR, módulos virtuais, tokens)
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/node_modules') ||
    url.searchParams.has('token')
  ) {
    return;
  }

  // Requisições de navegação (HTML): Network first com fallback de cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Requisições estáticas (Áudios, Imagens, JS, CSS, Fontes): Cache first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        // Clona e salva em cache dinamicamente para jogo offline
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
