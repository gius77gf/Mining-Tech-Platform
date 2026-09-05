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
//   presenze/{id}:   { data, turno, operatoreId, nome, stato: presente|assente,
//                      ora, entrata, uscita }
//                     (appello del turno: chi c'è in cava adesso. `ora` è
//                      l'istante in cui QUALCUNO HA SPUNTATO la riga — una
//                      traccia del gesto, non del lavoro; `entrata` e `uscita`
//                      sono gli orari VERI della persona, «HH:MM», e possono
//                      mancare tutt'e due o uno solo: un orario non compilato
//                      NON vuol dire «ha fatto l'orario standard»)
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
//                       reale, da, squadra, idForo }
//                     (piano di carico volata importato da CSV, ponte Genesi;
//                      una riga per foro, salvata come il resto dei dati.
//                      "da" e "squadra" sono CHI ha registrato la carica reale
//                      di QUEL foro: servono al consuntivo che torna a Genesi
//                      e restano vuoti sui piani salvati prima che esistessero)
// La "data" è il giorno di lavoro in formato ISO aaaa-mm-gg: senza di essa
// non esistono storico né conteggi veri (i vecchi record che ne sono privi
// restano visibili come "senza data", vedi eDelGiorno).
// ============================================================

import { parseCsvLine, numIt, isIntestazione, csvCell, numeroScritto, oggiISO as oggiISOShell, isoLocale,
         dataISOEsiste, dataPiuGiorni as dataPiuGiorniShell, conta, plurale, perLettura, mappaColonne, dataIt } from "../../shared/deepwork-id-client/dw-shell.js";
/* la regola sui numeri dichiarati vive in `shared/`: si importa, non si riscrive */
import { numeroDichiarato, applicaPercorsi, traduciCancellazioni, chiaveMateriale, scartoPct, scartoLivello,
         riassuntoVolateDelGiorno, PPV_STRUMENTO } from "../../shared/dw-ponti.js";
/* le volate del giorno si leggono dal registro di Sentinella con la regola di
   `shared/` (05/09): qui il nome per la pagina, non una seconda implementazione */
export { riassuntoVolateDelGiorno } from "../../shared/dw-ponti.js";
/* lo scarto della carica vive in `shared/` dal 05/09 (lo legge anche Genesi):
   qui resta il nome di sempre, e il test pretende che sia lo STESSO oggetto */
export { scartoPct, scartoLivello } from "../../shared/dw-ponti.js";
import { normalizzaPiano, pianoConsuntivoCsv } from "../../shared/dw-ponti.js";
/* le pagine lo chiamano col nome di casa: un alias non è una seconda
   implementazione (regola del `shared/`) */
export { percorsiDi, DW_CANCELLA } from "../../shared/dw-ponti.js";

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
// ⛔ ADESSO È UN ALIAS, NON UNA COPIA (07/08). Questa funzione era identica a
// `perLettura` di `shared/` — misurato prima di toccarla, campione per
// campione: `null` → "", `3466.1` → «3.466,1», `6375` → «6.375». Due copie
// uguali oggi divergono domani senza che nessuno lo veda, ed è successo nella
// stanza accanto: la gemella di Flotta, scritta con lo stesso commento, su
// `null` risponde **«0»** invece di "" — cioè un dato che manca raccontato
// come una misura. Il test pretende l'IDENTITÀ (`campo.numeroIt ===
// shell.perLettura`), non il comportamento, proprio perché il comportamento
// uguale è ciò che c'era prima e non ha impedito niente.
// Le due ragioni che reggevano il corpo restano vere e stanno ora in `shared/`:
// `useGrouping` scritto a mano (al default Node non raggruppa le quattro cifre
// e Chromium sì), e `null`/`""` che NON sono zero.
export const numeroIt = perLettura;

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

// L'ORA IN CUI COMINCIA OGNI TURNO, in un posto solo. Erano tre numeri scritti
// a mano dentro `turnoCorrente`, e finché li leggeva una funzione sola andava
// bene; da quando li legge anche il conto del riposo fra due turni, due copie
// sarebbero due verità che un giorno divergono senza che nessuno lo veda — la
// regola già pagata con la convenzione sui numeri.
export const ORE_INIZIO_TURNO = { Mattina: 6, Pomeriggio: 14, Notte: 22 };

// Turno suggerito in base all'ora, così chi registra non deve sceglierlo ogni
// volta: 6-14 mattina, 14-22 pomeriggio, il resto notte. Pura e testabile.
export function turnoCorrente(adesso = new Date()) {
  const h = adesso.getHours();
  if (h >= ORE_INIZIO_TURNO.Mattina && h < ORE_INIZIO_TURNO.Pomeriggio) return TURNI[0];
  if (h >= ORE_INIZIO_TURNO.Pomeriggio && h < ORE_INIZIO_TURNO.Notte) return TURNI[1];
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
    // ⛔ LE DUE FORME DELLA CAUSALE STANNO TUTT'E DUE NELLA DIMOSTRAZIONE, di
    // proposito. `a4` porta l'ETICHETTA («Intasamento impianto»): è lo storico,
    // scritto quando `CAUSALI_FERMO` era un elenco di testi e la casella
    // salvava la parola. `a6` porta la CHIAVE («intasamento-impianto»): è quello
    // che la casella salva da oggi. Il Pareto li deve sommare nella STESSA
    // causa — se un giorno non lo facesse, questa coppia lo fa vedere.
    { id: "a6", data: OGGI_DEMO, turno: "Mattina", titolo: "Nastro trasportatore", dettaglio: "Rullo di rinvio bloccato", squadra: "Squadra C", operatore: "", stato: "anomalia", causale: "intasamento-impianto", fermoMin: 20 },
    // e una causale che NON sta nell'elenco: finisce in «Altro» ma si conta e
    // si nomina («1 fermo con una causale non in elenco: «Nebbia»»), perché un
    // fermo che sparisce dentro «Altro» in silenzio è un Pareto che mente
    { id: "a7", data: OGGI_DEMO, turno: "Mattina", titolo: "Trasporto al frantoio", dettaglio: "Visibilità nulla sulla pista", squadra: "Squadra B", operatore: "", stato: "anomalia", causale: "Nebbia", fermoMin: 30 },
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
  // LE VOLATE, lette da Sentinella (ponte P6, 05/09). Nella dimostrazione sono
  // le stesse cinque di `sentinella-data.js`, identificativi e date compresi:
  // la prova nella suite pretende che coincidano, per la stessa ragione dei
  // fronti di Terra. Nessuna è di oggi: la consegna in dimostrazione dice
  // «nessuna volata registrata oggi», che è la verità del registro copiato.
  volateSentinella: [
    { id: "b1", data: "2026-07-17", fronte: "Fronte Nord", nFori: 42, kgTotali: 480, stato: "eseguita", codiceVolata: "GEN-20260717-4f2a1" },
    { id: "b2", data: "2026-07-03", fronte: "Fronte Est", nFori: 36, kgTotali: 410 },
    { id: "b3", data: "2026-08-04", fronte: "Fronte Sud", nFori: 38, kgTotali: 430, stato: "prevista", codiceVolata: "GEN-20260804-9c71b" },
    { id: "b4", data: "2026-07-24", fronte: "Fronte Nord", nFori: 34, kgTotali: 390, stato: "eseguita" },
    { id: "b5", data: "2026-07-10", fronte: "Fronte Est", nFori: 40, kgTotali: 455, stato: "eseguita" },
  ],
  lavoratoriScudo: [
    { id: "d1", nome: "Mario Rossi", ruolo: "Fochino", attivo: true },
    /* il giudizio del medico viaggia con la copia (05/09): o2 è Luca Bianchi,
       schierato nella Squadra A operativa, e in Scudo è NON idoneo; o4 è Paolo
       Gallo, coi documenti in regola e le prescrizioni del medico */
    { id: "d2", nome: "Luca Bianchi", ruolo: "Escavatorista", attivo: true, idoneita: "non-idoneo", giudizioIl: "2026-08-20" },
    { id: "d3", nome: "Giulia Verdi", ruolo: "Preposto", attivo: true },
    { id: "d4", nome: "Anna Neri", ruolo: "Impiegata", attivo: true, idoneita: "idoneo", giudizioIl: "2026-03-11" },
    { id: "d5", nome: "Paolo Gallo", ruolo: "Autista", attivo: true, idoneita: "prescrizioni", prescrizioni: "Niente lavori in quota; otoprotettori sempre in cabina", giudizioIl: "2026-06-02" },
    { id: "d6", nome: "Franco Riva", ruolo: "Fochino", attivo: true },
    { id: "d7", nome: "Sara Conti", ruolo: "RSPP esterno", attivo: true },
  ],
  // IL REGISTRO EVENTI CHE IN ESERCIZIO ARRIVA DA SCUDO (ponte P5). Copiato
  // dalla dimostrazione di Scudo, id per id, come i lavoratori: due
  // dimostrazioni che dicessero cose diverse sullo stesso evento
  // smentirebbero l'ecosistema.
  // ⛔ NESSUNO DEI DUE HA IL `turno`, e non è una dimenticanza: sono stati
  // registrati DA SCUDO, che il turno non lo chiede. È proprio il caso che
  // `segnalazioniDelTurno` tiene a parte — «stesso giorno, turno non
  // indicato» — e nella dimostrazione si deve poter vedere.
  infortuniScudo: [
    { id: "i4", data: "2026-07-06", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Nord", luogoTipo: "fronte", categoria: "caduta-massi", rapida: true, descrizione: "Blocco staccato dal ciglio durante il disgaggio" },
    { id: "i5", data: OGGI_DEMO, tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "Impianto", luogoTipo: "impianto", categoria: "impianto", rapida: true, descrizione: "Riparo del nastro 3 trovato aperto a macchina ferma" },
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
    /* ⛔ IL RAPPORTINO SENZA DATA, e non è un refuso della dimostrazione. Un
       rapportino consegnato dal telefono col campo del giorno lasciato vuoto
       non si può collocare in nessuna giornata: sparisce dalla copertura di
       oggi, e la riga della copertura potrebbe dire «tutte a posto» mentre uno
       è rimasto lì. La pagina ha già la frase per dirlo — «(N rapportini
       ancora senza data)» — e finora nessuno poteva vederla, perché tutti e
       nove i rapportini d'esempio avevano il giorno.
       È un'ASSENZA, quindi sta nei dati d'esempio; ed è additiva: la copertura
       di oggi non cambia (2 su 3, provato prima in scratchpad), cambia solo il
       conto di quelli che non si sanno collocare. */
    { id: "rs0", data: "", turno: "Mattina", titolo: "Rapportino trasporti", squadra: "Squadra B", prodQta: 2300, prodUnita: "t", ora: "13:00", stato: "inviato", fronteId: "f1" },
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
  /* ⛔ L'APPELLO DEL TURNO, NEI SUOI TRE STATI. Era `presenze: []`, e con
     l'elenco vuoto l'appello mostrava tutti «da spuntare»: si legge come «la
     funzione non e' mai stata usata», non come «di queste persone non si sa
     niente». Ma il caso per cui l'appello esiste e' proprio il terzo — quello
     PARZIALE, dove qualcuno e' stato visto e qualcuno no.
     E' il principio del fondatore nella sua forma piu' netta, scritta in
     `CLAUDE.md`: «non lo so» non e' «non c'e'», perche' se suona l'allarme
     contare assente chi nessuno ha spuntato vuol dire NON ANDARLO A CERCARE.
     I tre turni di oggi mostrano i tre stati; la data e' relativa, quindi la
     dimostrazione non invecchia, e qualunque sia l'ora si vede il turno in
     corso e si possono guardare gli altri due. */
  presenze: [
    /* Mattina — PARZIALE: o4 non l'ha spuntato nessuno. E' il caso da vedere.
       ⛔ E GLI ORARI SONO DICHIARATI A META' APPOSTA. Il turno di Mattina e'
       IN CORSO: o1 e o2 hanno l'ora di entrata e non quella di uscita, perche'
       non se ne sono ancora andati — e' lo stato normale di meta' giornata, e
       una dimostrazione in cui fossero gia' compilati tutt'e due non
       mostrerebbe mai la meta' che l'app deve saper raccontare. o3 e' assente
       e di orari non ne ha: chi non e' venuto non ha ore da dichiarare. */
    { id: "pr1", data: GIORNI_FA(0), turno: "Mattina", operatoreId: "o1", stato: "presente", ora: "06:12", entrata: "06:10" },
    { id: "pr2", data: GIORNI_FA(0), turno: "Mattina", operatoreId: "o2", stato: "presente", ora: "06:15", entrata: "06:15" },
    { id: "pr3", data: GIORNI_FA(0), turno: "Mattina", operatoreId: "o3", stato: "assente",  ora: "06:30" },
    // Pomeriggio — COMPLETO: il contrasto, tutti e quattro spuntati
    { id: "pr4", data: GIORNI_FA(0), turno: "Pomeriggio", operatoreId: "o1", stato: "presente", ora: "14:05" },
    { id: "pr5", data: GIORNI_FA(0), turno: "Pomeriggio", operatoreId: "o2", stato: "assente",  ora: "14:05" },
    { id: "pr6", data: GIORNI_FA(0), turno: "Pomeriggio", operatoreId: "o3", stato: "presente", ora: "14:08" },
    { id: "pr7", data: GIORNI_FA(0), turno: "Pomeriggio", operatoreId: "o4", stato: "presente", ora: "14:11" },
    // Notte — VUOTO: il turno non e' ancora cominciato, e nessuno e' stato visto
    /* ⛔ L'APPELLO DI IERI, che da solo non si guarda mai ma senza il quale il
       RIPOSO FRA DUE TURNI non ha niente da misurare. I quattro operatori
       raccontano i quattro esiti che la funzione sa dire, guardando la Mattina
       di oggi:
        · o1 ha finito il Pomeriggio di ieri, e l'ORA DI USCITA VERA dice le
          23:45 mentre la durata dichiarata diceva le 22: ricomincia alle
          06:10 (anche l'entrata di stamattina e' dichiarata) → SEI ORE E
          MEZZA invece di otto, sotto le undici del D.Lgs 66/2003, e certo
          (i due turni in mezzo sono spuntati). E' il caso per cui gli orari
          esistono: le due ore in piu' a finire un carico l'app non poteva
          saperle, e il numero che dava era piu' tranquillo del vero;
        · o2 ha finito la Mattina di ieri e non ha dichiarato l'uscita: si
          ripiega sulla durata dichiarata, cioe' le 14 → sedici ore,
          regolare, e la frase DICE che viene dalla durata e non
          dall'orologio;
        · o3 nessuno l'ha spuntato ne' al Pomeriggio ne' alla Notte di ieri:
          il conto direbbe sedici ore, ma e' un TETTO, e un tetto sopra la
          soglia non prova niente → non misurabile;
        · o4 era di Notte, e della Notte di ieri nessuno ha dichiarato la
          durata: non si sa a che ora e' finita → non misurabile.
       Il terzo e il quarto caso sono il motivo per cui i dati d'esempio hanno
       dei BUCHI apposta: se fossero tutti compilati la dimostrazione non
       potrebbe mostrare proprio la difesa per cui la funzione esiste. */
    { id: "pr8",  data: GIORNI_FA(1), turno: "Mattina",    operatoreId: "o1", stato: "assente",  ora: "06:05" },
    { id: "pr9",  data: GIORNI_FA(1), turno: "Mattina",    operatoreId: "o2", stato: "presente", ora: "06:02" },
    { id: "pr10", data: GIORNI_FA(1), turno: "Mattina",    operatoreId: "o3", stato: "presente", ora: "06:04" },
    { id: "pr11", data: GIORNI_FA(1), turno: "Mattina",    operatoreId: "o4", stato: "assente",  ora: "06:05" },
    { id: "pr12", data: GIORNI_FA(1), turno: "Pomeriggio", operatoreId: "o1", stato: "presente", ora: "14:03", entrata: "14:00", uscita: "23:45" },
    { id: "pr13", data: GIORNI_FA(1), turno: "Pomeriggio", operatoreId: "o2", stato: "assente",  ora: "14:06" },
    { id: "pr14", data: GIORNI_FA(1), turno: "Pomeriggio", operatoreId: "o4", stato: "assente",  ora: "14:06" },
    { id: "pr15", data: GIORNI_FA(1), turno: "Notte",      operatoreId: "o1", stato: "assente",  ora: "22:04" },
    { id: "pr16", data: GIORNI_FA(1), turno: "Notte",      operatoreId: "o2", stato: "assente",  ora: "22:04" },
    /* o4 ha l'ora di ENTRATA e non quella di uscita, e della Notte nessuno ha
       dichiarato la durata: e' il caso in cui sapere quando e' cominciato non
       aiuta per niente a sapere quando e' finito. Resta non misurabile, ed e'
       la risposta giusta — un'entrata dichiarata non e' un permesso a
       inventarsi l'uscita. */
    { id: "pr17", data: GIORNI_FA(1), turno: "Notte",      operatoreId: "o4", stato: "presente", ora: "22:01", entrata: "22:00" },
  ],
  chiusure: [],
  meteo: [],
  // il turno di Mattina della dimostrazione dura 8 ore DICHIARATE: è il
  // denominatore senza il quale la disponibilità non si calcola
  durate: [
    { id: "t1", data: OGGI_DEMO, turno: "Mattina", minuti: 480, ora: "06:00" },
    // ieri Mattina e Pomeriggio hanno la durata dichiarata; la NOTTE no, ed è
    // l'assenza che fa dire «non misurabile» invece di dare per scontate otto ore
    { id: "t2", data: GIORNI_FA(1), turno: "Mattina", minuti: 480, ora: "06:00" },
    { id: "t3", data: GIORNI_FA(1), turno: "Pomeriggio", minuti: 480, ora: "14:00" },
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

/* ⛔ LE COLONNE A ZERO DEL GRAFICO DELLA SETTIMANA NON SONO TUTTE LA STESSA
   COSA, e finché il grafico ha detto che lo erano ha mentito col disegno.
   Misurato il 06/08 nel browser: con 5.000 m³ il 04/08, 300 t il 03/08 e 210 t
   oggi, `unitaPrevalente` sceglie i **m³** e le due giornate in tonnellate
   escono come colonne alte **ZERO pixel** — identiche, pixel per pixel, alle
   quattro giornate in cui non è stato registrato niente. Sotto, nella stessa
   schermata, la lista scriveva «prodotto 300 t» e il cartellone «Prodotto:
   510 t + 5.000 m³»: il numero era giusto dappertutto e a mentire era il
   disegno, con in più una nota che affermava «le colonne a zero sono giornate
   senza registrazioni».
   Una colonna a zero, in quel grafico, può voler dire tre cose diverse:
     · `fuoriUnita`       — la giornata HA prodotto, ma in un'unità che su
                            quell'asse non ci può stare (t e m³ non si sommano):
                            l'unica in cui il disegno dice il falso;
     · `conRegistrazioni` — la giornata ha attività o rapportini registrati ma
                            niente da mettere su quell'asse: uno zero vero, che
                            però non è «giornata vuota»;
     · `vuote`            — nella giornata non è stato registrato niente.
   Il disegno le tre cose non le sa distinguere (una barra alta zero non porta
   né colore né etichetta), quindi le distingue chi scrive la nota e l'etichetta
   accessibile. È la stessa difesa che `grafFermiStorico` usa già per le sue
   colonne a zero — «pur avendo fermi registrati: lì i minuti non sono stati
   scritti» — qui applicata al grafico gemello, dove mancava.
   `unita` null vuol dire che il grafico sta disegnando le ATTIVITÀ CONCLUSE
   (succede quando nel periodo non c'è nessuna produzione): in quel caso
   `fuoriUnita` è sempre vuoto, perché non c'è nessun'altra unità in gioco.
   Pura e testabile. */
export function zeriDelGrafico(righe, unita) {
  const fuoriUnita = [], conRegistrazioni = [], vuote = [];
  for (const g of righe || []) {
    if (!g) continue;
    const prod = g.prod || {};
    const valore = unita ? (+prod[unita] || 0) : (+g.attConcluse || 0);
    if (valore > 0) continue;
    const haProdotto = Object.values(prod).some(q => Number.isFinite(+q) && +q > 0);
    const altre = unita ? Object.entries(prod)
      .filter(([u, q]) => u !== unita && Number.isFinite(+q) && +q > 0)
      .map(([u, q]) => ({ unita: u, qta: +q }))
      .sort((a, b) => b.qta - a.qta) : [];
    const registrato = (+g.attTot || 0) > 0 || (+g.rapTot || 0) > 0 || haProdotto;
    if (altre.length) fuoriUnita.push({ data: g.data, altre });
    else if (registrato) conRegistrazioni.push({ data: g.data });
    else vuote.push({ data: g.data });
  }
  return { fuoriUnita, conRegistrazioni, vuote };
}

/* QUELLO CHE LO STORICO NON SA METTERE IN NESSUNA GIORNATA.
   ⛔ `storicoSettimana` colloca ogni registrazione sul suo giorno: quelle senza
   giorno — o con un giorno che non esiste, «2026-02-30» — non entrano in
   nessuna riga e spariscono dentro un `continue`. Misurato con tre rapportini
   senza data che dichiarano 260 t e un fermo da 90 minuti: il cartellone dice
   «0 giornate registrate su 7» e «Prodotto: niente registrato», cioè il numero
   tranquillo dove qualcosa è stato registrato eccome — solo non si sa quando.
   È la stessa cosa che `fermiSenzaGiorno` conta già accanto al grafico dei
   fermi; qui si conta per TUTTO lo storico, produzione compresa, perché è la
   produzione quella che il cartellone dichiara inesistente.
   ⛔ La riga che torna ha gli STESSI NOMI di una riga di `storicoSettimana`
   (`prod`, `minutiFermo`, `fermi`, `fermiSenzaMinuti`, `attTot`,
   `attConcluse`, `rapInviati`, `rapTot`) più `totale`: così chi la somma o la
   scrive in un file non ha bisogno di un secondo pezzo di codice che tratti
   questo caso — un secondo pezzo di codice è una seconda occasione di
   divergere. `data` resta la stringa vuota, che a schermo Campo scrive già
   «senza data». Pura e testabile. */
/* UNA REGISTRAZIONE CHE NON STA IN NESSUNA GIORNATA — la domanda scritta una
   volta sola. Era il `senza` chiuso dentro `registrazioniSenzaGiorno`: serve
   anche alla RIGA di un documento («questo rapportino è senza data»), non solo
   al conto, e una seconda scrittura sarebbe una seconda occasione di divergere.
   Il giorno che non esiste («2026-02-30») conta come mancante, perché
   `dataISOEsiste` guarda che cosa VALE la data, non com'è scritta. Pura. */
export function senzaGiornoDiLavoro(rec) {
  return !!rec && !dataISOEsiste(String(rec.data || "").trim());
}

export function registrazioniSenzaGiorno(attivita, rapportini) {
  const senza = senzaGiornoDiLavoro;
  const att = (attivita || []).filter(senza);
  const rap = (rapportini || []).filter(senza);
  const prod = {};
  for (const r of rap) {
    const p = produzioneDi(r);
    if (p) prod[p.unita] = Math.round(((prod[p.unita] || 0) + p.qta) * 100) / 100;
  }
  const anomalie = att.filter(a => a.stato === "anomalia");
  let minutiFermo = 0, fermiSenzaMinuti = 0;
  for (const a of anomalie) {
    const m = Math.max(0, +a.fermoMin || 0);
    minutiFermo += m;
    if (!m) fermiSenzaMinuti++;
  }
  return {
    data: "",
    attivita: att.length,
    rapportini: rap.length,
    totale: att.length + rap.length,
    prod,
    minutiFermo, fermi: anomalie.length, fermiSenzaMinuti,
    attTot: att.length,
    attConcluse: att.filter(a => a.stato === "conclusa").length,
    rapTot: rap.length,
    rapInviati: rap.filter(r => r.stato === "inviato").length,
  };
}

/* ⛔ QUELLO CHE UN DOCUMENTO DATATO NON PUÒ TACERE.
   `eDelGiorno` tiene DENTRO la giornata corrente le registrazioni senza data,
   di proposito e con la ragione scritta: un dato vecchio non deve sparire.
   Effetto: finiscono nei totali di OGGI. Sullo schermo Campo lo dice due
   volte — «(1 rapportino ancora senza data)» accanto alla copertura e «senza
   data» sulla riga della lista (`etData`) — quindi chi guarda lo sa.
   Il RAPPORTO DI FINE TURNO e la CONSEGNA DI TURNO no, e sono i due documenti
   DATATI che si archiviano e si consegnano: misurato il 07/08 sulla
   dimostrazione, il foglio intestato «Rapporto di fine turno — 07/08/2026»
   scriveva «Produzione · Mattina · 2.510 t» e, nella tabella dei rapportini,
   «Rapportino trasporti | Squadra B · Mattina | 2.300 t» — cioè attribuiva al
   turno Mattina di quel giorno 2.300 t su 2.510 di cui nessuno ha dichiarato
   il giorno. Lo stesso app, nel CSV dello storico, quelle stesse tonnellate le
   scrive in una riga con la data VUOTA: due file della stessa app, gli stessi
   chili, due giorni diversi. È la copia debole nel posto che CLAUDE.md indica —
   dove il documento si compone — e il principio del fondatore nella sua forma
   più secca: l'assenza di un dato non è un dato favorevole.
   Restituisce "" quando ogni registrazione ha il suo giorno. Pura e testabile. */
export function avvisoSenzaGiorno(attivita, rapportini) {
  const f = registrazioniSenzaGiorno(attivita, rapportini);
  if (!f.totale) return "";
  // la produzione sta sul RAPPORTINO: appesa in fondo a «2 rapportini e 1
  // attività» direbbe che ha prodotto anche l'attività
  const prod = Object.entries(f.prod).map(([u, q]) => formattaProduzione(q, u)).join(" + ");
  const pezzi = [];
  if (f.rapportini) pezzi.push(conta(f.rapportini, "rapportino", "rapportini") + (prod ? " (" + prod + ")" : ""));
  if (f.attivita) pezzi.push(conta(f.attivita, "attività", "attività"));
  /* ⛔ NESSUN PARTICIPIO in questa frase: «rapportino» è maschile e «attività»
     femminile, e la frase le mescola. La prima stesura, provata in scratchpad
     prima di finire qui, scriveva «1 attività … è contato». I verbi che
     restano (`entra`, `sta`, `sia`) il genere non ce l'hanno. */
  return pezzi.join(" e ") + " senza il giorno di lavoro: "
    + plurale(f.totale, "entra", "entrano") + " nei totali di oggi perché non "
    + plurale(f.totale, "sta", "stanno") + " in nessun'altra giornata, ma nessuno ha dichiarato che "
    + plurale(f.totale, "sia", "siano") + " di oggi.";
}

/* LO STORICO CHE ESCE DALL'APP, e non è la stessa cosa di quello che si vede.
   ⛔ Il file lo rilegge un foglio di calcolo, e chi lo apre SOMMA le colonne.
   Fino al 03/08 il CSV scriveva `0` dove lo schermo scrive «nessuna
   registrazione» e `0` nei minuti di fermo dove lo schermo scrive «senza
   minuti» (`minutiFermoTesto`): una settimana con tre guasti mai misurati
   usciva dal file identica a una settimana senza un fermo. Le regole, le
   stesse dello schermo:
     · produzione → cella VUOTA quando in quell'unità non è stato dichiarato
       niente. Uno zero direbbe «misurato, e vale zero»;
     · minuti_fermo → cella VUOTA quando ci sono fermi e NESSUNO ha i minuti;
       il numero (che è un pavimento) quando alcuni ce li hanno, e allora la
       colonna `fermi_senza_minuti` dice quanti mancano; `0` solo quando di
       fermi non ce n'è stato nessuno, che è una misura vera;
     · le registrazioni che non stanno in nessuna giornata (`fuori`) escono in
       una riga finale con la DATA VUOTA — la convenzione «senza data» che
       Campo usa già a schermo — così chi somma le colonne trova i numeri veri
       invece di un totale che ne ha persi per strada.
   I numeri restano col PUNTO decimale e senza migliaia: è un dato scambiato,
   non un testo mostrato. Pura e testabile. */
export function csvStorico(righe, fuori) {
  const gg = righe || [];
  const f = fuori || null;
  const unita = [...new Set(gg.flatMap(g => Object.keys(g.prod || {}))
    .concat(f ? Object.keys(f.prod || {}) : []))].sort();
  const cella = (v) => (v === null || v === undefined || v === "") ? "" : String(v);
  const minutiCella = (g) => {
    const fermi = Math.max(0, Math.round(+g.fermi || 0));
    const senza = Math.max(0, Math.round(+g.fermiSenzaMinuti || 0));
    return (fermi && senza >= fermi) ? "" : cella(Math.max(0, Math.round(+g.minutiFermo || 0)));
  };
  const riga = (g) => `${g.data};${unita.map(u => cella((g.prod || {})[u])).join(";")}${unita.length ? ";" : ""}`
    + `${minutiCella(g)};${g.fermi};${g.fermiSenzaMinuti};${g.attTot};${g.attConcluse};${g.rapInviati}\n`;
  let csv = "data;" + unita.map(u => "prodotto_" + u).join(";") + (unita.length ? ";" : "")
          + "minuti_fermo;fermi;fermi_senza_minuti;attivita_totali;attivita_concluse;rapportini_inviati\n";
  for (const g of gg) csv += riga(g);
  if (f && f.totale) csv += riga(f);
  return csv;
}

/* IL REGISTRO DELLE ATTIVITÀ CHE ESCE DALL'APP.
   ⛔ FINO AL 07/08 NON PORTAVA I MINUTI DI FERMO, ed è la regola scritta qui
   sopra — nell'intestazione di `csvStorico` — applicata un file più in là.
   Misurato premendo il bottone su due anomalie, una col fermo di 55 minuti e
   una che nessuno ha mai misurato:

       2026-08-07;Mattina;Frantoio primario;…;anomalia;Intasamento impianto
       2026-08-07;Mattina;Nastro 3 fermo;…;anomalia;Guasto meccanico

   cioè due righe **indistinguibili**, mentre lo schermo scriveva «55 min» e
   «senza minuti» e il rapporto stampato aggiungeva «1 fermo su 2 senza i
   minuti registrati: il tempo perso qui sopra è un minimo». Il file era la
   superficie più povera delle tre, ed è quella che si archivia.
   La colonna segue la stessa convenzione dello storico: il numero quando c'è
   (`0` compreso: fermarsi zero minuti è una misura), la cella VUOTA quando
   nessuno l'ha scritto. Chi somma la colonna in un foglio di calcolo ottiene
   un pavimento, non un totale finto.
   ⚠️ Una riga che non è in anomalia ha la cella vuota per un'altra ragione —
   non c'è nessun fermo — e le due si separano leggendo `stato`, che è la
   colonna accanto. Pura e testabile. */
export const ATTIVITA_COLONNE = ["data", "turno", "titolo", "dettaglio", "stato",
  "causale", "minuti_fermo"];

export function csvAttivita(righe) {
  // le anomalie prima: chi apre il file cerca quelle
  const ord = { anomalia: 0, "in-corso": 1, pianificata: 2, conclusa: 3 };
  let csv = ATTIVITA_COLONNE.join(";") + "\n";
  for (const a of (righe || []).slice().sort((x, y) => (ord[x.stato] ?? 4) - (ord[y.stato] ?? 4))) {
    const m = minutiFermoDi(a);
    csv += `${a.data || ""};${csvCell(a.turno || "")};${csvCell(a.titolo || "")};`
         + `${csvCell(a.dettaglio || "")};${a.stato || ""};`
         // ⛔ nel file esce l'ETICHETTA, mai la chiave: chi apre il CSV in un
         // foglio di calcolo legge «Guasto meccanico», non «guasto-meccanico»;
         // e chi lo rilegge (`chiaveCausale`) riconosce l'etichetta. Una
         // causale fuori elenco esce com'è scritta: è un dato, non un errore.
         + `${csvCell(a.stato === "anomalia" ? descriviCausale(a.causale) : "")};${m === null ? "" : m}\n`;
  }
  return csv;
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

/* LA CHECKLIST IN UNA RIGA — «4 a posto · 1 n.a. · 3 senza risposta».
   ⛔ ESISTE PERCHÉ LE VOCI SENZA RISPOSTA SPARIVANO DA UNA DELLE DUE USCITE.
   La stessa checklist, il 07/08, veniva raccontata in tre modi:
     · schermo   → «6/9 · mancano 3 risposte · 1 voce non a posto»
     · stampa    → «4 a posto · 1 n.a. · 3 senza risposta»
     · consegna  → «**4/9 a posto**»
   e la terza è il foglio che passa di mano fra due turni. Chi lo legge non
   poteva sapere che tre controlli non li aveva guardati nessuno: «non lo so»
   travestito da «non c'è», nel documento che serve proprio a dire al turno
   dopo che cosa è rimasto in sospeso.
   La frase è quella che la stampa scriveva già dentro di sé, tolta di lì e
   messa qui: adesso è una sola, e non può più divergere. Pura e testabile. */
export function descriviChecklist(st) {
  if (!st) return "";
  return st.ok + " a posto · " + st.na + " n.a. · " + st.mancanti + " senza risposta";
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

/* LE TRE VOCI DEL METEO, con il nome per chi legge e i valori che, in quella
   voce, contano come condizione difficile. Un posto solo: la pagina se li
   riscriveva accanto al cartellone. */
export const VOCI_METEO = [
  { campo: "cielo",      nome: "il cielo",      avverse: METEO_AVVERSO },
  { campo: "piste",      nome: "le piste",      avverse: PISTE_AVVERSE },
  { campo: "visibilita", nome: "la visibilità", avverse: ["Scarsa"] },
];

/* I quattro stati che il meteo di un turno sa dire. Elenco esplicito perché
   chi disegna una mappa di colori la faccia coprire tutti (regola 18). */
export const STATI_METEO = ["non-registrato", "incompleto", "buono", "avverso"];

/* ⛔ «NON AVVERSO» E «NESSUNO HA GUARDATO» NON SONO LA STESSA COSA, e finché la
   risposta è stata un SÌ/NO il cartellone le dipingeva uguali.
   Misurato nel browser il 09/08: turno CHIUSO e firmato, del meteo registrato
   solo il cielo («Sereno»), piste e visibilità mai guardate. `meteoAvverso`
   rispondeva `false` e il cartellone usciva con la classe **`board ok`** —
   bordo e cifra verdi — cioè «condizioni a posto» su un turno in cui le piste
   potevano essere ghiacciate e nessuno lo sapeva. Il testo sotto lo diceva
   («mancano ancora le piste e la visibilità») e il colore diceva il contrario:
   il colore tranquillo dove non è stato misurato niente.
   ⚠️ E il commento accanto a quella riga raccontava la correzione del caso
   GEMELLO — «un turno chiuso con pioggia e piste ghiacciate usciva VERDE» —
   fatta guardando il dato PRESENTE. Il caso del dato ASSENTE non l'aveva
   guardato nessuno: è la seconda faccia della stessa svista.
   L'asimmetria è la stessa del riposo fra due turni: una voce avversa ACCUSA
   anche se le altre due mancano (una pista ghiacciata è ghiacciata comunque),
   ma per ASSOLVERE servono tutte e tre. Il dato incompleto sa ancora accusare,
   non sa più dire «è andata bene».
   Ritorna { stato, avverse, mancano, lette, totale, completo }. Pura e
   testabile. */
export function statoMeteo(m) {
  const lette = [], mancano = [], avverse = [];
  for (const v of VOCI_METEO) {
    const val = String((m && m[v.campo]) || "").trim();
    if (!val) { mancano.push(v.nome); continue; }
    lette.push(v.campo);
    if (v.avverse.includes(val)) avverse.push(val);
  }
  return {
    stato: avverse.length ? "avverso"
         : !lette.length ? "non-registrato"
         : mancano.length ? "incompleto" : "buono",
    avverse, mancano, lette: lette.length, totale: VOCI_METEO.length,
    completo: lette.length > 0 && mancano.length === 0,
  };
}

// Il turno ha condizioni difficili? (serve a colorare il cartellone e a
// scriverlo nel rapporto, mai a "decidere" al posto di chi c'è).
// ⛔ NON SI RISCRIVE: è `statoMeteo` letta con una domanda sola. Due copie
// uguali oggi divergono domani senza che nessuno lo veda — e questa è già la
// funzione da cui il difetto qui sopra è passato. Pura.
export function meteoAvverso(m) {
  return statoMeteo(m).stato === "avverso";
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
/* ⛔ CHIAVE E ETICHETTA, NON PIÙ UN ELENCO DI TESTI (03/09). Fino a oggi
   `CAUSALI_FERMO` era un array di stringhe e l'etichetta italiana faceva da
   chiave nei record (`attivita.causale`): chi leggeva faceva
   `CAUSALI_FERMO.includes(a.causale) ? a.causale : "Altro"`. Quindi bastava
   RINOMINARE una voce — «Attesa mezzo» → «Attesa del mezzo» — perché tutto lo
   storico di quella causa finisse in «Altro», in silenzio, e il Pareto scendesse
   senza che niente lo dicesse. È la forma di Flotta (`{chiave, etichetta}`),
   copiata nella FORMA e non nel contenuto: le due liste parlano di soggetti
   diversi (qui un'ATTIVITÀ di turno, là una MACCHINA).
   · la chiave è corta, minuscola, stabile: è quella che il record NUOVO salva;
   · l'etichetta è la parola che l'utente vede, e si può cambiare;
   · i record VECCHI portano l'etichetta: `chiaveCausale` la riconosce lo
     stesso (per testo normalizzato, come `chiaveMateriale` fa per i cumuli),
     così lo storico non si orfana;
   · un valore che non è né chiave né etichetta conosciuta va in «Altro» — che
     resta la categoria del Pareto — ma si CONTA a parte e si nomina
     (`nonRiconosciute`), perché l'assenza di un dato non è un dato favorevole. */
export const CAUSALI_FERMO = [
  { chiave: "guasto-meccanico", etichetta: "Guasto meccanico" },
  { chiave: "mancanza-materiale", etichetta: "Mancanza materiale" },
  { chiave: "attesa-mezzo", etichetta: "Attesa mezzo" },
  { chiave: "intasamento-impianto", etichetta: "Intasamento impianto" },
  { chiave: "meteo", etichetta: "Meteo" },
  { chiave: "manutenzione-programmata", etichetta: "Manutenzione programmata" },
  { chiave: "cambio-turno", etichetta: "Cambio turno" },
  { chiave: "sicurezza", etichetta: "Sicurezza" },
  { chiave: "altro", etichetta: "Altro" },
];
// la chiave della categoria residua del Pareto: dove finisce ciò che non ha
// una causa in elenco (e ciò che non ha causa)
export const CAUSALE_ALTRO = "altro";

/* La chiave di una causale scritta in QUALUNQUE delle sue forme: la chiave
   stessa («guasto-meccanico»), l'etichetta con cui lo storico l'ha salvata
   («Guasto meccanico»), o quella stessa etichetta con maiuscole, accenti e
   spazi diversi («GUASTO  meccanico»). Il confronto passa da
   `chiaveMateriale` di `shared/dw-ponti.js`, che è già la regola di casa per
   «due testi sono lo stesso nome» — riscriverla qui sarebbe una copia.
   Risponde `null` per un valore vuoto o mai visto: chi chiama decide se quel
   null è «non indicata» (vuoto) o «non in elenco» (testo sconosciuto), e le
   due cose non vanno confuse. Pura e testabile. */
export function chiaveCausale(valore) {
  const t = chiaveMateriale(valore);
  if (!t) return null;
  const v = CAUSALI_FERMO.find(c => c.chiave === t || chiaveMateriale(c.etichetta) === t);
  return v ? v.chiave : null;
}

/* L'etichetta di una chiave: «guasto-meccanico» → «Guasto meccanico». Per una
   chiave che non esiste risponde "" e non inventa una parola — chi ha in mano
   un testo qualunque e vuole la parola da mostrare usa `descriviCausale`.
   ⚠️ Flotta esporta una funzione con lo stesso nome sulla SUA tassonomia
   (macchine, non attività di turno): nome uguale, elenco diverso, come per
   `CAUSALI_FERMO`. Pura e testabile. */
export function etichettaCausale(chiave) {
  const v = CAUSALI_FERMO.find(c => c.chiave === chiave);
  return v ? v.etichetta : "";
}

/* La parola da MOSTRARE per una causale salvata in qualunque forma: l'etichetta
   dell'elenco se la si riconosce, altrimenti il testo com'è stato scritto
   («Nebbia»), altrimenti "". È l'unico posto che decide come una causale si
   scrive in un CSV, in un foglio o in una nota per Scudo: le tre uscite
   passano da qui invece di leggersi `a.causale` da sole. Pura e testabile. */
export function descriviCausale(valore) {
  const k = chiaveCausale(valore);
  return k ? etichettaCausale(k) : String(valore ?? "").trim();
}

/* I fermi la cui causale NON è in elenco: quanti, e con quali parole (distinte,
   nell'ordine in cui compaiono). Una causale VUOTA non è «non riconosciuta»: è
   «non indicata», e la conta `coperturaFermi.senzaCausale`. Qui si contano
   solo i testi che qualcuno ha scritto e che l'elenco non conosce — cioè i
   fermi che il Pareto mette in «Altro» senza che l'utente l'abbia scelto.
   Pura e testabile. */
export function causaliNonRiconosciute(attivita) {
  const valori = [];
  let conto = 0;
  for (const a of attivita || []) {
    if (!a || a.stato !== "anomalia") continue;
    const testo = String(a.causale ?? "").trim();
    if (!testo || chiaveCausale(testo)) continue;
    conto++;
    if (!valori.some(v => chiaveMateriale(v) === chiaveMateriale(testo))) valori.push(testo);
  }
  return { conto, valori };
}

// la categoria del Pareto per un record: l'etichetta della causa riconosciuta,
// oppure «Altro» (per il testo sconosciuto E per la casella vuota)
const categoriaCausale = (valore) => etichettaCausale(chiaveCausale(valore) || CAUSALE_ALTRO);

// Riepilogo dei fermi (attività in stato "anomalia") per causale, ordinato
// per frequenza decrescente. Una causale non riconosciuta o assente
// confluisce in "Altro" — e quante siano lo dice `causaliNonRiconosciute`,
// che `paretoFermi` porta con sé. Funzione pura e testabile.
export function riepilogoFermi(attivita) {
  const conteggi = {};
  for (const a of attivita || []) {
    if (a.stato !== "anomalia") continue;
    const c = categoriaCausale(a.causale);
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
/* ⛔ E I FERMI SENZA MINUTI SI CONTANO, dal 03/08. `+a.fermoMin || 0` fa
   entrare nella somma un fermo mai misurato **valendo zero**: il totale scende
   e nessuno lo sa, che è lo stesso difetto già corretto nel CSV dello storico
   («una giornata con tre guasti mai misurati identica a una senza fermi»).
   Il numero non si spegne — un totale parziale è comunque una misura — ma
   diventa un **pavimento**, e chi lo disegna lo dice con `minutiFermoTesto`,
   che la regola ce l'ha già scritta. */
/* I MINUTI DI FERMO DI UN'ANOMALIA, oppure `null` quando NESSUNO li ha
   misurati — e sono due cose diverse: `0` è una misura («si è fermato e non è
   costato niente»), l'assenza no.
   ⛔ STA IN UNA FUNZIONE SOLA PERCHÉ SERVE A DUE POSTI, e il secondo è nato il
   07/08: `paretoFermi` la teneva scritta dentro di sé, e il CSV delle attività
   — che i minuti non li scriveva affatto — avrebbe dovuto ricopiarla. Prima di
   ricopiare un corpo si guarda se all'originale manca un parametro; qui non
   mancava un parametro, mancava un NOME. Pura e testabile. */
export function minutiFermoDi(a) {
  if (!a || a.stato !== "anomalia") return null;
  const grezzo = (a.fermoMin === null || a.fermoMin === undefined || String(a.fermoMin).trim() === "")
    ? null : +a.fermoMin;
  return Number.isFinite(grezzo) && grezzo >= 0 ? grezzo : null;
}

export function paretoFermi(attivita) {
  const acc = {};
  for (const a of attivita || []) {
    if (a.stato !== "anomalia") continue;
    const c = categoriaCausale(a.causale);
    const grezzo = minutiFermoDi(a);
    const noto = grezzo !== null;
    if (!acc[c]) acc[c] = { causale: c, conto: 0, minuti: 0, senzaMinuti: 0 };
    acc[c].conto++;
    if (noto) acc[c].minuti += grezzo; else acc[c].senzaMinuti++;
  }
  const voci = Object.values(acc)
    .sort((a, b) => b.minuti - a.minuti || b.conto - a.conto || a.causale.localeCompare(b.causale, "it"));
  const totaleMin = voci.reduce((t, v) => t + v.minuti, 0);
  const senzaMinutiTot = voci.reduce((t, v) => t + v.senzaMinuti, 0);
  const fermiTot = voci.reduce((t, v) => t + v.conto, 0);
  // ⛔ quanti fermi stanno in «Altro» SENZA che qualcuno l'abbia scelto: chi
  // disegna il Pareto lo scrive accanto, se no una voce rinominata o un testo
  // libero sparirebbero nella categoria residua con la faccia di una scelta
  const nr = causaliNonRiconosciute(attivita);
  return { voci, totaleMin, senzaMinutiTot, fermiTot, parziale: senzaMinutiTot > 0,
           nonRiconosciute: nr.conto, valoriNonRiconosciuti: nr.valori };
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
export function disponibilitaTurno(attivita, durate, data, turno, chiusure) {
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
    // ⛔ `provvisorio` distingue un turno FINITO da uno ANCORA IN CORSO, e non
    //    è una sfumatura: i fermi si registrano DURANTE il turno, quindi su un
    //    turno aperto «100%» non vuol dire «è andato tutto bene», vuol dire
    //    «finora nessuno ha scritto niente». È il principio del fondatore —
    //    l'assenza di un dato non è un dato favorevole — nel punto in cui
    //    l'assenza è solo il fatto che il turno non è ancora finito.
    //    Tre valori, e il terzo conta: `true` aperto, `false` chiuso, `null`
    //    quando chi chiama non ha passato le chiusure, cioè «non lo so» —
    //    perché anche la funzione, di ciò che non le è stato dato, non deve
    //    inventarsi una risposta rassicurante.
    provvisorio: chiusure === undefined ? null : !turnoChiuso(chiusure, d, t),
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
  // E NEMMENO UNA MISURA ANCORA IN CORSO PRENDE IL VERDE, per la stessa
  // ragione: il turno non è finito, altri fermi possono ancora arrivare, e il
  // numero può solo SCENDERE. Il caso peggiore è proprio quello che sembra
  // migliore — 100% senza nessun fermo registrato su un turno appena
  // cominciato.
  if (out.provvisorio === true && out.stato === "ok") out.stato = "warn";
  // Il motivo NON ripete la percentuale: chi lo mostra la scrive già accanto,
  // e scritta in tutti e due i posti compariva due volte nella stessa riga.
  const detti = [];
  if (out.parziale) {
    detti.push(out.fermiSenzaMinuti
      + (out.fermiSenzaMinuti === 1 ? " fermo è senza minuti" : " fermi sono senza minuti")
      + ": il tempo perso è almeno questo, quindi la disponibilità è al massimo questa.");
  }
  if (out.provvisorio === true) {
    detti.push(out.fermi === 0
      ? "Il turno non è ancora chiuso e non è stato registrato nessun fermo: "
        + "questo numero dice che finora non è stato scritto niente, non che il turno stia andando bene."
      : "Il turno non è ancora chiuso: altri fermi possono ancora essere registrati, "
        + "quindi questa percentuale può solo scendere.");
  }
  out.motivo = detti.join(" ");
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// C3-bis · IL RIPOSO FRA DUE TURNI
// ══════════════════════════════════════════════════════════════════════
// A COSA SERVE DAVVERO. Chi manda la squadra al fronte decide a mente: «Rossi
// ieri era di pomeriggio, stamattina è di nuovo qui». Fra la fine di un turno
// di pomeriggio (22:00) e l'inizio della mattina dopo (06:00) passano OTTO ore,
// e chi guida un dumper o carica una volata dopo otto ore da casa non ha
// riposato. Il conto lo sa fare Campo, perché ha già i due dati che servono:
// l'appello (chi c'era, turno per turno) e la durata dichiarata del turno.
//
// LA NORMA, per chi risponde a un ispettore: il D.Lgs 66/2003, art. 7, chiede
// **undici ore consecutive di riposo ogni ventiquattro**. Non è una soglia
// inventata da noi e non è un consiglio: è il numero che l'ispettore verifica,
// e oggi lo si verifica sfogliando i fogli dei turni a mano.
//
// ⛔ E QUI IL PRINCIPIO DEL FONDATORE HA UNA FORMA PRECISA, perché il conto
// poggia sull'appello, e l'appello ha tre risposte, non due: presente, assente
// e NON LO SO. Un turno che nessuno ha spuntato non vuol dire «non ha
// lavorato». Da lì l'asimmetria che regge tutto il modulo:
//   · se fra l'ultimo turno che sappiamo lavorato e questo ci sono turni non
//     spuntati, il riposo calcolato è un TETTO: quella persona potrebbe aver
//     lavorato in uno di quei buchi, e allora ha riposato di MENO;
//   · un tetto SOTTO le undici ore prova comunque la violazione (i buchi
//     possono solo accorciare il riposo);
//   · un tetto SOPRA le undici ore non prova NIENTE, e dire «regolare» sarebbe
//     il numero tranquillo dove non si è misurato niente.
// Cioè: il dato incompleto sa ancora accusare, non sa più assolvere. È il verso
// giusto per un controllo di sicurezza, ed è il motivo per cui `stato` ha tre
// valori e non due.
//
// E NON È UN CARTELLINO DI DEMERITO, come il ponte con Scudo e quello con
// Terra: dice che un TURNO è stato messo troppo vicino al precedente — una
// decisione di chi fa i turni — non che la persona ha sbagliato qualcosa.

// Undici ore consecutive ogni ventiquattro: D.Lgs 66/2003, art. 7. Sta qui, in
// un posto solo, perché sia discutibile senza cercarla nelle pagine.
export const RIPOSO_MINIMO_ORE = 11;

// I tre stati che il riposo sa dire. Elenco esplicito perché chi disegna una
// mappa di badge la faccia coprire tutti (regola 18 di run-stile).
export const STATI_RIPOSO = ["sotto", "regolare", "non-misurabile"];

// L'istante in cui comincia un turno, letto sull'orologio LOCALE (le cave sono
// in Italia, il contenitore no). `null` se la data non esiste davvero o il
// turno non è uno dei tre: «2026-02-30» non è un refuso da far scivolare al
// 2 marzo. Pura e testabile.
export function inizioTurno(data, turno) {
  const d = String(data || "").slice(0, 10);
  if (!dataISOEsiste(d)) return null;
  const h = ORE_INIZIO_TURNO[String(turno || "")];
  if (!Number.isFinite(h)) return null;
  const [a, m, g] = d.split("-").map(Number);
  return new Date(a, m - 1, g, h, 0, 0, 0).getTime();
}

// L'istante in cui un turno è FINITO: comincia alla sua ora e dura i minuti
// DICHIARATI. `null` quando la durata non è stata dichiarata, ed è la scelta
// che regge tutto il resto: dare per scontate «otto ore» produrrebbe un riposo
// che nessuno ha misurato, esattamente il numero tranquillo che
// `disponibilitaTurno` si rifiuta già di dare per lo stesso motivo — e lì il
// prezzo è una percentuale sbagliata, qui è mandare al fronte qualcuno che non
// ha dormito. Pura e testabile.
export function fineTurno(durate, data, turno) {
  const i = inizioTurno(data, turno);
  if (i === null) return null;
  const rec = durataTurnoDi(durate, data, turno);
  const min = rec && Number.isFinite(+rec.minuti) && +rec.minuti > 0 ? +rec.minuti : null;
  return min === null ? null : i + min * 60000;
}

// ══════════════════════════════════════════════════════════════════════
// GLI ORARI VERI DEL TURNO, PERSONA PER PERSONA
// ══════════════════════════════════════════════════════════════════════
// A che cosa servono davvero: `fineTurno` qui sopra sa dire quando un turno è
// finito solo leggendo la DURATA DICHIARATA, che è una decisione di chi fa i
// turni, non una misura di quello che è successo. Chi resta due ore in più a
// finire un carico ha un riposo più corto di quello che l'app calcola, e l'app
// non lo sa. Con l'ora di uscita vera `riposoPrimaDelTurno` smette di essere
// una stima e diventa una misura.
//
// ⛔ E UN ORARIO NON COMPILATO NON È «HA FATTO L'ORARIO STANDARD». È
// NON DICHIARATO, e allora si ripiega sulla durata del turno DICENDOLO: la
// stessa asimmetria che regge già il riposo — un tetto sotto le undici ore
// prova comunque la violazione, un tetto sopra non prova niente. Riempire i
// campi da soli con «06:00 → 14:00» sarebbe il modo più elegante di
// trasformare un'ipotesi in un dato firmato, e nessuno saprebbe più
// distinguerla da un orario che qualcuno ha davvero guardato. Per questo la
// pagina PROPONE l'orario standard su un bottone da toccare, invece di
// scriverlo nel campo: un tocco è una dichiarazione, un campo precompilato no.

// «HH:MM» → minuti dalla mezzanotte, `null` se non è un orario.
/* ⚠️ MISURATO PRIMA DI IRRIGIDIRE, e la misura ha tolto una paura e ne ha
   lasciata una. Un `<input type="time">` in Chromium NORMALIZZA da sé: il
   `.value` è sempre "" oppure «HH:MM» (o «HH:MM:SS» quando lo `step` lo
   consente). «6:00», «0600», «06.00», «24:00», «06:60», «1,5» diventano
   TUTTI stringa vuota — cioè qui NON c'è la trappola dei campi interi, dove
   «1,5» diventa «15» e `checkValidity()` risponde true. Quello che resta è
   che `checkValidity()` su un campo VUOTO risponde comunque true: il vuoto è
   una risposta legittima, e va letto come «non dichiarato», non come zero.
   E i dati non arrivano solo dal campo — archivi vecchi, import — quindi la
   forma si controlla lo stesso. Pura e testabile. */
export function minutiOrario(v) {
  const s = String(v == null ? "" : v).trim();
  const m = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(s);
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}

// Minuti dalla mezzanotte → «HH:MM». Stringa vuota quando non c'è niente da
// scrivere: `+null` fa zero, e «00:00» è un'AFFERMAZIONE. Pura e testabile.
export function oraDaMinuti(min) {
  if (min === null || min === undefined || String(min).trim() === "") return "";
  const n = Math.round(+min);
  if (!Number.isFinite(n) || n < 0) return "";
  const p = (x) => String(x).padStart(2, "0");
  return p(Math.floor((n % 1440) / 60)) + ":" + p(n % 60);
}

/* L'istante locale di un'ora su un giorno ISO, e il giorno di un istante.
   ⛔ SEMPRE IN ORA LOCALE: le cave sono in Italia e il contenitore è in UTC.
   Costruire la data coi minuti (e non con l'ora) fa fare al motore il conto
   del cambio d'ora al posto nostro. */
function istanteDi(giorno, minuti) {
  const [a, m, g] = giorno.split("-").map(Number);
  return new Date(a, m - 1, g, 0, minuti, 0, 0).getTime();
}
function giornoDi(ms) {
  const d = new Date(ms), p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/* Un turno non può durare più di questo, e il numero non è inventato: undici
   ore consecutive di riposo ogni ventiquattro (D.Lgs 66/2003, art. 7) ne
   lasciano al massimo tredici. Sta scritto come sottrazione e non come «13»
   proprio perché la soglia del riposo è una sola: cambiandola, cambia anche
   questa. */
export const ORE_TURNO_MAX = 24 - RIPOSO_MINIMO_ORE;

// L'INTERVALLO CHE UNA PERSONA HA DAVVERO LAVORATO, letto dalla sua riga
// d'appello. Torna sempre un oggetto:
//   { entrata, uscita, minuti, oltre, attendibile, perche }
// `entrata`/`uscita` sono ISTANTI (o `null`), non stringhe: è l'unico modo di
// dire «le sei del mattino DOPO». `minuti` c'è solo quando ci sono tutt'e due.
//
// ⛔ DUE DECISIONI DI MESTIERE, prese guardando i casi invece che deducendoli.
//  1. QUALE GIORNO È L'ENTRATA. Il turno di notte comincia alle 22 e finisce
//     il giorno dopo: chi arriva alle 01:00 è entrato in ritardo, non
//     ventun ore prima. Quindi l'entrata è l'occorrenza di quell'ora più
//     VICINA all'inizio nominale del turno. Nessun turno arriva a dodici ore
//     (vedi `ORE_TURNO_MAX`), quindi la scelta non è mai in bilico.
//  2. L'USCITA PRIMA DELL'ENTRATA. «Entrato 14:00, uscito 06:00» si legge
//     come il mattino dopo, e non come un errore da rifiutare — per due
//     ragioni. La prima è che è come funziona il turno di notte. La seconda è
//     che, fra le due letture possibili, questa è quella che ACCORCIA il
//     riposo: se è un refuso l'app lo dice (`attendibile`), se è vero l'app
//     accusa. La lettura opposta assolverebbe in silenzio, ed è esattamente
//     il numero tranquillo che il principio del fondatore vieta.
// `attendibile` ha TRE valori e non due: `null` quando non c'è niente da
// giudicare (nessuna uscita dichiarata), `false` quando l'intervallo che ne
// esce è più lungo di quanto un turno possa durare — cioè o è un refuso, o è
// un turno che da solo viola già l'art. 7. In tutt'e due i casi chi legge deve
// andare a guardare, e il numero si mostra col dubbio accanto invece che
// sparire. Pura e testabile.
export function orariPresenza(p) {
  const base = { entrata: null, uscita: null, minuti: null, oltre: false,
                 attendibile: null, perche: "" };
  if (!p) return base;
  const data = String(p.data || "").slice(0, 10), turno = String(p.turno || "");
  const nominale = inizioTurno(data, turno);
  const me = minutiOrario(p.entrata), mu = minutiOrario(p.uscita);
  // senza un turno leggibile non si sa nemmeno a che giorno appartengono
  if (nominale === null || (me === null && mu === null)) return base;
  let entrata = null;
  if (me !== null) {
    entrata = istanteDi(data, me);
    if (entrata - nominale > 12 * 3600000)
      entrata = istanteDi(dataPiuGiorni(-1, new Date(data + "T12:00:00")), me);
    else if (nominale - entrata > 12 * 3600000)
      entrata = istanteDi(dataPiuGiorni(1, new Date(data + "T12:00:00")), me);
  }
  // senza entrata dichiarata l'uscita si àncora all'inizio nominale del turno:
  // è l'unico appiglio che resta, e va detto invece che nascosto
  const ancora = entrata === null ? nominale : entrata;
  let uscita = null;
  if (mu !== null) {
    const g = giornoDi(ancora);
    uscita = istanteDi(g, mu);
    if (uscita <= ancora) uscita = istanteDi(dataPiuGiorni(1, new Date(g + "T12:00:00")), mu);
  }
  const out = { ...base, entrata, uscita };
  if (uscita !== null) {
    out.attendibile = uscita - ancora <= ORE_TURNO_MAX * 3600000;
    if (!out.attendibile) out.perche = entrata === null
      ? "l'uscita cade più di " + ORE_TURNO_MAX + " ore dopo l'inizio del turno"
      : "fra entrata e uscita ci sono più di " + ORE_TURNO_MAX + " ore";
  }
  if (entrata !== null && uscita !== null) {
    // ⛔ la differenza fra due ISTANTI, non fra due orologi: nelle due notti
    // del cambio d'ora otto ore di lancette sono sette ore vere (o nove), e
    // il riposo si misura in ore vere
    out.minuti = Math.round((uscita - entrata) / 60000);
    out.oltre = giornoDi(uscita) !== giornoDi(entrata);
  }
  return out;
}

// GLI ORARI SCRITTI COME LI DIREBBE UN CAPOCANTIERE. Sta nel modulo perché è
// qui che si legge la bandiera `attendibile`: una dichiarazione che non legge
// nessuno non protegge niente. Stringa vuota quando non c'è nessun orario —
// e il vuoto è la risposta giusta, perché la pagina ha già un suo modo di dire
// «non dichiarati» che non va scritto due volte. Pura e testabile.
export function testoOrari(o) {
  if (!o || (o.entrata === null && o.uscita === null)) return "";
  const orologio = (ms) => { const d = new Date(ms); return oraDaMinuti(d.getHours() * 60 + d.getMinutes()); };
  const e = o.entrata === null ? "" : orologio(o.entrata);
  const u = o.uscita === null ? "" : orologio(o.uscita);
  let t;
  if (e && u) t = "Dalle " + e + " alle " + u + (o.oltre ? " del giorno dopo" : "") + " · " + oreMinuti(o.minuti);
  else if (e) t = "Entrato alle " + e + " · ora di uscita non dichiarata";
  else t = "Uscito alle " + u + " · ora di entrata non dichiarata";
  if (o.attendibile === false) t += " — orari da controllare: " + o.perche;
  return t;
}

// GLI ORARI CHE LA PAGINA PROPONE, letti dal turno standard e dalla durata
// dichiarata. Non entrano in nessun calcolo e non vengono salvati da soli:
// stanno su un bottone che qualcuno tocca. Senza durata dichiarata l'uscita
// NON si propone — proporne una vorrebbe dire inventare l'ora in cui il turno
// è finito, che è precisamente il buco che questo cantiere chiude.
// Pura e testabile.
export function orariProposti(durate, data, turno) {
  const h = ORE_INIZIO_TURNO[String(turno || "")];
  if (!Number.isFinite(h)) return { entrata: "", uscita: "" };
  const rec = durataTurnoDi(durate, data, turno);
  const min = rec && Number.isFinite(+rec.minuti) && +rec.minuti > 0 ? +rec.minuti : null;
  return { entrata: oraDaMinuti(h * 60), uscita: min === null ? "" : oraDaMinuti(h * 60 + min) };
}

// GLI ORARI DI TUTTO IL TURNO, con la stessa forma dell'appello e del riposo.
// Guarda SOLO chi è stato spuntato presente: per chi è assente non ci sono ore
// da dichiarare, e per chi non è stato spuntato la mancanza è già contata
// dall'appello («da spuntare»), che è una cosa diversa da «c'era e non
// sappiamo per quanto».
// ⛔ `minuti` è un PAVIMENTO quando non tutti hanno gli orari (`limite:
// "almeno"`), e resta `null` quando non li ha nessuno: un totale che somma
// solo metà delle persone e si presenta come «le ore del turno» è la stessa
// bugia della disponibilità calcolata senza denominatore.
// Pura e testabile.
export function orariDiTurno(operatori, presenze, data, turno, squadra) {
  const righe = operatoriDi(operatori, squadra)
    .filter(o => o.stato !== "non-disponibile")
    .map(o => ({ operatore: o, presenza: presenzaDi(presenze, data, turno, o.id) }))
    .filter(x => x.presenza && String(x.presenza.stato || "") === "presente")
    .map(x => ({ operatore: x.operatore, orari: orariPresenza(x.presenza) }));
  const completi = righe.filter(r => r.orari.minuti !== null);
  const parziali = righe.filter(r => r.orari.minuti === null
    && (r.orari.entrata !== null || r.orari.uscita !== null));
  /* ⛔ NELLA SOMMA ENTRANO SOLO LE RIGHE CHE REGGONO, e la ragione è che
     `minuti` si presenta come un PAVIMENTO («almeno N ore»). Una riga da
     ventitré ore — che il modulo ha appena dichiarato non attendibile — dentro
     la somma non rende il pavimento più prudente: lo rende FALSO, perché quelle
     ore non sono state lavorate da nessuno. Visto in uno scatto, dove la nota
     diceva «le ore lavorate note sono almeno 23 h» con accanto «1 riga ha
     orari da controllare». Le righe dubbie restano contate a parte in
     `daControllare`, come i «non misurabili» del riposo: si tolgono dal
     numero, non dalla vista. */
  const buoni = completi.filter(r => r.orari.attendibile !== false);
  return {
    righe,
    completi: completi.length,
    parziali: parziali.length,
    senza: righe.length - completi.length - parziali.length,
    totale: righe.length,
    daControllare: righe.filter(r => r.orari.attendibile === false).length,
    minuti: buoni.length ? buoni.reduce((t, r) => t + r.orari.minuti, 0) : null,
    limite: buoni.length && buoni.length < righe.length ? "almeno" : "",
  };
}

// I turni che vengono PRIMA di uno dato, dal più recente indietro, coprendo
// `giorni` giorni di calendario (quindi `giorni × 3` turni). Serve a camminare
// all'indietro nell'appello senza inventare un calendario nuovo: i turni sono
// già `TURNI` e i giorni già `dataPiuGiorni`. Pura e testabile.
export function turniPrecedenti(data, turno, giorni = 7) {
  const d0 = String(data || "").slice(0, 10);
  if (!dataISOEsiste(d0)) return [];
  let i = TURNI.indexOf(String(turno || ""));
  if (i < 0) return [];
  const n = Math.max(0, Math.round(+giorni || 0));
  const out = [];
  let g = d0;
  for (let k = 0; k < n * TURNI.length; k++) {
    i -= 1;
    // ⛔ mezzogiorno e non mezzanotte: nelle due notti del cambio d'ora una data
    // costruita a mezzanotte può scivolare al giorno prima o dopo
    if (i < 0) { i = TURNI.length - 1; g = dataPiuGiorni(-1, new Date(g + "T12:00:00")); }
    out.push({ data: g, turno: TURNI[i] });
  }
  return out;
}

// Centesimi di ora, per non portarsi dietro il rumore dei millisecondi.
function oreDaMs(ms) { return Math.round(ms / 36000) / 100; }

// IL RIPOSO DI UNA PERSONA PRIMA DI UN TURNO.
// Torna sempre un oggetto — mai `null` — con `misurabile` e `perche` accanto al
// numero: quando il numero non si può fare, si dice perché (regola 20).
//   { stato, ore, misurabile, perche, limite, ultimo, buchi, giorni }
// `limite` dice che cos'è `ore`: "" una misura, "al-piu" un tetto (ci sono
// turni non spuntati in mezzo), "almeno" un pavimento (in tutta la finestra
// guardata la persona risulta esplicitamente assente).
//
// ⛔ E DA DOVE VENGONO I DUE ESTREMI VA DETTO, perché non sono la stessa cosa.
// `daInizio` e `daFine` valgono "orario" quando la persona ha dichiarato la sua
// ora — ed è una MISURA — oppure "turno"/"durata" quando si ripiega
// sull'orario nominale del turno e sulla durata dichiarata, che è una STIMA
// decisa da chi fa i turni. Ripiegare va bene; ripiegare in silenzio no: chi
// legge «10 h di riposo» ha diritto di sapere se qualcuno ha guardato
// l'orologio o se l'app ha dato per scontato che il turno sia finito quando
// diceva il piano. `attendibile` è `false` solo quando un orario USATO non
// regge (vedi `orariPresenza`), `null` quando di orari non se n'è usato
// nessuno.
// Pura e testabile.
export function riposoPrimaDelTurno(operatoreId, presenze, durate, data, turno, giorni = 7) {
  const base = { ore: null, misurabile: false, perche: "", limite: "", ultimo: null,
                 buchi: 0, giorni: Math.max(0, Math.round(+giorni || 0)),
                 daInizio: "turno", daFine: "", attendibile: null };
  const nominale = inizioTurno(data, turno);
  if (nominale === null) return { ...base, stato: "non-misurabile",
    perche: "il turno da guardare non ha una data e un turno leggibili" };
  /* L'INIZIO VERO DI QUESTA PERSONA, quando l'ha dichiarato. Taglia nei due
     versi, e per questo si usa: chi è arrivato in anticipo ha riposato MENO di
     quanto diceva l'orario del turno, chi è arrivato tardi ha riposato di più.
     È un dato dichiarato, non un'assenza riempita: il principio del fondatore
     vieta di dare per buono ciò che nessuno ha misurato, non di credere a chi
     ha misurato. */
  const mio = orariPresenza(presenzaDi(presenze, data, turno, operatoreId));
  const inizio = mio.entrata === null ? nominale : mio.entrata;
  base.daInizio = mio.entrata === null ? "turno" : "orario";
  const attInizio = mio.entrata === null ? null : mio.attendibile;
  const indietro = turniPrecedenti(data, turno, giorni);
  if (!indietro.length) return { ...base, stato: "non-misurabile",
    perche: "non è stato guardato nessun turno prima di questo" };
  let buchi = 0;
  for (const t of indietro) {
    const p = presenzaDi(presenze, t.data, t.turno, operatoreId);
    const st = p ? String(p.stato || "") : "";
    if (st === "assente") continue;
    // «non lo so» non è «non c'è»: si conta come buco e si va avanti a
    // cercare, ma il risultato se lo porta dietro
    if (st !== "presente") { buchi++; continue; }
    /* ⛔ L'ORA DI USCITA VERA VINCE SULLA DURATA DICHIARATA, ed è tutto il
       punto: la durata è quanto il turno DOVEVA durare, l'uscita è quando
       questa persona se n'è andata. Chi si è fermato due ore in più a finire
       un carico ha dormito due ore in meno, e fino a ieri l'app non poteva
       saperlo. Dove l'uscita non c'è si ripiega, e `daFine` lo dichiara. */
    const suo = orariPresenza(p);
    const fine = suo.uscita === null ? fineTurno(durate, t.data, t.turno) : suo.uscita;
    const daFine = suo.uscita === null ? "durata" : "orario";
    /* Il dubbio si somma: basta che UNO dei due estremi usati non regga
       perché il numero vada guardato. `null` (niente da giudicare) non
       sporca un `false`, e non trasforma un `true` in un dubbio. */
    const attFine = suo.uscita === null ? null : suo.attendibile;
    const att = attInizio === false || attFine === false ? false
      : (attInizio === null && attFine === null ? null : true);
    // ⛔ IL TURNO NON SI NOMINA QUI. `perche` non porta né la data né il nome
    // del turno: quelli stanno in `ultimo`, e la frase li aggiunge scrivendo la
    // data come la scrive l'interfaccia. È lo stesso disegno di
    // `riassuntoRiapertura`, e la ragione è che il modulo non sa scrivere
    // «31/07/2026» senza tenersi una seconda copia della convenzione italiana
    // delle date — che le sei pagine hanno già, una per una.
    if (fine === null) return { ...base, stato: "non-misurabile", ultimo: t, buchi,
      perche: "del turno precedente non si sa quando è finito: manca l'ora di "
        + "uscita di questa persona e manca la durata dichiarata del turno" };
    const ore = oreDaMs(inizio - fine);
    // un tetto già sotto la soglia è sotto la soglia comunque: i buchi possono
    // solo accorciare il riposo, mai allungarlo
    if (ore < RIPOSO_MINIMO_ORE) return { ...base, stato: "sotto", ore, misurabile: true,
      limite: buchi ? "al-piu" : "", ultimo: t, buchi, daFine, attendibile: att };
    if (buchi) return { ...base, stato: "non-misurabile", ore, limite: "al-piu", ultimo: t, buchi,
      daFine, attendibile: att,
      perche: "fra questo e l'ultimo turno che risulta lavorato ci "
        + (buchi === 1 ? "è 1 turno senza appello" : "sono " + buchi + " turni senza appello")
        + " spuntato per questa persona: il riposo può essere più corto di così" };
    return { ...base, stato: "regolare", ore, misurabile: true, ultimo: t, daFine, attendibile: att };
  }
  if (buchi) return { ...base, stato: "non-misurabile", buchi,
    perche: "in " + buchi + (buchi === 1 ? " turno" : " turni") + " indietro nessuno ha spuntato "
      + "l'appello per questa persona: non si sa quando ha lavorato l'ultima volta" };
  // tutta la finestra spuntata ASSENTE: allora non ha lavorato, e il riposo è
  // ALMENO l'ampiezza della finestra
  const ultimo = indietro[indietro.length - 1];
  return { ...base, stato: "regolare", misurabile: true, limite: "almeno",
    ore: oreDaMs(inizio - inizioTurno(ultimo.data, ultimo.turno)) };
}

// LA FRASE DA METTERE IN PAGINA. Sta nel modulo e non nella pagina perché è qui
// che si legge la bandiera `misurabile`: una dichiarazione di non-misurabilità
// che non legge nessuno non protegge niente.
// `fmtData` serve a scrivere il giorno come lo scrive l'interfaccia — stessa
// firma e stessa ragione di `riassuntoRiapertura`; di suo la data resta com'è,
// e sullo schermo non ci arriva mai perché la pagina passa sempre il suo `dmy`.
// Pura e testabile.
export function testoRiposo(r, fmtData) {
  const f = typeof fmtData === "function" ? fmtData : (d) => d;
  if (!r || !r.stato) return "";
  if (!r.misurabile) return "Riposo non misurabile" + (r.perche ? " — " + r.perche : "")
    + (r.ultimo ? " (turno " + r.ultimo.turno + " del " + f(r.ultimo.data) + ")" : "");
  if (r.limite === "almeno")
    /* «nei 1 giorni» — e col «1» cambia anche la preposizione: «nel giorno». */
    return r.giorni === 1
      ? "Nessun turno lavorato nel giorno prima di questo"
      : "Nessun turno lavorato nei " + r.giorni + " giorni prima di questo";
  const coda = r.stato === "sotto" ? " · sotto le " + RIPOSO_MINIMO_ORE + " ore" : "";
  /* ⛔ DA DOVE VIENE LA FINE DEL TURNO PRECEDENTE SI DICE SEMPRE, anche quando
     è la risposta scomoda. Prima di questo cantiere ogni riga usciva dalla
     durata dichiarata e nessuna lo diceva: chi leggeva «8 h dal turno
     precedente» credeva di leggere una misura, e stava leggendo il piano dei
     turni. Adesso o c'è l'ora di uscita — e allora è una misura — oppure la
     frase dichiara che non c'è. */
  /* ⚠️ CORTA, e la lunghezza è stata misurata sullo scatto a 320 px: la prima
     stesura diceva «dalla durata dichiarata del turno precedente, non dall'ora
     di uscita» e portava la riga del riposo a QUATTRO righe di testo su un
     telefono. Una frase che nessuno finisce di leggere protegge quanto una
     bandiera che nessuno legge. «Stima: manca l'ora di uscita» dice la stessa
     cosa e dice anche che cosa fare per toglierla. */
  const fonte = r.daFine === "orario" ? " · dagli orari registrati"
    : (r.daFine === "durata" ? " · stima: manca l'ora di uscita" : "");
  // la bandiera si legge QUI: se restasse solo dichiarata non proteggerebbe niente
  const dubbio = r.attendibile === false ? " · orari da controllare" : "";
  /* ⛔ ZERO ORE SI SCRIVE A PAROLE, e la prova che l'ha preteso era scritta al
     contrario. `oreMinuti(0)` risponde «0 min», che qui è vero — il turno prima
     è finito nell'istante in cui questo comincia — ma si legge come una misura
     di comodo accanto a «8 h» e «16 h», cioè come un numero piccolo invece che
     come il caso peggiore che questa funzione sa raccontare. */
  if (r.ore < 0) return "Il turno precedente finisce dopo che questo è cominciato" + coda + fonte + dubbio;
  if (r.ore === 0) return "Nessun riposo fra questo turno e il precedente" + coda + fonte + dubbio;
  const q = oreMinuti(Math.round(r.ore * 60));
  return (r.limite === "al-piu" ? "Al più " + q : q) + " dal turno precedente" + coda + fonte + dubbio;
}

// IL RIPOSO DI TUTTO IL TURNO, con la stessa forma dell'appello e del ponte con
// Scudo: le righe e i conti già fatti, così la pagina scrive una frase invece di
// far contare le righe a chi guarda.
// ⛔ I «non misurabili» restano contati a parte e NON entrano nei regolari:
// sommarli vorrebbe dire trasformare un dubbio in un via libera, ed è il modo
// più semplice di rendere inutile un controllo di sicurezza.
// Pura e testabile.
export function riposoDiTurno(operatori, presenze, durate, data, turno, squadra, giorni = 7) {
  const righe = operatoriDi(operatori, squadra)
    .filter(o => o.stato !== "non-disponibile")
    /* ⛔ CHI È STATO SPUNTATO ASSENTE OGGI NON ENTRA, e non è per far pulizia:
       dire «Rossi ha meno di undici ore di riposo» di qualcuno che oggi non è
       venuto è un'accusa falsa su un documento firmato — il riposo prima di un
       turno riguarda chi quel turno lo fa.
       ⚠️ Ma solo chi è spuntato ASSENTE: chi non è ancora stato spuntato resta
       dentro, perché «non lo so» non è «non c'è» — è la stessa distinzione su
       cui è costruito l'appello, e toglierlo qui vorrebbe dire non guardare il
       riposo proprio di chi nessuno ha ancora visto. */
    .filter(o => {
      const p = presenzaDi(presenze, data, turno, o.id);
      return !(p && String(p.stato || "") === "assente");
    })
    .map(o => ({ operatore: o, ...riposoPrimaDelTurno(o.id, presenze, durate, data, turno, giorni) }));
  const conta = (s) => righe.filter(r => r.stato === s).length;
  return {
    righe,
    sotto: conta("sotto"),
    regolari: conta("regolare"),
    nonMisurabili: conta("non-misurabile"),
    totale: righe.length,
    // «sappiamo tutto e va tutto bene» è vero solo se non c'è nessun «non lo so»
    tuttiInRegola: righe.length > 0 && righe.every(r => r.stato === "regolare"),
  };
}

/* L'ELENCO PER L'APPELLO CHE ESCE DALL'APP — quello che qualcuno apre col
   foglio di calcolo per verificare presenze e ore.
   ⛔ E FINO AL 07/08 LA COLONNA `ore_lavorate` USCIVA NUDA ANCHE QUANDO IL
   MODULO AVEVA GIÀ DETTO DI NON FIDARSENE. `orariPresenza` alza la bandiera
   `attendibile: false` quando fra entrata e uscita passano più ore di quante
   un turno possa durarne, e scrive anche il `perche`. Quella bandiera la
   leggevano lo schermo («— orari da controllare: fra entrata e uscita ci sono
   più di 13 ore»), la stampa («23 h (da controllare)») e il riepilogo del
   turno («1 riga ha orari da controllare»). Il CSV no. Misurato premendo il
   bottone su una persona con entrata 06:00 e uscita 05:00:

       …;Paolo Gallo;Autista;Squadra B;presente;06:20;06:00;05:00;23;…

   cioè ventitré ore di lavoro, senza un segno, nell'unica uscita che qualcuno
   SOMMA. È la guardia scollegata: la dichiarazione c'era, e proprio la
   superficie che ne aveva più bisogno non la leggeva.
   Il numero non si spegne — è vero che fra i due orologi ci sono 23 ore — e
   non si arrotonda: gli si mette accanto la colonna che dice perché non ci si
   può fidare, come fa `riposo_nota` per il riposo.
   ⚠️ La cella VUOTA resta la risposta per «non misurabile»: `ore_lavorate` è
   vuota quando uno dei due orari manca, perché uno zero lì, riletto da un
   foglio di calcolo, diventa una somma sbagliata senza che nessuno se ne
   accorga. Le ore restano col PUNTO decimale: è un dato scambiato, non un
   testo mostrato. Pura e testabile. */
export const APPELLO_COLONNE = ["data", "turno", "nome", "ruolo", "squadra", "stato", "ora",
  "entrata", "uscita", "ore_lavorate", "orari_da_controllare",
  "riposo_stato", "riposo_ore", "riposo_fonte", "riposo_nota"];

export function csvAppello(operatori, presenze, durate, data, turno, squadra, fmtData) {
  const app = appelloTurno(operatori, presenze, data, turno, squadra);
  // il riposo viaggia con l'elenco: chi lo apre col foglio di calcolo per una
  // verifica non deve tornare nell'app a rileggerlo persona per persona
  const rip = riposoDiTurno(operatori, presenze, durate, data, turno, squadra);
  const perId = {}; rip.righe.forEach(x => { perId[x.operatore.id] = x; });
  let csv = APPELLO_COLONNE.join(";") + "\n";
  for (const r of app.righe) {
    const rp = perId[r.operatore.id];
    const p = presenzaDi(presenze, data, turno, r.operatore.id);
    const or = orariPresenza(p);
    csv += `${data};${csvCell(turno)};${csvCell(r.operatore.nome)};${csvCell(r.operatore.ruolo || "")};`
         // ⛔ «da spuntare» e non «assente»: chi nessuno ha guardato non si
         // conta né presente né assente — se suona l'allarme, contarlo assente
         // vuol dire non andarlo a cercare
         + `${csvCell(squadraBase(r.operatore.squadra))};${r.stato || "da spuntare"};${r.ora || ""};`
         + `${csvCell((p && p.entrata) || "")};${csvCell((p && p.uscita) || "")};`
         + `${or.minuti === null ? "" : Math.round(or.minuti / 0.6) / 100};`
         + `${csvCell(or.attendibile === false ? or.perche : "")};`
         + `${rp ? rp.stato : "non-in-turno"};${rp && rp.ore !== null ? rp.ore : ""};`
         // da dove viene la fine del turno precedente: «orario» è una misura,
         // «durata» è il piano dei turni. Chi verifica col foglio di calcolo
         // deve poter separare le due cose senza rileggere la nota a parole
         + `${csvCell(rp ? (rp.daFine || "") : "")};`
         + `${csvCell(rp ? testoRiposo(rp, fmtData) : "")}\n`;
  }
  return csv;
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
/* ⛔ «CON UNA DATA» VUOL DIRE CON UN GIORNO CHE ESISTE, e fino al 03/08 qui non
   c'era nessun controllo: bastava una stringa non vuota e non maggiore di oggi.
   Il censimento la dava per falso allarme («`meta` converte sempre una data
   nata dall'orologio»), e per `storicoSettimana` è ancora vero — ma qui `meta`
   viene chiamata DUE volte, e la seconda è `meta(da)`, dove `da` può essere
   `primo`, cioè il campo `data` di una registrazione. La dichiarazione era
   invecchiata, non sbagliata. Che cosa faceva, misurato:
     · «2026-07-32» → l'accumulatore teneva quella chiave, il ciclo d'uscita
       genera solo giorni veri, e i **90 minuti di fermo sparivano**: il grafico
       usciva IDENTICO a quello dei dati sani, con la colonna del 31 luglio a
       zero — cioè «quel giorno non ci siamo fermati» dove un fermo c'era;
     · «2026-02-30» come prima registrazione → `da` = quel giorno, `meta` lo fa
       SCORRERE al 2 marzo, e il grafico partiva dal 2 marzo saltando febbraio,
       con 154 colonne tranquille a zero;
     · «2026-07-32» come UNICA registrazione → `new Date("2026-07-32T12:00:00")`
       è Invalid Date, `oggiISO(Invalid)` risponde `""`, e `"" <= "2026-08-03"`
       è **true**: ciclo infinito, `RangeError: Invalid array length`, la
       sezione Fermi non si disegna più. Non un numero tranquillo — la pagina.
   La difesa è `dataISOEsiste`, già importata qui sopra, messa nel punto UNICO
   in cui la data entra: da lì `primo` è per forza un giorno vero, l'accumulatore
   non ha più chiavi orfane e `meta` non riceve più niente da inventare. */
/* ⛔ E OGNI RIGA DICE SE IN QUEL GIORNO SIA STATO REGISTRATO QUALCOSA
   (`registrate`), perché senza quel campo le colonne a zero sono di DUE specie
   e chi le somma non può distinguerle:
     · una giornata di lavoro registrata in cui non ci si è fermati — uno zero
       MISURATO, che nella media ci deve stare;
     · una giornata in cui non è stato registrato niente — non si sa se ci si
       sia fermati, e quello zero non è una misura.
   ⛔ MISURATO NEL BROWSER IL 09/08, ED È IL NUMERO TRANQUILLO DEL PRINCIPIO DEL
   FONDATORE. Con tre giornate registrate su quattordici, ognuna con 100 minuti
   di fermo, la nota del grafico scriveva «In media **21 min** al giorno»: 300
   minuti divisi per quattordici colonne, di cui **undici mai misurate**. Sulle
   giornate misurate la media è **100**, cioè quasi cinque volte tanto, e le
   undici assenti tiravano il numero giù — nella direzione che rassicura.
   Il grafico gemello, dieci righe più sotto nella stessa pagina, la stessa
   regola ce l'aveva già e la dichiarava pure: «Nelle giornate con qualcosa
   registrato la media è …». Era la regola scritta due volte, la seconda più
   debole — e il campo che serviva a scriverla giusta qui non c'era.
   `registrate` conta le ATTIVITÀ registrate quel giorno, non i fermi: una
   giornata con dieci attività e nessuna anomalia è misurata eccome. */
/* ⛔ E OGNI RIGA DICE ANCHE QUANTI FERMI DI QUEL GIORNO NESSUNO HA MISURATO
   (`fermiSenzaMinuti`, e quanti invece hanno i minuti: `fermiConMinuti`).
   Perché senza quel conto la SOMMA dei minuti è di due specie e chi la divide
   non può distinguerle: `Math.max(0, +a.fermoMin || 0)` fa entrare nel totale
   un guasto mai misurato valendo ZERO — cioè lo tratta come «quel fermo non è
   costato niente», che è il numero tranquillo dove non è stato misurato
   niente. Misurato oggi su tre giornate con un guasto mai misurato ciascuna:
   `{ totale: 0, giorniMisurati: 3, media: 0 }`, e quello zero sembra la cava
   più efficiente d'Italia.
   ⛔ La convenzione NON è nuova: sono gli stessi due nomi che `storicoSettimana`
   mette sulle sue righe e che `disponibilitaTurno` mette sul suo turno, letti
   da `minutiFermoTesto` («0 min» / «senza minuti» / «almeno N min») e da
   `csvStorico` (cella VUOTA quando `senza >= fermi`). Scriverne una terza qui
   sarebbe la stessa regola scritta due volte, la seconda più debole — che in
   questa casa è già costata ventiquattro difetti veri in una notte.
   ⚠️ «Con i minuti» vuol dire `fermoMin > 0`, esattamente come lo intendono le
   due sorelle: un fermo dichiarato di zero minuti non è un fermo misurato a
   zero, è un fermo che nessuno ha cronometrato. */
export function fermiPerGiorno(attivita, giorni = 14, oggi = new Date()) {
  const fine = oggiISO(oggi);
  const acc = {};
  let primo = null;
  const vuota = (d) => ({ data: d, minuti: 0, fermi: 0, fermiConMinuti: 0, fermiSenzaMinuti: 0, registrate: 0 });
  for (const a of attivita || []) {
    const d = String((a && a.data) || "").trim();
    if (!dataISOEsiste(d) || d > fine) continue;
    if (!primo || d < primo) primo = d;
    if (!acc[d]) acc[d] = vuota(d);
    acc[d].registrate++;
    if (a.stato === "anomalia") {
      const m = Math.max(0, +a.fermoMin || 0);
      acc[d].minuti += m;
      acc[d].fermi++;
      if (m) acc[d].fermiConMinuti++; else acc[d].fermiSenzaMinuti++;
    }
  }
  if (!primo) return [];
  const quanti = Math.max(1, Math.round(+giorni) || 14);
  const meta = (iso) => new Date(iso + "T12:00:00");
  const inizio = oggiISO(new Date(meta(fine).getTime() - (quanti - 1) * 86400000));
  const da = primo > inizio ? primo : inizio;
  const out = [];
  for (let t = meta(da); oggiISO(t) <= fine; t = new Date(t.getTime() + 86400000))
    out.push(acc[oggiISO(t)] || vuota(oggiISO(t)));
  return out;
}

/* LA MEDIA DEI MINUTI DI FERMO AL GIORNO, con il suo denominatore dichiarato E
   con dichiarato anche che cosa c'è dentro il NUMERATORE.
   Sta qui e non nella pagina perché è la decisione, non il disegno: chi
   mostrerà questo numero da un'altra parte (un export, un riepilogo, una
   stampa) non deve poterla rifare più debole — è il difetto che in questa casa
   è già costato ventiquattro volte.

   ⛔ IL DENOMINATORE ERA GIÀ DICHIARATO, IL NUMERATORE NO — e da lì usciva un
   numero tranquillo. Le tre misure prese oggi, prima di questa riga:
     · tre giornate, ognuna con un guasto MAI MISURATO
       → `{ totale: 0, giorniMisurati: 3, media: 0 }`: uno zero che afferma
         «in tre giorni non abbiamo perso un minuto» dove nessuno ha guardato
         l'orologio;
     · un giorno da 100 min + due giornate con guasti mai misurati → `media: 33`;
     · lo STESSO giorno da 100 min + due giornate senza NESSUN fermo
       → `media: 33`, cioè identico. Due situazioni diverse, lo stesso numero,
       e chi legge non ha modo di distinguerle.

   ⛔ LA RISPOSTA NON È NUOVA: È QUELLA CHE CAMPO DÀ GIÀ ALLA STESSA DOMANDA in
   `minutiFermoTesto` (che è il posto dove questa casa ha già deciso come si
   scrivono i minuti di fermo senza mentire) e in `csvStorico`, e le tre uscite
   sono le stesse tre:
     · nessun fermo nelle giornate registrate → `media` è un numero (magari 0)
       e `parziale` è falso: è una misura vera, c'eravamo e non ci siamo
       fermati;
     · fermi registrati e NESSUNO con i minuti (`fermiSenzaMinuti >= fermi`)
       → `media` è `null`, come `minutiFermoTesto` scrive «senza minuti» e come
       `csvStorico` lascia la cella VUOTA. Uno zero lì è la bugia più grossa
       che questo grafico sappia dire;
     · alcuni fermi con i minuti e altri no → `media` è un numero e `parziale`
       è vero: quel numero è un MINIMO («almeno»), mai una misura.
   `media` resta `null` anche quando nessuna giornata del periodo è stata
   registrata: uno zero lì direbbe «non ci fermiamo mai» dove la verità è «non
   lo sa nessuno».

   ⚠️ IL VERSO DELL'INCERTEZZA È OPPOSTO A QUELLO DI `disponibilitaTurno`, ed è
   la ragione per cui `parziale` qui non si può copiare di là senza pensarci:
   là i minuti mancanti rendono la percentuale un MASSIMO («al più», perché il
   tempo perso può solo salire e la disponibilità solo scendere); qui rendono
   la media un MINIMO («almeno», perché a salire è proprio il numero mostrato).
   Stesso principio, parole diverse — e chi disegna deve scrivere la parola
   giusta, se no rassicura invece di avvisare.

   Ritorna `{ media, parziale, motivo, mancano, giorni, giorniMisurati,
   giorniVuoti, giorniSenzaMinuti, fermi, fermiConMinuti, fermiSenzaMinuti,
   totale }`. `giorniSenzaMinuti` è il conto delle colonne disegnate a ZERO che
   però un fermo ce l'avevano: sta qui e non nella pagina perché la pagina se
   lo ricavava da sé (`righe.filter(r => r.fermi && !r.minuti)`), che è la
   stessa regola scritta due volte.
   ⚠️ Vuole le righe di `fermiPerGiorno`: è lì che i due conti nascono. Pura e
   testabile. */
export function mediaFermiAlGiorno(righe) {
  const r = (righe || []).filter(Boolean);
  const intero = (v) => Math.max(0, Math.round(+v || 0));
  const misurate = r.filter(g => (+g.registrate || 0) > 0);
  const totale = r.reduce((t, g) => t + Math.max(0, +g.minuti || 0), 0);
  // i fermi si contano su TUTTE le righe e non solo sulle misurate perché un
  // fermo è esso stesso un'attività registrata: le due somme coincidono, e
  // filtrare qui vorrebbe dire fidarsi di quella coincidenza
  const fermi = r.reduce((t, g) => t + intero(g.fermi), 0);
  const conMinuti = r.reduce((t, g) => t + intero(g.fermiConMinuti), 0);
  const senzaMinuti = r.reduce((t, g) => t + intero(g.fermiSenzaMinuti), 0);
  const out = {
    totale,
    giorni: r.length,
    giorniMisurati: misurate.length,
    giorniVuoti: r.length - misurate.length,
    // una colonna a zero che un fermo ce l'aveva: `senza >= fermi` è la stessa
    // condizione con cui `csvStorico` svuota la cella dei minuti
    giorniSenzaMinuti: r.filter(g => intero(g.fermi) && intero(g.fermiSenzaMinuti) >= intero(g.fermi)).length,
    fermi, fermiConMinuti: conMinuti, fermiSenzaMinuti: senzaMinuti,
    media: null, parziale: false, mancano: [], motivo: "",
  };
  if (!misurate.length) {
    out.mancano = ["giornate"];
    out.motivo = "Nessuna giornata del periodo ha registrazioni: non si sa se ci si sia fermati. "
      + "Un numero qui direbbe che non ci fermiamo mai, mentre la verità è che non è stato misurato.";
    return out;
  }
  if (fermi && senzaMinuti >= fermi) {
    out.mancano = ["minuti"];
    out.motivo = (fermi === 1
      ? "L'unico fermo registrato è senza minuti"
      : "I " + fermi + " fermi registrati sono tutti senza minuti")
      + ": non c'è niente da mediare. Uno zero qui direbbe che non abbiamo perso tempo, "
      + "mentre la verità è che nessuno l'ha misurato.";
    return out;
  }
  out.media = Math.round(misurate.reduce((t, g) => t + Math.max(0, +g.minuti || 0), 0) / misurate.length);
  out.parziale = senzaMinuti > 0;
  if (out.parziale) {
    // con «1» cambiano il verbo e la preposizione, non solo il sostantivo: la
    // scelta la fanno `conta` e `plurale` di shared/, come in tutto il resto
    // di Campo — «1 fermi sono senza minuti» è la frase che tradisce il conto
    out.motivo = conta(senzaMinuti, "fermo", "fermi") + " su " + fermi
      + plurale(senzaMinuti, " è senza minuti", " sono senza minuti")
      + ": la media nasce " + plurale(conMinuti, "dall'unico fermo misurato", "dai " + conMinuti + " fermi misurati")
      + ", quindi il tempo perso davvero è almeno questo.";
  }
  return out;
}

/* Quanti fermi NON compaiono in nessuna colonna del grafico qui sopra perché il
   loro giorno non si sa qual è.
   ⛔ Esiste perché correggere il conto non basta: prima quei minuti sparivano
   dentro una chiave orfana, adesso spariscono dentro un `continue`, e in tutti
   e due i casi il grafico disegna una fila di zeri — il numero tranquillo dove
   non è stato misurato niente. Il conto va scritto accanto al grafico.
   Conta le anomalie con una data SCRITTA che non è un giorno vero e quelle
   senza data: dal punto di vista di questo grafico sono la stessa cosa (non si
   possono mettere in colonna), e `senzaData` da solo vede solo le seconde.
   Pura e testabile. */
export function fermiSenzaGiorno(attivita) {
  return (attivita || []).filter(a =>
    a && a.stato === "anomalia" && !dataISOEsiste(String(a.data || "").trim())).length;
}

/* I LAVORI NON CONCLUSI, per la consegna di turno (05/09). Il mondo li chiama
   «lavori non completati» ed è la voce che il turno entrante legge per prima;
   lo schermo li aveva fra le urgenze del Quadro, il foglio che passa di mano
   no. Prima i fermi, poi i lavori in corso, poi i pianificati; chi ce l'ha in
   carico, e «nessuno in carico» dove l'attività non ha un nome sopra (che è
   un dato, non un buco: nella dimostrazione due su cinque non ce l'hanno).
   Ritorna [{ id, titolo, dettaglio, chi, stato, etichetta }]. Pura. */
export const ETICHETTA_STATO_ATTIVITA = { pianificata: "pianificata", "in-corso": "in corso", anomalia: "fermo / anomalia", conclusa: "conclusa" };
export function lavoriNonConclusi(attivita) {
  const ordine = { anomalia: 0, "in-corso": 1, pianificata: 2 };
  return (attivita || []).filter((a) => a && a.stato !== "conclusa")
    .map((a) => ({ id: a.id, titolo: String(a.titolo || "").trim() || "(senza titolo)", dettaglio: String(a.dettaglio || "").trim(),
      chi: String(a.operatore || "").trim() || "nessuno in carico", stato: String(a.stato || ""),
      etichetta: ETICHETTA_STATO_ATTIVITA[a.stato] || String(a.stato || "stato non indicato") }))
    .sort((x, y) => (ordine[x.stato] ?? 9) - (ordine[y.stato] ?? 9) || x.titolo.localeCompare(y.titolo, "it"));
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

/* QUANTI RAPPORTINI SONO DAVVERO ENTRATI NEI METRI CUBI del confronto con
   Terra. La schermata dei rapportini scrive «i turni ne avevano dichiarati
   circa 700 m³ (N rapportini)», e quel N deve contare SOLO i rapportini che
   hanno contribuito a quei metri cubi: i viaggi non si convertono mai, e le
   tonnellate senza densità nemmeno.
   ⛔ MISURATO IL 03/08, E IL CONTO ERA SBAGLIATO NEL VERSO CHE RASSICURA. La
   pagina faceva `dich.turni - (dich.viaggi > 0 ? 1 : 0)`, cioè toglieva UN
   rapportino se c'erano dei viaggi — ma `dich.viaggi` è la SOMMA dei viaggi,
   non il numero dei rapportini che li hanno dichiarati. Con 2 rapportini in m³
   e 3 in viaggi diceva «4 rapportini» quando ne avevano contribuito 2; con
   1 in m³ e 2 in tonnellate senza densità diceva «3» invece di 1, perché il
   caso delle tonnellate non lo toglieva affatto.
   ⛔ E IL NUMERO GIUSTO NON SI SA RICOSTRUIRE DA `dich`: lì dentro ci sono le
   somme per unità, non i conti dei rapportini. Quindi la funzione non lo
   inventa: quando il conto è incompleto (`parziale`) risponde `conto: null` e
   `noto: false`, e chi mostra scrive quello che sa davvero — «su N rapportini
   del periodo» — invece di un numero preciso e falso. Quando invece niente è
   rimasto fuori, tutti i turni contati hanno contribuito e `conto` è esatto.
   Pura e testabile. */
export function rapportiniInConto(dich) {
  const n = Math.max(0, Math.round(+((dich && dich.turni) || 0)) || 0);
  const noto = !!dich && !dich.parziale;
  return { conto: noto ? n : null, delPeriodo: n, noto };
}

// Copertura dei rapportini di TURNO: quali squadre hanno già consegnato un
// rapportino (stato "inviato") e quali mancano ancora — così il preposto, prima
// del cambio turno (handover), sa chi sollecitare. Una squadra si abbina al suo
// rapportino per PREFISSO del nome ("Squadra A — Perforazione" ↔ "Squadra A"),
// stessa convenzione delle altre app. Ritorna { coperte, totale, pct, mancanti }
// (pct null se non ci sono squadre). Pura e testabile.
/* ⛔ UN ARRETRATO SENZA GIORNO NON È UNA CONSEGNA DI OGGI, e per questo lo
   contava. Questa funzione risponde a una domanda operativa sola — *chi devo
   sollecitare prima del cambio turno?* — e riceve le righe già filtrate da
   `eDelGiorno`, che tiene dentro «oggi» anche quelle **senza data**, di
   proposito e con la ragione scritta (un rapportino senza giorno non deve
   sparire da nessuna schermata).
   Effetto misurato il 14/08 su un caso minimo: tre squadre, due consegne vere,
   e **un solo** rapportino senza data appartenente alla squadra che NON aveva
   consegnato. Prima: `3/3`, `pct 100`, `mancanti: []` — badge verde «tutte a
   posto», e **il nome di chi manca sparisce dalla riga che esiste per dirlo**.
   Sui dati di dimostrazione non si vede perché il rapportino senza data è uno
   solo e deve capitare che sia della squadra giusta; su due anni di cava
   sintetica sono 16-26 ed è certo.
   ⚠️ La cura NON tocca `eDelGiorno`: quelle righe devono restare visibili
   altrove. Qui si smette soltanto di contarle come prova che una squadra ha
   consegnato **oggi**, e quante ne sono state tolte si dichiara in
   `senzaGiorno`, perché chi legge deve sapere che esistono. */
export function coperturaRapportini(squadre, rapportini) {
  const tutte = (rapportini || []).filter(r => r.stato === "inviato");
  const conGiorno = tutte.filter(r => dataISOEsiste(String((r || {}).data || "").trim()));
  const inviati = new Set(conGiorno
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
    // quanti sono stati tolti dal conto perché non hanno un giorno: non sono
    // spariti, semplicemente non provano una consegna di OGGI
    senzaGiorno: tutte.length - conGiorno.length,
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

/* ⛔ «E LE RIGHE CHE NON SONO ENTRATE?» — IL LETTORE LE CANCELLA E LA PAGINA
   NON POTREBBE DIRLO NEMMENO VOLENDO: il `.filter` sta DENTRO, e chi chiama
   riceve solo i sopravvissuti. Chi importa 200 righe e ne vede 180 non ha
   modo di sapere quali venti mancano né perché — è l'assenza di un dato nella
   sua forma più tranquilla, cioè il principio del fondatore applicato
   all'INGRESSO invece che all'uscita.
   La forma è quella di `rientroRilievi` in Terra, che fa la stessa domanda
   nell'altro verso: `persi: [{ nome, ragione }]`. I conti si chiamano `lette`
   ed `entrano` perché il file è di qualcun altro — non l'abbiamo scritto noi.
   ⛔ IL VERDETTO NON SI RISCRIVE: lo si chiede al lettore riga per riga
   (`parseSquadreCsv(riga).length`). La scala delle ragioni SPIEGA e basta, e
   quando non sa spiegare dice «il lettore la scarta» invece di indovinare —
   una seconda copia della regola sarebbe la copia debole già pagata quattro
   volte in questa casa.
   ⛔ E LA RIGA TUTTA VUOTA NON È UNA PERDITA: un foglio di calcolo salva le
   righe di coda come `;;;`, che dopo il `trim` non è vuota e arriva fino al
   filtro sul nome. Si contano a parte (`vuote`) e non si dicono: accusare
   l'utente di un difetto del suo Excel è il falso allarme che insegna a non
   guardare i messaggi.
   ⚠️ Le PERSONE che mancano non fanno perdere la riga: la squadra entra con
   `persone: null` («niente zero di comodo», la regola qui sopra). Quello che
   fa perdere la riga è il NOME, che è l'identità. */
export function scartiSquadreCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"));
  const persi = [];
  let nRiga = 0;
  let vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseSquadreCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    persi.push({
      nome: "riga " + nRiga,
      ragione: !(c[0] || "").trim() ? "manca il nome della squadra" : "il lettore la scarta",
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

/* ⛔ E IL FILE DELLE SQUADRE LO SCRIVE UNA FUNZIONE, non una stringa nella
   pagina: era l'ultimo dei sette che si ri-caricano a essere composto lì, e
   finché ci stava il suo giro export → import lo poteva provare **solo** il
   giro del browser (un'ora e mezza) invece di `run-kpi` (millisecondi).
   La regola che porta con sé è quella del lettore qui sopra e va letta insieme
   a lui: le persone che **non sono indicate** escono come cella **vuota**.
   Scrivendoci 0, il giro trasformava «non lo so» in «zero persone» — `numIt`
   legge lo zero come un numero vero, e l'informazione mancante spariva senza
   che nessuno l'avesse tolta. Uno zero **scritto apposta** resta zero: una
   squadra si può svuotare. */
export function csvSquadre(squadre) {
  const righe = ["nome;persone;area;stato"];
  for (const q of (squadre || [])) {
    if (!q) continue;
    const n = numeroDichiarato(q.persone);
    righe.push([
      csvCell(q.nome || ""),
      n == null ? "" : String(Math.max(0, Math.round(n))),
      csvCell(q.area || ""),
      q.stato || "operativa",
    ].join(";"));
  }
  return righe.join("\n") + "\n";
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
  /* ⛔ «fila_m», «borraggio_prog_m» e «ritardo_ms» sono i nomi che GENESI
     scrive nel piano di carico — cioè nel file per cui questo lettore esiste —
     e fino al 05/09 non erano in questi elenchi: il piano di Genesi entrava
     con fila, borraggio e ritardo VUOTI e la finestra diceva «Non ho trovato la
     colonna di: fila, borraggio, ritardo» a ogni import. Nessuna prova usava
     l'intestazione vera: tutte quelle di casa scrivevano «fila;prof;prog».
     Adesso una prova legge l'intestazione DAL SORGENTE di Genesi. */
  fila: ["fila", "fila_m", "riga", "row", "serie"],
  prof: ["prof", "prof_m", "profm", "profondita", "profondità", "h", "depth", "lunghezza"],
  prog: ["prog", "prog_kg", "carica", "carica_kg", "carica_prog_kg", "kg", "kg_foro", "charge"],
  borr: ["borr", "borr_m", "borrm", "borraggio", "borraggio_m", "borraggio_prog_m", "stemming"],
  rit:  ["rit", "rit_ms", "ritms", "ritardo", "ritardo_ms", "delay", "ms"],
  /* l'id stabile del foro (05/09): Genesi lo scrive in coda al piano
     («id_foro»: f2-5 nella maglia, m1 aggiunto a mano) e Campo lo rimanda nel
     consuntivo, così Genesi accoppia ogni foro alla sua carica reale anche se
     un foro è stato tolto e i numeri sono scivolati. FACOLTATIVO: un piano
     senza questa colonna è un piano di ieri, non un piano rotto. */
  idForo: ["id_foro", "idforo", "id"],
};
const PIANO_FACOLTATIVE = ["idForo"];
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
  /* la mappa la fa `mappaColonne` di `shared/` (05/09), con nomi ESATTI dopo
     `_pulisciNome` — «carica (kg)» resta «carica», e «ms» non prende «relief
     ms per m». Le facoltative non finiscono fra le mancanti: se no ogni file
     di ieri aprirebbe la finestra «Non ho trovato la colonna di: …» per una
     colonna che non gli è mai stata chiesta. `conIntestazione` è vero appena
     la riga dei titoli c'è, come è sempre stato. */
  const celle = parseCsvLine(testa).map(_pulisciNome);
  const m = mappaColonne(celle, PIANO_COLONNE, { esatto: true, facoltative: PIANO_FACOLTATIVE, conIntestazione: () => true });
  const indici = {};
  for (const k of Object.keys(PIANO_COLONNE)) if (m.indici[k] >= 0) indici[k] = m.indici[k];
  return { conIntestazione: true, indici, riconosciute: m.riconosciute, ignorate: m.ignorate, mancanti: m.mancanti };
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
               prog: numIt(g("prog", 4)), borr: g("borr", 5), rit: g("rit", 6), reale: null,
               /* senza intestazione la posizione 7 non esiste in un file a sette
                  colonne: resta "" — «non c'è» è una stringa vuota, non un null,
                  perché è testo e non un numero */
               idForo: String(g("idForo", 7) || "").trim() };
    })
    .filter(p => p.foro > 0 && p.prog > 0);
}

/* ⛔ E LE RIGHE DEL PIANO CHE NON SONO ENTRATE? (13/08) Stessa domanda dei
   nove lettori del 13/08 mattina, e stessa risposta: il `.filter` sta DENTRO
   il lettore, che restituisce solo i sopravvissuti — chi carica un piano di
   settanta fori e ne vede sessantotto non ha modo di sapere quali due
   mancano né perché.
   ⚠️ QUI PESA PIÙ CHE ALTROVE, ed è la ragione per cui questo lettore non
   poteva restare muto: le righe che spariscono sono **fori**, e il totale
   dell'esplosivo del piano le conta tutte tranne quelle. È la stessa ragione
   per cui `foriRipetuti` DICE il doppione invece di toglierlo (venti righe
   più su): in un piano di carico una riga in meno non è un fastidio, è una
   carica che nessuno metterà.
   ⛔ IL VERDETTO NON SI RISCRIVE: lo si chiede al lettore riga per riga. Ma
   qui la riga da sola NON BASTA — misurato in scratchpad prima di scrivere
   questa funzione: quando il file ha l'intestazione, comandano i NOMI delle
   colonne, quindi una riga staccata dalla sua testa verrebbe riletta **per
   posizione** e potrebbe salvarsi (o cadere) per una ragione diversa da
   quella vera. Perciò la testa si riattacca. La scala delle ragioni SPIEGA e
   basta, e legge le celle attraverso `mappaPianoCsv` — la stessa mappa che usa
   il lettore — invece di rifarsi la sua idea di dove stia una colonna.
   ⛔ E LA RIGA TUTTA VUOTA NON È UNA PERDITA: un foglio di calcolo salva le
   righe di coda come `;;;`, che dopo il `trim` non è vuota e arriva fino al
   filtro. Si contano a parte (`vuote`) e non si dicono. */
export function scartiPianoCsv(text) {
  const tutte = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  const testa = tutte.find(r => isIntestazione(r, "foro"));
  const righe = tutte.filter(r => !isIntestazione(r, "foro"));
  const m = mappaPianoCsv(text);
  const cella = (c, campo, pos) => {
    const i = m.conIntestazione ? m.indici[campo] : pos;
    return i === undefined ? "" : String(c[i] == null ? "" : c[i]).trim();
  };
  const persi = [];
  let nRiga = 0;
  let vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parsePianoCsv(testa ? testa + "\n" + riga : riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    const foro = cella(c, "foro", 0), prog = cella(c, "prog", 4);
    const nf = numIt(foro), np = numIt(prog);
    /* ⚠️ LE TRE RAGIONI SONO QUELLE CHE L'ECOSISTEMA USA GIÀ, e non ne conia
       di nuove: «non è stato scritto» (nessuno ha compilato il campo), «non si
       legge» (c'è qualcosa e non è un numero), «non è maggiore di zero»
       (leggibile ma fuori dominio). La distinzione fra le prime due si tiene
       perché per chi ha mandato il file cambia che cosa deve andare a
       chiedere: un campo dimenticato o un campo battuto male. */
    persi.push({
      nome: foro ? "foro " + foro : "riga " + nRiga,
      ragione: !foro ? "manca il numero del foro"
        : !Number.isFinite(nf) ? "il numero del foro non si legge"
        : nf <= 0 ? "il numero del foro non è maggiore di zero"
        : !prog ? "la carica progettata non è stata scritta"
        : !Number.isFinite(np) ? "la carica progettata non si legge"
        : np <= 0 ? "la carica progettata non è maggiore di zero"
        : "il lettore la scarta",
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
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
// Ponte progettato-vs-reale (Genesi→Campo): scostamento della carica REALE
// dal progetto, per foro. Funzioni pure e testabili — sono il cuore del
// registro che il fochino usa per capire se ha caricato come previsto.
// scartoPct: frazione |reale-prog|/prog (null se non ancora registrato).
// scartoLivello: classifica lo scostamento — ok ≤10%, warn ≤25%, oltre danger.
// Dal 05/09 tutt'e due stanno in `shared/dw-ponti.js` (vedi l'import in testa).
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

/* LE FRASI DEL CARICO A METÀ, DECLINATE, IN UN POSTO SOLO E DENTRO IL MODULO.
   ═════════════════════════════════════════════════════════════════════════
   ⛔ PERCHÉ ESISTE (roadmap B3-ter). Con UN foro registrato la pagina
   componeva «Sui 1 fori già caricati» — e col «1» cambia anche la
   preposizione, non solo il sostantivo: si dice «Sul foro già caricato».
   Undici righe più sotto, nello stesso file, il toast la guardia ce
   l'aveva già, scritta a mano. Cioè la stessa regola scritta due volte, la
   seconda più debole: la famiglia che CLAUDE.md censisce, qui in casa.
   La cura non è ricopiare il ternario buono sulla riga rotta — due copie
   uguali oggi divergono domani — ma scrivere la decisione UNA volta. Sta
   qui e non nella pagina perché è qui che nascono i numeri (`pianoParziale`):
   finché la frase la compone la pagina, nessuna prova la guarda, ed è
   esattamente il posto in cui questo progetto ha già trovato ventiquattro
   copie deboli («dove il documento si compone»).

   ⛔ E NON RISCRIVE LA SCELTA FRA SINGOLARE E PLURALE: la fa `plurale` di
   `shared/`, che vale per tutte le app e confronta `Number(n) === 1` — così
   un conto arrivato come stringa da un CSV non produce «1 fori».

   ⚠️ `marca` È UN ARGOMENTO, NON UNA SECONDA FUNZIONE. Il riepilogo scrive
   il numero in grassetto, il toast è testo nudo e un `<b>` ci comparirebbe
   come tale: senza questo argomento la stessa frase andrebbe scritta due
   volte, una con il tag e una senza — cioè il modo esatto in cui nasce una
   copia. La domanda «all'originale manca un parametro?» va fatta PRIMA di
   ricopiare un corpo, e qui la risposta era sì. Si passa solo dove serve:
   chiamata senza `marca`, la funzione dà testo nudo.

   ⚠️ Il grassetto sta SOLO sul conto dei fori caricati, e le maiuscole sono
   quelle dei due punti in cui le frasi cadono oggi: `mancano` segue un due
   punti («te ne accorgi adesso: mancano ancora 4 fori»), `restano` apre una
   frase nel toast («… per rientrare»). Sono i testi di prima, alla lettera:
   quello che cambia è solo il caso con UNO. */
export function frasiCaricoParziale(par, marca) {
  if (!par) return null;
  const m = typeof marca === "function" ? marca : (v) => String(v);
  const restano = par.totale - par.registrati;
  return {
    caricati: plurale(par.registrati, "sul foro già caricato",
      "sui " + m(par.registrati) + " fori già caricati"),
    mancano: restano <= 0 ? "" : plurale(restano,
      "manca ancora 1 foro", "mancano ancora " + restano + " fori"),
    restano: restano <= 0 ? "" : plurale(restano,
      "Resta 1 foro", "Restano " + restano + " fori"),
  };
}

// ── Il consuntivo che torna a Genesi ─────────────────────────────────────
// Dal 05/09 (notte) `CONSUNTIVO_COLONNE`, `normalizzaPiano` e `pianoConsuntivoCsv`
// vivono in `shared/dw-ponti.js`: li usa anche Genesi, che dal ponte legge il
// piano di carico dall'organizzazione e lo compone con la STESSA funzione con
// cui Campo scrive il file — così le due strade non possono divergere. Qui
// restano gli alias di sempre (identità, non copie).
export { CONSUNTIVO_COLONNE, normalizzaPiano, pianoConsuntivoCsv } from "../../shared/dw-ponti.js";

// ══════════════════════════════════════════════════════════════════════
// PONTE P4 · DALL'ANOMALIA ALL'AZIONE CORRETTIVA — Campo → Scudo
// ══════════════════════════════════════════════════════════════════════
// Al fronte si registra che una cosa si è fermata, con la causale e i minuti
// persi. E poi? Fino a oggi la riga MORIVA lì: nessun responsabile, nessuna
// data, nessuna chiusura. È anche la prima domanda che fa un ispettore —
// «avete registrato il problema, e poi?» — e la risposta non esisteva.
//
// Non se ne costruisce un secondo meccanismo: la macchina che dà seguito a un
// fatto (aperta → in corso → chiusa, con responsabile e scadenza) è già in
// Scudo, nello scadenzario delle AZIONI CORRETTIVE, ed è la stessa che usano
// gli infortuni, le ispezioni e — dal ponte gemello — i superamenti
// ambientali di Sentinella. Qui si aggiunge solo una PROVENIENZA nuova:
// `origineTipo: "fermo"`, `origineApp: "campo"`.
//
// Perché l'azione si porta dietro anche il TESTO del fatto (`origineNota`,
// `origineData`, `origineEtichetta`): Scudo non legge le collezioni di Campo,
// e un'azione che dicesse solo «origine: fermo a4» sarebbe illeggibile per
// l'RSPP. Quindi porta con sé la fotografia del fermo, scritta in italiano.
// È la stessa scelta già presa dal ponte di Sentinella.
//
// ⛔ E QUI IL PRINCIPIO DEL FONDATORE VALE DUE VOLTE, IN VERSI OPPOSTI:
//  · un fermo SENZA nessuna azione collegata non è «a posto»: è SCOPERTO, e
//    la schermata lo dice con quella parola;
//  · ma se Scudo non si riesce a leggere, non si scrive «zero azioni»: non si
//    sa, e «non lo so» non è «non c'è». Per questo `coperturaFermi` dichiara
//    la bandiera `leggibile` accanto ai conti, e chi la mostra la legge.
//
// ⚠️ DEBITO DICHIARATO, non dimenticato: `statoRisposta` e la forma di
// `azioniDelFermo` sono la STESSA regola di `statoPonte`/`azioniDiOrigine` in
// `apps/sentinella/sentinella-data.js`. Il posto giusto è `shared/dw-ponti.js`,
// con le due app che le ri-esportano — e ci vanno appena `shared/` si libera:
// finché sono due copie, il giorno in cui una cambia l'altra resta indietro.

/* LE VOLATE DI OGGI NELLA CONSEGNA DI TURNO (ponte P6, 05/09): una riga per
   volata eseguita, con quello che il turno entrante deve sapere — dove, quanto
   grande, e se la vibrazione è già stata misurata. Il registro NON leggibile
   si dice con le sue parole: «non si sanno» non è «non ce ne sono state».
   Prende il riassunto di `riassuntoVolateDelGiorno` (shared). Pura. */
export function righeVolateDelGiorno(r) {
  if (!r || !r.leggibile) return ["Sentinella non raggiungibile: le volate di oggi non si sanno (non vuol dire che non ce ne siano state)"];
  if (!r.n) return ["nessuna volata registrata oggi in Sentinella"];
  return r.righe.map(x => {
    const dove = x.fronte || "fronte non indicato";
    const quanto = [x.nFori != null ? conta(x.nFori, "foro", "fori") : "", x.kgTotali != null ? numeroIt(x.kgTotali, 0) + " kg" : ""].filter(Boolean).join(", ");
    const ppv = x.ppv
      ? "PPV misurata " + numeroIt(x.ppv.valore, 2) + " mm/s"
        + (x.ppv.fonte === PPV_STRUMENTO
          ? " dal sismografo" + (x.ppv.punto ? " (" + x.ppv.punto + ")" : "") + (x.ppv.ora ? " alle " + x.ppv.ora : "")
          : " trascritta a mano")
      : "PPV non ancora collegata in Sentinella";
    return dove + (quanto ? " — " + quanto : "") + " · " + ppv;
  });
}

export const ORIGINE_FERMO = "fermo";
// Chi ha generato l'azione. Resta LOCALE al modulo di proposito: `PONTE_APP`
// è esportato anche da Sentinella con un altro valore, e due export omonimi
// con valori diversi sono esattamente ciò che `nomi-doppi.mjs` esiste per
// fermare. Il valore finisce comunque nell'azione, in `origineApp`.
const PONTE_APP = "campo";

// Data di oggi + N giorni, in ISO: serve solo a PROPORRE una scadenza
// all'azione, che la decide comunque chi la apre. ALIAS di `shared/`, non una
// seconda implementazione — la stessa riga che hanno già Scudo e Sentinella.
export const dataPiuGiorni = dataPiuGiorniShell;

// I FERMI CHE CHIEDONO UNA RISPOSTA: le attività ANCORA in anomalia. È il
// gemello di `superamentiAperti` in Sentinella — lì «adesso oltre soglia»,
// qui «adesso ferma» — e sono le stesse righe che il Quadro conta nel KPI
// «Anomalie aperte».
//
// ⛔ NON SI ORDINA PER GRAVITÀ, e non è una dimenticanza. La gravità di un
// fermo sarebbero i minuti persi, ma i minuti NON sempre ci sono: mettere in
// fondo un fermo senza minuti come se ne valesse zero è precisamente il numero
// tranquillo che il principio vieta, e metterlo in cima sarebbe l'affermazione
// opposta, altrettanto inventata. Si ordina quindi per FATTO: prima quelli
// SENZA DATA — che non si sanno collocare e sono i primi a sparire da
// qualunque conteggio (è già la convenzione di Campo, vedi `senzaData`) — poi
// dal più recente, e a parità di giorno dal turno più avanti.
// `minuti` è `null`, mai 0, quando nessuno li ha scritti; `minutiTesto` lo
// dice a parole riusando `minutiFermoTesto`, che è già il posto dove Campo
// decide come si scrive un tempo che non è stato misurato.
// Pura e testabile.
export function anomalieAperte(attivita) {
  const ordTurno = (t) => { const i = TURNI.indexOf(String(t || "")); return i < 0 ? 99 : i; };
  return (attivita || [])
    .filter(a => a && a.id && a.stato === "anomalia")
    .map(a => {
      // una causale fuori dall'elenco standard non si traduce in "Altro" qui:
      // "Altro" è una SCELTA che qualcuno ha fatto, il vuoto è una casella non
      // compilata, e la bozza le scrive in modo diverso. Un testo che l'elenco
      // non conosce («Nebbia») resta com'è scritto — è quello che l'RSPP deve
      // leggere — e `causaleInElenco` dice che non è una voce dell'elenco
      const causale = descriviCausale(a.causale);
      const causaleInElenco = chiaveCausale(a.causale) !== null;
      /* ⛔ la guardia PRIMA della conversione: `+null` fa 0 e `Number.isFinite(0)`
         risponde true, quindi «nessuno ha misurato» diventerebbe «zero minuti
         persi». Lo zero esplicito conta come non misurato per la stessa ragione
         per cui il campo della pagina lo mostra vuoto: in cava un fermo che dura
         zero minuti non è un fermo. */
      const grezzo = a.fermoMin;
      const n = (grezzo === null || grezzo === undefined || String(grezzo).trim() === "") ? NaN : +grezzo;
      const minuti = Number.isFinite(n) && n > 0 ? Math.round(n) : null;
      const data = String(a.data || "").slice(0, 10);
      return {
        a, id: a.id,
        titolo: String(a.titolo || "").trim() || "Attività senza titolo",
        dettaglio: String(a.dettaglio || "").trim(),
        causale, causaleInElenco, minuti,
        minutiTesto: minutiFermoTesto(minuti, 1, minuti === null ? 1 : 0),
        data, turno: String(a.turno || ""),
        squadra: squadraBase(a.squadra) || "",
        voce: data || "senza-data",
      };
    })
    .sort((x, y) =>
      (x.data ? 1 : 0) - (y.data ? 1 : 0)
      || String(y.data).localeCompare(String(x.data))
      || ordTurno(y.turno) - ordTurno(x.turno)
      || String(x.titolo).localeCompare(String(y.titolo), "it"));
}

// Le azioni correttive nate da UN fermo. L'identità è l'id dell'attività, che
// in Campo è già un fatto solo (una giornata, un turno): non serve la seconda
// chiave che in Sentinella distingue due superamenti dello stesso punto in due
// giorni diversi. `origineVoce` resta scritta nell'azione perché si legga, non
// perché serva a riconoscerla — così una data corretta dopo non spezza il
// collegamento. Pura e testabile.
export function azioniDelFermo(azioni, id) {
  /* Non è una regola sua: è `azioniDiOrigine` di `shared/` col tipo già
     fissato. Campo ha una sola origine, quindi il nome corto serve alla
     pagina — ma il filtro è scritto in un posto solo. */
  return azioniDiOrigine(azioni, ORIGINE_FERMO, id);
}

/* ⛔ ERA UNA COPIA, E ADESSO È UN ALIAS. `statoRisposta` era identica —
   misurata byte per byte, 809 caratteri contro 806 — a `statoPonte` di
   Sentinella: due copie uguali oggi divergono domani senza che nessuno lo
   veda, perché ognuna ha le sue prove e tutt'e due restano verdi. Il nome
   resta quello che la pagina di Campo ha sempre usato; la regola è una sola,
   e la prova pretende l'IDENTITÀ, non un comportamento uguale per caso. */
export { statoPonte as statoRisposta } from "../../shared/dw-ponti.js";


// LA BOZZA DELL'AZIONE nata da un fermo. Funzione PURA: prepara il record che
// verrà scritto nella collezione `azioni` di Scudo. Chi la apre può cambiare
// testo, responsabile e data prima di confermare — la proposta serve a non far
// partire da un foglio bianco, non a decidere al posto suo.
// `opts.fmtData` è il formattatore di date: Campo lo passa dall'esterno come fa
// già `riassuntoRiapertura`, invece di tenersene una copia nel modulo.
// Pura e testabile.
export function bozzaAzioneFermo(f, opts = {}) {
  if (!f || !f.id) return null;
  const fmt = typeof opts.fmtData === "function" ? opts.fmtData : (d) => d;
  const quando = f.data ? " del " + fmt(f.data) : "";
  // ⛔ la causale e i minuti che MANCANO si dichiarano mancanti dentro la nota:
  // è il testo che l'RSPP legge in Scudo e che finisce davanti all'ispettore,
  // e una casella vuota taciuta lì diventa un fatto che nessuno rimette a posto
  const nota = "Fermo di produzione (Campo) — " + f.titolo + quando
    + (f.turno ? ", turno " + f.turno : "")
    + (f.squadra ? " · " + f.squadra : "")
    + " · causale: " + (f.causale ? f.causale + (f.causaleInElenco === false ? " (non in elenco)" : "") : "non indicata")
    + " · tempo perso: " + f.minutiTesto
    + (f.dettaglio ? " · «" + f.dettaglio + "»" : "");
  return {
    descrizione: String(opts.descrizione || ("Rimuovere la causa del fermo «" + f.titolo + "»")).trim(),
    responsabileId: opts.responsabileId || null,
    scadenza: String(opts.scadenza || "").slice(0, 10),
    stato: "aperta", esito: "", dataChiusura: null,
    origineTipo: ORIGINE_FERMO, origineApp: PONTE_APP,
    origineId: f.id, origineVoce: f.voce,
    origineData: f.data || "",
    origineEtichetta: f.titolo + (f.causale ? " · " + f.causale : ""),
    origineNota: nota,
  };
}

// I FERMI E LE AZIONI CHE NE SONO NATE, pronti da disegnare.
//
// ⛔ NON SOLO I FERMI ANCORA APERTI, e questa riga l'ha fatta venire fuori il
// prototipo. Quando il capocantiere rimette l'attività «in corso», il fermo
// esce da `anomalieAperte` — ma rimettere in marcia il frantoio non vuol dire
// aver rimosso la causa: l'azione correttiva può essere ancora aperta, e
// sparendo dalla schermata non la chiuderebbe più nessuno. Quindi un ex-fermo
// con un'azione ANCORA DA CHIUDERE resta in elenco, marcato `chiuso: true`.
// È la stessa scelta del ponte di Sentinella, dove un reclamo chiuso con
// un'azione aperta non sparisce.
//
// `azioni === null` vuol dire «Scudo non si legge»: allora `azioni` e
// `risposta` di ogni voce restano `null` — «non lo so» — invece di diventare
// una lista vuota, che si leggerebbe «non c'è nessuna azione».
// Ordine: prima i fermi ancora aperti, e fra questi prima gli SCOPERTI.
// Pura e testabile.
export function fermiEAzioni(attivita, azioni) {
  const aperti = anomalieAperte(attivita);
  const apertiId = new Set(aperti.map(f => f.id));
  const voci = aperti.map(f => ({ ...f, chiuso: false }));
  if (azioni) {
    for (const a of attivita || []) {
      if (!a || !a.id || a.stato === "anomalia" || apertiId.has(a.id)) continue;
      if (!azioniDelFermo(azioni, a.id).some(x => x.stato !== "chiusa")) continue;
      const ex = anomalieAperte([{ ...a, stato: "anomalia" }])[0];
      if (ex) voci.push({ ...ex, chiuso: true });
    }
  }
  return voci
    .map(v => {
      const az = azioni ? azioniDelFermo(azioni, v.id) : null;
      return { ...v, azioni: az, risposta: az ? statoPonte(az) : null };
    })
    .sort((x, y) => (x.chiuso ? 1 : 0) - (y.chiuso ? 1 : 0)
      || ((x.azioni && x.azioni.length ? 1 : 0) - (y.azioni && y.azioni.length ? 1 : 0)));
}

// QUANTI FERMI HANNO AVUTO UNA RISPOSTA, e quanti no. È la riga di riepilogo
// della sezione, ed è il numero che un ispettore guarderebbe per primo.
//
// ⛔ LA BANDIERA `leggibile`. Se Scudo non è raggiungibile, `conAzione`,
// `scoperti` e `daChiudere` restano `null` e `leggibile` è `false`: scrivere
// «0 con azione» direbbe che nessuno ha fatto niente, mentre la verità è che
// non lo sappiamo. La bandiera la legge la pagina, che al suo posto mostra il
// `motivo` — una bandiera che nessuno legge non protegge niente.
// `totale`, `senzaCausale` e `senzaMinuti` invece si sanno comunque: sono dati
// di Campo e non dipendono da Scudo.
// Pura e testabile.
export function coperturaFermi(attivita, azioni) {
  const fermi = anomalieAperte(attivita);
  const out = {
    totale: fermi.length,
    senzaCausale: fermi.filter(f => !f.causale).length,
    senzaMinuti: fermi.filter(f => f.minuti === null).length,
    conAzione: null, scoperti: null, daChiudere: null,
    leggibile: false, motivo: "",
  };
  if (azioni === null || azioni === undefined) {
    out.motivo = "Le azioni correttive vivono in Scudo e da qui non si riescono a leggere: "
      + "non si sa quali di questi fermi abbiano già una risposta, e finché non si sa "
      + "nessuno di loro si può dare per coperto.";
    return out;
  }
  out.leggibile = true;
  out.conAzione = fermi.filter(f => azioniDelFermo(azioni, f.id).length).length;
  out.scoperti = out.totale - out.conAzione;
  // le azioni da chiudere si contano sulle AZIONI, non sui fermi in elenco:
  // quella nata da un fermo poi rimesso in marcia va chiusa lo stesso
  out.daChiudere = (azioni || []).filter(a => a && a.origineTipo === ORIGINE_FERMO
    && a.stato !== "chiusa").length;
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P3 CON SCUDO — la regola sta in `shared/dw-ponti.js` perché serve a due
// app, e Campo la ri-esporta col nome con cui la chiamano le sue pagine.
// ══════════════════════════════════════════════════════════════════════
/* `azioniDiOrigine` e `statoPonte` servono DENTRO il modulo, non solo alle
   pagine: si importano, oltre a ri-esportarli.
   ⚠️ E questa riga l'ha pretesa una prova, non un ragionamento: tolta la
   funzione locale e messo solo il `export … from`, il nome NON esiste più
   dentro il file — `export from` ri-esporta, non lega. Due prove di Campo
   sono cadute con «statoRisposta is not defined» nel giro dopo. È il modo in
   cui una ri-esportazione fatta a metà si vede subito invece che in
   produzione. */
import { azioniDiOrigine, statoPonte } from "../../shared/dw-ponti.js";
export {
  ESITI_TURNO, statoScadenzaHSE, idoneitaOperatore, idoneitaDiTurno, inTurnoOggi,
} from "../../shared/dw-ponti.js";

// PONTE P2 CON TERRA — la produzione del turno attribuita al fronte. Stessa
// regola di sempre: sta in `shared/` perché serve a due app, e qui si
// ri-esporta. Un alias non è una seconda implementazione.
export { produzionePerFronte } from "../../shared/dw-ponti.js";

// ══════════════════════════════════════════════════════════════════════
// PONTE P5 CON SCUDO — IL MANCATO INFORTUNIO SEGNALATO DAL FRONTE
// ══════════════════════════════════════════════════════════════════════
//
// ⛔ NON È UNA FUNZIONE CHE MANCA ALL'ECOSISTEMA: È UNA FUNZIONE CHE NON STA
// DOVE STA LA PERSONA. Il giro completo esiste in Scudo — il pulsante, il
// registro, il riepilogo aggregato nella forma della L. 198/2025, l'azione
// correttiva collegata. Quello che manca è che chi è al fronte ha in mano
// CAMPO. La differenza che conta è il MOMENTO: un fermo si registra a mente
// fredda a fine turno, un near-miss o lo si segnala nei trenta secondi dopo o
// non lo segnala più.
//
// Il vocabolario e il compositore del record stanno in `shared/dw-ponti.js`
// (con Scudo che li ri-esporta): la stessa regola serve a due app, e qui si
// ri-esporta com'è. Il modulo di un'app non importa mai quello di un'altra.
export {
  NEARMISS_CATEGORIE, NEARMISS_LUOGHI, CHI_SEGNALA,
  categoriaNearMiss, luogoNearMiss, descrizioneNearMiss, bozzaNearMiss,
} from "../../shared/dw-ponti.js";
/* ⚠️ E l'`import` non è un doppione: `export … from` RI-ESPORTA, non LEGA — il
   nome non esiste dentro questo file, e `segnalazioniDelTurno` qui sotto
   chiama `categoriaNearMiss`. È lo stesso inciampo già pagato con
   `statoRisposta`, scritto trenta righe più su. */
import { categoriaNearMiss } from "../../shared/dw-ponti.js";

// QUANTO SI È GIÀ SEGNALATO IN QUESTO TURNO. È il ritorno del ponte: Campo
// scrive nel registro di Scudo e poi lo rilegge, esattamente come fa con le
// azioni correttive dei fermi. Serve a due cose concrete al fronte — sapere
// che la segnalazione è passata davvero, e non rimandarne una già mandata da
// un collega dieci minuti prima.
//
// ⛔ TRE ELENCHI, NON UNO, ED È IL PRINCIPIO DEL FONDATORE. Un near-miss dello
// stesso giorno SENZA turno scritto non è «non è del mio turno»: è un evento
// registrato da Scudo (dove il turno non si chiede) di cui non si sa in quale
// turno sia successo. Metterlo fra gli «altri turni» sarebbe un'affermazione
// inventata; ometterlo lo farebbe sparire. Si tiene a parte e si dichiara — è
// la stessa scelta dell'appello del turno, dove chi nessuno ha spuntato non si
// conta né presente né assente.
//
// ⛔ E `leggibile: false` NON È ZERO. Se il registro di Scudo non si riesce a
// leggere, gli elenchi restano vuoti ma la bandiera dice che nessuno ha
// guardato: scrivere «nessuna segnalazione in questo turno» direbbe che non è
// successo niente. La bandiera la legge la pagina, che al suo posto mostra il
// `motivo` — una bandiera che nessuno legge non protegge niente.
// Pura e testabile.
export function segnalazioniDelTurno(infortuni, data, turno) {
  const g = String(data || "").slice(0, 10);
  const t = String(turno || "").trim();
  const base = { delTurno: [], turnoIgnoto: [], altriTurni: [], totaleGiorno: 0 };
  if (!Array.isArray(infortuni)) {
    return { ...base, leggibile: false,
      motivo: "Il registro degli eventi vive in Scudo e da qui non si riesce a leggere: "
        + "non si sa quante segnalazioni siano già state fatte oggi." };
  }
  const out = { ...base, leggibile: true, motivo: "" };
  for (const x of infortuni) {
    if (!x || x.tipo !== "near-miss") continue;
    if (String(x.data || "").slice(0, 10) !== g) continue;
    out.totaleGiorno++;
    const suo = String(x.turno || "").trim();
    if (!suo) out.turnoIgnoto.push(x);
    else if (suo === t) out.delTurno.push(x);
    else out.altriTurni.push(x);
  }
  return out;
}

// La riga che la pagina scrive sotto il pulsante. Sta qui e non nella pagina
// perché è il posto dove Campo decide come si racconta un conteggio che
// potrebbe non essere stato fatto — la stessa ragione per cui `minutiFermoTesto`
// non vive nell'HTML. `null` quando non c'è niente da dire.
export function testoSegnalazioniTurno(s) {
  if (!s) return null;
  if (!s.leggibile) return s.motivo;
  const n = s.delTurno.length;
  const capi = n === 0 ? "" : n === 1 ? "1 near-miss segnalato in questo turno"
    : n + " near-miss segnalati in questo turno";
  const ign = s.turnoIgnoto.length;
  const coda = !ign ? ""
    : (ign === 1 ? "1 altro segnalato oggi senza turno indicato"
                 : ign + " altri segnalati oggi senza turno indicato")
      + " (non si sa se di questo turno)";
  if (!capi && !coda) return null;
  return [capi, coda].filter(Boolean).join(" · ") + ".";
}

/* IL RAPPORTO DI FINE TURNO STAMPATO, LE SEZIONI (05/09). Stava nella pagina:
   cento righe di modello HTML che chiamavano le funzioni giuste — `appelloTurno`,
   `riposoDiTurno`, `paretoFermi`, `disponibilitaTurno`, `totaliProduzione`,
   `produzioneDi` — ma la COMPOSIZIONE la provava solo il browser, ed è lì che
   sono vissuti «0/0 attività concluse · 0 anomalie aperte» su una giornata
   mai registrata e la tabella dei fermi che diceva meno dello schermo. Qui
   ogni sezione è testo: `{titolo, testo, blocchi: [{intro, tabella: {colonne,
   righe, totale, vuota}, note}], note}`; la pagina tiene solo HTML e CSS.
   Nei testi il grassetto si scrive «**così**», il corsivo «*così*», l'a capo
   «\n»: li rende la pagina. `d`: { oggi (ISO), rapportini e attivita GIÀ del
   giorno, obiettivi, checklist, meteo, chiusure, squadre, operatori,
   presenze, durate (archivi interi: si filtrano qui) }; `opts.dmy` la data in
   italiano. Pura. */
export function rapportoGiornata(d, opts) {
  const D = d || {}, O = opts || {};
  const OGGI = String(D.oggi || "");
  const dmy = O.dmy || ((iso) => dataIt(iso, "senza data"));
  const RAP_OGGI = D.rapportini || [], ATT_OGGI = D.attivita || [];
  const OBIE = D.obiettivi || [], CHK = D.checklist || [], MET = D.meteo || [], CHI = D.chiusure || [];
  const SQU = D.squadre || [], OPER = D.operatori || [], PRE = D.presenze || [], DUR = D.durate || [];
  const av = avanzamentoGiornata(ATT_OGGI), fermi = riepilogoFermi(ATT_OGGI), cop = coperturaRapportini(SQU, RAP_OGGI);
  const pf = paretoFermi(ATT_OGGI);
  const tp = totaliProduzione(RAP_OGGI), unitaProd = Object.entries(tp.perUnita);
  const somma = (u) => Object.entries(u).map(([un, q]) => formattaProduzione(q, un)).join(" + ");
  const ST = { "in-corso": "In corso", pianificata: "Pianificata", conclusa: "Conclusa", anomalia: "ANOMALIA" };
  const sez = (titolo, testo, blocchi, note) => ({ titolo, testo: testo || "", blocchi: blocchi || [], note: note || [] });
  const tab = (colonne, righe, extra) => ({ colonne, righe, totale: null, vuota: "", ...(extra || {}) });
  /* IL QUADRO: dove nessuno ha registrato niente il numero è «—» e la frase
     dice perché — «0/0 concluse · 0 anomalie» è la riga più tranquilla che il
     documento sappia dire proprio dove non è stato misurato niente */
  const quadro = [
    av.totale ? { n: av.concluse + "/" + av.totale, t: "attività concluse" } : { n: "—", t: "attività: nessuna registrata oggi" },
    av.totale ? { n: String(av.anomalie), t: av.anomalie === 1 ? "anomalia aperta" : "anomalie aperte" } : { n: "—", t: "anomalie: nessuna attività da cui contarle" },
    cop.totale ? { n: cop.coperte + "/" + cop.totale, t: "squadre con rapportino" } : { n: "—", t: "squadre: nessuna in anagrafica" },
    { n: unitaProd.length ? somma(tp.perUnita) : "—", t: "prodotti" },
  ];
  const attenzione = avvisoSenzaGiorno(ATT_OGGI, RAP_OGGI) || "";
  // checklist di inizio turno chiuse o in corso oggi
  const chkOggi = CHK.filter((c) => String(c.data || "") === OGGI).map((c) => ({ c, st: statoChecklist(c.esiti || {}) }));
  const checklist = sez("Checklist di inizio turno", chkOggi.length ? "" : "Nessuna checklist di inizio turno compilata oggi.",
    chkOggi.length ? [{ tabella: tab(["Squadra", "Turno", "Risposte", "Voci non a posto", "Chiusa alle"],
      chkOggi.map((x) => [String(x.c.squadra || "—"), String(x.c.turno || "—"), descriviChecklist(x.st),
        x.st.problemi.length ? x.st.problemi.join("; ") : "nessuna", String(x.c.ora || "non chiusa")])) }] : []);
  const metOggi = TURNI.map((t) => meteoDi(MET, OGGI, t)).filter((m) => m && riassuntoMeteo(m));
  const meteo = sez("Meteo e condizioni del sito", metOggi.length ? "" : "Meteo e condizioni del sito non registrati oggi.",
    metOggi.length ? [{ tabella: tab(["Turno", "Condizioni", "Note sul sito"],
      metOggi.map((m) => [String(m.turno), riassuntoMeteo(m), String(m.note || "—")])) }] : []);
  /* PERSONALE PRESENTE, turno per turno: l'appello, il riposo fra i turni
     (D.Lgs 66/2003, art. 7) e gli orari veri. Dove non si può misurare il
     rapporto lo DICHIARA invece di lasciare la cella vuota: una casella bianca
     su un documento firmato si legge come «niente da segnalare». */
  const preOggi = TURNI.map((t) => {
    const rip = riposoDiTurno(OPER, PRE, DUR, OGGI, t, "");
    const per = {}; rip.righe.forEach((r) => { per[r.operatore.id] = r; });
    const ori = {}; PRE.filter((p) => String(p.data || "") === OGGI && String(p.turno || "") === t)
      .forEach((p) => { ori[p.operatoreId] = { rec: p, or: orariPresenza(p) }; });
    return { turno: t, app: appelloTurno(OPER, PRE, OGGI, t, ""), rip, per, ori, qOra: orariDiTurno(OPER, PRE, OGGI, t, "") };
  }).filter((x) => x.app.presenti || x.app.assenti);
  const personale = sez("Personale presente", preOggi.length ? "" : "Nessun appello registrato oggi.",
    preOggi.map((x) => {
      const q = x.qOra, mancano = q.parziali + q.senza;
      const intro = "**Turno " + x.turno + "**: " + x.app.presenti + " " + (x.app.presenti === 1 ? "presente" : "presenti") + " su " + x.app.totale
        + (x.app.daFare ? ", " + x.app.daFare + " " + (x.app.daFare === 1 ? "non spuntato" : "non spuntati") : "") + "."
        + (x.rip.sotto ? " **" + x.rip.sotto + " " + (x.rip.sotto === 1 ? "persona ha" : "persone hanno") + " meno di " + RIPOSO_MINIMO_ORE + " ore di riposo dal turno precedente** (D.Lgs 66/2003, art. 7)." : "")
        + (x.rip.nonMisurabili ? " Per " + x.rip.nonMisurabili + " il riposo non è misurabile." : "")
        + (q.totale ? (mancano
            ? " Per **" + mancano + "** " + (mancano === 1 ? "presente" : "presenti") + " su " + q.totale + " manca l'ora di entrata o quella di uscita"
              + (q.minuti !== null ? "; le ore lavorate note sono **almeno " + oreMinuti(q.minuti) + "**" : "") + "."
            : " Orari dichiarati per tutti i presenti: **" + oreMinuti(q.minuti) + "** lavorate in totale.") : "")
        + (q.daControllare ? " **" + q.daControllare + " " + (q.daControllare === 1 ? "riga ha" : "righe hanno") + " orari da controllare.**" : "");
      const righe = x.app.righe.map((r) => {
        const v = x.ori[r.operatore.id] || {}; const rec = v.rec || {}, o = v.or || {};
        const presente = r.stato === "presente";
        // per chi non è presente gli orari «—» (non lo riguardano); per chi è
        // presente e non li ha, la cella DICHIARA che non sono stati dichiarati
        const cel = (t) => (!presente ? "—" : (t || "*non dichiarata*"));
        return [String(r.operatore.nome || ""), String(r.operatore.ruolo || "—"), squadraBase(r.operatore.squadra) || "—",
          presente ? "presente" : r.stato === "assente" ? "ASSENTE" : "non spuntato",
          cel(rec.entrata ? String(rec.entrata) : ""),
          cel(rec.uscita ? String(rec.uscita) + (o.oltre ? " *(giorno dopo)*" : "") : ""),
          !presente ? "—" : (o.minuti !== null && o.minuti !== undefined ? oreMinuti(o.minuti) + (o.attendibile === false ? " **(da controllare)**" : "") : "*non calcolabili*"),
          String(r.ora || ""),
          x.per[r.operatore.id] ? testoRiposo(x.per[r.operatore.id], dmy) : "non in turno"];
      });
      return { intro, tabella: tab(["Nome", "Ruolo", "Squadra", "Stato", "Entrata", "Uscita", "Ore", "Spuntato alle", "Riposo dal turno precedente"], righe) };
    }));
  const obOggi = OBIE.filter((o) => String(o.data || "") === OGGI).map((o) => statoObiettivo(o, RAP_OGGI, ATT_OGGI)).filter(Boolean);
  const qta = (v, u) => (u === UNITA_ATTIVITA ? numeroIt(v, 0) + " attività" : formattaProduzione(v, u));
  const obiettivo = sez("Obiettivo del turno", obOggi.length ? "" : "Nessun obiettivo impostato per i turni di oggi.",
    obOggi.length ? [{ tabella: tab(["Turno", "Obiettivo", "Fatto", "Scostamento"],
      obOggi.map((o) => [String(o.turno), qta(o.obiettivo, o.unita), qta(o.fatto, o.unita) + " (" + o.pct + "%)",
        segnoIt(o.scarto, 2) + (o.unita === UNITA_ATTIVITA ? " attività" : " " + o.unita)])) }] : []);
  // le attività, le anomalie prima; la riga di una registrazione senza giorno lo dice
  const ordR = { anomalia: 0, "in-corso": 1, pianificata: 2, conclusa: 3 };
  const attivita = sez("Attività", "", [{ tabella: tab(["Turno", "Attività", "Dettaglio", "Assegnata a", "Stato"],
    ATT_OGGI.slice().sort((a, b) => (ordR[a.stato] ?? 4) - (ordR[b.stato] ?? 4)).map((a) => [
      String(a.turno || "—") + (senzaGiornoDiLavoro(a) ? " **· senza data**" : ""), String(a.titolo || ""), String(a.dettaglio || ""),
      etichettaAssegnazione(a) || "da assegnare",
      (ST[a.stato] || String(a.stato || "")) + (a.stato === "anomalia" && a.causale ? " — " + descriviCausale(a.causale) : "")]),
    { vuota: "Nessuna attività registrata." }) }]);
  /* I FERMI PER CAUSALE coi minuti di `paretoFermi`, come lo schermo — non il
     solo conto di `riepilogoFermi`, che diceva quante volte e non quanto */
  const noteFermi = [];
  if (fermi.length && pf.senzaMinutiTot) noteFermi.push(conta(pf.senzaMinutiTot, "fermo", "fermi") + " su " + pf.fermiTot + " senza i minuti registrati: il tempo perso qui sopra è un minimo.");
  if (fermi.length && pf.nonRiconosciute) noteFermi.push(fraseNonRiconosciute(pf).replace(/^ /, "") + ".");
  const fermiSez = sez("Fermi per causale",
    fermi.length ? "" : (ATT_OGGI.length ? "Nessuna anomalia aperta." : "Nessuna attività registrata oggi: non c'è niente da cui contare i fermi. Questa riga non dice che il turno è andato liscio."),
    fermi.length ? [{ tabella: tab(["Causale", "Anomalie", "Tempo perso"], fermi.map((f) => {
      const v = pf.voci.find((x) => x.causale === f.causale);
      return [String(f.causale), String(f.conto), v ? minutiFermoTesto(v.minuti, v.conto, v.senzaMinuti) : "senza minuti"];
    })) }] : [], noteFermi);
  // la disponibilità, turno per turno: SOLO i turni che hanno qualcosa
  const dispOggi = TURNI.map((t) => disponibilitaTurno(ATT_OGGI, DUR, OGGI, t, CHI)).filter((x) => x.durataMin !== null || x.attivita > 0);
  const disponibilita = sez("Disponibilità del turno",
    dispOggi.length ? "" : "Nessuna durata di turno dichiarata oggi e nessuna attività da cui misurarla: la disponibilità non è stata calcolata.",
    dispOggi.length ? [{ tabella: tab(["Turno", "Durata dichiarata", "Fermi", "Tempo perso", "Causale peggiore", "Disponibilità"],
      dispOggi.map((x) => [String(x.turno), x.durataMin === null ? "non dichiarata" : oreMinuti(x.durataMin),
        x.fermi + " " + (x.fermi === 1 ? "fermo" : "fermi") + (x.fermiSenzaMinuti ? " (di cui " + x.fermiSenzaMinuti + " senza minuti)" : ""),
        x.fermi ? minutiFermoTesto(x.fermiMin, x.fermi, x.fermiSenzaMinuti) : "—",
        x.peggiore ? x.peggiore.causale + " — " + numeroIt(x.peggiore.minuti, 0) + " min su " + x.peggiore.conto + (x.peggiore.conto === 1 ? " fermo" : " fermi") : "—",
        x.pct === null ? "**non calcolata** — " + x.motivo
          : (x.parziale ? "al più **" + x.pct + "%**" : "**" + x.pct + "%**") + " (" + oreMinuti(x.lavoratiMin) + " lavorati su " + oreMinuti(x.durataMin) + ")" + (x.parziale ? "\n" + x.motivo : "")])) }] : [],
    dispOggi.length ? ["Disponibilità = durata dichiarata del turno meno i minuti di fermo registrati sulle attività in anomalia. **Non è l'OEE**: l'OEE moltiplica disponibilità, prestazione e qualità, e prestazione e qualità qui non sono misurate."] : []);
  const foto = ATT_OGGI.filter((a) => eFotoValida(a.foto)).map((a) => ({
    didascalia: "**" + String(a.titolo || "") + "** — turno " + String(a.turno || "—") + (a.causale ? " · " + descriviCausale(a.causale) : "") + (a.fotoOra ? " · scattata alle " + String(a.fotoOra) : ""),
    src: a.foto }));
  const produzione = sez("Produzione", unitaProd.length ? "" : "Nessuna produzione registrata.",
    unitaProd.length ? [{ tabella: tab(["Turno", "Produzione"], tp.perTurno.map((t) => [String(t.turno), somma(t.perUnita)]), { totale: ["Totale", somma(tp.perUnita)] }) }] : []);
  /* i rapportini: la produzione la legge `produzioneDi`, non il numero grezzo
     con l'unità grezza accanto (un'unità fuori dall'elenco veniva stampata
     com'era e sommata come tonnellate due tabelle più giù) */
  const rapportini = sez("Rapportini", RAP_OGGI.length ? "" : "Nessun rapportino oggi.",
    RAP_OGGI.length ? [{ tabella: tab(["Titolo", "Squadra · turno", "Produzione", "Consegne al turno dopo", "Stato"], RAP_OGGI.map((r) => {
      const pr = produzioneDi(r);
      return [String(r.titolo || ""), String(r.squadra || "—") + (r.turno ? " · " + String(r.turno) : "") + (senzaGiornoDiLavoro(r) ? " **· senza data**" : ""),
        pr ? formattaProduzione(pr.qta, pr.unita) : String(r.produzione || "—"), String(r.note || "—"), String(r.stato || "") + (r.ora ? " " + String(r.ora) : "")];
    })) }] : [], cop.mancanti.length ? ["Squadre senza rapportino: " + cop.mancanti.join(", ") + "."] : []);
  // le firme: senza chiusure il rapporto porta le righe vuote da compilare a penna
  const chiuOggi = CHI.filter((c) => String(c.data || "") === OGGI && c.ora);
  const chiusura = sez("Chiusura e firme", chiuOggi.length ? "" : "Nessun turno chiuso oggi: questo rapporto **non è stato consegnato** da nessuno.",
    chiuOggi.length ? [{ tabella: tab(["Turno", "Consegnato da", "Ricevuto da", "Ora", "Note"],
      chiuOggi.map((c) => [String(c.turno || ""), String(c.consegna || "—"), String(c.ricevuta || "—"), String(c.ora || ""), String(c.note || "")])) }] : []);
  chiusura.firmeInBianco = !chiuOggi.length;
  // un turno firmato e poi riaperto va detto, se no la firma non vuol dire niente
  const riapOggi = CHI.filter((c) => String(c.data || "") === OGGI && riaperture(c).length);
  const riapertureSez = riapOggi.length ? sez("Riaperture del turno", "", [{ tabella: tab(["Turno", "Riaperto da", "Quando", "Motivo"],
    riapOggi.flatMap((c) => riaperture(c).map((r) => [String(c.turno || ""), String(r.da || "—"), dmy(r.il || "") + (r.ora ? " " + String(r.ora) : ""), String(r.motivo || "—")]))) }],
    ["Un turno firmato è stato riaperto per correggerlo: qui è scritto da chi, quando e perché."]) : null;
  return { titolo: "Rapporto di fine turno", data: dmy(OGGI), quadro, attenzione,
    sezioni: [checklist, meteo, personale, obiettivo, attivita, fermiSez, disponibilita].concat(foto.length ? [{ titolo: "Foto delle anomalie", foto, testo: "", blocchi: [], note: [] }] : [])
      .concat([produzione, rapportini, chiusura]).concat(riapertureSez ? [riapertureSez] : []),
    piede: "Generato da Deepwork Campo — registro operativo di giornata; non sostituisce i registri obbligatori." };
}

/* I FERMI CON UNA CAUSALE CHE L'ELENCO NON CONOSCE, detti a parole (05/09,
   salita dalla pagina). `html` decide se le parole vanno avvolte (schermo,
   con `avvolgi`) o nude (testo). Pura. */
export function fraseNonRiconosciute(pf, html = false, avvolgi = (t) => t) {
  if (!pf || !pf.nonRiconosciute) return "";
  const b = (t) => html ? avvolgi(t) : t;
  const parole = (pf.valoriNonRiconosciuti || []).map(v => "«" + b(v) + "»").join(", ");
  return (html ? " · " : " ") + (pf.nonRiconosciute === 1
    ? "1 fermo ha una causale non in elenco (" + parole + ") ed è contato in «Altro»"
    : pf.nonRiconosciute + " fermi hanno una causale non in elenco (" + parole + ") e sono contati in «Altro»");
}

/* LA CONSEGNA DI TURNO, IL TESTO INTERO (05/09). Stava nella pagina, cento
   righe che chiamavano le funzioni giuste — `riassuntoRapportino`,
   `descriviChecklist`, `lavoriNonConclusi`, `testoSegnalazioniTurno`,
   `righeVolateDelGiorno`, `minutiFermoTesto` — ma la COMPOSIZIONE la provava
   solo il browser. Qui la prova anche `run-kpi`: l'ordine delle sezioni, e che
   nessuna sezione resti vuota (ogni assenza ha la sua riga a parole).
   `d`: { oggi (ISO), rapportini e attivita GIÀ del giorno, obiettivi,
   checklist, meteo, chiusure (tutti gli archivi: si filtrano qui),
   volateSentinella (null = Sentinella non letta), infortuniScudo (null =
   Scudo non letto) }. `opts.avviso`: la riga dei dati di esempio, decisa
   dalla pagina (dipende dal modo); `opts.dmy`: la data in italiano. Pura. */
export function testoConsegnaTurno(d = {}, opts = {}) {
  const OGGI = String(d.oggi || "");
  const dmy = opts.dmy || ((iso) => dataIt(iso, "senza data"));
  const RAP_OGGI = d.rapportini || [], ATT_OGGI = d.attivita || [];
  const OBIE = d.obiettivi || [], CHK = d.checklist || [], MET = d.meteo || [], CHI = d.chiusure || [];
  let txt = "CONSEGNA DI TURNO — " + dmy(OGGI) + "\n\n";
  txt += String(opts.avviso || "");
  /* chi non ha il giorno si dichiara anche qui: la consegna è datata in cima
     e si archivia, e i chili di un rapportino che nessuno ha collocato
     passerebbero per prodotti oggi */
  const fuoriOggi = avvisoSenzaGiorno(ATT_OGGI, RAP_OGGI);
  txt += "RAPPORTINI\n";
  txt += (RAP_OGGI.length ? RAP_OGGI.map(r => "- " + r.titolo + (riassuntoRapportino(r) ? " — " + riassuntoRapportino(r) : "")
    + (senzaGiornoDiLavoro(r) ? " [SENZA DATA]" : "") + " [" + r.stato + "]").join("\n") : "- nessun rapportino") + "\n\n";
  const tp = totaliProduzione(RAP_OGGI), unita = Object.entries(tp.perUnita);
  txt += "PRODUZIONE\n";
  txt += (unita.length ? "- totale: " + unita.map(([u, q]) => formattaProduzione(q, u)).join(" + ") + "\n"
    + tp.perTurno.map(t => "- turno " + t.turno + ": " + Object.entries(t.perUnita).map(([u, q]) => formattaProduzione(q, u)).join(" + ")).join("\n")
    : "- nessuna produzione registrata") + "\n";
  txt += (fuoriOggi ? "- ATTENZIONE: " + fuoriOggi + "\n" : "") + "\n";
  const obT = OBIE.filter(o => String(o.data || "") === OGGI)
    .map(o => statoObiettivo(o, RAP_OGGI, ATT_OGGI)).filter(Boolean);
  txt += "OBIETTIVO DEL TURNO\n";
  txt += (obT.length ? obT.map(o => "- turno " + o.turno + ": "
    + (o.unita === UNITA_ATTIVITA ? numeroIt(o.fatto, 0) + " su " + numeroIt(o.obiettivo, 0) + " attività concluse"
                                  : formattaProduzione(o.fatto, o.unita) + " su " + formattaProduzione(o.obiettivo, o.unita))
    + " (" + o.pct + "%, " + segnoIt(o.scarto, 2) + ")").join("\n")
    : "- nessun obiettivo impostato") + "\n\n";
  const chkT = CHK.filter(c => String(c.data || "") === OGGI);
  txt += "CHECKLIST DI INIZIO TURNO\n";
  // «4/9 a posto» nascondeva le voci che nessuno ha guardato: la frase è una sola, `descriviChecklist`
  txt += (chkT.length ? chkT.map(c => { const s = statoChecklist(c.esiti || {});
    return "- " + (c.squadra || "—") + " (turno " + (c.turno || "—") + "): " + descriviChecklist(s)
      + (s.no ? ", NON A POSTO: " + s.problemi.join("; ") : "")
      + (c.ora ? " — chiusa alle " + c.ora : " — non chiusa"); }).join("\n")
    : "- nessuna checklist compilata") + "\n\n";
  const metT = TURNI.map(t => meteoDi(MET, OGGI, t)).filter(m => m && riassuntoMeteo(m));
  txt += "METEO E CONDIZIONI DEL SITO\n";
  txt += (metT.length ? metT.map(m => "- turno " + m.turno + ": " + riassuntoMeteo(m)
    + (m.note ? " — " + m.note : "")).join("\n")
    : "- non registrato") + "\n\n";
  // le volate di oggi dal registro di Sentinella (ponte P6): se non si legge, lo si scrive
  txt += "VOLATE DEL GIORNO (registro di Sentinella)\n";
  txt += righeVolateDelGiorno(riassuntoVolateDelGiorno(d.volateSentinella === undefined ? null : d.volateSentinella, OGGI)).map(l => "- " + l).join("\n") + "\n\n";
  // le due cose che il turno entrante legge per prime: i lavori non conclusi e i pericoli segnalati
  const aperti = lavoriNonConclusi(ATT_OGGI);
  txt += "LAVORI NON CONCLUSI\n";
  txt += (aperti.length
    ? aperti.map(a => "- " + a.titolo + (a.dettaglio ? " (" + a.dettaglio + ")" : "") + " — " + a.chi + " [" + a.etichetta + "]").join("\n")
    : "- nessuna attività aperta: tutto quello di oggi è concluso") + "\n\n";
  txt += "SEGNALAZIONI DEL TURNO\n";
  const segT = TURNI.map(t => ({ turno: t, s: segnalazioniDelTurno(d.infortuniScudo === undefined ? null : d.infortuniScudo, OGGI, t) }))
    .map(x => ({ turno: x.turno, t: testoSegnalazioniTurno(x.s) })).filter(x => x.t);
  txt += (segT.length
    ? [...new Set(segT.map(x => (segT.length > 1 ? "- turno " + x.turno + ": " : "- ") + x.t))].join("\n")
    : "- nessuna segnalazione oggi") + "\n\n";
  const chiuT = CHI.filter(c => String(c.data || "") === OGGI && c.ora);
  txt += "CHIUSURA DEL TURNO\n";
  txt += (chiuT.length ? chiuT.map(c => "- turno " + c.turno + ": " + riassuntoChiusura(c)
    + (c.note ? " — " + c.note : "")).join("\n")
    : "- nessun turno chiuso: consegna non firmata") + "\n";
  // le riaperture non si nascondono nemmeno qui
  const riapT = CHI.filter(c => String(c.data || "") === OGGI && riaperture(c).length);
  if (riapT.length) {
    txt += "RIAPERTURE DEL TURNO\n";
    txt += riapT.map(c => riaperture(c).map(r => "- turno " + c.turno + ": "
      + riassuntoRiapertura(r, dmy)).join("\n")).join("\n") + "\n";
  }
  txt += "\n";
  // i fermi coi minuti, e «senza minuti» dove nessuno li ha misurati
  const fermi = riepilogoFermi(ATT_OGGI);
  const pf = paretoFermi(ATT_OGGI);
  const minutiDi = (causale) => {
    const v = pf.voci.find(x => x.causale === causale);
    return v ? minutiFermoTesto(v.minuti, v.conto, v.senzaMinuti) : "senza minuti";
  };
  txt += "ANOMALIE / FERMI\n";
  txt += (fermi.length
    ? fermi.map(f => "- " + f.causale + ": " + f.conto + " (" + minutiDi(f.causale) + ")").join("\n")
    : "- nessuna anomalia aperta") + "\n";
  if (pf.senzaMinutiTot) {
    txt += "  (" + conta(pf.senzaMinutiTot, "fermo", "fermi") + " su " + pf.fermiTot
      + " senza i minuti registrati: il tempo perso qui sopra e' un minimo)\n";
  }
  if (pf.nonRiconosciute) txt += "  (" + fraseNonRiconosciute(pf, false).trim() + ")\n";
  return txt;
}

// Le categorie già segnalate oggi, in parole: serve alla modale per non far
// ripetere la stessa segnalazione due volte nello stesso turno. Pura e
// testabile; `null` quando non si sa (Scudo non leggibile).
export function categorieGiaSegnalate(s) {
  if (!s || !s.leggibile) return null;
  const viste = [];
  for (const x of s.delTurno) {
    const e = categoriaNearMiss(x && x.categoria);
    if (e && !viste.includes(e)) viste.push(e);
  }
  return viste;
}

// ── IL TRASPORTO DEL PONTE P4 IN DIMOSTRAZIONE ────────────────────────
// In demo/tour non esiste nessun backend, ma Campo e Scudo sono due PAGINE
// diverse: il "finto backend" è una riga di localStorage condivisa fra le due
// app dello stesso browser. Serve solo a far vedere la catena completa —
// apri l'azione qui, la ritrovi là — non è un canale dati e in live non
// esiste. La chiave è la STESSA che usano già Sentinella e Scudo, quindi le
// azioni aperte da Campo compaiono nello scadenzario di Scudo senza toccare
// niente dall'altra parte.
// ⚠️ Restano LOCALI al modulo (come in Scudo, e a differenza di Sentinella che
// le esporta): non sono una regola, sono un ripiego dichiarato.
const PONTE_DEMO_KEY = "deepwork.demo.azioni-ponte";
// e il gemello per il ponte P5: i near-miss segnalati dal fronte. Chiave
// diversa perché sono un'altra collezione (`infortuni`, non `azioni`), stesso
// ripiego dichiarato.
const EVENTI_DEMO_KEY = "deepwork.demo.eventi-ponte";
function leggiPonteDemo(chiave) {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(chiave) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}
function scriviPonteDemo(chiave, lista) {
  try {
    globalThis.localStorage.setItem(chiave, JSON.stringify((lista || []).slice(-200)));
    return true;
  } catch (e) { return false; }   // navigazione privata, quota piena: si prosegue senza
}
function ponteDemoLeggi() { return leggiPonteDemo(PONTE_DEMO_KEY); }
function ponteDemoScrivi(lista) { return scriviPonteDemo(PONTE_DEMO_KEY, lista); }
function eventiDemoLeggi() { return leggiPonteDemo(EVENTI_DEMO_KEY); }
function eventiDemoScrivi(lista) { return scriviPonteDemo(EVENTI_DEMO_KEY, lista); }

export async function campoData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "campo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc, deleteField } =
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
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), traduciCancellazioni(data, deleteField)),
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
      /* ⛔ ERANO CINQUE COPIE DELLA STESSA APERTURA (Terra tre volte, Scudo
         due) e il ponte con Sentinella sarebbe stata la sesta: una copia nasce
         da una firma troppo stretta, e la firma qui è l'`appId`. Un'istanza
         per app, aperta solo quando serve; `null` = non c'è, e chi legge dice
         «non lo so», non «non ce n'è». */
      const istanze = {};                // appId → istanza, null = non c'è; chiave assente = mai provato
      const apriApp = async (appId) => {
        if (!(appId in istanze)) {
          try { istanze[appId] = await DeepworkID.init({ appId }); }
          catch (e) { istanze[appId] = null; }
        }
        return istanze[appId];
      };
      const leggiApp = async (appId, nome) => {
        const s = await apriApp(appId);
        if (!s) return null;
        try {
          return (await getDocs(s.orgCollection(nome))).docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      api.rilieviTerra = () => leggiApp("terra", "rilievi");
      // i FRONTI di Terra: servono alla tendina del rapportino, perché il
      // fronte si sceglie da un elenco e si registra col suo identificativo.
      // ⛔ Mai per nome: basta che qualcuno rinomini un fronte e la produzione
      // finisce su quello sbagliato, su un numero che va nella denuncia.
      // Se Terra non c'è torna null, e la tendina lo dice invece di mostrarsi
      // vuota come se non ci fossero fronti.
      api.frontiTerra = () => leggiApp("terra", "fronti");
      // e l'autorizzazione, da cui si ricava la densità del materiale: a chi
      // compila un rapportino non si chiede un numero che è già registrato
      api.autorizzazioniTerra = () => leggiApp("terra", "autorizzazioni");
      // ── PONTE P3 CON SCUDO — SOLA LETTURA ─────────────────────────────
      // Stesso schema del ponte con Terra: seconda istanza dell'SDK sull'app
      // "scudo", stessa organizzazione, percorso costruito da `orgCollection`.
      // Campo LEGGE i documenti del personale e non li tocca mai: chi rinnova una
      // visita medica lo fa in Scudo, che è l'unica strada per scrivere quel dato.
      // Se Scudo non c'è, o la lettura non è permessa, torna null e la schermata
      // dice che non lo sa — non inventa un «tutto a posto», che su un controllo
      // di sicurezza è la bugia peggiore.
      const apriScudo = () => apriApp("scudo");
      const leggiScudo = (nome) => leggiApp("scudo", nome);
      api.lavoratoriScudo = () => leggiScudo("lavoratori");
      // ── PONTE P6 CON SENTINELLA — SOLA LETTURA (05/09) ─────────────────
      // Le volate del registro: la consegna di turno scrive «le volate di oggi»
      // (fronte, fori, chili, PPV se collegata). Sentinella era l'app che
      // nessuno leggeva. `null` = non lo so, e la consegna lo scrive così.
      api.volateSentinella = () => leggiApp("sentinella", "volate");
      api.scadenzeScudo = () => leggiScudo("scadenze");
      // ── PONTE P4 CON SCUDO — L'UNICA SCRITTURA CHE CAMPO FA FUORI CASA ──
      // Le azioni correttive nate dai fermi. Si LEGGONO per sapere a quali
      // fermi è già stata data una risposta, e se ne AGGIUNGE una quando
      // qualcuno la apre da qui. Nessun aggiornamento e nessuna cancellazione:
      // un'azione, una volta aperta, si gestisce in Scudo — che è il posto dove
      // vive lo scadenzario, il responsabile e la chiusura.
      // Lettura fallita → `null`, cioè «non lo so», mai una lista vuota.
      api.azioniScudo = () => leggiScudo("azioni");
      api.aggiungiAzioneScudo = async (rec) => {
        const s = await apriScudo();
        if (!s) throw new Error("Scudo non raggiungibile");
        return addDoc(s.orgCollection("azioni"), rec);
      };
      // ── PONTE P5 CON SCUDO — IL NEAR-MISS SEGNALATO DAL FRONTE ────────
      // Il registro degli eventi è UNO SOLO, ed è quello di Scudo. Tenerne una
      // copia in Campo «finché qualcuno la prende in carico» sembrerebbe più
      // prudente e sarebbe il contrario: il riepilogo aggregato che Scudo
      // consegna per la L. 198/2025 conterebbe le segnalazioni fatte da Scudo e
      // non quelle ferme di qua — cioè direbbe un numero più basso del vero,
      // che è esattamente l'assenza travestita da dato favorevole. Si scrive
      // nello stesso registro, e lì la segnalazione ha già tutto: l'azione
      // correttiva, l'analisi della causa, il conteggio per l'ente.
      // Lettura fallita → `null` («non lo so»), mai una lista vuota.
      api.infortuniScudo = () => leggiScudo("infortuni");
      api.aggiungiEventoScudo = async (rec) => {
        const s = await apriScudo();
        if (!s) throw new Error("Scudo non raggiungibile");
        return addDoc(s.orgCollection("infortuni"), rec);
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
      // in dimostrazione i rilievi non arrivano da Terra: sono finti, ma
      // coerenti coi rapportini d'esempio (vedi DEMO.rilieviTerra)
      rilieviTerra: async () => mem.rilieviTerra || [],
      // in dimostrazione i documenti del personale non arrivano da Scudo: sono
      // finti, ma copiati dalla dimostrazione di Scudo id per id
      lavoratoriScudo: async () => mem.lavoratoriScudo || [],
      scadenzeScudo: async () => mem.scadenzeScudo || [],
      // ponte P6: le volate di Sentinella, copiate dalla sua dimostrazione
      volateSentinella: async () => mem.volateSentinella || [],
      // ponte P4: le azioni correttive che in esercizio stanno in Scudo. In
      // dimostrazione ci sono solo quelle aperte da qui, e si vedono anche
      // aprendo Scudo nello stesso browser (stessa chiave)
      azioniScudo: async () => ponteDemoLeggi(),
      aggiungiAzioneScudo: async (rec) => {
        const nuova = { id: "pn" + Math.random().toString(36).slice(2, 8), ...rec };
        ponteDemoScrivi([...ponteDemoLeggi(), nuova]);
        return nuova;
      },
      // ponte P5: il registro eventi che in esercizio sta in Scudo. In
      // dimostrazione parte dai due near-miss d'esempio (copiati da quella di
      // Scudo, id per id, come i lavoratori) e si allunga con quelli segnalati
      // da qui: chi prova l'app vede la segnalazione comparire davvero.
      infortuniScudo: async () => [...(mem.infortuniScudo || []), ...eventiDemoLeggi()],
      aggiungiEventoScudo: async (rec) => {
        const nuovo = { id: "pe" + Math.random().toString(36).slice(2, 8), ...rec };
        eventiDemoScrivi([...eventiDemoLeggi(), nuovo]);
        return nuovo;
      },
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
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) applicaPercorsi(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
