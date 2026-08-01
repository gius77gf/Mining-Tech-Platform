# I tre cantieri, il primo pezzo di Genesi, e la data che non esisteva

**Data:** 01/08/2026 · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Commit:** `2bac90b`, `425bf40`, `6122876` · **Partenza del ciclo:** `806ec54`
**Unità precedente:** `20260801-190938_campo-flotta-e-il-cantiere-di-genesi-misurato.md`

## Che cosa è stato completato

**1. Campo — il riposo fra due turni** (D.Lgs 66/2003 art. 7). Scelta fra tredici
mancanze confermate perché è l'unica che Campo può calcolare con dati che ha già
— l'appello e la durata dichiarata — senza hardware né rete.

> ⛔ **Il cuore è un'asimmetria**, ed è la forma che il principio del fondatore
> prende qui. Il conto poggia sull'appello, che ha **tre** risposte. Se fra
> l'ultimo turno risultato lavorato e questo ci sono turni non spuntati, il
> riposo calcolato è un **tetto**. Un tetto **sotto** le 11 ore prova comunque
> la violazione (i buchi possono solo accorciare); un tetto **sopra** non prova
> niente → «non misurabile», mai «regolare».
> **Il dato incompleto sa ancora accusare, non sa più assolvere.**

**2. Flotta — la pagella del parco.** Costo orario e disponibilità sulla stessa
riga: «la riparo ancora o la sostituisco» non si risponde con un asse solo,
perché una macchina cara può esserlo perché lavora il doppio. Banda ±15% e ±5
punti, perché senza tolleranza metà parco è sempre «sopra la media» e un allarme
che suona sempre insegna a non guardarlo.

**3. Scudo — appaltatori e DUVRI** (art. 26 D.Lgs 81/08).

**4. Genesi esce da `genesi.html`.** Sei formattatori in
`apps/genesi/genesi-formato.js`: scrivono quasi trecento numeri della pagina, e
difendono il principio del fondatore nel punto in cui si vede — su un dato che
manca scrivono **«—», non «0»**. Erano già scritte così; adesso c'è una prova
che lo pretende invece della memoria di chi le rilegge.

**5. La data come si scrive in Italia.** Sei pagine, quattro nomi diversi,
**quattro comportamenti su sette casi**. E due righe erano difetti che l'utente
vede:

| valore | campo | conti/scudo/sentinella | terra |
|---|---|---|---|
| `""` | senza data | — | — |
| `2026-13-45` | **45/13/2026** | **45/13/2026** | **45/13/2026** |
| `2026-02-30` | **30/02/2026** | **30/02/2026** | **30/02/2026** |
| `2026-07-31T10:00` | 31/07/2026 | **31T10:00/07/2026** | — |

Date che **non esistono**, stampate come se fossero fatti: il principio del
fondatore rovesciato — non un dato mancante spacciato per buono, ma un dato
**sbagliato** spacciato per certo. Il difetto veniva da
`split("-").reverse().join("/")`, che non guarda che cosa sta girando.

⚠️ La **parola per il vuoto** resta un parametro: «senza data» dove la mancanza
è essa stessa un'informazione, «—» dove la colonna può legittimamente essere
vuota. Unificarla sarebbe stato decidere al posto di sei schermate, di straforo.

## Errori miei, in questo blocco

1. **`git checkout` su un file con lavoro non committato** ha cancellato l'intera
   funzione appena scritta. Il ripristino dopo un'iniezione va fatto **da una
   copia**, non da git — è scritto, e l'ho fatto lo stesso.
2. Una sostituzione con la **lettura annidata dentro l'apertura in scrittura**
   ha portato `DEVELOPMENT.md` a **zero byte**.
3. Un `cd` in una worktree ha fatto **modificare la copia invece del repo**.

Tutt'e tre presi guardando il risultato — `wc -c`, la suite, `git status`. È
l'unica difesa che funziona su questa famiglia di errori.

## Verifica

`giro-node.mjs` **15 comandi su 15, 0 caduti**. `run-kpi` **1308/0**,
`run-stile` 275/0, copertura **10 soggetti a posto**, `sonda-vuoto` 7/0,
`nomi-doppi` 0 da sistemare, `numeri-nei-documenti` 17/0. Anche in ora italiana.

Nel browser: `genesi-struttura` **18/18** — quel banco **guida** l'app (toast,
modale, salvataggio col nome precompilato), e un import rotto l'avrebbe ucciso.

Controprove: 5 iniezioni su Campo, 11 su Flotta (fra cui il verso dei fermi
invertito, che cambia **zero caratteri** e fa cadere 5 prove — il caso in cui la
conta dei caratteri da sola avrebbe mentito), 1 sulla data (3 prove cadute, con
i messaggi che mostrano i difetti veri).

## Prossimo passo atomico

Leggere l'esito di `pagine-vive --disco` sulle quattordici superfici dopo la
migrazione della data, e committare.

Poi: **Terra e Flotta non sono state migrate** alla data condivisa e la ragione è
dichiarata — la `dmy` di Terra scrive **gg/mm senza l'anno** (funzione diversa
con lo stesso nome di quella di Campo, un caso da `nomi-doppi`), e quella di
Flotta valida già. Vanno guardate una per una, non a scatola chiusa.
