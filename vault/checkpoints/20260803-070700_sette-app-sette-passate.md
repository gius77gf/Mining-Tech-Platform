# Checkpoint — 2026-08-03 07:07:00 UTC

## Tipo
unit-complete (sette unità: ricerca, Conti, Sentinella, canarino, fochino, Flotta, barra alta)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`66b570a` — *La sottoscritta della barra alta si tagliava in tutte e sei le
app, e perdeva sempre «Deepwork»*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 17 | **la ricerca riverificata** (`0b4d8a1`) | tre mancanze proposte, **due false**: l'esplosivo «senza posto dove scriverlo» ha un rapportino fochino suo, foro per foro |
| 18 | **Conti · i file che escono** (`e8933c0`) | sei zeri, e uno **rientrava dall'import**: la gara senza base tornava da 0 € e l'avviso spariva |
| 19 | **Sentinella · il file per l'ARPA** (`380fb76`) | schermo «Superamento», file «Conforme»: il documento **assolveva** un punto che l'app segna in rosso |
| 20 | **canarino** (`63a4797`) | il ciclo è vivo e lo dice al fondatore |
| 21 | **il fochino e i chili non scritti** (`34db532`) | «0.0 kg» su dodici fori caricati — il numero più sorvegliato dell'app |
| 22 | **Flotta** (`394ca35`) | badge **verde** con «NaN gg»; e il gasolio a **1,000 €/l invece di 1,500**, −33% nella direzione che rassicura |
| 23 | **la barra alta** (`66b570a`) | tagliata in **sei app su sei** a 320 px, e la parola persa era sempre «Deepwork» |

⛔ **Il filo delle ultime sette, ed è lo stesso di stanotte visto da un'altra
parte: la regola giusta c'era già, riscritta più debole dove il documento si
compone.** Conti aveva `statoScadenzaFattura` e ne teneva una terza copia nel
CSV; Sentinella aveva `conSoglia` e l'export non ci passava; Flotta aveva
`ritmoOreMezzi` che rifiutava il contatore sceso, e `consumoPerMezzo` no; il
core aveva `dataIt` e la barra alta aveva un `nowrap` che il core non ha. **Non
è distrazione: la copia debole funziona sui dati buoni**, e a guardarla non si
distingue dall'originale.

## Il metodo che rende, misurato su cinque app
Chiamare le funzioni coi casi limite **e poi aprire la pagina e premere i
bottoni**: Terra 5 difetti, Conti 6, Flotta 6, Sentinella 5, Campo 2 — **24
difetti veri** che il censimento statico non poteva vedere, perché vivevano
nelle frasi, nelle celle e nei file.

## Stato delle prove
run-kpi **1596**, stile 284, helpers 63, pointcloud 32, manifest 9, demo 8 →
**1.992** senza rete; **61** banchi del browser; copertura **636/636**;
64 file collegati; 15 pagine che compilano; giro `node` **20 su 20**.

## Che cosa sta girando adesso
- **il giro completo del browser** su una copia di `613c3b6`
  (`scratchpad/capo/giro2.txt`). Ha già trovato **un difetto vero**, l'unico KO
  non-controprova del banco delle modali: *«scudo @390 “Segnala un near-miss”:
  la tendina `#nm-chi` mostra “— chi segnala (facoltativo) —” tagliato — chiede
  209 px in 134»*. È il modulo che si compila **dal telefono in cava**, e la
  parte tagliata è proprio quella che dice che il campo è facoltativo. Passato
  al cantiere di Scudo, che ha quel file in mano.
- **tre cantieri paralleli**: **Campo**, **Genesi** e **Scudo**, tutti sulla
  seconda passata dei numeri tranquilli.

## Prossimo passo atomico
1. Raccogliere i tre cantieri quando rientrano, **app per app**: indice
   costruito da `HEAD` per `run-kpi.mjs` tagliando la banda dell'app
   (`// ═══ <APP> · … (03/08) ═══`), worktree **ricreata** e non resettata,
   numeri dei tre documenti riletti **dalla copia**.
2. Leggere l'esito finale del giro (`giro2.txt`, cerca `USCITA=`): se è `2` il
   giro si è dichiarato NON VALIDO e dice dopo quale banco.
3. Poi: i residui dichiarati di Campo (le tre code di `.meta` ancora tagliate in
   `page-rap`, `page-dash`, `page-att`) e il banco delle modali che su **core e
   vetrina non apre niente** — «nel suo programma ce ne sono 68 da aprire», cioè
   dichiara di non aver guardato due superfici su quattordici.

## Code aperte, dichiarate
- ⏳ **Il salvataggio del rapportino** scrive ancora `media_prof: 0` e `mc: 0`:
  decisione di prodotto proposta in `7050dea`, procede **venerdì 07/08**. I
  lettori sono già sistemati, ed è la metà comune a tutt'e due le risposte.
- ⏳ `riepilogoCosti` di Conti scarta righe senza contarle (costo/m³ **€ 1,20
  invece di € 2,44**), non raggiungibile perché non esiste un import dei costi.
- ⏳ `+null` vale 0 nei filtri delle letture di Sentinella (media **30 invece di
  60**), difesa in profondità da quattro scrittori che filtrano a monte.
- ⏳ In Flotta `riepilogoControllo.gravita` risponde «ok» su dodici voci su
  dodici non risposte: **dormiente**, il salvataggio è bloccato a monte.
- ⏳ La scorciatoia ES6 dentro un oggetto resta indistinguibile da una
  destrutturazione per la regola 20.

## Blocchi
Nessuno. Al fondatore restano **19** decisioni.
