# Checkpoint — 2026-08-13 20:49 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`da76cf5f` — *Genesi: quattro documenti che escono dicevano zero dove nessuno
aveva scritto*

## Che cosa è stato completato

Genesi era **l'unica app rimasta fuori** dalla passata di oggi. Undici punti
d'uscita guardati uno per uno chiamando le funzioni coi casi limite: **sette
sani, quattro no** — e tre nel posto peggiore, il file che qualcuno legge
**dopo**.

1. **Il piano di innesco XML diceva «zero chili per foro» al software dei
   detonatori.** Il 09/08 la MIC ha imparato a dichiararsi invece di uscire
   `0.0`; **tre righe più giù** l'elemento della carica scriveva ancora `0`, per
   la stessa ragione. Il documento si contraddiceva da solo: dodici fori
   profondi zero metri caricati con zero chili, e sopra la dichiarazione che la
   MIC non si può contare *perché la carica non si legge*.
   ⛔ **E il giro di andata e ritorno faceva peggio che leggerlo**: il lettore
   controlla `charge != null`, e `parseFloat("0")` è **un numero**. Riaprendo
   quel piano tornavano **5 kg per foro, 6 m di profondità, 0,5 m di
   borraggio** — tre valori che nessuno aveva scritto, **senza un avviso**. Con
   l'elemento **vuoto** il ripiego non scatta (`parseFloat('')` è `NaN`): il
   giro si chiude senza toccare il lettore.
   > **Uno zero scritto in un file di scambio non è un buco: è un'istruzione
   > che il lettore accetta.** Il vuoto sì.
2. **«0 kg caricati» nel file che si archivia col rapportino**, su un
   consuntivo appena esportato da Campo: schermo «Carica reale totale **—**»,
   riga di storico e CSV **0**, su fori il cui progetto è **720 kg**. La
   bandiera esisteva dal 03/08 e la leggeva **solo lo schermo**: `riconSave` non
   la copiava nel record, quindi da lì in poi nessuno poteva più saperlo —
   guardia scollegata della regola 20, nel posto in cui il numero resta per
   sempre. ⚠️ **Porta di tastiera e larga**: il flusso previsto.
3. Il piano di carico per Campo scriveva la parola **`null`** in tre colonne su
   nove; le altre sei la regola la rispettavano già.
4. Il file `.volata.json` — quello con cui una volata **si riapre** —
   dichiarava fori profondi **zero metri**, con la carica accanto che diceva
   onestamente `null`.

## Le porte, senza fingere
Per 1, 3 e 4 il dato assente **non si raggiunge dalla tastiera**: la porta è
quella per cui esiste già `volataSenzaValori` — `apri` fa `Object.assign(D2, …)`
da `localStorage` senza controlli. **Stretta, dichiarata, la stessa per tutti e
tre.** Per il 2 è larga.

E sul «campione al posto del nominale» che `CLAUDE.md` racconta, il comando con
la sua uscita: `grep -coE '[0-9]+\.[0-9]{6,}'` sui tre file → **0, 0, 0**.
Nessuna ricaduta, e l'export scrive il **nominale**.

## Le misure
`run-kpi` **2103 → 2110**, 0 falliti; `copertura-funzioni` 11 soggetti a posto,
condivisi **169/169**; `numeri-nei-documenti` 41 — tutto sulla **copia di quello
che si committa**. Documenti: **2.555 → 2.562**, condivisi 168 → 169.
La controprova del cantiere gira nei **tre versi**: coi quattro difetti rimessi
cadono 5 prove su 7; col falsy al posto di `Number.isFinite` cade «uno zero
SCRITTO resta uno zero»; tolti i due decimali della maglia cade «byte per byte
come prima».

## ⚠️ Un numero letto al momento sbagliato
Il cantiere ha riferito che il giro `node` eseguiva **2840** asserzioni contro
le **2.881** dichiarate. Non è una regressione e non va scritto nei documenti
così: quel conto è stato preso su un albero in cui **`numeri-nei-documenti` era
rosso**, e una suite che fallisce **dichiara meno asserzioni**. È la stessa
famiglia del «conto letto al momento sbagliato» — un totale misurato mentre
qualcosa è rotto è un totale che non esiste. La misura vera sta girando **sulla
copia di quello che si è committato**, ed è la sola che può entrare nei
documenti.

## Che cos'è vivo adesso
- **Cantiere sul core** (B0-vicies + B0-unvicies): sta ancora misurando.
- **Il giro del browser** su `d3653ec`: alle 20:24 diciotto passate, vivo e in
  crescita (verificato **sul processo**, non sul file: figli Chromium freschi e
  CPU che sale). Non finirà dentro questo ciclo, ed è una scelta dichiarata: la
  sua parte lenta è anche quella che stasera ha reso di più.

## Prossimo passo atomico
**Leggere** il totale del giro `node` dalla copia e scriverlo nei due documenti
che lo dichiarano (`DEVELOPMENT.md` e `STATO_PRODOTTO.md`, oggi **2.881**), poi
rilanciare il giro per farsi dire dalla sua sorveglianza che i numeri tornano —
il segno è la sparizione della riga «⛔ ma i numeri scritti nei documenti NON
tornano». Poi raccogliere il cantiere sul core, e aprire **B0-duovicies** (i
sette contrasti non testuali) con la causa già in mano.

## Blocchi
- **Force-with-lease sul ramo**: la CI resta rossa su **quella riga sola**.
- **B0-septies** e le **soglie di sicurezza**: fermi al fondatore.
