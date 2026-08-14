# Checkpoint — 2026-08-08 17:35 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`237fd67` — misura: un giro lungo adesso dichiara quanto è vecchio

## Da dove è nata: un cantiere sfiorato, non evitato per bravura

Il giro del browser lanciato stamattina — cinque ore e mezza, ancora in corso —
dichiara **cinque contrasti sotto soglia** fra core e Flotta:

    .login-msg 4,10  ·  .sync-badge.offline 3,75  ·  .btn-danger 3,89
    .photo-del 4,01  ·  .chk-cr 3,90        (serve 4,5)

Tutti **veri**. E tutti **già chiusi** da `5d57cbc` — **trentotto minuti dopo**
il commit che quel giro attesta (`c3888fe`, 11:36 → fix 12:14), cioè quasi
cinque ore prima che io leggessi il registro. Stavo aprendo il file del core per
correggerli quando ho letto il commento che li spiegava, con i numeri già
misurati dentro.

⛔ **Il dato per accorgersene c'era già**, in cima al registro: *«Il giro sta
girando su una COPIA di `c3888fe`»*. Quello che mancava era **la sottrazione** —
e costa un `git rev-list`.

## Che cosa è stato fatto

`leggi-giro.mjs` apre adesso con una **sezione 0**, prima ancora delle righe
«non ho guardato»:

    ══ 0. QUANTO È VECCHIO QUESTO GIRO ══
      ⛔ attesta `c3888fe` · il branch è avanti di 55 commit, di cui 20
         toccano le superfici misurate (core, app, shared).
         Ogni KO qui sotto è vero A QUEL COMMIT, non adesso.

Due cose deliberate:
- **non basta contare i commit**: si contano quelli che hanno toccato le
  **superfici che il giro misura** (`index.html`, `apps`, `shared`), se no un
  pomeriggio di soli documenti fa sembrare vecchio un giro fresco;
- se il commit **non è nella storia** (registro di un'altra macchina, branch
  riscritto) si dichiara «**non lo so**» invece di stampare uno zero
  tranquillizzante. È il principio del fondatore applicato allo strumento:
  l'assenza di un dato non è un dato favorevole.

## Come è stato verificato

Controprova nei **tre** versi che contano — una guardia che dice sempre
«vecchio» è rumore, una che dice sempre «fresco» è la cosa che è appena costata
un cantiere sfiorato:
- vecchio: `HEAD~5` deve dare **5**;
- fresco: `HEAD` deve dare **0 e 0**;
- non lo so: un commit inventato e il caso «nessuna dichiarazione».

E provata **contro il difetto rimesso**: sostituito il ramo che rifiuta un
commit sconosciuto con uno che restituisce zero, la controprova cade con «*un
commit che non esiste dovrebbe dare «non lo so», non un numero*». File
ripristinato da una copia `cp` con `diff -q`.

⚠️ **E la controprova è stata COLLEGATA**, non solo scritta: aggiunta a
`npm test` (accanto a `browser/impronta.mjs --controprova`, che è il precedente
di una controprova nella cartella `browser/` che non vuole un browser). Una
guardia che non gira è una guardia che non c'è — questo file lo ripete da
settimane, e la prima stesura di stasera l'aveva lasciata scollegata.

Il conto dei comandi del giro `node` sale da 23 a **28**: la roadmap lo diceva
ancora 23, ed è stato corretto lì.

## Prossimo passo atomico

Il giro del browser è a **5h40** e sta ancora scrivendo (verificato con due
`stat` a venticinque secondi: 712.272 → 714.053 byte; ultima sezione aperta «i
numeri tranquilli di Genesi»). Quando finisce, leggerlo con

    node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>

e **la sezione 0 dirà da sola** che i suoi KO parlano di venti commit fa: vanno
riverificati sul codice di adesso, uno per uno, prima di toccare qualcosa. Le
righe «non ho guardato» già lette dicono che il banco del contrasto ha misurato
**182 classi su 239** e ne ha lasciate 57 col fondo non coprente, giudicate col
caso peggiore e con la forbice stampata accanto.

## Blocchi

Nessuno.
