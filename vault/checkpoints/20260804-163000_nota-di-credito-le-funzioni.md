# Checkpoint — la nota di credito: le funzioni, e stornata ≠ saldata

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.360 → **1.379** (+19), tutte verdi con `TZ=Europe/Rome`

## Che cosa è entrato

Sette funzioni pure in `conti-data.js`, con **19 prove** in `run-kpi.mjs`:

| | |
|---|---|
| `CAUSALI_NOTA` / `causaleNota` | le sei causali con il **comma** che le regge e il **termine** che ne discende |
| `prossimoNumero(…, prefisso)` | la serie dedicata `NC/` — il quarto parametro, facoltativo |
| `stornatoDi(fatturaId, note)` | quanto è già stato stornato (le note parziali possono essere più d'una) |
| `statoFattura(f, incassi, note)` | **aperta / saldata / stornata** |
| `validaNota(nota, f, note, oggi)` | dice **perché** non si può, e **avvisa** sui dodici mesi senza bloccare |
| `notaDaFattura(…)` | la nota totale o parziale, importi **positivi**, tipo `TD04` |

## La prova che vale più di tutte

> **Una fattura stornata al 100% non è «saldata».**

Il residuo va a zero come per una pagata, ma **nessuno ha pagato niente**. Se
quello zero contasse, `tempoMedioPagamento` conterebbe come «pagata in N giorni»
una fattura **annullata**, e il cliente peggiore diventerebbe il più puntuale. È
l'assenza di un dato — il pagamento — travestita da residuo a zero: lo stesso
principio, la quarta app.

## Le 18 prove sono passate al primo colpo, e non voleva dire niente

Controprovate con **cinque** difetti rimessi nel file **vero** (nessun giro del
browser in corso, verificato prima):

| difetto rimesso | prove cadute |
|---|---|
| stornata contata come saldata | **3** |
| le due serie di numerazione si contaminano | 1 |
| l'avviso dei dodici mesi non arriva mai | 1 |
| lo storno non somma le note parziali | 1 |
| `causaleNota` ricade sulla prima voce invece di dire `null` | 2 |

Ripristino verificato **identico** all'originale.

## Il censimento ha trovato l'unica funzione senza prova

`copertura-funzioni.mjs` ha detto **65/66, `causaleNota` SENZA PROVA** —
esattamente il suo mestiere. La prova aggiunta non è di facciata: pretende che
un id inventato risponda **`null`** invece di ricadere sulla prima causale, che
sarebbe «merce resa, comma 2, nessun termine» — cioè la voce **più permissiva**
delle sei. Indovinare lì vorrebbe dire togliere l'avviso dei dodici mesi a chi
scrive male l'id.

## ⚠️ Errori miei nel trasferimento, e come sono venuti fuori

Le sostituzioni a tappeto per portare le prove dallo scratchpad al file vero
hanno rotto due cose: `N.` → `conti.` ha colpito anche **`JSON.`** (diventato
`JSOconti.`) e alcune `F` non erano state rinominate. Cinque prove rosse, viste
subito perché la suite gira. *Una sostituzione «meccanica» su un testo è
meccanica solo finché l'ancora non è una sottostringa di qualcos'altro.*

## Che cosa NON è fatto, e va detto

- **L'interfaccia non c'è**: nella finestra che elimina una fattura non compare
  ancora «Emetti nota di credito», e non c'è l'elenco delle note;
- **gli aggregati non leggono ancora lo storno**: `apertoDi`,
  `esposizioneClienti`, `agingIncassi`, `kpiFrom` ignorano le note.

**Niente regredisce**, ed è misurabile: finché nessuna interfaccia crea note,
l'elenco `note` è sempre vuoto e quelle funzioni si comportano esattamente come
prima. Ma la funzione **non è finita**: è finito il suo strato dati.

## Una decisione di sequenza, presa e dichiarata

Il giro del browser a 27 esecuzioni è stato **fermato di proposito** a due
banchi su ventisette. Non è un ripiego: la regola che ho scritto stamattina dice
che mentre gira non si toccano moduli dati e pagine, e ne restano da toccare
parecchi. Il giro va lanciato **una volta sola, alla fine** del lavoro sul
codice — se no o blocca il lavoro o misura codice che cambia sotto.

## Prossimo passo atomico

1. **gli aggregati leggono lo storno** — `apertoDi`, `esposizioneClienti`,
   `agingIncassi`, `kpiFrom`, con la prova che una nota **non** compaia mai come
   riga a sé fra le fatture aperte;
2. **l'interfaccia della nota** in `apps/conti/index.html`;
3. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
4. **poi**, e solo poi, il giro completo del browser.

## Nessun blocco

Decisioni del fondatore ferme in `DECISIONI_WEEKEND.md` (5a/5b, 10-15) più
**Firebase Storage** per le foto di Scudo.

---

# Seguito (stesso ciclo) — gli aggregati leggono lo storno

**Suite:** 1.379 → **1.383**

`apertoDi(fattura, note)` sottrae quello che una nota ha già stornato, e
`kpiFrom`, `agingIncassi`, `esposizioneClienti` glielo passano. Il parametro è
**facoltativo in tutti e quattro**: chi non lo passa ha esattamente i numeri di
prima — ed è così che la riga è entrata senza toccare nessuno dei chiamanti che
ancora non sanno delle note.

## La prova che chiude il difetto della «fattura negativa»

> **⛔ Una nota di credito non compare MAI come riga a sé fra le fatture aperte.**

Era il difetto misurato il 03/08 sulla scorciatoia: la nota scritta come fattura
col meno davanti finiva in elenco come un documento **da incassare**, per un
importo **negativo** — `agingIncassi` la contava fra le scadute da sollecitare e
`esposizioneClienti` la **saltava** (`if (imp <= 0) continue`), così il fido del
cliente non si liberava. Adesso la prova pretende: **una** riga nell'esposizione,
**una** nell'aging, **nessuna fascia con un importo negativo**, e l'effetto dello
storno comunque presente (600 invece di 1.000).

E il fido si libera davvero: una fattura stornata per intero fa **sparire** il
cliente dall'esposizione, invece di lasciarcelo per l'importo pieno.

## Controprova

Quattro iniezioni, una per funzione: `apertoDi` che torna a ignorare le note (4
cadute), `esposizioneClienti` (2), `kpiFrom` (1), `agingIncassi` (2). Ripristino
identico.

⚠️ La seconda ancora compariva **due volte** (`const imp = apertoDi(f, note);` sta
uguale in `esposizioneClienti` e in `agingIncassi`) e la controprova l'ha detto
invece di sostituire a caso — allungata col commento che la precede. È la stessa
correzione già fatta due volte oggi.

## E una prova sbagliata, corretta guardando il valore vero

La prima stesura sommava `.conto` su **tutte** le chiavi di `agingIncassi`, ma
`scadutoTot` è un **numero**, non una fascia: la somma dava `NaN`, che
`JSON.stringify` scrive `null`. Non era il codice a sbagliare, era la prova a
indovinare la forma. Le cinque fasce adesso sono dichiarate, lette dal valore
restituito.

## Resta da fare

**L'interfaccia**: nella finestra che elimina una fattura non compare ancora
«Emetti nota di credito», e l'elenco delle note non c'è. Lo strato dati è
completo e collegato; la funzione si vede quando c'è la schermata.
