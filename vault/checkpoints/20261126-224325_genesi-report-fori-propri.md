# Checkpoint — Genesi: il report di volata elenca i fori con valori loro

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («feat(genesi): il report di volata elenca i
fori con valori loro…»). Il precedente, `59af3ff1` (inclinazione nel piano
XML, decisione 35), è confermato dal giro `node` completo: 43 comandi a
posto, 4416 asserzioni.

## Che cosa è stato fatto
- Trovato LEGGENDO il foglio, non cercandolo: il report stampava «Carica
  per foro 58 kg», diametro, profondità, borraggio e inclinazione del
  progetto, e nessun elenco dei fori diversi. Un foro lasciato scarico, sul
  foglio che si porta in cava, non esisteva.
- `apps/genesi/genesi-data.js`: `foriPropriPerFoglio(holes, progetto)` →
  `{ fori, conPropri, campi, quanti, righe }` (201/201 esportazioni provate).
  Solo i fori diversi, in ordine di numero; solo i campi in cui qualcuno si
  scosta; vuoto senza valori per foro.
- `apps/genesi/genesi.html` (nessuna funzione di pagina nuova: tutto dentro
  il gestore di `btn-report`): sezione «Fori con valori propri» dopo «Carica
  & sequenza» (valore suo in grassetto, «0 (scarico)», «non noto» se manca),
  e la nota «del progetto — N fori ne hanno una loro» accanto alle cinque
  righe del progetto, solo dove serve.
- Prove: `run-kpi.mjs` 3253 → 3254, controprova 4 su 4; banco
  `browser/genesi-foglio-in-cava.mjs` 38 → 52 (misurato facendo girare la
  versione di prima, non contato a mente), 4 iniezioni nuove (11 in tutto,
  tutte rimesse: 23 prove cadute); il foglio sta nella carta (718 px) ed è
  stato guardato nello scatto a 390 px.
- Numeri: 3.754 prove senza rete; giro `node` 4417 (per somma: 4416 + 1);
  condivisi 375/375.

## Stato roadmap
Aperte per Genesi: `riaprire il file di scambio di una volata con valori per
foro` (nuova, DA MISURARE), `il piede che esce dalla faccia` (in attesa
della decisione 35). In attesa del fondatore: decisioni 28, 33, 34, 35.

## Prossimo passo atomico — il rientro del file di scambio, misurato prima
1. MISURA (banco a mano, in scratchpad, col metodo di
   `browser/genesi-foro-per-foro.mjs` sezione 11): progetto di dimostrazione,
   un foro a 0 kg e uno a 8,5 m dal ponte di debug, «Simula» (`#d2-cta`),
   esporta (`#btnExport`), poi riapri QUEL file da `#fileIn` e leggi
   `window.__genesi.D2.kg`, `D2.prof`, `P.kg`, `P.prof` e i messaggi
   (`window.__toasts`). L'ipotesi da verificare: la carica del progetto
   rientra come MEDIA dei fori (58 → 53,2) perché l'import usa
   `_mediaDichiarata('kg')`. Se la misura la smentisce, chiudere la voce di
   roadmap scrivendo che cosa succede davvero.
2. Se confermata: nell'export `default` guadagna `carica_kg` (il progetto,
   accanto a `profondita_m` che c'è già e a `diametro_mm`); nell'import, se
   `default.carica_kg` / `default.profondita_m` sono numeri, valgono loro e
   la media non si calcola; se mancano (file di ieri) resta la media com'è.
   ⚠️ Guardare `default.profondita_m`: oggi è `P.prof`, va controllato che
   sia il progetto e non la profondità «bloccata» del 3D.
3. Dire nel messaggio dell'import quanti fori del file avevano valori loro
   che il rientro non riporta (il lettore rigenera una riga sola: decisione
   già presa e commentata lì) — «non lo riporto» detto, non taciuto.
4. Prove: funzione pura nel modulo per «valore del progetto dal file»
   (dichiarato → quello; se no media; quanti senza), `run-kpi`, e il giro
   vero nel banco. Ogni controllo letto dal codice d'uscita.

## Blocchi
Nessuno tecnico.
