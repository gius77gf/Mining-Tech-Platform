# Decisioni del fondatore — checklist per la revisione del weekend

Questo file è un **indice unico** delle decisioni che spettano a te
(Giuseppe) e che i cicli automatici NON prendono da soli. Ogni voce dice:
cosa è già pronto, quale decisione serve, e dove sono i passi di dettaglio.
Niente qui viene attivato senza una tua conferma esplicita in chat.

Spuntare `[ ]` → `[x]` quando la decisione è presa; poi il ciclo automatico
può procedere con l'attuazione.

---

## 🟡 19/09 — La barra di navigazione in basso: sotto i 44 px di larghezza su tre app, sotto i 60 in tutte tranne il core

*Dalla seconda iterazione UX/estetica su Scudo, misurato con
`getBoundingClientRect()` sul renderizzato (non dedotto dal CSS) e
riverificato indipendentemente prima di scrivere questa voce, con lo
stesso strumento, su Conti e Flotta.*

- [ ] **40. `.nav` (`shared/dw-app-ui.css:641`) garantisce un'altezza minima
  ai bottoni della barra in basso (`min-height:var(--tap)`, 44px normale/
  60px nel tema del sole — "con i guanti si colpisce largo, come nel
  core") ma NESSUNA larghezza minima: `grid-template-columns:repeat(var(
  --nav-cols),1fr)` divide la pillola (max 520px, `calc(100% - 16px)`
  sotto) in parti uguali qualunque sia `--nav-cols`. Il core ha 4 voci
  fisse e non tocca mai la soglia (misurato: 75,5px a 320px, 103px a
  430px). Le app sono cresciute oltre le 4 voci e la barra si è stretta
  con loro, in silenzio — nessun errore, nessuna prova rossa, nessuno
  scorrimento a indicarlo.
  **Misurato @320px** (`getBoundingClientRect` su ogni `.nav button`,
  tre app, tema scuro): **Conti** (`--nav-cols:10`) — 10 bottoni, tutti a
  **31,0px**, il 30% del minimo AA per i bersagli di tocco; **Scudo**
  (`--nav-cols:8`) — 8 bottoni fra **37,6 e 42,7px**, sempre sotto 44;
  **Flotta** (`--nav-cols:6`) — fra **48,1 e 58,3px**: sopra i 44 normali,
  ma sotto i **60px** che il tema del sole richiede a query, quindi
  **nessuna delle sei app** rispetta il proprio stesso standard "guanti"
  in outdoor mode, non solo Scudo/Conti. Sentinella e Terra hanno la
  stessa `--nav-cols:6` di Flotta e quindi la stessa larghezza; Campo
  (`--nav-cols:5`, ~60px @320) è l'unica app sopra soglia anche nel sole.
  **Perché serve una decisione, non un'unità automatica**: la cura tocca
  un componente CONDIVISO (`shared/dw-app-ui.css`, "si serializza solo
  ciò che tocca `shared/`") usato da tutte e sette le superfici, e non
  ha una risposta ovvia — introdurre lo scorrimento orizzontale in una
  barra in basso è un pattern che **non esiste altrove** nell'ecosistema
  (il core scorre le sue linguette `.atabs`, non la barra), va deciso col
  metodo del confronto affiancato e almeno tre iterazioni prima di essere
  chiamato buono, come vuole la direttiva sull'eccellenza.
  **Le strade**: (a) `grid-auto-flow:column; grid-auto-columns:minmax(
  var(--tap),1fr); overflow-x:auto` quando `--nav-cols` supera una soglia
  dichiarata (proposta della QA su Scudo) — barra scorrevole, mai sotto
  il minimo, ma introduce un pattern nuovo e un indizio di scorrimento
  (freccia? ombra sul bordo?) da disegnare; (b) consolidare le voci più
  numerose (Conti 10, Scudo 8) in meno sezioni con sotto-menu, invece di
  allargare il componente — costo più alto, ma niente scorrimento nuovo;
  (c) accettare la larghezza ridotta sotto i 44/60px come compromesso
  dichiarato per le app con più di N voci, documentandolo invece di
  correggerlo. Nessuna proposta implementata: cambia la struttura
  condivisa di ogni app, e la direttiva sullo stile la vuole "pelo per
  pelo" identica finché qualcuno non decide altrimenti.

---

## 🟡 19/09 — Deepwork ID: nessun audit log sulle azioni sensibili di organizzazione (cambio ruolo, rimozione membro)

*Dalla ricerca continua su Deepwork ID (`docs/RICERCA_CONTINUA_DEEPWORKID.md`,
19/09), confrontata con l'audit trail di Slack (2 anni, admin-only),
Linear (90 giorni, owner-only), Notion (indefinito, owner-only) e Auth0
(append-only, retention estesa sugli eventi sensibili — tutte fonti di
seconda mano, WebSearch). Collegata alla decisione 37 (token che resta
valido fino a un'ora dopo la revoca): se un ex membro con token ancora
valido rimuove qualcuno o cambia un ruolo in quella finestra, oggi non
resta traccia di chi l'ha fatto né di quando.*

- [ ] **39. Nessuna collezione di audit log, e le due funzioni più sensibili
  non registrano nemmeno chi ha agito.** Verificato su
  `apps/deepwork-id/functions/index.js`:
  `grep -n "auditLog\|audit_log\|logAzione"` → **0** risultati in tutto il
  file: nessuna collezione tipo `organizations/{orgId}/auditLog` esiste.
  `updateMemberRole` (riga 233) fa `tx.update(memRef, { role })` e basta —
  nessun `changedBy`/`from`/`to`; `removeMember` (riga 264) fa
  `tx.delete(memRef)` e basta — nessun `removedBy`. Il confronto:
  `grep -c "createdBy\|changedBy\|actedBy\|removedBy\|modifiedBy"` sull'intero
  file → **0**. L'unica funzione che registra chi ha agito è `inviteMember`
  (`invitedBy`) e `revokeInvite` (`revokedBy`) — le due più recenti, non le
  altre.
  **Perché serve una decisione, non un'unità automatica**: un audit log
  tocca com'è strutturato il dato (una collezione nuova, per sempre, in
  ogni organizzazione), la sua visibilità (chi lo legge: solo owner? anche
  admin?) e la sua conservazione (90 giorni come Linear? 2 anni come Slack?
  indefinito come Notion?) — tre scelte di prodotto, nessuna deducibile dal
  codice.
  **Le strade**: (a) collezione append-only
  `organizations/{orgId}/auditLog/{id}` con `{actor, azione, bersaglio,
  prima, dopo, quando}`, scritta dalla stessa Cloud Function che fa
  l'azione — costo medio-alto (tocca `updateMemberRole`/`removeMember`/
  `createOrganization` e serve una policy di lettura/retention); (b) solo
  sulle due funzioni più sensibili (cambio ruolo, rimozione), rimandando le
  altre — costo medio, copre il caso peggiore (isolamento fra organizzazioni
  concorrenti) senza disegnare tutto il sistema subito; (c) rimandare
  finché non c'è un caso reale che lo richieda (un cliente che contesta
  un'azione), registrando solo la mancanza. Nessuna proposta implementata:
  la scelta di che cosa tracciare, chi legge e per quanto tempo è del
  fondatore.

---

## 🟡 19/09 — Scudo: la formazione scaduta non blocca un turno, e la perdita di idoneità DURANTE un turno non avvisa nessuno

*Dalla ricerca continua su Scudo (`docs/RICERCA_CONTINUA_SCUDO.md`, 19/09),
confrontata con le best practice EHS (SafetyCulture, Intelex, Cority,
FileFlo, Enablon — di seconda mano, WebSearch) e col D.Lgs 81/08. Non è un
difetto: Scudo traccia già `idoneita` e le scadenze di formazione, e le
mostra correttamente a schermo, nel Quadro e nei documenti che escono
(decisione 17 e i fix di oggi su `prognosiAperta`/`riepilogoInfortuni`).
La domanda è se debba fare qualcosa di PIÙ — bloccare, o avvisare in tempo
reale — che oggi non fa per scelta implicita, non per un bug.*

- [ ] **38. Due mancanze collegate, entrambe verificate col codice, nessuna
  delle due implementata**: (1) **nessun blocco operazionale** — un
  lavoratore con formazione/idoneità scaduta può comunque essere assegnato
  a un turno o a una mansione: Scudo lo segnala (badge, riepilogo, Quadro)
  ma non impedisce nulla, e non esiste un campo tipo `richiedeFormazione`/
  `bloccoOperazione` sul modello mansioni/turni; (2) **nessun avviso in
  tempo reale** — se un'idoneità scade DURANTE un turno già in corso (es.
  alle 14:00 su un turno che finisce alle 18:00), nessuno riceve un avviso:
  la scadenza si vede solo alla prossima apertura della pagina.
  **Perché serve una decisione, non un'unità automatica**: (1) è un
  cambiamento di comportamento del prodotto con implicazioni legali e
  operative dirette — impedire un'assegnazione è una scelta che tocca la
  responsabilità del datore di lavoro (D.Lgs 81/08, artt. 15/37), non un
  ritocco silenzioso; un blocco troppo rigido potrebbe anche impedire
  un'operazione realmente necessaria in un'emergenza. (2) un avviso in
  tempo reale su un turno in corso presuppone una decisione su COME
  avvisare (in-app? notifica push, non ancora costruita nell'ecosistema?)
  e chi lo riceve (il lavoratore, il preposto, entrambi).
  **Le strade**: (a) costruire il blocco come AVVISO rafforzato (impossibile
  confermare l'assegnazione senza un secondo tocco esplicito, ma non un
  divieto assoluto) — costo medio, nessun rischio di bloccare un'emergenza;
  (b) costruire un vero blocco (l'assegnazione non si salva) — costo medio,
  ma richiede una via di eccezione dichiarata per i casi limite; (c)
  lasciare solo la segnalazione attuale, e aggiungere semmai un contatore
  più visibile nel Quadro. Per l'avviso in tempo reale: (d) rimandarlo
  finché non esiste un canale di notifica push nell'ecosistema (nessuna
  app ce l'ha oggi); (e) costruire solo un ricalcolo più frequente dentro
  la pagina già aperta (nessun avviso fuori dall'app). Nessuna proposta è
  implementata: sono candidati da rimisurare col codice in mano, non presi
  sulla parola della ricerca.

---

## 🟡 17/09 — Deepwork ID: un membro rimosso o declassato resta operativo fino a un'ora, e lo stato "disabled" dichiarato non lo scrive nessuna funzione

*Dalla ricerca continua su Deepwork ID (`docs/RICERCA_CONTINUA_DEEPWORKID.md`,
17/09), su un angolo non ancora guardato dalle ricerche precedenti (quelle
sui ruoli/RBAC e sull'export dati): che cosa succede al TOKEN già in mano a
un membro quando gli si toglie l'accesso, non a chi glielo assegna. Il
requisito fondante di questo repository — l'isolamento totale fra
organizzazioni CONCORRENTI — dipende anche da questo, non solo dalle regole
Firestore.*

- [ ] **37. Un membro rimosso o declassato di ruolo mantiene un token Firebase
  valido con i permessi VECCHI fino a un'ora.** `removeMember`
  (`apps/deepwork-id/functions/index.js:206`) e `updateMemberRole`
  (`apps/deepwork-id/functions/index.js:182`) chiamano entrambe solo
  `rebuildClaims` (riga 222 e 202), che riscrive i custom claims
  dell'utente — ma i custom claims sono **stateless lato token**: un token
  già emesso resta valido fino alla sua scadenza naturale (fino a un'ora)
  a meno di chiamare esplicitamente `revokeRefreshTokens()`. Nessuna delle
  due funzioni la chiama
  (`grep -n "revokeRefreshTokens" apps/deepwork-id/functions/index.js` →
  nessun risultato), e `firestore.rules` non ha un controllo di freschezza
  sul token (`auth_time`/`iat` contro un `revokedAt`): solo il claim. Un ex
  membro con un token ancora valido continua a vedere/scrivere per fino a
  un'ora dopo essere stato rimosso da un'organizzazione i cui dati — per la
  natura di questo prodotto — possono essere quelli di un'azienda
  concorrente della sua nuova.
  **Secondo problema collegato**: lo stato `disabled` è nello schema
  dichiarato (`apps/deepwork-id/ARCHITETTURA.md:47`, `status: active |
  invited | disabled`) e ha già l'etichetta pronta in `admin.html`, ma
  nessuna funzione lo scrive — sui 7 export di
  `apps/deepwork-id/functions/index.js` zero si chiamano `disableMember` o
  `setMemberStatus`
  (`grep -n "disableMember\|setMemberStatus" apps/deepwork-id/functions/index.js`
  → nessun risultato). L'unico modo di togliere l'accesso oggi è
  `removeMember`, che CANCELLA il documento di membership: non esiste una
  sospensione reversibile (utile per un dipendente in malattia/permesso,
  senza perdere lo storico di chi era e che ruolo aveva).
  **Perché serve una decisione e non una correzione automatica**: aggiungere
  `revokeRefreshTokens()` cambia un comportamento di sicurezza per TUTTE le
  app dell'ecosistema contemporaneamente (ogni sessione attiva di un membro
  rimosso o declassato verrebbe interrotta, forzando un nuovo login) — un
  cambiamento visibile all'utente che merita una conferma esplicita, non
  un ritocco silenzioso a codice che tocca l'isolamento multi-tenant.
  Costruire `disableMember` è invece una feature nuova (anche piccola), non
  un difetto da correggere.
  **Le strade**: (a) aggiungere `revokeRefreshTokens(uid)` sia a
  `removeMember` sia a `updateMemberRole` — chiude la finestra di un'ora,
  costo basso (poche righe), effetto collaterale onesto e visibile (logout
  forzato); (b) aggiungere anche `disableMember`/`setMemberStatus` per lo
  stato sospeso reversibile, riusando la stessa `rebuildClaims` +
  `revokeRefreshTokens`; (c) lasciare così finché non arriva un caso reale
  (un cliente che lamenta un ex dipendente ancora operativo), registrando
  solo la sovrapposizione. **La mia risposta, se non rispondi entro la
  settimana**: (a) e (b) insieme — sono la stessa causa (nessuna delle due
  funzioni chiude davvero l'accesso), il costo è basso, e la mancanza tocca
  esattamente la garanzia che il fondatore ha scritto come non negoziabile
  (isolamento fra organizzazioni concorrenti). Non lo costruisco da solo
  perché introduce un logout forzato visibile agli utenti, che merita una
  conferma prima di attivarlo su un prodotto già in mano a clienti.

  **✅ Aggiornamento 19/09 (quinta QA su Deepwork ID): la strada (a) è
  già stata costruita** — `revocaSessioni()` (`functions/index.js:219`)
  chiama `revokeRefreshTokens` ed è invocata sia da `updateMemberRole`
  (riga 258) sia da `removeMember` (riga 282), col commento del codice
  stesso che dichiara la causa e il limite. **⛔ Ma il limite dichiarato
  è stato RIPRODOTTO, non solo letto**: sotto l'emulatore, un admin
  rimosso ha continuato — con lo stesso token, mai rinfrescato — a
  leggere un documento riservato (200 OK) e a **cancellare una fattura
  "emessa"** (azione riservata ad admin/owner, `organizations/orgA/apps/
  conti/fatture/fatt1` → sparita) DOPO che `removeMember` aveva già
  cancellato la sua membership e chiamato `revokeRefreshTokens`. La causa
  è quella che il codice descrive: `revokeRefreshTokens` blocca solo il
  PROSSIMO refresh, mai il token già firmato, e `firestore.rules` (righe
  21-32, `memberOf`/`isAdmin`/`isOwner`) legge solo il claim nel token,
  mai la membership viva su Firestore. Quindi la finestra di un'ora resta
  aperta anche dopo (a) — non è un difetto di (a), è il limite che (a)
  non poteva chiudere da solo, reso concreto da una SCRITTURA su una
  risorse admin-only invece che da un'ipotesi.
  **Nuova strada (d), per chiudere il residuo**: sui controlli più
  sensibili (update/delete su un documento emesso, update su
  `organizations/{orgId}`), sostituire la sola lettura del claim con un
  incrocio anche col documento di membership live (`get(...members/
  $(request.auth.uid)).data.status == 'active'`) — chiude l'accesso nello
  stesso istante in cui `removeMember` cancella la membership, invece che
  alla scadenza naturale del token. Costo: una lettura Firestore in più
  per ogni controllo su quelle regole (non su tutte: solo dove il rischio
  è più alto) — un compromesso latenza/costo contro sicurezza che (a) non
  aveva ancora richiesto e che va pesato dal fondatore, non deciso qui.

---

## 🟡 17/09 — Scudo↔Campo: le ore lavorate per gli indici infortunistici sono già misurate altrove, ma nessuno le collega

*Cercando una sovrapposizione nuova nella mappa ecosistema (`docs/
MAPPA_ECOSISTEMA.md` §3), dopo che il censimento del 16/09 si era dichiarato
esaustivo (§3h) guardando solo gli header dei moduli dati, non le funzioni
che consumano un dato altrove. La sovrapposizione trovata è reale su
entrambi i lati, verificata leggendo il codice — non è un bug, nessuno dei
due moduli mente su quello che fa — ed è un caso in cui costruire il ponte
comporta un rischio dichiarato dal codice stesso.*

- [ ] **35. Scudo↔Campo: le ore lavorate che servono a IF/IG/LTIFR sono già
  misurate da Campo, ma `oreAnno` resta manuale.** `indiciInfortunistici`
  (`apps/scudo/scudo-data.js:5316`) calcola i tre indici infortunistici che
  un'azienda **porta in gara** e confronta con la media di settore, dividendo
  per `oreAnno` — una collezione scritta **solo a mano**
  (`apps/scudo/scudo-data.js:433`). Il commento della funzione (righe
  5299-5312) rifiuta esplicitamente di stimarle dal numero di operatori,
  chiamando quel ripiego «un denominatore inventato… una dichiarazione falsa
  fatta con la faccia di un calcolo» — quindi oggi, senza compilazione manuale,
  i tre indici restano `calcolabile:false`. Campo intanto misura già le ore
  vere, per persona e per turno: la collezione `presenze` porta
  `entrata`/`uscita` («gli orari VERI della persona», distinti apposta da
  `ora`, che è solo l'istante in cui qualcuno ha spuntato la riga), e
  `orariPresenza` (`apps/campo/campo-data.js:1910`) le trasforma già in minuti
  lavorati con una bandiera `attendibile`. Nessuna funzione oggi le somma su
  un anno intero, e nessuno dei due moduli legge l'altro
  (`grep -n "oreAnno\|indiciInfortunistici\|oreLavorate" shared/dw-ponti.js
  apps/campo/campo-data.js` → nessun risultato). Dettaglio completo, con le
  citazioni di riga, in `docs/MAPPA_ECOSISTEMA.md` §3i.
  **Perché serve una decisione e non un ponte automatico**: le ore di Campo
  coprono solo chi timbra un turno lì — personale d'ufficio, part-time non
  in `presenze`, o una cava che non usa quella schermata resterebbero fuori.
  Sostituire in silenzio `oreAnno` con un numero di Campo che copre MENO
  della forza lavoro vera produrrebbe un indice sbagliato — più alto o più
  basso del vero a seconda di chi manca — esattamente il rischio che il
  commento di `indiciInfortunistici` vieta già per la stima "a mano".
  **Le strade**: (a) il ponte propone il totale di Campo come un valore
  **suggerito**, che l'organizzazione conferma o corregge prima che entri
  in `oreAnno` — mai una sostituzione silenziosa, con la copertura (quante
  persone/turni sono nel conto di Campo) dichiarata accanto al numero; (b) si
  costruisce solo per le organizzazioni che dichiarano di tracciare TUTTA la
  forza lavoro in Campo (una bandiera esplicita, non dedotta); (c) si lascia
  `oreAnno` manuale e si registra solo la sovrapposizione, senza costruire
  niente, finché non arriva un caso reale che la renda urgente. **La mia
  risposta, se non rispondi entro la settimana**: (a) — è il valore più alto
  (chiude un `calcolabile:false` che oggi lascia senza indici molte
  organizzazioni) al costo più basso (nessuna sostituzione automatica, la
  persona umana resta l'ultima parola su un numero che si porta in gara). Non
  la costruisco da solo perché tocca un indice di sicurezza che si confronta
  con la media di settore, e un ponte silenziosamente parziale sarebbe
  esattamente il denominatore inventato che il codice rifiuta già.

---

## 🟡 17/09 — Core: nessuna cava ha un obiettivo di produzione con cui confrontarsi

*Dalla ricerca continua sul cruscotto del titolare (`docs/RICERCA_CONTINUA_CORE.md`,
17/09). Le prime due proposte dello stesso giro di ricerca — il badge delle
notifiche che non contava le scadenze mezzi, e i mezzi da lavoro senza
indicatore di guasto — erano economiche (riusavano dati e pattern già scritti
altrove nel core) e sono già state costruite e verificate in questa stessa
sessione. Questa terza è diversa di natura: introduce un concetto che oggi
non esiste in nessuna collezione, e la ricerca stessa la marca "grande",
non un ritocco.*

- [ ] **36. Core: nessuna schermata può dire "la cava X è indietro rispetto al
  piano" — solo "ha prodotto meno delle altre".** La Dashboard
  (`renderDashboard`, `index.html:4050`) confronta le cave per volume
  prodotto (`quotaMc`), ma non esiste alcun concetto di obiettivo/target:
  `grep -n "obiettivo\|target\b\|previsto.*mese\|budget" index.html` → nessuna
  occorrenza legata alla produzione. Con tre cave attive, quella con meno
  output finisce in fondo alla lista — ma potrebbe essere la più piccola per
  progetto, non quella in difficoltà: nessun modo di distinguere i due casi
  dallo schermo. Confermato che il mondo (prodotti comparabili come Trimble
  Insight/InsightHQ — fonte di seconda mano, via WebSearch) tratta questo
  confronto pianificato-vs-reale come uno standard di un cruscotto multi-sito,
  non un dettaglio. **Perché serve una decisione e non un'unità automatica**:
  non è un problema di schermo, è un dato che oggi non esiste — chi decide
  l'obiettivo mensile di una cava, oggi, fuori dal prodotto (a voce, su un
  foglio, mai)? Se la risposta è "nessuno/informale", costruire il campo
  senza sapere chi lo compila produrrebbe una casella vuota che nessuno
  riempie mai, lo stesso numero tranquillo-per-assenza che questo repository
  vieta altrove. **Le strade**: (a) un campo semplice `obiettivoMc` per
  cava/mese, impostabile da admin/ufficio, confrontato col prodotto reale
  nella Dashboard esistente — minimo, ma richiede comunque che qualcuno lo
  compili ogni mese; (b) si aspetta un segnale da un cliente vero (chi
  imposta obiettivi oggi, e come) prima di disegnare il campo, per non
  inventare un processo che nella cava reale non esiste nella forma che
  immaginiamo; (c) si lascia il confronto solo per volume, dichiarando
  esplicitamente che "obiettivo di produzione" è fuori perimetro finché non
  arriva quel segnale. **La mia risposta, se non rispondi entro la
  settimana**: (b) — le prime due proposte di questo giro di ricerca erano a
  costo quasi zero perché riusavano ciò che il core aveva già; questa
  introduce un processo aziendale nuovo (chi fissa un target, con che
  cadenza, chi lo rivede) che nessun grep può scoprire da solo. Costruirla
  alla cieca rischia di produrre esattamente la casella vuota tranquillizzante
  che il principio del fondatore vieta.

---

## 🟡 17/09 — Campo: il rapportino non porta la fase dell'operazione né distingue sterile da commerciale

*Dal settimo giro di ricerca continua (`docs/RICERCA_CONTINUA_CAMPO.md`,
17/09), verificato sul codice vero prima di scrivere qui. Non è un difetto —
`csvStorico` fa esattamente quello che il suo nome promette — è un dato che
manca a monte, e serve una scelta sul vocabolario prima di poterlo scrivere.*

- [ ] **34. Campo: `rapportini` non ha un campo "fase dell'operazione" né
  distingue materiale sterile da materiale commerciale — la statistica
  mineraria annuale (verificata via WebSearch: modulo regionale, gemello
  della dichiarazione di esercizio ex artt. 24/28 DPR 128/1959, conferma
  incrociata ISTAT/UNMIG e Annuario ISPRA — **fonte di seconda mano**, non
  letta sul testo primario) chiede l'aggregazione PER FASE (rimozione
  sterile, estrazione+trasporto, frantumazione, squadratura, carico), non
  un totale unico.** Verificato su `apps/campo/campo-data.js`: ogni
  `rapportino` ha solo `{data, turno, titolo, squadra, prodQta, prodUnita,
  ora, stato, fronteId}` — `titolo` è un `<input>` di testo libero
  (`new-rap-titolo`, placeholder "Rapportino perforazione"); i titoli demo
  ("Rapportino trasporti/perforazione/impianto") *assomigliano* alle fasi
  del modulo ma non sono un vocabolario controllato (`grep -ciE
  "fase|categoriaProduzione|tipoOperazione"` → 0). L'unica aggregazione
  esistente, `csvStorico` (riga 846), somma per **unità di misura** (m³, t),
  non per fase. Nessuna distinzione materiale di copertura (non tariffato)
  vs materiale commerciale (`grep -ciE "sterile|copertura|scoperchi"` → 0).
  **Perché serve una decisione**: `rapportini` è il dato sorgente che almeno
  tre ponti leggono (Terra, Conti, la copertura di `csvStorico`), quindi un
  campo nuovo qui non è un dettaglio locale — cambia la forma di un dato
  condiviso. E il vocabolario delle fasi non è ovvio: le categorie del
  modulo regionale sono un punto di partenza di seconda mano, non
  necessariamente quello giusto per come si lavora in QUESTA cava. **Le
  strade**: (a) un campo `fase` a menu chiuso (4-5 voci, riusando lo schema
  di `csvStorico` per l'aggregazione) più un campo booleano/a menu per
  sterile/commerciale, nessuna nuova misura richiesta all'operatore; (b) si
  aspetta un rapportino di fine turno vero da una cava cliente prima di
  fissare il vocabolario, per non inventare categorie che poi vanno
  riscritte; (c) si lascia `titolo` libero e si aggiunge solo la
  distinzione sterile/commerciale, più semplice e meno ambigua, rimandando
  la fase a quando servirà davvero l'aggregazione regionale. **La mia
  risposta, se non rispondi entro la settimana**: (c) — la distinzione
  sterile/commerciale è un campo a basso rischio (booleano, nessuna
  categoria da indovinare) e già utile da sola per il costo di produzione;
  il campo fase aspetta un rapportino vero, perché un vocabolario sbagliato
  scritto nei dati oggi costerebbe una migrazione domani.

---

## 🟡 17/09 — Sentinella: un punto misurato "a mano" è conforme per il semaforo e "mai misurato" per il programma, sullo stesso punto

*Una passata in profondità su Sentinella (bottone per bottone, ogni scheda letta
dal vivo) ha trovato un solo difetto vero — già corretto in questa stessa
unità (una previsione con limite dichiarato ma norma non indicata taceva la
fonte mancante invece di dirla, in `fogliaVolata`) — e una seconda cosa che il
codice stesso segnala da tempo come rischio "latente" e che oggi si può
riprodurre sulla dimostrazione: non è un bug nel senso di "il codice fa quello
che non dovrebbe", è due funzioni che rispondono a due domande diverse sullo
stesso dato con nessuna delle due sbagliata, e la scelta di quale far vincere
tocca la conformità normativa.*

- [ ] **33. Sentinella: un valore scritto senza data conta come "misurato" per
  il conforme/superamento, ma resta "mai misurato" per lo scadenzario —
  sullo stesso punto.** `statoMisura` (`apps/sentinella/sentinella-data.js:362`)
  decide il semaforo di conformità (Conforme/Attenzione/Superamento) leggendo
  `mm.valore` **anche quando il punto non ha nessuna lettura datata in
  `letture[]`**: se c'è un numero dichiarato (`numeroDichiarato(mm.valore) !=
  null`) e la soglia è valida, il punto è giudicato — verde, giallo o rosso —
  senza che sia mai stato registrato UN giorno in cui quella misura è stata
  presa. `statoRigaProgramma` (riga 3834), che decide se una verifica è
  scaduta, guarda **solo** `ultimaLettura(monitoraggio)` (una lettura con data
  valida in `letture[]`) o il campo `dal`: senza uno dei due, dichiara "Mai
  misurato" a prescindere da `valore`.
  Il punto demo `a1` (`Acque — vasca decantazione`, riga 128: `valore: 12,
  soglia: 35`, nessun array `letture`, solo la nota di testo libero
  "campionamento 15/07") mostra la contraddizione dal vivo: `statoMisura(a1)`
  risponde **"Conforme" (verde, calcolabile: true, rapporto 0,343)**;
  `statoRigaProgramma(pr5, a1)` — la riga di programma collegata allo stesso
  punto — risponde **"Mai misurato" (giallo)**. Lo stesso punto di misura è
  contemporaneamente "a posto" sul cruscotto di conformità e "da verificare"
  sullo scadenzario.
  Il codice **dichiara già questo rischio** (commento alle righe 341-361,
  "raggiungibilità dichiarata e non gonfiata: latente... ci si arriva con un
  dato scritto a mano"), scritto quando si credeva che nessuno scrittore reale
  ci sarebbe arrivato. Il dato demo `a1` mostra che ci si arriva con un valore
  inserito senza il dettaglio della lettura — e non è un caso limite raro: è
  la forma più semplice in cui qualcuno può registrare un dato ("scrivo il
  numero che ho letto" senza compilare la riga di lettura completa con data e
  ora).
  **Perché serve una decisione e non una correzione automatica**: il file per
  l'ARPA e la scheda di conformità sono documenti di sicurezza (lo stesso
  principio già applicato a `statoMisura` più volte in questo file —
  l'assenza non è un dato favorevole), e stringere `statoMisura` per
  pretendere anche lì una lettura datata **cambierebbe il verdetto di
  conformità** di ogni punto che oggi ha solo un `valore` senza `letture[]`,
  potenzialmente trasformando "Conforme" in "Mai misurato" su dati che un
  sito cliente potrebbe già avere in produzione — una modifica al
  comportamento del semaforo di conformità non è un dettaglio da cambiare di
  iniziativa. **Le strade**: (a) `statoMisura` si allinea a
  `statoRigaProgramma` e pretende anche lei una lettura datata in
  `letture[]`, trattando un `valore` nudo come "Mai misurato" — coerenza fra
  le due domande, ma un possibile cambio di badge su dati esistenti; (b) si
  accetta la differenza dichiarandola nel commento come voluta (un valore
  inserito a mano è comunque "una misura" per il semaforo, mentre il
  programma vuole sapere *quando*) — e allora la riga "latente" va riscritta
  da "rischio non ancora raggiunto" a "comportamento scelto", con la ragione;
  (c) si aggiunge un terzo stato intermedio ("misurato, ma senza data
  certa") visibile sia sul semaforo sia sul programma, invece di far vincere
  una delle due funzioni sull'altra. **La mia risposta, se non rispondi
  entro la settimana**: (a) — lo stesso principio che ha già corretto tre
  volte quest'anno lo zero-che-rassicura in questa stessa funzione (righe
  341-361) si applica anche qui: un semaforo di conformità non dovrebbe
  potersi accendere verde su un dato che il programma, guardando la stessa
  fonte, giudica "mai preso". Non la applico da solo perché tocca un
  verdetto che oggi potrebbe già comparire, verde, su un cruscotto vero.

---

## 🟡 17/09 — Campo: due documenti diversi, due metà diverse della stessa giornata

*Una passata in profondità su Campo (bottone per bottone, file scaricato e
letto per intero) ha trovato due difetti veri, già corretti in questa stessa
unità (non decisioni: uno mescolava le attività di un turno con quelle di
un altro nell'avviso di chiusura, l'altro triplicava lo stesso near-miss
senza turno nel testo della consegna). Restano due asimmetrie fra i due
documenti che Campo produce sulla stessa giornata — non difetti, perché
ognuno fa esattamente quello che il suo codice dichiara di fare: sono due
scelte di contenuto mai confrontate fra loro.*

- [ ] **32. Campo: la consegna di turno ARCHIVIATA non ha le presenze; il
  rapporto STAMPATO E FIRMATO non ha i near-miss.** Campo produce due
  documenti sulla stessa giornata, con due destini diversi:
  `testoConsegnaTurno` (`apps/campo/campo-data.js`) è quello che
  **rimane**: il bottone «Consegna di turno (testo)»
  (`apps/campo/index.html:4567`) lo scrive anche su `chiusure.testoConsegna`,
  apposta perché — dice il suo stesso commento — "il database non perda
  traccia di che cosa diceva la consegna". `rapportoGiornata` è quello che
  si **firma**: il bottone «Rapporto di fine turno» lo apre in una finestra
  di stampa con «Consegnato da ___ Ricevuto da ___», e non tocca il database.
  Le due liste di sezioni non coincidono:
  - `testoConsegnaTurno` ha RAPPORTINI, PRODUZIONE, OBIETTIVO, CHECKLIST,
    BRIEFING, METEO, VOLATE, LAVORI NON CONCLUSI, **SEGNALAZIONI DEL TURNO**,
    CHIUSURA, ANOMALIE/FERMI — ma **non chiama mai** `appelloTurno` né
    `riposoDiTurno`: nessuna presenza, nessun D.Lgs 66/2003 sul riposo.
  - `rapportoGiornata` ha checklist, briefing, meteo, volate,
    **personale presente** (`appelloTurno`), obiettivo, attività, fermi,
    disponibilità, produzione, rapportini, chiusura — ma **non chiama mai**
    `segnalazioniDelTurno`: zero near-miss, in nessun punto del testo, anche
    in una giornata dove la dashboard mostra "SEGNALA UN NEAR-MISS — è
    andata bene per poco" e la consegna (l'altro documento) lo scrive tre
    volte (era il difetto #4, ora corretto: una).
  Cioè: se un sito preme solo «Consegna di turno» (quello che il suo stesso
  commento dice di usare per non perdere la memoria del turno), il
  database non conserva mai chi c'era né se il riposo tra due turni è
  stato rispettato. Se firma solo il «Rapporto di fine turno» (quello
  pensato per essere firmato e archiviato su carta), il documento firmato
  non dice mai che quel giorno è stato segnalato un near-miss.
  **Perché è una decisione e non un'unità automatica**: nessuno dei due
  file mente su quello che fa — `run-kpi.mjs` prova che `testoConsegnaTurno`
  scrive le sue dieci sezioni dichiarate, e nessuna delle due prova
  pretende le sezioni dell'altro documento. Aggiungere una sezione a un
  documento pensato per essere firmato (o togliere la firma da uno pensato
  per restare com'è) è una scelta sul che cos'è ciascun documento, non un
  bug da correggere in silenzio. **Le strade**: (a) le stesse due funzioni
  guadagnano le sezioni che mancano (appello+riposo in `testoConsegnaTurno`,
  near-miss in `rapportoGiornata`), così qualunque bottone si prema porta
  tutto; (b) si accetta la divisione dei compiti — la consegna racconta il
  lavoro, il rapporto firmato certifica la presenza — e si scrive da
  qualche parte QUALE dei due va tenuto come prova delle presenze/riposo,
  così un sito che ne usa uno solo lo sa; (c) si uniscono i due bottoni in
  un solo documento. **La mia risposta, se non rispondi entro la
  settimana**: (a) — un near-miss del giorno e la presenza/riposo della
  squadra sono entrambi dati di sicurezza, e un documento di sicurezza che
  ne tace uno perché "non tocca a lui" è lo stesso principio già scritto
  in CLAUDE.md sull'assenza che non è un dato favorevole, applicato a
  quale DOCUMENTO la porta invece che a quale NUMERO.

---

## 🟡 15/09 — tre decisioni nuove, da tre giri di ricerca su Deepwork ID

*Il secondo giro di ricerca mirata (Deepwork ID, mai passata al setaccio finora
in questa sessione) ha trovato un verdetto scaduto in
`docs/REVISIONE_SICUREZZA_202607.md` — corretto in questa stessa unità, non è
una decisione — e un candidato di scope che invece lo è. Il sesto giro (stessa
sessione, ore dopo) ne ha trovato un secondo, sull'invito/rimozione dei
membri. Un terzo giro, più tardi lo stesso giorno, ha riverificato la revoca
degli accessi contro il codice vero: R4 (26/07) aveva già scritto che sul
percorso gratuito il claim "resta valido" finché non si rilancia un
aggiornamento manuale — non una scoperta nuova — ma oggi si conferma che
manca anche lo script per farlo, e la proposta P1 che risolverebbe tutto
senza costi non è mai stata costruita.*

- [ ] **29. Conti: il DDT (`pesate`) resta fuori da `documentoEmesso` — va
  aggiunto come quarta collezione protetta?** La decisione 10b (07/08) ha
  limitato **cancellare/modificare un documento emesso ai soli admin** per
  tre collezioni: `conti/fatture`, `conti/note`, `scudo/documenti`
  (`firestore.rules:128-131`). Il DDT di Conti (collezione `pesate`) non
  c'è: qualunque membro può cancellarlo o modificarlo su Firestore anche
  dopo che è stato agganciato a una fattura (`fatturaId` valorizzato) —
  l'interfaccia nasconde solo il bottone («Elimina pesata» sparisce quando
  `p.fatturaId` è valorizzato, `apps/conti/index.html:4185»), ma è un
  vincolo di sola UI, non una regola server. L'app stessa tratta il DDT come
  un documento fiscale con "numerazione progressiva, senza salti né
  doppioni", regolato dal DPR 472/1996 (`apps/conti/index.html:1379`) — la
  stessa natura di una fattura. ⚠️ **E la voce 19 qui sopra dà per scontato
  che la 10b copra "chi cancella un DDT emesso" applicandola all'esplosivo
  di Genesi: non è così per il DDT di Conti**, che non è mai stato incluso.
  Non è cross-organizzazione (resta dentro la stessa azienda: l'isolamento
  fra org non c'entra) — è la stessa domanda del punto 2 originale di
  luglio, sulla quarta voce dell'elenco che CLAUDE.md dichiara
  esplicitamente "corto e volontario, da allargare il giorno che ne servirà
  una quarta". *La mia risposta, se non rispondi entro la settimana*:
  aggiungere `conti/pesate` all'elenco — è coerente con le altre tre e con
  quanto l'app già dichiara nella propria interfaccia — ma non la applico da
  solo perché è esattamente il tipo di scelta che la 10b ha riservato a te.
- [ ] **30. Un membro rimosso dall'organizzazione: che fine fanno i dati che
  ha creato?** `removeMember` (`apps/deepwork-id/functions/index.js:206`)
  cancella solo il documento di membership (`memRef.delete()`): un
  hard-delete secco. I dati che quella persona ha creato nelle app —
  rapportini, scadenze, azioni, con un `createdBy` che punta al suo uid —
  restano dell'organizzazione (coerente con la barriera multi-tenant reale,
  quella fra organizzazioni), ma nessuno decide né traccia che cosa
  succede a QUEL riferimento: resta un uid orfano, senza nome recuperabile
  se la persona viene ricreata con un altro id, e senza un audit trail di
  chi ha creato che cosa prima di uscire. I sistemi B2B maturi (Auth0,
  Clerk, WorkOS — pattern citati da una ricerca web, **non verificati
  primariamente**) dichiarano sempre questa scelta esplicitamente: o
  soft-delete (`status: inactive`, il nome resta leggibile nell'audit) o
  hard-delete con trasferimento esplicito di proprietà su chi resta. Qui
  non è mai stata presa. *La mia risposta, se non rispondi entro la
  settimana*: soft-delete (`status: "removed"` sul documento membership
  invece di cancellarlo, con `removedAt`/`removedBy`) — è la scelta più
  economica da implementare sopra il modello esistente e non perde
  informazione, ma è **la tua chiamata**: cambia il modo in cui "chi era in
  questa cava" si racconta a un ispettore o in un contenzioso, ed è
  esattamente il tipo di decisione che questo file esiste per raccogliere.
- [ ] **31. La revoca di un membro: R4 aveva già scritto "peggio di
  un'ora" il 26/07 — oggi si conferma che manca anche lo strumento per
  farla, non solo il tempismo.** `docs/RICERCA_DEEPWORKID_202607.md`
  (R4) diceva già, correttamente, che sul percorso gratuito attuale "il
  claim resta valido" finché non si rilancia un aggiornamento manuale —
  quindi la parte "non è immediata" NON è una scoperta di oggi. Quello che
  la riverifica del 15/09 ha aggiunto, verificato riga per riga: **oggi
  non esiste nemmeno lo script da rilanciare.** `apps/deepwork-id/
  ATTIVAZIONE_LIVE.md` conferma che il progetto live gira sul piano
  gratuito Spark ("niente Cloud Functions"): `onMemberWrite`/
  `rebuildClaims`/`removeMember` esistono nel repository ma non sono mai
  state deployate, e `ls apps/deepwork-id/scripts/` mostra solo
  `bootstrap-owner.mjs` — nessuno script di rimozione. Se il fondatore
  cancellasse a mano un documento `members/{uid}` dalla console Firebase,
  nessun trigger se ne accorgerebbe: il claim resterebbe quello di prima
  finché qualcuno non lo riscrivesse a mano con l'Admin SDK (strumento che
  oggi non c'è). La voce 30 qui sopra presuppone che `removeMember` giri:
  oggi non gira, e la proposta **P1** di R4 (regole che leggono il
  documento di membership invece del solo claim, `docs/
  RICERCA_DEEPWORKID_202607.md` riga 310) è già la strada giusta per
  risolverlo **senza il piano a pagamento** — non è mai stata presa in
  costruzione. **Perché serve una decisione, non un'unità automatica**:
  tocca la sicurezza multi-tenant fra aziende concorrenti (massima
  priorità dichiarata in CLAUDE.md) e una scelta già presa dal fondatore
  (niente Blaze per ora). **Le strade**: (a) costruire P1 — far leggere
  alle regole Firestore il documento `members/{uid}` con `get()`, gratis
  su Spark, con il costo di una lettura in più per ogni valutazione di
  regola, e la parte ancora da decidere di CHI/COME cancella la
  membership senza una Cloud Function (oggi `allow write: if false` dal
  client); (b) attivare Blaze e deployare le funzioni già scritte (P20);
  (c) accettare il rischio per ora, dichiarato qui invece che lasciato
  scritto solo in un documento di ricerca di due mesi fa. **Che cosa
  serve da te**: quale delle tre — e se (a), l'autorizzazione a costruire
  P1, che oggi è solo una proposta.

---

## 🟡 04/09 — sei decisioni nuove, nate dalle passate in profondità

*Il 3 e il 4 settembre tutte le superfici hanno avuto la passata in profondità
(ogni schermata guardata a 390 e 320 nei temi, ogni file aperto, la
dimostrazione svuotata pezzo per pezzo): diciannove difetti veri corretti. Tre
cose sono rimaste scritte come «da decidere», perché non sono difetti: sono
scelte di prodotto.*

- [ ] **22. Scudo: le consegne DPI a persone che non esistono più.** Con
  l'anagrafica vuota il registro DPI dice «27 consegne registrate a 5 persone ·
  niente da sistemare», ma tutte le 27 riguardano persone che non sono più in
  anagrafica (righe con l'avatar «?» e senza nome). Nessuna pastiglia diventa
  verde, per questo non l'ho toccato. La domanda è tua: una consegna a una
  persona cancellata **va contata** (è storia: quel casco è uscito), **va
  segnalata** («5 consegne a persone non più in anagrafe»), o **va nascosta**?
  La stessa domanda vale per le mansioni con l'assegnato cancellato.
- [ ] **23. Flotta: le righe «IN LINEA» quando non c'è nessun fermo registrato.**
  La pagella scrive «100 %» e lo dichiara («nessun fermo registrato: la
  disponibilità non distingue una macchina dall'altra»), ma sotto quell'avviso
  ogni riga resta **«IN LINEA» in verde** con «dentro la banda su tutt'e due
  gli assi». Il numero è dichiarato, il colore no. Da decidere: la pastiglia
  verde resta (la banda è quella) o diventa neutra finché non c'è un fermo
  con cui distinguere?
- [ ] **24. Terra: il CSV dei rilievi perde il rilievo PIANIFICATO al ritorno.**
  Il file dei rilievi esporta anche «Prossimo rilievo» (pianificato, senza
  volume) ma non ha una colonna `stato`: ricaricando lo stesso file quella
  riga viene dichiarata persa («il volume non è stato misurato»), perché un
  pianificato e un rilievo eseguito senza volume sono indistinguibili. Il
  prodotto lo dice, non tace; ma è un giro di andata e ritorno di casa nostra
  che perde una riga. Da decidere: una colonna `stato` nel CSV (cambia il
  formato che qualcuno potrebbe già usare), oppure i pianificati fuori
  dall'export (il file è dei rilievi fatti)?
- [ ] **25. Genesi: che cosa disegna la pianta di una volata a cui manca la
  maglia.** Oggi cinque funzioni di disegno (`computeEnergia2D`, `computeSeq2D`,
  `computeRelief2D`, `_spazTipico`, `drawInnesco` in `apps/genesi/genesi.html`)
  ripiegano su una spalla di 3 m, un interasse di 3,5 m e una profondità di
  10 m **che nessuno ha scritto**: con la spalla illeggibile la maglia
  disegnata degenera e da lì nasceva un consumo specifico che accusava dodici
  fori. I NUMERI oggi si fermano («non calcolabile»); una PIANTA non può
  dichiararsi: o disegna o non disegna. Da decidere, in due:
  (a) **pianta vuota con una frase** («manca la spalla: la pianta si disegna
  quando la scrivi») — onesta, ma chi apre il 2D non vede niente finché non
  compila; (b) **la maglia di progetto disegnata come PROPOSTA**, con un
  avviso dichiarato sulla pianta («maglia proposta 3 × 3,5 m, non scritta»)
  e i numeri che restano «non calcolabili» finché la maglia non è confermata.
  *La mia risposta, se non rispondi entro la settimana*: la (a) per il
  DISEGNO e la (b) solo come bottone «usa questa maglia» che SCRIVE i valori
  nel progetto — così la pianta e i numeri raccontano sempre la stessa volata,
  e i tre ripieghi spariscono dal codice di disegno. Non la prendo da solo
  perché tocca il modo in cui Genesi accoglie chi comincia.
- [ ] **26. Campo: lo zero dei minuti di fermo ha due letture opposte, e
  tutt'e due sono difese da prove verdi.** Sullo stesso record `fermoMin: 0`,
  `minutiFermoDi` risponde «una misura» (e alimenta il CSV), mentre
  `anomalieAperte`, `disponibilitaTurno`, `storicoSettimana`,
  `registrazioniSenzaGiorno` e il campo del modulo dicono «non misurato».
  Cinque contro uno; cambiare l'uno fa cadere quattro asserzioni che
  difendono il verso opposto. Dal 13/08 quello zero non nasce più da solo
  (chi svuota il campo salva `null`): ci arriva solo chi digita «0» apposta.
  Da decidere: uno «0» digitato è una MISURA («fermo di zero minuti», cioè
  segnalazione senza fermo) o va rifiutato con «se non c'è stato fermo lascia
  vuoto»? *La mia risposta, se non rispondi*: è una misura — chi scrive 0 lo
  fa apposta — e allora sono i cinque lettori a dover dire «0 min» invece di
  «non misurato»; la prova che li difende va riscritta nel verso giusto.
- [ ] **27. Scudo: la cella delle giornate d'assenza di un mancato infortunio
  con un valore illeggibile.** `giornateAssenza` sul ramo near-miss riporta a
  **0** un valore presente ma illeggibile («n.d.», «1,5»), mentre lo stesso
  valore su un infortunio torna `null`; nel registro consegnato all'RSPP la
  cella esce `…;near-miss;lieve;0;…`. Non corretto perché per un near-miss
  «nessuna assenza» è vero per definizione, e far tornare `null` scriverebbe
  la parola «null» nella cella (`csvRegistroInfortuni`). Da decidere insieme a
  come quella cella deve uscire: «0» (nessuna assenza, per definizione),
  vuota, o «n.d.» com'era scritto? *La mia risposta*: per un near-miss la
  cella è **0 per definizione** e il valore illeggibile si segnala nella riga
  degli scarti dell'import, non nella cella.

---

## 🟡 12/09 — una decisione nuova, da `docs/GENESI_FRAMMENTAZIONE_DA_FOTO.md`

*Quel documento (già pronto, con le fonti) chiude da solo con la frase
«serve la tua decisione»: non è un difetto da correggere, è una scelta che
riguarda come Genesi si presenta ai clienti — se sbagliata, rischia di far
sembrare una stima assistita una misura vera, ed è esattamente la
gonfiatura che le regole di questo repository vietano. Per questo il ciclo
non ha proceduto da solo, nonostante la direttiva di lavorare al massimo
su Genesi.*

- [ ] **28. Genesi: si procede con la "misura assistita" della pezzatura da
  foto (P2.1 di `docs/GENESI_ROADMAP_COMPETITOR.md`)?** Il documento di
  ricerca dedicato conclude: una stima "carica una foto e hai la
  granulometria esatta" non è affidabile per nessuno, nemmeno per i leader
  di mercato (Split-Desktop, WipFrag) — serve sempre taratura su vagliatura,
  telecamere 3D, o correzione umana. La strada onesta e fattibile subito nel
  browser, senza spese, è la **misura assistita**: l'operatore delimita a
  mano i frammenti nella foto e posiziona un oggetto di scala nota; il tool
  calcola area→curva→x50→uniformità e la sovrappone alla curva Kuz-Ram
  prevista, con un'etichetta esplicita ("stima assistita da immagine, NON
  vagliatura; i fini sono sottostimati"). Un modello ML (MobileSAM) per
  aiutare a tracciare i bordi resta un upgrade futuro opzionale, da attivare
  solo su richiesta (pesa qualche decina di MB). Da decidere: si procede con
  la misura assistita come prossima unità su Genesi? *La mia risposta, se
  non rispondi entro la settimana*: sì alla misura assistita (onesta,
  gratuita, coerente con Genesi = simulatore didattico), MobileSAM resta
  fuori roadmap finché non lo chiedi tu esplicitamente.
  ⏱️ *14/09 — una seconda ricerca (`docs/RICERCA_CONTINUA_GENESI.md`,
  sezione "Come si misura davvero la frammentazione") ha confermato lo
  stesso quadro senza saperlo (partita da zero, non da questo documento):
  le suite commerciali (WipFrag, Split-Desktop) restano stime con errore
  dichiarato 2-25% anche con calibrazione di sito, i fini restano sempre
  stimati per regressione, e nessuna sostituisce la vagliatura. Non cambia
  la scadenza né la risposta di default sopra — resta un'attesa di
  risposta, non un "non c'è" da colmare da solo — ma vale la pena
  segnalarlo: due ricerche indipendenti concordano, il che rende la
  risposta di default più solida se il termine dei sette giorni scade
  senza risposta.*

---

## 🟡 02/09 — tre decisioni nuove, nate dai ponti e dalle ricerche di oggi

*Oggi Genesi è uscita dal browser (sette unità su otto del piano), il triangolo
della produzione è chiuso (Campo→Conti), e sei ricerche hanno avuto il loro
delta. Da tutto questo escono tre cose che non decido io.*

- [ ] **19. Una volata SPARATA è un «documento emesso»?** Oggi Genesi salva
  PROGETTI (nome, data, design, sintesi): nessun campo dice «questa è stata
  sparata, il giorno X all'ora Y». Il ponte di dati Genesi→Sentinella — le
  volate sparate accanto alle letture del sismografo, invece del file CSV di
  oggi — ha bisogno di quella distinzione, e di una regola: chi può correggere
  o cancellare una volata sparata? È la stessa domanda della 10b (chi cancella
  un DDT emesso), applicata all'esplosivo. **Finché non rispondi, il ponte
  Genesi→Sentinella resta di file**, e nessuno inventa un campo «sparata».
  Dettagli: `docs/GENESI_FUORI_DAL_BROWSER.md` §3d.
- [ ] **20. Le notifiche FUORI dall'app (SMS, e-mail) sono una spesa.** La
  ricerca su Sentinella dice che i concorrenti mandano l'allarme di
  superamento via SMS; da noi l'allerta è a schermo. Mandarla fuori vuol dire
  una Cloud Function e un fornitore di SMS a pagamento: è la regola «nessuna
  spesa prima della commercializzazione», e resta tua. Se un giorno dici sì,
  la prima forma onesta è l'e-mail (che il progetto Firebase può mandare), non
  l'SMS.
- [ ] **21. Quattro numeri di LEGGE che le ricerche riportano di seconda mano,
  e che NON scrivo senza il testo.** La denuncia INAIL «entro 2 giorni» per un
  infortunio con prognosi oltre 3 giorni (Scudo); gli indici «secondo UNI
  7249» per nome (Scudo li calcola, non cita la norma); il limite giornaliero
  del PM10 «50 µg/m³, 35 superamenti l'anno» (D.Lgs 155/2010, Sentinella); le
  soglie del rumore per classe acustica diurno/notturno (D.P.C.M. 14/11/1997,
  Sentinella). Sono tutte plausibili e tutte da risultato di ricerca: un
  termine di legge sbagliato in una schermata che va a un ispettore è peggio
  di uno assente. **Se hai i testi (o un tuo consulente li conferma), me li
  passi e li metto come preset «da verificare»**, che è la forma che
  Sentinella usa già per DIN e USBM.

---

## ⚠️ 14/08 — due numeri che uscivano dall'azienda dicevano una cosa tranquilla, e non era vera

*Anche questa sezione non ti chiede niente di nuovo: ti dice che cosa è cambiato
in due fogli che **escono** — uno va all'ente, l'altro esce col tuo nome — e che
cosa **non abbiamo toccato**, perché è roba tua.*

1. **Sentinella — il file per l'ARPA diceva «Conforme» su un punto che non ha
   mai misurato niente.** Una lettura registrata **senza il valore** (il tecnico
   apre la riga, la salva, ma il numero non c'è) veniva contata come una misura
   **di zero**. Su un sismografo lo zero è il numero più tranquillo della scala:
   la scheda diceva «Conforme», il rapporto diceva zero superamenti, e il file
   che parte per l'ente scriveva **«Conforme»**. Lo stesso punto **senza quella
   riga** diceva già la cosa giusta — «Mai misurato» — cioè l'assenza *scritta
   dentro una riga* era più tranquilla dell'assenza vera.
   Adesso quella lettura non conta come misura, e sullo schermo e nel file c'è
   scritto **«Mai misurato»**. ⚠️ Uno zero **scritto davvero** resta una misura:
   uno strumento che legge zero **ha** misurato, ed è tutta la differenza.
2. **Il core — la maglia che nessuno ha scritto usciva come «3,5 × 4» sul PDF.**
   Se in una volata mancano spalla e interasse, il programma li riempiva con due
   numeri di mestiere: la barra dell'editor scriveva `Sp3.5×I4`, il riquadro che
   vedi quando **condividi** un progetto scriveva `B 3.5 × S 4`, e il foglio
   «SCHEMA DI VOLATA» li stampava come se li avessi decisi tu. Adesso, dove il
   dato manca, c'è scritto **«Spalla non scritta»** e **«Interasse non
   scritto»**, e sotto la planimetria una riga dice che **le distanze del
   disegno non sono in scala**.
   ⛔ **E quello che NON abbiamo toccato è la tua decisione B0-septies**: che
   cosa deve vedere chi apre il **2D** di una volata senza maglia. Il disegno
   continua a usare 3,5 e 4 per non lasciare una pianta vuota — un disegno non
   può dichiararsi — e i **metri cubi** non sono stati cambiati. Qui è entrato
   solo ciò che è **scritto a chi legge**.
   ⚠️ Il numero che spaventa di più in questa famiglia è quello che **non si
   muove**: svuotando l'interasse i fori passano da 16 a 14 e i metri cubi
   restano **1512, identici** (126×3×4 fa quanto 144×3×3,5). Cioè guardare due
   schermate affiancate non basta a vedere il difetto.
   ✅ **14/09 — B0-septies decisa dal ciclo** (la settimana concessa il 04/09 è
   passata senza risposta, e per questa voce l'auto-decide non è mai stato
   revocato, a differenza della segnalazione boretrack più giù). Non si è
   scelto fra "pianta vuota" e "maglia proposta": scomponendo il lavoro sono
   emersi 11+ punti di ripiego, non i cinque nominati nella roadmap, e farli
   convergere uno per uno era la stessa trappola descritta sopra.
   ⚠️ *E qui sopra la riga «il disegno continua a usare 3,5 e 4» non descrive
   più quello che genera oggi la maglia: misurato direttamente (Node, non
   deduzione) su `genMaglia2D` con burden e interasse assenti, le coordinate
   NON diventano 3,5×4 — diventano tutte **(0,0)**, per coercizione di un
   valore assente a zero nella moltiplicazione. Non un ripiego "plausibile":
   un collasso di tutti i fori nello stesso punto. Non si sa se la riga del
   14/08 descriveva una forma di `genMaglia2D` diversa da quella di oggi o se
   era già imprecisa allora — resta qui per chi la rilegge, corretta invece
   di cancellata.*
   La cura è alla radice — la maglia non si genera più quando burden o
   interasse non sono leggibili, invece di collassare a un punto solo —
   quindi 2D e metri cubi ora raccontano la stessa cosa per costruzione, non
   per disciplina di chi scrive il codice dopo. Dettaglio in
   `vault/ROADMAP_SETTIMANA.md`, voce B0-septies.

*Nella stessa giornata è stato corretto anche un difetto tecnico degli accessi
(due aggiornamenti ravvicinati potevano far sparire un'organizzazione dal
permesso di un utente, che si sentiva rispondere «non sei membro» pur essendolo).
Non ti chiede nessuna decisione: è dentro, provato, e la prova sa fallire.*

---

## ⚠️ 13/08 a notte — tre numeri di SICUREZZA sono stati trovati sbagliati, e nessuna soglia è stata toccata

*Questa sezione sta in cima perché riguarda i numeri che porti in gara e quelli
che decidono a che distanza si mandano via le persone. Non ti chiede nulla di
nuovo: ti dice che cosa è cambiato e — soprattutto — **che cosa NON abbiamo
toccato**, perché è roba tua.*

**Che cosa era sbagliato.** Tutti e tre della stessa famiglia: un dato che
mancava veniva **sostituito da un numero**, e il numero rassicurava.

1. **Scudo — gli indici infortunistici.** Un infortunio di cui non si legge
   l'anno spariva da IF, IG e LTIFR. Su un registro di due infortuni, uno con la
   data e uno senza: il cartellone in cima diceva «Infortuni: 2», e la scheda
   degli indici due righe più giù — **sugli stessi dati** — diceva
   **IF 50,00** — e quel 50 **non si può sapere se è giusto**: se
   quell'infortunio è del 2026 l'indice vero è **100,00**, il doppio, sui tre
   numeri che si confrontano con la media di settore. Prima non lo diceva
   nessuno; adesso la scheda scrive che c'è un infortunio di cui non si legge
   l'anno e che **non è in nessuno di questi conteggi**.
   ⚠️ *Corretto il 14/08 rileggendo questa riga: la prima stesura diceva «dove
   il vero è 100,00», e non è esatto — **il conto non l'abbiamo cambiato**, e
   non dovevamo (è una soglia di sicurezza, e quelle restano tue). Il 100 è
   quanto verrebbe **se** quell'infortunio fosse dell'anno; il punto non è che
   il numero era sbagliato, è che era **presentato come certo**.*
2. **Genesi — il confinamento del colletto (SDOB).** Senza la carica per foro,
   la scheda scriveva **5,84** invece di **1,43**: sopra la soglia, quindi
   **pallino verde**, «colletto ben confinato, disturbo superficiale minimo».
   Meno carica dichiarata = colletto che *sembra* più sicuro. E lì la carica non
   era poca: **non c'era**.
3. **Genesi — la gittata del flyrock.** La stessa formula viveva in due posti
   con **ripieghi opposti che si compensavano per caso**. La correzione che
   veniva in mente — toglierne uno solo — avrebbe portato la distanza di
   sgombero delle persone da **404 a 197 metri** senza che niente diventasse
   rosso.

**Che cosa NON abbiamo toccato, e resta tuo.** Nessuna soglia e nessuna formula:
`ppvLimit`, le curve **USBM/DIN**, i **133 dB(L)**, la soglia SDOB **1,4/0,9**,
Richards&Moore, McKenzie, Lundborg. Sui progetti con tutti i dati i numeri sono
**identici alla cifra** a prima della correzione (SDOB 1,43 · gittata 101 m ·
sgombero 202/404 m). **È cambiato solo che cosa succede quando un ingresso
manca**: prima si inventava, adesso si dichiara «non calcolabile» con la ragione.

**Perché te lo scriviamo qui.** Perché la regola che hai dato — le soglie non si
toccano senza una tua conferma — ha funzionato, e vogliamo che si veda che ha
funzionato **anche quando toccarle sarebbe stato comodo**. Se un giorno vorrai
cambiare una soglia, quella resta una decisione tua: qui abbiamo solo smesso di
riempire i buchi con numeri inventati.

**Non serve che tu risponda a questa sezione.** Le decisioni aperte restano le
cinque elencate qui sotto.

---

# 📖 Da dove cominciare — le decisioni aperte sono **27**

*Erano 19 fino al 07/08. **Nove** sono state chiuse dal **ciclo**, non da te, con
la regola che avevi concesso il 01/08 (senza risposta entro la settimana si
procede con la colonna «la mia risposta» e lo si dichiara nel commit):
· **sette scrivendole** — la **6**, la **8**, la **10c**, le tre della **11** e
  la **12b**: sono scelte di direzione, non hanno prodotto codice;
· **due costruite** — la **5a** (il messaggio del salvataggio fallito, montato
  nelle sei app) e la **10b** (chi può cancellare un documento emesso, con le
  regole provate dall'emulatore).
Restano **cinque**: una verde che vogliono ancora un cantiere prima di potersi
dire fatte, e le quattro che non tocco (due di sicurezza, due che chiedono
qualcosa di tuo).*

*Questa pagina è stata aggiunta il 01/08 per una ragione precisa: hai scritto
che avresti potuto rispondere «in settimana», e un file di cinquecento righe con
venticinque caselle non è una cosa a cui si risponde in una sera. Qui sotto le
stesse, ordinate per **quanto ti costano a te** e con, per ognuna,
la risposta che darei io. Il testo lungo resta nelle sezioni numerate: questa è
solo la porta d'ingresso.*

## 🔴 Le due che NON prendo da solo, mai — e che restano ferme finché non parli

Non è prudenza mia: è una regola che hai dato tu, ed è scritta in `CLAUDE.md`.
Toccano la sicurezza delle persone o dei dati, e una scelta sbagliata qui non si
vede subito.

| # | in una riga | perché aspetta te |
|---|---|---|
| **3** | ✅ **CHIUSA il 02/08** — i dati di default sono dimostrativi | verificato contro il codice prima di chiuderla. Vedi la sezione 3. |
| **4** | via libera a togliere le **password in chiaro** dal sorgente | ora si sa che sono dimostrative (decisione 3), quindi **non c'è niente da ruotare fuori dal progetto**: resta da decidere se toglierle prima del primo cliente vero |
| **9** | le **curve dei limiti di vibrazione** (USBM/DIN) esatte | è la soglia che dice a una cava se può sparare: la cambio solo se me lo dici |

## 🟡 Le due che richiedono che tu apra qualcosa

Non posso farle io perché servono un tuo account o un tuo file.
La terza — la **2** — è stata chiusa domenica 02/08: le regole erano aperte a
chiunque, il fondatore ha pubblicato quelle chiuse, e la chiusura è verificata.

| # | in una riga | che cosa ti chiede |
|---|---|---|
| **1** | creare il progetto Firebase nuovo | un account Google, dieci minuti, e incollarmi la config |
| **2** | ✅ **CHIUSA il 02/08** — le regole del progetto esistente | erano `if true`; il fondatore ha pubblicato `if false` e la chiusura è verificata dall'esterno (403). Vedi la sezione 2. |
| **7** | la prova drone → Genesi con un volo vero | un file di un volo tuo |

## 🟢 Le quindici che posso portare avanti io — SETTE PRESE il 07/08, otto aperte

⛔ **VENERDÌ 07/08: LA SETTIMANA È FINITA E LA RISPOSTA NON È ARRIVATA.** La
regola concessa il 01/08 diceva che, senza una tua parola entro la settimana, il
ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**.
Così è stato, e vale la pena dire esattamente **che cosa è successo e che cosa
no**, perché un titolo più largo del suo numero è il difetto che passiamo le
giornate a togliere dal prodotto:

| | quante | che cosa vuol dire |
|---|---|---|
| **prese oggi** | **7** — 6, 8, 10c, 11a, 11b, 11c, 12b | erano decisioni da **scrivere**: non toccano codice, e adesso sono scritte con la ragione |
| **prese E costruite** | **5** — 5a, 10b, 12a (tutte e 6 le voci), 18a, 18b | il messaggio del salvataggio fallito (montato nelle sei app, 30 asserzioni) e chi può cancellare un documento emesso (regole 58 → 68, con la controprova) |
| **restano aperte** | **una e mezza** — la 5b, ed è cambiata l'08/08; e la **19**, nata il 05/09 | la sua **prima metà è costruita**: dei dodici punti in cui la spunta di uno spariva, **undici sono chiusi** e il dodicesimo è dichiarato con la ragione. Resta **solo la coda offline**, che è una scelta tua e non un cantiere: vedi la riga qui sotto |
| **ferme, e restano ferme** | **4** — 1, 4, 7, 9 | due toccano la sicurezza (mai da solo), due vogliono che tu apra qualcosa di tuo |

⚠️ E una decisione presa dal ciclo **non pesa come una tua**: si cambia con una
riga, in qualunque momento, e nessuna delle sette ha prodotto codice — sono
scelte di direzione, scritte dove chi lavora le trova.

*Erano diciannove. Le **quattro gemelle — 13, 14, 16, 17** — le hai decise tu
il 02/08 con una riga sola («vai»), e sono state attuate lo stesso giorno.*

Sono scelte di **prodotto**, non di sicurezza. Per ognuna ho una risposta che mi
convince, e sotto trovi la ragione per esteso. **Se entro la settimana non dici
niente, procedo con la colonna «la mia risposta» e lo scrivo nel commit**, così
resta chiaro che l'ha decisa il ciclo e non tu — e si cambia in qualunque
momento.

| # | la domanda, in una riga | la mia risposta |
|---|---|---|
| ~~**5a**~~ | ✅ **DECISA E FATTA DAL CICLO il 07/08** — il messaggio del salvataggio fallito | «questa modifica non è stata salvata», mai un codice d'errore. Misurato prima: **103 punti su 109** scrivevano senza nessun `catch`, cioè un rifiuto era MUTO. L'avviso sta sul fabbricante delle scritture, una riga per app |
| **5b** | il lavoro **senza rete** (giro macchina, appello al fronte) | **sì**, ma prima misuro cosa succede a due persone che scrivono la stessa riga · ✅ **LA MISURA È FATTA (08/08)**: `docs/DUE_PERSONE_STESSA_RIGA.md`. Campi diversi **convivono**; lo stesso campo **vince l'ultimo**; ma il caso vero — la lista letta, cambiata in un punto e **riscritta intera** — fa **sparire in silenzio** la spunta dell'altro, e succede in **12 punti di 4 app**. La cura è una riga (il percorso puntato), provata nella misura stessa. ✅ **E L'08/08 È STATA COSTRUITA**: undici punti su dodici chiusi, il dodicesimo (`atmosfera` di Sentinella) dichiarato con la ragione e bloccato da una prova; la regola vive in `shared/dw-ponti.js` e le sei app la chiamano. ⛔ **E anche la seconda metà è MISURATA, non dedotta** (`tests/browser/coda-offline.mjs`, due schede autenticate, regole vere, cache accesa): staccata la rete la scrittura **si fa** e riattaccata **arriva da sola** — la metà buona. Ma se intanto un altro scrive la stessa riga, al ritorno **vince chi era staccato** e la scrittura di chi era in linea **sparisce in silenzio**: la stessa perdita di prima, un piano più in su, e le transazioni **non la coprono** (una transazione offline non può rileggere niente). ⛔ **Quindi la coda NON è stata accesa, ed è la domanda che resta a te**: quando due si incontrano al ritorno, *chi vince e come lo diciamo a chi ha perso?* Accenderla senza quella risposta vorrebbe dire scegliere «vince chi torna per ultimo, e non lo dice a nessuno» — che è esattamente il numero tranquillo che questa settimana togliamo dal prodotto |
| ~~**6**~~ | ✅ **DECISA DAL CICLO il 07/08** — la geometria del fronte | resta com'è: P1.1/P1.2 restano chiusi finché la **7** non porta un volo vero. Il segno della deviazione decide se l'avviso di flyrock è dritto o rovesciato |
| ~~**8**~~ | ✅ **DECISA DAL CICLO il 07/08** — quale funzione per prima | il **criterio**, non un elenco: quella che l'ispettore chiede per prima. Un elenco deciso oggi invecchierebbe come i «non c'è» di una ricerca |
| ~~**10a**~~ | ✅ **DECISA DAL CICLO il 07/08** — l'abbonamento come barriera vera | **sì**, ma **non costruibile oggi**: misurato, gli entitlement non li scrive **nessuno** e `hasEntitlement` non la chiama **nessuna app**. Prima chi scrive l'abbonamento, poi la barriera |
| ~~**10b**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — chi può cancellare | solo chi **amministra** corregge o cancella un documento già emesso; scrivere cose nuove resta a tutti. Elenco corto e scritto: `conti/fatture`, `conti/note`, `scudo/documenti`. Regole 58 → **68** prove |
| ~~**10c**~~ | ✅ **DECISA DAL CICLO il 07/08** — quanti utenti al primo cliente | **più utenti**. ⛔ E ne segue un vincolo: la **10b** va chiusa PRIMA del primo cliente |
| ~~**11a**~~ | ✅ **DECISA DAL CICLO il 07/08** — diario / tavolo da disegno | confermata: distingue per **tempo verbale**, non per elenco di funzioni |
| ~~**11b**~~ | ✅ **DECISA DAL CICLO il 07/08** — le tre sovrapposizioni | si tolgono da **Deepwork**, in quest'ordine: la parola «volata», la maglia in due formati, i due motori 3D. Ordine dichiarato, non attuato |
| ~~**11c**~~ | ✅ **DECISA DAL CICLO il 07/08** — due app o una | **due**, e si mostra il ponte: «una app con due modi» nasconde proprio ciò che distingue il prodotto |
| ~~**12a**~~ | ✅ **DECISA E FINITA il 07/08 — tutte e sei le voci** — export ri-caricabile | **sì**. Ordine ragionato: si parte da ciò che **non si ricostruisce da nessuna carta** — i rilievi di Terra (un volo di sei mesi fa non si rifà), non da ciò che vale di più. Due erano già fatte, quattro costruite: rilievi, pesate/DDT, incassi, clienti, azioni correttive |
| ~~**12b**~~ | ✅ **DECISA DAL CICLO il 07/08** — dirlo in chiaro prima del pilota | si fa **comunque**, anche quando la 12a esisterà. Su CHI lo dice il ciclo non decide |
| ~~**13**~~ | ✅ **DECISA E FATTA il 02/08** — mansione senza requisiti | «non lo sappiamo»: il riepilogo passa da `puo 3/6` a `puo 2, nonSo 1` |
| ~~**14**~~ | ✅ **DECISA E FATTA il 02/08** — DPI senza data di sostituzione | «attenzione»: da «regolare» e zero allarmi a «senza data», 1 allarme |
| ~~**15**~~ | ✅ **DECISA DAL CICLO il 07/08** — dove vive «Il Quadro» | **(a) nel core**, dove il titolare arriva già. ⚠️ Costo misurato, più alto di quello scritto: sei ponti (il core ne ha **zero**, le app sessanta). Il Quadro **non è costruito**: la decisione dice dove vive |
| ~~**16**~~ | ✅ **DECISA E FATTA il 02/08** — punto senza soglia | stato a sé: il report per l'ente non scrive più «conforme» su un limite mai stabilito |
| ~~**17**~~ | ✅ **DECISA E FATTA il 02/08** — infortunio a prognosi aperta | si distingue da «0»: prima era «un infortunio che non è costato una giornata» |
| ~~**18a**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — la detrazione per recupero | **(c)** un'opzione della concessione, che nasce **spenta**: l'errore ha un costo asimmetrico |
| ~~**18b**~~ | ✅ **DECISA E COSTRUITA DAL CICLO il 07/08** — recupero a cavallo di due anni | nell'anno in cui **finisce**, l'unica data verificabile |
| **19** | il ricettore delle polveri: **da che parte sta** rispetto alla cava (05/09) | (1) se il campo lo mettiamo lo dici **tu** — è un dato che compili tu, per ogni ricettore; (2) la mia risposta: **(b)** etichetta sulla lettura E conto nel report. ⛔ Non si costruisce finché non rispondi alla (1): una tendina vuota su ogni scheda è rumore |
| **20** | i dati alla **fine dell'abbonamento**: quanto restano scaricabili, chi li scarica, se e quando si cancellano (11/09) | una frase tua («restano scaricabili per N giorni, poi …»): da lì una regola in Deepwork ID e una riga nei termini. Intanto il prodotto **non promette niente**, e lo «scarica tutto» si costruisce comunque (voce aperta in roadmap). Vedi la sezione 20. |
| **21** | **Conti è anche il libro dei debiti?** lo scadenzario fornitori, e con lui la previsione di cassa a sei mesi e il DSCR (11/09) | una parola: **debiti sì** o **debiti no**. Con «sì» il ciclo apre la voce; con «no» resta un limite dichiarato. Vedi la sezione 21. |
| **22** | Scudo: **quale scadenza INAIL** tracciare, delle tre che esistono — 48h/2gg/24h (15/09) | una delle tre strade (solo la più urgente, tutte e tre automatiche, o solo il documento da allegare), o quale termine tracciare per primo se si parte in piccolo. Vedi la sezione 22. |
| **23** | Conti: **uno scoring cliente** — sì, e con quali classi? (15/09) | una parola — **scoring sì**, **cruscotto**, o **no** — e se sì quali classi/soglie: è un giudizio su un cliente vero, non un calcolo neutro. Vedi la sezione 23. |
| **24** | Sentinella: **chi ha modificato** una lettura o una soglia — si traccia l'operatore, non solo il timestamp? (15/09) | se costruirlo (e da dove: tutto o solo le soglie), e se il meccanismo per leggere l'identità va scritto in `shared/` pensando alle altre app. Vedi la sezione 24. |
| **25** | Flotta: quando segnalare che **conviene sostituire** un mezzo — quale soglia sul costo pieno? (15/09) | una delle tre strade (soglia sul costo pieno, soglia composita con età e trend, o nessuna soglia automatica) e, se sì, quale percentuale. Vedi la sezione 25. |
| **26** | Conti: le **pesate non ancora fatturate** entrano nel fido del cliente? (15/09) | una delle tre strade (sommarle al valore pieno, mostrarle separate, o lasciare il limite dichiarato) e, se sì, come valorizzarle senza listino noto. Vedi la sezione 26. |
| **27** | Sentinella: le **condizioni meteo** contano anche per polveri e vibrazioni, non solo rumore? (15/09) | se procedere con la strada 1 (solo contesto informativo, nessun giudizio di invalidità) o aspettare una ricerca normativa dedicata prima di costruire un giudizio vero. Vedi la sezione 27. |
| **28** | Sentinella: uno **strumento ha un'identità propria**, distinta dal punto di misura — matricola itinerante fra postazioni? (16/09) | se le cave clienti usano uno strumento fisso per punto (il delta resta teorico) o strumenti che girano fra più postazioni (allora vale costruire il campo). Vedi la sezione 28. |

⚠️ **Correzione, 02/08.** Qui prima c'era scritto che *dieci* di queste
diciannove erano la stessa domanda. **Sono quattro.** Le ho contate una per una
invece di andare a impressione, ed è esattamente il difetto che passiamo le
giornate a togliere dal prodotto: un numero più grande del vero, scritto con
sicurezza. Le quattro vere sono la **13**, la **14**, la **16** e la **17**:

| # | la domanda | perché è la stessa domanda |
|---|---|---|
| **13** | una mansione **senza requisiti** censiti | il vuoto vuol dire «nessuno l'ha ancora scritto», non «va bene così» |
| **14** | un DPI **senza data di sostituzione** | idem: verde vorrebbe dire «a posto», e nessuno l'ha detto |
| **16** | un punto di monitoraggio **senza soglia** | senza soglia non si può dire né conforme né non conforme |
| **17** | un infortunio a **prognosi aperta** | le giornate perse non sono zero: non si sanno ancora |

Tutte e quattro chiedono la stessa cosa: **quando non si sa, l'app lo dice
invece di mostrare la faccia tranquilla.** È il principio che hai dato tu
(«l'assenza di un dato non è un dato favorevole»), e ogni volta che l'abbiamo
violato l'app ha detto a qualcuno una cosa rassicurante che nessuno aveva
misurato.
✅ **E così è stato**: il 02/08 il fondatore ha risposto «vai», e tutte e quattro
sono state attuate nello stesso blocco, con le prove e le controprove. Le altre
quindici restano scelte vere, una per una.

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
- **Stato al 02/08**: ⛔ **LETTE, ED ERANO COMPLETAMENTE APERTE.** Il fondatore
  le ha aperte in console e incollate:

      match /{document=**} { allow read, write: if true; }

  È la «modalità test» che Firebase propone alla creazione del database,
  rimasta attiva. Tradotta: **chiunque su internet può leggere, scrivere e
  cancellare l'intero database** — non serve un account, basta l'id del
  progetto, che sta nel sorgente del sito pubblico.
- **Perché non poteva essere altrimenti, e come l'abbiamo capito prima di
  chiederglielo**: nel core non c'è **nessuna** autenticazione — cercati
  `getAuth`, `signIn`, `onAuthStateChanged`, `firebase/auth` in `index.html` →
  **zero**. Senza un'identità, o le regole lasciano passare tutti o il sito non
  salva niente. La lettura delle regole ha confermato la deduzione.
- ⚠️ **`apiKey` e `projectId` pubblici nel sorgente NON sono il problema**: in
  Firebase per il web non sono segreti, sono identificatori. La protezione
  doveva venire dalle regole, e non c'era.
- ⚠️ **E c'era un secondo difetto che nessuno aveva guardato**: tutti i
  visitatori del sito dimostrativo scrivono nello **stesso** database, quindi
  si vedono i dati a vicenda e se li sovrascrivono.
- **Che cosa si fa**: si chiude (`if false`). ⚠️ **Non spegne il sito**: il core
  ha già la via d'uscita, e il suo commento la nomina alla lettera — «se
  Firestore non risponde proprio (rete morta, projectId errato, *security rules
  bloccanti*) carichiamo i dati di default in memoria»
  (`initDBOfflineFallback`). La dimostrazione continua, e ognuno lavora sulla
  propria copia: **migliora** anche il secondo difetto.
- **Le regole nuove, versionate**: `firestore.rules.core-vecchio`, con dentro
  quelle vecchie per intero e come si torna indietro.
- **Contenuto del database**, verificato dal fondatore il 02/08: vuoto o solo
  prove. Niente da esportare.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punto 3.
- ✅ **PUBBLICATE dal fondatore il 02/08 — e verificate dall'esterno, non sulla
  parola.** Una lettura anonima dell'API REST di Firestore (nessun account,
  nessuna chiave, esattamente quello che poteva fare chiunque fino a stamattina)
  su `projects/deepwork-app-6c56f/databases/(default)/documents/…` risponde
  ora **`403 PERMISSION_DENIED — Missing or insufficient permissions`**. Prima
  quella stessa chiamata restituiva i documenti.
- ⚠️ **Quello che la prova NON dice, detto com'è.** Da qui il browser non
  raggiunge la rete pubblica, quindi il sito **vivo** con le regole chiuse non
  l'ho potuto aprire: quello che ho verificato è (a) la chiusura, dall'esterno,
  con la chiamata qui sopra, e (b) che il percorso di ripiego del core prende
  anche questo caso — `loadAllData` fa `await getDocs`, un rifiuto delle regole
  è un `reject`, e il `catch` che lo circonda chiama `initDBOfflineFallback`
  (stesso percorso della rete assente, che ho eseguito davvero in locale: la
  pagina entra, 37 elementi visibili, schermata di accesso al suo posto).
  Il primo che apre il sito vero è la conferma finale.
- 👉 **Una conseguenza da sistemare, e non è un difetto nuovo**: adesso ogni
  visitatore riceve il messaggio «⚠ Modalità degradata — connessione database
  non disponibile». Con le regole chiuse **per scelta** quella frase è falsa:
  non è un guasto, è la modalità dimostrativa. Da riscrivere nel core.
- [x] Fatto — *regole pubblicate e chiusura verificata dall'esterno (02/08)*

## 3. Dati di default: reali o di fantasia?
- **Stato**: nel core `index.html` ci sono DEFAULT_CLIENTI / DEFAULT_CAVE /
  DEFAULT_USERS con nomi, telefoni, email, IBAN, coordinate realistici.
- **Decisione che serve**: sono dati **veri**? Se sì, vanno sostituiti con
  dati sintetici (sono pubblici su GitHub) e va valutata la rimozione dallo
  storico.
- **Dettaglio**: `docs/AUDIT_SICUREZZA.md` punti 1 e 2, `docs/CENSIMENTO_FEATURE.md`.
- [x] ✅ **DECISO dal fondatore il 02/08: sono dati DIMOSTRATIVI.** Servono a
      provare l'app nelle varie modalità d'accesso, e non sono usati da nessuna
      altra parte. **Niente da bonificare.**
      **Verificato contro il codice prima di chiudere**, perché una decisione di
      sicurezza non si prende su un'impressione — e le tre prove concordano:
      · l'IBAN è **esattamente** quello d'esempio dei manuali
        (`IT60X0542811101000000123456`), non un IBAN di qualcuno;
      · i telefoni sono `333 1234567`, `2345678`, `3456789`, `4567890` — in
        sequenza;
      · i cognomi sono Rossi, Bianchi, Verdi, Colombo, cioè i segnaposto
        classici italiani.
      ⚠️ E una nota di metodo, perché per un momento l'ho letta male io: in git
      questi dati risultano introdotti da `gius77gf` col primo commit del
      repository (`d441229`, 18/04/2026). Ma **git registra chi committa, non
      chi scrive**: l'app — compresi questi dati d'esempio — è stata costruita
      da Claude nelle **conversazioni precedenti a questo repository**, e il
      fondatore l'ha portata qui. Quindi «li ha generati Claude» e «li ha
      committati Giuseppe» sono vere tutt'e due, e non si contraddicono.

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

La superficie interessata sono **261 chiamate `await db.`** nelle sei app
*(campo 41 · scudo 70 · flotta 43 · conti 51 · sentinella 32 · terra 24;
rimisurate il 13/08 — qui c'era scritto **203**, ed è cresciuta di **58** mentre
la decisione aspettava. Non è un errore di allora: è il costo che una decisione
rimandata accumula da sola, e vale la pena vederlo scritto).*
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

- [x] **(a) Deciso E costruito dal ciclo il 07/08.** «Questa modifica non è
      stata salvata», con la causa in testa solo quando si sa davvero, e mai un
      codice d'errore. Misurato prima di scrivere: **103 punti su 109** che
      scrivono sul database non avevano nessun `catch`, cioè un rifiuto era
      **muto** — la finestra restava aperta e il dato non c'era. L'avviso si
      monta sul fabbricante delle scritture (`avvisaSeNonSalva`, in `shared/`),
      una riga per app, e l'errore viene rilanciato a chi lo sa gestire.
      Prove: `run-helpers` 63 → 71, banco `salvataggio-muto.mjs` 30 asserzioni
      su sei app, controprova che le rende mute tutte e sei.
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
- [x] **Decisa dal ciclo il 07/08: RESTA COM'È.** P1.1 (burden reale per foro) e P1.2
      (import della deviazione) **non si sbloccano** finché non c'è un volo vero da
      confrontare — cioè finché la **7** (gialla) non si chiude. La ragione non è
      prudenza generica: il segno della deviazione decide se l'app dice al fochino
      che il burden è **minore** o **maggiore** del progetto, e sbagliarlo produce un
      avviso di flyrock rovesciato. Una scelta che non si può misurare non si prende
      per stanchezza.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore (sezione 6).** La regola concessa il 01/08: se entro la settimana non arriva una risposta, il ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**, così resta chiaro chi l'ha presa e si cambia in qualunque momento con una riga.

⛔ **E IL 12/09 QUESTA RIGA È STATA VIOLATA SENZA ESSERE CAMBIATA CON UNA
RIGA — è successo dentro questo stesso ciclo, in un'unità diversa da
quella che ha scritto questo file.** L'unità 129 ha costruito P1.2
(`deviazioneForiDaCsv` + `burdenVeroDaRilievo`, wired in pagina) leggendo
solo `docs/GENESI_ROADMAP_COMPETITOR.md` (dove P1.2 è un gap competitivo)
e **senza controllare questa sezione**, dove la stessa funzione era
esplicitamente bloccata dal 07/08 in attesa di un caso reale che confermi
il segno della deviazione. L'item **7** (il volo del drone) è ancora
`[ ]`, non chiuso: il motivo del blocco non era mai stato risolto.
Il rischio è reale e specifico, non teorico: `burdenVeroDaRilievo` somma
`dx_m/dy_m` del CSV boretrack **direttamente** alle coordinate interne
`mx`/`my` del disegno 2D di Genesi, senza nessuna verifica che gli assi
del rilievo (che dipendono dallo strumento/operatore che l'ha fatto)
coincidano con quelli di Genesi. Se non coincidono, il pannello può
mostrare "più roccia davanti" dove in realtà ce n'è meno — l'avviso di
flyrock rovesciato che questa sezione voleva evitare.
**Mitigazione già applicata, non una soluzione**: aggiunto un avviso
visibile in rosso nel pannello e nel titolo del bottone che dichiara
l'incertezza e sconsiglia di usare il pannello da solo per decidere le
distanze di sgombero (stesso commit di questa riga). La funzione NON è
stata tolta: il calcolo è corretto dato un dx/dy nella convenzione
giusta, e toglierla sarebbe un'altra decisione unilaterale sullo stesso
tema. **Decisione che serve davvero dal fondatore, non dal ciclo questa
volta**: la stessa dell'item 7, mai chiusa — un caso reale (rilievo
boretrack vero + posizione vera del piede, anche solo di un paio di
fori) per confermare la convenzione, oppure la conferma che l'avviso
attuale basta finché quel dato non arriva.
Lezione generale per i cicli futuri: **prima di costruire un P-qualcosa
elencato in un documento di roadmap, si controlla anche questa sezione**
— un gap competitivo e un blocco di sicurezza possono avere lo stesso
numero (P1.1/P1.2) in due documenti diversi, e leggerne uno solo non basta.

📎 **13/09 — materiale extra per QUANDO deciderai, non una proposta di
soluzione**: una ricerca di fianco (mondo, non delta — vedi la sezione
"Ricerca del 2026-09-13 — import CAD/DXF" in
`docs/RICERCA_CONTINUA_GENESI.md`) ha guardato come i software
commerciali di blast design/CAD minerario si difendono da un errore
di convenzione degli assi quando una geometria esterna alimenta un
calcolo di sicurezza — lo stesso rischio di questa sezione. Sintesi:
il settore ha validazione di **plausibilità** post-import (punto più
vicino, tolleranze di deviazione — Maptek BlastLogic, Deswik), non
una validazione **esplicita della convenzione** prima dell'uso; nessun
caso pubblico trovato di incidente causato specificamente da questo
errore in un import CAD per blast design (assenza non confermata come
prova che il rischio sia raro). Non cambia la decisione che serve
(resta quella dell'item 7): è solo altro contesto, nel caso torni utile
guardare come se ne difendono gli altri mentre aspetti il caso reale.


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
- [x] **Decisa dal ciclo il 07/08: il criterio, non la funzione.** Si sceglie sempre
      **quella che l'ispettore chiede per prima**, non quella più citata dai
      concorrenti. Le due proposte in elenco reggono tutt'e due il criterio, e
      quella di Scudo l'ha già superata sul campo — il loop dell'azione correttiva è
      stato costruito ed è ciò che un organo di vigilanza cerca in un registro dei
      near-miss. ⚠️ Il criterio vale per le prossime, non è una graduatoria chiusa:
      un elenco di funzioni deciso oggi invecchierebbe come i «non c'è» di una
      ricerca.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore.** La regola concessa il 01/08: se entro la settimana non arriva una risposta, il ciclo procede con la colonna «la mia risposta» e lo **dichiara nel commit**, così resta chiaro chi l'ha presa e si cambia in qualunque momento con una riga.


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
ed è provato** (68 test, rimisurati l'08/08). Dentro la stessa azienda, invece, non c'è ancora
nessuna separazione: chi è stato invitato per compilare i rapportini può anche
**cancellare una fattura**, e un cliente abbonato solo a un'app può leggere e
scrivere i dati di tutte le altre.

- [x] **10a. Decisa dal ciclo il 07/08: SÌ, BARRIERA VERA** — ma **non si può
      costruire oggi**, e la ragione è misurata, non temuta.
      ⛔ Il prerequisito manca a **due** livelli, e li ho contati uno per uno:
      · **nessuno SCRIVE gli entitlement.** `organizations/{orgId}/entitlements/
        {appId}` è letto dall'SDK (`_loadEntitlement`) e le regole lo aprono in
        lettura ai membri — ma in tutto il progetto **zero** righe lo scrivono:
        niente Cloud Function, niente webhook pagamenti, niente client. Oggi
        ogni organizzazione ha **zero** documenti di abbonamento;
      · **nessuna app LEGGE `hasEntitlement`.** L'intestazione dell'SDK la
        mostra nell'esempio d'uso (`if (!id.hasEntitlement()) id.showLocked()`),
        e chi la chiama sono **zero app su sei**.
      ⛔ Quindi una regola scritta oggi avrebbe due esiti, tutt'e due sbagliati:
      con «documento mancante = nego» **si chiuderebbe fuori ogni
      organizzazione esistente**, che di documenti non ne ha; con «mancante =
      concedo» la barriera sarebbe **decorativa** — ed è esattamente il difetto
      trovato poche ore prima scrivendo la 10b, dove una restrizione scritta e
      leggibile non restringeva niente.
      ⚠️ E la stima di questa scheda — «mezza giornata di lavoro sui claims» —
      **misura la cosa sbagliata**: il lavoro non è la regola, è **chi scrive
      l'abbonamento**. Prima di questa decisione va deciso come nasce un
      entitlement (a mano dal fondatore? da un pagamento? alla creazione
      dell'organizzazione?), che è una domanda commerciale, non tecnica.
      **L'ordine giusto: prima chi lo scrive, poi la barriera.** Scritto qui
      perché il cantiere che la aprirà non ricominci dalla stima sbagliata.
- [x] **10b. Decisa E costruita dal ciclo il 07/08: SOLO CHI AMMINISTRA**
      corregge o cancella un documento **già emesso**; scrivere cose nuove resta
      a tutti. Urgente per conseguenza della **10c** presa poche ore prima.
      L'elenco dei documenti emessi è **corto, scritto per nome e con la
      ragione** — non una regola larga tipo «niente cancellazioni», che
      impedirebbe a un cavatore di togliere una riga sbagliata appena scritta e
      si imparerebbe ad aggirare: `conti/fatture` (e la finestra che la elimina
      SCRIVE GIÀ che «una fattura realmente emessa non va cancellata, va gestita
      con una nota di credito» — la regola rende vero ciò che l'app dice),
      `conti/note` (note di credito, tipo TD04) e `scudo/documenti` (le carte
      che si mostrano all'organo di vigilanza, art. 71 c.9).
      Prove sulle regole: **58 → 68**, con la controprova che rimette il difetto
      e fa cadere le quattro prove negative.
      ⏱️ *Quel 68 è il numero **di allora**, non quello di adesso: rimisurato il
      13/08 sotto l'emulatore, la suite delle regole è a **75 passati, 0
      falliti** (⏱️ 91 dal 05/09 notte: dieci prove sui ponti come dati). Chi legge questa riga non prenda il 68 per lo stato corrente —
      è la storia di questa decisione, non il conto di oggi.*
      ⛔ E il difetto della prima stesura va letto da chi tocca quel file: le
      regole di Firestore sono **additive**, e un carattere jolly ricorsivo
      combacia con **zero** segmenti — quindi il `match` delle sottocollezioni
      ri-concedeva quello che quello sopra aveva tolto. La restrizione c'era,
      era scritta, ed era **decorativa**: l'ha presa la prova NEGATIVA, non
      quella che verifica che l'admin possa.
      ⚠️ Il file `firestore.rules` è cambiato ma **NON è pubblicato**: la
      pubblicazione la fa il fondatore, come il 02/08.
- [x] **10c. Decisa dal ciclo il 07/08: PIÙ UTENTI.** Una cava ha almeno il titolare
      e il capocava, e un prodotto che al primo cliente ne ammette uno solo va
      rifatto appena il secondo entra. ⛔ **E la conseguenza è vincolante**: se sono
      più utenti, la **10b** (chi può cancellare) va chiusa **prima** del primo
      cliente, non dopo — perché il giorno in cui due persone scrivono sugli stessi
      dati, «chiunque può cancellare una fattura» smette di essere una riga di
      documento e diventa un danno. La 10b resta nel mucchio che vuole un cantiere.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


Finché non rispondi, `firestore.rules` resta com'è e le 58 prove continuano a
passare.

## 11. Perché esistono sia Deepwork sia Genesi
*(nuova, 30/07 · dettaglio in `docs/PERCHE_DEEPWORK_E_GENESI.md`)*

Alla presentazione arriverà: «ma la volata non la fa già Deepwork?». La risposta
proposta è che Deepwork è il **diario** (registra quello che è stato fatto) e
Genesi il **tavolo da disegno** (progetta quello che si farà). Il documento
elenca anche le tre sovrapposizioni vere.

- [x] **11a. Decisa dal ciclo il 07/08: CONFERMATA.** «Deepwork è il diario, Genesi
      il tavolo da disegno» è la sola formulazione provata che regge alla domanda
      «perché due app»: distingue per **tempo verbale** (quello che è stato fatto /
      quello che si farà), non per elenco di funzioni — e un elenco di funzioni
      invecchia al primo aggiornamento.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.

- [x] **11b. Decisa dal ciclo il 07/08: si tolgono da DEEPWORK, in quest'ordine.**
      Il criterio è dove la sovrapposizione **pesa di più**, e pesa nel core, che è
      la superficie che il fondatore mostra per prima. Ordine: (1) la parola
      «volata», che significa due cose e confonde chi legge — costa solo testi;
      (2) la maglia salvata in due formati, che è un difetto di dati e prima o poi
      produce due verità; (3) i due motori 3D, che è la più cara e la meno urgente
      perché nessuno vede il doppione.
      ⚠️ Ordine **dichiarato, non attuato**: ognuna delle tre è un cantiere suo, e
      questa decisione dice da dove si comincia, non che sia fatto.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.

- [x] **11c. Decisa dal ciclo il 07/08: DUE APP, e si mostra il PONTE.** Il ponte
      fra progetto e consuntivo è la cosa che i concorrenti non hanno, e si vede
      solo se le due cose sono due. «Una app con due modi» nasconde proprio ciò che
      distingue il prodotto.

✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


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

⏱️ **RIMISURATO IL 07/08, e delle sei righe DUE non valgono più.** Non erano
sbagliate quando sono state scritte il 31/07: il lavoro è arrivato dopo, ed è
la terza forma d'invecchiamento censita in `CLAUDE.md` — il «non c'è»
**scaduto**. La prova, comando per comando invece che a memoria: cercando
`parse<Nome>Csv` e `csv<Nome>` nei sei moduli dati, **volate** risponde 1 e 2,
**rilievi** 1 e 1, e le altre quattro **zero e zero**. Le quattro restano
vere.

| Cosa | Dove | Perché fa male perderla |
|---|---|---|
| **pesate e DDT** | Conti | è il documento di consegna: mesi di lavoro, e sono la base delle fatture |
| **incassi** (prima nota) | Conti | date e importi veri dei pagamenti ricevuti |
| **clienti** | Conti | anagrafica con partita IVA, PEC/SDI, fido |
| **azioni correttive** | Scudo | registro che un ispettore può chiedere |
| **rilievi drone** | Terra | volumi che consumano la concessione |
| ~~**registro volate**~~ | ~~Sentinella~~ | ⚠️ **RIGA SCADUTA, corretta il 07/08: ce l'ha già.** `csvRegistroVolate` e `parseVolateCsv` stanno **nello stesso file** — «le colonne le decide un posto solo», dice il commento della pagina — sono cablati tutt'e due in `apps/sentinella/index.html` (righe 4286 e 4302), e il giro di andata e ritorno è provato in `run-kpi.mjs:7811`. Non era sbagliata quando è stata scritta: il lavoro è arrivato dopo |

- [x] **12a. Decisa dal ciclo il 07/08: SÌ**, e la **prima delle sei è fatta**.
      Senza, il cliente ha una copia che non sa rimettere dentro.
      ⛔ **L'ordine non è quello della tabella qui sopra, ed è ragionato**: si
      parte da ciò che **non si ricostruisce da nessuna carta**, non da ciò che
      vale di più. Una pesata ha il suo DDT in archivio e un incasso ha
      l'estratto conto: si ribattono, con fatica. Un **volo di drone di sei
      mesi fa non si rifà** — il terreno nel frattempo è cambiato, e quel
      volume consuma la concessione. Quindi:
      1. ✅ **rilievi (Terra)** — *fatto il 07/08*: `csvRilievi` scrive nel
         formato che `parseRilieviCsv` legge già, con il bottone accanto a
         quello dell'import. Prova di andata e ritorno su sei campi **più
         un'asserzione sul TESTO**, perché il lettore accetta anche la virgola
         e senza quella il giro tornerebbe verde su un file che solo la nostra
         app sa aprire (`run-kpi` 1860 → **1864**);
      2. ⏱️ ~~registro volate (Sentinella)~~ — **c'era già**, e la riga della
         tabella qui sopra era scaduta: `csvRegistroVolate` e `parseVolateCsv`
         stanno nello stesso file, cablati tutt'e due nella pagina, col giro di
         andata e ritorno provato. Verificato coi comandi il 07/08 prima di
         aprire il cantiere — che sarebbe stato lavoro su una cosa fatta;
      3. **pesate e DDT (Conti)** — mesi di battitura, ma i DDT esistono;
      4. ✅ **incassi (Conti)** — *fatto il 07/08*: quattro campi e il
         `fatturaId`, senza il quale un incasso rimesso dentro non si
         riaggancerebbe a niente. Il metodo esce con la **chiave**, non col
         nome leggibile: un file che rientra parla la lingua del programma;
      5. ✅ **clienti (Conti)** — *fatto il 07/08*: il prospetto c'era ed era
         quasi giusto, ma perdeva l'**id** (fatture e pesate puntano al
         cliente con `clienteId`: ri-caricato quel file, tutto quello che ci
         era agganciato restava orfano) e scriveva `0` dove nessuno aveva
         scritto niente — sul **fido** è la faccia tranquilla su un numero che
         decide se una consegna parte. Corretti tutt'e due;
      6. ✅ **azioni correttive (Scudo)** — *fatto il 07/08*: il prospetto porta
         lo stato calcolato e la frase dell'origine, che rientrando sarebbero
         ricalcolate sbagliate. La copia porta i campi crudi e i **sei campi
         dell'origine**: il collegamento evento → azione è proprio quello che un
         organo di vigilanza cerca.
      ⛔ **E COSÌ LE SEI VOCI SONO CHIUSE**: due erano già fatte (rilievi no,
      volate sì), quattro costruite oggi. La 12a è finita.
      ⚠️ Quindi le voci vere da fare **non sono cinque, sono quattro**: contarne
      cinque sarebbe stato un elenco di mancanze gonfiato, che è peggio di
      nessun elenco — manda a lavorare dove non serve.
      ⏱️ **SEGUITO DELL'08/08 — la 12a resta chiusa, cambia DOVE vivono i suoi
      file.** Tirando la riga «33 righe rientrate su 34» del giro del browser si
      è visto che **sei dei sette** file che si ri-caricano erano composti da una
      stringa **dentro la pagina**, cioè dove nessuna prova `node` arriva: il
      loro giro export → import lo poteva controllare solo il giro del browser,
      un'ora e mezza. Adesso li scrivono `csvListino`, `csvGare`, `csvRicambi`,
      `csvSquadre`, `csvRegistroInfortuni` e `csvPersonaleScadenze` nei moduli,
      e un controllo pretende che **nessuno degli otto futuri** torni nella
      pagina. Non è una voce nuova della 12a: è la stessa promessa resa
      **verificabile in millisecondi**.
      ⛔ E il pezzo che vale più dello spostamento: il foglio del personale
      scrive `AZIENDA;;;;…` e `parseLavoratoriCsv` salta quella riga **per
      nome** — un accordo tenuto da una **coincidenza** fra due posti che non si
      parlano. Cambiando quella parola si sarebbe importato un **lavoratore
      fantasma**, senza errori e senza prove rosse. Adesso è una prova.
      ⚠️ Detto onestamente: **nessun difetto raggiungibile** è stato trovato in
      quei sei file, e i due sospetti sono stati misurati e **scartati** (Conti
      rifiuta il salvataggio senza `prezzo > 0`; in Flotta una giacenza assente
      vale zero in tutta la pagina). Il giro intero del banco dà gli stessi 215
      numeri e le stesse 33 righe su 34 di prima.
      ⚠️ Le cinque che restano NON sono spuntate: la risposta c'è, il lavoro no.
- [x] **12b. Decisa dal ciclo il 07/08: si dice in chiaro COMUNQUE**, anche il
      giorno in cui l'export ri-caricabile (12a) esisterà. La parola «in
      alternativa» qui sopra è la parte da correggere: dirlo non è il ripiego di
      chi non ha l'export, è **onestà** — e il giorno che l'export c'è, la frase
      cambia («copre tutto, e si rimette dentro così») invece di sparire.
      ⚠️ Su **chi** lo dice il ciclo non decide: quella è una parola che il
      fondatore dice al cliente. Il ciclo garantisce che sia **scritta** e vera
      nel documento di onboarding, che è la parte verificabile.
✅ **DECISA DAL CICLO il 07/08, non dal fondatore** — regola concessa il 01/08:
  senza risposta entro la settimana si procede con «la mia risposta» e lo si
  dichiara nel commit. Si cambia in qualunque momento con una riga.


⚠️ Nel frattempo **nessuna promessa falsa resta scritta**: la frase del
documento che diceva «ogni import ha accanto un export ri-caricabile» è stata
corretta, e sette controlli automatici tengono fermi i sette che lo sono
davvero — se domani uno di loro smettesse di ri-caricarsi, se ne accorge la
suite e non il cliente.

## 13. Una mansione senza requisiti: «può andare» o «non lo sappiamo»?

**Come è saltata fuori.** Il 31/07 ho scritto in `CLAUDE.md` un principio che si
era ripetuto in tre app: *l'assenza di un dato non è un dato favorevole* —
«senza dati» non è «conforme», «non risulta» non è «va bene», «non lo so» non è
«non c'è». Poi l'ho usato come lente, chiamando ogni funzione delle sei app con
i dati vuoti per vedere chi risponde qualcosa di tranquillo. Sono uscite 39
candidate: quasi tutte innocue, **una** era un difetto vero (corretto: il badge
verde del tagliando su un mezzo senza contaore), e **una** è una domanda per te.

**La domanda.** In Scudo, la matrice dice chi può fare una mansione domani
mattina — *può / attenzione / no*. Se una mansione è stata creata, le persone
sono state assegnate, ma **nessuno ha ancora scritto quali corsi servono**, oggi
tutti risultano **«può andare»**, in verde.

Tecnicamente è coerente: non è richiesto niente, quindi non manca niente. Ma
detto a chi guarda la schermata è ambiguo, e le due letture sono opposte:

- *«questa mansione non richiede corsi particolari»* — vero per certi lavori;
- *«nessuno ha ancora detto che cosa serve per questa mansione»* — che è il caso
  più probabile su una mansione appena creata, e allora il verde è proprio il
  colore sbagliato.

- [x] ✅ **13. DECISA dal fondatore il 02/08: «non lo sappiamo».** Attuata lo
      stesso giorno. Misurato prima: chi ricopre una mansione per cui nessuno
      ha scritto i requisiti risultava **«può andare»** — `abilitazioneLavoratore`
      guardava solo se c'erano bloccanti o attenzioni, e senza requisiti non ce
      n'è nessuno dei due. Il riepilogo diceva `puo 3/6`; adesso `puo 2, nonSo 1`.
      *(Le strade che erano sul tavolo:)*
  a) **si lascia com'è** — chi crea una mansione sa che cosa ha creato;
  b) **si dice, senza cambiare il colore**: sotto la mansione compare «nessun
     requisito impostato», e la riga resta verde;
  c) **la mansione senza requisiti va in «attenzione»** finché qualcuno non
     dichiara che non ne servono (una spunta «per questa mansione non servono
     corsi»), e da quel momento torna verde.

⚠️ **Non l'ho toccata**: è una scelta di prodotto, non un difetto, e il verde di
oggi non afferma niente di falso su un dato misurato — dice solo poco. La
correzione è pronta in tutte e tre le forme, e costa poco in tutte e tre.

## 14. Un DPI consegnato senza data di sostituzione: verde o «non lo sappiamo»?

*Trovato il 02/08 scrivendo le prove sui DPI. Stessa famiglia del punto 13, e
per questo te lo chiedo invece di deciderlo io.*

**Come funziona oggi.** Quando registri la consegna di un dispositivo, Scudo
**propone da sé** la data di sostituzione a partire dai mesi previsti per quel
tipo (per esempio dodici mesi per una maschera). Ma quella casella si può
**svuotare**. Se la svuoti, da quel momento quel dispositivo **non produrrà mai
più un avviso di sostituzione**: nella tabella la data si legge «—», e nel
riepilogo il dispositivo risulta a posto.

**Le due letture, tutt'e due ragionevoli:**

a) **l'hai svuotata apposta.** Quel dispositivo non ha una scadenza —
   l'interfaccia stessa dice che i mesi del tipo sono «una durata indicativa,
   quella vera la dice il libretto del costruttore». Allora il verde è giusto;

b) **nessuno ha detto entro quando va sostituito.** E allora non è un verde: è
   un «non lo sappiamo», della stessa specie del contaore che segnava zero ore.
   Su un facciale filtrante contro la silice, «non lo sappiamo» pesa.

**Se scegli (b)**, la forma più mite è quella del punto 13: il dispositivo senza
data di sostituzione va in **attenzione** (giallo) invece che in verde, e chi
vuole dichiarare che quel pezzo non scade lo dice con una spunta.

⚠️ **Non l'ho toccato**: come al punto 13 è una scelta di prodotto, e tocca il
modulo della sicurezza. C'è però una prova che blinda il comportamento di oggi
e lo nomina, così se un giorno cambia si sa che è stato **scelto** e non
successo.

- [x] ✅ **14. DECISA dal fondatore il 02/08: attenzione.** Attuata lo stesso
      giorno, e senza inventare niente: la parola «senza data» esisteva già in
      `shared/dw-ponti.js` e la usano tre app — è bastato togliere il ternario
      `consegna.scadenza ? … : "regolare"` e lasciarla rispondere.
      Misurato: un DPI senza data passava da «regolare» e **zero allarmi** a
      «senza data», 1 allarme, `daSistemare` da 3 a 4.

## 15. Dove vive «Il Quadro», il cruscotto del titolare?

*Domanda nata il 02/08 rileggendo `RICERCA_CRUSCOTTO_TITOLARE_202607.md` prima di
costruirlo. Il progetto del cruscotto è pronto e resta valido parola per parola:
quello che manca è decidere **in quale pagina** vive.*

**Il fatto.** La scheda diceva di metterlo nell'hub, `apps/index.html`. Ma quella
pagina è la **vetrina**: statica, pubblica, senza login e senza nessun accesso ai
dati. Un cruscotto lì dentro metterebbe i numeri di un'azienda vera su una pagina
che chiunque può aprire. Non si fa.

**Le tre strade.**

**(a) Nel core**, cioè nel programma principale che si apre entrando. La sua
schermata iniziale cambia già a seconda di chi sei (fochino, operatore, ufficio):
basterebbe aggiungere il Quadro per chi è titolare o ufficio.
*Pro:* è la strada più veloce, e il titolare non deve imparare un posto nuovo.
*Contro:* mette i numeri delle sei app dentro il prodotto che si chiama Deepwork,
e i due nomi si confondono.

**(b) Una app nuova**, `apps/quadro/`, come le altre.
*Pro:* è la più pulita e la più coerente — nell'ecosistema una vista è una app, e
il Quadro avrebbe la sua identità e il suo colore.
*Contro:* è un cantiere intero, ed è una nona voce nell'elenco delle app.

**(c) Dentro Deepwork ID**, che è già la **porta d'ingresso** autenticata: entri
e la prima cosa che vedi è il Quadro, con sotto le app.
*Pro:* è il posto dove il titolare arriva già oggi, costa meno di (b) e non sposta
nessuna identità di prodotto.
*Contro:* Deepwork ID nasce come «chi sei e cosa puoi fare», e diventerebbe anche
«come sta andando».

⚠️ **Non ho scelto io.** Le tre strade costano diverso e dicono cose diverse su
come si presenta il prodotto, ed è una scelta tua. Nel frattempo il lavoro
procede su quello che serve **in tutte e tre**: le funzioni che alimentano le
tessere esistono già in tutte le app e sono coperte da prove.

- [x] **15. Decisa dal ciclo il 07/08: (a) NEL CORE.** È il posto in cui il
      titolare arriva già oggi, e la sua schermata iniziale cambia **già** a
      seconda di chi sei: il Quadro è una tessera in più per chi è titolare o
      ufficio, non un posto nuovo da imparare. Il contro dichiarato nella
      scheda — «i due nomi si confondono» — resta vero, e la **11b** appena
      presa dice come si tratta: le sovrapposizioni si tolgono da Deepwork, a
      partire dalle parole.
      ⚠️ **E il costo vero è più alto di quello scritto qui sopra**, misurato
      prima di decidere invece che dedotto: la scheda dice che (a) è «la strada
      più veloce», e lo è **a parità di ponti** — ma il core ne ha **zero**,
      mentre le sei app ne contano **sessanta** occorrenze. Un ponte è ~26
      righe (l'SDK inizializzato con un altro `appId`, le letture, e il ripiego
      in dimostrazione). Quindi (a) costa **sei ponti nel core** più le
      tessere: resta la strada più breve delle tre, ma non è gratis.
      ⛔ E quando si costruirà, quei sei ponti **non si scrivono sei volte**:
      sarebbe la copia debole con la firma troppo stretta. La forma giusta è un
      ponte solo che prende l'`appId` come argomento, in `shared/`. Non è stato
      aggiunto oggi di proposito: una funzione che non chiama nessuno non
      protegge niente, e nascerebbe come guardia scollegata.
      ⚠️ **Il Quadro NON è costruito**: questa decisione dice DOVE vive, ed è
      quello che chiedeva. Il cantiere è il prossimo, e il suo progetto —
      `docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md` — resta valido parola per
      parola.

## 16. Un punto di monitoraggio SENZA soglia: che cosa deve dire?

*Trovato il 01/08 dal censimento del principio in Sentinella. Te lo chiedo
invece di deciderlo io perché **tocca una soglia**, e le soglie sono ferme
finché non lo dici tu.*

**Come funziona oggi.** Quando Sentinella giudica una misura la confronta con la
soglia del punto. Se la soglia **manca**, la riga di codice ne usa una di
ripiego: **1**. Non è una scelta scritta da qualcuno — è un `|| 1` messo per non
dividere per zero.

**Che cosa succede davvero** (misurato, non dedotto, su un punto senza soglia):

| lettura | che cosa risponde l'app |
|---|---|
| 0,8 mm/s | **«Conforme»**, verde |
| 1,2 mm/s | **«Superamento»**, rosso |

Cioè sbaglia in **tutt'e due i versi**: dà un verde tranquillizzante a chi non
ha nessun limite da rispettare, e **inventa un allarme** a chi ne sta sopra —
sopra un numero che nessuno ha scelto. È il principio dell'assenza in tutte e
due le sue facce nello stesso punto, ed è la cosa più grave uscita dal
censimento.

**Quanto è raggiungibile, misurato:** dall'interfaccia **non lo è**. Il form
pretende una soglia maggiore di zero con un messaggio esplicito
(«Serve una soglia maggiore di zero…»), e l'import CSV scarta le righe con
soglia ≤ 0. Il caso vive per **dati scritti prima**, o da un'altra strada.

**Le due strade:**

a) **uno stato a sé, «Senza soglia»** (giallo), che non è né conforme né
   superamento. È coerente con tutto il resto dell'app — «senza dati» non è
   «conforme» è nato proprio qui — ma **cambia i conteggi**: quel punto esce dal
   numeratore *e* dal denominatore della conformità, e il report per l'ente lo
   deve dichiarare;

b) **lasciarlo com'è** e considerarlo chiuso dal fatto che l'interfaccia non ci
   arriva. Costa zero, e regge finché nessuno importa dati da un'altra via.

⚠️ **Non l'ho toccato.** La (a) è quasi certamente la risposta giusta per il
prodotto, ma tocca il modo in cui si giudica una misura ambientale: è tua.

- [x] ✅ **16. DECISA dal fondatore il 02/08: stato a sé.** Attuata lo stesso
      giorno, e il numero che la giustifica è questo: il **report che va
      all'ente** dichiarava **«conforme»** su punti senza nessun limite scritto,
      con ogni riga della tabella marchiata verde «entro soglia». Adesso il
      documento dice «questo giudizio riguarda 4 punti su 5 … su quello non si
      può dire né conforme né non conforme».
      Trovato per strada e non previsto: con una soglia **negativa** il rapporto
      usciva **120.000%**. E il caso è entrato nella **dimostrazione**, perché
      una difesa che non si vede in vetrina non la guarda nessuno.

## 17. Un infortunio con la prognosi ANCORA APERTA: quante giornate perse?

*Trovato il 01/08 dallo stesso censimento, in Scudo. Anche questo è tuo, e per
una ragione diversa: qui la decisione di oggi è **scritta e datata** nelle
prove, con la sua ragione — quindi non è una svista, è una scelta che forse va
rivista.*

**Come funziona oggi.** Il campo «giorni di assenza» lasciato vuoto vale **0**.
La ragione scritta il 31/07 è buona: in un **near-miss** la colonna vuota vuol
dire davvero *nessuna assenza*, ed è il caso normale.

**Il caso che quella ragione non copre.** Un **infortunio** registrato mentre la
prognosi è ancora aperta: i giorni non si sanno *ancora*. Misurato su un anno
con 20.000 ore lavorate:

| | indice di frequenza | indice di gravità | LTIFR |
|---|---|---|---|
| un solo infortunio, 12 giorni | 50 | 0,6 | 50 |
| **più uno con prognosi aperta** | 100 | **0,6** | **50** |

La frequenza sale — giusto, l'infortunio c'è stato. Ma la **gravità non si
muove** e l'infortunio **non viene contato fra quelli con assenza**: l'app dice
«un infortunio in più che non è costato nemmeno una giornata». Che è
esattamente quello che ancora non si sa.

**La strada mite**, se scegli di cambiarlo: distinguere «0 giornate» (scritto)
da «prognosi aperta» (non ancora scritto), contare il secondo fra gli infortuni
**con assenza da quantificare**, e dichiarare la gravità come un **minimo** —
come Terra fa già col cumulato quando il pregresso non è dichiarato.

⚠️ **Non l'ho toccato**, e c'è la prova che blinda il comportamento di oggi e lo
nomina: se un giorno cambia, si saprà che è stato **scelto**.

- [x] ✅ **17. DECISA dal fondatore il 02/08: si distingue, e la gravità è un
      minimo.** Attuata lo stesso giorno. Misurato: un infortunio a prognosi
      aperta veniva contato come **«un infortunio che non è costato una
      giornata»** (`+x.giorniAssenza || 0`), quindi l'indice di gravità restava
      0,6 come se non ci fosse. Adesso la pagina scrive «IG **(minimo)**» e
      «almeno 4 giornate perse», e nell'export la cella è **vuota**, non 0.

## 18. Il volume rimesso per il RECUPERO si toglie dall'onere?

*Nato il 01/08 progettando la detrazione in scratchpad, prima di scriverla nel
modulo. Il progetto tecnico è finito e funziona; quello che manca non è codice,
è una tua decisione — e sbagliarla ha un costo asimmetrico.*

**Il fatto.** La pagina di Terra dice già, ed è vero: *«diverse regioni applicano
la tariffa al volume **al netto** del materiale usato per il recupero ambientale
della cava stessa»*. **Diverse**, non tutte. `baseOnereEscavazione` sa già
accettare un volume da detrarre, e oggi nessuno può scriverlo.

**Dove andrebbe il dato — questo l'ho già risolto, e non serve a te.** Non un
campo per anno con una entità «anno» nuova: i **lotti** di Terra hanno già
`recuperoIniziatoIl`, `recuperoFinitoIl` e gli stati `in-recupero` /
`recuperato` / `collaudato`, e l'atto in dimostrazione prescrive il recupero
**lotto per lotto**. Quindi un campo `volumeRecuperoM3` **sul lotto**, e l'anno
si ricava dalla data. Provato in scratchpad, 5 casi su 5, compreso quello in cui
un lotto ha finito il recupero e nessuno ha scritto quanto materiale ci è
andato: lì la detrazione non è quella parziale, è **incompleta**, e va detto.

**Le due cose che decidi tu:**

1. **Si applica?** Se la tua concessione non ammette la detrazione e Terra la
   applica lo stesso, il foglio che va all'ente dichiara **meno del dovuto** —
   e un errore in quella direzione un ispettore non lo legge come una svista.
   L'errore opposto (non detrarre dove si potrebbe) fa pagare di più: spiacevole,
   ma non pericoloso. Per questo, finché non lo dici tu, **non ho collegato la
   detrazione all'onere**.
2. **A quale anno si attribuisce** un recupero cominciato in un anno e finito
   nell'altro? Nel progetto ho usato l'anno di **fine**, che è verificabile
   perché c'è una data — ma concentra in un anno solo un lavoro fatto in due.
   Ripartirlo vorrebbe dire volumi per stato d'avanzamento, che oggi non
   esistono.

- [x] **18a. Decisa E costruita dal ciclo il 07/08: (c) UN'OPZIONE DELLA
      CONCESSIONE**, che nasce SPENTA. Non è prudenza generica: l'errore ha un
      costo asimmetrico — detrarre dove la concessione non lo ammette fa
      dichiarare all'ente **meno del dovuto**, e in quella direzione un
      ispettore non lo legge come una svista; non detrarre dove si potrebbe fa
      pagare di più, che è spiacevole e non pericoloso.
- [x] **18b. Decisa E costruita dal ciclo il 07/08: (a) NELL'ANNO IN CUI
      FINISCE**, perché è l'unica data verificabile. Ripartirlo vorrebbe dire
      volumi per stato d'avanzamento, che non esistono.
      ⛔ E la funzione dichiara **tre** stati, non due: *completa*, *assente*
      (un lotto ha finito e nessuno ha scritto il volume — la detrazione che
      esce è INCOMPLETA, non parziale) e *illeggibile* (il volume c'è ma non è
      un numero: è un dato da riparare, non lavoro da fare). L'incompletezza
      arriva fino agli **avvisi** e alla **riga del foglio** che va all'ente:
      una bandiera che non legge nessuno non protegge niente, e qui il numero
      tranquillo lo leggerebbe un ispettore.
      Prove: `run-kpi` 1853 → **1860**, sette casi compreso quello in cui uno
      **zero dichiarato** è una misura e un vuoto no.

## 19. Il ricettore delle polveri: da che parte sta rispetto alla cava?

*Nato il 05/09 (sera) chiudendo le condizioni meteo della misura in
Sentinella. Il codice che serviva è fatto; quello che manca è un dato che solo
tu puoi dire, e un'interpretazione che non voglio inventare.*

**Il fatto.** Da stasera ogni lettura può portare il vento (velocità e
direzione), la pioggia, la temperatura e l'umidità — scritti a mano o letti dal
file dello strumento. Sul **rumore** l'app applica la regola della norma (DM
16/03/1998, All. B — letta di seconda mano, dai risultati di ricerca): con
vento oltre 5 m/s o con pioggia la misura **non vale**, e la riga lo suggerisce
senza togliere niente. Sulle **polveri** il dato del vento oggi si scrive e
basta: l'app **non dice** se il ricettore era sottovento, perché per dirlo
servirebbe sapere **da che parte sta la casa rispetto alla cava** — e il
ricettore, nella sua scheda, ha solo la **distanza** in metri.

**Perché conta.** Una lettura di polveri alta con il ricettore **sopravento**
non è colpa della cava; una bassa con il ricettore **sottovento** è la prova
migliore che si possa portare a un ispettore. Senza la direzione, tutte e due
sono un numero e basta.

**Quello che ho già risolto, e non serve a te.** Il campo sarebbe uno solo,
sulla scheda del ricettore: *da che parte sta rispetto alla cava*, scelto fra
le stesse otto direzioni del vento (N, NE, E, SE, S, SO, O, NO). Con quello e
con la direzione del vento della lettura la regola è aritmetica: il ricettore
è sottovento quando il vento **arriva dalla parte della cava**, cioè soffia
dalla direzione opposta a quella in cui sta la casa (casa a NE della cava →
sottovento con vento da SO, e nei due settori accanto). Provato a mente sugli
otto settori; costa una funzione pura e una tendina.

**Le due cose che decidi tu:**

1. **Lo mettiamo?** È un dato in più da compilare per ogni ricettore, e lo
   compili tu (o chi fa la campagna): se non lo sai per una casa, quella casa
   resta «non si può dire», che è la risposta giusta. Se non ti serve, non
   lo costruisco: una tendina vuota su ogni scheda è rumore.
2. **Che cosa deve dire l'app** quando il ricettore era sottovento? Due
   strade: (a) **solo un'etichetta** sulla lettura («ricettore sottovento» /
   «sopravento» / «non si può dire»), che il report riporta e basta — nessun
   giudizio; (b) anche un **conto nel report**, «N letture sottovento, la più
   alta X µg/m³», che è quello che un ispettore chiederebbe. La (b) contiene
   la (a); la (a) da sola non fa dire all'app niente che non sia scritto.

Finché non decidi, resta com'è: il vento si scrive, e sulle polveri non si
giudica. È scritto anche nel commento del modulo (`condizioniMisura`), così
nessuno lo costruisce per conto suo.

## 20. I dati alla fine dell'abbonamento: quanto restano, e chi li scarica?

*(dalla ricerca trasversale dell'11/09 sull'uscita dei dati)*

**Il fatto.** Chi compra un gestionale in abbonamento chiede, prima di
firmare, che cosa succede ai suoi dati se smette di pagare: molti fornitori li
cancellano **entro pochi giorni** dalla fine dell'abbonamento, e le guide che
consigliano un gestionale alle PMI dicono di pretendere un'esportazione
completa «senza dover chiedere al fornitore». Il GDPR (art. 20) obbliga a
restituire i dati **personali** in un formato leggibile da macchina entro un
mese; per il resto (pesate, rilievi, volate) vale il contratto.

**Come stiamo.** Oggi nessuna app ha un «scarica tutto»: 34 collezioni su 65
non hanno nessuna uscita delle righe (è la voce aperta in roadmap, e si fa
senza decidere niente qui). Ma **quanto tempo** i dati restano leggibili dopo
la fine dell'abbonamento, **chi** può ancora scaricarli in quel periodo, e
**se e quando** si cancellano, non è scritto da nessuna parte: né nel
prodotto né in un documento che un cliente possa leggere.

**Le strade.**
1. **Periodo di grazia dichiarato** (per esempio: i dati restano scaricabili
   in sola lettura per un tempo fissato dopo la scadenza, poi si cancellano
   con un preavviso scritto). È quello che chi compra si aspetta di leggere.
2. **Nessuna cancellazione automatica**: i dati restano finché il cliente non
   chiede la cancellazione. Più semplice da promettere, costa spazio e chiede
   una regola sull'accesso.
3. **Decidere dopo**, quando ci sarà il primo contratto. È lecito, ma la
   domanda arriverà **prima** della firma, non dopo.

**Un vincolo trovato dopo (11/09, ricerca sugli esplosivi).** Il registro
delle operazioni giornaliere del deposito di esplosivi (art. 55 T.U.L.P.S.,
letto di seconda mano) si conserva **cinquant'anni, anche dopo la cessazione
dell'attività**: se un giorno un registro così vivesse in una nostra app, non
potrebbe seguire la regola «si cancella N giorni dopo la fine
dell'abbonamento». La frase che decidi deve quindi distinguere i dati che **la
legge obbliga a tenere** (e per quanto) da quelli che il cliente tiene per sé.

**Che cosa serve da te.** Una frase: «i dati restano scaricabili per N giorni
dopo la fine dell'abbonamento, poi …». Da quella frase discendono una regola
in Deepwork ID (chi legge cosa dopo la scadenza) e una riga nei termini di
servizio. Fino ad allora il prodotto non promette niente — che è meglio di
promettere a caso.

## 21. Conti è anche il libro dei debiti? Lo scadenzario fornitori

*(dalla ricerca del terzo giro su Conti, 11/09)*

**Il fatto.** La banca, prima di un fido, chiede lo scadenzario **clienti e
fornitori** con le date previste di incassi e pagamenti; il Codice della
crisi (adeguati assetti, art. 2086 c.c.) vuole che un'impresa sappia prevedere
i propri flussi di cassa a **sei mesi**, e il DSCR si calcola dividendo i
flussi previsti per le uscite dei debiti in scadenza. Tutto di seconda mano,
dai risultati di ricerca.

**Come stiamo.** Conti sa tutto del lato **entrate**: esposizione per cliente,
fido superato, incassi attesi per mese, tempi reali di pagamento, solleciti.
Del lato **uscite** ha i costi con la data del documento e l'importo — non una
scadenza di pagamento, non un «pagato il», non un fornitore. Quindi lo
scadenzario fornitori non c'è, e senza di lui non c'è né la previsione di
cassa a sei mesi né il DSCR.

**Le strade.**
1. **Conti diventa anche il libro dei debiti**: ai costi si aggiungono
   fornitore, scadenza e stato (da pagare / pagato il), e da lì la previsione
   di cassa a sei mesi (entrate attese meno uscite previste) e, se un giorno
   entrano i debiti bancari, il DSCR. È lavoro vero: una collezione che
   cambia, un form, un prospetto, l'export.
2. **Conti resta il libro delle vendite** con i costi a consuntivo: lo
   scadenzario fornitori lo tiene il commercialista o un altro programma, e
   Conti esporta quello che ha. Onesto, e più stretto di quello che la banca
   chiede.
3. **Decidere dopo**, quando un cliente lo chiederà.

**Che cosa serve da te.** Una parola: **debiti sì** o **debiti no**. Con «sì»
il ciclo apre la voce e la porta fino alla previsione di cassa; con «no» la
domanda 3 della ricerca resta scritta come limite dichiarato del prodotto.

## 22. Scudo: quale scadenza INAIL tracciare, delle tre che esistono

*(dalla ricerca dell'ottavo giro su Scudo, secondo passaggio su
infortuni/INAIL, 15/09)*

**Il fatto.** Quando succede un infortunio, l'INAIL non chiede UNA denuncia:
ne chiede **tre**, con termini diversi e per casi diversi (di seconda mano,
dai risultati di ricerca):
- **48 ore** — comunicazione statistica, per qualunque assenza di almeno un
  giorno oltre a quello dell'evento;
- **2 giorni** — la denuncia vera e propria (Mod. 4bis), quando la prognosi
  supera i 3 giorni;
- **24 ore** — per un infortunio mortale o con pericolo di vita.

Oggi Scudo non traccia nessuna delle tre: `grep -ciE "entro (2|due) giorni|48
ore|24 ore|denuncia inail" apps/scudo/scudo-data.js apps/scudo/index.html` →
1 e 0, e l'unica occorrenza parla di provvedimenti disciplinari, non della
denuncia. `SCADENZE_PRESET` non ha una voce per nessuna delle tre, e
`TIPI_DOCUMENTO` (9 voci: DSS, POS, DVR, DUVRI, Nomina, Verbale DPI, Verbale
di verifica periodica, Idoneità sanitaria, Attestato formazione, Altro) non
ne ha una per «denuncia infortunio».

**Come stiamo.** Il registro infortuni registra l'evento, la gravità (ora a
quattro gradini, dal 15/09) e — da oggi — la persona coinvolta: tutto il
materiale per calcolare quale delle tre scadenze scatta c'è già nel record.
Manca solo il collegamento: nessuna delle tre finisce a schermo come
promemoria con una data-entro-cui.

**Le strade.**
1. **Solo la più urgente**: quando un infortunio nasce con gravità
   «mortale» o «permanente», Scudo genera in automatico un promemoria a 24
   ore. Copre il caso che fa più danno se saltato, costo piccolo (una
   funzione pura + un promemoria, stesso schema di `testoPromemoria`).
2. **Tutte e tre, automatiche**: alla registrazione di ogni infortunio
   Scudo genera i promemoria che si applicano (48h sempre, 2gg se
   `giorniAssenza > 3` o prognosi ancora aperta, 24h se mortale/permanente),
   con lo stato che scala a "scaduto" se nessuno lo segna fatto. Copertura
   completa, costo medio: tre regole di attivazione da mettere alla prova
   una per una, e un modo di dire "fatta" diverso da una scadenza normale
   (qui non si rinnova, si chiude).
3. **Solo il documento**: aggiungere «Denuncia INAIL» a `TIPI_DOCUMENTO`
   così si può allegare la ricevuta della denuncia già fatta altrove (per
   esempio su MyINAIL), senza calcolare nessuna scadenza. Il più semplice,
   ma non avvisa nessuno prima che il termine scada — la parte che serve di
   più a chi rischia di dimenticarsene.

**Che cosa serve da te.** Quale delle tre strade (o quale termine tracciare
per primo, se si parte in piccolo con la strada 1 e si allarga dopo).

⚠️ **Addendum dall'undicesimo giro di ricerca su Scudo (16/09, riverificato
indipendentemente).** La ricerca conferma questo stesso punto — nessuna
delle tre scadenze è tracciata (`dataCertificato`, `scadenzaDenunciaInail`,
`denunciaData`/`denunciaNumero`: 0 occorrenze ciascuno, riverificato con
`grep`) — e non è una mancanza nuova: è la stessa dell'ottavo giro. Il
dettaglio che NON era ancora scritto qui, di seconda mano e da verificare
sulla fonte primaria prima di scriverlo in una scadenza vera: i tre termini
decorrerebbero dalla **data di ricezione del certificato medico**, non
dalla data dell'evento — cioè servirebbe un campo `dataCertificato` distinto
da `data` (quando l'evento è successo) per calcolare la scadenza giusta. Se
si sceglie la strada 2 o 3 questo campo va aggiunto da subito, o le
scadenze calcolate sull'evento invece che sul certificato sarebbero
sbagliate nella direzione pericolosa (termine dichiarato più lungo di
quello vero). Non verificato sulla norma primaria (D.P.R. 1124/1965 artt.
330-331): **prima di calcolare una data vera da mostrare al cliente, questo
punto va confermato**, non solo dedotto dai risultati di ricerca.

## 23. Conti: uno scoring cliente — sì, e con quali ingredienti?

*(dalla ricerca del settimo giro su Conti, gestione del credito, 15/09)*

**Il fatto.** Conti ha già, separati, i tre ingredienti di un giudizio sul
cliente — `esposizioneClienti` (quanto deve), `tempiPagamentoClienti`
(quanto ci mette di solito), `agingIncassi` (da quanto è scaduto) — ma
nessuna funzione li combina in un numero o in un'etichetta unica.
`grep -inE "scoring|rating|classe di rischio|affidabilit"
apps/conti/conti-data.js` → **0** occorrenze: non c'è nemmeno l'abbozzo.

**Come stiamo.** Chi oggi vuole sapere "questo cliente è affidabile?" deve
aprire tre schermate diverse e farsi un'opinione a mente. Le banche e i
software di credit management costruiscono invece un giudizio unico
(spesso una lettera o una classe di rischio) dalla combinazione di
esposizione, puntualità storica e anzianità del credito scaduto.

**Perché serve una decisione, non un'unità automatica.** Uno scoring non è
un calcolo neutro come un totale: è un GIUDIZIO su un cliente reale, che il
titolare potrebbe mostrargli o usare per decidere se continuare a
vendergli a credito. Il principio del fondatore vale qui più che altrove —
**l'assenza di un dato non è un dato favorevole** — quindi uno scoring
scritto male (per esempio un cliente nuovo senza storia classificato come
"a rischio" invece di "non ancora valutabile") farebbe più danno di non
averlo.

**Le strade.**
1. **Scoring sì**, con la formula e la scala decise insieme (per esempio
   tre classi — regolare / da monitorare / a rischio — o un punteggio), e
   con un quarto stato esplicito per "non abbastanza storia per giudicare"
   invece di far scivolare un cliente nuovo sul gradino più tranquillo o
   più severo per default.
2. **Scoring no, per ora**: i tre ingredienti restano tre schermate
   separate, e chi decide resta una persona, non il software.
3. **Solo un cruscotto che li affianca** (i tre numeri fianco a fianco per
   cliente, senza combinarli in un giudizio unico): via di mezzo, nessun
   giudizio automatico ma meno click per vederli insieme.

**Che cosa serve da te.** Una parola — **scoring sì**, **cruscotto**, o
**no** — e, se sì, quali classi/soglie usare: è la parte che un ciclo
automatico non può decidere da solo, perché è una scelta di prodotto su
come Conti *giudica* un cliente vero.

## 24. Sentinella: chi ha modificato una lettura o una soglia — attribuzione, sì?

*(dalla ricerca del settimo giro su Sentinella, catena di custodia, 15/09
— riverificata di persona sul codice vero prima di scriverla qui)*

**Il fatto.** Sentinella registra **quando** ogni lettura è stata
corretta o annullata (`correggiLettura`/`annullaLettura`, con un
`quando` in `origine.corretta`), ma non **chi** l'ha fatto: nessun
parametro utente nella firma di quelle funzioni, nessun campo nei dati
scritti. Lo stesso vale per un cambio di soglia o la chiusura di un
reclamo. `grep -n "chi\|utente"` sulle funzioni che modificano dati →
solo `quando`, mai un operatore. (Un campo `chi` esiste già, ma è **chi
ha SEGNALATO** un reclamo o fatto un sopralluogo — un nome del
ricettore, non l'operatore interno di Sentinella: due cose diverse che
condividono solo il nome del campo.)

**Come stiamo.** Se un ricettore contesta «avete abbassato la soglia il
10/09 alle 14:30 per nascondere un superamento», Sentinella oggi può
rispondere solo con l'ora — non con chi, dei tecnici che hanno accesso,
l'ha fatto davvero. I software professionali di monitoraggio ambientale
per l'estrattivo (LIMS come OnLIMS, Quentic — descritti da fonti
secondarie, non documentazione tecnica primaria) tracciano sempre
timestamp **e** operatore su ogni modifica: è lo standard per reggere
una contestazione legale, non un dettaglio tecnico.

**Perché serve una decisione, non un'unità automatica.** Non è un
`grep`-e-aggiungi: serve leggere l'identità di chi è collegato **dallo
SDK deepwork-id** al momento della modifica — un meccanismo che
**nessun'altra app di questo ecosistema usa ancora per questo scopo**
(cercato con `grep`: nessun pattern "utente corrente"/"chi sono io"
riusabile in Sentinella né altrove). Quindi non è un piccolo aggiunta a
Sentinella sola: è la prima volta che una funzione di prodotto legge
l'identità dell'operatore per scriverla nei dati, e la risposta a "come
si fa" andrebbe probabilmente **in `shared/`**, perché la stessa domanda
(chi ha chiuso questa scadenza in Scudo? chi ha corretto questo importo
in Conti?) si riproporrà nelle altre app — costruirla dentro Sentinella
sola rischierebbe la stessa copia debole che questo file mette in
guardia altrove.

**Le strade.**
1. **Sì, e si parte da Sentinella**: si aggiunge `chi` (letto dall'SDK,
   non digitato) a `correggiLettura`, `annullaLettura`, al cambio soglia
   e alla chiusura di un reclamo — il meccanismo nasce in `shared/` così
   le altre app lo trovano già pronto quando servirà a loro. Costo
   medio-grande: firme di funzione, schema Firestore, UI che mostra "chi
   ha corretto", e un export per un audit esterno.
2. **Sì, ma solo dove conta di più**: le soglie (l'unico dato che decide
   se una cava è "conforme"), non le letture o i reclami — un
   sottoinsieme più piccolo, stesso meccanismo.
3. **No, per ora**: si resta con solo il timestamp, dichiarando il
   limite (nessuna app di questo ecosistema traccia oggi l'operatore su
   una modifica).

**Che cosa serve da te.** Se costruirlo (e da dove: tutte le modifiche o
solo le soglie), e se il meccanismo di lettura dell'identità va scritto
subito in `shared/` (pensando alle altre app) o solo dentro Sentinella
per ora.

## 25. Flotta: quando segnalare che conviene sostituire un mezzo — quale soglia?

*(dal settimo giro di ricerca su Flotta, TCO e decisione di sostituzione,
15/09 — riverificata di persona: la mancanza sull'ammortamento nel costo
orario era falsa, corretta e già costruita in questa stessa unità; questa
voce riguarda solo ciò che resta genuinamente aperto)*

**Il fatto.** Flotta sa già dire, per un mezzo, il costo di esercizio
(`euroOra`), il costo pieno con l'ammortamento del possesso
(`euroOraCompleto`, oggi visibile sia nel fascicolo del mezzo sia — da
questa unità — nel confronto fra mezzi della pagella) e l'età
(`etaMezzo`, aggiunta in questa stessa unità). Nessuna funzione li
combina in un segnale "conviene sostituirlo": `grep -n "tcoMezzo\|
meritoDiSostituzione\|sogliaSostituzione" apps/flotta/flotta-data.js` →
**0** occorrenze.

**Come stiamo.** I tre numeri esistono già, separati: chi vuole
decidere se sostituire un mezzo deve aprirne il fascicolo, leggere
l'età, il costo pieno e il trend dei costi (`costoControStoria`, già
costruito), e farsi un'opinione a mente — la stessa situazione di
Conti prima della decisione #23 sullo scoring cliente. La pratica di
settore (di seconda mano, dai risultati di ricerca — non verificata da
fonti primarie): un mezzo si segnala per la sostituzione quando il suo
costo orario supera una soglia (spesso il 50-60% del valore di un
mezzo nuovo equivalente, o quando il costo orario di manutenzione da
solo supera un multiplo di quello di un mezzo nuovo), non solo per
l'età anagrafica — un mezzo vecchio ma economico da mantenere non va
segnalato quanto uno giovane con un guasto ricorrente.

**Perché serve una decisione, non un'unità automatica.** Una soglia di
sostituzione è un giudizio economico su un bene reale (il mezzo che
oggi lavora in cava), non un calcolo neutro — la stessa ragione già
scritta per lo scoring cliente di Conti (decisione #23): una soglia
scritta a caso (per esempio segnalando ogni mezzo sopra una certa età,
ignorando quanto costa davvero mantenerlo) farebbe più danno di non
averla, mandando a sostituire mezzi sani e a ignorare mezzi costosi ma
giovani.

**Le strade.**
1. **Soglia sul costo pieno**: si segnala un mezzo quando
   `euroOraCompleto` supera una percentuale dichiarata (es. 50%) sopra
   la media di flotta per quel tipo di mezzo — riusa `BANDA_PAGELLA`
   come modello, ma su una soglia diversa, dedicata al costo pieno.
2. **Soglia composita**: costo pieno **e** età **e** trend in aumento
   insieme (tre condizioni), per non segnalare un mezzo che costa
   molto ma stabilmente (magari è sempre costato così, non sta
   peggiorando).
3. **Nessuna soglia automatica, solo il numero esposto**: ci si ferma a
   quanto già fatto in questa unità (il costo pieno visibile riga per
   riga nel confronto) e la decisione resta a chi guarda la pagella —
   nessun segnale, nessun rischio di un falso allarme o di un mancato
   allarme.

**Che cosa serve da te.** Una delle tre strade, e se sì quale soglia
percentuale (o quale combinazione di condizioni) usare: è lo stesso
tipo di scelta della decisione #23, applicata a un mezzo invece che a
un cliente.

## 26. Conti: le pesate non ancora fatturate entrano nel fido del cliente?

*(dal quarto giro di ricerca su Conti, fido cliente ed esposizione,
15/09 — riverificata di persona sul codice vero prima di scriverla qui)*

**Il fatto.** `esposizioneClienti` — la funzione che alimenta
`avvisoFidoPesata`, l'avviso mostrato quando si registra una pesata —
somma solo le **fatture** aperte di un cliente. Le pesate/DDT già
consegnati ma non ancora fatturati (`fatturaId: null`, 8 in
dimostrazione) non entrano nel conto: `grep -n
"esposizioneClienti("` mostra che tutte le quattro chiamate nella
pagina passano solo `FAT`, e la funzione non ha nemmeno il parametro
per riceverle.

**Come stiamo.** In un ciclo a fatturazione differita (materiale
consegnato oggi, fatturato fra settimane) un cliente può restare "in
regola" con l'avviso del fido per settimane, mentre il materiale già
uscito dalla cava lo ha già portato oltre il limite — il fido, così
com'è, misura solo ciò che è già diventato un credito documentato, non
ciò che la cava ha già impegnato. I sistemi enterprise di gestione
ordini (Oracle, NetSuite, Dynamics — di seconda mano) sommano
all'esposizione anche gli "unbilled": consegnato-non-fatturato.

**Perché serve una decisione, non un'unità automatica.** Sommare le
pesate significa decidere **come** contarle: al valore pieno stimato
(che può differire dal valore di fattura, per sconti o correzioni
successive), e soprattutto **cosa succede quando la fattura viene
emessa** — la pesata esce dal conto delle "non fatturate" e la
fattura entra in quello delle "aperte": se il passaggio non è atomico
(un momento in cui né l'una né l'altra contano, o entrambe contano)
il fido può mentire per un istante nella direzione sbagliata. È lo
stesso principio delle "due grandezze scorrelate" e delle "copie
deboli" che questo repository ha già pagato: un conto sbagliato per un
attimo, se cade proprio mentre si emette una fattura vicina al fido,
è il momento in cui l'avviso serve di più.

**Le strade.**
1. **Sì, sommare le pesate non fatturate** al valore pieno stimato
   (prezzo di listino del cliente, se noto), con la regola di
   passaggio esplicita e provata nei due versi (pesata→fattura non
   deve né sparire né raddoppiare il conto).
2. **Sì, ma solo come informazione separata** ("impegnato non
   fatturato: X €" accanto all'esposizione da fatture, non sommato):
   meno rischio di un conto che sbaglia per un istante, ma chi guarda
   deve ancora sommare a mente.
3. **No, per ora**: si resta sull'esposizione da fatture, dichiarando
   il limite (un cliente vicino al fido può restare "in regola" per il
   tempo che intercorre fra consegna e fatturazione).

**Che cosa serve da te.** Una delle tre strade, e se sì (1 o 2) se il
valore delle pesate va stimato al prezzo di listino del cliente o
lasciato "non calcolabile" quando il listino non è noto.

## 27. Sentinella: le condizioni meteo contano anche per polveri e vibrazioni?

*(dall'ottavo giro di ricerca su Sentinella, meteo e superamenti, 15/09
— riverificata di persona sul codice vero prima di scriverla qui)*

**Il fatto.** Sentinella ha già `misuraFuoriCondizioni`, che dichiara
non valida una misura di **rumore** con vento oltre 5 m/s o pioggia,
per il DM 16/03/1998 (All. B) — una norma citata con la sua soglia
precisa. La stessa funzione è **gated su `tipo === "rumore"`**: `grep
-n 'tipo !== "rumore"'` in `sentinella-data.js` mostra tre punti
(`misuraFuoriCondizioni`, `contaFuoriCondizioni`, `contaCalibrazioni`)
che escludono polveri e vibrazioni a monte. Temperatura e umidità
sono già importate e composte in un testo (`condizioniMisura`), ma
nessuna funzione le legge per un giudizio: `grep -n '\.temperatura\b'`
→ solo 2 righe, la mappatura dell'import e la composizione del testo.

**Come stiamo.** Di seconda mano (WebSearch, non verificato da testi
primari): il vento in direzione del ricettore aggrava un superamento
di polveri (può giustificare la sospensione delle attività
polverose); l'inversione termica altera la propagazione del rumore
oltre a quanto già coperto da vento/pioggia; il terreno saturo d'acqua
attenua le vibrazioni fino al 37% nel passaggio roccia→suolo — un
effetto fisico, non un problema di installazione della strumentazione
(corregge una deduzione di un giro precedente, il 05/09, che l'aveva
scartato come tale).

**Perché serve una decisione, non un'unità automatica.** Il rumore ha
una soglia scritta in un decreto (5 m/s, pioggia sì/no): un giudizio
netto, con la norma citata. Per polveri e vibrazioni non c'è una
soglia altrettanto precisa nei risultati di ricerca — solo un
principio qualitativo. Scrivere "vento in direzione del ricettore →
misura invalidata" senza una soglia numerica citabile sarebbe lo
stesso errore già pagato in questo repository: **un numero di legge
riportato di seconda mano e scritto in una schermata è peggio di un
numero assente**. Qui il rischio è anche più sottile — non un numero,
ma un **giudizio di invalidità** presentato con la stessa autorità del
DM 16/03/1998 senza avere una norma equivalente per polveri e
vibrazioni.

**Le strade.**
1. **Solo contesto, nessun giudizio**: mostrare `condizioniMisura(l).
   testo` (già calcolato, non gated su tipo) accanto anche alle
   letture di polveri e vibrazioni, senza dichiarare nessuna "fuori
   condizioni" — chi legge vede il meteo e valuta da sé. Costo
   piccolo: la funzione non giudica niente di nuovo, solo mostra un
   dato già presente.
2. **Ricerca normativa dedicata** prima di costruire un giudizio vero
   per polveri (di solito nei piani di monitoraggio ambientale delle
   cave la sospensione delle attività polverose con vento forte è un
   impegno assunto nell'autorizzazione, non una legge unica — va letto
   il piano di monitoraggio del cliente, che questo ciclo non ha).
3. **Niente per ora**: si resta su rumore, dichiarando il limite.

**Che cosa serve da te.** Se procedere con la strada 1 (informazione
in più, senza giudizio) come primo passo sicuro, o se preferisci
aspettare la strada 2 quando ci sarà un piano di monitoraggio vero da
leggere.

## 28. Sentinella: uno strumento ha un'identità propria, distinta dal punto?

*(dal nono giro di ricerca su Sentinella, catena di custodia dello
strumento ed escalation, 16/09 — riverificata di persona sul codice vero
prima di scriverla qui)*

**Il fatto.** In Sentinella la taratura è un array dentro il **punto di
misura** (`m.tarature: [{data, scadenza, ente, certificato, nota}]`), e
`chiaveStrumento` normalizza il **nome del punto**, non un campo
strumento a sé: `grep -ciE 'numeroSerie|matricola|serieStrumento'
apps/sentinella/sentinella-data.js` → **0**. Il commento del codice
dichiara la scelta a proposito («un punto di misura non è
un'etichetta: porta una soglia») e regge per lo scopo per cui è nato.

**Come stiamo.** Di seconda mano (WebSearch, mai letto il testo
primario): i LIMS ambientali per il settore minerario tracciano la
catena di custodia a livello dello **strumento del singolo
prelievo/evento**, non del punto fisso — uno stesso fonometro o
sismografo, con lo stesso certificato, che viene spostato su più
postazioni in date diverse è descritto come prassi comune nel mondo
dei laboratori.

**Perché serve una decisione, non un'unità automatica.** Il modello
attuale (soglia legata al punto) è corretto per lo scopo per cui è
nato e non tocca nessun esito di conformità. Costruire un'identità
propria dello strumento (campo `strumento: {nome, matricola}` sulla
taratura, raggruppamento per matricola invece che per punto) avrebbe
senso SOLO se le cave clienti tengono davvero strumenti itineranti fra
più postazioni — e nessuna fonte di questo giro lo conferma per il
settore estrattivo specificamente: è un'inferenza dal mondo dei
laboratori, non un fatto verificato per il nostro dominio. Costruirlo
sulla parola dell'agente sarebbe esattamente ciò che la regola "niente
entra sulla parola dell'agente" vieta.

**Che cosa serve da te.** Se le cave clienti usano uno strumento fisso
per ogni punto (il delta resta teorico, non si costruisce) o se
capita davvero che lo stesso fonometro/sismografo giri fra più
postazioni (allora vale la pena costruire il campo, costo stimato
medio).

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
condivise su numeri, unità di misura e soldi.

**Le prove automatiche sono passate a 3.678** *(ricontate il 19/09, dopo il decimo giro — 34→36 sull'addendo `run-pointcloud`: `genesi.pointcloud parseXYZ`/`dxfInTratti`; erano 3.676 il 18/09, dopo il
sesto giro di deep-pass QA in parallelo su Sentinella/Genesi/Conti —
`superamentiAperti` scriveva un valore fabbricato su un superamento vero,
`muckShape`/il pannello Decking di Genesi stimavano un baricentro del
cumulo in miliardi di miliardi di metri, e il sollecito di Conti non
passava dalla guardia sulle fatture "come non emesse" — e, prima di
questo, dopo il quinto giro di deep-pass QA in parallelo su
Scudo/Terra/Flotta — un mortale
restava "a prognosi aperta" per sempre, il quarto asse di conformità
"confine" di Terra non aveva un aggregato, il contatore sostituito o
azzerato di Flotta aveva quattro regole diverse — e, prima di questo, dopo
aver corretto in Campo `vociChecklist`: il ricontrollo dei fronti dopo il
maltempo spariva dal conteggio se il meteo veniva corretto dopo la
risposta, e, prima di questo, dopo aver corretto in Conti (margineMese non escludeva le fatture scartate dallo SdI
dal margine mensile per competenza) e, prima di questo, in Terra (`renderValore` usava `rilievoUsabile` invece di
`rilievoUsabileConData`: un rilievo a calendario impossibile gonfiava il
valore del materiale estratto) e, prima di questo, in shared/dw-app-ui.js e
nelle superfici che lo usano (toast senza role/aria-live su core/Genesi/admin,
CSS di errore assente in Genesi) e, prima di questo, in Campo (CLASSE_HSE senza la chiave «senza-scadenze») e,
prima di questo, in Conti (prioritaIncasso/agingIncassi/incassoPerMese/kpiFrom, una
fattura stornata per intero restava scaduta e urgente su un residuo di zero
euro) e, prima di questo, in Flotta tre copie deboli mai propagate (ordinamento del
magazzino, csvBudget, propostaScorte) e, prima di questo, il ponte
Genesi→Terra (un volume in unità arbitrarie della nuvola
passava per metri cubi veri) e, ancora prima, in Genesi
`pointcloud.js:parseXYZ` (un file XYZ misto disallineava
i colori dalle posizioni) e, ancora prima, in Sentinella `dataIt` (copia
debole locale che leggeva la forma della stringa invece del calendario
vero) e, ancora prima, in Campo
`testoConsegnaTurno` (semaforo delle azioni correttive HSE nella checklist
della consegna testuale, come già in `rapportoGiornata`) e, ancora prima, i
tre difetti in dw-shell.js: `leggiCsv` trimmava ogni campo anche se
quotato apposta per conservare gli spazi di contorno, `_combacia` riconosceva
una sottosequenza CON BUCHI come «l'inizio» di una tabella, e `parseCsvLine`
perdeva lo spazio bianco che la guardia anti-formula protegge (il `.trim()`
arrivava dopo aver tolto l'apostrofo); e prima di questo, dopo aver
corretto in Flotta — quarto giro di deep-pass — il libretto esportato in CSV,
che non portava la sezione «Componenti a vita propria» mostrata a schermo e in
stampa; e prima di questo, dopo aver corretto il ponte `idoneitaDiTurno` —
shared/dw-ponti.js: mancava un contatore
per l'ottavo stato, «senza data», propagato a cinque punti di Campo, inclusi i
due documenti stampati; e prima di questo, dopo aver corretto in Scudo —
quinto giro di deep-pass — `cartellaLavoratore`: un DPI
previsto dalla mansione e mai consegnato non entrava nel fascicolo per
l'ispettore, solo nel Quadro; e prima di questo, dopo aver corretto nel core —
deep-pass mirato — `esitoSparo`: la guardia di coerenza
era asimmetrica, bloccava «mancati > fori» ma non il gemello «esplosi > fori»
senza mancati scritto; e prima di questo, dopo aver corretto in Conti — sesto
giro di deep-pass — `incassoAtteso`/`incassoPerMese`
e la copia debole del Quadro/delle Fatture: una fattura scartata dallo SdI
restava cassa in arrivo e credito sollecitabile; e prima di questo, dopo aver
corretto in Campo — quinto giro di deep-pass — l'idoneità nei documenti, che
nominava solo chi è NON idoneo e non chi ha un documento HSE scaduto o in
scadenza; e prima di questo, dopo aver aggiunto in Flotta — dal delta della
ricerca continua, tredicesimo giro — la soglia di vita dei componenti a
scaglioni; e prima di questo, dopo aver corretto in Conti — quinto giro di deep-pass — sei funzioni che trattavano una
fattura scartata dallo SdI come credito vero; e prima di questo, dopo aver
corretto in Scudo — quarto giro di deep-pass — il ramo "senza data" mancante
in `abilitazioneLavoratore`/`pillReq` e le tre colonne perse su export→import
di `csvRegistroInfortuni`; e prima di questo, dopo aver corretto in Flotta —
secondo giro di deep-pass — tre difetti veri: i CSV col
punto inglese invece della virgola italiana, il libretto senza il costo
orario completo, l'età del mezzo mai mostrata a schermo; e prima di questo,
dopo aver corretto in Terra `sequenzaLotto` — l'articolo scritto a mano invece di
`articoloNumero` — e in Flotta `PIANI_TAGLIANDO`, che non dichiarava la fonte
dei suoi passi a ore; e prima di questo, dopo aver
corretto in Scudo — censimento a doppio punto di chiamata, quinto difetto
vero nello stesso giorno, ma di forma diversa dagli altri quattro: il
lettore `parseInfortuniCsv` non leggeva affatto le tre colonne della
denuncia INAIL (non una singola chiamata fra due che le scartava) — un
registro infortuni esportato e ri-caricato perdeva `dataCertificato`/
`denunciaData`/`denunciaNumero`, e senza nessuna modale per correggerli
dopo la registrazione l'unico modo per rimediare sarebbe stato cancellare
l'evento e ricrearlo; ottava/nona/decima colonna in coda, scrittore e
lettore insieme, nuovo test con controprova — dopo aver corretto in
Sentinella — censimento a doppio punto di chiamata, quarto
difetto vero trovato con lo stesso metodo nello stesso giorno —
`db.aggiungi("adempimenti",...)`: l'import CSV non passava `periodoMesi`/
`giorniConsegna` che `parseAdempimentiCsv` già leggeva; un adempimento
re-importato perdeva il periodo dichiarato e il bottone «Prepara il
report» si rifiutava di partire con lo stesso messaggio di un adempimento
mai compilato; nessuna normalizzazione a `null` necessaria (il parser
restituisce sempre le due chiavi, mai `undefined`); nuovo test con
controprova — dopo aver corretto in Conti — censimento a doppio punto di
chiamata, terzo difetto
vero trovato con lo stesso metodo nello stesso giorno — `csvClienti`/
`parseClientiCsv`: la copia di sicurezza dell'anagrafica non portava
`listinoId`, quindi un cliente col listino personalizzato ri-caricato dal
backup tornava silenziosamente al listino base; quattordicesima colonna,
scrittore e lettore insieme (il campo esisteva già su entrambi i lati
dello schermo, non è una prima fetta), nuovo test con controprova — dopo
una passata di profondità su Terra — binario 2, lettura diretta del sorgente,
nessun agente di ricerca: `tolleranzaPct` del rilevatore era wired solo a
metà, provato a livello di modulo (`csvRilievi`/`parseRilieviCsv`/
`classeAccuratezza`) ma non passato dal gestore di import CSV a
`db.aggiungi` — un rilievo re-importato perdeva la tolleranza dichiarata e
ricadeva sulla tipica in silenzio, stessa famiglia del bug di
`rapportoGiornata` di Campo trovato lo stesso giorno con lo stesso metodo;
corretto normalizzando a `null`, non `undefined` (Firestore lancia sul
campo `undefined`), nuovo test di wiring con controprova — dopo aver
migrato a Conti (`csvClienti`) l'OTTAVO scrittore — e corretto un errore
ripetuto per tre unità di fila: `csvClienti` NON aveva mai la collisione
di nome che gli era stata attribuita insieme a `csvGare` (nessuna colonna
`stato`, verificato col `grep` separato che non era mai stato fatto);
`fido` è il campo che D1 misurava assente, tredicesima colonna. Restano
davvero irraggiungibili solo `csvGare`/`csvSquadre`/`csvAzioni` — dopo aver
migrato a Sentinella (`csvTarature`) il settimo scrittore libero
del vocabolario condiviso di P2 — la data collassa a monte da `dataIso`,
quindi binario su `dataISOEsiste(scadenza)`, non un terzo codice; settima
colonna — dopo aver
migrato a Conti (`csvListino`) il sesto scrittore del vocabolario condiviso
di P2 — `prezzo` è il campo per cui D1 misurava una riga persa, stesso
binario, sei scrittori su undici (più della metà) — dopo aver
migrato a Sentinella (`csvRicettori`) il quinto scrittore del vocabolario
condiviso di P2 — la prima volta che la riga NON sparisce mai senza il
valore misurato (un ricettore senza distanza resta un ricettore); scartati
come candidati `csvClienti` e `csvGare` di Conti perché avevano già una
colonna chiamata `stato` con un significato diverso — dopo aver
migrato a Conti (`csvPesate`) il quarto scrittore del vocabolario condiviso
di P2 — la prima volta con un TERZO codice, `illeggibile` per un ticket
della pesa con un solo peso dei due, diverso da `mai-misurato` (nessun
peso) — riusando `pesiPesata`, la stessa funzione che decide `netto` a
schermo, senza un secondo giudizio — dopo aver
migrato a Conti (`csvIncassi`) il terzo scrittore del vocabolario
condiviso di P2 — scelto invece di `csvPesate` perché più semplice,
stesso binario su `importo` — dopo aver
migrato a Terra (`csvRilievi`) il secondo scrittore del vocabolario
condiviso di P2 — qui il binario misurato/mai-misurato è l'unico
possibile perché il modello non distingue nessuna ragione più fine per un
volume mancante — dopo aver
aggiunto in `shared/dw-ponti.js` il vocabolario condiviso di P2 (ricerca
ASSENZA) — sei costanti per dire perché una cella di un CSV è vuota o vale
zero per convenzione, con un solo scrittore migrato (`csvRicambi` di
Flotta) come prima fetta — dopo aver
corretto in Campo un buco di cablaggio trovato leggendo direttamente il
sorgente: il rapporto di fine turno stampato e firmato non riceveva mai le
volate di Sentinella dalla pagina, anche se il ponte P6 le leggeva già per il
documento gemello — dopo una
revisione di qualità sulla stessa unità: `csvRegistroInfortuni` e
`fogliaCartella` non portavano la nota della denuncia INAIL — lo schermo la
mostrava, il CSV e il foglio stampabile per il consulente no, la stessa
famiglia di difetto di «dove un documento compone qualcosa che ESCE, chi
decide i suoi numeri»; la settima colonna del CSV ora COMPONE più avvisi
insieme — prognosi aperta, visita di rientro, denuncia INAIL — invece di
sceglierne uno solo, e `csvRegistroInfortuni` ha guadagnato un `oggi`
iniettabile che non aveva — dopo aver aggiunto a Scudo `scadenzaDenunciaInail`
(D.P.R. 1124/1965, art. 53) — due termini diversi, 2 giorni dal certificato
medico o 24 ore dall'evento se mortale; il termine mortale è un MASSIMO
dichiarato, non preciso, perché Scudo registra solo il giorno dell'infortunio
e non l'ora; una prognosi ancora aperta non è "non dovuta", è "non si sa
ancora" — verificato anche nel browser — dopo aver costruito il ponte
Campo→Sentinella (sovrapposizione 3g della mappa
ecosistema, cercata il 15/09) — `meteoDelGiorno` traduce i turni meteo di
Campo in pioggia/vento forte per giudicare le misure di rumore fuori
condizioni (DM 16/03/1998), con la pioggia confermata solo se tutti i turni
del giorno sono d'accordo e il vento forte mai un verdetto, solo un
sospetto; non testabile end-to-end in demo (come `ponteScudo`) — dopo aver
aggiunto a Terra `serieAnni` dentro `banchiDaSempre` — il valore anno per
anno di ogni banco, non solo il totale «almeno» che diceva CHE manca una
misura senza dire DOVE (ultimo delta del tredicesimo giro di ricerca
continua), verificato anche nel browser — dopo aver aggiunto a Terra
`aperturaFuoriProgramma` — anticipo/ritardo di un lotto
rispetto al mese previsto dal progetto (quinto dei sei delta del giro di
ricerca sul sequenziamento multi-anno, parente di `sequenzaLotto` ma sul
CALENDARIO invece che sull'avanzamento di un altro lotto): il Lotto 4 della
dimostrazione è stato aperto con 183 giorni di ritardo, verificato anche
nel browser — dopo aver aggiunto a Sentinella `superamentiUltimiGiorni` — l'escalation sui
superamenti ripetuti (dal delta della ricerca continua, nono giro,
verificato indipendentemente prima di scrivere): un pattern di superamenti
sullo stesso ricettore, sommati su tutti i suoi punti in una finestra
mobile, con la soglia come parametro configurabile — nessuna fonte del
mondo ne dà una universale. Il caso non è nella dimostrazione reale (zero
superamenti aperti oggi); verificato iniettando un punto apposta nel
browser — dopo aver aggiunto a Terra `sequenzaLotto` — `lotto.ordine` finalmente usato in un
controllo, non solo mostrato: badge "fuori sequenza" (non bloccante) quando un
lotto è aperto prima che il precedente raggiunga la soglia dichiarata, stessa
forma `{pertinente, frase}` di `attesaCollaudo`/`attesaRecupero`, verificato
anche nel browser — dopo aver aggiunto a Terra
`varianzaLottoAnno`/`volumePianificatoLottoAnno` — il
confronto pianificato-vs-reale PER LOTTO PER ANNO, dal delta della ricerca
continua sul sequenziamento multi-anno, verificato indipendentemente prima di
scrivere codice: `varianzaMensilePiano` è aggregata su tutti i lotti insieme
e non dice quale lotto sta slittando. Campo `volumiAnnuali` opzionale sui
lotti, prima fetta su un solo lotto della dimostrazione, verificato anche nel
browser) — dopo aver aggiunto a Scudo il fascicolo macchina (`attrezzature/{id}` collegato alla
verifica periodica, `attrezzaturaDiScadenza`/`descriviLegameAttrezzatura` a
distinguere «non collegata» da «collegamento rotto», tema segnalato tre
volte — luglio, 09/08, 16/09 — verificato anche nel browser) — dopo aver
aggiunto a Scudo il preset `rischio-chimico` (gemello di `rumore-vibraz`,
titolo IX D.Lgs 81/08) e il tipo di documento «Scheda dati di sicurezza
(SDS)» — prima fetta nel ciclo di vita generico dei documenti, i campi
propri (sostanza, classificazione, revisione) restano il passo successivo
— dopo aver aggiunto a Scudo `notificheScadenzeNonLette` — un contatore di scadenze
urgenti persistente finché la pagina non si visita, "nuova" dedotta dal
tempo confrontando `livelloScadenza` all'ultima visita con quello di oggi,
verificato nel browser dopo aver trovato un difetto CSS reale (`.badge`
batte `[hidden]` a parità di specificità, quindi l'attributo da solo non
nasconde mai il badge) — dopo aver aggiunto a Conti `statoRecupero` — lo storico dei solleciti DAVVERO inviati
("mai comunicato" è uno stato dichiarato, non un livello zero), un bottone
"Segna come inviato" senza nessun invio automatico, verificato nel browser
(un ID scambiato per il numero della fattura non lo vedrebbe nessuna suite
`node`) — dopo aver aggiunto a Conti `statoPianoRientro` — un piano di
rientro a rate su una fattura scaduta, fra il sollecito e la messa in mora
formale, con le rate lette come cascata e tre esiti dichiarati (rispettato/
in ritardo/decaduto), prima fetta a sola lettura, verificato nel browser
(un confronto per `id` invece che per `fatturaId` non lo vedrebbe nessuna
suite `node`) — dopo aver aggiunto a Flotta `componentiDelMezzo`/`vitaComponenti` (prima fetta): il
punto di partenza sulle ore del mezzo per pneumatici, cingoli e denti benna
— verificato nel browser dopo un primo collegamento alla pagina sbagliato
(filtro per mezzo su un elenco già scoperto a un mezzo solo) che nessuna
suite `node` poteva vedere — dopo aver
corretto in Conti `esitoMovimento`: un pagamento più basso dell'aperto che
coincide con lo sconto cassa concordato (`scontoCassaMaturato`) non è più
letto come acconto — dopo aver
aggiunto a Scudo `barriereRicorrenti`/`BARRIERE_MANCATE` (dal delta della
ricerca continua, undicesimo giro — ICAM): che cosa avrebbe dovuto fermare
l'evento, non che cosa l'ha causato, con un chip multi-select nella modale
di analisi — dopo aver
chiuso la migrazione dei 21 lettori CSV alle righe fisiche: `leggiCsv`
guadagna `nRighe` e con lei sono migrati gli ultimi due lettori non
standard, `scudo.scartiAzioniCsv` e `conti.scartiClientiCsv` — dopo aver
aggiunto a Flotta `frequenzaFermiControStoria` (dal delta della ricerca
continua, undicesimo giro) — il ritmo dei fermi contro la storia del mezzo,
terza sorella di consumo/costo, collegata a `prioritaOperative` — dopo aver
aggiunto a Conti `concentrazionePortafoglio` (dal delta della ricerca
continua, decimo giro) — la quota del cliente più esposto sul credito
aperto, verificata anche nel browser — dopo aver
migrato `flotta.scartiTelemetriaCsv` — l'ultima forma non standard con
intestazione per NOME di colonna — a riga fisica, dopo aver
riscritto in Sentinella la provenienza del periodo di un adempimento al
positivo e aggiunto la regola 33 di `run-stile.mjs` (mai «non rilevato», dal
delta su PAROLE proposta 3 metà b), dopo aver
aggiunto a `shared/deepwork-id-client/dw-shell.js` `righeCsvNumerate` — il
numero di riga fisico nel file al posto della posizione nell'elenco già
scartato, dal delta della riverifica sul documento invecchiato PAROLE — e
migrati quattro lotti (`scartiFrontiCsv`/`scartiRilieviCsv` di Terra,
`scartiScadenzeCsv`/`scartiInfortuniCsv` di Scudo,
`scartiMonitoraggiCsv`/`scartiRicettoriCsv`/`scartiAdempimentiCsv`/`scartiVolateCsv`
di Sentinella, `scartiSquadreCsv`/`scartiPianoCsv` di Campo,
`scartiRicambiCsv`/`scartiMezziCsv` di Flotta,
`scartiFattureCsv`/`scartiGareCsv`/`scartiListinoCsv` di Conti — i 18 lettori
in forma standard sono tutti migrati), poi estesa `righeCsvNumerate` per
accettare anche un predicato oltre a una parola chiave (senza cambiare il
contratto a stringa per chi già la usa) e migrato con lei
`scudo.scartiLavoratoriCsv` — restano cinque forme non standard, basate
su celle già parsate invece che su testo grezzo, poi aver aggiunto a
Genesi `burdenPerForo` — il pannello «Burden per foro» sulla scheda
Progetto 2D (dal secondo giro di ricerca su Genesi), verificato anche
nel browser,
dopo aver aggiunto a `terra-data.js` `sezionePeggiore` — la prima fetta delle sezioni
trasversali per fronte, additiva e collegata subito al posto di
`conformitaGeometria` senza cambiare nessun contratto — dopo aver aggiunto a
`scudo-data.js`/`sentinella-data.js` gli ultimi due lettori CSV
rimasti «muti» dal delta della riverifica su ASSENZA (`scartiInfortuniCsv`,
`scartiMonitoraggiCsv`), dopo aver aggiunto a `run-kpi.mjs` la prova che «saldata» e «parziale» non sono mai vere
insieme in `statoFattura` di Conti, a `claims-convergenza.mjs` il limite a
tre scritture ravvicinate, a `kpiFrom` di Scudo un `oggi` fisso, alla
conformità di Terra il fronte conteso fra due lotti, a `tagliandiInScadenza`
di Flotta lo stesso criterio di `urgenzaManutenzione`, a `fogliaVolata` di
Sentinella la lettura trovata per valore, a `applicaIncassi` di Conti le
note di credito, a `cancellazioneLasciaBuco` la numerazione DDT senza
salti, a `vitaCava` di Terra il margine fra esaurimento e scadenza,
a `abilitazioneLavoratore` di Scudo la sospensione temporanea, a
`reclamiPerRicettore` di Sentinella l'aggregazione per punto,
`costoControStoria` di Flotta il costo medio per intervento contro la sua
storia, a `varianzaMensilePiano` di Terra lo scarto del mese corrente dal
piano annuo, a `prioritaOperative` di Flotta le voci "trend",
`avvisiChiusuraTurno` di Campo gli avvisi non bloccanti alla chiusura del
turno, a `tendenzaRitmo` di Terra il ritmo corto contro il lungo e a
`testoSollecito` di Conti l'escalation per livello del sollecito e a
`fattureOltre90` di Conti l'elenco per il commercialista e a
`cartellaLavoratore` di Scudo gli infortuni della persona, la visita
medica di rientro dopo un'assenza oltre 60 giorni, il terzo/quarto gradino
di gravità (permanente/mortale) coi giorni convenzionali UNI 7249, la
lettura dell'etichetta di gravità dal vocabolario invece del campo grezzo,
e il bottone «Scadenze» al posto di «Adempimenti» nella barra in basso di
Sentinella (bersagli di tocco a 320px saliti da 41,4 a 45,61–46,86 px),
lanciando le suite)*, più **141** che girano con l'emulatore Firestore (**93** sulle regole
di sicurezza, 19 sull'SDK, 24 sulle funzioni, 8 sul primo avvio) e **419
esecuzioni** che aprono davvero le pagine in un browser *(ricontato il 19/09
con `suite-collegate.mjs`, dopo il fix di Scudo sulla denuncia INAIL nel Quadro)*.

Nella sola giornata del 31/07 le prove sulle funzioni delle app sono passate da
**433 a 971**, e hanno fatto emergere **otto difetti veri**. I tre che pesano di
più: il grafico «ultimi 6 mesi» del core riempiva ogni barra con la produzione
del **mese precedente** (chiave del mese letta a Greenwich, etichetta letta in
Italia); un **ruolo di sicurezza obbligatorio** risultava coperto quando la
persona nominata non era più in azienda; e una **misura del sismografo spariva**
dal report che va all'ente, scambiata per un doppione. Da lì è nato anche un
controllo nuovo: le suite si rilanciano con l'**orologio italiano**, perché il
contenitore è a Greenwich e in UTC quei difetti erano invisibili.
