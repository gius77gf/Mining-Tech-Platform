# Roadmap Settimana — 2026-07-27 (lun) → 2026-08-01 (sab)
### v4.0 "RADDOPPIO" — elaborata col fondatore domenica 26/07

> Direttiva del fondatore (26/07): *«la scorsa settimana è stata piena e
> intensa, ma si può fare molto di più: abbiamo esaurito i crediti solo
> pochissime volte. Si può praticamente raddoppiare. Cosa serve per
> ottenerlo?»*

---

## PERCHÉ LA SCORSA SETTIMANA NON HA SATURATO — e come si raddoppia

Analisi onesta dei colli di bottiglia (non "lavorare più veloce": **lavorare
più a lungo e in parallelo**):

| # | Collo di bottiglia | Costo stimato | Rimedio in questa roadmap |
|---|---|---|---|
| 1 | **Pochi cicli**: ogni 5 h, solo lun–ven → ~25 avvii | il più grande | **Cadenza ogni 3 h, lun–sab → ~48 avvii** (quasi ×2 di partenza) |
| 2 | **Lavoro in serie** dentro il ciclo: un'unità alla volta | ~40 % del tempo | **2–3 cantieri in parallelo** per ciclo (Workflow/Agent): mentre uno implementa, un altro ricerca e un terzo testa |
| 3 | **Attese del fondatore**: molte ore in "gated" | ore intere | **Riserva di lavoro non-gated sempre pronta** (Fasi A/C/E): mai fermi ad aspettare |
| 4 | **Unità troppo piccole**: rifiniture che finiscono in 10 min | esaurisce la coda | **Task PESANTI pianificati** (editor 3D, ciclo chiuso): consumano davvero |
| 5 | **Riletture inutili** di file già noti | token sprecati | Checkpoint precisi + compattazione a confine d'unità |

**Obiettivo misurabile della settimana**: ~48 cicli, ogni ciclo esaurisce i
crediti, **≥ 40 unità completate** (contro le ~25 della scorsa), tutte con
commit + checkpoint + verifica visiva.

---

## FASE A — GENESI: IL SALTO DI QUALITÀ *(priorità assoluta, non-gated)*
Il fondatore: *«Genesi deve smettere di essere un prodotto mediocre»*. Sono
gli interventi pesanti, quelli visibili a colpo d'occhio.

- [x] **A1. Editor del fronte NEL 3D** ✅ *(26/07, `af9d6aa`)* — quote in
      tempo reale durante il trascinamento (metri + direzione a parole),
      annulla/ripristino a 40 passi con Ctrl+Z/Ctrl+Y, raggio d'influenza
      regolabile, **maniglie del piede** (avanzando il piede la faccia si
      alza), "fronte dritto". Verificato con trascinamento reale in Chromium.
- [ ] **A2. Colonne di carica segmentate a colori nel 3D** — aria / borraggio /
      esplosivo / innesco / acqua visibili sul foro nella scena (oggi solo
      nei raggi-X). È la firma visiva dei software professionali. *Taglia M.*
- [ ] **A3. Mappa delle quote sul terreno + legenda** — colorazione per quota
      con scala configurabile, sul fronte e sul piazzale. *Taglia M.*
- [ ] **A4. Editor visuale della sequenza di sparo** — clic sui fori per
      assegnare i ritardi, linee di innesco disegnate, tempi mostrati sul
      foro, contorni isocroni. *Taglia L.*
- [ ] **A5. Ottimizzatore di volata** — dato un obiettivo (x50, costo €/m³ o
      PPV massimo) propone maglia/carica/ritardi rispettando i vincoli, con
      spiegazione del compromesso. Estende il calcolo inverso esistente.
      *Taglia L.*
- [ ] **A6. Modulo `fronteProfilo` (passo 3 drone)** — PCA → sezione →
      inviluppo → **burden reale foro per foro**, come modulo puro con test
      su nuvole sintetiche; si aggancia al dato vero del fondatore appena
      arriva. *Taglia L.*
- [ ] **A7. Report di volata professionale** — impaginazione da documento
      tecnico (intestazione, sezioni, tabelle, grafici, firme), stampabile.
      *Taglia M.*
- [ ] **A8. Rifiniture scena** — ombre morbide, atmosfera, gizmo di
      orientamento, transizioni di camera, prestazioni (fps stabile).
      *Taglia M.*
- [ ] **A9. Login di Genesi** — alternative estetiche proposte al fondatore
      (bassa priorità sua, ma è lavoro non-gated). *Taglia S.*

## FASE B — IL CICLO CHIUSO DELL'ECOSISTEMA *(il valore d'insieme)*
Far girare **un caso reale attraverso tutte le app**: è ciò che si mostra a un
cliente per giustificare l'acquisto dell'intero ecosistema.

- [ ] **B1. Genesi → Campo**: dal piano di volata al piano di perforazione e
      carica, foro per foro, con avanzamento reale del turno.
- [ ] **B2. Campo → Terra**: produzione del turno → volumi estratti per fronte.
- [ ] **B3. Terra → Conti**: m³ → tonnellate → valore, verso fatturazione.
- [ ] **B4. Genesi → Sentinella**: volata sparata → registro volate con
      distanza scalata e confronto con le soglie.
- [ ] **B5. Cruscotto "giro completo"** nell'hub: una cava di esempio che
      attraversa le 6 app, con i numeri che si propagano.

## FASE C — VERTICALI: ESTETICA CORE AL 100% + IDENTITÀ *(non-gated)*

- [ ] **C1. Seconda passata estetica** su tutte e 6: topbar del core, tab
      interni, avatar, tile e schede — struttura, non solo ombre. Colori per
      app già assegnati. *Una app per unità, con screenshot.*
- [ ] **C2. Conti** — listino inerti + DDT/pesate → fattura differita.
- [ ] **C3. Sentinella** — serie storiche delle misure con grafico e soglie,
      allarmi per superamento ripetuto.
- [ ] **C4. Scudo** — azione correttiva (CAPA) agganciata a infortuni e
      near-miss, con responsabile e scadenza che entra nello scadenzario.
- [ ] **C5. Campo** — piano squadre settimanale e assegnazione attività.
- [ ] **C6. Terra** — piano annuale vs volume autorizzato con curve mensili.

## FASE D — GO-LIVE *(dipende dai 10 minuti del fondatore)*

- [ ] **D1.** Progetto Firebase creato dal fondatore → config nello SDK,
      deploy regole, `bootstrap-owner.mjs`, collaudo live delle 6 app.
- [ ] **D2.** Gestione errori delle scritture live (messaggio rosso nel form
      esistente: stile proposto, si applica salvo diverso parere).
- [ ] **D3.** Allegati Scudo su Firebase Storage quando il progetto è vivo.

## FASE E — QUALITÀ, SICUREZZA, PRESTAZIONI *(riserva sempre disponibile)*

- [ ] **E1.** Suite test 364 → **oltre 420** (nuovi helper puri, casi limite,
      regole emulatore per le nuove collezioni: cantieri, interventi).
- [ ] **E2.** Revisione di sicurezza del codice nuovo (allegati, storico
      locale, ponti tra app): XSS, injection, isolamento multi-tenant.
- [ ] **E3.** Prestazioni del 3D: LOD, riuso geometrie, fps stabile su
      telefono.
- [ ] **E4.** Revisione serale quotidiana (regola invariata).

## FASE F — RICERCA CONTINUA *(in background, mai bloccante)*
Una app a rotazione per ciclo: Genesi → Scudo → Campo → Flotta → Conti →
Sentinella → Terra → Deepwork ID → secondo passaggio. Ogni ricerca va
tradotta in unità concrete **in stile Deepwork**, senza gonfiare i risultati.

---

## MODO DI LAVORO (le regole che producono il raddoppio)

1. **Cadenza**: routine ogni **3 ore, lunedì → sabato**. Ogni ciclo lavora
   fino all'esaurimento dei crediti: è l'unico stop legittimo.
2. **Parallelismo**: in ogni ciclo tieni **2–3 cantieri aperti insieme**
   (implementazione + ricerca in background + test/revisione). Usa
   Workflow/Agent per i fan-out; non aspettare mai un solo processo.
3. **Mai fermi per un gate**: se un task richiede il fondatore, passa
   IMMEDIATAMENTE alla riserva non-gated (Fasi A, C, E).
4. **Unità pesanti**: preferisci un task di taglia L a tre rifiniture da 10
   minuti. Le rifiniture riempiono i vuoti, non guidano la settimana.
5. **Ogni unità**: commit + checkpoint nuovo (con "prossimo passo atomico"
   preciso) + push + screenshot per ogni modifica visiva.
6. **Compattazione** a confine d'unità pulito (~ogni 3–5 unità).

## VINCOLI INVARIATI
- ⛔ **Dati di riferimento del fondatore**: mai in interfaccia, export o
  documenti (regola ferrea, in `CLAUDE.md`).
- Niente push diretto su main: si passa da Pull Request.
- Nessuna spesa prima della commercializzazione.
- **Soglie di sicurezza** (curve USBM/DIN), **dati default sensibili** e
  **mitigazione password**: solo con conferma esplicita in conversazione.
- Estetica: si procede a blocchi, il giudizio finale resta del fondatore.

## IN ATTESA DEL FONDATORE (non bloccano il lavoro)
1. Revisione + **merge della PR #321** (120 commit, senza conflitti) → porta
   online tutto il lavoro delle ultime due settimane.
2. **Progetto Firebase** (10 minuti) → sblocca la Fase D.
3. **Prova del drone** col DJI Mini → sblocca A6 sul dato vero.
4. **Via libera alle curve di sicurezza** USBM + DIN (pronte, documentate).
5. Giudizio sul blocco estetico/funzionale del 25–26/07.

## RIFERIMENTI
- Ultimo checkpoint: `vault/checkpoints/20260726-190000_kickoff-settimana-4.md`
- Decisioni aperte: `docs/DECISIONI_WEEKEND.md` · Revisione fondatore:
  `docs/REVISIONE_FONDATORE_25-07.md`
- Storia delle settimane precedenti: cronologia git di questo file,
  `vault/checkpoints/` e il diario nel vault Obsidian
  (`60 - Diario sviluppo`).
