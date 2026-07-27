# Checkpoint — 2026-07-27T16:18:00Z

## Tipo
kickoff

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d52d473

## Stato roadmap
Nuova settimana avviata (**lun 27/07 → sab 01/08**), roadmap v5.0 "SALTO DI
QUALITÀ" in `vault/ROADMAP_SETTIMANA.md`, costruita sui risultati di **nove
ricerche lanciate in parallelo** su richiesta del fondatore.

Direttive del fondatore (26/07) recepite nella roadmap e nella routine:
1. **Lavoro in contemporanea su tutte e sei le app** (un cantiere per app:
   i file sono separati in `apps/<nome>/`, quindi niente conflitti; si
   serializza solo ciò che tocca `shared/`, `docs/`, `vault/`).
2. **Estetica del core copiata al 100%** su tutte le app, personalizzata
   solo nel colore dominante di ognuna.
3. **Niente revisione serale** come blocco fisso: al suo posto ricerca e
   sviluppo continui; la qualità si tiene con verifiche dentro ogni unità.
4. **Ricerca continua e approfondita**, con secondi passaggi a rotazione.
5. **Cura nei minimi dettagli** (stati vuoti, validazioni, messaggi).

## Ricerche depositate
`docs/RICERCA_{SCUDO,CAMPO,FLOTTA,CONTI,SENTINELLA,TERRA,GENESI}_202607.md`
(commit `3ab95f1`). Ogni scheda: inventario onesto del codice esistente, gap
verso competitor e obblighi di legge italiani, tabella proposte con
difficoltà e priorità, fonti con link, e la distinzione esplicita fra ciò
che possiamo fare **gratis** e ciò che richiederebbe una spesa.

**Difetti reali trovati nel codice** (non solo funzioni mancanti) → Blocco 1
della roadmap, prioritario su ogni funzione nuova:
- Campo: attività e rapportini **senza data né turno** (nessuno storico
  possibile); produzione come testo libero non sommabile; **il piano di
  carico si perde al refresh**.
- Conti: cliente come testo libero → **duplicati che falsano** esposizione
  ed estratto conto.
- Sentinella: lo **storico letture esiste nei dati ma non è visualizzato**.
- Flotta: **scadenze di legge dei mezzi del tutto assenti**.
- Terra: volume da visore che **somma scavo e cumulo** (difetto concettuale).
- Genesi: dice "quanto" ma non dice "**dove**" (medie globali invece di
  mappe per foro).

## Lavoro già completato oggi (prima del kickoff)
- **PR #321 unita in main** (`5a4c5b6`): 121 commit, 149 file, CI verde.
- Genesi **A1** editor del fronte 3D (`af9d6aa`), **A2** colonne di carica
  segmentate coi deck e gli inneschi (`c966d45`), **A3** mappa delle quote
  (`64c08cf`) — tutte verificate con interazione reale in Chromium.

## Prossimi passi
**Primo task: Blocco 0 — E0**, allineare `shared/deepwork-style.css` al core
seguendo `docs/SPECIFICA_ESTETICA_CORE.md`. Va fatto **per primo e da solo**
(tocca `shared/`, condiviso da tutte le app); subito dopo le passate per app
E1–E6 possono partire **in parallelo**, una per app.
In parallelo a E0, senza conflitti, si possono già avviare i task del
Blocco 1 (F1–F6), perché toccano file di app distinti.

## Blocchi / attese
- `docs/SPECIFICA_ESTETICA_CORE.md` e `docs/RICERCA_DEEPWORKID_202607.md`
  erano ancora in scrittura al momento di questo checkpoint: **verificarne
  la presenza** prima di iniziare E0 e Q1.
- Fondatore: progetto Firebase (10 min), prova drone, via libera alle curve
  di sicurezza, nuova PR verso main.

## Routine
Routine precedente rimossa. Nuova **Weekly Dev Session** armata:
`trig_019vFdJ5wA2hgk1J9ZS86nnW`, **ogni 3 ore, lunedì→sabato**, sessione
nuova a ogni avvio, notifica push. Il prompt contiene le cinque direttive
del 26/07 e i vincoli invariati.
