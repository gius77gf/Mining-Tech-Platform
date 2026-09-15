# Checkpoint — 2026-09-05T06:55:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
20f5921e — Campo: il piano di Genesi si legge con la mappa condivisa, con nomi esatti

## Completato
- `mappaColonne` ha l'opzione `esatto`; `mappaPianoCsv` di Campo le sta sopra
  e risponde come prima (import end-to-end del piano vero di Genesi rifatto:
  «id f1-1 · x 0 m · prof. 12 m · borr. 3 m · rit. 0 ms»).
- L'export per la fatturazione elettronica è stato MISURATO già fatto
  (`DatiDDT` per ogni pesata in `xmlFatturaPA`): nessun cantiere aperto.
- run-kpi +1 (2641/0); giro `node` sulla copia verde, 3.553 asserzioni;
  documenti 3.122 prove.

## Prossimo passo atomico
Correzione piccola all'import dalla pesa, trovata rileggendo il codice nuovo
(punto 5 della lista: revisione del codice nuovo): in `pesateDallaPesa` una
riga con il solo NETTO (lordo o tara mancanti) oggi entra fra `entrano` e la
pagina la ferma come «senza prezzo (manca la densità…)», che è la ragione
sbagliata. Il DDT di Conti si emette dai DUE pesi (`rigaPesata` calcola il
netto): la riga va fra le `scartate` con «lordo o tara mancanti» e il campo
`netto` di `entrano` sparisce. Prova in run-kpi: un file con solo «Netto»
→ scartata con quella ragione. Poi: la finestra della pesa mostra anche
QUANTE righe entrerebbero e quante no, prima di importare (oggi lo dice solo
l'esito dopo). Dopo questa, la rotazione riparte dal punto 4 della lista
(test aggiuntivi sulle suite emulatore): `cd apps/deepwork-id/tests && npm ci`
e il giro delle regole con `npx --yes firebase-tools@13 emulators:exec`
(comando in CLAUDE.md), per rimisurare 75/19/8/21 in questo contenitore.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
