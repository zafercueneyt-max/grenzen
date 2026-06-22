/* Service Worker – macht die App offline-fähig.
   Strategie:
   - App-Hülle (index.html, icon, manifest) wird beim Install gecacht.
   - wait-times.json: immer zuerst aus dem Netz (frisch), bei Offline aus dem Cache.
   - Alles andere (Kameras, Karten, KI) läuft sowieso über externe Links und braucht Netz.
*/
var CACHE = 'grenzen-v1';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Nur eigene (same-origin) Anfragen behandeln – externe Links nie abfangen.
  if (url.origin !== self.location.origin) return;

  // Live-Wartezeiten: network-first (frisch halten), Fallback Cache.
  if (url.pathname.indexOf('wait-times.json') !== -1) {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // App-Hülle: cache-first, sonst Netz.
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});
