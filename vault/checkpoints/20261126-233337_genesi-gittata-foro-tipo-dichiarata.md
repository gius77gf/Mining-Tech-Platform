# Checkpoint — Genesi: il censimento delle uscite, e la gittata che dichiara di essere sul foro tipo

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): la gittata dichiara di essere
calcolata sul foro tipo…»). Il precedente, `e5753d79` (il rientro del file
di scambio), è confermato dal giro `node` completo: 43 comandi a posto,
4418 asserzioni.

## Che cosa è stato fatto
1. **Il censimento** (`scratchpad/censo/censo.mjs`, bottoni veri, otto
   uscite aperte e lette): la tabella è nella voce chiusa della roadmap.
2. **La misura che conta** (`scratchpad/censo/gittata.mjs`): un solo foro
   con 1,5 m di borraggio in una volata a 2,2 → gittata 101 m, sgombero
   persone 404 m; tutti i fori a 1,5 m → 193 m e 772 m. La previsione usa i
   valori del progetto e il prodotto non lo diceva accanto alla gittata.
3. **La cura, senza scegliere al posto del fondatore**: nessuna formula,
   nessuna soglia, nessun cambio di quale foro usa il conto.
   - modulo: `CAMPI_DELLA_GITTATA`, `CAMPI_DELLA_PEZZATURA`,
     `foriFuoriDalForoTipo(holes, campi)`, `avvisoForoTipo(holes, campi,
     soggetto)` — UNA frase per tutti i posti (206/206);
   - schermo: riga «Gittata flyrock» con l'etichetta `#fly-foro-tipo`, la
     frase in testa alla spiegazione, e mai verde se ci sono fori fuori; la
     frase della X50 ora nomina i campi veri;
   - report: «Sul foro tipo — …» accanto a gittata e pezzatura;
   - scheda volata CSV: «Fori con valori propri», «Avviso frammentazione
     sul foro tipo», «Avviso gittata sul foro tipo».
4. **Decisione 33**: in cima alla sezione e nell'indice, col fatto misurato
   e la domanda in più (gittata sul foro più sfavorevole?).
- Prove: `run-kpi.mjs` 3255 → 3256 (controprova 5 su 5); banco
  `genesi-foro-per-foro.mjs` 176 → 186 (61 iniezioni, tutte sul bersaglio);
  `genesi-foglio-in-cava.mjs` 52 → 55 (13 iniezioni); riancorate una prova
  sul sorgente e l'iniezione di `genesi-recettore-assente.mjs` che citavano
  la riga spostata (l'ha detto `iniezioni-fresche`, letta dal codice
  d'uscita).
- Numeri: 3.756 prove senza rete; giro `node` 4419 (per somma: 4418 + 1);
  condivisi 380/380.

## Imparato
- La controprova ha bocciato una mia asserzione: «la riga non resta verde»
  passava anche col difetto rimesso, perché nella dimostrazione la riga era
  già gialla per la distanza del recettore. Una prova su un cambio di stato
  deve prima PORTARE il soggetto nello stato di partenza.
- Il difetto più serio della giornata non era in nessuna cella della
  tabella che stavo compilando: è uscito aprendo i file e chiedendosi «e
  questo numero, da quali valori viene?».

## Stato roadmap
Aperte per Genesi: `il piano fori DXF disegna il boccaforo e non il piede`,
`il confronto A/B non dice i fori con valori loro`, `il piede che esce dalla
faccia` (in attesa della decisione 35). In attesa del fondatore: decisione
33 (⚠️ con la parte sulla gittata in cima), 28, 34, 35.

## Prossimo passo atomico — il DXF dei fori disegna anche il piede
1. `dxfPianoFori(fori, diamMm, profilo)` nel modulo: oggi cerchio + numero
   sul livello `FORI`. Serve il progetto per sapere lunghezza e
   inclinazione (`scostamentoPiedeForo(h, progetto)`): aggiungere un quarto
   argomento facoltativo `progetto` (la firma troppo stretta: un argomento,
   non una copia). Senza `progetto`, o con scostamento nullo o `null`,
   niente di nuovo: byte per byte com'era (provarlo).
2. Per i fori con scostamento > 0: una `LINE` sul livello `PIEDI` dal
   boccaforo (mx, my) al piede. ⚠️ Il VERSO: sulla pianta di Genesi il
   piede sta verso la faccia, cioè a `my − scostamento` (la faccia è a
   my = 0); verificarlo guardando come `dxfPianoFori` scrive oggi le Y e
   come disegna la pagina (`cy - off`), non darlo per buono.
3. La pagina passa `D2` come progetto (`btn-piano-dxf`); il messaggio dice
   quanti piedi sono usciti.
4. Prove: `run-kpi` (coordinate calcolate a mano nel test), il rientro nel
   nostro lettore (`dxfLeggi`: le linee dei piedi entrano come tratti,
   dichiararlo), banco `genesi-foro-per-foro.mjs` sezione 14 (il DXF dal
   bottone vero), `iniezioni-fresche` dal codice d'uscita.

## Blocchi
Nessuno tecnico.
