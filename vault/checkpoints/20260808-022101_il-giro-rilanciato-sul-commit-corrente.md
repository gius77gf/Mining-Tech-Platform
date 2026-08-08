# Checkpoint — 2026-08-08T02:21:01Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e65d20e` — *Checkpoint della terza domanda sui moduli*

## Che cosa è stato completato

⛔ **Chiuso il rimandato più vecchio della notte**: il giro del browser girava
da ore su un `HEAD` di **oltre sessanta commit** fa, quindi il suo verde non
riguardava niente di quello che è stato scritto stanotte. Un giro vecchio non è
una prova, è un'opinione su un altro programma.

1. **Fermato quello vecchio** (pid 7002, porta 8823). ⚠️ E non solo perché era
   invecchiato: un server rimasto vivo dopo un giro ucciso **continua a
   rispondere sulla sua porta con una cartella che non esiste più**, e il giro
   dopo misura quella — è il difetto che il 07/08 è costato un giro intero e
   ventidue KO immaginari.
2. **Rilanciato sul commit corrente**, porta **8831**, uscita in
   `scratchpad/io-core/giro-6.txt`. La prima riga lo dichiara da sé:

       ▶ Il giro sta girando su una COPIA di e65d20e (il committato), non sulla
         cartella viva. Niente di non committato: la copia è identica.

⚠️ **E il conto dei processi ha rifatto lo scherzo di sempre**: `pgrep -f
"tutti.mjs"` ha risposto «ancora vivo» trovando **sé stesso** nella riga di
comando. È scritto in CLAUDE.md da giorni e ci sono ricascato: `pgrep -af` lo
mostra in chiaro, e la risposta giusta era «nessun giro attivo».

## Come si raccoglie (per chi riprende)

`node apps/deepwork-id/tests/browser/tutti.mjs 8831` — dura decine di minuti.
Quando finisce, in coda a `giro-6.txt` c'è `USCITA <n>`.
⛔ **Ordine di lettura, non negoziabile:**
1. le righe **«non ho guardato»** — denominatori, superfici non raggiunte,
   «0 su N»: un rosso lo si vede, un «0 su 68» in fondo a una pagina di verde
   no, e quella è la riga che nel 03/08 nascondeva il core intero;
2. **poi** i KO, distinguendo le **controprove**: lì il rosso è quello
   **voluto**, e l'intestazione lo dichiara («⚠️ CONTROPROVA: qui sotto il
   rosso è quello VOLUTO»). Non si indovina dal testo;
3. se il giro esce con **2**, si è dichiarato **non valido** da sé (qualcuno ha
   toccato i file che le pagine caricano mentre girava) e va rifatto.

## Prossimo passo atomico

**Raccogliere `giro-6.txt`** con l'ordine qui sopra, e aprire un cantiere solo
sui KO che restano dopo aver tolto le controprove.

Poi, i due rimandati aperti:

1. ⏱️ **La regola dei trattini su Flotta**, ferma a misura: i tre legittimi
   stanno **fuori da qualunque tabella** (le tessere «Consumo» e «Gasolio», e
   il conto dei giorni di un fermo senza data). La via che regge è dare a
   quelle tessere un'**intestazione leggibile dal DOM**, non allargare la
   regola — allargarla la renderebbe cieca dove serve.
2. ⏱️ **La terza domanda con la forma `nome` nuda** (non `${nome}`): oggi
   guarda solo dentro i template. Un `const x = pippo` fuori resta invisibile,
   e lì il rumore atteso è **molto** più alto — la misura va fatta prima e
   potrebbe dire di lasciar perdere, che è una risposta legittima.

## Blocchi
Nessuno.
