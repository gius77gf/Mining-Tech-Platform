# -*- coding: utf-8 -*-
"""IL SITO DI PRESENTAZIONE. Niente concetti: un sito di prodotto fatto bene.
Struttura classica e collaudata — ingresso · prova · storia · le app · invito
finale · piede — eseguita con la cura che fa la differenza: una scala di
spaziature sola, una scala tipografica sola, bordi e ombre coerenti, e il
movimento al servizio del contenuto invece che al posto suo.
"""
import base64, glob, io, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import contenuto as C

# ⛔ DUE SERIE, NON UNA. La stessa stringa base64 finiva in tre finestre, ma
#    due di quelle tre rendono a 200-290 px: 3,7 MB di pagina spesi in pixel
#    che nessuno vede, su un tetto di 16. `SIM` e' la serie a 880 (la finestra
#    grande), `SIM_P` quella a 440 (le due piccole e la scheda).
SIM, SIM_P = {}, {}
_s = os.path.join(os.path.dirname(os.path.abspath(__file__)), "schermate")
for _d, _dest in ((_s, SIM), (os.path.join(_s, "piccole"), SIM_P)):
    for f in sorted(glob.glob(os.path.join(_d, "*.jpg"))):
        with open(f, "rb") as h:
            _dest.setdefault(os.path.basename(f).rsplit("-", 1)[0], []).append(
                "data:image/jpeg;base64," + base64.b64encode(h.read()).decode("ascii"))

CSS = """
:root{
  /* una scala sola per tutto: se un valore non e' qui, non si usa */
  --s1:6px;--s2:12px;--s3:20px;--s4:32px;--s5:52px;--s6:84px;--s7:136px;
  --nero:#08090c;--sotto:#0d0f14;--carta:#12151c;--carta2:#171b24;
  --inch:#f4f1ea;--inch2:#a8a496;--fumo:#8d8878;
  --ambra:#ffab00;--ambra2:#ffd071;--grad:linear-gradient(120deg,#ffc02e,#ff7a00);
  --bordo:rgba(244,241,234,.10);--bordo2:rgba(244,241,234,.18);
  --misura:1200px;
  /* ⛔ Quanto c'e' da qui al bordo dello schermo. NON `calc(50% - 50vw)`: una
     percentuale di margine si risolve sulla LARGHEZZA DELLA CELLA di griglia,
     non del contenitore, quindi in una griglia a due colonne quel calcolo
     sbordava di 250 px e buttava fuori schermo la finestrella e il pop-up. */
  --sbordo:calc((100vw - min(1200px,100vw)) / 2 + 20px);
  --posa:cubic-bezier(.16,1,.3,1);--r:14px}
*{box-sizing:border-box}
html{overflow-x:clip;scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--nero);color:var(--inch);overflow-x:clip;
  font-family:'Barlow',system-ui,-apple-system,sans-serif;font-size:17px;line-height:1.62;
  -webkit-font-smoothing:antialiased;
  background-image:radial-gradient(1200px 600px at 50% -8%,rgba(255,140,0,.10),transparent 60%)}
a{color:inherit;text-decoration:none}
img{max-width:100%}
.g{max-width:var(--misura);margin:0 auto;padding:0 var(--s3)}
.disp{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800;text-transform:uppercase;
  line-height:.95;letter-spacing:1.2px}
.occhio{display:inline-flex;align-items:center;gap:9px;font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:11.5px;letter-spacing:3.2px;text-transform:uppercase;color:var(--ambra)}
.occhio::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ambra);
  box-shadow:0 0 12px rgba(255,171,0,.7)}

/* ── BOTTONI ──────────────────────────────────────────────────────────*/
.bot{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:14px;letter-spacing:2.2px;
  text-transform:uppercase;display:inline-flex;align-items:center;justify-content:center;gap:9px;
  min-height:52px;padding:0 28px;border-radius:9px;white-space:nowrap;position:relative;overflow:hidden;
  transition:transform .22s var(--posa),box-shadow .28s var(--posa),background .25s var(--posa),border-color .25s var(--posa)}
.bot.pri{background:var(--grad);color:#1a1002;box-shadow:0 10px 34px rgba(255,140,0,.28)}
.bot.pri:hover{transform:translateY(-2px);box-shadow:0 16px 46px rgba(255,140,0,.4)}
.bot.sec{border:1px solid var(--bordo2);background:rgba(244,241,234,.045);backdrop-filter:blur(10px)}
.bot.sec:hover{border-color:var(--inch2);background:rgba(244,241,234,.09);transform:translateY(-2px)}
.bot:active{transform:translateY(0)}
.bot:focus-visible{outline:2px solid var(--ambra);outline-offset:3px}

/* ── BARRA ────────────────────────────────────────────────────────────*/
.barra{position:fixed;top:0;left:0;right:0;z-index:40;transition:background .3s var(--posa),border-color .3s var(--posa)}
.barra .d{max-width:var(--misura);margin:0 auto;padding:var(--s2) var(--s3);display:flex;align-items:center;gap:var(--s3)}
body.mossa .barra{background:rgba(8,9,12,.82);backdrop-filter:blur(18px) saturate(1.3);
  border-bottom:1px solid var(--bordo)}
.barra .segno{display:flex;align-items:center;gap:10px}
.barra .segno b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;
  letter-spacing:3.4px;text-transform:uppercase}
.barra nav{margin-left:auto;display:flex;gap:var(--s4)}
.barra nav a{font-size:13px;letter-spacing:1.6px;text-transform:uppercase;color:var(--inch2);
  position:relative;padding:6px 0;transition:color .22s var(--posa)}
.barra nav a::after{content:'';position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--ambra);
  transform:scaleX(0);transform-origin:right;transition:transform .3s var(--posa)}
.barra nav a:hover{color:var(--inch)}
.barra nav a:hover::after{transform:scaleX(1);transform-origin:left}
.barra .bot{min-height:42px;padding:0 20px;font-size:12.5px}
@media(max-width:860px){.barra nav{display:none}.barra .bot{margin-left:auto}}

/* ── INGRESSO ─────────────────────────────────────────────────────────*/
.ingresso{padding:calc(var(--s7) + 40px) 0 var(--s6);text-align:center;position:relative}
.ingresso .marca{position:relative;display:inline-block;
  opacity:0;transform:translateY(14px) scale(.96);animation:su .95s var(--posa) .06s forwards}
.ingresso .marca svg{display:block;width:clamp(96px,11vw,146px);height:auto;
  filter:drop-shadow(0 10px 34px rgba(255,150,0,.36))}
@keyframes su{to{opacity:1;transform:none}}
.ingresso h1{margin:var(--s4) 0 0;font-size:clamp(34px,5.6vw,76px);max-width:22ch;
  margin-inline:auto;text-wrap:balance}
.ingresso h1 .r{display:block;overflow:hidden;padding-bottom:.05em}
.ingresso h1 .r>span{display:block;transform:translateY(106%);animation:sali 1.05s var(--posa) .3s forwards}
.ingresso h1 .r:nth-child(2)>span{animation-delay:.42s}
.ingresso h1 em{font-style:normal;background:var(--grad);-webkit-background-clip:text;
  background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
@keyframes sali{to{transform:translateY(0)}}
.ingresso .sott{max-width:52ch;margin:var(--s3) auto 0;font-size:clamp(17px,1.9vw,21px);color:var(--inch2);
  opacity:0;animation:app 1s var(--posa) .74s forwards}
@keyframes app{to{opacity:1}}
.ingresso .az{display:flex;gap:var(--s2);justify-content:center;flex-wrap:wrap;margin-top:var(--s4);
  opacity:0;animation:app 1s var(--posa) .88s forwards}
.ingresso .sotto-az{margin-top:var(--s2);font-size:13px;color:var(--inch2);
  opacity:0;animation:app 1s var(--posa) 1s forwards}

/* la vetrina del prodotto: tre finestre in composizione, subito sotto il titolo */
.mostra{position:relative;margin:var(--s6) auto 0;max-width:1080px;
  opacity:0;animation:app 1.2s var(--posa) 1.05s forwards}
.mostra .f{position:absolute;overflow:hidden;border-radius:11px;background:#0b0c10;
  border:1px solid var(--bordo2);box-shadow:0 40px 90px rgba(0,0,0,.66)}
.mostra .f img{display:block;width:100%;height:auto}
.mostra .f.c{position:relative;width:74%;margin:0 auto;z-index:3;
  box-shadow:0 46px 110px rgba(0,0,0,.76),0 0 0 1px rgba(255,171,0,.10)}
.mostra .f.sx{width:44%;left:0;bottom:8%;z-index:2;transform:rotate(-3deg) translateX(-4%)}
.mostra .f.dx{width:44%;right:0;bottom:8%;z-index:2;transform:rotate(3deg) translateX(4%)}
.mostra::after{content:'';position:absolute;left:-8%;right:-8%;bottom:-16%;height:46%;
  background:radial-gradient(60% 100% at 50% 100%,rgba(255,140,0,.18),transparent 70%);
  pointer-events:none;filter:blur(24px)}
@media(max-width:800px){.mostra .f.sx,.mostra .f.dx{display:none}.mostra .f.c{width:100%}}

/* ── LA STRISCIA DELLE APP ────────────────────────────────────────────*/
.striscia{border-top:1px solid var(--bordo);border-bottom:1px solid var(--bordo);
  padding:var(--s4) 0;margin-top:var(--s7);background:rgba(13,15,20,.6)}
.striscia .d{display:flex;flex-wrap:wrap;gap:var(--s2) var(--s5);align-items:center;justify-content:center}
.striscia .e{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:11px;
  letter-spacing:3px;text-transform:uppercase;color:var(--fumo);width:100%;text-align:center;
  margin-bottom:var(--s2)}
.striscia a{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:19px;letter-spacing:2.4px;
  text-transform:uppercase;color:var(--fumo);transition:color .25s var(--posa)}
.striscia a:hover{color:var(--ac)}

/* ── SEZIONI ──────────────────────────────────────────────────────────*/
.sez{padding:var(--s7) 0 0}
.capo{max-width:34ch;margin-bottom:var(--s6)}
.capo.mezzo{margin-inline:auto;text-align:center;max-width:40ch}
.capo h2{margin:var(--s2) 0 0;font-size:clamp(32px,4.6vw,60px);text-wrap:balance}
.capo p{margin:var(--s3) 0 0;color:var(--inch2)}

/* ── LA STORIA ────────────────────────────────────────────────────────*/
.storia{display:grid;gap:var(--s3)}
@media(min-width:900px){.storia{grid-template-columns:repeat(3,1fr);gap:var(--s4)}}
.passo{padding:var(--s4);border:1px solid var(--bordo);border-radius:var(--r);
  background:linear-gradient(180deg,var(--carta),var(--sotto));position:relative;overflow:hidden;
  transition:border-color .3s var(--posa),transform .3s var(--posa)}
.passo:hover{border-color:var(--bordo2);transform:translateY(-3px)}
.passo::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:linear-gradient(180deg,rgba(244,241,234,.05),transparent 40%)}
.passo b{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;
  letter-spacing:2.6px;text-transform:uppercase;color:var(--ambra);margin-bottom:var(--s2)}
.passo h3{margin:0 0 var(--s2);font-size:21px;font-weight:600;line-height:1.3}
.passo p{margin:0;color:var(--inch2);font-size:15.5px}

/* ── LE APP ───────────────────────────────────────────────────────────*/
.app{position:relative;display:grid;gap:var(--s4);margin-bottom:var(--s7);align-items:center}
@media(min-width:1000px){
  .app{grid-template-columns:minmax(300px,.82fr) 1.18fr;gap:var(--s5)}
  .app.dx{grid-template-columns:1.18fr minmax(300px,.82fr)}
  .app.dx .testo{order:2}.app.dx .scena{order:1}
  .scena{margin-right:calc(-1 * var(--sbordo))}
  .app.dx .scena{margin-right:0;margin-left:calc(-1 * var(--sbordo))}
}
.testo .riga{display:flex;align-items:center;gap:var(--s2);flex-wrap:wrap}
.testo .nome{font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:clamp(32px,4vw,54px);letter-spacing:2.4px;text-transform:uppercase;color:var(--ac2);line-height:1}
.testo .tag{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:10.5px;
  letter-spacing:1.3px;text-transform:uppercase;padding:5px 11px;border-radius:20px;
  background:rgba(244,241,234,.09);color:var(--inch2);border:1px solid var(--bordo)}
.testo .tag.viva{background:rgba(102,187,106,.16);color:#9ade9d;border-color:rgba(102,187,106,.3)}
.testo .tag.corso{background:rgba(255,171,0,.14);color:var(--ambra2);border-color:rgba(255,171,0,.3)}
.testo .claim{margin:var(--s3) 0 var(--s2);font-size:clamp(20px,2.2vw,28px);font-weight:500;line-height:1.24;
  text-wrap:balance}
.testo p{margin:0 0 var(--s3);color:var(--inch2);font-size:16px;max-width:44ch}
.testo ul{list-style:none;margin:0 0 var(--s3);padding:0;display:grid;gap:10px}
.testo li{position:relative;padding-left:22px;font-size:15px}
.testo li::before{content:'';position:absolute;left:0;top:9px;width:7px;height:7px;border-radius:50%;
  background:var(--ac);box-shadow:0 0 10px color-mix(in srgb,var(--ac) 60%,transparent)}
.testo .chi{display:inline-flex;align-items:center;gap:10px;padding-top:var(--s2);
  border-top:1px solid var(--bordo);font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:var(--inch2)}
.testo .chi em{font-style:normal;color:var(--ac2);font-size:19px;line-height:1;transition:transform .3s var(--posa)}
.app:hover .testo .chi em{transform:translateX(6px)}

/* la scena: piu' piani a profondita' diversa, mossi dallo scorrimento.
   ⚠️ DUE ELEMENTI, NON UNO: `.orb` porta la PARALLASSE (nessuna transizione,
   deve seguire il dito) e `.fin` porta l'INGRESSO (transizione lunga). Messi
   sullo stesso elemento, la parallasse erediterebbe 1,1s di ritardo e
   strascicherebbe. */
.scena{position:relative;min-height:clamp(260px,33vw,470px);display:flex;align-items:center}
.scena::before{content:'';position:absolute;inset:-18% -12%;pointer-events:none;
  background:radial-gradient(56% 56% at 50% 50%,color-mix(in srgb,var(--ac) 26%,transparent),transparent 72%)}
.orb{position:absolute;pointer-events:none;
  transform:translate3d(calc(var(--tx,0) * var(--pax,0px)),calc(var(--y,0) * var(--par,0px)),0)}
.fin{position:absolute;inset:0;overflow:hidden;background:#0b0c10;border:1px solid var(--bordo2);
  border-radius:11px;box-shadow:0 36px 92px rgba(0,0,0,.74);opacity:0;
  transition:transform 1.15s var(--posa),opacity .95s var(--posa),box-shadow .5s var(--posa)}
.fin img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;
  display:block;opacity:0;transition:opacity .8s var(--posa)}
.fin img.viva{opacity:1}
/* ⛔ FUORI e DENTRO, non «sinistra» e «destra». La scena sborda dal lato dello
   SCHERMO (`margin-right` per le pari, `margin-left` per le dispari), quindi
   per una scena a destra il lato FUORI e' `right` e per una a sinistra e'
   `left` — e il rispecchiamento va scritto per tutt'e due. Sbagliarlo non
   produce un errore: produce una finestrella che entra NELLA COLONNA DEL TESTO
   e si siede sopra il nome dell'app, che e' esattamente cosa e' successo.
   ⚠️ E lo sbordo si paga in contenuto tagliato: a -17% della scena sparivano
   130 px di schermata, cioe' si vedeva MENO invece che di piu'. */
.orb.g{left:7%;right:-7%;top:3%;bottom:3%;z-index:1;--par:-30px;--pax:-11px}
.orb.p{left:-3%;width:37%;aspect-ratio:1180/738;bottom:-15%;z-index:3;--par:46px;--pax:20px}
.orb.t{right:4%;width:26%;aspect-ratio:1180/738;top:-12%;z-index:2;--par:-62px;--pax:15px}
.app.dx .orb.g{left:-7%;right:7%}
.app.dx .orb.p{left:auto;right:-3%}
.app.dx .orb.t{right:auto;left:4%}
/* il quarto piano: una FOTOGRAFIA di cantiere, non una schermata. Entra
   insieme alle altre e da' alla scena una cosa che nessuna schermata puo'
   dare — il posto in cui quel programma viene usato. */
.orb.f{left:-6%;width:25%;aspect-ratio:4/3;top:-16%;z-index:4;--par:58px;--pax:-26px}
.app.dx .orb.f{left:auto;right:-6%}
.orb.f .fin{border-radius:13px;box-shadow:0 26px 60px rgba(0,0,0,.86);
  transform:translateX(-84px) translateY(-30px) rotate(-3.4deg);transition-delay:.44s}
.app.dx .orb.f .fin{transform:translateX(84px) translateY(-30px) rotate(3.4deg)}
.app.viva .orb.f .fin{opacity:1;transform:rotate(-3.4deg)}
.app.dx.viva .orb.f .fin{transform:rotate(3.4deg)}
.orb.f .fin img{opacity:1;object-position:center;filter:saturate(.78) contrast(1.04)}
.orb.f .fin::after{content:'';position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(160deg,transparent 40%,color-mix(in srgb,var(--ac) 30%,transparent));
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ac) 34%,transparent)}
.orb.g .fin{transform:translateX(122px) rotate(-1.6deg)}
.orb.p .fin{transform:translateX(-96px) translateY(30px) rotate(2.6deg);transition-delay:.16s;
  box-shadow:0 28px 66px rgba(0,0,0,.82)}
.orb.t .fin{transform:translateX(96px) translateY(-36px) rotate(-3deg);transition-delay:.3s;
  box-shadow:0 24px 58px rgba(0,0,0,.8)}
.app.dx .orb.g .fin{transform:translateX(-122px) rotate(1.6deg)}
.app.dx .orb.p .fin{transform:translateX(96px) translateY(30px) rotate(-2.6deg)}
.app.dx .orb.t .fin{transform:translateX(-96px) translateY(-36px) rotate(3deg)}
.app.viva .orb.g .fin{opacity:1;transform:rotate(-1.6deg)}
.app.viva .orb.p .fin{opacity:1;transform:rotate(2.6deg)}
.app.viva .orb.t .fin{opacity:1;transform:rotate(-3deg)}
.app.dx.viva .orb.g .fin{transform:rotate(1.6deg)}
.app.dx.viva .orb.p .fin{transform:rotate(-2.6deg)}
.app.dx.viva .orb.t .fin{transform:rotate(3deg)}
.scena:hover .orb.g .fin{box-shadow:0 44px 110px rgba(0,0,0,.8),0 0 0 1px color-mix(in srgb,var(--ac) 40%,transparent)}

/* le finestrelle: dicono una cosa che quell'app sa dire, e poi galleggiano */
.pop{position:absolute;z-index:6;display:flex;align-items:center;gap:10px;max-width:250px;
  padding:11px 16px 11px 12px;border-radius:12px;font-size:13.5px;font-weight:500;line-height:1.3;
  background:rgba(11,13,18,.9);backdrop-filter:blur(16px) saturate(1.2);
  border:1px solid var(--bordo2);box-shadow:0 20px 50px rgba(0,0,0,.66);
  opacity:0;transform:translateY(16px) scale(.9);
  transition:opacity .6s var(--posa),transform .75s var(--posa)}
.pop svg{flex:none;width:20px;height:20px;padding:4px;border-radius:7px;
  background:color-mix(in srgb,var(--ac) 24%,transparent);
  border:1px solid color-mix(in srgb,var(--ac) 46%,transparent);color:var(--ac2)}
/* ⚠️ Le finestrelle restano DENTRO la scena: il corridoio fra scena e testo e'
   di 52 px, e una pastiglia larga 230 lo attraversa tutto. */
.pop.a{left:15%;top:30%;--par:44px;--pax:26px;transition-delay:.62s}
.pop.b{right:9%;bottom:5%;--par:-34px;--pax:-22px;transition-delay:.82s}
.app.dx .pop.a{left:auto;right:11%}
.app.dx .pop.b{right:auto;left:9%}
.app.viva .pop{opacity:1;transform:translateY(0) scale(1)}
.app.viva .pop.a{animation:galleggia 5.6s ease-in-out 1.5s infinite}
.app.viva .pop.b{animation:galleggia 6.4s ease-in-out 2.3s infinite}
@keyframes galleggia{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-8px) scale(1)}}

/* l'alone che segue il mouse — lo stesso comportamento del core */
.alone{position:absolute;inset:-14%;pointer-events:none;z-index:4;opacity:0;
  transition:opacity .45s var(--posa);
  background:radial-gradient(240px 240px at var(--mx,50%) var(--my,50%),
             color-mix(in srgb,var(--ac) 26%,transparent),transparent 68%)}
.scena:hover .alone{opacity:1}

.punti{position:absolute;left:3%;bottom:-11%;z-index:7;display:flex;gap:5px}
.app.dx .punti{left:auto;right:3%}
.punti i{display:block;width:16px;height:2px;border-radius:2px;background:rgba(244,241,234,.25);
  transition:background .35s var(--posa),width .35s var(--posa)}
.punti i.viva{background:var(--ac2);width:28px}
@media(max-width:999px){
  .scena{min-height:auto;padding:9% 0 15%}
  .orb.g{position:relative;left:auto;right:auto;top:auto;bottom:auto;width:100%;aspect-ratio:1180/738}
  .orb.p{width:46%;left:1%;bottom:-9%}.app.dx .orb.p{right:1%;left:auto}
  .orb.t{width:34%;right:-3%;top:-6%}.app.dx .orb.t{left:-3%;right:auto}
  .pop{font-size:12px;max-width:200px;padding:9px 13px 9px 10px}
  .pop.a{left:-2%;top:2%}.app.dx .pop.a{right:-2%;left:auto}
  .pop.b{right:2%;bottom:-3%}.app.dx .pop.b{left:2%;right:auto}
}
  .orb.f{width:31%;left:-2%;top:-9%}.app.dx .orb.f{right:-2%;left:auto}
}
@media(max-width:560px){.orb.t,.pop.b{display:none}}

.gruppo{display:flex;align-items:center;gap:var(--s3);margin:0 0 var(--s5)}
.gruppo b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:20px;letter-spacing:3px;
  text-transform:uppercase}
.gruppo i{flex:1;height:1px;background:linear-gradient(90deg,var(--bordo2),transparent)}
.gruppo s{font-size:13.5px;color:var(--fumo);text-decoration:none}
@media(max-width:760px){.gruppo s{display:none}}

/* ── INVITO FINALE ────────────────────────────────────────────────────*/
.invito{margin-top:var(--s7);padding:var(--s7) var(--s4);border-radius:24px;text-align:center;position:relative;
  overflow:hidden;border:1px solid var(--bordo2);
  background:radial-gradient(90% 130% at 50% 0%,rgba(255,140,0,.16),transparent 62%),
             linear-gradient(180deg,var(--carta2),var(--sotto))}
.invito h2{margin:var(--s3) 0 0;font-size:clamp(30px,4.6vw,58px);max-width:20ch;margin-inline:auto;text-wrap:balance}
.invito p{max-width:48ch;margin:var(--s3) auto 0;color:var(--inch2)}
.invito .az{display:flex;gap:var(--s2);justify-content:center;flex-wrap:wrap;margin-top:var(--s4)}

/* ── PIEDE ────────────────────────────────────────────────────────────*/
.piede{margin-top:var(--s7);border-top:1px solid var(--bordo);padding:var(--s6) 0 var(--s4)}
.piede .cols{display:grid;gap:var(--s5)}
@media(min-width:820px){.piede .cols{grid-template-columns:1.4fr 1fr 1fr}}
.piede .segno{display:flex;align-items:center;gap:10px;margin-bottom:var(--s2)}
.piede .segno b{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:17px;
  letter-spacing:3.4px;text-transform:uppercase}
.piede .cols p{margin:0;color:var(--inch2);font-size:15px;max-width:36ch}
.piede h4{margin:0 0 var(--s2);font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:11.5px;
  letter-spacing:2.6px;text-transform:uppercase;color:var(--fumo)}
.piede ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.piede ul a{font-size:14.5px;color:var(--inch2);transition:color .22s var(--posa)}
.piede ul a:hover{color:var(--inch)}
.piede .fondo{margin-top:var(--s5);padding-top:var(--s3);border-top:1px solid var(--bordo);
  display:flex;flex-wrap:wrap;gap:var(--s2) var(--s4);justify-content:space-between;align-items:center;
  font-size:12px;color:var(--fumo)}
.piede .fondo a{color:var(--inch2);text-decoration:underline;text-underline-offset:2px}

/* ── I FONDALI DI CANTIERE ────────────────────────────────────────────
   Una fotografia dietro una sezione, con il velo scuro sopra. Due regole che
   non si negoziano:
   1. il velo e' un COLORE PIENO con alfa, non una sfumatura, dove sopra ci va
      del testo: una sfumatura non e' misurabile dal banco del contrasto, che
      la dichiara «non giudicabile» — e un testo non giudicato non e' un testo
      a posto (il fondale sfumato resta solo dove sopra non c'e' niente);
   2. il fondale sta in un elemento SUO, non in un `::before` del contenitore:
      uno pseudo-elemento e' invisibile alla risalita degli antenati, quindi il
      banco del contrasto cercherebbe il fondo e troverebbe `transparent`.
      Costato gia' tre falsi allarmi il 23/08. */
.fondale{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.fondale img{position:absolute;left:-4%;right:-4%;top:-12%;width:108%;height:126%;
  object-fit:cover;display:block;filter:saturate(.62) contrast(1.04) brightness(.86);
  transform:translate3d(0,calc(var(--y,0) * 46px),0)}
.fondale .velo{position:absolute;inset:0;background:rgba(8,9,12,.8)}
.ingresso>.fondale .velo{background:rgba(8,9,12,.82)}
.fondale .sfuma{position:absolute;left:0;right:0;height:34%;pointer-events:none}
.fondale .sfuma.su{top:0;background:linear-gradient(180deg,var(--nero),transparent)}
.fondale .sfuma.giu{bottom:0;background:linear-gradient(0deg,var(--nero),transparent)}
.ingresso,.invito,.fascia{position:relative;isolation:isolate}
.ingresso>.g,.invito>*:not(.fondale){position:relative;z-index:1}

/* la fascia a tutta larghezza fra la storia e le app: la fotografia grande,
   una riga sola sopra, e il resto lo fa il silenzio */
.fascia{margin-top:var(--s7);padding:var(--s7) 0;overflow:hidden;
  border-top:1px solid var(--bordo);border-bottom:1px solid var(--bordo)}
.fascia .d{position:relative;z-index:1;max-width:var(--misura);margin:0 auto;padding:0 var(--s3);
  text-align:center}
.fascia h2{margin:var(--s3) 0 0;font-size:clamp(28px,4.2vw,54px);max-width:24ch;margin-inline:auto;
  text-wrap:balance}
.fascia p{max-width:50ch;margin:var(--s3) auto 0;color:var(--inch2)}
.fascia .cifre{display:flex;gap:var(--s5);justify-content:center;flex-wrap:wrap;margin-top:var(--s5)}
.fascia .cifre div{min-width:96px}
.fascia .cifre b{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:clamp(38px,5vw,64px);line-height:1;background:var(--grad);-webkit-background-clip:text;
  background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.fascia .cifre s{display:block;text-decoration:none;font-size:12px;letter-spacing:2.4px;
  text-transform:uppercase;color:var(--fumo);margin-top:8px}

/* la fotografia di lavoro dietro le finestre di ogni app, nella sua tinta */
.scena .lavoro{position:absolute;inset:-16% -12%;overflow:hidden;border-radius:30px;z-index:0;
  pointer-events:none;opacity:.72;-webkit-mask-image:radial-gradient(70% 70% at 50% 50%,#000 40%,transparent 82%);
  mask-image:radial-gradient(70% 70% at 50% 50%,#000 40%,transparent 82%)}
.scena .lavoro img{position:absolute;inset:0;width:100%;height:118%;object-fit:cover;display:block;
  filter:saturate(.5) contrast(1.05) brightness(.9);
  transform:translate3d(0,calc(var(--y,0) * 34px),0)}
.scena .lavoro::after{content:'';position:absolute;inset:0;
  background:linear-gradient(120deg,color-mix(in srgb,var(--ac) 30%,rgba(8,9,12,.6)),rgba(8,9,12,.52))}

.sale{opacity:0;transform:translateY(20px)}
.sale.dentro{opacity:1;transform:none;transition:opacity .8s var(--posa),transform .8s var(--posa)}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important}
  .sale,.ingresso .marca,.ingresso h1 .r>span,.ingresso .sott,.ingresso .az,.ingresso .sotto-az,.mostra{
    opacity:1!important;transform:none!important}
  .fin,.pop{opacity:1!important;transform:none!important}
  .orb{transform:none!important}
  .fondale img,.scena .lavoro img{transform:none!important}
}
"""

SPUNTA = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" '
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
          '<path d="M4 12.5 9.5 18 20 6.5"/></svg>')


def fondale(nome, alt, velo=True, sfuma=True):
    """Il fondale di una sezione — oppure la stringa VUOTA se la fotografia non
    c'e'. ⛔ Nessun ripiego su un'altra immagine: nove schede con le stesse tre
    foto a rotazione si leggono come una scelta sciatta, non come una mancanza
    (misurato il 23/08, e il fondatore l'ha detto per nome)."""
    u = C.sfondo(nome)
    if not u: return ""
    return ('<span class="fondale" aria-hidden="true"><img src="%s" alt="%s" loading="lazy">'
            '%s%s</span>') % (u, alt, '<span class="velo"></span>' if velo else "",
                              '<span class="sfuma su"></span><span class="sfuma giu"></span>' if sfuma else "")


def app_scena(a, k):
    """Una scena a QUATTRO piani piu' due finestrelle. Ogni piano si muove di una
    quantita' diversa (`--par`), cosi' lo scorrimento produce profondita' vera
    invece di una traslazione unica. Tre piani sono schermate VERE dell'app; il
    quarto e' una fotografia di cantiere, l'unica cosa che una schermata non
    sa dire."""
    nome, img, acc, acctx, prof, stato, cls, somm, desc, punti, achi, fam = a
    ch = nome.lower().replace(" ", "")
    sc = SIM.get(ch) or [C.dati(img)]
    scp = SIM_P.get(ch) or sc
    n = len(sc)
    def orb(cl, off):
        fonte = sc if cl == "g" else scp        # la grande a 880, le piccole a 440
        return ('<span class="orb %s"><span class="fin">%s</span></span>' % (cl, "".join(
            '<img src="%s" alt="Schermata di %s" loading="%s"%s>'
            % (fonte[(i + off) % n], nome, "eager" if i == 0 else "lazy",
               ' class="viva"' if i == 0 else "") for i in range(n))))
    foto = C.sfondo("app-" + ch)
    lav = ('<span class="lavoro" aria-hidden="true"><img src="%s" alt="" loading="lazy"></span>' % foto) if foto else ""
    scheda = ('<span class="orb f"><span class="fin"><img src="%s" alt="%s al lavoro in cantiere" loading="lazy"></span></span>'
              % (foto, nome)) if foto else ""
    piani = orb("g", 0) + scheda
    if n > 1:
        piani += orb("p", max(1, n // 3)) + orb("t", max(2, (2 * n) // 3))
    pop = "".join('<b class="pop %s">%s<span>%s</span></b>' % (lat, SPUNTA, testo)
                  for lat, (_, testo) in zip(("a", "b"), C.POPUP.get(nome, [])))
    pun = "".join('<i%s></i>' % (' class="viva"' if i == 0 else "") for i in range(n)) if n > 1 else ""
    li = "".join("<li>%s</li>" % x for x in punti)
    return ('<article class="app sale%s" id="app-%s" data-scatti="%d" style="--ac:%s;--ac2:%s">'
            '<div class="testo">'
            '<div class="riga"><span class="nome">%s</span><span class="tag %s">%s</span></div>'
            '<p class="claim">%s</p><p>%s</p><ul>%s</ul>'
            '<a class="chi" href="#">%s<em>&rsaquo;</em></a></div>'
            '<div class="scena">%s%s<span class="alone"></span>%s<span class="punti">%s</span></div>'
            '</article>') % (" dx" if k % 2 else "", ch, n, acc, acctx, nome, cls, stato,
                             somm, desc, li, achi, lav, piani, pop, pun)

blocchi, k = [], 0
for tit, sot in C.FAMIGLIE:
    dentro = [a for a in C.APP if a[11] == tit]
    s = "".join(app_scena(a, k + i) for i, a in enumerate(dentro)); k += len(dentro)
    blocchi.append('<div class="gruppo sale"><b>%s</b><i></i><s>%s</s></div>%s' % (tit, sot, s))

storia = "".join('<div class="passo sale"><b>%s</b><h3>%s</h3><p>%s</p></div>' % t for t in C.STORIA)
striscia = "".join('<a href="#app-%s" style="--ac:%s">%s</a>'
                   % (a[0].lower().replace(" ", ""), a[3], a[0]) for a in C.APP)
cifre = "".join("<div><b>%s</b><s>%s</s></div>" % c for c in C.CIFRE)
elenco = "".join('<li><a href="#app-%s">%s</a></li>'
                 % (a[0].lower().replace(" ", ""), a[0]) for a in C.APP)
_c = SIM.get("terra", [C.dati("terra.jpg")])
_l = SIM.get("scudo", [C.dati("scudo.jpg")])
_r = SIM.get("conti", [C.dati("conti.jpg")])

PAG = """<title>Deepwork — L'ecosistema del cantiere</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600&display=swap">
<style>@CSS@</style>
<header class="barra"><div class="d">
  <a class="segno" href="#"><span>@MARCHIO_P@</span><b>Deepwork</b></a>
  <nav><a href="#storia">La storia</a><a href="#app">Le app</a></nav>
  <a class="bot pri" href="#prova">Prova il tour</a>
</div></header>

<main>
  <section class="ingresso">@FOND_ING@
    <div class="g">
      <span class="marca">@MARCHIO_G@</span>
      <h1 class="disp"><span class="r"><span>@BENV_A@</span></span><span class="r"><span>@BENV_B@</span></span></h1>
      <p class="sott">@CLAIM@</p>
      <div class="az"><a class="bot pri" href="#prova">Prova il tour</a><a class="bot sec" href="#app">Guarda le app</a></div>
      <p class="sotto-az">Dati di esempio, nessuna registrazione: entri e provi.</p>
      <div class="mostra">
        <span class="f sx"><img src="@MSX@" alt="Scudo" loading="eager"></span>
        <span class="f dx"><img src="@MDX@" alt="Conti" loading="eager"></span>
        <span class="f c"><img src="@MC@" alt="Terra" loading="eager"></span>
      </div>
    </div>
  </section>

  <section class="striscia"><div class="g d"><span class="e">Otto app e un accesso unico</span>@STRISCIA@</div></section>

  <section class="sez" id="storia"><div class="g">
    <div class="capo sale"><span class="occhio">La storia</span>
      <h2 class="disp">Perché esiste</h2>
      <p>Non è nato come una suite. È nato da un problema che si ripeteva ogni giorno.</p></div>
    <div class="storia">@STORIA@</div>
  </div></section>

  <section class="fascia">@FOND_FAS@<div class="d">
    <span class="occhio">Dove nasce</span>
    <h2 class="disp">@TESI@</h2>
    <p>@TESI_SOTTO@</p>
    <div class="cifre">@CIFRE@</div>
  </div></section>

  <section class="sez" id="app"><div class="g">
    <div class="capo sale"><span class="occhio">Le app</span>
      <h2 class="disp">Ti presentiamo le app del nostro ecosistema</h2>
      <p>Ognuna fa il suo mestiere e funziona anche da sola. Insieme si passano il lavoro.</p></div>
    @BLOCCHI@
  </div></section>

  <section class="g" id="prova"><div class="invito">@FOND_INV@
    <span class="occhio">Provalo adesso</span>
    <h2 class="disp">@CHIUSURA@</h2>
    <p>Il tour apre le app con dati di esempio: puoi premere tutto, non si salva niente e non serve registrarsi.</p>
    <div class="az"><a class="bot pri" href="#">Prova il tour</a><a class="bot sec" href="#app">Rivedi le app</a></div>
  </div></section>
</main>

<footer class="piede"><div class="g">
  <div class="cols">
    <div><div class="segno">@MARCHIO_P@<b>Deepwork</b></div>
      <p>Otto app per il cantiere e un accesso unico. I dati di ogni impresa restano suoi.</p></div>
    <div><h4>Le app</h4><ul>@ELENCO@</ul></div>
    <div><h4>Il sito</h4><ul><li><a href="#storia">La storia</a></li><li><a href="#app">Le app</a></li><li><a href="#prova">Prova il tour</a></li></ul></div>
  </div>
  <div class="fondo"><span>Deepwork · ecosistema per il cantiere</span><span>@CREDITO@</span></div>
</div></footer>
<script>
(function(){
  var fermi=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var p=document.querySelectorAll('.sale');
  if(fermi||!('IntersectionObserver' in window)){
    for(var i=0;i<p.length;i++)p[i].classList.add('dentro');
    [].forEach.call(document.querySelectorAll('.app'),function(a){a.classList.add('viva');});
  } else {
    var o=new IntersectionObserver(function(v){v.forEach(function(x){if(!x.isIntersecting)return;
      x.target.classList.add('dentro');o.unobserve(x.target);});},{rootMargin:'0px 0px -8% 0px',threshold:.06});
    for(var j=0;j<p.length;j++)o.observe(p[j]);
    var oe=new IntersectionObserver(function(v){v.forEach(function(x){
      if(x.isIntersecting){x.target.classList.add('viva');oe.unobserve(x.target);}});},
      {rootMargin:'0px 0px -16% 0px',threshold:.12});
    [].forEach.call(document.querySelectorAll('.app'),function(a){oe.observe(a);});
  }
  /* le schermate si susseguono solo mentre l'app e' in vista */
  function mostra(s,n){
    var f=s.querySelectorAll('.fin'), pa=s.querySelectorAll('.punti i');
    for(var k=0;k<f.length;k++){var im=f[k].querySelectorAll('img');
      for(var i=0;i<im.length;i++)im[i].classList.toggle('viva',i===n);}
    for(var j=0;j<pa.length;j++)pa[j].classList.toggle('viva',j===n);
    s.dataset.ora=n;
  }
  var app=document.querySelectorAll('.app[data-scatti]');
  if(!fermi&&('IntersectionObserver' in window)){
    var os=new IntersectionObserver(function(v){v.forEach(function(x){
      var s=x.target,n=+s.dataset.scatti;
      if(x.isIntersecting){ if(n>1&&!s._t)s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},2700); }
      else if(s._t){clearInterval(s._t);s._t=null;}
    });},{rootMargin:'-10% 0px -10% 0px',threshold:.2});
    for(var r=0;r<app.length;r++){app[r].dataset.ora=0;os.observe(app[r]);}
    [].forEach.call(app,function(s){
      s.addEventListener('pointerenter',function(){var n=+s.dataset.scatti;if(n<2)return;
        if(s._t)clearInterval(s._t);mostra(s,((+s.dataset.ora||0)+1)%n);
        s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},1500);});
      s.addEventListener('pointerleave',function(){var n=+s.dataset.scatti;if(n<2)return;
        if(s._t)clearInterval(s._t);
        s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},2700);});
    });
  }
  /* PARALLASSE — ogni piano si muove di `--par`, la scena passa `--y` in
     [-1,1] secondo dove sta rispetto al centro dello schermo. Fatta con una
     variabile e non con `transform` diretti: cosi' il CSS resta il posto in
     cui si decide QUANTO si muove ogni piano. */
  var piani=[].slice.call(document.querySelectorAll('.scena,.mostra'));
  function muovi(){
    var h=window.innerHeight||800;
    for(var i=0;i<piani.length;i++){
      var e=piani[i],r=e.getBoundingClientRect();
      if(r.bottom<-260||r.top>h+260)continue;
      var c=(r.top+r.height/2-h/2)/h;
      e.style.setProperty('--y',(c<-1.3?-1.3:c>1.3?1.3:c).toFixed(3));
    }
  }
  if(!fermi){
    var pf=false;
    function chiedi(){if(pf)return;pf=true;requestAnimationFrame(function(){pf=false;muovi();});}
    addEventListener('scroll',chiedi,{passive:true});
    addEventListener('resize',chiedi);
    muovi();
    /* l'alone segue il mouse, e i piani si inclinano verso di lui */
    [].forEach.call(document.querySelectorAll('.scena'),function(sc){
      sc.addEventListener('pointermove',function(ev){
        var r=sc.getBoundingClientRect();
        var x=(ev.clientX-r.left)/(r.width||1), y=(ev.clientY-r.top)/(r.height||1);
        sc.style.setProperty('--mx',(x*100).toFixed(1)+'%');
        sc.style.setProperty('--my',(y*100).toFixed(1)+'%');
        sc.style.setProperty('--tx',((x-.5)*2).toFixed(3));
      });
      sc.addEventListener('pointerleave',function(){sc.style.setProperty('--tx','0');});
    });
  }
  var att=false;
  addEventListener('scroll',function(){if(att)return;att=true;requestAnimationFrame(function(){att=false;
    document.body.classList.toggle('mossa',(window.pageYOffset||0)>30);});},{passive:true});
})();
</script>
"""
io.open(sys.argv[1], "w", encoding="utf-8").write(
  PAG.replace("@CSS@", CSS).replace("@MARCHIO_P@", C.marchio(24)).replace("@MARCHIO_G@", C.marchio(110))
     .replace("@BENV_A@", C.BENVENUTO_A).replace("@BENV_B@", C.BENVENUTO_B).replace("@CLAIM@", C.CLAIM)
     .replace("@MSX@", _l[0]).replace("@MDX@", _r[0]).replace("@MC@", _c[0])
     .replace("@STRISCIA@", striscia).replace("@STORIA@", storia).replace("@BLOCCHI@", "".join(blocchi))
     .replace("@FOND_ING@", fondale("ingresso", "Un cantiere al lavoro"))
     .replace("@FOND_FAS@", fondale("fascia", "Macchine in cantiere"))
     .replace("@FOND_INV@", fondale("invito", "Cantiere all'opera"))
     .replace("@TESI@", C.ORIGINE_TITOLO).replace("@TESI_SOTTO@", C.ORIGINE_SOTTO)
     .replace("@CIFRE@", cifre)
     .replace("@ELENCO@", elenco).replace("@CHIUSURA@", C.CHIUSURA).replace("@CREDITO@", C.CREDITO))
print("sito di presentazione scritto")
