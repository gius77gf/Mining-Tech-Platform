# Le sei palette delle app Deepwork

**A cosa serve questo documento.** Il 27/07 il fondatore ha dato una
direttiva precisa: la **struttura** estetica delle app resta quella del
core Deepwork (ombre, riquadri, misure, tipografia: `index.html` alla
radice, tutto descritto in `docs/SPECIFICA_ESTETICA_CORE.md`), ma i
**colori** no — «quelli sono di Deepwork». Ogni app deve avere una
palette propria e un proprio carattere, con il colore **fuso in tutto il
contesto** (sfondi, aloni, bordi, grafici, stati) e non spruzzato come
accento su un tema altrui.

Il giudizio di partenza era: «un'accozzaglia di colori che non porta da
nessuna parte». Qui dentro c'è la risposta: sei palette complete,
calcolate, verificate, pronte da incollare.

**Come leggerlo.** La Parte 1 spiega in parole semplici le regole che
abbiamo seguito e perché. La Parte 2 è l'impianto comune (uguale per
tutte). La Parte 3 sono le sei palette, una sezione per app, ognuna con
il suo blocco `:root` copiabile. La Parte 4 è la verifica che le sei si
distinguano davvero. La Parte 5 dice come usarle senza rovinarle.

> **Questo documento non contiene codice di produzione.** Nessun file di
> stile è stato modificato. L'applicazione avviene nelle unità di lavoro
> del task C1.

---

## PARTE 1 — Le otto regole che abbiamo seguito

Sono il risultato della ricerca fatta su teoria del colore per interfacce
scure, scale percettive OKLCH, accessibilità WCAG e palette di software
industriali. Ognuna spiega *perché*, non solo *cosa*.

### 1. Su fondo scuro i colori troppo carichi "bruciano"

Un colore molto saturo su fondo scuro sembra vibrare, sbava sui bordi e
stanca gli occhi (l'effetto si chiama *halation*). È anche il motivo per
cui certe interfacce sembrano amatoriali. La regola condivisa è
**abbassare la saturazione del 20-30%** rispetto al colore "da
volantino". Tutte le nostre tinte stanno in una fascia di croma
moderata (0,11–0,15 in OKLCH), mai al massimo che lo schermo permette.

### 2. Il colore deve permeare le superfici, non stare solo sopra

È il punto centrale della direttiva del fondatore. Nei sistemi moderni
(Material 3 lo chiama *tonal elevation*) ogni superficie — sfondo
pagina, scheda, scheda sollevata — non è grigia: è una versione molto
poco colorata della **tinta dell'app**. Chi guarda non "vede il viola",
ma sente che tutta la pagina è viola. Nelle nostre palette le sette
superfici (`--bg`, `--dark`, `--panel`, `--card`, `--card2`, `--border`,
`--border2`) sono **tutte velate della tinta dell'app**, con una croma
che cresce insieme alla luminosità (da 0,013 sullo sfondo a 0,044 sul
bordo evidenziato): esattamente lo stesso impianto del core, che è
velato d'oro.

### 3. Si ragiona in OKLCH, non in "più chiaro / più scuro" a occhio

OKLCH è uno spazio colore **percettivo**: la sua L (luminosità) segue
davvero l'occhio umano. `oklch(0.63 ...)` sembra luminoso allo stesso
modo che sia blu, verde o arancio — cosa che con HSL non succede (un
giallo HSL al 50% è molto più luminoso di un blu HSL al 50%). Per questo
tutte e sei le app hanno le **stesse luminosità** nei ruoli
corrispondenti: l'accento base è sempre a L 0,63, l'accento chiaro
sempre a L 0,775, gli stati sempre a L 0,67–0,80. Risultato: le sei app
hanno **peso visivo identico** — è quello che le fa sembrare parte di un
unico prodotto invece che sei giocattoli diversi.

*(Nel documento accanto a ogni hex trovi l'equivalente OKLCH. Il CSS
resta in esadecimale, che funziona ovunque; l'OKLCH serve a capire come
sono stati costruiti i valori e a rigenerarli in futuro.)*

### 4. Il contrasto si calcola, non si stima

Regole WCAG livello AA:

| Cosa | Rapporto minimo |
|---|---|
| testo normale | **4,5 : 1** |
| testo grande (18pt, o 14pt grassetto) | 3 : 1 |
| bordi di campi, icone, elementi grafici | **3 : 1** |
| elementi disattivati | *esenti* (ma li teniamo comunque ≥ 3:1) |

Tutti i rapporti in questo documento sono **calcolati** con la formula
ufficiale WCAG 2 sui valori esadecimali definitivi, su **tutti e tre** i
fondi su cui il colore può capitare (`--bg`, `--card`, `--card2`). Non
c'è nessun valore "stimato". E nessun testo si ferma al minimo: il testo
attenuato più critico sta a **4,99:1** e tutto il resto ha margine
ampio.

### 5. Il colore da solo non basta mai

Circa un uomo su dodici non distingue bene rosso e verde. Nessuna
informazione dell'app deve dipendere **solo** dal colore: serve sempre
anche un'icona, un'etichetta, una forma, una posizione. Questa regola è
già rispettata dal core (i badge hanno il testo dentro, le schede hanno
la striscia laterale) e va mantenuta. È anche la ragione per cui abbiamo
scelto tinte che si differenziano **anche per luminosità**, non solo per
tonalità.

### 6. I colori di stato non devono mai coincidere con il colore dell'app

È la regola più violata oggi. Se l'app è verde e "successo" è verde,
l'utente non sa più se il verde vuol dire *è tutto a posto* o
semplicemente *sei dentro Terra*. Per questo:

- in **Terra** (verde) il successo diventa **verde-acqua** (46° di
  distanza dall'accento);
- in **Conti** (teal) il successo si sposta verso il **verde erba** (45°);
- in **Campo** (cotto) l'attenzione diventa **giallo puro** invece che
  ambra (60°) e l'errore si sposta verso il rosso-ciliegia;
- in **Sentinella** (blu) il colore "informazione" **è** il colore
  dell'app, e lo dichiariamo apertamente: fingere che siano due blu
  diversi confonderebbe e basta.

Come riferimento: nel core Deepwork l'accento (ambra, tinta 74°) e
`--warn` (70°) distano **4 gradi**. Nessuna delle sei nuove palette
scende sotto i **20 gradi**, e cinque su sei stanno sopra i 44.

### 7. Professionale vuol dire trattenuto, non spento

Le palette dei gestionali che trasmettono affidabilità hanno tre cose in
comune: una base neutra scura ben ancorata, **un solo** colore dominante
e accenti usati con parsimonia (la proporzione classica è 60% superfici
/ 30% colore di appoggio e testi / 10% accento vero e proprio). Ciò che
sembra amatoriale è il contrario: colori accesi senza una base che li
regga, e tante tinte in concorrenza. Qui ogni app ha **un dominante + un
appoggio**, e nient'altro.

### 8. Il colore di appoggio serve a dare carattere

Un secondo colore, scelto in armonia (analogo = vicino sulla ruota,
complementare = opposto), fa due lavori: dà la seconda serie nei
grafici, e soprattutto **dice che tipo di prodotto è**. Il magenta di
Flotta da solo sembrerebbe un'app di moda; il magenta **con l'acciaio
ardesia** sembra un'app di mezzi pesanti. È lo stesso trucco per cui il
teal di Conti sposato all'**ottone** diventa "contabilità" e non
"benessere".

---

## PARTE 2 — L'impianto comune a tutte e sei

Tutte le palette sono costruite con lo **stesso stampo**. Cambia solo la
tinta (e il colore di appoggio). Questo è ciò che tiene insieme
l'ecosistema mentre le app restano riconoscibili.

### 2.1 La scala delle superfici

Le sette superfici hanno **esattamente le stesse luminosità e le stesse
crome del core Deepwork**. È letteralmente la stessa scala, ruotata su
un'altra tinta:

| Token | L (OKLCH) | Croma | A cosa serve |
|---|---|---|---|
| `--bg` | 0,161 | 0,014 | sfondo generale della pagina |
| `--dark` | 0,176 | 0,015 | superfici "sotto" (intestazioni tabella) |
| `--panel` | 0,193 | 0,020 | pannelli, modali, barre |
| `--card` | 0,229 | 0,026 | fondo delle schede |
| `--card2` | 0,256 | 0,032 | fondo schiarito (parte alta dei gradienti) |
| `--border` | 0,289 | 0,038 | bordo standard 1px |
| `--border2` | 0,325 | 0,044 | bordo evidenziato, scrollbar |

La croma cresce con la luminosità: è quello che dà la sensazione di
**profondità colorata** invece che di grigio dipinto. Sullo sfondo il
colore è quasi impercettibile; sui bordi si vede.

In più ogni palette ha `--border-hi`, un bordo **ad alto contrasto**
(≥ 3:1 su `--card`) da usare sui **campi di testo, select e controlli**,
che per WCAG 1.4.11 devono essere percepibili. `--border` e `--border2`
restano quello che sono nel core — separatori decorativi a basso
contrasto — e non vanno usati per delimitare un controllo.

### 2.2 La rampa dell'accento (4 gradini)

| Gradino | Token | L | Croma | A cosa serve |
|---|---|---|---|---|
| **scuro** | `--app-accent-deep` | 0,470 | 0,130 | fondi pieni, tappa scura dei gradienti, avatar |
| **base** | `--app-accent` | 0,630 | 0,152 | **solo grafica**: bordi, strisce laterali, pallini, riempimenti, barre dei grafici |
| **chiaro** | `--app-accent2` | 0,775 | 0,115 | **l'unico ammesso per il testo**: numeri KPI, voce di menu attiva, link |
| **tenue** | `--app-accent-soft` | 0,885 | 0,050 | testi su fondi pieni d'accento, stati vuoti, sfondi tenui |

> **Regola dei due accenti (confermata e rafforzata).**
> `--app-accent` non si usa mai per il testo: gli basta 3:1 e lo supera
> ovunque (i valori reali vanno da 4,19 a 5,07). `--app-accent2` è
> l'unico ammesso per il testo, e sta fra **7,39 e 8,06** sul fondo
> scheda: molto oltre il minimo.
> Questo corregge anche il difetto noto di `shared/deepwork-style.css:124`
> (`.dw-btn.secondary{color:var(--app-accent)}`, presente 65 volte nelle
> app): va cambiato in `var(--app-accent2)`.

### 2.3 Gli aloni d'ambiente

Il core ha due gradienti radiali su `body::before`, quasi invisibili
(4%). Li teniamo identici come geometria, cambiando i colori: il primo
alone è **l'accento dell'app**, il secondo è **il colore di appoggio**.
Due tinte in dissolvenza invece di una sola: è ciò che rende l'ambiente
"abitato" invece che tinto in tinta unita.

```css
body::before{
  position:fixed; inset:0; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 700px 500px at 15% 5%,  var(--halo-1) 0%, transparent 65%),
    radial-gradient(ellipse 500px 400px at 85% 85%, var(--halo-2) 0%, transparent 65%);
}
```

`--halo-1` = accento base al **5%**, `--halo-2` = appoggio chiaro al
**4,5%**. Restano spenti in modalità sole e su telefono/tablet, come nel
core.

### 2.4 Il testo

| Token | L | A cosa serve |
|---|---|---|
| `--text` | 0,933 | testo principale (è un bianco **velato della tinta dell'app**, mai bianco puro: il bianco puro su fondo scuro abbaglia) |
| `--muted2` | 0,760 | testo secondario leggibile, titoli di sezione |
| `--muted` | 0,660 | etichette, sottotitoli |
| `--disabled` | 0,545 | elementi disattivati (esenti da WCAG, li teniamo ≥3:1) |

### 2.5 Il gradiente dei bottoni

Il core ha `--grad: linear-gradient(135deg,#ffab00,#ff6d00)` con
etichetta quasi nera. Stessa logica per tutte: due tappe scelte in modo
che **l'etichetta scura (`--grad-on`, cioè lo `--bg` della app) passi AA
su entrambe le tappe** — 7,2:1 sulla tappa chiara e 5,0:1 su quella
scura. Non c'è un solo punto del bottone dove il testo scenda sotto
soglia.

### 2.6 Ombre, aloni, anelli di fuoco

| Token | Costruzione |
|---|---|
| `--shadow-app` | `0 10px 30px` di un colore molto scuro della tinta dell'app al 42% — l'equivalente di `--shadow-amber` |
| `--glow-app` | accento base al 30% — alone delle icone e delle voci di lista |
| `--tint-app` | accento base al 14% — fondo dei chip-icona |
| `--focus-ring` | accento **chiaro** al 30% — l'anello `:focus-visible` (usiamo il chiaro perché deve vedersi anche sul bottone pieno) |
| `--sel` | accento base al 30% — `::selection` |

---

## PARTE 3 — Le sei palette

Per ogni app: il carattere, la tinta scelta e perché, la rampa, il
colore di appoggio, le superfici, i testi con i contrasti calcolati, gli
stati, e il blocco `:root` completo da incollare.

---

### 3.1 SCUDO — sicurezza e personale

> **Carattere: solida e vigile.** Istituzionale, seria, un po' severa —
> il colore di chi tiene i registri che l'ispettore verrà a leggere.

**Tinta scelta: viola-indaco, OKLCH 292°** (`#8c75dc`).
*Confermata, con un ritocco.* Era `#8b5cf6`, un viola molto carico
(croma 0,219 — il più acceso di tutte le app, quello che su fondo scuro
"vibra" di più). L'abbiamo portato alla croma di sistema 0,152 e alla
luminosità di sistema: stesso colore riconoscibile, ma calmo.

**Perché il viola resta la scelta giusta**, anche se la ricerca dice che
il blu è il colore classico della sicurezza: il blu è già di Sentinella,
e soprattutto **il viola è l'unica tinta che non è un colore di stato**.
Scudo è l'app che mostra in continuazione badge rossi, gialli e verdi
(scadenze, infortuni, formazione): un accento che non litiga con nessuno
di quei tre è un vantaggio pratico, non estetico. Il viola dista 93° dal
rosso d'errore, 140° dal giallo d'attenzione, 147° dal verde di successo.

**Colore di appoggio: indaco `#4467a9` / `#86a5de` (262°).** È
*analogo* — 30° dal viola — quindi non crea tensione: i due colori
sembrano parenti. E porta la nota "blu istituzionale" che il viola da
solo non ha, riportando l'app nel territorio della fiducia e della
competenza. Serve per la seconda serie nei grafici e per l'alone
d'ambiente in basso a destra.

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#5e499d` | `oklch(0.470 0.131 292.1)` | 2,04 (solo fondi pieni) |
| base | `#8c75dc` | `oklch(0.630 0.151 291.7)` | **4,30** ✅ (min. 3) |
| chiaro | `#b7a8f9` | `oklch(0.774 0.115 292.0)` | **7,54** ✅ (min. 4,5) |
| tenue | `#d9d4f8` | `oklch(0.885 0.049 291.7)` | 11,12 ✅ |

**Superfici** (tutte velate di viola)

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#0d0c13` | `oklch(0.159 0.015 291.2)` |
| `--dark` | `#111017` | `oklch(0.178 0.014 291.4)` |
| `--panel` | `#14131d` | `oklch(0.193 0.020 288.9)` |
| `--card` | `#1d1b28` | `oklch(0.231 0.025 291.4)` |
| `--card2` | `#232032` | `oklch(0.256 0.034 291.5)` |
| `--border` | `#2b283c` | `oklch(0.289 0.036 290.8)` |
| `--border2` | `#343049` | `oklch(0.325 0.044 291.1)` |
| `--border-hi` | `#686481` | 3,01 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(140,117,220,.05)` in alto a sinistra,
`rgba(134,165,222,.045)` in basso a destra.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#e9e7f4` | 15,94 | 13,88 | 12,99 | ✅ AAA |
| `--muted2` | `#b1adca` | 8,99 | 7,82 | 7,33 | ✅ AAA |
| `--muted` | `#928ead` | 6,20 | 5,40 | 5,06 | ✅ AA |
| `--disabled` | `#706d82` | 3,89 | 3,39 | 3,17 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#6abb6e` | 145° | 147° | 6,76 ✅ |
| attenzione | `#f8ac3d` | 72° | 140° | 8,28 ✅ |
| errore | `#f05f5a` | 25° | 93° | 4,90 ✅ |
| informazione | `#34aede` | 229° | 63° | 6,23 ✅ |

L'informazione è spostata verso il **ciano** (229° invece dei 247° del
core): con un accento viola, un blu-informazione classico sarebbe
sembrato una seconda tinta dell'app.

```css
:root{
  /* ============ SCUDO — sicurezza e personale (tinta 292°) ============ */
  --app-h: 292;
  --app-accent-deep: #5e499d;
  --app-accent:      #8c75dc;   /* SOLO grafica: bordi, strisce, pallini  */
  --app-accent2:     #b7a8f9;   /* UNICO ammesso per il testo             */
  --app-accent-soft: #d9d4f8;
  --app-support:     #4467a9;
  --app-support2:    #86a5de;

  --bg:#0d0c13; --dark:#111017; --panel:#14131d;
  --card:#1d1b28; --card2:#232032;
  --border:#2b283c; --border2:#343049; --border-hi:#686481;

  --text:#e9e7f4; --muted2:#b1adca; --muted:#928ead; --disabled:#706d82;

  --success:#6abb6e; --warn:#f8ac3d; --danger:#f05f5a; --info:#34aede;

  --grad: linear-gradient(135deg,#a68cff,#8a6fe0);
  --grad-on: #0d0c13;
  --gradSuc: linear-gradient(135deg,#6abb6e,#2f7a33);
  --grad3:   linear-gradient(135deg,#f05f5a,#a32b27);

  --shadow-app: 0 10px 30px rgba(49,31,93,.42);
  --glow-app:   rgba(140,117,220,.30);
  --tint-app:   rgba(140,117,220,.14);
  --focus-ring: rgba(183,168,249,.30);
  --sel:        rgba(140,117,220,.30);
  --halo-1:     rgba(140,117,220,.05);
  --halo-2:     rgba(134,165,222,.045);
}
```

---

### 3.2 CAMPO — operatività di giornata

> **Carattere: operativa e calda.** Il cantiere di mattina, la squadra,
> il turno che comincia. Terrosa, concreta, senza fronzoli.

**Tinta scelta: cotto / terracotta, OKLCH 40°** (`#d3633a`).
*Confermata come famiglia (arancio), spostata come sfumatura.*

**Questo è il caso più delicato di tutta l'operazione, e va spiegato
bene.** L'arancio è la zona più affollata del sistema: ci vivono
l'ambra del core (74°), la tappa arancio del suo gradiente (46°), il
giallo d'attenzione (70°) e il rosso d'errore (25°). Un Campo arancio
generico non è "un'app arancione": è **il core Deepwork con un altro
nome**. Ed è esattamente una delle ragioni per cui oggi le app sembrano
un'accozzaglia.

La soluzione non è togliere l'arancio a Campo (il fondatore lo vuole, e
per un'app di turni e squadre è la scelta giusta), ma **cambiare la
famiglia dell'arancio**: dall'oro/ambra del core al **cotto**, cioè un
arancio più rosso, più terroso e meno luminoso. Confronto diretto:

| | Tinta | Croma | Luminosità | Come si legge |
|---|---|---|---|---|
| core Deepwork | 74° | 0,170 | 0,803 | oro acceso |
| **Campo** | **40°** | **0,152** | **0,630** | **cotto, mattone** |

E soprattutto sono diverse le **superfici**: quelle del core sono
bruno-dorate, quelle di Campo sono bruno-rosse. Aperte una accanto
all'altra non si confondono.

**Gli stati di Campo sono ricalibrati**, ed è l'unica app dove serviva:
- **attenzione → giallo puro `#d4bf3e` (100°)**, non ambra: 60° di
  distanza dall'accento;
- **errore → rosso-ciliegia `#ef5d66` (20°)**, spostato verso il freddo.

Restano 20° fra accento ed errore: è la distanza più stretta di tutto il
documento e la dichiariamo apertamente. La differenza si regge su
**luminosità e croma** (l'accento chiaro è a L 0,775, l'errore a L
0,670) e sulla regola 5: in Campo il badge d'errore porta **sempre**
icona e pulsazione, mai il solo colore. Per confronto, nel core la
distanza fra accento e attenzione è di 4°.

**Colore di appoggio: blu petrolio `#00787d` / `#56b6bb` (200°).** È il
*complementare freddo* del cotto. È l'abbinamento più collaudato dei
software industriali (la coppia caldo-terroso + freddo-tecnico) e ha una
funzione precisa: raffredda un'app che altrimenti sarebbe tutta calda e
le impedisce di sembrare un allarme perenne. Nei grafici di Campo la
serie "previsto" va in petrolio e la serie "fatto" in cotto.

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#953b17` | `oklch(0.471 0.130 40.2)` | 2,05 |
| base | `#d3633a` | `oklch(0.629 0.152 40.0)` | **4,23** ✅ |
| chiaro | `#f49c7d` | `oklch(0.775 0.114 40.1)` | **7,45** ✅ |
| tenue | `#f7cfc1` | `oklch(0.885 0.049 40.2)` | 11,03 ✅ |

**Superfici**

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#130b09` | `oklch(0.160 0.015 34.7)` |
| `--dark` | `#170f0c` | `oklch(0.178 0.015 41.5)` |
| `--panel` | `#1c110e` | `oklch(0.191 0.020 35.8)` |
| `--card` | `#281913` | `oklch(0.231 0.027 42.7)` |
| `--card2` | `#311e17` | `oklch(0.257 0.033 41.0)` |
| `--border` | `#3b251d` | `oklch(0.290 0.037 40.8)` |
| `--border2` | `#482c23` | `oklch(0.325 0.045 38.6)` |
| `--border-hi` | `#806055` | 3,00 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(211,99,58,.05)` e `rgba(86,182,187,.045)`.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#f4e5e0` | 15,87 | 13,83 | 12,89 | ✅ AAA |
| `--muted2` | `#caa99d` | 8,96 | 7,81 | 7,28 | ✅ AAA |
| `--muted` | `#ac897d` | 6,14 | 5,35 | 4,99 | ✅ AA |
| `--disabled` | `#826a62` | 3,88 | 3,38 | 3,15 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#6abb6e` | 145° | 105° | 6,73 ✅ |
| attenzione | `#d4bf3e` | 100° | 60° | 8,52 ✅ |
| errore | `#ef5d66` | 20° | 20° ⚠ | 4,84 ✅ |
| informazione | `#55a6ec` | 247° | 153° | 6,06 ✅ |

```css
:root{
  /* ============ CAMPO — operatività di giornata (tinta 40°) ============ */
  --app-h: 40;
  --app-accent-deep: #953b17;
  --app-accent:      #d3633a;
  --app-accent2:     #f49c7d;
  --app-accent-soft: #f7cfc1;
  --app-support:     #00787d;
  --app-support2:    #56b6bb;

  --bg:#130b09; --dark:#170f0c; --panel:#1c110e;
  --card:#281913; --card2:#311e17;
  --border:#3b251d; --border2:#482c23; --border-hi:#806055;

  --text:#f4e5e0; --muted2:#caa99d; --muted:#ac897d; --disabled:#826a62;

  /* attenzione = GIALLO puro (non ambra) e errore = rosso-ciliegia:
     servono a non confondersi con il cotto dell'app. */
  --success:#6abb6e; --warn:#d4bf3e; --danger:#ef5d66; --info:#55a6ec;

  --grad: linear-gradient(135deg,#f77a4d,#d65c2d);
  --grad-on: #130b09;
  --gradSuc: linear-gradient(135deg,#6abb6e,#2f7a33);
  --grad3:   linear-gradient(135deg,#ef5d66,#a22b33);

  --shadow-app: 0 10px 30px rgba(83,23,0,.42);
  --glow-app:   rgba(211,99,58,.30);
  --tint-app:   rgba(211,99,58,.14);
  --focus-ring: rgba(244,156,125,.30);
  --sel:        rgba(211,99,58,.30);
  --halo-1:     rgba(211,99,58,.05);
  --halo-2:     rgba(86,182,187,.045);
}
```

---

### 3.3 FLOTTA — mezzi e manutenzione

> **Carattere: meccanica e precisa.** Officina ordinata, tagliandi in
> regola, niente sorprese.

**Tinta scelta: magenta lampone, OKLCH 340°** (`#c360a6`).
*Confermata* (decisione recente del fondatore, che sostituiva il vecchio
`#5b7186` identico come tinta al blu di Sentinella).

**La scelta è giusta ma va difesa da un rischio.** Il magenta è
l'unico spazio davvero libero della ruota: dista 44° o più da ogni altra
app, è lontanissimo dal verde di successo (165°) e dal giallo (92°). Il
rischio è un altro: un magenta acceso su un'app di **mezzi pesanti**
sembra moda, non officina. Per questo:

1. la croma è tenuta a 0,152 (**lampone**, non fucsia);
2. l'appoggio è **acciaio ardesia** `#4d6b91` / `#91a7c3` (255°), a
   croma bassissima (0,048).

L'acciaio è la mossa che rende l'app credibile: è il colore delle
macchine, occupa metà del contesto (grafici, seconde serie, alone in
basso a destra) e "mette a terra" il magenta. Magenta + acciaio è una
combinazione da strumentazione tecnica, non da catalogo.

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#883871` | `oklch(0.469 0.130 340.1)` | 2,02 |
| base | `#c360a6` | `oklch(0.630 0.152 339.7)` | **4,19** ✅ |
| chiaro | `#e798cd` | `oklch(0.774 0.116 339.9)` | **7,39** ✅ |
| tenue | `#f1cde4` | `oklch(0.885 0.050 339.6)` | 11,03 ✅ |

**Superfici**

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#110b0f` | `oklch(0.159 0.013 338.8)` |
| `--dark` | `#150e13` | `oklch(0.175 0.015 336.8)` |
| `--panel` | `#1b1117` | `oklch(0.193 0.020 342.4)` |
| `--card` | `#251821` | `oklch(0.229 0.026 338.2)` |
| `--card2` | `#2e1d28` | `oklch(0.257 0.032 340.6)` |
| `--border` | `#382431` | `oklch(0.290 0.037 340.5)` |
| `--border2` | `#432b3b` | `oklch(0.324 0.044 339.8)` |
| `--border-hi` | `#7b5f71` | 3,02 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(195,96,166,.05)` e `rgba(145,167,195,.045)`.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#f2e4ed` | 15,85 | 13,88 | 12,93 | ✅ AAA |
| `--muted2` | `#c4a7ba` | 8,89 | 7,78 | 7,25 | ✅ AAA |
| `--muted` | `#a6889b` | 6,13 | 5,37 | 5,00 | ✅ AA |
| `--disabled` | `#7e6976` | 3,87 | 3,39 | 3,15 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#6abb6e` | 145° | 165° | 6,76 ✅ |
| attenzione | `#f8ac3d` | 72° | 92° | 8,29 ✅ |
| errore | `#f05e5c` | 24° | 44° | 4,88 ✅ |
| informazione | `#55a6ec` | 247° | 93° | 6,09 ✅ |

```css
:root{
  /* ============ FLOTTA — mezzi e manutenzione (tinta 340°) ============ */
  --app-h: 340;
  --app-accent-deep: #883871;
  --app-accent:      #c360a6;
  --app-accent2:     #e798cd;
  --app-accent-soft: #f1cde4;
  --app-support:     #4d6b91;   /* acciaio ardesia: e' cio' che rende  */
  --app-support2:    #91a7c3;   /* l'app "officina" e non "moda"       */

  --bg:#110b0f; --dark:#150e13; --panel:#1b1117;
  --card:#251821; --card2:#2e1d28;
  --border:#382431; --border2:#432b3b; --border-hi:#7b5f71;

  --text:#f2e4ed; --muted2:#c4a7ba; --muted:#a6889b; --disabled:#7e6976;

  --success:#6abb6e; --warn:#f8ac3d; --danger:#f05e5c; --info:#55a6ec;

  --grad: linear-gradient(135deg,#e677c5,#c65aa7);
  --grad-on: #110b0f;
  --gradSuc: linear-gradient(135deg,#6abb6e,#2f7a33);
  --grad3:   linear-gradient(135deg,#f05e5c,#a32a29);

  --shadow-app: 0 10px 30px rgba(77,17,62,.42);
  --glow-app:   rgba(195,96,166,.30);
  --tint-app:   rgba(195,96,166,.14);
  --focus-ring: rgba(231,152,205,.30);
  --sel:        rgba(195,96,166,.30);
  --halo-1:     rgba(195,96,166,.05);
  --halo-2:     rgba(145,167,195,.045);
}
```

**Da aggiornare insieme al CSS:** `<meta name="theme-color">` (riga 7) e
i due `%23...` dentro il manifest (riga 12) di
`apps/flotta/index.html`, altrimenti l'icona sulla schermata iniziale
resta del vecchio colore.

---

### 3.4 CONTI — amministrazione

> **Carattere: ordinata e sobria.** Il registro tenuto bene: nessuna
> emozione, tutto quadra.

**Tinta scelta: teal profondo, OKLCH 183°** (`#009f8f`).
*Confermata, con una correzione importante.* Era `#0e9384`, che aveva
una croma di **0,104**: era il colore più smorto di tutte le app, e su
fondo scuro spariva. L'abbiamo portato a 0,113 sulla base e 0,115 sul
chiaro, e soprattutto abbiamo alzato la luminosità del gradino chiaro:
il teal ora si vede.

Il teal è la scelta giusta per l'app dei soldi perché è **vicino al
verde ma non è verde**: dice "conti, liquidità, saldo" senza dire
"successo". La distanza dal verde di successo è di 45°, sufficiente a
non confondersi.

**Colore di appoggio: ottone `#896100` / `#c49e5d` (80°).** È il
*complementare* del teal (opposto sulla ruota) e porta il richiamo
classico della contabilità: il registro, il metallo, l'oro spento. È
tenuto a croma media e luminosità bassa apposta per **non** somigliare
all'ambra accesa del core: l'ottone di Conti (`#c49e5d`, croma 0,095) e
l'ambra Deepwork (`#ffab00`, croma 0,170) sono due materiali diversi.
Nei grafici l'ottone è la serie "incassato", il teal la serie
"fatturato".

Per evitare che l'ottone e il colore d'attenzione si confondano,
l'attenzione di Conti è spostata all'**arancio caldo** (55°): 128° di
distanza dall'accento e ben distinta dall'ottone per luminosità.

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#006a5f` | `oklch(0.471 0.084 182.6)` | 2,20 |
| base | `#009f8f` | `oklch(0.631 0.113 182.5)` | **4,71** ✅ |
| chiaro | `#4dcebd` | `oklch(0.776 0.115 183.0)` | **8,06** ✅ |
| tenue | `#b5e4dc` | `oklch(0.884 0.050 183.6)` | 11,19 ✅ |

**Superfici**

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#070f0e` | `oklch(0.160 0.013 186.6)` |
| `--dark` | `#091311` | `oklch(0.176 0.015 180.5)` |
| `--panel` | `#0a1715` | `oklch(0.192 0.019 183.5)` |
| `--card` | `#0d211e` | `oklch(0.230 0.027 183.1)` |
| `--card2` | `#0f2824` | `oklch(0.255 0.032 181.9)` |
| `--border` | `#12312d` | `oklch(0.288 0.038 184.2)` |
| `--border2` | `#153b36` | `oklch(0.323 0.044 183.7)` |
| `--border-hi` | `#496f69` | 3,00 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(0,159,143,.05)` e `rgba(196,158,93,.045)`.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#ddedea` | 16,03 | 13,86 | 12,88 | ✅ AAA |
| `--muted2` | `#94bab3` | 9,17 | 7,93 | 7,36 | ✅ AAA |
| `--muted` | `#739c95` | 6,38 | 5,52 | 5,13 | ✅ AA |
| `--disabled` | `#5b7772` | 3,99 | 3,45 | 3,21 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#79b862` | 138° | 45° | 6,56 ✅ |
| attenzione | `#ffa566` | 55° | 128° | 8,02 ✅ |
| errore | `#f05f5a` | 25° | 158° | 4,81 ✅ |
| informazione | `#55a6ec` | 247° | 64° | 5,97 ✅ |

```css
:root{
  /* ============ CONTI — amministrazione (tinta 183°) ============ */
  --app-h: 183;
  --app-accent-deep: #006a5f;
  --app-accent:      #009f8f;
  --app-accent2:     #4dcebd;
  --app-accent-soft: #b5e4dc;
  --app-support:     #896100;   /* ottone: il registro, non l'ambra del core */
  --app-support2:    #c49e5d;

  --bg:#070f0e; --dark:#091311; --panel:#0a1715;
  --card:#0d211e; --card2:#0f2824;
  --border:#12312d; --border2:#153b36; --border-hi:#496f69;

  --text:#ddedea; --muted2:#94bab3; --muted:#739c95; --disabled:#5b7772;

  /* successo spostato sul verde erba (45° dal teal), attenzione
     sull'arancio caldo per non confondersi con l'ottone. */
  --success:#79b862; --warn:#ffa566; --danger:#f05f5a; --info:#55a6ec;

  --grad: linear-gradient(135deg,#00b1a1,#009284);
  --grad-on: #070f0e;
  --gradSuc: linear-gradient(135deg,#79b862,#3d7a2c);
  --grad3:   linear-gradient(135deg,#f05f5a,#a32b27);

  --shadow-app: 0 10px 30px rgba(0,54,48,.42);
  --glow-app:   rgba(0,159,143,.30);
  --tint-app:   rgba(0,159,143,.14);
  --focus-ring: rgba(77,206,189,.30);
  --sel:        rgba(0,159,143,.30);
  --halo-1:     rgba(0,159,143,.05);
  --halo-2:     rgba(196,158,93,.045);
}
```

---

### 3.5 SENTINELLA — ambiente e monitoraggi

> **Carattere: attenta e strumentale.** Il sensore che non dorme:
> fredda, tecnica, sempre in ascolto.

**Tinta scelta: blu, OKLCH 248°** (`#288ee0`).
*Confermata — decisione esplicita del fondatore del 25/07: il blu è il
colore dell'ambiente, e non si tocca.* L'unico ritocco è tecnico: era
`#1971c2`, troppo scuro (L 0,543) — sul fondo scheda arrivava a **3,37**
e non passava. Ora l'accento base è a L 0,630 e sta a **4,53**, e
l'accento chiaro `#78bcfc` a **7,80**.

Il blu è anche il colore che la ricerca indica come il più affidabile
per un sistema di misura e allerta: comunica calma e competenza, non
allarme. Ed è utile che l'app che segnala i superamenti di soglia non
sia già di per sé un colore d'allarme.

**Colore di appoggio: ciano strumentale `#007781` / `#59b5bf` (205°).**
È *analogo* (43° dal blu): non crea tensione, e nei grafici delle serie
storiche permette di avere **due linee entrambe fredde ma nettamente
distinguibili** — la misura in blu, la soglia o la media in ciano — senza
dover ricorrere a un colore caldo che sembrerebbe un allarme.

**Nota dichiarata: in Sentinella `--info` è uguale a `--app-accent2`.**
Il blu-informazione standard e il blu dell'app sono la stessa tinta:
fingere che siano due colori diversi produrrebbe solo due blu quasi
identici, cioè confusione. Lo dichiariamo: in Sentinella l'informazione
è il colore dell'app. Restano tre stati ben distinti (verde, giallo,
rosso), che è ciò che conta.

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#005e9d` | `oklch(0.470 0.126 247.8)` | 2,13 |
| base | `#288ee0` | `oklch(0.630 0.153 248.1)` | **4,53** ✅ |
| chiaro | `#78bcfc` | `oklch(0.775 0.115 248.1)` | **7,80** ✅ |
| tenue | `#c0ddf9` | `oklch(0.885 0.050 247.5)` | 11,22 ✅ |

**Superfici**

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#090e13` | `oklch(0.161 0.013 248.5)` |
| `--dark` | `#0b1117` | `oklch(0.174 0.016 248.7)` |
| `--panel` | `#0d151d` | `oklch(0.192 0.020 248.9)` |
| `--card` | `#131e29` | `oklch(0.230 0.027 249.0)` |
| `--card2` | `#162432` | `oklch(0.255 0.033 249.2)` |
| `--border` | `#1c2d3d` | `oklch(0.290 0.037 247.7)` |
| `--border2` | `#21364a` | `oklch(0.325 0.045 248.2)` |
| `--border-hi` | `#536a80` | 3,00 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(40,142,224,.05)` e `rgba(89,181,191,.045)`.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#e0eaf5` | 15,92 | 13,86 | 12,95 | ✅ AAA |
| `--muted2` | `#9db4cb` | 9,06 | 7,89 | 7,37 | ✅ AAA |
| `--muted` | `#7c95ae` | 6,24 | 5,43 | 5,08 | ✅ AA |
| `--disabled` | `#617283` | 3,91 | 3,41 | 3,18 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#6abb6e` | 145° | 103° | 6,71 ✅ |
| attenzione | `#f8ac3d` | 72° | 176° | 8,22 ✅ |
| errore | `#f05f5a` | 25° | 137° | 4,87 ✅ |
| informazione | `#78bcfc` | 248° | 0° (dichiarato) | 7,80 ✅ |

```css
:root{
  /* ============ SENTINELLA — ambiente e monitoraggi (tinta 248°) ============ */
  --app-h: 248;
  --app-accent-deep: #005e9d;
  --app-accent:      #288ee0;
  --app-accent2:     #78bcfc;
  --app-accent-soft: #c0ddf9;
  --app-support:     #007781;   /* ciano: seconda linea dei grafici, soglie */
  --app-support2:    #59b5bf;

  --bg:#090e13; --dark:#0b1117; --panel:#0d151d;
  --card:#131e29; --card2:#162432;
  --border:#1c2d3d; --border2:#21364a; --border-hi:#536a80;

  --text:#e0eaf5; --muted2:#9db4cb; --muted:#7c95ae; --disabled:#617283;

  /* scelta dichiarata: in Sentinella l'informazione E' il colore dell'app. */
  --success:#6abb6e; --warn:#f8ac3d; --danger:#f05f5a; --info:#78bcfc;

  --grad: linear-gradient(135deg,#34a3fe,#0086dd);
  --grad-on: #090e13;
  --gradSuc: linear-gradient(135deg,#6abb6e,#2f7a33);
  --grad3:   linear-gradient(135deg,#f05f5a,#a32b27);

  --shadow-app: 0 10px 30px rgba(0,48,84,.42);
  --glow-app:   rgba(40,142,224,.30);
  --tint-app:   rgba(40,142,224,.14);
  --focus-ring: rgba(120,188,252,.30);
  --sel:        rgba(40,142,224,.30);
  --halo-1:     rgba(40,142,224,.05);
  --halo-2:     rgba(89,181,191,.045);
}
```

---

### 3.6 TERRA — estrattivo e rilievo

> **Carattere: radicata e misurata.** La cava vista dall'alto: il verde
> del terreno, la carta topografica, il volume che cala.

**Tinta scelta: verde cava (oliva-erba), OKLCH 132°** (`#659b2c`).
*Confermata come famiglia (verde), spostata come sfumatura — ed è una
modifica che risolve un problema reale.*

Il verde di prima (`#2f9e44`, tinta 146°) era **lo stesso verde del
colore di successo** (`#66bb6a`, tinta 145°). Un grado di distanza. In
un'app che mostra continuamente stati "a posto / da verificare", questo
significa che l'utente non sa se il verde vuol dire *tutto bene* o
*sei in Terra*.

La correzione ha due parti:

1. **l'accento scende a 132°**, verso l'oliva-erba: un verde più
   terroso, meno "semaforo", che è anche il verde giusto per un'app di
   terreno e rilievi;
2. **il successo di Terra sale a 178°**, cioè **verde-acqua**: resta
   inconfondibilmente "verde = va bene", ma sta a 46° dall'accento.

**Colore di appoggio: pietra calcarea `#7a6643` / `#b0a38d` (80°).** È
un **quasi-neutro caldo** (croma 0,034: praticamente un grigio-beige
sabbia). La scelta è deliberata: Terra è l'app dei volumi, delle sezioni
e delle quote, e ha già molto verde addosso. Un secondo colore acceso
l'avrebbe resa chiassosa; la pietra invece fa da sfondo naturale al
verde — è il colore del materiale, non del terreno — e non può litigare
con nessuno stato, perché è quasi grigia. È l'unico appoggio
volutamente sommesso delle sei palette, ed è ciò che dà a Terra la sua
aria "cartografica".

**Rampa dell'accento**

| Gradino | Hex | OKLCH | Contrasto su `--card2` |
|---|---|---|---|
| scuro | `#3e6901` | `oklch(0.471 0.130 131.9)` | 2,25 |
| base | `#659b2c` | `oklch(0.629 0.152 132.0)` | **4,68** ✅ |
| chiaro | `#9ac577` | `oklch(0.774 0.115 132.1)` | **7,92** ✅ |
| tenue | `#cde1bf` | `oklch(0.886 0.050 132.4)` | 11,27 ✅ |

**Superfici**

| Token | Hex | OKLCH |
|---|---|---|
| `--bg` | `#0b0f09` | `oklch(0.162 0.014 135.2)` |
| `--dark` | `#0e120b` | `oklch(0.175 0.015 132.1)` |
| `--panel` | `#11160d` | `oklch(0.192 0.019 131.6)` |
| `--card` | `#181f12` | `oklch(0.228 0.026 131.2)` |
| `--card2` | `#1d2616` | `oklch(0.255 0.032 132.1)` |
| `--border` | `#242f1b` | `oklch(0.289 0.038 131.8)` |
| `--border2` | `#2c3921` | `oklch(0.326 0.044 131.6)` |
| `--border-hi` | `#5d6c52` | 3,00 su `--card` ✅ |

**Aloni d'ambiente:** `rgba(101,155,44,.05)` e `rgba(176,163,141,.045)`.

**Testo e contrasti calcolati**

| Token | Hex | su `--bg` | su `--card` | su `--card2` | Esito |
|---|---|---|---|---|---|
| `--text` | `#e4ecdf` | 15,98 | 13,96 | 12,95 | ✅ AAA |
| `--muted2` | `#a7b79c` | 9,11 | 7,96 | 7,38 | ✅ AAA |
| `--muted` | `#88997c` | 6,35 | 5,54 | 5,14 | ✅ AA |
| `--disabled` | `#697461` | 3,93 | 3,43 | 3,19 | esente (≥3) |

**Colori di stato**

| Ruolo | Hex | Tinta | Distanza dall'accento | Contrasto su `--card2` |
|---|---|---|---|---|
| successo | `#27bea5` | 178° | 46° | 6,71 ✅ |
| attenzione | `#ffa752` | 62° | 70° | 8,13 ✅ |
| errore | `#f05f5a` | 25° | 107° | 4,84 ✅ |
| informazione | `#55a6ec` | 247° | 115° | 6,00 ✅ |

```css
:root{
  /* ============ TERRA — estrattivo e rilievo (tinta 132°) ============ */
  --app-h: 132;
  --app-accent-deep: #3e6901;
  --app-accent:      #659b2c;
  --app-accent2:     #9ac577;
  --app-accent-soft: #cde1bf;
  --app-support:     #7a6643;   /* pietra: quasi-neutro caldo, volutamente sommesso */
  --app-support2:    #b0a38d;

  --bg:#0b0f09; --dark:#0e120b; --panel:#11160d;
  --card:#181f12; --card2:#1d2616;
  --border:#242f1b; --border2:#2c3921; --border-hi:#5d6c52;

  --text:#e4ecdf; --muted2:#a7b79c; --muted:#88997c; --disabled:#697461;

  /* successo = VERDE-ACQUA: e' la correzione che impedisce di confondere
     "va bene" con "sei in Terra". */
  --success:#27bea5; --warn:#ffa752; --danger:#f05f5a; --info:#55a6ec;

  --grad: linear-gradient(135deg,#73af34,#579100);
  --grad-on: #0b0f09;
  --gradSuc: linear-gradient(135deg,#27bea5,#0d7a68);
  --grad3:   linear-gradient(135deg,#f05f5a,#a32b27);

  --shadow-app: 0 10px 30px rgba(29,54,0,.42);
  --glow-app:   rgba(101,155,44,.30);
  --tint-app:   rgba(101,155,44,.14);
  --focus-ring: rgba(154,197,119,.30);
  --sel:        rgba(101,155,44,.30);
  --halo-1:     rgba(101,155,44,.05);
  --halo-2:     rgba(176,163,141,.045);
}
```

---

## PARTE 4 — Verifica: le sei si distinguono davvero?

### 4.1 Il quadro d'insieme

| App | Carattere | Tinta | Accento base | Accento chiaro | Sfondo | Scheda | Appoggio |
|---|---|---|---|---|---|---|---|
| **Campo** | operativa e calda | 40° | `#d3633a` | `#f49c7d` | `#130b09` | `#281913` | `#56b6bb` petrolio |
| **Terra** | radicata e misurata | 132° | `#659b2c` | `#9ac577` | `#0b0f09` | `#181f12` | `#b0a38d` pietra |
| **Conti** | ordinata e sobria | 183° | `#009f8f` | `#4dcebd` | `#070f0e` | `#0d211e` | `#c49e5d` ottone |
| **Sentinella** | attenta e strumentale | 248° | `#288ee0` | `#78bcfc` | `#090e13` | `#131e29` | `#59b5bf` ciano |
| **Scudo** | solida e vigile | 292° | `#8c75dc` | `#b7a8f9` | `#0d0c13` | `#1d1b28` | `#86a5de` indaco |
| **Flotta** | meccanica e precisa | 340° | `#c360a6` | `#e798cd` | `#110b0f` | `#251821` | `#91a7c3` acciaio |

Le sei tinte sono distribuite quasi a intervalli regolari sulla ruota —
40, 132, 183, 248, 292, 340 — con un unico grande vuoto fra 340 e 40
(60°) e uno fra 40 e 132 (92°): **è il vuoto in cui vive il core
Deepwork** (ambra 74°), tenuto libero apposta.

### 4.2 La tabella delle distanze

Per ogni coppia: **distanza di tinta in gradi** e **ΔE OKLab** fra gli
accenti base (ΔE è la distanza percettiva; il minimo percepibile — la
soglia sotto cui l'occhio non vede differenza — vale circa **0,02**).

| | Campo | Terra | Conti | Sentinella | Scudo | Flotta |
|---|---|---|---|---|---|---|
| **Campo** | — | 92° / 0,22 | 143° / 0,25 | 152° / 0,30 | 108° / 0,25 | 60° / 0,15 |
| **Terra** | 92° / 0,22 | — | 51° / 0,12 | 116° / 0,26 | 160° / 0,30 | 152° / 0,29 |
| **Conti** | 143° / 0,25 | 51° / 0,12 | — | 65° / 0,15 | 109° / 0,22 | 157° / 0,26 |
| **Sentinella** | 152° / 0,30 | 116° / 0,26 | 65° / 0,15 | — | **44° / 0,11** | 92° / 0,22 |
| **Scudo** | 108° / 0,25 | 160° / 0,30 | 109° / 0,22 | **44° / 0,11** | — | 48° / 0,12 |
| **Flotta** | 60° / 0,15 | 152° / 0,29 | 157° / 0,26 | 92° / 0,22 | 48° / 0,12 | — |

**Il minimo assoluto è la coppia Scudo / Sentinella: 44° di tinta e
ΔE 0,113**, cioè circa **6 volte** la soglia di percezione. Viola e blu
sono i due più vicini del gruppo, ma restano nettamente due colori
diversi — e le loro superfici, che coprono l'intero schermo, hanno un
ΔE di 0,019 sul fondo delle schede (circa 9 volte la soglia),
sufficiente perché a colpo d'occhio la pagina di Scudo si legga "viola"
e quella di Sentinella "blu". *(Confronto: la
vecchia coppia Flotta / Sentinella aveva **0 gradi** di distanza — era
letteralmente la stessa tinta.)*

Tutte le altre quattordici coppie stanno sopra i 48° e sopra ΔE 0,12.

### 4.3 Riepilogo dei contrasti — nessuna eccezione

| Ruolo | Minimo richiesto | Peggior valore fra le sei app | Esito |
|---|---|---|---|
| `--text` su qualsiasi superficie | 4,5 | **12,88** (Conti su `--card2`) | ✅ AAA |
| `--muted2` | 4,5 | **7,25** (Flotta su `--card2`) | ✅ AAA |
| `--muted` | 4,5 | **4,99** (Campo su `--card2`) | ✅ AA |
| `--app-accent2` (testo) | 4,5 | **7,39** (Flotta su `--card2`) | ✅ AAA |
| `--app-accent` (solo grafica) | 3,0 | **4,19** (Flotta su `--card2`) | ✅ |
| `--success` | 4,5 | **6,56** (Conti) | ✅ AAA |
| `--warn` | 4,5 | **8,02** (Conti) | ✅ AAA |
| `--danger` | 4,5 | **4,81** (Conti) | ✅ AA |
| `--info` | 4,5 | **5,97** (Conti) | ✅ AA |
| `--border-hi` (bordo campi) | 3,0 | **3,00** (Terra/Campo/Conti/Sent. su `--card`) | ✅ |
| etichetta su `--grad` | 4,5 | **5,02** (tappa scura, Terra/Conti) | ✅ AA |
| `--disabled` | *esente* | **3,15** (Campo/Flotta) | ✅ oltre l'esenzione |

Tutti i rapporti sono calcolati con la formula WCAG 2 sui valori
esadecimali definitivi, su tutti e tre i fondi possibili
(`--bg`, `--card`, `--card2`).

**Un'avvertenza sul `--border-hi`:** raggiunge 3:1 su `--card`, che è il
fondo su cui i campi stanno normalmente. Se un campo dovesse finire su
`--card2` (fondo più chiaro) scenderebbe a ~2,8: in quel caso va usato
`--app-accent2` come bordo, oppure il campo va tenuto su `--card`, che è
la regola del core.

---

## PARTE 5 — Come si usano (e come non si usano)

### 5.1 Quale token per cosa

| Se devi colorare… | Usa |
|---|---|
| lo sfondo della pagina | `--bg` |
| una scheda | `--card`, oppure `linear-gradient(180deg,var(--card2),var(--card))` |
| il bordo di una scheda o un separatore | `--border` |
| il bordo di un **campo, select, controllo** | `--border-hi` |
| la striscia laterale di una scheda, un pallino, una barra di grafico | `--app-accent` |
| **un testo, un numero KPI, la voce di menu attiva, un link** | `--app-accent2` |
| la seconda serie di un grafico | `--app-support2` |
| il testo su un fondo pieno d'accento | `--app-accent-soft` o `--grad-on` |
| un bottone primario | `--grad` con testo `--grad-on` |
| l'esito di un'operazione | `--success` / `--warn` / `--danger` / `--info` |

### 5.2 Le cinque cose da non fare

1. **Non usare `--app-accent` per il testo.** È il colore grafico: ha
   3:1, non 4,5:1. Per il testo esiste `--app-accent2`. (È il difetto
   che va corretto in `shared/deepwork-style.css:124`.)
2. **Non inventare colori in linea.** Ogni `style="color:#..."` dentro
   una app rompe la palette. Se un colore serve e non c'è, va aggiunto
   qui prima che nel codice.
3. **Non usare un colore di stato come decorazione.** Il rosso vuol dire
   errore, il verde vuol dire a posto. Se serve un colore "solo per
   distinguere", si usa `--app-support2`.
4. **Non affidare un'informazione al solo colore.** Sempre anche icona,
   etichetta o forma.
5. **Non toccare le luminosità.** Le L delle superfici e delle rampe
   sono identiche in tutte e sei le app e identiche al core: è quello
   che tiene insieme l'ecosistema. Si può discutere una tinta, non una
   luminosità.

### 5.3 Cosa resta nelle singole app

Il blocco `:root` della sezione corrispondente, e nient'altro. Più i due
punti dove il colore va ripetuto per forza:

- `<meta name="theme-color" content="...">` (usare `--app-accent`);
- i due `%23...` dentro il manifest (colore icona e
  `background_color`, che deve essere lo `--bg` dell'app).

Tutto il resto — misure, ombre, raggi, tipografia, componenti — sta nei
fogli condivisi ed è **identico al core**, come da direttiva.

### 5.4 Temi chiaro e sole

Questo documento definisce il **tema scuro**, che è quello di default.
Il core ha anche `body.light-mode` e `body.outdoor-mode` (la modalità
sole per l'uso in cava). Quando i due temi verranno portati nei fogli
condivisi (punto 8 del piano in `SPECIFICA_ESTETICA_CORE.md`), le tinte
qui definite restano le stesse: cambiano solo le luminosità, che vanno
ribaltate (superfici chiare, accenti più scuri). In modalità sole gli
aloni d'ambiente e le ombre si spengono, esattamente come nel core.

---

## PARTE 6 — I due terzi che non erano mai stati verificati

*(aggiunta il 07/08/2026, misurata, verificata contro il commit `24c4d89`)*

⛔ **Le sei palette qui sopra sono state verificate a contrasto in UN tema su
tre.** Le app hanno tre modalità — `shared/dw-tema.js` gira fra `scuro`,
`chiaro` e `sole` — e fino al 07/08 il banco `contrasto.mjs` ne misurava
soltanto il **buio**. Cioè due terzi di quello che un cliente può vedere non li
guardava nessuno, e il terzo non misurato che pesa di più è `sole`: è il tema
fatto per chi legge il telefono **in cava, sotto il sole**, che è il posto dove
questo prodotto vive.

### 6.1 Che cosa dice la misura

| tema | testi misurati | sotto soglia AA | superfici |
|---|---|---|---|
| **scuro** | 4.638 | **0** | 14 |
| **chiaro** | 3.692 | **54** | 6 (le altre 8 non hanno questo tema) |
| **sole** | 3.694 | **54** | 6 |

Per app, nel chiaro: **flotta 13 · sentinella 10 · campo 10 · conti 10 · scudo 9
· terra 2**.

⚠️ **E i due elenchi sono gli stessi.** Non è un difetto del tema `sole`: è un
difetto di **tutto ciò che non è buio**. Il core e le altre otto superfici non
compaiono perché non hanno questi temi — il core ne ha due suoi dalla v4.4, e
va detto invece di lasciarlo dedurre.

### 6.2 La causa, che è una sola per tutte e sei

`--success`, `--warn` e `--danger` sono dichiarati **una volta sola, per il
buio**, e non ridetti per i due temi chiari. `shared/dw-app-ui.css` l'aveva già
previsto per i **gradienti** e per due `:hover` — mai per i `color:` che ogni
app scrive in casa propria (venti punti nella sola Sentinella).

⛔ **E non si risolve ridefinendo `--warn`.** Quella variabile fa **due
mestieri**: è anche il *pieno* di `.badge.warn` e `.toast.err`, che sopra ci
scrivono un quasi nero. Scurirla sposta il difetto invece di toglierlo. La
strada che regge è **aggiungere un nome, non riscrivere il vecchio**.

### 6.3 Perché due livelli e non uno — la parte che un conto non poteva dare

Portando tutto a 4,9:1 la prova **passa**, e il numerone d'ambra diventa
**marrone** accanto alla sua pastiglia «ATTENZIONE», che resta ambra piena
perché è un fondo. A 4,9:1 sul bianco nessuna tinta della famiglia ambra è
ancora ambra: è fisica. Ma le soglie WCAG sono **due davvero** — 4,5 per il
testo piccolo, 3 per quello grande (≥24 px, o ≥18,66 px in grassetto) — e una
cifra da 34 px non ha bisogno di stare al livello di un'etichetta da 8 px.
Si vede **solo affiancando gli scatti**, alla terza iterazione.

Riferimento, misurato su Sentinella (le altre rimisurano sui **propri** fondi):

| | testo piccolo (4,5) | numerone (3) | prima |
|---|---|---|---|
| verde | `#127617` **4,90** | `#16911c` **3,49** | 2,49 |
| ambra | `#8e5a0e` **4,92** | `#af6f11` **3,49** | 2,44 |
| rosso | `#c6231e` **4,86** | `#d6352f` **4,04** | 3,90 |

⚠️ **Le tinte non si toccano** (123°/36°/2°): uno stato non deve cambiare
significato cambiando tema.
⚠️ E l'idioma di casa `color-mix(… N%, #000)` è stato **provato e scartato con
la misura**: scala tutti i canali, quindi la croma cala in proporzione — a
4,9:1 l'ambra diventa `#865d21`, croma **41** contro 77. Alzando la saturazione
mentre si scende di chiarezza si arriva **allo stesso contrasto con croma 53**.

### 6.4 La regola che questa parte aggiunge alle otto della Parte 1

> **Una palette non è finita finché non è verificata nei tre temi.** Un colore
> scelto per il buio non è una palette: è un terzo di palette, e i due terzi
> che restano sono quelli che si guardano fuori, con il sole in faccia.

### 6.5 Il righello, e i suoi limiti dichiarati

⚠️ Le 54 sono **segnalate**, non tutte vere. Verificandone dieci a mano con uno
strumento indipendente (conto WCAG riscritto da zero + lettura dei **pixel**
dallo screenshot dell'elemento) il banco è stato smentito **una volta su
dieci**: «µg/m³» era dichiarato 2,92 e vale **4,71** — passava. Altre quattro
sono vere ma prudenti (2,92 dichiarato contro 3,1-3,3 renderizzati).
La causa è la **settima trappola** di `contrasto.mjs`, dichiarata nel suo
commento: `sfondiDi` accoppia *tutte* le fermate del gradiente di fondo con
*tutte* quelle dell'inchiostro e prende il minimo, cioè accoppia il pixel
d'inchiostro più chiaro col pixel di fondo più scuro **anche quando stanno agli
angoli opposti**. Su un elemento piccolo all'estremità di un gradiente a 135°
costa fino a **1,8** di rapporto.
⛔ Quindi vale, qui più che altrove, la regola scritta in cima a quel banco:
**un KO va verificato come un OK**. Correggere un colore sano è un danno, e non
lo vede nessuno.

### 6.6 Che cosa resta aperto, coi numeri

- **I bordi di stato non sono testo, e nessuno li misura.** Portano
  informazione (WCAG 1.4.11 → 3:1) e nei temi chiari usano il colore crudo:
  `--warn` **1,92:1** su bianco, `--success` **2,35:1**. Sotto il sole quella
  striscia è **come si distingue una scheda a posto da una in attenzione**.
- **La costruzione a due livelli è un candidato per `shared/`**: lì ogni app
  darebbe le sue tre tinte e i due livelli si ricaverebbero **una volta invece
  di sei**.
- **Nove selettori su ventidue la dimostrazione non li fa mai comparire**
  (misurato in Sentinella): l'aritmetica li copre perché usano gli stessi
  token, ma nessuno scatto e nessuna passata del banco li ha visti.

---

## PARTE 7 — Come si chiamano i due livelli (07/08, dopo che tutte e sei hanno finito)

Le sei app hanno risolto **lo stesso problema** in sei cantieri paralleli che non
si parlavano, e ci sono arrivate alla stessa conclusione con sei misure diverse.
Vale la pena scriverla una volta, perché la settima volta non si rifaccia.

### La regola, in una riga

> **Un colore che fa anche da PIENO non si riscrive: gli si affianca un
> inchiostro.** E gli inchiostri sono **due livelli**, non uno.

Perché: `--warn`, `--success` e `--danger` dipingono anche il fondo delle
pastiglie, e sopra quel fondo ci sta scritto qualcosa. Tirare l'unica variabile
in mezzo rompe sempre uno dei due mestieri. Misurato tre volte, in tre app,
senza che i tre cantieri si conoscessero:

| app | la misura che l'ha deciso |
|---|---|
| Conti | scurendo `--danger` a `#c62924` la pastiglia «INSOLUTA» scende da **5,72 a 3,30** |
| Terra | `.badge.warn` ci scrive sopra quasi-nero a **9,3:1**: scurirlo lo rovina |
| Scudo | idem, e `--warn` è anche il pieno di `.chg.e-ok.active` |

### I due livelli, e le due soglie

Le soglie WCAG 1.4.3 sono **due davvero**: 4,5:1 sotto i 24 px (o i 18,66 in
grassetto), 3:1 sopra. Un numerone da 32 px non ha bisogno di stare dove sta
un'etichetta da 11, e **forzarlo lì lo rovina**: tutte e sei le app hanno
provato la versione a un livello solo, e in tutte e sei l'ambra del numerone
diventava **marrone** accanto al bordo della sua card, che resta ambra acceso
perché è un fondo.

| livello | nome | dove | soglia |
|---|---|---|---|
| inchiostro | `--ink-ok` · `--ink-wr` · `--ink-dg` | frasi, etichette, 11-17 px | **4,5:1** |
| cifre | `--num-ok` · `--num-wr` · `--num-dg` | numeroni ritagliati nel gradiente, 20-38 px | **3:1** |

In `:root` valgono il colore di stato (**zero differenza sul buio**, verificato
al pixel e al md5 in tre app); cambiano **solo** dentro
`body.dw.light-mode, body.dw.outdoor-mode`.

### E i nomi sono questi, non altri

Il 07/08 Conti ha scritto `--danger-ink / --warn-ink / --sup-ink` mentre le
altre cinque scrivevano `--ink-dg / --ink-wr / --ink-ok`: **la stessa idea, due
nomi**, e nessuno dei due sbagliato. Una divergenza di nome non rompe niente
oggi, e rende impossibile domani portare la regola in `shared/` — quindi Conti è
stata allineata (venti sostituzioni, `run-stile` 295 invariato).

⚠️ **E una regola automatica è stata pensata e SCARTATA con la misura**, perché
nessuno la rifaccia alla cieca. La forma ovvia era una regola di `run-stile`:
*«una variabile che nomina un inchiostro deve chiamarsi `--ink-…`»*. Censite
tutte le proprietà dichiarate che contengono `ink` o `num`: sono **13 nomi**, e
**5** sarebbero da scusare per nome — `--grad-num`, `--grad3-ink`,
`--grad-ok-num`, `--grad-wr-num`, `--grad-dg-num`, che sono legittimi (un
gradiente qualificato, non uno stato) e portano proprio l'ordine che la regola
vieterebbe. Una regola con il **38% di eccezioni** non è severa: è un allarme
che insegna a non guardarlo. La convenzione sta scritta qui, che è dove si
arriva prima di toccare una palette.

### Il pezzo che resta aperto, e la sua misura

La causa vera sta in `shared/dw-app-ui.css`, che deriva `--grad-ok/-wr/-dg` con
una mano fissa — **86% / 78% / 82%** verso il nero — tarata su nessun fondo in
particolare: è il motivo per cui il difetto era **identico in tutte e sei le
app**. Le sei correzioni sono in casa di ciascuna, e sono legittime (una palette
è dell'app), ma sono **sei copie dello stesso rimedio**.
⚠️ Quello che NON va fatto è sostituirle con una settima derivazione generica:
ognuna delle sei è stata misurata sul **fondo peggiore che quei due temi
producono davvero in quell'app**, e quei fondi sono velati dell'accento di
ciascuna — si scostano di ~0,3. Una formula unica sarebbe più elegante e meno
vera. Il candidato giusto è che `shared/` fornisca il **ripiego** (i due livelli
derivati) e ogni app conservi la facoltà di scavalcarlo coi suoi valori
misurati, che è esattamente quello che oggi fanno tutte e sei.

---

## Fuori perimetro

Questo documento copre **le sei app verticali**. Restano fuori:

- **Genesi**, che oggi usa l'ambra del core e ha token con nomi propri:
  la sua palette va definita a parte, dopo l'allineamento dei token;
- **Deepwork ID**, servizio trasversale, che tiene i suoi
  `#c7b794` / `#e8dcc0` (tinta 41° in HSL / ~86° in OKLCH, cioè la
  famiglia del core): è corretto così, perché è il servizio comune e non
  una verticale;
- **il core Deepwork**, intoccabile: è il riferimento di tutti.

---

*Documento di progettazione colore. Non contiene codice di produzione:
l'applicazione ai fogli di stile avviene nelle unità di lavoro del task
C1, una app alla volta, con screenshot di confronto.*
