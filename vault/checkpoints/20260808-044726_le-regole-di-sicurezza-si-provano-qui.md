# Checkpoint — 2026-08-08T04:47:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a5dca00` — *Le regole di sicurezza si possono provare QUI, e il numero era 58
invece di 68*

## Che cosa è stato completato

Continuando l'esame della parità fra CI e giro di casa (l'unità prima aveva
chiuso la sintassi dei moduli a sé), restava una domanda: **le suite
dell'emulatore si possono lanciare in questo contenitore?** `CLAUDE.md` diceva
di no in pratica, e il comando che dava era sbagliato in due modi.

### Il comando scritto era sbagliato due volte

Dava `emulators:exec … "cd tests && npm test"` — che **qui non parte** — e
diceva «19 test», che è il conto dell'**SDK**, non delle regole.

### Che cosa gira davvero, misurato lanciandolo

- `--only firestore` + `node run.mjs` → **68 prove, 0 fallite**. È la
  **barriera multi-tenant**: il muro fra aziende concorrenti, il requisito
  fondante di tutto il prodotto. **Si può verificare prima del push, e nessuno
  lo faceva.**
- `--only firestore,auth` → `run-sdk.mjs` **19** e `run-bootstrap.mjs` **8**,
  che confermano i numeri documentati.
- ⛔ L'emulatore delle **funzioni** non parte: chiede la rete e la politica del
  contenitore la nega (*«Unable to parse JSON … "denied by …"»*). È per questo
  che `npm test` intero sotto l'emulatore fallisce — **non per un difetto
  nostro**. Le **21** prove sulle funzioni restano verificabili solo in CI, e
  va **detto** invece di lasciar credere che l'emulatore non si possa usare.

### E il numero della sicurezza era fermo

**58** in tre posti (`CLAUDE.md` e due documenti) dove vale **68**: fermo da
tempo perché nessuno le lanciava più in casa — **sul numero che riguarda la
sicurezza**, per giunta. Totale emulatore **106 → 116**, e nel documento è
dichiarato **quale addendo non è stato rimisurato e perché**: è il principio
del fondatore applicato alla documentazione, «l'assenza di un dato non è un
dato favorevole».

## ⛔ E la quarta forma di invecchiamento, colta sul fatto un'ora dopo averla scritta

`DEVELOPMENT.md` diceva ancora «il numero da citare resta **2.251**» e «il giro
completo esegue **2.474**» mentre il titolo sopra diceva già 2.310: il
controllo sorveglia il **totale**, non la prosa che lo spiega. Stessa cosa in
`STATO_PRODOTTO.md`.
Rimisurato sommando le righe «Risultato …» di un giro intero: le sei suite
fanno **2.310**, il giro completo **2.576**, e **ogni addendo** della nota era
vecchio (sintassi delle pagine 15 → 34, import esistenti 134 → 140, nomi liberi
7 → 24).

## ⚠️ E un'ora persa per il mio stesso righello

Cercando `run.mjs` mi rispondeva «file inesistente» mentre il comando lo aveva
appena eseguito: la shell era rimasta dentro `apps/deepwork-id` dopo il lancio
dell'emulatore, quindi i percorsi relativi puntavano un livello più in basso.
Il file c'era. **Quando una misura non torna, il sospettato più facile è il
soggetto — ed è quasi sempre il righello**, anche quando il righello è la
cartella in cui ti trovi.

## Prove

- `run.mjs` sotto l'emulatore Firestore: **68 passati, 0 falliti**, uscita 0.
- `run-sdk.mjs` **19**, `run-bootstrap.mjs` **8**, tutti verdi.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **1.119
righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`): si
  rilancia e si legge, non si ricopia. Un'unità per app, un file per commit.
- ⏱️ **Mettere la suite delle regole nel giro prima del push**, adesso che si
  sa che gira: sono 68 prove sulla barriera fra aziende concorrenti e costano
  pochi minuti. Va deciso **dove** — non dentro `giro-node.mjs`, che deve
  restare veloce e senza Java, ma come comando dichiarato accanto a lui.

## Blocchi
Nessuno.
