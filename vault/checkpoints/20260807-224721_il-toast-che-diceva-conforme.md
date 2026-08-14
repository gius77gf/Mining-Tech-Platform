# Checkpoint — 2026-08-07 23:0x UTC

## Tipo
unit-complete (il toast di Sentinella + la regola 28 che lo tiene chiuso)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4ac0790` — *barra-etichette guarda anche le voci che non sono `<button>`*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 207 | **il toast di Sentinella** (`428a002`) | «Conforme» → «Superamento» sulla stessa lettura |
| 208 | **regola 28 di `run-stile`** (`f28c647`) | prove **2.300 → 2.301**, run-stile **295 → 296** |
| 209 | **`barra-etichette` vede anche `.bn`** (`4ac0790`) | Conti invariata a **40** etichette |

## ⛔ Il difetto peggiore della serata, e non è in un documento
`conSoglia` porta la soglia del **ricettore** (l'autorizzazione per **quella**
casa, spesso più stretta di quella del punto). Il suo commento elenca chi deve
passare di lì: «semaforo, KPI, grafico, allerte, report» — un elenco **scritto a
mano**, che come tutti si era accorciato. La **striscia di conferma** che
compare quando si registra una misura prendeva `m` da `MON.find`, grezzo.

Misurato — punto con soglia 20 su una casa da 5 mm/s, lettura 8:
```
soglia scritta sul punto : 20 | EFFICACE (casa): 5 | fonte: ricettore
PRIMA — la conferma di scrittura => "Conforme"
DOPO  — come badge/KPI/report    => "Superamento"
```
È la frase che l'utente legge **nell'istante in cui scrive il dato**, e che gli
dice di stare tranquillo mentre la riga due centimetri sopra dice il contrario.

## ⛔ E adesso non è più la memoria a tenerlo
**Regola 28**: nessuna chiamata a `statoMisura(` può nascere fuori da
`conSoglia`, e la regola stampa **quante** ne ha guardate. Controprovata
rimettendo il difetto vero: cade. Ripristino da **copia** con `diff -q`.

## ⚠️ Quattro errori miei, tutti presi da controlli che esistono apposta
1. il blocco appeso **in coda** al file: totale fermo a 295 e «0 falliti» come
   un test che passa — l'ha preso *«il totale deve SALIRE»*;
2. numerata **25**: già presa (elementi fissi e invisibili);
3. rinumerata **26**: già presa anche quella (i dati del fondatore). Il primo
   numero libero era **28**;
4. `mascheraCodice` usata come **stringa** — torna una maschera di byte lunga
   quanto il testo: «matchAll is not a function».
⚠️ E un addendo dei documenti era sbagliato **da prima**: 1853 dove `run-kpi`
ne fa 1885.

## ⚠️ E il righello aveva sbagliato anche nella misura del difetto
La mia prima sonda scriveva la soglia del ricettore in `sogliaPPV`, mentre
`sogliaDelRicettore` legge `soglia`: «efficace 20», nessuna differenza. Non era
il prodotto che non distingueva — era la forma finta del ricettore. Riletta la
funzione invece di indovinarla, il difetto si è riprodotto al primo colpo.

## Stato delle prove
Prove **2.301** (`run-kpi` 1885, `run-stile` **296**), copertura **702/702**,
banchi **153**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia.

## Che cosa sta girando adesso
⛔ Il giro completo (19:08 su `2ab9535`), a **212 sezioni**, con attesa armata.

## Prossimo passo atomico
1. ⛔ **Scudo: la gravità sconosciuta che diventa «lieve»** — proposta da un
   cantiere e **non ancora verificata da me**. Un evento importato come
   *mortale* esce dal nostro CSV come *lieve*, verso l'RSPP; e la riga sopra,
   sullo stesso oggetto, ricade di proposito sul caso **più prudente**.
   Verificare contro il codice, correggere, blindare.
2. ⛔ **Scudo: `nominaAttiva` con data di fine illeggibile** — `giorniTra` dà
   `NaN`, la guardia non scatta, la nomina resta attiva per sempre; la regola
   giusta è due righe sopra. Dichiarata **dormiente** dall'agente: verificarlo.
3. ⛔ **Sentinella: la lettura a mano che taglia lo storico a 50** mentre
   `MAX_LETTURE` è 500 e l'import lo dichiara — **151 letture cancellate**.
4. ⛔ **Raccogliere il giro** e rilanciarlo sul commit corrente.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- La barra vera del core: si **dichiara** non misurata, non è ancora misurata.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
