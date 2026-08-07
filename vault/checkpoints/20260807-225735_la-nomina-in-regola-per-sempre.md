# Checkpoint — 2026-08-07 23:2x UTC

## Tipo
unit-complete (la nomina con la data di fine illeggibile)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`74b5ac0` — *Una nomina con la data di FINE illeggibile restava «in regola» per sempre*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 211 | **`senzaData` guarda anche `al`** (`74b5ac0`) | prove **2.301 → 2.302**; 3 forme illeggibili su 3 ora dichiarate |

## ⛔ Il difetto
`giorniTra` su una data che non esiste risponde `NaN`, quindi
`Number.isFinite(g) && g < 0` non scatta e `nominaAttiva` risponde `true`:

| data di fine | prima |
|---|---|
| valida e **scaduta** | `false` — giusto |
| `2026-13-45` | **`true`** |
| `2026-02-30` (giorno che non esiste) | **`true`** |
| `boh` | **`true`** |

Un ruolo obbligatorio di legge — RSPP, medico competente, sorvegliante — usciva
**verde «In regola»** su una nomina scaduta chissà quando.

## ⛔ E LA CORREZIONE OVVIA ERA SBAGLIATA — me l'hanno fermata due prove che
c'erano già
Mettendo la guardia dentro `nominaAttiva`, la nomina **spariva dall'elenco**, e
le due prove esistenti dicono perché non si fa, con la ragione scritta nel
codice: *«la nomina resta comunque nell'elenco: si deve poter capire chi era»*.
**Una data illeggibile non è un motivo per NASCONDERE: è un motivo per
DICHIARARE.** Quindi si allarga la bandiera `senzaData` — già il posto in cui
questa app dice «questa data non si legge» — che guardava **solo `dal`**.

Dopo: `senzaData` 1, stato **warn** (non verde), e la nomina **resta** in
elenco. I casi sani non si muovono: una fine leggibile e l'assenza della fine
(che è normale) non fanno scattare niente — se no il modo più facile di far
passare tutto sarebbe **ingiallire ogni nomina**, che su un obbligo di legge è
l'errore opposto.

## ⚠️ È l'esempio di CLAUDE.md AL CONTRARIO
Di solito è la prova a indovinare male i campi e ad accusare il codice sano; qui
il codice sbagliato era il **mio** e le prove avevano ragione. Lette invece che
allentate — e la regola dice esattamente questo: *si corregge rendendo
l'asserzione più giusta, non più permissiva*.

## Stato delle prove
Prove **2.302** (`run-kpi` **1886**), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
⛔ Il giro completo (19:08 su `2ab9535`), a **212 sezioni**, con attesa armata.

## Prossimo passo atomico
1. ⛔ **Sentinella · la lettura a mano taglia lo storico a 50** mentre
   `MAX_LETTURE` è **500** e il percorso import lo dichiara: sarebbero **151
   letture cancellate**, non scartate — e sparirebbero anche da `scartate` del
   report, cioè senza lasciare traccia. Proposto dal cantiere, **non ancora
   verificato da me**: verificare, correggere, blindare.
2. ⏱️ **Terra · `divarioRecupero`**: bandiera per i m² e non per i m³ (`somma`
   usa `+x || 0`, un lotto senza volume vale 0). Proposto, non verificato.
3. ⏱️ **Terra · `csvRilievi`** scrive `0` per un volume `""` (guardia a un verso
   solo), e il messaggio dice «8 rilievi» mentre il lettore ne riporta **7**.
4. ⛔ **Raccogliere il giro** e rilanciarlo sul commit corrente.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- La barra vera del core: si **dichiara** non misurata, non è ancora misurata.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
