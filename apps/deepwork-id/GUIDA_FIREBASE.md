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
    (inserirlo nel codice e caricare le regole di sicurezza) pensiamo noi.

## Cosa NON fare
- Non serve inserire carte o attivare il piano a pagamento (Blaze):
  tutto lo sviluppo sta nel piano gratuito.
- Non toccare le "Regole" di Firestore dalla console: le regole vere
  sono versionate nel repo (apps/deepwork-id/firestore.rules) e le
  carichiamo in modo controllato.

## Se qualcosa non torna
Fai uno screenshot e incollalo in chat: ti guido dal punto esatto in
cui sei, come al solito.
