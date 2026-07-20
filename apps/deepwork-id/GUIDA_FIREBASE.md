# Guida passo-passo — Creazione progetto Firebase (per il fondatore)

Tempo: ~10 minuti. Costo: ZERO (piano Spark, gratuito — non serve carta).
Quando: weekend 25-26/07 (o quando preferisci). Serve solo il tuo
account Google (gius77.gf@gmail.com).

## Passi

1. Apri il browser e vai su **console.firebase.google.com**
2. Accedi con il tuo account Google se richiesto
3. Clicca **"Crea un progetto"** (o "Add project")
4. Nome del progetto: scrivi **deepwork-ecosistema**
   (il sistema genererà un ID tipo `deepwork-ecosistema-xxxxx`: va bene)
5. Google Analytics: quando lo chiede, scegli **disattiva** (non ci
   serve, si può attivare in futuro)
6. Clicca **Crea progetto** e aspetta che finisca, poi **Continua**

### Attivare l'autenticazione
7. Nel menu a sinistra: **Build → Authentication** → **Inizia**
8. Nella scheda "Sign-in method", attiva questi tre provider:
   - **Email/password** → abilita → salva
   - **Google** → abilita → (ti chiede un nome visibile e la tua email
     di supporto: lascia i valori proposti) → salva
   - **Anonimo** (serve per la modalità tour) → abilita → salva

### Attivare il database
9. Menu a sinistra: **Build → Firestore Database** → **Crea database**
10. Località: scegli **eur3 (Europa)** — importante, non cambiare
11. Modalità: scegli **"Avvia in modalità di produzione"** (le regole
    vere le carichiamo noi dal repo) → **Crea**

### Recuperare le chiavi per le app
12. Clicca sull'ingranaggio in alto a sinistra → **Impostazioni progetto**
13. Scorri fino a "Le tue app" → clicca sull'icona **</>** (Web)
14. Nickname app: scrivi **ecosistema-web** → **Registra app**
    (NON spuntare Firebase Hosting)
15. Ti mostrerà un blocco di codice con dentro `firebaseConfig = { ... }`:
    **copia tutto il blocco** e incollalo in chat a Claude — al resto
    (inserirlo nel codice, caricare le regole di sicurezza, creare la
    tua organizzazione) pensiamo noi, seguendo il runbook tecnico
    `apps/deepwork-id/ATTIVAZIONE_LIVE.md`.

## IMPORTANTE — cosa parte subito gratis e cosa richiede una tua scelta
Con i passi qui sopra (progetto + Authentication + Firestore) sei nel
piano **gratuito** (Spark), zero spese. Questo basta per far
funzionare **le 6 app** (Scudo, Campo, Flotta, Conti, Sentinella,
Terra) con dati reali e isolamento tra aziende.

C'è però un dettaglio onesto da sapere: la parte di **Deepwork ID che
crea organizzazioni e invita i colleghi da sola** usa le *Cloud
Functions*, che Google fa girare **solo sul piano Blaze** (a consumo).
Il Blaze ha una fascia gratuita ampia — con l'uso di una singola cava
il costo reale è **0 €** — MA richiede una carta registrata. Visto che
la tua regola è "nessuna spesa prima della commercializzazione", NON
attiviamo il Blaze ora.

**Come partiamo comunque live, gratis:** dopo che avrai creato il
progetto e ti sarai registrato una volta nell'app, io lancio una tantum
lo script `scripts/bootstrap-owner.mjs` (usa la chiave di servizio, gira
in locale, gratis) che crea la tua organizzazione, ti rende owner e
attiva tutte e 8 le app nel tuo profilo. Da lì le app funzionano live
sulla tua cava e la schermata profilo mostra l'abbonamento "pieno".
La creazione self-service
di nuove organizzazioni e gli inviti automatici resteranno in
"anteprima" finché non deciderai tu se attivare il Blaze (a costo 0 di
utilizzo) — decisione rimandata alla commercializzazione.

## Cosa NON fare
- Non serve inserire carte o attivare il piano a pagamento (Blaze):
  tutto lo sviluppo sta nel piano gratuito.
- Non toccare le "Regole" di Firestore dalla console: le regole vere
  sono versionate nel repo (apps/deepwork-id/firestore.rules) e le
  carichiamo in modo controllato.

## Se qualcosa non torna
Fai uno screenshot e incollalo in chat: ti guido dal punto esatto in
cui sei, come al solito.
