# Checkpoint — 2026-09-05T16:26:24Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c3488812 — Terra: il prospetto della denuncia annuale si compone nel modulo — tre
fogli su tre e due CSV su due

## Completato
`prospettoDenuncia(DEN, fronti, oggi)`: sette sezioni, tabelle
`{colonne, numeriche, righe, totale, nota}`, righe `[etichetta, testo,
mancante]`, `nonMisurati` stampato in «Che cosa manca in questo prospetto»,
grassetto delle note come `**così**` reso dalla pagina. La pagina tiene solo
HTML e CSS (scatto guardato: disegno identico). run-kpi +5 (2694), copertura
Terra 88/88 (fondo 88). Banchi: `terra-numeri-tranquilli` 1, 1b, 8b sul
modulo (73/73, 19/19); `terra-frasi-da-uno` applica per file, n. 8 sul
modulo (48/48, 20/20); `stampe-fs --solo=terra` 17/17; `nomi-liberi` con la
controprova che rimette il `const conta` locale insieme al difetto. Pin:
prove 3.175, asserzioni 3.607, copertura 883/883. Giro `node` sulla copia:
38 comandi a posto.

⚠️ Tre righelli corretti, nessun prodotto: (1) la prova pretendeva
`banchi === null` nell'anno cieco, ma i fronti dichiarano il banco anche
senza rilievi e le tre caselle dicono giustamente «non misurato»; (2) il
banco leggeva l'HTML grezzo e «l'ha» adesso arriva come «l&#39;ha», perché
il foglio passa da `esc` — decodifica le entità come il browser; (3)
`terra-frasi-da-uno` aveva il ciclo a due posti, come i quattro banchi di
ieri: adesso applica per file.

## Stato roadmap
Voce `[x]` «TERRA — il prospetto della denuncia annuale si compone nel
modulo» sotto quella del verbale; la riga «resta fogliaStampa» chiusa con
✅. Terra: tre fogli su tre e due CSV su due composti nel modulo.

## Prossimo passo atomico
Conti, i tre fogli che vanno al cliente e sono composti nella pagina:
`fogliFattura(f)` (`apps/conti/index.html`, cerca `function fogliFattura`),
`fogliDdt(p)` e `stampaPreventivo(id)`. Le funzioni che decidono i numeri
sono già nel modulo (`importiFattura`, `riepilogoIvaFattura`, `statoFattura`,
`totaliPreventivo`, `valoreDdt`), ma le righe, le frasi dello stato
(«Saldata · a credito N da rimborsare», «Da incassare N (dopo la nota di
credito)», «Annullata da nota di credito»), le celle «non dettagliata» /
«—» sull'aliquota, e gli avvisi («le righe qui sopra non tornano con il
totale») vivono nella pagina. Forma: `fogliaFattura(f, {clienti, incassi,
note})` nel modulo che restituisce `{testata, destinatario, colonne,
righe, piede, avvisi, riquadri, noteCredito, incassi, nonMisurati}` in
testo, la pagina rende. Cominciare dalla fattura (è quella con più regole);
prima censire le iniezioni dei banchi che ancorano sul suo testo:
`grep -n "fogliFattura\|non dettagliata\|Totale fattura\|tot-riga" apps/deepwork-id/tests/browser/*.mjs`
(almeno `conti-documenti-che-escono`, `stampe-fs`, `conti-frasi-da-uno`) e
riancorarle sul modulo leggendo «N rimessi davvero». Il messaggio di
commit lo scrive `git commit -F`.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
