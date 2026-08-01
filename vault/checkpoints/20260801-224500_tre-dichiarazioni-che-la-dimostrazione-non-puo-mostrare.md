# Tre dichiarazioni che la dimostrazione non può mostrare

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/tests/browser/stati-non-misurati.mjs`
(riepilogo annuale di Terra)
**Unità precedente:** `20260801-214500_distanza-0-m-sul-documento-per-lente.md`

## Che cosa cercavo

Chiuse Sentinella e Scudo, di «non indicata» restava il pezzo di **Terra**. E il
posto è buono: il **riepilogo annuale dei volumi**, il foglio che si consegna
all'ente. La tabella «Posizione rispetto al volume concesso» porta **tre assenze
dichiarate** una sotto l'altra, tutte già scritte bene da prima di oggi:

| casella | quando manca il dato |
|---|---|
| Volume concesso dall'atto | «non indicato» |
| Estratto dichiarato prima dell'uso di Terra | «non dichiarato» |
| Residuo del volume concesso | «non calcolabile» |

Tre difese giuste, in un documento che esce dall'app, **e nessuna prova le
guardava**: nessuna suite `node` può vederle, perché vivono nel foglio.

## ⛔ Scritto il blocco, il banco l'ha bocciato — e aveva ragione

Prima versione: aggiungo al banco il terzo foglio e mi aspetto verde.
**3 prove su 3 cadute.** Aprendo il foglio e leggendolo davvero:

```
Volume concesso dall'atto            1.200.000 m³
Estratto dichiarato prima dell'uso     340.000 m³
Residuo del volume concesso            758.600 m³
```

La dimostrazione **ha** tutti e tre i numeri. Mi ero fidato di una misura fatta
al livello sbagliato — avevo cercato `volumeConcesso` su `DEMO.autorizzazioni`,
non l'avevo trovato, e ne avevo concluso che mancasse; il campo si chiama
`volumeAutorizzatoM3`. È la regola di `CLAUDE.md` presa in castagna un'altra
volta — **leggere come il codice si aspetta i dati prima di dire che non ci
sono** — e stavolta a fermarmi è stato il banco, non la rilettura.

## Perché non bastava «aggiungere il caso alla dimostrazione»

Il criterio: *un caso da dimostrare deve poter mancare senza portarsi via il
resto*. Togliere il volume concesso all'unico atto **si porta via quattro
numeri**: la percentuale del concesso, il cumulato letto in proporzione, il
residuo e la soglia di guardia. È **strutturale**, non additivo — lo stesso «no»
già motivato per il residuo di Terra.

## La terza strada, e la regola che ne esce

Fin qui la regola era a due righe:

- **assenza** → sta nei dati d'esempio;
- **contraddizione** → non ci sta, si raggiunge **digitando**.

Questo caso mostra **l'eccezione alla prima riga**: un'assenza che, messa in
dimostrazione, ne smonta il resto si raggiunge digitando come una
contraddizione. E il gesto non è artificioso: è il **cliente nuovo che ha
aperto Terra e non ha ancora trascritto l'atto**, cioè lo stato del primo
giorno.

Misurato **prima** di scrivere il blocco, come pretende la regola: il form di
Terra il campo vuoto lo salva `null`, non `0`, e lo dice in un commento —
*«un campo lasciato vuoto NON è uno zero dichiarato… su un conto che finisce in
una comunicazione all'ente»*. ⚠️ È **la stessa regola che a Sentinella mancava**
e che è costata l'unità precedente: scritta in un'app, assente nell'altra.

## Che cosa guarda adesso il banco

Svuota i due numeri dell'atto nella scheda «Titolo», salva, torna alla denuncia
e chiede la stampa. Sul foglio pretende le tre dichiarazioni **e** due cose che
non ci devono essere:

- ⛔ **nessuna «% del concesso»**: una percentuale di un numero che nessuno ha
  scritto, su un foglio per l'ente. Senza il volume dell'atto quella coda
  sparisce da sé — e adesso qualcuno lo controlla;
- nessuno «0 m³» al posto di un dato mai scritto.

## Verifica

`stati-non-misurati` **70/0** — 41 stati cercati, 6 app (erano 64/0 e 33).
**Controprova**: rimessa la guardia sbagliata sul foglio (`R.concesso ? … : "non
indicato"` → `nD(R.concesso || 0)`, una sola occorrenza, −24 caratteri), cadono
**due** prove — quella della dichiarazione e quella dello zero, che stampa anche il
colpevole: *«Volume concesso dall'atto → 0 m³»*. Ripristinato, `git diff` vuoto
sulla pagina.
`run-stile` 271/0, `suite-collegate` 3/0 su 46 file,
`numeri-nei-documenti` 17/0.

## Prossimo passo atomico

La classifica di `stati-sorvegliati` dopo questa unità. Restano in testa
**«senza data»** (tre app) e **«non lo sappiamo»** (due), più le forme di Terra
(«non dichiarabile», «non dichiarato», «non dichiarata») che ora hanno il
foglio sotto guardia e vanno **ricontate**. Ordine ormai fisso: misurare se la
dimostrazione lo produce → se no, decidere fra aggiungere un'assenza,
digitarla, o dichiarare il rifiuto con la ragione.
