# Checkpoint — l'ora vera è nel nome del file

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3d8d40d`

## Task completato

**Il giro del browser adesso dice a che ora è partito** — e `leggi-giro.mjs` lo
riporta nella sezione 0, accanto all'età in commit.

## La causa vera dell'errore di stamattina
Non era la distrazione: **il registro non ha mai detto quando il giro è
partito.** Chi lo legge lo **stima** rileggendo le righe — e io l'ho stimato
«07:55Z» quando era partito alle **06:56Z**, ripetendolo in **sei**
checkpoint. Un'ora di errore su un dato che il programma conosceva alla
perfezione.
⛔ È la regola già scritta dentro `tutti.mjs` per le controprove e per il
riepilogo — *un dato che il programma ha in mano non si indovina dal testo* —
applicata alla cosa più semplice di tutte: **l'ora**. La regola c'era, il
codice che doveva applicarla per primo no.

## Che cosa è cambiato
· `tutti.mjs`: «**Partito alle** \<ISO\> (UTC)» in testa, «**Giro partito …
  finito … XhYY** (UTC)» in fondo. **UTC esplicito**, perché il contenitore è in
  UTC e le cave sono in Italia: un orario senza fuso lo legge ognuno come vuole.
· `leggi-giro.mjs`: `oreDelGiro(testo)` nella **sezione 0**, nei **tre** stati —
  partito+finito; partito **senza** riga di fine (il giro è **tronco**, ed è il
  caso che l'08/08 è costato sette ore e mezza di registro morto letto tre
  volte); e nessuno dei due, dove dice **«non lo si indovina»**.

## Le due cose imparate

1. ⛔ **IL TERZO STATO È QUELLO CHE VALE.** Sarebbe stato naturale fermarsi ai
   due casi utili — c'è l'ora, non c'è l'ora — e far scrivere al lettore
   qualcosa di ragionevole quando manca. Ma «ragionevole» qui vuol dire
   **inventato**, ed è esattamente il difetto da cui nasce l'unità. Il lettore
   dichiara di non sapere, e la controprova lo pretende.
2. ⛔ **E LA CONTROPROVA È STATA PROVATA CONTRO IL DIFETTO**, non solo scritta:
   sostituendo il «non lo so» con un orario inventato, cade e **nomina la
   riga** (`USCITA=1`). Senza quel passaggio non si saprebbe se le tre
   asserzioni guardano qualcosa.

## Verifiche
- `leggi-giro --controprova` verde; col difetto rimesso **USCITA=1** e la riga
  nominata (ripristino da copia + `diff -q`)
- provato sul **registro vivo** di stanotte, che è di prima della modifica:
  dice correttamente «il registro non dice quando è partito»
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo, partito alle **06:56Z** (letto da `ps -o lstart`, non stimato). Il suo
registro è di prima di questa modifica, quindi l'ora non ce l'ha: il prossimo
giro sì.
⛔ Quando finisce: `leggi-giro.mjs`, nell'ordine **età → «non ho guardato» → KO
veri**. Adesso attesta `494863f` con il branch avanti di **47 commit, 11 sulle
superfici misurate**.

## Prossimo passo atomico
**Leggere il giro appena finisce.** Nel frattempo, la fila sicura
(`docs/`, `vault/`, suite `node`): gli **orari falsi dentro i checkpoint di
stamattina** — «vivo dalle 07:55Z» in sei file — non si correggono riscrivendo
i checkpoint, che sono **append-only** per regola: la smentita va dove viene
letta, cioè in `vault/ULTIMO_CICLO.md` (fatto nel canarino) e qui.
⚠️ Quello che resta da fare è **una riga sola**: dire nella roadmap che il
numero «184 checkpoint datati avanti» citato in `CLAUDE.md` è diventato **506**,
così chi lo incontra non lo crede aggiornato.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
