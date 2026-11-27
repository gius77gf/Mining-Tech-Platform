# Checkpoint — 2026-09-15T04:54:31Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7d6e1869 (pushato)

## Cosa è stato completato

Chiuso il terzo e ultimo difetto delle tre passate in profondità lanciate
in parallelo su Flotta, Conti e Sentinella questo blocco (checkpoint
`20260915-034940`). Con questo si chiude l'intero giro di ricerca: tutti e
tre i difetti trovati sono stati riverificati a mano, corretti, testati e
committati separatamente (Flotta `3df48d43`, Conti `b84daff9`, Sentinella
`7d6e1869`).

**Il difetto**: `conSoglia` (`apps/sentinella/index.html`) esiste apposta
perché — dice il suo stesso commento — «tutto ciò che nell'app calcola uno
stato: semaforo, KPI, grafico, allerte, report — deve passare da qui»: se
un punto di misura è collegato a un ricettore con soglia propria nella
stessa unità, vince quella (è il limite scritto per quella casa/confine
specifico), altrimenti vale la soglia del punto. `csvAmbiente`,
`refertoDaVolata` e la schermata Monitoraggi rispettano già la regola.
`misureDelGiornoPerReclamo` (`sentinella-data.js`) no: leggeva `m.soglia`
grezza. Verificato sui dati veri della dimostrazione: il punto v2
("Vibrazioni V2 — confine Nord", soglia propria 5 mm/s) è collegato al
ricettore rc2 ("Confine Nord", nessun edificio, soglia propria 20 mm/s,
stessa unità). Per la lettura reale di 5,6 mm/s del 17/07: la schermata
Monitoraggi dice «Conforme» (soglia efficace 20), ma la card del reclamo e
la lettera di risposta dicevano «superamento della soglia (soglia 5)» —
esattamente la stessa lettura, due verdetti opposti nella stessa app. Nel
verso pericoloso opposto (un ricettore più sensibile del punto), la stessa
lacuna avrebbe potuto coprire un vero superamento dietro un «conforme»
tranquillo — verificato con uno scenario costruito ad hoc.

**La correzione**: `misureDelGiornoPerReclamo` prende un quarto argomento
(`ricettori`, l'elenco completo — non solo quello del reclamante, che serve
solo a marcare `delRicettore`) e calcola `sogliaEfficace(m, ricettori)` per
ogni punto candidato, usandola sia per `statoMisura` sia per il campo
`soglia` restituito/mostrato. I due chiamanti reali
(`apps/sentinella/index.html`, `rispostaReclamo` in `sentinella-data.js`)
ora passano `RIC`. Chi non lo passa (i test che verificano solo la logica
del verdetto, senza scenario di ricettore) mantiene il comportamento di
prima — nessuna regressione, verificato esplicitamente con un'asserzione
dedicata.

**Verifica**:
- Nuovo test nel blocco esistente `"⛔ Sentinella ·
  misureDelGiornoPerReclamo..."` (`run-kpi.mjs`): con `D.ricettori` passato,
  v2 diventa «conforme» (soglia 20), il peggiore del giorno è v2 conforme,
  la frase non contiene più «superamento»; senza il quarto argomento il
  verdetto resta quello di prima (nessuna regressione sui chiamanti che non
  hanno l'elenco); scenario sintetico opposto (ricettore sensibile, soglia
  3, punto con soglia grezza 10, lettura 6): senza ricettori «conforme»
  (falso), con ricettori «superamento» (vero) — il caso che il principio
  del fondatore vieta esplicitamente, riprodotto e chiuso.
- Test preesistente `"Sentinella · rispostaReclamo..."` aggiornato: la
  riga di V2 e la chiusura della lettera non parlano più di un superamento
  falso (`sotto soglia (soglia 20 mm/s)`, `allarme: false`), con un
  commento che spiega perché il testo pinnato prima era la codifica del
  difetto, non del comportamento corretto.
- Numeri e testi verificati con script diretti (node -e ...) prima di
  scriverli negli assert, mai indovinati.
- `run-kpi.mjs` diretto: 2985/0 dopo la correzione (era 1 KO prima di
  aggiornare il test preesistente, verificato che l'unico rosso fosse
  quello atteso e non un effetto collaterale altrove).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/34.
  `numeri-nei-documenti.mjs`: 43/0 (nessun contatore di documento tocca
  questa unità).
- `sonda-vuoto.mjs`: 15/0 (rilanciato per prudenza, tocca la stessa
  famiglia "numero tranquillo" dei tre difetti di questo blocco).
- Giro isolato su worktree separata (staging scoped agli ultimi due hunk
  di `run-kpi.mjs` + `sentinella/index.html` + `sentinella-data.js`,
  separato dall'hunk di Conti già committato con lo stesso metodo
  `git apply --cached` su patch estratta a mano dal diff completo):
  **40 comandi a posto, 0 caduti**, documenti coerenti.
- `git status --short` verificato prima del commit: esattamente i tre file
  attesi.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Chiuso il
giro di ricerca aperto nel checkpoint `20260915-034940` (tre agenti in
background su Flotta/Conti/Sentinella): tutti e tre i difetti trovati sono
ora corretti, testati, committati e pushati.

## Prossimo passo atomico

Nessuna unità in sospeso. Continuare con un nuovo giro di lavoro: o (a)
un'altra tornata di passate in profondità su app non ancora coperte in
questo modo questa settimana (Scudo e Campo hanno già ricevuto un difetto
ciascuno in un blocco precedente di questa stessa finestra, ma non una
passata esaustiva su tutte le loro sezioni; Terra è stata coperta a mano
senza trovare nulla di nuovo — il modulo è già molto maturo), oppure (b) il
blocco B4 della roadmap (mancanze confermate del delta), sul modello della
riga stale già chiusa in `docs/CONCORRENTI_FLOTTA.md` (commit `baae0a9b`),
oppure (c) il prossimo ponte della mappa ecosistema
(`docs/MAPPA_ECOSISTEMA.md`, Flotta→Conti a metà: manca la lettura vera da
Conti, i dati di dimostrazione e il punto nella pagina — citato anche nel
prompt della routine).

Nessuno stop volontario: si prosegue subito.
