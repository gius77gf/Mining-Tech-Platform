# Checkpoint — il giro completo, letto fino al riepilogo

- **Tipo**: verifica di tutta la giornata + una correzione che ne è uscita
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Il risultato

`node apps/deepwork-id/tests/browser/tutti.mjs`, tredici banchi, quasi un'ora:

```
12 banchi a posto, 1 da guardare
```

E il banco «da guardare» era la **controprova degli id** — che aveva funzionato
benissimo, trovando il difetto iniettato su **tutte e nove** le superfici.

## Il difetto era nel mio codice d'uscita, non nel prodotto

Uscivo con `1` perché avevo trovato i doppioni: cioè **segnalavo come guasto il
fatto che il banco funzionasse**. Nel riepilogo compariva «KO» accanto alle
altre controprove che dicono «ok».

Sistemato, ma **non** copiando la convenzione delle altre (che escono `0` e
lasciano leggere i KO a chi guarda). In controprova adesso si esce **male se una
superficie resta PULITA**, perché vuol dire che il difetto iniettato non è
arrivato e lì il banco non ha dimostrato niente. È esattamente il difetto
trovato stamattina, quando l'iniezione finiva dentro i modelli di stampa di tre
superfici su nove: allora me ne ero accorto **leggendo**, adesso lo dice il
banco da solo.

Verificato: esce `0` e stampa *«ha trovato il difetto su tutte le superfici: il
banco sa fallire»*.

## Lo stato delle prove, a fine giornata

| Dove | Quante |
|---|---|
| senza rete, con `node` | **662** (erano 555 stamattina) |
| con l'emulatore Firestore | **106** *(contate sui file: qui non partono, la rete di lavoro blocca l'avvio dell'emulatore — le fa girare la CI della PR)* |
| banchi che aprono le pagine | **13** (erano 11) |
| regole di stile verificabili | **13** (erano 11) |

## La cosa da non ripetere

Durante il giro ho continuato a correggere: quel giro legge file diversi fra il
primo banco e l'ultimo. È la seconda volta nella stessa giornata. Il prossimo si
lancia **e si lascia in pace** fino al riepilogo — solo documenti nel frattempo.
Un risultato misto è peggio di nessun risultato: sembra completo.

## Prossimo passo atomico

Il lavoro di prodotto rimasto e non gated è la **seconda iterazione della
vetrina** (terza, in realtà: la prima l'ha corretta la ricerca del 30/07) —
oppure, se si preferisce restare sul filo di oggi, uno dei sei export
ri-caricabili mancanti. Ma quelli sono la **decisione 12** e spettano al
fondatore.

## Bloccanti

- Nessuno. Resta impossibile qui la verifica delle 106 prove con l'emulatore:
  la fa la CI della PR #322.
