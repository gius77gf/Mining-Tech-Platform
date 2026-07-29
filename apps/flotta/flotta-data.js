// ============================================================
// Flotta — accesso dati (C3). Schema condiviso: Firestore via SDK
// Deepwork ID (orgCollection) da autenticati, demo in memoria
// altrimenti. Collezioni (sotto organizations/{org}/apps/flotta/):
//   mezzi/{id}:        { nome, ore, area, stato: operativo|fermo|verifica }
//   manutenzioni/{id}: { titolo, mezzo, dataPrevista (ISO) }
//   costi/{id}:        { voce, importo (EUR), nota, data (ISO)|null }
//                      `data` = giorno a cui la spesa si riferisce (29/07).
//                      È FACOLTATIVO e può mancare: le voci registrate prima
//                      che il campo esistesse restano valide e si mostrano
//                      come «senza data» — mai una data inventata al posto
//                      loro, mai nascoste.
//   disponibilita/{id}:{ data (ISO), operativi, totale } — FOTOGRAFIA
//                      GIORNALIERA del parco (29/07): una riga al giorno,
//                      scritta dall'app quando la si apre o quando si cambia
//                      lo stato di un mezzo. Serve a dare uno STORICO alla
//                      disponibilità, che in `mezzi.stato` è solo la
//                      fotografia di adesso. I giorni in cui nessuno apre
//                      l'app NON hanno riga e restano buchi: non si inventa
//                      né si interpola il valore mancante.
//   ricambi/{id}:      { nome, giacenza, sogliaMin }
//   interventi/{id}:   { data (ISO), titolo, mezzo, ricambio|null,
//                        costo|0, note } — ORDINE DI LAVORO chiuso:
//                        lo storico manutenzioni del mezzo (25/07)
//   scadenze/{id}:     { mezzo, tipo, chiave|null, dataScadenza (ISO),
//                        mesi|null (periodicità), documento, note,
//                        ultimaData|null, ultimoEsito|null } — SCADENZE
//                        DI LEGGE del mezzo (F6, 27/07)
//   controlli/{id}:    { data (ISO), mezzo, tipo (chiave del tipo di mezzo),
//                        operatore, ore|null, voci: [{chiave, etichetta,
//                        esito: "ok"|"no", nota, critica}], anomalie,
//                        note } — GIRO MACCHINA, il controllo pre-uso che
//                        l'operatore fa dal telefono a inizio turno (L2,
//                        29/07). Ogni voce «non va» diventa una
//                        manutenzione collegata al mezzo.
//   rifornimenti/{id}: { data (ISO), mezzo, litri, euro, ore|null
//                        (contatore al rifornimento), nota, costoId|null }
//                        — RIFORNIMENTI di gasolio per mezzo (L4, 29/07).
//                        `costoId` è la voce di costo gemella, così il
//                        rifornimento entra una sola volta nella spesa
//                        della flotta e sparisce da entrambe se lo togli.
// Campi FACOLTATIVI aggiunti il 29/07, tutti retro-compatibili (chi non li
// ha si comporta esattamente come prima):
//   mezzi.tipo         chiave del tipo di mezzo (escavatore, pala, …). Se
//                      manca si INDOVINA dal nome, non si inventa un dato
//                      salvato.
//   manutenzioni.ogniOre / .ogniMesi   PIANO RICORRENTE (L3): alla chiusura
//                      del tagliando l'app ne pianifica da sola il
//                      successivo (+ogniOre sulle ore attuali del mezzo,
//                      oppure +ogniMesi sulla data di chiusura).
//   manutenzioni.origine / .nota       da dove nasce la manutenzione
//                      ("controllo" = giro macchina, "piano" = tagliando
//                      ricorrente) e la riga scritta da chi l'ha aperta.
// L'urgenza delle manutenzioni si CALCOLA dalla data (mai salvata).
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione } from "../../shared/deepwork-id-client/dw-shell.js";

// Data di oggi in formato ISO (aaaa-mm-gg) nel fuso dell'utente: la stessa
// che scrive l'app quando registra la fotografia del giorno.
export function oggiIso(oggi = new Date()) {
  const d = new Date(oggi);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
const isoIndietro = (giorni) => oggiIso(new Date(Date.now() - giorni * 86400000));

// Storico DEMO della disponibilità: giorni RELATIVI a oggi, così l'esempio
// resta leggibile in qualunque momento lo si guardi. Tre giorni sono saltati
// di proposito (8, 9 e 4 giorni fa): sono i giorni in cui nessuno ha aperto
// l'app, e nell'andamento devono restare BUCHI, non zeri e non valori
// interpolati. `totale` è coerente con i 6 mezzi del parco d'esempio.
const DEMO_DISPONIBILITA = [
  { g: 12, op: 6 }, { g: 11, op: 6 }, { g: 10, op: 5 },
  { g: 7, op: 5 }, { g: 6, op: 4 }, { g: 5, op: 4 },
  { g: 3, op: 5 }, { g: 2, op: 6 }, { g: 1, op: 6 },
].map((r, i) => ({ id: "dp" + (i + 1), data: isoIndietro(r.g), operativi: r.op, totale: 6 }));

export const DEMO = {
  mezzi: [
    { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5870, area: "fronte Est", stato: "operativo", tipo: "escavatore" },
    { id: "m2", nome: "Escavatore E2 — Volvo EC480", ore: 3210, area: "piazzale", stato: "operativo", tipo: "escavatore" },
    { id: "m3", nome: "Dumper D1 — CAT 745", ore: 8420, area: "", stato: "operativo", tipo: "dumper" },
    { id: "m4", nome: "Dumper D3 — CAT 745", ore: 9105, area: "officina", stato: "fermo", tipo: "dumper" },
    { id: "m5", nome: "Perforatrice P2 — Epiroc", ore: 2980, area: "fronte Est", stato: "verifica", tipo: "perforatrice" },
    // m6 di proposito SENZA `tipo`: è un mezzo registrato prima che il campo
    // esistesse. Il tipo si indovina dal nome («Pala») e la checklist del
    // giro macchina funziona lo stesso, senza scrivere niente di finto.
    { id: "m6", nome: "Pala P1 — CAT 980", ore: 6540, area: "frantoio", stato: "operativo" },
  ],
  manutenzioni: [
    { id: "n1", titolo: "Tagliando 500h", mezzo: "Escavatore E1", dataPrevista: null, orePreviste: 6000, ogniOre: 500, piano: "500" },
    { id: "n2", titolo: "Rotazione gomme", mezzo: "Dumper D1", dataPrevista: "2026-08-05" },
    { id: "n3", titolo: "Revisione annuale", mezzo: "Pala P1", dataPrevista: "2026-08-20", ogniMesi: 12 },
    { id: "n4", titolo: "Giro macchina: Perdite sotto la macchina", mezzo: "Dumper D1",
      dataPrevista: isoIndietro(1), origine: "controllo",
      nota: "macchia fresca di olio sotto la trasmissione" },
  ],
  // GIRO MACCHINA (L2): il controllo pre-uso che l'operatore fa a inizio
  // turno. Il secondo esempio ha una voce «non va» ed è quello che ha fatto
  // nascere la manutenzione n4: è la catena che si vuole far vedere.
  controlli: [
    { id: "g1", data: isoIndietro(0), mezzo: "Escavatore E2", tipo: "escavatore",
      operatore: "Marco", ore: 3210, anomalie: 0, note: "",
      voci: [
        { chiave: "livelli", etichetta: "Livelli: olio motore, refrigerante, gasolio", esito: "ok", nota: "", critica: false },
        { chiave: "perdite", etichetta: "Perdite sotto la macchina", esito: "ok", nota: "", critica: false },
        { chiave: "freni", etichetta: "Freni, sterzo e comandi", esito: "ok", nota: "", critica: true },
        { chiave: "luci", etichetta: "Luci, faro rotante e avvisatore acustico", esito: "ok", nota: "", critica: false },
        { chiave: "cabina", etichetta: "Cabina: cintura, sedile, specchi, vetri", esito: "ok", nota: "", critica: false },
        { chiave: "sicurezza", etichetta: "Estintore, primo soccorso, cunei", esito: "ok", nota: "", critica: true },
        { chiave: "protezioni", etichetta: "Carter e protezioni al loro posto", esito: "ok", nota: "", critica: true },
        { chiave: "sottocarro", etichetta: "Cingoli e sottocarro: tensione e usura", esito: "ok", nota: "", critica: false },
        { chiave: "idraulico", etichetta: "Tubi e cilindri idraulici: trafilamenti", esito: "ok", nota: "", critica: false },
        { chiave: "benna", etichetta: "Denti benna e attacco rapido", esito: "ok", nota: "", critica: true },
        { chiave: "rotazione", etichetta: "Rotazione torretta: gioco e rumori", esito: "ok", nota: "", critica: false },
      ] },
    { id: "g2", data: isoIndietro(1), mezzo: "Dumper D1", tipo: "dumper",
      operatore: "Luca", ore: 8420, anomalie: 1, note: "",
      voci: [
        { chiave: "livelli", etichetta: "Livelli: olio motore, refrigerante, gasolio", esito: "ok", nota: "", critica: false },
        { chiave: "perdite", etichetta: "Perdite sotto la macchina", esito: "no", nota: "macchia fresca di olio sotto la trasmissione", critica: false },
        { chiave: "freni", etichetta: "Freni, sterzo e comandi", esito: "ok", nota: "", critica: true },
        { chiave: "luci", etichetta: "Luci, faro rotante e avvisatore acustico", esito: "ok", nota: "", critica: false },
        { chiave: "cabina", etichetta: "Cabina: cintura, sedile, specchi, vetri", esito: "ok", nota: "", critica: false },
        { chiave: "sicurezza", etichetta: "Estintore, primo soccorso, cunei", esito: "ok", nota: "", critica: true },
        { chiave: "protezioni", etichetta: "Carter e protezioni al loro posto", esito: "ok", nota: "", critica: true },
        { chiave: "gomme", etichetta: "Pneumatici: pressione, tagli, serraggio ruote", esito: "ok", nota: "", critica: true },
        { chiave: "cassone", etichetta: "Cassone, perni e sicura di ribaltamento", esito: "ok", nota: "", critica: true },
        { chiave: "aria", etichetta: "Impianto aria: pressione e scarico condensa", esito: "ok", nota: "", critica: false },
      ] },
  ],
  // RIFORNIMENTI (L4). Per calcolare i litri/ora servono ALMENO DUE
  // rifornimenti con il contatore delle ore: il primo fissa solo il punto di
  // partenza. L'Escavatore E2 ne ha uno solo, di proposito: è il caso in cui
  // il consumo non si può ancora dire, e l'app lo dichiara invece di
  // inventare un numero.
  rifornimenti: [
    { id: "r1", data: "2026-07-12", mezzo: "Escavatore E1", litri: 480, euro: 720, ore: 5812, nota: "cisterna cava", costoId: null },
    { id: "r2", data: "2026-07-20", mezzo: "Escavatore E1", litri: 505, euro: 762, ore: 5841, nota: "", costoId: null },
    { id: "r3", data: "2026-07-27", mezzo: "Escavatore E1", litri: 470, euro: 700, ore: 5868, nota: "", costoId: null },
    { id: "r4", data: "2026-07-10", mezzo: "Dumper D1", litri: 390, euro: 585, ore: 8355, nota: "", costoId: null },
    { id: "r5", data: "2026-07-21", mezzo: "Dumper D1", litri: 415, euro: 620, ore: 8390, nota: "", costoId: null },
    { id: "r6", data: "2026-07-28", mezzo: "Dumper D1", litri: 360, euro: 540, ore: 8416, nota: "", costoId: null },
    { id: "r7", data: "2026-07-14", mezzo: "Pala P1", litri: 300, euro: 450, ore: 6498, nota: "", costoId: null },
    { id: "r8", data: "2026-07-26", mezzo: "Pala P1", litri: 320, euro: 480, ore: 6531, nota: "", costoId: null },
    { id: "r9", data: "2026-07-24", mezzo: "Escavatore E2", litri: 300, euro: 450, ore: 3195, nota: "primo pieno registrato", costoId: null },
  ],
  // Le voci di costo hanno la data del giorno a cui la spesa si riferisce.
  // `c3` è di proposito SENZA data: è una voce come quelle registrate prima
  // che il campo esistesse, e serve a far vedere come l'app la tratta —
  // resta in lista, marcata «senza data», e non entra nell'andamento mensile.
  costi: [
    { id: "c1", voce: "Carburante", importo: 8400, nota: "registrato a mano, prima dei rifornimenti per mezzo", data: "2026-07-06" },
    { id: "c2", voce: "Ricambi e officina", importo: 3150, nota: "", data: "2026-07-02" },
    { id: "c3", voce: "Noleggi esterni", importo: 1200, nota: "gru mobile 2gg" },
    { id: "c4", voce: "Ricambi e officina", importo: 2480, nota: "", data: "2026-06-11" },
    { id: "c5", voce: "Noleggi esterni", importo: 2100, nota: "escavatore a nolo", data: "2026-06-03" },
    { id: "c6", voce: "Gomme", importo: 3400, nota: "4 gomme dumper", data: "2026-05-22" },
    { id: "c7", voce: "Ricambi e officina", importo: 1760, nota: "", data: "2026-05-07" },
  ],
  interventi: [
    { id: "w1", data: "2026-07-10", titolo: "Tagliando 500h", mezzo: "Escavatore E1", ricambio: "Filtro olio motore CAT", costo: 420, note: "olio + filtri" },
    { id: "w2", data: "2026-06-28", titolo: "Sostituzione pompa idraulica", mezzo: "Dumper D3", ricambio: null, costo: 3850, note: "officina esterna" },
    { id: "w3", data: "2026-06-14", titolo: "Riparazione impianto frenante", mezzo: "Dumper D3", ricambio: null, costo: 1240, note: "" },
    { id: "w4", data: "2026-05-30", titolo: "Rotazione e sostituzione gomme", mezzo: "Dumper D1", ricambio: null, costo: 2100, note: "4 gomme posteriori" },
    { id: "w5", data: "2026-05-12", titolo: "Denti benna e usure", mezzo: "Pala P1", ricambio: "Denti benna escavatore", costo: 760, note: "" },
    { id: "w6", data: "2026-04-22", titolo: "Tagliando 1000h", mezzo: "Escavatore E2", ricambio: "Filtro gasolio", costo: 540, note: "" },
    { id: "w7", data: "2026-04-08", titolo: "Revisione martello perforatore", mezzo: "Perforatrice P2", ricambio: null, costo: 1180, note: "" },
  ],
  ricambi: [
    { id: "p1", nome: "Filtro olio motore CAT", giacenza: 6, sogliaMin: 4 },
    { id: "p2", nome: "Filtro gasolio", giacenza: 2, sogliaMin: 4 },
    { id: "p3", nome: "Olio idraulico (fusto 200L)", giacenza: 1, sogliaMin: 1 },
    { id: "p4", nome: "Denti benna escavatore", giacenza: 0, sogliaMin: 3 },
  ],
  scadenze: [
    { id: "sc1", mezzo: "Escavatore E1", tipo: "Verifica periodica", chiave: "verifica-periodica",
      dataScadenza: "2026-07-10", mesi: 12, documento: "verbale ASL 2025/118", note: "",
      ultimaData: "2025-07-10", ultimoEsito: "regolare" },
    { id: "sc2", mezzo: "Pala P1", tipo: "Funi e catene", chiave: "funi-catene",
      dataScadenza: "2026-08-12", mesi: 3, documento: "registro di controllo", note: "" },
    { id: "sc3", mezzo: "Dumper D1", tipo: "Revisione", chiave: "revisione",
      dataScadenza: "2029-03-01", mesi: 60, documento: "libretto di circolazione", note: "mezzo targato" },
  ],
  disponibilita: DEMO_DISPONIBILITA,
};

// ============================================================
// F6 — SCADENZE DI LEGGE DEL MEZZO
// Voci preimpostate prese dalla scheda docs/RICERCA_FLOTTA_202607.md.
// `mesi` è solo una PROPOSTA di periodicità: l'utente la può cambiare
// su ogni singola scadenza, perché le regole cambiano da attrezzatura ad
// attrezzatura e da contesto a contesto (mesi null = scadenza singola,
// non ricorrente). `norma` e `nota` si MOSTRANO all'utente come
// informazione, non come consulenza legale.
// Le abilitazioni delle PERSONE (patentini, corsi) restano in Scudo:
// qui ci sono solo le scadenze del MEZZO, per non fare doppioni.
// ============================================================
export const SCADENZE_MEZZO_PRESET = [
  { chiave: "verifica-periodica", tipo: "Verifica periodica", mesi: 12,
    etichetta: "Verifica periodica dell'attrezzatura",
    norma: "D.Lgs. 81/2008, art. 71 c.11 e Allegato VII",
    nota: "Riguarda gru su autocarro, autogrù, carrelli semoventi a braccio telescopico, piattaforme elevabili, ponti sviluppabili, argani e paranchi. La prima verifica la fa l'INAIL, le successive l'ASL o un soggetto privato abilitato. La periodicità cambia da attrezzatura ad attrezzatura: controlla l'Allegato VII per la tua." },
  { chiave: "gru-autocarro", tipo: "Verifica periodica", mesi: 12,
    etichetta: "Gru su autocarro / autogrù — verifica",
    norma: "D.Lgs. 81/2008, Allegato VII",
    nota: "Nel settore estrattivo la verifica è ogni 12 mesi (negli altri settori 24), e comunque ogni 12 mesi se la macchina ha più di 10 anni." },
  { chiave: "funi-catene", tipo: "Funi e catene", mesi: 3,
    etichetta: "Funi, catene e ganci — controllo trimestrale",
    norma: "D.Lgs. 81/2008, Allegato VII — registro di controllo",
    nota: "Controllo di funi, catene e ganci da parte di tecnico qualificato, da annotare sul libretto/registro di controllo della macchina." },
  { chiave: "registro-controllo", tipo: "Registro di controllo", mesi: 12,
    etichetta: "Registro di controllo / libretto macchina — riepilogo",
    norma: "D.Lgs. 81/2008, art. 71",
    nota: "Ogni verifica va annotata con data, firma di chi l'ha fatta e descrizione. I risultati vanno tenuti a disposizione degli organi di vigilanza per 5 anni." },
  { chiave: "revisione", tipo: "Revisione", mesi: 60,
    etichetta: "Revisione alla Motorizzazione (mezzo targato)",
    norma: "Codice della Strada — macchine operatrici immatricolate",
    nota: "Riguarda i mezzi immatricolati che circolano su strada (dumper, pale con targa): revisione ogni 5 anni." },
  { chiave: "assicurazione", tipo: "Assicurazione", mesi: 12,
    etichetta: "Assicurazione / polizza RC del mezzo",
    norma: "obbligo assicurativo del mezzo",
    nota: "La data la trovi sulla polizza: metti qui la scadenza concordata con l'assicurazione." },
  { chiave: "sorveglianza-cava", tipo: "Sorveglianza cava", mesi: 12,
    etichetta: "Sorveglianza macchine e impianti in cava",
    norma: "D.P.R. 128/1959 — polizia delle miniere e delle cave",
    nota: "In cava il direttore responsabile e i sorveglianti garantiscono la sorveglianza su macchine e impianti e tengono i documenti a disposizione dell'ingegnere capo." },
  { chiave: "noleggio-freddo", tipo: "Noleggio a freddo", mesi: null,
    etichetta: "Noleggio a freddo — attestazione e dichiarazioni",
    norma: "D.Lgs. 81/2008, art. 72",
    nota: "Chi noleggia un mezzo senza operatore attesta che è in buono stato e si fa consegnare la dichiarazione che gli operatori sono formati e abilitati, conservandola per tutta la durata del noleggio. Non è ricorrente: vale per il singolo noleggio (metti come data la fine del noleggio)." },
  { chiave: "registro-carburante", tipo: "Registro carburante", mesi: 12,
    etichetta: "Registro carico/scarico gasolio (cisterna oltre 10 mc)",
    norma: "obblighi dei depositi di carburante a uso privato/industriale",
    nota: "Serve solo se in cava c'è una cisterna aziendale sopra i 10 metri cubi: sotto i 10 mc si è esenti." },
  { chiave: "altro", tipo: "Altro", mesi: null,
    etichetta: "Altra scadenza del mezzo",
    norma: "", nota: "Usa questa voce per una scadenza che non rientra nelle altre: scrivi tu il tipo nelle note." },
];

// Preset con quella chiave (o null se non esiste). Pura e testabile.
export function presetScadenzaMezzo(chiave) {
  return SCADENZE_MEZZO_PRESET.find(p => p.chiave === chiave) || null;
}

// Data (ISO) ottenuta aggiungendo `mesi` a una data ISO: serve a PROPORRE
// la prossima scadenza quando se ne chiude una ricorrente. Se il giorno non
// esiste nel mese di arrivo (31 gennaio + 1 mese) si usa l'ultimo giorno del
// mese. Ritorna null se la data non è valida o la periodicità non è
// positiva. Pura e testabile.
export function aggiungiMesi(dataISO, mesi) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dataISO || "").slice(0, 10));
  const n = Math.round(+mesi || 0);
  if (!m || !(n > 0)) return null;
  const anno = +m[1], mese = +m[2], giorno = +m[3];
  const tot = anno * 12 + (mese - 1) + n;
  const ny = Math.floor(tot / 12), nm = (tot % 12) + 1;
  const ultimoGiorno = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  const nd = Math.min(giorno, ultimoGiorno);
  return `${ny}-${String(nm).padStart(2, "0")}-${String(nd).padStart(2, "0")}`;
}

// SEMAFORO di una scadenza di legge: scaduta (rosso) / in scadenza entro il
// preavviso (giallo) / a posto (verde). Il preavviso è impostabile
// dall'utente (default 30 giorni). Stesso linguaggio visivo del resto di
// Flotta: cls "danger" | "warn" | "ok" per il badge. Lo stato non si salva
// MAI: si calcola dalla data. Pura e testabile.
export function statoScadenzaMezzo(dataISO, oggi = new Date(), preavvisoGiorni = 30) {
  const soglia = Math.max(0, Math.round(+preavvisoGiorni || 0));
  if (!dataISO) return { stato: "senza-data", cls: "warn", label: "senza data", giorni: null };
  const g = giorniTra(String(dataISO).slice(0, 10), oggi);
  if (!Number.isFinite(g)) return { stato: "senza-data", cls: "warn", label: "senza data", giorni: null };
  if (g < 0) return { stato: "scaduta", cls: "danger", label: "scaduta da " + (-g) + " gg", giorni: g };
  if (g === 0) return { stato: "in-scadenza", cls: "danger", label: "scade oggi", giorni: 0 };
  if (g <= soglia) return { stato: "in-scadenza", cls: "warn", label: "tra " + g + " gg", giorni: g };
  return { stato: "a-posto", cls: "ok", label: "tra " + g + " gg", giorni: g };
}

// Scadenze ORDINATE PER URGENZA (prima le più scadute, poi le più vicine),
// ognuna arricchita con il suo semaforo. Pura e testabile: `oggi` iniettabile.
export function scadenzeOrdinate(scadenze, oggi = new Date(), preavvisoGiorni = 30) {
  return (scadenze || [])
    .map(s => ({ ...s, sem: statoScadenzaMezzo(s.dataScadenza, oggi, preavvisoGiorni) }))
    .sort((a, b) =>
      (a.sem.giorni == null ? -1e9 : a.sem.giorni) - (b.sem.giorni == null ? -1e9 : b.sem.giorni) ||
      String(a.mezzo || "").localeCompare(String(b.mezzo || ""), "it") ||
      String(a.tipo || "").localeCompare(String(b.tipo || ""), "it"));
}

// Conteggi del semaforo, per i numeri in evidenza: scadute / in scadenza /
// a posto / mezzi coinvolti. Pura e testabile.
export function contaScadenzeMezzi(scadenze, oggi = new Date(), preavvisoGiorni = 30) {
  const c = { scadute: 0, inScadenza: 0, aPosto: 0, totale: 0, mezzi: 0 };
  const mezzi = new Set();
  for (const s of scadenze || []) {
    c.totale++;
    if (s.mezzo) mezzi.add(String(s.mezzo));
    const st = statoScadenzaMezzo(s.dataScadenza, oggi, preavvisoGiorni).stato;
    if (st === "scaduta") c.scadute++;
    else if (st === "in-scadenza" || st === "senza-data") c.inScadenza++;
    else c.aPosto++;
  }
  c.mezzi = mezzi.size;
  return c;
}

// Validazione di una scadenza prima di salvarla: campi obbligatori e date
// non assurde (un anno digitato male è l'errore più frequente). Ritorna
// { ok, errori: {campo: messaggio}, mesi }. Pura e testabile.
export function validaScadenzaMezzo(dati, oggi = new Date()) {
  const d = dati || {}, errori = {};
  if (!String(d.mezzo || "").trim()) errori.mezzo = "Scegli il mezzo a cui si riferisce la scadenza.";
  if (!String(d.tipo || "").trim()) errori.tipo = "Scegli il tipo di scadenza.";
  const iso = String(d.dataScadenza || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    errori.dataScadenza = "Serve la data di scadenza.";
  } else {
    const g = giorniTra(iso, oggi);
    if (!Number.isFinite(g)) errori.dataScadenza = "La data non è valida.";
    else if (g < -3650) errori.dataScadenza = "Data troppo indietro nel tempo (oltre 10 anni fa): controlla l'anno.";
    else if (g > 5475) errori.dataScadenza = "Data troppo lontana (oltre 15 anni): controlla l'anno.";
  }
  let mesi = null;
  if (d.mesi != null && String(d.mesi).trim() !== "") {
    const n = Math.round(+d.mesi);
    if (!Number.isFinite(n) || n < 0 || n > 600) errori.mesi = "La periodicità va da 1 a 600 mesi (lascia vuoto se non si ripete).";
    else mesi = n > 0 ? n : null;
  }
  return { ok: Object.keys(errori).length === 0, errori, mesi };
}

// Import telemetria da CSV esportato dai portali OEM (colonne:
// mezzo;ore[;carburante], header opzionale). Coerce a numero e scarta le
// righe non valide (mezzo mancante o ore non numeriche/negative). È l'MVP
// di import telemetria (vedi vault "Telematics — cosa può fare Flotta").
// Il campo `mezzo` va SEMPRE escapato dove mostrato (testo grezzo del file).
// Funzione pura e testabile.
export function parseTelemetriaCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "mezzo"))
    .map(r => {
      const [mezzo, ore, carburante] = parseCsvLine(r);
      return {
        mezzo: (mezzo || "").trim(),
        ore: numIt(ore),
        carburante: (carburante != null && String(carburante).trim() !== "") ? numIt(carburante) : null,
      };
    })
    .filter(p => p.mezzo && Number.isFinite(p.ore) && p.ore >= 0);
}

// Import del PARCO MEZZI da CSV (onboarding: caricare la flotta iniziale invece
// di aggiungere ogni mezzo a mano). Colonne: nome;area;ore;stato (header
// opzionale). Tiene solo le righe con un nome; ore via numIt (≥0); stato tra
// operativo|fermo|verifica (default operativo, così un valore sbagliato non
// rompe il badge). nome/area sono testo grezzo → escapare dove mostrati. Pura
// e testabile.
export function parseMezziCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, area, ore, stato] = parseCsvLine(r);
      const s = (stato || "").trim().toLowerCase();
      const n = numIt(ore);
      return {
        nome: (nome || "").trim(),
        area: (area || "").trim(),
        ore: Number.isFinite(n) ? Math.max(0, n) : 0,
        stato: ["operativo", "fermo", "verifica"].includes(s) ? s : "operativo",
      };
    })
    .filter(m => m.nome);
}

// Nuova giacenza dopo uno scarico di `qta` pezzi: mai sotto zero. Serve sia
// al pulsante scarico sia agli ordini di lavoro (manutenzione eseguita che
// consuma un ricambio). Pura e testabile.
export function scaricoGiacenza(giacenza, qta = 1) {
  return Math.max(0, (+giacenza || 0) - (+qta || 0));
}

// Ricambi SOTTO SCORTA: giacenza ≤ soglia minima. Sono quelli da
// riordinare per non fermare un mezzo in attesa del pezzo (il 34% dei
// ritardi di riparazione nasce dai ricambi mancanti). Ordinati per gravità
// (prima i più sotto scorta). Funzione pura e testabile.
export function sottoScorta(ricambi) {
  return (ricambi || [])
    .filter(r => (+r.giacenza || 0) <= (+r.sogliaMin || 0))
    .map(r => ({ ...r, mancano: Math.max(0, (+r.sogliaMin || 0) - (+r.giacenza || 0)) }))
    .sort((a, b) => (a.giacenza - a.sogliaMin) - (b.giacenza - b.sogliaMin));
}

export function urgenza(dataISO, oggi = new Date()) {
  if (!dataISO) return { cls: "ok", label: "a ore", giorni: 9999 };   // manutenzione a ore motore, non a data
  const g = giorniTra(dataISO, oggi);
  if (g < 0) return { cls: "danger", label: "Scaduta", giorni: g };
  if (g <= 30) return { cls: "warn", label: g + " gg", giorni: g };
  return { cls: "ok", label: g + " gg", giorni: g };
}

// Urgenza di un tagliando "a ore motore": confronta le ore previste con
// quelle attuali del mezzo. mancano ≤0 = scaduta (danger), ≤50 = warn,
// oltre = ok. Funzione pura e testabile — decide quali manutenzioni a ore
// segnalare al gestore del parco.
export function urgenzaOre(orePreviste, oreAttuali) {
  const mancano = orePreviste - (oreAttuali || 0);
  if (mancano <= 0) return { cls: "danger", label: "SCADUTA (+" + (-mancano) + " h)", mancano };
  if (mancano <= 50) return { cls: "warn", label: "tra " + mancano + " h", mancano };
  return { cls: "ok", label: "tra " + mancano + " h", mancano };
}

// Previsione "leggera": da quante ore mancano a un tagliando e dal ritmo
// d'uso (ore/giorno) stima tra quanti GIORNI andrà fatto — così un
// tagliando "a ore motore" diventa una data prevedibile. Ritorna 0 se già
// scaduto, null se il ritmo non è noto (non si può stimare).
export function previsioneGiorni(mancanoOre, oreGiorno) {
  const rate = +oreGiorno || 0;
  if (mancanoOre <= 0) return 0;
  if (rate <= 0) return null;
  return Math.ceil(mancanoOre / rate);
}

// Disponibilità della flotta: % di mezzi operativi sul totale. È il KPI
// "di testa" per un parco di cava (world-class ~92-94% per i camion).
// Ritorna { pct, operativi, totale }; pct null se non ci sono mezzi.
export function disponibilitaFlotta(mezzi) {
  const totale = (mezzi || []).length;
  const operativi = (mezzi || []).filter(m => m.stato === "operativo").length;
  return { pct: totale ? Math.round(100 * operativi / totale) : null, operativi, totale };
}

// PRIORITÀ OPERATIVE del giorno: un'unica lista ordinata di "cose da fare" per
// il gestore del parco, che unisce in un colpo solo (1) le manutenzioni urgenti
// — sia a data sia a ore motore, confrontando le ore previste col contatore del
// mezzo —, (2) i ricambi sotto scorta (che il riepilogo di dashboard prima non
// mostrava: un pezzo a zero è una criticità vera) e (3) i mezzi fermi o in
// verifica. Ogni voce: { gravita ("danger"=subito/scaduto, "warn"=in arrivo),
// categoria, titolo, dettaglio, badge }. Ordina prima le danger. I campi
// titolo/dettaglio sono testo grezzo (nome mezzo/ricambio): vanno escapati dove
// mostrati. Pura e testabile. Il mezzo di una manutenzione "a ore" si abbina
// per prefisso del nome (stessa convenzione dell'app).
// Dal 27/07 include anche (0) le SCADENZE DI LEGGE scadute o in scadenza,
// che vengono prima di tutto il resto: un mezzo non verificato va fermato.
// I parametri `scadenze` e `preavvisoGiorni` sono facoltativi (chi non li
// passa ha esattamente il comportamento di prima).
export function prioritaOperative(mezzi, manutenzioni, ricambi, oggi = new Date(), scadenze = [], preavvisoGiorni = 30) {
  const items = [];
  for (const s of scadenze || []) {
    const sem = statoScadenzaMezzo(s.dataScadenza, oggi, preavvisoGiorni);
    if (sem.stato === "a-posto") continue;
    items.push({ gravita: sem.stato === "scaduta" ? "danger" : "warn", categoria: "scadenza",
      titolo: (s.tipo || "Scadenza di legge") + " — " + (s.mezzo || "?"),
      dettaglio: "scadenza di legge" + (s.dataScadenza ? " del " + String(s.dataScadenza).split("-").reverse().join("/") : ""),
      badge: sem.label });
  }
  const oreDi = (nomeMezzo) => {
    const m = (mezzi || []).find(x => String(x.nome || "").split(" — ")[0] === nomeMezzo);
    return m ? (+m.ore || 0) : null;
  };
  for (const n of manutenzioni || []) {
    let u, dettaglio;
    if (n.orePreviste) {
      const ore = oreDi(n.mezzo);
      if (ore == null) continue;                 // mezzo non trovato: non calcolabile
      u = urgenzaOre(n.orePreviste, ore);
      dettaglio = "a " + n.orePreviste + " h motore";
    } else if (n.dataPrevista) {
      u = urgenza(n.dataPrevista, oggi);
      dettaglio = "previsto " + String(n.dataPrevista).split("-").reverse().join("/");
    } else continue;
    if (u.cls !== "danger" && u.cls !== "warn") continue;
    items.push({ gravita: u.cls, categoria: "manutenzione",
      // da dove nasce: una segnalazione del giro macchina non è un tagliando
      // programmato, e chi guarda il Quadro deve poterlo vedere subito
      origine: n.origine || null,
      titolo: (n.titolo || "Manutenzione") + " — " + (n.mezzo || "?"),
      dettaglio, badge: u.label });
  }
  for (const r of sottoScorta(ricambi)) {
    const zero = (+r.giacenza || 0) <= 0;
    items.push({ gravita: zero ? "danger" : "warn", categoria: "ricambio",
      titolo: r.nome || "Ricambio",
      dettaglio: "giacenza " + (+r.giacenza || 0) + " / min " + (+r.sogliaMin || 0),
      badge: zero ? "Esaurito" : "Sotto scorta" });
  }
  for (const m of mezzi || []) {
    if ((m.stato || "operativo") === "operativo") continue;
    items.push({ gravita: m.stato === "fermo" ? "danger" : "warn", categoria: "mezzo",
      titolo: m.nome || "Mezzo", dettaglio: m.area || "—",
      badge: m.stato === "fermo" ? "Fermo" : "In verifica" });
  }
  const rank = { danger: 0, warn: 1 };
  const catRank = { scadenza: 0, manutenzione: 1, ricambio: 2, mezzo: 3 };
  return items.sort((a, b) =>
    (rank[a.gravita] - rank[b.gravita]) ||
    (catRank[a.categoria] - catRank[b.categoria]) ||
    String(a.titolo).localeCompare(String(b.titolo), "it"));
}

// Ripartizione dei costi per VOCE: accorpa i costi con lo stesso nome e ne dà
// l'incidenza % sul totale, dal più pesante. Serve a vedere a colpo d'occhio
// dove va la spesa della flotta (carburante vs ricambi vs noleggi…). Le voci a
// importo ≤ 0 sono ignorate. Pura e testabile.
export function ripartizioneCosti(costi) {
  const per = {};
  let totale = 0;
  for (const c of costi || []) {
    const imp = +c.importo || 0;
    if (imp <= 0) continue;
    const v = ((c.voce || "").trim()) || "Altro";
    per[v] = (per[v] || 0) + imp;
    totale += imp;
  }
  return {
    totale,
    voci: Object.entries(per)
      .map(([voce, importo]) => ({ voce, importo, pct: totale ? Math.round(100 * importo / totale) : 0 }))
      .sort((a, b) => b.importo - a.importo || a.voce.localeCompare(b.voce, "it")),
  };
}

// Etichetta breve di un mese «aaaa-mm» → «lug 2026». Pura e testabile.
const MESI_IT = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
export function etichettaMese(ym) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(ym || ""));
  if (!m) return "—";
  const i = +m[2] - 1;
  return (MESI_IT[i] || "?") + " " + m[1];
}

// COSTI MESE PER MESE: raggruppa le voci di costo per mese di competenza
// (campo `data`). Regole di onestà, non di gusto:
//  · le voci SENZA data non vengono attribuite a nessun mese — restano
//    contate a parte (`senzaData`), così l'utente sa che esistono e che non
//    entrano nell'andamento. Attribuirle a «oggi» sarebbe inventare;
//  · i mesi senza NESSUNA voce registrata NON compaiono nell'elenco: un mese
//    senza registrazioni non è un mese a zero euro, è un mese di cui non si
//    sa niente. Quanti sono lo dice `mancanti`, per poterlo scrivere;
//  · le voci a importo ≤ 0 non entrano nei totali (come ripartizioneCosti).
// Ritorna { mesi:[{ ym, etichetta, importo, voci }], totale, senzaData:{voci,
// importo}, mancanti }. Pura e testabile.
export function costiPerMese(costi) {
  const per = new Map();
  let totale = 0, sdVoci = 0, sdImporto = 0;
  for (const c of costi || []) {
    const imp = +c.importo || 0;
    const iso = String(c.data || "").slice(0, 10);
    const valida = /^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(Date.parse(iso + "T00:00:00"));
    if (!valida) { sdVoci++; if (imp > 0) sdImporto += imp; continue; }
    if (imp <= 0) continue;
    const ym = iso.slice(0, 7);
    const r = per.get(ym) || { ym, etichetta: etichettaMese(ym), importo: 0, voci: 0 };
    r.importo += imp; r.voci++;
    per.set(ym, r);
    totale += imp;
  }
  const mesi = [...per.values()].sort((a, b) => a.ym.localeCompare(b.ym));
  let mancanti = 0;
  if (mesi.length >= 2) {
    const [a1, m1] = mesi[0].ym.split("-").map(Number);
    const [a2, m2] = mesi[mesi.length - 1].ym.split("-").map(Number);
    mancanti = (a2 * 12 + m2) - (a1 * 12 + m1) + 1 - mesi.length;
  }
  return { mesi, totale, senzaData: { voci: sdVoci, importo: sdImporto }, mancanti };
}

// FOTOGRAFIA DEL PARCO DA REGISTRARE OGGI, se serve. L'app la chiama a ogni
// apertura e dopo ogni cambio di stato di un mezzo; questa funzione decide da
// sola se scrivere, così la riga resta UNA SOLA al giorno:
//  · parco vuoto → niente (non c'è niente da fotografare);
//  · nessuna riga di oggi → si aggiunge;
//  · riga di oggi già uguale → non si tocca niente;
//  · riga di oggi diversa (un mezzo è stato fermato) → si aggiorna: la
//    fotografia del giorno è l'ultima situazione nota di quel giorno.
// Ritorna null oppure { azione:"aggiungi"|"aggiorna", id?, dati }. Pura.
export function fotografiaDaRegistrare(registrazioni, mezzi, iso) {
  const giorno = String(iso || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(giorno)) return null;
  const d = disponibilitaFlotta(mezzi);
  if (!d.totale) return null;
  const dati = { data: giorno, operativi: d.operativi, totale: d.totale };
  const gia = (registrazioni || []).filter(r => String(r.data || "").slice(0, 10) === giorno).pop();
  if (!gia) return { azione: "aggiungi", dati };
  if ((+gia.operativi || 0) === dati.operativi && (+gia.totale || 0) === dati.totale) return null;
  return { azione: "aggiorna", id: gia.id, dati };
}

// STORICO DELLA DISPONIBILITÀ negli ultimi `giorni` giorni: una riga per ogni
// giorno REGISTRATO, in ordine di tempo. Niente riempimenti: i giorni senza
// registrazione semplicemente non ci sono, e `giorniSenza` dice quanti sono
// perché lo si possa scrivere accanto al grafico. Se dello stesso giorno ci
// fossero più righe (dati vecchi o due dispositivi) vale l'ultima.
// Ritorna { punti:[{ data, operativi, totale, pct }], finestra, giorniSenza }.
// Pura e testabile: `oggi` iniettabile.
export function disponibilitaStorico(registrazioni, giorni = 30, oggi = new Date()) {
  const finestra = Math.max(1, Math.round(+giorni || 30));
  const fine = oggiIso(oggi);
  const inizio = oggiIso(new Date(new Date(fine + "T12:00:00").getTime() - (finestra - 1) * 86400000));
  const per = new Map();
  for (const r of registrazioni || []) {
    const g = String(r.data || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(g) || g < inizio || g > fine) continue;
    const totale = Math.round(+r.totale || 0);
    const operativi = Math.round(+r.operativi || 0);
    if (totale <= 0 || operativi < 0 || operativi > totale) continue;   // riga incoerente: si scarta, non si aggiusta
    per.set(g, { data: g, operativi, totale, pct: Math.round(100 * operativi / totale) });
  }
  const punti = [...per.values()].sort((a, b) => a.data.localeCompare(b.data));
  return { punti, finestra, giorniSenza: Math.max(0, finestra - punti.length) };
}

// COSTO DI OFFICINA PER MEZZO: somma il costo degli interventi chiusi (ordini
// di lavoro) mezzo per mezzo, dal più caro al meno caro. Risponde alla domanda
// che porta alla decisione più cara che un titolare prenda — «quale macchina mi
// sta mangiando i soldi, la riparo ancora o la sostituisco?». Gli interventi a
// costo ≤ 0 (o senza costo) non entrano: la manodopera interna non è una spesa
// di officina. Ritorna anche il numero di interventi per mezzo, perché
// «3.000 € in un colpo» e «3.000 € in dieci volte» sono due storie diverse.
// Funzione pura e testabile.
export function costoOfficinaPerMezzo(interventi) {
  const per = {};
  let totale = 0;
  for (const w of interventi || []) {
    const c = +w.costo || 0;
    if (c <= 0) continue;
    const m = ((w.mezzo || "").trim()) || "Senza mezzo";
    if (!per[m]) per[m] = { mezzo: m, costo: 0, interventi: 0 };
    per[m].costo += c;
    per[m].interventi++;
    totale += c;
  }
  return {
    totale,
    mezzi: Object.values(per)
      .map(v => ({ ...v, pct: totale ? Math.round(100 * v.costo / totale) : 0 }))
      .sort((a, b) => b.costo - a.costo || a.mezzo.localeCompare(b.mezzo, "it")),
  };
}

// ============================================================
// L2 — GIRO MACCHINA (controllo pre-uso)
// Il controllo che l'operatore fa PRIMA di salire in macchina, a inizio
// turno. È la funzione che porta in Flotta chi guida, non solo chi sta in
// ufficio, e serve a intercettare il guasto finché è ancora una goccia
// d'olio per terra e non una macchina ferma in mezzo al fronte.
// Due regole che decidono tutto il disegno:
//  · dev'essere VELOCE e usabile coi guanti: la strada corta è «tutto a
//    posto» + le poche voci che non vanno, non venti tocchi in fila;
//  · una voce «non va» NON resta una spunta rossa in un archivio: diventa
//    una manutenzione collegata al mezzo, che compare nelle priorità del
//    Quadro. Altrimenti il giro macchina è carta digitale.
// ============================================================

// Il nome corto del mezzo («Escavatore E1»), che è la chiave con cui tutta
// l'app collega manutenzioni, scadenze, interventi e controlli. Il nome
// lungo («Escavatore E1 — CAT 352») serve solo a leggere.
export function nomeBreve(nome) {
  return String(nome || "").split(" — ")[0].trim();
}

// TIPI DI MEZZO: servono a proporre la checklist giusta. `indizi` sono le
// parole con cui si INDOVINA il tipo dal nome quando il mezzo è stato
// registrato prima che il campo esistesse: indovinare la checklist è
// innocuo (l'operatore vede le voci e le riconosce), scrivere un dato
// indovinato nell'anagrafica non lo sarebbe.
export const TIPI_MEZZO = [
  { chiave: "escavatore",   etichetta: "Escavatore",          indizi: ["escavat", "miniescav", "ragno"] },
  { chiave: "pala",         etichetta: "Pala caricatrice",    indizi: ["pala", "caricat", "terna"] },
  { chiave: "dumper",       etichetta: "Dumper / camion",     indizi: ["dumper", "camion", "autocarr", "ribaltab"] },
  { chiave: "perforatrice", etichetta: "Perforatrice",        indizi: ["perforat", "sonda", "fioretto"] },
  { chiave: "impianto",     etichetta: "Frantoio / impianto", indizi: ["frantoi", "vaglio", "impiant", "nastro", "mulino"] },
  { chiave: "sollevamento", etichetta: "Gru / sollevamento",  indizi: ["gru", "autogru", "piattaform", "sollevat", "muletto", "carrell"] },
  { chiave: "altro",        etichetta: "Altro mezzo",         indizi: [] },
];

export function tipoMezzo(chiave) {
  return TIPI_MEZZO.find(t => t.chiave === chiave) || null;
}

// Tipo di un mezzo: quello salvato se c'è, altrimenti indovinato dal nome,
// altrimenti «altro». Ritorna sempre una voce di TIPI_MEZZO. Pura.
export function tipoMezzoDi(mezzo) {
  const salvato = tipoMezzo((mezzo && mezzo.tipo) || "");
  if (salvato) return salvato;
  const n = String((mezzo && mezzo.nome) || "").toLowerCase();
  for (const t of TIPI_MEZZO) if (t.indizi.some(i => n.includes(i))) return t;
  return tipoMezzo("altro");
}

// Le voci del giro macchina. Le prime sette valgono per qualunque mezzo, le
// altre cambiano col tipo. `critica: true` = voce di sicurezza: se non va,
// la macchina non deve lavorare finché non è sistemata, e l'app lo propone
// invece di limitarsi a segnarlo.
const VOCI_COMUNI = [
  { chiave: "livelli",    etichetta: "Livelli: olio motore, refrigerante, gasolio", aiuto: "Guarda le astine e le spie: niente sotto il minimo." },
  { chiave: "perdite",    etichetta: "Perdite sotto la macchina", aiuto: "Macchie fresche a terra: olio, gasolio, refrigerante." },
  { chiave: "freni",      etichetta: "Freni, sterzo e comandi", aiuto: "Prova freno di servizio e di stazionamento prima di muoverti.", critica: true },
  { chiave: "luci",       etichetta: "Luci, faro rotante e avvisatore acustico", aiuto: "Compreso l'avvisatore di retromarcia." },
  { chiave: "cabina",     etichetta: "Cabina: cintura, sedile, specchi, vetri", aiuto: "Se non vedi e non sei allacciato, il resto non conta." },
  { chiave: "sicurezza",  etichetta: "Estintore, primo soccorso, cunei", aiuto: "A bordo, carichi e a portata di mano.", critica: true },
  { chiave: "protezioni", etichetta: "Carter e protezioni al loro posto", aiuto: "Nessun riparo smontato o lasciato aperto.", critica: true },
];

const VOCI_PER_TIPO = {
  escavatore: [
    { chiave: "sottocarro", etichetta: "Cingoli e sottocarro: tensione e usura", aiuto: "Rulli, catena, pattini: niente giochi anomali." },
    { chiave: "idraulico",  etichetta: "Tubi e cilindri idraulici: trafilamenti", aiuto: "Un tubo che suda oggi è un tubo che scoppia domani." },
    { chiave: "benna",      etichetta: "Denti benna e attacco rapido", aiuto: "Attacco rapido agganciato e sicura inserita.", critica: true },
    { chiave: "rotazione",  etichetta: "Rotazione torretta: gioco e rumori", aiuto: "Fai un giro lento e ascolta." },
  ],
  pala: [
    { chiave: "gomme",        etichetta: "Pneumatici: pressione, tagli, serraggio ruote", aiuto: "Controlla anche i bulloni ruota.", critica: true },
    { chiave: "taglienti",    etichetta: "Benna, taglienti e perni", aiuto: "Perni ingrassati e spine al loro posto." },
    { chiave: "articolazione", etichetta: "Articolazione centrale e blocco di sicurezza", aiuto: "Il blocco va inserito quando lavori vicino allo snodo.", critica: true },
  ],
  dumper: [
    { chiave: "gomme",   etichetta: "Pneumatici: pressione, tagli, serraggio ruote", aiuto: "Controlla anche i bulloni ruota.", critica: true },
    { chiave: "cassone", etichetta: "Cassone, perni e sicura di ribaltamento", aiuto: "Sicura del cassone alzato: si usa sempre, anche per due minuti.", critica: true },
    { chiave: "aria",    etichetta: "Impianto aria: pressione e scarico condensa", aiuto: "Aspetta la pressione di esercizio prima di partire." },
  ],
  perforatrice: [
    { chiave: "martello",     etichetta: "Martello, aste e manicotti", aiuto: "Filetti puliti e ingrassati, niente aste piegate." },
    { chiave: "aria",         etichetta: "Tubi aria: fascette e cavetti di sicurezza", aiuto: "Ogni giunto va assicurato: un tubo che si stacca frusta.", critica: true },
    { chiave: "polveri",      etichetta: "Abbattimento polveri: acqua o aspirazione", aiuto: "Senza abbattimento non si perfora: è silice.", critica: true },
    { chiave: "stabilizzatori", etichetta: "Stabilizzatori e livella", aiuto: "Appoggio pieno su terreno stabile.", critica: true },
  ],
  impianto: [
    { chiave: "nastri",     etichetta: "Nastri, rulli e raschiatori", aiuto: "Niente strisciamenti né materiale incastrato." },
    { chiave: "emergenze",  etichetta: "Funghi di emergenza e cavo a strappo", aiuto: "Provali: sono l'unica cosa che ferma il nastro con te sopra.", critica: true },
    { chiave: "ripari",     etichetta: "Griglie, ripari e passerelle", aiuto: "Nessun riparo tolto per «fare prima».", critica: true },
    { chiave: "bulloneria", etichetta: "Bulloneria e ancoraggi", aiuto: "Vibrazione continua: i bulloni si allentano." },
  ],
  sollevamento: [
    { chiave: "funi",         etichetta: "Funi, catene e ganci: usura e sicura", aiuto: "Fili rotti, deformazioni, sicura del gancio funzionante.", critica: true },
    { chiave: "stabilizzatori", etichetta: "Stabilizzatori e piani d'appoggio", aiuto: "Piastre sotto i piedi, terreno che regge.", critica: true },
    { chiave: "finecorsa",    etichetta: "Fine corsa e limitatore di carico", aiuto: "Provali a vuoto prima di iniziare.", critica: true },
    { chiave: "targhe",       etichetta: "Targa di portata e libretto a bordo", aiuto: "Il diagramma di carico deve essere leggibile." },
  ],
  altro: [],
};

// La checklist di un tipo di mezzo: voci comuni + voci del tipo. Ritorna
// sempre un elenco nuovo (chi lo riceve lo può modificare). Pura.
export function checklistPreUso(chiaveTipo) {
  const extra = VOCI_PER_TIPO[chiaveTipo] || VOCI_PER_TIPO.altro;
  return [...VOCI_COMUNI, ...extra].map(v => ({
    chiave: v.chiave, etichetta: v.etichetta, aiuto: v.aiuto || "", critica: !!v.critica,
  }));
}

// Come sta andando il giro: quante voci sono a posto, quante no, quante
// non hanno ancora risposta. Un giro con voci senza risposta NON si salva:
// un controllo in cui non hai guardato non è un controllo. Pura.
export function riepilogoControllo(voci) {
  const lista = voci || [];
  const ok = lista.filter(v => v.esito === "ok");
  const no = lista.filter(v => v.esito === "no");
  const mancanti = lista.filter(v => v.esito !== "ok" && v.esito !== "no");
  const critiche = no.filter(v => v.critica);
  return {
    totali: lista.length, ok: ok.length, no: no.length, mancanti: mancanti.length,
    anomalie: no, critiche, primaMancante: mancanti.length ? mancanti[0].chiave : null,
    completo: lista.length > 0 && mancanti.length === 0,
    gravita: critiche.length ? "danger" : no.length ? "warn" : "ok",
  };
}

// Da un giro macchina alle MANUTENZIONI da aprire: una per ogni voce «non
// va». Nascono con la data di oggi (vanno guardate subito) e portano scritto
// da dove vengono, così nel registro si capisce che è stato l'operatore a
// trovarle. Stesso schema delle manutenzioni scritte a mano: nessun campo
// nuovo obbligatorio. Pura e testabile.
export function manutenzioniDaControllo(controllo, oggi = new Date()) {
  const c = controllo || {};
  const data = oggiIso(oggi);
  return (c.voci || []).filter(v => v.esito === "no").map(v => ({
    titolo: "Giro macchina: " + v.etichetta,
    mezzo: c.mezzo || "",
    dataPrevista: c.data || data,
    orePreviste: null,
    ricambioId: null,
    origine: "controllo",
    nota: (v.nota || "").trim() || (v.critica ? "voce di sicurezza segnata «non va» al controllo pre-uso" : "segnalata al controllo pre-uso"),
  }));
}

// COPERTURA DEI GIRI DI OGGI: quanti mezzi hanno già il loro controllo
// pre-uso oggi e quali no. Serve alla riga del Quadro, che è quello che
// spinge a farlo. Pura e testabile.
export function coperturaControlli(controlli, mezzi, iso) {
  const giorno = String(iso || "").slice(0, 10);
  const fatti = new Set();
  let conAnomalie = 0;
  for (const c of controlli || []) {
    if (String(c.data || "").slice(0, 10) !== giorno) continue;
    const nome = nomeBreve(c.mezzo);
    if (!nome) continue;
    if (!fatti.has(nome) && (+c.anomalie || 0) > 0) conAnomalie++;
    fatti.add(nome);
  }
  const tutti = (mezzi || []).map(m => nomeBreve(m.nome)).filter(Boolean);
  const mancanti = tutti.filter(n => !fatti.has(n));
  return { totale: tutti.length, fatti: tutti.length - mancanti.length, mancanti, conAnomalie };
}

// I giri di un mezzo, dal più recente. Pura.
export function controlliDelMezzo(controlli, nome) {
  const n = nomeBreve(nome);
  return (controlli || []).filter(c => nomeBreve(c.mezzo) === n)
    .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
}

// ============================================================
// L3 — PIANI DI MANUTENZIONE RICORRENTI
// Un tagliando non è un appuntamento singolo: è un ritmo. Chiuso il 500 h,
// il prossimo 500 h esiste già — e finora andava riscritto a mano, che è
// esattamente il modo in cui si dimentica. Da qui in poi la manutenzione
// può portare con sé il suo passo (`ogniOre` per i tagliandi a ore motore,
// `ogniMesi` per quelli a calendario) e alla chiusura l'app pianifica da
// sola il successivo. Chi non mette il passo ha il comportamento di prima.
// ============================================================
export const PIANI_TAGLIANDO = [
  { chiave: "250",  etichetta: "Tagliando 250 h",  ogniOre: 250,
    nota: "Olio motore e filtri: il tagliando che torna più spesso." },
  { chiave: "500",  etichetta: "Tagliando 500 h",  ogniOre: 500,
    nota: "Filtro aria, gioco valvole, controlli generali." },
  { chiave: "1000", etichetta: "Tagliando 1000 h", ogniOre: 1000,
    nota: "Olio trasmissione e impianto idraulico." },
  { chiave: "2000", etichetta: "Tagliando 2000 h", ogniOre: 2000,
    nota: "Revisione di pompe e organi principali." },
];

export function pianoTagliando(chiave) {
  return PIANI_TAGLIANDO.find(p => p.chiave === String(chiave)) || null;
}

// IL PROSSIMO TAGLIANDO, calcolato alla chiusura di quello appena fatto.
// Due modi, mai insieme:
//  · a ORE: si riparte dalle ore che il mezzo ha ADESSO (non da quelle
//    previste): se il tagliando dei 6000 h è stato fatto a 6040, il
//    prossimo cade a 6040+500, che è la verità del contatore;
//  · a CALENDARIO: dalla data in cui è stato fatto, più i mesi del passo.
// Ritorna null se la manutenzione non ha un passo (comportamento di prima)
// o se manca il dato per calcolare. Pura e testabile.
export function prossimoTagliando(man, oreAttuali, dataChiusura) {
  const m = man || {};
  const ogniOre = Math.round(+m.ogniOre || 0);
  const ogniMesi = Math.round(+m.ogniMesi || 0);
  const base = {
    titolo: m.titolo || "Tagliando",
    mezzo: m.mezzo || "",
    ricambioId: m.ricambioId || null,
    ogniOre: ogniOre > 0 ? ogniOre : null,
    ogniMesi: ogniMesi > 0 ? ogniMesi : null,
    piano: m.piano || null,
    origine: "piano",
    nota: m.nota || null,
  };
  if (ogniOre > 0) {
    const ore = Math.round(+oreAttuali);
    if (!Number.isFinite(ore) || ore < 0) return null;
    return { ...base, orePreviste: ore + ogniOre, dataPrevista: null, da: "ore", oreBase: ore };
  }
  if (ogniMesi > 0) {
    const data = aggiungiMesi(dataChiusura, ogniMesi);
    if (!data) return null;
    return { ...base, orePreviste: null, dataPrevista: data, da: "mesi" };
  }
  return null;
}

// ============================================================
// L4 — CARBURANTE PER MEZZO
// Il gasolio è la voce di spesa più grossa di una flotta, e un consumo che
// sale è spesso il primo sintomo di un guasto. Fin qui in Flotta era un
// costo unico e anonimo: adesso ogni pieno sa a quale macchina è andato.
// Come si calcolano davvero i litri/ora (e perché non si può fare in altro
// modo): il primo pieno registrato serve SOLO a fissare il punto di
// partenza — il gasolio che c'era dentro è stato bruciato prima, in ore che
// non abbiamo. Si sommano quindi i pieni DAL SECONDO IN POI e si dividono
// per le ore passate fra il primo e l'ultimo. Con un solo rifornimento il
// consumo non esiste, e l'app lo dice invece di stampare un numero.
// ============================================================

// Controlli su un rifornimento prima di salvarlo. `oreMezzo` (facoltativo) è
// il contatore attuale del mezzo: il contatore non torna indietro, quindi un
// valore più basso è quasi sempre un errore di battitura.
// Ritorna { ok, errori:{campo:messaggio}, litri, euro, ore }. Pura.
export function validaRifornimento(dati, oreMezzo) {
  const d = dati || {}, errori = {};
  if (!String(d.mezzo || "").trim()) errori.mezzo = "Scegli il mezzo che hai rifornito.";
  const litri = +String(d.litri == null ? "" : d.litri).replace(",", ".");
  if (!(litri > 0)) errori.litri = "Scrivi quanti litri hai messo (un numero maggiore di zero).";
  else if (litri > 20000) errori.litri = "Più di 20.000 litri in un rifornimento: controlla il numero.";
  const euroTx = String(d.euro == null ? "" : d.euro).trim();
  let euro = 0;
  if (euroTx !== "") {
    euro = +euroTx.replace(",", ".");
    if (!(euro >= 0)) errori.euro = "La spesa dev'essere un numero da zero in su (lascia vuoto se non la sai).";
  }
  const oreTx = String(d.ore == null ? "" : d.ore).trim();
  let ore = null;
  if (oreTx !== "") {
    const n = Math.round(+oreTx);
    if (!Number.isFinite(n) || n < 0) errori.ore = "Il contatore va scritto in ore, un numero da zero in su.";
    else if (Number.isFinite(+oreMezzo) && n + 0.5 < +oreMezzo) errori.ore = "Il contatore segna meno delle " + Math.round(+oreMezzo) + " ore già registrate sul mezzo: controlla il numero.";
    else ore = n;
  }
  const iso = String(d.data || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) errori.data = "Serve il giorno del rifornimento.";
  return {
    ok: Object.keys(errori).length === 0, errori,
    litri: Number.isFinite(litri) ? Math.round(litri * 100) / 100 : 0,
    euro: Number.isFinite(euro) ? Math.round(euro * 100) / 100 : 0,
    ore,
  };
}

// CONSUMO PER MEZZO: litri/ora ed euro/ora, più i totali di gasolio. Il
// metodo è quello descritto sopra (si scarta il primo pieno). Ritorna anche
// perché un mezzo non ha il consumo (`perche`), così l'app può dirlo invece
// di lasciare una riga vuota. Pura e testabile.
export function consumoPerMezzo(rifornimenti) {
  const per = new Map();
  let totaleLitri = 0, totaleEuro = 0;
  for (const r of rifornimenti || []) {
    const mezzo = nomeBreve(r.mezzo);
    const litri = +r.litri || 0;
    if (!mezzo || litri <= 0) continue;
    const euro = +r.euro || 0;
    const oreN = Math.round(+r.ore);
    const v = per.get(mezzo) || { mezzo, pieni: [], litri: 0, euro: 0 };
    v.pieni.push({ data: String(r.data || "").slice(0, 10), litri, euro, ore: Number.isFinite(oreN) && oreN > 0 ? oreN : null });
    v.litri += litri; v.euro += euro;
    per.set(mezzo, v);
    totaleLitri += litri; totaleEuro += euro;
  }
  const mezzi = [...per.values()].map(v => {
    const conOre = v.pieni.filter(p => p.ore != null).sort((a, b) => a.ore - b.ore);
    let litriOra = null, euroOra = null, oreCoperte = null, perche = "";
    if (conOre.length < 2) {
      perche = conOre.length === 1
        ? "serve almeno un secondo rifornimento con il contatore delle ore"
        : "nessun rifornimento porta il contatore delle ore";
    } else {
      oreCoperte = conOre[conOre.length - 1].ore - conOre[0].ore;
      if (oreCoperte > 0) {
        const dopoIlPrimo = conOre.slice(1);
        const l = dopoIlPrimo.reduce((t, p) => t + p.litri, 0);
        const e = dopoIlPrimo.reduce((t, p) => t + p.euro, 0);
        litriOra = Math.round(100 * l / oreCoperte) / 100;
        euroOra = e > 0 ? Math.round(100 * e / oreCoperte) / 100 : null;
      } else {
        oreCoperte = null;
        perche = "fra i rifornimenti il contatore non è cambiato";
      }
    }
    return {
      mezzo: v.mezzo, pieni: v.pieni.length, litri: Math.round(v.litri * 10) / 10,
      euro: Math.round(v.euro * 100) / 100,
      euroLitro: v.litri > 0 && v.euro > 0 ? Math.round(1000 * v.euro / v.litri) / 1000 : null,
      oreCoperte, litriOra, euroOra, perche,
    };
  }).sort((a, b) => (b.litriOra == null ? -1 : b.litriOra) - (a.litriOra == null ? -1 : a.litriOra)
    || a.mezzo.localeCompare(b.mezzo, "it"));
  return {
    mezzi, totaleLitri: Math.round(totaleLitri * 10) / 10,
    totaleEuro: Math.round(totaleEuro * 100) / 100,
    calcolabili: mezzi.filter(m => m.litriOra != null).length,
  };
}

// ============================================================
// L1 — FASCICOLO DEL MEZZO
// Tutto quello che l'app sa di UNA macchina, raccolto in un posto solo:
// finora era sparso su quattro schermate e per rispondere a un ispettore o
// a un compratore bisognava girare l'app. Non aggiunge nessun dato: mette
// insieme quelli che ci sono già. Pura e testabile.
// ============================================================
export function fascicoloMezzo(mezzo, dati, oggi = new Date(), preavvisoGiorni = 30) {
  const m = mezzo || {};
  const nome = nomeBreve(m.nome);
  const d = dati || {};
  const mio = (v) => nomeBreve(v && v.mezzo) === nome;
  const manutenzioni = (d.manutenzioni || []).filter(mio)
    .sort((a, b) => String(a.dataPrevista || "9999").localeCompare(String(b.dataPrevista || "9999")));
  const interventi = (d.interventi || []).filter(mio)
    .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
  const scadenze = scadenzeOrdinate((d.scadenze || []).filter(mio), oggi, preavvisoGiorni);
  const controlli = controlliDelMezzo(d.controlli || [], nome);
  const rifornimenti = (d.rifornimenti || []).filter(mio)
    .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
  const consumo = consumoPerMezzo(rifornimenti).mezzi[0] || null;
  const officina = interventi.reduce((t, w) => t + (+w.costo || 0), 0);
  return {
    mezzo: m, nome, tipo: tipoMezzoDi(m),
    manutenzioni, interventi, scadenze, controlli, rifornimenti, consumo,
    officina: { totale: Math.round(officina * 100) / 100, interventi: interventi.length },
    carburante: { totale: consumo ? consumo.euro : 0, litri: consumo ? consumo.litri : 0 },
    speso: Math.round((officina + (consumo ? consumo.euro : 0)) * 100) / 100,
    ultimoControllo: controlli[0] || null,
    ultimoIntervento: interventi[0] || null,
  };
}

export function kpiFrom(mezzi, manutenzioni, costi) {
  return {
    operativi: mezzi.filter(m => m.stato === "operativo").length,
    inManutenzione: mezzi.filter(m => m.stato !== "operativo").length,
    tagliandi30: manutenzioni.filter(n => { const g = urgenza(n.dataPrevista).giorni; return g <= 30; }).length,
    carburante: costi.filter(c => /carburante/i.test(c.voce)).reduce((t, c) => t + (+c.importo || 0), 0),
  };
}

export async function flottaData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "flotta" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        mezzi: () => read("mezzi"), manutenzioni: () => read("manutenzioni"), costi: () => read("costi"), ricambi: () => read("ricambi"), interventi: () => read("interventi"), scadenze: () => read("scadenze"), disponibilita: () => read("disponibilita"), controlli: () => read("controlli"), rifornimenti: () => read("rifornimenti"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), d),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      mezzi: async () => mem.mezzi, manutenzioni: async () => mem.manutenzioni, costi: async () => mem.costi, ricambi: async () => mem.ricambi, interventi: async () => mem.interventi, scadenze: async () => mem.scadenze, disponibilita: async () => mem.disponibilita || [], controlli: async () => mem.controlli || [], rifornimenti: async () => mem.rifornimenti || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
