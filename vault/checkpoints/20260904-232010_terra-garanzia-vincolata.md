# Checkpoint — 2026-09-04T23:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
80dc105c

## Completato
- Terra, secondo candidato della ricerca sulla garanzia: `garanziaEuro` sul
  lotto, `garanziaVincolata` (vincolata / liberabile con chi / liberata,
  `senzaQuota` dichiarato), riga nel cartellone del divario e quota nella
  riga del lotto; dimostrazione con tre quote e tre lotti senza. run-kpi 2590
  → 2594; scatti 320/390; giro node sulla copia 38/0.
- Il banco `stati-non-misurati` ha 4 KO su 79 già presenti prima di stasera
  (rilanciato su 6eb001ee): scritto in roadmap come banco invecchiato, con
  l'indice aggiornato.
- Documenti: prove 3.075, asserzioni 3.503, copertura 813/813.

## Prossimo passo atomico
Terra, terzo candidato: la «relazione di fine lavori del lotto» come foglio
che esce — un lotto recuperato/collaudato stampa superficie, volume di
progetto e misurato (dai rilievi dei suoi fronti, «—» dove non misurato), le
cinque date (aperto, esaurito, recupero iniziato/finito, collaudo chiesto,
collaudato), la detrazione per recupero e la quota di garanzia. Si costruisce
come le due finestre di stampa già in pagina (`window.open` alle righe del
verbale del rilievo e della dichiarazione annuale) e come loro passa da una
funzione PURA del modulo che compone le righe (`relazioneLotto(lotto, rilievi,
oggi)`) provata in run-kpi, così il foglio dice gli stessi numeri della riga
del lotto. Bottone «Relazione» nella riga dei lotti recuperati/collaudati;
scatto del foglio; `terra-documenti-che-escono` se esiste (grep) da
estendere. Oppure, se si preferisce cambiare app: il banco
`stati-non-misurati` invecchiato (4 KO da rimisurare aprendo le schermate).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.
