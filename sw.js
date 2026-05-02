// ════════════════════════════════════════════════════════════════
// DEEPWORK SERVICE WORKER v1
// Strategia: cache-first per app shell, network-first per Firestore
// ════════════════════════════════════════════════════════════════

const CACHE_VERSION = 'deepwork-v3';
const APP_SHELL = [
  './',
  './deepwork-v3.3.html',
  './deepwork-v3.2.html',
  // Google Fonts CSS (il font file viene cachato dinamicamente al primo uso)
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500;600&display=swap',
  // Librerie CDN
  'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
  // Firebase SDK ESM (precachato in install per sicurezza)
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js'
];

// Pattern URL Firestore — non vanno cachate in cache-first, useremo network-first
const FIRESTORE_RE = /firestore\.googleapis\.com|firebaseio\.com/;
const FONT_FILE_RE = /fonts\.gstatic\.com/;

// ── INSTALL: precache app shell ──
self.addEventListener('install', e => {
  console.log('[SW] Install', CACHE_VERSION);
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      // Aggiungi le risorse una per una con catch, per non bloccare se una CDN fallisce
      return Promise.all(APP_SHELL.map(url =>
        cache.add(new Request(url, {credentials: 'omit'})).catch(err => {
          console.warn('[SW] Precache fallito per', url, err.message);
        })
      ));
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: pulisci cache vecchie ──
self.addEventListener('activate', e => {
  console.log('[SW] Activate', CACHE_VERSION);
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// ── FETCH: routing intelligente ──
self.addEventListener('fetch', e => {
  const url = e.request.url;
  const method = e.request.method;

  // Skip cross-origin POST/PUT/DELETE (es. scritture Firestore)
  if (method !== 'GET') return;

  // Firestore: NETWORK-FIRST con fallback cache (le scritture le gestisce IndexedDB persistence di Firebase)
  if (FIRESTORE_RE.test(url)) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Font files: cache-first persistente
  if (FONT_FILE_RE.test(url)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
        if (resp && resp.ok) {
          const respClone = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, respClone));
        }
        return resp;
      }))
    );
    return;
  }

  // App shell + CDN: CACHE-FIRST
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Ritorna subito dalla cache, ma aggiorna in background (stale-while-revalidate)
        fetch(e.request).then(resp => {
          if (resp && resp.ok) {
            caches.open(CACHE_VERSION).then(c => c.put(e.request, resp.clone()));
          }
        }).catch(() => {});
        return cached;
      }
      // Non in cache: prova rete, se fallisce mostra fallback
      return fetch(e.request).then(resp => {
        if (resp && resp.ok && resp.type !== 'opaque') {
          const respClone = resp.clone();
          caches.open(CACHE_VERSION).then(c => c.put(e.request, respClone));
        }
        return resp;
      }).catch(() => {
        // Se è una richiesta di navigazione fallita, ritorna l'app shell
        if (e.request.mode === 'navigate') {
          return caches.match('./deepwork-v3.3.html') || caches.match('./deepwork-v3.2.html') || caches.match('./');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// ── MESSAGGI dal client (per skipWaiting manuale) ──
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
