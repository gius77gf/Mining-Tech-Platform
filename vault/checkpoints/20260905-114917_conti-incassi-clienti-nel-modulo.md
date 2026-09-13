# Checkpoint — 2026-09-05T11:49:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
033d0754 — Conti: il prospetto degli incassi e l'anagrafica clienti si compongono
nel modulo — e il banco di Conti aveva lo stesso buco di quello di Flotta

## Completato
`csvProspettoIncassi`, `csvProspettoClienti`, `METODI_INCASSO`/`nomeMetodo`,
`cellaNum` nel modulo di Conti; la pagina chiama; censimento aggiornato
(pagine 7 → 5, export 31 → 33). Banco `conti-documenti-che-escono` corretto
(applica per file), tre iniezioni riancorate, «6 rimessi davvero» verde.
Misure: run-kpi 2672/0; conti-documenti 81/81 + controprova 8 KO;
conti-frasi-da-uno 41/41; nomi-liberi 26/0; iniezioni 525/525; copertura
855/855 (fondo Conti 164); giro `node` sulla copia: 38 comandi a posto,
asserzioni 3.585. Documenti: 3.153 prove, run-kpi 2672.

## Stato roadmap
Voce Flotta/Conti aperta: restano quattro file di Conti (costi,
listino_prezzi, pesate_ddt, preventivi) e il libretto di Flotta.

## Prossimo passo atomico
Conti: `conti_costi_<d1>_<d2>.csv` (`btn-cos-export`: `riepilogoCosti(COS,
d1, d2)` → righe, righeSenzaData, righeSenzaImporto, righeImportoNonPositivo,
ognuna con la colonna `nel_periodo` a parole) e `conti_listino_prezzi.csv`
(`btn-lis-prezzi`: prezzo/densità/prezzo_t/prezzo_m3/iva con `numeroDichiarato`,
`densitaValida`, `prezzoPerTonnellata`, `prezzoPerMetroCubo`,
`ALIQUOTA_ORDINARIA`). Verificare prima quali helper vivono nel modulo
(`leggiVoce`, `etichettaGruppo`, `gruppoDiVoce`, `cosPeriodo` è della pagina:
si passano d1/d2). Le iniezioni 0 (`righeSenzaImporto`) e 3 (`numeroDichiarato
(p.prezzo) ?? ""`) vanno riancorate sul MODULO; censimento
`conti.prospettoCosti` e `conti.prezziConvertiti` → `fonte:` (soglie pagine
5 → 3, export 33 → 35). Alla prossima accensione della routine: canarino
prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
