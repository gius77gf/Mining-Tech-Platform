# Checkpoint — gli incassi veri e i DDT di Conti

**Commit:** `8883483`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

17 prove su Conti: **incassi**, **tempi di pagamento**, **pesate/DDT** e
**fattura differita**. Due parti diverse tenute insieme da una regola
sola, che è poi la regola della giornata di ieri:

> **quello che non ha una data non entra in una media, e viene detto a
> parte.**

### Gli incassi

Le fatture segnate «incassata» **prima che esistesse la data d'incasso**
non hanno un giorno. Contarle a zero giorni le farebbe entrare nelle medie
come pagamenti immediati — cioè **farebbe sembrare i clienti più puntuali
di quanto sono**. Adesso restano fuori dalle medie e vengono dichiarate
(`senzaData`, `importoSenzaData`) sia nel periodo sia nel totale
d'archivio.

Bloccato anche il resto del meccanismo:

- due acconti che coprono il totale saldano la fattura, e il giorno del
  saldo è quello dell'**ultimo** movimento;
- un movimento **orfano** (la fattura non c'è più) non conta: sommarlo
  gonfierebbe l'incassato con un numero che non si può nemmeno aprire;
- l'incassato del grafico sta nel **mese in cui i soldi sono entrati**,
  non in quello di emissione. Prima della data vera quel confronto non si
  poteva fare onestamente: l'incassato copiava l'altra serie, e il grafico
  mostrava due linee identiche.

### I DDT

- il **netto non si digita**: è lordo − tara, perché è il numero che va in
  fattura. E una tara più grande del lordo **non fa un netto negativo**;
- la conversione in metri cubi si fa **solo se la densità c'è**: le
  tonnellate le ha pesate la bilancia, i metri cubi sono un conto. Il
  materiale senza densità porta le sue tonnellate ma resta fuori dai m³ e
  dai €/m³;
- lo stesso prodotto a **prezzi diversi resta una riga diversa** di
  fattura: raggrupparlo darebbe un prezzo unitario medio che non compare
  su nessun DDT e non si potrebbe spiegare al cliente;
- senza nessun DDT la fattura è `null`, non una fattura vuota da zero euro
  che qualcuno può emettere.

## Controprova

Tredici difetti in una copia del modulo: **13 su 13** fanno cadere la
prova col loro nome. Uno si è **fermato** invece di misurare un file sano
— l'ancora `senzaData++ …` compare anche in `emessoIncassato` — ed è
servito il commento della riga sopra per prendere quella giusta. È la
terza volta oggi che il banco si ferma su un'ancora doppia: la difesa
funziona.

## Numeri

- Conti: **43 → 54 funzioni coperte su 58**
- `run-kpi.mjs`: **880 → 897**; totale `node`: **1.163 → 1.180**

## Censimento aggiornato

| app | coperte |
|---|---|
| Sentinella | 77/107 |
| Campo | 65/73 |
| Flotta | 65/71 |
| Scudo | 55/71 |
| Conti | 54/58 |
| Terra | 31/39 |

## Stato del giro del browser

In corso, quinto banco su diciannove (unità in maiuscolo). Niente
modifiche a moduli e pagine finché gira.

## Prossimo passo atomico

**Sentinella**, che con 30 funzioni scoperte su 107 è tornata la meno
difesa in numero assoluto. Il gruppo più utile è quello dell'**import dei
dati dal sismografo**: `leggiCsv`, `parseIntestazione`, `dataIso`,
`oraHm`, `firmaLettura`, `chiaveOrdine`, `MAX_LETTURE` — è la strada da
cui entrano i numeri che poi finiscono nel report per l'ente, ed è dove il
31/07 è già uscito un difetto vero (la misura che spariva annunciata come
«1 doppione scartato»).

## In sospeso, con la sua ragione

La correzione di `messaggioNumero` scritto due volte
(`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`) tocca cinque moduli dati:
**aspetta la fine del giro del browser**, non una decisione.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
