# Checkpoint — i campi interi di tutte le app, digitati; e un difetto vero in Terra

- **Tipo**: verifica estesa a tutte le superfici + correzione + regola nuova
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `ca9ce2c`

## Cosa è stato fatto

Le stesse tre domande poste a Genesi nell'unità precedente — la virgola viene
detta? «1.500» vale 1500? un intero normale si scrive? — poste **digitando
davvero** anche alle altre superfici, navigando ogni app come la naviga una
persona (barra delle sezioni, fisarmoniche, e in Scudo la scelta
dell'adempimento tipico che fa comparire la riga «si ripete ogni N mesi»).

| superficie | campi raggiunti | esito |
|---|---|---|
| Genesi | 10/10 | tutte a posto |
| Campo | 2/2 | tutte a posto |
| Flotta | 4/4 | tutte a posto |
| Scudo | 2/2 | tutte a posto |
| Sentinella | 3/3 | tutte a posto |
| Terra | 5/5 | **cinque fallite → difetto vero, corretto** |
| core (radice) | 0/3 | **non raggiungibile: serve il login** |

**48 asserzioni** sulle sei app. **Controprova** su ognuna (stessa pagina con la
guardia smontata): ne cadono **32**, cioè esattamente le due per campo che
dipendono dalla guardia. Le prove sanno fallire ovunque, non solo su Genesi.

## Il difetto: in Terra «1.500» diventava «500»

Terra aveva una **seconda implementazione della stessa regola**, scritta prima
che la guardia vivesse in `shared/`, con un comportamento **diverso**: oltre a
rifiutare il separatore, **svuotava il campo**. Montate tutte e due, la sequenza
era «1» → il punto rifiutato **e il campo svuotato** → «5», «0», «0»: restava
**500**. Un numero plausibile e sbagliato — cioè esattamente la cosa che lo
svuotamento diceva di voler evitare. La guardia condivisa, da sola, in quel caso
dà **1500**, che è il numero giusto.

Misurato tasto per tasto, non dedotto: al terzo tasto il valore passava da «1»
a «» sullo stesso nodo e con lo stesso fuoco.

**Correzione**: tolta la copia locale. Perché Terra non perdesse quello che
aveva in più (campo in rosso + spiegazione nel proprio riquadro d'esito), la
guardia condivisa ora passa a chi avvisa **anche l'elemento**: `avvisa(m, el)`.
Terra usa quello per i propri testi. Una regola sola, in `shared/`; in casa
restano solo i testi, che sono di Terra.

**Cambio di comportamento da sapere**: in quei cinque campi la virgola non
svuota più il campo. Scrivendo «2,4» resta «24» — come in tutte le altre app —
con il campo **in rosso** e il messaggio che spiega. Il rosso ora resta finché
il campo non viene svuotato o non lo si lascia: toglierlo a ogni tasto lo
rendeva invisibile (la sequenza «2», «,», «4» lo accendeva e spegneva subito).

## Regola 9 di `run-stile.mjs`

«Nessuna superficie si riscrive in casa la regola degli interi»: cerca un
ascoltatore `beforeinput` che, fuori da `shared/`, guardi i separatori.
Controprova doppia: il codice vero di Terra rimesso **nel file vero** fa
fallire la regola; un commento che ne parla no.

**La prima versione della regola non guardava dove credeva**: l'espressione
regolare `[\s\S]{0,400}?\)` si fermava alla parentesi di `(e)`, tre caratteri
dopo, e passava su tutte le superfici a vuoto. L'ha detto la controprova, non
la lettura. Ora la finestra è a lunghezza fissa.

## Stato delle suite

`run-kpi` 325 · `run-stile` **96** (era 84) · `run-helpers` 43 · `run-demo` 7 ·
`run-manifest` 9 · `run-pointcloud` 23 — tutte a zero falliti.

## Prossimo passo atomico

I **tre campi interi del core** (`umc-n`, `a-nf`, `foc-nf`) restano gli unici
non provati digitando: il core si apre sulla schermata di accesso e senza
credenziali non si va oltre. Due strade, da scegliere: (a) usare la funzione di
navigazione del core stesso (`nav('ufficio')`, la stessa che chiama il bottone)
per raggiungere le schermate a login avvenuto — legittimo, è il codice
dell'app, non un forzare gli stili; (b) accettare il limite e scriverlo.
Prima si prova (a).

## Bloccanti

- Il core non è provabile in locale oltre il login.
- Resta gated su decisione del fondatore: Genesi punti pesanti #4/#5/#6.
- Resta **senza risposta** la domanda del fondatore «ti ho chiesto una cosa
  prima».
