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
      /* ?tema=sole in coda all'indirizzo: comodo per provarlo e per i
         collegamenti. Va CONSUMATO alla prima lettura e tolto dall'indirizzo:
         se resta lì, ogni lettura successiva torna a dire "chiaro" e il
         bottone del tema gira a vuoto, bloccato sul valore dell'indirizzo. */
      var q = new URLSearchParams(location.search).get('tema');
      if (q && MODI.indexOf(q) >= 0) {
        salva(q);
        try {
          var u = new URL(location.href);
          u.searchParams.delete('tema');
          history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
        } catch (e) { /* se non si può riscrivere l'indirizzo, pazienza */ }
        return q;
      }
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

  /* ── Il bottone per cambiare tema, nella barra in alto di ogni app ──
     Senza questo bottone la scelta fatta nel core resta prigioniera: chi
     apriva un'app in modalità chiara non aveva modo di tornare allo scuro.
     Si inserisce da solo accanto al pulsante casa, così le sei app non
     devono fare niente e restano identiche fra loro. */
  var ICONE = { scuro: '🌙', chiaro: '☀️', sole: '🔆' };
  var NOMI  = { scuro: 'Scuro', chiaro: 'Chiaro', sole: 'Sole' };
  var PROSSIMO = { scuro: 'chiaro', chiaro: 'sole', sole: 'scuro' };

  function aggiornaBottone(b, t) {
    b.textContent = ICONE[t] || ICONE.scuro;
    var succ = NOMI[PROSSIMO[t]];
    b.title = 'Tema: ' + NOMI[t] + ' — tocca per passare a ' + succ;
    b.setAttribute('aria-label', b.title);
  }

  function montaBottone() {
    var top = document.querySelector('header.top');
    if (!top || document.getElementById('dw-tema-btn')) return;
    var b = document.createElement('button');
    b.id = 'dw-tema-btn';
    b.type = 'button';
    b.className = 'dw-tema-btn';
    aggiornaBottone(b, leggi());
    b.addEventListener('click', function () { aggiornaBottone(b, window.dwTema()); });
    var casa = top.querySelector('.dw-home');
    if (casa) top.insertBefore(b, casa); else top.appendChild(b);
  }

  function avvia() { applica(leggi()); montaBottone(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', avvia);
  else avvia();

  // se la preferenza cambia in un'altra scheda, questa si adegua da sola
  window.addEventListener('storage', function (e) { if (e.key === CHIAVE) applica(leggi()); });
})();
