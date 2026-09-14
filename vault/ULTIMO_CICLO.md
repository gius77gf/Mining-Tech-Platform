# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 13:48 UTC
- **Commit di partenza**: `477ac992`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Non una ripresa da fermo: stessa conversazione col fondatore aperta dalle
09:47, nessuna nuova accensione della routine da quella delle 12:46. Sei
unità di lavoro completate da allora (dettaglio sotto), tutte committate
e pushate, working tree pulita.

⚠️ **Stato particolare, invariato**: il fondatore ha chiesto *"hai
riflettuto su come rendere Genesi simile ad un CAD?"*, gli è stata
rimandata una domanda di chiarimento (quale asse: precisione/snap,
layer, strumenti di disegno, o import/export CAD) — **non ha ancora
risposto**, oltre quattro ore. Finché non risponde, non si scompone né
si costruisce niente in quella direzione.

⚠️ **Direttiva del fondatore in conversazione, confermata ancora
valida**: concentrarsi SOLO sull'app Genesi.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA**: il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` resta bloccato sul fondatore
(`docs/DECISIONI_WEEKEND.md`, sezione 6). Le soglie USBM/DIN restano
un'altra decisione aperta (sezione 9). Nessuna delle due toccata.

## Cosa è successo dal canarino delle 12:47

1. **Backlog di ricerca continua su Genesi, riletto a fondo**: sei
   sezioni di `docs/RICERCA_CONTINUA_GENESI.md` verificate meccanismo
   per meccanismo (non sulla parola di chi le aveva scritte). Quattro
   già completamente chiuse (piano di tiro/dopo-volata, esplosivi in
   cava, limiti Kuz-Ram/powder factor — implementato il 12/09 citando
   proprio questa ricerca —, presplit/detonatori). Due delta reali
   trovati e **dichiaratamente non costruiti** per mancanza di dati
   sufficienti (decking/air-decking: i numeri del mondo riguardano un
   meccanismo fisico diverso da quello che Genesi implementa; diametro
   critico per tipo di esplosivo: la ricerca copre 2 categorie generiche
   contro un catalogo reale di 14 prodotti).
2. **Due voci "candidato, non preso" aggiunte alla roadmap** (G45 già
   c'era da un blocco precedente; nuova **G46**, frammentazione
   misurata via foto/image-analysis — non costruita perché tocca la
   regola SOLDI, decisione del fondatore).
3. **B3 (censimento estrazioni) aggiornata**: era ferma al 13/09 con 57
   estraibili; il lavoro G39-G43 di questo stesso blocco (già
   committato) l'aveva portata a 61 senza che la riga lo registrasse —
   chiuso il cerchio. Riletti anche i candidati residui (53 funzioni
   "una o due variabili"): quasi tutti sono già legami di una riga verso
   funzioni pure in `genesi-data.js`, il resto tocca DOM/canvas/THREE
   per costruzione — la colonna risulta sostanzialmente esaurita.
4. **Due errori miei, trovati con `git status`/i controlli automatici
   PRIMA del commit, non dopo**: un commit che aveva lasciato fuori due
   note già scritte (lo staging non riletto dopo un `Edit` successivo),
   e un `Edit` che aveva inghiottito la prima riga di una voce di
   roadmap successiva (preso da `numeri-nei-documenti.mjs`: indice
   disallineato di una riga). Entrambi corretti nello stesso blocco,
   documentati nei checkpoint.
5. **Un difetto vero di prodotto, trovato con una SECONDA verifica nel
   browser** (non fidandosi dello screenshot fatto al momento di
   scrivere G38/G44): la riga di provenienza sotto "Confronta burden"
   scriveva "e da **da** litologia (Calcare)" — parola doppia, causata
   da un "da" duplicato fra `provenienzaPpv().breve` e il chiamante.
   Corretto nell'unico punto che duplicava (non nel campo condiviso, che
   altri tre punti usano correttamente). **Scritto un banco browser
   nuovo** (`genesi-obiettivo-burden.mjs`, registrato in `tutti.mjs`)
   che copre G38 e G44 per la prima volta con una difesa che resta —
   prima esistevano solo verifiche scratchpad, perse alla sessione
   successiva.

**Sei unità + un canarino**, tutte committate e pushate, ognuna
verificata su worktree isolata (`giro-node.mjs`, 40/0) prima del commit,
con cascata sui quattro documenti sorvegliati dove serviva.

## In corso adesso

Il **giro completo del browser** (`tutti.mjs`, su una copia congelata di
`477ac992`) è partito alle 13:44Z in background — non lanciato prima in
questo blocco, ed è la verifica "una volta per blocco, alla fine" che
completa la revisione di qualità di oggi. Dura tipicamente una o due
ore: **non si aspetta guardando** — si continua con altro lavoro, e si
raccoglie il risultato quando arriva.

## Prossimo passo atomico

1. Continuare con altre unità piccole mentre il giro del browser
   cammina: revisione di qualità su un'altra funzione recente, o
   fallback della roadmap.
2. Quando il giro del browser finisce: leggerlo con `leggi-giro.mjs`
   (attenzione alla sua sezione 0 — di quanti commit il branch è andato
   avanti nel frattempo, per non leggere accuse vecchie come fresche) e
   correggere quello che trova, con la stessa disciplina.
3. Continuare ad aspettare la risposta del fondatore sulla domanda CAD —
   non presumerla, non costruire in quella direzione.

Nessuno stop volontario: si prosegue subito.
