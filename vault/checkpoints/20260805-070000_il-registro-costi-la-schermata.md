# Il registro costi: la schermata

**Data:** 05/08/2026 · **App:** Conti
**Unità precedente:** `20260805-060000_il-registro-costi-i-totali.md`

## Cosa è stato fatto

I due conti dei costi c'erano già (`riepilogoCosti`, `costoPerMetroCubo`) ma
non aveva ancora un posto da cui usarli nessuno. Ora Conti ha una **ottava
scheda, «Costi»**: la collezione, il modulo di inserimento con le dieci voci,
la ripartizione per gruppo e il costo al metro cubo.

Era la metà che mancava. Conti sapeva dire quanto **entra** — fatture,
incassi, canone — e non sapeva dire quanto **esce**: «quanto costa un metro
cubo», che è la domanda con cui si decide un prezzo di listino, non aveva
nessun numero da cui partire.

Cosa c'è dentro:

- **la collezione `costi`** (`data`, `voce`, `importo`, `nota`), in vivo e in
  dimostrazione. Le organizzazioni che non ne hanno mai registrato uno leggono
  una lista vuota, come per gli incassi e le note di credito;
- **dodici costi d'esempio**, e tre stanno lì apposta perché fanno vedere il
  dato sporco del primo mese: uno con una voce fuori elenco, uno senza data,
  e due voci che Flotta registra già;
- **il modulo**: la tendina delle voci raggruppata (`optgroup`), l'avviso vivo
  quando si sceglie una voce che Flotta registra già, la data obbligatoria con
  la ragione scritta;
- **la ripartizione per gruppo** con la barra «dove se ne va», il totale che
  quadra con l'elenco, e l'**export CSV** che porta con sé anche le voci senza
  data, marcate;
- **il costo al metro cubo**, che resta un trattino finché il volume non c'è.

## Le tre regole di condotta della schermata

1. **Una voce fuori elenco non diventa «spese generali».** Si vede per quello
   che è, in un gruppo suo, con scritto cosa fare. Nella controprova questa
   riga da 60 € finisce dentro «Spese generali» e il totale del gruppo passa da
   88 a 148: nessuno se ne accorgerebbe mai.
2. **Un costo senza data non sparisce in silenzio** da un periodo: resta in
   fondo all'elenco, contato a parte, con la ragione.
3. **Il costo al metro cubo non si calcola senza i metri cubi.** Il
   travestimento qui sarebbe un numero **basso**, cioè la notizia che chi
   guarda vuole leggere.

## I due difetti trovati allo scatto, non leggendo il codice

**1. La barra in basso è andata a capo.** `.nav` è una **griglia a colonne
fisse** (`--nav-cols`): la voce «Costi» è l'ottava, e il numero era rimasto a
7. La barra non si è stretta — ha mandato «Report» su una **seconda riga**,
sotto le altre. Nessun errore in console, nessun test rosso. Corretto a
`--nav-cols:8`, misurato su otto larghezze da 320 a 1180 px: una riga sola,
niente che trabocca, nessuna etichetta al limite.

**2. La tendina tagliava proprio l'avviso.** L'opzione diceva «Carburante —
anche in Flotta» e a 430 px si leggeva **«Carburante — anch…»**: la coda persa
era l'unica parte che serviva. È la stessa lezione già scritta nel Listino per
le unità di prezzo, ripetuta uguale tre schede più in là. Tolta la coda
(l'avviso vive nella nota sotto il modulo, che ha tutta la riga) e — quando il
banco ha misurato lo spazio vero — **la voce ha preso tutta la riga**: in mezza
riga tre etichette su dieci uscivano comunque tagliate.

E due testi corretti perché **mentivano sullo schermo che avevano accanto**:
la nota diceva che le voci non classificate «non entrano nella ripartizione per
gruppo» mentre il loro gruppo era lì sotto, visibile; e `plur` incollava il
numero a una frase che non lo voleva («1 Questa voce non ha una data»).

## Le prove

- **`apps/deepwork-id/tests/browser/registro-costi.mjs`** (nuovo): 31 prove
  che aprono la pagina — la barra su una riga a 430 e a 360 px, il totale che
  quadra con le righe **e** con i gruppi, la voce ignota che ha un gruppo suo,
  la voce senza data che resta visibile, il costo al metro cubo che senza
  volume non è un numero, la tendina che non taglia niente, l'avviso su Flotta
  che compare e tace al momento giusto, la registrazione che entra nel conto.
- **La controprova rimette due difetti veri** nella risposta HTTP:
  `--nav-cols:7` e `gruppoDiVoce` che ricade su `"generali"`. Ne cadono **6**,
  e sono esattamente quelle giuste.
- **Due prove nuove in `run-kpi.mjs`** sul fatto che `riepilogoCosti`
  restituisce le **righe** che ha sommato: serve a far mostrare alla schermata
  esattamente quelle, invece di riscrivere la regola del periodo una seconda
  volta nella pagina. Provate contro il difetto rimesso: cadono tutt'e due.

Stato: `run-kpi` **1054**, prove `node` **1.408**, copertura **435/435**,
banchi del browser **35**, `run-stile` 264, `nomi-doppi` 26 nomi / 0 da
sistemare. I tre documenti col conteggio delle prove erano invecchiati e
`numeri-nei-documenti.mjs` li ha fatti cadere: aggiornati.

## Prossimo passo atomico

Il **ponte col volume di Terra**: oggi il costo al metro cubo chiede i metri
cubi a mano, e i metri cubi esistono già — `riconciliazione(RIL, PES, d1, d2)`
li calcola nella scheda Report della stessa app. Va aggiunto un modo di
prendere il denominatore da lì (con la sua provenienza dichiarata: **quale**
periodo, **quanti** rilievi, e cosa succede quando i rilievi non ci sono),
invece di chiederlo a chi guarda.

Subito dopo: rendere verificabile in `run-stile.mjs` la regola che questa
unità ha imparato a proprie spese — **il numero di bottoni `nav-*` di una app
deve essere uguale al suo `--nav-cols`**. Vale per tutte e sei le app più il
core, non fallisce da sola, e si vede solo allo scatto.
