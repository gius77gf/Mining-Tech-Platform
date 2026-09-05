# Checkpoint — 2026-09-05T09:46:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
270a4250 — Sentinella: la scheda della volata scrive con quale regola il punto
giudica — terza iterazione, affiancata al verbale del rilievo di Terra

## Completato
Terza iterazione della scheda della volata (il metodo del fondatore: almeno
tre, per confronto affiancato). Sezione «Regola del giudizio», sempre
presente: limite che vale (`sogliaEfficace`), riferimento del preset con
l'avvertenza «da verificare» della pagina, esito di `statoMisura` col
rapporto, frequenza contro la banda (`frequenzaFuoriBanda`); senza soglia
niente esito, e la soglia assente sta in «che cosa manca». La pagina passa
i ricettori. Nessuna funzione riscritta.
Misure: run-kpi 2654/0 (+1 prova, tredici casi); banco 41 ok / 0 KO,
controprova 30 caduti su 41 con 7/7 iniezioni, la settima (copia debole che
ignora il ricettore) vista da sola: 1 KO — il KO giusto; sintassi 34/0; giro
`node` sulla copia: 38 comandi a posto, asserzioni 3.567. Documenti: 3.135
prove, run-kpi 2654.

## Stato roadmap
Voce Sentinella del 05/09 chiusa con le tre iterazioni scritte. Nessun
candidato aperto nelle ricerche di Sentinella, Terra, Conti, Genesi, Flotta,
Scudo, Campo (verificato coi comandi nel ciclo).

## Prossimo passo atomico
La domanda di oggi («che cosa esce da ogni app, e chi decide i suoi numeri?»)
applicata al foglio che Sentinella già consegnava PRIMA della scheda: il
`reportConformita` per punto. Confronto affiancato fra la scheda della volata
e la scheda del punto nel report (`schedaPunto` in `apps/sentinella/index.html`):
la scheda della volata scrive «Riferimento della soglia … da verificare» e
«Frequenza e banda»; il report per l'ARPA li scrive? Comando di partenza:
`grep -n "preset\|fuoriBanda\|frequenzaFuoriBanda" apps/sentinella/sentinella-data.js | sed -n 1,40p`
dentro `reportConformita` (riga ~3080) — il report ha già `fuoriBanda` (riga
3904 della pagina lo legge); verificare se il preset e la sua avvertenza
compaiono nel documento. Se sì, dirlo e passare al punto 4 della lista «se la
roadmap sembra finita» (suite emulatore). Se no: una riga per punto, dalla
stessa funzione. Alla prossima accensione della routine: canarino prima di
tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
