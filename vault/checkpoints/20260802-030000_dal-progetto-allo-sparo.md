# Checkpoint — dal progetto allo sparo: la previsione non si tocca

- **Tipo**: unità (16 prove sul gruppo delle volate previste)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `4f6ee69`

## L'unità

Genesi manda a Sentinella una volata **prevista**; dopo lo sparo qualcuno la
conferma come eseguita, correggendo quello che in cava è andato diversamente dal
progetto. Sedici prove su `confermaVolataEseguita`, `statoVolata`,
`statoDaTesto`, `previsioneDiVolata`, `campiPrevisioneVolata`,
`scartoPpvVolata`, `firmaVolata`, `volateOrdinate`, `riepilogoPreviste`.

## Le due regole che reggono il ponte

1. **La previsione non si tocca.** I dati si correggono — fori saltati, carica
   ridotta, data spostata — ma il numero **previsto** resta scritto com'era.
   Altrimenti il confronto previsto→misurato sarebbe un confronto con un numero
   **aggiustato dopo lo sparo**, cioè con niente.
2. **Una volata eseguita è un fatto avvenuto**, quindi la sua data non può stare
   nel futuro. E il messaggio offre la via d'uscita — *«se non è ancora stata
   sparata, lasciala prevista»* — invece di dire soltanto no.

## Le altre, tutte con la loro ragione

- **Il silenzio del registro significa ESEGUITA**: un registro compilato a mano
  è un elenco di fatti avvenuti, non di intenzioni.
- **Un campo non toccato resta quello del progetto; uno SVUOTATO vale zero.**
  Svuotare è una *correzione* («quei fori non li abbiamo fatti»), non una
  dimenticanza: trattarla come «lascia com'era» ribalterebbe la volontà di chi
  compila.
- **Quello che cambia si elenca prima di salvare**: una correzione silenziosa su
  un documento è un problema.
- **Si dice su che base Genesi ha previsto** — legge di sito calibrata o stima
  dalla litologia. Una previsione calibrata sul proprio sito vale più di una da
  manuale, e l'utente ha il diritto di sapere quale delle due sta leggendo.
- **Il previsto non entra MAI nei campi della misura**: messo accanto a una
  misura, nel giro di una settimana diventa indistinguibile da essa.
- **La firma col codice di Genesi sopravvive alla conferma**, che può aver
  corretto fori, chili e persino la data: senza, reimportare il file del
  progetto creerebbe una **riga fantasma**.

## Metodo

Controprova su una copia: **11 difetti rimessi, 11 visti, 0 non visti.** Tre di
questi cambiano **zero caratteri** — sono scambi di argomenti o di ordine — ed è
esattamente il caso in cui la conta dei caratteri da sola mentirebbe: per quello
la sonda confronta **anche** la copia con l'originale e si rifiuta di partire se
sono identiche. La stessa sonda, sul lavoro precedente, si era già fermata da
sola quando il testo da sostituire era andato a capo.

## Stato

- **634** KPI (433 all'inizio della giornata) → **917** prove `node`, verdi in
  UTC **e** in ora italiana
- **201 prove nuove** in giornata, **6 difetti di prodotto** corretti
- Sentinella: le funzioni scoperte erano **70 su 107** all'inizio del blocco

## Prossimo passo atomico

Restano scoperte, in Sentinella, le funzioni del **CSV** (`csvRegistroVolate`,
`CSV_VOLATE_INTESTAZIONE`, `csvRefertiGenesi`, `leggiCsv`, `parseVolateCsv`) e i
**reclami** (`riepilogoReclami`, `etichettaReclamo`, `TIPI_RECLAMO`). Il CSV è
il formato con cui i dati **escono** dall'app e **rientrano**: una colonna
spostata o un'intestazione che non combacia con quello che il lettore si aspetta
è il modo più silenzioso di perdere un registro.

## Bloccanti

- Nessuno.
