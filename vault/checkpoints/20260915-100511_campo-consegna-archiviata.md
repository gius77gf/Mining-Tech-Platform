# Checkpoint — 2026-09-15T10:05:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
574163d2 (pushato)

## Cosa è stato completato

Primo fix di codice del quinto giro di ricerca (Campo, la lacuna più
seria delle tre): `testoConsegnaTurno` componeva un rapporto completo a
12 sezioni ma usciva solo come file `.txt` scaricato — mai scritto sul
database. Il record che l'app scrive davvero (`btn-fir`, "Chiudi il
turno") porta solo `consegna`/`ricevuta`/`note`/`ora`, non il contenuto.
In caso di contestazione il database non sapeva più che cosa diceva la
consegna vera.

**La correzione**: `btn-consegna` salva ora anche il testo generato
(`testoConsegna`, con `oraTestoConsegna`) sulla `chiusura` del turno
corrente, con lo stesso upsert di `btn-fir` (`chiusuraDi` +
`aggiorna`/`aggiungi`): le due si scrivono sullo stesso documento invece
di ignorarsi. Il download in `.txt` resta identico, non si toglie niente.

**Verifica**:
- Esteso `apps/deepwork-id/tests/browser/campo-foglio-turno.mjs` (sezione
  "consegna"): un secondo clic esercita il ramo `aggiorna` (invece di
  `aggiungi`) senza sollevare errori — il ramo che un solo clic non
  esercita mai.
- Controprova: rimesso un nome sbagliato al posto di `chiusuraDi` nel
  sorgente, il banco è caduto con `"chiusuraDiXXX is not defined"`;
  ripristinato e riverificato, verde di nuovo (45/0, era 44/0).
- Nessun `test()` nuovo in `run-kpi.mjs` (la logica riusa `chiusuraDi`,
  già pura e testata): solo la cifra "asserzioni eseguite dal giro"
  ricalcolata fresca sulla worktree isolata (3.946).
- Giro isolato su worktree separata, scoped esattamente ai 4 file di
  questa unità: **40 comandi a posto, 0 caduti**.

**Canarino eseguito durante l'unità**: la routine "Weekly Dev Session" è
rifirata alle 09:45:59 UTC mentre il giro isolato di questa unità era in
corso. Eseguito il protocollo canarino senza disturbare l'unità in corso
(unstage → scrivi `vault/ULTIMO_CICLO.md` con `date -u` vera → commit
`canarino:` da solo → push → re-stage) — commit `2c6d918a`. Il mandato
fisso della routine, corretto in questa sessione via `update_trigger`, è
arrivato aggiornato: cita già `docs/MAPPA_ECOSISTEMA.md` §6 come fonte di
stato vivo invece del testo fisso scaduto.

## Stato roadmap

Quinto giro di ricerca: 1 delle 5 lacune confermate trasformata in fix
(Campo, la più seria). Restano da valutare: Scudo (sospensione
disciplinare temporanea, campo assente dal modello del lavoratore), Terra
(margine in giorni fra esaurimento e scadenza — dati grezzi già in
`vitaCava`, manca solo il calcolo esposto; e le due lacune più costose,
varianza mensile e finestra di accelerazione del ritmo, stimate 3-6 ore
l'una).

## Prossimo passo atomico

Scegliere la prossima lacuna del quinto giro da trasformare in fix.
Candidato più economico e ben definito: Terra — margine in giorni fra
`annoEsaurimento` e `dataScadenza` dentro `vitaCava()`
(`terra-data.js:1074`), che oggi restituisce solo il booleano
`scadePrimaIlTitolo` senza dire di quanto. In alternativa: Scudo —
campo `sospesoFinoa: ISO|null` sul lavoratore, con una riga bloccante in
`abilitazioneLavoratore` (`scudo-data.js`, vicino a dove si controlla
`l.attivo`). In parallelo o subito dopo, per non fermarsi: un nuovo giro
di ricerca mirata su un'area non coperta in questo blocco (Flotta,
Sentinella, Conti o Deepwork ID) — questa volta con `isolation:
"worktree"` per ogni agente in background, e controllando prima la
convenzione di maiuscole/minuscole dei nomi file di destinazione (lezione
pagata due volte in questo blocco). Nessuno stop volontario: si prosegue
subito.
