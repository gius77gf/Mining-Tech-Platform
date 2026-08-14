/* ══════════════════════════════════════════════════════════════════════════
   DEEPWORK — FLUIDITÀ DELLE SCHERMATE (motore)  ·  compagno di dw-fluido.css
   ══════════════════════════════════════════════════════════════════════════
   Si attacca da solo, senza toccare una riga del codice delle app: guarda
   quali elementi cambiano e ci mette sopra il movimento giusto.

   INSTALLAZIONE (basta questa)
     <link rel="stylesheet" href="../../shared/dw-fluido.css">
     <script src="../../shared/dw-fluido.js" defer></script>

   COSA FA DA SOLO
   · .page che diventa .active  → dissolvenza + micro-scorrimento (190 ms)
   · .nav                        → pillola che scivola sotto la voce attiva
   · [data-dw-scagliona]         → le voci nuove compaiono sfasate di 26 ms;
                                   se l'utente sta scorrendo la cascata salta
   · bottoni, modali, toast      → micro-interazioni (vedi il CSS)

   USO A MANO (quando serve pilotarlo)
     dwFluido.entra(document.getElementById('pag-mezzi'));   // rigioca l'ingresso
     dwFluido.scagliona(document.getElementById('lista'));   // cascata una volta
     dwFluido.pillola(document.querySelector('.nav'));       // riallinea la pillola
     dwFluido.avvia({ scaglionaTutto: true });               // riavvia il modulo
     dwFluido.ferma();                                       // stacca tutto

   PROMESSE (sono vincoli, non desideri)
   · Nessuna animazione fa aspettare: non si disabilita niente mentre si
     muove, e un secondo tocco rapido non viene mangiato dal primo.
   · Si muovono solo transform e opacity.
   · prefers-reduced-motion: il modulo si installa lo stesso (per la pillola,
     che si limita a saltare) ma il CSS spegne ogni animazione.
   ══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var doc = global.document;
  var stato = { attivo: false, osservatori: [], ascolti: [], scorre: 0 };

  function on(t, ev, fn, opt) {
    t.addEventListener(ev, fn, opt || false);
    stato.ascolti.push([t, ev, fn, opt || false]);
  }

  /* riparte un'animazione che è già stata giocata: togli la classe, forza un
     riflusso, rimettila. Serve perché tornando sulla stessa pagina il
     browser non rigioca da solo. */
  function rigioca(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  /* ─────────────── 1 · cambio pagina ─────────────── */

  var ordinePagine = [];
  function indicePagina(el) { return ordinePagine.indexOf(el); }

  function entra(pagina, indietro) {
    if (!pagina) return;
    pagina.classList.toggle('indietro', !!indietro);
    rigioca(pagina, 'dwf-entra');
    /* le liste dentro la pagina appena entrata fanno la loro cascata */
    var liste = pagina.querySelectorAll('[data-dw-scagliona]');
    for (var i = 0; i < liste.length; i++) scagliona(liste[i]);
  }

  function osservaPagine() {
    var pagine = doc.querySelectorAll('.page');
    if (!pagine.length) return;
    ordinePagine = Array.prototype.slice.call(pagine);
    var ultimo = -1;
    for (var i = 0; i < pagine.length; i++) if (pagine[i].classList.contains('active')) ultimo = i;

    var mo = new MutationObserver(function (mut) {
      for (var m = 0; m < mut.length; m++) {
        var t = mut[m].target;
        if (!t.classList || !t.classList.contains('page')) continue;
        if (!t.classList.contains('active')) continue;
        var i2 = indicePagina(t);
        if (i2 === ultimo) continue;
        entra(t, i2 < ultimo);
        ultimo = i2;
      }
    });
    for (var j = 0; j < pagine.length; j++) mo.observe(pagine[j], { attributes: true, attributeFilter: ['class'] });
    stato.osservatori.push(mo);
  }

  /* ─────────────── 2 · la pillola della navigazione ─────────────── */

  function pillola(nav) {
    nav = nav || doc.querySelector('.nav');
    if (!nav) return null;
    nav.classList.add('dwf-nav');
    var p = nav.querySelector('.dwf-pillola');
    if (!p) {
      p = doc.createElement('span');
      p.className = 'dwf-pillola';
      p.setAttribute('aria-hidden', 'true');
      nav.insertBefore(p, nav.firstChild);
    }
    allinea(nav, p);
    return p;
  }

  function allinea(nav, p) {
    var b = nav.querySelector('button.active');
    if (!b) { p.classList.remove('on'); return; }
    var rn = nav.getBoundingClientRect(), rb = b.getBoundingClientRect();
    if (!rb.width) { p.classList.remove('on'); return; }
    var w = Math.min(46, rb.width - 8);
    var x = rb.left - rn.left + (rb.width - w) / 2;
    p.style.width = w.toFixed(1) + 'px';
    p.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    p.classList.add('on');
  }

  function osservaNav() {
    var nav = doc.querySelector('.nav');
    if (!nav) return;
    var p = pillola(nav);
    if (!p) return;
    var mo = new MutationObserver(function () { allinea(nav, p); });
    var bs = nav.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) mo.observe(bs[i], { attributes: true, attributeFilter: ['class'] });
    stato.osservatori.push(mo);
    /* il tocco muove la pillola SUBITO, senza aspettare che l'app aggiorni
       le classi: è il movimento che dice "ti ho sentito" */
    on(nav, 'pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('button');
      if (!b || b.classList.contains('active')) return;
      var rn = nav.getBoundingClientRect(), rb = b.getBoundingClientRect();
      var w = Math.min(46, rb.width - 8);
      p.style.width = w.toFixed(1) + 'px';
      p.style.transform = 'translate3d(' + (rb.left - rn.left + (rb.width - w) / 2).toFixed(1) + 'px,0,0)';
      p.classList.add('on');
    });
    on(global, 'resize', function () { allinea(nav, p); });
  }

  /* ─────────────── 3 · comparsa scaglionata ─────────────── */

  function scagliona(cont, opt) {
    if (!cont) return;
    if (stato.scorre && Date.now() < stato.scorre) return;   /* si sta scorrendo: niente cascata */
    opt = opt || {};
    var max = opt.max || 12;
    var figli = cont.children;
    var n = Math.min(figli.length, max);
    for (var i = 0; i < figli.length; i++) {
      var f = figli[i];
      if (!f.style) continue;
      f.classList.remove('dwf-in');
      if (i < n) {
        f.style.setProperty('--dwf-i', String(i));
        void f.offsetWidth;
        f.classList.add('dwf-in');
      } else {
        f.style.removeProperty('--dwf-i');
      }
    }
  }

  function osservaListe() {
    var liste = doc.querySelectorAll('[data-dw-scagliona]');
    for (var i = 0; i < liste.length; i++) {
      (function (l) {
        var mo = new MutationObserver(function (mut) {
          for (var m = 0; m < mut.length; m++) if (mut[m].addedNodes.length) { scagliona(l); return; }
        });
        mo.observe(l, { childList: true });
        stato.osservatori.push(mo);
        scagliona(l);
      })(liste[i]);
    }
  }

  /* mentre si scorre non si anima niente di nuovo: il contenuto che arriva
     sotto il dito deve essere già lì */
  function osservaScorrimento() {
    on(global, 'scroll', function () {
      stato.scorre = Date.now() + 260;
      doc.body.classList.add('dwf-scorre');
      clearTimeout(stato.tScorre);
      stato.tScorre = setTimeout(function () { doc.body.classList.remove('dwf-scorre'); }, 260);
    }, { passive: true });
  }

  /* ─────────────── avvio / arresto ─────────────── */

  function avvia(opt) {
    if (!doc || !doc.body) return api;
    if (stato.attivo) ferma();
    opt = opt || {};
    doc.body.classList.add('dwf');
    osservaPagine();
    osservaNav();
    osservaListe();
    osservaScorrimento();
    if (opt.scaglionaTutto) {
      /* comodità: marca da sé i contenitori di lista più comuni delle app */
      var cand = doc.querySelectorAll('.page.active > div[id]');
      for (var i = 0; i < cand.length; i++) {
        if (cand[i].children.length > 2 && cand[i].querySelector('.item')) {
          cand[i].setAttribute('data-dw-scagliona', '');
          scagliona(cand[i]);
        }
      }
    }
    stato.attivo = true;
    return api;
  }

  function ferma() {
    stato.osservatori.forEach(function (o) { try { o.disconnect(); } catch (e) { /* niente */ } });
    stato.ascolti.forEach(function (a) { a[0].removeEventListener(a[1], a[2], a[3]); });
    stato.osservatori = []; stato.ascolti = [];
    if (doc && doc.body) doc.body.classList.remove('dwf', 'dwf-scorre');
    stato.attivo = false;
    return api;
  }

  var api = {
    avvia: avvia, ferma: ferma,
    entra: entra, scagliona: scagliona, pillola: pillola,
    versione: '1.0'
  };
  global.dwFluido = api;

  if (doc) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { avvia(); });
    else avvia();
  }

})(typeof window !== 'undefined' ? window : globalThis);
