const CACHE_NAME = 'time-from-day-v1';
const urlsToCache = ['/', '/index.html', '/popup.css', '/popup.js', '/Calendar_Icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});