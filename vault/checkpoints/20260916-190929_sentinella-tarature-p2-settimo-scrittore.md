# Checkpoint — 2026-09-16T19:09:29Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4c07f776

## Cosa è stato completato
Settimo scrittore migrato al vocabolario condiviso `STATO_CELLA_*` di P2
(`docs/RICERCA_CONTINUA_ASSENZA.md` §4): `csvTarature` di Sentinella —
**e l'ultimo candidato libero degli undici di D1.**

Controllati PRIMA di scrivere codice i due candidati rimasti oltre a
Clienti/Gare (già scartati): `csvSquadre` di Campo scrive già una colonna
`stato` con significato diverso (lo stato operativo della squadra,
`"operativa"` di default) e `csvAzioni` di Scudo pure (lo stato del
workflow dell'azione correttiva, `"aperta"` di default) — entrambi
scartati per la stessa collisione di nome. `csvTarature` non ha nessuna
colonna `stato` preesistente: candidato pulito.

Qui il campo misurato da D1 è una DATA (`scadenza`), non un numero, e la
riga non sparisce mai (stessa famiglia dei ricettori). Letto prima
`ragioneData` (shared/dw-shell.js), che per una data distingue TRE
ragioni — non scritta, non esiste, non si legge — sembrava l'occasione
per un secondo terzo-codice dopo `csvPesate`. Non lo è: a differenza di
`pesiPesata` (che decide leggendo direttamente i due pesi grezzi), qui la
tripla distinzione vive solo nel messaggio del lettore durante il
parsing — l'oggetto applicativo porta `scadenza` già passata da `dataIso`,
che collassa "non scritta" e "non esiste" nello stesso `""`. Un terzo
codice qui avrebbe ricostruito una distinzione che il modello non porta
più. Quindi binario: `STATO_CELLA_MISURATO` quando `dataISOEsiste(scadenza)`
(riusata, non riscritta), `STATO_CELLA_MAI_MISURATO` altrimenti — provato
esplicitamente sia sul vuoto sia sulla data rotta (30/02), perché non
restasse un caso implicito nel test.

Settima colonna, prima fetta: solo lo scrittore, `parseTaratureCsv` resta
posizionale a sei campi (compatibilità all'indietro provata).

Toccati, oltre a `csvTarature`:
- `apps/deepwork-id/tests/run-kpi.mjs`: nuovo test dedicato con tre casi
  (misurato, mai-misurato, data rotta) più la prova di compatibilità
  all'indietro e l'intestazione esatta.
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per
  `sentinella.tarature` (guardia B8 — settimo colpo consecutivo della
  stessa guardia in sette unità).

Controprova sul codice vero: invertita la condizione
(`STATO_CELLA_MISURATO`↔`STATO_CELLA_MAI_MISURATO`), confermato che il
test dedicato cade, ripristinato via `cp` + `diff`.

Doc-cascade: run-kpi 3103→3104, somma nove suite 3.597→3.598, giro-totale
4082→4083. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4083 asserzioni — predetto e confermato ESATTO al primo tentativo**
(ottava unità di fila con predizione esatta).

## Stato roadmap
**P2 della ricerca ASSENZA ha raggiunto il suo limite naturale sui CSV di
D1: sette scrittori su undici migrati**, e i quattro rimasti
(`csvClienti`/`csvGare` di Conti, `csvSquadre` di Campo, `csvAzioni` di
Scudo) hanno tutti una colonna `stato` propria di significato diverso —
riusarla sarebbe il difetto che questo vocabolario esiste per evitare.
Non c'è un ottavo scrittore ovvio da fare.

Verificato anche che le altre due strade di "binario 2" del checkpoint
precedente sono già chiuse: il censimento delle sovrapposizioni
nell'ecosistema è stato completato lo stesso giorno
(`docs/MAPPA_ECOSISTEMA.md` §3h, "nessuna sovrapposizione nuova"), e la
passata di profondità su Scudo era già stata fatta nel ciclo precedente
(compaction boundary). **Resta aperta la passata di profondità su Terra**,
non ancora coperta con questo metodo in questa sessione.

## Prossimo passo atomico
Due strade legittime per la prossima unità, nessuna delle due P2 (esaurita
sul perimetro D1):
1. **Passata di profondità (binario 2) su Terra**: rileggere il modulo
   `apps/terra/terra-data.js` (4238 righe) e `apps/terra/index.html`
   (4896 righe) cercando una funzione consegnata ma superficiale — nello
   stile delle passate già fatte su Scudo — da portare a eccellenza col
   metodo del confronto affiancato (CLAUDE.md, "l'eccellenza è lo
   standard").
2. **Aprire la domanda lasciata esplicitamente in sospeso** dalla nota di
   chiusura del settimo scrittore in `docs/RICERCA_CONTINUA_ASSENZA.md`:
   per i quattro CSV con `stato` proprio (Clienti/Gare di Conti, Squadre
   di Campo, Azioni di Scudo), il LORO vocabolario di stato copre già la
   distinzione misurato/non-misurato, o è un concetto ortogonale che
   lascerebbe comunque un buco? Richiede di leggere ogni lettore/scrittore
   dei quattro CSV e la funzione che decide il loro `stato` proprio
   (es. `statoAzione` di Scudo) prima di concludere in un senso o
   nell'altro — NON assumere, misurare.
La scelta fra le due è aperta al prossimo ciclo. Se nessuna delle due
produce un'unità pulita in tempi ragionevoli, tornare alla lista
"SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md (seconde iterazioni, P3 di
ASSENZA — già misurata come costosa ma non impossibile, revisione
qualità/sicurezza, nuova deep-research a rotazione).

## Blocchi
Nessuno.
