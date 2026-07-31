# Checkpoint — la copertura a 410/411, e due pagine che nessuno guardava

**Commit:** `875ca42` (gli ultimi sei export), `8035a6b` + `feba6ae` (`perCampo`
trovata), `b10579b` (quanto dorme la trappola di `go()`), `13ff0ab` (le due
pagine dimenticate)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. Gli ultimi sei export che nessuna prova nominava — 405 → 410 su 411

Erano tutti della stessa famiglia: **alias e costanti**, cioè proprio le cose
che sembrano non aver bisogno di una prova. Ma un alias è esattamente ciò che
si rompe in silenzio.

`TIPI_MEZZO` (l'elenco con cui Flotta indovina il tipo di una macchina dal
nome, quando è stata registrata prima che il campo esistesse) adesso è blindato
su quello che conta davvero:

- **«altro» sta in fondo e non ha indizi.** Se ne avesse uno, prenderebbe al
  posto di un tipo vero;
- **nessun indizio è contenuto in un altro.** Altrimenti il tipo lo
  deciderebbe l'**ordine** dell'elenco, e spostare una riga cambierebbe la
  checklist di macchine già registrate;
- **il dato scritto in anagrafica vince sempre** sull'indizio pescato dal nome.
  Indovinare la checklist è innocuo — l'operatore vede le voci e le riconosce —
  scrivere un dato indovinato nell'anagrafica no.

### Controprova: sei difetti, sei prove cadute — dopo due correzioni

Le due iniezioni sbagliate sono le due cause già catalogate in `CLAUDE.md`:

- **l'iniezione non iniettava il difetto**: «un indizio dentro un altro»
  metteva `carica`, che non è contenuto in nessun altro indizio. Con `car`
  (dentro `autocarr` e `carrell`) la prova cade;
- **la prova non poteva distinguere**: «Terra si riscrive la frase in casa»
  **non** fa cadere l'identità, e non è un difetto della prova — **due stringhe
  uguali sono `===` anche quando sono due copie**. Sulle costanti di testo
  l'identità non dimostra niente, e il controllo che sa vederlo guarda il
  **sorgente**. La prova è stata rinominata per dire quello che dimostra
  davvero, invece di prendersi un merito che non ha.

## 2. `perCampo` è scritta due volte — e nessun controllo poteva vederla

Identica carattere per carattere in `dw-shell.js` e in `flotta-data.js`.

Il controllo sui nomi doppi faceva **una domanda sola**: due app esportano lo
stesso nome? Ma il posto della regola condivisa non è un'app, è `shared/`, e la
coppia più facile da sbagliare è proprio **un'app contro `shared/`**. Quella
forma non la guardava nessuno — e Flotta è l'unica app che esporta quel nome,
quindi nemmeno il confronto app-contro-app poteva accorgersene.

Aggiunta la domanda mancante: **dieci** coppie confrontate, una violazione. Il
controllo stampa il numero e **cade se scende sotto otto**.

> ⚠️ **La correzione del modulo aspetta la fine del giro del browser** — è un
> modulo dati, le pagine lo importano, e modificarlo mentre il giro le apre
> falserebbe il giro. Nel frattempo il controllo è rosso, e il rosso dice il
> vero.

## 3. Quanto dorme la trappola di `go()` — misurato

Prima di irrigidire, la misura: **nessuna app chiama oggi `go()` verso una
pagina che non esiste**. Le guardie servono contro l'id di *domani*.

E si vede bene **perché** Flotta si è staccata: è l'unica con più pagine (8)
che voci di navigazione (6). La mappa è una **funzione** sua; le guardie sono
una **protezione** e vanno a tutti.

## 4. Due pagine che l'utente apre, e nessuna regola aveva mai guardato

`CLAUDE.md` dice «quando nasce un'app va aggiunta all'elenco `SUPERFICI`»:
cioè una regola affidata alla memoria — la forma che `run-stile.mjs` esiste per
sostituire. Misurato: **sedici** file `.html` nel repo, **dodici**
nell'elenco. Le quattro fuori non erano state escluse, erano state
**dimenticate**.

Due sono pagine vere: quella in cui si finisce **quando manca un permesso** e
il **portone di Genesi**. Adesso ci passano sopra tutte e diciassette le
regole, e **passano tutte**: il buco era nella copertura, non nelle pagine. Le
altre due restano fuori ma **dichiarate** (il banco della nuvola di punti, il
collaudo dei grafici).

E una trappola in cui sono cascato subito: la prova sulla fase ha accusato
`login.html` di essere fuori fase, e invece quella pagina **non ha nemmeno uno
`<script>`**. «Nessuna ancora» ha due cause opposte, e adesso sono separate.

## Numeri

- KPI **971 → 975**, stile **231 → 251**, totale `node` **1.284 → 1.308**
- copertura funzioni **405 → 410 su 411** (resta `flotta.perCampo`, che si
  chiude con la correzione)
- fondi del censimento alzati: conti 57, flotta 69, sentinella 102, terra 40

## Prossimo passo atomico

Appena il giro finisce, in quest'ordine:

1. **`perCampo` diventa un alias** in `flotta-data.js` (lo script della
   correzione è già scritto e **si ferma da sé** se le due implementazioni non
   fossero identiche), più la prova d'identità in `run-kpi` e il fondo di
   Flotta a 70. Rimette verde il controllo sui nomi doppi;
2. **`go(id)` nel modulo condiviso**, col soprainsieme misurato;
3. **l'amministrazione di Deepwork ID** passa a `dw-app-ui.js`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15).
