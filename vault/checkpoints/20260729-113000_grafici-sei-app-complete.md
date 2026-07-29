# Checkpoint — 2026-07-29T11:30:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Tutte e sei le app hanno i loro grafici**, e i dati che li rendevano
impossibili sono stati aggiunti.

| App | Grafici |
|---|---|
| Flotta | dove va la spesa · costo di officina per mezzo · disponibilità con la tacca del 90% · **spesa mese per mese** · **disponibilità giorno per giorno** |
| Conti | previsione incassi 6 mesi · esposizione per cliente con la tacca del fido · invecchiamento del credito |
| Terra | avanzamento anno con la tacca del pro-quota · volumi per mese · volumi per fronte |
| Scudo | copertura della formazione per tipo · muro delle scadenze |
| Sentinella | tessera del punto messo peggio con sparkline |
| Campo | scostamento carica per foro · cause di fermo (Pareto col taglio all'80%) · minuti di fermo per giornata |

### I dati aggiunti (Flotta) — è questo che ha sbloccato il resto
- **`data` sulla voce di costo**: modello, form con default a oggi e
  validazione, lista, export CSV, e sulla spesa creata chiudendo un ordine
  di lavoro. Le voci già salvate **non si rompono**: restano valide,
  contano nei totali, portano la pillola «senza data» e si sistemano con la
  matita. Il grafico le dichiara nella nota invece di nasconderle.
- **Fotografia giornaliera del parco**: collezione `disponibilita` via SDK,
  **una riga al giorno**, scritta all'apertura e a ogni cambio di stato.
  Verificato: cambiando lo stato di un mezzo la fotografia di oggi passa da
  67% a 83% restando una sola riga.

### Correzione al motore condiviso
La «quota sul totale» veniva mostrata anche su **serie di percentuali**,
dove sommare non significa nulla (67% + 83% non fa 150% di qualcosa). Ora
il totale si calcola solo se i valori sono sommabili. Segnalato dal
cantiere Flotta, corretto in `shared/dw-grafici.js` perché riguardava tutte
le app.

## Cosa è stato rifiutato (la parte che protegge il prodotto)
- **La linea** per gli andamenti di Flotta: unirebbe due periodi lontani
  con un tratto continuo, cioè disegnerebbe i giorni in cui nessuno ha
  aperto l'app. Solo barre; i periodi mancanti non compaiono e vengono
  contati a parole. Nessuna tendenza sotto i tre periodi. Confronto fra
  mesi solo fra mesi chiusi.
- **Emesso-contro-incassato in Conti**: resta impossibile, la data di
  incasso sulle fatture vecchie è ripiegata su quella di emissione.
- **Barre impilate** (produzione per turno, copertura formazione completa):
  il motore non le ha e l'SVG a mano è vietato. Scelta la forma onesta più
  vicina.
- **Indici infortunistici** in Scudo: richiedono le ore lavorate, che l'app
  non raccoglie.

## Prossimo passo atomico
**Sbloccare l'ultimo dato mancante: la `dataIncasso` vera sulle fatture di
Conti** (oggi ripiegata sulla data di emissione), poi il grafico
emesso-contro-incassato. In parallelo, riprendere il **Blocco 2** delle
proposte di ricerca ancora aperte: Scudo S2–S5 (near-miss dal telefono,
ispezioni, matrice formazione, registro DPI), Campo C1–C3, Flotta L1–L4,
Conti N1–N5, Sentinella T1–T4, Terra R4–R5. Un cantiere per app, in
parallelo.

## Blocchi / attese
- Fondatore: **PR verso main** (serve anche perché la sentinella
  `canarino.yml` entri in funzione), progetto Firebase, prova drone, via
  libera alle curve di sicurezza.
- Segnalato dal cantiere Flotta: `run-kpi.mjs` ha **2 rotture preesistenti**
  su Scudo e Conti, non causate da questo lavoro. Da guardare.

## Note
- Canarini del ciclo: `cf9078c` (09:45).
- `docs/PIANO_GRAFICI.md` aggiornato in coda: due grafici che dichiarava
  impossibili ora si possono fare, con le regole che li rendono onesti.
