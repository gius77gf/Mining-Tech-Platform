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

# ⛔ SCURO E CHIARO SI ALTERNANO (punto 10 del fondatore, 24/08). Le schermate
#    chiare si chiamano `<app>c-N.jpg`: senza questa riga finivano sotto la
#    chiave «campoc», che nessuna app cerca, e sarebbero state 36 immagini
#    scaricate, convertite, committate e MAI MOSTRATE — senza che niente lo
#    dicesse. Il conto in fondo esiste per questo.
# ⚠️ Si alternano invece di accodarsi: in coda, chi guarda una scena per otto
#    secondi vede solo il tema scuro e la modalita' chiara non esiste.
def _carica(cartella, dest):
    grezzo = {}
    for f in sorted(glob.glob(os.path.join(cartella, "*.jpg"))):
        chiave = os.path.basename(f).rsplit("-", 1)[0]
        with open(f, "rb") as h:
            grezzo.setdefault(chiave, []).append(
                "data:image/jpeg;base64," + base64.b64encode(h.read()).decode("ascii"))
    for chiave, scuri in grezzo.items():
        if chiave.endswith("c") and chiave[:-1] in grezzo:
            continue                                  # e' la serie chiara di un'altra
        chiari = grezzo.get(chiave + "c", [])
        fuse = []
        for i in range(max(len(scuri), len(chiari))):
            if i < len(scuri):  fuse.append(scuri[i])
            if i < len(chiari): fuse.append(chiari[i])
        # ⛔ UN TETTO, E LA RAGIONE E' DOPPIA. Con dodici schermate il giro
        #    completo dura 32 secondi — nessuno sta fermo tanto, quindi meta'
        #    di quelle immagini non le vedrebbe nessuno — e la pagina passava
        #    da 7,8 a 9,4 MB su un tetto di 16. Otto alternate scuro/chiaro
        #    fanno 18 secondi e mostrano tutt'e due i temi due volte.
        dest[chiave] = fuse[:8]

_carica(_s, SIM)
_carica(os.path.join(_s, "piccole"), SIM_P)
_conto = {k: len(v) for k, v in sorted(SIM.items())}
print("schermate per app:", " · ".join("%s %d" % kv for kv in _conto.items()))

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
/* ⛔ L'OMBRA CHE GIRA — direttiva del fondatore (24/08), opzione «cicla sempre,
   ovunque», con la correzione che ha dettato: «piu' estesa ma meno luminosa,
   deve vedersi ma non deve impedire la lettura».
   Il colore e' una VARIABILE REGISTRATA: senza `@property` il browser non sa
   che `--ombra-tinta` e' un colore, quindi non lo interpola e il ciclo
   scatterebbe da una tinta all'altra invece di sfumare. Dove `@property` non
   c'e', il ciclo salta ma la pagina resta buona: e' un di piu', non un pilastro.
   ⚠️ I fotogrammi sono GENERATI dai colori delle app: scritti a mano, il giorno
   che nasce un'app o cambia una palette il ciclo mostrerebbe un colore che nel
   prodotto non esiste piu'. */
@property --ombra-tinta{syntax:'<color>';inherits:true;initial-value:#ffab00}
*{box-sizing:border-box}
html{overflow-x:clip;scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--nero);color:var(--inch);overflow-x:clip;
  font-family:'Barlow',system-ui,-apple-system,sans-serif;font-size:17px;line-height:1.62;
  -webkit-font-smoothing:antialiased;
  /* ⛔ MAI NERO PIATTO (fondatore 25/08: «preferirei che non ci fossero spazi
     vuoti»). Dove nessuna fotografia arriva, resta comunque una trama: due
     aloni caldi molto larghi e una texture finissima che toglie la sensazione
     di buco. Costa zero byte — e' tutto CSS. */
  background-image:
    radial-gradient(1200px 700px at 50% -6%,rgba(255,140,0,.11),transparent 62%),
    radial-gradient(900px 900px at 12% 38%,rgba(255,120,0,.045),transparent 60%),
    radial-gradient(1000px 800px at 88% 72%,rgba(120,150,255,.035),transparent 62%),
    repeating-linear-gradient(52deg,rgba(244,241,234,.014) 0 1px,transparent 1px 4px);
  background-attachment:fixed,fixed,fixed,scroll}
a{color:inherit;text-decoration:none}
/* la pagina sta SOPRA l'ombra: cosi' l'alone non passa mai davanti a una
   parola, e la richiesta «non deve impedire la lettura» e' garantita dalla
   struttura invece che da un valore di opacita' scelto a occhio */
.barra,main,.piede{position:relative;z-index:1}
.ombra{position:fixed;inset:-30vh -30vw;z-index:0;pointer-events:none;
  animation:giraTinta 150s linear infinite;   /* la durata la riscrive il movimento del cursore */
  background:radial-gradient(closest-side circle at var(--ox,50%) var(--oy,42%),
    color-mix(in srgb,var(--ombra-tinta) 34%,transparent) 0%,
    color-mix(in srgb,var(--ombra-tinta) 13%,transparent) 42%,transparent 74%);
  opacity:.34;filter:blur(34px)}
/* ⛔ SEMPRE PRESENTE. Prima l'ombra spariva dove un fondale copriva la pagina:
   `.ombra` sta dietro a `main`, e sopra una fotografia col suo velo non
   arrivava piu' niente. Adesso una seconda copia sta SOPRA tutto in `screen`,
   tenuta bassissima: si vede ovunque e non tocca la leggibilita' — la prova e'
   `contrasto-foto.mjs`, che legge i pixel veri con l'ombra accesa. */
.ombra.sopra{z-index:50;opacity:.13;mix-blend-mode:screen;filter:blur(46px)}
/* la stessa tinta bagna anche le fotografie, se no l'ombra sparisce ogni volta
   che passa sopra un fondale e sembra rotta */
.fondale .tinta{position:absolute;inset:0;pointer-events:none;
  background:color-mix(in srgb,var(--ombra-tinta) 15%,transparent);
  mix-blend-mode:soft-light}
@keyframes giraTinta{@FOTOGRAMMI@}
@media(prefers-reduced-motion:reduce){.ombra{animation:none}}
img{max-width:100%}
.g{max-width:var(--misura);margin:0 auto;padding:0 var(--s3)}
.disp{font-family:'Barlow Condensed',Impact,sans-serif;font-weight:800;text-transform:uppercase;
  line-height:.95;letter-spacing:1.2px}
.occhio{display:inline-flex;align-items:center;gap:9px;font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:11.5px;letter-spacing:3.2px;text-transform:uppercase;color:var(--ambra)}
.occhio::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ambra);
  box-shadow:0 0 12px rgba(255,171,0,.7)}

/* ⛔ LA PAROLA «DEEPWORK» — UNA VESTE SOLA, DEFINITA QUI E SOLO QUI.
   Regola ferrea del fondatore (24/08): «deve comparire sempre nella stessa
   colorazione ambrata». Prima la barra e il piede la scrivevano color panna e
   solo il titolo era ambra — tre posti, due colori, e nessuno se ne accorgeva
   perche' i tre posti non si vedono mai insieme.
   Chi aggiunge un punto in cui compare il nome usa QUESTA classe. Il controllo
   `strumenti/marchio-intatto.mjs` conta le occorrenze e le pretende tutte qui. */
.parola,.disp em{background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent}
@supports not (-webkit-background-clip:text){.parola,.disp em{color:var(--ambra2);
  -webkit-text-fill-color:var(--ambra2)}}

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
.ingresso .marca svg{display:block;width:clamp(180px,22vw,300px);height:auto;position:relative;z-index:2;
  filter:drop-shadow(0 14px 44px rgba(255,150,0,.5)) drop-shadow(0 0 90px rgba(255,120,0,.34))}
/* ⛔ «sembra spoglio»: sotto il marchio non c'era niente. Adesso ci sono tre
   strati che nascono dietro di lui e lo staccano dalla fotografia — un alone
   caldo che pulsa piano, un cerchio di luce netto, e un'aureola sottile. */
.ingresso .marca::before,.ingresso .marca::after{content:'';position:absolute;
  left:50%;top:48%;translate:-50% -50%;border-radius:50%;pointer-events:none;z-index:0}
.ingresso .marca::before{width:200%;aspect-ratio:1;
  background:radial-gradient(circle,rgba(255,150,0,.30),rgba(255,110,0,.12) 42%,transparent 68%);
  filter:blur(16px);animation:respira 7s ease-in-out infinite}
.ingresso .marca::after{width:118%;aspect-ratio:1;
  background:radial-gradient(circle,rgba(255,190,60,.20),transparent 62%);
  box-shadow:inset 0 0 0 1px rgba(255,171,0,.16),0 0 70px rgba(255,140,0,.24)}
@keyframes respira{0%,100%{opacity:.82;transform:scale(1)}50%{opacity:1;transform:scale(1.07)}}
@media(prefers-reduced-motion:reduce){.ingresso .marca::before{animation:none}}
@keyframes su{to{opacity:1;transform:none}}
.ingresso h1{margin:var(--s5) 0 0;font-size:clamp(34px,5.6vw,76px);max-width:22ch;
  margin-inline:auto;text-wrap:balance}
.ingresso h1 .r{display:block;overflow:hidden;padding-bottom:.05em}
.ingresso h1 .r>span{display:block;transform:translateY(106%);animation:sali 1.05s var(--posa) .3s forwards}
.ingresso h1 .r:nth-child(2)>span{animation-delay:.42s}
.ingresso h1 em{font-style:normal}
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
.mostra .f img{display:block;width:100%;height:auto;opacity:0;transition:opacity .8s var(--posa)}
.mostra .f img.viva{opacity:1}
.mostra .f img:not(:first-child){position:absolute;inset:0;height:100%;object-fit:cover;
  object-position:top center}
/* ⛔ `display:block` NON E' PLEONASTICO. `.f` e' uno <span>: finche' era
   `position:absolute` il browser lo rendeva blocco per effetto collaterale, e
   `width:74%` funzionava di rimbalzo. Tolta l'assoluta, e' tornato `inline` —
   e un inline IGNORA width e margin:auto in silenzio: la finestra centrale
   diventava larga quanto tutta la vetrina e ci si copriva le altre due.
   Nessun errore, nessuna regola rossa: solo una larghezza che non c'e' mai
   stata davvero, perche' dipendeva da un'altra proprieta'. */
.mostra .f.c{position:relative;display:block}
/* la firma sotto la vetrina: dice CHE COSA si sta guardando, che e' esattamente
   quello che mancava quando li' sotto c'era una schermata di Terra senza nome */
.mostra .etichetta{position:absolute;left:50%;transform:translateX(-50%);bottom:-46px;
  white-space:nowrap;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:13px;
  letter-spacing:3px;text-transform:uppercase;color:var(--inch2);z-index:5}
.mostra .etichetta em{font-style:normal}
@media(max-width:800px){.mostra .etichetta{bottom:-38px;font-size:11px;letter-spacing:2px}}
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
.striscia .e{margin-bottom:var(--s3)}
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
.capo.mezzo.sale h2{max-width:30ch;margin-inline:auto}
/* la frase del fondatore e' lunga: a 60px andava a sei righe */
#storia .capo h2{font-size:clamp(27px,3.5vw,44px);max-width:34ch}
.capo h2{margin:var(--s2) 0 0;font-size:clamp(32px,4.6vw,60px);text-wrap:balance}
.capo p{margin:var(--s3) 0 0;color:var(--inch2)}
.capo p.forte{font-size:clamp(17px,2vw,21px);color:var(--inch)}
.racconto{max-width:62ch;margin:0 auto var(--s6);text-align:center;color:var(--inch2);
  font-size:clamp(16px,1.8vw,18.5px)}

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
/* la prima scena sale di -26% col suo faro e di -12% con la finestrella in
   alto: senza questo respiro entra nell'intestazione della sezione */
.app:first-of-type{margin-top:var(--s6)}
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
/* ⛔ QUI C'ERA `.orb.f`, una scheda con la fotografia di cantiere. Tolta dal
   fondatore (24/08) e aveva ragione: ripeteva la STESSA immagine che sta sul
   fondo della scena, a mezzo metro di distanza. Due volte la stessa fotografia
   non e' «piu' immagini», e' un doppione che si nota. */
/* ⚠️ E TOGLIENDOLA MI SONO PORTATO VIA ANCHE QUESTE, che non c'entravano:
   il taglio arrivava fino a `.pop` e ha inghiottito tutte le regole d'ingresso.
   Effetto: le finestre restavano a `opacity:0` per sempre — nessun errore,
   nessuna regola rossa, solo tre scene vuote. L'ha preso una sonda che chiede
   al browser QUALI REGOLE COMBACIANO, non la rilettura del codice. */
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
.scena:hover .orb.g .fin{box-shadow:0 44px 110px rgba(0,0,0,.8),
  0 0 0 1px color-mix(in srgb,var(--ac) 40%,transparent)}
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
.pop.c{left:2%;bottom:26%;--par:56px;--pax:30px;transition-delay:1.02s}
.app.dx .pop.c{left:auto;right:2%}
.app.viva .pop.c{animation:galleggia 7.1s ease-in-out 3s infinite}
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
  .pop.c{left:-1%;bottom:34%}.app.dx .pop.c{right:-1%;left:auto}
}
  .orb.f{width:31%;left:-2%;top:-9%}.app.dx .orb.f{right:-2%;left:auto}
}
@media(max-width:560px){.orb.t,.pop.b,.pop.c{display:none}}



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
#storia>.fondale .velo{background:rgba(8,9,12,.88)}
.ingresso>.fondale .velo{background:rgba(8,9,12,.5)}
.ingresso>.fondale img{filter:saturate(.78) contrast(1.12) brightness(.96)}
/* il buio dove serve, non dappertutto: una colonna scura al centro tiene il
   testo leggibile e lascia respirare i bordi della fotografia */
.ingresso>.fondale .colonna{position:absolute;inset:0;
  background:radial-gradient(86% 76% at 50% 52%,rgba(8,9,12,.93),rgba(8,9,12,.6) 64%,transparent)}
.ingresso>.fondale .sfuma.giu{height:44%;background:linear-gradient(0deg,var(--nero) 24%,transparent)}
.fondale{inset:-12% 0}
.fondale .sfuma{position:absolute;left:0;right:0;height:26%;pointer-events:none}
.fondale .sfuma.su{top:0;background:linear-gradient(180deg,var(--nero) 6%,rgba(8,9,12,.55) 44%,transparent)}
.fondale .sfuma.giu{bottom:0;background:linear-gradient(0deg,var(--nero) 6%,rgba(8,9,12,.55) 44%,transparent)}

/* ⛔ LA COLONNA — la sezione delle app e' lunga 6.000px e non aveva NIENTE
   dietro. Misurato con `zone-nere.mjs`: 145 fasce su 210 erano nere E piatte,
   cioe' il 69% della pagina. La trama in CSS che avevo messo era troppo tenue
   per contare — «l'ho aggiunta» non e' «si vede».
   Qui quattro fotografie si susseguono lungo tutta la sezione, ognuna sfumata
   in cima e in fondo su un terzo della propria altezza: si SOVRAPPONGONO nella
   zona di sfumatura, quindi fra una e l'altra non c'e' una riga di giunzione
   ma un passaggio lungo centinaia di pixel. E' il punto 7 alla lettera. */
.colonna{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.colonna .strato{position:absolute;left:0;right:0;height:34%;overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,transparent,#000 26%,#000 74%,transparent);
  mask-image:linear-gradient(180deg,transparent,#000 26%,#000 74%,transparent)}
.colonna .strato:nth-child(1){top:-2%}
.colonna .strato:nth-child(2){top:22%}
.colonna .strato:nth-child(3){top:46%}
.colonna .strato:nth-child(4){top:70%}
/* ⛔ LA COLONNA DI BASE, dietro TUTTA la pagina. Le colonne locali coprivano le
   sezioni lunghe, ma restavano cinque tratti neri nei PASSAGGI fra una sezione
   e l'altra (misurati: 34 fasce in cinque gruppi, fino a 541px di seguito).
   Questa sta sotto a tutto e non lascia mai il fondo scoperto: e' l'ultima
   rete, non la prima. Piu' scura delle altre, perche' sopra ci passa tutto. */
.colonna.base{z-index:0}
.colonna.base .strato{height:24%}
.colonna.base .strato:nth-child(1){top:-1%}
.colonna.base .strato:nth-child(2){top:16%}
.colonna.base .strato:nth-child(3){top:33%}
.colonna.base .strato:nth-child(4){top:50%}
.colonna.base .strato:nth-child(5){top:67%}
.colonna.base .strato:nth-child(6){top:82%}
.colonna.base .strato img{filter:saturate(.44) contrast(1.04) brightness(.86)}
.colonna.base .strato::after{background:rgba(8,9,12,.58)}
.colonna .strato img{position:absolute;inset:0;width:100%;height:118%;object-fit:cover;display:block;
  filter:saturate(.5) contrast(1.05) brightness(.78);
  transform:translate3d(0,calc(var(--y,0) * 30px),0)}
.colonna .strato::after{content:'';position:absolute;inset:0;background:rgba(8,9,12,.55)}
@media(prefers-reduced-motion:reduce){.colonna .strato img{transform:none}}
/* ⛔ CHI PORTA UN FONDALE DEVE ALZARE IL PROPRIO CONTENUTO, SEMPRE.
   `.fondale` e' `position:absolute`, quindi dipinge SOPRA il contenuto in
   flusso che non e' posizionato. La regola c'era per ingresso e invito e non
   per le sezioni: la storia mostrava la fotografia e basta, con il titolo, il
   racconto e i tre riquadri sotto — invisibili, senza un errore da leggere.
   Scritta cosi' vale per qualunque sezione a cui domani qualcuno aggiunga un
   fondale, che e' il punto: la regola non deve essere ricordata. */
.ingresso,.invito,.fascia,.sez{position:relative;isolation:isolate}
/* ⚠️ `.colonna` va ESCLUSA come `.fondale`: e' un fondale anche lei, e questa
   regola le toglieva `position:absolute` rendendola invisibile — il conto delle
   fasce nere restava identico e sembrava che le fotografie non bastassero. */
.ingresso>.g,.invito>*:not(.fondale):not(.colonna),.fascia>.d,.sez>.g,
.sez>*:not(.fondale):not(.colonna){position:relative;z-index:1}

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
.fascia{padding:var(--s6) 0}

/* ⛔ LA CORONA — bozza 5, scelta dal fondatore (25/08): «il marchio al centro,
   le app come corona, e i nomi che ruotano».
   ⚠️ AL CENTRO C'E' SCRITTO «L'ECOSISTEMA» E BASTA, non «l'ecosistema
   Deepwork»: la parola DEEPWORK sta GIA' DENTRO il marchio, disegnata li'
   dall'autore. Scriverla di nuovo la farebbe comparire due volte a due
   centimetri di distanza, e sembrerebbe un errore. Cosi' l'occhio legge
   «L'ECOSISTEMA» e subito sotto il «DEEPWORK» del marchio: la frase intera,
   con il marchio che ne fa la seconda meta'. E il marchio resta INTATTO —
   quello e' il dogma, e non si tocca nemmeno per una buona ragione.
   ⚠️ Le posizioni sono FRAZIONI (--fx/--fy) moltiplicate per un raggio in
   `clamp`: scritte in pixel fissi, come nella bozza, sul telefono la corona
   usciva dallo schermo. */
.corona{position:relative;display:grid;place-items:center;
  --rx:clamp(150px,34vw,420px);--ry:clamp(112px,21vw,228px);
  /* imbottitura SIMMETRICA: 56 sopra e 30 sotto lasciavano 13px di scarto
     (misurati), cioe' meta' della differenza. L'etichetta adesso sta fuori dal
     flusso, quindi lo spazio in piu' in cima non serve. */
  padding:calc(var(--ry) + 46px) 0}
.corona .anello{position:absolute;inset:0;display:grid;place-items:center;pointer-events:none;
  animation:gira 54s linear infinite}
.corona .anello i{position:absolute;font-style:normal;
  translate:calc(var(--rx) * var(--fx)) calc(var(--ry) * var(--fy));
  font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:clamp(13px,1.5vw,19px);letter-spacing:2.2px;text-transform:uppercase;
  color:var(--t);white-space:nowrap;
  text-shadow:0 0 22px color-mix(in srgb,var(--t) 60%,transparent);
  animation:controgira 54s linear infinite}
/* i nomi girano con l'anello ma restano DRITTI: la contro-rotazione si applica
   dopo la traslazione, perche' `translate` e' una proprieta' a se' e viene
   prima di `transform` */
@keyframes gira{to{transform:rotate(360deg)}}
@keyframes controgira{to{transform:rotate(-360deg)}}
.corona:hover .anello,.corona:hover .anello i{animation-duration:26s}
@media(prefers-reduced-motion:reduce){
  .corona .anello,.corona .anello i{animation:none}}

/* ⛔ SOTTO I 720px L'ANELLO NON C'E'. Misurato con `corona-urti.mjs`: a 390px
   erano 63 sovrapposizioni su 96 controlli — otto nomi orizzontali attorno a un
   marchio, in 350px di larghezza, non ci stanno e nessun raggio li fa stare.
   Invece di stringere il carattere finche' non si legge piu', sul telefono i
   nomi diventano una griglia sotto il marchio: la stessa informazione, in una
   forma che quella larghezza sa reggere. */
@media(max-width:720px){
  /* ⚠️ E VA INVERTITO L'ORDINE: nel documento l'anello viene PRIMA del centro
     (deve stargli dietro), quindi diventando griglia i nomi finivano sopra il
     marchio e ci si sovrapponevano — 24 collisioni su 96. In flusso l'ordine
     giusto e' marchio, poi nomi. */
  .corona{padding:34px 0 0;--rx:0px;--ry:0px;display:flex;flex-direction:column;align-items:center}
  .corona .centro{order:1}
  .corona .anello{order:2}
  .corona .anello{position:static;display:grid;grid-template-columns:repeat(2,1fr);
    gap:12px 18px;animation:none;margin-top:26px;width:100%}
  .corona .anello i{position:static;translate:none;animation:none;text-align:center;
    font-size:14px;letter-spacing:1.8px}
  .corona .centro .eti{position:static;margin:0 0 6px}
  .corona .centro{gap:0}
}

/* ⛔ L'ETICHETTA ESCE DAL FLUSSO. Messa sopra al marchio come riga normale lo
   spingeva in basso di 28px (misurati con `centro.mjs`), ed e' esattamente il
   «mi pare un po' decentrata» del fondatore: il marchio non stava al centro
   dell'anello, stava 28px sotto. Fuori dal flusso, il marchio e' il centro. */
.corona .centro{position:relative;z-index:2;display:grid;justify-items:center}
.corona .centro .eti{position:absolute;bottom:100%;margin-bottom:10px;white-space:nowrap;
  font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:clamp(12px,1.4vw,17px);letter-spacing:6px;text-transform:uppercase;color:var(--inch2)}
.corona .centro svg{width:clamp(104px,15vw,186px);height:auto;display:block;
  filter:drop-shadow(0 0 54px rgba(255,150,0,.5)) drop-shadow(0 10px 30px rgba(0,0,0,.6))}
.corona .centro::before{content:'';position:absolute;left:50%;top:52%;translate:-50% -50%;
  width:230%;aspect-ratio:1;border-radius:50%;z-index:-1;pointer-events:none;
  background:radial-gradient(circle,rgba(255,150,0,.22),rgba(255,110,0,.08) 46%,transparent 70%);
  filter:blur(14px);animation:respira 8s ease-in-out infinite}
.fascia .cifre{gap:clamp(var(--s5),9vw,var(--s7));margin-top:var(--s5)}
.fascia .cifre div{min-width:118px;position:relative}
.fascia .cifre div+div::before{content:'';position:absolute;left:calc(-1 * clamp(26px,4.5vw,68px));
  top:12%;bottom:12%;width:1px;background:linear-gradient(180deg,transparent,var(--bordo2),transparent)}
.fascia .cifre b{display:block;font-family:'Barlow Condensed',sans-serif;font-weight:800;
  font-size:clamp(52px,7.5vw,92px);line-height:.86;letter-spacing:-1px;
  background:var(--grad);-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;color:transparent;
  filter:drop-shadow(0 12px 40px rgba(255,140,0,.34))}
.fascia .cifre s{display:block;text-decoration:none;font-family:'Barlow Condensed',sans-serif;
  font-weight:800;font-size:clamp(13px,1.5vw,17px);letter-spacing:5px;text-transform:uppercase;
  color:var(--inch);margin-top:var(--s2)}

/* la fotografia di lavoro dietro le finestre di ogni app, nella sua tinta */
.scena .lavoro{position:absolute;inset:-16% -12%;overflow:hidden;border-radius:30px;z-index:0;
  pointer-events:none;opacity:.72;-webkit-mask-image:radial-gradient(70% 70% at 50% 50%,#000 40%,transparent 82%);
  mask-image:radial-gradient(70% 70% at 50% 50%,#000 40%,transparent 82%)}
.scena .lavoro img{position:absolute;inset:0;width:100%;height:118%;object-fit:cover;display:block;
  filter:saturate(.5) contrast(1.05) brightness(.9);
  transform:translate3d(0,calc(var(--y,0) * 34px),0)}
/* ⛔ IL MARCHIO COME SORGENTE DI LUCE — solo dietro DEEPWORK (fondatore 24/08,
   opzione 2, e «il marchio come sfondo va utilizzato SOLO dietro
   l'illustrazione di deepwork; per le altre app devi trovare altri sfondi»).
   Il disegno non cambia di un pixel: cambiano la MISURA (che `marchio(px)` ha
   il permesso di toccare) e un filtro CSS, che sta fuori dall'SVG. Lo prova
   `strumenti/marchio-intatto.mjs`, che conta anche questa copia. */
.scena .faro{position:absolute;inset:-26% -18%;display:grid;place-items:center;z-index:5;
  pointer-events:none;mix-blend-mode:screen;opacity:.62;
  -webkit-mask-image:radial-gradient(64% 64% at 50% 50%,#000 30%,transparent 80%);
  mask-image:radial-gradient(64% 64% at 50% 50%,#000 30%,transparent 80%)}
.scena .faro svg{width:clamp(360px,46vw,660px);height:auto;
  filter:blur(34px) saturate(1.6) brightness(1.6);opacity:1;
  transform:translate3d(0,calc(var(--y,0) * 26px),0)}
/* una seconda copia nitida e tenue: senza, l'alone e' una macchia arancione e
   non si riconosce piu' che e' il marchio */
.scena .faro svg+svg{position:absolute;filter:blur(1px);opacity:.16}
@media(prefers-reduced-motion:reduce){.scena .faro svg{transform:none}}

.scena .lavoro::after{content:'';position:absolute;inset:0;
  background:linear-gradient(120deg,color-mix(in srgb,var(--ac) 30%,rgba(8,9,12,.6)),rgba(8,9,12,.52))}

/* ── IL MOVIMENTO (punto 12 del fondatore, 24/08) ──────────────────────
   Cinque cose, e nessuna e' decorazione fine a se stessa: ognuna guida
   l'occhio dove deve andare. Tutte si spengono con `prefers-reduced-motion`. */

/* 1. la barra di avanzamento: dice quanto manca, e da' un filo ambra che
      cresce lungo tutta la lettura */
.avanzo{position:fixed;top:0;left:0;height:2px;z-index:60;pointer-events:none;
  width:var(--avanzo,0%);background:var(--grad);
  box-shadow:0 0 14px rgba(255,171,0,.6)}

/* 2. i titoli di sezione salgono ed entrano.
   ⛔ NIENTE MASCHERA `overflow:hidden` qui: taglia anche in ORIZZONTALE, e
      «DIGITALIZZAZIONE» diventava «DIGITALIZZAZI». E' la stessa trappola gia'
      pagata sul titolo dell'ingresso, dove la cura fu allargare la maschera —
      ma su un titolo che va a capo piu' volte non c'e' larghezza che basti.
      Un titolo che si taglia da solo e' peggio di un titolo che non si muove. */
.capo h2 span{display:block;opacity:0;transform:translateY(24px);
  transition:opacity .85s var(--posa),transform .95s var(--posa)}
.capo.dentro h2 span{opacity:1;transform:none}

/* 3. le voci dell'elenco di ogni app entrano a scalare invece che tutte
      insieme: l'occhio le legge una per una */
.testo li{opacity:0;transform:translateX(-14px);
  transition:opacity .55s var(--posa),transform .6s var(--posa)}
.app.dx .testo li{transform:translateX(14px)}
.app.dentro .testo li{opacity:1;transform:none}
.app.dentro .testo li:nth-child(2){transition-delay:.1s}
.app.dentro .testo li:nth-child(3){transition-delay:.2s}
.app.dentro .testo li:nth-child(4){transition-delay:.3s}
/* e il nome dell'app arriva dal suo lato */
.testo .nome{display:inline-block;opacity:0;transform:translateX(-26px);
  transition:opacity .7s var(--posa),transform .8s var(--posa)}
.app.dx .testo .nome{transform:translateX(26px)}
.app.dentro .testo .nome{opacity:1;transform:none}

/* 4. la striscia dei nomi scorre piano, e si ferma quando ci passi sopra */
.striscia{overflow:hidden}
.striscia .scorre{display:flex;gap:var(--s5);align-items:center;width:max-content;
  animation:sfila 44s linear infinite}
/* ⛔ NON si ferma al passaggio del cursore (fondatore, 25/08): la pausa
   spezzava il movimento proprio mentre uno la guardava. */
@keyframes sfila{to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.striscia .scorre{animation:none}}

/* 5. i due numeri contano da zero quando entrano in vista */
.fascia .cifre b{font-variant-numeric:tabular-nums}

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


def colonna(nomi, alt, cl=""):
    """Fotografie in fila lungo una sezione lunga, sfumate l'una nell'altra.
    Chi manca non lascia un buco: si salta e le altre si ridistribuiscono."""
    ci = [(n, C.sfondo(n)) for n in nomi]
    ci = [(n, u) for n, u in ci if u]
    if not ci: return ""
    return '<span class="colonna %s" aria-hidden="true">%s</span>' % (cl, "".join(
        '<span class="strato"><img src="%s" alt="%s" loading="eager"></span>' % (u, alt) for _n, u in ci))


def fondale(nome, alt, velo=True, sfuma=True, colonna_=False):
    """Il fondale di una sezione — oppure la stringa VUOTA se la fotografia non
    c'e'. ⛔ Nessun ripiego su un'altra immagine: nove schede con le stesse tre
    foto a rotazione si leggono come una scelta sciatta, non come una mancanza
    (misurato il 23/08, e il fondatore l'ha detto per nome)."""
    u = C.sfondo(nome)
    if not u: return ""
    return ('<span class="fondale" aria-hidden="true"><img src="%s" alt="%s" loading="lazy">'
            '<span class="tinta"></span>%s%s%s</span>') % (u, alt, '<span class="velo"></span>' if velo else "",
                              '<span class="colonna"></span>' if colonna_ else "",
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
    # Deepwork non porta una fotografia: porta il proprio marchio, acceso.
    faro = ('<span class="faro" aria-hidden="true">%s%s</span>' % (C.marchio(420), C.marchio(420))
            ) if ch == "deepwork" else ""
    foto = None if ch == "deepwork" else C.sfondo("app-" + ch)
    lav = ('<span class="lavoro" aria-hidden="true"><img src="%s" alt="" loading="lazy"></span>' % foto) if foto else ""
    piani = orb("g", 0)
    if n > 1:
        piani += orb("p", max(1, n // 3)) + orb("t", max(2, (2 * n) // 3))
    pop = "".join('<b class="pop %s">%s<span>%s</span></b>' % (lat, SPUNTA, testo)
                  for lat, (_, testo) in zip(("a", "b", "c"), C.POPUP.get(nome, [])))
    pun = "".join('<i%s></i>' % (' class="viva"' if i == 0 else "") for i in range(n)) if n > 1 else ""
    li = "".join("<li>%s</li>" % x for x in punti)
    return ('<article class="app sale%s" id="app-%s" data-scatti="%d" style="--ac:%s;--ac2:%s">'
            '<div class="testo">'
            '<div class="riga"><span class="nome">%s</span><span class="tag %s">%s</span></div>'
            '<p class="claim">%s</p><p>%s</p><ul>%s</ul>'
            '<a class="chi" href="#">%s<em>&rsaquo;</em></a></div>'
            '<div class="scena">%s%s%s<span class="alone"></span>%s<span class="punti">%s</span></div>'
            '</article>') % (" dx" if k % 2 else "", ch, n, acc, acctx, nome, cls, stato,
                             somm, desc, li, achi, lav, faro, piani, pop, pun)

# ⛔ Niente piu' raggruppamenti: le app si susseguono e basta (fondatore 24/08).
scene = "".join(app_scena(a, k) for k, a in enumerate(C.APP))
storia = "".join('<div class="passo sale"><b>%s</b><h3>%s</h3><p>%s</p></div>' % t for t in C.STORIA)
striscia = "".join('<a href="#app-%s" style="--ac:%s">%s</a>'
                   % (a[0].lower().replace(" ", ""), a[3], a[0]) for a in C.APP)
import math as _m
# ⛔ Le otto APP, non le nove voci: Deepwork ID e' l'accesso, cioe' l'«1» —
#    metterlo nella corona farebbe otto+uno = nove e il numero non tornerebbe.
_corona = [a for a in C.APP if a[0] != "Deepwork ID"]
assert len(_corona) == 8, "la corona dice OTTO: sono %d" % len(_corona)
corona_html = "".join(
  '<i style="--t:%s;--fx:%.4f;--fy:%.4f">%s</i>'
  % (a[2], _m.cos(k / 8 * 2 * _m.pi - _m.pi / 2), _m.sin(k / 8 * 2 * _m.pi - _m.pi / 2), a[0])
  for k, a in enumerate(_corona))
cifre = "".join("<div><b>%s</b><s>%s</s></div>" % c for c in C.CIFRE)
elenco = "".join('<li><a href="#app-%s">%s</a></li>'
                 % (a[0].lower().replace(" ", ""), a[0]) for a in C.APP)
# ⛔ LA VETRINA DELL'INGRESSO MOSTRA APP MISTE, NON SOLO DEEPWORK.
#    Prima erano tre schermate di Terra, ferme e senza nome (fondatore, 24/08:
#    «completamente fuori contesto»); poi tre di Deepwork, giuste ma tutte
#    uguali fra loro. Il fondatore (25/08): «non solo le immagini di deepwork,
#    ma immagini miste di tutte le app, scegli le piu' spettacolari».
#    ⚠️ L'elenco e' SCELTO A MANO e ogni voce dice PERCHE': una rotazione
#    automatica avrebbe pescato anche le schermate di servizio — un modulo
#    vuoto, una calcolatrice — che su una vetrina non dicono niente.
SPETTACOLI = {
    "c": [("deepwork", 0, "la schermata iniziale del prodotto di punta"),
          ("terra",    0, "il contatore del volume, il numero piu' grande che abbiamo"),
          ("genesi",   2, "lo scavo in 3D: l'unica schermata che non sembra un gestionale"),
          ("scudo",    2, "il grafico della formazione, a barre piene"),
          ("conti",    0, "i quattro indicatori di cassa")],
    "sx": [("campo",      0, "le squadre in turno, con i semafori"),
           ("flotta",     0, "la percentuale di disponibilita' del parco"),
           ("sentinella", 0, "la lettura ambientale con la sua miniatura"),
           ("terra",      3, "l'istogramma dei volumi per mese")],
    "dx": [("sentinella", 1, "il monitoraggio, con il grafico grande"),
           ("conti",      2, "l'elenco delle pesate"),
           ("scudo",      0, "il cruscotto della sicurezza"),
           ("deepwork",   1, "lo storico dei rapportini")],
}

def _vetrina(cl):
    """Le finestre della vetrina d'ingresso. Ogni fotogramma e' una app DIVERSA:
    a colpo d'occhio si vede che sono tante, che e' esattamente la tesi."""
    voci = SPETTACOLI[cl]
    fonte = SIM if cl == "c" else SIM_P
    fuori, saltate = [], []
    for app, i, _perche in voci:
        serie = fonte.get(app) or []
        if i < len(serie):
            fuori.append((serie[i], app))
        else:
            saltate.append("%s[%d] su %d" % (app, i, len(serie)))
    if saltate:                     # ⛔ una scelta che non trova il suo scatto
        print("   ⚠️ vetrina %s: %d fotogrammi SALTATI (%s)" % (cl, len(saltate), ", ".join(saltate)))
    return '<span class="f %s">%s</span>' % (cl, "".join(
        '<img src="%s" alt="Schermata di %s" loading="eager"%s>'
        % (u, app.capitalize(), ' class="viva"' if k == 0 else "")
        for k, (u, app) in enumerate(fuori)))

_nvet = min(len(v) for v in SPETTACOLI.values())

PAG = """<title>Deepwork — L'ecosistema del cantiere</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@300;400;500;600&display=swap">
<style>@CSS@</style>
<div class="ombra" aria-hidden="true"></div>
<div class="ombra sopra" aria-hidden="true"></div>
<div class="avanzo" aria-hidden="true"></div>
<header class="barra"><div class="d">
  <a class="segno" href="#"><span>@MARCHIO_P@</span><b class="parola">Deepwork</b></a>
  <nav><a href="#storia">La storia</a><a href="#app">Le app</a></nav>
  <a class="bot pri" href="#prova">Prova il tour</a>
</div></header>

<main>@BASE@
  <section class="ingresso">@FOND_ING@
    <div class="g">
      <span class="marca">@MARCHIO_G@</span>
      <h1 class="disp"><span class="r"><span>@BENV_A@</span></span><span class="r"><span>@BENV_B@</span></span></h1>
      <p class="sott">@CLAIM@</p>
      <div class="az"><a class="bot pri" href="#prova">Prova il tour</a><a class="bot sec" href="#app">Guarda le app</a></div>
      <p class="sotto-az">Dati di esempio, nessuna registrazione: entri e provi.</p>
      <div class="mostra" data-scatti="@NDW@">
        @MSX@@MDX@@MC@
        <span class="etichetta">Nove app, una casa sola</span>
      </div>
    </div>
  </section>

  <section class="striscia"><div class="g"><span class="e">Otto app e un accesso unico</span><div class="scorre">@STRISCIA@@STRISCIA@</div></div></section>

  <section class="sez" id="storia">@FOND_STO@<div class="g">
    <div class="capo mezzo sale"><span class="occhio">La storia</span>
      <h2 class="disp"><span>@NASCE@</span></h2>
      <p class="forte">@NASCE_SOTTO@</p></div>
    <p class="racconto sale">@STORIA_TESTO@</p>
    <div class="storia">@STORIA@</div>
  </div></section>

  <section class="fascia">@FOND_FAS@<div class="d">
    <div class="corona">
      <div class="anello">@CORONA@</div>
      <div class="centro"><span class="eti">L'ecosistema</span>@MARCHIO_C@</div>
    </div>
    <div class="cifre">@CIFRE@</div>
  </div></section>

  <section class="sez" id="app">@COLONNA@<div class="g">
    <div class="capo sale"><span class="occhio">Le app</span>
      <h2 class="disp"><span>Ti presentiamo le app del nostro ecosistema</span></h2>
      <p>@APERTURA@</p></div>
    @SCENE@
  </div></section>

  <section class="g" id="prova"><div class="invito">@FOND_INV@
    <span class="occhio">Provalo adesso</span>
    <h2 class="disp"><span>@CHIUSURA@</span></h2>
    <p>Il tour apre le app con dati di esempio: puoi premere tutto, non si salva niente e non serve registrarsi.</p>
    <div class="az"><a class="bot pri" href="#">Prova il tour</a><a class="bot sec" href="#app">Rivedi le app</a></div>
  </div></section>
</main>

<footer class="piede"><div class="g">
  <div class="cols">
    <div><div class="segno">@MARCHIO_P@<b class="parola">Deepwork</b></div>
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
  /* la vetrina dell'ingresso scorre come una scena d'app: e' la prima cosa
     che si vede dopo il titolo, e ferma non dice niente */
  var vet=document.querySelector('.mostra[data-scatti]');
  if(vet&&!fermi){
    var nv=+vet.dataset.scatti;
    if(nv>1){var iv=0;setInterval(function(){iv=(iv+1)%nv;
      [].forEach.call(vet.querySelectorAll('.f'),function(f){
        var im=f.querySelectorAll('img');
        for(var i=0;i<im.length;i++)im[i].classList.toggle('viva',i===iv);});},2400);}
  }
  var app=document.querySelectorAll('.app[data-scatti]');
  if(!fermi&&('IntersectionObserver' in window)){
    var os=new IntersectionObserver(function(v){v.forEach(function(x){
      var s=x.target,n=+s.dataset.scatti;
      if(x.isIntersecting){ if(n>1&&!s._t)s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},2200); }
      else if(s._t){clearInterval(s._t);s._t=null;}
    });},{rootMargin:'-10% 0px -10% 0px',threshold:.2});
    for(var r=0;r<app.length;r++){app[r].dataset.ora=0;os.observe(app[r]);}
    [].forEach.call(app,function(s){
      s.addEventListener('pointerenter',function(){var n=+s.dataset.scatti;if(n<2)return;
        if(s._t)clearInterval(s._t);mostra(s,((+s.dataset.ora||0)+1)%n);
        s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},1500);});
      s.addEventListener('pointerleave',function(){var n=+s.dataset.scatti;if(n<2)return;
        if(s._t)clearInterval(s._t);
        s._t=setInterval(function(){mostra(s,((+s.dataset.ora||0)+1)%n);},2200);});
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
    /* l'ombra di tutta la pagina segue il cursore. Il colore lo fa il CSS
       (un'animazione sulla variabile registrata): qui si muove solo il centro,
       se no ogni movimento del dito costringerebbe a ricalcolare una sfumatura
       in JavaScript sessanta volte al secondo. */
    /* ⛔ IL COLORE CAMBIA CON IL MOVIMENTO, NON COL TEMPO (fondatore 25/08:
       «piu' muovi il cursore piu' velocemente i colori cambiano»).
       L'animazione CSS resta — e' lei a interpolare le tinte, che in JavaScript
       vorrebbe dire ricalcolare una sfumatura sessanta volte al secondo — ma
       il suo `animationPlayState` e la sua `animationDuration` li decide la
       distanza percorsa dal dito. Fermo il cursore, il ciclo rallenta fino a un
       passo lentissimo invece di fermarsi: un'ombra che si blocca sembra rotta. */
    var ombre=[].slice.call(document.querySelectorAll('.ombra'));
    if(ombre.length){
      var px=null,py=null,corsa=0,LENTA=150,VELOCE=9;   // secondi per giro
      addEventListener('pointermove',function(ev){
        var x=ev.clientX,y=ev.clientY;
        for(var i=0;i<ombre.length;i++){
          ombre[i].style.setProperty('--ox',(x/innerWidth*100).toFixed(1)+'%');
          ombre[i].style.setProperty('--oy',(y/innerHeight*100).toFixed(1)+'%');
        }
        if(px!==null){var d=Math.hypot(x-px,y-py); corsa=Math.min(1,corsa+d/900);}
        px=x;py=y;
      },{passive:true});
      /* la corsa si scarica da sola: se il dito si ferma, in pochi secondi il
         ciclo torna al passo lento */
      setInterval(function(){
        corsa=Math.max(0,corsa-0.06);
        var dur=LENTA+(VELOCE-LENTA)*corsa;
        for(var i=0;i<ombre.length;i++) ombre[i].style.animationDuration=dur.toFixed(1)+'s';
      },220);
    }
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
  /* la barra di avanzamento, sullo stesso giro di rAF del resto: un secondo
     ascoltatore di scorrimento costerebbe quanto il primo e non serve */
  var avz=document.querySelector('.avanzo');
  var att=false;
  addEventListener('scroll',function(){if(att)return;att=true;requestAnimationFrame(function(){att=false;
    var y=window.pageYOffset||0;
    document.body.classList.toggle('mossa',y>30);
    if(avz){var h=document.documentElement.scrollHeight-innerHeight;
      avz.style.setProperty('--avanzo',(h>0?Math.min(100,y/h*100):0).toFixed(2)+'%');}
  });},{passive:true});

  /* i due numeri contano da zero: fermi non dicono che sono un dato, dicono
     che sono un ornamento */
  if(!fermi&&('IntersectionObserver' in window)){
    var oc=new IntersectionObserver(function(v){v.forEach(function(x){
      if(!x.isIntersecting)return; oc.unobserve(x.target);
      var el=x.target, fine=parseInt(el.textContent,10);
      if(!(fine>0)) return;
      var t0=null, dur=900;
      requestAnimationFrame(function passo(t){
        if(t0===null)t0=t;
        var k=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-k,3);
        el.textContent=String(Math.round(fine*e));
        if(k<1)requestAnimationFrame(passo); else el.textContent=String(fine);
      });
    });},{threshold:.6});
    [].forEach.call(document.querySelectorAll('.fascia .cifre b'),function(b){oc.observe(b);});
  }
})();
</script>
"""
# ⛔ DERIVATO, non scritto a mano: il ciclo mostra i colori che le app hanno
#    davvero, e il giorno che una palette cambia il ciclo la segue da solo.
_tinte = [a[2] for a in C.APP]
_fot = " ".join("%.4g%%{--ombra-tinta:%s}" % (i * 100.0 / len(_tinte), t)
                for i, t in enumerate(_tinte)) + " 100%%{--ombra-tinta:%s}" % _tinte[0]
CSS = CSS.replace("@FOTOGRAMMI@", _fot)

io.open(sys.argv[1], "w", encoding="utf-8").write(
  PAG.replace("@CSS@", CSS).replace("@MARCHIO_P@", C.marchio(30)).replace("@MARCHIO_G@", C.marchio(300))
     .replace("@BENV_A@", C.BENVENUTO_A).replace("@BENV_B@", C.BENVENUTO_B).replace("@CLAIM@", C.CLAIM)
     .replace("@MSX@", _vetrina("sx")).replace("@MDX@", _vetrina("dx"))
     .replace("@MC@", _vetrina("c")).replace("@NDW@", str(_nvet))
     .replace("@STRISCIA@", striscia).replace("@STORIA@", storia).replace("@SCENE@", scene)
     .replace("@FOND_ING@", fondale("ingresso", "Un cantiere al lavoro", colonna_=True))
     .replace("@FOND_FAS@", fondale("fascia", "Macchine in cantiere"))
     .replace("@FOND_INV@", fondale("invito", "Cantiere all'opera"))
     .replace("@CIFRE@", cifre).replace("@CORONA@", corona_html)
     .replace("@MARCHIO_C@", C.marchio(190))
     .replace("@ELENCO@", elenco).replace("@CHIUSURA@", C.CHIUSURA).replace("@FOND_STO@", fondale("storia", "Cantiere al lavoro"))
     .replace("@NASCE@", C.NASCE_TITOLO).replace("@NASCE_SOTTO@", C.NASCE_SOTTO)
     .replace("@STORIA_TESTO@", C.STORIA_TESTO).replace("@APERTURA@", C.APP_APERTURA)
     .replace("@COLONNA@", colonna(["colonna-1","colonna-2","colonna-3","colonna-4"],
                                   "Cantieri al lavoro"))
     .replace("@BASE@", colonna(["base-%d" % i for i in range(1, 7)],
                                "Cantiere", cl="base")).replace("@CREDITO@", C.CREDITO))
print("sito di presentazione scritto")
