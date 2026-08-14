# Checkpoint — 2026-08-08 15:21 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d4c7bea` — fix: una funzione `async` non lancia, restituisce un rifiuto

## Che cosa è stato completato
CI rossa su `81f6e76`, e la **sonda del vuoto aveva ragione due volte**.

1. **Il prodotto.** `trasformaAtomico`, chiamata senza niente, esplodeva
   leggendo `rif.firestore`: un `TypeError` non dice a nessuno che cosa
   manca. Adesso le due funzioni nuove **dichiarano** che cosa serve, con una
   frase. È il principio di casa applicato agli argomenti.
2. **Il righello, ed è la parte che conta.** `sonda-vuoto` chiama ogni
   funzione esportata dentro un `try/catch` per scartare le firme sbagliate —
   ma **un `try/catch` attorno a una funzione `async` non prende niente**:
   quella non lancia, restituisce una **promessa rifiutata**. Nessuno la
   aspetta, quindi diventa un rifiuto non gestito e **uccide il processo**
   invece di essere una firma scartata come tutte le altre.
   Verificato il meccanismo in isolamento: *«try/catch attorno a una async l'ha
   presa? NO — il rifiuto sfugge»*.

## ⚠️ La controprova ha detto «NON DISTINGUE», e lo scrivo
Rimettendo **tutt'e due** i difetti, in casa la sonda passa lo stesso — anche
con `--unhandled-rejections=strict`. È una **corsa**: `process.exit(0)`
arriva prima che il rifiuto emerga, e in CI il rifiuto la vince.
Quello che ho verificato è il **meccanismo** e che il `TypeError` non c'è più;
che la corsa sia chiusa **lo dirà la CI**. Spacciarla per verificata sarebbe
stata la faccia tranquilla su una prova che non ho.

## Il filo della giornata
È la **seconda volta oggi** che «verde in casa, rosso in CI» ha la stessa forma:
**le due esecuzioni non sono la stessa cosa**. Stamattina era un **secondo
scrittore** che qui non gira (`rebuildClaims`); adesso è **l'ordine in cui due
cose arrivano**.

## Verifiche
- sonda rilanciata **sotto l'emulatore**, come fa la CI: **15 passati, 0
  falliti**, uscita 0;
- giro `node` **27/27**; `run-kpi` **1908**.

## Prossimo passo atomico
**Guardare l'esito della CI su questo commit.** Se è verde, la corsa è chiusa;
se è ancora rossa, il rifiuto arriva da un altro punto e va cercato lì — non
va ritoccata la sonda a caso.
Poi: `trasforma` nel livello dati di **Scudo** e i suoi due punti a elenco
(`azioniId`, `misure`), quindi le `tarature` di Sentinella.

⏳ Il **giro del browser** (PID 16670) è ancora vivo. Attesta `c3888fe`.

## Blocchi
Nessuno.
