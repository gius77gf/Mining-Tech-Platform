/* ============================================================
   LA STRUTTURA DEL CORE, IN UN POSTO SOLO
   ------------------------------------------------------------
   Toast, modale, conferma, richiesta di un valore, chiusura con Escape o
   toccando fuori, riquadri raggiungibili da tastiera, alone che segue il
   mouse. Sono le cose che la direttiva del fondatore vuole IDENTICHE al
   core «pelo per pelo, senza cambiare una virgola».

   ⛔ PERCHÉ ESISTE QUESTO FILE. Fino al 02/08 quel codice era scritto
   SEI VOLTE — una per app, 27 copie di cinque funzioni, ~12.100 caratteri,
   con il 76% delle righe identico carattere per carattere. E una si era
   già staccata: `apriModale` di Scudo aveva un quarto parametro che le
   altre cinque non avevano, per una ragione buona (la segnalazione del
   near-miss si compila a tocchi, e far salire la tastiera davanti ai
   pulsanti è un dispetto). Non era sciatteria: era che serviva. Ed è
   esattamente così che sei copie si allontanano di un pezzo alla volta
   senza che nessuno decida niente.
   Misura e ragionamento: docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md

   COME SI USA. Script classico, come `dw-tema.js` e `dw-grafici.js`:
       <script src="../../shared/dw-app-ui.js" defer></script>
   Definisce funzioni globali (`go`, `toast`, `apriModale`, …) che il blocco
   `type="module"` dell'app usa senza importarle, esattamente come faceva
   con le sue copie locali. L'unica cosa da chiamare è l'aggancio:
       dwUiAggancia({ alone: ".item,.kpi,.segnala" });
   e, per le app che hanno pagine senza una voce nella pillola:
       dwUiAggancia({ alone: ".item,.kpi", navDi: (id) => id === "sch" ? "mez" : id });

   IL CSS NON STA QUI: sta in `shared/dw-app-ui.css`, e lì era già in un
   posto solo.
   ============================================================ */
(function () {
  "use strict";

  // ── NAVIGAZIONE FRA LE PAGINE ───────────────────────────────────────
  // Era scritta SEI VOLTE anche lei, in DUE versioni: cinque app senza
  // guardie, Flotta con le guardie E una mappa. Qui c'è il SOPRAINSIEME —
  // le guardie per tutte, la mappa come parametro — perché la mappa è una
  // FUNZIONE di Flotta mentre le guardie sono una PROTEZIONE, e solo la
  // seconda va data a tutti.
  //
  // ⚠️ Onestà sulla gravità, misurata il 03/08 prima di irrigidire: NESSUNA
  // app chiama oggi `go()` verso una pagina che non esiste. Le guardie
  // servono contro l'id di DOMANI — senza, la riga solleva un errore e la
  // navigazione si ferma lì: schermo fermo, nessun messaggio.
  var navDi = null;   // (id) -> id della voce di navigazione da accendere
  function go(id) {
    document.querySelectorAll(".page").forEach(function (p) { p.classList.remove("active"); });
    document.querySelectorAll(".nav button").forEach(function (b) { b.classList.remove("active"); });
    var pag = document.getElementById("page-" + id);
    if (pag) pag.classList.add("active");
    // Alcune pagine non hanno una voce loro nella pillola (in Flotta la scheda
    // del mezzo e l'ordine di lavoro): ci si arriva da dentro, e allora resta
    // acceso il segnalibro del PADRE. Chi non passa `navDi` accende `nav-<id>`.
    var voce = navDi ? navDi(id) : id;
    var nav = voce ? document.getElementById("nav-" + voce) : null;
    if (nav) nav.classList.add("active");
    window.scrollTo(0, 0);
  }

  // ── TOAST ───────────────────────────────────────────────────────────
  // La durata cresce coi messaggi lunghi: 2,8 s per una riga, 4,2 s per un
  // testo che va letto. Un toast che sparisce prima che uno finisca di
  // leggerlo è un messaggio che non è stato dato.
  var toastT = null;
  function toast(msg, tipo) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.className = "toast " + (tipo || "");
    t.textContent = msg;
    void t.offsetWidth;                     // forza il riavvio dell'animazione
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove("show"); }, String(msg).length > 70 ? 4200 : 2800);
  }

  // ── MODALE ──────────────────────────────────────────────────────────
  // Sostituisce `confirm()` e `prompt()` del browser, che sono vietati: le
  // finestre di sistema sono bianche, fuori stile, e `prompt()` non accetta
  // nemmeno la virgola decimale.
  var modalPrec = null;
  // `opzioni.autofocus === false`: la modale NON porta il fuoco nel primo
  // campo. Serve a chi compila a TOCCHI (la segnalazione rapida del
  // near-miss): far salire la tastiera del telefono davanti ai pulsanti
  // sarebbe un dispetto. Chi non passa `opzioni` ha il comportamento di
  // sempre — il parametro è un soprainsieme, non un cambio.
  function apriModale(titolo, corpo, bottoni, opzioni) {
    modalPrec = document.activeElement;
    document.getElementById("modal-title").textContent = titolo;
    document.getElementById("modal-body").innerHTML = corpo;
    var foot = document.getElementById("modal-foot");
    foot.innerHTML = "";
    (bottoni || []).forEach(function (b) {
      var el = document.createElement("button");
      el.className = "mbtn " + (b.cls || "");
      el.textContent = b.label;
      el.onclick = b.azione;
      foot.appendChild(el);
    });
    document.getElementById("modal").classList.add("show");
    document.body.classList.add("modal-open");
    var primo = (opzioni && opzioni.autofocus === false)
      ? null
      : (document.getElementById("modal-body").querySelector("input,select,textarea")
         || foot.querySelector(".mbtn.primary,.mbtn.danger") || foot.querySelector(".mbtn"));
    if (primo) setTimeout(function () {
      try { primo.focus({ preventScroll: true }); if (primo.select) primo.select(); } catch (e) {}
    }, 80);
  }
  // Chiudendo, il fuoco torna da dove era partito: chi naviga da tastiera
  // altrimenti si ritrova all'inizio della pagina.
  function chiudiModale() {
    document.getElementById("modal").classList.remove("show");
    document.body.classList.remove("modal-open");
    if (modalPrec && modalPrec.focus) { try { modalPrec.focus({ preventScroll: true }); } catch (e) {} }
    modalPrec = null;
  }

  // Conferma in stile core: `Promise<boolean>`.
  // `etichettaExtra` (facoltativa) aggiunge una TERZA strada, e allora la
  // promessa può valere `"extra"`. Serve dove la scelta non è sì/no ma
  // «questa, quella, o niente»: in Conti la finestra che elimina una fattura
  // spiegava che una fattura emessa va stornata con una nota di credito — e
  // poi offriva un solo bottone, che è quello che la regola viola.
  // Chi non la passa ha esattamente i due bottoni di sempre, e `true`/`false`.
  function chiedi(titolo, corpo, etichettaOk, pericolo, etichettaExtra) {
    return new Promise(function (res) {
      var bottoni = [
        { label: "Annulla", azione: function () { chiudiModale(); res(false); } },
      ];
      if (etichettaExtra) bottoni.push({ label: etichettaExtra, cls: "primary",
        azione: function () { chiudiModale(); res("extra"); } });
      bottoni.push({ label: etichettaOk || "Conferma", cls: pericolo ? "danger" : "primary",
        azione: function () { chiudiModale(); res(true); } });
      apriModale(titolo, corpo, bottoni);
    });
  }

  // Richiesta di un valore in stile core: `Promise<string|null>`.
  // L'Invio dentro il campo vale come il pulsante primario: chi scrive un
  // numero e batte Invio si aspetta che salvi, non che non succeda niente.
  function chiediValore(titolo, corpo, campoHtml, etichettaOk) {
    return new Promise(function (res) {
      apriModale(titolo, corpo + campoHtml, [
        { label: "Annulla", azione: function () { chiudiModale(); res(null); } },
        { label: etichettaOk || "Salva", cls: "primary", azione: function () {
            var c = document.getElementById("modal-campo");
            var v = c ? c.value : "";
            chiudiModale(); res(v);
          } },
      ]);
      var c = document.getElementById("modal-campo");
      if (c) c.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); document.querySelector("#modal-foot .mbtn.primary").click(); }
      });
    });
  }

  // ── AGGANCI ─────────────────────────────────────────────────────────
  // Si chiama una volta, quando la pagina è pronta. `alone` è il selettore
  // dei componenti che prendono l'alone dinamico: cambia da app a app
  // perché cambiano i componenti (`.segnala` esiste solo in Scudo), ed è
  // giusto che resti un parametro.
  function dwUiAggancia(opz) {
    var o = opz || {};
    // la mappa della navigazione, per le app che hanno pagine senza una voce
    // loro nella pillola. Chi non la passa accende `nav-<id>`, come sempre.
    if (typeof o.navDi === "function") navDi = o.navDi;

    // toccando fuori dalla modale, o con Escape, si preme il PRIMO pulsante
    // del piede — che per convenzione è quello che annulla
    var modal = document.getElementById("modal");
    if (modal) modal.addEventListener("click", function (e) {
      if (e.target.id === "modal") { var b = document.querySelector("#modal-foot .mbtn"); if (b) b.click(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var m = document.getElementById("modal");
      if (m && m.classList.contains("show")) { var b = m.querySelector("#modal-foot .mbtn"); if (b) b.click(); }
    });

    // i riquadri che si possono toccare si possono anche premere da tastiera
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var k = e.target.closest && e.target.closest(".kpi[data-goto]");
      if (k) { e.preventDefault(); k.click(); }
    });

    // l'alone che segue il mouse: la firma dinamica del core (--mx/--my).
    // Non si monta se l'utente ha chiesto meno movimento, e nemmeno dove il
    // puntatore non è fine (sul telefono non esiste il passaggio del mouse).
    var sel = o.alone || ".item,.kpi";
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    var cur = null, px = 50, py = 50, pend = false;
    var apply = function () {
      pend = false;
      if (cur) { cur.style.setProperty("--mx", px + "%"); cur.style.setProperty("--my", py + "%"); }
    };
    window.addEventListener("pointermove", function (e) {
      var t = e.target.closest ? e.target.closest(sel) : null;
      cur = t; if (!t) return;
      var r = t.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width * 100;
      py = (e.clientY - r.top) / r.height * 100;
      if (!pend) { pend = true; requestAnimationFrame(apply); }
    }, { passive: true });
  }

  window.go = go;
  window.toast = toast;
  window.apriModale = apriModale;
  window.chiudiModale = chiudiModale;
  window.chiedi = chiedi;
  window.chiediValore = chiediValore;
  window.dwUiAggancia = dwUiAggancia;
})();
