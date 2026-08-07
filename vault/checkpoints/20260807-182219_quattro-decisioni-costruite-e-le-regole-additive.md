# Checkpoint — 2026-08-07 18:22:19 UTC

## Tipo
unit-complete (tre unità: la 10b con le regole provate, la 15 col suo costo
misurato, la 18 costruita fino al foglio che va all'ente)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c9c16d7` — *Decisione 18: la detrazione per recupero nasce spenta, e quando è
incompleta lo dice al foglio che va all'ente*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 183 | **decisione 10b** (`93ef5df`) | regole **58 → 68** prove, controprova 4 KO |
| 184 | **la lezione sui permessi additivi** (`75df33f`) | 3 prove positive verdi in **tutt'e tre** le stesure |
| 185 | **decisione 15** (`91cfb29`) | il core ha **zero** ponti, le app **sessanta** |
| 186 | **decisione 18a+18b** (`c9c16d7`) | `run-kpi` **1853 → 1860**, copertura **689/689** |

## ⛔ La cosa più importante di oggi: una restrizione che non restringeva
Scrivendo la 10b nelle regole Firestore, la restrizione era **scritta, leggibile
e decorativa**. Due cause in fila:
1. le regole sono **additive** — un `match` più stretto non può revocare quello
   che uno più largo concede. Finché `{document=**}` diceva `allow write`, tutto
   ciò che scrivevo sotto non toglieva niente;
2. e la variante che rifà il danno un piano sotto: `{resto=**}` combacia con
   **zero o più** segmenti, quindi copriva anche il documento stesso.
⛔ **Le tre prove positive** — «l'admin può cancellare», «il membro può ancora
emettere» — **erano verdi in tutt'e tre le stesure**, compresa quella che non
restringeva niente. L'hanno presa le quattro prove **negative**. Chi prova una
restrizione solo dal lato di chi PUÒ ha scritto un commento, non una regola.

## ⚠️ L'emulatore gira, ma solo a metà — e va detto invece di contarlo verde
`firebase emulators:exec` cade sul proxy quando avvia le **Functions**
(«Unable to parse JSON … denied by …»). Con `--only firestore,auth` gira:
**2345 passate, 21 cadute, e le 21 sono tutte e sole quelle delle Cloud
Functions**. Le regole — che è quello che serviva alla 10b — si provano.

## ⚠️ Tre volte una mia copia debole, presa dai controlli
- `imp-spunta` copiata da Sentinella dove in Terra non la dipinge nessuno →
  `classi-orfane` al primo giro;
- la classe `.badge` letta senza `title` → tre KO identici (il segno del
  righello);
- il confronto per sottostringa che passava col difetto rimesso.

## ⛔ Il costo della 15 era scritto più basso del vero
La scheda diceva che «(a) nel core è la strada più veloce». Lo è **a parità di
ponti**, e i ponti non ci sono: il core ne ha **zero**, le sei app **sessanta**
occorrenze, e un ponte è ~26 righe. Resta la più breve delle tre, ma non è
gratis — e scritta com'era avrebbe fatto sottostimare il cantiere.

## Le decisioni: da 19 aperte a 7
Sette prese **scrivendole** (6, 8, 10c, 11a/b/c, 12b) e **quattro prese E
costruite** (5a, 10b, 18a, 18b). Restano **tre verdi** (5b, 10a, 12a) e le
**quattro ferme** (1, 4, 7, 9).

## Stato delle prove
Prove **2.275** nelle sei suite sorvegliate (`run-kpi` **1860**), copertura
**689/689**, banchi **145**, regole **68**, giro `node` **23 comandi, 0 caduti**
verificato sulla copia a ogni commit.

## Che cosa sta girando adesso
⛔ **Il giro completo dei banchi**, partito alle ~17:55 UTC su una copia di
`3e30e48`. È a otto sezioni: va **raccolto**, e il registro va letto con la
regola delle intestazioni — nel giro il rosso di una controprova si scrive come
un rosso vero, ma le passate di controprova ora lo dichiarano.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** (`scratchpad/io-core/giro-4.txt`): leggere PRIMA
   le righe «non ho guardato», poi i KO, distinguendo le controprove.
   ⚠️ Gira su `3e30e48`, cioè **prima** delle tre unità di stasera: quello che
   dice sui banchi nuovi non c'è.
2. **Le tre decisioni verdi che restano**: **12a** (export ri-caricabile — è la
   più grossa), **10a** (l'abbonamento come barriera vera, tocca i claims),
   **5b** (dove la prima unità è la **misura**: due persone che scrivono la
   stessa riga).
3. ⛔ **Il tema che scala invece di fissare** (tre app riscrivono la stessa
   scala della barra) — cantiere su `shared/`, si serializza.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Il Quadro non è costruito: la 15 dice dove vive.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
