# Checkpoint — la misura finisce con «va già bene», e si chiude

- **Tipo**: misura conclusa con esito negativo (nessuna unità da fare)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## La domanda, aperta da tre checkpoint

Il secondo dei «dieci dettagli che fanno sembrare il prodotto curato»
(`docs/RICERCA_VALORE_PRODOTTO_202607.md`): *«gli errori dicono cosa fare, non
cosa è successo»*. Quanti dei messaggi d'errore delle sei app rispondono a
**«e adesso?»**.

## Tre numeri sbagliati prima di uno giusto

1. **72** — la prima sonda afferrava la prima stringa di `esito(...)` anche
   quando il `"err"` stava su un altro ramo. Dichiarata insufficiente.
2. **62** — la seconda contava gli argomenti, ma giudicava con un **elenco di
   parole**. L'italiano attacca il pronome al verbo — *aggiungi-la,
   correggi-la, conferma-la, registra-ne, la trovi* — e il confine di parola non
   lo vede: **almeno 26 dei «62» dicevano benissimo cosa fare.**
3. E anche il **conteggio** era sporco: il tokenizzatore si perdeva sui template
   annidati (è il difetto che poi ha portato alla giornata sulla regola 1).

## Il quarto passaggio: leggerli

**127 messaggi d'errore**, letti col tokenizzatore giusto, uno per uno. Il
risultato è che **vanno già bene**, e le poche eccezioni apparenti erano
artefatti o scelte:

- **Terra** sembrava la peggiore (9 messaggi «nudi»): in realtà usa
  `spiegaNum(...)`, cioè il `messaggioNumero` di `shared/`. Era la mia sonda a
  cancellare le interpolazioni e a farli sembrare monchi.
- **Conti** ha un disegno **a due livelli**, non un difetto: la spiegazione
  completa sta sul campo (`segnaErr`) o in una modale, e la striscia accanto al
  form porta il riassunto. «Non puoi eliminare X: ha 3 fatture collegate» è
  preceduto da una modale che dice *«Collegale prima a un altro cliente dal
  riquadro Fatture da collegare, poi riprova»*.
- **Sentinella** ha il disegno opposto e altrettanto coerente: nota lunga
  accanto al form, toast corto col quarto argomento.

Restano informativi per natura («Non c'è nessuna giornata da esportare»), dove
non c'è nessun «e adesso» da dare.

## Perché lo scrivo invece di trovare qualcosa da riscrivere

Perché la dottrina dice di tradurre la ricerca in unità concrete **mai
gonfiate**. Qui l'unità concreta non c'è: riscrivere messaggi che funzionano
per far vedere del lavoro fatto è il contrario dell'eccellenza. La voce si
chiude con un numero e un metodo, non con un rimando.

## Prossimo passo atomico

Applicare la lezione di stamattina — *una controprova va misurata anche nella
sua copertura* — alle **altre** regole di stile. La regola 1 adesso inietta il
difetto nei file veri in 1030 punti; le regole 12 e 13 hanno solo controprove
**sintetiche**, cioè provano la funzione su tre righe inventate e non su una
superficie da mezzo milione di caratteri. È esattamente la forma di rischio che
oggi si è materializzata.

## Bloccanti

- Nessuno.
