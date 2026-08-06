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
import { rmSync, existsSync } from 'node:fs';

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
  ['contrasto · controprova', 'contrasto.mjs', ['--controprova'], true],
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
  ['i CSV che escono dalla dimostrazione (25 export, 4 app)', 'csv-dimostrazione.mjs', []],
  ['CSV dimostrazione · su dati veri il marchio non c\'è', 'csv-dimostrazione.mjs', ['--live']],
  ['CSV dimostrazione · controprova', 'csv-dimostrazione.mjs', ['--controprova'], true],
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
  ['le etichette della barra stanno nella loro colonna', 'barra-etichette.mjs', []],
  ['etichette della barra · controprova', 'barra-etichette.mjs', ['--controprova'], true],
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

let base = impronta(COPIA || RADICE_IMPRONTA);
console.log(`Impronta di partenza: ${base.size} file che le pagine caricano (test, docs e vault esclusi apposta).`);
const cambiamenti = [];

const DA_FARE = BANCHI_FINTI
  ? [['finto 1', null, []], ['finto 2', null, []], ['finto 3', null, []]]
  : BANCHI;

const esiti = [];
for (const [nome, file, argomenti, eControprova] of DA_FARE) {
  console.log(`\n════════ ${nome} ════════`);
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
