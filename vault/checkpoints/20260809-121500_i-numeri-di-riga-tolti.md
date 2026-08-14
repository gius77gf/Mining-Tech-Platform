# Checkpoint — 2026-08-09T12:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`fba892d`

## Task completato

**I numeri di riga tolti da tutti e sei i documenti del delta: da 87 citazioni
scadute su 91 a 0 su 0.**

| documento | `file:riga` tolte | numeri nudi tolti |
|---|---|---|
| conti | 9 | **43** |
| campo | 3 | 21 |
| flotta | 7 | 12 |
| sentinella | 4 | 12 |
| scudo | 1 | 0 |
| terra | 0 | 0 |

35 righe di prosa toccate in cinque documenti, **nessun verdetto cambiato**:
sparisce solo il numero.

## Le tre cose imparate

1. ⛔ **LA MISURA HA CAMBIATO LA DECISIONE.** Un'ora fa avevo scritto — e
   committato — che le 91 citazioni **non** si riscrivevano adesso, «più
   rischio che valore». Poi ho provato la trasformazione su una **copia** e ho
   contato: due espressioni regolari, 35 righe, zero verdetti toccati. Il
   rischio era una stima; la misura l'ha smentita in cinque minuti. È la stessa
   disciplina del «costo che si misura, non si teme» — applicata a un lavoro di
   prosa invece che a un controllo.
   ⚠️ E la ragione per cui era sicura: la trasformazione tocca **solo** un
   numero preceduto da un identificatore fra backtick. Un anno, un articolo di
   legge, una cifra qualunque non hanno quella forma.
2. ⛔ **L'ETICHETTA HA DOVUTO SEGUIRE IL DATO.** Tre righe di Conti dicevano
   «**Prova che c'è, `file:riga`:**» — una promessa che dopo la modifica non era
   più vera. Un'intestazione che sopravvive al suo contenuto è la stessa
   famiglia dell'«etichetta più larga del suo numero» censita in `CLAUDE.md`:
   il dato è giusto e la frase intorno mente. Adesso dice *«per NOME (non per
   riga: i numeri invecchiano a ogni commit)»*.
3. ⛔ **E IL CONTROLLO ADESSO STAMPA ANCHE A ZERO.** Un controllo che tace
   quando non trova soggetti è **indistinguibile da un controllo rotto**: senza
   quella riga, la differenza fra «la convenzione è cambiata» e «il righello
   non guarda più niente» non si vedrebbe. Con la riga, se domani qualcuno
   riscrive una prova col numero di riga il denominatore risale — e si vede.
   ⚠️ È il caso più difficile del principio del denominatore: dichiararlo
   quando è **zero**, cioè quando non c'è nessun numero da leggere.

## Verifiche
- copia di ogni documento prima della modifica, e conto delle sostituzioni
  stampato (`tolte: N citazioni, M numeri nudi`) — uno script che non fallisce
  non ha per forza fatto qualcosa
- `documenti-invecchiati` **15/0**, riga della misura a **0 su 0** con la sua
  spiegazione
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Ancora vivo dalle 07:55Z su una copia di `494863f`; quasi 4.000 righe.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: **le 10 righe «SCADUTA» rimaste** (conti 3, scudo 2,
sentinella 3, terra 2), col metodo già usato su Campo — ogni nome citato
cercato **col comando**, e la riga aggiornata solo dove la prova non regge.
Adesso che i numeri di riga non ci sono più, verificarne una costa un `grep`.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
