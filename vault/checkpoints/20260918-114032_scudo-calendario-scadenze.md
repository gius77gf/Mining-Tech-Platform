# Checkpoint — 2026-09-18T11:40:32Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
35c90a25 — fix(scudo): calendarioScadenze ricalcolava il titolo invece di riusare etichettaScadenza

## Cosa è stato completato
Dal quarto giro di deep-pass QA su Scudo (agente a76e56f7569610db8, report
recuperato dopo la compattazione via SubagentHandback): `calendarioScadenze`
(11/09) componeva il titolo dell'evento .ics a mano da `tipo || "Scadenza"`,
ignorando `descrizione` — la stessa copia debole già chiusa il 07/08 in
schermo/CSV/cartella con `etichettaScadenza`, ripresentata sulla superficie
nuova nata quattro settimane dopo. Corretto usando `etichettaScadenza(s)`.

## Verifica
- L'assertion esistente sul titolo di s1 è stata CORRETTA (blindava il
  difetto: pretendeva "Visita medica" invece di "Visita medica periodica").
- Nuovo caso: due scadenze stesso tipo/persona, descrizioni diverse →
  titoli distinti nel file .ics, con controprova inline.
- Giro completo su worktree isolata: 41/41, 0 caduti. KPI invariato a 3149
  (assertion aggiunte a un test esistente): nessuna propagazione di numeri
  nei documenti necessaria.

## Nota sul recupero del report
Il report dell'agente Scudo (avviato prima della compattazione di questa
sessione) non era più leggibile per intero dal transcript salvato — solo
`TaskOutput`/`ListAgents` confermavano "completed". Il contenuto del report
è arrivato via un SubagentHandback ricevuto DOPO la ripresa, insieme a
quello dell'agente Conti. Nessun dato è stato inventato: si è aspettato
l'arrivo reale del messaggio prima di agire.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro
1. **Conti** (dal deep-pass QA, agente a92657d52f86a1f91): quattro funzioni
   (`prioritaIncasso`, `agingIncassi`, `incassoPerMese`, `kpiFrom`) non
   escludevano una fattura stornata per intero da nota di credito (mai
   `incassata:true`) dal conteggio urgenza/rischio, a differenza di
   `fattureOltre90`/`esposizioneClienti`/`testoSollecito` che già lo fanno.
   **Fix già scritto e verificato in worktree** (`/tmp/wt-conti-apertodi`),
   giro completo in corso — prossimo passo: aspettare il giro, propagare i
   numeri nei documenti (KPI 3149→3150), committare e pushare.
2. **Accessibilità toast/modale** (dal deep-pass QA su shared/dw-app-ui.js):
   fix già scritti e verificati in worktree (`/tmp/wt-toast-a11y`):
   - Genesi: CSS `#toast.err/.success/.warn` aggiunto (mancava, mentre il JS
     chiama già `toast(m,"err")`).
   - `role="status" aria-live="polite"` aggiunto al toast di core
     (index.html), Genesi e deepwork-id/admin.html — le altre sei app lo
     avevano già. Nuovo test di regressione su tutte le nove superfici.
   - **Ancora da fare in questo stesso worktree**: la trappola del focus
     nella modale (nessun `Tab`/`inert` in `dwUiAggancia()`, tocca
     `shared/dw-app-ui.js` usato da tutte le 8 superfici — più rischioso,
     va isolato con cura e testato a fondo prima di committare insieme al
     resto).
3. **Conti — listener leak su `#modal-foot`** (index.html:6165, flusso
   "Scrivi il verbale"): ogni apertura aggiunge un `addEventListener` in
   più, mai rimosso. Non ancora affrontato.
4. **Nuovi difetti dai due agenti appena tornati** (Conti, Scudo) sono già
   inclusi sopra (Conti) o già chiusi in questo checkpoint (Scudo — non ce
   n'erano altri, un solo difetto verificato con certezza).
5. Due agenti di deep-pass QA lanciati in background su Sentinella
   (a666e8dd8ea8609ad) e Campo — angolo nuovo (afaef6de7ffb174b4), ancora
   in corso, per mantenere ≥3 cantieri paralleli.

## Prossimo passo atomico
Aspettare il giro completo su `/tmp/wt-conti-apertodi` (lanciato, in corso),
poi: propagare KPI 3149→3150 e 9-suite-sum 3.645→3.646 in
docs/DEVELOPMENT.md (unica occorrenza nota), commit con `git commit -F`,
push, checkpoint. Poi tornare su `/tmp/wt-toast-a11y`: decidere se la
trappola del focus va nella stessa unità o isolata, implementarla con
controprova, giro completo, commit, push, checkpoint. Poi la unit isolata
su Conti `#modal-foot`. Poi aspettare i due agenti Sentinella/Campo e
continuare "mai fermarsi".

## Blocchi
Nessuno.
