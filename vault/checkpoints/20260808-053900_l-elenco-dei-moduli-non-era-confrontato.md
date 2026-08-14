# Checkpoint — 2026-08-08T05:39:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`577b5cf` — *run-stile: l'elenco dei MODULI non era confrontato con niente —
tre fuori da ogni regola*

## Che cosa è stato completato

`SUPERFICI` ha la sua guardia dal 03/08: ogni pagina del repo o è nell'elenco o
è **esclusa con la ragione scritta**. `MODULI` no — ed è un elenco scritto a
mano **nello stesso file, dieci righe più in là**.

La misura al primo colpo: **tre moduli condivisi fuori da ogni regola** di
`run-stile`, e non perché fossero nuovi:
- `shared/deepwork-id-client/index.js` — l'**SDK** da cui passa ogni accesso ai
  dati di ogni app;
- `shared/dw-tema.js` — il **motore dei temi**, cioè proprio il file su cui le
  regole del colore avrebbero più da dire;
- `shared/dw-fluido.js`.

Aggiunti: le prove passano da 300 a **309** e **nessuna cade**.

> Il risultato onesto è che lì dentro **non si nascondeva un difetto**. E il
> punto non è quello che si è trovato: è che per trovarlo bisognava **avere
> l'idea di guardare**. La guardia toglie quel bisogno.

Adesso il controllo conta **16 file `.js`**, tutti guardati o esclusi con la
ragione — l'unica esclusione è `pointcloud.js` (matematica pura, nessun testo
d'interfaccia e nessun colore; le sue prove sono le 32 di `run-pointcloud`).

## ⚠️ Terza volta stanotte per la stessa lezione

1. l'elenco `BROWSER` di `numeri-nei-documenti` guardava **due documenti su
   tre**;
2. la **somma scritta** di `DEVELOPMENT.md` non la guardava nessuno;
3. e qui un elenco a mano stava **accanto** a uno sorvegliato.

> **Un elenco scritto a mano si accorcia da solo, e ogni volta che si accorcia
> il verde che stampa vale un po' meno.**

## Controprova

Tolto `dw-tema.js` dall'elenco su una copia: il controllo **cade e lo nomina**
(«1 moduli che nessuna regola guarda → shared/dw-tema.js»).

## ⚠️ E i numeri dei documenti sono stati RIMISURATI, non sommati a mente

2.310 → **2.320**, e il giro completo 2.576 → **2.589**. Il mio conto a mano
dava 2.588: il **+1** è `import esistenti`, che conta **per file** ed è salito
perché stanotte è nato `giro-sicurezza.mjs`. È esattamente la ragione per cui
quel numero si misura invece di sommarlo.

## Prove

- `run-stile`: **300 → 310**, 0 fallite.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. **3.635 righe** — si avvicina alla fine
(l'ultimo giro completo ne fece circa 5.000).

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo (tocca le pagine):
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola. L'elenco lo stampa la suite
  (`[misura] quinta forma`): si rilancia e si legge, non si ricopia.

## Blocchi
Nessuno.
