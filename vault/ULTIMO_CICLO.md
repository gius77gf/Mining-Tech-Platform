# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-12, 16:19 UTC
- **Commit di partenza**: `3c3cad3e`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Repository raggiungibile, `HEAD` combacia col remoto, working tree pulita.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine**: concentrarsi SOLO sull'app Genesi
per ora ("focalizzati solo su genesi per il momento, voglio migliorare il
programma al massimo"). Il prompt automatico di questo ciclo propone i
ponti fra le app e la passata in profondità su tutte le app — non va
seguito alla lettera finché questa direttiva resta in vigore: si resta su
Genesi.

Appena completata l'unità 126: nuova funzione `caricaDaX50Target` (inversione
del modello Kuz-Ram — dato un x50 target, quanti kg/foro servono), bottone e
modale nella scheda 2D, proiezione MIC/PPV. Consolidate due duplicazioni di
formula preesistenti (`ppvDaSd`, un punto di `rwsEffettiva`/`PENALITA_ACQUA`).
Trovato e corretto un difetto vero (classe CSS orfana `dw-input`, presa da
`classi-orfane.mjs`). Verificato con `giro-node.mjs` su worktree pulita:
40/40 comandi a posto. Dettagli completi in
`vault/checkpoints/20260912-161749_genesi-x50-target.md`.

## Prossimi passi immediati

1. Il "Prossimo passo atomico" del checkpoint 126: decidere e implementare
   il tetto ALTO del dominio di `caricaDaX50Target` (x50 target
   sub-millimetrico → oggi nessun avviso), partendo dalla ricerca già
   raccolta in `docs/RICERCA_CONTINUA_GENESI.md` (il vincolo reale è
   dimensionale — Rosin-Rammler valido 10-1000 mm — non sul powder factor).
2. In alternativa/coda: le quattro occorrenze residue della tabella
   `PENALITA_ACQUA` ancora duplicate inline in `genesi.html` (dichiarate,
   non toccate nell'unità 126 per restare nel perimetro).
3. Continuare a scorrere il cantiere B3 di Genesi (funzioni estraibili da
   `genesi.html` a `genesi-data.js`, `genesi-estraibili.mjs --elenco`) o
   altre voci Genesi-specifiche di `vault/ROADMAP_SETTIMANA.md` e
   `docs/GENESI_ROADMAP_COMPETITOR.md`.

⚠️ **Nota sul prompt fisso della routine**: cita ancora la mappa dei ponti
e lo stato di Genesi come erano il 26/08. Questi fatti sono superati da
settimane di lavoro misurato — il documento vivo è
`docs/MAPPA_ECOSISTEMA.md` — e in ogni caso, finché vale la direttiva del
fondatore di questa conversazione, il lavoro resta su Genesi sola. Il
canarino di questo ciclo serve a dire che il lavoro è vivo, non a resettare
lo stato a quello del prompt né a cambiare app.
