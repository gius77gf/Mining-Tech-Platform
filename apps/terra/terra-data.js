// ============================================================
// Terra — accesso dati (C6). Stesso schema di scudo-data.js:
// Firestore via SDK Deepwork ID (orgCollection) da autenticati,
// demo in memoria altrimenti (tour/mockup).
// Collezioni (sotto organizations/{org}/apps/terra/):
//   fronti/{id}:  { nome, banco, quota, dettaglio,
//                   avanzamento (0-100), stato: attivo|sospeso }
//   rilievi/{id}: { titolo, data (ISO yyyy-mm-dd), tipo,
//                   volumeM3|null, stato: elaborato|pianificato }
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

import { parseCsvLine, numIt, isIntestazione, giorniTra } from "../../shared/deepwork-id-client/dw-shell.js";

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
  scadenze: [
    { id: "t1", tipo: "autorizzazione", descrizione: "Scadenza del titolo autorizzativo", dataScadenza: "2031-03-14", preavvisoGiorni: 180, ricorrenzaMesi: null, note: "" },
    { id: "t2", tipo: "fideiussione", descrizione: "Polizza fideiussoria — rinnovo annuale", dataScadenza: "2026-09-30", preavvisoGiorni: 90, ricorrenzaMesi: 12, note: "Si svincola solo dopo il collaudo finale." },
    { id: "t3", tipo: "rilievo", descrizione: "Rilievo periodico dei lavori", dataScadenza: "2026-08-10", preavvisoGiorni: 30, ricorrenzaMesi: 6, note: "" },
    { id: "t4", tipo: "screening-via", descrizione: "Prescrizione dello screening da ottemperare", dataScadenza: "2026-07-10", preavvisoGiorni: 60, ricorrenzaMesi: null, note: "" },
  ],
};

// formattazione compatta dei volumi (38k, 1.2M) per i KPI
export function fmtM3(v) {
  if (v == null) return "—";
  if (v >= 1e6) return (Math.round(v / 1e5) / 10) + "M";
  if (v >= 1e3) return Math.round(v / 1e3) + "k";
  return String(v);
}

// Volume estratto da un fronte = somma dei m³ dei rilievi ELABORATI di
// quel fronte (i pianificati e i volumi assenti non contano). È il "m³
// estratti" mostrato per fronte. Funzione pura e testabile.
export function volumeFronte(rilievi, fronteId) {
  return (rilievi || [])
    .filter(r => r.fronteId === fronteId && r.stato === "elaborato" && r.volumeM3 != null)
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

// Libreria di DENSITÀ di riferimento (peso di volume "in banco", t/m³) per
// litotipo: aiuta chi non è tecnico a impostare la densità nel calcolo del
// valore (m³ → tonnellate → euro) invece di indovinarla. Valori TIPICI da
// fonti secondarie concordanti (vedi vault/RICERCA_DENSITA_MATERIALI.md): NON
// sono una misura del materiale specifico, quindi ognuno porta l'avviso
// `daVerificare` (via presetDensita). La densità reale dipende da porosità,
// fratturazione e umidità: va confermata col laboratorio prima di usarla per
// numeri contrattuali. Serve la densità IN SITU (il rilievo misura il vuoto di
// scavo), non quella del materiale sciolto in mucchio.
export const DENSITA_PRESET = [
  { chiave: "calcare-compatto", etichetta: "Calcare compatto",              densita: 2.6, fonte: "Geostru / Testo Unico Sicurezza (2,5–2,7)" },
  { chiave: "calcare-tenero",   etichetta: "Calcare tenero",                densita: 2.2, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "dolomia",          etichetta: "Dolomia",                       densita: 2.8, fonte: "Geostru" },
  { chiave: "basalto",          etichetta: "Basalto",                       densita: 2.9, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "granito",          etichetta: "Granito",                       densita: 2.7, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "arenaria",         etichetta: "Arenaria",                      densita: 2.3, fonte: "Geostru (2,2–2,6)" },
  { chiave: "marmo",            etichetta: "Marmo",                         densita: 2.7, fonte: "Geostru" },
  { chiave: "gesso",            etichetta: "Gesso",                         densita: 2.3, fonte: "Geostru" },
  { chiave: "argilla",          etichetta: "Argilla compatta",              densita: 2.1, fonte: "Testo Unico Sicurezza" },
  { chiave: "sabbia-ghiaia",    etichetta: "Sabbia e ghiaia (deposito)",    densita: 1.9, fonte: "riferimento deposito naturale in banco" },
];

// Ritorna il preset di densità con quella chiave (o null). daVerificare è
// SEMPRE true: nessun valore tipico va usato senza conferma di laboratorio.
export function presetDensita(chiave) {
  const p = DENSITA_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}

// Qualità del dato di un rilievo: mette insieme metodo (RTK/PPK, GCP…) e
// GSD in una stringa breve, così il volume è "difendibile" in audit senza
// doverlo ricalcolare. Stringa vuota se non si sa nulla. Pura e testabile.
export function qualitaRilievo(r) {
  const parti = [];
  if (r && r.metodo) parti.push(r.metodo);
  if (r && r.gsd != null && String(r.gsd).trim() !== "") parti.push("GSD " + r.gsd + " cm");
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
  const estrattoAnno = (rilievi || [])
    .filter(r => r.stato === "elaborato" && r.volumeM3 != null && String(r.data || "").slice(0, 4) === String(anno))
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
  const el = (rilievi || [])
    .filter(r => r.stato === "elaborato" && r.volumeM3 != null)
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  if (el.length < 2) return null;
  const ultimo = +el[0].volumeM3 || 0, precedente = +el[1].volumeM3 || 0;
  const delta = ultimo - precedente;
  return { ultimo, precedente, delta, pct: precedente > 0 ? Math.round(100 * delta / precedente) : null };
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
//    prima appartiene a un altro titolo;
//  - `pregresso`: quanto era già stato estratto quando si è iniziato a usare
//    Terra, dichiarato dall'utente nella scheda (senza questo numero il
//    contatore vita cava sarebbe ottimista e quindi pericoloso).
export function estrattoComplessivo(rilievi, autorizzazione) {
  const a = autorizzazione || {};
  const da = /^\d{4}-\d{2}-\d{2}$/.test(String(a.dataRilascio || "")) ? String(a.dataRilascio) : null;
  const rilevato = (rilievi || [])
    .filter(r => r.stato === "elaborato" && r.volumeM3 != null)
    .filter(r => !da || String(r.data || "") >= da)
    .reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  const pregresso = Math.max(0, +a.estrattoPregressoM3 || 0);
  return { rilevato, pregresso, totale: rilevato + pregresso, daData: da };
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
  const dalISO = dal.toISOString().slice(0, 10);
  const el = (rilievi || [])
    .filter(r => r.stato === "elaborato" && r.volumeM3 != null && /^\d{4}-\d{2}-\d{2}$/.test(String(r.data || "")))
    .filter(r => String(r.data) >= dalISO && String(r.data) <= o.toISOString().slice(0, 10));
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
    residuo, pct, soglia, stato, ritmoAnnuo: annuo > 0 ? annuo : null,
    ritmo: rm, anniResidui, annoEsaurimento, scadePrimaIlTitolo,
  };
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
// chi importa (così il rilievo conta nel volume di quel fronte). Pura e
// testabile.
export function parseRilieviCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, volumeM3, metodo, gsd, fronte] = parseCsvLine(r);
      const out = {
        data: (data || "").trim(),
        volumeM3: numIt(volumeM3),
        metodo: (metodo || "").trim() || null,
        gsd: (gsd || "").trim() || null,
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
  const elaborati = rilievi.filter(r => r.stato === "elaborato" && r.volumeM3 != null);
  const mese = elaborati.filter(r => (r.data || "").slice(0, 7) === ym);
  const volumiMese = mese.reduce((s, r) => s + r.volumeM3, 0);
  const estrattoAnno = elaborati.filter(r => (r.data || "").slice(0, 4) === anno)
                                .reduce((s, r) => s + r.volumeM3, 0);
  const ref = piano.find(p => p.pianificatoAnnuoM3 > 0);
  const avanzamento = ref ? Math.round(100 * estrattoAnno / ref.pianificatoAnnuoM3) : null;
  return {
    volumiMese,
    rilieviMese: mese.length,
    avanzamento,                                       // % (null se piano assente)
    riserveM3: ref && ref.riserveM3 != null ? ref.riserveM3 : null,
    frontiAttivi: fronti.filter(f => f.stato === "attivo").length,
  };
}

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
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
