# Checkpoint — 2026-09-14T13:43:34Z

## Tipo
unit-complete (revisione di qualità: difetto reale trovato e corretto, banco browser nuovo)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Secondo passaggio di verifica su G38 (obiettivo di pezzatura) e G44
(confronta burden con MIC/PPV) — la regola dell'eccellenza pretende
almeno tre iterazioni, e la prima verifica di queste due funzioni era
uno screenshot fatto UNA volta nello scratchpad al momento di scriverle,
poi mai riaperto.

**Riaprendo il browser è saltato fuori un difetto reale**: la riga di
provenienza sotto la tabella "Confronta burden" scriveva

    Stima dal modello di Kuznetsov (Kuz-Ram) e da da litologia (Calcare), …

— una parola doppia. Causa: `provenienzaPpv().breve` include già "da "
quando la fonte è la litologia (`'da litologia (…)'`, genesi-data.js
riga 395); `genesi.html` anteponeva un secondo "e da " prima di
scriverlo (riga 3711). **Corretto togliendo il "da" superfluo nel solo
chiamante che lo duplicava**, non nel campo condiviso `breve`: altri tre
punti della pagina (righe 3407-3410, 3547, 4200) lo usano da solo, dove
"da litologia (…)" legge già bene — toccare il campo avrebbe rotto quei
tre.

**E lo strumento di misura non è tornato nello scratchpad**: scritto
`apps/deepwork-id/tests/browser/genesi-obiettivo-burden.mjs` e
registrato in `tutti.mjs` (due voci: la passata e la sua controprova).
Segue il pattern già stabilito (PID-mark sul server, `DIFETTI` per la
controprova, progetto aperto da una volata SALVATA con valori che non
somigliano ai default). Due scelte di disegno degne di nota:
- la parola doppia si prende con un controllo **generale**
  (`/\b(\w+)\s+\1\b/i` su ogni testo mostrato), non cercando "da da" per
  nome — un controllo che cerca la stringa di oggi non prende quella di
  domani;
- MIC e PPV nella tabella si controllano **monotonicamente crescenti**
  col burden, non solo "non vuoti": un banco che guardasse solo
  l'esistenza del testo non distinguerebbe nove numeri veri da nove
  numeri ripetuti.

## Cascata sui documenti

Il nuovo file di banco ha mosso due numeri sorvegliati che non avevo
previsto (presi da `numeri-nei-documenti.mjs`, non a occhio): i banchi
del browser (`tutti.mjs`) 277→**279** (due voci nuove: passata +
controprova) e i file di banco distinti 118→**119**, corretti nei
quattro documenti/roadmap. Una SECONDA passata di verifica ha poi preso
un terzo scostamento — il giro completo `node` è salito da 3.909 a
**3.910** asserzioni, non per il banco browser (che non gira sotto
`node`) ma perché `suite-collegate.mjs` conta un'asserzione per ogni
file `.mjs` nuovo in `tests/`. Corretto in `DEVELOPMENT.md` e
`STATO_PRODOTTO.md`, poi riverificato su una worktree **ricreata da
zero** (non riusata) per la convergenza.

## Verificato

- Banco nuovo, diretto: **15 passati, 0 falliti**.
- Banco nuovo, `--controprova`: **15 passati, 1 fallito** (il KO atteso,
  sulla parola doppia), iniezione confermata 1/1, uscita 1 — il banco SA
  fallire.
- `sintassi-pagine.mjs`: 34/34. `run-stile.mjs`: 328/328.
- `numeri-nei-documenti.mjs`: 43/0, 279 banchi contati (dopo la
  cascata).
- Giro completo su worktree isolata, **ricreata due volte** (prima
  passata aveva scoperto il 3.909→3.910, seconda passata su worktree
  fresca lo conferma convergente): **40 comandi a posto, 0 caduti**,
  3910 asserzioni, addendi verificati.

## Stato roadmap

Nessuna voce di roadmap toccata (questa è una correzione di qualità, non
un'unità di prodotto nuova).

## Blocchi e limiti noti

Il banco nuovo NON è stato lanciato dentro il giro completo del browser
(che dura ore ed è riservato a fine blocco): verificato standalone nei
due versi, che è la misura giusta per l'aggiunta di UN banco, per la
regola del costo a scaglioni di CLAUDE.md.

## Prossimo passo atomico

Le due funzioni G38/G44 hanno ora una difesa che resta anche dopo questa
sessione. Prossimi candidati, nessuno legato al CAD: lanciare il giro
completo del browser (una volta per blocco, non ancora fatto in questa
sessione) per vedere se altre superfici toccate hanno difetti simili non
presi dai banchi `node`; oppure proseguire con G45/G46 se il fondatore
risponde sulla domanda CAD e libera altro tempo per decisioni di
prodotto; oppure una terza iterazione di verifica visiva su un'altra
funzione recente.

Nessuno stop volontario: si prosegue subito.
