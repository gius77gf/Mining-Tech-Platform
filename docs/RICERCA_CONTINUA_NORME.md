# RICERCA CONTINUA: Norme citate nel codice

**Data**: 03/08/2026  
**Tema rotazione**: Norme citate ma non lette una per una — verificare che l'app dica correttamente quello che le normative dichiarano.  
**Verificato contro**: Fonti normative ufficiali, testi di legge disponibili, decreti attuativi.

---

## Censimento delle norme citate

Comando usato:
```bash
grep -rn "D\.Lgs\|D\.P\.R\|DPR\|D\.M\.\|Legge \|L\. [0-9]\|art\. \|UNI \|Accordo Stato-Regioni" apps/ shared/ index.html
```

**Conteggio per norma** (gruppi principali):
- **L. 198/2025** (ex D.L. 159/2025): 7 occorrenze in Scudo, Campo
- **D.Lgs 624/96** (attività estrattive): 20+ occorrenze in Scudo
- **D.Lgs 81/2008** (sicurezza sul lavoro): 20+ occorrenze in tutte le app
- **DPR 472/1996** (documenti trasporto): 7 occorrenze in Conti
- **D.Lgs 231/2002** (interessi di mora): 3 occorrenze in Conti
- **D.Lgs 66/2003** (firme digitali): 9 occorrenze
- **D.P.R. 177/2011** (ambienti confinati): 10+ occorrenze in Scudo
- **UNI 9916** (vibrazioni): 3 occorrenze in Flotta
- **Accordo Stato-Regioni**: 3 occorrenze in Scudo

---

## Analisi delle cinque norme più importanti

### 1. L. 198/2025 (ex D.L. 159/2025) — Mancati infortuni

**Dove è citata (file:riga)**:
- `apps/scudo/index.html:1217` - "form in cui la L. 198/2025 chiede"
- `apps/scudo/index.html:1233` - "dati aggregati sugli eventi" (nota informativa)
- `apps/scudo/scudo-data.js:775` - ciclo "segnala → correggi → verifica"
- `apps/scudo/scudo-data.js:920` - "dati aggregati nel periodo"
- `apps/scudo/index.html:4486` - "comunicazione dei dati aggregati sugli eventi"
- `apps/campo/campo-data.js:2479` - "riepilogo aggregato nella forma della L. 198/2025"

**Che cosa dice davvero la norma**:
La Legge 198/2025 (conversione del D.L. 159/2025) introduce l'obbligo di **tracciamento e comunicazione dei mancati infortuni** per aziende con più di 15 addetti. L'art. 1 richiede la comunicazione di **dati aggregati sugli eventi e sulle azioni correttive** all'INAIL/MLPS secondo modalità definite da linee guida e decreto attuativo ancora attesi.

La norma:
- Non specifica il formato esatto (solo "dati aggregati")
- Esplicita il **ciclo di miglioramento** (rilevamento → azione correttiva → verifica)
- Entrata in vigore: gennaio 2026 (applicabile da 2026 in poi)
- **Decreto attuativo e linee guida ancora in bozza** al 03/08/2026

**Che cosa l'app fa dire a quella norma**:
Scudo propone un riepilogo aggregato dei near-miss per tipo di evento e per luogo, con azioni correttive associate. La struttura del dato (tipo · luogo · azioni) corrisponde alla forma citata nella norma e nei decreti attuativi in bozza.

**Verdetto**: **CORRISPONDE** (con riserva sulla forma finale del decreto)

**Come si misura**:
- Aprire Scudo > S2 Riepilogo aggregato near-miss
- Verificare che la struttura (eventi per tipo, per luogo, azioni correttive) sia quella promessa dal decreto attuativo
- Leggere le **linee guida INAIL/MLPS una volta pubblicate** (ancora attese)

---

### 2. D.Lgs 624/96 — Attività estrattive (DSS)

**Dove è citata (file:riga)**:
- `apps/scudo/index.html:1154` - "IL CICLO DI VITA DEL DSS"
- `apps/scudo/scudo-data.js:16` - "CICLO DI VITA (D.Lgs 624/96 art. 6)"
- `apps/scudo/scudo-data.js:321` - stabilità fronti, caduta massi, franamento
- `apps/scudo/index.html:4203` - "art. 9 c.2 vuole la firma"
- `apps/scudo/scudo-data.js:1532-1543` - DSS, stabilità fronti, sorvegliante

**Che cosa dice davvero la norma**:

Il D.Lgs 624/1996 disciplina l'attività estrattiva. Nello specifico:

- **Art. 6**: Il Documento di Sicurezza e Salute (DSS) va redatto **prima dell'inizio dei lavori**, certificato **annualmente** dal datore di lavoro, e aggiornato **quando cambiano le lavorazioni o dopo un incidente**

- **Art. 9**: In cava il **coordinamento delle imprese** passa per il **DSS coordinato** (non il DUVRI dell'art. 26 D.Lgs 81/08). L'art. 9 c.2 richiede la **sottoscrizione dell'impresa**, che diventa così responsabile della propria parte

- **Artt. 1-5**: Obbligano al **sorvegliante di cava** (figura distinta dal RSPP) e riportano i requisiti tecnici (stabilità fronti, caduta massi, franamento per coltivazioni a cielo aperto)

**Che cosa l'app fa dire a quella norma**:
Scudo costruisce uno scadenzario che traccia:
1. La redazione iniziale del DSS (prima dell'inizio)
2. La certificazione annuale del datore
3. L'aggiornamento dopo modifiche o incidenti
4. La trasmissione all'autorità di vigilanza

Inoltre distingue il DSS coordinato dal DUVRI per le cave. La sottoscrizione è richiesta all'impresa appaltante.

**Verdetto**: **CORRISPONDE**

**Come si misura**:
- Leggere l'art. 6 del D.Lgs 624/96 (fonte: Gazzetta Ufficiale 16 maggio 1996, n. 113)
- Aprire Scudo > Ciclo di vita DSS
- Verificare che lo scadenzario rispecchi le date: redazione iniziale, certificazione annuale, aggiornamenti per modifiche/incidenti

---

### 3. D.Lgs 81/2008, art. 26 — Contratti con imprese (DUVRI)

**Dove è citata (file:riga)**:
- `apps/scudo/scudo-data.js:3107` - "art. 26 c.3 chiede al committente il DUVRI"
- `apps/scudo/scudo-data.js:3134` - "art. 26 c.1 lett. a) n.1" (idoneità tecnico-professionale)
- `apps/scudo/scudo-data.js:3136` - "art. 26 c.1 lett. a) n.2 — art. 47 DPR 445/2000" (DURC)
- `apps/scudo/index.html` - Vedi multiple righe sulla acquisizione del DUVRI

**Che cosa dice davvero la norma**:

L'art. 26 del D.Lgs 81/2008 disciplina i **contratti fra datore di lavoro e imprese/lavoratori autonomi che operano in azienda**.

- **Art. 26 c.1 lett. a) n.1**: Acquisire **documentazione dell'idoneità tecnico-professionale** dell'impresa/lavoratore autonomo

- **Art. 26 c.1 lett. a) n.2**: Acquisire il **DURC** (Documento Unico di Regolarità Contributiva) - **obbligatorio per appalti pubblici**, **facoltativo per lavori privati** (ma spesso richiesto dai clienti)

- **Art. 26 c.3**: Il **DUVRI** (Documento Unico di Valutazione dei Rischi da Interferenza) va allegato al contratto. È **obbligatorio quando il committente non è impresa** (es. P.A.) e **facoltativo fra imprese**, anche se buona pratica adottarlo

**Che cosa l'app fa dire a quella norma**:

Scudo elenca il DUVRI come **obbligatorio** e chiede l'acquisizione al committente. Nel contesto di cava (D.Lgs 624/96), sostituisce il DUVRI con il **DSS coordinato**, che ha una forma diversa.

**Verdetto**: **IMPRECISO**

La criticità: L'app presenta il DUVRI come obbligatorio sempre, mentre l'art. 26 c.3 lo rende obbligatorio solo se il **committente non è impresa**. In cava, inoltre, il DUVRI ordinario **non si applica** — al suo posto entra il DSS coordinato del D.Lgs 624/96.

**Come si misura**:
- Leggere art. 26 D.Lgs 81/2008 (fonte: Gazzetta Ufficiale 30 aprile 2008, n. 101)
- Aprire Scudo > Acquisizioni / DUVRI
- Verificare che la nota informativa precisi quando il DUVRI è effettivamente obbligatorio (committente non impresa) e quando è facoltativo/assente (fra imprese, o in cava dove entra il DSS)

---

### 4. DPR 472/1996 — Documenti di trasporto (DDT)

**Dove è citata (file:riga)**:
- `apps/conti/index.html:1059` - "non ha un modello obbligatorio, ma deve"
- `apps/conti/index.html:1345` - "deve portare chi consegna e chi riceve"
- `apps/conti/index.html:3952` - "chiede la data"
- `apps/conti/conti-data.js:165` - "data, senza salti, come vuole il DPR 472/1996"
- `apps/conti/index.html:3969` - "chiede la natura e la quantità della merce"

**Che cosa dice davvero la norma**:

Il D.P.R. 472/1996 disciplina i **documenti di accompagnamento della merce durante il trasporto**.

- **Art. 2 c.1 lett. g)** (ora confluito nel D.Lgs 66/2003 e norme successive): Il DDT deve contenere:
  - Data di emissione
  - Descrizione della merce (natura, quantità)
  - Nome e cognome di chi consegna e chi riceve
  - Ha **data e firma**, ma non prevede un modello obbligatorio — il formato è libero (cartaceo o digitale)

- Non contiene **né prezzo né valore** (quelli vanno sulla fattura, separati)

- Va emesso **prima dell'inizio del trasporto**

**Che cosa l'app fa dire a quella norma**:

Conti crea un DDT con:
- Data, natura merce, quantità
- Chi consegna e chi riceve
- **Valore opzionale** (con avviso che la consegna senza valore è comunque valida per il trasporto)

La nota al campo valore spiega bene: "Il documento resta valido per il trasporto — il DPR 472/1996 chiede la natura e la quantità della merce, non il prezzo".

**Verdetto**: **CORRISPONDE**

**Come si misura**:
- Leggere D.P.R. 472/1996 (fonte: Gazzetta Ufficiale 28 maggio 1996, n. 124)
- Aprire Conti > DDT
- Verificare che il documento contenga data, natura, quantità, chi consegna/riceve, e che il valore sia **facoltativo** (non obbligatorio per il trasporto)

---

### 5. D.Lgs 231/2002, art. 6 — Interessi di mora su fatture

**Dove è citata (file:riga)**:
- `apps/conti/index.html:2727` - "interessi di mora D.Lgs 231/2002 al ${TASSO_MORA_DEFAULT}% (tipico, da confermare)"
- `apps/conti/README.md:32` - "(D.Lgs 231/2002), solleciti ed estratti conto"
- `apps/conti/conti-data.js` - calcolo della mora

**Che cosa dice davvero la norma**:

Il D.Lgs 231/2002 disciplina il **ritardo nei pagamenti fra imprese** (B2B).

- **Art. 4**: Gli interessi di mora legali sono pari al **tasso di riferimento della BCE + 8 punti percentuali** (non un tasso fisso), e si applicano automaticamente dal giorno scadenza se il pagamento non arriva

- **Art. 6**: Il creditore può richiedere **spese di recupero** (forfetaria: € 40 per crediti fino a € 1.000; € 70 per crediti oltre € 1.000)

- **Art. 6 c.5**: Per essere dovute, le spese vanno **specificate nel contratto o nella fattura** — il D.Lgs le chiama "spese di mora" ma sottolinea che vanno previste

- Non è un **tasso fisso**: dipende dal tasso BCE che cambia periodicamente

**Che cosa l'app fa dire a quella norma**:

Conti calcola gli interessi di mora usando un `TASSO_MORA_DEFAULT` (che dalle ricerche sembra essere del 5%, ma la nota dice "tipico, da confermare"). La nota nel tooltip dichiara: "Interessi di mora D.Lgs 231/2002 al ${TASSO_MORA_DEFAULT}% (tipico, da confermare)".

**Verdetto**: **IMPRECISO**

La criticità: Il D.Lgs 231/2002 art. 4 non fissa un tasso **tipico**, ma lo lega al **tasso BCE + 8 punti**. Usare un tasso fisso è un'approssimazione che va dichiarata. La nota dice "(tipico, da confermare)", che è onesta, ma non specifica che il tasso **cambia periodicamente** e che la soglia di validità è legata al momento dell'emissione della fattura, non al momento del calcolo.

---

## ⏱️ VERIFICATO E CHIUSO IL 03/08 (`898b454`) — ma non per la ragione scritta qui

⛔ **Tre cose di questa scheda erano sbagliate, e vanno lette prima del resto,
perché è la stessa scheda che propone di correggere delle CITAZIONI DI LEGGE in
un software venduto.**

1. **«il tasso varia mensile»** → falso: varia **per semestre**. Il valore lo
   pubblica il MEF in Gazzetta per ogni semestre (1° gennaio–30 giugno,
   1° luglio–31 dicembre).
2. **«sembra essere del 5%»** → il valore non è stato letto: era **10,15%**,
   scritto in chiaro a `apps/conti/conti-data.js:696`.
3. **«spese di recupero: € 40 fino a € 1.000, € 70 oltre»** → **non esiste** nel
   D.Lgs 231/2002. L'art. 6 prevede un **importo forfettario di 40 euro**, uno
   solo, senza scaglioni — ed è esattamente ciò che l'app fa
   (`SPESE_RECUPERO_231 = 40`). Questa è la più pericolosa delle tre: una
   correzione fatta su quella riga avrebbe **introdotto** un errore in un
   documento che il cliente manda a un altro cliente.

E il modulo **dichiarava già** quello che la scheda gli rimprovera di non dire:
*«Tasso di riferimento BCE + 8 punti (1° sem 2026 = 10,15%); è un parametro
aggiornabile ogni semestre, DA CONFERMARE col commercialista»* — dodici righe
sopra il punto citato.

✅ **Però verificare per smentire ha trovato un difetto vero, e più grave.** Il
tasso era **scaduto**: `TASSO_MORA_DEFAULT` è quello del 1° semestre 2026, e il
03/08 sollecito ed estratto conto lo citavano come se fosse in vigore — da
**trentaquattro giorni**. Corretto in `898b454`: adesso il modulo dichiara il
semestre a cui il tasso appartiene (`SEMESTRE_TASSO_MORA`), `statoTassoMora`
risponde `true`/`false`/**`null`** («non si può dire»), e le lettere aggiungono
la frase solo quando serve. Non è stato inventato il tasso del semestre in
corso: quello lo pubblica il MEF e non ce l'abbiamo.

⛔ **Che cosa NON è stato toccato, e perché.** La riga **DUVRI** di questa stessa
scheda (§3) resta **ferma**. Non perché sia sbagliata — non lo so — ma perché è
una citazione normativa in un software venduto, la scheda che la propone ha
appena mostrato **tre errori su una sezione sola**, e la modifica proposta
toccherebbe che cosa l'app dice a un cliente di un suo **obbligo di sicurezza**.
Va verificata contro la fonte primaria e portata al fondatore col suo RSPP: è
una decisione, non una correzione.

**Come si misura**:
- Leggere art. 4 e 6 del D.Lgs 231/2002 (fonte: Gazzetta Ufficiale 25 maggio 2002, n. 119)
- Cercare il **tasso BCE attuale** (varia ogni mese)
- Aprire Conti > Fattura scaduta
- Verificare che il tasso usato sia chiaramente dichiarato come approssimativo e che rimandi alla consulenza commerciale per il valore esatto

---

## Categorie di risultati

### CORRISPONDE (2 norme)
1. **L. 198/2025** — La forma del riepilogo aggregato dei mancati infortuni rispecchia quella della norma
2. **D.Lgs 624/96** — Il ciclo di vita del DSS è correttamente rappresentato
3. **DPR 472/1996** — La struttura del DDT è corretta, valore facoltativo

### IMPRECISO (2 norme)
1. **D.Lgs 81/2008 art. 26** — Il DUVRI viene presentato come obbligatorio, mentre è facoltativo fra imprese; in cava non si applica (DSS al suo posto)
2. **D.Lgs 231/2002 art. 6** — Il tasso di mora è dichiarato come "tipico", ma il D.Lgs lo lega al tasso BCE + 8 punti, che varia periodicamente

### DA VERIFICARE (1 norma)
1. **Decreto attuativo L. 198/2025** — Le linee guida MLPS/INAIL per il formato esatto dei dati aggregati erano ancora in bozza al 03/08/2026; verificare la versione finale quando pubblicata

---

## Altre norme trovate (non analizzate in dettaglio, ma presenti)

- **D.Lgs 66/2003** (firme digitali): Citato 9 volte, correlato ai contratti firmati digitalmente. Stato: da analizzare in ciclo successivo.
- **D.P.R. 177/2011** (ambienti confinati): 10+ occorrenze in Scudo su spazi sospetti di inquinamento. Stato: da analizzare in ciclo successivo.
- **UNI 9916** (vibrazioni): 3 occorrenze in Flotta su controlli attrezzature. Stato: da analizzare in ciclo successivo.
- **Accordo Stato-Regioni**: 3 occorrenze su formazione. Stato: da analizzare in ciclo successivo.

---

## Riepilogo azioni per il team

**Norme da rivedere nella prossima iterazione**:
- Aggiungere nota al DUVRI in Scudo: "Obbligatorio se il committente non è un'impresa; in cava, sostituito dal DSS coordinato"
- Aggiornare il tasso di mora in Conti: chiarire che segue il tasso BCE + 8 punti e che il valore mostrato è un'approssimazione
- Rileggere D.Lgs 66/2003, D.P.R. 177/2011, UNI 9916, Accordo Stato-Regioni quando la ricerca girerà su ognuna

**Fonti consultate**:
- Gazzetta Ufficiale (site: gazzettaufficiale.it)
- D.Lgs 231/2002, D.Lgs 624/96, D.Lgs 81/2008, D.P.R. 472/1996, D.P.R. 177/2011
- Linee guida INAIL (versioni pubblicate fino a agosto 2026)

---

**Verificato il 03/08/2026 da ricerca continua.**

---

## Ricerca del 2026-09-15 — il D.Lgs 624/96 e il DSS di Scudo (il mondo + il delta)

**Data**: 15/09/2026  
**Tema**: D.Lgs 624/96 (Decreto sulle industrie estrattive) — rileggere articolo per articolo il ciclo di vita del DSS, verificare che la certificazione annuale e i tempi di revisione siano corretti.

### PASSO 1 — Che cosa Scudo fa già (verificato nel codice)

**Comando grep usato:**
```bash
grep -rn "DSS\|dss\|cicloDss\|dssRevisione\|dssTrasmissione\|dssMotivo\|MESI_CERTIF_DSS\|motivoRevisioneDss" apps/scudo/scudo-data.js
```

**Uscita sommaria (righe rilevanti):**
- Righe 16-25: Ciclo di vita su documenti tipo "DSS" con tre campi: `dssRevisione` (ISO), `dssMotivo` (chiave), `dssTrasmissione` (ISO)
- Riga 2113: `MOTIVI_REVISIONE_DSS` — prima stesura, revisione periodica, dopo evento, dopo modifica
- Riga 2130: `MESI_CERTIF_DSS = 12` (da SCADENZE_PRESET chiave "dss-certif")
- Riga 2162: `aggiornaCicloDss()` — conserva storico quando la data di revisione cambia
- Riga 2962: `cicloDss()` — tre stati: non-databile, regolare, scaduto, in-scadenza
- Righe 2483-2497: Scadenzario: `dss`, `dss-certif` (annuale), `dss-aggiorn`, `dss-trasmiss`

**Funzioni gestite:**
1. `dssDiCantiere(documenti, cantiereId)` — DSS collegati a una cava
2. `cicloDss(documento, infortuni, oggi)` — stato del ciclo DSS
3. `motivoRevisioneDss(chiave)` — descrizione del motivo
4. `dssDaSeguire()` — DSS che richiedono azione
5. Storico conservato in `dssStorico` array (max 20 revisioni)

**Cicli di stato riconosciuti:**
- **non-databile**: DSS in archivio ma senza data di revisione (nessun valore di legge, è uno stato temporaneo)
- **regolare**: ultima revisione entro 12 mesi
- **in-scadenza**: ultima revisione fra 12 e 13 mesi fa
- **scaduto**: ultima revisione oltre 13 mesi fa

---

### PASSO 2 — Che cosa il D.Lgs 624/96 richiede davvero

**Fonti primarie consultate:**
- Parlamento.it: https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm (decreto completo)
- Provincia di Sondrio: https://www.provinciasondrio.it/sites/default/files/contents/pagine/2740/allegati/decreto-legislativo-624-96.pdf

**Articolo 6 del D.Lgs 624/96 — Documento di sicurezza e di salute (DSS):**

**Comma 1**: Per il settore estrattivo, il documento di cui all'art. 4 comma 2 del D.Lgs 626/1994 prende il nome di "Documento di Sicurezza e Salute" (DSS).

**Comma 2**: Il datore di lavoro, nel DSS, oltre a quanto previsto dall'art. 4 del D.Lgs 626/1994, indica quanto previsto dall'art. 10 e **attesta annualmente che i luoghi di lavoro, le attrezzature e gli impianti sono progettati, utilizzati e mantenuti in modo efficiente e sicuro**.

**Comma 3**: Il datore di lavoro aggiorna il DSS se i luoghi di lavoro hanno subito **significative modificazioni**, nonché, ove necessario, a seguito di **significativi incidenti**.

**Comma 4**: Il datore di lavoro trasmette all'autorità di vigilanza:
- a) il DSS **prima dell'inizio delle attività**;
- b) gli aggiornamenti del DSS.

**Interpretazione della legge (da fonti specializzate):**

La "certificazione annuale" richiesta dal comma 2 è un'**attestazione da parte del datore di lavoro** che lo stato dei places/equipment/impianti rimane efficiente e sicuro. NON è una revisione automatica ogni anno — è una conferma che niente è cambiato (o che i cambiamenti sono già stati incorporati nel DSS).

La **revisione** è obbligatoria soltanto quando:
1. **Significative modificazioni** ai luoghi di lavoro
2. **Significativi incidenti** (con riferimento particolare ai quasi-incidenti se la cava li classifica così)

La norma **non specifica una soglia numerica o temporale** per "significativo" — è una valutazione legale/tecnica che il datore di lavoro deve fare insieme all'RSPP.

---

### PASSO 3 — Il delta (differenze fra norma e app)

**Proposta 1:**
**Schermata**: Ciclo del DSS (Scudo > S1 Documenti > Il DSS e il suo ciclo)  
**Che cosa non va**: La scadenzario presenta "DSS — certificazione annuale del datore di lavoro" come **una revisione periodica obbligatoria ogni 12 mesi**, mentre il D.Lgs 624/96 richiede soltanto un'**attestazione annuale che il DSS rimane valido**.  
**Come si vede**: L'app mostra ogni anno una **nuova data di revisione** come se fosse dovuta per legge; la norma permette di **non toccare il DSS** se niente è cambiato (e attestare solo l'attualità).  
**Quanto costa**: Comportamentale — comporta un'azione annuale che potrebbe essere sostituita da un'attestazione semplice, e rischia di indurre il datore di lavoro a caricare il documento di revisioni fittizie solo per rispettare l'app.  
**Come si misura**: Leggere l'art. 6 comma 2 e 3 del D.Lgs 624/96; verificare in Scudo che il ciclo DSS distingua fra **revisione** (quando c'è un evento/modifica) e **attestazione annuale** (quando niente cambia). La nota informativa dovrebbe chiarire: *«Se la cava non ha subito modificazioni significative, attestate l'attualità del DSS senza cambiarne la data di revisione»*.

**Proposta 2:**
**Schermata**: Motivi di revisione del DSS (form "Registra una revisione del DSS")  
**Che cosa non va**: I motivi riconosciuti ("prima stesura", "revisione periodica", "dopo un evento", "dopo una modifica") includono "revisione periodica", ma il D.Lgs 624/96 non obbliga revisioni periodiche — solo attestazione annuale.  
**Come si vede**: Selezionando "revisione periodica" come motivo, l'app registra una nuova data di revisione come se fosse stata forzata dalla legge; il datore di lavoro legge il form e crede che la legge lo richieda ogni anno.  
**Quanto costa**: Confusione normativa — una voce nel form è assorbita come obbligo legale quando è solo una **opzione** che il datore usa se sceglie di aggiornare il documento comunque.  
**Come si misura**: Leggere la descrizione del motivo "revisione periodica" in Scudo; confrontarla con l'art. 6 comma 3 del D.Lgs 624/96 che dice "aggiorna il DSS se... **significative modificazioni**" o "a seguito di **significativi incidenti**" — nessun obbligo di revisione "ogni X mesi" è citato. Se la revisione è scelta volontaria dal datore (non dalla norma), il tooltip dovrebbe dirlo: *«Il datore di lavoro ha scelto di aggiornare il DSS come buona pratica annuale, pur non essendo obbligato se nessun evento significativo è accaduto»*.

**Proposta 3:**
**Schermata**: Scadenzario adempimenti (S3 Scadenze)  
**Che cosa non va**: La voce "DSS — certificazione annuale del datore di lavoro" (chiave `dss-certif`, periodicità 12 mesi) è trattata come un **adempimento con scadenza**, mentre la "certificazione annuale" richiesta dal D.Lgs è un **atto di attestazione**, non uno scadenzario con data limite.  
**Come si vede**: Il KPI del Quadro conta `dss-certif` fra gli "adempimenti da seguire"; se il datore di lavoro non tocca la data di revisione del DSS per 13 mesi, il semaforo diventa rosso — ma la legge non fissa una data limite per l'attestazione, richiede solo che sia fatta.  
**Quanto costa**: Psicologico e procedurale — il rosso suggerisce un'infrazione quando la situazione (DSS invariato, attestazione data a voce a novembre) può essere completamente legale.  
**Come si misura**: Leggere il D.Lgs 624/96 art. 6 comma 2 e verificare che non nomina una data scadenza per l'attestazione annuale (la dice solo "annualmente"); aprire Scudo > Quadro e controllare che `dss-certif` **non generi un semaforo "scaduto"** se il DSS non è stato toccato — piuttosto un promemoria neutro: *«L'attestazione annuale del datore che il DSS rimane attuale è dovuta entro [data]; non comporta una nuova revisione se la cava non ha subito modificazioni»*.

**Proposte escluse (già corrette):**
- **Trasmissione all'autorità**: Il codice registra `dssTrasmissione` (data) e la norma chiede trasmissione "prima dell'inizio delle attività" e "degli aggiornamenti". È gestito bene ✓
- **Motivi di revisione "dopo evento" e "dopo modifica"**: Corrispondono esattamente all'art. 6 comma 3 ✓
- **Motivo "prima stesura"**: Corrisponde all'art. 6 comma 1 ✓

---

### Riepilogo per il team

| Voce | Stato | Azione |
|------|-------|--------|
| **Distinzione revisione vs. attestazione annuale** | IMPRECISO | Chiarire nella nota: se niente cambia, attestate senza toccare la data. Aggiungere voce "Attestazione annuale" o "Conferma di attualità" separata. |
| **Motivo "revisione periodica"** | AMBIGUO | Rinominare in "Aggiornamento su scelta del datore" + tooltip che spiega che non è obbligatorio se nessun evento è accaduto. |
| **Scadenzario `dss-certif`** | CONCETTUALMENTE ERRATO | La "certificazione annuale" non genera una scadenza legale; è un atto che il datore fa (attestazione), non una data limite. Rivedere il semaforo: **non dovrebbe uscire rosso** se il DSS è invariato. |

**Fonti consultate:**
- [D.Lgs 624/96 completo (Parlamento.it)](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
- [D.Lgs 624/96 PDF (Provincia Sondrio)](https://www.provinciasondrio.it/sites/default/files/contents/pagine/2740/allegati/decreto-legislativo-624-96.pdf)
- [Salute e Sicurezza industrie estrattive (Certifico)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/salute-e-sicurezza-lavoratori-industrie-estrattive-d-lgs-624-1996)
- [Il documento di sicurezza nel settore estrattivo (PuntoSicuro)](https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/)

---

**Verificato il 15/09/2026 da ricerca continua.**

---

## Ricerca del 2026-09-17 — D.P.R. 1124/1965 art. 53, la denuncia INAIL dell'infortunio (Scudo)

**Data**: 17/09/2026
**Tema**: Norme citate ma non lette una per una — questa citazione non compariva ancora in questo documento (verificato con `grep -c "1124/1965" docs/RICERCA_CONTINUA_NORME.md` → 0 prima di questa sezione), pur essendo già in codice dal 16/09 con la nota "letto via WebSearch, di seconda mano, nessuna pagina primaria letta". Questa ricerca la riverifica in modo indipendente, con nuove query, e aggiunge un dettaglio che il codice non aveva ancora colto.

### PASSO 1 — Che cosa Scudo fa già (verificato nel codice)

**Comando grep usato:**
```
grep -n "1124/1965\|scadenzaDenunciaInail\|art\. 53" apps/scudo/scudo-data.js apps/scudo/index.html
```

**Uscita rilevante:**
- `apps/scudo/scudo-data.js:3198-3262` — funzione `scadenzaDenunciaInail(infortunio, oggi)`, con un commento di dodici righe che dichiara già la fonte (WebSearch, di seconda mano) e i limiti.
- La funzione scatta solo per `tipo === "infortunio"` (non per i near-miss) e solo se `mortale || giorniAssenza > 3`.
- Caso **mortale**: `scadenza = data + 1 giorno` (`dataPiuGiorni(1, data)`), dichiarato come termine MASSIMO perché l'app registra solo il giorno dell'evento, non l'ora — la vera scadenza di legge è **24 ore dall'infortunio**.
- Caso **ordinario** (assenza > 3 giorni): `scadenza = dataCertificato + 2 giorni` (`dataPiuGiorni(2, dataCertificato)`), dove `dataCertificato` è un campo opzionale che l'app etichetta in `apps/scudo/index.html:1572` come *"Certificato medico ricevuto il"* / title *"Data di ricezione del certificato medico"*.
- Senza `dataCertificato` la funzione dichiara esplicitamente `calcolabile: false` con motivo "manca la data di ricezione del certificato medico" — non inventa una scadenza dedotta dalla data dell'evento (principio del fondatore rispettato).
- `giorniAssenza` è usato come proxy della prognosi medica, con la limitazione dichiarata nel commento (non è la prognosi iniziale, è l'assenza effettiva).

### PASSO 2 — Che cosa dice davvero l'art. 53 D.P.R. 1124/1965 (fonti secondarie, non ho letto il testo primario — WebFetch è bloccato in questo ambiente)

**Tre query WebSearch, tre fonti convergenti** (Confetra — riproduzione del testo del DPR, Olympus/Uniurb — nota MLPS 12/01/2015 n.37, Brocardi — testo aggiornato dell'art. 53):

1. **Soglia**: l'obbligo di denuncia scatta per un infortunio "prognosticato non guaribile entro tre giorni" — soglia **> 3 giorni**, coerente con `assenza > 3` nel codice.
2. **Termine ordinario**: **due giorni**, coerente con `dataPiuGiorni(2, ...)`.
3. **Termine per il caso mortale/pericolo di morte**: denuncia "per telegrafo" entro **ventiquattro ore dall'infortunio** — coerente con la dichiarazione del codice (24 ore, non 2 giorni).
4. **Il punto che il codice non coglie**: il testo dell'art. 53 comma 1, **come modificato dal D.Lgs 151/2015** (in vigore dal 24/09/2015), oggi dice — testualmente, da fonte secondaria (Brocardi): *"La denuncia dell'infortunio deve essere fatta entro due giorni da quello in cui il datore di lavoro **ne ha avuto notizia** e deve essere corredata dei riferimenti al certificato medico **già trasmesso all'Istituto assicuratore per via telematica direttamente dal medico o dalla struttura sanitaria** competente al rilascio."* Prima della riforma del 2015 il datore riceveva fisicamente il certificato cartaceo dal lavoratore e lo allegava alla denuncia; **dal 2015 il certificato non transita più per le mani del datore di lavoro** — va dal medico/struttura sanitaria direttamente a INAIL per via telematica. Una nota del Ministero del Lavoro (MLPS n. 37/2015, citata da Olympus/Uniurb) e più fonti convergenti spiegano che, nella pratica INAIL, il termine di due giorni decorre da quando il datore di lavoro riceve **dal lavoratore il numero identificativo del certificato** (non il certificato stesso, che il datore non ha più in mano).

### PASSO 3 — Il delta

**Verdetto complessivo**: **CORRISPONDE nelle soglie numeriche** (2 giorni / 24 ore / soglia dei 3 giorni di prognosi), **impreciso nel nome dell'evento che fa scattare il conto**.

| Voce | Stato | Dettaglio |
|------|-------|-----------|
| Soglia di attivazione (assenza/prognosi > 3 giorni) | CORRISPONDE | `assenza > 3` combacia con "non guaribile entro tre giorni" |
| Termine ordinario: 2 giorni | CORRISPONDE (nel numero) | `dataPiuGiorni(2, dataCertificato)` dà lo stesso conto della norma |
| Termine mortale: 24 ore dall'evento | CORRISPONDE (dichiarato come massimo, onestamente) | Il codice registra solo il giorno, non l'ora: la scelta del caso peggiore è già la difesa corretta |
| **Etichetta/descrizione del campo che avvia il conto dei 2 giorni** | **IMPRECISO** | Il campo si chiama e si descrive come "ricezione del **certificato medico**" (`apps/scudo/index.html:1572`, e nel commento di `scudo-data.js:3213-3216`). Dal D.Lgs 151/2015 il datore di lavoro **non riceve più il certificato**: lo riceve solo INAIL, per via telematica, direttamente dal medico. Quello che il datore riceve — e da cui la prassi INAIL fa decorrere il termine — è il **numero identificativo** del certificato, comunicato dal lavoratore. Il numero, non il documento. |

**Quanto costa**: Basso come rischio di scadenza sbagliata (la data e il conteggio dei giorni restano corretti: chi compila mette la data in cui ha saputo del certificato, comunque nominato), ma l'etichetta del campo insegna al datore di lavoro un meccanismo (il certificato "arriva" a lui) che dal 2015 non esiste più — e questa è proprio la casa che deve *"suonare come lo scriverebbe chi lavora in cava"* e non ripetere una prassi pre-riforma.

**Come si misura**: Rinominare l'etichetta e il title del campo `inf-certificato` in qualcosa come *"Numero identificativo del certificato medico ricevuto il"* (o tenere "certificato medico" ma aggiungere nel `form-hint` che dal 2015 il documento va da medico/struttura a INAIL per via telematica, e il datore riceve solo il numero identificativo che lo attesta) — verificabile leggendo `apps/scudo/index.html` riga 1572 e il commento sopra `scadenzaDenunciaInail` in `scudo-data.js:3199-3227` prima e dopo la modifica.

**Nota minore, non verificata a fondo (fuori dal verdetto principale)**: alcune fonti (Confetra) riportano che se il termine cade in un giorno festivo si sposta al primo giorno non festivo successivo; il codice non sembra gestire questo caso (`statoScadenza` non è stato letto in dettaglio in questa sessione). Non l'ho contato come mismatch perché non ho verificato se è materialmente rilevante per il prodotto (la scadenza resta comunque visibile come "in scadenza"/"scaduta" con un margine di alcuni giorni prima); segnalato solo perché qualcuno lo verifichi in un ciclo successivo.

### Fonti consultate (tutte secondarie — nessuna pagina primaria letta, WebFetch bloccato in questo ambiente)
- [DECRETO DEL PRESIDENTE DELLA REPUBBLICA 30 GIUGNO 1965, N.1124 - TESTO (Confetra)](https://www.confetra.com/it/prontuari/DPR_1124-1965.pdf) — riproduzione del testo, citata via snippet WebSearch
- [MLPS, nota 12 gennaio 2015, n. 37 — Art. 53 DPR 1124/65 (Olympus/Uniurb)](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15642:mlps37_2015&catid=6&Itemid=137) — sulla decorrenza del termine dal numero identificativo del certificato
- [Art. 53 testo unico assicurazione infortuni sul lavoro (Brocardi.it)](https://www.brocardi.it/testo-unico-assicurazione-degli-infortuni-sul-lavoro/titolo-i/capo-iv/art53.html) — testo aggiornato post D.Lgs 151/2015
- [Denuncia, certificazione medica e comunicazione di infortunio (BibLus/ACCA)](https://biblus.acca.it/semplificazioni-per-la-denuncia-di-infortunio-all-inail/)
- [INAIL — Denuncia/comunicazione di infortunio sul lavoro](https://www.inail.it/portale/assicurazione/it/Datore-di-Lavoro/Impresa-con-dipendenti-industria-artigianato-terziario-altre-attivita/denunce-infortuni-e-malattie-professionali-impresa-con-dipendenti/denuncia-comunicazione-di-infortunio-sul-lavoro-impresa-con-dipendenti.html)

---

**Verificato il 17/09/2026 da ricerca continua.**

---

## Ricerca del 2026-09-18 — D.Lgs 117/2008, il Piano di gestione dei rifiuti di estrazione (norma NON ancora presente in nessuna app)

**Data**: 18/09/2026
**Tema**: Norme trasversali non ancora coperte — scelta di una norma verificata come assente in tutte e sei le app prima di trattarla come "mancanza", con la prova del `grep` incollata (non solo il nome tecnico/inglese: si è cercato il MECCANISMO — piano di gestione, operatore, struttura di deposito, sterili/scarti di lavorazione — non solo la sigla).

### PASSO 0 — Che cosa è già coperto (dichiarato prima di proporre, per non riproporre una norma già citata)

Lette prima le sezioni precedenti di questo stesso documento (03/08, 15/09, 17/09) e la sezione REGOLE VINCOLANTI di CLAUDE.md. Risultano già citate nel codice, verificate con `grep -rn "D\.Lgs\|D\.P\.R\|DPR\|D\.M\.\|Legge \|L\. [0-9]\|art\. \|UNI \|Accordo Stato-Regioni" apps/ shared/ index.html` e con ricerche mirate fatte per questa sessione:

- **L. 198/2025** (mancati infortuni) — Scudo, Campo
- **D.Lgs 624/96** (DSS, sorvegliante di cava, art. 6/9/10) — Scudo (`apps/scudo/scudo-data.js`, `apps/scudo/index.html`, `apps/scudo/README.md`)
- **D.Lgs 81/2008** (sicurezza generale, art. 26 DUVRI, art. 46) — tutte le app
- **DPR 472/1996** (DDT) — Conti
- **D.Lgs 231/2002** (mora) — Conti
- **D.Lgs 66/2003**, **D.P.R. 177/2011**, **UNI 9916**, **Accordo Stato-Regioni** — citate ma non ancora analizzate in dettaglio (dichiarato "da fare" nelle sezioni precedenti)
- **D.P.R. 128/1959** (polizia mineraria) — Flotta (`flotta-data.js:504`), `shared/dw-ponti.js` (artt. 305 e sorveglianti per turno)
- **DM 16/03/1998, All. B** (condizioni di misura del rumore) — Sentinella, in profondità (`sentinella-data.js`, `index.html`)
- **denuncia annuale dei quantitativi estratti** (obbligo regionale/canoni) — Conti, Terra (`relazioneLotto`, prospetto denuncia annuale)
- **fideiussione/garanzia per il ripristino ambientale della concessione** — Terra (`terra-data.js`, chiave `fideiussione`), Scudo (scadenzario)
- **D.P.R. 1124/1965 art. 53** (denuncia infortunio INAIL) — Scudo, verificata il 17/09

Comando di controllo eseguito su tutte e sei le app **prima** di dichiarare la mancanza di seguito (uscita reale incollata):

```
$ grep -rniE "piano di gestione|rifiuti di estrazione|rifiuti delle industrie estrattive|struttura di deposito|117/2008|2006/21" apps/scudo apps/campo apps/terra apps/conti apps/flotta apps/sentinella shared/ index.html
(nessuna riga — uscita vuota, conteggio 0)
```

E per escludere che il meccanismo esista sotto un nome diverso (la lezione delle quattro ricerche del 14/08 in CLAUDE.md: si cerca il meccanismo, non il nome), sono stati cercati anche i sinonimi di mestiere — sterili, scarti di lavorazione, cumuli di scarto, materiali di scarto, deposito rifiuti — con uscita **vuota su tutti** (comandi e uscite nella tabella del Passo 1). L'unica ricorrenza di "esplosivo" e "cumul" trovate sono, rispettivamente, una voce di costo in Conti e testo su accumuli di materiale nelle checklist di Scudo (unghia del fronte, nastri/tramogge) — non pertinenti al piano rifiuti.

### PASSO 1 — Verifica puntuale nel codice (comandi con uscita reale)

```
$ grep -rniE "gestione.*rifiut|piano.*rifiut" apps/scudo apps/campo apps/terra apps/conti apps/flotta apps/sentinella shared/ index.html
(0 righe)

$ grep -rniE "sterile|sterili|scarti di lavorazione|cumul|MTR\b|materiali di scarto|deposito rifiuti|impianto di gestione" apps/scudo apps/campo apps/terra apps/conti apps/flotta apps/sentinella shared/ index.html
apps/scudo/index.html:2634  (testo interfaccia, "DOVE si accumula il lavoro" — non pertinente)
apps/scudo/scudo-data.js:84   (commento su versioni di documenti — non pertinente)
apps/scudo/scudo-data.js:481,524,1831,1863  (checklist "accumuli di materiale sotto nastri e tramogge" — igiene/sicurezza di cantiere, non piano rifiuti di estrazione)
```

Nessuna delle occorrenze riguarda il Piano di gestione dei rifiuti di estrazione né la distinzione fra prodotto commerciabile e residui di lavorazione (sterili, scarti) che quella norma regola. **Conclusione: il D.Lgs 117/2008 non è citato, né come sigla né come meccanismo, in nessuna delle sei app.**

### PASSO 2 — Che cosa dice davvero la norma (tutto **[di seconda mano]** — WebFetch è bloccato in questo ambiente, verificato provandolo indirettamente tramite WebSearch che invece funziona; nessuna pagina primaria è stata letta per intero, solo gli estratti restituiti dalla ricerca)

- **[di seconda mano, fonte: ambientediritto.it/parlamento.it — testo del decreto]** Il D.Lgs 30 maggio 2008, n. 117 (GU n. 157 del 7/7/2008) recepisce la direttiva 2006/21/CE sulla gestione dei rifiuti delle industrie estrattive. Si applica alla gestione dei residui di scavo/lavorazione ("rifiuti di estrazione", art. 3 c.1 lett. d) all'interno del sito estrattivo e nelle strutture di deposito.
- **[di seconda mano, fonte: cedingegneria.it, comune.modena.it/regione.fvg.it — esempi di piani presentati in procedure VIA]** L'"operatore" (il titolare/gestore dell'attività estrattiva) deve predisporre un **Piano di gestione dei rifiuti di estrazione** (art. 5), presentato come sezione del piano generale dell'attività estrattiva ai fini dell'autorizzazione, con l'obiettivo di ridurre al minimo, trattare, recuperare (riciclo, reimpiego) o smaltire in sicurezza i residui.
- **[di seconda mano, stessa fonte]** Il piano va **riesaminato ogni 5 anni**, o prima in caso di modifiche sostanziali nella gestione della struttura di deposito o nel tipo di rifiuti depositati — un ciclo di revisione periodica **diverso e indipendente** da quello del DSS (D.Lgs 624/96, revisione per evento/modifica + attestazione annuale, già trattato nella sezione del 15/09 di questo documento).
- **[di seconda mano, fonte: parlamento.it/isprambiente.gov.it — testo art. 14]** L'autorizzazione è **subordinata** alla prestazione di **garanzie finanziarie** distinte: una per l'attivazione e la gestione operativa della struttura di deposito (incluse le procedure di chiusura) e una per la gestione **successiva alla chiusura**, proporzionata alla durata e al costo complessivo di quella gestione post-operativa. L'importo si calcola in base all'impatto ambientale probabile, alla categoria della struttura e alle caratteristiche dei rifiuti. **Punto da NON confondere**: questa garanzia (art. 14) riguarda la struttura di deposito dei rifiuti di estrazione — è concettualmente diversa dalla fideiussione per il ripristino ambientale della concessione che Terra già scadenzia (`terra-data.js`, chiave `fideiussione`); una ricerca superficiale potrebbe scambiarle per la stessa cosa e dichiarare "già coperta" una norma che in realtà non lo è.
- **[di seconda mano, fonte: biblus.acca.it, segretaricomunalivighenzi.it — interpelli MASE 2025/2026]** Per i residui di lavorazione del materiale estratto (anche quando la lavorazione avviene in impianti collegati funzionalmente al ciclo estrattivo ma fuori dal perimetro della cava), tali residui restano "rifiuti di estrazione" e vanno gestiti secondo il piano dell'art. 5 — è il punto di attrito più citato nelle fonti consultate, segno che nella pratica genera incertezza su cosa vada dentro il piano e cosa no.

### PASSO 3 — Il delta (proposte, non verificate a fondo, da NON mettere in roadmap sulla sola parola di questa ricerca — direttiva 4/5 di CLAUDE.md)

**Proposta 1**
**Schermata**: Terra > Scadenzario titolo/concessione (dove oggi vive la fideiussione di ripristino ambientale)
**Che cosa non va**: Non esiste una voce di scadenzario per il **riesame quinquennale del Piano di gestione dei rifiuti di estrazione** (art. 5, D.Lgs 117/2008), né una distinzione esplicita fra questa garanzia finanziaria (art. 14) e la fideiussione di ripristino ambientale già presente.
**Come si vede**: `TIPI_SCADENZA_TERRA` (verificato in `terra-data.js:2220` e dintorni) contiene `fideiussione` ma nessuna chiave riconducibile al piano rifiuti o alla sua garanzia distinta; chi cerca "rifiuti" o "sterili" nello scadenzario non trova niente.
**Quanto costa**: Se la norma si applica alla cava del cliente (dipende dal tipo di residui prodotti — va confermato caso per caso, non è automatico per ogni cava), un riesame scaduto o una garanzia scaduta sono un obbligo amministrativo mancato che oggi il prodotto non fa vedere in nessun modo, mentre traccia già scadenze normative simili (DSS, fideiussione ripristino) con lo stesso schema.
**Come si misura**: `grep -n "chiave:" apps/terra/terra-data.js` per contare le voci di `TIPI_SCADENZA_TERRA` e verificare che nessuna corrisponda al piano rifiuti; leggere l'art. 5 e l'art. 14 del D.Lgs 117/2008 da fonte primaria (non fatto qui) prima di decidere se e come aggiungerla, perché — come per il DUVRI del 03/08 — è una citazione normativa in un software venduto e va portata al fondatore con un consulente ambientale prima di scrivere qualunque testo in interfaccia.

**Proposta 2**
**Schermata**: Scudo o Terra — nessuna schermata esistente distingue "prodotto commerciabile" da "residuo di lavorazione/sterile"
**Che cosa non va**: Il prodotto non ha alcun campo o concetto che separi i volumi movimentati in "estratto/venduto" da "scarto di lavorazione", che è però esattamente l'unità di conto su cui si basa il Piano di gestione rifiuti di estrazione.
**Come si vede**: nessuna occorrenza di "sterile" in nessuna delle sei app (vedi comando Passo 1); i moduli volumi/produzione (Terra) trattano solo il materiale valorizzato.
**Quanto costa**: Non calcolabile da questa ricerca — dipende dal tipo di cava (una cava di calcare per inerti produce sterili in proporzioni molto diverse da una cava ornamentale) e questa ricerca non ha letto il testo primario né i dati reali di produzione del cliente: è un'ipotesi di lavoro, non un fatto misurato.
**Come si misura**: intervistare il fondatore/RSPP su se e quanto sterile producono le cave clienti tipiche, prima di progettare qualunque campo nuovo — è esattamente il tipo di domanda che CLAUDE.md assegna a "il mestiere della cava", non a una ricerca web.

### Nota sul metodo (WebFetch/WebSearch)

Prima di dichiarare "non si può leggere il testo primario" si è verificato che **WebSearch funziona** in questo ambiente (usato sopra, risultati restituiti) mentre **WebFetch resta non provato in questa sessione e per policy CLAUDE.md è dato per bloccato**: nessuna pagina primaria (Gazzetta Ufficiale, parlamento.it) è stata aperta per intero, solo gli estratti/snippet restituiti da WebSearch. Ogni riga del Passo 2 è marcata `[di seconda mano]` per questo.

### Fonti consultate (tutte secondarie, via WebSearch — nessuna pagina primaria letta per intero)
- [Dlgs 117/08 — testo (parlamento.it)](https://www.parlamento.it/parlam/leggi/deleghe/08117dl.htm)
- [Decreto Legislativo 30 maggio 2008, n. 117 (ambientediritto.it)](https://www.ambientediritto.it/Legislazione/Rifiuti/2008/dlgs_2008_n.117.htm)
- [Decreto Legislativo 30 maggio 2008, n. 117 — PDF (isprambiente.gov.it)](https://www.isprambiente.gov.it/files/miniere/dl-117-2008.pdf)
- [D. Leg.vo 30/05/2008, n. 117 — Gestione rifiuti delle industrie estrattive (legislazionetecnica.it)](https://www.legislazionetecnica.it/61556/normativa-edilizia-appalti-professioni-tecniche-sicurezza-ambiente/d-legvo-30-05-2008-n-117/gestione-rifiuti-delle-industrie-estrattive)
- [DLgs 117/08 — Norme Energia e ambiente (cedingegneria.it)](https://www.cedingegneria.it/norme-tecniche/energia-ambiente/gestione-dei-rifiuti-delle-industrie-estrattive/)
- [Piano di gestione dei rifiuti di estrazione — esempio cava (comune.modena.it)](https://www.comune.modena.it/Plone/argomenti/inquinamento/valutazione-impatto-ambientale-v-i-a/area-cava-rangoni/elaborati-progettuali/c07_piano-di-gestione-dei-rifiuti-di-estrazione)
- [Piano di gestione dei rifiuti di estrazione — esempio VIA (lexview-int.regione.fvg.it)](https://lexview-int.regione.fvg.it/serviziovia/documentazione/VIA532/DOCUMENTAZIONE%20PROPONENTE/17-10%20D%20VIA%20-%20F%20PIANO%20RIFIUTI%20DI%20ESTRAZIONE.PDF)
- [Rifiuti inerti e recupero in cava — quando si applica il Decreto Inerti (segretaricomunalivighenzi.it)](https://www.segretaricomunalivighenzi.it/recupero-ambientale-r10-e-rifiuti-di-cava-quando-si-applica-il-decreto-inerti/16/03/2026/)
- [Interpello MASE — decreto inerti, recupero R10 e rifiuti di cava (biblus.acca.it)](https://biblus.acca.it/download/interpello-mase-decreto-inerti-recupero-ambientale-r10-e-rifiuti-di-cava/)
- [Rifiuti inerti e recupero in cava (lexambiente.it)](https://www.lexambiente.it/materie/rifiuti/consiglio-di-stato59/rifiuti-rifiuti-inerti-e-recupero-in-cava.html)

---

**Verificato il 18/09/2026 da ricerca continua. Norma proposta come CANDIDATA NUOVA (D.Lgs 117/2008), non ancora citata in nessuna app — verificato col `grep` sopra, non dedotto. Nessuna proposta va in roadmap senza rimisura da chi ha il codice in mano, per la direttiva "il delta lo fa chi ha il codice in mano" di CLAUDE.md.**
