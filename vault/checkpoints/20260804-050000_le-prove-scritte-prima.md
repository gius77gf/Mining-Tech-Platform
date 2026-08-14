# Checkpoint — la seconda forma di vuoto, e le prove scritte prima

**Commit:** `aa0bb3f` (seconda sonda), `93e0502` (le prove prima della correzione)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. C'erano due vuoti, e la sonda ne guardava uno

La prima passata chiamava le funzioni con la **lista vuota** — «non c'è nessuna
riga». Ma il vuoto più frequente è un altro: **la riga c'è e non è compilata**.
Si crea la scheda e la si lascia a metà.

Rifatta con `[{}]` al posto di `[]`: **tre casi in più**, senza cambiare una
riga della logica. Due legittimi (una consegna DPI senza scadenza *è* regolare:
un gilet ad alta visibilità non scade). Il terzo no.

## 2. `flotta.urgenzaOre`, tre facce dello stesso buco

| `orePreviste` | `oreAttuali` | risposta |
|---|---|---|
| `null` | 500 | **`SCADUTA (+500 h)`, rosso** |
| `""` | 500 | **`SCADUTA (+500 h)`, rosso** |
| `"boh"` | 500 | **`tra NaN h`**, verde |
| `null` | `null` | **`a 0 h`** |

Un tagliando **senza ore obiettivo** dichiarato **scaduto da 500 ore**. È
`+null === 0`, la trappola dormiente già in `CLAUDE.md`, e qui produce un
**allarme inventato** — ecco perché la prima sonda non l'aveva visto: cercava il
*tranquillo*, e questo è il contrario.

**La cosa istruttiva**: la funzione era stata **appena corretta** per il difetto
gemello, e il commento lo racconta bene («*zero ore* e *non lo so* sono due cose
diverse»). La guardia è finita su **`oreAttuali`** e non su **`orePreviste`**.
Stesso difetto, stessa funzione, stesso giorno: **metà chiusa e metà no**.

**Raggiungibilità misurata: dormiente.** Tutti e quattro i chiamanti guardano
prima (`if (n.orePreviste)`, `if (+(n && n.orePreviste) > 0)`), e il form passa
da un validatore. Ma la protezione poggia su **quattro punti che si ricordano**,
e la correzione è di **tre righe** dentro la funzione, nella stessa forma già
scritta lì accanto per l'altro parametro.

## 3. Le prove delle due correzioni, scritte **prima** delle correzioni

Girano sul modulo **vero** in sola lettura — nessuna iniezione — quindi si
possono lanciare anche mentre gira un giro del browser.

| correzione | prove | esito oggi |
|---|---|---|
| Sentinella «mai misurato» | 6 | **5 cadono**, 1 passa (ed è quella che deve passare anche dopo) |
| Flotta `orePreviste` | 6 | **4 cadono**, 2 passano (il comportamento buono da non mangiarsi) |

Scriverle prima serve a non scriverle **addosso** al comportamento appena
ottenuto — che è il modo più facile di produrre una prova che non prova niente.

**E una delle sei è stata rifatta, perché passava già oggi.** Diceva «un punto
mai misurato non diventa il punto messo peggio» e confrontava i due `ratio`:
passava, e **non perché il codice fosse a posto** — `0 > 1,6` è falso
esattamente come `null > 1,6`. **Caso (1)** della tassonomia in `CLAUDE.md`: i
dati della prova facevano **coincidere** la risposta giusta con quella
sbagliata.

Al suo posto una prova che distingue **e** difende una regola di casa:
`statoMisura` deve usare **lo stesso vocabolario** di `statoRigaProgramma`
(`stato: "mai"`, «Mai misurato», `cls: "warn"`). Due funzioni della stessa app
non possono chiamare la stessa idea in due modi.

## 4. Il vocabolario esisteva già, ed è la terza volta in tre giorni

Prima di inventare una risposta nuova, la ricerca dentro casa: Sentinella **sa
già** dire «mai misurato» (`statoRigaProgramma`), con l'etichetta, la classe
`warn` e persino la ragione scritta del giallo («è un avviso e non un allarme:
magari il punto è stato appena creato»). E ha già il rilevatore giusto —
`ultimaLettura(m)`, che **valida data e valore** invece di contare
`letture.length` grezzo.

Da lì sono uscite due correzioni alla scheda: i casi sono **due** e non uno (mai
misurato ≠ importato senza data), e la creazione **non** va cambiata a
`valore: null`, che introdurrebbe `NaN` in una dozzina di letture per un
problema che `ultimaLettura` risolve meglio.

## Numeri

- sonda del vuoto: **342 funzioni**, due forme di vuoto, **12** tranquilli,
  **11 dichiarati con la ragione**, **1 rosso** (il difetto vero)
- prove pronte da incollare: **12** (6 + 6), con l'esito «prima» misurato
- suite `node` in ora italiana: **1.346**, zero cadute

## In corso

Il **giro a 25 banchi** è al tredicesimo blocco e sta bene (la striscia di stato
dà 48 combinazioni giuste su 48; i KO che si leggono sotto sono la sua
controprova). Finché gira: `docs/`, `vault/` e le suite `node`.

## Prossimo passo atomico

Quando il giro finisce, in ordine — e le prime due sono ormai **meccaniche**,
perché le prove esistono già e si sa che cosa devono fare:

1. **Sentinella «mai misurato»** + `sonda-vuoto.mjs` che entra in `npm test`
   nello stesso commit;
2. **Flotta — la guardia su `orePreviste`**, tre righe;
3. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
4. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
