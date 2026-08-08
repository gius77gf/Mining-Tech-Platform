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
//                   quotaFondoM (quota di fondo scavo del progetto, m s.l.m.,
//                   anche negativa; assente = non dichiarata, non zero),
//                   estrattoPregressoM3, materiale,
//                   densita (t/m³ in banco) e la sua PROVENIENZA:
//                     densitaFonte: atto|laboratorio|preset|manuale (assente =
//                     non dichiarata, MAI un ripiego su «manuale»),
//                     densitaQuando (ISO, la data della prova),
//                     densitaRiferimento (il documento da esibire),
//                   prescrizioni,
//                   riferimenti, stato: vigente|archiviata,
//                   sogliaGuardiaPct, preavvisoGiorni, anniRitmo }
//   scadenze/{id}: { tipo, descrizione, dataScadenza (ISO),
//                   preavvisoGiorni, ricorrenzaMesi|null, note }
//   lotti/{id}:   { nome, ordine (la sequenza prevista dal progetto),
//                   superficieMq, volumeM3 (previsto dal progetto, non
//                   misurato), stato: previsto|aperto|esaurito|in-recupero|
//                   recuperato|collaudato, apertoIl, esauritoIl,
//                   recuperoIniziatoIl, recuperoFinitoIl, collaudatoIl (ISO
//                   o null), frontiId: [] (i fronti che stanno nel lotto),
//                   quotaFondoM (il fondo di QUESTO settore quando il
//                   progetto ne dà uno diverso da quello generale: vince
//                   sull'atto), nota }
// I KPI non si salvano mai: si CALCOLANO dai rilievi
// (volumi mese = somma dei volumi elaborati del mese,
//  avanzamento piano = estratto anno / pianificato anno).
// Anche lo STATO di una scadenza non si salva: si calcola dalla data e
// dal preavviso scelto dall'utente (stesso principio di Scudo).
// NIENTE regole di legge scritte nel codice: le cave sono materia
// REGIONALE, quindi soglie, preavvisi e periodicità li imposta l'utente.
// ============================================================

import { parseCsvLine, numIt, isIntestazione, giorniTra, isoLocale, dataISOEsiste, conta, csvCell,
         AVVISO_DECIMALE as AVVISO_DECIMALE_SHELL } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  fronti: [
    { id: "f1", nome: "Fronte Nord", banco: "banco 2", quota: 340, dettaglio: "Prossima volata 12:30", avanzamento: 72, stato: "attivo" },
    { id: "f2", nome: "Fronte Est", banco: "banco 1", quota: 355, dettaglio: "Perforazione in corso · 14/22 fori", avanzamento: 41, stato: "attivo" },
    { id: "f3", nome: "Fronte Sud", banco: "banco 3", quota: 320, dettaglio: "Verifica stabilità scarpata", avanzamento: 18, stato: "sospeso" },
  ],
  // IL PIANO DI COLTIVAZIONE A LOTTI. I lotti d'esempio sono COERENTI coi
  // fronti qui sopra e coi rilievi qui sotto: il lotto Nord contiene f1, quello
  // Est f2, quello Sud f3 (fronte sospeso, e infatti il lotto è ancora
  // «previsto»). I tre lotti più vecchi non dichiarano nessun fronte perché
  // quei fronti sono stati chiusi prima di Terra: sullo schermo il loro volume
  // misurato resta un TRATTINO con la sua ragione, non uno zero che
  // sembrerebbe «non ancora cominciato».
  // Gli stati coprono tutta la vita di un lotto, collaudo compreso: `lo2` è
  // recuperato ma NON collaudato, cioè il caso in cui l'azienda ha finito e
  // l'ente non ha ancora verificato.
  lotti: [
    { id: "lo1", nome: "Lotto 1 — settore Ovest", ordine: 1, superficieMq: 14000, volumeM3: 210000,
      stato: "collaudato", apertoIl: "2021-04-12", esauritoIl: "2022-11-30",
      recuperoIniziatoIl: "2023-01-16", recuperoFinitoIl: "2023-09-08", collaudatoIl: "2024-02-19",
      frontiId: [], nota: "Chiuso e collaudato dall'ente: verbale agli atti." },
    { id: "lo2", nome: "Lotto 2 — settore Sud-Ovest", ordine: 2, superficieMq: 6000, volumeM3: 88000,
      stato: "recuperato", apertoIl: "2022-10-03", esauritoIl: "2024-07-19",
      recuperoIniziatoIl: "2024-09-02", recuperoFinitoIl: "2026-05-22", collaudatoIl: null,
      frontiId: [], nota: "Collaudo chiesto all'ente: fino al verbale il lotto non è chiuso." },
    { id: "lo3", nome: "Lotto 3 — settore Nord-Ovest", ordine: 3, superficieMq: 5500, volumeM3: 75000,
      stato: "in-recupero", apertoIl: "2023-02-06", esauritoIl: "2026-02-27",
      recuperoIniziatoIl: "2026-04-13", recuperoFinitoIl: null, collaudatoIl: null,
      frontiId: [], nota: "Rimodellamento delle scarpate in corso." },
    /* Il settore Nord è l'unico che nel progetto d'esempio ha un fondo SUO,
       più alto di quello generale (335 contro 300): è il caso normale di un
       progetto che scende per gradoni, ed è anche quello che fa vedere il
       numero utile — il fronte Nord sta a 340 m, cioè a soli 5 m dal suo
       fondo, mentre contro il fondo generale ne avrebbe 40. Se il fondo del
       lotto non vincesse su quello dell'atto, la cava leggerebbe otto volte
       il margine che ha davvero. */
    { id: "lo4", nome: "Lotto 4 — settore Nord", ordine: 4, superficieMq: 12000, volumeM3: 180000,
      stato: "aperto", apertoIl: "2024-05-02", esauritoIl: null,
      recuperoIniziatoIl: null, recuperoFinitoIl: null, collaudatoIl: null,
      frontiId: ["f1"], quotaFondoM: 335, nota: "" },
    { id: "lo5", nome: "Lotto 5 — settore Est", ordine: 5, superficieMq: 9500, volumeM3: 140000,
      stato: "aperto", apertoIl: "2025-09-08", esauritoIl: null,
      recuperoIniziatoIl: null, recuperoFinitoIl: null, collaudatoIl: null,
      frontiId: ["f2"], nota: "" },
    { id: "lo6", nome: "Lotto 6 — settore Sud", ordine: 6, superficieMq: 15000, volumeM3: 200000,
      stato: "previsto", apertoIl: null, esauritoIl: null,
      recuperoIniziatoIl: null, recuperoFinitoIl: null, collaudatoIl: null,
      frontiId: ["f3"], nota: "Coltivazione subordinata alla verifica di stabilità della scarpata." },
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
    /* ⛔ UN ANNO CON SOLO UNA RIPRESA DA CUMULO, e nessun rilievo del fronte.
       È l'anno fiacco in cui si è solo rimosso materiale dal piazzale e nessuno
       ha rilevato la parete — e senza di lui il caso più delicato del riepilogo
       annuale non lo vedeva nessuno: `baseOnereEscavazione` risponde «non
       dichiarabile» invece di «0 m³», perché un rilievo del cumulo misura il
       MUCCHIO, non il fronte, e uno zero su un foglio che va all'ente sarebbe
       una dichiarazione in difetto su una cosa mai misurata.
       Stessa ragione per cui la dimostrazione di Conti contiene una fattura
       senza scadenza e quella di Scudo un documento senza stato: un dato
       assente è uno stato che il prodotto sa raccontare. */
    { id: "r7", titolo: "Ripresa da cumulo 12/09", data: "2024-09-12", tipo: "Ortofoto + DEM", volumeM3: 3100, stato: "elaborato", metodo: "RTK", gsd: "2", fronteId: null, provenienza: "cumulo" },
  ],
  piano: [
    { id: "p1", titolo: "Autorizzazione vigente", dettaglio: "Scadenza 2029", stato: "vigente", pianificatoAnnuoM3: 125000, riserveM3: 1200000 },
    { id: "p2", titolo: "Variante fronte Sud", dettaglio: "Da valutare dopo verifica stabilità", stato: "in-esame" },
  ],
  autorizzazioni: [
    { id: "a1", numeroAtto: "Atto n. 128 del 2021 (esempio)", ente: "Ente competente di esempio",
      dataRilascio: "2021-03-15", dataScadenza: "2031-03-14", superficieMq: 78000,
      volumeAutorizzatoM3: 1200000, quotaFondoM: 300,
      /* ⛔ IL «GIÀ ESTRATTO» PORTA LA CAVA OLTRE LA SOGLIA DI GUARDIA, E NON È
         UN NUMERO SCELTO PER FARE COLORE. Con 340.000 la dimostrazione stava al
         36,8% del concesso, cioè in `ok`: misurato il 07/08 navigando tutte e
         sei le sezioni, `.vita.warn`, `.vita.danger`, `.kpi.warn`, `.riga.att` e
         `.riga.dng` uscivano a ZERO in tutto il documento. Fra quelli c'è
         l'avviso che Terra esiste per dare — «la soglia di guardia è superata,
         prepara rinnovo o variante» — e finché non compare mai, nessuno lo
         guarda: né chi vende, né chi misura il contrasto dei colori (un banco
         che non trova la classe non la sa giudicare, e il suo «0 violazioni»
         vale per i soggetti che si sono presentati, non per quelli che
         esistono).
         È la stessa ragione per cui questa dimostrazione contiene già l'anno
         con la sola ripresa da cumulo (`r7`) e la scadenza senza data (`t5`):
         uno stato che il prodotto sa raccontare va MOSTRATO, non solo
         calcolato. Qui però non si forza nessuna classe — si cambia il dato, e
         lo stato lo decide `vitaCava` come per qualunque cliente.
         Il numero è coerente con la storia che l'atto racconta: 1.200.000 m³
         concessi nel 2021 fino al 2031, cioè 120.000 m³ l'anno di ritmo
         previsto (ed è quello che dichiara il piano, `pianificatoAnnuoM3:
         125000`). Cinque anni dopo, 880.000 m³ vogliono dire che si è cavato
         più in fretta del progetto: col misurato in Terra il cumulato fa
         981.400 m³, l'81,8% del concesso — sopra la soglia di guardia
         dell'80% — e al ritmo degli ultimi tre anni il volume finisce verso il
         2028, tre anni PRIMA che scada il titolo. È esattamente la domanda per
         cui il contatore vita cava è stato costruito, e con il 36,8% non aveva
         risposta da dare. */
      estrattoPregressoM3: 880000, materiale: "Sabbia e ghiaia",
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
    /* ⛔ LA SCADENZA DI CUI NON SI SA QUANDO SCADE. `riepilogoScadenze` tiene un
       contatore APPOSTA per queste — e il commento accanto dice perché:
       «contarle fra le a posto era il modo in cui sparivano». Ma in
       dimostrazione tutte e quattro avevano la data, quindi quel contatore
       restava a zero, la riga del riepilogo non lo scriveva mai, e la difesa
       non la vedeva nessuno.
       È un'ASSENZA ed è additiva: gli altri tre conteggi non si muovono, sale
       solo il totale e il contatore delle senza-data. Storia vera: la
       prescrizione c'è, il termine sull'atto è scritto a mano e non si legge —
       e finché non lo si chiarisce non è «a posto», è «non si sa». */
    { id: "t5", tipo: "prescrizione", descrizione: "Prescrizione dell'atto — termine da chiarire con l'ente", dataScadenza: null, preavvisoGiorni: 60, ricorrenzaMesi: null, note: "Sul titolo il termine è illeggibile: chiesto chiarimento." },
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
import { provenienzaDi, applicaPercorsi, traduciCancellazioni } from "../../shared/dw-ponti.js";
/* ⛔ «QUESTO NUMERO L'HA SCRITTO QUALCUNO?» — la regola sta in `shared/` e la
   usano già Conti e Sentinella; Terra era la terza app a averne bisogno e se ne
   teneva una versione più debole nel file che ESCE (`csvRilievi`). Non si
   riscrive: si ri-esporta, e la prova pretende l'IDENTITÀ
   (`terra.numeroDichiarato === ponti.numeroDichiarato`), non il comportamento —
   due copie uguali oggi divergono domani senza che nessuno lo veda. */
export { numeroDichiarato } from "../../shared/dw-ponti.js";
import { numeroDichiarato } from "../../shared/dw-ponti.js";
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

/* ══════════════════════════════════════════════════════════════════════
   LA FRASE CHE SI ACCORDA COL NUMERO
   ----------------------------------------------------------------------
   ⛔ IL NUMERO È GIUSTO E A MENTIRE È LA FRASE. Il 06/08, censendo ogni
   testo di Terra costruito coi dati nei casi limite, sono usciti dodici
   punti in cui la parola accanto al numero non lo guardava: «restano 1
   viaggi», «ogni 1 mesi», «Import fronti: 1 aggiunti», «1 indicativi» —
   quest'ultima sul prospetto che va all'ente. Nessuno di questi è un
   errore di calcolo: la frase resta grammaticale a occhio e cade solo sul
   caso da uno, che nella dimostrazione non c'è mai.
   Le due regole stanno QUI e non nella pagina per la ragione di sempre:
   scritte a mano nel punto d'uso diventano dodici copie, e la tredicesima
   nasce diversa. Sono pure, quindi si provano in `run-kpi.mjs`.
   ⚠️ Servono solo a Terra, oggi. Il giorno in cui una seconda app ne ha
   bisogno il posto è `shared/dw-ponti.js` e questo modulo le ri-esporta:
   un alias non è una seconda implementazione.

   ⛔ E LA PRIMA DELLE TRE È STATA SCRITTA E POI BUTTATA, perché c'era già.
   Avevo aggiunto qui un `parolaNum(numeroScritto, sing, plur)` che decideva
   sul numero SCRITTO invece che sul valore; messo alla prova riga per riga
   contro `plurale` di `shared/deepwork-id-client/dw-shell.js` dà **la stessa
   risposta su ogni caso che Terra produce** («1», «0,7», «1,5», «1.000»,
   1.04), perché `Number("0,7")` è `NaN` e `NaN !== 1` come «0,7» !== «1».
   Cioè era una copia più debole con un nome diverso — la forma esatta che
   CLAUDE.md dice di cercare, scritta dalla persona che la stava cercando.
   Terra importa `plurale` da `shared/` e basta.

/* 2 · LA «D» EUFONICA. Terra scrive «si vedono i mesi fino a <mese>»: in
   agosto e in aprile usciva «fino a agosto». La regola moderna (Crusca) è
   stretta: la «d» si mette solo davanti alla STESSA vocale, quindi «ad
   agosto» e «ad aprile» sì, «a ottobre» no. Si guarda la parola che segue,
   non la sua lunghezza. */
export function aEufonica(parolaSeguente) {
  return /^a/i.test(String(parolaSeguente || "").trim()) ? "ad" : "a";
}

/* 3 · L'ARTICOLO DAVANTI A UN NUMERO SI SCEGLIE PER COME IL NUMERO SI
   PRONUNCIA, non per come si scrive: «lo 0%» (zero), «l'1%» (uno), «l'8%»
   (otto), «l'11%» (undici), «l'80%» (ottanta). Misurati in Terra due casi
   veri: «si sa da dove viene il 0%» nella ripartizione dei turni e «l'hai
   messa al 80%» nell'avviso della soglia.
   ⚠️ COPERTURA DICHIARATA, non totale: si guarda la sola parte INTERA e si
   riconoscono zero, uno, otto, undici, diciotto, ottanta-e-dintorni e
   ottocento-e-dintorni. Un numero come 108 («centotto») prende «il», che è
   giusto; uno come 1.800 («milleottocento») pure. Quello che resta fuori è
   raro nei numeri che Terra mostra, ed è meglio dichiararlo che fingere
   una regola generale che non c'è.
   ⚠️ E L'ARTICOLO TORNA COL SUO SPAZIO GIÀ ATTACCATO («il », «lo », «l'»):
   davanti all'apostrofo lo spazio non ci va, e lasciarlo decidere a chi
   chiama vuol dire riscrivere quella condizione a ogni punto d'uso — cioè
   la copia debole, un piano più sotto. */
const ARTICOLI = {
  il:  ["il ",  "lo ",  "l'"],
  al:  ["al ",  "allo ", "all'"],
  del: ["del ", "dello ", "dell'"],
  nel: ["nel ", "nello ", "nell'"],
  sul: ["sul ", "sullo ", "sull'"],
  dal: ["dal ", "dallo ", "dall'"],
};
export function articoloNumero(base, numeroScritto) {
  const forme = ARTICOLI[String(base).toLowerCase()];
  if (!forme) return String(base) + " ";
  // la parte intera, senza i punti delle migliaia e senza il segno
  const intera = String(numeroScritto).trim().replace(/^[−+-]/, "").split(/[,\s]/)[0].replace(/\./g, "");
  if (!/^\d+$/.test(intera)) return forme[0];
  if (/^0+$/.test(intera)) return forme[1];                       // zero → lo
  const n = Number(intera);
  const vocale = n === 1 || n === 8 || n === 11 || n === 18
    || (n >= 80 && n <= 89) || (n >= 800 && n <= 899);
  return vocale ? forme[2] : forme[0];                            // uno/otto/undici → l'
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
/* ⛔ «CON UN VOLUME» VUOL DIRE CON UN NUMERO, e fino al 01/08 non lo voleva
   dire: la condizione era `r.volumeM3 != null`, che accetta `""`, `"  "`,
   `"abc"` e perfino `{}`. Quei rilievi passavano per usabili, e poi ogni somma
   li leggeva con `+r.volumeM3 || 0` — cioè li contava come una misura di ZERO.
   Un rilievo il cui volume non si legge non è un rilievo che ha misurato zero:
   è un rilievo che non ha misurato. Misurato dove si può arrivare: il lettore
   CSV la riga con la colonna vuota la **scarta** già (restituisce `[]`), quindi
   il caso arriva dal form e dai dati vecchi — latente, non impossibile.
   ⚠️ E le tre guardie stanno in quest'ordine per forza: `+null` fa **0** e
   `Number.isFinite(0)` è **true**, quindi `null` va escluso PRIMA; e `+""` e
   `+"  "` fanno **0** anche loro, quindi la stringa vuota va tolta prima
   ancora di convertire. È la trappola scritta in CLAUDE.md, e qui morde due
   volte di fila. */
export function rilievoUsabile(r) {
  if (!r || r.stato !== "elaborato") return false;
  const v = r.volumeM3;
  if (v == null || String(v).trim() === "") return false;
  return Number.isFinite(+v);
}
/* ⛔ «CON UNA DATA VERA» VUOL DIRE CHE QUEL GIORNO ESISTE, e fino al 02/08 qui
   c'era `/^\d{4}-\d{2}-\d{2}$/`, cioè un controllo di FORMA. «2026-02-30» ha la
   forma giusta e non esiste: `Date` non lo rifiuta, lo fa **scorrere** al 2
   marzo. Il 31/07 le porte d'ingresso (import CSV dei rilievi) sono state
   chiuse con `dataISOEsiste`, ma le due LETTURE interne — questa e
   `rilievoPrecedente` — erano rimaste alla forma: un rilievo già in archivio
   con quel giorno passava di qui e poi `confrontoRilievi` e `ritmoMedioAnnuo`
   ci costruivano sopra un conto di giorni e un ritmo annuo. Misurato il 02/08:
   dal 01/02 al «30/02» il confronto rispondeva **29 giorni** e 48 m³ al giorno,
   e il ritmo medio scriveva `dal: "2026-02-30"` — una data che non esiste,
   stampata come inizio del periodo. La funzione che sa la differenza è in
   `shared/` da mesi ed è già importata in cima a questo file. */
export function rilievoUsabileConData(r) {
  return rilievoUsabile(r) && dataISOEsiste(String((r && r.data) || ""));
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
// dipendono dal materiale (l'utente li imposta).
// ⚠️ QUESTA FUNZIONE PRENDE LA DENSITÀ COME NUMERO, e va bene: qui si
// moltiplica. DA DOVE VIENE quel numero è un'altra domanda, e la risposta sta
// più in basso in questo file (`densitaDichiarata` e compagnia): chi mostra il
// risultato deve dire anche quella, se no un valore tipico di letteratura e un
// certificato di laboratorio finiscono sullo schermo con la stessa faccia.
/* ⛔ E FINO AL 03/08 «NUMERI NON VALIDI → 0», che è la faccia peggiore del
   principio del fondatore perché il numero tranquillo qui sono dei SOLDI.
   Misurato aprendo la pagina e svuotando il campo della densità — due gesti,
   nessun dato strano: il riquadro scriveva «Estratto 2026: 79.400 m³ → **0 t**
   → **€ 0** di materiale», e tre righe più su la nota diceva «Densità non
   impostata… il valore del materiale **non si calcola**». Cioè la stessa
   schermata si smentiva da sola, e a vincere era lo zero.
   La causa è il solito `+null || 0`: `+null`, `+""` e `+"  "` fanno **0**, e
   `Math.max(0, …)` porta a zero anche una densità negativa. Un materiale senza
   densità non vale zero euro: non si sa quanto vale.
   Il predicato che distingue «registrato» da «assente» è già scritto in questo
   file — `_numRegistrato`, più in basso, quello che difende il verbale — e non
   se ne scrive un secondo. Qui si aggiunge solo il «non negativo»: una densità
   o un prezzo sotto zero non sono una misura di zero, sono un dato da
   correggere. Il volume 0 invece resta un volume misurato, e vale 0 €.
   `calcolabile` è la bandiera del vocabolario chiuso, e la legge la pagina. */
export function valoreMateriale(volumeM3, densita, prezzoTon) {
  const buono = (x) => _numRegistrato(x) && +x >= 0;
  const vOk = buono(volumeM3), dOk = buono(densita), pOk = buono(prezzoTon);
  const tonnellate = vOk && dOk ? (+volumeM3) * (+densita) : null;
  const valore = tonnellate != null && pOk ? tonnellate * (+prezzoTon) : null;
  return { tonnellate, valore, calcolabile: valore != null,
    /* ⚠️ le frasi dicono l'EFFETTO, non «manca il campo»: così restano vere sia
       quando il numero non c'è sia quando c'è e non si legge, e chi le scrive
       non deve indovinare quale dei due casi ha davanti. */
    motivo: valore != null ? ""
      : !vOk ? "Senza il volume estratto non si calcolano né le tonnellate né il valore."
        : !dOk ? "Senza una densità del materiale i metri cubi non si possono portare in tonnellate: il valore del materiale non si calcola."
          : "Senza un prezzo per tonnellata il valore del materiale non si calcola: le tonnellate però ci sono." };
}
// Le densità di riferimento vivono in `shared/dw-ponti.js`: le usa Terra per il
// valore del materiale, e le usa il ponte P2 anche da CAMPO, che deve poter
// portare in metri cubi le tonnellate dichiarate dai turni senza chiedere a chi
// compila un numero che nell'autorizzazione c'è già.
export { DENSITA_PRESET, presetDensita, densitaDelMateriale } from "../../shared/dw-ponti.js";
// e serve anche QUI dentro, a `densitaDellaCava`: un `export … from` ri-esporta
// senza creare un nome locale, quindi l'import va scritto lo stesso — e non è
// una seconda copia, è lo stesso oggetto (lo pretende la prova `terra.X ===
// ponti.X` in run-kpi).
import { densitaDelMateriale } from "../../shared/dw-ponti.js";

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
  // ⛔ L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE. Qui `stato` rispondeva
  // "ok" anche quando non c'era NIENTE da proiettare — e la pagina ci colora il
  // KPI dell'avanzamento, che diventava verde. Verde vuol dire «il ritmo sta
  // dentro il piano»: una misura. Senza rilievi dell'anno, o a gennaio quando
  // l'anno trascorso è troppo poco per una stima, quella misura non esiste.
  // Il grafico se ne difendeva già da solo (`stato === "ok" ? null`), il KPI
  // no: una regola che serve a due posti va scritta UNA volta, e il posto è
  // qui. I due stati sono distinti perché le due cause lo sono, e la pagina
  // aveva già le parole giuste per raccontarle separate.
  const stato = estrattoAnno <= 0 ? "senza-rilievi"
    : pctPiano == null ? "presto"
      : pctPiano > 100 ? "danger" : pctPiano >= 90 ? "warn" : "ok";
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
/* ⛔ E «VOLUME NON VALIDO» NON VOLEVA DIRE QUELLO CHE LA RIGA QUI SOPRA
   PROMETTE. `+null` fa **0** e `0 >= 0` è **true**, quindi un volume assente
   (`null`, `""`, `"  "`) non tornava `null`: tornava `{volume:0, banda:0,
   min:0, max:0}` — cioè «misurato 0 m³, con incertezza zero», che è il numero
   più tranquillo che questa funzione sappia produrre. Misurato il 03/08 nel
   posto peggiore, il **verbale che va all'ente**: su un rilievo di archivio
   segnato «elaborato» col volume illeggibile il foglio stampava «Volume
   misurato — m³ (**± 0 m³ · fra 0 e 0 m³**)» e, sotto, «la tolleranza tipica è
   ± 2%, cioè circa **± 0 m³** su questo volume». Nella stessa pagina
   `descriviOrigine` diceva che il numero non è riproducibile.
   La guardia sta PRIMA della conversione e usa il predicato che c'è già
   (`_numRegistrato`): un volume negativo continua a tornare `null` come prima. */
export function bandaVolume(volumeM3, tolleranzaPct) {
  if (!_numRegistrato(volumeM3)) return null;            // assente ≠ misurato zero
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
/* la stessa guardia di `rilievoUsabileConData`: se qui restasse la forma, un
   rilievo con un giorno che non esiste troverebbe un «precedente» da cui poi il
   verbale farebbe partire la misura */
export function rilievoPrecedente(rilievi, r) {
  if (!r || !dataISOEsiste(String(r.data || ""))) return null;
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
//    ⛔ E allora un pregresso MAI DICHIARATO non può passare per uno zero
//    dichiarato: `pregressoDichiarato` tiene le due cose separate, perché il
//    numero resta zero (non c'è niente di meglio da sommare) ma la frase che
//    lo accompagna deve dire che il consumato è un MINIMO, non una misura.
//    La guardia sta PRIMA della conversione: `+null` fa zero e
//    `Number.isFinite(0)` risponde true.
//  - `rilieviScavo`: quanti rilievi di scavo reggono `rilevato`. Zero rilievi
//    non è «zero estratto»: è «nessuno ha misurato», e chi colora un semaforo
//    su questo numero ha bisogno di saperlo (vedi `vitaCava`).
export function estrattoComplessivo(rilievi, autorizzazione) {
  const a = autorizzazione || {};
  const da = /^\d{4}-\d{2}-\d{2}$/.test(String(a.dataRilascio || "")) ? String(a.dataRilascio) : null;
  const dentro = (rilievi || [])
    .filter(rilievoUsabile)
    .filter(r => !da || String(r.data || "") >= da);
  const somma = (arr) => arr.reduce((s, r) => s + (+r.volumeM3 || 0), 0);
  const scavo = soloScavo(dentro);
  const rilevato = somma(scavo);
  const daCumulo = somma(soloCumulo(dentro));
  const gp = a.estrattoPregressoM3;
  const pregressoDichiarato = !(gp == null || gp === "") && Number.isFinite(+gp);
  const pregresso = Math.max(0, +gp || 0);
  return { rilevato, daCumulo, pregresso, pregressoDichiarato,
    rilieviScavo: scavo.length, totale: rilevato + pregresso, daData: da };
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
  // ⛔ L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE — la stessa lezione già
  // imparata dal KPI dell'avanzamento, e questo è il cartellone che si guarda
  // per primo. Senza nessun rilievo di scavo sotto il titolo e senza un
  // pregresso dichiarato, «0% consumato · nei limiti» in verde non è una buona
  // notizia: è una domanda a cui non ha risposto nessuno. `pct` e `residuo`
  // restano quello che sono (il conto va comunque fatto), ma `misurabile` dice
  // a chi disegna che quei numeri non si colorano e non si mostrano come una
  // misura. Un cumulo ripreso non conta: non è scavo sotto questo titolo.
  const misurabile = est.rilieviScavo > 0 || est.pregressoDichiarato;
  const stato = !misurabile ? "senza-misure"
    : pct >= 100 ? "danger" : (soglia != null && pct >= soglia) ? "warn" : "ok";
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
    misurabile, pregressoDichiarato: est.pregressoDichiarato, rilieviScavo: est.rilieviScavo,
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
/* ⛔ «CON VOLUME» È `rilievoUsabile`, E QUI ERA RISCRITTO PIÙ DEBOLE. La riga
   diceva `r.stato !== "elaborato" || r.volumeM3 == null`, cioè la condizione
   che il commento qui sopra promette («elaborato con volume») scritta a mano e
   senza la parte che conta: `""`, `"  "` e `"circa 5000"` passavano. Misurato
   il 03/08 aggiungendo alla dimostrazione un rilievo del 2019 col volume
   illeggibile: il selettore degli anni della Denuncia offriva **2019**, e la
   finestra di `banchiDaSempre` si apriva da lì — da tre anni a **otto**, con
   cinque anni ciechi in mezzo, sulla forza di un rilievo che non ha misurato
   niente. Un rilievo il cui volume non si legge non è un anno con dei volumi.
   La funzione che sa la differenza sta cinquecento righe più su, in questo
   stesso file, ed è già usata da tutti gli altri lettori. */
export function anniConVolumi(rilievi, oggi = new Date()) {
  const anni = new Set([String(new Date(oggi).getFullYear())]);
  for (const r of rilievi || []) {
    if (!rilievoUsabile(r)) continue;
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
    const sc = soloScavo(dentro), cu = soloCumulo(dentro);
    /* ⛔ ANCHE IL MESE SPEZZA LA CONTA, dal 07/08 e per la stessa ragione dei
       fronti qui sotto — che era già scritta e valeva un piano più su. Il
       prospetto stampato promette in una nota che «la colonna Rilievi dice dove
       non ha misurato nessuno»: con la conta totale un mese con una sola ripresa
       da cumulo stampa «0 | 3.100 | 1», e quell'`1` smentisce la nota che lo
       spiega. Il CSV lo scriveva uguale, `mese;Settembre 2024;0;3100;1`. */
    mesi.push({ mese: m, ym, scavo: somma(sc), cumulo: somma(cu), rilievi: dentro.length,
      rilieviScavo: sc.length, rilieviCumulo: cu.length });
  }

  /* ⛔ E LA CONTA DEI RILIEVI VA SPEZZATA PER PROVENIENZA, non lasciata in un
     totale solo. Con il solo `rilievi` chi legge la voce di un fronte non ha
     modo di distinguere «scavo misurato pari a zero» da «lo scavo non l'ha
     misurato nessuno»: gli resta `scavo > 0`, che è esattamente la scorciatoia
     che il principio dell'assenza vieta. È la stessa distinzione che
     `serieAnnuale` ha già dovuto tirare fuori a livello di ANNO
     (`rilieviScavo`), e che a livello di FRONTE mancava. */
  const perFronte = new Map();
  for (const r of dellAnno) {
    const k = r.fronteId || "";
    if (!perFronte.has(k)) perFronte.set(k, { fronteId: r.fronteId || null, scavo: 0, cumulo: 0,
      rilievi: 0, rilieviScavo: 0, rilieviCumulo: 0 });
    const v = perFronte.get(k), prov = provenienzaDi(r);
    v[prov] += (+r.volumeM3 || 0);
    v[prov === "scavo" ? "rilieviScavo" : "rilieviCumulo"]++;
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
  const sottoIlTitolo = soloScavo(elab).filter(r => (!da || String(r.data) >= da) && String(r.data) <= finoA);
  const scavoSotto = somma(sottoIlTitolo);
  // stessa distinzione di `estrattoComplessivo`, e per lo stesso motivo: il
  // cumulato e il residuo di fine anno si colorano solo se sotto ci sta una
  // misura o un pregresso dichiarato. Zero rilievi e nessun pregresso danno
  // «0% del concesso» in verde su una cava di cui non si sa niente.
  const gp = a.estrattoPregressoM3;
  const pregressoDichiarato = !(gp == null || gp === "") && Number.isFinite(+gp);
  const pregresso = Math.max(0, +gp || 0);
  const misurabile = sottoIlTitolo.length > 0 || pregressoDichiarato;
  const concesso = +a.volumeAutorizzatoM3 || 0;
  const cumulatoFineAnno = pregresso + scavoSotto;
  const residuoFineAnno = concesso > 0 ? Math.max(0, concesso - cumulatoFineAnno) : null;
  const pctFineAnno = concesso > 0 ? Math.round(1000 * cumulatoFineAnno / concesso) / 10 : null;

  return {
    anno: +y,
    scavo: somma(scavoRil), cumulo: somma(cumuloRil),
    rilieviScavo: scavoRil.length, rilieviCumulo: cumuloRil.length,
    mesi, fronti, qualita, banda,
    concesso: concesso > 0 ? concesso : null, pregresso, pregressoDichiarato, misurabile,
    cumulatoFineAnno, residuoFineAnno, pctFineAnno,
    inCorso: +y === new Date(oggi).getFullYear(),
  };
}

/* ── L'ONERE DI ESCAVAZIONE ─────────────────────────────────────────────────
   Il conto che accompagna il riepilogo annuale dei volumi: quanto si deve
   all'ente per il materiale estratto nell'anno. È la seconda voce dell'elenco
   in `docs/RICERCA_DOCUMENTI_ENTI_202607.md` — quella che «fa perdere giornate
   intere» e che in alcune regioni va presentata **anche se non si è estratto
   nulla**.

   ⛔ QUI NON SI FANNO EURO, E LA RAGIONE È COSTATA UNA CORREZIONE. La prima
   versione di questa funzione moltiplicava per una tariffa €/m³ e restituiva un
   importo. Era una **terza scrittura della stessa regola**: `canonePeriodo` di
   Conti fa già il conto in euro, con l'aliquota impostata dall'organizzazione,
   la scelta fra €/t e €/m³ e la base «venduto o scavato» — e per lo scavato usa
   `misuratoPeriodo` di `shared/dw-ponti.js`, la stessa che usa Terra. Non solo:
   la pagina di Terra **scrive al cliente** «il conto in euro non lo fa Terra,
   l'aliquota si imposta in Conti», quindi il modulo contraddiceva in silenzio
   una decisione che il prodotto dichiara a schermo.
   ⚠️ E `nomi-doppi.mjs` non poteva vederlo: i due nomi sono diversi
   (`onereEscavazione` contro `canonePeriodo`). Quel controllo prende lo stesso
   NOME esportato da due app, non la stessa REGOLA scritta con due nomi.
   Terra tiene quello che è suo — i **metri cubi**: lordo, detratto per recupero,
   imponibile, con la banda d'incertezza. L'euro lo fa Conti.

   ⛔ E SI PAGA LO SCAVO, NON IL CUMULO. È la stessa convenzione con cui in
   tutta Terra il cumulo non consuma il concesso: un cumulo ripreso è materiale
   già estratto (e già pagato) che si sposta.

   ⚠️ IL CASO CHE HA CAMBIATO IL DISEGNO, e va scritto perché il prossimo
   lettore avrà lo stesso istinto sbagliato che ho avuto io. Un anno in cui c'è
   **un rilievo di solo cumulo** sembra un anno *misurato* in cui lo scavo è
   stato zero — e quindi un onere di **zero euro**, vero e dichiarabile.
   Non è così: un rilievo del cumulo misura **il mucchio, non il fronte**. Di
   quanto sia stato tolto dal fronte, quell'anno, non si sa niente. Scrivere
   «€ 0 dovuti» su un documento che va all'ente vorrebbe dire dichiarare in
   difetto una cosa che nessuno ha misurato — la faccia peggiore del principio
   dell'assenza, perché qui il numero tranquillo lo legge un ispettore.
   Quindi: senza nemmeno un rilievo DI SCAVO nell'anno, non si calcola — e il
   motivo dice esplicitamente che «zero misurato» e «non misurato» all'ente non
   sono la stessa cosa, così chi non ha davvero estratto niente lo dichiara
   invece di lasciarlo dedurre. */
/* ⛔ LA DETRAZIONE PER RECUPERO AMBIENTALE — DECISIONE 18, presa dal ciclo il
   07/08. Due domande, due risposte:
     18a → **è un'opzione della concessione**, spenta finché nessuno l'accende.
       Non è prudenza generica: l'errore ha un **costo asimmetrico**. Se la
       concessione non ammette la detrazione e Terra la applica lo stesso, il
       foglio che va all'ente dichiara **meno del dovuto**, e un errore in
       quella direzione un ispettore non lo legge come una svista. L'errore
       opposto — non detrarre dove si potrebbe — fa pagare di più: spiacevole,
       non pericoloso. Quindi il difetto è NON detrarre, e chi sa che la sua
       Regione lo ammette lo dichiara nella scheda del titolo;
     18b → **conta nell'anno in cui il recupero FINISCE**, perché quella è
       l'unica data verificabile. Ripartirlo su due anni vorrebbe dire volumi
       per stato d'avanzamento, che non esistono.
   Il dato sta sul LOTTO (`volumeRecuperoM3`) e non su un'entità «anno» nuova: i
   lotti hanno già `recuperoIniziatoIl`/`recuperoFinitoIl` e l'atto prescrive il
   recupero lotto per lotto. L'anno si ricava dalla data.

   ⚠️ E QUESTA FUNZIONE DICHIARA TRE STATI, non due, perché tre sono le cose
   diverse che può trovare — è il principio del fondatore applicato a un numero
   che va all'ente:
     · **completa**  — ogni lotto finito nell'anno ha il suo volume;
     · **assente**   — un lotto ha finito il recupero e nessuno ha scritto
       quanto materiale ci è andato. La detrazione che esce NON è parziale: è
       **incompleta**, e va detto, se no chi legge la prende per intera;
     · **illeggibile** — il volume c'è ma non è un numero. Non è la stessa cosa
       di «non l'ha scritto nessuno»: uno è lavoro da fare, l'altro è un dato da
       riparare, ed è la distinzione che `run-demo` fa fra il dato CORROTTO e
       quello ASSENTE.
   ⚠️ E il controllo sul vuoto viene PRIMA della conversione: `+null` fa `0` e
   `Number.isFinite(0)` risponde `true`, quindi un lotto senza volume passerebbe
   per «zero misurato». È la trappola di `avanzamentoLotto`, che rispondeva
   «0%» a un lotto che nessuno aveva mai rilevato. */
export function detrazioneRecupero(lotti, anno) {
  const A = String(anno == null ? "" : anno);
  const contati = [], assente = [], illeggibile = [], senzaData = [];
  let m3 = 0;
  for (const l of (lotti || [])) {
    const fine = l && l.recuperoFinitoIl;
    if (fine == null || fine === "") continue;              // il recupero non è finito
    const nome = (l && (l.nome || l.id)) || "(senza nome)";
    if (!dataISOEsiste(String(fine))) { senzaData.push(nome); continue; }
    if (String(fine).slice(0, 4) !== A) continue;
    contati.push(nome);
    const v = l.volumeRecuperoM3;
    if (v == null || v === "") { assente.push(nome); continue; }
    if (!Number.isFinite(+v)) { illeggibile.push(nome); continue; }
    m3 += Math.max(0, +v);
  }
  const completa = !assente.length && !illeggibile.length && !senzaData.length;
  const pezzi = [];
  if (assente.length) pezzi.push(`${conta(assente.length, "lotto ha", "lotti hanno")} finito il recupero nel ${A} senza il volume dichiarato (${assente.join(", ")})`);
  if (illeggibile.length) pezzi.push(`${conta(illeggibile.length, "lotto ha", "lotti hanno")} un volume di recupero che non è un numero (${illeggibile.join(", ")})`);
  if (senzaData.length) pezzi.push(`${conta(senzaData.length, "lotto ha", "lotti hanno")} una data di fine recupero che non esiste (${senzaData.join(", ")}): quel volume non si può attribuire a nessun anno`);
  return {
    m3: r2(m3), completa, lottiContati: contati.length,
    assente, illeggibile, senzaData,
    motivo: completa ? "" :
      pezzi.join("; ") + ". La detrazione che esce è INCOMPLETA, non parziale: il volume detratto è più piccolo del vero.",
  };
}

export function baseOnereEscavazione(riepilogo, opzioni = {}) {
  const R = riepilogo || {}, o = opzioni || {};
  const avvisi = [];
  if (!R.rilieviScavo)
    return { calcolabile: false, imponibile: null, avvisi,
      motivo: `Nessun rilievo di scavo nel ${R.anno}: il volume dell'anno non è stato misurato, quindi la base dell'onere non si può dichiarare. Se in quest'anno non si è estratto nulla va dichiarato a parte — per l'ente «zero misurato» e «non misurato» non sono la stessa cosa.` };

  /* ⛔ E LA DICHIARAZIONE DI INCOMPLETEZZA VIENE PORTATA FIN QUI, se no è una
     bandiera che non legge nessuno — la regola 20, e in questo caso il numero
     tranquillo lo leggerebbe un ispettore. Chi passa `detrazione` passa
     l'oggetto intero di `detrazioneRecupero`, non solo il suo metro cubo. */
  const D = o.detrazione;
  if (D && typeof D === "object") {
    if (D.motivo) avvisi.push(D.motivo);
  }
  const det = D && typeof D === "object" ? D.m3 : o.volumeDetrattoM3;
  const detNumerico = !(det == null || det === "") && Number.isFinite(+det);
  if (!(det == null || det === "") && !detNumerico)
    avvisi.push("Il volume detratto per recupero non è un numero: non è stato tolto dall'imponibile.");
  const detratto = detNumerico ? Math.max(0, +det) : 0;
  const lordo = r2(R.scavo);
  if (detratto > lordo)
    avvisi.push(`Il volume detratto (${detratto} m³) supera lo scavo misurato dell'anno (${lordo} m³): l'imponibile è fermo a zero, ma uno dei due numeri va rivisto.`);
  const imponibile = r2(Math.max(0, lordo - detratto));
  return {
    calcolabile: true, motivo: "",
    lordo, detratto: r2(detratto), imponibile,
    detrazioneIncompleta: !!(D && typeof D === "object" && D.completa === false),
    // la banda d'incertezza del volume: il riepilogo la calcola già, e questo è
    // l'unico foglio in circolazione che la dichiara invece di nasconderla
    banda: r2(R.banda || 0),
    avvisi,
  };
}

/* LA RIGA DELLA BASE COM'È SCRITTA SUL FOGLIO. Sta qui e non nella pagina per
   la stessa ragione di `descriviOrigine`: la frase che va all'ente è una
   REGOLA, non un disegno, e chi la scrive deve essere uno solo.
   ⚠️ E c'è una seconda ragione, imparata subito: `baseOnereEscavazione` dichiara
   `calcolabile`, e una bandiera che non legge nessuno non protegge niente —
   la regola 20 di `run-stile.mjs` ha bocciato la funzione dieci minuti dopo che
   l'avevo scritta, perché il modulo la restituiva e basta. Il lettore giusto è
   questo, dentro il modulo: la pagina di stampa non deve sapere né decidere
   come si racconta una base che non si può dichiarare.
   ⛔ La frase finisce **in metri cubi** e dice dove si fa l'euro: scriverlo qui
   sarebbe la terza copia della regola di `canonePeriodo`. */
export function descriviBaseOnere(base) {
  const o = base || {};
  if (!o.calcolabile) return o.motivo || "Base dell'onere non dichiarabile.";
  const m3 = (n) => Number(n).toLocaleString("it-IT", { maximumFractionDigits: 0, useGrouping: true });
  return `Volume scavato ${m3(o.lordo)} m³`
    + (o.detratto ? `, meno ${m3(o.detratto)} m³ detratti per recupero` : "")
    + `: imponibile ${m3(o.imponibile)} m³.`
    /* ⚠️ e se la detrazione è incompleta lo dice il FOGLIO, non solo lo schermo:
       è il posto dove il numero tranquillo lo legge un ispettore, ed è la
       famiglia di difetti censita il 03/08 in cinque app su cinque — il
       documento che esce più tranquillo di quello che si sa */
    + (o.detrazioneIncompleta ? " ⚠ La detrazione dichiarata è INCOMPLETA (vedi gli avvisi): il volume detratto è più piccolo del vero." : "")
    + (o.banda ? ` Incertezza del volume dichiarata: ± ${m3(o.banda)} m³.` : "")
    + " L'importo dovuto si ottiene applicando l'aliquota della concessione,"
    + " che si imposta in Deepwork Conti.";
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
//
/* ⛔ E IL 07/08 NE È SALTATA FUORI UNA TERZA, PREMENDO IL BOTTONE E APRENDO IL
   FILE — la forma in cui SCHERMO E FILE TACCIONO TUTT'E DUE. Un fronte che
   nell'anno ha solo una ripresa da cumulo (o nessun rilievo di scavo) usciva
   dichiarato **«0 m³ di scavo»** in tutti e tre i posti: il badge dell'elenco,
   il prospetto stampato che va all'ente e il CSV della denuncia. Non è zero:
   è che su quel fronte, quell'anno, non ha volato nessuno.
   Misurato con un rilievo di solo cumulo appeso a «Fronte Sud»:
     schermo  →  «Fronte Sud · 1 rilievo · ripresi da cumuli 4.400 m³ · [0 m³]»
     stampa   →  «Fronte Sud   0   4.400   1»
     CSV      →  «fronte;Fronte Sud;0;4400;1»
   e due centimetri più giù, sullo STESSO foglio, la tabella dei banchi scrive
   già «non misurato» per la stessa identica situazione.
   ⛔ E LA REGOLA C'ERA GIÀ, DUE VOLTE. `riepilogoAnnuale` calcola
   `rilieviScavo` per ogni fronte, e il commento che l'ha introdotto dice
   esattamente perché — «chi legge la voce di un fronte non ha modo di
   distinguere "scavo misurato pari a zero" da "lo scavo non l'ha misurato
   nessuno"». Quel campo **non lo leggeva nessuno**: né la pagina, né la
   stampa, né il CSV. È la guardia scollegata della regola 20, su un campo che
   il vocabolario delle bandiere non conosce e che quindi la regola non vede.
   ⛔ E IL PARAMETRO, INVECE DELLA COPIA. Stampa e CSV non passavano di qui —
   componevano da `R.fronti` grezzo — perché a loro serve anche la voce senza
   fronte fatta di soli cumuli, che l'elenco a schermo esclude di proposito.
   Cioè l'unica differenza era il FILTRO: `tutte: true` la toglie, e da lì in
   poi i tre posti leggono la stessa `misurabile`. Ricopiare qui il corpo con
   un filtro diverso sarebbe stata la copia che nasce da una firma troppo
   stretta (CLAUDE.md), e sarebbe divergente entro il mese.
   ⚠️ Con `tutte: true` NIENTE resta fuori, quindi `cumuliFuori` vale 0: è
   giusto, e per questo il conto si fa sulle righe **escluse** invece che sulla
   forma della riga — un filtro scritto due volte è la stessa copia debole un
   piano più sotto. */
export function ripartizioneFronti(riepilogo, opzioni = {}) {
  const o = opzioni || {};
  const anno = riepilogo && riepilogo.anno != null ? riepilogo.anno : "";
  const fronti = riepilogo && Array.isArray(riepilogo.fronti) ? riepilogo.fronti : [];
  const totale = riepilogo && +riepilogo.scavo > 0 ? +riepilogo.scavo : 0;
  const dentro = (f) => o.tutte === true || !!f.fronteId || +f.scavo > 0;
  const righe = fronti.filter(dentro).map(f => {
    /* la stessa decisione delle righe dei banchi, e per la stessa ragione:
       `scavo > 0` confonderebbe un fronte mai rilevato con uno rilevato a zero */
    const misurabile = +f.rilieviScavo > 0;
    return { ...f,
      senzaFronte: !f.fronteId,
      misurabile,
      /* ⚠️ non è solo la bandiera: lo scavo diventa `null`. Chi disegnasse
         `n0(f.scavo)` dimenticando la bandiera scriverebbe di nuovo «0», e una
         difesa che si può dimenticare non è una difesa. */
      scavo: misurabile ? r2(f.scavo) : null,
      quotaPct: misurabile && totale > 0 && +f.scavo > 0
        ? Math.round(1000 * f.scavo / totale) / 10 : null,
      /* ⚠️ La frase è vicina di casa di quella dei banchi ma NON la stessa, e
         il parametro non basterebbe: là il soggetto sono «i fronti di questo
         banco» nella prima e «questo banco» nella seconda, cioè servirebbero
         tre pezzi di testo per una funzione di due righe. Provato e scartato:
         quello che si condivide davvero è la DECISIONE qui sopra, non le
         parole. */
      motivo: misurabile ? "" : (+f.rilieviCumulo > 0
        ? `Su questo fronte nel ${anno} ci sono solo riprese da cumulo: è materiale già cavato prima, non scavo di questo fronte.`
        : `Nessun rilievo di scavo su questo fronte nel ${anno}: il volume tolto non è stato misurato da nessuno.`),
    };
  });
  return {
    righe,
    // i cumuli che restano FUORI dalla ripartizione, da dire nella nota
    cumuliFuori: fronti.filter(f => !dentro(f)).reduce((a, f) => a + (+f.cumulo || 0), 0),
    // c'è almeno una riga con dei cumuli? Serve alla nota: rimandare a «quanto
    // scritto nella riga» quando nessuna riga lo riporta manda a cercare il nulla
    conCumuliInRiga: righe.some(f => +f.cumulo > 0),
    senzaFronte: righe.filter(f => f.senzaFronte).length,
    // quante righe non hanno una misura dello scavo: serve alla nota, che
    // altrimenti dovrebbe ricontarle fuori (e riscrivere la regola)
    nonMisurate: righe.filter(f => !f.misurabile).length,
  };
}

/* ── LA RIPARTIZIONE PER BANCO ──────────────────────────────────────────────
   «Quanto ho cavato dal banco 3 quest'anno». Fino a qui Terra sapeva
   rispondere per FRONTE (`volumeFronte`, `ripartizioneFronti`) e per LOTTO
   (`volumeMisuratoDiLotto`), mai per banco: `banco` esisteva solo come campo
   della scheda del fronte, scritto e mai letto da nessun conto.

   ⛔ IL DATO C'È GIÀ, E NON SI AGGIUNGE NIENTE AL RILIEVO. La catena esiste per
   intero: un rilievo dichiara il suo `fronteId`, il fronte dichiara il suo
   `banco`. Mettere un secondo campo `banco` sul rilievo sarebbe stata una
   SECONDA scrittura dello stesso fatto, con la garanzia che prima o poi i due
   si contraddicono. Qui si legge la catena che c'è.

   ⚠️ E IL PREZZO DI QUELLA SCELTA VA DICHIARATO, non nascosto: il banco è un
   attributo del fronte OGGI. Se domani qualcuno corregge il banco di un fronte,
   tutti i rilievi passati di quel fronte si spostano di banco insieme a lui —
   la ripartizione racconta l'assetto attuale, non quello del giorno del volo.
   Finché un fronte resta sul suo banco (il caso normale: un fronte è una parete
   su un banco) le due cose coincidono. Il giorno in cui servisse la storia,
   la risposta non è duplicare il campo: è datare il legame fronte→banco.

   ⛔ NON VA IN `shared/`: `banco` è un campo del modello dei fronti, che esiste
   solo in Terra. Cercato: l'unico altro «banco» del monorepo è
   `conti-data.js:1472` e `shared/dw-ponti.js:297`, dove vuol dire tutt'altro —
   il peso di volume «in banco», cioè in posto. Una regola sola per una app sola.

   ⛔ E UN BANCO SENZA RILIEVI NON HA CAVATO ZERO. È la trappola già pagata da
   `avanzamentoLotto`: un banco su cui nessuno ha volato quest'anno prende
   `scavo: null` e `misurabile: false` con la sua ragione, non un badge «0 m³»
   che a chi guarda dice «fermo» invece di «non misurato». Per distinguerli
   serve la conta dei rilievi DI SCAVO (`rilieviScavo`), che `riepilogoAnnuale`
   ha imparato a dare proprio per questo: `scavo > 0` avrebbe confuso un banco
   mai misurato con un banco misurato a zero.

   ⛔ E I TRE SECCHI CHE NON SONO UN BANCO NON SPARISCONO. Se lo facessero, la
   somma delle righe sarebbe più piccola dello scavo dell'anno e nessuno se ne
   accorgerebbe (è la forma di `rilieviFuoriDaiLotti`):
    · `nonDichiarato` — fronti che esistono ma non dichiarano nessun banco. Il
      loro scavo non è «di nessun banco»: è di un banco NON DICHIARATO;
    · `senzaFronte`   — rilievi senza fronte (tipicamente le riprese da cumulo,
      che un fronte non ce l'hanno per definizione);
    · `fuoriElenco`   — rilievi che puntano a un fronte cancellato.

   ⚠️ E LE GRAFIE. Il banco è testo libero nella scheda del fronte, quindi
   «Banco 2» e «banco  2» sono lo stesso banco scritto in due modi: si
   raggruppano (spazi normalizzati, maiuscole ignorate) e le grafie trovate si
   DICHIARANO in `grafieDoppie`, così chi guarda sa perché due fronti sono
   finiti nella stessa riga invece di scoprirlo per caso. */
const chiaveBanco = (s) => String(s == null ? "" : s).trim().replace(/\s+/g, " ");

export function ripartizioneBanchi(riepilogo, fronti) {
  const R = riepilogo || {};
  const anno = R.anno != null ? R.anno : "";
  const elenco = (Array.isArray(fronti) ? fronti : []).filter((f) => f && f.id != null);
  const voci = Array.isArray(R.fronti) ? R.fronti : [];
  const vuota = { righe: [], banchi: 0, misurabile: false,
    nonDichiarato: null, senzaFronte: null, fuoriElenco: null, totale: 0, grafieDoppie: [] };

  if (!elenco.length)
    return { ...vuota, motivo: "Nessun fronte registrato: il banco si legge dalla scheda del fronte, quindi senza fronti il volume per banco non si può ripartire. Non vuol dire che i banchi non abbiano prodotto nulla." };

  const perId = new Map(), banchi = new Map();
  for (const f of elenco) {
    const g = chiaveBanco(f.banco), k = g.toLowerCase();
    perId.set(String(f.id), k);   // "" = fronte che non dichiara un banco
    if (!k) continue;
    if (!banchi.has(k))
      banchi.set(k, { chiave: k, etichetta: g, grafie: [], fronti: [], fronteId: [],
        scavo: 0, cumulo: 0, rilievi: 0, rilieviScavo: 0, rilieviCumulo: 0 });
    const b = banchi.get(k);
    if (!b.grafie.includes(g)) b.grafie.push(g);
    b.fronti.push(String(f.nome || f.id));
    b.fronteId.push(String(f.id));
  }
  if (!banchi.size)
    /* ⚠️ il motivo dice il FATTO, non dove si va a rimediare: il «dove» lo
       scrive la pagina, che sa se i fronti ci sono o no. Scritto in tutt'e due i
       posti, lo stato vuoto ripeteva la stessa frase due volte di fila — visto
       aprendo la pagina, non leggendo il codice. */
    return { ...vuota, motivo: "Nessuno dei fronti registrati dichiara un banco: il volume per banco non si può ripartire." };

  const secchio = () => ({ scavo: 0, cumulo: 0, rilievi: 0, rilieviScavo: 0, rilieviCumulo: 0, fronti: 0 });
  const nonDich = secchio(), senzaFro = secchio(), fuori = secchio();
  const accumula = (t, v) => {
    t.scavo += (+v.scavo || 0); t.cumulo += (+v.cumulo || 0);
    t.rilievi += (+v.rilievi || 0);
    t.rilieviScavo += (+v.rilieviScavo || 0); t.rilieviCumulo += (+v.rilieviCumulo || 0);
  };
  for (const v of voci) {
    const id = v.fronteId == null ? "" : String(v.fronteId);
    if (!id) { accumula(senzaFro, v); senzaFro.fronti++; continue; }
    if (!perId.has(id)) { accumula(fuori, v); fuori.fronti++; continue; }
    const k = perId.get(id);
    if (!k) { accumula(nonDich, v); continue; }
    accumula(banchi.get(k), v);
  }
  // i fronti senza banco si contano TUTTI, anche quelli che quest'anno non hanno
  // rilievi: è il numero che dice quanto lavoro di compilazione manca
  nonDich.fronti = elenco.filter((f) => !perId.get(String(f.id))).length;

  const totale = +R.scavo > 0 ? +R.scavo : 0;
  const righe = [...banchi.values()]
    .sort((a, z) => z.scavo - a.scavo || a.etichetta.localeCompare(z.etichetta, "it"))
    .map((b) => !b.rilieviScavo
      ? { ...b, scavo: null, cumulo: r2(b.cumulo), misurabile: false, quotaPct: null,
          motivo: b.rilieviCumulo
            ? `Sui fronti di questo banco nel ${anno} ci sono solo riprese da cumulo: è materiale già cavato prima, non scavo di questo banco.`
            : `Nessun rilievo di scavo su questo banco nel ${anno}: il volume tolto non è stato misurato da nessuno.` }
      : { ...b, scavo: r2(b.scavo), cumulo: r2(b.cumulo), misurabile: true,
          quotaPct: totale > 0 ? Math.round(1000 * b.scavo / totale) / 10 : null, motivo: "" });

  const qualcuno = righe.some((x) => x.misurabile);
  /* ⛔ ANCHE I TRE SECCHI DICONO SE SONO STATI MISURATI, e fino al 03/08 non lo
     dicevano: la regola («senza nessun rilievo di scavo quello zero non è una
     misura») era scritta sei righe più su per le RIGHE dei banchi, e i secchi
     — che sono banchi anche loro, solo senza nome — restavano con lo `scavo: 0`
     nudo. Nessuno se ne accorgeva a schermo né sul foglio stampato, perché lì
     lo zero è filtrato dalla verità (`nonDichiarato.scavo ? ... : ""`); ma il
     CSV della denuncia lo scriveva secco, `banco;Banco non dichiarato;0;0;0`,
     sei righe sotto un `banco;banco 3;;0;0` che la cella la lascia VUOTA. Due
     convenzioni opposte nello stesso file — la stessa forma del difetto già
     corretta sul totale dell'anno, un piano più sotto.
     La bandiera si mette QUI e non nella pagina perché la regola è una sola e
     chi la scrive deve essere uno solo: chi disegna la legge, non la rifà. */
  const conMisura = (t) => ({ ...t, misurabile: t.rilieviScavo > 0 });
  return {
    righe, banchi: righe.length, misurabile: qualcuno,
    motivo: qualcuno ? ""
      : `Nessun banco ha un rilievo di scavo nel ${anno}: il volume per banco di quest'anno non è stato misurato da nessuno.`,
    nonDichiarato: nonDich.fronti || nonDich.rilievi ? conMisura(nonDich) : null,
    senzaFronte: senzaFro.rilievi ? conMisura(senzaFro) : null,
    fuoriElenco: fuori.rilievi ? conMisura(fuori) : null,
    totale,
    grafieDoppie: righe.filter((x) => x.grafie.length > 1).map((x) => x.grafie),
  };
}

/* ── IL BANCO DA SEMPRE ─────────────────────────────────────────────────────
   `ripartizioneBanchi` è ANNUALE per costruzione: prende l'uscita di
   `riepilogoAnnuale`, e la domanda che serve alla denuncia è «quest'anno».
   Ma «quale gradone si sta consumando» non si ferma al 1° gennaio: un banco lo
   si apre, lo si porta giù per anni e a un certo punto è finito. Questa
   funzione fa la stessa ripartizione su TUTTA la vita misurata della cava.

   ⛔ NON RISCRIVE NIENTE. Un anno alla volta chiama `riepilogoAnnuale` e
   `ripartizioneBanchi` — le stesse due che disegnano la Denuncia — e somma. Le
   regole (chi è un banco, come si normalizzano le grafie, chi finisce nei tre
   secchi, quando un banco è «mai misurato») restano scritte in un posto solo: se
   un giorno cambiano lì, cambiano anche qui, e nessuno deve ricordarsene.

   ⛔ E UN ANNO NON MISURATO NON VALE ZERO — è il principio del fondatore nella
   sua forma più insidiosa, perché qui il numero che rassicura nasce da una
   SOMMA. Se di tre anni due sono misurati e uno no, «da sempre» non è un fatto.
   La domanda «è un tetto o una quantità parziale?» ha una risposta sola, e va
   ragionata invece che scelta: il volume tolto in un anno cieco è ignoto ma
   **non può essere negativo**, quindi la somma dei soli anni misurati è un
   PAVIMENTO — il vero è quello o di più, mai di meno. Quindi `limite: "almeno"`,
   che è la stessa parola con cui `riposoPrimaDelTurno` di Campo dice «questo
   numero è un pavimento» (là il vocabolario è "" · "al-piu" · "almeno").
   Il tetto qui non esiste: nessun anno cieco può togliere metri cubi.

   ⛔ LA FINESTRA È CONTINUA, e questo il prototipo l'ha preso in flagrante.
   `anniConVolumi` restituisce gli anni CHE HANNO un rilievo: con rilievi solo
   nel 2022 e nel 2026 dava «due anni su due, quadro completo», mentre 2023,
   2024 e 2025 non li aveva guardati nessuno. Qui si prende il primo e l'ultimo
   e si scorre l'intervallo intero: un anno senza rilievi è un anno CIECO, e va
   contato come tale invece di sparire dall'elenco.

   ⛔ LA QUOTA % SI CALCOLA SOLO SUI BANCHI SENZA ANNI CIECHI. Per un banco con
   anni ciechi il suo scavo è un pavimento ma il denominatore (lo scavo misurato
   di tutta la cava) contiene anche gli anni in cui ALTRI banchi sono stati
   misurati: il rapporto non è un pavimento né un tetto, non è niente. `null`, e
   la ragione è scritta.

   ⚠️ QUELLO CHE RESTA FUORI SI DICHIARA, non si lascia dedurre — e sono quattro
   cose: i tre secchi di `ripartizioneBanchi` (banco non dichiarato, rilievi
   senza fronte, fronti non più in elenco), sommati sugli anni, più il **già
   estratto prima di Terra**: quel volume è per CAVA, non per banco, e nessuna
   riga può reclamarlo. Se non è nemmeno dichiarato è peggio, perché allora non
   si sa neanche se prima della finestra sia uscito altro materiale. Tutte e
   quattro finiscono in `perche`, e `completo` è vero solo quando quell'elenco
   è vuoto.

   ⚠️ NIENTE NUMERI GROSSI NELLE FRASI DI `perche`. I separatori delle migliaia
   sono una convenzione della PAGINA, e Node e Chromium sotto le cinque cifre non
   la scrivono uguale: il modulo dice il fatto, i metri cubi li scrive chi
   disegna. Gli anni (quattro cifre, mai raggruppate) restano.

   ⚠️ E VALE ANCHE QUI L'AVVERTENZA DI `ripartizioneBanchi`, più forte: il banco
   è un attributo del fronte OGGI. Su una finestra di dieci anni, un fronte che
   cambia banco si porta dietro dieci anni di rilievi. La ripartizione racconta
   l'assetto attuale, non quello del giorno del volo. */
export function banchiDaSempre(rilievi, fronti, autorizzazione, oggi = new Date()) {
  const conVolumi = anniConVolumi(rilievi, oggi);
  const dal = Math.min(...conVolumi), al = Math.max(...conVolumi);
  const anni = [];
  for (let y = dal; y <= al; y++) anni.push(y);
  const finestra = dal + "–" + al;

  const vuota = { righe: [], banchi: 0, misurabile: false, limite: "",
    anni, dal, al, totale: 0, completo: false, perche: [],
    pregresso: 0, pregressoDichiarato: false,
    nonDichiarato: null, senzaFronte: null, fuoriElenco: null, grafieDoppie: [] };

  const perAnno = anni.map((anno) => {
    const R = riepilogoAnnuale(rilievi, anno, autorizzazione, oggi);
    return { anno, R, B: ripartizioneBanchi(R, fronti) };
  });
  // le due condizioni che fermano `ripartizioneBanchi` (niente fronti, nessun
  // fronte che dichiari un banco) dipendono SOLO dai fronti: valgono per tutti
  // gli anni insieme, e il motivo lo ha già scritto lei
  if (!perAnno[0].B.righe.length) return { ...vuota, motivo: perAnno[0].B.motivo };

  const pregressoDichiarato = !!perAnno[0].R.pregressoDichiarato;
  const pregresso = +perAnno[0].R.pregresso || 0;

  const acc = new Map();
  for (const { anno, B } of perAnno) {
    for (const b of B.righe) {
      if (!acc.has(b.chiave))
        acc.set(b.chiave, { chiave: b.chiave, etichetta: b.etichetta, grafie: b.grafie,
          fronti: b.fronti, fronteId: b.fronteId,
          scavo: 0, cumulo: 0, rilieviScavo: 0, rilieviCumulo: 0,
          anniMisurati: [], anniCiechi: [] });
      const a = acc.get(b.chiave);
      a.cumulo += (+b.cumulo || 0);
      a.rilieviCumulo += (+b.rilieviCumulo || 0);
      /* ⛔ si somma SOLO dentro questo ramo. `a.scavo += +b.scavo || 0` scritto
         fuori avrebbe sommato lo zero di un anno cieco (`+null` fa 0) e l'anno
         sarebbe sparito dal conto invece di finire fra i ciechi: è la trappola
         di `avanzamentoLotto`, che rispondeva «0%» a un lotto mai rilevato. */
      if (b.misurabile) {
        a.scavo += (+b.scavo || 0);
        a.rilieviScavo += (+b.rilieviScavo || 0);
        a.anniMisurati.push(anno);
      } else a.anniCiechi.push(anno);
    }
  }

  // i tre secchi, sommati sugli anni. `fronti` di `nonDichiarato` NON si somma:
  // è il conto dei fronti da compilare OGGI, uguale in ogni anno.
  const secchio = (k) => {
    const v = { scavo: 0, cumulo: 0, rilievi: 0, rilieviScavo: 0, rilieviCumulo: 0 };
    let ultimo = null;
    for (const p of perAnno) {
      const s = p.B[k];
      if (!s) continue;
      ultimo = s;
      v.scavo += +s.scavo || 0; v.cumulo += +s.cumulo || 0; v.rilievi += +s.rilievi || 0;
      v.rilieviScavo += +s.rilieviScavo || 0; v.rilieviCumulo += +s.rilieviCumulo || 0;
    }
    if (!ultimo) return null;
    v.scavo = r2(v.scavo); v.cumulo = r2(v.cumulo);
    if (k === "nonDichiarato") v.fronti = ultimo.fronti;
    return v;
  };

  const totale = r2(perAnno.reduce((t, p) => t + (+p.R.scavo || 0), 0));
  const righe = [...acc.values()]
    .map((b) => {
      const cieco = b.anniCiechi.length > 0;
      if (!b.anniMisurati.length)
        return { ...b, scavo: null, cumulo: r2(b.cumulo), misurabile: false, limite: "",
          quotaPct: null,
          motivo: `Nessun rilievo di scavo su questo banco in nessuno degli anni guardati (${finestra}): `
            + (b.rilieviCumulo
              ? "ci sono solo riprese da cumulo, cioè materiale già cavato prima."
              : "il volume tolto non l'ha misurato nessuno.") };
      return { ...b, scavo: r2(b.scavo), cumulo: r2(b.cumulo), misurabile: true,
        limite: cieco ? "almeno" : "",
        quotaPct: !cieco && totale > 0 ? Math.round(1000 * b.scavo / totale) / 10 : null,
        motivo: cieco
          ? `In ${b.anniCiechi.length === 1 ? "un anno" : b.anniCiechi.length + " anni"} su ${anni.length} `
            + `(${b.anniCiechi.join(", ")}) nessuno ha rilevato lo scavo di questo banco. `
            + "Il totale è quello misurato negli altri: il vero è questo o di più, mai di meno."
          : "" };
    })
    .sort((a, z) => Number(z.misurabile) - Number(a.misurabile)
      || (a.misurabile ? z.scavo - a.scavo : 0)
      || a.etichetta.localeCompare(z.etichetta, "it"));

  const nonDich = secchio("nonDichiarato"), senzaFro = secchio("senzaFronte"), fuori = secchio("fuoriElenco");
  const qualcuno = righe.some((x) => x.misurabile);
  const parziale = righe.some((x) => x.limite === "almeno");

  const perche = [];
  if (parziale) perche.push("ci sono anni in cui lo scavo di un banco non l'ha rilevato nessuno");
  if (nonDich && nonDich.scavo > 0) perche.push("una parte dello scavo esce da fronti che non dichiarano il banco");
  if (fuori && fuori.scavo > 0) perche.push("una parte dello scavo è su fronti non più in elenco");
  if (senzaFro && senzaFro.scavo > 0) perche.push("una parte dello scavo non ha nemmeno un fronte indicato");
  if (!pregressoDichiarato) perche.push(`il già estratto prima di Terra non è dichiarato, quindi non si sa se prima del ${dal} sia uscito altro materiale`);
  else if (pregresso > 0) perche.push(`prima del ${dal} risulta del materiale già estratto, che nessun banco può reclamare`);

  return {
    righe, banchi: righe.length, misurabile: qualcuno,
    limite: parziale ? "almeno" : "",
    motivo: qualcuno ? ""
      : `In nessuno degli anni guardati (${finestra}) risulta un rilievo di scavo su un banco: il volume per banco da sempre non l'ha misurato nessuno.`,
    anni, dal, al,
    totale, completo: perche.length === 0, perche,
    pregresso, pregressoDichiarato,
    nonDichiarato: nonDich && (nonDich.rilievi || nonDich.fronti) ? nonDich : null,
    senzaFronte: senzaFro && senzaFro.rilievi ? senzaFro : null,
    fuoriElenco: fuori && fuori.rilievi ? fuori : null,
    grafieDoppie: righe.filter((x) => x.grafie.length > 1).map((x) => x.grafie),
  };
}

// Storico anno per anno: quanto scavato, quanto ripreso dai cumuli e dove
// era arrivato il cumulato del titolo alla fine di ogni anno. È la riga di
// controllo che l'ente ricostruisce sommando le denunce degli anni passati.
export function serieAnnuale(rilievi, autorizzazione, oggi = new Date()) {
  return anniConVolumi(rilievi, oggi).sort((x, z) => x - z).map(anno => {
    const r = riepilogoAnnuale(rilievi, anno, autorizzazione, oggi);
    /* ⛔ `rilieviScavo` esce da qui, e non è un di più: senza, la riga
       dell'anno scriveva «Scavati 0 m³» anche in un anno in cui il fronte non
       l'ha rilevato NESSUNO — quello zero l'ente lo legge come «non ho estratto
       niente». `misurabile` non copre questo caso: parla del TITOLO (pregresso
       + rilievi complessivi), e resta vero mentre il singolo anno è cieco. */
    return { anno, scavo: r.scavo, cumulo: r.cumulo, rilievi: r.rilieviScavo + r.rilieviCumulo,
      rilieviScavo: r.rilieviScavo,
      cumulato: r.cumulatoFineAnno, pct: r.pctFineAnno, misurabile: r.misurabile, inCorso: r.inCorso };
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

// SEMAFORO di una scadenza: scaduta / in-scadenza / senza data / a-posto. Il preavviso è
// quello impostato sulla singola scadenza (giorni): niente soglia fissa.
// ⛔ Fino al 03/08 qui c'era: «senza data valida ritorna a-posto (un dato
// incompleto non deve allarmare)». È la stessa convinzione trovata quel giorno
// in Scudo e in `shared/dw-ponti.js`, e misurata falsa: una data che non si può
// leggere non è una scadenza a posto — è una scadenza di cui non si sa niente,
// e va guardata. Si risponde «senza data», il termine che l'ecosistema usa già.
// docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
export function statoScadenzaTerra(dataISO, preavvisoGiorni, oggi = new Date()) {
  const g = giorniTra(String(dataISO || ""), oggi);
  if (!dataISOEsiste(dataISO)) return "senza data";
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
  if (!Number.isFinite(g)) return { cls: "warn", label: "senza data", giorni: null, stato };
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
  const out = { scadute: 0, inScadenza: 0, senzaData: 0, aPosto: 0, totale: 0 };
  for (const s of scadenze || []) {
    const st = statoScadenzaTerra(s.dataScadenza, s.preavvisoGiorni, oggi);
    out.totale++;
    if (st === "scaduta") out.scadute++;
    else if (st === "in-scadenza") out.inScadenza++;
    // ⛔ le righe con la data illeggibile hanno un contatore LORO: contarle fra
    // le «a posto» era il modo in cui sparivano
    else if (st === "senza data") out.senzaData++;
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
        /* ⛔ UNA QUOTA CHE NON SI LEGGE NON È UNA QUOTA DI ZERO. Fino al 05/08
           qui c'era `Number.isFinite(q) ? q : 0`: una colonna vuota entrava in
           archivio come «0 m s.l.m.», che è una quota vera e per giunta
           bassissima. Finché quel numero serviva solo a scrivere «Quota 0 m»
           in una riga era brutto; da quando c'è il confronto con la quota di
           fondo autorizzata diventa un giudizio inventato — «questo fronte è
           340 m sotto il fondo» su un fronte che nessuno ha misurato. */
        quota: Number.isFinite(q) ? q : null,
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
    // un rilievo con una data impossibile finirebbe nell'anno sbagliato del
    // riepilogo volumi, che è un documento per l'ente (03/08)
    .filter(p => dataISOEsiste(p.data) && Number.isFinite(p.volumeM3) && p.volumeM3 >= 0);
}

/* ⛔ IL FILE DEI RILIEVI CHE SI RI-CARICA — decisione 12a, presa dal ciclo il
   07/08 e costruita qui nella sua prima delle sei voci.
   Il fatto misurato il 31/07: ogni app scarica dei CSV, e questo faceva
   credere — anche a chi scriveva il documento — che ci fosse un backup di
   tutto. **Non è così**: i file che rientrano davvero sono sette, tutti gli
   altri sono **prospetti** con colonne calcolate, che servono al
   commercialista o all'ente e non si ri-caricano. Va benissimo che sia così:
   quello che non va è **crederli un backup**.
   ⚠️ E fra le sei cose rimaste senza un file che rientra, i **rilievi** sono
   la sola che non si può ricostruire da nessuna carta: una pesata ha il suo
   DDT in archivio e un incasso ha l'estratto conto, ma un volo di drone del
   marzo scorso non si rifà — il terreno nel frattempo è cambiato. Per questo
   è la prima.
   ⛔ E il formato è **quello che `parseRilieviCsv` legge**, non uno nuovo: sei
   colonne nello stesso ordine, i numeri col PUNTO (il lettore usa `numIt`, che
   la virgola la legge, quindi una prova di andata e ritorno resterebbe verde
   anche scrivendo la virgola — è la trappola delle due metà che sbagliano
   insieme, e per quello la prova guarda anche il TESTO del file).
   ⚠️ La `provenienza` si scrive **sempre**, anche quando vale «scavo»: è il
   difetto del 03/08 in una veste nuova — una cella vuota in un file che
   rientra si rilegge come «non dichiarata», e qui invece la si sa. */
export function csvRilievi(rilievi) {
  const righe = ["data;volumeM3;metodo;gsd;fronte;provenienza"];
  for (const r of (rilievi || [])) {
    if (!r) continue;
    righe.push([
      csvCell(r.data || ""),
      /* il punto decimale, non la virgola: il file esce dall'azienda e lo
         riapre anche un altro programma.
         ⛔ E `numeroDichiarato`, NON `Number.isFinite(+x)`: qui c'era la copia
         debole della regola che sta in `shared/` da giorni. `+""` fa **0** e
         `Number.isFinite(0)` risponde **true**, quindi un rilievo con il volume
         lasciato in bianco usciva scritto **`0`** — e misurato il 07/08 il
         danno non è nel file, è nel RITORNO: ri-caricandolo `parseRilieviCsv`
         lo accetta, `rilievoUsabile` lo dichiara buono, e quello zero entra nei
         KPI, nel riepilogo annuale e nella denuncia come un volume **misurato**.
         Un'assenza che fa il giro e torna dentro travestita da dato. Ora esce
         una cella vuota, e il lettore la scarta: la riga si perde, e
         `rientroRilievi` lo dice PRIMA di scaricare invece di lasciarlo
         scoprire. */
      (() => { const v = numeroDichiarato(r.volumeM3); return v == null ? "" : String(v); })(),
      csvCell(r.metodo || ""),
      csvCell(r.gsd || ""),
      csvCell(r.fronte || ""),
      csvCell(provenienzaDi(r)),
    ].join(";"));
  }
  return righe.join("\n") + "\n";
}

/* ⛔ «QUANTE DI QUESTE RIGHE TORNERANNO DENTRO?» — e la risposta si DERIVA, non
   si riscrive: ogni riga viene scritta da `csvRilievi` e riletta da
   `parseRilieviCsv`, cioè dalle due funzioni vere. Un conto scritto a mano
   invecchia appena una delle due cambia — è il banco col numero atteso dentro,
   che il 07/08 accusava il core di una cosa che aveva fatto il core.
   Perché serve: il bottone diceva «Scaricati 8 rilievi **nel formato che questa
   pagina sa ri-caricare**», e ri-caricandolo ne rientravano **7**. Misurato
   sulla dimostrazione: il rilievo ancora `pianificato` non ha un volume, quindi
   il lettore lo scarta — giustamente, perché quel volume non c'è. Quello che non
   va è **prometterlo**. Il file resta com'è (un CSV a sei colonne non può
   portare uno stato che non ha una colonna): a cambiare è la frase, che adesso
   dice quante righe rientrano e **quali no, con la ragione**.
   ⚠️ Il costo è un giro di scrittura e lettura per riga: sono decine di righe,
   non migliaia, e si paga una volta sola alla pressione del bottone. */
export function rientroRilievi(rilievi) {
  const l = (rilievi || []).filter(Boolean);
  const persi = [];
  for (const r of l) {
    if (parseRilieviCsv(csvRilievi([r])).length) continue;
    const v = numeroDichiarato(r.volumeM3);
    persi.push({
      nome: r.titolo || r.id || "(senza titolo)",
      ragione: !dataISOEsiste(String(r.data || "")) ? "la data non esiste"
        : v == null ? "il volume non è stato misurato"
        : v < 0 ? "il volume è negativo"
        : "il lettore la scarta",
    });
  }
  return { scritti: l.length, rientrano: l.length - persi.length, persi };
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
  // ⛔ E la stessa trappola vale UNA RIGA PIÙ SU di `avanzamento`, dove era
  // rimasta: in Terra il rilievo È la misura dell'estratto, quindi un mese
  // senza nessun rilievo di scavo non è un mese in cui non si è cavato — è un
  // mese che nessuno ha misurato. Lo `0` della tessera si legge «fermi», e in
  // una cava che lavora è la lettura più rassicurante e più falsa. Trovato
  // guardando lo scatto, non il codice: la tessera diceva «0» mentre quella
  // accanto diceva «rilievi drone mese 0», cioè dichiarava da sé di non sapere.
  // Un rilievo che ha misurato ZERO resta uno zero vero, e si scrive.
  const scavoMese = soloScavo(mese), cumuloMese = soloCumulo(mese);
  const volumiMese = scavoMese.length ? scavoMese.reduce((s, r) => s + r.volumeM3, 0) : null;
  const volumiMeseCumulo = cumuloMese.reduce((s, r) => s + r.volumeM3, 0);
  const scavoAnno = soloScavo(elaborati).filter(r => (r.data || "").slice(0, 4) === anno);
  const estrattoAnno = scavoAnno.reduce((s, r) => s + r.volumeM3, 0);
  const ref = piano.find(p => p.pianificatoAnnuoM3 > 0);
  // ⛔ Il COLORE di questo KPI era già stato difeso (proiezioneAnnua non dice
  // più «ok» sul nulla); il NUMERO no, e restava «0%». Uno 0% si legge «non
  // ancora cominciato» dove la verità è «nessuno ha misurato» — la stessa
  // trappola di `avanzamentoLotto`. Senza nessun rilievo di scavo dell'anno la
  // risposta è null, cioè il trattino. Un rilievo che ha misurato ZERO invece
  // è una misura, e allora 0% è vero e si scrive.
  const avanzamento = ref && scavoAnno.length ? Math.round(100 * estrattoAnno / ref.pianificatoAnnuoM3) : null;
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
      const { getDocs, addDoc, updateDoc, deleteDoc, doc, deleteField } =
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
        lotti: () => read("lotti"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), traduciCancellazioni(data, deleteField)),
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
      lotti: async () => mem.lotti,
      // in dimostrazione i rapportini non arrivano da Campo: sono finti, ma
      // coerenti coi rilievi d'esempio (vedi DEMO.rapportiniCampo)
      rapportiniCampo: async () => mem.rapportiniCampo || [],
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) applicaPercorsi(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}

// ============================================================
// LA PROVENIENZA DEL VOLUME (tracciabilità del rilievo)
// ------------------------------------------------------------
// Il verbale di rilievo ha una sezione intitolata «Come è stato ottenuto il
// numero». Per un volume arrivato dal visore non poteva dire niente di vero,
// perché di quel calcolo Terra non conservava NESSUN parametro — e non è che
// non esistessero: `volumeCumulo` restituisce cinque valori e il visore ne
// salvava uno, buttando `zBase`, `cella`, `areaCelle` e `celle` una riga dopo.
//
// ⛔ E non sono dettagli da tecnici. Misurato su un cono di volume noto: il
// LATO CELLA sposta il volume del 22% fra 0,25 m e 2 m — e non lo sceglie
// l'utente, lo sceglie il software dalla dimensione del ritaglio. La QUOTA DI
// BASE è una moltiplicazione: 1 m di errore = area coperta × 1 m³, cioè 729 m³
// sul caso misurato. Una misura che non si può rifare non si può difendere.
//
// `origine` assente NON vale «inserita a mano»: vale «non lo sappiamo», ed è
// per questo che è un oggetto solo invece di otto campi sparsi — i rilievi
// scritti prima ricadono lì senza che nessuno inventi per loro un lato cella.
// Ricerca e decisioni: docs/RICERCA_TRACCIABILITA_VOLUME_202608.md
// ============================================================
/* ⛔ «QUESTO PARAMETRO È STATO REGISTRATO?» — e `Number.isFinite(+v)` DA SOLO
   risponde di sì quando non c'è niente. `+null` fa **0**, `+""` e `+"  "` pure,
   `+[]` pure, `+true` fa **1**: tutti finiti, tutti «registrati». È la stessa
   trappola già scritta in `rilievoUsabile` venti righe più su, e qui mordeva
   nel posto peggiore — il verbale che va all'ente. Misurato il 02/08: un
   rilievo con `quotaBase: null` (il visore la scrive così quando la nuvola non
   è georeferenziata, `nuvola-poc.html` riga ~325) faceva stampare «**quota di
   base 0,00 m**» E spariva dall'elenco di ciò che non risulta registrato: due
   bugie che si coprono a vicenda.
   Le guardie vanno in quest'ordine e con il `typeof` davanti: senza, `[5]`
   varrebbe 5 e `true` varrebbe 1 (provato in scratchpad prima di scriverla —
   sono i due casi che il predicato ingenuo lasciava passare).
   ⚠️ E NON si scrive `> 0`: una quota di base può essere **0** (piano a quota
   zero) o **negativa** (sotto il livello del mare), e i lati del ritaglio pure.
   Il `> 0` accanto a `cella`, `areaCoperta` e `puntiRitaglio` resta perché lì
   uno zero non è una misura possibile: un lato cella di 0 m non esiste.

   ⛔ ED È `export` DAL 07/08, PERCHÉ LA DIFESA STAVA SOLO DALLA PARTE DI CHI
   LEGGE E IL DANNO SI FA DALLA PARTE DI CHI SCRIVE. Il 02/08 questa guardia ha
   tolto «quota di base 0,00 m» dal verbale — ma la pagina, dove il rilievo dal
   visore viene MESSO IN ARCHIVIO, teneva la versione debole:
     `quotaBase: Number.isFinite(+c.quotaBase) ? +c.quotaBase : null`
   e `+null` fa **0**, che è finito. Quindi il `null` del visore («la nuvola non
   è georeferenziata, la quota di base non c'è») entrava in archivio come uno
   **zero vero**, e da lì in poi nessuna guardia poteva più distinguerlo: una
   quota di base 0 è legittima (piano a quota zero), ed è scritto tre righe più
   su. Misurato in scratchpad sul carico del visore con `quotaBase: null` — il
   verbale stampava «quota di base 0,00 m» e listava fra i mancanti il solo
   «ritaglio», cioè le stesse due bugie che si coprono a vicenda, tornate dal
   lato opposto della catena.
   ⚠️ La lezione, e vale per ogni guardia sui dati: **si guarda anche chi
   SCRIVE**. Una regola che vive nel modulo e non è raggiungibile dalla pagina
   viene riscritta più debole nel punto in cui il dato nasce, e lì il danno è
   irreversibile — mentre alla lettura si vedrebbe ancora. */
export const numeroRegistrato = (v) => (typeof v === "number" || typeof v === "string")
  && String(v).trim() !== "" && Number.isFinite(+v);
/* l'alias interno: le undici chiamate qui sotto restano com'erano — un alias
   non è una seconda implementazione, e rinominarle avrebbe fatto rumore in un
   diff che deve restare leggibile */
const _numRegistrato = numeroRegistrato;
const _n0org = (v) => Number(v).toLocaleString("it-IT", { maximumFractionDigits: 0, useGrouping: true });
const _n2org = (v) => Number(v).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
/* ── DA DOVE VIENE IL VOLUME ────────────────────────────────────────────────
   `origine` assente non vale «inserito a mano»: vale **non lo sappiamo**, ed è
   la stessa forma dichiarata di `provenienzaDi` (assente = scavo) — ma con la
   differenza che qui il ripiego NON è un valore, è l'ammissione. I rilievi
   scritti prima di questa unità ci ricadono senza che nessuno inventi per loro
   un lato cella o una quota di base. */
export function origineDi(rilievo) {
  const o = rilievo && rilievo.origine;
  if (!o || typeof o !== "object") return { da: "non registrata", noto: false };
  const da = String(o.da || "").trim().toLowerCase();
  if (da !== "visore" && da !== "manuale" && da !== "csv") return { ...o, da: "non registrata", noto: false };
  return { ...o, da, noto: true };
}

/* ── LA FRASE DEL VERBALE ───────────────────────────────────────────────────
   ⛔ Il primo requisito NON è l'eleganza: è che senza provenienza la frase
   **non sembri una misura**. Il verbale va a un ente: una riga che tace è una
   riga che lascia credere che il numero sia verificabile. */
export function descriviOrigine(rilievo) {
  const o = origineDi(rilievo);
  if (!o.noto)
    return "La provenienza del calcolo non è registrata: per questo rilievo non "
      + "risultano il metodo di volumetria, il lato della griglia né la quota di "
      + "base, quindi il numero non è riproducibile a partire da questi dati.";
  if (o.da === "manuale")
    return "Volume inserito a mano da chi ha eseguito il rilievo: non deriva da un "
      + "calcolo di questa applicazione.";
  if (o.da === "csv")
    return "Volume importato da un file esterno" + (o.file ? " (" + o.file + ")" : "")
      + ": il calcolo è stato fatto fuori da questa applicazione.";

  /* dal visore: si dice tutto quello che si ha, e si tace solo su ciò che
     manca — dichiarandolo, non saltandolo */
  const p = [];
  p.push("Volume calcolato dal visore con il metodo a griglia: la nuvola viene "
    + "divisa in celle quadrate e di ogni cella si prende la quota più alta; il "
    + "volume è la somma delle altezze sopra un piano di base.");
  const d = [];
  if (_numRegistrato(o.cella) && +o.cella > 0) d.push("lato cella " + _n2org(+o.cella) + " m");
  if (_numRegistrato(o.quotaBase)) d.push("quota di base " + _n2org(+o.quotaBase) + " m (2° percentile delle quote, non il minimo assoluto, per non farsi abbassare da un punto spurio)");
  if (_numRegistrato(o.areaCoperta) && +o.areaCoperta > 0) d.push("area coperta " + _n0org(+o.areaCoperta) + " m²");
  if (_numRegistrato(o.puntiRitaglio) && +o.puntiRitaglio > 0)
    d.push("punti del ritaglio " + _n0org(+o.puntiRitaglio)
      + (_numRegistrato(o.puntiTotali) && +o.puntiTotali > 0 ? " su " + _n0org(+o.puntiTotali) : ""));
  if (d.length) p.push("Parametri del calcolo: " + d.join("; ") + ".");
  /* ⛔ IL RITAGLIO SI SCRIVE SOLO SE I SEI LATI CI SONO TUTTI. Il visore li
     riporta in coordinate reali sommando l'offset, e quando l'offset non c'è
     scrive `null` su tutti e sei: con `Number.isFinite(+null)` il verbale
     stampava «Ritaglio: X da 0,00 a 0,00, Y da 0,00 a 0,00, Z da 0,00 a 0,00»,
     cioè una scatola di volume zero — un rettangolo **plausibile e falso**,
     esattamente il difetto che il salvataggio dei parametri esiste per
     impedire (`nuvola-poc.html`, riga ~315). */
  const r = o.ritaglio;
  const ritaglioLeggibile = !!r && typeof r === "object"
    && ["x0", "x1", "y0", "y1", "z0", "z1"].every((k) => _numRegistrato(r[k]));
  if (ritaglioLeggibile)
    p.push("Ritaglio: X da " + _n2org(+r.x0) + " a " + _n2org(+r.x1) + ", Y da " + _n2org(+r.y0)
      + " a " + _n2org(+r.y1) + ", Z da " + _n2org(+r.z0) + " a " + _n2org(+r.z1) + ".");
  if (o.file) p.push("File di partenza: " + o.file + (o.quandoVisore ? ", caricato il " + String(o.quandoVisore).slice(0, 10).split("-").reverse().join("/") : "") + ".");
  if (o.georeferenziato === false)
    p.push("⚠️ La nuvola NON è georeferenziata: il volume è espresso nelle unità del file, non in metri cubi.");
  /* ⛔ e quello che manca si DICHIARA: un elenco di parametri con dentro solo
     quelli che c'erano sembra completo a chi legge */
  const mancanti = [];
  if (!(_numRegistrato(o.cella) && +o.cella > 0)) mancanti.push("il lato della cella");
  if (!_numRegistrato(o.quotaBase)) mancanti.push("la quota di base");
  /* un ritaglio che c'è ma i cui lati non si leggono NON è «il ritaglio non
     risulta registrato»: è registrato e inservibile, e chi legge il verbale ha
     diritto di sapere quale delle due */
  if (!r) mancanti.push("il ritaglio");
  else if (!ritaglioLeggibile) mancanti.push("i limiti del ritaglio, registrati ma non leggibili");
  /* ⚠️ i due punti al posto di «né»: l'elenco cambia genere e numero a seconda
     di che cosa manca («registrato la quota di base» era sgrammaticato), e
     questa frase finisce su un foglio che va a un ente */
  if (mancanti.length)
    p.push("Di questo calcolo non risulta registrato quanto segue: " + mancanti.join("; ")
      + ". Per questa parte il calcolo non è riproducibile.");
  return p.join(" ");
}

// ============================================================
// DA DOVE VIENE LA DENSITÀ (la provenienza del fattore di conversione)
// ------------------------------------------------------------
// La densità è la sola cosa che fa parlare due grandezze che in cava si
// misurano separatamente: i turni dichiarano TONNELLATE, il drone misura METRI
// CUBI. Da lei passano due numeri che escono dall'azienda — il confronto fra
// dichiarato e misurato, e il valore del materiale — e finché è solo un numero
// in un campo, un valore tipico preso da un manuale e un certificato di
// laboratorio sul materiale di QUESTA cava si presentano identici.
//
// ⛔ NON HANNO LO STESSO PESO DAVANTI A CHI CHIEDE. Sono quattro cose diverse:
//   · `atto`        — il numero prescritto dall'atto o dal disciplinare. Non è
//                     una misura del materiale: è la regola con cui l'ente
//                     stesso vuole che si converta. Non si discute.
//   · `laboratorio` — una prova sul materiale di questa cava, con la sua data e
//                     il suo certificato. È la più forte tecnicamente: è
//                     l'unica delle quattro che MISURA questo materiale.
//   · `preset`      — il valore tipico del litotipo (`DENSITA_PRESET` di
//                     `shared/`). Utile per non partire da zero, ma è
//                     letteratura: non è stato misurato niente qui.
//   · `manuale`     — l'ha scritta una persona. Sappiamo CHI, non DA DOVE.
//
// ⛔ E LA QUINTA NON È UN RIPIEGO SULLE ALTRE. Una densità di cui non risulta la
// provenienza NON è «preset» e NON è «a mano»: è NON DICHIARATA, e chi legge il
// numero deve saperlo. È la stessa forma di `origineDi` qui sopra e di
// `provenienzaMisura` di Sentinella — l'assenza si dice, non si riempie.
//
// ⚠️ DOV'È LA DIFFERENZA CON LE ALTRE DUE PROVENIENZE DELL'ECOSISTEMA, che
// esistono già e non sono questa. `origineDi` (poche righe più su) descrive
// **come è stato calcolato** un volume: metodo, lato cella, quota di base.
// `provenienzaMisura` di Sentinella descrive **per che strada è entrato** un
// numero già misurato da uno strumento. Qui non si descrive né un calcolo né
// una strada: si dice **chi risponde** di un fattore di conversione che non è
// stato misurato in cava e che moltiplica tutto quello che ci passa dentro.
// Nessuna delle tre risponderebbe alla domanda delle altre, e per questo i nomi
// sono diversi: `nomi-doppi.mjs` non deve confonderle.
//
// ⚠️ È SEMPRE IL PESO DI VOLUME **IN BANCO**, non quello del materiale sciolto
// in mucchio né quello del prodotto finito a listino (che è la densità di
// Conti, un'altra cosa): il rilievo misura il vuoto lasciato dallo scavo.
//
// ⛔ E DA DOVE VIENE IL NUMERO NON LO DECIDE PIÙ TERRA DA SOLA (01/08). Il
// vocabolario, `densitaDichiarata` e `densitaDellaCava` sono TRASLOCATI in
// `shared/dw-ponti.js`, perché `apps/campo/index.html` legge la stessa
// autorizzazione e costruisce la stessa `riconciliazioneTurni`: finché Campo
// chiamava `densitaDelMateriale(vig.materiale)` (solo il preset), la stessa
// cava con una densità di laboratorio 1,95 nell'atto si riconciliava a 1,95 in
// Terra e a 1,90 in Campo. Misurato, non temuto.
// Qui restano — e ci restano di proposito — le due funzioni che rispondono a
// domande che pone solo Terra: `densitaPerEnte` («questo numero regge davanti a
// un ispettore?», che serve al report per l'ente) e `descriviDensita` («che riga
// scrivo sotto il campo?»). Campo non le chiama, e `shared/` non è un cassetto.
// I nomi qui sotto sono RI-ESPORTATI: le pagine importano da dove hanno sempre
// importato, e `run-kpi.mjs` pretende l'IDENTITÀ (`terra.X === ponti.X`), non
// il comportamento — due copie uguali oggi divergono domani.
// ============================================================

/* Il vocabolario chiuso e le due funzioni che lo usano vivono in `shared/`.
   ⚠️ SERVONO ANCHE QUI DENTRO, a `densitaPerEnte` e `descriviDensita`: un
   `export … from` ri-esporta SENZA creare un nome locale, quindi l'import
   accanto non è un doppione, è l'unico modo di usarli in questo file. È lo
   stesso inciampo già pestato qui sopra con `densitaDelMateriale`. */
export { DENS_ATTO, DENS_LABORATORIO, DENS_PRESET, DENS_MANO, DENS_NON_DICHIARATA,
         FONTI_DENSITA, densitaDichiarata, densitaDellaCava } from "../../shared/dw-ponti.js";
import { DENS_ATTO, DENS_LABORATORIO, DENS_PRESET, DENS_NON_DICHIARATA,
         FONTI_DENSITA, densitaDichiarata } from "../../shared/dw-ponti.js";

/* SI REGGE DAVANTI A CHI LA CHIEDE? Non è «è giusta»: è «esiste un documento
   che qualcuno può farsi mostrare». Un valore tipico può essere azzeccatissimo
   e non reggere lo stesso, perché non è stato misurato niente qui.
   ⛔ Una prova di laboratorio dichiarata SENZA data e senza riferimento non
   regge: l'assenza di un dato non è un dato favorevole, e qui la dichiarazione
   da sola varrebbe come il certificato. */
export function densitaPerEnte(d) {
  const o = densitaDichiarata(d);
  if (!o.leggibile) return { perEnte: false, perche: `il valore registrato («${o.grezza}») non si legge come numero.` };
  if (o.densita == null && o.grezza !== "") return { perEnte: false, perche: `«${o.grezza}» non è una densità possibile.` };
  if (o.densita == null) return { perEnte: false, perche: "non c'è nessun numero da dichiarare." };
  if (!o.noto) return { perEnte: false, perche: "non risulta da dove venga il numero." };
  if (o.da === DENS_ATTO) return { perEnte: true, perche: "è il numero prescritto dall'atto." };
  if (o.da === DENS_LABORATORIO) {
    const scritta = o.quando !== "";
    /* `dataISOEsiste` e non `Date.parse`: il 30 febbraio non è NaN, JavaScript
       lo fa scivolare al 2 marzo — una prova datata due giorni dopo. */
    const buona = dataISOEsiste(o.quando.slice(0, 10));
    if (scritta && !buona)
      return { perEnte: false, perche: `la data della prova di laboratorio («${o.quando}») non è un giorno che esiste.` };
    if (!scritta && !o.riferimento)
      return { perEnte: false, perche: "la prova di laboratorio è dichiarata ma non risultano né la sua data né il riferimento del certificato: non c'è niente da esibire." };
    if (!scritta)
      return { perEnte: false, perche: "della prova di laboratorio risulta il riferimento ma non la data: non si sa a quando risalga." };
    return { perEnte: true, perche: "c'è una prova di laboratorio con la sua data." };
  }
  if (o.da === DENS_PRESET) return { perEnte: false, perche: "è un valore tipico del litotipo, non una misura di questo materiale." };
  return { perEnte: false, perche: "è stata scritta a mano: non risulta il documento da cui viene." };
}

/* LA RIGA CHE VA SOTTO IL NUMERO. Sta qui e non nella pagina per la stessa
   ragione di `descriviOrigine` e `descriviBaseOnere`: la frase che accompagna
   un numero destinato a uscire è una REGOLA, e chi la scrive dev'essere uno.
   ⛔ Primo requisito: quando la provenienza non c'è, la frase NON deve
   somigliare a una tracciatura. Chi legge tende a fidarsi di una riga che
   sembra completa. */
export function descriviDensita(d) {
  const o = densitaDichiarata(d), e = densitaPerEnte(d);
  const CODA = " Finché resta così, le tonnellate dichiarate dai turni e i metri cubi misurati"
    + " dai rilievi restano due grandezze diverse, e il valore del materiale non si calcola.";
  if (!o.leggibile)
    return `Densità registrata come testo: al posto del numero risulta «${o.grezza}».` + CODA;
  if (o.densita == null && o.grezza !== "")
    return `Densità registrata «${o.grezza}»: un metro cubo di materiale non può pesare zero o meno,`
      + " quindi questo valore non è utilizzabile." + CODA;
  if (o.densita == null)
    return "Densità non impostata"
      + (o.noto ? `: risulta dichiarata la provenienza (${FONTI_DENSITA[o.da].label.toLowerCase()}) ma non il numero.` : ".")
      + CODA;
  const q = `Densità usata ${_nDens(o.densita)} t/m³ (peso di volume in banco)`;
  if (!o.noto)
    return q + ": la provenienza non è dichiarata — non risulta se venga dall'atto, da una prova di"
      + " laboratorio o da una stima, quindi il numero non è riconducibile a nessun documento.";
  if (o.da === DENS_ATTO)
    return q + ", valore prescritto dall'atto autorizzativo" + (o.riferimento ? ` (${o.riferimento})` : "") + ".";
  if (o.da === DENS_LABORATORIO)
    return q + ", da prova di laboratorio"
      + (o.riferimento ? ` (${o.riferimento})` : "")
      + (dataISOEsiste(o.quando.slice(0, 10)) ? ` del ${_dmyDens(o.quando)}` : "")
      + "." + (e.perEnte ? "" : " ⚠️ " + _maiuDens(e.perche));
  if (o.da === DENS_PRESET)
    return q + `, valore tipico ${o.etichetta ? `di «${o.etichetta}»` : "del litotipo"}`
      + (o.fonte ? ` (fonte: ${o.fonte})` : "")
      + ": non è una misura di questo materiale e va confermata con una prova di laboratorio"
      + " prima di appoggiarci un numero che va a un ente o a un cliente.";
  return q + ", inserita a mano: non risulta il documento da cui viene.";
}
/* `useGrouping` scritto anche dove è `false`: una densità non arriva mai a
   quattro cifre, ma la regola 16 lo pretende scritto perché Node e Chromium
   raggruppano diversamente e una funzione che tace risponde in due modi. */
const _nDens = (v) => Number(v).toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 3, useGrouping: false });
const _dmyDens = (iso) => String(iso || "").slice(0, 10).split("-").reverse().join("/");
const _maiuDens = (s) => s ? s[0].toUpperCase() + s.slice(1) : "";

// ============================================================
// IL PIANO DI COLTIVAZIONE A LOTTI, E IL DIVARIO DI RECUPERO
// ------------------------------------------------------------
// Il punto di partenza è una frase che l'app scrive GIÀ: nelle prescrizioni
// dell'atto, mostrate nella scheda dell'autorizzazione, c'è «recupero
// ambientale contestuale alla coltivazione, lotto per lotto». Terra enunciava
// l'obbligo e non aveva nessun modo di mostrare che venisse rispettato — la
// parola «lotto» compariva una volta sola in tutto il modulo, dentro quella
// stessa stringa d'esempio.
//
// Il recupero contestuale non è una buona pratica: è la condizione con cui
// l'autorizzazione è stata data, e quasi sempre è assistita da una garanzia
// finanziaria che si svincola per stralci, lotto per lotto.
// Piano per esteso: docs/PIANO_LOTTI_TERRA.md
//
// SEI STATI, non due, e ognuno serve. Fra «esaurito» e «recuperato» c'è tutta
// la distanza che l'ente misura; e `collaudato` NON è `recuperato` — il primo
// lo dice l'ente, il secondo l'azienda. Confonderli mostrerebbe come chiusa
// una pratica che nessuno ha verificato.
const LOTTI_APERTI = ["aperto", "esaurito", "in-recupero"];   // scavato, non ancora chiuso
const LOTTI_CHIUSI = ["recuperato", "collaudato"];
export const STATI_LOTTO = ["previsto", ...LOTTI_APERTI, ...LOTTI_CHIUSI];
// Terra non ha un arrotondatore di modulo (usa `Math.round` dove serve): qui
// ne serve uno solo, e resta locale a questo blocco.
const r2 = (n) => Math.round((+n || 0) * 100) / 100;

export function statoLotto(lotto) {
  const s = String((lotto || {}).stato || "");
  return STATI_LOTTO.includes(s) ? s : "previsto";
}

/* ⛔ IL NUMERO CHE UN ENTE GUARDA PER PRIMO, E LA TRAPPOLA CHE PORTA CON SÉ.
   Una cava che non ha registrato nessun lotto NON ha divario zero: ha divario
   NON MISURATO. Uno «0 m² in ritardo» in verde su un'app che non sa niente dei
   lotti è il numero tranquillo dove non è stato misurato niente — e stavolta
   finisce davanti a chi fa vigilanza.
   E «tutti recuperati» va tenuto distinto per costruzione: quello è un ottimo
   risultato, e se desse lo stesso zero la cava più diligente e quella che non
   ha mai registrato niente si leggerebbero uguali. */
export function divarioRecupero(lotti) {
  const l = (lotti || []).filter((x) => x && STATI_LOTTO.includes(String(x.stato || "")));
  if (!l.length)
    return { misurabile: false, mq: null, m3: null, aperti: 0, recuperati: 0,
      apertiMq: 0, chiusiMq: 0, senzaMq: 0, senzaM3: 0,
      motivo: "Nessun lotto registrato: il divario fra quello che è stato aperto e quello che è stato recuperato non è stato misurato. Non vuol dire che è a posto." };
  const somma = (dove, campo) => r2(l.filter((x) => dove.includes(statoLotto(x)))
    .reduce((t, x) => t + (+x[campo] || 0), 0));
  const apertiMq = somma(LOTTI_APERTI, "superficieMq"), chiusiMq = somma(LOTTI_CHIUSI, "superficieMq");
  /* ⛔ E i lotti SENZA superficie dichiarata non spariscono nel conto: un
     divario calcolato su tre lotti quando ce ne sono sei è più piccolo del
     vero, cioè di nuovo la buona notizia. */
  const senzaMq = l.filter((x) => !(+x.superficieMq > 0)
    && [...LOTTI_APERTI, ...LOTTI_CHIUSI].includes(statoLotto(x))).length;
  /* ⛔ E LA RAGIONE SCRITTA QUI SOPRA VALEVA ANCHE PER I METRI CUBI, che sono
     la riga accanto: `somma` usa `(+x[campo] || 0)`, quindi un lotto che NON
     dichiara il volume vale 0 m³ e il divario scende senza dirlo. Misurato il
     07/08 su tre lotti di cui uno senza volume: **30.000 invece di 70.000**,
     con la bandiera dei m² che diceva tranquillamente «tutto dichiarato».
     ⛔ E aprendo la pagina col volume di `lo5` tolto non è nemmeno «più
     piccolo»: il Piano scriveva **-43.000 m³** dove il vero è **+97.000**,
     cioè il divario CAMBIA SEGNO e si legge «il recupero è avanti in volume».
     E non è un caso di laboratorio: il form scrive `volumeM3: m3.ok ?
     m3.valore : null` — un lotto senza volume è uno stato PREVISTO, tant'è che
     `avanzamentoLotto` ha la frase apposta («Il progetto non dichiara un
     volume per questo lotto»). Nella dimostrazione non si vede perché tutti e
     sei i lotti il volume ce l'hanno. */
  const senzaM3 = l.filter((x) => !(+x.volumeM3 > 0)
    && [...LOTTI_APERTI, ...LOTTI_CHIUSI].includes(statoLotto(x))).length;
  return { misurabile: true, mq: r2(apertiMq - chiusiMq),
    m3: r2(somma(LOTTI_APERTI, "volumeM3") - somma(LOTTI_CHIUSI, "volumeM3")),
    apertiMq, chiusiMq, senzaMq, senzaM3,
    aperti: l.filter((x) => LOTTI_APERTI.includes(statoLotto(x))).length,
    recuperati: l.filter((x) => LOTTI_CHIUSI.includes(statoLotto(x))).length,
    motivo: "" };
}

/* ⛔ E L'AVANZAMENTO NON STIMA. Un lotto senza volume previsto dal progetto non
   ha una percentuale: ha un volume MISURATO, che è già un dato e più
   affidabile della percentuale che ne uscirebbe.
   ⚠️ E la guardia va PRIMA della conversione: `+null` fa zero e
   `Number.isFinite(0)` risponde true, quindi un lotto a cui non è collegato
   nessun rilievo rispondeva «0%» — che suggerisce «non ancora cominciato»
   dove la verità è «nessuno ha misurato». Trovato in banco, non leggendo. */
export function avanzamentoLotto(lotto, misuratoM3) {
  const prev = +((lotto || {}).volumeM3);
  const assente = misuratoM3 == null || misuratoM3 === "";
  const mis = +misuratoM3;
  if (assente || !Number.isFinite(mis))
    return { misuratoM3: null, pct: null,
      motivo: "Nessun rilievo collegato ai fronti di questo lotto: il volume tolto non è stato misurato." };
  if (!(Number.isFinite(prev) && prev > 0))
    return { misuratoM3: r2(mis), pct: null,
      motivo: "Il progetto non dichiara un volume per questo lotto: c'è il misurato, non una percentuale." };
  return { misuratoM3: r2(mis), pct: r2(100 * mis / prev), motivo: "" };
}

/* ⛔ IL PONTE FRA I LOTTI E I RILIEVI, cioè quello che permette di dire
   «previsti 180.000 m³, MISURATI 96.400» invece di fidarsi del progetto.
   Un rilievo sta su un fronte (`fronteId`), il fronte sta in un lotto
   (`frontiId`): da lì il volume tolto da quel lotto è misurato, non dichiarato.

   Tre cose che NON si fanno, e sono le stesse del ponte col volume:
   · le riprese da CUMULO restano fuori — è materiale già cavato prima, e
     contarlo qui vorrebbe dire attribuire due volte lo stesso scavo (la
     regola vive in `shared/`, si chiama `provenienzaDi`, non si riscrive);
   · un lotto che non dichiara nessun fronte NON ha volume zero: non ha un
     volume misurabile, e va detto — se no un lotto appena creato risulterebbe
     «non ancora cominciato» esattamente come uno scavato e mai rilevato;
   · i rilievi ELABORATI e con un volume vero sono gli unici che contano: un
     rilievo pianificato non è un volume. */
export function volumeMisuratoDiLotto(lotto, rilievi) {
  const fronti = ((lotto || {}).frontiId || []).map((x) => String(x || "")).filter(Boolean);
  if (!fronti.length)
    return { m3: null, misurabile: false, rilievi: 0, cumuloM3: 0, rilieviCumulo: 0,
      motivo: "Questo lotto non dichiara nessun fronte: senza il collegamento ai fronti non si sa quali rilievi lo riguardano, e il volume tolto non si può misurare." };
  /* ⚠️ Qui c'era la QUINTA copia scritta a mano di «rilievo usabile»
     (`r.stato === "elaborato" && Number.isFinite(+r.volumeM3)`), e per giunta
     con la guardia su `null` mancante — `+null` fa 0 e `Number.isFinite(0)` è
     `true`. Le altre quattro erano già state riportate a `rilievoUsabile` il
     01/08; questa era rimasta, dichiarata invece che corretta. Adesso chiama la
     funzione: la condizione giusta l'ha imparata lei, non ognuno per conto suo. */
  const suoi = (rilievi || []).filter((r) => r && fronti.includes(String(r.fronteId || ""))
    && rilievoUsabile(r));
  const scavo = suoi.filter((r) => provenienzaDi(r) === "scavo");
  const cumulo = suoi.filter((r) => provenienzaDi(r) === "cumulo");
  if (!scavo.length)
    return { m3: null, misurabile: false, rilievi: 0,
      cumuloM3: r2(cumulo.reduce((t, r) => t + (+r.volumeM3 || 0), 0)), rilieviCumulo: cumulo.length,
      motivo: cumulo.length
        ? "Sui fronti di questo lotto ci sono solo riprese da cumulo: è materiale già cavato prima, non scavo nuovo di questo lotto."
        : "Nessun rilievo elaborato sui fronti di questo lotto: il volume tolto non è stato misurato da nessuno." };
  return { m3: r2(scavo.reduce((t, r) => t + (+r.volumeM3 || 0), 0)),
    misurabile: true, rilievi: scavo.length,
    cumuloM3: r2(cumulo.reduce((t, r) => t + (+r.volumeM3 || 0), 0)),
    rilieviCumulo: cumulo.length, motivo: "" };
}

/* ⛔ E I RILIEVI CHE NON STANNO IN NESSUN LOTTO. Se sparissero in silenzio, la
   somma dei lotti sarebbe più piccola del volume davvero misurato — e nessuno
   se ne accorgerebbe, perché ogni singolo lotto tornerebbe. È la stessa forma
   delle voci di costo senza data: si contano a parte, non si nascondono. */
/* ⛔ E LA CONDIZIONE È QUELLA SCRITTA UNA VOLTA SOLA, non una undicesima copia.
   Qui c'era `r.stato === "elaborato" && Number.isFinite(+r.volumeM3)`, che è la
   variante staccata di `rilievoUsabile` con dentro la trappola che quella
   funzione esiste per evitare: `+null` fa **0** e `Number.isFinite(0)` risponde
   **true**. Misurato il 02/08 su tre rilievi fuori dai lotti, uno solo dei
   quali con un volume leggibile: la schermata scriveva «**3** rilievi di scavo
   non stanno in nessun lotto, per **500 m³**» — tre misure, di cui due non
   misurate, sommate in un numero che sembra completo.
   ⚠️ E toglierli e basta li farebbe sparire in silenzio, che è il difetto per
   cui questa funzione esiste. Si contano a parte, in `senzaVolume`: sono
   rilievi dichiarati elaborati il cui volume non si legge, quindi non contano
   **né** nei lotti né qui — e la frase tranquilla «ogni volume misurato sta
   dentro un lotto» non si può dire finché ce n'è anche uno solo. */
export function rilieviFuoriDaiLotti(lotti, rilievi) {
  const dentro = new Set();
  for (const l of lotti || []) for (const f of (l || {}).frontiId || []) dentro.add(String(f || ""));
  const scavoElaborati = (rilievi || []).filter((r) => r && r.stato === "elaborato"
    && provenienzaDi(r) === "scavo");
  const orfani = scavoElaborati.filter((r) => rilievoUsabile(r)
    && !dentro.has(String(r.fronteId || "")));
  return { quanti: orfani.length,
    m3: r2(orfani.reduce((t, r) => t + (+r.volumeM3 || 0), 0)),
    senzaFronte: orfani.filter((r) => !String(r.fronteId || "").trim()).length,
    // dovunque stiano (dentro o fuori da un lotto): il loro volume non lo sa
    // nessuno, quindi non entrano in nessuna somma di questa app
    senzaVolume: scavoElaborati.filter((r) => !rilievoUsabile(r)).length };
}

// ============================================================
// «STIAMO SCAVANDO DOVE IL PROGETTO DICE?» — CONFORMITÀ AL PROGETTO
// ------------------------------------------------------------
// È la domanda che un ente fa a una cava autorizzata, e Terra sapeva
// rispondere solo a metà di essa. Quello che c'era già, e che qui NON si
// riscrive (si chiama):
//   · QUANTO in tutto      → `vitaCava` (volume concesso − estratto);
//   · QUANTO quest'anno    → `proiezioneAnnua` (piano annuo contro proiezione);
//   · QUANTO per lotto     → `volumeMisuratoDiLotto` + `avanzamentoLotto`
//     (previsto dal progetto contro misurato dai rilievi);
//   · QUANTA superficie aperta e non ancora recuperata → `divarioRecupero`.
// Quello che mancava è l'asse VERTICALE: il progetto di coltivazione dice
// fino a che QUOTA si può scendere, e in tutto il modulo non c'era nessun
// posto dove scrivere quel numero. Senza di lui la domanda «un fronte ha già
// passato il fondo?» non era nemmeno ponibile.
//
// IL DATO NUOVO, e uno solo: `quotaFondoM` (metri sul livello del mare).
//   · sull'AUTORIZZAZIONE è il fondo cava del progetto allegato all'atto;
//   · sul LOTTO è il fondo di quel settore, quando il progetto ne dà uno
//     diverso — cosa normale, perché un progetto scende per gradoni e ogni
//     settore ha il suo. Il lotto VINCE sull'atto, e da quale dei due venga
//     il numero si dice sempre (`origine`): un giudizio che va a un ente
//     deve poter essere rifatto da chi lo legge.
// I dati vecchi non hanno il campo: NON valgono zero, valgono «non
// dichiarato», e il confronto non si fa (vedi `quotaFondoNota`).
//
// NIENTE regole di legge cablate, come in tutto il resto del modulo: la
// quota di fondo la scrive l'utente copiandola dal SUO atto. Terra mette in
// fila i numeri, non decide che cosa è lecito.
// ============================================================

/* ⛔ LO ZERO NON È UNA QUOTA DICHIARATA, e la ragione sta nei dati di Terra,
   non in una preferenza di stile. Fino al 05/08 il form dei fronti scriveva
   `quota: 0` quando il campo era lasciato vuoto, e `parseFrontiCsv` faceva lo
   stesso su una colonna vuota. In archivio, quindi, uno zero NON si distingue
   da una quota mai inserita — e le due letture portano a conclusioni opposte:
   presa per buona, una cava di collina con i fronti a 340 m risulterebbe
   «340 m sotto il fondo autorizzato», cioè uno sconfinamento grave inventato
   di sana pianta, su un foglio che va a chi fa vigilanza.
   Il prezzo dichiarato: una cava il cui fondo sta ESATTAMENTE a 0 m s.l.m.
   non si può misurare, e finisce fra i «non misurabili» — che è lo stato
   rumoroso, quello che chiede di andare a guardare. Sorgente e imboccatura
   sono state corrette (adesso scrivono `null`), ma i dati già scritti no, e
   una convenzione che vale solo per il futuro non difende nessuno. */
function quotaFondoNota(v) {
  if (v == null || String(v).trim() === "") return null;
  const n = +v;
  if (!Number.isFinite(n) || n === 0) return null;
  /* ⚠️ E NON SI ARROTONDA QUI. `r2` passa da `Math.round`, che sul mezzo tira
     verso +∞: `r2(-12.345)` fa -12,34 e non -12,35. Una quota può benissimo
     essere negativa (una cava in fossa sta sotto il livello del mare), quindi
     arrotondare l'ingresso aggiunge una sorpresa che non serve a niente. Si
     arrotonda una volta sola, sul margine, che è il numero che si legge. */
  return n;
}

/* DA QUALE RIGA VIENE IL FONDO. `noto` è la bandiera che dice a chi disegna
   che sotto non c'è nessuna misura: senza di lei un fondo mancante si
   leggerebbe come un fondo a zero, che è la solita buona notizia inventata. */
export function fondoAutorizzato(lotto, autorizzazione) {
  const dalLotto = quotaFondoNota((lotto || {}).quotaFondoM);
  if (dalLotto != null)
    return { m: dalLotto, origine: "lotto", noto: true, perche: "" };
  const dallAtto = quotaFondoNota((autorizzazione || {}).quotaFondoM);
  if (dallAtto != null)
    return { m: dallAtto, origine: "autorizzazione", noto: true, perche: "" };
  return { m: null, origine: null, noto: false,
    perche: "Il progetto di coltivazione non dichiara nessuna quota di fondo: senza quel numero non si può dire se lo scavo sta dentro il progetto." };
}

/* LA DECISIONE, IN UN POSTO SOLO, e su un numero solo — così la mappa dei
   badge della pagina si può controllare contro di lei (regola 18 di
   `run-stile.mjs`). Quattro risposte:
     · `oltre`          il fronte è sceso SOTTO il fondo autorizzato;
     · `al-limite`      ci è arrivato esatto: non è una violazione, ma da lì
                        non si scende più, ed è una cosa da sapere prima;
     · `dentro`         c'è ancora margine, e quanto lo dice `margineM`;
     · `non-misurabile` manca la quota di fondo, o quella del fronte.
   Nessuna soglia di guardia inventata («warn sotto i 5 m»): quanto franco
   tenere lo dice il progetto, non noi. */
export function statoConformitaQuota(margineM) {
  if (margineM == null || String(margineM).trim() === "") return "non-misurabile";
  const m = +margineM;
  if (!Number.isFinite(m)) return "non-misurabile";
  return m < 0 ? "oltre" : m === 0 ? "al-limite" : "dentro";
}

/* UN FRONTE CONTRO IL SUO FONDO. `lotto` è quello che contiene il fronte
   (può essere `null`: allora vale il fondo dell'atto). */
export function conformitaQuota(fronte, lotto, autorizzazione) {
  const f = fondoAutorizzato(lotto, autorizzazione);
  const q = quotaFondoNota((fronte || {}).quota);
  if (!f.noto)
    return { stato: "non-misurabile", misurabile: false, margineM: null,
      quotaFronte: q, fondoM: null, origineFondo: null, perche: f.perche };
  if (q == null)
    return { stato: "non-misurabile", misurabile: false, margineM: null,
      quotaFronte: null, fondoM: f.m, origineFondo: f.origine,
      perche: "Questo fronte non dichiara la quota raggiunta: il confronto con la quota di fondo del progetto non è stato fatto." };
  const margineM = r2(q - f.m);
  return { stato: statoConformitaQuota(margineM), misurabile: true, margineM,
    quotaFronte: q, fondoM: f.m, origineFondo: f.origine, perche: "" };
}

/* IL QUADRO D'INSIEME, sui tre modi in cui si può scavare fuori dal progetto:
     1. più GIÙ del fondo autorizzato          → asse verticale, il dato nuovo;
     2. più di quanto quel lotto PREVEDE       → `avanzamentoLotto`, che c'era
        già e dava la percentuale senza che nessuno la chiamasse per nome;
     3. in un lotto che il progetto non ha ancora APERTO — un lotto «previsto»
        su cui però i rilievi misurano scavo. Anche questo si legge da funzioni
        che ci sono già: il dato mancava solo di una domanda.
   ⛔ E il conto dei NON misurabili si restituisce sempre, sui tre assi: un
   «nessun fronte oltre il fondo» calcolato su due fronti quando ce ne sono
   otto è la buona notizia che nasconde le altre sei. */
export function conformitaProgetto(fronti, lotti, rilievi, autorizzazione) {
  const FR = (fronti || []).filter(Boolean);
  const LO = (lotti || []).filter(Boolean);
  const lottoDi = (id) => LO.find((l) =>
    ((l || {}).frontiId || []).map((x) => String(x || "")).includes(String(id))) || null;

  const righe = FR.map((f) => {
    const lo = lottoDi(f.id);
    return { id: f.id, nome: String(f.nome || "Fronte senza nome"),
      lottoId: lo ? lo.id : null, lottoNome: lo ? String(lo.nome || "") : "",
      ...conformitaQuota(f, lo, autorizzazione) };
  });
  const quanti = (s) => righe.filter((r) => r.stato === s).length;
  const misurate = righe.filter((r) => r.misurabile);

  // il più vicino al fondo fra quelli che non l'hanno passato: è il fronte da
  // guardare, e «al-limite» ci sta dentro (margine 0, cioè arrivati)
  const ancoraSopra = misurate.filter((r) => r.margineM >= 0);
  const oltreIlFondo = misurate.filter((r) => r.margineM < 0);
  const minimo = (arr) => arr.length ? arr.reduce((a, b) => (b.margineM < a.margineM ? b : a)) : null;

  const fondiSuiLotti = LO.some((l) => quotaFondoNota(l.quotaFondoM) != null);
  const fondoAtto = quotaFondoNota((autorizzazione || {}).quotaFondoM);
  // tre ragioni diverse per «non si sa», e vanno tenute distinte: mandano a
  // fare tre cose diverse
  const perche = misurate.length ? ""
    : !FR.length
      ? "Nessun fronte registrato: non c'è ancora niente di cui confrontare la quota."
      : (fondoAtto == null && !fondiSuiLotti)
        ? "Il progetto di coltivazione non dichiara nessuna quota di fondo, né sull'atto né sui lotti: scrivila nella scheda dell'autorizzazione e il confronto comincia."
        : "Nessuno dei fronti registrati dichiara la quota raggiunta: senza quel numero non c'è niente da confrontare con il fondo del progetto.";

  // ── assi 2 e 3: chiamano le funzioni che ci sono già ──
  const perLotto = LO.map((l) => {
    const vm = volumeMisuratoDiLotto(l, rilievi);
    /* la stessa cautela della pagina: `avanzamentoLotto` si chiama col
       misurato SOLO se c'è davvero, se no risponde «0%» — che si legge «non
       ancora cominciato» dove la verità è «nessuno ha misurato». */
    const av = avanzamentoLotto(l, vm.misurabile ? vm.m3 : null);
    return { id: l.id, nome: String(l.nome || "Lotto senza nome"), stato: statoLotto(l),
      previstoM3: +l.volumeM3 > 0 ? +l.volumeM3 : null,
      misuratoM3: av.misuratoM3, pct: av.pct, perche: av.pct == null ? (vm.misurabile ? av.motivo : vm.motivo) : "" };
  });
  const conPct = perLotto.filter((v) => v.pct != null);
  const oltrePrevisto = conPct.filter((v) => v.pct > 100);
  const fuoriSequenza = perLotto.filter((v) => v.stato === "previsto" && v.misuratoM3 > 0);

  return {
    misurabile: misurate.length > 0, perche,
    fondoAtto, fondiSuiLotti, fronti: righe,
    oltre: quanti("oltre"), alLimite: quanti("al-limite"), dentro: quanti("dentro"),
    nonMisurabili: quanti("non-misurabile"),
    piuVicino: minimo(ancoraSopra), peggiore: minimo(oltreIlFondo),
    volume: {
      misurabile: conPct.length > 0,
      perche: conPct.length ? "" : (!LO.length
        ? "Nessun lotto registrato: non c'è nessun volume di progetto con cui confrontarsi."
        : "Nessun lotto ha insieme un volume di progetto e un volume misurato: il confronto non è stato fatto per nessuno."),
      lotti: perLotto, conConfronto: conPct.length,
      senzaConfronto: perLotto.length - conPct.length,
      oltrePrevisto, fuoriSequenza,
    },
  };
}
