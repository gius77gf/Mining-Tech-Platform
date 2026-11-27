# Checkpoint — 2026-09-19T12:00:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fb2ee7aa — fix(genesi): l'annulla premuto a metà di un trascinamento non azzerava il drag (G56b)

## Cosa è stato completato
Difetto vero trovato da un deep-pass QA in background sulle nove unità
G48-G56 (agente `ab16faa7af33ffe2b`), verificato indipendentemente col
codice prima di correggere (il fix proposto dall'agente era sbagliato di
dettaglio: suggeriva `D2.d2drag=-1` — `d2drag` NON è una proprietà di `D2`,
è una variabile del modulo dichiarata accanto; usare `D2.d2drag` avrebbe
creato una proprietà nuova e inutile senza toccare la variabile che
`d2Move` legge davvero).

- [x] `d2ApplySnap` (chiamata da Ctrl+Z/Ctrl+Y) rimpiazzava
      `D2.holes`/`profilo`/`piede` e azzerava la selezione, ma non
      `d2drag`/`d2dragPt`: un annulla premuto mentre il mouse è ancora giù
      su un trascinamento veniva silenziosamente sovrascritto dalla mossa
      successiva del mouse. Corretto azzerando anche quelle due variabili.
- [x] Banco `genesi-drag-annulla.mjs`: trascina un foro, preme Ctrl+Z col
      mouse ancora giù, continua a muovere — il foro deve restare dov'era
      stato riportato. 7/7 normale, 1 KO voluto in controprova (la prima
      stesura dell'iniezione era ancorata a un commento e non toccava il
      codice vero: corretta prima di fidarsene, verificando che la
      controprova fallisse davvero).
- [x] Verificate (senza azione) le altre tre aree di rischio segnalate
      dall'agente: `D2._sintesi` letto dagli export (sempre fresco, ricalcolato
      prima di ogni export — riscontro con `grep` sulle righe reali, non
      sulla parola dell'agente), `d2AlignGuide` con `D2.holes` vuoto (il
      ciclo non itera, nessun problema), `coordinataRelativa` con
      riferimento eliminato (già validato, restituisce un errore
      dichiarato).
- [x] Propagati i numeri in tutti e 4 i documenti tracciati (prove
      3.708→3.709, esecuzioni browser 449→451, file distinti 204→205,
      asserzioni del giro completo 4261→4263); corretta la tabella del
      cantiere di Genesi (estraibili 47→46: `d2ApplySnap` scivola da "una o
      due" a "più di dieci" per aver guadagnato le due variabili che ora
      azzera).

## Verifica prima del commit
`run-kpi.mjs`: 3211/3211. `numeri-nei-documenti.mjs`: 43/43. **Giro
completo (`giro-node.mjs`): 41 comandi a posto, 0 caduti, 4263
asserzioni — i documenti dichiarano lo stesso numero.** Rilanciati
`genesi-d2-undo.mjs` (8/8), `genesi-guida-allineamento.mjs` (8/8),
`genesi-snap-estremo.mjs` (8/8), `genesi-selezione-multipla.mjs` (14/14),
`genesi-rifletti-selezione.mjs` (7/7), `genesi-undo-limite.mjs` (6/6),
`genesi-input-relativo.mjs` (8/8): nessuna regressione.

## Stato roadmap
Chiuso il primo (e finora unico) difetto reale trovato dal deep-pass QA
sulle nove unità G48-G56. Le altre tre aree indagate dall'agente sono
verificate sicure. Tutte le priorità del censimento CAD di Genesi restano
costruite o dichiarate (blocchi/simboli → Decisione #43 per il fondatore).

## Prossimi passi
- **Prossimo passo atomico**: controllare l'esito del giro completo del
  browser lanciato alle 09:51:33Z (PID 18070, `giro-completo-19-0951.log`
  nello scratchpad) quando arriva in fondo — è indietro di alcuni commit
  su `genesi.html` (compresi G56/G56b), quindi qualunque suo verdetto su
  Genesi va riletto col codice attuale prima di agire.
- Lanciare un nuovo fronte di ricerca Haiku in background su Genesi (un
  altro concorrente non ancora confrontato riga per riga, o una seconda
  passata QA su un'altra parte dell'app) per mantenere ≥3 fronti aperti,
  ora che sia lo snap magnetico sia la QA su G48-G56 sono chiusi.
- Continuare a verificare ogni pezzo di ricerca/QA contro il codice PRIMA
  di implementare — anche quando la diagnosi è giusta, il dettaglio della
  correzione proposta va sempre riletto (qui: `D2.d2drag` invece di
  `d2drag`).

## Blocchi
Nessuno.
