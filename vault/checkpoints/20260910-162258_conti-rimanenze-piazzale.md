# Checkpoint — 2026-09-10T16:22:58Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
2703b687 — Conti: le rimanenze di piazzale per il commercialista

## Completato
`prospettoRimanenze` / `variazioneRimanenze` / `csvRimanenze` nel modulo di
Conti (l'ultimo inventario dei cumuli di Terra valorizzato A LISTINO, i
cumuli non valorizzabili FUORI con la ragione, la variazione solo fra
perimetri uguali, ogni frase dice che non è il valore fiscale); il riquadro
«Rimanenze di piazzale» nei Report con il CSV. run-kpi +9 (2801), banco
`conti-rimanenze.mjs` 34 ok, controprova 26/34; 265 esecuzioni / 112 file;
copertura 929/929 (fondo Conti 188). Docs: CONCORRENTI_CONTI riga 2 risposta.

## Stato roadmap
Voce `[x]` «LE RIMANENZE DI PIAZZALE PER IL COMMERCIALISTA (10/09)».

## Prossimo passo atomico
Riga 3 della stessa lista di CONCORRENTI_CONTI: «Export in un tracciato
contabile» (a metà: nove export CSV leggibili, nessun formato di scambio
per il gestionale del commercialista). ⚠️ Un tracciato di un gestionale
specifico (TeamSystem, Zucchetti) NON si scrive a memoria: sarebbe un
formato inventato con la faccia di uno vero. Quello che si può fare con
onestà è la **prima nota** delle vendite in forma standard e dichiarata
(una riga per fattura: data, numero, cliente, P.IVA, imponibile per
aliquota, IVA, totale, incasso e data — le colonne che ogni gestionale
sa importare con la mappatura), composta da una funzione pura
`csvPrimaNotaVendite(fatture, clienti, incassi, note, dal, al)` accanto a
`csvSituazioneFatture` (che è un prospetto di lettura, non un tracciato):
prima aprire `riepilogoIvaFattura` e `importiFattura` in `conti-data.js`
(il meccanismo che sa imponibile per aliquota), poi lo scratchpad, poi le
prove, il banco che apre il file (`__scaricati`), i pin, il giro sulla
COPIA, commit con -F, checkpoint, push. In alternativa, se la prima nota
sembra un formato inventato, la riga 5 «conservazione a norma» è una
decisione, non codice: si salta.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore.
