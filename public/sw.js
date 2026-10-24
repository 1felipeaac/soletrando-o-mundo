// Service Worker para Soletrando o Mundo (PWA Offline)
const CACHE_NAME = 'soletrando-mundo-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/images/bedroom_scene.jpg?v=2',
  '/images/bedroom_scene.jpg',
  '/images/kitchen_scene.jpg',
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
