// A service worker is a script that runs in the background, separate from
// the page itself. Its main job here: cache the app's files the first time
// they're loaded, then serve them from that cache on future visits —
// including when you have no signal at all.

const CACHE_NAME = 'workclock-cache-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 'install' fires once, when the browser first registers this service worker.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// 'activate' fires after install — good place to clear out old caches
// from previous versions of the app.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 'fetch' fires for every network request the page makes. Strategy here:
// try the cache first (fast, works offline), fall back to the network
// if something isn't cached yet.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
