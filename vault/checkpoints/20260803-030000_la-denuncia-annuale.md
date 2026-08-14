# Checkpoint — la denuncia annuale dei volumi (Terra)

**Commit:** `a4c093c`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

10 prove sul **riepilogo annuale dei volumi** e sulle **scadenze del
titolo** di Terra. Il numero che esce da qui va all'ente.

La distinzione che regge tutto è una sola: **lo scavo consuma il volume
concesso, la ripresa da un cumulo no** — è materiale già estratto in
passato. Sommarli è «l'errore che si vede fare più spesso sui fogli di
calcolo», e su una denuncia significa **dichiarare di aver consumato
titolo che non è stato consumato**.

La prova non la verifica solo sul totale: la verifica **per differenza** —
fra il cumulato di un anno e quello dell'anno prima ci deve stare
esattamente lo scavo, e nient'altro.

Altre regole messe al riparo:

- **l'anno in corso compare sempre** nell'elenco, anche a volumi zero: la
  denuncia si prepara prima che l'anno finisca e va inviata anche se non
  si è scavato;
- quello che non è dichiarato «cumulo» **vale scavo**. È la scelta
  prudente: dare per ripresa quello che non si sa farebbe risultare più
  titolo residuo di quanto ce n'è;
- bozze, rilievi senza volume e date illeggibili **non entrano** nei
  numeri;
- due fronti diversi non si confrontano fra loro, e il primo rilievo non
  ha un «precedente» — «un volume senza il rilievo di partenza non dice da
  dove è stato misurato»;
- nei tipi di scadenza del titolo **non c'è nessuna periodicità cablata**
  (è materia regionale) e la proposta esce sempre marcata «da verificare».

## Controprova

Undici difetti in una copia del modulo: **11 su 11**.

Due sono partiti storti, e il banco l'ha detto invece di misurare un file
sano:

1. uno puntava al filtro di `anniConVolumi` ma portava il nome di una
   prova che non guarda le bozze — lì una bozza in più non cambia niente,
   perché quell'anno c'era già. L'iniezione andava dove il numero si forma
   davvero (`riepilogoAnnuale`). **Non era il codice difeso: era
   l'iniezione puntata nel posto sbagliato**;
2. l'altro aveva un'ancora che nel modulo compare **dieci volte**.

## Da raccogliere quando finisce il giro del browser

Quel «dieci volte» è una cosa da guardare: il predicato **«rilievo
elaborato con volume»** è scritto **dieci volte** in `terra-data.js`, in
tre varianti (liscio, con il controllo della data, con il controllo
dell'anno). Non è la regola condivisa fra due app — quindi non va in
`shared/` — ma è la stessa regola ripetuta dieci volte dentro un modulo
solo, ed è il modo in cui una variante si stacca dalle altre senza che
nessuno lo veda. Candidata a diventare una funzione sola.

## Numeri

- Terra: **31 → 38 funzioni coperte su 39**
- `run-kpi.mjs`: **927 → 937**; totale `node`: **1.210 → 1.220**

## Censimento, in percentuale

| app | coperte | |
|---|---|---|
| Scudo | 70/71 | 99% |
| Terra | 38/39 | 97% |
| Conti | 54/58 | 93% |
| Flotta | 65/71 | 92% |
| Campo | 65/73 | 89% |
| Sentinella | 89/107 | 83% |

## Stato del giro del browser

In corso, undicesimo banco su diciannove. Tutti i `KO` visti finora sono
quelli attesi dei banchi di controprova.

## Prossimo passo atomico

**Sentinella**, che resta la meno coperta in proporzione (83%): mancano il
**ponte con Scudo** e le **volate previste/eseguite** — `ponteScudo`,
`volataPrevista`, `volatePreviste`, `volateEseguite`,
`etichettaStatoVolata`, `CSV_VOLATE_INTESTAZIONE`. Vanno guardate una per
una prima di scrivere: alcune sono già esercitate di rimbalzo dai test del
ponte, e una prova che ripete una prova esistente alza il totale senza
alzare la difesa.

## Da fare appena finisce il giro del browser

1. una sola `messaggioNumero` (`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`)
   con la prova di **identità**;
2. irrigidire `dataPiuGiorni` sul `null`;
3. raccogliere il predicato «rilievo elaborato con volume» di Terra.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
