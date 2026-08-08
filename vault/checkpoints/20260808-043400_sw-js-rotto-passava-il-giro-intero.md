# Checkpoint — 2026-08-08T04:34:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c71ea57` — *sintassi-pagine: anche i moduli a sé stanti, e sw.js rotto
passava il giro intero*

## Che cosa è stato completato

Chiuso un buco vero, e **misurato invece che supposto**.

La domanda era quella scritta in `CLAUDE.md`: *«se la CI sa fare una cosa in
tre secondi, quella cosa sta anche nel giro di casa»* — vale ancora? Leggendo
`.github/workflows/ci.yml`: la CI compila **due** famiglie, i blocchi
`<script>` delle pagine (portati in casa il 02/08) **e i file che non stanno
dentro una pagina** — i service worker, l'ingresso delle funzioni Firebase, i
moduli condivisi. La seconda famiglia in casa non c'era.

⛔ **La misura, su una copia staccata**: rotto `sw.js` con un `const rotto = ;`,
il giro `node` intero ha risposto **23 comandi, 0 caduti, uscita 0**. Cioè un
errore di sintassi **duro** nel **service worker del core** — quello che va in
produzione a ogni merge su main e che tiene la cache della PWA — passava la
verifica «sulla copia di quello che si committa», e lo trovava solo la CI
**dopo** il push.

Adesso `sintassi-pagine` compila anche **19 moduli a sé**, oltre ai 16 blocchi
`<script>`.

## ⚠️ «Lo nomina» non vuol dire «lo compila»

Il primo controllo che avevo fatto era un `grep` dei nomi di file dentro le
suite, e diceva che `sw.js` e `genesi-sw.js` erano «nominati da
`nomi-liberi`». Vero e **irrilevante**: `nomi-liberi` li legge come **testo**.
I moduli dati e `pointcloud.js` invece erano davvero coperti, perché `run-kpi`
e `run-pointcloud` li **importano**, e un import di un file rotto fallisce.
La differenza fra le due cose non si vede da un elenco di nomi: si vede
**rompendo il file e guardando chi se ne accorge**.

## ⚠️ E l'elenco è derivato, non ricopiato da quello della CI

Un elenco gemello si scosta dall'originale al primo file nuovo — è la regola
già pagata con `UI_CONDIVISA`. Qui si prendono **per convenzione** i service
worker (`sw.js`, `*-sw.js`), l'ingresso delle funzioni, i moduli condivisi e
quelli dati: un'app nuova entra da sola.
Un service worker e le funzioni **non sono moduli ESM** (`importScripts`,
`require`): vanno compilati come script classici, se no il controllo li accusa
per una ragione che non è la loro.

## ⛔ E la trappola che stavo per armare a ogni commit

La prima stesura della controprova **scriveva sul modulo vero** e lo
ripristinava. Avrebbe funzionato — ma `CLAUDE.md` vieta di toccare moduli e
pagine mentre gira un giro del browser, e questa controprova sta nel giro
`node`, che si lancia **proprio** mentre l'altro cammina. Sarebbe stata una
trappola armata a ogni commit, e l'avrebbe pagata un giro del browser
misurando una falsità. Adesso l'iniezione va in una **cartella temporanea**, e
il nome del file si conserva perché è lui a dire se è un modulo o uno script
classico.

## Prove

- **La controprova del difetto vero**: sulla copia con `sw.js` rotto il
  controllo adesso dice `✗ sw.js: non compila` ed esce **1**. Prima: 0 caduti,
  uscita 0.
- La controprova interna vede **14 iniezioni su 14 pagine** e **19 su 19
  moduli a sé**.
- Costo misurato prima di aggiungerlo: **0,3 secondi** per tutti i file, il
  bundle di three.js compreso. Nessun argomento di costo contro la regola.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **1.039
righe**.
⛔ Finché cammina non si toccano pagine né moduli dati.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = il giro si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`): si
  rilancia e si legge, non si ricopia. Un'unità per app, un file per commit.

## Blocchi
Nessuno.
