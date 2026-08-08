# Checkpoint — 2026-08-08 19:00 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e8ce240` — tre documenti rimessi in pari con quello che è successo davvero

## Che cosa è stato completato

Tre unità di documenti, tutte della stessa famiglia — **la prosa invecchia
mentre il numero che il controllo sorveglia resta giusto**:

1. **`DEVELOPMENT.md` e `STATO_PRODOTTO.md`, la spiegazione del numero.** Il
   totale (2.355) era giusto; la nota che lo spiega diceva «2.636 asserzioni» e
   un elenco fermo a `import esistenti 145`. **Rimisurato** sommando le righe
   «Risultato …» di un giro intero: **2.646**, e l'elenco corretto.
   ⚠️ E la nota dichiara adesso una cosa che prima taceva: le due controprove
   nate oggi — `iniezioni fresche` e `server orfani` — **non hanno una riga
   «Risultato» da sommare**, quindi girano (il giro è passato da 28 a **30**
   comandi) ma non entrano in quel totale. È l'etichetta più larga del suo
   numero, presa mentre la si scriveva.

2. **`vault/ULTIMO_CICLO.md`, il canarino.** Era fermo alle 12:21Z e descriveva
   come «in corso» un blocco chiuso da sei ore. È il file da cui il fondatore
   capisce che il lavoro automatico è vivo: se racconta il passato non serve a
   quello. Adesso porta le quattordici unità divise per che cosa sono, e — in un
   paragrafo suo — **la sola cosa che aspetta lui**: se accendere la coda
   offline sapendo che al ritorno dalla rete vince chi era staccato.

3. **`RICERCA_CONTINUA_FLOTTA.md`, una riga scaduta.** «Il rifornimento senza
   data si salva in silenzio e scrive `null`»: **era vera** quando fu scritta, ed
   è **scaduta** — corretta il 03/08, e il commento accanto alla correzione
   racconta proprio quel caso. La riga porta adesso **la prova**
   (`if (!dataISOEsiste(iso)) errori.data = …`, e la pagina che quell'errore lo
   mostra), non una data incollata.
   ⛔ E in cima al documento c'è il **denominatore**: **una riga su undici**
   riverificata, dieci **no**. Senza quella riga chi legge crede che sia stato
   ricontrollato tutto.

## Prossimo passo atomico

Il giro completo del browser gira sul commit `4358487` (pid 21084, registro
`scratchpad/resp/giro/registro3.txt`) — lanciato **a blocco chiuso**, com'è la
regola. Quando finisce:

    node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>

**sezione 0** (quanto è vecchio: dovrebbe dire pochi commit e **zero** sulle
superfici misurate, perché dopo sono stati toccati solo documenti), poi le righe
«non ho guardato», poi i KO. La domanda: **quali controprove non sanno fallire**
sul codice di oggi — il giro vecchio ne dava dieci, ma tre di quelle sono state
chiuse oggi e la lista attestava venti commit fa.

## Blocchi

Nessuno.
