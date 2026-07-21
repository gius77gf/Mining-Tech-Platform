# Checkpoint — 2026-07-21T16:30:00Z

## Tipo
unit-complete (fix condivisi da review shared — 2/4)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — numIt migliaia multiple + csvCell spazi iniziali)

## Contesto: review del codice CONDIVISO (dw-shell + SDK)
Isolamento multi-tenant VERIFICATO SOLIDO: `orgCollection` sigilla sempre il
percorso sull'org corrente e non può sfuggire nel sottoalbero di un'altra org
(anche un `name` con `/` scende solo più in profondità nella stessa org).
Trovati 4 bug nei parser CSV/numeri (non coperti da run-helpers) + 1 nota SDK
minore. Confermati tutti empiricamente. Questo commit chiude 2 dei 4.

## Completato (Unit A: numIt + csvCell)
- `numIt` (dw-shell.js): i numeri con separatore delle migliaia MULTIPLO davano
  NaN → riga persa in import. `1,234,567` (inglese) e `1.234.567` (italiano)
  → NaN. Ora: riscritta la logica (conta virgole/punti; se entrambi presenti
  l'ultimo è decimale; virgole multiple o punti multipli senza l'altro =
  migliaia; una sola virgola = decimale; punto isolato resta decimale). Tutti i
  casi documentati invariati (18.300,50 / 18,300.50 / 19.4 / 1234,5 / negativi).
- `csvCell` (dw-shell.js): la guardia anti CSV-injection scattava solo se
  `= + - @` era il PRIMO carattere; una formula preceduta da TAB/CR/spazio
  ("\t=cmd") passava (OWASP: TAB e CR sono inneschi). Ora la regex neutralizza
  la formula anche dopo spazi/tab/ritorni a capo iniziali.
- `run-helpers.mjs`: +11 test (numIt non era testato qui: migliaia it/en
  multiple, misti, decimale singolo, punto isolato, negativo, vuoto/testo=NaN;
  csvCell TAB/CR/spazio+formula). Helper 22→33; CI 281→292.
Verifica: helper 33/0, KPI 161/0 (nessuna regressione sui parser delle app),
demo 7/0.

## Rimane dalla review shared (prossime unità)
- Unit B: `parseCsvLine` — rilevamento delimitatore ingannato da `;` dentro un
  campo tra virgolette in un CSV a virgole; `.trim()` toglie gli spazi anche ai
  campi quotati. Da correggere con cautela (parser molto usato).
- Unit C (minore): `switchOrg` non azzera `this.entitlement` prima del reload
  (flag di fatturazione può restare stantìo su errore di rete; isolamento OK).

## REGOLA FONDATORE: NON FERMARSI MAI. Proseguo a oltranza.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART; poi Unit B (parseCsvLine) con test di
regressione, poi Unit C.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie: gated, de-rischiati.
