# Checkpoint — la controprova su una copia, e l'asserzione che lavorava

- **Tipo**: unità (5 prove su `consumoPerMezzo`) + una tecnica nuova
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `609d212`

## Il vincolo che mi ero appena dato, e come si aggira bene

Stamattina ho scritto in `CLAUDE.md` che **non si iniettano difetti nei moduli
dati mentre gira un giro del browser**, perché le pagine se li importano. Ma la
verifica «questa prova sa fallire?» richiede proprio quello.

La via d'uscita è semplice e va scritta perché serve ogni volta: si **copia il
modulo accanto all'originale** (`_tmp-controprova.js`), si inietta il difetto
**nella copia**, si importa la copia da `node`, e si cancella. Nessuna pagina
importa quel nome, quindi il giro del browser non lo vede.
*(La copia va messa nella stessa cartella, non nello scratchpad: il modulo
importa `shared/` con un percorso relativo, e spostandolo si rompe.)*

## Cosa difende la funzione

`consumoPerMezzo` ha un pregio che vale più della divisione: **si rifiuta di
rispondere** quando i dati non bastano, e **dice perché**. Senza un secondo
rifornimento col contatore delle ore non si sa quante ore separano i due pieni,
e un litri/ora inventato è un numero su cui qualcuno decide se un mezzo consuma
troppo.

## La cosa che la controprova ha insegnato

Togliendo il ramo «dati insufficienti», **`litriOra` resta `null` lo stesso** —
con un contatore solo le ore coperte sono zero e il calcolo non parte comunque.

Quindi l'asserzione `eq(m.litriOra, null)` per quel difetto è **vacua**: a
discriminare è quella sulla **ragione**, che col difetto diventa «il contatore
non è cambiato», cioè una spiegazione sbagliata per quel caso.

La prova nel complesso funziona. Ma senza la controprova avrei creduto che a
proteggere fosse la riga sul numero, e chi un domani togliesse quella sulla
ragione renderebbe la prova muta **senza far calare il totale di uno**. È
scritto accanto alla prova, con la misura che lo dimostra.

## Stato

- **496** KPI (433 all'inizio della giornata) → **755** prove `node`, verdi
- **63 prove nuove** nella giornata; **1 difetto di prodotto** corretto
- giro a 19 banchi **pulito**: rilanciato, al primo banco

## Prossimo passo atomico

Leggere il riepilogo del giro a 19 banchi quando arriva. Nel frattempo
continuare la copertura senza toccare i moduli (controprove sulla copia):
le prossime per priorità di danno sono `pianoTagliando` di Flotta — decide
**quando un mezzo va fermato per la manutenzione** — e `statoConsegnaDpi` di
Scudo.

## Bloccanti

- Nessuno.
