# Checkpoint — 2026-08-08T04:11:28Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2116de4` — *run-stile: i 34 punti di decisione dello strumento, e tre numeri
veri nei documenti*

## Che cosa è stato completato

Due cose legate: **la seconda l'ha trovata la prima**, facendo cadere il giro
`node` di casa prima del push.

### 1. La sonda sistematica sullo strumento (`run-stile` 297 → 299)

Il buco della freccia l'avevo trovato **per caso**, inseguendo un falso
allarme di un'altra suite. Un buco trovato per caso vuol dire che gli altri,
se ci sono, aspettano il **prossimo caso** — e nel frattempo ogni regola
costruita sopra risponde «nessuna violazione» senza aver guardato.

Adesso i punti in cui `mascheraCodice` deve **decidere** qualcosa sono
interrogati uno per uno, con la risposta giusta scritta accanto: **34 punti**
— regex contro divisione in sedici posizioni, quello che sta *dentro* una
regex, gli apostrofi italiani nelle stringhe, i template annidati, i commenti,
la sintassi moderna.

⚠️ **Esito onesto, che non va gonfiato: nessun buco nuovo. 34 su 34.** Il
valore di questa prova non è quello che ha trovato oggi — è che **da domani
nessuno dei 34 si può riaprire in silenzio**. E sa fallire: girata sul
tokenizzatore di prima della correzione dà **33 su 34**, e il punto che casca
è esattamente quello.

La differenza con la prova che c'era già: quella verifica la scansione sul
**codice vero**, che è la misura che conta; questa la interroga sui suoi
**punti di decisione**. Il codice vero contiene solo le forme che qualcuno ha
già scritto — un buco si vede il giorno in cui qualcuno ne scrive una nuova.

### 2. I numeri nei documenti, e due che nessuno guardava

Le due prove nuove hanno fatto invecchiare i documenti **nello stesso
istante** (2.307 → 2.309), e `numeri-nei-documenti` ha fatto cadere il giro.
Ha funzionato come deve. Aggiornandoli sono venute fuori due cose:

- ⛔ in `DEVELOPMENT.md` **gli addendi non tornavano**: «1890 + 297 + 63 + 32 +
  9 + 8» fa **2299**, non 2307 — il `63` era un `run-helpers` vecchio. Ora è
  1890 + 299 + 71 + 32 + 9 + 8 = **2309**, misurato lanciando le sei suite una
  per una, non ricopiato;
- ⛔ in `DECISIONI_WEEKEND.md` c'era «**19** banchi che aprono davvero le
  pagine»: sono **153**, cioè il numero era vecchio di **un ordine di
  grandezza**. Non se n'era accorto nessuno perché l'elenco `BROWSER` di
  `numeri-nei-documenti` ne guardava **due su tre** — e il documento fuori
  elenco è proprio quello che il fondatore apre per **decidere**.

> **Un numero è sorvegliato solo dove il controllo ARRIVA, e l'elenco di dove
> arriva va guardato quanto il numero.**

È la stessa cosa che la riga in fondo alla roadmap dichiara di sé («qui il
controllo non arriva, l'aggiornamento è a mano») — ma lì è scritto, qui no.
Adesso il terzo documento è dentro l'elenco.

## ⚠️ E il righello più debole era di nuovo il mio

Il conto dei banchi l'ho chiesto al file che lo sa (`numeri-nei-documenti`,
che legge `BANCHI` di `tutti.mjs`), non a un `grep` scritto sul momento:
contandoli con una regex mia ne trovavo **143**, dieci in meno, perché
riconosceva **una forma sola** delle voci. Se avessi scritto 143 nei
documenti, il controllo li avrebbe fatti cadere subito — ma se avessi scritto
143 in un *checkpoint*, ci sarebbe rimasto.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti** (il giro precedente, sullo stesso lavoro senza i documenti, ne dava
  **22 e 1 caduto**: è quello il segno che il controllo ha fatto il suo).
- `run-stile`: **297 → 299**. `numeri-nei-documenti`: **20 → 24**.
- Le sei suite ricontate una per una: 1890 · 299 · 71 · 32 · 9 · 8.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. A questo
checkpoint **894 righe**, dodici banchi chiusi.
⛔ Finché cammina non si toccano pagine né moduli dati: l'impronta esclude
`tests/`, `docs/` e `vault/`, **non** le pagine. È per questo che le ultime tre
unità sono state tutte su test e documenti.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`),
nell'ordine che non si negozia:
1. le righe **«non ho guardato»** — già viste passando: su Genesi **69 classi
   che dipingono un fondo non sono mai comparse** (22 misurate, 47 solo
   elencate), e cifre simili altrove. Regola del **denominatore**;
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara da
   sé);
3. se esce con **2** si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda a regola. L'elenco lo stampa la suite (`[misura] quinta forma`):
  non va ricopiato da nessuna parte, si rilancia e si legge. Un'unità per app,
  così ogni commit tocca un file solo.

## Blocchi
Nessuno.
