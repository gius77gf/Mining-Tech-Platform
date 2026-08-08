# Checkpoint — 2026-08-08T11:36:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
33b5251

## Che cosa è stato completato
**La causa vera del giro rimasto appeso sette ore e mezza**: `vaiA` spendeva
**diciassette secondi per sezione** cliccando elementi che non si possono
cliccare.

Chiudeva aprendo **ogni** accordion chiuso della pagina — non solo quelli della
sezione appena aperta — con `click({timeout: 2500}).catch(() => {})`. Contati:
Conti **0**, Terra **1**, Flotta **7**, Scudo **7**. E tutti e sette, su Flotta e
Scudo, sono **INVISIBILI**: stanno in sezioni che non sono a schermo. Playwright
aspetta che un elemento diventi *azionabile*; un invisibile non lo diventa mai,
quindi ogni click bruciava i 2.500 ms pieni e il `.catch` se li mangiava **senza
lasciare una riga**.

### Prima → dopo, misurato con `vaiA` cronometrata
| superficie | prima | dopo |
|---|---|---|
| Conti | 0,55 s | 0,58 s (zero accordion: non pagava niente) |
| Terra | 3,2 s | 0,57 s |
| Flotta | 9–15 s | **0,57 s** |
| Scudo | **oltre 15 s** (6 sezioni su 8 sforavano) | **0,59 s** |

### ⛔ E non si perde copertura — la domanda che conta, con un numero
Gli accordion chiusi **e visibili** su quelle superfici sono **zero**: quel giro
non ne apriva nessuno. Verificato sul risultato, non sulla teoria:
· `contrasto --solo=scudo` → **614 testi misurati**, identici a stamattina, in
  **22 secondi** invece di minuti;
· `uno-solo` — il banco che nel giro era appeso da **4h38** — finisce in
  **4m18s**: 76 schermate, 183.777 caratteri, 3 ok 0 KO; la controprova trova le
  sue **14** frasi rotte, quindi sa ancora fallire.

### ⚠️ E non l'avevo causata io
Sul commit di ieri (`eca2c21`, prima delle nove unità di stamattina) Scudo dava
**43.768 ms** contro i **43.807** di oggi. Difetto vecchio, che i banchi hanno
assorbito in silenzio come «lentezza» — ed è la ragione per cui un giro completo
durava ore.

## Verifica
Copia di quello che si committa, confronto patch-a-patch identico: **26 comandi,
0 caduti**.

## Stato roadmap
Seconda unità del ciclo. Le due insieme tolgono di mezzo il blocco che impediva
il passo atomico di ieri: adesso un giro del browser **finisce**, e se un banco
si pianta il giro lo **dichiara** invece di aspettarlo per sempre.

## Prossimo passo atomico
**Lanciare il giro del browser completo** (`node
apps/deepwork-id/tests/browser/tutti.mjs`) — è la prima volta che si può fare
senza rischiare di perderlo — e leggerlo con `leggi-giro.mjs`, **sezione 1
prima della 2**. Attenzione a due cose: il giro serve una `git worktree` sua e
dichiara il commit che attesta; e la riga nuova «le tre passate più lente» va
letta, perché è quella che dice se il limite di 30 minuti è tarato bene ora che
le passate sono molto più corte.
Poi, se il giro è pulito: le **57 classi «non giudicabili fuori dal loro posto»**
del banco del contrasto — resa già misurata, **1 solo** difetto atteso
(`terra .avatar.ico.danger`, 3,88 nel caso peggiore, forbice 1,02).

## Blocchi
Nessuno.
