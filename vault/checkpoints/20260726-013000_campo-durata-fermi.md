# Checkpoint — 2026-07-26T01:30:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — Campo differenziato: durata dei
fermi + Pareto "dove si perde tempo")

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
Campo ora risponde alla domanda che Deepwork non fa: **quanto tempo si perde
e per quale causa**.
1. Sull'attività in anomalia, accanto alla causale, il capocantiere indica i
   **minuti di fermo** (campo `fermoMin`, salvato subito).
2. Nuova sezione **«Dove si perde tempo (fermi di oggi)»**: Pareto per
   causale con barre proporzionali ai minuti, totale perso e causale
   peggiore in evidenza — la base della disponibilità di giornata.
3. Helper puro `paretoFermi(attivita)` (minuti sommati per causale, robusto
   a valori mancanti/non numerici/negativi → mai NaN) + **3 test** nella
   suite KPI (174→177; CI 361→364, etichetta aggiornata).
Verificato in browser: 45 min inseriti sull'anomalia → "Tempo perso oggi:
45 min — causale peggiore" con barra; zero errori JS. Screenshot salvato.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Differenziazione rimanenti (Conti/Sentinella/Terra hanno già funzioni
distintive dalla settimana scorsa: mora/estratto conto, distanza scalata,
proiezione fine anno): valutare per ciascuna UN incremento identitario o
passare alla seconda passata estetica core (topbar). Al risveglio del
fondatore: report completo del lavoro notturno per la sua revisione.
