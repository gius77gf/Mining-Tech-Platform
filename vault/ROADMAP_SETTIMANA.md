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
- Ultimo checkpoint: vault/checkpoints/2026-07-21_2200_indici-firestore.md
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
