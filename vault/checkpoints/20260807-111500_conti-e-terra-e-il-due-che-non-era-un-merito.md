# Checkpoint — 2026-08-07 11:15:00 UTC

## Tipo
unit-complete (tre unità: Conti nei temi chiari, Terra nei temi chiari, le tre
lezioni in CLAUDE.md)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`db18af7` — *CLAUDE.md: tre lezioni dei cantieri di oggi, e due sono sul
righello*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 140 | **Conti nei temi chiari** (`099f375`) | chiaro **10 → 0**, sole **10 → 0**, scuro 0 → 0 |
| 141 | **Terra nei temi chiari** (`f73efba`) | chiaro **2 → 0**, sole **2 → 0**, testi 570/570/570 |
| 142 | **le tre lezioni in CLAUDE.md** (`db18af7`) | — |

Quattro app su sei sono adesso a zero nei tre temi: Sentinella, Flotta, Conti,
Terra. Restano **Scudo** e **Campo**, tenute da due cantieri ancora vivi.

## ⛔ Il «2» di Terra non era un merito: era un denominatore
Terra usciva dal banco con **2** violazioni contro le 13 di Flotta, e le due
spiegazioni comode erano tutt'e due false alla misura: non aveva ridetto meno
colori (`--ink-ok` è a zero anche in Campo, Conti e Scudo) e non li usava di
meno — `color:var(--warn|--danger|--success|--info)` dà Terra **18**, il massimo
delle sei app.
Di quei 18 il banco ne poteva vedere **uno**: 2 bordi, 7 icone SVG senza testo
proprio, 2 solo `:hover`, 6 dentro `.vita.warn` / `.vita.danger`, che nella
dimostrazione **non compaiono mai**. Forzando quegli stati: **8 misure, 8 sotto
soglia**, fino a **1,77:1**.
La regola nuova: accanto a un conteggio di violazioni ci vuole il
**denominatore**. E il banco lo dichiarava già a modo suo — «18 classi che
dipingono un fondo non sono mai comparse» — e nessuno l'aveva letto.

## ⛔ La regola 24 poteva accusare un colore sano o smettere di guardare quello vero
Tre accuse false a Conti (`--grad-sup` 1,82 · `--grad-wr` 1,91 · `--grad3`
1,87) su una palette che il banco del contrasto dà a **zero** in tutti e tre i
temi: la mappa era piatta e il fondo uno solo, quindi teneva l'ultima
dichiarazione — quella di giorno — e la misurava contro la scheda del buio.
⚠️ La faccia opposta era peggiore perché **assolve**: una fermata scritta
`var(--x)` o con un `color-mix()` faceva sparire il gradiente dai giudicati
senza che niente diventasse rosso. Cioè **bastava dare un nome a un colore
perché smettesse di essere giudicato**.
Adesso ogni dichiarazione porta il tema del suo blocco, le variabili si
risolvono, e ci sono la controprova di giorno e l'assertion che i soggetti di
giorno siano > 0 (se no la metà nuova è una guardia scollegata). Soggetti
17 → **20**, nessuno perso.

## ⚠️ Tre cantieri che non si parlano hanno deciso la stessa cosa
Sentinella, Conti e Terra sono arrivate indipendentemente a **non toccare
`--warn/--success/--danger`** e ad aggiungere nomi nuovi, ognuna con la propria
misura del perché: in Conti scurire `--danger` fa scendere la pastiglia
«INSOLUTA» da 5,72 a **3,30**; in Terra `.badge.warn` ci scrive sopra quasi-nero
a 9,3:1. È il segno che la regola è del **prodotto**, non delle tre app: quando
un colore fa da **pieno** e da **inchiostro**, i due mestieri vogliono due
valori.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti** (verificato sulla copia di quello che si
committava, due volte). Prove **2.250** (`run-stile` 295), copertura 677/677,
banchi 129. I tre documenti col conto condiviso aggiornati da me al commit.

## Che cosa sta girando adesso
**Due cantieri**: Scudo e Campo, sui temi chiari.

## Prossimo passo atomico
1. **Raccogliere Scudo e Campo**, uno per uno, verificando sulla copia di quello
   che si committa e scrivendo io i conti dei documenti.
2. **Le tre KO del giro** ancora aperte vanno date a quei due cantieri quando
   riconsegnano: il prospetto annuale di **Terra** che esce dalla larghezza del
   foglio a 390 px (⚠️ questa è di Terra, che ha appena riconsegnato: va aperta
   come unità a sé), e le due sul nome del file `consegna_turno.txt` di **Campo**.
3. **Poi la geometria del gradiente** in `contrasto.mjs` (quattro angoli — per un
   gradiente lineare gli estremi della proiezione stanno lì), e **solo dopo**
   registrare `--tema=chiaro` e `--tema=sole` in `tutti.mjs`. Rimandata apposta:
   cambierebbe i numeri sotto ai cantieri vivi.
4. ⛔ **La decisione su `shared/`**: quattro app su sei hanno ormai risolto lo
   stesso problema con la stessa forma. Si decide **dopo** aver visto anche
   Scudo e Campo — il candidato è tre righe in `shared/dw-app-ui.css` che
   derivano i due livelli dai colori di ogni app, lasciando a ciascuna la
   facoltà di scavalcarli.
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- **La copertura di Terra**: sei punti d'interfaccia che nessun banco ha mai
  aperto, fra cui l'avviso «volume autorizzato esaurito».
- **13 classi con un fondo proprio** non compaiono mai durante il giro di Conti.
- Le etichette della barra in basso di Conti sono **tagliate** a 430 px con
  dieci voci («QUADR», «ATTUR», «BANCA», «ORDIN»).
- Il probe co-locato e `pixel.mjs` vivono in scratchpad: se servono a tutti,
  vanno in `tests/browser/`.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
