# Checkpoint — 2026-08-14 09:19 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `8e0f5d77` — shared: le due sorelle dei rilievi avevano due contratti
- `5af30bed` — ricerca Flotta, e tre ricerche su tre con una mancanza falsa

## Che cosa è stato completato

**Le due sorelle.** Corretto `misuratoPeriodo` un'ora prima, ho cercato le sue
sorelle nello stesso file — ed è la regola: *quando si stringe il contratto di un
valore si cercano TUTTI i posti che lo leggono*, perché correggerne uno solo non
produce un errore, produce una **divergenza silenziosa**.
`intervalliFraRilievi` guardava con `volumeM3 != null && Number.isFinite(+…)`:
il `!= null` prende `null` e `undefined`, **non la stringa vuota** — e `+""` fa
**0**. Misurato: con `volumeM3: ""` una funzione contava **2 intervalli** e
l'altra **2 rilievi**, cioè divergevano.
⛔ E il difetto stava in una funzione il cui commento, sei righe sopra, dice che
esiste **per togliere la possibilità di chiedere «un periodo che non corrisponde
a nessuna misura»**: si smentiva da sola, e proprio sulle due forme più comuni
dell'assenza.

**La ricerca su Flotta, e la lezione che vale più della ricerca.** Due mancanze
su quattro erano **false**: «safety stock» esiste e si chiama `propostaScorte`,
col punto di riordino calcolato come **consumo × (giorni di consegna + giorni di
sicurezza)** — che è **la formula citata nella metà 1 della ricerca stessa**.
⛔ **E tre ricerche su tre, stanotte, hanno sbagliato per la stessa ragione:
hanno cercato LA PAROLA DEL MONDO dentro il nostro codice.** «near-miss» dove il
campo si chiama `tipo`, «safety stock» dove la funzione si chiama
`propostaScorte`, «modello A» dove la pagina scrive «dichiarazione annuale». Il
prodotto è scritto **in italiano, col nome del mestiere**. La difesa non è
cercare meglio: è cercare **il meccanismo** invece del nome.

## Le misure
`run-kpi` **2285**, prove **2.741**, giro `node` **35 comandi a posto, 0
caduti**, **3.112** asserzioni. **CI verde** su tutti i commit completati del
ramo (verificato con le run di GitHub, non dedotto).
Arretrato della direttiva 7: **24 commit, 5 che mordono** (era 18 — è il prezzo
di una notte produttiva, e c'è un cantiere che lo sta facendo scendere).

## Che cos'è vivo
- **Tre cantieri**: le **38 sottrazioni fra due insiemi** (Conti, Flotta, Terra —
  ripreso dopo il limite di sessione), **B6** la finestra di caricamento (ha il
  browser tutto per sé, nessun giro sta girando), e la **direttiva 7** sui
  documenti del delta che mordono.

## Prossimo passo atomico
Raccogliere i tre cantieri **uno per volta**, indice da HEAD più il solo blocco
di ciascuno — dentro `run-kpi.mjs` scrivono in due. Poi lanciare un **giro
mirato** (`--solo=`) sulle superfici toccate da B6 e dalle sottrazioni: adesso
un giro finito costa **mezz'ora**, non tredici ore.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore; CI verde con l'eccezione
  dichiarata e sorvegliata.
- **B0-septies**, le **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**:
  fermi al fondatore.
