# Checkpoint — Genesi: il dito nelle finestre, nella tabella dei fori e sopra la scena 3D

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): il dito nelle finestre…»).
Prima: `d9a902e5` (canarino del ciclo delle 06:45) e `5ed4d501` (la pianta in
px di schermo), confermato dal giro `node` (47 comandi, 4531 asserzioni) e
dal giro completo dei 55 banchi di Genesi su una copia del committato (55 su
55 a uscita 0).

## Misurato prima di toccare (320 e 430 px)
- Finestre (7) e scena 3D: 35 comandi su 74 sotto i 44 px.
- Pannello dei parametri della scena 3D: 22 su 22.
- Scheda del foro 9 su 9, tabella dei fori 53, opzioni dei livelli 4 su 9.
- Nessun comando al bordo.
- In più, visti negli scatti e poi contati: 5 campi su 54 bianchi come quelli
  del browser (pannello dei parametri); la tabella dei fori scorreva di lato
  fra 381 e 414 px di schermo (26 px a 390).

## Che cosa è stato fatto (solo `apps/genesi/genesi.html`, solo CSS)
- `.btn.sm`, `#play`, la ✕ dell'approfondimento, i campi delle finestre: 44.
- Pannello dei parametri: 44 sotto i 900 px o con puntatore grosso (sul
  computer resta fitto: dichiarato nel foglio, nel banco e in roadmap).
- `.row input[type=text]` e `#meas-in` vestiti come gli altri campi.
- Scheda del foro e tabella dei fori da 40 a 44; colonne strette da 40-42 a
  44; soglia della tabella compatta da 380 a 429 px.
- Opzioni dei livelli (`.dl-f`) da 38 a 44.

## Prove
- `genesi-colonna-progetto.mjs`: da 26 a 71 controlli; controprova 22
  iniezioni su 22, 53 controlli caduti (lo scorrimento di lato solo a 390 e
  412). Sull'albero vero, stato finale.
- `genesi-foro-per-foro.mjs`: due iniezioni e un'asserzione aggiornate alle
  misure nuove.
- I 55 banchi `genesi-*.mjs` sulla COPIA: 55 su 55 a uscita 0. ⚠️ La copia non
  aveva l'ultima aggiunta (le opzioni dei livelli a 44 e i sei controlli in
  più del banco), provata sull'albero vero. Il giro completo dei banchi sul
  committato parte dopo il push.
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4531
  asserzioni (nessun numero tracciato è cambiato: l'unità è CSS e banchi).
- Scatti guardati: scena 3D a 320 e 1280, pannello dei parametri prima e
  dopo, tabella a 390, finestra «legge di sito» a 320.

## Ricerca arrivata in questo blocco
`docs/RICERCA_CONTINUA_GENESI.md`, sezione del 27/11: ingrandire e spostare
una pianta col dito — solo il mondo, quasi tutto di seconda mano (letti per
intero tre testi). Undici domande per chi ha il codice. NIENTE è entrato in
roadmap sulla sua parola.

## Prossimo passo atomico
1. Leggere l'esito del giro dei 55 banchi di Genesi sul committato
   (scratchpad `e7/dopo/esiti.txt`); se un banco cade, correggere a parte.
2. Poi **l'ingrandimento della pianta** (voce aperta «la pianta non ha
   l'ingrandimento»), partendo dal MECCANISMO, non dalla ricerca:
   a. leggere `d2Down`/`d2Move`/`d2Up` e `d2EvtToCanvas` in
      `apps/genesi/genesi.html` e rispondere alle domande 1-4 della ricerca
      (quali gesti a un dito esistono, che cosa succede col secondo dito,
      `pointercancel`);
   b. in SCRATCHPAD: una vista `{zoom, panX, panY}` applicata nella
      trasformazione di `drawDesign2D` (dove oggi c'è `kT`) e inversa in
      `d2EvtToCanvas`/`D2._m` — funzioni pure nel modulo, provate prima;
   c. gesti: pizzico (due puntatori) = ingrandisce attorno al punto fra le
      dita; due dita che si muovono insieme = spostano; un dito resta com'è
      (scegli / crea / trascina). Bottoni + − e «adatta» sempre visibili
      (alternativa a un puntatore solo);
   d. ⚠️ il secondo dito che arriva dopo che il primo ha già creato un foro:
      va annullata la creazione (misurare prima se succede);
   e. banco col dito (`page.touchscreen` non fa il pizzico: servono eventi
      di puntatore sintetici via CDP `Input.dispatchTouchEvent`).
   Se una scelta è di prodotto (per esempio: un dito sposta la vista quando
   si è ingranditi?) va in `docs/DECISIONI_WEEKEND.md`, non decisa da me.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
