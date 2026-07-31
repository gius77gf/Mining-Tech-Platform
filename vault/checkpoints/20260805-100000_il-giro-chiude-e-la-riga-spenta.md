# Il giro chiude 34 su 35, e la riga che era spenta

**Data:** 05/08/2026 · **App:** Sentinella
**Unità precedente:** `20260805-090000_il-ponte-col-volume-di-terra.md`

## Il giro completo, letto fino in fondo

È la verifica che mancava da due blocchi. Lanciato **da solo**, senza nessun
altro browser aperto: **1 ora e 40 minuti**, e nessun «GIRO NON VALIDO» — cioè
l'impronta ha retto, niente si è mosso sotto.

**34 banchi a posto, 1 da guardare.** Il solo KO era vero, e il banco nuovo di
questo blocco (`registro costi`) è passato **insieme alla sua controprova a
quattro difetti** dentro il giro completo.

E si conferma la diagnosi del blocco precedente: nel giro affamato i primi due
banchi avevano preso più di un'ora; da soli ne prendono venti. La contesa di
CPU su quattro core costava **circa 3,5 volte**.

## Il difetto, e perché il contrasto era solo il sintomo

Sentinella mostra, per ogni punto di misura, una tabellina che confronta il
mese in corso con quello prima. La riga di un mese **senza letture** veniva
disegnata col colore dei **disabilitati** e con i numeri **barrati**.

Tre cose sbagliate, in ordine di importanza:

1. **Marcava «trascurabile» proprio dove il dato manca.** È il contrario di
   quello che questa app dichiara ovunque, ed è la forma più semplice del
   principio del fondatore letta al rovescio: non un numero tranquillo dove non
   si è misurato, ma un **grigio** — che ottiene lo stesso risultato, far
   guardare altrove.
2. **La barratura non aveva un soggetto.** Quelle celle scrivono «—»: non c'è
   nessun valore da annullare.
3. **E non si leggeva:** 3,83:1 a 11 px, contro il 4,5 che serve. La riga che
   porta la notizia era anche la meno leggibile dello schermo.

Adesso la riga si legge come le altre e il **mese** prende il colore d'avviso.
Misurato dal browser dopo la correzione: mese `rgb(248,172,61)`, numeri
`rgb(157,180,203)`, `text-decoration: none`.

## ⚠️ Trovato solo perché le prove girano con l'orologio del cliente

Vale la pena scriverlo perché è la dimostrazione più netta finora di quella
regola. Il difetto **esiste solo quando il mese in corso non ha ancora
letture**, cioè nei primi giorni del mese. Il contenitore è a Greenwich, dove
era ancora **31 luglio** — e luglio ha letture. In Italia agosto era già
cominciato.

Ri-provandolo si vede in diretta: senza `TZ`, la tabella mostra «Luglio 2026
(in corso), 1 lettura» e **la riga `.ko` non esiste in pagina**; con
`TZ=Europe/Rome` compare «Agosto 2026 (in corso), 0» ed è quella difettosa.
Un controllo che gira in un fuso diverso da quello del cliente misura
l'ambiente, non il prodotto.

## La verifica

- `contrasto.mjs` su tutte e nove le superfici: **3.492 testi misurati, 0 sotto
  soglia** (Sentinella da sola: 495). Prima della correzione lo stesso banco
  dava KO su quella riga: il **prima/dopo è sul file vero**, che è più forte di
  un'iniezione.
- Scatto guardato, non solo prodotto, e i colori **effettivi** letti dal
  browser con `getComputedStyle` — non quelli scritti nel foglio.

## Prossimo passo atomico

Il **trapianto della chiusura del mese** in Conti: `statoMese`,
`vociMancantiNelMese`, `margineMese`, `arriviDopoLaChiusura` sono già scritte e
verdi a **28 prove** in scratchpad, con i bordi coperti (la percentuale che non
si calcola su ricavi zero, la chiusura di un altro mese che non chiude questo,
e il campo `registratoIl` che ancora non esiste — dove `undefined > "2026-08-04"`
è **vero** in JavaScript). Vanno nel modulo dati con le prove in `run-kpi.mjs`,
poi la schermata.

In coda, con le funzioni già provate: i **lotti di Terra** (13 prove) e
l'**analisi della causa** in Scudo (12 prove). E prima o poi, meglio prima, il
**giro su una copia** (`docs/PIANO_GIRO_SU_COPIA.md`): finché il giro pretende
che nessuno lavori per un'ora e mezza, quella regola verrà violata ancora.
