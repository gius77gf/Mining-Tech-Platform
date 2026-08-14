# Checkpoint — Campo chiude a 73 su 73

**Commit:** `2e7b220`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

11 prove sull'ultimo gruppo scoperto di Campo: le funzioni che decidono
**come un numero arriva sotto gli occhi di chi lavora**. È lì che una
carica non registrata può diventare «0 kg» — cioè un fatto, e falso.

Regole bloccate:

- `null` e stringa vuota **non sono zero** (ma uno zero *scritto* si
  vede: sono due cose diverse);
- il **raggruppamento delle migliaia fissato a mano**, perché al valore di
  default 1286 esce «1.286» su Chromium e «1286» su Node — lo stesso
  numero in due modi a seconda di dove gira;
- il **segno meno tipografico** (U+2212, non il trattino) negli
  scostamenti, dove il verso è metà dell'informazione;
- il testo di un file che non è un numero **torna com'era** invece di
  sparire: è roba di un file, non la si indovina;
- sul **piano di carico**: le righe senza foro o senza carica prevista
  escono (farebbero un consuntivo su fori che non esistono), e la carica
  reale non ancora registrata resta **`null` e non zero** — zero chili di
  esplosivo in un foro è un fatto, e se non è vero falsa lo scarto e
  quindi la riconciliazione con Genesi;
- le **colonne del consuntivo dicono l'unità nel nome** (`carica_prog_kg`,
  non `carica_prog`): chi apre il file in un foglio di calcolo non ha
  nessun altro posto dove leggerla.

## La terza duplicazione trovata oggi, e perché questa NON va in `shared/`

`numeroIt` esiste in **due app**, e misurato su dodici valori dà **sei
risposte diverse**:

| | Campo | Sentinella |
|---|---|---|
| dato che manca | `""` | `"—"` |
| 312,5 | `312,5` | `313` |

Le differenze sono **volute e dichiarate nei commenti** dei due moduli:
in un rapporto di monitoraggio il trattino dice «non è stato misurato», e
l'arrotondamento all'unità da cento in su è la regola di lettura di
Sentinella («1.286,00 letture» non aggiunge niente). Quindi **non è la
stessa regola scritta due volte**, e non va in `shared/` così com'è —
diversamente da `messaggioNumero`, che invece lo è.

Ma il **nucleo** è identico in tutt'e due: «null e "" non sono zero», il
raggruppamento fissato a mano. Ed è la parte che resta indietro in una
delle due se un giorno viene corretta nell'altra. La prova rende visibile
quel confine invece di lasciarlo alla memoria.

## Controprova

Nove difetti in una copia del modulo: **9 su 9**.

## Numeri

- Campo: **65 → 73 su 73**. **Prima app al cento per cento.**
- `run-kpi.mjs`: **948 → 959**; totale `node`: **1.231 → 1.242**

## Censimento

| app | coperte | | cosa resta |
|---|---|---|---|
| Campo | 73/73 | 100% | — |
| Scudo | 70/71 | 99% | caricatore dati |
| Terra | 38/39 | 97% | `AVVISO_DECIMALE` |
| Sentinella | 101/107 | 94% | ponti + caricatore |
| Conti | 54/58 | 93% | `round2`, `valorePesata`, `AVVISO_DECIMALE`, caricatore |
| Flotta | 65/71 | 92% | il blocco `messaggioNumero` + caricatore |

Quello che resta è quasi tutto o **codice che vuole la rete**, o
`AVVISO_DECIMALE` — cioè il difetto già misurato del messaggio scritto
due volte, che si chiude con la correzione in sospeso.

## Stato del giro del browser

In corso, tredicesimo banco su diciannove.

## Prossimo passo atomico

Chiudere **Conti** con `round2` e `valorePesata` (due prove piccole), e
poi — se il giro non è ancora finito — preparare la correzione di
`messaggioNumero` come **patch pronta da applicare**, così parte nel
momento esatto in cui il giro finisce.

## Da fare appena finisce il giro del browser

1. una sola `messaggioNumero` (`docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`)
   con la prova di **identità** — chiude anche gli `AVVISO_DECIMALE` di
   quattro app;
2. irrigidire `dataPiuGiorni` sul `null`;
3. raccogliere il predicato «rilievo elaborato con volume» di Terra
   (scritto dieci volte).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14).
