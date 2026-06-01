const CACHE_NAME = 'tumaini-cache-v15';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/logo.svg',
  '/assets/images/logo.png',
  '/assets/images/tumaini_festival_white_logo.svg',
  '/assets/images/patterns/festival-pattern.svg',
  '/assets/data/program-schedule.json',
  '/assets/data/festival-data.json',
  '/pages/about.html',
  '/pages/media-coverage.html',
  '/pages/program.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Skip caching for non-http/https requests (e.g. chrome-extension://, data:, etc.)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) return;

  const isSameOrigin = url.origin === self.location.origin;
  const shouldPreferFresh =
    isSameOrigin &&
    (
      event.request.mode === 'navigate' ||
      ['document', 'script', 'style'].includes(event.request.destination) ||
      url.pathname.endsWith('.json')
    );

  if (shouldPreferFresh) {
    event.respondWith(
      fetch(event.request).then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      }).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      }).catch((err) => {
        // If we have a cached version, ignore the background fetch error to prevent console errors.
        // Otherwise, throw the error so the browser can handle it normally (e.g. showing offline page).
        if (!cached) {
          throw err;
        }
      });

      // Return cached version if available, otherwise fetch from network
      return cached || network;
    })
  );
});
