# Checkpoint — 2026-09-15T05:56:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
00667238 (pushato)

## Cosa è stato completato

Chiuso il difetto trovato dall'agente in background lanciato su Campo
(insieme a Scudo e Genesi, la regola dei tre cantieri paralleli — vedi
checkpoint `20260915-054249`). Riverificato a mano — lettura diretta del
codice, non la parola dell'agente — prima di agire.

**Il difetto**: `appelloTurno` è stato corretto oggi (commit `2d6870b9`)
perché un operatore già spuntato "presente" spariva dall'appello di
EMERGENZA se il suo stato anagrafico cambiava dopo in "non-disponibile".
Il messaggio di quel commit affermava che l'effetto si propagasse a
`csvAppello`, al calcolo del riposo minimo e al riepilogo del briefing —
ma **`riposoDiTurno` e `orariDiTurno` (le due funzioni "sorelle" che
calcolano rispettivamente il rispetto del riposo ex D.Lgs 66/2003 art. 7 e
le ore lavorate) non erano mai state toccate**: avevano la STESSA copia
debole del filtro (`operatoriDi(...).filter(stato !== "non-disponibile")`
PRIMA di guardare lo spunto di presenza), scritta indipendentemente da
`appelloTurno` invece di condividerla.

Riprodotto: un operatore rientra da meno di 11 ore di riposo (violazione
vera) e viene spuntato presente; se poi il suo stato anagrafico cambia in
"non-disponibile" (riassegnazione, ecc.), la violazione:
- spariva dal conteggio di `riposoDiTurno` (`sotto`/`totale` scendevano)
- spariva dal rapporto di fine turno (`rapportoGiornata`), che cita
  esplicitamente l'obbligo di legge nella frase introduttiva
- diventava `riposo_stato: "non-in-turno"` nell'export CSV (`csvAppello`),
  quello che un ispettore o l'ufficio del personale apre per verificare il
  riposo minimo — mentre la stessa riga diceva ancora `stato: presente`
  (perché quella colonna viene da `appelloTurno`, già corretto): un
  documento che nella stessa riga dice "presente" e "non in turno".

**La correzione**: `riposoDiTurno` e `orariDiTurno` ora derivano il loro
elenco da `appelloTurno(operatori, presenze, data, turno,
squadra).righe` (già corretto) invece di reimplementare da zero la stessa
unione "ruolo + spunto orfano" una terza volta — è la "copia debole" che
CLAUDE.md descrive: una regola scritta più volte diverge alla prima
modifica di una sola delle copie. Le guardie specifiche di ciascuna
funzione restano (in `riposoDiTurno`, chi è spuntato ASSENTE non entra;
in `orariDiTurno`, solo chi è spuntato PRESENTE ha orari da calcolare) —
sono applicate come filtro/map sull'elenco condiviso, non reimplementate.

**Verifica**:
- Due nuovi test in `run-kpi.mjs`, uno per funzione, con lo stesso schema
  del test già scritto per `appelloTurno`: un operatore spuntato presente
  (con violazione vera nel caso del riposo) il cui stato anagrafico cambia
  dopo in "non-disponibile" resta nel conteggio; un secondo operatore, mai
  spuntato e non-disponibile fin dall'inizio, resta correttamente fuori
  (verifica che la correzione non allarghi la platea oltre il dovuto).
- Eseguiti: 2/2 verdi. Controprova (rimesso il vecchio filtro in entrambe
  le funzioni): tutt'e due i test cadono esattamente sull'asserzione che
  conta ("o1 resta nel conto..."), poi ripristinato e riverificato verde.
- `run-kpi.mjs`: 2989/0 (nessuna regressione sui test preesistenti,
  compreso quello che verifica che chi non è MAI stato spuntato e non è
  disponibile resti fuori).
- `run-stile.mjs`: 328/0. `sintassi-pagine.mjs`: 34/34.
  `numeri-nei-documenti.mjs`: aggiornati 3.468→3.470 prove (run-kpi
  2987→2989) in tutti e quattro i documenti cascata; 43/0.
- Giro isolato su worktree separata (staging scoped a `campo-data.js` +
  l'hunk di Campo in `run-kpi.mjs`, separato dagli hunk già committati di
  core/Conti/Sentinella con lo stesso metodo `git apply --cached` su patch
  estratta a mano): **40 comandi a posto, 0 caduti**. La cifra "asserzioni
  eseguite dal giro" (misurata fresca a 3.936, coerente con la nota già
  scritta in `DEVELOPMENT.md` sulla sua fragilità/non-stabilità fra un
  lancio e l'altro — vedi checkpoint precedente) è stata aggiornata di
  conseguenza.
- `git status --short` verificato prima del commit: esattamente i 6 file
  intesi.

## Stato roadmap

Nessuna voce di roadmap dedicata (difetto da ricerca mirata). Con questa
unità si chiude anche il secondo giro di ricerca in parallelo di questo
blocco (Scudo e Genesi hanno riportato onestamente "nessun difetto
nuovo confermato" dopo una ricerca approfondita — vedi le loro
sub-agent-handback nella conversazione — quindi nessuna azione dovuta lì).

## Prossimo passo atomico

Nessuna unità in sospeso. Il blocco ha prodotto, dall'ultima
compattazione, sei correzioni committate (Flotta nome breve, Conti
estratto conto, Sentinella soglia efficace, core sismogramma ambiguo,
Campo riposo/orari) più la chiusura B3/B12 di Genesi già registrata nei
checkpoint precedenti. Continuare con: (a) un'altra tornata di ricerca
mirata su un'area non ancora coperta (Terra fatta a mano senza esito;
Scudo e Genesi appena passate senza esito — la prossima area naturale è
forse Deepwork ID stesso, mai toccato da queste ricerche, o un secondo
giro su Conti/Sentinella con una famiglia di difetto diversa da quella già
cercata), oppure (b) il blocco B4 della roadmap (mancanze confermate del
delta), oppure (c) il prossimo ponte della mappa ecosistema.

Nessuno stop volontario: si prosegue subito.
