---
name: weekly-kickoff
description: Automatizza il kickoff settimanale di sviluppo per Mining-Tech-Platform. Usa questa skill quando l'utente chiede di avviare/riavviare la settimana di lavoro, rigenerare vault/ROADMAP_SETTIMANA.md, o riarmare la Cloud Routine di sviluppo automatico settimanale. Trigger tipici: "kickoff settimanale", "avvia la settimana", "riarma la routine di sviluppo", "/weekly-kickoff".
---

# Weekly Kickoff

Prepara la settimana di sviluppo: rigenera la roadmap, scrive un checkpoint di
avvio e sostituisce la Cloud Routine automatica della settimana precedente con
una nuova, così le sessioni automatiche che partono nei giorni successivi
sanno sempre cosa fare e da dove riprendere.

Esegui i passi in ordine. Non saltare la pulizia della routine precedente:
se non viene rimossa, restano due routine attive che duplicano il lavoro.

## 1. Determina la settimana corrente

Usa `date` in bash per ottenere la data odierna e calcolare lunedì-venerdì
della settimana corrente (`date -d monday`, o se oggi è lunedì usa oggi).
Serve per intestare la roadmap e nominare il checkpoint di kickoff.

## 2. Scrivi/aggiorna `vault/ROADMAP_SETTIMANA.md`

Questo file rappresenta **solo la settimana in corso**: va sovrascritto ad
ogni kickoff (non è append-only, a differenza dei checkpoint).

- Se `vault/ROADMAP_SETTIMANA.md` esiste già ed è rimasto materiale non
  completato dalla settimana precedente (task senza `[x]`), riportalo in
  cima alla nuova roadmap invece di perderlo: chiedi il contesto necessario
  leggendo l'ultimo checkpoint (vedi punto 3) prima di scrivere.
- Se l'utente ha indicato obiettivi per la settimana in questa conversazione,
  usali. Altrimenti deriva gli obiettivi dai task ancora aperti nell'ultimo
  checkpoint disponibile. Se non c'è alcun contesto pregresso, crea una
  roadmap con la sola intestazione e una nota che invita a popolarla.

Schema del file:

```markdown
# Roadmap Settimana — {lunedì} → {venerdì}

## Obiettivi della settimana
- [ ] Obiettivo 1
- [ ] Obiettivo 2

## Task
- [ ] Task granulare 1
- [ ] Task granulare 2

## Vincoli
- Non pushare mai su main senza autorizzazione esplicita.
- Commit piccoli e frequenti; un checkpoint per ogni unità completata.

## Riferimenti
- Ultimo checkpoint: vault/checkpoints/<file più recente>
```

## 3. Crea il checkpoint di avvio in `vault/checkpoints/`

I checkpoint sono **append-only**: non modificare né sovrascrivere mai un
checkpoint esistente, crea sempre un file nuovo. Il nome del file deve
iniziare con un timestamp ordinabile lessicograficamente, così "l'ultimo
checkpoint" è sempre il file con nome più alto in ordine alfabetico:

```
vault/checkpoints/YYYYMMDD-HHMMSS_kickoff.md
```

Contenuto del checkpoint di kickoff:

```markdown
# Checkpoint — {timestamp ISO}

## Tipo
kickoff

## Branch
{branch di sessione corrente}

## Ultimo commit
{hash breve, `git rev-parse --short HEAD`}

## Stato roadmap
Nuova settimana avviata ({lunedì} → {venerdì}). Vedi vault/ROADMAP_SETTIMANA.md.

## Prossimi passi
{primo task della roadmap, o "nessuno, roadmap da popolare"}

## Note
{eventuale contesto riportato dalla settimana precedente}
```

## 4. Rimuovi la Cloud Routine della settimana precedente

1. Chiama `list_triggers` e cerca la routine con nome esatto
   `Weekly Dev Session` (nome fisso, riusato ogni settimana — non generarne
   uno nuovo con la data dentro, altrimenti la ricerca fallisce la settimana
   dopo). Cerca anche eventuali routine legacy con nome che inizia per
   `weekly-build-mining-tech` (naming della prima settimana).
2. Se esiste, chiama `delete_trigger` con il suo `trigger_id` prima di
   crearne una nuova. Se ne trovi più di una (es. da run manuali passati),
   eliminale tutte.
3. Se non esiste nessuna routine con quel nome, procedi comunque al punto 5
   (prima attivazione).

## 5. Arma la nuova Cloud Routine

Chiama `create_trigger` con:

- `name`: `Weekly Dev Session` (stesso nome fisso, per permettere la pulizia
  la settimana successiva)
- `cron_expression`: `0 */5 * * 1-5` (lunedì-venerdì, ogni ~5 ore)
- `create_new_session_on_fire`: `true`
- `notifications`: `{"push": true}`
- `prompt`: **esattamente** il testo seguente (non parafrasare, non
  abbreviare — è il contratto che tiene allineate le sessioni automatiche):

```
Leggi vault/ROADMAP_SETTIMANA.md e il checkpoint più recente in
vault/checkpoints/ (il file con il timestamp più alto nel nome) per capire
lo stato del lavoro e cosa fare adesso.

Lavora a piccole unità: scegli il prossimo task non completato dalla
roadmap, implementalo, esegui commit frequenti e atomici con messaggi
chiari.

Al completamento di ogni unità di lavoro:
1. Aggiorna vault/ROADMAP_SETTIMANA.md spuntando i task completati.
2. Crea un NUOVO file in vault/checkpoints/ con schema
   YYYYMMDD-HHMMSS_<slug-breve>.md — non modificare né sovrascrivere MAI un
   checkpoint esistente. Includi: tipo (unit-complete), branch, hash
   dell'ultimo commit, cosa è stato completato, stato aggiornato della
   roadmap, prossimi passi, eventuali blocchi.

Non pushare MAI su main senza autorizzazione esplicita dell'utente in
questa conversazione: lavora e pusha solo sul branch di sessione
designato.

Se la roadmap non ha più task aperti, non inventarne di nuovi: crea un
checkpoint che segnala la roadmap esaurita e fermati.
```

## 6. Commit e push

Fai commit di `vault/ROADMAP_SETTIMANA.md` e del nuovo file in
`vault/checkpoints/` con un messaggio tipo `chore: weekly kickoff {lunedì}`,
poi pusha sul branch di sessione corrente. Non pushare su main.

Conferma all'utente: settimana coperta, checkpoint creato, routine
precedente rimossa (se c'era) e nuova routine armata con `trigger_id`.
