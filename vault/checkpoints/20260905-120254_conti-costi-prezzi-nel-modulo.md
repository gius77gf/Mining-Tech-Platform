# Checkpoint — 2026-09-05T12:02:54Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
17ee6904 — Conti: il prospetto dei costi e il listino coi prezzi convertiti nel
modulo — e un prodotto senza prezzo non esce più «0 €/t»

## Completato
`csvProspettoCosti`, `csvPrezziConvertiti`, `ETICHETTA_GRUPPO`/`etichettaGruppo`/
`leggiVoce` nel modulo di Conti; la pagina chiama. ⛔ Difetto vero trovato
scrivendo la prova: `prezzoPerTonnellata`/`prezzoPerMetroCubo` convertivano
un prezzo non scritto in «0 €/t» (gratis) nel listino per il cliente —
corretto (`null`; lo zero scritto resta zero). Censimento: due entrate in
più verificate chiamando l'export; la prova statica «il prospetto dei prezzi
NON entra nel listino» legge la costante del modulo.
Misure: run-kpi 2674/0; conti-documenti 81/81 + controprova 6/6 rimessi;
conti-numeri-tranquilli verde; nomi-liberi 26/0; iniezioni 525/525;
copertura 862/862 (fondo Conti 171); giro `node` sulla copia: 38 comandi a
posto, asserzioni 3.587. Documenti: 3.155 prove, run-kpi 2674.

## Stato roadmap
Voce Flotta/Conti aperta: restano pesate_ddt e preventivi (Conti) e il
libretto (Flotta).

## Prossimo passo atomico
Conti: `conti_preventivi.csv` (`btn-or-export`: 15 colonne da `ORD` con
`ordStato`, `nomeClienteOrd`, righe con le due metà dello sconto e lo
scaglione; a capo `\n` e BOM) e `conti_pesate_ddt.csv` (`btn-pes-export`).
Verificare dove vivono `ordStato` e `nomeClienteOrd` (pagina → salgono o si
passano), e nel censimento `conti.prospettoDdt` → `fonte:`. Il banco
`conti-documenti-che-escono` apre tutt'e due i file (righe 410-411): le
iniezioni che li citano si riancorano sul MODULO e si legge «N difetti
rimessi davvero». Alla prossima accensione della routine: canarino prima di
tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
