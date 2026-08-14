# Ricerca continua — Campo

## 🔍 Blocco 1: Rapporto di fine turno e registro giornaliero in cava — normativa e pratica di settore

**Data**: 14 agosto 2026  
**Commit**: 74e3377e  
**Verificato su**: apps/campo/campo-data.js (righe 6-50: schema dati), apps/campo/index.html (struttura pagine)

### ⚠️ Ciò che esiste già in Campo
- **rapportini**: titolo, squadra, data, turno, prodQta (quantità), prodUnita (unità), ora, stato (bozza|inviato), fronteId
- **attivita**: data, turno, titolo, dettaglio, squadra, operatore, stato (pianificata|in-corso|anomalia|conclusa)
- **chiusure**: data, turno, consegna (chi consegna), ricevuta (chi riceve), note, ora (timestamp chiusura), riaperture (array di riaperture)
- **presenze**: appello turno con stato presente|assente, orari entrata/uscita
- **meteo**: cielo, piste, visibilita, note
- **durate**: minuti dichiarati per il turno (denominatore della disponibilità)
- **pianocarico**: dati da CSV Genesi (foro, x, fila, prof, prog, borr, rit, reale)

### Metà 1: Il mondo — Normativa e pratica

#### Normativa italiana (D.Lgs 624/1996 e DPR 128/1959)

Il D.Lgs. 624/1996 (novembre 1996) recepisce le direttive 92/91/CEE e 92/104/CEE sulla sicurezza nel settore estrattivo e rimane il riferimento primario per le cave a cielo aperto in Italia.

**Contenuto obbligatorio di registrazioni di fine turno** (da DPR 128/1959 "Norme di polizia delle miniere e delle cave", art. 64.1.20):
- Al termine di ogni turno, il personale responsabile della supervisione deve **informare la squadra subentrante dello stato dei lavori e di tutte le circostanze che hanno importanza per la sicurezza**
- Il direttore di cantiere compie **verifiche costanti** delle condizioni di sicurezza con frequenza proporzionale al progredire dei lavori e all'avanzamento del fronte, confrontando la situazione con il progetto

**Documento di Sicurezza e Salute (DSS)** (D.Lgs 624/1996):
- Documento annuale obbligatorio in cui il datore di lavoro attesta che "i luoghi di lavoro, le attrezzature e i sistemi sono progettati, utilizzati e mantenuti in modo efficiente in sicurezza"
- Va trasmesso all'autorità di vigilanza prima dell'inizio dell'attività e in seguito per modifiche importanti ai luoghi di lavoro o su incidenti rilevanti
- **Fonte**: [Regione Toscana — Linee guida regionali DLgs 624 del 96](https://www.regione.toscana.it/documents/10180/70872/Linee+guida+regionali+DLgs+624+del+96/e59e9f59-9962-4571-bcf9-1711f52e9acb)

**Toscana (linee guida regionali)** e **Lombardia** (Catasto regionale) centralizzano i registri di turno per la vigilanza pubblica.

#### Terminologia tecnica di settore (cave a cielo aperto)

Le ricerche su glossari tecnici restituiscono:

- **Fronte (o fronte di escavazione)**: zona attiva di estrazione che si sviluppa lungo i versanti disegnando una geometria a gradini
- **Gradone**: terrazzamento con alternanza di "alzate" (altezze verticali) e "pedate" (piani orizzontali) di dimensioni variabili a seconda della struttura geologica e del metodo di abbattimento
- **Volata (o abbattimento)**: rimozione di quantitativi rilevanti di roccia mediante esplosivi, caratterizzata da un piano di carico (fori, carica per foro, progressione)
- **Sterile**: roccia e materiale scavato senza valore economico, che va gestito in aree di accumulo
- **Tout-venant**: materiale di risulta mescolato, non classificato
- **Riprésino / Pista carabile**: vie di circolazione per i mezzi di trasporto
- **Ripristino ambientale**: lavori di restituzione del sito alle condizioni pre-escavazione o a destinazione concordata
- **Abbancamento**: accumulo controllato di materiale sterile

**Fonte**: Glossari tecnici da [UNIGE — Glossario sulla pietra da costruzione](http://www.disclic.unige.it/glos_pietra/show.php?id=36&lang=it&style=1), [BibLus — Guida INAIL Scavo a cielo aperto](https://biblus.acca.it/guida-inail-2018-sistemi-di-protezione-scavi-a-cielo-aperto/)

#### Software di settore in Italia

Le ricerche hanno restituito:

1. **Project BUILDING** (Project S.r.l.): software gestionale completo per cave e impianti di produzione di calcestruzzo, con moduli di gestione della produzione e tracciamento automatico dei costi per turno
2. **Software MES** (Manufacturing Execution System): monitoring in tempo reale dei processi, raccolta dati di produzione e processo, tracciabilità turni
3. **Software di gestione turni** (Zucchetti, NoBadge): raccolta dati presenze, pianificazione turni, analytics immediate

Nessuna delle ricerche ha restituito il **campo esatto** richiesto da legge in un rapporto di fine turno (se obbligatorio per legge o solo per pratica), ma tutti i software tracciavano:
- **Produzione giornaliera** (quantità, unità: m³ o tonnellate)
- **Ore lavorate per turno e disponibilità**
- **Presenze e assenze del personale**
- **Condizioni del sito e meteo**

**Fonte**: [Project Building — Software impianti e cave](https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html), [Brava Manufacturing — Monitoraggio produzione](https://www.bravomanufacturing.it/software-di-monitoraggio-e-controllo-della-produzione/)

---

### Metà 2: Il DELTA su Campo

**Comando per verificare i campi di rapportini**: `grep -n "rapportini" apps/campo/campo-data.js | head -5`  
**Uscita**: Righe 12, 282-300 nel file

Rapportini in Campo contengono già: `data, turno, titolo, squadra, prodQta, prodUnita, ora, stato, fronteId`

**Che cosa esiste**:
- ✅ Quantità prodotta e unità (m³, t) — chiave per la produzione giornaliera
- ✅ Data, turno, ora della registrazione
- ✅ Squadra responsabile
- ✅ Stato (bozza|inviato) — traccia di finalizzazione
- ✅ Fronte associato

**Che cosa manca o merita verifica**:
- ❓ Che cosa conta come "rapporto di fine turno" legale in Italia — se esiste un modulo obbligatorio per legge (D.Lgs 624/1996 o DPR 128) o se le regioni lo standardizzano
- ❓ Firma del direttore di cantiere / preposto e firma di chi riceve ("consegna e ricevuta") — **esiste in chiusure**, ma non è detto che sia collegato al rapportino
- ❓ "Circostanze che hanno importanza per la sicurezza" (art. 64.1.20 DPR 128) — nel modello attuale rientra in `attivita.dettaglio` o `chiusure.note`, non centralizzato
- ❓ Riepilogo fermi (causale + durata) — `attivita.causale` e `attivita.fermoMin` esistono, ma vanno sommati manualmente per la disponibilità
- ❓ Anomalie o eventi registrati nel turno (infortuni, near-miss, guasti) — Campo riceve infortuni da Scudo (ponte P5) e note di meteo, non aggrega anomalie dal turno stesso

**Prossimo passo atomico**: 
Cercare i documenti regionali (Toscana, Lombardia) e il manuale tecnico del Catasto Cave e Miniere per leggere il modulo effettivo richiesto agli ispettori, così verificare quali campi là sono obbligatori e quali Campo deve ancora aggiungere per fare la "firma del turno" completa e legale.

---

**Blocco scritto**: 14/08/2026 — ricerca in corso, fonti citate, non verificate ulteriormente

---

## 🔍 Blocco 2: Monitoraggio della produzione estratta — obbligo di dichiarazione regionale

**Data**: 14 agosto 2026  
**Commit**: 74e3377e  
**Approfondimento**: normativa di tariffazione regionale

### Metà 1: Il mondo — Obbligo di dichiarazione della quantità estratta

#### Obbligo regionale di quantificazione (tutte le regioni)

Tutte le regioni italiane con attività estrattive applicano un **sistema di tariffe proporzionale al volume estratto**. Ciò implica che gli operatori di cava devono dichiarare (almeno annualmente, spesso con cadenza periodica) la quantità di materiale estratto.

**Secondo le ricerche**:
- Gli operatori **devono inviare dichiarazioni quantificando il volume di materiale estratto nell'anno**, utilizzando moduli specifici disponibili tramite i sistemi informatici regionali
- Le tariffe sono determinate sulla base delle **caratteristiche mercantili del materiale estratto**, indipendentemente dal suo uso industriale successivo
- La quantità estratta è il parametro di base per:
  - Calcolo dei **canoni regionali** dovuti
  - Applicazione di **sanzioni** in caso di sforamento rispetto alle autorizzazioni
  - **Controllo dell'attività** da parte delle autorità regionali

Questo obbligo è descritto come conseguenza diretta della **pianificazione regionale delle attività estrattive di cava** (PRAE — Piano Regionale Attività Estrattive).

**Fonte**: [Quarry and Construction Web — Le tariffe di escavazione delle cave](https://www.quarryandconstructionweb.it/rubriche/collaborazioni/le-tariffe-di-escavazione-delle-cave:-gli-obiettivi-e-le-contraddizioni-della-legislazione-regionale.htm), [Regione Piemonte — Onere per il diritto di escavazione](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione)

#### Monitoraggio della produzione: ruoli regionali, provinciali e locali

Il **monitoraggio** della produzione estratta avviene a tre livelli:
1. **Regione**: adotta PRAE e conduce attività di polizia mineraria; rilascia autorizzazioni
2. **Province**: responsabili della protezione territoriale e controllo delle attività
3. **Comuni**: coinvolti nella vigilanza locale e autorizzazione comunale

**Fonte**: [ReteAmbiente — Rapporto Cave 2014](https://www.reteambiente.it/repository/normativa/rapporto_cave_2014.pdf), [Regione Lombardia — Pianificazione regionale delle attività estrattive di cava](https://www.regione.lombardia.it/wps/portal/istituzionale/HP/DettaglioRedazionale/istituzione/direzioni-generali/direzione-generale-ambiente-e-clima/pianificazione-regionale-cave/pianificazione-regionale-cave)

#### Frequenza e forma della dichiarazione

Le ricerche **non hanno restituito** la frequenza esatta (giornaliera, settimanale, mensile, annuale) della dichiarazione di quantità estratta — solo che esiste un obbligo di "denuncia" della produzione annuale. È possibile che:
- Il **rapportino di turno** (con quantità) sia l'elemento di base da cui la dichiarazione regionale viene **aggregata** (anno su anno)
- Oppure che la dichiarazione regionale e il rapportino siano due documenti **indipendenti** (il primo annuale, il secondo giornaliero/settimanale)

**Prossimo passo**: verificare i regolamenti regionali specifici (Lombardia, Emilia-Romagna) per leggere la frequenza richiesta.

### Metà 2: Il DELTA su Campo

**Comando per verificare campi di rapportini**: `grep -n "prodQta\|prodUnita" apps/campo/campo-data.js`  
**Uscita**: Righe 12, 282-300 nel file

**Che cosa esiste**:
- ✅ **prodQta** e **prodUnita** nei rapportini — i dati essenziali per la dichiarazione regionale
- ✅ **stato** (bozza|inviato) — traccia di finalizzazione e comunicazione
- ✅ **fronteId** — specifica quale fronte ha prodotto quella quantità

**Che cosa potrebbe servire per la legge**:
- ❓ Verifica che ogni rapportino inviato sia **irreversibile** (non cancellabile)
- ❓ Export/aggregazione automatica dei rapportini per la **dichiarazione regionale** (somma delle prodQta per anno)
- ❓ Traccia di **quale autorità regionale** ha ricevuto la dichiarazione e quando

**Conferma**: La struttura di rapportini con prodQta + fronteId è coerente con l'obbligo di dichiarazione. Campo ha i pezzi, ma non è chiaro se esista un flusso di "esportazione per la regione" o se la quantità prodotta sia utilizzata solo internamente per analisi di cantiere.

**Prossimo passo atomico**:
1. Leggere i regolamenti regionali Lombardia/Emilia-Romagna (PRAE, legge regionale) per verificare la frequenza di dichiarazione richiesta
2. Controllare se Campo ha già un esportatore di dati per le regioni, oppure se questa è una funzione mancante
3. Verificare se il "rapporto di fine turno legale" è distinto dal rapportino (produzione), oppure se sono lo stesso documento

---

**Blocco scritto**: 14/08/2026 — blocco 2, ricerca in corso

---

## 🔍 Blocco 3: Infortuni, near-miss e anomalie nel rapporto di fine turno

**Data**: 14 agosto 2026  
**Commit**: 74e3377e  
**Approfondimento**: obbligo di comunicazione di sicurezza nel turno

### Metà 1: Il mondo — Registrazione di infortuni e near-miss

#### Obbligo di registrazione (Legge 198/2025 + INAIL)

La **Legge 198/2025** ha introdotto **obbligo di registrazione** dei "near miss" (mancati infortuni) in Italia. Prima della legge, erano facoltativi.

**Fattispecie da registrare in un rapporto di sicurezza di turno** (da regolamenti INAIL e linee guida):
1. **Infortuni con prognosi > 3 giorni**: obbligatori al datore di lavoro, comunicati a INAIL entro tempi specifici
2. **Near miss**: dal 2025, devono essere registrati e comunicati **annualmente ad INAIL in forma aggregata e anonimizzata**
3. **Circostanze che hanno importanza per la sicurezza**: (da DPR 128/1959, art. 64.1.20) — il termine è volutamente ampio

**Dall'articolo 64.1.20 del DPR 128/1959 - "Norme di polizia delle miniere e delle cave"**:  
Al termine del turno, il personale responsabile deve **"informare di tutte le circostanze aventi importanza per la sicurezza"** — ciò include:
- Infortuni e near-miss del turno stesso
- Anomalie della struttura (crepe, distacchi, instabilità)
- Guasti meccanici o impiantistici
- Condizioni meteorologiche critiche
- Incidenti stradale o di trasporto

**Fonte**: [INAIL — Linee guida near-miss 2025](https://www.azienda-digitale.it/sicurezza-sul-lavoro/near-miss-legge-198-2025/), [PuntoSicuro — Sicurezza nelle miniere a cielo aperto](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/sicurezza-sul-lavoro-nelle-miniere-a-cielo-aperto-AR-20986/), [Osservatorio Amianto — La sicurezza sul lavoro in Miniera](https://www.osservatorioamianto.it/sicurezza-mineraria/)

#### Comunicazione obbligatoria all'autorità

Alcuni eventi richiedono **comunicazione immediata** all'autorità di vigilanza:
- Incidenti gravi (esplosioni, frane, alluvioni, crolli)
- Qualunque fatto o manifestazione sospetta che metta in pericolo persone e giacimenti

**Fonte**: [Brasca & Partners — Sicurezza sul lavoro nelle miniere a cielo aperto](https://www.brascaepartners.it/web/2021/03/25/sicurezza-sul-lavoro-nelle-miniere-a-cielo-aperto/)

### Metà 2: Il DELTA su Campo

**Comando per verificare infortuni in Campo**: `grep -n "infortuni\|scadenze" apps/campo/campo-data.js | head -10`  
**Uscita**: Righe 259-280 nel file (infortuniScudo dalla ponte P5)

**Che cosa esiste**:
- ✅ **infortuniScudo**: registrazione degli infortuni collegata (ponte P5 da Scudo), con data, turno, gravita, descrizione, categoria
- ✅ **chiusure**: note che possono contenere riassunti di sicurezza del turno
- ✅ **attivita.anomalia**: stato "anomalia" per registrare malfunzionamenti

**Che cosa manca o merita approfondimento**:
- ❓ Che cosa accade agli **infortuni senza turno indicato** (come gli infortuni i4 e i5 della dimostrazione, che "non hanno turno")? Rientrano nel "rapporto di fine turno" ricostruito per quel giorno, oppure rimangono fuori?
- ❓ **Near-miss**: non c'è una collezione specifica per i near-miss — solo infortuni. Dopo la Legge 198/2025, va aggiunta una raccolta di near-miss (e va verificato come collegarli a turni e fronti)
- ❓ **Esportazione per INAIL**: non è chiaro se Campo aggreghi gli infortuni per fare il **report annuale ad INAIL** (mandatorio dalla Legge 198/2025)
- ❓ **Link fra rapportino e anomalie**: il rapportino ha "stato", ma nessun campo "anomalie_del_turno" — come collega il prodotto alle anomalie di sicurezza avvenute nello stesso turno?

**Citazione rilevante da campo-data.js** (righe 264-266):
```
// ⛔ NESSUNO DEI DUE HA IL `turno`, e non è una dimenticanza: sono stati
   registrati DA SCUDO, che il turno non lo chiede. È proprio il caso che
   `segnalazioniDelTurno` tiene a parte
```

Questo commento indica che **Campo è consapevole** di infortuni "senza turno", ma la soluzione proposta (`segnalazioniDelTurno`) non è ancora visibile nel codice.

**Prossimo passo atomico**:
1. Verificare se `segnalazioniDelTurno` esiste già come funzione di aggregazione
2. Controllare se va aggiunta una collezione **near-miss** distinta da infortuni
3. Verificare se esiste un esportatore per il **report INAIL** da infortuni + near-miss dell'anno

---

**Blocco scritto**: 14/08/2026 — blocco 3, ricerca in corso

---

## 🔍 Blocco 4: Riepilogo — campi e flussi da verificare

**Data**: 14 agosto 2026  
**Commit**: 74e3377e

### Il rapporto di fine turno completo — anatomia normativa vs. implementazione Campo

Dalle quattro ricerche emerge che il **rapporto di fine turno legale in una cava italiana** deve contenere:

| Elemento | Norma | Che cosa Campo ha già | Che cosa va verificato |
|----------|-------|----------------------|----------------------|
| **Chi consegna / Chi riceve** | DPR 128/1959 art. 64.1.20 | ✅ Campi `consegna`, `ricevuta` in chiusure (index.html riga 1124-1125) | ✅ Presente, il turno si "chiude e firma" |
| **Data e ora della firma** | DPR 128/1959 art. 64.1.20 | ✅ Campo `ora` in chiusure | ✅ Presente |
| **Produzione estratta** | Obbligo regionale di tariffazione | ✅ `prodQta` e `prodUnita` in rapportini | ⚠️ Verificare se esporta per le regioni |
| **Fronte / area di lavoro** | Implicito (quale fronte ha prodotto) | ✅ `fronteId` in rapportini, `area` in squadre | ✅ Presente |
| **Anomalie e circostanze di sicurezza** | DPR 128/1959 art. 64.1.20 | ⚠️ Sparse: `attivita.anomalia`, `chiusure.note`, infortuni da Scudo | ❌ Non centralizzate |
| **Infortuni e near-miss** | Legge 198/2025 + INAIL | ✅ Infortuni da Scudo (ponte P5) | ⚠️ Nuovi near-miss non hanno collezione |
| **Presenze (chi ha lavorato)** | D.Lgs 81/2008 + riposo fra turni | ✅ Appello presenze con orari entrata/uscita | ✅ Presente |
| **Condizioni del sito (meteo, piste)** | Implicito nella sicurezza | ✅ Collezione `meteo` | ✅ Presente |
| **Durata effettiva turno** | Denominatore della disponibilità | ✅ Campo `durate` (minuti dichiarati) | ⚠️ Verificare se è calcolato o solo dichiarato |
| **Irreversibilità** (non cancellabile dopo firma) | DPR 128/1959 art. 64.1.20 | ✅ "Turno chiuso e firmato, non si può più cambiare" (index.html riga 1554) | ✅ Implementato |

### Domande aperte per i prossimi blocchi

1. **Flusso di esportazione regionale**: Campo raccoglie la produzione in rapportini, ma **dove finisce questa dichiarazione per la regione?** È un'esportazione a fine mese/anno? È automatica o manuale?

2. **Aggregazione di anomalie**: Le "circostanze che hanno importanza per la sicurezza" sono sparse in tre collezioni (attivita, chiusure.note, infortuni). Va creato un **prospetto unico di anomalie del turno** che le aggreghi?

3. **Near-miss post-Legge 198/2025**: La legge richiede registrazione. Campo ha infortuni, ma non ha una collezione distinta per near-miss. Va aggiunta?

4. **Riaperture del turno**: Campo ha un array `chiusure.riaperture` per tracciare riaperture. Va verificato se questa feature è usata e testata.

5. **Conformità al modulo regionale**: Ogni regione (Lombardia, Emilia-Romagna, Toscana…) ha il suo modulo per il Catasto Cave. Va leggere il modulo effettivo di una regione per verificare se Campo contiene tutti i campi obbligatori.

### Prossime mosse di ricerca

**Priorità alta**:
- [ ] Leggere il manuale del Catasto Cave e Miniere (Gennaio 2026) per i campi obbligatori
- [ ] Verificare le leggi regionali (Lombardia, Emilia-Romagna) sulla frequenza e forma di dichiarazione della produzione
- [ ] Cercare se esiste un modello standard nazionale per "rapporto di fine turno" oppure se è lasciato alle regioni

**Priorità media**:
- [ ] Verificare se Campo ha un esportatore dati per le dichiarazioni regionali
- [ ] Controllare se la funzione `segnalazioniDelTurno` esiste già (menzionata nel commento di campo-data.js)
- [ ] Consultare il DSS (Documento di Sicurezza e Salute) della cava d'esempio per leggere che cosa Scudo + Campo dicono sui turni

---

**Ricerca**: 14/08/2026 — **CONTINUA** — tre blocchi completati, fronti documentati, fonti citate; prossimi blocchi in sospeso per accesso ai documenti regionali


---

## ⛔ RIVERIFICA DEL 14/08 — la mancanza principale è FALSA, e il limite dello strumento va scritto per bene

*Rimisurato dal ciclo contro il commit di HEAD, prima che una riga di qui
entrasse in roadmap. Vale la regola: **niente entra sulla parola dell'agente**.*

### 1. «Near-miss: non c'è una collezione specifica» — la frase è vera, il VERDETTO è falso

Il documento propone di «aggiungere una raccolta di near-miss». **La funzione
esiste già, ed è costruita apposta.** I comandi, rilanciati:

```sh
grep -rciE "near.?miss|mancato infortunio|quasi infortunio" apps/campo/campo-data.js apps/campo/index.html
#   campo-data.js:16   index.html:23
grep -rciE "near.?miss|mancato infortunio|quasi infortunio" apps/scudo/scudo-data.js apps/scudo/index.html
#   scudo-data.js:69   index.html:75
grep -rc "198/2025" apps/scudo/scudo-data.js apps/scudo/index.html
#   scudo-data.js:6    index.html:6
```

E il **come** conta più del quanto: in Scudo lo schema è
`infortuni/{id}: { tipo: infortunio|near-miss, categoria (tipo di rischio),
gravitaPotenziale, anonimo, rapida, … }` — cioè il near-miss **non è una
collezione a parte per scelta**, è un tipo dentro la stessa collezione, con i
campi che servono solo a lui. E Campo ha un **ponte dedicato** (P5) il cui
commento dice perché: *«un near-miss o lo si segnala nei trenta secondi dopo o
non lo si segnala più»*. La dimostrazione ne contiene già quattro.

⛔ **La forma di questo errore è nuova e va riconosciuta: una frase LETTERALMENTE
VERA che porta un verdetto falso.** «Non c'è una collezione distinta» è esatto —
e la conclusione che ne segue, «va aggiunta», manderebbe un cantiere a
**spaccare in due** una funzione progettata unita, dopo che la legge citata era
già stata letta e implementata. È la stessa famiglia del «non c'è» falso, con
l'aggravante che il `grep` di controllo, se cerca *la parola dell'agente*
(«collezione near-miss»), **conferma**.
La difesa è quella di sempre, applicata al verdetto invece che al termine:
prima di scrivere «va aggiunto», si cerca **come si chiama la cosa se esistesse
fatta in un altro modo**.

### 2. «Il proxy blocca i documenti regionali» — vero, e va scritto con precisione

Misurato, non creduto: `WebFetch` su `caveminiere.servizirl.it` e su
`gazzettaufficiale.it` risponde **`EGRESS_BLOCKED`** in tutt'e due i casi.
Quindi il limite è reale — **ma non è «la rete è bloccata»**, ed è la differenza
che conta:

| strumento | esito |
|---|---|
| `WebSearch` | **funziona** (le fonti di questo documento vengono da lì) |
| `WebFetch` su un dominio qualunque | **bloccato dal proxy di uscita** |
| `curl` | 403 dal proxy |

⚠️ **La conseguenza pratica, che riguarda ogni ricerca futura di questa casa**:
si può sapere **che cosa esiste** e come viene descritto, ma **non si può
leggere il testo primario**. Quindi tutto ciò che in un documento di ricerca è
attribuito a una norma — un articolo, una scadenza, una tariffa — viene da
**risultati di ricerca**, non dal documento aperto, e va marcato così. Un numero
di legge riportato di seconda mano e scritto in una schermata è peggio di un
numero assente: il fondatore lo mostrerebbe a un cliente.

### 3. Che cosa regge di questo documento
La **metà sul mondo** resta utile come mappa (chi impone, su che base, con che
periodicità) col limite del punto 2. Delle mancanze proposte, **quella
principale è caduta**; le altre due — l'**esportazione regionale** aggregata e
l'**aggregazione delle anomalie del turno** — sono ancora candidati, e sul primo
il righello dice qualcosa: `grep -ciE "produzioneAnno|totaleAnno|aggregaProduzione|produzionePeriodo" apps/campo/campo-data.js` → **0**.
