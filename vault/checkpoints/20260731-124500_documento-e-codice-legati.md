# Checkpoint — il documento e il codice non possono più allontanarsi

- **Tipo**: una misura che ha smentito la sua ipotesi, e la prova che ne è nata
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `48f49ab`

## L'ipotesi era sbagliata, ed è un risultato

Ero partito convinto che i sedici lettori di CSV delle sei app divergessero su
qualcosa che un file vero ha sempre: separatore, intestazione, virgolette,
virgola decimale, **BOM** (quei tre caratteri invisibili che Excel scrive in
testa quando si salva in «CSV UTF-8») e fine riga di Windows.

Ho misurato invece di irrigidire, e la misura ha detto **no**:

- separatore, virgolette, virgola decimale e intestazione stanno **già** in una
  sola implementazione condivisa (`parseCsvLine`, `isIntestazione`, `numIt` in
  `shared/deepwork-id-client/dw-shell.js`): la regola che serve a sei app vive
  dove deve, e nessuno l'ha riscritta;
- il taglio delle righe è `split(/\r?\n/)` in tutti e sedici — il CRLF di
  Windows è coperto;
- il **BOM**: sedici lettori provati col file pulito e col file come esce da
  Excel, **sedici risultati identici**. Nessuna riga fantasma.

Mezz'ora di misura invece di un consolidamento che avrebbe toccato sei app per
risolvere un problema che non esiste.

## Quello che la sonda ha trovato davvero

Un legame che mancava. `docs/ONBOARDING_DATI.md` è il documento che il primo
cliente ha **in mano** mentre prepara i suoi file: per ogni import c'è un
esempio da copiare. **Niente legava quell'esempio al lettore che deve
digerirlo.** Bastava cambiare una colonna nel codice e il documento restava a
insegnare un formato che l'app rifiuta.

Questo difetto non farebbe rumore da noi. Farebbe rumore **il primo giorno, a
casa del cliente**, e sembrerebbe che l'app non funzioni.

Ora 17 controlli prendono gli esempi **veri** dal documento — il file, letto al
momento, non una copia — e li danno alle funzioni **vere** delle sei app,
pretendendo che entrino **tutte** le righe di dati. Non «almeno una»: una riga
persa in silenzio è precisamente la cosa che nessuno nota.

**KPI 355 → 372.**

## Le due controprove

1. Cambiata l'intestazione delle gare **nel documento**: il controllo trova **3
   righe invece di 2** — l'intestazione entra come dato e in lista comparirebbe
   una gara che si chiama «nome».
2. Rotta l'estrazione dei blocchi di esempio: cadono **17 controlli** invece di
   passare a vuoto. È la rete di sicurezza contro il file di prova inerte, che
   dice «0 falliti» esattamente come uno che funziona.

## L'errore di percorso, annotato perché è la seconda volta

Ho fatto `git checkout` sul file di test per togliere il difetto della seconda
controprova, e ho cancellato il blocco di prove **non ancora committato**.
Stessa identica cosa successa ieri con `apps/conti/index.html`. La regola, da
oggi: **prima si committa, poi si inietta il difetto** — così la controprova si
ripulisce con `git checkout` senza portarsi via il lavoro.

## Prossimo passo atomico

**Estrarre `parseLavoratoriCsv` in `apps/scudo/scudo-data.js`.** L'anagrafica
dei lavoratori di Scudo è l'**unico** dei diciassette import che non passa da
una funzione pura: è un gestore scritto dentro `index.html`. Per questo è
l'unica riga «saltata» del controllo nuovo — e non è un dettaglio, è
l'anagrafica delle persone, il primo file che una cava carica. Va portata fuori
con lo stesso stile degli altri, ri-esportata dove la pagina la chiamava (un
alias, non una seconda implementazione) e aggiunta alla mappa dei 17.

## Bloccanti

- Nessuno.
