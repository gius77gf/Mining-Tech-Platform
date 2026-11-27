# Checkpoint — 2026-09-21T09:59:24Z

## Tipo
test (nessun codice di prodotto toccato — solo copertura)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0830700f (docs(genesi): PIANO_3D.md riflette lo stato vero, verificato sul codice)

## Cosa è stato completato
Continuato il metodo di verifica dal vivo di questa sessione: cercato
altri bottoni di export/import di Genesi senza copertura, sullo stesso
schema che aveva trovato il buco su Ruota/Scala tratti.

- [x] **Trovato un secondo buco reale**: `btn-innesco-xml-in` (import
  del piano di innesco XML, round-trip con l'export IREDES-like) non
  aveva nessun banco (`grep -rl "btn-innesco-xml-in\|fileXmlIn"
  apps/deepwork-id/tests/browser/*.mjs` → zero file). Il commento nel
  codice racconta un difetto vero già trovato e corretto il 07/08 —
  l'innesco tornava sempre "Nonel" dopo un reimport, anche se il file
  esportato portava "elettronico" — ma verificato solo a mano allora,
  mai diventato un banco permanente.
- [x] **Scritto `apps/deepwork-id/tests/browser/genesi-innesco-xml-
  roundtrip.mjs`**: esporta con innesco elettronico, cambia l'innesco a
  mano PRIMA di reimportare (per non leggere per caso lo stato giusto),
  reimporta lo stesso file, pretende che l'innesco torni elettronico.
  Registrato in `tutti.mjs`.
- [x] **Verificato che sa fallire**: `--controprova` (toglie le due
  righe che leggono `<Initiation>`) fa cadere esattamente l'asserzione
  causale — l'innesco resta "nonel" invece di tornare "elettronico",
  riproducendo il difetto del 07/08 alla lettera.
- [x] **Riletto `docs/GENESI_ROADMAP_COMPETITOR.md` per intero**: già
  ben mantenuto (ultima correzione 12/09), nessuna riga scaduta trovata.
- [x] **Propagato** 453→455 esecuzioni, 206→207 file distinti, e
  4282→4283 asserzioni del giro `node` completo (segnalato
  direttamente da `giro-node.mjs` in un run precedente — «i documenti
  dichiarano un altro numero», corretto in `docs/DEVELOPMENT.md` e
  `docs/STATO_PRODOTTO.md`).

## Verifica prima del commit
- `node genesi-innesco-xml-roundtrip.mjs` → **6/0**.
- `node genesi-innesco-xml-roundtrip.mjs --controprova` → **6 ok, 1 KO**
  (l'asserzione causale, come atteso).
- `porte-banchi.mjs` → **3/0**, 182 banchi guardati.
- `numeri-nei-documenti.mjs` → **43/0**.
- `documenti-invecchiati.mjs` → **15/0**.
- `giro-node.mjs` completo rilanciato per confermare 4283 asserzioni
  coerenti; in corso/da verificare all'unità successiva.

## Stato roadmap
Nessun codice di prodotto toccato. Secondo buco di copertura reale
colmato in questa sessione con lo stesso metodo.

## Prossimi passi
- **Prossimo passo atomico**: verificare l'esito del `giro-node.mjs`
  lanciato in background, poi continuare a cercare bottoni di export/
  import Genesi senza banco (metodo: `grep -rl "<id-bottone>"
  apps/deepwork-id/tests/browser/*.mjs`) prima di aprire nuove ricerche
  documentali, dato il rendimento alto di questo filone in questa
  sessione (due difetti storici già corretti a mano ora hanno un banco
  permanente).
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
