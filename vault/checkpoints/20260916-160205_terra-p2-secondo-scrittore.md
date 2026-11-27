# Checkpoint — 2026-09-16T16:02:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ea5ea518

## Cosa è stato completato
Secondo scrittore migrato al vocabolario condiviso `STATO_CELLA_*` di P2
(`docs/RICERCA_CONTINUA_ASSENZA.md` §4): `csvRilievi` di Terra.

A differenza di Flotta (`csvRicambi`, unità precedente), che aveva già due
stati scritti a mano da migrare, Terra non aveva nessuna distinzione
locale: il modello di un rilievo non sa dire PERCHÉ un volume manca (solo
CHE manca). Presa la decisione minima corretta: usare lo stesso binario
già validato per Flotta (misurato/mai-misurato), non forzare gli altri
quattro codici del vocabolario dove il dato per distinguerli non esiste.
Uno zero CONTATO davvero resta `misurato` (stessa regola già scritta per
Flotta e per `rientroRilievi`: "un rilievo che ha misurato zero non è un
rilievo che nessuno ha fatto").

Aggiunta l'ottava colonna al CSV (dopo la settima, tolleranza, dell'11/09).
Prima fetta identica a P4: solo lo scrittore, `parseRilieviCsv` resta
posizionale a sette campi — un file vecchio senza `stato` continua a
rientrare identico (provato esplicitamente).

Toccati, oltre a `csvRilievi`:
- `apps/deepwork-id/tests/run-kpi.mjs`: due asserzioni esistenti che
  ancoravano la fine della riga sulla settima colonna (tolleranza)
  aggiornate per la nuova ottava; l'intestazione a sette colonne
  aggiornata a otto; nuovo test dedicato con controprova di identità
  (stesso pattern usato per Flotta) e una prova esplicita di
  compatibilità all'indietro su un file a sette colonne.
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per
  `terra.rilievi` — l'intestazione dichiarata per l'auto-riconoscimento
  import (guardia B8, "l'intestazione dichiarata non è quella che l'export
  scrive DAVVERO"). Trovato dal fallimento della prova B8 stessa al primo
  lancio — è esattamente il controllo per cui esiste: un elenco scritto a
  mano che il codice vero smentisce.

Controprova sul codice vero: sostituita la costante con una stringa quasi
identica (`"mai-misurato-FINTO"`), confermato che il nuovo test cade,
ripristinato via `cp` + `diff`.

Doc-cascade: run-kpi 3098→3099, somma nove suite 3.592→3.593, giro-totale
4077→4078. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4078 asserzioni — predetto e confermato ESATTO al primo tentativo**
(terza unità di fila con predizione esatta, dopo Campo e la prima fetta
di P2).

## Stato roadmap
Avanza P2 della ricerca ASSENZA: due scrittori su undici migrati
(Flotta/`csvRicambi`, Terra/`csvRilievi`). Il documento è stato aggiornato
con la nota di chiusura di questo secondo passo, che dichiara esplicitamente
il prossimo candidato (Conti, pesate/incassi) e perché meriti più cura (file
a venti colonne, lettura con `leggiCsv` sull'intero testo per via degli a
capo dentro le celle — un meccanismo diverso, non un copia-incolla del
pattern appena usato).

## Prossimo passo atomico
Terzo scrittore di P2: Conti (`csvPesate`/`parsePesateCsv` o
`csvIncassi`/`parseIncassiCsv`). Prima di scrivere codice: leggere
`pesataDaCella` e il commento sopra `cellePesate` (righe ~5823-5866 di
`apps/conti/conti-data.js`) per capire quale dei campi del pesata può
mancare in pratica (probabilmente `netto`/`quantita` quando lordo o tara
non sono stati pesati) e se il binario misurato/mai-misurato basta anche
lì o se serve un terzo codice (es. `non-applicabile` per una pesata a
volume, dove la densità manca per costruzione). Non forzare tutti e sei i
codici se il modello non li sa distinguere — la stessa disciplina già
applicata a Flotta e Terra.

In alternativa: riprendere la passata "in profondità" su un'app diversa da
Campo, o una nuova sovrapposizione nella mappa ecosistema (nessuna emersa
finora in questo blocco).

## Blocchi
Nessuno. Il container ha mostrato un segno di riavvio a metà ciclo (PID e
nome dello shell-snapshot cambiati durante l'attesa del giro isolato) ma
il repository è risultato intatto e non superficiale (`git status`/`git
rev-parse --is-shallow-repository` verificati prima di proseguire): nessun
lavoro perso.
