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
//   fermi/{id}:        { mezzo, causale (chiave), inizio (ISO), fine (ISO)|
//                        null, note } — FERMO MACCHINA (L6, 29/07): da
//                        quando a quando una macchina non ha potuto
//                        lavorare, e perché. `fine` null = fermo ANCORA
//                        APERTO, che conta fino a oggi. È la collezione da
//                        cui nasce la disponibilità REALE (giorni-macchina
//                        persi sui giorni-macchina disponibili): `mezzi.stato`
//                        dice solo com'è messo il parco adesso.
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
//   manutenzioni.stato / .manodopera / .ricambiUsati / .altreSpese /
//   manutenzioni.noteLavoro            ORDINE DI LAVORO (L5, 29/07): lo
//                      stato della lavorazione ("da-fare" | "in-corso" |
//                      "attesa-ricambi"; se manca vale "da-fare", che è
//                      esattamente com'erano prima tutte le manutenzioni),
//                      chi ci ha lavorato e per quante ore
//                      ([{chi, ore, tariffa}]), i ricambi consumati
//                      ([{id, nome, qta, prezzo}]) e le spese esterne.
//                      Il costo NON si salva: si ricalcola sempre da queste
//                      righe (costoOrdine), così non può divergere da ciò
//                      che c'è scritto.
//   ricambi.prezzo     prezzo unitario del pezzo (facoltativo): serve a far
//                      uscire da solo il costo dei ricambi di un ordine di
//                      lavoro. Chi non ce l'ha lo scrive nell'ordine.
//   interventi.manodopera / .oreManodopera / .costoManodopera /
//   interventi.costoRicambi / .ricambiUsati   la lavorazione conservata
//                      nello storico. `ricambio` (nome del primo pezzo) e
//                      `costo` (TOTALE) restano quelli di prima: i registri,
//                      gli export e i costi per mezzo non cambiano di una
//                      virgola.
// L'urgenza delle manutenzioni si CALCOLA dalla data (mai salvata).
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione, numeroScritto } from "../../shared/deepwork-id-client/dw-shell.js";

// Data di oggi in formato ISO (aaaa-mm-gg) nel fuso dell'utente: la stessa
// che scrive l'app quando registra la fotografia del giorno.
export function oggiIso(oggi = new Date()) {
  const d = new Date(oggi);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
const isoIndietro = (giorni) => oggiIso(new Date(Date.now() - giorni * 86400000));

// ══════════════════════════════════════════════════════════════════════
// UN NUMERO SCRITTO A MANO IN CAVA (30/07)
// In cava chi compila è italiano e scrive «2,4». Un <input type="number">
// NON è neutro rispetto alla virgola: la specifica HTML gli impone come
// valore un «valid floating-point number», cioè col PUNTO, e il browser
// sanifica quello che si digita PRIMA che il codice lo veda. Misurato in
// Chromium sui campi di Flotta, in locale en-US e it-IT allo stesso modo:
//   digitato «2,4»       → .value «24»       e checkValidity() true
//   digitato «1.250,75»  → .value «1.25075»
// Non un campo vuoto: un numero dieci volte più grande dichiarato valido, e
// un prezzo di 1.250,75 € che entra nel registro costi come 1,25 €. Il
// `replace(",", ".")` che i validatori facevano era codice morto, perché la
// virgola era già stata buttata via. In Flotta questo colpisce i SOLDI e i
// CONSUMI: litri di gasolio, euro, ore di manodopera, tariffe orarie,
// prezzi dei ricambi, letture del contatore.
// Da qui in poi i campi decimali sono <input type="text" inputmode="decimal">
// (sul telefono resta la tastiera numerica) e il numero lo legge questa
// funzione. Il prezzo da pagare è che min/max/step del browser non valgono
// più: la validazione è nostra, ed è qui.
// Accetta «2,4» · «2.4» · «1.250,75» · «1,250.75» · «1 250,75» · «€ 12,50».
// RIFIUTA invece di indovinare due cose:
//  · quello che non ha forma di numero («2,4,5» non è 245);
//  · l'AMBIGUO «1.250», dove un separatore solo seguito da esattamente tre
//    cifre può voler dire milleduecentocinquanta o uno virgola due-cinque.
//    numIt sceglierebbe 1,25; su un importo è un errore da mille volte, e
//    l'unica risposta onesta è chiederlo a chi scrive.
// Ritorna { vuoto, ok, valore, grezzo, motivo } — il messaggio lo scrive chi
// chiama, perché il messaggio giusto dipende dal campo. Pura e testabile.
// ══════════════════════════════════════════════════════════════════════
export const AVVISO_DECIMALE =
  "Va bene sia la virgola sia il punto: «2,4» e «2.4» sono lo stesso numero.";
export const AVVISO_MIGLIAIA =
  "Scrivilo senza il punto delle migliaia: «1250», non «1.250».";

// spazi di ogni tipo (anche quelli “fini” che arrivano dal foglio di calcolo)
// e il simbolo dell'euro: chi scrive «€ 12,50» ha scritto un numero
export function numeroDaCampo(testo, opts = {}) {
  // Delega al lettore CONDIVISO (`shared/deepwork-id-client/dw-shell.js`), dove
  // questa logica ora vive una volta sola. Il comportamento cambia in un punto,
  // in meglio: prima si chiedeva SEMPRE su «1.250», anche quando per quel campo
  // una sola lettura era possibile — «1.600» in una densità è 1,6, perché 1600
  // t/m³ non esiste, e non c'era niente da chiedere. Ora si chiede solo quando
  // entrambe le letture stanno nei limiti. Qui resta ciò che è di Flotta: due
  // decimali, la precisione dei soldi e dei litri.
  return numeroScritto(testo, { decimali: 2, ...opts });
}

// Un numero INTERO scritto a mano: giorni, mesi. Stesse regole, più il
// vincolo che non ci siano decimali (mezzo mese non esiste).
export function interoDaCampo(testo, opts = {}) {
  return numeroDaCampo(testo, { ...opts, intero: true, decimali: 0 });
}

// Come si SCRIVE un numero DENTRO un campo di testo (non a schermo): con la
// virgola decimale, perché è quella che l'utente rileggerà e ribatterà, e
// MAI col punto delle migliaia, che rientrerebbe da `numeroDaCampo` come
// ambiguo e farebbe rifiutare un valore proposto dall'app stessa.
export function perCampo(v, decimali = 2) {
  if (v == null || v === "" || !Number.isFinite(+v)) return "";
  return (+v).toLocaleString("it-IT", { useGrouping: false, maximumFractionDigits: Math.max(0, decimali) });
}

// Come si LEGGE un numero dentro un messaggio a schermo: all'italiana e CON
// il punto delle migliaia, che è come si scrive un migliaio in Italia. È il
// contrario di perCampo, e la differenza non è un vezzo: dentro un campo il
// punto delle migliaia rientrerebbe come ambiguo, dentro una frase serve.
const mostra = (v, dec = 2) =>
  Number.isFinite(+v) ? (+v).toLocaleString("it-IT", { maximumFractionDigits: Math.max(0, dec) }) : "";

// IL MESSAGGIO di un numero che non si è potuto leggere. Sta qui, in un posto
// solo, perché i validatori di riga e le schermate dicono la stessa cosa: se
// la frase la scrive ognuno per conto suo, una frase sbagliata diventa tre
// difetti. `cosa` è il nome del dato come lo chiama l'utente («i litri
// messi», «il prezzo del pezzo»): la frase deve nominare il campo, altrimenti
// in un form con cinque caselle non si sa quale correggere.
// Non dice MAI «valore non valido»: dice cosa c'è scritto e cosa fare.
// Ogni frase è costruita perché `cosa` non ci vada mai in posizione di
// soggetto: «le ore di lavoro deve essere…» è un errore di grammatica che
// nasce da sé se si concatenano le parole senza pensarci, e un messaggio
// scritto male fa sembrare rotto anche quello che funziona.
export function messaggioNumero(r, cosa, opts = {}) {
  const q = "«" + String((r && r.grezzo) || "") + "»";
  const u = opts.unita ? " " + opts.unita : "";
  switch (r && r.motivo) {
    case "vuoto":
      return "Senza " + cosa + " non posso salvare: scrivi il numero.";
    case "ambiguo":
      // Le due letture si scrivono con perCampo, non con mostra: raggruppate
      // darebbero «1.250 oppure 1,25», cioè la frase ripeterebbe la stringa
      // ambigua invece di scioglierla. E tre decimali, non due: la lettura
      // decimale di «5.875» è 5,875 — con i due di default diventava «5,88»,
      // un terzo numero che non c'entra niente con quello che era stato scritto.
      return q + " può voler dire " + perCampo(r.letture[0]) + u + " (punto delle migliaia) oppure "
        + perCampo(r.letture[1], 3) + u + " (punto decimale), e non voglio indovinare al posto tuo. " + AVVISO_MIGLIAIA;
    case "non-numero":
      return "Non riesco a leggere " + cosa + ": " + q + " non è un numero. " + AVVISO_DECIMALE;
    case "non-intero":
      return "Per " + cosa + " serve un numero intero: " + q + " non lo è.";
    case "non-positivo":
      return "Serve un numero maggiore di zero per " + cosa + ": hai scritto " + q + ".";
    case "sotto-minimo":
      return +opts.min === 0
        ? "Un numero negativo non ha senso per " + cosa + ": hai scritto " + q + "."
        : "Per " + cosa + " serve almeno " + mostra(opts.min) + u + ": hai scritto " + q + ".";
    case "sopra-massimo":
      return "Per " + cosa + " il massimo è " + mostra(opts.max) + u + ": " + q + " è troppo, controlla il numero.";
    default:
      return "Non riesco a leggere " + cosa + ": " + q + ". " + AVVISO_DECIMALE;
  }
}

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
  // Le manutenzioni sono ORDINI DI LAVORO (L5). n1 è di proposito senza
  // `stato`, senza manodopera e senza ricambiUsati: è una manutenzione come
  // quelle scritte prima che l'ordine di lavoro esistesse, e deve comportarsi
  // esattamente come prima («da fare», nessuna ora, il suo `ricambioId`
  // ritrovato come riga di ricambio). n2 è in lavorazione con due persone e
  // ore diverse, n4 è ferma in attesa di un pezzo.
  manutenzioni: [
    { id: "n1", titolo: "Tagliando 500h", mezzo: "Escavatore E1", dataPrevista: null, orePreviste: 6000, ogniOre: 500, piano: "500", ricambioId: "p1" },
    { id: "n2", titolo: "Rotazione gomme", mezzo: "Dumper D1", dataPrevista: "2026-08-05",
      stato: "in-corso",
      manodopera: [{ chi: "Marco", ore: 3, tariffa: 32 }, { chi: "Officina esterna", ore: 1.5, tariffa: 55 }],
      ricambiUsati: [], altreSpese: 0, noteLavoro: "smontate le due gomme posteriori" },
    { id: "n3", titolo: "Revisione annuale", mezzo: "Pala P1", dataPrevista: "2026-08-20", ogniMesi: 12 },
    // n5 e n6 sono i due tagliandi A ORE che la tessera «Tagliandi 30gg»
    // fino a ieri non contava affatto. Sono di proposito uno per caso:
    //  · n5 è sul Dumper D1, che ha abbastanza letture del contatore perché
    //    il ritmo si MISURI (≈3,4 h/gg): 80 h mancanti diventano ~24 giorni,
    //    quindi entra nel conto della tessera;
    //  · n6 è sulla Pala P1, le cui letture coprono una finestra troppo
    //    corta: il ritmo non si può dire, e questo tagliando va contato A
    //    PARTE — dichiarato, non nascosto e non stimato a caso.
    { id: "n5", titolo: "Tagliando 250h", mezzo: "Dumper D1", dataPrevista: null, orePreviste: 8500, ogniOre: 250, piano: "250" },
    { id: "n6", titolo: "Cambio olio idraulico", mezzo: "Pala P1", dataPrevista: null, orePreviste: 6600, ogniOre: 500, piano: "500" },
    { id: "n4", titolo: "Giro macchina: Perdite sotto la macchina", mezzo: "Dumper D1",
      dataPrevista: isoIndietro(1), origine: "controllo",
      stato: "attesa-ricambi",
      manodopera: [{ chi: "Marco", ore: 1, tariffa: 32 }],
      ricambiUsati: [{ id: "p3", nome: "Olio idraulico (fusto 200L)", qta: 1, prezzo: 420 }],
      altreSpese: 0, noteLavoro: "in attesa della guarnizione del distributore",
      nota: "macchia fresca di olio sotto la trasmissione" },
  ],
  // FERMI MACCHINA (L6). Due chiusi e uno ancora aperto — il Dumper D3, che
  // nel parco è infatti «fermo»: è la macchina che sta perdendo giornate
  // adesso. Le date sono relative a oggi, così l'esempio resta leggibile.
  fermi: [
    { id: "f1", mezzo: "Dumper D3", causale: "guasto-idraulico", inizio: isoIndietro(6), fine: null,
      note: "pompa idraulica da sostituire, macchina in officina" },
    { id: "f2", mezzo: "Dumper D3", causale: "attesa-ricambi", inizio: isoIndietro(20), fine: isoIndietro(17),
      note: "guarnizioni arrivate il terzo giorno" },
    { id: "f3", mezzo: "Perforatrice P2", causale: "guasto-meccanico", inizio: isoIndietro(11), fine: isoIndietro(10),
      note: "manicotto dell'asta" },
    { id: "f4", mezzo: "Pala P1", causale: "manutenzione", inizio: isoIndietro(4), fine: isoIndietro(4),
      note: "tagliando 1000 h" },
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
  // Le date sono RELATIVE a oggi (come lo storico della disponibilità), e non
  // per comodità: il contatore delle ore serve anche a MISURARE il ritmo
  // d'uso dei mezzi, che è quello che colloca nel tempo i tagliandi «a ore»
  // (vedi ritmoOreMezzi). Con date fisse l'esempio, invecchiando, avrebbe
  // fatto vedere solo il caso «ritmo non misurabile».
  // Le distanze fra le letture sono scelte una per una:
  //  · Escavatore E1 e Dumper D1 coprono 15 e 19 giorni → il ritmo si misura;
  //  · Pala P1 ne copre 12 → è sotto la metà dell'orizzonte, e serve a far
  //    vedere il caso in cui il ritmo NON si può dire;
  //  · Escavatore E2 ha una lettura sola → non si può dire nemmeno il consumo.
  rifornimenti: [
    { id: "r1", data: isoIndietro(18), mezzo: "Escavatore E1", litri: 480, euro: 720, ore: 5812, nota: "cisterna cava", costoId: null },
    { id: "r2", data: isoIndietro(10), mezzo: "Escavatore E1", litri: 505, euro: 762, ore: 5841, nota: "", costoId: null },
    { id: "r3", data: isoIndietro(3), mezzo: "Escavatore E1", litri: 470, euro: 700, ore: 5868, nota: "", costoId: null },
    { id: "r4", data: isoIndietro(20), mezzo: "Dumper D1", litri: 390, euro: 585, ore: 8355, nota: "", costoId: null },
    { id: "r5", data: isoIndietro(9), mezzo: "Dumper D1", litri: 415, euro: 620, ore: 8390, nota: "", costoId: null },
    { id: "r6", data: isoIndietro(2), mezzo: "Dumper D1", litri: 360, euro: 540, ore: 8416, nota: "", costoId: null },
    { id: "r7", data: isoIndietro(16), mezzo: "Pala P1", litri: 300, euro: 450, ore: 6498, nota: "", costoId: null },
    { id: "r8", data: isoIndietro(4), mezzo: "Pala P1", litri: 320, euro: 480, ore: 6531, nota: "", costoId: null },
    { id: "r9", data: isoIndietro(6), mezzo: "Escavatore E2", litri: 300, euro: 450, ore: 3195, nota: "primo pieno registrato", costoId: null },
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
    // w1 porta la LAVORAZIONE (L5): due persone, ore e costo orario, il pezzo
    // consumato. `ricambio` e `costo` restano quelli di sempre, così registro,
    // export e costi per mezzo non cambiano.
    { id: "w1", data: "2026-07-10", titolo: "Tagliando 500h", mezzo: "Escavatore E1", ricambio: "Filtro olio motore CAT", costo: 420, note: "olio + filtri",
      manodopera: [{ chi: "Marco", ore: 4, tariffa: 32, costo: 128 }, { chi: "Luca", ore: 2, tariffa: 32, costo: 64 }],
      oreManodopera: 6, costoManodopera: 192, costoRicambi: 48, altreSpese: 180,
      ricambiUsati: [{ id: "p1", nome: "Filtro olio motore CAT", qta: 1, prezzo: 48, costo: 48 }] },
    { id: "w2", data: "2026-06-28", titolo: "Sostituzione pompa idraulica", mezzo: "Dumper D3", ricambio: null, costo: 3850, note: "officina esterna" },
    { id: "w3", data: "2026-06-14", titolo: "Riparazione impianto frenante", mezzo: "Dumper D3", ricambio: null, costo: 1240, note: "" },
    { id: "w4", data: "2026-05-30", titolo: "Rotazione e sostituzione gomme", mezzo: "Dumper D1", ricambio: null, costo: 2100, note: "4 gomme posteriori" },
    { id: "w5", data: "2026-05-12", titolo: "Denti benna e usure", mezzo: "Pala P1", ricambio: "Denti benna escavatore", costo: 760, note: "" },
    { id: "w6", data: "2026-04-22", titolo: "Tagliando 1000h", mezzo: "Escavatore E2", ricambio: "Filtro gasolio", costo: 540, note: "" },
    { id: "w7", data: "2026-04-08", titolo: "Revisione martello perforatore", mezzo: "Perforatrice P2", ricambio: null, costo: 1180, note: "" },
  ],
  // `p4` è di proposito SENZA `prezzo`: è un ricambio registrato prima che il
  // campo esistesse. Nell'ordine di lavoro la sua riga nasce a prezzo vuoto e
  // l'app lo dice, invece di far passare per gratis un pezzo che costa.
  ricambi: [
    { id: "p1", nome: "Filtro olio motore CAT", giacenza: 6, sogliaMin: 4, prezzo: 48 },
    { id: "p2", nome: "Filtro gasolio", giacenza: 2, sogliaMin: 4, prezzo: 31.5 },
    { id: "p3", nome: "Olio idraulico (fusto 200L)", giacenza: 1, sogliaMin: 1, prezzo: 420 },
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
  // La periodicità è un numero INTERO di mesi (mezzo mese non esiste), ma va
  // letta con le stesse regole degli altri campi: «1.000» scritto qui dava 1
  // — un anno di anticipo su una revisione di legge — e nessuno se ne
  // accorgeva perché 1 è un valore accettabile.
  let mesi = null;
  const rm = interoDaCampo(d.mesi, { min: 0, max: 600 });
  if (!rm.vuoto) {
    if (!rm.ok) errori.mesi = rm.motivo === "sotto-minimo" || rm.motivo === "sopra-massimo"
      ? "La periodicità va da 1 a 600 mesi (lascia vuoto se non si ripete)."
      // niente `unita` qui: la frase direbbe «1 mesi», e un messaggio scritto
      // male fa sembrare rotto anche quello che funziona
      : messaggioNumero(rm, "la periodicità in mesi", { min: 0, max: 600 });
    else mesi = rm.valore > 0 ? rm.valore : null;
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
// IMPORT DEL MAGAZZINO RICAMBI DA CSV.
// Perché esiste: un magazzino vero sono centinaia di righe, e fino al 30/07
// erano centinaia di righe da battere a mano il primo giorno, davanti al
// cliente. Il piano go-live consigliava Flotta come app pilota proprio per «i
// ricambi»: era il consiglio giusto sulla funzione sbagliata.
//
// Colonne: nome;giacenza;sogliaMin;prezzo
//
// Le tre decisioni, e nessuna è ovvia:
// 1. LA GIACENZA CHE MANCA VALE ZERO, non «non lo so». È l'unico campo di
//    questa funzione dove il valore di comodo è quello GIUSTO: un ricambio che
//    sta in magazzino senza una quantità scritta accanto è un ricambio che non
//    c'è, e zero è esattamente ciò che fa scattare il sotto-scorta — cioè
//    l'avviso che serve. Il contrario (lasciarla vuota) nasconderebbe proprio i
//    pezzi finiti, che sono quelli da ordinare.
// 2. LA SOGLIA MINIMA che manca resta `null`, e lì il valore di comodo sarebbe
//    sbagliato: una soglia inventata fa suonare un allarme che nessuno ha
//    chiesto, oppure lo tace. Senza soglia il ricambio si conta e basta.
// 3. IL PREZZO che manca resta `null`: entra nel conto dei costi, e uno zero
//    farebbe sembrare gratis un pezzo che gratis non è.
export function parseRicambiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, giacenza, sogliaMin, prezzo] = parseCsvLine(r);
      const g = numIt(giacenza);
      const s = numIt(sogliaMin);
      const p = numIt(prezzo);
      return {
        nome: (nome || "").trim(),
        // vedi decisione 1: qui lo zero è la risposta giusta, non una scorciatoia
        giacenza: Number.isFinite(g) && g > 0 ? g : 0,
        sogliaMin: Number.isFinite(s) && s > 0 ? s : null,
        prezzo: Number.isFinite(p) && p > 0 ? p : null,
      };
    })
    .filter(r => r.nome);
}

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
        /* ⚠️ NIENTE ZERO DI COMODO SULLE ORE (31/07). Il contatore COMANDA la
           manutenzione: `tagliandiInScadenza` calcola quanto manca come
           «ore previste meno ore del contatore». Un mezzo importato con le ore
           illeggibili, messo a zero, farebbe sembrare il tagliando lontanissimo
           proprio quando magari è già scaduto — e nessuno vedrebbe un errore.
           Il mezzo entra lo stesso (esiste), ma senza contatore: l'app dice che
           non lo sa leggere invece di inventarselo. */
        ore: Number.isFinite(n) ? Math.max(0, n) : null,
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
  // il numero sul badge si scrive all'italiana: da quando il contatore può
  // avere i decimi, «tra 24.5 h» avrebbe messo un punto inglese in mezzo a
  // una schermata di virgole — e «tra 1000 h» resta «tra 1.000 h» come si
  // scrive un migliaio in Italia
  const h = (n) => n.toLocaleString("it-IT", { maximumFractionDigits: 1 });
  if (mancano <= 0) return { cls: "danger", label: "SCADUTA (+" + h(-mancano) + " h)", mancano };
  if (mancano <= 50) return { cls: "warn", label: "tra " + h(mancano) + " h", mancano };
  return { cls: "ok", label: "tra " + h(mancano) + " h", mancano };
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
// Dal 29/07 accetta anche i FERMI (L6): a un mezzo fermo si può finalmente
// attaccare il perché e da quanto, che è la prima cosa che chiede chi guarda
// il Quadro. Anche questo parametro è facoltativo: senza, il comportamento è
// quello di prima, parola per parola.
export function prioritaOperative(mezzi, manutenzioni, ricambi, oggi = new Date(), scadenze = [], preavvisoGiorni = 30, fermi = []) {
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
    /* «zero ore» e «non lo so» sono due cose diverse: con `|| 0` un mezzo
       senza contatore diventava un mezzo nuovo di fabbrica, e il tagliando
       sembrava lontano. Ora chi non ha il contatore torna null, e chi chiama
       lo manda fra quelli «da stimare» spiegando perché. */
    return m && Number.isFinite(+m.ore) ? +m.ore : null;
  };
  for (const n of manutenzioni || []) {
    let u, dettaglio;
    if (n.orePreviste) {
      const ore = oreDi(n.mezzo);
      if (ore == null) continue;                 // mezzo non trovato: non calcolabile
      u = urgenzaOre(n.orePreviste, ore);
      // la riga di priorità va sul Quadro: il numero si scrive all'italiana,
      // altrimenti «a 6000.5 h motore» mette un punto inglese sulla prima
      // schermata dell'app, accanto a numeri con la virgola
      dettaglio = "a " + mostra(n.orePreviste, 1) + " h motore";
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
    // se c'è un fermo aperto su questo mezzo, il dettaglio dice il perché e
    // da quanti giorni: «Fermo» da solo non fa fare niente a nessuno
    const aperto = (fermi || []).find(f => nomeBreve(f.mezzo) === nomeBreve(m.nome) && !f.fine);
    const d = aperto ? durataFermo(aperto, oggi) : null;
    const perche = aperto
      ? etichettaCausale(aperto.causale) + (d && d.giorni != null ? " · fermo da " + d.giorni + (d.giorni === 1 ? " giorno" : " giorni") : "")
        + (m.area ? " · " + m.area : "")
      : (m.area || "—");
    items.push({ gravita: m.stato === "fermo" ? "danger" : "warn", categoria: "mezzo",
      titolo: m.nome || "Mezzo", dettaglio: perche,
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
    // un decimo di ora, non un'ora intera: i contaore contano i decimi, e
    // arrotondare 5875,5 a 5876 farebbe scrivere nella finestra «il contatore
    // segna adesso 5.876 ore» — un numero che il contatore non ha mai detto
    const ore = Math.round(+oreAttuali * 10) / 10;
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
  // I tre numeri passano da numeroDaCampo: «45,8» litri e «1.250,75» euro
  // arrivano interi come li ha scritti chi riforniva, e quello che non si
  // capisce viene DETTO — mai salvato come zero, che su una spesa di gasolio
  // è un buco nei costi che nessuno ritrova più.
  const rl = numeroDaCampo(d.litri, { positivo: true, max: 20000 });
  if (!rl.ok) errori.litri = rl.vuoto
    ? "Scrivi quanti litri hai messo (un numero maggiore di zero)."
    : rl.motivo === "sopra-massimo"
      ? "Più di 20.000 litri in un rifornimento: controlla il numero."
      : messaggioNumero(rl, "i litri messi", { unita: "l" });
  const litri = rl.ok ? rl.valore : 0;
  const re = numeroDaCampo(d.euro, { min: 0 });
  if (!re.vuoto && !re.ok) errori.euro = re.motivo === "sotto-minimo"
    ? "La spesa dev'essere un numero da zero in su (lascia vuoto se non la sai)."
    : messaggioNumero(re, "la spesa del gasolio", { unita: "€", min: 0 });
  const euro = re.ok ? re.valore : 0;
  // il contatore tiene UN decimale: i contaore delle macchine contano i
  // decimi, e arrotondare 1234,8 a 1235 farebbe poi rifiutare la lettura
  // successiva come «più bassa di quella già registrata»
  const ro = numeroDaCampo(d.ore, { min: 0, decimali: 1 });
  let ore = null;
  if (!ro.vuoto) {
    if (!ro.ok) errori.ore = ro.motivo === "sotto-minimo"
      ? "Il contatore va scritto in ore, un numero da zero in su."
      : messaggioNumero(ro, "le ore del contatore", { unita: "h", min: 0 });
    else if (Number.isFinite(+oreMezzo) && ro.valore + 0.5 < +oreMezzo)
      errori.ore = "Il contatore segna meno delle " + mostra(+oreMezzo, 1) + " ore già registrate sul mezzo: controlla il numero.";
    else ore = ro.valore;
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
  // FERMI della macchina (L6): quanti, quanto sono durati, se ne ha uno
  // aperto adesso. Nel libretto è la pagina che un compratore guarda per
  // prima, e l'unica onesta: senza, «tenuta bene» è una parola.
  const fermi = fermiOrdinati((d.fermi || []).filter(mio), oggi);
  const giorniFermoTot = fermi.reduce((t, f) => t + (f.giorni || 0), 0);
  const oreLavorate = interventi.reduce((t, w) => t + (+w.oreManodopera || 0), 0);
  return {
    mezzo: m, nome, tipo: tipoMezzoDi(m),
    manutenzioni, interventi, scadenze, controlli, rifornimenti, consumo, fermi,
    officina: { totale: Math.round(officina * 100) / 100, interventi: interventi.length,
      ore: Math.round(oreLavorate * 100) / 100 },
    fermo: { episodi: fermi.length, giorni: giorniFermoTot,
      aperti: fermi.filter(f => f.aperto).length, ultimo: fermi[0] || null },
    carburante: { totale: consumo ? consumo.euro : 0, litri: consumo ? consumo.litri : 0 },
    speso: Math.round((officina + (consumo ? consumo.euro : 0)) * 100) / 100,
    ultimoControllo: controlli[0] || null,
    ultimoIntervento: interventi[0] || null,
  };
}

// ============================================================
// L5 — ORDINE DI LAVORO (stati, manodopera, ricambi, costo)
// Fino a ieri una manutenzione era un evento: c'era, poi la segnavi fatta e
// scrivevi a mano quanto era costata. Il numero lo doveva fare l'utente, e
// un numero fatto a mente non è il costo di un intervento: è una stima.
// Da qui in poi la manutenzione ha una LAVORAZIONE:
//  · uno STATO — da fare → in lavorazione → in attesa ricambi → chiuso. Lo
//    stato «in attesa ricambi» non è un vezzo da software: è la causa più
//    frequente di macchina ferma a lungo, e finché non ha un nome nessuno
//    la conta;
//  · la MANODOPERA — chi ci ha lavorato e per quante ore. Più persone, ore
//    diverse, costo orario diverso (l'interno e l'officina esterna non
//    costano uguale);
//  · i RICAMBI consumati, più d'uno, ognuno con la sua quantità;
//  · il COSTO, che non si scrive: si somma. E siccome non viene salvato ma
//    ricalcolato, non può mai smentire le righe che hai davanti.
// ============================================================
export const STATI_ORDINE = [
  { chiave: "da-fare", etichetta: "Da fare", breve: "da fare", cls: "warn",
    nota: "Pianificato, ma nessuno ci ha ancora messo le mani." },
  // «in corso» porta il colore dell'app (lampone): è il lavoro che stiamo
  // facendo noi. Il rosso resta a chi è fermo ad aspettare un pezzo — un
  // colore, un significato, e nessuna tinta estranea alla palette.
  { chiave: "in-corso", etichetta: "In lavorazione", breve: "in corso", cls: "accent",
    nota: "Qualcuno ci sta lavorando adesso: le ore si segnano man mano." },
  { chiave: "attesa-ricambi", etichetta: "In attesa ricambi", breve: "attesa pezzi", cls: "danger",
    nota: "Il lavoro è fermo perché manca un pezzo. È la ragione più frequente di una macchina ferma a lungo: qui si vede, e si può ordinare." },
];

// Lo stato di un ordine di lavoro. Una manutenzione senza stato — cioè ogni
// manutenzione scritta prima di oggi — è «da fare»: è esattamente quello che
// era, e la riga non cambia aspetto. Pura.
export function statoOrdine(man) {
  const c = String((man && man.stato) || "").trim();
  return STATI_ORDINE.find(s => s.chiave === c) || STATI_ORDINE[0];
}

const due = (v) => Math.round((+v || 0) * 100) / 100;

// IL COSTO DI UN ORDINE DI LAVORO, riga per riga: manodopera (ore × costo
// orario, persona per persona), ricambi (quantità × prezzo) e le spese
// esterne (officina, traino, noleggio del mezzo sostitutivo). Ritorna anche
// quante righe NON hanno un prezzo, perché l'app possa dirlo invece di far
// passare per «gratis» ciò che semplicemente non è stato scritto. Pura.
export function costoOrdine(ordine) {
  const o = ordine || {};
  const manodopera = (o.manodopera || []).map(r => {
    const ore = Math.max(0, due(r && r.ore));
    const tariffa = Math.max(0, due(r && r.tariffa));
    return { chi: String((r && r.chi) || "").trim(), ore, tariffa, costo: due(ore * tariffa) };
  }).filter(r => r.ore > 0 || r.chi);
  const ricambi = (o.ricambi || []).map(r => {
    const qta = Math.max(0, due(r && r.qta));
    const prezzo = Math.max(0, due(r && r.prezzo));
    return { id: (r && r.id) || null, nome: String((r && r.nome) || "").trim(), qta, prezzo, costo: due(qta * prezzo) };
  }).filter(r => r.nome || r.id);
  const altre = Math.max(0, due(o.altreSpese));
  const oreTot = due(manodopera.reduce((t, r) => t + r.ore, 0));
  const costoMano = due(manodopera.reduce((t, r) => t + r.costo, 0));
  const pezzi = due(ricambi.reduce((t, r) => t + r.qta, 0));
  const costoRic = due(ricambi.reduce((t, r) => t + r.costo, 0));
  return {
    manodopera: { righe: manodopera, ore: oreTot, costo: costoMano,
      senzaTariffa: manodopera.filter(r => r.ore > 0 && r.tariffa <= 0).length },
    ricambi: { righe: ricambi, pezzi, costo: costoRic,
      senzaPrezzo: ricambi.filter(r => r.qta > 0 && r.prezzo <= 0).length },
    altre,
    totale: due(costoMano + costoRic + altre),
    persone: manodopera.filter(r => r.ore > 0).length,
  };
}

// L'ordine di lavoro «lavorabile» a partire dalla manutenzione salvata: mette
// insieme i campi nuovi con quelli vecchi. Una manutenzione registrata prima
// (un solo `ricambioId`, nessuna manodopera) diventa un ordine con una riga
// di ricambio già pronta, quantità 1 e il prezzo del magazzino se c'è: chi
// aveva collegato un pezzo lo ritrova, non deve riscriverlo. Pura.
export function ordineDaManutenzione(man, ricambi) {
  const m = man || {};
  const cat = ricambi || [];
  const daCat = (id) => cat.find(r => r.id === id) || null;
  let righe = Array.isArray(m.ricambiUsati)
    ? m.ricambiUsati.map(r => {
        const c = daCat(r && r.id);
        return { id: (r && r.id) || null, nome: String((r && r.nome) || (c ? c.nome : "")).trim(),
                 qta: Math.max(0, due(r && r.qta)) || 1,
                 prezzo: Math.max(0, due(r && r.prezzo != null ? r.prezzo : (c ? c.prezzo : 0))) };
      })
    : [];
  if (!righe.length && m.ricambioId) {
    const c = daCat(m.ricambioId);
    righe = [{ id: m.ricambioId, nome: c ? c.nome : "", qta: 1, prezzo: Math.max(0, due(c && c.prezzo)) }];
  }
  return {
    stato: statoOrdine(m).chiave,
    manodopera: (m.manodopera || []).map(r => ({
      chi: String((r && r.chi) || "").trim(),
      ore: Math.max(0, due(r && r.ore)),
      tariffa: Math.max(0, due(r && r.tariffa)),
    })),
    ricambi: righe,
    altreSpese: Math.max(0, due(m.altreSpese)),
    noteLavoro: String(m.noteLavoro || "").trim(),
  };
}

// Controlli su una riga di manodopera prima di aggiungerla. Il nome è
// obbligatorio (una riga senza nome non serve a nessuno), le ore devono
// essere un numero > 0 e ≤ 24 in un colpo solo — oltre è quasi sempre un
// errore di dito. Il costo orario può mancare: le ore restano registrate e
// l'app lo dichiara, invece di far finta che siano gratis. Pura.
export function validaRigaManodopera(riga) {
  const r = riga || {}, errori = {};
  const chi = String(r.chi || "").trim();
  if (!chi) errori.chi = "Scrivi chi ci ha lavorato (nome o squadra).";
  else if (chi.length > 60) errori.chi = "Il nome è troppo lungo: bastano poche lettere.";
  // «2,5» ore di manodopera sono due ore e mezza, non venticinque: il numero
  // lo legge numeroDaCampo, e la mezz'ora resta mezz'ora
  const ro = numeroDaCampo(r.ore, { positivo: true, max: 24 });
  if (!ro.ok) errori.ore = ro.vuoto
    ? "Scrivi quante ore ci ha messo (un numero maggiore di zero)."
    : ro.motivo === "sopra-massimo"
      ? "Più di 24 ore in una riga sola: aggiungine una per ogni giornata."
      : messaggioNumero(ro, "le ore di lavoro", { unita: "h" });
  const ore = ro.ok ? ro.valore : 0;
  const rt = numeroDaCampo(r.tariffa, { min: 0, max: 1000 });
  if (!rt.vuoto && !rt.ok) errori.tariffa = rt.motivo === "sotto-minimo"
    ? "Il costo orario è un numero da zero in su (lascialo vuoto se non lo sai)."
    : rt.motivo === "sopra-massimo"
      ? "Più di 1.000 € l'ora: controlla il numero."
      : messaggioNumero(rt, "il costo orario", { unita: "€", min: 0 });
  const tariffa = rt.ok ? rt.valore : 0;
  return { ok: Object.keys(errori).length === 0, errori, chi, ore: due(ore), tariffa: due(tariffa) };
}

// Controlli su una riga di ricambio consumato. Pura.
export function validaRigaRicambio(riga) {
  const r = riga || {}, errori = {};
  const nome = String(r.nome || "").trim();
  if (!nome) errori.nome = "Scegli il ricambio dal magazzino, oppure scrivi il nome del pezzo.";
  // La quantità NON è per forza intera: in magazzino con i filtri ci stanno
  // l'olio e il grasso, che si consumano a litri e a chili — «12,5» è una
  // quantità vera, e con un campo type=number diventava 125.
  const rq = numeroDaCampo(r.qta, { positivo: true, max: 9999 });
  if (!rq.ok) errori.qta = rq.vuoto
    ? "Scrivi quanti pezzi hai usato (un numero maggiore di zero)."
    : rq.motivo === "sopra-massimo"
      ? "Quantità troppo alta: controlla il numero."
      : messaggioNumero(rq, "la quantità usata");
  const qta = rq.ok ? rq.valore : 0;
  const rp = numeroDaCampo(r.prezzo, { min: 0, max: 1000000 });
  if (!rp.vuoto && !rp.ok) errori.prezzo = rp.motivo === "sotto-minimo"
    ? "Il prezzo è un numero da zero in su (lascialo vuoto se non lo sai)."
    : rp.motivo === "sopra-massimo"
      ? "Prezzo troppo alto: controlla il numero."
      : messaggioNumero(rp, "il prezzo del pezzo", { unita: "€", min: 0 });
  const prezzo = rp.ok ? rp.valore : 0;
  return { ok: Object.keys(errori).length === 0, errori, nome, id: r.id || null, qta: due(qta), prezzo: due(prezzo) };
}

// Quanti ordini in ciascuno stato: è la riga di testa dell'Officina, quella
// che dice se il lavoro sta girando o è impantanato ad aspettare i pezzi.
// Pura.
export function riepilogoOrdini(manutenzioni) {
  const c = { totale: 0, "da-fare": 0, "in-corso": 0, "attesa-ricambi": 0, oreAperte: 0, personeAperte: 0 };
  const persone = new Set();
  for (const m of manutenzioni || []) {
    c.totale++;
    c[statoOrdine(m).chiave]++;
    const q = costoOrdine(ordineDaManutenzione(m, []));
    c.oreAperte = due(c.oreAperte + q.manodopera.ore);
    q.manodopera.righe.forEach(r => { if (r.chi) persone.add(r.chi.toLowerCase()); });
  }
  c.personeAperte = persone.size;
  return c;
}

// Un giorno ISO valido, oppure null. Serve sia alle scorte sia ai fermi.
const isoGiorno = (v) => {
  const s = String(v || "").slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
};
// Giorni interi fra due giorni ISO (b − a). Non usa il fuso: le date sono
// giorni di calendario, non istanti.
const giorniFra = (a, b) =>
  Math.round((Date.parse(b + "T12:00:00Z") - Date.parse(a + "T12:00:00Z")) / 86400000);

// ============================================================
// L7 — QUANTO TENERNE A SCORTA (punto di riordino)
// La soglia minima, finora, era un numero che qualcuno aveva scritto una
// volta. Il punto di riordino vero è un conto:
//     soglia = pezzi consumati al giorno × giorni di consegna del fornitore
//              + i giorni di margine che vuoi tenerti.
// Adesso si può fare, perché l'ordine di lavoro scrive DAVVERO quali pezzi
// sono andati dentro e in che quantità. Due regole di onestà:
//  · il consumo si legge dagli interventi chiusi, non si stima. Un ricambio
//    che non è mai stato usato non ha un consumo, e la soglia non si propone;
//  · con un solo consumo registrato il «pezzi al giorno» è un numero fragile:
//    si dice, ma si dichiara che è fragile. Servono almeno due volte perché
//    una media abbia senso.
// ============================================================

// I pezzi consumati negli interventi chiusi, ricambio per ricambio, dentro
// una finestra di giorni. Gli interventi vecchi (prima dell'ordine di
// lavoro) portano un solo `ricambio` scritto per nome: valgono 1 pezzo,
// perché è esattamente quello che l'app scaricava dal magazzino allora.
// Pura e testabile.
export function consumoRicambi(interventi, giorni = 180, oggi = new Date()) {
  const finestra = Math.max(1, Math.round(+giorni || 180));
  const a = oggiIso(oggi);
  const da = oggiIso(new Date(Date.parse(a + "T12:00:00Z") - (finestra - 1) * 86400000));
  const per = new Map();
  let considerati = 0, stimati = 0;
  const conta = (chiave, nome, id, qta, data) => {
    const v = per.get(chiave) || { id: id || null, nome, pezzi: 0, episodi: 0, primo: data, ultimo: data };
    v.pezzi += qta; v.episodi++;
    if (!v.id && id) v.id = id;
    if (data < v.primo) v.primo = data;
    if (data > v.ultimo) v.ultimo = data;
    per.set(chiave, v);
  };
  for (const w of interventi || []) {
    const d = isoGiorno(w.data);
    if (!d || d < da || d > a) continue;
    considerati++;
    if (Array.isArray(w.ricambiUsati) && w.ricambiUsati.length) {
      for (const r of w.ricambiUsati) {
        const nome = String((r && r.nome) || "").trim();
        if (!nome) continue;
        conta((r && r.id) || nome.toLowerCase(), nome, r && r.id, Math.max(0, due(r && r.qta)) || 0, d);
      }
    } else if (String(w.ricambio || "").trim()) {
      // intervento vecchio: un pezzo, quello che l'app scaricava allora
      const nome = String(w.ricambio).trim();
      conta(nome.toLowerCase(), nome, null, 1, d);
      stimati++;
    }
  }
  const righe = [...per.values()].map(v => ({
    ...v, pezzi: Math.round(v.pezzi * 100) / 100,
    alGiorno: Math.round(10000 * v.pezzi / finestra) / 10000,
    affidabile: v.episodi >= 2,
  })).sort((x, y) => y.alGiorno - x.alGiorno || x.nome.localeCompare(y.nome, "it"));
  return { finestra, da, a, righe, interventi: considerati, daInterventiVecchi: stimati };
}

// Il punto di riordino, dal consumo al giorno. Ritorna null se non si può
// calcolare (nessun consumo, o tempi non sensati). Pura.
export function puntoDiRiordino(alGiorno, consegnaGiorni, sicurezzaGiorni) {
  const c = Math.round(+consegnaGiorni || 0);
  const s = Math.max(0, Math.round(+sicurezzaGiorni || 0));
  const r = +alGiorno || 0;
  if (!(c > 0) || !(r > 0)) return null;
  const copertura = c + s;
  const esatto = r * copertura;
  return {
    soglia: Math.max(1, Math.ceil(esatto)),
    esatto: Math.round(esatto * 100) / 100,
    copertura, consegna: c, sicurezza: s,
  };
}

// La proposta per tutto il magazzino: per ogni ricambio la soglia che ha
// adesso, quella che verrebbe fuori dai consumi, e quanti pezzi mancano per
// arrivarci. Chi non ha consumi registrati resta a parte: non si propone
// niente per un pezzo che non si sa quanto si usi. Pura e testabile.
export function propostaScorte(ricambi, interventi, opzioni) {
  const o = opzioni || {};
  const cons = consumoRicambi(interventi, o.finestraGiorni || 180, o.oggi || new Date());
  const perId = new Map(), perNome = new Map();
  for (const r of cons.righe) {
    if (r.id) perId.set(r.id, r);
    perNome.set(r.nome.toLowerCase(), r);
  }
  const righe = [], senzaConsumo = [];
  for (const r of ricambi || []) {
    const uso = perId.get(r.id) || perNome.get(String(r.nome || "").trim().toLowerCase()) || null;
    const pr = uso ? puntoDiRiordino(uso.alGiorno, o.consegnaGiorni, o.sicurezzaGiorni) : null;
    const base = {
      id: r.id, nome: r.nome, giacenza: +r.giacenza || 0, sogliaAttuale: +r.sogliaMin || 0,
      prezzo: +r.prezzo > 0 ? +r.prezzo : null,
      pezzi: uso ? uso.pezzi : 0, episodi: uso ? uso.episodi : 0,
      alGiorno: uso ? uso.alGiorno : 0, affidabile: uso ? uso.affidabile : false,
    };
    if (!pr) { senzaConsumo.push(base); continue; }
    const daOrdinare = Math.max(0, pr.soglia - base.giacenza);
    righe.push({ ...base, sogliaProposta: pr.soglia, esatto: pr.esatto, copertura: pr.copertura,
      differenza: pr.soglia - base.sogliaAttuale, daOrdinare,
      spesa: base.prezzo != null ? Math.round(daOrdinare * base.prezzo * 100) / 100 : null,
      sotto: base.giacenza <= pr.soglia });
  }
  righe.sort((a, b) => (b.daOrdinare - a.daOrdinare) || (b.alGiorno - a.alGiorno) || a.nome.localeCompare(b.nome, "it"));
  senzaConsumo.sort((a, b) => a.nome.localeCompare(b.nome, "it"));
  return {
    righe, senzaConsumo, finestra: cons.finestra, da: cons.da, a: cons.a,
    interventi: cons.interventi, daInterventiVecchi: cons.daInterventiVecchi,
    consegna: Math.round(+o.consegnaGiorni || 0), sicurezza: Math.max(0, Math.round(+o.sicurezzaGiorni || 0)),
    daOrdinare: righe.filter(r => r.daOrdinare > 0).length,
    spesaTotale: Math.round(righe.reduce((t, r) => t + (r.spesa || 0), 0) * 100) / 100,
  };
}

// ============================================================
// L6 — FERMI MACCHINA E AFFIDABILITÀ
// «Quanto è stata ferma questa macchina, e perché». Finora Flotta sapeva
// dire solo com'è messo il parco ADESSO (mezzi.stato) e quanti mezzi erano
// operativi nei giorni in cui qualcuno ha aperto l'app: due fotografie, non
// una misura. Il fermo è un fatto con un inizio, una fine e una causa, e da
// quello — solo da quello — si ricava la disponibilità vera:
//     giorni-macchina persi / giorni-macchina disponibili.
// Niente medie di comodo: un fermo ancora aperto conta fino a oggi, un fermo
// più vecchio della finestra guardata conta solo per la parte che ci sta
// dentro, e un mezzo uscito dal parco non fa media con quelli che ci sono.
// ============================================================
export const CAUSALI_FERMO = [
  { chiave: "guasto-meccanico", etichetta: "Guasto meccanico", nota: "Motore, trasmissione, organi meccanici." },
  { chiave: "guasto-idraulico", etichetta: "Guasto idraulico", nota: "Pompe, cilindri, tubi, distributori." },
  { chiave: "guasto-elettrico", etichetta: "Guasto elettrico o elettronico", nota: "Impianto, centralina, sensori." },
  { chiave: "gomme-cingoli", etichetta: "Gomme o cingoli", nota: "Foratura, tagli, sottocarro." },
  { chiave: "attesa-ricambi", etichetta: "Attesa ricambi", nota: "La macchina è pronta a essere riparata, manca il pezzo." },
  { chiave: "manutenzione", etichetta: "Manutenzione programmata", nota: "Tagliando o intervento previsto: è un fermo, ma è un fermo scelto." },
  { chiave: "verifica", etichetta: "Verifica o revisione", nota: "Verifica periodica, revisione, controllo dell'ente." },
  { chiave: "operatore", etichetta: "Manca l'operatore", nota: "La macchina è a posto: non c'è chi la usa." },
  { chiave: "altro", etichetta: "Altro motivo", nota: "Scrivi nelle note di cosa si è trattato." },
];

export function causaleFermo(chiave) {
  return CAUSALI_FERMO.find(c => c.chiave === chiave) || null;
}
export function etichettaCausale(chiave) {
  const c = causaleFermo(chiave);
  return c ? c.etichetta : (String(chiave || "").trim() || "Motivo non indicato");
}

// GIORNI DI FERMO di un episodio dentro la finestra [da, a] (estremi
// compresi). Conteggio a giornate INTERE e INCLUSIVE: una macchina ferma il
// 3 e ripartita il 3 è stata ferma un giorno, non zero — in cava una
// giornata persa è persa tutta. Un fermo ancora aperto conta fino alla fine
// della finestra (cioè fino a oggi). Ritorna 0 se non si sovrappone. Pura.
export function giorniFermo(fermo, da, a) {
  const f = fermo || {};
  const i = isoGiorno(f.inizio), fin = isoGiorno(f.fine);
  const d0 = isoGiorno(da), d1 = isoGiorno(a);
  if (!i || !d0 || !d1) return 0;
  const inizio = i > d0 ? i : d0;
  const fine = (fin && fin < d1) ? fin : d1;
  if (fine < inizio) return 0;
  return giorniFra(inizio, fine) + 1;
}

// Durata di un fermo così com'è, senza finestre: quello che si scrive sulla
// riga. Un fermo aperto conta fino a oggi e lo dichiara. Pura.
export function durataFermo(fermo, oggi = new Date()) {
  const f = fermo || {};
  const i = isoGiorno(f.inizio);
  if (!i) return { giorni: null, aperto: !f.fine, fine: null };
  const oggiI = oggiIso(oggi);
  const fin = isoGiorno(f.fine);
  const fine = fin || oggiI;
  if (fine < i) return { giorni: null, aperto: !fin, fine: fin };
  return { giorni: giorniFra(i, fine) + 1, aperto: !fin, fine: fin };
}

// Controlli su un fermo prima di salvarlo. Pura e testabile: `oggi` iniettabile.
export function validaFermo(dati, oggi = new Date()) {
  const d = dati || {}, errori = {};
  const oggiI = oggiIso(oggi);
  if (!String(d.mezzo || "").trim()) errori.mezzo = "Scegli il mezzo che si è fermato.";
  if (!String(d.causale || "").trim()) errori.causale = "Scegli il motivo del fermo.";
  const inizio = isoGiorno(d.inizio);
  if (!inizio) errori.inizio = "Serve il giorno in cui la macchina si è fermata.";
  else if (giorniFra(oggiI, inizio) > 0) errori.inizio = "Il fermo non può cominciare domani: metti oggi o un giorno passato.";
  else if (giorniFra(inizio, oggiI) > 3650) errori.inizio = "Data troppo indietro nel tempo (oltre 10 anni fa): controlla l'anno.";
  let fine = null;
  const finTx = String(d.fine == null ? "" : d.fine).trim();
  if (finTx !== "") {
    fine = isoGiorno(finTx);
    if (!fine) errori.fine = "La data di ripartenza non è valida.";
    else if (inizio && fine < inizio) errori.fine = "La macchina non può essere ripartita prima di essersi fermata.";
    else if (giorniFra(oggiI, fine) > 0) errori.fine = "La ripartenza non può essere nel futuro: lascia vuoto finché la macchina è ferma.";
  }
  return { ok: Object.keys(errori).length === 0, errori, inizio: inizio || null, fine: errori.fine ? null : fine };
}

// I fermi ORDINATI come servono a chi guarda: prima quelli ancora aperti (dal
// più lungo), poi i chiusi dal più recente. Ognuno arricchito con durata,
// stato e etichetta della causale. Pura.
export function fermiOrdinati(fermi, oggi = new Date()) {
  return (fermi || []).map(f => {
    const d = durataFermo(f, oggi);
    return { ...f, giorni: d.giorni, aperto: d.aperto, causaleTx: etichettaCausale(f.causale) };
  }).sort((a, b) =>
    (a.aperto === b.aperto ? 0 : a.aperto ? -1 : 1)
    || (a.aperto ? (b.giorni || 0) - (a.giorni || 0)
                 : String(b.inizio || "").localeCompare(String(a.inizio || "")))
    || String(a.mezzo || "").localeCompare(String(b.mezzo || ""), "it"));
}

// AFFIDABILITÀ DEL PARCO su una finestra di giorni (di norma 30).
// Come si calcola la disponibilità REALE, in una riga: si contano i
// giorni-macchina disponibili (mezzi del parco × giorni della finestra) e si
// tolgono i giorni-macchina persi per fermo. È un conto che chiunque può
// rifare a mano, ed è per questo che l'app lo scrive per esteso.
// Regole di onestà:
//  · i fermi dei mezzi che NON sono più nel parco non entrano nella media —
//    non hanno un denominatore — ma vengono contati a parte e dichiarati;
//  · i giorni persi si tagliano alla finestra: un fermo di due mesi pesa,
//    su trenta giorni, per i trenta giorni che ci stanno dentro;
//  · il tempo medio fra un fermo e l'altro si scrive solo da due episodi in
//    su: con un fermo solo non esiste un «fra».
// Pura e testabile: `oggi` iniettabile.
export function affidabilitaFlotta(fermi, mezzi, giorni = 30, oggi = new Date()) {
  const finestra = Math.max(1, Math.round(+giorni || 30));
  const a = oggiIso(oggi);
  const da = oggiIso(new Date(Date.parse(a + "T12:00:00Z") - (finestra - 1) * 86400000));
  const inParco = new Map();
  for (const m of mezzi || []) {
    const n = nomeBreve(m.nome);
    if (n) inParco.set(n, m);
  }
  const perMezzo = new Map();
  const perCausale = new Map();
  let persi = 0, episodi = 0, aperti = 0, fuoriParco = 0, fuoriParcoGiorni = 0;
  for (const f of fermi || []) {
    const nome = nomeBreve(f.mezzo);
    const g = giorniFermo(f, da, a);
    if (!nome || g <= 0) continue;
    const aperto = !isoGiorno(f.fine);
    if (!inParco.has(nome)) { fuoriParco++; fuoriParcoGiorni += g; continue; }
    persi += g; episodi++; if (aperto) aperti++;
    const v = perMezzo.get(nome) || { mezzo: nome, giorni: 0, episodi: 0, aperti: 0, causali: new Set() };
    v.giorni += g; v.episodi++; if (aperto) v.aperti++;
    v.causali.add(etichettaCausale(f.causale));
    perMezzo.set(nome, v);
    const c = etichettaCausale(f.causale);
    const cv = perCausale.get(c) || { causale: c, giorni: 0, episodi: 0 };
    cv.giorni += g; cv.episodi++;
    perCausale.set(c, cv);
  }
  const parco = inParco.size;
  const giorniMacchina = parco * finestra;
  const disponibili = Math.max(0, giorniMacchina - persi);
  const pct = giorniMacchina ? Math.round(1000 * disponibili / giorniMacchina) / 10 : null;
  const mezziLista = [...perMezzo.values()]
    .map(v => ({ ...v, causali: [...v.causali],
      pct: finestra ? Math.round(1000 * Math.max(0, finestra - v.giorni) / finestra) / 10 : null,
      durataMedia: v.episodi ? Math.round(10 * v.giorni / v.episodi) / 10 : null }))
    .sort((x, y) => y.giorni - x.giorni || y.episodi - x.episodi || x.mezzo.localeCompare(y.mezzo, "it"));
  return {
    finestra, da, a, parco, giorniMacchina, persi, disponibili, pct,
    episodi, aperti, mezzi: mezziLista,
    senzaFermi: Math.max(0, parco - mezziLista.length),
    causali: [...perCausale.values()].sort((x, y) => y.giorni - x.giorni || x.causale.localeCompare(y.causale, "it")),
    // durata media di un fermo (MTTR in giorni) e giorni di lavoro fra un
    // fermo e l'altro (MTBF semplificato). Null quando non hanno senso.
    durataMedia: episodi ? Math.round(10 * persi / episodi) / 10 : null,
    fraUnFermoELaltro: episodi >= 2 ? Math.round(10 * disponibili / episodi) / 10 : null,
    fuoriParco, fuoriParcoGiorni,
  };
}

// ══════════════════════════════════════════════════════════════════════
// TAGLIANDI IN SCADENZA — la tessera in cima al Quadro, resa onesta
// Da quando un tagliando si programma in DUE modi (a calendario e a ore
// del contatore), contare solo quelli a data è una bugia per DIFETTO: chi
// guarda la tessera crede di avere metà del lavoro che ha davvero, e non
// ordina i pezzi.
// Un tagliando a ore però NON ha una data: per sapere se cade nei
// prossimi 30 giorni serve il RITMO d'uso di quel mezzo (ore motore al
// giorno). E quel ritmo non si inventa: si MISURA sui contatori che
// l'app ha già: i rifornimenti (L4) e i giri macchina (L2) portano
// entrambi la lettura del contatore con la sua data.
// Dove il ritmo non si può misurare la tessera NON tira a indovinare:
// quei tagliandi vanno in un conto A PARTE, dichiarato accanto al numero.
// Meglio «3, più 1 che non so collocare» che un 4 che nessuno può
// verificare — e meglio ancora di un 3 che nasconde l'esistenza del quarto.
// Regole del ritmo, e perché sono queste:
//  · servono ALMENO DUE letture del contatore sullo stesso mezzo (una sola
//    fissa il punto di partenza e basta);
//  · devono coprire almeno METÀ dell'orizzonte da stimare (15 giorni per
//    stimarne 30). Proiettare 30 giorni da una finestra di 3 non è una
//    stima, è una moltiplicazione per dieci di quello che si è visto: in
//    cava tre giorni possono essere di pioggia, di fermo o di doppio turno;
//  · le ore devono essere AUMENTATE fra la prima e l'ultima lettura;
//  · l'ultima lettura non può essere più vecchia dell'orizzonte: un ritmo
//    tratto da letture di tre mesi fa racconta un altro periodo.
// Un tagliando a ore GIÀ SCADUTO (mancano ≤ 0) entra nel conto senza
// bisogno di nessuna stima: è da fare adesso, non «fra N giorni».
// Tutto puro e testabile.
// ══════════════════════════════════════════════════════════════════════
export const ORIZZONTE_TAGLIANDI = 30;

// Ritmo d'uso misurato, mezzo per mezzo, dalle letture del contatore
// ({ mezzo, data, ore }: rifornimenti e giri macchina hanno già questa
// forma). Ritorna una riga per mezzo con `oreGiorno` — oppure `oreGiorno:
// null` e il `perche` scritto in italiano, da mostrare all'utente.
export function ritmoOreMezzi(letture, oggi = new Date(), orizzonte = ORIZZONTE_TAGLIANDI) {
  const minGiorni = Math.max(2, Math.ceil((+orizzonte || ORIZZONTE_TAGLIANDI) / 2));
  const per = new Map();
  for (const l of letture || []) {
    const mezzo = nomeBreve(l && l.mezzo);
    const g = isoGiorno(l && l.data);
    const ore = +((l || {}).ore);
    if (!mezzo || !g) continue;
    if (!Number.isFinite(ore) || ore <= 0) continue;
    if (giorniTra(g, oggi) > 0) continue;          // contatore datato nel futuro: non è un fatto
    const v = per.get(mezzo) || { mezzo, punti: [] };
    v.punti.push({ data: g, ore });
    per.set(mezzo, v);
  }
  const out = [];
  for (const v of per.values()) {
    const p = v.punti.slice().sort((a, b) => a.data.localeCompare(b.data) || a.ore - b.ore);
    const primo = p[0], ultimo = p[p.length - 1];
    const r = { mezzo: v.mezzo, letture: p.length, oreGiorno: null, giorniCoperti: null,
      dal: primo.data, al: ultimo.data, eta: -giorniTra(ultimo.data, oggi), perche: "" };
    if (p.length < 2) {
      r.perche = "c'è una sola lettura del contatore: per sapere quante ore fa al giorno ne serve una seconda";
      out.push(r); continue;
    }
    const giorni = giorniFra(primo.data, ultimo.data);
    const dOre = ultimo.ore - primo.ore;
    r.giorniCoperti = giorni;
    if (giorni < minGiorni) {
      r.perche = "le letture del contatore coprono " + giorni + (giorni === 1 ? " giorno" : " giorni")
        + ": per stimare " + orizzonte + " giorni servono almeno " + minGiorni;
      out.push(r); continue;
    }
    if (dOre <= 0) {
      r.perche = "fra la prima e l'ultima lettura il contatore non è salito";
      out.push(r); continue;
    }
    if (r.eta > orizzonte) {
      r.perche = "l'ultima lettura del contatore è di " + r.eta + " giorni fa: quel ritmo racconta un periodo passato, non questo";
      out.push(r); continue;
    }
    r.oreGiorno = Math.round(100 * dOre / giorni) / 100;
    r.oreCoperte = dOre;
    out.push(r);
  }
  return out.sort((a, b) => a.mezzo.localeCompare(b.mezzo, "it"));
}

// Il ritmo di UN mezzo dentro l'elenco (o null se quel mezzo non c'è).
export function ritmoDelMezzo(ritmi, nomeMezzo) {
  const n = nomeBreve(nomeMezzo);
  return (ritmi || []).find(r => r.mezzo === n) || null;
}

// I tagliandi che cadono entro l'orizzonte, contati su ENTRAMBI i modi di
// programmarli. Ritorna { orizzonte, totale, aData, aOre, nonStimabili,
// voci, daStimare, ritmi } — `totale` è quello che va sulla tessera,
// `nonStimabili` è quello che la tessera deve dichiarare accanto.
export function tagliandiInScadenza(manutenzioni, mezzi, letture, oggi = new Date(), orizzonte = ORIZZONTE_TAGLIANDI) {
  const oriz = +orizzonte || ORIZZONTE_TAGLIANDI;
  const ritmi = ritmoOreMezzi(letture, oggi, oriz);
  const contatoreDi = (nome) => {
    const m = (mezzi || []).find(x => nomeBreve(x.nome) === nome);
    /* «zero ore» e «non lo so» sono due cose diverse: con `|| 0` un mezzo
       senza contatore diventava un mezzo nuovo di fabbrica, e il tagliando
       sembrava lontano. Ora chi non ha il contatore torna null, e chi chiama
       lo manda fra quelli «da stimare» spiegando perché. */
    return m && Number.isFinite(+m.ore) ? +m.ore : null;
  };
  const voci = [], daStimare = [];
  for (const n of manutenzioni || []) {
    const mezzo = nomeBreve(n && n.mezzo);
    const base = { id: (n && n.id) || "", titolo: (n && n.titolo) || "Manutenzione", mezzo };
    // Come in prioritaOperative e nella lista Manutenzioni: se un tagliando
    // ha le ore, sono le ore a comandare. Un solo criterio in tutta l'app.
    if (+(n && n.orePreviste) > 0) {
      const ore = contatoreDi(mezzo);
      if (ore == null) {
        daStimare.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: null,
          perche: "il mezzo «" + mezzo + "» non è nel parco: il suo contatore non si può leggere" });
        continue;
      }
      const u = urgenzaOre(+n.orePreviste, ore);
      if (u.mancano <= 0) {                     // già oltre le ore: è da fare adesso
        voci.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: u.mancano, giorni: 0, scaduto: true });
        continue;
      }
      const r = ritmoDelMezzo(ritmi, mezzo);
      const gg = previsioneGiorni(u.mancano, r ? r.oreGiorno : null);
      if (gg == null) {
        daStimare.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: u.mancano,
          perche: r ? r.perche : "di questo mezzo non c'è nessuna lettura del contatore con la sua data" });
        continue;
      }
      if (gg <= oriz) voci.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: u.mancano,
        giorni: gg, scaduto: false, oreGiorno: r.oreGiorno });
      continue;
    }
    const d = isoGiorno(n && n.dataPrevista);
    if (!d) continue;                            // né data né ore: non è programmato
    const g = giorniTra(d, oggi);
    if (g <= oriz) voci.push({ ...base, via: "data", dataPrevista: d, giorni: g, scaduto: g < 0 });
  }
  const aData = voci.filter(v => v.via === "data").length;
  const aOre = voci.filter(v => v.via === "ore").length;
  return {
    orizzonte: oriz, totale: voci.length, aData, aOre,
    nonStimabili: daStimare.length,
    voci: voci.sort((a, b) => (a.giorni ?? 9999) - (b.giorni ?? 9999) || a.mezzo.localeCompare(b.mezzo, "it")),
    daStimare, ritmi,
  };
}

// KPI di testa del Quadro.
// La firma a TRE argomenti è quella storica e resta identica, valore per
// valore: `tagliandi30` conta i soli tagliandi a data. Chi passa anche
// `opts` (con le letture del contatore) ottiene il conto ONESTO — i
// tagliandi a data più quelli a ore che cadono nell'orizzonte — e in
// `tagliandi` la scomposizione, compreso quello che non si è potuto
// collocare. Due firme e non una perché la tessera vecchia non deve
// cambiare numero da sola: cambia quando le si danno i dati per farlo.
export function kpiFrom(mezzi, manutenzioni, costi, opts) {
  const base = {
    operativi: mezzi.filter(m => m.stato === "operativo").length,
    inManutenzione: mezzi.filter(m => m.stato !== "operativo").length,
    tagliandi30: manutenzioni.filter(n => { const g = urgenza(n.dataPrevista).giorni; return g <= 30; }).length,
    carburante: costi.filter(c => /carburante/i.test(c.voce)).reduce((t, c) => t + (+c.importo || 0), 0),
  };
  if (!opts) return base;
  const t = tagliandiInScadenza(manutenzioni, mezzi, opts.letture || [],
    opts.oggi || new Date(), opts.orizzonte || ORIZZONTE_TAGLIANDI);
  return { ...base, tagliandi30: t.totale, tagliandi: t };
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
        mezzi: () => read("mezzi"), manutenzioni: () => read("manutenzioni"), costi: () => read("costi"), ricambi: () => read("ricambi"), interventi: () => read("interventi"), scadenze: () => read("scadenze"), disponibilita: () => read("disponibilita"), controlli: () => read("controlli"), rifornimenti: () => read("rifornimenti"), fermi: () => read("fermi"),
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
      mezzi: async () => mem.mezzi, manutenzioni: async () => mem.manutenzioni, costi: async () => mem.costi, ricambi: async () => mem.ricambi, interventi: async () => mem.interventi, scadenze: async () => mem.scadenze, disponibilita: async () => mem.disponibilita || [], controlli: async () => mem.controlli || [], rifornimenti: async () => mem.rifornimenti || [], fermi: async () => mem.fermi || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
