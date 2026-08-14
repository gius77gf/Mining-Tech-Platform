# Checkpoint — 2026-08-02 09:53:23 UTC

## Tipo
unit-complete (due unità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`89c7f93` — *La nuvola di punti: quaranta punti su centoventimila valevano il
30% del volume*

## Che cosa è stato completato

### 1. Decisione 2 chiusa e verificata (`45617e9`)
Il fondatore ha pubblicato le regole chiuse del Firebase pubblico. La chiusura
è **verificata dall'esterno**: una lettura anonima dell'API REST risponde
`403 PERMISSION_DENIED`. Prima tornava con i documenti dentro.

### 2. Il messaggio del ripiego (`acb00ff`)
Chiuse le regole, il ramo di ripiego del core prende **tutti** i visitatori, e
diceva «⚠ Modalità degradata — connessione database non disponibile»: falso
(la connessione c'era) e muto sulla cosa che riguarda chi legge — che quello
che scrive **non viene salvato**.
`motivoDatiNonSalvati` in `shared/` (6 prove in `run-helpers`), badge «NON
SALVA» acceso per tutta la sessione, banco `ripiego-messaggio.mjs` (36
asserzioni, controprova che ne fa cadere 10).
⛔ Trovato dallo scatto e non dal codice: il toast era `nowrap` +
`text-overflow:ellipsis`, e a 320px **dieci messaggi del core** venivano
tagliati (il più lungo 109 caratteri). Ora zero su 125 messaggi provati.

### 3. La nuvola di punti (`89c7f93`)
Due file LAS pubblici veri scaricati e letti (110.000 punti in 34 ms) +
`nuvola-di-prova.mjs`, un fronte di cava di cui il volume vero si **integra**
(14.880 m³). Ha trovato che 40 punti volanti su 120.000 gonfiavano il volume
del **29,9%** con la cella a 2 m. Corretto con la «cima sostenuta»: dopo,
+4,92%; sul file LiDAR vero cambia lo 0,00%.

## Stato delle prove
**1.872** senza rete (run-kpi 1478, run-stile 282, run-helpers 63,
run-pointcloud **32**, run-manifest 9, run-demo 8), **53** banchi del browser,
copertura 593/593, nessuna funzione scoperta.

## Prossimo passo atomico
Raccogliere i **due cantieri in corso** — Scudo (decisioni 13, 14, 17: mansione
senza requisiti, DPI senza data di sostituzione, infortunio a prognosi aperta)
e Sentinella (decisione 16: punto di monitoraggio senza soglia) — verificare
**sulla copia di quello che si committa** (`git worktree` + `git diff --cached
| git apply` + **`git -C "$W" add -A`**) e committare. Al momento del
checkpoint Scudo aveva già scritto 7 funzioni nuove ancora senza prove
(`giornateAssenza`, `prognosiAperta`, `descriviGiornatePerse`,
`esitoAbilitazione`, `requisitiIgnoti`, `MOTIVO_SENZA_SOSTITUZIONE`,
`avvisoGravitaMinima`): il commit va fatto **dopo** che il cantiere le ha
provate, se no `copertura-funzioni` cade.
Poi: aggiornare i numeri nei tre documenti (le prove saliranno ancora) e
spuntare 13/14/16/17 in `docs/DECISIONI_WEEKEND.md` — la porta d'ingresso
scenderà da 23 a 19 decisioni aperte.

## Blocchi
Nessuno. Restano al fondatore solo le decisioni che dipendono da lui
(1 Firebase nuovo, 4 password, 7 volo del drone, 9 curve di vibrazione) e le
quindici scelte di prodotto che procedono venerdì se non arriva risposta.

## Note
⚠️ Il contenitore si è riavviato una volta durante il blocco e ha ucciso
quattro agenti in corso: il lavoro su disco è sopravvissuto, gli agenti no.
I due cantieri sono stati rilanciati.
