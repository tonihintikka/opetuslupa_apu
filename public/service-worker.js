// AjoKamu Service Worker
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `ajokamu-cache-v${CACHE_VERSION}`;

// Välimuistiin talletettavat resurssit
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/favicon.ico',
];

// Asennus: resurssien tallentaminen välimuistiin
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Välimuisti avattu');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Aktivoi service worker heti
});

// Aktivointi: vanhojen välimuistien poistaminen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Poista vain AjoKamu-välimuistit, jotka eivät vastaa nykyistä versiota
          if (cacheName.startsWith('ajokamu-cache-') && cacheName !== CACHE_NAME) {
            console.log('Service Worker: Vanha välimuisti poistetaan', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Kerro kaikille asiakkaille että service worker on päivitetty
  self.clients.claim();

  // Lähetä versiopäivitysilmoitus
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'VERSION_UPDATED',
        version: CACHE_VERSION
      });
    });
  });
});

// Resurssipyyntöjen käsittely
self.addEventListener('fetch', (event) => {
  // Tarkistetaan onko kyseessä API-pyyntö
  const isApiRequest = event.request.url.includes('/api/');

  // Ohitetaan API-kutsut ja muut kuin GET-pyynnöt
  if (isApiRequest || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Palautetaan välimuistista jos löytyy
      if (response) {
        return response;
      }

      // Jos ei löydy välimuistista, haetaan verkosta
      return fetch(event.request).then((fetchResponse) => {
        // Älä talleta jos vastaus ei ole ok
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }

        // Talletetaan vastaus välimuistiin
        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return fetchResponse;
      }).catch(err => {
        console.error('Fetch failed:', err);
        // Tähän voisi lisätä offline-sivun jos halutaan
      });
    })
  );
});

// Versionpäivitysviestien kuuntelu
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: CACHE_VERSION
    });
  }
}); 