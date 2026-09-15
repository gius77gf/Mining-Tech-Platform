# Checkpoint — 2026-09-05T18:23:06Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
04687b13 — Flotta: il budget dell'anno contro la spesa reale — la prima mancanza
confermata di B4 che passa a «c'è»

## Completato
Collezione `budget`, `budgetVsSpesa` / `descriviBudget` / `csvBudget` /
`ETICHETTA_STATO_BUDGET` in `apps/flotta/flotta-data.js`, blocco «Budget
dell'anno» nella schermata Costi con form, export e ✕ modale. run-kpi +5
(2722), `run-demo` sulla collezione, `documenti-dimostrazione` 111, siti di
export 31 → 32, copertura Flotta 135/135 (fondo 135). Pin: prove 3.203,
asserzioni 3.641, copertura 895/895. Giro `node` sulla copia: 40 comandi a
posto. Riga di `CONCORRENTI_FLOTTA` aggiornata (C'È), B4 flotta 5 → 4,
totale 44. Scatto guardato.

⚠️ Due cose imparate: (1) la frase della riga si tronca a due righe a
schermo — il verdetto («di questo passo il budget non basta») finiva dopo
il taglio; adesso sta in testa; (2) un giro lanciato mentre quello ucciso
stava ancora scrivendo nello stesso registro ha stampato «3 caduti» che non
esistevano — rilanciato su un registro nuovo, 40 a posto. Un registro
condiviso fra due giri è un registro che non dice di chi è il rosso.

## Stato roadmap
Voce `[x]` «FLOTTA — il budget dell'anno contro la spesa reale» e la
tabella di B4 aggiornata (flotta 4, totale 44) con la riga ⏱️ 45 → 44.

## Prossimo passo atomico
Un'altra mancanza confermata di B4 che il codice può colmare senza decisioni
del fondatore. Candidata: Sentinella, «Umidità, temperatura» + «Direzione
+ velocità vento» come UNA unità — le condizioni meteo della misura sui
`monitoraggi` (campi facoltativi: vento m/s, direzione, temperatura,
umidità), nella riga della lettura, nel CSV ambiente e nel report; e la
regola del mestiere da leggere PRIMA nel documento di ricerca
(`grep -n -i 'vento\|umidit\|temperatur' docs/RICERCA_CONTINUA_SENTINELLA.md docs/CONCORRENTI_SENTINELLA.md`):
una lettura di polveri senza vento non dice se il ricettore era sottovento.
Se la ricerca non ha la metà sul mondo, si lancia quella prima (WebSearch,
seconda mano dichiarata) e si costruisce dopo. Altrimenti: Flotta «Piani a
km / unità per mezzo» (grossa: tocca contatori, tagliandi, libretto).
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
