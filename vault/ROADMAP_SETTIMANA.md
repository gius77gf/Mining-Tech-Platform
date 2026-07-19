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
A9. Rock-factor Lilly (dal vault: caratterizzazione ammasso roccioso)
    — taglia M — stato: da fare
A10. Presplit e confronto A/B tra progetti di volata (dal vault)
    — taglia M — stato: da fare
Ogni unità: screenshot di verifica prima/dopo, commit, checkpoint.

═══════════════════════════════════════════════
## FASE B — Trasversali (parallelo-gruppo-A, sbloccano qualità per tutto)

B1. CI GitHub Actions: 19 test rules + syntax check SDK/functions/sw
    ad ogni PR — taglia S — stato: da fare
B2. README reale del monorepo + indice documenti — taglia S — stato: da fare
B3. Hub ecosistema: pagina indice /apps/ navigabile in stile deepwork
    (griglia delle app con stato e link, punto d'ingresso del tour)
    — taglia S — stato: da fare
B4. Navigazione trasversale: header comune con switcher tra app
    (componente condiviso in shared/) — taglia M — stato: da fare

═══════════════════════════════════════════════
## FASE C — Completamento app verticali (parallelo-gruppo-B tra app diverse)
Per OGNI app, nell'ordine: modello dati Firestore secondo lo schema
orgCollection; caricamento dati via SDK con fallback demo (tour);
form di inserimento/modifica funzionanti; KPI calcolati dai dati veri;
test con emulatore dove sensato.

C1. Scudo (prima: è la prima app a uscire): collezioni lavoratori/
    scadenze/documenti + CRUD completo + KPI reali + import CSV
    personale — taglia L — stato: da fare
C2. Campo: attività/squadre/rapportini + compilazione rapportino con
    foto + stato squadre — taglia L — stato: da fare
C3. Flotta: mezzi/manutenzioni/costi + registro ore + scadenzario
    tagliandi con alert — taglia L — stato: da fare
C4. Conti: fatture/gare + scadenzario incassi + KPI (DSO, margine)
    calcolati — taglia L — stato: da fare
C5. Sentinella: monitoraggi/adempimenti/registri + registrazione
    superamenti con nota — taglia L — stato: da fare
C6. Terra: fronti/rilievi/piano + calcolo volumi da rilievi +
    avanzamento piano — taglia L — stato: da fare

═══════════════════════════════════════════════
## FASE D — Deepwork ID avanzato (dopo B, in parallelo a C)

D1. Pagina/stato "non autorizzato" con spiegazione invito — taglia S — stato: da fare
D2. Logout coerente su tutte le pagine + griglia app da entitlement
    reali — taglia S — stato: da fare
D3. Verifica email + recupero password (flussi Firebase Auth)
    — taglia M — stato: da fare
D4. Pannello amministrazione organizzazione (gestione membri/ruoli da
    UI, usa le callable esistenti) — taglia M — stato: da fare
D5. Test SDK con emulatore Auth+Firestore (flusso login→org→dati)
    — taglia M — stato: da fare

═══════════════════════════════════════════════
## FASE E — Deepwork core

E1. Censimento feature incomplete (3D/fotogrammetria, MWD, simulatore,
    editor metodi v4.1) → docs/CENSIMENTO_FEATURE.md priorizzato
    — taglia M — stato: da fare
E2. Interventi rapidi dal censimento (bug evidenti e fix piccoli,
    max 1 ciclo) — taglia M — stato: da fare

═══════════════════════════════════════════════
## Attività SECONDARIA — ricerca competitor per Genesi
[decisione fondatore 19/07: NON prima del primo ciclo automatico, e
sempre DOPO un'unità primaria chiusa in modo stabile] — stato: sospesa
Interrotta il 19/07 per esaurimento crediti (10 fatti non verificati su
Paradigm nel checkpoint 2026-07-19_2000, da ri-verificare). Procedere a
schede piccole: Maxam RioBlast/RIOSUITE → Orica ShotPlus → Maptek
BlastLogic → altri → sintesi con tabella e raccomandazioni. Salvare in
ecosistema-vault/50 - Wiki ricerca/ (pull prima di scrivere).

## In attesa del fondatore (weekend 25-26/07, promemoria armato sabato 09:00)
1. Creazione progetto Firebase (GRATUITA, ~10 min, guida:
   apps/deepwork-id/GUIDA_FIREBASE.md) → poi config reale nello SDK,
   deploy rules+functions, collaudo online end-to-end.
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
- Ultimo checkpoint: vault/checkpoints/2026-07-19_2340_a8-fori-bagnati.md
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
