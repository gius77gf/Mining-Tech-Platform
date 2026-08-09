# Checkpoint — 2026-08-09T23:20:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`1805f43` — *test: sette numeri invecchiati sotto un avvertimento che diceva
come sarebbe successo*

## Che cosa è stato fatto

Il censimento del cantiere di Genesi (`genesi-estraibili.mjs`) misura quante
funzioni si portano fuori da `genesi.html` **senza cambiargli la firma**. La sua
tabella vive in `docs/DEVELOPMENT.md` e, identica, dentro il commento dello
strumento che la produce.

| | 01/08 (scritto) | 09/08 (stampato) |
|---|---|---|
| nessuna variabile del modulo | 46 | **29** |
| una o due | 64 | **58** |
| da tre a cinque | 27 | **23** |
| da sei a dieci | 31 | **28** |
| più di dieci | 24 | **31** |
| estraibili / totale | 110 / 192 | **65 / 169** |

Sette numeri su sette diversi, e **non per una svista**: nel frattempo tre fette
di Genesi sono davvero uscite dalla pagina — il documento invecchiava *mentre il
lavoro andava bene*, che è il verso in cui qui capita sempre.

⛔ E sotto quella tabella c'era scritto, testualmente: *«i numeri qui sopra sono
quelli che il file STAMPA quando gira: se un giorno divergono, ha ragione
l'uscita e torto il commento»*. Divergevano da otto giorni. È la **terza volta
in due giorni** che questa casa paga la stessa cosa (la roadmap che dichiarava
«qui il controllo non arriva» e poi è invecchiata due volte; il fondo della
copertura che prometteva il caso che non vedeva):

> **Dichiarare un punto cieco non lo illumina.**

E il totale era scritto a mano **dentro il `console.log`**: la riga che esiste
per dire «guardate il numero giusto, non quello grosso» stampava, come numero
grosso, un `192` che non era più di nessuno. Un dato che il programma ha in mano
(`censite.length`) non si scrive a memoria accanto.

### Le quattro modifiche
- `genesi-estraibili.mjs`: totale **derivato**; la tabella congelata nel
  commento sostituita dal racconto di perché era falsa. Restano il metodo e le
  avvertenze sul righello, che non si muovono.
- `numeri-nei-documenti.mjs`: **+3 prove**. Lancia il censimento e pretende che
  la tabella di `DEVELOPMENT.md` sia la sua uscita **scaglione per scaglione** —
  il totale da solo non basta, il 01/08 la somma era giusta e gli addendi
  vecchi. Con la controprova su stringa.
- `docs/DEVELOPMENT.md`: tabella corretta + chi la sorveglia adesso.
- `docs/PIANO_GENESI_MODULO_DATI.md`: tolta la colonna dei valori «di oggi»,
  scritta **stamattina e già vecchia stasera** (diceva `run-kpi` 1979, ne esegue
  2033; 163 funzioni nella pagina, ne conta 169). Restano solo i **comandi**,
  che non invecchiano. Portava anche un `su b9d4724` che sembrava una verifica:
  quel commit **non ha mai toccato quel file** (`git log b9d4724 -- <file>`
  risponde `b964a73`), ed è l'hash incollato che `documenti-invecchiati.mjs`
  rifiuta nei documenti che sorveglia.

## Controprove
Tutt'e due col difetto **vero** rimesso, e ripristino **da copia** (`cp` +
`diff -q`, mai `git checkout`):
1. uno scaglione riportato al 01/08 (58 → 64) → *«"una o due" dice 64, lo
   strumento conta 58»*. **Zero caratteri di differenza**: la conta da sola non
   bastava, l'ancora era un `assert` sulla stringa.
2. la frase e il totale riportati al 01/08 (65/169 → 110/192) → cade su tutt'e
   due. ⚠️ Il **primo** tentativo d'iniezione è fallito in modo utile: «110 su
   192» adesso compare anche nel racconto, e l'`assert` sul numero di occorrenze
   l'ha fermato invece di lasciarlo passare a vuoto — è la famiglia del `sed`
   che non trova.

## Verifica
Sulla **copia di ciò che si committa** (worktree + `diff --cached | apply` +
`add -A`), non sul disco: `giro-node` **34 comandi a posto, 0 caduti**, **2810**
asserzioni (erano 2807: +3, le tre prove nuove).

## Stato roadmap
Invariato sulle voci aperte. In corso, tre cantieri paralleli:
- **B0-quinquies** — `#sm-cava` nel core (perché la scatola è 142 px);
- **B0-sexies** — i campi di Genesi che inventano il proprio minimo;
- **B3-bis** — `btn-piano-export` di Campo, il ponte che nessun banco preme.

## Prossimo passo atomico
Raccogliere i tre cantieri **uno per volta**, e per ognuno: **rimisurare le
affermazioni prima di committare** (niente entra sulla parola dell'agente),
mettere nell'indice **solo** i file di quel cantiere, verificare sulla copia
(`git worktree remove --force` + `add --detach HEAD` ogni volta — la worktree si
ricrea, non si resetta), committare e scrivere il checkpoint.
Il criterio dichiarato per **B0-quinquies**: `modali-dentro.mjs --solo=core`
verde **senza che i soggetti guardati calino** (aperture, elementi, voci,
comandi). Se quel cantiere riferisce che la larghezza è decisa in `shared/`, si
pesa il cambio contro le sei pagine che tocca **prima** di accettarlo.

## Blocchi
Nessuno. Il giro del browser **non** è stato rilanciato: tre cantieri tengono
Chromium, e un giro lanciato adesso misurerebbe un albero che cambia sotto.
