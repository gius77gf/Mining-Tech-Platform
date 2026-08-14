# Checkpoint — 2026-08-08T03:25:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimi commit
- `31af9a3` — *tokenizza: una regex dopo una freccia era letta come una divisione*
- `ab3d483` — *nomi-liberi: la quarta forma a zero, e da misura diventa regola*

## Che cosa è stato completato

Due unità, e la prima è **più grande di quella che stavo cercando**.

### 1. Il difetto stava nel tokenizzatore, non in `nomi-liberi`

Cercando la causa di `carburante` (uno dei sette liberi rimasti) è saltato
fuori che `mascheraCodice` — la scansione che sta sotto a **tutte e 29 le
regole** di `run-stile`, a `nomi-liberi`, a `import-esistenti`, a
`classi-orfane` — non riconosce una regex **dopo una freccia**. Dietro a `=>`
l'ultimo carattere non bianco è un `>`, che non era fra quelli dopo i quali ci
sta un'espressione: quindi

    const f = c => /carburante/i.test(c.voce)

veniva letto come una **divisione**, e il corpo della regex restava codice.
Misurato: **158 `=> /` nel repository, 460 tratti, 18.420 caratteri.**

⚠️ **E il difetto era LATENTE — va detto com'è, non gonfiato.** Nessuna delle
sette regex dopo una freccia contiene una virgoletta, quindi finora non aveva
nascosto niente: la prova sulla fase dava **10.304 dichiarazioni prima e
10.304 dopo**, perché nessuna ancora cadeva dentro quei tratti. Il danno è
quello che sarebbe arrivato: basta una regex ordinaria come
`s => /['"]/.test(s)` perché l'apostrofo apra una stringa che corre fino in
fondo al file e ogni regola costruita su questa scansione risponda «nessuna
violazione» senza aver guardato niente. È la terza volta che questa famiglia
morde (il 03/08: la pagina letta come JavaScript, e lo slash giudicato
dall'ultimo carattere invece che dalla parola).

⛔ **Il `+` è stato provato e SCARTATO con la misura**, perché nessuno lo
rimetta alla cieca: porta **3 tratti** in tutto, e due dei tre erano
**artefatti del `>` mancante** — sparivano da soli con la correzione giusta.
In cambio rompe `i++ / 2`, dove il carattere prima dello slash è un `+`,
mangiandosi il resto della riga.

### 2. La quarta forma a zero, e allora diventa regola

**35 → 34 → 9 → 7 → 6 → 0**, e **nessuno dei sei scalini era il prodotto**.
Gli ultimi tre: la regex dopo la freccia (difetto del tokenizzatore); i
**flag di una regex** presi per un nome; lo **IIFE che espone il globale col
nome del suo parametro** (`global.dwGrafici = api`).

Ora `nomi-liberi` ha **19 prove** (erano 16) e la quarta domanda **pretende**
invece di misurare.

## ⛔ La parte che insegna: due righelli storti e una riga falsa

1. **I flag di una regex non si riconoscono dalla forma.** `i`, `g`, `s` sono
   anche nomi di variabile veri. Si riconoscono dalla **posizione**, e la
   maschera la sa dire alla lettera: la barra che **chiude** una regex è
   l'unico `/` marcato come non-codice.
2. **Derivare l'alias del globale, non indovinarlo per nome.** Due stesure
   sbagliate, tutt'e due lasciate scritte nel file perché qui il rischio non è
   il rumore ma la **cecità** — quell'elenco alimenta tutte e quattro le
   domande:
   · elencando `window|globalThis|self|global` entravano **`_larg` e `_t`**,
     che sono `self._larg = w` con `var self = this`;
   · prendendo ogni `function(x){` per uno IIFE entravano **`className` e
     `textContent`**, cioè proprietà scritte su un elemento chiamato `a` o `n`.
   Derivando lo IIFE **più esterno** (colonna zero, chiusura a colonna zero):
   **2 nomi in più in tutto**, `dwGrafici` e `dwFluido`, su 325 già legati.
3. ⚠️ **E una riga l'avevo scritta falsa, corretta prima di lasciarla.** Nel
   riepilogo avevo scritto «nei moduli ci pensa `import-esistenti`». **No**:
   quello verifica il verso **opposto** — che un nome *importato* esista
   dall'altra parte, non che un nome *riferito* sia stato importato. Letta la
   sua intestazione invece di dedurlo dal nome.

## ⏱️ E il buco dei MODULI: misurato, e la misura NON vale

La quarta domanda guarda le **pagine**; i moduli restano fuori e **nessun
altro controllo li copre**. Ho provato a misurare il costo in scratchpad:
**60 allarmi su 38.119 riferimenti** — e quel numero **non va scritto da
nessuna parte come se misurasse il prodotto**, perché ho controllato tre
allarmi su tre ed erano tutt'e tre il **righello**:
- `tier` in `index.js` è `_entitlementAttivo(ent, tier = null)`, un parametro
  di **metodo di classe** — la mia copia veloce chiedeva la parola `function`;
- `statoRisposta` in `campo-data.js` è
  `export { statoPonte as statoRisposta } from …`, una **ri-esportazione**,
  non un riferimento;
- `viaggiSenzaDensita` in `conti-data.js` è un **dichiaratore su più righe** —
  cioè esattamente il caso che il `nomiDichiarati` **vero** ha già chiuso in
  `199bf05`, e che la mia copia non aveva.
Cioè avevo scritto in scratchpad una **copia più debole** della funzione che
esiste già nel file, ed ero a un passo dal metterne il risultato in un
checkpoint. È la famiglia di CLAUDE.md, in casa mia.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**, tutt'e due le volte.
- `run-stile`: 297 su 297 — e il conto **non doveva** salire, perché le due
  asserzioni nuove stanno dentro una prova che c'era già.
- `nomi-liberi`: **16 → 19 prove**, 0 fallite.
- Controprova della correzione al tokenizzatore, sui **due versi** e col
  difetto vero rimesso: col tokenizzatore di `HEAD` il caso freccia+apostrofo
  perde la fase (**1** dichiarazione presa per stringa), adesso **0**; e le due
  divisioni di guardia (`i++ / 2`, `larghezza / 2`) reggono **prima e dopo**.

## In volo

⏳ Il **giro del browser** sulla porta **8823**, uscita in
`scratchpad/io-core/giro-7.txt`, su una **copia di `958018d`** (lo dichiara
nella prima riga, e ha riletto il proprio contrassegno: pid 28054).

⛔ **E il giro precedente era stato ucciso dal riavvio del contenitore
lasciando vivo il suo server**: un `python3 -m http.server 8823` da **7 ore e
52 minuti** che serviva `/home/user/giro-copia-7002`, cioè un **commit
vecchio**. Il giro nuovo si è fermato da sé («gli ho chiesto il mio
contrassegno e mi ha risposto niente») invece di misurare la copia di
qualcun altro — la difesa scritta in CLAUDE.md ha funzionato alla lettera.
Uccisi anche due server `node` rimasti su 8577 e 8590.

## Prossimo passo atomico

⏱️ **Portare la quarta domanda anche sui MODULI**, riusando `nomiLegati`
**vero** (sta nello stesso file: non serve esportarlo, basta scrivere
`nudiLiberiModulo` lì dentro) invece della copia debole di stanotte. La misura
dei 60 allarmi **va rifatta da zero** con il riconoscitore giusto: se resta
alto si dichiara e si lascia misura, se scende a pochi diventa regola come per
le pagine. Attesa, dopo i tre casi guardati: **molto più bassa di 60**.

Poi:
- ⏱️ **Raccogliere `giro-7.txt`** quando finisce (in coda scrive `USCITA <n>`),
  nell'ordine che non si negozia:
  1. le righe **«non ho guardato»** — denominatori, superfici non raggiunte,
     «0 su N»;
  2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara da
     sé: «⚠️ CONTROPROVA: qui sotto il rosso è quello VOLUTO»);
  3. se esce con **2** si è dichiarato **non valido** da sé e va rifatto.
- ⏱️ `SOGLIA_TURNI` è importata da `apps/terra/index.html` e **non usata da
  nessuna parte** nella pagina (trovata cercando il soggetto della
  controprova). Non è un difetto — un import inutile non rompe niente — ma è
  una riga da togliere, e vale la pena chiedersi **quante altre** ce ne sono:
  è una domanda nuova, vicina di casa delle quattro.

## Blocchi
Nessuno.
