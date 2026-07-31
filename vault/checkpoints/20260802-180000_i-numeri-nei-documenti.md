# Checkpoint — i numeri nei documenti adesso si controllano da soli

- **Tipo**: unità (documenti del fondatore rimessi a posto + un controllo nuovo)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `0e404fc`

## Il difetto, che stavolta era nei documenti

Aggiornando i documenti del fondatore ho trovato **tre conteggi invecchiati**:
«692 prove» quando erano **1.066**, «662» in un altro posto, «17 esecuzioni nel
browser» quando erano **19**. Nessuno se n'era accorto, per il motivo più
semplice del mondo: **un numero scritto in un documento non fallisce.** Sta lì e
invecchia.

È la stessa categoria di difetto che ho inseguito tutto il giorno nel prodotto —
una frase detta con sicurezza che non è più vera — e merita la stessa risposta:
**renderla verificabile invece di ricordarsela.**

## Il controllo

`apps/deepwork-id/tests/numeri-nei-documenti.mjs`, in coda alla suite di CI.
**Lancia** le sei suite, somma, e confronta con quello che i tre documenti
dichiarano. Fa lo stesso con i banchi del browser, contando le voci di
`tutti.mjs`. E stampa **quanti documenti ha letto davvero**.

Una scelta di metodo che vale la pena scrivere: **non conta i `test(` nel
sorgente**. La conta statica dà **737** dove le prove eseguite sono **783**,
perché molte stanno dentro cicli. Un controllo che avesse contato il sorgente
sarebbe stato più veloce, più semplice, e **sbagliato**.

## ⚠️ E la controprova, che stavolta ha smascherato sé stessa

Rimessi i quattro numeri vecchi, uno alla volta, la mia sonda ha risposto **«non
distingue» su tutti e tre** i documenti. Sembrava che il controllo nuovo non
sapesse fallire.

Era cieca **la sonda**: leggeva solo `stdout`, mentre i fallimenti escono su
`stderr`. Il controllo funzionava dall'inizio, e infatti usciva con codice 1
nominando il documento.

È **letteralmente** la regola scritta in `CLAUDE.md` — *il controllo che non
guarda dove crede* — applicata alla sonda che doveva verificare il controllo.
Rifatta leggendo tutti e due i flussi: **4 numeri rimessi indietro su 4, tutti
visti, ognuno col nome del suo documento.**

## Anche i documenti aggiornati per contenuto, non solo per numero

- `docs/DIFETTI_TROVATI_202607.md` — **nuovo**: gli otto difetti raccontati per
  quello che dicevano all'utente, non per come erano scritti nel codice. È il
  documento da dare in mano al fondatore.
- `docs/STATO_PRODOTTO.md` e `docs/DECISIONI_WEEKEND.md` — accanto al numero
  nuovo, i tre difetti che pesano di più e il controllo con l'orologio italiano.
- `docs/INDICE_FONDATORE.md` — il documento nuovo indicizzato, con la verifica
  che tutti i 52 nomi citati puntino a file che esistono.
- `docs/DEVELOPMENT.md` — le due righe di comando nuove, col motivo.
- `vault/ROADMAP_SETTIMANA.md` e `vault/ULTIMO_CICLO.md` — la giornata spuntata.

## Stato

- **1.066** prove `node`, verdi in UTC **e** in ora italiana, più **6** del
  controllo nuovo sui documenti
- **8 difetti di prodotto** trovati e corretti in giornata
- giro a 19 banchi del browser: **in corso**, oltre metà, nessun fallimento
  inatteso

## Prossimo passo atomico

Leggere il riepilogo del giro a 19 banchi quando finisce: è il controllo che
manca alla giornata, perché sei superfici sono state modificate dopo l'ultimo
giro completo. Poi riprendere la copertura da dove il censimento la lascia —
Campo (39/73) e Flotta (36/71) sono le più scoperte.

## Bloccanti

- Nessuno.
