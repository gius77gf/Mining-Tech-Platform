# Il banco arriva dove il difetto costava di più

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
**Unità precedente:** `20260801-083000_il-ddt-dichiarava-vendita.md`

## Il buco che restava

`stati-non-misurati.mjs` guardava Scudo e Terra. Il caso peggiore trovato
stanotte — la **dichiarazione inventata su un documento fiscale**, il DDT che
scriveva «Vendita» al posto dell'utente — era provato da `mancanzeDdt` (che
guarda il **modulo**) e da uno scatto che viveva in **scratchpad**. Cioè: la
pagina che stampa il foglio non la controllava niente di permanente.

## Perché Conti sta a parte nel banco

Non per pigrizia: il suo caso **non è una riga di un elenco**, è un **foglio che
si costruisce solo quando qualcuno lo chiede**. `#stampa` resta vuoto finché non
si clicca `[data-stampa-ddt]` — la prima sonda emulava il media print e trovava
**zero documenti**, dicendo «niente da vedere» su una pagina che funzionava.

Quindi il banco chiede il foglio **come lo chiede l'utente** e legge tre casi:

| pesata | che cosa deve dire |
|---|---|
| `s1` | completo, a cura del **mittente**, causale «Vendita» perché **scelta** |
| `s4` | a cura di un **vettore**, col suo nome («Autotrasporti Ragusa Srl») |
| `s2` | senza causale: **riquadro rosso** e «da indicare», non «Vendita» |

⚠️ E le etichette **non si cercano a testo**: il CSS le mette in maiuscolo e
`innerText` riflette la trasformazione — «Causale del trasporto» non si trova
mai. Le caselle si leggono per **struttura** (`.box` → `.et` = etichetta, il
resto = valore). È la trappola che `CLAUDE.md` descrive per `innerText`, presa
in un punto nuovo.

Il banco passa da **13 a 21 prove**, da 6 a **9 stati**, e da due a **tre app**.

## La controprova, e cosa dice davvero

Rimesso nella pagina il `Vendita` fisso (`−81 caratteri`), il banco cade con un
messaggio che è il difetto stesso:

```
KO  conti: DDT senza causale: lo dichiara invece di scrivere «Vendita» — causale -> "Vendita"
```

⚠️ **Cade una prova su 21, non tutte, e va detto perché.** Il riquadro rosso
`.manca` continua a comparire, perché lo decide `mancanzeDdt` sul **dato**, non
la stringa stampata: sono **due guardie indipendenti** sulla stessa regola. È il
caso 2 della tassonomia di `CLAUDE.md` — «il codice è difeso in profondità» — e
non il caso 1 («la prova non prova niente»): togliendo uno strato l'altro regge,
ed è esattamente quello che si vuole su un documento che legge la Guardia di
Finanza.

Ripristinato e verificato `diff` identico.

## Verifica

`stati-non-misurati` **21/0** (9 stati, 3 app), controprova incorporata cade
come deve, controprova per regressione cade sul caso giusto e con la parola
giusta. `suite-collegate` 3/0, 44 file — il banco era già collegato, quindi
l'estensione non ha creato orfani.

## Prossimo passo atomico

Le tre app che il banco **non** guarda ancora — Campo, Flotta, Sentinella — e la
domanda va posta al contrario di come viene naturale: non «quali stati aggiungo
al banco», ma **quali stati «non misurato» quelle tre app sanno dire, e quali di
quelli non compaiono in dimostrazione**. In Sentinella ce n'è già uno noto e
citato in `CLAUDE.md` (il «mai misurato» di `statoRigaProgramma`); per Campo
l'appello del turno con «non lo so» diverso da «assente» è il caso di scuola del
principio. Da misurare app per app prima di scrivere righe nel banco, con lo
stesso `grep` che stanotte ha corretto quattro documenti su quattro.
