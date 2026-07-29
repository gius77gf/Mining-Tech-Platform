// ============================================================
// Flotta — accesso dati (C3). Schema condiviso: Firestore via SDK
// Deepwork ID (orgCollection) da autenticati, demo in memoria
// altrimenti. Collezioni (sotto organizations/{org}/apps/flotta/):
//   mezzi/{id}:        { nome, ore, area, stato: operativo|fermo|verifica }
//   manutenzioni/{id}: { titolo, mezzo, dataPrevista (ISO) }
//   costi/{id}:        { voce, importo (EUR), nota }
//   ricambi/{id}:      { nome, giacenza, sogliaMin }
//   interventi/{id}:   { data (ISO), titolo, mezzo, ricambio|null,
//                        costo|0, note } — ORDINE DI LAVORO chiuso:
//                        lo storico manutenzioni del mezzo (25/07)
//   scadenze/{id}:     { mezzo, tipo, chiave|null, dataScadenza (ISO),
//                        mesi|null (periodicità), documento, note,
//                        ultimaData|null, ultimoEsito|null } — SCADENZE
//                        DI LEGGE del mezzo (F6, 27/07)
// L'urgenza delle manutenzioni si CALCOLA dalla data (mai salvata).
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  mezzi: [
    { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5870, area: "fronte Est", stato: "operativo" },
    { id: "m2", nome: "Escavatore E2 — Volvo EC480", ore: 3210, area: "piazzale", stato: "operativo" },
    { id: "m3", nome: "Dumper D1 — CAT 745", ore: 8420, area: "", stato: "operativo" },
    { id: "m4", nome: "Dumper D3 — CAT 745", ore: 9105, area: "officina", stato: "fermo" },
    { id: "m5", nome: "Perforatrice P2 — Epiroc", ore: 2980, area: "fronte Est", stato: "verifica" },
    { id: "m6", nome: "Pala P1 — CAT 980", ore: 6540, area: "frantoio", stato: "operativo" },
  ],
  manutenzioni: [
    { id: "n1", titolo: "Tagliando 500h", mezzo: "Escavatore E1", dataPrevista: "2026-07-31" },
    { id: "n2", titolo: "Rotazione gomme", mezzo: "Dumper D1", dataPrevista: "2026-08-05" },
    { id: "n3", titolo: "Revisione annuale", mezzo: "Pala P1", dataPrevista: "2026-08-20" },
  ],
  costi: [
    { id: "c1", voce: "Carburante", importo: 8400, nota: "+6% sul mese scorso" },
    { id: "c2", voce: "Ricambi e officina", importo: 3150, nota: "" },
    { id: "c3", voce: "Noleggi esterni", importo: 1200, nota: "gru mobile 2gg" },
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
        mezzi: () => read("mezzi"), manutenzioni: () => read("manutenzioni"), costi: () => read("costi"), ricambi: () => read("ricambi"), interventi: () => read("interventi"), scadenze: () => read("scadenze"),
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
      mezzi: async () => mem.mezzi, manutenzioni: async () => mem.manutenzioni, costi: async () => mem.costi, ricambi: async () => mem.ricambi, interventi: async () => mem.interventi, scadenze: async () => mem.scadenze,
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
