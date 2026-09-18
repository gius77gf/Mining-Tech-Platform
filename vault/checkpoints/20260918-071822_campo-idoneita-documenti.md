# Checkpoint — 2026-09-18T07:18:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
136adec5 — fix(campo): l'idoneità nei documenti dice anche scaduti/in scadenza

## Cosa è stato completato
Dal quinto giro di deep-pass su Campo (agente a3c51b3ffe5e1bfeb):
`rapportoGiornata` (rapporto stampato/firmato) e `testoConsegnaTurno`
(consegna archiviata) nominavano solo i lavoratori giudicati **non
idonei**, non chi ha un documento HSE **scaduto** o **in scadenza** —
mentre il Quadro a schermo (`idoneitaDiTurno`) distingue già tutti e
quattro i casi.

- Sostituito il ramo singolo (`avvisoIdoneita` ternario) con quattro
  clausole indipendenti costruite via `if`: non idoneo, con
  prescrizioni, scaduto, in scadenza — una riga per **problema**, non
  per persona (una persona può comparire in due clausole, es. sia
  prescrizioni sia documento in scadenza).
- **Secondo bug trovato SCRIVENDO il test**, non nel report
  dell'agente: entrambi i call-site di `idoneitaDiTurno` (in
  `rapportoGiornata` e in `testoConsegnaTurno`) chiamavano la funzione
  con soli 3 argomenti, quindi `oggi` usava il default `new Date()` —
  l'orologio REALE del sistema — invece della data del rapporto. Invisibile
  finché solo `nonIdonei` (indipendente dalla data) era consumato;
  diventato visibile aggiungendo `scadute`/`inScadenza` (dipendenti
  dalla data). Corretto passando `new Date(OGGI + "T12:00:00")` a
  entrambi i call-site.

## Verifica
Giro completo su worktree isolata (`/tmp/wt-campo`, HEAD 917c9b22 +
delta Campo, poi rifatto su d7468ddf dopo il commit di Flotta):

- **41 comandi a posto, 0 caduti**
- Asserzioni eseguite dal giro: **4127** (documenti corretti da 4126)
- KPI app: 3133 → **3134** (+1, il nuovo test)
- 9 suite che contano casi: **3.628** (3134+330+83+32+9+8+7+3+22)
- banchi: **343** (invariato, confermato — nessun nuovo banco browser
  per questa unità)
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Campo chiusa.

## Prossimo passo atomico
Isolare e committare l'unità **Genesi** (già pronta, verificata due
volte contro un worktree a d7468ddf — banchi da 343 a **345**, +2
esecuzioni per il nuovo banco `genesi-dir-costi-non-persistono-su-apri.mjs`;
file distinti da 151 a **152**):

File coinvolti (tutti già scritti sul disco, nessuna modifica di
codice residua da fare):
- `apps/genesi/genesi.html` — tre fix dal secondo giro di deep-pass:
  (1) `D2.dir`/`cPerf`/`cExpl`/`cInnesco`/`valMat` ora salvati nel
  `design` di `volSnapshot` e riletti su "Apri" (prima tornavano
  sempre ai default); (2) l'export `.volata.json` ora scrive
  `geometria.file` dinamico (`Math.max(1, D2.file||1)`) invece di
  `1` fisso, e ogni foro porta la propria `fila`.
- `apps/deepwork-id/tests/browser/genesi-dir-costi-non-persistono-su-apri.mjs`
  (NUOVO) — 6/6 verificato, controprova verificata.
- `apps/deepwork-id/tests/browser/genesi-tratti-non-persistono-su-apri.mjs`
  — ri-ancorato (l'ancora a due righe non combaciava più dopo l'inserimento
  del blocco dir/costi in mezzo).
- `apps/deepwork-id/tests/browser/genesi-documenti-che-escono.mjs` —
  esteso con un blocco "4ter" (multi-fila) e una tredicesima voce in
  `DIFETTI` dedicata; verificato: normale 101/101, controprova 30 KO
  su 16/16 iniezioni.
- `apps/deepwork-id/tests/browser/tutti.mjs` — 2 righe nuove
  (normale+controprova del banco dir-costi).

Passi:
1. `git worktree add -q --detach /tmp/wt-genesi HEAD` (HEAD ora è
   136adec5)
2. Copiare i 5 file Genesi-only nella worktree (già fatto una volta su
   d7468ddf, va rifatto sulla nuova HEAD — il contenuto dei file non
   cambia, solo la base)
3. Costruire il delta doc preciso: banchi 343→345, file distinti
   151→152 (in ROADMAP_SETTIMANA.md), KPI invariato (nessun test in
   run-kpi.mjs per questa unità), 9-suite sum invariata (3.628)
4. Lanciare `giro-node.mjs` in background sulla worktree, attendere
   con un ciclo di poll sul PID (mai `sleep` lungo alla cieca)
5. Correggere l'eventuale mismatch sulle asserzioni totali leggendo
   l'uscita VERA (mai indovinare — è già successo due volte in questa
   sessione: 4126 vs 4127 per Flotta, 4126 vs 4127 per Campo)
6. `numeri-nei-documenti.mjs` deve dare 0 falliti prima di committare
7. Copiare i file Genesi-only nel main tree via hash-object+update-index,
   `git commit -F`, push
8. Scrivere e pushare il checkpoint di chiusura Genesi
9. Poi: checkpoint di chiusura della seconda ondata (Flotta+Campo+Genesi),
   e proseguire subito con la regola "mai fermarsi" — leggere eventuali
   nuovi report di agenti in background (lo Scudo quarto giro era
   COMPLETAMENTE STALE: entrambi i difetti già chiusi nel commit
   1259e8f5, verificato riga per riga prima di scartarlo, nessuna
   azione presa), mantenere ≥3 cantieri paralleli con nuovi giri di
   deep-pass/ricerca continua sulle app non ancora coperte in questa
   ondata (Sentinella, Terra, Conti, Genesi di nuovo per un terzo giro),
   dando sempre priorità alla chiusura dell'arretrato confermato prima
   di aprire nuove ricerche.

## Blocchi
Nessuno.
