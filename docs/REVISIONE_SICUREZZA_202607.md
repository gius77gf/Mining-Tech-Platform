# Revisione di sicurezza — 30 luglio 2026

*Roadmap, blocco 5, punto Q3. Non è una lettura del codice: ogni cosa scritta
qui è stata **chiesta all'emulatore Firestore** e la risposta è riportata
com'è arrivata. Le proposte in fondo, alla data del 30/07, **non erano state
applicate**: cambiare le regole cambia cosa i clienti possono fare, ed è una
decisione del fondatore.*

*⛔ **AGGIORNAMENTO 15/09 — VERDETTO PARZIALMENTE FALSO, NON SOLO SCADUTO.** La
Proposta B qui sotto **è stata applicata** (decisione del fondatore 10b,
07/08, `firestore.rules:128-138`, funzione `documentoEmesso`), ma questo
documento non è mai stato riletto dopo. Chi lo apre oggi per decidere legge un
quadro sbagliato in due direzioni: crede ancora vero che "dentro l'azienda
chiunque può cancellare/modificare tutto" (non lo è più per fatture, note e
documenti Scudo), e non legge da nessuna parte che **il resto — tutte le
altre collezioni di tutte le app — è rimasto esattamente come descritto qui**,
completamente aperto a qualunque membro. Riverificato oggi, di persona,
rilanciando lo stesso comando dei righi sotto:
```
cd apps/deepwork-id && npx --yes firebase-tools@13 emulators:exec \
  --only firestore --project demo-deepwork "node tests/sonda-permessi.mjs"
  →   PERMESSO  legge i fronti di TERRA (app non abbonata)
      PERMESSO  SCRIVE nei fronti di TERRA (app non abbonata)
      PERMESSO  legge una FATTURA di Conti (app non abbonata)
      negato    MODIFICA il totale di una fattura      ← era PERMESSO il 30/07
      negato    CANCELLA una fattura                   ← era PERMESSO il 30/07
      PERMESSO  legge l'abbonamento (per sapere cosa mostrare)
```
Buco 1 (l'abbonamento non è una barriera) è **ancora tutto vero**, verificato
nello stesso rilancio. Il perimetro reale di `documentoEmesso` oggi è **tre**
collezioni su decine (`conti/fatture`, `conti/note`, `scudo/documenti`): un
elenco corto e volontario per scelta di CLAUDE.md, non un impianto generale —
non leggere il resto di questo documento come se il buco 2 fosse chiuso.*

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

*(⛔ **chiuso solo in parte, 07/08 → vedi l'aggiornamento 15/09 in cima al
documento**: quanto segue descriveva TUTTE le collezioni di TUTTE le app al
30/07. Oggi resta vero per tutto tranne `conti/fatture`, `conti/note` e
`scudo/documenti`.)*

Stesso punto delle regole: `memberOf(orgId)` e basta. Il ruolo (`owner`, `admin`,
`member`) conta per i metadati dell'organizzazione, per i membri e per gli
inviti — ma **non conta per i dati delle app**. Un operatore invitato per
compilare i rapportini può cancellare le fatture, modificare i registri di
sicurezza, cambiare i volumi dichiarati.

Il file lo sa: al commento della riga 83 c'è scritto *«le singole app potranno
raffinare i permessi per ruolo (appRoles) con match più specifici sopra
questa»*. È un lavoro dichiarato e mai fatto **per intero**: dal 07/08 esiste
`documentoEmesso`, ma copre solo le tre collezioni sopra — un elenco corto e
volontario (CLAUDE.md), non il sistema di ruoli per app (`appRoles`) di cui
parla il commento, che infatti ancora non esiste (`grep -rn "appRoles"
apps/deepwork-id/firestore.rules` → una sola riga, il commento stesso).

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

✅ **APPLICATA il 07/08** (decisione 10b, `firestore.rules:128-138`, funzione
`documentoEmesso`) per `conti/fatture`, `conti/note`, `scudo/documenti` —
verificato di nuovo il 15/09 (vedi l'aggiornamento in cima al documento).
Resta un elenco corto e volontario, non estesa a tutte le collezioni: la
Proposta A (l'abbonamento) resta interamente da fare.

**Entrambe vanno con le loro prove**, scritte prima delle regole e viste fallire:
per ogni buco, un test che oggi dice «PERMESSO» e che dopo deve dire «negato». È
il modo in cui in questo progetto si è già scoperto due volte che un controllo
non guardava dove credeva.

## Le tre domande per il fondatore

1. **L'abbonamento deve essere una barriera vera** (un cliente con solo Campo non
   può toccare i dati di Terra nemmeno volendo), o basta che l'interfaccia non
   mostri le app non comprate? La prima è più corretta e costa un lavoro di
   mezza giornata sui claims.
2. **Dentro l'azienda, chi può cancellare?** *(risposta data il 07/08, decisione
   10b: solo chi amministra, per fatture, note e documenti Scudo — vedi Proposta
   B sopra.)* Resta aperta la stessa domanda per tutte le altre collezioni:
   pesate/DDT di Conti, scadenze e azioni di Scudo, tutto Campo/Flotta/
   Sentinella/Terra — oggi tutti i membri possono ancora cancellarle e
   modificarle, come descritto in "Buco 2".
3. Quando si va in vendita, **un cliente avrà un utente solo o più utenti?** Se
   più utenti, il punto 2 (per le collezioni ancora aperte) va chiuso prima del
   primo cliente, non dopo.

Alla data del 30/07 nessuna proposta era stata applicata e le 58 prove
esistenti continuavano a passare. Al 15/09 la Proposta B è applicata per tre
collezioni (91 prove sulle regole, tutte verdi) e la Proposta A resta intera
da fare — vedi l'aggiornamento in cima al documento.
