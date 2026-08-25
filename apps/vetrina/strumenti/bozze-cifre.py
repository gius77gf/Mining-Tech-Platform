# -*- coding: utf-8 -*-
"""Cinque bozze per il blocco «8 APP · 1 ACCESSO», da guardare e scegliere.
⛔ Si generano dalla STESSA fonte del sito (colori delle app, marchio, scala
   tipografica): una bozza disegnata a parte mostrerebbe qualcosa che poi non
   si puo' costruire uguale."""
import io, os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import contenuto as C

TINTE = [(a[0], a[2], a[3]) for a in C.APP if a[0] != "Deepwork ID"]   # le otto app
FONDO = C.sfondo("fascia") or ""

BASE = """
:root{--nero:#08090c;--inch:#f4f1ea;--inch2:#a8a496;--fumo:#8d8878;--ambra:#ffab00;
  --ambra2:#ffd071;--grad:linear-gradient(120deg,#ffc02e,#ff7a00);
  --bordo:rgba(244,241,234,.10);--bordo2:rgba(244,241,234,.18);--posa:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box}
body{margin:0;background:var(--nero);color:var(--inch);font-family:'Barlow',system-ui,sans-serif;
  font-size:17px;-webkit-font-smoothing:antialiased}
.disp{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800;text-transform:uppercase;
  line-height:.9;letter-spacing:1px}
.bozza{position:relative;overflow:hidden;border-bottom:1px solid var(--bordo)}
.bozza .foto{position:absolute;inset:0;overflow:hidden}
.bozza .foto img{width:100%;height:100%;object-fit:cover;filter:saturate(.55) brightness(.8)}
.bozza .foto::after{content:'';position:absolute;inset:0;background:rgba(8,9,12,.84)}
.bozza .d{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:78px 24px}
.eti{position:absolute;left:18px;top:14px;z-index:3;font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#08090c;
  background:var(--ambra);padding:4px 12px;border-radius:4px}
.nota{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:0 24px 30px;
  font-size:13.5px;color:var(--fumo)}
s{text-decoration:none}
"""

def bozza(n, titolo, nota, dentro, css=""):
    return ('<style>%s</style><section class="bozza"><span class="eti">Bozza %d — %s</span>'
            '<span class="foto"><img src="%s" alt=""></span>'
            '<div class="d">%s</div><p class="nota">%s</p></section>') % (css, n, titolo, FONDO, dentro, nota)

# ── 1 ─ quella di adesso, per confronto ──────────────────────────────────
B1 = bozza(1, "quella di adesso", "Due numeri grandi e un filo in mezzo. Sobria, e non dice quali sono le otto.",
  '<div class="c1"><div><b>8</b><s>App</s></div><div><b>1</b><s>Accesso</s></div></div>', """
.c1{display:flex;gap:110px;justify-content:center;text-align:center}
.c1 div{min-width:140px;position:relative}
.c1 div+div::before{content:'';position:absolute;left:-56px;top:12%;bottom:12%;width:1px;
  background:linear-gradient(180deg,transparent,var(--bordo2),transparent)}
.c1 b{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:132px;
  line-height:.86;background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;filter:drop-shadow(0 12px 40px rgba(255,140,0,.34))}
.c1 s{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:16px;
  letter-spacing:5px;text-transform:uppercase;color:var(--inch);margin-top:14px}""")

# ── 2 ─ otto tessere nei colori veri ─────────────────────────────────────
tessere = "".join('<i style="--t:%s" title="%s"></i>' % (c, n) for n, c, _ in TINTE)
B2 = bozza(2, "otto tessere che si accendono",
  "Ogni tessera e' il colore vero di un'app. Si accendono a una a una: dice «sono otto e sono diverse» mostrandolo.",
  '<div class="c2"><div class="tess">%s</div><div class="numeri"><b>8</b><s>App</s>'
  '<em>+</em><b>1</b><s>Accesso</s></div></div>' % tessere, """
.c2{text-align:center}
.tess{display:flex;gap:14px;justify-content:center;margin-bottom:44px}
.tess i{width:56px;height:56px;border-radius:13px;background:var(--t);display:block;
  box-shadow:0 0 34px color-mix(in srgb,var(--t) 50%,transparent),inset 0 1px 0 rgba(255,255,255,.28)}
.numeri{display:flex;align-items:baseline;gap:18px;justify-content:center}
.numeri b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:104px;line-height:.86;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.numeri s{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:4px;
  text-transform:uppercase;color:var(--inch2)}
.numeri em{font-style:normal;font-size:40px;color:var(--fumo);margin:0 14px}""")

# ── 3 ─ una barra sola a otto segmenti ───────────────────────────────────
segm = "".join('<i style="--t:%s"><s>%s</s></i>' % (c, n) for n, c, _ in TINTE)
B3 = bozza(3, "una barra sola, otto segmenti",
  "La metafora e' letterale: otto pezzi diversi che formano un pezzo solo. I nomi stanno sotto ogni segmento.",
  '<div class="c3"><div class="testa"><b>8</b><s>app</s></div><div class="barra">%s</div>'
  '<div class="coda"><b>1</b><s>accesso</s></div></div>' % segm, """
.c3{max-width:940px;margin:0 auto}
.testa,.coda{display:flex;align-items:baseline;gap:14px}
.coda{justify-content:flex-end}
.testa b,.coda b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:78px;line-height:.9;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.testa s,.coda s{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:15px;letter-spacing:4px;
  text-transform:uppercase;color:var(--inch2)}
.barra{display:flex;margin:20px 0;border-radius:12px;overflow:hidden;height:64px;
  box-shadow:0 18px 50px rgba(0,0,0,.6)}
.barra i{flex:1;background:var(--t);position:relative;display:grid;place-items:end center;padding-bottom:8px}
.barra i s{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:10.5px;letter-spacing:1.6px;
  text-transform:uppercase;color:rgba(8,9,12,.78)}""")

# ── 4 ─ i nomi in cerchio attorno all'uno ────────────────────────────────
import math
cer = "".join('<i style="--t:%s;--x:%.1fpx;--y:%.1fpx">%s</i>'
              % (c, 210 * math.cos(k / 8 * 2 * math.pi - math.pi / 2),
                 210 * math.sin(k / 8 * 2 * math.pi - math.pi / 2), n)
              for k, (n, c, _) in enumerate(TINTE))
B4 = bozza(4, "gli otto nomi attorno all'uno",
  "Gli otto nomi girano piano attorno a un 1 grande: l'accesso al centro e' quello che le tiene insieme.",
  '<div class="c4"><div class="ruota">%s</div><b>1</b><s>accesso</s></div>' % cer, """
.c4{position:relative;height:470px;display:grid;place-items:center}
.ruota{position:absolute;inset:0;display:grid;place-items:center}
.ruota i{position:absolute;translate:var(--x) var(--y);font-style:normal;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:19px;letter-spacing:2.4px;
  text-transform:uppercase;color:var(--t);white-space:nowrap;
  text-shadow:0 0 22px color-mix(in srgb,var(--t) 60%,transparent)}
.c4 b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:170px;line-height:.8;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 60px rgba(255,140,0,.5))}
.c4 s{position:absolute;bottom:118px;font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:15px;letter-spacing:5px;text-transform:uppercase;color:var(--inch)}""")

# ── 5 ─ il marchio al centro e le otto attorno ───────────────────────────
B5 = bozza(5, "il marchio al centro",
  "Il marchio originale e' il centro; le otto app gli stanno intorno come una corona. Dice la gerarchia senza scriverla.",
  '<div class="c5"><div class="raggi">%s</div><div class="mrk">%s</div>'
  '<div class="sotto"><b>8</b><s>app</s><em>·</em><b>1</b><s>accesso</s></div></div>'
  % ("".join('<i style="--t:%s;--x:%.1fpx;--y:%.1fpx">%s</i>'
             % (c, 250 * math.cos(k / 8 * 2 * math.pi - math.pi / 2),
                150 * math.sin(k / 8 * 2 * math.pi - math.pi / 2), n)
             for k, (n, c, _) in enumerate(TINTE)), C.marchio(150)), """
.c5{position:relative;height:430px;display:grid;place-items:center}
.raggi{position:absolute;inset:0;display:grid;place-items:center}
.raggi i{position:absolute;translate:var(--x) var(--y);font-style:normal;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;letter-spacing:2.2px;
  text-transform:uppercase;color:var(--t);white-space:nowrap;opacity:.9;
  text-shadow:0 0 20px color-mix(in srgb,var(--t) 55%,transparent)}
.mrk{position:relative;display:grid;place-items:center}
.mrk svg{filter:drop-shadow(0 0 60px rgba(255,150,0,.55))}
.sotto{position:absolute;bottom:16px;display:flex;align-items:baseline;gap:12px}
.sotto b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:56px;line-height:.9;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.sotto s{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;letter-spacing:4px;
  text-transform:uppercase;color:var(--inch2)}
.sotto em{font-style:normal;color:var(--fumo)}""")

io.open(sys.argv[1], "w", encoding="utf-8").write(
  '<title>Cinque bozze — 8 app, 1 accesso</title>'
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600&display=swap">'
  '<style>%s</style>%s' % (BASE, B1 + B2 + B3 + B4 + B5))
print("cinque bozze scritte")
