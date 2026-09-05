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
//                      ("controllo" = giro macchina, "guasto" = segnalazione
//                      rapida di chi sta sulla macchina, "piano" = tagliando
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

/* la regola sui numeri dichiarati vive in `shared/`: qui si IMPORTA, non si
   riscrive — è il difetto che questo repository ha già pagato quattro volte */
import { numeroDichiarato, applicaPercorsi, traduciCancellazioni, voceCosto, statoScadenza } from "../../shared/dw-ponti.js";
import { parseCsvLine, csvCell, numIt, giorniTra, isIntestazione, numeroScritto, oggiISO,
         dataISOEsiste, dataIt, plurale,
         messaggioNumero as messaggioNumeroShell,
         perCampo as perCampoShell,
         AVVISO_DECIMALE as AVVISO_DECIMALE_SHELL,
         AVVISO_MIGLIAIA as AVVISO_MIGLIAIA_SHELL, perLettura, mappaColonne } from "../../shared/deepwork-id-client/dw-shell.js";

// Data di oggi in formato ISO (aaaa-mm-gg) nel fuso dell'utente: la stessa
// che scrive l'app quando registra la fotografia del giorno.
// Era la SETTIMA copia della stessa regola — l'ha trovata la regola 15 di
// run-stile.mjs, non una lettura del codice. Adesso è un ALIAS di quella in
// shared/: le pagine di Flotta continuano a chiamarla `oggiIso`.
export const oggiIso = oggiISO;
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
// ⛔ RI-ESPORTATE, non ridichiarate. Erano scritte qui alla lettera e la
// frase delle migliaia era diversa da quella dello shell: la stessa cosa
// sbagliata riceveva due spiegazioni. Un alias non è una seconda
// implementazione. Vedi docs/NUMERI_MESSAGGIO_DOPPIO_202608.md
export const AVVISO_DECIMALE = AVVISO_DECIMALE_SHELL;
export const AVVISO_MIGLIAIA = AVVISO_MIGLIAIA_SHELL;

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
// ⛔ RI-ESPORTATA, non riscritta. Era scritta qui e nello shell IDENTICA
// carattere per carattere, e nessun controllo poteva vederlo: quello sui nomi
// doppi confrontava le app FRA LORO, e Flotta è l'unica app che la esporta.
// Oggi fanno la stessa cosa; domani una cambia e l'altra no — e quando
// divergeranno non ci sarà nessun errore, solo un campo che rifiuta un numero
// che aveva proposto lui. Vedi docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md
export const perCampo = perCampoShell;

// Come si LEGGE un numero dentro un messaggio a schermo: all'italiana e CON
// il punto delle migliaia, che è come si scrive un migliaio in Italia. È il
// contrario di perCampo, e la differenza non è un vezzo: dentro un campo il
// punto delle migliaia rientrerebbe come ambiguo, dentro una frase serve.
// ⛔ ERA UNA COPIA, ORA È `perLettura` DI `shared/` (07/08). Le due ragioni
// scritte qui restano vere e stanno lì: `useGrouping` a mano (al default Node
// non raggruppa le quattro cifre e Chromium sì), e un valore non leggibile che
// risponde "" e non "0".
// ⚠️ E questa copia era GIÀ DIVERGENTE dalla gemella di Campo, che è il motivo
// per cui la regola «una regola che serve a due app vive in shared/» pretende
// l'identità e non il comportamento: `Number.isFinite(+v)` con `v = null` dà
// **true** (`+null` è 0), quindi qui un dato che manca usciva **«0»** mentre in
// Campo usciva "". Nessuna delle quattro chiamate le passa un `null` — tutte e
// quattro sono guardate a monte, verificato una per una — quindi non era ancora
// un difetto: era la trappola pronta, del tipo che questo file ha già pagato
// tre volte.
const mostra = perLettura;

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
/* ⛔ UN ALIAS, non una seconda implementazione. Questa funzione era scritta
   due volte — qui e nello shell — e su dieci casi provati TRE messaggi erano
   diversi, con ognuna delle due migliore dell'altra in un punto: qui la frase
   dell'ambiguo diceva anche come si scrive, là uno zero scritto si vedeva
   («hai scritto «0»» invece di «hai scritto «»»). Adesso ce n'è una sola, con
   il meglio delle due. docs/NUMERI_MESSAGGIO_DOPPIO_202608.md */
export const messaggioNumero = messaggioNumeroShell;

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
    // n1 porta `scrittaIl` (04/09): è il giorno del tagliando precedente (w1,
    // 10/07), quando questo è stato pianificato. Senza azzeramenti sul mezzo
    // il campo non si legge; con uno, dice su quale contatore sono le 6.000 h.
    // n5 e n6 restano SENZA di proposito: sono i tagliandi «in archivio prima
    // che la data esistesse».
    { id: "n1", titolo: "Tagliando 500h", mezzo: "Escavatore E1", dataPrevista: null, orePreviste: 6000, ogniOre: 500, piano: "500", ricambioId: "p1", scrittaIl: "2026-07-10" },
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
  // ⛔ E r10 È IL PIENO SENZA IL PREZZO (07/08). Fino a stamattina qui ogni
  //    pieno portava la sua spesa, quindi il caso che il prodotto sa già
  //    raccontare — la spesa del rifornimento è FACOLTATIVA in
  //    `validaRifornimento`, e da lì scendono `senzaSpesa`, il denominatore
  //    del €/l e `pieniSenzaEuro` — non si vedeva **mai** aprendo l'app: si
  //    misurava solo nelle prove, con dati inventati lì per lì. Un campo
  //    assente non è un refuso, è uno stato del prodotto, e metterlo nella
  //    dimostrazione è il modo di mostrarlo (quello che la dimostrazione non
  //    deve contenere è il dato CORROTTO, tipo «2026-13-45»).
  //    È sull'Escavatore E2 di proposito: la sua unica lettura del contatore
  //    resta una, quindi il caso «consumo non ancora calcolabile» qui sopra
  //    non si perde, e la riga della schermata Carburante fa vedere la cosa
  //    che conta — 580 litri messi, 450 € conosciuti, e il €/l che resta
  //    **1,500** perché si divide per i litri che un prezzo ce l'hanno, con
  //    accanto scritto in rosso che un pieno la spesa non ce l'ha.
  //    Il perché suona vero in cava: alla cisterna del piazzale il contalitri
  //    della pompa dice i litri, il prezzo lo dirà la fattura del gasolio a
  //    fine mese. `euro: 0` e non `null` perché è esattamente quello che la
  //    pagina salva quando il campo si lascia vuoto.
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
    { id: "r10", data: isoIndietro(1), mezzo: "Escavatore E2", litri: 280, euro: 0, ore: null, nota: "cisterna interna, fattura non ancora arrivata", costoId: null },
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
  // IL REGISTRO COSTI DELLA CAVA COME LO TIENE CONTI (solo per la modalità
  // dimostrativa): in un'organizzazione vera arriva dall'app Conti, che scrive
  // la voce con la CHIAVE di `VOCI_COSTO` («carburante»), non col nome libero
  // che si scrive qui. I casi sono DECISI, non sorteggiati, e ognuno serve a
  // far vedere una riga della schermata Costi:
  //  · k1 è LO STESSO gasolio di c1 qui sopra: stessa data, stesso importo,
  //    alla cifra. È l'euro contato due volte, e nell'elenco c1 prende il
  //    contrassegno «anche in Conti»;
  //  · k2 è un'officina esterna che in Conti c'è e qui NO: Conti ne sa di più
  //    su quella voce, e il confronto lo dice senza accusare nessuno;
  //  · k3 è SENZA data: entra nel totale di Conti ma non si può confrontare
  //    alla cifra, e va detto invece di farla sparire;
  //  · k4 non è una voce da mezzo (personale): resta fuori dal confronto per
  //    costruzione, come vuole la bandiera `daMezzo` di shared/.
  // I noleggi restano SOLO qui (c3, c5): Conti risponde «—», non zero.
  costiConti: [
    { id: "k1", data: "2026-07-06", voce: "carburante", importo: 8400, nota: "Gasolio, fattura del distributore" },
    { id: "k2", data: "2026-07-20", voce: "manutenzione", importo: 640, nota: "Officina esterna, fattura di luglio" },
    { id: "k3", voce: "carburante", importo: 500, nota: "Buono gasolio senza data" },
    { id: "k4", data: "2026-07-03", voce: "personale", importo: 5500, nota: "Squadra di fronte, luglio" },
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
  /* il verdetto lo decide la regola condivisa (`statoScadenza`, dal 02/09: era
     la stessa regola scritta tre volte in tre app); qui restano il vocabolario
     di Flotta («a-posto», «senza-data») e il colore, che il giorno stesso è
     rosso: una revisione che scade oggi non è un avviso, è oggi */
  const st = statoScadenza(dataISO, oggi, preavvisoGiorni);
  if (st === "senza data") return { stato: "senza-data", cls: "warn", label: "senza data", giorni: null };
  const g = giorniTra(String(dataISO).slice(0, 10), oggi);
  if (st === "scaduta") return { stato: "scaduta", cls: "danger", label: "scaduta da " + (-g) + " gg", giorni: g };
  if (g === 0) return { stato: "in-scadenza", cls: "danger", label: "scade oggi", giorni: 0 };
  if (st === "in-scadenza") return { stato: "in-scadenza", cls: "warn", label: "tra " + g + " gg", giorni: g };
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
export function contaScadenzeMezzi(scadenze, oggi = new Date(), preavvisoGiorni = 30, parcoMezzi = null) {
  const c = { scadute: 0, inScadenza: 0, aPosto: 0, totale: 0, mezzi: 0 };
  const mezzi = new Set();
  const coperti = new Set();
  for (const s of scadenze || []) {
    c.totale++;
    if (s.mezzo) { mezzi.add(String(s.mezzo)); coperti.add(nomeBreve(s.mezzo)); }
    const st = statoScadenzaMezzo(s.dataScadenza, oggi, preavvisoGiorni).stato;
    if (st === "scaduta") c.scadute++;
    else if (st === "in-scadenza" || st === "senza-data") c.inScadenza++;
    else c.aPosto++;
  }
  c.mezzi = mezzi.size;
  /* ⛔ UN MEZZO SENZA NESSUNA RIGA IN SCADENZARIO NON È UN MEZZO A POSTO.
     È la stessa cosa che Scudo ha scritto per i requisiti, e qui mancava: col
     parco di sei macchine e le scadenze registrate su UNA sola, il Quadro
     scriveva «Tutte a posto: 2 scadenze su 1 mezzo, nessuna entro 30 giorni»
     — misurato aprendo la pagina. Cinque macchine su sei non hanno nessuna
     verifica periodica, nessuna assicurazione, nessuna revisione registrata, e
     la riga che le riguarda dice la frase più tranquilla che sa dire.
     Il parco è FACOLTATIVO: chi non lo passa ha esattamente il comportamento
     di prima (`parco` e `senzaNessuna` restano `null`, cioè «non l'ho
     guardato»), e non zero, che vorrebbe dire «li ho guardati e sono tutti
     coperti». */
  c.parco = null; c.senzaNessuna = null;
  if (Array.isArray(parcoMezzi)) {
    const nomi = parcoMezzi.map(m => nomeBreve(m && m.nome)).filter(Boolean);
    c.parco = nomi.length;
    c.senzaNessuna = nomi.filter(n => !coperti.has(n)).length;
  }
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
/* LE COLONNE DELLA TELEMETRIA, PER NOME (05/09, candidato (c) della ricerca).
   Un export Piusi/Gilbarco/VisionLink non si chiama «mezzo;ore;carburante»:
   si chiama «Asset;Engine Hours;Fuel (l)», o «Targa;Contatore;Litri». La
   mappa la fa `mappaColonne` di `shared/` (la stessa domanda di Conti); qui
   solo gli INDIZI. Il carburante è facoltativo; l'intestazione «vale» quando
   ha mezzo e ore, e allora comandano i nomi — se no, la posizione di sempre. */
export const INDIZI_TELEMETRIA = {
  mezzo: ["mezzo", "targa", "veicolo", "macchina", "asset", "unit", "equipment", "machine", "vehicle", "nome"],
  ore: ["ore motore", "ore", "engine hours", "hours", "hour meter", "smu", "contatore", "hrs"],
  carburante: ["carburante", "litri", "gasolio", "diesel", "fuel", "rifornimento", "quantita", "erogato"],
};
export function mappaTelemetriaCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  return mappaColonne(righe.length ? parseCsvLine(righe[0]) : [], INDIZI_TELEMETRIA,
    { facoltative: ["carburante"], conIntestazione: (ix) => ix.mezzo >= 0 && ix.ore >= 0 });
}
export function parseTelemetriaCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  const m = righe.length ? mappaTelemetriaCsv(text) : null;
  const perNome = !!(m && m.conIntestazione);
  return righe
    .filter((r, i) => !(perNome && i === 0) && !isIntestazione(r, "mezzo"))
    .map(r => {
      const c = parseCsvLine(r);
      const g = (campo, pos) => { const i = perNome ? m.indici[campo] : pos; return i >= 0 && i < c.length ? c[i] : undefined; };
      const mezzo = g("mezzo", 0), ore = g("ore", 1), carburante = g("carburante", 2);
      return {
        mezzo: (mezzo || "").trim(),
        ore: numIt(ore),
        carburante: (carburante != null && String(carburante).trim() !== "") ? numIt(carburante) : null,
      };
    })
    .filter(p => p.mezzo && Number.isFinite(p.ore) && p.ore >= 0);
}

/* ⛔ «E LE RIGHE CHE NON SONO ENTRATE?» — IL LETTORE LE CANCELLA E LA PAGINA
   NON POTREBBE DIRLO NEMMENO VOLENDO: il `.filter` sta DENTRO, e chi chiama
   riceve solo i sopravvissuti. È l'assenza di un dato nella sua forma più
   tranquilla — il principio del fondatore applicato all'INGRESSO invece che
   all'uscita — e qui morde più che altrove: il messaggio della telemetria
   contava già le «righe ignorate», ma su quelle SOPRAVVISSUTE al lettore. Una
   riga con le ore illeggibili spariva prima di essere contata, quindi il conto
   più onesto della pagina era quello che nascondeva di più.
   La forma è quella di `rientroRilievi` in Terra, che fa la stessa domanda
   nell'altro verso: `persi: [{ nome, ragione }]`; i conti si chiamano `lette`
   ed `entrano` perché il file è di qualcun altro.
   ⛔ IL VERDETTO NON SI RISCRIVE: lo si chiede al lettore riga per riga. La
   scala delle ragioni SPIEGA e basta, e quando non sa spiegare dice «il
   lettore la scarta».
   ⛔ E LA RIGA TUTTA VUOTA NON È UNA PERDITA: un foglio di calcolo salva le
   righe di coda come `;;;`. Si contano a parte (`vuote`) e non si dicono. */
export function scartiTelemetriaCsv(text) {
  const tutte = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean);
  /* con l'intestazione per nome ogni riga si giudica INSIEME alla testa, se no
     il lettore la leggerebbe per posizione e direbbe una ragione sbagliata */
  const m = tutte.length ? mappaTelemetriaCsv(text) : null;
  const perNome = !!(m && m.conIntestazione);
  const testa = perNome ? tutte[0] : (tutte.find(r => isIntestazione(r, "mezzo")) || "");
  const righe = tutte.filter((r, i) => !(perNome && i === 0) && !isIntestazione(r, "mezzo"));
  const persi = [];
  let nRiga = 0;
  let vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseTelemetriaCsv(testa ? testa + "\n" + riga : riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    const g = (campo, pos) => { const i = perNome ? m.indici[campo] : pos; return i >= 0 && i < c.length ? String(c[i] == null ? "" : c[i]).trim() : ""; };
    const mezzo = g("mezzo", 0), ore = g("ore", 1), n = numIt(ore);
    persi.push({
      nome: mezzo || "riga " + nRiga,
      ragione: !mezzo ? "manca il nome del mezzo"
        : !ore ? "le ore motore non sono state scritte"
        : !Number.isFinite(n) ? "le ore motore non si leggono"
        : n < 0 ? "le ore motore sono negative"
        : "il lettore la scarta",
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
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

/* ⛔ E I RICAMBI CHE NON SONO ENTRATI? (13/08) Il `.filter` sta DENTRO il
   lettore, come negli altri otto: chi carica un magazzino di trecento righe e
   ne vede duecentonovantotto non sa quali due mancano né perché.
   ⚠️ E le tre decisioni scritte qui sopra dicono da sole quale sia l'UNICA
   cosa che fa perdere la riga: la giacenza che manca vale zero, la soglia e il
   prezzo che mancano restano vuoti — il ricambio entra lo stesso in tutt'e
   tre i casi. Quello che fa perdere la riga è il NOME, che è l'identità.
   ⛔ IL VERDETTO NON SI RISCRIVE: `parseRicambiCsv(riga).length`. E la riga di
   coda `;;;` che un foglio di calcolo salva da sé si conta a parte (`vuote`)
   e resta muta: accusare l'utente di un difetto del suo Excel è il falso
   allarme che insegna a non guardare i messaggi. */
export function scartiRicambiCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"));
  const persi = [];
  let nRiga = 0;
  let vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseRicambiCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    persi.push({
      nome: "riga " + nRiga,
      ragione: !(c[0] || "").trim() ? "manca il nome del ricambio" : "il lettore la scarta",
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

/* ⛔ E IL FILE DEI RICAMBI LO SCRIVE UNA FUNZIONE, per la stessa ragione del
   listino di Conti: era una stringa composta nella pagina, cioè fuori dalla
   portata di qualunque prova che non apra un browser.
   Le tre convenzioni sono quelle del LETTORE qui sopra, e non si riscrivono:
   la GIACENZA che manca vale **zero** (decisione 1: è la risposta giusta, e il
   contrario nasconderebbe i pezzi finiti, che sono quelli da ordinare), la
   SOGLIA e il PREZZO che mancano restano **vuoti** — uno zero farebbe suonare
   un allarme che nessuno ha chiesto, o sembrare gratis un pezzo che non lo è. */
/* I COSTI CON LA LORO DATA (05/09, salito dalla pagina): il file che si porta
   al commercialista. Le voci senza data escono con la cella vuota — non con
   una data messa lì per riempire — e un importo non dichiarato resta vuoto,
   non «0». Righe con a capo Windows perché lo apre un foglio di calcolo;
   la pagina ci mette davanti il BOM. Pura. */
export const CSV_COSTI_INTESTAZIONE = "data;voce;importo;nota";
export function csvCosti(costi) {
  const righe = [CSV_COSTI_INTESTAZIONE].concat(
    (costi || []).filter(Boolean).slice().sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")))
      .map(c => [dataISOEsiste(String(c.data || "").slice(0, 10)) ? String(c.data).slice(0, 10) : "",
                 c.voce || "", numeroDichiarato(c.importo) == null ? "" : numeroDichiarato(c.importo),
                 c.nota || ""].map(csvCell).join(";")));
  return righe.join("\r\n");
}

/* IL REGISTRO DEI FERMI (05/09, salito dalla pagina): quello che si guarda
   quando si decide se una macchina va tenuta o sostituita, e che si porta al
   noleggiatore. La colonna «stato» dice le TRE cose che `durataFermo` sa dire
   — aperto, chiuso, e «data non valida» quando una delle due date non si
   legge — perché un fermo con la ripartenza illeggibile che uscisse «chiuso»
   a zero giornate sarebbe la parola più tranquilla proprio dove lo schermo
   grida. Ordine e testi sono quelli di `fermiOrdinati`, la stessa dello
   schermo. Pura. */
export const CSV_FERMI_INTESTAZIONE = "mezzo;causale;inizio;fine;giorni;stato;note";
export function csvFermiMacchina(fermi, oggi = new Date()) {
  const righe = [CSV_FERMI_INTESTAZIONE]
    .concat(fermiOrdinati(fermi || [], oggi).map(f =>
      [nomeBreve(f.mezzo), f.causaleTx, f.inizio || "", f.fine || "", f.giorni == null ? "" : f.giorni,
       f.statoTx, f.note || ""].map(csvCell).join(";")));
  return righe.join("\r\n");
}

export function csvRicambi(ricambi) {
  const righe = ["nome;giacenza;sogliaMin;prezzo"];
  for (const r of (ricambi || [])) {
    if (!r) continue;
    const g = numeroDichiarato(r.giacenza);
    const s = numeroDichiarato(r.sogliaMin);
    const p = numeroDichiarato(r.prezzo);
    righe.push([
      csvCell(r.nome || ""),
      g == null ? "0" : String(g),
      s == null ? "" : String(s),
      p == null ? "" : String(p),
    ].join(";"));
  }
  return righe.join("\n") + "\n";
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

/* Le righe di parco mezzi che NON entrano, con la ragione — vedi il blocco
   lungo sopra `scartiTelemetriaCsv`.
   ⚠️ Le ORE che mancano non fanno perdere la riga: il mezzo entra con
   `ore: null` (la regola «niente zero di comodo sulle ore», qui sopra).
   Quello che fa perdere la riga è il NOME, che è l'identità del mezzo. */
export function scartiMezziCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"));
  const persi = [];
  let nRiga = 0;
  let vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseMezziCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    persi.push({
      nome: "riga " + nRiga,
      ragione: !(c[0] || "").trim() ? "manca il nome del mezzo" : "il lettore la scarta",
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

// Nuova giacenza dopo uno scarico di `qta` pezzi: mai sotto zero. Serve sia
// al pulsante scarico sia agli ordini di lavoro (manutenzione eseguita che
// consuma un ricambio). Pura e testabile.
export function scaricoGiacenza(giacenza, qta = 1) {
  return Math.max(0, (+giacenza || 0) - (+qta || 0));
}

/* ⛔ UNA SOGLIA MAI SCRITTA NON È UNA SOGLIA A ZERO — e la regola era già
   scritta, provata, e riscritta più debole dove il documento si compone.
   ══════════════════════════════════════════════════════════════════════════
   `parseRicambiCsv` la decide da sempre, e il commento della sua prova dice
   perché con parole che descrivono esattamente il difetto: «la SOGLIA MINIMA
   che manca resta null: una soglia inventata fa suonare un allarme che
   nessuno ha chiesto, **oppure lo tace**». Poi ogni posto che deve DIRE
   qualcosa di quel ricambio se ne teneva una copia più debole, `+r.sogliaMin
   || 0`, che è precisamente la soglia inventata — e quindi taceva:
     · la riga del magazzino scriveva «soglia minima 0» e la pastiglia verde
       «ok» su un pezzo che nessuno ha mai deciso quando riordinare;
     · `flotta_situazione.csv` — il foglio che si gira al responsabile —
       scriveva «giacenza 3 · soglia min 0» e la colonna «ok»;
     · la priorità operativa scriveva «/ min 0».
   Riprodotto premendo il bottone vero «Importa ricambi CSV» con due righe a
   colonna `sogliaMin` vuota: l'app dichiara nel messaggio d'import «2 sono
   senza soglia minima e non entreranno nell'avviso di sotto-scorta», e un
   istante dopo le stesse due righe dicono «soglia minima 0 · OK». Cioè
   l'app SA, lo dice una volta sola in una frase che sparisce, e poi si
   smentisce per sempre.
   Qui la risposta diventa una sola, con QUATTRO stati invece di due, perché
   sono quattro le cose che si possono dire di un pezzo a magazzino:
     · `esaurito`     — giacenza a zero: è misurato, e vale anche senza
                        soglia (un pezzo che non c'è non si monta);
     · `sotto-scorta` — sotto la soglia che qualcuno ha scritto;
     · `senza-soglia` — non giudicabile: nessuno ha detto quando riordinarlo;
     · `a-posto`      — sopra la soglia scritta.
   ⚠️ `mancano` resta `null` quando la soglia non c'è: quanti pezzi manchino
   per arrivare a un numero che nessuno ha scritto non lo sa nessuno, e uno
   zero lì è la stessa bugia un piano più in giù. */
export function statoScorta(ricambio) {
  const r = ricambio || {};
  // la GIACENZA che manca vale zero: è la decisione 1, scritta in
  // `parseRicambiCsv`, e lì lo zero è la risposta giusta — un ricambio senza
  // quantità è un ricambio che non c'è, ed è quello da ordinare.
  const giacenza = +r.giacenza || 0;
  const soglia = numeroDichiarato(r.sogliaMin);
  if (giacenza <= 0)
    return { stato: "esaurito", cls: "danger", label: "esaurito", giacenza, soglia,
             mancano: soglia == null ? null : Math.max(0, soglia - giacenza) };
  if (soglia == null)
    return { stato: "senza-soglia", cls: "warn", label: "senza soglia", giacenza,
             soglia: null, mancano: null };
  return giacenza <= soglia
    ? { stato: "sotto-scorta", cls: "danger", label: "sotto scorta", giacenza, soglia,
        mancano: Math.max(0, soglia - giacenza) }
    : { stato: "a-posto", cls: "ok", label: "ok", giacenza, soglia, mancano: 0 };
}

// Ricambi SOTTO SCORTA: giacenza ≤ soglia minima. Sono quelli da
// riordinare per non fermare un mezzo in attesa del pezzo (il 34% dei
// ritardi di riparazione nasce dai ricambi mancanti). Ordinati per gravità
// (prima i più sotto scorta). Funzione pura e testabile.
/* ⚠️ CHI ENTRA NON CAMBIA, e va detto perché il conto lo prova: il filtro di
   prima era `giacenza||0 <= sogliaMin||0`, e con la soglia mancante letta
   come zero coincideva con «giacenza a zero», cioè con `esaurito`. I quattro
   stati qui sopra lo dicono in chiaro senza spostare nessun avviso: quello
   che cambia è `mancano`, che sull'esaurito senza soglia era `0` — un numero
   tranquillo dove non c'è niente da contare — e adesso è `null`. */
/* ⛔ E L'ORDINE METTEVA PER ULTIMO LO SCAFFALE VUOTO — la stessa soglia mai
   scritta, un piano più in giù, dove non stampa un numero ma decide CHI SI
   LEGGE PER PRIMO.
   ══════════════════════════════════════════════════════════════════════════
   La chiave era `(a.giacenza - a.sogliaMin) - (b.giacenza - b.sogliaMin)`, cioè
   la quarta copia della soglia letta come un numero: con `sogliaMin: null` —
   quello che `parseRicambiCsv` scrive su una colonna vuota — `0 - null` fa
   **0**, e col campo del tutto assente fa **NaN**, che in un comparatore non
   ordina niente e non è nemmeno stabile.
   Misurato su quattro pezzi:
     ordine prodotto:  Filtro C → Filtro A → Pompa B → Cinghia D
     chiavi:              -7        -4          0        NaN
   `Pompa B` e `Cinghia D` hanno **zero pezzi in magazzino** e finivano DOPO
   `Filtro A`, che un pezzo ce l'ha. La funzione promette «prima i più sotto
   scorta» e metteva in fondo i due scaffali vuoti.
   ⚠️ Non scrive niente di falso: NASCONDE. È la famiglia dei numeri tranquilli
   applicata a un ordinamento, che è più difficile da vedere perché non c'è
   nessuna cifra sbagliata da leggere.
   La risposta era già in casa, dodici righe più su: `statoScorta` distingue
   `esaurito` da `sotto-scorta` e sa già dire `mancano` (con il suo `null` dove
   non c'è niente da contare). Qui non si riscrive quella regola, la si LEGGE:
     1. prima gli **esauriti** — un pezzo che non c'è non si monta, ed è la
        ragione già scritta nel commento dei quattro stati;
     2. poi, dentro ogni gruppo, quanti pezzi mancano, dal più al meno;
     3. e a parità, il nome, così l'ordine è deterministico.
   ⚠️ `mancano: null` non vuol dire «ne mancano zero»: vuol dire che nessuno ha
   scritto la soglia. Sta in coda al SUO gruppo — mai sotto un `sotto-scorta`,
   che era il difetto — e l'idioma `== null ? -1 :` è quello che questo file
   usa già per ordinare i mezzi senza consumo. */
const RANGO_SCORTA = { esaurito: 0, "sotto-scorta": 1 };
export function sottoScorta(ricambi) {
  return (ricambi || [])
    .map(r => ({ ...r, scorta: statoScorta(r) }))
    .filter(r => r.scorta.stato === "esaurito" || r.scorta.stato === "sotto-scorta")
    .map(r => ({ ...r, mancano: r.scorta.mancano }))
    .sort((a, b) => (RANGO_SCORTA[a.scorta.stato] - RANGO_SCORTA[b.scorta.stato])
      || ((b.mancano == null ? -1 : b.mancano) - (a.mancano == null ? -1 : a.mancano))
      || String(a.nome || "").localeCompare(String(b.nome || ""), "it"));
}

export function urgenza(dataISO, oggi = new Date()) {
  if (!dataISO) return { cls: "ok", label: "a ore", giorni: 9999 };   // manutenzione a ore motore, non a data
  const g = giorniTra(dataISO, oggi);
  /* ⛔ UN GIORNO CHE NON SI LEGGE NON È UN GIORNO LONTANO. `giorniTra` risponde
     `NaN` a una data che non esiste («2026-02-30», che `Date.parse` non
     rifiuta ma fa SCORRERE al 2 marzo) e a una che non è una data («boh»), e
     `NaN` fallisce TUTT'E DUE i confronti qui sotto: la funzione cadeva
     nell'ultimo `return` e rispondeva `{ cls: "ok", label: "NaN gg" }`, cioè
     un badge VERDE con scritto «NaN gg» — il colore tranquillo dove non è
     stato misurato niente, più un NaN stampato sulla pagina. E il numero
     spariva insieme al colore: `kpiFrom` conta `giorni <= 30`, e `NaN <= 30`
     è false, quindi quella manutenzione non era in nessun elenco e in nessun
     conto, ma sulla riga sembrava a posto.
     È la stessa guardia che `urgenzaOre` ha preso il 03/08 (era «dormiente»
     anche quella: protetta da chiamanti che si ricordano). Misurato:
     `urgenza("2026-02-30")` dava `{cls:"ok", label:"NaN gg"}`, adesso dà
     `{cls:"", label:"data non leggibile", giorni:null}` — nessun colore, e la
     riga dice che cosa manca. */
  if (!Number.isFinite(g)) return { cls: "", label: "data non leggibile", giorni: null };
  if (g < 0) return { cls: "danger", label: "Scaduta", giorni: g };
  if (g <= 30) return { cls: "warn", label: g + " gg", giorni: g };
  return { cls: "ok", label: g + " gg", giorni: g };
}

// Urgenza di un tagliando "a ore motore": confronta le ore previste con
// quelle attuali del mezzo. mancano ≤0 = scaduta (danger), ≤50 = warn,
// oltre = ok. Funzione pura e testabile — decide quali manutenzioni a ore
// segnalare al gestore del parco.
export function urgenzaOre(orePreviste, oreAttuali) {
  // il numero sul badge si scrive all'italiana: da quando il contatore può
  // avere i decimi, «tra 24.5 h» avrebbe messo un punto inglese in mezzo a
  // una schermata di virgole — e «tra 1000 h» resta «tra 1.000 h» come si
  // scrive un migliaio in Italia
  const h = (n) => perLettura(n, 1);
  // ⛔ LA GUARDIA ERA SU META' FUNZIONE (chiusa il 03/08). Quella su
  // `oreAttuali`, tre righe sotto, c'era già ed è scritta bene; su
  // `orePreviste` no, ed era rimasto un `+orePreviste` nudo. Misurato, dava
  // tre facce dello stesso buco: con `null` rispondeva «SCADUTA (+500 h)» IN
  // ROSSO (`+null === 0`, cioè un allarme INVENTATO — ed è il motivo per cui la
  // sonda che cercava i valori tranquilli non l'aveva visto), con un valore non
  // numerico scriveva «tra NaN h» sul badge, e con tutt'e due ignote diceva
  // «a 0 h», che afferma un obiettivo che nessuno ha messo.
  // Era dormiente — i quattro punti di chiamata guardano tutti prima — ma la
  // protezione poggiava su quattro chiamanti che si ricordano.
  // docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
  const prev = orePreviste == null || orePreviste === "" ? NaN : +orePreviste;
  // ⛔ «ZERO ORE» E «NON LO SO» SONO DUE COSE DIVERSE, anche qui.
  // `tagliandiInScadenza` l'aveva già capito e manda i mezzi senza contatore
  // fra quelli «da stimare»; questo badge invece convertiva a zero con
  // `oreAttuali || 0`, e su un mezzo di cui non sappiamo il contatore mostrava
  // «tra 500 h» IN VERDE — un colore tranquillo dove non è stato misurato
  // niente. Adesso lo dichiara: nessun colore, e l'etichetta dice solo a
  // quante ore il tagliando è previsto, come fa la pagina quando il mezzo non
  // è nel parco. Lo zero resta una lettura buona: una macchina nuova ha
  // davvero zero ore.
  const att = oreAttuali == null || oreAttuali === "" ? NaN : +oreAttuali;
  if (!Number.isFinite(att)) {
    return { cls: "", label: Number.isFinite(prev) ? "a " + h(prev) + " h" : "a ore",
      mancano: null, oreNote: false };
  }
  if (!Number.isFinite(prev)) {
    // nessun obiettivo: si dice quello che si sa (le ore del contatore) e non
    // si inventa una distanza da un traguardo che non c'è
    return { cls: "", label: "a ore", mancano: null, oreNote: false };
  }
  const mancano = prev - att;
  if (mancano <= 0) return { cls: "danger", label: "SCADUTA (+" + h(-mancano) + " h)", mancano, oreNote: true };
  if (mancano <= 50) return { cls: "warn", label: "tra " + h(mancano) + " h", mancano, oreNote: true };
  return { cls: "ok", label: "tra " + h(mancano) + " h", mancano, oreNote: true };
}

// Previsione "leggera": da quante ore mancano a un tagliando e dal ritmo
// d'uso (ore/giorno) stima tra quanti GIORNI andrà fatto — così un
// tagliando "a ore motore" diventa una data prevedibile. Ritorna 0 se già
// scaduto, null se il ritmo non è noto (non si può stimare).
// ⛔ QUANTE ORE MANCANO NON SI SA ≠ NE MANCANO ZERO. `null <= 0` risponde
// **true** in JavaScript, quindi la prima riga rispondeva **0** — cioè «da
// fare adesso» — a chi non aveva niente da confrontare. È la stessa forma di
// `avanzamentoLotto` che diceva «0%» di un lotto mai misurato. Guardia PRIMA
// della conversione, perché `+null` fa zero e `Number.isFinite(0)` è true.
export function previsioneGiorni(mancanoOre, oreGiorno) {
  const manca = mancanoOre == null || mancanoOre === "" ? NaN : +mancanoOre;
  if (!Number.isFinite(manca)) return null;
  const rate = +oreGiorno || 0;
  if (manca <= 0) return 0;
  if (rate <= 0) return null;
  return Math.ceil(manca / rate);
}

// Disponibilità della flotta: % di mezzi operativi sul totale. È il KPI
// "di testa" per un parco di cava (world-class ~92-94% per i camion).
// Ritorna { pct, operativi, totale }; pct null se non ci sono mezzi.
export function disponibilitaFlotta(mezzi) {
  const totale = (mezzi || []).length;
  const operativi = (mezzi || []).filter(m => m.stato === "operativo").length;
  return { pct: totale ? Math.round(100 * operativi / totale) : null, operativi, totale };
}

// LE ORE DEL CONTATORE DI UN MEZZO, oppure null se nessuno le ha lette.
/* ⛔ LA GUARDIA VA PRIMA DELLA CONVERSIONE, e qui non c'era. Le due righe che
   fanno questo lavoro — dentro `prioritaOperative` e dentro
   `tagliandiInScadenza` — erano scritte `Number.isFinite(+m.ore)` e portavano
   sopra il commento «chi non ha il contatore torna null». Falso e misurato il
   01/08: `+null` fa **0** e `Number.isFinite(0)` risponde **true**, quindi un
   mezzo con `ore: null` — esattamente quello che `parseMezziCsv` scrive quando
   il contatore è illeggibile — tornava **zero ore**. Da lì:
    · nel Quadro compariva una riga «Tagliando 50h — Dumper D1 · tra 40 h» in
      GIALLO, cioè un avviso calcolato su un contatore che nessuno ha letto;
    · nella tessera dei tagliandi quello stesso tagliando veniva CONTATO, con
      «fra 30 giorni» ricavati da «ore previste meno zero».
   Ed è lo stesso `+null === 0` che in questo progetto è già costato tre volte.
   Scritta una volta sola: era la stessa regola in due funzioni, con lo stesso
   difetto in tutt'e due — due copie uguali oggi sbagliano insieme domani. */
const oreContatore = (mezzo) => {
  const v = mezzo == null ? null : mezzo.ore;
  if (v == null || v === "") return null;
  return Number.isFinite(+v) ? +v : null;
};

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
// Dal 04/09 accetta anche le LETTURE del contatore (`letture`, facoltativo):
// servono a sapere se un tagliando a ore è scritto sul contatore che il
// mezzo ha oggi. Un tagliando non confrontabile è una riga `warn`, perché
// chiede un'azione (riscriverlo sul contatore nuovo); senza letture, o senza
// azzeramenti, il comportamento è quello di prima.
export function prioritaOperative(mezzi, manutenzioni, ricambi, oggi = new Date(), scadenze = [], preavvisoGiorni = 30, fermi = [], letture = []) {
  const items = [];
  for (const s of scadenze || []) {
    const sem = statoScadenzaMezzo(s.dataScadenza, oggi, preavvisoGiorni);
    if (sem.stato === "a-posto") continue;
    items.push({ gravita: sem.stato === "scaduta" ? "danger" : "warn", categoria: "scadenza",
      titolo: (s.tipo || "Scadenza di legge") + " — " + (s.mezzo || "?"),
      dettaglio: "scadenza di legge" + (s.dataScadenza ? " del " + String(s.dataScadenza).split("-").reverse().join("/") : ""),
      badge: sem.label });
  }
  /* «zero ore» e «non lo so» sono due cose diverse: con `|| 0` un mezzo
     senza contatore diventava un mezzo nuovo di fabbrica, e il tagliando
     sembrava lontano. Chi non ha il contatore torna null, e chi chiama lo
     salta invece di misurare da uno zero che nessuno ha letto. */
  const oreDi = (nomeMezzo) =>
    oreContatore((mezzi || []).find(x => String(x.nome || "").split(" — ")[0] === nomeMezzo));
  for (const n of manutenzioni || []) {
    let u, dettaglio;
    if (n.orePreviste) {
      const ore = oreDi(n.mezzo);
      if (ore == null) continue;                 // mezzo non trovato: non calcolabile
      u = urgenzaTagliando(n, ore, azzeramentiDelMezzo(letture, n.mezzo));
      if (!u.calcolabile) {
        // non è «a posto» e non è un numero: è una cosa da fare, e il Quadro
        // la mette fra le priorità con la sua ragione
        items.push({ gravita: "warn", categoria: "manutenzione", origine: n.origine || null,
          titolo: (n.titolo || "Manutenzione") + " — " + (n.mezzo || "?"),
          dettaglio: "a " + mostra(n.orePreviste, 1) + " h motore, " + u.perche + ": da riscrivere sul contatore nuovo",
          badge: u.label });
        continue;
      }
      // la riga di priorità va sul Quadro: il numero si scrive all'italiana,
      // altrimenti «a 6000.5 h motore» mette un punto inglese sulla prima
      // schermata dell'app, accanto a numeri con la virgola
      dettaglio = "a " + mostra(n.orePreviste, 1) + " h motore";
    } else if (n.dataPrevista) {
      u = urgenza(n.dataPrevista, oggi);
      /* ⛔ `dataIt`, NON `split("-").reverse()`. La copia di casa scriveva
         «30/02/2026» come una data qualunque e «boh» come «boh»: guardava
         com'è SCRITTO il dato invece di che cosa vale. `dataIt` chiede a
         `dataISOEsiste` e risponde «—» quando il giorno non esiste. */
      dettaglio = "previsto " + dataIt(n.dataPrevista);
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
    const s = r.scorta;
    const zero = s.stato === "esaurito";
    items.push({ gravita: zero ? "danger" : "warn", categoria: "ricambio",
      titolo: r.nome || "Ricambio",
      // ⚠️ «min 0» era la soglia inventata: se nessuno l'ha scritta si dice
      // che non c'è, non si mette uno zero che sembra una decisione.
      dettaglio: "giacenza " + s.giacenza + (s.soglia == null ? " / soglia minima non impostata" : " / min " + s.soglia),
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
/* stessa classificazione di Conti, presa da shared/: se le due app usassero
   due elenchi diversi, i costi del mezzo e quelli della cava smetterebbero di
   sommarsi senza che nessun controllo se ne accorga. */
export { VOCI_COSTO, voceCosto, gruppoDiVoce } from "../../shared/dw-ponti.js";
/* ⛔ E `numeroDichiarato` SI RI-ESPORTA, non si riscrive. La regola che
   distingue «zero misurato» da «campo mai compilato» vive in `shared/` e qui
   dentro la usano già `csvRicambi` e `propostaScorte`; le serviva anche alla
   PAGINA, per la cella dell'importo del registro interventi. Un alias non è
   una seconda implementazione — è la forma che questa casa ha scelto perché
   le pagine non importino `shared/` per conto loro e perché `nomi-doppi` veda
   lo STESSO oggetto invece di due gemelli destinati a divergere. */
export { numeroDichiarato } from "../../shared/dw-ponti.js";

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
    /* ⚠️ QUI LA REGOLA ERA SCRITTA UNA SECONDA VOLTA, E PIÙ DEBOLE. La versione
       di casa era `/^\d{4}-\d{2}-\d{2}$/.test(iso) && !Number.isNaN(Date.parse(…))`
       e accettava «2026-02-30»: `Date.parse` un giorno che non esiste non lo
       rifiuta, lo fa SCORRERE al 2 marzo. Una spesa datata così finiva
       attribuita a un mese sbagliato in silenzio — e da quando il €/h si
       calcola su una finestra di date, una data che scivola non sposta solo un
       mese: sposta una spesa dentro o fuori un rapporto.
       La versione giusta è in `shared/` da mesi (`dataISOEsiste`, che
       ricostruisce la data e pretende che torni la stessa) e la usa già
       `costoOrarioMezzo` dieci righe più in là: un alias non è una seconda
       implementazione. Misurato prima di cambiarla: sulle 7 voci della
       dimostrazione le due regole danno lo STESSO esito, quindi nessuna riga
       d'esempio si muove. */
    if (!dataISOEsiste(iso)) { sdVoci++; if (imp > 0) sdImporto += imp; continue; }
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

// ══════════════════════════════════════════════════════════════════════
// PONTE · CONTI → FLOTTA — QUESTA SPESA RISULTA ANCHE NEL REGISTRO DELLA CAVA?
// ══════════════════════════════════════════════════════════════════════
// Il confronto voce per voce vive in `shared/` (`confrontoCostiMezzi`, serve a
// due app) e qui si RI-ESPORTA: un alias non è una seconda implementazione.
export { confrontoCostiMezzi } from "../../shared/dw-ponti.js";
//
// ⛔ MISURATO IL 02/09, E VALE PIÙ DI TUTTO QUELLO CHE STA QUI SOTTO: il registro
// costi di Flotta scrive la voce A TESTO LIBERO — «Carburante» dal
// rifornimento, «Manutenzione: <titolo> (<mezzo>)» dalla chiusura dell'ordine,
// e quello che l'utente batte nel campo — mentre `confrontoCostiMezzi`
// riconosce una voce da mezzo con `voceCosto(c.voce)`, che combacia SOLO con la
// chiave («carburante»). Provato: `voceCosto("Carburante")` → `null`, e sui
// sette costi della dimostrazione `confrontoCostiMezzi(…, DEMO.costi)` risponde
// `totaleFlotta: 0`. Cioè il ponte Flotta→Conti, sui dati che Flotta scrive
// davvero, vede Flotta a ZERO — e Conti direbbe «Flotta non ha registrato
// niente su queste voci», con la faccia tranquilla.
// La traduzione sta qui perché questo cantiere non può toccare `shared/` né
// Conti; ma la regola «serve a due app, vive in shared» è già scattata OGGI,
// non domani: Conti legge la stessa collezione e ha lo stesso bisogno. Il
// giorno in cui `chiaveVoceMezzo` sale in `shared/` e `confrontoCostiMezzi`
// classifica da sé, `costiPerConfronto` diventa un passaggio vuoto e la prova
// «grezzo → 0» in run-kpi cade: è il segnale per togliere tutt'e due.
//
// Riconosce, dal nome libero di una voce, quale delle tre voci `daMezzo` è.
// Il carburante si guarda per primo perché «gasolio» contiene «olio».
// Quello che non si riconosce risponde `null`: NON «generali», non
// «manutenzione» per comodità — si dichiara e si lascia fuori dal confronto.
export function chiaveVoceMezzo(voce) {
  const t = String(voce || "").trim().toLowerCase();
  if (!t) return null;
  if (/carburant|gasolio|diesel|benzin|rifornim|adblue/.test(t)) return "carburante";
  if (/nolegg|\bnolo\b|leasing/.test(t)) return "noleggio";
  if (/manutenz|ricamb|officina|gomm|pneumatic|filtr|\bolio|taglian|riparaz/.test(t)) return "manutenzione";
  return null;
}

// Le righe del registro di Flotta nella forma che `confrontoCostiMezzi` sa
// leggere: la voce diventa la chiave, il nome scritto resta accanto
// (`voceScritta`). Le righe che non si riconoscono NON entrano nel confronto e
// si contano — con i loro nomi, così chi legge sa quali sono.
export function costiPerConfronto(costi) {
  const righe = [], fuori = [];
  for (const c of costi || []) {
    if (!c) continue;
    const k = chiaveVoceMezzo(c.voce);
    if (k) righe.push({ ...c, voceScritta: c.voce, voce: k });
    else fuori.push(String(c.voce || "").trim() || "(senza voce)");
  }
  return { righe, nonClassificate: fuori.length, fuori };
}

// LA STESSA SPESA, ALLA CIFRA. Il confronto per voce dice «il carburante è in
// tutt'e due»; questa dice QUALE riga di Flotta ha in Conti una riga identica
// — stessa voce da mezzo, stesso giorno, stesso importo al centesimo — ed è
// quella che nell'elenco prende il contrassegno «anche in Conti».
//  · Conti non raggiungibile → `null`, che non è «nessun doppione»;
//  · una riga senza data o senza importo positivo non ha una firma: non si può
//    dire né che è doppia né che non lo è, e si conta (`nonConfrontabili`);
//  · una riga di Conti si spende UNA volta sola: due rifornimenti uguali lo
//    stesso giorno contro una sola fattura marcano un solo doppione;
//  · di Conti si guardano solo le voci `daMezzo`, come fa il confronto.
export function doppioniAllaCifra(costiFlotta, costiConti) {
  if (costiConti == null) return null;
  const firma = (k, c) => {
    const d = String(c && c.data || "").slice(0, 10), imp = numeroDichiarato(c && c.importo);
    if (!k || !dataISOEsiste(d) || imp === null || imp <= 0) return null;
    return k + "|" + d + "|" + Math.round(imp * 100);
  };
  const inConti = new Map();
  let nonConfrontabiliConti = 0;
  for (const c of costiConti) {
    const v = voceCosto(c && c.voce);
    if (!v || !v.daMezzo) continue;
    const f = firma(v.chiave, c);
    if (!f) { nonConfrontabiliConti++; continue; }
    inConti.set(f, (inConti.get(f) || []).concat([c.id == null ? "" : String(c.id)]));
  }
  const doppioni = {};
  let nonConfrontabiliFlotta = 0;
  for (const c of costiFlotta || []) {
    const k = chiaveVoceMezzo(c && c.voce);
    if (!k) continue;
    const f = firma(k, c);
    if (!f) { nonConfrontabiliFlotta++; continue; }
    const l = inConti.get(f);
    if (l && l.length && c.id != null) doppioni[c.id] = l.shift();
  }
  return { doppioni, quanti: Object.keys(doppioni).length,
           nonConfrontabili: { flotta: nonConfrontabiliFlotta, conti: nonConfrontabiliConti } };
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
  /* ⛔ `dataISOEsiste`, NON UNA REGEX DI CASA: era l'ultimo posto di questo
     modulo in cui il giorno si giudicava dalla FORMA. La ragione sta scritta
     per esteso sopra `isoGiorno` — «2026-02-30» la forma ce l'ha buona e quel
     giorno non esiste, e `Date.parse` non lo rifiuta: lo fa SCORRERE al 2
     marzo. Qui la porta davanti dev'essere larga quanto quella dietro, cioè
     quanto `disponibilitaStorico`, che legge le righe che questa scrive. */
  if (!dataISOEsiste(giorno)) return null;
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
    /* ⛔ UN GIORNO CHE NON ESISTE NON È UN GIORNO REGISTRATO, E QUI IL DANNO VA
       NELLA DIREZIONE CHE RASSICURA. Questo controllo guardava la FORMA
       (`/^\d{4}-\d{2}-\d{2}$/`) mentre tutto il resto del modulo passa da
       `dataISOEsiste` — è la copia più debole, non l'invenzione. Misurato il
       14/08 con una riga «2026-02-30» dentro la finestra:
         punti 1 → **2**, e giorniSenza **13 → 12**
       cioè il conto dei giorni che nessuno ha registrato SCENDE per un giorno
       che non c'è mai stato, e il grafico si prende una colonna in più con la
       sua etichetta «30/02/2026». `Date.parse` non aiuta a vederlo: su quella
       stringa non risponde NaN, la fa scorrere al 2 marzo, quindi l'arco del
       grafico si misura da un giorno e l'etichetta ne stampa un altro. */
    if (!dataISOEsiste(g) || g < inizio || g > fine) continue;
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

// QUANTO MI COSTA ALL'ORA QUESTA MACCHINA — la domanda con cui un titolare
// decide se tenerla o cambiarla. Gli ingredienti c'erano già tutti e sparsi:
// `costoOfficinaPerMezzo` sa l'officina, `consumoPerMezzo` sa il carburante E
// le ore (`oreCoperte`, prese dai contatori scritti sui pieni). Mancava solo
// la somma, cioè il numero che decide.
//
// ⛔ LE ORE NON SI RICALCOLANO QUI. `consumoPerMezzo` le sa già, e sa già dire
//    perché non le sa quando non le sa: rifarle vorrebbe dire avere due conti
//    delle stesse ore, che un giorno divergono senza che nessuno se ne accorga.
//    È la regola del `shared/` applicata dentro una app sola.
// ⛔ E SENZA ORE NON SI RISPONDE «0 €/h». Nella dimostrazione il Dumper D3 ha
//    5.090 € di officina e nessun rifornimento col contatore: un numero lì
//    direbbe che è la macchina che costa meno, mentre la verità è che non si sa
//    quanto ha lavorato. `euroOra` resta `null` e `perche` dice che cosa manca.
// ⚠️ E il totale è un MINIMO quando qualche intervento è senza costo: `parziale`
//    lo dichiara, così chi disegna non lo spaccia per definitivo.
//
// ⛔ UNA SOLA FINESTRA, E DICHIARATA (05/08). Fino a stamattina il numeratore e
//    il denominatore coprivano DUE PERIODI DIVERSI: sopra tutta l'officina del
//    mezzo, DA SEMPRE; sotto le ore, che si sanno solo fra il primo e l'ultimo
//    rifornimento col contatore. Un rapporto fra due periodi diversi non è una
//    misura sbagliata di poco: sulla dimostrazione il Dumper D1 rispondeva
//    63,03 €/h invece di 28,61 — più del DOPPIO — perché ci finiva dentro un
//    intervento da 2.100 € fatto sei settimane prima che qualcuno cominciasse a
//    scrivere il contatore. E il verso dell'errore è sempre lo stesso: gonfia.
//    Tre mezzi su sei della dimostrazione ne erano toccati (+120%, +82%, +19%).
//    Adesso il €/h si calcola sulla finestra `da`→`a` che arriva da
//    `consumoPerMezzo` (le stesse letture da cui escono le ore), e quello che
//    cade fuori NON è né incluso di nascosto né tolto di nascosto: si conta in
//    `fuori` (quanti interventi, quanti euro) perché la pagina lo scriva.
// ⛔ E IL TOTALE SPESO RESTA QUELLO VERO, DA SEMPRE. «Quanto ho speso su questa
//    macchina» e «quanto mi costa un'ora» sono due domande diverse: aggiustare
//    la seconda non deve far scendere la prima, o chi guarda la spesa vedrebbe
//    sparire dei soldi che ha pagato davvero. `totale` e `officina` non
//    cambiano; il numeratore del rapporto è `spesaInFinestra`.
// ⛔ E UN INTERVENTO SENZA DATA NON SI COLLOCA «DENTRO PER COMODITÀ». Non si sa
//    se sia dentro o fuori, quindi non entra nel rapporto e non si finge che
//    non esista: va in `senzaData` e rende il €/h `parziale` — la stessa
//    bandiera che già dichiarava gli interventi senza costo, perché dicono la
//    stessa cosa (c'è una spesa d'officina che il rapporto non ha potuto
//    contare, quindi il €/h è un MINIMO). Una seconda bandiera accanto a
//    quella direbbe due volte la stessa cosa con due parole diverse.
//    `percheParziale` dice quale delle due ragioni, o tutt'e due.
// ⛔ E SENZA FINESTRA NON SI RISPONDE LO STESSO. Se le letture del contatore ci
//    sono ma nessuna porta la data (succede solo con dati importati: il modulo
//    del rifornimento la data la pretende), le ore si sanno e il periodo no:
//    allora non c'è modo di dire quale spesa ci appartenga, e `euroOra` resta
//    `null` con la sua ragione — come per il Dumper D3, ma per l'altro motivo.
//
// ⛔ E NEMMENO IL GASOLIO SI RICALCOLA QUI (05/08, seconda metà della stessa
//    correzione). La riga sopra dice «LE ORE NON SI RICALCOLANO QUI», e dieci
//    righe più in basso questa funzione faceva col gasolio esattamente quello
//    che si era vietata con le ore: prendeva `c.euro` — TUTTO il gasolio del
//    mezzo, primo pieno compreso — mentre `consumoPerMezzo` il primo pieno lo
//    scarta di proposito, perché ha alimentato ore precedenti alla finestra.
//    Due conti della stessa cosa, e divergevano: sulla dimostrazione il €/h
//    usciva del +50,4% (Dumper D1), +49,2% (Escavatore E1) e +93,7% (Pala P1)
//    rispetto al gasolio che la finestra contiene davvero. Adesso il
//    numeratore legge `euroInFinestra`, che è lo stesso numero su cui
//    `consumoPerMezzo` costruisce il suo `euroOra`: da qui l'identità
//    `euroOra ≈ euroOraOfficina + euroOraCarburante`, che prima non tornava.
// ⚠️ E se un pieno della finestra è stato registrato SENZA la spesa, quel
//    gasolio c'è ma i suoi euro no: il €/h esce più basso del vero. È un
//    MINIMO, e lo dichiara la stessa bandiera `parziale` — terza ragione
//    accanto agli interventi senza costo e a quelli senza data. Sempre una
//    bandiera sola: dicono tutte e tre «questo numero è un minimo».
export function costoOrarioMezzo(interventi, rifornimenti) {
  const off = costoOfficinaPerMezzo(interventi);
  const car = consumoPerMezzo(rifornimenti);
  const nomi = new Set([...off.mezzi.map(m => m.mezzo), ...car.mezzi.map(m => m.mezzo)]);
  nomi.delete("Senza mezzo");
  const righe = [];
  for (const mezzo of nomi) {
    const o = off.mezzi.find(m => m.mezzo === mezzo);
    const c = car.mezzi.find(m => m.mezzo === mezzo);
    const officina = o ? o.costo : 0;
    const carburante = c ? c.euro : 0;
    // le ore ci sono E si sa che periodo coprono: sono due condizioni, non una
    const oreNote = !!(c && Number.isFinite(c.oreCoperte) && c.oreCoperte > 0);
    const da = oreNote ? c.da : null, a = oreNote ? c.a : null;
    const ore = oreNote && da && a ? c.oreCoperte : null;

    const miei = (interventi || []).filter(w => String(w.mezzo || "").trim() === mezzo);
    const mancanti = miei.filter(w => !(+w.costo > 0)).length;
    let inFinestra = 0, fuoriN = 0, fuoriEuro = 0, sdN = 0, sdEuro = 0;
    for (const w of miei) {
      const costo = +w.costo;
      if (!(costo > 0)) continue;                       // già contato in `mancanti`
      const g = String(w.data || "").slice(0, 10);
      // ⚠️ `dataISOEsiste`, non una regex di casa: «2026-02-30» passa il
      //    controllo di forma e `Date.parse` la fa SCORRERE al 2 marzo, cioè
      //    la collocherebbe in un giorno che non è mai esistito.
      if (!dataISOEsiste(g)) { sdN++; sdEuro += costo; continue; }
      if (!ore) continue;                               // niente finestra: niente da collocare
      if (g >= da && g <= a) inFinestra += costo;       // estremi compresi
      else { fuoriN++; fuoriEuro += costo; }
    }
    // il gasolio della finestra si LEGGE da `consumoPerMezzo`, non si rifà qui
    const carburanteInFinestra = ore && Number.isFinite(c.euroInFinestra) ? c.euroInFinestra : null;
    const senzaEuro = ore ? c.pieniSenzaEuro : 0;
    const spesaInFinestra = ore ? Math.round(100 * (inFinestra + carburanteInFinestra)) / 100 : null;
    /* ⛔ E UNA SPESA DI ZERO NON È UNA SPESA MISURATA: È UNA SPESA NON SCRITTA.
       Misurato il 07/08 sulla scena che la dimostrazione non conteneva — una
       macchina i cui pieni della finestra arrivano dalla cisterna interna
       (litri sì, prezzo non ancora) e senza nessun intervento d'officina
       datato lì dentro. `inFinestra` vale 0 e `carburanteInFinestra` vale 0,
       quindi `spesaInFinestra` è 0 e la divisione rispondeva **0 €/h**: il
       numero più tranquillo che questa funzione sappia dire, su una macchina
       di cui nessuno ha scritto quanto è costata. E non restava lì: la
       pagella lo prendeva per buono e la macchina usciva **prima in
       classifica**, quella che costa meno di tutto il parco — che è esattamente
       il caso che la schermata dei non giudicabili dichiara di voler evitare
       («un "0 €/h" al suo posto lo farebbe sembrare il più conveniente»).
       La bandiera `parziale` c'era già ed era pure alzata, ma diceva un'altra
       cosa: «questo conto è un MINIMO». Un minimo di zero non è un minimo, è
       un non-calcolabile — e va detto con le parole del non-calcolabile,
       insieme alle altre due ragioni che già vivono in `perche`.
       ⚠️ Non è un ramo largo: `spesaInFinestra === 0` con la finestra aperta
       può succedere SOLO se nessun pieno dal secondo in poi porta il prezzo
       (uno che lo porta ha `euro > 0`), quindi `parziale` è sempre già vera
       quando questo scatta. Provato su una copia prima di scriverlo qui: con
       un solo pieno prezzato il €/h torna un numero, e con l'officina dentro
       la finestra pure. */
    const nienteSpesa = ore != null && spesaInFinestra === 0;
    const parziale = mancanti > 0 || sdN > 0 || senzaEuro > 0;
    const ragioni = [];
    if (mancanti > 0) ragioni.push(mancanti + (mancanti === 1 ? " intervento senza costo" : " interventi senza costo"));
    if (sdN > 0) ragioni.push(sdN + (sdN === 1 ? " intervento senza data" : " interventi senza data"));
    if (senzaEuro > 0) ragioni.push(senzaEuro + (senzaEuro === 1 ? " rifornimento senza la spesa" : " rifornimenti senza la spesa"));
    righe.push({
      mezzo, officina, carburante, totale: officina + carburante,
      ore, da, a,
      officinaInFinestra: ore ? Math.round(100 * inFinestra) / 100 : null,
      carburanteInFinestra, spesaInFinestra,
      fuori: { interventi: fuoriN, costo: Math.round(100 * fuoriEuro) / 100 },
      senzaData: { interventi: sdN, costo: Math.round(100 * sdEuro) / 100 },
      parziale, interventiSenzaCosto: mancanti, rifornimentiSenzaEuro: senzaEuro,
      percheParziale: ragioni.length ? ragioni.join(" e ") + ": il conto è un minimo" : "",
      euroOraOfficina: ore ? Math.round(100 * inFinestra / ore) / 100 : null,
      euroOraCarburante: c && Number.isFinite(c.euroOra) ? c.euroOra : null,
      euroOra: ore && !nienteSpesa ? Math.round(100 * spesaInFinestra / ore) / 100 : null,
      /* ⛔ E LA RAGIONE «LE ORE CI SONO MA IL PERIODO NO» ERA LA SECONDA COPIA
         DI UNA DECISIONE CHE ADESSO STA IN UN POSTO SOLO. Qui c'era un ramo in
         più — `oreNote ? "i rifornimenti col contatore non portano la data" :
         …` — che serviva quando `consumoPerMezzo` rispondeva con le ore anche
         se le letture agli estremi non erano datate: allora questa funzione
         doveva accorgersene da sé, guardando `da`/`a`, e dirlo con parole sue.
         Da quando `consumoPerMezzo` le ore fra due estremi non datati si
         rifiuta di contarle, quel caso arriva qui già con `oreCoperte: null` e
         la sua ragione scritta — che è più precisa di quella che c'era (dice
         QUALE lettura manca e che cosa fare) e, soprattutto, è una sola.
         Misurato prima di togliere il ramo: su **648 combinazioni** di tre
         letture (sei date fra valide, vuote e impossibili × tre contatori) il
         caso «ore note ma finestra assente» si presenta **zero** volte. Non è
         un ramo prudente rimasto lì per sicurezza: è un ramo che non può più
         scattare, e un caso dichiarato che non si presenta più è un caso che
         nasconde — chi lo legge crede che quella strada esista ancora. */
      perche: ore ? (nienteSpesa
        ? "le ore lavorate si sanno, ma nessuna delle spese che cadono in questo periodo porta il suo importo: il costo di un'ora non si può calcolare"
        : "") : ((c && c.perche)
          || "Nessun rifornimento porta la lettura del contatore: le ore lavorate non si sanno."),
    });
  }
  return righe.sort((a, b) => b.totale - a.totale || a.mezzo.localeCompare(b.mezzo, "it"));
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

// LA FORMA DI UNA MANUTENZIONE APERTA DA CHI STA SULLA MACCHINA.
// Due strade portano qui — il giro di inizio turno e la segnalazione di un
// guasto — e scrivono lo STESSO oggetto: stessi campi, stesso schema delle
// manutenzioni scritte a mano, nessun campo nuovo obbligatorio. È scritta
// una volta sola di proposito: due copie uguali oggi divergono domani senza
// che nessuno lo veda. L'unica cosa che le distingue nel registro è
// `origine`, ed è quella che l'app mostra con l'icona della riga.
// Senza data vale OGGI: quello che trova chi usa la macchina si guarda
// adesso, non «prima o poi».
function manutenzioneAperta(dati, oggi) {
  const d = dati || {};
  return {
    titolo: d.titolo,
    mezzo: d.mezzo || "",
    dataPrevista: d.data || oggiIso(oggi),
    orePreviste: null,
    ricambioId: null,
    origine: d.origine,
    nota: d.nota,
  };
}

// Da un giro macchina alle MANUTENZIONI da aprire: una per ogni voce «non
// va». Nascono con la data di oggi (vanno guardate subito) e portano scritto
// da dove vengono, così nel registro si capisce che è stato l'operatore a
// trovarle. Pura e testabile.
export function manutenzioniDaControllo(controllo, oggi = new Date()) {
  const c = controllo || {};
  return (c.voci || []).filter(v => v.esito === "no").map(v => manutenzioneAperta({
    titolo: "Giro macchina: " + v.etichetta,
    mezzo: c.mezzo,
    data: c.data,
    origine: "controllo",
    nota: (v.nota || "").trim() || (v.critica ? "voce di sicurezza segnata «non va» al controllo pre-uso" : "segnalata al controllo pre-uso"),
  }, oggi));
}

// COPERTURA DEI GIRI DI OGGI: quanti mezzi hanno già il loro controllo
// pre-uso oggi e quali no. Serve alla riga del Quadro, che è quello che
// spinge a farlo. Pura e testabile.
export function coperturaControlli(controlli, mezzi, iso) {
  const giorno = String(iso || "").slice(0, 10);
  const fatti = new Set();
  /* ⚠️ I MEZZI CON ANOMALIE SI RACCOLGONO, NON SI CONTANO AL VOLO.
     La versione precedente faceva `if (!fatti.has(nome) && anomalie > 0)
     conAnomalie++`, cioè guardava solo il PRIMO giro di ogni mezzo: se il
     primo era pulito e il secondo trovava qualcosa, il riquadro diceva **zero
     anomalie**. E il caso non è teorico — in cava il giro si fa a ogni cambio
     turno, quindi due o tre giri al giorno sullo stesso mezzo sono la norma.
     Il difetto dipendeva perfino dall'ORDINE dell'elenco: gli stessi due giri,
     scambiati di posto, davano due risultati diversi.
     Trovato il 01/08 misurando la funzione, non leggendola. */
  const conAnomalia = new Set();
  for (const c of controlli || []) {
    if (String(c.data || "").slice(0, 10) !== giorno) continue;
    const nome = nomeBreve(c.mezzo);
    if (!nome) continue;
    if ((+c.anomalie || 0) > 0) conAnomalia.add(nome);
    fatti.add(nome);
  }
  const conAnomalie = conAnomalia.size;
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

/* ⛔ I GIRI DI OGGI SU UNA MACCHINA SONO PIÙ D'UNO, E VANNO GUARDATI INSIEME.
   In cava il giro si fa a ogni cambio turno: due o tre giri al giorno sullo
   stesso mezzo sono la norma, non un caso limite. Fino al 03/08 la schermata
   Giro ne teneva **uno solo** per mezzo (`fattoDi[nome] = c` dentro un ciclo:
   vince l'ultimo che passa) e da quello prendeva colore ed etichetta del
   badge. Misurato con due giri dello stesso giorno — il primo turno trova i
   FRENI, il secondo è pulito:
     · elenco nell'ordine A,B → badge **verde «tutto a posto»**;
     · gli stessi due scambiati → badge **rosso «1 da vedere»**.
   Cioè la risposta dipendeva dall'ORDINE dell'elenco, e nel verso che
   rassicura cancellava una voce di sicurezza segnata «non va». Nella stessa
   schermata, tre centimetri più in alto, la riga di riepilogo diceva
   «1 con anomalie»: la pagina si smentiva da sola.
   È lo stesso difetto corretto il 01/08 dentro `coperturaControlli` — lì la
   correzione è stata fatta nel modulo, qui la pagina se n'era tenuta una
   copia più debole. Adesso la domanda si fa in un posto solo.
   Le anomalie si contano per VOCE DISTINTA, non sommando i giri: la stessa
   perdita trovata al mattino e al pomeriggio è un problema, non due.
   ⚠️ E un giro che non porta le sue `voci` ma dichiara `anomalie` non
   diventa «tutto a posto»: quelle anomalie si contano lo stesso, anche se
   non si sanno chiamare per nome. Pura e testabile. */
/* L'ESITO DI **UN** GIRO MACCHINA, in un posto solo.
   La regola giusta stava già qui sotto, dentro `giriDelGiorno` — ma quella
   risponde a una domanda **per mezzo e per giorno**, e al file, alla riga
   della lista e al libretto serve **per record**. È la firma troppo stretta
   da cui nasce la copia: la pagina se n'era scritte TRE versioni, e nessuna
   delle tre uguale alle altre.
   · l'export dei giri decideva dalle sole `voci`, quindi un giro che dichiara
     `anomalie: 2` senza portare l'elenco usciva «tutto a posto»;
   · `etichettaControllo` decideva dal solo contatore `anomalie`;
   · il CSV del libretto aveva già la versione a tre rami, quella giusta —
     una correzione fatta a un export e non all'altro.
   ⚠️ ONESTÀ SULLA PORTATA, misurata su dieci casi prima di scrivere questa
   riga: fra le tre versioni ci sono **sei** disaccordi, ma cinque sono di
   VOCABOLARIO («con anomalie» contro «2 da vedere»), tutt'e due veri. La
   bugia vera è una sola — il giro muto che esce «tutto a posto» — e **oggi
   non è producibile dall'app**: l'unico punto che crea un controllo scrive
   sempre `voci`, e `anomalie` esce dallo stesso elenco. Resta difesa perché
   vive per i record vecchi, per un import e per una scrittura parziale, e
   perché tre copie di una regola divergono da sole appena qualcuno ne tocca
   una.
   ⚠️ Le voci si contano per CHIAVE DISTINTA, come in `giriDelGiorno`. Dentro
   un giro solo le chiavi sono già uniche (una per voce di checklist), quindi
   sui dati veri il conto non cambia: la distinzione serve a chi somma più
   giri, e sta qui perché la regola sia una. */
export function statoGiro(controllo) {
  const etichettaDi = (n) => (n === 0 ? "tutto a posto" : n === 1 ? "1 da vedere" : n + " da vedere");
  /* ⛔ NESSUN GIRO NON È UN GIRO ANDATO BENE. L'ha preteso `sonda-vuoto`, e
     al primo tentativo avevo tracciato il confine nel posto sbagliato: dicevo
     «se il record ESISTE, che sia stato salvato dimostra che qualcuno l'ha
     fatto», e quindi `{}` restava «tutto a posto». Ma quella è una deduzione
     sulla PROVENIENZA del dato, non una cosa che il dato dica: un `{}` non
     porta né la lista né il contatore, cioè non porta nessuna prova che
     qualcuno abbia guardato la macchina.
     Il confine giusto è la PROVA: o c'è l'elenco delle voci (qualcuno ha
     compilato la checklist), o c'è un numero di anomalie **dichiarato** —
     anche zero, che è un'ottima notizia e va detta. Se non c'è né l'uno né
     l'altro, lo stato è «da fare» con `gravita: null`, che è la convenzione
     di casa per «non si può calcolare» ed è la stessa parola che la sorella
     `giriDelGiorno` usa per una macchina senza giri. Uno stato che non c'è
     non si dipinge di verde.
     ⚠️ «Dichiarato» lo decide `numeroDichiarato` di `shared/`, che distingue
     lo zero scritto dal campo mai compilato: riscriverlo qui sarebbe la copia
     debole che questa casa ha già pagato quattro volte. */
  const NON_MISURATO = { anomalie: 0, voci: [], dettaglio: [], nominate: false,
                         critica: false, gravita: null, etichetta: "da fare" };
  if (!controllo || typeof controllo !== "object") return NON_MISURATO;
  const c = controllo;
  const voci = Array.isArray(c.voci) ? c.voci : null;
  if (!voci) {
    /* ⛔ NIENTE VOCI NON VUOL DIRE NIENTE ANOMALIE: quelle dichiarate si
       contano lo stesso, anche se non si sanno chiamare per nome. `nominate`
       lo dice a chi compone un documento, che deve scriverlo invece di
       lasciare una cella vuota — l'assenza di un dato non è un dato
       favorevole. */
    const dichiarate = numeroDichiarato(c.anomalie);
    if (dichiarate === null) return NON_MISURATO;
    const anomalie = Math.max(0, Math.round(dichiarate));
    return { anomalie, voci: [], dettaglio: [], nominate: false, critica: false,
             gravita: anomalie ? "warn" : "ok", etichetta: etichettaDi(anomalie) };
  }
  const trovate = new Map();
  let critica = false;
  for (const v of voci) {
    if (!v || v.esito !== "no") continue;
    const k = String(v.chiave || v.etichetta || "");
    if (!trovate.has(k)) trovate.set(k, { chiave: k,
      etichetta: String(v.etichetta || v.chiave || "").trim() || "voce senza nome",
      nota: String(v.nota || "").trim(), critica: !!v.critica });
    if (v.critica) critica = true;
  }
  const anomalie = trovate.size;
  /* `voci` sono le etichette nude, per chi deve solo leggerle; `dettaglio`
     porta accanto la CHIAVE (serve a chi unisce più giri: la stessa voce non
     si riconosce dal nome) e la NOTA di chi ha fatto il giro, che il registro
     stampa fra parentesi e che senza questo campo si perderebbe. */
  return { anomalie, voci: [...trovate.values()].map((d) => d.etichetta),
           dettaglio: [...trovate.values()], nominate: true, critica,
           gravita: critica ? "danger" : anomalie ? "warn" : "ok", etichetta: etichettaDi(anomalie) };
}

export function giriDelGiorno(controlli, nome, iso) {
  const giorno = String(iso || "").slice(0, 10);
  const n = nomeBreve(nome);
  const giri = (controlli || []).filter(c =>
    n && nomeBreve(c && c.mezzo) === n && String((c && c.data) || "").slice(0, 10) === giorno);
  /* Le voci si raccolgono in una MAPPA chiave → etichetta: la chiave è
     l'identità (serve a non contare due volte la stessa perdita), l'etichetta
     è quello che si legge («Freni, sterzo e comandi», non «freni»). */
  /* la decisione su UN giro sta in `statoGiro`: qui si sommano i giri della
     giornata, non si ridecide che cosa vuol dire un giro. Le voci restano
     raccolte per chiave DISTINTA — la stessa perdita trovata al mattino e al
     pomeriggio è un problema, non due — mentre quelle non nominate si
     sommano, perché di loro non si sa se siano la stessa cosa. */
  /* la decisione su UN giro sta in `statoGiro`: qui si sommano i giri della
     giornata, non si ridecide che cosa vuol dire un giro. Le voci si uniscono
     per chiave DISTINTA — la stessa perdita trovata al mattino e al pomeriggio
     è un problema, non due — mentre quelle non nominate si sommano, perché di
     loro non si sa se siano la stessa cosa.
     ⚠️ Per unire servono le CHIAVI, non le etichette: `statoGiro` le restituisce
     accanto (`dettaglio`). Una prima stesura provava a ripescarle dall'array
     originale per indice — e gli indici non corrispondono, perché `voci` è già
     deduplicata e l'originale no. */
  const trovate = new Map();
  let critica = false, senzaNome = 0;
  for (const c of giri) {
    const s = statoGiro(c);
    if (s.nominate) {
      for (const d of s.dettaglio) if (!trovate.has(d.chiave)) trovate.set(d.chiave, d.etichetta);
      if (s.critica) critica = true;
    } else senzaNome += s.anomalie;
  }
  const anomalie = trovate.size + senzaNome;
  return {
    giri: giri.length, anomalie, voci: [...trovate.values()],
    gravita: !giri.length ? null : critica ? "danger" : anomalie ? "warn" : "ok",
    etichetta: !giri.length ? "da fare"
      : anomalie === 0 ? "tutto a posto"
      : anomalie === 1 ? "1 da vedere" : anomalie + " da vedere",
  };
}

// ============================================================
// L8 — SEGNALAZIONE GUASTO RAPIDA
// Chi vede un guasto è SULLA MACCHINA, non in ufficio: se per dirlo deve
// tornare al container, aspettare che qualcuno sia libero e farselo scrivere
// da un altro, quel guasto lo dice a voce — e a voce si perde. Qui la strada
// è una sola e corta: che cosa non va, quanto è grave, chi l'ha visto. Da lì
// nasce una manutenzione APERTA sul mezzo, identica a quelle del giro
// macchina: entra nelle priorità del Quadro, si apre come ordine di lavoro,
// si chiude nel registro degli interventi. Nessuna collezione nuova, nessuna
// logica nuova nel Quadro: la stessa strada che il giro macchina percorre
// già da inizio turno.
// ============================================================

/* Tre gradini, non cinque: chi ha i guanti e il motore acceso alle spalle
   sceglie fra cose che si distinguono a colpo d'occhio. Il gradino alto è
   l'unico che fa succedere qualcosa in più — l'app PROPONE di mettere il
   mezzo in verifica — e per questo porta il flag `alta`: la decisione resta
   di chi gestisce il parco, ma la domanda gliela si fa.
   `nota` è la frase che finisce scritta sulla manutenzione: in officina si
   legge quella, non la chiave. */
export const GRAVITA_GUASTO = [
  { chiave: "ferma", etichetta: "Non si può usare", alta: true,
    aiuto: "La macchina non è in condizione di lavorare: va guardata prima di rimetterla in moto.",
    nota: "guasto grave segnalato dalla macchina: non è in condizione di lavorare" },
  { chiave: "limita", etichetta: "Lavora, ma male",
    aiuto: "Il turno si finisce, ma il problema c'è e va messo in programma.",
    nota: "guasto segnalato dalla macchina: lavora, ma con un problema" },
  { chiave: "annota", etichetta: "Piccola cosa",
    aiuto: "Nessuna fretta: si scrive adesso perché non vada persa.",
    nota: "difetto minore segnalato da chi usa la macchina" },
];

// La voce della gravità, o null se la chiave non è una delle tre. Torna null
// e non il gradino più basso: una gravità che non si sa NON è una gravità
// lieve, ed è `validaGuasto` a pretenderla scritta. Pura.
export function gravitaGuasto(chiave) {
  return GRAVITA_GUASTO.find(g => g.chiave === chiave) || null;
}

// Controlli su una segnalazione prima di salvarla. I messaggi dicono che
// cosa fare, non «campo obbligatorio»: chi compila è in piedi accanto alla
// macchina e non ha nessuna voglia di indovinare. Pura e testabile.
export function validaGuasto(dati) {
  const d = dati || {}, errori = {};
  if (!String(d.mezzo || "").trim())
    errori.mezzo = "Non risulta su quale macchina: chiudi e riapri la segnalazione dalla riga del mezzo, nel parco, o dalla sua scheda.";
  const descrizione = String(d.descrizione || "").trim();
  if (!descrizione)
    errori.descrizione = "Scrivi in poche parole che cosa non va — per esempio «perde olio dal braccio»: chi ripara deve sapere cosa cercare prima di arrivare alla macchina.";
  else if (descrizione.length < 3)
    errori.descrizione = "Servono almeno tre lettere: una sigla come «x» in officina non dice niente a chi legge.";
  else if (descrizione.length > 120)
    errori.descrizione = "Qui va la riga corta che si legge nell'elenco (al massimo 120 lettere): il racconto lungo si scrive dopo, nell'ordine di lavoro.";
  if (!gravitaGuasto(d.gravita))
    errori.gravita = "Tocca quanto è grave: serve a decidere se la macchina può finire il turno o se va guardata subito.";
  return {
    ok: Object.keys(errori).length === 0, errori,
    descrizione, segnalatoDa: String(d.segnalatoDa || "").trim(),
  };
}

// Dalla segnalazione alla MANUTENZIONE aperta sul mezzo. Stessa forma di
// quelle del giro macchina (`manutenzioneAperta`), con `origine: "guasto"`:
// è l'unico campo che le distingue, e l'app ci mette sopra l'icona
// dell'avviso. La data è oggi, quindi la riga entra da sola nelle priorità
// del Quadro senza toccare `prioritaOperative`.
// Chi ha segnalato finisce nella nota, e se non è scritto la nota lo DICE:
// «non risulta chi l'ha segnalato» è un'informazione, il silenzio no —
// in officina la prima cosa che si fa è andare a chiedere alla persona.
// Ritorna null se la segnalazione non è valida (chi chiama passa da
// `validaGuasto` e mostra gli errori). Pura e testabile: `oggi` iniettabile.
export function manutenzioneDaGuasto(dati, oggi = new Date()) {
  const v = validaGuasto(dati);
  if (!v.ok) return null;
  const g = gravitaGuasto((dati || {}).gravita);
  return manutenzioneAperta({
    titolo: "Guasto: " + v.descrizione,
    mezzo: nomeBreve((dati || {}).mezzo),
    data: null,
    origine: "guasto",
    nota: g.nota + (v.segnalatoDa ? " · segnalato da " + v.segnalatoDa : " · non risulta chi l'ha segnalato"),
  }, oggi);
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

// LA PROPOSTA quando si sceglie un piano nel form: a quante ore mettere il
// prossimo tagliando, e la frase che lo spiega.
// ⛔ Il punto di questa funzione è quello che NON fa. Prima la pagina scriveva
// `Math.round(+m.ore || 0) + p.ogniOre` e la frase «X ha 0 ore: il tagliando è
// proposto a 500». Su un mezzo SENZA contaore quella frase asserisce un numero
// che il contatore non ha mai dato: non è imprecisa, è falsa. È lo stesso
// `+null === 0` già costato due volte in questo progetto (la base d'asta delle
// gare in Conti, e la finestra del prossimo tagliando).
// Senza le ore non si propone niente: si dice che non si sanno e si offre la
// via d'uscita vera, che è programmarlo per data.
// Pura e testabile: la frase vive qui, non dentro un innerHTML.
export function propostaTagliando(nomeMezzo, oreMezzo, piano) {
  const p = piano || {};
  const passo = Math.round(+p.ogniOre || 0);
  const nome = String(nomeMezzo || "").trim();
  const testaPiano = (p.etichetta || "Tagliando") + (p.nota ? ": " + p.nota : "");
  const coda = passo > 0
    ? " Alla chiusura, il prossimo nascerà da solo a +" + passo + " " + plurale(passo, "ora", "ore") + " sulle ore di quel momento."
    : "";
  if (!nome) return { oreProposte: null, oreNote: false, testo: testaPiano + coda };
  // ⛔ null e "" PRIMA di convertire: `+null` fa 0 e `Number.isFinite(0)` è true
  const grezze = oreMezzo == null || oreMezzo === "" ? NaN : +oreMezzo;
  const oreNote = Number.isFinite(grezze) && grezze >= 0;
  if (!oreNote) {
    return {
      oreProposte: null, oreNote: false,
      testo: testaPiano + " Di " + nome + " non sappiamo le ore del contatore: scrivile tu"
        + (passo > 0 ? ", oppure programma il tagliando per data." : ".") + coda,
    };
  }
  const oreProposte = passo > 0 ? Math.round(grezze) + passo : null;
  return {
    oreProposte, oreNote: true,
    testo: testaPiano + " " + nome + " ha " + mostra(Math.round(grezze), 0) + " " + plurale(Math.round(grezze), "ora", "ore")
      + (oreProposte != null ? ": il tagliando è proposto a " + mostra(oreProposte, 0) + "." : ".")
      + coda,
  };
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
    /* ⚠️ `oreAttuali == null` VA ESCLUSO PRIMA, perché `+null` fa **0** e
       `Number.isFinite(0)` risponde true: senza questa riga un mezzo **senza
       contaore** riceveva il piano a «0 + passo», e la finestra gli diceva
       «il contatore segna adesso 0 ore» — una frase falsa su un numero che
       quel contatore non ha mai dato. È lo stesso `+null === 0` che in questo
       progetto è già costato una volta (la base d'asta delle gare in Conti):
       la forma sbagliata non è `Number.isFinite(x)`, è `Number.isFinite(+x)`
       su un valore che può essere nullo. Trovato il 01/08 da una prova nuova. */
    if (oreAttuali == null || oreAttuali === "") return null;
    const ore = Math.round(+oreAttuali * 10) / 10;
    if (!Number.isFinite(ore) || ore < 0) return null;
    // il prossimo tagliando a ore nasce con la data in cui è scritto: è ciò
    // che gli permette, domani, di sapere su quale contatore parla
    return { ...base, orePreviste: ore + ogniOre, dataPrevista: null, da: "ore", oreBase: ore, scrittaIl: isoGiorno(dataChiusura) };
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

/* ══════════════════════════════════════════════════════════════════════
   IL CONTATORE SOSTITUITO O AZZERATO (04/09)
   ────────────────────────────────────────────────────────────────────────
   Nel mondo un contaore si sostituisce (centralina nuova, quadro cambiato) o
   si azzera, e da quel giorno le ore ricominciano da capo. Fino a oggi Flotta
   non aveva modo di dirlo: `validaRifornimento` rifiutava la lettura più
   bassa, e se entrava per un'altra via `consumoPerMezzo` e `ritmoOreMezzi`
   rispondevano «il contatore è sceso» — per sempre, perché la serie non si
   sarebbe più raddrizzata da sola.
   DOVE VIVE L'EVENTO, e perché lì. L'evento è sulla LETTURA che apre il nuovo
   contatore: il rifornimento porta `contatoreNuovo: true` e `oreVecchie`
   (l'ultima lettura nota del contatore vecchio, presa dal mezzo al momento
   della dichiarazione). Non una lista `azzeramenti` sul mezzo, per tre ragioni
   misurate sul codice:
   · ogni lettore delle ore riceve GIÀ le letture — `consumoPerMezzo
     (rifornimenti)`, `ritmoOreMezzi(letture)` con `letture = [...RIF, ...CTR]`,
     `consumoControStoria(rifornimenti)`, `fascicoloMezzo` e `costoOrarioMezzo`
     che passano i rifornimenti — e nessuno di loro riceve il mezzo: una lista
     sul mezzo avrebbe voluto un argomento in più in cinque firme e in tutti i
     loro chiamanti;
   · la lettura È l'evento: l'unico fatto che chi dichiara ha in mano è «il
     contatore adesso segna X», e `data`/`oreNuove` sono la data e le ore di
     quel pieno — scriverli due volte sarebbe la copia da cui si diverge;
   · le letture hanno tutte la stessa forma `{ mezzo, data, ore }` (pieni e
     giri macchina): domani un giro macchina potrà portare la stessa bandiera
     senza toccare `spezzaLetture`.
   Il prezzo, dichiarato: se si toglie il rifornimento che dichiarava il
   contatore nuovo, le letture dopo tornano «scese» — ed è giusto così, perché
   il fatto che le giustificava non c'è più.
   LA REGOLA DEL CONTO: consumo e ritmo si calcolano sul TRATTO CORRENTE (dalle
   letture dell'ultimo azzeramento in poi), e quando quel tratto è più corto
   del richiesto lo si DICE — «contatore sostituito il …: il conto riparte da
   lì» — invece di uno zero o di un numero fatto sulle due serie incollate. Una
   lettura più bassa SENZA un azzeramento dichiarato resta «sceso»: il difetto
   non si cura nascondendolo. E una lettura SENZA DATA, quando c'è stato un
   azzeramento, non si sa a quale contatore appartenga: si conta a parte
   (`senzaData`) e il consumo si rifiuta, invece di indovinare dal numero.
   ⚠️ Lo stesso giorno dell'azzeramento tutte le letture vanno nel tratto
   nuovo: una lettura del contatore vecchio fatta la mattina della sostituzione
   risulterà «scesa» — che è la verità che il dato porta — e si corregge con la
   data, non con una regola che indovini. */

// Gli azzeramenti dichiarati dentro le letture (di UN mezzo se `nomeMezzo` c'è,
// di tutti se no), in ordine di data: [{ data, oreVecchie|null, oreNuove, nota }].
// Una bandiera senza ore o senza un giorno che esista non è un azzeramento.
export function azzeramentiDelMezzo(letture, nomeMezzo) {
  const n = nomeMezzo == null ? null : nomeBreve(nomeMezzo);
  return (letture || [])
    .filter(l => l && l.contatoreNuovo && (n == null || nomeBreve(l.mezzo) === n))
    // «assente vale null, non zero» è la regola di `shared/`: si chiama, non si riscrive
    .map(l => ({ data: String(l.data || "").slice(0, 10), oreVecchie: numeroDichiarato(l.oreVecchie), oreNuove: numeroDichiarato(l.ore), nota: String(l.nota || "") }))
    .filter(a => dataISOEsiste(a.data) && a.oreNuove != null)
    .sort((a, b) => a.data.localeCompare(b.data));
}

// Divide le letture di un mezzo in tratti: il primo va dall'inizio al primo
// azzeramento, ognuno degli altri ricomincia da un azzeramento. Ritorna
// { tratti: [{ dal, azzeramento, letture }], senzaData }. Senza azzeramenti
// c'è un tratto solo con TUTTE le letture, anche quelle senza data: cioè il
// comportamento di sempre. Pura.
export function spezzaLetture(letture, azzeramenti) {
  const az = (azzeramenti || []).filter(a => a && dataISOEsiste(String(a.data || "").slice(0, 10)))
    .map(a => ({ ...a, data: String(a.data).slice(0, 10) })).sort((a, b) => a.data.localeCompare(b.data));
  const tutte = (letture || []).filter(Boolean);
  if (!az.length) return { tratti: [{ dal: null, azzeramento: null, letture: tutte }], senzaData: [] };
  const tratti = [{ dal: null, azzeramento: null, letture: [] }, ...az.map(a => ({ dal: a.data, azzeramento: a, letture: [] }))];
  const senzaData = [];
  for (const l of tutte) {
    const g = String(l.data || "").slice(0, 10);
    if (!dataISOEsiste(g)) { senzaData.push(l); continue; }
    let i = 0;
    for (let k = 1; k < tratti.length; k++) if (g >= tratti[k].dal) i = k;
    tratti[i].letture.push(l);
  }
  return { tratti, senzaData };
}

// Il tratto su cui si fa il conto: l'ultimo. Prende le letture di UN mezzo
// (con le bandiere dentro) e ritorna { letture, tratti, dal, azzeramento,
// senzaData }. È il posto unico da cui `consumoPerMezzo`, `ritmoOreMezzi` e
// `consumoControStoria` leggono la stessa regola: scritta tre volte
// divergerebbe, come la convenzione sui numeri che è costata una giornata.
export function trattoCorrente(letture) {
  const s = spezzaLetture(letture, azzeramentiDelMezzo(letture));
  const ultimo = s.tratti[s.tratti.length - 1];
  return { letture: ultimo.letture, tratti: s.tratti.length, dal: ultimo.dal, azzeramento: ultimo.azzeramento, senzaData: s.senzaData.length };
}

// La frase, in un posto solo: la leggono il consumo, il ritmo, la storia e la
// riga del mezzo. Vuota se non c'è un azzeramento con una data che esista.
export function fraseContatoreSostituito(azz) {
  if (!azz || !dataISOEsiste(String(azz.data || "").slice(0, 10))) return "";
  return "contatore sostituito il " + dataIt(String(azz.data).slice(0, 10)) + ": il conto riparte da lì";
}

/* IL TAGLIANDO A ORE E IL SUO CONTATORE (04/09, seconda unità). `urgenzaOre`
   confronta le ore previste col contatore ATTUALE, e non sa su quale
   contatore il tagliando è stato scritto: un «Tagliando a 6.000 h» scritto
   sul vecchio contatore, dopo un contatore nuovo che segna 210, diceva
   «tra 5.790 h» — verde, e falso. Il numero non si può raddrizzare da solo
   (le 6.000 sono del vecchio contatore, il 210 del nuovo), quindi la
   risposta giusta è «non confrontabile», col motivo; il conto lo rimette a
   posto una persona, con la proposta qui sotto.
   COME IL TAGLIANDO CONOSCE IL SUO CONTATORE: porta `scrittaIl`, il giorno in
   cui è stato scritto. È un fatto che chi lo legge capisce («scritto il
   10/06, prima della sostituzione del 01/07»), non dipende da un
   identificatore dell'azzeramento (che sparisce se si toglie il pieno che lo
   dichiarava, o si sposta se se ne corregge la data), e la regola è una sola:
   scritto PRIMA dell'ultimo azzeramento → vecchio contatore; lo stesso giorno
   o dopo → quello corrente, come `spezzaLetture` fa con le letture. Chi crea
   o riscrive un tagliando a ore lo salva; quelli in archivio senza la data,
   su un mezzo che ha un azzeramento, sono «non si sa su quale contatore» —
   che non è «va bene». Senza azzeramenti niente cambia: il campo non si legge
   nemmeno, e la dimostrazione resta identica. */

// Su quale contatore è scritto un tagliando a ore, dati gli azzeramenti del
// suo mezzo (`azzeramentiDelMezzo`). Ritorna { calcolabile, noto, scrittaIl,
// azzeramento, perche }: `calcolabile` false quando le ore previste NON si
// possono confrontare col contatore attuale; `noto` false quando la data di
// scrittura manca. Puro.
export function contatoreDelTagliando(man, azzeramenti) {
  const az = (azzeramenti || []).filter(a => a && isoGiorno(a.data))
    .map(a => ({ ...a, data: isoGiorno(a.data) })).sort((a, b) => a.data.localeCompare(b.data));
  const ultimo = az.length ? az[az.length - 1] : null;
  const scrittaIl = isoGiorno(man && man.scrittaIl);
  if (!ultimo) return { calcolabile: true, noto: true, scrittaIl, azzeramento: null, perche: "" };
  const segnava = ultimo.oreVecchie != null && Number.isFinite(+ultimo.oreVecchie)
    ? ", quando segnava " + mostra(+ultimo.oreVecchie, 1) + " h" : "";
  if (!scrittaIl) return { calcolabile: false, noto: false, scrittaIl: null, azzeramento: ultimo,
    perche: "non si sa su quale contatore è scritto: è di prima che Flotta segnasse la data del tagliando, e il contatore è stato sostituito il " + dataIt(ultimo.data) + segnava };
  if (scrittaIl < ultimo.data) return { calcolabile: false, noto: true, scrittaIl, azzeramento: ultimo,
    perche: "scritto il " + dataIt(scrittaIl) + " sul vecchio contatore, sostituito il " + dataIt(ultimo.data) + segnava };
  return { calcolabile: true, noto: true, scrittaIl, azzeramento: ultimo, perche: "" };
}

// L'urgenza di un tagliando a ore CHE SA DI QUALE CONTATORE PARLA: la stessa
// risposta di `urgenzaOre` (cls, label, mancano, oreNote) quando il confronto
// è legittimo, più `calcolabile`, `perche` e `contatore`; «non confrontabile»
// senza colore e senza numero quando non lo è. È il posto da cui la lista,
// la scheda, il libretto, il Quadro e la tessera dei 30 giorni leggono tutti
// la stessa decisione. Senza azzeramenti risponde esattamente `urgenzaOre`.
export function urgenzaTagliando(man, oreAttuali, azzeramenti) {
  const c = contatoreDelTagliando(man, azzeramenti);
  if (!c.calcolabile) return { cls: "", label: "non confrontabile", mancano: null, oreNote: false, calcolabile: false, perche: c.perche, contatore: c };
  return { ...urgenzaOre(man && man.orePreviste, oreAttuali), calcolabile: true, perche: "", contatore: c };
}

// La PROPOSTA per riscrivere sul contatore nuovo un tagliando scritto sul
// vecchio: nuove = previste − oreVecchie + oreNuove (le ore che mancavano sul
// vecchio contatore, contate dal punto in cui il nuovo è partito). È una
// proposta da confermare, non un'operazione: la fa una persona che sa su quale
// contatore era il tagliando. Senza `oreVecchie` non c'è niente da proporre e
// lo dice; se sul nuovo contatore il tagliando risulta già passato, `scaduto`
// e `oltre` lo dicono e `orePreviste` resta null (uno zero non è un piano).
export function propostaRiscrittura(man, azzeramento) {
  const prev = man == null || man.orePreviste == null || man.orePreviste === "" ? NaN : +man.orePreviste;
  const a = azzeramento || {};
  const vec = a.oreVecchie == null || a.oreVecchie === "" ? NaN : +a.oreVecchie;
  const nuo = a.oreNuove == null || a.oreNuove === "" ? NaN : +a.oreNuove;
  if (!Number.isFinite(prev) || prev <= 0) return { ok: false, orePreviste: null, perche: "il tagliando non ha le ore previste" };
  if (!Number.isFinite(nuo)) return { ok: false, orePreviste: null, perche: "non si sa che cosa segnava il contatore nuovo il giorno della sostituzione" };
  if (!Number.isFinite(vec)) return { ok: false, orePreviste: null, perche: "non si sa quante ore segnava il vecchio contatore quando è stato sostituito: le ore sul nuovo vanno scritte a mano" };
  const nuove = Math.round((prev - vec + nuo) * 10) / 10;
  return { ok: true, orePreviste: nuove > 0 ? nuove : null, scaduto: nuove <= 0, oltre: nuove <= 0 ? -nuove : 0,
    mancavano: Math.round((prev - vec) * 10) / 10, oreVecchie: vec, oreNuove: nuo, perche: "" };
}

// Controlli su un rifornimento prima di salvarlo. `oreMezzo` (facoltativo) è
// il contatore attuale del mezzo: il contatore non torna indietro, quindi un
// valore più basso è quasi sempre un errore di battitura — a meno che chi
// riforniva non dichiari `contatoreNuovo` (contaore sostituito o azzerato):
// allora la lettura più bassa passa, e l'evento nasce da questo rifornimento
// (vedi il blocco «IL CONTATORE SOSTITUITO O AZZERATO»). Dichiararlo SENZA
// scrivere le ore è un errore: senza il numero non c'è il punto da cui il
// conto riparte.
// Ritorna { ok, errori:{campo:messaggio}, litri, euro, ore, contatoreNuovo,
// oreVecchie } — `oreVecchie` è `oreMezzo` com'è (o null), da salvare accanto
// alla bandiera perché il mezzo, un attimo dopo, segnerà le ore nuove. Pura.
export function validaRifornimento(dati, oreMezzo) {
  const d = dati || {}, errori = {};
  const contatoreNuovo = !!d.contatoreNuovo;
  // «assente vale null, non zero» è la regola di `shared/`: qui si chiama, non si riscrive
  const oreVecchie = numeroDichiarato(oreMezzo);
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
  if (ro.vuoto && contatoreNuovo) {
    errori.ore = "Hai segnato il contatore come nuovo o azzerato: scrivi che cosa segna adesso, è da lì che riparte il conto.";
  } else if (!ro.vuoto) {
    if (!ro.ok) errori.ore = ro.motivo === "sotto-minimo"
      ? "Il contatore va scritto in ore, un numero da zero in su."
      : messaggioNumero(ro, "le ore del contatore", { unita: "h", min: 0 });
    else if (!contatoreNuovo && Number.isFinite(+oreMezzo) && ro.valore + 0.5 < +oreMezzo)
      errori.ore = "Il contatore segna meno " + plurale(+oreMezzo, "di ", "delle ") + mostra(+oreMezzo, 1) + " " + plurale(+oreMezzo, "ora già registrata", "ore già registrate") + " sul mezzo: controlla il numero, oppure segna che il contatore è nuovo o azzerato.";
    else ore = ro.valore;
  }
  /* ⛔ LA PORTA DAVANTI DEVE ESSERE LARGA QUANTO QUELLA DIETRO. Con la sola
     forma, un rifornimento datato «30 febbraio» si salvava (`ok: true`) e poi
     `ritmoOreMezzi` — che adesso passa da `isoGiorno` — quella lettura del
     contatore la buttava via: l'utente ne aveva scritte due e l'app gli
     rispondeva «c'è una sola lettura del contatore». Misurato il 03/08.
     `isoGiorno` non si può usare qui perché è definita più in basso nel file:
     è lo stesso predicato di `shared/`, chiamato per nome. */
  const iso = String(d.data || "").slice(0, 10);
  if (!dataISOEsiste(iso)) errori.data = "Serve il giorno del rifornimento.";
  return {
    ok: Object.keys(errori).length === 0, errori,
    litri: Number.isFinite(litri) ? Math.round(litri * 100) / 100 : 0,
    euro: Number.isFinite(euro) ? Math.round(euro * 100) / 100 : 0,
    ore, contatoreNuovo, oreVecchie: contatoreNuovo ? oreVecchie : null,
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
    // la bandiera del contatore nuovo viaggia col pieno: è la lettura che apre
    // il tratto nuovo (vedi «IL CONTATORE SOSTITUITO O AZZERATO»)
    v.pieni.push({ data: String(r.data || "").slice(0, 10), litri, euro, ore: Number.isFinite(oreN) && oreN > 0 ? oreN : null,
      contatoreNuovo: !!r.contatoreNuovo, oreVecchie: r.oreVecchie });
    v.litri += litri; v.euro += euro;
    per.set(mezzo, v);
    totaleLitri += litri; totaleEuro += euro;
  }
  const mezzi = [...per.values()].map(v => {
    /* IL TRATTO CORRENTE: dall'ultimo contatore dichiarato nuovo in poi. Senza
       dichiarazioni è un tratto solo con tutte le letture, cioè il conto di
       sempre. Le letture senza data, quando un azzeramento c'è stato, non si
       sa a quale contatore appartengano: `tc.senzaData` le conta e più sotto
       il consumo si rifiuta invece di indovinare dal numero. */
    const tc = trattoCorrente(v.pieni.filter(p => p.ore != null));
    const conOre = tc.letture.slice().sort((a, b) => a.ore - b.ore);
    let litriOra = null, euroOra = null, oreCoperte = null, perche = "", da = null, a = null;
    let litriInFinestra = null, euroInFinestra = null, pieniInFinestra = 0, pieniSenzaEuro = 0;
    /* ⛔ UN CONTATORE CHE SCENDE È UN ERRORE, NON UNA FINESTRA CORTA.
       `conOre` è ordinato per ORE, non per data — scelta buona, perché una
       lettura senza data non deve né allargare né restringere la finestra —
       ma con un errore di dito diventa una bugia: misurato su tre pieni con
       il contatore a 5600 (01/06), 5750 (15/06) e **4870** (01/07, una cifra
       sbagliata), l'ordinamento per ore metteva PRIMA la lettura di luglio,
       calcolava `oreCoperte = 5750 − 4870 = 880` e rispondeva **0,68 l/h**
       dove il consumo vero è 2,22 — un terzo, e nella direzione che
       rassicura («questa macchina beve pochissimo»).
       `ritmoOreMezzi`, sugli stessi dati, quel numero si RIFIUTA di darlo
       («fra la prima e l'ultima lettura il contatore non è salito»): erano
       due letture dello stesso fatto, e solo una delle due si difendeva.
       Il caso entra dalla via vera: `validaRifornimento` confronta la lettura
       col contatore del MEZZO, e per una macchina senza contaore (`ore: null`,
       che è quello che `parseMezziCsv` scrive quando è illeggibile) la pagina
       gli passa `+m.ore || 0`, cioè zero: qualunque numero passa.
       La guardia guarda solo le letture CHE HANNO UNA DATA, in ordine di
       data, con le stesse due chiavi di `ritmoOreMezzi` — la seconda
       (`a.ore - b.ore`) serve alle letture dello stesso giorno, che si
       registrano in qualunque ordine e non devono far scattare niente.
       ⚠️ E la controprova su quella seconda chiave dice «non distingue», ed è
       onesto scriverlo: togliendola non cade nessuna prova, perché `conOre`
       ARRIVA QUI GIÀ ORDINATO PER ORE e l'ordinamento per data è stabile —
       cioè il caso dello stesso giorno è già difeso a monte. È la seconda
       delle cinque cause («il codice è difeso in profondità»), non un difetto
       che non c'è: la chiave resta perché questa guardia non deve dipendere
       da come `conOre` è ordinato altrove, e perché è la stessa coppia di
       chiavi che `ritmoOreMezzi` usa per la stessa domanda. */
    const conData = conOre.filter(x => dataISOEsiste(x.data))
      .slice().sort((a, b) => a.data.localeCompare(b.data) || a.ore - b.ore);
    let sceso = false;
    for (let i = 1; i < conData.length; i++) if (conData[i].ore < conData[i - 1].ore) sceso = true;
    /* ⛔ E LA GUARDIA QUI SOPRA ERA CIECA PROPRIO SUGLI ESTREMI, cioè sulle due
       letture che il conto usa per costruire il denominatore.
       ⚠️ ONESTÀ, PRIMA DI TUTTO: questo difetto era **DORMIENTE** e non è mai
       arrivato a nessuno. L'unica via di scrittura di un rifornimento è il
       form, e `validaRifornimento` pretende un giorno che esista
       (`dataISOEsiste`); non c'è nessun lettore CSV dei rifornimenti. Chi
       legge questo blocco non ha trovato un difetto vivo: ha trovato una porta
       aperta dietro una porta chiusa. Si chiude perché la porta davanti può
       aprirsi domani — un import dei pieni è la cosa più naturale da scrivere —
       e allora questo tacerebbe.
       Il difetto, misurato: `sceso` guarda le letture CHE HANNO UNA DATA, ma
       `oreCoperte` si costruisce sui due estremi di `conOre`, che è ordinato
       per ORE e le contiene TUTTE. Una lettura senza data con una cifra
       sbagliata scivola in testa e entra nel denominatore senza mai passare
       dalla guardia:
         5600 (01/06) · 5750 (15/06) · 4870 (senza data)
           → 0,91 l/h, nessun «perche», finestra 01/06 → 15/06
         le stesse tre CON la data → null, «il contatore è sceso»
       ⚠️ Il segno che non serve sapere quale delle due letture sia quella vera:
       **togliere la data MIGLIORA il verdetto.** Un `null` diventa un numero,
       e per giunta un numero che si smentisce da solo — 880 ore in 14 giorni
       sono 62 ore al giorno, che una macchina non le fa. L'assenza di un dato
       non è un dato favorevole, e qui era addirittura un dato migliore.
       ⛔ LE DUE CURE PIÙ CORTE SONO STATE PROVATE E SCARTATE COL NUMERO, perché
       nessuno le rifaccia alla cieca:
       · calcolare le sole ORE sulle letture datate lasciando i litri su tutte
         spezza il conto — numeratore e denominatore parlerebbero di due periodi
         diversi, ed è esattamente il difetto che `da`/`a` esistono per
         impedire: sul caso qui sopra dà **5,33 l/h**, più sbagliato di prima;
       · portare anche i litri sulle sole datate non è prudente in nessuna
         direzione: sul caso qui sopra il numero SALE (0,91 → 3,33), sul caso
         opposto SCENDE (2,00 → 1,11), cioè butterebbe via del gasolio vero
         nella direzione che rassicura.
       Quello che regge non inventa nessun numero e non perde nessun dato: una
       lettura senza data **non si sa collocare nel tempo, quindi non può fare
       da estremo a un intervallo di ore**. Se sta in mezzo non delimita niente
       e i suoi litri restano nel conto — quel caso continua a calcolarsi. Se
       sta a un estremo il consumo si rifiuta e la riga dice che cosa fare, che
       è la stessa forma già usata per il contatore sceso. */
    const estremiSenzaData = conOre.length >= 2
      && (!dataISOEsiste(conOre[0].data) || !dataISOEsiste(conOre[conOre.length - 1].data));
    const sostituito = tc.tratti > 1 ? fraseContatoreSostituito(tc.azzeramento) : "";
    if (tc.senzaData > 0) {
      perche = sostituito + ", ma " + (tc.senzaData === 1 ? "un rifornimento con il contatore non ha il giorno" : tc.senzaData + " rifornimenti con il contatore non hanno il giorno")
        + ": senza la data non si sa a quale contatore " + (tc.senzaData === 1 ? "appartiene" : "appartengono") + ". Scrivi il giorno e il consumo si calcola da solo";
    } else if (conOre.length < 2) {
      perche = sostituito
        ? sostituito + (conOre.length === 1
            ? ", e serve un secondo rifornimento con le ore del nuovo contatore"
            : ", e non c'è ancora nessun rifornimento con le ore del nuovo contatore")
        : conOre.length === 1
          ? "serve almeno un secondo rifornimento con il contatore delle ore"
          : "nessun rifornimento porta il contatore delle ore";
    } else if (sceso) {
      perche = "fra due rifornimenti il contatore è sceso: una delle due letture è sbagliata, e finché non è corretta il consumo non si può calcolare";
    } else if (estremiSenzaData) {
      perche = "il primo o l'ultimo rifornimento non ha il giorno: senza quella data non si sa in che ordine sono stati fatti, e le ore fra i due estremi non si possono contare. Scrivi il giorno e il consumo si calcola da solo";
    } else {
      oreCoperte = conOre[conOre.length - 1].ore - conOre[0].ore;
      if (oreCoperte > 0) {
        const dopoIlPrimo = conOre.slice(1);
        const l = dopoIlPrimo.reduce((t, p) => t + p.litri, 0);
        const e = dopoIlPrimo.reduce((t, p) => t + p.euro, 0);
        litriOra = Math.round(100 * l / oreCoperte) / 100;
        euroOra = e > 0 ? Math.round(100 * e / oreCoperte) / 100 : null;
        /* ⛔ IL GASOLIO DELLA FINESTRA, CALCOLATO QUI E BASTA (05/08). Questi
           sono gli stessi litri e gli stessi euro su cui `litriOra` e `euroOra`
           sono già costruiti — il primo pieno si scarta perché ha alimentato
           ore PRECEDENTI alla prima lettura. Fino a stamattina
           `costoOrarioMezzo` non li leggeva: si prendeva `euro`, cioè TUTTO il
           gasolio del mezzo, primo pieno compreso, e lo divideva per le ore
           della finestra. Erano due conti della stessa cosa, e divergevano —
           sulla Pala P1 del +93,7%. Adesso il conto sta in un posto solo e chi
           lo vuole lo LEGGE (non lo rifà, e nemmeno lo ricava da
           `euroOra × oreCoperte`, che sarebbe un terzo conto arrotondato).
           ⚠️ `pieniSenzaEuro` è la parte scomoda: l'euro del rifornimento è
           FACOLTATIVO (`validaRifornimento` lo lascia vuoto senza protestare),
           quindi un pieno registrato senza la spesa fa scendere questo
           numeratore e il €/h esce più BASSO del vero — cioè il numero
           tranquillo su un dato che manca. Chi lo usa deve poterlo dichiarare. */
        litriInFinestra = Math.round(100 * l) / 100;
        euroInFinestra = Math.round(100 * e) / 100;
        pieniInFinestra = dopoIlPrimo.length;
        pieniSenzaEuro = dopoIlPrimo.filter(p => !(p.euro > 0)).length;
        /* LA FINESTRA che quelle ore coprono. Le ore da sole dicono QUANTO ha
           lavorato la macchina, non DA QUANDO A QUANDO: e senza quel «da
           quando a quando» chi divide una spesa per quelle ore non sa se
           numeratore e denominatore parlano dello stesso periodo (è il difetto
           che `costoOrarioMezzo` aveva, e che gonfiava il €/h fino al doppio).
           Le date vengono dalle STESSE letture da cui escono le ore — non da
           un secondo conto — e si prendono la più vecchia e la più recente
           fra quelle scritte per bene: una lettura senza data non allarga la
           finestra e non la restringe, semplicemente non la delimita. Con meno
           di due date leggibili la finestra non c'è: `null`, non una data
           inventata al posto dell'altra. */
        const date = conOre.map(p => p.data).filter(dataISOEsiste).sort();
        if (date.length >= 2) { da = date[0]; a = date[date.length - 1]; }
      } else {
        oreCoperte = null;
        perche = "fra i rifornimenti il contatore non è cambiato";
      }
    }
    /* ⛔ IL PREZZO AL LITRO SI DIVIDE PER I LITRI CHE HANNO UN PREZZO.
       La spesa del rifornimento è FACOLTATIVA (`validaRifornimento` la lascia
       vuota senza protestare), e fino al 03/08 `euroLitro` era «tutti gli euro
       diviso TUTTI i litri»: i litri di un pieno registrato senza la spesa
       finivano al denominatore con zero euro sopra, e il prezzo usciva più
       BASSO del vero. Misurato su tre pieni da 300 l, due a 450 €: la riga
       scriveva «1,000 €/l» dove il gasolio pagato costa **1,500 €/l** — un
       terzo in meno, e nella direzione che rassicura (il gasolio sembra a
       buon mercato proprio quando qualcuno non ha scritto quanto è costato).
       Adesso il denominatore sono i litri dei pieni che portano la spesa, e
       quanti pieni restano fuori lo dice `senzaSpesa`, perché la riga possa
       scriverlo invece di far passare per misurato ciò che non lo è.
       ⚠️ `pieniSenzaEuro` è un'altra cosa e resta: quello conta i pieni DELLA
       FINESTRA (dal secondo in poi), perché serve a `costoOrarioMezzo` per
       dichiarare che il €/h è un minimo. Qui si guarda tutto il mezzo. */
    const litriConEuro = Math.round(v.pieni.filter(x => x.euro > 0).reduce((t, x) => t + x.litri, 0) * 10) / 10;
    const senzaSpesa = v.pieni.filter(x => !(x.euro > 0)).length;
    return {
      mezzo: v.mezzo, pieni: v.pieni.length, litri: Math.round(v.litri * 10) / 10,
      euro: Math.round(v.euro * 100) / 100,
      euroLitro: litriConEuro > 0 && v.euro > 0 ? Math.round(1000 * v.euro / litriConEuro) / 1000 : null,
      litriConEuro, senzaSpesa,
      oreCoperte, litriOra, euroOra, perche, da, a,
      litriInFinestra, euroInFinestra, pieniInFinestra, pieniSenzaEuro,
      // quanti tratti ha la serie del contatore e da quando corre quello su
      // cui il conto è fatto (null = un contatore solo, da sempre)
      tratti: tc.tratti, contatoreDal: tc.dal, oreVecchie: tc.azzeramento ? tc.azzeramento.oreVecchie : null,
    };
  }).sort((a, b) => (b.litriOra == null ? -1 : b.litriOra) - (a.litriOra == null ? -1 : a.litriOra)
    || a.mezzo.localeCompare(b.mezzo, "it"));
  /* ⛔ E IL TOTALE DELLA FLOTTA VA DICHIARATO ANCH'ESSO UN MINIMO (07/08).
     `senzaSpesa` di riga difendeva la singola macchina, ma il riepilogo in
     cima alla schermata somma `totaleLitri` e `totaleEuro` e li mette uno
     accanto all'altro: con un pieno senza il prezzo i litri salgono e gli
     euro no, quindi chi legge «3.820 l per 5.307 €» ne ricava 1,39 €/l dove
     il gasolio pagato costa 1,50. Nessuno lo scrive, quel 1,39: lo fa il
     lettore, ed è per questo che il numero è tranquillo — non c'è niente da
     leggere che sia falso, manca solo la riga che dice che il conto non è
     tutto. Il conto sta QUI e non nella pagina: sommare a mano nella pagina
     i `senzaSpesa` delle righe sarebbe la seconda copia di una regola che
     questa funzione sa già. */
  return {
    mezzi, totaleLitri: Math.round(totaleLitri * 10) / 10,
    totaleEuro: Math.round(totaleEuro * 100) / 100,
    calcolabili: mezzi.filter(m => m.litriOra != null).length,
    senzaSpesa: mezzi.reduce((t, m) => t + m.senzaSpesa, 0),
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
  /* ⛔ «NESSUNO HA SCRITTO QUANTO È COSTATO» NON È «NON È COSTATO NIENTE», e il
     libretto è il posto peggiore dove confonderle: è la pagina che si stampa e
     si esporta, quella che legge un compratore o un ispettore.
     Chiudere un ordine di lavoro senza scrivere niente è normale e previsto —
     la finestra della chiusura lo dice, «su questo lavoro non è ancora scritto
     niente: nessuna ora, nessun ricambio» — e produce un intervento con
     `costo: 0`. Misurato aprendo la pagina: una macchina con tre interventi
     chiusi così mostrava la tessera «Officina € 0,00» in VERDE accanto a
     «Consumo —» e «Gasolio —», che invece dichiarano di non sapere; e il CSV
     del libretto scriveva `totale officina;interventi chiusi;;3 interventi;0`,
     cioè uno zero che chi apre il foglio somma credendolo misurato.
     La distinzione esisteva già in casa: `costoOrarioMezzo` conta gli
     `interventiSenzaCosto` e dichiara il conto `parziale`. Qui mancava, ed è
     lo stesso dato. `totale` NON cambia (sono soldi veri e vanno detti);
     quello che si aggiunge è di che cosa è fatto quel numero. */
  const senzaCosto = interventi.filter(w => !(+w.costo > 0)).length;
  // FERMI della macchina (L6): quanti, quanto sono durati, se ne ha uno
  // aperto adesso. Nel libretto è la pagina che un compratore guarda per
  // prima, e l'unica onesta: senza, «tenuta bene» è una parola.
  const fermi = fermiOrdinati((d.fermi || []).filter(mio), oggi);
  /* ⛔ UN FERMO CHE NON SO COLLOCARE NON È UN FERMO DA ZERO GIORNI. La regola
     stava già in casa — `affidabilitaFlotta` conta a parte i fermi senza date
     leggibili (`senzaDate`) e la pagina lo dichiara, «quindi la disponibilità
     qui sopra è più alta di quella vera» — e il fascicolo se n'era tenuta una
     versione più debole: `t + (f.giorni || 0)`, che somma **zero** proprio
     dove `durataFermo` ha risposto `null` («non lo so»).
     È il posto peggiore dove farlo: il fascicolo è il libretto che si stampa
     e si consegna a chi compra la macchina, e l'errore va nella direzione che
     rassicura — meno giorni di fermo, macchina che sembra tenuta meglio.
     Misurato su tre fermi, due con le date non leggibili: la riga del foglio
     scriveva «3 fermi registrati per 5 giorni in tutto» sopra tre righe che
     dicono «—», «—» e «5 giorni». Chi conta le righe trova un numero, chi
     legge la frase ne trova un altro.
     Adesso il totale è fatto dei soli fermi misurabili e `senzaDurata` dice
     quanti sono rimasti fuori, perché la pagina possa scriverlo. */
  const fermiConDurata = fermi.filter(f => Number.isFinite(f.giorni));
  const giorniFermoTot = fermiConDurata.reduce((t, f) => t + f.giorni, 0);
  const oreLavorate = interventi.reduce((t, w) => t + (+w.oreManodopera || 0), 0);
  return {
    mezzo: m, nome, tipo: tipoMezzoDi(m),
    manutenzioni, interventi, scadenze, controlli, rifornimenti, consumo, fermi,
    officina: { totale: Math.round(officina * 100) / 100, interventi: interventi.length,
      ore: Math.round(oreLavorate * 100) / 100,
      // quanti interventi non portano il loro costo, e se di questa macchina
      // si sa almeno in parte quanto è costata l'officina
      senzaCosto, misurato: officina > 0, parziale: officina > 0 && senzaCosto > 0 },
    fermo: { episodi: fermi.length, giorni: giorniFermoTot,
      // quanti fermi NON sono in quel totale perché il giorno d'inizio (o
      // quello di ripartenza) non si legge: `giorni` da solo non lo direbbe
      senzaDurata: fermi.length - fermiConDurata.length,
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

/* Un giorno ISO che ESISTE, oppure null. Serve sia alle scorte sia ai fermi.
   ⛔ QUI C'ERA `/^\d{4}-\d{2}-\d{2}$/`, cioè un controllo di FORMA, e la forma
   non difende: «2026-02-30» ce l'ha buona e quel giorno non esiste.
   `Date.parse` non lo rifiuta — lo fa SCORRERE al 2 marzo — mentre su
   «2026-07-32» risponde `NaN`. Due modi diversi di sbagliare dallo stesso
   buco, misurati il 03/08 su questo file:
     · SCORRE → un fermo «dal 30 febbraio al 5 marzo» usciva lungo **4 giorni**
       e `validaFermo` lo salvava dicendo ok; un fermo aperto al 30 febbraio si
       scriveva «fermo da 155 giorni»; due letture del contatore, la prima al 30
       febbraio, davano un ritmo d'uso di **6,67 h/gg** su 150 giorni coperti che
       nessuno ha misurato;
     · NaN → e questo è il danno grosso, la stessa forma di Conti: `giorniFra`
       rispondeva `NaN`, `NaN <= 0` è **false**, quindi il fermo NON veniva
       scartato dal filtro e `persi += NaN` portava a NaN **tutto** il conto del
       parco — `persi`, `disponibili`, `pct`, `durataMedia`, `fraUnFermoELaltro`.
       Sullo schermo: «Disponibilità reale NaN% … meno NaN persi per fermo =
       NaN giorni-macchina lavorabili … lunghi in media NaN giorni». Una riga
       storta e la pagina dei fermi non dice più niente di vero.
   L'unica cosa che difende è `dataISOEsiste`, che sta in `shared/` da mesi.
   ⛔ E SI CORREGGE QUI, IN UN PREDICATO SOLO — come ha fatto Terra con
   `rilievoUsabileConData` — non nei nove chiamanti: `giorniFra` non riceve mai
   una stringa che non sia passata di qui o da `oggiIso`.
   Misurato che non toglie niente di buono: 4.018 giorni veri dal 2020 al 2030,
   zero trattati diversamente da prima. */
const isoGiorno = (v) => {
  const s = String(v || "").slice(0, 10);
  return dataISOEsiste(s) ? s : null;
};
/* Giorni interi fra due giorni ISO (b − a). Non usa il fuso: le date sono
   giorni di calendario, non istanti.
   ⛔ E CHIEDE A `isoGiorno` INVECE DI FIDARSI DI CHI CHIAMA. Oggi le quattro
   chiamate le passano stringhe che vengono di lì o da `oggiIso`, quindi
   correggere il predicato basterebbe; ma un aiutante che si difende solo
   grazie a com'è chiamato oggi è difeso finché nessuno lo chiama diversamente,
   e non c'è niente sulla riga che lo dica. Costa due righe e toglie il punto
   dal censimento invece di dichiararlo falso allarme.
   ⚠️ La risposta al «non lo so» qui è `NaN` e NON `null`, ed è una scelta: i
   chiamanti scrivono `giorniFra(i, fine) + 1` per contare le giornate a
   estremi inclusi, e `null + 1` fa **1** — un giorno di fermo inventato in
   silenzio — mentre `NaN + 1` resta NaN e si vede. */
const giorniFra = (a, b) => {
  const g0 = isoGiorno(a), g1 = isoGiorno(b);
  if (!g0 || !g1) return NaN;
  return Math.round((Date.parse(g1 + "T12:00:00Z") - Date.parse(g0 + "T12:00:00Z")) / 86400000);
};

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
  /* ⛔ E QUI L'ASSENZA TIRA DALLA PARTE PERICOLOSA. Un intervento che ha
     consumato pezzi ma il cui giorno non si legge esce dal conto: il consumo al
     giorno scende, e con lui il punto di riordino — cioè il magazzino si
     svuota prima del previsto. Prima del 03/08 il difetto era l'opposto e più
     vistoso (una data «30 febbraio» entrava eccome: misurato, il consumo di un
     filtro passava da 0,0222 a 0,2444 pezzi/giorno e la soglia proposta da 1 a
     4). In tutt'e due i versi la risposta è la stessa: contarli e dichiararli,
     mai lasciarli sparire. */
  let senzaData = 0;
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
    if (!d) {
      // si conta solo chi avrebbe avuto qualcosa da dire: un intervento senza
      // ricambi non manca al conto dei ricambi
      const conPezzi = (Array.isArray(w.ricambiUsati) && w.ricambiUsati.length)
        || String((w && w.ricambio) || "").trim() !== "";
      if (conPezzi) senzaData++;
      continue;
    }
    if (d < da || d > a) continue;
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
  return { finestra, da, a, righe, interventi: considerati, daInterventiVecchi: stimati, senzaData };
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
    /* ⛔ IL RIPIEGO SILENZIOSO DI QUESTO CONTO, DICHIARATO. Un intervento
       VECCHIO nomina il pezzo (`w.ricambio`) e la QUANTITÀ non la scrive
       nessuno: `consumoRicambi` ne conta **1**, che è la sola cosa
       ragionevole da fare, ma è una costante messa al posto di un ingresso —
       non una misura. Da lì passa tutto: pezzi → consumo al giorno → soglia
       proposta → pezzi da ordinare → spesa, cioè i numeri che si leggono
       sullo schermo e nella lista della spesa.
       Misurato: sei interventi vecchi su un filtro consumato davvero a 3 per
       volta danno «soglia 1 · da ordinare 0 · 0 €» dove il vero è «soglia 2 ·
       da ordinare 1 · 48 €» — cioè nella direzione che RASSICURA, un
       magazzino proposto più magro del vero. E con un pezzo che si consuma a
       frazioni (olio, grasso) l'errore può andare anche dall'altra parte:
       quello che si sa con certezza non è il verso, è che quel numero poggia
       su quantità che nessuno ha scritto.
       `daInterventiVecchi` il conto lo dava già — ed era il PROBLEMA: un
       numero che non legge nessuno non protegge niente. `attendibile` è la
       bandiera del vocabolario chiuso (regola 20 di run-stile), e la legge la
       pagina in tutt'e due i posti in cui legge già `senzaData`: il riepilogo
       delle scorte e la lista della spesa. */
    attendibile: cons.daInterventiVecchi === 0,
    // gli interventi con pezzi che non hanno un giorno leggibile: non entrano
    // nel consumo, quindi la soglia proposta è calcolata su meno di tutto
    senzaData: cons.senzaData,
    consegna: Math.round(+o.consegnaGiorni || 0), sicurezza: Math.max(0, Math.round(+o.sicurezzaGiorni || 0)),
    daOrdinare: righe.filter(r => r.daOrdinare > 0).length,
    /* ⛔ LA QUARTA DICHIARAZIONE D'INCERTEZZA DI QUESTO CONTO, e mancava proprio
       dove il numero si legge per intero. La riga sa già dire la verità —
       `prezzo: +r.prezzo > 0 ? +r.prezzo : null` e `spesa: … : null`, cioè la
       decisione 3 di `parseRicambiCsv` («il PREZZO che manca resta null: uno
       zero farebbe sembrare gratis un pezzo che gratis non è») — e poi il
       totale se ne teneva una copia più debole, `t + (r.spesa || 0)`, che di
       quel `null` fa uno ZERO. È la copia debole scritta dove il documento si
       compone, un piano sopra la riga che aveva ragione.
       Misurato su 3 pezzi da ordinare di cui 2 senza prezzo: «da ordinare 3 ·
       spesa 144 €» dove i due muti valgono 600 € che nessuno dichiara — e la
       direzione è quella che RASSICURA, una lista della spesa più magra del
       vero.
       ⚠️ E la seconda faccia è peggiore, perché non stampa un numero sbagliato:
       stampa il SILENZIO. Se NESSUNO dei pezzi da ordinare ha un prezzo,
       `spesaTotale` è `0`, e i due lettori scrivono `p.spesaTotale ? … : "."` —
       cioè su 6 pezzi da comprare la frase finisce con un punto e non dice
       niente. Misurato: 2 righe, 6 pezzi, zero parole.
       Il totale NON diventa `null`: resta la somma di quello che si SA, cioè
       un minimo vero, ed è la stessa forma che `costoOrdine` usa per la stessa
       domanda dieci schermate più in là (`ricambi.costo` + `senzaPrezzo`) e che
       `costoOrarioMezzo` usa per il €/h. Quello che mancava è il numero accanto
       che impedisce di leggerlo come completo, e lo leggono tutt'e due i posti
       che leggono già `senzaData` e `attendibile`: il riepilogo delle scorte e
       la lista della spesa. */
    senzaPrezzo: righe.filter(r => r.daOrdinare > 0 && r.prezzo == null).length,
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
  /* «meteo» (04/09, dal delta della ricerca sulla telematica): è una delle
     famiglie che il mondo tiene separate, perché un fermo per pioggia o gelo
     non dice niente sulla macchina — e finché finiva in «altro» la
     disponibilità meccanica si portava dentro giorni che non sono suoi. */
  { chiave: "meteo", etichetta: "Meteo", nota: "Pioggia, gelo, vento: la macchina è a posto, è il cantiere che è fermo." },
  { chiave: "altro", etichetta: "Altro motivo", nota: "Scrivi nelle note di cosa si è trattato." },
];

export function causaleFermo(chiave) {
  return CAUSALI_FERMO.find(c => c.chiave === chiave) || null;
}

/* LA NATURA DI UN FERMO: SCELTO O SUBÌTO (04/09, candidato (d) del delta
   sulla telematica). Il mondo del mining separa i fermi decisi dal gestore
   (manutenzione programmata, verifiche: la macchina è a posto, si è scelto di
   fermarla) da quelli subìti (guasti, gomme, attesa ricambi, operatore che
   manca, meteo): la disponibilità «meccanica» guarda i secondi. Qui la natura
   si RICAVA dalla causale — non è un campo in più da compilare — e «altro» o
   una chiave sconosciuta rispondono null: non classificato, che si dichiara
   e non si spalma su nessuna delle due. */
const NATURA_CAUSALE = {
  "guasto-meccanico": "subito", "guasto-idraulico": "subito", "guasto-elettrico": "subito",
  "gomme-cingoli": "subito", "attesa-ricambi": "subito", "operatore": "subito", "meteo": "subito",
  "manutenzione": "scelto", "verifica": "scelto",
};
export function naturaFermo(chiave) {
  return NATURA_CAUSALE[String(chiave || "")] || null;
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
/* UN FERMO SI PUÒ COLLOCARE NEL TEMPO se il giorno in cui è cominciato esiste
   e — quando una ripartenza è SCRITTA — esiste anche quella. Predicato unico,
   perché la domanda «questo fermo lo so mettere sul calendario?» la fanno in
   tre (`giorniFermo`, `durataFermo`, `affidabilitaFlotta`) e scritta tre volte
   si stacca.
   ⛔ E DISTINGUE «NESSUNA RIPARTENZA» DA «RIPARTENZA CHE NON SI LEGGE»: fino al
   03/08 `durataFermo` faceva `aperto: !isoGiorno(f.fine)`, cioè una data di
   ripartenza illeggibile diventava «la macchina è ancora ferma» — una frase
   che nessuno ha misurato, sull'unico dato che dice il contrario. Pura. */
export function fermoCollocabile(fermo) {
  const f = fermo || {};
  if (!isoGiorno(f.inizio)) return false;
  const fin = String(f.fine == null ? "" : f.fine).trim();
  return fin === "" || !!isoGiorno(fin);
}

/* IL TRATTO di finestra che un fermo occupa davvero: gli stessi estremi che
   `giorniFermo` usava per contare, restituiti invece di essere buttati.
   ⛔ Serve perché SOMMARE le durate non è contare i giorni: due fermi
   sovrapposti sulla stessa macchina sommano 60 giorni su una finestra di 30,
   e la sottrazione `giorniMacchina − persi` non poteva accorgersene — il
   `Math.max(0, …)` la teneva a galla. Chi deve sapere quanti giorni una
   macchina è stata ferma DAVVERO ha bisogno degli estremi, non del totale.
   `null` quando il fermo non tocca la finestra: assente ≠ zero giorni. Pura. */
export function intervalloFermo(fermo, da, a) {
  const f = fermo || {};
  if (!fermoCollocabile(f)) return null;
  const i = isoGiorno(f.inizio), fin = isoGiorno(f.fine);
  const d0 = isoGiorno(da), d1 = isoGiorno(a);
  if (!i || !d0 || !d1) return null;
  const inizio = i > d0 ? i : d0;
  const fine = (fin && fin < d1) ? fin : d1;
  if (fine < inizio) return null;
  return { inizio, fine, giorni: giorniFra(inizio, fine) + 1 };
}

/* GIORNI DISTINTI coperti da un insieme di tratti: l'unione, non la somma.
   Due tratti che si toccano o si sovrappongono valgono i giorni che occupano
   una volta sola; due staccati si sommano. È il numero che si può sottrarre
   dai giorni-macchina, perché per costruzione non li supera. Pura. */
export function giorniDistinti(intervalli) {
  const v = [...(intervalli || [])].filter(Boolean)
    .sort((x, y) => String(x.inizio).localeCompare(String(y.inizio)));
  let tot = 0, curI = null, curF = null;
  for (const it of v) {
    if (curI === null) { curI = it.inizio; curF = it.fine; continue; }
    // «adiacente» conta come continuo: il giorno dopo la ripartenza è già
    // coperto dal fermo seguente, non c'è nessun giorno di lavoro in mezzo
    if (giorniFra(curF, it.inizio) <= 1) { if (it.fine > curF) curF = it.fine; }
    else { tot += giorniFra(curI, curF) + 1; curI = it.inizio; curF = it.fine; }
  }
  if (curI !== null) tot += giorniFra(curI, curF) + 1;
  return tot;
}

export function giorniFermo(fermo, da, a) {
  const t = intervalloFermo(fermo, da, a);
  return t ? t.giorni : 0;
}

// Durata di un fermo così com'è, senza finestre: quello che si scrive sulla
// riga. Un fermo aperto conta fino a oggi e lo dichiara. Pura.
export function durataFermo(fermo, oggi = new Date()) {
  const f = fermo || {};
  // «aperto» lo decide se una ripartenza è STATA SCRITTA, non se si riesce a
  // leggerla: una data storta non rimette la macchina in moto (vedi
  // `fermoCollocabile`).
  const scritta = String(f.fine == null ? "" : f.fine).trim() !== "";
  const fin = scritta ? isoGiorno(f.fine) : null;
  const aperto = !scritta;
  const i = isoGiorno(f.inizio);
  if (!i || (scritta && !fin)) return { giorni: null, aperto, fine: fin };
  const oggiI = oggiIso(oggi);
  const fine = fin || oggiI;
  if (fine < i) return { giorni: null, aperto, fine: fin };
  return { giorni: giorniFra(i, fine) + 1, aperto, fine: fin };
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

/* ⛔ `durataFermo` SA DIRE TRE COSE, E CHI LA LEGGEVA NE SCRIVEVA DUE.
   Risponde «ancora fermo», «chiuso» e — quando una delle due date non si
   legge — `giorni: null`, che sullo schermo diventa la pastiglia «data non
   valida». Ma la terza non aveva un nome, quindi ogni lettore se lo doveva
   inventare: la pagina lo faceva bene nel badge (`f.giorni != null ? … :
   "data non valida"`) e male in `flotta-fermi-macchina.csv`, dove la colonna
   `stato` era `f.aperto ? "ancora fermo" : "chiuso"` — cioè un fermo con la
   ripartenza illeggibile usciva **«chiuso»** con la colonna dei giorni vuota:
   un episodio concluso a zero giornate perse, la parola più tranquilla
   esattamente dove lo schermo grida. È la regola 18 applicata a un file, ed è
   la ragione per cui il nome dello stato sta qui e non in chi lo stampa. */
export function statoFermo(fermo, oggi = new Date()) {
  const d = durataFermo(fermo, oggi);
  if (d.giorni == null)
    return { stato: "data-non-valida", parola: "data non valida", cls: "warn", giorni: null, aperto: d.aperto };
  return d.aperto
    ? { stato: "aperto", parola: "ancora fermo", cls: "danger", giorni: d.giorni, aperto: true }
    : { stato: "chiuso", parola: "chiuso", cls: "tag", giorni: d.giorni, aperto: false };
}

// I fermi ORDINATI come servono a chi guarda: prima quelli ancora aperti (dal
// più lungo), poi i chiusi dal più recente. Ognuno arricchito con durata,
// stato e etichetta della causale. Pura.
export function fermiOrdinati(fermi, oggi = new Date()) {
  return (fermi || []).map(f => {
    const s = statoFermo(f, oggi);
    return { ...f, giorni: s.giorni, aperto: s.aperto, stato: s.stato, statoTx: s.parola,
             causaleTx: etichettaCausale(f.causale) };
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
  /* ⛔ UN FERMO CHE NON SO COLLOCARE NON È UN FERMO CHE NON C'È STATO. Con la
     sola forma della data quel fermo entrava nel conto e lo portava a `NaN`
     (vedi `isoGiorno`); adesso non ci entra più — e se uscisse di scena in
     silenzio la disponibilità salirebbe, cioè l'assenza di un dato diventerebbe
     un dato favorevole. Si conta a parte e si dichiara, esattamente come i
     fermi delle macchine non più nel parco. */
  let senzaDate = 0;
  /* scelti / subìti / non classificati: la somma dei tre `giorni` è `persi`
     e quella degli `episodi` è `episodi`, per costruzione (ogni fermo contato
     finisce in uno solo dei tre) */
  const natura = { scelto: { giorni: 0, episodi: 0 }, subito: { giorni: 0, episodi: 0 }, nonClassificato: { giorni: 0, episodi: 0 } };
  for (const f of fermi || []) {
    const nome = nomeBreve(f.mezzo);
    if (!nome) continue;
    if (!fermoCollocabile(f)) { senzaDate++; continue; }
    const tratto = intervalloFermo(f, da, a);
    const g = tratto ? tratto.giorni : 0;
    if (g <= 0) continue;
    const aperto = !isoGiorno(f.fine);
    if (!inParco.has(nome)) { fuoriParco++; fuoriParcoGiorni += g; continue; }
    persi += g; episodi++; if (aperto) aperti++;
    const nat = natura[naturaFermo(f.causale) || "nonClassificato"];
    nat.giorni += g; nat.episodi++;
    const v = perMezzo.get(nome) || { mezzo: nome, giorni: 0, episodi: 0, aperti: 0, causali: new Set(), tratti: [] };
    v.giorni += g; v.episodi++; if (aperto) v.aperti++;
    v.tratti.push(tratto);
    v.causali.add(etichettaCausale(f.causale));
    perMezzo.set(nome, v);
    const c = etichettaCausale(f.causale);
    const cv = perCausale.get(c) || { causale: c, giorni: 0, episodi: 0 };
    cv.giorni += g; cv.episodi++;
    perCausale.set(c, cv);
  }
  const parco = inParco.size;
  const giorniMacchina = parco * finestra;
  /* ⛔ I GIORNI PERSI SI CONTANO, NON SI SOMMANO — e finché si sommavano la
     sottrazione qui sotto poggiava su un invariante che nessuno aveva scritto:
     «i fermi di una stessa macchina non si sovrappongono». La pagina impedisce
     due fermi APERTI sullo stesso mezzo, e basta: due fermi CHIUSI sovrapposti
     (o uno aperto più uno chiuso) entrano senza un avviso. Misurato il 14/08
     su tre mezzi con due fermi identici di 30 giorni sulla stessa macchina:
     `persi` faceva 60 su 90 giorni-macchina e la flotta usciva al **33,3%**
     mentre due macchine su tre non si erano mai fermate — il vero è **66,7%**.
     Il `Math.max(0, …)` non poteva dirlo: teneva a galla una differenza che
     era già senza senso, e nella direzione che ACCUSA il prodotto del cliente.
     Ora `persiDistinti` è l'unione dei tratti, macchina per macchina, e quindi
     `persiDistinti ≤ parco × finestra` è vero PER COSTRUZIONE — il `Math.max`
     qui sotto è una cintura, non più il tappo di un buco.
     ⚠️ `persi` RESTA la somma degli episodi, perché è quello che vuole il
     tempo medio di riparazione (MTTR): un fermo di dieci giorni e uno di tre
     sono due riparazioni, anche se cadono negli stessi giorni. Le due domande
     sono diverse e adesso hanno due numeri diversi, invece di uno solo che
     rispondeva bene a una e male all'altra. */
  const persiDistinti = [...perMezzo.values()].reduce((t, v) => t + giorniDistinti(v.tratti), 0);
  const sovrapposti = persi - persiDistinti;
  const disponibili = Math.max(0, giorniMacchina - persiDistinti);
  const pct = giorniMacchina ? Math.round(1000 * disponibili / giorniMacchina) / 10 : null;
  const mezziLista = [...perMezzo.values()]
    .map(v => { const gd = giorniDistinti(v.tratti); return { ...v, causali: [...v.causali], tratti: undefined,
      giorniDistinti: gd, sovrapposti: v.giorni - gd,
      // `gd ≤ finestra` per costruzione (i tratti sono già tagliati alla
      // finestra e l'unione non può eccederla): il max è una cintura
      pct: finestra ? Math.round(1000 * Math.max(0, finestra - gd) / finestra) / 10 : null,
      durataMedia: v.episodi ? Math.round(10 * v.giorni / v.episodi) / 10 : null }; })
    .sort((x, y) => y.giorni - x.giorni || y.episodi - x.episodi || x.mezzo.localeCompare(y.mezzo, "it"));
  return {
    finestra, da, a, parco, giorniMacchina, persi, persiDistinti, sovrapposti, disponibili, pct,
    episodi, aperti, mezzi: mezziLista,
    /* `perMezzo` si riempie SOLO per i nomi che stanno in `inParco` (i fermi
       delle macchine fuori parco escono col `continue` sopra e si contano in
       `fuoriParco`): quindi `mezziLista.length ≤ parco` è vero PER COSTRUZIONE
       e questo `Math.max` non ha mai niente da tagliare. */
    senzaFermi: Math.max(0, parco - mezziLista.length),
    causali: [...perCausale.values()].sort((x, y) => y.giorni - x.giorni || x.causale.localeCompare(y.causale, "it")),
    // durata media di un fermo (MTTR in giorni) e giorni di lavoro fra un
    // fermo e l'altro (MTBF semplificato). Null quando non hanno senso.
    durataMedia: episodi ? Math.round(10 * persi / episodi) / 10 : null,
    fraUnFermoELaltro: episodi >= 2 ? Math.round(10 * disponibili / episodi) / 10 : null,
    fuoriParco, fuoriParcoGiorni,
    // quanti fermi registrati non si è potuto mettere sul calendario, e quindi
    // NON pesano su `pct`: la pagina lo scrive accanto alla percentuale
    senzaDate,
    // i giorni (somma degli episodi, come `persi`) e gli episodi per natura:
    // scelti + subìti + nonClassificati = persi / episodi
    scelti: natura.scelto, subiti: natura.subito, nonClassificati: natura.nonClassificato,
  };
}

// ══════════════════════════════════════════════════════════════════════
// LA PAGELLA DEL PARCO — costo orario E disponibilità sullo stesso piano
// La domanda che l'app scriveva già nel suo codice («la riparo ancora o la
// sostituisco») non si risponde con un asse solo, e finora Flotta ne
// disegnava due SEPARATI, a settecento righe di distanza: il costo di
// officina per mezzo e i giorni di fermo per mezzo. Chi guarda il primo
// vede una macchina cara e non sa se è cara PERCHÉ lavora il doppio; chi
// guarda il secondo vede una macchina ferma e non sa se le sta costando
// qualcosa. Sono le due metà della stessa decisione, e stavano in due
// schermate diverse.
//
// ⛔ NON RICALCOLA NIENTE, COMPONE. Prende le uscite di `costoOrarioMezzo`
//    e di `affidabilitaFlotta` così come sono. È la stessa regola che
//    `costoOrarioMezzo` si è già data sulle ore («due conti delle stesse
//    ore un giorno divergono senza che nessuno se ne accorga»): qui varrebbe
//    per €/h e per la disponibilità, cioè per i due numeri che la pagina
//    mostra già altrove. Se divergessero, la pagella smentirebbe le due
//    schermate da cui nasce.
//
// ⛔ E I DUE ASSI NON MISURANO LO STESSO PERIODO — va detto, non nascosto.
//    La disponibilità è la finestra dei fermi (30 giorni di suo); il costo
//    orario è TUTTA la spesa registrata divisa le ore coperte dai contatori.
//    Scriverli accanto senza dirlo li farebbe leggere come se fossero lo
//    stesso mese. `finestra`, `da` e `a` riguardano SOLO la disponibilità, e
//    la pagina lo scrive.
//
// ⛔ LA BANDA ESISTE PERCHÉ MEZZO PARCO STA SEMPRE SOPRA LA MEDIA. Senza una
//    tolleranza, in un parco sano la metà delle macchine finirebbe segnalata
//    ogni giorno — e un allarme che suona sempre insegna a non guardarlo più,
//    che è esattamente ciò che questa schermata dovrebbe evitare. Il costo si
//    misura in PERCENTUALE della media (un €/h è una grandezza relativa); la
//    disponibilità in PUNTI di percentuale (è già una percentuale: il ±15%
//    relativo su un parco al 90% aprirebbe una banda da 76 a 100, cioè
//    nessuna segnalazione mai).
//
// ⛔ E «IN LINEA» SI DICE SOLO SE HANNO PARLATO TUTT'E DUE GLI ASSI. È il
//    principio del fondatore applicato a un verdetto che nasce da due
//    misure: una macchina di cui si legge una metà sola non è «in linea»,
//    è `solo-meta`. Il prototipo ci è cascato — con la spesa a zero, o senza
//    la finestra dei fermi, rispondeva il verdetto più tranquillo che sa
//    dire su una macchina che non aveva misurato.
//
// Il costo che NON si sa non entra in classifica: va in `senzaCosto`, che
// non è un cestino ma la lista più importante della schermata — nella
// dimostrazione ci finisce il Dumper D3, che ha la spesa più alta del parco
// (5.090 €) e la disponibilità più bassa (63%), e di cui nessuno può dire
// se sia caro perché nessun rifornimento porta la lettura del contatore.
// Un «0 €/h» lì lo farebbe sembrare la macchina più conveniente che c'è.
// Tutto puro e testabile.
// ══════════════════════════════════════════════════════════════════════

// La tolleranza attorno alla media, oltre la quale una macchina si segnala.
// `costo` in % della media, `disponibilita` in punti di percentuale.
export const BANDA_PAGELLA = { costo: 15, disponibilita: 5 };

export function pagellaMezzi(righeCosto, aff, mezzi) {
  const perCosto = new Map();
  for (const r of righeCosto || []) perCosto.set(r.mezzo, r);
  const perFermo = new Map();
  for (const m of (aff && aff.mezzi) || []) perFermo.set(m.mezzo, m);
  const finestra = aff && aff.finestra > 0 ? aff.finestra : null;

  // Il parco è l'elenco che comanda: una macchina senza nessuna spesa e
  // senza nessun fermo deve comparire lo stesso, o la pagella racconta un
  // parco più piccolo di quello che c'è.
  const parco = [];
  for (const m of mezzi || []) {
    const n = nomeBreve(m && m.nome);
    if (n && !parco.includes(n)) parco.push(n);
  }

  // La media della flotta è TUTTI i costi misurabili diviso TUTTE le ore
  // misurabili — non la media dei €/h, che darebbe lo stesso peso a una
  // macchina di cinquanta ore e a una di cinquemila.
  // ⛔ E IL NUMERATORE È QUELLO DEI €/h DI RIGA (`spesaInFinestra`), non la
  //    spesa totale del mezzo. Sono due numeri diversi da quando il €/h si
  //    calcola sulla finestra dei contatori: prendendo `totale` la media
  //    sarebbe più alta di TUTTE le righe che deve mediare (sulla
  //    dimostrazione 54,25 contro un parco che sta fra 28 e 39), e ogni
  //    scostamento nascerebbe da un confronto fra due cose diverse. È la
  //    stessa regola che questa funzione si è già data: non ricalcolare, e
  //    non mescolare due misure che coprono periodi diversi.
  let spesaMisurata = 0, oreTotali = 0;
  for (const n of parco) {
    const c = perCosto.get(n);
    if (c && c.ore > 0 && c.euroOra != null && Number.isFinite(c.spesaInFinestra)) {
      spesaMisurata += c.spesaInFinestra;
      oreTotali += c.ore;
    }
  }
  spesaMisurata = Math.round(100 * spesaMisurata) / 100;
  const mediaEuroOra = oreTotali > 0 && spesaMisurata > 0
    ? Math.round(100 * spesaMisurata / oreTotali) / 100 : null;
  // La disponibilità di riferimento è quella del parco, già calcolata e già
  // scritta nella schermata dei fermi. Non è una seconda media: è
  // esattamente la media dei `pct` di riga, perché `persi` conta solo i
  // fermi dei mezzi in parco (i fuori parco `affidabilitaFlotta` li tiene
  // già da parte). La prova lo pretende, così se un giorno divergessero si
  // vedrebbe.
  const mediaDisponibilita = aff && aff.pct != null ? aff.pct : null;

  const righe = [], senzaCosto = [];
  for (const n of parco) {
    const c = perCosto.get(n);
    const f = perFermo.get(n);
    // Nessun fermo registrato su una macchina in parco = nessun giorno
    // perso, cioè 100%. È la convenzione che la schermata dei fermi usa
    // già («tutti disponibili»), e con essa il registro dei fermi va tenuto
    // perché voglia dire qualcosa: quando nessuno ha registrato niente è
    // `misurabile` a dirlo, non un numero diverso qui.
    const disponibilita = f ? f.pct : (finestra ? 100 : null);
    const scostamentoFermo = disponibilita != null && mediaDisponibilita != null
      ? Math.round(10 * (disponibilita - mediaDisponibilita)) / 10 : null;
    // `piu` = si ferma PIÙ della media, cioè è disponibile MENO. Le parole
    // dicono i fermi, non la percentuale: «sopra» e «sotto» su una
    // disponibilità che scende quando i fermi salgono si leggono al
    // contrario ogni volta.
    const fermo = scostamentoFermo == null ? null
      : scostamentoFermo < -BANDA_PAGELLA.disponibilita ? "piu"
      : scostamentoFermo > BANDA_PAGELLA.disponibilita ? "meno" : "linea";
    // ⛔ LA FINESTRA DEL €/h VIAGGIA CON LA RIGA. I due assi non coprono lo
    //    stesso periodo — la disponibilità è la finestra dei fermi, il costo
    //    è quella dei contatori, e ogni macchina ha la SUA — quindi scriverli
    //    accanto senza portarsi dietro il periodo del secondo li farebbe
    //    leggere come se fossero lo stesso mese.
    const base = {
      mezzo: n, disponibilita, scostamentoFermo, fermo,
      giorniFermo: f ? f.giorni : 0, episodi: f ? f.episodi : 0, aperti: f ? f.aperti : 0,
      totale: c ? c.totale : 0, parziale: !!(c && c.parziale),
      percheParziale: (c && c.percheParziale) || "",
      da: (c && c.da) || null, a: (c && c.a) || null,
      fuori: (c && c.fuori) || { interventi: 0, costo: 0 },
    };
    if (!c || c.euroOra == null) {
      senzaCosto.push({
        ...base, euroOra: null, ore: null, costo: null, scostamentoCosto: null,
        verdetto: "costo-ignoto",
        perche: c && c.perche ? c.perche
          : "Su questa macchina non è ancora stata registrata nessuna spesa.",
      });
      continue;
    }
    const scostamentoCosto = mediaEuroOra
      ? Math.round(10 * (100 * (c.euroOra - mediaEuroOra) / mediaEuroOra)) / 10 : null;
    const costo = scostamentoCosto == null ? null
      : scostamentoCosto > BANDA_PAGELLA.costo ? "piu"
      : scostamentoCosto < -BANDA_PAGELLA.costo ? "meno" : "linea";
    const verdetto = costo === "piu" && fermo === "piu" ? "costa-e-ferma"
      : costo === "piu" ? "costa"
      : fermo === "piu" ? "ferma"
      : costo != null && fermo != null ? "in-linea" : "solo-meta";
    righe.push({ ...base, euroOra: c.euroOra, ore: c.ore, costo, scostamentoCosto, verdetto });
  }
  // Il peggiore in cima: è l'unico ordine che serve a chi apre la schermata
  // per decidere su quale macchina andare a guardare per prima.
  const peso = { "costa-e-ferma": 0, costa: 1, ferma: 2, "solo-meta": 3, "in-linea": 4 };
  righe.sort((a, b) => peso[a.verdetto] - peso[b.verdetto]
    || (b.scostamentoCosto == null ? -Infinity : b.scostamentoCosto)
     - (a.scostamentoCosto == null ? -Infinity : a.scostamentoCosto)
    || a.mezzo.localeCompare(b.mezzo, "it"));
  senzaCosto.sort((a, b) => b.totale - a.totale || b.giorniFermo - a.giorniFermo
    || a.mezzo.localeCompare(b.mezzo, "it"));

  // La spesa registrata su macchine che non sono più nel parco non entra
  // nella media (non hanno un denominatore), ma non sparisce: si dichiara,
  // come `affidabilitaFlotta` fa già con i loro fermi.
  let fuoriParco = 0, fuoriParcoSpesa = 0;
  for (const r of righeCosto || []) {
    if (!parco.includes(r.mezzo)) { fuoriParco++; fuoriParcoSpesa += r.totale; }
  }

  const confrontabili = righe.length;
  const pochi = confrontabili < 2 || mediaEuroOra == null;
  return {
    finestra, da: aff ? aff.da : null, a: aff ? aff.a : null,
    mediaEuroOra, oreTotali: Math.round(10 * oreTotali) / 10,
    spesaMisurata: Math.round(100 * spesaMisurata) / 100,
    mediaDisponibilita, banda: BANDA_PAGELLA,
    righe, senzaCosto, confrontabili,
    // `pochi`: non c'è una classifica da leggere. Con una macchina sola il
    // confronto è con sé stessa, e senza media non c'è nemmeno quello.
    pochi,
    perchePochi: !pochi ? ""
      : mediaEuroOra == null
        ? "Nessuna macchina ha insieme una spesa e le ore del contatore: senza una media non c'è un confronto."
        : confrontabili === 1
          ? "Di una macchina sola si sa il costo orario: con una sola non c'è una classifica da leggere."
          : "Di nessuna macchina si sa il costo orario: serve il contatore delle ore sui rifornimenti.",
    // `misurabile`: l'asse della disponibilità distingue qualcosa. Senza
    // nessun fermo registrato è 100% per tutte — non perché il parco vada
    // bene, ma perché nessuno ha scritto niente.
    misurabile: !!(aff && aff.episodi > 0),
    percheDisponibilita: aff && aff.episodi > 0 ? ""
      : !aff || !finestra
        ? "La disponibilità non è stata calcolata: manca la finestra dei fermi."
        : "Nessun fermo registrato nella finestra: la disponibilità è 100% per tutte e non distingue una macchina dall'altra.",
    fuoriParco, fuoriParcoSpesa: Math.round(100 * fuoriParcoSpesa) / 100,
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
  /* ⛔ L'ORIZZONTE SI NORMALIZZA UNA VOLTA SOLA, E POI SI LEGGE SEMPRE QUELLO.
     Fino al 14/08 il ripiego `|| ORIZZONTE_TAGLIANDI` stava SOLO qui, dove si
     costruisce la soglia; gli altri tre punti — la frase «per stimare N
     giorni», il suo plurale e il confronto `eta > orizzonte`, che è il
     VERDETTO — leggevano l'argomento crudo. È il contratto normalizzato a
     metà già pagato il 09/08 su `disegnaSpark`, e qui non produce un NaN:
     produce una frase che si smentisce da sola. Misurato chiamando la
     funzione con due letture a tre giorni di distanza:
       orizzonte = null → «le letture coprono 3 giorni: per stimare **null**
                           giorni servono almeno 15»
       orizzonte = ""   → «per stimare **·nulla·** giorni servono almeno 15»
       orizzonte = 0    → «per stimare **0** giorni servono almeno 15»
     — cioè il numero che l'utente legge e quello su cui il conto è fatto sono
     due numeri diversi, e uno dei due non esiste.
     La sorella `tagliandiInScadenza` la stessa normalizzazione la fa in cima
     (`const oriz = …`) e poi usa solo quella: sugli stessi ingressi risponde
     «per stimare 30 giorni» in tutt'e tre i casi. Due sorelle con due
     contratti sono il segno che la normalizzazione è scritta due volte.
     ⚠️ Sui valori veri non cambia NIENTE: oggi l'unico chiamante è
     `tagliandiInScadenza`, che passa già `oriz` normalizzato — quindi questa
     riga non corregge un difetto raggiungibile dall'interfaccia, toglie la
     divergenza fra le due sorelle prima che qualcuno chiami questa. */
  const oriz = +orizzonte || ORIZZONTE_TAGLIANDI;
  const minGiorni = Math.max(2, Math.ceil(oriz / 2));
  const per = new Map();
  for (const l of letture || []) {
    const mezzo = nomeBreve(l && l.mezzo);
    const g = isoGiorno(l && l.data);
    const ore = +((l || {}).ore);
    if (!mezzo || !g) continue;
    if (!Number.isFinite(ore) || ore <= 0) continue;
    if (giorniTra(g, oggi) > 0) continue;          // contatore datato nel futuro: non è un fatto
    const v = per.get(mezzo) || { mezzo, punti: [] };
    v.punti.push({ data: g, ore, contatoreNuovo: !!l.contatoreNuovo, oreVecchie: l.oreVecchie });
    per.set(mezzo, v);
  }
  const out = [];
  for (const v of per.values()) {
    /* IL TRATTO CORRENTE, la stessa regola di `consumoPerMezzo`: dall'ultimo
       contatore dichiarato nuovo in poi. Qui le letture senza data sono già
       state scartate all'ingresso, quindi `senzaData` è sempre zero. */
    const tc = trattoCorrente(v.punti);
    const sostituito = tc.tratti > 1 ? fraseContatoreSostituito(tc.azzeramento) : "";
    const p = tc.letture.slice().sort((a, b) => a.data.localeCompare(b.data) || a.ore - b.ore);
    const primo = p[0], ultimo = p[p.length - 1];
    const r = { mezzo: v.mezzo, letture: p.length, tratti: tc.tratti, contatoreDal: tc.dal, oreGiorno: null, giorniCoperti: null,
      dal: primo ? primo.data : null, al: ultimo ? ultimo.data : null, eta: ultimo ? -giorniTra(ultimo.data, oggi) : null, perche: "" };
    if (p.length < 2) {
      r.perche = sostituito
        ? sostituito + (p.length === 1
            ? ", e finora c'è una sola lettura del nuovo contatore: per sapere quante ore fa al giorno ne serve una seconda"
            : ", e non c'è ancora nessuna lettura del nuovo contatore")
        : "c'è una sola lettura del contatore: per sapere quante ore fa al giorno ne serve una seconda";
      out.push(r); continue;
    }
    const giorni = giorniFra(primo.data, ultimo.data);
    const dOre = ultimo.ore - primo.ore;
    r.giorniCoperti = giorni;
    if (giorni < minGiorni) {
      r.perche = "le letture del contatore coprono " + giorni + (giorni === 1 ? " giorno" : " giorni")
        + ": per stimare " + oriz + " " + plurale(oriz, "giorno", "giorni")
        + " servono almeno " + minGiorni + (sostituito ? " (" + sostituito + ")" : "");
      out.push(r); continue;
    }
    if (dOre <= 0) {
      r.perche = "fra la prima e l'ultima lettura il contatore non è salito";
      out.push(r); continue;
    }
    if (r.eta > oriz) {
      r.perche = "l'ultima lettura del contatore è di " + r.eta + " " + plurale(r.eta, "giorno", "giorni")
        + " fa: quel ritmo racconta un periodo passato, non questo";
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
  const mezzoDi = (nome) => (mezzi || []).find(x => nomeBreve(x.nome) === nome) || null;
  const voci = [], daStimare = [];
  for (const n of manutenzioni || []) {
    const mezzo = nomeBreve(n && n.mezzo);
    const base = { id: (n && n.id) || "", titolo: (n && n.titolo) || "Manutenzione", mezzo };
    // Come in prioritaOperative e nella lista Manutenzioni: se un tagliando
    // ha le ore, sono le ore a comandare. Un solo criterio in tutta l'app.
    if (+(n && n.orePreviste) > 0) {
      const m = mezzoDi(mezzo);
      const ore = oreContatore(m);
      if (ore == null) {
        /* DUE ASSENZE DIVERSE, DUE FRASI DIVERSE. Fino al 01/08 ce n'era una
           sola — «il mezzo non è nel parco» — e la si diceva anche del mezzo
           che nel parco C'È, solo senza contatore: chi legge va a cercare una
           macchina che è lì, e non trova niente da correggere. */
        daStimare.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: null,
          perche: m
            ? "del mezzo «" + mezzo + "» non risultano le ore del contatore: scrivile nella sua scheda"
            : "il mezzo «" + mezzo + "» non è nel parco: il suo contatore non si può leggere" });
        continue;
      }
      /* Il tagliando confrontato col SUO contatore (04/09): scritto prima
         dell'ultimo azzeramento del mezzo, le ore previste non parlano del
         contatore che c'è oggi. Va fra quelli che non si possono collocare,
         col motivo — e PRIMA del confronto qui sotto, perché `mancano` è
         `null` e `null <= 0` in JavaScript risponde true: senza questa guardia
         un tagliando non confrontabile uscirebbe «scaduto». */
      const u = urgenzaTagliando(n, ore, azzeramentiDelMezzo(letture, mezzo));
      if (!u.calcolabile) {
        daStimare.push({ ...base, via: "ore", orePreviste: +n.orePreviste, mancano: null, perche: u.perche });
        continue;
      }
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
    /* ⚠️ `Number.isFinite` PRIMA del confronto. Da quando `urgenza` risponde
       `giorni: null` a un giorno che non si legge, `null <= 30` sarebbe
       **true** e la tessera conterebbe fra i tagliandi dei prossimi 30 giorni
       una manutenzione di cui nessuno sa quando cade. Prima ci arrivava un
       `NaN`, che il confronto scartava per caso: il conto non cambia sui dati
       buoni né su quelli storti, cambia la ragione per cui è giusto. */
    tagliandi30: manutenzioni.filter(n => { const g = urgenza(n.dataPrevista).giorni; return Number.isFinite(g) && g <= 30; }).length,
    carburante: costi.filter(c => /carburante/i.test(c.voce)).reduce((t, c) => t + (+c.importo || 0), 0),
  };
  if (!opts) return base;
  const t = tagliandiInScadenza(manutenzioni, mezzi, opts.letture || [],
    opts.oggi || new Date(), opts.orizzonte || ORIZZONTE_TAGLIANDI);
  return { ...base, tagliandi30: t.totale, tagliandi: t };
}

// ══════════════════════════════════════════════════════════════════════════
// IL SALVATAGGIO CHE NON RIESCE
// ══════════════════════════════════════════════════════════════════════════
// Flotta è l'app che si usa DAVANTI ALLA MACCHINA: il giro macchina si fa in
// piazzale a inizio turno, il guasto si segnala dove è successo. Sono i due
// posti dove la rete non c'è, e fino a oggi un salvataggio che non riusciva
// non lo diceva a nessuno.
//
// ⛔ E NON BASTA UN `try/catch`, perché il difetto non è un errore: MISURATO il
// 01/08 col pacchetto `firebase` vero (12.16.0) e la rete chiusa
// (`disableNetwork`), su quattro chiamate — `addDoc` di un controllo, `addDoc`
// di una manutenzione, `updateDoc` delle ore, e una lettura:
//   · le tre SCRITTURE non risolvono e non rifiutano: restano PENDENTI per
//     sempre (attese 4 secondi ciascuna, nessuna delle tre si è mossa);
//   · la lettura risponde in 8 ms, dalla cache.
// Un `catch` attorno a una promessa che non rifiuta non viene mai eseguito: il
// programma si ferma sull'`await` e la pagina resta lì, senza toast, senza
// errore, senza chiudere la scheda. Chi ha compilato non sa se ha salvato.
// La difesa è quindi un'ATTESA MASSIMA, non una cattura.
//
// Tre esiti dichiarati, mai un quarto silenzioso:
//   `fatto`      — il server ha confermato;
//   `errore`     — il server ha rifiutato (regole, dato malformato…);
//   `in-sospeso` — nessuna risposta entro l'attesa. NON è «perso» (Firestore
//                  tiene la scrittura in coda e può ancora arrivare) e NON è
//                  «salvato»: è l'assenza del dato, e l'assenza di un dato non
//                  è un dato favorevole. Se poi arriva, `opts.poi` lo dice.
// ⚠️ E QUANDO SERVIRÀ ALLA SECONDA APP, SI SPOSTA IN `shared/`, NON SI RISCRIVE.
// Il difetto è di tutte e sei (nessuna app dice niente se una scrittura non
// riesce: cercato `catch` attorno alle scritture di Campo e Scudo il 01/08 —
// `db.aggiungi`/`db.aggiorna` compaiono 30 volte in quei due file, nessuna
// dentro un `try`). Qui sta in Flotta perché è l'app che si usa senza rete e
// perché la decisione di infrastruttura (la cache persistente nell'SDK) non è
// ancora presa. La seconda app che ne ha bisogno la porta in
// `shared/dw-ponti.js` e la ri-esporta col nome di sempre: un alias non è una
// seconda implementazione.
export const ATTESA_SCRITTURA = 8000;

// Il testo per chi sta davanti alla macchina. Scritto SENZA participi che
// concordano col soggetto («salvato»/«salvata»): il prototipo del 01/08
// produceva «La segnalazione NON risulta salvato» perché la stessa frase serve
// a un giro (maschile) e a una segnalazione (femminile).
export function messaggioScrittura(esito, cosa, opts = {}) {
  const che = cosa || "il dato";
  if (esito === "fatto") return "";
  if (esito === "errore") {
    return "Il server ha rifiutato " + che
      + (opts.dettaglio ? " (" + opts.dettaglio + ")" : "")
      + ". Non è stato salvato niente. Quello che hai scritto è ancora qui: riprova fra un momento.";
  }
  // `navigator.onLine` a `true` NON vuol dire che c'è internet (una barra di
  // segnale, un portale captivo): per questo la frase non accusa il server, lo
  // dichiara e basta.
  const perche = opts.inRete === false
    ? "il telefono è senza linea"
    : opts.inRete === true
      ? "il telefono risulta connesso, ma il server non ha risposto"
      : "il server non ha risposto";
  return "Il server non ha ricevuto " + che + ": " + perche
    + ". Non è stato salvato niente. Quello che hai scritto è ancora qui: non chiudere la pagina e riprova quando torna la linea.";
}

/* ⚠️ E LA STESSA FRASE NON VA IN TUTTI E DUE I POSTI. Flotta dice gli errori
   due volte — la riga sotto il modulo, che resta lì mentre si corregge, e il
   toast, che si vede subito — ma nel toast «va UNA cosa sola»: è scritto in
   `guaErrore`, ed è stato violato scrivendoci il messaggio lungo. Lo si è
   visto solo guardando lo scatto: nove righe di pastiglia semitrasparente
   sopra la checklist, e nella segnalazione di guasto **sopra il bottone
   «Segnala»**. Il breve dice la cosa che conta — non è salvato — e perché;
   il resto sta nella riga, dove si può leggere con calma. */
export function messaggioScritturaBreve(esito, cosa, opts = {}) {
  if (esito === "fatto") return "";
  if (esito === "errore") return "Non è stato salvato niente: il server ha rifiutato.";
  return "Non è stato salvato niente: " + (opts.inRete === false
    ? "il telefono è senza linea."
    : "il server non ha risposto.");
}

// Esegue una scrittura e RISPONDE SEMPRE, anche quando la scrittura non
// risponde. `azione` è una funzione (non una promessa già avviata), così anche
// un lancio sincrono finisce fra gli esiti invece di sfuggire.
export async function scriviConEsito(azione, opts = {}) {
  const attesa = Number.isFinite(opts.attesa) ? opts.attesa : ATTESA_SCRITTURA;
  const cosa = opts.cosa || "";
  const codice = (e) => (e && (e.code || e.message)) || "";
  let scaduta = false, orologio = null;
  const lavoro = Promise.resolve().then(azione);
  const esito = await Promise.race([
    lavoro.then(() => ({ esito: "fatto" }), (e) => ({ esito: "errore", dettaglio: codice(e) })),
    new Promise((r) => { orologio = setTimeout(() => { scaduta = true; r({ esito: "in-sospeso" }); }, attesa); }),
  ]);
  if (orologio) clearTimeout(orologio);
  // La scrittura scaduta continua per conto suo. Due ragioni per restare
  // agganciati: se ARRIVA, chi chiama lo può dire (e chiudere la scheda, così
  // nessuno la ricompila una seconda volta); e se rifiuta, il rifiuto va
  // consumato o resta un `unhandledRejection`.
  if (scaduta) lavoro.then(
    () => { if (typeof opts.poi === "function") opts.poi({ ok: true, esito: "fatto", dettaglio: "", messaggio: "", breve: "" }); },
    (e) => { if (typeof opts.poi === "function") opts.poi({ ok: false, esito: "errore", dettaglio: codice(e),
                messaggio: messaggioScrittura("errore", cosa, { dettaglio: codice(e), inRete: opts.inRete }),
                breve: messaggioScritturaBreve("errore", cosa, { inRete: opts.inRete }) }); }
  );
  const dove = { dettaglio: esito.dettaglio, inRete: opts.inRete };
  return {
    ok: esito.esito === "fatto",
    esito: esito.esito,
    dettaglio: esito.dettaglio || "",
    messaggio: messaggioScrittura(esito.esito, cosa, dove),
    breve: messaggioScritturaBreve(esito.esito, cosa, dove),
  };
}

export async function flottaData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "flotta" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc, deleteField } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        mezzi: () => read("mezzi"), manutenzioni: () => read("manutenzioni"), costi: () => read("costi"), ricambi: () => read("ricambi"), interventi: () => read("interventi"), scadenze: () => read("scadenze"), disponibilita: () => read("disponibilita"), controlli: () => read("controlli"), rifornimenti: () => read("rifornimenti"), fermi: () => read("fermi"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), traduciCancellazioni(d, deleteField)),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
      };
      // ── PONTE CON CONTI — SOLA LETTURA ────────────────────────────────
      // Stessa forma del ponte Flotta→Conti in `conti-data.js`: seconda
      // istanza dell'SDK sull'app "conti", stessa organizzazione, aperta solo
      // la prima volta che serve, così l'avvio di Flotta non rallenta. ⛔ Se
      // Conti non c'è o la lettura non è permessa si torna `null`, e la
      // schermata dice «Conti non raggiungibile» — MAI «in Conti non c'è
      // niente», che sarebbe il via libera a scrivere il doppione.
      let idConti;                       // undefined = mai provato, null = non c'è
      api.costiConti = async () => {
        if (idConti === undefined) {
          try { idConti = await DeepworkID.init({ appId: "conti" }); }
          catch (e) { idConti = null; }
        }
        if (!idConti) return null;
        try {
          return (await getDocs(idConti.orgCollection("costi")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      mezzi: async () => mem.mezzi, manutenzioni: async () => mem.manutenzioni, costi: async () => mem.costi, ricambi: async () => mem.ricambi, interventi: async () => mem.interventi, scadenze: async () => mem.scadenze, disponibilita: async () => mem.disponibilita || [], controlli: async () => mem.controlli || [], rifornimenti: async () => mem.rifornimenti || [], fermi: async () => mem.fermi || [],
      // in dimostrazione il registro della cava non arriva da Conti: è finto,
      // ma costruito apposta sui costi d'esempio qui sopra (vedi DEMO.costiConti)
      costiConti: async () => mem.costiConti || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) applicaPercorsi(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}

/* ══════════════════════════════════════════════════════════════════════
   IL CONSUMO DI UN MEZZO CONTRO LA SUA STORIA (02/09)
   ────────────────────────────────────────────────────────────────────────
   Il grafico dei consumi dice da mesi che «un consumo che sale rispetto al
   solito è spesso il primo segnale di un guasto» — e nessuno lo misurava: i
   l/h erano un numero solo per mezzo, su tutta la sua vita. Qui si spezza in
   due: la FINESTRA recente (gli ultimi N giorni) e la STORIA (tutto ciò che
   c'è prima), e si dice di quanto la prima sta sopra o sotto la seconda.
   Regole di onestà, le stesse di `consumoPerMezzo`:
   · si scarta il primo pieno di ogni tratto: il gasolio che c'era dentro è
     stato bruciato in ore che non abbiamo. Per la finestra, il punto di
     partenza è l'ULTIMO pieno della storia (se c'è): così la finestra non
     perde il suo primo pieno, e i due tratti non si sovrappongono;
   · un contatore che non sale fra due letture non dà un consumo — si
     risponde `perche`, non un numero;
   · servono almeno due pieni con le ore in ciascun tratto, se no
     `calcolabile: false` e `perche` dice quale dei due manca;
   · non si giudica: `forbicePct` è la differenza in percentuale della storia,
     `verso` la dice a parole; la soglia da cui la pagina dice «da guardare»
     è `TOLLERANZA_CONSUMO_PCT`, dichiarata come SCELTA nostra (la ricerca del
     02/09 non ha trovato una tolleranza di settore con una fonte: un numero
     senza fonte non si spaccia per norma). Perdita, furto o motore non li
     distingue nessun software: lo sa chi guarda il mezzo.
   Pura e testabile: `oggi` iniettabile. */
export const TOLLERANZA_CONSUMO_PCT = 15;
export function consumoControStoria(rifornimenti, nomeMezzo, oggi = new Date(), finestraGiorni = 30) {
  const n = nomeBreve(nomeMezzo);
  const finestra = Math.max(1, Math.round(+finestraGiorni || 30));
  const a = oggiIso(oggi);
  const da = oggiIso(new Date(Date.parse(a + "T12:00:00Z") - (finestra - 1) * 86400000));
  const tutti = (rifornimenti || [])
    .filter((r) => r && nomeBreve(r.mezzo) === n && +r.litri > 0)
    .map((r) => ({ data: String(r.data || "").slice(0, 10), litri: +r.litri, ore: Number.isFinite(Math.round(+r.ore)) && Math.round(+r.ore) > 0 ? Math.round(+r.ore) : null,
      contatoreNuovo: !!r.contatoreNuovo, oreVecchie: r.oreVecchie }))
    .filter((p) => dataISOEsiste(p.data) && p.ore != null)
    .sort((x, y) => x.data.localeCompare(y.data) || x.ore - y.ore);
  /* IL TRATTO CORRENTE, la stessa regola di `consumoPerMezzo`: un intervallo
     di ore non può scavalcare un contatore sostituito, quindi la storia e la
     finestra si leggono tutt'e due sull'ultimo tratto. I pieni di prima
     restano fuori e lo si dice: la storia «non c'è» per una ragione che ha
     una data, non perché nessuno abbia fatto il pieno. */
  const tc = trattoCorrente(tutti);
  const pieni = tc.letture;
  const sostituito = tc.tratti > 1 ? fraseContatoreSostituito(tc.azzeramento) : "";
  const base = { mezzo: n, finestra, dal: da, al: a, tratti: tc.tratti, contatoreDal: tc.dal, recente: null, storia: null, forbicePct: null, verso: null, calcolabile: false, perche: "" };
  if (!n) return { ...base, perche: "manca il nome del mezzo" };
  const storia = pieni.filter((p) => p.data < da), recenti = pieni.filter((p) => p.data >= da);
  // un tratto: dal pieno di partenza (escluso dai litri) all'ultimo
  const tratto = (partenza, seguenti) => {
    if (!partenza || !seguenti.length) return null;
    const ultimo = seguenti[seguenti.length - 1];
    const ore = ultimo.ore - partenza.ore;
    const litri = seguenti.reduce((t, p) => t + p.litri, 0);
    if (!(ore > 0)) return { litriOra: null, litri, ore, pieni: seguenti.length + 1, dal: partenza.data, al: ultimo.data, perche: "fra la prima e l'ultima lettura il contatore non è salito" };
    return { litriOra: Math.round((litri / ore) * 100) / 100, litri, ore, pieni: seguenti.length + 1, dal: partenza.data, al: ultimo.data, perche: "" };
  };
  const st = storia.length >= 2 ? tratto(storia[0], storia.slice(1)) : null;
  const partenzaRecente = storia.length ? storia[storia.length - 1] : (recenti.length ? recenti[0] : null);
  const seguenti = storia.length ? recenti : recenti.slice(1);
  const rc = partenzaRecente && seguenti.length ? tratto(partenzaRecente, seguenti) : null;
  const out = { ...base, recente: rc, storia: st };
  if (!rc) return { ...out, perche: recenti.length
    ? (sostituito ? sostituito + ", e nella finestra c'è un pieno solo con le ore del nuovo contatore" : "nella finestra c'è un pieno solo con le ore, e nessuno prima da cui partire")
    : (sostituito ? sostituito + ", e non c'è ancora nessun pieno con le ore del nuovo contatore nella finestra" : "nessun pieno con data e ore nella finestra") };
  if (rc.litriOra == null) return { ...out, perche: "nella finestra " + rc.perche };
  if (!st) return { ...out, perche: storia.length
    ? "prima della finestra c'è un pieno solo con le ore" + (sostituito ? " del nuovo contatore" : "") + ": non fa una storia"
    : sostituito && tutti.length > pieni.length
      ? "il contatore è stato sostituito il " + dataIt(tc.dal) + ": i pieni di prima sono sul vecchio contatore e non fanno una storia con cui confrontare"
      : "prima della finestra non c'è nessun pieno: non c'è una storia con cui confrontare" };
  if (st.litriOra == null) return { ...out, perche: "nella storia " + st.perche };
  const forbice = Math.round((100 * (rc.litriOra - st.litriOra)) / st.litriOra * 10) / 10;
  return { ...out, calcolabile: true, forbicePct: forbice, verso: forbice > 0 ? "sopra" : forbice < 0 ? "sotto" : "pari" };
}
