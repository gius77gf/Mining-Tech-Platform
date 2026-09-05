# Checkpoint — 2026-09-05T06:20:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7ba59757 — La mappa delle colonne per nome vive in shared — e la telemetria di Flotta si legge per nome

## Completato
- `mappaColonne`/`nomeColonna` in `shared/deepwork-id-client/dw-shell.js`.
- Flotta: telemetria per nome (`INDIZI_TELEMETRIA`, `mappaTelemetriaCsv`),
  esito con le colonne riconosciute; Conti `mappaMovimentiCsv` rifatta sopra
  la funzione condivisa, risposte invariate.
- run-kpi +3 (2637/0), `import-righe-perse` con la frase sulla telemetria;
  giro `node` sulla copia verde, 3.549 asserzioni. Documenti 3.118 / 812 /
  228. Ricerca Flotta (c) ✅; roadmap voce chiusa.

Nel ciclo delle 03:47Z sono usciti sette commit di prodotto: Conti (b)
TRN/CRO; GENESI↔CAMPO in quattro pezzi (id stabile, Campo col difetto del
ponte fila_m/borraggio_prog_m/ritardo_ms, accoppiamento, fori salvati);
il ponte P6 Sentinella→Campo; la mappa delle colonne in shared.

## Prossimo passo atomico
Riprendere la rotazione dal punto 3 della lista del ciclo («le tre cose
indietro rispetto ai concorrenti che il codice può colmare»): l'integrazione
con la pesa. Meccanismo, non nome: Conti ha già `parsePesateCsv` e
`pesiPesata`; misurare con `grep -n "parsePesateCsv\|INDIZI_PESATE\|mappaPesate"
apps/conti/conti-data.js` se il file della pesa si legge per nome o per
posizione — se per posizione, è la stessa unità di oggi applicata alla pesa
(`mappaColonne` con gli indizi dei software di pesatura: targa, lordo, tara,
netto, materiale, cliente, data/ora), con la prova sull'intestazione vera di
almeno un formato citato in `docs/RICERCA_CONTINUA_CONTI.md` (marcato di
seconda mano). Se già per nome, passare a Campo: `mappaPianoCsv` sopra
`mappaColonne` tenendo `mancanti`/facoltative (candidato dichiarato nella
ricerca Flotta), con la prova derivata dal sorgente di Genesi già esistente.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
