# E0: i due fogli non si caricano più insieme

**Data:** 01/08/2026 · **Area:** `shared/dw-app-ui.css`, `shared/dw-app-shell.css`,
sette pagine
**Unità precedente:** `20260801-124500_quarantanove-dichiarati-e-il-numero-che-deve-scendere.md`

## Che cosa è stato fatto

Eseguito il piano misurato due unità fa: `.item:active` e `.kpi.accent` spostati
in `dw-app-ui.css`, e **tolto il `<link>` a `dw-app-shell.css`** dalle sette
pagine che caricavano entrambi (le sei app, `admin.html`, più il collaudo
grafici). `dw-app-shell.css` resta il foglio di **`profilo.html`**, l'unica
pagina che lo caricava da solo.

Da adesso **nessuna pagina carica i due fogli insieme**, quindi la classe di
difetti a cui apparteneva la barra dell'amministrazione non può più presentarsi.

## ⛔ E il censimento dei doppioni aveva un buco, trovato dalla misura

Tolto shell, le sei app sono diventate **lunghissime**: Flotta da 1.755 a
**19.344 px** di altezza, Campo da 1.494 a **12.346**, Scudo da 2.060 a 16.082.
Tutte le sezioni disegnate una sotto l'altra.

La causa: `.page` è definita in **tutt'e due** i fogli — quindi il mio
censimento la contava fra i 49 doppioni — ma le due definizioni **non portano
le stesse dichiarazioni**:

```
shell:  .page { display: none; padding: 16px }
ui:     .page { padding: 16px 16px calc(24px + env(safe-area-inset-bottom)) }
```

Il `display:none` che nasconde le sezioni non attive **stava solo in shell**.
Finché i due fogli si caricavano insieme non si vedeva: shell nascondeva, ui
riapriva quella attiva.

⚠️ **La lezione è sul mio stesso strumento**: la regola dei doppioni confronta
i **nomi dei selettori**, non le **dichiarazioni**. «38 su 43 ridefiniti» non
vuol dire «38 su 43 sostituiti», e per un attimo l'ho creduto. È il limite di
quella misura, e adesso è scritto nel foglio accanto alla riga che mancava.

## Come si è visto, e come NON si sarebbe visto

Gli scatti prima/dopo delle sette pagine differivano del **2,4–3,1%** dei pixel.
La prima spiegazione che mi è venuta — «sono le animazioni» — era comoda e
sbagliata: il **controllo** (due scatti della *stessa* versione) dà
**0,00–0,45%**. Quindi qualcosa era cambiato davvero, e andava trovato.

Ritagliata la fascia che differiva (la barra in basso), la differenza era la
dimensione di icone ed etichette. Misurata:

| | etichetta della barra |
|---|---|
| core (`.bn span`) | **9px / 700** |
| app **dopo** la modifica | **9px / 700** |
| shell (`.nav button`) | 11px, e `.nav .ico{font-size:18px}` |

Cioè shell portava una regola che **il core non ha** — un residuo di quando le
icone erano un font — e toglierla ha avvicinato le app al riferimento, non
allontanate. Con `display:none` rimesso al suo posto, le sette pagine tornano
**identiche** nei numeri: stessa altezza, stesso `.top`, stesso `.item`, stesso
`.kpi`.

⛔ **E il «da riga X a riga Y» mi aveva mentito.** Rifatto il confronto dopo il
ripristino, lo scarto risultava sparso *«righe 181–894»* su quasi tutte le
pagine — cioè quasi tutta l'immagine, e la spiegazione «è la barra in basso»
sembrava di comodo. Sostituito il **minimo e massimo** con le **fasce contigue
e quanti pixel ciascuna**, e la risposta è netta:

| pagina | fascia principale | quanto |
|---|---|---|
| conti | righe **814–884** | 10.289 px = **2,93%** su 3,08 |
| campo | righe **809–884** | 8.706 px = **2,48%** su 2,63 |
| terra | righe **809–881** | 9.113 px = **2,59%** su 2,75 |

Il resto è **524 px** su ognuna, sempre nella stessa fascia di sei righe — il
bordo che pulsa di `.kpi.danger` (`animation:pulseDanger`), che infatti il
**controllo** riproduce identico. Cioè: la barra in basso e nient'altro.

⚠️ La lezione è sullo strumento, non sul risultato: **il minimo e il massimo non
sono una posizione.** Una riga sola di rumore in cima e una in fondo bastano a
spalancare l'intervallo su tutta la pagina, e da lì o si accetta una spiegazione
comoda o si sospetta un difetto che non c'è. Quello che localizza è il conto
**per fascia**.

⚠️ E un errore da dichiarare: per verificare la dimensione «prima» ho rimesso
il foglio in Flotta e poi ho fatto `git checkout` — che ha annullato **anche**
la rimozione appena fatta. Riapplicata, e verificata con `grep` sul `<link>`,
non a memoria.

## ⛔ E poi il buco era più grande di così: i superstiti erano OTTO, non cinque

Il `display:none` mi ha insegnato la lezione ma non me l'ha fatta **applicare**:
ho corretto quel caso e ho lasciato in piedi lo strumento che l'aveva mancato.
Rifatta la misura come andava fatta — non sui **nomi** dei selettori ma sulle
**dichiarazioni**: per ogni proprietà scritta da shell, ui la riscrive?

Il primo lettore, a espressione regolare, leggeva **20 regole su 41**, perché
non entrava nei blocchi di `@media`. E non se ne accorgeva: rispondeva
tranquillo su un terzo del foglio. Riscritto contando la profondità delle
graffe, e adesso **stampa quante regole ha letto** — se il numero non torna si
vede, come per i «3 fogli letti».

Risultato: **2 selettori assenti e 18 proprietà non ridichiarate**, di cui altre
**due perdite vere** oltre a `.page`:

| perdita | il core dice | effetto di E0 senza correzione |
|---|---|---|
| `.item` → `cursor` | `.sitem{… cursor:pointer …}` | le righe perdono la manina |
| `.arr` → `color`, `font-size` | `.sarr{color:var(--muted); font-size:18px}` | il chevron `›` (**52 volte** nelle sei app) eredita il colore del testo e la misura di serie: **più acceso e più piccolo** |

Tutte e tre nella direzione che non si vede: nessuna rompe la pagina, nessuna
fa fallire un test, cambiano un colore e una misura. Rimesse in `dw-app-ui.css`.

📌 E una differenza col core che questa misura ha fatto emergere e che **non**
è colpa di E0: il core dà al chevron anche `padding:4px 8px`, le app no. Non
l'ho aggiunta qui perché avrebbe mescolato un **ripristino** («identico a
prima», verificabile) con un **miglioramento** («identico al core», che sposta
il disegno): insieme, negli scatti, non si distinguono. È il primo candidato
dopo il passo 3.

## La regola 23, che è la lezione resa permanente

`run-stile.mjs` guadagna la regola che confronta le **dichiarazioni** dei due
fogli condivisi (la 22 confrontava i nomi, e per questo era cieca su tutt'e
tre). Stessa forma: insieme esatto, cade nei due versi, e l'elenco
`SOLO_IN_SHELL` porta **la ragione di ognuna** delle 12 divergenze che restano
— tre categorie: morte (nelle sette pagine non esiste il markup), correzioni
(le `.nav*`, residuo della barra piatta che contaminava quella del core), e una
lasciata cadere con la ragione (`.kpi:hover` → `border-color`: il core non ha
nessun hover sulle `.kpi-card`).

⚠️ **La controprova non è servito costruirla**: la regola è stata scritta prima
della correzione, e ha segnalato **esattamente** le due perdite vere
(`.item {cursor}` · `.arr {color, font-size}`) e nient'altro. È il caso migliore
— il controllo ha trovato il difetto che esisteva davvero, invece di uno
rimesso a mano per fargli fare bella figura.

## E l'intestazione diceva 20 regole quando erano 23

Le regole 21, 22 e 23 sono nate senza entrare nell'elenco in cima al file, e la
prova che dovrebbe accorgersene **non se n'è accorta**: confronta il numero
dichiarato con le voci elencate lì sotto, cioè verifica che il commento sia
coerente **con sé stesso**, non che copra il file. Controllo che non guarda dove
crede, nella forma più economica. Elenco completato, numero corretto, e il
limite dichiarato nell'intestazione invece di essere riscoperto fra un mese.

## E quanto pesano davvero, misurate nel browser

Rimesse le due righe, sono state lette **calcolate** — 408 chevron e 433 righe
su sette pagine a 390 px. Risultato: tutte e sei le app dichiarano `.arr` per
conto proprio, e quattro ci mettono anche `font-size:15px`. Il ripristino serve
quindi a **campo** (l'unica che la misura non la scrive: sarebbe scesa in
silenzio da 18 a 16 px) e a nessun'altra. Che è esattamente il mestiere di una
riga in `shared/`: non cambia niente dove qualcuno ha già deciso, e tiene su chi
non ha deciso.

⚠️ E una cosa trovata per strada, **non di E0**, dichiarata invece che sistemata
di nascosto: `conti` e `sentinella` scrivono `.item.tap` / `.item.cliccabile`,
cioè hanno deciso che la manina la meritano solo le righe che si toccano —
decisione che **non ha mai funzionato**, perché shell metteva `cursor:pointer`
su tutte. Il ripristino conserva il comportamento di prima (E0 non deve cambiare
un pixel), quindi il difetto resta com'era, ma adesso è misurato. È un'unità a
sé, non un ritocco da infilare qui.

## Il conto dei doppioni

`.kpi.accent` è stata **tolta** da shell (`profilo.html` non ha nessun `.kpi`),
`.item:active` resta in tutt'e due ed è **dichiarata come doppione voluto**: da
oggi i due fogli servono pagine diverse e non si incontrano mai, quindi non si
possono contraddire. Elenco: **49 → 50**, e la regola ha preteso la
dichiarazione con la ragione, come doveva.

## Verifica

Tutte le suite `node`, dopo la correzione: `run-stile` **274/0** (50 doppioni
trovati e dichiarati, 3 fogli letti; **12 divergenze trovate, 12 dichiarate**;
41 regole in shell, 253 in ui), `run-kpi` 1123/0, `run-helpers` 49/0,
`run-pointcloud` 26/0, `run-manifest` 9/0, `run-demo` 8/0, `sonda-vuoto` 7/0
(7 tranquilli trovati, 7 dichiarati), `copertura-funzioni` 9 soggetti a posto,
`nomi-doppi` 26 nomi, `date-checkpoint` 3/0, `numeri-nei-documenti` 17/0 —
quest'ultimo dopo aver portato a **1.489** il totale delle prove nei tre
documenti che lo citano (era 1.488: la regola 23 ne aggiunge una).

Controprova della regola 23 **nei tre versi**, con l'iniezione misurata in
caratteri: divergenza nuova (è caduta **da sola**, sul difetto vero, prima della
correzione: `.item {cursor}` · `.arr {color, font-size}`), dichiarata che non si
presenta più (+48 car. → *«.pinco-pallino — righe da togliere»*), divergenza
cambiata (−16 car. → *«.top .sub (ora «…, text-transform», dichiarato «…»)»*).

Browser: `fuori-schermo` **28 schermate pulite, 0 fuori dallo schermo** sulle 14
superfici. Sette pagine rimisurate a 390 px: larghezza 390 e **altezze identiche
a prima** (campo 1494, conti 1681, flotta 1755, scudo 2060, sentinella 1989,
terra 1795, admin 975), stessi `.top` (61), `.item` e `.kpi`. Stili **calcolati**
sui chevron e sulle righe: 408 chevron e 433 righe su sette pagine.
`contrasto` gira nel giro completo su copia (`tutti.mjs`).

## Prossimo passo atomico

`dw-app-shell.css` adesso serve **una pagina sola**, e ne porta ancora 41
selettori: la maggior parte non la riguarda. Il passo successivo è **ridurlo a
quello che `profilo.html` usa davvero**, misurando classe per classe — e a quel
punto il conto dei doppioni scende sul serio, invece di restare a 50 per
convenzione.
