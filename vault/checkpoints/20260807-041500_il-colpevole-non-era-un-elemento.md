# Checkpoint — 2026-08-07 04:15:00 UTC

## Tipo
unit-complete (due unità: il traboccamento all'indietro a 320 px, e il censimento
delle classi orfane portato nelle prove con la sua seconda domanda)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ed8ec85` — *La prima domanda dava 14 orfane e sette erano ganci di JavaScript:
la seconda ne dà 4, e sono vere*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 114 | **il traboccamento all'indietro** (`6a975bf`) | `modali-dentro --solo=core` **1 KO → 0**, e 38 modali / 176 aperture **invariate** |
| 115 | **le classi orfane nelle prove** (`ed8ec85`) | 14 → **4**, giro `node` 21 → **23** comandi, `suite-collegate` 93 → **94** file |

## ⛔ Il colpevole non era un elemento
Il KO diceva «il corpo scorre in orizzontale — nessun elemento sporge a destra:
guardare il traboccamento ALL'INDIETRO — 333 px su 320». Quel messaggio è un
**ripiego**, e mandava a cercare nel posto sbagliato.

Sotto la modale c'è `screen-3d`, e lì senza rete `build3D` scrive
`'3D non disponibile: '+e.message`, dove `e.message` contiene **l'indirizzo
intero del CDN**: una parola sola di 60 caratteri, inspezzabile. Misurata col
`Range` sul nodo di testo: **345,6 px in uno spazio di 320**, cioè 12,8 px fuori
a destra **e** 12,8 px fuori a sinistra.

Il testo nudo dentro un flex è una **scatola anonima**: `querySelectorAll('*')`
non la vede. Nella sonda: **173 nodi guardati, 0 sporgenti**; poi col
`TreeWalker` sui nodi di testo, **1 colpevole al primo colpo**.
⚠️ Da aggiungere all'elenco dei segni: quando una misura sull'overflow non trova
il soggetto, **il soggetto può non essere un elemento**.

⚠️ E la scelta ovvia era sbagliata, provata prima di scriverla:
`overflow-wrap:break-word` — la forma che il core usa già in `.toast` — lascia il
corpo a **333/320**, perché non riduce la larghezza **minima** del contenuto e un
elemento di flex ha `min-width:auto`. Solo `anywhere` la riduce: 320/320.
Chi vince misurato con `getComputedStyle`, non dedotto: `#d3-loading` ha tutto lo
stile **in linea**, ma `overflow-wrap` nell'inline non c'è, e lì il foglio morde.

## ⛔ La prima domanda era quella sbagliata
Il censimento che aveva trovato `ords` chiedeva «quale foglio la definisce?»:
**14** risposte su 1.154 classi, e almeno **sette erano ganci di JavaScript**
(`chk-item`, `uf-cava`, `cv-dest`, `chi-assente`, `mac-gest-body`) — classi
vivissime, cercate con `querySelectorAll`, che nessun foglio dipinge di
proposito. Un allarme che sbaglia una volta su due insegna a non guardarlo.

La difesa è quella che CLAUDE.md prescrive per questa famiglia, e non è «più
severità»: è una **seconda domanda** — *ogni occorrenza di questo nome, in tutto
il codice vivo, sta dentro un `class="…"`?* Da 14 a **4**, verificate una per una
con un `grep` su tutto il repository.

⚠️ E **due dei falsi allarmi venivano dai commenti**, per la **terza volta in una
giornata**: `class="fld"` dentro un commento in stile C di Scudo (la correzione
di stanotte toglieva solo i commenti HTML), e `.esempio` di Campo e Terra
definita in una **stringa** (`CSS_ESEMPIO = ".esempio{…}"`, il foglio della
finestra di stampa).

Le quattro morte: `mac-gest-tabs`, `ec-miccia`, `tipo-volata-btn` nel core,
`dc-rock` in Genesi. **Nessuna è un refuso alla `ords`** — sono nomi rimasti dopo
che lo stile se n'è andato altrove. Il segno più parlante è `tipo-volata-btn`: i
tre riquadri hanno **tutto** lo stile in linea, ripetuto tre volte, che è quello
che succede quando la classe era prevista e non è mai stata scritta.

## ⚠️ E il mio setaccio sul registro del giro sbagliava, di nuovo
Stanotte avevo letto un rosso di controprova come un guasto. Stamattina il
filtro che avevo scritto per non rifarlo **ha sbagliato due volte**:
1. cercava le intestazioni con `^════`, che combacia anche con le **sotto**
   intestazioni a sei uguali (`══════ core ══════`): dentro «campi interi ·
   controprova» il flag si azzerava e sono passati **60 KO voluti**;
2. riconosceva la controprova dalla **parola** «controprova» — ma due passate su
   quattro di `contrasto` si chiamano «non accusa chi pulsa» e «le classi mai
   comparse».
La regola che funziona è sulla **forma** dell'intestazione, non sulle parole:
la passata sana è quella **senza ` · `**. Con quella: **2 KO veri** in tutto il
registro, tutt'e due già affidati a un cantiere.

## Stato delle prove
Giro `node` **23 comandi** (erano 21), 0 caduti sulla copia di quello che si
committa. `suite-collegate` **94 file** (era 93): la suite nuova è registrata
**e** tracciata da git — il 02/08 quella differenza è stata fra un verde vero e
un verde su un commit rosso. Banchi **122**, copertura **662/662**.

## Che cosa sta girando adesso
1. **Il giro completo del browser** su una copia di `e5b1405`, dodici sezioni
   dentro. Nelle passate **sane** finora: **2 KO**, tutt'e due di contrasto AA
   nel core (`.btn-sv` 3,45:1 e «▶ SIMULAZIONE» 3,49:1, serve 4,5).
2. **Tre cantieri in parallelo**, uno per superficie, che non committano:
   · **core** — i due contrasti AA qui sopra;
   · **motore dei grafici** (`shared/dw-grafici.js`) — Terra dipinge a ×0,925,
     con il banco che lo tiene chiuso;
   · **Flotta** — il *pieno senza spesa* nei dati d'esempio, che renderebbe
     **visibile** una funzione e **misurabile** una regola in un colpo solo.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri** man mano che chiudono, verificando ognuno sulla
   **copia di quello che si committa** (worktree + `diff --cached | git apply` +
   `add -A`), e committare **app per app**.
2. **Leggere il giro completo** quando finisce, col setaccio giusto (passata sana
   = intestazione **senza ` · `**).
3. **Togliere le quattro classi morte** dalle pagine — è una modifica al
   prodotto, e va fatta **ad albero fermo**: quando spariranno, le loro righe in
   `ACCETTATE` devono sparire con loro, e la suite lo pretende.
4. **`unita-maiuscole` guarda le maiuscole**: ignorandole escono 15 casi in più,
   **4 falsi allarmi** (`DB`, `H`) e **11 veri, tutti nel core** (`MC TOTALI`,
   `KG/FORO`, `KG/MC`). ⛔ Non si allarga il banco **prima** di correggere il
   core: un banco registrato che fallisce rende rosso il giro di tutti. Le due
   cose vanno in **una unità sola**, e il core adesso è di un cantiere.
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08, ma «entro venerdì» vuol dire **a fine
   giornata**. Si applicano solo se a fine giornata non è arrivata risposta,
   dichiarandolo nel commit.

## Code aperte, dichiarate
- Le **quattro classi morte** (sopra), e il fatto che il core mostri a chi lavora
  in cava un messaggio da programmatore con dentro l'URL del CDN: è una **scelta
  di prodotto**, non un difetto di layout.
- I due fratelli `#rc-note` e `#sp-note` stanno dentro per **7,6 px** (font 11
  invece di 13), stessa causa del 320.
- **Genesi**: l'XML con l'id interno dell'esplosivo; la Home che esporta lo stato
  del 3D.
- **Conti**: `.meta.pesa` taglia 15 px su 1 riga DDT su 5.
- **Scudo**: le tre copie di `.fld`/`.fcamp` divergono sul `gap` (Terra ne ha 53).
- Il **minimo di visibilità** dei grafici e `#ppv-scelta` di Sentinella.

## Blocchi
Nessuno.
