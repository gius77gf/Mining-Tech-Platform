/* IL CONTRASTO DI TUTTO IL TESTO, SU TUTTE LE SUPERFICI, MISURATO SUL
   RENDERIZZATO. Estende a badge, pillole, note e tabelle la misura nata per i
   riquadri della home del core, dove un sottotitolo stava a 1,08:1 — arancione
   scuro su arancione, invisibile — senza che nessun test lo vedesse.

   Soglia: 4,5:1 per il testo piccolo (WCAG 1.4.3), 3:1 per quello grande
   (≥ 24 px, oppure ≥ 18,66 px in grassetto).

   ⛔ SEI TRAPPOLE. Le prime tre sono nel verso che ASSOLVE; le ultime tre
   nell'altro, e costano in un modo diverso ma non minore — mandano a cambiare
   colori che stanno benissimo. Sono state trovate tutte e tre in un'ora, il
   03/08, e non è un caso: finché le trappole scritte qui erano solo del primo
   tipo, la famiglia opposta non l'aveva cercata nessuno.
   1. **Sfondi a gradiente**: il colore vero sta in `background-image`, e
      cercando un fondo opaco fra gli antenati si finisce contro lo sfondo della
      pagina. Bianco su arancione risultava 19:1. Il colore si prende dal
      gradiente — e dal 08/08 **nel punto in cui il testo sta davvero**, non
      accoppiando tutte le fermate (vedi «LA GEOMETRIA DEI GRADIENTI»).
   2. **Trasparenza del colore del testo**: va composta col fondo.
   3. **`opacity` ereditata**: `opacity:.85` su un antenato portava 4,75 a 4,31.
   4. **`opacity` di un'ANIMAZIONE, colta a metà.** La guardia della trappola 2
      guardava `transitionProperty` e basta, e nel core l'opacità la muovono
      **animazioni**: `scrFade` (0→1 a ogni cambio di schermata), `fadeUp`
      (riquadro d'accesso e modali) e `pulseDanger`/`pulseSync`, che sono
      **infinite** e scendono a `.6` per sempre. Un elemento preso a metà
      pulsazione si misura col suo bianco già impastato di fondo: bianco su
      `#b71c1c` fa 6,57:1 fermo e **3,49:1** a opacità .63. Il rimedio è in due
      pezzi, perché i due casi sono diversi: le animazioni **finite** si
      ASPETTANO (`Animation.finished`), quelle **infinite** non si possono
      aspettare e allora si **dichiarano**, come già si fa per le dissolvenze.
      La differenza col caso 2 è il verso: qui il banco non assolve, accusa —
      e un'accusa falsa su un colore manda a rovinare una palette sana.
   5. **Testo dipinto dal gradiente di un ANTENATO** (la 1 un piano più sotto):
      l'unità sta dentro il numero, il suo inchiostro è trasparente perché lo
      eredita, e veniva **1:1**. Un `1:1` tondo non è un colore: è una misura
      che non ha trovato l'inchiostro.
   6. **I comandi SPENTI non hanno una soglia.** La WCAG 1.4.3 esclude il testo
      «che fa parte di un componente d'interfaccia inattivo». `.dw-btn:disabled`
      porta `opacity:.6`, e «Salva preventivo» veniva bocciato a 2,9:1 perché
      al momento della misura il modulo era vuoto. Qui il rimedio sbagliato era
      peggio del difetto inesistente: schiarire quel testo avrebbe fatto
      sembrare premibile un bottone che non lo è.

   ⚠️ COME È VENUTA FUORI, perché il modo conta più del difetto. Il giro
   notturno aveva bocciato quattro elementi del core, e il checkpoint di quella
   mattina diceva al lettore dopo di **scurire la palette del core «il minimo
   indispensabile»**. Prima di toccare un colore è stato fatto il conto a mano:
   bianco su `#2e7d32` fa **5,13:1**, cioè passa — e un banco che dice 2,36 su
   un colore che ne fa 5,13 sta sbagliando lui. Rimisurato sullo stesso identico
   `index.html` (zero commit sul file in mezzo, verificato con `git log`): **tre
   giri di fila, 333 testi, 0 sotto soglia**. Il giro notturno girava su una
   copia di un commit **precedente** a quello che ha sistemato l'accesso al
   core, quindi misurava schermate a metà comparsa.
   La lezione non è sulle animazioni: è che **un KO va verificato come un OK**.
   Questo banco esiste perché nessuno guardava i colori; se le sue bocciature
   si prendono per buone senza il conto a mano, diventa lui la fonte del danno.

   ⛔ **OTTAVA TRAPPOLA, ED È QUELLA CHE HA PORTATO IL CANTIERE DEL 08/08: IL
   PUNTO.** Fino al 07/08, quando l'inchiostro o il fondo venivano da un
   gradiente, questo banco accoppiava TUTTE le fermate dell'uno con TUTTE
   quelle dell'altro e teneva il minimo — cioè accoppiava anche pixel che
   stanno agli angoli opposti del rettangolo e non si incontrano mai. Sei
   cantieri hanno rimisurato a mano tutti e 32 i KO delle sei app leggendo i
   pixel veri: **quattro erano accuse false**, tutte fra i casi a forbice
   larga (Flotta `.n` 3,01 contro 2,93; Campo `.n` 3,15 contro 2,86; due
   `.avatar.sup` di Scudo 4,92 e 4,78 contro 3,77). Sui casi senza forbice i
   righelli indipendenti davano lo stesso numero alla cifra: il righello
   sbagliava SOLO lì, e sempre nel verso che accusa.
   ⚠️ E forbice larga non bastava a saperlo: il «759k» di Terra aveva forbice
   3,85 ed era vero lo stesso, di 0,02. A dirlo è solo la geometria — ed è per
   questo che la correzione non si poteva fare a metà.
   Adesso inchiostro e fondo si leggono **nello stesso punto fisico** e il
   peggiore si prende su quei punti. Il meccanismo che produceva le accuse
   false, in una riga: **il testo copre solo una parte della retta del
   gradiente**, e il vecchio accoppiamento gli metteva sotto una fermata che
   sta cento pixel più in là.

   Cosa NON si misura, e perché: il testo dentro le immagini e gli SVG (il
   contrasto lì non si legge dal DOM), e il testo nascosto. Le soglie di
   sicurezza e i colori scelti dal fondatore non si toccano: questo banco
   MISURA, non corregge.

   Uso:
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --solo=terra
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --tutti   (elenca anche i promossi)
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --controprova
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --controprova-pulsazione
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --controprova-gradiente
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --lato=2    (i soli angoli, vedi LATO)
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --solo=conti --tutti
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';
/* ⛔ L'APRITORE NON SI RISCRIVE: è quello di `modali-dentro.mjs`, che dal 09/08
   vive in un file suo perché lo usano in due. Vedi `apri-modali.mjs`. */
import { SCEGLI, TOCCA, CHIUDI, DOVE, quanteModaliEsistono } from './apri-modali.mjs';

const chromium = await prendiChromium();
const PORTA = process.argv[2];
const SOLO = (process.argv.find((a) => a.startsWith('--solo=')) || '').slice(7);
const TUTTI = process.argv.includes('--tutti');
/* ⛔ IL TEMA SI SCEGLIE, E FINO AL 07/08 SI MISURAVA SOLO IL BUIO.
   Le app dell'ecosistema hanno TRE temi — `shared/dw-tema.js` gira fra `scuro`,
   `chiaro` e `sole` — e questo banco ne guardava uno. Cioè due terzi di quello
   che un cliente vede non erano misurati da nessuno, e il terzo non misurato
   che pesa di più è proprio `sole`: è il tema fatto per chi legge il telefono
   IN CAVA, sotto il sole, che è il posto dove il prodotto vive.
   ⚠️ Il core è un caso a parte e va detto: non carica `dw-tema.js`, ha un suo
   `applyTheme()` che fa `classList.remove('outdoor-mode')` a ogni giro, e dalla
   v4.4 ha due temi soli (l'outdoor è stato assorbito nel chiaro). Il suo blocco
   `body.outdoor-mode` nel foglio è quindi codice morto — ma la classe NON lo è
   nell'ecosistema, e chi legge solo il core si convince del contrario (è
   successo stanotte, a me).
   Uso: `--tema=chiaro`, `--tema=sole`. Senza, il buio, come è sempre stato. */
const TEMA = (process.argv.find((a) => a.startsWith('--tema=')) || '').slice(7);
const CLASSE_TEMA = { chiaro: 'light-mode', sole: 'outdoor-mode' };
if (TEMA && !CLASSE_TEMA[TEMA]) {
  console.error(`✗ tema sconosciuto: «${TEMA}». Sono ${Object.keys(CLASSE_TEMA).join(', ')} (o niente per il buio).`);
  process.exit(2);
}
/* ⚠️ PERCHÉ QUESTO BANCO HA UNA CONTROPROVA (01/08).
   Misurava 3322 testi e rispondeva «0 sotto soglia» — ed è il banco che fa il
   maggior numero di misure di tutti. Ma niente dimostrava che ne sapesse
   vedere uno: esattamente la posizione in cui si trovava la regola dei dialoghi
   stamattina, che era cieca su gran parte del codice mentre diceva ok.
   Con `--controprova` si appende a ogni superficie una riga di testo a ~1,15:1
   e si pretende che venga bocciata. Se una sola superficie la promuove, lì la
   misura non sta guardando, e il suo «0 sotto soglia» non vale niente. */
const CONTROPROVA = process.argv.includes('--controprova');
const MARCA = 'controprova contrasto';
/* il testimone del verso opposto: scritto con `color-mix()`, leggibilissimo,
   e deve restare FUORI dai bocciati. Nome distinto apposta: se portasse la
   stessa marca del veleno, una sua bocciatura verrebbe contata come «veleno
   preso» e il difetto del righello si nasconderebbe dentro il suo stesso
   controllo. */
const MARCA_MIX = 'testimone color-mix';
/* ⛔ LA CONTROPROVA DELLA TRAPPOLA 4, e serve perché la guardia nuova sul core
   NON SI ACCENDE MAI: le animazioni finite adesso si aspettano, e le infinite
   del core capitano quasi sempre sopra 0,95. Una guardia che non scatta non è
   una guardia provata — è la stessa ragione per cui esiste `--controprova`.
   Qui si appende un testo che FERMO sta benissimo (bianco su `#b71c1c`,
   6,57:1) ma porta un'animazione infinita che lo tiene a `opacity:.5`. Deve
   finire fra i «in pulsazione», MAI fra i bocciati: se viene bocciato, il
   banco sta di nuovo accusando un colore sano. */
const CONTROPULSA = process.argv.includes('--controprova-pulsazione');
/* ⛔ LA CONTROPROVA DEL CENSIMENTO, e serve per la ragione di sempre: una
   guardia scollegata non è un errore di sintassi. Si aggiunge al foglio di
   stile una classe che nel DOM **non compare mai** e che ha un contrasto
   pessimo (grigio su grigio, ~1,15:1). Il censimento deve trovarla, farla
   comparire e bocciarla: se il giro finisce con zero bocciature «mai
   comparse», la passata nuova non sta guardando niente e il suo elenco di
   classi vale zero — esattamente come il «0 sotto soglia» che questo banco
   dava prima di avere `--controprova`. */
const CONTROCENS = process.argv.includes('--controprova-censimento');
const CLASSE_CENS = 'dw-mai-vista-controprova';
const MARCA_PULSA = 'controprova pulsazione';
/* ⛔ LA CONTROPROVA DEL RIGHELLO CO-LOCATO (08/08). La correzione di oggi ha
   tolto delle accuse; una correzione che toglie accuse va provata nel verso
   opposto, se no «meno KO» si legge come «va meglio» e invece vuol dire «guarda
   di meno» — è la stessa forma del fondo sulla copertura, che catturava le
   prove tolte e non il codice aggiunto senza prove.
   Qui si appendono DUE testi con un gradiente vero sotto:
   · uno DAVVERO illeggibile (grigio su un gradiente grigio, sotto 1,5:1 in
     ogni punto): deve essere bocciato — se passa, la geometria sta assolvendo;
   · uno leggibilissimo su un gradiente a 135° con gli estremi lontani (bianco
     su un fondo che va da quasi nero a scuro): NON deve essere bocciato, ed è
     esattamente la famiglia delle quattro accuse false del 07/08. */
const CONTROGRAD = process.argv.includes('--controprova-gradiente');
const MARCA_GRAD_KO = 'controprova gradiente illeggibile';
const MARCA_GRAD_OK = 'controprova gradiente leggibile';
/* il terzo testimone: leggibile ai due capi, illeggibile in mezzo. Nome distinto
   perché è l'unico che gli angoli da soli non sanno prendere, e va contato a parte. */
const MARCA_GRAD_MEZZO = 'controprova gradiente cieco agli angoli';
/* ⛔ QUANTI PUNTI SI GUARDANO DENTRO OGNI RIGA DI TESTO, PER LATO — e il numero
   è stato SCELTO CON LA MISURA, non con un ragionamento.
   `--lato=2` sono i quattro ANGOLI, che è la strada elegante: per un gradiente
   lineare gli estremi della proiezione su un rettangolo stanno agli angoli, e
   sembra che bastino. NON bastano, e la dimostrazione è costruita e permanente
   (`--controprova-gradiente`): fondo grigio uniforme `rgb(117)`, inchiostro dal
   nero al bianco lungo le lettere — ai due capi fa 4,56 e 4,61, **sopra** la
   soglia, e a metà parola fa **1,17**. Quel caso lo promuovevano tutt'e due i
   righelli più semplici, gli angoli e il vecchio accoppiamento a tappeto: il
   minimo del rapporto NON è monotòno, quindi può cadere in mezzo.
   I tre valori misurati sul giro intero (14 superfici, tema scuro), stesso
   commit, stessa macchina:
     · `--lato=2`  → 556 s, e su **548 testi** dà un numero più ALTO del vero;
     · `--lato=9`  → 557 s;
     · `--lato=25` → 564 s (+1,3%), e su **127 testi** ne dà uno più basso di 9,
       fino a 0,14 — nessun verdetto cambiato oggi, ma la differenza è nella
       direzione che conta.
   Siccome venticinque costa l'uno per cento e non poggia su nessuna ipotesi,
   il predefinito è venticinque: la strada che si sa provare batte quella
   elegante. La prova che gli angoli non bastano: `--controprova-gradiente
   --lato=2` DEVE fallire. */
const LATO = Math.max(1, parseInt((process.argv.find((a) => a.startsWith('--lato=')) || '').slice(7), 10) || 25);
/* ⛔ NONA TRAPPOLA, E LA PIÙ GRANDE DI TUTTE PERCHÉ NON ERA UNA TRAPPOLA DEL
   RIGHELLO: ERA UN POSTO DOVE IL RIGHELLO NON ANDAVA MAI. Fino al 09/08 questo
   banco camminava sulle SEZIONI e basta, e `#modal` sta a `display:none` finché
   qualcuno non lo apre — quindi **il contrasto dentro le finestre di dialogo
   non era misurato da nessun banco, in nessuna app, in nessuno dei tre temi**.
   Non si vedeva perché il numero che stampava era vero: «613 testi su Scudo, 0
   sotto soglia» è una risposta esatta a una domanda più stretta di quella che
   sembra. Misurato prima di scrivere una riga: rifacendo lo STESSO cammino e
   chiedendo quanti dei testi misurati stessero dentro `#modal`, la risposta è
   **zero su 1050**; e la stessa domanda, appena una finestra si apre, risponde
   4. Cioè lo zero non era cecità del righello, era il cammino.
   Con `--modali` il banco apre le finestre col gesto di `modali-dentro.mjs` —
   non con un apritore nuovo — e misura SOLO quello che sta dentro `#modal`.
   Il primo giro ha trovato un difetto vero che nessuno aveva mai visto: nel
   core il riquadro «CAVA» di «Nuovo progetto di volata» era bianco su un
   gradiente verde, **3,28:1** dove ne servono 4,5.
   ⚠️ È una passata a parte e non un'aggiunta a quella normale, per una ragione
   misurata: aprire le finestre costa ~13 minuti a tema, e `tutti.mjs` uccide
   una passata che supera la mezz'ora. Sommandola a quella delle sezioni si
   sarebbe perso tutto il banco invece di guadagnare le finestre. */
const MODALI = process.argv.includes('--modali');
/* quante volte si prova la stessa FORMA di comando, e il tetto per sezione:
   gli stessi numeri di `modali-dentro.mjs`, che quel gesto lo ha tarato. */
const PER_FORMA = 2, TETTO = 200;

/* La misura vive nella pagina: si passa una volta sola e si raccoglie tutto il
   testo visibile con il suo contrasto effettivo. */
const MISURA = (LATO) => {
  /* ⛔ SETTIMA TRAPPOLA, E LA PIÙ COSTOSA DI TUTTE: `color(srgb …)`.
     Questa funzione tirava fuori i numeri di una stringa e li trattava come
     0-255. Ma `color-mix()` — che i temi delle app usano per il `--muted` —
     Chromium lo risolve in `color(srgb 0.163608 0.185412 0.0681569)`, con i
     canali da **0 a 1**. Divisi ancora per 255 diventano tutti ~0: inchiostro
     nero, fondo nero, rapporto **1,01:1** su un testo che a occhio è nerissimo
     su bianco e fa più di 15:1.
     Misurato il 07/08 aprendo il tema `sole`: **560 bocciature su 3.646 testi**,
     e la stragrande maggioranza erano questa. Cioè il banco stava per mandare a
     rifare la palette di sei app per un difetto del righello — che è esattamente
     quello che la sua intestazione promette di non fare («un KO va verificato
     come un OK»). L'ha smentito il conto a mano su due elementi: `.note` di
     Terra in `sole` è `color(srgb .16 .19 .07)` su `color(srgb .96 .98 .95)`.
     ⚠️ E LA PRIMA CORREZIONE ERA ANCORA UNA TOPPA, scoperta un'ora dopo
     verificando a mano le 29 bocciature rimaste: in Flotta il fondo effettivo
     torna **`oklab(0.256758 0.0306113 -0.0107834)`** — che nessun foglio scrive,
     e infatti il `grep` sul sorgente dava zero: lo produce il browser
     interpolando. Coi suoi numeri letti come 0-255 il fondo diventa nero, e
     `.rosso` e `.giallo` venivano misurati contro un colore che non esiste.
     Aggiungere `oklab` all'elenco sarebbe stata la terza toppa, e la quarta
     arriverebbe con `oklch` o `display-p3`.
     ⛔ LA REGOLA DI CLAUDE.md È «CALCOLARE UNA COSA CHE IL BROWSER SA DIRE».
     Il browser sa convertire QUALUNQUE colore in sRGB: si dipinge un pixel su
     una tela e lo si rilegge. Non è un'approssimazione — è la stessa
     conversione che fa per dipingere lo schermo, cioè esattamente quello che
     l'utente vede.
     E quando il colore NON lo capisce nemmeno lui, la risposta è `null`: non si
     inventa un numero. Il principio del fondatore vale anche per il righello —
     l'assenza di una misura non è una misura buona né una cattiva, ed è per
     questo che i colori illeggibili si CONTANO e si dichiarano invece di
     finire fra i bocciati. */
  const tela = document.createElement('canvas');
  tela.width = tela.height = 1;
  const pennello = tela.getContext('2d', { willReadFrequently: true });
  const memoria = new Map();
  const num = (c) => {
    if (memoria.has(c)) return memoria.get(c);
    let v = [];
    if (typeof c === 'string' && c && CSS.supports('color', c)) {
      pennello.clearRect(0, 0, 1, 1);
      pennello.fillStyle = c;
      pennello.fillRect(0, 0, 1, 1);
      const d = pennello.getImageData(0, 0, 1, 1).data;
      v = [d[0], d[1], d[2], d[3] / 255];
    }
    memoria.set(c, v);
    return v;
  };
  /* null quando il colore non si e potuto leggere: chi chiama DEVE guardarlo.
     Restituire 0 (nero) sarebbe la bugia comoda, ed e quella che ha prodotto le
     531 bocciature false. */
  const lum = (c) => {
    const v = num(c);
    if (!v.length) return null;
    const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(v[0]) + 0.7152 * f(v[1]) + 0.0722 * f(v[2]);
  };
  /* ════════════════════════════════════════════════════════════════════
     LA GEOMETRIA DEI GRADIENTI (08/08) — che cosa c'è DAVVERO in un punto
     ════════════════════════════════════════════════════════════════════
     Fino a ieri, quando l'inchiostro o il fondo venivano da un gradiente,
     questo banco accoppiava TUTTE le fermate dell'uno con TUTTE quelle
     dell'altro e teneva il minimo: il pixel d'inchiostro più chiaro col pixel
     di fondo più scuro **anche quando stanno agli angoli opposti**, dove non
     si incontrano mai. Il costo, misurato a mano da sei cantieri il 07/08 su
     tutti e 32 i KO delle sei app: **quattro accuse false** — Flotta `.n`
     (3,01 ai pixel contro 2,93 dichiarati), Campo `.n` a 32px (3,15 contro
     2,86), due `.avatar.sup` di Scudo (4,92 e 4,78 contro 3,77). Tutte fra i
     casi a forbice larga; sui casi senza forbice i righelli indipendenti
     davano lo stesso numero alla cifra.
     ⚠️ Ma forbice larga NON voleva dire accusa falsa: il «759k» di Terra
     aveva forbice 3,85 ed era vero lo stesso, perché lì il `.n` copre dal 39%
     all'83% dell'altezza e il gradiente a 135° mette la fermata chiara sopra
     la parte scura del fondo — gli estremi si incontrano davvero. A dirlo è
     solo la geometria, e per questo non si poteva correggere «a metà».
     Adesso inchiostro e fondo si valutano NELLO STESSO PUNTO FISICO, e il
     peggiore si prende su quei punti.

     ⛔ E L'INTERPOLAZIONE NON SI CALCOLA: LA DIPINGE IL BROWSER. La stessa
     regola per cui i colori si leggono da una tela invece di spezzarne la
     stringa. Qui si calcola SOLO la retta del gradiente — che la CSS Images 3
     definisce in tre righe — e il colore lungo quella retta lo dà una rampa
     dipinta. Verificato in scratchpad contro i PIXEL VERI (screenshot): 198
     punti su 22 gradienti (angoli in gradi, parole chiave `to …`, angoli agli
     spigoli, tre fermate non monotone, fermate senza posizione, doppia
     posizione, trasparenza, `color-mix`, `color()`, `oklab`, `oklch`), scarto
     peggiore **2/255** — cioè la quantizzazione della rampa.
     ⚠️ Due cose sono state trovate SOLO da quel confronto, e nessuna delle due
     si vedeva leggendo il codice:
     1. il CSS interpola in alfa PREMOLTIPLICATO e la tela no — 64/255 di
        scarto su un gradiente che finisce trasparente;
     2. se anche UNA fermata non è «legacy» (`rgb()`/`rgba()`, come Chromium
        serializza hex, nomi e `hsl()`), l'interpolazione passa a **oklab** —
        84/255 di scarto. Le palette delle app usano `color-mix()` per il
        `--muted`, quindi non è un caso di laboratorio.
     ⚠️ E la prova che NON distingueva era già scritta: il caso di prova
     `oklab` passava a 2/255 con la rampa sRGB, perché quelle due fermate sono
     vicine di tinta. Passava per il motivo sbagliato — la prima delle cinque
     cause di «non distingue» di CLAUDE.md. */
  const alLivelloAlto = (s, sep) => {
    const out = []; let d = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') d++;
      else if (ch === ')') d--;
      if (ch === sep && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  };
  const ANG = { deg: 1, grad: 0.9, rad: 180 / Math.PI, turn: 360 };
  const leggiAngolo = (t) => {
    const m = /^([-+0-9.eE]+)(deg|grad|rad|turn)$/.exec(t.trim());
    return m ? parseFloat(m[1]) * ANG[m[2]] : null;
  };
  /* LA RETTA DEL GRADIENTE, per la CSS Images 3: passa dal centro della
     scatola, ha direzione (sinA, -cosA) con A misurato da «verso l'alto» in
     senso orario, e lunghezza |w·sinA| + |h·cosA| — cioè esattamente quanto
     basta perché le due fermate estreme tocchino gli angoli. Per le parole
     chiave a due lati (`to bottom right`) la direzione è quella perpendicolare
     alla congiungente dei due angoli vicini. */
  const asseLineare = (dir, w, h) => {
    let dx, dy;
    const a = dir === null ? 180 : leggiAngolo(dir);
    if (a !== null) { const r = a * Math.PI / 180; dx = Math.sin(r); dy = -Math.cos(r); }
    else {
      const m = /^to\s+(.+)$/.exec(dir.trim());
      if (!m) return null;
      let sx = 0, sy = 0;
      for (const l of m[1].trim().split(/\s+/)) {
        if (l === 'left') sx = -1; else if (l === 'right') sx = 1;
        else if (l === 'top') sy = -1; else if (l === 'bottom') sy = 1;
        else return null;
      }
      if (sx && sy) { const n = Math.hypot(h, w); dx = sx * h / n; dy = sy * w / n; }
      else { dx = sx; dy = sy; }
      if (!dx && !dy) return null;
    }
    const L = Math.abs(w * dx) + Math.abs(h * dy);
    if (!(L > 0)) return null;
    return { cx: w / 2, cy: h / 2, dx, dy, L };
  };
  const leggiPos = (t, L) => {
    if (t == null) return null;                 // non dichiarata: la riempie `posizioni`
    const s = t.trim();
    let m = /^([-+0-9.eE]+)%$/.exec(s);
    if (m) return parseFloat(m[1]) / 100;
    m = /^([-+0-9.eE]+)px$/.exec(s);
    if (m) return L > 0 ? parseFloat(m[1]) / L : NaN;
    return NaN;                                 // scritta in un modo che non so leggere
  };
  /* Le posizioni delle fermate con l'algoritmo della specifica: la prima a 0,
     l'ultima a 1, quelle scritte all'indietro portate avanti, le mancanti
     distribuite in parti uguali fra le due dichiarate che le circondano. */
  const posizioni = (grezze, L) => {
    const p = grezze.map((g) => leggiPos(g, L));
    if (p.some((x) => Number.isNaN(x))) return null;
    if (p[0] === null) p[0] = 0;
    if (p[p.length - 1] === null) p[p.length - 1] = 1;
    for (let i = 1; i < p.length; i++) if (p[i] !== null && p[i] < p[i - 1]) p[i] = p[i - 1];
    for (let i = 1; i < p.length - 1; i++) {
      if (p[i] !== null) continue;
      let j = i; while (p[j] === null) j++;
      const a = p[i - 1], b = p[j], n = j - i + 1;
      for (let k = i; k < j; k++) p[k] = a + (b - a) * (k - i + 1) / n;
      i = j - 1;
    }
    return p;
  };
  /* ⛔ ANCHE I RADIALI, E NON PER COMPLETEZZA: SENZA, IL BANCO ACCUSAVA DUE
     COLORI SANI. Prima stesura di oggi: risolti i lineari, i radiali lasciati
     al vecchio «tutte le fermate». Risultato misurato sul giro al buio: **due
     KO nuovi in Genesi**, 4,43 e 4,47 su una soglia di 4,5 — e la verifica ai
     pixel veri (screenshot col testo reso trasparente) dava **5,46 e 5,51**,
     cioè due colori che passano. La causa è geometrica quanto l'altra: gli
     ALONI D'AMBIENTE delle app sono radiali, stanno su un piano `fixed` alto
     quanto la finestra, e quel testo sta a y=1274 — **fuori dall'alone**,
     dove la sua ultima fermata è trasparente e non schiarisce niente. Tenendo
     tutte le fermate, l'alone veniva spalmato a tinta piena su un testo che
     non tocca mai.
     ⚠️ E il vecchio righello era sbagliato **nello stesso verso** (4,83
     contro 5,46): non se n'era accorto nessuno perché per un pelo restava
     sopra la soglia. Un difetto che non fa cadere niente non è un difetto
     assente — è un difetto che aspetta che qualcuno cambi un colore.
     ⚠️ Le posizioni delle fermate in pixel su un'ellisse NON si sanno leggere
     (il raggio di riferimento cambia con la direzione): quel caso si dichiara
     non risolto invece di indovinare. Nel prodotto non c'è — le fermate degli
     aloni sono tutte in percentuale — ma la regola vale per quando ci sarà. */
  const LUNG = (t, rif) => {
    const s = String(t).trim();
    let m = /^([-+0-9.eE]+)px$/.exec(s);
    if (m) return parseFloat(m[1]);
    m = /^([-+0-9.eE]+)%$/.exec(s);
    if (m) return parseFloat(m[1]) / 100 * rif;
    if (s === 'left' || s === 'top') return 0;
    if (s === 'right' || s === 'bottom') return rif;
    if (s === 'center') return rif / 2;
    return null;
  };
  const asseRadiale = (testa, w, h) => {
    const [pre, dopoAt] = String(testa).split(/\s+at\s+/);
    let cerchio = false, chiave = null;
    const misure = [];
    for (const t of (pre || '').trim().split(/\s+/).filter(Boolean)) {
      if (t === 'circle') { cerchio = true; continue; }
      if (t === 'ellipse') continue;
      if (/^(closest|farthest)-(side|corner)$/.test(t)) { chiave = t; continue; }
      misure.push(t);
    }
    /* il centro */
    let cx = w / 2, cy = h / 2;
    if (dopoAt) {
      const q = dopoAt.trim().split(/\s+/);
      if (q.length > 2) return null;
      const a = LUNG(q[0], w), b2 = q.length > 1 ? LUNG(q[1], h) : h / 2;
      if (a === null || b2 === null) return null;
      cx = a; cy = b2;
    }
    let rx, ry;
    if (misure.length === 2) {
      rx = LUNG(misure[0], w); ry = LUNG(misure[1], h);
    } else if (misure.length === 1) {
      /* un raggio solo = cerchio, e il CSS lì non ammette percentuali */
      const v = /%$/.test(misure[0]) ? null : LUNG(misure[0], 0);
      rx = ry = v;
    } else {
      /* nessuna misura: vale la parola chiave, e se manca è `farthest-corner` */
      const k = chiave || 'farthest-corner';
      const dxV = [Math.abs(cx), Math.abs(w - cx)], dyV = [Math.abs(cy), Math.abs(h - cy)];
      const vicino = k.startsWith('closest');
      const sx = vicino ? Math.min(...dxV) : Math.max(...dxV);
      const sy = vicino ? Math.min(...dyV) : Math.max(...dyV);
      if (k.endsWith('side')) {
        if (cerchio) { rx = ry = vicino ? Math.min(sx, sy) : Math.max(sx, sy); } else { rx = sx; ry = sy; }
      } else if (cerchio) {
        rx = ry = Math.hypot(sx, sy);
      } else {
        /* l'ellisse dell'angolo ha lo stesso rapporto di quella dei lati e ci
           passa attraverso: si scala della quantità che porta l'angolo su t=1 */
        /* stesso rapporto dell'ellisse dei lati, e passa per l'angolo: se
           rx = k·sx e ry = k·sy, l'angolo (sx,sy) sta su t=1 quando 2/k² = 1,
           cioè k = √2 */
        rx = sx * Math.SQRT2; ry = sy * Math.SQRT2;
      }
    }
    if (rx === null || ry === null || !(rx > 0) || !(ry > 0)) return null;
    return { radiale: true, cx, cy, rx, ry };
  };
  /* ⛔ IL COLORE SI STACCA CONTANDO LE PARENTESI, NON CON UN'ESPRESSIONE
     GOLOSA. La prima stesura usava `[a-zA-Z-]+\([^]*\)`, e su una fermata
     scritta `rgb(0, 0, 0) calc(25% + 1px)` — la forma delle tacche sulle barre
     — il golosone si prendeva ANCHE la posizione, che quindi spariva: la
     fermata finiva a un posto che non è il suo e nessuno se ne accorgeva,
     perché il livello continuava a dirsi «risolto». È la famiglia del
     tokenizzatore che perde la fase, in miniatura. */
  const staccaColore = (pezzo) => {
    const s = String(pezzo).trim();
    const m = /^[a-zA-Z-]+\(/.exec(s);
    if (m) {
      let d = 0, i = 0;
      for (; i < s.length; i++) {
        if (s[i] === '(') d++;
        else if (s[i] === ')') { d--; if (!d) { i++; break; } }
      }
      if (d !== 0) return null;
      return [s.slice(0, i), s.slice(i).trim()];
    }
    const n = /^(#[0-9a-fA-F]+|[a-zA-Z]+)\s*(.*)$/.exec(s);
    return n ? [n[1], n[2].trim()] : null;
  };
  const LEGACY = /^rgba?\(/i;
  const rampaDi = (fermate, pos) => {
    const N = 256;
    const val = fermate.map(num);
    if (val.some((v) => !v.length)) return null;
    if (fermate.every((f) => LEGACY.test(f.trim()))) {
      const c = document.createElement('canvas'); c.width = N; c.height = 2;
      const g = c.getContext('2d', { willReadFrequently: true });
      try {
        /* riga 0 = RGB·α, riga 1 = α: così l'interpolazione della tela, che è
           NON premoltiplicata, diventa quella premoltiplicata del CSS */
        for (let riga = 0; riga < 2; riga++) {
          const lg = g.createLinearGradient(0, 0, N, 0);
          for (let i = 0; i < fermate.length; i++) {
            const v = val[i], a = v.length > 3 ? v[3] : 1;
            lg.addColorStop(Math.min(1, Math.max(0, pos[i])), riga === 0
              ? `rgb(${v[0] * a}, ${v[1] * a}, ${v[2] * a})`
              : `rgb(${255 * a}, ${255 * a}, ${255 * a})`);
          }
          g.fillStyle = lg; g.fillRect(0, riga, N, 1);
        }
      } catch (e) { return null; }
      return g.getImageData(0, 0, N, 2).data;
    }
    /* almeno una fermata non legacy: il gradiente interpola in oklab, e
       `color-mix(in oklab, …)` è la stessa interpolazione — di nuovo il
       browser, non un conto mio */
    const dati = new Uint8ClampedArray(N * 8);
    for (let k = 0; k < N; k++) {
      const t = k / (N - 1);
      let i = 0;
      while (i < pos.length - 2 && t > pos[i + 1]) i++;
      const larg = pos[i + 1] - pos[i];
      const f = larg > 0 ? Math.min(1, Math.max(0, (t - pos[i]) / larg)) : (t < pos[i] ? 0 : 1);
      const v = num(`color-mix(in oklab, ${fermate[i + 1]} ${f * 100}%, ${fermate[i]})`);
      if (!v.length) return null;
      const a = v.length > 3 ? v[3] : 1;
      dati[k * 4] = v[0] * a; dati[k * 4 + 1] = v[1] * a; dati[k * 4 + 2] = v[2] * a;
      dati[N * 4 + k * 4] = a * 255;
    }
    return dati;
  };
  /* la stessa classe torna su decine di elementi: un gradiente si legge una
     volta per (testo, larghezza, altezza), non trecento */
  const memLiv = new Map();
  const leggiLivello = (testo, w, h) => {
    const chiave = `${testo}|${Math.round(w)}|${Math.round(h)}`;
    if (memLiv.has(chiave)) return memLiv.get(chiave);
    const r = leggiLivello0(testo, w, h);
    memLiv.set(chiave, r);
    return r;
  };
  const leggiLivello0 = (testo, w, h) => {
    const m = /^(repeating-)?(linear|radial|conic)-gradient\((.*)\)$/s.exec(testo.trim());
    if (!m) return null;
    /* i RIPETUTI e i CONICI non si risolvono: si dichiarano, e chi chiama
       torna al vecchio «tutte le fermate» — il caso peggiore, la direzione
       prudente — invece di inventare una geometria che non ho scritto. */
    if (m[1] || m[2] === 'conic') return { risolto: false };
    const pezzi = alLivelloAlto(m[3], ',');
    if (pezzi.length < 2) return { risolto: false };
    let dir = null, primo = 0;
    let asse;
    if (m[2] === 'radial') {
      /* nel radiale la testa c'è quasi sempre («260px 150px at 8% 0%») ma può
         mancare del tutto: si riconosce dal fatto che non è un colore */
      if (!/^(?:[a-zA-Z-]+\()/.test(pezzi[0]) && !/^#/.test(pezzi[0])
          && (/\bat\b/.test(pezzi[0]) || /(px|%|circle|ellipse|closest|farthest)/.test(pezzi[0]))) {
        dir = pezzi[0]; primo = 1;
      }
      asse = asseRadiale(dir === null ? '' : dir, w, h);
    } else {
      if (/^to\s/.test(pezzi[0]) || leggiAngolo(pezzi[0]) !== null) { dir = pezzi[0]; primo = 1; }
      asse = asseLineare(dir, w, h);
    }
    if (!asse) return { risolto: false };
    const fermate = [], grezze = [];
    for (let i = primo; i < pezzi.length; i++) {
      const mc = staccaColore(pezzi[i]);
      if (!mc) return { risolto: false };
      if (!mc[1]) { fermate.push(mc[0]); grezze.push(null); continue; }
      /* UNA o DUE posizioni: la forma a doppia posizione (`#f00 0% 50%`) è uno
         stacco netto, e le app la usano nelle barre. Tre pezzi vuol dire un
         `calc()` spezzato dagli spazi, e allora si dichiara invece di leggerlo
         a metà. */
      const due = mc[1].split(/\s+/);
      if (due.length > 2) return { risolto: false };
      for (const d of due) { fermate.push(mc[0]); grezze.push(d); }
    }
    if (fermate.length < 2) return { risolto: false };
    /* su un'ellisse una fermata in PIXEL non si sa collocare: il raggio di
       riferimento cambia con la direzione. Si dichiara invece di indovinare. */
    if (asse.radiale && grezze.some((g) => g && /px$/.test(String(g).trim()))) return { risolto: false };
    const pos = posizioni(grezze, asse.radiale ? 0 : asse.L);
    if (!pos) return { risolto: false };
    const rampa = rampaDi(fermate, pos);
    if (!rampa) return { risolto: false };
    return { risolto: true, asse, rampa };
  };
  /* Il colore di un livello risolto nel punto (px,py) RELATIVO alla sua
     scatola. Fuori dalla retta il CSS tiene la fermata estrema: `clamp`. */
  const coloreNelPunto = (liv, px, py) => {
    const g = liv.asse;
    /* nel radiale il parametro è la distanza dal centro misurata in raggi:
       t = 1 sul bordo dell'ellisse, e oltre vale l'ultima fermata */
    let t = g.radiale
      ? Math.hypot((px - g.cx) / g.rx, (py - g.cy) / g.ry)
      : 0.5 + ((px - g.cx) * g.dx + (py - g.cy) * g.dy) / g.L;
    t = Math.min(1, Math.max(0, t));
    const i = Math.round(t * 255) * 4;
    const d = liv.rampa;
    const a = d[1024 + i] / 255;                // riga 1 della rampa: l'alfa interpolato
    if (a <= 0) return 'rgba(0, 0, 0, 0)';
    /* dividere per un alfa piccolo può portare un canale oltre 255 per pura
       arrotondatura: si limita, se no `lum` eleva un numero maggiore di 1 e
       restituisce una luminosità che non esiste */
    const q = (k) => Math.min(255, d[i + k] / a);
    const v = [q(0), q(1), q(2)];
    const str = `rgba(${v[0]}, ${v[1]}, ${v[2]}, ${a})`;
    if (!memoria.has(str)) memoria.set(str, [v[0], v[1], v[2], a]);
    return str;
  };

  /* IL FONDO VERO SI COMPONE, NON SI SCEGLIE. Terza volta che questa misura
     accusa il prodotto a torto: prendendo il primo `background-image` incontrato
     risalendo, gli ALONI D'AMBIENTE — gradienti quasi trasparenti come
     `rgba(255,171,0,.08)`, che nel prodotto sono luce, non fondo — venivano
     letti come tinta piena. Risultato: 183 bocciature su 228 in Genesi, su una
     pagina che si legge benissimo. Adesso si parte dal fondo della pagina e si
     spalmano sopra, uno per uno, tutti gli strati fino al testo, ciascuno con la
     sua trasparenza. Dove il gradiente si sa risolvere si prende il suo colore
     NEL PUNTO; dove no, si tengono tutte le sue fermate come candidati e vince
     il caso peggiore. */
  const mescola = (sopra, sotto) => {
    const f = num(sopra), s = num(sotto);
    if (!f.length) return sotto;
    const a = f.length > 3 ? f[3] : 1;
    if (a === 0) return sotto;
    if (a === 1) return `rgb(${f[0]}, ${f[1]}, ${f[2]})`;
    const m = (i) => Math.round(a * f[i] + (1 - a) * s[i]);
    const v = [m(0), m(1), m(2)];
    const str = `rgb(${v[0]}, ${v[1]}, ${v[2]})`;
    /* il valore è già calcolato: seminarlo nella memoria dei colori risparmia
       una tela per ogni punto della griglia, che è quello che rende
       sostenibile guardare 625 punti invece di uno */
    if (!memoria.has(str)) memoria.set(str, [v[0], v[1], v[2], 1]);
    return str;
  };
  /* La scatola su cui si posa un gradiente: `background-origin`, che per
     difetto è il riquadro dell'imbottitura. */
  const scatolaSfondo = (nodo, cs) => {
    const r = nodo.getBoundingClientRect();
    const o = cs.backgroundOrigin || 'padding-box';
    let l = 0, t = 0, rr = 0, bb = 0;
    if (o !== 'border-box') {
      l += parseFloat(cs.borderLeftWidth) || 0; t += parseFloat(cs.borderTopWidth) || 0;
      rr += parseFloat(cs.borderRightWidth) || 0; bb += parseFloat(cs.borderBottomWidth) || 0;
    }
    if (o === 'content-box') {
      l += parseFloat(cs.paddingLeft) || 0; t += parseFloat(cs.paddingTop) || 0;
      rr += parseFloat(cs.paddingRight) || 0; bb += parseFloat(cs.paddingBottom) || 0;
    }
    return { x: r.left + l, y: r.top + t, w: Math.max(0, r.width - l - rr), h: Math.max(0, r.height - t - bb) };
  };
  /* Gli strati di sfondo di un nodo, dal primo dichiarato (che sta SOPRA) in
     giù. Uno strato o è risolto geometricamente, o dichiara di non esserlo. */
  const stratiDi = (nodo, cs) => {
    const bi = cs.backgroundImage;
    if (!bi || bi === 'none') return [];
    const livelli = alLivelloAlto(bi, ',');
    const dim = alLivelloAlto(cs.backgroundSize || '', ',');
    const pos = alLivelloAlto(cs.backgroundPosition || '', ',');
    const att = alLivelloAlto(cs.backgroundAttachment || '', ',');
    const box = scatolaSfondo(nodo, cs);
    const out = [];
    for (let i = 0; i < livelli.length; i++) {
      if (livelli[i] === 'none') continue;
      /* con una dimensione, una posizione o un ancoraggio non predefiniti la
         scatola del gradiente non è quella dell'elemento: non la so calcolare
         e lo dico (è il caso dello scheletro di caricamento, `400% 100%`) */
      const semplice = /^(auto|auto auto)$/.test((dim[i % Math.max(1, dim.length)] || 'auto').trim())
        && /^0%\s+0%$/.test((pos[i % Math.max(1, pos.length)] || '0% 0%').trim())
        && (att[i % Math.max(1, att.length)] || 'scroll').trim() === 'scroll';
      const liv = semplice ? leggiLivello(livelli[i], box.w, box.h) : null;
      if (liv && liv.risolto) { out.push({ risolto: true, asse: liv.asse, rampa: liv.rampa, box }); continue; }
      const fermate = livelli[i].match(/(?:rgba?|hsla?|color|oklab|oklch|lab|lch|hwb)\([^)]*\)/g);
      if (!fermate || !fermate.length) continue;
      window.__dwNonRisolti = (window.__dwNonRisolti || 0) + 1;
      (window.__dwNonRisoltiQuali = window.__dwNonRisoltiQuali || new Set()).add(livelli[i].slice(0, 46));
      out.push({ risolto: false, fermate });
    }
    return out;
  };
  /* LA PILA degli sfondi, dalla radice al testo, con gli stili letti UNA VOLTA
     SOLA: senza questo ogni punto della griglia rifarebbe tutta la salita, e
     `getComputedStyle` è la cosa più cara che ci sia qui dentro. */
  const pilaDi = (el) => {
    const catena = [];
    for (let a = el; a; a = a.parentElement) catena.push(a);
    const pila = [];
    for (let i = catena.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(catena[i]);
      /* Un antenato con `background-clip:text` NON dipinge nessuno sfondo: il
         suo colore è ritagliato sulle proprie lettere. Contandolo come fondo,
         un `<small>` dentro un numero a gradiente risultava a 1,25:1 su una
         scheda che si legge benissimo. È la quarta volta che questa misura
         accusa il prodotto al posto di sé stessa. */
      if ((cs.webkitBackgroundClip || cs.backgroundClip) === 'text' && catena[i] !== el) continue;
      pila.push({ colore: cs.backgroundColor, strati: stratiDi(catena[i], cs) });
    }
    return pila;
  };
  /* Gli strati si dipingono dal fondo verso l'alto: l'ULTIMO dichiarato sta
     sotto. Un livello risolto dà un colore solo — quello che c'è lì; uno non
     risolto continua a dare tutte le sue fermate, e il caso peggiore vince. */
  const sopraGliStrati = (strati, base, x, y) => {
    let cand = [base];
    for (let k = strati.length - 1; k >= 0; k--) {
      const s = strati[k], nuovi = [];
      for (const c of cand) {
        if (s.risolto) nuovi.push(mescola(coloreNelPunto(s, x - s.box.x, y - s.box.y), c));
        else for (const t of s.fermate) nuovi.push(mescola(t, c));
      }
      cand = nuovi.length > 12 ? nuovi.slice(0, 12) : nuovi;
    }
    return cand;
  };
  const sfondiNelPunto = (pila, x, y) => {
    let fondi = ['rgb(0, 0, 0)'];               // sotto tutto c'è il nero della finestra
    for (const p of pila) {
      const prossimi = new Set();
      for (const f of fondi) for (const c of sopraGliStrati(p.strati, mescola(p.colore, f), x, y)) prossimi.add(c);
      fondi = [...prossimi].slice(0, 12);       // basta: oltre si moltiplicano senza dire di più
    }
    return fondi;
  };
  /* ⛔ I PUNTI SI PRENDONO SULLE RIGHE DI TESTO, NON SUL RETTANGOLO
     D'INGOMBRO. Un elemento in linea che va a capo ha un rettangolo che
     comprende spazio dove non c'è nessuna lettera — e misurare il fondo lì
     vuol dire accusare un colore che il testo non tocca, cioè rifare la stessa
     famiglia di errore che questo cantiere esiste per togliere. Il `Range` sui
     nodi di testo dà i riquadri delle righe VERE, che è la cosa che il browser
     sa dire (CLAUDE.md l'ha già imparato sul traboccamento del core). */
  const righeDi = (el) => {
    let a = null, b = null;
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { if (!a) a = n; b = n; }
    if (a) {
      try {
        const r = document.createRange();
        r.setStart(a, 0); r.setEnd(b, b.textContent.length);
        const rr = [...r.getClientRects()].filter((x) => x.width >= 1 && x.height >= 1);
        if (rr.length) return rr.slice(0, 4);   // quattro righe bastano: oltre si ripete
      } catch (e) { /* si ripiega sul rettangolo d'ingombro */ }
    }
    return [el.getBoundingClientRect()];
  };
  const puntiDi = (righe, n) => {
    const out = [];
    for (const r of righe) {
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        out.push([r.left + (n === 1 ? 0.5 : i / (n - 1)) * r.width,
                  r.top + (n === 1 ? 0.5 : j / (n - 1)) * r.height]);
      }
    }
    return out;
  };
  const opacitaEreditata = (el) => {
    let o = 1, a = el;
    while (a && a !== document.documentElement) { o *= parseFloat(getComputedStyle(a).opacity || '1'); a = a.parentElement; }
    return o;
  };
  /* L'opacità la può muovere un ANTENATO, quindi si risale come per
     `opacitaEreditata`. E si guardano i fotogrammi veri (`getKeyframes`), non
     il nome dell'animazione: `pulseDanger` dice tutto e `scrFade` niente, ma
     l'unica cosa che conta è se fra i fotogrammi c'è `opacity`. */
  const pulsaOpacita = (el) => {
    let a = el;
    while (a && a !== document.documentElement) {
      if (typeof a.getAnimations === 'function') {
        for (const an of a.getAnimations()) {
          if (an.playState !== 'running') continue;
          let k = [];
          try { k = an.effect.getKeyframes(); } catch (e) { continue; }
          if (k.some((f) => f.opacity !== undefined)) return true;
        }
      }
      a = a.parentElement;
    }
    return false;
  };
  /* L'antenato che dipinge davvero questo testo: il primo, risalendo, che si
     ritaglia il fondo sulle proprie lettere. */
  const antenatoRitagliato = (el) => {
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const c = getComputedStyle(a);
      if ((c.webkitBackgroundClip || c.backgroundClip) === 'text') return a;
    }
    return null;
  };
  /* «il mio inchiostro è trasparente E qualcuno sopra di me si ritaglia il
     fondo sulle lettere» — le due condizioni insieme, perché l'una senza
     l'altra non vuol dire niente: un testo trasparente sotto un antenato
     normale è testo invisibile davvero, e va misurato (e bocciato). */
  const ritagliatoDaSopra = (el) => {
    const c = getComputedStyle(el);
    const f = num(c.webkitTextFillColor || c.color || '');
    const alfa = f.length > 3 ? f[3] : 1;
    return alfa === 0 && !!antenatoRitagliato(el);
  };
  /* «spento» vuol dire inattivo per davvero, non «sembra chiaro»: o l'elemento
     stesso è disabilitato, o lo è un antenato (un `<fieldset disabled>` spegne
     tutto quello che contiene), oppure lo dichiara `aria-disabled`. */
  const spento = (el) => {
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      if (a.disabled === true) return true;
      if (a.getAttribute && a.getAttribute('aria-disabled') === 'true') return true;
    }
    return false;
  };
  const composto = (fg, sf, op) => {
    const f = num(fg), s = num(sf);
    const alfa = (f.length > 3 ? f[3] : 1) * op;
    const m = (i) => Math.round(alfa * f[i] + (1 - alfa) * s[i]);
    const v = [m(0), m(1), m(2)];
    const str = `rgb(${v[0]}, ${v[1]}, ${v[2]})`;
    if (!memoria.has(str)) memoria.set(str, [v[0], v[1], v[2], 1]);
    return str;
  };
  const rapporto = (f, s) => {
    const a = lum(f), b = lum(s);
    if (a === null || b === null) return null;   // non misurabile, non «zero»
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const out = [];
  /* ⛔ L'INSIEME SU CUI GIRA È UNA VARIABILE, E SERVE A UNA COSA SOLA: guardare
     DENTRO UNA FINESTRA APERTA (`--modali`, dal 09/08). Senza `window.__dwAmbito`
     resta `'body *'`, cioè esattamente quello che questo banco ha sempre fatto.
     La ragione per cui il righello NON si riscrive più stretto: dentro una
     modale il fondo vero è la pila degli antenati (velo, riquadro, pagina), e
     tutta la geometria dei gradienti qui sotto serve identica. Una seconda
     copia «per le modali» sarebbe la copia debole che questo repository paga
     più cara — e divergerebbe al primo gradiente nuovo. */
  document.querySelectorAll(window.__dwAmbito || 'body *').forEach((el) => {
    /* solo le foglie che contengono testo proprio: prendendo anche i
       contenitori si misurerebbe più volte lo stesso testo, e con lo sfondo
       sbagliato */
    const proprio = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!proprio) return;
    /* EMOJI E SIMBOLI NON SI DIPINGONO CON `color`: il carattere porta i propri
       colori, e misurarli contro il fondo dava «📋 a 2,76:1» su icone che si
       vedono benissimo. Se non c'è nemmeno una lettera o una cifra, non è testo
       da leggere: è un disegno. */
    if (!/[\p{L}\p{N}]/u.test(proprio)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const op = opacitaEreditata(el);
    if (op < 0.06) return;                      // praticamente non si vede: non è testo
    /* ⛔ E QUELLO CHE STA SFUMANDO NON SI MISURA, SI CONTA. Il toast del core
       ha `transition:all .3s` sull'opacità: preso a metà dissolvenza dava
       **1,45:1** su un testo che a schermo pieno ne fa più di otto — cioè una
       bocciatura su un colore che nessuno vede mai così. Non è un difetto del
       prodotto ed è sbagliato spegnerlo in silenzio: si dichiara. La soglia è
       0,95 perché sotto quella l'elemento sta ancora arrivando o andandosene. */
    /* ⛔ QUELLO CHE PULSA SI CONTA PER PRIMO, ed è un caso diverso dalla
       dissolvenza: la dissolvenza passa, la pulsazione no. `pulseDanger` e
       `pulseSync` scendono a .6 e ci tornano ogni secondo e mezzo, per sempre;
       misurare lì dentro è tirare a sorte. Le animazioni FINITE non arrivano
       fin qui, perché il banco le aspetta prima di misurare. */
    if (op < 0.95 && pulsaOpacita(el)) { window.__dwPulsanti = (window.__dwPulsanti || 0) + 1; return; }
    /* ⚠️ E LA DURATA VA GUARDATA, se no questa riga scarta tutto. Il valore
       INIZIALE di `transition-property` è `all`, quindi un `div` qualunque che
       non transisce niente rispondeva `all` e finiva fra le dissolvenze: la
       guardia della trappola 2 scartava OGNI testo sotto 0,95 di opacità,
       compresi quelli con un `opacity` statico — cioè proprio i casi della
       trappola 3, che questo banco dice di misurare. Un'esclusione più larga
       della sua ragione è un'esclusione che assolve. Misurato il 03/08
       montando la controprova della pulsazione: il veleno finiva fra le
       dissolvenze (10 → 27) e la prova nuova non provava niente. */
    if (op < 0.95 && /opacity|all/.test(cs.transitionProperty || '')
        && parseFloat(cs.transitionDuration || '0') > 0) { window.__dwSfumati = (window.__dwSfumati || 0) + 1; return; }
    /* ⛔ TRAPPOLA 6 — I COMANDI SPENTI NON HANNO UNA SOGLIA. La WCAG 1.4.3
       esclude esplicitamente il testo «che fa parte di un componente
       d'interfaccia inattivo»: un bottone disabilitato è più chiaro APPOSTA,
       perché è così che si vede che non si può premere. Qui `.dw-btn:disabled`
       porta `opacity:.6`, e il banco bocciava «Salva preventivo» a 2,9:1 in
       Conti — su un bottone che al momento della misura era spento perché il
       modulo era vuoto. Correggerne il colore avrebbe fatto sembrare premibile
       una cosa che non lo è: il rimedio sbagliato era peggio del difetto
       inesistente. Si conta e si dichiara, come tutto il resto. */
    if (spento(el)) { window.__dwSpenti = (window.__dwSpenti || 0) + 1; return; }
    const dim = parseFloat(cs.fontSize);
    const grande = dim >= 24 || (dim >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    /* TESTO DIPINTO COL GRADIENTE (`background-clip:text`). Lì `color` è
       trasparente e la tinta del testo È il gradiente dell'elemento: leggendo
       `color` si misura il nulla contro sé stesso e viene 1:1 su cifre che sullo
       schermo si leggono benissimo. Il colore lo danno le fermate del gradiente,
       lo sfondo lo dà l'antenato. Trovato su diciannove numeri di Terra: la
       misura accusava il prodotto, come tante altre volte. */
    /* IL TESTO DENTRO UN SVG si dipinge con `fill`, non con `color`: leggendo
       `color` si misura un colore ereditato che sullo schermo non c'è. È così
       che «µg/m³» dentro un grafico risultava a 1,25:1. */
    const dentroSvg = el.ownerSVGElement || el.tagName.toLowerCase() === 'svg';
    const ritaglio = cs.webkitBackgroundClip || cs.backgroundClip;
    let pila, inkFisso = null, inkStrati = null;
    if (dentroSvg) {
      const f = cs.fill;
      if (!f || f === 'none') return;
      inkFisso = [f];
      pila = pilaDi(el.ownerSVGElement ? el.ownerSVGElement.parentElement || el : el);
    } else if (ritaglio === 'text') {
      const st = stratiDi(el, cs);
      if (!st.length) return;
      inkStrati = st;
      pila = pilaDi(el.parentElement || document.body);
    } else if (ritagliatoDaSopra(el)) {
      /* ⛔ TRAPPOLA 5, ED È LA 1 UN PIANO PIÙ SOTTO. Il ramo qui sopra prende
         il caso dell'elemento che ha lui il `background-clip:text`. Ma
         l'unità di misura sta DENTRO il numero (`<span class="n">12<span
         class="u">gg</span></span>`): il suo `background-clip` non è `text`,
         il suo inchiostro è trasparente perché lo eredita, e chi la dipinge è
         il gradiente dell'ANTENATO. Leggendo `color` si misurava il nulla
         contro sé stesso e veniva **esattamente 1:1** — lo stesso identico
         sintomo che il commento del ramo sopra racconta come già risolto, su
         un elemento diverso. Un 1:1 tondo non è un colore: è una misura che
         non ha trovato l'inchiostro.
         Il modo di riconoscerlo è il colore trasparente, non il nome della
         classe: `-webkit-text-fill-color` a alfa zero. */
      const su = antenatoRitagliato(el);
      const st = stratiDi(su, getComputedStyle(su));
      if (!st.length) return;
      inkStrati = st;
      pila = pilaDi(su.parentElement || document.body);
    } else {
      inkFisso = [cs.color];
      pila = pilaDi(el);
    }
    /* ⛔ LA GRIGLIA SI PAGA SOLO DOVE SERVE. Se nessuno strato — né del fondo
       né dell'inchiostro — è un gradiente risolto, il colore non cambia da un
       punto all'altro del testo: un punto solo dà lo stesso identico numero
       della griglia intera, e il banco resta veloce come prima sui testi che
       stanno su una tinta piena. */
    const varia = (inkStrati && inkStrati.some((s) => s.risolto))
      || pila.some((p) => p.strati.some((s) => s.risolto));
    if (varia) window.__dwConGriglia = (window.__dwConGriglia || 0) + 1;
    const punti = puntiDi(varia ? righeDi(el) : [r], varia ? LATO : 1);
    out.push({
      testo: proprio.slice(0, 40),
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
      dim, grande, soglia: grande ? 3 : 4.5, punti: punti.length, varia,
      /* ⛔ i null NON entrano nel minimo: `Math.min` li tratterebbe come zero,
         cioe come il contrasto peggiore possibile, ed e esattamente la bugia
         comoda che ha prodotto 531 bocciature false. Se NESSUNA coppia si e
         potuta leggere, il rapporto e `null` e chi legge lo dichiara. */
      ...(() => {
        let peggio = Infinity, meglio = -Infinity, viste = 0;
        for (const [x, y] of punti) {
          for (const sf of sfondiNelPunto(pila, x, y)) {
            const inchiostri = inkFisso || sopraGliStrati(inkStrati, sf, x, y);
            for (const inc of inchiostri) {
              const v = rapporto(composto(inc, sf, op), sf);
              if (v === null || !Number.isFinite(v)) continue;
              viste++;
              if (v < peggio) peggio = v;
              if (v > meglio) meglio = v;
            }
          }
        }
        if (!viste) return { rapporto: null, forbice: 0 };
        return {
          rapporto: Math.round(peggio * 100) / 100,
          /* ⛔ LA FORBICE HA CAMBIATO SIGNIFICATO, E SI TIENE (08/08).
             Fino a ieri misurava l'ampiezza del DUBBIO del righello: quanto
             distavano fra loro accoppiamenti di fermate che in parte non si
             incontrano mai. Quel dubbio non c'è più — inchiostro e fondo si
             leggono adesso nello stesso punto fisico — e la riga «verifica a
             mano prima di toccare il colore» sarebbe diventata una bugia
             comoda, del tipo che questo file ha già pagato altre volte.
             Adesso misura una cosa del PRODOTTO, non del banco: **di quanto
             il contrasto cambia da un capo all'altro delle lettere**. Una
             forbice larga vuol dire che il testo sta a cavallo di un
             gradiente, cioè che una parte della parola si legge molto meglio
             dell'altra; il numero riportato resta il capo peggiore, perché è
             quello che decide se una parola si legge tutta.
             ⚠️ Su un testo senza nessun gradiente risolto la forbice è **zero
             per costruzione** (si guarda un punto solo): lì non dice niente, e
             infatti non viene stampata. */
          forbice: Math.round((meglio - peggio) * 100) / 100,
        };
      })(),
    });
  });
  return out;
};

/* ⛔ LE ANIMAZIONI FINITE SI ASPETTANO, NON SI INDOVINANO. Un `waitForTimeout`
   fisso è una scommessa sulla macchina: sotto carico — e qui i cantieri
   paralleli ci sono sempre — scade prima che la schermata abbia finito di
   comparire, e allora si misura il prodotto a metà dissolvenza. Si aspetta
   `Animation.finished` di quelle che finiscono davvero; le infinite le
   dichiara la guardia dentro la misura. Il tetto c'è perché un'animazione può
   essere sostituita mentre la si aspetta, e allora `finished` non arriva mai. */
/* ⛔ LE ANIMAZIONI FINITE SI PORTANO ALLA FINE, NON SI ASPETTANO — e la
   differenza l'ha stabilita una misura, non un ragionamento.
   Prima stesura: si aspettava `Animation.finished`. Isolato funzionava; il giro
   completo rimetteva **cinque KO** (quattro colori del core e una cifra di
   Conti) sullo stesso identico commit, e senza stampare nessuna riga di attesa
   scaduta. Il numero che l'ha spiegato è un altro: nel giro le animazioni
   dichiarate «in pulsazione» erano **zero**, isolate **diciassette**.
   La ragione: nel giro le pagine stanno in secondo piano, e lì Chromium
   **non fa avanzare le animazioni**. Non è che partano tardi — non partono. Un
   elemento con `scrFade` resta fermo sul suo `from{opacity:0}` per sempre, e
   `getAnimations()` non ha niente da restituire. Aspettare qualcosa che non
   parte è aspettare a vuoto, ed è per questo che la prima correzione (due
   `requestAnimationFrame` prima di chiedere) è stata **provata e scartata**:
   la sua controprova rispondeva onestamente «non distingue».
   `finish()` non dipende dal fatto che l'animazione stia girando: la porta al
   suo ultimo fotogramma, che è lo stato in cui l'utente vede la pagina ferma.
   Le infinite non si toccano — non hanno una fine — e restano dichiarate dalla
   guardia della trappola 4. */
const fermaAnimazioni = (p) => p.evaluate(() => {
  let finite = 0, infinite = 0;
  for (const a of document.getAnimations()) {
    let t; try { t = a.effect && a.effect.getComputedTiming(); } catch (e) { continue; }
    if (t && t.iterations === Infinity) { infinite++; continue; }
    try { a.finish(); finite++; } catch (e) {}
  }
  return { finite, infinite };
}).catch(() => ({ finite: 0, infinite: 0 }));

/* ⛔ E `finish()` HA UNA PROVA SUA, che la vecchia attesa non poteva avere:
   si mette un elemento con un'animazione CSS che parte da `opacity:0`, si legge
   l'opacità PRIMA e DOPO, e si pretende che dopo valga 1. Non dipende dal fatto
   che l'animazione stia girando — che è esattamente il punto. */
const provaFinish = (p) => p.evaluate(() => {
  const st = document.createElement('style');
  st.textContent = '@keyframes dwProvaAtt{from{opacity:0}to{opacity:1}} .dw-prova-att{animation:dwProvaAtt 30s linear}';
  document.head.appendChild(st);
  const d = document.createElement('div');
  d.setAttribute('style', 'position:fixed;left:-9999px;width:10px;height:10px');
  document.body.appendChild(d);
  d.className = 'dw-prova-att';
  const prima = parseFloat(getComputedStyle(d).opacity);
  for (const a of document.getAnimations()) {
    let t; try { t = a.effect && a.effect.getComputedTiming(); } catch (e) { continue; }
    if (t && t.iterations === Infinity) continue;
    try { a.finish(); } catch (e) {}
  }
  const dopo = parseFloat(getComputedStyle(d).opacity);
  d.remove(); st.remove();
  return { prima, dopo };
});

/* ⛔ LA SECONDA DOMANDA: «E QUELLO CHE ADESSO NON SI DIPINGE?» (06/08)
   ═══════════════════════════════════════════════════════════════════════
   Questo banco misura il testo che si vede, e lo fa bene: «343 testi, 0 sotto
   soglia» sul core è una risposta VERA. Ma la roadmap portava da giorni cinque
   violazioni AA del core, e il banco ne diceva zero — non perché fossero state
   corrette (tre lo erano), ma perché **nello stato di partenza quei cinque
   elementi non ci sono**. Il pallino delle notifiche compare se ci sono
   notifiche, la pillola «non salva» se il salvataggio fallisce, il toast
   quando c'è qualcosa da dire, gli avatar dei ruoli solo nelle liste che li
   usano. Un colore che si vede in un momento difficile non è un colore meno
   importante: è quello che l'utente legge quando ha più fretta.
   È la stessa forma di «68 modali da aprire, 0 aperte». Il rimedio non è più
   severità — è **una seconda domanda**, e la risposta la sa già il foglio di
   stile.

   ⚠️ IL LIMITE È DICHIARATO, NON NASCOSTO, e sono due:
   1. si fanno comparire soltanto le classi che portano **un fondo proprio e
      coprente** (tinta piena o gradiente). Per quelle il contesto non conta,
      perché il loro sfondo vince su qualunque antenato. Le altre si
      **elencano** e basta: misurarle in un contenitore inventato vuol dire
      accusare un colore per il posto in cui ce l'ho messo io — la sesta
      trappola qui sopra, nella sua forma più facile da rifare;
   2. il testo di prova è di misura normale, quindi la soglia applicata è 4,5.
      Se una classe nel prodotto vive solo a corpo grande la soglia vera è 3, e
      il censimento la accuserebbe a torto. Per questo un KO di questa passata
      **si verifica come un OK**: si va a cercare dove la classe è usata
      davvero, prima di toccare un colore. */
const CLASSI_CANDIDATE = () => {
  const fuori = /:(hover|focus|active|visited|disabled|checked|target)|::/;
  const trovate = new Map();
  for (const foglio of document.styleSheets) {
    let regole; try { regole = foglio.cssRules; } catch (e) { continue; }   // foglio d'altra origine
    /* ⛔ UNA REGOLA DI STILE ORA HA `cssRules`, E QUESTO CENSIMENTO CI È CASCATO
       ALLA PRIMA STESURA. Era scritto `if (r.cssRules) { scendi(...); continue; }`,
       cioè «se ha figli è un contenitore» — vero fino a ieri. Col CSS annidato
       Chromium dà una `cssRules` (vuota) anche alle regole normali: risultato,
       **620 regole su 649 saltate** e il censimento che rispondeva «0 classi
       candidate», un numero che sembrava una risposta. È la famiglia dello
       scanner che perdeva la fase: un controllo che guarda **com'è fatto** un
       oggetto invece di **che cos'è**. Adesso si decide dal `selectorText`, e
       nei figli si scende IN PIÙ, non INVECE. */
    const scendi = (lista) => {
      for (const r of lista) {
        if (r.cssRules && r.cssRules.length) scendi(r.cssRules);            // @media, @supports, CSS annidato
        if (!r.selectorText || !r.style) continue;
        if (fuori.test(r.selectorText)) continue;
        const bg = r.style.getPropertyValue('background') || r.style.getPropertyValue('background-image')
          || r.style.getPropertyValue('background-color');
        if (!bg) continue;
        /* ⛔ E DEVE DICHIARARE ANCHE IL SUO INCHIOSTRO. Senza questa riga il
           censimento accusava `.chart-bar` a 1,56:1: una barra di grafico non
           contiene testo, e il testo ce l'avevo messo io per misurarla. Chi
           scrive `background` E `color` nella stessa regola sta dicendo «qui
           dentro ci va del testo, e lo voglio di questo colore»: è la sola
           dichiarazione d'intenzione che un foglio di stile sappia dare. */
        if (!r.style.getPropertyValue('color')) continue;
        for (const pezzo of r.selectorText.split(',')) {
          const sel = pezzo.trim();
          /* solo i selettori fatti di classi: `.av.av-fc` va bene, `div > .x` no
             — lì il posto conta, e il posto non lo so inventare */
          if (!/^(\.[A-Za-z0-9_-]+)+$/.test(sel)) continue;
          const chiavi = sel.slice(1).split('.');
          /* `scritto` serve al confronto col criterio VECCHIO, qui sotto:
             un numero che cala non si racconta, si stampa. */
          const gradiente = /gradient\(/.test(bg);
          const pieno = /^\s*(#[0-9a-f]{3,8}|rgb\([^)]*\)|[a-z]+)\s*$/i.test(bg)
            && !/^\s*(none|transparent|inherit|initial|currentcolor)\s*$/i.test(bg);
          const p = trovate.get(chiavi.join(' '));
          trovate.set(chiavi.join(' '), { classi: chiavi,
            coprenteScritto: (p && p.coprenteScritto) || gradiente || pieno });
        }
      }
    };
    scendi(regole);
  }
  /* ⛔ E «COPRE?» LO DECIDE IL BROWSER, NON COM'È SCRITTO — misurato l'08/08, e
     costava 68 classi di cecità su 122.
     Fino a oggi la copertura si leggeva dal TESTO della dichiarazione: un
     `#hex`, un `rgb(...)` o una parola erano «pieno», `gradient(` era
     gradiente, tutto il resto finiva fra le «solo elencate» — cioè NON
     misurate. Ma la forma più comune in questo prodotto è `var(--card)`, che
     quella regex non riconosce: `.fi`, `.btn-main`, `.tag.ok`, `.vita-pct`,
     `.avatar.mute`… tutte opachissime, tutte invisibili al banco. E
     `var(--grad)` è un GRADIENTE dietro un nome, quindi spariva due volte.
     È la stessa lezione già scritta in CLAUDE.md per la regola 24 dei
     gradienti — «dare un nome a un valore lo fa sparire da un controllo
     statico, in silenzio» — e la cura è quella che il file predica altrove:
     **non calcolare una cosa che il browser sa dire**. Si crea un elemento con
     quelle classi, gli si chiede `backgroundColor` e `backgroundImage`, e si
     legge l'alfa vera.
     Misura: 122 marcate «non coprente», di cui **68 opache davvero** (o
     gradiente), 36 semitrasparenti e 18 senza nessun fondo effettivo. Le 36
     restano fuori, e adesso per la ragione VERA — un fondo che non copre va
     misurato dove sta, non in un contenitore inventato — invece che per come
     qualcuno ha scritto il colore. */
  const banco = document.createElement('div');
  banco.setAttribute('style', 'position:fixed;left:-99999px;top:0;visibility:hidden');
  document.body.appendChild(banco);
  const out = [];
  for (const [nome, v] of trovate) {
    const d = document.createElement('div');
    d.className = v.classi.join(' ');
    banco.appendChild(d);
    const s = getComputedStyle(d);
    const m = (s.backgroundColor.match(/[\d.]+/g) || []).map(Number);
    const alfa = m.length > 3 ? m[3] : (m.length ? 1 : 0);
    const coprente = /gradient/.test(s.backgroundImage) || alfa === 1;
    d.remove();
    out.push({ nome, classi: v.classi, coprente, alfa, coprenteScritto: !!v.coprenteScritto });
  }
  banco.remove();
  return out;
};

/* Fa comparire le classi mai viste, una accanto all'altra in fondo al `body`.
   Poi la misura la fa `MISURA`: **una scansione sola**, come pretende
   CLAUDE.md — se sbaglia, sbaglia uguale nei due posti invece di sbagliare in
   due modi diversi. */
/* `fondo` serve alle classi NON coprenti: un fondo semitrasparente si giudica
   solo sapendo che cosa ha sotto, e sotto ci si mette una delle superfici che
   l'app DICHIARA (`--bg`, `--card`, `--card2`) — non un colore inventato. */
const FAI_COMPARIRE = ({ elenco, fondo }) => {
  const host = document.createElement('div');
  host.id = 'dw-mai-comparse';
  host.setAttribute('style', 'position:fixed;left:0;top:0;z-index:2147483646;display:flex;flex-wrap:wrap'
    + (fondo ? `;background:${fondo}` : ''));
  for (const c of elenco) {
    const d = document.createElement('div');
    d.className = c.classi.join(' ');
    d.textContent = 'Ag';                      // due lettere: una alta e una con la coda
    /* ⛔ UNA CLASSE CHE NASCE NASCOSTA NON VIENE MISURATA, E IL BANCO LA CONTAVA
       FRA LE «FATTE COMPARIRE» LO STESSO — misurato l'08/08 sullo scarto fra
       «51 fatte comparire» e «49 misurate»: i due mancanti erano i toast del
       core, che stanno a `opacity:0` finché non li si mostra. Sparivano da
       tutt'e due i conti senza una riga che lo dicesse, e sotto ci stava
       `.toast.err` — bianco su `--danger` — che a corpo 13 fa 3,49:1.
       Si forza SOLO ciò che riguarda la visibilità e il posto: mai il colore,
       mai l'animazione (quella la ferma `fermaAnimazioni`, che sa portarla al
       suo ultimo fotogramma invece di spegnerla a metà). */
    for (const [k, v] of [['opacity', '1'], ['visibility', 'visible'], ['display', 'inline-block'],
      ['position', 'static'], ['transform', 'none'], ['pointer-events', 'auto']])
      d.style.setProperty(k, v, 'important');
    host.appendChild(d);
  }
  document.body.appendChild(host);
  return elenco.length;
};

const b = await chromium.launch({ executablePath: CHROMIUM });
let misurati = 0, bocciati = 0;
let maiComparse = 0, maiMisurate = 0, maiBocciate = 0, maiCieche = 0, maiComposte = 0;
const scusateComposte = new Set();
const nonMisurabili = [];
let sfumatiTot = 0, pulsantiTot = 0, spentiTot = 0, finiteTot = 0, pulsaBocciata = 0, pulsaMisurata = 0;
let superficiProvate = 0;
const superficiCieche = [];
const temaRifiutato = [];
let mixBocciata = 0;
let gradPresa = 0, gradPromossa = 0, gradFalsa = 0, gradSano = 0;
let gradMezzoPresa = 0, gradMezzoPromossa = 0;
let nonRisoltiTot = 0, conGrigliaTot = 0;
const nonRisoltiQuali = new Set();
let illeggibili = 0;
/* ⛔ IL DENOMINATORE DELLE FINESTRE, che si stampa SEMPRE — anche (soprattutto)
   nella passata normale, dove vale zero su tutto. È la riga «non ho guardato»
   che qui mancava: un «0 sotto soglia» senza sotto scritto quante finestre
   esistono e quante ne sono state aperte è il difetto che questo repository ha
   già pagato con «68 modali da aprire, 0 aperte» stampato per mesi. */
let modaliEsistonoTot = 0, modaliAperteTot = 0, modaliApertureTot = 0, modaliTestiTot = 0;
const modaliCensimento = [];
const modaliNonAperte = [];
/* quante finestre hanno ricevuto il veleno: è il denominatore della
   controprova, non il suo esito — «so fallire» detto su zero iniezioni è la
   forma silenziosa dell'iniezione che non inietta. */
let modaliSuperficiConVeleno = 0;
let forbiciLarghe = 0;
let temaMisurate = 0;
const visti = new Set();

for (const [nome, via] of SUPERFICI) {
  if (SOLO && SOLO !== nome) continue;
  console.log(`\n══════ ${nome} ══════`);
  const { ctx, p, errori } = await apriSuperficie(b, { nome, via, porta: PORTA, montaFintoFirebase });
  if (TEMA) {
    /* si mette la classe E si scrive la chiave che `dw-tema.js` rilegge: la
       classe da sola verrebbe tolta al primo `applica()`, e la chiave da sola
       arriverebbe troppo tardi (la pagina è già aperta). E si PRETENDE che la
       classe sia rimasta: se una superficie non ha quel tema, misurarla e
       chiamarla col nome del tema sarebbe una bugia — il core è esattamente
       questo caso, e lo dichiara invece di far finta. */
    /* ⛔ IL TEMA SI CHIEDE AL PROGRAMMA DELLA SUPERFICIE, NON SI APPICCICA.
       Prima stesura: si aggiungeva la classe e si guardava se era rimasta,
       facendo girare `window.applyTheme` per il core. NON FUNZIONAVA, e nel
       verso peggiore: il programma del core sta in un `<script type="module">`,
       quindi `applyTheme` NON è su `window` — la classe restava attaccata e il
       banco ha misurato tutto il core in un tema che quel core non può avere,
       sputando decine di KO su una superficie che non esiste. È la trappola di
       CLAUDE.md («il righello prima del soggetto») dentro il controllo scritto
       per non caderci.
       La domanda giusta non è «la classe è rimasta?» ma «questa superficie SA
       che cos'è questo tema?»: `sole` e `chiaro` sono concetti di
       `shared/dw-tema.js`, e chi non lo carica non ha `window.dwTema`. Il core
       non lo carica — ha due temi suoi — e infatti va dichiarato NON misurato,
       che è la verità. */
    const messa = await p.evaluate(({ cls, t }) => {
      if (!window.dwTema) return false;
      try { localStorage.setItem('dw-tema', t); } catch (e) { /* niente */ }
      window.dwTema(t);
      return document.body.classList.contains(cls);
    }, { cls: CLASSE_TEMA[TEMA], t: TEMA });
    if (!messa) {
      console.log(`  ⚠️  ${nome} non ha il tema «${TEMA}»: la classe viene tolta dalla pagina stessa. NON misurata.`);
      temaRifiutato.push(nome);
      await ctx.close();
      continue;
    }
    temaMisurate++;
  }
  if (CONTROPROVA) {
    await p.evaluate(([marca, mix]) => {
      const d = document.createElement('div');
      d.textContent = marca;
      d.className = 'controprova';
      /* fondo opaco messo sull'elemento stesso, così la composizione degli
         strati non deve indovinare niente: grigio su grigio, ~1,15:1 */
      d.setAttribute('style', 'color:rgb(51,51,51); background-color:rgb(42,42,42); font-size:13px; padding:4px; position:relative; z-index:1');
      document.body.appendChild(d);
      /* ⛔ E IL VERSO OPPOSTO, che è quello su cui il banco era rotto fino al
         07/08: un testo scritto con `color-mix()` — che Chromium risolve in
         `color(srgb …)` con i canali da 0 a 1 — e che è LEGGIBILISSIMO. Deve
         NON essere bocciato. Senza questa riga il difetto del righello
         tornerebbe senza che nessuno se ne accorga: la controprova di prima
         usa `rgb()` e passerebbe lo stesso, cioè proverebbe la lettura che non
         è mai stata in dubbio. Nero mescolato su bianco: oltre 15:1. */
      const g = document.createElement('div');
      g.textContent = mix;
      g.setAttribute('style', 'color:color-mix(in srgb, #000 90%, #123); '
        + 'background-color:color-mix(in srgb, #fff 96%, #eee); '
        + 'font-size:13px; padding:4px; position:relative; z-index:1');
      document.body.appendChild(g);
    }, [MARCA, MARCA_MIX]);
  }
  if (CONTROPULSA) {
    await p.evaluate((marca) => {
      const st = document.createElement('style');
      st.textContent = '@keyframes dwBassaFissa{0%,100%{opacity:.5}}';
      document.head.appendChild(st);
      const d = document.createElement('div');
      d.textContent = marca;
      d.className = 'controprova-pulsa';
      d.setAttribute('style', 'color:rgb(255,255,255); background-color:rgb(183,28,28); font-size:13px;'
        + ' padding:4px; position:relative; z-index:1; animation:dwBassaFissa 1s linear infinite');
      document.body.appendChild(d);
    }, MARCA_PULSA);
  }
  if (CONTROGRAD) {
    await p.evaluate(([ko, ok, mezzo]) => {
      /* ⛔ I TESTIMONI STANNO IN UNA STANZA LORO, E NON È PIGNOLERIA: alla
         prima stesura erano appesi al `body` con `position:relative`, e su una
         superficie su quattordici — `genesi · accesso`, che ha
         `body{display:flex;align-items:center}` — il testimone LEGGIBILE è
         stato bocciato a 3,28. Non sbagliava il righello: il testimone era
         diventato un elemento di flex e la sua altezza non era più quella che
         gli avevo dato, quindi il testo non stava più dov'era stato messo.
         Un testimone la cui geometria la decide la pagina ospite misura la
         pagina, non il banco — ed è la forma peggiore, perché fallisce dando
         la colpa a chi non c'entra. Adesso la stanza è `fixed`, `display:block`
         e con le misure scritte: nessun `flex`, `grid` o `float` dell'ospite
         può toccarla. */
      const stanza = document.createElement('div');
      stanza.id = 'dw-testimoni-gradiente';
      stanza.setAttribute('style', 'position:fixed;left:0;top:0;z-index:2147483645;display:block;'
        + 'width:430px;font-size:13px;line-height:normal');
      document.body.appendChild(stanza);
      const fai = (marca, stile) => {
        const d = document.createElement('div');
        d.textContent = marca;
        d.setAttribute('style', stile + ';display:block;font-size:13px;padding:6px 10px;width:260px');
        stanza.appendChild(d);
      };
      /* grigio su grigio lungo TUTTA la retta: in nessun punto arriva a 1,5:1 */
      fai(ko, 'color:rgb(120,120,120);background-image:linear-gradient(135deg, rgb(96,96,96), rgb(140,140,140))');
      /* ⛔ IL CASO CHE HA PRODOTTO LE QUATTRO ACCUSE FALSE, e non è «due
         gradienti»: è **un testo che copre solo una PARTE della retta del
         gradiente**. Qui il riquadro è alto 120 px e va dal bianco al quasi
         nero; il testo sta spinto in fondo, dove il fondo è scuro, e
         l'inchiostro è bianco: sullo schermo fa più di 15:1 e si legge
         benissimo. Accoppiando tutte le fermate — cioè il bianco
         dell'inchiostro con la fermata BIANCA del fondo, che sta 100 px più su
         e che il testo non tocca mai — viene **1:1**.
         ⚠️ E la prima stesura di questo testimone era sbagliata, il che val la
         pena scrivere: erano due gradienti contrari (inchiostro chiaro→scuro
         sopra un fondo scuro→chiaro). Il banco l'ha bocciato a 1,01:1 e aveva
         RAGIONE — due rette contrarie si incrociano a metà, e lì le lettere
         sono davvero dello stesso colore del fondo. Un testimone «leggibile»
         che leggibile non è avrebbe fatto fallire il banco per il motivo
         sbagliato: la prima delle cinque cause di «non distingue». */
      const d = document.createElement('div');
      d.setAttribute('style', 'background-image:linear-gradient(180deg, rgb(255,255,255), rgb(12,12,12));'
        + 'display:block;height:120px;width:260px;position:relative;color:rgb(255,255,255);font-size:13px');
      const s = document.createElement('div');
      s.textContent = ok + ' in fondo';
      s.setAttribute('style', 'position:absolute;left:8px;bottom:4px');
      d.appendChild(s);
      stanza.appendChild(d);
      /* ⛔ E LO STESSO, UN PIANO PIÙ SOTTO: l'inchiostro dipinto dal gradiente
         di un ANTENATO (la trappola 5). Il numero grande copre tutta la retta,
         ma l'unità dentro di lui ne copre solo la coda — dove l'inchiostro è
         chiaro. Su fondo scuro si legge; accoppiando le fermate, la coda scura
         dell'inchiostro finisce sul fondo scuro e viene una bocciatura che
         sullo schermo non c'è. */
      const g = document.createElement('div');
      g.setAttribute('style', 'background-color:rgb(16,16,16);display:block;padding:8px;width:420px');
      const n = document.createElement('span');
      n.setAttribute('style', 'font-size:13px;display:inline-block;width:400px;white-space:nowrap;'
        + 'background-image:linear-gradient(90deg, rgb(14,14,14) 0%, rgb(255,255,255) 35%);'
        + '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent');
      const vuoto = document.createElement('span');
      vuoto.setAttribute('style', 'display:inline-block;width:170px');
      const u = document.createElement('span');
      u.textContent = ok + ' in coda';
      n.appendChild(vuoto);
      n.appendChild(u);
      g.appendChild(n);
      stanza.appendChild(g);
      /* ⛔ IL CASO CHE DIMOSTRA PERCHÉ NON BASTANO I QUATTRO ANGOLI, e il
         motivo per cui `LATO` non vale 2. Fondo grigio UNIFORME `rgb(117)`,
         inchiostro che va dal nero al bianco lungo le lettere. Ai due capi il
         contrasto è **4,56** e **4,61** — tutt'e due sopra la soglia di 4,5 —
         e a metà parola l'inchiostro vale `rgb(128)` sul fondo `rgb(117)`:
         **1,17**, cioè illeggibile. Il grigio è scelto al valore che massimizza
         il minimo dei due capi (luminanza 0,179): oltre 4,58 non si può
         andare, quindi il margine è sottile per costruzione, ma è aritmetica
         esatta, non un pixel renderizzato.
         Questo caso lo sbagliano **tutt'e due** i righelli più semplici: i
         quattro angoli lo promuovono, e lo promuoveva anche il vecchio
         accoppiamento a tappeto — che dell'inchiostro conosceva solo le due
         fermate estreme, cioè esattamente i due capi. È la prova che la
         correzione di oggi non è solo «meno accuse»: in questa direzione il
         banco vede **di più** di prima. Lanciando `--lato=2` questa
         controprova DEVE fallire: se non fallisce, la griglia non sta
         guardando dentro le parole. */
      const q = document.createElement('div');
      q.setAttribute('style', 'background-color:rgb(117,117,117);display:block;padding:8px;width:300px');
      const w = document.createElement('span');
      w.textContent = mezzo;
      w.setAttribute('style', 'font-size:13px;'
        + 'background-image:linear-gradient(90deg, rgb(0,0,0), rgb(255,255,255));'
        + '-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent');
      q.appendChild(w);
      stanza.appendChild(q);
    }, [MARCA_GRAD_KO, MARCA_GRAD_OK, MARCA_GRAD_MEZZO]);
  }
  if (CONTROCENS) {
    await p.evaluate((cls) => {
      const st = document.createElement('style');
      st.textContent = `.${cls}{background:rgb(42,42,42);color:rgb(51,51,51);font-size:13px;padding:4px}`;
      document.head.appendChild(st);
    }, CLASSE_CENS);
  }
  const sezioni = await sezioniDi(p, nome);
  let bocciatiQui = 0, misuratiQui = 0, presaQui = 0;
  /* quante finestre ha il PROGRAMMA di questa superficie: si conta sul file
     SERVITO, che è quello che il banco sta guardando (una worktree, durante il
     giro), non su quello che c'è su disco. */
  let modaliEsistonoQui = null;
  try {
    const rr = await fetch(`http://127.0.0.1:${PORTA}${via}`);
    modaliEsistonoQui = quanteModaliEsistono(await rr.text());
  } catch (e) { modaliEsistonoQui = null; }
  modaliEsistonoTot += modaliEsistonoQui || 0;
  const titoliQui = new Set();
  let apertureQui = 0, candidatiQui = 0, testiModaliQui = 0, velenoQui = 0;
  const illeggibiliQui = [];
  const classiViste = new Set();
  /* ⛔ E LE COMBINAZIONI VANNO TENUTE INTERE, non spezzate — misurato l'08/08.
     Fin qui una candidata `.toast.success` risultava «già vista» se `.toast` e
     `.success` erano comparse ognuna PER CONTO SUO, magari su due elementi che
     non si sono mai incontrati. Effetto: la coppia veniva esclusa dal
     censimento (perché «vista») e non veniva misurata da nessuna parte (perché
     quel toast non è mai stato a schermo), cioè spariva da tutt'e due i conti
     senza comparire in nessuna riga «non ho guardato». Sotto ci stanno il
     toast di errore e quello di successo del core, che scrivono bianco su
     `--danger` e sul gradiente verde.
     Adesso si tiene l'insieme INTERO delle classi di ogni elemento misurato, e
     una candidata è «vista» solo se QUALCHE elemento le portava tutte insieme. */
  const combinazioniViste = [];
  for (const s of sezioni) {
    await vaiA(p, nome, s);
    const { finite: portateAllaFine } = await fermaAnimazioni(p);
    finiteTot += portateAllaFine;
    /* ══ DENTRO LE FINESTRE (--modali) ═══════════════════════════════════════
       Il gesto è quello di `modali-dentro.mjs`, importato: si sceglie un
       comando mai provato, lo si tocca, e se si apre una finestra si misura
       SOLO quello che sta dentro `#modal`. Poi si richiude e ci si rimette
       dove si era — un tocco può portare la pagina altrove, e senza rimettersi
       il giro misurerebbe un'altra schermata credendo di essere qui.
       ⛔ E QUESTA FUNZIONE NON GIUDICA NIENTE: RACCOGLIE. Le misure che
       restituisce finiscono nello STESSO ciclo che giudica quelle delle
       sezioni, dieci righe più in giù. Scriverne un secondo qui sarebbe la
       copia debole di CLAUDE.md: due giudizi identici oggi che fra un mese
       dicono due cose diverse, e nessuno se ne accorge perché tutt'e due
       stampano «0 sotto soglia». */
    const giroDelleFinestre = async () => {
      const raccolte = [];
      const fatti = [], forme = [];
      let diFila = 0;
      const casa = await p.evaluate(DOVE).catch(() => '');
      const sueSezioni = new Set(sezioni.filter((x) => typeof x === 'string' && x.startsWith('@'))
        .map((x) => 'screen-' + x.slice(1)));
      let inProfondita = false;
      const rimettiti = async () => {
        if (!casa || p.isClosed()) return;
        const ora = await p.evaluate(DOVE).catch(() => casa);
        if (ora === casa) { inProfondita = false; return; }
        /* di lato = una schermata che ha già il suo turno nel giro: si torna
           indietro. Più sotto = una scheda di dettaglio, che nessuna sezione
           visita: si RESTA, se no le sue finestre non le apre nessuno. */
        if (sueSezioni.size === 0 || sueSezioni.has(ora)) { await vaiA(p, nome, s); inProfondita = false; return; }
        inProfondita = true;
      };
      for (let i = 0; i < TETTO; i++) {
        if (p.isClosed()) break;
        const scelto = await p.evaluate(SCEGLI, [fatti, forme, PER_FORMA]).catch(() => null);
        if (!scelto) { if (++diFila >= 5) break; continue; }
        if (typeof scelto.restano === 'number' && scelto.restano > candidatiQui) candidatiQui = scelto.restano;
        if (scelto.fine) {
          if (inProfondita) { await vaiA(p, nome, s); inProfondita = false; continue; }
          break;
        }
        fatti.push(scelto.chiave); forme.push(scelto.sagoma);
        const r = await p.evaluate(TOCCA, 170).catch(() => null);
        if (p.isClosed()) break;
        if (!r) { if (++diFila >= 5) break; await p.waitForTimeout(300); continue; }
        diFila = 0;
        if (r.restata) { await p.evaluate(CHIUDI).catch(() => {}); await rimettiti(); continue; }
        if (!r.aperta) { await rimettiti(); continue; }
        apertureQui++; modaliApertureTot++;
        titoliQui.add(r.titolo.replace(/\d+/g, '#').replace(/\s+/g, ' ').slice(0, 46));
        await fermaAnimazioni(p);
        /* ⛔ IL VELENO VA DENTRO LA FINESTRA, non appeso al corpo della pagina.
           Quello appeso al `body` lo misura la passata delle sezioni; qui
           l'ambito è `#modal *`, quindi un veleno fuori NON entrerebbe mai
           nella misura e la controprova direbbe «non so fallire» per il motivo
           sbagliato — la terza causa dell'elenco di CLAUDE.md, l'iniezione che
           non inietta. */
        if (CONTROPROVA) {
          const messo = await p.evaluate(([marca, mix]) => {
            const corpo = document.getElementById('modal-body');
            if (!corpo) return false;
            const d = document.createElement('div');
            d.textContent = marca;
            d.setAttribute('style', 'color:rgb(51,51,51); background-color:rgb(42,42,42); font-size:13px; padding:4px; position:relative; z-index:1');
            corpo.appendChild(d);
            /* ⛔ E IL TESTIMONE DEL VERSO OPPOSTO VA MESSO QUI DENTRO ANCHE LUI.
               Appeso al `body` — dov'è per la passata delle sezioni — starebbe
               FUORI da `#modal *`, quindi non verrebbe mai misurato: e la riga
               «testimone color-mix bocciato 0 volte» direbbe «zero» perché non
               ha guardato, con la faccia di chi dice la verità. È la guardia
               scollegata, nella sua forma più difficile da vedere: un controllo
               che non può fallire. */
            const g = document.createElement('div');
            g.textContent = mix;
            g.setAttribute('style', 'color:color-mix(in srgb, #000 90%, #123);'
              + ' background-color:color-mix(in srgb, #fff 96%, #eee);'
              + ' font-size:13px; padding:4px; position:relative; z-index:1');
            corpo.appendChild(g);
            return true;
          }, [MARCA, MARCA_MIX]).catch(() => false);
          if (messo) { velenoQui++; modaliSuperficiConVeleno++; }
        }
        await p.evaluate(() => { window.__dwAmbito = '#modal *'; }).catch(() => {});
        const dentro = await p.evaluate(MISURA, LATO).catch(() => []);
        await p.evaluate(() => { window.__dwAmbito = null; }).catch(() => {});
        for (const m of dentro) { m.finestra = r.titolo.slice(0, 30); raccolte.push(m); }
        await p.evaluate(CHIUDI).catch(() => {});
        await rimettiti();
      }
      return raccolte;
    };
    const misure = MODALI ? await giroDelleFinestre() : await p.evaluate(MISURA, LATO);
    for (const m of misure) {
      /* lo stesso testo con la stessa classe si incontra su più schermate:
         si segnala una volta sola, altrimenti l'elenco è illeggibile */
      const suoi = m.classe.split(/\s+/).filter(Boolean);
      for (const t of suoi) classiViste.add(t);
      if (suoi.length) combinazioniViste.push(new Set(suoi));
      const chiave = `${nome}|${m.classe}|${m.testo}`;
      if (visti.has(chiave)) continue;
      visti.add(chiave);
      /* ⛔ NON MISURABILE NON E BOCCIATO, e nemmeno promosso. Se nessuna coppia
         inchiostro/fondo si e potuta leggere, il rapporto e `null`: si conta a
         parte e si dichiara in fondo. E il principio del fondatore applicato al
         righello — l assenza di una misura non e un dato favorevole ne uno
         sfavorevole — e la difesa contro il ritorno del difetto del 07/08, che
         trasformava «non so leggere questo colore» in «1,01:1». */
      if (m.rapporto === null) { illeggibili++; illeggibiliQui.push(m.classe || m.testo.slice(0, 24)); continue; }
      misurati++; misuratiQui++;
      /* ⛔ E IL CONTO DEI TESTI DENTRO LE FINESTRE SI FA QUI, dove si conta
         tutto il resto: contandolo dove le misure si raccolgono darebbe il
         numero PRIMA dei doppioni, e il riepilogo stamperebbe due numeri
         diversi per la stessa cosa (misurato su Terra: «37 testi misurati» e
         «70 dentro»). Due numeri che si contraddicono nella stessa pagina
         fanno dubitare di tutti gli altri. */
      if (m.finestra) { testiModaliQui++; modaliTestiTot++; }
      const passa = m.rapporto >= m.soglia;
      if (!passa) {
        if (m.testo.startsWith(MARCA_PULSA)) { pulsaBocciata++; console.log('  ⚠️  il testo in pulsazione è stato BOCCIATO'
          + ` a ${m.rapporto}:1 — la guardia della trappola 4 non ha tenuto`); continue; }
        if (m.testo.startsWith(MARCA_MIX)) { mixBocciata++; }
        if (m.testo.startsWith(MARCA_GRAD_KO)) { gradPresa++; continue; }
        if (m.testo.startsWith(MARCA_GRAD_MEZZO)) { gradMezzoPresa++; continue; }
        if (m.testo.startsWith(MARCA_GRAD_OK)) { gradFalsa++; console.log('  ⚠️  il testimone LEGGIBILE su gradiente è stato'
          + ` BOCCIATO a ${m.rapporto}:1 («${m.testo}») — la geometria sta accusando un colore sano`); continue; }
        if (m.testo.startsWith(MARCA)) { presaQui++; continue; }   // è il veleno: non è un difetto del prodotto
        bocciati++; bocciatiQui++;
        if (m.forbice >= 1) forbiciLarghe++;
        console.log(`  KO  ${String(m.rapporto).padStart(6)}:1  (serve ${m.soglia})  ${m.dim}px  «${m.testo}»  .${m.classe}`
          /* dove sta: senza il nome della finestra un KO di `--modali` manda a
             cercare in tutta l'app una riga che si vede solo aprendo un dialogo */
          + (m.finestra ? `  ← finestra «${m.finestra}»` : '')
          + (m.forbice >= 1 ? `\n        ⚠️  forbice ${m.forbice} su ${m.punti} punti — il testo sta a cavallo di un gradiente: il numero è il capo PEGGIORE delle lettere, all'altro capo si arriva a ${Math.round((m.rapporto + m.forbice) * 100) / 100}` : ''));
      } else if (m.testo.startsWith(MARCA_GRAD_MEZZO)) {
        gradMezzoPromossa++;
        console.log(`  ⚠️  il gradiente illeggibile IN MEZZO è stato PROMOSSO a ${m.rapporto}:1`
          + ' — la griglia non sta guardando dentro le parole (con --lato=2 è normale: è la sua dimostrazione)');
      } else if (m.testo.startsWith(MARCA_GRAD_KO)) {
        gradPromossa++;
        console.log(`  ⚠️  il gradiente ILLEGGIBILE è stato PROMOSSO a ${m.rapporto}:1 — qui la geometria non giudica`);
      } else if (m.testo.startsWith(MARCA_GRAD_OK)) {
        gradSano++;
      } else if (m.testo.startsWith(MARCA_PULSA)) {
        pulsaMisurata++;
        console.log(`  ⚠️  il testo in pulsazione è stato MISURATO a ${m.rapporto}:1 invece che dichiarato`);
      } else if (m.testo.startsWith(MARCA)) {
        console.log(`  ⚠️  la riga della controprova è stata PROMOSSA a ${m.rapporto}:1 — qui la misura non guarda`);
      } else if (TUTTI) {
        console.log(`  ok  ${String(m.rapporto).padStart(6)}:1  «${m.testo}»`);
      }
    }
  }
  /* ── La seconda domanda: le classi che dipingono e non sono mai comparse ── */
  /* ⛔ NIENTE `.catch(() => [])` QUI. La prima stesura ce l'aveva, il censimento
     rispondeva «0 classi» e sembrava una risposta: era l'eccezione ingoiata. */
  /* ⛔ NELLA PASSATA DELLE FINESTRE IL CENSIMENTO DELLE CLASSI NON GIRA, ed è
     una scelta con la sua ragione: quelle classi le fa comparire in fondo al
     `body`, cioè FUORI da `#modal`, e le misura già la passata delle sezioni —
     rifarlo qui non aggiungerebbe un soggetto e raddoppierebbe il tempo di una
     passata che ha già un limite di mezz'ora addosso. Detto invece che
     lasciato dedurre: `mai` resta vuoto e le righe qui sotto non stampano. */
  const candidate = MODALI ? [] : await p.evaluate(CLASSI_CANDIDATE)
    .catch((e) => { console.log('  ⚠️  il censimento delle classi non è girato:', String(e).slice(0, 120)); return []; });
  const mai = candidate.filter((c) => !combinazioniViste.some((ins) => c.classi.every((k) => ins.has(k))));
  const daFar = mai.filter((c) => c.coprente);
  /* ⛔ QUANTE NE PERDEVA IL CRITERIO VECCHIO — stampato, non raccontato. Fino
     all'08/08 «copre?» si leggeva dal TESTO della dichiarazione, e `var(--card)`
     non lo soddisfaceva: erano opachissime e finivano fra le «non giudicabili».
     Questo numero è la prova che il cambio serve: se un giorno tornasse a
     zero vorrebbe dire che qualcuno ha rimesso il criterio vecchio. */
  maiCieche += daFar.filter((c) => !c.coprenteScritto).length;
  const soloElencate = mai.filter((c) => !c.coprente);
  maiComparse += mai.length;
  if (soloElencate.length) nonMisurabili.push(`${nome}: ${soloElencate.length}`);
  if (daFar.length) {
    await p.evaluate(FAI_COMPARIRE, { elenco: daFar.map((c) => ({ classi: c.classi })) });
    await fermaAnimazioni(p);
    const misureMai = await p.evaluate(MISURA, LATO);
    /* si guardano SOLO gli elementi appena creati: il resto della pagina è già
       stato misurato, e rimisurarlo qui gonfierebbe il totale */
    const nomiFatti = new Set(daFar.map((c) => c.classi.join(' ')));
    for (const m of misureMai) {
      if (m.testo !== 'Ag' || !nomiFatti.has(m.classe)) continue;
      maiMisurate++;
      if (m.rapporto < m.soglia) {
        maiBocciate++; bocciati++; bocciatiQui++;
        console.log(`  KO  ${String(m.rapporto).padStart(6)}:1  (serve ${m.soglia})  ${m.dim}px`
          + `  .${m.classe}  — mai comparsa durante il giro, fatta comparire`);
      } else if (TUTTI) {
        console.log(`  ok  ${String(m.rapporto).padStart(6)}:1  .${m.classe}  (fatta comparire)`);
      }
    }
    await p.evaluate(() => { const h = document.getElementById('dw-mai-comparse'); if (h) h.remove(); });
  }
  /* ── E QUELLE CHE NON COPRONO: caso peggiore, con la forbice accanto ──
     ⛔ Il limite dichiarato fin qui era: «misurarle in un contenitore inventato
     vuol dire accusare un colore per il posto in cui ce l'ho messo io». Vero, e
     per questo NON si inventa un posto: si usano le superfici che l'app stessa
     dichiara (`--bg`, `--card`, `--card2`). Un fondo semitrasparente composto
     su ognuna dà tre numeri; si tiene il **peggiore** — la direzione prudente —
     e si stampa la **forbice**, cioè quanto quel numero dipende dal posto. È
     la stessa forma già usata per i gradienti, e la stessa lezione: una misura
     incerta si dichiara incerta invece di sparire.
     ⚠️ La resa è stata misurata PRIMA di scriverlo, e va detta perché nessuno
     si aspetti un filone: su sei app le classi davvero semitrasparenti con un
     inchiostro dichiarato sono **diciassette**, e una sola cade sotto soglia. */
  /* ⛔ LE ECCEZIONI DELLA PASSATA COMPOSTA, DICHIARATE CON LA PROVA — e sono
     esattamente il caso che l'intestazione di questo banco impone di
     verificare: «un KO di questa passata si verifica come un OK: si va a
     cercare dove la classe è usata DAVVERO, prima di toccare un colore».
     Il campione che si fa comparire porta la scritta «Ag», quindi la soglia
     applicata è quella del testo piccolo (4,5). Ma queste cinque classi, nel
     prodotto, non contengono testo: sono **contenitori d'icona** — un `<svg>`
     e basta, e in Terra perfino con `aria-hidden="true"`. Per il contenuto non
     testuale la WCAG 1.4.11 chiede **3:1**, e tutte e cinque stanno fra 4,08 e
     4,47: passano con margine.
     La prova sta accanto a ognuna. Se un giorno una di loro comincerà a
     contenere del testo, questa riga sarà da togliere — e il modo di
     accorgersene è che il conto delle presentate qui sotto non torni. */
  const COMPOSTE_ACCETTATE = new Map([
    ['terra|avatar ico ok', 'contenitore d\'icona: `<div class="avatar ico ok" aria-hidden="true">${I.monte}</div>`, dentro solo un <svg> 20×20. Soglia non-testo 3:1 — misurato 4,19.'],
    ['terra|avatar ico warn', 'stesso contenitore, stato warn. Misurato 4,34.'],
    ['terra|avatar ico danger', 'stesso contenitore, stato danger. Misurato 4,08 (chiaro) e 4,44 (sole).'],
    ['sentinella|rep-esito-ico', 'contenitore d\'icona del riquadro d\'esito: `line-height:0` e dentro un <svg> 40×40. Misurato 4,47.'],
  ]);
  const scusataComposta = (classe) => COMPOSTE_ACCETTATE.has(`${nome}|${classe}`);
  let compostiQui = 0;
  if (soloElencate.length) {
    const superfici = await p.evaluate(() => {
      const cs = getComputedStyle(document.body);
      return ['--bg', '--card', '--card2'].map((v) => [v, cs.getPropertyValue(v).trim()]).filter(([, c]) => c);
    }).catch(() => []);
    const perClasse = new Map();
    for (const [nomeSup, colore] of superfici) {
      await p.evaluate(FAI_COMPARIRE, { elenco: soloElencate.map((c) => ({ classi: c.classi })), fondo: colore });
      await fermaAnimazioni(p);
      const nomiFatti = new Set(soloElencate.map((c) => c.classi.join(' ')));
      for (const m of await p.evaluate(MISURA, LATO)) {
        if (m.testo !== 'Ag' || !nomiFatti.has(m.classe) || m.rapporto == null) continue;
        const q = perClasse.get(m.classe) || { min: Infinity, max: -Infinity, soglia: m.soglia, dim: m.dim, dove: '' };
        if (m.rapporto < q.min) { q.min = m.rapporto; q.dove = nomeSup; }
        if (m.rapporto > q.max) q.max = m.rapporto;
        perClasse.set(m.classe, q);
      }
      await p.evaluate(() => { const h = document.getElementById('dw-mai-comparse'); if (h) h.remove(); });
    }
    for (const [classe, q] of perClasse) {
      compostiQui++; maiComposte++;
      if (q.min < q.soglia && scusataComposta(classe)) {
        scusateComposte.add(`${nome}|${classe}`);
        if (TUTTI) console.log(`  ok  ${String(q.min).padStart(6)}:1  .${classe}  (contenitore d'icona: soglia non-testo 3:1)`);
      } else if (q.min < q.soglia) {
        maiBocciate++; bocciati++; bocciatiQui++;
        console.log(`  KO  ${String(q.min).padStart(6)}:1  (serve ${q.soglia})  ${q.dim}px  .${classe}`
          + `  — fondo NON coprente, caso peggiore su «${q.dove}»`
          + `  · forbice ${Math.round((q.max - q.min) * 100) / 100} fra le ${superfici.length} superfici che l'app dichiara`);
      } else if (TUTTI) {
        console.log(`  ok  ${String(q.min).padStart(6)}:1  .${classe}  (composta, peggiore su «${q.dove}», forbice ${Math.round((q.max - q.min) * 100) / 100})`);
      }
    }
  }
  if (mai.length) {
    console.log(`  ⚠️  ${mai.length} classi che dipingono un fondo non sono mai comparse:`
      + ` ${daFar.length} fatte comparire e misurate, ${soloElencate.length} non coprenti`
      + ` (di cui ${compostiQui} composte sulle superfici dichiarate, ${soloElencate.length - compostiQui} senza inchiostro leggibile)`);
  }

  const sfumati = await p.evaluate(() => window.__dwSfumati || 0).catch(() => 0);
  const pulsanti = await p.evaluate(() => window.__dwPulsanti || 0).catch(() => 0);
  const spenti = await p.evaluate(() => window.__dwSpenti || 0).catch(() => 0);
  const nonRis = await p.evaluate(() => [window.__dwNonRisolti || 0, [...(window.__dwNonRisoltiQuali || [])],
    window.__dwConGriglia || 0]).catch(() => [0, [], 0]);
  nonRisoltiTot += nonRis[0]; for (const q of nonRis[1]) nonRisoltiQuali.add(q); conGrigliaTot += nonRis[2];
  sfumatiTot += sfumati; pulsantiTot += pulsanti; spentiTot += spenti;
  console.log(`  ${misuratiQui} testi misurati, ${bocciatiQui} sotto soglia`
    + (sfumati ? ` · ${sfumati} in dissolvenza, non misurabili` : '')
    + (pulsanti ? ` · ${pulsanti} in pulsazione, non misurabili` : '')
    + (spenti ? ` · ${spenti} spenti, esclusi dalla WCAG 1.4.3` : '')
    + (CONTROPROVA ? ` · controprova ${presaQui ? 'PRESA' : 'NON PRESA'}` : ''));
  if (illeggibiliQui.length) console.log(`  ⚠️  ${illeggibiliQui.length} testi NON misurabili qui (il browser non sa convertire il loro colore): ${[...new Set(illeggibiliQui)].slice(0, 5).join(", ")}`);
  /* ⛔ IL DENOMINATORE DELLE FINESTRE, per superficie e SUBITO — non in fondo.
     Le tre risposte sono diverse e vanno separate, se no «0 aperte» si legge
     come «a posto»: niente da aprire (il programma non ha finestre), non
     raggiunta (nessun comando cliccabile: accesso, navigazione o selettore),
     raggiunta ma senza dati (i comandi ci sono e non aprono niente). È la
     stessa distinzione che `modali-dentro.mjs` ha già pagato. */
  if (MODALI) {
    modaliAperteTot += titoliQui.size;
    modaliCensimento.push({ app: nome, esistono: modaliEsistonoQui, aperte: titoliQui.size,
      aperture: apertureQui, testi: testiModaliQui, candidati: candidatiQui, quali: [...titoliQui] });
    if (titoliQui.size === 0) {
      if (modaliEsistonoQui === 0) console.log('  ✓  NIENTE DA APRIRE: questa superficie non ha finestre nel suo programma.');
      else {
        modaliNonAperte.push(nome);
        console.log(`  ⚠️  NESSUNA FINESTRA APERTA — ${candidatiQui} comandi cliccabili trovati`
          + ` (nel programma ce ne sono ${modaliEsistonoQui ?? '?'}). Non vuol dire «a posto»:`
          + ' vuol dire che qui dentro non è stato misurato NIENTE.');
      }
    } else {
      console.log(`  ${titoliQui.size} finestre diverse su ${modaliEsistonoQui ?? '?'} nel programma,`
        + ` ${apertureQui} aperture, ${testiModaliQui} testi misurati dentro`
        + (CONTROPROVA ? ` · ${velenoQui} avvelenate` : ''));
    }
  }
  if (CONTROPROVA) { superficiProvate++; if (!presaQui) superficiCieche.push(nome); }
  if (errori.length) console.log('  ⚠ errori pagina:', errori.slice(0, 2));
  await ctx.close();
}

await b.close();
if (TEMA) {
  /* ⛔ prima dei KO: quante superfici ha davvero guardato con questo tema.
     «0 sotto soglia» su due superfici su quattordici non è una buona notizia. */
  console.log(`\n   TEMA «${TEMA}»: ${temaMisurate} superfici misurate`
    + (temaRifiutato.length ? `, ${temaRifiutato.length} NON misurate perché non hanno questo tema (${temaRifiutato.join(', ')})` : ''));
}
console.log(`\n${misurati} testi misurati in tutto, ${bocciati} sotto soglia`
  + (illeggibili ? ` · ${illeggibili} NON misurabili, dichiarati e non giudicati` : '')
  + (forbiciLarghe ? ` · ${forbiciLarghe} con FORBICE larga: il contrasto cambia di oltre 1 da un capo all'altro delle lettere` : '')
  + (sfumatiTot ? ` · ${sfumatiTot} saltati perché in dissolvenza (dichiarati, non nascosti)` : '')
  + (pulsantiTot ? ` · ${pulsantiTot} saltati perché in pulsazione (dichiarati, non nascosti)` : '')
  + (spentiTot ? ` · ${spentiTot} comandi spenti, che la WCAG 1.4.3 esclude (dichiarati, non nascosti)` : ''));
/* ⛔ E ANCHE QUESTA VA LETTA PRIMA DEI KO, perché è dove il RIGHELLO non sa
   guardare. La geometria risolve i gradienti LINEARI e i RADIALI; restano
   fuori i RIPETUTI, i CONICI, le fermate in pixel su un'ellisse e gli strati
   con una dimensione, una posizione o un ancoraggio non predefiniti (lo
   scheletro di caricamento, `400% 100%`). Per quelli vale ancora il vecchio
   accoppiamento a tappeto — il caso peggiore fra tutte le fermate, cioè la
   direzione prudente — e un KO su un testo che ci sta sopra va verificato a
   mano. Il numero qui sotto dice quanto è grande quella zona d'ombra: se è
   zero, ogni KO è stato deciso guardando il colore che c'è davvero. */
console.log(`   (${conGrigliaTot} testi misurati su una griglia di ${LATO}×${LATO} punti PER RIGA DI TESTO,`
  + ` perché sotto o dentro hanno un gradiente risolto geometricamente; tutti gli altri su un punto solo,`
  + ` che lì dà lo stesso identico numero. ${nonRisoltiTot} incontri con uno strato NON risolto`
  + `${nonRisoltiQuali.size ? `, di ${nonRisoltiQuali.size} forme diverse` : ''}: per quelli vale ancora`
  + ' il caso peggiore fra tutte le fermate, cioè la direzione prudente)');
/* ⛔ Questa riga va letta PRIMA dei KO, non dopo: è il banco che dice dove non
   ha guardato. Se le attese scadono, la misura è di nuovo a metà animazione —
   cioè il difetto del 03/08 che è tornato, e allora i KO non valgono. */
console.log(`   (${finiteTot} animazioni finite portate al loro ultimo fotogramma prima di misurare:`
  + ' in secondo piano Chromium non le fa avanzare, e senza questo si misurerebbero a metà)');
/* ⛔ E QUESTA VA LETTA PRIMA DI TUTTE, perché fino al 09/08 non c'era e il buco
   che dichiara era il più grande del banco: **le finestre di dialogo**. Nella
   passata normale il numero a destra è ZERO per costruzione — `#modal` sta a
   `display:none` finché qualcuno non lo apre, e qui non lo apre nessuno — e
   averlo scritto è tutta la differenza fra «0 sotto soglia» e «0 sotto soglia
   fra i testi che ho guardato». */
if (MODALI) {
  console.log('\n── il denominatore delle finestre: quante ne esistono, quante ne ho aperte ──');
  for (const c of modaliCensimento) {
    console.log(`   ${String(c.app).padEnd(22)} ${String(c.esistono ?? '?').padStart(3)} nel programma  →  ${String(c.aperte).padStart(3)} aperte`
      + ` · ${String(c.aperture).padStart(4)} aperture · ${String(c.testi).padStart(5)} testi misurati dentro`
      + (c.aperte === 0 ? `   [${c.candidati} comandi trovati: ${c.candidati ? 'senza dati' : 'non raggiunta'}]` : ''));
    if (c.quali.length) console.log(`      aperte: ${c.quali.join(' · ')}`);
  }
  console.log(`   ${'TOTALE'.padEnd(22)} ${String(modaliEsistonoTot).padStart(3)}                 →  ${String(modaliAperteTot).padStart(3)}`);
  console.log(`   ${modaliTestiTot} testi misurati DENTRO le finestre, in ${modaliApertureTot} aperture.`);
  if (modaliNonAperte.length) {
    console.log(`   ⚠️ NESSUNA FINESTRA APERTA su: ${modaliNonAperte.join(', ')}.`);
    console.log('      Non vuol dire «a posto»: vuol dire che lì dentro il colore non è stato misurato.');
  }
} else {
  console.log(`   (⛔ QUESTA PASSATA NON APRE NESSUNA FINESTRA DI DIALOGO: cammina sulle sezioni,`
    + ` e \`#modal\` resta \`display:none\`. Nei programmi delle superfici guardate qui ci sono`
    + ` ${modaliEsistonoTot} finestre, e **zero** dei ${misurati} testi qui sopra sta dentro una di`
    + ` loro — misurato, non dedotto. Per il colore dentro le finestre: \`--modali\`.)`);
}
/* ⛔ ANCHE QUESTA RIGA VA LETTA PRIMA DEI KO. A sinistra c'è la parte di
   prodotto che il giro non incontra da solo — il pallino delle notifiche, la
   pillola «non salva», il toast; a destra quella che nemmeno facendola
   comparire si può giudicare senza inventarle un contesto. */
if (!MODALI) console.log(`   (col criterio vecchio — «copre?» deciso dal TESTO della dichiarazione invece che dal browser —`
  + ` ${maiCieche} di quelle misurate qui sotto sarebbero rimaste FUORI: sono i fondi scritti`
  + ` \`var(--card)\`, \`var(--grad)\`, \`var(--success)\`… cioè la forma più comune di questo prodotto)`);
/* ⚠️ e non in `--modali`, dove il censimento non gira per scelta dichiarata:
   un allarme che scatta sempre insegna a non guardarlo, ed è una lezione già
   pagata in questa casa su `leggi-giro.mjs`. */
if (!SOLO && !MODALI && maiCieche === 0)
  console.log(`   ⛔ ZERO: o il criterio vecchio è tornato, o il censimento non sta più guardando dove crede.`);
if (!MODALI) console.log(`   (${maiComparse} classi con un fondo proprio non sono mai comparse durante il giro:`
  + ` ${maiMisurate} fatte comparire e misurate, ${maiBocciate} sotto soglia`
  + (scusateComposte.size ? ` · ${scusateComposte.size} contenitori d'icona scusati con la prova (soglia non-testo 3:1): ${[...scusateComposte].join(', ')}` : '')
  + (maiComposte ? ` · ${maiComposte} col fondo NON coprente, composte sulle superfici che l'app dichiara e giudicate col caso PEGGIORE (la forbice è stampata accanto a ognuna)` : '')
  + (nonMisurabili.length ? ` · per superficie: ${nonMisurabili.join(', ')}` : '')
  + ')');

if (CONTROCENS) {
  console.log(`\ncontroprova del censimento: ${maiMisurate} classi mai comparse sono state fatte comparire,`
    + ` ${maiBocciate} bocciate`);
  if (!maiMisurate) { console.log('⛔ il censimento non ha fatto comparire NIENTE: la passata non gira.'); process.exit(1); }
  if (!maiBocciate) { console.log(`⛔ la classe «${CLASSE_CENS}» a 1,15:1 non è stata bocciata: il censimento non giudica.`); process.exit(1); }
  console.log('il censimento sa fallire: la classe che nel DOM non compare mai è stata trovata e bocciata.');
  process.exit(0);
}

if (CONTROGRAD) {
  /* ⛔ I DUE VERSI, SEPARATI. Un banco che ha appena smesso di accusare va
     provato PRIMA nel verso che assolve: se il gradiente illeggibile passa, la
     correzione di oggi ha reso il righello cieco e i suoi «0 sotto soglia» non
     valgono niente. Poi l'altro verso, che è la ragione per cui il cantiere è
     nato: i due testimoni leggibili — uno con l'inchiostro fisso, uno con
     inchiostro E fondo a gradiente — non devono essere bocciati. */
  console.log(`\ncontroprova del gradiente (${LATO}×${LATO} punti per riga): ${gradPresa} illeggibili bocciati,`
    + ` ${gradPromossa} promossi · ${gradMezzoPresa} illeggibili SOLO IN MEZZO bocciati, ${gradMezzoPromossa} promossi`
    + ` · ${gradSano} leggibili promossi, ${gradFalsa} accusati a torto`);
  if (gradPromossa) { console.log('⛔ un gradiente ILLEGGIBILE è passato: la valutazione co-locata non sa bocciare.'); process.exit(1); }
  if (!gradPresa) { console.log('⛔ nessun gradiente illeggibile è arrivato alla misura: il veleno non è entrato, la prova non prova niente.'); process.exit(1); }
  if (gradMezzoPromossa) { console.log(`⛔ il testo leggibile ai due capi e illeggibile in mezzo è passato: con ${LATO}×${LATO}`
    + ' punti la griglia non guarda DENTRO le parole. Con --lato=2 questo è il risultato atteso, ed è la misura'
    + ' che dimostra perché i quattro angoli non bastano.'); process.exit(1); }
  if (!gradMezzoPresa) { console.log('⛔ il testimone cieco-agli-angoli non è arrivato alla misura: la prova non prova niente.'); process.exit(1); }
  if (gradFalsa) { console.log('⛔ un testo LEGGIBILE su gradiente è stato bocciato: è tornata l\'accusa falsa del 07/08.'); process.exit(1); }
  if (!gradSano) { console.log('⛔ nessun testimone leggibile è arrivato alla misura: il verso che conta non è stato provato.'); process.exit(1); }
  console.log('la geometria sa fallire dove deve e tace dove deve: illeggibile bocciato, leggibile promosso.');
  process.exit(0);
}

if (CONTROPULSA) {
  /* Il testo appeso sta benissimo fermo e male in movimento: il banco NON deve
     bocciarlo, e non deve nemmeno misurarlo — deve dichiararlo. Le due uscite
     sbagliate sono diverse e vanno separate, se no la prova passa per il motivo
     sbagliato: BOCCIATO = la guardia non c'è; MISURATO = la guardia c'è ma la
     pulsazione non è stata riconosciuta (e allora il numero è un caso). */
  const dichiarati = pulsantiTot;
  console.log(`\ncontroprova della pulsazione: ${dichiarati} dichiarati in pulsazione,`
    + ` ${pulsaBocciata} bocciati, ${pulsaMisurata} misurati come se fossero fermi`);
  if (pulsaBocciata) { console.log('⛔ la guardia della trappola 4 NON tiene: un colore sano è stato accusato.'); process.exit(1); }
  if (pulsaMisurata) { console.log('⛔ il testo in pulsazione è stato misurato invece che dichiarato: il numero è un caso.'); process.exit(1); }
  if (!dichiarati) { console.log('⛔ nessun testo dichiarato in pulsazione: il veleno non è arrivato, la prova non prova niente.'); process.exit(1); }
  console.log('la guardia della trappola 4 tiene: il testo in pulsazione è stato dichiarato, non giudicato.');
}

if (CONTROPULSA || CONTROPROVA) {
  /* la prova dell'ATTESA gira insieme alle altre controprove: costa un
     millisecondo e difende la correzione del 03/08 */
  const b2 = await chromium.launch({ executablePath: CHROMIUM });
  const { ctx, p } = await apriSuperficie(b2, { nome: 'core', via: '/index.html', porta: PORTA, montaFintoFirebase });
  const r = await provaFinish(p).catch(() => null);
  await ctx.close(); await b2.close();
  if (!r) console.log('⚠️  la prova di `finish()` non è riuscita a girare');
  else {
    console.log(`\nprova di finish(): opacità prima ${r.prima}, dopo ${r.dopo}`);
    if (!(r.dopo >= 0.99)) { console.log('⛔ `finish()` non porta l\'elemento al suo ultimo fotogramma: la correzione non tiene.'); process.exit(1); }
    if (r.prima >= 0.99) console.log('⚠️  qui l\'animazione era già finita da sola: la prova non distingue (macchina scarica).');
    else console.log(`la correzione tiene: da ${r.prima} a ${r.dopo} senza aspettare che l'animazione giri.`);
  }
}

/* Come per gli altri banchi: in controprova si esce MALE se il difetto NON
   viene trovato, perché vorrebbe dire che la misura non sa fallire. */
if (CONTROPROVA) {
  console.log(`${superficiProvate} superfici avvelenate, ${superficiProvate - superficiCieche.length} l'hanno bocciata`);
  /* ⛔ IL VERSO OPPOSTO, e va guardato PRIMA: il testimone scritto con
     `color-mix()` è leggibilissimo e non deve comparire fra i bocciati. Se
     compare, il righello ha ripreso a leggere `color(srgb 0.16 …)` come se i
     canali fossero 0-255 — il difetto del 07/08, che da solo produceva 560
     bocciature false su 3.646 testi. Un banco che accusa colori sani è peggio
     di un banco che non guarda: manda a rifare palette che stanno benissimo. */
  console.log(`testimone color-mix: bocciato ${mixBocciata} volte su ${superficiProvate} superfici (deve essere 0)`);
  if (mixBocciata) {
    console.log('⛔ un testo LEGGIBILE scritto con `color-mix()` è stato bocciato: il righello non sa leggere `color(srgb …)`.');
    process.exit(1);
  }
  if (superficiCieche.length === 0) {
    console.log('La controprova è stata bocciata su tutte le superfici: il banco sa fallire.');
    process.exit(0);
  }
  console.log(`\n⚠️ CONTROPROVA INCOMPLETA: su ${superficiCieche.join(', ')} il testo a 1,15:1 è passato.`);
  process.exit(1);
}
process.exit(bocciati ? 1 : 0);
