# Roadmap Settimana — 2026-07-20 → 2026-07-24 (v2)

Fonte: documento del fondatore "lavoro settimana 20-25" + vault
`ecosistema-vault` (mappa ecosistema, roadmap, MOC). Questa versione
sostituisce la v1 (che resta in Storico in fondo).

Contesto ecosistema: Deepwork = core (questo repo). Genesi = prodotto
premium (repo genesi-app). Deepwork ID = spina dorsale da creare
(Fase 0): account unico, multi-tenant, abbonamenti — prerequisito di
tutte le 6 app verticali (Scudo, Campo, Flotta, Conti, Sentinella,
Terra).

## 1. Creare le repository GitHub per tutte le app previste
[sequenziale] — taglia S — stato: da fare
Una repo per app: deepwork-id + le 6 app verticali (Genesi ha già la
sua). NOTA OPERATIVA: le sessioni automatiche non possono creare repo
(non hanno strumenti GitHub API) — questo task va eseguito nella
sessione interattiva di kickoff, prima dell'avvio dei cicli automatici.

## 2. Deepwork ID — fondamenta (il punto fondamentale del progetto)
[sequenziale, dipende da 1] — taglia L — stato: da fare
Nel repo dedicato deepwork-id. Requisiti dal fondatore:
- Profilo personale unico per accedere a tutte le app dell'ecosistema
  e alle funzionalità per cui si è pagato (abbonamenti/entitlement).
- MULTI-TENANT RIGOROSO: le app saranno vendute a più aziende, spesso
  concorrenti tra loro — isolamento totale dei dati tra organizzazioni,
  progettato dal primo giorno, non aggiunto dopo.
- Accesso tramite registrazione; ideale il login Google con verifica
  che l'account sia autorizzato (dove può entrare, cosa può vedere).
- Risolve il bug delle password in chiaro di Deepwork.
- Prepara la "modalità tour di prova": far vedere l'app a chi non ha
  credenziali, con funzionalità visibili ma dati di esempio.

## 3. Scheletri delle 6 app verticali
[dopo 2; parallelo-gruppo-A tra loro] — taglia L complessiva — stato: da fare
Scudo, Campo, Flotta, Conti, Sentinella, Terra — ognuna nella propria
repo creata al task 1. REGOLA VINCOLANTE DEL FONDATORE: tutte le app
seguono lo stile grafico "deepwork" (colori e resto identici) — nessuna
direzione estetica diversa se non dichiarata esplicitamente dal
fondatore; personalizzazioni ammesse solo su ciò che serve alla
funzione specifica. Ordine di priorità dal vault: Scudo per prima
(finestra di mercato L.198/2025) — per Scudo esiste già il task "mockup
UI navigabile" nei Prossimi passi del vault.

## 4. Deepwork (core) — verifica e miglioramento sicurezza
[parallelo-gruppo-B, indipendente] — taglia M — stato: da fare
Audit di sicurezza mai fatto finora: service worker rotto
(sw.js → file inesistenti), firebase-messaging-sw.js con segnaposto,
regole Firestore da verificare, credenziali in chiaro (la rimozione
completa dipende da Deepwork ID, task 2, ma l'audit e le mitigazioni
si fanno subito).

## 5. Ricerca competitor per Genesi
[solo dopo il completamento dei task 1-4] — taglia M — stato: da fare
Ricerca esaustiva su Paradigm (Austin Powder), RioBlast (Maxam) e altri
software equivalenti anche non noti: grafica, funzionalità,
funzionamento, costi, tutto — senza escludere nulla. Obiettivo: estrarre
i punti di forza per rafforzare Genesi. Nel vault esiste già ricerca su
Strayos e O-Pitblast (50 - Wiki ricerca) da integrare, non duplicare.

## Regola dei cicli giornalieri
- L'ULTIMO ciclo di ogni giornata (fascia serale) è dedicato SOLO alla
  revisione: rileggere il lavoro del giorno e dei precedenti, correggere
  bug, garantire coerenza complessiva. Nessuno sviluppo nuovo in quel
  ciclo.
- Gli altri cicli: sviluppo secondo quest'ordine di task.

## Vincoli
- Non pushare mai su main senza istruzioni esplicite dell'utente.
- Commit piccoli e frequenti; un checkpoint per ogni unità completata.
- Lavoro certosino: evitare ogni errore o confusione tra le app.

## Riferimenti
- Ultimo checkpoint: vault/checkpoints/2026-07-19_1215_roadmap-v2.md
- Vault ecosistema: repo gius77gf/ecosistema-vault (mappa, roadmap, MOC
  app, wiki ricerca)

---

## Storico

### v1 (2026-07-19, superata dalla v2 dopo il documento del fondatore)
Task originari su questo solo repo: 1) fix service worker, 2) config
Firebase/regole Firestore, 3) vera autenticazione, 4) tooling
(package.json, bundler, split monolite), 5) test scaffold, 6) CI, 7)
README/docs, 8) censimento feature a metà. I punti 1-3 sono confluiti
nel task 4 (v2) e nel task 2 (Deepwork ID); i punti 4-8 restano validi
come lavoro di qualità su Deepwork core, da riprendere dopo i task
prioritari della v2.
