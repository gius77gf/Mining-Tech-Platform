# Checkpoint — 29/07/2026 19:00 UTC

## Cosa era successo
Alle 17:20 UTC i quattro cantieri ancora aperti (Scudo, Conti,
Terra+Sentinella, Flotta) si sono fermati tutti insieme per il **limite di
sessione della piattaforma** — l'unico stop legittimo previsto dalla regola
del fondatore. Il loro lavoro parziale era finito nei commit di salvataggio
automatici: codice in albero, ma **non verificato**, perché tutti e quattro
si erano interrotti esattamente al passo della prova finale.

## Prima cosa fatta: accertarsi che niente fosse rotto
Prima di andare avanti, il controllo che contava: una app rotta nel branch è
peggio di una funzione mancante.
- Sintassi di ogni script inline e di ogni modulo dati delle quattro app:
  **pulita**.
- Le quattro pagine aperte in Chromium a 1280 e 390 px: **nessun errore,
  nessuno scorrimento orizzontale**.
- Suite: **179 KPI, 7 demo, 43 helper — tutte verdi.**

Quindi il branch era sano: il codice scritto dai cantieri è consistente,
mancava solo la loro verifica.

## Cosa ho fatto invece di rifare il lavoro
I quattro cantieri sono stati **ripresi dal punto esatto in cui si erano
fermati**, con il loro contesto intatto, e con un compito ristretto: *solo*
la verifica finale, nessuna funzione nuova. Rifare da capo 4.600 righe già
scritte sarebbe stato uno spreco; e commit come "fatto" senza la prova
sarebbe stato peggio.

A ciascuno ho ricordato la prova che nel suo caso conta di più:
- **Scudo**: mansione scoperta → matrice che lo segnala; DPI → verbale;
  formazione scaduta → deve entrare nello scadenzario che già esiste.
- **Conti**: acconto + saldo che tornano **al centesimo**, incasso che
  eccede il totale rifiutato con una spiegazione, fattura vecchia marcata
  incassata senza data che resta incassata.
- **Terra+Sentinella**: stampa del verbale e del report, con controllo
  esplicito delle unità di misura — un maiuscolo di stile aveva già
  trasformato µg/m³ in MG/M³ una volta, e su un documento che va all'ente
  sono milligrammi, mille volte tanto.
- **Flotta**: compatibilità con mezzi senza tipo e collezioni assenti, dopo
  la regressione che nel giro precedente aveva rotto la pagina alle
  organizzazioni esistenti.

## Unità completata nel frattempo: la descrizione della PR #322
Era ferma a **51 commit** mentre ormai sono 85, e soprattutto dichiarava
ancora «2 rotture preesistenti in `run-kpi.mjs`» — che nel frattempo sono
state chiuse. Una descrizione che mente su un punto di qualità è peggio di
una descrizione assente.

Riscritta per intero: le funzioni delle schede di ricerca app per app,
Genesi da «quanto» a «dove», la correzione della soglia nel motore dei
grafici, e le verifiche vere (179 KPI, 7 demo, 43 helper, 23 pointcloud, 9
manifest). Aggiunto anche il terzo limite dichiarato, che prima non c'era:
il blocco del turno chiuso di Campo vive nel browser e va ripetuto nelle
regole Firestore.

## Prossimo passo atomico
Raccogliere i quattro cantieri appena rientrano, con la stessa verifica
indipendente usata per Campo: non basta che la pagina si apra, si controlla
l'affermazione. Poi commit per app, spunta in roadmap e checkpoint.

Se rientrano puliti, il seguito è **Genesi G6 — banda d'incertezza da
precisione di perforazione**: i fori non finiscono mai esattamente dove sono
disegnati, e una previsione che non dice di quanto può sbagliare è una
previsione a metà. Tutto sintetico, nessun dato nuovo richiesto al cliente.
