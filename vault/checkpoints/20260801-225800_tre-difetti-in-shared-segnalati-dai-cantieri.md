# Tre difetti in `shared/`, e tutti e tre segnalati da un cantiere

**Data:** 01/08/2026 (notte) · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Partenza del ciclo:** `04692c3` (canarino)
**Unità precedente:** `20260801-232500_cinque-cantieri-e-il-giro-che-non-si-chiudeva.md`

## La cosa che conta più dei tre difetti

Tutti e tre li ha trovati un **cantiere d'app**, e tutti e tre li ha **lasciati
stare** scrivendo nel rapporto «serve a più di una app, `shared/` è serializzato
su di te». Nessuno si è scritto una copia di comodo per andare avanti.

È la prova che la regola del `shared/` funziona nel punto in cui di solito si
rompe: **quando rispettarla costa a chi la rispetta.** Il cantiere di Conti
aveva la sua unità da chiudere e ha preferito scrivere due righe di rapporto
invece di due righe di codice in casa propria.

## I tre difetti

**1. Il giro di andata e ritorno del CSV non si chiudeva.** Sette valori
scritti da noi e riletti da noi, quattro rotti. Il caso che morde è il più
banale: un numero **negativo** esce come `'-12,5` — l'apostrofo che `csvCell`
mette contro la CSV-injection — e rientra `NaN`.
La forma conta più del caso: **la prova c'era**, ma sul lettore **vecchio**.
`leggiCsv` è arrivato dopo, ha preso il mestiere e non le difese.

**2. `giorniTra` sbagliava nei due versi opposti**, e la usano **cinque app**.
`new Date(dataISO + "T00:00:00")`:
- **inventa un numero per una data che non esiste** — «2026-02-30» non viene
  rifiutata da `Date`, viene fatta *scorrere* al 2 marzo. Effetto misurato in
  Conti: una fattura con scadenza 30 febbraio usciva «**insoluta da 152
  giorni**» invece che «senza scadenza». Non un numero sbagliato: **una lettera
  di sollecito a un cliente, per una data che non c'è**;
- **perde una data buona** — un istante («2026-06-30T10:00») diventava
  `…T10:00T00:00:00`, cioè `NaN`, e la scadenza spariva.

⚠️ E la controprova dice la cosa più utile della giornata: rimettendo il
difetto cadono **2 prove in `run-helpers` e ZERO in `run-kpi`**, sulle cinque
app che la usano. **Nessuna prova d'app copriva il caso** — ed è esattamente
per questo che il difetto è sopravvissuto. Una funzione condivisa provata solo
dove abita non è provata dove serve.

**3. `avvolgiUnita` non conosceva la tonnellata** — né da sola («300,00 T») né
in coda a un prezzo («€ 11,50/T», «€ 4,20/M³»): la pastiglia è
`text-transform: uppercase` e un'unità fuori dallo `<span class="u">` ci
finisce dentro. Serve a Conti, Terra e Flotta.
⚠️ «t» è **una lettera sola**, quindi la difesa è la stessa di «h»: una cifra
prima e nessun carattere di parola dopo. Misurato prima di aggiungerla: «12
tonnellate», «il 3 turno» e «2026-08-01T00:00» **non** vengono toccati.

## Il filo che li lega, e che vale per domani

Tutti e tre sono **la risposta che era già in casa**: `dataISOEsiste` stava
nello stesso file da mesi, l'innesco di formula era già scritto in `csvCell`,
e l'elenco delle unità c'era. Nessuno dei tre richiedeva un'idea nuova:
richiedeva di **guardare** invece di riscrivere.

E la stessa `dataISOEsiste` stasera ha corretto **due** cose a distanza di ore
— prima `dataIt` in Terra e Flotta, poi `giorniTra` per cinque app. Quando una
funzione di `shared/` risolve un difetto, vale la pena chiedersi **chi altro
sta facendo quel lavoro a mano**.

## Verifica

`run-helpers` da **49 a 57**. Sulla copia di ciò che si committa: `run-kpi`
1384/0, `run-stile` 282/0, `run-demo` 8/0, copertura **11 soggetti, 0 funzioni
scoperte**, `numeri-nei-documenti` 19/0.
Controprove: 3 iniezioni sul CSV (3 prove cadute), 1 su `giorniTra` (2 cadute,
e lo zero in `run-kpi` dichiarato sopra), le unità provate sui casi che
**non** devono essere toccati.

## Prossimo passo atomico

Raccogliere **Campo** (gli orari veri del turno) — è l'ultimo cantiere ancora
aperto — verificarlo sulla copia e committare.

Poi gli altri due difetti che il cantiere di Genesi ha trovato e non ha
blindato: un **codice di norma sconosciuto** prende in silenzio la soglia
residenziale (l'etichetta e il numero raccontano due cose diverse), e
`sitoFit` scrive **`r2: 0`** dove r² non è calcolabile.
