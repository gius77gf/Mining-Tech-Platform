# Checkpoint — 2026-08-09T07:49:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`7f0a207` (questa unità committata subito dopo)

## Task completato

**Il raggruppamento delle migliaia, chiuso dalla parte giusta: non i venti
punti di chiamata, la FUNZIONE.** `conta` di `shared/` accordava la parola e
scriveva il numero con `String(n)` — `conta(41230,"punto","punti")` dava
«41230 punti», e in Genesi finiva sulla stessa riga di un «3.000.000»
formattato bene.

| | prima | dopo |
|---|---|---|
| `conta(41230, …)` | `41230 punti` | **`41.230 punti`** |
| `conta(6375, …)` | `6375 punti` (Node) / `6.375` (Chromium) | **`6.375` in tutt'e due** |
| `conta(2.5, …)` | `2.5 punti` (punto inglese) | **`2,5 punti`** |
| punti di Genesi che ricopiavano `gnum + plurale` | 2 scritti ieri | **0** |
| `run-kpi` | 1922 | **1923** |

## Le tre cose imparate

1. ⛔ **IL PASSO CHE MI ERO SCRITTO ERA LA STRADA SBAGLIATA, E A DIRLO ERA UNA
   REGOLA GIÀ SCRITTA IN `CLAUDE.md`.** Il checkpoint di stanotte diceva:
   *«i nove punti miei + i due da import, con la forma già provata»*. Contando
   prima di toccare, i `_ricPlur` erano **una ventina**, non nove — e ognuno
   sarebbe stato un posto da cui la divergenza può ricominciare. La regola è
   *«una copia nasce quasi sempre da una firma troppo stretta»*, e la cura è
   **aggiungere alla funzione**, non ricopiare il corpo. Il difetto era **uno
   solo**, e stava nella firma: `conta` faceva **metà** del mestiere.
2. ⛔ **E LE DUE COPIE SCRITTE IERI SONO STATE TOLTE, non lasciate «tanto
   funzionano».** `nPunti` in `_puntiNuvola` e il `gnum + plurale` del piano
   XML erano nati **il giorno prima** proprio perché la funzione condivisa non
   finiva il lavoro. Adesso che lo finisce, tornano `_ricPlur`. Una copia che
   sopravvive alla ragione per cui è nata è la divergenza di domani — e il
   tempo di toglierla è **adesso**, finché qualcuno si ricorda perché c'era.
3. ⛔ **IL COSTO SI MISURA, NON SI TEME — e stavolta il soggetto era `shared/`,
   cioè tutte le app in una volta.** 139 punti di chiamata in sei app più il
   core, 23 riferimenti nelle suite: **giro `node` 34/0 senza toccare nessuna
   prova esistente.** Nessuna prova asseriva un `conta` a quattro cifre, che è
   anche il motivo per cui il difetto è vissuto tanto — la dimostrazione conta
   cose piccole.
   ⚠️ Il che vuol dire che il verde **non era una prova**: la prova l'ho
   aggiunta, e contiene apposta il caso a **quattro cifre** (`conta(6375, …)`),
   l'unico in cui Node e Chromium si scostano al valore di default di
   `useGrouping`. Senza quel caso la suite avrebbe blindato in Node una verità
   che l'utente non vede mai.
   ⚠️ **Due decimali e non zero**: con `0` un `conta(2.5, …)` sarebbe stato
   arrotondato a «3» in silenzio, e un arrotondamento che nessuno ha chiesto è
   la cosa che qui non si fa.

## Verifiche
- `run-kpi` **1923 passati, 0 falliti** (era 1922: la prova nuova gira)
- `giro-node` **34 comandi a posto, 0 caduti**, sulla copia del committato
- `genesi-frasi-limite` **31/0** sano · controprova **11/11 iniezioni, 16 prove
  cadute** (le due ancore mosse per la terza volta in due giorni, ri-ancorate
  con la ragione)
- `iniezioni-fresche` **296/296**
- i tre documenti che dichiarano il conto delle prove aggiornati **addendi
  compresi** (1922 → 1923, 2.370 → 2.371, 2.667 → 2.668 derivato): il controllo
  guarda il totale e non la somma scritta accanto

## Stato dei 20 KO del giro
**11 chiusi · 9 aperti**, di cui **7 aspettano il fondatore**. I 2 restanti non
sono difetti: sono le due righe di Genesi che questa unità ha appena chiuso
alla radice.

## Prossimo passo atomico
**Un giro del browser nuovo**, che è la sola cosa che dice se le undici
chiusure di oggi reggono sul committato — e serve perché il giro precedente
attesta `7cddb59`, cioè un branch andato avanti di oltre cinquanta commit.
Si lancia dopo il commit, su una copia:
`node apps/deepwork-id/tests/browser/tutti.mjs > <scratchpad>/registro5.txt`
⛔ Prima: guardare **chi tiene le porte** (non solo se sono occupate) e che non
resti vivo un giro precedente — un server orfano risponde 404 su tutto e
produce KO del tipo «la barra di navigazione non ha voci».
⚠️ E mentre gira **non si iniettano difetti nei moduli dati né nelle pagine**:
si lavora su `docs/`, `vault/` e le suite `node`. Il giro serve una `git
worktree` immobile, quindi il lavoro ordinario è sicuro.
Alla fine si legge con `leggi-giro.mjs`, **nell'ordine**: età → righe «non ho
guardato» → KO veri.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
