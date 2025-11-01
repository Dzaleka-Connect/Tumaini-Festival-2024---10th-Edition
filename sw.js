const CACHE_NAME = 'tumaini-cache-v12';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/subtle-improvements.css',
  '/assets/js/main.js',
  '/assets/images/logo.svg',
  '/assets/images/logo.png',
  '/assets/images/tumaini_festival_white_logo.svg',
  '/assets/data/program-schedule.json',
  '/assets/data/festival-data.json',
  '/pages/about.html',
  '/pages/media-coverage.html'
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
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request).then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return resp;
      });
      // Return cached version if available, otherwise fetch from network
      return cached || network;
    })
  );
});


