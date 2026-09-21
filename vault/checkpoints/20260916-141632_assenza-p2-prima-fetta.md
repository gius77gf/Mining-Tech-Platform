# Checkpoint — 2026-09-16T14:16:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
ac2de26c

## Cosa è stato completato
Prima fetta di P2 della ricerca ASSENZA (`docs/RICERCA_CONTINUA_ASSENZA.md`
§4) — la proposta più grande, esplicitamente deferita in checkpoint
precedenti come "richiede una decisione di design". Presa la decisione
minima possibile per iniziare senza bloccarsi su una scelta larga: nascere
il vocabolario in `shared/` PRIMA di decidere quale dei 10 CSV rimanenti
lo adotti per primo, così ogni scrittore futuro parte da una base comune
invece di ricopiare le due parole che Flotta aveva già scritto a mano.

Aggiunte sei costanti in `shared/dw-ponti.js` (`STATO_CELLA_MAI_MISURATO`,
`_NON_APPLICABILE`, `_ILLEGGIBILE`, `_NON_ANCORA`, `_PREDEFINITO`,
`_MISURATO`) più `STATI_CELLA`, l'elenco chiuso, con la corrispondenza
SDMX/GML dichiarata nella ricerca. Migrato `csvRicambi` di Flotta (che P4,
implementata in un'unità precedente di questa sessione, aveva già scritto
con le stesse due parole `"predefinito"`/`"misurato"` a mano) a importare
le costanti condivise — esattamente il rischio già censito in questa casa:
"una copia debole nasce sempre da una firma troppo stretta", qui presa
PRIMA che una seconda copia nascesse davvero.

Test: prova di identità (il CSV deve contenere il VALORE della costante
importata, non una stringa che per caso combacia) più una prova sul
vocabolario intero (sei codici, tutti distinti, nell'ordine dichiarato).
Controprova sul codice vero: sostituita la costante con una stringa quasi
identica (`"predefinito-FINTO"`), confermato che il test cade, ripristinato
via `cp`+`diff`. I quattro codici non ancora usati da nessuno scrittore
sono stati provati per il loro VALORE (altrimenti la copertura li avrebbe
lasciati scoperti, ed è esattamente il caso che
`copertura-funzioni.mjs` ha segnalato al primo lancio: 93/97, corretto a
97/97).

Doc-cascade: run-kpi 3097→3098, somma nove suite 3.591→3.592, giro-totale
4076→4077, censimento del codice condiviso 336/336→343/343 (`dw-ponti.js`
90/90→97/97). Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4077 asserzioni — predetto e confermato ESATTO al primo tentativo**
(diversamente dalle due unità precedenti di questo blocco, dove la
predizione era stata corretta dopo la misura).

**Quello che questa fetta NON fa, dichiarato nel documento di ricerca**:
nessuno degli altri dieci CSV di D1 scrive ancora questa colonna; nessun
lettore la rilegge; i quattro codici dichiarati (`mai-misurato`,
`non-applicabile`, `illeggibile`, `non-ancora`) esistono solo come
vocabolario, non esercitati da nessun caso reale del prodotto.

## Stato roadmap
Chiude parzialmente P2 della ricerca ASSENZA (era esplicitamente deferita
in checkpoint precedenti di questa sessione come "richiede una decisione di
design più grande"). La decisione presa è la più piccola possibile: il
vocabolario nasce condiviso, la migrazione dei restanti dieci scrittori
resta aperta e non è stata forzata in questa unità.

## Prossimo passo atomico
Scegliere il SECONDO scrittore da migrare a `STATO_CELLA_*` — i candidati
con l'assenza più frequente misurata in D1/D3 di
`docs/RICERCA_CONTINUA_ASSENZA.md` sono i rilievi di Terra
(`csvRilievi`/`parseRilieviCsv`) e le pesate/incassi di Conti. A differenza
di Flotta (che aveva già i due stati locali da migrare), questi lettori
partono da zero: la colonna `stato` va aggiunta come nuova, con un
`?? STATO_CELLA_MISURATO` o simile per non rompere il giro di andata e
ritorno sui file esistenti (compatibilità all'indietro, come già fatto per
`fronte` in `parseRilieviCsv:1776`).

In alternativa, riprendere la passata "in profondità" su Campo (candidati
1-2 del checkpoint `20260916-132643_conti-chiusura-decimo-giro.md`, non
ancora esauriti).

## Blocchi
Nessuno.
