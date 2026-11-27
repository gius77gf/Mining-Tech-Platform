# Checkpoint — 2026-09-15T12:52:27Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
019b2f34

## Cosa è stato completato
Tredicesima unità del ciclo odierno: `testoSollecito` (Conti) ora RIUSA
`livelloSollecito(ritardo)` per far variare l'oggetto e il tono della
lettera con l'escalation del ritardo — livello 1 invariato, livello 2
("secondo sollecito") menziona la comunicazione precedente, livello 3
("ultimo avviso") avvisa di messa in mora formale e recupero del credito.
I numeri (interessi di mora, riepilogo) restano identici a ogni livello.

Chiude il finding 1 del settimo giro di ricerca su Conti (15/09), tornato
dal background durante l'unità precedente. **Le quattro affermazioni
dell'agente sono state riverificate di persona** prima di entrare in
`docs/RICERCA_CONTINUA_CONTI.md`: 3 confermate (escalation, nessuno
scoring cliente, nessun export mirato oltre-90), **1 smentita** — la
riconciliazione bancaria (finding 3) che l'agente diceva "per posizione
fissa, TRN/CRO mai catturato" esiste già dal 05/09 (`mappaMovimentiCsv`,
`riferimentoInCausale`/`riferimentoMovimento`), perché il suo worktree
era ancorato a un commit molto più vecchio del branch reale — l'agente
stesso l'aveva dichiarato come rischio. Un secondo agente indipendente ha
poi riletto e confermato la mia riverifica.

Test: `run-kpi.mjs` +1 blocco, con controprova (rimossa la variazione
dell'oggetto per livello, confermata la caduta al livello 3, ripristinata
e riverificata byte-identica con `diff`).

## Verifica
- `run-stile.mjs` e `sintassi-pagine.mjs` (giro completo): puliti prima
  del giro isolato — e la falsa violazione da 16 pagine vista due unità fa
  (il worktree dell'agente di ricerca su Conti) è sparita da sola dopo la
  rimozione del worktree
- Giro isolato su worktree pulita (`/tmp/wt-conti-sollecito`, ora
  rimossa): 39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni invariata (1004/1004): nessuna funzione nuova, solo
  un cambio interno a una funzione esistente — misurato, non assunto
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1004/1004
- Worktree rimossa con `git worktree remove --force` + `git worktree prune`
  (anche quella dell'agente di ricerca, dopo aver estratto tutto il
  necessario dal suo diff)
- Push riuscito al primo tentativo: `d6effd82..019b2f34`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Tutti e quattro i giri di ricerca aperti
in questo ciclo sono ora chiusi o parzialmente chiusi con le parti
economiche fatte: Flotta (chiuso), Sentinella (chiuso), Terra (chiuso),
Campo (chiuso), Conti (1 finding su 3 disponibili fatto, 1 medio aperto, 1
grande in attesa di decisione del fondatore). Nessun giro di ricerca è
ancora stato aperto una SECONDA volta su nessuna app in questa sessione.

## Prossimo passo atomico
Scegliere fra: (a) tradurre in codice il finding 4 di Conti (export
mirato sulle fatture oltre-90-giorni, costo "medio" per la stima
dell'agente — riverificare comunque la stima prima di iniziare); (b)
avviare un ottavo giro di ricerca continua in background su un'app già
coperta ma per un secondo passaggio più approfondito (la direttiva del
fondatore lo prevede quando la roadmap sembra esaurita: "approfondimenti
secondo passaggio delle schede ricerca"); (c) passare a una revisione di
qualità/estetica di seconda iterazione su una delle app, con screenshot,
come da lista di fallback di CLAUDE.md quando i finding di ricerca sono
esauriti. Data l'ora avanzata del ciclo (iniziato la mattina, ora
pomeriggio), propendere per (a) come prossima unità piccola e concreta,
poi valutare se restano crediti per (b) o (c).
