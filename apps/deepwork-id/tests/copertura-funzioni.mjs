// ============================================================
// QUANTE FUNZIONI DELLE APP SONO DAVVERO PROVATE?
//
// Per due giorni questo numero è stato contato a mano, un comando alla
// volta, e si è già visto cosa succede: un checkpoint ha scritto «Scudo
// 35/71» quando erano 30, e un messaggio di commit «Sentinella 94/107»
// quando erano 89. Un numero ricordato invecchia; un numero contato da un
// programma no.
//
// Cosa fa: legge gli `export` di ogni `apps/<nome>/<nome>-data.js` e
// guarda quali compaiono in `run-kpi.mjs` nella forma `app.<nome>`.
// È la stessa conta che si faceva a mano, e ha lo stesso limite dichiarato:
// vede se una funzione è CHIAMATA per nome, non se è provata bene. Serve a
// non perdere di vista quello che nessuno ha ancora guardato.
//
// ⚠️ IL FONDO NON FACEVA QUELLO CHE C'ERA SCRITTO QUI. Fino al 03/08 questa
// riga diceva: «se una app ci scende sotto, vuol dire che sono state aggiunte
// funzioni senza prove». **Falso**, e misurato: aggiungendo a Terra un
// `export function funzioneMaiProvata` la conta passa a **40/41, 98%** — e il
// controllo esce **0**, «9 sopra il fondo, 0 sotto». Il fondo sta sul numero
// di funzioni COPERTE, che aggiungendo codice non provato non scende: cattura
// le prove TOLTE, non il codice aggiunto senza prove. Cioè proprio il caso che
// la riga prometteva, e nella direzione che rassicura.
// Adesso ci sono DUE regole, e la prima è quella vera:
//   1. NESSUNA funzione scoperta. Tutte e sei le app e tutti e tre i moduli
//      condivisi sono al 100%: il fondo era una scala mentre si saliva, e una
//      volta in cima la regola giusta è «non se ne lascia indietro nessuna».
//      Chi aggiunge una funzione aggiunge la sua prova, o la dichiara in FUORI
//      con la ragione scritta.
//   2. il FONDO resta come seconda guardia, per il caso in cui il 100% non sia
//      raggiungibile e vada abbassato di proposito: allora almeno il numero
//      non può scendere di nascosto.
//
// Si lancia con:
//   node apps/deepwork-id/tests/copertura-funzioni.mjs
//   node apps/deepwork-id/tests/copertura-funzioni.mjs --elenco   (dice anche QUALI mancano)
// ============================================================

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, "..", "..", "..");
const ELENCO = process.argv.includes("--elenco");

const APP = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];

/* Il fondo per app. Si alza quando si aggiungono prove, non si abbassa mai
   per far passare il controllo: abbassarlo è esattamente il gesto che
   questo file esiste per rendere visibile. */
/* ⚠️ `sentinella` SCENDE DA 110 A 109, stessa forma del caso di `campo`
   qui sotto e stessa ragione: `leggiCsv` ha smesso di essere una funzione
   di Sentinella ed è diventata un alias di `shared/deepwork-id-client/
   dw-shell.js`, che infatti sale da 29 a 30. Nessuna prova tolta: una
   funzione traslocata. */
/* ⚠️ `campo` SCENDE DA 87 A 86, e la ragione va scritta perché abbassare un
   fondo è il gesto che questo file esiste per rendere visibile: non è una
   prova tolta, è `statoRisposta` che ha smesso di essere una FUNZIONE di
   Campo ed è diventata un alias di `shared/dw-ponti.js`. La sua prova non è
   sparita: si è spostata, e adesso pretende l'IDENTITÀ invece del
   comportamento. Il conto di `dw-ponti` sale da 21 a 23 dello stesso passo. */
/* ⚠️ `flotta` SALE DA 79 A 81: `pagellaMezzi` (il costo orario e la
   disponibilità sullo stesso piano) e `BANDA_PAGELLA`, con le loro prove. */
/* ⚠️ `terra` SALE DA 55 A 56: `banchiDaSempre` (la ripartizione per banco
   sommata su tutta la vita misurata della cava, con l'anno cieco che vale
   «almeno» invece di zero), con le sue 8 prove. */
/* ⚠️ `campo` SALE DA 95 A 102: gli ORARI VERI DEL TURNO, persona per persona
   — `minutiOrario`, `oraDaMinuti`, `ORE_TURNO_MAX`, `orariPresenza`,
   `testoOrari`, `orariProposti`, `orariDiTurno` — con le loro prove. Da lì
   `riposoPrimaDelTurno` preferisce l'ora di uscita vera alla durata
   dichiarata del turno, e quando ripiega lo dichiara. */
/* ⚠️ `terra` SALE DA 56 A 66: DA DOVE VIENE LA DENSITÀ — il vocabolario chiuso
   delle provenienze (`DENS_ATTO`, `DENS_LABORATORIO`, `DENS_PRESET`,
   `DENS_MANO`, `DENS_NON_DICHIARATA`, `FONTI_DENSITA`) e le quattro funzioni
   che lo usano (`densitaDichiarata`, `densitaPerEnte`, `descriviDensita`,
   `densitaDellaCava`), con le loro 17 prove. */
/* ⚠️ `scudo` SALE DA 113 A 123: IL CICLO DI VITA DEL DSS (D.Lgs 624/96 art. 6)
   — `MOTIVI_REVISIONE_DSS`, `motivoRevisioneDss`, `dssDiCantiere`,
   `dssScollegati`, `cicloDss`, `descriviCicloDss`, `descriviTrasmissioneDss`,
   `etichettaCicloDss`, `sintesiCicloDss`, `dssDaSeguire` — con le loro 24
   prove. Il DSS c'era già come TIPO di documento con uno stato messo a mano;
   quello che non c'era è il ciclo, e il suo terzo stato: senza data di
   revisione un DSS non è «aggiornato» né «scaduto», è NON DATABILE.
   `sintesiCicloDss` è la decima e l'ha pretesa uno SCATTO: la forma lunga,
   nella riga del Quadro, finiva tagliata da `-webkit-line-clamp:2` a metà di
   «non è…» — cioè proprio dove il principio del fondatore vuole essere letto. */
/* ⚠️ `terra` SCENDE DA 66 A 58, ed è la terza volta che questo file registra la
   stessa forma (dopo `sentinella`/`leggiCsv` e `campo`/`statoRisposta`):
   abbassare un fondo è il gesto che questo file esiste per rendere visibile,
   quindi la ragione va scritta. Non è una prova tolta — nessuna delle 17 è
   sparita — sono OTTO funzioni traslocate in `shared/dw-ponti.js`, che infatti
   sale da 23 a 31 dello stesso passo: il vocabolario chiuso delle provenienze
   (`DENS_ATTO`, `DENS_LABORATORIO`, `DENS_PRESET`, `DENS_MANO`,
   `DENS_NON_DICHIARATA`, `FONTI_DENSITA`), `densitaDichiarata` e
   `densitaDellaCava`. Perché: `apps/campo/index.html` legge la stessa
   autorizzazione e costruisce la stessa `riconciliazioneTurni`, ma chiamava
   `densitaDelMateriale(vig.materiale)` — solo il preset. Misurato: con una
   densità di laboratorio 1,95 nell'atto, Terra riconciliava a 1,95 e Campo a
   1,90. Terra adesso li RI-ESPORTA e le prove pretendono l'IDENTITÀ
   (`terra.X === ponti.X`) invece del comportamento.
   `densitaPerEnte` e `descriviDensita` restano di Terra, e il conto lo dice: a
   scendere sono otto, non dieci. */
/* ⚠️ `scudo` SALE DA 130 A 157: IL PERMESSO DI LAVORO (S8, D.P.R. 177/2011).
   Ventisette funzioni — i due cataloghi (`TIPI_PERMESSO`, `MISURE_PERMESSO`) e
   le loro letture sicure, `LIMITI_ATMOSFERA`/`FONTE_ATMOSFERA` con
   `letturaAtmosfera` e `descriviAtmosfera`, `istantePermesso`,
   `finestraPermesso`, `misureMancanti`, `formazionePermesso`,
   `impresaPermesso`, `ESITI_PERMESSO` con `statoPermesso` e
   `descriviPermesso`, `riepilogoPermessi`, `permessiDelGiorno`,
   `permessiDiCantiere` — e il ponte con la checklist (`voceChiedePermesso`,
   `provaVoce`, `descriviProva`, `conformiSenzaProva`), con le loro 12 prove.
   Nasce da un difetto misurato: la voce «accesso a tramogge e spazi confinati
   regolato da permesso di lavoro» obbligava a rispondere sì/no su un
   adempimento che l'app non sapeva emettere né conservare — la spunta «sì» non
   aveva niente dietro. */
/* ⚠️ ALZATI IL 03/08, e il fondo si alza SOLO dopo che il conto è salito
   davvero: `conti` 111 → 112 (`baseGara`, che ferma la gara senza base che
   rientrava dall'import valendo zero) e `sentinella` 122 → 124 (`csvAmbiente`
   e `numeroDichiarato`, cioè le tre regole del file per l'ARPA salite dal
   gestore del bottone dentro il modulo). Un fondo che non si alza è un fondo
   che non cattura più niente: era già a metà strada dal conto vero. */
/* ⚠️ `scudo` 157 → 159 il 03/08, e il fondo è alzato DOPO aver visto il conto
   salire (159/159, «il fondo era 157: alzalo»): `daSistemareCopertura` — la
   somma che decide colore e testo della copertura formazione, scritta nel
   modulo perché la leggevano due punti della pagina — e
   `assegnatiSenzaAnagrafe`, che conta gli id di una mansione a cui non
   corrisponde più nessuno in anagrafica. E 159 → 160 con
   `avvisoAndamentoMinimo`, la frase che legge la bandiera `noto` del confronto
   fra gli ultimi due anni: era dichiarata dal modulo e non la leggeva nessuno,
   e la scheda usciva verde «In miglioramento» su giornate perse ancora da
   contare. */
/* ⚠️ `scudo` 160 → 155 il 03/08, e un fondo che SCENDE va spiegato più di uno
   che sale — se no diventa il modo di far passare una prova tolta. Qui non è
   stata tolta nessuna prova: **cinque export sono TRASLOCATI** in
   `shared/dw-ponti.js`, dove la regola vincolante li vuole da quando servono a
   due app (il near-miss si segnala anche da Campo, dal 03/08):
   `NEARMISS_CATEGORIE`, `NEARMISS_LUOGHI`, `categoriaNearMiss`,
   `luogoNearMiss`, `descrizioneNearMiss`. Scudo li RI-ESPORTA — e il conto qui
   non li vede più perché la sua espressione cerca `export function`/`export
   const` a inizio riga, non un `export … from`, che è giusto: un alias non è
   una funzione da provare, e la sua prova è l'IDENTITÀ (in `run-kpi.mjs`).
   L'aritmetica torna e va guardata insieme: 160 − 5 = 155 qui, 31 + 7 = 38 in
   `dw-ponti` (le cinque traslocate più `CHI_SEGNALA` e `bozzaNearMiss`, nuove).
   È la stessa forma del trasloco della densità da Terra, quattro righe più
   giù: il numero che scende di qua e sale di là È la prova che è un trasloco e
   non una copia. */
/* ⚠️ `scudo` SALE DA 157 A 163: LA GRAVITÀ POTENZIALE del mancato infortunio
   — `GRAVITA_POTENZIALE`, `ORDINE_POTENZIALE_ALTO`, `potenzialeDi`,
   `descriviPotenziale`, `riepilogoPotenziale`, `descriviRischioPotenziale`,
   con le loro prove. È la risposta a «e se fosse andata male?», e serve a
   distinguere un masso caduto a due metri da un uomo da uno caduto in un
   piazzale deserto: contati insieme, il secondo diluisce il primo. */
/* ⚠️ `scudo` SALE DA 163 A 165 il 07/08, e il fondo si alza DOPO aver visto il
   conto salire (165/165, «il fondo era 163: alzalo»). Le due funzioni sono
   `origineAzione` — da dove nasce un'azione correttiva — e `etichettaScadenza`
   — come si chiama una scadenza: NON sono funzioni nuove, sono due regole che
   la pagina scriveva DUE e TRE volte, e ogni copia aveva perso un pezzo
   diverso. Il conto sale perché una regola che vive nel modulo si può provare,
   e finché viveva nella pagina nessuna prova la guardava — che è esattamente
   il motivo per cui aveva potuto divergere. */
/* ⚠️ `campo` SALE DA 118 A 123 il 09/08, e il fondo si alza DOPO aver visto il
   conto salire (123/123, «il fondo era 118: alzalo»). I tre nomi nuovi —
   `mediaFermiAlGiorno`, `statoMeteo`, `VOCI_METEO` (più `STATI_METEO`) — non
   sono funzioni nuove nel senso di funzioni in più: sono DECISIONI che stavano
   nella pagina, dove nessuna prova le guardava, ed è per questo che avevano
   potuto sbagliare. La media dei fermi si divideva per tutte le colonne del
   grafico, comprese le giornate in cui non è stato registrato niente (21 min
   al giorno invece di 100); e il colore del meteo veniva da un sì/no che non
   distingue «guardato e va bene» da «nessuno ha guardato», quindi un turno
   chiuso col solo cielo compilato usciva verde. Stessa forma dei due traslochi
   di Scudo qui sopra. */
/* ⚠️ `flotta` SALE DA 85 A 87 il 09/08, e per la stessa ragione di `campo`
   qui sopra: i due nomi nuovi non sono lavoro in più, sono DECISIONI che
   stavano nella pagina. `statoScorta` — la soglia minima mai scritta letta
   come uno zero, quindi «soglia minima 0» e la pastiglia verde «ok» su un
   pezzo che nessuno ha deciso quando riordinare; `statoFermo` — il terzo
   stato di `durataFermo`, che nel file dei fermi diventava «chiuso» con la
   colonna dei giorni vuota. Tutt'e due sbagliavano **perché** vivevano dove
   nessuna prova guarda: la pagina compone i file, e le prove chiamano il
   modulo. Il fondo si alza DOPO aver visto il conto salire (87/87). */
/* ⏱️ ALZATI IL 09/08 — sei fondi su sette, e la ragione è quella che questo file
   dichiara da sé a ogni giro: `conti` 122 → 130, `scudo` 165 → 185,
   `sentinella` 131 → 133, `terra` 61 → 66, e fuori da qui `dw-ponti` 39 → 47 e
   `dw-shell` 43 → 47. Nessuna prova aggiunta da questa unità: sono prove
   arrivate nei giorni scorsi con le loro funzioni, e il fondo era rimasto
   indietro — «(il fondo era 165: alzalo)» lo stampava a ogni esecuzione.
   ⛔ E vale la pena scrivere PERCHÉ non è manutenzione cosmetica: un fondo che
   sta venti sotto il conto vero **non può più scattare**. Il suo mestiere è
   accorgersi che una copertura SCENDE, e con vent'unità di margine bisogna
   perderne venti perché dica qualcosa: è una guardia che c'è e non guarda,
   cioè la stessa famiglia della soglia scritta su un valore monotòno spiegata
   in cima a questo file. Alzarlo lo rimette a distanza di uno.
   ✅ Controprova fatta, non dedotta: portato `conti` a 131 — uno sopra il conto
   vero — il controllo dice «✗ conti 130/130 100% SOTTO IL FONDO DI 131» ed esce
   diverso da zero; ripristinato da una copia, con `diff -q` pulito.
   ⏱️ `genesi-data.js` **36 → 49, alzato a sera** dopo che i due cantieri di
   Genesi hanno chiuso: la carica massima per finestra e la carica totale con il
   costo. Il conto è salito **e si è fermato**, che è la condizione scritta qui
   sotto — prima non c'era.
   ⛔ E la riga che sta al posto di questa diceva «NON è stato alzato di
   proposito, un cantiere sta ancora muovendo il conto»: era vera quando l'ho
   scritta stamattina e nel pomeriggio **proponeva un lavoro già fatto**. È la
   terza forma d'invecchiamento di `CLAUDE.md`, in un commento vecchio di sette
   ore e scritto da chi quella regola l'aveva appena citata. Chi chiude un
   cantiere descritto in un commento chiude anche il commento. */
/* ⏱️ `sentinella` 134 → 139 il 13/08, per le tre funzioni della riga B4 (dalla
   scadenza al periodo del report: `periodoAdempimento`, `dataMenoMesi`,
   `descriviPeriodoAdempimento`) più le due arrivate prima e mai raccolte. Il
   conto vero è 139/139; lasciato a 134 il fondo starebbe cinque sotto, cioè
   sarebbe una guardia che per scattare aspetta di perdere cinque prove. */
/* ⏱️ `flotta` 92 → 95 il 02/09: le tre funzioni del ponte Conti→Flotta
   (`chiaveVoceMezzo`, `costiPerConfronto`, `doppioniAllaCifra`), provate in
   run-kpi nel blocco «PONTE CONTI → FLOTTA». Il conto vero è 95/95. */
/* ⏱️ `sentinella` 143 → 150 il 04/09: la lettura dichiarata non valida
   (`RAGIONI_ANNULLAMENTO`, `annullamentoDi`, `letturaValida`, `annullaLettura`,
   `ripristinaLettura`, `contaAnnullate`, `letturaSenzaVolata`). */
/* ⏱️ `flotta` 98 → 102 il 04/09: il contatore sostituito o azzerato
   (`azzeramentiDelMezzo`, `spezzaLetture`, `trattoCorrente`,
   `fraseContatoreSostituito`) più `validaRifornimento` e le tre sorelle del
   conto sul tratto corrente, provate in run-kpi nel blocco «IL CONTATORE
   SOSTITUITO O AZZERATO». Il conto vero è 102/102. */
/* ⚠️ `sentinella` SCENDE da 150 a 147 il 05/09, e non è una funzione persa: lo
   stato della volata e la sua PPV (statoDaTesto, statoVolata, volateDelGiorno,
   ppvDiVolata) sono passati in `shared/dw-ponti.js`, che sale di dodici, e
   Sentinella li ri-esporta come alias — il censimento conta le funzioni
   DEFINITE in un file, non quelle che espone. Il totale non scende. */
/* ⚠️ `campo` SCENDE da 135 a 132 il 05/09 (notte), stessa ragione di Sentinella
   qui sopra: `CONSUNTIVO_COLONNE`, `normalizzaPiano` e `pianoConsuntivoCsv` sono
   passati in `shared/dw-ponti.js` (che sale) perché Genesi compone il consuntivo
   letto dall'organizzazione con la stessa funzione con cui Campo scrive il file.
   Campo li ri-esporta come alias. Il totale non scende. */
/* ⚠️ `conti` SALE DA 205 A 214: lo storico dei solleciti (`statoRecupero`,
   `LIVELLI_SOLLECITO_VALIDI`, `CANALI_SOLLECITO`, `nomeCanaleSollecito`),
   dal delta della ricerca continua, decimo giro — con le loro 4 prove. */
const FONDO = { campo: 147, conti: 214, flotta: 139, scudo: 216, sentinella: 187, terra: 91 };

/* Quello che resta fuori per un motivo, non per dimenticanza: i caricatori
   dati vogliono la rete e lo SDK, i ponti demo vogliono il localStorage.
   Stanno qui perché un elenco di eccezioni scritto è controllabile; una
   eccezione ricordata no. */
const FUORI = new Set([
  "campoData", "contiData", "flottaData", "scudoData", "sentinellaData", "terraData",
  "ponteScudo", "ponteDemoLeggi", "ponteDemoScrivi", "PONTE_DEMO_KEY",
]);

const kpi = readFileSync(join(QUI, "run-kpi.mjs"), "utf8");

let passed = 0, failed = 0, guardate = 0, coperte = 0;
const righe = [];

for (const app of APP) {
  const src = readFileSync(join(RADICE, "apps", app, `${app}-data.js`), "utf8");
  const esporta = [...src.matchAll(/^export (?:async )?function (\w+)|^export const (\w+)/gm)]
    .map((m) => m[1] || m[2])
    .filter((n) => !FUORI.has(n));
  /* ⛔ E IL RIGHELLO MISURAVA UNA FORMA DI SCRITTURA, NON IL FATTO. Cercava la
     sola forma qualificata `app.nome`, e una prova che destruttura —
     `const { registriMuti } = scudo;` e poi la chiama nuda — risultava
     SCOPERTA pur avendo otto punti di chiamata e cinque casi. Misurato il
     14/08 su `scudo.registriMuti`: 190/191, «1 SENZA PROVA», mentre la
     funzione era la più provata del blocco.
     ⚠️ Allargare un censimento di COPERTURA va nella direzione che nasconde
     (una funzione scoperta può diventare «coperta»), quindi non si accetta un
     nome nudo qualunque: si raccolgono **solo** i nomi destrutturati da quel
     modulo — `const { … } = scudo;` — e valgono come se fossero qualificati.
     Costo misurato prima di adottarlo: entrano **1** nome su 759 (proprio
     quello), zero negli altri cinque moduli. */
  const destrutturati = new Set(
    [...kpi.matchAll(new RegExp(`\\{([^{}]*)\\}\\s*=\\s*${app}\\s*;`, "g"))]
      .flatMap((m) => m[1].split(",").map((s) => s.trim().split(":").pop().trim()))
      .filter(Boolean));
  const usate = esporta.filter((n) =>
    new RegExp(`\\b${app}\\.${n}\\b`).test(kpi)
    || (destrutturati.has(n) && new RegExp(`\\b${n}\\s*\\(`).test(kpi)));
  const mancanti = esporta.filter((n) => !usate.includes(n));
  guardate += esporta.length;
  coperte += usate.length;

  const fondo = FONDO[app] || 0;
  const sopraFondo = usate.length >= fondo;
  const tutte = mancanti.length === 0;          // la regola vera, dal 03/08
  const ok = sopraFondo && tutte;
  if (ok) { passed++; } else { failed++; }
  righe.push(`  ${ok ? "✓" : "✗"} ${app.padEnd(11)} ${String(usate.length).padStart(3)}/${String(esporta.length).padEnd(3)}`
    + ` ${String(Math.round(100 * usate.length / (esporta.length || 1))).padStart(3)}%`
    + (sopraFondo ? (usate.length > fondo ? `  (il fondo era ${fondo}: alzalo)` : "") : `  SOTTO IL FONDO DI ${fondo}`)
    + (tutte ? "" : `  ${mancanti.length} SENZA PROVA: ${mancanti.join(", ")}`)
    + (ELENCO && mancanti.length ? `\n      scoperte: ${mancanti.join(", ")}` : ""));
}

console.log("\nCopertura delle funzioni pure, app per app");
console.log("(contata leggendo gli export e cercando `app.<nome>` in run-kpi.mjs)\n");
console.log(righe.join("\n"));
console.log(`\n${coperte} funzioni coperte su ${guardate} guardate, in ${APP.length} app`
  + `  ·  ${FUORI.size} tenute fuori di proposito (rete o localStorage)`);

/* ── E IL CODICE CONDIVISO? ───────────────────────────────────────────
   Questo censimento si chiama «quante funzioni delle APP sono provate», e
   fino al 03/08 guardava solo `apps/<nome>/<nome>-data.js`. Ma la regola
   vincolante dice che ciò che serve a due app vive in `shared/` — cioè il
   codice più delicato di tutti finiva **fuori dal conto**, e una funzione
   nuova aggiunta lì non avrebbe fatto scendere nessun numero.
   Misurato prima di allarmarsi, che è l'altra regola: la copertura vera è
   **alta** (18/19 su dw-ponti, 23/27 su dw-shell, 5/6 su pointcloud). Non
   c'era un buco nel prodotto; c'era un buco nel CONTROLLO, che diceva
   «tutto a posto» su un perimetro più stretto del suo nome. Adesso il
   perimetro è dichiarato, con il suo fondo. */
const CONDIVISI = [
  /* ⚠️ SALE DA 23 A 31: le otto della densità arrivate da Terra (vedi il fondo
     di `terra`, che scende di altrettante). È il caso che questo modulo esiste
     per ospitare — la stessa autorizzazione letta da due app — e il numero che
     sale qui e scende là è la prova che è un TRASLOCO e non una copia. */
  /* ⚠️ E DA 31 A 38 IL 03/08, alzato DOPO aver visto il conto salire davvero
     (38/38, «il fondo era 31: alzalo»): il vocabolario del near-miss traslocato
     da Scudo — `NEARMISS_CATEGORIE`, `NEARMISS_LUOGHI`, `categoriaNearMiss`,
     `luogoNearMiss`, `descrizioneNearMiss` — più `CHI_SEGNALA` e
     `bozzaNearMiss`, che sono nuove. Il fondo di `scudo` scende di cinque
     nello stesso momento: i due numeri vanno letti insieme. */
  { file: "shared/dw-ponti.js", fondo: 89,
    perche: "le regole che servono a DUE app: è il posto dove un difetto si moltiplica" },
  /* 40 → 41 il 06/08: `modoDimostrazione`, cioè «questi dati sono veri?».
     Era scritta in quattro varianti dentro quattro pagine (Conti, Scudo,
     Terra, Campo) e nessuna delle quattro era misurabile da qui — una funzione
     dentro un `.html` non la importa nessuno. Salita in `shared/`, entra nel
     conto e si prova chiamandola: è lo stesso movimento di
     `nomeCsvDimostrazione` di ieri, e il segno che erano nel posto sbagliato
     era lo stesso — per provarle bisognava estrarre la riga dal sorgente. */
  /* 47 → 48 il 13/08 con `frasePersi`, la frase «queste righe del file non
     sono entrate» che era scritta quattro volte, una per pagina, in Campo,
     Conti, Flotta e Terra. Sta qui perché è fatta con `conta`, che sta venti
     righe più su in questo stesso file. */
  /* ⏱️ ALZATO IL 14/08, 48 → 53, con le cinque funzioni di B8: `CSV_TABELLE`,
     `CSV_MIN_CELLE`, `tabelleCsvDi`, `fileDiAltraTabella`, `fraseFileAltrui`.
     Riconoscono che un CSV è l'intestazione di un'ALTRA nostra tabella — la
     sola domanda possibile, visto che i lettori tollerano di proposito un file
     senza intestazione. Il fondo si alza DOPO aver visto il conto salire
     (53/53), e si alza perché un fondo che sta cinque sotto il conto vero non
     può più scattare. */
  { file: "shared/deepwork-id-client/dw-shell.js", fondo: 61,
    perche: "gli aiuti che tutte le app importano (numeri, date, CSV)" },
  { file: "apps/genesi/pointcloud.js", fondo: 5,
    perche: "il calcolo del volume dal drone: da lì passano i m³ che consumano la concessione" },
  /* ⛔ IL PRIMO PEZZO DI GENESI USCITO DA `genesi.html` (01/08). Genesi era
     l'unica parte del prodotto con ZERO prove pure — le sue 192 funzioni
     stanno dentro un file `.html`, che `node` non importa. Queste sei
     scrivono quasi trecento numeri della pagina, e difendono il principio del
     fondatore nel punto in cui si vede: su un dato che manca scrivono «—»,
     non «0». Quanto è grande il resto del cantiere lo misura
     `genesi-estraibili.mjs`. */
  /* 6 → 8 il 03/08: `gEsito` e `gIn`, cioè come Genesi LEGGE un numero
     scritto a mano. Sono arrivate insieme al blocco della riconciliazione
     (`riconDelta` le chiama) e stanno qui perché scrivere e leggere sono le
     due metà della stessa convenzione sui numeri italiani. */
  { file: "apps/genesi/genesi-formato.js", fondo: 9,
    perche: "come Genesi scrive — e legge — i numeri: spalla, maglia, consumo specifico, chili di esplosivo" },
  /* ⛔ IL SECONDO PEZZO DI GENESI USCITO DALLA PAGINA. Il primo diceva come
     Genesi SCRIVE un numero; questo dice come lo CALCOLA, sul numero che
     decide se una volata si può sparare: quanto farà vibrare la casa più
     vicina. Dentro c'è la catena intera — il file del sismografo, la
     regressione di Devine con la riga di progetto al 95°, la soglia di norma,
     la sovrappressione d'aria. Restano nella pagina solo quelle che leggono
     `localStorage` o lo stato del progetto (`sitoStore`, `sitoLegge`,
     `ppvSite`, `computeMIC`): portarle fuori è un rifacimento, non un
     trasloco. Quanto manca lo misura `genesi-estraibili.mjs`. */
  /* 12 → 14 il 02/08: `ppvSenzaSoglia` e la sua tabella `PPV_SENZA_SOGLIA`,
     cioè la RAGIONE per cui una soglia di vibrazione manca. */
  /* ⛔ 14 → 25 il 03/08: IL TERZO PEZZO DI GENESI USCITO DALLA PAGINA, e sta
     insieme per mestiere — la RICONCILIAZIONE previsto-vs-reale. Il giro
     intero del dato che torna dal campo: il consuntivo di carico che Campo
     riesporta (`_riconParseCampo`), i chili che diventano numeri
     (`_riconRiassuntoCampo`), i numeri che diventano schermo (`_ricKg`,
     `_ricSegno`, `_ricPct`, `_ricPlur`, `_ricData`, `_ricColore`,
     `riconDelta`, `_rEsc`) e lo storico che esce in CSV
     (`csvRiconciliazione`, che prima era il corpo di un `onclick` anonimo —
     un file che esce dall'azienda e che nessuna prova poteva chiamare).
     Sono entrate identiche, copiate da un programma: le 25 prove blindano il
     comportamento di oggi, difetti compresi e dichiarati nel loro nome. */
  /* 03/08: +5 col verdetto sulla vibrazione (`esitoPpv`, `esitoAirblast`,
     `provenienzaPpv`) e il confronto A/B (`vincitoreKpi`, `stessaBasePpv`),
     spostati fuori dalla pagina perché il FOGLIO STAMPABILE non li prendeva. */
  /* ⛔ 31 → 36 il 06/08: IL QUARTO PEZZO DI GENESI USCITO DALLA PAGINA, e sta
     insieme per una ragione sola — è il CASO RIPETIBILE. I due generatori
     pseudocasuali (`mulberry32` per il replay del fronte 3D, `_rngDa` per la
     banda d'incertezza), il rumore continuo della parete (`vnoise3`), la
     deviazione sorteggiata del foro (`_gauss`) e i percentili del campione
     (`_perc`). Era la parte in cui un difetto NON SI VEDE: un generatore
     rotto restituisce comunque numeri fra 0 e 1 e la banda continua a
     disegnarsi. Le 14 prove guardano la ripetibilità (stesso seme, stessa
     sequenza), il dominio, le due guardie che sembrano buchi — il seme zero e
     il logaritmo di zero — e il principio del fondatore su `_perc`, che su un
     campione vuoto risponde `null` e non zero: uno zero lì si leggerebbe
     «burden minimo zero metri», l'allarme più grave di quella schermata,
     scritto dove non è stato misurato niente.
     Restano nella pagina `jitterGeo`, `worldJitter` e `simulaPerforazione`,
     che scrivono in una geometria THREE o leggono lo stato del progetto. */
  /* 61 → 62 il 13/08 con `campoMisurato`: la domanda «questo consuntivo di
     Campo è stato misurato?» fatta UNA volta per i due che rileggono un
     consuntivo salvato — la riga di storico e il CSV che esce dall'azienda —
     dopo che tutt'e due dichiaravano «0 kg caricati» dove lo schermo scriveva
     «—». ⚠️ E il fondo va alzato subito: finché resta indietro, questa riga
     esce con la coda «(il fondo era N: alzalo)», che rompe la lettura per
     modulo di `numeri-nei-documenti` — la sua regex vuole la fine riga — e da
     lì il controllo dichiara di aver letto 4 moduli su 5. */
  /* ⏱️ 62 → 64 il 13/08: il blocco G17 ha portato dentro `CONFIN_SENZA_CONTO` e
     `confinamentoColletto`, cioè l'SDOB tolto dalle due copie che se lo
     scrivevano in casa. Il fondo si alza SUBITO, se no la riga esce con la coda
     «(il fondo era N: alzalo)» e `numeri-nei-documenti` smette di leggerla. */
  /* ⏱️ 64 → 66 il 13/08: il blocco B0-tervicies ha portato dentro
     `FLY_SENZA_SPALLA` e `gittataSenzaSpalla` — la gittata flyrock quando la
     spalla non c'è, tolta dal ripiego `D2.B||SPALLA` che la ricavava da un
     burden che nessuno aveva scritto. */
  /* 127 → 128 il 12/09 (unità 121): `_sitoParseCsv` è salita da genesi.html,
     pura — il censimento di `genesi-estraibili.mjs` la marcava come legata a
     quattro variabili del modulo per un falso positivo del suo tokenizzatore
     (lettere dentro le regex della funzione, prese per nomi). Il fondo si
     alza SUBITO, per la ragione già scritta qui sopra due volte: se no la
     riga esce con la coda «(il fondo era N: alzalo)» e `numeri-nei-documenti`
     smette di leggerla.
     128 → 129 lo stesso giorno (unità 122): `_sentCell`, stessa famiglia e
     stesso falso positivo (lettere di `/[\r\n\t]+/g` lette come "r, n, t, g").
     129 → 131 lo stesso giorno (unità 124): `esplCardHtml` e `innCardHtml`,
     una nuova veste della stessa famiglia — qui le lettere false vengono da
     CONTENUTO DI STRINGHE (`'ritardi '`, `"es-nome"`), non da una regex.
     131 → 137 il 12/09 (unità 126): `ppvDaSd` (la legge di Devine, unificata
     da due copie inline nella pagina), `rwsEffettiva`/`PENALITA_ACQUA` (la
     penalità dei fori bagnati, unificata da cinque copie), e l'ottimizzatore
     `caricaTargetSenzaConto`/`caricaDaX50Target` (la carica per centrare un
     obiettivo di pezzatura — l'inversa di `fragKuzRam`).
     137 → 140 il 12/09 (unità 129): `abbinaForiRighe` (l'abbinamento
     foro↔riga estratto da `confrontoPerForo`, perché la nuova funzione qui
     sotto ne aveva bisogno identico — "una copia nasce da una firma troppo
     stretta"), `deviazioneForiDaCsv` (il rilievo boretrack, CSV
     tempo-ampiezza→dx/dy) e `burdenVeroDaRilievo` (il burden vero sulle
     posizioni MISURATE, non su quelle simulate o di progetto).
     140 → 141 il 13/09 (G33, richiesta diretta del fondatore "rendere Genesi
     più simile a un CAD"): `dxfPianoFori`, che esporta in DXF (formato che
     AutoCAD/LibreCAD/QGIS sanno aprire) i fori e il profilo del fronte già
     calcolati — nessun numero nuovo, nessuna soglia di sicurezza toccata. Le
     quattro funzioni interne (`_dxfNum`, `_dxfCerchio`, `_dxfTesto`,
     `_dxfPolilinea`) non hanno il prefisso `export` e quindi questo
     censimento non le vede: le prova la stessa suite attraverso
     `dxfPianoFori`, che le chiama tutte.
     141 → 142 il 13/09 (G34, stesso giorno): `snapAGriglia`, l'aggancio
     opzionale alla griglia per il posizionamento manuale (disegno di
     precisione — secondo pezzo di "tutte e tre le alternative").
     142 → 143 il 13/09 (G35, stesso giorno): `misuraGeom2D`, salita da
     `genesi.html` (`measureGeom2D`) nel filone "Genesi continua a uscire
     dalla pagina" — stessa logica, firma a parametri invece di leggere `D2`
     a mano; la pagina resta un chiamante come un altro.
     143 → 144 il 13/09 (G36, stesso giorno): `_puntiNuvola`, stessa fetta —
     non leggeva `D2` per niente (falso positivo del tokenizzatore, la
     quarta volta sullo stesso file), traslocata parola per parola con lo
     stesso nome: nessun wrapper resta in pagina, l'import la sostituisce.
     144 → 145 il 14/09 (G37, B0-septies — la decisione roadmap del 04/09):
     `magliaAssenteMotivo`, nuova — decide SE la maglia si può disegnare
     (burden e interasse leggibili) prima che `genMaglia2D` generi le
     coordinate, così i cinque consumatori a valle (`computeEnergia2D` e c.)
     restano protetti dalla loro guardia già scritta su `H.length===0`
     invece di calcolare su una maglia degenerata.
     145 → 146 il 14/09 (G38, prima fetta scomposta di G7 — l'ottimizzatore
     di volata): `curvaBurdenCarica`, nuova — per un burden variabile e una
     frammentazione target fissa, quanta carica servirebbe: riusa
     `volumeForo` e `caricaDaX50Target`, già in questo file.
     146 → 147 il 14/09 (G39, cantiere B3): `innescoSuMaglia`, salita da
     `genesi.html` (`computeInnesco2D`) — quinta volta che il censimento
     statico bucketizzava una funzione come «più di dieci variabili» per un
     falso positivo dell'euristica sull'indentazione, quando la dipendenza
     vera era una sola (`D2`). Entrata identica, confrontata byte per byte
     con una copia della vecchia forma inline su cinque casi.
     147 → 148 il 14/09 (G40, cantiere B3, stesso giorno): `reliefSuMaglia`,
     stessa famiglia esatta — salita da `computeRelief2D`. Stesso metodo di
     verifica.
     148 → 149 il 14/09 (G41, cantiere B3, stesso giorno): `energiaSuMaglia`,
     sesta volta sulla stessa famiglia — salita da `computeEnergia2D`.
     `interpFronte(mx)` (wrapper di pagina) è diventata `interpProf(profilo,
     mx)` nella forma pura, con `D2.profilo` passato come parametro esplicito.
     149 → 150 il 14/09 (G42, cantiere B3, stesso giorno, ULTIMA fetta del
     gruppo): `sequenzaSuMaglia`, salita da `computeSeq2D` — settima volta
     sulla stessa famiglia. Fa solo il calcolo (tCalc/tDet/seq, `lastDet`
     come valore di ritorno); l'orchestrazione delle altre tre (relief,
     energia, innesco) resta nel wrapper di pagina, per scelta dichiarata.
     150 → 151 il 14/09 (G43, cantiere B3, stesso giorno): `generaMaglia`,
     salita da `genMaglia2D` — NON un falso positivo (quella funzione muta
     `D2` davvero ed è per questo genuinamente nel bucket "11+"): solo il
     calcolo delle coordinate esce, riusabile da un futuro ottimizzatore
     che deve provare un burden diverso senza toccare il progetto disegnato.
     151 → 152 il 14/09 (G44, cantiere B3, stesso giorno): `vibrazionePerBurden`,
     nuova — la seconda fetta di G7, resa possibile da G39-G43 (sequenza e
     maglia ora pure): per ogni burden candidato di `curvaBurdenCarica`,
     genera una maglia di prova, la sequenzia con le impostazioni di oggi e
     stima MIC/PPV con le stesse funzioni pure della Scheda volata.
     152 → 153 il 14/09 (G47d, ULTIMA fetta di "Genesi simile a un CAD"):
     `dxfInTratti`, il lettore DXF in sola lettura — porta LINE e POLYLINE
     dentro come tratti (mai come fori/fronte/piede: è la scelta di
     sicurezza sulla convenzione degli assi, vedi il commento della
     funzione). `_dxfEntita` resta privata (non esportata), non entra nel
     conto.
     153 → 154 il 14/09 (B3, cantiere del trasloco di Genesi, ripreso dopo
     G47): `pfNominale`, con CAMBIO DI FIRMA (`pfNominale(D2)` invece di
     leggere `D2` dalla chiusura) — lo stesso schema già usato per ogni
     altro "legame di una riga" di questa fascia. Il consumo specifico
     nominale di progetto, già composto da due funzioni pure
     (`consumoSpecifico`, `volumeForo`) già in questo modulo: la funzione
     stessa non calcolava niente di nuovo.
     154 → 155 il 14/09 (B3, stesso giorno): `pieDev`, stesso schema
     (`pieDev(D2, x)`), componeva solo `interpProf` già pura. Effetto
     collaterale VERO (non rumore del tokenizzatore): `mdlBuild`, che la
     chiama, è passata da 10 a 11 variabili lette — perché ora deve
     scrivere `D2` esplicitamente nella chiamata (`pieDev(D2, x)` invece
     di `pieDev(x)`), e quel token è nel suo corpo per davvero. Misurato
     confrontando l'elenco `--elenco` prima/dopo: è l'unica funzione
     spostata di bucket, ed è un effetto reale del cambio di firma, non
     un margine accettato dello strumento.
     155 → 156 il 14/09 (B3, stesso giorno): `reliefCls`, stesso schema
     (`reliefCls(D2, r)`), componeva solo `classeRelief` già pura — un
     "legame di una riga" del blocco G26 (10/09), la prima volta che B3
     tocca una funzione già marcata "resta come legame" da un cantiere
     precedente invece di una nascosta nel bucket "1-2" senza commento:
     il commento descriveva l'architettura di allora, non un divieto a
     finire l'estrazione dopo. I suoi due chiamanti (`drawDesign2D`,
     `renderInspector`) leggono già `D2` per conto proprio: nessuno
     spostamento di bucket, misurato confrontando `--elenco` prima/dopo.
     156 → 157 il 14/09 (B3, stesso giorno): `computeEnergia2D`, stesso
     schema (`computeEnergia2D(D2)`), componeva solo `energiaSuMaglia`
     già pura dal blocco G41 (14/09). A differenza di `reliefCls`, la
     funzione esce DEL TUTTO dalla pagina (non lascia un wrapper: era
     void, un solo punto di chiamata dentro `computeSeq2D`), quindi il
     totale nella pagina scende di uno invece di restare fermo (152→151,
     bucket "1-2" 57→56, estraibili 65→64). L'unico effetto collaterale
     misurato confrontando `--elenco` prima/dopo è che `computeSeq2D`
     perde `computeEnergia2D` dal proprio elenco "chiama": non è più una
     funzione della pagina da chiamare, è un import — nessuno
     spostamento di bucket vero.
     157 → 158 il 14/09 (B3, stesso giorno): `isoPasso`, stesso schema
     (`isoPasso(D2)`), componeva solo `passoIsocrone` già pura dal
     blocco G24 (10/09) — come `computeEnergia2D`, esce DEL TUTTO dalla
     pagina (nessun wrapper: due punti di chiamata, entrambi aggiornati
     a `isoPasso(D2)`). Nessuno spostamento di bucket per altre
     funzioni, misurato confrontando `--elenco` prima/dopo.
     158 → 160 il 14/09 (B3, stesso giorno): DUE funzioni in un'unica
     unità, perché accoppiate — `computeRelief2D` chiama `scatterMs`,
     quindi non si poteva cambiare la firma dell'una senza l'altra.
     `scatterMs(D2)` componeva solo `scatterInnesco` già pura (dal
     bucket "3-5", falso vero: leggeva `D2` più tre parole corte di un
     commento vicino, non un vero incrocio); `computeRelief2D(D2)`
     componeva `reliefSuMaglia` già pura dal blocco G40 (14/09). Nessuno
     dei due lascia un wrapper (tre punti di chiamata in tutto,
     aggiornati tutti a passare `D2`): 150→148 funzioni nella pagina,
     bucket "1-2" 55→54, bucket "3-5" 15→14 (usciva `scatterMs`),
     estraibili 63→62. Unico effetto collaterale reale: `computeSeq2D`
     perde `computeRelief2D` dal proprio elenco "chiama" (stessa
     famiglia di `computeEnergia2D`), misurato confrontando `--elenco`
     prima/dopo.
     160 → 162 il 14/09 (B3, stesso giorno): DUE funzioni indipendenti
     in un'unica unità — `_spazTipico(D2, H)` (componeva solo
     `spaziaturaTipica` già pura dal blocco G24) e `innTaglioOk(D2, dt)`
     (componeva solo `taglioRealizzabile` già pura dal blocco G25).
     Non accoppiate come `scatterMs`/`computeRelief2D`: raggruppate solo
     perché entrambe erano gli ultimi "legami di una riga" rimasti nei
     rispettivi blocchi. Nessuna delle due lascia un wrapper (tre punti
     di chiamata in tutto: uno per `_spazTipico`, due per
     `innTaglioOk`). 148→146 funzioni nella pagina, bucket "1-2" 54→52,
     estraibili 62→60. Nessuno spostamento di bucket per altre funzioni
     (i due chiamanti di `innTaglioOk`, `drawInnesco2D`/`renderScheda2D`,
     sono già nel bucket "11+" e non ne escono).
     162 → 165 il 14/09 (B3, stesso giorno): TRE funzioni uscite insieme
     — `activeProf(D2)`, `d2HitTest(D2, px, py)`, `d2HitTestPt(D2, px,
     py)` — perché `d2HitTest`/`d2HitTestPt` compongono `puntoTela`/
     `indicePiuVicino` (già pure) e `d2HitTestPt` compone anche
     `activeProf`: non potevano cambiare firma separatamente.
     `activeProf` non delega a nessuna funzione del modulo (calcola
     direttamente da `D2.tool`): è la prima fetta di B3 senza una
     funzione pura preesistente da comporre, solo pura di suo.
     `d2HitTest` sostituisce `interpFronte(mx)` (wrapper di pagina, che
     resta: sedici altri punti di chiamata) con `interpProf(D2.profilo,
     mx)` diretto, come già fatto per G41. Nessuna delle tre lascia un
     wrapper: sei punti di chiamata in tutto. 146→143 funzioni nella
     pagina, bucket "1-2" 52→49, estraibili 60→57.
     ⚠️ Effetto collaterale nel censimento, non un bucket-shift:
     `d2Move` mostra `computeSeq2D` nel proprio elenco "chiama" dove
     prima non compariva — quella chiamata è nel suo corpo da sempre
     (riga già presente, non toccata da questa unità), il censimento la
     vedeva mascherata mentre elencava `activeProf`. Margine noto dello
     strumento (stessa famiglia delle parole corte nei commenti), non
     un difetto di questa fetta: bucket "3-5" di `d2Move` invariato.
     165 → 166 il 14/09 (B3, stesso giorno): `_snapXY(D2, v)`, l'ultimo
     legame di una riga rimasto nel blocco G34 (l'aggancio opzionale
     alla griglia) — componeva solo `snapAGriglia` già pura. Dieci
     punti di chiamata nella pagina, tutti dentro gli event handler del
     mouse dell'editor 2D, tutti aggiornati a passare `D2` (sostituzione
     globale sicura: `_snapXY(` non compare in nessun altro contesto).
     Nessun wrapper lasciato: 143→142 funzioni nella pagina, bucket
     "1-2" 49→48, estraibili 57→56. Stesso margine dello strumento già
     visto su `activeProf`: `d2Move` guadagna `renderInspector` nel
     proprio elenco "chiama" (chiamata presente nel suo corpo da
     sempre, prima mascherata da `_snapXY`) — bucket "3-5" invariato.
     ⏱️ 15/09: `computeInnesco2D(D2)`. Il G39 del 14/09 aveva già estratto
     `innescoSuMaglia` ma lasciato in pagina il legame a zero argomenti
     (stessa forma di `computeEnergia2D`/`computeRelief2D` prima di
     loro) — misurato che non c'era nessuna ragione strutturale per
     fermarsi un passo prima delle sue due sorelle: unico chiamante
     (`computeSeq2D`, dentro `computeSeq2D`) già con `D2` in scope.
     Nessun wrapper lasciato: 142 funzioni nella pagina (invariate,
     nessuna eliminata: era già zero-arg, ora è un'importazione),
     bucket "1-2" 48→47, estraibili 56→55. Difetto iniettato provato e
     rimesso: uno scambio S/B è invisibile per costruzione (usati solo
     dentro un `Math.max` simmetrico, stessa trappola già presa su
     `_spazTipico`); il difetto verificabile è sulla sorgente dei fori
     (`D2.piede` al posto di `D2.holes`), catturato dal confronto con
     la chiamata diretta a `innescoSuMaglia`. Nessuno spostamento di
     bucket per altre funzioni, misurato confrontando `--elenco`
     prima/dopo su una worktree.
     ⏱️ 15/09: `measureGeom2D(design)`. Il G35 del 13/09 aveva già
     estratto `misuraGeom2D` ma lasciato in pagina il legame a zero
     argomenti — sette punti di chiamata, tenuto per il nome corto.
     Nessun wrapper lasciato: 138 funzioni nella pagina (era 139:
     -1 per il legame tolto), bucket "1-2" 41→40 (nessuno spostamento
     collaterale, a differenza di `mdlProfSnap`: i sette chiamanti
     leggevano già abbastanza altre variabili di modulo), estraibili
     49→48. Difetto iniettato provato e rimesso: uno scambio S/B nel
     composer si vede SOLO nel caso senza fori (con fori veri la
     spaziatura si ricalcola dalle posizioni, stessa famiglia di
     `_spazTipico`/`computeInnesco2D`), catturato dal test dedicato
     con `holes: []`. */
  { file: "apps/genesi/genesi-data.js", fondo: 168,
    perche: "la vibrazione al recettore e la riconciliazione previsto-vs-reale: i due numeri di Genesi che decidono qualcosa" },
];
/* Fuori per un motivo, non per dimenticanza. Le prime tre toccano il DOM o
   l'orologio e vivono nei banchi del browser (`tests/browser/`), non in
   Node; le ultime due sono costanti, e una costante non si «prova». */
const FUORI_CONDIVISI = new Map([
  ["montaGuardiaInteri", "tocca il DOM — provata in browser/interi-superfici.mjs"],
  ["mountExit", "tocca il DOM — provata dai banchi del browser"],
  ["montaScaricaTutto", "tocca il DOM e scarica un file — provata in browser/scarica-tutto.mjs"],
  ["timbroLocale", "legge l'orologio — provata in browser/"],
  ["interoScritto", "tocca il DOM — provata in browser/interi-superfici.mjs"],
  ["ESITI_TURNO", "è una costante: non ha comportamento da provare"],
  ["MAXPTS", "è una costante: non ha comportamento da provare"],
]);

const suite = ["run-kpi.mjs", "run-helpers.mjs", "run-pointcloud.mjs"]
  .map((f) => readFileSync(join(QUI, f), "utf8")).join("\n");

const righeC = [];
let guardateC = 0, coperteC = 0;
for (const c of CONDIVISI) {
  const src = readFileSync(join(RADICE, c.file), "utf8");
  const esporta = [...src.matchAll(/^export (?:async )?function (\w+)|^export const (\w+)/gm)]
    .map((m) => m[1] || m[2])
    .filter((n) => !FUORI_CONDIVISI.has(n));
  const usate = esporta.filter((n) => new RegExp(`\\b${n}\\b`).test(suite));
  const mancanti = esporta.filter((n) => !usate.includes(n));
  guardateC += esporta.length; coperteC += usate.length;
  const sopraFondo = usate.length >= c.fondo;
  const tutte = mancanti.length === 0;
  const ok = sopraFondo && tutte;
  if (ok) { passed++; } else { failed++; }
  const nome = c.file.replace(/^.*\//, "");
  righeC.push(`  ${ok ? "✓" : "✗"} ${nome.padEnd(20)} ${String(usate.length).padStart(3)}/${String(esporta.length).padEnd(3)}`
    + (sopraFondo ? (usate.length > c.fondo ? `  (il fondo era ${c.fondo}: alzalo)` : "") : `  SOTTO IL FONDO DI ${c.fondo}`)
    + (tutte ? "" : `  ${mancanti.length} SENZA PROVA: ${mancanti.join(", ")}`)
    + (ELENCO ? `\n      ${c.perche}` : "")
    + (ELENCO && mancanti.length ? `\n      scoperte: ${mancanti.join(", ")}` : ""));
}
console.log("\nE il codice CONDIVISO, che nessuna app possiede e tutte usano");
console.log("(export cercati per nome in run-kpi + run-helpers + run-pointcloud)\n");
console.log(righeC.join("\n"));
console.log(`\n${coperteC} funzioni condivise coperte su ${guardateC} guardate, in ${CONDIVISI.length} moduli`
  + `  ·  ${FUORI_CONDIVISI.size} tenute fuori con la ragione scritta`);

/* ⛔ E QUELLO CHE QUESTO CENSIMENTO NON GUARDA, DETTO DA LUI STESSO.
   Un «456 su 456, 100%» si legge «tutto il prodotto è provato», e non è vero:
   il conto guarda i sei moduli `apps/<nome>/<nome>-data.js` e tre file
   condivisi. **Genesi non ha un modulo dati**: la sua logica sta dentro
   `apps/genesi/genesi.html`, e da lì `node` non la può importare. Di Genesi
   entra nel conto solo `pointcloud.js`.
   Non è una svista da correggere qui: tirare fuori un `genesi-data.js` è un
   cantiere intero, ed è la ragione per cui questa riga esiste invece della
   correzione. Ma il numero non deve poter essere letto per più di quello che è
   — è la stessa lezione del fondo che prometteva di vedere un caso che non
   vedeva. Il conto si misura, non si scrive a mano: se un giorno le funzioni
   di Genesi diventano importabili, questa riga lo dirà da sé. */
/* ⚠️ Il `?` invece di uno zero è voluto: se la lettura fallisse, uno zero si
   leggerebbe «Genesi non ha funzioni fuori conto», cioè la risposta più
   tranquilla — e sarebbe l'errore che questo blocco esiste per non fare. Il
   primo tentativo ha davvero stampato `?` (avevo scritto `root` invece di
   `RADICE`), e si è visto subito. */
const genesiPagina = (() => {
  try {
    const t = readFileSync(join(RADICE, "apps/genesi/genesi.html"), "utf8");
    // `async function` conta come le altre (02/09): è la stessa forma di
    // `genesi-estraibili`, che per un giorno non le vedeva e perdeva renderHome
    return (t.match(/^\s*(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/gm) || []).length;
  } catch { return null; }
})();
/* ⚠️ Questa riga diceva «di Genesi entra solo pointcloud.js» ed è stata
   corretta il 01/08, quando `genesi-formato.js` è diventato il secondo:
   una riga di riepilogo che contraddice il proprio elenco è il difetto che
   `numeri-nei-documenti.mjs` esiste per prendere nei documenti — e qui
   sarebbe stata la rassicurazione peggiore, perché il numero che ammette il
   buco è proprio quello. */
const daGenesi = CONDIVISI.filter((s) => s.file.startsWith("apps/genesi/"));
console.log(`\n⛔ Fuori dal conto, e va detto: **Genesi non ha ancora un modulo dati unico**.`
  + ` Le sue ${genesiPagina == null ? "?" : genesiPagina} funzioni restano dentro genesi.html,`
  + ` che node non importa. Di Genesi entrano qui i moduli gia' tirati fuori:`
  + ` ${daGenesi.map((s) => s.file.split("/").pop()).join(", ")}.`
  + `\n   Quindi il 100% qui sopra vale per il perimetro misurato, non per tutto il prodotto.`
  + `\n   Quanto e' grande il resto: node apps/deepwork-id/tests/genesi-estraibili.mjs`);

/* ⛔ E L'ALTRA META' DEL PERIMETRO, che fino all'08/08 non era dichiarata.
   Il blocco qui sopra dice che Genesi resta fuori, e lo dice bene. Ma restano
   fuori anche **cinque moduli condivisi**, e quello non lo diceva nessuno —
   cioè il numero «703 su 703, tutte al 100%» si leggeva più largo di quello
   che è. È la regola dell'etichetta più larga del suo numero, applicata al
   controllo che quel numero lo produce.
   La ragione è **tecnica e legittima**: questo censimento legge gli `export`
   ESM, e quei cinque non ne hanno nessuno — espongono un oggetto globale
   (`dwGrafici`, `dwFluido`), attaccano funzioni a `window` (la struttura
   condivisa) o sono una classe (l'SDK). Non sono **non provati**: sono provati
   **altrove**, e qui sotto è scritto dove. Ma una ragione tecnica non
   dichiarata è indistinguibile da una dimenticanza — ed è esattamente per
   questo che stanotte tre moduli erano fuori da `run-stile` senza che nessuno
   lo sapesse. */
const FUORI_ESM = [
  ["shared/dw-grafici.js", "espone l'oggetto globale `dwGrafici`. La sua parte pura — la geometria dei tracciati — è esposta apposta in `dwGrafici.geometria` ed è provata da `run-kpi`; il resto disegna, e lo guardano i banchi `*-disegni.mjs`"],
  ["shared/dw-app-ui.js", "la struttura del core (toast, modale, alone): attacca 11 funzioni a `window` e vive solo dentro una pagina. La guardano i banchi del browser e la regola 17 di `run-stile`"],
  ["shared/deepwork-id-client/index.js", "l'SDK è una **classe**, non un modulo di funzioni pure: lo provano le 19 di `run-sdk.mjs` sotto l'emulatore (`giro-sicurezza.mjs`)"],
  ["shared/dw-tema.js", "due funzioni su `window` che scelgono il tema: si vedono solo in una pagina, e le guardano i banchi del contrasto nei tre temi"],
  ["shared/dw-fluido.js", "espone l'oggetto globale `dwFluido` (animazioni): nessuna logica di prodotto da provare senza browser"],
];
console.log(`\n⛔ E fuori dal conto ci sono anche ${FUORI_ESM.length} moduli condivisi, per una ragione tecnica`
  + ` che va DETTA e non lasciata intuire: questo censimento legge gli \`export\` ESM, e loro`
  + ` non ne hanno. Sono provati altrove, e qui c'e' dove:`);
for (const [f, perche] of FUORI_ESM) console.log(`   · ${f} — ${perche}`);
console.log(`   Cioe' il perimetro vero e': 6 app + 5 moduli con export ESM. Gli altri ${FUORI_ESM.length} non sono scoperti, sono contati da un'altra parte.`);

console.log(`\nRisultato copertura: ${passed} soggetti a posto, ${failed} con funzioni senza prova`
  + ` (o sotto il fondo)  ·  ${APP.length} app + ${CONDIVISI.length} moduli condivisi`
  + ` (Genesi: ${genesiPagina == null ? "?" : genesiPagina} funzioni nella pagina, fuori portata di node)`);
process.exit(failed > 0 ? 1 : 0);
