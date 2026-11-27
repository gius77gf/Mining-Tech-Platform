# Checkpoint — 2026-09-18T08:34:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
989066d6 — fix(ponti): idoneitaDiTurno conta anche l'ottavo stato, senza data

## Cosa è stato completato
Dal deep-pass sui ponti condivisi (agente ae364dae722db1d02), un
difetto vero verificato con `node` diretto (funzione pura) e con
lettura del codice — la lacuna era nel ponte SHARED, non in un'app:

`idoneitaDiTurno` (`shared/dw-ponti.js`) sa che
`idoneitaOperatore`/`statoPeggioreScadenze` restituiscono OTTO stati,
incluso `"senza data"` (una scadenza HSE con la data illeggibile), ma
l'aggregato che espone non aveva nessun contatore per quello stato —
`tuttoInRegola` diventava correttamente `false`, ma ogni consumatore
che guarda i contatori nominati (`scadute`, `inScadenza`, `nonIdonei`,
`conPrescrizioni`) restava a zero e non vedeva mai il caso.

La lacuna si propagava in **cinque punti di Campo**:
1. `CLASSE_HSE` (index.html) — riga verde, indistinguibile da "regolare"
2. `notaScadenzeHSE` — didascalia vuota
3. il widget del Quadro (`dash-hse`) — nota nascosta
4. il riepilogo Personale (`ope-hse`) — **scriveva testualmente
   "Documenti in corso di validità per TUTTE le persone in elenco",
   un'affermazione falsa**
5. `rapportoGiornata`/`testoConsegnaTurno` (campo-data.js) — **corretti
   in un'unità precedente di questa stessa sessione (commit 136adec5,
   quinto giro di deep-pass su Campo) per aggiungere scadute/inScadenza,
   ma senza sapere di questo ottavo stato**: il documento stampato e
   firmato per l'ispettore restava scoperto su "senza data".

Controprova che era un difetto e non una scelta: Scudo ha la mappa
gemella già completa su tutti e 4 gli stati di
`statoPeggioreScadenze`, con un commento che racconta la stessa
correzione fatta il 03/08 — solo il lato Campo del ponte (via
`idoneitaDiTurno`) restava indietro.

Aggiunto `senzaData: conta("senza data")` al ponte, propagato ai
cinque punti di Campo con lo stesso vocabolario già usato da Scudo per
lo stesso stato.

## Verifica
- Nuovo test in `run-kpi.mjs`: scenario con una scadenza a data
  impossibile (`"2026-13-45"`), verifica che appaia sia in
  `rapportoGiornata` sia in `testoConsegnaTurno`, e che la consegna NON
  scriva più "nessuna persona … risulta non idonea" quando quella è
  l'unica cosa che non va.
- Test statico aggiuntivo sul sorgente di `index.html` (stesso pattern
  già in uso per i guard di pagina di Conti): verifica i quattro
  pattern esatti nei tre punti UI. KPI: 3137 → **3139** (+2).
- Ri-ancorato `campo-quadro-non-idoneo.mjs`, la cui ancora citava
  testualmente il gate che ho appena allargato. **Lezione di metodo**:
  il primo tentativo di ri-ancoraggio (solo la riga del gate) sembrava
  corretto ma la controprova passava lo stesso (6/6, doveva fallire) —
  scoperto che nella dimostrazione una condizione co-occorrente
  (`q.scadute` vero per un'altra persona) teneva il gate aperto
  comunque, e il corpo del blocco (non toccato dal revert minimale)
  continuava a mostrare il testo `nonIdonei`. Corretto allargando
  l'ancora al gate **più** il blocco `nonIdonei` insieme — le due parti
  che, rimosse insieme, riproducono davvero il difetto storico.
  Verificato: normale 5/5, controprova 4/6 (2 KO, quelli giusti).
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4133** (documenti corretti da 4131). 9-suite sum:
  **3.633**. Banchi invariati (345, nessun nuovo banco browser per
  questa unità). `numeri-nei-documenti.mjs`: 43 passati, 0 falliti,
  confermato PRIMA del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità ponti chiusa.

## Prossimo passo atomico
Chiudere l'unità **Genesi, terzo giro di deep-pass** (agente
a9e03772971dd3763) — **già implementata sul disco in una worktree
separata `/tmp/wt-genesi3` (HEAD 5bbea042), da ricostruire sulla nuova
HEAD 989066d6** (nessun file in comune con l'unità ponti, nessun
conflitto atteso — solo la base worktree va rifatta):

`D2.errColl`/`D2.dev` (errore al colletto, deviazione — stessa card di
B/S/diam) non persistevano su Salva/Apri, stessa identica famiglia di
dir/costi appena chiusa: erano gli UNICI due campi assenti su 34
censiti. Alimentano `simulaPerforazione()` → la riga "Precisione di
perforazione" della scheda validatori (rischio proiezioni). **Fix già
scritto e verificato**: aggiunti a `volSnapshot` e al fallback di
"Apri" (stesso pattern esatto di dir/costi, default 0,15 m / 2,5%).
Nuovo banco `genesi-errcoll-dev-non-persistono-su-apri.mjs` (6/6
normale, 2 KO su controprova isolata), 2 righe in `tutti.mjs`,
ri-ancorato `genesi-dir-costi-non-persistono-su-apri.mjs` (le due righe
del fallback errColl/dev si sono inserite fra `D2.valMat=…` e
`if(D2.holes.length)…`, spezzando l'ancora esistente — **prima
correzione tentata era sbagliata**: rimuovere anche `const
_dsg=arr[i].design||{};` rompeva le righe successive di errColl/dev che
lo leggono, causando un `ReferenceError` e "la volata non si è aperta
nel 2D" invece del KO atteso; corretto lasciando la dichiarazione
`_dsg` intatta e revertendo solo le cinque assegnazioni). Verificato:
`iniezioni-fresche.mjs` 622/622 dopo il fix.

Passi per chiudere:
1. `git worktree remove --force /tmp/wt-genesi3` (sulla HEAD vecchia),
   poi `git worktree add -q --detach /tmp/wt-genesi3 HEAD` sulla nuova
   989066d6
2. Ricopiare i 3 file Genesi-only (genesi.html, i due banchi,
   tutti.mjs) e ricostruire il delta doc (banchi 345→347 — verificato
   con `filtro-banchi.mjs`, 337 passate vere contro 335 — file distinti
   152→153, KPI/9-suite invariati, nessun test in run-kpi.mjs per
   questa unità)
3. Giro completo, wait-loop sul PID, correggere l'eventuale mismatch
   sulle asserzioni leggendo l'uscita VERA
4. `numeri-nei-documenti.mjs` verde, commit -F, push, checkpoint
5. Poi continuare "mai fermarsi": mantenere ≥3 cantieri paralleli
   (candidati: ricerca continua sul mestiere per un'app a rotazione,
   un secondo giro dedicato a shared/deepwork-id-client/dw-shell.js —
   non ancora letto per intero in questa sessione secondo l'ultimo
   agente sui ponti —, o nuovi giri di deep-pass sulle app con meno
   copertura in questa ondata), verificando sempre ogni difetto contro
   il codice attuale prima di agire.

## Blocchi
Nessuno.
