# Checkpoint — 30/07/2026 14:00 UTC

## Task completato
**S11 — `parseNum` del core, e i file delle macchine.** Ultimo pezzo aperto della
convenzione sui numeri: adesso è chiusa su tutte le superfici.

| Commit | Cosa |
|---|---|
| `f2daede` | `parseNum` non inventa più numeri, l'import della perforatrice dice cosa non legge |

## La misura prima di irrigidire è servita davvero
Il checkpoint di stamattina diceva «non si irrigidisce a occhio», ed elencava
cosa misurare. Fatto, e ha cambiato il lavoro: delle 145 letture di `parseNum`,
**cinque sono celle del CSV di una perforatrice**, e quei file scrivono l'energia
specifica in **notazione scientifica** («1.5e3»). La convenzione condivisa non
l'accettava: irrigidire senza guardare avrebbe rotto l'import di una perforatrice
**in silenzio**, e nessun test l'avrebbe detto.

Da qui la forma della soluzione: `numeroScritto` ha ora `scientifica`, un
interruttore **spento di serie**. In un campo scritto a mano «1.5e3» resta
rifiutato — accettarlo vorrebbe dire prendere per buono un «2e5» battuto per
sbaglio e salvare duecentomila — e lo accende solo chi legge un file di macchina.
La distinzione fra «numero scritto da una persona» e «numero scritto da una
macchina» è la stessa che regge tutta la convenzione, e ora è esplicita anche qui.

Cosa **non** cambia, perché sembra un'incoerenza e non lo è: la lettura delle
migliaia. Per un file di macchina «1.250» è 1,25 ed è **giusto**.

## Due difetti latenti trovati strada facendo
**1. L'arrotondamento condiviso poteva peggiorare il numero.**
`Math.round(n * 10^dec)` con molti decimali esce dagli interi esatti: una
coordinata UTM come 4.512.345,67 chiesta a 10 decimali diventava 4,51234567e16.
Adesso, quando il conto uscirebbe da 2^53, il numero si tiene com'è: meglio un
decimale in più del previsto che una cifra inventata.

**2. `isNaN(null)` è `false`**, perché `Number(null)` è 0. Nell'import MWD sei
guardie scritte `!isNaN(row.x)` lasciavano passare un null e avrebbero scritto
`f.x = null` dentro il foro. Non capitava **prima** perché il lettore restituiva
sempre un numero: appena un valore illeggibile è diventato null, quelle guardie
hanno cominciato a dire il contrario di quello che intendevano. È il rischio
tipico di questi giri — si cambia una cosa e le guardie scritte «per come si
comportava» smettono di guardare. Ora dicono `Number.isFinite`.

## La parte che si vede: l'import della perforatrice
Prima ogni cella numerica passava da `parseNum0`: un «n/a» diventava **zero** in
silenzio, e quel foro entrava nella volata con **profondità zero** — invisibile
nel totale dei metri perforati (dove manca solo un pezzo) e invisibile nella
lista dei fori. Adesso:
- l'**unità dentro la cella** («13.2 m», «45 s») non fa perdere il valore: si
  toglie la coda e si tiene il numero, e l'anteprima lo dichiara. Ma solo una
  coda che **sembra** un'unità — lettere, `/` o `³` — mai cifre e mai un secondo
  numero, perché di «13.2-14.5» (un **intervallo**) `parseFloat` prendeva 13,2
  scegliendo al posto dell'utente;
- ciò che resta illeggibile è **null**, e l'anteprima lo elenca riga per riga
  **prima** di importare: è lì che il file si può ancora aggiustare;
- una cella **vuota non è un errore** da segnalare — la colonna può esserci e il
  valore mancare per quel foro. Una cella piena che non si legge sì. La
  distinzione è il punto;
- una profondità illeggibile prende quella **di progetto**, non zero: un foro
  profondo zero non esiste.

## Sulle prove: due volte ho sbagliato io, e la seconda mi ha corretto il codice
La prima prova asseriva che «13,2 m» prima diventasse 0. Falso: `parseFloat`
dava **13,2** — teneva la testa e buttava la coda, e in quel caso indovinava
**giusto**. La mia versione «severa» l'avrebbe rifiutato, cioè avrebbe **perso
una misura vera** per amore di coerenza. Da lì è nata la lettura dell'unità: la
risposta giusta non era né la permissività di prima né il rifiuto, era togliere
la coda quando è un'unità e rifiutare quando è un intervallo.
La seconda volta ho aggiunto una riga al CSV di prova e non ho aggiornato gli
indici: `p.rows[2]` non era più la riga che credevo. Adesso la prova cerca per
`id`, che non slitta.

Fa **quattordici** volte che una mia prova accusa il codice sbagliando io. Ma
questa è la prima in cui l'errore della prova ha fatto trovare una soluzione
migliore di quella che avevo in mente.

## Stato
Suite: **283 KPI** (erano 270 stamattina), **52 stile**, 7 demo, 43 helper,
23 pointcloud, 9 manifest. Tutte verdi.
La convenzione sui numeri è ora chiusa su **tutte** le superfici: sei app, core,
campi scritti a mano, file delle macchine.

## Prossimo passo atomico
**I campi INTERI: 19 nel core, più quelli delle sei app.** È l'ultima cosa
dichiarata aperta sui numeri. Sono rimasti `type="number"` di proposito — lì lo
spinner serve e mezzo foro non esiste — ma questo lascia al browser **l'ultima
parola sulla virgola**: su un campo intero digitando «1,5» Chromium fa «15», e
un «numero di fori 15» invece di un errore è un piano di caricamento sbagliato.

Da decidere con una misura, non a intuito: **prima verificare col browser cosa
succede davvero** su `type="number"` senza `step` frazionario quando si digita
una virgola, in en-US e it-IT (il comportamento potrebbe non essere quello dei
decimali: lì lo `step` intero rende il valore non valido, e forse
`checkValidity()` risponde false — in quel caso basta **leggere la validità**
invece di convertire tutti i campi, che sarebbe una modifica molto più grande e
farebbe perdere lo spinner dove è utile).

Poi, in ordine: (1) se il browser dichiara invalido, aggiungere una guardia che
lo dice col toast — riusando `interoScritto` di `shared/`, che già esiste; (2) se
invece lo dichiara valido, allora la conversione è necessaria e va fatta come
per i decimali, con `inputmode="numeric"`; (3) in entrambi i casi, una regola in
`run-stile.mjs` che tenga il risultato.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece
di 44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8
esenta), e i tre punti che aspettano il fondatore — progetto Firebase (10
minuti), permessi per ruolo, blocco del turno chiuso lato server.
