# Checkpoint — 2026-09-18T06:40:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c05e45fd

## Cosa è stato completato
Quinto difetto confermato corretto in questo blocco (dopo Genesi, Flotta,
sicurezza Deepwork ID, Scudo): Conti, sei funzioni (`kpiFrom`,
`agingIncassi`, `fattureOltre90`, `esposizioneClienti`, ereditate da
`avvisoFidoPesata`/`concentrazionePortafoglio`) trattavano una fattura
scartata dallo SdI (o mai inviata) come credito vero, mentre
`sollecitabile`/`testoSollecito`/`estrattoContoCliente` già la escludevano.
Aggiunta la stessa guardia (`statoSdi(f, oggi).nonEmessa`) nelle quattro
funzioni dirette. Nuovo test con controprova (KPI 3131→3132), verificato
nei due versi. Giro isolato: 41/41, 4125 asserzioni.

Il secondo difetto segnalato dallo stesso agente (`rigaPesata` senza
scaglioni di quantità) è stato **investigato e respinto come falso
positivo** — vedi checkpoint 20260918-062631 per la citazione completa:
il modulo dichiara esplicitamente e con ragione (circa righe 5495-5503 e
5645-5667 di `apps/conti/conti-data.js`) che gli scaglioni vivono di
proposito solo al livello dell'offerta/ordine, non sul singolo DDT.
**Con questo si chiude l'intero backlog di difetti confermati** dal
checkpoint 20260918-061236 (Genesi, Flotta, sicurezza, Scudo, Conti).

## Lavoro NUOVO, non ancora committato (in corso nel working tree)
Mentre il giro isolato di Conti girava, sono arrivati due report di
deep-pass QA da agenti dispatchati in background, e nel frattempo è stata
anche implementata (verificata, non ancora isolata/committata) una
proposta già scritta in `docs/RICERCA_CONTINUA_FLOTTA.md` (tredicesimo
giro, 18/09, prima di questa unità):

1. **Flotta — soglia di vita dei componenti a scaglioni, dal delta della
   ricerca continua**: PRONTO per il commit. `vitaComponenti` ora calcola
   `pctVita`/`stato` ("non-giudicato"/"ok"/"attenzione"/"scaduto") quando
   un componente porta `vitaAttesaOre` dichiarata (opzionale — la vita
   attesa NON è una costante di prodotto, varia 400-4.000+ h per il solo
   GET secondo il mondo). `prioritaOperative` legge `m.componenti` di ogni
   mezzo operativo (nessun parametro nuovo: il dato vive già lì, come lo
   legge il fascicolo) e aggiunge una voce "componente" per ogni
   scaduto/in-attenzione. Fascicolo mezzo aggiornato per colorare il
   badge. Demo (`m1`) aggiornata con due `vitaAttesaOre` di esempio (uno
   "attenzione" vero). Nuovo test con controprova (KPI 3131→3133, due
   test: id:null nella prima asserzione e la storia completa nella
   seconda — attenzione ai numeri veri quando si isola).
2. **Campo — l'idoneità nei documenti diceva solo "non idoneo", mai
   "scadute"/"in-scadenza"/"conPrescrizioni"** (quinto giro di deep-pass,
   agente a3c51b3ffe5e1bfeb): PRONTO per il commit.
   `avvisoIdoneita`/`rapportoGiornata` e la sezione "IDONEITÀ DEL TURNO"
   di `testoConsegnaTurno` guardavano solo `idonHSE.nonIdonei` — un
   documento scaduto o in scadenza spariva dal rapporto stampato/firmato
   e dalla consegna archiviata anche se il Quadro e la sezione Squadre lo
   mostravano già. Composta come elenco di clausole (stesso principio già
   usato per la settima colonna di `csvRegistroInfortuni` di Scudo), non
   un `?:` che dice una cosa sola. **E un secondo difetto trovato
   scrivendo il test**: `idoneitaDiTurno(...)` era chiamata SENZA il
   quarto argomento `oggi` in entrambi i punti (`rapportoGiornata` e
   `testoConsegnaTurno`) — giudicava scadute/in-scadenza contro l'orologio
   VERO del server, non contro il giorno del rapporto. Invisibile finché
   il consumo guardava solo `nonIdonei` (che non dipende da una data).
   Corretto passando `new Date(OGGI + "T12:00:00")`, stesso idioma già
   usato altrove nel file. Nuovo test con controprova (KPI 3133→3134).

**Da leggere ancora**: il report di Genesi (agente af3a9e76d85847662, tre
difetti — `D2.dir` non salvato/azzerato su "Apri", i quattro parametri di
costo (`cPerf`/`cExpl`/`cInnesco`/`valMat`) idem, l'export `.volata.json`
che dichiara sempre `file:1` perdendo lo `zoff` multi-fila). NON ancora
verificato né iniziato.

## Prossimo passo atomico
1. **Committare Flotta (vita componenti a scaglioni)**: worktree isolata
   da `HEAD`, copiare `apps/flotta/flotta-data.js`, `apps/flotta/index.html`,
   la porzione di `apps/deepwork-id/tests/run-kpi.mjs` relativa (con
   Campo mescolato nello stesso file — usare `hash-object`/
   `update-index --cacheinfo` per separare i due blocchi di test se
   necessario, o verificare che i due diff non si sovrappongano riga per
   riga). KPI atteso 3133 (verificare col giro, non indovinare). Nessun
   banco browser nuovo: banchi/file restano 343/151.
2. **Committare Campo (idoneità completa + oggi mancante)**: stessa
   tecnica, `apps/campo/campo-data.js` + porzione di `run-kpi.mjs`. KPI
   atteso 3134.
3. **Leggere e verificare il report di Genesi** prima di agire — tre
   difetti proposti, nessuno ancora confermato con un test. Per ognuno:
   leggere il codice citato, costruire un caso minimo (in scratchpad,
   come da regola del fondatore), e SOLO se confermato scrivere il fix +
   test + controprova. `D2.dir` sembra il caso più solido (stessa identica
   famiglia di `D2.tratti`, appena chiusa) — probabilmente il primo da
   verificare.
4. Con il backlog di difetti confermati ormai esaurito più volte:
   continuare a dispatchare nuovi giri di deep-pass/ricerca continua (≥3
   cantieri paralleli), ma dare sempre priorità a verificare e chiudere
   ciò che arriva prima di aprirne di nuovo — per non lasciarlo
   riaccumulare come è successo con Genesi/Campo mentre si chiudeva Conti.

## Blocchi
Nessuno.
