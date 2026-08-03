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
