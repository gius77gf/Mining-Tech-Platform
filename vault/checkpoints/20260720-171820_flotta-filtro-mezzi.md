# Checkpoint — 2026-07-20T17:18:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
9aa57f3

## Completato
Punto 1 (seconde iterazioni): Flotta era l'UNICA app senza filtro sulla
lista principale. Aggiunto filtro a chip sul parco mezzi per stato
(Tutti/Operativi/In verifica/Fermi) con evidenziazione chip attivo +
stato vuoto per categoria, stesso pattern delle altre 5 app. Syntax OK;
Playwright: tutti=6 → operativi=4 (evidenziato) → fermi=1. FLOTTA FILTER OK.

## Stato roadmap
Ora TUTTE e 6 le app hanno un filtro a chip sulla lista principale
(parità raggiunta). UX trasversale ancora più uniforme.

## Prossimo passo atomico
Merge PR flotta-filtro-mezzi (dopo CI verde), riparti branch da main.
Prossimo (punto 1): cercare altri gap di parità/UX. Candidati: (a) Flotta
manutenzioni (man-list) e costi (cos-list) non hanno filtro — valutare un
filtro urgenza sulle manutenzioni (scadute/entro30/oltre); (b) verificare
se tutte le liste secondarie con più stati beneficerebbero di un filtro;
(c) ricerca live su liste lunghe dove manca (solo Scudo pers ha la
ricerca testo — valutare se serve altrove). Scegliere UNA cosa piccola,
verificare con Playwright, commit+checkpoint+PR. Poi punto 4 (test) o 5
(revisione). Continuare fino a esaurimento crediti.

## Blocchi
Nessuno. Genesi funzionale e voci gated attendono il fondatore
(docs/DECISIONI_WEEKEND.md).
