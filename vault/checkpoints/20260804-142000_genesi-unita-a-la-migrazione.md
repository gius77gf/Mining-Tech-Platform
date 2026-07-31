# Checkpoint — Genesi unità A: l'ultima copia della struttura è sparita

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il fatto

Genesi era l'**ultima** superficie a tenersi in casa `toast`, `mdlApri`,
`mdlChiudi`, `chiedi`, `chiediValore` e i due ascoltatori (Escape, tocco fuori).
Adesso le prende da `shared/dw-app-ui.js`, e `COPIA_PROPRIA` in `run-stile.mjs`
ha **un solo nome**: `index.html`, il core — che è l'originale da cui il file
condiviso è stato estratto.

**21 sostituzioni, tutte contate** (`-1.851` caratteri netti: via 3.914 di copia
locale, dentro il commento che dice dove sono finite).

## Il banco

| | |
|---|---|
| prima della migrazione | **18 prove, 3 passate, 15 fallite** |
| dopo | **18 prove, 18 passate** |
| controprova `--prima` | **14 cadute su 18**, con **6 iniezioni** riuscite → verdetto guadagnato |

Le 3 che passavano già ieri erano quelle che la migrazione **non doveva
rompere**: nessun errore in pagina, i **sette** id dell'editor del fronte 3D, il
bottone «salva la volata». Ci sono ancora tutti.

## ⚠️ La quarta trappola, che il piano non aveva

Il piano (misurato il 03/08) elencava tre trappole: `modal` occupato dal cancello
di consenso, i sette `mdl*` dell'editor 3D, `chiediValore` col terzo parametro di
significato diverso. Tutte e tre si sono comportate come previsto. Ma:

> **Il CSS vestiva il cancello di consenso per ID: otto regole `#modal{…}`, fra
> cui `display:flex` senza condizione.**

Rinominare solo il markup avrebbe lasciato quelle regole addosso al **nuovo**
`#modal` — la modale generica, che è nascosta da `.modal-ov{display:none}`, cioè
una **classe**. L'id vince sulla classe: Genesi si sarebbe aperta con un **velo
nero fisso** davanti a tutto, senza un errore in console.

Il piano contava gli id nel markup e le chiamate nel JavaScript. Il **vestito per
id** non era nell'elenco. *Quando si sposta un nome, non basta cercare chi lo
chiama: va cercato anche chi lo veste.*

## ⚠️ E una cosa che si è vista solo guardando lo screenshot

L'etichetta della casella del consenso è una `<label>` `display:flex`: **ogni
figlio è una colonna**. Il `<b>estetici</b>` finiva in una colonna sua, e la
frase usciva spezzata in quattro pezzi affiancati, con lo spazio prima della
virgola:

```
☐  Ho compreso: i frammenti volanti     estetici     , è vietato usarli per
   sono                                              definire aree di sgombero
```

Su **un'avvertenza di sicurezza** — quella che dice che i frammenti volanti non
valgono per le distanze di sgombero. Difetto **preesistente**, invisibile
leggendo il codice, corretto con un `<span>`. È il motivo per cui la regola dice
che gli screenshot vanno **guardati**, non solo prodotti.

## Quello che NON è stato preso, di proposito

- **`go()`** — Genesi non ha pagine `.page` né la pillola `.nav`: si muove per
  sezioni `data-scr` con la sua barra in basso. Non è una copia che si è
  staccata, è un'altra cosa;
- **il foglio di stile condiviso** — è l'unità B. Il condiviso pronuncia 76
  variabili, Genesi ne definisce 12: una variabile CSS che non esiste **non
  fallisce**, la dichiarazione decade in silenzio. Adesso c'è un controllo che
  impedisce che il foglio entri per distrazione;
- **l'alone sulle schede della Home** — Genesi ne ha già uno suo, e lo scrive in
  **pixel** mentre il condiviso lo scrive in **percentuale**. Due mani sulla
  stessa variabile darebbero due posizioni diverse per lo stesso puntatore.
  L'aggancio è puntato su `.hg-item`. Quale delle due tenere è una domanda di
  colore, e sta nell'unità B.

## I controlli che si sono girati

Tre prove in `numeri-nei-documenti.mjs` erano scritte per descrivere «com'è fatta
**oggi** la pagina che stiamo per toccare», ed erano **destinate** a diventare
false. Sono cadute tutte e tre il giorno giusto. Non le ho cancellate: le ho
**girate**, e adesso guardano il verso opposto — i nomi nuovi ci sono, i vecchi
non sono tornati, il foglio di stile è ancora fuori. *Un controllo che descrive
uno stato di passaggio non si cancella quando il passaggio è fatto: si gira, se
no la pagina può tornare indietro in silenzio.*

Anche `run-stile` regola 17 si è aggiornata da sola: prima ha detto «le superfici
che caricano il condiviso sono 8, me ne aspettavo 7», poi «copie proprie trovate
[index.html], dichiarate [genesi, index.html]». Due guardie, due messaggi giusti.

E il banco è entrato in `tutti.mjs` (25 → **27** esecuzioni), con la sua
controprova. Ha una porta sua (`--porta=`) perché alza un server proprio: con la
porta posizionale di `tutti.mjs` sarebbe caduto per EADDRINUSE dentro un elenco
dove l'esito si legge come «banco rosso».

## Stato

Tutte le suite `node` verdi: kpi 1006, stile 264, helper 48, pointcloud 26,
manifest 9, demo 7, sonda 7, copertura 424/424, nomi doppi 0, documenti 14.

## Prossimo passo atomico

1. **rilanciare il giro completo del browser** (27 esecuzioni) sul codice di
   adesso — è la prima volta che il giro saprà dire da sé se qualcuno gliel'ha
   cambiato sotto, e la prima con Genesi dentro;
2. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2
   (`docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`: lato cella e quota di base
   sono già calcolati da `volumeCumulo` e buttati una riga dopo, e il lato cella
   da solo sposta il volume del **22%**);
3. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`;
4. **Genesi unità B** — la palette dichiarata, che è una decisione di colore.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.
