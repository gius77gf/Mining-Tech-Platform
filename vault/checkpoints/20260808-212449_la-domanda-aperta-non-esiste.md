# Checkpoint — la domanda che avevo lasciato aperta non esiste

## Tipo
unit-complete (misura che CHIUDE una domanda, invece di aprirne una)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
In tre checkpoint di stasera avevo lasciato una **domanda di prodotto**, con la
riserva giusta («è una decisione del fondatore, non una correzione da fare di
slancio»):

> *una voce di costo registrata senza importo sparisce dal riepilogo E dal file,
> in silenzio* (`riepilogoCosti` la scarta a monte).

E avevo scritto che prima di toccare andava **misurato se il form permetta di
salvarne una senza importo**. Misurato:

- il form **rifiuta**: `numCampo("co-imp", { positivo: true })`, e se il valore
  non è `> 0` la scheda si ferma con *«Scrivi l'importo in euro, al netto
  dell'IVA: deve essere maggiore di zero»*;
- e non è l'unica via da guardare, quindi ho censito **tutte** le operazioni
  sulla collezione `costi` in tutta l'app: sono **due** — una `db.rimuovi` e una
  sola `db.aggiungi`, che scrive sempre `importo: round2(ri.valore)` con quel
  `ri.valore > 0` già imposto. **Nessun percorso d'import**, né in pagina né nel
  modulo.

**Conclusione: una voce di costo senza importo non può esistere.** Lo scarto di
`riepilogoCosti` difende da dati che l'app non sa produrre — vecchi o importati
a mano — esattamente come il giro senza `voci` di Flotta.

## Perché questa unità vale, anche se non corregge niente
**Una domanda aperta che non esiste costa.** Sarebbe finita nella coda del
fondatore come una decisione da prendere, e chi la riprende avrebbe rifatto
tutto il giro per scoprire che non c'era niente da decidere. È la stessa
famiglia del «non c'è» dichiarato e mai provato, vista dall'altro lato: qui
non è una mancanza inventata, è un **problema** inventato.
La riserva iniziale però era giusta e va tenuta come metodo: **non correggere di
slancio** e **misurare la raggiungibilità prima di chiamarlo difetto** sono
esattamente i due passi che hanno evitato di cambiare `riepilogoCosti` per un
caso che non si presenta.

⚠️ E resta vero il corollario, che non cambia: la correzione della cella
dell'importo nel CSV dei costi (`numeroDichiarato` al posto di `|| 0`) è
**difesa in profondità**, non la chiusura di un difetto visibile — sta già
dichiarato così nel banco e nel commit di stasera, e l'iniezione #4 di
`conti-documenti-che-escono.mjs` **non produce un KO** proprio per questa
ragione.

## Verifiche
Nessuna modifica al codice: è una misura. Le due letture che la reggono sono
`apps/conti/index.html:5831` (la validazione) e `:5851` (l'unica scrittura),
più il censimento che mostra che di operazioni sulla collezione ce ne sono due
in tutto.

## Stato del giro «chi decide i numeri di ciò che ESCE?»
51 punti d'uscita su 51 resi conto, **otto difetti veri** tutti corretti.
Profondità: **aperti col browser 21** (Flotta 9, Conti 12) · **letti riga per
riga 30**, dei quali 2 **non apribili per costruzione** (i due del core che
dipendono dal 3D, con la ragione misurata e scritta).
**Nessuna domanda di prodotto lasciata in sospeso.**

## Prossimo passo atomico
**Il giro del browser** (pid 21084, circa tre ore): quando finisce,
`leggi-giro.mjs` dalla **sezione 0** — attesta un commit ormai di diciannove
indietro, quindi i suoi KO vanno letti come vecchi di diciannove commit e non
come di adesso. Poi le righe «**non ho guardato**», che in questa casa si
leggono PRIMA dei KO, poi i KO col rosso VOLUTO separato dai marcatori
`⚠️ CONTROPROVA` / `FINE CONTROPROVA`.
La domanda da fargli: **quali controprove non sanno più fallire** sul codice di
oggi.

## Blocchi
Nessuno.
