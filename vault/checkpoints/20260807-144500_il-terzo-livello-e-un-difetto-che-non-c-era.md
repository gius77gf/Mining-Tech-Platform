# Checkpoint — 2026-08-07 14:45:00 UTC

## Tipo
unit-complete (cinque unità: il tema morto del core, le strisce di stato, il
banco della barra, la ricerca su Scudo, la parte 7 estesa)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`84de2d8` — *PALETTE_APP parte 7: i livelli sono tre, e il terzo non è testo*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 151 | **il tema morto del core** (`a93f8ee`) | **137** selettori tolti, −10.965 caratteri, **50 scatti su 52** byte-identici |
| 152 | **le strisce di stato** (`f6b42ee`) | chiaro **72 → 0**, sole **57 → 0**, scuro 0 → 0; banchi 132 → **137** |
| 153 | **il banco della barra** (`27655b4`) | 164 voci a quattro larghezze, **0** tagliate — e un difetto vero trovato a 320 |
| 154 | **la ricerca su Scudo** (`a01bbcc`) | 127 righe, 34 con fonte, ~45 dichiarate `[dedotto]` |
| 155 | **la parte 7 estesa** (`84de2d8`) | il terzo livello, con la tabella e i numeri |

## ⛔ Un difetto riferito da uno scatto non c'era, e me l'ero bevuto
Il cantiere di Conti aveva riferito che le etichette della barra di Conti erano
tagliate a 430 px — «QUADR», «ATTUR» — e **l'ho riportato in due checkpoint
senza rimisurarlo**, perché veniva da uno scatto e in questa casa gli scatti
sono lo strumento di cui ci si fida. Rimisurato: **164 voci a 430/390/360/320
su sei app, ZERO tagliate**, e il banco lo spiegava già nella sua intestazione —
la colonna cresce con l'etichetta, quindi tagliare non è possibile.
⚠️ E la prima sonda ha sbagliato soggetto col segno di sempre: cercava uno
`span` e misurava l'**icona**, 20 px su 19, **identico in tutte e sei le app**.
La parola è un nodo di testo nudo: si misura con un `Range`.
✅ Ma allargando il banco per dimostrarlo è uscito un difetto **vero**:
**Sentinella a 320 px ha 328 px di contenuto in 302**, e `.nav` ha
`overflow:hidden`, quindi le ultime voci spariscono in silenzio. 320 **non** è
stato registrato nel giro (sarebbe un rosso noto, cioè un giro da non guardare):
è dichiarato nel banco col numero e con la strada già scartata — rimpicciolire
il carattere fa **salire** il minimo, da 328 a 333.

## ⛔ Il terzo livello, che nessun banco guardava
Le strisce di stato non sono testo, e tutti i banchi del contrasto misurano
testo. Censite **per effetto**: 122 dichiarazioni citano un token di stato e
**145 usano un colore letterale** — invisibili a qualunque ricerca per nome (il
conto che girava, «13 regole», era per nome).
Quattro strade provate e scartate con la misura, fra cui la più insidiosa: nella
scansione dei fogli, `if (r.cssRules)` è **vuoto ma non falso** da quando
Chromium fa il CSS annidato → **24 regole viste su 512** e il banco stampava
«0 superfici di stato». Preso guardando il **denominatore**, non il verdetto.

## ⛔ E `numeri-nei-documenti` accusava un documento per colpa di un commento
Il conto del «contagio» rileggeva il foglio **crudo** mentre sedici righe più su
esisteva già l'estrazione **pulita**: la stessa cosa scritta due volte, la
seconda più debole. I commenti di `dw-app-ui.css` nominano le classi di cui
parlano, quindi la prosa finiva contata come selettore — 21 → 24 aggiungendo un
commento. Il numero vero è **21**; il documento diceva 22, cioè era già gonfiato.
Terza volta di questa famiglia.

## Stato delle prove
Prove **2.251**, copertura 677/677, banchi **137**, giro `node` **23 comandi,
0 caduti** verificato sulla copia a ogni commit.

## Che cosa sta girando adesso
**Due cantieri**: la geometria del gradiente in `contrasto.mjs` (quattro accuse
false su trentadue) e la barra di Sentinella a 320 px.

## Prossimo passo atomico
1. **Raccogliere i due cantieri.** ⚠️ Quello del righello **cambierà i numeri**
   delle due passate nuove del giro (3.694 e 3.696): vanno riverificati prima di
   fidarsi.
2. ⛔ **Le 19 decisioni**: è venerdì 07/08. Si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit. «Entro venerdì» vuol dire
   la fine del venerdì.
3. Poi: i quattro commit «che mordono» ancora da confrontare coi loro documenti
   (Sentinella `csvRicettori`/`contaCoperture`, Scudo `etichettaScadenza`), e le
   tre proposte della ricerca su Scudo — che vanno **rimisurate** prima di
   diventare unità, perché il 01/08 due «non c'è» su tre erano falsi.

## Code aperte, dichiarate
- **Sentinella a 320 px** (sopra), con la strada già scartata.
- **91 regole di stato** che la dimostrazione non fa mai comparire, fra cui
  `.dw-input.err` — il bordo del campo sbagliato, che è uno dei casi che la
  1.4.11 nomina per nome.
- **Riga 3334 del core**: mostra ancora «Outdoor mode — disattivato», l'unico
  punto in cui il tema che non esiste più **si vede**. Unità a sé.
- **15 selettori `body:not(.outdoor-mode)`** lasciati nel core con la ragione:
  non sono morti, e semplificarli abbassa la specificità.
- `--info` a 2,16-2,22 in tutte e sei.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
