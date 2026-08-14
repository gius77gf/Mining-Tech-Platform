# Nominata, e senza la formazione sotto

**Data:** 01/08/2026 · **Area:** banco degli stati (Scudo)
**Unità precedente:** `20260801-235940_cinquanta-occorrenze-lette-una-volta.md`

## Il primo dei tre stati veri, ed è il più pesante

Dal censimento chiuso nell'unità precedente restavano **tre** posti dove il
prodotto dice «non lo so» e nessuno guarda. Il primo è di sicurezza: una
persona **nominata a un ruolo obbligatorio per legge** — sorvegliante, D.Lgs
624/96, «chi controlla ogni giorno i luoghi di lavoro della cava e ferma ciò
che non va» — di cui la **formazione richiesta non risulta registrata**.

Il ripiego rosso esiste ed è messo bene: sta **prima** di «Nomina attiva» e di
«In regola», col commento che spiega perché — una nomina senza la formazione
sotto non è una cosa a posto, anche se la nomina è formalmente valida.

## Misurato prima: la dimostrazione lo produce già

`organigrammaSicurezza(DEMO.nomine, DEMO.lavoratori, DEMO.scadenze)` →
**1 persona su 7** con `formazione.stato === "mancante"`, ed è **Giulia Verdi**
come sorvegliante. Quindi niente dati aggiunti: si sorveglia e basta. Terza
volta oggi che la risposta era già in casa.

## Perché la riga nomina la persona

Nella stessa lista convivono «Formazione **scaduta**» e «Senza data di nomina»,
che sono stati **diversi** con la stessa forma. Una regex sulla sola frase
avrebbe potuto prendere la riga sbagliata e portare il nome di un caso provando
l'altro — il caso 1 della tassonomia, già pestato due volte oggi.

Il `vietato` dice l'altra metà, e in questo caso è la più importante: sulla riga
di quella persona **non** deve comparire «In regola». È esattamente il difetto
che il ripiego previene — l'ordine delle risposte nella catena.

## ⛔ La controprova, e il primo tentativo da buttare

Primo tentativo: **cancellare** la riga del ramo `mancante`. Risultato:
*«Unexpected token ':'»* e **dieci** prove cadute — perché togliere una riga da
una catena di ternari non inietta un difetto, **rompe la pagina**. Il banco
cadeva, sì, ma per una ragione che col prodotto non c'entra niente: è la forma
peggiore di controprova, quella che si potrebbe scambiare per una conferma.

Rifatta con un'iniezione **sintatticamente valida** e che dice esattamente il
difetto: il ramo «mancante» risponde `["ok", "In regola"]`, cioè la pastiglia
tranquilla dove la formazione non risulta registrata. Così cade **una** prova,
ed è quella giusta.

La lezione, che vale per ogni iniezione futura: **si sostituisce un valore, non
si cancella una riga di una struttura**. Il conto dei falliti lo dice subito —
dieci invece di uno vuol dire che si è rotto qualcos'altro.

## Verifica

`stati-non-misurati` **79/0** — 46 stati cercati, 6 app (erano 76/0 e 45).

## Prossimo passo atomico

Gli **altri due** stati veri, tutt'e due in Sentinella:
1. **«distanza non indicata»** sulla riga del ricettore — la distanza governa
   la lettura del livello misurato, quindi la sua assenza non è un dettaglio
   d'anagrafica. In dimostrazione tutti e tre i ricettori la distanza ce
   l'hanno: da decidere col criterio (assenza additiva? Il ricettore serve solo
   a sé stesso, quindi probabilmente sì);
2. **«norma non indicata sul progetto»** — un limite di progetto senza la norma
   da cui è preso, nella tabella previsto-contro-misurato del report. Da
   misurare **dove** compare davvero: la dimostrazione ha una sola volata con
   previsione, e la norma ce l'ha.
