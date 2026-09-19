# Checkpoint — 2026-09-13T11:57:15Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b6b9d537`

## Completato

Continuato il filone "B3. Genesi continua a uscire dalla pagina":
estratta `_puntiNuvola` da `genesi.html` a `genesi-data.js`, con lo
stesso nome (nessun wrapper resta in pagina — il call site in
`renderHome` importa direttamente dal modulo).

- **Quarta volta** che questo file prende lo stesso falso positivo del
  censimento statico (`genesi-estraibili.mjs`): la funzione non leggeva
  `D2` per niente, ma il tokenizzatore la marcava legata a nove
  variabili del modulo («lo, conta, c, locale, n, riga, a, si, su») per
  lettere e parole dentro le sue STRINGHE («nel ritaglio», «caricati»,
  «disegnati su») e nei suoi commenti — la stessa famiglia già vista in
  `_sitoParseCsv`, `_sentCell`, `esplCardHtml`/`innCardHtml` (unità
  121/122/124, 12/09).
- Portato con la funzione il commento storico sul difetto del 03/08
  (la nuvola intera confusa col ritaglio — due numeri di due cose
  diverse scritti uno accanto all'altro).
- 3 nuove prove in `run-kpi.mjs`, con un caso di bordo pinnato apposta:
  `puntiRitaglio:0` NON entra nel ramo del ritaglio (il confronto reale
  è `>0`, non `!=null`) — verificato che SENZA quella prova specifica un
  cambio silenzioso da `>0` a `!=null` passa lo stesso (iniettato
  davvero prima di consegnare, la prova cade solo con quel caso
  presente).
- Fondo di copertura di `genesi-data.js` alzato 143→144.

Effetto sui bucket del censimento `genesi-estraibili.mjs`: il totale
nella pagina scende **148→147** (funzione uscita del tutto, nessun
wrapper resta), il bucket "6-10" scende 23→22, gli estraibili restano
**57** (una funzione già uscita dalla pagina non è più "da estrarre").

Documenti corretti di conseguenza (misura, non stima): `DEVELOPMENT.md`,
`STATO_PRODOTTO.md`, `DECISIONI_WEEKEND.md`, `ROADMAP_SETTIMANA.md` —
3.419→3.422 prove senza rete, 307/307→308/308 funzioni condivise,
genesi-data.js 143/143→144/144, 147 funzioni nella pagina (era 148),
e l'asserzioni-totali-del-giro 3.877→3.880 (di nuovo in due passate,
stessa dinamica delle unità precedenti: la prima passata con
`numeri-nei-documenti.mjs` ancora rosso esclude il suo comando dalla
somma).

Verificato sulla **copia** (git worktree) di quello che si sta
committando, due volte: `giro-node.mjs` → **40 comandi a posto,
0 caduti**.

## Stato roadmap

Aggiunta una nuova voce in coda al filone B3 in
`vault/ROADMAP_SETTIMANA.md`, stesso stile delle precedenti.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato: pura
riorganizzazione del codice (formattazione di testo, nessun calcolo).

Resta aperta la domanda posta al fondatore su "aspetto più
professionale in stile CAD" vs. "struttura identica al core" — nessuna
risposta ancora arrivata.

## Prossimo passo atomico

Il filone B3 resta aperto. Candidati NON ancora aperti nel bucket
"6-10" del censimento, con l'avvertenza già scritta nel checkpoint
precedente:
- ⛔ **Evitare** `scatterMs`, `flyrockInv`, `micDaMostrare`,
  `computeInnesco2D`, `computeRelief2D`, `mdlSyncAltezze`: tutti vicini
  al dominio vibrazioni/flyrock/geometria del fronte 3D, dentro o
  accanto al perimetro del blocco di sicurezza — da NON toccare senza
  la risposta del fondatore sulla segnalazione aperta.
- Candidati più sicuri da guardare per primi (nessun collegamento
  visibile a D2 nel nome/firma, da verificare a mano prima di aprirli):
  `sitoLegge`/`ppvSite` erano già nella colonna "si portano fuori come
  sono" (esaurita); nel bucket "3-5" restano `sitoAggiungi`, `sitoSalva`,
  `cmpSave`, `cmpScatti` — ma tutti e quattro toccano `GDB` (I/O verso
  l'organizzazione/il browser), quindi NON sono trasferibili a
  `genesi-data.js` (che deve restare puro): da lasciare dove sono e
  dichiarare nel censimento con la ragione, non da forzare.

Dato che i candidati rimasti sono per lo più o safety-adjacent o
I/O-bound, il filone B3 potrebbe essere vicino al suo limite naturale
per ora. Prossima scelta ragionevole: tornare al giro di ricerca
continua (prossima app in rotazione) o attendere la risposta del
fondatore sul terzo pezzo di "tutte e tre" prima di procedere oltre su
Genesi. Continuare senza fermarsi (regola del fondatore).
