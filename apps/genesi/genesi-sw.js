/* Deepwork Genesi — service worker (PWA offline) */
const CACHE = 'genesi-v3';
const CORE = [
  './genesi.html',
  './calibrazione.json',
  './esplosivi.json',
  './vendor/build/three.module.js',
  './vendor/examples/jsm/controls/OrbitControls.js',
  './vendor/examples/jsm/loaders/OBJLoader.js',
  './vendor/examples/jsm/loaders/GLTFLoader.js',
  './vendor/examples/jsm/utils/BufferGeometryUtils.js',
  './vendor/examples/jsm/postprocessing/EffectComposer.js',
  './vendor/examples/jsm/postprocessing/Pass.js',
  './vendor/examples/jsm/postprocessing/RenderPass.js',
  './vendor/examples/jsm/postprocessing/ShaderPass.js',
  './vendor/examples/jsm/postprocessing/MaskPass.js',
  './vendor/examples/jsm/postprocessing/UnrealBloomPass.js',
  './vendor/examples/jsm/postprocessing/OutputPass.js',
  './vendor/examples/jsm/shaders/CopyShader.js',
  './vendor/examples/jsm/shaders/LuminosityHighPassShader.js',
  './vendor/examples/jsm/shaders/OutputShader.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;   // niente cache cross-origin (risposte opache gonfiano la quota)
  // HTML / navigazione: network-first (gli aggiornamenti arrivano subito), fallback alla cache offline
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return r; })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./genesi.html')))
    );
    return;
  }
  // dati .json: stale-while-revalidate (servi subito la cache, aggiorna in background → mai dati stantii per sempre)
  if (url.pathname.endsWith('.json')) {
    e.respondWith(
      caches.match(e.request).then(r => {
        const net = fetch(e.request).then(resp => { const c = resp.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return resp; })
          .catch(() => r || new Response('', { status: 504 }));
        return r || net;
      })
    );
    return;
  }
  // asset statici (vendor): cache-first, il bump di CACHE spazza le versioni vecchie
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const c = resp.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); return resp;
    }).catch(() => new Response('', { status: 504 })))
  );
});
