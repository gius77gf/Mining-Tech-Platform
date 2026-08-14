# Checkpoint — 2026-08-08T04:54:36Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`40640da` — *giro-sicurezza: un comando solo per la barriera fra aziende
concorrenti*

## Che cosa è stato completato

L'unità prima aveva **scoperto** che le suite dell'emulatore girano in questo
contenitore e che nessuno le lanciava. Una scoperta scritta in un checkpoint
però è una cosa che si dimentica: adesso è un **comando**.

    node apps/deepwork-id/tests/giro-sicurezza.mjs

Alza l'emulatore da sé e prova **95 casi**: **68** sulle regole di sicurezza —
la barriera multi-tenant, il muro fra aziende **concorrenti**, che è il
requisito fondante di tutto il prodotto — **19** sull'SDK, **8** sul primo
avvio. Tre giri su tre, 0 falliti.

## ⛔ Dichiara quello che non ha guardato, e prima del riepilogo

`run-fns.mjs` (21 prove) vuole l'emulatore delle **funzioni**, che qui non
parte perché chiede la rete e la politica del contenitore la nega. La riga sta
**sopra** il totale, non in fondo: è la regola di casa — *un giro che salta
qualcosa in silenzio è peggio di un giro che non c'è*, perché chi legge «tutto
verde» crede di aver guardato tutto. È lo stesso difetto dello «0 su 68» delle
modali, che nessuno leggeva da mesi.

## ⛔ E se gli attrezzi non ci sono si ferma dicendolo

Uscita **2**, non «0 caduti». Un giro che non trova `firebase` o `java` e
stampa zero caduti è il verde più falso che ci sia — la stessa famiglia
dell'iniezione che non inietta e dello `sed` che non trova.

## Le due controprove che contano

Provate su una copia staccata, perché una prova che non sa fallire non
dimostra niente:
1. una suite che **non esiste** → «non ho trovato la riga di riepilogo, la
   suite non ha girato», **0 su 1, uscita 1**;
2. una suite che **gira e fallisce** → ✗ con il conto vero, **0 su 1, uscita
   1**.

⚠️ E il conto si legge dalla **riga di riepilogo della suite**, non
dall'uscita del processo: un processo può uscire 0 anche senza aver provato
niente. È la ragione per cui la controprova (1) è quella che serviva di più.

⚠️ **Non va in `npm test`**, e lo dichiara col marcatore che `suite-collegate`
pretende: `npm test` è già quello che la CI lancia **dentro** l'emulatore, e
metterlo lì vorrebbe dire un emulatore dentro un emulatore.

## Prove

- `giro-sicurezza`: **3 su 3, 95 prove**, uscita 0.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**; `suite-collegate` passa da **105 a 106** file guardati — cioè ha
  visto il file nuovo e ne ha accettato la dichiarazione.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. **1.175
righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`): si
  rilancia e si legge, non si ricopia. Un'unità per app, un file per commit.

## Blocchi
Nessuno.
