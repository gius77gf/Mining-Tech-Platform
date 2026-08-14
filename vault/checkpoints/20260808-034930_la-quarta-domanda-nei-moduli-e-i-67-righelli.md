# Checkpoint — 2026-08-08T03:49:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`bad3fc4` — *nomi-liberi: la quarta domanda anche nei MODULI, e i 67 allarmi
erano tutti righello*

## Che cosa è stato completato

Chiuso il buco che il checkpoint precedente aveva **dichiarato invece di
tacere**: la quarta forma valeva per le pagine e non per i moduli, e nessun
altro controllo copriva quel caso.

`nomi-liberi`: **19 → 22 prove**. Nei moduli questa forma morde più che nelle
pagine — un nome libero non fa rumore all'import, esplode quando quella riga
viene eseguita, cioè magari in un ramo che le prove non toccano.

## ⛔ 67 → 0, e nessuno dei quattro scalini era il prodotto

1. **I parametri dei metodi abbreviati.** `nomiLegati` legava il **nome** del
   metodo e non i suoi argomenti, perché un metodo non ha la parola
   `function`: `_entitlementAttivo(ent, tier = null)` dava `ent` ×5 e `tier`
   ×5. **Undici allarmi nel solo SDK**, e non si vedevano perché le prime tre
   domande un parametro non lo incontrano — non si chiama e non sta in un
   `${…}`.
2. **Le ri-esportazioni.** `export { A, B } from "…"` non dichiara e non usa:
   **inoltra**, e chi risolve quei nomi è il modulo dall'altra parte. Sei in
   Campo.
3. **`globalThis` e `self`** mancanti fra i globali — e `self` è il globale di
   un **service worker**, dove `window` non esiste. Cinque in `genesi-sw.js`.
4. **Il valore di default che tronca l'elenco dei parametri.** Con `[^)]*` la
   cattura finiva sulla parentesi di `new Date()` e **tutto quello che veniva
   dopo restava libero**: `preavvisoGiorni` ×10 in Flotta, `semestre` ×4 in
   Conti, `orizzonte` ×6. **Otto dei nove ultimi.**

## ⚠️ Il costo della stretta, misurato e dichiarato

Allargare `nomiLegati` rende **tutte e quattro** le domande più cieche, quindi
il conto va fatto e scritto, non arrotondato: entrano **24 nomi su 10.711**
già legati, in 4 file. Diciannove sono **parametri veri**; tre sono cifre
(`3`, `7`, `12`) che non si possono giudicare comunque; `null` è già una
parola chiave. Resta **UNA sola cecità vera**, e sta scritta accanto al
codice: **`getFullYear`**, che arriva dallo spezzare
`new Date().getFullYear()`. Un nome contro diciannove falsi allarmi in meno.

## ⚠️ Due inciampi che valgono più della correzione

1. **La suite non finiva più.** La prima stesura del riconoscitore dei metodi
   ricopiava il prefisso della riga sopra — `\s*(?:static\s+)?(?:async\s+)?\*?
   \s*` — cioè due `\s*` separati da gruppi opzionali che a loro volta mangiano
   spazi: un numero enorme di modi di spezzare la stessa indentazione, provati
   **tutti** a ogni fallimento della coda. Nessun errore, nessun messaggio:
   solo un processo che non torna. Con `[ \t]` gli a capo non entrano
   nell'ambiguità e il conto torna lineare.
2. **Il primo soggetto della controprova era sbagliato.** Avevo scelto
   `SOGLIA_TURNI` credendola dichiarata in `terra-data.js`: **non lo è**, sta
   in un elenco di **ri-esportazione**. L'iniezione non sostituiva niente e la
   prova sarebbe passata **per il motivo sbagliato** — a fermarla è stata la
   riga «l'iniezione non ha sostituito niente», che è lì apposta ed è la stessa
   difesa scritta in CLAUDE.md. Soggetto vero: **`LOTTI_APERTI`**, dichiarata
   (`const`, nemmeno esportata) e riferita **nuda quattro volte** nello stesso
   modulo.

## Manutenzione, e non era oziosa

Tolte **191 `git worktree` morte**, **3 GB** liberati (14G → 11G). Il motivo
per cui vale la pena scriverlo: una di quelle — `giro-copia-7002`, su un
commit **vecchio** — era la cartella che un `python3 -m http.server`
**sopravvissuto al riavvio del contenitore** stava ancora servendo sulla porta
8823 da **7 ore e 52 minuti**. Il giro nuovo si è fermato da sé («gli ho
chiesto il mio contrassegno e mi ha risposto niente») invece di attestare un
commit che non era quello: la difesa scritta in CLAUDE.md ha funzionato alla
lettera, e senza di lei avrei letto per due ore i numeri di un altro.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.
- `nomi-liberi`: **22 prove, 0 fallite** — e il totale **doveva** salire (19 →
  22), che è il controllo che distingue un file di prove vivo da uno inerte.
- `run-stile`: 297 su 297.
- Le quattro controprove che portano dentro un **difetto vero** restano rosse
  quando devono: è quella la prova che l'allargamento di `nomiLegati` non ha
  spento niente.

## In volo

⏳ Il **giro del browser** sulla porta **8823**, uscita in
`scratchpad/io-core/giro-7.txt`, su una **copia di `958018d`** (pid 28054,
contrassegno riletto). A questo checkpoint è a **725 righe**, dentro la fase
del contrasto. Verificato **dopo** aver cancellato le 191 worktree che la sua
non era fra quelle: risponde ancora 200 e avanza.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`),
nell'ordine che non si negozia:
1. le righe **«non ho guardato»** — denominatori, superfici non raggiunte,
   «0 su N». Già viste passando: il banco del contrasto dichiara che su
   Genesi **69 classi che dipingono un fondo non sono mai comparse** (22
   misurate, 47 solo elencate), e cifre simili sulle altre. È la regola del
   **denominatore**: un conteggio basso di violazioni va diviso per i soggetti
   che il banco ha **potuto vedere**;
2. **poi** i KO, togliendo le **controprove** — l'intestazione le dichiara da
   sé («⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO»);
3. se esce con **2** si è dichiarato **non valido** da sé e va rifatto.

Poi:
- ⏱️ **`SOGLIA_TURNI` è importata da `apps/terra/index.html` e non usata da
  nessuna parte** nella pagina (trovata due volte, cercando i soggetti delle
  due controprove). Non rompe niente — un import inutile è inerte — ma la
  domanda che vale è un'altra e non l'ha mai fatta nessuno: **quanti nomi
  vengono importati e mai usati?** È la quinta domanda, vicina di casa delle
  quattro, e questa volta il costo non è un errore duro ma il fatto che un
  import inutile **mente sul legame fra due file**.

## Blocchi
Nessuno.
