# Checkpoint — 2026-09-18T06:12:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0cfcd718

## Cosa è stato completato
Terzo difetto confermato corretto in questo blocco (dopo Genesi e Flotta):
Deepwork ID, dirottamento cross-org di un invito pendente — CRITICO, rompe
l'isolamento multi-tenant che è il requisito fondante del prodotto (clienti
spesso concorrenti fra loro). La regola Firestore sull'update di
`invites/{inviteId}` controllava solo `isAdmin(resource.data.orgId)` (l'org
di PRIMA della scrittura), senza vincolare l'org NUOVA: un admin di orgA
poteva cambiare l'`orgId` di un proprio invito pendente in orgB con una
scrittura diretta, e `acceptInvites` si fida ciecamente di `inv.orgId` —
l'invitato, accettando, entrava in orgB con piena lettura/scrittura.
Corretto rendendo `orgId` immutabile sull'update
(`request.resource.data.orgId == resource.data.orgId`). Due nuovi test in
`run.mjs` (il dirottamento fallisce; un update legittimo senza toccare
l'org, es. il ruolo, continua a funzionare). Rilanciata l'intera suite delle
regole sull'emulatore Firestore, sia sulla copia isolata (worktree) sia sul
disco: **93 passati, 0 falliti** (era 91). Giro `node` completo confermato
verde: 41/41, 4122 asserzioni, numeri nei documenti sincronizzati (91→93,
139→141 in tre documenti).

Il fix è minimo e chirurgico: non è stata aggiunta validazione lato
`acceptInvites`, perché con l'immutabilità garantita dalla regola
`inv.orgId` è già affidabile per costruzione (creato solo da un admin
dell'org che dichiara, mai più modificabile dopo).

## Stato roadmap
Difetti confermati e ancora da correggere/committare, in ordine:
1. **Scudo, entrambi i difetti dal quarto giro di deep-pass** — PRONTI per
   il commit (già scritti e verificati con controprova nel working tree,
   solo da isolare in worktree e passare dal giro):
   - `abilitazioneLavoratore`/`pillReq` non gestivano il ramo "senza data";
   - `csvRegistroInfortuni` non esportava categoria/gravitaPotenziale/
     anonimato del near-miss (persi su export→reimport).
2. **Conti**, due difetti dal quinto giro di deep-pass
   (a8b791e876bd4d072), NON ancora corretti — vedi checkpoint
   20260918-045355 per i dettagli completi:
   - una fattura "come non emessa" (scartata dallo SdI) resta credito vero
     in sei funzioni (kpiFrom, agingIncassi, fattureOltre90,
     esposizioneClienti, avvisoFidoPesata, concentrazionePortafoglio);
   - `rigaPesata` non applica mai gli scaglioni di quantità, a differenza
     di `rigaPreventivo` — il più delicato, tocca un prezzo di vendita.

## Prossimo passo atomico
1. **Committare Scudo (entrambi i difetti insieme)**: costruire una
   worktree isolata da `HEAD` copiando `apps/scudo/scudo-data.js`,
   `apps/scudo/index.html`, `apps/deepwork-id/tests/run-kpi.mjs`,
   `apps/deepwork-id/tests/browser/scudo-documenti.mjs`,
   `shared/deepwork-id-client/dw-shell.js`. **Attenzione ai numeri**: KPI
   3129→3131 (due nuovi test), quindi la somma delle nove suite passa da
   3.623 a **3.625** e l'asserzioni-totale del giro `node` sale di 2 (da
   4122 a un valore da VERIFICARE col giro, non indovinare — nessun banco
   browser nuovo, quindi banchi/file restano 343/151). Le righe doc con
   questi numeri sono **già scritte correttamente nel working tree
   attuale** (verificate con `numeri-nei-documenti.mjs`, 43/0): basta
   copiarle nella worktree isolata così come sono.
2. Poi Conti: prima la fattura SdI-come-non-emessa (sei funzioni), poi gli
   scaglioni su `rigaPesata` — quest'ultimo il più delicato, verificare con
   cura come vengono trattati i DDT già emessi.
3. Continuare a dare priorità al fix del backlog rispetto a nuove scoperte
   di ricerca.

## Blocchi
Nessuno.
