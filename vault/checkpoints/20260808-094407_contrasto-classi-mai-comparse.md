# Checkpoint — 2026-08-08T09:44:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
bdb7e05

## Che cosa è stato completato
**Sei contrasti illeggibili nel core, e le tre pastiglie d'esito di un'ispezione
che nel tema chiaro diventavano dello stesso viola.**

### Da dove è uscito
Dalla riga più grossa del registro del giro, letta nell'ordine che CLAUDE.md
impone — prima le righe «non ho guardato», poi i KO:
> «234 classi con un fondo proprio non sono mai comparse durante il giro:
>  **41** fatte comparire e misurate»
Il banco stampava «4700 testi misurati, 0 sotto soglia» e su quel fronte ne
guardava **una su sei**.

### Tre difetti del righello, indipendenti, stessa famiglia
1. **«copre?» era deciso dal TESTO della dichiarazione**, non dal browser: un
   `#hex`, un `rgb()` o una parola erano «pieno». `var(--card)` no — ed è la
   forma più comune di questo prodotto; `var(--grad)` è un **gradiente dietro
   un nome**, quindi spariva due volte. Misura: 122 marcate «non coprente», di
   cui **68 opache davvero**. Ora si crea un campione e si chiede l'alfa a
   `getComputedStyle`. Il conto col criterio vecchio è **stampato a ogni giro**
   (140 su 182 resterebbero fuori) e se andasse a zero il banco lo dichiara.
2. **una combinazione di classi risultava «già vista» se le sue parti erano
   comparse separatamente.** `.toast.success` usciva dal censimento (perché
   «vista») e non veniva misurata (perché quel toast non era mai a schermo):
   spariva da tutt'e due i conti **senza comparire in nessuna riga «non ho
   guardato»**.
3. **un campione che nasce nascosto non viene misurato**, e il banco lo contava
   lo stesso fra i «fatti comparire». Il segno era uno scarto di due fra due
   numeri sulla stessa riga (51 e 49). Sotto ci stava il **toast di errore**.

**41 → 182 classi misurate su 239.**

### I sei difetti del prodotto — una sola famiglia
Il bianco su un pieno di stato **non regge**: 2,36:1 sul verde, 3,49:1 sul rosso.
| dove | prima | serve |
|---|---|---|
| `.scad-badge.ok` (9px) | 2,36 | 4,5 |
| `.scad-badge.danger` (9px) | 3,49 | 4,5 |
| `.toast.err` (13px) | 3,49 | 4,5 |
| `.toast.success` (13px) | 2,91 | 4,5 |
| `.mbtn.danger` (12px) | 3,49 | 4,5 |
| `.success-icon` (42px) | 2,36 | 3 |
Il core lo sapeva già **in due punti su otto** — `.toast` e `.scad-badge.warn`
usavano un inchiostro scuro, e sono esattamente i due che passavano. Adesso quel
valore ha un nome, `--ink-su-pieno`, coi tre conti accanto (8,20 · 5,56 · 9,98).
E la fermata scura di `--gradSuc` sale a `#3a8f3e`: **un gradiente con le
fermate troppo distanti non ha nessun inchiostro che regga tutt'e due.**

### E nel tema chiaro, una cosa peggiore di un contrasto
Le **tre** pastiglie dell'esito — conforme, non conforme, non applicabile —
erano dipinte tutte e tre dello stesso viola `rgb(94,73,157)`. Causa in
`shared/`: `body.dw.light-mode .chg.active` (0,4,1) batte il
`.chg.e-ok.active` di Scudo (0,3,0). È la regola già scritta in CLAUDE.md —
*una regola che vince per specificità butta via il lavoro di chi ha già
stretto*. Il pieno passa ora da `--chg-pieno`: il tema **scala** invece di
**fissare**. Cinque pastiglie di stato in due app tornano a colori.
Nel tema del **sole** restava `.chg.e-na.active` a 4,02: il terzo stato ha un
pieno suo, chiaro abbastanza per l'inchiostro del giorno e diverso abbastanza da
`--card` da non confondersi con «non ho ancora risposto» — che in una lista di
controllo è proprio la differenza che conta.

## Verifica
· tre temi × 14 superfici: **4700 + 3755 + 3757 testi, 0 sotto soglia**;
· le **quattro** controprove del banco reggono («14 superfici avvelenate, 14
  l'hanno bocciata»; la geometria dei gradienti; la pulsazione);
· giro `node` sulla copia di quello che si committa (confronto patch-a-patch
  identico): **23 comandi, 0 caduti**;
· `numeri-nei-documenti` caduto sul conto delle variabili del foglio condiviso
  (82 → 83, per `--chg-pieno`) e documento riallineato.

## Stato roadmap
Terza unità di fila nata da una riga «non ho guardato». Le tre insieme dicono
una cosa sola: **quelle righe sono il materiale di lavoro più ricco del
repository**, e finora nessuno le leggeva.

## Prossimo passo atomico
Restano **57 classi «non giudicabili fuori dal loro posto»** (core 19, genesi 7,
terra 7, sentinella 5, campo 4, flotta 4, conti 3, scudo 2, e 6 fra le pagine di
Deepwork ID): sono fondi **davvero** semitrasparenti. La strada è già misurata
in scratchpad: comporle sulle superfici che l'app dichiara (`--bg`, `--card`,
`--card2`), **tenere il caso peggiore e stampare la forbice** — lo stesso
schema già benedetto per i gradienti. Resa attesa **misurata prima di
scriverlo**: su sei app 17 classi diventano misurabili e **1 sola** cade sotto
soglia (`terra .avatar.ico.danger`, 3,88 nel caso peggiore, forbice 1,02).
Cioè: il cantiere vale, ma vale **poco** — va fatto sapendo che il prezzo è
quello, non aspettandosi un secondo filone come quello di oggi.

## Blocchi
Nessuno.
