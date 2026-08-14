# Checkpoint — 2026-08-07T23:43:16Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8583a0b` — *Terra: il volume in bianco usciva zero e RIENTRAVA come misura*

## Che cosa è stato completato

Verificato (e vero) il rimandato **⏱️ Terra · `csvRilievi`**, proposto da un
cantiere e per regola non entrato sulla sua parola.

**1. La copia debole nel posto peggiore.** `numeroDichiarato` sta in
`shared/dw-ponti.js` e la usano già Conti e Sentinella; `csvRilievi` se ne
teneva una versione più debole — `volumeM3 == null || !Number.isFinite(+…)` —
che non copre `""`. `+""` fa **0** e `Number.isFinite(0)` risponde **true**:
un rilievo col volume in bianco usciva scritto **`0`**.

⛔ **E il danno non è nel file: è nel RITORNO.** Misurato premendo il bottone e
riaprendo quello che esce — non leggendo il codice, dove il censimento statico
dava zero:

    2026-07-03;0;RTK;;;scavo     ← il vuoto scritto zero
    rientra come volumeM3: 0     ← e `rilievoUsabile` lo dichiara buono

Da lì entra nei KPI, nel riepilogo annuale e nella **denuncia** come un volume
*misurato*. Un'assenza che fa il giro e torna dentro travestita da dato: dentro
il file è tutto coerente con sé stesso, quindi non c'è niente da leggere.
⚠️ La prova che difendeva quel punto **c'era** e guardava `null`, cioè l'altro
caso. È la **quinta causa** dell'elenco — il caso difeso non c'era nella prova.

**2. La promessa che il file non manteneva.** «Scaricati 8 rilievi **nel
formato che questa pagina sa ri-caricare**», e ri-caricando ne rientravano
**7**. Il numero era giusto, a mentire era la frase intorno — l'*etichetta più
larga del suo numero*, quarta volta in due giorni. Ora c'è `rientroRilievi`,
che la risposta la **deriva** da `csvRilievi` + `parseRilieviCsv` invece di
riscriverla (un conto a mano invecchia appena una delle due cambia).

**3. ⛔ E quel messaggio non si era MAI visto.** Premendo il bottone nel browser
la pagina solleva `conta is not defined`: la funzione non era importata, quindi
il gestore **moriva** subito dopo il download — nessuna nota, nessun toast.
Errore **duro**, presente su `HEAD` (verificato prima di attribuirlo), su un
bottone che un banco preme 41 volte.
⚠️ `nomi-liberi.mjs` non lo vede, e **la ragione è misurata, non dedotta**:
nella stessa pagina c'è un `const conta` **locale a un'altra funzione**, e quel
controllo guarda il **FILE**, non lo **SCOPE**. Tolto l'import, resta verde
(18.656 chiamate guardate, zero violazioni). Anche `import-esistenti` resta
verde: guarda gli import scritti, non i nomi liberi.

## I banchi, e perché nessuno lo prendeva

- **`csv-dimostrazione` ascoltava gli errori di pagina e li leggeva PRIMA di
  premere i bottoni.** L'ascoltatore c'era, l'elenco si riempiva, e l'unica
  domanda arrivava due secondi dopo il caricamento. È la famiglia del controllo
  che non guarda dove crede, nella veste «guarda al momento sbagliato». Adesso
  c'è la seconda lettura e il riepilogo porta *«N gestori di export morti
  premendo il bottone»*. **Controprova**: tolto l'import di `conta`, KO con il
  nome del difetto dentro.
- **Il giro scrivi/leggi diceva `righe.length > 0`** — largo abbastanza da
  passare anche se di otto righe ne fosse tornata **una**. Il denominatore era
  nel file e nessuno lo guardava. Adesso: *«33 righe rientrate su 34 scritte, 1
  restano fuori»*, col nome del file che perde righe.
- **`terra_rilievi.csv` non era nemmeno in elenco** fra i `GIRI`, ed è uno dei
  sette file che rientrano davvero.
- **La soglia `nNumeri > 100` cadeva con `--solo=`** (7 numeri su tre file): un
  KO che non è un difetto del prodotto, cioè il modo più veloce di insegnare a
  non guardare i KO. Adesso è divisa per i soggetti che il banco ha potuto
  vedere. Non è più permissiva: è la stessa regola col suo denominatore.

## `.toast.warn`, che mancava

`toast(msg, tipo)` accetta qualunque `tipo` e ne fa una classe, ma il foglio
condiviso ne dipingeva **due** — `err` e `success`. Chi passava «warn» otteneva
il toast **neutro**, cioè quello che si legge «non è successo niente»: un
avviso che non avvisa, senza un errore da vedere. Stessa mappa incompleta
nell'`esito` di Terra, che adesso usa `.note.avviso` (già in `shared/`).
Le due variabili sono quelle di `.badge.warn`, che il contrasto lo ha misurato.
Effetto collaterale **dichiarato**: il «contagio» su Genesi passa da 21 a 22
selettori, e nel documento c'è scritto perché — la classe `toast` Genesi ce
l'ha già, ed è voluto che il foglio condiviso vesta quella famiglia.

## Prove

`run-kpi` **1887 → 1889** (le sei suite: **2.306**), copertura **702 → 703**,
banco CSV **219 → 225 ok**. Giro `node`: **23 comandi, 0 caduti**, sulla copia
di quello che si committava. Messaggio letto dal DOM e **screenshot guardato**.
Controprove: due sul modulo (guardia debole rimessa → 2 prove rosse; conto a
mano invece che derivato → 1 rossa), una sul banco.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e poi rilanciarlo sul commit corrente** — quello in corso
parte da un `HEAD` di oltre trenta commit fa. Ordine: prima le righe **«non ho
guardato»**, poi i KO, distinguendo le controprove (l'intestazione lo
dichiara).

Poi, in coda, i rimandati:

- ⛔ **`nomi-liberi.mjs` è cieco su un nome dichiarato solo DENTRO un'altra
  funzione** — misurato oggi, e non su un caso di scuola: era un errore duro in
  produzione. Unità sua: o si porta la scansione a conoscere gli scope, o si
  aggiunge una **seconda domanda** (un nome dichiarato solo in un blocco
  indentato e chiamato da un altro blocco). Prima di allargare, la regola del
  07/08: **stringere su una copia e contare gli allarmi nuovi** — se sono pochi
  e dichiarabili per nome, un elenco corto è meglio di una regola larga.
- ⏱️ **Scudo · verbale DPI**: «Consegnato il» scriverebbe «—» su una data
  assente, mentre la colonna accanto è stata corretta il 03/08 per esattamente
  questo. Proposto da un cantiere, **non ancora verificato da me**.

## Blocchi
Nessuno.
