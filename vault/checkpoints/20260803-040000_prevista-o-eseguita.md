# Checkpoint — prevista o eseguita (Sentinella)

**Commit:** `ab16dd2`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

11 prove sulle funzioni che tengono in piedi la distinzione fra le **due
nature di riga** del registro volate: una volata **prevista** (progettata
da Genesi, non ancora sparata) e una **eseguita** (un evento successo).
Confonderle vuol dire mettere un progetto in un registro che va all'ente.

Erano funzioni piccole — filtri, etichetta, elenco di colonne — e proprio
per questo non le aveva mai chiamate per nome nessuna prova.

**La regola dura di compatibilità**: una volata **senza stato vale
eseguita**. È ciò che era: scritta nel brogliaccio dopo lo sparo. Il
contrario — dare per «prevista» quello che non lo dichiara — farebbe
sparire dal registro tutte le volate vere degli anni passati.

**E la prevista non prende i colori del semaforo.** Verde, giallo e rosso
in questa app vogliono dire *conforme*, *al limite*, *superato*: una
volata prevista non è un giudizio di conformità, è un'altra natura di
riga, e prende il colore dell'app. La prova lo verifica su **ogni** riga,
non su una.

Bloccate anche: la divisione previste/eseguite che **non perde né duplica**
righe (una riga sta di qua o di là, mai in tutt'e due e mai in nessuna);
la previsione che si toglie **tutta insieme**, mai il numero senza la sua
provenienza; l'intestazione del CSV che è esattamente quella che l'export
scrive e l'import rilegge; «aperto» che è **tutto ciò che non è chiuso**;
«mensile» che vale 30 giorni ed è una scorciatoia dichiarata, non una
regola di legge; e le **classi acustiche** che descrivono la zona senza
portarsi dentro nessun limite in decibel — il limite lo scrive
l'autorizzazione.

## Controprova

Dodici difetti in una copia del modulo: **12 su 12**.

## Numeri

- Sentinella: **89 → 101 funzioni coperte su 107**. Restano fuori il
  ponte con Scudo, il ponte demo e il caricatore dati: vogliono tutti la
  rete o il `localStorage`, e non sono funzioni pure.
- `run-kpi.mjs`: **937 → 948**; totale `node`: **1.220 → 1.231**

## Censimento

| app | coperte | |
|---|---|---|
| Scudo | 70/71 | 99% |
| Terra | 38/39 | 97% |
| Sentinella | 101/107 | 94% |
| Conti | 54/58 | 93% |
| Flotta | 65/71 | 92% |
| Campo | 65/73 | 89% |

Quello che resta scoperto ovunque è quasi solo **caricatori dati** (che
vogliono la rete) e la costante `AVVISO_DECIMALE`, che è il difetto già
misurato del messaggio scritto due volte.

## Stato del giro del browser

In corso, dodicesimo banco su diciannove, vivo (il log cresce). Tutti i
`KO` finora sono quelli attesi dei banchi di controprova.

## Prossimo passo atomico

Chiudere **Campo** (65/73): restano `numeroIt`, `segnoIt`, `numeroItDa`,
`squadraBase`, `RUOLI`, `formattaProduzione`, `normalizzaPiano`,
`CONSUNTIVO_COLONNE`. Attenzione a una cosa: i primi tre sono **lettori di
numeri**, e `numeroIt` esiste anche nello shell — prima di scrivere una
prova va guardato **se sono alias o seconde implementazioni**, perché nel
secondo caso la prova giusta è quella di **identità**, non di
comportamento, e il lavoro diventa un altro.

## Da fare appena finisce il giro del browser

1. una sola `messaggioNumero` (`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`)
   con la prova di identità;
2. irrigidire `dataPiuGiorni` sul `null`;
3. raccogliere il predicato «rilievo elaborato con volume» di Terra
   (scritto dieci volte).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
