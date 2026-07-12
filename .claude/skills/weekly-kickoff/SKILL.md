---
name: weekly-kickoff
description: Avvia il ciclo settimanale di sviluppo automatizzato su Mining-Tech-Platform. Scrive/aggiorna la roadmap e il file di stato, rimuove la routine della settimana precedente e arma la nuova Cloud Routine (lun-ven, ogni ~5 ore). Da invocare manualmente la domenica sera dopo aver definito la roadmap con l'utente.
disable-model-invocation: true
allowed-tools: Write, Edit, Bash, Read
---

# Weekly kickoff

Procedura fissa da eseguire ogni volta che questa skill viene invocata (tipicamente domenica sera). Segui i passi in ordine, senza saltarne nessuno.

## 0. Argomenti

Se `$ARGUMENTS` contiene testo, trattalo come contenuto grezzo della roadmap della settimana (l'utente l'ha incollata al comando). Se è vuoto, assumi che `ROADMAP_SETTIMANA.md` sia già stato scritto/aggiornato in questa stessa conversazione prima di invocare la skill.

## 1. Scrivi/aggiorna `ROADMAP_SETTIMANA.md` (radice del repo)

Struttura richiesta per ogni voce:
- descrizione del task
- tag `[sequenziale]` oppure `[parallelo-gruppo-N]` (stesso N = task eseguibili insieme in un Workflow perché indipendenti tra loro; non taggare come parallelo task che dipendono l'uno dall'altro)
- taglia stimata: S / M / L
- stato: `da fare` / `in corso` / `fatto`

Se il file esiste già da settimane precedenti, non cancellarlo: archivia la sezione conclusa (es. in fondo sotto "Storico", o in `docs/roadmap-storico/` con la data) e scrivi la nuova sezione attiva in cima.

## 2. Resetta `STATO.md` (radice del repo)

Contenuto minimo:
```
# Stato — settimana del <data di oggi>
Ultima unità completata: (nessuna, ciclo appena iniziato)
In corso: —
Prossimo passo atomico: <primo task da ROADMAP_SETTIMANA.md>
```
Questo file va aggiornato dai cicli automatici DURANTE il lavoro, non solo a fine ciclo — è la chiave per riprendere con precisione se un ciclo si interrompe.

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
Leggi ROADMAP_SETTIMANA.md e STATO.md nella radice del repo.
Riprendi dal prossimo task non completato, o dal punto esatto segnato
come "in corso" in STATO.md. Se il task fa parte di un gruppo
[parallelo-gruppo-N], valuta se eseguirlo con lo strumento Workflow
insieme agli altri task dello stesso gruppo. I task [sequenziale] vanno
fatti uno alla volta, nell'ordine della roadmap.

Lavora a unità piccole con commit frequenti e messaggi chiari. Aggiorna
STATO.md ad ogni passo (non solo alla fine) indicando: ultima unità
completata, cosa è in corso ora nel dettaglio, prossimo passo atomico.

Se ti fermi per qualunque motivo, fermati sempre su un punto stabile
(commit pulito, nessun file a metà). Non pushare mai su main senza
istruzioni esplicite dell'utente per questo repo; lavora sul branch
indicato nelle istruzioni di progetto.
```

## 5. Riepilogo finale

Rispondi all'utente con: routine armata (nome, cadenza effettiva, prossimo orario di attivazione), percorso dei file roadmap/stato, e un promemoria che il weekend è dedicato alla revisione + pianificazione della settimana successiva (si rilancia questa stessa skill la domenica sera dopo aver rifatto la roadmap insieme).
