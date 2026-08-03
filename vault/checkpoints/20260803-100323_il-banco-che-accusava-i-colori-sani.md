# Checkpoint — 2026-08-03 10:03:23 UTC

## Tipo
unit-complete (quattro unità: i tre cantieri raccolti + il banco del contrasto)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`85ab6cc` — *Il banco del contrasto accusava quattro colori sani del core, e
stava per farli cambiare*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 38 | **Sentinella · il report per l'ente** (`1fef8c0`) | «Conforme» su un anno **misurato per tre mesi**, e nessuna riga lo diceva |
| 39 | **Flotta · il libretto e il giro macchina** (`924721d`) | lo stesso giorno usciva **verde o rosso a seconda dell'ordine dell'elenco** |
| 40 | **Conti · i documenti stampati** (`4a389aa`) | «**IVA 19%**» su un documento fiscale: un'aliquota che in Italia non esiste |
| 41 | **il banco del contrasto** (`85ab6cc`) | accusava **quattro** colori del core che fanno 5:1 e più |

## ⛔ LA COSA DA LEGGERE PER PRIMA: IL CHECKPOINT DELLE 09:17 DAVA UN ORDINE SBAGLIATO
Diceva: «le 4 violazioni AA del core, tutte insieme, **si scurisce il minimo
indispensabile tenendo la tinta**». **Non farlo. Quei colori stanno benissimo.**
Prima di toccarne uno è stato fatto il conto a mano: bianco su `#2e7d32` fa
**5,13:1**, cioè passa — e un banco che risponde 2,36 su un colore che ne fa
5,13 sta sbagliando lui. Rimisurato sullo stesso identico `index.html` (`git
log` sul file: **zero commit in mezzo**), **tre giri di fila: 333 testi, 0 sotto
soglia**. Il giro notturno girava su una copia di un commit **precedente** a
quello che ha sistemato l'accesso al core: misurava schermate colte a metà
comparsa.
**La regola che ne esce, e vale per ogni banco: un KO va verificato come un OK.**
Le tre trappole scritte nell'intestazione di quel banco erano tutte nel verso
che **assolve** — così la famiglia opposta non era mai stata cercata, e ne sono
uscite tre in un'ora, tutte nel verso che **accusa**:
- **trappola 4**, l'opacità di un'**animazione** colta a metà (`scrFade`,
  `fadeUp`, e `pulseDanger`/`pulseSync` che scendono a `.6` **per sempre**): le
  finite ora si **aspettano**, le infinite si **dichiarano**;
- **la guardia vecchia scartava tutto**: il valore iniziale di
  `transition-property` è `all`, quindi *ogni* testo sotto 0,95 finiva fra le
  «dissolvenze», compresi quelli con `opacity` statico — cioè proprio i casi
  che il banco dichiara di misurare. Core: da 333 a **343** misurati, saltati da
  10 a **zero**;
- **trappola 5**, la trappola 1 un piano più sotto: l'unità dentro il numero
  (`<span class="n">12<span class="u">gg</span></span>`) è dipinta dal gradiente
  dell'**antenato**, e veniva **1:1** — lo stesso sintomo che il commento del
  ramo sopra racconta come già risolto, su un elemento diverso. Un `1:1` tondo
  non è un colore: è una misura che non ha trovato l'inchiostro.

E la guardia nuova **ha una prova sua**, perché sul core non si accende mai: una
guardia che non scatta non è provata. Alla prima stesura il veleno finiva fra le
dissolvenze (10 → 27) — ed è così che è saltata fuori la guardia troppo larga.

## Stato delle prove
Sulla **copia di ciò che si committa**, a ogni commit: giro `node` **20 su 20**.
Prove **2.028** senza rete (run-kpi 1632), copertura **646/646**, banchi
**75**. I tre documenti di `docs/` sono stati riallineati a ogni commit,
misurando **sulla copia**: sono numeri collettivi e li può muovere solo chi
committa.

## Che cosa sta girando adesso
- **tre cantieri**: **Terra** (i documenti che escono), **Scudo** (i CSV che
  escono — ha già un banco nuovo, `scudo-documenti.mjs`), **Campo** (il
  near-miss dal fronte, che è la mancanza riverificata come la più importante).
  Tutt'e tre scrivono in `run-kpi.mjs`, `tutti.mjs` e `copertura-funzioni.mjs`:
  si raccolgono **costruendo l'indice da `HEAD`** e tagliando la banda dell'app.
  ⚠️ Campo tocca **`shared/dw-ponti.js`**, che è serializzato: raccoglierlo per
  ultimo o controllare che nessun altro l'abbia toccato.
- La ricerca mirata sul **registro dei mancati infortuni** è rientrata e ha
  scritto in `docs/RICERCA_CONTINUA_SCUDO.md`. ⚠️ **Non verificata da me**: le
  sue tre proposte (ora di segnalazione distinta dalla data evento, urgenza,
  scadenza della comunicazione INAIL) vanno rimisurate prima di diventare
  unità — è la regola «niente entra sulla parola dell'agente».

## Prossimo passo atomico
1. **I due KO veri di Conti**, guardati nello scatto e non ancora corretti:
   «Salva preventivo» a **2,9:1** (testo quasi nero su verde acqua: nello
   scatto si legge male davvero) e la cifra del cartellone di cassa a
   **2,17:1**. ⚠️ **Prima**: stabilire *quale* stato del cartellone lo produce —
   il testo del KO è «1,3», e `--grad-num` (`#7fe0d1→#3fbcab`) porta scritto
   «cifre: 6,47:1», mentre `--grad3` (`#f05f5a→#a32b27`) e `--grad-sup` non
   hanno nessun conto accanto. Si scurisce il **fondo** o si schiarisce la
   **fermata bassa** del gradiente, non si cambia la tinta.
2. Raccogliere i tre cantieri, app per app, con la solita procedura.
3. **Rilanciare il giro completo del browser** su una copia del committato: è
   il primo giro dopo le tre correzioni al banco del contrasto, e va guardato
   se altre superfici perdono i loro «saltati» e mostrano KO nuovi (il banco
   adesso misura ~10 testi in più per superficie).
4. Poi: le tre proposte della ricerca, rimisurate una per una.

## Code aperte, dichiarate
Immutate. Le **19 decisioni** del fondatore procedono **venerdì 07/08** se non
arriva risposta, e vanno dichiarate nel commit.

## Blocchi
Nessuno.
