/* ⛔ SCUDO NELLA CAVA SINTETICA — la sicurezza sul lavoro che vive due anni.
   ══════════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE. Fino al 14/08 la cava sintetica generava per Scudo **30 righe
   in tutto, con dieci collezioni vuote su diciassette**: ispezioni, permessi di
   lavoro, DPI, nomine, mansioni, documenti, azioni correttive, analisi,
   appaltatori e appalti non esistevano. Cioè l'app dove un numero sbagliato
   costa di più era anche quella meno provata — e i due difetti più gravi della
   giornata (il report per l'ARPA, il badge verde su registri vuoti) sono usciti
   lo stesso, con venti righe di dati. È il motivo per cui questo file è nato.

   ⛔ E LE CINQUE LEZIONI GIÀ PAGATE SUL GENERATORE VALGONO QUI, tutte:
   1. i casi difficili si **garantiscono**, non si sorteggiano — una quota
      probabilistica su pochi elementi esce **zero** con certi semi, e allora la
      difesa del prodotto non viene esercitata e **niente lo dice**;
   2. un dato in una forma che il prodotto **non legge** sparisce senza accusare
      nessuno (i 48 fermi di Flotta con la disponibilità al 100%);
   3. le chiavi si prendono dalle **costanti del prodotto** (`MODELLI_ISPEZIONE`,
      `NOMINE_RUOLI`, `TIPI_PERMESSO`, `REQUISITI_FORMAZIONE`, `TIPI_DPI`), mai
      scritte a mano: una chiave inventata non è un caso limite, è un dato che
      non esiste;
   4. gli eventi si **propagano** (l'ispezione con una voce non conforme genera
      l'azione correttiva; l'infortunio genera l'analisi delle cause), se no si
      provano sei elenchi scollegati invece di un'app;
   5. i dati sono **simulati** e non devono mai poter sembrare veri.

   ⚠️ Le SOGLIE e le periodicità di legge non si inventano: si prendono da
   `SCADENZE_PRESET` e dai preset dell'app. Qui si generano eventi, mai limiti. */

import * as S from "../../../scudo/scudo-data.js";

const chiavi = (x) => (Array.isArray(x) ? x.map((v) => v.chiave || v.id || v) : Object.keys(x || {}));

/* Quanti giorni fa, rispetto alla fine della simulazione. Un numero negativo
   guarda avanti: serve per le scadenze non ancora arrivate. */
const scala = (rnd, a, b) => a + Math.round(rnd() * (b - a));

export function generaScudo(ctx) {
  const { rnd, giorni, ana, d, fine, piu, T } = ctx;
  const persone = ana.persone;
  const cantieri = [{ id: "k1", nome: "Cava sintetica", tipo: "cava", stato: "attivo" }];

  /* ── MANSIONI ────────────────────────────────────────────────────────
     ⛔ GARANTITO: una persona **senza nessuna mansione**. È il caso che
     `registriMuti` esiste per dichiarare («N persone in forza non hanno
     nessuna mansione assegnata»), chiuso oggi, e senza di lui non si prova. */
  const REQ = chiavi(S.REQUISITI_FORMAZIONE);
  const DPI = chiavi(S.TIPI_DPI);
  const senzaMansione = persone[persone.length - 1].id;      // l'ultima, sempre
  const mansioni = [
    { id: "n1", nome: "Escavatorista / palista",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "guanti"],
      lavoratoriIds: persone.filter((p, i) => i % 3 === 0 && p.id !== senzaMansione).map((p) => p.id) },
    { id: "n2", nome: "Fochino",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "fochino"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "occhiali", "guanti"],
      lavoratoriIds: persone.filter((p, i) => i % 3 === 1 && p.id !== senzaMansione).map((p) => p.id) },
    { id: "n3", nome: "Addetto impianto",
      requisiti: ["sorv-sanitaria", "form-generale"],
      dpi: ["elmetto", "scarpe", "gilet", "maschera"],
      lavoratoriIds: persone.filter((p, i) => i % 3 === 2 && p.id !== senzaMansione).map((p) => p.id) },
  ];

  /* ── NOMINE ──────────────────────────────────────────────────────────
     ⛔ GARANTITO: un ruolo obbligatorio **scoperto**. `NOMINE_RUOLI` li elenca
     tutti; qui se ne coprono tutti tranne l'ultimo, così la funzione che cerca
     i ruoli senza titolare ha sempre qualcosa da dire. E una nomina **chiusa**
     (`al` valorizzato) accanto a una aperta: sono due stati diversi. */
  const RUOLI = chiavi(S.NOMINE_RUOLI);
  const ruoliCoperti = RUOLI.slice(0, Math.max(1, RUOLI.length - 1));
  const nomine = ruoliCoperti.map((ruolo, i) => ({
    id: `o${i + 1}`, ruolo, lavoratoreId: persone[i % persone.length].id,
    dal: piu(fine, -600 + i * 10),
    al: i === 1 ? piu(fine, -30) : null,                     // garantito: una chiusa
    note: "",
  }));

  /* ── DPI ─────────────────────────────────────────────────────────────
     ⛔ GARANTITI: uno **scaduto**, uno **senza addestramento** dove
     l'addestramento serve, e uno **senza data di consegna**. */
  const dpi = [];
  persone.forEach((p, i) => {
    DPI.slice(0, 4).forEach((tipo, j) => {
      const k = i * 4 + j;
      dpi.push({
        id: `dp${k + 1}`, lavoratoreId: p.id, tipo,
        modello: `Modello ${tipo}`, taglia: ["S", "M", "L"][k % 3],
        dataConsegna: k % 17 === 0 ? "" : piu(fine, scala(rnd, -700, -30)),
        scadenza: k % 5 === 0 ? piu(fine, scala(rnd, -200, -1))   // garantito: scaduti
          : piu(fine, scala(rnd, 10, 500)),
        addestramento: k % 7 !== 0,
        dataAddestramento: k % 7 !== 0 ? piu(fine, scala(rnd, -600, -60)) : "",
        note: "",
      });
    });
  });

  /* ── ISPEZIONI ───────────────────────────────────────────────────────
     Una per modello, ripetuta nel tempo secondo la sua periodicità.
     ⛔ GARANTITE: una **aperta** (senza `dataChiusura`), una con una voce **non
     conforme** (che deve generare l'azione correttiva collegata), e una
     **scaduta** rispetto alla sua periodicità. */
  const MODELLI = chiavi(S.MODELLI_ISPEZIONE);
  const ispezioni = [], azioni = [];
  let nI = 0;
  for (const g of giorni) {
    for (const [im, modello] of MODELLI.entries()) {
      const ogni = 30 + im * 15;
      if (nI && (giorni.indexOf(g) % ogni !== im)) continue;
      if (giorni.indexOf(g) % ogni !== im) continue;
      nI++;
      const voci = Array.from({ length: 4 }, (_, v) => ({ id: `v${v + 1}`, testo: `Voce di controllo ${v + 1}` }));
      /* una ogni sei ha una voce NON CONFORME: da lì nasce l'azione */
      const nonConforme = nI % 6 === 0;
      const aperta = nI % 11 === 0;                            // garantito: una aperta
      const esiti = {};
      voci.forEach((v, vi) => {
        esiti[v.id] = { esito: nonConforme && vi === 1 ? "non-conforme" : "conforme", nota: "" };
      });
      ispezioni.push({
        id: `q${nI}`, modello, nome: `Controllo ${modello}`, ambito: modello,
        riferimento: "Riferimento simulato", periodicitaGiorni: ogni,
        data: g.iso, cantiereId: "k1",
        responsabileId: persone[nI % persone.length].id,
        voci, esiti: aperta ? {} : esiti,
        stato: aperta ? "aperta" : "chiusa",
        dataChiusura: aperta ? null : g.iso,
      });
      if (nonConforme && !aperta) {
        azioni.push({
          id: `a${azioni.length + 1}`,
          descrizione: `Rimedio alla voce non conforme del controllo ${modello}`,
          responsabileId: persone[nI % persone.length].id,
          scadenza: piu(g.iso, 30),
          /* ⛔ GARANTITE tutte e tre le condizioni: aperta e in tempo, aperta e
             SCADUTA (è quella che il Quadro deve gridare), chiusa. */
          stato: azioni.length % 3 === 0 ? "chiusa" : "in-corso",
          origineTipo: "ispezione", origineId: `q${nI}`,
        });
      }
    }
  }

  /* ── PERMESSI DI LAVORO ──────────────────────────────────────────────
     ⛔ GARANTITI: uno **ancora aperto** (mai chiuso: è il caso che non deve
     passare inosservato a fine turno) e uno **scaduto e non chiuso**. */
  const TIPI_P = chiavi(S.TIPI_PERMESSO);
  const MISURE = chiavi(S.MISURE_PERMESSO);
  const permessi = [];
  d.volate.forEach((v, i) => {
    const tipo = TIPI_P[i % TIPI_P.length];
    const aperto = i === d.volate.length - 1 || i === 0;      // garantiti due
    permessi.push({
      id: `pw${i + 1}`, tipo, lavoro: `Lavoro in ${tipo}`, luogo: "Impianto",
      cantiereId: "k1", dal: `${v.giorno}T07:30`, al: `${v.giorno}T13:00`,
      rilasciatoDaId: persone[0].id, riceventeId: persone[1 % persone.length].id,
      sorveglianteId: persone[2 % persone.length].id, appaltoId: null,
      misure: MISURE.slice(0, 4),
      atmosfera: tipo === "confinato" ? { ossigeno: "20,8", lel: "0", h2s: "0", co: "2", ora: "07:20" } : null,
      stato: aperto ? "aperto" : "chiuso",
      chiusuraOra: aperto ? null : "13:05",
      chiusuraDaId: aperto ? null : persone[0].id,
      note: "",
    });
  });

  /* ── SCADENZE HSE ────────────────────────────────────────────────────
     ⛔ GARANTITI: una persona **senza nessuna scadenza** (la difesa «non è a
     posto, è una persona di cui non si sa niente»), una scadenza **senza data**
     (che è uno stato, non un errore) e almeno una **scaduta**. */
  const scadenze = [];
  const senzaScadenze = persone[0].id;                        // sempre la prima
  persone.forEach((p, i) => {
    if (p.id === senzaScadenze) return;
    ["Visita medica", "Formazione generale", "Patentino attrezzature"].forEach((tipo, j) => {
      const k = i * 3 + j;
      scadenze.push({
        id: `s${scadenze.length + 1}`, lavoratoreId: p.id, tipo,
        descrizione: tipo,
        dataScadenza: k % 13 === 0 ? "" :                     // garantito: senza data
          piu(fine, k % 4 === 0 ? scala(rnd, -300, -1) : scala(rnd, 5, 400)),
      });
    });
  });
  /* le verifiche periodiche delle attrezzature (all. VII): il registro che
     `registriMuti` dichiara quando è vuoto */
  const TIPO_VER = S.TIPO_VERIFICA_PERIODICA;
  for (let i = 0; i < 3; i++) {
    scadenze.push({
      id: `s${scadenze.length + 1}`, lavoratoreId: null,
      tipo: TIPO_VER, descrizione: `Verifica periodica attrezzatura ${i + 1}`,
      dataScadenza: piu(fine, i === 0 ? -40 : scala(rnd, 20, 300)),
    });
  }

  /* ── ANALISI DELLE CAUSE ─────────────────────────────────────────────
     Ogni infortunio VERO deve avere la sua analisi; ⛔ GARANTITO che uno resti
     **senza analisi**, perché è la riga che il Quadro deve far vedere. */
  const CAUSE = chiavi(S.CAUSE_ANALISI);
  /* ⛔ E QUI IL SOLITO ERRORE, la sesta volta: «uno resta senza analisi» era
     `veri.slice(1)`, ma gli infortuni VERI possono essere **uno solo** — e
     allora `analisi` restava VUOTA, cioè il caso che volevo garantire ne
     cancellava un altro. Un caso garantito che azzera una collezione non è una
     garanzia: è un buco spostato.
     L'analisi delle cause si fa anche sui near-miss (è il senso del registro:
     un mancato infortunio analizzato è quello che evita il prossimo), quindi il
     denominatore è tutto il registro; **uno solo** resta senza, sempre. */
  const daAnalizzare = d.infortuni.filter((x, i) => i > 0);
  const veri = d.infortuni.filter((x) => x.tipo === "infortunio");
  const analisi = daAnalizzare.map((x, i) => ({
    id: `an${i + 1}`, eventoId: `i${d.infortuni.indexOf(x) + 1}`,
    perche: ["Perché 1", "Perché 2", "Perché 3"],
    causa: CAUSE[i % CAUSE.length], fatta: true,
    daChi: persone[i % persone.length].id, azioniId: [],
  }));

  /* ── APPALTATORI E APPALTI ───────────────────────────────────────────
     ⛔ GARANTITO: un appalto **senza coordinamento sottoscritto**. */
  const NATURE = chiavi(S.NATURE_APPALTO);
  const appaltatori = [
    { id: "ap1", ragioneSociale: "Manutenzioni Simulate Srl", partitaIva: "00000000010",
      attivita: "Manutenzione impianti", referente: "—", telefono: "—", attivo: true },
    { id: "ap2", ragioneSociale: "Trasporti Finti Snc", partitaIva: "00000000011",
      attivita: "Trasporto inerti", referente: "—", telefono: "—", attivo: true },
  ];
  const appalti = appaltatori.map((a, i) => ({
    id: `al${i + 1}`, appaltatoreId: a.id, cantiereId: "k1",
    oggetto: a.attivita, dataInizio: piu(fine, -200 + i * 40),
    uominiGiorno: 20 + i * 15, natura: NATURE[i % NATURE.length],
    rischiValutati: true, rischiParticolari: [],
    coordRedattore: persone[0].id, coordData: piu(fine, -190 + i * 40),
    coordSottoscritto: i === 0,                               // garantito: uno NO
    costiSicurezza: 1500 + i * 800, stato: "attivo",
  }));

  const TIPI_DOC = chiavi(S.TIPI_DOCUMENTO);
  const documenti = TIPI_DOC.slice(0, 6).map((tipo, i) => ({
    id: `dc${i + 1}`, titolo: `Documento ${tipo}`, meta: "simulato",
    tipo, stato: i === 2 ? "da-rivedere" : "vigente",
  }));

  return {
    lavoratori: persone,
    operatoriCampo: ana.operatori,
    squadreCampo: ana.squadre,
    scadenze, documenti, cantieri, appaltatori, appalti,
    infortuni: ctx.infortuni,
    oreAnno: [
      { id: "oa1", anno: +fine.slice(0, 4), ore: T.persone * 1700 },
      { id: "oa2", anno: +fine.slice(0, 4) - 1, ore: T.persone * 1700 },
    ],
    azioni, analisi, ispezioni, permessi, mansioni, nomine, dpi,
    /* il censimento dei casi garantiti da QUESTO modulo: chi lo usa deve poter
       leggere che cosa è stato davvero prodotto, se no un caso mancante tace */
    _casi: {
      personeSenzaMansione: 1,
      personeSenzaScadenze: 1,
      ruoliScoperti: chiavi(S.NOMINE_RUOLI).length - ruoliCoperti.length,
      nomineChiuse: nomine.filter((n) => n.al).length,
      dpiScaduti: dpi.filter((x) => x.scadenza && x.scadenza < fine).length,
      dpiSenzaConsegna: dpi.filter((x) => !x.dataConsegna).length,
      dpiSenzaAddestramento: dpi.filter((x) => !x.addestramento).length,
      ispezioniAperte: ispezioni.filter((x) => x.stato === "aperta").length,
      azioniScadute: azioni.filter((a) => a.stato !== "chiusa" && a.scadenza < fine).length,
      permessiAperti: permessi.filter((p) => p.stato === "aperto").length,
      scadenzeSenzaData: scadenze.filter((s) => !s.dataScadenza).length,
      eventiSenzaAnalisi:    Math.max(0, d.infortuni.length - analisi.length),
      analisiFatte:          analisi.length,
      infortuniVeriInScudo:  veri.length,
      appaltiSenzaCoordinamento: appalti.filter((a) => !a.coordSottoscritto).length,
    },
  };
}
