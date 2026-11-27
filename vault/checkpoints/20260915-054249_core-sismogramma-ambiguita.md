# Checkpoint — 2026-09-15T05:42:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1a5a35f7 (pushato)

## Cosa è stato completato

Dopo aver chiuso il giro di ricerca su Flotta/Conti/Sentinella (checkpoint
`20260915-045431`), ho lanciato tre nuove ricerche in background sulla
stessa famiglia ("numero tranquillo / record trovato con una chiave
debole") su Scudo, Campo e Genesi — la regola dei tre cantieri paralleli.
Nel frattempo ho fatto una passata manuale diretta sul **core**
(`index.html`), non coperta dagli agenti, cercando `.find()` per campo
invece che per id (lo stesso pattern che ha già dato due difetti veri
questa sessione, su Scudo e Flotta).

**Il difetto**: `_findVolata(data, cavaId)` — la funzione che associa
AUTOMATICAMENTE un sismogramma caricato alla volata del giorno, per
data+cava — usava `.find()` su `DB.rapportiniFoc` e poi su `DB.volate`. Il
commento dichiarava la scelta di design («niente scelta manuale → più
precisione»), ma quella scelta regge solo quando c'è UN candidato: con due
spari nella stessa cava lo stesso giorno (normale in una cava attiva),
`.find()` prendeva il PRIMO e lo presentava con un bollino verde «✓ Volata
associata — automatico, in base a data + cava», senza che nessuno avesse
scelto quella invece dell'altra. Un file di sicurezza (registrazione delle
vibrazioni) finiva legato al progetto sbagliato con la faccia della
certezza.

**La correzione**: `_findVolata` ora usa `.filter()` invece di `.find()` e
distingue tre casi per ciascuno dei due elenchi (rapportiniFoc, poi
volate): zero candidati (come prima), un candidato solo (associazione
automatica, come prima), più di un candidato (`{ambiguo:true, n}` — nuovo).
`_sismoAssocHtml` mostra un avviso onesto («N volate in questa data e
cava: non posso scegliere da sola») invece del bollino verde, e NON scrive
nessun riferimento. Trovato e corretto anche un secondo difetto collegato
in `salvaSismo()`: `s.volataRef=_fv?_fv.ref:''` è truthy anche quando `_fv`
è `{ambiguo:true}` (senza `.ref`), quindi avrebbe scritto `volataRef:
undefined` su Firestore in caso di ambiguità — corretto in
`s.volataRef=(_fv&&_fv.ref)?_fv.ref:''`.

**Verifica**:
- Due nuovi test in `run-kpi.mjs`, con estrazione a graffe bilanciate dal
  sorgente del core (stessa tecnica di B12/calotta): un candidato →
  associazione automatica come prima; due candidati (sia sui rapportini
  fochino sia sui progetti volata) → `{ambiguo:true, n:2}`, nessun `.ref`;
  cave diverse nello stesso giorno → NON ambiguo (il filtro sulla cava
  funziona); verificato anche che `salvaSismo` non scriva più `undefined`.
- Eseguiti direttamente: 2/2 verdi. Controprova (rimesso il vecchio
  `.find()`): il test cade esattamente sull'asserzione che conta
  ("non usa più .find()..."), poi ripristinato e riverificato verde.
- `run-stile.mjs`: 328/0 (invariato). `sintassi-pagine.mjs`: 34/34.
- `numeri-nei-documenti.mjs`: aggiornato 3.466→3.468 prove (run-kpi
  2985→2987) in tutti e quattro i documenti cascata. **Trovato e corretto
  un difetto autoinflitto nello stesso movimento**: scrivendo a mano la
  frase di `STATO_PRODOTTO.md` ho spezzato «prove automatiche che girano
  senza rete» su due righe esattamente fra «che» e «girano», e la regex di
  `numeri-nei-documenti.mjs` non attraversa gli a-capo — il controllo
  smetteva di trovare la frase (non un numero sbagliato: **nessuna
  frase**). Lo stesso identico difetto descritto altrove in questo file
  per «`che` girano»: un a-capo scritto a mano dentro una frase sorvegliata
  da una regex. Corretto togliendo l'a-capo introdotto.
- Giro isolato su worktree separata, **tre volte** (la prima e la seconda
  hanno preso rispettivamente il difetto della frase spezzata e un numero
  di "giro completo" ancora da misurare fresco; la terza è risultata
  pulita): **40 comandi a posto, 0 caduti**.
  ⚠️ **Misurato anche che «asserzioni eseguite dal giro» non è stabile fra
  un lancio e l'altro sullo STESSO contenuto**: 3891 e poi 3934 su due
  worktree identiche. Non ho indagato la causa (probabilmente un dato
  time-dependent in una delle 40 suite): il numero scritto nei documenti è
  l'ultima misura fresca (3.934), coerente con la regola già scritta qui —
  «il documento va riverificato dopo ogni giro» — non con l'aspettativa che
  resti fermo.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi, separati dalle modifiche di Campo (in corso in parallelo nello
  stesso `run-kpi.mjs`) con lo stesso metodo `git apply --cached` su patch
  estratta a mano già rodato oggi per Conti/Sentinella.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata manuale).

## Prossimo passo atomico

Committare l'unità Campo, già codificata e testata (in corso in
parallelo): `riposoDiTurno` e `orariDiTurno` erano rimaste una copia più
debole di `appelloTurno` (chiuso oggi, commit `2d6870b9`) — un operatore
già spuntato "presente" spariva dal conto del riposo/ore se il suo stato
anagrafico cambiava dopo in "non-disponibile", con impatto sul rapporto di
fine turno che cita il D.Lgs 66/2003 art. 7 e sull'export CSV. Trovato da
un agente in background, riverificato a mano (lettura diretta +
riproduzione), corretto facendo derivare entrambe le funzioni da
`appelloTurno(...).righe` invece di reimplementare la stessa unione una
terza volta. Due nuovi test aggiunti e verificati (2989/0), controprova
confermata nei due versi. Resta da fare: `git status --short` per isolare
esattamente `apps/campo/campo-data.js` + l'hunk di Campo in `run-kpi.mjs`
(separato dal resto già committato), worktree isolata da HEAD (ora
`1a5a35f7`), `giro-node.mjs` fresco, aggiornamento dei quattro documenti
(run-kpi 2987→2989, prove 3.468→3.470, «asserzioni giro completo» da
rimisurare fresco), commit, push, checkpoint.

Nessuno stop volontario: si prosegue subito.
