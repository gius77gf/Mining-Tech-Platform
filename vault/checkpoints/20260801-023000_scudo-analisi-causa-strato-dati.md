# Scudo: l'analisi della causa, lo strato dati

**Data:** 01/08/2026 · **App:** Scudo
**Unità precedente:** `20260801-020000_terra-i-lotti-lo-strato-dati.md`

## Cosa è stato fatto

`CAUSE_ANALISI`, `nominaUnaPersona`, `validaAnalisi`. Scudo aveva già la catena
evento → azione correttiva, e la pagina spinge ad aprire l'azione dicendo —
testuale — che «registrarlo serve a poco se non si corregge quello che l'ha
causato». Ma il *quello che l'ha causato* non era scritto da nessuna parte: la
parola **causa** compariva **una volta sola** in tutta l'app, dentro quella
frase.

## Il pezzo che vale: il nome non si indovina, si cerca

I «5 Perché» finiscono quasi sempre **sulla persona** («perché non ha
guardato» → «perché è distratto»), e come azione correttiva quello produce un
richiamo, cioè niente. La difesa è di prodotto: se l'ultimo perché nomina una
persona, l'app **chiede** — non vieta.

E il *come* non è un'euristica linguistica: in italiano «Rossi» è un cognome e
anche un colore, e un controllo che sbaglia **accusa chi ha scritto la verità**,
cioè fa esattamente il danno che dovrebbe evitare. Ma Scudo ha già la
collezione **`lavoratori`**: il confronto è coi nomi veri dell'azienda, a parola
intera. E `normalizzaTesto` c'era già — si chiama, non si riscrive.

## ⚠️ La controprova ha smascherato una mia prova che mentiva

Rimettendo due difetti — il confronto **non** a parola intera, e l'avviso sulla
persona reso **bloccante** — ne è caduto **uno solo**.

La diagnosi è il caso (1) di `CLAUDE.md`: **la prova non provava niente.**
Diceva «*bordo* non accusa il lavoratore *Bo*: si pretende la parola intera»,
e passava per una ragione **diversa da quella scritta nel suo nome** — «Bo» ha
due lettere, e lo scarta prima il filtro `length >= 3`. La parola intera non
c'entrava.

Misurato e sdoppiato in due prove, ognuna col suo motivo:
- un cognome di due lettere **non si cerca affatto** (troppo rumore);
- «**muratura**» non accusa la lavoratrice **Mura** — e questa, col difetto
  rimesso, **cade**.

Non ho reso la prova più permissiva: l'ho resa **più giusta**, che è la regola
di casa quando una prova invecchia o mente.

## Le prove

Quattro `test` nuovi (**1068 → 1072**), e le due controprove ora cadono
entrambe dove devono. `CAUSE_ANALISI` ha la sua prova, che fissa anche che
**«comportamentale» è l'ultima** delle sei: non è il fondo in cui far cadere
quello che non si capisce.

Stato: `run-kpi` **1072**, prove `node` **1.430**, copertura **447/447**,
`run-stile` 268, sonda del vuoto 7/7.

## Prossimo passo atomico

**La schermata dell'analisi** dentro la scheda dell'evento in Scudo: la catena
dei perché che parte da **tre** righe e cresce (cinque caselle vuote si
riempiono per farle sparire), la famiglia della causa, il collegamento
all'azione correttiva che esiste già, e nel Quadro il conto degli **eventi
gravi senza un perché**.

Poi `eventiSenzaAnalisi` e `causeRicorrenti`, con la guardia dei numeri piccoli
**presa da `riepilogoNearMiss`** — chiamata, non ricopiata: tre eventi
analizzati su venti non dicono «la causa principale è organizzativa», dicono
che sono stati analizzati tre eventi su venti.
