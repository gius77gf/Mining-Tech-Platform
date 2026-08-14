# Checkpoint — 2026-08-08T10:36:35Z

## Tipo
nota

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8855b6e

## ⛔ CHI LEGGE IL REGISTRO DEL GIRO DI OGGI LEGGA PRIMA QUESTA PAGINA
Il giro del browser lanciato stamattina (PID 28054) ha girato **oltre sette ore
e mezza** e attesta il commit **eca2c21**, cioè quello che c'era **prima** di
tutte le nove unità di oggi. Il suo registro sta in
`scratchpad/io-core/giro-7.txt` (circa 500 KB, 125 passate).
Senza questa nota, chi lo apre trova **quattro KO** e apre un cantiere su
difetti che non esistono più. È lo stesso danno già pagato il 07/08 con i
ventidue KO di Scudo: *un registro senza la sua storia accusa il prodotto di
cose che ha fatto il tempo.*

**I quattro KO sono TUTTI chiusi:**
| KO nel registro | che cos'era |
|---|---|
| `unità in maiuscolo — terra: «Volume rimesso per il recupero (m³)»` | difetto **vero**, corretto in `d5692f6` insieme ad altri sei che il banco non poteva vedere |
| `il foglio di fine turno di Campo: il file si chiama consegna_turno.txt` ×2 | difetto **del banco**, già corretto prima |
| `i documenti che escono dal core: lo SCHERMO dice il totale e la sua riserva` | difetto **del banco** (un numero atteso invecchiato), già corretto prima |

**E le 49 righe «non ho guardato» sono state lavorate tutte:**
· le ~45 righe di `contrasto` («234 classi mai comparse: 41 misurate») → adesso
  **182 su 239**, e sotto ci stavano **sei** difetti veri nel core più le tre
  pastiglie d'esito di Scudo (`bdb7e05`);
· «NON MISURATE: conti — copiano negli appunti ma non hanno una riga in COME»
  → il sollecito di pagamento e l'estratto conto uscivano **senza dichiarare**
  di essere una dimostrazione (`3177317`).

## Che cosa fare col registro
Leggerlo **solo** per confronto storico, con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>`. Per lo stato
vero serve un **giro nuovo** sul commit corrente: le nove unità di oggi toccano
il core, Scudo, Campo, Conti, Sentinella, Flotta, Terra, Genesi e
`shared/dw-app-ui.css`.

## Prossimo passo atomico
1. lanciare un giro del browser **nuovo** e leggerlo con `leggi-giro.mjs`,
   sezione 1 prima della 2;
2. poi il cantiere già misurato: le **57 classi «non giudicabili fuori dal loro
   posto»** del banco del contrasto — comporle su `--bg`, `--card`, `--card2`,
   tenere il **caso peggiore**, stampare la **forbice**. Resa attesa misurata:
   17 classi misurabili su sei app, **1 sola** sotto soglia
   (`terra .avatar.ico.danger`, 3,88 · forbice 1,02). Vale poco, e va aperto
   sapendolo.

## Blocchi
Nessuno. Albero pulito, tutto pushato.
