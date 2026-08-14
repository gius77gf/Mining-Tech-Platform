# L'orologio del vault: il nome somigliava a un'ora

**Data:** 01/08/2026 · **Area:** vault + suite (trasversale)
**Unità precedente:** `20260801-073000_il-cento-per-cento-che-non-guarda-genesi.md`
*(sì: il nome di quel file dice `073000` e questo dice `034500`. È esattamente
il difetto di cui parla questa unità — vedi in fondo.)*

## Come è saltato fuori

Il canarino di inizio ciclo chiede di scrivere **data e ora UTC correnti**.
Chiedendole a `date -u` invece di ricordarle, sono venute **03:43 UTC** — e
nel file c'era scritto **07:45**, messo a mano dal ciclo precedente. Cioè da me.

Cercando il checkpoint da cui ripartire, la stessa incrinatura si è allargata:
il file col «timestamp più alto nel nome» era `20260805-100000`, mentre l'ultimo
che avevo scritto davvero era `20260801-073000`.

## ⛔ Il fatto, misurato

Confrontando ogni nome col giorno in cui il file è **entrato in git**:

| nome | entrato davvero | scarto |
|---|---|---|
| `20260722-*` | 21/07 | +1 |
| `20260731-*` | 30/07 | +1 |
| `20260802-*` | 31/07 | +2 |
| `20260803-*` | 31/07 | +3 |
| `20260804-*` | 31/07 | +4 |
| `20260805-*` | **31/07** | **+5** |

Un **solo giorno** di lavoro — il 31 luglio — si è dato **cinque date diverse**,
una per blocco, come se ogni blocco fosse un giorno nuovo. In tutto:
**184 checkpoint su 640 sono datati avanti**, fino a cinque giorni, e lo scarto
comincia il **21/07**.

## Perché conta davvero

`CLAUDE.md` dice a ogni ciclo automatico: *«riprendere dal checkpoint PIÙ
RECENTE (timestamp più alto nel nome)»*. È **il meccanismo con cui ogni ciclo
trova dove ricominciare**.

Quel meccanismo non guarda l'ora: guarda una **stringa che le somiglia**. Chi lo
seguiva alla lettera apriva un file scritto **prima** di quello vero, credendolo
il più fresco — e non se ne accorgeva, perché la regola una risposta la dà
sempre. È la forma già raccolta in `CLAUDE.md`: *un controllo che risponde con
sicurezza guardando dove non crede*. Qui era particolarmente difficile da
vedere, perché `20260805` **sembra** un'ora, e a un numero che sembra un'ora
nessuno chiede le credenziali.

## La correzione

- **`apps/deepwork-id/tests/date-checkpoint.mjs`** (nuovo): un checkpoint
  **nuovo** non può essere datato dopo il giorno in cui entra in git. E stampa
  **qual è davvero l'ultimo**, per data di git, affiancato a quello che
  sceglierebbe il nome — così la differenza si vede invece di agire in silenzio.
- **`CLAUDE.md`**: la regola dice adesso che *il più recente lo dice git*, col
  comando da lanciare.

**Il lascito è dichiarato per DATA, non a elenco.** Rinominare 184 file
romperebbe i rimandi «Unità precedente» che li legano in catena, e riscrivere
la storia per far tornare verde un controllo è il modo di perdere la storia.
La regola vale **da quando è stata scritta** (`DAL = 2026-08-01`): un file nuovo
ha sempre una data di git ≥ DAL, quindi entra nel controllo **per costruzione**
— non c'è un elenco che possa invecchiare. E il lascito è **misurato**, non
scusato: se un giorno qualcuno lo sistema, il numero scende e la prova lo dice.

## ⚠️ Due errori miei per strada

1. **La prima lista degli «ereditati» era un elenco di cinque prefissi**,
   costruito guardando solo gli ultimi otto giorni. Lanciandolo, lo scarto è
   risultato molto più vecchio — arriva al **21/07** — e l'elenco sarebbe stato
   una difesa che copre un quinto del problema dichiarando di coprirlo tutto.
   Rifatto **dalla misura**, non dalla mia idea di dove fosse il confine.
2. **Il conto diceva 656 e sul disco ce n'erano 656**, ma l'avevo verificato solo
   dopo averlo scritto. Il primo `ls` che avevo fatto ne mostrava tre.

## Verifica

`date-checkpoint` **3/0** (656 checkpoint letti, 640 precedenti alla regola,
184 datati avanti fino a 5 giorni); `run-stile` 271/0; `numeri-nei-documenti`
17/17. Controprova dentro la suite, su mappe in memoria e senza toccare nessun
file: un nome avanti di 8 giorni **viene visto**, un nome che coincide **no**,
un nome **nel passato non è un difetto** (il checkpoint di ieri si può scrivere
stamattina), e un caso dichiarato **non compare** fra le violazioni.

## E il nome di questo file

`20260801-034500`, che è **più basso** di `20260801-073000` scritto poche ore
fa. Non è un errore: è l'ora vera, quella di `date -u`. Da qui in avanti i nomi
tornano a essere ore, e per un po' sembreranno andare all'indietro rispetto al
lascito — è il prezzo di rimettere l'orologio a posto invece di continuare a
correre avanti.

## Prossimo passo atomico

Il **giro completo del browser** è a **295 asserzioni** e continua sul codice di
`04f5ce6`. Leggerlo fino in fondo, poi saldare il debito visivo dichiarato: le
**cinque righe nuove di Scudo** (riepilogo persone, «Nessuna scadenza»,
«Chiusa a metà», «Senza data di nomina», «Stato non indicato»), che il loro
cantiere non ha potuto guardare a schermo.
