# Checkpoint — 2026-08-08 15:50 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`865f436` — fix(sentinella): la correzione di una misura dentro la transazione

## Che cosa è stato completato
L'**ultimo dei dodici** punti della misura 5b, e l'unico in cui si tocca un
elemento **in mezzo** all'elenco.

⛔ Lì un controllo «la serie è cambiata mentre correggevi» **c'era già ed era
cieco**: confrontava lo scatto locale con la firma presa **dallo stesso
scatto**, quindi passava sempre — e poi riscriveva l'elenco vecchio buttando via
la lettura che qualcun altro aveva aggiunto. **Un controllo che guardava sé
stesso.** Adesso il confronto si fa **dentro** la transazione, sulle letture
vere, e la lettura si ritrova per la sua **firma** e non per l'**indice**, che
si sposta appena qualcuno aggiunge o toglie qualcosa.

## Il censimento è diventato una regola
Una prova rifà il conto dei sei campi compositi e pretende che nessuno torni a
essere scritto intero. Due cose **dichiarate** invece che lasciate intuire:
- il **ripiego** (chiave col punto nel nome, dove `percorsiDi` risponde
  `null`) è riconosciuto come tale. ⚠️ La prima stesura lo **accusava**, ed era
  **il controllo** a sbagliare, non il codice — la solita famiglia;
- **`atmosfera`** di Scudo è **fuori con la ragione accanto**: lì l'utente
  invia tutte le misure di gas insieme, quindi non è la spunta persa ma un
  conflitto sullo stesso campo, e la risposta a quello non è tecnica. Una riga
  pretende che **resti così**: se un giorno cambiasse, va rivista.

## Dove siamo
**Undici punti su dodici** non riscrivono più l'elenco intero.

## Verifiche
Controprovata la regola rimettendo una scrittura intera su `scudo.misure`:
**cade e la nomina**. Giro `node` **27/27** sul disco e sulla copia (patch
identica); `run-kpi` **1909**; pagina di Sentinella aperta davvero.

## Prossimo passo atomico
La 5b ha finito la parte **conflitti**. Resta la **coda offline**, che va per
ultima e **nel browser**: `enableIndexedDbPersistence` in `node` non si
misura, quindi la prossima unità è **una misura**, non una funzione — che cosa
succede a scrivere con la rete staccata e poi riattaccarla, con due schede.
⛔ E vale la regola già scritta: metterla prima avrebbe moltiplicato il
problema, adesso non più.

## Stato del giro del browser
⏳ PID 16670, oltre **4 ore**. Attesta `c3888fe`: **nessuna** delle sedici
unità di oggi è dentro. Quando finisce: `leggi-giro.mjs`, sezione 1 prima
della 2, e la riga «le tre passate più lente» per ritarare il limite.

## Blocchi
Nessuno.
