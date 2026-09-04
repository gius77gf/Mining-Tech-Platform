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


---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_campo.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

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

---

## Ricerca del 2026-09-02 — il rapporto di fine turno e le grandezze di produttività (metà sul mondo)

### Ciò che esiste già da noi
Non verificato da questa ricerca: il delta lo fa chi ha il codice.

### 1. CAMPI di un rapporto di fine turno — voce per voce

**Intestazione e consegna**: nome e firma del sorvegliante uscente e di quello entrante, ora di fine, note di consegna, spunta di presa in carico [seconda mano: SafetyCulture templates].

**Personale**: organico del turno, assenze, argomenti briefing inizio turno, obblighi di sicurezza [seconda mano: SafetyCulture templates].

**Mezzi e postazioni**: identificativo escavatore/pala, posizione, tipo materiale (carbone/sterile/tutt'e due), discarica primaria e secondaria, stato del mezzo [seconda mano: SafetyCulture templates].

**Produzione contro piano**: ora primo carico, ritmo di scavo (t/h o cicli/h), assegnazione camion, tempi ciclo, code, volumi, conformità al progetto [seconda mano: Mining Doc].

**Fermi e ritardi**: attività classificate come produzione/downtime/delay, ritardi programmati e non, ritardi «scusabili», impatti su ritmo [seconda mano: SafetyCulture templates].

**Carico utile**: prestazione payload contro obiettivo mezzo [seconda mano: SafetyCulture templates].

**Sicurezza**: infortuni/incidenti, osservazioni di sicurezza, controlli pre-avviamento, verifiche su veicoli, verifica controlli critici (separazione operativa, gestione traffico, comunicazione positiva) [seconda mano: SafetyCulture + MSHA 30 CFR].

**Ambiente/condizioni**: meteo, problemi coperture, condizioni che limitano operatività [seconda mano: SafetyCulture templates].

### 2. GRANDEZZE di produttività e formule (fonte accanto)

**OEE (Overall Equipment Effectiveness)**: OEE = Availability × Utilization × Performance [seconda mano: Opsima, Groundhog Apps].

**Availability**: % del tempo programmato in cui il mezzo era disponibile. Formula: `(Ore programmate − Ore fermo) / Ore programmate × 100` [seconda mano: Opsima].

**Utilization**: uso ore disponibili per lavorare davvero. Formula: `Ore operative / (Ore operative + Fermo + Standby) × 100` [seconda mano: Opsima].

**Equipment Productivity**: tonnellate mosse o trasportate per ora operativa. Formula: `Tonnellate / Ore operative` [seconda mano: Opsima].

**Stima produzione senza pesa**: Bucket capacity = Payload (t) / Densità materiale (t/m³). Con fill factor 75-90% e perdite 3-8% per ciclo [seconda mano: Hunker, P&Q University].

**Powder factor (fattore di carica)**: kg esplosivo / m³ roccia: Hard rock 0.70–0.80, Medium 0.40–0.50, Soft 0.25–0.35 kg/m³ [seconda mano: Tool Grit, WipWare].

**Haul cycle time**: componenti tipiche 4.3 min carica, 8.5 min trasporto, 0.9 min scarica, 6.2 min ritorno vuoto = 19.8 min totali (distanza 239 m, velocità 10.1 km/h) [seconda mano: ResearchGate, mining.in.ua].

### 3. CONTROLLI pre-start e consegne fra turni

**Pre-shift inspection** (obbligatorio MSHA 30 CFR): fluidi, cinghie, tubi, batterie, pneumatici, tracce; sistemi sicurezza (cinture, estintore, specchi, tergicristalli, luci, allarme retromarcia, telecamera); integrità meccanica (freni, sterzo, ROPS/FOPS, soppressione incendi) [seconda mano: Heavy Vehicle Inspection, SafetyCulture].

**Shift handover**: pre-start communications, weather checks, JSA review; valutazione setup escavatore, condizioni banco, cordoli, conformità progetto; audit strade di carico per segnaletica, delineazione, pendenze [seconda mano: SafetyCulture].

**Passaggio consegne è orario di lavoro retribuito** (Cassazione ordinanza 20787/2024): informazioni essenziali, stato macchina, anomalie, lavori in sospeso, parametri processo [seconda mano: Avvocato Lavoro Asti].

### 4. PRODOTTI di settore e moduli di rapporto

| Prodotto | Tipo | Fonte |
|----------|------|-------|
| **Wenco Mine Performance Suite** | Fleet management, dispatch, reporting real-time | [seconda mano: Hitachi CM, Wenco Wikipedia] |
| **Wencolite FMS** | Versione snella per cave piccole, senza infrastruttura wireless | [seconda mano: Hitachi CM] |
| **Modular Mining DISPATCH** | Dispatch fleet, production monitoring | [seconda mano: Mining Software Reviews] |
| **Loadrite InsightHQ** | Portal quarry management, dashboard shift/day/week/month | [seconda mano: New England Loadrite] |
| **Opsima** | Mining operations software, KPI reporting | [seconda mano: Opsima] |
| **SafetyCulture Library** | Moduli shift report, pre-start, supervisor log (pubblici) | [seconda mano: SafetyCulture] |

### 5. DOMANDE per il delta

1. **Chi decide la portata dichiarata di un dumper** (è costante, oppure Campo la registra per ogni viaggio)?
2. **La nostra app distingue fra tempi di carica, trasporto, scarico e ritorno** oppure somma il ciclo intero?
3. **Un fermo lungo gli interi 8 ore del turno** si somma come 480 minuti, oppure va segnalato come «non misurato»?
4. **Come aggrega Campo la produzione di un turno con più fronti** (somma semplice per fronte, oppure peso per ore di operatività)?
5. **Chi collega una anomalia di sicurezza (infortunio, near-miss) al turno che l'ha registrata** se l'anomalia non ha `turno` ma solo `data`?
6. **La "conformità al progetto"** (assegna dump 1° e 2°, controlla bench height e gradini disegnati) è responsabilità di chi controlla nella nostra app?

### 6. FONTI (marcate [seconda mano])

[https://safetyculture.com/library/mining/](https://safetyculture.com/library/mining/) — Moduli di turno vari
[https://www.miningdoc.tech/question/what-are-the-key-performance-metrics-tracked-in-a-daily-mining-operations-report/](https://www.miningdoc.tech/question/what-are-the-key-performance-metrics-tracked-in-a-daily-mining-operations-report/) — Mining Doc
[https://cms.nucleusnetwork.com/urban-beat/understanding-mining-productivity-key-concepts-and-metrics-1767646798](https://cms.nucleusnetwork.com/urban-beat/understanding-mining-productivity-key-concepts-and-metrics-1767646798) — Nucleus Network
[https://opsima.com/blog/kpis/mining-industry-kpis/](https://opsima.com/blog/kpis/mining-industry-kpis/) — Opsima
[https://groundhogapps.com/understanding-overall-equipment-effectiveness/](https://groundhogapps.com/understanding-overall-equipment-effectiveness/) — Groundhog Apps
[https://www.hunker.com/13425998/how-to-calculate-excavator-bucket-capacity/](https://www.hunker.com/13425998/how-to-calculate-excavator-bucket-capacity/) — Hunker
[https://www.pitandquarry.com/hauling-pq-university-handbook/2/](https://www.pitandquarry.com/hauling-pq-university-handbook/2/) — P&Q University
[https://www.toolgrit.com/guides/blasting-powder-factor](https://www.toolgrit.com/guides/blasting-powder-factor) — Tool Grit
[https://wipware.com/drilling-and-blasting-charge-and-design/](https://wipware.com/drilling-and-blasting-charge-and-design/) — WipWare
[https://www.researchgate.net/publication/388122540_Optimization_of_cycle_time_for_loading_and_hauling_trucks_in_open-pit_mining](https://www.researchgate.net/publication/388122540_Optimization_of_cycle_time_for_loading_and_hauling_trucks_in_open-pit_mining) — ResearchGate
[http://mining.in.ua/articles/volume18_1/03.pdf](http://mining.in.ua/articles/volume18_1/03.pdf) — Mining journal
[https://www.wencomine.com/our-solutions/dispatching](https://www.wencomine.com/our-solutions/dispatching) — Wenco
[https://www.neloadrite.com/reporting](https://www.neloadrite.com/reporting) — New England Loadrite
[https://heavyvehicleinspection.com/blog/post/mining-equipment-pre-shift-inspection-checklist-guide/](https://heavyvehicleinspection.com/blog/post/mining-equipment-pre-shift-inspection-checklist-guide/) — Heavy Vehicle Inspection
[https://www.avvocatolavoroasti.it/blog/tempo-tuta-orario-di-lavoro/](https://www.avvocatolavoroasti.it/blog/tempo-tuta-orario-di-lavoro/) — Avvocato Lavoro Asti

---

**Ricerca scritta**: 02/09/2026 — metà mondo con fonti marcate [seconda mano]; delta da fare col codice; domande enumerate.


### Il delta, fatto da chi ha il codice in mano (02/09, contro `e5d0f81e`)

Le sei domande, risposte aprendo `apps/campo/campo-data.js` (e
`shared/dw-ponti.js` dove il ponte vive) e cercando il MECCANISMO.

1. **La portata del dumper** → **non si registra, di proposito**: il
   rapportino dichiara la produzione in `t`, `m³` o `viaggi`
   (`produzioneRapportino`, `RAPP_UNITA`), e nel ponte con Terra e Conti i
   viaggi «**non si convertono mai**: servirebbe la portata del mezzo, che
   cambia da camion a camion e da carico a carico — si contano e si
   dichiarano a parte» (`produzioneDichiarata`, shared). `grep -ci portata
   apps/campo/campo-data.js` → 2, tutt'e due in commenti che spiegano PERCHÉ non c'è. La stima
   «cassone × densità sciolta × riempimento» della ricerca è esattamente il
   coefficiente inventato che questa casa non scrive. ⏱️ Se un giorno servisse,
   la strada onesta è una portata NOMINALE per mezzo in Flotta (che il mezzo ce
   l'ha), dichiarata «nominale», mai una media.
2. **Carico, trasporto, scarico, ritorno** → **non si distinguono**: `grep -ciE
   'tempo di ciclo|cicli/ora' apps/campo/campo-data.js` → 0. Campo non ha un cronometro del ciclo:
   ha il rapportino di fine turno e i FERMI con causale e minuti. Un tempo di
   ciclo è un dato di telematica (DISPATCH, Wenco), non di un foglio a fine
   turno; senza lo strumento sarebbe una stima a occhio spacciata per misura.
3. **Un fermo lungo tutto il turno** → i minuti sono `null` quando nessuno li
   ha scritti, «mai 0» (`minutiFermoDi`, `minutiFermoTesto`), e
   `disponibilitaTurno(attivita, durate, data, turno, chiusure)` risponde «non
   calcolabile» quando il fermo supera quello che il turno ha da dare — è il
   caso dei 55 minuti su mezz'ora che il banco di Campo prova di proposito.
   L'OEE **non si chiamerà mai così**, ed è scritto nel modulo con la ragione
   («servirebbero portata e granulometria in continuo, cioè hardware che non
   abbiamo»): si chiama disponibilità.
4. **Più fronti nello stesso turno** → `totaliProduzione` somma per unità e
   per turno (i rapportini senza quantità NON contano; il turno mancante
   finisce in «Senza turno»); per FRONTE la ripartizione la fa il ponte con
   Terra (`fronteId`: 8 occorrenze), e un rapportino senza fronte — `rs6`
   nella dimostrazione, di proposito — «non si sa da dove viene» invece di
   essere spalmato a intuito. Nessun peso per ore di operatività: la somma è
   semplice e dichiarata.
5. **L'anomalia e il turno** → le anomalie di Campo nascono dalle ATTIVITÀ
   (`anomalieAperte(attivita)`), che portano data e turno per costruzione; gli
   infortuni e i near miss sono di Scudo (ponte P3 in shared, `bozzaNearMiss`),
   e lì la data è la chiave — il turno, se c'è, è un campo del near miss. Un
   evento con la sola data non si «collega» a un turno indovinando: resta
   sulla giornata.
6. **La conformità al progetto** → `grep -ci conformit apps/campo/campo-data.js` → 0: il
   confronto progettato/reale foro per foro passa dal piano di Genesi
   (`parsePianoCsv` / `pianoConsuntivoCsv`, i file) e dice gli scostamenti
   di carica; l'altezza del banco e i gradini disegnati non sono un controllo
   di Campo — sono un rilievo, e i rilievi sono di Terra. La responsabilità è
   di chi firma il consuntivo, non dell'app.

E le cose del rapporto di turno che la ricerca elenca: il **pre-start** c'è
(la checklist di inizio turno, C3: `checklistDi`, `statoChecklist`, «a inizio
turno essere a zero è normale, non un allarme»); l'**handover** c'è come
campo del rapportino («consegne per il turno successivo»); il **fattore di
carica** per volata NON è di Campo (è di Genesi: `consumoSpecifico`).

Riassunto: **cinque su sei esistono nella forma che una cava senza telematica
può compilare**; le due «mancanze» (portata del dumper, tempi del ciclo) sono
rifiuti dichiarati, non buchi — un numero inventato in meno.


---

## Ricerca del 2026-09-04 — chi c'è in cava: presenze, appello ed evacuazione (metà sul mondo)

⛔ **Nessuna pagina primaria è stata letta**: ogni articolo, obbligo o prodotto
citato in questa sezione viene da risultati di ricerca (`WebSearch`) ed è di
**SECONDA MANO**. `WebFetch` e `curl` restano bloccati (`EGRESS_BLOCKED`/403) e
non sono stati usati per aggirare il limite.

### Già scritto (per non ripeterlo)

La ricerca del 01/08 e del 06-14/08 in questo stesso file copre già, e non
viene ripetuto qui:
- **l'appello a tre stati** (presente/assente/da spuntare) e le **presenze**
  con `entrata`/`uscita` di Campo, con la mancanza confermata «orari per
  persona non sempre compilati» (righe 61, 79, 98, 108, 114, 169, 211, 236,
  242, 255, 260, 297, 539);
- **D.Lgs 624/1996 art. 20** (direttore responsabile e sorvegliante, denunce
  di esercizio) e **DPR 128/1959 art. 64.1.20** (il sorvegliante visita i
  luoghi di lavoro almeno una volta a turno e a fine turno accerta che
  **nessun dipendente sia rimasto** in cava senza autorizzazione) — righe
  919-937, 1113-1118;
- il **glossario** con sorvegliante, preposto, capo cava, cavatore, appello,
  presenze, passaggio di consegne (righe 1110-1174);
- il passaggio di consegne come **orario di lavoro** (Cass. ord. 20787/2024).

Questa ricerca **non ripete** quella parte e si concentra su ciò che non era
ancora stato cercato: la **gestione delle emergenze e dell'evacuazione**
(D.Lgs 81/2008), il **tesserino di riconoscimento** e le regole per
**appaltatori e visitatori**, e i **software di mustering/appello
d'emergenza** — nessuno dei quali compariva prima in questo file (verificato
con `grep -ciE 'mustering|tesserino|evacuazione|geofence' docs/RICERCA_CONTINUA_CAMPO.md`
sul contenuto precedente a questa sezione: `evacuazione` compariva solo nel
titolo del blocco 14/08 sul rapporto di turno, mai nel corpo; `mustering`,
`tesserino`, `geofence` a zero).

---

### 1. La norma (seconda mano, fonte con URL, fiducia)

| Norma / voce | Che cosa dice (seconda mano) | Fonte | Fiducia |
|---|---|---|---|
| **D.Lgs 81/2008, gestione emergenze** (artt. 18, 43, 46; DM 2 settembre 2021) | Il datore di lavoro designa **preventivamente** i lavoratori incaricati di prevenzione incendi/lotta antincendio, evacuazione, salvataggio, primo soccorso e gestione dell'emergenza; la designazione è **obbligatoria** e il lavoratore designato **non può rifiutarla** salvo giustificato motivo. Il piano di emergenza ed evacuazione è previsto per le attività con **10 o più dipendenti** o soggette a controllo dei Vigili del Fuoco, ed è redatto dal datore di lavoro con l'RSPP e gli addetti alle emergenze, tenendo conto di struttura, tipo di attività, turni, **eventuale presenza di persone esterne** e composizione della squadra di emergenza. | https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/il-decreto-81/2008-gli-addetti-alla-gestione-delle-emergenze-AR-13905/ , https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/emergenze-obblighi-del-datore-di-lavoro-diritti-dei-lavoratori-AR-17560/ , https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/piano-di-emergenza-ed-evacuazione | Media (divulgatori di settore, non il testo del decreto) |
| **Prove di evacuazione — periodicità** | L'obbligo di svolgere la prova di evacuazione ricorre con cadenza **almeno annuale** in tutte le aziende soggette al piano di emergenza; se emergono carenze gravi, dopo la correzione va fatta **un'ulteriore esercitazione**. Settori con regole proprie possono chiedere di più (es. scuole, DM 26/08/1992: almeno **due volte l'anno**). | https://www.edafos.it/prevenzione-incendi-antincendio/prove-di-evacuazione-ogni-quanto-farle/ , https://studioessepi.it/magazine/sicurezza-sul-lavoro/prove-di-evacuazione-obbligatorie-cosa-dice-la-legge/ | Media |
| **D.Lgs 624/1996** (industrie estrattive) | Copre sorvegliante/direttore e DSS (già in questo file); **non è stata trovata**, in questa ricerca, una fonte che leghi esplicitamente il 624/96 a una procedura di appello/mustering — l'obbligo di «accertare che nessuno sia rimasto» (DPR 128/59 art. 64.1.20, già censito) resta il punto normativo più vicino. | (vedi sezione «Già scritto») | — |
| **DPR 128/1959 — chi entra e chi esce** | Cercato un articolo specifico su un **registro di entrata/uscita dal sotterraneo**: i risultati di ricerca restituiscono solo il testo (PDF) del decreto e la conferma, già censita, dell'obbligo del sorvegliante di verificare a fine turno che nessuno sia rimasto. **Non trovato con WebSearch** un articolo nominato esplicitamente come «registro presenze sotterraneo»: query usate `"DPR 128/1959 registro persone presenti cava sotterraneo entrata uscita miniera"` e una query di affinamento sull'art. 48 — nessun estratto di articolo con quel contenuto specifico è comparso nei risultati. | https://pugliacon.regione.puglia.it/documents/72607/118877/AE_LEX_IT_04_DPR128_59.pdf , https://www.edizionieuropee.it/law/html/35/zn64_01_020.html | Bassa (non trovato, non dedotto) |
| **Tesserino di riconoscimento — art. 18 c.1 lett. u) D.Lgs 81/2008** | Il datore di lavoro, per le attività in appalto o subappalto, deve munire i lavoratori di un **apposito tesserino di riconoscimento**, corredato di **fotografia**, contenente le generalità del lavoratore e l'indicazione del datore di lavoro; si applica a cantieri, fabbriche, aziende ed enti pubblici. La **Legge 136/2010** vi aggiunge la **data di assunzione** e, in caso di subappalto, gli estremi dell'autorizzazione. L'obbligo del datore (art. 18 c.1 lett. u) è **distinto e indipendente** da quello del lavoratore di esporlo (art. 20 c.3). | https://www.puntosicuro.it/edilizia-C-10/tesserino-di-riconoscimento-per-tutti-i-lavori-in-appalto-subappalto-AR-10247/ , https://rsumodisitalia.altervista.org/index.php/wiki/415-il-tesserino-di-riconoscimento-per-i-lavoratori , https://www.eclogaitalia.it/badge-di-cantiere-obblighi-ed-evoluzione-normativa/ | Media |
| **Art. 26 D.Lgs 81/2008 — DUVRI e appaltatori** | Quando un'impresa esterna interviene in appalto/subappalto, va redatto il **DUVRI** (Documento Unico di Valutazione dei Rischi da Interferenze) per le interferenze fra le attività dell'appaltatore e quelle del committente; il datore di lavoro appaltatore/subappaltatore deve indicare esplicitamente al committente il **personale che svolge la funzione di preposto**. Esenzioni: servizi intellettuali, mera fornitura di materiali senza installazione, lavori/servizi ≤ **5 uomini-giorno** (con eccezioni per rischi alti). Dal 2021 esiste anche un **DUVRI "ricognitivo"** (art. 26 c.3-ter). | https://www.puntosicuro.it/duvri-C-68/duvri-gli-obblighi-derivanti-dall-art.-26-del-d.lgs.-81/2008-AR-14278/ , https://twind.io/it/articolo-26-coordinamento-appaltatori-guida-completa/ , https://www.ilaonline.net/duvri-ricognitivo-art-26-comma-3-ter-del-d-lgs-n-81-2008-pillole-di-vigilanza-tecnica/ | Media |
| **Libro Unico del Lavoro (LUL)** | Introdotto dall'art. 39 D.L. 112/2008, sostituisce libro matricola/paga/presenze; è il documento con cui si dimostra la conformità a orario, riposi, straordinari e assenze. La compilazione (anche delle presenze) va fatta **entro la fine del mese successivo** a quello di riferimento; conservazione **almeno 5 anni**; sanzione da **150 a 1.500 €** per lavoratore in caso di irregolarità. Sul metodo: **nessuna legge italiana impone oggi la rilevazione giornaliera** dell'orario ai datori privati — un punto che contrasta con la tendenza europea (vedi riga sotto). | https://www.annacortesi.it/libro-unico-del-lavoro-e-registrazione-delle-presenze/ , https://www.zeitgroup.com/rilevazione-presenze-dipendenti-obbligo-legge/ , https://nobadge.it/blog/obbligo-rilevazione-presenze-normativa | Media |
| **CGUE, causa C-55/18 (CCOO c. Deutsche Bank), 14/05/2019** | La Grande Sezione ha stabilito che gli **Stati membri devono imporre ai datori di lavoro** un sistema **oggettivo, affidabile e accessibile** per misurare la durata dell'orario di lavoro giornaliero di ciascun lavoratore. **Il legislatore italiano non ha ancora recepito** formalmente la sentenza con una norma specifica; i principi sono comunque vincolanti nell'ordinamento e i giudici li applicano nei contenziosi. | https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:62018CJ0055 , https://www.fluida.io/blog/obbligo-registrazione-orario-di-lavoro-la-sentenza-della-corte-di-giustizia-europea-e-i-cambiamenti-previsti-in-italia/ | Media |
| **Statuto dei Lavoratori, art. 4 + GDPR** | Se lo strumento di rilevazione presenze (badge, geolocalizzazione) **può consentire, anche indirettamente**, il controllo a distanza dell'attività lavorativa, serve un **accordo sindacale** (o l'autorizzazione dell'Ispettorato del Lavoro). Per i sistemi GPS su cantiere: il GPS dovrebbe registrare la posizione **solo al momento della timbratura** (per certificare la presenza sul cantiere), non tracciare il movimento continuo del lavoratore; serve comunque informativa privacy, base giuridica GDPR e, dove serve, l'accordo/autorizzazione art. 4. | https://www.pivatoeassociati.it/news/rilevazione-presenze-e-privacy-guida-completa-alla-conformita-gdpr-e-statuto-dei-lavoratori , https://www.geoclever.it/articoli-blog/controlli-a-distanza-lavoratori/ , https://cantiericloud.com/blog/rilevazione-presenze-cantiere-edile-app | Media |

⚠️ Il **D.L. 159/2025 art. 15** sui mancati infortuni e la sua natura di
decreto legge (già censiti il 14/08) restano validi e non sono stati
riverificati in questa tornata.

---

### 2. La pratica: l'appello, il punto di raccolta, i terzi

- **Chi fa l'appello e come**: durante l'evacuazione gli addetti alle
  emergenze (nominati ex D.Lgs 81/08) prendono il **registro presenze** e si
  recano al **punto di raccolta**, dove all'arrivo dei lavoratori iniziano
  l'appello per verificare che tutti siano presenti; **in caso negativo
  iniziano le ricerche**. La gestione della modulistica include la
  compilazione del **registro presenze al punto di raccolta**, da consegnare
  ai Vigili del Fuoco (lista assenti) — [seconda mano: Frareg, PuntoSicuro,
  Sicurezza Tirelli]. https://sicurezzatirelli.it/addetti-alle-emergenze-blog/ ,
  https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/piano-di-emergenza-antincendio-allarme-evacuazione-procedure-AR-23832/
- **Il «non so» va cercato, non contato come assente**: nessuna fonte lo dice
  in questi termini espliciti (il principio compare già come regola del
  fondatore in questo repository), ma la logica dell'appello descritta sopra
  — «in caso negativo iniziano le ricerche» — è coerente con quel principio:
  un nominativo senza riscontro **al punto di raccolta** genera una ricerca,
  non una spunta.
- **Il totem/appello automatico** (prodotto italiano reale, non un
  concetto astratto): la piattaforma **Indaco Project (EVAplan)** offre
  «appello automatico in caso di evacuazione aziendale» e un **totem per
  evacuazione** al punto di raccolta, con richiamo esplicito al «Testo Unico
  per la Sicurezza sul Lavoro 81/08» per l'obbligo di stampare in tempo
  reale la lista degli assenti da consegnare ai Vigili del Fuoco —
  [seconda mano: Indaco Project, materiale commerciale].
  https://www.indacoproject.it/eventi-news-indaco/evaplan-appello-automatico-in-caso-di-evacuazione-aziendale ,
  https://www.indacoproject.it/prodotti/safety-security/totem-per-evacuazione-aziendale.html
- **Registro ingressi dei terzi (autisti, manutentori, ispettori)**: le fonti
  sui sistemi di controllo accessi di cantiere descrivono la prassi come
  **flussi «tipo»** distinti — fornitori, subappaltatori, visitatori
  istituzionali, ispettori, autisti — ciascuno con regole proprie di
  registrazione; l'accesso richiede **identificazione con documento valido**
  e **consenso alla registrazione dei dati**. Per gli autisti/trasportatori,
  l'automazione dei piazzali di carico/scarico è descritta come un modo per
  ridurre i tempi di attesa — [seconda mano: CAME, friendlyway, Openbadge].
  https://www.came.com/it/news/controllo-accessi-nei-cantieri-come-garantire-la-sicurezza/ ,
  https://friendlyway.it/gestione%E2%80%91visitatori%E2%80%91cantieri%E2%80%91logistica ,
  https://openbadge.it/
- **Turni con squadra che cambia, capoturno e sorvegliante**: non emersa
  nessuna fonte nuova rispetto a quanto già censito il 06-14/08 su
  sorvegliante/preposto/capo cava (vedi «Già scritto»); nessuna fonte
  specifica sul termine «capoturno» in cava è stata trovata in questa
  tornata (query dedicate al mustering e ai visitatori, non al ruolo).

---

### 3. I software: mustering, presenze, limiti

**Funzioni tipiche del "mustering" nei software HSE / industriali**
(Savance, Litum, FacilityOS/EmergencyOS, Invixium, Splan, Telaeris,
CrisisGo, Acre — tutti [seconda mano], nessuno provato):
- **appello automatico**: sostituisce il conteggio manuale con un
  aggiornamento in tempo reale di chi è presente, tramite riconoscimento
  facciale, lettori RFID, lettori barcode, o scansione di un documento
  (patente/passaporto);
- alcune soluzioni integrano **beacon BLE** nei badge elettronici, rilevabili
  fino a 50 metri da tablet/smartphone, per un appello automatico senza
  errori manuali;
- il **muster report** è il verbale ufficiale dell'evento: chi era presente
  a ogni punto di raccolta, quando è arrivato, chi risulta **non
  contabilizzato** — e serve sia per la gestione operativa dell'emergenza sia
  come documento di conformità dopo l'evento;
- per chi **non ha timbrato l'uscita** o risulta assente all'appello: i
  sistemi (Damstra RFID people tracking, i muster report generici) mostrano
  l'**ultima posizione nota** ricavata dall'ultimo badge/check-in registrato,
  così i soccorritori sanno dove cercare — [seconda mano: Acre, CrisisGo,
  Damstra]. https://www.acresecurity.com/blog/securely-managing-emergency-situations-with-robust-muster-reporting ,
  https://damstratechnology.com/industries/mining
- **software mining specifici** — **Damstra/Ideagen Workforce Safety**:
  piattaforma cloud per compliance della forza lavoro, controllo accessi e
  visibilità degli asset dal 2002 nel settore minerario; il modulo di
  Workforce Management, integrato col controllo accessi, registra le
  presenze e **impedisce l'ingresso** a chi non è conforme; la soluzione RFID
  è descritta come pensata apposta per localizzare un lavoratore o fare
  **mustering elettronico rapido**.
  https://damstratechnology.com/products/workforce-management-original ,
  https://worksafesystems.com/industries/mining
- **INX Sitepass**: gestione di dipendenti, appaltatori e visitatori
  dall'ingresso all'onboarding fino all'accesso al sito; check-in con QR
  code, **geofenced attendance**, controllo automatico dei documenti; blocca
  l'accesso a chi non ha completato onboarding/induzione/verifica; le
  informazioni di induzione (incluse le **mappe di evacuazione**) sono
  mostrate al momento dell'accesso.
  https://www.inxsoftware.com/sitepass/uses/onboarding/ ,
  https://mysitepass.com/solutions/visitor-management
- **SafetyCulture (ora anche Mitti)**: modulo dedicato per l'**induzione dei
  visitatori in cava** (Visitor Hazard Training for Mining Site Safety) con
  DPI richiesti, precedenza di traffico/mezzi, percorsi designati, aree
  vietate (pit/impianto), consapevolezza lockout-tagout, segnalazione
  emergenze e canali radio, limiti di velocità, obbligo di scorta, registri
  di ingresso/uscita, accesso all'inventario chimico, parcheggio e
  bloccaggio dei mezzi, prevenzione scivolamenti; check-in/out digitale con
  timestamp per tracciabilità.
  https://safetyculture.com/library/mining/visitor-hazard-training ,
  https://safetyculture.com/topics/visitor-management
- **Sotterraneo (RTLS)** — MST Global, MineARC, Wipelot, NLT Digital,
  Groundhog: reti di access point che tracciano tag attivi indossati dal
  personale; in emergenza consentono di sapere se tutto il personale è
  risalito o ha raggiunto una **camera di rifugio**, forniscono assistenza
  alla navigazione verso il passaggio sicuro più vicino, e rilevano in
  automatico situazioni pericolose (persona immobile o caduta) allertando i
  soccorritori.
  https://groundhogapps.com/rtls-real-time-location-tracking-for-underground/ ,
  https://mstglobal.com/technology/safety-tracking/
- **Limiti — privacy**: le fonti su badge/geolocalizzazione (già in tabella
  1) convergono su un punto: uno strumento che consente, **anche
  indirettamente**, il controllo a distanza dell'attività richiede accordo
  sindacale o autorizzazione dell'Ispettorato (Statuto dei Lavoratori art. 4)
  oltre a GDPR; per il GPS su cantiere la posizione dovrebbe registrarsi
  **solo al momento della timbratura**, non in modo continuo.

⚠️ **Nessun prodotto citato in questa sezione è stato provato**: le
descrizioni vengono da materiale del fornitore o da riviste/blog di settore,
cioè da fonti che descrivono ciò che il prodotto **dichiara** di fare.

---

### 4. Parole del mestiere incontrate

**appello** — il conteggio nominativo al punto di raccolta.
**punto di raccolta** — il luogo sicuro designato dove ci si riunisce in
evacuazione.
**mustering** — il termine inglese equivalente, usato dai software HSE
internazionali; il **muster report** è il verbale dell'evento.
**capoturno** — non trovata una fonte italiana specifica in questa tornata
(vedi sopra); resta il termine usato in Campo, senza controprova esterna.
**sorvegliante** — già censito (D.Lgs 624/96, DPR 128/59).
**squadra (di emergenza)** — il gruppo di addetti designati per antincendio,
evacuazione, primo soccorso.
**timbratura** — l'atto di registrare l'orario (e, con geofence, la
posizione) di ingresso/uscita.
**badge** — il supporto fisico/elettronico della timbratura o dell'accesso.
**presente / assente** — gli stati dell'appello; i software distinguono un
terzo stato, **non contabilizzato / unaccounted for**, che nel vocabolario
italiano delle fonti trovate non ha un nome fisso (non ho trovato un
equivalente italiano stabile diverso da «assente» o «da verificare»).
**evacuazione** — l'atto di lasciare il luogo di lavoro per raggiungere il
punto di raccolta.
**esercitazione / prova di evacuazione** — il simulacro periodico
obbligatorio.
**induzione (visitatori)** — termine usato dai software (SafetyCulture,
Sitepass) per il briefing di sicurezza a chi entra per la prima volta.
**geofence** — il perimetro virtuale entro cui una timbratura è valida.

---

### Fonti

| URL | Che cosa dice | Fiducia |
|---|---|---|
| https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/il-decreto-81/2008-gli-addetti-alla-gestione-delle-emergenze-AR-13905/ | Designazione obbligatoria degli addetti alle emergenze, D.Lgs 81/08 | Media |
| https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/emergenze-obblighi-del-datore-di-lavoro-diritti-dei-lavoratori-AR-17560/ | Obblighi datore di lavoro su emergenze | Media |
| https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/piano-di-emergenza-ed-evacuazione | Piano di emergenza, soglia 10 dipendenti | Media |
| https://www.edafos.it/prevenzione-incendi-antincendio/prove-di-evacuazione-ogni-quanto-farle/ | Periodicità annuale prove di evacuazione | Media |
| https://studioessepi.it/magazine/sicurezza-sul-lavoro/prove-di-evacuazione-obbligatorie-cosa-dice-la-legge/ | Periodicità e casi particolari (scuole) | Media |
| https://www.puntosicuro.it/edilizia-C-10/tesserino-di-riconoscimento-per-tutti-i-lavori-in-appalto-subappalto-AR-10247/ | Tesserino art. 18 c.1 lett. u), L. 136/2010 | Media |
| https://rsumodisitalia.altervista.org/index.php/wiki/415-il-tesserino-di-riconoscimento-per-i-lavoratori | Tesserino, obbligo distinto datore/lavoratore | Media |
| https://www.eclogaitalia.it/badge-di-cantiere-obblighi-ed-evoluzione-normativa/ | Badge di cantiere, evoluzione normativa | Media |
| https://www.puntosicuro.it/duvri-C-68/duvri-gli-obblighi-derivanti-dall-art.-26-del-d.lgs.-81/2008-AR-14278/ | DUVRI, art. 26 | Media |
| https://twind.io/it/articolo-26-coordinamento-appaltatori-guida-completa/ | Art. 26, coordinamento appaltatori | Media |
| https://www.ilaonline.net/duvri-ricognitivo-art-26-comma-3-ter-del-d-lgs-n-81-2008-pillole-di-vigilanza-tecnica/ | DUVRI ricognitivo | Media |
| https://www.annacortesi.it/libro-unico-del-lavoro-e-registrazione-delle-presenze/ | LUL, obblighi presenze | Media |
| https://www.zeitgroup.com/rilevazione-presenze-dipendenti-obbligo-legge/ | Obblighi e sanzioni rilevazione presenze | Media |
| https://nobadge.it/blog/obbligo-rilevazione-presenze-normativa | Assenza obbligo di rilevazione giornaliera in Italia | Media |
| https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:62018CJ0055 | Testo sentenza CGUE C-55/18 (pagina EUR-Lex, non il PDF della sentenza) | Media |
| https://www.fluida.io/blog/obbligo-registrazione-orario-di-lavoro-la-sentenza-della-corte-di-giustizia-europea-e-i-cambiamenti-previsti-in-italia/ | Sentenza C-55/18, mancato recepimento italiano | Media |
| https://www.pivatoeassociati.it/news/rilevazione-presenze-e-privacy-guida-completa-alla-conformita-gdpr-e-statuto-dei-lavoratori | GDPR + Statuto lavoratori art. 4 su rilevazione presenze | Media |
| https://www.geoclever.it/articoli-blog/controlli-a-distanza-lavoratori/ | Controlli a distanza, art. 4 | Media |
| https://cantiericloud.com/blog/rilevazione-presenze-cantiere-edile-app | GPS solo al momento della timbratura | Media |
| https://sicurezzatirelli.it/addetti-alle-emergenze-blog/ | Prassi dell'appello al punto di raccolta | Media |
| https://www.puntosicuro.it/gestione-emergenza-ed-evacuazione-C-84/piano-di-emergenza-antincendio-allarme-evacuazione-procedure-AR-23832/ | Procedure di allarme ed evacuazione | Media |
| https://www.indacoproject.it/eventi-news-indaco/evaplan-appello-automatico-in-caso-di-evacuazione-aziendale | Prodotto italiano: appello automatico | Bassa (fonte commerciale) |
| https://www.indacoproject.it/prodotti/safety-security/totem-per-evacuazione-aziendale.html | Prodotto italiano: totem di evacuazione | Bassa (fonte commerciale) |
| https://www.came.com/it/news/controllo-accessi-nei-cantieri-come-garantire-la-sicurezza/ | Controllo accessi cantiere, flussi tipo | Media |
| https://friendlyway.it/gestione%E2%80%91visitatori%E2%80%91cantieri%E2%80%91logistica | Gestione visitatori cantieri/logistica | Bassa (fonte commerciale) |
| https://openbadge.it/ | Controllo accessi, presenze, registro visitatori | Bassa (fonte commerciale) |
| https://www.acresecurity.com/blog/securely-managing-emergency-situations-with-robust-muster-reporting | Muster report, ultima posizione nota | Bassa (fonte commerciale) |
| https://www.crisisgo.com/emergency-mustering-manager | Emergency accountability & mustering | Bassa (fonte commerciale) |
| https://litum.com/what-is-emergency-mustering/ | Definizione di mustering | Bassa (fonte commerciale) |
| https://damstratechnology.com/products/workforce-management-original | Damstra Workforce Management | Bassa (fonte commerciale) |
| https://damstratechnology.com/industries/mining | Damstra nel settore minerario | Bassa (fonte commerciale) |
| https://worksafesystems.com/industries/mining | Damstra/Worksafe mining safety | Bassa (fonte commerciale) |
| https://www.inxsoftware.com/sitepass/uses/onboarding/ | INX Sitepass onboarding | Bassa (fonte commerciale) |
| https://mysitepass.com/solutions/visitor-management | INX Sitepass visitor management | Bassa (fonte commerciale) |
| https://safetyculture.com/library/mining/visitor-hazard-training | SafetyCulture, induzione visitatori in cava | Bassa (fonte commerciale) |
| https://safetyculture.com/topics/visitor-management | SafetyCulture visitor management | Bassa (fonte commerciale) |
| https://groundhogapps.com/rtls-real-time-location-tracking-for-underground/ | RTLS sotterraneo | Bassa (fonte commerciale) |
| https://mstglobal.com/technology/safety-tracking/ | MST Global safety & tracking | Bassa (fonte commerciale) |

---

### Domande per il delta (meccanismo, non risposte)

1. In Campo, **chi decide** che una persona è «presente» al turno — chi
   compila l'appello (il capoturno? ognuno per sé?) e in che momento del
   turno lo fa (a inizio turno, durante, mai aggiornato)?
2. Che cosa fa oggi Campo di chi **nessuno ha spuntato** nell'appello: resta
   in uno stato distinto da «assente», e quello stato **compare** da qualche
   parte nel rapporto stampabile o nello schermo, o si vede solo aprendo
   l'elenco delle presenze?
3. Chi, in Campo, **conta i terzi** presenti in cava in un dato momento —
   autisti, manutentori, ispettori — o quella conta oggi non esiste per
   nessuno che non sia un operatore registrato?
4. Se dovesse esistere un «punto di raccolta» nel prodotto, **da dove
   prenderebbe l'elenco di chi dovrebbe esserci**: dall'appello del turno in
   corso, dalle presenze dell'ultimo giorno, da un'altra fonte?
5. Gli orari `entrata`/`uscita` delle presenze, quando **mancano**, sono
   trattati oggi come «non calcolabile» (coerente col principio del
   fondatore) o come un buco che qualche calcolo silenziosamente ignora?
6. Esiste già, in Campo o nel ponte con Scudo, un posto dove una persona
   «presente» nell'appello e una persona coinvolta in un **infortinio dello
   stesso turno** vengono confrontate, o è un incrocio che oggi nessuna
   funzione fa?
7. Il tesserino di riconoscimento (foto, generalità, datore di lavoro) è un
   concetto che compare in qualche form del personale di Campo o di Scudo,
   o è del tutto assente dal modello dati?
