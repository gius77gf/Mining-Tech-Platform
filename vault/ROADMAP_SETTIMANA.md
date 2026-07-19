# Roadmap Settimana — 2026-07-20 → 2026-07-24 (v3)

Elaborata domenica sera 19/07 col fondatore dopo che la v2 è stata
completata in giornata (rimane aperto solo il task ricerca, in corso).
Obiettivo della v3: consolidare e migliorare quanto costruito il 19/07
e far avanzare Genesi, che è l'app su cui il fondatore ha più
aspettative.

## 1. Integrare i risultati della ricerca competitor in un piano per Genesi
[sequenziale — appena il report è pronto] — taglia S — stato: in corso
La ricerca (Paradigm, RioBlast/Maxam, ShotPlus, BlastLogic, ecc.) è in
esecuzione. Al completamento: salvare il report nella wiki del vault
ecosistema-vault (50 - Wiki ricerca), estrarre i punti di forza da
adottare e le lacune da sfruttare, e trasformarli in una lista concreta
di miglioramenti per Genesi in coda a questa roadmap.

## 2. Genesi — overhaul estetico schermata 3D (Fase 2 dal vault)
[sequenziale, dentro apps/genesi] — taglia L — stato: da fare
Dal vault "Prossimi passi" (il fondatore la considera basilare):
materiali PBR, luce/cielo, polvere/gas, muckpile realistico, HUD vetro.
Lavorare a piccole unità con screenshot di verifica ad ogni passo;
NON toccare il motore fisico esistente (scatter, X50, two-energy).

## 3. Genesi — A2: gittata flyrock
[sequenziale, dopo o in alternanza con 2] — taglia M — stato: da fare
Dal vault: modello di gittata flyrock da integrare nella simulazione,
coerente con la fisica già implementata (Pd, burden esplosivo-aware).

## 4. CI su GitHub Actions
[parallelo-gruppo-A] — taglia S — stato: da fare
Workflow che ad ogni PR esegue: i 19 test delle regole di sicurezza
(emulatore Firestore + Java disponibili nei runner GitHub) e un check
di sintassi di sw.js/SDK/functions. Così nessuna PR futura può rompere
l'isolamento multi-tenant senza accorgersene.

## 5. README e documentazione reale del monorepo
[parallelo-gruppo-A] — taglia S — stato: da fare
Il README attuale è una riga. Scrivere: cos'è l'ecosistema, struttura
cartelle, come si sviluppa/testa, link ai documenti chiave
(ARCHITETTURA, AUDIT, DEPLOY, CLAUDE.md).

## 6. Deepwork core — censimento feature incomplete + lista interventi
[parallelo-gruppo-B] — taglia M — stato: da fare
Audit funzionale del monolite (3D/fotogrammetria, import MWD,
simulatore volate, editor metodi v4.1 citato nel vault): per ogni
feature, stato reale e cosa manca; produrre lista priorizzata in
docs/CENSIMENTO_FEATURE.md da rivedere col fondatore al weekend.

## 7. Scudo — iterazione 2: modello dati reale
[parallelo-gruppo-B] — taglia M — stato: da fare
Definire le collezioni Firestore di Scudo (lavoratori, scadenze,
documenti) secondo lo schema orgCollection dello SDK; sostituire i
dati demo hardcoded con caricamento via SDK (fallback ai dati demo
quando il backend non c'è, per la modalità tour). Test con emulatore.

## 8. Deepwork ID — rifiniture flusso
[parallelo-gruppo-B] — taglia S — stato: da fare
Pagina/stato "non autorizzato" con spiegazione dell'invito; logout
coerente su tutte le pagine; pagina profilo: mostrare le app secondo
gli entitlement reali quando presenti (oggi griglia statica).

## In attesa del fondatore (weekend 25-26/07, promemoria armato sabato 09:00)
1. Creazione progetto Firebase (GRATUITA, ~10 min, guida pronta:
   apps/deepwork-id/GUIDA_FIREBASE.md) → poi: config reale nello SDK,
   deploy rules+functions, collaudo online end-to-end.
2. Regole Firestore del progetto ESISTENTE (AUDIT punto 3) da
   incollare in chat per versionarle e correggerle.
3. Dati default del core: reali o di fantasia? (AUDIT punto 2)
4. Eventuale ok alla mitigazione ponte password
   (docs/MITIGAZIONE_PASSWORD.md — PREPARATA, NON ATTIVATA).

## Fine progetto (fase commercializzazione) — NON prima
- Acquisto dominio + sottodomini (unica spesa, ~10-20€/anno).
  DECISIONE DEL FONDATORE: nessuna spesa prima della
  commercializzazione.

## Regola dei cicli giornalieri
- L'ULTIMO ciclo di ogni giornata (fascia serale) parte SEMPRE dalla
  revisione: analisi del lavoro del giorno, correzione bug, miglioria
  di funzionalità e sicurezza, coerenza complessiva. Se la revisione
  è pulita, il ciclo PUÒ proseguire coi task successivi.
- Gli altri cicli: sviluppo nell'ordine di questa roadmap.

## Vincoli
- Non pushare mai su main senza istruzioni esplicite del fondatore
  (prassi: PR anche per vault/ e docs/).
- Commit piccoli e frequenti; un checkpoint per ogni unità completata.
- STILE vincolante: shared/deepwork-style.css + dw-app-shell.css.
- Lavoro certosino: evitare ogni errore o confusione tra le app.

## Riferimenti
- Ultimo checkpoint: vault/checkpoints/2026-07-19_1930_roadmap-v3.md
- Vault ecosistema: repo gius77gf/ecosistema-vault

---

## Storico

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
