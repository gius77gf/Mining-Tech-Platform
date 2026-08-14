# Checkpoint — il giro è finito, e tre banchi non partivano da mesi

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il giro a 29 esecuzioni è arrivato in fondo: **23 a posto, 6 da guardare**

Ed è il primo giro completo dopo che il guardiano dell'impronta esiste: **non**
si è dichiarato non valido, cioè in tutta la sua durata nessuno ha toccato
moduli dati o pagine. La regola ha retto perché adesso è un controllo.

Le due unità di oggi che il giro doveva verificare sono **verdi con le loro
controprove**: `struttura di Genesi` e `nota di credito`.

## I sei KO erano **tre coppie**, ed è la firma di un banco rotto

banco **e** controprova falliti insieme non è un difetto del prodotto: è un
banco che non gira. Misurato lanciandolo a mano:

```
EADDRINUSE  address: '0.0.0.0', port: 8823
```

`navigazione`, `sconto-cliente` e `punti-nuvola` **alzano un server loro** e
leggono la porta come **primo numero fra gli argomenti** — che è esattamente la
porta del server comune che `tutti.mjs` passa a tutti i banchi. Dentro il giro
morivano **alla prima riga**.

> E il riepilogo scriveva **«KO»**, che si legge *«il banco ha trovato
> qualcosa»* invece di *«il banco non è mai stato eseguito»*.

Tre banchi su ventinove erano in questo stato — e nessuno se n'era accorto
perché il giro completo non arrivava quasi mai in fondo.

**È la stessa trappola che avevo previsto e chiuso stamattina** per
`genesi-struttura.mjs`, quando l'ho aggiunto all'elenco: lì l'avevo vista prima
di metterlo dentro, qui era già dentro da tempo.

## La correzione, e quanto valeva

La porta si passa con `--porta=`, che nessun altro argomento usa. Lanciati con
la porta posizionale del giro, adesso:

| banco | prima | dopo |
|---|---|---|
| `navigazione` | morto | **62 passate**, 44 navigazioni provate |
| `sconto-cliente` | morto | **7 passate** |
| `punti-nuvola` | morto | **7 passate** |

E le tre controprove sanno ancora fallire: *«senza le guardie il banco cade»*,
*«senza il cliente nel conto il banco cade»*, *«col conto unico il banco cade»*.

**76 asserzioni del browser** che il giro non stava eseguendo — fra cui le 44
navigazioni fra le pagine, cioè la prova che le app si aprano e si muovano.

## La lezione, che è nuova e va scritta

Il repository ha già la regola *«un controllo che dice ok senza aver guardato
niente»*. Questa è la gemella e finora mancava:

> **Un controllo che dice KO senza aver guardato niente si legge come un
> risultato.** Un rosso è credibile per definizione — nessuno va a chiedere a un
> banco fallito *se ha davvero eseguito qualcosa*.

La difesa è la stessa di sempre: **stampare quanti soggetti ha guardato**. Un
banco che finisce con «62 passate, 44 navigazioni provate» non può fingere; uno
che esce con un codice diverso da zero e basta, sì.

## Prossimo passo atomico

1. **rilanciare il giro** e pretendere **29 su 29** — adesso che i tre banchi
   girano davvero, quello che dicono è la prima misura vera su di loro;
2. **trasferire** `vault/pronte/terra-origine-*` in `terra-data.js` e
   `run-kpi.mjs`, e **cancellare** le copie;
3. il resto della tracciabilità del volume (unità 1-3 e 5 della scheda).
