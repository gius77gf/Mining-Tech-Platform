# Checkpoint — 2026-09-05T16:03:05Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
5044025b — Terra: il verbale di rilievo si compone nel modulo — e dice che cosa gli
manca

## Completato
`verbaleRilievo(r, {rilievi, fronti, autorizzazioni})` nella forma di
`relazioneLotto` (righe `[etichetta, testo, mancante, forte]`, atto,
partenza cumulo/confronto/nessuno, `comeNato`, `nonMisurati`); la pagina
disegna e stampa «Che cosa manca in questo verbale». run-kpi +8 (2689),
copertura Terra 87/87 (fondo 87). Iniezioni 6d di `terra-numeri-tranquilli`
e quella di `verbale-origine` riancorate sul modulo (19/19, «SA fallire»);
`stampe-fs --solo=terra` 17/17, `terra-frasi-da-uno` 48/48. Pin: prove
3.170, asserzioni 3.602, copertura 882/882. Giro `node` sulla copia: 38
comandi a posto. Scatto del verbale guardato. Canarino delle 15:45Z fatto
(e8a70742), quattro accensioni lette in coda.

⚠️ Due prove nate storte e corrette guardando il prodotto, non il contrario:
un GSD «2.5» NON tiene la classe alta (la soglia è 2 cm) — la prova voleva
«e il GSD collocano» su un rilievo che il modulo classifica indicativo; e
`["Volume totale concesso"` sta ANCHE nel prospetto della denuncia, quindi
l'ancora «la pagina non compone più» doveva essere una riga che ha solo il
verbale.

## Stato roadmap
Aggiunta la voce `[x]` «TERRA — il verbale di rilievo si compone nel
modulo» sotto quella del riepilogo. Resta detto lì che `fogliaStampa` è
la prossima.

## Prossimo passo atomico
Terra, `fogliaStampa` (`apps/terra/index.html`, cerca `function
fogliaStampa`): il prospetto della denuncia annuale, sette sezioni composte
in pagina da `DEN` — titolo, volumi dell'anno per mese, ripartizione per
fronte (`ripartizioneFronti(R, {tutte:true})`), per banco, posizione
rispetto al concesso, base dell'onere, «come sono stati ottenuti i numeri».
Forma: `prospettoDenuncia(DEN, fronti, oggi)` nel modulo che restituisce le
sezioni come righe di testo (`[etichetta, testo, mancante]` e tabelle
`{intestazione, righe, totale}`), con le frasi (`conta`, `qual`, la nota
del pregresso) già nel modulo; la pagina tiene SOLO l'HTML e il CSS. Prima
di scrivere: censire le iniezioni che ancorano su quel testo
(`grep -n "fogliaStampa\|Cumulato a fine\|non misurato\|quindi volumi" apps/deepwork-id/tests/browser/*.mjs`
— almeno `terra-numeri-tranquilli` 1, 1b, 8b e la prova statica delle sette
celle in run-kpi) e riancorarle sul modulo leggendo «N rimessi davvero».
Nota: `csvRiepilogoAnno` (già nel modulo) e questo prospetto leggono le
stesse bandiere: la funzione nuova può riusare le sue righe.
Alla prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
