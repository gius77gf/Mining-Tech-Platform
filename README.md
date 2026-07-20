# Deepwork — Ecosistema per cave e attività estrattive

Monorepo dell'ecosistema **Deepwork**: una famiglia di applicazioni web
(PWA) per la gestione operativa di cave e attività estrattive, pensata
per essere venduta ad aziende del settore — spesso concorrenti tra
loro, da cui il requisito fondante di **isolamento totale dei dati
tra organizzazioni** (multi-tenant).

## Le app

| App | Cartella | Che cosa fa | Stato |
|-----|----------|-------------|-------|
| **Deepwork** (core) | radice (`index.html`) | Editor volate, rapportini, dashboard di cava | In produzione (v4.x) |
| **Deepwork ID** | `apps/deepwork-id/` | Spina dorsale: account unico, multi-tenant, abbonamenti | Fondamenta complete, attesa progetto Firebase |
| **Genesi** | `apps/genesi/` | Simulatore di volate 3D calibrato su video reali | Sviluppo attivo |
| **Scudo** | `apps/scudo/` | Sicurezza & personale (prima app a uscire) | Mockup navigabile |
| **Campo** | `apps/campo/` | Operativo di campo (capocantiere) | Mockup navigabile |
| **Flotta** | `apps/flotta/` | Mezzi & costi | Mockup navigabile |
| **Conti** | `apps/conti/` | Amministrazione & gare | Mockup navigabile |
| **Sentinella** | `apps/sentinella/` | Ambiente / HSE | Mockup navigabile |
| **Terra** | `apps/terra/` | Estrattivo & rilievo | Mockup navigabile |

Ogni app è pubblicata automaticamente ad ogni merge su `main` come
percorso `/apps/<nome>/` del sito Netlify esistente (`apps/DEPLOY.md`).

## Struttura del repository

```
index.html            Deepwork core (PWA monolite)
apps/<nome>/          le app dell'ecosistema
shared/               stile vincolante + SDK identità
  deepwork-style.css  token di design (palette, font, geometrie)
  dw-app-shell.css    shell comune delle app
  deepwork-id-client/ SDK: login, organizzazioni, entitlement
vault/                memoria di lavoro dell'automazione
  ROADMAP_SETTIMANA.md  piano della settimana corrente
  checkpoints/          segnalibri append-only dei cicli di lavoro
docs/                 audit e piani (sicurezza, mitigazioni)
.github/workflows/    CI: test regole multi-tenant + syntax check
CLAUDE.md             istruzioni permanenti per le sessioni AI
```

## Architettura in breve

- **Identità e isolamento**: tutte le app usano lo SDK
  `shared/deepwork-id-client/` — login (Google/email/tour), selezione
  organizzazione, controllo abbonamenti, e accesso dati sigillato
  sull'organizzazione (`orgCollection`). Le regole Firestore
  (`apps/deepwork-id/firestore.rules`) negano tutto di default;
  l'isolamento è dimostrato da **19 test automatici** contro
  l'emulatore. Architettura completa: `apps/deepwork-id/ARCHITETTURA.md`.
- **Stile**: un solo design system (`shared/deepwork-style.css`);
  ogni app personalizza solo il proprio colore d'accento.
- **Automazione di sviluppo**: il progetto avanza tramite cicli di
  lavoro automatici pianificati (roadmap + checkpoint in `vault/`);
  procedura in `CLAUDE.md`.

## Sviluppo e test

```bash
# server locale
python3 -m http.server 8899        # poi apri /apps/<nome>/

# test delle regole di sicurezza (richiede firebase-tools + Java)
cd apps/deepwork-id
firebase emulators:exec --project demo-deepwork "cd tests && npm test"
```

La CI (`.github/workflows/ci.yml`) esegue gli stessi test più i
controlli di sintassi su ogni pull request.

## Documenti chiave

- `apps/deepwork-id/ARCHITETTURA.md` — architettura identità/multi-tenant
- `apps/deepwork-id/GUIDA_FIREBASE.md` — setup del progetto Firebase
- `docs/AUDIT_SICUREZZA.md` — censimento sicurezza del core
- `docs/MITIGAZIONE_PASSWORD.md` — piano ponte password (non attivato)
- `apps/genesi/PIANO_3D.md` — stato e piano del motore 3D di Genesi
- `apps/DEPLOY.md` — pubblicazione (fase gratuita e futura)
