# Checkpoint — il numero che spiega il numero era già calcolato

**Commit:** *(questo)*
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`

## Il modo più netto di dirla

Il **verbale di rilievo** — il foglio che accompagna il rilievo quando lo si
mostra a un ente — ha già una sezione intitolata, testuale, **«Come è stato
ottenuto il numero»**. Per un volume arrivato dal visore, quella sezione **non
può dire niente di vero**, perché di quel calcolo Terra non conserva nessun
parametro.

E non è che i parametri manchino. `volumeCumulo` (`pointcloud.js:133`) ne
ritorna **cinque**:

```js
return { volume, areaCelle, celle, zBase, cella };
```

Il visore ne salva **uno**. `zBase`, `cella`, `areaCelle`, `celle` sono
**calcolati e buttati una riga dopo**. Poi Terra prende il solo volume, e lascia
indietro perfino `puntiRitaglio` e `puntiTotali`, che il visore invece salva.

## Quanto pesa, misurato

Cono sintetico di volume noto (**1.413,7 m³**), `volumeCumulo` vera:

| lato cella | volume | scarto |
|---|---|---|
| 0,25 m | 1.398,0 | **−1,1 %** |
| 0,50 m | 1.443,0 | +2,1 % |
| 1,00 m | 1.535,3 | +8,6 % |
| 2,00 m | 1.726,4 | **+22,1 %** |

Il verso è **strutturale**: ogni cella prende la quota **massima**, quindi più è
grossa più tira la superficie in alto. E **la cella non la sceglie l'utente**:
la sceglie il software, `(x1-x0)/60` limitato fra 0,25 e 2. Ritagliare un fronte
intero invece di un pezzo sposta il numero di un quinto, e da nessuna parte
compare il perché.

La quota di base è una **moltiplicazione**, non una sfumatura: il volume è
`Σ (quota − zBase) × cella²`, quindi 1 m di base sbagliata vale **area coperta**
in m³ — sul cono **729 m³**, cioè ~**401 €** di canone e 729 m³ di concessione
consumati o no. La difesa c'è già ed è buona (`zBase` è il **2° percentile**,
non il minimo, per non farsi gonfiare da un punto spurio) ma è **invisibile**:
nessuno può verificarla dopo, perché il valore non si conserva.

## Un difetto vero, trovato misurando

Il ponte di Terra scrive `$("new-ril-data").value = oggiISO()` e subito dopo
`err("new-ril-data", false)`: la data va a **oggi** e il campo è marcato
**valido**. Ma il visore la data ce l'ha (`timbroLocale()`). Chi elabora il volo
del lunedì il giovedì si ritrova un rilievo datato giovedì, precompilato, verde,
e nessun motivo per guardarlo — e la data entra nel confronto fra rilievi, nei
giorni fra i due, nel ritmo al giorno e nel periodo del canone.

**Decisione:** la data si precompila con quella del visore, **dicendo da dove
viene**, e resta **da confermare**. Stesso criterio del metodo, che il ponte già
tratta bene (mette «senza GCP», cioè sbaglia **verso il basso** sulla qualità,
che è la direzione sicura).

## Le altre due decisioni

- **Il rilievo porta la sua provenienza in un oggetto solo** (`origine`), così
  `origine == null` vuol dire una cosa sola e chiara — *non sappiamo come è
  nato* — e i rilievi vecchi ci ricadono senza inventare valori.
- **Il verbale dice quello che sa e ammette quello che non sa**: per un rilievo
  senza `origine` scrive che la provenienza del calcolo non è registrata, invece
  di tacere — che è la forma in cui l'assenza si traveste da normalità.

E il corollario che vale per tutta la famiglia: **una misura che non si può
rifare non si può difendere.**

## Le misure non restano nel documento

`run-pointcloud.mjs`: **23 → 26**. Le tre prove blindano il **verso**, non i
decimali: monotonia sui quattro lati cella (con lo scarto 0,25→2 m che deve
restare **oltre il 15%**), la cella fine entro il 5% dal cono esatto, e
l'invarianza per traslazione verticale — che è il modo di verificare che `zBase`
sia **misurata** e non fissa.

**Controprova: cinque difetti** su una **copia** di `pointcloud.js` (il file
vero lo importa una pagina, e mentre gira un giro del browser non si tocca).
Cinque su cinque cadono col nome giusto; sul modulo sano **26 passate, 0
cadute**.

**Una correzione alla controprova stessa**, ed è la solita lezione: la prima
iniezione «base cablata a zero» scriveva `zBase = 0` **dopo** la dichiarazione,
ma `zBase` è `const` — il modulo moriva con *«Assignment to constant variable»*
e **tutte e sette** le prove cadevano. Un ✓ per il motivo sbagliato: caso (3)
della tassonomia in `CLAUDE.md`, l'iniezione non aveva iniettato niente, aveva
rotto il file. Si riconosce dal **numero** di prove cadute — sette invece di una.

## Numeri

- `run-pointcloud.mjs` **23 → 26** · totale `node` **1.343 → 1.346**
- controprove della giornata: 8 (misure Genesi) + 5 (cella e base) = **13**,
  tutte cadute col nome giusto

## In corso

Il **giro a 25 banchi** del browser è ancora vivo. Finché gira: `docs/`,
`vault/` e le suite `node`; nessuna modifica a moduli e pagine.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`, e sei
   prove dicono se è stato fatto);
2. **Terra/Genesi — unità 1 e 2 della tracciabilità**: il visore conserva quello
   che ha già calcolato, e il ponte lo porta in `origine` con la data che non si
   inventa. Sono le due più piccole e sbloccano il verbale;
3. **Conti — nota di credito**, cominciando dalla prova su
   `tempoMedioPagamento`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
