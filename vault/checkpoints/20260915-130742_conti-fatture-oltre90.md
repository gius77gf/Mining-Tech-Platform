# Checkpoint — 2026-09-15T13:07:42Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
44d709cc

## Cosa è stato completato
Quattordicesima unità del ciclo odierno: `fattureOltre90` (Conti) — l'elenco
delle fatture scadute da oltre 90 giorni, ordinato dal credito più vecchio,
base dichiarata per la decisione del commercialista su un fondo
svalutazione crediti (che il modulo NON calcola). RIUSA la stessa soglia
di `agingIncassi`: la classificazione per fascia è stata estratta in un
helper privato comune (`fasciaAging`), così le due funzioni non possono
divergere in silenzio. `csvFattureOltre90` esporta l'elenco, wired con un
bottone nella pagina Report accanto all'aging incassi.

Chiude il finding 4 del settimo giro di ricerca su Conti. **Il settimo
giro è ora chiuso su tutto ciò che si può fare senza una decisione del
fondatore** — resta aperto solo il finding 2 (scoring cliente), che
tocca come si presenta un giudizio su un cliente reale e quindi attende
`docs/DECISIONI_WEEKEND.md`, non un'unità automatica.

Test: `run-kpi.mjs` +2 blocchi (3008→3010), con controprova (invertito
l'ordinamento per ritardo, confermata la caduta, ripristinato e
riverificato byte-identico con `diff`). Aggiornato anche il censimento
"nessun export CSV resta senza marchio" (38→39 siti, hardcoded per
disegno — un export nuovo deve costringere qualcuno a guardarlo).

## Verifica
- `run-stile.mjs` e `sintassi-pagine.mjs` (giro completo): puliti prima
  del giro isolato
- Giro isolato su worktree pulita (`/tmp/wt-conti-oltre90`, ora rimossa):
  39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni 1004→1006 (+2: le due funzioni nuove, l'helper
  `fasciaAging` non è esportato e non conta — misurato)
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1006/1006
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
- Push riuscito al primo tentativo: `46d1963c..44d709cc`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Tutti e cinque i giri di ricerca aperti
in questo ciclo (Flotta, Sentinella, Terra, Campo, Conti) sono ora chiusi
su tutto ciò che era traducibile in codice senza una decisione del
fondatore. Restano in sospeso, tutti in attesa del fondatore: la
Decisione 30 (Deepwork ID), i quattro punti Genesi, e ora anche lo
scoring cliente di Conti. Nessun giro di ricerca è ancora stato aperto
una SECONDA volta su nessuna app in questa sessione.

## Prossimo passo atomico
Con tutti i finding di ricerca economici esauriti, la direttiva di
CLAUDE.md indica di proseguire nella lista "SE LA ROADMAP SEMBRA FINITA":
1) seconde iterazioni delle app verticali (CRUD mancanti, filtri,
validazioni, stati vuoti, UX/estetica con screenshot); 2) rimandati del
censimento; 3) test aggiuntivi sulle suite emulatore; 4) NUOVE
deep-research (secondo passaggio, più approfondito) su un'app a
rotazione. Data l'ora avanzata di un ciclo molto produttivo (14 unità),
la scelta più naturale per continuare senza fermarsi è avviare un
ottavo giro di ricerca continua in background su un'app già coperta
(rotazione: Sentinella o Scudo, le meno toccate finora in questa
sessione) per un secondo passaggio più approfondito, mentre in parallelo
si comincia una revisione di qualità/estetica di una singola app con
verifica visiva (screenshot), così il ciclo continua a lavorare su due
fronti come richiede la direttiva sui cantieri paralleli.
