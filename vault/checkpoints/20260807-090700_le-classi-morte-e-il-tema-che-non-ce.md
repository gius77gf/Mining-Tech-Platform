# Checkpoint — 2026-08-07 09:07:00 UTC

## Tipo
unit-complete (tre unità: le quattro classi morte tolte, il tema outdoor del
core dichiarato morto con la sua prova, e la terza avvertenza su `run-kpi`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`006088f` — *CLAUDE.md: una prova scritta in fondo non può essere async*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 127 | **le quattro classi morte** (`f576131`) | 1.154 → **1.150** classi, morte 4 → **0** |
| 128 | **il tema outdoor del core** (`e331747`) | **136** occorrenze di stile che non si vedono mai |
| 129 | **la terza avvertenza** (`006088f`) | 1842 → **1843** |

## ⛔ La seconda metà della regola ha fatto il suo lavoro, per la prima volta
Tolte le quattro classi morte dalle pagine, `classi-orfane.mjs` ha preteso che
sparisse anche la riga che le scusava: **quattro KO** col messaggio giusto. È
esattamente il comportamento per cui `sonda-vuoto.mjs` ha insegnato quella metà.

⚠️ **Ma svuotando l'elenco la suite ha cominciato a stampare «0 passati, 0
falliti»** — il verde di un file di test **inerte**, indistinguibile da quello di
uno che passa. Aggiunte due prove che dicono che la scansione ha guardato
qualcosa (pagine lette, classi guardate sopra un fondo): 2 sulla passata sana, 6
sulla controprova.

## ⛔ Due persone, due volte, sullo stesso nulla
Il blocco `body.outdoor-mode` del core è codice morto: `applyTheme()` toglie
quella classe a ogni giro, e il core non carica `dw-tema.js` — che è invece chi
la mette **nelle app**, dove il tema `sole` è vivo (54 violazioni AA vere).
Il costo non è teorico: la correzione dei due contrasti del core era stata
giustificata con «in outdoor andrebbe a 1,94» (aritmetica giusta, superficie
inesistente), e un'ora dopo averlo scoperto ci sono **ricascato da solo**.
Ora c'è un commento **e** una prova con quattro condizioni indipendenti — fra
cui, all'opposto, che `shared/dw-tema.js` la classe la metta davvero: se no la
prova pinnerebbe «è morta» invece di «è morta NEL CORE».
⚠️ La rimozione delle 136 occorrenze resta **dichiarata e non fatta**: va
guardata a mano, perché alcune regole elencano più selettori e non tutti
richiedono la classe.

## ⚠️ E la trappola del test inerte in una veste nuova
La prova qui sopra, scritta `async`, **non contava**: `await Promise.all(inVolo)`
sta cinquemila righe più su, quindi una prova asincrona aggiunta in fondo viene
messa in volo e il totale si stampa senza aspettarla — 1842 prima e 1842 dopo,
con «7 prove asincrone aspettate» invece di 6 come unico segno. Non è «dopo il
`process.exit`»: è **dopo l'`await`**. Terza avvertenza in CLAUDE.md.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**. Prove **2.247**, copertura **677/677**,
banchi **129**, `suite-collegate` **97 file**.

## Che cosa sta girando adesso
1. **Il giro completo PULITO su `4643be7`** (`scratchpad/io-core/giro-3.txt`):
   sette sezioni dentro, **zero KO** nelle passate sane. Il setaccio adesso non
   indovina più: le controprove si dichiarano da sé nell'intestazione.
2. **Due cantieri sul tema `sole`**, su **Sentinella** (il report per l'ARPA:
   «Conforme» a 2,35 dove ne servono 3) e **Flotta** (i colori di stato: il
   `.giallo` di «sta per scadere» a **1,79**). A tutt'e due è vietato toccare
   `shared/`: se la correzione giusta sta lì devono fermarsi e dirmelo.

## Prossimo passo atomico
1. **Raccogliere i due cantieri del `sole`**, verificando ognuno sulla copia di
   quello che si committa. ⚠️ Se dicono che i colori di stato stanno in
   `shared/`, quella correzione è **mia** e va fatta una volta sola per tutte e
   sei le app — e allora gli altri quattro cantieri (Conti, Terra, Campo, Scudo)
   si aprono **dopo**, non prima.
2. **Leggere `giro-3.txt`** quando finisce: è il primo registro affidabile che
   contiene la correzione del motore dei grafici.
3. **Registrare `--tema=sole` in `tutti.mjs`** solo quando le 54 sono chiuse.
4. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- Le **136 occorrenze** di `body.outdoor-mode` nel core.
- Le **54** del tema `sole` (2 su 6 app affidate a un cantiere).
- Le altre del checkpoint precedente: `.meta.pesa` di Conti, i CSV di Scudo che
  non si dichiarano dimostrazione nel contenuto, `csvTarature`, `#ppv-scelta`,
  `.dwg-plot` a larghezza zero.

## Blocchi
Nessuno.
