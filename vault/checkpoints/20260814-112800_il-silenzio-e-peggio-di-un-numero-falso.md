# Checkpoint — 2026-08-14 11:28 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `4acdcfe0` — ricerca(campo): il rapporto di fine turno nel MONDO, senza delta
- `07848e15` — shared: nella finestra di caricamento un comando premuto non faceva NIENTE

## Che cosa è stato completato

**Il silenzio è peggio di un numero falso.** B6 aveva curato i **contatori**
(«—» invece di «0»); restavano i **comandi**. Nella finestra fra l'apertura
della pagina e l'arrivo del modulo dati la barra in basso funziona, quindi si
gira per tutte le sezioni — ma le azioni sono agganciate con
`addEventListener` **dentro il modulo**. Misura sulla prima schermata di tre
app: **18 comandi su 21 premuti senza niente** — nessun toast, nessuna modale,
nessun errore, il DOM identico. Adesso una guardia in cattura in
`shared/dw-app-ui.js` risponde «I dati stanno ancora arrivando», e **si
disarma da sola** nel punto che tutte e sei le app chiamano già
(`dwUiAggancia`, che gira solo quando gli import del modulo sono risolti):
zero righe nelle sei pagine.

**Il banco ha due domande nuove e cade nei due versi**: 55 comandi premuti
dentro la finestra, 0 muti; e dopo i dati nessuno dice più «sto caricando».
Con la guardia neutralizzata cadono **le due domande su tutte e tre le app**.

**La ricerca è la prima con la regola del 14/08**: solo la metà sul MONDO, e in
fondo **dieci domande** invece di un elenco di mancanze. Il reperto migliore è
il *Time Usage Model* del GMG; il pezzo che vale per questa settimana è
l'inganno dei **denominatori**, documentato alla lettera — 7 ore lavorate su un
turno di 8 fanno **87,5% di availability e 29% di uptime**. Limite dichiarato:
`WebFetch` è bloccato, quindi nessun testo primario letto e la tassonomia GMG
resta alle categorie di primo livello.

## ⛔ La lezione pagata mentre lo facevo
**La worktree congela il PRODOTTO, non i BANCHI.** Il runner serve una copia
immobile ma lancia i banchi dalla **cartella viva**: la domanda nuova è stata
fatta al prodotto di un'ora prima e il registro del quarto giro porta **tre KO
su una difesa che sul disco era verde**. Non è un difetto del disegno —
l'impronta esclude apposta test e documenti — ma la regola «non si inietta
mentre gira un giro» vale anche per le **migliorie ai banchi**.

## Il quarto giro mirato, letto
Finito in **1h17**, 48 passate: **45 sane, 0 KO veri** una volta tolti i tre
artefatti qui sopra. Nessuna riga «non ho guardato».

## Le misure
`run-kpi` **2312**, prove **2.787**, giro `node` **36 comandi a posto, 0
caduti**, **3.161** asserzioni, copertura app 755/755.

## Prossimo passo atomico
Portare la terza e la quarta domanda della finestra sulle **altre tre app**
(Flotta, Conti, Terra): la guardia è in `shared/` e quindi le protegge già, ma
il banco misura solo Campo, Scudo e Sentinella — e un soggetto non misurato non
è un soggetto a posto. Serve verificare che l'elenco `APPS` del banco e i suoi
`DIFETTI` reggano su tre pagine che non li hanno mai visti.

## Blocchi
- **Force-with-lease sul ramo**, **B0-septies**, le **soglie di sicurezza** e
  **`dRecFreq` intero all'ingresso**: fermi al fondatore.
