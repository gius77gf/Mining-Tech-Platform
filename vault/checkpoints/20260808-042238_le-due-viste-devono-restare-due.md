# Checkpoint — 2026-08-08T04:22:38Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d8a47f4` — *run-stile: le due viste del tokenizzatore devono continuare a
essere due*

## Che cosa è stato completato

Chiusa la **guardia che mancava** sul secondo tokenizzatore. `CLAUDE.md` dice
da tempo che i tokenizzatori sono **due e vanno scelti**:

- `mascheraCodice` maschera il **contenuto delle stringhe** — giusto per le
  regole sul CODICE (un `prompt(` dentro un testo non è una chiamata);
- `senzaCommenti` toglie **solo i commenti** e tiene il resto — giusto per le
  regole sui TESTI, che vivono dentro le stringhe.

Dal 31/07 leggono la **stessa** classificazione, ed è la cosa giusta: prima
erano due scansioni gemelle che portavano lo stesso difetto in due posti. Ma è
anche la cosa che rende possibile il guasto peggiore — **se una delle due
finisse per comportarsi come l'altra, tutte le regole sui testi diventerebbero
cieche e continuerebbero a rispondere «nessuna violazione»**. Nessuna prova lo
sorvegliava.

## Come è scritta, e perché così

Non guarda **com'è scritto** il codice delle due funzioni — quello cambia — ma
**che cosa sopravvive**: la stessa parola messa in **tre posti** (dentro una
stringa, dentro un commento di riga, dentro un commento di blocco) dev'essere
vista **zero** volte dalla prima vista e **una** dalla seconda. Se i due numeri
diventano uguali, le viste si sono fuse.
Misurato prima di scriverla, in scratchpad: 3 occorrenze → **0** con
`mascheraCodice`, **1** con `senzaCommenti`. È la forma «pretendi l'identità /
pretendi la differenza» già usata per gli alias di `shared/`.

## E i documenti seguono nello stesso commit

La prova nuova li fa invecchiare **nell'istante in cui esiste**: 2.309 →
**2.310**, misurato lanciando le sei suite (1890 + 300 + 71 + 32 + 9 + 8).
È la seconda volta stanotte, ed è il motivo per cui la quarta forma di
invecchiamento è appena entrata in `CLAUDE.md`: qui il controllo **arriva**, e
infatti si accorge.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.
- `run-stile`: **299 → 300**. `numeri-nei-documenti`: 24 su 24.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **968 righe**.
⛔ Finché cammina non si toccano pagine né moduli dati.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** (denominatori, «0 su N», superfici non
   raggiunte) — su Genesi il banco del contrasto dichiara già **69 classi mai
   comparse**, 22 misurate e 47 solo elencate;
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = il giro si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`): si
  rilancia e si legge, non si ricopia. Un'unità per app, un file per commit.

## Blocchi
Nessuno.
