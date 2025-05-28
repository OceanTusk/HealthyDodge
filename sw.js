const CACHE_NAME = 'comida-chatarra-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/estilos.css',
  '/game.js',
  '/img/player.png',
  '/img/obstaculos/hamburguesa.png',
  '/img/obstaculos/papas.png',
  '/img/obstaculos/refresco.png',
  '/img/obstaculos/dona.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});