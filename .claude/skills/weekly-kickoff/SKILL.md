---
name: weekly-kickoff
description: Avvia il ciclo settimanale di sviluppo automatizzato su Mining-Tech-Platform. Scrive/aggiorna la roadmap nel vault, crea il checkpoint di avvio, rimuove la routine della settimana precedente e arma la nuova Cloud Routine (lun-ven, ogni ~5 ore). Da invocare manualmente la domenica sera dopo aver definito la roadmap con l'utente.
disable-model-invocation: true
allowed-tools: Write, Edit, Bash, Read
---

# Weekly kickoff

Procedura fissa da eseguire ogni volta che questa skill viene invocata (tipicamente domenica sera). Segui i passi in ordine, senza saltarne nessuno.

## 0. Argomenti

Se `$ARGUMENTS` contiene testo, trattalo come contenuto grezzo della roadmap della settimana (l'utente l'ha incollata al comando). Se è vuoto, assumi che `vault/ROADMAP_SETTIMANA.md` sia già stato scritto/aggiornato in questa stessa conversazione prima di invocare la skill.

## 1. Scrivi/aggiorna `vault/ROADMAP_SETTIMANA.md`

Tutto il materiale destinato ad essere letto anche da Obsidian vive dentro la cartella `vault/` del repo (così l'utente può aprire quella sola sottocartella come vault Obsidian, tenendola separata dal codice).

Struttura richiesta per ogni voce della roadmap:
- descrizione del task
- tag `[sequenziale]` oppure `[parallelo-gruppo-N]` (stesso N = task eseguibili insieme in un Workflow perché indipendenti tra loro; non taggare come parallelo task che dipendono l'uno dall'altro)
- taglia stimata: S / M / L
- stato: `da fare` / `in corso` / `fatto`

Se il file esiste già da settimane precedenti, non cancellarlo: archivia la sezione conclusa in fondo sotto "Storico" (o in `vault/roadmap-storico/<data>.md`) e scrivi la nuova sezione attiva in cima. Non riscrivere mai la cronologia già archiviata.

## 2. Prepara la cartella checkpoint: `vault/checkpoints/`

**Non esiste più un unico file di stato che viene sovrascritto.** Ogni unità di lavoro completata produce un **nuovo file, mai sovrascritto** (schema "segnalibro"):

```
vault/checkpoints/<AAAA-MM-GG>_<HHmm>_<slug-task>.md
```

Contenuto minimo di ogni checkpoint:
```
# Checkpoint — <data/ora>
Task completato: <descrizione>
Commit di riferimento: <hash>
Prossimo passo atomico: <descrizione precisa>
```

A questo passo della skill, crea solo il checkpoint di avvio settimana:
`vault/checkpoints/<data-di-oggi>_avvio-settimana.md`, con "Prossimo passo atomico" = primo task in cima a `ROADMAP_SETTIMANA.md`. Non toccare i checkpoint delle settimane precedenti: restano come storico consultabile (eventualmente spostali in `vault/checkpoints/archivio/<settimana-precedente>/` per tenere la cartella corrente leggera).

Il "segnalibro corrente" per riprendere il lavoro è sempre **l'ultimo file per data/ora presente in `vault/checkpoints/`** (esclusi gli archivi).

## 3. Rimuovi la routine della settimana precedente

Usa `list_triggers` (tool `mcp__Claude_Code_Remote__list_triggers`, caricalo via ToolSearch se non è già disponibile) e cerca una routine con nome che inizia per `weekly-build-mining-tech`. Se esiste, eliminala con `delete_trigger` prima di crearne una nuova, per evitare routine duplicate o orfane.

## 4. Arma la nuova Cloud Routine

Crea una routine con `create_trigger` (ToolSearch `select:mcp__Claude_Code_Remote__create_trigger` se serve):
- `name`: `weekly-build-mining-tech-<data di oggi>`
- `cron_expression`: ogni ~5 ore, solo lunedì-venerdì, ancorato il più possibile all'orario di invocazione di questa skill (calcola tu gli orari in base all'ora corrente; se non cade su un multiplo esatto, scegli lo schedule a orari fissi più vicino — es. 4 fasce/giorno — e segnalo all'utente nel riepilogo finale)
- `create_new_session_on_fire`: true
- `notifications`: `{push: true}` (l'utente vuole poter controllare da telefono quando vuole)
- `prompt`: il testo fisso qui sotto, **non modificarlo** tra una settimana e l'altra:

```
Leggi vault/ROADMAP_SETTIMANA.md. Poi leggi la cartella
vault/checkpoints/ e individua il file più recente per data/ora
(esclusa l'eventuale sottocartella archivio): quello è il segnalibro
corrente. Riprendi esattamente dal "Prossimo passo atomico" indicato
in quel checkpoint.

Se il task fa parte di un gruppo [parallelo-gruppo-N], valuta se
eseguirlo con lo strumento Workflow insieme agli altri task dello
stesso gruppo. I task [sequenziale] vanno fatti uno alla volta,
nell'ordine della roadmap.

Lavora a unità piccole con commit frequenti e messaggi chiari. Al
completamento di OGNI unità di lavoro, crea un NUOVO file in
vault/checkpoints/ (mai sovrascrivere un checkpoint esistente) con:
task completato, hash del commit, prossimo passo atomico preciso.
Aggiorna anche lo stato del task corrispondente in
ROADMAP_SETTIMANA.md (da fare -> in corso -> fatto).

Se ti fermi per qualunque motivo, fermati sempre su un punto stabile
(commit pulito, checkpoint scritto per intero, nessun file a metà).
Non pushare mai su main senza istruzioni esplicite dell'utente per
questo repo; lavora sul branch indicato nelle istruzioni di progetto.
```

## 5. Riepilogo finale

Rispondi all'utente con: routine armata (nome, cadenza effettiva, prossimo orario di attivazione), percorso della roadmap e dell'ultimo checkpoint creato, e un promemoria che il weekend è dedicato alla revisione (leggendo la sequenza di checkpoint della settimana) + pianificazione della settimana successiva (si rilancia questa stessa skill la domenica sera dopo aver rifatto la roadmap insieme).
