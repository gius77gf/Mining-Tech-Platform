# Checkpoint — 2026-09-21T11:36:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
186aa1f3 (test(genesi): copertura browser per la modellazione 3D del fronte)

## Cosa è stato completato
Proseguito il metodo "verifica dal vivo" sul prossimo candidato del
checkpoint precedente: i quattro bottoni camera della scena 3D
(`[data-cam]`/`applyCamera`, genesi.html ~2830-2848), zero copertura
prima (né in DOM né funzionale).

**Trovato un difetto reale, misurando dal vivo con Playwright, non
deducendo dal codice**: la camera "Da terra 50 m" (`CAMS[0]`) chiede
`pos.y=1.7` con un bersaglio più alto — un angolo polare che supera
`ctrl.maxPolarAngle = Math.PI/2-0.02` (genesi.html:1623, la barriera
anti-sottoterra pensata per il trascinamento libero del mouse).
`applyCamera` chiama `ctrl.update()` su OGNI bottone senza distinguere
un preset esatto da un trascinamento, e OrbitControls corregge in
silenzio la posizione: misurato **y=5,5015** invece di 1,7 (verificato
col calcolo trigonometrico a mano: stessa distanza dal bersaglio,
50,078 m, angolo bloccato al massimo consentito — combacia alla
settima cifra). Le altre tre camere (drone/laterale/libera) NON
toccano quel limite e arrivano ESATTE alla loro formula — verificato,
non assunto, prima di scrivere la riga.

**Non ho corretto il codice**: quale delle tre strade possibili
(alzare il preset, bypassare la barriera solo per i preset, o
correggere solo l'etichetta del bottone) è una scelta di
comportamento/interazione, non un bug con una sola soluzione ovvia —
segue la regola del repository "candidati che richiedono una scelta di
prodotto vanno in docs/DECISIONI_WEEKEND.md, non implementati di
iniziativa". Aggiunta **decisione 31** in `docs/DECISIONI_WEEKEND.md`,
con la sua riga nella tabella "porta d'ingresso" (verificato che
`numeri-nei-documenti.mjs` la vede: "31 sezioni, 32 indicizzate").

Nuovo file: `apps/deepwork-id/tests/browser/genesi-camere-3d.mjs`
(12/0). Blinda il comportamento **come si presenta oggi**, comprese le
coordinate clampate di "Da terra" (commentate, con riferimento
esplicito alla decisione 31, così una scelta futura fa cadere quella
SOLA asserzione, per nome). Aggiunti al ponte di debug `camIdx`,
`camPos`, `camTarget` (stesso pattern delle unità precedenti).

Registrato in `tutti.mjs`. `porte-banchi.mjs`: 3/0, 185 banchi.

## Numeri propagati (misurati, non dedotti)
- Banchi del browser: 457 → **458** (4 documenti tracciati).
- File di banco distinti: 209 → **210** (`vault/ROADMAP_SETTIMANA.md`).
- `docs/DECISIONI_WEEKEND.md`: nuova sezione **31** + riga di tabella,
  verificate con `numeri-nei-documenti.mjs` (43/0).

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-camere-3d.mjs`: 12
  passati, 0 falliti.
- `node apps/deepwork-id/tests/porte-banchi.mjs`: 3/0, 185 banchi.
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`: 43/0, 458
  banchi contati.
- `node apps/deepwork-id/tests/giro-node.mjs`: da rilanciare come
  ultimo passo, sulla copia comprendente questo checkpoint, per il
  numero finale da propagare (le asserzioni del giro `node` NON sono
  toccate da questa unità: nessun modulo dati è cambiato, solo
  genesi.html e docs/vault — ma si rilancia comunque, per disciplina).

## Stato roadmap
Blocco proseguito. Mandato del fondatore invariato: solo Genesi, massimo
sforzo.

## Prossimi passi
- **Prossimo passo atomico**: con la scena 3D ora ampiamente coperta
  (timeline, modellazione del fronte, camere), il prossimo candidato
  del metodo "azioni utente senza banco" è l'interazione di selezione
  del singolo foro (`holeInfoShow`, click su un foro con la vista X-ray
  o Raggi-X attiva, righe ~2927-2946) — o, se quell'area risultasse
  già ben coperta, tornare a un secondo passaggio su
  `docs/GENESI_ROADMAP_COMPETITOR.md`/`docs/RICERCA_CONTINUA_GENESI.md`.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
