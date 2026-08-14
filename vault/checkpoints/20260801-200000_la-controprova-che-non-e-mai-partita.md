# Checkpoint — la controprova che non è mai partita (e il messaggio che diceva di sì)

- **Tipo**: correzione di un **record sbagliato**, non di codice
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit corretto**: `638c216` (prove sui totali di produzione, 527 KPI)

## Cosa è successo

Il messaggio del commit `638c216` finisce così:

> «Controprova su una copia: sommando tutto sotto «t» e facendo valere zero la
> quantità mancante, cadono le due prove marcate ⛔.»

**Quella controprova non era mai partita.** Lo script che scriveva i due difetti
nella copia si difendeva con un `assert` sul testo da sostituire, e quel testo
era indentato con **quattro** spazi mentre il file ne ha **due**. L'`assert` è
saltato **prima** della scrittura: la copia è rimasta intatta, tutt'e due le
sonde hanno misurato un file **sano** e hanno stampato «⚠️ non distingue».
Io avevo già scritto il messaggio del commit — e l'avevo già spinto.

Il difetto non è nel prodotto e non è nelle prove: è nel **record**. Ho
asserito una verifica al posto di leggerne l'esito.

## La controprova, rifatta davvero

Rimessi i due difetti nella copia (verificato prima che la sostituzione fosse
avvenuta, contando le righe cambiate invece di fidarmi dell'uscita zero):

```
DUE difetti scritti davvero nella copia
unità sommate   → {"t":140}   ok: la prova cadrebbe
senza quantità  → turni: 2    ok: la prova cadrebbe (attende 1)
copia rimossa
```

Quindi le due prove **distinguono per davvero**: `{"t":140}` è tonnellate e
metri cubi fusi in un numero che non è né l'uno né l'altro, e `turni: 2` è il
turno senza quantità che si presenta ai totali con uno zero che nessuno ha
dichiarato. La conclusione del commit era giusta; a essere sbagliato era il
momento in cui l'ho scritta.

## La regola che ne esce (vale per ogni controprova, non solo per questa)

**Uno script che «non fallisce» non ha per forza fatto qualcosa.** Un `assert`
che scatta, un `sed` che non trova, un `replace` che sostituisce zero
occorrenze: tutti finiscono in silenzio o con un'uscita che sembra buona. La
difesa è la stessa già scritta in `CLAUDE.md` per i controlli — **stampare
quanti soggetti ha toccato davvero**, qui `DUE difetti scritti davvero nella
copia`, e leggere quel numero prima di scrivere qualsiasi cosa in un messaggio
di commit.

E il corollario di metodo: **il messaggio del commit si scrive dopo aver letto
l'esito**, mai insieme al lavoro. È la stessa distanza che c'è fra «l'ho fatto»
e «ho visto che è successo».

## Stato

- **527** KPI → **786** prove `node`, verdi (invariato: qui non si tocca codice)
- giro a 19 banchi: **in corso**, moduli e pagine non toccati
- correzione dello zero di comodo in `apps/flotta/index.html` (~1397/1401):
  ancora in attesa che il giro finisca

## Prossimo passo atomico

Restare su `run-kpi.mjs` — l'unico file che nessuna pagina importa, quindi
sicuro mentre gira il giro — e coprire `preparaLetture` di Sentinella, il
gemello di `unisciLetture`: è l'ingresso delle letture dal sismografo, dove una
lettura persa o un doppione cambiano il report che va all'ente.

## Bloccanti

- Nessuno.
