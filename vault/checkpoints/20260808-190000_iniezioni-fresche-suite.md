# Checkpoint — 2026-08-08 19:00 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e26ff87` — un'iniezione scaduta la prende una suite in tre secondi, e
l'ultimo KO di Conti era il banco che pinnava il testo di ieri

## 1 · La difesa contro le iniezioni scadute, collegata

Le tre iniezioni scadute di poco fa le ha trovate **il giro del browser**: un
registro da cinquemila righe, sei ore di attesa, e una riga in fondo a una
pagina di verde. Adesso c'è `apps/deepwork-id/tests/iniezioni-fresche.mjs`, che
fa la stessa domanda **senza aprire un browser e senza alzare un server** — e
gira in `npm test`, cioè **prima** del commit.

Misura dichiarata: **174 iniezioni sul bersaglio su 174**, 20 banchi letti, su
**32** file di prodotto. L'elenco dei file è **derivato dal disco** (le app si
leggono dalla cartella), così un'app nuova entra da sola: è la differenza fra un
elenco derivato e un elenco gemello, che in questa casa è già costata una
giornata.

⚠️ Il banco la cui tabella non si legge da fermi — `scudo-documenti`, che la
costruisce da variabili — è **dichiarato con la ragione**, e l'elenco è
**sorvegliato**: se diventasse leggibile, o se ne comparisse un altro, il
controllo cade. È la disciplina di `sonda-vuoto`: un'eccezione che non serve
più è un'eccezione che nasconde.

Controprove, tutt'e due:
- una stringa **inventata** non deve essere trovata — se no il confronto è
  rotto e il verde non vuol dire niente;
- rimessa una iniezione scaduta, il controllo cade **e nomina il banco**.

## 2 · L'ultimo KO di Conti era il banco, non il prodotto

`conti-frasi` sano dava 21 ok e **1 KO**. Aperto: chiedeva «**Esportati** 1
prodotto (CSV)» e la pagina scrive «**Esportato** 1 prodotto», che in italiano
è la forma giusta — il 07/08 `plurale(...)` ha imparato anche il **participio**.
Cioè il banco contava come difetto una **correzione**, ed è la seconda volta
oggi che succede.

Corretto rendendo l'asserzione **più giusta, non più permissiva**: si pretende
il participio **singolare** *e* che il plurale non compaia, invece di allargare
a `Esportat[oi]`.

## Prossimo passo atomico

Il giro del browser su `23712e6` (pid 16814) è ancora in corso. Quando finisce:

    node apps/deepwork-id/tests/browser/leggi-giro.mjs \
      /tmp/.../scratchpad/resp/giro/registro.txt

La **sezione 0** dirà da sola quanto è vecchio (dovrebbe essere fresco: pochi
commit, e nessuno sulle superfici misurate se nel frattempo si tocca solo
`tests/`). Poi la sezione 1, «non ho guardato», **prima** dei KO. La domanda da
portarci dentro: **quali controprove non sanno fallire** sul codice di adesso —
il giro vecchio ne dava dieci, ma quella lista attesta venti commit fa e tre di
quelle dieci sono state chiuse oggi.

## Blocchi

Nessuno.
