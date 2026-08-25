# Checkpoint — 2026-08-25T20:37:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6 (ripartito da main dopo il merge #341)

## Ultimo commit
308ce7a7

## Completato
**La vetrina è ONLINE.** PR #341 unita a `main` (merge `308ce7a7`), CI verde
su tutti e due i controlli veri. Il sito la serve a
`https://deepworksic.netlify.app/apps/`.

**Verifica in produzione, non in casa**: `tour-aperto --base` sul sito vero →
**9 destinazioni su 9 rispondono**, `/apps/genesi/genesi` riscritto compreso.

**Quarta domanda aggiunta al righello: i collegamenti si possono PREMERE?**
Un collegamento può essere nella pagina, puntare a un file che esiste, aprire
un'app perfetta, e non essere raggiungibile col dito. Misurato: **30 su 30
premibili a 1440px e a 390px, 0 bersagli stretti**. Controprova con un velo
invisibile sopra la pagina: 30 su 30 diventano non premibili, il righello
nomina il colpevole ed esce 1.

## La produzione era ferma da undici giorni
Misurato **prima** del merge: il sito serviva il core a 534.403 byte mentre su
`main` ne faceva 699.104, e `/apps/` rispondeva 404 benché `apps/index.html`
fosse su `main` dal 14/08 (PR #322). Cioè la pubblicazione automatica non
girava da undici giorni. **Il merge l'ha fatta ripartire**: subito dopo,
`/apps/` → 200 e il core → 699.104. Non era un guasto da riparare, era un
deploy che non era mai stato innescato — ma andava misurato invece che dedotto,
perché «il sito sembra un'altra cosa» aveva esattamente questa causa.

## Il righello ha sbagliato quattro volte prima di reggere
Tutte e quattro sono trappole **già scritte in CLAUDE.md**, e le ho rifatte:
1. `elementFromPoint` vive nel viewport → 26 accuse su 30, «coperti da niente»
   (cioè `null`). Un difetto quasi universale senza colpevole nominato è il
   segno che si sta guardando il righello;
2. `scrollIntoViewIfNeeded` aspetta l'**azionabilità**, e i nomi della corona
   ruotano: non la raggiungono mai, quindi bruciava il tempo pieno su ognuno e
   la misura non finiva;
3. la pagina ha `scroll-behavior:smooth`: due rAF dopo un `scrollTo` sta
   ancora scorrendo → 28 accuse su 30 di stare «fuori dalla finestra» mentre
   erano in viaggio;
4. caricavo `/index.html` dalla radice del repository, che è il **core**, non
   la vetrina. A prendermi è stata la **guardia sullo zero**: «nessun
   collegamento trovato» invece di un verde su zero soggetti.

## Stato roadmap
Vetrina consegnata, unita e online. Giro node 37/37, 3.280 asserzioni.

## Prossimo passo atomico
Portare a `main` questa quarta domanda (PR piccola, solo strumenti + vault).
Poi: il giro del browser non è mai stato lanciato contro `apps/index.html` —
i suoi banchi navigano e premono, e la vetrina non ha sezioni `.page`, quindi
o si dichiarano le sue superfici o restano fuori **dichiarate**, non in
silenzio.

## Blocchi
Nessuno.
