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
carica senza errori in Playwright. Sweep XSS del core considerato
sostanzialmente COMPLETO (eventuali spot rari residui = manutenzione
ordinaria).

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

### 10. XSS in contesto-attributo (verifica 21/07) — PULITO
Verificate TUTTE le interpolazioni dentro attributi HTML delle app
(`data-*`, `value`, `title`, `style`): sono esclusivamente ID
generati da Firestore o enum hardcoded (owner/admin/member), mai
testo libero dell'utente. Il testo libero finisce sempre in contesto-
elemento con esc(). Nessun vettore di breakout dagli attributi.
Nessuna azione necessaria; da riverificare se in futuro un ID diventa
inseribile dall'utente.

## Prossime azioni in ordine
1. (weekend, fondatore) Regole attuali del progetto esistente → repo.
2. (weekend, fondatore) Conferma mitigazione ponte per le password +
   verifica natura dei dati di default (reali o fantasia).
3. (cicli automatici) Proseguire fasi Deepwork ID (soluzione definitiva).
4. ✅ (fatto 21/07) Escape HTML nel core come da punto 8.
5. ✅ (fatto 21/07) Iniezione CSV neutralizzata (punto 9) + verifica
   XSS contesto-attributo pulita (punto 10).
