# Ricerca continua — Campo (candidati di miglioramento)

Documento di ricerca approssimativa: candidati da approfondire, non diagnosi finali.

---

## Che cosa esiste già

Campo ha già tutte e venti le proposte della ricerca del 27/07, costruite da 28/07 a 29/07:

1. Data e turno su ogni registrazione (C1)
2. Piano di carico salvato (F2)
3. Produzione in numeri + unità (F3)
4. Assegnazione attività a squadra/operatore (C1)
5. Obiettivo di turno e scostamento (C2)
6. Storico settimana, checklist inizio turno, presenze, firma di chiusura (C3)
7. Turno chiuso non modificabile (C4)
8. Foto sull'anomalia (C5)
9. Meteo e condizioni del sito (C6)
10. Disponibilità di turno
11. Causali di fermo standardizzate (9 voci)
12. Pareto dei fermi con minuti
13. Appello del turno (tre stati: presente, assente, da spuntare)
14. Filtri attività, esportazione CSV, rapporto stampabile
15. Ponte P2 Campo → Terra (produzione per fronte)

---

## Candidati di miglioramento

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|-----------|-----------------|--------------|--------------|----------------|
| Attività — anomalia | Fermo senza causale: il Pareto e la disponibilità aggiungono "Altro", ma l'anomalia originale resta vuota in interfaccia | Toccare un'attività, metterla in anomalia e scrivere solo i minuti (senza scegliere la causale dal menu): la riga mostra il fermo grigio senza testo accanto | Piccolo | Creare un'attività, toccarla, portarla in anomalia, compilare solo `fermoMin` senza toccare il campo causale: il Pareto deve mostrare la voce come "Altro" e il fermo deve avere etichetta vuota visibile |
| Squadre | Squadra con numero zero o vuoto: il carico resta invisibile, l'app funziona comunque | Nel quadro della giornata leggere "Squadre attive": il numero dipende dalle squadre operativa, non dal numero di persone — ma una riga con persone vuote non lo dichiara | Piccolo | Creare una squadra senza compilare il campo persone, metterla operativa, aprire il quadro: deve apparire etichetta o nota che dica "squadra senza anagrafica" o simile |
| Attività — disponibilità | Disponibilità al 100% quando nessun fermo è stato registrato: il numero è tranquillo ma la misura non c'è, confonde con "zero fermi veri" | Nel rapporto di fine turno il cartellone mostra "Disponibilità 100%" senza dichiarare se è misurato o assunto | Piccolo | Creare un turno senza registrare nessun fermo, aprire l'attività e cercare il Pareto: la riga sotto deve dichiarare "nessun fermo registrato" oppure il colore del numero deve essere grigio/neutro, non il colore di successo |
| Attività — forma | Campi data e turno della nuova attività non marcati obbligatori: sono necessari per lo storico, ma l'interfaccia non lo dichiara (niente asterisco, niente colore diverso) | Nel form "Nuova attività" i due campi hanno label e tipo ma si confondono coi facoltativi al di sopra | Piccolo | Compilare titolo e squadra, saltare data/turno, toccare "Pianifica": o la creazione fallisce con messaggio, o l'attività appare nel giorno ma con etichetta "senza data" evidente |
| Piano di carico | File importato vuoto (solo intestazione, zero righe di dati): l'app lo salva, il grafico restituisce niente, nessun feedback | Nel rapporto di fine turno cercare il grafico del piano di carico: se il file era vuoto, il grafico non appare ma nessuna nota lo spiega | Piccolo | Creare un CSV con solo l'intestazione (foro;x;fila;prof;prog;borr;rit), importarlo: un messaggio di feedback deve dire "nessun foro caricato" oppure il grafico deve mostrare una nota "dati non disponibili" |
| Rapportini | Rapportino in bozza senza produzione: si salva regolare, nello storico appare come gli altri | Nel form rapportino lasciare produzione vuota, salvare in bozza: nella lista dei rapportini la riga non dichiara che è incompleta (niente asterisco, niente colore grigio) | Piccolo | Aprire una bozza rapportino, non scrivere niente in produzione, salvare, cercarla nella lista e poi cliccarla: deve dire "produzione non compilata" oppure il badge deve dichiararlo |
| Rapporto stampabile | Meteo non registrato ma il rapporto ha una sezione per esso: cosa appare nella stampa se nessuno ha mai registrato il meteo? | Nel rapporto stampabile cercare la sezione "Meteo e condizioni del sito": se il turno non ha meteo registrato (nil dal database), appare riga vuota grigia? O testo "non registrato"? | Piccolo | Creare un rapportino, chiudere il turno SENZA mai compilare il meteo, aprire l'anteprima di stampa e cercarne la sezione: deve dire "non registrato" o simile, non restare in bianco |
| Piano di carico | Carica reale senza "da" e "squadra": il file importato vecchio non registra chi ha scritto e quando, i campi restano vuoti | Nel piano di carico aprire una riga e cercare chi ha inserito quel numero: il campo `da` è vuoto ma non lo dichiara — sembra assente per caso, non registrato intenzionalmente | Piccolo | Importare un vecchio CSV di piano, aprire una riga caricata e leggere il campo `da` (chi ha scritto): deve mostrare etichetta "non registrato" se vuoto, non restare in bianco |
| Attività | Attività "senza squadra" appare nel filtro ma non in "cosa tocca a me": la persona che apre l'app non vede il lavoro che nessuno ha preso | Nel blocco "Cosa tocca a me" in cima non appare nessuna attività, ma ce ne sono altre nella lista con squadra compilata e operatore vuoto | Medio | Creare un'attività, compilare squadra e operatore, salvare. Poi ricrearne un'altra: compilare squadra ma lasciare operatore vuoto. Nel blocco "Cosa tocca a me" di chi ha scelto quella squadra, la seconda deve apparire solo se non ha scelto il nome, altrimenti deve restare nascosta — la regola è scritta in `eMia` ma l'interfaccia deve dichiararla |
| Rapporto — riaperture | Motivo della riapertura lungo: su telefono stretto (320 px) il testo va a capo ma il bordo sinistro dashed rimane solo sulla prima riga | Nel rapporto di fine turno cercare la riga "Riaperto da Mario Bianchi il 29/07 alle 15:10 — dimenticati i minuti di fermo della volata di ieri nel turno di pomeriggio": su 320 px il testo spezza su due righe ma il bordo è solo nella prima | Piccolo | Aprire un turno riaperto con motivo lungo (>60 caratteri), ridimensionare il browser a 320 px: il bordo sinistro dashed deve seguire tutte le righe, non fermarsi alla prima |

---

## 01/08/2026 — Che cosa contiene davvero un rapporto di fine turno in una cava o attività estrattiva italiana?

### Il mondo: che cosa si registra in una cava (da ricerca)

**Avvertenza su fonti:** Le ricerche non hanno restituito documentazione primaria specifica alle cave (i moduli operativi sono conservati dalle aziende). La descrizione che segue è dedotta da tre fonti attendibili:
1. **Rapportino di cantiere edile** (modello standard italiano per operazioni di scavo/movimento terra simili a quelle di cava) — [fonte](https://infominds.eu/rapportino-di-cantiere/)
2. **D.Lgs 624/96** (norme di sicurezza attività estrattive) — [fonte](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
3. **D.Lgs 81/2008** e **D.Lgs 66/2003** (riposi, turni, tracciabilità personale) — [fonte](https://www.bosettiegatti.eu/info/norme/statali/2008_0081.htm)

Una cava che voglia operare in regola mantiene un rapporto di fine turno (o "rapportino giornaliero") con questi contenuti essenziali:

| **Voce** | **Come si usa** | **Chi la compila** | **Motivo** |
|----------|---------|---------|---------|
| **Data e turno** | Giorno di calendario (es. 01/08) e fascia oraria (Mattina, Pomeriggio, Notte) | Capocantiere/preposto | Identifica il periodo e separa i carichi di lavoro; obbligatorio per D.Lgs 81/08 |
| **Ore inizio e fine** | Timestamp o orario di inizio/fine lavoro effettivo (es. 06:00 - 14:00) | Capocantiere | Base per i calcoli di riposo giornaliero (D.Lgs 66/2003: 11 h consecutive ogni 24 h) e paghe |
| **Personale presente (per nome)** | Elenco operatori che hanno lavorato, con ore lavorate per ciascuno | Capocantiere/preposto all'appello | Tracciabilità per sicurezza, contabilità ore, verifiche ispettive (D.Lgs 624/96 richiede notifica nominativa per ogni turno); serve anche all'appello di emergenza |
| **Attività svolte (descrizione)** | Quale fronte/zona è stata lavorata, quale operazione (perforazione, scavo, carico, trasporto, frantoio) | Capocantiere | Giustifica la produzione e documenta l'avanzamento; necessaria se l'ispettore chiede «che cosa avete fatto quel giorno» |
| **Produzione** | Quantità estratta/movimentata (tonnellate o volumi), materiale, unità di misura | Capocantiere; spesso da rilievi strumentali (droni, scanner) per cava | Bilancio del sito, riconciliazione con le autorizzazioni ambientali, denuncia annuale |
| **Fermi registrati** | Quali anomalie/guasti hanno interrotto il lavoro, durata, causale | Capocantiere | Analisi della disponibilità effettiva dei mezzi; spiegazione se la produzione è inferiore all'atteso; tracciabilità per manutenzione preventiva |
| **Condizioni meteo** | Pioggia, fango, visibilità, temperature critiche | Capocantiere/preposto | Giustifica fermi per sicurezza e spiega scostamenti di produzione e disponibilità |
| **Materiali/mezzi impiegati** | Quali escavatori, dumper, perforatrici, setacci erano operativi; consumabili (carburante, esplosivo) | Capocantiere | Controllo di efficienza meccanica, contabilità produttiva, tracciabilità consumabili regolati (esplosivi) |
| **Firma di chiusura** | Nome e firma del capocantiere/responsabile turno e del ricevente turno successivo | Capocantiere uscente e operatore ricevente | Responsabilità legale; il turno documentato non può essere modificato dopo la firma (D.Lgs 81/08) |
| **Note anomalie** | Infortuni, near-miss, difetti di qualità del materiale, problemi ambientali, variazioni di piano | Capocantiere | Tracciabilità per sicurezza; eventuali report obbligatori a INAIL o autorità locali |

**Deduzione (non letto):** Nelle cave italiane, il rapporto di fine turno ha una **duplice natura**: è sia un **documento operativo** (che cosa abbiamo fatto, prodotto, quale problema abbiamo avuto) sia un **documento legale** (tracciabilità per D.Lgs 624/96 e 81/08, verifica ispettiva, contabilità ore). Le voci sono conseguenza di obblighi normativi specifici del settore estrattivo.

---

### Il delta: che cosa c'è nel mondo ma manca in Campo

| **Voce** | **Campo ha?** | **Note** |
|----------|---------|---------|
| Ore di inizio/fine turno specifiche (timestamp) | Parziale | Campo ha la durata dichiarata, ma non gli orari di inizio/fine effettivi per il turno; ha l'ora della chiusura ma non l'ora in cui il turno è COMINCIATO |
| Ore di arrivo/partenza per ogni operatore | No | Campo ha l'appello (presente/assente) ma non l'orario di arrivo né quello di partenza per ciascuno — dato essenziale per il D.Lgs 66/2003 (riposo tra turni) |
| Descrizione dettagliata delle attività (cosa è stato fatto, dove, con quale mezzo) | Parziale | Campo ha l'elenco delle "attività" (titolo, dettaglio, squadra) ma il "dettaglio" è un campo libero non strutturato; il rapporto stampabile elenca attività concluse ma non in forma narrativa come in un rapportino tradizionale |
| Mezzi operativi utilizzati (escavatore X, dumper Y, perforatrice Z) | No | Campo ha le squadre ma non registra "quali mezzi erano in servizio" durante il turno — un dato importante per tracciare efficienza meccanica e contabilità |
| Consumabili o materiali significativi (carburante, esplosivo, energia) | No | Dedotto non letto: le cave registrano consumi per contabilità, ma Campo non ha campi per questo |
| Responsabile della consegna in senso ampio (capocantiere, preposto) | Parziale | Campo ha "consegna" (chi passa il turno) e "ricevuta" (chi riceve) come nomi liberi; non ha ruoli né titoli formali |
| Firma digitale o traccia di autorizzazione della chiusura | Parziale | Campo registra l'ora della chiusura ma non esplicitamente un'approvazione o autorizzazione formale — il rapporto stampabile mostra i nomi ma non ha un'area di sottoscrizione |
| Denuncia o infortuni registrati | No | D.Lgs 81/08 richiede tracciabilità di infortuni e near-miss; Campo ha un campo "note" nelle anomalie ma non ha una sezione dedicata |
| Variazioni al piano o modifiche di programma dichiarate | No | Dedotto non letto: un rapporto deve dichiarare se il piano è stato modificato; Campo non ha un campo per questo |

---

### Il delta inverso: che cosa c'è in Campo ma non è tipico in un rapporto tradizionale

| **Voce** | **Mondo ha?** | **Note** |
|----------|---------|---------|
| Obiettivo di turno con scostamento | Raro | Un rapportino standard non dichiara "dovevamo fare X, abbiamo fatto Y"; è più recente nelle cave con sistemi KPI avanzati |
| Disponibilità percentuale calcolata | No | La "disponibilità = turno dichiarato − minuti di fermo" è una metrica moderna (equiparata a OEE); rapporti tradizionali registrano i fermi ma non la percentuale |
| Checklist di inizio turno standardizzata | Parziale | Molte cave hanno check-list di sicurezza, ma non sempre salvate insieme al rapporto; Campo le integra |
| Piano di carico con rilievi per foro | No | Il piano di carico è storico della volata (Genesi); un rapportino tradizionale non lo collega a ogni turno |
| Appello con tre stati (presente/assente/da spuntare) | Parziale | I rapportini registrano "personale presente" come numero; la granularità per-operatore con il terzo stato è più moderno |
| Foto dell'anomalia salvate nel database | No | Tradizionalmente si allegavano foto in PDF; integrarle nel database è pratica recente |
| Ponte dati strutturato verso altre app (Terra, Scudo) | No | Un rapportino isolato non dialoga con altri sistemi; i ponti sono innovazione del sistema Deepwork |

---

### Il verdetto

Il rapporto di fine turno in una cava italiana standard contiene **otto-dieci voci obbligatorie** (data, turno, orario, personale, attività, produzione, fermi, meteo, firma, note anomalie). Campo ne raccoglie **6-7 in forma strutturata** (data, turno, attività, produzione, fermi con causali, meteo, firma/chiusura) e **altre 3 come supporto** (checklist, appello, durata, obiettivo).

**La mancanza più significativa** è **l'orario di inizio/fine turno per persona**: non è scritta in un rapportino nominale, ma il D.Lgs 66/2003 (riposi) e la contabilità ore la richiedono. Oggi Campo aggira il problema con la durata dichiarata (è il denominatore della disponibilità) e l'appello (presente/assente), ma se l'ispettore chiede «quando è arrivato Rossi, quando se n'è andato», la risposta non è tracciata.

**Le tre proposte più forti** per far aderire il rapporto di fine turno di Campo al modello reale:

1. **Ore di turno esplicite**: aggiungere "ora inizio turno" e "ora fine turno" come campi distinti dalla durata dichiarata. Non serve fare una nuova misura: è sufficiente leggere dal turno standard (Mattina 06:00-14:00, ecc.) e permettere di correggere se il turno effettivo è diverso. Costo: quattro campi e una nota nel rapporto stampabile. Misura: il rapporto deve mostrare «Turno Mattina (06:00-14:00)» in cima, e permettere di cambiarla se necessario.

2. **Orari per persona (arrivo/partenza)**: aggiungere ora di arrivo e ora di partenza all'appello, accanto a presente/assente. Serve al D.Lgs 66/2003 e alla contabilità. Costo: medio (due campi per operatore per turno). Misura: l'appello stampato mostra «Mario Rossi · presente dalle 06:15 alle 13:45» invece di solo «presente».

3. **Mezzo principale del turno**: un campo a menu per scegliere «quale mezzo ha guidato il turno» (escavatore X, dumper Y, perforatrice, impianto, manutenzione). Non è obbligatorio ogni giorno, ma quando c'è la disponibilità calcolata, quel dato è utile per distinguere «disponibilità dell'escavatore» da quella della squadra. Costo: piccolo. Misura: nel rapporto, accanto alla disponibilità, scrivere «Disponibilità (escavatore CAT 336): 85%».

---

*Documento di ricerca — ricerca approssimativa, candidati da approfondire, non diagnosi.*

---

## ✅ Verifica della ricerca del 01/08 — le tre proposte reggono, e una è diventata un cantiere

*Verificata contro il codice subito dopo, come pretende la direttiva 4. A
differenza della tornata gemella su Scudo — dove **quattro proposte su cinque**
non hanno retto — qui il delta è vero, e vale la pena dire **perché**: questa
ricerca è andata a guardare `campo-data.js` con termini che il codice non ha,
invece di riassumere quello che il documento dei concorrenti diceva.*

| # | proposta | verdetto | la prova |
|---|---|---|---|
| 1 | ore di inizio/fine turno esplicite | **CONFERMATA ASSENTE** | `oraInizio`, `oraFine`, `ingresso`, `uscita`, `oreLavorate` in `campo-data.js`: **zero**. Ci sono `TURNI` (145) e `ORE_INIZIO_TURNO` (158-160) — cioè gli orari **standard**, non quelli veri. |
| 2 | orari **per persona** nell'appello | **CONFERMATA ASSENTE** | stessa ricerca; l'appello porta `stato` (presente/assente/non spuntato) e nient'altro sul tempo. |
| 3 | mezzo principale del turno | **CONFERMATA ASSENTE** | `mezzoId`/`mezzoPrincipale`: zero; `mezzi` compare 3 volte in `campo-data.js` e 1 nella pagina, sempre come parola nei testi. Il parco vive in **Flotta**, e il ponte non c'è. |

### Perché la #1 e la #2 non sono un dettaglio di comodità

Il **riposo fra due turni** ex D.Lgs 66/2003 art. 7 — `riposoPrimaDelTurno`,
costruito lo stesso giorno — calcola la fine del turno precedente da
`durataTurnoDi`, cioè dalla durata **dichiarata**. Chi resta due ore in più per
finire un carico ha quindi un riposo **più corto di quello che l'app calcola**,
e l'app non ha modo di saperlo: il numero è tranquillo dove non è stato
misurato niente, che è il difetto che il principio del fondatore esiste per
impedire.

Con gli orari veri quella funzione smette di essere una stima. E l'asimmetria
che ha già va tenuta identica: un orario **non compilato** non è «ha lavorato le
ore standard» — è **non dichiarato**, e il riposo calcolato sulla durata resta
un **tetto**. Un tetto sotto le 11 ore prova la violazione lo stesso; un tetto
sopra non prova niente.

→ Cantiere aperto sulla #1 e la #2. La #3 resta proposta, non verificata come
disegno: il mezzo del turno è un **ponte Campo ↔ Flotta**, e i ponti si
progettano a parte.

---

## 06/08/2026 — Rapporto di fine turno: il mestiere della cava (domanda puntuale e verificata)

### Che cosa esiste già

In `apps/campo/campo-data.js` (commit d9524fa):
- **rapportini** (riga 273-297): { data, turno, titolo, squadra, prodQta, prodUnita, ora, stato: bozza|inviato }
- **attivita** (190-199): { data, turno, titolo, dettaglio, squadra, operatore, stato: pianificata|in-corso|anomalia|conclusa, causale, fermoMin }
- **meteo** (370): { data, turno, cielo, piste, visibilita, note, ora }
- **durate** (373-379): { data, turno, minuti, ora } (durata dichiarata)
- **presenze** (313-368): { data, turno, operatoreId, stato: presente|assente, ora, entrata, uscita }
- **chiusure** (369): { data, turno, consegna, ricevuta, note, ora, riaperture }
- **checklist** (301): { data, turno, squadra, esiti: {0:ok|no|na}, note, ora }
- **TURNI** (151): ["Mattina", "Pomeriggio", "Notte"]
- **ORE_INIZIO_TURNO** (158-160): Mattina 6, Pomeriggio 14, Notte 22

In `apps/campo/index.html` (rapporto stampabile a riga 3626-3750): quadro, checklist, meteo, appello nominativo, obiettivo, attività, fermi per causale, disponibilità per turno, foto anomalie, produzione, rapportini, chiusura e firme.

### Il mondo: che cosa contiene un rapporto di fine turno in una cava italiana

**Fonti verificate e citabili:**

1. **D.Lgs 624/1996** — Sicurezza dei lavoratori nelle industrie estrattive (Italia) [Testo ufficiale](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
   - Art. 20: Direttore responsabile e sorvegliante devono essere denunciati per ogni turno, con nome e domicilio
   - Art. 10: Documentazione obbligatoria della durata dei lavori

2. **D.Lgs 81/2008** — Tutela della salute e della sicurezza nei luoghi di lavoro (Italia)
   - Art. 37: Formazione obbligatoria
   - Tracciabilità personale per emergenze

3. **D.Lgs 66/2003** — Orario di lavoro
   - Art. 7: Riposo minimo 11 ore consecutive ogni 24 ore
   - Richiede tracciamento orari di inizio/fine turno per ogni operatore

4. **Linee guida Regione Puglia (2015) per D.Lgs 624/96** [Disponibile](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137)
   - Raccomandazioni sulla documentazione giornaliera

5. **Raken (software di reporting per quarry/construction)** [Fonte](https://www.rakenapp.com/features/daily-reports)
   - Daily reports standard: personale, produzione, fermi, meteo, foto

6. **Quarry Magazine — Quarry Management Practices** [Fonte](https://www.checkproof.com/blog/quarry-mining/quarry-management-and-maintenance-101/)
   - Inventario giornaliero, disponibilità macchine, incidenti

#### Le quattro domande: risposte dal mestiere della cava

**D1: Quali voci compaiono sempre in un rapporto di fine turno?**

| Voce | Chi la registra | Motivo normativo/operativo | Oggi in Campo |
|------|---|---|---|
| **Data e turno** | Preposto/capocantiere | D.Lgs 624/96: identificazione dello shift | ✅ Sì (rapportini.data, .turno) |
| **Personale presente (nominativo)** | Capocantiere | D.Lgs 81/08: tracciabilità per emergenze e contabilità ore | ✅ Sì (presenze) |
| **Orario inizio/fine turno** | Capocantiere/sistem tempo reale | D.Lgs 66/03: calcolo riposo fra turni; contabilità ore | ⚠️ Parziale (durata dichiarata, non orari veri) |
| **Orario arrivo/partenza per persona** | Appello/rilevazione | D.Lgs 66/03 art. 7: riposo fra turni; tracciamento infortuni | ✅ Parziale (presenze.entrata/uscita) |
| **Attività svolte (descrizione)** | Preposto | Documentazione avanzamento lavori, giustificazione fermi | ✅ Sì (attivita.titolo/dettaglio) |
| **Produzione** | Preposto/rilievi strumentali | Rendicontazione ambientale, riconciliazione volumi autorizzati | ✅ Sì (rapportini.prodQta/prodUnita) |
| **Fermi/anomalie con causale e durata** | Preposto | Analisi OEE, manutenzione preventiva, disponibilità effettiva | ✅ Sì (attivita.causale, fermoMin) |
| **Condizioni meteo** | Preposto | Giustificazione di fermi, scostamenti produzione | ✅ Sì (meteo.cielo/piste/visibilita) |
| **Firma/consegna turno** | Capocantiere uscente + ricevente | D.Lgs 81/08: responsabilità legale, chiusura documento | ✅ Sì (chiusure.consegna/ricevuta/ora) |
| **Note anomalie/infortuni** | Preposto | D.Lgs 81/08: tracciabilità INAIL, auditing | ✅ Parziale (attivita.dettaglio, non dedicato) |

**D2: Chi lo legge dopo?**

1. **Turno successivo** (handover/consegna) — Estrae: anomalie aperte, fermi non risolti, avanzamento verso obiettivo, situazione meteo
2. **Direttore responsabile** (end-of-day review) — Verifica: somme di produzione, conformità a durate autorizzate, anomalie richiedenti escalation
3. **Ufficio operativo** — Registra: trasmissione dati a ARPA (ambientale), denuncia annuale, riconciliazione volume estratto vs. autorizzazione
4. **Preposto seguente** — Legge: quali mezzi sono fuori servizio, quali operatori hanno ore eccessive (riposo insufficiente), quale è il fronte di lavoro per oggi
5. **Ispettore** (ASL/ARPA/Distretto Minerario) — Chiede: «Questo giorno, che cosa avete fatto? Chi c'era? Ci sono stati infortuni? Perché quella giornata il volume è basso?»
6. **Contabilità** — Estrae: ore per operatore (buono paga), durata turno (disponibilità), consumi (carburante, esplosivi)

**D3: Quali passaggi di consegne fra turno e turno sono critici (e perché)?**

| Elemento critico | Perché importa | Oggi in Campo | Difetto se assente |
|---|---|---|---|
| Anomalie ancora aperte | Se il fermo non è risolto, il turno seguente non riparte dallo stesso punto; il ripiego può costar ore | ✅ Registrato in attivita, non in consegna | Se non dichiarato, il turno seguente scopre solo quando tocca il mezzo |
| Fermi senza minuti | Un fermo registrato senza durata è "non misurato"; il turno seguente non sa se è da 20 min o 4 ore | ⚠️ Possibile (attivita.fermoMin può restare vuoto) | La disponibilità del turno precedente diventa "non misurabile"; il turno seguente non sa che correggere |
| Materiale a metà | Se il blocco è ancora su quella pala, il turno seguente non può usarla | ⚠️ Dipende da come lo scrive il preposto in dettaglio | Se non dichiarato per nome, il turno seguente ha l'attività ma non il dettaglio operativo |
| Meteo peggiorato (previsione) | Se pioggia per la notte, il turno seguente deve sapere che il fronte sarà fangoso | ✅ Registrato, ma non c'è campo previsione | Solo il meteo effettivo di ieri, non le condizioni attese oggi |
| Orari effettivi di uscita | Se Rossi è uscito alle 23:45 il turno precedente, il giorno dopo sta sotto le 11 ore di riposo | ⚠️ Presenze.uscita esiste ma non è sempre compilato | Il turno seguente non sa che Rossi non è riposto |

**D4: Quali errori rendono un rapporto inutile o contestabile?**

| Errore | Come si vede | Conseguenza | Oggi in Campo |
|---|---|---|---|
| **Personale assente ma non dichiarato** | Nome del campo rimasto vuoto (appello incompleto) | Ispettore: "Chi c'era quel giorno?" → Non si sa | ⚠️ Possibile (presenze può avere da_fare = chi non è stato spuntato) |
| **Fermi senza cause** | Disponibilità al 85% ma la lista dei fermi è vuota | Sembra un buono/giorno regolare dove in realtà non è stato misurato il fermo | ⚠️ Possibile (attivita.stato = "anomalia" senza causale compilata) |
| **Durata dichiarata vs. durata reale** | Turno inizia alle 06:00, finisce alle 14:00 (dichiarato), ma il capocantiere ha firmato alle 14:30 | Calcolo del riposo errato (tetto), contabilità ore errata | ⚠️ Campo ha durate dichiarate, non controlla orari di fatto |
| **Firma mancante o data sbagliata** | Riga di chiusura senza ora, o compilata giorni dopo | Documento legale non valido per contestazioni | ✅ Campo pretende ora al momento della chiusura |
| **Produzione senza unità** | Rapporto scrive "2.000" (tonnellate? Volume? Pezzi?) | Riconciliazione con autorizzazioni impossibile | ✅ Campo ha prodQta + prodUnita sempre insieme |
| **Foto di anomalia senza nome** | "Vedi allegato" senza dire se è il foro intasato o la catena della perforatrice | Non si capisce di quale anomalia parla | ⚠️ Campo salva foto in attivita.anomalia ma non la collega automaticamente al testo |
| **Firme non rintracciabili** (nome scritto a mano, ruolo non dichiarato) | Firma dice "Mario Rossi" senza dire se è capocantiere o operatore | Ispettore: "Chi è Mario Rossi?" → Non si trova il ruolo | ⚠️ Campo registra consegna/ricevuta come nomi liberi, non con ruoli |

### Proposte di miglioramento per Campo

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| Rapporto di fine turno | Manca «orario effettivo di inizio turno» (es. Mattina 06:00 teorico, effettivo 05:45 perché hanno iniziato presto) | Nel rapporto stampato scrive solo "Turno Mattina, durata dichiarata 8 h"; non scrive "iniziato alle 05:45" | Piccolo | Aggiungere campo `oraInizioEffettiva` e `oraFineEffettiva` in `durate`; nel rapporto mostrare "Turno Mattina (06:00-14:00 dichiarato, 05:45-14:15 effettivo)" se diverso da standard |
| Appello del turno | Orari di arrivo/partenza non sono sempre compilati, quindi il riposo fra turni (D.Lgs 66/03) viene calcolato sulla durata dichiarata, non su quella vera | Nel rapporto, chi ha portato il turno in stampa vede solo «Mario Rossi · presente» oppure «presente dalle 06:15» se ha compilato; il turno precedente ha un'uscita (uscita: "14:00") ma non sa che è teorica | Medio | Marcare i campi `entrata` e `uscita` delle presenze come **richiesti** quando la persona è marcata presente; nel rapporto stampato mostrare "dalle HH:MM alle HH:MM" con colore diverso se uno dei due orari manca (riposo calcolato su stima) |
| Attivita — anomalia | Fermo registrato senza causale: disponibilità dice 92% ma nella lista dei fermi vedi "Altro" senza dettaglio | Nel rapporto di fine turno, riga "Frantoio" con 3 fermi: due hanno causale (es. "Intasamento tramoggia, 45 min"), uno no (grigio, "Altro, — min") — il preposto non capisce se è incompleto o se davvero non si sa | Piccolo | Quando una attivita ha stato: anomalia ma causale è vuota E fermoMin è vuoto, bloccare il salvataggio con messaggio "Registra la causale e i minuti di fermo, oppure torna indietro" |
| Attivita — anomalia | Fermo registrato senza **durata in minuti**: disponibilità non misurabile, ma l'interfaccia lo mostra comunque come numero | Nel Pareto dei fermi, riga "Fermo impiantistico: 0 min" quando in realtà è "non dichiarato"; nelle ore di turno rimasto, disponibilità riporta 100% ma la nota dice "1 fermo senza minuti — disponibilità non misurabile" | Piccolo | Nella lista dei fermi, se fermoMin è vuoto ma causale c'è, mostrare "Causale: Intasamento tramoggia · **Durata non dichiarata**" con badge grigio/avvertimento; il calcolo della disponibilità deve saltare quel fermo |
| Rapporto stampabile — firma | Riga di firma mostra "Consegnato da: Rossi Mario alle 14:05" ma non dice se Rossi è capocantiere, preposto o operatore | Nel PDF stampato, firma ha solo nominativo e ora; se l'ispettore chiede chi ha autorizzato la chiusura, il documento non lo dice | Piccolo | Aggiungere campo ruolo/qualifica accanto a `consegna` in `chiusure`; nel rapporto mostrare "Consegnato da: Rossi Mario (Capocantiere) alle 14:05" |
| Rapporto stampabile | «Operatore di turno» non dichiarato: nel rapportino, chi ha condotto il turno? E se ce n'è più di uno? | Nel rapporto scrive le attività per squadra e l'appello nominativo, ma non una riga "Coordinamento: Mario Rossi" o "Team leader: Giulia Verdi" | Piccolo | Aggiungere un campo a menu nella chiusura: "Operatore principale" (opzionale, non è il consegnatario); nel rapporto, sotto la sezione chiusura, scrivere se compilato |
| Presenze — anomalia | Se un operatore «non è stato spuntato» nel turno precedente ma si è infortunato, il rapporto non lo traccia come presente | Nel rapporto dell'infortunio (in Scudo), la riga dice "Infortunato: Mario Rossi, data 04/08 turno Mattina" ma in Campo l'appello di quel turno dice "da spuntare" per Rossi — contraddizione | Medio | Nel rapporto stampabile di fine turno, se esiste un infortunio di Scudo datato dello stesso giorno e turno di un operatore segnato "assente" o "da spuntare" in Campo, mostrare avvertimento "⚠️ Infortunio registrato per X nello stesso turno, check appello" |
| Rapporto stampabile — firme digitali | Firma cartacea/nome scritto: il documento legale non ha una traccia criptografica | Nel PDF stampato la firma è testo, non un certificato; una contestazione su un rapporto stampato non regge legalmente quanto una firma digitale | Grande | Implementazione di firme digitali con certificati (es. CNS, firma grafometrica) — fuori budget di questa ricerca, richiede infrastruttura |

**Proposta prioritaria per il mondo reale:** Le prime due (orari effettivi di inizio/fine turno, orari di arrivo/partenza per persona) sono vincolanti per il D.Lgs 66/2003 e non sono optional. Se un'ispettorice chiede «Questo signore quante ore ha lavorato il 04/08?», la risposta "dalle 06:00 alle 14:00 dichiarato, ma non so quando è arrivato/partito" non regge. Le presenze con entrata/uscita oggi esistono ma spesso restano vuote: vanno marcate come **obbligatorie quando presente=true**.

---

**Verificato al commit d9524fa (06/08/2026).**

Sources:
- [D.Lgs 624/1996 — Sicurezza dei lavoratori nelle industrie estrattive](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
- [Raken Daily Reports](https://www.rakenapp.com/features/daily-reports)
- [Quarry Management and Maintenance 101](https://www.checkproof.com/blog/quarry-mining/quarry-management-and-maintenance-101/)
- [Regione Puglia — Linee guida D.Lgs 624/96](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137)
