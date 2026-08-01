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
//   durate/{id}:     { data, turno, minuti, ora }
//                     (durata DICHIARATA del turno, uno per giorno+turno:
//                      è il denominatore della disponibilità. Sta qui e non
//                      in un'impostazione dell'organizzazione perché il
//                      rapporto di fine turno è un documento datato — vedi
//                      la ragione per esteso sopra `disponibilitaTurno`)
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

import { parseCsvLine, numIt, isIntestazione, csvCell, numeroScritto, oggiISO as oggiISOShell, isoLocale } from "../../shared/deepwork-id-client/dw-shell.js";

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

// numeroDaCampo: legge un numero SCRITTO A MANO in un campo, e dice cosa è
// andato storto invece di rispondere zero. Serve perché i campi decimali non
// possono più essere `type="number"`: misurato in Chromium, digitando «44,7» in
// un `type=number` il `.value` diventa **«447»** e `checkValidity()` risponde
// true — il browser scarta la virgola, tiene le cifre e chiama valido un numero
// dieci volte più grande. Su una carica di esplosivo per foro sono 447 kg al
// posto di 44,7, e quel numero esce nel CSV che torna a Genesi a tarare la
// riconciliazione. Quindi i campi decimali diventano `type="text"
// inputmode="decimal"` e il numero lo leggiamo noi.
//
// `numIt` accetta «44,7» e «44.7», e le migliaia in entrambe le convenzioni.
// Ritorna { vuoto, ok, valore, grezzo, motivo }: `valore` è null quando non si
// è capito, MAI zero — vuoto e incomprensibile non sono la stessa cosa e
// nessuno dei due è una misura. Pura e testabile.
export function numeroDaCampo(testo, opts = {}) {
  // Delega al lettore CONDIVISO (`shared/deepwork-id-client/dw-shell.js`), che
  // aggiunge la cosa che qui mancava: «1.250» non viene più letto 1,25 in
  // silenzio. Se per il campo una sola lettura è possibile si risolve, se sono
  // due si chiede. Qui resta solo ciò che è di Campo: tre decimali, cioè il
  // grammo — ben oltre la precisione con cui si pesa una carica in cava, ed è
  // la cifra con cui il consuntivo esce nel CSV per Genesi.
  return numeroScritto(testo, { decimali: 3, ...opts });
}

// Giorno di lavoro corrente in ISO (aaaa-mm-gg) e in ora LOCALE: usare
// toISOString() sulla data grezza darebbe il giorno UTC e in Italia, la sera
// tardi, sbaglierebbe di un giorno intero.
// La regola serviva a SEI posti (qui, Flotta, Scudo, Terra, Sentinella e —
// scritta male — Conti), quindi dal 31/07 vive in `shared/`. Questo è un
// ALIAS, non una seconda implementazione: le pagine di Campo continuano a
// chiamarlo `oggiISO` e il test pretende l'identità, non il comportamento.
export const oggiISO = oggiISOShell;

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
const GIORNI_FA = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return isoLocale(d); };

export const DEMO = {
  attivita: [
    { id: "a1", data: OGGI_DEMO, turno: "Mattina", titolo: "Perforazione fronte Est", dettaglio: "14/22 fori", squadra: "Squadra A", operatore: "Luca Bianchi", stato: "in-corso" },
    { id: "a2", data: OGGI_DEMO, turno: "Mattina", titolo: "Volata fronte Nord", dettaglio: "Ore 12:30", squadra: "Squadra A", operatore: "Mario Rossi", stato: "pianificata" },
    { id: "a3", data: OGGI_DEMO, turno: "Mattina", titolo: "Carico e trasporto", dettaglio: "Piazzale 2 → frantoio", squadra: "Squadra B", operatore: "", stato: "in-corso" },
    // il fermo della dimostrazione ha CAUSALE e MINUTI: senza, il Pareto dei
    // fermi e la disponibilità del turno non possono che dire «non misurato»,
    // e nel giro di dimostrazione si vedrebbero solo schermate di rifiuto
    { id: "a4", data: OGGI_DEMO, turno: "Mattina", titolo: "Frantoio primario", dettaglio: "Fermo per intasamento tramoggia", squadra: "Squadra C", operatore: "", stato: "anomalia", causale: "Intasamento impianto", fermoMin: 55 },
    { id: "a5", data: OGGI_DEMO, turno: "Mattina", titolo: "Controllo pre-turno mezzi", dettaglio: "completato", squadra: "Squadra B", operatore: "Giulia Verdi", stato: "conclusa" },
  ],
  squadre: [
    { id: "q1", nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" },
    { id: "q2", nome: "Squadra B — Carico", persone: 3, area: "piazzale 2", stato: "operativa" },
    { id: "q3", nome: "Squadra C — Impianto", persone: 2, area: "frantoio", stato: "ferma" },
  ],
  // GLI OPERATORI SONO LE STESSE PERSONE CHE STANNO IN SCUDO, e ora lo dicono con
  // un ID (`lavoratoreId`), non col nome. Prima le due dimostrazioni erano state
  // inventate separatamente e contenevano un «Marco Rossi» qui e un «Mario Rossi»
  // là: due persone diverse con lo stesso cognome, che qualunque accoppiamento per
  // nome avrebbe scambiato — dichiarando in regola qualcuno guardando i documenti
  // di un altro. Ora i nomi coincidono con quelli di Scudo perché è la stessa
  // azienda, e il collegamento resta comunque l'ID.
  // L'ultimo è SENZA collegamento apposta: è il caso di chi è appena entrato e in
  // Scudo non è ancora registrato, e la schermata deve saperlo dire.
  operatori: [
    { id: "o1", nome: "Mario Rossi", ruolo: "Fochino", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d1" },
    { id: "o2", nome: "Luca Bianchi", ruolo: "Perforatore", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d2" },
    { id: "o3", nome: "Giulia Verdi", ruolo: "Caposquadra", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d3" },
    { id: "o4", nome: "Paolo Gallo", ruolo: "Autista", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d5" },
    { id: "o5", nome: "Youssef Amrani", ruolo: "Manutentore", squadra: "Squadra C", stato: "non-disponibile" },
  ],
  // I LAVORATORI E LE SCADENZE CHE IN ESERCIZIO ARRIVANO DA SCUDO (ponte P3, sola
  // lettura). Qui sono finti ma COPIATI dalla dimostrazione di Scudo, id per id:
  // se le due dimostrazioni dicessero cose diverse sulla stessa persona, la
  // dimostrazione dell'ecosistema smentirebbe sé stessa. Le date sono quelle di
  // Scudo: d1 ha la visita medica scaduta il 02/07, d2 un corso scaduto l'11/07,
  // d3 la formazione in scadenza il 09/08, d5 è in regola.
  // TUTTI i lavoratori di Scudo, non solo quelli già collegati: la prima versione
  // ne copiava quattro su sette, e in dimostrazione risultavano tutti presi —
  // chi apriva «collega» trovava un elenco di voci disabilitate senza nessuno da
  // scegliere. In un'azienda vera l'anagrafica del personale è più larga della
  // squadra in turno, ed è proprio da lì che si pesca.
  // I FRONTI, letti da Terra. Nella dimostrazione sono gli stessi tre di
  // `terra-data.js`, identificativi compresi: se qui ne inventassi altri il
  // ponte funzionerebbe in demo e si romperebbe in produzione, che è il modo
  // peggiore di sbagliare — la prova nella suite pretende che coincidano.
  frontiTerra: [
    { id: "f1", nome: "Fronte Nord", stato: "attivo" },
    { id: "f2", nome: "Fronte Est", stato: "attivo" },
    { id: "f3", nome: "Fronte Sud", stato: "sospeso" },
  ],
  lavoratoriScudo: [
    { id: "d1", nome: "Mario Rossi", ruolo: "Fochino", attivo: true },
    { id: "d2", nome: "Luca Bianchi", ruolo: "Escavatorista", attivo: true },
    { id: "d3", nome: "Giulia Verdi", ruolo: "Preposto", attivo: true },
    { id: "d4", nome: "Anna Neri", ruolo: "Impiegata", attivo: true },
    { id: "d5", nome: "Paolo Gallo", ruolo: "Autista", attivo: true },
    { id: "d6", nome: "Franco Riva", ruolo: "Fochino", attivo: true },
    { id: "d7", nome: "Sara Conti", ruolo: "RSPP esterno", attivo: true },
  ],
  scadenzeScudo: [
    { id: "s1", lavoratoreId: "d1", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-07-02" },
    { id: "s2", lavoratoreId: "d1", tipo: "Patente", descrizione: "Patente di guida", dataScadenza: "2028-05-30" },
    { id: "s3", lavoratoreId: "d2", tipo: "Corso", descrizione: "Corso di aggiornamento", dataScadenza: "2026-07-11" },
    { id: "s4", lavoratoreId: "d2", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2027-04-08" },
    { id: "s5", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione specifica", dataScadenza: "2026-08-09" },
    { id: "s6", lavoratoreId: "d3", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2027-02-11" },
    { id: "s9", lavoratoreId: "d6", tipo: "DPI", descrizione: "Otoprotettori", dataScadenza: "2026-08-15" },
    { id: "s7", lavoratoreId: "d5", tipo: "Patente", descrizione: "Patente di guida", dataScadenza: "2026-09-02" },
    { id: "s8", lavoratoreId: "d5", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2027-05-20" },
  ],
  rapportini: [
    // i turni dei giorni fra i due voli del drone: servono al ponte con Terra
    { id: "rs1", data: GIORNI_FA(19), turno: "Mattina",    titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2400, prodUnita: "t", ora: "13:00", stato: "inviato", fronteId: "f1" },
    { id: "rs2", data: GIORNI_FA(17), turno: "Mattina",    titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2550, prodUnita: "t", ora: "13:10", stato: "inviato", fronteId: "f1" },
    { id: "rs3", data: GIORNI_FA(14), turno: "Pomeriggio", titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2400, prodUnita: "t", ora: "20:00", stato: "inviato", fronteId: "f2" },
    { id: "rs4", data: GIORNI_FA(12), turno: "Mattina",    titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2200, prodUnita: "t", ora: "12:50", stato: "inviato", fronteId: "f1" },
    { id: "rs5", data: GIORNI_FA(9),  turno: "Mattina",    titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2450, prodUnita: "t", ora: "13:05", stato: "inviato", fronteId: "f2" },
    // rs6 resta di proposito SENZA fronte: la ripartizione deve saper dire
    // «questa non si sa da dove viene» invece di spalmarla a intuito
    { id: "rs6", data: GIORNI_FA(8),  turno: "Pomeriggio", titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 1860, prodUnita: "t", ora: "19:55", stato: "inviato" },
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
  // il turno di Mattina della dimostrazione dura 8 ore DICHIARATE: è il
  // denominatore senza il quale la disponibilità non si calcola
  durate: [
    { id: "t1", data: OGGI_DEMO, turno: "Mattina", minuti: 480, ora: "06:00" },
  ],
  pianocarico: [],
  // I RILIEVI che in esercizio arrivano da Terra (ponte P2, sola lettura). Qui
  // sono finti ma coerenti coi rapportini qui sotto: due voli a 21 e 7 giorni
  // fa, e fra i due i turni hanno dichiarato una produzione che ci si avvicina.
  rilieviTerra: [
    { id: "rt1", data: GIORNI_FA(21), stato: "elaborato", volumeM3: 8200, provenienza: "scavo", fronteId: "f1" },
    { id: "rt2", data: GIORNI_FA(7),  stato: "elaborato", volumeM3: 7600, provenienza: "scavo", fronteId: "f1" },
  ],
  // l'autorizzazione di Terra serve solo per il MATERIALE, da cui si ricava la
  // densità: senza, tonnellate e metri cubi non si parlano
  autorizzazioniTerra: [
    { id: "at1", stato: "vigente", materiale: "Sabbia e ghiaia" },
  ],
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

// Etichetta di assegnazione di un'attività: "Squadra A · Mario Rossi",
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
    mappa[d] = { data: d, prod: {}, minutiFermo: 0, fermi: 0, fermiSenzaMinuti: 0, attTot: 0, attConcluse: 0, rapInviati: 0, rapTot: 0 };
  }
  for (const a of attivita || []) {
    const g = mappa[String((a && a.data) || "").trim()];
    if (!g) continue;
    g.attTot++;
    if (a.stato === "conclusa") g.attConcluse++;
    if (a.stato === "anomalia") {
      // quanti fermi NON hanno i minuti: senza questo conto la giornata con
      // tre guasti mai misurati e quella senza nemmeno un fermo escono dalla
      // stessa parte, «0 min», che è il numero tranquillo dove non è stato
      // misurato niente (stessa regola di `disponibilitaTurno`)
      const m = Math.max(0, +a.fermoMin || 0);
      g.minutiFermo += m; g.fermi++;
      if (!m) g.fermiSenzaMinuti++;
    }
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
    minutiFermo: 0, fermi: 0, fermiSenzaMinuti: 0, attTot: 0, attConcluse: 0, rapInviati: 0,
  };
  for (const g of righe || []) {
    out.minutiFermo += g.minutiFermo; out.fermi += g.fermi;
    out.fermiSenzaMinuti += Math.max(0, +g.fermiSenzaMinuti || 0);
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

// Causali di fermo STANDARDIZZATE: senza una lista fissa non si può misurare
// dove si perde tempo (servono categorie confrontabili nel tempo, non testo
// libero). Sono le voci tipiche di un fermo in cava.
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

// ══════════════════════════════════════════════════════════════════════
// DISPONIBILITÀ DI TURNO (proposta 7 di docs/RICERCA_CAMPO_202607.md §3)
// ══════════════════════════════════════════════════════════════════════
// ⛔ SI CHIAMA **DISPONIBILITÀ**, E NON SI CHIAMERÀ MAI «OEE». L'OEE è il
// prodotto di tre fattori — disponibilità × prestazione × qualità — e noi la
// prestazione (il ritmo effettivo contro quello nominale) e la qualità (lo
// scarto sul prodotto) NON le misuriamo: servirebbero portata e granulometria
// in continuo, cioè hardware che non abbiamo. Scrivere «OEE» su un documento
// che il cliente consegna vorrebbe dire dichiarare una misura che non è stata
// fatta. Qui si calcola SOLO la disponibilità, e si dice esattamente da cosa
// viene: ore di turno DICHIARATE meno minuti di fermo REGISTRATI.
//
// La durata del turno è un RECORD PER GIORNO+TURNO (collezione `durate`), non
// un'impostazione unica dell'organizzazione. Tre ragioni, in ordine di peso:
//  1. il rapporto di fine turno è un DOCUMENTO DATATO: «turno di 8 h» dev'essere
//     un fatto registrato quel giorno. Con un'impostazione globale, cambiarla a
//     novembre riscriverebbe all'indietro la disponibilità di tutti i rapporti
//     già stampati e consegnati — e nessuno se ne accorgerebbe;
//  2. i turni veri non durano tutti uguale: mezza giornata, sabato corto,
//     fermata dell'impianto, straordinario. Con un numero solo, il sabato da
//     4 ore uscirebbe con una disponibilità disastrosa e nessuno potrebbe
//     correggerla;
//  3. è il meccanismo che Campo usa già per obiettivo, meteo, checklist,
//     appello e chiusura: un record per giorno+turno. Un concetto nuovo non ha
//     bisogno di un meccanismo nuovo.
// Il costo (dichiararla ogni turno) lo paga `ultimaDurataTurno`, che propone
// nel campo l'ultima durata dichiarata: proporre un valore in un campo che
// l'utente conferma NON è calcolare con un dato che nessuno ha scritto.

// La durata dichiarata per quel giorno e turno (l'ultima salvata vince, come
// per l'obiettivo e il meteo). Pura e testabile.
export function durataTurnoDi(durate, data, turno) {
  const trovate = (durate || []).filter(d => d
    && String(d.data || "") === String(data || "")
    && String(d.turno || "") === String(turno || ""));
  return trovate.length ? trovate[trovate.length - 1] : null;
}

// L'ultima durata dichiarata in assoluto (la più recente per giorno, e a parità
// di giorno il turno più avanti nella giornata). Serve SOLO a precompilare il
// campo: non entra in nessun calcolo. null se non ne è mai stata dichiarata
// una valida. Pura e testabile.
export function ultimaDurataTurno(durate) {
  const valide = (durate || []).filter(d => d && Number.isFinite(+d.minuti) && +d.minuti > 0);
  if (!valide.length) return null;
  const ord = (t) => { const i = TURNI.indexOf(String(t || "")); return i < 0 ? -1 : i; };
  return valide.slice().sort((a, b) => {
    const da = String(a.data || ""), db = String(b.data || "");
    if (da !== db) return da < db ? -1 : 1;
    return ord(a.turno) - ord(b.turno);
  }).pop();
}

// Minuti scritti come li direbbe un capocantiere: «8 h», «7 h 30 min»,
// «45 min». Pura e testabile.
export function oreMinuti(min) {
  /* ⛔ `+null` fa ZERO, e «0 min» è un'AFFERMAZIONE: dice che il tempo è stato
     misurato e vale zero. Un tempo che manca non si scrive. Oggi nessun
     chiamante passa null — sono tutti guardati a monte — ma è la trappola
     dormiente già raccolta in CLAUDE.md, e costa una riga chiuderla. */
  if (min === null || min === undefined || String(min).trim() === "") return "";
  const n = Math.round(+min);
  if (!Number.isFinite(n) || n < 0) return "";
  const h = Math.floor(n / 60), m = n % 60;
  if (!h) return m + " min";
  return h + " h" + (m ? " " + m + " min" : "");
}

// IL TEMPO PERSO SCRITTO SENZA MENTIRE. Tre posti di Campo mostrano i minuti
// di fermo — il cartellone della settimana, la riga di ogni giornata e la
// colonna «Tempo perso» del rapporto stampato — e tutti e tre scrivevano
// «0 min» quando i fermi c'erano ma nessuno aveva messo i minuti. È lo stesso
// numero tranquillo che `disponibilitaTurno` si rifiuta di dare: «0 min persi»
// afferma che il tempo è stato misurato e vale zero, mentre la verità è che
// non è stato misurato. Qui si dice quale delle tre cose è:
//  · nessun fermo registrato → «0 min», ed è una misura vera (c'eravamo e non
//    ci siamo fermati);
//  · fermi registrati, nessuno con i minuti → «senza minuti»;
//  · alcuni sì e alcuni no → «almeno N min», perché il tempo perso è ALMENO
//    quello, mai esattamente quello.
// Pura e testabile.
export function minutiFermoTesto(minuti, fermi, senzaMinuti) {
  const f = Math.max(0, Math.round(+fermi || 0));
  const s = Math.max(0, Math.round(+senzaMinuti || 0));
  // ⛔ la guardia PRIMA della conversione: `+null` fa 0 e `Number.isFinite(0)`
  // risponde true, quindi «non lo so» diventerebbe «zero minuti persi»
  const m = (minuti === null || minuti === undefined || String(minuti).trim() === "") ? null : +minuti;
  if (!Number.isFinite(m) || m < 0) return "senza minuti";
  if (f && s >= f) return "senza minuti";
  if (f && s > 0) return "almeno " + numeroIt(m, 0) + " min";
  return numeroIt(m, 0) + " min";
}

// Soglie della disponibilità di turno. Non sono sacre e non vengono da una
// norma: nel comparto estrattivo un obiettivo di disponibilità dei mezzi
// dell'85-90% è quello che si legge nelle fonti tecniche, quindi sotto l'85%
// il turno merita uno sguardo e sotto il 70% è un turno andato storto. Stanno
// qui, in un posto solo, perché siano discutibili senza cercarle nelle pagine.
export const DISPONIBILITA_OK = 85;
export const DISPONIBILITA_WARN = 70;

// LA DISPONIBILITÀ DEL TURNO + LA CAUSALE PEGGIORE.
//
// Ritorna sempre un oggetto (mai null): quando il numero non si può fare, il
// numero è `null` e `motivo` dice PERCHÉ. È la regola del prodotto: l'assenza
// di un dato non è un dato favorevole, e «100%» dove non si è misurato niente
// è esattamente il numero tranquillo che quella regola vieta.
//
// Tre modi in cui il numero NON si fa (`stato: "non-calcolabile"`, con
// `mancano` che elenca cosa manca):
//  · la durata del turno non è stata dichiarata — senza il denominatore non
//    esiste percentuale;
//  · non c'è nessuna attività registrata per quel turno — non c'è niente da
//    cui misurare, e un turno vuoto non è un turno perfetto;
//  · ci sono fermi registrati ma NESSUNO ha i minuti. Questo è il caso
//    insidioso: la somma farebbe 0 minuti persi e quindi il 100%, cioè il
//    voto più alto proprio al turno che ha registrato guasti e non li ha
//    misurati.
// E un quarto stato, `"oltre"`: i minuti di fermo superano la durata del
// turno. Succede davvero, con due fermi sovrapposti contati due volte. Una
// percentuale negativa sarebbe una bugia con l'aria di un dato: si dice invece
// che i due numeri non tornano.
//
// `parziale` è vero quando ALCUNI fermi hanno i minuti e altri no: allora la
// percentuale è un MASSIMO («al più»), non una misura, e chi la mostra deve
// dirlo.
// Pura e testabile.
export function disponibilitaTurno(attivita, durate, data, turno) {
  const d = String(data || ""), t = String(turno || "");
  const delTurno = (attivita || []).filter(a => a
    && String(a.data || "") === d && String(a.turno || "") === t);
  const rec = durataTurnoDi(durate, d, t);
  const durataMin = rec && Number.isFinite(+rec.minuti) && +rec.minuti > 0
    ? Math.round(+rec.minuti) : null;
  const par = paretoFermi(delTurno);
  const fermiMin = par.totaleMin;
  const anomalie = delTurno.filter(a => a.stato === "anomalia");
  const conMinuti = anomalie.filter(a => Math.max(0, +a.fermoMin || 0) > 0).length;
  const out = {
    data: d, turno: t,
    durataMin, fermiMin,
    attivita: delTurno.length,
    fermi: anomalie.length,
    fermiConMinuti: conMinuti,
    fermiSenzaMinuti: anomalie.length - conMinuti,
    // la causale su cui si è perso più tempo: esiste solo se dei minuti sono
    // stati misurati davvero (a zero minuti non c'è nessuna "peggiore")
    peggiore: par.voci.length && par.voci[0].minuti > 0
      ? { causale: par.voci[0].causale, minuti: par.voci[0].minuti, conto: par.voci[0].conto }
      : null,
    lavoratiMin: null, pct: null, parziale: false,
    stato: "non-calcolabile", mancano: [], motivo: "",
  };
  // `mancano` porta i CODICI (per chi deve decidere cosa mostrare), `motivo`
  // la frase per chi legge: due mestieri diversi nello stesso oggetto, ma non
  // nello stesso campo — altrimenti chi controlla «manca la durata» finisce a
  // cercare sottostringhe dentro una frase, e la frase un giorno cambia.
  const mancano = [], detto = [];
  if (durataMin === null) {
    mancano.push("durata");
    detto.push("la durata del turno non è stata dichiarata");
  }
  if (!delTurno.length) {
    mancano.push("attività");
    detto.push("non è registrata nessuna attività per questo turno");
  }
  if (anomalie.length && !conMinuti) {
    mancano.push("minuti");
    detto.push(anomalie.length === 1
      ? "l'unico fermo registrato è senza minuti"
      : "i " + anomalie.length + " fermi registrati sono tutti senza minuti");
  }
  if (mancano.length) {
    out.mancano = mancano;
    // niente preambolo «disponibilità non calcolata:» dentro il motivo: lo dice
    // già `stato`, e chi lo mostra lo scrive nel titolo — scritto in tutti e due
    // i posti, sulla schermata compariva due volte di fila
    const testo = detto.join("; ");
    out.motivo = testo.charAt(0).toUpperCase() + testo.slice(1)
      + ". Un numero qui direbbe che il turno è andato bene, mentre la verità è che non è stato misurato.";
    return out;
  }
  out.parziale = out.fermiSenzaMinuti > 0;
  if (fermiMin > durataMin) {
    out.stato = "oltre";
    out.motivo = "I minuti di fermo registrati (" + numeroIt(fermiMin, 0) + ") superano la durata dichiarata del turno ("
      + numeroIt(durataMin, 0) + "): probabilmente due fermi si sovrappongono e sono stati contati due volte, "
      + "oppure la durata dichiarata è sbagliata. Finché i due numeri non tornano la disponibilità non si calcola: "
      + "una percentuale negativa non esiste.";
    return out;
  }
  out.lavoratiMin = durataMin - fermiMin;
  out.pct = Math.round(100 * out.lavoratiMin / durataMin);
  out.stato = out.pct >= DISPONIBILITA_OK ? "ok" : out.pct >= DISPONIBILITA_WARN ? "warn" : "basso";
  // UNA MISURA INCOMPLETA NON PRENDE IL VERDE. Se qualche fermo è senza minuti
  // la percentuale è un massimo: quella vera può stare sotto la soglia, e il
  // colore tranquillo direbbe «è andata bene» su un turno che non sappiamo
  // com'è andato. Si decide QUI e non nella pagina, se no il prossimo posto che
  // mostra questo numero ricomincia a dipingerlo di verde.
  if (out.parziale && out.stato === "ok") out.stato = "warn";
  // Il motivo NON ripete la percentuale: chi lo mostra la scrive già accanto,
  // e scritta in tutti e due i posti compariva due volte nella stessa riga.
  out.motivo = out.parziale
    ? out.fermiSenzaMinuti
      + (out.fermiSenzaMinuti === 1 ? " fermo è senza minuti" : " fermi sono senza minuti")
      + ": il tempo perso è almeno questo, quindi la disponibilità è al massimo questa."
    : "";
  return out;
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
// pct = concluse / totale, e null quando non c'è nessuna attività: zero su
// zero non è «non abbiamo ancora fatto niente», è «non c'è niente da dire», e
// uno «0%» in un cartellone si legge come una giornata ferma. È la stessa
// risposta che `totaliSettimana` dà già alla stessa domanda (pctConcluse), e
// finora le due funzioni la davano diversa. Pura e testabile.
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
    pct: totale > 0 ? Math.round(100 * per.conclusa / totale) : null,
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
        /* ⚠️ Niente zero di comodo: «0 persone» è un'AFFERMAZIONE, e falsa —
           il file semplicemente non lo diceva. La squadra entra lo stesso
           (esiste e va assegnata), e la scheda scrive «persone non indicate».
           Uno zero scritto apposta resta zero: una squadra si può svuotare. */
        persone: Number.isFinite(n) ? Math.max(0, Math.round(n)) : null,
        area: (area || "").trim(),
        stato: (stato || "").trim().toLowerCase() === "ferma" ? "ferma" : "operativa",
      };
    })
    .filter(q => q.nome);
}

// ══════════════════════════════════════════════════════════════════════
// PIANO DI CARICO DA CSV — si legge per NOME di colonna, non per posizione
// ══════════════════════════════════════════════════════════════════════
// Prima si leggeva solo per posizione (foro;x;fila;prof;prog;borr;rit) e i nomi
// scritti nell'intestazione non venivano guardati. Il file che esce da Genesi ha
// l'ordine giusto, quindi il percorso normale funzionava; ma un file rifatto a
// mano con le colonne in ordine diverso **si caricava comunque, senza un
// errore**: trovato per caso sbagliando l'intestazione in una prova, la
// profondità era finita nel borraggio e il ritardo nella carica progettata, e
// la riga sembrava perfettamente normale. Un piano di carico sbagliato che ha
// l'aria di essere giusto è peggio di un import rifiutato.
//
// Adesso: se c'è un'intestazione, comandano i NOMI; se non c'è, si legge per
// posizione come prima — i file vecchi e quelli senza intestazione continuano a
// funzionare identici.
//
// Solo `foro` e `prog` servono per calcoli e chiavi, quindi si coercono a
// numero e le righe non valide si scartano. Gli altri campi restano testo
// grezzo del file: vanno SEMPRE escapati dove mostrati (docs/AUDIT_SICUREZZA.md
// punto 13). Pure e testabili.
const PIANO_COLONNE = {
  foro: ["foro", "n", "n_foro", "nforo", "numero", "num", "hole", "hole_id"],
  x:    ["x", "x_m", "xm", "posizione", "pos", "distanza"],
  fila: ["fila", "riga", "row", "serie"],
  prof: ["prof", "prof_m", "profm", "profondita", "profondità", "h", "depth", "lunghezza"],
  prog: ["prog", "prog_kg", "carica", "carica_kg", "carica_prog_kg", "kg", "kg_foro", "charge"],
  borr: ["borr", "borr_m", "borrm", "borraggio", "stemming"],
  rit:  ["rit", "rit_ms", "ritms", "ritardo", "delay", "ms"],
};
const _pulisciNome = (s) => String(s == null ? "" : s).trim().toLowerCase()
  .replace(/\(.*?\)/g, "")                 // «carica (kg)» → «carica»
  .replace(/[^a-z0-9àèéìòù_]+/g, "_")
  .replace(/^_+|_+$/g, "");

// mappaPianoCsv: dice COME è stato letto il file, così l'app può scriverlo
// all'utente invece di lasciarlo indovinare. Ritorna
// { conIntestazione, indici, riconosciute, ignorate, mancanti }.
// Il contratto di parsePianoCsv NON cambia (ritorna sempre l'elenco delle
// righe): chi la usava continua a funzionare valore per valore.
export function mappaPianoCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  const testa = righe.find(r => isIntestazione(r, "foro"));
  if (!testa) return { conIntestazione: false, indici: null, riconosciute: [], ignorate: [], mancanti: [] };
  const celle = parseCsvLine(testa).map(_pulisciNome);
  const indici = {}, riconosciute = [], ignorate = [];
  celle.forEach((nome, i) => {
    const campo = Object.keys(PIANO_COLONNE).find(k => PIANO_COLONNE[k].includes(nome));
    if (campo && indici[campo] === undefined) { indici[campo] = i; riconosciute.push({ campo, nome, i }); }
    else if (nome) ignorate.push(nome);
  });
  const mancanti = Object.keys(PIANO_COLONNE).filter(k => indici[k] === undefined);
  return { conIntestazione: true, indici, riconosciute, ignorate, mancanti };
}

export function parsePianoCsv(text) {
  const m = mappaPianoCsv(text);
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "foro"))
    .map(r => {
      const c = parseCsvLine(r);
      // con l'intestazione comandano i nomi; senza, si legge per posizione
      const g = (campo, pos) => {
        const i = m.conIntestazione ? m.indici[campo] : pos;
        return i === undefined ? "" : c[i];
      };
      return { foro: numIt(g("foro", 0)), x: g("x", 1), fila: g("fila", 2), prof: g("prof", 3),
               prog: numIt(g("prog", 4)), borr: g("borr", 5), rit: g("rit", 6), reale: null };
    })
    .filter(p => p.foro > 0 && p.prog > 0);
}

// I NUMERI DI FORO CHE COMPAIONO PIÙ DI UNA VOLTA nel piano appena letto.
//
// ⛔ QUI LA DECISIONE È L'OPPOSTA DI QUELLA PRESA NEGLI ALTRI IMPORT. Ovunque
// il doppione dentro il file si TOGLIE (regola `senzaDoppioni` di `shared/`);
// in un piano di carico **non si tocca niente**, si dice e basta. Il motivo è
// che qui il doppione non è un fastidio da ripulire: è un **errore nel
// progetto della volata**, e chi deve saperlo è il fochino.
//
// Toglierlo in silenzio sarebbe la cosa peggiore possibile — sparirebbe una
// riga di carica dal piano, il totale dell'esplosivo scenderebbe, e nessuno
// saprebbe perché. Tenerle tutte e due senza dirlo è quasi altrettanto brutto:
// il foro 7 comparirebbe due volte nella lista e la seconda carica sembrerebbe
// una svista dell'app. Quindi: **entrano entrambe, e l'app lo dichiara prima
// di scrivere**, insieme agli altri avvisi sul file.
//
// Restituisce i numeri di foro ripetuti, in ordine, senza ripetersi a sua
// volta. Pura e testabile.
export function foriRipetuti(righe) {
  const visti = new Set(), doppi = [];
  for (const r of righe || []) {
    const f = r && r.foro;
    if (!Number.isFinite(f)) continue;
    if (visti.has(f)) { if (!doppi.includes(f)) doppi.push(f); }
    else visti.add(f);
  }
  return doppi;
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
  // ⛔ NESSUN FORO REGISTRATO: NIENTE PERCENTUALE E NIENTE VERDE.
  // Con zero cariche reali lo stimato È il progettato per costruzione, quindi
  // la differenza fa 0 e `scartoLivello` risponde «ok»: la pillola verde
  // «+0%» compariva su una volata in cui nessuno aveva ancora pesato un solo
  // foro. È esattamente il colore tranquillo dove non è stato misurato niente.
  // Si risponde con la parola che l'app usa già foro per foro — «da-registrare»
  // — e con `pct` a null, che chi disegna deve gestire invece di stampare uno
  // zero. Il totale progettato resta: quello è scritto nel piano, è un dato.
  if (!reg.length) {
    return {
      registrati: 0,
      totale: piano.length,
      progettatoKg,
      stimatoKg,
      pct: null,
      livello: "da-registrare",
    };
  }
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

// ══════════════════════════════════════════════════════════════════════
// PONTE P3 CON SCUDO — la regola sta in `shared/dw-ponti.js` perché serve a due
// app, e Campo la ri-esporta col nome con cui la chiamano le sue pagine.
// ══════════════════════════════════════════════════════════════════════
export {
  ESITI_TURNO, statoScadenzaHSE, idoneitaOperatore, idoneitaDiTurno, inTurnoOggi,
} from "../../shared/dw-ponti.js";

// PONTE P2 CON TERRA — la produzione del turno attribuita al fronte. Stessa
// regola di sempre: sta in `shared/` perché serve a due app, e qui si
// ri-esporta. Un alias non è una seconda implementazione.
export { produzionePerFronte } from "../../shared/dw-ponti.js";

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
        durate: () => read("durate"),
        pianocarico: () => read("pianocarico"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
      // ── PONTE P2 CON TERRA — SOLA LETTURA ─────────────────────────────
      // Il gemello di `rapportiniCampo()` in apps/terra/terra-data.js: seconda
      // istanza dell'SDK sull'app "terra", stessa organizzazione, percorso
      // costruito da `orgCollection` — nessun percorso Firestore a mano, quindi
      // l'isolamento fra organizzazioni vale anche qui. Nessuna scrittura: Campo
      // legge i rilievi, non li tocca.
      // Si apre solo quando serve, così l'avvio di Campo non rallenta. Se Terra
      // non c'è, o se la lettura non è permessa, torna null: la pagina dirà che
      // il confronto non è disponibile, senza inventare uno zero.
      let idTerra;                     // undefined = mai provato, null = non c'è
      api.rilieviTerra = async () => {
        if (idTerra === undefined) {
          try { idTerra = await DeepworkID.init({ appId: "terra" }); }
          catch (e) { idTerra = null; }
        }
        if (!idTerra) return null;
        try {
          return (await getDocs(idTerra.orgCollection("rilievi")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      // i FRONTI di Terra: servono alla tendina del rapportino, perché il
      // fronte si sceglie da un elenco e si registra col suo identificativo.
      // ⛔ Mai per nome: basta che qualcuno rinomini un fronte e la produzione
      // finisce su quello sbagliato, su un numero che va nella denuncia.
      // Se Terra non c'è torna null, e la tendina lo dice invece di mostrarsi
      // vuota come se non ci fossero fronti.
      api.frontiTerra = async () => {
        if (idTerra === undefined) {
          try { idTerra = await DeepworkID.init({ appId: "terra" }); }
          catch (e) { idTerra = null; }
        }
        if (!idTerra) return null;
        try {
          return (await getDocs(idTerra.orgCollection("fronti")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      // e l'autorizzazione, da cui si ricava la densità del materiale: a chi
      // compila un rapportino non si chiede un numero che è già registrato
      api.autorizzazioniTerra = async () => {
        if (idTerra === undefined) {
          try { idTerra = await DeepworkID.init({ appId: "terra" }); }
          catch (e) { idTerra = null; }
        }
        if (!idTerra) return null;
        try {
          return (await getDocs(idTerra.orgCollection("autorizzazioni")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      // ── PONTE P3 CON SCUDO — SOLA LETTURA ─────────────────────────────
      // Stesso schema del ponte con Terra: seconda istanza dell'SDK sull'app
      // "scudo", stessa organizzazione, percorso costruito da `orgCollection`.
      // Campo LEGGE i documenti del personale e non li tocca mai: chi rinnova una
      // visita medica lo fa in Scudo, che è l'unica strada per scrivere quel dato.
      // Se Scudo non c'è, o la lettura non è permessa, torna null e la schermata
      // dice che non lo sa — non inventa un «tutto a posto», che su un controllo
      // di sicurezza è la bugia peggiore.
      let idScudo;                     // undefined = mai provato, null = non c'è
      const apriScudo = async () => {
        if (idScudo === undefined) {
          try { idScudo = await DeepworkID.init({ appId: "scudo" }); }
          catch (e) { idScudo = null; }
        }
        return idScudo;
      };
      const leggiScudo = async (nome) => {
        const s = await apriScudo();
        if (!s) return null;
        try {
          return (await getDocs(s.orgCollection(nome))).docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      api.lavoratoriScudo = () => leggiScudo("lavoratori");
      api.scadenzeScudo = () => leggiScudo("scadenze");
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) { /* backend assente: demo */ }

  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      attivita: async () => mem.attivita,
      squadre: async () => mem.squadre,
      operatori: async () => mem.operatori || (mem.operatori = []),
      rapportini: async () => mem.rapportini,
      // in dimostrazione i rilievi non arrivano da Terra: sono finti, ma
      // coerenti coi rapportini d'esempio (vedi DEMO.rilieviTerra)
      rilieviTerra: async () => mem.rilieviTerra || [],
      // in dimostrazione i documenti del personale non arrivano da Scudo: sono
      // finti, ma copiati dalla dimostrazione di Scudo id per id
      lavoratoriScudo: async () => mem.lavoratoriScudo || [],
      scadenzeScudo: async () => mem.scadenzeScudo || [],
      autorizzazioniTerra: async () => mem.autorizzazioniTerra || [],
      // i fronti di Terra: in dimostrazione sono gli stessi tre di terra-data,
      // identificativi compresi (la suite pretende che coincidano)
      frontiTerra: async () => mem.frontiTerra || [],
      obiettivi: async () => mem.obiettivi || (mem.obiettivi = []),
      checklist: async () => mem.checklist || (mem.checklist = []),
      presenze: async () => mem.presenze || (mem.presenze = []),
      chiusure: async () => mem.chiusure || (mem.chiusure = []),
      meteo: async () => mem.meteo || (mem.meteo = []),
      durate: async () => mem.durate || (mem.durate = []),
      pianocarico: async () => mem.pianocarico || (mem.pianocarico = []),
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
