# Checkpoint — 2026-08-03 03:22:00 UTC

## Tipo
unit-complete (i quattro cantieri chiusi + tre unità mie)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`613c3b6` — *Campo: la pillola della squadra copriva il badge, e il banco
diceva «pulito»*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 12 | **il core e i rapportini mai misurati** (`f035a13`) | «Fori: 0 · Metri: 0,0 · Media 0,00 m · Mc: 0,0» sul PDF; e venti fori veri senza maglia → «0,0 mc» |
| 13 | **Scudo · il permesso di lavoro** (`22999aa`) | la checklist chiedeva una spunta su un documento che l'app non sapeva produrre; **27 funzioni**, copertura 130 → **157** |
| 14 | **la riga del documento aggiornata** (`1d53ce7`) | confermate di Scudo **7 → 6**; tabella del delta riscritta in tutti e sei i documenti |
| 15 | **il banco del browser sul core** (`62fc449`) | 18 prove, 4 difetti rimessi ne fanno cadere **8**; banchi 57 → **59** |
| 16 | **Campo · il testo fuori dal riquadro** (`613c3b6`) | 198 px in un blocco da 131 (**+9 anche a 390**), e il banco diceva «2 schermate pulite» prima e dopo |

⛔ **Il filo della notte, e vale più delle singole unità: la domanda sbagliata
risponde «pulito».** Tre volte in un giorno un controllo che esisteva non ha
visto un difetto vero, e mai per un errore di calcolo:
- la **regola 20** guardava sei app su sette, perché l'elenco era costruito per
  convenzione e Genesi ha la pagina fuori convenzione;
- `fuori-schermo.mjs` chiedeva «esce dallo SCHERMO?» mentre la pillola usciva
  dal **proprio riquadro** — e `overflow:hidden` faceva sparire anche il
  sintomo;
- `copertura-funzioni` misura le funzioni **coperte**, che aggiungendo codice
  non provato non scendono.
In tutt'e tre i casi la difesa nuova non è più severità: è **una seconda
domanda**, e il conto dei soggetti guardati stampato accanto.

## Come sono stati raccolti i cantieri
Sette commit, uno per app, ognuno verificato **sulla copia di quello che si
committa**. Due trappole nuove, pagate e scritte:
- ⚠️ **`git worktree add --detach HEAD` congela il commit di allora**, e
  `git reset --hard HEAD` *dentro* la worktree torna a quello, non al ramo. La
  copia misurava un albero vecchio di tre commit e dava «1 prova fallita» su un
  test verde. Si **ricrea** la worktree, non la si resetta.
- ⚠️ `run-kpi.mjs` ha ospitato i blocchi di **quattro** cantieri insieme:
  l'indice si costruisce da `HEAD` più i soli hunk dell'app che si committa,
  filtrati per riga di partenza. Mai `git add`.

## Stato delle prove
run-kpi **1573**, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**1.969** senza rete; **59** banchi del browser; copertura **633/633** (Scudo
130 → 157); 63 file collegati; 15 pagine che compilano; 914 nomi importati
verificati; giro `node` **20 su 20**. Arretrato documenti: **33 commit**.

## Che cosa sta girando adesso
- **giro completo del browser** su una copia di `613c3b6`
  (`scratchpad/capo/giro2.txt`, cerca `USCITA=`). Il precedente è stato
  **buttato**: girava su un commit di tre ore prima e si era piantato dentro
  `unita-maiuscole.mjs` con «Target page… has been closed».
- **tre cantieri paralleli** (direttiva 3, almeno tre per blocco): **Conti**,
  **Flotta** e **Sentinella**, tutti sulla seconda passata dei numeri
  tranquilli col metodo che su Terra ha trovato cinque difetti — chiamare le
  funzioni coi casi limite **e poi aprire la pagina**.
- **una ricerca** (direttiva 5), mirata dove chi lavora è carente: *che cosa
  contiene davvero un rapportino di perforazione di fine turno in una cava
  italiana, e che cosa ne chiede un ispettore* — con l'obbligo della prova per
  ogni «non c'è». Esito in `docs/RICERCA_CONTINUA_CORE.md`, da leggere **alla
  fine del blocco**.

## Prossimo passo atomico
1. Leggere l'esito del giro del browser (`scratchpad/capo/giro2.txt`, cerca
   `USCITA=`): se è `2` il giro si è dichiarato NON VALIDO e dice dopo quale
   banco l'impronta è cambiata.
2. Raccogliere i tre cantieri quando rientrano, **app per app**, con la stessa
   procedura (indice da `HEAD` per `run-kpi.mjs`, worktree **ricreata** e non
   resettata, numeri dei tre documenti riletti **dalla copia**).
3. Poi: il residuo dichiarato di Campo (le tre code di `.meta` ancora tagliate
   in `page-rap`, `page-dash`, `page-att`) e `.role-sm` di
   `shared/dw-app-ui.css`, che esce in tutte e sei le app e va deciso una
   volta sola.

## Code aperte, dichiarate
- ⏳ **Il salvataggio del rapportino** scrive ancora `media_prof: 0` e `mc: 0`:
  è la decisione di prodotto proposta in `7050dea`, la mia risposta è la
  seconda. Le decisioni procedono **venerdì 07/08** se non arriva risposta.
  I **lettori** sono già stati sistemati (`f035a13`), ed è la metà comune a
  tutt'e due le risposte possibili.
- ⏳ **La scorciatoia ES6 dentro un oggetto** resta indistinguibile da una
  destrutturazione per la regola 20; costo dichiarato e misurato.
- ⏳ Due residui di Terra e due di Scudo, non corretti perché **non
  raggiungibili dal form**, ognuno con la sua prova.
- ⏳ Il banco su `#pes-tot` aspetta ancora di saper aspettare `refresh()`.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
