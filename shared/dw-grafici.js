/* ══════════════════════════════════════════════════════════════════════════
   DEEPWORK — MOTORE DEI GRAFICI  (SVG puro, nessuna libreria, nessun CDN)
   ══════════════════════════════════════════════════════════════════════════
   A cosa serve: dare a tutte e sei le app verticali gli stessi grafici, con
   lo stesso comportamento e la stessa qualità, senza che nessuna se li
   ridisegni da sola. Le pagine restano autonome: qui dentro non si carica
   niente da internet.

   COME SI INSTALLA (dopo dw-app-ui.css)
     <link rel="stylesheet" href="../../shared/dw-grafici.css">
     <script src="../../shared/dw-grafici.js" defer></script>
   Nel codice dell'app (anche dentro <script type="module">) si usa
   l'oggetto globale  dwGrafici.

   ────────────────────────────────────────────────────────────────────────
   ESEMPI D'USO — copiali e cambia i dati
   ────────────────────────────────────────────────────────────────────────

   1) ANDAMENTO NEL TEMPO (linea + area, con soglia)
      dwGrafici.linea('#graf-polveri', {
        titolo: 'Polveri PM10',
        unita: 'µg/m³',
        x: ['1 lug','2 lug','3 lug','4 lug','5 lug','6 lug'],
        serie: [{ nome: 'Misurato', valori: [22, 31, 28, 46, 52, 38], area: true }],
        soglia: { valore: 50, etichetta: 'limite' }
      });

   2) DUE SERIE (la legenda compare da sola; la seconda è tratteggiata,
      così si distingue anche senza vedere i colori)
      dwGrafici.linea('#graf-turni', {
        titolo: 'Ore lavorate',
        x: ['lun','mar','mer','gio','ven'],
        serie: [{ nome:'Fatto', valori:[64,71,58,80,77], area:true },
                { nome:'Previsto', valori:[70,70,70,70,70] }]
      });

   3) BARRE (grandezze da confrontare)
      dwGrafici.barre('#graf-mezzi', {
        titolo: 'Ore mezzo',
        valori: [ {etichetta:'Pala 1', valore: 128},
                  {etichetta:'Dumper 3', valore: 96, stato:'warn'},
                  {etichetta:'Escav. 2', valore: 61} ]
      });

   4) BARRE ORIZZONTALI ORDINATE (tipo Pareto: i pochi che contano)
      dwGrafici.barre('#graf-fermi', {
        titolo: 'Cause di fermo',
        orientamento: 'orizzontale',
        ordina: true, taglio: 80,          // segna dove si arriva all'80%
        valori: [ {etichetta:'Guasti idraulici', valore: 44}, … ]
      });

   5) CIAMBELLA (composizione: SOLO con poche voci — oltre 6 si passa alle
      barre da soli, senza chiedere niente)
      dwGrafici.ciambella('#graf-costi', {
        titolo: 'Ripartizione costi',
        formato: 'euro',
        centro: 'Totale',
        valori: [ {etichetta:'Gasolio', valore: 48200}, … ]
      });

   6) SPARKLINE dentro una tessera (nessun asse, nessuna etichetta)
      dwGrafici.sparkline('#cella-trend', { valori:[3,5,4,7,6,9,8], soglia: 8 });

   7) BARRA DI AVANZAMENTO con tacca di riferimento (vita cava, budget…)
      dwGrafici.avanzamento('#vita-cava', {
        valore: 61.4, massimo: 100, unita: '%',
        riferimento: { valore: 80, etichetta: 'soglia di guardia' },
        stato: 'warn'
      });

   8) AGGIORNARE senza ridisegnare tutto
      const g = dwGrafici.linea('#graf-polveri', spec);
      g.aggiorna({ serie: [{ nome:'Misurato', valori: nuoviValori }] });
      g.distruggi();     // toglie tutto e stacca gli ascoltatori

   ────────────────────────────────────────────────────────────────────────
   OPZIONI COMUNI (valgono per tutti i tipi)
   ────────────────────────────────────────────────────────────────────────
     titolo    testo dell'intestazione (facoltativo)
     meta      testo piccolo a destra dell'intestazione (periodo, fonte…)
     nota      riga di spiegazione sotto il grafico
     unita     unità di misura ('kg', '€', 'µg/m³'…)
     formato   'numero' (di serie) | 'decimale' | 'percentuale' | 'euro'
               | 'compatto' | una funzione tua  (v) => '…'
     altezza   altezza del disegno in px (di serie: 200, 230 su schermo largo)
     animazione  true di serie; diventa ferma da sola con prefers-reduced-motion
     tabella   true di serie: aggiunge «Dati» apribile con la tabella dei valori
     nudo      true: niente cassa (bordo, fondo, ombra) — per infilarlo dentro
               una scheda che ce l'ha già
     aria      descrizione a voce alta; se manca la scrive il motore

   ────────────────────────────────────────────────────────────────────────
   LE REGOLE CHE IL MOTORE APPLICA DA SOLO (non sono opinioni)
   ────────────────────────────────────────────────────────────────────────
   · La forma segue il compito: la ciambella oltre 6 voci diventa barre;
     una serie sola non ha legenda (basta il titolo); da due in su la
     legenda c'è sempre.
   · Mai due assi verticali con scale diverse: se servono due grandezze,
     due grafici. Il motore non offre nemmeno l'opzione.
   · Il colore non basta mai da solo: la seconda serie è tratteggiata, la
     terza puntinata, i punti fuori soglia sono ROMBI, gli stati portano
     sempre l'etichetta.
   · Il testo porta i colori del testo, mai il colore della serie.
   · Etichette selettive: mai un numero su ogni punto. Al massimo l'ultimo
     valore e il massimo; il resto lo dicono il tooltip e la tabella.
   · Le aree di tocco sono più larghe del segno disegnato (dito coi guanti).
   · Tutto passa da textContent: un'etichetta che arriva dai dati non può
     iniettare HTML.
   ══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var seq = 0;

  /* ═══════════════ utilità minime ═══════════════ */

  function nodo(tag, attr, testo) {
    var n = document.createElementNS(NS, tag);
    if (attr) for (var k in attr) if (attr[k] != null) n.setAttribute(k, attr[k]);
    if (testo != null) n.appendChild(document.createTextNode(String(testo)));
    return n;
  }
  function div(cls, testo) {
    var d = document.createElement('div');
    if (cls) d.className = cls;
    if (testo != null) d.textContent = String(testo);
    return d;
  }
  function bersaglio(rif) {
    if (!rif) return null;
    return typeof rif === 'string' ? document.querySelector(rif) : rif;
  }
  function num(v) { return typeof v === 'number' && isFinite(v); }

  var fmtInt = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 });
  var fmtDec = new Intl.NumberFormat('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var fmtEur = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  function compatto(v) {
    var a = Math.abs(v);
    if (a >= 1e9) return fmtDec.format(v / 1e9) + ' mld';
    if (a >= 1e6) return fmtDec.format(v / 1e6) + ' mln';
    if (a >= 1e4) return fmtInt.format(Math.round(v / 1e3)) + ' k';
    return fmtInt.format(v);
  }
  function formatterDi(spec) {
    var f = spec.formato;
    if (typeof f === 'function') return f;
    if (f === 'euro') return function (v) { return fmtEur.format(v); };
    if (f === 'percentuale') return function (v) { return fmtDec.format(v).replace(',0', '') + '%'; };
    if (f === 'decimale') return function (v) { return fmtDec.format(v); };
    if (f === 'compatto') return compatto;
    return function (v) { return Math.abs(v) < 10 && v % 1 !== 0 ? fmtDec.format(v) : fmtInt.format(v); };
  }
  function conUnita(testo, unita) { return unita ? testo + ' ' + unita : testo; }

  /* scala numerica "bella": estremi arrotondati, mai cifre a caso sull'asse */
  function passoBello(grezzo) {
    var p = Math.pow(10, Math.floor(Math.log10(grezzo)));
    var f = grezzo / p;
    var s = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return s * p;
  }
  function scala(min, max, quanti) {
    if (!(max > min)) { max = min + 1; }
    var passo = passoBello((max - min) / Math.max(2, quanti));
    var basso = Math.floor(min / passo) * passo;
    var alto = Math.ceil(max / passo) * passo;
    var t = [];
    for (var v = basso; v <= alto + passo * 0.001; v += passo) t.push(Math.round(v / passo) * passo);
    return { min: basso, max: alto, tacche: t };
  }

  /* larghezza reale del contenitore: il disegno nasce alla misura giusta,
     così 1 unità del viewBox ≈ 1 pixel e i testi non vengono "gonfiati" */
  function larghezzaUtile(el) {
    var w = el.clientWidth || el.getBoundingClientRect().width || 0;
    if (!w) w = Math.min(720, (global.innerWidth || 360) - 32);
    return Math.max(240, Math.min(1040, Math.round(w)));
  }

  function testoLargo(t, px) { return String(t).length * px * 0.52; }

  /* ═══════════════ la cassa comune ═══════════════ */

  function Grafico(el, spec) {
    this.el = el;
    this.spec = spec || {};
    this.id = 'dwg' + (++seq);
    this._ascolti = [];
    this._larg = 0;
    this._idx = -1;
    this.monta();
  }

  Grafico.prototype.on = function (t, ev, fn, opt) {
    t.addEventListener(ev, fn, opt || false);
    this._ascolti.push([t, ev, fn, opt || false]);
  };

  Grafico.prototype.distruggi = function () {
    this._ascolti.forEach(function (a) { a[0].removeEventListener(a[1], a[2], a[3]); });
    this._ascolti = [];
    if (this._ro) { try { this._ro.disconnect(); } catch (e) { /* niente */ } }
    if (this.radice && this.radice.parentNode) this.radice.parentNode.removeChild(this.radice);
  };

  Grafico.prototype.aggiorna = function (patch) {
    for (var k in patch) this.spec[k] = patch[k];
    var vecchio = this.radice;
    this.monta();
    if (vecchio && vecchio.parentNode) vecchio.parentNode.removeChild(vecchio);
    return this;
  };

  Grafico.prototype.monta = function () {
    var self = this, s = this.spec;
    var fig = document.createElement('figure');
    fig.className = 'dwg' + (s.nudo ? ' nudo' : '') + (s.classe ? ' ' + s.classe : '');
    this.radice = fig;

    var testa = div('dwg-head');
    if (s.titolo) testa.appendChild(div('dwg-title', s.titolo));
    if (s.meta) testa.appendChild(div('dwg-meta', s.meta));
    if (s.titolo || s.meta) fig.appendChild(testa);

    var wrap = div('dwg-plot');
    this.wrap = wrap;
    fig.appendChild(wrap);

    this.legenda = div('dwg-leg');
    fig.appendChild(this.legenda);
    if (s.nota) fig.appendChild(div('dwg-nota', s.nota));
    this.piede = fig;

    this.el.appendChild(fig);
    this._larg = larghezzaUtile(this.el);
    this.disegna();

    /* ridisegno quando la colonna cambia davvero misura (rotazione, desktop) */
    if (global.ResizeObserver && !s.fissa) {
      this._ro = new ResizeObserver(function () {
        var w = larghezzaUtile(self.el);
        if (Math.abs(w - self._larg) < 14) return;
        self._larg = w;
        clearTimeout(self._t);
        self._t = setTimeout(function () { self.ridisegna(); }, 90);
      });
      try { this._ro.observe(this.el); } catch (e) { /* niente */ }
    }
    return this;
  };

  Grafico.prototype.ridisegna = function () {
    while (this.wrap.firstChild) this.wrap.removeChild(this.wrap.firstChild);
    while (this.legenda.firstChild) this.legenda.removeChild(this.legenda.firstChild);
    if (this._tab && this._tab.parentNode) this._tab.parentNode.removeChild(this._tab);
    this.disegna();
  };

  Grafico.prototype.disegna = function () {
    var t = this.spec.tipo;
    if (t === 'barre') disegnaBarre(this);
    else if (t === 'ciambella') disegnaCiambella(this);
    else if (t === 'sparkline') disegnaSpark(this);
    else if (t === 'avanzamento') disegnaAvanzamento(this);
    else disegnaLinea(this);
  };

  /* nuovo <svg> pronto: viewBox alla misura reale, accessibile, animabile */
  Grafico.prototype.tela = function (w, h, aria, orizz) {
    var svg = nodo('svg', {
      'class': 'dwg-svg', viewBox: '0 0 ' + w + ' ' + h,
      role: 'img', 'aria-label': aria || '', tabindex: '0',
      preserveAspectRatio: 'xMidYMid meet'
    });
    if (this.spec.animazione !== false) {
      svg.classList.add('dwg-anim');
      if (orizz) svg.classList.add('oriz');
    }
    this.svg = svg;
    this.wrap.appendChild(svg);
    return svg;
  };

  /* ═══════════════ tooltip: uno solo, condiviso dal grafico ═══════════════ */

  Grafico.prototype.tip = function () {
    if (this._tip) return this._tip;
    var t = div('dwg-tip');
    t.setAttribute('role', 'status');
    this.wrap.appendChild(t);
    this._tip = t;
    return t;
  };

  /* righe = [{nome, valore, cls}] — il valore comanda, il nome segue */
  Grafico.prototype.mostraTip = function (x, y, chiave, righe, coda) {
    var t = this.tip();
    while (t.firstChild) t.removeChild(t.firstChild);
    if (chiave) t.appendChild(div('dwg-tip-k', chiave));
    righe.forEach(function (r) {
      var riga = div('dwg-tip-r');
      riga.appendChild(div('dwg-tip-seg ' + (r.cls || '')));
      riga.appendChild(div('dwg-tip-v', r.valore));
      if (r.nome) riga.appendChild(div('dwg-tip-n', r.nome));
      t.appendChild(riga);
    });
    if (coda) t.appendChild(div('dwg-tip-x', coda));
    t.classList.add('on');
    /* posizione: si tiene dentro la cassa, e scappa dal dito */
    var box = this.wrap.getBoundingClientRect();
    var lw = t.offsetWidth, lh = t.offsetHeight;
    var px = Math.max(2, Math.min(box.width - lw - 2, x - lw / 2));
    var py = y - lh - 14;
    if (py < 2) py = y + 18;
    t.style.left = Math.round(px) + 'px';
    t.style.top = Math.round(py) + 'px';
  };

  Grafico.prototype.nascondiTip = function () {
    if (this._tip) this._tip.classList.remove('on');
    if (this._mira) this._mira.setAttribute('opacity', '0');
    if (this._evid) this._evid.setAttribute('opacity', '0');
  };

  /* ═══════════════ legenda ═══════════════ */

  function vocelegenda(disegno, testo, forte, cls) {
    var s = document.createElement('span');
    s.className = 'lg' + (cls ? ' ' + cls : '');
    var mini = nodo('svg', { viewBox: '0 0 22 11', 'aria-hidden': 'true' });
    disegno.forEach(function (n) { mini.appendChild(n); });
    s.appendChild(mini);
    s.appendChild(document.createTextNode(testo));
    if (forte) { var b = document.createElement('b'); b.textContent = ' ' + forte; s.appendChild(b); }
    return s;
  }

  /* ═══════════════ tabella dei dati (il tooltip non fa da cancello) ═══════════════ */

  Grafico.prototype.tabella = function (intestazioni, righe) {
    if (this.spec.tabella === false || !righe || !righe.length) return;
    var d = document.createElement('details');
    d.className = 'dwg-tab';
    var sm = document.createElement('summary');
    sm.textContent = 'Dati';
    d.appendChild(sm);
    var tb = document.createElement('table');
    var th = document.createElement('thead'), tr = document.createElement('tr');
    intestazioni.forEach(function (h) { var c = document.createElement('th'); c.textContent = h; tr.appendChild(c); });
    th.appendChild(tr); tb.appendChild(th);
    var bd = document.createElement('tbody');
    righe.forEach(function (r) {
      var t = document.createElement('tr');
      r.forEach(function (v) { var c = document.createElement('td'); c.textContent = v; t.appendChild(c); });
      bd.appendChild(t);
    });
    tb.appendChild(bd); d.appendChild(tb);
    this.piede.appendChild(d);
    this._tab = d;
  };

  /* ══════════════════════════════════════════════════════════════════════
     1 · LINEA / AREA NEL TEMPO
     ══════════════════════════════════════════════════════════════════════ */

  function disegnaLinea(g) {
    var s = g.spec, fmt = formatterDi(s);
    var serie = (s.serie || []).filter(function (x) { return x && x.valori && x.valori.length; });
    if (!serie.length) { vuoto(g, 'Nessun dato da mostrare'); return; }
    if (serie.length > 3) serie = serie.slice(0, 3);   /* oltre 3: piccoli multipli */

    var x = s.x || serie[0].valori.map(function (_, i) { return i + 1; });
    var n = Math.max.apply(null, serie.map(function (S) { return S.valori.length; }));
    var largo = g._larg, alto = s.altezza || (largo >= 620 ? 250 : 205);

    /* estremi: si tiene dentro anche la soglia, se c'è e non è assurda */
    var tutti = [];
    serie.forEach(function (S) { S.valori.forEach(function (v) { if (num(v)) tutti.push(v); }); });
    if (!tutti.length) { vuoto(g, 'Nessun dato da mostrare'); return; }
    var vmin = Math.min.apply(null, tutti), vmax = Math.max.apply(null, tutti);
    var soglia = s.soglia && num(s.soglia.valore) ? s.soglia.valore : null;
    var sogliaFuori = false;
    if (soglia != null) {
      if (soglia > vmax * 2.6 && vmax > 0) sogliaFuori = true;
      else { vmax = Math.max(vmax, soglia); vmin = Math.min(vmin, soglia); }
    }
    if (s.daZero !== false && vmin > 0) vmin = 0;
    var sc = scala(vmin, vmax, largo >= 620 ? 5 : 4);

    var etY = sc.tacche.map(function (v) { return fmt(v); });
    var mSx = Math.max(30, Math.round(Math.max.apply(null, etY.map(function (t) { return testoLargo(t, 10); }))) + 12);
    var box = { x0: mSx, x1: largo - 12, y0: 10, y1: alto - 26 };
    var px = function (i) { return n === 1 ? (box.x0 + box.x1) / 2 : box.x0 + (box.x1 - box.x0) * i / (n - 1); };
    var py = function (v) { return box.y1 - (box.y1 - box.y0) * (v - sc.min) / (sc.max - sc.min); };

    var svg = g.tela(largo, alto, s.aria || ariaLinea(s, serie, fmt, vmax));
    var defs = nodo('defs');
    var grad = nodo('linearGradient', { id: g.id + 'a', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(nodo('stop', { 'class': 'dwg-a0', offset: '0' }));
    grad.appendChild(nodo('stop', { 'class': 'dwg-a1', offset: '1' }));
    defs.appendChild(grad); svg.appendChild(defs);

    /* zona oltre soglia: fondo appena accennato, sta DIETRO tutto */
    if (soglia != null && !sogliaFuori) {
      var ys = py(soglia);
      if (ys > box.y0) svg.appendChild(nodo('rect', {
        'class': 'dwg-zona', x: box.x0, y: box.y0, width: box.x1 - box.x0, height: (ys - box.y0).toFixed(1)
      }));
    }
    /* griglia orizzontale soltanto: le verticali raddoppiano l'inchiostro */
    sc.tacche.forEach(function (v) {
      svg.appendChild(nodo('line', { 'class': 'dwg-grid', x1: box.x0, y1: py(v).toFixed(1), x2: box.x1, y2: py(v).toFixed(1) }));
    });

    /* aree, poi linee: l'area di una serie non deve coprire la linea di un'altra */
    serie.forEach(function (S, si) {
      if (!S.area || si > 0) return;
      var d = percorso(S.valori, px, py, s.curva !== false);
      if (!d) return;
      var ultimo = ultimoIndice(S.valori), primo = primoIndice(S.valori);
      svg.appendChild(nodo('path', {
        'class': 'dwg-area', fill: 'url(#' + g.id + 'a)',
        d: d + ' L' + px(ultimo).toFixed(1) + ' ' + box.y1 + ' L' + px(primo).toFixed(1) + ' ' + box.y1 + ' Z'
      }));
    });

    if (soglia != null && !sogliaFuori) {
      svg.appendChild(nodo('line', { 'class': 'dwg-soglia', x1: box.x0, y1: py(soglia).toFixed(1), x2: box.x1, y2: py(soglia).toFixed(1) }));
    }
    /* assi discreti */
    svg.appendChild(nodo('line', { 'class': 'dwg-ax', x1: box.x0, y1: box.y0, x2: box.x0, y2: box.y1 }));
    svg.appendChild(nodo('line', { 'class': 'dwg-ax', x1: box.x0, y1: box.y1, x2: box.x1, y2: box.y1 }));

    serie.forEach(function (S, si) {
      var d = percorso(S.valori, px, py, s.curva !== false);
      if (d) svg.appendChild(nodo('path', { 'class': 'dwg-linea s' + (si + 1), d: d, pathLength: '1' }));
    });

    /* punti: solo se pochi, altrimenti la linea si sporca. Fuori soglia =
       rombo, sempre, anche quando i punti non si mostrano */
    var mostraPunti = n <= 14;
    serie.forEach(function (S, si) {
      var ult = ultimoIndice(S.valori);
      S.valori.forEach(function (v, i) {
        if (!num(v)) return;
        var oltre = soglia != null && !sogliaFuori && v > soglia;
        var cx = px(i).toFixed(1), cy = py(v).toFixed(1);
        if (oltre) {
          svg.appendChild(nodo('path', {
            'class': 'dwg-oltre',
            d: 'M' + cx + ' ' + (py(v) - 5.4).toFixed(1) + 'L' + (px(i) + 5.4).toFixed(1) + ' ' + cy +
               'L' + cx + ' ' + (py(v) + 5.4).toFixed(1) + 'L' + (px(i) - 5.4).toFixed(1) + ' ' + cy + 'Z',
            style: 'animation-delay:' + (0.2 + i * 0.012) + 's'
          }));
        } else if (i === ult) {
          svg.appendChild(nodo('circle', { 'class': 'dwg-fine s' + (si + 1), cx: cx, cy: cy, r: 4.4, style: 'animation-delay:.42s' }));
        } else if (mostraPunti) {
          svg.appendChild(nodo('circle', { 'class': 'dwg-pt s' + (si + 1), cx: cx, cy: cy, r: 3.2, style: 'animation-delay:' + (0.2 + i * 0.02) + 's' }));
        }
      });
    });

    /* etichette selettive: l'ultimo valore della prima serie, e basta */
    var ultI = ultimoIndice(serie[0].valori);
    if (ultI >= 0 && s.etichetteValore !== false) {
      var uv = serie[0].valori[ultI];
      var tx = px(ultI), ty = py(uv) - 11;
      var anc = tx > box.x1 - 44 ? 'end' : 'middle';
      svg.appendChild(nodo('text', {
        'class': 'dwg-vallab', x: tx.toFixed(1), y: Math.max(box.y0 + 9, ty).toFixed(1), 'text-anchor': anc
      }, conUnita(fmt(uv), s.unita)));
    }

    /* tacche: numeri arrotondati a sinistra, tempi sotto (mai tutti) */
    sc.tacche.forEach(function (v, i) {
      svg.appendChild(nodo('text', { 'class': 'dwg-tick', x: box.x0 - 7, y: (py(v) + 3.4).toFixed(1), 'text-anchor': 'end' }, etY[i]));
    });
    var passoX = Math.max(1, Math.ceil(n / (largo >= 620 ? 8 : 5)));
    for (var i = 0; i < n; i += passoX) etichettaX(svg, x[i], px(i), box, n, i);
    if (n > 1 && (n - 1) % passoX !== 0) etichettaX(svg, x[n - 1], px(n - 1), box, n, n - 1);
    if (s.unita) svg.appendChild(nodo('text', { 'class': 'dwg-axlab', x: 0, y: box.y1 + 15, 'text-anchor': 'start' }, s.unita));

    /* ── crosshair + tooltip: il puntatore mira a una data, non a una linea ── */
    var mira = nodo('g', { opacity: '0' });
    var cross = nodo('line', { 'class': 'dwg-cross', y1: box.y0, y2: box.y1, x1: 0, x2: 0 });
    mira.appendChild(cross);
    var anelli = serie.map(function (_, si) {
      var c = nodo('circle', { 'class': 'dwg-mira', r: 6, cx: 0, cy: 0, stroke: 'currentColor' });
      mira.appendChild(c); return c;
    });
    svg.appendChild(mira);
    g._mira = mira;

    var velo = nodo('rect', { 'class': 'dwg-hit', x: box.x0 - 6, y: box.y0, width: box.x1 - box.x0 + 12, height: box.y1 - box.y0 + 8 });
    svg.appendChild(velo);

    function vicino(clientX) {
      var r = svg.getBoundingClientRect();
      var u = (clientX - r.left) * (largo / r.width);
      var i = n === 1 ? 0 : Math.round((u - box.x0) / ((box.x1 - box.x0) / (n - 1)));
      return Math.max(0, Math.min(n - 1, i));
    }
    function punta(i, clientX, clientY) {
      if (i === g._idx && g._tip && g._tip.classList.contains('on')) { /* già lì */ }
      g._idx = i;
      var X = px(i);
      cross.setAttribute('x1', X.toFixed(1)); cross.setAttribute('x2', X.toFixed(1));
      var righe = [];
      serie.forEach(function (S, si) {
        var v = S.valori[i];
        var a = anelli[si];
        if (!num(v)) { a.setAttribute('opacity', '0'); return; }
        a.setAttribute('opacity', '1');
        a.setAttribute('cx', X.toFixed(1)); a.setAttribute('cy', py(v).toFixed(1));
        a.setAttribute('r', 6.4);
        a.style.stroke = 'var(--card)';
        a.style.fill = 'var(--dwg-c' + (si + 1) + ')';
        var oltre = soglia != null && !sogliaFuori && v > soglia;
        righe.push({
          nome: (serie.length > 1 ? S.nome : '') + (oltre ? (serie.length > 1 ? ' · ' : '') + 'oltre soglia' : ''),
          valore: conUnita(fmt(v), s.unita),
          cls: oltre ? 'stato-danger' : 's' + (si + 1)
        });
      });
      mira.setAttribute('opacity', '1');
      var r = svg.getBoundingClientRect();
      var sx = clientX != null ? clientX - r.left : (X / largo) * r.width;
      var sy = clientY != null ? Math.min(clientY - r.top, r.height) : r.height * 0.4;
      g.mostraTip(sx, sy, String(x[i]), righe, soglia != null && !sogliaFuori ? 'soglia ' + conUnita(fmt(soglia), s.unita) : null);
    }
    g.on(velo, 'pointermove', function (e) { punta(vicino(e.clientX), e.clientX, e.clientY); });
    g.on(velo, 'pointerdown', function (e) { punta(vicino(e.clientX), e.clientX, e.clientY); });
    g.on(velo, 'pointerleave', function () { g.nascondiTip(); });
    g.on(svg, 'blur', function () { g.nascondiTip(); });
    g.on(svg, 'keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var i = g._idx < 0 ? 0 : g._idx + (e.key === 'ArrowRight' ? 1 : -1);
        punta(Math.max(0, Math.min(n - 1, i)));
      } else if (e.key === 'Escape') { g.nascondiTip(); }
    });

    /* ── legenda: da due serie in su c'è sempre ── */
    if (serie.length > 1) {
      serie.forEach(function (S, si) {
        g.legenda.appendChild(vocelegenda(
          [nodo('line', { 'class': 'dwg-linea s' + (si + 1), x1: 1, y1: 5.5, x2: 21, y2: 5.5 })], S.nome || ('Serie ' + (si + 1))));
      });
    }
    if (soglia != null && !sogliaFuori) {
      g.legenda.appendChild(vocelegenda([nodo('line', { 'class': 'dwg-soglia', x1: 1, y1: 5.5, x2: 21, y2: 5.5 })],
        (s.soglia.etichetta || 'soglia') + ' ', conUnita(fmt(soglia), s.unita)));
      var quanti = 0;
      serie.forEach(function (S) { S.valori.forEach(function (v) { if (num(v) && v > soglia) quanti++; }); });
      if (quanti) g.legenda.appendChild(vocelegenda(
        [nodo('path', { 'class': 'dwg-oltre', d: 'M11 .6L16 5.5L11 10.4L6 5.5Z' })], 'oltre soglia: ', String(quanti), 'dg'));
    }
    if (sogliaFuori) {
      g.piede.appendChild(div('dwg-nota', 'La soglia (' + conUnita(fmt(soglia), s.unita) + ') è molto più alta dei valori misurati: resta fuori dalla scala, che si adatta alle letture per farne vedere l\'andamento.'));
    }

    /* ── tabella ── */
    var intest = ['Quando'].concat(serie.map(function (S, i) { return S.nome || ('Serie ' + (i + 1)); }));
    var righeTab = [];
    for (var r2 = 0; r2 < n; r2++) {
      righeTab.push([String(x[r2])].concat(serie.map(function (S) {
        return num(S.valori[r2]) ? conUnita(fmt(S.valori[r2]), s.unita) : '—';
      })));
    }
    g.tabella(intest, righeTab);
  }

  function etichettaX(svg, testo, X, box, n, i) {
    var anc = X <= box.x0 + 16 ? 'start' : X >= box.x1 - 16 ? 'end' : 'middle';
    svg.appendChild(nodo('text', { 'class': 'dwg-tick', x: X.toFixed(1), y: box.y1 + 15, 'text-anchor': anc }, String(testo)));
  }

  function primoIndice(v) { for (var i = 0; i < v.length; i++) if (num(v[i])) return i; return 0; }
  function ultimoIndice(v) { for (var i = v.length - 1; i >= 0; i--) if (num(v[i])) return i; return -1; }

  /* percorso con curva morbida (Catmull-Rom addolcito): niente spigoli, ma
     nemmeno gobbe che inventano valori mai misurati */
  function percorso(valori, px, py, curva) {
    var pts = [];
    valori.forEach(function (v, i) { if (num(v)) pts.push([px(i), py(v)]); });
    if (!pts.length) return '';
    if (pts.length === 1) return 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1) + 'l0 0';
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    if (!curva || pts.length === 2) {
      for (var i = 1; i < pts.length; i++) d += 'L' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
      return d;
    }
    for (var j = 0; j < pts.length - 1; j++) {
      var p0 = pts[j - 1] || pts[j], p1 = pts[j], p2 = pts[j + 1], p3 = pts[j + 2] || p2;
      var t = 0.19;
      var c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      var c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ',' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) +
           ',' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }

  function ariaLinea(s, serie, fmt, vmax) {
    return (s.titolo || 'Andamento') + ': ' + serie.length + (serie.length === 1 ? ' serie' : ' serie') +
      ', massimo ' + conUnita(fmt(vmax), s.unita) + '.';
  }

  function vuoto(g, testo) {
    var d = div('dwg-nota', testo);
    g.wrap.appendChild(d);
  }

  /* ══════════════════════════════════════════════════════════════════════
     2 · BARRE (verticali e orizzontali, ordinabili tipo Pareto)
     ══════════════════════════════════════════════════════════════════════ */

  function disegnaBarre(g) {
    var s = g.spec, fmt = formatterDi(s);
    var dati = (s.valori || []).filter(function (v) { return v && num(v.valore); });
    if (!dati.length) { vuoto(g, 'Nessun dato da mostrare'); return; }
    if (s.ordina) dati = dati.slice().sort(function (a, b) { return b.valore - a.valore; });

    var oriz = s.orientamento === 'orizzontale';
    var largo = g._larg;
    var totale = dati.reduce(function (a, b) { return a + b.valore; }, 0);
    var vmax = Math.max.apply(null, dati.map(function (d) { return d.valore; }));
    var sc = scala(Math.min(0, Math.min.apply(null, dati.map(function (d) { return d.valore; }))), vmax, oriz ? 4 : 4);

    /* taglio di Pareto: dove la somma arriva alla percentuale chiesta.
       È una tacca sull'UNICO asse — mai un secondo asse con un'altra scala. */
    var taglio = -1;
    if (s.taglio && s.ordina && totale > 0) {
      var acc = 0;
      for (var i = 0; i < dati.length; i++) { acc += dati[i].valore; if (acc / totale * 100 >= s.taglio) { taglio = i; break; } }
    }

    var svg, box, alto;
    if (oriz) {
      var etLargh = Math.min(largo * 0.38, Math.max.apply(null, dati.map(function (d) { return testoLargo(d.etichetta, 11); })) + 8);
      var passo = Math.max(26, Math.min(40, 34));
      alto = s.altezza || (dati.length * passo + 34);
      box = { x0: Math.round(etLargh) + 8, x1: largo - 8, y0: 6, y1: alto - 24 };
      svg = g.tela(largo, alto, s.aria || ariaBarre(s, dati, fmt), true);
      var bandaO = (box.y1 - box.y0) / dati.length;
      var spessO = Math.min(24, bandaO * 0.62);
      var pxv = function (v) { return box.x0 + (box.x1 - box.x0 - 46) * (v - sc.min) / (sc.max - sc.min); };

      sc.tacche.forEach(function (v) {
        svg.appendChild(nodo('line', { 'class': 'dwg-grid', x1: pxv(v).toFixed(1), y1: box.y0, x2: pxv(v).toFixed(1), y2: box.y1 }));
        svg.appendChild(nodo('text', { 'class': 'dwg-tick', x: pxv(v).toFixed(1), y: box.y1 + 14, 'text-anchor': 'middle' }, fmt(v)));
      });
      svg.appendChild(nodo('line', { 'class': 'dwg-ax', x1: pxv(0).toFixed(1), y1: box.y0, x2: pxv(0).toFixed(1), y2: box.y1 }));

      dati.forEach(function (d, i) {
        var cy = box.y0 + bandaO * (i + 0.5);
        var y = cy - spessO / 2, w = Math.max(2, pxv(d.valore) - pxv(0));
        svg.appendChild(nodo('rect', { 'class': 'dwg-hit', x: box.x0 - etLargh - 8, y: cy - bandaO / 2, width: box.x1 - box.x0 + etLargh + 8, height: bandaO, 'data-i': i }));
        svg.appendChild(barraPath(pxv(0), y, w, spessO, 4, true, classeBarra(d, i, taglio, s)));
        svg.appendChild(nodo('text', { 'class': 'dwg-catlab', x: box.x0 - 8, y: (cy + 3.8).toFixed(1), 'text-anchor': 'end' }, d.etichetta));
        svg.appendChild(nodo('text', { 'class': 'dwg-vallab', x: (pxv(d.valore) + 7).toFixed(1), y: (cy + 4).toFixed(1), 'text-anchor': 'start' }, conUnita(fmt(d.valore), s.unita)));
      });
      if (taglio >= 0 && taglio < dati.length - 1) {
        var yTag = box.y0 + bandaO * (taglio + 1);
        svg.appendChild(nodo('line', { 'class': 'dwg-taglio', x1: box.x0 - 4, y1: yTag.toFixed(1), x2: box.x1, y2: yTag.toFixed(1) }));
      }
      collegaBarre(g, svg, dati, fmt, s, taglio, totale);
    } else {
      alto = s.altezza || (largo >= 620 ? 240 : 200);
      var etY2 = sc.tacche.map(function (v) { return fmt(v); });
      var mSx2 = Math.max(28, Math.round(Math.max.apply(null, etY2.map(function (t) { return testoLargo(t, 10); }))) + 12);
      box = { x0: mSx2, x1: largo - 10, y0: 22, y1: alto - 30 };
      svg = g.tela(largo, alto, s.aria || ariaBarre(s, dati, fmt));
      var banda = (box.x1 - box.x0) / dati.length;
      var spess = Math.min(24, banda * 0.6);
      var pyv = function (v) { return box.y1 - (box.y1 - box.y0) * (v - sc.min) / (sc.max - sc.min); };

      sc.tacche.forEach(function (v, i2) {
        svg.appendChild(nodo('line', { 'class': 'dwg-grid', x1: box.x0, y1: pyv(v).toFixed(1), x2: box.x1, y2: pyv(v).toFixed(1) }));
        svg.appendChild(nodo('text', { 'class': 'dwg-tick', x: box.x0 - 7, y: (pyv(v) + 3.4).toFixed(1), 'text-anchor': 'end' }, etY2[i2]));
      });
      svg.appendChild(nodo('line', { 'class': 'dwg-ax', x1: box.x0, y1: pyv(0).toFixed(1), x2: box.x1, y2: pyv(0).toFixed(1) }));

      var etichettaTutte = dati.length <= 8;
      dati.forEach(function (d, i) {
        var cx = box.x0 + banda * (i + 0.5);
        var x = cx - spess / 2, y = pyv(d.valore), h = Math.max(2, pyv(0) - y);
        svg.appendChild(nodo('rect', { 'class': 'dwg-hit', x: (cx - banda / 2).toFixed(1), y: box.y0 - 14, width: banda.toFixed(1), height: box.y1 - box.y0 + 26, 'data-i': i }));
        svg.appendChild(barraPath(x, y, spess, h, 4, false, classeBarra(d, i, taglio, s)));
        var et = String(d.etichetta);
        if (testoLargo(et, 11) > banda) et = et.slice(0, Math.max(2, Math.floor(banda / 6))) + '…';
        svg.appendChild(nodo('text', { 'class': 'dwg-catlab', x: cx.toFixed(1), y: box.y1 + 15, 'text-anchor': 'middle' }, et));
        if (etichettaTutte || d.valore === vmax) {
          svg.appendChild(nodo('text', { 'class': 'dwg-vallab', x: cx.toFixed(1), y: (y - 7).toFixed(1), 'text-anchor': 'middle' }, fmt(d.valore)));
        }
      });
      if (taglio >= 0 && taglio < dati.length - 1) {
        var xTag = box.x0 + banda * (taglio + 1);
        svg.appendChild(nodo('line', { 'class': 'dwg-taglio', x1: xTag.toFixed(1), y1: box.y0 - 6, x2: xTag.toFixed(1), y2: box.y1 }));
      }
      if (s.unita) svg.appendChild(nodo('text', { 'class': 'dwg-axlab', x: 0, y: box.y1 + 15, 'text-anchor': 'start' }, s.unita));
      collegaBarre(g, svg, dati, fmt, s, taglio, totale);
    }

    /* legenda: serve solo se ci sono stati in gioco o il taglio di Pareto */
    var stati = {};
    dati.forEach(function (d) { if (d.stato) stati[d.stato] = true; });
    Object.keys(stati).forEach(function (k) {
      g.legenda.appendChild(vocelegenda(
        [nodo('rect', { 'class': 'dwg-barra st-' + k, x: 2, y: 2, width: 18, height: 7, rx: 2 })],
        { ok: 'a posto', warn: 'da tenere d\'occhio', danger: 'critico' }[k] || k));
    });
    if (taglio >= 0) {
      g.legenda.appendChild(vocelegenda([nodo('line', { 'class': 'dwg-taglio', x1: 1, y1: 5.5, x2: 21, y2: 5.5 })],
        'qui si arriva al ', s.taglio + '% del totale'));
    }
    g.tabella(['Voce', conUnita('Valore', s.unita), 'Quota'], dati.map(function (d) {
      return [String(d.etichetta), fmt(d.valore), totale ? (d.valore / totale * 100).toFixed(1).replace('.', ',') + '%' : '—'];
    }));
  }

  function classeBarra(d, i, taglio, s) {
    if (d.stato) return 'st-' + d.stato;
    if (taglio >= 0) return i <= taglio ? 'c1' : 'coda';
    if (s.rampa) return 'r' + Math.min(5, i + 1);
    return 'c1';
  }

  /* estremo del dato arrotondato (4px), squadrato sulla linea di base */
  function barraPath(x, y, w, h, r, oriz, cls) {
    r = Math.min(r, oriz ? h / 2 : w / 2, oriz ? w : h);
    var d;
    if (oriz) {
      d = 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'H' + (x + w - r).toFixed(1) +
          'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'V' + (y + h - r).toFixed(1) +
          'a' + r + ' ' + r + ' 0 0 1 ' + (-r) + ' ' + r + 'H' + x.toFixed(1) + 'Z';
    } else {
      d = 'M' + x.toFixed(1) + ' ' + (y + h).toFixed(1) + 'V' + (y + r).toFixed(1) +
          'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + (-r) + 'h' + (w - 2 * r).toFixed(1) +
          'a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + 'V' + (y + h).toFixed(1) + 'Z';
    }
    return nodo('path', { 'class': 'dwg-barra ' + cls, d: d });
  }

  function collegaBarre(g, svg, dati, fmt, s, taglio, totale) {
    var evid = nodo('rect', { 'class': 'dwg-evid', opacity: '0', x: 0, y: 0, width: 0, height: 0, rx: 6 });
    svg.insertBefore(evid, svg.firstChild);
    g._evid = evid;
    var acc = 0, cum = dati.map(function (d) { acc += d.valore; return totale ? acc / totale * 100 : 0; });

    function mostra(hit, e) {
      var i = +hit.getAttribute('data-i');
      var d = dati[i];
      evid.setAttribute('x', hit.getAttribute('x'));
      evid.setAttribute('y', hit.getAttribute('y'));
      evid.setAttribute('width', hit.getAttribute('width'));
      evid.setAttribute('height', hit.getAttribute('height'));
      evid.setAttribute('opacity', '1');
      var r = svg.getBoundingClientRect();
      var sx = e ? e.clientX - r.left : (+hit.getAttribute('x') + +hit.getAttribute('width') / 2) / +svg.viewBox.baseVal.width * r.width;
      var sy = e ? e.clientY - r.top : r.height / 2;
      g.mostraTip(sx, sy, d.etichetta, [{
        valore: conUnita(fmt(d.valore), s.unita),
        nome: d.stato ? ({ ok: 'a posto', warn: 'da tenere d\'occhio', danger: 'critico' }[d.stato] || d.stato) : '',
        cls: d.stato ? 'stato-' + d.stato : (taglio >= 0 ? (i <= taglio ? 's1' : 's3') : 's1')
      }], totale ? (s.ordina ? 'quota ' + (d.valore / totale * 100).toFixed(1).replace('.', ',') + '% · cumulata ' + cum[i].toFixed(0) + '%'
        : 'quota ' + (d.valore / totale * 100).toFixed(1).replace('.', ',') + '%') : null);
    }
    g.on(svg, 'pointermove', function (e) {
      var hit = e.target.closest && e.target.closest('.dwg-hit');
      if (hit) mostra(hit, e); else g.nascondiTip();
    });
    g.on(svg, 'pointerdown', function (e) {
      var hit = e.target.closest && e.target.closest('.dwg-hit');
      if (hit) mostra(hit, e);
    });
    g.on(svg, 'pointerleave', function () { g.nascondiTip(); });
    g.on(svg, 'blur', function () { g.nascondiTip(); });
    var k = -1;
    g.on(svg, 'keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { if (e.key === 'Escape') g.nascondiTip(); return; }
      e.preventDefault();
      k = Math.max(0, Math.min(dati.length - 1, k + (e.key === 'ArrowRight' ? 1 : -1)));
      var hits = svg.querySelectorAll('.dwg-hit');
      if (hits[k]) mostra(hits[k], null);
    });
  }

  function ariaBarre(s, dati, fmt) {
    var top = dati.slice().sort(function (a, b) { return b.valore - a.valore; })[0];
    return (s.titolo || 'Confronto') + ': ' + dati.length + ' voci, la più alta è ' +
      top.etichetta + ' con ' + conUnita(fmt(top.valore), s.unita) + '.';
  }

  /* ══════════════════════════════════════════════════════════════════════
     3 · CIAMBELLA — composizione, SOLO con poche voci
     ══════════════════════════════════════════════════════════════════════ */

  function disegnaCiambella(g) {
    var s = g.spec, fmt = formatterDi(s);
    var dati = (s.valori || []).filter(function (v) { return v && num(v.valore) && v.valore > 0; });
    if (!dati.length) { vuoto(g, 'Nessun dato da mostrare'); return; }
    dati = dati.slice().sort(function (a, b) { return b.valore - a.valore; });

    var maxVoci = s.maxVoci || 6;
    /* La forma segue il compito: oltre il limite la ciambella smette di
       raccontare qualcosa e si passa alle barre. Non si chiede il permesso. */
    if (dati.length > maxVoci + 1) {
      var s2 = {};
      for (var k in s) s2[k] = s[k];
      s2.tipo = 'barre'; s2.orientamento = 'orizzontale'; s2.ordina = true; s2.valori = dati;
      s2.nota = (s.nota ? s.nota + ' ' : '') + 'Le voci sono ' + dati.length + ': una ciambella con così tanti spicchi non si legge, quindi le stesse quote sono in barre ordinate.';
      g.spec = s2;
      disegnaBarre(g);
      return;
    }
    /* le voci oltre il limite si accorpano in "Altro" (tinta neutra: non è
       una categoria, è il resto) */
    if (dati.length > maxVoci) {
      var resto = dati.slice(maxVoci - 1).reduce(function (a, b) { return a + b.valore; }, 0);
      dati = dati.slice(0, maxVoci - 1).concat([{ etichetta: 'Altro', valore: resto, altro: true }]);
    }

    var totale = dati.reduce(function (a, b) { return a + b.valore; }, 0);
    var largo = g._larg;
    var lato = Math.min(largo, s.altezza || 230);
    var alto = lato;
    var svg = g.tela(largo, alto, s.aria || ((s.titolo || 'Composizione') + ': ' + dati.length + ' voci, totale ' + conUnita(fmt(totale), s.unita) + '.'));

    var cx = largo / 2, cy = alto / 2;
    var raggio = Math.min(lato, alto) / 2 - 16;
    var spessore = Math.max(20, Math.min(34, raggio * 0.36));
    var r = raggio - spessore / 2;
    var C = 2 * Math.PI * r;
    var gap = 2;                       /* 2px di superficie fra una fetta e l'altra */

    svg.appendChild(nodo('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'var(--dwg-track)', 'stroke-width': spessore }));

    var off = 0;
    var fette = [];
    dati.forEach(function (d, i) {
      var L = C * (d.valore / totale);
      var c = nodo('circle', {
        'class': 'dwg-fetta ' + (d.altro ? 'altro' : 'r' + Math.min(5, i + 1)),
        cx: cx, cy: cy, r: r, 'stroke-width': spessore,
        'stroke-dasharray': Math.max(0.5, L - gap).toFixed(2) + ' ' + (C - Math.max(0.5, L - gap)).toFixed(2),
        transform: 'rotate(-90 ' + cx + ' ' + cy + ')'
      });
      var finale = -off;
      c.setAttribute('stroke-dashoffset', s.animazione === false ? finale : -off + L);
      c.style.transitionDelay = (i * 0.06) + 's';
      svg.appendChild(c);
      fette.push({ nodo: c, off: finale, d: d, i: i });
      off += L;
    });
    if (s.animazione !== false) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { fette.forEach(function (f) { f.nodo.setAttribute('stroke-dashoffset', f.off); }); });
      });
    }

    /* al centro il totale: un solo numero grande, come un quadrante */
    var etCentro = typeof s.centro === 'string' ? s.centro : (s.centro && s.centro.etichetta) || 'Totale';
    var vCentro = s.centro && s.centro.valore != null ? s.centro.valore : totale;
    var testoC = conUnita(fmt(vCentro), s.unita);
    var dim = Math.min(30, Math.max(15, (2 * r - spessore - 12) / (testoC.length * 0.56)));
    svg.appendChild(nodo('text', { 'class': 'dwg-centro-n', x: cx, y: cy + dim * 0.16, style: 'font-size:' + dim.toFixed(1) + 'px' }, testoC));
    svg.appendChild(nodo('text', { 'class': 'dwg-centro-l', x: cx, y: cy + dim * 0.16 + 15 }, etCentro));

    /* aree di tocco: settori larghi quanto l'anello più il margine del dito */
    var off2 = 0;
    dati.forEach(function (d, i) {
      var a0 = off2 / totale * 2 * Math.PI - Math.PI / 2;
      var a1 = (off2 + d.valore) / totale * 2 * Math.PI - Math.PI / 2;
      off2 += d.valore;
      var rIn = Math.max(2, r - spessore / 2 - 8), rOut = r + spessore / 2 + 8;
      svg.appendChild(nodo('path', { 'class': 'dwg-hit', 'data-i': i, d: settore(cx, cy, rIn, rOut, a0, a1) }));
    });
    collegaFette(g, svg, dati, totale, fmt, s);

    /* legenda: la ciambella non è leggibile senza. Ordine = ordine delle fette */
    dati.forEach(function (d, i) {
      g.legenda.appendChild(vocelegenda(
        [nodo('rect', { 'class': 'dwg-barra ' + (d.altro ? 'coda' : 'r' + Math.min(5, i + 1)), x: 2, y: 1.5, width: 18, height: 8, rx: 2 })],
        d.etichetta + ' ', (d.valore / totale * 100).toFixed(1).replace('.', ',') + '%'));
    });
    g.tabella(['Voce', conUnita('Valore', s.unita), 'Quota'], dati.map(function (d) {
      return [String(d.etichetta), fmt(d.valore), (d.valore / totale * 100).toFixed(1).replace('.', ',') + '%'];
    }));
  }

  function settore(cx, cy, r0, r1, a0, a1) {
    var grande = (a1 - a0) > Math.PI ? 1 : 0;
    var p = function (r, a) { return [(cx + r * Math.cos(a)).toFixed(2), (cy + r * Math.sin(a)).toFixed(2)]; };
    var A = p(r1, a0), B = p(r1, a1), Cc = p(r0, a1), D = p(r0, a0);
    return 'M' + A[0] + ' ' + A[1] + 'A' + r1 + ' ' + r1 + ' 0 ' + grande + ' 1 ' + B[0] + ' ' + B[1] +
      'L' + Cc[0] + ' ' + Cc[1] + 'A' + r0 + ' ' + r0 + ' 0 ' + grande + ' 0 ' + D[0] + ' ' + D[1] + 'Z';
  }

  function collegaFette(g, svg, dati, totale, fmt, s) {
    function mostra(hit, e) {
      var i = +hit.getAttribute('data-i'), d = dati[i];
      var fetta = svg.querySelectorAll('.dwg-fetta')[i];
      svg.querySelectorAll('.dwg-fetta').forEach(function (f, j) { f.style.opacity = j === i ? '1' : '.5'; });
      var r = svg.getBoundingClientRect();
      g.mostraTip(e ? e.clientX - r.left : r.width / 2, e ? e.clientY - r.top : r.height / 2,
        d.etichetta, [{ valore: conUnita(fmt(d.valore), s.unita), nome: '', cls: d.altro ? '' : 's1' }],
        (d.valore / totale * 100).toFixed(1).replace('.', ',') + '% del totale');
      if (fetta) fetta.style.opacity = '1';
    }
    function spegni() {
      svg.querySelectorAll('.dwg-fetta').forEach(function (f) { f.style.opacity = '1'; });
      g.nascondiTip();
    }
    g.on(svg, 'pointermove', function (e) {
      var hit = e.target.closest && e.target.closest('.dwg-hit');
      if (hit) mostra(hit, e); else spegni();
    });
    g.on(svg, 'pointerdown', function (e) {
      var hit = e.target.closest && e.target.closest('.dwg-hit');
      if (hit) mostra(hit, e);
    });
    g.on(svg, 'pointerleave', spegni);
    g.on(svg, 'blur', spegni);
    var k = -1;
    g.on(svg, 'keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') { if (e.key === 'Escape') spegni(); return; }
      e.preventDefault();
      k = Math.max(0, Math.min(dati.length - 1, k + (e.key === 'ArrowRight' ? 1 : -1)));
      var hits = svg.querySelectorAll('.dwg-hit');
      if (hits[k]) mostra(hits[k], null);
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     4 · SPARKLINE — dentro una tessera, senza assi né etichette
     ══════════════════════════════════════════════════════════════════════ */

  function disegnaSpark(g) {
    var s = g.spec;
    var v = (s.valori || []).filter(function (x) { return num(x); });
    if (v.length < 2) { vuoto(g, '—'); return; }
    var w = s.larghezza || 120, h = s.altezza || 34;
    var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
    if (s.soglia != null) { min = Math.min(min, s.soglia); max = Math.max(max, s.soglia); }
    if (max === min) { max = min + 1; }
    var px = function (i) { return 2 + (w - 4) * i / (v.length - 1); };
    var py = function (y) { return h - 3 - (h - 6) * (y - min) / (max - min); };

    var svg = nodo('svg', {
      'class': 'dwg-svg dwg-spark', viewBox: '0 0 ' + w + ' ' + h, role: 'img',
      'aria-label': s.aria || ('Andamento delle ultime ' + v.length + ' rilevazioni: da ' + v[0] + ' a ' + v[v.length - 1] + '.'),
      style: 'width:' + w + 'px;height:' + h + 'px'
    });
    if (s.animazione !== false) svg.classList.add('dwg-anim');
    g.svg = svg;
    g.wrap.appendChild(svg);
    g.radice.classList.add('nudo');

    var d = percorso(v, px, py, true);
    var defs = nodo('defs');
    var grad = nodo('linearGradient', { id: g.id + 's', x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(nodo('stop', { 'class': 'dwg-a0', offset: '0' }));
    grad.appendChild(nodo('stop', { 'class': 'dwg-a1', offset: '1' }));
    defs.appendChild(grad); svg.appendChild(defs);
    if (s.area !== false) svg.appendChild(nodo('path', { 'class': 'dwg-area', fill: 'url(#' + g.id + 's)', d: d + 'L' + px(v.length - 1).toFixed(1) + ' ' + (h - 1) + 'L' + px(0).toFixed(1) + ' ' + (h - 1) + 'Z' }));
    if (s.soglia != null) svg.appendChild(nodo('line', { 'class': 'dwg-soglia', x1: 1, y1: py(s.soglia).toFixed(1), x2: w - 1, y2: py(s.soglia).toFixed(1) }));
    svg.appendChild(nodo('path', { 'class': 'dwg-linea', d: d, pathLength: '1' }));
    var ult = v[v.length - 1];
    var oltre = s.soglia != null && ult > s.soglia;
    if (oltre) {
      var X = px(v.length - 1), Y = py(ult);
      svg.appendChild(nodo('path', { 'class': 'dwg-oltre', d: 'M' + X.toFixed(1) + ' ' + (Y - 4).toFixed(1) + 'L' + (X + 4).toFixed(1) + ' ' + Y.toFixed(1) + 'L' + X.toFixed(1) + ' ' + (Y + 4).toFixed(1) + 'L' + (X - 4).toFixed(1) + ' ' + Y.toFixed(1) + 'Z' }));
    } else {
      svg.appendChild(nodo('circle', { 'class': 'dwg-fine s1', cx: px(v.length - 1).toFixed(1), cy: py(ult).toFixed(1), r: 3 }));
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     5 · BARRA DI AVANZAMENTO con tacca di riferimento
     ══════════════════════════════════════════════════════════════════════ */

  function disegnaAvanzamento(g) {
    var s = g.spec, fmt = formatterDi(s);
    var massimo = num(s.massimo) ? s.massimo : 100;
    var valore = num(s.valore) ? Math.max(0, Math.min(massimo, s.valore)) : 0;
    var largo = g._larg;
    var hBarra = s.spessore || 16;
    var conTacca = s.riferimento && num(s.riferimento.valore);
    var alto = s.altezza || (hBarra + (conTacca ? 30 : 14));
    var quota = massimo ? valore / massimo : 0;

    var stato = s.stato || null;
    var svg = g.tela(largo, alto, s.aria || ((s.titolo || 'Avanzamento') + ': ' + conUnita(fmt(valore), s.unita) + ' su ' + conUnita(fmt(massimo), s.unita) +
      (conTacca ? ', riferimento a ' + conUnita(fmt(s.riferimento.valore), s.unita) : '')), true);

    var y = conTacca ? 16 : 4;
    var r = hBarra / 2;
    svg.appendChild(nodo('rect', { 'class': 'dwg-track', x: 0, y: y, width: largo, height: hBarra, rx: r }));
    var w = Math.max(hBarra * 0.6, largo * quota);
    var fill = nodo('rect', { 'class': 'dwg-fill' + (stato ? ' st-' + stato : ''), x: 0, y: y, width: w.toFixed(1), height: hBarra, rx: r });
    svg.appendChild(fill);
    svg.appendChild(nodo('rect', { 'class': 'dwg-riflesso', x: 2, y: y + 1.5, width: Math.max(0, w - 4).toFixed(1), height: Math.max(1, hBarra * 0.30).toFixed(1), rx: Math.max(1, hBarra * 0.15) }));

    if (conTacca) {
      var xr = largo * Math.max(0, Math.min(1, s.riferimento.valore / massimo));
      svg.appendChild(nodo('line', { 'class': 'dwg-tacca-orlo', x1: xr.toFixed(1), y1: y - 4, x2: xr.toFixed(1), y2: y + hBarra + 4 }));
      svg.appendChild(nodo('line', { 'class': 'dwg-tacca', x1: xr.toFixed(1), y1: y - 4, x2: xr.toFixed(1), y2: y + hBarra + 4 }));
      var et = (s.riferimento.etichetta || 'riferimento') + ' ' + conUnita(fmt(s.riferimento.valore), s.unita);
      var anc = xr > largo - testoLargo(et, 10) ? 'end' : xr < testoLargo(et, 10) / 2 ? 'start' : 'middle';
      svg.appendChild(nodo('text', { 'class': 'dwg-tick', x: xr.toFixed(1), y: y + hBarra + 18, 'text-anchor': anc }, et));
    }
    /* il valore raggiunto, una volta sola, sopra la barra */
    if (s.etichettaValore !== false) {
      var tx = Math.min(largo, Math.max(testoLargo(fmt(valore), 11.5), w));
      svg.appendChild(nodo('text', {
        'class': 'dwg-vallab', x: tx.toFixed(1), y: (y - 5).toFixed(1),
        'text-anchor': tx > largo - 30 ? 'end' : 'middle'
      }, conUnita(fmt(valore), s.unita)));
    }
    g.on(svg, 'pointermove', function (e) {
      var rr = svg.getBoundingClientRect();
      g.mostraTip(e.clientX - rr.left, e.clientY - rr.top, s.titolo || 'Avanzamento',
        [{ valore: conUnita(fmt(valore), s.unita), nome: 'su ' + conUnita(fmt(massimo), s.unita), cls: stato ? 'stato-' + stato : 's1' }],
        (quota * 100).toFixed(1).replace('.', ',') + '%' + (conTacca ? ' · riferimento ' + conUnita(fmt(s.riferimento.valore), s.unita) : ''));
    });
    g.on(svg, 'pointerleave', function () { g.nascondiTip(); });
  }

  /* ══════════════════════════════════════════════════════════════════════
     API pubblica
     ══════════════════════════════════════════════════════════════════════ */

  function disegna(rif, spec) {
    var el = bersaglio(rif);
    if (!el) { if (global.console) console.warn('[dwGrafici] contenitore non trovato:', rif); return null; }
    /* un contenitore, un grafico: si ridisegna sopra senza accumulare */
    if (el.__dwg) { el.__dwg.distruggi(); }
    var g = new Grafico(el, spec || {});
    el.__dwg = g;
    return g;
  }
  function conTipo(t) {
    return function (rif, spec) {
      spec = spec || {}; spec.tipo = t;
      return disegna(rif, spec);
    };
  }

  var api = {
    disegna: disegna,
    linea: conTipo('linea'),
    barre: conTipo('barre'),
    ciambella: conTipo('ciambella'),
    sparkline: conTipo('sparkline'),
    avanzamento: conTipo('avanzamento'),
    /* comodità per chi formatta a mano fuori dai grafici */
    formato: { numero: fmtInt, decimale: fmtDec, euro: fmtEur, compatto: compatto },
    versione: '1.0'
  };

  global.dwGrafici = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;

})(typeof window !== 'undefined' ? window : globalThis);
