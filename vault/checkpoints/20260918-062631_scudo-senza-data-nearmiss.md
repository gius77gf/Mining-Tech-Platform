# Checkpoint — 2026-09-18T06:26:31Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1259e8f5

## Cosa è stato completato
Quarto difetto confermato corretto in questo blocco (dopo Genesi, Flotta,
sicurezza Deepwork ID): Scudo, entrambi i difetti del quarto giro di
deep-pass (agente a76e56f7569610db8) in un'unica unità.
1. `abilitazioneLavoratore`/`pillReq` gestivano solo 3 dei 4 stati che
   `statoScadenzaHSE` sa dire — mancava "senza data": un corso con la
   scadenza illeggibile spariva da bloccanti/attenzioni e la pastiglia lo
   disegnava come "in ordine" (verde), l'assenza di un dato letta come
   favorevole (decisione 17 del fondatore). Aggiunto il ramo mancante in
   entrambi i posti, sullo stesso schema già usato per i DPI.
2. `csvRegistroInfortuni` non esportava categoria/gravitaPotenziale/
   anonimato del near-miss — persi su export→reimport. Undicesima/
   dodicesima/tredicesima colonna in coda, scrittore e lettore insieme,
   con lo stesso principio già usato per "gravita" (un valore fuori
   vocabolario resta `null`, non scivola sul primo della lista).

Due nuovi test con controprova in `run-kpi.mjs` (KPI 3129→3131),
intestazione dichiarata aggiornata in `dw-shell.js`, ancora dell'iniezione
ri-aggiornata in `scudo-documenti.mjs` (quarta volta che quel punto
d'ancoraggio si muove perché il codice migliora). Giro isolato: 41/41,
4124 asserzioni.

Con questo si chiude l'intero backlog di difetti confermati dal checkpoint
20260918-061236, tranne Conti (in corso, vedi sotto).

## Stato roadmap — Conti (in lavorazione, non ancora committato)
**Difetto 1/2 (SdI-come-non-emessa)**: GIÀ CORRETTO e verificato nel
working tree, non ancora isolato/committato. `kpiFrom`/`agingIncassi`/
`fattureOltre90`/`esposizioneClienti` ora escludono le fatture con
`statoSdi(f, oggi).nonEmessa` (stessa guardia già presente in
`sollecitabile`/`testoSollecito`/`estrattoContoCliente`);
`avvisoFidoPesata`/`concentrazionePortafoglio` ereditano la correzione
perché consumano `esposizioneClienti` senza ricalcolare. Nuovo test con
controprova in `run-kpi.mjs` (KPI 3131→3132), verificato nei due versi
(rimettendo le quattro guardie il test cade con "atteso 1000, ottenuto
3000"; ripristinato byte-identico).

**Difetto 2/2 (`rigaPesata` senza scaglioni) — INVESTIGATO E RESPINTO
COME FALSO POSITIVO, non va corretto.** L'agente (a8b791e876bd4d072) ha
segnalato che `rigaPesata` non applica mai gli scaglioni di quantità, a
differenza di `rigaPreventivo`, definendolo un difetto ("il commento del
modulo dichiara che entrambe fanno parte della stessa catena
scaglioni/sconto/ordine, ma solo una lo fa davvero"). Leggendo il codice
sorgente, l'asimmetria è VERA ma la conclusione è FALSA: subito sopra
`rigaPreventivo` (`apps/conti/conti-data.js`, circa righe 5495-5503) c'è
un commento esplicito e ragionato che dichiara perché gli scaglioni
vivono **di proposito solo** al livello dell'offerta/ordine (sulla
quantità NEGOZIATA), non sul singolo DDT: *"Sceglierlo sulla portata di
un autocarro vorrebbe dire far pagare il prezzo del privato — 28 t alla
volta — a chi ha comprato 5.000 t per un cantiere: esattamente il
difetto che questa funzione esiste per togliere."* Un secondo blocco
sopra `ddtDaAgganciare`/`prezzoDaOrdine` (circa righe 5645-5667) rinforza
la stessa architettura: un DDT agganciato a un ordine eredita il prezzo
**pattuito** dell'ordine (dove gli scaglioni sono già stati applicati in
sede di offerta), mentre un DDT senza ordine vende correttamente a
listino pieno per quel singolo camion. È esattamente la famiglia di
difetto che CLAUDE.md chiama *"una frase letteralmente vera con un
verdetto falso"*: l'agente ha trovato un'asimmetria reale (`rigaPesata`
non chiama mai `applicaScaglione`) e ne ha dedotto un bug, quando è
un'architettura intenzionale e documentata. **Non toccare `rigaPesata`.**
Questa voce del backlog è chiusa qui: se un futuro giro di deep-pass
rilegge la stessa asimmetria e la ripropone, va ricontrollata contro
questa nota prima di riaprire un cantiere.

## Prossimo passo atomico
1. **Committare Conti (solo il difetto 1/2, SdI-come-non-emessa)**:
   costruire una worktree isolata da `HEAD` copiando SOLO
   `apps/conti/conti-data.js` e `apps/deepwork-id/tests/run-kpi.mjs`
   (verificato con `git status`: sono gli unici due file toccati).
   **Attenzione ai numeri**: KPI 3131→3132 (un nuovo test), quindi la
   somma delle nove suite passa da 3.625 a **3.626**, e l'asserzioni-
   totale del giro `node` sale di 1 (da 4124 a un valore da VERIFICARE
   col giro, non indovinare — nessun banco browser nuovo, banchi/file
   restano 343/151). Le righe doc con questi numeri vanno riscritte a
   mano nella worktree isolata (NON copiare i doc del working tree
   principale, che contengono ancora i vecchi numeri di Scudo/Flotta non
   sincronizzati per questa unità).
2. Scrivere il checkpoint che dichiara chiuso l'intero backlog di questo
   blocco (Genesi, Flotta, sicurezza, Scudo, Conti-1, Conti-2-respinto).
3. Poi, con il backlog di difetti confermati esaurito: controllare se
   ci sono giri di deep-pass/ricerca ancora in corso in background e
   leggerne l'esito (verificando ogni "non c'è"/difetto prima di
   crederci, come richiesto da CLAUDE.md); altrimenti riprendere la
   rotazione di ricerca continua (un agente per app, a rotazione) e
   mantenere ≥3 cantieri paralleli. Non fermarsi mai fra un'unità e
   l'altra.

## Blocchi
Nessuno.
