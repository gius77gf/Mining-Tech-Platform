# Checkpoint — 2026-09-16T17:25:58Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
3c96d8d4

## Cosa è stato completato
Sesto scrittore migrato al vocabolario condiviso `STATO_CELLA_*` di P2
(`docs/RICERCA_CONTINUA_ASSENZA.md` §4): `csvListino` di Conti — **più
della metà degli undici CSV di D1** ora migrati.

Controllato PRIMA di scrivere codice (disciplina ormai consolidata dopo
il caso `csvClienti`/`csvGare` scartati nell'unità precedente):
`csvListino` NON ha nessuna colonna `stato` preesistente — candidato
pulito. `prezzo` è esattamente il campo per cui D1 misurava «1→0 RIGA
PERSA»: `parseListinoCsv` scarta la riga con `.filter(p => p.nome &&
p.prezzo != null)`, la stessa famiglia di `volumeM3` (Terra) e `importo`
(incassi di Conti). Stesso binario, nessuna ragione più fine da
distinguere: `STATO_CELLA_MISURATO` quando `prezzo` è un numero,
`STATO_CELLA_MAI_MISURATO` quando manca.

Sesta colonna, prima fetta: solo lo scrittore, `parseListinoCsv` resta
posizionale a cinque campi (compatibilità all'indietro provata).

Toccati, oltre a `csvListino`:
- `apps/deepwork-id/tests/run-kpi.mjs`: due asserzioni esistenti che
  ancoravano la fine della riga sull'aliquota IVA aggiornate; nuovo test
  dedicato con controprova di identità, più la prova di compatibilità
  all'indietro.
- `shared/deepwork-id-client/dw-shell.js`: `CSV_TABELLE` per
  `conti.listino` (guardia B8 — sesto colpo consecutivo della stessa
  guardia in sei unità).

Controprova sul codice vero: sostituita la costante con una stringa
quasi identica, confermato che il test dedicato cade, ripristinato via
`cp` + `diff`.

Doc-cascade: run-kpi 3102→3103, somma nove suite 3.596→3.597, giro-totale
4081→4082. Giro isolato su worktree pulita: **41/41 comandi, 0 caduti,
4082 asserzioni — predetto e confermato ESATTO al primo tentativo**
(settima unità di fila con predizione esatta).

## Stato roadmap
P2 della ricerca ASSENZA avanza a **sei scrittori su undici** migrati
(Flotta, Terra, Conti×3, Sentinella) — più della metà. Il documento
dichiara i cinque candidati rimasti: fatture/gare-residue di Conti,
mezzi/ricambi-residui di Flotta, lavoratori di Scudo, monitoraggi/volate
di Sentinella; le scadenze unificate (Terra/Flotta/Scudo dietro
`statoScadenza`) sono probabilmente NON adatte per la stessa ragione
della collisione di nome, ma vanno controllate, non assunte.

## Prossimo passo atomico
Sei unità consecutive su P2 hanno prodotto valore reale, tutte verificate
con lo stesso rigore. **Punto di decisione esplicito**: continuare al
settimo scrittore (rileggere §3 di `docs/RICERCA_CONTINUA_ASSENZA.md` per
i cinque candidati rimasti, controllando per ciascuno la collisione di
nome `stato` PRIMA di scrivere codice — non dare per scontato che il
pattern binario si applichi meccanicamente, come già dimostrato da
`csvPesate`'s terzo codice) OPPURE tornare al binario 2 della fase
aperta il 26/08 (passata in profondità su un'app non ancora coperta con
questo metodo: Scudo oltre l'unità INAIL, Terra, o una nuova
sovrapposizione nella mappa ecosistema). Entrambe le strade restano
legittime; la scelta è aperta al prossimo ciclo, non vincolata da questo
checkpoint.

## Blocchi
Nessuno.
