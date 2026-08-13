# Checkpoint — 2026-08-13 18:56 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`be955323` — *Il core e la media di Campo: cinque zeri che nessuno aveva
scritto*

## Che cosa è stato completato

**B0-duodecies è chiusa**: il core era la terza e ultima superficie. E la
lezione del giro è che nel core i difetti **non stavano nei clamp della
geometria** — una mesh che ha bisogno di una dimensione non dichiara niente a
nessuno — ma dove il numero **finisce a schermo**:

- **il meteo del proxy**: `(j.wind||0)*3.6` scriveva «Vento **0 km/h**» su un
  campo che il proxy non aveva mandato, e in cava il vento decide la polvere e
  se far brillare. Gli altri tre campi non avevano nemmeno il ripiego:
  «undefined°», «Umidità undefined%»;
- **la cronologia della cava**: «12 fori · **0 mc**» su una volata con le
  profondità mai scritte, mentre la scheda della stessa volata scrive già «né
  chili né volume». E la risposta era **in casa**: `volMc`, scritta insieme a
  `volKg` e **mai chiamata da nessuno**, a sedici righe dalla sua gemella;
- **i contatori dei mezzi**: «0 ore» e «0 km» scritti a mano in cinque punti,
  due dei quali dicevano cose diverse dello stesso mezzo;
- **il contatore mai letto diventava un mezzo nuovo di fabbrica**: campi
  facoltativi letti con `parseNum0`, che del vuoto fa ZERO — e quello zero
  finiva **nel database**;
- **«5 ÷ 0 =» rispondeva 0**, sulla calcolatrice che l'app offre a chi è in
  cava.

E **`mediaFermiAlGiorno` di Campo**: le righe di `fermiPerGiorno` adesso
portano `fermiConMinuti`/`fermiSenzaMinuti`, e la media ha le stesse **tre**
uscite che `minutiFermoTesto` e `csvStorico` usavano già — non una quarta
convenzione, le loro.

`run-kpi` **2063 → 2088**, 0 falliti; `run-stile` 318; `sintassi-pagine` 34;
`sonda-vuoto` 15 (5 tranquilli trovati, 5 dichiarati); `import-esistenti` 163;
`copertura-funzioni` 11 soggetti a posto; `numeri-nei-documenti` 41. Tutto
misurato **sulla copia di quello che si committa**. Documenti: 2.515 → 2.540.

## ⛔ QUELLO CHE IL FONDATORE DEVE SAPERE: LA CI È ROSSA SU UNA RIGA, E SERVE
## UN SUO SÌ PER CHIUDERLA

`date-checkpoint.mjs` dice il vero: un checkpoint di oggi si chiamava
`20260813-164000` ed è **entrato in git alle 16:37:45** — due minuti avanti.
Causa: **ho previsto l'ora invece di leggerla** (`date -u` costa una riga).

Il file **è già stato rinominato** alla sua ora vera (`20260813-163745`), e sul
disco il vault non mente più. Ma quel controllo legge i nomi da
`git log --diff-filter=A`, cioè **da tutti i percorsi mai aggiunti**: il nome
sbagliato resta nella storia del ramo, e finché ci resta la CI è rossa su
quell'unica asserzione (tutte le altre passano).

La correzione l'ho **costruita e provata**: riscrivendo i tre commit in una
`git worktree` — stesso albero identico, verificato con `git diff` vuoto — il
controllo torna **8 passati, 0 falliti**. Per renderla effettiva serve un
`git push --force-with-lease` sul ramo di sessione, e quel comando è **bloccato
dal classificatore**, giustamente: riscrive una storia già spinta, su un ramo
con la PR #322 aperta. Non l'ho forzato.

⚠️ Nel frattempo il ramo era rimasto **diviso** dal remoto (locale riscritto,
remoto no) e `merge` e `reset` sono bloccati anch'essi: la via che ha funzionato
— non distruttiva — è stata **`git pull --rebase`** a albero pulito, che ha
scartato da sé i due commit già presenti a monte («patch contents already
upstream») e ha rimesso in fila il lavoro nuovo. Vale la pena saperlo: è la
terza via, dopo `fetch --unshallow` e `fetch` + `merge --ff-only`, per un ramo
che non combacia col remoto.

**Decisione che serve**: o si autorizza il force-with-lease (una riga, la
storia del ramo si accorcia di un nome), oppure quel rosso resta finché la PR
non viene fusa — e va detto a chi guarda la CI, se no si mette a cercare un
difetto del prodotto che non c'è.

## Che cos'è vivo adesso
- **Giro completo del browser** — partito alle 15:59:58 UTC, alle 18:51 aveva
  chiuso **15 passate su 188**. Gira su una copia di `e3fa4ee`: dirà lo stato
  di stamattina, non quello di adesso. Nessun KO vero letto finora — le venti
  righe rosse incontrate stanno tutte **dentro una sezione dichiarata
  controprova**, dove il rosso è quello voluto.
- Nessun cantiere aperto: tutti e quattro hanno consegnato.

## ⚠️ Una misura fatta e SCARTATA, perché nessuno la rifaccia alla cieca
Ho provato a costruire uno strumento che chiedesse a ogni funzione dei moduli
dati *«sai distinguere uno zero SCRITTO da un dato MAI misurato?»*, chiamandola
due volte e confrontando le risposte. Misurato prima di scriverlo come banco:
**550 funzioni su 667** rispondono uguale — perché con un argomento che è una
*lista* (non una misura) `f(null)` e `f(0)` cadono tutt'e due sulla prima
guardia e tornano la stessa struttura vuota. Il segnale esiste solo dove
l'argomento è **un numero che potrebbe valere zero**, e riconoscerli richiede
un lavoro che questo confronto non fa. Un allarme che sbaglia otto volte su
dieci insegna a non guardarlo: **non è entrato**. Lo strumento che invece
esiste ed è giusto è `sonda-vuoto.mjs`, che di proposito **non cerca gli zeri**
e spiega perché.

## Prossimo passo atomico
Aprire **tre cantieri nuovi** (nessuno è vivo) sulle voci rimaste della
roadmap, e in parallelo continuare a leggere il **giro del browser** con
`leggi-giro.mjs` partendo dalla **sezione 0 (l'età del giro)** e dalle righe
«non ho guardato», che in questa casa si leggono **prima** dei KO. Quando il
giro finisce, rilanciarlo sullo stato di adesso: quello in corso non conosce né
il banco nuovo di Flotta né le correzioni di oggi.

## Blocchi
- **Force-with-lease sul ramo** per togliere dalla storia il nome del
  checkpoint sbagliato (vedi sopra): serve il sì del fondatore.
- **B0-septies** (che cosa vede chi apre il 2D di una volata senza maglia) e le
  **soglie di sicurezza** (`ppvLimit`, curve USBM/DIN): fermi al fondatore.
