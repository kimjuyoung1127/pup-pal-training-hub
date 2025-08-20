// This is a minimal service worker to make the app installable.
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // You can add pre-caching logic here if needed in the future.
});

self.addEventListener('fetch', (event) => {
  // This basic fetch handler is needed to make the app installable.
  // It doesn't do anything special, just passes the request through.
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
});
