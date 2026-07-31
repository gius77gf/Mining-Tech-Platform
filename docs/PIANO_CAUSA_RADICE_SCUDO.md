# L'analisi della causa in Scudo — piano di lavoro

*Scritto il 05/08/2026. Il censimento delle funzioni di Scudo elencava
«analisi causa-radice (5 Perché)» fra le cose da fare. **Prima di progettarla
è stato guardato che cosa c'è già**, perché la regola di casa dice che la
risposta è quasi sempre in casa e quattro volte in due giorni è costato lavoro
non guardare.*

---

## Che cosa c'è già, e funziona

Non si parte da zero. Scudo ha già la catena **evento → azione correttiva**,
ed è più completa di quanto il censimento lasciasse intendere:

| Pezzo | Dove |
|---|---|
| registro eventi, con i near-miss distinti (`tipo: "near-miss"`) | `infortuni` |
| azioni correttive con responsabile, scadenza, stato, esito, data di chiusura | `azioni` |
| il **collegamento** all'origine (`origineTipo` + `origineId`): evento, ispezione, non conformità | `azioni` |
| il semaforo dell'azione, con la regola che una chiusa non scade più | `statoAzione` |
| il riepilogo aggregato dei near-miss, che **conta quante segnalazioni hanno prodotto un'azione** | `riepilogoNearMiss` |
| la spinta ad aprire l'azione subito dopo la segnalazione | `index.html:3171` |

Quella frase nella pagina dice già la cosa giusta: *«Registrarlo serve a poco
se non si corregge quello che l'ha causato»*.

## Che cosa manca davvero

**Il «quello che l'ha causato» non è scritto da nessuna parte.** La parola
*causa* compare **una volta sola** in tutta l'app, ed è in quella frase: nel
modello dati non esiste. Un'azione è collegata all'evento da cui nasce, ma non
al **perché** l'evento è successo.

Le due conseguenze pratiche:

1. **Non si può rispondere alla domanda che conta**: *quali cause si ripetono?*
   Oggi si può contare quanti near-miss per categoria (caduta, taglio, urto) e
   per luogo — cioè **dove e come**, mai **perché**. Due tagli in officina e
   due tagli in cava contano come «quattro tagli», anche se uno dipende dai
   guanti e l'altro dalla fretta di fine turno.
2. **L'azione correttiva rischia di curare il sintomo.** «Consegna guanti
   antitaglio» è giusta se la causa è il DPI sbagliato; è inutile se la causa è
   che i guanti c'erano e nessuno li indossava perché rallentano il lavoro. La
   differenza fra le due la trova solo chi si è chiesto *perché* almeno due
   volte.

---

## Il rischio del metodo, e perché va progettato con prudenza

I «5 Perché» hanno una fama migliore di quella che meritano, e vanno
introdotti sapendolo — è la parte che la scheda deve dire chiaro invece di
vendere un metodo:

- **Portano a una causa sola.** La catena è lineare: un perché, un perché, un
  perché. Ma un infortunio quasi mai ha una causa sola, e chi arriva in fondo
  alla catena crede di aver finito.
- **Persone diverse arrivano a risposte diverse** partendo dallo stesso
  evento — e ognuna sembra convincente.
- **Finiscono quasi sempre sulla persona.** «Perché non ha guardato» →
  «perché era distratto» → «perché è fatto così». È la deriva naturale, e
  produce come azione correttiva un richiamo, cioè niente.

**La difesa è di prodotto, non di metodo**: se l'ultimo perché nomina una
persona e non una condizione, l'app lo dice. Non lo vieta — a volte è davvero
un comportamento — ma chiede: *«questo è quello che è successo, o è la persona
a cui è successo?»*. È la stessa idea del ponte con Terra che **non dà la
colpa a chi compila** (regola 6 di `run-stile.mjs`): se lo strumento accusa,
chi lo usa smette di scrivere la verità, e da lì in poi il dato non serve più.

E il corollario per il numero cinque: **cinque non è un obbligo.** Una catena
che si ferma a tre perché con una causa correggibile vale più di una tirata a
cinque per riempire i campi. La schermata parte da tre e li aggiunge, invece
di mostrare cinque caselle vuote — cinque caselle vuote si riempiono per
farle sparire.

---

## La forma

### I dati

`analisi/{id}`, una per evento (non più di una: se serve rifarla si corregge
quella):

```
{ eventoId: "i1",
  perche: ["Il masso è caduto dal fronte Est",
           "La fascia di rispetto non era delimitata",
           "La delimitazione non è nel giro di sorveglianza"],
  causa: "organizzativa",        // vedi la classificazione qui sotto
  fatta: "2026-08-06",
  daChi: "d3",
  azioniId: ["a1"] }             // le azioni nate da questa analisi
```

### La classificazione delle cause

Sei famiglie, e **non sono un'invenzione di questo documento**: sono le
categorie con cui la letteratura sull'infortunistica mineraria classifica i
fattori causali, ridotte a quelle che una cava può davvero correggere.

| Famiglia | Esempio in cava |
|---|---|
| `tecnica` | attrezzatura rotta, protezione mancante, mezzo inadeguato |
| `organizzativa` | procedura assente, sorveglianza non prevista, turni |
| `formazione` | mansione affidata senza addestramento, istruzione mai data |
| `dpi` | DPI mancante, sbagliato, o non usabile nel lavoro reale |
| `ambientale` | fronte instabile, pista, meteo, visibilità, rumore |
| `comportamentale` | scelta di chi lavorava, con le difese qui sopra |

⛔ **`comportamentale` non è un fondo in cui far cadere quello che non si
capisce.** Se è l'unica famiglia scelta, l'app chiede di scrivere anche
*perché* quel comportamento era possibile — che è di nuovo una causa tecnica,
organizzativa o di formazione. Un evento la cui unica causa registrata è «ha
sbagliato» non è un evento analizzato.

### Le funzioni pure

| Funzione | Cosa risponde |
|---|---|
| `analisiDiEvento(analisi, eventoId)` | l'analisi di quell'evento, o `null` |
| `eventiSenzaAnalisi(infortuni, analisi, soglia)` | gli eventi **gravi** rimasti senza un perché |
| `causeRicorrenti(infortuni, analisi, giorni)` | quali famiglie tornano, e su quanti eventi |
| `validaAnalisi(bozza)` | catena troppo corta, ultimo perché che nomina una persona, `comportamentale` da sola |

`eventiSenzaAnalisi` è il pezzo che rende la funzione viva invece che
facoltativa: senza, l'analisi la fa chi ha voglia, e il registro si riempie di
eventi muti.

⛔ **E vale la regola di casa: l'assenza di un dato non è un dato favorevole.**
`causeRicorrenti` su tre eventi analizzati su venti **non** dice «la causa
principale è organizzativa»: dice che sono stati analizzati tre eventi su
venti, e che su così pochi non si legge nessuna ricorrenza. È esattamente la
guardia `pochi` che `riepilogoNearMiss` ha già — e va riusata, non riscritta.

---

---

## Come si riconosce che «l'ultimo perché nomina una persona» *(12 prove in banco, 05/08)*

Il piano diceva *cosa* fare e non *come*, che è il punto dove una scheda smette
di essere utile. Provandolo, la risposta è venuta fuori — e **non è
un'euristica linguistica**.

Indovinare i nomi dalla forma delle parole è una pessima idea in italiano:
«Rossi» è un cognome e anche un colore, «Bo» è un cognome e sta dentro
«bordo». Un controllo che sbaglia **accusa chi ha scritto la verità**, ed è
esattamente il danno che questa funzione dovrebbe evitare.

**Ma il nome non va indovinato: va cercato.** Scudo ha già la collezione
`lavoratori`. `nominaUnaPersona(testo, lavoratori)` confronta l'ultimo perché
con i nomi **veri** dell'azienda, a parola intera — e la prova che vale più
delle altre è quella al negativo: *«Il masso è caduto oltre il **bordo** della
pista»* **non** deve accusare il lavoratore *Bo*.

Sotto ai nomi c'è un secondo giro, breve, sui **ruoli senza nome**
(«l'operatore», «l'addetto», «il conducente»): lì non serve beccarli tutti,
serve **chiedere** quando ce n'è uno.

E la validazione non blocca mai per questo motivo:

| Caso | Esito |
|---|---|
| meno di due perché | **non valida** — il primo è quasi sempre la descrizione, non la causa |
| famiglia della causa non scelta | **non valida** |
| l'ultimo perché nomina una persona | **valida**, con la domanda accanto |
| `comportamentale` con meno di tre perché | **valida**, con la richiesta di dire *perché quel comportamento era possibile* |

Le due righe che bloccano riguardano dati mancanti; quelle che riguardano il
**contenuto** chiedono e basta. Se lo strumento accusa, chi lo usa smette di
scrivere la verità.

---

## Le unità, in ordine

1. **`analisiDiEvento` + `validaAnalisi`**, con le prove. La prova che conta
   non è la catena giusta: è **l'ultimo perché che nomina una persona**, e
   `comportamentale` scelta da sola.
2. **`eventiSenzaAnalisi` + `causeRicorrenti`**, con la guardia dei numeri
   piccoli presa da `riepilogoNearMiss` (chiamata, non ricopiata).
3. **La schermata**: la catena dei perché dentro la scheda dell'evento, che
   parte da tre righe e cresce; il collegamento all'azione correttiva già
   esistente; e nel Quadro il conto degli **eventi gravi senza un perché**.
4. **Il prospetto**, che è il pezzo che vale davanti a un ente: le cause
   ricorrenti del periodo con le azioni che ne sono nate e il loro stato. Scudo
   ha già il prospetto dei near-miss aggregati per la **L. 198/2025** — questo
   gli si affianca, non lo sostituisce.

Ognuna con la sua controprova. Il difetto da rimettere è sempre lo stesso, ed è
sempre lo stesso perché è **il** difetto: far uscire una conclusione tranquilla
là dove non è stato analizzato niente.

---

## Cosa questo piano NON decide

- **Se l'analisi sia obbligatoria per legge.** Non lo è nella forma dei «5
  Perché»: il D.Lgs 81/2008 chiede la valutazione dei rischi e le misure
  conseguenti, non un metodo. Qui è uno strumento di lavoro, e la schermata
  deve dirlo — spacciarlo per un adempimento sarebbe la solita cosa gonfiata.
- **Il collegamento all'aggiornamento del DVR**, che è il posto dove una causa
  ricorrente dovrebbe finire davvero. Va discusso col RSPP del fondatore prima
  di inventarne la forma.
