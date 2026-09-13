# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
cd240d99

## Completato
Unità 96 — ricerca a rotazione, secondo giro, Sentinella: «che cosa chiede
l'ente dopo un reclamo per le vibrazioni, e che cosa protegge la cava
prima». Metà sul mondo (ARPA, UNI 9916, la gestione del reclamo, il rilievo
preventivo), delta dal meccanismo contro `7578e26a`. Una voce aperta in due
pezzi (lo stato di fatto del ricettore; la risposta scritta al reclamo),
una dichiarata (l'esposto), tre a posto. Aggiunti i ✅ mancanti alle due
righe del mattino. Solo documenti. Il giro del browser su `faf5e271` è
stato letto: 0 KO veri, 52 banchi a posto; rilanciato su `7578e26a`.

## Imparato
- Due righe del mattino erano chiuse in roadmap e non nel documento che le
  aveva proposte: il ✅ va messo da chi chiude, se no la ricerca dopo
  riscopre la mancanza (è successo: la domanda 2 di stamattina l'ho
  ritrovata «MANCA» con la funzione già nel modulo).
- «Non c'è un limite di legge» è un fatto del mondo che il prodotto già
  rispetta (`daVerificare: true` su ogni preset): la ricerca serve anche a
  confermare le scelte fatte, non solo a trovarne di nuove.

## Prossimo passo atomico
Unità 97, Sentinella, la voce aperta: (1) `statoDiFatto` sul ricettore
(campi `sdf-data`, `sdf-chi`, `sdf-note` nella scheda del ricettore, salvati
nel record; `descriviStatoDiFatto(ricettore)` che dice «del 12/03/2026 (chi):
…» o «nessun sopralluogo registrato: non si sa com'era prima»), richiamato
nella riga del reclamo e nel report per l'ente; (2) `rispostaReclamo(reclamo,
{monitoraggi, ricettori, volate}, oggi)` → `{titolo, righe, sezioni,
chiusura, firme, nonMisurati}` composto da `misureDelGiornoPerReclamo`,
`riferimentoSoglia`, `coincidenzaVolata` e lo stato di fatto; bottone nella
scheda del reclamo che stampa col foglio della pagina (stesse firme del
report), `documenti-dimostrazione`, prove in `run-kpi` (prima in
scratchpad), screenshot a 430 px. Poi leggere il giro del browser su
`7578e26a` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.
