# Checkpoint — 2026-09-15T00:56:25Z

## Tipo
unit-complete (+ correzione di rotta su B3)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3d602346 (pushato)

## Cosa è stato completato

**Prima la correzione di rotta, perché vale più dell'unità stessa.** Il
checkpoint precedente (`20260914-234319`) aveva messo B3 in pausa
concludendo che gli unici candidati rimasti nel bucket "1-2" fossero
`selRoccia`/`selEsplosivo`/`selInnesco` (46 punti di chiamata, troppo
grande) e un gruppo di "legami" già decisi come permanenti in cantieri
precedenti (G22, G28, G35...). **La seconda parte era sbagliata.**
Rileggendo `docs/DEVELOPMENT.md` ho trovato la riga sulla stessa unità
`reliefCls` (14/09): *"la prima volta che B3 tocca un legame di una riga
già marcato «resta come legame»... la nota descriveva l'architettura di
QUEL momento, non un divieto a finire l'estrazione dopo."* Cioè B3
stesso, lo stesso giorno, aveva già stabilito che queste note non sono
permanenti — vanno riverificate caso per caso.

Ho anche scritto e poi **buttato via** (via `git checkout`, prima di
committare nulla) un cambiamento a `genesi-estraibili.mjs` che
classificava undici funzioni come "LEGAME PERMANENTE": l'ho scritto
prima di trovare la riga di `reliefCls`, e l'analisi successiva ha
mostrato che l'etichetta "permanente" era falsa per almeno alcune di
quelle undici (compresa quella che poi ho estratto). Riconoscerlo e
tornare indietro prima del commit ha evitato di scrivere in un
documento vivo un'affermazione non verificata — esattamente il difetto
contro cui questo file mette in guardia decine di volte.

**L'unità vera**: estratta `computeInnesco2D(D2)` da
`apps/genesi/genesi.html` a `apps/genesi/genesi-data.js`. Il G39 del
14/09 aveva già portato fuori il conto vero (`innescoSuMaglia`) ma
aveva lasciato in pagina il legame a zero argomenti — stessa forma di
`computeEnergia2D`/`computeRelief2D` prima di loro. Nessuna ragione
strutturale per fermarsi un passo prima: unico chiamante
(`computeSeq2D`) già con `D2` in scope, nessun wrapper lasciato (era
già zero-arg, ora è un'importazione diretta).

Verifica standard rispettata:
- Cercato "computeInnesco2D" in `run-kpi.mjs` PRIMA di toccare nulla:
  due pinned test (G39, G42), corretti entrambi.
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (`D2.piede` al posto di `D2.holes`): iniettato in una copia di
  `genesi-data.js`, la prova è caduta come previsto, ripristinato
  subito. **Uno scambio S/B NON è stato usato come difetto**: è
  provatamente invisibile, perché `innescoSuMaglia` li combina solo
  dentro un `Math.max(S,B,...)` simmetrico — stessa trappola già presa
  su `_spazTipico`/`computeRelief2D`.
- Fondo di copertura di `genesi-data.js` alzato 166→167.
- Bucket-shift misurato con `git stash`/`stash pop` +
  `genesi-estraibili.mjs --elenco`: 142→141 funzioni, bucket "1-2"
  48→47, estraibili 56→55. Unico effetto collaterale: `computeSeq2D`
  perde `computeInnesco2D` dal proprio elenco "chiama" (stessa famiglia
  già vista su `computeEnergia2D`/`computeRelief2D`).
- Cascata documenti: 3.463 prove (nove suite), `genesi-data.js`
  167/167, condivisi 331/331, Genesi 141 funzioni / 55 estraibili.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.
- `sintassi-pagine.mjs`: 34/34.

⚠️ **Incidente procedurale, corretto senza perdita**: nello stesso
ciclo è arrivato il fuoco della routine "Weekly Dev Session" (00:45
UTC). Ho aggiornato `vault/ULTIMO_CICLO.md` per il canarino ma ho
lanciato `git commit -F` **senza pathspec** con le modifiche di
`computeInnesco2D` già nell'indice da prima: il commit "canarino" ha
inglobato anche l'unità di codice. Contenuto verificato comunque
correttamente prima e dopo (vedi sotto): nessun danno, ma la lezione
resta — un `git add` fatto in un passo precedente resta nell'indice, e
`git commit -F` senza pathspec committa TUTTO ciò che vi si trova, non
solo l'ultimo `git add`.

Il primo giro isolato lanciato con `nohup ... &` (non tracciato
dall'harness) è morto a metà senza un errore visibile — registro
fermo a 39 righe, nessun processo vivo — probabile riavvio del
contenitore fra un fuoco della routine e l'altro. Rilanciato con
`run_in_background: true` (tracciato, notificato al completamento) su
una worktree fresca puntata sul commit già fatto: **40 comandi a
posto, 0 caduti**, con il solo avviso — corretto subito dopo — che
`docs/DEVELOPMENT.md`/`STATO_PRODOTTO.md` dicevano ancora "3.927
asserzioni" dove il giro ne eseguiva **3.928**.

## Stato roadmap

B3 RIPRESO (non più in pausa). Storia append-only aggiornata in
`vault/ROADMAP_SETTIMANA.md` e `docs/DEVELOPMENT.md`.

## Prossimo passo atomico

Sto già lavorando, nella stessa sessione, sull'unità successiva:
`_sigDetTimes` (2 punti di chiamata, componeva SOLO
`tempiDetonazione(D2)` — già esattamente la forma del modulo, quindi
un alias senza logica propria, eliminabile senza aggiungere nulla al
modulo). Verifica in corso su worktree isolata
(`/tmp/wt-b3-sigdet`, giro in background).

Dopo quella unità, i prossimi candidati piccoli dallo stesso lotto del
14/09 da riverificare uno alla volta (NON assumere che "resta come
legame" sia definitivo — verificarlo, come insegna questo checkpoint):
- `crestZ` (7 punti di chiamata, usa `P` non `D2` — stato diverso,
  probabilmente più costoso di quanto sembri da un solo numero);
- `mdlProfSnap` (3 punti di chiamata, compone `P` E `D2.piede` insieme);
- `computeMIC`: **NON toccare senza rileggere per intero** il test
  "i sette lettori della pagina non ridisegnano il numero tranquillo"
  (run-kpi.mjs, ~riga 27021) — qui il legame a zero argomenti è
  DAVVERO deliberato e sorvegliato da un test che pretende
  `computeMIC()` compaia esattamente due volte, a difesa di un difetto
  di sicurezza già chiuso (`Math.max(1, null)`). È il caso opposto di
  `reliefCls`/`computeInnesco2D`: qui la nota NON descrive
  un'architettura superata, descrive un vincolo ancora vivo.

Restano deferred, per il costo misurato: `interpFronte` (16 punti di
chiamata) e il gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46 punti
di chiamata, 10 pinned test in 5 blocchi indipendenti).

Nessuno stop volontario: si prosegue subito.
