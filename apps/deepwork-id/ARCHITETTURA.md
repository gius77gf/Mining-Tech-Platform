# Deepwork ID — Architettura (v0.1, bozza di progettazione)

Documento di progettazione delle fondamenta. Nessun codice viene scritto
prima che questo modello sia stabile. Le decisioni marcate ⚠️ richiedono
conferma del fondatore prima dell'implementazione.

## 1. Scopo

Deepwork ID è la spina dorsale dell'ecosistema: un unico profilo
personale con cui accedere a tutte le app (Deepwork core, Genesi, Scudo,
Campo, Flotta, Conti, Sentinella, Terra) e alle sole funzionalità per
cui l'organizzazione ha pagato. Requisito fondante non negoziabile:
**isolamento totale dei dati tra organizzazioni** — i clienti sono
aziende spesso concorrenti tra loro e non devono mai poter vedere dati
altrui, nemmeno per errore di programmazione.

## 2. Scelta tecnologica

- **Firebase Authentication** per identità (già nello stack del
  progetto): provider Google Sign-In + registrazione email/password.
- **Firestore** per dati di organizzazioni, membri, entitlement.
- **Custom claims** nel token di autenticazione (impostati da Cloud
  Function, mai dal client) per orgId e ruoli: ogni richiesta arriva
  alle security rules già "timbrata" con l'organizzazione.
- Le app restano PWA statiche (Netlify): tutta l'autorizzazione vive in
  Firebase (rules + claims), niente server proprio da mantenere.

## 3. Modello dati (Firestore)

Isolamento **per percorso** (path-based): tutti i dati di
un'organizzazione vivono SOTTO il documento dell'organizzazione. È la
forma più robusta: una security rule sul prefisso del percorso copre
ogni collezione figlia, presente e futura.

```
users/{uid}
  displayName, email, photoURL, createdAt
  defaultOrgId                      // ultima org usata

organizations/{orgId}
  name, status (active|suspended), createdAt, ownerUid
  plan                              // fascia dipendenti (pricing per org)

organizations/{orgId}/members/{uid}
  role: owner | admin | member
  appRoles: { deepwork: "editor", scudo: "rspp", ... }   // ruolo per app
  status: active | invited | disabled
  invitedBy, joinedAt

organizations/{orgId}/entitlements/{appId}
  active: bool
  tier: base | pro | premium
  validUntil                         // scadenza abbonamento
  seats                              // se mai servisse un tetto utenti

organizations/{orgId}/apps/{appId}/...   // dati applicativi di ogni app
                                          // (es. volate, rapportini)

invites/{inviteId}                   // fuori dalle org: solo per aggancio
  email, orgId, role, expiresAt, status
```

## 4. Isolamento multi-tenant (il cuore)

- Custom claim `orgs: { orgId: role }` nel token. Il client non può
  scriverlo: lo imposta una Cloud Function quando un membro viene
  aggiunto/rimosso.
- Security rules, schema base:

```
match /organizations/{orgId}/{document=**} {
  allow read, write: if request.auth != null
                     && request.auth.token.orgs[orgId] != null;
}
```

- Nessuna query cross-organizzazione è possibile per costruzione: i
  percorsi delle query includono sempre l'orgId, e le rules rifiutano
  percorsi di org a cui l'utente non appartiene.
- Regola di default: tutto negato; si apre solo ciò che serve.
- Un utente PUÒ appartenere a più organizzazioni (es. consulente RSPP
  che serve più cave): il claim è una mappa, l'app chiede quale org
  attivare al login (o usa defaultOrgId).

## 5. Flusso di accesso

1. Login con Google (preferito) o email/password.
2. Se l'account non appartiene a nessuna organizzazione e non ha inviti
   pendenti → schermata "account non autorizzato" + accesso alla
   modalità tour (punto 7).
3. Se ha inviti pendenti → accettazione invito → Cloud Function scrive
   membership + aggiorna claims.
4. Ad accesso riuscito, l'app legge gli entitlement dell'org attiva e
   mostra solo le app/funzioni pagate.

## 6. Ruoli

- `owner`: fatturazione, gestione membri, tutto.
- `admin`: gestione membri e configurazione app.
- `member`: uso quotidiano; i permessi fini per app vivono in
  `appRoles` (es. in Scudo un membro può essere "rspp" o "lavoratore").

## 7. Modalità tour di prova

- Organizzazione demo dedicata (`org_demo`) con dati sintetici
  realistici, in sola lettura.
- Accesso via Firebase Anonymous Auth: chiunque può entrare senza
  credenziali, vede le funzionalità vere con dati finti.
- Le rules concedono su `org_demo` solo `read` agli anonimi: nessuna
  scrittura, nessun dato reale nel tenant demo.

## 8. Migrazione di Deepwork core (rimozione password in chiaro)

Fase A — Deepwork ID nasce e funziona in parallelo (nessuna rottura).
Fase B — Deepwork core aggiunge il login Deepwork ID accanto a quello
        attuale; gli utenti reali vengono invitati e migrati.
Fase C — il vecchio login a credenziali hardcoded viene RIMOSSO dal
        client e le password esposte vengono ruotate/invalidate.
La fase C chiude il rischio di sicurezza aperto segnalato nel vault
(password admin esposte pubblicamente su GitHub).

## 9. Integrazione con le altre app

- In `shared/` un piccolo SDK JS (`shared/deepwork-id-client/`):
  init Firebase, login, selezione org, lettura entitlement, guardie di
  accesso. Ogni app lo importa: zero duplicazione della logica di
  sicurezza nelle 8 app.
- Ogni app dichiara il proprio `appId` e i ruoli che riconosce.

## 10. Decisioni aperte per il fondatore ⚠️

1. **Progetto Firebase**: riusare quello esistente di Deepwork o
   crearne uno nuovo dedicato all'ecosistema? (consigliato: nuovo
   progetto pulito, con regione dati europea per i clienti italiani)
2. **Pagamenti**: quale sistema per gli abbonamenti (es. Stripe)? Serve
   solo più avanti, ma la struttura entitlement è già pronta.
3. **Nome utente visibile**: il profilo mostra nome reale/foto Google o
   un profilo aziendale neutro?

## Prossimi passi tecnici (ordine)

1. ✅ Questo documento.
2. Conferma decisioni aperte (⚠️) dal fondatore.
3. Setup progetto Firebase + regole di sicurezza (file `firestore.rules`
   versionato qui).
4. SDK client minimo in `shared/deepwork-id-client/`.
5. Pagina di login/registrazione/tour (`apps/deepwork-id/index.html`)
   nello stile grafico Deepwork.
6. Cloud Function per claims e inviti.
7. Test delle rules con l'emulatore Firebase (isolamento verificato da
   test automatici, non a occhio).
