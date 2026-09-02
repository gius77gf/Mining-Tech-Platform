/* ⚠️ NON VA IN npm test: e' l'ORCHESTRATORE dei banchi del browser, e vuole
   Chromium e un server. Si lancia a mano; e' lui a lanciare gli altri. */
/* TUTTI I BANCHI DEL BROWSER, CON UN COMANDO SOLO.
   I banchi qui dentro non girano in CI (servono Chromium e un server statico) e
   quindi girano solo se qualcuno se li ricorda. Un elenco che sta nella testa di
   chi l'ha scritto, alla settimana dopo non esiste: questo file è l'elenco.

   Fa anche una cosa che nessuno dei banchi può fare da solo: **alza il server
   statico se non risponde**, così il comando funziona anche a freddo. Il motivo
   non è comodità — è che un banco che chiede una condizione non ovvia viene
   lanciato una volta e poi mai più.

   Uso:
     node apps/deepwork-id/tests/browser/tutti.mjs          (alza il server da sé)
     node apps/deepwork-id/tests/browser/tutti.mjs 8823     (usa quello che c'è)
*/
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { impronta, differenze } from './impronta.mjs';
import { scegliBanchi, dichiaraFiltro } from './scegli-banchi.mjs';
import { execFileSync } from 'node:child_process';
import { rmSync, existsSync, writeFileSync, readlinkSync } from 'node:fs';

const QUI = dirname(fileURLToPath(import.meta.url));
const RADICE = join(QUI, '..', '..', '..', '..');

/* ⚠️ IL GIRO SI ACCORGE DA SÉ SE GLI HANNO CAMBIATO IL CODICE SOTTO.
   `CLAUDE.md` vieta di modificare moduli dati e pagine mentre un giro gira: le
   sue misure diventano false. La regola è scritta — ed è stata violata due
   volte in due giorni da chi l'aveva scritta. Adesso è un controllo: l'impronta
   si prende prima, dopo ogni banco e alla fine, e se qualcosa cambia il giro
   dichiara sé stesso NON VALIDO invece di stampare un riepilogo verde.
   Il perché di «dopo ogni banco» e non solo alla fine: così si sa **quali**
   banchi hanno misurato il codice giusto e quali no, invece di buttare
   venticinque banchi per una modifica arrivata all'ultimo. */
const RADICE_IMPRONTA = (process.argv.find((a) => a.startsWith('--radice-impronta=')) || '').split('=')[1] || RADICE;
const BANCHI_FINTI = process.argv.includes('--banchi-finti');   // solo per la controprova della guardia
/* un quarto banco finto che NON finisce mai: serve alla controprova del limite
   qui sotto, e non entra nel giro finto normale perché lo allungherebbe */
const FINTO_APPESO = process.argv.includes('--banchi-finti-appeso');
/* ⛔ UN BANCO CHE SI PIANTA FERMAVA IL GIRO IN SILENZIO, PER SEMPRE. Misurato
   l'08/08: `uno-solo.mjs --controprova` è rimasto appeso **quattro ore e
   trentotto minuti** dentro un giro che ne aveva già girate tre, e il giro non
   è mai finito — `p.on('close', ok)` senza limite aspetta all'infinito.
   Il danno non è il tempo perso: è che il registro **si tronca a metà di una
   sezione e sembra completo**. Chi lo apre legge le passate fatte, non vede
   nessun errore, e crede di avere davanti il verdetto di tutto il giro; le
   passate mai eseguite non compaiono in nessuna riga — spariscono, invece di
   dichiararsi. È la famiglia del banco che crolla e dichiara meno prove, in
   una veste peggiore: qui non crolla nemmeno, tace.
   Il limite è generoso di proposito — la passata più lunga misurata (contrasto
   su 14 superfici) sta sotto i venti minuti — e si può alzare con
   `--limite=<secondi>`. Quando scatta, il banco viene ucciso, il giro DICE che
   quella passata non è stata misurata e **tira avanti**: un soggetto non
   misurato non è un soggetto a posto, e il riepilogo lo conta a parte. */
const LIMITE_MS = (Number((process.argv.find((a) => a.startsWith('--limite=')) || '').split('=')[1]) || 1800) * 1000;

/* ⛔ IL GIRO ERA TUTTO-O-NIENTE, e per questo non finiva mai. 198 passate a
   4,1 min l'una sono 13,5 ore: più di una sessione. Con `--solo=` un ciclo
   verifica in minuti le superfici che ha toccato, e il giro intero resta per
   quando c'è una notte da dedicargli. La scelta e — soprattutto — la
   DICHIARAZIONE di quante passate restano fuori stanno in `scegli-banchi.mjs`,
   che è puro e quindi provabile: importare questo file alza un server. */
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').split('=').slice(1).join('=');
const DA = Number((process.argv.find((a) => a.startsWith('--da=')) || '').split('=')[1]) || 0;

const BANCHI = [
  /* PRIMO DI TUTTI, e di proposito: se una pagina non si apre, ogni misura
     dei banchi seguenti parla di una pagina che non c'è. Il 01/08 Scudo è
     rimasta rotta per cinque commit senza che nessun controllo se ne
     accorgesse — le suite `node` non importano le pagine. */
  ['le pagine si aprono', 'pagine-vive.mjs', []],
  ['le pagine si aprono · controprova', 'pagine-vive.mjs', ['--controprova'], true],
  /* il messaggio che il core dà quando il database non risponde: dal 02/08
     (regole chiuse) è il ramo che prende TUTTI i visitatori */
  ['messaggio del ripiego', 'ripiego-messaggio.mjs', []],
  /* una data che nessuno sa leggere non può diventare un OK verde (03/08) */
  ['date illeggibili nel core', 'core-date-illeggibili.mjs', []],
  ['date illeggibili · controprova', 'core-date-illeggibili.mjs', ['--controprova'], true],
  ['messaggio del ripiego · controprova', 'ripiego-messaggio.mjs', ['--controprova'], true],
  ['campi interi', 'interi-superfici.mjs', []],
  ['campi interi · controprova', 'interi-superfici.mjs', ['--senza-guardia'], true],
  ['contrasto', 'contrasto.mjs', []],
  /* ⛔ AGGIUNTI IL 07/08, E NON PRIMA — la ragione è la parte che vale. Il banco
     ha imparato i tre temi il 07/08 mattina e ha subito trovato **54**
     violazioni AA nei due temi chiari, contro zero al buio: sei palette
     verificate a contrasto in **un tema su tre**, e nessuno lo sapeva perché
     nessuno le aveva mai aperte. Registrarli allora avrebbe messo il giro in
     rosso per l'intera giornata, cioè avrebbe reso il giro un rumore da
     ignorare invece di un segnale — il modo più sicuro di perdere una difesa.
     Sono entrati quando l'ultima delle sei app è arrivata a zero: Sentinella
     `24c4d89`, Flotta `b50c8b4`, Conti `099f375`, Terra `f73efba`, Campo
     `98fe776`, Scudo `73d1ae3`.
     ⚠️ E la loro guardia contro il verde vuoto è dentro il banco, non qui: chi
     non carica `shared/dw-tema.js` non ha i tre temi e viene **dichiarato non
     misurato** invece di contato a posto (le otto superfici sono elencate con
     la ragione nella regola 27 di `run-stile`). Un tema che non si accende non
     è un tema che passa. */
  ['contrasto · tema chiaro', 'contrasto.mjs', ['--tema=chiaro']],
  ['contrasto · tema sole', 'contrasto.mjs', ['--tema=sole']],
  ['contrasto · controprova', 'contrasto.mjs', ['--controprova'], true],
  /* la controprova serve in TUTT'E TRE i temi per la stessa ragione per cui
     serve al buio: il righello del giorno è nuovo, e un righello nuovo che non
     sa fallire non dimostra niente. */
  ['contrasto · controprova chiaro', 'contrasto.mjs', ['--controprova', '--tema=chiaro'], true],
  /* ⛔ AGGIUNTA IL 07/08 COL RIGHELLO NUOVO. La geometria dei gradienti non si
     prova guardando i verdetti — quelli erano zero prima e sono zero dopo:
     si prova su un caso **costruito** che i righelli più semplici promuovono.
     Il caso è un fondo grigio uniforme con l'inchiostro che va dal nero al
     bianco lungo le lettere: **4,56 e 4,61 ai due capi, 1,17 in mezzo**, cioè
     illeggibile proprio dove nessuno guardava. Lo promuovevano tutt'e due i
     righelli precedenti — gli angoli e l'accoppiamento a tappeto. Senza questa
     riga la controprova non gira mai in CI, che è la guardia scollegata. */
  ['contrasto · la geometria dei gradienti', 'contrasto.mjs', ['--controprova-gradiente'], true],
  /* ⛔ AGGIUNTA IL 03/08, e non è un doppione della riga qui sopra: quella
     prova che il banco sappia BOCCIARE, questa che sappia NON bocciare. Il
     giro della notte aveva accusato quattro colori del core che sullo stesso
     identico file fanno 5:1 e più — erano schermate colte a metà comparsa. Il
     veleno qui è un testo che fermo sta benissimo e porta un'animazione
     infinita che lo tiene a mezza opacità: dev'essere DICHIARATO, mai
     giudicato. Un'accusa falsa su un colore manda a rovinare una palette
     sana, ed è per questo che ha una prova sua. */
  ['contrasto · non accusa chi pulsa', 'contrasto.mjs', ['--controprova-pulsazione'], true],
  /* ⛔ AGGIUNTO IL 06/08. Il banco misura il testo CHE SI VEDE, e la sua
     risposta è vera; quello che non diceva è che nello stato di partenza il
     pallino delle notifiche, la pillola «non salva», il toast e gli avatar dei
     ruoli **non ci sono**. Da lì due violazioni AA rimaste nel core per giorni
     con tre suite verdi sopra: `.av-su` a 2,65:1 (le iniziali di una persona)
     e `.av-mz` a 3,35:1. La controprova aggiunge al foglio di stile una classe
     che nel DOM non compare MAI: il censimento deve trovarla e bocciarla, se
     no la passata nuova è una guardia scollegata. */
  ['contrasto · le classi mai comparse', 'contrasto.mjs', ['--controprova-censimento'], true],
  /* ⛔ AGGIUNTE IL 09/08, E COPRONO IL BUCO PIÙ GRANDE CHE QUEL BANCO AVESSE:
     **le finestre di dialogo**. `contrasto.mjs` cammina sulle sezioni, e
     `#modal` sta a `display:none` finché qualcuno non lo apre — quindi il
     colore DENTRO le finestre non lo misurava nessuno, in nessuna app e in
     nessuno dei tre temi. Non si vedeva perché il numero stampato era vero:
     «613 testi su Scudo, 0 sotto soglia» è la risposta esatta a una domanda
     più stretta di quella che sembra. Misurato prima di scrivere una riga:
     rifacendo lo stesso cammino, dei 1050 testi di Scudo **zero** stanno
     dentro `#modal`; e la stessa domanda, appena una finestra si apre,
     risponde 4.
     Il primo giro ha aperto **89 finestre su 186** in quattordici superfici al
     buio (nei due temi chiari il tema ce l'hanno sei superfici, 50 su 114 per
     tema) e misurato 4.562 testi in tutto: un difetto vero, nel core — il riquadro
     «CAVA» di «Nuovo progetto di volata», bianco su un gradiente verde a
     **3,28:1** dove ne servono 4,5 (corretto in `openSelezionaCavaPerVolata`).
     ⚠️ SONO PASSATE A PARTE, e il motivo è un numero: aprire le finestre costa
     ~13 minuti a tema, e `--limite=` uccide una passata oltre la mezz'ora.
     Sommandole a quella delle sezioni si sarebbe perso tutto il banco invece
     di guadagnare le finestre. */
  ['contrasto dentro le finestre', 'contrasto.mjs', ['--modali']],
  ['contrasto dentro le finestre · tema chiaro', 'contrasto.mjs', ['--modali', '--tema=chiaro']],
  ['contrasto dentro le finestre · tema sole', 'contrasto.mjs', ['--modali', '--tema=sole']],
  /* ⛔ E LE FINESTRE CHE IL GESTO NON RAGGIUNGE. `--modali` ne apre 90 su 186:
     le altre sono quasi tutte CONFERME, e ci si arriva solo scegliendo prima
     una riga. Fermarsi lì vuol dire dichiarare «0 sotto soglia» avendo
     guardato una finestra su due. `--forzate` le fa comparire chiamando le
     funzioni VERE della pagina — 206 aperture su 9 superfici — e di prova sono
     le PAROLE della struttura condivisa, non il corpo che ogni app si
     costruisce. Le due passate stanno INSIEME: nessuna delle due basta. */
  ['contrasto nelle finestre fatte comparire', 'contrasto.mjs', ['--forzate']],
  /* il veleno va messo DENTRO la finestra aperta, non appeso al corpo della
     pagina: fuori da `#modal *` non entrerebbe mai nella misura e la
     controprova direbbe «non so fallire» per il motivo sbagliato. Insieme al
     veleno entra il testimone leggibile scritto con `color-mix()`, che NON
     deve essere bocciato — se no il righello ha ripreso a leggere
     `color(srgb …)` come se i canali fossero 0-255. */
  ['contrasto dentro le finestre · controprova', 'contrasto.mjs', ['--modali', '--controprova'], true],
  ['contrasto nelle finestre fatte comparire · controprova', 'contrasto.mjs', ['--forzate', '--controprova'], true],
  /* ⛔ AGGIUNTE IL 09/08, E COPRONO IL BUCO CHE LE DUE PASSATE QUI SOPRA
     AVEVANO IN COMUNE: **misuravano a una larghezza sola**, e quella larghezza
     non era scritta da nessuna parte — è il valore predefinito di
     `apriSuperficie` in `giro.mjs` (`larghezza = 430`), che `contrasto.mjs`
     non ha mai sovrascritto. Quattordici superfici, tre temi, quattro passate,
     e un telefono solo: il numero non si presentava come una decisione, quindi
     nessuno l'ha mai messo in discussione.
     ⚠️ Perché conta, e non è estetica: le app si usano IN CAVA, sul telefono.
     A 320 px il foglio condiviso entra in `@media(max-width:360px)`, la pagina
     si rimpagina e i corpi si rimpiccioliscono — e la soglia della WCAG cambia
     da sé, perché il «testo grande» che si accontenta di 3:1 comincia a 24 px
     (18,66 in grassetto). Un titolo che a 430 px sta di là dal confine, a 320
     può scenderne di qua e passare a pretendere 4,5:1 **senza che nessuno
     abbia toccato un colore**.
     ⛔ E NON È UN'IPOTESI: è misurato, e il banco adesso lo stampa coi nomi.
     Con `--modali --larghezze=430,390,320` su 14 superfici, 90 finestre
     diverse e 202 aperture per larghezza, i testi che prendono la soglia 3:1
     passano da **20 a 430 e 390 px** a **15 a 320 px**: cinque cambiano
     soglia. Verdetti al 09/08: **0 sotto soglia a tutt'e tre le larghezze**,
     cioè oggi quei cinque reggono anche la soglia più severa — ma fino a ieri
     nessuno lo sapeva, e il giorno che qualcuno tocca uno di quei colori il
     difetto nascerebbe **solo sullo schermo stretto**, dove nessun banco
     guardava.
     ⚠️ UNA LARGHEZZA PER PASSATA, ed è un numero: `--modali` costa ~13 minuti,
     e `--limite=` uccide una passata oltre la mezz'ora. Ciclarne tre dentro
     una sola la farebbe uccidere — si perderebbe tutto invece di guadagnare le
     larghezze, che è la stessa misura per cui `--modali` è una passata a parte.
     Il ciclo dentro il banco (`--larghezze=430,390,320`) resta per l'uso a
     mano, e lì i conti si tengono per larghezza. */
  ['contrasto dentro le finestre · 390 px', 'contrasto.mjs', ['--modali', '--larghezze=390']],
  ['contrasto dentro le finestre · 320 px', 'contrasto.mjs', ['--modali', '--larghezze=320']],
  ['contrasto nelle finestre fatte comparire · 390 px', 'contrasto.mjs', ['--forzate', '--larghezze=390']],
  ['contrasto nelle finestre fatte comparire · 320 px', 'contrasto.mjs', ['--forzate', '--larghezze=320']],
  /* ⛔ E LA CONTROPROVA A 320, PERCHÉ UNA PASSATA NUOVA CHE NON SA FALLIRE NON
     DIMOSTRA NIENTE. Il righello è lo stesso a ogni larghezza — ed è proprio
     per questo che andava provato: a 320 px la pagina si rimpagina, un
     elemento può nascere alto zero o finire fuori dal riquadro, e il veleno
     appeso dentro `#modal` potrebbe non arrivare mai alla misura. Sarebbe la
     terza delle cinque cause di «non distingue» — l'iniezione che non inietta
     — nella veste in cui a spegnerla è la LARGHEZZA.
     Provata a mano a tutt'e tre le larghezze prima di registrare: il veleno a
     1,15:1 è stato bocciato dappertutto e il testimone `color-mix()` non è
     stato bocciato da nessuna parte. Registrate le due a **320**, non anche
     quelle a 390: 430 è già registrata qui sopra, 390 sta in mezzo a due
     larghezze provate, e 320 è la sola dove la pagina cambia impaginazione —
     cioè la sola dove il righello poteva diventare cieco. Il costo è
     dichiarato invece che nascosto: due passate invece di quattro. */
  ['contrasto dentro le finestre · controprova a 320 px', 'contrasto.mjs', ['--modali', '--controprova', '--larghezze=320'], true],
  ['contrasto nelle finestre fatte comparire · controprova a 320 px', 'contrasto.mjs', ['--forzate', '--controprova', '--larghezze=320'], true],
  /* ⛔ AGGIUNTO IL 07/08, E MISURA L'ALTRA METÀ. `contrasto.mjs` guarda i
     TESTI; tutto ciò che parla senza parole — la barretta a lato di una riga,
     il filo in cima a un KPI, la striscia di un riquadro, il bordo di un campo
     sbagliato — non lo guardava nessuno, e la WCAG 1.4.11 chiede 3:1 contro i
     colori adiacenti. Al buio erano a posto (122 superfici, zero sotto); nei
     due temi chiari **92 superfici distinte sotto soglia** in tutte e sei le
     app, con l'ambra a 1,57. Tre cantieri l'avevano segnalato lo stesso
     giorno, nessuno l'aveva toccato: il segnale principale regge da solo, ma
     in Campo quella striscia gialla è **il** segno che una persona non è
     stata spuntata nell'appello.
     ⚠️ La controprova gira solo nei temi chiari, e il banco lo pretende: al
     buio `--bar-…` e il colore di stato sono lo stesso valore per costruzione,
     quindi lì non c'è nessun difetto da rimettere e un verde non direbbe
     niente. */
  ['contrasto non testo (WCAG 1.4.11)', 'contrasto-non-testo.mjs', []],
  ['contrasto non testo · tema chiaro', 'contrasto-non-testo.mjs', ['--tema=chiaro']],
  ['contrasto non testo · tema sole', 'contrasto-non-testo.mjs', ['--tema=sole']],
  ['contrasto non testo · controprova chiaro', 'contrasto-non-testo.mjs', ['--tema=chiaro', '--controprova'], true],
  ['contrasto non testo · controprova sole', 'contrasto-non-testo.mjs', ['--tema=sole', '--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08. Stessa domanda che il giorno prima ha trovato
     ventiquattro difetti in cinque app — *dove il core compone qualcosa che
     ESCE, chi decide i suoi numeri?* — applicata ai due documenti del core
     rimasti fuori dalla passata: il Report tecnico (che stampava «0 · 0.0 ·
     0.0» su un turno mai misurato, mentre la dashboard da cui si preme il
     bottone diceva «— mc») e il PDF della frammentazione (che scriveva
     «Indice oversize: 0% — ECCELLENTE» dove lo schermo, nello stesso caso,
     taceva). E per arrivarci si è dovuto premere il bottone davvero: da lì è
     saltata fuori la striscia invisibile del toast, che il codice non mostra.
     Due controprove, una per strato, perché quella del toast maschera l'altra:
     senza poter premere il bottone, le prove sui numeri cadono per la ragione
     sbagliata. */
  ['i documenti che escono dal core', 'core-documenti-che-escono.mjs', []],
  ['documenti del core · controprova', 'core-documenti-che-escono.mjs', ['--controprova'], true],
  ['documenti del core · controprova del tocco', 'core-documenti-che-escono.mjs', ['--controprova-toast'], true],
  /* ⛔ AGGIUNTO IL 03/08. Stessa domanda del foglio di Genesi, girata alle due
     app di cui la passata sui CSV era già stata fatta: dove Flotta e
     Sentinella compongono qualcosa che si STAMPA, chi decide i suoi numeri?
     Sono usciti quattro difetti che nessuna prova poteva vedere, perché le
     suite `node` chiamano il modulo e i banchi guardano lo SCHERMO:
     · la tessera del libretto tagliava «€ 12.750,00» a 138 px sul foglio A4 —
       la riga è forzata a quattro colonne in stampa e la guardia dello
       schermo (`max-width:400px`) lì non scatta mai;
     · il libretto scriveva «3 fermi registrati per 5 giorni in tutto» sopra
       tre righe che dicono «—», «—» e «5 giorni»;
     · in modalità tour tutt'e due i fogli — quello che si consegna a chi
       compra la macchina e quello che si consegna all'ente — uscivano dalla
       stampante senza una parola che dicesse che i numeri sono inventati: la
       fascia che lo dice a schermo è un comando, e la stampa la nasconde;
     · e il filtro del periodo del report di Sentinella confrontava STRINGHE,
       quindi una lettura datata 30 febbraio entrava nel documento per l'ente
       e ne cambiava l'esito, mentre ogni schermata la scartava.
     Le funzioni nuove sono provate in `run-kpi`; che il bottone stampi, che
     il numero ci stia nella tessera e che il foglio dica quelle parole, lo
     dice solo il browser — e solo in `@media print`. */
  /* ⛔ E DAL 03/08 IL BANCO NON GUARDA PIÙ DUE APP MA QUATTRO: la
     dichiarazione «dati di esempio» sul foglio mancava anche a Conti (tre
     fogli: preventivo, DDT, fattura) e a Terra (riepilogo annuale e verbale,
     che vivono in una FINESTRA NUOVA, dove il `@media print` della pagina non
     arriva). L'etichetta diceva «Flotta e Sentinella» ed era la solita lista
     tenuta a mente: si aggiorna col banco, se no il giro dice di aver
     guardato meno di quello che guarda — o più. */
  ['i fogli stampati di Flotta, Sentinella, Conti, Terra e Scudo', 'stampe-fs.mjs', []],
  /* ⛔ AGGIUNTO IL 06/08, e Campo ha voluto un banco suo perché il suo foglio
     non è come gli altri: Campo **non stampa sé stesso** (`grep -c "@media
     print" apps/campo/index.html` → 0). Il rapporto di fine turno è un HTML
     costruito e scritto in una FINESTRA NUOVA, come i due di Terra, e con lui
     viaggia la **consegna di turno `.txt`** — lo stesso documento in un altro
     vestito, quello che passa di mano fra due turni.
     Il banco ha `--live` (coi dati veri i fogli devono uscire PULITI: 3
     iniezioni riuscite) e `--controprova` (9 difetti rimessi, 0 iniezioni
     mancate). Ha trovato anche il secondo difetto della giornata: sul Quadro
     in cima al foglio, con la giornata vuota, «0/0 attività concluse · 0
     anomalie aperte» — la riga più tranquilla del documento, due sezioni
     sopra una che già diceva «non calcolata». */
  ['il foglio di fine turno di Campo', 'campo-foglio-turno.mjs', []],
  ['foglio di turno · controprova', 'campo-foglio-turno.mjs', ['--controprova'], true],
  ['foglio di turno · coi dati veri tace', 'campo-foglio-turno.mjs', ['--live']],
  /* ⛔ AGGIUNTO IL 06/08. I CSV sono l'uscita più esposta di tutte: un `.csv`
     che esce dalla dimostrazione arriva in un foglio di calcolo — o dal
     commercialista, o all'ente — identico a uno vero, e a differenza di un
     foglio stampato non ha nemmeno un'intestazione grafica in cui dubitare.
     25 punti di export su 4 app, censiti coi comandi.
     ⛔ E LA SCELTA L'HANNO DECISA I NUMERI, non l'eleganza: delle quattro
     forme possibili, la riga di commento in cima e la riga in coda vengono
     rilette **come un DATO** da 6 lettori nostri su 9 (un ricambio in più, un
     mezzo in più, un ricettore in più…). La frase scritta per dire «questi
     numeri non sono veri» diventava essa stessa un numero falso: il difetto
     che si stava chiudendo, rifatto peggio. Restano il nome del file (montato)
     e la colonna in più (proposta, col suo costo misurato). */
  /* ⚠️ L'ETICHETTA NON PORTA PIÙ UN CONTO, E LA RAGIONE È CHE QUELLO CHE
     PORTAVA ERA FALSO. Diceva «25 export, 4 app»; il banco ne preme **32** su
     **cinque** app e legge 29 file — lo stampa lui stesso in fondo. Un numero
     scritto a mano dentro un'etichetta invecchia in silenzio e nessuna prova lo
     guarda, e chi legge l'elenco dei banchi si fa un'idea sbagliata di quanto è
     coperto: è la stessa famiglia del «0 su 68» che nessuno leggeva, in versione
     rassicurante. Il conto vero lo dice il banco, che lo ricava dai soggetti. */
  ['i CSV che escono dalla dimostrazione', 'csv-dimostrazione.mjs', []],
  ['CSV dimostrazione · su dati veri il marchio non c\'è', 'csv-dimostrazione.mjs', ['--live']],
  ['CSV dimostrazione · controprova', 'csv-dimostrazione.mjs', ['--controprova'], true],
  /* ⛔ LA TERZA USCITA, dal 07/08: non un file e non un foglio, ma un testo
     COPIATO NEGLI APPUNTI — il promemoria che Scudo prepara per il lavoratore.
     I due banchi qui sopra non potevano vederla: uno deriva i suoi soggetti da
     `…download = …`, l'altro dai blocchi `@media print`, e un
     `clipboard.writeText` non somiglia a nessuno dei due. Misurato: usciva un
     sollecito completo e credibile, con nome e date, senza una parola che
     dicesse che è finto — l'uscita con la difesa più debole, e l'unica che va
     a una PERSONA invece che a un archivio. */
  ['il testo che esce dagli appunti', 'appunti-dimostrazione.mjs', []],
  ['appunti · su dati veri la dichiarazione non c\'è', 'appunti-dimostrazione.mjs', ['--live']],
  ['appunti · controprova', 'appunti-dimostrazione.mjs', ['--controprova'], true],
  ['fogli stampati F/S/C/T/S · controprova', 'stampe-fs.mjs', ['--controprova'], true],
  ['unità in maiuscolo', 'unita-maiuscole.mjs', []],
  ['unità · controprova', 'unita-maiuscole.mjs', ['--controprova', '--solo=campo'], true],
  ['collegamenti della vetrina', 'vetrina-collegamenti.mjs', []],
  ['collegamenti · controprova', 'vetrina-collegamenti.mjs', ['--senza-ritorno'], true],
  ['programma partito · controprova', 'vetrina-collegamenti.mjs', ['--senza-programma'], true],
  ['doppia data', 'doppia-data.mjs', []],
  ['doppia data · controprova', 'doppia-data.mjs', ['--controprova'], true],
  ['striscia di stato dei riquadri', 'note-stato.mjs', []],
  ['striscia di stato · controprova', 'note-stato.mjs', ['--controprova'], true],
  ['niente fuori schermo', 'fuori-schermo.mjs', []],
  ['fuori schermo · controprova', 'fuori-schermo.mjs', ['--controprova', '--solo=sentinella'], true],
  ['id unici nella pagina viva', 'id-unici.mjs', []],
  ['id unici · controprova', 'id-unici.mjs', ['--controprova'], true],
  ['bersagli degli stati vuoti', 'vuoti-azione.mjs', []],
  ['bersagli · controprova', 'vuoti-azione.mjs', ['--controprova'], true],
  ['navigazione fra le pagine', 'navigazione.mjs', []],
  ['navigazione · controprova', 'navigazione.mjs', ['--senza-guardie'], true],
  ['sconto del cliente', 'sconto-cliente.mjs', []],
  ['sconto · controprova', 'sconto-cliente.mjs', ['--senza-cliente'], true],
  ['quali punti conta la nuvola', 'punti-nuvola.mjs', []],
  ['punti della nuvola · controprova', 'punti-nuvola.mjs', ['--conto-unico'], true],
  ['struttura di Genesi', 'genesi-struttura.mjs', []],
  ['struttura di Genesi · controprova', 'genesi-struttura.mjs', ['--prima'], true],
  /* IL FOGLIO CHE SI PORTA IN CAVA. Terza passata, e la domanda era una sola:
     dove Genesi compone qualcosa che ESCE, chi decide i suoi numeri? Il report
     stampabile li decideva da sé, e quindi non diceva che la PPV SUPERA (77,7
     contro una soglia di 8), non aveva la riga dell'airblast (143 dB(L), dieci
     oltre il limite), non dichiarava su quanti referti era tarata la legge — e
     il confronto A/B dipingeva di verde quattro pareggi. Non si vedeva
     leggendo: si è visto premendo il bottone e aprendo il documento. */
  ['il foglio che si porta in cava (Genesi)', 'genesi-foglio-in-cava.mjs', []],
  ['foglio in cava · controprova', 'genesi-foglio-in-cava.mjs', ['--controprova'], true],
  /* ⛔ IL PIANO DI INNESCO XML — l'uscita di Genesi che nessun banco premeva, e
     l'unica delle dieci che NON leggiamo noi: la leggono i software dei
     detonatori e delle perforatrici. Censendo per EFFETTO invece che per
     somiglianza (non «chi scrive `download =`» ma «che cosa produce un file o
     un testo che l'utente porta fuori») ne escono dieci; la seconda domanda —
     «quali di queste dieci preme un banco?» — lasciava scoperta proprio lei.
     Sotto c'era il difetto: l'import non leggeva `Initiation`, quindi una
     volata a detonatori elettronici riaperta tornava Nonel e lo «Scatter
     innesco» passava da 0,1 a 8,0 ms — ottanta volte — in silenzio. */
  /* ⛔ I CAMPI DI GENESI CHE NON DEVONO RIEMPIRSI DA SOLI — entrato il 10/08,
     e non prima: finché B0-nonies era aperta il banco cadeva su un difetto
     VERO (il 2D che moriva con l'interasse assente), e un giro che parte rosso
     per una ragione vera è un giro che qualcuno spegne.
     Le prove di `run-kpi` guardano il SORGENTE; questo guarda l'AGGANCIO —
     che il campo, sullo schermo, dopo i due tocchi resti davvero vuoto. */
  /* ⛔ IL PANNELLO CHE DICEVA «0 ms» DOVE NESSUNO AVEVA IMPOSTATO NIENTE — e
     l'elenco due righe sotto lo smentiva gia'. Nessun banco guardava quella
     frase: `grep -rl "Durata totale" apps/deepwork-id/tests/` non dava niente. */
  ['la durata della sequenza nel core', 'core-sequenza-ritardi.mjs', []],
  ['durata sequenza · controprova', 'core-sequenza-ritardi.mjs', ['--controprova'], true],
  /* ⛔ IL RECETTORE ASSENTE CHE FACEVA DIRE «SUPERA» — B0-decies, 10/08. Con la
     distanza del recettore vuota la scheda dichiarava 67.627,4 mm/s e un
     verdetto di superamento: non un numero tranquillo, un'ACCUSA falsa. E le
     guardie stanno a valle, in sette lettori (il foglio da portare in cava, il
     CSV, il file per Sentinella): il banco preme li'. */
  ['il recettore assente di Genesi', 'genesi-recettore-assente.mjs', []],
  ['recettore assente · controprova', 'genesi-recettore-assente.mjs', ['--controprova'], true],
  ['i campi di Genesi che restano vuoti', 'genesi-campi-assenti.mjs', []],
  ['campi vuoti di Genesi · controprova', 'genesi-campi-assenti.mjs', ['--controprova'], true],
  ['il piano di innesco XML di Genesi', 'genesi-piano-innesco.mjs', []],
  ['piano di innesco · controprova', 'genesi-piano-innesco.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08, e completa la domanda qui sopra: il foglio stampato
     era UNA delle uscite di Genesi, e i nove bottoni che salvano un FILE non
     li aveva ancora aperti nessuno. Aprendoli: la scheda volata archiviata col
     rapportino non diceva da dove viene la PPV (due file identici tranne una
     riga, 1.9 contro 4.1, con la legge dichiarata provvisoria dallo schermo) e
     non aveva l'airblast; la riconciliazione, coi valori reali scritti con la
     virgola come si scrive in cava, faceva SPARIRE le tre misure dallo storico
     («28→—») e le scriveva nel CSV con una convenzione decimale diversa da
     quella della colonna accanto; e il `.volata.json` consegnava lo scatter
     sorteggiato al posto del ritardo di progetto — 42,33 ms dove il pannello
     diceva 42 — tanto che riletto da Genesi stessa il progetto tornava a 25. */
  ['i documenti che escono da Genesi', 'genesi-documenti-che-escono.mjs', []],
  ['documenti da Genesi · controprova', 'genesi-documenti-che-escono.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO L'08/08. Flotta ha NOVE punti d'uscita ed era l'app grossa
     senza nessun banco che ne aprisse uno: `flotta-disegni` guarda i pixel,
     `flotta-frasi-da-uno` il singolare, e i file non li apriva nessuno. Ne ha
     misurati due, e tutt'e due dicevano una parola TRANQUILLA: la situazione
     scriveva «pianificata» su ogni ordine di lavoro — anche su quello fermo
     ad aspettare un ricambio, che a schermo è ROSSO — e il registro dei giri
     dava «tutto a posto» a un controllo che dichiara anomalie senza portarne
     l'elenco. */
  /* ⛔ AGGIUNTO L'08/08, e ha trovato la stessa famiglia per la terza volta in
     un giorno: `conti_incassi.csv` — il file che il commercialista incrocia con
     l'estratto conto — calcolava il residuo sul LORDO della fattura, ignorando
     le note di credito, mentre il foglio stampato della stessa fattura scrive
     «Da incassare … (dopo la nota di credito)». E la riga della lista leggeva
     `f.residuo` dal record, che una nota non riscrive: la schermata si
     smentiva da sola in tre punti. */
  ['i documenti che escono da Conti', 'conti-documenti-che-escono.mjs', []],
  ['documenti da Conti · controprova', 'conti-documenti-che-escono.mjs', ['--controprova'], true],
  ['i documenti che escono da Flotta', 'flotta-documenti-che-escono.mjs', []],
  ['documenti da Flotta · controprova', 'flotta-documenti-che-escono.mjs', ['--controprova'], true],
  ['nota di credito', 'nota-credito.mjs', []],
  ['nota di credito · controprova', 'nota-credito.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08. I FOGLI di Conti — fattura, DDT — li compone la
     PAGINA, e nessuna prova `node` li guardava: le suite chiamano il modulo.
     Lì dentro sono stati misurati tre difetti veri (l'aliquota 19% ricavata
     per divisione, la fattura stornata stampata «Da incassare», le righe che
     non tornano col piede dopo una correzione a mano). I casi il banco se li
     costruisce nei DATI SERVITI, mai sul disco. */
  ['i fogli stampati di Conti', 'conti-stampe.mjs', []],
  ['fogli di Conti · controprova', 'conti-stampe.mjs', ['--controprova'], true],
  ['fogli di Conti · controprova della ✎', 'conti-stampe.mjs', ['--controprova-matita'], true],
  /* ⛔ AGGIUNTO IL 06/08 — «il testo che mente», il filo nato di fianco a quello
     del disegno. Non un numero sbagliato: una FRASE che in un caso limite non
     è italiano, e in Conti quelle frasi finiscono su un sollecito e su un
     estratto conto. Con UNA fattura scaduta da UN giorno, la lettera al cliente
     diceva «(1 giorni di ritardo)» e l'estratto conto «€ 40 × 1 fatture
     scadute»; con un DDT solo, «I 1 DDT collegati tornano»; e i tre import più
     un export scrivevano «1 aggiunte», «1 prodotti aggiunti», «1 già presenti».
     Sette punti, e il modulo la regola non ce l'aveva proprio: la pagina usava
     `plur` 103 volte, `conti-data.js` — quello che compone i documenti che
     ESCONO — zero. Nella stessa passata è saltato fuori che «Lordo (t)»,
     «Tara (t)» e «Netto (t)» uscivano «LORDO (T)» a schermo E sul DDT
     stampato: il tesla al posto della tonnellata su un documento di trasporto.
     I casi limite se li costruisce lui, nei DATI SERVITI e nei file caricati. */
  ['le frasi di Conti nei casi limite', 'conti-frasi.mjs', []],
  ['frasi di Conti · controprova', 'conti-frasi.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08 — il filo «il numero è giusto e a mentire è il DISEGNO»
     portato nell'app dei soldi. Le quattro liste con la barra sotto la riga
     scrivevano `width:Math.round(pct)%`: sotto lo 0,5% della scala l'intero dà
     `width:0%`, cioè il disegno dello ZERO VERO — misurato, 12 € reali a 0 px
     accanto a due fasce vuote a 0 px. E il passo dell'1% vale 4 px, quindi
     9.750 € e 8.100 € uscivano tutt'e due a 7,88 px. Il caso (una fattura
     grande e una minuscola) se lo costruisce nei DATI SERVITI: senza un valore
     alto il difetto non si presenta, com'era successo nel core. */
  ['le barre di peso di Conti', 'conti-barre-peso.mjs', []],
  ['barre di peso di Conti · controprova', 'conti-barre-peso.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 09/08 — il filone «un numero tranquillo dove non è stato
     misurato niente», portato dove Conti non era mai stata guardata: le tele di
     `dwGrafici`. `conti-barre-peso` misura le `span.bar` delle liste e
     `graf-scala` la SCALA di queste tele; le loro QUANTITÀ, in pixel, non le
     controllava nessuno.
     Il difetto che tiene chiuso stava nella dimostrazione com'è: `valorePesata`
     risponde 0 su un DDT che non si può valorizzare — scelta dichiarata, perché
     un `null` in una somma si sommerebbe come zero comunque — ma «Venduto per
     prodotto» era l'unico dei tre elenchi a non CONTARE quello che saltava.
     Sabbia lavata 0/4 diceva «68,30 t · 3 viaggi — € 605,00» in verde con 24,3 t
     fuori da quei 605 €; e un prodotto tutto non valorizzabile usciva «€ 0,00»
     con una barra di 0 px, identica a chi non ha venduto niente. */
  ['i numeri tranquilli di Conti', 'conti-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Conti · controprova', 'conti-numeri-tranquilli.mjs', ['--controprova'], true],
  /* 02/09: il primo ponte fra app, Flotta→Conti. Tre passate perché sono tre
     esiti: Flotta risponde (tabella, riga «in tutt'e due»), Flotta NON risponde
     (tono avviso e NESSUNO zero), e la controprova che rimette la traduzione
     null→[] nella pagina e pretende che il verso «assente» cada. */
  ['il ponte Flotta→Conti nei costi', 'conti-ponte-flotta.mjs', []],
  ['ponte Flotta→Conti · Flotta assente', 'conti-ponte-flotta.mjs', ['--flotta-assente']],
  ['ponte Flotta→Conti · controprova', 'conti-ponte-flotta.mjs', ['--controprova'], true],
  ['Flotta: il consumo di un mezzo contro la sua storia', 'flotta-consumo-storia.mjs', []],
  ['consumo contro la storia · controprova', 'flotta-consumo-storia.mjs', ['--controprova'], true],
  ['il ponte Campo→Conti nel report', 'conti-ponte-campo.mjs', []],
  ['ponte Campo→Conti · Campo assente', 'conti-ponte-campo.mjs', ['--campo-assente']],
  ['ponte Campo→Conti · controprova', 'conti-ponte-campo.mjs', ['--controprova'], true],
  ['il verbale di riconciliazione di Conti', 'conti-verbale.mjs', []],
  ['verbale di riconciliazione · controprova', 'conti-verbale.mjs', ['--controprova'], true],
  /* 02/09, il verso di ritorno: Flotta chiede a Conti «questa spesa ce l'hai
     anche tu?». Stessa funzione condivisa, stessi tre esiti, stessa controprova. */
  ['il ponte Conti→Flotta nei costi dei mezzi', 'flotta-ponte-conti.mjs', []],
  ['ponte Conti→Flotta · Conti assente', 'flotta-ponte-conti.mjs', ['--conti-assente']],
  ['ponte Conti→Flotta · controprova', 'flotta-ponte-conti.mjs', ['--controprova'], true],
  /* 02/09: la fattura elettronica esce dal bottone, e il banco APRE il file:
     righe e DDT citati contro il modulo, e con un dato mancante niente file. */
  ['il file XML per lo SdI esce dalla fattura', 'conti-xml-sdi.mjs', []],
  ['XML per lo SdI · controprova', 'conti-xml-sdi.mjs', ['--controprova'], true],
  /* 02/09, ponte 3b: il muro di Scudo legge concessione (Terra) e mezzi (Flotta).
     Tre esiti come per i ponti dei costi, e la controprova rimette null→[]. */
  ['il muro di tutta la cava in Scudo', 'scudo-scadenze-unite.mjs', []],
  ['muro di tutta la cava · Terra assente', 'scudo-scadenze-unite.mjs', ['--terra-assente']],
  ['muro di tutta la cava · controprova', 'scudo-scadenze-unite.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, stessa domanda applicata a Scudo: dove l'app compone
     qualcosa che ESCE, chi decide i suoi numeri? I quattro CSV li scrive la
     pagina, e ognuno era più tranquillo dello schermo — un'azione scaduta da
     34 giorni scritta solo «aperta», la persona senza nemmeno una scadenza con
     le celle bianche, il riepilogo per la L. 198/2025 senza la nota che a
     schermo impedisce di disegnare le classifiche, la prognosi aperta come una
     cella vuota che si legge «zero giorni». */
  ['i documenti che escono da Scudo (4 CSV, 2 fogli stampati, il promemoria)', 'scudo-documenti.mjs', []],
  ['documenti di Scudo · controprova', 'scudo-documenti.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08 insieme alla dichiarazione «dati di esempio» sui due
     fogli di Scudo — il verbale di consegna dei DPI (art. 77 D.Lgs 81/2008) e
     la cartella del lavoratore. `--live` è la metà che conta quanto l'altra:
     pretende che coi dati VERI i due fogli escano **puliti**, cioè che la
     dichiarazione sappia anche tacere. Una guardia che parla sempre non
     protegge, infastidisce. */
  ['fogli di Scudo · coi dati veri tacciono', 'scudo-documenti.mjs', ['--live']],
  /* ⛔ SCRITTO IL 07/08 LA SECONDA VOLTA, e la ragione va detta perché non
     succeda una terza. La prima stesura — ventuno prove, tutte verdi — era
     rimasta **nello scratchpad**, «da portare qui alla prossima occasione».
     Poi il contenitore è ripartito, e non esiste più. È la riga di CLAUDE.md
     che nessuno prende sul serio finché non costa: una difesa che resta nello
     scratchpad, alla sessione dopo non esiste — e un banco non registrato qui
     è la stessa cosa, perché non gira mai.
     Guarda tre cose che nessuna suite `node` può vedere: la data delle
     prescrizioni che compare SOLO col suo esito **e non resta scritta** quando
     l'esito cambia (nascondere un campo non svuota quello che c'è dentro), e
     la colonna del CSV che deve dire **esattamente** la parola della pastiglia
     dello scadenzario — dove un'app compone qualcosa che ESCE, chi decide i
     suoi numeri? */
  ['la verifica periodica delle attrezzature (all. VII)', 'scudo-verifica-periodica.mjs', []],
  ['verifica periodica · controprova', 'scudo-verifica-periodica.mjs', ['--controprova'], true],
  /* ⛔ DECISIONE 5a, e la domanda è il COLLEGAMENTO. Le parole («non è stato
     salvato», mai un codice d'errore) stanno in `shared/` e le prova
     `run-helpers.mjs`; quello che `node` non può vedere è che ognuna delle sei
     app le MONTI davvero — una funzione giusta che non chiama nessuno non
     protegge niente. La misura che l'ha resa urgente: 109 punti scrivono sul
     database e 103 non hanno nessun `catch`, quindi un rifiuto era MUTO. */
  ['un salvataggio che fallisce non resta muto (6 app)', 'salvataggio-muto.mjs', []],
  ['salvataggio muto · controprova', 'salvataggio-muto.mjs', ['--controprova'], true],
  /* ⛔ E IL VERSO PRIMA: accorgersi di essere senza rete PRIMA di compilare,
     non dopo aver premuto Salva. Misurato il 07/08: zero app su sei guardavano
     `navigator.onLine`, e in cava è il modo in cui una scrittura fallisce più
     spesso di tutti. Il banco misura tutt'e due i versi — che la fascia
     compaia e che sappia SPARIRE — e pretende che NON prometta di salvare
     appena torna la linea: la persistenza offline non è configurata, e quella
     sarebbe la peggior categoria di messaggio, quello che rassicura a vuoto. */
  ['senza rete la fascia lo dice, e non promette niente (6 app)', 'senza-rete.mjs', []],
  ['senza rete · controprova', 'senza-rete.mjs', ['--controprova'], true],
  ['il verbale dice come è nato il numero', 'verbale-origine.mjs', []],
  ['verbale · controprova', 'verbale-origine.mjs', ['--controprova'], true],
  ['la manina promette un tocco che c\'è', 'promesse-tocco.mjs', []],
  ['la manina · controprova', 'promesse-tocco.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 01/08. `fuori-schermo` guarda i COMANDI fuori dallo schermo
     e lo scorrimento della PAGINA: una modale chiusa è larga zero e viene
     saltata, e un testo che trabocca dentro il suo riquadro non muove nessuna
     delle due cose. Una causale da 491 px in 352 gli è passata sotto — la
     trovò uno scatto. Il banco dichiara che apre le modali in QUATTRO app su
     sei: dire «nessuna fuori posto» senza dire su quante si è guardato è lo
     stesso «zero violazioni» ottenuto su zero soggetti. */
  ['il contenuto delle finestre di conferma ci sta dentro', 'modali.mjs', []],
  ['finestre di conferma · controprova', 'modali.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 02/08, e non è un doppione di quello qui sopra. `modali.mjs`
     si apre la strada con UN gesto generico (il primo `[title^="Rimuovi"]` di
     ogni sezione): raggiunge quattro app su sei e una modale per sezione, e
     misura una cosa sola. Questo GUIDA l'app — clicca i comandi finché non ha
     provato tutte le forme — e misura le tre cose che il 01/08 ha trovato solo
     un occhio umano: l'unità in maiuscolo, il testo tagliato (comprese le
     tendine, che NON dichiarano di tagliare: misurato, un `<select>` risponde
     scrollWidth === clientWidth anche con l'opzione al doppio) e quello che
     esce dal suo spazio, a 320 px oltre che a 390.
     Costa una mezz'ora sulle quattordici superfici: con `--solo=` sono secondi. */
  ['dentro le modali (unità, tagli, spazio)', 'modali-dentro.mjs', []],
  ['dentro le modali · controprova', 'modali-dentro.mjs', ['--controprova'], true],
  /* la controprova a SOGLIE: due difetti veri con due soglie diverse (320 e
     360). Sta a parte perché gira anche a 360 px, che il giro normale non fa, e
     perché insieme all'allungamento generico di A/B/C la separazione fra le due
     soglie sparirebbe — e quella separazione È la prova che il righello misura
     la LARGHEZZA e non «c'è qualcosa che non va». `--solo=scudo`: le due
     etichette sono di Scudo, e così dura meno di due minuti. */
  ['dentro le modali · controprova soglie', 'modali-dentro.mjs', ['--controprova', '--iniezione=D', '--solo=scudo'], true],
  /* le VOCI DI TENDINA dentro le finestre, col righello del BROWSER
     (`width:max-content`) invece di `clientWidth - padding`: quest'ultimo è
     cieco sui ~20 px della freccia — che Chromium disegna DENTRO la scatola del
     contenuto, non dentro il padding — ed è la banda in cui viveva il taglio di
     `#vf-esito`. Il banco stampa a ogni giro quanto è larga quella banda.
     ⏱️ È un righello DOPPIO, e lo sa: la domanda giusta `modali-dentro` la fa
     già da mesi, sbagliando la misura. Quando quella riga sarà corretta, questo
     banco va TOLTO, non lasciato a sorvegliare due volte la stessa cosa. */
  ['le voci di tendina stanno nelle tendine', 'tendine-nelle-finestre.mjs', []],
  ['voci di tendina · controprova', 'tendine-nelle-finestre.mjs', ['--controprova'], true],
  /* ⛔ E IL CORE A PARTE, DAL 10/08. Senza argomenti il banco guarda solo Scudo
     (`CANDIDATE`): finché questa riga non c'è, le tendine del core restano non
     misurate a 360 e 430 px — che è la METÀ di B4-bis (la morte del banco era la
     causa, la cecità l'effetto). Passata sua perché il core costa più di Scudo
     (67 finestre per larghezza contro 6) e perché il suo totale di prove va letto
     separato: mescolato a quello di Scudo, un core che non si apre più si
     nasconderebbe dentro un numero che cambia per altri motivi.
     Costo misurato il 10/08: core 469 s, Scudo 143 s — dentro il tetto. */
  ['le voci di tendina del core', 'tendine-nelle-finestre.mjs', ['--solo=core']],
  ['voci di tendina del core · controprova', 'tendine-nelle-finestre.mjs', ['--controprova', '--solo=core'], true],
  /* ⛔ I TRE TEMI SONO ENTRATI IL 07/08, E IL BUCO ERA GROSSO. Questo banco
     guardava il tema BUIO soltanto, e nel tema SOLE — quello che serve a
     leggere il telefono in cava, cioè il posto dove il prodotto vive — la
     regola condivisa `body.dw.outdoor-mode .nav button{font-size:11px}` sta
     fuori da ogni `@media` e con specificità (0,3,2) batte i gradini `.nav
     button` (0,1,1) di ogni foglio. Misurato prima della correzione:
     Sentinella tagliata a TUTTE le larghezze (fino a 141 px a 320: due voci
     intere sparite), Flotta 316 in 300, Terra 311 in 300 — e in Conti otto
     etichette su dieci tagliate a 430 px, che nessuna delle due misure vedeva.
     ⛔ E LA SECONDA DOMANDA HA TROVATO PIÙ DELLA PRIMA. La domanda sulla BARRA
     («il contenuto ci sta?») diventa cieca se il BOTTONE ha `overflow:hidden`:
     la sua min-content va a zero, le colonne non crescono, la barra non
     trabocca MAI e il banco dice «ok» qualunque cosa succeda alle parole. È il
     caso di Conti da quando ha dieci voci. Adesso il banco chiede anche *la
     parola sta nel suo bottone?*, misurata con un `Range` sul nodo di testo. */
  /* ⛔ LA MISURA DI E8, PORTATA DENTRO. `docs/E8_LE_PAGINE_AFFIANCATE.md`
     rimandava a uno script nello SCRATCHPAD, cioè a una difesa che alla
     sessione dopo non esiste — lo stesso difetto della prova della verifica
     periodica di Scudo. Pinza solo ciò che E8 ha misurato IDENTICO; le
     etichette della barra restano a `barra-etichette.mjs`, che chiede la
     domanda giusta invece di pretendere un corpo unico. */
  ['le pagine sembrano la stessa famiglia', 'famiglia-strutture.mjs', []],
  ['famiglia delle strutture · controprova', 'famiglia-strutture.mjs', ['--controprova'], true],
  ['le etichette della barra stanno nella loro colonna', 'barra-etichette.mjs', []],
  ['etichette della barra · tema chiaro', 'barra-etichette.mjs', ['--tema=chiaro']],
  ['etichette della barra · tema sole', 'barra-etichette.mjs', ['--tema=sole']],
  ['etichette della barra · controprova', 'barra-etichette.mjs', ['--controprova'], true],
  ['etichette della barra · controprova sole', 'barra-etichette.mjs', ['--controprova', '--tema=sole'], true],
  /* ⛔ AGGIUNTO IL 13/08. `fuori-schermo` chiede «esce dallo SCHERMO?» e
     `barra-etichette` chiede «l'etichetta sta nella sua colonna?»: nessuna
     delle due sa vedere il traboccamento ALL'INDIETRO, perché
     `scrollWidth > clientWidth` non cambia di un pixel quando il contenuto
     esce dalla parte opposta. Nel core la pastiglia «NON SALVA» stava sopra il
     nome dell'utente a ogni larghezza fra 361 e 560 px — 65,31 px fuori dalla
     scatola del padre a 430 — e le due domande di sopra dicevano «pulito».
     Il ramo del TOCCO è una passata a sé e non un lusso: Chromium da scrivania
     non è `pointer:coarse`, e lì il difetto arrivava fino a 320 px.
     ⚠️ E LE LARGHEZZE SONO DIVISE FRA LE PASSATE PERCHÉ IL COSTO È MISURATO,
     non temuto: quattordici superfici per dieci larghezze sono 140 aperture e
     più di mezz'ora — un banco che costa mezz'ora allunga il giro senza dire
     niente di nuovo, perché il difetto vive dove la barra è PIENA. Quindi:
     tutte le superfici alle tre larghezze che contano (390 · 430 · 431, cioè i
     due gradini), e il core a tutte e dieci. Misurato: tutte le superfici a due
     larghezze = 28 misure, 14 barre, 0 da guardare; il core a dieci = 10 barre,
     104 figli, 0. */
  ['la barra in alto non trabocca all\'indietro', 'barra-alto-indietro.mjs', ['--larghezze=390,430,431']],
  ['barra in alto · il core a tutte le larghezze', 'barra-alto-indietro.mjs', ['--solo=core']],
  ['barra in alto · ramo tocco', 'barra-alto-indietro.mjs', ['--solo=core', '--tocco']],
  ['barra in alto · tema chiaro', 'barra-alto-indietro.mjs', ['--solo=core', '--tema=chiaro']],
  ['barra in alto · controprova', 'barra-alto-indietro.mjs', ['--controprova', '--solo=core'], true],
  ['barra in alto · controprova tocco', 'barra-alto-indietro.mjs', ['--controprova', '--tocco', '--solo=core'], true],
  ['la quota di base è nel sistema del rilievo', 'quota-base-reale.mjs', []],
  ['quota di base · controprova', 'quota-base-reale.mjs', ['--controprova'], true],
  ['il registro costi', 'registro-costi.mjs', []],
  ['registro costi · controprova', 'registro-costi.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08. Il libretto macchina di Flotta è la pagina che si
     stampa per un controllo e si consegna a chi compra la macchina; accanto
     c'è il bottone che ne esporta il CSV. I due documenti li COMPONE LA
     PAGINA, e le prove chiamano il modulo: su una macchina appena inserita lo
     schermo dichiarava sei volte quello che non c'era e il file usciva di
     quattro righe. Si misura premendo il bottone e aprendo il file. */
  ['il libretto e i suoi vuoti (Flotta)', 'libretto-vuoti.mjs', []],
  ['libretto e vuoti · controprova', 'libretto-vuoti.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTI IL 01/08: c'erano da giorni e NON LI LANCIAVA NESSUNO —
     ne' questa lista ne' `npm test`. `giro-su-copia` prova per giunta il
     meccanismo su cui tutto questo giro adesso si appoggia. Trovati da
     `suite-collegate.mjs`, che esiste per non riprovarci. */
  ['il giro gira su una copia', 'giro-su-copia.mjs', []],
  ['contrasto del core', 'contrasto-core.mjs', []],
  ['stati «non misurato» visibili', 'stati-non-misurati.mjs', []],
  ['stati «non misurato» · controprova', 'stati-non-misurati.mjs', ['--controprova'], true],
  ['il salvataggio che non riesce (Flotta, senza rete)', 'salvataggio-offline.mjs', []],
  ['salvataggio senza rete · controprova', 'salvataggio-offline.mjs', ['--senza-guardia'], true],
  /* ⛔ AGGIUNTO IL 03/08. `stati-non-misurati.mjs` guarda gli stati vuoti a
     SCHERMO; questo guarda i DOCUMENTI che escono dall'azienda — il prospetto
     annuale per l'ente, il suo CSV e il verbale di rilievo — su un anno che
     nessuno ha misurato e su un rilievo il cui volume non si legge. Tre zeri
     tranquilli su tre documenti, e nessuna suite `node` poteva vederli: le
     frasi e le celle vivono nella pagina. */
  ['i documenti di Terra e gli zeri mai misurati', 'terra-numeri-tranquilli.mjs', []],
  ['zeri mai misurati · controprova', 'terra-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08, ed è una famiglia TERZA rispetto alle due qui
     intorno: non il numero sbagliato (`terra-numeri-tranquilli`) né il disegno
     che mente (`terra-geometrie`), ma la FRASE — la parola incollata al numero
     che, quando il numero è uno, dice una cosa non italiana. Undici frasi in
     Terra, fra cui «1 indicativi» sul prospetto che va all'ente e «Import
     fronti: 1 aggiunti», che è il primo messaggio che si legge provando
     l'import con una riga sola. Nessuna suite `node` le vede: le regole pure
     stanno in `run-kpi.mjs`, ma che la PAGINA le chiami lo dice solo il
     browser. */
  /* ⛔ AGGIUNTO IL 06/08. LA STESSA FAMIGLIA, MA SU TUTTE LE SUPERFICI E SENZA
     COSTRUIRE NIENTE: cerca «1 <parola al plurale>» nel testo RESO di ogni
     schermata. Nasce perché quel giorno il censimento a `grep` ha detto «nel
     core non resta niente» e la pagina, con un solo rapportino, diceva ancora
     «1 rapportini · 1 fori»: il codice scrive quella frase in tre dialetti
     (`${n} fori`, `+' fori'`, `<b>${n}</b> fori`) e una ricerca a testo ne
     conosce solo quelli che le hai insegnato. Ha trovato subito un «1
     rapportini» in Campo che nessuno stava cercando.
     ⚠️ E al primo giro ha accusato un innocente — «1 MEZZI» in Flotta, che
     erano DUE piastrelle di KPI unite dall'a capo di `innerText`: adesso fra
     il numero e la parola accetta solo uno spazio vero. */
  ['«1 fori» su tutte le superfici', 'uno-solo.mjs', []],
  ['«1 fori» · controprova', 'uno-solo.mjs', ['--controprova'], true],
  /* ⛔ QUANDO SI IMPORTA UN CSV E A UNA RIGA MANCA UN NUMERO, L'APP LO DICE?
     Il rovescio della passata sui file che ESCONO. Il `.filter` che scarta una
     riga sta DENTRO il lettore, che restituisce solo i sopravvissuti: fino al
     13/08 nove lettori su nove perdevano righe in silenzio e la pagina non
     poteva dirlo nemmeno volendo. Le prove `node` guardano il SORGENTE (che le
     funzioni contino giusto e che la pagina le chiami); qui si preme il
     bottone vero e si legge la frase che compare — la guardia COLLEGATA. */
  ['le righe che l\'import non fa entrare', 'import-righe-perse.mjs', []],
  ['righe non entrate · controprova', 'import-righe-perse.mjs', ['--controprova'], true],
  ['le frasi di Terra quando il numero è uno', 'terra-frasi-da-uno.mjs', []],
  ['frasi da uno · controprova', 'terra-frasi-da-uno.mjs', ['--controprova'], true],
  /* ⚠️ `flotta-frasi-da-uno` NON usa la porta che gli passiamo: alza un server
     suo (con il contrassegno del pid, e fallisce se la porta è occupata),
     perché deve servire un `flotta-data.js` con UN dato solo per riga. La
     porta in coda gli arriva e la ignora — è dichiarato, non dimenticato. */
  ['le frasi di Flotta quando il numero è uno', 'flotta-frasi-da-uno.mjs', []],
  /* ⛔ IL NUMERO UNO NELLE FRASI DI FLOTTA E SENTINELLA — 10/08. `flotta-frasi-da-uno`
     esisteva dal 06/08 e NON prendeva queste: gira su `#dash-*`, `#mez-list`,
     `#fer-riep`, gli export e il libretto, e non tocca la scheda della
     manutenzione, il magazzino, l'import del parco, né `#dash-sca`. Un banco che
     copre una famiglia non la copre dappertutto: il denominatore va guardato. */
  ['«1 foro» e non «1 fori» in Flotta e Sentinella', 'frasi-da-uno-flotta-sentinella.mjs', []],
  ['frasi da uno · controprova', 'frasi-da-uno-flotta-sentinella.mjs', ['--controprova'], true],
  ['frasi di Flotta · controprova', 'flotta-frasi-da-uno.mjs', ['--controprova'], true],
  ['le frasi di Campo e Sentinella con un dato solo', 'campo-sentinella-frasi.mjs', []],
  ['frasi di Campo e Sentinella · controprova', 'campo-sentinella-frasi.mjs', ['--controprova'], true],
  ['le frasi di Scudo quando il numero è uno', 'scudo-frasi-da-uno.mjs', []],
  ['frasi di Scudo · controprova', 'scudo-frasi-da-uno.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08 — lo stesso gesto portato in Conti, che una suite sui
     casi limite ce l'aveva già (`conti-frasi.mjs`) ma nata LEGGENDO il codice.
     Aprendo l'app con un dato per collezione sono usciti 13 difetti che quella
     non poteva vedere, tutti col sostantivo GIÀ giusto e il resto della frase
     no: gli otto «Esportate 1 fattura / Esportati 1 cliente», «Letti 1
     movimento», «Vengono eliminati anche i 1 incasso registrato», «Escluse 1
     già scadute» in due punti, e uno nel MODULO — `margineMese` scriveva
     «mancano i costi di personale» con una voce sola, mentre quattro righe
     sotto la stessa funzione il singolare lo faceva già.
     ⚠️ Come `flotta-frasi-da-uno`, NON usa la porta che gli passiamo: alza un
     server suo (col contrassegno del pid) perché deve servire DUE varianti
     dello stesso `conti-data.js` nella stessa passata. `DW_RADICE` lo legge,
     quindi sulla copia misura la copia. */
  ['le frasi di Conti quando il numero è uno', 'conti-frasi-da-uno.mjs', []],
  ['frasi di Conti da uno · controprova', 'conti-frasi-da-uno.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08, ed è la famiglia che il 06/08 è stata censita nel
     core: il numero è giusto e a mentire è il DISEGNO. Là una barra da 2.261,7
     m³ ne disegnava 3, identica ai cinque mesi a zero, perché `height:100%` si
     risolveva contro un genitore alto `auto`; e non l'aveva vista nessuno
     perché senza dati d'esempio nessuna barra era mai stata alta. Questo banco
     misura col righello ogni geometria di Terra — barra della vita cava, tacca
     della soglia, avanzamenti, tre grafici a barre, la riga del pro-quota — e
     non chiede «il disegno c'è?» ma «i pixel stanno fra loro come i valori?»,
     con una scena che inietta un mese 200 volte più grande. Ha trovato due
     disegni che pretendevano una misura che non c'era: la barra dell'anno nel
     Quadro su un anno senza rilievi, e la testa del riempimento su un consumo
     di zero m³. Nessuna suite `node` li poteva vedere: sono pixel. */
  ['le geometrie di Terra, misurate in pixel', 'terra-geometrie.mjs', []],
  ['geometrie di Terra · controprova', 'terra-geometrie.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08, stesso filo e stessa domanda col righello, su Flotta.
     Le dieci geometrie dell'app (otto grafici più la tacca del riferimento di
     settore e il taglio di Pareto) passano tutte dal motore condiviso, e in
     quattro scene — compreso un valore MILLE volte più grande, uno zero
     misurato e il parco vuoto — i pixel stanno fra loro come i valori: sulla
     geometria Flotta è pulita, ed è un risultato, non un'assenza di risultato.
     Il difetto trovato è di fianco e sullo stesso grafico: `#graf-disp`
     dichiarava una QUOTA SUL TOTALE su una serie di percentuali che non si
     sommano (una giornata all'83% «vale il 12,8%» di un totale di 650, e la
     giornata a zero mezzi operativi «lo 0,0%»). La controprova rimette quattro
     difetti — due in Flotta e due nella copia SERVITA del motore, mai sul
     disco: lo zero disegnato col minimo della barra e l'asse che non parte da
     zero — perché senza quei due resterebbe da dimostrare che questo banco una
     barra sproporzionata la saprebbe vedere. */
  ['i disegni di Flotta, misurati in pixel', 'flotta-disegni.mjs', []],
  ['disegni di Flotta · controprova', 'flotta-disegni.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, e la ragione è dichiarata: la regola sta in
     `shared/` ed è provata da otto blocchi in `run-kpi`, ma che l'ELENCO la
     chiami, che la scheda scriva la ragione invece di far sparire la riga e
     che il riepilogo dichiari quanti rapportini ha lasciato fuori, `node` non
     lo può vedere. Senza questo banco la difesa viveva solo negli scatti di
     uno scratchpad, che alla sessione dopo non esistono. */
  ['il core e i rapportini mai misurati', 'core-rapportini-non-misurati.mjs', []],
  ['rapportini mai misurati · controprova', 'core-rapportini-non-misurati.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08, gemello del banco qui sopra sull'ALTRO documento del
     core. Stessa decisione (`misureVolataProgetto` in `shared/`), quarta copia
     debole: documento, scheda e riquadro la chiamavano, l'ELENCO no — e
     scriveva «0 mc» dove nessuno aveva misurato le profondità, facendo sparire
     del tutto i chili quando erano zero. La dimostrazione lo mostrava da mesi
     («10 fori · 787.5 mc», tutti i fori con `kg:''`) e nessuna prova guardava. */
  ['il core e le volate mai misurate', 'core-volate-non-misurate.mjs', []],
  ['volate mai misurate · controprova', 'core-volate-non-misurate.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08, ed è il banco che apre una schermata che NESSUN altro
     aveva mai aperto: `nav('dashboard')` sollevava «Chart is not defined»
     (Chart.js viene da un CDN), quindi ogni banco che «guardava il core» la
     saltava in silenzio — la famiglia dello «0 modali su 68», un piano sotto.
     Sotto ci stavano tre rettangoli vuoti che non dicevano perché: il
     principio del fondatore applicato a un DISEGNO invece che a un numero. */
  ['la Dashboard del core senza rete', 'core-dashboard-senza-rete.mjs', []],
  ['Dashboard senza rete · controprova', 'core-dashboard-senza-rete.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08, coda della Dashboard: i bottoni «PDF» stanno in fondo
     a quella schermata, e la loro guardia guardava UNA libreria su due. La
     riga `if(!window.jspdf)` era scritta otto volte identica, ma tutt'e otto
     le esportazioni disegnano con `d.autoTable` — secondo script, zero
     controlli su undici chiamate. E «una c'e' e l'altra no» e' uno stato che
     il service worker permette apposta: precacha ogni indirizzo con il proprio
     `.catch()`. Misurato: nessun PDF e NESSUN messaggio. */
  ['il PDF senza il suo plugin', 'core-pdf-senza-plugin.mjs', []],
  ['PDF senza plugin · controprova', 'core-pdf-senza-plugin.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, stessa famiglia di `terra-numeri-tranquilli` e stessa
     ragione: in Sentinella il principio del fondatore è NATO, il modulo lo
     applica in una dozzina di punti — e i quattro numeri tranquilli rimasti
     stavano tutti dove quel lavoro ESCE dall'app. Il file per l'ARPA scriveva
     una soglia diversa da quella di ogni schermata, `undefined` e «tra NaN
     gg»; il riepilogo sopra il registro volate sommava come zero i chili che
     nessuno ha dichiarato; e la scheda dell'andamento chiudeva con
     «Superamenti: 0 → 0» sotto la frase «i superamenti non si possono
     contare». Le tre regole sono state spostate nel modulo e hanno la loro
     prova in `run-kpi`; che il BOTTONE produca davvero quel file e che la
     scheda scriva davvero quella frase, `node` non lo può vedere. */
  ['i numeri tranquilli che escono da Sentinella', 'sentinella-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Sentinella · controprova', 'sentinella-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, terza passata sul documento che va all'ente: non più
     «che numero scrive» ma «che cosa dichiara di NON sapere», e se lo dichiara
     dove qualcuno lo legge. Tre cose che solo il browser vede, perché il
     documento lo COMPONE la pagina: il periodo dichiarato (dodici mesi) contro
     quello davvero misurato (tre), i punti mai misurati accanto al verdetto —
     la riga del denominatore si accendeva solo sui punti senza soglia — e il
     conto delle tarature PER PUNTO, che il modulo calcolava da sempre e che
     nessuno leggeva. Guarda anche il foglio in `@media print`: è quello che
     il cliente consegna. */
  ['le dichiarazioni del report di Sentinella', 'sentinella-report-dichiarazioni.mjs', []],
  ['dichiarazioni del report · controprova', 'sentinella-report-dichiarazioni.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 13/08 (riga B4). Il documento poteva essere vero e rispondere
     a UN'ALTRA DOMANDA: lo scadenzario sapeva quando va consegnato un
     adempimento, il Report faceva digitare «dal» e «al», e fra le due cose non
     c'era niente — quindi il periodo lo indovinava chi premeva il bottone, e
     due date scritte a mano non sono smentite da niente. Qui si prova quello
     che `node` non vede: che le date arrivino NEI CAMPI, che a schermo ci sia
     scritto DI CHE periodo si tratta, che quella frase SPARISCA appena le date
     si toccano (se restasse direbbe il falso), e soprattutto che quando il
     periodo NON si ricava il bottone dica cosa manca invece di portare a un
     trimestre plausibile. `--difetto=N` mette una iniezione sola: con tutte
     insieme due difetti si mascherano a vicenda. */
  ['dalla scadenza al report di quel periodo (Sentinella)', 'sentinella-periodo-adempimento.mjs', []],
  ['periodo dell\'adempimento · controprova', 'sentinella-periodo-adempimento.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08. LA FORMA IN CUI A MENTIRE È IL DISEGNO, non il numero.
     Nel core, quel giorno, la barra di luglio dichiarava `2261.7 mc` e veniva
     disegnata 3 px — identica ai cinque mesi a zero — perché `height:100%` si
     risolveva contro un'altezza `auto`. CSS valido, percentuale presente, zero
     errori: solo una misura in pixel lo diceva. In Sentinella quella forma
     costa di più, perché qui i disegni dicono conforme o superamento: il banco
     misura ogni geometria in pixel e pretende il RAPPORTO fra valori diversi
     (un campione solo non distingue «funziona» da «sono tutti uguali»), poi
     chiede quale fra una lettura sopra soglia e la linea di soglia stia più in
     alto. Ha trovato che la MINIATURA del Quadro contraddice il badge che le
     sta sopra su una lettura pari alla soglia: il difetto è in `disegnaSpark`
     di shared/dw-grafici.js, che decide con `>` mentre tutta Sentinella conta
     `>=`. Finché quella riga non cambia, questo banco è KO di proposito. */
  ['i disegni di Sentinella, misurati in pixel', 'sentinella-disegni.mjs', []],
  ['disegni di Sentinella · controprova', 'sentinella-disegni.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08, stessa famiglia, su Scudo. Qui il censimento ha
     cambiato la domanda: su dodici tappe i soggetti con una geometria sono 91,
     e le geometrie che rappresentano una QUANTITÀ sono NOVE — tutte del motore
     condiviso. Scudo non disegna niente di suo (nessun SVG a mano, nessuna
     dimensione calcolata dentro uno style in linea, e il Quadro ne ha zero),
     quindi il banco non cerca la barra scritta male: controlla che quello che
     Scudo PASSA al motore produca un disegno che dice la stessa cosa dei suoi
     numeri. Le nove sono tutte proporzionali e gli zeri si disegnano zero; il
     controllo che vale per questa app è il QUARTO difetto della controprova,
     che è di Scudo e non del motore — `serieDi` che scrive `null` sugli anni
     senza ore lavorate. Messo a `0`, la linea degli indici passa per l'anno
     perfetto che nessuno ha misurato, appoggiato sull'asse accanto agli zeri
     veri, e non si distingue più da loro. */
  ['i disegni di Scudo, misurati in pixel', 'scudo-disegni.mjs', []],
  ['disegni di Scudo · controprova', 'scudo-disegni.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, stessa famiglia dei due qui sopra. Su Campo il
     censimento statico era a ZERO, e i tre difetti sono usciti lo stesso: il
     CSV dello storico scriveva `0` minuti di fermo su una giornata con tre
     guasti mai misurati (identica a una senza fermi), lo storico lasciava
     sparire senza dirlo ogni registrazione priva di giorno — 2.300 t nella
     sola dimostrazione — e la frase del ponte con Terra contava i rapportini
     entrati nei metri cubi con una sottrazione che toglieva UN rapportino per
     QUALUNQUE numero di viaggi. Le funzioni nuove sono provate in `run-kpi`;
     che il bottone produca quel file, che l'avviso compaia e che la frase sia
     quella, lo dice solo il browser. */
  ['i numeri tranquilli che escono da Campo', 'campo-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Campo · controprova', 'campo-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 06/08, la domanda col righello su Campo. Il censimento a
     tappeto (percentuali negli style inline, SVG con dimensioni calcolate,
     min-width/min-height, su tutte e cinque le schermate) dice che le
     geometrie di Campo sono CINQUE e passano TUTTE dal motore condiviso: zero
     disegni scritti a mano, e il Quadro — la prima schermata — non ne ha
     nessuna. La proporzione è giusta dappertutto, anche con un valore 200
     volte più grande degli altri, e gli zeri veri si disegnano a zero pixel.
     Il difetto è un piano più sotto e non sta nel rapporto: in `#set-graf` una
     colonna a ZERO voleva dire tre cose diverse e la pagina le raccontava come
     una sola. Con 5.000 m³ in una giornata e 300 t in un'altra l'asse va in m³
     (5.000 > 510) e le giornate delle tonnellate escono a 0 px, identiche alle
     giornate vuote — mentre la lista sotto scrive «prodotto 300 t» e la nota
     dichiarava, di tutte, «le colonne a zero sono giornate senza
     registrazioni». L'aria diceva la stessa bugia a chi non vede: «03/08/2026
     0». Il grafico gemello, dodici funzioni più su, quella difesa ce l'aveva
     già. La controprova rimette la frase vecchia e spegne il conto. */
  ['i disegni di Campo, misurati in pixel', 'campo-disegni.mjs', []],
  ['disegni di Campo · controprova', 'campo-disegni.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 07/08. Stessa famiglia dei sei banchi qui sopra vista un
     piano più sotto: là il disegno mentiva sul VALORE, qui non mente nemmeno
     il disegno — mentono le sue DIMENSIONI. Il motore condiviso costruiva il
     `viewBox` misurando l'OSPITE che l'app gli indica, ma dentro l'ospite ci va
     una `<figure class="dwg">` col suo padding: il disegno nasceva alla misura
     di fuori e il browser lo rimpiccioliva per farlo stare dentro. Proporzioni
     giuste, valori giusti, console pulita — sbagliata la SCALA, cioè la
     dimensione vera dei testi.
     ⚠️ E il conto scritto il 06/08 era largo di due terzi al contrario: il
     documento diceva «Terra ×0,925, Flotta ×1, Sentinella ×1, uno su tre»
     perché aveva misurato le tre schermate d'APERTURA. A tappeto, su tutte le
     sezioni di tutte le superfici: **24 grafici su 38 fuori scala, in cinque
     app su sei**. La riga mandava a lavorare su una app sola.
     Sta qui e non in `run-kpi` perché non c'è nessuna funzione pura da
     chiamare: la misura è `clientWidth` di un elemento vivo contro
     `svg.viewBox.baseVal`. Tre iniezioni, ognuna con l'insieme di asserzioni
     che DEVE far cadere: la regola tolta, il solo ridisegno tolto (che è il
     punto che scatta navigando verso una sezione che era nascosta) e il
     viewBox inchiodato a 500 — quest'ultima perché le prime due cadono solo
     dove c'è il padding, e senza resterebbe da dimostrare che sui quattordici
     grafici già in scala il banco sappia bocciare. */
  ['la scala dei grafici (pixel contro viewBox)', 'graf-scala.mjs', []],
  /* ⚠️ LA CONTROPROVA GIRA A UNA VIEWPORT SOLA (`--stretto`), ed è una scelta
     dichiarata invece che una svista: la seconda viewport serve a separare due
     numeri che a 430 px COLLIDONO (l'ospite largo 398 e il ripiego
     `innerWidth-32`, anche lui 398) — cioè serve a rendere LEGGIBILE la misura,
     non a scoprire il difetto. Per far cadere il banco bastano i 38 grafici di
     una viewport, e il giro ci mette la metà del tempo. */
  ['scala dei grafici · controprova', 'graf-scala.mjs', ['--controprova', '--stretto'], true],
  /* ⛔ AGGIUNTO IL 03/08, stessa famiglia dei quattro qui sopra, su Scudo.
     Cinque punti, e tutti col colore o la parola tranquilla: la pastiglia
     «tutte regolari» su tre visite mediche dalla data illeggibile (il terzo
     secchio di `coperturaFormazione` era un `else`); il muro delle scadenze
     che raccontava quelle stesse righe come «cadono più in là»; la mansione
     che passava da «1/2» a «1/1» perché l'assegnato cancellato dall'anagrafica
     cade nel `.filter(Boolean)`; la cartella che si esibisce all'ispettore,
     che stampava la CHIAVE interna del DPI («maschera») e non diceva quali
     consegne sono scadute; e la scheda dell'andamento degli indici, verde «In
     miglioramento» su un indice di gravità che deve ancora salire — la
     bandiera `noto` c'era e non la leggeva nessuno.
     Le funzioni nuove sono provate in `run-kpi`; che la pastiglia sia di
     quel colore, che il foglio stampato dica quelle parole e che la voce
     della tendina ci stia a 390 px, lo dice solo il browser. */
  ['i numeri tranquilli che escono da Scudo', 'scudo-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Scudo · controprova', 'scudo-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 03/08, seconda passata su Genesi dopo i cinque numeri
     tranquilli corretti la mattina dentro `genesi-data.js`. I quattro rimasti
     stavano tutti dove `node` non arriva: un campo SVUOTATO nella
     progettazione non diceva niente, e le ventotto righe della scheda
     validatori restavano quelle di prima — powder factor 0,55 kg/m³, X50 28
     cm, burden minimo 2,4–2,8 m, PPV 6,4 mm/s — calcolate su una spalla che
     sullo schermo non c'era più; «Limite PPV (mm/s);null» scritto per intero
     nel CSV che il fochino archivia col rapportino, mentre duecento righe più
     in giù la stessa `null` era già una cella vuota; DUE copie più deboli di
     `csvCell` sopravvissute alla correzione del 03/08, che lasciavano uscire
     NUDA una formula dal CSV della legge di sito e dal file che importa
     Sentinella; e la bandiera `pochi` — «legge di sito provvisoria» — letta
     dalla sola modale della legge e non dalle due schermate che quel numero
     lo usano per decidere se una volata si può sparare.
     Il giro dei due CSV e la bandiera sono provati in `run-kpi`; che il campo
     torni a mostrare il valore del progetto, che il toast lo dica, che il
     bottone produca davvero quel file e che la riga della PPV scriva
     «provvisoria», lo dice solo il browser. */
  ['i numeri tranquilli di Genesi', 'genesi-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Genesi · controprova', 'genesi-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 13/08, E LA RAGIONE È QUESTO ELENCO. Sei app avevano il
     loro banco «numeri tranquilli» — Conti, Terra, Sentinella, Campo, Scudo,
     Genesi — e Flotta no: è la regola della settimana applicata a sé stessa,
     «un numero è sorvegliato solo dove il controllo ARRIVA», e l'elenco di
     dove arriva va guardato quanto il numero.
     Ha trovato due difetti, tutti e due nella PAGINA e tutti e due la quarta
     copia di una regola già scritta nello stesso file: la riga di «quanto
     costa un'ora» che si spezzava in due «ma» (mentre la pagella, ottocento
     righe più sotto, la scriveva già giusta), e «€ 0,00» sulla lista dei
     costi dove l'importo non era mai stato scritto. Il modulo, provato prima
     con ventotto chiamate all'assenza, non aveva niente. */
  ['i numeri tranquilli di Flotta', 'flotta-numeri-tranquilli.mjs', []],
  ['numeri tranquilli di Flotta · controprova', 'flotta-numeri-tranquilli.mjs', ['--controprova'], true],
  /* ⛔ E DAL 06/08 LE FRASI, non i numeri. Il numero era giusto e a mentire era
     la frase intorno: undici punti incollavano un plurale a un conto che può
     valere uno («Consuntivo importato: 1 fori», «Il file ha 1 righe», e —
     nella scheda in cui si decide la carica — «Qui 1 fori fuori finestra», che
     si raggiunge con la maglia a 3 fori × 2 file e la finestra di default); e
     la RICONCILIAZIONE mostrava la PPV prevista senza dire su che cosa è
     tarata, quindi lo stesso progetto passava da 6,4 a 2,8 mm/s con la stessa
     identica riga — che poi finisce nello storico e nel CSV che esce
     dall'azienda. L'identità `_ricPlur === conta` la prova `run-kpi`; che le
     frasi escano davvero così lo dice solo il browser. */
  ['le frasi limite di Genesi', 'genesi-frasi-limite.mjs', []],
  ['frasi limite di Genesi · controprova', 'genesi-frasi-limite.mjs', ['--controprova'], true],
  ['Genesi: le volate passano dalla porta sui dati', 'genesi-locale.mjs', []],
  ['porta sui dati di Genesi · senza rete', 'genesi-locale.mjs', ['--offline']],
  ['porta sui dati di Genesi · controprova', 'genesi-locale.mjs', ['--controprova'], true],
  /* ⛔ AGGIUNTO IL 14/08 — lo stesso principio del fondatore applicato al
     TEMPO invece che al dato. Fra l'apertura della pagina e l'arrivo dei dati
     c'è una finestra in cui l'app ha già disegnato tutto e non sa ancora
     niente, e la barra in basso ci vive dentro: `window.go` arriva da
     `dw-app-ui.js`, che è `defer` e non aspetta il modulo dati (misurato:
     45–97 ms), quindi in quella finestra si aprono TUTTE le sezioni.
     19 schermate su 19 fotografate col modulo dati rallentato nella risposta
     HTTP, e 26 contatori che dicevano «0»: «Squadre in turno 0», «Chi c'è
     oggi 0», «Lavoratori 0», «Centraline e sensori 0», «Registro volate 0».
     I KPI del Quadro erano già onesti — nascono «—» — cioè la forma giusta
     era nella stessa pagina due righe più su. Nessuna suite `node` lo vede:
     non importano le pagine, e il difetto vive in una finestra di tempo.
     La controprova rimette i 30 «0» statici e deve far cadere tutt'e tre le
     app; il banco chiede anche il verso opposto (dopo i dati nessun contatore
     resta «—»), perché scrivere «non lo so» dove la verità è un numero
     sarebbe peggio del difetto. */
  ['«non ancora caricato» non è «non c\'è»', 'finestra-caricamento.mjs', []],
  ['finestra di caricamento · controprova', 'finestra-caricamento.mjs', ['--controprova'], true],
];

/* «finto 2» è dichiarata CONTROPROVA di proposito: così `impronta-giro.mjs`,
   che lancia questo giro finto, può pretendere che l'intestazione lo dica — e
   che NON lo dica per le altre due. Una riga che avvisa e che nessuna prova
   guarda è una guardia scollegata.
   ⚠️ Sta QUI, e non più in fondo accanto a `DA_FARE`, perché la scelta delle
   passate va fatta **prima di alzare il server**: un nome sconosciuto deve
   fermare il giro subito, non dopo aver creato una worktree e aperto una
   porta. */
const FINTI = [['finto 1', null, []], ['finto 2', null, [], true], ['finto 3', null, []],
  ...(FINTO_APPESO ? [['finto appeso', null, [], false, true]] : [])];

const SCELTA = scegliBanchi(BANCHI_FINTI ? FINTI : BANCHI, { solo: SOLO, da: DA });
/* ⛔ UN NOME SCONOSCIUTO NON PUÒ USCIRE ZERO — è il difetto già chiuso su
   `contrasto-non-testo.mjs`, dove `--solo=` con un nome sbagliato usciva zero
   dichiarando di non aver guardato niente: il verde della dimenticanza. */
if (SCELTA.ignoti.length) {
  console.error(`⛔ --solo=: ${SCELTA.ignoti.length} nome/i non combaciano con nessuna passata: ${SCELTA.ignoti.join(', ')}`);
  console.error('   Il giro NON è partito: non ha misurato niente. I nomi si scrivono come il file');
  console.error('   del banco (contrasto, scudo-disegni) o come una parola del nome mostrato.');
  process.exit(2);
}
if (!SCELTA.scelti.length) {
  console.error('⛔ --da=: nessuna passata resta da fare. Il giro NON è partito.');
  process.exit(2);
}

async function rispondePorta(porta) {
  try {
    const r = await fetch(`http://127.0.0.1:${porta}/apps/index.html`, { signal: AbortSignal.timeout(1500) });
    return r.ok;
  } catch (e) { return false; }
}

async function aspetta(porta, secondi) {
  for (let i = 0; i < secondi * 4; i++) {
    if (await rispondePorta(porta)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

const PORTA = process.argv[2] || '8823';
const SU_COPIA = !process.argv.includes('--sulla-viva');

/* ══ IL GIRO GIRA SU UNA COPIA CONGELATA ═══════════════════════════════════
   Prima serviva la cartella VIVA, e per un'ora e mezza nessuno poteva
   toccarla: `impronta.mjs` proteggeva il risultato FERMANDO IL LAVORO. È una
   difesa, non una soluzione — e una regola che chiede di non lavorare per due
   ore viene violata, è già successo due volte in due giorni.
   Adesso i banchi servono una `git worktree` temporanea, immobile per
   costruzione. Vedi docs/PIANO_GIRO_SU_COPIA.md.

   ⛔ E la trappola che questo introduce, risolta prima di scrivere una riga:
   una worktree su HEAD contiene il COMMITTATO, non quello che c'è su disco.
   Con modifiche non committate il giro proverebbe codice diverso da quello che
   si sta guardando, e uscirebbe VERDE su una versione che non esiste da
   nessuna parte. Quindi il giro DICHIARA su cosa sta girando, in cima e in
   fondo: un avviso stampato solo all'inizio, dopo un'ora e mezza di
   scorrimento, non l'ha letto nessuno. */
let COPIA = null, FUORI_DALLA_COPIA = [], COMMIT_COPIA = '?';
function nonCommittati() {
  try {
    return execFileSync('git', ['status', '--porcelain'], { cwd: RADICE, encoding: 'utf8' })
      .split('\n').map((r) => r.slice(3).trim()).filter(Boolean);
  } catch (e) { return []; }
}
function hashDi(dove) {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: dove, encoding: 'utf8' }).trim();
  } catch (e) { return '?'; }
}
/* ⛔ Quanti commit ha fatto la cartella VIVA da quando la copia è stata presa.
   Un giro dura più di un'ora: nel frattempo si continua a committare — è
   proprio il motivo per cui la copia esiste. Se il numero non è zero, il verde
   in fondo attesta il commit della COPIA e nient'altro. */
export function distanzaDaCopia(commitCopia, dove = RADICE) {
  if (!commitCopia || commitCopia === '?') return null;
  try {
    const n = execFileSync('git', ['rev-list', '--count', `${commitCopia}..HEAD`],
      { cwd: dove, encoding: 'utf8' }).trim();
    return Number.isFinite(+n) ? +n : null;
  } catch (e) { return null; }
}
function dichiaraSuCosaGira(inFondo = false) {
  /* ⛔ PRIMA DI OGNI ALTRA COSA, IN CIMA E IN FONDO: un giro filtrato stampa
     le stesse identiche frasi di un giro intero, quindi il suo verde si legge
     come se riguardasse tutto il prodotto. La riga che dice quante passate
     sono rimaste fuori è la sola differenza leggibile fra i due. */
  const parziale = dichiaraFiltro(SCELTA, { solo: SOLO, da: DA });
  if (parziale) console.log(parziale);
  if (!COPIA) { console.log('▶ Il giro sta girando sulla CARTELLA VIVA: non toccare i file finché non finisce.'); return; }
  console.log(`▶ Il giro sta girando su una COPIA di ${COMMIT_COPIA} (il committato), non sulla cartella viva.`);
  if (inFondo) {
    const avanti = distanzaDaCopia(COMMIT_COPIA);
    if (avanti) {
      console.log(`⚠️ Da quando la copia è stata presa la cartella viva è andata avanti di ${avanti} commit`);
      console.log(`   (ora è a ${hashDi(RADICE)}). Questo giro attesta ${COMMIT_COPIA}, NON quello che hai adesso.`);
    }
  }
  if (FUORI_DALLA_COPIA.length) {
    console.log(`⚠️ ATTENZIONE: ${FUORI_DALLA_COPIA.length} file NON committati restano FUORI da quello che`);
    console.log('   il giro sta provando. Quello che vedi su disco NON è quello che è stato misurato:');
    for (const f of FUORI_DALLA_COPIA.slice(0, 12)) console.log(`   · ${f}`);
    if (FUORI_DALLA_COPIA.length > 12) console.log(`   · …e altri ${FUORI_DALLA_COPIA.length - 12}`);
  } else if (!inFondo || !distanzaDaCopia(COMMIT_COPIA)) {
    console.log('  Niente di non committato: la copia è identica a quello che hai su disco.');
  }
}
/* ⛔ LE COPIE DEI GIRI MORTI LE TOGLIE IL GIRO DOPO, PERCHÉ CHI MUORE NON PUÒ.
   Misurato l'08/08: **71 worktree abbandonate**, ~1,3 GB, e il disco di questa
   sessione è un'allocazione fissa — quando finisce, le SCRITTURE falliscono
   mentre `df` mostra spazio libero. In fondo a questo file la copia si toglie
   «SEMPRE, anche se il giro è caduto», e quella riga vale per un giro che
   **arriva** in fondo: un `SIGKILL` — o una sessione che finisce — non esegue
   nessun `finally`. L'unico momento in cui qualcuno può pulire è **l'avvio del
   giro successivo**, ed è qui.
   Si toglie solo ciò che ha il nostro nome (`giro-copia-<pid>`) e il cui pid
   NON è più vivo: una copia di un giro che sta girando adesso non si tocca —
   sarebbe la stessa famiglia del server riusato, un giro che sabota l'altro. */
function pulisciCopieMorte(radice) {
  let tolte = 0;
  try {
    const su = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: radice, encoding: 'utf8' });
    for (const r of su.split('\n')) {
      const m = /^worktree (.*\/giro-copia-(\d+))$/.exec(r.trim());
      if (!m) continue;
      if (Number(m[2]) === process.pid) continue;
      try { process.kill(Number(m[2]), 0); continue; } catch (e) { /* il pid non c'è più: si può togliere */ }
      try { execFileSync('git', ['worktree', 'remove', '--force', m[1]], { cwd: radice, stdio: 'ignore' }); tolte++; }
      catch (e) { /* già sparita a mano: la toglie `prune` */ }
    }
    execFileSync('git', ['worktree', 'prune'], { cwd: radice, stdio: 'ignore' });
  } catch (e) { /* niente git, niente pulizia: non è un motivo per non partire */ }
  return tolte;
}

if (SU_COPIA && !BANCHI_FINTI) {
  const dove = join(RADICE, '..', 'giro-copia-' + process.pid);
  const tolte = pulisciCopieMorte(RADICE);
  if (tolte) console.log(`  (tolte ${tolte} copie di giri morti: chi viene ucciso non può pulire da sé)`);
  try {
    if (existsSync(dove)) rmSync(dove, { recursive: true, force: true });
    execFileSync('git', ['worktree', 'add', '--detach', dove, 'HEAD'], { cwd: RADICE, stdio: 'ignore' });
    COPIA = dove;
    COMMIT_COPIA = hashDi(dove);   // il commit della COPIA, preso ORA: la viva andrà avanti
    FUORI_DALLA_COPIA = nonCommittati();
    process.env.DW_RADICE = COPIA;   // i banchi che alzano un server loro
  } catch (e) {
    console.log('⚠️ non riesco a creare la copia (' + String(e.message).split('\n')[0] + '): giro sulla cartella viva.');
    COPIA = null;
  }
}
/* ⛔ E IL SERVER DEL GIRO MORTO TIENE LA PORTA, SERVENDO UNA CARTELLA CHE NON
   C'È PIÙ. Seconda metà della pulizia qui sopra, misurata l'08/08 subito dopo:
   tolte le 71 copie, il giro nuovo si è rifiutato di partire — «non riesco ad
   alzare un server statico sulla porta 8823» — e il colpevole era il
   `python3 -m http.server 8823` del giro ucciso, ancora vivo, con
   `cwd = /home/user/giro-copia-16814 (deleted)`. È l'orfano che CLAUDE.md
   descrive: risponde, ma con 404 su tutto.
   Il criterio è preciso e non può sbagliare bersaglio: si guarda **solo la
   nostra porta**, e si uccide solo se la cartella che sta servendo **non esiste
   più**. Il server di un giro VIVO ha una cwd che esiste, quindi non si tocca —
   e se la porta è tenuta da un giro vivo, il contrassegno più in basso ci ferma
   comunque, com'è giusto. */
function togliServerOrfano(porta) {
  let tolti = 0;
  try {
    const su = execFileSync('ps', ['-eo', 'pid=,args='], { encoding: 'utf8' });
    for (const r of su.split('\n')) {
      const m = /^\s*(\d+)\s+(.*http\.server\s+\d+.*)$/.exec(r);
      if (!m || !new RegExp(`http\\.server\\s+${porta}(\\s|$)`).test(m[2])) continue;
      let cwd = '';
      try { cwd = readlinkSync(`/proc/${m[1]}/cwd`); } catch (e) { continue; }
      if (!cwd.endsWith(' (deleted)')) continue;   // serve una cartella viva: non è orfano
      try { process.kill(Number(m[1]), 'SIGKILL'); tolti++; } catch (e) { /* già morto */ }
    }
  } catch (e) { /* niente ps: non è un motivo per non partire */ }
  return tolti;
}

const SERVITA = COPIA || RADICE;
dichiaraSuCosaGira();
let server = null;
if (!BANCHI_FINTI) {
  const orfani = togliServerOrfano(PORTA);
  if (orfani) console.log(`  (tolto ${orfani === 1 ? 'un server' : orfani + ' server'} di un giro morto: teneva la porta ${PORTA} servendo una cartella cancellata)`);
}
/* i banchi finti non aprono niente: servono solo a provare la guardia
   dell'impronta, e alzare un server per loro li renderebbe inadatti alla CI */
if (!BANCHI_FINTI && !(await rispondePorta(PORTA))) {
  console.log(`Il server sulla porta ${PORTA} non risponde: lo alzo io.`);
  server = spawn('python3', ['-m', 'http.server', PORTA], { cwd: SERVITA, stdio: 'ignore', detached: true });
  if (!(await aspetta(PORTA, 12))) {
    console.error(`✗ non riesco ad alzare un server statico sulla porta ${PORTA}.`);
    process.exit(2);
  }
}
/* ⛔ IL CONTRASSEGNO COL PROPRIO PID — ed è la regola che CLAUDE.md pretende da
   ogni banco che alza un server, e che il RUNNER non aveva. Il 07/08 è costato
   un giro intero: due giri erano vivi insieme sulla stessa porta, il secondo ha
   trovato «qualcuno risponde» e ha **riusato il server dell'altro**, quindi ha
   misurato la copia di un commit diverso dal proprio. Poi il primo è stato
   fermato, il suo server è morto, e da lì il secondo ha letto **zero
   caratteri** per schermata: ventidue KO su Scudo che dicevano «la barra di
   navigazione ha una voce», «nessuna schermata aperta», «0 caratteri letti» —
   cioè un banco che accusa il prodotto di non esistere.
   È la forma silenziosa della trappola, la peggiore: non fallisce, misura la
   roba di qualcun altro. Tre righe, e vale per il file da cui dipendono tutti
   gli altri. */
if (!BANCHI_FINTI) {
  const marchio = `.dw-giro-${process.pid}`;   // il punto lo tiene fuori dall'impronta
  const atteso = `giro ${process.pid} su ${COMMIT_COPIA}`;
  writeFileSync(join(SERVITA, marchio), atteso);
  let torna = null;
  try {
    const r = await fetch(`http://127.0.0.1:${PORTA}/${marchio}`, { signal: AbortSignal.timeout(3000) });
    torna = r.ok ? (await r.text()).trim() : null;
  } catch (e) { torna = null; }
  if (torna !== atteso) {
    console.error(`\n⛔ IL SERVER SULLA PORTA ${PORTA} NON È IL MIO: gli ho chiesto il mio contrassegno`
      + ` e mi ha risposto «${torna === null ? 'niente' : torna}».`);
    console.error(`   Sta servendo la cartella di qualcun altro — probabilmente un altro giro ancora vivo.`);
    console.error(`   Misurare così vuol dire attestare un commit che non è questo. Mi fermo.`);
    try { rmSync(join(SERVITA, marchio), { force: true }); } catch (e) { /* niente */ }
    process.exit(2);
  }
  console.log(`Contrassegno riletto dal server: è il mio (pid ${process.pid}).`);
  try { rmSync(join(SERVITA, marchio), { force: true }); } catch (e) { /* niente */ }
  /* la porta d uscita per la controprova: senza, provare questa guardia
     vorrebbe dire far girare centoventinove banchi per leggere una riga. */
  if (process.argv.includes("--prova-contrassegno")) {
    if (COPIA) { try { execFileSync("git", ["worktree", "remove", "--force", COPIA], { cwd: RADICE, stdio: "ignore" }); } catch (e) { /* niente */ } }
    if (server) { try { process.kill(-server.pid); } catch (e) { /* niente */ } }
    process.exit(0);
  }
}

let base = impronta(COPIA || RADICE_IMPRONTA);
console.log(`Impronta di partenza: ${base.size} file che le pagine caricano (test, docs e vault esclusi apposta).`);
/* ⛔ QUANDO È PARTITO QUESTO GIRO — un dato che il runner ha in mano e che il
   registro non ha mai detto. Il 09/08 è costato sei checkpoint con dentro un
   orario **falso di un'ora**: il giro era partito alle 06:56Z, io ho scritto
   «dalle 07:55Z» perché l'ho **stimato** rileggendo il registro, e l'ho
   ripetuto sei volte. È la regola già scritta in questo file per le
   controprove e per il riepilogo — *un dato che il programma ha in mano non si
   indovina dal testo* — applicata alla cosa più semplice di tutte: l'ora.
   ⚠️ Si stampa in **UTC esplicito**: il contenitore è in UTC e le cave sono in
   Italia, e un orario senza fuso è un numero che ognuno legge come vuole. */
const INIZIO = new Date();
console.log(`Partito alle ${INIZIO.toISOString().replace(/\.\d+Z$/, "Z")} (UTC).`);
const cambiamenti = [];

const DA_FARE = SCELTA.scelti;

const esiti = [];
for (const [nome, file, argomenti, eControprova, appeso] of DA_FARE) {
  /* ⛔ L'INTESTAZIONE DICE SE QUESTA PASSATA È UNA CONTROPROVA, e non è un
     abbellimento: il 07/08 un rosso voluto è stato letto come un guasto DUE
     VOLTE in due ore, la seconda da chi aveva appena scritto la difesa per la
     prima. Una controprova stampa le stesse identiche frasi della passata sana
     («26 passati, 10 falliti» contro «36 passati, 0 falliti») e sono
     centosessanta righe distanti: chi legge il registro dall'alto vede un
     rosso e apre un cantiere su difetti che non esistono.
     Il runner SA quale passata è una controprova — è il quarto posto della
     tupla, `eControprova` — e quel dato finiva solo nel riepilogo, cioè
     un'ora e mezza di scorrimento più in là. Qui costa una riga.
     ⚠️ E si è provato a leggerlo dal NOME (le controprove si chiamano quasi
     tutte «… · controprova»): non regge, perché due passate su quattro di
     `contrasto` si chiamano «non accusa chi pulsa» e «le classi mai comparse».
     Un dato che il programma ha in mano non si indovina dal testo. */
  console.log(`\n════════ ${nome} ════════`
    + (eControprova ? '\n   ⚠️  CONTROPROVA: qui sotto il rosso è quello VOLUTO. Un KO qui è il banco che funziona.' : ''));
  const partito = Date.now();
  const { codice, scaduto } = await new Promise((ok) => {
    /* `detached` serve al kill dell'ALBERO qui sotto: senza, il figlio resta
       nel gruppo del runner e `process.kill(-pid)` ammazzerebbe il runner
       stesso. Con lui, un Chromium orfano non sopravvive al limite. */
    /* ⛔ IL PROXY DEL CONTENITORE FA ASPETTARE 12,7 SECONDI A OGNI PAGINA, e i
       banchi che aspettano un tempo fisso misurano una schermata VUOTA.
       Misurato il 02/09: Chromium legge `HTTPS_PROXY` dall'ambiente e manda lì
       l'import di Firebase da gstatic; il proxy tiene la connessione e la
       azzera dopo ~12,7 s, e solo allora l'app ripiega sulla dimostrazione.
       Senza quelle variabili l'import fallisce in 260 ms. Sei banchi di Conti
       lanciati a mano davano «#vend-list è vuota: non ho misurato niente»,
       «il file esce davvero: KO» su tutti i CSV — cioè accusavano il prodotto
       dell'ambiente. Qui le variabili si tolgono al figlio, non al runner:
       `giro-node` e chi usa `curl` le vogliono. */
    const senzaProxy = Object.fromEntries(Object.entries(process.env)
      .filter(([k]) => !/^(https?_proxy|no_proxy)$/i.test(k)));
    const p = file
      ? spawn(process.execPath, [join(QUI, file), PORTA, ...argomenti], { stdio: 'inherit', detached: true, env: senzaProxy })
      : spawn(process.execPath, ['-e', appeso ? 'setInterval(() => {}, 1000)' : 'setTimeout(() => {}, 600)'],
              { stdio: 'inherit', detached: true });
    /* si uccide l'ALBERO, non solo il capo: un banco che alza un browser lascia
       vivi i suoi figli, e un Chromium orfano tiene la porta e la memoria */
    const sveglia = setTimeout(() => {
      console.log(`\n  ⛔ «${nome}» NON HA FINITO in ${Math.round(LIMITE_MS / 60000)} minuti: lo fermo e tiro avanti.`);
      console.log('     ⚠️  Questa passata NON È STATA MISURATA. Non vuol dire «a posto»: vuol dire che non si sa.');
      try { process.kill(-p.pid, 'SIGKILL'); } catch (e) { try { p.kill('SIGKILL'); } catch (e2) { /* già morto */ } }
      ok({ codice: null, scaduto: true });
    }, LIMITE_MS);
    p.on('close', (c) => { clearTimeout(sveglia); ok({ codice: c, scaduto: false }); });
  });
  const durata = Math.round((Date.now() - partito) / 1000);
  /* ⛔ E LA CHIUSURA DELLA DICHIARAZIONE, che l'08/08 si è misurato non essere
     un dettaglio. L'apertura da sola non basta perché un banco stampa spesso
     una PROPRIA intestazione a otto uguali: chi legge il registro apre lì una
     sezione nuova, che la dichiarazione non copre più, e i KO **voluti** di
     quella sezione tornano a leggersi come difetti veri. Successo davvero:
     `struttura di Genesi · controprova` dichiarava, poi il banco apriva
     «Genesi: la struttura è quella del core? · controprova» e i suoi quattordici
     KO voluti finivano fra quelli veri — cioè la cura scritta il 07/08 valeva
     solo per i banchi che non si intestano da sé.
     Con una riga di chiusura la dichiarazione diventa un INTERVALLO invece che
     un'etichetta su una riga sola, e chi legge sa dove finisce. */
  if (eControprova) console.log('   ⚠️  FINE CONTROPROVA — da qui in giù il rosso torna a essere quello VERO.');
  /* una controprova riuscita esce con 0 perché ha fallito come doveva: il
     banco stesso gira il verdetto, qui basta leggerlo */
  esiti.push({ nome, ok: !scaduto && codice === 0, eControprova: !!eControprova, scaduto, durata });

  /* e subito dopo: qualcuno ha toccato il codice mentre questo banco girava? */
  const d = differenze(base, impronta(COPIA || RADICE_IMPRONTA));
  if (d.length) {
    console.log(`\n  ⚠️  IL CODICE È CAMBIATO DURANTE «${nome}»: ${d.length} file`);
    for (const x of d.slice(0, 8)) console.log(`      ${x.come}: ${x.file}`);
    if (d.length > 8) console.log(`      … e altri ${d.length - 8}`);
    cambiamenti.push({ dopo: nome, quanti: d.length, file: d.map((x) => x.file) });
    base = impronta(COPIA || RADICE_IMPRONTA);   // si riparte da qui, se no ogni banco ripete lo stesso avviso
  }
}

if (server) { try { process.kill(-server.pid); } catch (e) { /* già morto */ } }
/* La copia si toglie SEMPRE, anche se il giro è caduto: una worktree lasciata
   in giro fa fallire la prossima creazione e nessuno capisce perché. */
function togliLaCopia() {
  if (!COPIA) return;
  try { execFileSync('git', ['worktree', 'remove', '--force', COPIA], { cwd: RADICE, stdio: 'ignore' }); }
  catch (e) { try { rmSync(COPIA, { recursive: true, force: true }); } catch (e2) {} }
  COPIA = null;
}

/* ⛔ E QUANTO È DURATO, accanto a quando è partito: chi riapre un registro di
   seimila righe la prima cosa che vuole sapere è **se è finito e quando**. */
{
  const fine = new Date();
  const min = Math.round((fine - INIZIO) / 60000);
  console.log(`\nGiro partito alle ${INIZIO.toISOString().replace(/\.\d+Z$/, "Z")}, finito alle `
    + `${fine.toISOString().replace(/\.\d+Z$/, "Z")} — ${Math.floor(min / 60)}h${String(min % 60).padStart(2, "0")} (UTC).`);
}
console.log('\n════════ RIEPILOGO ════════');
/* ⛔ E QUESTO BLOCCO DICHIARA DI ESSERE UNA RIPETIZIONE. Misurato l'08/08
   leggendo un giro con `leggi-giro.mjs`: dei suoi «47 KO veri», **37 erano le
   righe di qui sotto** — cioè lo stesso rosso già stampato più su, contato una
   seconda volta, e per giunta comprese le controprove, il cui rosso è VOLUTO
   (la dichiarazione `CONTROPROVA` vale nell'intervallo della passata, non qui
   in fondo). Un numero gonfiato di quattro volte manda a cercare difetti che
   non esistono, che è il danno contro cui `leggi-giro` è stato scritto.
   La cura è quella già imparata sulle controprove: **un dato che il programma
   ha in mano non si indovina dal testo.** Il runner sa che questo è il conto
   delle passate, e lo scrive. */
console.log('   ⚠️  RIPETIZIONE: qui sotto NON ci sono difetti nuovi — è il conto'
  + ' delle passate già stampate sopra. Un KO qui è quello di lassù, non un altro.');
/* ⛔ La dichiarazione si RIPETE qui in fondo. Stampata solo in cima, dopo
   un'ora e mezza di scorrimento non l'ha letta nessuno — e il caso in cui
   serve davvero (ci sono file non committati, quindi il verde vale per una
   versione diversa da quella su disco) è proprio quello in cui si legge solo
   il riepilogo.
   ⛔ E qui va detto DI CHE COMMIT si tratta: prima il hash veniva riletto da
   HEAD della cartella VIVA, che nel frattempo era andata avanti di 12 commit.
   Il giro dichiarava di aver provato codice che non aveva mai visto, e la riga
   dopo aggiungeva «la copia è identica a quello che hai su disco» — falsa. */
dichiaraSuCosaGira(true);
for (const e of esiti) console.log(`  ${e.scaduto ? '⛔ ' : e.ok ? 'ok ' : 'KO '} ${e.nome}${e.scaduto ? '  — NON MISURATA (fermata dopo il limite)' : ''}`);
const scadute = esiti.filter((e) => e.scaduto);
const caduti = esiti.filter((e) => !e.ok && !e.scaduto);
console.log(`\n${esiti.length - caduti.length - scadute.length} banchi a posto, ${caduti.length} da guardare`
  + (scadute.length ? `, ${scadute.length} NON MISURATE` : ''));
/* ⛔ LE PASSATE NON MISURATE SI LEGGONO PRIMA DEI KO, ed è la regola di questo
   repository: un rosso lo si vede, un «non ho guardato» in fondo a una pagina
   di verde no. Una passata fermata dal limite non è né passata né caduta: è un
   soggetto di cui non si sa niente, e il giro non può dirsi verde. */
if (scadute.length) {
  console.log(`\n⛔ ${scadute.length} passate NON MISURATE perché non hanno finito entro il limite`
    + ` (${Math.round(LIMITE_MS / 60000)} minuti — si alza con --limite=<secondi>):`);
  for (const e of scadute) console.log(`   · ${e.nome}`);
  console.log('   Il registro qui sotto NON è il verdetto di tutto il giro.');
}
/* la passata più lenta, per sapere se il limite è ancora tarato bene */
const lente = esiti.filter((e) => !e.scaduto).sort((a, b) => b.durata - a.durata).slice(0, 3);
if (lente.length) console.log(`\n   (le tre passate più lente: ${lente.map((e) => `${e.nome} ${Math.floor(e.durata / 60)}m${String(e.durata % 60).padStart(2, '0')}s`).join(' · ')})`);

if (cambiamenti.length) {
  /* ⛔ Il verdetto NON è «ci sono anche dei cambiamenti»: è che il giro non
     vale. Un riepilogo verde con un avviso in mezzo verrebbe letto come verde —
     ed è il modo in cui questo difetto è passato le prime due volte. */
  const primo = cambiamenti[0];
  const indice = esiti.findIndex((e) => e.nome === primo.dopo);
  console.log(`\n⛔ GIRO NON VALIDO: il codice che le pagine caricano è cambiato mentre girava.`);
  for (const c of cambiamenti) console.log(`   dopo «${c.dopo}»: ${c.quanti} file (${c.file.slice(0, 3).join(', ')}${c.file.length > 3 ? ', …' : ''})`);
  console.log(`   Hanno misurato il codice giusto solo i primi ${indice + 1} banchi su ${esiti.length}.`);
  console.log(`   Va rilanciato a modifiche finite. (La regola sta in CLAUDE.md: mentre gira un giro`);
  console.log(`   si lavora su docs/, vault/ e le suite node — mai sui moduli dati e sulle pagine.)`);
  togliLaCopia();
  process.exit(2);
}
togliLaCopia();
process.exit(caduti.length || scadute.length ? 1 : 0);
