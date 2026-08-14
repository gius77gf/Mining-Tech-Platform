# Checkpoint — Scudo, cinque documenti su cinque: niente da correggere

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Censimento dei cinque punti d'uscita di Scudo con la domanda di `CLAUDE.md`
— *chi decide i numeri di ciò che ESCE?* — e la risposta è: il modulo, tutte e
cinque le volte.**

| documento | chi decide |
|---|---|
| `scudo_registro_infortuni.csv` | `csvRegistroInfortuni(INF)` — funzione del modulo |
| `scudo_personale_scadenze.csv` | `csvPersonaleScadenze(LAV, SCA, DOC)` — modulo |
| `scudo_azioni_copia.csv` | copia di backup, stesse colonne dell'import |
| `scudo_azioni_correttive.csv` | composto in pagina, **ma la decisione è del modulo**: la colonna `semaforo` è `statoAzione(a)`, non un ternario riscritto |
| `scudo_riepilogo_near_miss.csv` | composto in pagina, ed è **il documento più curato dell'ecosistema** |

⚠️ **Perché quest'ultimo merita di essere citato**, e non per fare un
complimento: è il modello di come si scrive un documento che riassume. Non
lascia intendere niente —
- le righe «potenziale» non escono mai da sole: prima esce **quanti near-miss
  sono valutati su quanti**, perché *un conteggio per gradino senza il
  denominatore, aperto in un foglio di calcolo, diventa una media*;
- porta la frase del modulo (`descriviRischioPotenziale`) che dice **se quei
  numeri si possono leggere**;
- e i **luoghi ciechi** — quelli con episodi ma nessuna valutazione — non
  restano fuori dalla classifica per luogo, dove *in fondo a un elenco ordinato
  si leggerebbero come i più tranquilli*: escono con la loro riga e la loro
  parola, «non si sa come poteva finire».
È il principio del fondatore applicato alla lettera, in un file.

## Perché questa riga esiste
Un risultato negativo **misurato** vale quanto un difetto: senza questa riga il
prossimo ciclo rifà lo stesso giro per scoprire la stessa cosa. Denominatore
dichiarato: **cinque su cinque**, guardando per ogni documento *chi decide* ogni
colonna che non sia un valore letto e basta.
⚠️ E l'ampiezza va detta: questo è un censimento **strutturale** (chi chiama
chi), non l'apertura dei file nel browser come è stato fatto per Flotta e
Conti. Su cinque app il censimento statico su questa stessa domanda aveva dato
**zero** mentre i difetti c'erano. Qui però la struttura è netta — due CSV
interamente nel modulo, uno che delega la sola decisione che conta, uno che è
una copia dell'import — e i due casi in cui il difetto si nasconde (una parola
di stato scritta fissa, un `|| 0` su un numero) sono stati cercati per nome e
non ci sono. **Se un giorno servisse la certezza, va aperto col browser.**

## Stato roadmap
Domanda *«chi decide i numeri di ciò che ESCE?»*, giro completo:
- **core 2/2** → 1 difetto, corretto
- **Flotta 9/9** → 4 difetti, corretti e blindati (banco nuovo)
- **Conti 3/12** → 3 difetti, corretti e blindati (banco nuovo)
- **Campo 6/6, Sentinella 5/5, Terra 3/3, Scudo 5/5** → puliti, misurati
- **Genesi 9** → resta
**Otto difetti veri**, tutti della stessa famiglia.

## Prossimo passo atomico
**Genesi, i nove punti d'uscita** — è l'ultima app del giro e la più a rischio,
perché `CLAUDE.md` ci ha già trovato la forma peggiore di questa famiglia: il
file di scambio `.volata.json` che portava lo **scatter simulato** al posto del
ritardo nominale (42,332516881726825 ms dove il pannello diceva 42), tanto che
riletto da Genesi stessa il progetto tornava a 25 ms. Quel difetto è chiuso, ma
il segno da cercare è lo stesso in tutti gli altri otto: **un numero con quindici
decimali dove lo schermo ne mostra zero** — non è precisione, è un campione
scappato dal suo recinto.
Struttura, già censita: `Volata_<n>_<data>.volata.json`, `genesi_scheda_volata`,
`genesi_confronto_AB`, `genesi_riconciliazione`, `genesi_composito_<pezzo>`,
`genesi_legge_di_sito`, uno col nome in variabile, `genesi_piano_carico` e
`genesi_piano_innesco.xml`.
⚠️ Portarsi dietro le lezioni dei due banchi scritti oggi: ancora d'iniezione
**corta** (una riga sola, il vecchio comportamento rimesso ombreggiando la
variabile); il **terzo testimone** quando si confronta file↔schermo, se no due
copie deboli si danno ragione a vicenda; e `URL.revokeObjectURL` reso inerte,
se l'export revoca il blob subito dopo il click.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è vivo da oltre due ore e mezza sulla sua copia.
