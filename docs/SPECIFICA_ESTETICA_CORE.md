# Specifica estetica del core Deepwork

**A cosa serve questo documento.** Il fondatore ha deciso (direttiva del
25/07) che le app verticali devono sembrare **gemelle del core Deepwork**,
distinte **solo dal colore dominante**. Qui dentro c'è, valore per valore,
com'è fatto il core (`index.html` alla radice, blocco `<style>` righe
6488–7409), poi l'elenco preciso di cosa oggi non combacia in ogni app, e
il piano per sanare le differenze.

Non è un documento da leggere tutto d'un fiato: la **Parte 1** è il
"listino dei valori" (si consulta), la **Parte 2** è la lista della spesa
(si spunta), la **Parte 4** è il riassunto operativo.

Sorgenti lette: `index.html` (core), `shared/deepwork-style.css`,
`shared/dw-app-shell.css`, `apps/{scudo,campo,flotta,conti,sentinella,terra}/index.html`,
`apps/genesi/genesi.html`, `apps/index.html`, `apps/deepwork-id/*.html`.

---

## PARTE 1 — La specifica del core, valore per valore

### 1.1 Colori di base (`:root`, tema scuro = quello di default)

| Token | Valore | A cosa serve |
|---|---|---|
| `--bg` | `#100d07` | sfondo generale della pagina |
| `--dark` | `#14100a` | superfici "sotto" (intestazioni tabella, barra chat) |
| `--panel` | `#18140a` | pannelli, modali, barre |
| `--card` | `#221c0e` | fondo delle schede |
| `--card2` | `#2a2210` | fondo schiarito (parte alta dei gradienti) |
| `--border` | `#332a14` | bordo standard 1px |
| `--border2` | `#3d3318` | bordo evidenziato / scrollbar |
| `--text` | `#f0e8d8` | testo principale |
| `--muted` | `#9b8a60` | testo secondario, etichette |
| `--muted2` | `#b8a574` | testo secondario più leggibile |
| `--amber` | `#ffab00` | accento primario del core |
| `--orange` | `#ff6d00` | secondo colore del gradiente |
| `--amber2` | `#ffd54f` | accento chiaro (hover, glow) |
| `--success` | `#66bb6a` | esito positivo |
| `--danger` | `#ef5350` | errore |
| `--info` | `#42a5f5` | informazione |
| `--warn` | `#ffa726` | attenzione |
| `--grad` | `linear-gradient(135deg,#ffab00,#ff6d00)` | bottoni primari, toast, FAB |
| `--grad3` | `linear-gradient(135deg,#ef5350,#c62828)` | avatar/pannelli "rosso" |
| `--gradSuc` | `linear-gradient(135deg,#66bb6a,#2e7d32)` | schermata di successo |
| `--tap` | `44px` | dimensione minima di ogni bersaglio da toccare |
| `--r` | `12px` | raggio grande (schede, modali) |
| `--r-sm` | `8px` | raggio piccolo (liste, bottoni, input) |
| `--ease` | `cubic-bezier(.2,.7,.3,1)` | curva unica di tutte le animazioni |
| `--glow-strength` | `.18` | intensità dell'alone (0 in modalità sole) |
| `--shadow-amber` | `0 10px 30px rgba(80,40,0,.42)` | ombra calda delle schede colorate |
| `--glow-warm` | `rgba(255,168,48,.32)` | alone caldo delle voci di lista |

**Palette funzionale per famiglia** (usata dal core per colorare le
categorie, ed è la fonte degli accenti delle app):

| Famiglia | base | chiaro |
|---|---|---|
| operativo (`--g-oper`) | `#e8821c` | `#ffb733` |
| volata (`--g-blast`) | `#e5484d` | `#ff6a70` |
| dati (`--g-data`) | `#0e9384` | `#23dcc6` |
| cava (`--g-cave`) | `#2f9e44` | `#5fe05a` |
| logistica (`--g-log`) | `#5b7186` | `#7fbcff` |
| squadre (`--g-team`) | `#8b5cf6` | `#bd96ff` |
| sistema (`--g-sys`) | `#6b6459` | `#c7b794` |

**Il core ha tre temi**, non uno: scuro (default), `body.light-mode`
(chiaro) e `body.outdoor-mode` ("Solar Light", per l'uso al sole: fondo
bianco, `--tap:60px`, `font-size:18px`, niente ombre né aloni).

### 1.2 Sfondo d'ambiente

```
body            → background: var(--bg)
body::before    → position:fixed; inset:0; pointer-events:none; z-index:0
  radial-gradient(ellipse 700px 500px at 15% 5%,  rgba(255,171,0,.04) 0%, transparent 65%),
  radial-gradient(ellipse 500px 400px at 85% 85%, rgba(255,109,0,.04) 0%, transparent 65%)
```

Sono due aloni caldissimi e appena percettibili (opacità 4%), uno in alto
a sinistra e uno in basso a destra. Vengono **spenti** in modalità sole e
su telefono/tablet (`@media (hover:none),(pointer:coarse)`) per non
consumare batteria.

### 1.3 Tipografia

Due famiglie, sempre le stesse:

- **Barlow** (300/400/500/600) — testo corrente, campi, liste.
- **Barlow Condensed** (400/600/700/800) — titoli, numeri, bottoni, badge,
  cioè tutto ciò che è "stretto e maiuscolo".

| Elemento | Famiglia | Dimensione | Peso | Spaziatura lettere | Note |
|---|---|---|---|---|---|
| corpo pagina | Barlow | eredita browser (16px) | 400 | — | `color:var(--text)` |
| `.login-logo` | Condensed | 32px | 800 | 4px | testo in gradiente `--grad` + `text-shadow:0 0 24px rgba(255,171,0,.4)` |
| `.logo-sm` (topbar) | Condensed | 16px | 800 | 3px | colore `--amber`, `text-shadow:0 0 14px rgba(255,171,0,.35)` |
| `.role-sm` | Barlow | 9px | 400 | 2px | maiuscolo, `--muted` |
| `.ht` (titolo pagina) | Condensed | 16px | 800 | 3px | maiuscolo |
| `.sec-title` | Condensed | 11.5px | 700 | 2.5px | maiuscolo, `--muted2`, `border-bottom:1px solid var(--border)`, `padding-bottom:6px`, `margin-bottom:10px` |
| `.sec-title .dot` | — | 5×5px | — | — | tondo `--amber` + `box-shadow:0 0 8px var(--amber)` |
| `.fl` (etichetta campo) | Barlow | 13px | 600 | 2px | maiuscolo, `--muted` |
| `.tt` (titolo tile) | Condensed | 13px | 800 | 1.5px | maiuscolo |
| `.td` (sottotitolo tile) | Barlow | 11px | 400 | — | `--muted`, `line-height:1.35`, `opacity:.9` |
| `.sname` (nome in lista) | Barlow | 13px | 600 | — | tronca con `…` |
| `.ssub` | Barlow | 11px | 400 | — | `--muted` |
| `.kpi-lbl` | Barlow | 10px | 600 | 2px | maiuscolo, `--muted` |
| `.kpi-val` | Condensed | 30px | 800 | — | `line-height:1.1`, **testo in gradiente** `--grad` (`background-clip:text`) |
| `.sv` (valore statistica) | Condensed | 20px | 800 | — | `--amber` |
| `.empty-title` | Condensed | 16px | 800 | 2px | maiuscolo, `--text` |
| `.empty-sub` | Barlow | 12px | 400 | — | `--muted`, `max-width:280px` |
| `.meteo-temp` | Condensed | 36px | 800 | — | `--amber`, `text-shadow:0 0 18px rgba(255,171,0,.25)` |

Regola di ferro sui campi: **tutti gli input sono a 16px** (`font-size:16px`,
e su touch `16px!important`). Sotto i 16px iOS ingrandisce la pagina da
solo quando si tocca il campo: è un difetto visibile, non un dettaglio.

### 1.4 Riquadri e schede

**Scheda standard (`.tile`)**

| Proprietà | Valore |
|---|---|
| fondo | `var(--card)`; per le schede di categoria `linear-gradient(180deg,var(--card2),var(--card))` |
| bordo | `1px solid var(--border)` |
| accento laterale | `border-left:4px solid <colore famiglia>` (7px nel tema chiaro) |
| raggio | `var(--r)` = 12px |
| interno | `padding:15px 14px`, `min-height:90px` |
| ombra a riposo | `0 2px 8px rgba(0,0,0,.22)` (colorate: `var(--shadow-amber)`) |
| ombra al passaggio | `0 10px 24px rgba(0,0,0,.32)` |
| movimento al passaggio | `transform:translateY(-3px)` |
| movimento alla pressione | `translateY(-1px) scale(.99)` |
| transizione | `transform .18s var(--ease), box-shadow .18s var(--ease), border-color .2s` |

**Alone dinamico** (la firma visiva del core): ogni scheda ha uno
pseudo-elemento `::after` che copre tutta la scheda e contiene

```
radial-gradient(200px 160px at var(--mx,50%) var(--my,30%),
  color-mix(in srgb, <colore famiglia> calc(var(--glow-strength,.16)*100%), transparent),
  transparent 62%)
```

con `opacity:0` a riposo e `opacity:1` al passaggio del mouse,
`transition:opacity .25s var(--ease)`. `--mx/--my` sono aggiornati via
JavaScript e seguono il cursore. Su touch è disattivato
(`display:none!important`), come da ottimizzazione v4.5.

**Attenzione a un equivoco frequente:** nel core **non esiste** una riga
luminosa in cima alle schede. La riga luminosa esiste in **due punti soli**:

- `.topbar::after` e `.ph::after` — `height:2px`,
  `background:linear-gradient(90deg,transparent,var(--amber),transparent)`,
  `opacity:.5`, alla base della barra;
- `.tile-feat::after` — un riflesso diagonale
  `linear-gradient(120deg,rgba(255,255,255,.14),transparent 45%)` sulla
  scheda in evidenza.

(Una riga luminosa in cima esiste in Genesi, `.gmodal-card::before`: è
un'invenzione di Genesi, non del core. Se piace, va portata **prima** nel
core e poi ovunque; non il contrario.)

**Chip-icona (`.ti` / `.pi`)** — il quadratino colorato che contiene
l'emoji: `44×44px` (`.pi` 46×46), `border-radius:13px` (`.pi` 14px),
`background:rgba(255,171,0,.14)`, `box-shadow:inset 0 1px 0 rgba(255,255,255,.08)`;
sulle schede di categoria diventa
`color-mix(in srgb, <famiglia> 18%, transparent)` con
`0 0 14px color-mix(in srgb, <famiglia> 30%, transparent)`.

**Voce di lista (`.sitem`)**

| Proprietà | Valore |
|---|---|
| fondo / bordo | `var(--card)` / `1px solid var(--border)` |
| raggio | `var(--r-sm)` = 8px |
| interno | `padding:12px 13px`, `margin-bottom:5px`, `min-height:44px` |
| ombra | `0 1px 5px rgba(0,0,0,.18)` → al passaggio `0 6px 16px rgba(0,0,0,.28)` |
| movimento | `translateX(3px)` al passaggio, `translateX(1px) scale(.995)` alla pressione |
| fondo al passaggio | `var(--card2)` + alone `--glow-warm` (raggio `170px 120px`) |
| stati | `.warn/.danger/.success/.ok` = `border-left:3px solid` (warn/danger/#4caf50/success); `.inactive` = `opacity:.5` |

**Statistiche e KPI**

- `.stat`, `.kpi-card`: `background:linear-gradient(180deg,var(--card2),var(--card))`,
  raggio 8px, `box-shadow:0 1px 6px rgba(0,0,0,.2)`.
- `.kpi-card`: **`border-top:3px solid var(--amber)`** e
  **`border-left:3px solid var(--amber)`**; varianti `kpi-ok/warn/danger`
  cambiano il colore del bordo alto e del numero; `kpi-danger` pulsa
  (`pulseDanger 2s infinite`).

**Avatar (`.av`)**: `36×36px`, **`border-radius:11px`** (quadrato
stondato, non cerchio), font Condensed 12px/800, `letter-spacing:1px`,
testo `#100d07`, fondo in gradiente secondo il ruolo,
`box-shadow:0 2px 6px rgba(0,0,0,.25)`.

### 1.5 Bottoni

| Variante | Fondo | Testo | Tipografia | Interno | Raggio | Ombra | Stati |
|---|---|---|---|---|---|---|---|
| `.btn-main` (primario a tutta larghezza) | `var(--grad)` | `#100d07` | Condensed 15px/800, ls 3px, maiuscolo | `13px`, `min-height:44px` | 8px | `0 5px 16px rgba(255,109,0,.26)` | hover `0 8px 22px rgba(255,109,0,.34)`; active `translateY(2px)` + `0 2px 8px rgba(255,109,0,.2)`; `.loading` opacità .7 + rotellina 14px a destra |
| `.btn-sv` (salva) | `var(--grad)` | `#100d07` | Condensed 14px/800, ls 2px | `13px` | 8px | come sopra | `:disabled` opacità .7, cursore attesa |
| `.btn-sec` (secondario) | `var(--card)` | `var(--text)` | Condensed 13px/600, ls 1px | `12px` | 8px | — | hover: bordo e testo `--amber` + `translateY(-1px)` |
| `.btn-danger` | `rgba(239,83,80,.12)` + bordo `--danger` | `--danger` | Condensed 13px/700 | `11px` | — | — | hover: fondo pieno `--danger`, testo `#fff` |
| `.mbtn` (in modale) | trasparente, bordo `--border` | `--text` | Condensed 12px/700, ls 2px | `10px 16px` | 8px | — | hover bordo+testo ambra; `.primary` = `--grad`; `.danger` = pieno rosso; active `scale(.97)` |
| `.chg` (filtro/segmento) | `var(--card)`, bordo `--border` | `--muted` | Condensed 11px/700, ls 1px | `7px 12px`, `min-height:44px` | 7px | — | hover ambra; `.active` fondo `--amber`, testo `#100d07`, `0 2px 10px rgba(255,171,0,.25)`; active `scale(.95)` |
| `.chip` (etichetta selezionabile) | `var(--card)` | `--text` | Barlow 12px | `7px 12px`, `min-height:44px` | — | — | `.on` = `--grad` su `#100d07` |
| `.addbtn` (aggiungi riga) | trasparente, `1px dashed var(--border)` | `--muted` | Barlow 12px | `8px` | — | — | hover ambra |
| `.add-btn` (tondo +) | `var(--grad)` | `#100d07` | 22px/800 | `46×46px` tondo | 50% | — | — |
| `.nav-fab` (tondo centrale) | `var(--grad)` | `#15110a` | Condensed 34px/700 | `54×54px` | 50% | `0 8px 22px rgba(255,109,0,.45)` | active `scale(.93)` |

Tutti hanno `cursor:pointer`, `min-height:var(--tap)` e
`touch-action:manipulation`.

### 1.6 Campi, select, interruttori, tabelle

**Campo di testo (`.finput`, `.fi`)**

```
width:100%;  background:var(--card);  border:1px solid var(--border);
color:var(--text);  padding:11px 13px;  font-family:'Barlow';  font-size:16px;
border-radius:9px;  min-height:44px;  outline:none;
transition:border-color .18s, box-shadow .18s, background .18s;
:hover  → border-color:var(--border2)
:focus  → border-color:var(--amber);  box-shadow:0 0 0 3px rgba(255,171,0,.16)
.err    → border-color:var(--danger)!important;  background:rgba(239,83,80,.08)
[readonly],[disabled] → color:var(--muted2);  opacity:.7
```

`textarea.finput` → `resize:vertical; min-height:60px`.
`select.finput option` → `background:var(--card)`.
`.cinput` (campo dentro le tabelle) → uguale ma `padding:8px 7px`,
`min-height:38px` (44px su touch), raggio 7px.

**Interruttore (`.toggle`)**: 40×22px, pista `var(--border)` raggio 22px,
pallino 16×16px `var(--muted)` a `left:3px/top:3px`, transizione `.3s`;
acceso → pista `--amber`, pallino `#100d07` traslato di 18px.
La riga che lo contiene (`.toggle-row`) è una scheda `padding:11px 13px`.

**Tabelle**: `.tbl` = `var(--card)` + bordo 1px + `overflow:hidden`.
Intestazione `.thead` = `background:var(--dark)`, `padding:8px 10px`,
9px, `--muted`, `letter-spacing:2px`, maiuscolo, riga di chiusura
`1px solid var(--border)`. Righe `.trow` = griglia,
`padding:5px 8px`, `border-bottom:1px solid var(--border)`, l'ultima senza
bordo. Numeratore `.tnum` = Condensed 14px/800 `--muted` centrato.

### 1.7 Barre, navigazione, schede interne, modali, toast, badge

**Topbar (`.topbar` / `.ph`)**

```
background:linear-gradient(180deg,rgba(30,24,12,.97),rgba(20,16,10,.97))
backdrop-filter:blur(12px)          (spento su touch → fondo pieno #161009)
border-bottom:1px solid var(--border)
height:56px  →  min-height:62px (tema scuro/chiaro)
padding:0 14px  (24px da 768px in su;  8px sotto 360px)
position:sticky; top:0; z-index:100
box-shadow:0 2px 12px rgba(0,0,0,.28)
::after → riga luminosa 2px, gradiente orizzontale ambra, opacity .5
+ padding-top:env(safe-area-inset-top) per la tacca degli iPhone
```

**Navigazione bassa (`#global-nav.bnav`)** — è una **pillola flottante**,
non una barra piena:

```
position:fixed; left:50%; transform:translateX(-50%);
width:calc(100% - 16px); max-width:520px;
bottom:calc(8px + env(safe-area-inset-bottom));
border-radius:18px; border:1px solid var(--border);
background:rgba(20,16,10,.97) + blur(12px);
box-shadow:0 10px 28px rgba(0,0,0,.38);
display:grid; grid-template-columns:repeat(4,1fr);
```

Voce `.bn`: colonna centrata, `padding:11px 4px 10px`, `gap:3px`,
`border-top:2px solid transparent`, colore `--muted`; etichetta 9px/700
`letter-spacing:1.5px` maiuscola. Attiva: colore e `border-top` ambra (o
colore della sezione), `transform:translateY(-2px)`, icona
`scale(1.06)` + `drop-shadow(0 0 6px rgba(255,171,0,.55))`, e una pillola
dietro (`::before`) `42×30px`, raggio 10px, `rgba(255,171,0,.12)`.
Il contenuto sta sopra la pillola (`.bn>*{z-index:1}`).
I contenuti lasciano spazio: `padding-bottom:calc(96px + env(safe-area-inset-bottom))`.

**Schede interne (`.atabs`/`.atab`)**: barra `background:var(--panel)`,
`border-bottom:1px solid var(--border)`, scorrevole in orizzontale.
Linguetta: Condensed 11px/700, ls 1px, maiuscolo, `--muted`,
`padding:13px 14px`, `min-height:44px`,
`border-bottom:2px solid transparent`; attiva → testo e bordo `--amber`.
Pannello `.apanel{display:none;padding:16px}` → `.active{display:block}`.

**Modale**

```
.modal-ov   position:fixed; inset:0; background:rgba(16,13,7,.88); z-index:300;
            display:none → .show{display:flex}; padding:20px
.modal-box  background:linear-gradient(180deg,var(--panel),var(--dark));
            border:1px solid var(--border); border-radius:12px;
            max-width:440px; max-height:92dvh; display:flex; flex-direction:column;
            box-shadow:0 20px 60px rgba(0,0,0,.55);  animation:fadeUp .25s ease
.modal-head padding:14px 18px; border-bottom:1px solid var(--border);
            Condensed 15px/800, ls 2px, maiuscolo
.modal-body padding:14px 18px; overflow-y:auto; flex:1; max-height:55vh
.modal-foot padding:12px 18px; border-top:1px solid var(--border);
            display:flex; gap:6px; justify-content:flex-end;
            position:sticky; bottom:0; background:var(--panel)
```

Con la modale aperta: `body.modal-open{overflow:hidden}`.

**Toast**

```
position:fixed; bottom:80px; left:50%;
transform:translateX(-50%) translateY(8px) → .show: translateY(0)
background:var(--grad); color:#100d07; padding:11px 20px;
Condensed 13px/800, letter-spacing:1px; border-radius:10px;
box-shadow:0 8px 30px rgba(0,0,0,.45); opacity:0 → 1; transition:all .3s; z-index:999
.err → background:var(--danger), colore #fff
.success → background:var(--gradSuc), colore #fff
```

**Badge (`.scad-badge`)**: `display:inline-block`, `padding:2px 7px`,
9px/800, `letter-spacing:1px`, maiuscolo, **`border-radius:3px`**,
fondo pieno (`ok`=success, `warn`=warn su `#100d07`, `danger`=danger che
pulsa). Il pallino delle notifiche (`.notif-badge`) è invece tondo, 15px,
`--danger`, `box-shadow:0 0 0 2px var(--dark)`.

**Stato vuoto (`.empty-state`)**

```
display:flex; flex-direction:column; align-items:center; justify-content:center;
padding:40px 20px; text-align:center; color:var(--muted); border-radius:12px;
background:radial-gradient(360px 220px at 50% 0%,
           color-mix(in srgb,var(--amber) 6%,transparent), transparent 70%)
.empty-icon  48px, opacity:.6, drop-shadow(0 0 14px color-mix(in srgb,var(--amber) 22%,transparent))
.empty-title Condensed 16px/800, ls 2px, maiuscolo, colore --text
.empty-sub   12px, --muted, max-width:280px
```

**Caricamento**: `.dw-spin` (cerchio 34px, bordo 3px `--border`, cima
`--amber`, `dwspin .8s linear infinite`) e `.dw-skel` (rettangolo
scheletro, gradiente a 3 tappe `card/card2/card`, `background-size:400% 100%`,
`dwshim 1.2s ease infinite`, raggio 12px, `min-height:64px`).

### 1.8 Animazioni e transizioni

| Nome | Durata | Curva | Dove |
|---|---|---|---|
| curva unica | — | `cubic-bezier(.2,.7,.3,1)` | `*{transition-timing-function:var(--ease)}` |
| `fadeUp` | .5s (modale .25s) | `ease` | login, modali |
| `scrFade` | .22s | `--ease` | cambio schermata (solo opacità, mai `transform`) |
| `spin` / `spinMini` / `dwspin` | .6s / .6s / .8s | `linear` | rotelline di attesa |
| `successPop` | .5s | `ease` | icona di conferma (0 → 1.1 → 1) |
| `pulseDanger` | 1.5s (KPI 2s) | — | badge e KPI in allarme |
| `pulseSync` / `pulseDot` / `rotateDot` | 1.5s / 1.5s / 1s | — | stato sincronizzazione |
| `dwshake` | .5s | — | errore di accesso |
| `dwshim` | 1.2s | `ease` | scheletro di caricamento |
| schede | .18s | `--ease` | `transform`, `box-shadow` |
| liste | .15s | `--ease` | `transform` |
| bottoni | .12s | `--ease` | pressione |
| alone schede/liste | .25s | `--ease` | `opacity` |
| campi | .18s | — | `border-color`, `box-shadow` |
| barra ricerca topbar | .3s | — | larghezza 130px → 200px al fuoco |

Extra sempre presenti: `::selection{background:rgba(255,171,0,.3)}`,
`:focus-visible{box-shadow:0 0 0 3px rgba(255,171,0,.30)}` (mai
`outline` al tocco), barre di scorrimento 9px con pollice `--border2`
raggio 6px, e `@media(prefers-reduced-motion:reduce){*{transition:none!important}}`.

---

## PARTE 2 — Cosa oggi non combacia, app per app

### 2.0 Il quadro d'insieme (vale per tutte e sei)

Le sei app verticali (`scudo`, `campo`, `flotta`, `conti`, `sentinella`,
`terra`) sono **identiche tra loro**: ognuna ha un solo blocco `<style>`
di 3 righe con i due colori (riga 16–19 di ogni `index.html`) e per tutto
il resto si appoggia a `shared/deepwork-style.css` +
`shared/dw-app-shell.css`. **Quindi le differenze rispetto al core sono
tutte nei due fogli condivisi**: si sanano una volta sola e valgono per
tutte. Questa è la notizia buona.

Quello che manca nei fogli condivisi, ordinato per impatto visivo:

| # | Cosa manca | Dove sta nel core | Effetto oggi |
|---|---|---|---|
| 1 | **Topbar del core**: gradiente `180deg rgba(30,24,12,.97)→rgba(20,16,10,.97)`, sfocatura `blur(12px)`, riga luminosa `::after`, altezza 62px, `env(safe-area-inset-top)` | `.topbar`, riga 6700 + 7123 | `.top` (dw-app-shell 11–19) è un rettangolo piatto `var(--panel)` con ombra `0 6px 18px`: si vede subito che non è il core; su iPhone finisce sotto la tacca |
| 2 | **Barra di navigazione a pillola flottante** con pillola dietro la voce attiva, sollevamento e alone dell'icona | `#global-nav.bnav` riga 7318, `.bn` 6739 + 7141 | `.nav` (dw-app-shell 28–44) è una barra piena attaccata al bordo, con una lineetta 2px sopra la voce attiva: forma completamente diversa |
| 3 | **Alone dinamico che segue il mouse** su schede e liste (`::after` + `--mx/--my`) | righe 7248–7254, 7277–7281 | assente ovunque: è *la* firma del core, la sua mancanza è la differenza più percepita |
| 4 | **Numero KPI in gradiente** e scheda KPI con bordo alto e sinistro 3px | `.kpi-val` 7143, `.kpi-card` 6996 + 7257 | `.kpi .n` (dw-app-shell 56) è un numero pieno su scheda piatta `var(--card)`, senza bordi d'accento |
| 5 | **Superficie a gradiente** delle schede (`linear-gradient(180deg,var(--card2),var(--card))`) | 7144–7148, 7233 | tutte le schede delle app sono piatte: la profondità del core sparisce |
| 6 | **Modali del core** (`.modal-ov/.modal-box/.modal-head/.modal-body/.modal-foot/.mbtn`) | 6778–6788, 7101, 7198–7201 | **le sei app usano `alert()`/`confirm()` del browser** (24 chiamate in totale): finestre di sistema bianche, fuori stile |
| 7 | **Toast** | 6970–6973, 7112 | assente: i messaggi finiscono in `<div class="note">` grigi in mezzo alla pagina |
| 8 | **Stato vuoto** (`.empty-state` con icona, titolo, sottotitolo e alone) | 6858–6861, 7261–7262 | le app scrivono una frase in `.note` (es. `scudo/index.html:257`, `:274`, `:283`, `:299`, `:318`): testo nudo, senza icona né gerarchia |
| 9 | **Filtri `.chg`/`.chip` del core** | 6958–6962, 7092, 7151–7152 | le app usano `.dw-btn.secondary` con stili in linea `min-height:34px;padding:4px 12px;font-size:12px` (es. `terra/index.html:67-69`, `scudo/index.html:72-75`): **34px viola la regola dei 44px** e non somiglia al segmento del core |
| 10 | **Tabelle** (`.tbl/.thead/.trow/.tnum/.cinput`) | 6754–6764 | assenti dai fogli condivisi |
| 11 | **Temi chiaro e sole** (`body.light-mode`, `body.outdoor-mode`) | 6506–6664 | le app hanno **un solo tema**: chi attiva la modalità sole nel core e passa a un'app si ritrova al buio, illeggibile in cava |
| 12 | **Sfondo d'ambiente** `body::before` con i due aloni radiali | 6669–6671 | fondo piatto |
| 13 | **Difese touch** del core: `font-size:16px!important` sui campi, niente hover incollato, niente `backdrop-filter` su mobile, `touch-action:manipulation`, `overscroll-behavior` | 7333–7349, 7379–7407 | `.dw-input` è a **15px** (`shared/deepwork-style.css:136`): su iPhone la pagina si ingrandisce da sola a ogni tocco su un campo |
| 14 | **Rifiniture**: `::selection`, `:focus-visible` ambra, barre di scorrimento, `prefers-reduced-motion`, `.dw-spin`, `.dw-skel` | 7040–7043, 7114–7116, 7120, 7177, 7264 | assenti |
| 15 | Nomi dei token diversi: il condiviso ha `--grad-danger`/`--grad-success`, il core `--grad3`/`--gradSuc`; mancano `--g-*` e `--glow-strength` | `shared/deepwork-style.css:43-44` | copiare regole dal core in un'app oggi non funziona: le variabili non esistono |

Differenze puntuali dei componenti già esistenti nel foglio condiviso:

| Componente | Core | Condiviso oggi | Da fare |
|---|---|---|---|
| `.sec` / `.sec-title` | 11.5px, ls 2.5px, pallino 5px **con alone**, **riga di chiusura** sotto | `dw-app-shell.css:63-66`: 13px, ls 2px, pallino 8px senza alone, nessuna riga | allineare i 4 valori |
| `.avatar` / `.av` | 36px, **raggio 11px**, fondo in gradiente, testo `#100d07`, ombra | `dw-app-shell.css:76-78`: 38px, **cerchio**, fondo `--card2`, testo accento | allineare forma e riempimento |
| `.badge` / `.scad-badge` | **raggio 3px**, fondo pieno, 9px/800 | `dw-app-shell.css:82-86`: **pillola raggio 20px**, fondo al 15%, 11px | allineare |
| `.dw-btn` / `.btn-main` | 15px, ls 3px, `padding:13px`, testo `#100d07` | `deepwork-style.css:99-115`: 13px, ls 2px, `padding:10px 20px`, testo `#1a1206` | allineare (ombre e pressione **già corrette**) |
| `.dw-input` / `.finput` | fondo `var(--card)`, `11px 13px`, **16px**, raggio 9px, `:hover` bordo `--border2` | `deepwork-style.css:127-138`: fondo `var(--panel)`, `10px 12px`, **15px**, raggio 8px, nessun `:hover` | allineare |
| `.item` / `.sitem` | + alone caldo, fondo `card2` al passaggio, **striscia sinistra 3px per stato** | `dw-app-shell.css:68-75`: ombre e scorrimento **già corretti**, manca il resto | aggiungere alone e stati |
| `.kpi` / `.kpi-card` | raggio 8px, bordo alto+sinistro 3px, fondo a gradiente, numero in gradiente | `dw-app-shell.css:50-61`: raggio 12px, fondo piatto, numero pieno | allineare |
| `.top h1` / `.logo-sm` | colore `--amber` + `text-shadow` ambra | `dw-app-shell.css:17`: colore `--text`, nessun bagliore; solo il `·` è colorato | colorare il nome dell'app con `--app-accent2` + bagliore |
| `.tour-banner` | non esiste nel core; il parente è `.info-box` (fondo `card2`, `border-left:3px solid`) | `dw-app-shell.css:20-25`: riquadro con bordo intero | riportarlo alla forma `.info-box` |

### 2.1 Scudo (`apps/scudo/index.html`, 637 righe)

- **Già allineato:** font, palette, token, struttura pagine/nav, `.item`
  (ombre e scorrimento), badge di stato per gravità.
- **Da sanare:** tutti i punti 1–15 di cui sopra, più —
  - righe **72–75, 148–151**: filtri come `.dw-btn secondary` con
    `min-height:34px` in linea → devono diventare `.chg` (44px);
  - righe **257, 274, 283, 299, 318**: cinque stati vuoti scritti come
    `<div class="note">` → `.empty-state`;
  - **6 `alert()`/`confirm()`** → modale del core;
  - riga **41** `#safety-banner` con `font-size:15px` in linea → dovrebbe
    essere una scheda `.stat`/`.kpi-card` del core;
  - riga **129–130**: `<select class="dw-input">` senza la regola
    `select.finput option{background:var(--card)}`: su alcuni browser il
    menù a tendina si apre bianco.

### 2.2 Campo (`apps/campo/index.html`, 488 righe)

- **Già allineato:** come Scudo.
- **Da sanare:** i punti 1–15, più —
  - riga **220**: filtri con stili in linea → `.chg`;
  - **4 `alert()`/`confirm()`** → modale;
  - **righe 404–407 — il caso più grave della app**: il "Rapporto di fine
    turno" apre una finestra di stampa con un foglio di stile
    completamente estraneo (`body{font:13px/1.45 sans-serif;color:#222}`,
    `th{background:#f2f2f2}`). È l'unico documento che il cliente
    *stampa e consegna*, ed è l'unico pezzo che non sembra Deepwork.
    Serve un foglio di stampa condiviso in stile core (Barlow/Barlow
    Condensed, intestazioni con `letter-spacing`, tabelle come `.tbl`).

### 2.3 Flotta (`apps/flotta/index.html`, 503 righe)

- **Già allineato:** come Scudo.
- **Da sanare:** i punti 1–15; riga **241** filtri in linea → `.chg`;
  **6 `alert()`/`confirm()`** → modale.
- **In più, il problema di colore:** l'accento `#5b7186` è **lo stesso
  blu di Sentinella** (`#1971c2`) come tinta (209° entrambi) e i due
  colori chiari sono quasi indistinguibili (`#7fbcff` 211° vs `#74c0fc`
  206°). Vedi Parte 3.

### 2.4 Conti (`apps/conti/index.html`, 463 righe)

- **Già allineato:** come Scudo.
- **Da sanare:** i punti 1–15; righe **229 e 236** (due gruppi di filtri)
  → `.chg`; **6 `alert()`/`confirm()`** → modale.
- **In più:** è l'app dei soldi e mostra molte cifre; nel core i numeri
  importanti sono in Barlow Condensed 800 con gradiente (`.kpi-val`,
  `.sv`, `.ss-val`). Qui gli importi sono in Barlow normale dentro
  `.meta`: vanno portati alla tipografia numerica del core.

### 2.5 Sentinella (`apps/sentinella/index.html`, 509 righe)

- **Già allineato:** come Scudo; l'accento blu `#1971c2` è quello deciso
  dal fondatore il 25/07 e **resta**.
- **Da sanare:** i punti 1–15; riga **241** filtri → `.chg`;
  **3 `alert()`** → modale.
- **In più:** i grafici delle serie storiche (task C3) devono nascere già
  con `.chart-card`/`.chart-title`/`.chart-bars`/`.chart-bar` del core
  (righe 6908–6914 e 7006–7008), non con un disegno nuovo.

### 2.6 Terra (`apps/terra/index.html`, 450 righe)

- **Già allineato:** come Scudo.
- **Da sanare:** i punti 1–15; riga **230** filtri → `.chg`;
  **3 `alert()`** → modale;
  - riga **74**: `<select class="dw-input" style="min-height:32px">` —
    sotto i 44px e sotto i 16px di carattere: doppia violazione delle
    regole del core.

### 2.7 Genesi (`apps/genesi/genesi.html`, 3388 righe) — caso a parte

Genesi **non usa affatto i fogli condivisi**: ha un blocco di stile
proprio con **nomi di token diversi** (`--tx`, `--mut`, `--mut2`,
`--line`, `--panel2`, `--cu`, `--cuD`, `--ok`, `--warn`), anche se i
valori coincidono quasi tutti con il core (`--tx:#f0e8d8`,
`--mut:#9b8a60`, `--line:#332a14`, `--cu:#ffab00`).

- **Già allineato (di fatto):** palette, font Barlow/Barlow Condensed,
  gradiente dei bottoni primari, ombre profonde, anello di fuoco 3px.
- **Da sanare:**
  1. **Non ha un accento proprio**: usa `--cu:#ffab00`, cioè l'ambra del
     core → oggi Genesi *è* il core, non una gemella riconoscibile. Le
     spetta il rosso della famiglia "volata" (`#e5484d`/`#ff6a70`),
     coerente con come l'hub la colora già (`apps/index.html:51`).
  2. Rinominare i token su quelli condivisi (`--tx`→`--text` ecc.), così
     una correzione fatta nel core si propaga anche qui.
  3. Raggi fuori specifica: `9px` sui bottoni e `14px`/`16px`/`18px` su
     riquadri e modali, contro `--r:12px` / `--r-sm:8px` del core
     (righe 92, 95, 109, 148, 173).
  4. Bottone primario `#ffc12e→#ff8c1d` con testo `#3a1e00` invece di
     `--grad` con testo `#100d07` (righe 85, 98).
  5. `#bottomnav` (riga 183) è già una pillola flottante — **è la app più
     vicina al core su questo punto**, e la sua misura
     (`bottom:14px; max-width:412px; border-radius:20px`) va uniformata a
     quella del core (`bottom:8px+safe-area; max-width:520px; raggio 18px`).
  6. `.gmodal-card::before` (riga 177) è la riga luminosa in cima alla
     scheda: **bella, ma non è del core**. O si porta prima nel core (e
     poi ovunque), o si toglie da Genesi.

### 2.8 Hub e Deepwork ID (contorno)

- `apps/index.html`: usa solo `deepwork-style.css`, riscrive `.tile` in
  proprio (righe 16–22) con `transition:transform .15s` senza `--ease`,
  senza ombre e senza alone → va sostituito con la `.tile` condivisa.
- `apps/deepwork-id/*.html`: 4 pagine con blocchi di stile propri
  (`.logo`, `.box`, `.field`, `.sep`, `.msg`). `.msg.error` usa un colore
  inventato (`#ffb4b2`) al posto di `var(--danger)`; il resto è coerente.
  L'accento "sistema" `#c7b794` ha tinta 41°, praticamente identica
  all'ambra del core (40°): per Deepwork ID va bene (è il servizio
  trasversale, non una verticale), ma **non va assegnato a nessuna app**.

---

## PARTE 3 — I colori dominanti

### 3.1 Situazione attuale e leggibilità

Contrasto misurato sul fondo delle schede (`--card:#221c0e`) e sul fondo
pagina (`--bg:#100d07`). Il minimo AA per il testo è **4,5:1**; per bordi
e segni grafici è **3:1**.

| App | accento base | tinta | contrasto su scheda | accento chiaro | contrasto su scheda | verdetto |
|---|---|---|---|---|---|---|
| Campo | `#e8821c` | 30° | 6,16 ✅ | `#ffb733` | 9,73 ✅ | ok |
| Scudo | `#8b5cf6` | 258° | 4,00 ⚠️ | `#bd96ff` | 7,23 ✅ | base solo grafica |
| Terra | `#2f9e44` | 131° | 4,91 ✅ | `#5fe05a` | 9,91 ✅ | ok |
| Conti | `#0e9384` | 173° | 4,45 ⚠️ | `#23dcc6` | 9,77 ✅ | base solo grafica |
| Sentinella | `#1971c2` | 209° | 3,37 ⚠️ | `#74c0fc` | 8,62 ✅ | base solo grafica |
| Flotta | `#5b7186` | 209° | 3,35 ⚠️ | `#7fbcff` | 8,50 ✅ | **tinta doppia** |
| (Genesi) | `#e5484d` | 358° | 4,33 ⚠️ | `#ff6a70` | 6,08 ✅ | base solo grafica |
| (Deepwork ID) | `#c7b794` | 41° | 8,57 ✅ | `#e8dcc0` | 12,44 ✅ | ok |

**Due problemi reali.**

**(a) Flotta e Sentinella hanno lo stesso colore.** Non "simile": la
stessa tinta esatta (209°), e i due colori chiari — quelli che si vedono
davvero, perché sono il numero dei KPI e la voce di menu attiva —
differiscono di 5°. Aperte una accanto all'altra sono indistinguibili.
Sentinella non si tocca (decisione del fondatore del 25/07: il blu è il
colore dell'ambiente). **Si sposta Flotta.**

**(b) Sei accenti base su otto non arrivano a 4,5:1.** Non è un dramma
*se* si stabilisce una regola chiara, che oggi manca:

> **Regola dei due accenti.** `--app-accent` (base) si usa solo per
> **bordi, strisce, pallini, riempimenti** — gli serve 3:1, e tutti lo
> superano. `--app-accent2` (chiaro) è **l'unico ammesso per il testo** —
> tutti superano 6:1.

Oggi la regola è violata in un punto solo, ma molto frequentato:
`shared/deepwork-style.css:124` — `.dw-btn.secondary{color:var(--app-accent)}`.
Quella classe compare **65 volte** nelle sei app. Per Flotta e Sentinella
quel testo sta a 3,8:1 sul fondo pagina: sotto soglia. **Va cambiato in
`var(--app-accent2)`.**

### 3.2 Il nuovo colore di Flotta

Le tinte già occupate sono 30° (Campo), 131° (Terra), 173° (Conti),
209° (Sentinella), 258° (Scudo), 358° (Genesi), più 40° del core. Gli
unici spazi liberi ampi sono il giallo-lime (60–90°, da evitare: si
confonde con l'ambra del core) e il magenta (290–330°, libero e lontano
da tutti). Proposta:

| | Base | Chiaro | Tinta | Distanza dal vicino più prossimo | Contrasto base su scheda | Contrasto chiaro su scheda |
|---|---|---|---|---|---|---|
| **A — consigliata: magenta lampone** | `#d0559e` | `#f39ccd` | 324° | 34° da Genesi, 66° da Scudo | 4,41 (≥3 ✅ come colore grafico) | 8,42 ✅ |
| B — alternativa: viola orchidea | `#c46bd6` | `#e2aef0` | 290° | 32° da Scudo | 5,18 ✅ | 9,31 ✅ |

Si consiglia **A**: è la più lontana da tutte le altre e non rischia di
essere scambiata per Scudo. La B è più "fredda" e forse più adatta ai
mezzi, ma si avvicina al viola di Scudo. **La scelta finale è del
fondatore**; il documento è pronto per entrambe.

Vanno aggiornati insieme al CSS anche `<meta name="theme-color">` (riga 7)
e i due `%23...` dentro il manifest (riga 12) di `apps/flotta/index.html`,
altrimenti l'icona sull'home screen resta blu.

---

## PARTE 4 — Piano di applicazione

### 4.1 Cosa va nel foglio comune (`shared/deepwork-style.css`)

Tutto ciò che non è colore. Il foglio passa da 147 righe a un vero
"gemello" del core. Nell'ordine:

1. **Token**: aggiungere `--g-*` (le sette famiglie), `--glow-strength`,
   e gli alias `--grad3`/`--gradSuc` accanto ai nomi attuali, così le
   regole copiate dal core funzionano senza ritocchi.
2. **Sfondo d'ambiente**: `body.dw::before` con i due gradienti radiali.
3. **Tipografia**: le scale della tabella 1.3 come classi
   (`.dw-title`, `.dw-label`, `.dw-num`…).
4. **Superfici**: `.dw-card` con gradiente `card2→card`, ombre a riposo e
   al passaggio, sollevamento -3px, alone `::after` con `--mx/--my`.
5. **Componenti mancanti**, riprodotti dal core:
   `.dw-modal*`, `.dw-toast`, `.dw-empty*`, `.dw-chip`/`.dw-seg` (i
   filtri, 44px), `.dw-table*`, `.dw-badge` (raggio 3px), `.dw-spin`,
   `.dw-skel`, `.dw-info-box`.
6. **Rifiniture globali**: `::selection`, `:focus-visible`, barre di
   scorrimento, `prefers-reduced-motion`.
7. **Blocco touch** (`@media (hover:none),(pointer:coarse)`): campi a
   `16px!important`, niente hover incollato, niente `backdrop-filter`,
   niente alone — copiato pari pari dal core (righe 7333–7349, 7379–7407).
8. **Temi**: `body.light-mode` e `body.outdoor-mode` completi, con
   l'interruttore condiviso in `dw-shell.js` così la scelta fatta nel
   core vale anche nelle app.
9. **Correzioni immediate**: `.dw-input` a **16px**, fondo `var(--card)`,
   raggio 9px; `.dw-btn` a 15px/ls 3px/`padding:13px`/testo `#100d07`;
   `.dw-btn.secondary{color:var(--app-accent2)}`.

### 4.2 Cosa va nella shell (`shared/dw-app-shell.css`)

Solo la struttura di pagina, riscritta sulle misure del core:

1. `.top` → copia di `.topbar`: gradiente, `blur(12px)`, riga luminosa
   `::after`, `min-height:62px`, `env(safe-area-inset-top)`, ombra
   `0 2px 12px rgba(0,0,0,.28)`. La riga luminosa usa
   `var(--app-accent)` invece dell'ambra: è l'unico punto in cui il
   colore dell'app entra nella barra.
2. `.nav` → copia di `#global-nav.bnav`: pillola flottante, raggio 18px,
   `max-width:520px`, `bottom:calc(8px + env(safe-area-inset-bottom))`,
   voce attiva con pillola `::before`, `translateY(-2px)` e alone
   dell'icona nel colore dell'app.
3. `.kpi` → copia di `.kpi-card`: raggio 8px, bordo alto e sinistro 3px
   `var(--app-accent)`, fondo a gradiente, numero in gradiente
   `--app-accent → --app-accent2`.
4. `.sec` → 11.5px, ls 2.5px, pallino 5px con alone, riga di chiusura.
5. `.item` → aggiungere alone caldo, fondo `card2` al passaggio e strisce
   di stato a sinistra.
6. `.avatar` → 36px, raggio 11px, fondo a gradiente d'accento, ombra.
7. `.tour-banner` → forma `.info-box`.
8. Aggiungere `.dw-tabs`/`.dw-tab` (le linguette interne del core) in
   vista del task C1.

### 4.3 Cosa resta nelle singole app

**Soltanto due righe di colore**, esattamente com'è oggi:

```html
<style>:root{ --app-accent:#XXXXXX; --app-accent2:#YYYYYY; }</style>
```

più i due punti dove lo stesso colore va ripetuto per forza di cose:
`<meta name="theme-color">` e il manifest dell'icona. Nient'altro. Ogni
`style="..."` in linea che oggi corregge una misura (i `min-height:34px`
dei filtri, i `font-size:12px`, gli `width:auto`) va cancellato e
sostituito da una classe condivisa: finché restano, ogni app scivola per
conto suo.

### 4.4 Ordine consigliato dei lavori (task C1)

Una app per unità di lavoro, ma i primi due passi sono comuni:

1. **Passo 0 — fogli condivisi** (4.1 + 4.2). Da solo copre i punti 1–5,
   9 e 11–15 della tabella 2.0 per tutte e sei le app insieme.
2. **Passo 1 — modale e toast condivisi** + sostituzione delle 24
   `alert()`/`confirm()` (punti 6 e 7).
3. **Passo 2 — una app alla volta**, nell'ordine Scudo → Campo → Flotta →
   Conti → Sentinella → Terra: sostituire filtri e stati vuoti, togliere
   gli stili in linea, screenshot di confronto con il core.
4. **Passo 3 — Flotta**: applicare il nuovo colore (dopo l'ok del
   fondatore).
5. **Passo 4 — Campo**: foglio di stampa Deepwork per il rapporto di fine
   turno.
6. **Passo 5 — Genesi**: token rinominati, accento rosso volata, raggi a
   norma.

### 4.5 Tabella finale dei sei accenti

| App | A cosa serve | `--app-accent` (bordi, strisce, pallini) | `--app-accent2` (testo, numeri, voce attiva) | Stato |
|---|---|---|---|---|
| **Campo** | operatività di giornata | `#e8821c` | `#ffb733` | confermato |
| **Scudo** | sicurezza e personale | `#8b5cf6` | `#bd96ff` | confermato |
| **Terra** | estrattivo e rilievo | `#2f9e44` | `#5fe05a` | confermato |
| **Conti** | amministrazione | `#0e9384` | `#23dcc6` | confermato |
| **Sentinella** | ambiente e monitoraggi | `#1971c2` | `#74c0fc` | confermato (decisione 25/07) |
| **Flotta** | mezzi e manutenzione | **`#d0559e`** *(era `#5b7186`)* | **`#f39ccd`** *(era `#7fbcff`)* | **da approvare** — alternativa B: `#c46bd6` / `#e2aef0` |

Fuori dalle sei verticali, per completezza: **Genesi** `#e5484d`/`#ff6a70`
(da applicare: oggi usa l'ambra del core), **Deepwork ID**
`#c7b794`/`#e8dcc0` (confermato), **core Deepwork** `#ffab00`/`#ffd54f`
(intoccabile: è il riferimento di tutti).

---

*Documento di specifica. Non contiene codice di produzione: le modifiche
ai fogli di stile si fanno nelle unità di lavoro del task C1.*
