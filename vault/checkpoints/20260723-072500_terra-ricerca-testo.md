# Checkpoint — 2026-07-23T07:25:00Z

## Tipo
unit-complete (ricerca testo nelle liste, app 5/5: Terra) — SERIE COMPLETA

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/terra/index.html)

## Completato
Ricerca testuale nella lista **rilievi** di Terra: `#ril-cerca` filtra per
**titolo o tipo**, si compone con filtro stato + ordinamento. Stato vuoto dedicato.
Con questa, TUTTE le 6 verticali hanno ora la ricerca libera coerente (Scudo
l'aveva; aggiunte Conti, Flotta, Campo, Sentinella, Terra in questo ciclo).

## Verifica
Syntax OK. Screenshot (demo): "ortofoto" con filtro "Tutti" → 4 rilievi; assente →
stato vuoto; zero errori console. Spot-check visivo Terra: coerente con lo stile.

## Prossimo passo atomico
Serie ricerca chiusa. Prossima seconda iterazione (fallback #1): **validazioni form**
o **conferme sulle azioni distruttive** dove mancano, verificate con screenshot; in
alternativa test aggiuntivi (fallback #4). Iniziare da un censimento rapido delle
delete senza conferma nelle 6 app.

## Blocchi
Nessuno (pura UX).
