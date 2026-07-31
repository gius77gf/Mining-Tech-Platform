// ============================================================
// Terra — accesso dati (C6). Stesso schema di scudo-data.js:
// Firestore via SDK Deepwork ID (orgCollection) da autenticati,
// demo in memoria altrimenti (tour/mockup).
// Collezioni (sotto organizations/{org}/apps/terra/):
//   fronti/{id}:  { nome, banco, quota, dettaglio,
//                   avanzamento (0-100), stato: attivo|sospeso }
//   rilievi/{id}: { titolo, data (ISO yyyy-mm-dd), tipo,
//                   volumeM3|null, stato: elaborato|pianificato,
//                   provenienza: scavo|cumulo (assente = scavo),
//                   rilevatore?: chi ha eseguito il rilievo (per il verbale) }
//   piano/{id}:   { titolo, dettaglio, stato: vigente|in-esame,
//                   pianificatoAnnuoM3?, riserveM3? }
//   autorizzazioni/{id}: { numeroAtto, ente, dataRilascio (ISO),
//                   dataScadenza (ISO), superficieMq, volumeAutorizzatoM3,
//                   estrattoPregressoM3, materiale, prescrizioni,
//                   riferimenti, stato: vigente|archiviata,
//                   sogliaGuardiaPct, preavvisoGiorni, anniRitmo }
//   scadenze/{id}: { tipo, descrizione, dataScadenza (ISO),
//                   preavvisoGiorni, ricorrenzaMesi|null, note }
// I KPI non si salvano mai: si CALCOLANO dai rilievi
// (volumi mese = somma dei volumi elaborati del mese,
//  avanzamento piano = estratto anno / pianificato anno).
// Anche lo STATO di una scadenza non si salva: si calcola dalla data e
// dal preavviso scelto dall'utente (stesso principio di Scudo).
// NIENTE regole di legge scritte nel codice: le cave sono materia
// REGIONALE, quindi soglie, preavvisi e periodicità li imposta l'utente.
// ============================================================

import { parseCsvLine, numIt, isIntestazione, giorniTra, isoLocale,
         AVVISO_DECIMALE as AVVISO_DECIMALE_SHELL } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  fronti: [
    { id: "f1", nome: "Fronte Nord", banco: "banco 2", quota: 340, dettaglio: "Prossima volata 12:30", avanzamento: 72, stato: "attivo" },
    { id: "f2", nome: "Fronte Est", banco: "banco 1", quota: 355, dettaglio: "Perforazione in corso · 14/22 fori", avanzamento: 41, stato: "attivo" },
    { id: "f3", nome: "Fronte Sud", banco: "banco 3", quota: 320, dettaglio: "Verifica stabilità scarpata", avanzamento: 18, stato: "sospeso" },
  ],
  rilievi: [
    { id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2", fronteId: "f1" },
    { id: "r2", titolo: "Rilievo drone 01/07", data: "2026-07-01", tipo: "Ortofoto + DEM", volumeM3: 18600, stato: "elaborato", fronteId: "f2" },
    { id: "r3", titolo: "Rilievo drone 16/06", data: "2026-06-16", tipo: "Ortofoto + DEM", volumeM3: 21300, stato: "elaborato", fronteId: "f1" },
    { id: "r4", titolo: "Rilievo drone 15/05", data: "2026-05-15", tipo: "Ortofoto + DEM", volumeM3: 20100, stato: "elaborato", fronteId: "f2" },
    { id: "r5", titolo: "Prossimo rilievo", data: "2026-08-01", tipo: "Drone pianificato", volumeM3: null, stato: "pianificato" },
    // ripresa di un cumulo sul piazzale: materiale GIÀ estratto. Sta qui per
    // mostrare la differenza — non entra nei volumi estratti né consuma il
    // volume concesso.
    { id: "r6", titolo: "Ripresa da cumulo 25/06", data: "2026-06-25", tipo: "Ortofoto + DEM", volumeM3: 5200, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: null, provenienza: "cumulo" },
    // rilievo dell'anno prima: serve al contatore vita cava per avere uno
    // storico abbastanza lungo da stimare il ritmo medio annuo
    { id: "r0", titolo: "Rilievo drone 20/11", data: "2025-11-20", tipo: "Ortofoto + DEM", volumeM3: 22000, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: "f1" },
  ],
  piano: [
    { id: "p1", titolo: "Autorizzazione vigente", dettaglio: "Scadenza 2029", stato: "vigente", pianificatoAnnuoM3: 125000, riserveM3: 1200000 },
    { id: "p2", titolo: "Variante fronte Sud", dettaglio: "Da valutare dopo verifica stabilità", stato: "in-esame" },
  ],
  autorizzazioni: [
    { id: "a1", numeroAtto: "Atto n. 128 del 2021 (esempio)", ente: "Ente competente di esempio",
      dataRilascio: "2021-03-15", dataScadenza: "2031-03-14", superficieMq: 78000,
      volumeAutorizzatoM3: 1200000, estrattoPregressoM3: 340000, materiale: "Sabbia e ghiaia",
      prescrizioni: "Recupero ambientale contestuale alla coltivazione, lotto per lotto.\nRilievo dei lavori da tenere aggiornato e trasmettere all'ente.",
      riferimenti: "Protocollo di esempio · progetto di coltivazione allegato all'atto",
      stato: "vigente", sogliaGuardiaPct: 80, preavvisoGiorni: 90, anniRitmo: 3 },
  ],
  // I RAPPORTINI DI TURNO che in esercizio arrivano da Campo (ponte P2, sola
  // lettura). Qui sono finti, ma coerenti coi rilievi qui sopra: nel periodo
  // fra gli ultimi due rilievi di scavo (02–15/07) i turni dichiarano 35.960 t
  // che, alla densità della sabbia e ghiaia in banco (1,9 t/m³), fanno 18.926
  // m³ contro i 19.400 misurati dal volo del 15/07 — uno scostamento del 2,4%,
  // cioè quello che si vede quando i due numeri si parlano.
  // Gli ultimi tre stanno DOPO il rilievo: sono il buco che la stima corrente
  // riempie. E uno è in VIAGGI di proposito, per far vedere che non si
  // convertono: servirebbe la portata del mezzo, che Terra non ha.
  rapportiniCampo: [
    // gli intervalli PRECEDENTI, così il grafico ha una storia da raccontare: lo
    // scarto fra dichiarato e misurato passa dal 12% al 7% al 2,4%, cioè le stime
    // di turno stanno migliorando. È la domanda per cui il grafico esiste, e con
    // un intervallo solo non avrebbe risposta.
    { id: "b1",  data: "2026-05-20", turno: "Mattina",    squadra: "Squadra B", prodQta: 5940, prodUnita: "t", stato: "inviato" },
    { id: "b2",  data: "2026-05-27", turno: "Mattina",    squadra: "Squadra B", prodQta: 5920, prodUnita: "t", stato: "inviato" },
    { id: "b3",  data: "2026-06-03", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 5940, prodUnita: "t", stato: "inviato" },
    { id: "b4",  data: "2026-06-08", turno: "Mattina",    squadra: "Squadra B", prodQta: 5930, prodUnita: "t", stato: "inviato" },
    { id: "b5",  data: "2026-06-12", turno: "Mattina",    squadra: "Squadra B", prodQta: 5940, prodUnita: "t", stato: "inviato" },
    { id: "b6",  data: "2026-06-16", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 5944, prodUnita: "t", stato: "inviato" },
    { id: "g1",  data: "2026-06-19", turno: "Mattina",    squadra: "Squadra B", prodQta: 6570, prodUnita: "t", stato: "inviato" },
    { id: "g2",  data: "2026-06-23", turno: "Mattina",    squadra: "Squadra B", prodQta: 6580, prodUnita: "t", stato: "inviato" },
    { id: "g3",  data: "2026-06-26", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 6570, prodUnita: "t", stato: "inviato" },
    { id: "g4",  data: "2026-06-30", turno: "Mattina",    squadra: "Squadra B", prodQta: 6570, prodUnita: "t", stato: "inviato" },
    { id: "g5",  data: "2026-07-01", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 6576, prodUnita: "t", stato: "inviato" },
    { id: "c1",  data: "2026-07-02", turno: "Mattina",   squadra: "Squadra B", prodQta: 3050, prodUnita: "t", stato: "inviato" },
    { id: "c2",  data: "2026-07-03", turno: "Mattina",   squadra: "Squadra B", prodQta: 2880, prodUnita: "t", stato: "inviato" },
    { id: "c3",  data: "2026-07-04", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 3210, prodUnita: "t", stato: "inviato" },
    { id: "c4",  data: "2026-07-06", turno: "Mattina",   squadra: "Squadra B", prodQta: 2740, prodUnita: "t", stato: "inviato" },
    { id: "c5",  data: "2026-07-07", turno: "Mattina",   squadra: "Squadra B", prodQta: 3120, prodUnita: "t", stato: "inviato" },
    { id: "c6",  data: "2026-07-08", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 2960, prodUnita: "t", stato: "inviato" },
    { id: "c7",  data: "2026-07-09", turno: "Mattina",   squadra: "Squadra B", prodQta: 3300, prodUnita: "t", stato: "inviato" },
    { id: "c8",  data: "2026-07-10", turno: "Mattina",   squadra: "Squadra B", prodQta: 2810, prodUnita: "t", stato: "inviato" },
    { id: "c9",  data: "2026-07-13", turno: "Mattina",   squadra: "Squadra B", prodQta: 3040, prodUnita: "t", stato: "inviato" },
    { id: "c10", data: "2026-07-14", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 3180, prodUnita: "t", stato: "inviato" },
    { id: "c11", data: "2026-07-15", turno: "Mattina",   squadra: "Squadra B", prodQta: 2650, prodUnita: "t", stato: "inviato" },
    { id: "c12", data: "2026-07-15", turno: "Pomeriggio", squadra: "Squadra B", prodQta: 3020, prodUnita: "t", stato: "inviato" },
    { id: "c13", data: "2026-07-17", turno: "Mattina",   squadra: "Squadra B", prodQta: 2900, prodUnita: "t", stato: "inviato", fronteId: "f1" },
    { id: "c14", data: "2026-07-20", turno: "Mattina",   squadra: "Squadra B", prodQta: 3110, prodUnita: "t", stato: "inviato", fronteId: "f2" },
    // c15 resta di proposito SENZA fronte, e per giunta in viaggi: fa vedere
    // due rifiuti in una volta sola — i viaggi che non diventano metri cubi, e
    // la produzione che non si sa da dove viene e non va spalmata
    { id: "c15", data: "2026-07-22", turno: "Notte",     squadra: "Squadra B", prodQta: 18,   prodUnita: "viaggi", stato: "inviato" },
    { id: "c16", data: "2026-07-24", turno: "Mattina",   squadra: "Squadra B", prodQta: 1450, prodUnita: "t", stato: "inviato" },
  ],
  scadenze: [
    { id: "t1", tipo: "autorizzazione", descrizione: "Scadenza del titolo autorizzativo", dataScadenza: "2031-03-14", preavvisoGiorni: 180, ricorrenzaMesi: null, note: "" },
    { id: "t2", tipo: "fideiussione", descrizione: "Polizza fideiussoria — rinnovo annuale", dataScadenza: "2026-09-30", preavvisoGiorni: 90, ricorrenzaMesi: 12, note: "Si svincola solo dopo il collaudo finale." },
    { id: "t3", tipo: "rilievo", descrizione: "Rilievo periodico dei lavori", dataScadenza: "2026-08-10", preavvisoGiorni: 30, ricorrenzaMesi: 6, note: "" },
    { id: "t4", tipo: "screening-via", descrizione: "Prescrizione dello screening da ottemperare", dataScadenza: "2026-07-10", preavvisoGiorni: 60, ricorrenzaMesi: null, note: "" },
  ],
};

// ============================================================
// PROVENIENZA DEL VOLUME — scavo o cumulo
// Un rilievo può misurare due cose molto diverse:
//   · SCAVO  = materiale tolto dal fronte. È nuovo scavo e CONSUMA il
//     volume concesso dall'autorizzazione.
//   · CUMULO = materiale GIÀ estratto, ripreso da un mucchio sul piazzale.
//     È movimentazione, non nuovo scavo: NON consuma il concesso.
// Sommarli sarebbe un errore concettuale, e per giunta pericoloso: farebbe
// credere di aver consumato più concessione di quella vera, con il rischio
// di fermare la cava per un limite che non è stato davvero raggiunto.
// COMPATIBILITÀ: i rilievi salvati prima che questo campo esistesse non
// hanno `provenienza`. Valgono SCAVO, cioè si comportano esattamente come
// prima: nessun numero già mostrato cambia e non si perde nulla.
// ============================================================
// La regola vive in `shared/dw-ponti.js` (`provenienzaDi`), perché la stessa
// serve a Terra, al ponte P2 e a Conti nel confronto cavato-contro-venduto: tre
// posti, una regola. Qui resta il nome con cui Terra l'ha sempre chiamata.
export { provenienzaDi as provenienzaRilievo } from "../../shared/dw-ponti.js";
import { provenienzaDi } from "../../shared/dw-ponti.js";
export function soloScavo(rilievi)  { return (rilievi || []).filter(r => provenienzaDi(r) === "scavo"); }
export function soloCumulo(rilievi) { return (rilievi || []).filter(r => provenienzaDi(r) === "cumulo"); }

export const PROVENIENZE = [
  { chiave: "scavo",  etichetta: "Scavo dal fronte",
    nota: "Materiale nuovo tolto dalla cava: consuma il volume concesso." },
  { chiave: "cumulo", etichetta: "Ripresa da un cumulo",
    nota: "Materiale già estratto in passato e ripreso da un mucchio: si conta a parte, non consuma il volume concesso." },
];
export function etichettaProvenienza(chiave) {
  const p = PROVENIENZE.find(x => x.chiave === provenienzaDi({ provenienza: chiave }));
  return p ? p.etichetta : "Scavo dal fronte";
}

// ══════════════════════════════════════════════════════════════════════
// NUMERI SCRITTI A MANO — la virgola decimale, che in Italia è la norma
// ------------------------------------------------------------------
// Chi compila Terra è un direttore di cava italiano: scrive «1,6» e
// «148,50», non «1.6». Fino a ieri i campi decimali erano
// <input type="number">, e quel tipo di campo NON è neutro rispetto alla
// virgola: la specifica HTML gli impone come valore un «valid
// floating-point number», cioè col PUNTO, e il browser sanitizza il resto.
// Misurato in Chromium (identico in locale en-US e it-IT, quindi `lang="it"`
// non c'entra niente):
//   digitato «2,4»   → .value diventa «24»    e checkValidity() dice TRUE
//   digitato «4.200» → letto come 4,2 metri cubi invece di 4.200
// Il primo caso su `#val-densita` moltiplica per dieci le tonnellate e il
// valore del materiale; il secondo su `#new-ril-vol` cancella millesettecento
// metri cubi di scavo dal contatore che dice quanto concessione resta. Sono i
// due numeri da cui Terra risponde alla domanda «quanto posso ancora cavare».
// Da qui in poi i campi decimali sono <input type="text" inputmode="decimal">
// (sul telefono la tastiera resta numerica) e il numero lo legge questa
// funzione. Il prezzo da pagare è che min/max/step del browser non valgono
// più: la validazione è nostra, ed è qui.
//
// IL PUNTO AMBIGUO. «4.200» in Italia è quattromiladuecento; per la specifica
// HTML (e per `numIt`, che di un solo punto non può sapere niente) è
// quattro-virgola-due. Le due letture distano MILLE volte: su un volume è la
// differenza fra un mese di scavo e una carriola. Quando entrambe stanno nei
// limiti del campo la funzione NON scegli: ritorna `motivo: "ambiguo"` con le
// due letture, e chi chiama chiede all'utente. Quando invece una sola delle
// due sta nei limiti, l'altra è impossibile per quel campo e non c'è niente da
// indovinare (una densità di 1600 t/m³ non esiste, «1.600» è 1,6). Un
// separatore delle migliaia scritto per intero («1.234.567») non è ambiguo.
//
// Ritorna { vuoto, ok, valore, grezzo, letture, motivo }; il messaggio lo
// scrive chi chiama, perché il messaggio giusto dipende dal campo.
// Pura e testabile: nessun DOM.
// ══════════════════════════════════════════════════════════════════════
// ⛔ RI-ESPORTATA, non ridichiarata: era scritta alla lettera in quattro
// moduli dati. Un alias non è una seconda implementazione.
// Vedi docs/NUMERI_MESSAGGIO_DOPPIO_202608.md
export const AVVISO_DECIMALE = AVVISO_DECIMALE_SHELL;

// un solo punto, esattamente tre cifre dopo, nessuna virgola: le due letture
// (migliaia / decimale) sono entrambe legittime e distano mille volte
const PUNTO_AMBIGUO = /^[-+]?\d{1,3}\.\d{3}$/;

function fuoriLimite(n, opts) {
  if (opts.positivo && !(n > 0)) return "non-positivo";
  if (opts.min != null && n < +opts.min) return "sotto-minimo";
  if (opts.max != null && n > +opts.max) return "sopra-massimo";
  return "";
}

export function numeroDaCampo(testo, opts = {}) {
  const grezzo = String(testo == null ? "" : testo).trim();
  // spazi di ogni specie (anche quelli che Intl usa come separatore delle
  // migliaia) e le unità che si incollano insieme al numero
  const pulito = grezzo.replace(/[\s\u00a0\u202f\u2009]/g, "").replace(/\u20ac/g, "");
  if (pulito === "") return { vuoto: true, ok: false, valore: null, grezzo, letture: [], motivo: "vuoto" };
  if (!/^[-+]?[\d.,]+$/.test(pulito))
    return { vuoto: false, ok: false, valore: null, grezzo, letture: [], motivo: "non-numero" };
  const dec = opts.decimali == null ? 2 : Math.max(0, Math.min(6, opts.decimali | 0));
  const p = Math.pow(10, dec);
  const arr = (n) => Math.round(n * p) / p;
  const letture = (PUNTO_AMBIGUO.test(pulito)
    ? [+pulito.replace(".", ""), numIt(pulito)]
    : [numIt(pulito)]).filter(Number.isFinite).map(arr);
  if (!letture.length)
    return { vuoto: false, ok: false, valore: null, grezzo, letture: [], motivo: "non-numero" };
  const cand = letture.map(n => ({ n, fuori: fuoriLimite(n, opts) }));
  const dentro = cand.filter(c => !c.fuori);
  if (letture.length === 2 && dentro.length === 2)
    return { vuoto: false, ok: false, valore: null, grezzo, letture, motivo: "ambiguo" };
  const scelto = dentro.length ? dentro[0] : cand[0];
  return scelto.fuori
    ? { vuoto: false, ok: false, valore: scelto.n, grezzo, letture, motivo: scelto.fuori }
    : { vuoto: false, ok: true, valore: scelto.n, grezzo, letture, motivo: "" };
}

// formattazione compatta dei volumi (38k, 1.2M) per i KPI. Sotto i mille il
// numero si scrive per intero, e all'ITALIANA: `String(500.5)` dava «500.5»,
// col punto inglese, su una tessera del quadro — e da quando i volumi possono
// avere decimali quel caso capita davvero.
export function fmtM3(v) {
  if (v == null) return "—";
  // il decimale dei milioni va scritto con la VIRGOLA: la tessera delle riserve
  // diceva «1.2M m³», col punto inglese, accanto a numeri all'italiana
  if (v >= 1e6) return (Math.round(v / 1e5) / 10).toLocaleString("it-IT", { useGrouping: true }) + "M";
  if (v >= 1e3) return Math.round(v / 1e3) + "k";
  return (+v).toLocaleString("it-IT", { maximumFractionDigits: 2, useGrouping: true });
}

// Volume estratto da un fronte = somma dei m³ dei rilievi ELABORATI di
// quel fronte (i pianificati e i volumi assenti non contano). È il "m³
// ⛔ «QUESTO RILIEVO SI PUÒ USARE» — la condizione, scritta UNA VOLTA.
// Era scritta DIECI volte in questo file, in tre varianti (liscia, con la data
// vera, con l'anno), ed è il modo in cui una variante si stacca dalle altre
// senza che nessuno lo veda: un rilievo in bozza o senza volume che comincia a
// contare in UNO dei dieci punti non dà nessun errore — dà un numero diverso.
// Non va in `shared/` perché non serve a due app: serve dieci volte a una.
//  · `rilievoUsabile`      — elaborato e con un volume. È il minimo per contare;
//  · `rilievoUsabileConData` — in più una data ISO vera, per chi ORDINA o
//    confronta nel tempo: senza data non si sa dove sta nella serie.
export function rilievoUsabile(r) {
  return !!r && r.stato === "elaborato" && r.volumeM3 != null;
}
export function rilievoUsabileConData(r) {
  return rilievoUsabile(r) && /^\d{4}-\d{2}-\d{2}$/.test(String((r && r.data) || ""));
}

// estratti" mostrato per fronte. Di serie conta solo lo SCAVO: un cumulo
// ripreso sul piazzale non è materiale uscito dal fronte. Con
// `prov = "cumulo"` si ottiene la parte ripresa dai cumuli, con
// `prov = "tutti"` la somma grezza. Funzione pura e testabile.
export function volumeFronte(rilievi, fronteId, prov = "scavo") {
  return (rilievi || [])
    .filter(r => r.fronteId === fronteId && rilievoUsabile(r))
    .filter(r => prov === "tutti" || provenienzaDi(r) === prov)
    .reduce((s, r) => s + r.volumeM3, 0);
}

// Da volume estratto (m³ in banco) a tonnellate e valore economico:
// tonnellate = m³ × densità (t/m³); valore = tonnellate × prezzo (€/t).
// È l'anello che lega il rilievo alla contabilità. Densità e prezzo
// dipendono dal materiale (l'utente li imposta). Numeri non validi → 0.
export function valoreMateriale(volumeM3, densita, prezzoTon) {
  const v = Math.max(0, +volumeM3 || 0), d = Math.max(0, +densita || 0), p = Math.max(0, +prezzoTon || 0);
  const tonnellate = v * d;
  return { tonnellate, valore: tonnellate * p };
}
// Le densità di riferimento vivono in `shared/dw-ponti.js`: le usa Terra per il
// valore del materiale, e le usa il ponte P2 anche da CAMPO, che deve poter
// portare in metri cubi le tonnellate dichiarate dai turni senza chiedere a chi
// compila un numero che nell'autorizzazione c'è già.
export { DENSITA_PRESET, presetDensita, densitaDelMateriale } from "../../shared/dw-ponti.js";

// Qualità del dato di un rilievo: mette insieme metodo (RTK/PPK, GCP…) e
// GSD in una stringa breve, così il volume è "difendibile" in audit senza
// doverlo ricalcolare. Stringa vuota se non si sa nulla. Pura e testabile.
export function qualitaRilievo(r) {
  const parti = [];
  if (r && r.metodo) parti.push(r.metodo);
  // il GSD si scrive all'italiana: «GSD 2,5 cm». Incollato grezzo dava «2.5»
  // col punto inglese accanto a volumi scritti con la virgola, e i rilievi
  // importati da CSV arrivano col punto per forza (nei dati il punto è la regola).
  if (r && r.gsd != null && String(r.gsd).trim() !== "") parti.push("GSD " + String(r.gsd).trim().replace(".", ",") + " cm");
  return parti.join(" · ");
}

// Deplezione delle riserve: dalla riserva stimata, da quanto già estratto
// nell'anno e dal ritmo annuo pianificato, calcola la riserva RESIDUA e la
// durata stimata in anni. È la "personalità" di Terra (nessun competitor la
// racconta in modo semplice). Ritorna null se non c'è una riserva stimata;
// anni null se il ritmo annuo non è noto. Pura e testabile.
export function riservaResidua(riserveM3, estrattoAnno, rateAnnuoM3) {
  if (riserveM3 == null) return null;
  const residuo = Math.max(0, (+riserveM3 || 0) - (+estrattoAnno || 0));
  const rate = +rateAnnuoM3 || 0;
  return { residuo, anni: rate > 0 ? residuo / rate : null };
}

// Proiezione di FINE ANNO: dal volume già estratto nell'anno e dalla frazione
// di anno trascorsa, stima con proiezione lineare il totale che si raggiungerà
// a fine anno e lo confronta col volume annuo AUTORIZZATO/pianificato. Serve a
// capire PER TEMPO se si sta per superare l'autorizzato (rischio legale: non si
// può estrarre più di quanto concesso) o si resterà sotto. Ritorna null se non
// c'è un piano annuo > 0. `proiezione` (e pctPiano) è null se è ancora troppo
// presto nell'anno (meno di ~1 mese) per una stima sensata. stato: "danger" se
// la proiezione supera l'autorizzato, "warn" se ≥90%, "ok" sotto. Pura e
// testabile; `oggi` iniettabile.
export function proiezioneAnnua(rilievi, pianificatoAnnuoM3, oggi = new Date()) {
  const piano = +pianificatoAnnuoM3 || 0;
  if (piano <= 0) return null;
  const o = new Date(oggi);
  const anno = o.getFullYear();
  // solo SCAVO: il piano annuo è un limite di estrazione, la ripresa di un
  // cumulo non lo intacca
  const estrattoAnno = soloScavo(rilievi)
    .filter(r => rilievoUsabile(r) && String(r.data || "").slice(0, 4) === String(anno))
    .reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  const inizio = new Date(anno, 0, 1), fine = new Date(anno + 1, 0, 1);
  const frazione = (o - inizio) / (fine - inizio);            // 0..1 dell'anno trascorso
  const proiezione = frazione >= (1 / 12) ? Math.round(estrattoAnno / frazione) : null;
  const pctPiano = proiezione != null ? Math.round(100 * proiezione / piano) : null;
  const stato = pctPiano == null ? "ok" : pctPiano > 100 ? "danger" : pctPiano >= 90 ? "warn" : "ok";
  return { estrattoAnno, pianificato: piano, frazione, proiezione, pctPiano, stato };
}

// Classe di accuratezza di un rilievo, da metodo e GSD (vedi
// vault/RICERCA_ACCURATEZZA_RILIEVI.md): "survey-grade" (RTK/PPK o GCP con GSD
// ≤ 2 cm) → volume difendibile, tolleranza tipica ±2%; "indicativo" (senza
// metodo affidabile o GSD grosso) → ±8%; "n.d." se non si sa nulla. Serve a
// dire quanto è affidabile il volume, senza spacciarlo per esatto. Pura e
// testabile. Le %tolleranza sono TIPICHE (da confermare coi checkpoint).
export function classeAccuratezza(rilievo) {
  const m = String((rilievo && rilievo.metodo) || "").toLowerCase();
  const gsdN = parseFloat(String((rilievo && rilievo.gsd) || "").replace(",", "."));
  const gsdNoto = Number.isFinite(gsdN) && gsdN > 0;
  if (!m && !gsdNoto) return { classe: "n.d.", label: "Accuratezza n.d.", tolleranzaPct: null, cls: "" };
  const buonMetodo = /rtk|ppk|gcp/.test(m);
  const gsdOk = gsdNoto ? gsdN <= 2 : true;   // se il GSD è noto dev'essere ≤ 2 cm
  if (buonMetodo && gsdOk) return { classe: "survey-grade", label: "Survey-grade", tolleranzaPct: 2, cls: "ok" };
  return { classe: "indicativo", label: "Indicativo", tolleranzaPct: 8, cls: "warn" };
}

// Banda di incertezza sul volume (m³) data una %tolleranza: rende onesto il
// numero ("19.400 m³ ± 388"). Ritorna {volume, banda, min, max} arrotondati,
// oppure null se volume o tolleranza non sono validi. Pura e testabile.
export function bandaVolume(volumeM3, tolleranzaPct) {
  const v = +volumeM3;
  if (!(v >= 0) || tolleranzaPct == null) return null;   // niente tolleranza = non calcolabile
  const t = +tolleranzaPct;
  if (!(t >= 0)) return null;
  const banda = Math.round(v * t / 100);
  return { volume: v, banda, min: Math.max(0, v - banda), max: v + banda };
}

// Andamento dei volumi: confronta gli ULTIMI DUE rilievi elaborati (per data)
// per dire a colpo d'occhio se l'estrazione sta accelerando o rallentando —
// utile per capire se si è "in pari" col piano. Ritorna null se non ci sono
// almeno due rilievi elaborati con volume. Pura e testabile.
export function trendVolumi(rilievi) {
  const el = soloScavo(rilievi)
    .filter(rilievoUsabile)
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  if (el.length < 2) return null;
  const ultimo = +el[0].volumeM3 || 0, precedente = +el[1].volumeM3 || 0;
  const delta = ultimo - precedente;
  return { ultimo, precedente, delta, pct: precedente > 0 ? Math.round(100 * delta / precedente) : null };
}

// VOLUMI AGGREGATI PER MESE (finestra mobile che finisce col mese corrente).
// I rilievi si fanno una volta al mese o meno: il volume ha senso per MESE,
// mai per giorno. Ritorna un elemento per ogni mese della finestra a partire
// dal PRIMO mese che ha almeno un rilievo elaborato — i mesi vuoti prima di
// quello non si disegnano, perché una cava aperta da poco non ha uno storico
// e fingerlo sarebbe una bugia. I mesi vuoti IN MEZZO restano a zero (con
// `rilievi: 0`): lì il rilievo non c'è stato, e va detto.
// Pura e testabile; `oggi` iniettabile.
export function volumiPerMese(rilievi, mesi = 12, oggi = new Date()) {
  const n = Math.max(1, Math.round(+mesi || 12));
  // solo SCAVO: il grafico del ritmo mensile racconta quanto si sta
  // scavando, non quanto materiale è stato spostato dai cumuli
  const el = soloScavo(rilievi).filter(rilievoUsabileConData);
  const o = new Date(oggi);
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(o.getFullYear(), o.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const dentro = el.filter(r => String(r.data).slice(0, 7) === ym);
    out.push({
      ym, anno: d.getFullYear(), mese: d.getMonth() + 1,
      volume: dentro.reduce((s, r) => s + (+r.volumeM3 || 0), 0),
      rilievi: dentro.length,
    });
  }
  const primo = out.findIndex(m => m.rilievi > 0);
  return primo < 0 ? [] : out.slice(primo);
}

// ============================================================
// CONFRONTO FRA DUE RILIEVI DELLO STESSO FRONTE
// La domanda vera del direttore di cava è «quanto abbiamo cavato da lì fra
// marzo e luglio». In Terra ogni rilievo elaborato porta il volume tolto
// dal fronte DA QUANDO c'era il rilievo prima (è così che funziona la somma
// per fronte, `volumeFronte`): quindi il materiale scavato fra due date è la
// SOMMA dei rilievi successivi al primo fino al secondo compreso, non la
// sottrazione fra i due numeri. Sottrarli darebbe un risultato senza senso
// (verrebbe addirittura negativo se il secondo rilievo copre un periodo più
// tranquillo), ed è l'errore che si vede fare più spesso sui fogli di calcolo.
// La differenza fra i due volumi si mostra lo stesso, ma per quello che è:
// un confronto di RITMO fra due misure, non materiale.
// Tutte funzioni PURE e testabili.
// ============================================================

// I rilievi di SCAVO elaborati di un fronte, dal più recente: sono le voci
// che si possono confrontare. `fronteId` null = i rilievi senza fronte.
export function rilieviScavoFronte(rilievi, fronteId) {
  const f = fronteId || null;
  return soloScavo(rilievi || [])
    .filter(rilievoUsabileConData)
    .filter(r => (r.fronteId || null) === f)
    .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

// Il rilievo di scavo dello stesso fronte immediatamente PRECEDENTE a `r`
// (null se `r` è il primo). Serve al verbale: un volume senza il rilievo di
// partenza non dice da dove è stato misurato.
export function rilievoPrecedente(rilievi, r) {
  if (!r || !/^\d{4}-\d{2}-\d{2}$/.test(String(r.data || ""))) return null;
  const stessi = rilieviScavoFronte(rilievi, r.fronteId)
    .filter(x => x.id !== r.id && String(x.data) < String(r.data));
  return stessi[0] || null;   // già ordinati dal più recente
}

// Confronto fra due rilievi (per id). Ritorna null se non si trovano, se
// sono lo stesso, o se stanno su fronti diversi (confrontarli sarebbe una
// somma di cose diverse). L'ordine lo mette la data: `primo` è il più
// vecchio, qualunque sia l'ordine con cui arrivano.
//  · `scavato`  = materiale tolto FRA le due date (somma dei rilievi dopo il
//                 primo, fino al secondo compreso) — la risposta alla domanda;
//  · `banda`    = incertezza sommata di quei rilievi (scelta prudente);
//  · `giorni`   = giorni fra le due date;
//  · `alGiorno`/`alMese` = ritmo implicito nel periodo;
//  · `delta`/`pct` = differenza fra i due volumi misurati (confronto di
//                 ritmo fra le due misure, NON materiale scavato).
export function confrontoRilievi(rilievi, idPrimo, idSecondo) {
  const el = soloScavo(rilievi || [])
    .filter(rilievoUsabileConData);
  let a = el.find(r => r.id === idPrimo), b = el.find(r => r.id === idSecondo);
  if (!a || !b || a.id === b.id) return null;
  if ((a.fronteId || null) !== (b.fronteId || null)) return null;
  if (String(a.data) > String(b.data)) { const t = a; a = b; b = t; }
  const giorni = Math.round((new Date(b.data + "T00:00:00") - new Date(a.data + "T00:00:00")) / 86400000);
  const dentro = el.filter(r => (r.fronteId || null) === (b.fronteId || null)
    && String(r.data) > String(a.data) && String(r.data) <= String(b.data));
  const scavato = dentro.reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  let banda = 0;
  for (const r of dentro) {
    const ca = classeAccuratezza(r);
    const bv = ca.tolleranzaPct != null ? bandaVolume(r.volumeM3, ca.tolleranzaPct) : null;
    if (bv) banda += bv.banda;
  }
  const va = +a.volumeM3 || 0, vb = +b.volumeM3 || 0;
  const delta = vb - va;
  const alGiorno = giorni > 0 ? scavato / giorni : null;
  return {
    primo: a, secondo: b, giorni, scavato, banda,
    rilieviInMezzo: dentro.length,
    delta, pct: va > 0 ? Math.round(100 * delta / va) : null,
    alGiorno, alMese: alGiorno != null ? alGiorno * 30.44 : null,
    fronteId: b.fronteId || null,
  };
}

// ============================================================
// TITOLO AUTORIZZATIVO — scheda, vita cava, scadenzario
// Tutte funzioni PURE (nessun DOM, `oggi` iniettabile) e senza alcuna
// regola di legge cablata: le attività estrattive sono materia REGIONALE
// (ogni regione ha la sua legge, il suo PRAE e i suoi moduli), quindi
// soglie di guardia, giorni di preavviso e periodicità arrivano SEMPRE
// dai dati inseriti dall'utente. Vedi docs/RICERCA_TERRA_202607.md.
// ============================================================

// L'autorizzazione VIGENTE tra quelle registrate (le altre restano come
// storico/varianti). Se nessuna è marcata vigente, prende la prima.
// Ritorna null se non ce n'è nessuna.
export function autorizzazioneVigente(autorizzazioni) {
  const a = autorizzazioni || [];
  return a.find(x => x.stato === "vigente") || a[0] || null;
}

// Volume estratto COMPLESSIVO sotto un titolo autorizzativo:
//  - `rilevato`: somma dei rilievi elaborati con volume, contati solo dalla
//    data di rilascio in poi (se la data c'è): quello che è stato scavato
//    prima appartiene a un altro titolo. Contano SOLO i rilievi di SCAVO:
//    il materiale ripreso da un cumulo era già stato scavato (e già
//    scalato) prima, contarlo di nuovo consumerebbe due volte la stessa
//    concessione;
//  - `daCumulo`: quanto di quel periodo viene invece dalla ripresa di
//    cumuli. Non entra nel totale, ma va detto — altrimenti sembrerebbe
//    materiale sparito;
//  - `pregresso`: quanto era già stato estratto quando si è iniziato a usare
//    Terra, dichiarato dall'utente nella scheda (senza questo numero il
//    contatore vita cava sarebbe ottimista e quindi pericoloso).
export function estrattoComplessivo(rilievi, autorizzazione) {
  const a = autorizzazione || {};
  const da = /^\d{4}-\d{2}-\d{2}$/.test(String(a.dataRilascio || "")) ? String(a.dataRilascio) : null;
  const dentro = (rilievi || [])
    .filter(rilievoUsabile)
    .filter(r => !da || String(r.data || "") >= da);
  const somma = (arr) => arr.reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  const rilevato = somma(soloScavo(dentro));
  const daCumulo = somma(soloCumulo(dentro));
  const pregresso = Math.max(0, +a.estrattoPregressoM3 || 0);
  return { rilevato, daCumulo, pregresso, totale: rilevato + pregresso, daData: da };
}

// RITMO MEDIO annuo degli ultimi `anni` anni (finestra scelta dall'utente):
// somma dei volumi elaborati nella finestra diviso gli anni effettivamente
// coperti dallo storico. Il periodo parte dal primo rilievo dentro la
// finestra: se lo storico è corto il ritmo risulta un po' alto, quindi la
// durata residua stimata è prudente (meglio sottostimare gli anni che
// restano). Ritorna null se non c'è abbastanza storico (< 3 mesi) o volume.
export function ritmoMedioAnnuo(rilievi, anni, oggi = new Date()) {
  const n = Math.max(0.5, +anni || 0) || 3;
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  const ANNO_MS = 365.25 * 86400000;
  const dal = new Date(o.getTime() - n * ANNO_MS);
  // ⛔ il giorno si legge in ora LOCALE: `toISOString()` su una mezzanotte
  // locale scrive le 22:00 del giorno prima, e l'estremo alto della finestra
  // diventerebbe IERI — il rilievo elaborato oggi resterebbe fuori dal conto
  // che stima quando finisce il volume concesso (misurato il 31/07)
  const dalISO = isoLocale(dal);
  // solo SCAVO: il ritmo serve a stimare quando finisce il volume concesso,
  // e i cumuli ripresi non lo consumano
  const el = soloScavo(rilievi)
    .filter(rilievoUsabileConData)
    .filter(r => String(r.data) >= dalISO && String(r.data) <= isoLocale(o));
  if (!el.length) return null;
  const volume = el.reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  if (!(volume > 0)) return null;
  const primo = el.map(r => String(r.data)).sort()[0];
  const inizio = new Date(primo + "T00:00:00");
  const durataAnni = (o - inizio) / ANNO_MS;
  if (!(durataAnni >= 0.25)) return null;       // meno di 3 mesi: media senza senso
  return { volume, durataAnni, annuo: volume / durataAnni, dal: primo, rilievi: el.length };
}

// CONTATORE VITA CAVA: volume totale autorizzato − estratto complessivo =
// quanto resta, e per quanti anni al ritmo medio. È il rischio VERO per il
// cliente: la proiezione annuale dice se si sfora l'anno, questo dice se si
// sfora il TOTALE concesso, che è la violazione grave.
// La soglia di guardia (`sogliaGuardiaPct`) è quella impostata dall'utente:
// se non c'è, si segnala solo il superamento del 100%. Ritorna null se il
// volume autorizzato non è noto. Pura e testabile.
export function vitaCava(autorizzazione, rilievi, oggi = new Date()) {
  const a = autorizzazione || {};
  const totale = +a.volumeAutorizzatoM3 || 0;
  if (!(totale > 0)) return null;
  const est = estrattoComplessivo(rilievi, a);
  const residuo = Math.max(0, totale - est.totale);
  const pct = Math.round(1000 * est.totale / totale) / 10;      // un decimale
  const sogliaN = +a.sogliaGuardiaPct;
  const soglia = Number.isFinite(sogliaN) && sogliaN > 0 && sogliaN <= 100 ? sogliaN : null;
  const stato = pct >= 100 ? "danger" : (soglia != null && pct >= soglia) ? "warn" : "ok";
  const rm = ritmoMedioAnnuo(rilievi, a.anniRitmo, oggi);
  const annuo = rm ? rm.annuo : 0;
  const anniResidui = annuo > 0 ? residuo / annuo : null;
  let annoEsaurimento = null;
  if (anniResidui != null) {
    const d = new Date(oggi);
    annoEsaurimento = new Date(d.getTime() + anniResidui * 365.25 * 86400000).getFullYear();
  }
  // Confronto con la scadenza del titolo: arriva prima l'esaurimento del
  // volume o la scadenza dell'atto? Cambia completamente cosa si deve fare.
  let scadePrimaIlTitolo = null;
  if (anniResidui != null && /^\d{4}-\d{2}-\d{2}$/.test(String(a.dataScadenza || ""))) {
    const g = giorniTra(String(a.dataScadenza), oggi);
    if (Number.isFinite(g)) scadePrimaIlTitolo = (g / 365.25) < anniResidui;
  }
  return {
    totale, estratto: est.totale, rilevato: est.rilevato, pregresso: est.pregresso,
    daCumulo: est.daCumulo,
    residuo, pct, soglia, stato, ritmoAnnuo: annuo > 0 ? annuo : null,
    ritmo: rm, anniResidui, annoEsaurimento, scadePrimaIlTitolo,
  };
}

// ============================================================
// RIEPILOGO ANNUALE DEI VOLUMI — la vista per la denuncia agli enti
// Diverse regioni chiedono ogni anno quanto è stato estratto (e in molti
// casi la comunicazione va mandata ANCHE se non si è scavato niente).
// I numeri Terra li ha già: qui vengono messi nella forma che serve a chi
// compila il modulo — anno, mese per mese, fronte per fronte, cumulato
// sotto il titolo, confronto col concesso e residuo.
// NESSUNA regola di legge è cablata: scadenze, modelli e periodicità sono
// materia regionale e restano a carico dell'utente.
// Tutte funzioni PURE, `oggi` iniettabile.
// ============================================================

// Anni per cui esiste almeno un rilievo elaborato con volume, dal più
// recente. L'anno in corso c'è sempre: la denuncia si prepara anche
// quando l'anno non è finito, e va inviata anche a volumi zero.
export function anniConVolumi(rilievi, oggi = new Date()) {
  const anni = new Set([String(new Date(oggi).getFullYear())]);
  for (const r of rilievi || []) {
    if (r.stato !== "elaborato" || r.volumeM3 == null) continue;
    const a = String(r.data || "").slice(0, 4);
    if (/^\d{4}$/.test(a)) anni.add(a);
  }
  return [...anni].sort().reverse().map(Number);
}

// Riepilogo di UN anno. Separa sempre lo SCAVO (che consuma il concesso)
// dalla ripresa dei CUMULI (che non lo consuma), perché sono due righe
// diverse anche nei moduli degli enti.
//  - `mesi`: dodici voci, anche quelle a zero (nel modulo il mese vuoto va
//    scritto zero, non saltato);
//  - `fronti`: una voce per fronte incontrato, più `null` per i rilievi
//    senza fronte;
//  - `banda`: incertezza complessiva, sommando quella di ogni rilievo
//    (scelta prudente: sommare tiene la banda più larga di quanto farebbe
//    una combinazione statistica, e in una dichiarazione è meglio così);
//  - `cumulatoFineAnno` / `residuoFineAnno`: dove arriva il titolo alla
//    fine di quell'anno, pregresso compreso.
export function riepilogoAnnuale(rilievi, anno, autorizzazione, oggi = new Date()) {
  const y = String(anno || new Date(oggi).getFullYear());
  const a = autorizzazione || {};
  const elab = (rilievi || []).filter(rilievoUsabileConData);
  const dellAnno = elab.filter(r => String(r.data).slice(0, 4) === y);
  const scavoRil = soloScavo(dellAnno), cumuloRil = soloCumulo(dellAnno);
  const somma = (arr) => arr.reduce((s, r) => s + (+r.volumeM3 || 0), 0);

  const mesi = [];
  for (let m = 1; m <= 12; m++) {
    const ym = y + "-" + String(m).padStart(2, "0");
    const dentro = dellAnno.filter(r => String(r.data).slice(0, 7) === ym);
    const sc = soloScavo(dentro);
    mesi.push({ mese: m, ym, scavo: somma(sc), cumulo: somma(soloCumulo(dentro)), rilievi: dentro.length });
  }

  const perFronte = new Map();
  for (const r of dellAnno) {
    const k = r.fronteId || "";
    if (!perFronte.has(k)) perFronte.set(k, { fronteId: r.fronteId || null, scavo: 0, cumulo: 0, rilievi: 0 });
    const v = perFronte.get(k);
    v[provenienzaDi(r)] += (+r.volumeM3 || 0);
    v.rilievi++;
  }
  const fronti = [...perFronte.values()].sort((x, z) => z.scavo - x.scavo || z.cumulo - x.cumulo);

  // qualità del dato: quanti rilievi reggono il numero e con che accuratezza
  const qualita = { surveyGrade: 0, indicativo: 0, nd: 0 };
  let banda = 0;
  for (const r of scavoRil) {
    const ca = classeAccuratezza(r);
    if (ca.classe === "survey-grade") qualita.surveyGrade++;
    else if (ca.classe === "indicativo") qualita.indicativo++;
    else qualita.nd++;
    const b = ca.tolleranzaPct != null ? bandaVolume(r.volumeM3, ca.tolleranzaPct) : null;
    if (b) banda += b.banda;
  }

  // dove arriva il titolo alla fine di quell'anno
  const da = /^\d{4}-\d{2}-\d{2}$/.test(String(a.dataRilascio || "")) ? String(a.dataRilascio) : null;
  const finoA = y + "-12-31";
  const scavoSotto = somma(soloScavo(elab).filter(r => (!da || String(r.data) >= da) && String(r.data) <= finoA));
  const pregresso = Math.max(0, +a.estrattoPregressoM3 || 0);
  const concesso = +a.volumeAutorizzatoM3 || 0;
  const cumulatoFineAnno = pregresso + scavoSotto;
  const residuoFineAnno = concesso > 0 ? Math.max(0, concesso - cumulatoFineAnno) : null;
  const pctFineAnno = concesso > 0 ? Math.round(1000 * cumulatoFineAnno / concesso) / 10 : null;

  return {
    anno: +y,
    scavo: somma(scavoRil), cumulo: somma(cumuloRil),
    rilieviScavo: scavoRil.length, rilieviCumulo: cumuloRil.length,
    mesi, fronti, qualita, banda,
    concesso: concesso > 0 ? concesso : null, pregresso,
    cumulatoFineAnno, residuoFineAnno, pctFineAnno,
    inCorso: +y === new Date(oggi).getFullYear(),
  };
}

// LA RIPARTIZIONE PER FRONTE, pronta da mostrare. Sta qui e non nella pagina
// perché è una REGOLA, non un disegno, e una regola si prova.
//
// Due cose che l'elenco confondeva, viste renderizzando la sezione:
//  1. una voce SENZA fronte e SENZA scavo non è un fronte mancante — è una
//     ripresa da cumulo, che per definizione non esce da un fronte. In un elenco
//     di fronti prendeva un badge «0 m³» e sembrava una riga rotta. Esce
//     dall'elenco e il suo volume torna a parte, per essere detto a parole.
//     Una voce senza fronte ma CON scavo resta invece, ed è tutt'altro: è una
//     ripartizione che manca e che il modulo dell'ente chiede.
//  2. mancava la QUOTA, l'unico numero che un elenco di valori assoluti non sa
//     dare: 40.700 e 38.700 dicono poco, 51,3% e 48,7% dicono che i due fronti
//     pesano uguale. Nulla su un totale zero: non è 0%, è una domanda senza senso.
export function ripartizioneFronti(riepilogo) {
  const fronti = riepilogo && Array.isArray(riepilogo.fronti) ? riepilogo.fronti : [];
  const totale = riepilogo && +riepilogo.scavo > 0 ? +riepilogo.scavo : 0;
  const righe = fronti
    .filter(f => f.fronteId || +f.scavo > 0)
    .map(f => ({ ...f,
      senzaFronte: !f.fronteId,
      quotaPct: totale > 0 && +f.scavo > 0 ? Math.round(1000 * f.scavo / totale) / 10 : null }));
  return {
    righe,
    // i cumuli che restano FUORI dalla ripartizione, da dire nella nota
    cumuliFuori: fronti.filter(f => !f.fronteId && !(+f.scavo > 0))
      .reduce((a, f) => a + (+f.cumulo || 0), 0),
    // c'è almeno una riga con dei cumuli? Serve alla nota: rimandare a «quanto
    // scritto nella riga» quando nessuna riga lo riporta manda a cercare il nulla
    conCumuliInRiga: righe.some(f => +f.cumulo > 0),
    senzaFronte: righe.filter(f => f.senzaFronte).length,
  };
}

// Storico anno per anno: quanto scavato, quanto ripreso dai cumuli e dove
// era arrivato il cumulato del titolo alla fine di ogni anno. È la riga di
// controllo che l'ente ricostruisce sommando le denunce degli anni passati.
export function serieAnnuale(rilievi, autorizzazione, oggi = new Date()) {
  return anniConVolumi(rilievi, oggi).sort((x, z) => x - z).map(anno => {
    const r = riepilogoAnnuale(rilievi, anno, autorizzazione, oggi);
    return { anno, scavo: r.scavo, cumulo: r.cumulo, rilievi: r.rilieviScavo + r.rilieviCumulo,
      cumulato: r.cumulatoFineAnno, pct: r.pctFineAnno, inCorso: r.inCorso };
  });
}

// Tipi di scadenza TIPICI del titolo di cava, come voci preimpostate dello
// scadenzario (stessa idea di SCADENZE_PRESET in Scudo: l'utente sceglie
// invece di digitare). ATTENZIONE: qui NON ci sono periodicità né preavvisi,
// perché cambiano da regione a regione e da atto ad atto — data, preavviso e
// ricorrenza li mette sempre l'utente. `nota` spiega in italiano semplice
// perché quella scadenza conta.
export const TIPI_SCADENZA_TERRA = [
  { chiave: "autorizzazione", etichetta: "Autorizzazione / concessione — scadenza del titolo",
    nota: "È il titolo che regge tutto il lavoro: senza rinnovo o proroga l'attività si ferma." },
  { chiave: "fideiussione", etichetta: "Fideiussione — validità o rinnovo della polizza",
    nota: "La garanzia va tenuta in vita fino allo svincolo, che di norma arriva solo dopo il collaudo finale." },
  { chiave: "screening-via", etichetta: "Screening / VIA — validità o prescrizioni del provvedimento",
    nota: "Anche l'esito della verifica ambientale ha tempi e prescrizioni da rispettare." },
  { chiave: "collaudo", etichetta: "Collaudo finale / fine lavori",
    nota: "Passaggio necessario per chiudere il cantiere e liberare la garanzia." },
  { chiave: "rilievo", etichetta: "Rilievo periodico dei lavori (planimetrie aggiornate)",
    nota: "Tenere il rilievo aggiornato è un obbligo ricorrente, non un lusso." },
  { chiave: "denuncia", etichetta: "Comunicazione periodica dei volumi all'ente",
    nota: "Diverse regioni chiedono di comunicare i volumi estratti, anche quando non si è scavato." },
  { chiave: "altro", etichetta: "Altro adempimento", nota: "" },
];

// Ritorna il tipo di scadenza con quella chiave (o null). daVerificare è
// SEMPRE true: la periodicità e i termini vanno letti nell'atto e nella
// legge regionale, Terra non li può indovinare.
export function presetScadenzaTerra(chiave) {
  const p = TIPI_SCADENZA_TERRA.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}
// Etichetta breve del tipo, per l'elenco.
export function etichettaTipoScadenza(chiave) {
  const p = TIPI_SCADENZA_TERRA.find(x => x.chiave === chiave);
  return p ? p.etichetta.split(" — ")[0] : (chiave || "Altro");
}

// SEMAFORO di una scadenza: scaduta / in-scadenza / a-posto. Il preavviso è
// quello impostato sulla singola scadenza (giorni): niente soglia fissa.
// Senza data valida ritorna "a-posto" (un dato incompleto non deve allarmare).
export function statoScadenzaTerra(dataISO, preavvisoGiorni, oggi = new Date()) {
  const g = giorniTra(String(dataISO || ""), oggi);
  if (!Number.isFinite(g)) return "a-posto";
  const pre = Math.max(0, +preavvisoGiorni || 0);
  if (g < 0) return "scaduta";
  return g <= pre ? "in-scadenza" : "a-posto";
}

// Etichetta parlante della scadenza ("scaduta da 17 gg", "tra 12 gg"), con la
// classe del badge. Stesso linguaggio visivo di Scudo, adattato a Terra.
export function livelloScadenzaTerra(dataISO, preavvisoGiorni, oggi = new Date()) {
  const g = giorniTra(String(dataISO || ""), oggi);
  const stato = statoScadenzaTerra(dataISO, preavvisoGiorni, oggi);
  const cls = stato === "scaduta" ? "danger" : stato === "in-scadenza" ? "warn" : "ok";
  if (!Number.isFinite(g)) return { cls: "ok", label: "senza data", giorni: null, stato };
  const label = g < 0 ? "scaduta da " + (-g) + " gg" : g === 0 ? "scade oggi" : "tra " + g + " gg";
  return { cls, label, giorni: g, stato };
}

// Data proposta per la RICORRENZA successiva: data + mesi di ricorrenza.
// Se il giorno non esiste nel mese di arrivo (31 gennaio + 1 mese) si torna
// all'ultimo giorno del mese. Ritorna null se data o mesi non sono validi:
// la proposta è solo un suggerimento, l'utente conferma o corregge.
export function prossimaData(dataISO, ricorrenzaMesi) {
  const s = String(dataISO || "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const mesi = Math.round(+ricorrenzaMesi || 0);
  if (!(mesi > 0)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const t = new Date(y, m - 1 + mesi, d);
  if (t.getDate() !== d) t.setDate(0);               // fine mese corto
  const p = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

// Riepilogo del scadenzario per i KPI e per il quadro: quante scadute,
// quante in scadenza (col preavviso di ognuna), quante a posto.
export function riepilogoScadenze(scadenze, oggi = new Date()) {
  const out = { scadute: 0, inScadenza: 0, aPosto: 0, totale: 0 };
  for (const s of scadenze || []) {
    const st = statoScadenzaTerra(s.dataScadenza, s.preavvisoGiorni, oggi);
    out.totale++;
    if (st === "scaduta") out.scadute++;
    else if (st === "in-scadenza") out.inScadenza++;
    else out.aPosto++;
  }
  return out;
}

// Import dei FRONTI di scavo da CSV (onboarding: caricare i fronti di una cava
// con più fronti, così poi i rilievi importati si possono collegare per nome).
// Colonne: nome;banco;quota;stato (header opzionale). Tiene solo le righe con
// un nome; quota via numIt; stato attivo|sospeso (default attivo). nome/banco
// sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseFrontiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, banco, quota, stato] = parseCsvLine(r);
      const q = numIt(quota);
      return {
        nome: (nome || "").trim(),
        banco: (banco || "").trim(),
        quota: Number.isFinite(q) ? q : 0,
        stato: (stato || "").trim().toLowerCase() === "sospeso" ? "sospeso" : "attivo",
      };
    })
    .filter(f => f.nome);
}

// Import rilievi elaborati da CSV (onboarding: caricare lo storico dei
// rilievi drone). Colonne: data;volumeM3[;metodo;gsd;fronte] (header
// opzionale). Tiene solo le righe con data valida (AAAA-MM-GG) e volume
// numerico ≥ 0. La colonna `fronte` (facoltativa) è il NOME del fronte: viene
// riportata come testo grezzo solo se presente, e va risolta in fronteId da
// chi importa (così il rilievo conta nel volume di quel fronte). La colonna
// `provenienza` (facoltativa, 6ª) vale «cumulo» solo se scritta così: ogni
// altro valore, e la colonna assente, valgono SCAVO — i file già usati per
// gli import continuano a comportarsi esattamente come prima. Pura e
// testabile.
export function parseRilieviCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, volumeM3, metodo, gsd, fronte, provenienza] = parseCsvLine(r);
      const out = {
        data: (data || "").trim(),
        volumeM3: numIt(volumeM3),
        metodo: (metodo || "").trim() || null,
        gsd: (gsd || "").trim() || null,
        provenienza: provenienzaDi({ provenienza }),
      };
      const fr = (fronte || "").trim();
      if (fr) out.fronte = fr;   // solo se presente: righe a 4 colonne restano invariate
      return out;
    })
    .filter(p => /^\d{4}-\d{2}-\d{2}$/.test(p.data) && Number.isFinite(p.volumeM3) && p.volumeM3 >= 0);
}

export function kpiFrom(fronti, rilievi, piano, oggi = new Date()) {
  // mese/anno correnti in ora LOCALE (le date dei rilievi sono stringhe locali
  // yyyy-mm-dd): con toISOString, nelle prime ore dopo mezzanotte del 1° del
  // mese si sarebbe puntato al mese/anno precedente azzerando i volumi.
  const ym = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, "0")}`;  // yyyy-mm
  const anno = String(oggi.getFullYear());
  const elaborati = rilievi.filter(rilievoUsabile);
  const mese = elaborati.filter(r => (r.data || "").slice(0, 7) === ym);
  // «m³ estratti» = SCAVO. I cumuli ripresi si contano a parte
  // (volumiMeseCumulo): sono materiale già estratto, sommarli gonfierebbe
  // l'estratto e l'avanzamento del piano.
  const volumiMese = soloScavo(mese).reduce((s, r) => s + r.volumeM3, 0);
  const volumiMeseCumulo = soloCumulo(mese).reduce((s, r) => s + r.volumeM3, 0);
  const estrattoAnno = soloScavo(elaborati).filter(r => (r.data || "").slice(0, 4) === anno)
                                .reduce((s, r) => s + r.volumeM3, 0);
  const ref = piano.find(p => p.pianificatoAnnuoM3 > 0);
  const avanzamento = ref ? Math.round(100 * estrattoAnno / ref.pianificatoAnnuoM3) : null;
  return {
    volumiMese, volumiMeseCumulo,
    rilieviMese: mese.length,
    avanzamento,                                       // % (null se piano assente)
    riserveM3: ref && ref.riserveM3 != null ? ref.riserveM3 : null,
    frontiAttivi: fronti.filter(f => f.stato === "attivo").length,
  };
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P2 — CAMPO → TERRA
// La logica sta in `shared/dw-ponti.js`, perché serve anche a Campo e non
// appartiene a nessuna delle due app (la spiegazione completa è lì). Qui si
// ri-esporta, così le pagine di Terra continuano a importare da dove hanno
// sempre importato: un alias non è una seconda implementazione.
// ══════════════════════════════════════════════════════════════════════
export {
  produzioneRapportino, produzioneDichiarata, SOGLIA_TURNI, riconciliazioneTurni,
  misuratoPeriodo, intervalliFraRilievi, periodoFraUltimiRilievi,
  avanzamentoDaUltimoRilievo,
  // P2: la stessa produzione, ma fronte per fronte
  produzionePerFronte,
} from "../../shared/dw-ponti.js";

export async function terraData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "terra" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        fronti: () => read("fronti"),
        rilievi: () => read("rilievi"),
        piano: () => read("piano"),
        autorizzazioni: () => read("autorizzazioni"),
        scadenze: () => read("scadenze"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
      // ── PONTE P2 CON CAMPO — SOLA LETTURA ─────────────────────────────
      // Seconda istanza dell'SDK sull'app "campo", stessa organizzazione: il
      // percorso lo costruisce `orgCollection`, come per i dati di Terra —
      // nessun percorso Firestore scritto a mano, quindi l'isolamento fra
      // organizzazioni vale anche qui. Nessuna scrittura: Terra legge i
      // rapportini, non li tocca. È lo stesso impianto di `rilieviTerra()` in
      // apps/conti/conti-data.js.
      // Si apre solo quando serve — la prima volta che si guarda il confronto —
      // così l'avvio di Terra non rallenta per una cosa che magari non si
      // guarda. Se Campo non c'è, o se la lettura non è permessa, torna null:
      // l'app dirà che il dichiarato non è disponibile, senza inventare zero.
      let idCampo;                       // undefined = mai provato, null = non c'è
      api.rapportiniCampo = async () => {
        if (idCampo === undefined) {
          try { idCampo = await DeepworkID.init({ appId: "campo" }); }
          catch (e) { idCampo = null; }
        }
        if (!idCampo) return null;
        try {
          return (await getDocs(idCampo.orgCollection("rapportini")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) { /* backend assente: demo */ }

  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      fronti: async () => mem.fronti,
      rilievi: async () => mem.rilievi,
      piano: async () => mem.piano,
      autorizzazioni: async () => mem.autorizzazioni,
      scadenze: async () => mem.scadenze,
      // in dimostrazione i rapportini non arrivano da Campo: sono finti, ma
      // coerenti coi rilievi d'esempio (vedi DEMO.rapportiniCampo)
      rapportiniCampo: async () => mem.rapportiniCampo || [],
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
