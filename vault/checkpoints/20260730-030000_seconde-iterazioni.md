# Checkpoint — 30/07/2026 03:00 UTC

## Task completati
**Blocco 6: le seconde iterazioni. Quattro difetti dichiarati ieri, chiusi.**

| Commit | Cosa |
|---|---|
| `aab9d07` | Unità di misura mai in maiuscolo — corretto nel motore condiviso |
| `ff362aa` | Campo e Genesi: i numeri si scrivono come si scrivono in Italia |
| `2b661f7` | Sentinella: la virgola non decuplica più. Flotta: la tessera dice il vero |
| `7fd693b` | Scudo: i comandi si possono toccare col dito |

Non è lavoro nuovo: è la lista dei difetti che i cantieri di ieri avevano
trovato e **scritto nei commit invece di nascondere**. Ognuno era piccolo,
ognuno era vero, e tre su quattro erano peggio di come erano stati descritti.

## Il filo: ogni difetto era più grave di quanto sembrava

**Le unità in maiuscolo.** Sembrava un problema di Terra, corretto là. Poi di
Sentinella, corretto là. Poi di Campo. Tre toppe locali per una causa sola, che
stava in `shared/dw-grafici` — l'etichetta d'asse contiene **solo** l'unità.
Ma la cosa che si vede solo eseguendo è che Chromium trasforma `µ` (U+00B5,
micro) nella **mu greca maiuscola** `Μ` (U+039C): `µg/m³` diventava `ΜG/M³`,
cioè milligrammi, **mille volte tanto**, su un rapporto che il cliente
consegna all'ente sotto il suo nome. Ora il motore avvolge da sé l'unità e le
app non devono ricordarsene — e togliendo le tre toppe «VOCE» e «QUOTA»
tornano maiuscole come nel core, perché quelle toppe spegnevano il maiuscolo
a *tutta* l'intestazione: correggevano un difetto allontanandosi dal
riferimento.

**La virgola decimale.** Dichiarata come «il campo PPV non accetta la
virgola». Misurata: in un `input type="number"`, digitando «2,4» da tastiera,
`.value` diventa **«24»** e `checkValidity()` risponde **true**. Non un campo
vuoto: un numero dieci volte più grande, salvato in silenzio e dichiarato
valido dal browser. Su una PPV è un falso superamento e un valore falso dentro
la regressione che decide le distanze di sicurezza. Il `replace(",", ".")` che
c'era era codice morto: il browser scarta la virgola prima che JS la veda.

**I bersagli di tocco.** Dichiarati come «le icone sono 30×30». Misurando con
`elementFromPoint` sono venuti fuori **144 comandi su 193** sotto misura, e tre
cose che il CSS non dice: i badge che fanno qualcosa erano alti 19–20 px, cioè
peggio delle icone; sei comandi finivano sulla terza riga di un testo troncato
a due, quindi **invisibili e irraggiungibili**; e il trucco `::after` che c'era
già non funzionava, perché `overflow:hidden` taglia anche lo pseudo-elemento.

## Due difetti trovati da me, guardando invece di leggere
Girando le sei app a 390 px cercando il punto decimale nel testo mostrato:
- **Sentinella, prima schermata**: la riga di priorità incollava il numero
  grezzo, «36.8 µg/m³» col punto inglese accanto a numeri con la virgola;
- **Flotta, tessera del carburante**: `toFixed(1)` dava «€8.4k».

E indagando il primo è uscito il terzo, che è il peggiore: **`numeroIt(null)`
scriveva «0»**, perché `+null` fa 0. Su un rapporto di monitoraggio «0 µg/m³»
è un fatto, e falso — il dato manca. Che fosse un difetto e non una scelta lo
diceva l'incoerenza: `undefined` dava già il trattino, `null` no.

## Le verifiche, e i miei sbagli dentro le verifiche
**Sette volte** ho scritto una prova che accusava il codice e sbagliavo io.
Vale scriverle perché sono le trappole dei metodi, non distrazioni:
- `pianoConsuntivoCsv` vuole un **array**, non `{fori}`; `pianoParziale`
  risponde `registrati`/`totale`, non `fori`; il CSV separa con `;` non con `,`;
- 2,4449 arrotondato a due decimali fa **2,44**, non 2,45 (aritmetica mia);
- `ritmoOreMezzi` con due letture a 20 e **0** giorni fa dà 4,0 h/gg, non 4,44:
  avevo scritto 0 dove servivano 2 giorni;
- e le prime due misure dei bersagli di tocco erano **entrambe** sbagliate:
  `elementFromPoint` vive nel **viewport** (un comando sotto la piega risponde
  null e sembra morto), e «è mio» deve voler dire l'elemento **o un suo
  discendente** — accettando anche un antenato si misura la riga intera e
  vengono fuori aree da 80 px che non esistono.

Ogni volta il codice aveva ragione. È la regola già in `CLAUDE.md` e continua a
servire: **prima di dichiarare un difetto va capito come funziona la cosa.**

**Controprova che conta di più delle prove**: le 11 asserzioni sulle unità
girate sulla **versione precedente** del motore — 8 fallivano, comprese quelle
su `ΜG/M³` e `M³`. Una prova che non fallisce sul difetto non dimostra niente.

Suite: **250 KPI** (erano 232), 7 demo, 43 helper, 9 manifest, 23 pointcloud.
Nel browser: 11 asserzioni sul motore dei grafici, 12 sulle etichette delle sei
app guardando la trasformazione **effettiva** frammento per frammento, 46 sui
numeri di Campo, 14 sui campi decimali di Sentinella digitati da tastiera in
en-US **e** it-IT, 31 sui bersagli di tocco a 320/360/390/430/768 px con
emulazione touch, più la controprova col mouse che il desktop non è cambiato.

## Quello che resta aperto, scritto e non nascosto
- **Scudo**: larghezza dei comandi 36–38 px invece di 44 (compromesso
  misurato: 44 pieni con 8 px di stacco costavano +847 px di altezza), e il
  badge dell'idoneità 19–38 px perché è un bersaglio **in linea** dentro un
  testo troncato — il caso che la WCAG 2.5.8 esenta esplicitamente. Verificato
  che sia sempre raggiungibile, che lì è la cosa che conta.
- **Sentinella**: `numeroIt` da cento in su arrotonda all'unità (regola di
  lettura dell'app, invariata). Dove cancellava una misura — la distanza del
  ricettore, 312,5 m → «313 m» — ora si chiedono i decimali esplicitamente.
- **Le altre quattro app** hanno lo stesso difetto della virgola: Flotta
  (litri, euro, ore, tariffe, prezzi ricambi), Conti, Terra, Scudo.

## Prossimo passo atomico
1. **Genesi, via i tre dialoghi del browser** (`prompt()` verso riga 3582 e
   3602, `confirm()` verso 3592): violano la direttiva vincolante sullo stile
   («`alert()`/`confirm()` del browser sono vietati, si usa il toast del
   core»). È una violazione di regola, quindi viene prima di tutto il resto.
2. **La virgola nelle altre quattro app**, campo per campo come in Sentinella:
   il metodo è provato e c'è `numeroDaCampo` da riusare.
3. **Ponte P2 Campo → Terra**, l'ultimo che manca: la produzione del turno —
   che ora è in numeri e unità — alimenta i volumi per fronte senza
   reinserimento.
