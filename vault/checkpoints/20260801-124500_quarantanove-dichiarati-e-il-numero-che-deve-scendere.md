# Quarantanove dichiarati, e il numero che deve scendere

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/run-stile.mjs`
**Unità precedente:** `20260801-123500_trentotto-regole-su-quarantatre.md`

## Il punto 4, cioè quello che impedisce il ritorno

Dei quattro passi lasciati dal documento di E0, il quarto è l'unico che si può
fare **senza toccare `shared/`**: la regola che si accorge quando due fogli
condivisi definiscono lo stesso selettore. Ed è quello che conta di più, perché
gli altri tre smontano il debito, questo impedisce che si riformi mentre lo si
smonta.

## Come è fatta, e perché non è una soglia

La regola **non** pretende che i doppioni spariscano — sarebbe E0 tutto in una
volta, su undici pagine con tre combinazioni diverse di fogli. Pretende che
l'elenco sia **quello dichiarato**, e cade nei **due versi**:

- un doppione **nuovo** → cade subito (è il verso che protegge);
- un doppione che **non si presenta più** → cade anche lui, perché la riga va
  tolta. È la lezione di `sonda-vuoto.mjs`: un'eccezione che non serve più è
  un'eccezione che nasconde.

Il secondo verso è quello che rende il lavoro **visibile**: mentre E0 procede,
l'elenco si accorcia e la regola costringe ad accorciarlo davvero, invece di
lasciarlo fermo a 49 per anni.

⚠️ E per questo non è un **fondo su un numero**. Un «49 o meno» lascerebbe
passare uno **scambio** — uno tolto, uno aggiunto — senza dire niente, ed è
esattamente il difetto che `CLAUDE.md` racconta per le soglie sui valori
monotòni. Qui si confronta l'**insieme esatto**, e la riga stampata dice tutto:

> `i selettori definiti in due fogli condivisi sono quelli dichiarati
> (49 trovati, 49 dichiarati, 3 fogli letti)`

I «3 fogli letti» sono la difesa contro il controllo che non guarda dove crede:
se la lettura fallisse, la regola direbbe «nessun doppione» invece di accorgersi
di non aver letto niente.

## La controprova, nei due versi

| iniezione | esito |
|---|---|
| tolta `.avatar` dall'elenco (−43 caratteri) | ✗ *«1 selettori nuovi → .avatar»* |
| aggiunta una riga finta `.pinco-pallino` | ✗ *«dichiara doppioni che non ci sono più»* |

Ripristinata due volte, **273/0**.

## E la correzione di stamattina è confermata dal banco

Rilanciato `fuori-schermo` sulle 14 superfici dopo la barra sistemata:
**28 schermate pulite, 0 fuori dallo schermo** — erano 26 e 2.

## Verifica

`run-stile` **273/0** (era 272: la regola nuova), controprova nei due versi.
`fuori-schermo` 28/0 sulle 14 superfici.

## Prossimo passo atomico

I banchi ancora mai girati sulle tre superfici nuove — `unita-maiuscole`,
`note-stato`, `vuoti-azione`, `navigazione` — sono in coda e stanno partendo. Se
uno di loro trova qualcosa, quello è il lavoro; se non trova niente, si passa al
**punto 1** di E0 (togliere da `dw-app-shell.css` i 38 selettori che
`dw-app-ui.css` ridefinisce), che va fatto **insieme** al punto 2 perché
`profilo.html` è l'unica pagina per cui quelle 38 regole sono ancora vive.
