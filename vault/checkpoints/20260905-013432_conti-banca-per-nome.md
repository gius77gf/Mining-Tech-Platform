# Checkpoint — 2026-09-05T01:34:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
939fb127 — Conti: il file della banca si legge per NOME di colonna, non per posizione

## Completato
- `mappaMovimentiCsv(intestazione)` in `apps/conti/conti-data.js`: riconosce
  data, valuta, descrizione, importo, entrate/uscite, dare/avere dal NOME
  della colonna (`INDIZI_ESTRATTO`, confronto per inizio di parola) e mette
  da parte di proposito «Saldo progressivo» e «Causale ABI».
- `parseMovimentiCsv` usa la mappa quando c'è l'intestazione (`perNome`),
  resta posizionale senza. Difetto misurato prima: un bonifico da 12.300,00 €
  letto come −45.210,77 (il saldo preso per importo), non abbinato a nessuna
  fattura, senza nessun errore.
- Pagina: l'esito del caricamento scrive «Colonne riconosciute: …» e
  «lasciate fuori di proposito: …».
- Prove: +5 in run-kpi (2615/0). Banco nuovo
  `tests/browser/conti-banca-colonne.mjs` (due CSV veri, layout
  entrate/uscite/saldo/ABI e dare/avere): 24/0, controprova 8/24 cadute.
  Registrato in `tutti.mjs`: 245 esecuzioni da 102 banchi.
- Giro `node` sulla copia del committato: tutto verde, 3.527 asserzioni
  (documenti aggiornati: 3.096 prove, copertura 820/820).
- `docs/RICERCA_CONTINUA_CONTI.md`: voce (a) chiusa; (b) TRN/CRO aperta.

## Stato roadmap
Voce Conti «file della banca per nome»: (a) ✅, (b) TRN/CRO tenuto sul
movimento — aperta, costo basso.

## Prossimo passo atomico
Conti (b): tenere TRN/CRO sul movimento. Meccanismo: `mappaMovimentiCsv`
aggiunge un indizio `riferimento` (trn, cro, «riferimento», «id operazione»);
`parseMovimentiCsv` lo copia nel movimento come `riferimento`; la riga del
movimento nella pagina lo mostra in `.meta` se c'è (mai «—» tranquillo: se
non c'è non si scrive niente); l'abbinamento resta invariato. Prova in
run-kpi: un CSV con colonna «TRN» → `movimenti[0].riferimento` uguale al
valore; senza colonna → `undefined`. Aggiornare il banco
`conti-banca-colonne` con un terzo CSV che porta TRN e pretendere che la
riga lo mostri.

## Blocchi
Nessuno. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1, registro
esplosivi, TD24/IPA/split payment, registro dei terzi.
