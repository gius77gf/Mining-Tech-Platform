# Checkpoint — 2026-08-08T00:18:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`c26971b` — *Scudo: la data di consegna dei DPI che non si può leggere non è «—»*

## Che cosa è stato completato

Verificato il rimandato **⏱️ Scudo · verbale DPI**, proposto da un cantiere e
per regola non entrato sulla sua parola. **È vero.**

Sul **verbale di consegna dei DPI** — il foglio che il lavoratore **firma**, e
che è la prova della consegna ex art. 77 D.Lgs 81/2008 — la colonna
«Consegnato il» scriveva **«—»** per una data assente, vuota o **impossibile**.
Su un foglio stampato «—» si legge «non serve», e qui la data è **il fatto che
quel foglio esiste per provare**.

La colonna **accanto** era stata corretta il 03/08 per questa identica ragione.
Misurate affiancate sugli stessi dati — il metodo che questa casa usa per i
documenti che escono:

| caso | «Consegnato il» | «Sostituire entro» |
|---|---|---|
| data assente (`null`) | **—** | 12/01/2031 |
| data vuota | **—** | 12/01/2031 |
| data impossibile (`2026-02-30`) | **—** | 12/01/2031 |
| senza scadenza | 12/01/2026 | **non indicata** ← già giusta |

**La correzione segue la regola già scritta** nel commento della colonna
vicina: *«la colonna legge lo stato della riga, non ri-decide»*.
`statoConsegnaDpi` guadagna la bandiera **`leggibile`** — nome preso dal
vocabolario della **regola 20** di `run-stile`, così il controllo la governa
davvero (`consegnaLeggibile` sarebbe stato invisibile al suo `\bleggibile\b`) —
e la leggono **tre** stampe: il verbale, il registro DPI e la cartella del
lavoratore.

⚠️ **Raggiungibilità dichiarata invece che gonfiata.** Il form pretende la data
(`if (!lavoratoreId || !tipo || !dataConsegna)`) e un **import dei DPI non
esiste**: oggi il caso arriva solo da dati vecchi o scritti a mano — **latente,
non impossibile**, esattamente come `rilievoUsabile` in Terra. Scritto nel
commento della funzione, non taciuto per far sembrare il difetto più grosso.

## Misurato dove il programma legge, non dove l'ho scritto

Iniettata una consegna **senza data** nella **risposta HTTP** del proprio
server (mai sul file: il giro del browser sta girando su un'altra porta),
premuto il bottone, neutralizzata `window.print`, e letto il foglio **riga per
riga**:

    Facciale filtrante / respiratore | III | FFP3   | unica | 15/06/2026
    Scarpe antinfortunistiche        | II  | —      | 43    | 12/01/2026
    …
    Elmetto                          | II  | —      | unica | non indicata   ← l'iniettata

Le sei righe sane tengono la loro data; solo quella senza data lo dichiara.
Anche il **registro DPI** (la lista) lo dice, con la stessa bandiera.

## Prove

`run-kpi` **1889 → 1890**; i tre documenti sorvegliati da
`numeri-nei-documenti` riallineati (**2.306 → 2.307**), più la roadmap, che
quel controllo non guarda.
**Controprova**: rimessa la guardia debole `!!consegna.dataConsegna` — quella
che guarda **com'è scritto** il dato invece di **che cosa vale** — la prova
cade. Ripristino da copia con `diff -q` e `grep -c`.
Giro `node`: **23 comandi, 0 caduti**, sulla copia di quello che si committava.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823, 5.685 righe) **e rilanciarlo sul commit corrente** — quello
in corso parte da un `HEAD` di oltre trenta commit fa, quindi il suo verde non
riguarda quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto.

Poi, i rimandati aperti:

- ⏱️ **La stessa domanda sui RIFERIMENTI, non solo sulle chiamate.** Oggi
  `nomi-liberi` guarda `nome(`; un `const x = pippo` con `pippo` inesistente
  non lo vede — dichiarato nell'intestazione dalla prima stesura e mai
  misurato. Prima di scriverlo: **contare gli allarmi su una copia**, perché lì
  il rumore atteso è molto più alto che sulle chiamate.
- ⏱️ **Le altre due stampe di Scudo e i fogli delle altre app**: la domanda
  «dove questa app compone qualcosa che ESCE, chi decide i suoi numeri?» ha
  dato due difetti veri in due ore (Terra e Scudo). Vale la pena rifarla a
  tappeto sui fogli **stampati**, non solo sui CSV — il censimento statico lì
  dà zero, si vede solo premendo il bottone e leggendo il foglio.

## Blocchi
Nessuno.
