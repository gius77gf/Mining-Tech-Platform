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
import { execFileSync } from 'node:child_process';
import { rmSync, existsSync, writeFileSync } from 'node:fs';

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
  ['i fogli stampati di Flotta, Sentinella, Conti e Terra', 'stampe-fs.mjs', []],
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
  ['fogli stampati F/S/C/T · controprova', 'stampe-fs.mjs', ['--controprova'], true],
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
  ['le etichette della barra stanno nella loro colonna', 'barra-etichette.mjs', []],
  ['etichette della barra · tema chiaro', 'barra-etichette.mjs', ['--tema=chiaro']],
  ['etichette della barra · tema sole', 'barra-etichette.mjs', ['--tema=sole']],
  ['etichette della barra · controprova', 'barra-etichette.mjs', ['--controprova'], true],
  ['etichette della barra · controprova sole', 'barra-etichette.mjs', ['--controprova', '--tema=sole'], true],
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
  ['le frasi di Terra quando il numero è uno', 'terra-frasi-da-uno.mjs', []],
  ['frasi da uno · controprova', 'terra-frasi-da-uno.mjs', ['--controprova'], true],
  /* ⚠️ `flotta-frasi-da-uno` NON usa la porta che gli passiamo: alza un server
     suo (con il contrassegno del pid, e fallisce se la porta è occupata),
     perché deve servire un `flotta-data.js` con UN dato solo per riga. La
     porta in coda gli arriva e la ignora — è dichiarato, non dimenticato. */
  ['le frasi di Flotta quando il numero è uno', 'flotta-frasi-da-uno.mjs', []],
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
];

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
if (SU_COPIA && !BANCHI_FINTI) {
  const dove = join(RADICE, '..', 'giro-copia-' + process.pid);
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
const SERVITA = COPIA || RADICE;
dichiaraSuCosaGira();
let server = null;
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
const cambiamenti = [];

const DA_FARE = BANCHI_FINTI
  /* «finto 2» è dichiarata CONTROPROVA di proposito: così `impronta-giro.mjs`,
     che lancia questo giro finto, può pretendere che l'intestazione lo dica —
     e che NON lo dica per le altre due. Una riga che avvisa e che nessuna prova
     guarda è una guardia scollegata. */
  ? [['finto 1', null, []], ['finto 2', null, [], true], ['finto 3', null, []]]
  : BANCHI;

const esiti = [];
for (const [nome, file, argomenti, eControprova] of DA_FARE) {
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
  const codice = await new Promise((ok) => {
    const p = file
      ? spawn(process.execPath, [join(QUI, file), PORTA, ...argomenti], { stdio: 'inherit' })
      : spawn(process.execPath, ['-e', 'setTimeout(() => {}, 600)'], { stdio: 'inherit' });
    p.on('close', ok);
  });
  /* una controprova riuscita esce con 0 perché ha fallito come doveva: il
     banco stesso gira il verdetto, qui basta leggerlo */
  esiti.push({ nome, ok: codice === 0, eControprova: !!eControprova });

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

console.log('\n════════ RIEPILOGO ════════');
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
for (const e of esiti) console.log(`  ${e.ok ? 'ok ' : 'KO '} ${e.nome}`);
const caduti = esiti.filter((e) => !e.ok);
console.log(`\n${esiti.length - caduti.length} banchi a posto, ${caduti.length} da guardare`);

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
process.exit(caduti.length ? 1 : 0);
