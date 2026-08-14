# Checkpoint — le regole di turno di Campo escono dai commenti

**Commit:** `ae861bb`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

Campo era l'app meno difesa delle sei (39 funzioni coperte su 73). Ho
scritto **25 prove** sulle funzioni che rispondono alle tre domande di
inizio e fine turno: *di chi è questa attività*, *quanto manca
all'obiettivo*, *quanto ci siamo fermati*.

Funzioni coperte: `eMia`, `caricoSquadre`, `obiettivoDi`,
`statoObiettivo`, `fermiPerGiorno`, `storicoSettimana`,
`totaliSettimana`, `unitaPrevalente`, `etichettaAssegnazione`,
`operatoriDi`, `UNITA_ATTIVITA`.

Il punto non è il numero: è **dove stavano scritte le regole**. Erano
tutte già dichiarate — ma soltanto nei commenti del modulo, cioè in un
posto che una riscrittura non incontra. Adesso sono asserzioni:

- le attività **senza squadra** si contano a parte («sono il vero
  problema: non le fa nessuno»). Se finissero dentro una squadra
  qualsiasi sparirebbero dal conto;
- l'obiettivo a zero è **«atteso»**, non un allarme: a inizio turno
  essere a zero è normale, e un rosso lì insegna a ignorare i rossi;
- la produzione conta le **bozze** («la produzione è produzione»), e
  tonnellate e metri cubi **non si sommano mai**;
- nel grafico dei fermi i giorni **prima della prima registrazione**
  restano fuori — disegnarli a zero direbbe «quel giorno non ci siamo
  fermati», mentre non c'era ancora nessuno a registrare. I giorni
  *dentro* la finestra valgono zero, e quello è un dato vero. È la stessa
  regola del giorno: **l'assenza di un dato non è un dato favorevole**;
- senza attività la percentuale di concluse è **vuota, non cento**;
- un'attività della mia squadra senza nome è mia; il mio nome vince sulla
  squadra; chi dichiara **solo** la squadra vede il lavoro di tutta la
  squadra (è il caposquadra: filtrandogli anche il nome non vedrebbe
  niente).

## Controprova

Otto difetti rimessi a mano in una **copia** del modulo
(`apps/campo/_tmp-cp.js`: nessuna pagina la importa, quindi è sicura
anche mentre gira un giro del browser), con `run-kpi.mjs` copiato e
l'import di Campo dirottato sulla copia. **8 su 8** fanno cadere la prova
col loro nome, e la controprova stampa quanti caratteri ha cambiato.

Una cosa da tenere: la prima passata ha dato **7 su 8**, e l'ottava non
era «non distingue» — l'**ancora compariva due volte** (la riga «l'ultimo
salvato vince» sta anche in `meteoDi`) e il banco si è **fermato**
invece di misurare un file sano. È esattamente il difetto del 01/08, e
stavolta si è visto perché il banco conta le occorrenze prima di
scrivere.

## Numeri

- `run-kpi.mjs`: **783 → 808**
- totale prove `node`: **1.066 → 1.091**, zero falliti anche con
  `TZ=Europe/Rome`
- i tre documenti che dichiarano quei numeri sono stati corretti **dal
  controllo che li rilegge** (`numeri-nei-documenti.mjs`), non a memoria:
  li ha trovati fermi a 1.066 e li ha fatti cadere.

## Stato del giro del browser

È **in corso** (19 banchi, log in
`scratchpad/giro-campo/giro21.log`). Il precedente era stato ucciso dal
riavvio del contenitore. Finché gira: si lavora su `docs/`, `vault/` e le
suite `node`; **nessuna modifica ai moduli dati o alle pagine**, e le
iniezioni solo su copie `_tmp-cp*`.

## Prossimo passo atomico

Coprire il secondo gruppo di funzioni scoperte di Campo — quelle della
**foto dell'anomalia** e del **meteo**: `eImmagine`, `byteFoto`,
`eFotoValida`, `misuraRidotta`, `formattaByte`, `FOTO_MAX_BYTE`,
`FOTO_TENTATIVI`, `meteoDi`, `riassuntoMeteo`, `meteoAvverso`,
`checklistDi`. Stesso metodo: sonda prima (misurare, non indovinare i
nomi dei campi — `produzioneDi` vuole `prodQta`/`prodUnita`, e una prova
scritta a occhio dava `fatto: 0` senza accorgersene), blocco di prove
prima del riepilogo finale, controprova su copia, e **verifica che il
totale sia salito**.

Poi il censimento dice **Flotta** (36/71).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
