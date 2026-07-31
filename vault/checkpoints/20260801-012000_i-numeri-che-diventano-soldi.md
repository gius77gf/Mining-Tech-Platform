# Checkpoint — i numeri che diventano soldi non li guardava nessuno

- **Tipo**: unità (13 prove nuove + una prova corretta perché non sapeva fallire)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `bbe8e52` (le prove), `48def1f` (la prova che non discriminava)

## Come è saltato fuori

Cercavo lavoro sicuro mentre il browser è occupato dal giro a 19 banchi. Ho
censito le funzioni **esportate** dai sei moduli dati e le ho cercate una per
una in **tutte** le suite. I nomi delle export sono token esatti: qui una sonda
testuale regge, al contrario di quelle sulle frasi che ieri hanno sbagliato tre
volte.

Risultato: **208 export su 338 non compaiono in nessuna prova.** Il numero da
solo è un **limite superiore**, non un conteggio — alcune sono provate
altrove, altre sono banali. Ma fra quelle mai nominate c'era:

> **`importiFattura`** — la funzione che decide imponibile, IVA e totale di una
> fattura.

E con lei `convertiQuantita` (tonnellate ↔ metri cubi con la densità),
`canonePeriodo` (quello che si deve **all'ente** per il materiale cavato) e i
prezzi per unità. Non è un buco di stile: è la parte che finisce su un documento
fiscale e su una dichiarazione a un ente, dove un errore non fa rumore — produce
un numero **plausibile e sbagliato**.

## Le 13 prove, e cosa difendono

- la fattura vecchia col solo `importo` vale come imponibile a IVA zero: è la
  **compatibilità dell'archivio**, e romperla cambierebbe di significato righe
  già emesse;
- l'aliquota e il totale **scritti** vincono su quelli calcolati: sono dati del
  documento, non stime;
- imponibile zero non produce `NaN` né un'aliquota inventata;
- la conversione senza densità utile risponde **`null`, non zero** — zero
  sarebbe una misura, e sbagliata;
- nel canone, le pesate senza densità non contano come zero metri cubi e
  vengono **contate**, così chi guarda sa che manca un dato.

## La parte che vale più delle prove

Ho rimesso **due difetti veri** nel modulo per vedere se le prove servissero.
**Uno dei due non è stato trovato.**

La prova «l'aliquota scritta vince su quella calcolata» usava imponibile 1000 /
IVA 100 / aliquota 10 — ma lì il calcolo dà **anch'esso 10**, quindi passava
identica con e senza la riga che difende. Avevo perfino scritto, due righe
sopra, un commento che avvertiva di quel rischio. E ci sono cascato lo stesso.

Adesso i numeri sono scelti per **discriminare** (scritta 10, calcolata 22), e
la prova è stata verificata nei due versi: col difetto fallisce dicendo «atteso
10, ottenuto 22», col codice giusto passa.

È la stessa lezione di ieri applicata a se stessa: **una prova che non sa
fallire non dimostra niente**, e il modo per saperlo non è rileggerla — è
rimetterci il difetto.

## Stato

- **446** prove KPI (erano 433), 177 stile, 43 helper, 23 pointcloud, 9
  manifest, 7 demo → **705** prove `node`, tutte verdi
- giro a 19 banchi del browser: in corso

## Prossimo passo atomico

Continuare il giro sulle funzioni scoperte, per **priorità di danno**: dopo i
soldi vengono i numeri che vanno all'ente e quelli su cui si decide una
manutenzione — `sogliaEfficace` e `reportConformita` di Sentinella,
`puntoDiRiordino` e `consumoPerMezzo` di Flotta, `vitaCava` e
`autorizzazioneVigente` di Terra. Stessa regola: ogni prova nuova va vista
fallire con il difetto rimesso, prima di dichiararla buona.

## Bloccanti

- Nessuno.
