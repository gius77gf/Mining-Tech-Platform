# Checkpoint — 2026-07-23T16:45:00Z

## Tipo
unit-complete (robustezza — la modifica in-place si annulla cambiando pagina, 6 app)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — conti/flotta/sentinella/terra/scudo/campo index.html)

## Completato
Chiuso un caso limite di integrità dati sulla modifica in-place aggiunta prima: se
l'utente iniziava a modificare un record (pulsante "Salva modifica", form popolato) e
poi cambiava pagina senza salvare, lo stato di modifica restava; tornando e compilando
il form per AGGIUNGERE un nuovo record avrebbe invece **sovrascritto** quello vecchio.
Ora **cambiare pagina annulla la modifica**: il form torna pulito e il pulsante torna
alla sua etichetta di default ("Emetti"/"Aggiungi"/"Pianifica"). Comportamento standard,
guardato da `if(editX)` (non tocca un nuovo inserimento in corso). Applicato a tutte e
6 le app verticali (fatture, mezzi, sensori, fronti, lavoratori, attività).

## Verifica
Syntax OK (6 app). Screenshot Playwright (Conti, demo): modifica fattura 2026/031
(pulsante "Salva modifica") → cambio pagina → ritorno → form pulito e pulsante
"Emetti"; zero errori console.

## Prossimo passo atomico
Never-stop: rotazione fallback. La modifica in-place è ora robusta anche alla
navigazione. Prossimo: altra seconda iterazione / test / revisione, evitando churn.

## Blocchi
Nessuno (pura UX). Gated: passo 3 drone (dato reale), #321 estetica.
