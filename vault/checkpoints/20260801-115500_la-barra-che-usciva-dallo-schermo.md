# La barra che usciva dallo schermo

**Data:** 01/08/2026 · **Area:** `apps/deepwork-id/admin.html`
**Unità precedente:** `20260801-113900_la-guardia-annunciata-in-un-commento.md`

## Il difetto è uscito al primo colpo

L'unità precedente ha portato **tre pagine mai guardate** dentro il giro del
browser. Lanciati subito i tre banchi che pescano di più su una pagina nuova:

| banco | esito |
|---|---|
| `id-unici` | 14 superfici pulite |
| `contrasto` | 3.805 testi misurati, **0 sotto soglia** |
| `fuori-schermo` | ⛔ **2 schermate su 28**: l'amministrazione di Deepwork ID |

> `id · amministrazione @390: la pagina scorre di lato (441 px di contenuto)`
> `id · amministrazione @360: la pagina scorre di lato (437 px di contenuto)`

Su un telefono la pagina si trascinava di lato. Lo scatto lo mostra peggio del
numero: «DEEPWORK ID ·» andava a capo **tre volte** e «ORGANIZZAZIONE ATTIVA»
finiva tagliata dal bordo destro.

## La causa: due fogli condivisi che si contraddicono

- `dw-app-shell.css` disegna `.top` come **blocco** — `h1` sopra, `.sub` sotto;
- `dw-app-ui.css`, caricato **dopo**, la ridefinisce `display:flex; align-items:center`.

I due testi diventano così **voci affiancate** di una riga senza regole di
restringimento: finché il titolo è corto ci stanno, quando è lungo il secondo
esce. Non è un difetto di questa pagina, è una **struttura sbagliata** che
regge per fortuna — e l'amministrazione è la prima che ha superato la soglia.

Le sei app non ne soffrono perché usano la struttura del **core**: `.top-brand`
(`flex:1; min-width:0`) con `.logo-sm` sopra e `.role-sm` sotto, e `.role-sm`
porta già `text-overflow: ellipsis`. Se il testo non ci sta si accorcia, non
spinge fuori la pagina.

## La correzione, e quella che ho dovuto disfare

`admin.html` passa alla barra del core. Misura: **441 → 390 px** a 390,
**437 → 360** a 360.

⛔ **E poi ho toccato una pagina che non era rotta.** Avevo applicato la stessa
struttura anche a `profilo.html` — non su una misura, su una teoria («la
struttura sbagliata era la stessa»). Lo scatto l'ha bocciata: quella pagina
**non carica** `dw-app-ui.css`, quindi `.top-brand`, `.logo-sm` e `.role-sm`
lì non esistono, e il titolo è rimasto senza stile — minuscolo, senza il
condensato spaziato. Ripristinata.

La lezione è la regola del fondatore presa dal lato scomodo: **il confronto
affiancato serve anche a fermare le proprie idee**. Profilo resta con la sua
barra e non scorre di lato (`.top` lì è un blocco, non una riga); il giorno in
cui caricasse `dw-app-ui.css` diventerebbe il difetto di admin, ed è scritto nel
commento.

## Verifica

Misura diretta sulla pagina, alle due larghezze del banco: **441 → 390** a 390 px
e **437 → 360** a 360 px, cioè le due schermate che il banco segnalava non
scorrono più. Il rilancio del banco intero sulle 14 superfici è in corso e
conferma la stessa misura: è lo stesso criterio (`scrollWidth` contro il
viewport), applicato a mano invece che in giro.
Scatti prima/dopo di admin e profilo a 390 px. `run-stile` 272/0.

## Prossimo passo atomico

Gli altri banchi sulle tre superfici nuove — quelli che nessuno ha ancora
girato lì: `unita-maiuscole`, `note-stato`, `vuoti-azione`, `navigazione`. Poi,
se non esce altro, il secondo item aperto della roadmap (**E0, consolidamento
in `shared/`**), che è anche il posto dove andrebbe risolto il conflitto vero
fra i due fogli: `dw-app-shell.css` e `dw-app-ui.css` disegnano **la stessa
barra in due modi**, e finché convivono ogni pagina che le carica entrambe
dipende dalla lunghezza delle sue parole.
