# Checkpoint — 2026-09-05T11:23:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
925136cd — Flotta: il registro degli interventi e la lista della spesa nel modulo
— sei file su otto; e il banco applicava le iniezioni solo alla pagina

## Completato
`csvRegistroInterventi` e `csvListaDellaSpesa` nel modulo di Flotta; la pagina
chiama; censiti `flotta.interventi` e `flotta.listaSpesa`. ⛔ Trovato e
corretto nel banco `flotta-documenti-che-escono`: `applica` ignorava il file
dichiarato dalle iniezioni e girava solo sulla pagina — le cinque riancorate
oggi sul modulo non mordevano, e la controprova diceva «✔ distingue» con la
riga «rimessi davvero» rossa in mezzo (e l'ancora a sei spazi di `statoGiro`
mordeva il libretto nella pagina). Adesso 8 su 8 rimessi, 19 KO voluti.
Misure: run-kpi 2669/0; flotta-documenti 79/79; nomi-liberi 26/0;
iniezioni-fresche 525/525; copertura 846/846 (fondo Flotta 120); giro `node`
sulla copia: 38 comandi a posto, asserzioni 3.582. Documenti: 3.150 prove,
run-kpi 2669.
⚠️ Lezione della giornata sui banchi: quando si riancora un'iniezione su un
altro file, si guarda che il banco APPLICHI davvero per file — la riga «N
difetti rimessi davvero» va letta, non solo il «✔» in fondo.

## Stato roadmap
Voce Flotta aperta: restano situazione e libretto (Flotta) e sei file di
Conti.

## Prossimo passo atomico
`flotta_situazione.csv` (`btn-flotta-export`, ~riga 4620: `let csv =
"tipo;nome;stato;dettaglio\n"` con le righe dei mezzi, delle manutenzioni
con `statoOrdine` e dei ricambi con `statoScorta`): `csvSituazione(...)` nel
modulo; le iniezioni 1 (`statoOrdine(n).breve`) e 6 (`MEZ.slice()`) del
banco vanno riancorate sul MODULO — e ora che il banco applica per file, si
legge la riga «8 difetti rimessi davvero». Il censimento `flotta.prospetto`
passa da `pagina:` a `fonte:` (soglia pagine 8 → 7, export 30 → 31). Poi il
libretto (~riga 5070, il più lungo). Prima `numeri-nei-documenti` da solo,
poi il giro. Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
