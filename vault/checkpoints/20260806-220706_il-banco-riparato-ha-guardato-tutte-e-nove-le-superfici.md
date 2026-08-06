# Checkpoint — 2026-08-06 22:07:06 UTC

## Tipo
unit-complete (sei unità dopo il checkpoint delle 21:14: i tre cantieri del
disegno raccolti, i documenti riallineati due volte, le modali su nove
superfici, il singolare in `shared/`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`18725f1` — *Il singolare sale in shared/, e il numero che lo giustifica è 359
— poi la funzione ha sbagliato tre volte prima di funzionare*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 81 | **CLAUDE.md, sette lezioni** (`9fa261e`) | due delle sette sono errori miei di oggi |
| 82 | **i tre cantieri: Flotta, Scudo, Campo** (`4743c69`) | prove **2.175**, banchi **104** |
| 83 | **Sentinella, le modali** (`4743c69`) | maiuscolo: **10 KO → 2** |
| 84 | **i quattro documenti riallineati** (`e686e84`) | arretrato **4 → 0** |
| 85 | **il singolare in `shared/`** (`18725f1`) | **359** ternari scritti a mano |

## ⛔ Il banco delle modali, riparato stamattina, ha guardato TUTTE E NOVE le superfici

Prima di oggi apriva **zero** modali sul core e non era mai stato puntato sulle
altre. Riparato (l'impronta letta prima del contrassegno), il censimento
completo:

| superficie | aperte / nel programma | esito |
|---|---|---|
| core | 11 / 68 | **2 difetti** — le due uscite fuori schermo a 320 px |
| sentinella | 10 / 13 | **5 difetti** (unità in maiuscolo) + 1 dichiarato |
| conti | 12 / 22 | pulita |
| terra | 6 / 11 | pulita |
| flotta | 6 / 14 | pulita |
| campo | 5 / 19 | pulita |
| scudo | 2 / 34 | pulita |
| genesi | 1 / 2 | pulita |
| vetrina, id·accesso, id·profilo | 0 / 0 | **non raggiunte**, e il banco lo dichiara |

⚠️ E il limite si legge nella colonna: su **Scudo apre 2 modali su 34**. «Pulita»
lì vuol dire «pulita su due», non su trentaquattro — il banco lo stampa, e chi
legge deve leggerlo.

## ⛔ Il filo: *la stessa cosa, scritta trecentocinquantanove volte*

Il banco ha trovato in Scudo «restano **1 voci** su 25» — nella stessa testata
dove le altre due frasi il singolare ce l'avevano. Contando: **351** ternari del
singolare scritti a mano nelle sei app, **8** nel core, **zero** in `shared/`.
Da lì `plurale` e `conta`, e il core che ne adotta i dieci punti in cui il conto
vale uno più spesso che altrove (un rapportino, una foto, un giorno).

## ⛔ E LA FUNZIONE HA SBAGLIATO TRE VOLTE PRIMA DI FUNZIONARE — vale più della funzione
Tutt'e tre prese in scratchpad in pochi secondi, tutt'e tre scritte accanto a lei:
1. **confronto stretto** `n === 1` «di proposito»: `conta("1", …)` — un numero
   arrivato da una cella di CSV — rispondeva **«1 rapportini»**, cioè *il difetto
   che la funzione esiste per togliere, prodotto dalla funzione stessa*. Il
   ragionamento («una stringa non è un conto») era vero e non bastava;
2. `String(n)` su un valore che non si sa: **«null rapportini»** a schermo;
3. `Number.isFinite(Number(n))` per intercettarlo: e su `null` usciva **ancora**
   «null rapportini», perché **`Number(null)` fa ZERO**, che è finito. È la
   trappola già scritta in CLAUDE.md, presa in pieno **mentre scrivevo il
   commento che diceva che lì non c'entrava**.

**Le trappole già censite non si evitano ricordandole: si evitano provando la
funzione sui valori che le innescano.**

## ⚠️ Due errori di procedura, corretti prima di committare
- Un `git add -A` ha messo nell'indice i file dei **tre cantieri in volo**.
  Tolti, e `run-kpi.mjs` — che oggi tocchiamo in quattro — rimesso costruendolo
  da `HEAD` più la **sola** mia banda (`hash-object` + `update-index`), senza
  toccare il disco. È la procedura di CLAUDE.md, e serviva proprio adesso.
- Avevo portato la copertura da 658 a **660** contando le due funzioni nuove:
  sbagliato, quel numero conta le funzioni **delle sei app**, non i moduli
  condivisi. L'ha detto `numeri-nei-documenti.mjs` — terza volta oggi che quel
  controllo prende un numero che avevo scritto a mente.

## Stato delle prove
Prove `node` **2.180** (run-kpi **1777**, stile **291**), copertura **658/658**
+ i condivisi (dw-shell **43**), banchi del browser **104**. Giro `node` 21
comandi, 0 caduti sulla copia di ciò che si committa, a ogni commit. Arretrato
dei documenti del delta: **0** al momento del commit `e686e84`.

## Che cosa sta girando adesso
**Tre cantieri** sul filo nuovo — **il testo che mente** — su **Conti**,
**Terra** e **Genesi**: censire ogni frase costruita coi dati e provarla nei
casi limite (1, 0, «non lo so»), le unità che non devono andare in maiuscolo, e
il taglio che non deve portarsi via la parte che distingue.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri** con la procedura di stasera: indice da `HEAD`
   per `run-kpi.mjs` e `tutti.mjs`, che si toccano in più mani, e numeri dei
   documenti **rimisurati sulla copia**, mai a memoria.
2. **I 349 ternari del singolare** che restano nelle app: non si traducono in
   una notte, e i tre cantieri stanno guardando esattamente lì. Quando si fa, si
   fa con `conta`/`plurale`, non a mano.
3. **Le decisioni**: le 19 scadono **venerdì 07/08**. Se non arriva risposta si
   procede con la colonna «la mia risposta», dichiarandolo nel commit; restano
   ferme le 6 che richiedono il fondatore.
4. **La ricerca continua su Campo** è scritta (`docs/RICERCA_CONTINUA_CAMPO.md`,
   il rapporto di fine turno con le fonti). ⚠️ Ne ho verificato io la mancanza
   principale — gli orari **effettivi** di inizio/fine turno non ci sono, 0
   occorrenze su otto termini, mentre gli orari per persona esistono (62). Resta
   ricerca: niente entra in roadmap sulla sua parola.

## Code aperte, dichiarate
- Su **Scudo** il banco delle modali apre 2 su 34: «pulita» è vero su due.
- La tendina `#ppv-scelta` di Sentinella taglia un'opzione (290 px in 214 a
  320 px): **dichiarata e non corretta**, perché la coda che si perde compare
  subito sotto per disegno (`#ppv-info` scrive il nome del punto), e accorciare
  il nome vorrebbe dire cambiare i dati per far tacere un banco.
- Il **7,5%** del motore dei grafici e il **minimo di visibilità** che appiattisce
  i valori piccoli fra loro: misurati, dichiarati, non corretti.

## Blocchi
Nessuno.
