/* Grenzen-Check · Service Worker
   ------------------------------------------------------------------
   WICHTIG: Bei JEDER Änderung an index.html die Zahl in CACHE erhöhen
   (v3 -> v4 -> v5 ...). Nur dann merkt das Handy, dass es eine neue
   Version gibt, und zeigt den Aktualisieren-Balken an.
   ------------------------------------------------------------------ */

const CACHE = 'grenzen-v9';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installieren: App-Dateien in den Cache legen
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(SHELL);
    })
  );
});

// Aktivieren: alte Caches wegräumen
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Auf Zuruf der Seite sofort übernehmen (Button "Jetzt aktualisieren")
self.addEventListener('message', function (e) {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', function (e) {
  const req = e.request;

  // Nur eigene Dateien behandeln. Kameras, Karten, AMSS usw. laufen
  // ganz normal übers Netz und werden NICHT gecacht.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Network-first: wenn Netz da ist, immer die frische Datei nehmen
  // und in den Cache legen. Ohne Netz: aus dem Cache liefern.
  e.respondWith(
    fetch(req)
      .then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('./index.html');
        });
      })
  );
});
