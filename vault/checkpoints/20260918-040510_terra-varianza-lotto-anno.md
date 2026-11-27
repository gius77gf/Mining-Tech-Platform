# Checkpoint — 2026-09-18T04:05:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e57a3534

## Cosa è stato completato
Chiuso un quarto difetto della famiglia "calendario impossibile" in Terra
(dopo i tre già chiusi il 17/09 in `dataISOBuona`/`proiezioneAnnua`/`kpiFrom`
e la pagina Piano): `varianzaLottoAnno` sommava un rilievo con
`data:"2026-13-45"` nel confronto pianificato-vs-reale del lotto, perché il
pre-filtro sull'anno usava `.slice(0,4)` grezzo e `volumeMisuratoDiLotto`
(chiamata subito dopo) non valida il calendario a sua volta. Verificato
indipendentemente prima di correggere: il verdetto si ribaltava da
"indietro del 19%" ad "avanti del 1981%" con un solo rilievo iniettato.
Corretto sostituendo il pre-filtro con `rilievoUsabileConData`. Non era
coperto da nessun test che lo dichiarasse intenzionale (a differenza di
`estrattoComplessivo`, dove un test esistente dichiara l'inclusione voluta).

Nuovo test puro in `run-kpi.mjs` con controprova (verificata a mano:
difetto rimesso → test cade; ripristinato → file identico all'originale).
Numeri dei documenti aggiornati e riverificati due volte (la prima con un
numero provvisorio, corretto dopo aver scoperto che `numeri-nei-documenti.mjs`
passando include le proprie ~43 asserzioni nel totale del giro — non le
includeva quando falliva). Giro isolato finale: 41/41, 3.619 prove, 4116
asserzioni, i due documenti concordano.

⚠️ **Nota sulla sequenza di commit**: questa è la PRIMA di tre unità
correlate (Terra, Sentinella, Campo) preparate insieme nel working tree
durante lo stesso blocco di lavoro. Per tenerle separate ho staged solo la
porzione di `run-kpi.mjs` di questa unità con `git hash-object -w` +
`git update-index --cacheinfo`, verificando byte per byte che lo stage
coincidesse col file costruito apposta prima di committare. Il working
tree resta con TUTTE e tre le unità (Sentinella e Campo ancora da
committare separatamente, già scritte e verificate).

⚠️ **Interruzione canarino**: durante questo blocco è scattato il trigger
"Weekly Dev Session" (2026-09-18T03:45Z). Eseguito il protocollo canarino
in un commit isolato (`de4a6cc7`, solo `vault/ULTIMO_CICLO.md`), senza
toccare i file già in stage per questa unità — a differenza del 17/09,
questa volta il canarino non si è mescolato con lavoro non correlato.

## Stato roadmap
Terzo/quarto giro di deep-pass in corso su tutte le app. Difetti confermati
e ANCORA DA CORREGGERE (trovati da agenti in background, verificati dal
vivo, non ancora implementati):
- **Conti** (agente af0b750375363ec94): `registroVendite`/`csvRegistroVendite`
  non controlla `riepilogoIvaFattura(f).quadra` — a differenza delle sue
  sorelle `csvSituazioneFatture`/`xmlFatturaPA` — quindi una fattura
  corretta con la matita (righe vecchie, totali nuovi) esce nel registro
  IVA per il commercialista con imponibile/imposta calcolati dalle righe
  vecchie e totale_documento dai totali nuovi, senza nessun avviso.
- **Genesi** (agente a4a466a27e1e80730): il bottone "Apri" non azzera mai
  `D2.tratti` — un tratto disegnato a mano su un progetto sopravvive e si
  attacca alla volata aperta dopo, e se si salva diventa permanente. Stessa
  famiglia già chiusa per `D2.magliaAssente`.

Difetti CONFERMATI E CORRETTI in questo blocco, in attesa di commit
separati (lavoro già scritto e verificato con controprova/live nel working
tree, worktree di verifica pronte da ricostruire):
- **Sentinella** (agente ae91d1f1bb713478c, quarto giro): due delle quattro
  chiamate a `misuraFuoriCondizioni` (conferma di scrittura, anteprima
  import CSV) non passavano il terzo argomento — il ponte meteo con Campo
  — mentre le altre due (scheda del punto, report) sì. Corretto in
  `apps/sentinella/index.html`; rafforzato anche il test di censimento
  perché pretenda il terzo argomento su OGNI chiamata.
- **Campo** (agente adaf5869ccec0571f, terzo giro): `rapportoGiornata` (il
  rapporto stampato e FIRMATO) non portava né i near-miss del turno né il
  giudizio di idoneità medica (ponte con Scudo), mentre `testoConsegnaTurno`
  aveva già i near-miss e nessuno dei due documenti aveva l'idoneità pur
  essendo già nel Quadro schermo. Corretto in `apps/campo/campo-data.js`
  (nuova sezione "Segnalazioni del turno" in `rapportoGiornata`, nuova
  sezione "IDONEITÀ DEL TURNO" in entrambi i documenti) e
  `apps/campo/index.html` (wiring dei nuovi parametri). Verificato dal
  vivo con Playwright su entrambi i documenti (rapporto stampato e
  consegna .txt), esteso il banco `campo-foglio-turno.mjs`.

## Prossimo passo atomico
1. Costruire una worktree isolata SOLO con la fix di Sentinella (usare
   `/tmp/split/sentinella-index-FIXED.html` e `/tmp/split/run-kpi-sentinella.mjs`,
   già preparati) sopra il nuovo HEAD, lanciare `giro-node.mjs`, aggiornare
   i numeri nei documenti se il totale cambia, committare con
   `git hash-object`/`git update-index --cacheinfo` per isolare la sola
   porzione di `run-kpi.mjs` di questa unità, checkpoint, push.
2. Poi la stessa sequenza per Campo (usare i file già pronti in
   `/tmp/split/campo-*-FIXED.*` e il working tree finale per
   `run-kpi.mjs`/`campo-foglio-turno.mjs`, che a quel punto coincide col
   working tree intero).
3. Poi: Conti (`registroVendite` senza `riepilogoIvaFattura(f).quadra`) e
   Genesi (`D2.tratti` non azzerato su "Apri") — due difetti veri già
   confermati e non ancora corretti.
4. Leggere gli esiti delle ricerche continue in arrivo (Scudo QA round 4,
   Flotta QA round 4, Assenza) e mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
