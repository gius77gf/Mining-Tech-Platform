# Checkpoint — 2026-08-07 05:27:00 UTC

## Tipo
unit-complete (cinque unità: la controprova dichiarata nel registro, i due
contrasti AA del core, il pieno senza spesa di Flotta, le unità in maiuscolo, e
il pacchetto dei quattro cantieri)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e34aff3` — *Quattro cantieri: 24 grafici su 38 disegnati fuori scala, e tre app
che dicevano al file una cosa e allo schermo un'altra*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 116 | **la controprova dichiarata nel registro** (`5d298c1`) | `impronta-giro` 7 → **10** prove |
| 117 | **i due contrasti AA del core** (`73f9380`) | 452 testi, **2 → 0** sotto soglia |
| 118 | **Flotta, il pieno senza spesa** (`4938125`) | `run-kpi` 1792 → **1795** |
| 119 | **le unità in maiuscolo** (`c753ccc`) | 15 casi in più: **11 veri, 4 dichiarati** |
| 120 | **quattro cantieri insieme** (`e34aff3`) | prove **2.226**, copertura **670/670**, banchi **127** |

## ⛔ Una domanda sola, e stanotte ha risposto in QUATTRO VERSI
La domanda di CLAUDE.md — *dove questa app compone qualcosa che esce, chi decide
i suoi numeri?* — finora era stata usata in un verso solo. Applicata a Flotta,
Scudo, Conti e Sentinella ha dato quattro forme, e tre erano nuove:

1. **il file più povero dello schermo** — il verso classico. Conti: il CSV per il
   commercialista scriveva `insoluta;0;9750` dove la stampa della **stessa**
   fattura diceva già «Annullata, esigibile € 0,00»;
2. **lo schermo più povero del file** — Flotta (il libretto a schermo taceva un
   caveat che il suo CSV dichiarava) e Scudo (un'ispezione tolta dall'archivio
   buttava via `origineNota`, l'unica traccia rimasta). **Nessuna prova lo
   guardava, perché tutti cercano il difetto nell'altra direzione**;
3. **tutt'e due tacciono** — Conti: la fattura che non quadra lo diceva solo a
   chi la stampava, e la bandiera `quadra` era letta in **1 punto su tutta
   l'app**;
4. **un'uscita che nessun banco guardava** — e qui sta il metodo: il censimento
   per **somiglianza** (`download =`) trovava **4** uscite di Scudo; cercando per
   **effetto** ne escono **7**. Le tre in più sono due stampe e gli **appunti**,
   il cui testo era completo, credibile e con **zero parole** che dicessero che è
   una dimostrazione — l'uscita con la difesa più debole e **l'unica che va a una
   persona**.

⛔ **E il difetto che chiede soldi**: nel sollecito di Conti una **nota di
credito** usciva come «acconti per € 9.000» quando il cliente ne aveva versati
6.000 e 3.000 li avevamo stornati noi. Il residuo era giusto e la sottrazione
tornava — per questo non si vedeva.

## ⛔ Il documento era invecchiato nel verso che manda a lavorare dove non serve
Il motore dei grafici: il rapporto ×0,925 era confermato, ma l'**ampiezza** no.
Il documento diceva «Terra sì, Flotta no, Sentinella no — **uno su tre**»,
misurato sulle tre schermate d'**apertura**. A tappeto: **24 grafici su 38 fuori
scala, in cinque app su sei**, e Flotta — dichiarata sana — ne aveva **7 su 8**.
L'unico pulito era proprio quello che era stato guardato. I 14 già in scala non
lo erano per virtù: sono le figure senza padding. **Non dipendeva dall'app,
dipendeva dalla figura.**

## ⚠️ E tre volte il controllo ha sbagliato prima del prodotto
1. il **mio setaccio** sul registro del giro, scritto stanotte per non rileggere
   un rosso di controprova come un guasto, ha sbagliato **due volte di seguito**:
   `^════` combacia anche con le **sotto** intestazioni (60 KO voluti passati per
   veri), e la parola «controprova» non c'è in due passate su quattro di
   `contrasto`. Cura: non un setaccio più furbo — **il registro lo dice**, perché
   `tutti.mjs` quel dato ce l'ha in mano;
2. la mia **controprova sulle unità** rispondeva «62 su 70»: sbagliava l'elenco
   delle **attese**, non il banco (per `MPa`, `Hz` e i prezzi in `€` la maiuscola
   dell'iniziale è l'iniziale stessa);
3. la ragione con cui il cantiere del core aveva giustificato `--grad3-ink` —
   «in `outdoor-mode` andrebbe a 1,94» — ha l'aritmetica giusta e **non può
   succedere**: `applyTheme()` toglie `outdoor-mode` a ogni giro. Tutto quel
   blocco del foglio è **codice morto**, e ci siamo fermati dentro in due.

## ⚠️ E i conti condivisi si scrivono UNA VOLTA, da chi committa
Tre cantieri hanno aggiornato insieme il numero delle prove nei documenti, ognuno
col totale che vedeva: `numeri-nei-documenti` è caduto **due volte** prima che si
fermassero. Al commit li ho misurati io sulla copia: **2.226** prove, **1822** su
`run-kpi`, **127** banchi, copertura **670/670**.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti** sulla copia di ogni commit.
`suite-collegate` **96 file** (era 93 a inizio blocco): i tre banchi nuovi
(`classi-orfane`, `graf-scala`, `appunti-dimostrazione`) sono registrati **e**
tracciati da git.

## Che cosa sta girando adesso
1. **Il giro completo del browser** su una copia di `e5b1405`, 33 sezioni dentro.
   Nelle passate **sane**: i due KO di contrasto, **entrambi già chiusi**.
   ⛔ Quel giro NON contiene la correzione del motore dei grafici, che è la
   modifica col raggio più largo del blocco: ne va lanciato uno nuovo su `HEAD`
   appena questo finisce.
2. **Tre cantieri** con la stessa domanda in quattro versi, su **Campo**,
   **Genesi** e **Terra** — le tre app che non l'hanno ancora ricevuta.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, verificando ognuno sulla **copia di quello che
   si committa** e scrivendo io i conti condivisi dei documenti.
2. **Lanciare il giro completo su `HEAD`** appena il vecchio finisce, e leggerlo
   col setaccio giusto — che adesso non serve più indovinare: le controprove si
   dichiarano da sé.
3. **Togliere le quattro classi morte** (`mac-gest-tabs`, `ec-miccia`,
   `tipo-volata-btn`, `dc-rock`) e con loro le righe di `ACCETTATE` che le
   scusano: la suite pretende che spariscano insieme.
4. **Il blocco `body.outdoor-mode` è codice morto** e continua a costare tempo a
   chi lo legge: è una pulizia, e va misurata prima (quante righe, quante
   dichiarazioni).
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08. «Entro venerdì» vuol dire **a fine
   giornata**: si applicano solo se a fine giornata non è arrivata risposta,
   dichiarandolo nel commit.

## Code aperte, dichiarate
- **Conti**: `.meta.pesa` taglia **15 px a 430, 15+31 a 390, 15+46 a 320** — e
  quello che si perde è proprio il caveat «da completare prima di stampare».
  `conti_incassi.csv · residuo_dopo` non conosce le note (è cronologico: unità a
  sé). **8 export su 9** restano composti dentro la pagina.
- **Scudo**: la dichiarazione «dimostrazione» sui 4 CSV non si vede aprendo il
  contenuto (`grep -ci` → 0 0 0 0); `stampe-fs.mjs` esclude Scudo con una prova
  ormai falsa (oggi `scudo 4`); il fascicolo per l'ispettore non porta
  l'idoneità sanitaria (art. 41) — **è una sezione mancante, e cambia un
  documento con valore legale**.
- **Sentinella**: `csvTarature` esporta i certificati grezzi senza dire quale sia
  scaduto; `#ppv-scelta`.
- **Grafici**: `.dwg-plot` a larghezza zero in una sezione mai aperta; il
  pavimento di 240; le etichette con 30 unità in meno di spazio.
- **Flotta**: `costoOrarioMezzo.totale` esclude i litri senza prezzo e non lo
  dichiara.
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D.

## Blocchi
Nessuno.
