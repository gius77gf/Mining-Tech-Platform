# Checkpoint — 2026-09-21T10:47:08Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7169086a (chore(vault): bilancio del blocco, giro-node pulito (41/41, 0 caduti, 4284 asserzioni))

## Cosa è stato completato
Ripreso il metodo "verifica dal vivo" dal checkpoint precedente
(`20260921-101414`), sul prossimo bersaglio indicato: la timeline dello
sparo (`#play`/`#track`/`[data-spd]`), zero copertura browser (verificato
con `grep -rl 'id="track"\|id="play"' apps/deepwork-id/tests/browser/*.mjs`
→ 0 risultati).

Letto il sorgente (`setSimT`/`setPlaying`/`trackT`, genesi.html
~2787-2827): a differenza dei due casi precedenti in questo blocco
(Ruota/Scala tratti, innesco XML), qui **non c'è un difetto storico da
riprodurre** — nessun commento che documenti un bug mai chiuso. Scritto
comunque un banco di copertura positiva (senza `DIFETTI`/`--controprova`,
scelta deliberata e dichiarata nell'intestazione del file: la regola "una
prova che non sa fallire non dimostra niente" vale per gli STRUMENTI di
misura, non impone un difetto finto su un banco di comportamento —
precedente già in uso in `interi-superfici.mjs`/`documenti-dimostrazione.mjs`).

Nuovo file: `apps/deepwork-id/tests/browser/genesi-timeline-play-scrub.mjs`
(13 asserzioni, 13/0). Copre: stato iniziale (fermo a 0, "pronto"); Play
avvia subito (sincrono) e il tempo avanza dopo; Pausa ferma il tempo dove
sta; scrub trascinando `#track` mette in pausa e porta il tempo alla
posizione proporzionale (misurato al centro e oltre il bordo destro, dove
`trackT` chiude a u=1 per `Math.min`); stato "fine" a fine corsa; Play da
"fine" fa ripartire da 0 invece di restare bloccato; il cambio di
velocità (`[data-spd]`) marca la selezione attiva e disattiva le altre.

Controllato anche il candidato gemello citato dal checkpoint precedente
("cambio qualità, cambio look"): **non è un controllo utente reale**.
`qchip`/`qlab` (riga 1009) non hanno `onclick` (verificato con `grep`,
zero risultati) — sono un'etichetta di sola lettura aggiornata
dall'auto-downgrade di `fpsTick`. `applyLook`/`setQuality` sono
raggiungibili solo da query-param `?look=`/`?q=` (dev-only) o dal bridge
di debug `window.__genesi`, mai da un bottone premibile dall'utente:
nessun banco da scrivere lì, non è una mancanza di copertura ma
l'assenza del bersaglio stesso.

Registrato in `tutti.mjs` (dopo le voci di `genesi-ruota-scala-tratti.mjs`).
Verificato `porte-banchi.mjs`: 3/0, 183 banchi con un server (183, non
184: questo banco è quello nuovo, gli altri 182 erano già censiti).

## Numeri propagati (misurati, non dedotti)
- `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
  `docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md`: banchi del
  browser 455 → **456**.
- `vault/ROADMAP_SETTIMANA.md`: file di banco distinti 207 → **208**.
- `docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`: asserzioni del giro
  `node` 4284 → **4285** (il banco nuovo è del BROWSER, non contribuisce
  a questo totale — dichiarato esplicitamente nel testo per non far
  credere il contrario). L'aumento di 1 non è attribuito a una causa
  inventata: è quello che `giro-node.mjs` stampa, misurato due volte
  (prima e dopo la correzione dei numeri nei documenti) con lo stesso
  risultato.

## Verifica prima del commit
- `node apps/deepwork-id/tests/browser/genesi-timeline-play-scrub.mjs`:
  13 passati, 0 falliti.
- `node apps/deepwork-id/tests/porte-banchi.mjs`: 3 passati, 0 falliti,
  183 banchi con un server.
- `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`: 43 passati, 0
  falliti, 456 banchi contati.
- `node apps/deepwork-id/tests/giro-node.mjs` (rilanciato DOPO la
  correzione dei documenti, non prima — la prima volta era caduto
  proprio su `numeri-nei-documenti.mjs` perché i documenti dicevano
  ancora 455/207): **41/41 comandi a posto, 0 caduti, 4285
  asserzioni**, "e i 2 documenti che lo dichiarano dicono lo stesso
  numero".

## Stato roadmap
Blocco proseguito. Mandato del fondatore invariato: solo Genesi, massimo
sforzo.

## Prossimi passi
- **Prossimo passo atomico**: col metodo "bottoni/funzioni senza banco"
  ormai esaurito su design 2D/export/timeline (tre aree consecutive
  controllate in questo blocco, l'ultima — qualità/look — risultata
  priva di un bersaglio reale), il prossimo passo atomico è tornare a
  `docs/GENESI_ROADMAP_COMPETITOR.md` e `docs/RICERCA_CONTINUA_GENESI.md`
  per un secondo passaggio più approfondito su un tema già aperto (non
  ancora esaurito quanto le aree 2D), oppure guardare la scena 3D
  (`buildSim`/`renderSim`) stessa per un difetto di RENDERING (non di
  interazione, già coperta ora) — es. i livelli/layer del pannello 3D
  (`lMuck`/`lFly`/`lXray`/`lQuote`/`lAudio`, `xrOp`), che non sono ancora
  stati controllati con questo metodo.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
