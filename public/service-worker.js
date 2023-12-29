const CACHE_NAME = 'v1';
const CACHE_ITEMS = [
  '/',
  'index.html',
  'bundle.js',
  'static/js/bundle.js'
];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_ITEMS).then(() => self.skipWaiting()))));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// self.addEventListener('fetch', event => {
//   console.log(`fetching ${event.request.url}`);
//   if (navigator.onLine) {
//     let fetchRequest = event.request.clone();
//     return fetch(fetchRequest).then(response => {
//       if (!response || response.status !== 200 || response.type !== 'basic') {
//         return response;
//       }

//       let responseToCache = response.clone();

//       caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));

//       return response;
//     });
//   }
//   else {
//     event.respondWith(caches.match(event.request).then(response => {
//       if (response) {
//         return response;
//       }
//     }));
//   }
// });
