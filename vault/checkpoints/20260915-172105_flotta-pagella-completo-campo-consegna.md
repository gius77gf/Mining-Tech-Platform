# Checkpoint — 2026-09-15T17:21:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
824f1fc2

## Cosa è stato completato
Tre unità.

**Unità 33 — correzione al delta TCO di Flotta prima di scrivere la
seconda fetta.** Prima di implementare "ammortamento nel costo orario"
(mancanza n. 2 del settimo giro di ricerca), riletto il codice:
`costoOrarioMezzo` calcola già `euroOraPossesso`/`euroOraCompleto`
(possesso spalmato sulle ore/anno + esercizio) e lo mostra nel
fascicolo del mezzo. La mancanza era falsa. Trovato però un delta vero
e più stretto leggendo `pagellaMezzi`: il confronto FRA mezzi (che
alimenta `prioritaOperative`) usa solo il €/h di esercizio, mai il
completo — quindi un mezzo con canone alto ma poca officina appare "in
linea" nel confronto anche se il suo costo pieno è il più alto della
flotta. Corretto in coda al documento di ricerca.

**Unità 34 — implementata la correzione.** `pagellaMezzi` ora porta
`euroOraCompleto` su ogni riga (lo stesso numero di `costoOrarioMezzo`,
non un secondo conto) e la pagina lo mostra accanto al €/h di
esercizio, come già fa il fascicolo. Deliberatamente NON tocca
verdetto/scostamento/ordine: quale soglia usare sul costo pieno è una
decisione del fondatore, non tecnica — si espone il dato, si rimanda
la classificazione. Prova nuova con controprova; verificato che
verdetto/scostamento/ordine restano identici a prima dell'aggiunta
(stesso confronto fatto nel test "conPrimoPieno" esistente, riusato
come modello).

**Unità 35 — riverifica del sesto giro di ricerca su Campo** (consegna
di turno, confrontata con shift-handover del settore — MSHA, lockout
di gruppo, letteratura HSE su Piper Alpha/Texas City/Deepwater
Horizon). Tutti e tre i "non c'è" verificati di persona: `avvisi
ChiusuraTurno` non vede un'anomalia già documentata (causale+minuti
presenti) come "ancora da segnalare" — confermato anche sulla
dimostrazione stessa (tre anomalie complete che sfuggirebbero);
`lavoriNonConclusi` include le anomalie nella consegna ma senza
causale/minuti; zero conferme di ricezione per singola voce. Un mio
controllo iniziale sulla citazione di riga si è rivelato un mio
errore (avevo controllato il file sbagliato), non un errore
dell'agente — la citazione era esatta. Committato l'append, nessun
codice toccato.

Con questa il conto delle ricerche riverificate di persona oggi sale a
7 su 7 (6 vere as-is, 1 — la mancanza n. 2 di Flotta — corretta prima
di tradurla in codice).

## Verifica
- `run-kpi.mjs`: 3023 passati, 0 falliti (era 3022)
- `run-stile.mjs`: 328 passati, 0 falliti
- Controprova su `pagellaMezzi`: tolto `euroOraCompleto` dalla riga
  pushata, la prova nuova cade; ripristinato byte-identico
- `copertura-funzioni.mjs`: 0 funzioni scoperte (1013/1013, nessuna
  funzione nuova esportata: solo un campo in più su un oggetto)
- Giro isolato su worktree (`giro-node.mjs`, secondo lancio della
  sessione): 39/40 comandi a posto — l'unico caduto è il
  doc-cascade check, atteso, perché la worktree misurava PRIMA della
  correzione dei documenti. Misura reale "asserzioni eseguite dal
  giro": **3.930** (era stimato 3.929 poco prima, per una sola unità
  di differenza — misurato di nuovo invece di sommare a mente).
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti dopo la correzione
  finale della cascata
- Grep di riverifica su Campo: tre comandi rilanciati, uscita
  identica a quella citata dall'agente
- Push riuscito al primo tentativo su entrambi i commit:
  `bfec9751..eafc2b41`, `eafc2b41..824f1fc2`

## Stato roadmap
Flotta: il delta TCO ha ora due fette fatte (età del mezzo, costo col
possesso visibile nel confronto) e due ancora aperte (TCO storico
completo con ammortamento+manutenzione+downtime unificati; soglia di
sostituzione) — entrambe richiedono una decisione del fondatore su
quali soglie usare, non solo lavoro tecnico. Da proporre come voce in
`docs/DECISIONI_WEEKEND.md` quando si riprende quel filone.
Campo: il delta sulla consegna di turno è documentato con tre "non
c'è" verificati; la mancanza più cara (conferma per singola voce) è
dichiarata esplicitamente come tale, non nascosta in una lista di pari
peso.

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Tre strade aperte:
1. Scrivere una voce in `docs/DECISIONI_WEEKEND.md` per la soglia di
   sostituzione mezzi di Flotta (quanto deve costare in più un mezzo,
   in che periodo, prima di segnalarlo) — decisione del fondatore,
   sul modello delle voci #22-#24.
2. Chiudere la fetta più piccola del delta di Campo:
   `avvisiChiusuraTurno` che impari a contare le anomalie CON
   causale+minuti come "da guardare comunque" (non serve una nuova
   soglia, solo un terzo conteggio accanto ai due esistenti — stessa
   forma di `etaMezzo`, additiva e senza decisioni di soglia).
3. Lanciare un nuovo giro di ricerca in background (rotazione: Conti o
   Sentinella, i cui documenti di ricerca sono più vecchi di Campo e
   Deepwork ID ora che sono stati aggiornati oggi).
Se questa unità si esaurisce prima di scegliere, la prossima riparte
da qui. Il ciclo continua senza fermarsi (regola del fondatore, mai in
pausa).
