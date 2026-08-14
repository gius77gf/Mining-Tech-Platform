# Checkpoint — 31/07/2026 12:00 UTC

## Task completato
**S22 — Terra, la ripartizione per fronte: la quota, e niente fronti che non
esistono.** Prima unità di prodotto dopo la chiusura del motore dei grafici.

| Commit | Cosa |
|---|---|
| `bb978db` | Due difetti visti guardando, nessuno dei quali produceva un numero sbagliato |

## L'unità è cambiata dopo la prima verifica, ed è giusto così
Il checkpoint precedente proponeva una **ciambella dei materiali**: «Terra sa quanto
si è cavato ma non di che cosa». Prima di progettarla ho letto i dati, come il
checkpoint stesso imponeva. Risultato: `materiale` è un campo dell'**autorizzazione**
ed è **uno solo** («Sabbia e ghiaia»). Una ciambella dei materiali avrebbe avuto una
fetta al 100%.

Cercando la composizione che esiste davvero ho trovato la **ripartizione per
fronte** — già calcolata, già provata, già stampata nel report per l'ente. E già a
schermo, come elenco. Quindi niente ciambella: aggiungerla sarebbe stata una seconda
rappresentazione dello stesso dato. Con tre fronti un elenco è più leggibile di una
ciambella, e i prodotti migliori la sconsigliano proprio sotto le cinque voci.
**La composizione mancava nel numero, non nella forma.**

## I due difetti, visti guardando
Nessuno dei due produceva un numero sbagliato: sono usciti solo renderizzando la
sezione a 390 px e guardandola.

1. **La riga che sembrava rotta.** La voce «Senza fronte indicato» esisteva solo per
   una ripresa da cumulo, e prendeva un badge **«0 m³»** — perché il badge è lo
   scavo. Ma una ripresa da cumulo, per la regola dell'app stessa, **non esce da un
   fronte**: non è un fronte mancante. Esce dall'elenco e il suo volume viene detto a
   parole nella nota. Una voce senza fronte ma **con** scavo resta invece, ed è
   tutt'altro: è la ripartizione che manca e che il modulo dell'ente chiede — la nota
   ora lo dice e spiega cosa fare. Prima le due cose erano la stessa riga.
2. **La quota mancante.** 40.700 e 38.700 dicono poco; 51,3% e 48,7% dicono che i due
   fronti pesano uguale. È l'unico numero che un elenco di valori assoluti non sa
   dare. Su un totale zero non si scrive «0%»: non è zero, è una **domanda senza
   senso** — e un «0%» accanto a un fronte direbbe una cosa falsa.

E mancava sotto l'elenco l'avvertenza che i metri cubi sono **solo scavo**: la stessa
che sta sotto i mesi **dieci righe più su**. È la seconda volta questa settimana che
la convenzione giusta era già nell'app, poche righe sopra, e non era stata usata.

## Un dettaglio che vale la regola
La frase «le riprese sono scritte nella riga» compare **solo se una riga ce le ha
davvero**. Rimandare a qualcosa che non c'è manda a cercarlo, e chi cerca e non trova
pensa di aver sbagliato lui.

## Un'incoerenza voluta, scritta perché non sembri una svista
Il **report stampato** tiene la riga che lo schermo esclude. Là la tabella ha una
colonna «Ripreso da cumuli», quindi la riga porta un numero suo invece di uno zero
che sembra un errore; a schermo ogni riga ha un numero solo e quel posto non c'era.
La ragione è scritta accanto al codice del report.

## Verifica
- La regola sta in `ripartizioneFronti` dentro `terra-data.js`, **non nella pagina**:
  è una regola e si prova. **307 KPI** (erano 301), 6 prove nuove.
- Fra queste la **controprova** che rifà la riga rotta e pretende che il difetto ci
  fosse; e una che passa dal riepilogo **vero** della dimostrazione — se un giorno la
  ripresa da cumulo sparisse dai dati finti, il caso che ha originato la correzione
  smetterebbe di essere coperto **in silenzio**.
- Quattro stati renderizzati a 390 px e guardati: normale, scavo senza fronte, fronte
  con cumuli, nessun volume. Ogni trasformazione del modulo dati **dimostra** di aver
  cambiato la sorgente prima di essere creduta.

## Stato
Suite: **307 KPI**, 72 stile, 7 demo, 43 helper, 23 pointcloud, 9 manifest. Verdi.

## Prossimo passo atomico
**Seconda iterazione sulla stessa sezione, dal lato che oggi non risponde: il
CONFRONTO fra anni.** La ripartizione dice come si è diviso l'anno *corrente*, ma la
domanda che un titolare si fa davanti a quel numero è la successiva: «il Fronte Nord
è sempre stato la metà, o sta prendendo il posto dell'Est?». Il dato c'è —
`serieAnnuale` esiste e `riepilogoAnnuale` sa girare su qualunque anno — e la
tendina degli anni è già nella pagina (`den-anni`).

Da fare, nell'ordine: (1) verificare **prima di progettare** se la dimostrazione ha
più di un anno con volumi per fronte, altrimenti la sezione nasce vuota e non si può
nemmeno guardare — se non ce l'ha, il primo passo è aggiungerlo ai dati finti;
(2) decidere e **scrivere** se il confronto va nella sezione dei fronti o accanto alla
serie annuale, evitando la trappola di ieri: due sezioni che dicono la stessa cosa in
posti diversi; (3) renderizzare e guardare, che è quello che ha trovato entrambi i
difetti di oggi; (4) la regola nel modulo dati, il disegno nella pagina.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
