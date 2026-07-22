# Checkpoint — 2026-07-22T04:10:00Z

## Tipo
unit-complete (Scudo — campo "luogo" coerente nel registro eventi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — campo luogo Scudo)

## Completato
Chiusa la nota minore della revisione Explore: il form eventi salvava sempre
`luogo: ""`, ma export CSV, import (`parseInfortuniCsv`) e la lista hanno una
colonna `luogo` dedicata → gli eventi inseriti a mano erano gli UNICI a non
poter avere il luogo (incoerenza del modello dato, non scelta di design).
- `apps/scudo/index.html`: aggiunto input `#inf-luogo` (placeholder "Luogo"),
  `#inf-desc` ora è solo "Descrizione" (prima "Descrizione e luogo"); l'handler
  salva `luogo: $("inf-luogo").value.trim()` e pulisce il campo dopo l'invio.
  La lista già mostrava `x.luogo` e l'export/import lo gestivano → ora il
  round-trip del luogo è coerente per gli inserimenti manuali.

Verifica: syntax CI OK; smoke Playwright — input presente, placeholder
aggiornato, nessun errore di pagina.

## Prossimo passo atomico
Shortlist Explore esaurita. Prossimo: altre seconde iterazioni UX su app diverse
(stati vuoti/validazioni/ordinamenti dove mancano) oppure i punti pesanti Genesi
(con il fondatore). Verso le ~21:40 UTC: ciclo serale = prima la revisione.

## Blocchi
#321 estetica Genesi: attende il fondatore. Branch unico #321.
