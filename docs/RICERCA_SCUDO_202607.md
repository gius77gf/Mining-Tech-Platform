# Scudo — ricerca luglio 2026: cosa c'è, cosa manca, cosa conviene fare

Documento di ricerca (nessuna modifica al codice). Serve a decidere insieme al
fondatore i prossimi passi di **Scudo**, l'app della sicurezza sul lavoro in cava.

Scritto in italiano semplice. Dove una cosa **non si può fare** con gli strumenti
che abbiamo (web-app statica, dati su Firestore, zero spese), è scritto chiaro:
meglio una lista corta e vera che una lista lunga e finta.

Sintesi in una riga: **Scudo oggi è un buon "scadenzario + archivio documenti".
Quello che manca di più è il pezzo che chiude il cerchio — dall'evento (o
dall'ispezione) all'azione correttiva con un responsabile e una data.** Ed è
anche il pezzo che la legge italiana ha appena reso più importante
(L. 198/2025 sui near-miss).

---

## 1. Cosa c'è già oggi nell'app (inventario onesto)

Letto direttamente dal codice: `apps/scudo/index.html` (637 righe) e
`apps/scudo/scudo-data.js` (326 righe). Quattro schermate: Quadro, Personale,
Scadenze, Documenti.

### Personale
- Anagrafica lavoratori: nome, ruolo, telefono, attivo/non attivo.
- Modifica e cancellazione del lavoratore.
- Ricerca per nome o ruolo.
- **Idoneità sanitaria** per lavoratore (art. 41): n.d. → idoneo → idoneo con
  prescrizioni → non idoneo. Si cambia toccando il badge.
- Import da CSV (nome; ruolo; telefono) con salto di intestazioni e duplicati.
- Export CSV di lavoratori + relative scadenze + stato calcolato.

### Scadenze
- Scadenze legate a un lavoratore **oppure** all'azienda.
- Tipi: Visita medica, Corso, Formazione, DPI, Patente, Altro.
- Stato **calcolato dalla data** (non salvato): scaduta / entro 30 giorni /
  regolare; più un'etichetta fine ("scade oggi", "tra 5 gg", "scaduta da 12 gg").
- Filtri (tutte / scadute / entro 30gg / regolari), ricerca, tre ordinamenti
  (data, tipo, lavoratore) memorizzati nel browser.
- **Copertura formazione per tipo**: quante scadenze regolari / in scadenza /
  scadute per ciascun tipo, ordinate dalla situazione peggiore.
- **14 adempimenti tipici di cava già preimpostati** (sorveglianza sanitaria,
  formazione generale/specifica, preposto, dirigente, primo soccorso,
  antincendio, RLS, abilitazione attrezzature, fochino, DSS, DVR, verifiche
  periodiche attrezzature, riunione periodica). Ogni preset avvisa che la
  periodicità va confermata con RSPP e medico competente.
- **Rinnovo rapido** di una scadenza a nuova data.
- **Promemoria pronto da inviare**: testo già scritto per il lavoratore,
  copiato negli appunti (si incolla in email/SMS).
- Import scadenze da CSV con associazione al lavoratore per nome e antidoppioni.

### Documenti e cantieri
- **Cantieri/siti**: cava o cantiere esterno, con comune e conteggio documenti.
- **Documenti** con 9 tipi (DSS, POS, DVR, DUVRI, Nomina, Verbale DPI, Idoneità
  sanitaria, Attestato formazione, Altro), stato valido / da rivedere / scaduto
  (si cambia toccando), collegamento **al cantiere** e/o **al lavoratore**.
- **Allegato** (foto o scansione del documento firmato), massimo ~400 KB perché
  l'allegato viaggia dentro il documento Firestore. Si riapre con l'icona 📎.

### Infortuni e near-miss
- Registro eventi: data, tipo (infortunio / near-miss), gravità (lieve/grave),
  giorni di assenza, luogo, descrizione.
- Blocco delle date future (un refuso azzererebbe il contatore).
- Filtri per tipo, import ed export CSV con antidoppioni.
- **Cartellone "giorni senza infortuni"** in home; i near-miss non azzerano il
  contatore ma si contano a parte.
- Riepilogo: numero infortuni, di cui gravi, near-miss, giorni di assenza totali.

### Quadro (dashboard)
- 4 KPI cliccabili: scadenze superate, in scadenza a 30 giorni, lavoratori
  regolari, corsi pianificati.
- Lista **Urgenze**: prima le idoneità critiche, poi le scadenze non regolari.

### Impianto tecnico
- Dati sempre isolati per organizzazione (SDK Deepwork ID, `orgCollection`).
- Modalità demo/tour quando non c'è login: dati finti, niente salvataggi.
- PWA installabile, stile Deepwork con accento viola.

**In sintesi**: Scudo sa dire *"cosa scade e quando"*, *"che documenti ho"* e
*"cosa è successo"*. Non sa ancora dire *"cosa devo fare adesso, chi lo fa ed
entro quando"*, né *"chi non è formato per la mansione che sta facendo"*.

---

## 2. Cosa manca

### 2a. Obblighi di legge non coperti (o coperti solo a metà)

| Obbligo | Riferimento | Come sta oggi Scudo |
|---|---|---|
| **Gestione dei near-miss con azioni correttive e dati aggregati** | D.L. 159/2025 convertito in **L. 198/2025**: linee guida MLPS/INAIL per identificazione, tracciamento e analisi dei mancati infortuni; le aziende **oltre 15 addetti** comunicano dati aggregati sugli eventi **e sulle azioni correttive/preventive adottate** | Registra i near-miss ✅, ma **non registra le azioni correttive** ❌ e non produce il riepilogo aggregato ❌ |
| **Azioni correttive dopo un evento** | Prassi consolidata + richiesto esplicitamente dalla L. 198/2025; è anche il cuore della ISO 45001 (cap. 10) | Assente ❌ |
| **Verbale di consegna DPI + addestramento** | Art. 77 D.Lgs 81/2008: consegna documentata; **addestramento obbligatorio per i DPI di III categoria e per i protettori dell'udito** (entrambi normali in cava) | Solo come "documento allegato" generico ❌ — nessun registro DPI per lavoratore |
| **Formazione per mansione** | Art. 37 D.Lgs 81/2008 + Accordo Stato-Regioni 17/04/2025 (per il datore di lavoro: corso base 16 ore, aggiornamento quinquennale 6 ore) | C'è la copertura *per tipo di corso*, non *per mansione* ❌: Scudo non sa che un escavatorista **deve** avere l'abilitazione attrezzature |
| **Preposti: individuazione + formazione** | D.L. 146/2021 (modifica il D.Lgs 81/08): individuazione obbligatoria del preposto, formazione in presenza, aggiornamento **almeno biennale** | Il preposto è solo un testo nel campo "ruolo" ❌ |
| **Nomine della sicurezza** | RSPP, medico competente, RLS, addetti emergenze (D.Lgs 81/08); **sorvegliante** obbligatorio in cava (D.Lgs 624/96) | Solo come tipo di documento "Nomina" — nessun organigramma ❌ |
| **Riunione periodica annuale** | Art. 35 D.Lgs 81/2008, aziende **oltre 15 lavoratori**, con verbale firmato dai presenti | Solo come preset di scadenza ⚠️ (nessun verbale, nessun elenco partecipanti) |
| **DSS + certificazione annuale + aggiornamento dopo incidenti** | D.Lgs 624/1996 artt. 6 e 10: il DSS integra l'art. 28 del D.Lgs 81/08, è firmato da direttore responsabile, sorveglianti, medico competente e RLS, va **trasmesso all'autorità di vigilanza prima dell'inizio dei lavori** e **aggiornato dopo modifiche o incidenti** | Esiste come tipo di documento ✅ ma senza il ciclo "certificazione annuale" e senza il collegamento "incidente → il DSS va rivisto" ❌ |
| **Relazione annuale sulla stabilità dei fronti** | D.Lgs 624/96, coltivazioni a cielo aperto: relazione su stabilità dei fronti, rischio caduta massi e franamento, **predisposta o aggiornata annualmente** | Assente ❌ — ed è l'adempimento **più tipicamente da cava** che esista |
| **Registro degli esposti a cancerogeni (silice)** | La **silice cristallina respirabile generata da un processo di lavorazione** è in allegato XLII (cancerogeni) dal D.Lgs 44/2020; VLEP 0,1 mg/m³ su 8 ore; **registro esposti art. 243**, da aggiornare almeno ogni 3 anni | Assente ❌ (riguarda quasi tutte le cave) |
| **Rumore e vibrazioni (HAV / corpo intero)** | Titolo VIII D.Lgs 81/08, capi II e III; allegato XXXV | Assente ❌ |
| **Appaltatori e ditte esterne** | Art. 26 D.Lgs 81/08: verifica idoneità tecnico-professionale (visura, DURC, DVR della ditta, attestati), **DUVRI**, tesserino di riconoscimento | DUVRI esiste come tipo documento ⚠️; nessuna anagrafica ditte, nessun controllo scadenze DURC |
| **Verifiche periodiche attrezzature** | D.M. 11/04/2011: prima verifica INAIL, verifiche successive ASL/ARPA o soggetti abilitati; resta obbligo di manutenzioni e controlli con esiti nel **registro di controllo dell'attrezzatura** | Solo come preset di scadenza aziendale ⚠️ — nessuna anagrafica attrezzature |
| **Denuncia infortunio a INAIL** | Il **registro infortuni cartaceo è abolito** (D.Lgs 151/2015, dal 23/12/2015); resta la denuncia telematica a INAIL e la consultazione tramite "Cruscotto infortuni" | Scudo tiene il registro **come strumento interno**, il che va benissimo — ma va detto in interfaccia che **non sostituisce la denuncia INAIL** ⚠️ |
| **Spazi confinati (silos, tramogge, serbatoi)** | D.P.R. 177/2011: qualificazione delle imprese, procedure, sistema di **permesso di lavoro** | Assente ❌ (rilevante solo per alcune cave con impianto) |
| **Fochino / esplosivi** | Licenza di fochino rilasciata dal Prefetto (D.P.R. 302/1956) per preparazione e brillamento delle cariche | Esiste il preset di scadenza "fochino" ✅ — copertura minima ma corretta |

### 2b. Funzioni che i competitor hanno e Scudo no

Guardati i software HSE italiani (Zucchetti Safety, Sicurweb, Risolvo, JOB81,
Ordex HSE Manager, Twind), quelli internazionali generalisti (EcoOnline, Cority,
Riskonnect, Certainty, SafetyCulture/iAuditor) e quelli minerari (Safetymint,
SmartQHSE, Ecesis). Il denominatore comune è sempre lo stesso:

1. **Ispezioni e audit con checklist configurabili**, programmate, con esito e
   foto. È la funzione numero uno di tutti, senza eccezioni.
2. **Azioni correttive (CAPA)**: da un'ispezione o da un incidente nasce
   un'azione con responsabile, priorità e data di scadenza, tracciata fino alla
   chiusura e alla verifica di efficacia.
3. **Indagine incidente strutturata**: passi guidati e **analisi causa-radice**
   (5 Perché, Ishikawa, ICAM — quest'ultimo è lo standard del settore minerario).
4. **Matrice formazione/competenze**: per ogni mansione i corsi richiesti, e chi
   è scoperto. Non "quanti corsi scadono", ma "chi non può fare quel lavoro".
5. **Indicatori infortunistici**: indice di frequenza, indice di gravità,
   **LTIFR / TRIR** — calcolati sulle **ore lavorate** (rif. UNI 7249). La ISO
   45001 spinge inoltre sugli indicatori **leading** (ispezioni fatte, near-miss
   segnalati, azioni chiuse in tempo) accanto ai **lagging** (infortuni).
6. **Gestione appaltatori**: documenti della ditta con scadenze, accesso al sito.
7. **Segnalazione da telefono in pochi secondi**, con foto, anche offline.
8. **Permessi di lavoro** (lavori a caldo, spazi confinati) e **LOTO**
   (blocco/etichettatura delle macchine in manutenzione).
9. **Report e dashboard** esportabili per direzione e organi di vigilanza.

### 2c. Idee di valore (roba che i competitor generalisti NON hanno, e che ci
differenzia perché siamo verticali sulla cava)

- **Ispezione del fronte di cava** come checklist dedicata (ciglio, unghia,
  gradoni, blocchi in equilibrio precario, viabilità piste, cumuli), agganciata
  alla relazione annuale di stabilità. Nessun software generalista ce l'ha.
- **Ciclo "evento → il DSS va rivisto"**: se registro un incidente, Scudo
  ricorda che il DSS va aggiornato (obbligo del 624/96). Piccolo, ma è
  esattamente il tipo di dettaglio che un software generico non conosce.
- **Vocabolario di cava già dentro**: fochino, sorvegliante, DSS, fronte,
  gradone. L'RSPP che apre l'app capisce subito che è fatta per lui.
- **Collegamenti tra app dell'ecosistema**: le ore lavorate da **Campo** (turni)
  darebbero gli indici infortunistici senza doppio inserimento; le attrezzature
  di **Flotta** eviterebbero di rifare l'anagrafica mezzi dentro Scudo.
- **"Cartella del lavoratore" stampabile**: una pagina con tutto (idoneità,
  corsi, DPI consegnati, verbali). È ciò che serve fisicamente quando arriva
  l'ispettore, e nessuno lo fa bene.

### 2d. Cose che NON possiamo fare (da dire subito, per non promettere il falso)

- ❌ **Invio automatico di email o SMS** ai lavoratori: serve un servizio esterno
  (a pagamento) o un backend. Oggi Scudo prepara il testo e lo copia: resta così.
- ❌ **Firma digitale a valore legale**: no. Possiamo solo allegare la **foto**
  del foglio firmato a mano (che, di fatto, è ciò che si esibisce in ispezione).
- ❌ **Misure ambientali** (polveri di silice, rumore in dB, vibrazioni): servono
  strumenti e laboratorio. Scudo può solo **registrare l'esito** di misure fatte
  da altri e ricordare quando vanno rifatte.
- ❌ **Collegamento a INAIL / Cruscotto infortuni**: non esiste un'API aperta
  utilizzabile da una web-app. La denuncia si continua a fare sul portale INAIL.
- ❌ **Generare il DVR o il DSS**: sono documenti firmati da datore di lavoro,
  RSPP, medico competente e sorveglianti. Scudo li *tiene in ordine*, non li
  *sostituisce*. Questa frase va lasciata scritta in app.
- ⚠️ **Allegati pesanti** (PDF di molte pagine, foto ad alta risoluzione):
  oggi limite ~400 KB. Serve Firebase Storage, che arriva col progetto live —
  nessuna spesa, ma richiede che il fondatore crei il progetto Firebase.
- ⚠️ **Funzionamento offline vero** in cava senza campo: tecnicamente fattibile
  (persistenza locale di Firestore) ma è un lavoro a sé, con i suoi rischi di
  conflitti tra dati. Non regalarlo a parole prima di averlo fatto.

---

## 3. Tabella delle proposte

Difficoltà: **S** = poche ore · **M** = un paio di giornate · **L** = una
settimana o più. Priorità decisa incrociando obbligo di legge, valore per l'RSPP
e costo di realizzazione.

| # | Nome | Cosa fa | Perché serve | Diff. | Prio. |
|---|---|---|---|---|---|
| 1 | **Azioni correttive (CAPA)** | Da un infortunio, un near-miss o una voce non conforme nasce un'azione: cosa fare, chi la fa, entro quando, stato aperta/chiusa. Entra nella stessa macchina di scadenze e promemoria che c'è già | Chiude il cerchio "segnala → correggi → verifica". La **L. 198/2025** chiede proprio di comunicare gli eventi *e le azioni correttive adottate*. È il pezzo numero uno di ogni competitor | M | **Alta** |
| 2 | **Segnalazione near-miss rapida (dal telefono)** | Schermata dedicata: 3 campi + foto, in 30 secondi, da cellulare. Chiunque in cava può segnalare | Un near-miss che non si segnala non esiste. È l'unico modo di avere numeri veri da comunicare. La PWA è già installabile: la base c'è | S/M | **Alta** |
| 3 | **Riepilogo near-miss aggregato (L. 198/2025)** | Pagina/export con: eventi per periodo e categoria, azioni correttive aperte e chiuse. Pronto da ricopiare quando uscirà il decreto attuativo | Le linee guida MLPS/INAIL e il decreto sulle modalità di comunicazione sono attesi nel 2026: chi arriva con i dati già ordinati vince la finestra di mercato | S | **Alta** |
| 4 | **Ispezioni e checklist periodiche** | Modelli di checklist (fronte di cava, piste, impianto, officina, mezzi), esito voce per voce, foto, e le voci "non conformi" generano automaticamente le azioni del punto 1 | È la funzione più usata in assoluto nei software HSE. In cava serve davvero: le condizioni cambiano ogni giorno | M/L | **Alta** |
| 5 | **Matrice formazione per mansione** | Per ogni mansione (escavatorista, fochino, preposto, autista…) i corsi e le abilitazioni richieste; l'app dice chi è scoperto | Passa da "quanti corsi scadono" a **"chi oggi non può salire su quella macchina"**. È la domanda che fa l'ispettore | M | **Alta** |
| 6 | **Registro DPI per lavoratore** | Cosa è stato consegnato, quando, taglia, con spunta "addestramento fatto" per i DPI di III categoria e i protettori dell'udito, più foto del verbale firmato | Art. 77 D.Lgs 81/08. In ispezione si chiede il verbale firmato: oggi Scudo lo tiene solo come documento generico | M | **Alta** |
| 7 | **Nomine e organigramma della sicurezza** | Chi è RSPP, medico competente, RLS, addetti primo soccorso e antincendio, preposti, **sorvegliante di cava**; da quando, con scadenza formazione collegata | Il **sorvegliante** è obbligatorio in cava (624/96) e il **preposto** va individuato formalmente (D.L. 146/2021). Riusa quasi tutto il codice esistente | S/M | **Alta** |
| 8 | **Adempimenti specifici di cava nello scadenzario** | Aggiungere ai preset: relazione annuale stabilità dei fronti, certificazione annuale del DSS, trasmissione DSS all'autorità di vigilanza, aggiornamento DSS dopo incidenti | Adempimenti del 624/96 che **nessun software generalista conosce**. Costo bassissimo: sono voci in una lista già fatta | S | **Alta** |
| 9 | **Analisi causa-radice guidata (5 Perché)** | Sul modulo dell'evento, cinque righe "perché?" e la causa radice individuata, collegata all'azione correttiva | Evita le azioni inutili tipo "richiamare il lavoratore". Metodo standard, gratis, si fa con cinque campi di testo | S | Media |
| 10 | **Indici infortunistici (IF, IG, LTIFR)** | Inserimento delle **ore lavorate** per mese, e calcolo di indice di frequenza, indice di gravità e LTIFR | Sono i numeri che chiedono clienti, banche e capitolati. **Onestà: senza le ore lavorate non sono calcolabili** — vanno inserite a mano o prese da Campo (turni) | S/M | Media |
| 11 | **Anagrafica appaltatori + documenti con scadenza** | Ditte esterne con DURC, DVR, attestati, polizza; DUVRI collegato al cantiere; avviso se una ditta ha documenti scaduti | Art. 26 D.Lgs 81/08. In cava entrano continuamente autotrasportatori e manutentori. Riusa il motore scadenze | M/L | Media |
| 12 | **Registro esposti (silice, rumore, vibrazioni)** | Elenco dei lavoratori esposti per agente, data della valutazione, data del prossimo aggiornamento | La silice cristallina respirabile è **cancerogeno** dal D.Lgs 44/2020 con registro esposti art. 243 da aggiornare ogni 3 anni: riguarda quasi ogni cava. **Onestà: registriamo date ed esiti, non misuriamo nulla** | M | Media |
| 13 | **Verbali riunione periodica e prove di emergenza** | Registro dei verbali art. 35 con data, partecipanti, argomenti, allegato firmato; stessa cosa per le prove di evacuazione | Obbligo annuale sopra i 15 lavoratori, con sanzione se manca il verbale. Riusa il modulo documenti | S | Media |
| 14 | **Cartella del lavoratore stampabile** | Una pagina per persona con idoneità, corsi, DPI, verbali, allegati — pronta da stampare/salvare in PDF dal browser | È quello che serve fisicamente in ispezione. Zero dipendenze: basta un foglio di stile per la stampa | M | Media |
| 15 | **Attrezzature e verifiche periodiche** | Anagrafica attrezzature soggette a verifica (D.M. 11/04/2011) con scadenze e registro dei controlli | Obbligo reale, ma **attenzione alla sovrapposizione con Flotta** (manutenzione mezzi): va deciso chi tiene il dato, non duplicato | M | Media |
| 16 | **Briefing di sicurezza / toolbox talk** | Breve incontro registrato: argomento, data, presenti, firma su foto | Costruisce la prova della formazione continua e alimenta gli indicatori leading. Semplice e molto usato all'estero | S | Bassa |
| 17 | **Permessi di lavoro (spazi confinati, lavori a caldo)** | Modulo di autorizzazione con condizioni da verificare, chi autorizza, validità oraria | D.P.R. 177/2011. Vero obbligo, ma riguarda **solo le cave con impianti/silos**: prima gli altri punti | M | Bassa |
| 18 | **Funzionamento offline in cava** | Cache locale dei dati e sincronizzazione al rientro in campo | Utile davvero (in cava spesso non c'è segnale) ma è un lavoro a sé con rischio conflitti dati. Da fare dopo, non prima | L | Bassa |

### Ordine consigliato per partire

**8 → 1 → 2 → 3 → 7 → 5 → 6 → 4.**

Il punto 8 costa quasi niente e rende Scudo immediatamente "da cava". Poi le
azioni correttive (1) che sono l'ossatura su cui si agganciano tutti gli altri
moduli. Poi il trittico near-miss (2 e 3) che è la finestra di mercato aperta
dalla L. 198/2025. Le ispezioni (4) vengono dopo perché senza le azioni
correttive sarebbero mezze inutili.

**Nota vincolante**: ogni punto aggiunge campi o collezioni al modello dati
multi-tenant. Tutto deve passare da `orgCollection` dell'SDK Deepwork ID, mai da
percorsi Firestore scritti a mano — e le modifiche al modello dati si fanno solo
col via libera del fondatore.

---

## 4. Fonti

### Normativa italiana — quadro generale
- D.Lgs 81/2008 art. 41 (sorveglianza sanitaria, periodicità di norma annuale
  salvo diversa indicazione del medico competente):
  [testo su tussl.it](https://tussl.it/titolo-i-principi-comuni/capo-iii-gestione-della-prevenzione-nei-luoghi-di-lavoro/sezione-v-sorveglianza-sanitaria/art-41) ·
  [commento BibLus](https://biblus.acca.it/art-41-dlgs-81-2008/)
- D.Lgs 81/2008 art. 77 (obblighi DPI, addestramento obbligatorio per III
  categoria e protettori dell'udito):
  [testo su tussl.it](https://tussl.it/titolo-iii-uso-delle-attrezzature-di-lavoro-e-dei-dispositivi-di-protezione-individuale/capo-ii-uso-dei-dispositivi-di-protezione-individuale/art-77) ·
  [obbligo verbale di consegna](https://www.pi-esse.it/notizie/l-obbligo-di-consegna-dei-dpi-al-lavoratore) ·
  [addestramento DPI III categoria](https://corsisicurezzalavoroweb.it/approfondimenti/addestramento-obbligatorio-per-dpi-3-categoria/)
- D.Lgs 81/2008 art. 26 (appalti, idoneità tecnico-professionale, DUVRI,
  tesserino di riconoscimento):
  [scheda Università di Parma](https://www.unipr.it/node/21592) ·
  [verifica ITP — PuntoSicuro](https://www.puntosicuro.it/lavoratori-autonomi-imprese-familiari-C-76/la-verifica-della-idoneita-tecnico-professionale-AR-12264/)
- D.Lgs 81/2008 art. 35 (riunione periodica annuale sopra i 15 lavoratori,
  verbale, sanzioni):
  [Frareg](https://www.frareg.com/it/sicurezza-sul-lavoro/riunione-periodica-sulla-sicurezza-cose-quando-e-obbligatoria-e-chi-partecipa/) ·
  [Normative & Sicurezza](https://www.normativesicurezza.com/news/riunione-periodica-sulla-sicurezza-chi-deve-farla-quando-e-cosa-scrivere-nel-verbale)
- Formazione — Accordo Stato-Regioni 17 aprile 2025 (datore di lavoro: 16 ore
  base, aggiornamento quinquennale 6 ore, entro 2 anni):
  [Vega Formazione](https://www.vegaformazione.it/PB/formazione-sicurezza-datore-lavoro-accordo-stato-regioni-2025-p539.html) ·
  [PuntoSicuro](https://www.puntosicuro.it/informazione-formazione-addestramento-C-56/accordo-stato-regioni-2025-cambiano-le-regole-sui-corsi-a-tema-sicurezza-AR-25629/)
- Preposto — D.L. 146/2021 (individuazione obbligatoria, formazione in presenza,
  aggiornamento almeno biennale):
  [Certifico](https://www.certifico.com/sicurezza-lavoro/news-sicurezza/obbligo-formazione-preposto-2022-novita-dl-146-2021) ·
  [PuntoSicuro](https://www.puntosicuro.it/preposti-C-74/la-formazione-obbligatoria-l-aggiornamento-del-preposto-AR-23904/)
- Titolo VIII agenti fisici (rumore capo II, vibrazioni capo III, allegato XXXV):
  [testo su Olympus/Uniurb](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=3864%3Atitolo-viii&catid=73&Itemid=137) ·
  [art. 202 valutazione rischi vibrazioni](https://tussl.it/titolo-viii-agenti-fisici/capo-iii-protezione-dei-lavoratori-dai-rischi-di-esposizione-a-vibrazioni/art-202)
- Verifiche periodiche attrezzature — D.M. 11/04/2011 (prima verifica INAIL entro
  45 giorni, successive ASL/ARPA o soggetti abilitati, registro di controllo):
  [testo del decreto (PDF, Unipa)](https://www.unipa.it/strutture/spp/.content/documenti/110411_DM_Lavoro_Verfiche_attrezzature.pdf) ·
  [INAIL — manutenzione, controllo e verifica](https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/conoscere-il-rischio/attrezzature-di-lavoro/manutenzione,-controllo-e-verifica-di-un-attrezzatura.html) ·
  [InSic](https://www.insic.it/sicurezza-sul-lavoro/prevenzione-infortuni-articoli/attrezzature-di-lavoro-e-verifiche-periodiche-dei-soggetti-abilitati/)
- Spazi confinati — D.P.R. 177/2011 (qualificazione imprese, procedure, permesso
  di lavoro):
  [InSic](https://www.insic.it/sicurezza-sul-lavoro/prevenzione-infortuni-articoli/dpr-177-2011-sicurezza-ambienti-confinati/) ·
  [PuntoSicuro](https://www.puntosicuro.it/spazi-confinati-C-46/alcuni-chiarimenti-sul-dpr-177/2011-AR-18868/)

### Near-miss — la novità che apre la finestra di mercato
- D.L. 159/2025 convertito in **L. 198/2025**: linee guida MLPS/INAIL entro sei
  mesi per identificazione, tracciamento e analisi dei near-miss; aziende oltre
  15 addetti; comunicazione di **dati aggregati su eventi e azioni
  correttive/preventive**; decreto attuativo sulle modalità:
  [Certifico — note al D.L. 159/2025](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note) ·
  [Studio Barbara Calvi — obbligo oltre 15 addetti](https://www.studiobarbaracalvi.com/novita-legge-198-2025-ex-dl-159-2025-obbligo-di-gestione-dei-near-miss-mancati-infortuni-per-aziende-con-piu-di-15-addetti/) ·
  [Azienda Digitale — Legge 198/2025 e linee guida INAIL](https://www.azienda-digitale.it/sicurezza-sul-lavoro/near-miss-legge-198-2025/) ·
  [Ambiente & Sicurezza](https://www.ambientesicurezzanews.it/in-evidenza/obbligo-registrazione-near-miss.php)
- Registro infortuni cartaceo **abolito** (D.Lgs 151/2015, dal 23/12/2015);
  resta la denuncia INAIL; consultazione tramite "Cruscotto infortuni":
  [Assimpredil Ance](https://portale.assimpredilance.it/articoli/abolizione-dell-obbligo-di-tenuta-del-registro-degli-infortuni-accessibilita-del-servizio-inail-cruscotto-infortuni-anche-da-parte-dei-datori-di-lavoro-e-dei-loro-consulenti) ·
  [Frareg — Cruscotto infortuni](https://www.frareg.com/it/sicurezza-sul-lavoro/cruscotto-infortuni-inail-per-datori-di-lavoro-e-soggetti-delegati/)

### Settore estrattivo (cave e miniere)
- D.Lgs 624/1996 — testo:
  [Parlamento.it](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
- DSS (contenuti art. 28 D.Lgs 81/08 integrati con art. 10 D.Lgs 624/96; firme di
  direttore responsabile, sorveglianti, medico competente e RLS; trasmissione
  all'autorità di vigilanza prima dell'inizio dei lavori; aggiornamento dopo
  modifiche o incidenti; certificazione annuale del datore di lavoro):
  [Wikipedia — Documento di sicurezza e salute](https://it.wikipedia.org/wiki/Documento_di_sicurezza_e_salute) ·
  [Studio Essepi](https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/documento-di-sicurezza-e-salute-dss-attivita-estrattive) ·
  [Certifico — Vademecum sicurezza attività estrattive](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/vademecum-sicurezza-attivita-estrattive) ·
  [Vademecum adempimenti attività estrattive (PDF, Enbital)](https://enbital.it/docs_upload/VADEMECUM-ADEMPIMENTI-SICUREZZA-ATTIVITA-ESTRATTIVE-Dic-2022_20230228170416.pdf)
- Stabilità dei fronti, caduta massi, relazione annuale, ruolo del sorvegliante:
  [Servizi Sicurezza sul Lavoro — stabilità dei fronti](https://www.servizi-sicurezza-sul-lavoro.it/rischio-settore-cave-ed-attivita-estrattive-la-stabilita-dei-fronti) ·
  [PuntoSicuro — gestione sicurezza cave a cielo aperto](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/come-gestire-la-sicurezza-nelle-cave-a-cielo-aperto-AR-19311/) ·
  [PuntoSicuro — rischi geologici](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/sicurezza-nella-cave-come-affrontare-valutare-i-rischi-geologici-AR-21954/)
- Silice cristallina respirabile: cancerogeno in allegato XLII (D.Lgs 44/2020,
  recepimento direttiva UE 2017/2398), VLEP 0,1 mg/m³ su 8 ore, **registro
  esposti art. 243** aggiornato almeno ogni 3 anni:
  [Certifico — rischio silice, quadro normativo](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/rischio-silice-quadro-normativo-e-documenti) ·
  [Ambiente & Sicurezza — silice libera cristallina](https://www.ambientesicurezzanews.it/sicurezza/silice-libera-cristallina-rischio-cancerogeno.php) ·
  [Confindustria Ceramica — sorveglianza sanitaria esposti](https://confindustriaceramica.it/documents/d/guest/4_silice-cristallina-respirabile_sorveglianza-sanitaria-lavoratori-esposti)
- Fochino: licenza rilasciata dal Prefetto (D.P.R. 302/1956) per preparazione e
  brillamento delle cariche:
  [Certifico — il fochino, quadro normativo](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/il-fochino-quadro-normativo) ·
  [Procedura di sicurezza — uso degli esplosivi in cava](https://www.testo-unico-sicurezza.com/procedura-di-sicurezza-uso-degli-esplosivi-in-cava.html)

### Indicatori
- Indice di frequenza, indice di gravità, LTIFR, riferimento **UNI 7249**:
  [Wikipedia — indice di frequenza](https://it.wikipedia.org/wiki/Indice_di_frequenza_degli_infortuni) ·
  [Wikipedia — indice di gravità](https://it.wikipedia.org/wiki/Indice_di_gravit%C3%A0_degli_infortuni) ·
  [Certifico — LTIFR](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/ltifr-lost-time-injury-frequency-rate-note)
- ISO 45001 (audit interno, riesame della direzione, limite degli indicatori solo
  *lagging*):
  [Erudio — struttura e principi](https://www.erudio.it/iso-45001-struttura-principi-e-modalita-operative/) ·
  [Sicurlive — ISO 45001 nelle attività ad alto rischio](https://www.sicurlivegroup.it/it/news/iso-45001-applicata-alle-attivita-ad-alto-rischio)

### Software di riferimento (cosa offrono)
- Italiani: [Zucchetti Safety/HSE](https://www.zucchetti.it/it/cms/soluzioni/safety-security/safety) ·
  [Sicurweb](https://www.sgslweb.it/software-sicurezza-lavoro/) ·
  [Risolvo — gestione scadenze HSE](https://www.risolvo-software-sicurezza.it/software/gestione-scadenze-hse) ·
  [JOB81](https://www.job81.it/) ·
  [Ordex HSE Manager](https://ordex.it/) ·
  [Twind](https://twind.io/it/software-sicurezza-sul-lavoro/)
- Internazionali: [EcoOnline EHS](https://www.ecoonline.com/en-us/ehs-software/) ·
  [Cority — audit e ispezioni](https://www.cority.com/corityone/audit-inspections/) ·
  [Riskonnect Health & Safety](https://riskonnect.com/health-and-safety-software/) ·
  [Certainty — guida EHS](https://www.certaintysoftware.com/guides/ehs-software/) ·
  [SafetyCulture / iAuditor](https://safetyculture.com/iauditor)
- Checklist e metodi di settore:
  [SafetyCulture — ispezione giornaliera di cava](https://safetyculture.com/library/mining/daily-quarry-inspection-mua4srtx5ly46jnr) ·
  [SafetyCulture — ispezione geotecnica di cava](https://safetyculture.com/library/mining/monthly-complete-check-around-quarry-haul-roads-and-edge-protection-sand-and-gravel-geotechnical-inspection-duplicate) ·
  [RiskSight — ICAM, 5 Whys e analisi causa-radice](https://risksight.com.au/blog/incident-investigation-methods/) ·
  [SafetyCulture — metodo dei 5 Perché](https://safetyculture.com/topics/5-whys)

---

*Documento di ricerca del 27/07/2026. Non è un parere legale: le norme citate
vanno sempre confermate con l'RSPP e il consulente dell'azienda. Nessuna
modifica al codice è stata fatta scrivendo questo documento.*
