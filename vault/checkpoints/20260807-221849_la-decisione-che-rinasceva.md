# Checkpoint — 2026-08-07 22:2x UTC

## Tipo
unit-complete (una decisione già presa che i checkpoint riproponevano)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`463b52b` — *Il «tema che scala» era gia' deciso con la misura, e i miei checkpoint lo riproponevano*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 205 | **la decisione sul tema, rimisurata e datata** (`463b52b`) | **12 righe su 12** sono `.nav button`: «uno solo morde» regge |

## ⛔ Un cantiere da sei file evitato, e a proporlo ero io
Da giorni i miei checkpoint portavano «il tema che scala invece di fissare»
come **prossimo passo atomico**. CLAUDE.md quel cantiere lo aveva già chiuso —
*«Non fatta: con un solo soggetto che morde, sei file di rischio non se li
merita»* — e nessuno aveva confrontato le due cose.

## ⛔ Rimisurata prima di fidarmi, perché la regola vale anche in casa
- il tema del sole in `shared/` fissa un corpo su **otto** selettori distinti;
- le app che ne ridicono almeno uno sono **tre su sei** — Conti 4, Scudo 3,
  Sentinella 5 — e Campo, Flotta, Terra **zero**;
- e le dodici righe di quelle tre app sono **tutte e dodici `.nav button`**:
  nessun altro corpo ridetto da nessuno.

«Uno solo morde» non è invecchiato. La verifica è scritta **accanto alla
decisione**, con data e numeri, così la prossima volta si legge invece di
rifarla.

## ⚠️ La lezione, che non è sul tema
**Una decisione presa con la misura va tolta anche dalle liste che la
propongono**, se no rinasce da sola. Qui a riproporla erano i **checkpoint** —
il posto in cui il ciclo si dice che cosa fare dopo — ed è lo stesso meccanismo
che il 01/08 stava per far aprire cantieri su lavoro già fatto.
⛔ Quindi: **questo passo esce dalla lista** e non va rimesso.

## Stato delle prove
Prove **2.300** (`run-kpi` 1885), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
- ⛔ **Il giro completo** (partito 19:08 su `2ab9535`), a **212 sezioni**, nel
  blocco delle controprove. C'è un'attesa armata che avvisa quando finisce.
- **Tre cantieri di ricerca in parallelo** (direttiva 3) su **Scudo**,
  **Sentinella** e **Terra**, a caccia del filo della settimana: numeri scritti
  dove non è stato misurato niente. Gli agenti **non toccano file** e devono
  incollare comando + uscita per ogni affermazione. ⚠️ Niente entra sulla loro
  parola: si verifica contro il codice prima di aprire qualunque unità.
- La **CI** su `ab92be2`.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce: PRIMA le righe «non ho guardato»,
   poi i KO, distinguendo le controprove. Poi **rilanciarlo sul commit
   corrente** (indietro di ventotto commit).
2. ⛔ **Raccogliere i tre cantieri** e verificare ogni loro affermazione contro
   il codice, scartando ciò che è già dichiarato in `sonda-vuoto.mjs`.
3. ⏱️ **La barra vera del core**: adesso si **dichiara** non misurata; per
   misurarla il banco deve arrivare allo stato in cui il programma l'ha
   costruita.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**,
   con l'`appId` come argomento.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
