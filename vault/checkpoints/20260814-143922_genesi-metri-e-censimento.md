# Checkpoint — 2026-08-14T14:39:22Z

## Tipo
unit-complete (due unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`da3ddfb8`

## Che cosa è stato completato

### 1 · `dd1513e1` — Genesi: i metri perforati si inventavano
`costoVolata` sapeva già dire «non calcolabile»; non serviva a niente perché
tutt'e tre i suoi chiamanti gli consegnavano numeri **inventati** al posto di un
`null`. **Riverificato da me**, non sulla parola del cantiere, chiamando la
funzione con le chiavi lette dalla sua destrutturazione:

| caso | fori | metri | costo | `calcolabile` |
|---|---|---|---|---|
| progetto sano | 12 | 130,8 | 2.270 € | true |
| `(D2.perRow\|\|18)*(D2.file\|\|1)` | **18** | 196,2 | **3.406 €** (+50%) | true |
| `nf*(D2.prof+(D2.sub\|\|0))` | 12 | **10,8** | **1.310 €** (−42%) | true |
| disco, tutt'e due | null | null | null | **false** |

Il secondo è il verso pericoloso e **non ha nessun `||`**: ha un `+`, e
`null + 0.9` fa 0,9 — finito, positivo, plausibile, quindi la guardia non poteva
scattare. Cura nel modulo (G21): `foriDiProgetto` e `metriPerforati`, `null` e
mai zero, con **assente ≠ corrotto** sulla sottoperforazione. Nessuna soglia e
nessuna formula toccata.
Fermi con la ragione: 26 per B0-septies, 6 sul decking (dove `1` è anche il
default legittimo «colonna unica»). Segnalato e non toccato: `hb = H/B` nella
scheda, senza guardia, dà `Infinity` con la spalla assente — altra famiglia.

### 2 · `da3ddfb8` — il censimento contava `|| String(x)` come costante
E **la sua guardia dichiarava il difetto già corretto**: il commento diceva «si
guarda il carattere dopo il match», ed era la diagnosi giusta accanto a una cura
che non toccava il malato — `String` non è tutto maiuscolo, la destra combacia
con la sola `S`, e il carattere dopo è la `t`. L'hanno rimisurato **due cantieri
indipendenti lo stesso giorno** (11 su 18 in Conti, 7 su 22 in Flotta): due
misure indipendenti che accusano lo stesso strumento sono il segno.
Costo misurato **prima** di stringere, sullo stesso albero, perché stringere non
produce rumore ma **cecità**: `MESTIERE 300 → 225`, core invariato a 50, e i nomi
che escono sono 57 `String`, 5 `Number`, 3 `Math`, 3 `NaN`, 1 `Array`, sei
variabili in maiuscoletto — **più cinque numeri in notazione scientifica che
erano ripieghi VERI** (`|| 1e9` che manda in fondo a un ordinamento un recettore
la cui distanza non si legge; `|| 1e-9` che salva una divisione). Per quelli si è
**allargato il numero** invece di stringere.
Il righello adesso si interroga sui suoi **16 punti di decisione** all'avvio e si
ferma (uscita 2) se ne sbaglia uno; con la guardia vecchia rimessa ne sbaglia 7.

## Verificato
- `run-kpi` 2339/0 · giro `node` sulla **copia di ciò che si committa**: 36
  comandi a posto, 0 caduti. La copia ha preso un numero che il disco non aveva:
  asserzioni 3.186 → **3.191**, corretto prima del commit.
- Documenti riallineati: prove 2.812 → **2.817**, copertura condivisa 180 → 183
  con `genesi-data.js` 66/66 → **69/69**, fondo di `copertura-funzioni` alzato a
  69 (lo chiedeva il censimento stesso), tabella degli estraibili riportata a
  quello che lo strumento stampa (23 e 26, non 24 e 25).
  `numeri-nei-documenti` 43/0.

## Un KO del giro riverificato e ASSOLTO — non aprire un cantiere
`giro-mirato-5` accusa `scudo: dopo l'arrivo dei dati nessun contatore resta «—»
→ isp-c-cnt: «Compilazione—»`. **Il prodotto ha ragione**: `#isp-c-cnt` vive
dentro `#isp-compila`, che è `display:none` finché non si apre un'ispezione, e
viene riempito alla riga ~3662 quando si apre. Il banco lo legge **invisibile**.
⛔ **La correzione va in `tests/browser/finestra-caricamento.mjs` e NON si può
fare adesso**: quel giro sta girando e i banchi li lancia dalla cartella VIVA
(la worktree congela il prodotto, non i banchi). Si fa **a giro finito**, e la
forma giusta non è solo filtrare per visibilità: i contatori saltati vanno
**contati e dichiarati**, perché un soggetto non misurato non è a posto. La
domanda va poi rifatta **sul sorgente**, che è la regola già scritta per le unità
in maiuscolo.
⚠️ Verificato anche che la domanda **esisteva** quando il giro è partito (banco
fermo alle 12:04, giro partito alle 12:07): non è un'accusa da banco migliorato
a metà giro.

## Stato del giro del browser
`giro-mirato-5` vivo da ~1h, attesta `ffcb8b16`, **branch avanti di 10 commit
(6 sulle superfici misurate)**: ogni suo KO è vero a quel commit, non adesso.
109 passate lette, 1 KO vero (quello qui sopra, assolto), 52 controprove.

## Prossimo passo atomico
1. **A giro finito**: leggerlo per intero con `browser/leggi-giro.mjs`, poi
   correggere `finestra-caricamento.mjs` perché la domanda «nessun contatore
   resta —» guardi **solo i contatori visibili**, dichiarando quanti ne salta e
   perché, con la controprova nei due versi.
2. Riaprire i **tre cantieri** morti sul limite di sessione (resetta alle 13:50Z,
   già passato): **core** — i ripieghi rimasti dopo `magliaDetta`, a partire da
   `v.fronte.lunghezza_m || 20` (riga ~4814) contro `|| 5` e `altezza_m || 4`
   (riga ~5482), cioè **lo stesso campo con due costanti diverse**; **Campo** —
   i clamp di `B0-duodecies` (`Math.max(0, +x || 0)`, il ripiego prima del
   clamp); **Scudo** — i clamp e i **fratelli** di `isp-c-cnt`, cioè i contatori
   riempiti solo dentro un ramo che può non essere mai preso.
3. Aggiornare la voce **B12** della roadmap: il suo capofila
   (`getBorraggio`/`getSpaziatura` su `|| 3.5` e `|| 4`) è **già chiuso** dal
   commit `5bcaf0b3` di oggi — è un «non c'è» scaduto, e la riga manda a lavorare
   dove non serve.

## Blocchi
- Limite di sessione della piattaforma: i tre cantieri paralleli sono morti
  all'avvio (reset 13:50Z). Nessun lavoro perso — non avevano scritto niente.
- Fermi al fondatore: soglie di sicurezza, B0-septies, `dRecFreq` intero
  all'ingresso, la coda offline (metà della decisione 5b), il force-with-lease.
