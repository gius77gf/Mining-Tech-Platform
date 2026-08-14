# Checkpoint — 2026-08-08T06:45:33Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
d5692f6

## Che cosa è stato completato
**Sette unità di misura nude sotto una classe maiuscola, e la regola statica che
le prende.** Nato dall'ultimo KO aperto del giro del browser
(«unità in maiuscolo — terra»), che era vero; censendo per non correggerne uno
solo sono usciti gli altri sei, **tutti nel core** e **tutti invisibili al banco**.

### La causa, che è di metodo
`tests/browser/unita-maiuscole.mjs` scarta gli elementi senza area
(`if (r.width < 1 || r.height < 1) return`). Il filtro è **giusto** — un
maiuscolo che nessuno vede non è un difetto — e proprio per questo non si
aggiusta: rende il banco cieco su tutto ciò che compare **dopo**. Il riquadro
Kuz-Ram del core è `display:none` finché non si calcola, e dentro c'era
«X50 (cm)» → **«X50 (CM)»**. Il banco dichiarava il core pulito da sempre.
La cura è **rifare la stessa domanda nell'altra sintassi**: staticamente, sul
sorgente. Le due non si sostituiscono — il renderizzato prende l'incontro fra
classe e contenuto, il sorgente prende ciò che non è ancora comparso.

### I sette, corretti avvolgendo l'unità in `<span class="u">`
| dove | prima | perché è un difetto |
|---|---|---|
| core, modale mezzo (×2) | `<label class="fl">Km</label>` | «KM»: K = kelvin, M = mega. Ora «Contachilometri (km)», la forma che il core usa già |
| core, frammentazione | `X50 (cm)` | «CM», e dietro un `display:none` |
| core, grafico | `Produzione mc · ultimi 6 mesi` | «MC» |
| core, riepilogo volata (×3) | `<b>123</b>m`, `kg`, `mc` | «M», «KG», «MC» |
| Terra, lotti | `Volume rimesso per il recupero (m³)` | «M³» — l'unico che il banco vedeva |

`.chart-title .u` e `.ec-stat .u` aggiunte all'eccezione del core, che non le
copriva. **Misurato** che l'impaginazione non cambia: `.ec-stat` è un flex con
`gap:4px` e il testo nudo era **già** una scatola anonima, cioè già un elemento
di flex — stacco **4px prima e 4px dopo**; l'unità finisce 5px prima solo perché
«mc» minuscolo è più stretto di «MC».

### La regola (run-stile, regola 2: 310 → 314)
Prima guardava **solo** il motore dei grafici. Ora legge dal foglio di ogni
pagina quali classi mette in maiuscolo (derivate, non scritte a mano) e cerca
un'unità nuda nel **testo proprio** degli elementi che le portano.
· denominatore stampato: **986 elementi, 102 classi, 15 superfici**;
· tre eccezioni dichiarate per nome (`H` altezza, `DB` database, `H/B`
  rigidità) con la guardia che pretende **si presentino ancora**;
· controprova che rimette il difetto **vero** (X50) **in memoria**, mai sul file,
  e pretende anche il verso opposto: col file sano non deve accusare.

### Il righello ha sbagliato tre volte prima di reggere
Le tre correzioni stanno **nel codice**, non solo qui:
1. chiudeva l'elemento sul **primo** tag omonimo → `<span class="vita-pct">…<span
   class="u">m³</span></span>` perdeva la protezione: **accusa falsa** su Terra;
2. non sapeva che `<input>` è un elemento **vuoto** → l'annidamento non tornava
   giù e la lettura correva oltre `</label>`, dentro un commento HTML e dentro
   codice: **due falsi allarmi** in Sentinella;
3. il **commento CSS entra nel selettore che lo segue** → `.fl` di Terra non
   risultava nemmeno maiuscola, cioè il controllo era cieco proprio sull'unico
   caso che il banco aveva già trovato.
Costo misurato **prima** di adottarla: 10 allarmi, 7 veri e 3 simboli.

## Verifica
· giro `node` sulla **copia di quello che si committa** (worktree + patch dello
  staged + `git add -A`, confronto patch-a-patch: identiche): **23 comandi, 0
  caduti**;
· totale del giro completo **2.594** asserzioni, **misurato** sommando le righe
  «Risultato», non per aritmetica;
· misura sul **renderizzato** in Chromium: 1148 nodi di testo sotto una regola
  maiuscola, **0** con un'unità corrotta (erano 2 visibili + 5 nascoste);
· `numeri-nei-documenti` è caduto due volte facendo il suo mestiere: documenti
  aggiornati 2.320 → **2.324** (1890 + **314** + 71 + 32 + 9 + 8), e il totale
  del giro 2.589 → 2.594.

## Stato roadmap
Unità chiusa. Resta aperto: raccogliere `giro-7.txt` (PID 28054, ~3h50m) con
`leggi-giro.mjs`, **leggendo per prime le 49 righe «non ho guardato»**.

## Prossimo passo atomico
Quando il PID 28054 finisce, lanciare
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` e leggere la
**sezione 1** prima della 2. Due righe già note da guardare per prime:
«su Genesi 120 classi con un fondo proprio non sono mai comparse: 13 fatte
comparire e misurate» e «NON MISURATE: conti — copiano negli appunti ma non
hanno una riga in COME». ⚠️ Il giro attesta il commit **precedente** a d5692f6:
i sette difetti corretti qui dentro non ci sono ancora, quindi il KO
«unità in maiuscolo — terra» **comparirà ancora** e non va riaperto.
Unità successiva già istruita: togliere i **59 import inerti** (misura della
quinta domanda di `nomi-liberi`) — tocca le pagine, una app per unità, un file
per commit.

## Blocchi
Nessuno.
