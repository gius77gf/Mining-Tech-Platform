# Checkpoint — 3331 misure che adesso valgono qualcosa

- **Tipo**: unità (controprova per `contrasto.mjs` + documentazione mancante)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `284079e`

## Il punto

`contrasto.mjs` è il banco che fa **il maggior numero di misure di tutta la
suite**: 3331 testi su nove superfici. Rispondeva «0 sotto soglia» — e **niente
dimostrava che ne sapesse vedere uno**.

È esattamente la posizione in cui si trovava la regola dei dialoghi stamattina:
un controllo che gira, misura tanto, e dice ok — mentre è cieco. Con la
differenza che qui il numero è grande, e un numero grande dà una fiducia
sproporzionata.

## Cosa è entrato

`--controprova` appende a ogni superficie una riga di testo a **~1,15:1** e
pretende che venga bocciata su **tutte e nove**. Verificato: **9 su 9**.

Tre dettagli che rendono la prova onesta:

- il veleno è **riconosciuto e scalato**, quindi non sporca il conto delle
  bocciature vere;
- se una superficie lo **promuove**, il banco lo scrive a schermo con il
  rapporto che ha calcolato — così si vede *dove* non sta guardando;
- come per gli altri banchi, in modalità controprova si esce **male** se il
  difetto non viene trovato.

## La lacuna trovata per strada

`contrasto.mjs` **non era documentato** nel `LEGGIMI.md` dei banchi: c'era solo
`contrasto-core.mjs`, la versione ridotta che guarda i riquadri della home. Il
banco più grosso della suite non aveva una riga che spiegasse come si lancia.
Adesso c'è, con le sue cinque trappole — e la nota che **erano tutte e cinque
nel verso che assolve il difetto o accusa il prodotto a torto**: una misura che
grida al lupo consuma la fiducia esattamente come una che tace.

## Stato

- **16 banchi** del browser (erano 15 stamattina)
- **177** prove di stile, **433** KPI, 43 helper, 23 pointcloud, 9 manifest,
  7 demo — 692 prove `node`, tutte verdi

## Prossimo passo atomico

Restano senza controprova i banchi `vetrina-collegamenti.mjs` (ce l'ha),
`interi-superfici.mjs` (ce l'ha), `note-stato.mjs` (ce l'ha) — cioè, a
guardarli, **tutti tranne quello che apre le pagine e conta gli elementi**
(`giro.mjs` con la prova «la pagina monta davvero»). Lì la domanda giusta è
diversa: quella prova afferma «1379 caratteri, 1973 elementi, 59 campi, 142
comandi». Va verificato che quei numeri **scendano** se una sezione non si apre
— altrimenti misura il montaggio della pagina, non il fatto che le sezioni ci
siano.

## Bloccanti

- Nessuno.
