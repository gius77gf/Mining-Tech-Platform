# Checkpoint — 2026-08-09T07:18:20Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1608476` (questa unità committata subito dopo)

## Task completato

**L'ultimo KO di Campo, chiuso — e con lui la terza forma della stessa
famiglia in una giornata: un banco che non sa distinguere una SCENA NON
ARRIVATA da un prodotto che mente.**

Il caso «disponibilità che non torna» cadeva **una volta su cinque**, sullo
stesso commit, senza che nulla cambiasse.

| misura | esito |
|---|---|
| caso isolato, 10 ripetizioni | **10 su 10** |
| banco intero, 3 giri | **3 su 3** |
| il giro storto | la pagina non aveva ancora le attività della demo |
| dopo | `stati-non-misurati` **83 prove, 83 passate** |

## Le tre cose imparate

1. ⛔ **UN'ACCUSA INTERMITTENTE È PEGGIO DI UN'ACCUSA STABILE**, perché quando
   si presenta è **indistinguibile** da un difetto vero — e il giro del browser
   gira una volta ogni molte ore, quindi la si incontra da sola, senza le
   quattro volte in cui è passata. È la ragione per cui questo KO è costato due
   riverifiche credendolo prodotto.
2. ⛔ **IL SEGNO CHE L'HA TRADITO È UN NUMERO CHE NESSUNO GUARDA: 82 PROVE
   INVECE DI 83.** Un caso che cade ne dichiara **una** invece di due (salta la
   riga «si vede sullo schermo»). È la regola «un banco che crolla dichiara
   meno prove» nella sua versione mite: non un crollo, un caso solo — e il
   totale scende di uno, che si legge come «ha guardato un po' meno roba».
   Senza quel confronto avrei aperto un cantiere sul prodotto per la **terza
   volta oggi**.
3. ⛔ **LA CURA È LA REGOLA DI CASA APPLICATA A UNA SCENA INVECE CHE A
   UN'INIEZIONE**: *un'iniezione si verifica dove il programma la legge, non
   dove l'hai scritta.* Qui il programma legge i **minuti di fermo del turno**,
   e la scena si verifica leggendo che ci siano. Il caso adesso dichiara una
   **precondizione** (`pronta: /\d+ min di fermo/i`), la si aspetta fino a 6 s,
   e se non arriva il banco **non accusa**: scrive `⚠️ NON MISURATO`, elenca il
   caso fra le righe «non ho guardato» **prima** dei KO col testo trovato
   davvero, e **esce 1**.
   ⚠️ Un soggetto non misurato non è un soggetto a posto: se uscisse zero, la
   difesa sarebbe peggiore del difetto — un caso saltato in silenzio invece di
   un'accusa falsa ogni tanto.

## Il prodotto, letto nel reso e non nel sorgente
Tutt'e due i rami sono giusti e dicono cose diverse a ragione:
`stato: "oltre"` → «**non calcolabile**» col motivo («i minuti di fermo (55)
superano la durata dichiarata (30)…»); `stato: "non-calcolabile"` →
«Disponibilità non calcolata» con l'elenco di ciò che manca. Il banco cercava
il primo e nel giro storto trovava il secondo.

## Verifiche
- `stati-non-misurati` **83/0** · controprova cade come deve
- precondizione provata **nei due versi** (`cp` + ripristino + `diff -q`): con
  una `pronta` che non arriva mai il banco dichiara il caso e **USCITA=1**
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Stato dei 20 KO del giro
**11 chiusi · 9 aperti**, e dei 9 rimasti **7 aspettano il fondatore** (le
tendine di Scudo e Sentinella, `#vf-ente`).
⚠️ Bilancio dei venti, e va detto perché cambia il modo di leggere il prossimo
giro: **due** erano difetti veri già chiusi da altre unità, **sei** attese
sbagliate del banco, **tre** un banco che non riusciva a montare il suo caso.
**Undici su venti non erano difetti del prodotto.** Nessuno di quegli undici si
vedeva senza riprodurre il KO con la sua passata.

## Prossimo passo atomico
**I nove punti di coerenza del raggruppamento in Genesi**: `_ricPlur(n, …)`
scrive `String(n)` e non raggruppa, quindi dove il numero potesse superare il
migliaio comparirebbe «41230» accanto a «3.000.000». I due punti raggiungibili
(i conti che arrivano da un file importato) sono già chiusi in `ab48ec2`; questi
nove sono numeri costruiti dall'interfaccia, con `D2.perRow` limitato a 3–30,
quindi **coerenza e non difetto**. La forma è quella già usata:
`gnum(n, 0) + ' ' + plurale(n, sing, plur)`.
⚠️ Ogni modifica in `apps/genesi/genesi.html` sposta le ancore delle iniezioni
di `genesi-frasi-limite`: dopo le nove si rilancia `iniezioni-fresche` (che
adesso guarda **296** iniezioni, non 215) e si ri-ancora quello che serve.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
