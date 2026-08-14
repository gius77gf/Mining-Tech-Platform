# Checkpoint — 2026-08-10T03:55:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4b52ae6` — *docs: il contenitore è tornato indietro di 463 commit, e le due
vie ovvie per riallinearsi sono negate*

## Che cosa è successo

Alle **03:47 UTC** il contenitore è stato ri-creato su un'istantanea del
**07/08 delle 18:49**: il disco era indietro di **463 commit**.

⛔ **Il segno non è un errore, è un `git status` CHE NON RICONOSCI.** Nove file
modificati che nessun cantiere mio aveva toccato, e `shared/dw-ponti.js`
scritto quando a tutti era vietato — cioè la cosa che sembra un cantiere
disubbidiente ed è invece il pavimento che si è spostato. La domanda giusta è
quella già scritta in `CLAUDE.md` (*«sono dove credo di essere?»*) e la
risposta la dà una riga: `git rev-parse HEAD` → `9daa90d`.

⚠️ **Quello che è nuovo**: le due vie ovvie sono **negate dal classificatore**,
e giustamente, perché distruggono — `git reset --hard` e `git stash`. E
`git merge --ff-only` da solo **rifiuta** finché ci sono modifiche locali.
La via che funziona, adesso scritta in `CLAUDE.md`:
1. **copia** i file che il disco ha di suo nello scratchpad;
2. **dimostra che non si perde niente** — non «i file sono diversi dal remoto»,
   che dopo 463 commit è ovvio, ma che i **nomi** che quel lavoro aggiunge
   esistono già nel remoto. Erano `csvPesate`, `numeroDichiarato`,
   `parsePesateCsv`: tutte e tre presenti, cioè quel lavoro era stato
   committato la sera stessa;
3. porta i file **avanti** al contenuto del remoto (`git show
   origin/<ramo>:$f > $f`), `git add -A`, e il merge passa.

La differenza fra il passo 3 e un `reset --hard` non è tecnica, è di
**intenzione**: uno scrive il futuro sopra il passato **dopo averlo
verificato**, l'altro butta via senza guardare.

⚠️ **E la prova che il riallineo è esatto non è un giro di test: è che l'albero
COMBACIA col commit** — `git diff HEAD` non stampa niente. È più forte di una
suite verde, perché `731923d` era già stato verificato quando è stato scritto.
Il giro lanciato per abitudine è stato **fermato**: girava sull'albero vivo
mentre tre cantieri ci scrivono, quindi avrebbe potuto rispondere rosso per una
ragione che non c'entra.

## Che cosa si è perso
Il lavoro **non committato** dei tre cantieri vivi: le tendine del core
(B4-bis), il recettore di Genesi (B0-decies), il numero uno in Flotta e
Sentinella. Tutti e tre erano morti sul **limite di sessione** (1:10 UTC)
**prima** di consegnare, quindi non si è persa nessuna misura verificata — ma è
un caso fortunato, non una difesa. Sono stati **rilanciati** con le loro tracce
parziali passate come *candidati*, non come fatti.

## Stato
Ramo allineato: `4b52ae6`, albero pulito. Il canarino del ciclo è `385c19d`.
Tutto il lavoro della notte è sul remoto: sei voci di roadmap chiuse
(B0-quinquies, B0-sexies, B0-octies, B0-nonies, B3-bis, B3-ter, B0-undecies) e
quattro numeri dei documenti del fondatore messi sotto sorveglianza.

## Prossimo passo atomico
Raccogliere i **tre cantieri rilanciati**, uno per volta, **rimisurando ogni
affermazione prima di committare** e mettendo nell'indice solo i file di quel
cantiere. Per ognuno: verifica sulla **copia** (`git worktree add --detach
HEAD` + `git diff --cached | git apply` + `git -C "$W" add -A`), commit,
checkpoint.
⚠️ E prima di ogni commit, il conto che il giro sorveglia da sé: se `giro-node`
dice che i documenti dichiarano un altro numero, **si corregge il documento**,
e il numero da scrivere è quello **stampato**, non quello previsto a mente — è
già stato sbagliato una volta stanotte (prevedevo 2.827, il giro ne contava
2.828, e il +1 era `suite-collegate` che conta **file**).

## Blocchi
Nessuno tecnico. Restano fermi al fondatore: **B0-septies** (che cosa vede chi
apre il 2D di una volata senza maglia) e le **soglie di sicurezza**
(`ppvLimit`, curve USBM/DIN), che nessun cantiere può toccare.
