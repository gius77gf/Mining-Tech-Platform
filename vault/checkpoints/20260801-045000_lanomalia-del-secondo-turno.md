# Checkpoint — l'anomalia del secondo turno spariva

- **Tipo**: unità (**difetto di prodotto** trovato e corretto) + una nota onesta
  sul mio metodo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `c5f8e73` (canarino del ciclo: `adc97fd`)

## Il primo difetto di PRODOTTO della giornata

Fin qui la copertura aveva trovato difetti nelle **prove**. Questo è nel
prodotto, e l'ho trovato **misurando** `coperturaControlli` invece di leggerla.

Il riquadro «giro macchina» dice quanti mezzi hanno il controllo fatto oggi e su
quanti è stata trovata un'anomalia. Il terzo numero guardava solo il **primo**
giro di ogni mezzo:

```js
if (!fatti.has(nome) && (+c.anomalie || 0) > 0) conAnomalie++;
```

Primo giro pulito, secondo giro con un'anomalia → il riquadro diceva **zero
anomalie**. In cava il giro macchina si fa **a ogni cambio turno**: due o tre
giri al giorno sullo stesso mezzo sono la norma, non l'eccezione. E il difetto
dipendeva perfino dall'**ordine** dell'elenco — gli stessi due giri, scambiati
di posto, davano risultati diversi. L'ho misurato prima di correggere, così la
correzione parte da un fatto e non da un'impressione.

Adesso i mezzi con anomalia si raccolgono in un `Set` e si contano alla fine:
un mezzo conta **una volta sola**, ma conta se l'anomalia c'è in **qualunque**
giro della giornata. Le due prove che descrivono il difetto sono state viste
**rosse prima** della correzione e verdi dopo.

## ⚠️ Una nota onesta sul mio metodo, che va scritta

Per verificare che ogni prova nuova sapesse fallire, ho **rimesso difetti** nei
moduli dati (`conti-`, `terra-`, `scudo-`, `sentinella-`, `flotta-data.js`) e
subito ripristinato. Ma quei moduli **le pagine se li importano**, e nel
frattempo girava il giro a 19 banchi del browser.

Ogni finestra d'iniezione durava secondi, e probabilmente non è successo niente.
Ma «probabilmente» non è una parola che si può usare su un giro di prove: un
banco che avesse caricato una pagina dentro una di quelle finestre avrebbe dato
un risultato **falso**, in un verso o nell'altro.

Quindi quel giro **non è attendibile per costruzione** e l'ho fermato. Non lo
racconto come un dettaglio: è esattamente la categoria di errore che questa
suite esiste per prendere — un risultato che sembra buono e non lo è — e averlo
commesso io mentre la costruivo è la ragione migliore per scriverlo.

**Regola nuova, da rispettare:** finché gira un giro del browser, non si
iniettano difetti nei file che le pagine caricano. Le iniezioni sui file di
**test** (`run-stile.mjs`, `run-kpi.mjs`) restano sicure: nessuna pagina li
importa.

## Stato

- **491** KPI (433 all'inizio della giornata) → **750** prove `node`, verdi
- **58 prove nuove** nella giornata, di cui 6 nate rosse su un difetto vero
- giro a 19 banchi: **fermato e da rifare** (ragione qui sopra)

## Prossimo passo atomico

Rilanciare il giro a 19 banchi **pulito**, cioè senza toccare più i moduli dati
finché non finisce, e leggerne il riepilogo. Nel frattempo lavorare solo su
file che le pagine non caricano: `docs/`, `vault/` e le suite `node`.

## Bloccanti

- Nessuno.
