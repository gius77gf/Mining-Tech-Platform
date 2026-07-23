# Checkpoint — 2026-07-23T11:45:00Z

## Tipo
unit-complete (CRUD mancante — modifica in-place, app 1: Conti fatture)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/conti/index.html)

## Completato
Fallback #1 (funzioni CRUD mancanti): le app potevano AGGIUNGERE ed ELIMINARE ma
non MODIFICARE un record — per correggere un refuso si doveva cancellare e rifare
(perdendo id/storico). Aggiunta la **modifica in-place** delle fatture in Conti,
riusando il form "Nuova fattura":
- Icona ✎ accanto alla ✕ sulle fatture non incassate; il tocco popola il form coi
  valori della fattura, il pulsante diventa "Salva modifica" e appare un avviso.
- Salvataggio via `db.aggiorna` (non aggiungi): stesso id, niente duplicati (il
  controllo numero-duplicato esclude la fattura in modifica).
- Ri-toccando la ✎ della stessa fattura si ANNULLA la modifica (form pulito, pulsante
  torna "Emetti"). Pura UX + aggiorna, org-isolato (nessun nuovo campo dati).

## Verifica
Syntax OK. Screenshot Playwright (demo): ✎ su 2026/031 → form popolato
(num/cliente/importo/scadenza), pulsante "Salva modifica"; cambio importo → salvato
IN PLACE (conteggio 5→5, nessun duplicato), lista mostra 20.000, pulsante torna
"Emetti"; zero errori console.

## Prossimo passo atomico
Estendere la modifica in-place alle altre entità dove manca e ha senso (never-stop,
una per unità): Flotta mezzi (nome/area), Scudo lavoratori, Terra fronti, Sentinella
sensori, Campo attività. Ognuna con verifica screenshot.

## Blocchi
Nessuno (pura UX + aggiorna). Gated: passo 3 drone (dato reale), #321 estetica.
