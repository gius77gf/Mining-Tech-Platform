# Checkpoint — il «Conforme» che nessuno ha misurato

**Commit:** *(questo)*
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`

## Come è stato trovato

Non leggendo il codice: **chiamandolo**. Tutte le **342 funzioni pure** dei sei
moduli dati, con input vuoti, cercando **un solo segno** — una risposta
**tranquilla** dove non è stato misurato niente. Nove casi su 342.

Otto sono legittimi (e adesso è scritto **perché**, se no la prossima lettura li
riapre). Uno no.

## Il difetto

```js
// creazione di un punto di misura
db.aggiungi("monitoraggi", { nome, unita, soglia, ricettoreId, valore: 0, letture: [] });

// sentinella-data.js:89
return { cls: "ok", label: "Conforme", ratio: r };   // ← anche con zero letture
```

Sei punti appena configurati, **nessuna lettura**:

```
riepilogoConformita -> {"conformi":6,"attenzione":0,"superamento":0,"totale":6}
il cartellone dice:     «6 punti entro soglia»
il KPI k-conf dice:     6
ogni badge dice:        Conforme (verde)
```

Non è un caso limite: è **il primo giorno di ogni cliente**. Si configurano i
punti, e prima ancora di appoggiare uno strumento la cava risulta a posto.

**Ed è più grave che altrove**, perché Sentinella è l'app che produce il report
per l'ente — e il principio violato è **nato proprio qui**, in `CLAUDE.md`:
«in Sentinella *senza dati* non è *conforme*». Il **report** era stato corretto.
Il **badge**, il **KPI** e il **cartellone** no. È il modo in cui un principio
giusto lascia indietro dei pezzi: viene applicato dove lo si sta scrivendo.

L'informazione **c'è già**: la pagina calcola `nl = (m.letture || []).length` in
due punti e la usa per ordinare, ma non per lo stato.

## La correzione decisa (da fare)

Quarta risposta prima di tutte: **«mai misurato»**, con **`ratio: null`** e non
`0` — un rapporto che nessuno ha calcolato non è zero. Poi `maiMisurati` in
`riepilogoConformita` (col totale che continua a tornare), il cartellone che lo
dice, e `kpiFrom` che non li lascia sparire in un numero che sembra buono.

⚠️ **Il test da scrivere per primo non è quello del difetto**: è quello che
impedisce di **correggere troppo**. Un punto con **una lettura a zero** deve
restare **Conforme** — «anche zero è un dato valido» lo dice già l'interfaccia
quando si registra la lettura. La condizione va scritta sulle **letture**, non
sul valore.

## Due trappole dormienti, dichiarate

`scudo.statoAzione` e `scudo.statoIspezione` rispondono «regolare» a un'azione
aperta **senza data**. Misurata la raggiungibilità prima di irrigidire:
**nessun percorso ne crea una senza data** — il form la pretende con un
messaggio esplicito, la creazione da ispezione passa sempre una scadenza, e
l'interfaccia dichiara la regola. Sono dormienti come lo erano le guardie di
`go()`, e vanno dette per quello che sono.

## La sonda resta, ed è un controllo

`apps/deepwork-id/tests/sonda-vuoto.mjs`. Fallisce in **due versi**:

1. un caso **nuovo non dichiarato** — ed è il verso che conta, quello che il
   fondo di `copertura-funzioni.mjs` **non sapeva catturare**: una soglia su un
   valore monotòno vede sparire, non comparire;
2. un caso dichiarato che **non si presenta più** — se è stato corretto la riga
   va tolta, se no l'elenco invecchia e copre cose che non esistono.

Più la terza guardia di sempre: **quante funzioni ha davvero chiamato** (342 su
342), perché uno «zero violazioni» ottenuto non chiamando niente è il difetto
raccolto tre volte in `CLAUDE.md`.

**Oggi è rosso**, sull'unico difetto vero. **Non** è ancora in `npm test`: ci
entra **col commit che corregge** `statoMisura`. Tenere la CI rossa per ore non
serve a nessuno, e il motivo per cui è rosso è scritto qui e nel documento.

## La lezione, più grande del difetto

Il principio era in `CLAUDE.md` da giorni e aveva già evitato guai in tre app.
Ma era applicato **a mano, dove chi scriveva ci pensava**. Una sonda che lo
cerca ha trovato in pochi minuti l'unico posto rimasto indietro — e proprio
nell'app dove il principio era nato.

**Un principio che vive nella memoria di chi legge copre il codice che si sta
scrivendo in quel momento. Per il resto serve qualcosa che lo cerchi.**

## In corso

Il **giro a 25 banchi** del browser è ancora vivo. Finché gira: `docs/`,
`vault/` e le suite `node`; nessuna modifica a moduli e pagine — ed è
esattamente la ragione per cui questa correzione è **decisa e non ancora
fatta**.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Sentinella — «mai misurato»**: la correzione qui sopra, cominciando dal
   test che protegge la lettura a zero, e con `sonda-vuoto.mjs` che entra in
   `npm test` nello stesso commit;
2. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
3. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
