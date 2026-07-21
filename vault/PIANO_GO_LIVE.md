# Piano go-live — dalla demo al primo cliente che paga

Data: 2026-07-21 · Per Giuseppe. Questo è un **programma sequenziale**: i
passi nell'ordine giusto per portare l'ecosistema da "demo che si mostra" a
"prima cava che lo usa davvero, con i suoi dati, pagando". Non è una lista di
cose belle da fare: è il **percorso più corto** che tiene conto delle
dipendenze (cosa deve venire prima di cosa).

Regola d'oro: **niente spese** finché non lo decidi tu (CLAUDE.md). Questo
piano è scritto per arrivare al go-live col minimo indispensabile e gratis
dove possibile; le spese vere sono segnalate ⚠️.

Legenda: 🔴 decisione tua · 🟢 lavoro tecnico (cicli automatici) · ⏱️ stima
grossolana · ⚠️ possibile spesa.

---

## Cosa vuol dire "go-live" (il traguardo)
Una **prima cava pilota** (meglio se amica/vicina, non un concorrente
diffidente) entra con Deepwork ID, apre 1–2 app (es. Scudo + Flotta), carica
i **suoi** dati veri e li usa per una settimana senza che nessun altro veda
niente. Se regge una settimana con dati veri, è vendibile.

Non serve, per il primo cliente: fattura elettronica allo SdI, telemetria in
tempo reale, Genesi in produzione, tutte e 6 le app insieme. Quelli vengono
dopo (vedi in fondo).

---

## Il percorso critico (in ordine)

### Passo 1 — 🔴 Creare il progetto Firebase nuovo
È il **collo di bottiglia**: senza login live non esiste "cliente vero". Tutto
il resto dipende da qui.
- Cosa fai tu: crei il progetto (serve un account Google), incolli in chat la
  config web, confermi il piano **Spark (gratis)** — Auth + Firestore bastano.
- Guida passo-passo già pronta: `apps/deepwork-id/GUIDA_FIREBASE.md`.
- ⏱️ 30–60 min tuoi. ⚠️ Costo: **zero** (Spark). Le Cloud Functions vere
  chiederebbero il piano Blaze → **rimandato**, non serve per il pilota.
- Dipendenze: nessuna. **Parti da qui.**

### Passo 2 — 🟢 Attivare il live (dopo il Passo 1)
Appena mi dai la config, i cicli automatici eseguono la sequenza già scritta:
config nell'SDK → regole di sicurezza → registrazione → bootstrap del primo
owner → verifica live. Dettaglio: `apps/deepwork-id/ATTIVAZIONE_LIVE.md`.
- ⏱️ Poche ore di lavoro tecnico, niente da fare da parte tua.
- Dipendenze: Passo 1.

### Passo 3 — 🔴 Decidere il messaggio d'errore delle scritture
Oggi in demo un salvataggio non fallisce mai; in live un problema di rete
resterebbe muto. Serve una tua scelta di **stile** (es. riquadro rosso
"Operazione non riuscita, riprova"). Poi l'implementazione è meccanica.
- Dettaglio: `docs/DECISIONI_WEEKEND.md` punto 5, `docs/AUDIT_SICUREZZA.md`
  punto 12.
- ⏱️ 5 min tuoi (scegli lo stile) + poco lavoro tecnico.
- Dipendenze: può essere deciso **in parallelo** al Passo 1; va **applicato**
  prima di far entrare il cliente (Passo 6).

### Passo 4 — 🔴 Bonifica dati di default sensibili
Nel core ci sono nomi/IBAN/telefoni dall'aspetto reale (pubblici su GitHub).
Prima di mettere in mano l'app a un cliente vanno **sostituiti con dati
sintetici**. Se sono inventati, basta confermarlo.
- Dettaglio: `docs/AUDIT_SICUREZZA.md` punti 1–2, `docs/CENSIMENTO_FEATURE.md`.
- 🔴 Serve la tua parola: reali o di fantasia?
- ⏱️ 5 min tuoi + poco lavoro tecnico se da bonificare.
- Dipendenze: indipendente; **prima** del go-live pubblico.

### Passo 5 — 🔴 Password in chiaro (solo se usi il core con login vecchio)
Se il pilota userà il **core** con gli utenti storici, va attivata la
mitigazione password (già preparata, non attiva) e ruotate le password.
- Dettaglio: `docs/MITIGAZIONE_PASSWORD.md`.
- Nota: se il pilota entra **solo** dalle app nuove via Deepwork ID (Passo 2),
  questo passo non serve subito.
- Dipendenze: solo se si usa il core storico.

### Passo 6 — 🟢🔴 Onboarding della cava pilota
- Tu: scegli **quale cava** e **quali 1–2 app** (consiglio: Scudo — scadenze
  personale — e Flotta — mezzi/ricambi: valore immediato, dati facili da
  caricare, ora entrambe con import **e** export CSV).
- Tecnico: creo l'organizzazione del cliente, il primo utente owner, carico i
  suoi dati storici via **import CSV** (già pronto per Campo/Flotta/Conti/Terra).
- Dipendenze: Passi 2, 3, e 4 fatti.

### Passo 7 — 🟢 Settimana di prova con dati veri
Il cliente usa l'app per una settimana. Io tengo d'occhio errori e rifinisco.
Verifica che l'**isolamento** regge (lui vede solo i suoi dati — è la promessa
n.1). Se regge, **go-live raggiunto**.

---

## Cosa procede IN PARALLELO senza bloccare il go-live
I cicli automatici continuano su ciò che è sicuro e non gated: rifiniture UX,
robustezza dei test (già fatta molta), export/import, nuove schede di ricerca.
Niente di questo aspetta le tue decisioni.

## Cosa arriva DOPO il primo cliente (non blocca il go-live)
- **Fattura elettronica SdI** (Conti): serve intermediario/PEC, non solo
  browser. Studiato nel vault. Decisione + ⚠️ possibile costo.
- **Telemetria in tempo reale** (Flotta): serve un pezzo di server. Studiato.
  ⚠️ costo. Intanto l'import CSV copre il caso.
- **Genesi in produzione**: il motore fisico è pronto; serve la tua indicazione
  sulla prossima rifinitura (`DECISIONI_WEEKEND.md` punto 6).
- **Ciclo chiuso dati di cava** (i "ponti" tra le app): il pezzo che rende
  l'ecosistema unico. Decomposizione pronta; parte dopo che 2+ app sono live.
- **Notifiche push / meteo**: si accendono con la chiave del progetto Firebase
  nuovo (Passo 1) — arrivano quasi gratis dopo.

---

## In una frase
Il go-live dipende **quasi solo da te sul Passo 1** (creare il progetto
Firebase gratis). Da lì il lavoro tecnico è già scritto e in gran parte
pronto. Le due decisioni di contorno (messaggio d'errore, bonifica dati) sono
da 5 minuti l'una. Tutto il resto è "dopo" e non blocca il primo cliente.

## Sei pronto per il go-live quando…
- [ ] Progetto Firebase creato e config incollata in chat (Passo 1)
- [ ] Live attivato e verificato (Passo 2)
- [ ] Stile del messaggio d'errore scelto (Passo 3)
- [ ] Dati di default confermati o bonificati (Passo 4)
- [ ] Cava pilota e app scelte, dati storici caricati (Passo 6)
- [ ] Una settimana con dati veri senza problemi, isolamento verificato (Passo 7)
