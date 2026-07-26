# Checkpoint — 2026-07-23T17:15:00Z

## Tipo
unit-complete (test — validità dei manifest PWA di tutte le superfici)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — run-manifest.mjs + package.json + ci.yml)

## Completato
Fallback #4 (test) a guardia della feature appena aggiunta: `run-manifest.mjs`
verifica che TUTTE le superfici installabili (core radice, Genesi, 6 verticali)
abbiano un manifest PWA JSON valido con i campi necessari — name, short_name,
start_url, display=standalone, theme_color e background_color esadecimali, almeno
un'icona con src data:. + un test che i 6 theme_color delle verticali sono distinti
(icone distinguibili sulla home). 9 test. Estrae il manifest col decode del data URI,
esattamente come fa il browser. Blocca in CI un edit che rompa un manifest.

## Verifica
9/9 verdi. Catena pura: helpers 43 + kpi 174 + pointcloud 18 + manifest 9 + demo 7 =
251 puri; con l'emulatore = 356 (ci.yml aggiornato 347→356). package.json test script
aggiornato.

## Prossimo passo atomico
Never-stop: rotazione fallback. La PWA delle verticali (manifest) è ora blindata da
test. Prossimo: altra iterazione / test / revisione, evitando churn.

## Blocchi
Nessuno. Gated: passo 3 drone (dato reale), #321 estetica.
