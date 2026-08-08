// ============================================================
// LE REGOLE DI STILE VINCOLANTI, RESE VERIFICABILI
//
// Alcune regole di CLAUDE.md non sono gusto: sono decisioni prese una volta e
// da non rimettere in discussione. Finché vivono solo in memoria di progetto,
// prima o poi qualcuno le rompe in buona fede — e nessuno se ne accorge,
// perché non falliscono i test, si vedono solo aprendo la pagina giusta.
// Qui diventano controlli che girano in automatico.
//
// 27 regole, al 07/08. *(Era rimasto scritto «tredici» per giorni mentre
// l'elenco cresceva: un numero in un commento non fallisce, sta lì — la stessa
// ragione per cui esiste `numeri-nei-documenti.mjs`. Adesso c'è una prova in
// fondo al file che lo confronta con le voci davvero elencate qui sotto.)*
//  1. NIENTE DIALOGHI DEL BROWSER. `alert()`, `confirm()`, `prompt()` sono
//     vietati dalla direttiva sullo stile. La ragione non è estetica: la
//     finestra ha il carattere e i bottoni del sistema operativo, su Android
//     compare incollata in cima allo schermo, in `confirm()` il bottone che
//     distrugge è indistinguibile da quello che annulla, e `prompt()` non
//     accetta la virgola decimale. Si usano la modale e il toast del core.
//  2. LE UNITÀ DI MISURA NON VANNO IN MAIUSCOLO. `m³` diventa `M³`, e
//     `µg/m³` diventa `ΜG/M³` — Chromium trasforma la mu in mu greca
//     MAIUSCOLA — cioè milligrammi, mille volte tanto, su un documento che il
//     cliente consegna all'ente. Il motore dei grafici condiviso avvolge da sé
//     le unità in `.dwg-u`: qui si controlla che quel meccanismo ci sia ancora
//     e che nessuna app torni a metterci una toppa locale che spegne il
//     maiuscolo a TUTTA l'intestazione (allontanandosi dal core).
//  3. NESSUN CAMPO DECIMALE È `type="number"`. In Chromium digitando «2,4» il
//     `.value` diventa «24» e `checkValidity()` risponde true: il browser
//     scarta la virgola e dichiara valido un numero dieci volte più grande.
//     Un campo si dichiara decimale in DUE modi — `step` frazionario oppure
//     `inputmode="decimal"` — e la regola all'inizio guardava solo il primo,
//     lasciandone passare 34 nel core.
//  4. NESSUN CAMPO DECIMALE SI LEGGE CON `parseNum0`, il lettore che di ciò che
//     non capisce fa ZERO. Zero non è «non lo so»: è una misura, ed è sbagliata,
//     e finisce dentro somme e medie senza lasciare traccia.
//  5. DOVE CI SONO CAMPI INTERI, LA GUARDIA È MONTATA. Gli interi restano
//     `type="number"` perché lì lo spinner serve, ma allora la virgola la
//     rifiuta `montaGuardiaInteri` di `shared/`: leggere `checkValidity()` non
//     basterebbe, perché su «1,5» il browser risponde **true**.
//  6. IL PONTE CON TERRA NON DÀ LA COLPA A CHI COMPILA. Se Campo dicesse «le
//     tue stime erano gonfie», i turni comincerebbero a scrivere numeri prudenti
//     invece di veri, e il dato peggiorerebbe dove serve. Il testo deve nominare
//     ENTRAMBE le spiegazioni, compresa quella che non riguarda i turni.
//  7. LA PROVENIENZA DI UN RILIEVO SI DECIDE IN UN POSTO SOLO. Cumulo = già
//     estratto, NON consuma il concesso; scavo sì. La regola era scritta due
//     volte: se una copia divergesse, il materiale tolto anni fa comincerebbe a
//     consumare la concessione senza nessun errore e senza nessun test rosso.
//  8. UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE non è un errore
//     per nessuno: il browser tace, la pagina si apre, la nota si vede — neutra,
//     dove il codice diceva «attenzione». Trovato dal vero: `.note.avviso`
//     esisteva in Terra e in Sentinella, in Campo e Scudo no, e tre note
//     d'avviso rendevano come note qualunque.
//  9. NESSUNA SUPERFICIE SI RISCRIVE IN CASA LA REGOLA DEGLI INTERI. Terra ne
//     aveva una copia, scritta prima che la guardia vivesse in `shared/` e con
//     un comportamento diverso: svuotava il campo. Montate tutte e due, «1.500»
//     diventava «500» — un numero plausibile e sbagliato, cioè la cosa che lo
//     svuotamento voleva evitare. Trovato digitando davvero, non leggendo.
// 10. UNO STATO VUOTO CON UN TITOLO HA ANCHE UNA SPIEGAZIONE. «Nessun mezzo da
//     lavoro» su uno schermo per il resto nero non dice a chi guarda che cosa
//     deve fare, né se il vuoto dipende da lui. Nel core erano tredici, ed è la
//     schermata che una cava nuova vede il primo giorno. Non riguarda i
//     segnaposto brevi dentro le schede («Nessun file»), che hanno la sola riga
//     di spiegazione di proposito: la regola guarda chi ha un TITOLO.
// 11. NESSUNA APP SI SCRIVE IN CASA IL SIMBOLO DELL'EURO. Il 30/07 erano tre
//     forme in tre app, ognuna con accanto la ragione per cui era quella
//     giusta: Conti «€\u00A048.200,00» (spazio unificatore), Terra
//     «€\u002048.200» (spazio normale), Flotta «€178,50» (attaccato). Nessuna
//     era sciatta: nessuna sapeva delle altre. E chi compra due app le vede una
//     accanto all'altra. La forma sta in `euro`/`euro0`/`conEuro` di `shared/`,
//     e chi ha un numero formattato a modo suo mette il simbolo con `conEuro`
//     invece di riscriverlo: è dalla scorciatoia che nascono le terze forme.
// 12. CHI SALTA I DOPPIONI LI CERCA ANCHE DENTRO IL FILE. Il 31/07 dieci
//     gestori d'importazione su dieci confrontavano ogni riga solo con
//     l'elenco caricato all'apertura della pagina, che NON si aggiorna mentre
//     il file scorre: due righe uguali nello stesso file entravano tutte e
//     due, in tutte e sei le app. E non è un caso di scuola — l'export di
//     Scudo scrive una riga per ogni scadenza, quindi ri-caricare il proprio
//     file faceva comparire tre volte lo stesso lavoratore. La regola guarda
//     solo i gestori che i doppioni li saltano davvero: dove ripetersi è
//     lecito (la telemetria che AGGIORNA invece di aggiungere, il piano di
//     carico che SOSTITUISCE quello vecchio) non pretende niente. Guarda
//     entrambe le forme in cui la difesa si scrive: `senzaDoppioni` di
//     `shared/` e il `Set` con la firma aggiunta DENTRO il ciclo — quattro
//     gestori usavano già la seconda, e facevano la cosa giusta da prima.
// 13. DUE ESPORTAZIONI NON SCARICANO LO STESSO NOME DI FILE. In Conti due
//     bottoni scaricavano tutti e due `conti_listino.csv`: uno era il listino
//     ri-caricabile, l'altro un prospetto coi prezzi già convertiti. Nella
//     cartella dei download uno copre l'altro, e nessuno dei due dice quale
//     sia quale — chi poi ri-carica quello sbagliato si sente rispondere che
//     non è valido e conclude che è l'app a non funzionare. Nessuna prova sul
//     comportamento lo trova: ogni export, preso da solo, funziona.
// 14. NESSUNA CLASSE DI COLORE DOVE IL COLORE NON È STATO MISURATO *(vedi il
//     corpo del file, dove la regola è scritta per esteso)*.
// 15. IL GIORNO DI CALENDARIO NON SI PRENDE IN UTC. `toISOString()` scrive
//     sempre l'istante a Greenwich: in Italia sta una o due ore avanti, e
//     quando attraversano la mezzanotte cambia il GIORNO. Il 31/07 questo
//     spostava di un mese intero le barre del grafico del core.
// 16. DENTRO UN MODULO, LE MIGLIAIA SI RAGGRUPPANO PER SCRITTO. Misurato il
//     02/08 affiancando i motori: con le opzioni di serie, sui numeri di
//     QUATTRO cifre Chromium scrive «6.375» e Node «6375». Le pagine non ne
//     soffrono (girano solo nel browser); i moduli sì, perché li leggono
//     tutt'e due — e da lì una prova che passa in Node e fallirebbe nel
//     browser, cioè che blinda una stringa che l'utente non vede mai.
// 17. LA STRUTTURA DEL CORE NON SI RISCRIVE IN CASA. Toast, modale, conferma,
//     richiesta di un valore e chiusura con Escape erano scritti SEI VOLTE —
//     27 copie, il 76% delle righe identico carattere per carattere — e una si
//     era già staccata perché a un'app serviva qualcosa in più. Ora stanno in
//     `shared/dw-app-ui.js`. La regola guarda le due direzioni opposte: chi
//     carica il condiviso non deve ridefinirle (una copia locale vince e
//     riapre la distanza), e chi le usa deve averle da qualche parte —
//     togliere le funzioni dimenticando il `<script>` non è un errore di
//     sintassi: la pagina si apre e muore al primo tocco.
//
// 18. UNA MAPPA DI STATI COPRE TUTTI GLI STATI CHE LA SUA FUNZIONE SA DIRE.
//     Il 03/08 `statoScadenzaHSE` ha guadagnato una quarta risposta («senza
//     data», perché una data illeggibile non è una scadenza a posto) e la mappa
//     dei badge di Scudo ne aveva tre: `B[st]` sarebbe stato `undefined` e
//     `B[st][0]` avrebbe ucciso la pagina **al disegno del primo riquadro** —
//     non un errore di sintassi, quindi nessun controllo esistente lo vedeva.
//     Terra aveva la stessa coppia e lo stesso rischio. La regola confronta le
//     stringhe che la funzione può restituire con le chiavi della mappa che la
//     pagina usa per disegnarle.
//
// 19. LA BARRA IN BASSO HA TANTE COLONNE QUANTE VOCI. `.nav` non è una fila
//     elastica: è una GRIGLIA a colonne fisse
//     (`grid-template-columns:repeat(var(--nav-cols),1fr)`), e il numero lo
//     dichiara ogni app. Aggiungere una voce senza toccarlo non stringe la
//     barra: la manda A CAPO, e l'ultima voce finisce su una seconda riga,
//     sotto le altre. Successo il 05/08 aggiungendo «Costi» a Conti: ottava
//     voce, numero rimasto a 7, «Report» sparito sotto la barra. Nessun errore
//     in console, nessuna prova rossa, e leggendo il codice non si vede —
//     l'unica cosa che l'ha trovato è stato guardare lo scatto. Se il numero
//     manca del tutto è peggio, perché non manca davvero: vale il 5 di
//     `shared/deepwork-style.css`, quindi una app da sei voci ne perde una.
//
// 20. UNA NON-MISURABILITÀ DICHIARATA DAL MODULO DEVE ESSERE LETTA DALLA
//     PAGINA. È il principio del fondatore — «l'assenza di un dato non è un
//     dato favorevole» — nella sua forma verificabile. Quando un modulo si
//     accorge di non poter misurare qualcosa lo dichiara con una bandiera
//     (`misurabile`, `leggibile`, `calcolabile`, `noto`, `attendibile`,
//     `pochi`) accanto al numero — e sono SEI, non otto: `misurato`, `assente`
//     e `mai`, che questa riga elencava fino al 03/08, sono fuori con la loro
//     ragione accanto a `BANDIERE`. Un'intestazione che promette più di quello
//     che il codice fa è la stessa bugia dei numeri nei documenti.
//     La dichiarazione ha DUE forme — `bandiera:` e `const bandiera =` — e per
//     un mese se ne cercava una sola: Genesi usa l'altra, quindi per Genesi la
//     regola non poteva scattare mai. Ma una bandiera che nessuno legge
//     **non protegge niente**: la pagina disegna il numero tranquillo lo
//     stesso, e il modulo sembra a posto perché la dichiarazione c'è. È la
//     stessa forma della guardia scollegata della regola 17 — togliere le
//     funzioni dimenticando il `<script>` — e dell'`impronta` non collegata al
//     giro: il pezzo esiste, e non è attaccato a niente.
//     ⚠️ Questa regola è nata da un censimento MIO SBAGLIATO, e la controprova
//     lo tiene fermo: la prima versione leggeva `/* backend assente: demo */` e
//     `// …volume noto: il` come dichiarazioni, e accusava due funzioni sane.
//     Un commento non è una dichiarazione. Per questo la regola non usa una
//     ricerca a testo ma `mascheraCodice`, che è lo scanner già provato del
//     file — la stessa lezione dei due tokenizzatori.
// 21. OGNI SUPERFICIE DELLE REGOLE DI STILE È APERTA ANCHE DAL GIRO DEL
//     BROWSER. Le due liste erano tenute a mano in due file, e in cima a
//     `giro.mjs` c'era scritto che «il controllo in fondo a questo file
//     pretende che combacino» — controllo che **non esisteva**. Misurato:
//     quindici superfici qui, undici nel giro. Quattro pagine che un cliente
//     apre davvero — fra cui l'accesso e l'amministrazione — non le guardava
//     nessun banco: né contrasto, né id doppi, né fuori-schermo.
// 22. DUE FOGLI CONDIVISI NON DEFINISCONO LO STESSO SELETTORE, o la ragione è
//     scritta. Stessa forma di `nomi-doppi.mjs` per le funzioni. Non è una
//     soglia: è l'insieme esatto, e cade nei due versi — un doppione nuovo, e
//     un doppione dichiarato che non si presenta più.
// 23. E NON BASTA CONFRONTARE I **NOMI**: si confrontano le DICHIARAZIONI.
//     `.page` era in tutt'e due i fogli e contava come doppione, ma il
//     `display:none` stava solo in shell — tolto shell, Flotta è passata da
//     1.755 a 19.344 px. Idem `cursor` su `.item` e `color`+`font-size` su
//     `.arr`. Tre perdite che il censimento per nomi non poteva vedere, e
//     nessuna delle tre rompe la pagina: cambiano un colore e una misura.
//
// 24. UN GRADIENTE CHE DIPINGE DELLE CIFRE HA IL SUO CONTO ACCANTO. Il
//     cartellone di cassa di Conti ritaglia il gradiente sulle lettere, e la
//     fermata BASSA tinge il basso delle cifre: nello stato «grave» era
//     `#a32b27` su fondo quasi nero, **2,17:1**, sotto il 3:1 che la WCAG
//     chiede al testo grande. Cioè il numero meno leggibile della pagina era
//     quello che compare quando c'è un problema. Sta qui e non nel banco del
//     browser per una ragione precisa: **il banco vede solo gli stati che la
//     dimostrazione produce**, e quello stato c'era per caso. Questa legge il
//     CSS, quindi li guarda tutti.
//
// 25. UN ELEMENTO FISSO E INVISIBILE NON DEVE MANGIARE I TOCCHI. Nel core il
//     toast era `opacity:0` ma `pointer-events:auto`, fisso e largo fino al 90%
//     dello schermo: una striscia invisibile sopra i comandi, **6 su 137**
//     coperti, due dei quali bottoni di esportazione. La versione giusta era
//     già in `shared/`, che si dichiara «copia del core»: qui la copia era
//     migliore dell'originale, e nessuno l'aveva riportato indietro.
//
// 26. I DATI DI RIFERIMENTO DEL FONDATORE NON ESCONO MAI. La regola ferrea del
//     25/07 («nessuna eccezione») viveva solo in prosa, e il 06/08 si e' visto
//     che era gia' violata: il core ripiegava su un `|| 25` — il ritardo di
//     quella origine — e lo scriveva nella sequenza disegnata di ogni foro.
//     La regola prende le CITAZIONI riconoscibili (il nome dell'innesco, la
//     maglia con le sue due misure, l'archivio dei video, le volate misurate);
//     NON prende gli usi travestiti, ed e' dichiarato: quel `|| 25` lei non lo
//     vedrebbe, l'ha trovato leggere il codice.
//
// 27. CHI NON HA I TRE TEMI E' DICHIARATO, NON SCOPERTO PER CASO. Le app
//     verticali girano fra scuro, chiaro e sole caricando `shared/dw-tema.js`;
//     il tema `sole` e' quello per chi legge il telefono IN CAVA, sotto il
//     sole. Il 07/08, misurando il contrasto nei tre temi, e' saltato fuori
//     che GENESI quel file non lo carica: chi progetta una volata non ha la
//     modalita' sole, e nessuna riga lo diceva — l'ha detto il banco
//     elencando le superfici che NON poteva misurare. Non e' per forza un
//     difetto (la palette di Genesi e' dichiarata fuori perimetro in
//     `docs/PALETTE_APP.md`), ma un'assenza scoperta per caso vale come non
//     saperla: qui l'elenco di chi ce l'ha e di chi no e' scritto, con la
//     ragione accanto, e una superficie nuova che se lo dimentica cade.
//// ⚠️ Le regole 21-23 sono nate senza entrare in questo elenco, e la prova in
// fondo al file **non se n'è accorta**: confronta il numero dichiarato con le
// voci elencate qui, cioè verifica che il commento sia coerente **con sé
// stesso**, non che copra il file. È il controllo che non guarda dove crede,
// nella sua forma più economica. Un conto automatico non è banale (non ogni
// `test(...)` è una regola), quindi per adesso resta una cosa da fare a mano —
// dichiarata qui invece che scoperta fra un mese.
//
// Come si aggiunge una regola: una funzione che restituisce l'elenco delle
// violazioni con file e riga, e un `test(...)` che pretende zero.
// ============================================================
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { classifica, mascheraCodice, senzaCommenti, COMMENTO, CODICE, DENTRO } from "./tokenizza.mjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const HERE = dirname(fileURLToPath(import.meta.url));
const root = join(HERE, "..", "..", "..");   // tests → deepwork-id → apps → radice

let passed = 0, failed = 0;
/* ⛔ LO STESSO DIFETTO DI run-kpi, e qui riguardava una prova sola — che è
   il modo in cui questi buchi sopravvivono: uno solo non si nota. Un `fn`
   `async` restituisce una PROMESSA, il `try` non vede mai il suo esito, e la
   prova finisce fra i passati qualunque cosa dicano le sue asserzioni. Si
   raccoglie e si aspetta prima del riepilogo, e quante se ne sono aspettate
   si stampa. */
const inVolo = [];
const test = (name, fn) => {
  const chiudi = (e) => {
    if (e) { failed++; console.error(`  ✗ ${name}: ${e.message}`); }
    else { passed++; console.log(`  ✓ ${name}`); }
  };
  try {
    const r = fn();
    if (r && typeof r.then === "function") { const p = r.then(() => chiudi(), chiudi); inVolo.push(p); return p; }
    chiudi();
  } catch (e) { chiudi(e); }
};
const ok = (cond, why) => { if (!cond) throw new Error(why); };

// Tutte le superfici che l'utente apre. Se nasce un'app, va aggiunta qui.
const SUPERFICI = [
  ["core (radice)", "index.html"],
  ["vetrina dell'ecosistema", "apps/index.html"],
  ["Genesi", "apps/genesi/genesi.html"],
  ["Conti", "apps/conti/index.html"],
  ["Flotta", "apps/flotta/index.html"],
  ["Scudo", "apps/scudo/index.html"],
  ["Campo", "apps/campo/index.html"],
  ["Sentinella", "apps/sentinella/index.html"],
  ["Terra", "apps/terra/index.html"],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html"],
  ["Deepwork ID · profilo", "apps/deepwork-id/profilo.html"],
  ["Deepwork ID · accesso", "apps/deepwork-id/index.html"],
  /* Entrate il 03/08. Erano pagine che l'utente apre davvero — una ci finisce
     quando gli manca un permesso, l'altra è il portone di Genesi — e nessuna
     regola di stile le aveva mai guardate: l'elenco si aggiornava a mano, cioè
     a memoria. Adesso c'è il controllo qui sotto che lo pretende. */
  ["Deepwork ID · non autorizzato", "apps/deepwork-id/non-autorizzato.html"],
  ["Genesi · accesso", "apps/genesi/login.html"],
  /* ⚠️ Entrato il 03/08 CORREGGENDO una mia esclusione sbagliata: l'avevo
     dichiarato «non raggiungibile dalla navigazione», e invece la home di
     Genesi ha un bottone «Apri il visore nuvola» (genesi.html:607) e Terra ci
     manda l'utente a parole quando manca il volume dal drone. Una ragione
     scritta va verificata come tutto il resto: dichiararla non la rende vera. */
  ["Genesi · visore nuvola", "apps/genesi/nuvola-poc.html"],
];
// I moduli dati e il motore condiviso: nessuna interfaccia, ma è da lì che
// partirebbe una regressione silenziosa.
const MODULI = [
  ["motore grafici", "shared/dw-grafici.js"],
  ["motore grafici (stile)", "shared/dw-grafici.css"],
  /* La struttura del core (toast, modale, alone) da quando vive in un posto
     solo. Ci è entrata il 03/08, il giorno dopo essere nata: nessuna regola la
     guardava, ed è il file che le sei app caricano tutte. */
  ["struttura condivisa", "shared/dw-app-ui.js"],
  ["guscio SDK", "shared/deepwork-id-client/dw-shell.js"],
  /* ⛔ ENTRATI L'08/08, e non perché siano nuovi: erano **fuori da ogni regola
     di questo file** da sempre, perché `MODULI` è un elenco scritto a mano e
     — a differenza di `SUPERFICI` — nessuno lo confrontava col disco. Il
     confronto sta qui sotto; questi tre sono quello che ha trovato al primo
     colpo. `index.js` è l'SDK da cui passa **ogni** accesso ai dati di ogni
     app, e `dw-tema.js` è il motore dei temi, cioè proprio il file su cui le
     regole del colore avrebbero più da dire. */
  ["SDK identità", "shared/deepwork-id-client/index.js"],
  ["motore dei temi", "shared/dw-tema.js"],
  ["animazioni fluide", "shared/dw-fluido.js"],
  ["ponti fra le app", "shared/dw-ponti.js"],
  ["Genesi (formato)", "apps/genesi/genesi-formato.js"],
  ["Genesi (dati)", "apps/genesi/genesi-data.js"],
  ["Campo (dati)", "apps/campo/campo-data.js"],
  ["Conti (dati)", "apps/conti/conti-data.js"],
  ["Flotta (dati)", "apps/flotta/flotta-data.js"],
  ["Scudo (dati)", "apps/scudo/scudo-data.js"],
  ["Sentinella (dati)", "apps/sentinella/sentinella-data.js"],
  ["Terra (dati)", "apps/terra/terra-data.js"],
];

/* ⛔ L'ELENCO DELLE SUPERFICI SI AGGIORNAVA A MEMORIA.
   `CLAUDE.md` lo dice — «quando nasce un'app va aggiunta all'elenco
   SUPERFICI» — ed è esattamente la forma di regola che questo file esiste per
   sostituire. Il 03/08 la misura: nel repo ci sono **sedici** file `.html`, e
   l'elenco ne conosceva **dodici**. Le quattro fuori non erano state escluse:
   erano state dimenticate. Due sono pagine che l'utente apre davvero — quella
   in cui si finisce quando manca un permesso, e il portone di Genesi — e
   nessuna regola di stile le aveva mai guardate.
   Chi resta fuori adesso deve dirlo con la ragione. */
const FUORI_SUPERFICI = {
  "shared/_collaudo-grafici.html":
    "il collaudo del motore dei grafici — l'underscore nel nome lo dichiara: "
    + "serve a guardare i grafici uno accanto all'altro, non è un'interfaccia",
};
function tutteLePagine(dir = "", trovate = []) {
  for (const v of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (v.name === "node_modules" || v.name === ".git" || v.name === "vendor") continue;
    const rel = dir ? `${dir}/${v.name}` : v.name;
    if (v.isDirectory()) tutteLePagine(rel, trovate);
    else if (v.name.endsWith(".html")) trovate.push(rel);
  }
  return trovate;
}
console.log("\n── L'elenco delle superfici è completo ──");
{
  const sulDisco = tutteLePagine().sort();
  const conosciute = new Set(SUPERFICI.map(([, r]) => r));
  const dimenticate = sulDisco.filter((r) => !conosciute.has(r) && !(r in FUORI_SUPERFICI));
  const fantasmi = [...conosciute].filter((r) => !sulDisco.includes(r));
  const escluseSparite = Object.keys(FUORI_SUPERFICI).filter((r) => !sulDisco.includes(r));
  test(`ogni pagina del repo è guardata o esclusa con la ragione (${sulDisco.length} file .html)`, () => {
    ok(sulDisco.length >= 14, `solo ${sulDisco.length} pagine trovate: la scansione delle cartelle non sta guardando niente`);
    ok(dimenticate.length === 0,
      `${dimenticate.length} pagine che nessuna regola guarda → ${dimenticate.join(", ")}`
      + " — o entrano in SUPERFICI, o la ragione va scritta in FUORI_SUPERFICI");
    ok(fantasmi.length === 0, `SUPERFICI nomina file che non esistono più: ${fantasmi.join(", ")}`);
    ok(escluseSparite.length === 0,
      `FUORI_SUPERFICI esclude file che non ci sono più: ${escluseSparite.join(", ")} — righe da togliere`);
  });
}

/* ⛔ E L'ELENCO DEI MODULI NON ERA CONFRONTATO CON NIENTE — trovato l'08/08.
   `SUPERFICI` aveva la sua guardia dal 03/08 (qui sopra); `MODULI` no, ed è
   scritto a mano nello stesso file, dieci righe più in là. La misura al primo
   colpo: **tre moduli condivisi fuori da OGNI regola di questo file**, e non
   perché fossero nuovi —
   · `shared/deepwork-id-client/index.js`, l'SDK da cui passa **ogni** accesso
     ai dati di **ogni** app;
   · `shared/dw-tema.js`, il motore dei temi, cioè proprio il file su cui le
     regole del colore avrebbero più da dire;
   · `shared/dw-fluido.js`.
   Aggiunti: le prove passano da 300 a **309** e **nessuna cade** — quindi lì
   dentro non si nascondeva un difetto. Il punto non è quello che si è trovato:
   è che per trovarlo bisognava **avere l'idea di guardare**, e la guardia
   toglie quel bisogno.
   ⚠️ È la stessa lezione di stanotte per la terza volta: l'elenco `BROWSER` di
   `numeri-nei-documenti` guardava due documenti su tre, la somma scritta di
   `DEVELOPMENT.md` non la guardava nessuno, e qui un elenco a mano stava
   accanto a uno sorvegliato. **Un elenco scritto a mano si accorcia da solo, e
   ogni volta che si accorcia il verde che stampa vale un po' meno.** */
const FUORI_MODULI = {
  "apps/genesi/pointcloud.js":
    "il lettore di nuvole di punti e mesh: matematica pura, nessun testo "
    + "d'interfaccia e nessun colore — le regole di questo file non hanno "
    + "niente da dirgli. Le sue prove stanno in run-pointcloud.mjs (32).",
};
function tuttiIModuli(dir = "", trovate = []) {
  for (const v of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (["node_modules", ".git", "vendor", "tests", "functions", "img", "immagini"].includes(v.name)) continue;
    const rel = dir ? `${dir}/${v.name}` : v.name;
    if (v.isDirectory()) { if (rel === "shared" || rel === "apps" || rel.startsWith("shared/") || rel.startsWith("apps/")) tuttiIModuli(rel, trovate); continue; }
    /* i moduli del prodotto: i dati delle app e tutto ciò che sta in shared/.
       Restano fuori i service worker (li compila `sintassi-pagine`) e i file
       che non sono moduli ESM. */
    if (!v.name.endsWith(".js")) continue;
    if (/(^|-)sw\.js$/.test(v.name)) continue;
    if (rel.startsWith("shared/") || /-data\.js$/.test(v.name) || /-formato\.js$/.test(v.name) || v.name === "pointcloud.js") trovate.push(rel);
  }
  return trovate;
}
console.log("\n── L'elenco dei moduli è completo ──");
{
  const sulDisco = tuttiIModuli().sort();
  const conosciuti = new Set(MODULI.map(([, r]) => r));
  const dimenticati = sulDisco.filter((r) => !conosciuti.has(r) && !(r in FUORI_MODULI));
  const fantasmi = [...conosciuti].filter((r) => r.endsWith(".js") && !sulDisco.includes(r));
  const escluseSparite = Object.keys(FUORI_MODULI).filter((r) => !sulDisco.includes(r));
  test(`ogni modulo del prodotto è guardato o escluso con la ragione (${sulDisco.length} file .js)`, () => {
    ok(sulDisco.length >= 14, `solo ${sulDisco.length} moduli trovati: la scansione delle cartelle non sta guardando niente`);
    ok(dimenticati.length === 0,
      `${dimenticati.length} moduli che nessuna regola guarda → ${dimenticati.join(", ")}`
      + " — o entrano in MODULI, o la ragione va scritta in FUORI_MODULI");
    ok(fantasmi.length === 0, `MODULI nomina file che non esistono più: ${fantasmi.join(", ")}`);
    ok(escluseSparite.length === 0,
      `FUORI_MODULI esclude file che non ci sono più: ${escluseSparite.join(", ")} — righe da togliere`);
  });
}

const leggi = (rel) => { try { return readFileSync(join(root, rel), "utf8"); } catch { return null; } };

/* ⛔ LA GUARDIA CHE ERA DICHIARATA E NON ESISTEVA. In cima all'elenco delle
   superfici di `tests/browser/giro.mjs` c'è scritto: «un elenco tenuto a mano
   si aggiorna quando qualcuno se ne ricorda: **il controllo in fondo a questo
   file pretende che le due liste combacino**». Quel controllo **non c'era** —
   né in fondo a quel file né in nessun altro punto del repo. È la guardia
   scollegata di cui `CLAUDE.md` parla due volte, nella forma peggiore:
   annunciata in un commento, quindi chi legge la dà per fatta e non la cerca.
   Misurata la differenza il 01/08: le regole di stile guardavano **quindici**
   pagine, il giro del browser **undici**. Quattro pagine che passano le regole
   di stile non le apriva **nessun banco** — cioè su di esse nessuno ha mai
   misurato contrasto, id doppi, fuori-schermo o bersagli di tocco.
   ⚠️ L'elenco si legge come TESTO, non importando `giro.mjs`: quel file tira
   dentro Playwright, e una suite `node` che gira senza rete non deve dipendere
   dal browser per sapere che cosa il browser dovrebbe guardare. */
const FUORI_GIRO = {
  "apps/genesi/nuvola-poc.html":
    "banco di prova della lettura nuvola/mesh (il titolo dice «prova»): le regole "
    + "di stile la guardano perché è pur sempre HTML, ma non è una superficie che "
    + "un cliente apre — come `_collaudo-grafici.html`, che infatti è già fuori",
};
/* ⛔ DUE FOGLI CONDIVISI CHE DEFINISCONO LO STESSO SELETTORE. Misurato il
   01/08 dopo che la barra dell'amministrazione e' uscita dallo schermo:
   **38 dei 43 selettori di `dw-app-shell.css` erano ridefiniti da
   `dw-app-ui.css`**, che le pagine caricavano dopo e che quindi vinceva. I
   superstiti erano il guaio vero — fra loro `.top .sub`, cioe' meta' della
   barra alta disegnata da un foglio e meta' dall'altro: e' da li' che nasceva
   il difetto. Racconto e piano: `docs/DUE_FOGLI_PER_LA_STESSA_BARRA.md`.
   Da E0 nessuna pagina carica piu' i due fogli insieme, e shell e' ridotto a
   quello che `profilo.html` usa davvero: i doppioni rimasti sono quelli fra
   `deepwork-style.css` e `dw-app-ui.css` piu' i nomi che le due meta' della
   famiglia chiamano allo stesso modo servendo pagine diverse.

   Questa regola NON pretende che i doppioni spariscano — sarebbe E0 tutto in
   una volta, su undici pagine con tre combinazioni diverse di fogli. Pretende
   che **l'elenco sia quello dichiarato**, nei due versi:
     · un doppione NUOVO cade subito (e' il verso che protegge);
     · un doppione che **non si presenta piu'** cade anche lui, perche' la riga
       va tolta — e' la lezione di `sonda-vuoto.mjs`, dove un'eccezione che non
       serve piu' e' un'eccezione che nasconde. Cosi', mentre E0 procede,
       l'elenco **si accorcia in modo visibile** invece di restare fermo.
   ⚠️ Non e' una soglia su un numero: e' l'insieme esatto. Un fondo sul conto
   direbbe «49 o meno» e lascerebbe passare uno scambio — uno tolto, uno
   aggiunto — senza dire niente.

   ✅ E il secondo verso ha funzionato, due volte in due giorni: 49 → 50 quando
   `.item:active` e' diventato un doppione VOLUTO (i due fogli servono pagine
   diverse e non si incontrano mai), poi **50 → 32** quando `dw-app-shell.css`
   e' stato ridotto a quello che `profilo.html` usa davvero. Diciotto righe
   tolte perche' la regola le ha pretese tolte: senza, l'elenco sarebbe rimasto
   a 50 dichiarando doppioni che non esistono piu'. */
const DOPPIONI_OGGI = [
  [".arr", "dw-app-shell + dw-app-ui"],
  [".avatar", "dw-app-shell + dw-app-ui"],
  [".badge", "dw-app-shell + dw-app-ui"],
  [".badge.ok", "dw-app-shell + dw-app-ui"],
  [".badge.warn", "dw-app-shell + dw-app-ui"],
  [".dw-accent", "deepwork-style + dw-app-ui"],
  [".dw-btn", "deepwork-style + dw-app-ui"],
  [".dw-btn:active", "deepwork-style + dw-app-ui"],
  [".dw-btn:hover", "deepwork-style + dw-app-ui"],
  [".dw-btn.secondary", "deepwork-style + dw-app-ui"],
  [".dw-btn.secondary:active", "deepwork-style + dw-app-ui"],
  [".dw-btn.secondary:hover", "deepwork-style + dw-app-ui"],
  [".dw-home", "dw-app-shell + dw-app-ui"],
  [".dw-home:hover", "dw-app-shell + dw-app-ui"],
  [".dw-input", "deepwork-style + dw-app-ui"],
  [".dw-input:focus", "deepwork-style + dw-app-ui"],
  [".dw-muted", "deepwork-style + dw-app-ui"],
  [".info", "dw-app-shell + dw-app-ui"],
  [".item", "dw-app-shell + dw-app-ui"],
  /* ⛔ DOPPIONE VOLUTO, e l'unico: da quando le sette pagine non caricano piu'
     `dw-app-shell.css`, i due fogli servono pagine DIVERSE — shell e' rimasto
     di `profilo.html`, ui di tutte le altre — e a tutt'e due le pagine serve
     questa riga. Non si contraddicono perche' non si incontrano mai. */
  [".item:active", "dw-app-shell + dw-app-ui"],
  [".item:hover", "dw-app-shell + dw-app-ui"],
  [".meta", "dw-app-shell + dw-app-ui"],
  [".name", "dw-app-shell + dw-app-ui"],
  [".note", "dw-app-shell + dw-app-ui"],
  [".page", "dw-app-shell + dw-app-ui"],
  [".page.active", "dw-app-shell + dw-app-ui"],
  [".sec", "dw-app-shell + dw-app-ui"],
  [".sec::before", "dw-app-shell + dw-app-ui"],
  [".top", "dw-app-shell + dw-app-ui"],
  [".top h1", "dw-app-shell + dw-app-ui"],
  ["*", "deepwork-style + dw-app-ui"],
  ["body.dw", "deepwork-style + dw-app-shell + dw-app-ui"],
];
console.log("\n── Nessun selettore nuovo definito in due fogli condivisi ──");
{
  const primoLivello = (css) => {
    const senza = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const out = new Set();
    let prof = 0, i = 0, inizio = 0;
    for (let k = 0; k < senza.length; k++) {
      const c = senza[k];
      if (c === "{") { if (prof === 0) i = k; prof++; }
      else if (c === "}") {
        prof--;
        if (prof !== 0) continue;
        const testa = senza.slice(inizio, i).trim();
        inizio = k + 1;
        if (!testa || testa.startsWith("@")) continue;
        for (const s of testa.split(",").map((x) => x.trim()).filter(Boolean)) out.add(s);
      }
    }
    return out;
  };
  const FOGLI = ["shared/deepwork-style.css", "shared/dw-app-shell.css", "shared/dw-app-ui.css"];
  const dove = new Map();
  let letti = 0;
  for (const f of FOGLI) {
    const t = leggi(f);
    if (t == null) continue;
    letti++;
    for (const s of primoLivello(t)) {
      if (!dove.has(s)) dove.set(s, []);
      dove.get(s).push(f.replace("shared/", "").replace(".css", ""));
    }
  }
  const oggi = new Map([...dove].filter(([, ff]) => ff.length > 1).map(([s, ff]) => [s, ff.join(" + ")]));
  const dichiarati = new Map(DOPPIONI_OGGI);
  const nuovi = [...oggi.keys()].filter((s) => !dichiarati.has(s));
  const spariti = [...dichiarati.keys()].filter((s) => !oggi.has(s));
  const cambiati = [...oggi].filter(([s, f]) => dichiarati.has(s) && dichiarati.get(s) !== f).map(([s]) => s);
  test(`i selettori definiti in due fogli condivisi sono quelli dichiarati (${oggi.size} trovati, ${dichiarati.size} dichiarati, ${letti} fogli letti)`, () => {
    ok(letti === FOGLI.length, `letti solo ${letti} fogli su ${FOGLI.length}: la scansione non sta guardando niente`);
    ok(oggi.size > 0, "nessun doppione trovato: la scansione dei selettori non funziona");
    ok(nuovi.length === 0,
      `${nuovi.length} selettori nuovi definiti in due fogli → ${nuovi.join(", ")}`
      + " — o la regola sta in un foglio solo, o la riga va aggiunta a DOPPIONI_OGGI con la ragione");
    ok(spariti.length === 0,
      `DOPPIONI_OGGI dichiara doppioni che non ci sono più: ${spariti.join(", ")} — righe da togliere`);
    ok(cambiati.length === 0, `doppioni che hanno cambiato fogli: ${cambiati.join(", ")}`);
  });
}

/* ⛔ LA REGOLA QUI SOPRA CONFRONTA I **NOMI**, E NON BASTA — misurato il 01/08,
   togliendo il `<link>` a `dw-app-shell.css` dalle sette pagine. Due regole con
   lo stesso selettore possono portare **proprieta' diverse**: `.page` era
   dichiarata in tutt'e due i fogli e contava come doppione, ma il
   `display:none` che nasconde le sezioni non attive stava **solo in shell**.
   Tolto shell, le sei app hanno disegnato tutte le sezioni una sotto l'altra —
   Flotta da 1.755 a **19.344 px**. Poi, cercando meglio, altre due: il
   `cursor:pointer` di `.item` e il `color`+`font-size` di `.arr` (il chevron
   `›`, 52 volte nelle sei app) erano vivi e li metteva shell.
   Cioe' il censimento «cinque superstiti» ne aveva mancati tre, e tutt'e tre
   nella direzione che non si vede: nessuno rompe la pagina, cambiano il colore
   e la misura di un dettaglio.

   Questa regola guarda le **dichiarazioni**: per ogni proprieta' scritta da
   shell, ui la riscrive? Quelle che ui non riscrive sono le sole che una pagina
   perde smettendo di caricare shell — quindi l'elenco qui sotto e' esattamente
   «che cosa distingue ancora i due fogli», con la ragione per cui va bene.
   Cade nei due versi come la regola dei doppioni: una divergenza nuova cade
   subito, una dichiarata che non si presenta piu' cade anche lei.
   ⚠️ Il lettore conta la profondita' delle graffe. Il primo tentativo, a
   espressione regolare, leggeva **20 regole su 41** perche' non entrava nei
   blocchi di `@media` — e non se ne accorgeva: per questo il nome della prova
   stampa quante regole ha letto in tutt'e due i fogli. */
const SOLO_IN_SHELL = [
  [".top h1", "margin, font-size, letter-spacing",
   "nelle sette pagine che hanno smesso di caricare shell non c'e' nessun <h1> "
   + "dentro `.top` (quelli che si trovano stanno nei modelli di STAMPA): morta"],
  [".top h1 .accent", "color", "vive solo in `profilo.html`, che shell lo carica ancora"],
  [".top .sub", "font-size, color, letter-spacing, text-transform",
   "vive solo in `profilo.html`: le altre usano la struttura del core (`.top-brand`)"],
  ["a.item", "cursor",
   "serve solo a `profilo.html`, dove le righe partono ferme (`cursor:default`) "
   + "e la voce «Amministrazione» e' un `<a href>`: cliccabile per natura, e la "
   + "manina gliela ridà questa riga. Nelle app la domanda non si pone — li' "
   + "`.item` parte gia' con la manina o la marca con `tocca`"],
];
console.log("\n── Le proprietà che solo dw-app-shell.css dichiara sono quelle dichiarate ──");
{
  const regole = (css) => {
    const senza = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const out = new Map();                 // "ctx | selettore" -> Set(proprieta)
    const pila = [];
    let buf = "", i = 0;
    while (i < senza.length) {
      const c = senza[i];
      if (c === "{") {
        const testa = buf.trim(); buf = ""; i++;
        if (testa.startsWith("@")) { pila.push(testa); continue; }
        let corpo = "", prof = 1;
        while (i < senza.length && prof > 0) {
          if (senza[i] === "{") prof++;
          else if (senza[i] === "}") { prof--; if (!prof) break; }
          corpo += senza[i]; i++;
        }
        i++;
        const props = [];
        for (const d of corpo.split(";")) {
          const p = d.split(":")[0].trim().toLowerCase();
          if (p && !p.includes("{")) props.push(p);
        }
        const ctx = pila.join(" ");
        for (const s of testa.split(",")) {
          const nome = s.trim().replace(/\s+/g, " ");
          if (!nome) continue;
          const k = ctx ? ctx + " | " + nome : nome;
          if (!out.has(k)) out.set(k, new Set());
          for (const p of props) out.get(k).add(p);
        }
        continue;
      }
      if (c === "}") { pila.pop(); buf = ""; i++; continue; }
      buf += c; i++;
    }
    return out;
  };
  const tShell = leggi("shared/dw-app-shell.css"), tUi = leggi("shared/dw-app-ui.css");
  const shell = tShell ? regole(tShell) : new Map();
  const ui = tUi ? regole(tUi) : new Map();
  const oggi = new Map();
  for (const [k, props] of shell) {
    const suo = ui.get(k);
    const manca = [...props].filter((p) => !suo || !suo.has(p));
    if (manca.length) oggi.set(k, manca.join(", "));
  }
  const dich = new Map(SOLO_IN_SHELL.map(([s, p]) => [s, p]));
  const nuove = [...oggi.keys()].filter((s) => !dich.has(s));
  const sparite = [...dich.keys()].filter((s) => !oggi.has(s));
  const cambiate = [...oggi].filter(([s, p]) => dich.has(s) && dich.get(s) !== p)
    .map(([s, p]) => `${s} (ora «${p}», dichiarato «${dich.get(s)}»)`);
  test(`le proprietà che solo dw-app-shell.css dichiara sono quelle dichiarate `
     + `(${oggi.size} trovate, ${dich.size} dichiarate; ${shell.size} regole in shell, ${ui.size} in ui)`, () => {
    /* ⛔ QUI C'ERA UNA SOGLIA MIA, SBAGLIATA: `shell.size > 30`. Voleva dire
       «ho letto il foglio», e diceva «il foglio è grande» — due cose diverse.
       Il giorno dopo `dw-app-shell.css` è sceso a 23 regole perché 18 non le
       usava nessuno, cioè per il motivo giusto, e la guardia ha gridato che
       la lettura non guardava niente. È la lezione di `CLAUDE.md` sulle soglie
       su valori che possono muoversi, presa in faccia dal file che la applica.
       Quello che serve sapere è se i due file esistono e hanno regole. */
    ok(tShell != null && tUi != null, "uno dei due fogli condivisi non si legge");
    ok(shell.size > 0 && ui.size > 0,
      `letti ${shell.size} e ${ui.size} blocchi: la lettura dei fogli non sta guardando niente`);
    ok(nuove.length === 0,
      `${nuove.length} divergenze nuove → ${nuove.map((s) => `${s} {${oggi.get(s)}}`).join(" · ")}`
      + " — o la proprietà va portata anche in `dw-app-ui.css` (la perdono tutte le pagine"
      + " che non caricano shell), o la riga va aggiunta a SOLO_IN_SHELL con la ragione");
    ok(sparite.length === 0,
      `SOLO_IN_SHELL dichiara divergenze che non ci sono più: ${sparite.join(", ")} — righe da togliere`);
    ok(cambiate.length === 0, `divergenze cambiate: ${cambiate.join(" · ")}`);
  });
}

console.log("\n── Le due liste di superfici combaciano ──");
{
  const testoGiro = leggi("apps/deepwork-id/tests/browser/giro.mjs") || "";
  const i = testoGiro.indexOf("export const SUPERFICI = [");
  const blocco = i < 0 ? "" : testoGiro.slice(i, testoGiro.indexOf("];", i));
  const nelGiro = new Set([...blocco.matchAll(/'([^']+\.html)'/g)].map((m) => m[1].replace(/^\//, "")));
  const noi = SUPERFICI.map(([, r]) => r);
  const fuori = noi.filter((r) => !nelGiro.has(r) && !(r in FUORI_GIRO));
  const fantasmi = [...nelGiro].filter((r) => !noi.includes(r));
  const escluseInutili = Object.keys(FUORI_GIRO).filter((r) => nelGiro.has(r) || !noi.includes(r));
  test(`ogni superficie delle regole di stile è aperta anche dal giro del browser (${nelGiro.size} nel giro, ${noi.length} qui)`, () => {
    ok(nelGiro.size >= 10,
      `solo ${nelGiro.size} superfici lette da giro.mjs: la lettura dell'elenco non sta guardando niente`);
    ok(fuori.length === 0,
      `${fuori.length} pagine che le regole di stile guardano e nessun banco apre → ${fuori.join(", ")}`
      + " — o entrano in SUPERFICI di giro.mjs, o la ragione va scritta in FUORI_GIRO");
    ok(fantasmi.length === 0,
      `il giro apre pagine che le regole di stile non guardano: ${fantasmi.join(", ")}`);
    ok(escluseInutili.length === 0,
      `FUORI_GIRO scusa pagine che non ne hanno bisogno: ${escluseInutili.join(", ")} — righe da togliere`);
  });
}

// I dialoghi vietati compaiono di proposito DENTRO I COMMENTI, che spiegano
// perché sono stati mandati via: bisogna saper distinguere il commento dal
// codice.
//
// ⚠️ NON si fa con `replace(/\/\*[\s\S]*?\*\//g, '')`. L'ho provato e sembrava
// funzionare: tutte le superfici passavano. Poi la controprova — rimettere un
// `window.prompt()` nel core e pretendere che il controllo fallisse — è passata
// anche quella, e allora si è visto perché: il core passava da 537.000 a
// 137.000 caratteri. Nel codice ci sono `/*` e `*/` dentro stringhe ed
// espressioni regolari, quindi l'accoppiamento non greedy legava i delimitatori
// sbagliati e cancellava 400.000 caratteri di codice VIVO. Il controllo diceva
// «nessuna violazione» perché non stava guardando quasi niente: la stessa
// trappola dei test inerti che dicono «0 falliti».
//
// `deferredPrompt.prompt()` è l'API di installazione della PWA, non un dialogo:
// si riconosce perché ha un oggetto davanti. Cerchiamo la chiamata NUDA.
//
// MA `window.` va contato: il core scriveva proprio `window.prompt('Distanza
// reale…')`. La prima versione di questo controllo escludeva tutto ciò che
// aveva un punto davanti, quindi si sarebbe lasciata sfuggire esattamente la
// violazione che avevo appena corretto. L'ha scoperto il controllo del
// controllo qui sotto, ed è la ragione per cui esiste.
const DIALOGHI = /(alert|confirm|prompt)\s*\(/g;
function dialoghiIn(testo, masc = mascheraCodice) {
  const vivo = masc(testo);
  const fuori = [];
  let m;
  DIALOGHI.lastIndex = 0;
  while ((m = DIALOGHI.exec(testo)) !== null) {
    const at = m.index;
    if (!vivo[at]) continue;                       // sta in un commento o in una stringa
    // cosa c'è davanti al nome: se è un punto è il metodo di un oggetto —
    // `deferredPrompt.prompt()` è l'API della PWA, non un dialogo. Ma
    // `window.prompt(` sì: il core scriveva proprio così, e la prima versione
    // di questo controllo se lo lasciava sfuggire.
    const prima = testo.slice(Math.max(0, at - 40), at);
    if (/\.\s*$/.test(prima) && !/\b(?:window|globalThis|self)\s*\.\s*$/.test(prima)) continue;
    if (/[\w$]$/.test(prima)) continue;            // parte di un identificatore più lungo
    const riga = testo.slice(0, at).split("\n").length;
    const testoRiga = (testo.split("\n")[riga - 1] || "").trim().slice(0, 90);
    fuori.push({ riga, quale: m[1], testo: testoRiga });
  }
  return fuori;
}

console.log("\n── Regola 1: niente dialoghi del browser ──");
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  const src = leggi(rel);
  if (src === null) continue;                      // superficie non ancora esistente
  test(`${nome}: nessun alert/confirm/prompt del browser`, () => {
    const v = dialoghiIn(src);
    ok(v.length === 0, `${rel} — ${v.map(x => `riga ${x.riga}: ${x.quale}() « ${x.testo} »`).join(" | ")}`);
  });
}
// Il controllo del controllo. Non è pedanteria: la prima versione passava su
// tutte le superfici E passava anche con un `window.prompt()` rimesso a mano
// nel core. Un controllo che non sa fallire non sta controllando niente.
test("il controllo si accorge dei dialoghi veri", () => {
  ok(dialoghiIn("function x(){ if(confirm('sicuro?')) fai(); }").length === 1, "confirm() nudo");
  ok(dialoghiIn("window.prompt('x')").length === 1, "window.prompt");
  ok(dialoghiIn("  alert('ciao');").length === 1, "alert indentato");
  ok(dialoghiIn("if(!confirm('x'))return;").length === 1, "confirm dentro una condizione");
  ok(dialoghiIn("globalThis.confirm('x')").length === 1, "globalThis.confirm");
});
test("il controllo non accusa quello che non è un dialogo", () => {
  ok(dialoghiIn("/* qui c'era confirm('x') */ nulla();").length === 0, "dentro un commento a blocco");
  ok(dialoghiIn("// vecchio: alert('ciao')").length === 0, "dentro un commento di riga");
  ok(dialoghiIn("deferredPrompt.prompt();").length === 0, "l'API della PWA non è un dialogo");
  ok(dialoghiIn("const s = 'usa confirm(x) invece';").length === 0, "dentro una stringa");
  ok(dialoghiIn("miaConferma('x'); reconfirm('y');").length === 0, "nomi che finiscono uguale");
  ok(dialoghiIn("obj.alert('x');").length === 0, "un metodo di un altro oggetto");
});
// La controprova che vale più di tutte: si rimette un dialogo DENTRO I FILE
// VERI e si pretende che il controllo lo trovi. È così che ho scoperto che la
// prima versione non funzionava — passava su tutte le superfici e passava anche
// col dialogo rimesso, perché il taglio dei commenti a espressioni regolari
// cancellava 400.000 caratteri di codice vivo (`/*` e `*/` compaiono anche
// dentro stringhe e regex, e l'accoppiamento non greedy legava i delimitatori
// sbagliati). Una prova che non sa fallire sul difetto non dimostra niente.
for (const [nome, rel, ancora] of [
  ["core", "index.html", "function reconCalibra("],
  ["Genesi", "apps/genesi/genesi.html", "function salvaVolata("],
  ["Deepwork ID · amministrazione", "apps/deepwork-id/admin.html", "async (...a) => {"],
]) {
  test(`controprova su ${nome}: un dialogo rimesso a mano viene trovato`, () => {
    const src = leggi(rel);
    ok(src, `${rel} non trovato`);
    ok(src.includes(ancora), `l'ancora « ${ancora} » non c'è più in ${rel}: aggiornare la controprova`);
    ok(dialoghiIn(src).length === 0, `${rel} parte pulito`);
    for (const veleno of ["window.prompt('x');", "if(!confirm('x'))return;", "alert('x');"]) {
      const rotto = src.replace(ancora, veleno + " " + ancora);
      const trovati = dialoghiIn(rotto);
      ok(trovati.length === 1,
        `« ${veleno} » iniettato in ${rel} non è stato trovato (trovati ${trovati.length}) — il controllo non sta guardando il codice`);
    }
  });
}
test("un `/*` dentro un'espressione regolare non apre un commento", () => {
  const insidia = "const re = /\\/\\*/; confirm('mi devi trovare');";
  ok(dialoghiIn(insidia).length === 1, "il confirm dopo la regex deve essere trovato");
});
test("un dialogo dentro un'interpolazione è una chiamata, non un testo", () => {
  ok(dialoghiIn("const s = `quanti ${prompt('quanti?')} fori`;").length === 1,
    "`${prompt(...)}` è codice vero: la versione vecchia lo mascherava come stringa");
  ok(dialoghiIn("const s = `scrivi ${x} e poi prompt(qualcosa)`;").length === 0,
    "ma il testo che PARLA di un prompt resta testo");
});

/* ══ LA SCANSIONE NON PERDE LA FASE — la misura che l'ha resa verificabile ══
   ────────────────────────────────────────────────────────────────────────
   Trovato il 03/08, e i due difetti erano indipendenti:

   1. la scansione leggeva la PAGINA INTERA come JavaScript, quindi
      l'apostrofo di «l'ecosistema» scritto nel testo apriva una stringa.
      Con un numero pari di apostrofi non succede niente; con uno dispari la
      fase si inverte e il codice vero diventa «testo»;
   2. `return /[;"\n]/.test(s)` — che in Genesi c'è davvero — veniva preso per
      una divisione, perché la regola guardava solo l'ULTIMO carattere prima
      dello slash («n», di return) e non la parola.

   Insieme facevano sparire **115 delle 195 funzioni dichiarate a colonna zero
   in Genesi**, cioè tratti da decine di migliaia di caratteri in cui la
   regola 1 non guardava niente e rispondeva lo stesso «nessuna violazione».
   Il core ne usciva pulito per CASO: 131 apostrofi e 39 virgolette, due
   inversioni che si annullavano.

   Questa prova è la misura stessa, tenuta accesa: una dichiarazione all'inizio
   di una riga — `function x(`, `const y =` — è codice o commento, mai il
   CONTENUTO di una stringa. Se la scansione la chiama «stringa» ha perso la
   fase. È l'unico controllo del file che verifica lo STRUMENTO invece di una
   regola.

   ⚠️ DUE COSE IMPARATE SCRIVENDOLA, e sono la stessa lezione di sempre —
   contare quanti soggetti si sta guardando davvero:
   1. la prima stesura prendeva solo le dichiarazioni a **colonna zero**: 934
      ancore, che sembravano tante, ma **le sei pagine delle app ne davano
      ZERO**. Il loro codice è tutto indentato dentro un blocco, quindi la
      prova non guardava proprio le superfici che contano di più. Contando
      anche le righe indentate le ancore diventano **7.485**, e nessuna
      superficie resta fuori;
   2. si pretende «non DENTRO», non «uguale a CODICE». In `dw-grafici.js` c'è
      un `const g = dwGrafici.linea(…)` dentro un commento — è l'esempio d'uso
      scritto nell'intestazione. Un pezzo di codice mostrato in un commento è
      un commento, e pretendere CODICE lo accusava a torto. */
const DICHIARAZIONE = /(^|\n)([ \t]*)((?:export\s+)?(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(|(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=)/g;
function dichiarazioniFuoriFase(src) {
  const tipo = classifica(src);
  const fuori = [];
  DICHIARAZIONE.lastIndex = 0;
  let m;
  while ((m = DICHIARAZIONE.exec(src)) !== null) {
    const at = m.index + m[1].length + m[2].length;
    if (tipo[at] === DENTRO) fuori.push(src.slice(0, at).split("\n").length);
  }
  return fuori;
}
let dichTot = 0, dichFuori = 0, dichSuperfici = 0;
const dichDove = [], dichVuote = [], dichSenzaProgramma = [];
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  const src = leggi(rel);
  if (src === null) continue;
  DICHIARAZIONE.lastIndex = 0;
  const quante = (src.match(DICHIARAZIONE) || []).length;
  dichTot += quante;
  /* Un file può non dare nessuna ancora per due ragioni opposte, e vanno
     separate: perché non ha PROGRAMMA (il foglio di stile del motore grafici,
     e il portone di Genesi, che è markup e basta — nemmeno un `<script>`),
     oppure perché la scansione ha perso la fase e non ne trova più. La prima è
     legittima e si conta a parte; la seconda fa cadere la prova.
     ⚠️ Ci sono cascato appena messo `login.html` nell'elenco: la prova l'ha
     accusato di essere fuori fase, e invece non c'era niente da vedere. */
  const senzaProgramma = rel.endsWith(".css") || (rel.endsWith(".html") && !/<script/i.test(src));
  if (quante > 0) dichSuperfici++;
  else if (senzaProgramma) dichSenzaProgramma.push(nome);
  else dichVuote.push(nome);
  const f = dichiarazioniFuoriFase(src);
  if (f.length) { dichFuori += f.length; dichDove.push(`${nome} (righe ${f.slice(0, 4).join(", ")}…)`); }
}
test(`la scansione non perde la fase: ${dichTot} dichiarazioni in ${dichSuperfici} file, nessuna presa per stringa`, () => {
  ok(dichTot > 7000, `solo ${dichTot} dichiarazioni guardate: il controllo non sta misurando niente`);
  ok(dichVuote.length === 0, `${dichVuote.join(", ")}: nessuna ancora, quindi su questi file la prova non guarda niente`);
  ok(dichFuori === 0, `${dichFuori} dichiarazioni prese per testo → ${dichDove.join(" · ")}`);
});
test("la scansione sa fallire: i due difetti rimessi le fanno perdere la fase", () => {
  // (1) la pagina letta come se fosse tutta JavaScript
  const pagina = "<!DOCTYPE html>\n<html lang=\"it\">\n<body>\n<p>l'ecosistema</p>\n"
    + "<script>\nfunction f(){ }\n</script>\n</body></html>\n";
  ok(dichiarazioniFuoriFase(pagina).length === 0,
    "un apostrofo nel TESTO della pagina non apre nessuna stringa");
  ok(dialoghiIn(pagina.replace("function f(){ }", "function f(){ confirm('x'); }")).length === 1,
    "e il dialogo dentro lo <script> si vede lo stesso");
  ok(dialoghiIn("<!DOCTYPE html>\n<html><body>\n<p>l'ora, l'altra e un'altra</p>\n"
    + "<button onclick=\"confirm('davvero?')\">via</button>\n</body></html>").length === 1,
    "un gestore scritto nell'attributo È JavaScript: 253 nelle superfici, 202 nel solo core");
  ok(dialoghiIn("<!DOCTYPE html>\n<html><body>\n<p>qui si parla di confirm(x) a parole</p>\n</body></html>").length === 0,
    "ma il testo che NOMINA un dialogo resta testo");
  // (2) lo slash dopo una parola-chiave
  const conRegex = "function a(s){ return /[;\"\\n]/.test(s); }\nfunction b(){ }\n";
  ok(dichiarazioniFuoriFase(conRegex).length === 0,
    "`return /…\"…/` è un'espressione regolare, non una divisione: la virgoletta dentro non apre niente");
  /* (3) LO SLASH DOPO UNA FRECCIA — il terzo della famiglia, chiuso il 08/08.
     Dietro a `=>` l'ultimo carattere non bianco è un `>`: non era fra quelli
     dopo i quali ci sta un'espressione, quindi la regex veniva presa per una
     divisione e il suo corpo restava codice. Nel repository ci sono 158 `=> /`
     e nessuno di loro contiene una virgoletta — il difetto c'era e non aveva
     ancora nascosto niente. Questa prova esiste perché la prossima regex
     scritta dopo una freccia non lo riapra in silenzio. */
  const conFreccia = "const g = s => /['\"]/.test(s);\nfunction b(){ }\n";
  ok(dichiarazioniFuoriFase(conFreccia).length === 0,
    "`=> /…'…/` è un'espressione regolare: l'apostrofo dentro non apre una stringa che si mangia il resto del file");
  ok(dichiarazioniFuoriFase("const m = i++ / 2;\nfunction b(){ }\n").length === 0,
    "e un incremento seguito da una divisione resta una divisione: è il caso per cui il `+` è stato scartato");
  ok(dichiarazioniFuoriFase("const q = larghezza / 2, r = altezza / 3;\nfunction b(){ }\n").length === 0,
    "e una divisione vera resta una divisione");
});

/* ══ I PUNTI DI DECISIONE DELLO STRUMENTO, INTERROGATI UNO PER UNO ══
   ────────────────────────────────────────────────────────────────────────
   Nata l'08/08, e la ragione è nel modo in cui era stato trovato il difetto
   della freccia: **per caso**, inseguendo un falso allarme di un'altra suite.
   Un buco trovato per caso vuol dire che gli altri, se ci sono, aspettano il
   prossimo caso — e nel frattempo ogni regola costruita sopra risponde
   «nessuna violazione» senza aver guardato.
   Le prove qui sopra verificano la scansione sul CODICE VERO, che è la misura
   che conta; questa la interroga sui suoi **punti di decisione**, con la
   risposta giusta scritta accanto. Le due cose sono diverse: il codice vero
   contiene solo le forme che qualcuno ha già scritto, e un buco si vede il
   giorno in cui qualcuno ne scrive una nuova.
   Esito onesto, che non va gonfiato: **nessun buco nuovo**. I 34 punti sono
   tutti giusti. Il valore di questa prova non è quello che ha trovato oggi —
   è che da domani nessuno dei 34 si può riaprire in silenzio.
   ⚠️ E sa fallire: girata sul tokenizzatore di prima della correzione della
   freccia dà **33 su 34**, e il punto che casca è esattamente quello. */
const PUNTI_DI_DECISIONE = [
  /* [nome, sorgente, l'ago da guardare, atteso: true = CODICE] */
  ["divisione dopo un nome", "const q = larghezza / 2;", "2;", true],
  ["divisione dopo una parentesi chiusa", "const q = (a + b) / 2;", "2;", true],
  ["divisione dopo una quadra chiusa", "const q = v[0] / 2;", "2;", true],
  ["divisione dopo un numero", "const q = 10 / 2;", "2;", true],
  ["regex dopo una freccia", "const f = s => /xQ/.test(s);", "xQ", false],
  ["regex dopo return", "function f(s){ return /xQ/.test(s); }", "xQ", false],
  ["regex dopo una virgola", "f(a, /xQ/)", "xQ", false],
  ["regex dopo una parentesi aperta", "f(/xQ/)", "xQ", false],
  ["regex dopo un uguale", "const r = /xQ/;", "xQ", false],
  ["regex dopo una doppia e commerciale", "a && /xQ/.test(b)", "xQ", false],
  ["regex dopo due punti", "({ r: /xQ/ })", "xQ", false],
  ["regex dopo punto e virgola", "a = 1; /xQ/.test(b)", "xQ", false],
  ["regex dopo graffa aperta", "{ /xQ/.test(b); }", "xQ", false],
  ["regex dopo un punto interrogativo", "c ? /xQ/ : 0", "xQ", false],
  ["regex dopo un punto esclamativo", "!/xQ/.test(b)", "xQ", false],
  ["regex dopo una barra verticale", "a || /xQ/.test(b)", "xQ", false],
  ["apostrofo dentro una regex", "const r = /['\"]/; const dopo = 1;", "dopo", true],
  ["barra dentro una classe di caratteri", "const r = /[/]/; const dopo = 1;", "dopo", true],
  ["barra sfuggita dentro una regex", "const r = /a\\/b/; const dopo = 1;", "dopo", true],
  ["apostrofo dentro una stringa doppia", "const s = \"l'ora\"; const dopo = 1;", "dopo", true],
  ["virgoletta sfuggita", "const s = 'l\\'ora'; const dopo = 1;", "dopo", true],
  ["il contenuto di una stringa non e' codice", "const s = \"xQ\";", "xQ", false],
  ["dentro una interpolazione e' CODICE", "const s = `a${xQ}b`;", "xQ", true],
  ["la parte letterale di un template non e' codice", "const s = `xQ${a}`;", "xQ", false],
  ["template annidato", "const s = `a${b ? `c${xQ}` : ''}d`; const dopo = 1;", "dopo", true],
  ["apostrofo nella parte letterale di un template", "const s = `l'ora`; const dopo = 1;", "dopo", true],
  ["commento di riga", "// xQ\nconst dopo = 1;", "xQ", false],
  ["commento di blocco", "/* xQ */ const dopo = 1;", "xQ", false],
  ["un commento non apre nessuna stringa", "// l'ora\nconst dopo = 1;", "dopo", true],
  ["due barre dentro una stringa non sono un commento", "const s = \"http://x\"; const dopo = 1;", "dopo", true],
  ["due barre dentro una regex non sono un commento", "const r = /a\\/\\/b/; const dopo = 1;", "dopo", true],
  ["i delimitatori di blocco dentro una stringa", "const s = \"/*\"; const dopo = 1;", "dopo", true],
  ["concatenamento opzionale", "const v = a?.b; const xQ = 1;", "xQ", true],
  ["separatore di migliaia", "const n = 1_000; const xQ = 1;", "xQ", true],
];
function puntiSbagliati(masc) {
  const male = [];
  for (const [nome, src, ago, atteso] of PUNTI_DI_DECISIONE) {
    const i = src.indexOf(ago);
    /* l'ago che non c'è è la prova che non prova niente: si dichiara, non si salta */
    if (i < 0) { male.push(`${nome}: l'ago «${ago}» non e' nel modello`); continue; }
    const vero = !!masc(src)[i];
    if (vero !== atteso) male.push(`${nome}: «${ago}» risulta ${vero ? "CODICE" : "DENTRO"}, doveva essere ${atteso ? "CODICE" : "DENTRO"}`);
  }
  return male;
}
test(`lo strumento risponde giusto su tutti i suoi ${PUNTI_DI_DECISIONE.length} punti di decisione`, () => {
  const male = puntiSbagliati(mascheraCodice);
  ok(male.length === 0, `${male.length} punti sbagliati:\n  ` + male.join("\n  "));
});
/* ⛔ LE DUE VISTE DEVONO CONTINUARE A ESSERE DUE.
   `CLAUDE.md` dice che i tokenizzatori sono due e vanno **scelti**:
   `mascheraCodice` maschera il CONTENUTO delle stringhe (giusto per le regole
   sul CODICE — un `prompt(` dentro un testo non è una chiamata),
   `senzaCommenti` toglie SOLO i commenti e tiene il resto (giusto per le
   regole sui TESTI, che vivono dentro le stringhe). Dal 31/07 leggono la
   **stessa** classificazione, che è la cosa giusta — ma è anche la cosa che
   rende possibile il guasto peggiore: se un giorno una delle due finisse per
   comportarsi come l'altra, **tutte** le regole sui testi diventerebbero
   cieche e continuerebbero a rispondere «nessuna violazione».
   Nessuna prova lo sorvegliava. Questa sì, e non guarda com'è scritto il
   codice ma **che cosa sopravvive**: la stessa parola messa in tre posti —
   dentro una stringa, dentro un commento di riga, dentro un commento di
   blocco — dev'essere vista **zero** volte dalla prima vista e **una** dalla
   seconda. Se i due numeri diventano uguali, le viste si sono fuse. */
test("le due viste del tokenizzatore restano due: la stringa sopravvive solo a senzaCommenti", () => {
  const src = 'const t = "unita in SPIA"; // un commento con SPIA\n/* blocco con SPIA */ const x = 1;';
  const quante = (s) => (s.match(/SPIA/g) || []).length;
  ok(quante(src) === 3, "il modello dev'essere quello che credo: tre occorrenze, una per posto");
  const m = mascheraCodice(src);
  let masc = "";
  for (let i = 0; i < src.length; i++) masc += m[i] ? src[i] : " ";
  ok(quante(masc) === 0, `mascheraCodice ne lascia ${quante(masc)}: dovrebbe mascherare sia la stringa sia i commenti`);
  ok(quante(senzaCommenti(src)) === 1,
    `senzaCommenti ne lascia ${quante(senzaCommenti(src))}: dovrebbe togliere i due commenti e TENERE la stringa`);
});

test("e la sonda sa fallire: uno slash giudicato dall'ultimo carattere perde le regex", () => {
  /* Il difetto vero, rimesso: la versione che decide senza guardare la parola
     intera né la freccia. Se la sonda passasse anche con questo, non starebbe
     misurando niente. */
  const ingenua = (t) => {
    const m = new Uint8Array(t.length).fill(1);
    let str = null;
    for (let i = 0; i < t.length; i++) {
      const c = t[i];
      if (str) { m[i] = 0; if (c === "\\") { if (i + 1 < t.length) m[++i] = 0; continue; } if (c === str) str = null; continue; }
      if (c === "'" || c === '"' || c === "`") { str = c; m[i] = 0; }
    }
    return m;
  };
  const male = puntiSbagliati(ingenua);
  ok(male.length >= 8, `la sonda ha visto solo ${male.length} punti sbagliati con lo strumento rotto: non sa fallire`);
});

/* LA CONTROPROVA A TAPPETO: il difetto rimesso DOVE OGNI STRINGA SI CHIUDE.
   ────────────────────────────────────────────────────────────────────────
   Quella qui sopra inietta in tre superfici a un punto ciascuna, e nessuno di
   quei punti cadeva dove la scansione andava fuori fase: sapeva fallire, ma
   non dove serviva. Questa inietta nei punti di ri-sincronizzazione di TUTTE
   le superfici — e stampa quanti ne ha provati, perché uno «zero violazioni»
   ottenuto su zero soggetti è il difetto raccolto in CLAUDE.md.

   ⚠️ IL TETTO È DICHIARATO, NON NASCOSTO. I punti sono **20.566** e ognuno
   costa una ri-scansione del file intero: provarli tutti porta la suite da
   pochi secondi a oltre due minuti, e a 240 per superficie a un minuto. Se ne
   provano `TETTO`, presi a passo regolare su tutta la lunghezza del file — e
   si stampa **quanti ne sono stati saltati**, perché un taglio taciuto si
   legge come «copre tutto».
   Il numero è scelto misurando, non a occhio: con `TETTO` a 120 la suite gira
   in **49 secondi**, cioè meno dei **51** che ci metteva prima di questo
   lavoro — e nel frattempo la controprova è passata da dieci superfici a
   **dodici** e dai soli template a **tutte e tre le virgolette**. Il passo regolare conta più della quantità: un
   difetto di fase non è un punto isolato, è un TRATTO — se la scansione si
   perde, si perde per migliaia di caratteri, e un colpo ogni ventun punti ci
   cade dentro lo stesso.

   ⚠️ E PRIMA SEGNAVA SOLO I TEMPLATE. Sembrava ragionevole — erano loro a
   mandare fuori fase la scansione vecchia — ma Genesi i template quasi non li
   usa: ne dava **24** contro i 120 di Terra, che è un terzo della sua misura.
   La superficie meno provata era la più grande, e per il modo di scrivere di
   chi l'aveva scritta, non per il rischio. */
const TETTO = 120;
function iniezioniNonViste(src, masc) {
  const spie = [];
  classifica(src, spie);
  const passo = Math.max(1, Math.ceil(spie.length / TETTO));
  const base = dialoghiIn(src, masc).length;
  let ciechi = 0, provati = 0;
  for (let k = 0; k < spie.length; k += passo) {
    provati++;
    // si inietta ESATTAMENTE dove la stringa si chiude: lì siamo in codice.
    // (Prima iniettavo a fine riga, ma dopo una stringa chiusa la riga spesso
    // prosegue dentro un'altra: il dialogo finiva in un testo, dove NON deve
    // essere trovato, e la controprova accusava la scansione giusta.)
    const rotto = src.slice(0, spie[k]) + ";window.prompt('x');" + src.slice(spie[k]);
    if (dialoghiIn(rotto, masc).length <= base) ciechi++;
  }
  return { provati, ciechi, esistenti: spie.length };
}
/* La scansione SBAGLIATA, tenuta apposta: serve a dimostrare che questa
   controprova sa fallire. Senza, direbbe «tutto trovato» anche se non stesse
   guardando niente. */
function mascheraIngenua(t) {
  const vivo = new Uint8Array(t.length);
  let i = 0;
  while (i < t.length) {
    const c = t[i];
    if (c === "'" || c === '"' || c === "`") {
      vivo[i] = 1; i++;
      while (i < t.length) { if (t[i] === "\\") { i += 2; continue; } if (t[i] === c) { i++; break; } i++; }
      continue;
    }
    vivo[i] = 1; i++;
  }
  return vivo;
}
let provatiTot = 0, esistentiTot = 0, ciechiIngenua = 0;
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const { provati, ciechi, esistenti } = iniezioniNonViste(src);
  if (provati === 0) continue;
  provatiTot += provati;
  esistentiTot += esistenti;
  ciechiIngenua += iniezioniNonViste(src, mascheraIngenua).ciechi;
  const quanti = provati < esistenti
    ? `${provati} dialoghi su ${esistenti} punti (uno ogni ${Math.ceil(esistenti / TETTO)})`
    : `${provati} dialoghi, cioè TUTTI i punti`;
  test(`controprova a tappeto su ${nome}: ${quanti}, tutti trovati`, () => {
    ok(ciechi === 0, `${rel}: ${ciechi} iniezioni su ${provati} passano inosservate`);
  });
}
test("la controprova a tappeto ha davvero iniettato qualcosa", () => {
  ok(provatiTot >= 60, `solo ${provatiTot} iniezioni: le stringhe sono sparite, o le spie non funzionano più`);
  console.log(`     (${provatiTot} iniezioni provate, prese a passo regolare su ${esistentiTot} punti di ri-sincronizzazione)`);
});
test("la controprova a tappeto sa fallire: con la scansione ingenua il difetto sfugge", () => {
  ok(ciechiIngenua > 0,
    "con la scansione che ignora i template annidati NESSUNA iniezione sfugge: allora questa prova non sta misurando niente");
  console.log(`     (con la scansione ingenua ne sfuggirebbero ${ciechiIngenua} su ${provatiTot})`);
});

console.log("\n── Regola 2: le unità di misura non vanno in maiuscolo ──");
test("il motore dei grafici avvolge le unità in .dwg-u", () => {
  const js = leggi("shared/dw-grafici.js");
  ok(js, "shared/dw-grafici.js non trovato");
  ok(/function\s+testoConUnita/.test(js), "manca testoConUnita: era il meccanismo che sottrae l'unità al maiuscolo");
  ok(/'dwg-axlab dwg-u'/.test(js), "l'etichetta d'asse deve portare .dwg-u: contiene SOLO l'unità");
  ok(/function\s+paiUnita/.test(js), "manca paiUnita, il riconoscimento di cosa è un'unità");
});
test(".dwg-u spegne il maiuscolo, nel foglio condiviso", () => {
  const css = leggi("shared/dw-grafici.css");
  ok(css, "shared/dw-grafici.css non trovato");
  const blocco = css.match(/\.dwg-u[^{]*\{[^}]*\}/);
  ok(blocco, "manca la regola per .dwg-u");
  ok(/text-transform:\s*none/.test(blocco[0]), `.dwg-u deve togliere il maiuscolo — trovato: ${blocco[0]}`);
});
test("nessuna app rimette una toppa locale sui grafici", () => {
  // Una toppa come `.dwg-tab thead th{text-transform:none}` corregge l'unità
  // ma spegne il maiuscolo anche a «Voce» e «Quota», cioè allontana la tabella
  // dal core: la struttura deve restare identica al riferimento.
  const colpevoli = [];
  for (const [nome, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null) continue;
    const re = /\.(dwg-axlab|dwg-tab\s+thead\s+th|dwg-title)\s*\{[^}]*text-transform\s*:\s*none/g;
    if (re.test(src)) colpevoli.push(`${nome} (${rel})`);
  }
  ok(colpevoli.length === 0,
    `la correzione sta in shared/, non nelle app: ${colpevoli.join(", ")}`);
});
test("paiUnita non prende una data per un'unità", async () => {
  // «Cavato e venduto — 01/01/2026 – 31/12/2026» finisce con una data, e la
  // barra la faceva sembrare `l/h`. Le due esclusioni imparate su titoli veri.
  const js = leggi("shared/dw-grafici.js");
  ok(/\[0-9\]/.test(js) || /0-9/.test(js), "manca l'esclusione delle cifre: una data non è un'unità");
  ok(/coda\.length\s*>\s*8/.test(js), "manca il limite di lunghezza: oltre 8 caratteri è una parola, non un'unità");
});

/* ⛔ E LA REGOLA 2 GUARDAVA SOLO IL MOTORE DEI GRAFICI, MENTRE SETTE UNITÀ NUDE
   STAVANO NELLE PAGINE. Misurato l'08/08, ed è la storia del «controllo che non
   arriva» nella sua veste più semplice: il difetto è sorvegliato da un banco
   del browser (`tests/browser/unita-maiuscole.mjs`), che però scarta gli
   elementi senza area — `if (r.width < 1 || r.height < 1) return` — perché un
   maiuscolo che nessuno vede non è un difetto. Ragionevole, e cieco su tutto
   ciò che compare DOPO: il riquadro Kuz-Ram del core è `display:none` finché
   non si calcola, e dentro c'era «X50 (cm)» → «X50 (CM)». Il banco diceva
   «nessuna unità in maiuscolo» sul core da sempre.
   I sette, tutti corretti nella stessa unità: due «Km» del contachilometri,
   «X50 (cm)», il titolo «Produzione mc», i tre pezzi della riga di riepilogo
   della volata (`m`, `kg`, `mc`) e «Volume rimesso per il recupero (m³)» di
   Terra — quest'ultimo l'unico che il banco vedeva.
   ⚠️ IL RIGHELLO HA SBAGLIATO TRE VOLTE PRIMA DI REGGERE, e le tre correzioni
   sono nel codice qui sotto perché nessuno le rifaccia:
   1. chiudeva l'elemento sul PRIMO tag omonimo, quindi
      `<span class="vita-pct">… <span class="u">m³</span></span>` perdeva la
      protezione e accusava Terra per un caso sano;
   2. `<input>` non si chiude: senza l'elenco degli elementi vuoti
      l'annidamento non tornava mai giù e la lettura correva oltre `</label>`,
      dentro un commento HTML e dentro codice — due falsi allarmi in Sentinella;
   3. il commento CSS entra nel selettore che lo segue, quindi `.fl` di Terra
      non risultava nemmeno maiuscola: il controllo era cieco proprio sull'unico
      caso che il banco del browser aveva già trovato.
   Costo della regola, misurato prima di adottarla: 10 allarmi su 925 elementi,
   7 veri e 3 simboli che si scrivono come un'unità, dichiarati qui per nome. */
const UNITA_NUDE_ACCETTATE = new Map([
  ['core (radice)|fl|H banco', '«H» è il simbolo dell\'altezza del banco, non l\'ora: la sua unità è già avvolta, «H banco (<span class="u">m</span>)».'],
  ['core (radice)|sl|DB', 'il database, in una scheda di diagnosi. Acronimo, e in maiuscolo ci va: il decibel non c\'entra.'],
  ['Genesi|sv-lab|Rapporto di rigidità H/B', 'il rapporto di rigidità: due simboli geometrici, nessuna ora.'],
]);
/* le unità con una maiuscola DIVERSA da sé. «€» e «%» non ne hanno una, quindi
   il maiuscolo non le corrompe e stare in elenco le renderebbe solo rumorose. */
const UNITA_CORRUTTIBILI = ['m³', 'm²', 'µg/m³', 'mg/m³', 'mm/s', 'dB', 'kg/m³', 'kg/foro',
  'kg/m', 'kg', 'km/h', 'km', 'MPa', 'GPa', 'kbar', 'Hz', 'ms/m', 'ms', 'm/kg', 't/m³',
  '€/m³', '€/kg', '€/foro', '€/t', '€/m', 'cm', 'mm', 'gg', 'mc', 't', 'h'];
const VUOTI_HTML = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'area', 'base', 'col', 'embed', 'param', 'track', 'wbr']);

/* le classi che il foglio DELLA PAGINA STESSA mette in maiuscolo: derivate, non
   scritte a mano. Un selettore con un discendente (`.fl .u`) parla del figlio —
   è la protezione, non la condanna — quindi resta fuori. */
function classiMaiuscole(css) {
  const su = new Set();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, " ").matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (!/text-transform\s*:\s*uppercase/.test(m[2])) continue;
    for (const s of m[1].split(",")) {
      const parti = s.trim().split(/\s+/);
      if (parti.length !== 1) continue;
      const cl = [...parti[0].matchAll(/\.([\w-]+)/g)].map((x) => x[1]);
      if (cl.length === 1) su.add(cl[0]);
    }
  }
  return su;
}

/* il testo PROPRIO di un elemento: quello suo, tolti i figli col loro
   contenuto. Si cammina contando l'annidamento — vedi le tre correzioni sopra. */
function testoProprioHtml(html, dopoApertura, tag) {
  let liv = 0, out = "", ultimo = dopoApertura;
  const re = /<(\/?)([a-z][\w-]*)\b[^>]*?(\/?)>/gi;
  re.lastIndex = dopoApertura;
  let m;
  while ((m = re.exec(html))) {
    if (liv === 0) out += html.slice(ultimo, m.index);
    const chiude = m[1] === "/", nome = m[2].toLowerCase();
    if (nome === tag.toLowerCase() && chiude && liv === 0) return out;
    if (chiude) { if (liv > 0) liv--; }
    else if (!VUOTI_HTML.has(nome) && m[3] !== "/") liv++;
    ultimo = re.lastIndex;
  }
  return out;
}

function unitaNude(soloQuesta = null, testoDato = null) {
  const fuori = [];
  let elementi = 0, classi = 0, pagine = 0;
  for (const [nome, rel] of SUPERFICI) {
    if (soloQuesta && soloQuesta !== rel) continue;
    let html = testoDato !== null && soloQuesta === rel ? testoDato : leggi(rel);
    if (html === null) continue;
    pagine++;
    html = html.replace(/<!--[\s\S]*?-->/g, " ");   // un commento può contenere «<»
    const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
    const su = classiMaiuscole(css);
    classi += su.size;
    for (const cl of su) {
      const re = new RegExp(`<([a-z]+)[^>]*\\bclass="[^"]*\\b${cl}\\b[^"]*"[^>]*>`, "g");
      for (const m of html.matchAll(re)) {
        elementi++;
        const proprio = testoProprioHtml(html, m.index + m[0].length, m[1])
          .replace(/&sup3;/g, "³").replace(/&sup2;/g, "²").replace(/&nbsp;/g, " ");
        const basso = proprio.toLowerCase();
        const u = UNITA_CORRUTTIBILI.find((u) => {
          const i = basso.indexOf(u.toLowerCase());
          if (i < 0) return false;
          const prima = i === 0 ? " " : proprio[i - 1];
          const dopo = proprio[i + u.length] || " ";
          return /[\s\d(/·,]/.test(prima) && !/[a-zA-Zà-ù]/.test(dopo);
        });
        if (!u) continue;
        fuori.push({ nome, cl, u, testo: proprio.replace(/\s+/g, " ").trim().slice(0, 52) });
      }
    }
  }
  return { fuori, elementi, classi, pagine };
}
const scusataNuda = (v) => [...UNITA_NUDE_ACCETTATE.keys()]
  .find((k) => { const [n, c, t] = k.split("|"); return n === v.nome && c === v.cl && v.testo.startsWith(t); });

test("regola 2: nessuna unità nuda dentro una classe che il foglio mette in maiuscolo", () => {
  const { fuori } = unitaNude();
  const veri = fuori.filter((v) => !scusataNuda(v));
  ok(veri.length === 0, "unità nude (vanno avvolte in `<span class=\"u\">`):\n     "
    + veri.map((v) => `${v.nome}: «${v.testo}» — «${v.u}» in .${v.cl}`).join("\n     "));
});

test("regola 2: dichiara su quanti soggetti ha davvero guardato", () => {
  /* Un «nessuna violazione» non vale niente senza il denominatore: se il
     riconoscimento delle classi si rompesse — ed è già successo, col commento
     CSS — questa regola resterebbe verde guardando zero elementi. */
  const { elementi, classi, pagine } = unitaNude();
  console.log(`     (${elementi} elementi sotto ${classi} classi maiuscole derivate dai fogli, su ${pagine} superfici)`);
  ok(pagine >= 12, `solo ${pagine} superfici lette: l'elenco non sta arrivando alle pagine`);
  ok(classi >= 60, `solo ${classi} classi maiuscole derivate: il riconoscimento nel foglio si è rotto`);
  ok(elementi >= 700, `solo ${elementi} elementi guardati: la regola non sta guardando dove crede`);
});

test("regola 2: ogni eccezione si presenta ancora", () => {
  /* Come in `sonda-vuoto.mjs`: una riga che scusa un caso che non c'è più sta
     coprendo un difetto che non esiste, e nasconde quello che nascerà lì. */
  const { fuori } = unitaNude();
  const viste = new Set(fuori.map(scusataNuda).filter(Boolean));
  const orfane = [...UNITA_NUDE_ACCETTATE.keys()].filter((k) => !viste.has(k));
  ok(orfane.length === 0, `eccezioni che non si presentano più (il testo è cambiato: la riga va tolta): ${orfane.join(" · ")}`);
});

test("regola 2: la controprova — rimette il difetto vero e pretende che cada", () => {
  /* Il difetto rimesso è quello VERO, quello dell'08/08: «X50 (cm)» dentro un
     riquadro `display:none`, cioè il caso su cui il banco del browser non
     poteva arrivare. Si inietta in memoria, mai sul file. */
  const sano = leggi("index.html");
  ok(sano !== null, "index.html non trovato");
  const guasto = sano.replace('<div class="sl">X50 (<span class="u">cm</span>)</div>', '<div class="sl">X50 (cm)</div>');
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la riga del difetto è cambiata, la controprova non prova più nulla");
  const { fuori } = unitaNude("index.html", guasto);
  const veri = fuori.filter((v) => !scusataNuda(v));
  ok(veri.some((v) => v.u === "cm"), `col difetto rimesso la regola deve vederlo — ha trovato: ${veri.map((v) => v.testo).join(" · ") || "niente"}`);
  /* e la protezione deve contare davvero: rimessa, il caso sparisce */
  const { fuori: dopo } = unitaNude("index.html", sano);
  ok(!dopo.filter((v) => !scusataNuda(v)).some((v) => v.u === "cm"),
    "col file sano la regola accusa lo stesso: allora non sta guardando lo `<span class=\"u\">`");
});

console.log("\n── Regola 3: un campo decimale non è mai type=number ──");
// Misurato in Chromium: in un `<input type="number">`, digitando «2,4» da
// tastiera il `.value` diventa «24» e `checkValidity()` risponde true. Il
// browser scarta la virgola, tiene le cifre e chiama valido un numero dieci
// volte più grande — e in cava chi compila scrive la virgola. Su una carica di
// esplosivo, su un imponibile o su una coordinata GPS è il difetto peggiore
// della piattaforma, perché è silenzioso.
// Un campo decimale si dichiara tale in DUE modi, e questa regola all'inizio
// guardava solo il primo — per questo passava mentre nel core ne restavano 34
// dello stesso difetto, nella stessa schermata dei 32 corretti:
//   1. `step` frazionario (step="0.1"): la firma classica;
//   2. `inputmode="decimal"`: il campo dichiara la tastiera decimale sul
//      telefono, quindi si aspetta un numero con la virgola — e allora
//      `type="number"` è un difetto anche senza step, perché lo step assente
//      vale 1 e il browser rifiuta i decimali oltre a scartare la virgola.
// Il caso 2 era il peggiore proprio perché sembrava già a posto: fra quei 34
// c'erano il diametro del foro, la spalla del calcolatore di carica e i
// parametri di Kuz-Ram, dove «3,5» diventava 35.
const APP_SEI = SUPERFICI.filter(([n]) => !/core|Deepwork ID/.test(n));
function numeriDecimali(src) {
  const fuori = [];
  const tag = /<input\b[^>]*>/gi;
  let m;
  while ((m = tag.exec(src)) !== null) {
    const t = m[0];
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    const perStep = st != null && st[1].includes(".");
    const perInputmode = /inputmode="decimal"/.test(t);
    if (!perStep && !perInputmode) continue;        // campo intero: va bene così
    const id = /id="([^"]*)"/.exec(t);
    fuori.push({ id: id ? id[1] : "(senza id)", perche: perStep ? "step " + st[1] : 'inputmode="decimal"' });
  }
  return fuori;
}
for (const [nome, rel] of APP_SEI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale è rimasto type=number`, () => {
    const v = numeriDecimali(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
  });
}
test("il controllo si accorge di un campo decimale rimesso a type=number", () => {
  ok(numeriDecimali('<input id="x" type="number" step="0.1">').length === 1, "step frazionario trovato");
  // la seconda firma: dichiarato decimale dall'inputmode, senza step. È quella
  // che la regola non guardava, e che nel core lasciava passare 34 campi.
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal">').length === 1, "inputmode=decimal su type=number trovato");
  ok(numeriDecimali('<input id="x" type="number" inputmode="decimal" step="1">').length === 1, 'step="1" non assolve: la percentuale 12,5 resta vietata');
  ok(numeriDecimali('<input id="x" type="number" step="1">').length === 0, "un campo intero non è un difetto");
  ok(numeriDecimali('<input id="x" type="number" inputmode="numeric">').length === 0, "un intero che dichiara la tastiera intera va bene");
  ok(numeriDecimali('<input id="x" type="text" inputmode="decimal" step="0.1">').length === 0, "convertito: a posto");
  // controprova sui file veri: si rimette il difetto e il controllo deve vederlo
  for (const [nome, rel] of [["Campo", "apps/campo/index.html"], ["Genesi", "apps/genesi/genesi.html"]]) {
    const src = leggi(rel);
    if (!src) continue;
    ok(numeriDecimali(src).length === 0, `${nome} parte pulito`);
    for (const veleno of ['<input id="veleno" type="number" step="0.1">',
                         '<input id="veleno" type="number" inputmode="decimal">']) {
      const rotto = src.replace('<input', veleno + '<input');
      ok(numeriDecimali(rotto).length === 1, `${nome}: il difetto iniettato viene trovato (${veleno})`);
    }
  }
});
// IL CORE è convertito anche lui, in due passaggi perché la regola all'inizio
// vedeva metà del difetto: prima i 32 campi con lo step frazionario — fra cui le
// COORDINATE GPS della cava (`cf-lat`/`cf-lon`, dove «37,0625» diventava
// 370625) e i parametri di volata (`a-b` spalla, `a-s` interasse, `a-mh`
// carica massima per ritardo, `a-pm` consumo specifico) — poi altri 34 che si
// dichiaravano decimali col solo `inputmode`, fra cui il diametro del foro, la
// spalla del calcolatore di carica e i parametri di Kuz-Ram.
// Adesso la regola vale su TUTTA la piattaforma, core compreso: non c'è più
// nessuna superficie esentata.
test("core: nessun campo decimale è rimasto type=number", () => {
  const v = numeriDecimali(leggi("index.html") || "");
  ok(v.length === 0,
    `index.html — ${v.map((x) => `#${x.id} (${x.perche})`).join(", ")}: con type=number «2,4» diventa 24`);
});
test("e i campi INTERI del core sono rimasti type=number", () => {
  // La conversione deve riguardare SOLO i decimali: sugli interi (anno, km,
  // numero di fori) lo spinner del browser serve, e mezzo foro non esiste.
  //
  // ⚠️ Qui prima c'era `ok(n === 53)`, il conteggio del giorno in cui l'ho
  // scritto. Era una trappola: quando si è scoperto che 34 di quei 53 non erano
  // interi ma decimali travestiti, il test ha accusato la correzione invece del
  // difetto. Un conteggio inchiodato scambia il progresso per una regressione.
  // Adesso il controllo guarda la NATURA dei campi, che è ciò che la regola
  // dice davvero: ogni campo rimasto `type=number` deve essere un intero.
  const src = leggi("index.html") || "";
  const rimasti = (src.match(/<input\b[^>]*type="number"[^>]*>/g) || []);
  ok(rimasti.length > 0, "nel core non c'è più nessun campo intero: la conversione ha preso troppo");
  const sospetti = rimasti.filter((t) => {
    if (/inputmode="decimal"/.test(t)) return true;             // si dichiara decimale
    const st = /step="([^"]*)"/.exec(t);
    return st != null && st[1].includes(".");                   // step frazionario
  });
  ok(sospetti.length === 0,
    `campi ancora type=number ma dichiarati decimali: ${sospetti.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
  // e nessuno degli interi rimasti deve dichiarare la tastiera decimale
  const tastiera = rimasti.filter((t) => /inputmode="(?!numeric)/.test(t));
  ok(tastiera.length === 0,
    `interi con la tastiera sbagliata: ${tastiera.map((t) => (/id="([^"]*)"/.exec(t) || [, "?"])[1]).join(", ")}`);
});

console.log("\n── Regola 4: un numero che non si capisce non diventa zero ──");
// Cambiare il tipo del campo era metà del lavoro: l'altra metà è chi lo legge.
// Nel core 17 campi decimali passavano da `parseNum0`, che di ciò che non
// capisce fa ZERO — un costo di riparazione a zero, ore di lavoro a zero, litri
// di gasolio a zero. Zero non è «non lo so»: è una misura, ed è sbagliata, e
// finisce dentro somme e medie senza lasciare traccia.
// Adesso quei campi passano da `numDetto` (che lo dice e blocca il salvataggio)
// o da `numDaCampo` (che restituisce null, per i dati facoltativi).
function decimaliLettiConZero(src) {
  const ids = new Set();
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/inputmode="decimal"/.test(t)) continue;
    const id = /id="([^"]*)"/.exec(t);
    // gli id costruiti dentro un template (`id="f-${i}"`) non si possono cercare
    if (id && id[1] && !id[1].includes("$")) ids.add(id[1]);
  }
  const fuori = [];
  for (const id of ids) {
    // `parseNum0($('co-gas').value)` e `parseNum0($('r-d2')?.value)`
    const re = new RegExp("parseNum0\\(\\s*\\$\\(\\s*['\"]" + id.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") + "['\"]\\s*\\)\\??\\.value", "g");
    const n = (src.match(re) || []).length;
    if (n) fuori.push({ id, quante: n });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  test(`${nome}: nessun campo decimale si legge con parseNum0`, () => {
    const v = decimaliLettiConZero(src);
    ok(v.length === 0,
      `${rel} — ${v.map((x) => `#${x.id} (${x.quante}×)`).join(", ")}: di ciò che non capisce fa zero, e zero è una misura`);
  });
}
test("il controllo si accorge di una lettura rimessa a parseNum0", () => {
  const finto = `<input type="text" inputmode="decimal" id="costo">`;
  ok(decimaliLettiConZero(finto).length === 0, "senza letture non c'è violazione");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo').value);`).length === 1, "la lettura con zero viene trovata");
  ok(decimaliLettiConZero(finto + `x=parseNum0($('costo')?.value);`).length === 1, "anche con l'accesso prudente");
  ok(decimaliLettiConZero(finto + `x=numDetto('costo','il costo');`).length === 0, "il lettore che parla va bene");
  ok(decimaliLettiConZero(`<input type="number" id="anno">x=parseNum0($('anno').value);`).length === 0,
    "su un campo INTERO parseNum0 non è un difetto: lì lo zero è un numero come un altro");
  // controprova sul file vero: si rimette il difetto e il controllo deve vederlo
  const core = leggi("index.html");
  if (core) {
    ok(decimaliLettiConZero(core).length === 0, "il core parte pulito");
    const rotto = core.replace("</body>", "<script>x=parseNum0($('co-gas').value);</script></body>");
    ok(decimaliLettiConZero(rotto).length === 1, "il difetto iniettato nel core viene trovato");
  }
});

console.log("\n── Regola 7: la provenienza di un rilievo si decide in un posto solo ──");
// Un rilievo di CUMULO è materiale già estratto e NON consuma il volume
// concesso; uno di SCAVO sì. La regola era scritta due volte — in Terra come
// `provenienzaRilievo` e in Conti come `eCumulo`, con un commento che dichiarava
// di essere «la stessa regola di Terra», cioè una divergenza in attesa. Adesso la
// sorgente è `provenienzaDi` in `shared/dw-ponti.js`.
// Perché vale un controllo automatico: se una copia divergesse, il materiale
// tolto anni fa comincerebbe a consumare la concessione (o il contrario) e il
// difetto non si vedrebbe da nessuna parte — nessun errore, nessun test rosso,
// solo un numero sbagliato in un documento che va all'ente.
//
// ⚠️ COSA cerca questa regola, perché la prima versione cercava la cosa
// sbagliata: NON è vietato confrontare con «cumulo» — `provenienzaDi(r) ===
// "cumulo"` è l'uso normale e inevitabile, e la prima versione lo segnalava in
// tre punti legittimi (fra cui `soloCumulo` di Terra). È vietato **ricavare la
// provenienza dal record grezzo**: leggere `.provenienza` e deciderlo in casa,
// che è esattamente com'erano nate le due copie.
const RICAVA = /\.provenienza\b/;
function ricavaProvenienza(src) {
  const vivo = mascheraCodice(src);
  const fuori = [];
  const re = new RegExp(RICAVA.source, "g");
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!vivo[m.index]) continue;                 // in un commento non decide niente
    // legittimo dove si SCRIVE il campo o lo si passa a `provenienzaDi`; sospetto
    // dove nella stessa espressione compare la parola «cumulo»
    const intorno = src.slice(Math.max(0, m.index - 120), m.index + 120);
    if (!/cumulo/i.test(intorno)) continue;
    if (/provenienzaDi\s*\(/.test(intorno)) continue;
    fuori.push({ riga: src.slice(0, m.index).split("\n").length, testo: intorno.replace(/\s+/g, " ").slice(60, 170) });
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI.concat(MODULI)) {
  if (rel === "shared/dw-ponti.js") continue;     // è la sorgente della regola
  const src = leggi(rel);
  if (src === null) continue;
  const v = ricavaProvenienza(src);
  if (!v.length && !/provenienza/.test(src)) continue;   // il file non c'entra
  test(`${nome}: non ricava la provenienza dal record grezzo`, () => {
    ok(v.length === 0,
      `${rel} — riga ${v.map((x) => x.riga).join(", ")}: la regola vive in shared/dw-ponti.js (provenienzaDi)`);
  });
}
test("il controllo distingue la copia dall'uso normale", () => {
  const copia = 'const eCumulo = (r) => String((r && r.provenienza) || "").toLowerCase() === "cumulo";';
  ok(ricavaProvenienza(copia).length === 1, "una copia che ricava dal record grezzo viene vista");
  ok(ricavaProvenienza('const cum = provenienzaDi(r) === "cumulo";').length === 0,
    "confrontare il risultato della funzione condivisa è l'uso NORMALE, non una violazione");
  ok(ricavaProvenienza('provenienza: provenienzaDi({ provenienza }),').length === 0,
    "e passarle il campo grezzo per farselo normalizzare va bene");
  ok(ricavaProvenienza('// qui si leggeva r.provenienza e si confrontava con "cumulo"').length === 0,
    "la stessa cosa raccontata in un commento non è una violazione");
  ok(ricavaProvenienza('r.provenienza = "scavo";').length === 0,
    "e scrivere il campo non è deciderne il significato");
});

console.log("\n── Regola 6: il ponte con Terra non dà la colpa a chi compila ──");
// Decisione presa PRIMA di scrivere il codice, e messa qui perché è il tipo di
// cosa che si perde riscrivendo un testo: quando la produzione dichiarata dai
// turni non torna col rilievo del drone, Campo NON deve dare la colpa a chi ha
// stimato. Se dicesse «le tue stime erano gonfie», la conseguenza prevedibile è
// che i turni comincino a scrivere numeri prudenti invece di numeri veri, e il
// dato peggiora proprio dove serve. Il testo deve nominare ENTRAMBE le
// spiegazioni possibili, compresa quella che non riguarda i turni.
test("Campo: quando i numeri non tornano, il testo nomina entrambe le spiegazioni", () => {
  const src = leggi("apps/campo/index.html") || "";
  ok(/rap-terra/.test(src), "la sezione del ponte con Terra c'è");
  ok(/stima di turno/.test(src), "il testo nomina la stima di turno come possibile causa");
  ok(/volo che non ha coperto/.test(src),
    "e nomina anche il volo che non copre tutto lo scavo: senza, lo scarto ricade tutto sui turni");
  // ⚠️ Le frasi vietate compaiono di PROPOSITO nei commenti, che spiegano perché
  // sono vietate — la stessa situazione della regola sui dialoghi del browser, e
  // la prima versione di questo controllo è caduta proprio lì, segnalando il
  // commento che documentava la decisione. Si guarda solo il codice VIVO, con lo
  // stesso tokenizzatore.
  // il testo mostrato vive nelle stringhe, quindi si tolgono solo i commenti:
  // `mascheraCodice` maschererebbe proprio il contenuto che qui va guardato
  const testo = senzaCommenti(src);
  const nelVivo = (frase) => new RegExp(frase, "i").test(testo);
  for (const accusa of ["le tue stime", "hai stimato", "gonfiat", "per colpa"]) {
    ok(!nelVivo(accusa), `il testo mostrato non usa «${accusa}»: un rimprovero fa scrivere numeri prudenti, non veri`);
  }
  // il controllo del controllo: la frase iniettata nel codice vivo deve essere vista
  ok(nelVivo("stima di turno"), "e il controllo sa vedere una frase che sta davvero nel testo");
});

console.log("\n── Regola 5: dove ci sono campi interi, la guardia è montata ──");
// I campi decimali sono diventati campi di testo; gli INTERI restano
// `type="number"` di proposito, perché lì lo spinner serve. Ma questo lascia al
// browser l'ultima parola sulla virgola, e misurato in Chromium «1,5» diventa
// «15» con `checkValidity()` che risponde **true**: leggere la validità non
// basta, il numero è già stato distrutto e dichiarato buono. Serve la guardia
// su `beforeinput`, e sta in `shared/` una volta sola.
// Questa regola non prova il MECCANISMO (quello si prova col browser, con tasti
// veri): prova che nessuna superficie con campi interi si dimentichi di
// montarla, che è la cosa che si perde aggiungendo una pagina.
function campiInteri(src) {
  let n = 0;
  for (const t of src.match(/<input\b[^>]*>/gi) || []) {
    if (!/type="number"/.test(t)) continue;
    const st = /step="([^"]*)"/.exec(t);
    if (st && st[1].includes(".")) continue;
    if (/inputmode="decimal"/.test(t)) continue;
    n++;
  }
  return n;
}
const montaGuardia = (src) => /montaGuardiaInteri\s*\(/.test(src);
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const n = campiInteri(src);
  if (!n) continue;
  test(`${nome}: ${n} campi interi, e la guardia è montata`, () => {
    ok(montaGuardia(src),
      `${rel} ha ${n} campi interi ma non chiama montaGuardiaInteri: su quei campi «1,5» diventa 15 in silenzio`);
  });
}
test("la guardia condivisa esiste e distingue interi da decimali", () => {
  const shell = leggi("shared/deepwork-id-client/dw-shell.js") || "";
  ok(/export function montaGuardiaInteri/.test(shell), "montaGuardiaInteri è esportata da shared/");
  ok(/export function eCampoIntero/.test(shell), "e il riconoscimento del campo intero è a parte, provabile");
  ok(/beforeinput/.test(shell), "si attacca a beforeinput, dove il carattere si può ancora rifiutare");
  // il controllo del controllo: una superficie con campi interi e senza guardia
  // deve fallire
  const finto = '<input type="number" id="fori">';
  ok(campiInteri(finto) === 1 && !montaGuardia(finto), "il difetto iniettato viene visto");
  ok(campiInteri('<input type="number" step="0.1">') === 0, "un decimale non è un campo intero");
  ok(campiInteri('<input type="number" inputmode="decimal">') === 0, "e nemmeno uno dichiarato dall'inputmode");
  ok(campiInteri('<input type="text" inputmode="numeric">') === 0, "un campo di testo non ha bisogno della guardia");
});

console.log("\n── Regola 10: uno stato vuoto con un titolo ha anche una spiegazione ──");
// Trovato aprendo il core per la prima volta in locale: tredici stati vuoti
// mostravano icona e titolo e basta — «Nessun mezzo da lavoro» su uno schermo
// per il resto nero. È la schermata che una cava nuova vede il primo giorno, e
// non diceva né che cosa fare né di chi fosse il compito. Le sei app, che dal
// core hanno copiato tutto, su questo erano più ricche del loro riferimento.
// Non riguarda i segnaposto brevi dentro le schede («Nessun file»), fatti
// apposta di sola spiegazione: si guarda chi ha un TITOLO.
function vuotiSenzaSpiegazione(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  const re = /empty-title/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 500);
    if (!/empty-sub/.test(finestra)) {
      const t = /empty-title[^>]*>([^<]{0,60})/.exec(finestra);
      fuori.push((t && t[1].trim()) || "(titolo dinamico)");
    }
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const muti = vuotiSenzaSpiegazione(src);
  test(`${nome}: ogni stato vuoto con titolo dice anche cosa fare`, () => {
    ok(muti.length === 0,
      `${rel}: ${muti.length} stati vuoti mostrano solo il titolo (${muti.slice(0, 4).join(" · ")}): ` +
      `chi apre l'app il primo giorno non capisce se il vuoto dipende da lui`);
  });
}
test("la regola 10 sa vedere il difetto che è stato tolto", () => {
  const difetto = '<div class="empty-state"><div class="empty-icon">🚜</div>' +
    '<div class="empty-title">Nessun mezzo da lavoro</div></div>';
  const messo = difetto.replace("</div></div>", '</div><div class="empty-sub">Aggiungilo col ＋.</div></div>');
  ok(vuotiSenzaSpiegazione(difetto).length === 1, "lo stato vuoto muto viene visto");
  ok(vuotiSenzaSpiegazione(messo).length === 0, "e quello che spiega no");
  ok(vuotiSenzaSpiegazione('<div class="empty-state"><div class="empty-sub">Nessun file</div></div>').length === 0,
    "il segnaposto breve dentro una scheda non è una violazione");
});

console.log("\n── Regola 9: nessuna superficie si riscrive in casa la regola degli interi ──");
// Trovata dal vero, digitando: in Terra «1.500» diventava «500». Terra aveva la
// sua copia della stessa regola, scritta prima che la guardia vivesse in
// `shared/`, e con un comportamento DIVERSO — oltre a rifiutare il separatore
// svuotava il campo. Montate tutte e due, il «1» spariva e restava «500»: un
// numero plausibile e sbagliato, cioè proprio quello che lo svuotamento voleva
// evitare. La guardia condivisa, da sola, in quel caso dà 1500.
// La regola vincolante del progetto dice che una regola che serve a due app vive
// in `shared/` e non si riscrive; questa la rende verificabile.
// Cosa si cerca: un ascoltatore `beforeinput` che, fuori da `shared/`, guarda i
// separatori decimali. Il testo si prende senza commenti (i commenti PARLANO di
// beforeinput, e non sono codice), non mascherato, perché qui interessa il
// codice vero e le espressioni regolari ci vivono dentro.
function guardieInCasa(src) {
  const corpo = senzaCommenti(src);
  const fuori = [];
  // FINESTRA A LUNGHEZZA FISSA, non un'espressione regolare che «arriva fino
  // alla parentesi»: la prima versione era `[\s\S]{0,400}?\)`, e il non greedy
  // si fermava alla parentesi di `(e)`, tre caratteri dopo. Guardava un pezzo
  // in cui la virgola non poteva esserci, quindi non trovava niente su nessuna
  // superficie — e i controlli passavano a vuoto. L'ha detto la controprova.
  const re = /addEventListener\(\s*["']beforeinput["']/g;
  let m;
  while ((m = re.exec(corpo))) {
    const finestra = corpo.slice(m.index, m.index + 400);
    if (/\[\.,\]|\[,\.\]|\bvirgola\b/.test(finestra)) fuori.push(finestra.slice(0, 90).replace(/\s+/g, " "));
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const suoi = guardieInCasa(src);
  test(`${nome}: la regola degli interi non è riscritta in casa`, () => {
    ok(suoi.length === 0,
      `${rel} intercetta beforeinput sui separatori per conto proprio (${suoi.length}): ` +
      `la regola sta in shared/, e due copie con comportamenti diversi si pestano i piedi — ${suoi[0] || ""}`);
  });
}
test("la regola 9 sa vedere il difetto che è stato tolto", () => {
  // il codice VERO che stava in Terra, rimesso qui dentro: se il controllo non
  // lo vede, non sta guardando dove crede
  const difetto = `el.addEventListener("beforeinput", (e) => {
      if (!e.data || !/[.,]/.test(e.data)) return;
      e.preventDefault(); el.value = ""; });`;
  ok(guardieInCasa(difetto).length === 1, "la copia locale che svuotava il campo viene vista");
  ok(guardieInCasa('// qui una volta c\'era un addEventListener("beforeinput") con la virgola').length === 0,
    "un commento che ne parla non è una violazione");
  ok(guardieInCasa('document.addEventListener("beforeinput", (ev) => { registra(ev); });').length === 0,
    "un beforeinput che non guarda i separatori non c'entra");
});

/* ══════════════════════════════════════════════════════════════════════
   REGOLA 8 · UNA CLASSE SCRITTA NEL MARKUP CHE NESSUN FOGLIO DEFINISCE
   ══════════════════════════════════════════════════════════════════════
   `class="note avviso"` in un'app che non ha `.note.avviso` non è un errore per
   nessuno: il browser non protesta, la pagina si apre, e la nota si vede — solo
   che si vede NEUTRA dove il codice diceva «attenzione». Trovato dal vero: la
   regola esisteva in Terra e in Sentinella, e in Campo e Scudo no, quindi tre
   note d'avviso rendevano come note qualunque.
   Si guardano i modificatori della famiglia `note`, che è quella che porta il
   SIGNIFICATO (recap, avviso, esito, err): una classe che dice come leggere il
   testo e non fa niente è peggio di nessuna classe, perché chi scrive crede di
   averlo detto. */
const MODIFICATORI_NOTA = /class="note ([a-z][a-z-]*)"/g;
/* COSA CONTA COME «DEFINITA», imparato sbagliando due volte in una:
   · `.note.esito.err{…}` definisce `esito` quanto `.note.esito{…}` — la prima
     versione cercava solo la parentesi subito dopo e dichiarava orfane 54 note;
   · `.prescr{…}` da sola vale: una classe può portare stile senza passare da
     `.note`, e pretendere il prefisso sarebbe una regola inventata da me;
   · i fogli di `shared/` si leggono TUTTI. Elencarne tre a mano ha nascosto
     `dw-app-ui.css`, che è proprio quello che definisce `.note.esito`.
   È la solita lezione: una prova sbagliata che accusa il codice costa più di
   nessuna prova. */
/* i fogli di shared/ si LEGGONO, non si elencano: scriverne cinque a mano è come
   ho appena nascosto `dw-app-ui.css`, e la volta dopo si nasconderebbe quello nuovo */
const CSS_CONDIVISI = readdirSync(join(root, "shared"))
  .filter((f) => f.endsWith(".css")).map((f) => "shared/" + f);
function classiDefinite(css, dentro) {
  /* SI RACCOLGONO TUTTI I NOMI DI CLASSE che compaiono nel CSS, senza provare a
     capire se sono in posizione di selettore. Ci ho provato tre volte con uno
     sguardo all'indietro e ho sbagliato tre volte — l'ultima su `.note.vera`,
     dove il carattere che precede è una lettera, non un delimitatore.
     Raccogliere in più è il verso GIUSTO in cui sbagliare: al massimo questa
     regola lascia passare un'orfana, mentre raccogliere in meno ACCUSA il codice
     di un difetto che non ha — ed è già costato tre giri qui sopra.
     Si guarda solo dentro il CSS: per un file HTML, i blocchi <style>. */
  for (const m of css.matchAll(/\.(-?[a-z][a-z0-9-]*)/g)) dentro.add(m[1]);
}
function soloCss(src, rel) {
  if (rel.endsWith(".css")) return src;
  return [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
}
function noteSenzaStile(src, rel = "x.html") {
  const definiti = new Set();
  classiDefinite(soloCss(src, rel), definiti);
  for (const f of CSS_CONDIVISI) {
    const css = leggi(f);
    if (css) classiDefinite(css, definiti);
  }
  const usati = new Map();
  for (const m of src.matchAll(MODIFICATORI_NOTA)) {
    if (!definiti.has(m[1])) usati.set(m[1], (usati.get(m[1]) || 0) + 1);
  }
  return [...usati.entries()].map(([cls, n]) => `«note ${cls}» usata ${n} volte e mai definita`);
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const orfane = noteSenzaStile(src, rel);
  test(`${nome}: ogni modificatore di nota ha uno stile`, () => {
    ok(orfane.length === 0,
      `${rel}: ${orfane.join("; ")} — la nota si vede neutra dove il codice diceva altro`);
  });
}
/* ── REGOLA 11: il simbolo dell'euro non si riscrive in casa ─────────────── */
function euroInCasa(src) {
  const fuori = [];
  /* si guarda il CODICE senza commenti: un «€» dentro una spiegazione è
     legittimo, e anche un'etichetta come «Importo €» o l'unità «€/t». Quello
     che si cerca è il simbolo INCOLLATO A UN'ESPRESSIONE — cioè un pezzo di
     formattazione — che è il gesto da cui sono nate le tre forme diverse. */
  const codice = senzaCommenti(src);
  const re = /"\u20AC[\u0020\u00A0]?"\s*\+|\+\s*"\u20AC[\u0020\u00A0]?"/g;
  let m;
  while ((m = re.exec(codice)) !== null) {
    /* ⚠️ LA RIGA SI CERCA NEL SORGENTE VERO, non in quello ripulito. `senzaCommenti`
       toglie righe e quindi sposta la numerazione: la prima versione di questa
       regola indicava la riga 1202 di Conti, dove non c'era niente, mentre il
       difetto stava alla 1259. Un controllo che punta il dito nel posto sbagliato
       fa perdere più tempo di uno che non c'è. */
    const quantesime = codice.slice(0, m.index).split(m[0]).length;
    let pos = -1;
    for (let k = 0; k < quantesime; k++) pos = src.indexOf(m[0], pos + 1);
    const riga = pos < 0 ? "?" : src.slice(0, pos).split("\n").length;
    fuori.push(`riga ${riga}: ${m[0].trim()} — il simbolo si mette con conEuro() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  /* dw-shell è il posto dove la regola VIVE: lì il simbolo ci deve stare */
  if (rel.includes("dw-shell")) continue;
  const casi = euroInCasa(src);
  test(`${nome}: non si scrive in casa il simbolo dell'euro`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 11 sa vedere il difetto che è stato tolto", () => {
  /* le tre forme vere, com'erano scritte nelle tre app prima del 30/07 */
  ok(euroInCasa('const eur = (v) => "\u20AC\u00A0" + NUM2.format(v);').length === 1,
    "la forma di Conti");
  ok(euroInCasa('const eur = (n) => "\u20AC\u0020" + Math.round(n);').length === 1,
    "quella di Terra");
  ok(euroInCasa('return "\u20AC" + n.toLocaleString("it-IT");').length === 1,
    "e quella di Flotta, attaccata");
  ok(euroInCasa('const eur = euro; // \u20AC 48.200,00').length === 0,
    "un commento che mostra il risultato non è una violazione");
  ok(euroInCasa('<label>Importo \u20AC</label>').length === 0,
    "e nemmeno un'etichetta che chiede un importo");
  ok(euroInCasa('{ unita: "\u20AC/t" }').length === 0,
    "né l'unità di misura di un prezzo");
});

test("il controllo delle note sa fallire", () => {
  /* la controprova: una classe inventata dentro una sorgente che non la definisce
     deve essere segnalata, e una definita no */
  ok(noteSenzaStile('<style></style><div class="note inventata">x</div>').length === 1,
    "una classe mai definita viene vista");
  ok(noteSenzaStile('<style>.note.vera{color:red}</style><div class="note vera">x</div>').length === 0,
    "una definita nello stesso file non viene segnalata");
  ok(noteSenzaStile('<style>.note.vera.rossa{color:red}</style><div class="note vera">x</div>').length === 0,
    "e una definita solo in una variante — `.note.vera.rossa` — conta come definita");
  ok(noteSenzaStile('<style>.vera{white-space:pre-wrap}</style><div class="note vera">x</div>').length === 0,
    "e una classe che porta stile per conto suo, senza il prefisso `.note`");
  ok(noteSenzaStile('<style></style><div class="note">x</div>').length === 0,
    "una nota senza modificatore non ha niente da definire");
  /* la controprova del difetto appena tolto: dentro un elenco separato da virgole
     ogni classe conta, anche quelle dopo la prima */
  ok(noteSenzaStile('<style>.top,.nav,.vera,.altro{display:none}</style><div class="note vera">x</div>').length === 0,
    "in un elenco di selettori conta anche una classe che non è la prima");
  /* e una classe scritta SOLO nel markup, mai nel foglio, resta orfana anche se
     la parola compare altrove nel documento: si guarda dentro <style>, non nel testo */
  /* la parola dev'essere INVENTATA: qui c'era «avviso», che il 30/07 è diventata
     una regola di stato vera in `shared/dw-app-ui.css` — e la controprova, che
     legge anche i fogli condivisi, ha smesso di fallire. Una controprova che
     dipende da una parola del prodotto scade quando il prodotto cresce. */
  ok(noteSenzaStile('<style>.altro{color:red}</style><p>fandonia</p><div class="note fandonia">x</div>').length === 1,
    "la parola nel testo non vale come definizione: conta solo il foglio di stile");
});


/* ── REGOLA 12: chi salta i doppioni li cerca anche DENTRO il file ─────────
   Misurato il 31/07: dieci gestori d'importazione su dieci confrontavano ogni
   riga solo con l'elenco caricato all'apertura della pagina — e quell'elenco
   non si aggiorna mentre il file scorre. Due righe uguali nello stesso file
   entravano tutte e due, in tutte e sei le app.

   Non è un caso di scuola: l'export di Scudo scrive una riga per ogni
   scadenza, quindi il file di un lavoratore con tre scadenze lo nomina tre
   volte, e ri-caricarlo faceva comparire tre volte la stessa persona.

   La regola guarda SOLO i gestori che il doppione lo saltano davvero (quelli
   che contano `dup++` o `saltat*++` accanto a un `.some(`): dove i doppioni
   sono leciti — più letture dello stesso sensore, più rapportini nello stesso
   turno — non si pretende niente. E la difesa vale anche se sta nella funzione
   di lettura invece che nel gestore: è il caso dell'anagrafica di Scudo, dove
   `parseLavoratoriCsv` chiama la regola condivisa. Quello che non deve
   succedere è che non ci sia da nessuna parte delle due. */
function corpiImportazione(src) {
  const righe = src.split("\n");
  const fuori = [];
  for (let i = 0; i < righe.length; i++) {
    const m = /\$\("([\w-]*file)"\)\.onchange/.exec(righe[i]);
    if (!m) continue;
    const corpo = [];
    for (let k = i; k < Math.min(i + 45, righe.length); k++) {
      corpo.push(righe[k]);
      if (righe[k] === "  };") break;
    }
    fuori.push({ id: m[1], riga: i + 1, testo: corpo.join("\n") });
  }
  return fuori;
}
function dedupSoloInArchivio(src, modulo) {
  const fuori = [];
  for (const h of corpiImportazione(src)) {
    /* ⚠️ LE FORME SONO DUE, e la prima scrittura di questa regola ne guardava
       una sola. Quattro gestori — il registro infortuni e lo scadenzario di
       Scudo, il registro volate di Sentinella, i rilievi di Terra — il
       doppione lo saltano con un `Set` e una firma composta, non con `.some(`,
       e lo facevano BENE già prima del 31/07: la firma la aggiungono DENTRO il
       ciclo, che è esattamente la protezione che mancava agli altri dieci.
       Guardando solo `.some(` questa regola li avrebbe ignorati, e il giorno in
       cui a uno di loro sparisse l'`add` dal ciclo non se ne accorgerebbe
       nessuno. Lo stesso filtro sbagliato aveva già fatto sbagliare il
       censimento, che li aveva contati fra quelli «senza controllo». */
    /* ⚠️ L'`add` deve stare sulla STESSA variabile dell'`has`. La prima
       stesura si accontentava di `\w+\.add\(`, che è soddisfatto anche da
       `classList.add(` — cosa che in un gestore ci sta benissimo: la regola
       avrebbe visto «c'è un add» e non avrebbe più controllato se la firma
       finisce davvero nel Set. Misurato il 01/08: tutti e sette i gestori col
       Set aggiungono sulla variabile giusta, quindi il buco era **latente**.
       Si chiude lo stesso: è il filtro-che-non-guarda-dove-crede, e a questa
       regola quel difetto è già costato una svista. */
    const setUsati = [...new Set([...h.testo.matchAll(/(\w+)\.has\(/g)].map((m) => m[1]))];
    const conSet = setUsati.length > 0 && /(dup|saltat\w*)\+\+/.test(h.testo);
    if (conSet) {
      const aggiunge = setUsati.some((v) => new RegExp("\\b" + v + "\\.add\\(").test(h.testo));
      if (!aggiunge)
        fuori.push(`riga ${h.riga}: «${h.id}» tiene la firma in un Set ma non la aggiunge dentro il ciclo — i doppioni dentro il file passano`);
      continue;
    }
    const salta = /\.some\(/.test(h.testo) && /(dup|saltat\w*)\+\+/.test(h.testo);
    if (!salta) continue;                              // qui i doppioni sono leciti
    if (/senzaDoppioni\(/.test(h.testo)) continue;     // difesa nel gestore
    /* difesa nella funzione di lettura: si guarda IL CORPO di quella funzione,
       non tutto il modulo — «da qualche parte nel file» lascerebbe passare un
       lettore che non la chiama solo perché un altro la chiama. */
    const usata = /(parse\w*Csv)\s*\(/.exec(h.testo);
    if (usata && modulo) {
      const inizio = modulo.indexOf(`export function ${usata[1]}(`);
      if (inizio >= 0) {
        const dopo = modulo.indexOf("\nexport ", inizio + 1);
        const corpoFn = modulo.slice(inizio, dopo < 0 ? modulo.length : dopo);
        if (/senzaDoppioni\(/.test(corpoFn)) continue;
      }
    }
    fuori.push(`riga ${h.riga}: «${h.id}» salta i doppioni ma solo contro l'archivio — manca senzaDoppioni() di shared/`);
  }
  return fuori;
}
for (const [nome, rel] of SUPERFICI) {
  if (!/^apps\/(campo|conti|flotta|scudo|sentinella|terra)\/index\.html$/.test(rel)) continue;
  const src = leggi(rel);
  if (src === null) continue;
  const app = rel.split("/")[1];
  const modulo = leggi(`apps/${app}/${app}-data.js`);
  const casi = dedupSoloInArchivio(src, modulo);
  test(`${nome}: chi salta i doppioni li cerca anche dentro il file`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 12 sa vedere il difetto che è stato tolto", () => {
  /* Il gestore com'era davvero prima del 31/07, in tutte e sei le app. */
  const difetto = [
    '  $("squ-file").onchange = async (e) => {',
    '    const righe = parseSquadreCsv(await file.text());',
    '    let agg = 0, dup = 0;',
    '    for (const r of righe) {',
    '      if (SQU.some(q => q.nome === r.nome)) { dup++; continue; }',
    '      agg++;',
    '    }',
    '  };',
  ].join("\n");
  ok(dedupSoloInArchivio(difetto, null).length === 1, "il gestore di prima è una violazione");
  const corretto = difetto.replace(
    "const righe = parseSquadreCsv(await file.text());",
    "const righe = senzaDoppioni(parseSquadreCsv(await file.text()), x => x.nome);");
  ok(dedupSoloInArchivio(corretto, null).length === 0, "con la difesa nel gestore, no");
  const conModulo = "export function parseSquadreCsv(t) {\n  return senzaDoppioni(righe, x => x.nome);\n}\n";
  ok(dedupSoloInArchivio(difetto, conModulo).length === 0, "e nemmeno con la difesa dentro il lettore");
  /* la difesa dentro un ALTRO lettore non vale */
  const altroLettore = "export function parseAltroCsv(t) {\n  return senzaDoppioni(r, x => x.n);\n}\nexport function parseSquadreCsv(t) {\n  return r;\n}\n";
  ok(dedupSoloInArchivio(difetto, altroLettore).length === 1, "la difesa di un altro lettore non copre questo");
  /* un gestore che i doppioni li accetta di proposito non viene toccato */
  const lecito = '  $("mis-file").onchange = async (e) => {\n    const righe = parseLettureCsv(t);\n    for (const r of righe) await db.aggiungi("letture", r);\n  };';
  ok(dedupSoloInArchivio(lecito, null).length === 0, "dove i doppioni sono leciti non si pretende niente");
});
test("la regola 12 vede anche la forma col Set, non solo quella con .some()", () => {
  /* La forma vera dei quattro gestori che facevano già la cosa giusta. */
  const conSet = [
    '  $("inf-file").onchange = async (e) => {',
    '    const righe = parseInfortuniCsv(await file.text());',
    '    const gia = new Set(INF.map(firma));',
    '    let agg = 0, dup = 0;',
    '    for (const r of righe) {',
    '      if (gia.has(firma(r))) { dup++; continue; }',
    '      gia.add(firma(r));',
    '      agg++;',
    '    }',
    '  };',
  ].join("\n");
  ok(dedupSoloInArchivio(conSet, null).length === 0, "col Set aggiornato dentro il ciclo va bene");
  /* e adesso il difetto: la stessa forma, senza l'add. È il modo più facile di
     rompere quei quattro senza che nessuno se ne accorga — una riga tolta. */
  const senzaAdd = conSet.replace("      gia.add(firma(r));\n", "");
  ok(dedupSoloInArchivio(senzaAdd, null).length === 1, "senza l'add dentro il ciclo, è una violazione");
  /* l'add su un'ALTRA variabile non è la difesa: `classList.add(` non mette
     nessuna firma nel Set, ma ha la stessa forma */
  const addEstraneo = conSet.replace("      gia.add(firma(r));", "      riga.classList.add('nuova');");
  ok(dedupSoloInArchivio(addEstraneo, null).length === 1,
    "un add su una variabile diversa da quella del has non conta come difesa");
});

/* LA CONTROPROVA SUI FILE VERI, PER LA REGOLA 12.
   ────────────────────────────────────────────────────────────────────────
   Qui il difetto non si AGGIUNGE, si TOGLIE: quello che la regola deve vedere
   è l'assenza di una difesa. Si spegne la difesa nelle due forme in cui è
   scritta — `senzaDoppioni` di `shared/` e il `Set` aggiornato dentro il
   ciclo — e si pretende che le violazioni **aumentino** in ogni app.

   Perché proprio questa regola merita la controprova vera: il suo filtro è
   già caduto una volta, il 31/07. Cercava la forma `.some(` e non vedeva i
   gestori scritti col `Set` — cioè proprio quelli che facevano la cosa
   giusta. Una controprova sintetica non l'avrebbe mai detto: sull'esempio
   inventato la funzione andava benissimo. */
{
  const APP12 = ["campo", "conti", "flotta", "scudo", "sentinella", "terra"];
  let superfici = 0, ciecheDoppioni = 0, ciecheSet = 0, conSetVere = 0;
  const dove = [];
  for (const app of APP12) {
    const src = leggi(`apps/${app}/index.html`);
    const modulo = leggi(`apps/${app}/${app}-data.js`) || "";
    if (src === null) continue;
    superfici++;
    const base = dedupSoloInArchivio(src, modulo).length;
    // forma 1: si spegne senzaDoppioni() ovunque, pagina e modulo
    const spentaA = dedupSoloInArchivio(
      src.replace(/senzaDoppioni\(/g, "passaTutto("), modulo.replace(/senzaDoppioni\(/g, "passaTutto("));
    if (spentaA.length <= base) { ciecheDoppioni++; if (!dove.includes(app)) dove.push(app); }
    /* forma 2: si toglie l'add al Set — ma solo dove un gestore d'importazione
       la difesa col Set ce l'ha davvero. ⚠️ La prima stesura chiedeva
       `.has(` in TUTTA la pagina: Campo, Conti e Flotta ce l'hanno altrove e
       non hanno nessun importatore col Set, quindi la controprova pretendeva
       una violazione che non poteva esistere e li accusava. Il riconoscimento
       è quello della regola stessa, non un'approssimazione. */
    const conSet = corpiImportazione(src).some((h) =>
      /(\w+)\.has\(/.test(h.testo) && /(dup|saltat\w*)\+\+/.test(h.testo));
    if (conSet) {
      conSetVere++;
      const spentaB = dedupSoloInArchivio(src.replace(/(\w+)\.add\(/g, "$1.nonAggiunge("), modulo);
      if (spentaB.length <= base) { ciecheSet++; if (!dove.includes(app)) dove.push(app); }
    }
  }
  test(`regola 12: spenta la difesa nei file veri, la regola se ne accorge (${superfici} app)`, () => {
    ok(superfici === 6, `misurate ${superfici} app invece di 6`);
    ok(ciecheDoppioni === 0, `in ${dove.join(", ")} togliere senzaDoppioni() non ha prodotto nessuna violazione nuova`);
    ok(ciecheSet === 0, `in ${dove.join(", ")} togliere l'add al Set non ha prodotto nessuna violazione nuova`);
    ok(conSetVere === 3, `le app con un importatore che si difende col Set sono ${conSetVere}, me ne aspettavo 3 (Scudo, Sentinella, Terra)`);
    console.log(`     (6 app con senzaDoppioni spento, ${conSetVere} con la difesa col Set spenta)`);
  });
}



/* ── REGOLA 13: due esportazioni non scaricano lo stesso nome di file ──────
   Trovato per caso il 31/07 in Conti: due bottoni scaricavano tutti e due
   `conti_listino.csv`, ma uno era il LISTINO ri-caricabile e l'altro un
   prospetto coi prezzi già convertiti. Nella cartella dei download il
   secondo copre il primo — o peggio lo affianca come «conti_listino (1).csv»
   — e nessuno dei due dice quale sia quale. Chi poi prova a ri-caricare il
   file sbagliato si sente rispondere che non è valido, e conclude che è
   l'app a non funzionare.

   Il difetto non fa rumore: il file si scarica benissimo. E non lo trova
   nessuna prova sul comportamento, perché ogni export, preso da solo,
   funziona.

   ⚠️ Copre i nomi scritti come testo (`.download = "…"`). Un nome costruito a
   pezzi — con una data dentro, per esempio — qui non si vede: quando ne
   nascerà uno, la regola va allargata invece di essere aggirata. */
function nomiScaricatiRipetuti(src) {
  const conta = new Map();
  const re = /\.download = "([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const riga = src.slice(0, m.index).split("\n").length;
    const v = conta.get(m[1]) || [];
    v.push(riga);
    conta.set(m[1], v);
  }
  return [...conta].filter(([, righe]) => righe.length > 1)
    .map(([nome, righe]) => `«${nome}» scaricato da ${righe.length} esportazioni diverse (righe ${righe.join(", ")})`);
}
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  const casi = nomiScaricatiRipetuti(src);
  test(`${nome}: due esportazioni non scaricano lo stesso file`, () => {
    ok(casi.length === 0, `${rel}: ${casi.join("; ")}`);
  });
}
test("la regola 13 sa vedere il difetto che è stato tolto", () => {
  /* il caso vero di Conti, com'era prima della correzione */
  const difetto = 'a.download = "conti_listino.csv"; a.click();\n'
    + 'let csv = "nome;unita";\n'
    + 'a.download = "conti_listino.csv"; a.click();';
  ok(nomiScaricatiRipetuti(difetto).length === 1, "due export con lo stesso nome sono una violazione");
  ok(/righe 1, 3/.test(nomiScaricatiRipetuti(difetto)[0]), "e dice DOVE stanno tutte e due");
  const corretto = difetto.replace(/conti_listino\.csv"; a\.click\(\);$/, 'conti_listino_prezzi.csv"; a.click();');
  ok(nomiScaricatiRipetuti(corretto).length === 0, "con due nomi diversi, no");
  ok(nomiScaricatiRipetuti('a.download = "uno.csv";').length === 0, "una sola esportazione non è mai un doppione");
});

/* REGOLA 14 — LA NOTA DEL MODO NON È UNA LAVAGNA.
   ────────────────────────────────────────────────────────────────────────
   `mode-note` dice, per tutto il tempo che la pagina resta aperta, se si sta
   lavorando sui **dati veri dell'organizzazione**. Il 31/07 tre app ci
   scrivevano sopra l'esito delle esportazioni — nove punti in tutto: dal
   primo export in poi quella conferma non torna più. Un elemento solo con due
   mestieri, e ogni scrittura cancella l'altra.

   ⚠️ ONESTÀ SULLA GRAVITÀ, perché la prima lettura di questo difetto — la mia
   — era sbagliata in peggio. Avevo scritto che spariva l'avviso «stai
   guardando dati di esempio, nulla viene salvato». NON è così: quell'avviso è
   `tour-banner`, sta in cima, vive FUORI dalle pagine (quindi si vede da
   tutte) e nessuno lo tocca. Quello che sparisce è la conferma del modo
   **live**, che vale meno. La regola resta — un messaggio che ne cancella un
   altro è un difetto comunque — ma non va raccontata più grossa di quello che
   è. Chi legge un test si fida della ragione scritta accanto.

   La riga che INSTALLA la nota non è una violazione: è il suo scopo. Si
   riconosce perché è l'unica che LEGGE il modo — `db.mode` nelle sei app,
   `live()` nell'amministrazione, che un `db` non ce l'ha.

   ⚠️ La prima stesura guardava solo `db.mode` e aspettava sei superfici:
   l'amministrazione, che ne ha un settimo avviso installato in modo diverso,
   veniva accusata della propria installazione. L'ha fatto vedere il conto
   delle superfici guardate, non le violazioni — che infatti dicevano «una». */
function avvisoUsatoComeLavagna(src) {
  if (!/id="mode-note"/.test(src)) return [];   // superficie senza avviso: niente da dire
  const fuori = [];
  src.split("\n").forEach((riga, i) => {
    /* ⚠️ La prima stesura cercava solo `esito("mode-note"` e la scrittura
       diretta. In Campo l'id arrivava alla nota passando per `sbaglia(...)`,
       `bloccato(...)` e `clearErr(...)`: SETTE scritture indirette che la
       regola non vedeva, ed erano proprio quelle dei messaggi d'errore del
       form. Adesso guarda l'id ovunque compaia nel codice — l'unico posto
       dove `mode-note` ha diritto di stare è la riga che lo installa. */
    if (!/["']mode-note["']/.test(riga)) return;
    if (/<[^>]*\bid=["']mode-note["']/.test(riga)) return;   // è la dichiarazione del riquadro
    if (/\bdb\.mode\b|\blive\(\)/.test(riga)) return;   // è l'installazione dell'avviso
    fuori.push(`riga ${i + 1}: ${riga.trim().slice(0, 90)}`);
  });
  return fuori;
}
let conAvviso = 0;
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null || !/id="mode-note"/.test(src)) continue;
  conAvviso++;
  const casi = avvisoUsatoComeLavagna(src);
  test(`${nome}: la nota del modo non viene usata come lavagna`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} scritture lo cancellano → ${casi.join(" · ")}`);
  });
}
/* Quante superfici ha guardato davvero: un «zero violazioni» ottenuto non
   guardando nessuno è il difetto raccolto tre volte in CLAUDE.md. */
test("la regola 14 ha davvero guardato le superfici con la nota del modo", () => {
  ok(conAvviso === 7, `la nota del modo esiste in ${conAvviso} superfici, me ne aspettavo 7 (le sei app + l'amministrazione)`);
});
test("la regola 14 sa vedere il difetto che è stato tolto", () => {
  const base = '<div class="note" id="mode-note"></div>\n'
    + '$("mode-note").textContent = db.mode === "live" ? "Dati reali." : "Dati di esempio.";\n';
  ok(avvisoUsatoComeLavagna(base).length === 0, "la sola installazione non è una violazione");
  ok(avvisoUsatoComeLavagna(base + 'esito("mode-note", "Esportate 3 fatture.", "success");').length === 1,
    "un esito scritto sull'avviso è una violazione");
  ok(avvisoUsatoComeLavagna(base + '$("mode-note").textContent = "Esportati 3 incassi.";').length === 1,
    "e anche la scrittura diretta, che è il modo in cui il difetto si ripresenta");
  ok(avvisoUsatoComeLavagna('esito("mode-note", "x", "err");').length === 0,
    "una superficie senza avviso non ha niente da cancellare");
});

/* ══ REGOLA 15 · IL GIORNO DI CALENDARIO NON SI PRENDE IN UTC ═══════════
   `toISOString()` scrive sempre l'istante in **UTC**. Una data costruita in ora
   locale — `new Date()`, `new Date(anno, mese, 1)` — in Italia sta una o due
   ore avanti: mezzanotte del 1° maggio a Roma è ancora **le 22:00 del 30
   aprile** a Greenwich. Prenderne il giorno (o il mese, o l'ora) con
   `toISOString().slice(...)` sposta quindi il calendario.

   Misurato il 31/07 e costato tre cose vere (docs/RICERCA_GIORNO_LOCALE_202607.md):
   il grafico «ultimi 6 mesi» del core riempiva la barra scritta «mag» con la
   produzione di **aprile** — sempre, tutto l'anno, perché la chiave era UTC e
   l'etichetta locale; le scadenze delle fatture di Conti cadevano **un giorno
   prima**; e fra mezzanotte e le due — cioè durante il turno di notte — un
   rapportino veniva datato al giorno prima.

   ⚠️ NON tutti i `toISOString()` sono sbagliati, e una sostituzione in blocco
   avrebbe introdotto il difetto che si voleva togliere: `piuGiorni` di
   Sentinella e i due intervalli in `dw-ponti.js` costruiscono la data con
   `"T00:00:00Z"` e la spostano con `setUTCDate` — entrano in UTC ed escono in
   UTC, e sono coerenti. La regola quindi perdona la riga che porta un segno
   esplicito di UTC nelle vicinanze, e accusa solo chi mescola i due calendari. */
const SEGNO_UTC = /T00:00:00Z|Date\.UTC|setUTC|getUTC/;
function giornoInUtc(src) {
  const righe = src.split("\n");
  const fuori = [];
  righe.forEach((riga, i) => {
    // interessa solo chi ne PRENDE UN PEZZO: `toISOString()` intero (per un
    // campo tecnico o un log) non parla di calendario
    if (!/\.toISOString\(\)\s*\.slice\(/.test(riga)) return;
    if (/^\s*(\/\/|\*|\/\*)/.test(riga)) return;               // è un commento che lo spiega
    // il segno di UTC può stare sulla riga o nelle tre sopra, dove la data
    // viene costruita (`const g = new Date(x + "T00:00:00Z");`)
    const intorno = righe.slice(Math.max(0, i - 3), i + 1).join("\n");
    if (SEGNO_UTC.test(intorno)) return;
    fuori.push(`riga ${i + 1}: ${riga.trim().slice(0, 90)}`);
  });
  return fuori;
}
let guardateData = 0;
for (const [nome, rel] of [...SUPERFICI, ...MODULI]) {
  const src = leggi(rel);
  if (src === null || !/\.js$|\.html$/.test(rel)) continue;
  guardateData++;
  const casi = giornoInUtc(src);
  test(`${nome}: il giorno di calendario non viene preso in UTC`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} punti → ${casi.join(" · ")}`);
  });
}
/* Quanti file ha guardato davvero: un «zero violazioni» ottenuto non guardando
   nessuno è il difetto raccolto tre volte in CLAUDE.md. */
test("la regola 15 ha davvero guardato tutte le superfici e i moduli", () => {
  ok(guardateData === SUPERFICI.length + MODULI.length - 1,
     `guardati ${guardateData}, me ne aspettavo ${SUPERFICI.length + MODULI.length - 1} (tutti tranne il CSS del motore grafici)`);
});
test("la regola 15 distingue il giorno locale da quello UTC", () => {
  ok(giornoInUtc('const oggi = new Date().toISOString().slice(0, 10);').length === 1,
     "il giorno preso in UTC da una data locale è una violazione");
  ok(giornoInUtc('const mese = d.toISOString().slice(0, 7);').length === 1,
     "e anche il mese, che è la forma che spostava le barre del grafico");
  ok(giornoInUtc('const g = new Date(x + "T00:00:00Z");\ng.setUTCDate(g.getUTCDate() + 1);\nconst dal = g.toISOString().slice(0, 10);').length === 0,
     "una data costruita e spostata in UTC invece è coerente: non si tocca");
  ok(giornoInUtc('const ts = new Date().toISOString();').length === 0,
     "e un timbro tecnico intero non parla di calendario");
  ok(giornoInUtc('// prima qui c\'era new Date().toISOString().slice(0,10), che sbagliava').length === 0,
     "il commento che racconta il difetto non è il difetto");
});

/* ══ 16. DENTRO UN MODULO, LE MIGLIAIA SI RAGGRUPPANO PER SCRITTO ══════════
   Misurato il 02/08 affiancando i due motori: sui numeri di QUATTRO cifre
   Chromium scrive «6.375» e Node «6375» (strategia `min2`, che raggruppa solo
   da cinque cifre in su). Da cinque cifre in poi sono d'accordo.
   Le PAGINE non hanno questo problema: girano solo nel browser e sono coerenti
   fra loro. I MODULI sì: li importano tutt'e due — la pagina nel browser e le
   prove in Node — e una funzione che non fissa il raggruppamento restituisce
   due stringhe diverse a seconda di dove gira. Da lì una prova che passa in
   Node e fallirebbe nel browser, cioè che blinda una verità che l'utente non
   vede mai. È già successo: la prova sulla frase del tagliando affermava
   «6375 ore» mentre all'utente quella frase dice «6.375».
   `useGrouping: false` va benissimo: è una scelta scritta (e in `perCampo` è
   quella giusta — un punto delle migliaia dentro un campo rientrerebbe come
   numero ambiguo). Quello che non va bene è NON dirlo.
   docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md
   ─────────────────────────────────────────────────────────────────────── */
function migliaiaMute(src) {
  const fuori = [];
  const righe = senzaCommenti(src).split("\n");
  righe.forEach((riga, i) => {
    if (!/toLocaleString\(\s*["']it-IT["']/.test(riga)) return;
    /* la chiamata può continuare sulla riga dopo (l'oggetto delle opzioni
       scritto a capo): si guarda la riga e le due successive */
    const intorno = righe.slice(i, i + 3).join("\n");
    if (/useGrouping/.test(intorno)) return;
    fuori.push(`riga ${i + 1}`);
  });
  return fuori;
}
let guardatiMigliaia = 0;
for (const [nome, rel] of MODULI) {
  const src = leggi(rel);
  if (src === null || !/\.js$/.test(rel)) continue;
  guardatiMigliaia++;
  const casi = migliaiaMute(src);
  test(`${nome}: il raggruppamento delle migliaia è scritto, non lasciato al motore`, () => {
    ok(casi.length === 0, `${rel}: ${casi.length} punti → ${casi.join(" · ")}`);
  });
}
test("la regola 16 ha davvero guardato tutti i moduli", () => {
  const attesi = MODULI.filter(([, r]) => /\.js$/.test(r)).length;
  ok(guardatiMigliaia === attesi, `guardati ${guardatiMigliaia}, me ne aspettavo ${attesi}`);
});
test("la regola 16 distingue il raggruppamento scritto da quello taciuto", () => {
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { maximumFractionDigits: 2 });').length === 1,
     "senza useGrouping è una violazione");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { useGrouping: true });').length === 0,
     "scritto true va bene");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", { useGrouping: false });').length === 0,
     "e scritto false anche: è una scelta, purché sia scritta");
  ok(migliaiaMute('const s = n.toLocaleString("it-IT", {\n  maximumFractionDigits: 2,\n  useGrouping: true,\n});').length === 0,
     "l'oggetto delle opzioni scritto a capo si legge lo stesso");
  ok(migliaiaMute('// prima qui c\'era toLocaleString("it-IT") senza useGrouping').length === 0,
     "il commento che racconta il difetto non è il difetto");
});

console.log("\n── Regola 17: la struttura del core non si riscrive in casa ──");
/* LA STRUTTURA DEL CORE NON SI RISCRIVE IN CASA.
   Il 02/08 il toast, la modale, la conferma, la richiesta di un valore e la
   chiusura con Escape erano scritti SEI VOLTE, una per app: 27 copie, il 76%
   delle righe identico carattere per carattere. E una si era già staccata —
   `apriModale` di Scudo aveva un quarto parametro che le altre cinque non
   avevano, per una ragione buona. Adesso stanno in `shared/dw-app-ui.js`.

   Questa regola serve a che non tornino. Guarda due cose opposte, e la
   seconda è quella che ho già sbagliato una volta:
   (a) chi CARICA il file condiviso non deve ridefinirle — una copia locale
       vince sul globale e la superficie torna a divergere in silenzio;
   (b) chi le USA deve averle da qualche parte — o dal file condiviso, o da
       una copia propria dichiarata. Togliere le funzioni e dimenticare il
       `<script>` non dà nessun errore di sintassi: la pagina si apre, e il
       primo tocco che apre una modale muore con un ReferenceError.

   L'elenco `COPIA_PROPRIA` non è un permesso: è il conto di quanto lavoro
   resta, e deve accorciarsi. Se una superficie ne esce (è passata al
   condiviso) il controllo lo dice; se ne entra una nuova, fallisce. */
/* `go` è entrato il 03/08, il giorno dopo le altre cinque: era la SECONDA metà
   della struttura, sei copie in due versioni — cinque senza guardie e Flotta
   con guardie e mappa. Nella versione condivisa ci sono le guardie per tutti e
   la mappa come parametro. */
/* ⛔ E DAL 07/08 QUESTO ELENCO È DERIVATO, NON SCRITTO A MANO — perché scritto
   a mano ne aveva SEI e la struttura condivisa ne espone OTTO. Le due che
   mancavano (`avvisa`, `mostraTesto`) non erano una svista qualunque: lo stesso
   giorno si è scoperto che `chiediDati` — l'ottava — era stata cancellata dalle
   pagine dal commit 486011d (31/07) e **mai portata in `dw-app-ui.js`**, con
   sei chiamate rimaste orfane in Flotta per una settimana. Un elenco a mano non
   avrebbe potuto accorgersene: non sapeva nemmeno che quel nome esistesse.
   Adesso si legge da `window.X =` del file condiviso, cioè dalla stessa verità
   che il browser vede. Se domani ne nasce una nona, entra da sola. */
const UI_CONDIVISA = (() => {
  const src = leggi("shared/dw-app-ui.js");
  if (!src) return ["go", "toast", "apriModale", "chiudiModale", "chiedi", "chiediValore"];
  const vivo = mascheraCodice(src);
  const fuori = [];
  for (const m of src.matchAll(/\bwindow\.([\w$]+)\s*=/g)) if (vivo[m.index]) fuori.push(m[1]);
  return [...new Set(fuori)];
})();
const RE_UI_DEF = new RegExp(
  `\\b(?:function\\s+(?:${UI_CONDIVISA.join("|")})\\s*\\(`
  + `|(?:const|let|var)\\s+(?:${UI_CONDIVISA.join("|")})\\s*=\\s*(?:function\\b|\\(|async\\b))`, "g");
const RE_UI_USO = new RegExp(`\\b(?:${UI_CONDIVISA.join("|")})\\s*\\(`, "g");

function strutturaInCasa(src) {
  const vivo = mascheraCodice(src);   // `function toast(` dentro un modello di stampa non è una definizione
  const fuori = [];
  let m;
  RE_UI_DEF.lastIndex = 0;
  while ((m = RE_UI_DEF.exec(src)) !== null) {
    if (!vivo[m.index]) continue;
    const riga = src.slice(0, m.index).split("\n").length;
    fuori.push(`riga ${riga}: ${m[0].trim()}`);
  }
  return fuori;
}
function usaLaStruttura(src) {
  const vivo = mascheraCodice(src);
  let m;
  RE_UI_USO.lastIndex = 0;
  while ((m = RE_UI_USO.exec(src)) !== null) {
    if (!vivo[m.index]) continue;
    const prima = src.slice(Math.max(0, m.index - 3), m.index);
    if (/[.\w$]$/.test(prima)) continue;           // metodo di un oggetto, o nome più lungo
    return true;
  }
  return false;
}

/* Chi tiene ancora la sua copia, e perché. Misurato il 03/08, aggiornato il
   04/08 quando Genesi — l'ultima rimasta — è passata al condiviso.
   Resta **uno solo**, ed è l'originale. */
const COPIA_PROPRIA = {
  "index.html":
    "il core È l'originale — il file condiviso è stato estratto da qui — e il suo "
    + "toast dura di più quando è acceso il modo «all'aperto» (DB.settings.outdoor)",
};

let uiGuardate = 0, uiCondivise = 0;
const uiConCopia = [];
for (const [nome, rel] of SUPERFICI) {
  const src = leggi(rel);
  if (src === null) continue;
  uiGuardate++;
  /* ⚠️ Il caricamento si riconosce dal TAG, non dalla stringa: cercando
     `dw-app-ui.js` ovunque, un COMMENTO che la nomina bastava a far dire alla
     regola «questa pagina la carica». È successo il 03/08 sull'amministrazione
     di Deepwork ID: il commento c'era, il `<script>` no, e la regola diceva
     sette superfici quando erano sei. Il conto che sta lì apposta l'ha detto —
     ma diceva un numero TROPPO ALTO, cioè nella direzione che rassicura. */
  const carica = /<script[^>]+src=["'][^"']*dw-app-ui\.js["']/.test(src);
  const proprie = strutturaInCasa(src);
  if (carica) uiCondivise++;
  if (proprie.length) uiConCopia.push(rel);

  if (carica) {
    test(`${nome}: usa la struttura condivisa e non se la riscrive in casa`, () => {
      ok(proprie.length === 0,
        `${rel}: ${proprie.length} definizioni locali vincono sul file condiviso → ${proprie.join(" · ")}`);
    });
  } else if (usaLaStruttura(src)) {
    test(`${nome}: le funzioni che chiama esistono davvero`, () => {
      ok(proprie.length > 0,
        `${rel}: chiama toast/apriModale/… ma non carica dw-app-ui.js e non le definisce — `
        + "la pagina si apre e muore al primo tocco, senza errori di sintassi");
      ok(rel in COPIA_PROPRIA,
        `${rel} tiene una copia propria della struttura senza una ragione scritta: `
        + "o passa a shared/dw-app-ui.js, o la ragione va in COPIA_PROPRIA");
    });
  }
}
test("la regola 17 ha davvero guardato le superfici, e l'elenco delle copie è quello", () => {
  ok(uiGuardate === SUPERFICI.length,
    `guardate ${uiGuardate} superfici su ${SUPERFICI.length}`);
  ok(uiCondivise === 8, `le superfici che caricano il file condiviso sono ${uiCondivise}, me ne aspettavo 8`
     + " (le sei app, l'amministrazione di Deepwork ID entrata il 03/08, e Genesi il 04/08:"
     + " era l'ULTIMA a tenersi una copia in casa delle cinque funzioni)");
  const attese = Object.keys(COPIA_PROPRIA).sort().join(", ");
  ok(uiConCopia.sort().join(", ") === attese,
    `copie proprie trovate: [${uiConCopia.join(", ")}] · dichiarate: [${attese}]`);
});
test("la regola 17 distingue una definizione da un uso", () => {
  ok(strutturaInCasa("function toast(msg, tipo) {}").length === 1, "la funzione dichiarata è una copia");
  ok(strutturaInCasa("const chiedi = (t, c) => new Promise(r => r(1));").length === 1,
     "e anche la freccia: è così che l'ha scritta l'amministrazione");
  ok(strutturaInCasa("toast('Salvato.', 'success'); apriModale('x', 'y', []);").length === 0,
     "chiamarle non è ridefinirle");
  ok(strutturaInCasa('const t = "function toast(msg) { … }";').length === 0,
     "dentro una stringa non è codice");
  ok(strutturaInCasa('const toast = document.getElementById("toast");').length === 0,
     "una variabile che si chiama come la funzione non è la funzione");
  ok(usaLaStruttura("apriModale('Titolo', 'Corpo', []);") === true, "l'uso si vede");
  ok(usaLaStruttura("obj.toast(1);") === false, "il metodo di un oggetto non è la funzione globale");
  ok(usaLaStruttura("// qui una volta c'era toast('x')") === false, "e un commento nemmeno");
});

/* ⛔ L'ELENCO DERIVATO NON DEVE POTER RIACCORCIARSI IN SILENZIO. Fino al 07/08
   era scritto a mano e aveva SEI nomi mentre la struttura condivisa ne espone
   DIECI: fuori restavano `avvisa` (5 chiamate vere fra Conti e Flotta),
   `mostraTesto` (1 in Conti) e `chiediDati` (6 in Flotta) — dodici punti che la
   regola 17 non guardava. Se domani qualcuno rimettesse un elenco corto, o se
   `dw-app-ui.js` smettesse di appendere a `window`, la regola tornerebbe cieca
   **rispondendo verde**: questa prova è il collegamento che lo impedisce.
   ⚠️ Onestà su che cosa dimostra: il guadagno è **in avanti**, non su oggi. Le
   tre funzioni che mancavano sono chiamate solo da due pagine che il file
   condiviso lo caricano già, quindi oggi nessuna violazione nuova esce. Quello
   che cambia è che domani uscirebbe. */
test("regola 17: l'elenco della struttura condivisa è derivato e non si accorcia", () => {
  const src = leggi("shared/dw-app-ui.js");
  ok(src, "shared/dw-app-ui.js non trovato");
  ok(UI_CONDIVISA.length >= 8,
    `la struttura condivisa espone ${UI_CONDIVISA.length} nomi: l'elenco si è accorciato — `
    + `derivato da \`window.X =\`, oggi sono ${UI_CONDIVISA.join(", ")}`);
  for (const n of ["toast", "apriModale", "chiudiModale", "chiedi", "chiediValore",
                   "avvisa", "mostraTesto", "chiediDati"])
    ok(UI_CONDIVISA.includes(n),
      `\`${n}\` non è più esposto da dw-app-ui.js: o è stato tolto per sbaglio (è successo il 31/07 `
      + "proprio con `chiediDati`, e sei chiamate in Flotta sono rimaste orfane per una settimana), "
      + "oppure il cambiamento è voluto e va scritto qui");
});

/* ══ CONTROPROVE SUI FILE VERI, PER LE REGOLE CHE NE AVEVANO SOLO DI FINTE ══
   ────────────────────────────────────────────────────────────────────────
   La lezione del 01/08, pagata con la regola 1: **una controprova va misurata
   anche nella sua COPERTURA, non solo nel suo esito.** Le regole 11, 13 e 14
   dimostravano di saper fallire su tre righe inventate — non su una superficie
   da mezzo milione di caratteri, con template annidati, espressioni regolari e
   commenti dentro le stringhe. È precisamente la differenza che ha tenuto
   nascosto per settimane il buco della regola 1: la funzione, sul suo esempio,
   funzionava benissimo.

   Il difetto si rimette dove la scansione è più in difficoltà — cioè dove un
   template di primo livello si chiude, gli stessi punti che alla regola 1
   erano fatali. Non in fondo al file, che è il posto più facile. */
function puntiDifficili(src, quanti = 8) {
  const spie = [];
  classifica(src, spie);
  if (spie.length === 0) return [];
  const passo = Math.max(1, Math.floor(spie.length / quanti));
  const scelti = [];
  for (let i = 0; i < spie.length && scelti.length < quanti; i += passo) scelti.push(spie[i]);
  return scelti;
}
/* ⛔ `puntoBuono` — E SERVE, misurato il 03/08. Alcune regole guardano una
   FINESTRA attorno al difetto (la 10 chiede un `empty-sub` entro 500
   caratteri), quindi se l'iniezione cade appena prima di uno che c'è già, il
   difetto **è davvero innocuo lì**: non è la regola cieca, è l'iniezione che
   non inietta — la terza causa di «non distingue» in CLAUDE.md. Succedeva a 2
   punti su 8 nel core, e bastava che una modifica altrove spostasse gli
   offset perché il numero cambiasse: una controprova che dipende da dove
   cadono i campioni non misura la regola, misura la fortuna.
   Il punto scartato si CONTA e si stampa, se no si sarebbe barato: una
   controprova che scarta in silenzio i casi difficili è peggio di nessuna. */
function controprovaSuiVeri(etichetta, regola, veleno, ammessa = () => true,
                            puntoBuono = () => true) {
  let superfici = 0, punti = 0, cieche = 0, scartati = 0;
  const dove = [];
  for (const [, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null || !ammessa(src)) continue;
    const posti = puntiDifficili(src);
    if (posti.length === 0) continue;
    const v = typeof veleno === "function" ? veleno(src) : veleno;
    if (v === null) continue;
    superfici++;
    const base = regola(src).length;
    for (const p of posti) {
      if (!puntoBuono(src, p)) { scartati++; continue; }
      punti++;
      const rotto = src.slice(0, p) + v + src.slice(p);
      if (regola(rotto).length <= base) { cieche++; if (!dove.includes(rel)) dove.push(rel); }
    }
  }
  test(`${etichetta}: il difetto rimesso nei file veri viene visto (${superfici} superfici, ${punti} punti${scartati ? `, ${scartati} scartati perché lì il difetto sarebbe innocuo` : ""})`, () => {
    ok(superfici >= 3, `solo ${superfici} superfici hanno ricevuto l'iniezione: la controprova non sta coprendo niente`);
    ok(punti >= superfici * 4, `${punti} punti su ${superfici} superfici: troppi scartati, la controprova non copre più niente`);
    ok(cieche === 0, `${cieche} iniezioni su ${punti} non viste, in ${dove.join(", ")}`);
  });
}

/* regola 11: una forma dell'euro scritta in casa, come le tre vere del 30/07 */
controprovaSuiVeri("regola 11 (euro in casa)", euroInCasa,
  ';const eur = (v) => "€ " + v;');

/* regola 13: un secondo scarico con un nome di file che nella superficie
   esiste già — è esattamente il caso di Conti, due bottoni e un nome solo */
controprovaSuiVeri("regola 13 (due export, stesso nome)", nomiScaricatiRipetuti,
  (src) => {
    const m = src.match(/\.download = "([^"]+)"/);
    return m ? `;a.download = "${m[1]}";` : null;   // niente export: niente da duplicare
  });

/* regola 9: la copia locale della guardia sugli interi, esattamente com'era
   scritta in Terra prima del 31/07 — quella per cui «1.500» diventava «500» */
controprovaSuiVeri("regola 9 (guardia degli interi riscritta in casa)", guardieInCasa,
  ';el.addEventListener("beforeinput", (e) => { if (!e.data || !/[.,]/.test(e.data)) return; e.preventDefault(); el.value = ""; });');

/* regola 10: uno stato vuoto col solo titolo, come i tredici del core */
controprovaSuiVeri("regola 10 (stato vuoto muto)", vuotiSenzaSpiegazione,
  '<div class="empty-state"><div class="empty-title">Nessun mezzo da lavoro</div></div>',
  () => true,
  /* la regola guarda 500 caratteri in avanti: se lì un `empty-sub` c'è già,
     il difetto iniettato risulterebbe spiegato — e non per un buco della
     regola, ma perché in quel punto lo sarebbe davvero */
  (src, p) => !/empty-sub/.test(src.slice(p, p + 500)));

/* regola 15: il giorno preso da toISOString() su una data locale */
controprovaSuiVeri("regola 15 (il giorno di calendario preso in UTC)", giornoInUtc,
  ';const oggiFinto = new Date().toISOString().slice(0, 10);');

/* regola 14: un esito scritto sulla nota del modo */
controprovaSuiVeri("regola 14 (nota del modo come lavagna)", avvisoUsatoComeLavagna,
  ';esito("mode-note", "Esportate 3 fatture.", "success");',
  (src) => /id="mode-note"/.test(src));

/* regola 17: la copia locale del toast rimessa dentro, esattamente come stava
   in tutte e sei le app fino al 02/08 */
controprovaSuiVeri("regola 17 (struttura riscritta in casa)", strutturaInCasa,
  ';function toast(msg, tipo) { const t = document.getElementById("toast"); if (t) t.textContent = msg; }');

/* ── REGOLA 18 · una mappa di stati copre tutti gli stati ─────────────
   Le coppie sono dichiarate a mano perché sono poche e perché indovinarle
   automaticamente vorrebbe dire indovinare male: qui si vuole sapere che
   QUESTA funzione alimenta QUELLA mappa. */
const COPPIE_STATO = [
  { funzione: "statoScadenzaHSE", modulo: "shared/dw-ponti.js",
    pagina: "apps/scudo/index.html", mappa: "B",
    perche: "il semaforo dello scadenzario di Scudo (badge e striscia)" },
  { funzione: "statoScadenzaTerra", modulo: "apps/terra/terra-data.js",
    pagina: "apps/terra/index.html", mappa: "SB",
    perche: "il semaforo dello scadenzario di Terra" },
  { funzione: "statoConformitaQuota", modulo: "apps/terra/terra-data.js",
    pagina: "apps/terra/index.html", mappa: "CQ",
    perche: "il semaforo della conformità alla quota di fondo, in cima al Piano di Terra" },
  /* Aggiunte il 02/08 con le decisioni 13 e 14 del fondatore, e sono
     esattamente il caso che la regola 18 esiste per prendere: due funzioni di
     stato hanno imparato una risposta in più nello stesso giorno.
     · `esitoAbilitazione` è passata da tre risposte a quattro («non-so»): se
       `ESITO_MAT` ne avesse tenute tre, `ESITO_MAT[a.esito][2]` sarebbe stato
       `undefined[2]` — la pagina morta AL DISEGNO, e leggendo il codice non si
       vede. La funzione è stata scorporata da `abilitazioneLavoratore` apposta:
       dentro un ternario lungo le risposte non stanno in dei `return`, e questa
       regola non le saprebbe leggere.
     · `DPI_BADGE` disegna lo stato di una CONSEGNA, che per la data di
       sostituzione è quello di `statoScadenzaHSE`: dal 02/08 una consegna
       senza data risponde «senza data», e al suo posto c'era un «altrimenti»
       che scriveva «In scadenza» su un dispositivo che una data non ce l'ha.
       Non è una pagina morta: è una bugia disegnata — peggio, perché nessuno
       la nota. */
  { funzione: "esitoAbilitazione", modulo: "apps/scudo/scudo-data.js",
    pagina: "apps/scudo/index.html", mappa: "ESITO_MAT",
    perche: "le pastiglie della matrice «chi può fare cosa» di Scudo" },
  { funzione: "statoScadenzaHSE", modulo: "shared/dw-ponti.js",
    pagina: "apps/scudo/index.html", mappa: "DPI_BADGE",
    perche: "l'etichetta al maschile del dispositivo nel registro DPI di Scudo" },
  /* ⚠️ QUI LA MAPPA STA NEL MODULO, NON NELLA PAGINA — ed è il disegno giusto
     (regola 7: la frase la decide un posto solo, e il report la ri-usa in due
     schermate). Il controllo non cambia: sempre «le risposte di QUESTA
     funzione stanno tutte in QUELLA mappa». Aggiunta il 02/08 con la decisione
     16, che a `esitoPunto` ha fatto guadagnare la quarta risposta
     («senza-soglia»): `ESITI` ne aveva tre, e la pagina ha un ripiego
     `|| ESITI["senza-dati"]` — quindi non sarebbe morta, avrebbe scritto
     «Senza dati» su un punto con vent letture. Un difetto muto, che è peggio. */
  { funzione: "esitoPunto", modulo: "apps/sentinella/sentinella-data.js",
    pagina: "apps/sentinella/sentinella-data.js", mappa: "ESITI",
    perche: "l'esito del report di conformità, quello che va all'ente" },
];
/* ⚠️ Due letture sbagliate al primo colpo, e le controprove le hanno viste
   subito — vale la pena scriverle perché sono la stessa famiglia:
   1. le risposte cercate come `return "..."` perdevano quelle dentro un
      TERNARIO (`return g <= pre ? "in-scadenza" : "a-posto"`), cioè metà di
      quelle di Terra. Adesso si prende l'intera istruzione `return …;` e si
      raccolgono TUTTE le stringhe che contiene;
   2. le chiavi della mappa pretendevano una virgola o una graffa davanti, e
      così la PRIMA chiave — quella subito dopo `const B = {` a capo — non
      veniva mai vista: il controllo diceva che mancava «scaduta», che c'era. */
function statiRestituiti(src, nome) {
  const i = src.indexOf(`export function ${nome}(`);
  if (i < 0) return null;
  const fine = src.indexOf("\n}", i);
  const corpo = src.slice(i, fine < 0 ? src.length : fine);
  const stati = [];
  for (const r of corpo.matchAll(/return[^;]*;/g))
    for (const s of r[0].matchAll(/"([^"]+)"/g)) stati.push(s[1]);
  return [...new Set(stati)];
}
function chiaviMappa(src, nome) {
  const i = src.indexOf(`const ${nome} = {`);
  if (i < 0) return null;
  const fine = src.indexOf("};", i);
  const corpo = src.slice(i + `const ${nome} = {`.length, fine < 0 ? src.length : fine);
  return [...new Set([...corpo.matchAll(/(?:^|[,{\s])\s*(?:"([^"]+)"|([A-Za-z_$][\w$]*))\s*:/g)]
    .map((m) => m[1] || m[2]))];
}
function mappeIncomplete() {
  const out = [];
  for (const c of COPPIE_STATO) {
    const stati = statiRestituiti(leggi(c.modulo), c.funzione);
    const chiavi = chiaviMappa(leggi(c.pagina), c.mappa);
    if (!stati || !stati.length) { out.push(`${c.modulo}: non trovo le risposte di ${c.funzione}()`); continue; }
    if (!chiavi || !chiavi.length) { out.push(`${c.pagina}: non trovo la mappa ${c.mappa}`); continue; }
    for (const s of stati)
      if (!chiavi.includes(s))
        out.push(`${c.pagina}: la mappa ${c.mappa} non ha «${s}», che ${c.funzione}() sa restituire`
          + ` — ${c.perche}: la pagina morirebbe al disegno`);
  }
  return out;
}
test("regola 18: ogni mappa di stati copre tutte le risposte della sua funzione", () => {
  const v = mappeIncomplete();
  ok(v.length === 0, v.join("\n      "));
});
/* Quante coppie ha davvero guardato: un «zero violazioni» ottenuto non
   leggendo niente è il difetto raccolto tre volte in CLAUDE.md. */
test("regola 18: ha davvero letto le coppie funzione↔mappa", () => {
  let viste = 0;
  for (const c of COPPIE_STATO) {
    const stati = statiRestituiti(leggi(c.modulo), c.funzione);
    const chiavi = chiaviMappa(leggi(c.pagina), c.mappa);
    if (stati && stati.length >= 3 && chiavi && chiavi.length >= 3) viste++;
  }
  ok(viste === COPPIE_STATO.length,
    `${viste} coppie lette su ${COPPIE_STATO.length}: il controllo non sta guardando quello che crede`);
});

/* ────────────────────────────────────────────────────────────────────────
   REGOLA 19 — LA BARRA IN BASSO HA TANTE COLONNE QUANTE VOCI
   ────────────────────────────────────────────────────────────────────────
   `.nav` è una griglia a colonne fisse: `repeat(var(--nav-cols),1fr)`. Una
   voce in più senza il numero aggiornato non stringe la barra, la manda a
   capo — e la voce che finisce sotto è invisibile e non toccabile.
   Due direzioni, e la seconda è la più insidiosa: se `--nav-cols` MANCA, non
   manca davvero — vale il 5 di `shared/deepwork-style.css`, quindi una app da
   sei voci ne perde una senza aver scritto niente di sbagliato. */
function barraNav(html) {
  // il blocco <nav class="nav" …> … </nav>, se c'è
  const m = html.match(/<nav[^>]*class="[^"]*\bnav\b[^"]*"[^>]*>([\s\S]*?)<\/nav>/);
  if (!m) return null;
  const voci = [...m[1].matchAll(/<button[^>]*\bid="nav-[^"]*"/g)].length;
  if (!voci) return null;
  const dic = html.match(/--nav-cols\s*:\s*(\d+)/);
  return { voci, colonne: dic ? +dic[1] : null };
}
function barreSbagliate() {
  const out = [];
  for (const [nome, file] of SUPERFICI) {
    const b = barraNav(leggi(file));
    if (!b) continue;
    if (b.colonne == null)
      out.push(`${nome} (${file}): la barra ha ${b.voci} voci e NON dichiara --nav-cols`
        + ` — vale il 5 di shared/deepwork-style.css, quindi ${b.voci > 5 ? b.voci - 5 + " voci finiscono" : "le voci finiscono"} a capo`);
    else if (b.colonne !== b.voci)
      out.push(`${nome} (${file}): la barra ha ${b.voci} voci ma --nav-cols dice ${b.colonne}`
        + ` — ${b.colonne < b.voci ? `${b.voci - b.colonne} voce/i va/nno A CAPO, sotto la barra` : "restano colonne vuote"}`);
  }
  return out;
}
test("regola 19: ogni barra ha tante colonne quante voci", () => {
  const v = barreSbagliate();
  ok(v.length === 0, v.join("\n      "));
});
/* Quante barre ha davvero guardato. Un «zero violazioni» ottenuto su zero
   soggetti è il difetto raccolto tre volte in CLAUDE.md — e qui è facilissimo
   da prendere, perché basta che il markup della barra cambi di una virgola e
   l'espressione non aggancia più niente, restando verde. */
test("regola 19: ha davvero trovato le barre delle sei app", () => {
  const con = SUPERFICI.map(([n, f]) => [n, barraNav(leggi(f))]).filter(([, b]) => b);
  ok(con.length === 6,
    `barre trovate: ${con.length} (${con.map(([n]) => n).join(", ")}) — attese 6, una per app verticale`);
  const totale = con.reduce((t, [, b]) => t + b.voci, 0);
  ok(totale >= 30, `voci di navigazione lette in tutto: ${totale}, troppe poche perché il controllo stia guardando davvero`);
});
/* ⚠️ LA CONTROPROVA STA QUI DENTRO, E NON TOCCA NESSUN FILE.
   La prima volta l'ho fatta a mano — `sed` sul file vero, controllo, `sed`
   indietro — mentre nell'altra finestra girava il giro del browser: cioè
   esattamente la cosa che `impronta.mjs` esiste per impedire, e che avrebbe
   invalidato un giro da mezz'ora. È andata bene per pochi secondi, il che è
   peggio che andare male, perché non insegna niente.
   La regola prende il TESTO, non un percorso: quindi il difetto si rimette
   nella stringa, in memoria, e la controprova diventa permanente invece di
   vivere in una sessione di terminale. È lo stesso principio dei banchi del
   browser, che iniettano nella risposta HTTP e mai nel file. */
test("regola 19: la controprova — la barra col numero indietro viene vista", () => {
  const vero = leggi("apps/conti/index.html");
  const b = barraNav(vero);
  ok(b && b.voci >= 7, `serve una barra vera con almeno 7 voci per provarci: ${JSON.stringify(b)}`);

  // difetto 1, quello successo davvero: il numero rimasto indietro di uno
  const indietro = barraNav(vero.replace(`--nav-cols:${b.voci};`, `--nav-cols:${b.voci - 1};`));
  ok(indietro && indietro.colonne === b.voci - 1,
    "l'iniezione non ha agganciato niente: la controprova non prova niente");
  ok(indietro.voci !== indietro.colonne, "col numero indietro la regola DEVE vedere la differenza");

  // difetto 2: la dichiarazione tolta del tutto — non manca, vale 5
  const senza = barraNav(vero.replace(/--nav-cols\s*:\s*\d+/g, "--nav-cols-tolta:0"));
  ok(senza && senza.colonne === null, "senza dichiarazione la regola deve accorgersene, non dare per buono");

  // difetto 3: il controllo CIECO — la barra che non si aggancia più
  const cieca = barraNav(vero.replace(/<nav([^>]*)class="([^"]*)\bnav\b([^"]*)"/, '<nav$1class="$2barra-bassa$3"'));
  ok(cieca === null, "cambiando la classe la regola deve smettere di vedere la barra (e allora è il conteggio dei soggetti a doverlo dire)");
});

/* ────────────────────────────────────────────────────────────────────────
   REGOLA 20 — UNA NON-MISURABILITÀ DICHIARATA VA LETTA DALLA PAGINA
   ────────────────────────────────────────────────────────────────────────
   Il principio del fondatore reso verificabile. Il modulo che non può
   misurare qualcosa lo dichiara con una bandiera accanto al numero; se la
   pagina non la legge, disegna il numero tranquillo lo stesso — e il modulo
   sembra a posto, perché la dichiarazione c'è. Guardia scollegata.
   ⚠️ La ricerca è a TESTO MASCHERATO, non a testo. La prima stesura di questo
   controllo, fatta a mano fuori dalla suite, ha accusato due funzioni sane
   perché leggeva `/* backend assente: demo *​/` come una dichiarazione. */
/* ⛔ IL VOCABOLARIO È CORTO DI PROPOSITO, e le parole escluse contano quanto
   quelle dentro. Ci stanno solo i nomi che in questo codice vogliono dire
   SEMPRE E SOLO «si è potuto misurare?». Sono state provate e buttate fuori:
   · `misurato` — in `scartoPpvVolata` è il VALORE misurato, gemello di
     `previsto`. Non è una bandiera, è un numero: la prima stesura di questa
     regola ci si è impigliata e ha accusato una funzione sana.
   · `assente`, `mai` — in Campo e Sentinella sono STATI (`stato: "mai"`) o
     variabili locali, non proprietà che dichiarano una non-misurabilità.
   Una parola ambigua non rende la regola più severa: la rende rumorosa, e una
   regola rumorosa si spegne. */
const BANDIERE = ["misurabile", "leggibile", "calcolabile", "noto",
                  "attendibile", "pochi"];
/* Le posizioni di `bandiera:` che stanno DAVVERO nel codice — non in un
   commento, non dentro una stringa. `mascheraCodice` è lo scanner del file,
   quello con la sua prova dedicata: qui non se ne scrive un secondo.
   ⛔ **E LA DICHIARAZIONE HA DUE FORME, non una.** Fino al 03/08 si cercava
   solo `bandiera:`, e Genesi la sua la scrive nell'altro modo — `const
   misurabile = reg.length > 0;` e poi la scorciatoia ES6 `{ …, misurabile }`
   nell'oggetto che torna. Misurato: con la sola forma coi due punti, Genesi
   risultava dichiarare **zero** bandiere, e le sue occorrenze finivano contate
   fra le LETTURE. Cioè per quell'app la regola non poteva scattare mai, in
   nessun caso — la forma peggiore di guardia scollegata, perché tace.
   Adesso conta anche `const|let|var bandiera =`, che è senza ambiguità.
   ⚠️ Quello che ancora NON si distingue, e va detto invece di lasciarlo
   credere: la **scorciatoia dentro l'oggetto** (`{ foriReg, misurabile }`) ha
   la stessa forma di una destrutturazione (`const { misurabile } = r`), che
   invece è una lettura vera. Separarle vorrebbe dire leggere la grammatica, e
   una regola che sbaglia verso l'allarme si spegne (CLAUDE.md, «un allarme che
   sbaglia tre volte su quattro insegna a non guardarlo»). Il costo di questa
   scelta è preciso: un'app che dichiarasse **solo** con la scorciatoia e non
   leggesse mai scivolerebbe via. Oggi nessuna è in quella forma — le sette
   dichiarano tutte o coi due punti o con `const`, ed è misurato dalla prova
   sulla copertura qui sotto. */
const dichiarazioniDi = (b) =>
  [new RegExp("\\b" + b + "\\s*:", "g"),
   new RegExp("\\b(?:const|let|var)\\s+" + b + "\\s*=", "g")];
function bandiereDichiarate(testo) {
  const vivo = mascheraCodice(testo);
  const out = new Set();
  for (const b of BANDIERE)
    for (const re of dichiarazioniDi(b))
      for (const m of testo.matchAll(re))
        if (vivo[m.index + m[0].indexOf(b)]) { out.add(b); break; }
  return out;
}
/* Quante volte la bandiera compare come LETTURA e non come dichiarazione:
   `r.misurabile`, `{ misurabile }`, `if (!o.noto)`. Cioè tutte le occorrenze
   nel codice vivo, meno quelle seguite dai due punti.
   ⚠️ Si guarda il modulo INSIEME alla pagina, e non è una concessione: una
   bandiera può essere consumata **dentro il modulo stesso**, ed è il disegno
   giusto. `origineDi` restituisce `noto`, e chi decide la frase è
   `descriviOrigine` — la pagina non deve sapere niente di `noto`, se no la
   provenienza sarebbe decisa in due posti (regola 7). La seconda stesura di
   questo controllo pretendeva la lettura nella PAGINA e accusava proprio il
   codice fatto bene. */
function bandiereLette(testi) {
  const out = new Set();
  for (const b of BANDIERE) {
    let letture = 0;
    for (const t of testi) {
      const vivo = mascheraCodice(t);
      /* ⚠️ Si tolgono le DUE forme della dichiarazione, non una: `bandiera:` e
         `const bandiera =`. Contare la seconda come lettura era il difetto
         gemello di quello di `bandiereDichiarate` — la bandiera di Genesi
         risultava letta dal suo stesso `const`, cioè da nessuno. */
      for (const m of t.matchAll(new RegExp("(\\b(?:const|let|var)\\s+)?\\b" + b + "\\b\\s*([:=]?)", "g"))) {
        const dove = m.index + (m[1] ? m[1].length : 0);
        if (vivo[dove] && m[2] !== ":" && !(m[1] && m[2] === "=")) letture++;
      }
    }
    if (letture) out.add(b);
  }
  return out;
}
/* ⛔ QUESTO ELENCO ERA SCRITTO A MANO — `["campo","conti","flotta","scudo",
   "sentinella","terra"]` — e la pagina la costruiva per CONVENZIONE, con
   `apps/<app>/index.html`. GENESI NE RESTAVA FUORI, e non per una decisione:
   la sua pagina si chiama `genesi.html`, quindi la convenzione non la trovava
   e il nome non compariva nell'elenco. Effetto misurato il 03/08, correggendo
   cinque numeri tranquilli in Genesi: il modulo ha guadagnato la bandiera
   `misurabile`, la pagina la legge, e la regola 20 **non stava guardando
   nessuna delle due** — cioè la guardia che esiste per prendere le guardie
   scollegate era essa stessa scollegata dall'unica app con la pagina fuori
   convenzione. È la stessa forma dell'elenco `SUPERFICI` aggiornato a memoria,
   con in più il fatto che qui non mancava una riga: mancava un'app intera.
   Adesso i moduli si DERIVANO da `MODULI` e le pagine da `SUPERFICI` — i due
   elenchi che hanno già il controllo che li confronta col disco — e la prova
   qui sotto pretende che ogni modulo `<app>-data.js` sul disco sia coperto.
   ⚠️ E scrivendo questo commento ci sono ricascato: il percorso con la stella
   contiene i due caratteri che CHIUDONO un commento, quindi la riga finiva a
   metà nel codice. È la trappola già raccolta in `sintassi-pagine.mjs`. */
const MODULI_APP = MODULI
  .filter(([, rel]) => /^apps\/[^/]+\/[^/]+-data\.js$/.test(rel))
  .map(([, rel]) => [rel.split("/")[1], rel]);
/* Tutte le pagine dell'app, non una per convenzione: Genesi ne ha tre in
   `SUPERFICI` (la home, il portone, il visore nuvola). Una bandiera letta in
   una qualunque di esse è collegata. */
const pagineDi = (app) =>
  SUPERFICI.filter(([, rel]) => rel.startsWith(`apps/${app}/`)).map(([, rel]) => rel);
/* ⚠️ PRENDE IL TESTO, NON IL PERCORSO. Una controprova che per provarci deve
   scrivere in un file tracciato è scritta male: il 01/08 una di queste ha
   girato con `sed` sul modulo vero mentre nell'altra finestra c'era un giro
   del browser, cioè esattamente ciò che `impronta.mjs` esiste per impedire. */
function scollegateIn(dove, mod, ...pagine) {
  const dich = bandiereDichiarate(mod);
  const lette = bandiereLette([mod, ...pagine]);
  return [...dich].filter((b) => !lette.has(b)).map((b) =>
    `${dove} dichiara «${b}» e nessuno la legge mai`
    + " — né la pagina né il modulo: il numero si disegna tranquillo e la"
    + " dichiarazione non protegge niente");
}
function bandiereScollegate() {
  return MODULI_APP.flatMap(([app, rel]) =>
    scollegateIn(rel, leggi(rel), ...pagineDi(app).map(leggi)));
}
test("regola 20: ogni non-misurabilità dichiarata è letta da qualcuno", () => {
  const v = bandiereScollegate();
  ok(v.length === 0, v.join("\n      "));
});
/* Quanti soggetti ha guardato davvero. Se le bandiere trovate fossero zero, la
   regola risponderebbe «nessuna violazione» senza aver letto niente — il
   difetto raccolto tre volte in CLAUDE.md. */
/* ⚠️ E QUI VA DETTA LA COPERTURA VERA, non lasciata intendere dallo zero.
   ⛔ **LA RIGA CHE C'ERA QUI ERA FALSA, ed è stata rimisurata il 03/08.**
   Diceva «le app che usano questo vocabolario sono TRE su sei: Conti, Scudo e
   Terra; Campo e Sentinella lo dicono in un altro modo e Flotta non lo dichiara
   affatto». Contate: sono **sette su sette**, per **18** bandiere distinte —
   Campo ne dichiara tre (`misurabile`, `leggibile`, `attendibile`) e Flotta
   due (`misurabile`, `pochi`). Era una dichiarazione di copertura scritta una
   volta e mai più rimessa alla prova, cioè la stessa cosa contro cui esiste
   `documenti-invecchiati.mjs`, dentro un file di test. Adesso i numeri li
   stampa la prova, e la prosa dice solo quello che i numeri non dicono.
   Quello che resta vero della riga vecchia: «nessuna violazione» NON vuol dire
   «tutte le app sono a posto». Vuol dire che le bandiere **esistenti** sono
   attaccate a qualcosa; una non-misurabilità che nessuno ha mai dichiarato
   questa regola non la può vedere. */
test("regola 20: ha davvero trovato le bandiere, e dichiara su quante app", () => {
  const per = MODULI_APP.map(([app, rel]) => [app, bandiereDichiarate(leggi(rel))]);
  const totale = per.reduce((t, [, s]) => t + s.size, 0);
  const conAlmenoUna = per.filter(([, s]) => s.size).length;
  ok(totale >= 16,
    `bandiere distinte trovate: ${totale}, troppe poche perché il controllo stia guardando davvero`
    + ` — ${per.map(([a, s]) => `${a}:${s.size}`).join(" ")}`);
  ok(conAlmenoUna >= 6,
    `app che dichiarano una non-misurabilità: ${conAlmenoUna} su ${MODULI_APP.length}`
    + ` — ${per.map(([a, s]) => `${a}:${s.size}`).join(" ")}`);
});
/* ⛔ E IL CONTROLLO CHE AVREBBE PRESO GENESI: nessun modulo dati sul disco può
   restare fuori. Prima l'elenco era scritto a mano, quindi un'app fuori
   convenzione non faceva rumore — la regola rispondeva «nessuna violazione»
   dopo aver guardato sei moduli su sette, che è il difetto del «controllo che
   non guarda dove crede» raccolto tre volte in CLAUDE.md.
   Pretende anche che ogni app abbia almeno una pagina in `SUPERFICI`: senza,
   `bandiereLette` leggerebbe il solo modulo e una bandiera consumata dalla
   pagina risulterebbe scollegata — un allarme falso, che è il modo più veloce
   di far spegnere una regola. */
test("regola 20: nessun modulo dati resta fuori, e ognuno ha la sua pagina", () => {
  const sulDisco = readdirSync(join(root, "apps"))
    .filter((d) => existsSync(join(root, `apps/${d}/${d}-data.js`)))
    .map((d) => [d, `apps/${d}/${d}-data.js`]);
  const coperti = new Set(MODULI_APP.map(([, rel]) => rel));
  const fuori = sulDisco.filter(([, rel]) => !coperti.has(rel)).map(([, rel]) => rel);
  ok(fuori.length === 0,
    `moduli dati che la regola 20 non guarda: ${fuori.join(", ")}`
    + " — vanno aggiunti a MODULI, che è l'elenco col controllo sul disco");
  const senzaPagina = MODULI_APP.filter(([app]) => pagineDi(app).length === 0).map(([app]) => app);
  ok(senzaPagina.length === 0,
    `app senza nemmeno una pagina in SUPERFICI: ${senzaPagina.join(", ")}`
    + " — la regola leggerebbe il solo modulo e accuserebbe le bandiere sane");
  ok(sulDisco.length >= 7,
    `moduli dati trovati sul disco: ${sulDisco.length} — troppo pochi perché la scansione stia guardando davvero`);
});
/* ⚠️ LA CONTROPROVA, E NON TOCCA NESSUN FILE — due direzioni opposte, perché
   questa regola può sbagliare in tutt'e due i versi. */
test("regola 20: la controprova — vede la dichiarazione scollegata, non il commento", () => {
  const mod = leggi("apps/terra/terra-data.js");
  const pag = leggi("apps/terra/index.html");

  // 1. IL DIFETTO VERO: una bandiera nuova dichiarata nel codice e mai letta.
  //    `attendibile` oggi non la usa nessuno: è il caso pulito.
  const conDifetto = mod.replace("export function divarioRecupero",
    "export function _finta(){ return { attendibile: false }; }\nexport function divarioRecupero");
  ok(conDifetto !== mod, "l'iniezione non ha agganciato niente: la controprova non prova niente");
  ok(bandiereDichiarate(conDifetto).has("attendibile"),
    "la regola DEVE vedere una bandiera dichiarata nel codice vivo");
  ok(!bandiereLette([conDifetto, pag]).has("attendibile"),
    "e DEVE vedere che nessuno la legge: né il modulo col difetto, né la pagina");
  //    …e soprattutto: la REGOLA, non solo i suoi pezzi, deve segnalarlo.
  ok(scollegateIn("apps/terra/terra-data.js", conDifetto, pag).length === 1,
    "la regola intera deve produrre esattamente una segnalazione sul difetto iniettato: "
    + JSON.stringify(scollegateIn("apps/terra/terra-data.js", conDifetto, pag)));
  ok(scollegateIn("apps/terra/terra-data.js", mod, pag).length === 0,
    "e nessuna sul file vero: se ne desse anche senza difetto, non starebbe distinguendo");

  // 2. IL FALSO POSITIVO che questa regola ha davvero prodotto, il 01/08:
  //    la stessa parola dentro un COMMENTO non è una dichiarazione.
  const soloCommento = mod.replace("export function divarioRecupero",
    "/* nota: qui il backend è attendibile: sempre */\nexport function divarioRecupero");
  ok(soloCommento !== mod, "la seconda iniezione non ha agganciato niente");
  ok(!bandiereDichiarate(soloCommento).has("attendibile"),
    "un commento NON è una dichiarazione: è l'errore che ha fatto nascere questa regola");

  // 3. E nemmeno dentro una stringa mostrata all'utente.
  const soloStringa = mod.replace("export function divarioRecupero",
    'export function _finta2(){ return "il dato non è attendibile: manca la misura"; }\nexport function divarioRecupero');
  ok(soloStringa !== mod, "la terza iniezione non ha agganciato niente");
  ok(!bandiereDichiarate(soloStringa).has("attendibile"),
    "una parola dentro una stringa non è una dichiarazione");

  // 4. E il verso opposto, che è la trappola numero 3 di CLAUDE.md — un
  //    controllo che non sa RIABILITARSI segnala per sempre, e allora lo si
  //    spegne. Aggiunta la lettura, la bandiera non è più scollegata.
  const conLettura = conDifetto.replace("export function divarioRecupero",
    "export function _legge(o){ return o.attendibile ? 1 : 0; }\nexport function divarioRecupero");
  ok(scollegateIn("apps/terra/terra-data.js", conLettura, pag).length === 0,
    "una lettura vera DEVE far sparire la segnalazione: se no la regola non distingue niente");
});

/* ⛔ LA CONTROPROVA CHE RIGUARDA GENESI, e c'è perché la regola per un mese
   intero **non l'ha guardata**: sapeva fallire su Terra e su nessuno sapeva
   dire se guardasse tutte le app. «Sapere fallire in un punto non dimostra
   niente sugli altri mille» — CLAUDE.md, sui template annidati. */
test("regola 20: guarda DAVVERO Genesi, che la convenzione vecchia perdeva", () => {
  const mod = leggi("apps/genesi/genesi-data.js");
  const pagine = pagineDi("genesi").map(leggi);
  // 1. la vecchia convenzione: `apps/genesi/index.html` NON ESISTE. È il
  //    motivo per cui Genesi non era nell'elenco, e non si vedeva.
  ok(leggi("apps/genesi/index.html") === null,
    "se un giorno nascesse `apps/genesi/index.html` questa riga va riscritta: oggi la sua assenza È la causa del buco");
  ok(pagine.length >= 1 && pagine.every((t) => t !== null),
    `le pagine di Genesi devono esserci e leggersi: ${JSON.stringify(pagineDi("genesi"))}`);
  // 2. la bandiera c'è, ed è quella nata il 03/08 correggendo i numeri tranquilli.
  ok(bandiereDichiarate(mod).has("misurabile"),
    "Genesi deve dichiarare «misurabile»: se sparisse, questa controprova va rifatta su un'altra bandiera");
  // 3. e la regola, sul file vero, tace.
  ok(scollegateIn("apps/genesi/genesi-data.js", mod, ...pagine).length === 0,
    "sul file vero non deve segnalare niente");
  // 4. tolte TUTTE le letture — quelle della pagina e quelle del modulo — e
  //    lasciata in piedi la sola dichiarazione, la regola DEVE segnalare.
  //    ⚠️ La dichiarazione va risparmiata a mano: è `const misurabile = …`, e
  //    una sostituzione a tappeto la porterebbe via insieme alle letture,
  //    lasciando un file senza niente da segnalare. È la terza causa di «non
  //    distingue» di CLAUDE.md — l'iniezione che non inietta.
  let tolteMod = 0;
  const modCieco = mod.replace(/\bmisurabile\b/g, (m, i) => {
    if (/(?:const|let|var)\s+$/.test(mod.slice(Math.max(0, i - 12), i))) return m;
    tolteMod++; return "_spenta";
  });
  let toltePag = 0;
  const cieche = pagine.map((t) => t.replace(/\bmisurabile\b/g, () => { toltePag++; return "_spenta"; }));
  ok(tolteMod >= 4 && toltePag >= 5,
    `l'iniezione deve togliere letture vere: ${tolteMod} nel modulo, ${toltePag} nelle pagine`);
  ok(bandiereDichiarate(modCieco).has("misurabile"),
    "e DEVE lasciare in piedi la dichiarazione, se no non c'è niente da segnalare");
  const solaDich = scollegateIn("apps/genesi/genesi-data.js", modCieco, ...cieche);
  ok(solaDich.length === 1,
    "tolte le letture, la bandiera di Genesi deve risultare scollegata: " + JSON.stringify(solaDich));
});

/* ═══ REGOLA 24 — UN GRADIENTE CHE DIPINGE DELLE CIFRE HA IL SUO CONTO ACCANTO ═══
   Nata il 03/08 da un difetto vero in Conti: il cartellone di cassa ritaglia il
   gradiente sulle lettere (`background-clip:text`), e la fermata BASSA è quella
   che tinge il basso delle cifre. Nello stato «grave» quella fermata era
   `#a32b27` su fondo quasi nero — **2,17:1** misurato, sotto il 3:1 che la WCAG
   chiede al testo grande. Cioè il numero meno leggibile della pagina era
   proprio quello che compare quando c'è un problema.
   Perché era passato: `--grad-num` porta accanto il suo conto scritto a mano,
   gli altri no, e infatti l'unico controllato era quello.

   ⛔ E PERCHÉ STA QUI E NON NEL BANCO DEL BROWSER, che pure misura il contrasto
   di tutto: il banco vede solo gli stati che la DIMOSTRAZIONE produce. Lo stato
   «grave» del cartellone c'era per caso; se i dati d'esempio fossero stati un
   po' più sereni, quel 2,17:1 non l'avrebbe visto nessuno. Questa regola legge
   il CSS, quindi guarda **tutti** gli stati, anche quelli che nessuna
   dimostrazione mette in scena.

   ⚠️ E il suo limite è dichiarato, non sottinteso: guarda i blocchi che portano
   il ritaglio CON SÉ. Se un'app scrivesse `background:var(--grad3)` in una
   regola che eredita il ritaglio da una regola base, questa non la vedrebbe.
   Oggi non succede — censite le sette superfici, i gradienti messi come fondo
   fuori da un blocco col ritaglio dipingono barre, avatar e bottoni, mai
   lettere — e la prova qui sotto conta quante superfici ha davvero guardato,
   così il giorno che il numero scende si vede. */
const _lumHex = (hex) => {
  const n = hex.replace("#", "");
  const c = n.length === 3 ? [...n].map((x) => x + x) : n.match(/../g) || [];
  const [r, g, b] = c.map((x) => parseInt(x, 16));
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const _rapporto = (a, b) => {
  const L1 = Math.max(_lumHex(a), _lumHex(b)), L2 = Math.min(_lumHex(a), _lumHex(b));
  return Math.round((L1 + 0.05) / (L2 + 0.05) * 100) / 100;
};
/* Il fondo su cui poggiano le cifre: la scheda, e se non c'è lo sfondo della
   pagina. È il fondo PIÙ CHIARO dei due, cioè il caso peggiore per un testo
   chiaro — la stessa scelta prudente del banco del contrasto. */
/* ⛔ UN COLORE DENTRO UNA FUNZIONE NON È UNA FERMATA, e fino al 07/08 questa
   regola lo credeva. Prendeva OGNI `#hex` che comparisse nel corpo del
   gradiente, quindi in
     linear-gradient(135deg, var(--num-ok), color-mix(in srgb, var(--ink-ok) 70%, #000))
   leggeva una sola fermata, `#000`, e la giudicava contro la scheda scura:
   **«--grad-ok (#000) fa 1.25:1»**, cioè accusava di illeggibilità un
   gradiente in cui il nero è solo il secondo ingrediente di una miscela, e su
   una superficie — il tema chiaro — in cui quel gradiente nemmeno si applica.
   Tre accuse false in un colpo, su una palette che il banco del contrasto
   misurava a zero violazioni nei tre temi: è esattamente il danno che
   l'intestazione di `contrasto.mjs` racconta («un KO va verificato come un
   OK»), qui prodotto da un controllo statico.
   La cura è togliere i gruppi fra parentesi PIÙ INTERNI finché non ce ne sono
   più: quello che resta sono le fermate scritte per davvero.
   ⚠️ E il limite che ne segue va detto invece che scoperto: un gradiente
   scritto TUTTO con `color-mix()` — come sono quelli dei temi chiari in
   `shared/dw-app-ui.css` — non ha nessuna fermata in esadecimale, quindi
   questa regola non lo giudica. Non è scoperto: quei gradienti li misura
   `tests/browser/contrasto.mjs` con `--tema=chiaro` e `--tema=sole`, sul
   renderizzato, che è anche l'unico posto in cui si può sapere su quale fondo
   finiscono. Qui resta il caso che il browser NON vede: gli stati che la
   dimostrazione non mette mai in scena. */
const _senzaParentesi = (s) => {
  let p = s, prima;
  do { prima = p; p = p.replace(/\([^()]*\)/g, ""); } while (p !== prima);
  return p;
};
/* ⛔ LO STESSO NOME DI GRADIENTE PUÒ VALERE DUE COLORI, SU DUE FONDI OPPOSTI.
   Questa funzione teneva UNA mappa, `grad[nome]`, e UN fondo, il `--card` del
   `:root`. Reggeva finché ogni app aveva una palette sola. Il 07/08 Conti ha
   dato ai suoi gradienti un valore per il giorno (`body.dw.light-mode,
   body.dw.outdoor-mode`, dove il `--card` è **bianco**), e la regola ha fatto
   due cose sbagliate insieme: ha tenuto solo l'ULTIMA dichiarazione — quella
   di giorno — e l'ha misurata contro la scheda **del buio**. Tre accuse false
   (`--grad-sup` 1,82:1, `--grad-wr` 1,91, `--grad3` 1,87) su una palette che
   `tests/browser/contrasto.mjs` misura a **zero** violazioni in tutti e tre i
   temi. È il danno che l'intestazione di quel banco racconta — «un KO va
   verificato come un OK» — prodotto da un controllo statico.
   ⚠️ E il difetto peggiore era il secondo, quello che ASSOLVE: bastava che
   Conti scrivesse la fermata di giorno con un `color-mix()` perché la mappa
   piatta mettesse `[]` sopra la voce di NOTTE, e i tre gradienti del buio
   sparissero dai giudicati senza che niente diventasse rosso. Cioè la stessa
   svista poteva far accusare un colore sano o smettere di guardare quello
   vero, a seconda di come lo si scriveva.
   Adesso ogni dichiarazione porta con sé il tema del blocco che la contiene e
   viene giudicata contro il fondo di QUEL tema; un gradiente dichiarato in
   tutt'e due i posti si giudica due volte, perché sono due colori diversi. E
   i due temi vogliono la risposta in versi opposti: di notte è la fermata
   BASSA a essere la peggiore, di giorno quella ALTA — `_rapporto` è simmetrico
   e `Math.min` prende comunque la peggiore, ma il messaggio deve dirlo giusto,
   se no manda a muovere il colore sbagliato.
   ⚠️ Il fondo di giorno: se l'app non se lo scrive vale `#ffffff`, che è
   quello che `shared/dw-app-ui.css` dà a ogni app sia in `light-mode` sia in
   `outdoor-mode`. Scritto qui invece che dedotto, così il giorno che quel
   foglio cambiasse si sa dove guardare. */
/* ⛔ «CARICA I TRE TEMI?» SI CHIEDE IN UN POSTO SOLO. La regola 24 (qui) e la
   regola 27 (in fondo) sono nate a un'ora di distanza, in due cantieri che non
   si parlavano, e si erano scritte la stessa riga con la stessa lezione dentro
   — «il caricamento, non la menzione», perché il core nomina `dw-tema.js` in
   due commenti che spiegano di NON caricarlo. Due copie uguali oggi divergono
   domani senza che nessuno lo veda: sta scritta una volta.
   ⚠️ È una `function` e non una `const` apposta: le dichiarazioni si issano, e
   la regola 27 sta seicento righe più giù. */
function caricaTemi(src) {
  return /<script[^>]*src\s*=\s*["'][^"']*dw-tema\.js["']/.test(src);
}
const _FONDO_GIORNO = "#ffffff";
function _cifreRitagliate(testo) {
  /* si spezza in blocchi tenendo il SELETTORE: è lui a dire in che tema vive
     la dichiarazione, ed è esattamente quello che la mappa piatta buttava via */
  const blocchi = testo.split("}").map((pezzo) => {
    const i = pezzo.indexOf("{");
    return i < 0 ? { sel: "", corpo: pezzo } : { sel: pezzo.slice(0, i), corpo: pezzo.slice(i + 1) };
  });
  const temaDi = (sel) => (/light-mode|outdoor-mode/i.test(sel) ? "giorno" : "notte");
  /* ⛔ PRIMA PASSATA: LE TINTE SCRITTE COME VARIABILE. Fino al 07/08 una
     fermata scritta `var(--warn-ink)` era invisibile a questa regola — legge
     `#hex` e basta — quindi bastava dare un nome a un colore perché smettesse
     di essere giudicato, in silenzio. È la seconda domanda: «se il difetto
     stesse un piano più sotto, scritto come variabile invece che a mano,
     questo controllo lo direbbe?». Rispondeva no. Adesso le variabili che
     valgono un colore nudo si risolvono, per tema, col ripiego sul `:root`. */
  const tinte = { notte: {}, giorno: {} };
  for (const { sel, corpo } of blocchi)
    for (const m of corpo.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-f]{3,6})\s*(?:;|$)/gi))
      tinte[temaDi(sel)][m[1]] = m[2];
  const risolvi = (testoGrad, tema) => testoGrad.replace(/var\((--[\w-]+)\)/g,
    (tutto, nome) => tinte[tema][nome] || tinte.notte[nome] || tutto);
  const grad = { notte: {}, giorno: {} };
  const fondi = { notte: null, giorno: null };
  for (const { sel, corpo } of blocchi) {
    const tema = temaDi(sel);
    for (const m of corpo.matchAll(/(--[\w-]*grad[\w-]*)\s*:\s*linear-gradient\(([^;]*)\)/gi))
      grad[tema][m[1]] = _senzaParentesi(risolvi(m[2], tema)).match(/#[0-9a-f]{3,6}/gi) || [];
    for (const n of ["--card", "--bg"]) {
      const m = corpo.match(new RegExp(n.replace(/-/g, "\\-") + "\\s*:\\s*(#[0-9a-f]{3,6})", "i"));
      if (m && !fondi[tema]) fondi[tema] = m[1];
    }
  }
  if (!fondi.giorno) fondi.giorno = _FONDO_GIORNO;
  /* ⛔ E IL GIORNO SI GIUDICA SOLO DOVE IL GIORNO SI PUÒ ACCENDERE. Il core ha
     un blocco `body.outdoor-mode` che è **codice morto dichiarato**: non carica
     `shared/dw-tema.js`, ha un suo `applyTheme()` che quella classe la toglie a
     ogni giro, e il commento sopra il blocco lo dice («qui dentro non c'è
     niente da correggere, perché niente di qui dentro si vede», con la prova in
     `run-kpi.mjs`). Senza questa riga la separazione fra i temi accusa quel
     blocco a 2,29:1 — un colore che nessuno vede, su una superficie che non
     è nemmeno il soggetto di questa regola: cioè manda a rovinare la palette
     del core per un difetto del righello, che è precisamente il danno da cui
     l'intestazione di `contrasto.mjs` mette in guardia.
     Il criterio non è il nome della superficie ma il fatto verificabile: chi
     accende i tre temi è `dw-tema.js`, e chi non lo CARICA non li ha.
     ⚠️ E si guarda il TAG, non il nome: il core la stringa `shared/dw-tema.js`
     ce l'ha due volte, in due commenti che spiegano di NON caricarlo — cercarla
     a testo dà la risposta esattamente rovesciata. È la terza volta che i
     commenti si fanno prendere per codice in questo file. */
  if (!caricaTemi(testo)) fondi.giorno = null;
  const usate = new Set();
  for (const { corpo } of blocchi) {
    if (!/background-clip\s*:\s*text/i.test(corpo)) continue;
    for (const m of corpo.matchAll(/var\((--[\w-]+)\)/g)) usate.add(m[1]);
  }
  const voci = [];
  for (const tema of ["notte", "giorno"]) {
    if (!fondi[tema]) continue;
    for (const v of usate) {
      const f = grad[tema][v];
      if (!f || !f.length) continue;
      voci.push({ nome: v, tema, fondo: fondi[tema], fermate: f,
                  peggio: Math.min(...f.map((x) => _rapporto(x, fondi[tema]))) });
    }
  }
  return { fondo: fondi.notte, voci };
}
const SOGLIA_CIFRE = 3;   // WCAG 1.4.3 per il testo grande: queste tinte dipingono solo numeri da 30 px in su

test("regola 24: nessun gradiente dipinge cifre sotto il 3:1", () => {
  const male = [];
  for (const [nome, rel] of SUPERFICI) {
    const { fondo, voci } = _cifreRitagliate(leggi(rel));
    if (!fondo) continue;
    for (const v of voci)
      if (v.peggio !== null && v.peggio < SOGLIA_CIFRE)
        male.push(`${nome}: ${v.nome} di ${v.tema} (${v.fermate.join(" → ")}) fa ${v.peggio}:1 su ${v.fondo}`
          + ` — ${v.tema === "notte" ? "la fermata BASSA è quella da ALZARE" : "la fermata ALTA è quella da ABBASSARE"}`);
  }
  ok(male.length === 0,
    "gradienti che dipingono cifre sotto il 3:1:\n  " + male.join("\n  "));
});

test("regola 24: dichiara su quante superfici ha davvero guardato", () => {
  let conSoggetti = 0, soggetti = 0, diGiorno = 0;
  for (const [, rel] of SUPERFICI) {
    const { fondo, voci } = _cifreRitagliate(leggi(rel));
    if (!fondo || !voci.length) continue;
    conSoggetti++; soggetti += voci.length;
    diGiorno += voci.filter((v) => v.tema === "giorno").length;
  }
  /* Il numero è la difesa contro il «nessuna violazione» di un controllo che
     non ha guardato niente: se un giorno scende, o è sparito un ritaglio o è
     cambiata la forma con cui si scrivono i gradienti. */
  ok(conSoggetti >= 5 && soggetti >= 12,
    `la regola 24 ha guardato solo ${soggetti} gradienti su ${conSoggetti} superfici: troppo pochi, non sta guardando dove crede`);
  /* ⛔ E IL CONTO DI GIORNO VA CHIESTO A PARTE, se no la metà nuova può essere
     morta senza che niente diventi rosso: è la guardia scollegata, cioè la
     stessa forma per cui il conto qui sopra esiste. Oggi le palette di giorno
     scritte con fermate vere sono quelle di Conti; il giorno che sparissero,
     questa riga lo dice invece di lasciare la funzione a girare a vuoto. */
  ok(diGiorno > 0,
    "nessun gradiente di GIORNO fra i giudicati: la metà che distingue i due temi non sta guardando niente");
});

/* ⚠️ LA CONTROPROVA DELLA CORREZIONE, nei DUE versi — se no si sarebbe
   scambiata un'accusa falsa per una regola che tace. Verso uno: il colore
   dentro `color-mix` non deve più contare come fermata. Verso due: una
   fermata VERA, scritta accanto a un `color-mix`, deve continuare a contare —
   se no la correzione avrebbe reso cieca la regola invece di raddrizzarla, e
   il suo «nessuna violazione» non varrebbe più niente. */
test("regola 24: un colore dentro color-mix() non è una fermata (e una vera sì)", () => {
  const conMix = ":root{--grad-x:linear-gradient(135deg,var(--a),color-mix(in srgb,var(--b) 70%,#000));}"
    + ".z{background:var(--grad-x); -webkit-background-clip:text}"
    + ":root{--card:#131e29}";
  const misto = _cifreRitagliate(conMix);
  ok(misto.voci.length === 0,
    `un gradiente fatto solo di funzioni non ha fermate leggibili e non si giudica, invece: ${JSON.stringify(misto.voci)}`);
  /* la stessa forma, ma con una fermata bassa VERA e illeggibile in mezzo */
  const conVera = conMix.replace("linear-gradient(135deg,var(--a),color-mix(in srgb,var(--b) 70%,#000))",
    "linear-gradient(135deg,var(--a),#1a1f26,color-mix(in srgb,var(--b) 70%,#000))");
  ok(conVera !== conMix, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const vera = _cifreRitagliate(conVera);
  ok(vera.voci.length === 1 && vera.voci[0].fermate.join(",") === "#1a1f26",
    `la fermata vera va vista, e da sola (il #000 della miscela non è una fermata): ${JSON.stringify(vera.voci)}`);
  ok(vera.voci[0].peggio < SOGLIA_CIFRE, "e va bocciata, se no la correzione ha spento la regola");
});

test("regola 24: la controprova — una fermata bassa scurita viene vista", () => {
  const sano = leggi("apps/conti/index.html");
  const prima = _cifreRitagliate(sano);
  ok(prima.voci.every((v) => v.peggio >= SOGLIA_CIFRE), "Conti dev'essere sano prima di guastarlo");
  /* si rimette ESATTAMENTE il difetto che c'era: la fermata bassa di --grad3 */
  const guasto = sano.replace("#f05f5a,#cc4a44", "#f05f5a,#a32b27");
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const dopo = _cifreRitagliate(guasto);
  const bocciati = dopo.voci.filter((v) => v.peggio < SOGLIA_CIFRE);
  ok(bocciati.length === 1 && bocciati[0].nome === "--grad3" && bocciati[0].tema === "notte",
    `col difetto rimesso la regola deve vedere il --grad3 DI NOTTE e basta, ha visto: ${JSON.stringify(bocciati)}`);
});

/* ⛔ E LA CONTROPROVA DELL'ALTRA METÀ, che è quella nuova e quindi quella non
   provata da niente. Di giorno il difetto ha il verso opposto — non una
   fermata bassa troppo scura sul nero, ma una fermata ALTA troppo chiara sul
   bianco — e va rimesso dov'è, cioè nel blocco `light-mode/outdoor-mode`. Se
   questa passasse senza vedere niente, la separazione fra i due temi sarebbe
   decorativa: la mappa `giorno` esisterebbe e non giudicherebbe mai. */
test("regola 24: la controprova di giorno — una fermata alta schiarita viene vista", () => {
  const sano = leggi("apps/conti/index.html");
  /* si schiarisce la fermata ALTA del rosso di giorno fin sopra la soglia: è
     il difetto vero di quel tema, nel verso in cui capita davvero — una tinta
     nata per il nero lasciata accesa sul bianco */
  const guasto = sano.replace("linear-gradient(135deg,#e8524c,#a73b37)",
                              "linear-gradient(135deg,#f5a29f,#a73b37)");
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const dopo = _cifreRitagliate(guasto).voci.filter((v) => v.peggio < SOGLIA_CIFRE);
  ok(dopo.length === 1 && dopo[0].tema === "giorno",
    `schiarendo l'inchiostro di giorno la regola deve bocciare una voce DI GIORNO, ha visto: ${JSON.stringify(dopo)}`);
});

/* ═══ REGOLA 25 — UN ELEMENTO FISSO E INVISIBILE NON DEVE MANGIARE I TOCCHI ═══
   Il 03/08, nel core, `.toast` era `opacity:0` ma **`visibility:visible` e
   `pointer-events:auto`**, `position:fixed` a 80 px dal fondo e largo fino al
   90% dello schermo. Cioè una striscia invisibile, sempre presente, sopra i
   comandi: misurati **6 comandi coperti su 137**, fra cui **due bottoni di
   esportazione**, e Playwright ha ritentato un click per 30 secondi senza
   arrivarci.
   ⛔ E l'inversione che rende la regola necessaria: la versione GIUSTA era già
   in `shared/dw-app-ui.css`, che si presenta come «toast (copia del core)». Le
   sei app stavano bene; era **l'originale** a essere rotto. Di solito è la
   copia a divergere — qui la copia era migliore, e nessuno l'aveva riportato
   indietro. Un difetto così non si vede leggendo il codice: si è trovato
   perché un bottone non si lasciava premere.

   La regola: se una regola CSS mette insieme `position:fixed` e `opacity:0`,
   deve anche togliersi di mezzo — `pointer-events:none`, `visibility:hidden` o
   `display:none`. Uno qualunque dei tre basta: sono tre modi di dire la stessa
   cosa al motore che decide chi riceve il tocco.
   ⚠️ Il limite, dichiarato: guarda le regole che portano `opacity:0` **nel
   proprio blocco**. Un elemento reso invisibile da un'altra regola o da
   JavaScript non lo vede — per quello serve il browser, e infatti il difetto
   originale l'ha trovato un banco che premeva i bottoni. */
function _blocchiCss(testo) {
  /* solo il CSS: dentro `<style>` per le pagine, tutto il file per i `.css` */
  const pezzi = /<style/i.test(testo)
    ? [...testo.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1])
    : [testo];
  const out = [];
  for (const p of pezzi)
    for (const m of p.matchAll(/([^{}@]+)\{([^{}]*)\}/g))
      out.push({ sel: m[1].trim().split("\n").pop().trim(), corpo: m[2] });
  return out;
}
const NEUTRALIZZA = /pointer-events\s*:\s*none|visibility\s*:\s*hidden|display\s*:\s*none/;

test("regola 25: niente elementi fissi e invisibili che restano cliccabili", () => {
  const male = [];
  let guardati = 0;
  for (const [nome, rel] of [...SUPERFICI, ["foglio condiviso", "shared/dw-app-ui.css"],
                             ["stile condiviso", "shared/deepwork-style.css"]]) {
    let testo;
    try { testo = leggi(rel); } catch { continue; }
    for (const b of _blocchiCss(testo)) {
      if (!/position\s*:\s*fixed/.test(b.corpo)) continue;
      if (!/opacity\s*:\s*0(?![.\d])/.test(b.corpo)) continue;
      guardati++;
      if (!NEUTRALIZZA.test(b.corpo)) male.push(`${nome}: «${b.sel}» è fissa e a opacità zero ma resta cliccabile`);
    }
  }
  ok(guardati >= 1, "nessuna regola fissa-e-invisibile trovata: il controllo non sta guardando dove crede");
  ok(male.length === 0,
    "elementi invisibili che possono mangiare i tocchi — basta uno fra `pointer-events:none`, "
    + "`visibility:hidden`, `display:none`:\n  " + male.join("\n  "));
});

test("regola 25: la controprova — tolta la guardia al toast del core, la regola lo vede", () => {
  const sano = leggi("index.html");
  /* si rimette ESATTAMENTE il difetto del 03/08 */
  const guasto = sano.replace("opacity:0;pointer-events:none;transition:all .3s;z-index:999;",
                              "opacity:0;transition:all .3s;z-index:999;");
  ok(guasto !== sano, "l'iniezione non ha sostituito niente: la prova non prova niente");
  const visti = _blocchiCss(guasto).filter((b) =>
    /position\s*:\s*fixed/.test(b.corpo) && /opacity\s*:\s*0(?![.\d])/.test(b.corpo) && !NEUTRALIZZA.test(b.corpo));
  ok(visti.length >= 1 && visti.some((b) => /\.toast/.test(b.sel)),
    `col difetto rimesso la regola deve vedere il toast, ha visto: ${JSON.stringify(visti.map((b) => b.sel))}`);
});

/* ═══ REGOLA 26 — I DATI DI RIFERIMENTO DEL FONDATORE NON ESCONO MAI ═══
   La regola ferrea di CLAUDE.md (25/07, «nessuna eccezione») dice che i dati
   che il fondatore diede all'inizio erano SOLO orientativi, per far capire i
   video che stava mostrando: si possono usare per i calcoli e le calibrazioni,
   ma non devono comparire in interfaccia, nei testi, negli export o nei
   documenti dell'app.
   ⛔ FINO AL 06/08 QUELLA REGOLA VIVEVA SOLO IN PROSA, e quel giorno si è visto
   che era già violata: `riassegnaSequenzaAuto` del core ripiegava su un
   `|| 25` scritto nel codice — cioè il ritardo di quella origine — e lo
   scriveva dentro `f.ritardo` di ogni foro, da dove finiva **disegnato sulla
   sequenza**. Nessuno l'aveva notato perché non c'era niente da leggere: una
   costante in una riga di calcolo non si annuncia. È la stessa lezione delle
   altre venticinque: *una regola scritta è affidata alla memoria di chi legge.*

   COSA GUARDA, e perché proprio questo. Si cercano le forme **riconoscibili**
   di quei dati, quelle che non possono nascere per caso in un'app di cave:
   il nome commerciale del sistema d'innesco, la maglia con le sue due misure
   attaccate, l'archivio dei video col suo numero, il conto delle volate
   misurate. Non si cerca il numero 25 da solo, né «15-20», perché sarebbero
   allarmi continui su valori legittimi — e un allarme che sbaglia tre volte su
   quattro insegna a non guardarlo (misurato il 01/08 sui «non c'è» scaduti).
   ⚠️ IL LIMITE, DICHIARATO: questa regola prende le CITAZIONI, non gli usi
   travestiti. Il `|| 25` che l'ha fatta nascere **lei non lo vedrebbe** — a
   trovarlo è stato leggere il codice. Serve a impedire che quei dati entrino
   nei testi e negli export, che è il caso che il fondatore ha vietato per
   nome; non a dimostrare che non ci siano più costanti derivate da lì.

   ⚠️ E SI GUARDA `senzaCommenti`, NON IL FILE CRUDO: i valori vietati stanno
   dentro le stringhe (testi, etichette, export), quindi il tokenizzatore
   giusto è quello che toglie i commenti e TIENE il resto. Il crudo farebbe
   cadere la regola sul commento che la spiega — è già successo alla regola 6,
   e sta scritto in CLAUDE.md. */
/* ⛔ E LA PRIMA STESURA DI QUESTA LISTA HA ACCUSATO UN INNOCENTE, al primo
   giro, il 06/08. Ci avevo messo `\bnonel\b`, perché la regola ferrea nomina
   «Nonel 25 ms»; la regola ha subito segnalato `apps/genesi/genesi.html:1247`,
   `innesco:'nonel'`. Aprendo la riga: **non è una citazione, è un catalogo**.
   `INNESCHI` elenca quattro sistemi d'innesco veri — Nonel a tubo d'urto,
   elettronico, elettrico, miccia detonante — ognuno con tipo, dispersione,
   comportamento in acqua, pro e contro; e la serie di ritardi del Nonel è
   scritta lì per esteso: `17/25/42/65/100 ms`, che è **la serie standard di
   quel sistema**, non un numero che ci ha dato qualcuno.
   Quindi «Nonel» e «25 ms» sono **anche** termini del mestiere, e un'app di
   volate che non li nominasse sarebbe monca. Il divieto del fondatore riguarda
   la *citazione della sua origine*, non il vocabolario del settore — e una
   regola che non sa distinguere i due manda ad aprire un cantiere per togliere
   una cosa giusta. È il costo della direzione che accusa, misurato su me
   stesso: qui restano solo le forme che **non possono nascere per caso**.
   ⚠️ Stessa ragione per cui `calcare` non è in lista: il calcare è una roccia,
   e Genesi deve poterla offrire. Vietato è dichiararlo «dominio di validità»
   del modello, che è una frase, non una parola. */
const VIETATI = [
  [/\b4[.,]5\s*[x×]\s*3[.,]5\b|\b3[.,]5\s*[x×]\s*4[.,]5\b/i, "la maglia di quell'origine"],
  [/\b190\s*(video|filmat)/i, "l'archivio dei video"],
  [/\b6\s*\/\s*23\s*volate\b|\b6\s+volate\s+su\s+23\b/i, "le volate misurate di quell'origine"],
  [/dominio di validit[àa]/i, "il litotipo dichiarato come dominio di validità del modello"],
];

test("regola 26: i dati di riferimento del fondatore non compaiono in nessuna superficie", () => {
  const male = [];
  let guardate = 0, caratteri = 0;
  for (const [nome, rel] of SUPERFICI) {
    let testo;
    try { testo = leggi(rel); } catch { continue; }
    const vivo = senzaCommenti(testo);
    guardate++; caratteri += vivo.length;
    for (const [re, che] of VIETATI) {
      const m = re.exec(vivo);
      if (m) male.push(`${nome}: «${m[0]}» — ${che}`);
    }
  }
  /* quanti soggetti ha guardato davvero: uno «zero violazioni» senza questo
     numero non distingue «pulito» da «non ho aperto niente» */
  ok(guardate >= 14, `superfici guardate: ${guardate} — l'elenco si è accorciato`);
  ok(caratteri > 500000, `solo ${caratteri} caratteri esaminati: il tokenizzatore sta buttando via il file`);
  ok(male.length === 0,
    "dati di riferimento del fondatore trovati in superficie (regola ferrea, nessuna eccezione):\n  "
    + male.join("\n  "));
});

test("regola 26: la controprova — rimessi i quattro dati, la regola li vede tutti e quattro", () => {
  const sano = senzaCommenti(leggi("index.html"));
  const finti = ["maglia 4,5×3,5", "archivio di 190 video", "6/23 volate misurate",
                 "il dominio di validità del modello"];
  const visti = [];
  for (let i = 0; i < VIETATI.length; i++) {
    /* si inietta in una COPIA in memoria, mai sul file: il core lo carica il
       browser, e un banco che gira dentro la finestra misurerebbe una falsità.
       ⚠️ Si antepone invece di cercare un'ancora: la prima stesura cercava
       `<body` dentro il testo GIÀ passato da `senzaCommenti` e non lo trovava,
       quindi l'iniezione non iniettava — la terza delle cinque cause. */
    const guasto = `<p>${finti[i]}</p>\n` + sano;
    ok(guasto.length > sano.length, `iniezione ${i + 1} non agganciata: la prova non prova niente`);
    if (VIETATI[i][0].test(guasto)) visti.push(finti[i]);
  }
  ok(visti.length === VIETATI.length,
    `col difetto rimesso la regola deve vedere tutt'e ${VIETATI.length}, ne ha visti ${visti.length}: ${JSON.stringify(visti)}`);
  /* e sul file sano non ne vede nessuno: se no vedrebbe sempre tutto */
  ok(VIETATI.every(([re]) => !re.test(sano)),
    "la regola risponde «trovato» anche sul file sano: sta guardando la propria iniezione");
});

/* Il numero di regole scritto nell'intestazione è quello vero? Era rimasto a
   «tredici» mentre le regole erano diciassette. Un numero in un commento non
   fallisce: sta lì, e chi legge si fida. */
test("l'intestazione dice quante regole ci sono davvero", () => {
  const testa = leggi("apps/deepwork-id/tests/run-stile.mjs").split("// ============================================================")[1] || "";
  const voci = [...testa.matchAll(/^\/\/\s{0,2}(\d{1,2})\. /gm)].map((m) => +m[1]);
  const dichiarate = +(testa.match(/^\/\/ (\d{1,2}) regole,/m) || [])[1];
  ok(voci.length > 0, "nessuna voce numerata trovata nell'intestazione: il controllo non sta guardando niente");
  ok(dichiarate === voci.length,
    `l'intestazione dice ${dichiarate} regole ma ne elenca ${voci.length}`);
  ok(voci.every((n, i) => n === i + 1),
    `la numerazione salta: ${voci.join(", ")}`);
});

/* ⛔ REGOLA 27 — chi non ha i tre temi e' dichiarato, non scoperto per caso.
   `shared/dw-tema.js` e' quello che gira fra scuro, chiaro e sole; il sole e'
   il tema per chi legge il telefono in cava. Il 07/08 e' saltato fuori per
   caso — dal banco del contrasto, che elencava le superfici che NON poteva
   misurare — che Genesi non lo carica. Un'assenza scoperta per caso vale come
   non saperla. */
const SENZA_TEMI = {
  "apps/genesi/genesi.html":
    "palette dichiarata FUORI PERIMETRO in docs/PALETTE_APP.md: usa l'ambra del core e ha token con nomi propri. "
    + "⚠️ Conseguenza di prodotto, dichiarata: chi progetta una volata non ha la modalita' sole.",
  "apps/index.html":
    "la vetrina e' una pagina di presentazione, non uno strumento da cava: non ha schermate ne' dati.",
  "apps/deepwork-id/index.html": "schermata d'accesso del servizio comune, non una verticale.",
  "apps/deepwork-id/admin.html": "amministrazione del servizio comune, si usa da scrivania.",
  "apps/deepwork-id/profilo.html": "profilo del servizio comune, si usa da scrivania.",
  /* ⚠️ questa riga l ha aggiunta la regola stessa: la mia prima stesura dell
     elenco se n era dimenticata una, e il controllo l ha detto al primo giro. */
  "apps/deepwork-id/non-autorizzato.html": "pagina di errore del servizio comune: una frase e un bottone, nessuna schermata.",
  "apps/genesi/login.html": "schermata d accesso di Genesi: segue la sua app, che i temi non li ha (vedi la riga sopra).",
  "apps/genesi/nuvola-poc.html": "visore della nuvola di punti: una tela 3D a tutto schermo, dove il tema non dipinge niente.",
  "index.html":
    "il core ha DUE temi suoi dalla v4.4 (scuro e chiaro) e un `applyTheme()` che toglie sempre `outdoor-mode`: "
    + "non carica dw-tema.js di proposito.",
};
test("regola 27: chi carica dw-tema.js e chi no e' dichiarato, con la ragione", () => {
  const conTema = [], senza = [];
  for (const [nome, rel] of SUPERFICI) {
    const src = leggi(rel);
    if (src === null) { ok(false, `superficie non letta: ${rel}`); continue; }
    /* ⚠️ IL CARICAMENTO, NON LA MENZIONE. Il core nomina `shared/dw-tema.js` in
       un commento — spiega perché scrive quella chiave nel `localStorage` — e la
       prima stesura di questa riga lo contava fra quelli che ce l'hanno. È la
       famiglia che oggi è già costata tre volte: un commento che nomina una cosa
       non è quella cosa. */
    const carica = caricaTemi(src);
    (carica ? conTema : senza).push([nome, rel]);
  }
  ok(conTema.length + senza.length === SUPERFICI.length,
    `superfici guardate: ${conTema.length + senza.length} su ${SUPERFICI.length}`);
  ok(conTema.length >= 5, `solo ${conTema.length} superfici hanno i tre temi: erano cinque verticali`);
  for (const [nome, rel] of senza) {
    ok(rel in SENZA_TEMI,
      `${nome} (${rel}) non carica dw-tema.js e non e' dichiarato: o glielo si mette, o si scrive qui perche' no`);
  }
  /* e la meta' che `sonda-vuoto.mjs` ha insegnato: una dichiarazione che non
     serve piu' e' una dichiarazione che nasconde */
  const seNza = new Set(senza.map(([, r]) => r));
  for (const rel of Object.keys(SENZA_TEMI)) {
    ok(seNza.has(rel),
      `«${rel}» e' dichiarato SENZA temi ma adesso li carica: la riga che lo scusa va tolta`);
  }
});

if (inVolo.length) await Promise.all(inVolo);   // si aspetta PRIMA di contare
/* ═══ REGOLA 28 — OGNI STATO DI SENTINELLA PASSA DA `conSoglia` ═══
   ────────────────────────────────────────────────────────────────────────
   PERCHÉ ESISTE. `conSoglia` sostituisce la soglia del punto con quella del
   RICETTORE quando l'autorizzazione ne prescrive una più stretta per QUELLA
   casa. Il suo commento, nella pagina, elenca chi deve passare di lì:
   «semaforo, KPI, grafico, allerte, report». È un elenco scritto a mano, e
   come tutti gli elenchi scritti a mano si è accorciato da solo: il 07/08 la
   **striscia di conferma** che compare quando si registra una misura prendeva
   `m` da `MON.find` — grezzo — mentre badge e KPI giravano su
   `MONE = MON.map(conSoglia)`.
   Misurato, punto con soglia 20 collegato a una casa da 5 mm/s, lettura 8:
   la conferma diceva «→ Conforme» e la riga due centimetri sopra
   «Superamento». Non un numero in un documento: la frase che l'utente legge
   NELL'ISTANTE in cui scrive il dato, e che gli dice di stare tranquillo.
   ⛔ La difesa non è ricordarsi l'elenco: è che nessuna chiamata a
   `statoMisura(` possa nascere fuori da `conSoglia`. Questa regola lo pretende
   e stampa **quante chiamate ha guardato**, perché un «nessuna violazione» su
   zero soggetti è il modo in cui un controllo mente.
   ⚠️ Si guarda il CODICE e non il testo (`mascheraCodice`): un `statoMisura(`
   dentro un commento o una stringa non è una chiamata. */
test("regola 28: in Sentinella ogni statoMisura( nasce da conSoglia", () => {
  const testo = leggi("apps/sentinella/index.html");
  /* ⚠️ `mascheraCodice` NON torna una stringa: torna una maschera di byte
     lunga quanto il testo (1 = codice vero). Si scorre il TESTO e le si chiede
     se quel punto e' codice — chi la usa come stringa prende
     «matchAll is not a function», ed e' quello che e' successo al primo giro. */
  const vivo = mascheraCodice(testo);
  const eCodice = (k) => vivo[k] === 1;
  const male = [];
  let visti = 0;
  for (const m of testo.matchAll(/statoMisura\(/g)) {
    if (!eCodice(m.index)) continue;   // dentro un commento o una stringa: non e' una chiamata
    visti++;
    /* si guarda che cosa gli si passa: o un oggetto che viene da `conSoglia`,
       o una variabile presa da `MONE` (che è già `MON.map(conSoglia)`) */
    const coda = testo.slice(m.index, m.index + 90);
    const riga = testo.slice(0, m.index).split("\n").length;
    if (/statoMisura\(\s*conSoglia\(/.test(coda)) continue;
    /* le due chiamate che ricevono un elemento di MONE: si accettano solo se
       la variabile arriva da lì, e la prova che sia così sta nel fatto che
       MONE è l'unico posto in cui questa pagina mappa conSoglia */
    if (/statoMisura\(\s*m\s*[),]/.test(coda) && /MONE\s*=\s*MON\.map\(conSoglia\)/.test(testo)) continue;
    male.push(`riga ${riga}: ${coda.split("\n")[0].trim()}`);
  }
  ok(visti >= 3, `la regola 28 ha guardato solo ${visti} chiamate a statoMisura: non sta guardando dove crede`);
  ok(male.length === 0,
    "chiamate a statoMisura che NON passano da conSoglia (direbbero «Conforme» dove il badge dice «Superamento»):\n  "
    + male.join("\n  "));
});


/* ═══ REGOLA 29 — NESSUN TETTO ALLO STORICO SCRITTO A MANO ═══
   ────────────────────────────────────────────────────────────────────────
   PERCHÉ ESISTE. `MAX_LETTURE = 500` è esportata dal modulo di Sentinella ed
   è già importata nella pagina, dove il percorso dell'IMPORT la usa e per
   giunta DICHIARA il taglio all'utente. La scrittura A MANO, invece, tagliava
   con un `50` scritto lì: un decimo dello spazio, e senza dirlo.
   Misurato il 07/08: 200 letture importate, se ne digita UNA a mano e ne
   restano 50 — **151 cancellate**. Non scartate: cancellate. Non compaiono in
   `scartate` di `reportConformita`, perché quello elenca ciò che ha RIFIUTATO,
   e queste erano già entrate: sparivano senza lasciare traccia, e il report
   per l'ente coprirebbe cinquanta letture credendo di coprirle tutte.
   ⛔ La difesa non è ricordarsi la costante: è che un `slice(-N)` sulle letture
   non possa nascere con un numero al posto suo. */
test("regola 29: in Sentinella lo storico si taglia con MAX_LETTURE, non con un numero", () => {
  const testo = leggi("apps/sentinella/index.html");
  const vivo = mascheraCodice(testo);
  const male = [];
  let visti = 0;
  for (const m of testo.matchAll(/\.slice\(\s*-\s*([A-Za-z_$][\w$]*|\d+)\s*\)/g)) {
    if (vivo[m.index] !== 1) continue;      // dentro un commento o una stringa
    visti++;
    if (/^\d+$/.test(m[1])) {
      const riga = testo.slice(0, m.index).split("\n").length;
      male.push(`riga ${riga}: .slice(-${m[1]}) — se sono letture, sono dati cancellati in silenzio`);
    }
  }
  ok(visti >= 1, `la regola 29 ha guardato solo ${visti} slice: non sta guardando dove crede`);
  ok(male.length === 0,
    "tetti scritti a mano invece di MAX_LETTURE:\n  " + male.join("\n  "));
});

/* ═══ REGOLA 30 — «HA UNA DATA» SI DECIDE CON L'ESISTENZA, NON CON LA FORMA ═══
   ⛔ Misurata l'08/08 su un caso vero: il CSV dei costi di Flotta — quello che
   si porta al commercialista — scriveva `2026-02-30` come una data qualunque,
   e il conto in fondo al messaggio la contava fra quelle CON la data. Lo
   SCHERMO era già onesto, perché `dataIt` una data impossibile la rifiuta: a
   mentire era il FILE, che è il posto dove nessuna prova guarda.
   La regola sta in `shared/` da mesi (`dataISOEsiste`, che usa `Date.parse` e
   poi ricontrolla i pezzi: `Date.parse` un giorno che non esiste non lo rifiuta,
   lo fa SCORRERE al 2 marzo). Le pagine se n'erano tenute una copia più debole:
   **8 in Flotta, 4 in Scudo, 3 in Genesi, 2 in Sentinella, 2 in Terra, 1 in
   Campo — venti in sei app**, e il modulo di Genesi la regola giusta l'aveva
   imparata il 03/08.
   ⚠️ Il costo della stretta è stato misurato PRIMA di scriverla, come pretende
   la regola di casa: dopo la correzione le occorrenze sono **zero su otto
   superfici**, quindi questa regola nasce senza nessun falso allarme da
   dichiarare. Se un giorno ne servisse una legittima — una chiave di mese, il
   taglio di un istante — si dichiara qui con la ragione, che è meglio di una
   regola larga che non prende niente. */
test("regola 30: nessuna pagina decide una data dalla FORMA invece che dall'esistenza", () => {
  /* la forma cercata è quella della data ISO intera usata come TEST, non un
     `slice` o una chiave di mese: `/^\d{4}-\d{2}-\d{2}` con l'ancora */
  const SOSPETTA = /\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}/g;
  const male = [];
  let superfici = 0;
  for (const [nome, via] of SUPERFICI) {
    const testo = leggi(via);
    if (!testo) continue;
    superfici++;
    const vivo = mascheraCodice(testo);
    for (const m of testo.matchAll(SOSPETTA)) {
      if (vivo[m.index] !== 1) continue;    // dentro un commento o una stringa
      const riga = testo.slice(0, m.index).split("\n").length;
      male.push(`${nome} riga ${riga}: la forma di una data decide al posto di dataISOEsiste`);
    }
  }
  ok(superfici >= 8, `la regola 30 ha guardato solo ${superfici} superfici: non sta guardando dove crede`);
  ok(male.length === 0,
    "la FORMA decide al posto dell'ESISTENZA (2026-02-30 ha la forma giusta e non esiste):\n  " + male.join("\n  "));
});
test("regola 30: la controprova — rimessa la forma, la regola la vede", () => {
  /* ⛔ senza questa, «zero violazioni» potrebbe voler dire «non guardo niente»:
     è la lezione pagata due volte in questa casa. */
  const finto = 'const ok = /^\\d{4}-\\d{2}-\\d{2}$/.test(x);';
  const SOSPETTA = /\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}/g;
  const vivo = mascheraCodice(finto);
  const trovati = [...finto.matchAll(SOSPETTA)].filter((m) => vivo[m.index] === 1).length;
  ok(trovati === 1, `la regola 30 non vede la forma rimessa: ${trovati} invece di 1`);
  /* e il verso opposto: dentro un COMMENTO non deve vederla */
  const commentato = '/* esempio: la forma /^\\d{4}-\\d{2}-\\d{2}$/ non va usata */';
  const vivo2 = mascheraCodice(commentato);
  const trovati2 = [...commentato.matchAll(SOSPETTA)].filter((m) => vivo2[m.index] === 1).length;
  ok(trovati2 === 0, `la regola 30 accusa un commento: ${trovati2} invece di 0`);
});

/* ⛔ REGOLA 31 — I FORI SEGNATI SUL MODELLO 3D SI NUMERANO IN UN POSTO SOLO.
   Il difetto: nel core la stessa scelta era presa due volte. «Porta i fori
   nella volata» li ordinava da sinistra a destra e li numerava 1..n; «Esporta
   CSV» li numerava `(i+1)` nell'ordine in cui erano stati CLICCATI. Misurato
   su quattro fori cliccati sparsi: **4 righe su 4** in cui lo stesso numero
   indicava un foro diverso nei due documenti — e il numero del foro è il modo
   in cui chi perfora sa dove andare.
   ⚠️ PERCHÉ LA REGOLA STA QUI E NON FRA LE PROVE DEL MODULO. Ci avevo provato,
   in `run-kpi.mjs`, con una prova che derivava tutt'e due le viste da una sola
   chiamata a `foriDalModello` e pretendeva che coincidessero: **restava verde
   col difetto rimesso**, perché due viste della stessa chiamata concordano
   qualunque cosa faccia la funzione. Era la prima delle cinque cause di «non
   distingue». La proprietà vera — *le due righe del core leggono la stessa
   fonte* — è della PAGINA, e si guarda dove la pagina si legge.
   La regola cerca il segno del ritorno indietro: la matematica dell'origine
   (`+ W/2`, `+ H/2`) rifatta a mano nella pagina, che è il modo in cui questa
   decisione era scritta prima. */
test("regola 31: nel core l'origine dei fori 3D non si ricalcola nella pagina", () => {
  const testo = leggi("index.html");
  ok(!!testo, "la regola 31 non ha trovato il core: non sta guardando dove crede");
  const vivo = mascheraCodice(testo);
  /* `position.x + W/2` e sorelle: il cambio d'origine rifatto a mano */
  const SOSPETTA = /position\.[xy]\s*\+\s*[WH]\s*\/\s*2/g;
  const male = [];
  for (const m of testo.matchAll(SOSPETTA)) {
    if (vivo[m.index] !== 1) continue;      // dentro un commento o una stringa
    male.push(`riga ${testo.slice(0, m.index).split("\n").length}: «${m[0]}» invece di foriDalModello`);
  }
  ok(male.length === 0,
    "l'origine dei fori del modello 3D è ricalcolata nella pagina:\n  " + male.join("\n  "));
  /* e il verso positivo: i DUE consumatori devono esserci davvero. Senza
     questo, cancellare tutt'e due le funzioni farebbe passare la regola.
     ⚠️ Qui si contano le CHIAMATE, e l'import non è una chiamata: la prima
     stesura pretendeva 3 («l'import più i due consumatori») e la regola è
     caduta subito — su sé stessa, non sul prodotto. `foriDalModello }` in una
     lista di import non ha la parentesi, quindi non combacia. Il righello,
     non il soggetto: è la ragione per cui l'import si guarda a parte. */
  const usi = [...testo.matchAll(/foriDalModello\s*\(/g)].filter((m) => vivo[m.index] === 1).length;
  ok(usi >= 2, `foriDalModello è chiamata ${usi} volte nel core: i consumatori sono due (volata e CSV)`);
  /* ⚠️ E il righello ha sbagliato una SECONDA volta qui, nella stessa
     famiglia: cercavo l'import in `testo.slice(0, indexOf("</script>"))`
     dando per scontato che il primo `</script>` chiudesse il modulo. Il primo
     sta a riga **13**, l'import a **111**: la fetta buttava via il file
     intero e la regola accusava un core sano. Adesso si cerca la RIGA
     dell'import per quello che è — il nome dentro una `import … from
     …dw-shell.js` — invece di dedurre dove finisce il codice. */
  const RIGA_IMPORT = /import\s*\{[^}]*\bforiDalModello\b[^}]*\}\s*from\s*["'][^"']*dw-shell\.js["']/;
  ok(RIGA_IMPORT.test(testo),
    "foriDalModello è chiamata ma non importata da dw-shell.js: la pagina si apre e muore al primo tocco");
});
test("regola 31: la controprova — nei due versi", () => {
  const finto = "v.fori.push({x:Math.round((m.position.x+W/2)*100)/100});";
  const vivo = mascheraCodice(finto);
  const trovati = [...finto.matchAll(/position\.[xy]\s*\+\s*[WH]\s*\/\s*2/g)].filter((m) => vivo[m.index] === 1).length;
  ok(trovati === 1, `la regola 31 non vede il conto rimesso a mano: ${trovati} invece di 1`);
  /* e dentro un commento non deve vederlo: è il difetto che in questa casa è
     già passato tre volte, l'ultima scrivendo questa stessa famiglia di regole */
  const commentato = "/* prima era m.position.x + W/2, adesso no */";
  const vivo2 = mascheraCodice(commentato);
  const trovati2 = [...commentato.matchAll(/position\.[xy]\s*\+\s*[WH]\s*\/\s*2/g)].filter((m) => vivo2[m.index] === 1).length;
  ok(trovati2 === 0, `la regola 31 accusa un commento: ${trovati2} invece di 0`);
});

console.log(`\nRisultato Stile: ${passed} passati, ${failed} falliti${inVolo.length ? `  ·  ${inVolo.length} prove asincrone aspettate` : ""}`);
process.exit(failed > 0 ? 1 : 0);
