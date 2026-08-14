# Checkpoint — 2026-08-07 12:45:00 UTC

## Tipo
unit-complete (quattro unità: Campo, Scudo, il setaccio del campione scappato,
e il secondo giro di Terra)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4d611be` — *Terra: il prospetto usciva dal foglio per le INTESTAZIONI, e sei
punti d'interfaccia non li aveva mai aperti nessuno*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 143 | **Campo nei temi chiari** (`98fe776`) | chiaro **10 → 0**, sole 10 → 0, testi 369/369/369 |
| 144 | **Scudo nei temi chiari** (`73d1ae3`) | chiaro **9 → 0**, sole 9 → 0 — **sesta app su sei** |
| 145 | **il setaccio del campione scappato** (`0b7b46a`) | 143 + 2.097 numeri su due banchi |
| 146 | **Terra: prospetto e copertura** (`4d611be`) | documento **435 → 390** px; cinque stati da 0 a 5 comparse |

## ⛔ TUTTE E SEI LE APP SONO A ZERO NEI TRE TEMI
Sentinella `24c4d89`, Flotta `b50c8b4`, Conti `099f375`, Terra `f73efba`,
Campo `98fe776`, Scudo `73d1ae3`. Stamattina erano **54 violazioni AA** nei due
temi chiari e zero al buio: sei palette verificate a contrasto in **un tema su
tre**, e nessuno lo sapeva perché nessuno le aveva mai aperte.

⚠️ **E sei cantieri che non si parlavano hanno deciso la stessa cosa**, ognuno
con la propria misura: **non riscrivere `--warn/--success/--danger`**, perché
quei colori fanno anche da **pieno** — in Conti scurire `--danger` fa scendere
la pastiglia «INSOLUTA» da 5,72 a 3,30; in Terra e Scudo `.badge.warn` ci scrive
sopra quasi-nero a 9,3:1. Quando un colore fa due mestieri, i due mestieri
vogliono due valori. È un principio del prodotto, non una scelta di tre app.

## ⛔ E il banco aveva torto quattro volte su trentadue
Flotta 1 su 13, Campo 1 su 10, Scudo 2 su 9 — e **tutte e quattro cadono fra i
casi con la forbice larga**, che è esattamente ciò che la forbice committata
stamattina serviva a segnalare. Sui casi senza forbice i righelli indipendenti
danno lo stesso identico numero del banco (3,27 e 3,13 in Campo, alla cifra).
⚠️ Ma la forbice **non ribalta per forza il verdetto**: su Terra il «759k»
aveva forbice 3,85 ed era vero lo stesso, di 0,02. Dipende da **dove** stanno le
due fermate, e questo lo dice solo la geometria.

## ⛔ Il setaccio nuovo era cieco proprio sul file per cui era nato
La regola «un numero con quindici decimali dove lo schermo ne mostra zero» era
scritta in prosa in CLAUDE.md, cioè affidata alla memoria. Adesso è un controllo
condiviso da due banchi. La soglia è **misurata** sui 33 file veri delle sei app
(113 numeri a una cifra, 12 a due, 18 a tre, **zero** a quattro o più), e l'unica
eccezione — la traccia d'onda a `toFixed(4)` — è dichiarata per nome, con il
controllo che pretende che **si presenti ancora**.
⚠️ La prima stesura portava `(?<![\d.,]) … (?![\d.,])` per non farsi ingannare
dal raggruppamento delle migliaia: rifiutava **ogni numero seguito da una
virgola**, cioè tutto un JSON. Sul `.volata.json` rispondeva **«0 numeri
guardati»** e stampava un **ok**. L'ha preso il **conto dei soggetti** stampato
accanto all'esito, non l'esito. E la guardia non serviva nemmeno: i gruppi delle
migliaia sono da tre cifre, cioè sempre sotto soglia.
Con `--controprova` le prove cadute passano da 21 a **22**: il setaccio, da
solo, avrebbe trovato il difetto del `.volata.json`.

## Stato delle prove
Prove **2.251** (`run-kpi` 1844, `run-stile` 295), copertura 677/677, giro
`node` **23 comandi, 0 caduti** verificato sulla copia di quello che si
committava, cinque volte di fila.

## Che cosa sta girando adesso
Niente cantieri. Sta girando la **verifica delle due passate nuove** del giro
(`--tema=chiaro` già verde: 3.694 testi, 0 sotto soglia; `--tema=sole` in corso).

## Prossimo passo atomico
1. **Finire di registrare i due temi in `tutti.mjs`** (modifica sul disco, non
   committata): serve la conferma che `--tema=sole` sia verde e che la passata
   `--controprova --tema=chiaro` **sappia fallire** — se le due bandiere non si
   combinano, quella riga va tolta invece che lasciata a dare un verde vuoto.
   ⚠️ E i documenti dicono **129 esecuzioni**: con tre passate nuove diventano
   132, e il conto va aggiornato al commit.
2. **La geometria del gradiente** in `contrasto.mjs` (quattro angoli del
   rettangolo del testo: per un gradiente lineare gli estremi della proiezione
   stanno lì). Adesso è **sbloccata** — non ci sono più cantieri che usano il
   banco — ed è giustificata da quattro accuse false su trentadue.
3. ⛔ **La decisione su `shared/`**, con sei soluzioni in mano invece di
   nessuna. Misura raccolta da tre cantieri indipendenti: `dw-app-ui.css` deriva
   `--grad-ok/-wr/-dg` con una mano fissa (86% / 78% / 82% verso il nero) tarata
   su **nessun fondo in particolare**, ed è il motivo per cui il difetto era
   identico in tutte e sei le app.
   ⚠️ Ma la prima cosa da sistemare non è la derivazione: è che **la stessa idea
   ha due nomi** — Conti ha scritto `--danger-ink/--warn-ink/--sup-ink`, le
   altre cinque `--ink-dg/--ink-wr/--ink-ok`. Misurato: `color:var(--stato)`
   crudo resta 3 in Scudo, 7 in Campo, 6 in Flotta, 10 in Conti, 11 in
   Sentinella, 4 in Terra, **31 nel core**.
4. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- **Le strisce di stato non sono testo e nessuno le misura** (WCAG 1.4.11 → 3:1):
  sul chiaro usano il colore crudo — `--warn` **1,62** sul `--bg` di Scudo,
  1,85 in Campo, `--success` 2,35, e passa solo il rosso. **Tre app su sei** lo
  hanno segnalato da sole; dieci delle tredici regole stanno in `shared/`.
- `.vita.danger` e `.riga.dng` di Terra restano **non misurati da nessuno**:
  strutturalmente esclusi da `warn`.
- **17 classi in Scudo, 13 in Conti, 18 in Terra** che dipingono un fondo non
  compaiono mai durante il giro: dichiarate, non giudicate.
- Le etichette della barra in basso di Conti sono tagliate a 430 px.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
