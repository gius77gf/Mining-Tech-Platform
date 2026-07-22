# Checkpoint — 2026-07-22T04:25:00Z

## Tipo
unit-complete (Test — invariante del segno di giorniTra a protezione delle guardie data-futura)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — test giorniTra futuro/passato)

## Completato
Le guardie data-futura appena aggiunte a Scudo e Sentinella si basano
sull'invariante `giorniTra(data) > 0 ⇔ data nel futuro`. La suite testava
giorniTra solo per oggi/+5gg (fix off-by-one), NON il SEGNO futuro/passato.
Aggiunto un test che blinda proprio quell'invariante:
- `apps/deepwork-id/tests/run-kpi.mjs`: domani/+30gg → >0 (rifiutati);
  oggi/ieri → non >0 (accettati); ieri → <0 (passato). Così una futura
  modifica alla convenzione di segno di giorniTra farebbe fallire la CI
  invece di rompere silenziosamente le guardie.
- `.github/workflows/ci.yml`: etichetta del job aggiornata 328 → 329.

Verifica: `node run-kpi.mjs` → 174 passati, 0 falliti (era 173). Nessuna
asserzione di conteggio totale nella CI (solo etichetta), quindi +1 test non
rompe nulla.

## Prossimo passo atomico
Ricerca in background sulla fattibilità onesta della frammentazione-da-foto in
browser (serve la decisione del fondatore sul punto Genesi #4) → alla fine,
sintesi in doc. Altrimenti: altri test/confini o revisione. Verso ~21:40 UTC:
ciclo serale = prima la revisione.

## Blocchi
#321 estetica Genesi: attende il fondatore. Punti pesanti Genesi + semantica
date Conti + isolamento core: gated (fondatore). Branch unico #321.
