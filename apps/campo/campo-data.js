// ============================================================
// Campo — accesso dati (C2). Stesso schema di scudo-data.js:
// Firestore via SDK Deepwork ID (orgCollection) da autenticati,
// demo in memoria altrimenti (tour/mockup).
// Collezioni (sotto organizations/{org}/apps/campo/):
//   attivita/{id}:   { data, turno, titolo, dettaglio, squadra, operatore,
//                      stato: pianificata|in-corso|anomalia|conclusa }
//   squadre/{id}:    { nome, persone, area, stato: operativa|ferma }
//   operatori/{id}:  { nome, ruolo, squadra, stato: in-forza|non-disponibile }
//                     (anagrafica minima delle persone: serve a dire CHI fa
//                      cosa — un'attività senza nome è di nessuno)
//   rapportini/{id}: { data, turno, titolo, squadra, prodQta, prodUnita, ora, stato: bozza|inviato }
//   obiettivi/{id}:  { data, turno, unita, valore }
//                     (obiettivo del turno: uno per giorno+turno+unità)
//   checklist/{id}:  { data, turno, squadra, esiti: {"0":"ok"|"no"|"na"}, note, ora }
//                     (controlli di inizio turno, uno per giorno+turno+squadra)
//   presenze/{id}:   { data, turno, operatoreId, nome, stato: presente|assente, ora }
//                     (appello del turno: chi c'è in cava adesso)
//   chiusure/{id}:   { data, turno, consegna, ricevuta, note, ora,
//                      riaperture: [{ da, motivo, il, ora }] }
//                     (firma di chiusura del turno: chi consegna, chi riceve;
//                      finché "ora" è valorizzata il turno è CHIUSO e nessuno
//                      può più scriverci sopra. Le riaperture restano scritte
//                      una per una: chi ha riaperto, quando e perché)
//   meteo/{id}:      { data, turno, cielo, piste, visibilita, note, ora }
//                     (meteo e condizioni del sito del turno: uno per
//                      giorno+turno, l'ultimo salvato vince)
//   pianocarico/{id}: { data, turno, foro, x, fila, prof, prog, borr, rit,
//                       reale, da, squadra }
//                     (piano di carico volata importato da CSV, ponte Genesi;
//                      una riga per foro, salvata come il resto dei dati.
//                      "da" e "squadra" sono CHI ha registrato la carica reale
//                      di QUEL foro: servono al consuntivo che torna a Genesi
//                      e restano vuoti sui piani salvati prima che esistessero)
// La "data" è il giorno di lavoro in formato ISO aaaa-mm-gg: senza di essa
// non esistono storico né conteggi veri (i vecchi record che ne sono privi
// restano visibili come "senza data", vedi eDelGiorno).
// ============================================================

import { parseCsvLine, numIt, isIntestazione, csvCell } from "../../shared/deepwork-id-client/dw-shell.js";

// ══════════════════════════════════════════════════════════════════════
// NUMERI COME SI SCRIVONO IN ITALIA — un solo posto per la convenzione
// ══════════════════════════════════════════════════════════════════════
// In Italia il decimale è la VIRGOLA e il separatore delle migliaia è il
// PUNTO: «1.250,4 kg», non «1250.4 kg». Prima questa formattazione era
// ricopiata a mano in una decina di punti diversi (a volte con
// toLocaleString, a volte no) ed è proprio per questo che in metà dei punti
// il punto decimale inglese era rimasto: il badge del foro scriveva
// «44.7 kg». Da qui in poi passa tutto da queste tre funzioni, e correggere
// la convenzione vuol dire correggere una riga.
//
// ⚠️ SONO FUNZIONI PER I NUMERI **MOSTRATI**. I numeri **SCAMBIATI** fra le
// app — i CSV: pianoConsuntivoCsv verso Genesi, lo storico, le squadre —
// restano col PUNTO decimale e senza separatore delle migliaia: sono dati,
// non testo, e chi li rilegge conta su quel formato. Se un numero finisce in
// un file, NON passa da qui.
//
// numeroIt: il numero, con al massimo `dec` decimali (gli zeri finali non si
// scrivono: 60 resta «60», non «60,00»). Non è un numero → stringa vuota,
// così chi lo mostra decide cosa metterci al posto. Pura e testabile.
//
// Due dettagli che NON sono pignoleria:
//  · `useGrouping: true` è scritto a mano di proposito. Lasciato al valore di
//    default, il separatore delle migliaia dipende dalla versione di ICU del
//    motore: 1286 esce «1.286» su Chromium e «1286» su Node (strategia
//    «min2», che raggruppa solo da cinque cifre). Lo stesso numero scritto in
//    due modi a seconda di dove gira è precisamente ciò che qui non si vuole.
//  · null e "" NON sono zero. `+null` fa 0, e senza questo controllo una
//    carica non registrata comparirebbe come «0 kg» — cioè un fatto, e falso,
//    invece di un dato mancante.
export function numeroIt(v, dec = 2) {
  if (v === null || v === "" || v === undefined) return "";
  const n = +v;
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("it-IT", {
    maximumFractionDigits: Math.max(0, dec | 0),
    useGrouping: true,
  });
}

// segnoIt: come numeroIt ma col VERSO davanti, e il meno è il segno meno
// tipografico (−, U+2212) non il trattino: «+4,7» / «−15,3». Serve agli
// scostamenti, dove il verso è metà dell'informazione. Pura e testabile.
export function segnoIt(v, dec = 2) {
  if (v === null || v === "" || v === undefined) return "";
  const n = +v;
  if (!Number.isFinite(n)) return "";
  return (n < 0 ? "−" : "+") + numeroIt(Math.abs(n), dec);
}

// numeroItDa: per i numeri che arrivano come TESTO GREZZO da un file (le
// colonne del piano di carico che Campo non converte: x, prof, borr, rit).
// Li interpreta con numIt — che accetta sia «13.20» sia «13,20» — e li
// riscrive all'italiana; se non è un numero restituisce il testo com'era,
// perché è roba di un file e non la si indovina. Pura e testabile.
export function numeroItDa(v, dec = 2) {
  const s = String(v == null ? "" : v).trim();
  if (s === "") return "";
  const n = numIt(s);
  return Number.isFinite(n) ? numeroIt(n, dec) : s;
}

// Giorno di lavoro corrente in ISO (aaaa-mm-gg) e in ora LOCALE: usare
// toISOString() sulla data grezza darebbe il giorno UTC e in Italia, la sera
// tardi, sbaglierebbe di un giorno intero. Pura e testabile.
export function oggiISO(adesso = new Date()) {
  return new Date(adesso.getTime() - adesso.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// I turni di lavoro previsti dall'app (gli stessi già usati dal rapportino).
export const TURNI = ["Mattina", "Pomeriggio", "Notte"];

// Turno suggerito in base all'ora, così chi registra non deve sceglierlo ogni
// volta: 6-14 mattina, 14-22 pomeriggio, il resto notte. Pura e testabile.
export function turnoCorrente(adesso = new Date()) {
  const h = adesso.getHours();
  if (h >= 6 && h < 14) return TURNI[0];
  if (h >= 14 && h < 22) return TURNI[1];
  return TURNI[2];
}

// Una registrazione appartiene al giorno indicato se ha quella data. I record
// SENZA data sono quelli salvati prima che la data esistesse: non devono
// sparire, quindi restano nella vista corrente e l'interfaccia li etichetta
// esplicitamente "senza data". Pura e testabile.
export function eDelGiorno(rec, giorno) {
  if (!rec) return false;
  const d = String(rec.data || "").trim();
  return d ? d === giorno : true;
}
export function diGiorno(righe, giorno) {
  return (righe || []).filter(r => eDelGiorno(r, giorno));
}
// Quante registrazioni sono ancora prive di data (avviso in interfaccia).
export function senzaData(righe) {
  return (righe || []).filter(r => r && !String(r.data || "").trim()).length;
}

const OGGI_DEMO = oggiISO();

export const DEMO = {
  attivita: [
    { id: "a1", data: OGGI_DEMO, turno: "Mattina", titolo: "Perforazione fronte Est", dettaglio: "14/22 fori", squadra: "Squadra A", operatore: "Luca Ferrari", stato: "in-corso" },
    { id: "a2", data: OGGI_DEMO, turno: "Mattina", titolo: "Volata fronte Nord", dettaglio: "Ore 12:30", squadra: "Squadra A", operatore: "Marco Rossi", stato: "pianificata" },
    { id: "a3", data: OGGI_DEMO, turno: "Mattina", titolo: "Carico e trasporto", dettaglio: "Piazzale 2 → frantoio", squadra: "Squadra B", operatore: "", stato: "in-corso" },
    { id: "a4", data: OGGI_DEMO, turno: "Mattina", titolo: "Frantoio primario", dettaglio: "Fermo per intasamento tramoggia", squadra: "Squadra C", operatore: "", stato: "anomalia" },
    { id: "a5", data: OGGI_DEMO, turno: "Mattina", titolo: "Controllo pre-turno mezzi", dettaglio: "completato", squadra: "Squadra B", operatore: "Anna Conti", stato: "conclusa" },
  ],
  squadre: [
    { id: "q1", nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" },
    { id: "q2", nome: "Squadra B — Carico", persone: 3, area: "piazzale 2", stato: "operativa" },
    { id: "q3", nome: "Squadra C — Impianto", persone: 2, area: "frantoio", stato: "ferma" },
  ],
  operatori: [
    { id: "o1", nome: "Marco Rossi", ruolo: "Fochino", squadra: "Squadra A", stato: "in-forza" },
    { id: "o2", nome: "Luca Ferrari", ruolo: "Perforatore", squadra: "Squadra A", stato: "in-forza" },
    { id: "o3", nome: "Anna Conti", ruolo: "Caposquadra", squadra: "Squadra B", stato: "in-forza" },
    { id: "o4", nome: "Youssef Amrani", ruolo: "Autista", squadra: "Squadra B", stato: "in-forza" },
    { id: "o5", nome: "Paolo Greco", ruolo: "Manutentore", squadra: "Squadra C", stato: "non-disponibile" },
  ],
  rapportini: [
    { id: "r1", data: OGGI_DEMO, turno: "Mattina", titolo: "Rapportino perforazione", squadra: "Squadra A", prodQta: 120, prodUnita: "t", ora: "11:20", stato: "inviato" },
    { id: "r2", data: OGGI_DEMO, turno: "Mattina", titolo: "Rapportino impianto", squadra: "Squadra C", prodQta: null, prodUnita: "t", ora: "", stato: "bozza" },
    { id: "r3", data: OGGI_DEMO, turno: "Mattina", titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 90, prodUnita: "t", ora: "10:05", stato: "inviato" },
  ],
  obiettivi: [
    { id: "b1", data: OGGI_DEMO, turno: "Mattina", unita: "t", valore: 260 },
  ],
  checklist: [],
  presenze: [],
  chiusure: [],
  meteo: [],
  pianocarico: [],
};

// ══════════════════════════════════════════════════════════════════════
// CHI FA COSA — squadre, operatori, assegnazione (C1)
// ══════════════════════════════════════════════════════════════════════

// Nome BREVE della squadra: "Squadra A — Perforazione" → "Squadra A". È la
// chiave con cui squadre, rapportini e attività si riconoscono fra loro
// (stessa convenzione già usata dalla copertura dei rapportini). Pura.
export function squadraBase(nome) {
  return String(nome || "").split(" — ")[0].trim();
}

// Ruoli suggeriti per l'anagrafica: lista corta, scelta da menu invece che
// digitata (in cava, coi guanti, si tocca; non si scrive).
export const RUOLI = [
  "Caposquadra",
  "Perforatore",
  "Fochino",
  "Autista",
  "Escavatorista",
  "Manutentore",
  "Addetto impianto",
  "Preposto",
  "Altro",
];

// Operatori di una squadra (per nome breve), in ordine alfabetico. Se la
// squadra non è indicata torna tutti. Pura e testabile.
export function operatoriDi(operatori, squadra) {
  const s = squadraBase(squadra);
  return (operatori || [])
    .filter(o => o && o.nome && (!s || squadraBase(o.squadra) === s))
    .slice()
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), "it"));
}

// Etichetta di assegnazione di un'attività: "Squadra A · Marco Rossi",
// oppure stringa vuota se non è assegnata a nessuno. Pura e testabile.
export function etichettaAssegnazione(att) {
  const parti = [];
  const s = squadraBase(att && att.squadra);
  const o = String((att && att.operatore) || "").trim();
  if (s) parti.push(s);
  if (o) parti.push(o);
  return parti.join(" · ");
}

// Un'attività è "mia" quando:
//  · porta il mio nome (anche se è di un'altra squadra: se me l'hanno data,
//    tocca a me);
//  · è della mia squadra e non ha il nome di nessuno (tocca a chiunque);
//  · è della mia squadra e io ho detto solo la squadra, non chi sono — in
//    quel caso sto guardando il lavoro di TUTTA la squadra, che è quello
//    che serve al caposquadra.
// Se non ho ancora detto qual è la mia squadra, non è mia niente. Pura.
export function eMia(att, io) {
  if (!att || !io) return false;
  const mioNome = String(io.operatore || "").trim();
  const miaSqu = squadraBase(io.squadra);
  const attOp = String(att.operatore || "").trim();
  const attSqu = squadraBase(att.squadra);
  if (mioNome && attOp === mioNome) return true;
  if (!miaSqu || attSqu !== miaSqu) return false;
  if (!attOp) return true;
  return !mioNome;
}

// Carico di lavoro per squadra: quante attività aperte (non concluse) e
// quante concluse ha ciascuna squadra nella giornata guardata, più quelle
// rimaste SENZA assegnazione (che sono il vero problema: non le fa nessuno).
// Ritorna { righe: [{squadra, aperte, concluse, anomalie}], nonAssegnate }.
// Pura e testabile.
export function caricoSquadre(attivita, squadre) {
  const acc = {};
  for (const q of squadre || []) {
    const s = squadraBase(q.nome);
    if (s) acc[s] = { squadra: s, nome: q.nome, aperte: 0, concluse: 0, anomalie: 0 };
  }
  let nonAssegnate = 0;
  for (const a of attivita || []) {
    const s = squadraBase(a && a.squadra);
    if (!s) { nonAssegnate++; continue; }
    if (!acc[s]) acc[s] = { squadra: s, nome: s, aperte: 0, concluse: 0, anomalie: 0 };
    if (a.stato === "conclusa") acc[s].concluse++;
    else acc[s].aperte++;
    if (a.stato === "anomalia") acc[s].anomalie++;
  }
  return {
    righe: Object.values(acc).sort((a, b) => b.aperte - a.aperte || a.squadra.localeCompare(b.squadra, "it")),
    nonAssegnate,
  };
}

// ══════════════════════════════════════════════════════════════════════
// OBIETTIVO DI TURNO E SCOSTAMENTO (C2)
// ══════════════════════════════════════════════════════════════════════

// Su cosa si può fissare un obiettivo: SOLO ciò che l'app misura davvero.
// Le tre unità di produzione più le attività concluse: promettere un
// obiettivo su un numero che nessuno registra sarebbe una bugia.
export const UNITA_ATTIVITA = "attività concluse";

// L'obiettivo del giorno+turno per una certa unità (l'ultimo salvato vince).
// Pura e testabile.
export function obiettivoDi(obiettivi, data, turno, unita) {
  const trovati = (obiettivi || []).filter(o => o
    && String(o.data || "") === String(data || "")
    && String(o.turno || "") === String(turno || "")
    && (!unita || String(o.unita || "") === String(unita)));
  return trovati.length ? trovati[trovati.length - 1] : null;
}

// Stato di un obiettivo: quanto è stato fatto, quanto manca, di quanto si è
// sopra o sotto. "fatto" viene dalla produzione dei rapportini dello stesso
// giorno e turno (bozze comprese: la produzione è produzione), oppure dal
// numero di attività concluse se l'obiettivo è su quelle.
// livello: ok = raggiunto, warn = vicino (≥85%), atteso = ancora indietro —
// NON "danger": a inizio turno essere a zero è normale, non un allarme.
// Pura e testabile; null se l'obiettivo non è un numero positivo.
export function statoObiettivo(ob, rapportini, attivita) {
  const obiettivo = +((ob && ob.valore) ?? NaN);
  if (!ob || !Number.isFinite(obiettivo) || obiettivo <= 0) return null;
  const unita = String(ob.unita || UNITA_PRODUZIONE[0]);
  const stessoTurno = (r) => String(r.data || "") === String(ob.data || "")
                          && String(r.turno || "") === String(ob.turno || "");
  let fatto = 0;
  if (unita === UNITA_ATTIVITA) {
    fatto = (attivita || []).filter(a => a && stessoTurno(a) && a.stato === "conclusa").length;
  } else {
    for (const r of rapportini || []) {
      if (!r || !stessoTurno(r)) continue;
      const p = produzioneDi(r);
      if (p && p.unita === unita) fatto += p.qta;
    }
  }
  fatto = Math.round(fatto * 100) / 100;
  const scarto = Math.round((fatto - obiettivo) * 100) / 100;
  const pct = Math.round(100 * fatto / obiettivo);
  return {
    data: ob.data, turno: ob.turno, unita, obiettivo, fatto,
    mancante: Math.max(0, Math.round((obiettivo - fatto) * 100) / 100),
    scarto, pct,
    livello: pct >= 100 ? "ok" : pct >= 85 ? "warn" : "atteso",
  };
}

// ══════════════════════════════════════════════════════════════════════
// STORICO DELLA SETTIMANA (C3)
// ══════════════════════════════════════════════════════════════════════

// Una riga per giornata di calendario negli ultimi `giorni` giorni: quanto si
// è prodotto (per unità), quanti minuti si è persi, quante attività erano in
// programma e quante sono state chiuse, quanti rapportini sono stati
// consegnati. Le giornate senza registrazioni restano nell'elenco a zero: nel
// registro di una settimana un giorno vuoto è un'informazione, non un buco.
// Le registrazioni senza data non entrano (non si sa a che giorno appartengono).
// Pura e testabile.
export function storicoSettimana(attivita, rapportini, giorni = 7, oggi = new Date()) {
  const fine = oggiISO(oggi);
  const quanti = Math.max(1, Math.round(+giorni) || 7);
  const meta = (iso) => new Date(iso + "T12:00:00");
  const mappa = {};
  for (let i = quanti - 1; i >= 0; i--) {
    const d = oggiISO(new Date(meta(fine).getTime() - i * 86400000));
    mappa[d] = { data: d, prod: {}, minutiFermo: 0, fermi: 0, attTot: 0, attConcluse: 0, rapInviati: 0, rapTot: 0 };
  }
  for (const a of attivita || []) {
    const g = mappa[String((a && a.data) || "").trim()];
    if (!g) continue;
    g.attTot++;
    if (a.stato === "conclusa") g.attConcluse++;
    if (a.stato === "anomalia") { g.minutiFermo += Math.max(0, +a.fermoMin || 0); g.fermi++; }
  }
  for (const r of rapportini || []) {
    const g = mappa[String((r && r.data) || "").trim()];
    if (!g) continue;
    g.rapTot++;
    if (r.stato === "inviato") g.rapInviati++;
    const p = produzioneDi(r);
    if (p) g.prod[p.unita] = Math.round(((g.prod[p.unita] || 0) + p.qta) * 100) / 100;
  }
  return Object.values(mappa).sort((a, b) => a.data < b.data ? -1 : 1);
}

// Totali di una finestra di giornate + la giornata migliore e peggiore per
// produzione nell'unità prevalente. Pura e testabile.
export function totaliSettimana(righe) {
  const prod = {}, out = {
    giorni: (righe || []).length, giorniConDati: 0, prod,
    minutiFermo: 0, fermi: 0, attTot: 0, attConcluse: 0, rapInviati: 0,
  };
  for (const g of righe || []) {
    out.minutiFermo += g.minutiFermo; out.fermi += g.fermi;
    out.attTot += g.attTot; out.attConcluse += g.attConcluse; out.rapInviati += g.rapInviati;
    let conDati = g.attTot > 0 || g.rapTot > 0;
    for (const [u, q] of Object.entries(g.prod || {})) { prod[u] = Math.round((( prod[u] || 0) + q) * 100) / 100; conDati = true; }
    if (conDati) out.giorniConDati++;
  }
  out.pctConcluse = out.attTot ? Math.round(100 * out.attConcluse / out.attTot) : null;
  return out;
}

// L'unità di misura che pesa di più nella settimana: è quella da disegnare
// nel grafico (tonnellate e metri cubi non si sommano fra loro, quindi si
// sceglie, non si mescola). null se non c'è nessuna produzione. Pura.
export function unitaPrevalente(righe) {
  const tot = {};
  for (const g of righe || [])
    for (const [u, q] of Object.entries(g.prod || {})) tot[u] = (tot[u] || 0) + q;
  const voci = Object.entries(tot).sort((a, b) => b[1] - a[1]);
  return voci.length ? voci[0][0] : null;
}

// ══════════════════════════════════════════════════════════════════════
// CHECKLIST DI INIZIO TURNO (C3)
// ══════════════════════════════════════════════════════════════════════

// I controlli da fare PRIMA di cominciare. Lista fissa e corta: se è lunga
// nessuno la compila e diventa una firma finta. Ogni voce ha l'area di
// competenza, così a colpo d'occhio si vede di cosa si sta parlando.
export const CHECKLIST_INIZIO = [
  { area: "Persone", testo: "Briefing di inizio turno fatto con la squadra" },
  { area: "Persone", testo: "DPI presenti e integri (casco, scarpe, gilet, otoprotettori)" },
  { area: "Mezzi",   testo: "Giro di controllo pre-avvio dei mezzi (olio, gomme, luci, freni)" },
  { area: "Mezzi",   testo: "Avvisatori acustici di retromarcia funzionanti" },
  { area: "Area",    testo: "Piste e accessi transitabili e puliti" },
  { area: "Area",    testo: "Fronte e cigli controllati: nessun blocco in bilico" },
  { area: "Area",    testo: "Segnaletica e sbarramenti al loro posto" },
  { area: "Emergenza", testo: "Estintori e cassetta di primo soccorso presenti" },
  { area: "Emergenza", testo: "Radio o telefono di servizio funzionanti" },
];

// Gli esiti ammessi per ogni voce: fatto, non a posto, non applicabile.
export const ESITI_CHECK = ["ok", "no", "na"];

// Stato di compilazione di una checklist. `esiti` è una mappa indice→esito
// (così com'è salvata). Ritorna quante voci sono a posto, quante no, quante
// non applicabili, quante mancano e l'elenco dei problemi trovati.
// Pura e testabile.
export function statoChecklist(esiti, voci = CHECKLIST_INIZIO) {
  const e = esiti || {};
  let ok = 0, no = 0, na = 0;
  const problemi = [];
  voci.forEach((v, i) => {
    const val = e[String(i)] || e[i];
    if (val === "ok") ok++;
    else if (val === "no") { no++; problemi.push(v.testo); }
    else if (val === "na") na++;
  });
  const totale = voci.length, risposte = ok + no + na;
  return {
    ok, no, na, totale, risposte,
    mancanti: totale - risposte,
    completa: risposte === totale,
    problemi,
    pct: totale ? Math.round(100 * risposte / totale) : 0,
  };
}

// ══════════════════════════════════════════════════════════════════════
// PRESENZE DEL TURNO (C3)
// ══════════════════════════════════════════════════════════════════════
// A cosa serve davvero: sapere CHI C'È in cava adesso. Se suona l'allarme e
// si va al punto di raccolta, l'appello si fa su questa lista. È anche la
// voce "personale presente" che tutti i rapporti di turno professionali
// hanno e che a Campo mancava.

export const STATI_PRESENZA = ["presente", "assente"];

// La riga di presenza di una persona in quel giorno e turno (l'ultima
// salvata vince). Pura e testabile.
export function presenzaDi(presenze, data, turno, operatoreId) {
  const trovate = (presenze || []).filter(p => p
    && String(p.data || "") === String(data || "")
    && String(p.turno || "") === String(turno || "")
    && String(p.operatoreId || "") === String(operatoreId || ""));
  return trovate.length ? trovate[trovate.length - 1] : null;
}

// L'appello di un turno: per ogni persona in forza (di tutte le squadre o di
// una sola) lo stato registrato. Chi non è ancora stato spuntato NON viene
// contato né presente né assente: "non lo so" è una risposta diversa da "non
// c'è", e su un appello di emergenza la differenza è tutto.
// Ritorna { righe:[{operatore, stato, ora}], presenti, assenti, daFare, totale }.
// Pura e testabile.
export function appelloTurno(operatori, presenze, data, turno, squadra) {
  const righe = operatoriDi(operatori, squadra)
    .filter(o => o.stato !== "non-disponibile")
    .map(o => {
      const p = presenzaDi(presenze, data, turno, o.id);
      return { operatore: o, stato: p ? String(p.stato || "") : "", ora: (p && p.ora) || "" };
    });
  const presenti = righe.filter(r => r.stato === "presente").length;
  const assenti = righe.filter(r => r.stato === "assente").length;
  return {
    righe, presenti, assenti,
    daFare: righe.length - presenti - assenti,
    totale: righe.length,
    completo: righe.length > 0 && presenti + assenti === righe.length,
  };
}

// ══════════════════════════════════════════════════════════════════════
// CHIUSURA DEL TURNO — la firma della consegna (C3)
// ══════════════════════════════════════════════════════════════════════
// Il rapporto di fine turno diventa un documento quando porta un nome e
// un'ora: chi consegna, chi riceve, quando. È la richiesta ricorrente dei
// preposti, ed è quello che, in caso di contestazione, distingue un
// appunto da una consegna fatta.

// La chiusura registrata per quel giorno e turno (l'ultima vince).
// Pura e testabile.
export function chiusuraDi(chiusure, data, turno) {
  const trovate = (chiusure || []).filter(c => c
    && String(c.data || "") === String(data || "")
    && String(c.turno || "") === String(turno || ""));
  return trovate.length ? trovate[trovate.length - 1] : null;
}

// Riassunto leggibile della chiusura ("consegnato da X a Y alle 14:05").
// Stringa vuota se il turno non è ancora chiuso. Pura e testabile.
export function riassuntoChiusura(c) {
  if (!c || !c.ora) return "";
  const da = String(c.consegna || "").trim(), a = String(c.ricevuta || "").trim();
  return "Consegnato" + (da ? " da " + da : "") + (a ? " a " + a : "") + " alle " + c.ora;
}

// ── IL TURNO CHIUSO NON SI TOCCA PIÙ ──────────────────────────────────
// Una firma vale qualcosa solo se dopo la firma il documento non cambia più.
// Questa è la funzione che tutti i punti di salvataggio devono chiedere prima
// di scrivere: torna la chiusura che copre quella registrazione, oppure null
// se il turno è aperto e si può lavorare.
// COMPATIBILITÀ (regola ferrea): una registrazione senza giorno o senza turno
// NON appartiene a nessun turno chiuso — i dati vecchi, salvati prima che
// esistessero data, turno e chiusura, restano modificabili esattamente come
// oggi. Nessuna organizzazione si ritrova dati bloccati dall'oggi al domani.
// Pura e testabile.
export function turnoChiuso(chiusure, data, turno) {
  const d = String(data || "").trim(), t = String(turno || "").trim();
  if (!d || !t) return null;
  const c = chiusuraDi(chiusure, d, t);
  return c && String(c.ora || "").trim() ? c : null;
}

// Le riaperture registrate su una chiusura, dalla più vecchia alla più
// recente. Non si cancellano mai: sono la traccia che rende la correzione
// alla luce del sole invece che di nascosto. Pura e testabile.
export function riaperture(c) {
  const r = (c && c.riaperture) || [];
  return Array.isArray(r) ? r.filter(x => x && (x.da || x.ora || x.il)) : [];
}

// Riga leggibile di una riapertura ("Riaperto da Mario Bianchi il 29/07/2026
// alle 15:10 — dimenticati i minuti di fermo"). `fmtData` serve a scrivere il
// giorno come lo scrive l'interfaccia; di suo resta com'è. Pura e testabile.
export function riassuntoRiapertura(r, fmtData) {
  if (!r) return "";
  const f = typeof fmtData === "function" ? fmtData : (d) => d;
  const parti = ["Riaperto"];
  const chi = String(r.da || "").trim();
  if (chi) parti.push("da " + chi);
  if (r.il) parti.push("il " + f(r.il));
  if (r.ora) parti.push("alle " + r.ora);
  const motivo = String(r.motivo || "").trim();
  return parti.join(" ") + (motivo ? " — " + motivo : "");
}

// L'ultima riapertura registrata (null se non ce n'è nessuna). Pura.
export function ultimaRiapertura(c) {
  const r = riaperture(c);
  return r.length ? r[r.length - 1] : null;
}

// ══════════════════════════════════════════════════════════════════════
// FOTO DELL'ANOMALIA — misure e controlli (C4)
// ══════════════════════════════════════════════════════════════════════
// In cava la foto spiega in due secondi quello che il testo non spiega. Ma
// una foto di telefono pesa 3-8 MB: va rimpicciolita NEL BROWSER prima di
// salvarla, altrimenti riempie il database e non si carica più con la rete
// della cava. Qui stanno le misure e i controlli (funzioni pure); il taglio
// vero e proprio lo fa il canvas dentro l'app.

// Tetto della foto salvata. Un documento Firestore non può superare 1 MB in
// tutto: si sta molto sotto, così restano larghi anche gli altri campi.
export const FOTO_MAX_BYTE = 280 * 1024;

// Tentativi in scaletta: si parte dal lato lungo più grande e si scende
// finché la foto non sta nel tetto. Il primo tentativo basta quasi sempre.
export const FOTO_TENTATIVI = [
  { lato: 1280, qualita: 0.72 },
  { lato: 1024, qualita: 0.66 },
  { lato: 800,  qualita: 0.58 },
  { lato: 640,  qualita: 0.50 },
];

// Formati che accettiamo da chi carica. Tutto viene comunque riscritto in
// JPEG dal canvas: qui si scartano subito i file che non sono immagini.
export function eImmagine(file) {
  return !!file && /^image\/(jpeg|jpg|png|webp|heic|heif|gif|bmp)$/i.test(String(file.type || ""));
}

// Quanto pesa DAVVERO una foto salvata come data URL (i byte del file, non i
// caratteri del testo base64, che sono un terzo in più). Pura e testabile.
export function byteFoto(dataUrl) {
  const s = String(dataUrl || "");
  const i = s.indexOf(",");
  if (i < 0) return 0;
  const b64 = s.slice(i + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor(b64.length * 3 / 4) - pad);
}

// Una foto salvata è valida solo se è un data URL di immagine in base64:
// tutto il resto (in particolare un "javascript:" o un SVG con dentro del
// codice) non deve mai finire dentro un tag <img> dell'app.
// Vedi docs/AUDIT_SICUREZZA.md. Pura e testabile.
export function eFotoValida(dataUrl) {
  return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(String(dataUrl || ""));
}

// Misure dopo il ridimensionamento: si rimpicciolisce solo se serve, mai si
// ingrandisce (una foto piccola stirata perde e basta). Pura e testabile.
export function misuraRidotta(larghezza, altezza, lato) {
  const w = Math.max(0, +larghezza || 0), h = Math.max(0, +altezza || 0);
  const max = Math.max(w, h);
  if (!max) return { w: 1, h: 1 };
  if (max <= lato) return { w: Math.max(1, Math.round(w)), h: Math.max(1, Math.round(h)) };
  const k = lato / max;
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

// "240 kB" / "3,2 MB": il peso scritto come lo legge una persona. Pura.
export function formattaByte(n) {
  const b = Math.max(0, +n || 0);
  return b >= 1048576
    ? numeroIt(b / 1048576, 1) + " MB"
    : numeroIt(Math.max(1, Math.round(b / 1024)), 0) + " kB";
}

// ══════════════════════════════════════════════════════════════════════
// METEO E CONDIZIONI DEL SITO (C4)
// ══════════════════════════════════════════════════════════════════════
// È una voce fissa di ogni rapporto di turno professionale: spiega i fermi
// («ci siamo fermati perché pioveva»), spiega la produzione bassa e, in caso
// di contestazione, dice com'era la cava quel giorno. Si registra a mano, a
// scelte rapide: niente servizi meteo esterni, niente abbonamenti.

export const METEO_CIELO = ["Sereno", "Nuvoloso", "Pioggia", "Vento forte", "Nebbia", "Neve o gelo", "Caldo estremo"];
export const METEO_PISTE = ["Asciutte", "Bagnate", "Fangose", "Ghiacciate", "Polverose"];
export const METEO_VISIBILITA = ["Buona", "Ridotta", "Scarsa"];

// Condizioni che, da sole, spiegano un fermo o impongono prudenza: l'app le
// segnala invece di lasciarle scritte e basta.
const METEO_AVVERSO = ["Pioggia", "Vento forte", "Nebbia", "Neve o gelo", "Caldo estremo"];
const PISTE_AVVERSE = ["Fangose", "Ghiacciate"];

// Il meteo registrato per quel giorno e turno (l'ultimo salvato vince).
// Pura e testabile.
export function meteoDi(lista, data, turno) {
  const trovati = (lista || []).filter(m => m
    && String(m.data || "") === String(data || "")
    && String(m.turno || "") === String(turno || ""));
  return trovati.length ? trovati[trovati.length - 1] : null;
}

// Le condizioni del turno in una riga ("Pioggia · piste fangose · visibilità
// ridotta"). Stringa vuota se non è stato registrato niente. Pura e testabile.
export function riassuntoMeteo(m) {
  if (!m) return "";
  const parti = [];
  const cielo = String(m.cielo || "").trim();
  const piste = String(m.piste || "").trim();
  const vis = String(m.visibilita || "").trim();
  if (cielo) parti.push(cielo);
  if (piste) parti.push("piste " + piste.toLowerCase());
  if (vis) parti.push("visibilità " + vis.toLowerCase());
  return parti.join(" · ");
}

// Il turno ha condizioni difficili? (serve a colorare il cartellone e a
// scriverlo nel rapporto, mai a "decidere" al posto di chi c'è). Pura.
export function meteoAvverso(m) {
  if (!m) return false;
  return METEO_AVVERSO.includes(String(m.cielo || "").trim())
      || PISTE_AVVERSE.includes(String(m.piste || "").trim())
      || String(m.visibilita || "").trim() === "Scarsa";
}

// La checklist di quel giorno, turno e squadra (l'ultima salvata vince).
// Pura e testabile.
export function checklistDi(lista, data, turno, squadra) {
  const s = squadraBase(squadra);
  const trovate = (lista || []).filter(c => c
    && String(c.data || "") === String(data || "")
    && String(c.turno || "") === String(turno || "")
    && squadraBase(c.squadra) === s);
  return trovate.length ? trovate[trovate.length - 1] : null;
}

// Causali di fermo STANDARDIZZATE: senza una lista fissa non si possono
// calcolare OEE e disponibilità (servono categorie confrontabili nel
// tempo, non testo libero). Sono le voci tipiche di un fermo in cava.
export const CAUSALI_FERMO = [
  "Guasto meccanico",
  "Mancanza materiale",
  "Attesa mezzo",
  "Intasamento impianto",
  "Meteo",
  "Manutenzione programmata",
  "Cambio turno",
  "Sicurezza",
  "Altro",
];

// Riepilogo dei fermi (attività in stato "anomalia") per causale, ordinato
// per frequenza decrescente. Una causale non riconosciuta o assente
// confluisce in "Altro". Funzione pura e testabile.
export function riepilogoFermi(attivita) {
  const conteggi = {};
  for (const a of attivita || []) {
    if (a.stato !== "anomalia") continue;
    const c = CAUSALI_FERMO.includes(a.causale) ? a.causale : "Altro";
    conteggi[c] = (conteggi[c] || 0) + 1;
  }
  return Object.entries(conteggi)
    .map(([causale, conto]) => ({ causale, conto }))
    .sort((a, b) => b.conto - a.conto || a.causale.localeCompare(b.causale, "it"));
}

// Pareto dei fermi CON I MINUTI (25/07): oltre a "quante volte", QUANTO tempo
// si è perso e per quale causale — la base della disponibilità di giornata.
// I minuti (a.fermoMin) li inserisce il capocantiere sull'anomalia; un valore
// assente o non numerico conta 0 (mai NaN). Pura e testabile.
export function paretoFermi(attivita) {
  const acc = {};
  for (const a of attivita || []) {
    if (a.stato !== "anomalia") continue;
    const c = CAUSALI_FERMO.includes(a.causale) ? a.causale : "Altro";
    const m = Math.max(0, +a.fermoMin || 0);
    if (!acc[c]) acc[c] = { causale: c, conto: 0, minuti: 0 };
    acc[c].conto++; acc[c].minuti += m;
  }
  const voci = Object.values(acc)
    .sort((a, b) => b.minuti - a.minuti || b.conto - a.conto || a.causale.localeCompare(b.causale, "it"));
  const totaleMin = voci.reduce((t, v) => t + v.minuti, 0);
  return { voci, totaleMin };
}

// Minuti di fermo giorno per giorno, negli ultimi `giorni` giorni di
// calendario. Risponde a «sto peggiorando o migliorando?»: un fermo brutto
// capita a tutti, tre settimane di fermi sono un problema di manutenzione.
// Regole di onestà del dato:
//  · i giorni PRIMA della prima registrazione restano FUORI dalla finestra —
//    disegnarli a zero direbbe «quel giorno non ci siamo fermati», mentre la
//    verità è che non c'era ancora nessuno a registrare;
//  · i giorni dentro la finestra senza registrazioni valgono zero, e quello
//    invece è un dato vero;
//  · le attività senza data non entrano: non si sa a che giorno appartengono.
// Ritorna [{ data (ISO), minuti, fermi }] in ordine cronologico.
// Pura e testabile.
export function fermiPerGiorno(attivita, giorni = 14, oggi = new Date()) {
  const fine = oggiISO(oggi);
  const acc = {};
  let primo = null;
  for (const a of attivita || []) {
    const d = String((a && a.data) || "").trim();
    if (!d || d > fine) continue;
    if (!primo || d < primo) primo = d;
    if (!acc[d]) acc[d] = { data: d, minuti: 0, fermi: 0 };
    if (a.stato === "anomalia") {
      acc[d].minuti += Math.max(0, +a.fermoMin || 0);
      acc[d].fermi++;
    }
  }
  if (!primo) return [];
  const quanti = Math.max(1, Math.round(+giorni) || 14);
  const meta = (iso) => new Date(iso + "T12:00:00");
  const inizio = oggiISO(new Date(meta(fine).getTime() - (quanti - 1) * 86400000));
  const da = primo > inizio ? primo : inizio;
  const out = [];
  for (let t = meta(da); oggiISO(t) <= fine; t = new Date(t.getTime() + 86400000))
    out.push(acc[oggiISO(t)] || { data: oggiISO(t), minuti: 0, fermi: 0 });
  return out;
}

// Riassunto testuale di un rapportino di turno STRUTTURATO (turno, squadra,
// produzione, consegne per il turno successivo = handover). Serve alla lista
// e all'eventuale export/consegna. Stringa vuota se non c'è nulla. Pura e
// testabile.
export function riassuntoRapportino(r) {
  const parti = [];
  if (r && r.turno) parti.push("Turno " + r.turno);
  if (r && r.squadra) parti.push(r.squadra);
  const p = produzioneDi(r);
  if (p) parti.push("Produzione: " + formattaProduzione(p.qta, p.unita));
  else if (r && r.produzione) parti.push("Produzione: " + r.produzione);   // vecchio testo libero
  if (r && r.note) parti.push("Consegne: " + r.note);
  return parti.join(" · ");
}

// Unità di misura ammesse per la produzione di turno. Tonnellate e metri cubi
// NON si sommano fra loro (dipendono dalla densità del materiale), e i viaggi
// sono un'altra cosa ancora: i totali restano quindi separati per unità.
export const UNITA_PRODUZIONE = ["t", "m³", "viaggi"];

// Produzione NUMERICA di un rapportino: { qta, unita } se c'è una quantità
// valida (> 0), altrimenti null. Il vecchio campo "produzione" era testo
// libero e non è sommabile: resta solo come nota. Pura e testabile.
export function produzioneDi(r) {
  const q = +((r && r.prodQta) ?? NaN);
  if (!Number.isFinite(q) || q <= 0) return null;
  return { qta: q, unita: UNITA_PRODUZIONE.includes(r.prodUnita) ? r.prodUnita : UNITA_PRODUZIONE[0] };
}
// "1.250 t" — numero all'italiana con l'unità accanto. L'unità NON va mai
// messa in maiuscolo dopo: «m³» e «M³» non sono la stessa cosa.
export function formattaProduzione(qta, unita) {
  return numeroIt(+qta || 0, 2) + " " + (unita || UNITA_PRODUZIONE[0]);
}

// Totali di produzione: per unità di misura sull'insieme passato e, dentro,
// per turno — è il numero che il preposto legge a fine turno. I rapportini
// senza quantità non contano; il turno mancante finisce in "Senza turno".
// Ritorna { perUnita: {t: n, ...}, perTurno: [{turno, perUnita}] }, i turni
// nell'ordine mattina → pomeriggio → notte. Pura e testabile.
export function totaliProduzione(rapportini) {
  const perUnita = {}, turni = {};
  for (const r of rapportini || []) {
    const p = produzioneDi(r);
    if (!p) continue;
    perUnita[p.unita] = (perUnita[p.unita] || 0) + p.qta;
    const t = (r.turno || "").trim() || "Senza turno";
    if (!turni[t]) turni[t] = {};
    turni[t][p.unita] = (turni[t][p.unita] || 0) + p.qta;
  }
  const ord = (t) => { const i = TURNI.indexOf(t); return i < 0 ? TURNI.length : i; };
  return {
    perUnita,
    perTurno: Object.entries(turni)
      .map(([turno, u]) => ({ turno, perUnita: u }))
      .sort((a, b) => ord(a.turno) - ord(b.turno) || a.turno.localeCompare(b.turno, "it")),
  };
}

// Copertura dei rapportini di TURNO: quali squadre hanno già consegnato un
// rapportino (stato "inviato") e quali mancano ancora — così il preposto, prima
// del cambio turno (handover), sa chi sollecitare. Una squadra si abbina al suo
// rapportino per PREFISSO del nome ("Squadra A — Perforazione" ↔ "Squadra A"),
// stessa convenzione delle altre app. Ritorna { coperte, totale, pct, mancanti }
// (pct null se non ci sono squadre). Pura e testabile.
export function coperturaRapportini(squadre, rapportini) {
  const inviati = new Set((rapportini || [])
    .filter(r => r.stato === "inviato")
    .map(r => String(r.squadra || "").trim())
    .filter(Boolean));
  const righe = (squadre || []).map(q => {
    const nome = String(q.nome || "");
    return { squadra: nome, consegnato: inviati.has(nome.split(" — ")[0].trim()) };
  });
  const coperte = righe.filter(r => r.consegnato).length;
  const totale = righe.length;
  return {
    coperte, totale,
    pct: totale ? Math.round(100 * coperte / totale) : null,
    mancanti: righe.filter(r => !r.consegnato).map(r => r.squadra),
  };
}

export function kpiFrom(attivita, squadre, rapportini) {
  return {
    squadreAttive: squadre.filter(q => q.stato === "operativa").length,
    inCorso: attivita.filter(a => a.stato === "in-corso").length,
    rapportiniOggi: rapportini.filter(r => r.stato === "inviato").length,
    anomalie: attivita.filter(a => a.stato === "anomalia").length,
  };
}

// Avanzamento della giornata: quante attività sono CONCLUSE sul totale, con la
// ripartizione per stato. Dà al preposto un "quanto manca" a colpo d'occhio.
// pct = concluse / totale (0 se non ci sono attività). Pura e testabile.
export function avanzamentoGiornata(attivita) {
  const per = { pianificata: 0, "in-corso": 0, conclusa: 0, anomalia: 0 };
  for (const a of attivita || []) if (per[a.stato] != null) per[a.stato]++;
  const totale = (attivita || []).length;
  return {
    totale,
    concluse: per.conclusa,
    inCorso: per["in-corso"],
    pianificate: per.pianificata,
    anomalie: per.anomalia,
    pct: totale > 0 ? Math.round(100 * per.conclusa / totale) : 0,
  };
}

// Import delle SQUADRE da CSV (onboarding: caricare le squadre di cantiere).
// Colonne: nome;persone;area;stato (header opzionale). Tiene solo le righe con
// un nome; persone via numIt (≥0); stato operativa|ferma (default operativa).
// nome/area sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseSquadreCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, persone, area, stato] = parseCsvLine(r);
      const n = numIt(persone);
      return {
        nome: (nome || "").trim(),
        persone: Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0,
        area: (area || "").trim(),
        stato: (stato || "").trim().toLowerCase() === "ferma" ? "ferma" : "operativa",
      };
    })
    .filter(q => q.nome);
}

// Piano di carico importato da CSV (colonne: foro;x;fila;prof;prog;borr;rit).
// Solo foro e prog vengono usati per calcoli/chiavi, quindi qui si coercono
// a numero e le righe con valori non validi vengono scartate. Gli altri
// campi restano testo grezzo del file: vanno SEMPRE escapati dove mostrati
// (vedi docs/AUDIT_SICUREZZA.md punto 13). Funzione pura e testabile.
export function parsePianoCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "foro"))
    .map(r => {
      const [foro, x, fila, prof, prog, borr, rit] = parseCsvLine(r);
      return { foro: numIt(foro), x, fila, prof, prog: numIt(prog), borr, rit, reale: null };
    })
    .filter(p => p.foro > 0 && p.prog > 0);
}

// Righe del piano di carico rilette dal salvataggio: si tengono solo quelle
// con foro e progetto validi (nella collezione possono esserci vecchi documenti
// di riepilogo import, senza foro) e si riordinano per numero di foro. La
// carica reale torna a null se non è un numero. Pura e testabile.
export function normalizzaPiano(righe) {
  return (righe || [])
    .map(p => ({ ...p, foro: numIt(p.foro), prog: numIt(p.prog),
                 reale: Number.isFinite(+p.reale) && p.reale !== null && p.reale !== "" ? +p.reale : null }))
    .filter(p => p.foro > 0 && p.prog > 0)
    .sort((a, b) => a.foro - b.foro);
}

// Ponte progettato-vs-reale (Genesi→Campo): scostamento della carica REALE
// dal progetto, per foro. Funzioni pure e testabili — sono il cuore del
// registro che il fochino usa per capire se ha caricato come previsto.
// scartoPct: frazione |reale-prog|/prog (null se non ancora registrato).
export function scartoPct(reale, prog) {
  if (reale == null) return null;
  return Math.abs(reale - prog) / (prog || 1);
}
// scartoLivello: classifica lo scostamento — ok ≤10%, warn ≤25%, oltre danger.
export function scartoLivello(reale, prog) {
  const s = scartoPct(reale, prog);
  if (s == null) return "da-registrare";
  if (s <= 0.10) return "ok";
  if (s <= 0.25) return "warn";
  return "danger";
}
// Riepilogo del consuntivo di volata: progettato totale, stimato reale
// (carica reale dei fori registrati + progetto per quelli ancora da
// registrare), scostamento % e livello. È il numero che il fochino legge
// in cima al registro. Funzione pura e testabile; null se piano vuoto.
export function pianoRiepilogo(piano) {
  if (!piano || !piano.length) return null;
  const reg = piano.filter(p => p.reale != null);
  const progettatoKg = piano.reduce((t, p) => t + p.prog, 0);
  const stimatoKg = reg.reduce((t, p) => t + p.reale, 0)
                  + piano.filter(p => p.reale == null).reduce((t, p) => t + p.prog, 0);
  const pct = Math.round((stimatoKg - progettatoKg) / progettatoKg * 100);
  return {
    registrati: reg.length,
    totale: piano.length,
    progettatoKg,
    stimatoKg,
    pct,
    livello: scartoLivello(stimatoKg, progettatoKg),
  };
}

// Scostamento sui SOLI fori già registrati — il numero che serve MENTRE si
// carica, non dopo. pianoRiepilogo() stima il totale finale contando a
// progetto i fori non ancora registrati: è la proiezione giusta per il
// consuntivo, ma "annacqua" lo scostamento appena il carico è a metà (dieci
// fori su venti caricati con il 20% in più danno un +10% sul totale, e chi
// legge pensa di essere dentro tolleranza). Qui invece si confronta solo
// quello che è stato davvero fatto con quello che era previsto PER QUEI
// FORI: se il fochino sta caricando sistematicamente più del progetto, lo
// vede al terzo foro e non a volata finita. Pura e testabile; null finché
// non c'è nemmeno un foro registrato.
export function pianoParziale(piano) {
  const reg = (piano || []).filter(p => p.reale != null);
  if (!reg.length) return null;
  const progettatoKg = reg.reduce((t, p) => t + p.prog, 0);
  const realeKg = reg.reduce((t, p) => t + p.reale, 0);
  const pct = progettatoKg ? Math.round((realeKg - progettatoKg) / progettatoKg * 100) : 0;
  return {
    registrati: reg.length,
    totale: (piano || []).length,
    progettatoKg,
    realeKg,
    pct,
    livello: scartoLivello(realeKg, progettatoKg),
  };
}

// ── Il consuntivo che torna a Genesi ──────────────────────────────────────
// Genesi manda a Campo il piano di carico in CSV; Campo gli rimanda indietro,
// nella STESSA forma (punto e virgola, una riga di intestazione, una riga per
// foro), quello che è successo davvero. Non è un formato nuovo: sono le sei
// colonne che Campo esportava già, più tre che mancavano perché il giro si
// chiudesse davvero:
//   · scarto_kg   — lo scarto in CHILI e COL SEGNO. scarto_pct è arrotondato
//                   all'unità e senza verso (è nato per il badge in lista):
//                   da solo non basta a Genesi, che deve sapere se si è
//                   caricato in più o in meno e di quanto esattamente.
//   · squadra     — quale squadra ha caricato.
//   · operatore   — CHI ha registrato la carica, foro per foro.
// Le prime sei colonne restano identiche e nello stesso ordine: un file
// esportato prima di oggi resta leggibile, e chi leggeva solo le prime sei
// continua a funzionare.
// carica_reale_kg è scritta GREZZA, senza arrotondamenti: è il dato misurato
// e nessuno deve toccarlo per strada.
export const CONSUNTIVO_COLONNE = ["data", "turno", "foro", "carica_prog_kg",
  "carica_reale_kg", "scarto_pct", "scarto_kg", "squadra", "operatore"];

export function pianoConsuntivoCsv(piano) {
  const righe = (piano || []).map(p => {
    const s = scartoPct(p.reale, p.prog);
    // toFixed(3) toglie SOLO il rumore binario (12,3 − 10 = 2,3000000000000007),
    // non la precisione della misura: al grammo si è già ben oltre il vero.
    const dkg = p.reale != null ? +(p.reale - p.prog).toFixed(3) : "";
    // csvCell SOLO sui campi di testo (turno, squadra, nome): è lì che possono
    // esserci punti e virgola o virgolette da proteggere. Sui NUMERI non va
    // usato, perché mette un apostrofo davanti a tutto ciò che comincia per
    // meno — e uno scarto negativo diventerebbe «'-13,3», cioè testo.
    return [p.data || "", csvCell(p.turno || ""), p.foro, p.prog,
            p.reale != null ? p.reale : "",
            s != null ? Math.round(s * 100) : "",
            dkg, csvCell(p.squadra || ""), csvCell(p.da || "")].join(";");
  });
  return CONSUNTIVO_COLONNE.join(";") + "\n" + righe.join("\n") + (righe.length ? "\n" : "");
}

export async function campoData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "campo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        attivita: () => read("attivita"),
        squadre: () => read("squadre"),
        operatori: () => read("operatori"),
        rapportini: () => read("rapportini"),
        obiettivi: () => read("obiettivi"),
        checklist: () => read("checklist"),
        presenze: () => read("presenze"),
        chiusure: () => read("chiusure"),
        meteo: () => read("meteo"),
        pianocarico: () => read("pianocarico"),
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
      attivita: async () => mem.attivita,
      squadre: async () => mem.squadre,
      operatori: async () => mem.operatori || (mem.operatori = []),
      rapportini: async () => mem.rapportini,
      obiettivi: async () => mem.obiettivi || (mem.obiettivi = []),
      checklist: async () => mem.checklist || (mem.checklist = []),
      presenze: async () => mem.presenze || (mem.presenze = []),
      chiusure: async () => mem.chiusure || (mem.chiusure = []),
      meteo: async () => mem.meteo || (mem.meteo = []),
      pianocarico: async () => mem.pianocarico || (mem.pianocarico = []),
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
