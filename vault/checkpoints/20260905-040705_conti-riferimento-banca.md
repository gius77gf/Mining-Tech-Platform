# Checkpoint — 2026-09-05T04:07:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c1aced11 — Conti: il riferimento della banca (TRN/CRO) resta sul movimento e sull'incasso

## Completato
- `riferimentoInCausale` e `riferimentoMovimento` in `apps/conti/conti-data.js`:
  TRN/CRO dalla colonna del file (indizio `riferimento`, preso prima della
  descrizione) o dalla causale SOLO con l'etichetta davanti; `null` quando non c'è.
- `parseMovimentiCsv` lo scrive sul movimento, `abbinaMovimenti` lo tiene sulla
  riga; la riga della pagina lo mostra in monospazio con l'origine, l'incasso
  registrato lo conserva. Non entra nell'abbinamento, di proposito.
- Prove: run-kpi +3 (2618/0); banco `conti-banca-colonne` con un terzo file:
  36/0, controprova 16/36 (due difetti rimessi). Scatto a 320 guardato.
- Giro `node` sulla copia del committato: verde, 3.530 asserzioni. Documenti:
  3.099 prove, copertura 822/822. Roadmap: voce Conti chiusa (a+b) e riga
  d'indice tolta. Ricerca Conti aggiornata con la prova rilanciata.

## Stato roadmap
La voce Conti «file della banca» è chiusa. Le nove tappe della passata in
profondità sono tutte fatte; il ponte Flotta↔Conti è chiuso (12 su 56).

## Prossimo passo atomico
Aprire il cantiere Genesi↔Campo «progettato contro reale, foro per foro», che
il 05/09 notte è stato MISURATO come inesistente (vedi
`docs/RICERCA_CONTINUA_GENESI.md`, ultima sezione). Prima unità, la più
piccola che regge da sola: l'ID STABILE DEL FORO in Genesi — oggi i fori sono
identificati dalla posizione nell'array, quindi un foro tolto sposta tutti
gli altri e nessun confronto può reggere. Meccanismo: leggere come Genesi
costruisce/salva i fori (`apps/genesi/genesi.html`, la volata in
localStorage e il `.volata.json`), aggiungere `id` alla nascita del foro e
conservarlo nel file di scambio; prova di andata e ritorno (salva → riapri →
stessi id) in run-kpi se il codice è raggiungibile da node, altrimenti nel
banco del browser di Genesi. Solo dopo: le colonne di Campo e il confronto.

## Blocchi
Nessuno. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1, registro
esplosivi, TD24/IPA/split payment, registro dei terzi.
