# Checkpoint — 2026-09-05T08:34:45Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
22a76624 — Sentinella: il report dichiara la sua portata, e per quale adempimento è redatto

## Completato
- (b) `PORTATA_REPORT` nel report; (d) `intestazioneOrigineReport` sul
  documento quando parte da un adempimento (la data di trasmissione resta un
  candidato a sé). run-kpi +2 (2648/0); banchi report 24/0 e adempimento
  35/0; classi dipinte; giro `node` sulla copia verde, 3.560 asserzioni;
  documenti 3.129 / 821; fondo sentinella 152.

## Prossimo passo atomico
Candidato (c): le azioni correttive accanto ai superamenti del report, lette
da Scudo. Meccanismo: la pagina legge già le azioni col ponte (`ponteScudo()`
→ `AZI`, e `ponteKO` quando Scudo non risponde); `reportConformita` non le
riceve. Unità: passare `azioni` (o `null` = non leggibile) a
`reportConformita`, che per ogni superamento del periodo cerca con
`azioniDiOrigine(azioni, ORIGINE_SUPERAMENTO, puntoId)` (stessa chiave di
`bozzaAzioneSuperamento`: origineId = id del punto, origineVoce = data) e
scrive nel punto `risposta: {stato: "aperta"|"in corso"|"chiusa"|"nessuna"|
"non leggibile", n}`; la scheda del punto nel report la stampa con le parole
(«azione correttiva chiusa il …», «nessuna azione correttiva registrata»,
«le azioni non si leggono da Scudo»). Prove in run-kpi con azioni finte;
banco `sentinella-report-dichiarazioni` (la frase per il punto in
superamento della dimostrazione, V2). Leggere prima `statoPonte` in
`shared/dw-ponti.js`: è la funzione che già decide lo stato di una risposta.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi, «il report si segna come trasmesso?».
