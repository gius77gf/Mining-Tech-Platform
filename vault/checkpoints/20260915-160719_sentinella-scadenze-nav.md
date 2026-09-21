# Checkpoint — 2026-09-15T16:07:19Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
74c465dc

## Cosa è stato completato
Ventiquattresima unità del ciclo odierno: chiusa una voce aperta e non
bloccata della roadmap — «Adempimenti» → «Scadenze» nella barra in basso
di Sentinella, l'unica strada dichiarata per portare i bersagli di tocco
a 320px sopra i 44px richiesti (erano 41,4). La sezione a cui il bottone
porta si chiama già «Scadenze ambientali»: il pulsante diceva una parola
diversa dalla propria sezione, oltre a essere quella che teneva stretta
tutta la barra. Rinominato a «Scadenze», la parola che Scudo e Flotta
usano già per lo stesso concetto.

Misurato con Playwright (non stimato per proporzione): bersagli di tocco
a 320px saliti da 41,4 a 45,61–46,86 px. `barra-etichette.mjs
--solo=sentinella` (il banco scritto apposta per questa domanda): 0 fuori
posto, 0 tagliate, alle quattro larghezze.

Durante il ciclo è arrivata la routine "Weekly Dev Session" (canary):
gestita per prima cosa, come da protocollo — `git pull` (già allineato),
`vault/ULTIMO_CICLO.md` aggiornato con `date -u` reale, commit `canarino:`
separato e pushato PRIMA di riprendere l'unità in corso, senza mescolare
i due commit.

## Verifica
- `run-kpi.mjs`: 3021 passati, 0 falliti
- `run-stile.mjs`: 328 passati, 0 falliti
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, copertura 1012/1012
  (caduto una volta durante l'unità per l'indice "voci APERTE" della
  roadmap disallineato dal checkbox appena chiuso — corretto)
- Controprova sulla riga corretta: vecchia forma rimessa, confermata la
  caduta, ripristinato byte-identico
- Giro isolato su worktree (ora rimossa): 40/40 comandi a posto,
  «asserzioni eseguite dal giro»: 3971 (misurato fresco)
- Push riuscito al primo tentativo, sia per il canarino sia per l'unità:
  `3a236d98..291d8c61` e `291d8c61..74c465dc`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. La voce «Adempimenti» chiusa e tolta
dall'indice. Resta da riverificare di persona (non sulla parola
dell'agente) la ricerca appena tornata da un agente in background su
Sentinella — attribuzione delle modifiche (`docs/RICERCA_CONTINUA_SENTINELLA.md`,
settimo giro, 1010→1089 righe, non ancora committata: modificata sul
disco, confermato dall'agente stesso di non aver eseguito nessun comando
git).

## Prossimo passo atomico
Riverificare di persona la ricerca sul settimo giro di Sentinella
(attribuzione delle modifiche — chi ha cambiato una soglia, non solo
quando) prima di scriverla in `DECISIONI_WEEKEND.md` o di implementare
qualunque cosa: rileggere `docs/RICERCA_CONTINUA_SENTINELLA.md` dalla
sezione "## 15/09 — settimo giro", verificare con `grep` che
`correggiLettura`/`annullaLettura` (e ogni altra funzione citata) abbiano
davvero la firma dichiarata, prima di fidarsi — è la stessa disciplina
già pagata due volte oggi (`ppvAltezza` di Genesi non esisteva). Se la
ricerca regge: dato l'impatto (schema Firestore, SDK deepwork-id,
"chi" su ogni scrittura), è quasi certamente un candidato per
`docs/DECISIONI_WEEKEND.md` (tocca l'identità/autenticazione condivisa
fra tutte le app, non solo Sentinella) piuttosto che un'unità di codice
autonoma — verificare prima di decidere quale dei due.
