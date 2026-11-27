# Checkpoint — 2026-09-05T06:41:15Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b3a4ad9c — Conti: il file della pesa a ponte entra da solo — colonne per nome, unità confermata, DDT dalla stessa strada

## Completato
- `INDIZI_PESA`, `mappaPesaCsv`, `parsePesaCsv`, `pesateDallaPesa` in
  `apps/conti/conti-data.js`; bottone «Importa dalla pesa (CSV)» con la
  finestra di conferma (righe, colonne, unità suggerita con la ragione) e il
  DDT che nasce da `rigaPesata` + `numeroProssimoDdt`, con la provenienza.
- run-kpi +3 (2640/0); `conti-banca-colonne` 50/0 con la sezione 4 e la
  controprova sui chili non convertiti; scatto a 320 guardato (toast accorciato).
- Giro `node` sulla copia verde, 3.552 asserzioni; documenti 3.121 / 816.
  Ricerca Conti: delta della pesa scritto; roadmap: voce chiusa.

## Prossimo passo atomico
Punto 3 della lista, seconda cosa: «export per la fatturazione elettronica».
Misurare prima: `grep -n "xmlFatturaPA\|DatiDDT\|FatturaElettronica" apps/conti/conti-data.js
| head` — `xmlFatturaPA` esiste (lo importa la pagina). Domanda dal
meccanismo: la fattura nata da pesate (`fatturaDaPesate`) porta nel XML la
sezione `DatiDDT` con numero e data di OGNI DDT (la ricerca del 02/09 dice
che SdI la accetta ripetuta)? Se `grep -c "DatiDDT" conti-data.js` → 0, l'unità
è: `xmlFatturaPA` scrive un blocco `<DatiDDT>` per ogni pesata collegata
(`NumeroDDT`, `DataDDT`, `RiferimentoNumeroLinea`), prova in run-kpi sul
testo XML e nel banco `conti-documenti-che-escono` (che già apre l'XML: cercare
`xmlFatturaPA` lì). Se già c'è, passare a Campo: `mappaPianoCsv` sopra
`mappaColonne` (candidato dichiarato nella ricerca Flotta).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
