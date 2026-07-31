# Checkpoint — «questo rilievo si può usare», scritto una volta

**Commit:** `fc9d281`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

Il predicato che decide se un rilievo entra nei numeri — **elaborato e con
un volume** — era scritto **dieci volte** in `terra-data.js`, in tre
varianti: liscia, con il controllo della data ISO, con quello dell'anno.

Non va in `shared/`: non serve a due app, serve **dieci volte a una**. Ma è
esattamente il modo in cui una variante si stacca dalle altre senza che
nessuno lo veda — un rilievo in bozza che cominciasse a contare in **uno
solo** dei dieci punti non darebbe nessun errore. Darebbe un **numero
diverso**, in un documento che va all'ente.

Adesso sono due funzioni, e la distinzione fra loro è quella vera:

- `rilievoUsabile` — elaborato e con un volume. È il minimo per contare;
- `rilievoUsabileConData` — in più una **data ISO vera**, per chi **ordina**
  o confronta nel tempo: senza data non si sa dove sta nella serie.

Una cosa che la prova blinda e che vale la pena aver scritto: uno **zero**
è un volume vero. Si è misurato, e faceva zero.

## Come ho dimostrato che non è cambiato niente

Una **impronta** di tutte le funzioni pure di Terra sull'archivio
dimostrativo, presa **prima** e **dopo** — comprese **34 chiamate a
tappeto** su ogni funzione esportata, così un punto che non avevo elencato
si sarebbe visto lo stesso.

I due testi sono **identici carattere per carattere**, tranne le due righe
delle funzioni nuove.

Una prova di comportamento su una funzione sola non sarebbe bastata: i
punti erano dieci, e uno solo che cambia sfugge.

## Controprova

Quattro difetti in una copia del modulo: **4 su 4**. Il più utile è il
quarto — allentando la condizione **raccolta** cade anche la prova sulla
**denuncia annuale**. È la dimostrazione che quella riga sola regge
davvero tutti e dieci i punti, e non solo quelli che ho elencato.

## Verifica sulla pagina

La pagina di Terra si apre ancora **senza errori di codice**: un import
rotto non si vede: la pagina resta com'era e basta. (Il banco filtra gli
errori di rete verso `gstatic` — qui non c'è rete — e i messaggi «404» di
console, che **non** sono risorse mancanti: controllato con un ascoltatore
sulle *risposte*, che è la misura vera, e le pagine non hanno nessuna
risorsa a 404.)

## Numeri

- Terra: **37 → 39** funzioni coperte su 40; il **fondo** del censimento
  alzato di conseguenza
- `run-kpi`: **969 → 971**; totale `node`: **1.265**
- copertura complessiva: **405 su 411**

## Prossimo passo atomico

Restano due strade, e la prima non aspetta nessuno:

1. **Le seconde iterazioni delle app** — il blocco 6 della roadmap, che è
   dove sta la qualità visiva: stati vuoti, validazioni, messaggi che
   spiegano, ordinamenti. Si lavora **in parallelo sulle sei app**, un
   cantiere per app, con lo screenshot di verifica per ogni modifica.
2. **Il Quadro**, che aspetta il fondatore (punto **15**): le sei tessere
   sono già state provate una per una e si riempiono con numeri veri.

Si parte da (1).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
