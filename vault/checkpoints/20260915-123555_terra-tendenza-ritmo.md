# Checkpoint — 2026-09-15T12:35:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
82fc1463

## Cosa è stato completato
Dodicesima unità del ciclo odierno: `tendenzaRitmo` in
`apps/terra/terra-data.js`, chiude la terza e ultima lacuna del quinto
giro di ricerca su Terra. Confronta il ritmo degli ultimi 90 giorni con
quello di `ritmoMedioAnnuo` — un'accelerazione recente non resta più
nascosta fino al cumulato dell'anno. Refactoring pulito: il corpo comune
delle due funzioni (filtro solo-scavo, volume, durata, annualizzazione) è
stato estratto in un helper privato `ritmoNellaFinestra`, così non ci sono
due copie della stessa formula. Soglia dichiarata `TOLLERANZA_RITMO_PCT =
20`. Wired nel riquadro "Vita della cava", silenzioso quando la finestra
corta non ha abbastanza storico.

**Il quinto giro di ricerca su Terra (15/09) è ora chiuso su tutte e tre
le sue lacune** (varianzaMensilePiano, margineGiorni — già chiuso da
un'unità precedente — e tendenzaRitmo).

Test: `run-kpi.mjs` +1 blocco (3006→3007), con controprova (invertito il
segno accelera/rallenta, confermata la caduta, ripristinato e riverificato
byte-identico con `diff`). Include un'asserzione di identità
(`t.lungo.annuo === ritmoMedioAnnuo(...).annuo`) per garantire nel tempo
che il riuso resti tale e non diventi una copia debole.

## Verifica
- Giro isolato su worktree pulita (`/tmp/wt-terra-tendenza`, ora
  rimossa): 39/40 comandi a posto in prima battuta — l'unico caduto
  (`numeri-nei-documenti.mjs`) per i documenti non ancora aggiornati
- Copertura funzioni 1002→1004 (+2: la funzione più la sua soglia
  dichiarata, misurato — stessa convenzione già vista per
  `TOLLERANZA_CONSUMO_PCT`/`TOLLERANZA_COSTO_PCT`)
- Documenti aggiornati e ricopiati nella worktree, `numeri-nei-documenti.mjs`
  rilanciato lì: 43/0, copertura 1004/1004
- **Nota di processo**: `run-stile.mjs` lanciato a mano sul repository
  principale (non sulla worktree isolata) ha segnalato 16 pagine "non
  guardate" in `.claude/worktrees/agent-a44200e6c55d562e1/` — il worktree
  del settimo giro di ricerca su Conti, lanciato in parallelo con
  `isolation:"worktree"`. È il falso allarme già documentato in questa
  sessione: una `git worktree` isolata non porta con sé directory non
  tracciate, quindi il giro isolato di questa unità non lo vedeva. Si
  risolve da solo rimuovendo il worktree dell'agente a fine merge.
- Worktree della propria unità rimossa con `git worktree remove --force`
  + `git worktree prune`
- Push riuscito al primo tentativo: `dedec8ad..82fc1463`

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Sesto giro (Flotta) chiuso. Quinto giro
(Terra) chiuso. Quinto giro (Campo) chiuso. **Settimo giro (Conti) appena
tornato dal background** — report ricevuto: 4 lacune confermate
(escalation dei solleciti sempre uguale a ogni livello, nessuno
scoring/affidabilità cliente, riconciliazione bancaria per posizione di
colonna invece che per intestazione, export mirato sulle fatture
oltre-90-giorni per il commercialista), ma **con un avvertimento
esplicito dell'agente**: il suo worktree era ancorato a un commit molto
più vecchio (`91b23776`) di `conti-data.js` (6713 righe sul branch vero
contro una versione più corta nel suo checkout), quindi le lacune vanno
riverificate di persona contro il codice ATTUALE prima di scriverle nel
documento canonico — esattamente la disciplina "niente entra sulla parola
dell'agente" di CLAUDE.md, e in particolare il rischio già visto più
volte in questa sessione di lacune false perché il codice vero ha già la
funzione con un altro nome.

## Prossimo passo atomico
Riverificare di persona, sul `conti-data.js` REALE di questa sessione (non
sul worktree dell'agente), ciascuna delle 4 lacune riportate dal settimo
giro di ricerca su Conti — in particolare controllare se esistono già
`testoSollecito` con un livello che cambia il testo, un qualunque
concetto di scoring/rischio cliente, `mappaMovimentiCsv` o equivalente per
la lettura per intestazione dei CSV bancari — prima di scrivere qualunque
cosa in `docs/RICERCA_CONTINUA_CONTI.md`. Solo le lacune confermate vere
vanno scritte lì (in coda, mai sovrascrivendo), con la prova del grep
fatto sul codice vero. Poi tradurre in codice la più economica, con lo
stesso schema delle ultime unità (funzione pura + controprova + giro
isolato + cascata documenti). Infine rimuovere il worktree
`.claude/worktrees/agent-a44200e6c55d562e1` con `git worktree remove
--force` una volta estratto tutto il necessario dal suo diff.
