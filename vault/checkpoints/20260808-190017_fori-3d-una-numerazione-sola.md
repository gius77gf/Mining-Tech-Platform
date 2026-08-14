# Checkpoint — 2026-08-08T19:00:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Nel core i fori segnati sul modello 3D avevano DUE numerazioni, e si
chiamavano tutt'e due «foro N».**

È la domanda di casa — *dove questa app compone qualcosa che ESCE, chi decide i
suoi numeri?* — arrivata al core:

- «Porta i fori nella volata» li ordinava da sinistra a destra
  (`.sort((a,b)=>a.position.x-b.position.x)`) e li numerava 1..n, che è
  l'ordine con cui un perforatore cammina il fronte;
- «Esporta CSV» li numerava `(i+1)` **nell'ordine in cui erano stati cliccati**
  sul modello.

Misurato in scratchpad su quattro fori cliccati sparsi: **4 righe su 4** in cui
lo stesso numero indica un foro diverso nei due documenti. Il CSV diceva
«foro 1 a 14,00 m» e la volata «foro 1 a 2,00 m» — e il numero del foro è il
modo in cui chi perfora sa dove andare.

Adesso la decisione (ordine + numerazione + cambio d'origine) sta in
**`foriDalModello`** in `shared/deepwork-id-client/dw-shell.js`; i due
consumatori formattano soltanto, ognuno come gli serve (la volata *salva* un
numero arrotondato, il CSV *stampa* una stringa).
In più: le celle non finite del CSV restano **vuote** invece di stampare `NaN`.

## Le tre cose che questa unità ha insegnato, e che valgono oltre il caso

1. **Il mio censimento aveva un denominatore sbagliato.** Cercavo i punti
   d'uscita con `download = "` (spazi + virgolette doppie) e Genesi e il core
   **non comparivano**: scrivono `a.download='…'`. Stavo per dichiarare chiuso
   un giro che non aveva mai guardato l'app con più macchinari numerici di
   tutte. Il conto vero è **51 punti d'uscita**, non 43.
2. **Una prova che non sa fallire, presa dalla sua controprova.** Avevo scritto
   in `run-kpi.mjs` una prova chiamata «i due consumatori del core non possono
   più discordare»: derivava tutt'e due le viste da **una sola** chiamata a
   `foriDalModello` e pretendeva che coincidessero. Tolta la riga del `sort` le
   altre due prove diventavano rosse e **questa restava verde** — è la prima
   delle cinque cause di «non distingue»: i dati facevano coincidere la
   risposta giusta con quella sbagliata. Era una tautologia col nome della cosa
   che conta. Tolta, e la proprietà vera — *le due righe del core leggono la
   stessa fonte* — è diventata la **regola 31** di `run-stile.mjs`, perché è
   una proprietà della PAGINA, non della funzione.
3. **Il righello ha sbagliato due volte dentro la regola 31**, tutt'e due nella
   famiglia già scritta in `CLAUDE.md`:
   · pretendevo `foriDalModello` chiamata **3** volte («l'import più i due
     consumatori»), ma la regex vuole la parentesi e un import non ce l'ha: la
     regola è caduta su sé stessa, non sul prodotto;
   · cercavo l'import in `testo.slice(0, indexOf("</script>"))` dando per
     scontato che il primo `</script>` chiudesse il modulo. Il primo sta a riga
     **13**, l'import a **111**: la fetta buttava via il file intero e la regola
     accusava un core sano.

## Verifiche
- `node apps/deepwork-id/tests/giro-node.mjs` → **30 comandi a posto, 0 caduti**
- KPI 1912 → **1916** (5 prove aggiunte, 1 tautologica tolta); Stile 316 → **318**
- copertura `dw-shell.js` **47/47** (era 46/46); le 6 app restano 712/712
- controprova di `foriDalModello`: tolta la riga del `sort`, **2 prove rosse**;
  ripristino da copia (`cp`), `diff -q` verificato
- controprova della **regola 31 sul file vero** (non su una stringa inventata):
  rimesso il difetto in `index.html`, diff che prova che il file è cambiato
  davvero, regola **rossa**, ripristino da copia verificato identico
  ⚠️ Il primo tentativo d'iniezione era una riga di shell ed è stato sbranato
  dalle virgolette: lo script è morto e la regola è passata su un file **sano**.
  Quel verde non voleva dire niente. Riscritto come file `.mjs` in scratchpad.

## Stato roadmap
Filone della settimana — «i numeri che mentono con la faccia tranquilla».
Giro della domanda *«chi decide i numeri di ciò che ESCE?»*, per app:
- **Campo 6/6**, **Sentinella 5/5**, **Terra 3/3** → delegano tutte al modulo
  (negativi misurati, con denominatore)
- **core 2/2** → un difetto vero, corretto qui
- **Conti 12**, **Flotta 9**, **Scudo 5**, **Genesi 9** → cantieri di analisi
  lanciati in parallelo

## Prossimo passo atomico
**Flotta, `flotta-giri-macchina.csv` (riga 4282-4284): il file dice «tutto a
posto» dove lo schermo dice «N da vedere».**

Verificato di persona, non sulla parola del cantiere:
- l'export decide da `const male = (c.voci || []).filter(v => v.esito === "no")`
  → un giro con `anomalie: 2` e **senza** l'elenco delle voci esce
  `tutto a posto ; 0`;
- lo schermo (riga 2484-2486) decide da `const n = +c.anomalie || 0` → **badge
  giallo «2 da vedere»**;
- **la versione GIUSTA è già in questo stesso file, 220 righe più in basso**
  (libretto CSV, righe 4505-4512), col commento che descrive esattamente questo
  difetto: *«il documento che si consegna diceva il contrario di quello che
  l'app mostra»*. La correzione era stata fatta a un export e non all'altro.
- e nel modulo `giriDelGiorno` (riga 1445-1472) la regola è scritta giusta, ma
  risponde a una domanda **per mezzo e per giorno**: al CSV serve **per
  record**. È la firma troppo stretta da cui nasce la copia.

Forma proposta (da provare in scratchpad PRIMA di scriverla nel modulo):
`statoGiro(controllo)` in `flotta-data.js` → `{anomalie, voci, nominate,
critica, gravita, etichetta}`, con `nominate:false` quando `c.voci` non è un
array; poi la usano **quattro** consumatori — l'export dei giri, il libretto,
`etichettaControllo`/`gravitaControllo` della pagina e `giriDelGiorno` stessa.

Altri tre candidati Flotta **già verificati come plausibili ma non ancora
riletti riga per riga da me**: riga 4083 (`;pianificata;` costante al posto di
`statoOrdine`, che sa dire anche `attesa-ricambi` = rosso), riga 3787
(`(+w.costo) || 0` → uno zero sommabile dove il costo non è scritto; la
versione giusta è a riga 4493), righe 4689-4691 (la lista della spesa perde
`senzaData` e `affidabile`, due bandiere che il modulo produce e lo schermo
scrive in rosso).

## Blocchi
Nessuno.

## Note
⚠️ **Due server orfani** trovati vivi da 2h26 e 2h49 (porte 8962 e 8941), uno
dei quali serve **la cartella viva** del repository. La guardia
`togliServerOrfano` non li vede: uccide solo i server la cui cartella è stata
*cancellata*. Un giro futuro che trovasse quella porta occupata e la riusasse
misurerebbe l'albero vivo invece della propria copia immobile — è «l'iniezione
che non inietta» nella veste più difficile da vedere. Da guardare come unità a
sé; qui è solo dichiarato, non corretto.

Il giro del browser (pid 21084) cammina di fianco su una `git worktree`
(`giro-copia-21084`) e prende l'impronta della **copia**: le modifiche fatte
qui sull'albero vivo non lo invalidano.
