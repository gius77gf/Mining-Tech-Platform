# Checkpoint — 2026-09-05T11:09:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e5ac77aa — Flotta: i giri macchina e lo scadenzario dei mezzi si compongono nel
modulo — quattro file su otto, e un nome libero che solo il banco vedeva

## Completato
`csvGiriMacchina`, `csvScadenzeDiLegge`, `mezziSenzaScadenze` nel modulo di
Flotta; la pagina chiama; censite `flotta.giri` e `flotta.scadenzeMezzi`;
iniezione di `statoGiro` riancorata. ⚠️ Trovato dal banco e non da run-kpi:
il modulo non importava `conta` (il giro con anomalie non nominate esiste
solo nella fixture del banco). Misure: run-kpi 2667/0; flotta-documenti
79/79 + controprova; libretto-vuoti verde; nomi-liberi 26/0; iniezioni
525/525; copertura 842/842 (fondo Flotta 116); giro `node` sulla copia: 38
comandi a posto, asserzioni 3.580. Documenti: 3.148 prove, run-kpi 2667.

## Stato roadmap
Voce Flotta aperta: restano quattro file nella pagina (registro-interventi,
situazione, libretto, lista-della-spesa) e sei di Conti.

## Prossimo passo atomico
`flotta-registro-interventi.csv` (`btn-int-csv`, ~riga 4268: le righe da
`INT` con 13 colonne — data, titolo, mezzo, ricambio, costo, note, …,
chi_ha_lavorato — celle già dalle funzioni) e `flotta-lista-della-spesa.csv`
(`btn-spesa-csv`?, ~riga 5280: righe da `da` = proposta scorte, più le
righe di avviso sui consumi stimati/senza prezzo). Stessa forma: `csvX` nel
modulo con la costante dell'intestazione, la pagina chiama, prova in run-kpi,
riga nel censimento con `fonte:`, iniezioni riancorate (una cita
`numeroDichiarato(w.costo) == null ? "" : …` — vedi
`flotta-documenti-che-escono.mjs` «3 · lo zero sommabile»). Prima
`numeri-nei-documenti` da solo, poi il giro. Alla prossima accensione della
routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
