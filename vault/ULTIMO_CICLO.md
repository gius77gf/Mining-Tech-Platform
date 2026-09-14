# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 18:22 UTC
- **Commit di partenza**: `34837eca`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Stessa conversazione col fondatore aperta dalle 09:47, nessuna nuova
accensione della routine da quella delle 15:45 UTC. Repository
raggiungibile, `HEAD` allineato al remoto.

⚠️ **Stato particolare, invariato**: il fondatore ha chiesto *"hai
riflettuto su come rendere Genesi simile ad un CAD?"*, gli è stata
rimandata una domanda di chiarimento — **non ha ancora risposto**, oltre
otto ore e mezza. Finché non risponde, non si scompone né si costruisce
niente in quella direzione.

⚠️ **Direttiva del fondatore in conversazione — CONFERMATA ANCORA
VALIDA per la settima volta**: concentrarsi SOLO sull'app Genesi.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA**: il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` resta bloccato sul fondatore
(`docs/DECISIONI_WEEKEND.md`, sezione 6). Le soglie USBM/DIN restano
un'altra decisione aperta (sezione 9). Nessuna delle due toccata.

## Cosa è successo dal canarino delle 15:46

Cinque unità di lavoro, tutte committate e pushate, working tree
pulita:

1. **G45 preso e costruito**: verdetto di sintesi sopra la scheda
   validatori (forma (a) già scelta in roadmap, con la clausola di
   perimetro sempre visibile). Trovato e corretto un difetto di layout
   nella stessa unità (flex che spezzava il testo a 430px), preso con
   uno screenshot prima di committare.
2. **Censimento per-bottone di Genesi**: tutti i bottoni che producono
   un file, confrontati coi banchi committati. Trovato l'unico scoperto
   che non è dietro il gate di sicurezza — `btn-piano-dxf` (G33) — e
   scritto un banco nuovo (`genesi-piano-dxf.mjs`) che legge il DXF sul
   testo e verifica cerchi/raggio/coordinate/profilo indipendentemente
   dal modulo.
3. Chiusura del delta G8 (il requisito MSHA sul numero di presenti
   appartiene a Campo, non a Genesi — verificato, non un'azione).
4. **Raccolto il giro completo del browser** (lanciato alle 13:44Z,
   concluso dopo oltre quattro ore — solo le ultime 42 righe recuperate
   per un errore mio di redirezione, dichiarato nel checkpoint). L'unico
   difetto Genesi trovato: una controprova stale in
   `genesi-frasi-limite.mjs` (il trasloco G36 aveva spostato la logica
   che testava senza che l'iniezione del banco venisse aggiornata).
   Corretto al livello giusto: nuova prova su `_puntiNuvola` in
   `run-kpi.mjs`, iniezione stale tolta dal banco del browser.
   **Nota di visibilità, non un'azione**: il registro mostra anche un
   KO reale su Conti (rimanenze di piazzale) — fuori perimetro, non
   toccato.

Ogni unità verificata su `git worktree` isolata (`giro-node.mjs`, 40/0)
prima del commit, con cascata sui quattro documenti sorvegliati dove
serviva. Un mio errore (parentesi annidata che rompeva il parser di
`numeri-nei-documenti.mjs`) preso e corretto prima del commit, non dopo.

## Bilancio del blocco (dal canarino delle 00:47 del 14/09)

Diciassette unità di lavoro più cinque canarini/aggiornamenti di stato,
tutte committate e pushate. Chiuso: gruppo B3 (estrazione), G7 (due
fette), G8 (report), G45 (sintesi validatori), il backlog di ricerca
continua (dieci sezioni rilette), il censimento per-bottone di Genesi,
un giro completo del browser raccolto e il suo unico difetto corretto.
Aperto e dichiarato: G46 (candidato, frammentazione misurata — tocca la
regola SOLDI), la domanda CAD del fondatore.

## Prossimo passo atomico

1. Continuare ad aspettare la risposta del fondatore sulla domanda CAD
   — non presumerla, non costruire in quella direzione.
2. Backlog di ricerca e censimento estrazione entrambi esauriti;
   censimento per-bottone completo; giro completo del browser raccolto.
   Se serve altro lavoro: una nuova iterazione di verifica visiva su
   una funzione già costruita (la regola dell'eccellenza chiede almeno
   tre confronti affiancati), o il fallback generico della roadmap.
3. Se si rilancia il giro completo del browser: **redirigere lo stdout
   su file per intero**, non attraverso un `tail` che tronca la fonte —
   è la lezione di questo blocco, altrimenti `leggi-giro.mjs` non può
   leggerlo davvero.

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
