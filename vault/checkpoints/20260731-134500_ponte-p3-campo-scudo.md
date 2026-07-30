# Checkpoint — 31/07/2026 13:45 UTC

## Task completato
**S23 — Ponte P3 · Campo ↔ Scudo: «chi è in turno è in regola?»**
La ricerca sul cruscotto la chiama *«la funzione più forte dell'intero
ecosistema»*, ed è la prima domanda che nessuna app da sola sa rispondere.

| Commit | Cosa |
|---|---|
| `d1dfd94` | Il ponte, la regola in `shared/`, sei prove nuove |

## Come è stata scelta questa unità
Non l'ho inventata: la direttiva dice di partire dalle schede di ricerca. Leggendo
`docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md` §4.3 ho trovato che **due voci su
tredici erano già state fatte** dopo la stesura della scheda (il `data` sui costi di
Flotta, le azioni correttive di Scudo) e una terza è superata (Terra **ha** ora la
scheda dell'autorizzazione). Le ho verificate nel codice invece di crederci: il
documento è invecchiato, ed è utile saperlo.

La voce ancora vera e più forte era questa, e la scheda lo diceva: *«è la funzione
più forte dell'intero ecosistema: vale la pena farla presto»*.

## ⛔ La decisione che vale tutto il resto: non si accoppia per nome
Non è prudenza teorica. Le due dimostrazioni erano state inventate separatamente e
contenevano:

| Campo | Scudo |
|---|---|
| Marco **Rossi** | Mario **Rossi** |
| **Anna** Conti | **Anna** Neri · Sara **Conti** |

Un accoppiamento per nome — anche «intelligente» — avrebbe dichiarato in regola una
persona **guardando i documenti di un'altra**. Su una visita medica un falso
positivo è peggio di nessuna risposta: **chi non sa controlla, chi crede di sapere
no.** Quindi il collegamento è un `lavoratoreId` esplicito, e senza id la risposta è
«non lo so», detta chiaramente. C'è una prova che dà due omonimi **perfetti** e
pretende «non-collegato».

## Le tre regole di onestà, che sono la sostanza
1. **I «non lo so» non si sommano ai «sì».** `nonCollegati` è un conto separato e
   `tuttoInRegola` è falso finché ce n'è uno. Sommarli sarebbe il modo più semplice
   per rendere inutile un controllo di sicurezza.
2. **Se Scudo non è leggibile la sezione tace del tutto.** Né allarme né
   rassicurazione: dal lato di Campo «l'azienda non ha Scudo» e «la lettura è
   fallita» non si distinguono, quindi il modo di sbagliare resta *nessuna
   informazione*, mai *informazione sbagliata*. Scritto nel codice perché nessuno lo
   «corregga» aggiungendo una frase.
3. **Non è un giudizio sulla persona.** Si dice che un **documento** scadeva il
   02/07 — un fatto amministrativo che si risolve prenotando una visita. È la stessa
   lezione del ponte con Terra: uno strumento che sembra un cartellino di demerito
   fa smettere di scriverci dentro i dati veri.

## Due difetti trovati strada facendo
- **«Corso scaduta il 11/07»**, visto a schermo. Il genere in italiano non si deduce
  dalla parola, e i tipi di documento li scrive l'utente in Scudo: non si può
  nemmeno tenerne una tabella. Niente participi concordati — «**scadeva il**» non
  concorda con niente. È la seconda volta in due giorni che l'italiano inventato
  produce un difetto (la prima fu l'articolo davanti al nome di un campo).
- **`export { x } from "..."` non crea un nome locale.** Spostando la soglia delle
  scadenze in `shared/`, le trenta chiamate interne di Scudo sono rimaste scoperte:
  **dieci prove rosse subito**, che è esattamente il lavoro della suite. Serve
  importare e poi ri-esportare.

## Verifica
- **313 KPI** (erano 307), sei prove nuove: i cinque stati, l'identità
  `campo.X === ponti.X` e `scudo.statoScadenza === ponti.statoScadenzaHSE`, il
  riepilogo che non trasforma un «non lo so» in un «sì», e la prova che **le due
  dimostrazioni non si smentiscono a vicenda**.
- Quest'ultima ha trovato un difetto **suo**: la chiave *lavoratore + tipo* non è
  univoca (d3 ha due «Formazione» in Scudo) e accusava i dati di divergere. Corretta
  l'asserzione, non i dati — appartenenza invece di uguaglianza per chiave.
- Undici schermate di Scudo e Campo aperte a 390 px: nessun errore JavaScript.
- Lo stato **«Scudo assente»** renderizzato per intercettazione: la sezione tace,
  come deve.
- Screenshot guardato: la nota conta le persone, e il bordo di ogni riga porta il
  colore del suo stato.

## Una decisione scritta, non lasciata implicita
L'elenco resta **alfabetico** e non ordinato per urgenza: è la rubrica di chi c'è in
squadra, e chi la apre cerca *una* persona. Riordinarla la trasformerebbe in un
elenco di conformità. L'urgenza la dicono la nota che conta e il colore del bordo.

## Stato
Suite: **313 KPI**, 72 stile, 7 demo, 43 helper, 23 pointcloud, 9 manifest. Verdi.

## Prossimo passo atomico
**Il ponte P3 dal lato di SCUDO, cioè l'altra metà.** Oggi Campo vede i documenti,
ma chi tiene lo scadenzario in Scudo non sa **quali** delle sue scadenze riguardano
persone che stanno lavorando adesso — e una visita medica scaduta di chi è al fronte
oggi non è la stessa urgenza di quella di chi è in ferie. È la simmetria che il
ponte con Terra ha già preso in due iterazioni.

Da fare, nell'ordine: (1) l'accessorio di sola lettura verso Campo in
`apps/scudo/scudo-data.js`, gemello di quello appena scritto (seconda istanza
dell'SDK sull'app "campo", nessuna scrittura); (2) **decidere e scrivere** cosa
significa «sta lavorando adesso»: l'operatore in forza in una squadra operativa,
oppure l'assegnazione a un'attività di oggi — sono due domande diverse e il dato per
entrambe c'è; (3) la regola in `shared/dw-ponti.js`, mai riscritta di là; (4) la
solita trappola da evitare: non deve diventare una classifica di chi è più in
ritardo, ma un ordinamento delle urgenze; (5) renderizzare e guardare.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), i dodici campi interi di Genesi verificati solo montando la guardia e non
digitando (vivono tutti in modali), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
