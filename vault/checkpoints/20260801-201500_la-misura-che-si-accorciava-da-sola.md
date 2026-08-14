# La misura che si accorciava da sola

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/stati-sorvegliati.mjs`,
`browser/stati-non-misurati.mjs`, `apps/scudo/scudo-data.js`
**Unità precedente:** `20260801-192000_lo-stato-che-non-puo-stare-in-vetrina.md`

## Il lavoro previsto: «non registrato», quattro app

Presa la voce successiva della classifica. Guardate a mano, come dice la
regola, e misurate **chiamando le funzioni come le chiama la pagina**:

| dove | che cos'è |
|---|---|
| **Conti** · «incassata, data non registrata» | ⛔ stato vero, e la dimostrazione lo produce già (`f5`) |
| **Scudo** · «addestramento non registrato» | ⛔ stato vero, ma vedi sotto |
| Scudo · «Formazione non registrata» | già in dimostrazione, pastiglia rossa della matrice |
| Terra · `origineDi` → `{da: "non registrata", noto: false}` | il `noto` lo consuma `descriviOrigine` **dentro il modulo**: è il disegno giusto (regola 7) |
| Flotta · «Pezzo non registrato in magazzino» | **suggerimento di un campo**, non uno stato: dichiarato, non si riguarda |

## ⛔ Scudo: lo stato c'era, ma era sempre in compagnia

`allarmiDpi` sui dati d'esempio dava **un allarme solo**, e il suo motivo era
«da sostituire · **addestramento non registrato**». Cioè la frase c'era, ma
**mai da sola** — e la pagina accende la pastiglia «Addestramento» e il bottone
«Addestrato» solo quando `a.motivo === "addestramento non registrato"`, con
l'uguaglianza secca. Risultato: quella pastiglia e quel bottone erano **codice
morto in dimostrazione**, come le tre difese di Scudo di stamattina.

Aggiunta **una** consegna (`e25`: otoprotettori all'autista dumper, validi fino
al 2029, addestramento mai registrato). È un'**assenza**, quindi per la regola
scritta nell'unità precedente sta bene nei dati d'esempio. Provata prima in
scratchpad: allarmi 1 → 2, il secondo con la pastiglia giusta e il bottone
acceso, e **nessuno stato della matrice cambia**. Accende anche il secondo giro
di `allarmiDpi`, quello degli addestramenti **fuori** dalle mansioni, che fino a
oggi non aveva mai prodotto una riga.

## ⛔⛔ E poi la misura ha mentito, nella direzione che rassicura

Aggiunte le due righe al banco, ho rilanciato `stati-sorvegliati` per vedere la
lista accorciarsi. Si è accorciata **troppo**: sparivano «non registrato» e
«non registrata» anche da **Campo, Flotta e Terra**, che non avevo toccato.
Le frasi «nominate dal banco» passavano da **20 a 27** con due righe.

Causa: `frasiSorvegliate` restituiva **un insieme solo**, globale. Una frase
sorvegliata in *una* app risultava sorvegliata in *tutte e sei*. È la stessa
famiglia del «controllo che non guarda dove crede», ma nella forma peggiore:
la lista di lavoro **si accorcia da sé**, e i posti tolti sembrano a posto senza
che nessuno li abbia guardati. Con questa misura si decide da dove cominciare:
una lista che si sgonfia da sola manda la prossima unità altrove.

Corretto: il banco dichiara l'app in testa a ogni riga (`['scudo', …]`), quindi
il file si taglia in **segmenti** e i motivi contano per l'app del loro
marcatore. I due elenchi che l'app non ce l'hanno in ogni riga — `FOGLI_CONTI` e
`CARTELLE` — sono **dichiarati** in `SEZIONI`, con scritto che cosa succede a
chi ne aggiunge uno e se ne dimentica.

Numeri veri: 40 occorrenze, **11** nominate dal banco (non 20, e non 27),
38 motivi in **23 segmenti**, **0** motivi senza app.

**Controprova**: rimessa la riga globale (11 caratteri), la misura **si ferma
con uscita 1** e dice *«flotta si prende una frase che non dice»*. La prova sta
dentro il file, come quella del confine di parola: quattro casi su un banco
finto, e l'unico che cade è esattamente quello dell'attribuzione sbagliata.

⚠️ E nell'intestazione c'era un numero **contato a mano** («il banco ne guarda
diciassette») che nessuno misurava: tolto, perché è il difetto per cui esiste
`copertura-funzioni.mjs`.

## La controprova del banco

`inietta.mjs` rimette due difetti, uno per app, e **stampa quanti soggetti ha
toccato**: `addestramentoMancante` sempre falso in Scudo (−46 caratteri) e la
frase dell'incasso ridotta a stringa vuota in Conti (−30). Il banco cade sui due
casi giusti. Ripristinato dalla radice, `git status` pulito sui due file.

## Verifica

`stati-non-misurati` **63/0** — 32 stati, 6 app (erano 58/0 e 30).
`run-kpi` 1121/0, `run-demo` 8/0, `run-stile` 271/0, `suite-collegate` 3/0 su
46 file, `sonda-vuoto` 7/0, `numeri-nei-documenti` 17/0.

## Prossimo passo atomico

La classifica adesso dice il vero, ed è più lunga di prima. Le voci in testa,
con l'avvertenza che restano **candidati da guardare a mano**:

```
3 app · «non indicata»      2 app · «non dichiarata»
3 app · «senza data»        2 app · «non dichiarato»
2 app · «non lo sappiamo»   2 app · «non indicato»
```

Si comincia da **«non indicata»** (tre app: Sentinella, Conti, Terra), con
l'ordine ormai fisso: prima si guarda se la dimostrazione lo produce —
chiamando le funzioni come le chiama la pagina — e solo dopo si sceglie fra
aggiungere un'assenza, raggiungerlo digitando (se è una contraddizione), o
scrivere solo la riga del banco.
