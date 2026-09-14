# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-09-14, 12:47 UTC
- **Commit di partenza**: `d17e56b8`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Questa non è una ripresa da fermo: la routine "Weekly Dev Session" ha
sparato una nuova accensione (fuoco delle 12:46:03 UTC) mentre questa
sessione era ancora nella stessa conversazione col fondatore aperta alle
09:47. Repository raggiungibile, `HEAD` allineato al remoto, `git pull`
senza cambiamenti.

⚠️ **Stato particolare, invariato dal canarino precedente**: il fondatore
ha chiesto *"hai riflettuto su come rendere Genesi simile ad un CAD?"*,
gli è stata rimandata una domanda di chiarimento (quale asse: precisione/
snap, layer, strumenti di disegno, o import/export CAD) con già pronta
una ricerca verificata sui quattro assi (vedi checkpoint
`20260914-100055`) — **non ha ancora risposto**, sono passate quasi tre
ore. Finché non risponde, non si scompone né si costruisce niente in
quella direzione: sarebbe costruire su una domanda aperta, non su una
sua risposta.

⚠️ **Direttiva del fondatore in conversazione, più recente e più specifica
del prompt fisso di questa routine — CONFERMATA ANCORA VALIDA per la
quinta volta**: concentrarsi SOLO sull'app Genesi. Il prompt fisso di
questa accensione (ponti fra le app, lavoro multi-app in parallelo,
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
ognuna): gruppo B3 chiuso (G39-G43), G7 seconda fetta consegnata (G44),
una ricerca automatica verificata con una correzione reale (S/B esiste
già), revisione completa dei banchi del browser di Genesi con **due
difetti reali trovati e corretti** (ora zero KO su tutta la superficie
Genesi del browser, 12 banchi), e una seconda ricerca (sul tema CAD) il
cui agente ha dichiarato una scrittura mai avvenuta — scoperto e
corretto a mano, verificato riga per riga.

**Dieci unità di lavoro + quattro canarini**, tutte committate e
pushate, ognuna verificata prima del commit (worktree isolata per le
unità di codice, giro diretto per le unità di sola documentazione con
working tree pulita).

## Prossimo passo atomico

1. **Immediato**: continuare ad aspettare la risposta del fondatore sulla
   domanda CAD — non presumerla, non costruire in quella direzione.
2. Nel frattempo, lavoro che NON presuppone quella risposta: rivedere se
   restano voci aperte nella roadmap non legate al CAD (es. la sezione
   "🟢 Le quindici che posso portare avanti io" di
   `docs/DECISIONI_WEEKEND.md`, filtrando quelle non-Genesi), o una nuova
   ricerca a rotazione su un argomento diverso.
3. Se davvero non resta nient'altro di sicuro da fare: il censimento
   `genesi-estraibili.mjs` è stato esaminato a fondo più volte in questo
   blocco e risulta sostanzialmente esaurito (bucket "0" e "1-2"
   confermati, "3-5" verificato — restano solo funzioni DOM/canvas/audio/
   database che restano nella pagina per costruzione).

Nessuno stop volontario: si prosegue subito, rispettando la domanda
ancora aperta col fondatore.
