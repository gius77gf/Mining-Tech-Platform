# Checkpoint — 2026-07-22T04:00:00Z

## Tipo
unit-complete (Scudo — filtro Infortuni/Near-miss nel registro eventi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — filtro lista infortuni)

## Completato
Seconda voce dalla shortlist Explore: la lista del registro infortuni/near-miss
(`#inf-list`) era l'UNICA lista che cresce nel tempo senza un filtro (tutte le
altre app hanno i chip). Aggiunto un filtro per TIPO (Tutti / Infortuni /
Near-miss), riusando ESATTAMENTE il pattern già collaudato di `#scad-filtri`:
- `apps/scudo/index.html`: chip `#inf-filtri` (data-filtro), variabile
  `filtroInf`, handler `addEventListener("click")`, `.filter()` nel render
  (`INF.filter(x => filtroInf === "tutti" || x.tipo === filtroInf)`),
  colorazione del bordo attivo (`var(--app-accent)`), messaggio stato-vuoto
  adattato al filtro. I tipi ("infortunio"/"near-miss") sono già i valori del
  select di inserimento e i badge già distinti → nessun mapping nuovo.

Verifica: syntax CI OK; smoke Playwright — chip presenti con i data-filtro
corretti (tutti/infortunio/near-miss), nessun errore di pagina. Isolato alla
sola sezione, nessun tocco ai dati o ai KPI.

## Prossimo passo atomico
Chiusa la shortlist Explore ad alto valore (2 date-future + 1 filtro). Restano:
la nota minore Scudo `luogo` mezzo-cablato (da chiarire col fondatore se è
scelta voluta), altre seconde iterazioni UX su altre app, o i punti pesanti
Genesi (con il fondatore). Valutare anche una revisione (ciclo serale se siamo
in orario).

## Blocchi
#321 estetica Genesi: attende il fondatore. Branch unico #321 (include ora
anche i fix app verticali).
