/* ════════════════════════════════════════════════════════════════════════
   IL SERVICE WORKER DELLA VETRINA — perché si apra anche senza rete.

   ⛔ MISURATO PRIMA DI SCRIVERLO, il 25/08, invece di darlo per fatto.
   Il fondatore ha chiesto se la vetrina possa girare offline, «visto che
   tutte le app dovrebbero saperlo fare». Censimento delle dieci superfici:
     · otto hanno il MANIFEST (quindi si installano sul telefono);
     · **due sole** hanno un service worker — il core (`/sw.js`) e Genesi
       (`/apps/genesi/genesi-sw.js`).
   Cioè le sei app verticali si installano e poi hanno bisogno della rete
   lo stesso, e la vetrina non aveva né l'uno né l'altro.
   Provato staccando la rete: la vetrina offline era una PAGINA BIANCA.

   ⚠️ E non bastava il service worker del CORE, che pure ha la radice come
   ambito e quindi controlla anche `/apps/`: misurato aprendo prima il core
   (col finto Firebase, se no non parte) e poi la vetrina — service worker
   attivo con ambito `/`, e la vetrina offline **ancora bianca**. Il suo
   ripiego di navigazione riporta a `./index.html`, che dalla sua posizione è
   il CORE: chi cerca la vetrina si troverebbe un'altra pagina.

   ── PERCHÉ NON CI SI METTE DENTRO TUTTO ──
   Le immagini pesano 12,8 MB in 148 file (18 sfondi grandi = 8,5 MB, 130
   schermate = 4,3 MB). Precaricarle tutte all'installazione vorrebbe dire
   scaricare dodici megabyte a chi apre la pagina per la prima volta, magari
   col telefono in cava — per una cosa che serve dopo. Quindi:
     · si precarica lo SCHELETRO (la pagina e il marchio): ~133 KB;
     · le immagini entrano in cache MAN MANO CHE SI VEDONO, e da lì restano.
   Effetto: la prima visita non costa niente in più, la seconda non tocca la
   rete, e offline si vede quello che si era già visto.

   ── PERCHÉ LE DUE STRATEGIE SONO DIVERSE ──
   · le IMMAGINI si servono dalla cache per prime e senza chiedere: il loro
     nome È l'impronta del contenuto (`scorpora.py` lo costruisce con lo sha1),
     quindi un file con quel nome non cambierà mai;
   · la PAGINA si chiede prima alla rete: cambia allo stesso indirizzo a ogni
     deploy, e servirla dalla cache per prima vorrebbe dire mostrare per
     giorni una versione vecchia a chi ha la rete. La cache è il suo ripiego.

   ── PERCHÉ IL GESTORE È STRETTO ──
   Un service worker in `/apps/sw.js` ha per ambito `/apps/`, cioè controlla
   ANCHE `/apps/terra/`, `/apps/scudo/` e tutte le altre. Quelle app parlano
   con Firebase e hanno bisogno loro di decidere che cosa tenere: applicargli
   la strategia di una pagina statica sarebbe un danno. Quindi qui si risponde
   SOLO per la vetrina e le sue immagini, e su tutto il resto non si chiama
   `respondWith`: il browser fa quello che avrebbe fatto senza di noi.
   ════════════════════════════════════════════════════════════════════════ */

const VERSIONE = 'vetrina-v1';

/* lo scheletro: senza questi due la pagina non esiste */
const SCHELETRO = [
  './',
  './index.html',
  './img/marchio.svg',
];

const IMMAGINI = /\/apps\/img\/[^/]+$/;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSIONE)
      /* ⛔ uno per uno con la sua rete di sicurezza: `addAll` fallisce TUTTO
         se un solo file non risponde, e allora il service worker non si
         installa e non lo dice nessuno. */
      .then(c => Promise.all(SCHELETRO.map(u =>
        c.add(new Request(u, { cache: 'reload' })).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n.startsWith('vetrina-') && n !== VERSIONE)
        .map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let via;
  try { via = new URL(req.url); } catch (_) { return; }
  if (via.origin !== self.location.origin) return;      // niente di fuori casa

  /* 1. LE IMMAGINI DELLA VETRINA — dalla cache per prime, e ci restano */
  if (IMMAGINI.test(via.pathname)) {
    e.respondWith(
      caches.match(req).then(c => c || fetch(req).then(r => {
        if (r && r.ok) { const copia = r.clone(); caches.open(VERSIONE).then(x => x.put(req, copia)); }
        return r;
      }).catch(() => c))
    );
    return;
  }

  /* 2. LA PAGINA DELLA VETRINA — prima la rete, la cache come ripiego.
     ⚠️ Si riconosce dal percorso, non dal fatto che sia una navigazione:
     `/apps/terra/` è una navigazione anche lei, e non è nostra. */
  const nostra = via.pathname === '/apps/' || via.pathname === '/apps/index.html';
  if (nostra && req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        if (r && r.ok) { const copia = r.clone(); caches.open(VERSIONE).then(x => x.put('./index.html', copia)); }
        return r;
      }).catch(() =>
        caches.match('./index.html').then(c => c || caches.match('./')).then(c =>
          c || new Response('<!doctype html><meta charset=utf-8><title>Deepwork</title>'
            + '<body style="background:#08090c;color:#e8e6e3;font:16px system-ui;padding:2rem">'
            + '<p>La vetrina non è ancora stata salvata su questo telefono: apri la pagina una volta con la rete, e da lì in poi funzionerà anche senza.</p>',
            { headers: { 'content-type': 'text/html; charset=utf-8' } })))
    );
    return;
  }

  /* 3. TUTTO IL RESTO — comprese le sei app, che stanno nel nostro ambito ma
     non sono affar nostro: non si chiama `respondWith`, e il browser fa
     esattamente quello che avrebbe fatto se noi non ci fossimo. */
});
