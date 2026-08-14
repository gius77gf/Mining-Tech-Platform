# Checkpoint — Flotta, nove documenti su nove

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Il banco dei documenti di Flotta chiude il censimento: 9 punti d'uscita su
9.** I cinque che mancavano — fermi macchina, scadenze di legge, costi,
ricambi e il libretto del mezzo — sono stati aperti e sono **puliti**.

Il cantiere che aveva letto il codice li dava già per puliti. Li ho aperti lo
stesso, e la ragione è la regola di casa: **un negativo dedotto non vale
niente.** Su cinque app il censimento *statico* di questa stessa domanda aveva
dato **zero** mentre i difetti c'erano — il modo di misurarlo non è leggere il
codice, è premere il bottone e aprire il file.

⚠️ **E «pulito» qui ha un'ampiezza dichiarata, non sottintesa.** Sui cinque
nuovi le prove sono più larghe di quelle dei primi quattro: il file esce, non è
la sola intestazione, nessuna cella dice «undefined», «null» o «NaN», e — sul
libretto — i vuoti li dichiara a parole invece di lasciarli in bianco. Sono i
due modi in cui Flotta è già stata morsa. Non è la profondità del confronto
riga-per-riga con lo schermo che hanno i primi quattro, e va detto: qui
«pulito» vuol dire «nessuna di QUESTE domande ha trovato niente».

## Verifiche
- banco: **57 passati, 0 falliti**, 9 punti d'uscita su 9
- controprova: **12 KO voluti**, «i 5 difetti sono stati rimessi davvero»
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)
- `iniezioni-fresche` **179 su 179** — le cinque sezioni nuove non ne hanno
  aggiunte, e infatti il numero non si muove
- nessun numero dei documenti cambia: non sono state aggiunte prove `node`

## Stato roadmap
Domanda *«chi decide i numeri di ciò che ESCE?»* — stato per app:
- **Campo 6/6**, **Sentinella 5/5**, **Terra 3/3** → tutte delegano
- **core 2/2** → un difetto vero, corretto
- **Flotta 9/9** → **quattro** difetti veri, tutti corretti e blindati; gli
  altri cinque documenti misurati e puliti
- **Conti 12**, **Scudo 5**, **Genesi 9** → cantieri di analisi in corso

## Prossimo passo atomico
**Leggere il giro del browser (pid 21084) con `leggi-giro.mjs`**, che gira da
ore sulla sua copia: si parte dalla **sezione 0** (di quanti commit il branch è
andato avanti da quello che il giro attesta, e quanti di quelli toccano le
superfici misurate), poi dalle righe «**non ho guardato**», e solo dopo dai KO
— e ricordando che nel registro il rosso di una CONTROPROVA si scrive uguale a
quello vero, per cui vanno usati i marcatori `⚠️ CONTROPROVA` / `FINE
CONTROPROVA` invece di leggere le intestazioni a occhio.
La domanda da fargli: **quali controprove non sanno più fallire** sul codice di
oggi. L'ultimo giro ne mostrava dieci, ma tre sono state chiuse oggi e quel
registro attestava un commit di venti indietro.

Se il giro non è ancora finito, l'alternativa già pronta: portare la stessa
domanda dei documenti su **Conti** (dodici punti d'uscita, il numero più alto
dell'ecosistema) col banco appena scritto per Flotta come modello — attenzione
che in Conti alcune uscite sono **stampe**, non CSV.

## Blocchi
Nessuno.

## Note
I due server orfani sono stati tolti nell'unità precedente. Resta vivo solo
quello del giro (pid 21103, cartella `giro-copia-21084`, porta 8823).
