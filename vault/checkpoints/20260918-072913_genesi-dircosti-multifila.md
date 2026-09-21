# Checkpoint — 2026-09-18T07:29:13Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c4d85939 — fix(genesi): dir/costi d'innesco e la fila persistono su Apri/export

## Cosa è stato completato
Dal secondo giro di deep-pass su Genesi, due difetti veri verificati
prima riga per riga sul sorgente, poi dal vivo con Playwright:

1. **Dir/costi non persistevano su "Apri"**: `volSnapshot` non
   scriveva `D2.dir`/`cPerf`/`cExpl`/`cInnesco`/`valMat` nel `design`
   del progetto salvato — solo maglia e tratti lo erano già (fix
   precedente, stessa famiglia). Riaprendo un progetto salvato, la
   direzione d'innesco tornava sempre a `'sx'` e i quattro costi ai
   default, anche se l'utente li aveva impostati diversamente.
   Corretto scrivendoli in `volSnapshot` e rileggendoli nell'handler
   "Apri" con lo stesso fallback ai default preesistente, applicato
   SOLO quando il progetto non li porta (verificato nei due versi:
   progetto senza quei campi → default; progetto con propri valori →
   valori del progetto).
2. **L'export `.volata.json` dichiarava sempre `file:1`**, a
   prescindere dal numero reale di file del progetto (`D2.file`), e
   nessun foro portava la propria fila — un piano multi-fila esportato
   perdeva quell'informazione, che Campo (consumatore a valle) non
   poteva più ricostruire. Corretto: `geometria.file` ora è dinamico
   (`Math.max(1, D2.file||1)`), ogni foro nel `fori` map guadagna
   `fila:Math.round((f.zoff||0)/Math.max(1,SPALLA))+1`, riusando ESATTAMENTE
   la stessa formula già in uso a schermo in `holeInfoShow` (nessuna
   nuova convenzione inventata). **Scope**: solo l'export — l'import a
   riga singola resta una decisione architetturale preesistente
   (dichiarata a riga 1513 del file), non toccata.

## Verifica
- Nuovo banco `genesi-dir-costi-non-persistono-su-apri.mjs`: 6/6,
  controprova verificata nei due versi (senza dir/costi → reset ai
  default; con dir/costi propri → preservati).
- `genesi-tratti-non-persistono-su-apri.mjs`: ri-ancorato (l'ancora a
  due righe adiacenti non combaciava più dopo l'inserimento del blocco
  dir/costi in mezzo) — normale 5/5, controprova 4/5 (rileva
  correttamente la regressione).
- `genesi-documenti-che-escono.mjs`: esteso con un blocco "4ter"
  (progetto a 3 file × 4 fori, verifica `geometria.file===3` e le tre
  file distinte 1/2/3) e una tredicesima voce dedicata in `DIFETTI`
  (prima il fix era esercitato solo di riflesso dalla controprova
  sullo scatter, difetto #4) — normale 101/101, controprova 30 KO su
  16/16 iniezioni rimesse.
- Giro completo su worktree isolata (`/tmp/wt-genesi`, HEAD 2b112d02 +
  delta Genesi): **41 comandi a posto, 0 caduti**. Asserzioni: **4128**
  (documenti corretti da 4127). Banchi: 343 → **345** (+2, normale e
  controprova del nuovo banco). File di banco distinti: 151 → **152**.
  9-suite sum invariata (**3.628**, nessun test in run-kpi.mjs per
  questa unità). `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Genesi chiusa. **Seconda ondata
(Flotta + Campo + Genesi) completa**: tre commit, tre checkpoint, tutti
pushati.

## Report agenti in background arrivati e trattati in questa ondata
- **Scudo, quarto giro di deep-pass** (agente a76e56f7569610db8):
  entrambi i "difetti nuovi" segnalati (ramo "senza data" mancante in
  `abilitazioneLavoratore`/`pillReq`; colonne categoria/gravitaPotenziale
  /anonimato mancanti nel CSV export) erano **completamente stale** —
  già corretti nel commit `1259e8f5` di questa stessa sessione, PRIMA
  che l'agente finisse di scrivere il report. Verificato riga per riga
  sul sorgente attuale (righe 4089-4097 e 2446 di scudo-data.js)
  prima di scartare: nessuna azione presa, nessun file toccato.
  Esempio da manuale della famiglia "il non c'è scaduto" di CLAUDE.md.
- **Sentinella, nuovo giro di deep-pass** (agente a23f1a17c355c57c9):
  nessun difetto vero trovato. Cinque banchi mirati rilanciati (foglio
  volata, meteo/import, escalation superamenti, annullate, report
  dichiarazioni) tutti verdi; censite a mano le piste indicate dal
  mandato (ponte meteo Campo, ponte Scudo T7, mappe di stato, doppie
  chiamate) — tutte già chiuse nei giri precedenti. Nessuna azione.

## Cantieri lanciati e ancora in corso (da raccogliere al prossimo giro)
- **Terra**, nuovo giro di deep-pass (agente abccb861702fa2d4a) —
  in corso.
- **Conti**, sesto giro di deep-pass (agente a8e5ab52b4f891993) —
  in corso, mandato include il controllo se altri punti che consumano
  fatture avrebbero dovuto ricevere la stessa guardia `statoSdi/nonEmessa`
  del quinto giro e non l'hanno ricevuta.

## Prossimo passo atomico
1. Attendere/raccogliere i report di Terra e Conti (non pollare: i
   task notification arrivano da soli).
2. Per ogni difetto vero riportato: **verificarlo contro il codice
   ATTUALE sul disco prima di agire** (lezione appena ripetuta con
   Scudo) — poi worktree isolata, doc delta preciso via Python,
   giro-node.mjs in background con wait-loop sul PID (mai sleep alla
   cieca), numeri-nei-documenti.mjs verde, commit -F, push, checkpoint.
3. Se nessun difetto vero arriva da Terra/Conti, non fermarsi: aprire
   almeno tre nuovi cantieri paralleli su app diverse (regola del
   fondatore del 26/07) — candidati: un terzo giro di deep-pass su
   un'app già coperta con profondità minore, oppure nuova ricerca
   continua (agenti haiku in background) su un argomento non ancora
   coperto per un'app a rotazione, marcando sempre "proposto da
   ricerca, non verificato" finché non riletto e riverificato da chi
   ha il codice in mano.
4. Continuare la regola "mai fermarsi": nessun riepilogo di chiusura,
   nessuna dichiarazione di giornata conclusa — al completamento di
   ogni unità si apre subito la successiva.

## Blocchi
Nessuno.
