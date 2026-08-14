# Checkpoint — 2026-08-08 16:20 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1d59f24` — misura(5b): il lavoro senza rete

## Che cosa è stato completato
La **seconda metà della 5b**, quella che il fondatore aveva messo **prima della
funzione**. Fatta col ponteggio di stamattina: due schede autenticate come due
telefoni della stessa cava, regole vere, cache locale accesa.

| # | caso | esito |
|---|---|---|
| 1 | rete staccata, si scrive | la scrittura **si fa**, ma la **rilettura non riesce** (`unavailable`) |
| 2 | rete riattaccata | la scrittura **arriva da sola** — la metà buona |
| 3 | Anna staccata scrive, Bruno **online** scrive la stessa riga | al ritorno **vince Anna**, e quella di Bruno **sparisce in silenzio** |
| 4 | scheda chiusa con la coda dentro | al database non è arrivata |

⛔ **Il caso 3 è il motivo per cui questa misura veniva prima.** È la stessa
perdita silenziosa che questa settimana sta togliendo dai dodici punti, **un
piano più in su** — e le **transazioni non la coprono**: una transazione offline
non può rileggere niente.

⚠️ **Il caso 4 è un limite del BANCO, non del prodotto**, e va detto: qui la
scheda si chiude con `context.close()`, che butta via **anche il profilo** del
browser e con lui l'IndexedDB. Dimostra che una coda non sopravvive a un
**profilo nuovo** — non che un utente che riapre lo stesso browser la perda.
Servirebbe lo stesso `userDataDir`, e **non l'ho fatto**: scriverlo come «la
coda si perde chiudendo la scheda» sarebbe stato più comodo e **falso**.

## Che cosa NON si può concludere
Che la coda non si possa fare: **si può**, arriva da sola. La misura dice che
accenderla **così com'è** introdurrebbe una perdita silenziosa, e che prima
serve una risposta a *«chi ha scritto per ultimo, e come lo diciamo a chi ha
perso»*. È una **scelta di prodotto**: non l'ho presa, e la coda **non è stata
accesa**.

## ⚠️ Due trappole già scritte in CLAUDE.md, rifatte da me scrivendo il banco
- **apici inversi dentro un template literal**, che lo chiudono;
- un **rifiuto asincrono** che attraversa il confine col banco e lo **uccide**
  invece di essere una risposta — la stessa di stamattina, un piano più in là.

## Prossimo passo atomico
La 5b è **misurata da capo a fondo**; quello che resta è una **decisione del
fondatore**, scritta in roadmap. Non va anticipata.
Da qui il lavoro utile è: **raccogliere il giro del browser** quando finisce
(`leggi-giro.mjs`, sezione 1 prima della 2) — attesta `c3888fe`, e nessuna
delle ventuno unità di oggi è dentro.

## Blocchi
Nessuno.
