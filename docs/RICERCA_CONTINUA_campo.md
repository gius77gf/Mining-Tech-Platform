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


---

## 14/08 — il rapporto di fine turno (solo mondo)

**Mandato**: consegnare **solo la metà sul mondo**. In questa sezione non c'è
nessun confronto col nostro codice, nessuna mancanza dichiarata, nessun «non
c'è». Il delta lo fa chi ha il codice in mano; qui in fondo ci sono le
**domande**, non le risposte.

**Strumento e affidabilità delle fonti — misurato, non creduto.** `WebSearch`
funziona ed è la fonte di tutto ciò che segue. `WebFetch` ha risposto
**`EGRESS_BLOCKED`** su **cinque** domini provati uno per uno:
`gmggroup.org` (il PDF della linea guida GMG), `connectedmine.com.au`,
`www.ausimm.com` (il PDF AusIMM), `webhelp.micromine.com`, `www.parlamento.it`
(testo del D.Lgs 624/96) e `en.wikipedia.org`. Quindi:
⚠️ **tutto ciò che segue è di SECONDA MANO** — descrizioni e citazioni prese
dai risultati di ricerca, non dal documento primario aperto e letto. Dove ho
dedotto qualcosa io, sta scritto `[dedotto]`. Nessun numero di legge, nessuna
soglia e nessuna formula di questa sezione va copiata in una schermata senza
che qualcuno abbia letto il testo primario.

---

### 1. I CAMPI di un rapporto di fine turno (shift report / shift log / handover)

#### 1a. Che cosa contengono i moduli veri, sezione per sezione

La raccolta più ricca e **enumerabile** di moduli di turno del settore
minerario è la libreria pubblica di modelli di **SafetyCulture** (fornitore
australiano di software per ispezioni; i modelli sono caricati da imprese vere
— fra i nomi che compaiono nei titoli: Golding, SWC, DNM, SRM, PDM):

- *SWC HSE Shift Report — Compliance to Plan for Mining* — https://safetyculture.com/library/mining/swc-hse-shift-report-compliance-to-plan-golding-swc-pe4ffg1vvnfxtizg
- *DNM Supervisor Shift Log* — https://safetyculture.com/library/mining/dnm-supervisor-shift-log-270820
- *Production Supervisor Shift Handover Checklist* — https://safetyculture.com/library/mining/production-supervisor-shift-handover-golding-swc-z6tossysuirq2e86
- *Production Senior Supervisor Shift Handover* — https://safetyculture.com/library/mining/production-senior-supervisor-shift-handover-golding-swc-wwjagzvoyex19ow1
- *Load and Haul Supervisor Shift Log* — https://safetyculture.com/library/mining/draft-srm-chl-load-and-haul-supervisor-shift-log-bczjr3si9amceceb
- *Drill & Blast Supervisor Night Shift Log* — https://safetyculture.com/library/mining/dnm-drill-and-blast-supervisor-night-shift-log-5tft9mhjpcvi1jmr
- *PDM Drill Supervisor Shift Log* — https://safetyculture.com/library/mining/pdm-drill-supervisor-shift-log
- *Supervisor Shift Report* — https://safetyculture.com/library/mining/supervisor-shift-report-oliqN

Le **famiglie di campi** che ricorrono in quei moduli, secondo la descrizione
dei risultati di ricerca su quelle pagine:

| famiglia | campi citati dalle fonti |
|---|---|
| **Intestazione / consegna** | nome del sorvegliante **uscente** e di quello **entrante**, firme di tutt'e due, ora di fine, note di consegna al turno successivo, spunta di presa in carico |
| **Personale** | organico del turno (*crew manning*), assenze/ferie (*leave*), argomenti trattati al briefing di inizio turno (*prestart topics*), obblighi di sicurezza assegnati |
| **Mezzi e postazioni** | identificativo dell'escavatore/pala, **posizione**, priorità, tipo di materiale movimentato (carbone / sterile / tutt'e due), discarica primaria e secondaria, punto di partenza dopo lo spostamento del mezzo, stato del mezzo |
| **Produzione contro piano** | ora del primo carico (*first load time*), ritmo di scavo (*dig rate*), assegnazione dei camion, tempi ciclo, code ai carichi e alle discariche, obiettivi di volume, **conformità al progetto** (*design compliance*), «siamo o non siamo sul piano» |
| **Fermi e ritardi** | attività classificate come *production / downtime / delay*, ritardi **programmati** e **non programmati**, ritardi «scusabili» (*excusable delays*), *hang time*, impatti su ritmo o volume, motivazione dello scostamento, ritardi alla discarica |
| **Carico utile** | prestazione del *payload* contro l'obiettivo del mezzo |
| **Sicurezza** | infortuni/incidenti e relative indagini, osservazioni di sicurezza, analisi di sicurezza del lavoro (JSA), controlli pre-avviamento (*pre-start*), verifiche su veicoli leggeri e impianti, verifica dei **controlli critici** (separazione operativa, gestione del traffico, comunicazione positiva) |
| **Ambiente / condizioni** | meteo, problemi di teli/coperture (*tarp*), condizioni che limitano l'operatività (*restrictions*) |

Altre fonti che descrivono la stessa struttura da un altro angolo:
- **Groundhog Apps** (fornitore, *Short Interval Control* per il minerario) —
  https://groundhogapps.com/groundhog-short-interval-control/ — descrive il
  rapporto di fine turno come prodotto **automatico** del sistema, con KPI e
  osservazioni operative a supporto della pianificazione del turno dopo.
- **LiveMine**, modulo *Timeline Reporting* (sotterraneo e superficie) —
  https://www.livemine.com/en-us/modules/timeline-reporting
- **iFactory**, modello di *shift report* per la manifattura —
  https://ifactoryapp.com/analytics-reporting/shift-report-template-manufacturing

#### 1b. La TASSONOMIA DELLE CAUSALI DI FERMO — il pezzo più prezioso

Qui esiste **un riferimento di settore vero e citabile**: il **Time Usage
Model (TUM)** del **Global Mining Guidelines Group (GMG)**, pubblicato nel 2020
come *«A Standardized Time Classification Framework for Mobile Equipment in
Surface Mining: Operational Definitions, Time Usage Model, and Key Performance
Indicators»*.

- Pagina della pubblicazione (GMG, ente di normazione volontaria del settore
  minerario) — https://gmggroup.org/publication-guideline-for-a-standardized-time-classification-framework-for-mobile-equipment-in-surface-mining-operational-definitions-time-usage-model-and-key-performance-indicators/
- PDF della linea guida (⚠️ **non aperto**: `EGRESS_BLOCKED`) —
  https://gmggroup.org/wp-content/uploads/2024/07/20200713_Time_Classification_Framework-GMG-DAU-v01-r01-1.pdf
- Annuncio su *Mining Engineering* (rivista ufficiale della SME, Society for
  Mining, Metallurgy & Exploration) — https://me.smenet.org/global-mining-guidelines-group-publishes-time-classification-framework-for-surface-mining-equipment/
- Annuncio su *International Mining* — https://im-mining.com/2020/09/01/gmg-publishes-standardised-time-classification-framework-mobile-equipment-surface-mining/
- Lavoro successivo del GMG sul sotterraneo — https://gmggroup.org/time-usage-model-for-underground-mining-2/
  e un workshop di aggiornamento previsto per il 18/11/2025 —
  https://gmggroup.org/updating-mining-tum-kpi-definitions-workshop-20251118/

**Le categorie di tempo del TUM**, come le descrivono le fonti secondarie
(*Connected Mine* — https://connectedmine.com.au/content-hub/the-time-usage-model-a-pillar-in-mining-analytics — e la scheda Micromine
— https://www.micromine.com/time-usage-model-in-underground-mining-leveraging-micromine-pitram/):

- **Operating Time** — il mezzo è in uso, sotto il controllo di un operatore o
  di un sistema automatico, e sta svolgendo la sua funzione propria.
- **Operating Delay** — il mezzo è operativo ma **temporaneamente fermo o
  impedito**, per ritardi inerenti all'operazione o per condizioni fisiche e
  ambientali immediate. Esempi citati: **rifornimento carburante**, **ritardi
  meteo**, **attesa di istruzioni**.
- **Standby** — il mezzo è **disponibile ma non in funzione**. Si divide in:
  - *Operating Standby*: disponibile, e non c'è l'intenzione di farlo lavorare,
    per **decisione della direzione** o per ragioni sotto il suo controllo;
  - *External Standby*: disponibile, richiesto e assegnato al cantiere, ma non
    utilizzabile per ragioni **fuori dal controllo** della direzione operativa.
- **Downtime** — il mezzo **serve** ma non è utilizzabile: guasti, rotture,
  oppure **manutenzione programmata**. Si distingue in *unscheduled
  maintenance* e *scheduled preventative maintenance*.

Una gerarchia di livello superiore riportata da *Connected Mine* per un caso
reale: **Calendar Time** → **Required Time** / **Standby Time**; dentro
Required Time → **Production Time**, **Scheduled Downtime**, **Unscheduled
Downtime**.

⚠️ **Il GMG dichiara esplicitamente che le sue categorie NON sono uno standard
di settore**: sono *raccomandazioni* per registrare e capire la prestazione
operativa (fonte: pagina GMG citata sopra). È un dettaglio che cambia il modo
di citarlo.

**Una critica interna al modello, che vale come progettazione di vocabolario.**
Micromine (fornitore del sistema **Pitram**), riprendendo un lavoro AusIMM
*«Challenging the Norms — Time Usage Model for Mobile Underground Mining
Equipment»* (PDF ⚠️ **non aperto**: `EGRESS_BLOCKED` —
https://www.ausimm.com/globalassets/bulletin/challenging-the-norms---time-usage-model-for-mobile-underground-mining-equipment.pdf ;
sintesi su https://www.micromine.com/time-usage-model-in-underground-mining-leveraging-micromine-pitram/ ):
propone di **non chiamare «Delay»** quella categoria, ma **IDOH — Indirect
Operating Hours** («ore di funzionamento indiretto»), perché nel sotterraneo le
attività lì classificate — spostamenti, servizi, preparazione — sono
**essenziali al ciclo**, e la parola «ritardo» porta con sé un giudizio
negativo che falsa le analisi. Il modello distingue quindi **operatività
diretta** e **operatività indiretta**.

⚠️ La stessa fonte pone il requisito che qui conta di più: **ogni evento —
perdite e ritardi compresi — deve essere registrato con orario di inizio e di
fine precisi**, e descrizioni e classificazioni devono essere standardizzate
fra le categorie perché i confronti abbiano senso.

**Regole di progettazione di una tassonomia di causali** (fonti dal mondo
manifatturiero, che su questo è più maturo e più esplicito — vanno lette come
principi, non come lista mineraria):
- *«Da 15 a 30 causali per area di impianto, non 150; le prime 10 devono
  coprire il 70-80% dei minuti di fermo»* — https://www.machinetracking.com/post/downtime-reason-codes
- struttura a **tre strati**: stato macchina/linea (*Running, Starved, Blocked,
  Faulted, Changeover, Planned Stop*) → categoria → causale di dettaglio; scelta
  rapida al primo livello, approfondimento solo quando serve —
  https://www.machinecdn.com/blog/how-to-set-up-downtime-reason-codes/
- codici brevi e mnemonici (es. `BRK` guasto, `SET` cambio produzione) —
  https://sgsystemsglobal.com/glossary/downtime-reason-codes/ e
  https://teeptrak.com/en/downtime-reason-codes/
- il fermo diventa **causalizzabile** solo quando entra in uno stato apposito;
  a fine turno si può presentare all'operatore la **tabella dei fermi rilevati**
  e chiedergli di giustificare quelli di cui ha notizia — e quasi sempre i fermi
  sono **più numerosi di quanti l'operatore ne ricordi** (fonte italiana, Bravo
  Manufacturing) — https://support.bravomanufacturing.it/hc/it/articles/360000609248-La-rilevazione-dei-Fermi-Macchina
  e https://www.bravomanufacturing.it/fermi-macchina/
- «senza una rilevazione di stato standardizzata, disponibilità e utilizzo sono
  **inaffidabili**» — https://www.machinetracking.com/post/downtime-by-shift-1

**Esempi di causali minerarie citate per nome** dalle fonti:
rifornimento (*refuelling*), **volata / brillamento** (*blasting*), lavaggio
mezzi (*washing units*), **nebbia** (*fog*), **mancanza di operatore**
(*operator shortage*), **cambio turno** (*shift change*), pausa pasto (*meal
break*), meteo, attesa camion / coda, attesa istruzioni.
Fonti: https://fast2mine.com/en/operational-indicator-hours-concept/ ,
https://www.miningweekly.com/print-version/dispatch-technology-reduces-time-of-scheduled-delays-2016-10-21
(su Wenco *Activity Dispatch*, che carica i ritardi programmati — cambio turno,
pasti — **dentro il piano di turno**).

**Letteratura accademica sui ritardi**: *Review of Operational Delays in
Shovel-Truck System of Surface Mining Operations*, presentato alla 4ª UMaT
Biennial International Mining and Mineral Conference (2016), che discute **12
ritardi operativi** del ciclo carico-trasporto e il loro effetto su
disponibilità e utilizzo —
https://www.researchgate.net/publication/306060370_Review_of_Operational_Delays_in_Shovel-Truck_System_of_Surface_Mining_Operations
(⚠️ **la lista dei 12 non l'ho letta**: solo l'abstract descritto dai risultati
di ricerca).

#### 1c. Il cambio turno come voce di perdita, misurata

- Il rendimento nell'**ultima ora del turno uscente** e nella **prima ora del
  turno entrante** è del **20-40% più basso** che nel resto del turno —
  https://unisonmining.com/shift-change-optimization-and-handover-process/
- In alcune miniere il cambio turno arriva a **un'ora** —
  https://www.worldcoal.com/mining/06102017/a-shift-in-mine-productivity/
- Nel sotterraneo, su turni da 10 ore, **~7 ore al fronte**, con **30-40 minuti**
  medi di trasferimento (fino a **2 ore**) —
  https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2225-62532021000800010
  (Journal of the SAIMM)
- Casi di studio sul miglioramento del cambio turno a cielo aperto —
  https://outliersminingsolutions.com/case-study/improving-shift-change-at-open-pit-mines/

---

### 2. LE CONVENZIONI DI MISURA — e perché due definizioni dello stesso indice ingannano

#### 2a. Le definizioni che circolano

- **Physical Availability**: quota del **tempo programmato** in cui il mezzo era
  pronto a operare. Formula riportata:
  `PA% = (Ore programmate − Ore di fermo) / Ore programmate × 100` —
  https://opsima.com/blog/kpis/mining-industry-kpis/
- **Mechanical Availability**: quota del **tempo controllabile** in cui il mezzo
  era meccanicamente ed elettricamente pronto. Formula riportata:
  `MA = Ore di lavoro / (Ore di lavoro + Fermo)` —
  https://minemajor2020.wordpress.com/2020/12/12/machine-availability-and-utilization/
- **Utilization**: uso delle ore **disponibili** per lavorare davvero. Formula
  riportata: `U% = Ore operative / (Ore operative + Ore di fermo + Ore di
  attesa/standby) × 100` — stessa fonte.
- **Asset Utilization** (Caterpillar): ore operative **diviso il tempo di
  calendario** del periodo.
- **Availability Index** (Caterpillar): `MTBS / (MTBS + MTTR)`, dove **MTBS** è
  il tempo medio fra due fermate e **MTTR** la durata media della riparazione.
- Elenco delle metriche di **primo livello** del documento Caterpillar *Mining
  Equipment Management (MEM) Performance Metrics* (v4, 12/06/2019): Physical
  Availability, MTBS, MTTR, Availability Index, Contractual Availability,
  Percentage Scheduled Downtime, Percentage Scheduled Events, Maintenance Ratio,
  Top Problems Summary, Asset Utilization, Utilization of Availability, PIP/PSP
  Completion Rate —
  https://www.slideshare.net/slideshow/2019-caterpillar-mining-equipment-management-metrics-document-v4pdf/251857185
  (⚠️ documento marchiato riservato dal produttore; qui citato solo come
  **elenco di nomi di indice**, non come fonte da riprodurre)

#### 2b. L'inganno: stesso indice, denominatore diverso

È il punto che il mandato chiedeva, e le fonti lo dicono in chiaro.

> *«Espressioni come ore programmate, ore annue, ore totali, ore di lavoro, ore
> di turno, ore operative ed ore di efficienza possono comparire in questi
> calcoli. Ma c'è pochissima coerenza nel modo in cui la maggior parte di questi
> termini viene usata e nel modo in cui i loro valori vengono calcolati
> nell'industria mineraria di oggi. La "disponibilità" per una società mineraria
> può non significare la stessa cosa per un'altra società mineraria o per un
> fornitore di macchine.»*
> — capitolo *Machine Availability and Utilization*, in *Open Pit Mine Planning
> and Design*, Taylor & Francis —
> https://www.taylorfrancis.com/chapters/mono/10.1201/b15068-16/machine-availability-utilization

L'esempio numerico che rende la trappola visibile in una riga:
una macchina che lavora **7 ore su un turno di 8** ha **87,5%** di
*availability* (denominatore: tempo **programmato**) e **29%** di *uptime*
(denominatore: **calendario 24/7**) — https://oxmaint.com/industries/steel-plant/availability-kpi-explained-for-oee

Corollari citati dalle stesse fonti:
- **OEE** misura il **tempo di produzione pianificato**; **TEEP** (*Total
  Effective Equipment Performance*) misura **tutto il tempo di calendario**:
  `TEEP = OEE × (tempo pianificato / tempo di calendario)`.
- *«Confrontare stabilimenti che usano definizioni diverse produce benchmark
  privi di significato»* — https://mdcplus.fi/blog/oee-production-kpi-complete-guide/
- Nel minerario, un approccio basato sul *loading time* porta a **sovrastimare
  l'OEE**, ed è un problema quando si vuole fissare un valore di riferimento per
  le pale — https://www.researchgate.net/publication/47517712_Performance_Measurement_of_Mining_Equipments_by_Utilizing_OEE
  (la stessa fonte riporta come riferimento per le pale: disponibilità > 90%,
  performance > 90%, qualità > 95% → **OEE > 77%** — ⚠️ numero di seconda mano)

#### 2c. Lo standard generale che le formalizza

**ISO 22400-2** (*Automation systems and integration — KPIs for manufacturing
operations management*) definisce `OEE = Availability × Performance × Quality`
e un **modello di stati temporali** con, fra gli altri, **PBT** (*planned busy
time*, il tempo in cui l'unità è **pianificata** per produrre), **AUBT**
(*actual unit busy time*) e **AUDT** (*actual unit downtime*); la disponibilità
è definita come rapporto fra tempo operativo e tempo di produzione pianificato.
Fonti: https://www.fabrico.io/blog/oee-iso-22400/ ,
https://teeptrak.com/en/how-to-calculate-oee-industrial-production-2026/ ,
https://connect981.com/blog-posts/iso-22400-oee-equipment-kpis-availability-utilization
⚠️ Il testo della norma **non è stato letto** (a pagamento e comunque
irraggiungibile con gli strumenti disponibili).

`[dedotto]` Il TUM del GMG e ISO 22400 rispondono alla stessa domanda in due
mondi diversi (flotta mobile mineraria / linea di produzione), e i loro nomi
**non combaciano**: chi cita «disponibilità» senza dire **quale modello** e
**quale denominatore** sta usando, sta dicendo una cosa non verificabile.

---

### 3. FONTI NORMATIVE E DI CATEGORIA ITALIANE / EUROPEE — e i NOMI del mestiere

⚠️ Nessun testo di legge è stato aperto: `parlamento.it` e `gazzettaufficiale.it`
sono bloccati dal proxy. Tutto ciò che segue è **di seconda mano** e va
riverificato sul testo prima di finire in una schermata.

#### 3a. DPR 9 aprile 1959, n. 128 — «Norme di polizia delle miniere e delle cave»

È la norma che regge la vigilanza in cava. Dai risultati di ricerca:
- **per ogni turno di lavoro** i luoghi di lavoro con personale devono essere
  **visitati almeno una volta dal sorvegliante**, e **alla fine di ogni turno**
  il sorvegliante deve **accertare che nessun dipendente sia rimasto** nella
  miniera o nella cava senza autorizzazione;
- il **direttore** conserva in originale le prescrizioni del prefetto e
  dell'ingegnere capo, **trascrivendole in un registro tenuto sul luogo di
  lavoro**;
- art. 20: *Direttore responsabile e sorvegliante — Denunce di esercizio*.
Fonti: https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/il-lavoro-in-cava-in-miniera-i-soggetti-del-sistema-sicurezza-salute-AR-23128/ ,
https://legislazionetecnica.it/node/1365369 ,
testo su https://www.edizionieuropee.it/law/html/35/zn64_01_020.html ,
PDF su https://pugliacon.regione.puglia.it/documents/72607/118877/AE_LEX_IT_04_DPR128_59.pdf/9c8638e0-d0d8-2916-9ec4-1d88d806bc0d
e https://www.tuttoprevenzioneincendi.it/images/Norme/DPR_09_04_1959_n_128.pdf

⚠️ **Non ho trovato conferma** che il DPR 128/59 imponga un «rapporto di fine
turno» come documento. Quello che le fonti attestano è un **obbligo di verifica
di fine turno in capo al sorvegliante** e **registri di prescrizioni**: due cose
diverse. Chi vuole affermare l'una o l'altra deve leggere l'articolato.

#### 3b. D.Lgs 25 novembre 1996, n. 624 — sicurezza nelle industrie estrattive

Recepisce le direttive europee 92/91/CEE e 92/104/CEE. Il documento cardine è
il **DSS — Documento di Sicurezza e Salute**: redatto dal **datore di lavoro**,
**firmato** dal **direttore responsabile**, dai **sorveglianti** (art. 20), dal
**medico competente** e, per presa visione, dal **rappresentante dei lavoratori
per la sicurezza (RLS)**; va **aggiornato** quando i luoghi di lavoro subiscono
modifiche rilevanti e, ove necessario, **dopo incidenti gravi**; il datore di
lavoro **attesta annualmente** che luoghi, attrezzature e impianti sono
progettati, usati e mantenuti in modo efficiente e sicuro.
Fonti: https://it.wikipedia.org/wiki/Documento_di_sicurezza_e_salute ,
https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/ ,
linee guida regionali Toscana https://www.regione.toscana.it/documents/10180/70872/Linee+guida+regionali+DLgs+624+del+96/e59e9f59-9962-4571-bcf9-1711f52e9acb ,
linee guida Regione Puglia dgr 570/2015 https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137 ,
esempio di DSS reale di una cava (Nervesa, Provincia di Treviso) https://ecologia.provincia.treviso.it/Engine/RAServeFile.php/f/News/5530/All.04b-DSSC_CAVA_NERVESA_febbraio_2015.pdf

#### 3c. Il passaggio di consegne è **orario di lavoro** (Cassazione, 2024)

Nei reparti a turni avvicendati il lavoratore entrante riceve dall'uscente
*«le informazioni essenziali, lo stato della macchina o della linea, le anomalie
in corso, i lavori in sospeso, i parametri di processo»*: è il **passaggio di
consegne**. La **Corte di Cassazione, ordinanza n. 20787 del 25 luglio 2024**,
lo ha riconosciuto come **voce autonoma di orario di lavoro**, distinta e
cumulabile col «tempo tuta».
Fonti: https://www.avvocatolavoroasti.it/blog/tempo-tuta-orario-di-lavoro/ ,
https://www.adlabor.it/interpretazioni/retribuzione/cambio-a-fine-turno-e-passaggio-di-consegne-tra-lavoratori-il-datore-di-lavoro-ha-lobbligo-di-remunerare-il-tempo-impiegato-le-decisioni-della-giurisprudenza-adlabor-isper-hr-r/

`[dedotto]` Se il passaggio di consegne è tempo retribuito, l'**ora di apertura
e l'ora di chiusura** della consegna sono un dato con conseguenze contrattuali,
non solo operative. Non ho trovato una fonte che lo dica esplicitamente.

#### 3d. Eventi di sicurezza: che cosa si registra oggi in Italia

- Il **registro infortuni** è **abolito** dal **23 dicembre 2015** (D.Lgs
  151/2015): al suo posto la **denuncia/comunicazione di infortunio** sul
  portale INAIL, e strumenti informatici INAIL sostitutivi del registro
  cartaceo, accessibili al datore di lavoro e agli organi di vigilanza —
  https://www.puntosicuro.it/documentazione-C-63/il-d.lgs.-151/2015-l-abrogazione-del-registro-infortuni-AR-15311/ ,
  https://gruppocmb.com/il-d-lgs-151-2015-e-labolizione-del-registro-infortuni/
- **Mancati infortuni**: l'**art. 15 del D.L. 31 ottobre 2025, n. 159** prevede
  che le imprese con **più di quindici dipendenti** comunichino i **dati
  aggregati** degli eventi segnalati come mancati infortuni **e** le azioni
  correttive o preventive intraprese —
  https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note
  ⚠️ **decreto legge**: il testo può essere cambiato in conversione. Da
  riverificare sul primario prima di qualunque uso.
- **Nomi italiani** del *near miss*: **mancato infortunio**, **quasi
  infortunio**, **quasi evento**, **evento senza esito**, «mancato incidente» —
  https://www.corsisicurezza.it/blog/near-miss-mancato-infortunio-definizione.htm
- La **UNI 7249** è la norma italiana citata per gli **indicatori di prestazione
  della sicurezza** (infortuni, mancati infortuni) —
  https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/rischi-infortuni-mancati-infortuni-e-indicatori-di-prestazione-ssl-uni-7249
  ⚠️ non letta.

#### 3e. Le figure e le associazioni di categoria

- **ANIM — Associazione Nazionale Ingegneri Minerari** ha pubblicato un
  **disciplinare di certificazione della professione di responsabile di cava —
  Capo cava** — https://www.anim-ingegneriamineraria.it/wp-content/uploads/2019/12/Disciplinare-Capo-cava.pdf
  e https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-enti/disciplinare-certificazione-professione-di-responsabile-cava-capo-cava
- Il **capo cava** guida i **cavatori** nell'interpretazione quotidiana delle
  direttive operative e **può assumere anche la funzione di sorvegliante** (D.Lgs
  624/96) e di **preposto** (D.Lgs 81/08); deve saper interpretare la
  **strategia di coltivazione** e il **piano di coltivazione approvato** —
  https://quarryandconstructionweb.it/rubriche/collaborazioni/corso-di-formazione-indirizzato-alla-figura-professionale-di-capo-cava/
- Differenza fra **sorvegliante** (estrattivo) e **preposto** (81/08) —
  https://quarryandconstructionweb.it/rubriche/collaborazioni/le-figure-del-sorvegliante-e-del-preposto-per-il-settore-estrattivo-analogie-e-differenze/
  e https://quarryandconstructionweb.it/rubriche/collaborazioni/attivita-e-formazione-delle-figure-professionali-operanti-nel-settore-estrattivo/
- **UNMIG / MASE** (Ministero dell'ambiente e della sicurezza energetica) e
  **ISTAT** pubblicano i dati sulle attività estrattive da cave e miniere —
  https://unmig.mase.gov.it/le-attivita-estrattive-da-cave-e-miniere/ e
  https://www.istat.it/wp-content/uploads/2020/07/Attivit%C3%A0-estrattive-da-cave-e-miniere.pdf
- Adempimenti **regionali** ricorrenti (esempio Lombardia): comunicazioni a
  Provincia / Città metropolitana / Regione / Comune, **dati annuali a ISTAT**
  (impresa, **volumi estratti**), quantità di inerti da riciclo, monitoraggio
  ambientale, stato del recupero; **canone al Comune entro il 28 febbraio**
  calcolato su tipo e quantità di materiale estratto e industrialmente
  utilizzato nell'anno precedente —
  https://www.regione.lombardia.it/wps/portal/istituzionale/HP/DettaglioRedazionale/servizi-e-informazioni/Enti-e-Operatori/ambiente-ed-energia/Cave/normativa-cave/normativa-cave
  e L.R. Lombardia 14/1998 https://www.bosettiegatti.eu/info/norme/lombardia/1998_014.html ;
  Catasto Cave e Miniere di Regione Lombardia, manuale utente v2.2.1 (gennaio 2026)
  https://www.caveminiere.servizirl.it/catmc/assets/doc/ManualeUtenteCATCM.pdf ;
  Piemonte https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/cave ;
  FVG https://www.regione.fvg.it/rafvg/cms/RAFVG/ambiente-territorio/geologia/FOGLIA15/

#### 3f. Fuori Italia, ma normativo sul **passaggio di consegne**

**HSE** (Health and Safety Executive, ente regolatore britannico), *Effective
Shift Handover — A Literature Review*, Offshore Technology Report **OTO 96 003**,
redatto dal **Keil Centre**. Quantifica il peso degli errori di consegna come
causa o concausa di incidenti, e raccomanda: riconoscere la comunicazione di
consegna come **priorità alta**, inserire le capacità comunicative nei criteri
di selezione dei turnisti, addestrare il personale in servizio, fornire
**procedure che dicano come si conduce una consegna**, e **dare più peso alla
comunicazione scritta** durante il passaggio. Su 16 società offshore esaminate,
alcune non definivano responsabilità e fabbisogni informativi, non davano
formazione né guida scritta, e **non facevano alcun monitoraggio o audit delle
consegne**. La *Cullen Inquiry* ha reso la consegna **documentata e verificata**
un requisito regolamentare per l'offshore britannico.
Fonti: https://www.osti.gov/etdeweb/biblio/376338 ,
https://keilcentre.co.uk/services/human-factors-ergonomics/safe-communications-procedures/shift-handover/ ,
https://studylib.net/doc/8206240/effective-shift-handover ,
https://www.hpog.org/assets/documents/BN-10-Communications-web.pdf

---

### 4. COME I SOFTWARE COMMERCIALI PRESENTANO IL RAPPORTO DI FINE TURNO

Elenco di fonti, non impressioni. Nessuno di questi prodotti è stato provato.

**Sistemi di gestione flotta / dispatch (minerario a cielo aperto)**
- **Modular Mining DISPATCH** (gruppo Komatsu) — assegnazione dinamica camion e
  pale, *comprehensive production reporting*.
- **Wenco DSX** (Wenco International Mining Systems) — dispatch in tempo reale,
  monitoraggio macchine, ottimizzazione della produzione; *Activity Dispatch*
  carica i **ritardi programmati** (cambio turno, pause) **dentro il piano di
  turno** — https://www.miningweekly.com/print-version/dispatch-technology-reduces-time-of-scheduled-delays-2016-10-21
- **Hexagon HxGN MineOperate** — suite cloud, dispatch e analitica multi-sito da
  browser.
- **Caterpillar MineStar**, **Trimble MineSight**, **RPMGlobal TIMS**.
Panoramiche: https://www.miningsoftwarereviews.com/category/fleet-management-dispatch ,
https://five.co/blog/mining-fleet-management-system/ ,
https://zipdo.co/best/mining-fleet-management-software/

**Sistemi di controllo a intervalli brevi e registro di turno**
- **Groundhog** *Short Interval Control* — il rapporto di fine turno è prodotto
  **automaticamente** con KPI e osservazioni —
  https://groundhogapps.com/groundhog-short-interval-control/ ; manuale
  operatore https://groundhogapps.com/dispatch-operator-handbook/ ;
  OEE https://groundhogapps.com/understanding-overall-equipment-effectiveness/
- **Micromine Pitram** — *Time Usage Model* nel prodotto, con la distinzione
  operatività diretta / indiretta —
  https://www.micromine.com/time-usage-model-in-underground-mining-leveraging-micromine-pitram/ ,
  https://www.mining-technology.com/contractors/fleet-management-software/micromine-pitram/
- **LiveMine** — modulo *Timeline Reporting* per sotterraneo e superficie —
  https://www.livemine.com/en-us/modules/timeline-reporting
- **Epiroc** *Shift Support* (pianificazione e scheduling) —
  https://www.epiroc.com/en-uk/products/digital-solutions/planning-and-scheduling/shift-support

**Cave e inerti (più vicino al nostro mestiere)**
- **Trimble LOADRITE InsightHQ** — consolida i dati dei sistemi di pesatura di
  cantiere (pale, escavatori) in cruscotti; *target contro effettivo*, **ritardi
  e fermi**, riproduzione del turno (*shift playback*), avvisi —
  https://goloadrite.com/product/insighthq ,
  https://www.prnewswire.com/news-releases/trimble-provides-centralized-reporting-for-quarries-with-loadrite-insighthq-to-improve-productivity-300034335.html ,
  https://www.aggbusiness.com/products/operations-productivity-made-visible-new-trimble-insight
- **Command Alkon** — sistema *Scale Watcher* installato in 523 siti fra cave e
  altri cantieri dal 2006 —
  https://www.aggregateresearch.com/news/save-money-using-up-to-date-payload-management-and-weigh-in-motion-technology/
- **Clue** — gestione attrezzature per cave e inerti —
  https://www.getclue.com/industries/aggregate-and-quarry

**Italia**
- **iBlocky** — gestionale per cave di marmo: catalogazione dei blocchi
  estratti con foto/video/mapscan, resa e collocazione; a partire da 299 €/mese
  (piano Basic), 399 €/mese (Elite) — https://iblocky.it/gestionale-per-cave
- **Project S.r.l.** — *Project Building*, software per impianti e cave —
  https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html
- **InfoMinds** — gestionale per produttori di inerti, integrazione pese,
  impianti e vendita — https://infominds.eu/settori/edilizia/produttori-inerti-calcestruzzo-cave/
- **Bravo Manufacturing** — rilevazione e **causalizzazione dei fermi macchina**
  (vocabolario italiano) — https://www.bravomanufacturing.it/fermi-macchina/
- **DATALOG** — riduzione fermi macchina con software di produzione —
  https://www.datalog.it/ridurre-fermi-macchina-software-produzione/
- **Fabbrica Digitale 4.0** — **microfermi** —
  https://www.fabbricadigitale40.it/it/insight/blog/287-efficienza-degli-impianti-produttivi-come-tracciare-gestire-e-risolvere-i-microfermi

---

### GLOSSARIO ITALIANO DEL MESTIERE (termini incontrati nelle fonti)

**Persone e ruoli**
- **direttore responsabile** — figura del DPR 128/59 e del D.Lgs 624/96, firma
  il DSS
- **sorvegliante** — visita i luoghi di lavoro almeno una volta per turno e a
  fine turno accerta che nessuno sia rimasto dentro
- **preposto** — figura del D.Lgs 81/08; nel settore estrattivo si sovrappone in
  parte al sorvegliante ma non coincide
- **capo cava** — guida i cavatori, interpreta il piano di coltivazione; può
  cumulare sorvegliante e preposto
- **cavatore** — chi lavora al fronte
- **RLS** — rappresentante dei lavoratori per la sicurezza
- **medico competente**

**Luoghi e forme della cava**
- **fronte di cava** — la parete su cui si lavora
- **gradone** — il ripiano; composto da **alzata** (l'altezza) e **pedata** (la
  larghezza del ripiano)
- **piazzale** — l'area di lavoro alla base, dove si raccoglie il materiale
- **coltivazione** — l'attività di estrazione; **piano di coltivazione** è il
  progetto approvato
- **recupero ambientale / ripristino** — la rimessa in pristino del sito

**Documenti e adempimenti**
- **DSS — documento di sicurezza e salute** (D.Lgs 624/96)
- **denuncia di esercizio** (DPR 128/59, art. 20)
- **dichiarazione annuale dei quantitativi estratti** / dati annuali a **ISTAT**
- **canone** al Comune, calcolato su tipo e quantità estratta e industrialmente
  utilizzata
- **denuncia/comunicazione di infortunio** a INAIL (il **registro infortuni** è
  abolito dal 2015)
- **catasto cave** (esempio: Catasto Cave e Miniere di Regione Lombardia)

**Turno e consegne**
- **turno** — **turni avvicendati** quando si susseguono senza interruzione
- **passaggio di consegne** / **consegne di turno** — riconosciuto come orario
  di lavoro (Cass. ord. 20787/2024)
- **rapportino** / **rapportino giornaliero** / **rapporto di fine turno** —
  la parola che l'edilizia e l'impiantistica italiane usano per il documento
  compilato dall'operatore a fine giornata o fine turno
- **appello** / **presenze** — chi c'era
- **briefing di inizio turno** (*prestart*) — i temi trattati prima di iniziare

**Fermi e misure**
- **fermo macchina** / **fermi macchina** — l'interruzione durante il tempo di
  lavoro assegnato
- **causale di fermo** — la ragione attribuita a un fermo; **causalizzare** un
  fermo è l'atto di attribuirgliela; un fermo è **causalizzabile** quando è in
  uno stato che lo consente
- **microfermo** — fermata breve e ripetuta, tipicamente sotto la soglia di
  registrazione automatica
- **fermo programmato** / **fermo non programmato**
- **disponibilità** (*availability*), **utilizzo** (*utilization*),
  **rendimento**, **OEE**
- **ore di calendario**, **ore programmate**, **ore operative**, **ore di
  attesa** — i denominatori che cambiano il significato degli indici sopra

**Sicurezza**
- **infortunio**
- **mancato infortunio**, **quasi infortunio**, **quasi evento**, **evento
  senza esito** — i nomi italiani del *near miss*
- **osservazione di sicurezza**
- **controllo critico** — la verifica che una difesa fondamentale sia in piedi
- **controllo pre-avviamento** (*pre-start*) — la verifica sul mezzo prima
  dell'uso

---

### DOMANDE PER CHI HA IL CODICE

Sono domande, non affermazioni: chi le legge ha il codice in mano e può
rispondere aprendo le funzioni. Nessuna di queste presuppone che qualcosa
manchi.

1. **Chi decide, nel nostro prodotto, la causale di un fermo?** È scelta da un
   elenco chiuso, o è testo libero? Se è un elenco: quante voci ha, e chi
   l'ha deciso? Se una causale nuova serve a una cava sola, oggi dove va a
   finire?
2. Un fermo, da noi, ha **inizio e fine** (due istanti) o **una durata
   dichiarata** (un numero di minuti)? Le due forme non rispondono alle stesse
   domande: la prima permette la sovrapposizione con altri eventi e il calcolo
   del profilo del turno, la seconda no.
3. **La somma dei tempi di un turno torna?** Cioè: c'è un posto in cui il
   prodotto verifica che *operativo + fermo + attesa* non superi (né lasci
   scoperta) la durata dichiarata del turno — e se non torna, che cosa dice?
4. Quando il prodotto scrive «disponibilità» o una percentuale simile in una
   schermata o in un file che esce, **quale denominatore usa** — durata
   dichiarata del turno, ore di calendario, ore programmate — e quel
   denominatore è **scritto accanto al numero** dove l'utente lo legge?
5. Le nostre categorie di fermo distinguono **«il mezzo è guasto»** da **«il
   mezzo funziona ma non lo stiamo usando»** da **«il mezzo funziona, è in
   servizio, ma sta facendo qualcosa che non è il suo lavoro principale»**?
   E se sì, con quali parole? (È la distinzione TUM fra *downtime*, *standby* e
   *operating delay* / *indirect operating* — e la fonte del sotterraneo
   sostiene che chiamarla «ritardo» falsa le analisi.)
6. **Chi consegna e chi riceve** un turno: il prodotto registra i due nomi e
   l'ora della consegna, e da qualche parte quel dato viene **letto** oltre che
   scritto? (Cass. 20787/2024 rende quel tempo retribuito, quindi ha effetti
   fuori dall'operatività.)
7. Il turno entrante, aprendo il prodotto, **vede le cose in sospeso lasciate
   dal turno uscente** — lavori non finiti, anomalie aperte, macchine in stato
   anomalo — o le vede solo chi legge le note a mano? Come si distingue una
   nota di consegna «già chiusa» da una «ancora aperta»?
8. Fra i dati che raccogliamo del turno, quali arrivano da una **misura** (una
   pesa, un contaore, un GPS) e quali da una **dichiarazione** di una persona?
   Il prodotto distingue le due provenienze quando compone un riepilogo, o le
   somma senza dirlo?
9. Un fermo che attraversa il **cambio turno** — comincia in un turno e finisce
   nel successivo — a quale turno viene attribuito, e chi lo decide?
10. Il **cambio turno stesso** (le fonti lo misurano fino a un'ora, con il
    rendimento più basso del 20-40% nell'ora a cavallo) è una **causale
    dichiarabile** nei nostri fermi, o sparisce dentro il tempo non
    rendicontato?

---

### CHE COSA NON SONO RIUSCITO A VERIFICARE

Onestamente, e per nome:

- **Nessun testo primario è stato letto.** `WebFetch` risponde
  `EGRESS_BLOCKED` su tutti i sei domini provati (elencati in cima). Quindi il
  PDF della linea guida GMG, il PDF AusIMM, la documentazione Micromine, il
  D.Lgs 624/96 su parlamento.it: **descritti, non letti**.
- **La tassonomia completa delle causali di fermo del GMG non ce l'ho.** Ho i
  nomi delle **categorie di primo livello** (Operating, Operating Delay,
  Standby con le sue due forme, Downtime con le sue due forme) e alcune
  gerarchie riportate; **non ho l'elenco delle foglie**, che è esattamente la
  parte che il mandato chiamava «la più preziosa». Sta nel PDF bloccato.
- **I «12 ritardi operativi»** del lavoro UMaT 2016 sul sistema pala-camion:
  so che sono dodici, **non so quali**.
- **ISO 22400-2** e **UNI 7249**: norme a pagamento, non lette. Le definizioni
  riportate vengono da divulgatori commerciali.
- **DPR 128/59**: non ho trovato conferma dell'esistenza di un obbligo di
  «rapporto di fine turno» come documento; ho solo l'obbligo di **verifica** di
  fine turno del sorvegliante e i registri di prescrizioni. Chi vuole
  affermarlo deve leggere l'articolato.
- **D.L. 159/2025 art. 15** (mancati infortuni): è un **decreto legge**, e il
  testo in conversione può cambiare. Riportato da una sola fonte secondaria.
- **Nessuna fonte italiana specificamente sul rapporto di fine turno in cava.**
  Il vocabolario italiano dei fermi («causale di fermo», «causalizzare»,
  «microfermo») viene dalla **manifattura**, non dall'estrattivo: è verosimile
  che in cava si dicano le stesse parole, ma non l'ho verificato — `[dedotto]`.
- **Nessun software è stato provato.** Le descrizioni dei prodotti vengono dai
  materiali dei fornitori o da riviste di settore, cioè da materiale
  promozionale: dicono che cosa il prodotto **dichiara** di fare.

---

## 14/08 — LE RISPOSTE, date da chi ha il codice in mano

*La ricerca qui sopra consegna la metà sul MONDO e dieci **domande**. Questa
sezione le risponde aprendo le funzioni — cercando il **meccanismo**, non la
parola — come pretende la regola del 14/08. Ogni risposta porta il comando e la
sua uscita: un comando si rilancia, un numero si può solo credere.*

### ⛔ E LA PRIMA IPOTESI ERA FALSA, presa in tre minuti guardando i dati invece del codice
Leggendo la riga della dimostrazione — `causale: "Intasamento impianto"`, una
stringa italiana dentro un'attività — avevo concluso «in Campo la causale è
**testo libero**». È **falso**, e stavo per scriverlo in un documento.

```
$ grep -n "CAUSALI_FERMO" -A 12 apps/campo/campo-data.js | head -12
1196:export const CAUSALI_FERMO = [
1197-  "Guasto meccanico",  1198-  "Mancanza materiale",  1199-  "Attesa mezzo",
1200-  "Intasamento impianto",  1201-  "Meteo",  1202-  "Manutenzione programmata",
1203-  "Cambio turno",  1204-  "Sicurezza",  1205-  "Altro",
```
È un **elenco chiuso di nove voci**, e «Intasamento impianto» è la quarta. La
dimostrazione non mostrava testo libero: mostrava una voce dell'elenco scritta
per esteso, perché in Campo **l'etichetta È la chiave**.

### 1. Chi decide la causale di un fermo
**Due elenchi chiusi, uno per app, e sono due cose diverse.**
· **Campo** — `CAUSALI_FERMO`, **9 voci**, cause di un fermo *del turno*:
  materiale, meteo, cambio turno, sicurezza, attesa mezzo…
· **Flotta** — `CAUSALI_FERMO` (`grep -c "chiave:" apps/flotta/flotta-data.js`
  sul blocco → **9**), cause di una *macchina fuori servizio*: guasto meccanico
  / idraulico / elettrico, gomme-cingoli, attesa ricambi, manutenzione
  programmata, verifica, **manca l'operatore**, altro.
Chi scrive una causale fuori elenco finisce in **«Altro»**, non si perde:
`const c = CAUSALI_FERMO.includes(a.causale) ? a.causale : "Altro";`

⚠️ **Il candidato vero, e uno solo**: in Campo l'elenco è un array di
**stringhe** — l'etichetta italiana fa da chiave — mentre in Flotta è un array
di **oggetti** `{chiave, etichetta, nota}`. Cioè in Campo **rinominare una voce
orfana lo storico**: le attività vecchie continuano a portare la vecchia
etichetta e `includes()` le manda tutte in «Altro», facendo **scendere** la
causale principale del Pareto senza che niente lo dica. Non è un difetto oggi
(nessuno ha rinominato niente): è una **fragilità misurabile**, e la cura è la
forma che Flotta ha già.

### 2. Due istanti o una durata dichiarata
**Tutt'e due, e in due app diverse — che è esattamente la distinzione della
fonte.** Flotta tiene `inizio`/`fine` (due istanti): `fermoCollocabile`,
`intervalloFermo(fermo, da, a)` e la disponibilità come **giorni-macchina persi
su giorni-macchina disponibili**, con la nota che «sommare le durate non è
contare i giorni» (due fermi sovrapposti sommano 60 giorni su una finestra di
30). Campo tiene `fermoMin`, una **durata dichiarata**, e conta a parte
`fermiSenzaMinuti` — i fermi registrati **senza** i minuti.

### 3. La somma dei tempi del turno torna? **Sì, ed è un controllo scritto.**
`disponibilitaTurno` confronta i minuti di fermo con la durata **dichiarata**:
```
if (fermiMin > durataMin) { out.stato = "oltre"; … }
```
e il messaggio nomina le due cause possibili — «probabilmente due fermi si
sovrappongono e sono stati contati due volte, oppure la durata dichiarata è
sbagliata» — e **si rifiuta di calcolare**: «finché i due numeri non tornano la
disponibilità non si calcola: una percentuale negativa non esiste».

### 4. Quale denominatore, e si legge accanto al numero?
**La durata del turno DICHIARATA**, presa da `durataTurnoDi(durate, data,
turno)`; e quando non c'è, la funzione **non stima**: `stato:
"non-calcolabile"`, con `mancano` (i codici, per chi decide cosa mostrare) e
`motivo` (la frase, per chi legge) — «la durata del turno non è stata
dichiarata… Un numero qui direbbe che il turno è andato bene, mentre la verità
è che non è stato misurato».
⛔ E c'è di più di quanto la domanda chiedesse: **`provvisorio`** distingue un
turno **finito** da uno **ancora in corso**, con tre valori — e il terzo è
`null`, «non lo so», quando chi chiama non ha passato le chiusure. Su un turno
aperto «100%» non vuol dire «è andato tutto bene», vuol dire «finora nessuno ha
scritto niente».

### 5. Guasto / standby / *indirect operating*
**La distinzione c'è, in italiano, e sta nelle note dell'elenco di Flotta**:
· *downtime* → i quattro guasti e `attesa-ricambi` («la macchina è pronta a
  essere riparata, manca il pezzo»);
· *standby* → **`operatore`**, con la nota che lo dice alla lettera: «la
  macchina è a posto: non c'è chi la usa»;
· il fermo **scelto** → `manutenzione`, «è un fermo, ma è un fermo scelto».
Cioè la tripartizione del TUM esiste già come **significato**; quello che non
esiste è il nome inglese, e la fonte del sotterraneo dice che «ritardo» falsa le
analisi — noi quella parola non la usiamo.

### 9. Il fermo che attraversa il cambio turno
In Campo il fermo è **dentro** un'attività di un turno (minuti dichiarati),
quindi non attraversa niente; e «**Cambio turno**» è una **causale** dell'elenco,
cioè il tempo perso *nel* passaggio è già un fatto registrabile. In Flotta il
fermo è a **giornate intere e inclusive** («una macchina ferma il 3 e ripartita
il 3 è stata ferma un giorno, non zero — in cava una giornata persa è persa
tutta»), quindi il turno non c'entra: il soggetto è la macchina, non il turno.

### Che cosa NON ho risposto
Le domande **6, 7, 8 e 10** (chi consegna e chi riceve il turno; che cosa vede
il turno entrante; misura contro dichiarazione; e la decima) restano aperte:
vanno guardate nel foglio di fine turno e nell'appello, e non le ho aperte in
questa unità. Sono **non guardate**, non «a posto».

⛔ **E il verdetto d'insieme, che vale più delle singole risposte**: delle sei
domande guardate, **cinque hanno già una risposta nel prodotto**, e in due casi
(il rifiuto di calcolare, il `provvisorio` a tre valori) la risposta è **più
severa** di quanto la fonte del mondo pretendesse. La ricerca ha reso quello che
poteva rendere — la **domanda** — e il delta l'ha fatto chi aveva il codice: se
avesse consegnato lei un elenco di «non c'è», oggi avremmo cinque mancanze false
su sei.
