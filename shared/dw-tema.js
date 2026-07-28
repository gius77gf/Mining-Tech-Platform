/* ══════════════════════════════════════════════════════════════════════════
   DEEPWORK — preferenza di tema condivisa fra il core e le app
   ══════════════════════════════════════════════════════════════════════════
   Il problema che risolve: chi in cava accende la modalità sole nel core e
   poi apre Scudo o Terra si ritrova al buio, con lo schermo illeggibile.
   Qui la scelta viene salvata una volta sola (localStorage, chiave
   'dw-tema') e vale per tutte le pagine dell'ecosistema.

   Valori: 'scuro' (di serie) | 'chiaro' | 'sole'
   L'aspetto lo decide shared/dw-app-ui.css tramite le classi che questo
   file mette sul <body>: light-mode / outdoor-mode. Senza preferenza
   salvata non tocca niente: l'app resta scura com'era.

   Da console o da un futuro bottone:  dwTema('sole')   imposta
                                       dwTema()         gira fra i tre
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var CHIAVE = 'dw-tema';
  var MODI = ['scuro', 'chiaro', 'sole'];

  function leggi() {
    try {
      // ?tema=sole in coda all'indirizzo: comodo per provarla e per i collegamenti
      var q = new URLSearchParams(location.search).get('tema');
      if (q && MODI.indexOf(q) >= 0) { salva(q); return q; }
      var s = localStorage.getItem(CHIAVE);
      return MODI.indexOf(s) >= 0 ? s : 'scuro';
    } catch (e) { return 'scuro'; }
  }

  function salva(t) { try { localStorage.setItem(CHIAVE, t); } catch (e) { /* niente */ } }

  function applica(t) {
    var b = document.body;
    if (!b) return;
    b.classList.toggle('light-mode', t === 'chiaro');
    b.classList.toggle('outdoor-mode', t === 'sole');
    // la barra di sistema del telefono segue il fondo della pagina
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) {
      if (!m.dataset.dwScuro) m.dataset.dwScuro = m.content;
      m.content = (t === 'scuro') ? m.dataset.dwScuro : '#ffffff';
    }
  }

  // API pubblica: senza argomento gira fra scuro → chiaro → sole
  window.dwTema = function (t) {
    if (!t) t = MODI[(MODI.indexOf(leggi()) + 1) % MODI.length];
    if (MODI.indexOf(t) < 0) t = 'scuro';
    salva(t); applica(t);
    return t;
  };
  window.dwTemaCorrente = leggi;

  function avvia() { applica(leggi()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
  else avvia();

  // se la preferenza cambia in un'altra scheda, questa si adegua da sola
  window.addEventListener('storage', function (e) { if (e.key === CHIAVE) applica(leggi()); });
})();
