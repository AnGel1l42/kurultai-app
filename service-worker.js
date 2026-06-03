const CACHE_NAME = "kurultai-app-v15";

const FILES_TO_CACHE = [
  "./",
  "./index.html",

  "./style.css?v=15",
  "./app.js?v=15",
  "./characters.js?v=15",
  "./questions.js?v=15",

  "./manifest.json",

  "./images/backgrounds/main-bg.png",
  "./images/logo/kurultai-logo.png",

  "./images/menu/encyclopedia.png",
  "./images/menu/quiz.png",
  "./images/menu/rules.png",
  "./images/menu/about.png",

  "./images/nav/home.png",
  "./images/nav/heroes.png",
  "./images/nav/quiz.png",
  "./images/nav/rules.png",

  "./images/panels/panel-texture.png",

  "./images/app-icons/icon-192.png",
  "./images/app-icons/icon-512.png"
];

/* ----------------------------- */
/* Установка service worker */
/* ----------------------------- */

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

/* ----------------------------- */
/* Активация и очистка старого кэша */
/* ----------------------------- */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

/* ----------------------------- */
/* Загрузка файлов из кэша */
/* ----------------------------- */

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});