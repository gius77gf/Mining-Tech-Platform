# Checkpoint — 2026-09-19T17:33:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e0de3d46 (fix(test): genesi-frasi-limite, l'asserzione sulla colonna della base era invecchiata)

## Cosa è stato completato
Seguendo il mio stesso "prossimo passo atomico" del checkpoint G56c —
controllare se altre funzioni foro-per-foro con la stessa forma («vicino
più vicino entro una distanza massima») condividessero il difetto —
verificato `innescoSuMaglia` (la rete di collegamento dei detonatori) e
trovato lo stesso difetto, in un posto più pericoloso.

- [x] **Verificato dal vivo (Playwright)**: `innFrom=-1` diceva sia «è il
  primo foro della volata, non serve un raccordo» sia «un foro ha già
  sparato prima di lui, ma è troppo lontano per tirarci un raccordo
  (`dMax`=2,2×3,5=7,7 m)» — indistinguibili. Con un foro solo tolto la
  soglia più larga di `innesco` (7,7 m contro i 5,25 m di relief) non
  bastava a far scattare il difetto; tolti DUE fori adiacenti (buco di
  10,5 m) il foro rimasto usciva identico al vero primo foro.
- [x] **G56d — `innescoSuMaglia` (genesi-data.js)**: nuovo campo
  `h.innFuoriFascia` (stessa forma di `h.relFuoriFascia` in G56c).
- [x] **Riepilogo «Rete di innesco» nel Validatore (genesi.html ~7294)**:
  filtrava silenziosamente i fori fuori fascia dal conteggio dei
  collegamenti (`HH.filter(h=>h.innFrom>=0...)`), e poteva dichiarare
  «la rete è collegabile con quello che si compra» ignorando proprio il
  foro senza nessun raccordo che lo raggiunga. Ora conta `nGap` a parte,
  passa a `sv-bad` (più severo di relief: qui un foro senza raccordo non
  si accende affatto, non è solo un dato diagnostico incerto) e aggiunge
  la frase di attenzione.
- [x] Test nuovo in `run-kpi.mjs` (G56d) con lo scenario esatto verificato
  dal vivo (5 fori, 2 tolti). Il test byte-per-byte contro la vecchia
  forma inline di `innescoSuMaglia` aggiornato per includere la stessa
  logica.
- [x] **Non toccato** (scelta deliberata, per restare nello stesso ambito
  di G56c): il disegno delle linee di connessione sulla pianta
  (`drawInnesco2D`) non disegna NULLA per un foro con `innFrom<0`, in
  nessuno dei due casi — un marcatore visivo distinto per il caso
  "fuori fascia" è un miglioramento possibile ma richiede una scelta di
  disegno (colore, forma) che non è emersa dalla sola verifica diretta:
  resta un candidato per una unità futura, non deciso qui.

## Verifica prima del commit
- `run-kpi.mjs`: 3214/0 (era 3213/0).
- `sintassi-pagine.mjs`: 34/0. `nomi-liberi.mjs`: 32/0 (due volte).
- `numeri-nei-documenti.mjs`: 43/0 (rilanciato dopo ogni propagazione).
- **`giro-node.mjs` completo, DUE VOLTE di fila sullo stesso stato**:
  41/41 comandi a posto, 0 caduti, «e i 2 documenti che lo dichiarano
  dicono lo stesso numero» — asserzioni salite a **4266** (passate per
  4263/4212/4265 nella stessa giornata per ragioni già raccontate nel
  documento: la lezione di metodo è scritta lì, non solo il numero).
- Verifica visiva diretta (Playwright): letta la riga HTML reale del
  Validatore PRIMA del fix (nessun avviso, «tutti i ritardi
  corrispondono a raccordi esistenti» con un foro invisibile al
  conteggio) e DOPO (`sv-bad`, «8 collegamenti · 1 taglio /
  1 irraggiungibile», frase di attenzione corretta).
- `tutti.mjs --solo=genesi`: lanciato, non ancora arrivato in fondo al
  momento di questo commit (il contenitore è sotto carico, ~15+ minuti
  contro i 5 di un giro sano) — questa modifica non tocca nessun
  percorso di disegno/canvas, solo dati e testo del Validatore, quindi
  la verifica diretta con Playwright fatta a mano copre il rischio reale
  meglio di aspettare il batch intero. Se al prossimo ciclo il suo
  registro mostra un KO nuovo non-controprova, va riletto.

## Stato roadmap
Chiusa la famiglia di verifiche "scenario asimmetrico su funzioni
foro-per-foro con soglia di adiacenza": due difetti reali trovati
(relief G56c, innesco G56d), stessa causa, stessa cura.

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito di `tutti.mjs
  --solo=genesi` (in corso) al prossimo ciclo; se mostra KO nuovi non
  attesi, investigare prima di procedere oltre.
- Valutare se applicare la stessa verifica a `energiaSuMaglia` (mappa
  dell'energia per foro) — condivide `D2.holes`/geometria ma NON la
  forma «vicino più vicino entro una distanza massima» (calcola
  l'energia locale dal volume servito, non da un predecessore nel
  tempo): probabilmente non condivide il difetto, da confermare con
  una lettura del codice prima di spendere tempo su una verifica dal
  vivo che potrebbe non trovare niente.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
