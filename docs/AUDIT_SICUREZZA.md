# Audit di sicurezza — Deepwork core (2026-07-19, prima passata)

Censimento dei problemi di sicurezza del monolite `index.html` e dei
file di servizio, con priorità e piano di mitigazione. Aggiornare ad
ogni intervento (questo file è il registro vivo del task 4).

## 🔴 Critici

### 1. Credenziali in chiaro nel codice client (index.html ~r.277-285)
7 utenti con password in chiaro (admin/admin, ufficio/ufficio,
fochino/fochino, operatore/operatore, giuseppe/deepwork2026,
capocantiere/cantiere2026, direttore/deepwork!). Chiunque apra il
sorgente della pagina pubblica può impersonare qualunque ruolo, admin
inclusi. Repo pubblico → le password sono esposte anche su GitHub.
- Mitigazione definitiva: migrazione a Deepwork ID (fasi B/C del piano
  in apps/deepwork-id/ARCHITETTURA.md, sez. 8) — in lavorazione.
- Mitigazione ponte (fattibile subito, da confermare col fondatore):
  rimuovere le password dal sorgente e spostare la verifica su
  Firestore (hash + salt per utente, niente fallback in chiaro),
  ruotando TUTTE le password attuali. Nel vault dei "Prossimi passi"
  la rotazione risulta rimandata dal fondatore il 2026-07-12 ma resta
  un rischio attivo: riproporla al weekend di revisione.

### 2. Dati aziendali reali nei default del client
DEFAULT_CLIENTI / DEFAULT_CAVE / DEFAULT_USERS contengono nomi,
telefoni, email, IBAN e coordinate che sembrano realistici. Se sono
dati veri, sono pubblici su GitHub e nel sorgente della pagina.
- Verificare col fondatore se sono dati reali o di fantasia; se reali,
  sostituirli con dati sintetici e valutare la rimozione dallo storico.

### 3. Regole di sicurezza del progetto Firebase esistente non versionate
Il client accede a Firestore/Storage del progetto `deepwork-app-6c56f`,
ma nel repo non esiste alcun `firestore.rules`: impossibile sapere se
il database è protetto o aperto. Se le regole sono permissive (tipico
"allow read, write: if true" delle demo), chiunque con la config
pubblica può leggere/scrivere tutto il database.
- Azione (richiede fondatore): aprire console Firebase → Firestore →
  Rules del progetto esistente e incollare in chat le regole attuali,
  così le versioniamo e correggiamo. Da fare nel weekend insieme alla
  creazione del progetto nuovo.

## 🟠 Importanti

### 4. firebase-messaging-sw.js con segnaposto
Contiene `INCOLLA_QUI_LA_API_KEY...`: le notifiche push non funzionano
e il file svela l'assenza di configurazione. Sistemare quando si
configura il progetto Firebase (weekend) o rimuovere finché non serve.

### 5. sw.js — riferimenti obsoleti e fallback rotto — ✅ CORRETTO 2026-07-19
Precache e fallback puntavano a deepwork-v3.3.html / v3.2.html
(inesistenti) e il fallback usava `caches.match(a) || caches.match(b)`
(sempre truthy, catena mai valutata). Corretti: precache di
./index.html, fallback con .then, cache version v3→v4 (forza il
refresh delle cache dei client), aggiunto firebase-messaging.js al
precache (usato da index.html ma non precachato).

## 🟡 Da tenere d'occhio

### 6. "Hashing" password lato client
La verifica è SHA-256 con salt fisso lato client, con fallback al
confronto in chiaro. Non è una protezione reale (il client è
manipolabile per definizione): decade con la migrazione a Deepwork ID.

### 7. Config Firebase esposta nel client
Normale per Firebase (le chiavi web non sono segrete), MA la sicurezza
dipende interamente dalle regole (punto 3). Nessuna azione sul client;
tutta l'attenzione va sulle rules.

### 8. Escape HTML nei template (aggiornamento 21/07) — CHIUSO
Le 6 app dell'ecosistema e le pagine Deepwork ID sono state BLINDATE
(PR #84-#85): ogni campo inserito dall'utente passa dall'helper
condiviso esc() prima di finire in innerHTML — provato con tentativi
di iniezione reali. Il CORE (index.html) è stato passato al setaccio
allo stesso modo (helper escHtml): CHAT (m.testo, il punto più a
rischio: contenuto di un utente nella pagina di un altro) + nome
progetto volata condivisa, e le liste personale/utenti/volate/home
(nome, cognome, ruolo, telefono, username, titoli). Le foto (chat,
personale, utenti) passano da encodeURI. Azione 4 completata.

Estensione 21/07 (seconda passata core): bonificati anche i render
element-context di nomi VISIBILI AI COLLEGHI non coperti dalla prima
passata — lista cave, dettaglio cava dashboard, risultati della
ricerca globale (cave/clienti/mezzi/personale), link cliente
nell'anteprima cava, chip operatori, promemoria. Ogni nome/ragione
sociale/modello/targa/ruolo passa ora da escHtml. Verificato: escHtml
neutralizza `< > " ' &`; il core si carica senza errori.
Terza passata 21/07 (residuo chiuso): bonificati anche gli attributi
`value="…"` dei form di modifica (30 campi di testo libero: nome,
ragsoc, indirizzo, contatti, marca/modello/targa, ecc.), il testo
visibile di ~19 `<option>` di select, i campi NOTE nelle anteprime, le
label checkbox, la lista mezzi di strada, la lista chat (nomi +
anteprima ULTIMO MESSAGGIO, contenuto cross-utente) e il dettaglio
cliente. I titoli dei modali usano textContent (già sicuri). Scansione
finale: 0 residui nelle classi display (sname/ssub/preview-val/chip)
per i campi di testo tracciati; il core è passato da ~17 a ~140
chiamate escHtml. Verificato: sintassi OK sui 3 script inline, core
carica senza errori in Playwright.

Quarta passata 21/07 (revisione di completezza): una ri-scansione ha
trovato residui NON coperti dalle passate precedenti — soprattutto il
contesto `<textarea>...</textarea>` (dove un valore con
`</textarea><script>` sarebbe un breakout), oltre a targa nelle
scadenze mezzi, cliente nell'anteprima cava, operazione/note nelle
liste manutenzioni/controlli/rifornimenti e le iniziali avatar utenti.
Corretti tutti: 8 textarea (note di cliente/sensore/mezzo/persona/foro/
fronte) + 8 punti element-context. Ora TUTTE le textarea con
interpolazione passano da escHtml. Sweep XSS del core COMPLETO.

### 9. Iniezione CSV negli export/import (21/07) — CHIUSO
Un valore inserito da un membro dell'organizzazione che inizia con
`= + - @` verrebbe eseguito come formula aprendo il CSV in Excel/
LibreOffice Calc. Neutralizzato con l'helper condiviso csvCell()
negli export di scudo/conti/sentinella/terra (apostrofo di guardia
+ virgolette per i valori con `;` `"` o a capo). L'import di Scudo
ora usa parseCsvLine() (rispetta le virgolette, toglie la guardia
solo davanti a `= + - @`): round-trip senza perdite. Core
(reconExportHoles) e Genesi esportano solo numeri/etichette fisse →
nessun campo libero, non toccati. 22 test di regressione
(run-helpers.mjs) blindano esc/csvCell/parseCsvLine; suite a 77 (PR #95).

### 11. Indici Firestore per le query delle Functions (21/07) — PREPARATO
Le Cloud Functions usano query `collectionGroup`/composte
(rebuildClaims: members per uid+status; acceptInvites: invites per
email+status; countActiveOwners: members per role+status) che gli
EMULATORI non verificano ma la produzione può richiedere come indici
compositi (stessa classe del bug FieldValue: verde in test, rosso in
prod). Creato `apps/deepwork-id/firestore.indexes.json` (indice
collectionGroup members uid+status, il più probabile) e collegato in
firebase.json. Riguarda solo il percorso Blaze/Functions (differito):
per il go-live gratuito con bootstrap NON serve. Alla futura attivazione
Blaze: `firebase deploy --only firestore` e, se la console segnala altri
indici mancanti, crearli col link a un clic.

### 12. Gestione errori delle scritture live (21/07) — DA FARE (robustezza)
I gestori delle app (aggiungi/aggiorna/rimuovi lavoratori, fatture,
misure…) chiamano `await db.xxx()` SENZA try/catch. In DEMO le
operazioni in memoria non falliscono mai, ma in LIVE un errore
Firestore (rete assente, permesso negato, quota) farebbe fallire
l'azione in SILENZIO: l'utente non vedrebbe né conferma né errore.
Non è un buco di sicurezza (le rules restano il confine), ma una
robustezza UX da chiudere prima/subito dopo il go-live: avvolgere i
gestori mutanti con un messaggio d'errore condiviso ("Operazione non
riuscita, riprova"). Da fare app per app con verifica del percorso
felice (demo) e di un errore simulato. Rilevanza: solo modalità live.

### 10. XSS in contesto-attributo (verifica 21/07) — PULITO
Verificate TUTTE le interpolazioni dentro attributi HTML delle app
(`data-*`, `value`, `title`, `style`): sono esclusivamente ID
generati da Firestore o enum hardcoded (owner/admin/member), mai
testo libero dell'utente. Il testo libero finisce sempre in contesto-
elemento con esc(). Nessun vettore di breakout dagli attributi.
Nessuna azione necessaria; da riverificare se in futuro un ID diventa
inseribile dall'utente.

### 13. XSS nel piano di carico importato da CSV (Campo, 20/07) — ✅ CORRETTO
Trovato durante la revisione di sicurezza del ciclo. In
`apps/campo/index.html` l'import CSV del piano di carico convertiva in
numero solo `foro` e `prog`; i campi `x`, `prof`, `borr`, `rit`
restavano stringhe grezze prese dal file e venivano interpolati
nell'HTML della lista fori SENZA `esc()`. Un CSV confezionato ad arte
(una cella con `<img onerror=...>` o `<script>`) poteva quindi eseguire
codice nella sessione di chi importava il file — un rischio concreto in
un prodotto multi-tenant dove i file possono arrivare da terzi. Corretto
avvolgendo i quattro campi in `esc()` al momento del rendering.
Verificato con Playwright: importando un CSV con payload `<img onerror>`
e `<script>` nessun elemento viene iniettato e nessun codice eseguito.
Da tenere presente per ogni futuro import da file: i campi non numerici
vanno sempre trattati come testo libero (esc in HTML, csvCell in export).

## Prossime azioni in ordine
1. (weekend, fondatore) Regole attuali del progetto esistente → repo.
2. (weekend, fondatore) Conferma mitigazione ponte per le password +
   verifica natura dei dati di default (reali o fantasia).
3. (cicli automatici) Proseguire fasi Deepwork ID (soluzione definitiva).
4. ✅ (fatto 21/07) Escape HTML nel core come da punto 8.
5. ✅ (fatto 21/07) Iniezione CSV neutralizzata (punto 9) + verifica
   XSS contesto-attributo pulita (punto 10).

### 14. XSS nel testo di ricerca dello stato vuoto (Scudo, 20/07) — ✅ CORRETTO
Nella lista personale di `apps/scudo/index.html`, il messaggio di stato
vuoto della ricerca ("Nessun lavoratore corrisponde a «…»") inseriva il
testo digitato dall'utente nell'HTML senza `esc()`. Un payload come
`<img onerror=...>` digitato nel campo ricerca (che non corrisponde a
nessun nome) veniva eseguito nella sessione dell'utente stesso
(self-XSS, severità bassa ma difetto reale). Corretto con `esc()` sul
testo di ricerca. Verificato con Playwright. Controllati gli altri usi
del testo di ricerca nelle app: l'unico altro `q` interpolato è in una
`confirm()` (Campo), che non interpreta HTML. Nessun altro caso.
