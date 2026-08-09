# Checkpoint — 2026-08-09T09:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e5f18ec` (questa unità committata subito dopo)

## Task completato

**B3, prima fetta: `interpProf` portata fuori dalla pagina di Genesi** — la
quota del fronte sagomato, che nella pagina nessuna prova poteva chiamare.

| | prima | dopo |
|---|---|---|
| funzioni dentro `genesi.html` | 166 | **165** |
| prove su `interpProf` | **0** | **5** |
| `run-kpi` | 1923 | **1928** |

Non è la più grossa delle 25 estraibili: è quella che **pesa di più**. Dice di
quanto il fronte si scosta dal piano verticale a una certa distanza, e da lei
dipendono la posizione dei fori sul disegno 2D e la **burden reale** di ognuno
— quanta roccia ha davanti — che è il numero con cui si decide una carica.

## Le tre cose imparate

1. ⛔ **LA QUINTA PROVA È QUELLA CHE CONTA: «è USCITA dalla pagina, non
   copiata».** La trappola del trasloco è lasciare la vecchia copia dentro
   `genesi.html` **e** importare anche la nuova: la pagina userebbe la sua, e
   le altre quattro prove blinderebbero una funzione che nessuno chiama. Il
   modello c'era già (`xmlPianoInnesco`, 03/08) ed è stato riusato invece che
   reinventato.
2. ⛔ **TRASLOCO, NON MIGLIORIA.** Il corpo è arrivato parola per parola. Un
   trasloco che ne approfitta per «sistemare» non è più un trasloco: se
   qualcosa si rompe non si sa più quale delle due cose l'ha rotta. Quello che
   è cambiato è che il comportamento adesso è **scritto** invece che dedotto —
   profilo vuoto → 0; **fuori dal rilievo non si estrapola** (estrapolare la
   quota di un fronte oltre dove qualcuno è andato a misurare vorrebbe dire
   inventare la roccia); l'ordinamento si fa **dentro, su una copia**, e
   l'array di chi chiama non si tocca; due punti sulla **stessa `x`** — un
   rilievo battuto due volte — non producono `NaN`, e senza la guardia
   `((b.x-a.x)||1)` quel `NaN` arriverebbe fino alla burden di un foro.
3. ⛔ **IL CENSIMENTO DEGLI ESTRAIBILI È OTTIMISTA, e me ne sono accorto solo
   aprendo la sua lista.** Fra le «25 che si portano fuori come sono» ce ne
   sono che **in un modulo dati non ci vanno**: `nomeCampoD2` fa
   `el.closest('label')` — riceve un elemento del DOM come **argomento**,
   quindi il filtro sul `$(...)` non la vede — e `skyTexture`/`softTexture`
   creano una `<canvas>`. Il criterio «nessuna variabile del modulo e nessun
   `$(...)`» è giusto per dire **dove vive lo stato**, non **dove può vivere la
   funzione**. La seconda domanda — *tocca il DOM in qualunque modo, anche
   ricevendolo?* — non è nel righello, ed è **dichiarata** invece di lasciar
   credere che le 25 siano 25.

## Verifiche
- `run-kpi` **1928 passati, 0 falliti** (era 1923: le cinque prove girano)
- `genesi-estraibili` **165 funzioni** (era 166), numero **derivato dal
  comando** — è la terza volta che quella riga invecchia, e adesso dice quale
  comando la rifà
- `iniezioni-fresche` **296/296** dopo l'edit della pagina
- i tre documenti aggiornati **addendi compresi** (1923 → 1928, 2.371 → 2.376)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo dalle 07:55Z su una copia di `494863f`. ⚠️ Da allora il branch è andato
avanti di parecchi commit, **questa unità compresa, che tocca una pagina**:
quando si leggerà, la **sezione 0** dirà di quanti e quanti mordono. Va letta
per prima.

## Prossimo passo atomico
**La seconda fetta di B3**, con la lista già misurata: i candidati puri che
restano sono `isoColore` (il colore di un'isocrona da un valore normalizzato) e
`riconStorico`. ⛔ Prima di sceglierne uno, aprire il suo corpo e fare la
**seconda domanda**: *tocca il DOM in qualunque modo, anche ricevendolo come
argomento?* — se sì, non è un trasloco, e va tolto dai 25 con la sua ragione.
⚠️ E ogni edit di `genesi.html` muove le ancore di `genesi-frasi-limite`: si
rilancia `iniezioni-fresche` (296) e si ri-ancora quello che serve.
Quando il giro finisce, ha la precedenza: si legge con `leggi-giro.mjs`
nell'ordine **età → «non ho guardato» → KO veri**.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
