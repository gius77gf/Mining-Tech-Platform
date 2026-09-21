# Checkpoint — 2026-09-18T05:09:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
cf5dd6b4

## Cosa è stato completato
Secondo dei difetti confermati corretti in questo blocco: Terra,
`anniConVolumi` faceva entrare un anno fantasma da un rilievo a
calendario impossibile — ultima copia rimasta della guardia debole già
chiusa il 17-18/09 in `proiezioneAnnua`/`kpiFrom`/`varianzaLottoAnno`/Piano.
Corretto sostituendo `rilievoUsabile` con `rilievoUsabileConData`. Nuovo
test puro con controprova. Giro isolato (worktree a due strati: Conti da
solo, poi Conti+Terra insieme, verificato in entrambi i passaggi): 41/41,
3.623 prove, 4120 asserzioni.

Con questo si chiudono le due unità (Conti, Terra) preparate insieme nel
blocco precedente. Nel frattempo è stato scritto e verificato (con
controprova, nei due versi) anche il fix per Genesi (`D2.tratti` non
azzerato su "Apri"), ancora da committare.

## Stato roadmap
Difetti confermati e ancora da correggere/committare, in ordine:
1. **Genesi** (agente a4a466a27e1e80730): `D2.tratti` non azzerato su
   "Apri" — GIÀ SCRITTO e verificato con controprova nel working tree
   (`apps/genesi/genesi.html`, nuovo banco
   `genesi-tratti-non-persistono-su-apri.mjs`, registrato in `tutti.mjs`).
   Pronto per la verifica isolata e il commit.
2. **Flotta** (agente ade005a3e1c9bacf0): doppio invio silenzioso su
   `btn-rif`/`btn-cos`, nessun `occupato()`.
3. **Scudo** (agente a76e56f7569610db8), due difetti: `abilitazioneLavoratore`/
   `pillReq` senza il ramo "senza data"; `csvRegistroInfortuni` senza
   categoria/anonimato dei near-miss.
4. **Conti**, due nuovi difetti dal quinto giro di deep-pass (agente
   a8b791e876bd4d072), NON ancora corretti — vedi checkpoint
   20260918-045355 per i dettagli completi:
   - una fattura "come non emessa" (scartata dallo SdI) resta credito
     vero in sei funzioni (kpiFrom, agingIncassi, ecc.);
   - `rigaPesata` non applica mai gli scaglioni di quantità, a differenza
     di `rigaPreventivo`.

In arrivo (agente addc188f0a5cb5926, primo giro di deep-pass su Deepwork
ID, ancora in corso — non ancora tornato).

## Prossimo passo atomico
1. **Committare Genesi** (`D2.tratti`): il fix è già scritto e verificato
   nel working tree (`apps/genesi/genesi.html`, il nuovo banco browser, e
   la registrazione in `apps/deepwork-id/tests/browser/tutti.mjs` — tre
   file, nessuno in comune con `run-kpi.mjs`, quindi nessuna necessità di
   `hash-object`/layering: `git status` dovrebbe mostrare solo questi tre
   file). Costruire la worktree isolata, lanciare `giro-node.mjs`,
   aggiornare i numeri se il conteggio banchi/file cambia (sono state
   aggiunte 2 nuove esecuzioni: normale + controprova), commit,
   checkpoint, push.
2. Poi: Flotta (doppio invio), Scudo (due difetti), Conti (SdI-come-non-
   emessa, poi scaglioni su `rigaPesata` — quest'ultimo il più delicato,
   tocca un prezzo di vendita).
3. Leggere l'esito del giro di deep-pass su Deepwork ID quando arriva.
4. Continuare a dare priorità al fix del backlog rispetto a nuove
   scoperte, per non lasciarlo allungare ulteriormente.

## Blocchi
Nessuno.
