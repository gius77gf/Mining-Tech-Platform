# Checkpoint — 2026-07-21T20:15:00Z

## Tipo
unit-complete (UX — Conti, filtro gare per stato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — Conti filtro gare per stato)

## Completato
Seconda iterazione su Conti (fallback #1: filtri/ordinamenti). La pagina Gare
ora ha un filtro per stato, come le fatture:
- `index.html`: riga bottoni "Tutte / Aperte / Vinte / Perse" (`data-gfiltro`,
  attributo distinto da `data-filtro` delle fatture per non collidere col
  click handler globale). Nuovo `filtroGar` + `garMatch(g)`; il render filtra
  `GAR`, evidenzia il bottone attivo (bordo accent) e mostra stato vuoto
  contestuale ("Nessuna gara in questo stato." quando il filtro non è "tutte").
- Nessun nuovo test unitario: la logica è un filtro inline di una riga; niente
  cambi al conteggio CI (resta 305). Verifica affidata a Playwright.

Verifica: syntax modulo OK; Playwright — Tutte 4, Vinte 1, Perse 1, ritorno a
Tutte 4, bordo attivo su selezione, nessun pageerror. Screenshot catturato.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: valutare stesso
pattern filtro su altre liste che ne sono prive (es. registri/anagrafiche di
altre app), oppure test emulatore casi limite, oppure revisione di main.

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile: fondatore. SdI /
telematics live / ciclo chiuso / Genesi motore / soglie esatte: gated.
