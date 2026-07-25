# Roadmap Settimana — 2026-07-20 → 2026-07-24 (v3.1 — piano esteso)

Elaborata domenica sera 19/07 col fondatore. Versione ESTESA su sua
istruzione: piano volutamente sovradimensionato per sfruttare al
massimo ogni ciclo — ciò che non si chiude entro venerdì passa alla
settimana successiva tramite i checkpoint, senza perdere nulla.
Ordine di esecuzione: PRIMA la Fase A (Genesi, priorità del fondatore),
poi Fase B (trasversali), poi Fase C (completamento app verticali),
poi Fase D (Deepwork ID avanzato), poi Fase E (core). La ricerca resta
SECONDARIA (regola in fondo).

═══════════════════════════════════════════════
## FASE A — Genesi (priorità assoluta del fondatore)
[sequenziale interna, in apps/genesi — NON toccare il motore fisico]

A1. Ricognizione codice 3D esistente (Three.js, scena, materiali) e
    piano tecnico dettagliato — taglia S — stato: fatto (19/07: incluso
    fix critico moduli vendor mancanti — app era bloccata su splash)
A2-A6. Overhaul estetico — GIÀ REALIZZATO nel codice (verificato
    19/07 sera, vedi apps/genesi/PIANO_3D.md): texture PBR
    procedurali, sistema LOOKS luce/cielo, particellari calibrati,
    muckpile heightfield, HUD vetro. La voce del vault è superata:
    restano solo rifiniture mirate se emergono debolezze nei
    confronti visivi. — stato: fatto (pre-esistente)
A7. Gittata flyrock — stato: fatto (19/07: layer 3D con disco gittata
    + anelli sgombero 2x/4x, calcolo condiviso flyrockEst con la
    scheda; il calcolo esisteva già nei validatori) 
A8. Fori bagnati — stato: fatto (19/07: colonna d'acqua in raggi-X;
    fisica già completa e verificata live: x50 52→112cm con ANFO
    in 5m d'acqua)
A9. Rock-factor Lilly — stato: fatto (pre-esistente, verificato 19/07:
    rockFactorA con A=0,06·(RMD+JF+RDI+HF) da UCS/E/fratturazione,
    badge in scheda validatori)
A10. Presplit e confronto A/B — stato: fatto (20/07: presplit
    completo + confronto A/B con KPI affiancati e migliore in verde)
    ★ FASE A COMPLETA ★
Ogni unità: screenshot di verifica prima/dopo, commit, checkpoint.

═══════════════════════════════════════════════
## FASE B — Trasversali (parallelo-gruppo-A, sbloccano qualità per tutto)

B1. CI GitHub Actions — stato: fatto (20/07: 2 job — rules 19 test su
    emulatore + syntax check moduli e script inline; da verificare il
    primo run sulla prossima PR)
B2. README reale del monorepo — stato: fatto (20/07)
B3. Hub ecosistema /apps/ — stato: fatto (20/07, con screenshot)
B4. Navigazione trasversale — stato: fatto (20/07: .dw-home nella shell,
    7 pagine) ★ FASE B COMPLETA ★

═══════════════════════════════════════════════
## FASE C — Completamento app verticali (parallelo-gruppo-B tra app diverse)
Per OGNI app, nell'ordine: modello dati Firestore secondo lo schema
orgCollection; caricamento dati via SDK con fallback demo (tour);
form di inserimento/modifica funzionanti; KPI calcolati dai dati veri;
test con emulatore dove sensato.

C1. Scudo — stato: fatto (20/07: data layer, KPI calcolati, CRUD,
    import CSV con dedup — tutto testato nel browser)
C2. Campo — stato: fatto prima iterazione (20/07: data layer, KPI,
    stati al tocco, rapportini bozza→inviato; foto rimandate a quando
    ci sarà lo storage reale)
C3. Flotta — stato: fatto prima iterazione (20/07: data layer, KPI
    calcolati, registro ore, scadenzario con urgenze dalle date)
C4. Conti — stato: fatto prima iterazione (20/07: KPI finanziari
    calcolati, incasso al tocco, nuova fattura, report)
C5. Sentinella — stato: fatto prima iterazione (20/07: stati da
    soglie, urgenze da date, registrazione misure)
C6. Terra — stato: fatto prima iterazione (20/07: data layer, KPI
    calcolati dai rilievi — volumi mese, avanzamento = estratto/
    pianificato —, fronte sospendi/riattiva, form nuovo rilievo)

═══════════════════════════════════════════════
## FASE D — Deepwork ID avanzato (dopo B, in parallelo a C)

D1. Pagina "non autorizzato" — stato: fatto (20/07: pagina dedicata
    non-autorizzato.html con spiegazione invito 14gg, ricontrollo
    inviti, crea organizzazione, tour/uscita; redirect da login e
    profilo)
D2. Logout coerente + griglia da entitlement — stato: fatto (20/07:
    dw-shell.js mountExit su 6 app solo in live, logout nell'api dei
    data layer, SDK listEntitlements + griglia profilo reale)
D3. Verifica email + recupero password — stato: fatto (20/07: SDK
    sendEmailVerification post-registrazione, resend, reset password
    dal login; collaudo online dopo il setup Firebase del weekend)
D4. Pannello amministrazione org — stato: fatto (20/07: admin.html,
    callable updateMemberRole/removeMember/revokeInvite con guardrail
    ultimo-owner, rules membri solo-lettura dal client, test 19→26)
D5. Test SDK con emulatori — stato: fatto (20/07: run-sdk.mjs, 12
    test di flusso sul VERO SDK; suite totale 38, tutti verdi)
    ★ FASE D COMPLETA ★

═══════════════════════════════════════════════
## FASE E — Deepwork core

E1. Censimento feature — stato: fatto (20/07: CENSIMENTO_FEATURE.md;
    sorpresa: 3D/simulatore/ricostruzione/MWD sono COMPLETI; gap veri:
    meteo/push spenti da config, splat fuorviante, fori 3D non salvati,
    dati default sensibili → decisione fondatore)
E2. Fix rapidi — stato: fatto prima passata (20/07: meteo nascosto
    senza proxy, splat rinominato onesto, stub morto rimosso; restano
    i rimandati elencati nel censimento)

═══════════════════════════════════════════════
## Attività SECONDARIA — ricerca competitor per Genesi
[decisione fondatore 19/07: NON prima del primo ciclo automatico, e
sempre DOPO un'unità primaria chiusa in modo stabile] — stato: COMPLETA
(20/07: 5 schede su ecosistema-vault — Maxam, Orica, Maptek, Paradigm
ri-verificato, sintesi con tabella e raccomandazioni per Genesi)
Interrotta il 19/07 per esaurimento crediti (10 fatti non verificati su
Paradigm nel checkpoint 2026-07-19_2000, da ri-verificare). Procedere a
schede piccole: Maxam RioBlast/RIOSUITE → Orica ShotPlus → Maptek
BlastLogic → altri → sintesi con tabella e raccomandazioni. Salvare in
ecosistema-vault/50 - Wiki ricerca/ (pull prima di scrivere).

## OLTRE LA ROADMAP — lavoro extra completato (20-21/07, PR #44-#79)
Dopo il completamento delle fasi A-E, i cicli hanno proseguito per la
regola di esaurimento. Sintesi per la revisione del weekend:
- Iterazioni 2 e 3 su TUTTE le app: filtri a chip, ricerca live,
  conferme sulle azioni delicate, validazioni con feedback, stati
  vuoti, CRUD completo (creare/lavorare/esportare ogni entità).
- Ponte Genesi↔Campo: piano di carico CSV → registro carica reale
  foro per foro con scostamenti → consuntivo esportabile.
- Genesi: flyrock inverso, curva KCO/Swebrec, regola di caricamento
  dalla brillabilità, terreno virtuale sotto gli anelli flyrock.
- Core: export CSV fori ricostruzione + "Invia alla volata" (prima
  fila dai marker), meteo nascosto senza proxy, visualizzatore 3D
  rinominato onesto.
- Test 19 → 49 (26 regole + 13 SDK + 10 functions), TUTTI verdi anche
  in CI; trovato e corretto un bug che avrebbe fatto crashare le
  Cloud Functions in produzione (FieldValue undefined).
- Manutenzioni a ore motore, storico misure sensori, rinnovo
  scadenze, data di incasso + report mensile, esiti gare, dismissione
  mezzi, multi-org reale nel profilo con test switchOrg.
- Ricerca competitor COMPLETA (7 schede su ecosistema-vault, incl.
  Italia e prezzi); vault Obsidian "Prossimi passi" allineato.
- Sicurezza CSV: neutralizzata la CSV-injection negli export delle 4
  app multi-tenant (csvCell in dw-shell.js) — un nome/ruolo/cliente che
  inizia con `= + - @` non esegue più formule in Excel/Calc. Core e
  Genesi esportano solo numeri/etichette fisse: nessun rischio, non
  toccati.
Dettaglio per unità: vault/checkpoints/ dal 2026-07-20_1500 in poi.

## In attesa del fondatore (weekend 25-26/07, promemoria armato sabato 09:00)
1. Creazione progetto Firebase (GRATUITA, ~10 min, guida:
   apps/deepwork-id/GUIDA_FIREBASE.md) → poi config reale nello SDK,
   deploy rules, collaudo online.
   NOVITÀ 21/07 (onestà tecnica): le Cloud Functions (crea org/inviti/
   ruoli) richiedono il piano BLAZE, non il gratuito Spark. Auth+
   Firestore sono gratis e bastano per le 6 app. Preparato
   scripts/bootstrap-owner.mjs (Admin SDK locale, gratis) per creare
   l'org del fondatore e i claims owner senza Functions → le 6 app
   partono live subito. Il self-service org/inviti resta in anteprima
   finché il fondatore non decide sul Blaze (utilizzo 0€, serve carta).
   DECISIONE FONDATORE al weekend.
2. Regole Firestore del progetto ESISTENTE (AUDIT punto 3).
3. Dati default del core: reali o di fantasia? (AUDIT punto 2)
4. Eventuale ok alla mitigazione ponte password (PREPARATA, NON ATTIVATA).
5. Gestione errori scritture live (AUDIT punto 12): decidere COME
   mostrare un errore all'utente (toast/messaggio) — è una scelta di
   stile, quindi serve l'ok del fondatore prima di aggiungerla alle app.

## Roadmap di Visione — backlog dalla ricerca per app (nuova, 21/07)
Su richiesta del fondatore (21/07: "puntiamo alla qualità massima,
aumentare la mole di lavoro; ricerche specifiche su ogni singola app e
sul potenziale che ognuna può raggiungere") è stata svolta la ricerca di
prodotto su tutte e 7 le app. Risultati: 7 schede "Potenziale — <App>"
in ecosistema-vault/50 - Wiki ricerca/ + sintesi in
**vault/ROADMAP_VISIONE.md**. Da lì nasce un backlog ampio di lavoro
"subito" (browser, dati a mano, nessun hardware). Stato delle prime voci:
1. ✅ Sentinella — libreria soglie normative preimpostate (PR #186).
2. ✅ Conti — aging incassi (PR #187).
3. ✅ Scudo — giudizio di idoneità sanitaria art. 41 (PR #188).
4. ✅ Terra — conversione m³ → tonnellate → valore (PR #189).
5. ✅ Campo — causali di fermo standardizzate (PR #190).
6. ✅ Flotta — scadenzario predittivo leggero a ore (PR #191).
7. ⏸ Genesi — secondo modello frammentazione (KCO/Swebrec): RIMANDATO —
   tocca il motore fisico, da fare con cautela/conferma del fondatore.
8. ✅ Conti — riepilogo gare d'appalto ed esito (PR #192).
9. ✅ Sentinella — distanza scalata delle volate SD=R/√W (PR #193).
   (Il registro volate completo, nuova collezione, resta come voce M.)
10. ✅ Terra — qualità del dato sui rilievi: metodo + GSD (PR #194).
Suite test 167 → 190. Restano le EPICHE M/L (scadenzari completi con
alert multi-soglia, KPI OEE/disponibilità, work order + ricambi,
rapportino di turno + handover, report margine, SdI/pesa/telematics/
centraline) e l'epica strategica del **ciclo chiuso** (ponti
Genesi↔Campo↔Terra↔Conti). Ogni voce va spezzata in unità atomiche con
screenshot di verifica per le modifiche visive.

## SESSIONE 21/07 (continuazione) — parità dati + robustezza + go-live
Cicli automatici proseguiti a oltranza (regola del fondatore). Sintesi:
- **Import CSV su TUTTE e 6 le app verticali** (parità completa; prima erano
  a metà): Terra rilievi (#213), Scudo scadenzario (#218), Sentinella sensori
  (#221), a completare Flotta/Conti/Campo già fatti. Export CSV ora su tutte
  (aggiunto Flotta, #215).
- **Robustezza test**: eliminati DUE test flaky della suite Functions (race
  sulla propagazione asincrona dei custom claims → helper waitClaim, #216 e
  #219) + edge case CSV (CRLF da Excel, valori non validi). Suite 220 → 228,
  tutti verdi e deterministici.
- **Documenti per il fondatore (non tecnico)**: `docs/STATO_PRODOTTO.md` (cosa
  fa oggi ogni app, #214), `vault/PIANO_GO_LIVE.md` (percorso ordinato al primo
  cliente, collo di bottiglia = progetto Firebase, #217),
  `docs/ONBOARDING_DATI.md` (i CSV da preparare per caricare una cava, #220).
Dettaglio per unità: vault/checkpoints/ dal 2026-07-21_0639 in poi.

## SESSIONE 21/07 (2ª parte) — revisioni "in cerca di bug" + rifiniture
Su richiesta di massima qualità, quattro **revisioni adversarial** su superfici
diverse; hanno trovato e fatto correggere **11 bug reali** invisibili ai test:
- **Import CSV** (#225): `split(";")` ingenuo perdeva righe con `;` nei campi
  (anche i CSV esportati dall'app) + numeri all'italiana (`18.300,50`) non
  letti → ora `parseCsvLine` + helper `numIt`.
- **Calcoli KPI** (#227): off-by-one in TUTTI i conteggi di giorni dal vivo
  (una scadenza di oggi risultava "scaduta"; fattura di oggi fuori da
  incassoAtteso) + Terra mese in UTC → helper `giorniTra` (mezzanotte locale).
- **SDK** (#229): isolamento CONFERMATO solido; corretti 5 bug su entitlement/
  stato (abbonamento che "restava" cambiando account, tour con org vecchie,
  validUntil non-Timestamp, ecc.).
- **Cloud Functions** (#231, SICUREZZA): 2 bug ALTI in acceptInvites — invite
  hijacking via email non verificata; `.set()` che declassava un owner
  esistente lasciando l'org senza owner. Corretti + guardie di test.
Più rifiniture di prodotto: Scudo **adempimenti HSE preimpostati** (#228, da
`vault/RICERCA_HSE_SCADENZE_CAVA.md` #226), Conti **previsione incassi per
mese** (#230), Terra **andamento volumi** (#232). Doc fondatore: `INDICE_
FONDATORE` (#224), `ISOLAMENTO_DATI` (#223) con nota di revisione (#233).
Suite CI 228 → 247, tutta verde. Isolamento multi-tenant verificato solido.

## SESSIONE 21/07 (3ª parte) — "documenti pronti" + insight di dashboard
Cicli proseguiti a oltranza (regola del fondatore). Ogni app verticale ha
ricevuto un incremento; ognuno via PR, suite verde ad ogni merge (259 → 273).
- **Conti** (crediti): interessi di mora 231/2002 (#245), **sollecito pronto**
  da copiare/inviare con mora e totale dovuto (#247), **estratto conto cliente**
  (tutte le fatture aperte di un cliente in un unico documento) (#249).
- **Scudo**: **promemoria di scadenza** pronto da inviare al lavoratore (#248).
- **Flotta**: **priorità operative del giorno** — helper puro che unisce
  manutenzioni urgenti (a data e a ore) + ricambi sotto scorta + mezzi fermi;
  prima i ricambi sotto scorta NON comparivano in dashboard (#251).
- **Terra**: **proiezione di fine anno** vs volume autorizzato, con avviso di
  rischio sforamento dell'autorizzato (#252).
- **Campo**: **copertura rapportini di turno** (chi non ha ancora consegnato
  prima dell'handover) (#253).
- **Sentinella**: **priorità di conformità** — estratta la logica inline della
  dashboard in helper testato; **fix severità**: un adempimento SCADUTO ora è
  danger, non più warn (#255).
- Revisione adversarial delle UI (6 app): trovati e corretti 2 bug reali (i
  bottoni "copia" scrivevano la conferma su un elemento di una pagina nascosta)
  (#250). Doc fondatore `STATO_PRODOTTO` aggiornato due volte (#246, #254).
Pattern ricorrente utile: estrarre logica di dashboard "inline" in helper PURI
e testati, scoprendo bug di severità/copertura (ricambi mancanti, scaduto=warn).
Suite CI 247 → 273. Avviata una revisione del data-layer (isolamento
multi-tenant + parser CSV); esiti nei checkpoint successivi.

## SESSIONE 21/07 (4ª parte) — audit di sicurezza di TUTTE le superfici
Quattro revisioni adversarial mirate, ciascuna verificata a mano prima di
correggere. Sintesi per la revisione del fondatore (rilevante per la
commercializzazione: la promessa n.1 è l'isolamento tra aziende clienti):
1. **UI delle 6 app**: pulite su XSS/CSV; 2 bug reali di feedback su pagina
   nascosta corretti (#250).
2. **Data-layer (i 6 *-data.js + SDK)**: **isolamento VERIFICATO SOLIDO** — ogni
   accesso passa da `orgCollection`, nessun percorso a mano, nessuna query
   cross-org. 2 note minori chiuse (fronteId demo #257, guardia demo #260).
3. **Codice condiviso (dw-shell + SDK)**: isolamento riconfermato; 4 bug nei
   parser CSV/numeri corretti (numIt perdeva numeri con migliaia multiple #262;
   parseCsvLine e il delimitatore #263; csvCell e le formule dopo spazi #262) +
   1 nota SDK (#264). +13 test condivisi.
4. **Core (index.html, ~8300 righe)**: `escHtml` era usato in modo INCOERENTE →
   **XSS memorizzato multi-tenant** reale (un collega che salva `<img onerror=>`
   eseguiva codice nel browser dei colleghi, e in casi condivisi/audit anche in
   quello del destinatario/admin). Corretti in 3 PR (#266, #267, #268) tutti i
   campi salvati resi grezzi: nome volata (condivisa in chat), audit log,
   dettagli fochino, riparazioni, deposito, contatti + href tel/mailto sicuri,
   nomi cava, note/descrizioni gare. Trovati con grep 4 siti extra oltre la
   review. Verifica: syntax dei blocchi script + Playwright (carica il login).
5. **Genesi + hub /apps/**: audit XSS via grep → **puliti**: il core Genesi
   rende solo numeri/etichette/cataloghi controllati dallo sviluppatore (nessun
   testo libero multi-tenant in innerHTML); il hub è statico. Nessun fix.
Nota tecnica onesta: il ROOT `index.html` NON è coperto dal syntax-check della
CI (che copre solo apps/*/*.html) né dai test → verifica manuale.
Suite CI 273 → 294. Isolamento multi-tenant confermato solido su ogni superficie.

## SESSIONE 21/07 (5ª parte) — completamento app (nuovi registri + parità import)
Dopo l'audit, cicli proseguiti a oltranza con completamenti di prodotto (Fase C):
- **Scudo — registro infortuni e near-miss** (#270) con il numero grande dei
  **giorni senza infortuni** (i near-miss non azzerano il conto) + import/export
  CSV (#271).
- **Sentinella — registro volate** (brogliaccio di brillamento, #273): log di
  ogni volata con la distanza scalata per evento e le contestazioni; import/
  export CSV.
- **Flotta — import del parco mezzi** da CSV (#276): si carica la flotta intera
  all'avvio invece di aggiungere i mezzi a mano (parità con gli altri import).
- Doc fondatore aggiornati: `STATO_PRODOTTO` (registri, #272/#274) e
  `ONBOARDING_DATI` (colonne dei nuovi import, #275).
- Smoke test di regressione (Playwright, 6 app × tutte le pagine): 6/6 pulite
  dopo tutti i PR della sessione.
Nota: i registri usano la regola Firestore generica (orgCollection) → nessun
gate; sono LOG di eventi, non soglie di legge. Suite CI 294 → 301.

## SESSIONE 21/07 (6ª parte) — parità import/export completa + robustezza + revisione
Cicli a oltranza su rifiniture trasversali di alta qualità (Fase B/C), tutte
con PR CI-verde e checkpoint:
- **Parità import COMPLETA** (#281): Conti importa anche le gare d'appalto →
  ogni app verticale carica da CSV tutte le sue entità base.
- **Filtro gare per stato** in Conti (#282): tutte/aperte/vinte/perse.
- **Header CSV indipendente dal delimitatore** (#283): nuovo helper condiviso
  `isIntestazione` (riconosce l'intestazione per ; virgola o TAB); prima un file
  a virgole con header iniettava una riga-fantasma. +7 test.
- **Idempotenza degli import "ad append"** (#284, #285): dedup su registro
  infortuni, volate, rilievi e scadenze → un doppio click su "Importa" non
  raddoppia più un archivio (importante per i registri HSE/regolatori).
- **Coerenza documentazione** (#286): `ONBOARDING_DATI` allineato ai parser
  (colonna `fronte` nei rilievi).
- **Test confini aging incassi** (#287): off-by-one su 30/31/60/61/90/91 gg.
- **Parità import-EXPORT** (#288 gare, #289 squadre): ogni entità importabile è
  ora anche esportabile in formato ri-caricabile (backup/condivisione).
- Revisione di sicurezza del codice recente: escape XSS universale nelle liste,
  import robusti (BOM/righe vuote/virgole), validazioni e stati vuoti a posto.
- Smoke test di regressione (Playwright, CORE + 8 app × tutte le pagine): 9/9
  pulite, zero errori console/pagina.
Suite CI 301 → 313. Copertura test delle funzioni pure: completa.

## SESSIONE 21/07 (7ª parte) — revisione sicurezza del CORE + messaggi import
Proseguito a oltranza con revisione di sicurezza e rifiniture:
- **Messaggi import più utili** (#291): se carichi un CSV con colonne sbagliate
  (o vuoto), l'app dice quali colonne servono invece di un muto "0 aggiunte".
- **Test** (#293): confine keyword-prefisso in `isIntestazione`. CI 313 → 314.
- **Revisione approfondita del CORE `index.html`** (#294, #295) — l'unico file
  non coperto dal syntax-check CI, che fa deploy automatico in produzione:
  corretti bug REALI di XSS memorizzato (nome cava/operatore/personale e
  titolo promemoria interpolati in innerHTML senza escape; 11 punti, di cui 5
  che la revisione automatica aveva mancato, trovati con grep sistematico) e
  di robustezza (login/registrazione che si rompevano se un utente non aveva
  username; avatar che crashava senza nome/cognome). Verificato con node
  --check + boot Playwright.
- Sweep XSS esteso a TUTTE le app `apps/*`: già pulite (0 campi testo non
  escapati). Posture XSS dell'intero ecosistema: a posto.

### ⚠️ DA DECIDERE (fondatore) — isolamento multi-tenant del CORE
Il core `index.html` NON ha isolamento tra organizzazioni: usa collezioni
Firestore globali (`users`, `rapportini`, ...), senza `orgCollection`. È
coerente col fatto che il core è l'app STORICA mono-azienda (un progetto
Firebase = una cava). Se resta single-tenant "by design" NON è un problema;
se un giorno servirà servire più aziende dallo stesso progetto Firebase, va
introdotto l'isolamento (grande intervento). NON toccato: è una decisione
architetturale del fondatore. L'ecosistema `apps/*` è invece già multi-tenant
via SDK orgCollection (44 test emulatore).

## SESSIONE 21/07 (8ª parte) — isolamento del CORE (autorizzato dal fondatore)
Il fondatore (21/07) ha autorizzato l'isolamento multi-tenant del cuore
("un domani l'app dovrà essere rivenduta a più aziende") e ha chiesto poi di
riprendere la RICERCA su Genesi + rivali, e infine alzare la qualità delle
altre app. Fatto sul cuore, in modo sicuro (PR #297):
- **Fase 0** design+audit (docs/ISOLAMENTO_CORE.md): scoperto che il cuore NON
  ha auth server-side (login lato client) → l'isolamento VERO richiede prima
  identità autenticata + regole server.
- **Fase 1** indirezione data-layer: helper dcol/ddoc, 39 accessi da un solo
  punto, flag MULTI_TENANT=false (comportamento invariato). Il cuore userà
  organizations/{org}/apps/core/… (come "app" core).
- **Fase 2** regola+test: coperto dalla regola generica già provata
  apps/{appId}/**; +8 test emulatore d'isolamento del cuore (52 regole tot).
  CI 314 → 322.
- **Fasi 3-4 GATED**: auth Firebase (claim orgs, via Deepwork ID) + migrazione
  dati di produzione + attivazione flag. Toccano infra/produzione → conferma
  del fondatore, come MITIGAZIONE_PASSWORD. Preparate, NON attivate.

## DIRETTIVA fondatore 21/07: Genesi al livello dei rivali → poi qualità app
Ordine richiesto: 1) ricerca su Genesi + competitor (FATTA, docs/
GENESI_ROADMAP_COMPETITOR.md, #299); 2) portare Genesi al loro livello;
3) alzare la qualità delle altre app.
Avanzamento:
- **Ricerca competitor** (#299): fatta. Scoperto che Genesi ha già molto
  (vibrazioni PPV/Devine, airblast, MIC, flyrock, KCO/Swebrec...); i gap veri
  sono il "chiudere il cerchio col dato reale".
- **Genesi P0.1 — Riconciliazione previsto-vs-reale** (#300): FATTA e in
  produzione. Pannello che affianca previsto (X50/PPV/flyrock) e reale
  misurato, con scostamento colorato, storico localStorage, export CSV. Affronta
  lo stesso tema dei leader (tipo Maptek BlastLogic), ma è un primo passo NON
  validato sul campo, non una parità. Non tocca il motore fisico.
- **Genesi P0.2 — Signature-hole** (#302): FATTA e in produzione. Importa la
  registrazione di un foro singolo (CSV) e la somma ritardata secondo i tempi
  della volata → PPV composito + amplificazione + sparkline SVG + export. Usa lo
  stesso principio del metodo dei big (Orica AVM), ma è una versione
  semplificata e non validata (assume contributi simili tra i fori).
- **Genesi P1.3 — Export piano di innesco (XML IREDES-like)**: FATTO (bozza). Dal
  Progetto 2D esporta un `BlastPlan` XML (metadati volata + fori con posizione,
  profondità, carica, borraggio, ritardo). Bozza di interscambio, NON conformità
  certificata (lo dichiara l'XML). Utile per detonatori elettronici/software terzi.
- **Prossimo Genesi (P1)**: burden reale per foro dal 3D del fronte (RIMANDATO —
  segno geometrico da chiarire col fondatore), import deviazione fori (boretrack).
  P2 (frammentazione da immagine, ML) richiede backend.
- **Poi**: qualità delle altre app verticali (già molto rifinite in settimana).

### Seconde iterazioni UX app verticali (fallback #1 — ordinamenti)
- **Conti — ordinamento fatture** (#305, mergiato): scadenza / importo (dal
  più grande) / cliente A→Z.
- **Flotta — ordinamento mezzi** (#306, mergiato): stato (prima i fermi) / ore
  motore (dal più alto) / nome A→Z. Utile per manutenzione (chi ha più ore) e
  per il colpo d'occhio sui fermi.
- **Scudo — ordinamento scadenze** (#307, mergiato): scadenza (prima le vicine)
  / tipo A→Z / lavoratore A→Z. Utile per raggruppare per persona o per tipo di
  adempimento.
- **Terra — ordinamento rilievi** (#308, mergiato): data (più recente) / volume
  (dal più grande) / titolo A→Z. Utile per confrontare i rilievi per volume.
- **Sentinella — ordinamento sensori** (#309, mergiato): criticità (dal più
  critico) / margine (dal più tranquillo) / nome A→Z. Utile per vedere prima i
  superamenti o, al contrario, controllare chi ha più margine.
- **Campo — ordinamento attività**: stato (prima le anomalie) / titolo A→Z.
  Chiude la serie: TUTTE le liste principali delle app verticali hanno ora un
  controllo di ordinamento coerente (stesso pattern select + comparatore).
- **Prossimo**: passare a altre seconde iterazioni UX (stati vuoti, validazioni
  input) o test aggiuntivi (emulatore, casi limite).

### Ordinamenti — memoria della scelta (rifinitura)
- **Persistenza dell'ordinamento** (tutte e 6 le app): la scelta "Ordina" viene
  ricordata tra una visita e l'altra (localStorage `dwSort_*`), così l'utente non
  la re-imposta ogni volta. Ripristino con guardia (se il valore salvato non è
  valido, resta il default). Verificato: Conti/Sentinella/Campo ripristinano dopo
  reload; nessun errore.

### Revisione sicurezza — isolamento app verticali (fallback #5, priorità #1)
- **Audit isolamento** (`docs/AUDIT_ISOLAMENTO_APP.md`): CONFERMATO che tutte e
  6 le app usano `orgCollection` per ogni operazione dati, zero percorsi
  costruiti a mano, con i test regole Firestore in CI a impedire regressioni.
  Isolamento delle app SOLIDO. Il core resta mono-azienda predisposto (attivo
  solo col via libera del fondatore).
- **Verificato anche**: validazioni dei form (tutte le app hanno i controlli sui
  campi obbligatori + importo/giacenza) e copertura test KPI (comprensiva, fino
  ai confini di conformità es. valore = soglia → superamento). Niente da
  correggere: base matura.

### Stato feature Genesi vs competitor (aggiornato)
Genesi ora ha: frammentazione Kuz-Ram/KCO, flyrock, fori bagnati, presplit,
A/B, detonatori, **vibrazioni PPV/Devine + airblast**, MWD, 3D-da-foto, e ORA
**riconciliazione previsto-vs-reale** (#300) + **signature-hole** (#302). Sono
primi passi lato browser sugli stessi TEMI dei leader — NON parità: manca la
validazione sul campo, i database reali di volate, le integrazioni hardware
(perforatrici/detonatori), che restano il vero divario. Restano P1 (dato reale
di perforazione: burden/boretrack/export) e P2 (immagine/ML, backend).

### CI — copertura sintassi del core in produzione (fallback #5)
- **`index.html` alla radice** (il core, va in produzione su Netlify ad ogni
  merge) ora è nel controllo di sintassi della CI: prima non era coperto, un suo
  errore di sintassi sarebbe finito online. Verificato: 14 file (core incluso)
  passano.

### Test — difesa in profondità isolamento (fallback #4, priorità #1)
- **Utente autenticato senza org** (orgs={}, appena iscritto): +6 test in
  `run.mjs` che verificano il diniego su dati app, cuore, entitlements e membri.
  Suite run.mjs 52 → 58; totale CI 322 → 328. Principale realistico che mancava
  (distinto da anonimo e da concorrente).

## SESSIONE 22/07 — "completa tutti i punti Genesi" (branch #321, attende revisione)
Direttiva fondatore: proseguire da solo sui punti previsti di Genesi ("completa
tutti i punti"); Genesi è priorità ORA, ma non mettere da parte le altre app; lui
rivedrà la GRAFICA "tra qualche ora". Tutto sul branch di sessione (#321), che
resta APERTO per il suo giudizio estetico. Unità di questa sessione (verificate:
syntax CI + logica in Node / DOM di browser reale):
- **Curva granulometrica** completata a 2 modelli (Kuz-Ram + KCO/Swebrec) su asse
  semi-log, punti x20/x50/x80. Solo visualizzazione dei valori GIÀ calcolati.
- **Frazione fine <2.5 cm** dai due modelli (Swebrec mostra più fini: Kuz-Ram
  sottostima la coda fine — onesto, è il motivo del KCO/Swebrec).
- **Calcolo inverso maglia** (punto 1): da un x50 OBIETTIVO propone B×S e powder
  factor invertendo Kuznetsov. Proposta di partenza con AVVERTENZA (verifica col
  fronte, non sostituisce il fochino); round-trip verificato. Nessun tocco alla fisica.
- **Riconciliazione da misure reali** (curva): l'operatore inserisce le dimensioni
  misurate sul muckpile → curva empirica pesata per volume (d³) sovrapposta alla
  previsione, con x50 misurato vs previsto e scarto. NESSUNA auto-segmentazione da
  foto (darebbe numeri fuorvianti): le misure le dà l'operatore, il dato è reale.
- **Import piano XML** (punto 2): round-trip con l'export IREDES-like (#311) → il
  piano diventa portabile; DOMParser+getElementsByTagName rilegge geometria/
  esplosivo/sequenza/ritardi in Progetto 2D. NON è import IREDES certificato.
- Doc `GENESI_OPENSOURCE_EMULAZIONE.md` + funzione di ricerca continua nella skill.
RESTANO (pesanti, rischio numeri fuorvianti se fatti male → DECISIONE fondatore su
librerie/asset e sua revisione grafica): auto-pezzatura-da-foto (watershed/ML),
viewer point-cloud (Potree/deck.gl), ML frammentazione (serve modello pre-addestrato).
Onestà (richiamo del fondatore): sono primi passi lato browser sugli stessi TEMI dei
leader, NON parità.

## SESSIONE 22/07 (2ª parte) — altre app + revisione sicurezza (ciclo automatico)
Con Genesi (parte pesante) gated sul fondatore, cicli automatici proseguiti sui
fallback (non mettere da parte le altre app + revisione). Tutto su #321:
- **Scudo + Sentinella — blocco date FUTURE** nei registri infortuni/volate
  (documenti HSE/enti): un refuso con data futura azzerava il cartellone "giorni
  senza infortuni" o sballava il conteggio volate del mese. `max`=oggi + guardia
  `giorniTra(data)>0`, riusando l'helper condiviso (mezzanotte locale).
- **Scudo** — filtro Infortuni/Near-miss nella lista + campo `luogo` reso coerente
  (prima gli eventi manuali non potevano avere il luogo, che invece esiste in
  import/export/lista).
- **Test** — blindato l'invariante del segno di `giorniTra` (base delle guardie);
  suite CI 328 → 329.
- **Genesi import XML — hardening**: valori testuali (Explosive/Sequence) validati
  contro il vocabolario dell'app (whitelist) prima di entrare in D2.
- **Revisione di sicurezza** (skill security-review) su tutto il diff #321: **nessuna
  vulnerabilità** (import XML: toast textContent + whitelist; riconciliazione: soli
  numeri; luogo: esc; XXE non applicabile in DOMParser browser).
- **Due doc-decisione per il fondatore** sui punti pesanti Genesi:
  `GENESI_FRAMMENTAZIONE_DA_FOTO.md` (#4) e `GENESI_POINT_CLOUD.md` (#5) — onesti
  sui limiti, così può scegliere.
- **Sweep date-future**: confermato che la guardia va SOLO su Scudo/Sentinella
  (misure di eventi passati). Terra (rilievo futuro = "pianificato", volume null,
  escluso dai KPI), Campo (nessuna data / stato pianificata), Conti (scadenza
  futura legittima), Flotta (manutenzione programmata futura) allo stato ATTUALE
  sono corretti — nessuna estensione (evitata una regressione).
Restano gated sul fondatore: revisione estetica #321 + scelte sui punti pesanti +
semantica date Conti + DEFAULT_USERS/mitigazione password/Firebase.

## SESSIONE 22/07 (3ª parte) — Genesi vs competitor: ricerca + confronto + inserimento
Richiesta esplicita del fondatore: «ricerca su tutte le funzionalità della
concorrenza, cosa si può fare e cosa no, confronta con Genesi ed inserisci tutte
le funzioni mancanti». Fatto in modo ONESTO:
- **Ricerca competitor completa** (Orica ShotPlus/BlastIQ/OREPro/FRAGTrack, Maptek
  BlastLogic/PointStudio, Maxam RIOBLAST, Strayos, O-Pitblast, Austin, Hexagon,
  Deswik, BMT, JKSimBlast): cosa fanno e cosa no, per categoria.
- **Matrice di confronto** `docs/GENESI_VS_COMPETITOR_MATRICE.md`. Scoperta chiave:
  nessun competitor è solo-browser; il loro vantaggio forte è la MISURA reale
  (hardware/cloud/dati/ML). Genesi copriva già quasi tutto il fattibile in browser.
- **Le 3 (uniche) lacune fattibili in browser — INSERITE in Genesi:**
  1. **Stima costi/economia** (perforazione/esplosivo/innesco €, €/m³, €/t, margine).
  2. **Report volata stampabile/PDF** (geometria+carica+previsioni+costi, ogni
     previsione etichettata PREVISTO, disclaimer).
  3. **Decking** (1/2/3 cariche/foro, diagramma colonna, carica/deck, beneficio
     vibrazioni; + fix robustezza foro corto).
- **Onestà**: le funzioni che richiedono hardware (droni/sismografi/MWD/detonatori/
  BMT), backend/cloud, dati misurati, ML o database proprietari NON sono fattibili
  in un'app browser → documentate nella matrice come "decisione fondatore", non finte.
Tutto su #321, verificato (syntax CI, Node, Playwright+screenshot). CI verde.

## SESSIONE 22/07 (4ª parte) — rifiniture competitor + rotazione ricerca Conti
Dopo l'inserimento delle 3 funzioni competitor, cicli automatici proseguiti:
- **Genesi rifiniture** (coerenza delle nuove funzioni): fix robustezza decking
  (foro corto → avviso, no borraggio negativo); **costo** ora coerente e identico
  su scheda, confronto A/B (progetto più economico in verde), report e CSV;
  decking anche nel report.
- **Rotazione ricerca (tempi morti) su Conti** → `docs/CONTI_FATTURAZIONE_ROADMAP.md`:
  cosa è fattibile in browser (listino inerti, DDT/pesate + fattura differita, IVA
  22% con reverse charge solo opzionale, generatore XML FatturaPA lato client,
  export commercialista) vs cosa richiede servizi esterni GRATUITI dell'Agenzia
  (invio SdI, conservazione) o hardware (automazione pesa). La ricerca ha trovato un
  **bug di onestà reale**: il KPI "DSO medio" NON era il DSO → **corretto** in "Età
  media credito" (campo `etaCredito`, UI, 5 test aggiornati, suite 174 verde).
Le feature Conti Fascia 1 (listino, DDT, XML) sono DECISIONI del fondatore.

## SESSIONE 22/07 (5ª parte) — direzione DRONE (fondatore) + revisione serale
Conversazione dal vivo col fondatore: priorità = rilievo con **drone economico
(DJI Mini)** → **nuvola/mesh** → **Terra/Genesi** per le volate, restando
**indipendenti** (ODM auto-ospitato) e senza spese. Filosofia: "meno preciso, più
economico" (coerente col fatto che Genesi è una STIMA). Fatto:
- **Doc strategico** `docs/DEEPWORK_DRONE_FLUSSO.md`: flusso completo, perché la
  fotogrammetria non sta nel browser ma si POSSIEDE (ODM open source su macchina
  nostra o su compute gratis/economico — Colab/Kaggle GPU gratis, HF Spaces, o GPU
  a noleggio a centesimi/volata), limiti onesti, passi concreti. (PC del fondatore
  troppo lento → il calcolo pesante si sposta su compute remoto gratis/economico.)
- **Onestà tecnica ribadita al fondatore**: 3D vero da foto = fotogrammetria multi-
  vista (pesante, non nel browser); Depth-Anything da 1 foto è solo un'illusione
  2.5D (lui l'aveva già provato e visto). DUSt3R/MASt3R (AI multi-vista, aperti)
  come alternativa moderna, ma sempre su compute vero.
- **Genesi POC — visore nuvola di punti** `apps/genesi/nuvola-poc.html` (file
  AUTONOMO, non tocca genesi.html): carica PLY (ascii/binario)/XYZ, downsample,
  centra, colora, OrbitControls. Riusa il Three.js già vendorizzato (offline, gratis).
- **Genesi POC — passo 2: mesh + ritaglio fronte** (via libera fondatore): carica
  anche MESH (OBJ/GLB; ODM esporta OBJ), ritaglio del fronte con 6 cursori + piani
  di clipping + box wireframe + export .xyz del fronte isolato.
- **Conti — fix onestà "DSO"**: era mal etichettato → "Età media credito" (campo,
  UI, 5 test) + doc `docs/CONTI_FATTURAZIONE_ROADMAP.md`.
- **Revisione SERALE (21:41 UTC)**: PULITA — syntax OK (genesi/nuvola-poc/conti),
  174 test verdi, 3 superfici avviate senza errori, review avversariale del codice
  nuovo senza bug residui.
- **Parser in modulo testabile** (`apps/genesi/pointcloud.js`): estratti
  parseXYZ/parsePLY/preShiftOBJ come funzioni pure + 11 test CI (blindano i 3 fix
  serali: downsample XYZ, precisione UTM nuvola/mesh). Riusabili per il passo 3.
- **Formato nativo ODM — lettura LAS** (in vista della prova weekend): ODM esporta
  la nuvola come `.las` (non PLY/XYZ), che il POC non apriva → aggiunto
  `parseLAS` (header LAS + record punto, coordinate UTM in doppia precisione, RGB,
  downsample, riconoscimento LAZ compresso con messaggio guida). POC: accept/loader
  estesi a `.las`/`.laz`. +4 test (11→15). CI 340→344. Smoke browser: LAS da 500
  punti caricato, ritaglio ok, zero errori. È fix di FORMATO, non ipotesi sulla forma.
Prossimo (gated sul test weekend del fondatore col dato reale): passo 3 = aggancio
del fronte ritagliato al motore volata di Genesi; poi ponte Terra→Genesi. La catena
di lettura ora copre i formati che ODM produce davvero (LAS/PLY/XYZ + mesh OBJ/GLB).

### Ciclo 23/07 (pomeriggio): ricerca uniforme (Conti gare + Sentinella adempimenti)
Aggiunta ricerca+conteggio alle ultime due liste (Conti gare per titolo, Sentinella
adempimenti per titolo/ente). Ora OGNI lista delle 6 app ha ricerca+conteggio: UX
uniforme. Verificato: gare "anas" 1/4, adempimenti "aua" 1/3, zero errori.

### Ciclo 23/07 (pomeriggio): ricerca+conteggio nei ricambi Flotta
Ricerca per nome + conteggio nel magazzino ricambi (lista che cresce con le scorte).
Ora Flotta ha ricerca su mezzi e ricambi. Verificato: "filtro" → 2 su 4, zero errori.

### Ciclo 23/07 (pomeriggio): ricerca+conteggio nelle scadenze Scudo
La lista scadenze (cuore compliance HSE, spesso lunga) aveva solo filtri; aggiunta
ricerca per tipo/lavoratore + conteggio "N · su TOT" + stato vuoto. Ora Scudo ha
ricerca su entrambe le liste. Verificato: "corso" → 1 su 5, zero errori.

### Ciclo 23/07 (pomeriggio): export CSV lista attività (Campo)
Censimento export liste principali: 5/6 già esportavano; mancava solo Campo attività.
Aggiunto "Esporta attività (CSV)" (titolo;dettaglio;stato;causale, csvCell anti-injection).
Verificato con download: header corretto, 5 righe, zero errori. Ora tutte e 6 le app
esportano la lista principale.

### Ciclo 23/07 (primo pomeriggio): conteggio risultati nelle liste
Completa la ricerca: sotto ogni lista principale un conteggio "N entità · su TOT"
(quando si cerca/filtra), dai nodi realmente resi. Conti/Flotta/Campo/Sentinella/
Terra: nuovo `#*-count`; Scudo: potenziato `pers-count`. Verificato: Conti 2 su 5,
Terra 4 su 5; zero errori.

### Ciclo 24/07 (mattina): airblast verificato + VOLUME dal ritaglio nel POC
- **Airblast verificato** (RI 8485): scaling cubico, pendenza −24 dB/decade, 133 dB
  = OSM standard. Tutte le aree di SICUREZZA di Genesi ora verificate.
- **volumeCumulo** in pointcloud.js (griglia, 4 test, CI 360) + volume del ritaglio
  mostrato nel POC ("stima, base piana") + **fix etichette assi** (quota=z per i
  dati ODM: cursori e riquadro erano invertiti/incoerenti). Guida weekend aggiornata.

### Ciclo 24/07 (notte): verifiche scienza complete + ricerche Terra/Campo + report turno
- SCIENZA (direttiva fondatore) — verificati sulle fonti: DIN 4150-3 (rampa
  interpolata, Genesi usa il fine-banda → punto 9 esteso USBM+DIN), Swebrec/KCO
  (r²>0,995, KCO conferma la scelta di Genesi), xP-frag (errore <25%, 169 volate).
  Nel report di Genesi ora è DICHIARATA la banda ±50% senza calibrazione (solo testo).
- RICERCHE: Terra (proposto volume-dal-ritaglio nel browser → chiude il flusso
  drone) e Campo (handover già nostro; report fine turno) — ora TUTTE le 7 superfici
  hanno il confronto competitor.
- CAMPO: **rapporto di fine turno stampabile** implementato e verificato (non-gated).

### Ciclo 23/07 (notte): direttive fondatore — scienza + estetica 3D
Il fondatore (in chat, su Fable) ha chiesto: (1) fondare Genesi sulla letteratura
scientifica; (2) estetica 3D professionale stile Paradigm. Due deep-research fatte:
raccolta ricca salvata in docs/GENESI_FONTI_SCIENTIFICHE.md e docs/GENESI_ESTETICA_3D.md
(claim [NV]: la verifica incrociata è stata bloccata dal LIMITE DI SESSIONE, reset
21:40 UTC). Domani: verifica claim, ricerca flyrock (sicurezza), confronto formule-codice,
prime 2 unità estetiche con prima/dopo.

### Ciclo 23/07 (sera): PWA test + POC georef + revisione core
- **Test manifest** (`run-manifest.mjs`, 9): blinda i manifest PWA di tutte le 8
  superfici (JSON valido, campi PWA, theme distinti). CI 347→356.
- **POC drone**: indica se la nuvola è georeferenziata (UTM → metri reali) o relativa,
  dalla magnitudine coordinate; unità corretta su dimensioni/ritaglio. Verificato.
- **Revisione core** (fallback #5): rivisto index.html (flagship, ~8300 righe) via
  subagent. Un solo bug: **XSS self nell'anteprima import MWD** (intestazioni/celle CSV
  grezze in innerHTML senza escape) → CORRETTO con escHtml. Resto pulito. Verificato.
- **Sweep sicurezza Genesi** (fallback #5): nessun XSS/crash import (escaper _rEsc su
  testo libero, resto numerico/cataloghi statici, import con try/catch). Unico esito:
  hardening JSON.parse localStorage in cmpRender/cmpExport (helper _cmpLoad con try/catch).

### Ciclo 23/07 (pomeriggio): manifest PWA sulle 6 verticali (installabili)
Core e Genesi erano installabili come app; le 6 verticali no. Aggiunto manifest PWA
(data URI) + meta apple/android a tutte: schermo intero, colore tema per app, icona.
Solo <head>, nessun service worker → rischio nullo. Verificato: manifest parsano e il
browser li carica; utile per l'uso sul campo dal telefono.

### Ciclo 23/07 (pomeriggio): la modifica in-place si annulla cambiando pagina
Robustezza integrità dati: cambiare pagina durante una modifica ora la annulla (form
pulito, pulsante alla default), evitando di sovrascrivere un record credendo di
aggiungerne uno nuovo. 6 app. Verificato con screenshot (Conti).

### Ciclo 23/07 (mezzogiorno): modifica in-place dei record (CRUD mancante)
Fallback #1 — le app aggiungevano/eliminavano ma non MODIFICAVANO (correggere un
refuso = cancella e rifai). Aggiunta la modifica in-place, una entità per unità.
- **Conti** (fatture): ✎ accanto alla ✕ → popola il form "Nuova fattura", "Salva
  modifica" via aggiorna (stesso id, no duplicati), ri-tocco = annulla. Verificato:
  importo 18.300→20.000 salvato in place, conteggio invariato, zero errori.
  [—]
- **Campo** (attività): ✎ → modifica titolo/dettaglio via aggiorna, stato/causale
  restano. Verificato in place, conteggio invariato. ★ SERIE COMPLETA: modifica
  in-place su tutte e 6 le verticali (prima solo aggiungi/elimina).
- **Scudo** (lavoratori): ✎ → modifica nome/ruolo via aggiorna, idoneità/scadenze
  restano. Verificato: ruolo Impiegata→Capocantiere in place, conteggio invariato.
- **Flotta** (mezzi): ✎ → modifica nome/area/ore via aggiorna, stato e manutenzioni
  restano (+fix controllo nome-duplicato). Verificato: ore 9105→9999 in place.
- **Terra** (fronti): ✎ → modifica nome/banco/quota via aggiorna, rilievi e
  avanzamento restano. Verificato: quota 340→999 in place, conteggio invariato.
- **Sentinella** (sensori): ✎ → modifica nome/unità/soglia via aggiorna, lo storico
  misure RESTA (prima si perdeva con cancella+ricrea). Verificato: soglia 5→8 in
  place, conteggio invariato, zero errori.

### Ciclo 23/07 (mattina): ricerca testuale nelle liste (seconda iterazione UX)
Fallback #1 — solo Scudo aveva la ricerca libera (personale); estesa alle altre liste,
una app per unità, stesso pattern + stato vuoto dedicato + verifica screenshot. Pura
UX, nessun tocco al modello dati.
- **Conti** (fatture): campo `#fat-cerca`, filtra per cliente/numero, si compone con
  filtro categoria + ordinamento. Verificato: "edilcave" → 2 fatture; assente → stato
  vuoto; zero errori.
- **Flotta** (mezzi): `#mez-cerca`, filtra per nome/area. Verificato: "escavatore"
  → 2 mezzi; assente → stato vuoto; zero errori.
- **Campo** (attività): `#att-cerca`, filtra per titolo/dettaglio. Verificato:
  "fronte" → 2 attività; assente → stato vuoto. NB: la "ricerca live su tutte le
  app" del riepilogo storico era un overclaim (solo Scudo l'aveva).
- **Sentinella** (monitoraggi): `#mon-cerca`, filtra per nome/nota. Verificato:
  "vibrazioni" → 2 sensori; assente → stato vuoto.
- **Terra** (rilievi): `#ril-cerca`, filtra per titolo/tipo. Verificato: "ortofoto"
  → 4 rilievi; assente → stato vuoto. ★ SERIE COMPLETA: tutte e 6 le app hanno la
  ricerca libera coerente.

### Ciclo notturno 23/07 (dopo il LAS): piano passo 3 + ricerche app
- **`vault/PASSO3_FRONTE_METODO.md`**: metodo del passo 3 (PCA→sezione→envelope→
  burden reale) messo per iscritto SENZA codice (si costruisce sul dato reale).
- **`docs/SCUDO_HSE_ROADMAP.md`** e **`docs/FLOTTA_MANUTENZIONE_ROADMAP.md`**:
  confronto onesto con i software di settore + passi fattibili nel browser (consigliati:
  loop azione correttiva per Scudo, ordine di lavoro per Flotta) — modifiche dati gated.
- **Censimento onesto**: verificato che le verticali sono mature e coperte (~345 test)
  e che il lavoro ad alto valore residuo richiede un input del fondatore (dato drone,
  scelta app, revisione estetica). Stop alla generazione di doc/test speculativi per
  non ricadere nella sovra-produzione. Branch a punto stabile, CI verde.

## ★ CHIUSURA SETTIMANA 20–24/07 (venerdì sera, revisione PULITA) ★
Revisione serale del 24/07: 256 test puri verdi + CI verde su f0af83b +
sintassi OK + smoke Playwright (nuvola-poc, Campo) senza errori JS. Nessun
bug residuo. Riassunto completo della settimana e indice per la revisione
weekend del fondatore nel checkpoint:
**vault/checkpoints/20260724-215500_chiusura-settimana.md**
(punti chiave: 361 test in CI, scienza Genesi verificata, catena drone
pronta, PR #321 mergiabile, 9 decisioni in docs/DECISIONI_WEEKEND.md).

## ★ SESSIONE 25-26/07 — REVISIONE SEVERA DEL FONDATORE → BLOCCO ATTUATIVO ★
Il fondatore ha revisionato tutto il lavoro (25/07) con giudizio esigente e
richieste puntuali. Attuate in ~12 unità consecutive (dettaglio nei
checkpoint dal 20260725-183000):
- **REGOLA FERREA (permanente, in CLAUDE.md)**: i suoi dati orientativi
  (190 video, 6/23 volate, maglia 4,5×3,5, Nonel 25 ms, calcare…) non
  compaiono MAI più in interfaccia/export/documenti; default neutri ovunque.
- **Genesi**: menu 2D/3D, «Geometria volata», scheda compatta (dettagli al
  clic), esplosivo DENTRO la progettazione (via la sezione Indice,
  approfondimento su richiesta), carica per totale volata, 3D «Nuova
  volata» con pannello live (il progetto 2D si conserva), inclinazione del
  FORO, trasparenza→fori cliccabili con scheda, **fronte/terreno rifatti**
  (UV spazio-mondo, shading liscio, via il "maculato" = piano muckpile
  pre-sparo), **home centro di comando** (storico volate, rilievi drone,
  ponte Deepwork).
- **Verticali**: firme estetiche del core nei fogli condivisi (ombre,
  hover, focus ring, barra nav) + colori identitari (Sentinella → blu);
  differenziazione: Scudo (cantieri + documenti DSS/POS/DPI con allegati
  firmati + base normativa 81/08-624/96), Flotta (ordine di lavoro →
  registro interventi + costi), Campo (minuti di fermo + Pareto «dove si
  perde tempo», +3 test), Terra (volume dal visore drone nel rilievo).
- Qualità: CI 361→364, smoke finale 9/9 superfici pulite.
Restano dichiarati: login Genesi (bassa priorità), seconda passata "100%
core" (topbar/tab), eventuali incrementi Conti/Sentinella dopo la sua
revisione.

## Fine progetto (fase commercializzazione) — NON prima
- Acquisto dominio + sottodomini. DECISIONE DEL FONDATORE: nessuna
  spesa prima della commercializzazione.

## Regola dei cicli giornalieri
- ULTIMO ciclo del giorno: SEMPRE prima la revisione (bug, coerenza,
  sicurezza); prosegue coi task solo a revisione pulita.
- Altri cicli: sviluppo nell'ordine delle fasi (A prima di tutto).
- Overflow: ciò che resta passa alla settimana successiva via
  checkpoint — nessuna fretta, nessun taglio di qualità.

## Vincoli
- Non pushare mai su main senza istruzioni esplicite del fondatore
  (prassi: PR anche per vault/ e docs/).
- Commit piccoli e frequenti; un checkpoint per ogni unità completata.
- STILE vincolante: shared/deepwork-style.css + dw-app-shell.css.
- MULTI-TENANT: ogni accesso dati via SDK orgCollection, mai percorsi
  a mano.
- Lavoro certosino: evitare ogni errore o confusione tra le app.

## Riferimenti
- Ultimo checkpoint: vault/checkpoints/20260724-215500_chiusura-settimana.md
- Vault ecosistema: repo gius77gf/ecosistema-vault

---

## Storico

### v3 prima stesura (19/07 sera, sostituita dalla v3.1 estesa la
stessa sera su istruzione del fondatore: piano sovradimensionato)

### v2 (19/07, completata in giornata — conservata integralmente nei
checkpoint e nella cronologia git di questo file)
Task: 1 struttura monorepo ✅ · 2 Deepwork ID fondamenta ✅ (resta il
collaudo online post-Firebase) · 3 scheletri 6 app ✅ · 4 sicurezza
core ✅ prima passata (sw.js + audit; resta la parte weekend) · 5
ricerca competitor → confluita nel task 1 della v3 · 6 pubblicazione ✅

### v1 (2026-07-19, superata dalla v2 dopo il documento del fondatore)
Task originari su questo solo repo: 1) fix service worker, 2) config
Firebase/regole Firestore, 3) vera autenticazione, 4) tooling
(package.json, bundler, split monolite), 5) test scaffold, 6) CI, 7)
README/docs, 8) censimento feature a metà. I punti 1-3 sono confluiti
nel task 4 (v2) e nel task 2 (Deepwork ID); i punti 4-8 restano validi
come lavoro di qualità su Deepwork core, da riprendere dopo i task
prioritari della v2.
