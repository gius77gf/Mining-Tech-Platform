# Revisione di sicurezza — 30 luglio 2026

*Roadmap, blocco 5, punto Q3. Non è una lettura del codice: ogni cosa scritta
qui è stata **chiesta all'emulatore Firestore** e la risposta è riportata
com'è arrivata. Le proposte in fondo **non sono state applicate**: cambiare le
regole cambia cosa i clienti possono fare, e quella è una decisione del
fondatore.*

---

## In una riga

**L'isolamento fra organizzazioni tiene: è la cosa che conta di più e regge.**
Dentro un'organizzazione, invece, non esiste ancora nessuna separazione: chiunque
sia stato invitato può leggere, modificare e cancellare i dati di **tutte** le
app, comprese quelle che l'azienda non ha comprato.

## Cosa è stato provato, e come

`apps/deepwork-id/tests/run.mjs`: **58 prove, tutte superate**. Coprono
l'isolamento fra due organizzazioni concorrenti (lettura, scrittura,
cancellazione, elenco, dati annidati in profondità), il tenant della
dimostrazione, gli abbonamenti, i membri, gli inviti e i profili.

```
firebase emulators:exec --only firestore --project demo-deepwork "cd tests && node run.mjs"
  → Risultato: 58 passati, 0 falliti
```

Il muro fra aziende concorrenti — il requisito fondante di questo prodotto, dato
che le stesse app si vendono a cave che si fanno concorrenza — **è provato e
tiene**, anche sulle collezioni nate dopo che le regole sono state scritte
(`apps/{appId}/{document=**}` copre tutto quello che verrà).

## I due buchi, misurati

*Non sono una scoperta: la ricerca di luglio li aveva già scritti come rischi
**R2** e **R3** in `docs/RICERCA_DEEPWORKID_202607.md`. Quello che mancava era
la prova. Un rischio scritto è un'opinione finché qualcuno non lo misura, e
un'opinione non decide niente — per questo qui sotto ci sono le risposte
dell'emulatore invece del ragionamento sulle regole.*

Sono stati misurati con una sonda scritta apposta: un'organizzazione con
l'abbonamento **solo a Scudo**, e un utente che è **membro semplice** (non
proprietario, non amministratore). Ecco cosa ha risposto l'emulatore:

```
Cosa può fare oggi un MEMBRO SEMPLICE di un'organizzazione
che ha l'abbonamento SOLO a Scudo:

  PERMESSO  legge i fronti di TERRA (app non abbonata)
  PERMESSO  SCRIVE nei fronti di TERRA (app non abbonata)
  PERMESSO  legge una FATTURA di Conti (app non abbonata)
  PERMESSO  MODIFICA il totale di una fattura
  PERMESSO  CANCELLA una fattura
```

### Buco 1 — l'abbonamento non chiude niente

`firestore.rules`, riga 89: `match /apps/{appId}/{document=**}` apre in lettura e
scrittura a **qualunque membro dell'organizzazione**, senza mai guardare
`entitlements/{appId}`. L'abbonamento c'è, si legge, si scrive solo dal backend —
ma **nessuno lo consulta** quando si accede ai dati.

Oggi non fa danno perché è l'interfaccia a non mostrare le app non comprate. Ma
l'interfaccia non è una barriera: basta cambiare `appId` nell'indirizzo, ed è
esattamente il gesto che le app fanno ormai da sole. **Il ponte Campo → Terra
apre una seconda istanza dell'SDK su `appId: "terra"`** (`campo-data.js`,
`api.frontiTerra`) — legittimo — ma da fuori un accesso legittimo e uno abusivo
sono identici, e le regole non sanno distinguerli.

Gravità: **media**. Non è una fuga di dati verso un concorrente; è un abbonamento
che non si fa rispettare.

### Buco 2 — dentro l'azienda sono tutti amministratori

Stesso punto delle regole: `memberOf(orgId)` e basta. Il ruolo (`owner`, `admin`,
`member`) conta per i metadati dell'organizzazione, per i membri e per gli
inviti — ma **non conta per i dati delle app**. Un operatore invitato per
compilare i rapportini può cancellare le fatture, modificare i registri di
sicurezza, cambiare i volumi dichiarati.

Il file lo sa: al commento della riga 83 c'è scritto *«le singole app potranno
raffinare i permessi per ruolo (appRoles) con match più specifici sopra
questa»*. È un lavoro dichiarato e mai fatto.

Gravità: **alta per un prodotto che si vende a più utenti della stessa azienda**,
bassa finché ogni cliente ha un utente solo. La differenza la fa il momento in
cui si vende, non il codice.

## Due cose da tenere d'occhio, senza allarmismo

1. **Il tenant della dimostrazione è leggibile da chiunque abbia fatto accesso**,
   anche in forma anonima (riga 92, `isDemoOrg`). È voluto — serve al tour — e le
   scritture sono bloccate. La conseguenza va però messa nero su bianco:
   **in `org_demo` non deve finire mai nessun dato di un cliente vero.** Oggi non
   c'è nessun controllo che lo impedisca: è una regola di condotta.
2. **Nessun limite alla dimensione o alla forma di quello che si scrive.** Un
   membro può riempire una collezione di documenti enormi. Non è un problema di
   riservatezza, è un problema di conto da pagare a fine mese.

## Cosa si propone, e cosa costa

**Proposta A — l'abbonamento diventa una barriera.** Nelle regole si legge
`entitlements/{appId}` prima di aprire i dati di quell'app:

```
function abbonata(orgId, appId) {
  return get(/databases/$(database)/documents/organizations/$(orgId)/entitlements/$(appId)).data.active == true;
}
```

Va pesata una cosa: ogni `get()` dentro le regole **si paga come una lettura** e
rallenta ogni accesso. Il modo economico è portare gli abbonamenti nei *custom
claims* (li scrive già la Cloud Function che scrive i ruoli), così la regola
legge un claim invece di un documento: costo zero e nessuna lettura in più. Va
però gestita la scadenza dei claims quando un abbonamento cambia.

**Proposta B — i ruoli contano anche dentro le app.** Il minimo utile, senza
inventare un sistema di permessi: **cancellare** e **modificare quello che è già
stato emesso** (una fattura, un documento consegnato all'ente) resta agli
amministratori; scrivere cose nuove resta a tutti. Sono due righe di regole per
le collezioni che contano, non un impianto.

**Entrambe vanno con le loro prove**, scritte prima delle regole e viste fallire:
per ogni buco, un test che oggi dice «PERMESSO» e che dopo deve dire «negato». È
il modo in cui in questo progetto si è già scoperto due volte che un controllo
non guardava dove credeva.

## Le tre domande per il fondatore

1. **L'abbonamento deve essere una barriera vera** (un cliente con solo Campo non
   può toccare i dati di Terra nemmeno volendo), o basta che l'interfaccia non
   mostri le app non comprate? La prima è più corretta e costa un lavoro di
   mezza giornata sui claims.
2. **Dentro l'azienda, chi può cancellare?** Oggi tutti. La proposta è: cancellare
   e correggere un documento già emesso solo a chi amministra. Serve la tua
   parola su dove passa la riga, perché è una scelta di prodotto, non tecnica.
3. Quando si va in vendita, **un cliente avrà un utente solo o più utenti?** Se
   più utenti, il punto 2 va chiuso prima del primo cliente, non dopo.

Finché non rispondi, `firestore.rules` resta com'è: nessuna di queste proposte è
stata applicata, e le 58 prove esistenti continuano a passare.
