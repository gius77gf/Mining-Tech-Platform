# Checkpoint — 2026-07-21T22:00:00Z

## Tipo
unit-complete (UX cross-app — messaggi d'import più utili)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — import: suggerimento colonne quando 0 righe valide)

## Completato
Quando un import CSV produce ZERO righe valide (file vuoto, oppure — per gli
import con validazione stretta su data/importo — colonne sbagliate), prima
compariva un inutile "0 aggiunte". Ora compare un messaggio che indica le
colonne attese, così un fondatore non tecnico capisce subito come sistemare il
file.

Aggiunto un guard `if (!righe.length) { ... colonne ...; return; }` a TUTTI gli
import "ad append" (10 handler su 6 app):
- Conti: gare, fatture
- Terra: fronti, rilievi
- Flotta: parco mezzi
- Sentinella: volate, adempimenti, sensori
- Scudo: infortuni, scadenze
- Campo: squadre

Nota di onestà: i parser permissivi (gare/squadre/fronti/sensori/mezzi
richiedono solo un nome non vuoto) accettano quasi ogni riga, quindi lì il
guard scatta soprattutto sui file VUOTI; sugli import con data/importo
obbligatori (fatture/volate/rilievi/infortuni/scadenze/adempimenti) scatta
anche con le colonne sbagliate. In entrambi i casi è un miglioramento e non
cambia nulla quando ci sono righe valide.

Verifica (Playwright): file vuoto su gare → "Nessuna riga valida: controlla le
colonne titolo;base;scadenza;stato" (lista 4→4); colonne errate su volate →
messaggio colonne volate (lista 2→2). Nessun errore. Syntax OK sui 6 moduli.
Logica UI inline: CI resta 313.

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART. Proseguire SENZA FERMARSI: altre rifiniture UX
o approfondimenti (i rimandati di alto valore restano gated).

## Blocchi
Passo 1 go-live (progetto Firebase) + decisioni di stile/prodotto: fondatore.
SdI / telematics live / ciclo chiuso / Genesi motore / soglie di legge: gated.
