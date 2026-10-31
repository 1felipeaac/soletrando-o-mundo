import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Gerenciamento de Service Worker PWA
if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    // Registra imediatamente para que o pré-cache ocorra o mais cedo possível
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch((err) => {
        console.warn('[PWA] Falha ao registrar Service Worker:', err);
      });
  } else {
    // Em modo de desenvolvimento, remove service workers prévios e limpa caches
    // para evitar conflitos de HMR, WebSockets e chunks em cache no localhost
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      });
    }
  }
}
