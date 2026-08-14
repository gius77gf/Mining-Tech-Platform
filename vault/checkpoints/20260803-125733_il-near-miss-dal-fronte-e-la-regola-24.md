# Checkpoint — 2026-08-03 12:57:33 UTC

## Tipo
unit-complete (canarino + tre unità: regola 24, Terra, Campo+Scudo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`88bc73f` — *Campo: il near-miss si segnala dal fronte, dove sta la persona — e
Scudo, i CSV che escono*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 42 | **Terra · i documenti che escono** (`f274e91`) | una **stima** di un rilievo mai fatto usciva dal file come volume misurato |
| 43 | **canarino** (`e738edb`) | il ciclo è vivo e lo dice al fondatore |
| 44 | **regola 24** (`fc10c5b`) | il banco vede solo gli stati che la dimostrazione mette in scena; questa legge il CSS |
| 45 | **Campo · il near-miss dal fronte** + **Scudo · i CSV** (`88bc73f`) | la mancanza che la riverifica di stamattina aveva indicato come la più importante |

## ⛔ Il limite della piattaforma ha interrotto due cantieri, e uno era a metà
Alle 11:40 UTC il limite di sessione ha ucciso il cantiere di **Scudo** («now
add the case and its injection to the bench») e quello del **core**, che non
aveva ancora scritto niente. Prima di committare Scudo ho verificato che ciò che
ha lasciato **regga da solo**, invece di fidarmi: il suo banco fa **37 ok / 0
KO**, e in controprova rimette **12 difetti su 12** facendone cadere 18. Quello
che gli restava era additivo.
✅ È la terza volta in due giorni che un evento della piattaforma costa lavoro, e
la difesa resta quella scritta: **committare ogni unità appena è verificata**.

## Il filo delle ultime unità
1. **Dove il documento si compone.** Terra: il CSV dei rilievi scriveva `12/03 ·
    m³` dove lo schermo dice «volume non leggibile», stampava le date **senza
   l'anno** (2024, 2025 e 2026 indistinguibili) e faceva uscire come misurato il
   volume **stimato** di un rilievo pianificato. Il CSV della denuncia aveva due
   convenzioni opposte nello stesso file e perdeva un secchio intero: colonna
   **79.400** sotto un totale **86.400**.
2. **Un compositore solo, in `shared/`.** Il near-miss di Campo scrive il record
   di **Scudo**: comporlo in due pagine sarebbe stata la copia debole appena
   nata. Cinque funzioni traslocate in `shared/dw-ponti.js`, Scudo le ri-esporta
   col nome di sempre, e una **prova d'identità su 5 casi** dimostra che il
   record che Scudo scrive è byte-identico a prima.
3. **Un KO va verificato come un OK.** La regola 24 nasce da un difetto vero
   (2,17:1 sulla cifra del cartellone «grave» di Conti) ma il sospetto che
   fosse lo stesso in **quattro altre app** era **falso**: lì `--grad3` riempie
   barre e avatar, non ritaglia lettere. La seconda domanda che l'ha stabilito
   è nel censimento.

## Stato delle prove
Prove **2.053** senza rete (run-kpi 1654, stile **287**), banchi **77**,
copertura **645/645**. ⚠️ La copertura **scende** da 646 e non è una regressione:
cinque funzioni sono uscite da Scudo per entrare in `shared/`, e l'alias non si
conta due volte. Le funzioni scoperte restano **zero**, che è la regola vera.
Giro `node` **20 su 20** sulla copia di ciò che si committa, a ogni commit.

## Che cosa sta girando adesso
- **il giro completo del browser** (`scratchpad/capo/giro5.txt`), su una copia
  di `f274e91`. È il primo dopo le **tre correzioni al banco del contrasto**:
  va guardato se altre superfici, che adesso perdono i loro «saltati», mostrano
  KO nuovi — il banco misura ~10 testi in più per superficie;
- **tre cantieri**: **core** (i documenti che escono, ripreso da zero),
  **Genesi** (il foglio che si porta in cava), **Flotta+Sentinella** (i fogli
  STAMPATI, che sono l'altra metà rispetto ai CSV già fatti). Il terzo ha il
  mandato di tenere **due bande separate** in `run-kpi.mjs` così le due app si
  possono committare separate.

## ⚠️ Due ricerche rientrate, NON verificate — non entrano sulla loro parola
- `docs/RICERCA_CONTINUA_SCUDO.md`: tre proposte sul registro dei mancati
  infortuni (ora di segnalazione distinta dalla data evento, urgenza/gravità
  potenziale, scadenza della comunicazione INAIL).
- `docs/RICERCA_CONTINUA_NORME.md`: censimento di 9 norme, **2 dichiarate
  IMPRECISE** — il DUVRI di Scudo (che secondo la ricerca in cava è sostituito
  dal DSS ex D.Lgs 624/96) e il tasso di mora di Conti (che il D.Lgs 231/2002
  lega a BCE + 8 punti, quindi variabile).
  ⛔ **Sul DUVRI non tocco niente da solo**: è una citazione normativa in un
  software venduto, e cambiarla sulla parola di un agente è il modo peggiore di
  sbagliare. Va verificata contro la fonte, e se regge è una decisione da
  portare al fondatore col suo RSPP.

## Prossimo passo atomico
1. Leggere `giro5.txt` (cerca `USCITA=`) quando finisce; se è `2` il giro si è
   dichiarato NON VALIDO e dice dopo quale banco.
2. Raccogliere i tre cantieri, **app per app**, con la solita procedura: indice
   costruito da `HEAD` tagliando la banda dell'app, worktree **ricreata** (mai
   resettata), numeri di `docs/` riletti **dalla copia**.
3. **Verificare la riga della mora di Conti** contro il D.Lgs 231/2002: è la
   più facile delle due imprecisioni e non richiede il fondatore, perché non si
   tratta di cambiare un obbligo ma di dire che il tasso **varia**.
4. Poi: le tre proposte della ricerca su Scudo, rimisurate una per una.

## Code aperte, dichiarate
Immutate, più le quattro **decisioni di prodotto** aperte dal near-miss (registro
unico in Scudo; chi lavora al fronte scrive nel registro di sicurezza; nessuna
coda offline; il turno chiuso non blocca la segnalazione). Le **19 decisioni**
procedono **venerdì 07/08** se non arriva risposta, e vanno dichiarate nel commit.

## Blocchi
Nessuno.
