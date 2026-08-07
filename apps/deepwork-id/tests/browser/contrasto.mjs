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
      pagina. Bianco su arancione risultava 19:1. Si tiene il caso peggiore fra
      i colori del gradiente.
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
     node apps/deepwork-id/tests/browser/contrasto.mjs 8823 --solo=conti --tutti
*/
import { prendiChromium, CHROMIUM, SUPERFICI, sezioniDi, vaiA, apriSuperficie } from './giro.mjs';
import { montaFintoFirebase } from './finto-firebase.mjs';

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

/* La misura vive nella pagina: si passa una volta sola e si raccoglie tutto il
   testo visibile con il suo contrasto effettivo. */
const MISURA = () => {
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
  /* IL FONDO VERO SI COMPONE, NON SI SCEGLIE. Terza volta che questa misura
     accusa il prodotto a torto: prendendo il primo `background-image` incontrato
     risalendo, gli ALONI D'AMBIENTE — gradienti quasi trasparenti come
     `rgba(255,171,0,.08)`, che nel prodotto sono luce, non fondo — venivano
     letti come tinta piena. Risultato: 183 bocciature su 228 in Genesi, su una
     pagina che si legge benissimo. Adesso si parte dal fondo della pagina e si
     spalmano sopra, uno per uno, tutti gli strati fino al testo, ciascuno con la
     sua trasparenza. Dove c'è un gradiente si tengono TUTTE le sue fermate come
     candidati, e alla fine vince il caso peggiore. */
  const mescola = (sopra, sotto) => {
    const f = num(sopra), s = num(sotto);
    if (!f.length) return sotto;
    const a = f.length > 3 ? f[3] : 1;
    if (a === 0) return sotto;
    if (a === 1) return `rgb(${f[0]}, ${f[1]}, ${f[2]})`;
    const m = (i) => Math.round(a * f[i] + (1 - a) * s[i]);
    return `rgb(${m(0)}, ${m(1)}, ${m(2)})`;
  };
  const sfondiDi = (el) => {
    const catena = [];
    for (let a = el; a; a = a.parentElement) catena.push(a);
    let fondi = ['rgb(0, 0, 0)'];               // sotto tutto c'è il nero della finestra
    for (let i = catena.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(catena[i]);
      /* Un antenato con `background-clip:text` NON dipinge nessuno sfondo: il
         suo colore è ritagliato sulle proprie lettere. Contandolo come fondo,
         un `<small>` dentro un numero a gradiente risultava a 1,25:1 su una
         scheda che si legge benissimo. È la quarta volta che questa misura
         accusa il prodotto al posto di sé stessa. */
      if ((cs.webkitBackgroundClip || cs.backgroundClip) === 'text' && catena[i] !== el) continue;
      const stop = cs.backgroundImage && cs.backgroundImage.match(/(?:rgba?|hsla?|color|oklab|oklch|lab|lch|hwb)\([^)]*\)/g);
      const prossimi = new Set();
      for (const f of fondi) {
        const conColore = mescola(cs.backgroundColor, f);
        if (stop && stop.length) for (const t of stop) prossimi.add(mescola(t, conColore));
        else prossimi.add(conColore);
      }
      fondi = [...prossimi].slice(0, 12);       // basta: oltre si moltiplicano senza dire di più
    }
    return fondi;
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
    return `rgb(${m(0)}, ${m(1)}, ${m(2)})`;
  };
  const rapporto = (f, s) => {
    const a = lum(f), b = lum(s);
    if (a === null || b === null) return null;   // non misurabile, non «zero»
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const out = [];
  document.querySelectorAll('body *').forEach((el) => {
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
    let sfondi, inchiostri;
    if (dentroSvg) {
      const f = cs.fill;
      if (!f || f === 'none') return;
      inchiostri = [f];
      sfondi = sfondiDi(el.ownerSVGElement ? el.ownerSVGElement.parentElement || el : el);
    } else if (ritaglio === 'text') {
      const stop = (cs.backgroundImage || '').match(/(?:rgba?|hsla?|color|oklab|oklch|lab|lch|hwb)\([^)]*\)/g);
      if (!stop || !stop.length) return;
      inchiostri = stop;
      sfondi = sfondiDi(el.parentElement || document.body);
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
      const stop = (getComputedStyle(su).backgroundImage || '').match(/(?:rgba?|hsla?|color|oklab|oklch|lab|lch|hwb)\([^)]*\)/g);
      if (!stop || !stop.length) return;
      inchiostri = stop;
      sfondi = sfondiDi(su.parentElement || document.body);
    } else {
      inchiostri = [cs.color];
      sfondi = sfondiDi(el);
    }
    out.push({
      testo: proprio.slice(0, 40),
      classe: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
      dim, grande, soglia: grande ? 3 : 4.5,
      /* ⛔ i null NON entrano nel minimo: `Math.min` li tratterebbe come zero,
         cioe come il contrasto peggiore possibile, ed e esattamente la bugia
         comoda che ha prodotto 531 bocciature false. Se NESSUNA coppia si e
         potuta leggere, il rapporto e `null` e chi legge lo dichiara. */
      rapporto: (() => {
        const r = sfondi.flatMap((sf) => inchiostri.map((inc) => rapporto(composto(inc, sf, op), sf)))
          .filter((x) => x !== null && Number.isFinite(x));
        return r.length ? Math.round(Math.min(...r) * 100) / 100 : null;
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
        const gradiente = /gradient\(/.test(bg);
        /* `rgba(...,.15)` non copre niente e va misurata dove sta davvero */
        const pieno = /^\s*(#[0-9a-f]{3,8}|rgb\([^)]*\)|[a-z]+)\s*$/i.test(bg)
          && !/^\s*(none|transparent|inherit|initial|currentcolor)\s*$/i.test(bg);
        for (const pezzo of r.selectorText.split(',')) {
          const sel = pezzo.trim();
          /* solo i selettori fatti di classi: `.av.av-fc` va bene, `div > .x` no
             — lì il posto conta, e il posto non lo so inventare */
          if (!/^(\.[A-Za-z0-9_-]+)+$/.test(sel)) continue;
          const chiavi = sel.slice(1).split('.');
          const nome = chiavi.join(' ');
          if (!trovate.has(nome)) trovate.set(nome, { classi: chiavi, coprente: false });
          if (gradiente || pieno) trovate.get(nome).coprente = true;
        }
      }
    };
    scendi(regole);
  }
  return [...trovate.entries()].map(([nome, v]) => ({ nome, classi: v.classi, coprente: v.coprente }));
};

/* Fa comparire le classi mai viste, una accanto all'altra in fondo al `body`.
   Poi la misura la fa `MISURA`: **una scansione sola**, come pretende
   CLAUDE.md — se sbaglia, sbaglia uguale nei due posti invece di sbagliare in
   due modi diversi. */
const FAI_COMPARIRE = (elenco) => {
  const host = document.createElement('div');
  host.id = 'dw-mai-comparse';
  host.setAttribute('style', 'position:fixed;left:0;top:0;z-index:2147483646;display:flex;flex-wrap:wrap');
  for (const c of elenco) {
    const d = document.createElement('div');
    d.className = c.classi.join(' ');
    d.textContent = 'Ag';                      // due lettere: una alta e una con la coda
    host.appendChild(d);
  }
  document.body.appendChild(host);
  return elenco.length;
};

const b = await chromium.launch({ executablePath: CHROMIUM });
let misurati = 0, bocciati = 0;
let maiComparse = 0, maiMisurate = 0, maiBocciate = 0;
const nonMisurabili = [];
let sfumatiTot = 0, pulsantiTot = 0, spentiTot = 0, finiteTot = 0, pulsaBocciata = 0, pulsaMisurata = 0;
let superficiProvate = 0;
const superficiCieche = [];
const temaRifiutato = [];
let mixBocciata = 0;
let illeggibili = 0;
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
  if (CONTROCENS) {
    await p.evaluate((cls) => {
      const st = document.createElement('style');
      st.textContent = `.${cls}{background:rgb(42,42,42);color:rgb(51,51,51);font-size:13px;padding:4px}`;
      document.head.appendChild(st);
    }, CLASSE_CENS);
  }
  const sezioni = await sezioniDi(p, nome);
  let bocciatiQui = 0, misuratiQui = 0, presaQui = 0;
  const illeggibiliQui = [];
  const classiViste = new Set();
  for (const s of sezioni) {
    await vaiA(p, nome, s);
    const { finite: portateAllaFine } = await fermaAnimazioni(p);
    finiteTot += portateAllaFine;
    const misure = await p.evaluate(MISURA);
    for (const m of misure) {
      /* lo stesso testo con la stessa classe si incontra su più schermate:
         si segnala una volta sola, altrimenti l'elenco è illeggibile */
      for (const t of m.classe.split(/\s+/)) if (t) classiViste.add(t);
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
      const passa = m.rapporto >= m.soglia;
      if (!passa) {
        if (m.testo.startsWith(MARCA_PULSA)) { pulsaBocciata++; console.log('  ⚠️  il testo in pulsazione è stato BOCCIATO'
          + ` a ${m.rapporto}:1 — la guardia della trappola 4 non ha tenuto`); continue; }
        if (m.testo.startsWith(MARCA_MIX)) { mixBocciata++; }
        if (m.testo.startsWith(MARCA)) { presaQui++; continue; }   // è il veleno: non è un difetto del prodotto
        bocciati++; bocciatiQui++;
        console.log(`  KO  ${String(m.rapporto).padStart(6)}:1  (serve ${m.soglia})  ${m.dim}px  «${m.testo}»  .${m.classe}`);
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
  const candidate = await p.evaluate(CLASSI_CANDIDATE)
    .catch((e) => { console.log('  ⚠️  il censimento delle classi non è girato:', String(e).slice(0, 120)); return []; });
  const mai = candidate.filter((c) => !c.classi.every((k) => classiViste.has(k)));
  const daFar = mai.filter((c) => c.coprente);
  const soloElencate = mai.filter((c) => !c.coprente);
  maiComparse += mai.length;
  if (soloElencate.length) nonMisurabili.push(`${nome}: ${soloElencate.length}`);
  if (daFar.length) {
    await p.evaluate(FAI_COMPARIRE, daFar.map((c) => ({ classi: c.classi })));
    await fermaAnimazioni(p);
    const misureMai = await p.evaluate(MISURA);
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
  if (mai.length) {
    console.log(`  ⚠️  ${mai.length} classi che dipingono un fondo non sono mai comparse:`
      + ` ${daFar.length} fatte comparire e misurate, ${soloElencate.length} solo elencate`);
  }

  const sfumati = await p.evaluate(() => window.__dwSfumati || 0).catch(() => 0);
  const pulsanti = await p.evaluate(() => window.__dwPulsanti || 0).catch(() => 0);
  const spenti = await p.evaluate(() => window.__dwSpenti || 0).catch(() => 0);
  sfumatiTot += sfumati; pulsantiTot += pulsanti; spentiTot += spenti;
  console.log(`  ${misuratiQui} testi misurati, ${bocciatiQui} sotto soglia`
    + (sfumati ? ` · ${sfumati} in dissolvenza, non misurabili` : '')
    + (pulsanti ? ` · ${pulsanti} in pulsazione, non misurabili` : '')
    + (spenti ? ` · ${spenti} spenti, esclusi dalla WCAG 1.4.3` : '')
    + (CONTROPROVA ? ` · controprova ${presaQui ? 'PRESA' : 'NON PRESA'}` : ''));
  if (illeggibiliQui.length) console.log(`  ⚠️  ${illeggibiliQui.length} testi NON misurabili qui (il browser non sa convertire il loro colore): ${[...new Set(illeggibiliQui)].slice(0, 5).join(", ")}`);
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
  + (sfumatiTot ? ` · ${sfumatiTot} saltati perché in dissolvenza (dichiarati, non nascosti)` : '')
  + (pulsantiTot ? ` · ${pulsantiTot} saltati perché in pulsazione (dichiarati, non nascosti)` : '')
  + (spentiTot ? ` · ${spentiTot} comandi spenti, che la WCAG 1.4.3 esclude (dichiarati, non nascosti)` : ''));
/* ⛔ Questa riga va letta PRIMA dei KO, non dopo: è il banco che dice dove non
   ha guardato. Se le attese scadono, la misura è di nuovo a metà animazione —
   cioè il difetto del 03/08 che è tornato, e allora i KO non valgono. */
console.log(`   (${finiteTot} animazioni finite portate al loro ultimo fotogramma prima di misurare:`
  + ' in secondo piano Chromium non le fa avanzare, e senza questo si misurerebbero a metà)');
/* ⛔ ANCHE QUESTA RIGA VA LETTA PRIMA DEI KO. A sinistra c'è la parte di
   prodotto che il giro non incontra da solo — il pallino delle notifiche, la
   pillola «non salva», il toast; a destra quella che nemmeno facendola
   comparire si può giudicare senza inventarle un contesto. */
console.log(`   (${maiComparse} classi con un fondo proprio non sono mai comparse durante il giro:`
  + ` ${maiMisurate} fatte comparire e misurate, ${maiBocciate} sotto soglia`
  + (nonMisurabili.length ? ` · non giudicabili fuori dal loro posto: ${nonMisurabili.join(', ')}` : '')
  + ')');

if (CONTROCENS) {
  console.log(`\ncontroprova del censimento: ${maiMisurate} classi mai comparse sono state fatte comparire,`
    + ` ${maiBocciate} bocciate`);
  if (!maiMisurate) { console.log('⛔ il censimento non ha fatto comparire NIENTE: la passata non gira.'); process.exit(1); }
  if (!maiBocciate) { console.log(`⛔ la classe «${CLASSE_CENS}» a 1,15:1 non è stata bocciata: il censimento non giudica.`); process.exit(1); }
  console.log('il censimento sa fallire: la classe che nel DOM non compare mai è stata trovata e bocciata.');
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
