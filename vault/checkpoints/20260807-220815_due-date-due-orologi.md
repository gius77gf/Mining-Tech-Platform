# Checkpoint — 2026-08-07 22:1x UTC

## Tipo
unit-complete (la prova di Flotta che dipendeva dall'orologio del muro)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`80345a3` — *La prova di Flotta dipendeva dall'orologio del muro: due date, due orologi*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 204 | **un orologio solo nella pagella di Flotta** (`80345a3`) | UTC **1885/0** · Europe/Rome **1885/0** |

## ⛔ Il difetto si è presentato DA SOLO, a mezzanotte di Roma
Nessuno aveva toccato niente: alle 22:02 UTC — **00:02 a Roma** — una prova ha
cominciato a cadere. Cadeva **solo in ora italiana**, quindi la vedeva
`orologio-cliente.mjs` e il giro di casa no.

## ⛔ La causa: due date, due orologi
Le date della dimostrazione di Flotta sono **relative all'orologio**
(`isoIndietro`, riga 99 di `flotta-data.js`: `Date.now() − giorni × 86400000`),
mentre la prova pinnava `2026-08-01`. Ha retto finché le due si somigliavano.
Misurato: il fermo **aperto** del Dumper D3 nasce sei giorni indietro, quindi in
UTC cadeva il 01/08 e a Roma — mezzanotte passata — il **02/08**, cioè **dopo**
l'«oggi» fisso. Da lì `giorniFermo` andava a 0.

⚠️ **La cura non è spostare la data fissa di un giorno**: si romperebbe di nuovo
domani. È prendere l'ora dalla **stessa fonte** da cui la dimostrazione prende
le sue.

## ⚠️ Verificato che non fosse mio prima di dirlo
Rilanciata su una `git worktree` **pulita di HEAD**, senza le mie modifiche:
cadeva uguale. Poi verificata la chiusura **nei due fusi**, che è l'unico modo
di dire che è chiusa.

## ⛔ E la CI diceva la stessa cosa, con le stesse parole
Letto il registro del job invece di dedurlo: *«3 suite rilanciate in ora
italiana, 1 cadute — una prova che passa solo in UTC misura il contenitore: qui
c'è un difetto vero»*. Il controllo del 01/08 ha funzionato esattamente come
era stato scritto per funzionare.

## Stato delle prove
Prove **2.300** (`run-kpi` 1885), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti** — e adesso anche in ora
italiana.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **208 sezioni**.

## Prossimo passo atomico
1. ⛔ **Guardare la CI su `80345a3`**: se torna verde, il difetto è chiuso; se
   no, la causa è un'altra e va cercata **senza** riusare questa diagnosi.
2. ⛔ **Raccogliere il giro**: PRIMA le righe «non ho guardato», poi i KO,
   distinguendo le controprove. Poi **rilanciarlo sul commit corrente** —
   quello vecchio non copre ventiquattro commit.
3. ⏱️ **Altre date fisse accanto a dati relativi**: in `run-kpi` ci sono altri
   due `const OGGI = new Date("2026-08-01…")` (righe ~16706 e ~16956). Vanno
   **guardati uno per uno**: se anche i loro dati sono relativi, sono due
   bombe a orologeria identiche che non sono ancora esplose. **Non misurato.**
4. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- La barra vera del core: adesso si **dichiara** non misurata, ma non è ancora
  misurata.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
