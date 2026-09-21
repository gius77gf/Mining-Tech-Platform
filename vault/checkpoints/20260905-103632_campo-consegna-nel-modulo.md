# Checkpoint — 2026-09-05T10:36:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0008d7b2 — Campo: la consegna di turno si compone nel modulo — dieci sezioni
provate anche con node, «registro non letto» distinto da «registro vuoto»

## Completato
`testoConsegnaTurno(d, {avviso, dmy})` e `fraseNonRiconosciute(pf, html,
avvolgi)` nel modulo di Campo; la pagina chiama e passa la riga dei dati di
esempio. run-kpi 2663/0 (+3); banco `campo-foglio-turno` 44/44 in tutt'e tre
le passate senza riancorare iniezioni; iniezioni-fresche 525/525; sintassi
34/0; nomi-liberi 26/0; copertura 833/833 (fondo Campo 134); giro `node`
sulla copia: 38 comandi a posto, asserzioni 3.576. Documenti: 3.144 prove,
run-kpi 2663.

## Stato roadmap
Voce Campo del 05/09 aggiunta e chiusa. Con Scudo e Campo fatti, le uscite
composte nella pagina restano da censire in Flotta, Conti, Terra e nel core.

## Prossimo passo atomico
Stessa domanda su **Flotta** e **Conti** (Terra ha già i fogli nel modulo:
`relazioneLotto`, `fogliaVerbale` compone in pagina ma dal verbale del
modulo — da verificare). Comando:
`for a in flotta conti; do grep -n "window.open\|\.print()\|download *=" apps/$a/index.html; done`
e per ogni uscita leggere le 30 righe prima: se il testo o le righe sono
composte nella pagina (un `let csv =` o un `txt +=`), salgono nel modulo con
prova in run-kpi, riancorando le iniezioni dei banchi
(`flotta-documenti-che-escono.mjs`, `conti-*.mjs`) — MAI citando una stringa
preceduta da «NOME = ». Alla prossima accensione della routine: canarino
prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
