# Decisioni del fondatore — checklist per la revisione del weekend

Questo file è un **indice unico** delle decisioni che spettano a te
(Giuseppe) e che i cicli automatici NON prendono da soli. Ogni voce dice:
cosa è già pronto, quale decisione serve, e dove sono i passi di dettaglio.
Niente qui viene attivato senza una tua conferma esplicita in chat.

Spuntare `[ ]` → `[x]` quando la decisione è presa; poi il ciclo automatico
può procedere con l'attuazione.

---

## 1. Creazione del progetto Firebase nuovo
- **Stato**: guida pronta, niente creato.
- **Decisione che serve**: crei tu il progetto (serve un account Google) e
  incolli in chat la config web + confermi il piano.
- **Costo**: la parte usata (Auth + Firestore) parte **gratis** (piano
  Spark). Le Cloud Functions richiederebbero il piano Blaze — **rimandato**,
  non serve per il go-live.
- **Dettaglio passo-passo**: `apps/deepwork-id/GUIDA_FIREBASE.md`.
- **Dopo la creazione (lato Claude)**: `apps/deepwork-id/ATTIVAZIONE_LIVE.md`
  (config nell'SDK → regole di sicurezza → registrazione → bootstrap owner →
  verifica live).
- [ ] Deciso / fatto

## 2. Regole di sicurezza del progetto Firebase ESISTENTE
- **Stato**: sconosciute (non versionate). Rischio se sono permissive.
- **Decisione che serve**: apri la console del progetto esistente
  (`deepwork-app-6c56f`) → Firestore → Rules e incolli le regole attuali in
  chat, così le versioniamo e correggiamo.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 3.
- [ ] Fatto

## 3. Dati di default: reali o di fantasia?
- **Stato**: nel core `index.html` ci sono DEFAULT_CLIENTI / DEFAULT_CAVE /
  DEFAULT_USERS con nomi, telefoni, email, IBAN, coordinate realistici.
- **Decisione che serve**: sono dati **veri**? Se sì, vanno sostituiti con
  dati sintetici (sono pubblici su GitHub) e va valutata la rimozione dallo
  storico.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punti 1 e 2, `docs/CENSIMENTO_FEATURE.md`.
- [ ] Deciso (reali → bonificare / fantasia → ok lasciare)

## 4. Mitigazione password in chiaro
- **Stato**: preparata ma **NON attivata**. Nel core ci sono 7 utenti con
  password in chiaro nel sorgente pubblico.
- **Decisione che serve**: dai il via libera ad attivare la mitigazione
  ponte (verifica su Firestore con hash+salt, niente fallback in chiaro) e
  a **ruotare tutte le password** attuali.
- **Dettaglio**: `docs/MITIGAZIONE_PASSWORD.md` (già con passi operativi e
  bozza di seeding).
- [ ] Via libera

## 5. Gestione errori delle scritture live (scelta di STILE)
- **Stato**: i gestori delle app fanno `await db.xxx()` senza try/catch. In
  demo non fallisce mai; in live un errore Firestore (rete, permessi, quota)
  fallirebbe in silenzio, senza avviso all'utente.
- **Decisione che serve**: come mostrare l'errore all'utente? È una scelta di
  stile (es. riusare il `.note` di esito già presente in ogni form con un
  messaggio rosso "Operazione non riuscita, riprova"). Una volta scelto lo
  stile, l'implementazione è meccanica e sicura.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 12.

**Misurato il 01/08 — due fatti che la decisione non aveva:**

1. **Le app non si accorgono di essere offline: zero su sei.** Nessuna delle sei
   guarda `navigator.onLine` né ascolta gli eventi `online`/`offline` (il core
   sì, in due punti). E l'assenza di segnale in cava non è un caso di scuola: è
   il modo in cui una scrittura fallirà **più spesso** di tutti. Oggi il turno
   scrive il rapportino, tocca «Crea bozza», e non ha modo di sapere che non è
   partito.
2. **La persistenza offline di Firestore NON è configurata** (nessun
   `enableIndexedDbPersistence` né `persistentLocalCache` in tutto il progetto).
   È importante perché la ricerca sul valore dà per scontato il contrario —
   scrive che con la persistenza offline «è letteralmente quello che succede».
   **Da noi oggi non succede.** Se si scrivesse all'utente «l'ho tenuto e lo
   salvo appena torna la linea» sarebbe una promessa **falsa**, ed è la peggior
   categoria di messaggio: quello che rassicura a vuoto.

La superficie interessata sono **203 chiamate `await db.`** nelle sei app.
*(Quante siano già protette non lo dico: il conto dei `try/catch` non lo
distingue, perché nelle stesse pagine ci sono catch per la clipboard e per la
lettura dei file. Serve una scansione vera, e la farò quando la decisione sarà
presa — misurare bene una cosa che poi non si tocca è lavoro sprecato.)*

**Quindi le domande diventano due, e la seconda è nuova:**
- (a) **come** si avvisa che il salvataggio non è riuscito (stile del messaggio);
- (b) se vogliamo la **persistenza offline** di Firestore. Non è gratis in senso
  tecnico: mette una copia dei dati dell'organizzazione **nel browser del
  dispositivo**, e su un telefono di cantiere condiviso è una scelta che tocca
  l'isolamento fra clienti — quindi la porto a te invece di prenderla io.

- [ ] (a) Stile del messaggio deciso
- [ ] (b) Persistenza offline: sì o no

## 6. Genesi — sblocco delle funzioni sulla geometria del fronte
- **Stato**: hai indicato la direzione ("raggiungere il livello dei
  concorrenti"). Fatte le funzioni sicure lato browser: **riconciliazione**
  previsto-vs-reale, **signature-hole** (vibrazioni dall'onda reale) ed
  **export del piano di innesco** (XML IREDES-like). Dettaglio in
  `docs/GENESI_NUOVE_FUNZIONI.md` e `docs/GENESI_ROADMAP_COMPETITOR.md`.
- **Decisione che serve**: due funzioni potenti restano **rimandate di
  proposito** perché toccano la geometria del fronte e un avviso di flyrock
  sbagliato sarebbe **pericoloso per il fochino**:
  1. **Burden reale per foro** dal 3D del fronte (P1.1);
  2. **Import della deviazione dei fori** (boretrack, P1.2).
  Per procedere in sicurezza serve che tu confermi **come va letta la
  deviazione del fronte** (il segno: sporgenza in avanti = burden minore o
  maggiore?), idealmente con un caso reale della tua cava da verificare.
- **Il motore fisico** NON si tocca senza tua indicazione.
- **Dettaglio**: `apps/genesi/PIANO_3D.md`, `docs/GENESI_ROADMAP_COMPETITOR.md` (P1).
- [ ] Confermata la geometria del fronte (per sbloccare P1.1/P1.2)

## 7. Drone → Genesi: prova del weekend (priorità ATTUALE)
- **Stato**: il visore nuvola `apps/genesi/nuvola-poc.html` è **pronto per la
  prova**. Legge la nuvola nei formati che ODM produce davvero (**LAS** 1.2/1.4,
  PLY, XYZ) e la mesh (OBJ/GLB), la ritaglia coi cursori isolando il fronte,
  **conta i punti** nel ritaglio (per capire se hai catturato la faccia) ed
  esporta il fronte in `.xyz`. Il metodo del passo successivo è scritto in
  `vault/PASSO3_FRONTE_METODO.md`.
- **Decisione/azione che serve**: nel weekend **provi il flusso col tuo DJI Mini**
  (foto → ODM → carichi il `.las` nel visore → ritagli → esporti) e mi dici com'è
  andata. Con quel dato reale costruisco il **passo 3** (aggancio del fronte alla
  simulazione della volata) sulla forma vera, non a indovinare.
- **Dettaglio passo-passo**: `docs/DEEPWORK_DRONE_FLUSSO.md` (sezione "Prova pratica
  del weekend").
- [ ] Provato il flusso col dato reale (per sbloccare il passo 3)

## 8. Scelte di prodotto sulle app verticali (da ricerca competitor)
- **Stato**: due ricerche oneste hanno individuato i passi a maggior valore,
  fattibili nel browser, ma che **toccano il modello dati** (quindi in attesa di te):
  1. **Scudo** — *loop azione correttiva*: a un near-miss/infortunio si aggancia
     un'azione (cosa fare, responsabile, scadenza) che entra nelle scadenze/promemoria
     già esistenti (`docs/SCUDO_HSE_ROADMAP.md`).
  2. **Flotta** — *ordine di lavoro*: legare una manutenzione ai ricambi consumati
     + ore, così il magazzino si aggiorna dall'evento (`docs/FLOTTA_MANUTENZIONE_ROADMAP.md`).
- **Decisione che serve**: quale (se una) vuoi che costruisca. Sono proposte, non
  attivate.
- [ ] Scelta la prossima feature app (o "nessuna per ora")

## 9. Scienza in Genesi: correzione della curva dei limiti di vibrazione
- **Stato**: su tua direttiva ("fondiamo Genesi sulla scienza") ho verificato i
  modelli sulle fonti. Buone notizie: vibrazioni e flyrock di Genesi **combaciano
  con la letteratura** (formule, coefficienti nei range pubblicati, tetto di
  Lundborg esatto). Trovata UNA correzione da fare: i limiti USBM di Genesi, sotto
  le frequenze molto basse (~4 Hz), sono **meno prudenti** della curva ufficiale
  USBM (e tra 15–40 Hz più severi del necessario). La correzione esatta, con la
  fonte, è pronta in `docs/GENESI_FONTI_SCIENTIFICHE.md` (sezione 4).
- **Decisione che serve**: via libera ad applicare le curve esatte al posto dei
  gradini semplificati (tocca soglie di SICUREZZA → per regola non lo faccio da
  solo). Vale per ENTRAMBI i rami: la curva **USBM** (sotto ~4 Hz siamo meno
  prudenti) e le rampe **DIN 4150-3** (la norma interpola linearmente: a 20 Hz
  residenziale concediamo 15 mm/s dove la norma interpolata dà ~7,5). Modifica
  piccola, più prudente dove conta, con fonti citate (sez. 4 e 4-bis del doc).
- [ ] Via libera alle curve esatte (USBM + DIN) in ppvLimit

---

## 10. Sicurezza dentro l'azienda — l'abbonamento e chi può cancellare
*(nuova, 30/07 · dettaglio in `docs/REVISIONE_SICUREZZA_202607.md`)*

Misurato con l'emulatore, non dedotto. Il muro fra **aziende concorrenti tiene
ed è provato** (58 test). Dentro la stessa azienda, invece, non c'è ancora
nessuna separazione: chi è stato invitato per compilare i rapportini può anche
**cancellare una fattura**, e un cliente abbonato solo a un'app può leggere e
scrivere i dati di tutte le altre.

- [ ] **10a.** L'abbonamento dev'essere una **barriera vera** (chi ha solo Campo
      non tocca i dati di Terra nemmeno volendo), oppure basta che l'interfaccia
      non mostri le app non comprate? La prima è più corretta e costa mezza
      giornata di lavoro sui claims.
- [ ] **10b.** **Chi può cancellare**, dentro l'azienda? La proposta minima:
      cancellare e correggere un documento **già emesso** (una fattura, un
      documento consegnato all'ente) solo a chi amministra; scrivere cose nuove
      resta a tutti.
- [ ] **10c.** Al primo cliente, **un utente solo o più utenti?** Se più utenti,
      la 10b va chiusa **prima** del primo cliente, non dopo.

Finché non rispondi, `firestore.rules` resta com'è e le 58 prove continuano a
passare.

## 11. Perché esistono sia Deepwork sia Genesi
*(nuova, 30/07 · dettaglio in `docs/PERCHE_DEEPWORK_E_GENESI.md`)*

Alla presentazione arriverà: «ma la volata non la fa già Deepwork?». La risposta
proposta è che Deepwork è il **diario** (registra quello che è stato fatto) e
Genesi il **tavolo da disegno** (progetta quello che si farà). Il documento
elenca anche le tre sovrapposizioni vere.

- [ ] **11a.** Confermi la divisione «diario / tavolo da disegno»? È la frase che
      finisce nel materiale di presentazione e nei testi delle due app.
- [ ] **11b.** Delle tre sovrapposizioni (due motori 3D, la maglia salvata in due
      formati, la parola «volata» che significa due cose), **quali chiudiamo e in
      che ordine?**
- [ ] **11c.** Alla presentazione le mostriamo come **due app distinte** o come
      **una app con due modi?** Cambia il racconto, non il codice.

⚠️ Nella vetrina la divisione **non è stata data per presa**: la scheda del core
descrive quello che il core contiene, senza pronunciarsi. Aspetta la tua parola.

## 12. Il cliente ha una copia di sicurezza solo di metà dei suoi dati
*(nuova, 31/07 · misurato, dettaglio in `docs/ONBOARDING_DATI.md`)*

Ogni app scarica dei CSV, e questo faceva credere — anche a me, e lo diceva il
documento — che ci fosse un backup di tutto. **Misurato: non è così.** I file
che si **ri-caricano** davvero sono **sette**, e sono stati provati uno per uno
mandandoli dentro l'app: squadre (Campo), gare e listino (Conti), magazzino
ricambi (Flotta), anagrafica lavoratori e registro infortuni (Scudo), ricettori
(Sentinella).

Tutti gli altri sono **prospetti**: hanno colonne calcolate (stato, residuo,
giorni di pagamento) e servono al commercialista o all'ente. Non si ri-caricano,
e va benissimo che sia così — quello che non va è **crederli un backup**.

Restano quindi **senza nessun file che si ri-carica** proprio le cose che una
cava non può riscrivere a mano:

| Cosa | Dove | Perché fa male perderla |
|---|---|---|
| **pesate e DDT** | Conti | è il documento di consegna: mesi di lavoro, e sono la base delle fatture |
| **incassi** (prima nota) | Conti | date e importi veri dei pagamenti ricevuti |
| **clienti** | Conti | anagrafica con partita IVA, PEC/SDI, fido |
| **azioni correttive** | Scudo | registro che un ispettore può chiedere |
| **rilievi drone** | Terra | volumi che consumano la concessione |
| **registro volate** | Sentinella | documento regolatorio |

- [ ] **12a.** Vuoi che i cicli automatici costruiscano l'export ri-caricabile
      per queste sei? È lavoro fattibile e senza rischio (nessun dato nuovo:
      solo un secondo file, nel formato dell'import), ma **sono sei unità** e
      tolgono tempo ad altro. Se sì, **con quale ordine di priorità?**
- [ ] **12b.** In alternativa, prima del pilota basta **dirlo in chiaro** al
      cliente («la copia di sicurezza copre questo, non quest'altro»)? È già
      scritto nel documento di onboarding, ma è una scelta commerciale: la
      dico io o la dici tu?

⚠️ Nel frattempo **nessuna promessa falsa resta scritta**: la frase del
documento che diceva «ogni import ha accanto un export ri-caricabile» è stata
corretta, e sette controlli automatici tengono fermi i sette che lo sono
davvero — se domani uno di loro smettesse di ri-caricarsi, se ne accorge la
suite e non il cliente.

## Cosa procede intanto SENZA di te
I cicli automatici continuano su ciò che è sicuro e non gated: seconde
iterazioni UX delle app, test aggiuntivi, revisioni di qualità/sicurezza,
ricerca competitor (repo `ecosistema-vault`). **Fatto nei cicli recenti** (tutto
verificato, niente di gated): ricerca+conteggio su TUTTE le liste delle 6 app,
**modifica in-place** dei record (prima solo aggiungi/elimina), export CSV completo,
e l'irrobustimento del visore drone (LAS, conteggio ritaglio). Le voci numerate qui
sopra restano in attesa finché non le sblocchi in conversazione.

**Fatto nella settimana del 27–30/07**, sempre senza toccare niente di gated: la
**vetrina dell'ecosistema** (`/apps/`, nove riquadri con la schermata vera di
ogni strumento), i **grafici** in tutte le app da un motore scritto in casa,
**sei ponti** veri fra le app, l'**estetica unificata**, e le convenzioni
condivise su numeri, unità di misura e soldi. Le prove automatiche sono passate
a **662** *(ricontate il 31/07)*, più **106** che girano con l'emulatore
Firestore (58 sulle regole di sicurezza, 19 sull'SDK, 21 sulle funzioni, 8 sul
primo avvio) e **13** banchi che aprono davvero le pagine in un browser.
