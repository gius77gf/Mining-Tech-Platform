# Checkpoint — 2026-08-09T11:14:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`93729ae`

## Task completato

**L'orologio del vault stampava «NaN giorni» nella riga che dice al ciclo da
dove ripartire** — e la correzione ovvia sarebbe stata peggiore del difetto.

| | prima | adesso |
|---|---|---|
| la riga del diagnostico | «un file scritto **NaN giorni** PRIMA» | «un file scritto **56 minuti** PRIMA» |
| prove di `date-checkpoint` | 6 | **7** |

## Le due cose imparate

1. ⛔ **UNA FUNZIONE NUOVA NON HA PRESO IL POSTO DI NIENTE: A CAMBIARE È STATO
   IL *TIPO* DI CIÒ CHE LE SI PASSA.** Veste nuova di una famiglia già scritta
   in `CLAUDE.md`. `giorniFra` vuole due `YYYY-MM-DD` e li incolla a
   `"T00:00:00Z"`; è **giusta** dov'è usata per il confronto a giorni. Ma
   stamattina la `MAPPA` è passata da date a **timestamp interi** — per rendere
   il guardiano sensibile alle ORE — e questo chiamante ha continuato a
   passargliela. `Date.parse("2026-08-09T11:09:51+00:00" + "T00:00:00Z")` fa
   **NaN**: nessun errore, nessuna prova rossa, **tre lettere in mezzo a una
   frase sensata**. La domanda da fare cambiando il contenuto di una struttura
   dati è *chi altro la legge, e credendola di che forma?* — e non la risponde
   il compilatore, perché non c'è.
2. ⛔ **E LA CORREZIONE OVVIA ERA LA CORREZIONE FACILE CHE DÀ IL VERDE FALSO.**
   Dividere per `864e5` invece di incollare la mezzanotte è un carattere e
   toglie il `NaN`: avrebbe stampato **«0 giorni»**, che si legge «nessuna
   differenza» proprio dove la differenza c'è ed è il motivo per cui il file
   esiste. I due candidati di adesso distano **cinquantasei minuti**. Cioè un
   righello che arrotonda a giorni è **esattamente il difetto che il guardiano
   ha smesso di avere un'ora fa**, rimesso dentro il suo stesso diagnostico.
   ⚠️ È la regola generale già scritta oggi in `CLAUDE.md` — *quando un
   controllo dichiara un arretrato, si guarda con che UNITÀ lo misura* —
   applicata al file che quella regola l'ha prodotta. Una regola scritta in un
   documento non protegge lo strumento che si sta scrivendo.

## Verifiche
- `date-checkpoint` **7 passati, 0 falliti** · 953 checkpoint
- la prova copre i **quattro** casi (minuti, ore, giorni, singolare) **più il
  difetto vero rimesso**: un argomento illeggibile deve dare `null`, non `NaN`
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo dalle **06:56:09Z** (pid 2712, ~4h18), su `uno-solo.mjs --controprova`.
Registro **530 KB**. ⚠️ Quella passata è una **controprova**: il suo rosso è
quello VOLUTO, e il registro adesso lo dichiara con inizio e fine.

## Cantieri paralleli aperti
Flotta, Campo, Sentinella — nessuno committa. Al rientro: **rimisurare** ogni
difetto riferito prima di scriverlo da qualche parte.

## Prossimo passo atomico
⛔ **Il giro, appena finisce, ha la precedenza**: `leggi-giro.mjs` nell'ordine
**età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
Se non è ancora finito: continuare sugli **strumenti che si misurano da soli** —
la domanda che ha appena reso due unità è *«questo numero, chi lo legge e
credendolo di che forma?»*, e i candidati sono gli altri chiamanti di funzioni
che hanno cambiato tipo di argomento oggi (`MAPPA`, e le tabelle di
`iniezioni-fresche` allargate stamattina).

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2), **`#vf-ente`** (termine dell'art. 71 c.11), e la
scelta di **quali** delle 47 mancanze confermate diventino lavoro.
