/* src/service-worker.js */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute }    from 'workbox-routing';
import { NetworkFirst }     from 'workbox-strategies';
import { CacheFirst }       from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// 1) Precaching – __WB_MANIFEST zamenja manifest assetov ob buildu
precacheAndRoute(self.__WB_MANIFEST);

// 2) Runtime-caching za tvojo API domeno
registerRoute(
  ({ url }) => url.origin === 'https://api.tvoja-domena.si',
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [ new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }) ]
  })
);

// 3) Runtime-caching za slike
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [ new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }) ]
  })
);

// 4) Offline fallback pri navigaciji
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
  }
});

// 5) Push obvestila
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'Obvestilo', body: 'Nova vsebina' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo-192x192.png',
      badge: '/logo-192x192.png',
      data: data.url || '/'
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(list => list.length ? list[0].focus() : clients.openWindow(event.notification.data))
  );
});
