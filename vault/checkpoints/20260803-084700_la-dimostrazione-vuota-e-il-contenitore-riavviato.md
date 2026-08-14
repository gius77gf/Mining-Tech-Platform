# Checkpoint — 2026-08-03 08:47:00 UTC

## Tipo
unit-complete (la dimostrazione del core) + ripresa dopo il riavvio del
contenitore

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`63928d4` — *La dimostrazione del core era vuota proprio dove l'app lavora*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 34 | **il numero che smentisce il commit di prima** (`301b5b7`) | le modali del core restano **0 su 68**: il selettore non era la causa |
| 35 | **la dimostrazione del core** (`63928d4`) | `@volate` da **0 a 4** righe cliccabili; prima lo storico dei rapportini era vuoto |

⛔ **La causa vera della cecità sul core, misurata e scritta:** la
dimostrazione era vuota proprio dove l'app lavora. Zero-due righe cliccabili
per sezione e **zero** in `@volate`, perché `rapportini: []`. Il banco delle
modali ha un programma da 68 schede e una dimostrazione senza le righe da cui
aprirle. Adesso il ripiego e il primo avvio seminano quattro rapportini di
perforazione e due del fochino — **scelti, non riempitivi**: uno senza un solo
foro misurato e uno misurato senza la maglia, cioè i due stati che l'app ha
imparato a raccontare oggi. Guardato nello scatto a 390 px: «4 rapportini · 34
fori · 2395.1 mc · 1 senza nessun foro misurato, 1 senza maglia, quindi senza
volume: non sono nel totale».

## ⚠️ Il contenitore si è riavviato, e ha ucciso tre cantieri
Alle 08:35 sono partiti tre cantieri (Conti stampe, Sentinella report, Flotta
libretto) e alle 08:36 il contenitore è ripartito: **nessuno dei tre aveva
scritto una riga**, l'albero era pulito. Sono stati **rilanciati** con lo stesso
mandato e l'avviso di ripartire da zero.
✅ **Quello che è sopravvissuto è sopravvissuto per la disciplina già scritta**:
HEAD locale e `origin` erano allineati a `301b5b7` e l'unica cosa non committata
era l'unità in corso, ancora sul disco. È la seconda volta in due giorni che un
evento della piattaforma costa lavoro: la difesa resta quella — **committare
ogni unità appena è verificata**, non a fine blocco.

## Stato delle prove
run-kpi 1609, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**2.005** senza rete; **67** banchi; copertura 642/642; giro `node` **20 su 20**.

## Che cosa sta girando adesso
- **il giro completo del browser** (`scratchpad/capo/giro4.txt`): è il **primo**
  con il core sia accessibile sia popolato, quindi è anche il primo che può
  misurarlo davvero;
- **tre cantieri**: Conti (i documenti stampati), Sentinella (il report per
  l'ente), Flotta (il libretto e il giro macchina).

## Prossimo passo atomico
1. Leggere `giro4.txt` (cerca `USCITA=`). ⚠️ **Aspettarselo rosso**: col core
   ora visibile, `contrasto --solo=core` ha già trovato **5 violazioni AA** che
   prima nessuno vedeva (`.av-cv` 2,36:1, `.av-fc` 3,45:1, `.notif-badge`
   3,49:1, `.sync-badge.nonsalva` 4,22:1, e un `.toast info` a 1,45:1 da
   verificare, che potrebbe essere l'artefatto del fondo a gradiente). Vanno
   corrette **tutte insieme**, con lo scatto prima/dopo: sono la palette del
   core, quindi si scurisce il minimo indispensabile tenendo la tinta.
2. Raccogliere i tre cantieri, app per app, con la solita procedura (indice
   costruito da `HEAD` tagliando la **banda** dell'app, worktree ricreata).
3. Poi: la decisione se il banco delle modali debba **dichiarare** una
   superficie senza dati invece di dire «non raggiunta».

## Code aperte, dichiarate
Immutate. Le **19 decisioni** del fondatore procedono **venerdì 07/08** se non
arriva risposta, e vanno dichiarate nel commit.

## Blocchi
Nessuno.
