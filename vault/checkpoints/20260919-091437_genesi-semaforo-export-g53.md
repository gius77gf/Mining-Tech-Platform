# Checkpoint — 2026-09-19T09:14:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8e49ccf2 — feat(genesi): il semaforo di sintesi letto prima di esportare (G53)

## Cosa è stato completato
Settimo cantiere Genesi del pivot: la seconda proposta rimasta aperta
di `docs/RICERCA_CONTINUA_GENESI.md` (la prima, l'esito della
detonazione, è G52). Il semaforo di sintesi (G45, 14/09) non era mai
letto da nessuno dei quattro bottoni che portano il piano fuori
dall'app — un piano con indicatori gravemente fuori fascia si
esportava in silenzio, identico a uno sano.

- [x] La ricerca stessa aveva già tentato un MODALE di conferma lo
      stesso giorno, provato e scartato (costo Medio, non Piccolo: 24
      prove su 91 in sei banchi diversi presumono un download
      sincrono). Non ripetuto quell'errore.
- [x] Soluzione additiva: `D2._sintesi` (n/fuori/gravi) scritto una
      volta da `renderScheda2D`; `fraseGraviExport()` ne deriva un
      suffisso testuale, `''` se non ci sono indicatori gravi o se la
      scheda non è mai stata renderizzata.
- [x] **Autocorrezione prima del commit**: la prima stesura chiamava un
      SECONDO `toast()` per l'avviso — che SOVRASCRIVE il primo
      (`#toast` è un elemento solo). Un banco che confronta i numeri
      della frase col file (`genesi-documenti-che-escono.mjs`) è
      passato da 3 KO a 0 spostando l'avviso in coda alla STESSA frase
      di successo, un solo `toast()` per handler.
- [x] Rilanciati tutti e sei i banchi esistenti che premono i quattro
      bottoni di export: nessuna regressione.
- [x] Banco nuovo `genesi-semaforo-export.mjs`: inietta `D2._sintesi`
      per isolare la lettura dal calcolo dei validatori (già provato
      altrove), con una controprova che rompe la guardia `gravi>0`.

## Verifica prima del commit
`run-kpi.mjs`: 3207/3207. `copertura-funzioni.mjs`: 0 senza prova
(Genesi 138 funzioni nella pagina, 48 estraibili). `sintassi-pagine.mjs`:
34/34. `numeri-nei-documenti.mjs`: 43/43. `suite-collegate.mjs`: 3/3
(201 file di banco, 443 esecuzioni). `sonda-vuoto.mjs`: 15/15.
`run-stile.mjs`: 330/330. `classi-orfane.mjs`/`nomi-doppi.mjs`:
invariati. Banco `genesi-semaforo-export.mjs`: 8/8 normale, controprova
8 passati/1 KO voluto. I sei banchi preesistenti che premono gli export
(genesi-documenti-che-escono 101/101, genesi-csv-fori-disegnati,
genesi-numeri-tranquilli, genesi-piano-dxf, genesi-piano-innesco,
ponte-genesi-campo): tutti verdi.

## Stato roadmap
Bilancio del pivot su Genesi: sette capacità reali implementate e
provate (G48-G53), una lacuna grande filata come Decisione #43 per il
fondatore (blocchi riusabili). Entrambe le proposte non ancora chiuse
di `docs/RICERCA_CONTINUA_GENESI.md` (misfire G52, semaforo G53) sono
ora costruite. Il file di ricerca continua sembra esaurito per le
proposte azionabili — da riverificare all'inizio del prossimo blocco
prima di dichiararlo chiuso.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo
  del browser (scratchpad, PID 6815, avviato 07:53:44Z — ancora in
  corso all'ultimo controllo, ~81 minuti, sul blocco «contrasto non
  testo») con `leggi-giro.mjs` quando arriva in fondo. Il codice è
  cambiato più volte MENTRE il giro girava (G51, G52, G53): verificare
  che la guardia dell'impronta di `tutti.mjs` lo dichiari NON VALIDO da
  sola, non fidarsi del risultato.
- Rileggere `docs/RICERCA_CONTINUA_GENESI.md` dall'inizio (non solo la
  coda) per verificare se resta qualche proposta con `⚠️` non ancora
  processata, prima di lanciare nuova ricerca.
- Valutare se lanciare un nuovo giro di ricerca Haiku in background su
  un aspetto diverso di Genesi (mantenendo ≥3 fronti aperti dentro
  Genesi, come richiesto dalla direttiva del fondatore), dato che la
  ricerca esistente sembra esaurita.

## Blocchi
Nessuno.
