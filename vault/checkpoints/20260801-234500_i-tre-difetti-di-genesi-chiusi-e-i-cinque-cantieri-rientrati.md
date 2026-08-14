# I tre difetti di Genesi chiusi, e i cinque cantieri rientrati

**Data:** 01/08/2026 (notte) · **Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Partenza del ciclo:** `04692c3` (canarino)
**Unità precedente:** `20260801-225800_tre-difetti-in-shared-segnalati-dai-cantieri.md`

## Il metodo che ha prodotto questo blocco, e che vale la pena tenere

Il cantiere di Genesi aveva un mandato di **trasloco** — portare fuori dalla
pagina delle funzioni con le loro prove. Mentre le spostava le ha **lette**, e
ha trovato tre difetti che nessuno cercava. Poi, e questa è la parte che conta,
**non li ha blindati con una prova**: li ha scritti nel rapporto con la riga.

Se li avesse "sistemati" di straforo, oggi avremmo tre correzioni non misurate
dentro un commit di riordino. Se li avesse ignorati, avremmo tre prove che
certificano il difetto. Dichiararli è la terza strada, ed è quella che ha
permesso di chiuderli **uno per uno, in ordine di pericolo**.

## I tre, chiusi

**1. La soglia più permissiva su una frequenza illeggibile.** `ppvLimit` decide
se una volata si può sparare, e con una frequenza non numerica cadeva
nell'ultimo ramo di ogni `switch`: 50,8 invece di 12,7, 20 invece di 15, per
tutte e cinque le norme. **Nessuna soglia è cambiata** (5 norme × 7 frequenze,
35 risposte identiche): cambia solo che ora dice `null`.
⛔ La prima guardia era sbagliata e l'ha bocciata il prototipo: `+null` fa
**zero**, che è finito — 0 Hz, la fascia più severa. Un numero inventato nella
direzione che non spaventa è comunque inventato.

**2. La tabella delle norme era scritta due volte, con due ripieghi diversi.**
Il difetto segnalato era che `ppvLimit('boh', 25)` rispondeva 15 mentre
l'etichetta diceva «boh». La causa stava sotto: la **pagina** aveva la sua copia
della tabella, e a un codice sconosciuto dava il nome «DIN residenziale» —
battezzava una norma che nessuno aveva riconosciuto. Ora la tabella è una sola.

**3. `r2: 0` dove r² non è calcolabile** → `null`. E la prova dice anche
**quanto pesa**: quel caso porta sempre `errore: 'pendenza'`, e la modale
disegna il riquadro di r² solo nel ramo senza errore — nella pagina non si vede
mai. Difesa in profondità, non innocuità. Scritto nella prova perché la
correzione non sembri più grossa di quello che è.

## I cinque cantieri, tutti rientrati

Genesi (12 export fuori dalla pagina), Sentinella (catena di custodia del dato),
Terra (il banco da sempre, con il «minimo» dedotto invece che scelto), Conti
(preventivo → conferma d'ordine, 28 prove), Campo (gli orari veri del turno).

**Campo chiude un cerchio**: `riposoPrimaDelTurno` calcolava la fine del turno
dalla durata **dichiarata**, quindi chi resta due ore in più aveva un riposo più
corto di quello che l'app credeva. Adesso l'app lo sa. E una decisione del
cantiere merita di essere ricordata: **niente precompilazione nei campi** — un
campo che si apre pieno di «06:00» è indistinguibile da un dato misurato, un
bottone da toccare è una dichiarazione.

## Verifica

Prove **1.769** (run-kpi 1387, run-stile 282, run-helpers 57, pointcloud 26,
manifest 9, demo 8), copertura **574/574** e nessuna funzione scoperta,
`giro-node` 16 comandi su 16 anche in ora italiana.
Nel browser: `genesi-struttura` **18/18**, banco delle unità **14 superfici
pulite, 0 violazioni** (la tonnellata non finisce più in maiuscolo).

## Prossimo passo atomico

Rileggere la **ricerca continua** raccolta stanotte e tradurre in unità le
proposte che hanno retto alla verifica: la **densità con la fonte dichiarata**
in Terra (oggi la densità si usa ovunque e da nessuna parte è scritto da dove
viene quel numero) e gli **addetti/macchinari** che ISTAT chiede nella denuncia
annuale. Sono le due che hanno passato il controllo con la prova accanto.
