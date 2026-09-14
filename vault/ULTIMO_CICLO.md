# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 18:45 UTC
- **Commit di partenza**: `1e1b6fbc`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Questa non è una ripresa da fermo: la routine "Weekly Dev Session" ha
sparato una nuova accensione (fuoco delle 18:45:12 UTC) mentre questa
sessione era ancora nella stessa conversazione col fondatore aperta
dalle 09:47. Repository raggiungibile, `HEAD` allineato al remoto,
`git pull` senza cambiamenti.

⚠️ **Stato particolare, invariato dal canarino precedente**: il
fondatore ha chiesto *"hai riflettuto su come rendere Genesi simile ad
un CAD?"*, gli è stata rimandata una domanda di chiarimento (quale
asse: precisione/snap, layer, strumenti di disegno, o import/export
CAD) — **non ha ancora risposto**, oltre nove ore. Finché non risponde,
non si scompone né si costruisce niente in quella direzione.

⚠️ **Direttiva del fondatore in conversazione, più recente e più
specifica del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA
per la nona volta**: concentrarsi SOLO sull'app Genesi. Il prompt fisso
di questa accensione (ponti fra le app, lavoro multi-app in parallelo,
"Genesi NON esce dal browser") resta un template generico non
personalizzato — la seconda parte è anche **scaduta**, verificato e
documentato nel checkpoint `20260914-005111`: il gap è stato chiuso il
02/09.

⛔ **SEGNALAZIONE DI SICUREZZA APERTA, INVARIATA — DA LEGGERE PRIMA DI
TOCCARE GEOMETRIA/FLYROCK/BURDEN.** Il gate su
`deviazioneForiDaCsv`/`burdenVeroDaRilievo` resta bloccato sul fondatore
(`docs/DECISIONI_WEEKEND.md`, sezione 6). Le soglie USBM/DIN restano
un'altra decisione aperta (sezione 9), invariata. Nessuna delle due è
stata toccata in questo blocco.

## Cosa è successo nel blocco in corso (14/09, dal canarino delle 00:47)

Riepilogo cumulativo (vedi i checkpoint precedenti per il dettaglio di
ognuna): gruppo B3 chiuso (estrazione funzioni pure), G7 consegnato
(due fette: obiettivo x50, confronta burden con MIC/PPV), G8 costruito
(firma nel report volata, con chiusura del delta MSHA), G45 costruito
(verdetto di sintesi sulla scheda validatori — con due difetti propri
trovati e corretti in verifiche successive: un layout che si spezzava a
430px, e una frase di perimetro falsa sulla copertura vibrazione/
airblast/flyrock). Backlog di ricerca continua esaurito (dieci sezioni
rilette meccanismo per meccanismo). Censimento per-bottone di Genesi
completo (un banco nuovo per l'unico output scoperto e non gated,
`btn-piano-dxf`/G33). Un giro completo del browser lanciato, raccolto e
il suo unico difetto Genesi corretto (iniezione di controprova stale
dopo il trasloco G36). G46 resta candidato dichiarato, non costruito
(tocca la regola SOLDI).

**Diciannove unità di lavoro + nove canarini**, tutte committate e
pushate, ognuna verificata prima del commit (worktree isolata per le
unità di codice, giro diretto per le unità di sola documentazione con
working tree pulita).

## Prossimo passo atomico

1. **Immediato**: continuare ad aspettare la risposta del fondatore
   sulla domanda CAD — non presumerla, non costruire in quella
   direzione.
2. Backlog di ricerca, censimento estrazione, censimento per-bottone e
   giro completo del browser tutti chiusi o esauriti per Genesi in
   questo blocco. Se serve altro lavoro: una nuova iterazione di
   verifica visiva su un'altra funzione già costruita (la regola
   dell'eccellenza chiede almeno tre confronti affiancati — è stata
   proprio una terza verifica, tardiva, a trovare il difetto vero in
   G45), o il fallback generico della roadmap.
3. Se si rilancia il giro completo del browser: **redirigere lo stdout
   su file per intero**, non attraverso un `tail` che tronca la fonte —
   lezione presa nel blocco precedente.

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
