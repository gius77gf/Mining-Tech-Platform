# Checkpoint — 2026-08-08T12:14:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5d57cbc

## Che cosa è stato completato
**L'ultima riga cieca del banco del contrasto**: le 57 classi col fondo NON
coprente che venivano elencate e mai giudicate.

Il limite dichiarato era giusto — «misurarle in un contenitore inventato vuol
dire accusare un colore per il posto in cui ce l'ho messo io» — e per questo
**non si inventa un posto**: si usano le superfici che l'app **stessa** dichiara
(`--bg`, `--card`, `--card2`). Tre numeri per classe: si tiene il **peggiore**
e si stampa la **forbice**. Stessa forma già benedetta per i gradienti.

**57 su 57 composte e giudicate. Cinque sotto soglia**, tutte la stessa
famiglia — `var(--danger)` come **inchiostro** sopra una velatura rossa, troppo
scuro benché vada benissimo da **pieno**:
| dove | prima |
|---|---|
| core `.login-msg` | 4,10 |
| core `.sync-badge.offline` | 3,75 |
| core `.btn-danger` | 3,89 |
| core `.photo-del` | 4,01 (bianco su rosso al 90%: la famiglia chiusa stamattina, che qui mancava) |
| Flotta `.chk-cr` | 3,90 |
| Terra `.avatar.ico.danger` | 3,88 |
Il core guadagna **`--ink-dg`** — lo stesso nome delle sei app — come gemello
chiaro di `--ink-su-pieno`: uno per la tinta **piena**, l'altro per quella
**velata**. In Flotta e Terra `--ink-dg` smette di valere `var(--danger)`.
Verificato prima che fosse sicuro: **tutte** le occorrenze sono `color:`,
nessuna è un fondo o un bordo, quindi lì il contrasto può solo salire.

## ⚠️ Quattro KO verificati e RESPINTI
L'intestazione del banco lo impone — *«un KO di questa passata si verifica come
un OK: si va a cercare dove la classe è usata davvero, prima di toccare un
colore»* — e stavolta ha salvato **quattro colori sani**. Il campione porta la
scritta «Ag», quindi la soglia applicata è quella del testo piccolo; ma
`.avatar.ico.{ok,warn,danger}` di Terra e `.rep-esito-ico` di Sentinella nel
prodotto **non contengono testo**: sono contenitori d'icona, un `<svg>` e
basta, in Terra perfino con `aria-hidden="true"`. Per il non-testo la WCAG
1.4.11 chiede **3:1**, e stanno fra 4,08 e 4,47. Dichiarati per nome **con la
prova accanto**, e il riepilogo li nomina: se un giorno conterranno del testo,
quella riga andrà tolta.

## ⚠️ E la mia previsione era bassa
Avevo scritto «resa attesa: **1** difetto». Sono **cinque**. La stima veniva da
un prototipo che guardava **solo le sei app**, non il core né le pagine di
Deepwork ID: è la lezione del **denominatore**, applicata a una mia previsione
invece che a un banco.

## Verifica
· tre temi: **4700 + 3755 + 3757** testi, **0 sotto soglia**;
· copia di quello che si committa, confronto patch-a-patch identico: **26
  comandi, 0 caduti**.

## Stato roadmap
Terza unità del ciclo. Il banco del contrasto adesso **non ha più righe cieche**:
239 classi mai comparse → 182 fatte comparire + 57 composte = **239 su 239**.

## Prossimo passo atomico
Il giro del browser completo è **in corso** (lanciato alle ~11:10Z sulla copia di
`c3888fe`, registro in `scratchpad/nomi4/giro-nuovo.txt`). ⚠️ Attesta un commit
**precedente** a questa unità e alle due prima: i suoi eventuali KO sul contrasto
sono già chiusi qui. Quando finisce:
1. leggerlo con `leggi-giro.mjs`, **sezione 1 prima della 2**;
2. leggere la riga nuova **«le tre passate più lente»**: adesso che `vaiA` è 26
   volte più veloce, dice se il limite di 30 minuti è ancora tarato bene o va
   abbassato — un limite troppo largo è una guardia che non scatta mai;
3. poi rilanciarne uno **sul commit corrente**, che è quello che conta.

## Blocchi
Nessuno.
