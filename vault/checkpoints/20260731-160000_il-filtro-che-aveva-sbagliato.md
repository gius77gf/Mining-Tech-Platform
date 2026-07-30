# Checkpoint — il filtro che aveva sbagliato il censimento, e la difesa con lui

- **Tipo**: due unità di correzione (la regola, il documento)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `73570c0` (la regola 12 allargata), `02c5d36` (le regole comuni
  del documento)

## L'errore, e come è venuto fuori

Nel checkpoint precedente avevo scritto una frase falsa: *«sette gestori i
doppioni non li saltano affatto, ed è giusto così»*. L'avevo dedotta da un
censimento fatto cercando la forma `.some(`. Poi li ho **riletti uno per uno**,
invece di fidarmi del filtro, e quattro di quei sette il doppione lo saltano —
**e lo fanno bene, da prima di oggi**: il registro infortuni e lo scadenzario
di Scudo, il registro volate di Sentinella, i rilievi di Terra usano un `Set`
con una firma composta e la aggiungono **dentro** il ciclo. Cioè avevano già
esattamente la protezione che mancava agli altri dieci.

## Perché non è solo una frase da correggere

**Lo stesso filtro sbagliato era finito nella difesa.** La regola 12, nata da
quel censimento, guardava anch'essa solo `.some(`: quei quattro le erano
invisibili, e il giorno in cui a uno di loro sparisse l'`add` dal ciclo — una
riga tolta — non se ne accorgerebbe nessuno. Un controllo cieco proprio dove il
codice fa la cosa giusta è il modo più silenzioso di perderla.

Ora la regola guarda **entrambe le forme** in cui la difesa si scrive:
`senzaDoppioni` di `shared/` e il `Set` con la firma aggiunta dentro il ciclo.
Controprovata sul file **vero**: tolto l'`add` dal registro infortuni di Scudo,
la regola lo trova e indica la riga giusta (2562). **Stile 135 → 136.**

## Il conto vero

**Venti** gestori di file. **Tre** non importano righe (una foto, un allegato,
un testo incollato). Dei diciassette che restano: **dieci** corretti oggi,
**quattro** già corretti da prima, **uno** protetto dentro la sua funzione di
lettura (l'anagrafica di Scudo), **due** che non deduplicano **per un motivo**
— la telemetria di Flotta **aggiorna** i mezzi invece di aggiungerli, e il
piano di carico di Campo **sostituisce** il piano intero.

## Il documento

La regola dei doppioni stava spiegata solo nell'anagrafica di Scudo; ora è
nelle **regole valide per tutti i file**, scritta una volta sola. E dice come
leggere il messaggio finale, che distingue due ragioni: «già presenti» non
chiede di correggere niente, «ripetute nel file» sì — nel foglio di calcolo,
prima del prossimo caricamento.

Corretta anche una frase che era vera **solo a metà**: «il file esportato si
re-importa senza duplicare» valeva per le righe già in archivio, non per un
file che nomina la stessa cosa più volte — che è precisamente ciò che fa
l'export di Scudo.

## La lezione, in una riga

**Un filtro che sbaglia il censimento sbaglia anche la difesa che ne nasce.**
Le due cose sembrano indipendenti — una è una misura, l'altra è un controllo —
ma se il controllo eredita il criterio della misura, eredita anche il suo punto
cieco. L'unico modo di accorgersene è stato **rileggere a mano** quello che il
filtro aveva già classificato.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro completo** della suite del browser (in corso al
momento di questo checkpoint) e, se qualcosa è rosso, sistemarlo prima di
aprire un'altra unità: oggi sono state toccate tutte e sei le pagine — sei
liste di import e sei messaggi riscritti — e finora la verifica è stata solo
che il modulo si aggancia.

## Bloccanti

- Nessuno.
