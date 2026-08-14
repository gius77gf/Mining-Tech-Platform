# Quattro documenti su cinque non aspettano più i dati

**Data:** 01/08/2026 · **Area:** `docs/RICERCA_DOCUMENTI_ENTI_202607.md`
**Unità precedente:** `20260801-052000_onere-di-escavazione.md`

## Come è nata

Finito l'onere di escavazione (il **2°** dei «5 documenti da fare per primi»),
la mossa ovvia era passare al **4°**, che la scheda dà come «lavoro: basso».

Due minuti di `grep` prima di scrivere — la regola che in questo progetto è già
costata quattro volte — e la risposta è stata: **c'è già.**
`reportConformita` produce periodo, ricettore, letture, soglia applicata con la
sua provenienza, superamenti ed **esito**, compreso `senza-dati`. Scrivere un
altro strato dati avrebbe duplicato quello.

A quel punto valeva la pena misurare **tutti e cinque** invece di inciampare
nello stesso modo il prossimo giro.

## Il risultato, contato e non ricordato

| # | documento | dati | manca |
|---|---|---|---|
| 1 | **DDT** — Conti | `clienti` ✅ `prodotti` ✅ | ⛔ **`cantieri` e `vettori`: zero riferimenti** — l'unico buco di dati rimasto — poi la pagina |
| 2 | **Riepilogo annuale + onere** — Terra | ✅ | solo la pagina |
| 3 | **Cartella lavoratore + verbale DPI** — Scudo | ✅ | solo la pagina |
| 4 | **Fascicolo ambientale** — Sentinella | ✅ | solo la pagina |
| 5 | **Avanzamento + verbale di rilievo** — Terra | ✅ | solo la pagina |

**Quattro su cinque aspettano solo la pagina.**

## Dove la scheda era più lontana dal vero

- **#3 diceva «lavoro medio per i DPI — serve l'elenco DPI e l'assegnazione al
  lavoratore».** Sono stati costruiti nei cicli successivi: Scudo ha **undici**
  funzioni sui DPI, e fra queste **`verbaleDpi`** — cioè esattamente il
  documento che la scheda elencava come la parte difficile.
- **#1 invece è ancora un buco vero, ed è preciso**: clienti e prodotti ci sono,
  **cantieri e vettori no** (zero riferimenti nel modulo). La scheda diceva
  «anagrafiche che oggi in Conti mancano» al plurale: metà di quelle mancanti
  nel frattempo sono state fatte, metà no.

## Perché questa nota esiste

Non per aggiornare un documento: per **impedire il lavoro sbagliato**. Chi
riprende da qui, leggendo la scheda com'era, comincerebbe a scrivere strati dati
che ci sono già — che è l'errore che `CLAUDE.md` elenca fra i più costosi, con
quattro casi datati. Adesso la scheda dice cosa manca **davvero**: una pagina di
stampa per documento, più le due anagrafiche di Conti.

⚠️ E vale anche il contrario, che è il motivo per cui non ho scritto altro
codice stanotte su questo filo: **una pagina di stampa è una modifica visiva**,
e vuole lo scatto. Finché il giro del browser tiene la CPU, quel lavoro non si
può verificare — e farlo senza verificarlo sarebbe peggio che non farlo.

## Verifica

Conteggi fatti a `grep` sui moduli, non a memoria: 11 funzioni DPI in Scudo,
0 riferimenti a `cantieri`/`vettori` in Conti, `reportConformita` presente in
Sentinella, `proiezioneAnnua`/`classeAccuratezza`/`bandaVolume`/`descriviOrigine`
presenti in Terra. `numeri-nei-documenti` 17/17.

## Prossimo passo atomico

Quando il giro libera la CPU, nell'ordine:
1. **lo scatto delle cinque righe nuove di Scudo**, debito dichiarato dal suo
   cantiere;
2. la **pagina di stampa del riepilogo annuale di Terra**, che consuma
   `descriviOnere` e i due campi impostati dal cliente (tariffa €/m³ e volume
   detratto per recupero).
