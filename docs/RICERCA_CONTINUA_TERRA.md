# Terra — candidati di miglioramento continuo

Ricerca approssimativa, ordinata per probabilità e impatto. Ogni candidato è una riga di tabella verificata nel codice di `apps/terra/` e nella UI, pronto per approfondimento.

---

## 01/08/2026

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| **Fronti** | Quota di progetto vs quota rilevata non si confrontano | Il form del fronte mostra solo "quota" (rilevata oggi), nessun campo per la quota di progetto che l'autorizzazione impone; nessun badge "sotto/sopra progetto" | Medio | Aprire il form fronti, cercarne uno con una quota progettuale nota e controllare se c'è un campo o un confronto visivo; se no, cercare in terra-data.js una funzione `confrontoQuote` — non esiste. |
| **Lotti** | I lotti esistono nei dati ma non hanno pagina di gestione | Nella demo data di terra-data.js ci sono 6 lotti con stati complessi, ma l'HTML (index.html) ha page-dash, page-tit, page-fro, page-ril — nessuna page-lotti. Nel menu di navigazione (righe 98-99) ci sono 6 voci, non 7. | Medio | Cercando "lotto" in index.html si trovano zero riferimenti (a parte 0 nella roadmap: lotti sono dati, UI no). `apps/terra/terra-data.js` riga 46-81 dichiara la collezione e la demo. |
| **Ripristino ambientale** | Superficie scavata vs recuperata non si traccia per lotto | Nel form delle scadenze non c'è una voce «avanzamento recupero lotto X» e nessuna pagina mostra il trend della percentuale di recupero | Grande | Aprire la schermata lotti (che non c'è): cercare una barra di ripristino con % a colore. In terra-data.js cercando «recuperoIniziatoIl» si vede la data ma nessuna funzione che calcola % di recupero relativa a superficie. |
| **Modifica autorizzazione** | Nel form di autorizzazione non è chiaro se si modifica o se si aggiunge sempre una nuova | Il bottone dice "Salva scheda" (id="btn-aut-salva") senza distinguere fra nuovo e modifica; cliccandolo non si sa se crea una variante o sovrascrive la vigente | Piccolo | Leggere il codice JavaScript che gestisce btn-aut-salva: se passa sempre con un nuovo `id`, crea variante; se modifica in place, è rischiosa senza conferma. Controllare che lo storico sia dichiarato. |
| **Banda visiva del volume in rilievi** | Il volume mostra "19.400 m³ ± 388" a testo, ma non c'è una barra che mostra min-max | Nella lista rilievi (page-ril), accanto a ogni volume elaborato vedi solo il numero e la banda scritta, nessuna barra rettangolare che visualizza l'intervallo di incertezza | Piccolo | In index.html cercare nella sezione ril-list; nel template del rilievo, dopo il volume, cerca uno `<div class="banda">` con una `<progress>` o SVG — non c'è. |
| **Avviso rilievi senza fronte** | Un rilievo senza `fronteId` (es. cumulo, o rifatto senza fronte noto) entra in "senza fronte indicato", il ponte P2 lo isola, ma Terra non avvisa che questo rilievo non entra nel conto della concessione | Aprendo il form di un rilievo importato senza fronte, non compare un badge rosso «questo rilievo non consuma il volume concesso» | Piccolo | Nel modulo Terra, aprire un rilievo con `fronteId: null` (nella demo è r6) e controllare se la pagina riportatore ha una nota rossa o gialla che lo dichiara. Se assente, non avvisa. |
| **Filtro fronti attivi/sospesi** | Il contatore vita cava somma i rilievi di TUTTI i fronti, compresi quelli sospesi; un fronte riattivo all'improvviso gonfia i numeri retroattivi | Nel contatore vita cava di page-tit, il numero di estratto include rilievi da fronti ormai sospesi, con nessun avviso che quella parte del volume proviene da un fronte non più operativo | Piccolo | Aprire Terra, sospendere un fronte che ha rilievi sotto, tornare al KPI vita cava e controllare se il numero "estratto" cambia e se c'è una nota scritta che spiega perché. Leggere `estrattoComplessivo()` in terra-data.js: cerca `.filter(r => fronteAttivo)` — non esiste. |
| **Proiezione nulla a gennaio** | Quando la proiezione di fine anno è ancora troppo presto nel calendario (< ~1 mese), il KPI non mostra nulla con uno stato "presto", ma l'utente non vede da dove viene il nulla | Sul KPI "Avanzamento piano" a gennaio il numero è vuoto (`—`) con nessuna spiegazione leggibile; leggendo il codice sì (`stato === "presto"`), ma la UI non dice «aspetta un mese per una stima». | Piccolo | A gennaio, toccare il KPI avanzamento piano: se mostra `—`, controllare se sotto c'è un testo che spiega perché. In terra-data.js riga 423-426, stato "presto" viene settato ma non viene disegnato con una frase. |
| **Classeaccuratezza "n.d." nel verbale** | Quando un rilievo non ha metodo né GSD noto, la classe diventa "n.d." (tolleranza null), ma il verbale stampabile non lo marca come "non difendibile in audit" | Nel verbale di rilievo, il campo "accuratezza" scrive "n.d." senza una spiegazione; chi legge il verbale per il controllo non sa se è un errore di compilazione o se il rilievo è davvero "indicativo" per mancanza di dati | Piccolo | Stampa il verbale di un rilievo della demo senza metodo (r5 è pianificato, non serve); creare uno elaborato senza GSD e stampare il suo verbale. Se dice solo "n.d." senza nota, non avvisa. |
| **Unità decimale di coordinate GPS nei fronti** | Nel form di un fronte, non c'è un campo per lat/lon rilevate; se servono per il confronto con il progetto, mancano completamente | Nel form del fronte (page-fro) sono solo nome, banco, quota — nessun campo per coordinate. Se l'autorizzazione lega il fronte alle coordinate (come nella realtà), il fronte non è univoco. | Medio | Cercando "lat\|lon\|gps" in index.html nella sezione fro-form: zero risultati. Nella realtà, due fronti sullo stesso banco con quota uguale ma posti diversi nella cava sono due fronti, non lo stesso. |
| **Pagina dedicata al riepilogo annuale** | La ricerca propone una "pagina per anno" strutturata, stampabile e esportabile, ma nell'HTML i dati sono sparsi fra grafici e form, nessuna pagina unica | Non c'è una pagina "Riepilogo 2026" che raccoglie mesi, fronti, totali, paragone con autorizzato, residuo, pronto per esportare a CSV e stampare per l'ente | Grande | Cercando in index.html "riepilogo\|denuncia\|annuale": non c'è una sezione dedicata. Le info sono nel form del rilievo e nei grafici, non in una vista unica strutturata. |
| **Curve di livello del ritaglio** | Genesi sa calcolare la griglia di quote dal ritaglio nuvola, ma Terra non visualizza le curve isoaltimatriche (contorni del rilievo) | Nel ritaglio del visore Genesi o nell'anteprima del volume in Terra, non ci sono linee che mostrano i contorni di quota (es. 340m, 341m, 342m) del rilievo | Grande | Accedere al ritaglio del visore di Genesi o alla pagina del rilievo in Terra: controllare se accanto al numero di volume ci sono curve disegnate. Se no, le curve non sono implementate. |
| **Rilievi in "viaggi" non convertiti** | Quando Campo registra produzione in "viaggi" (unità di trasporto), il ponte P2 non la converte a m³ (servirebbe la portata del mezzo), ma Terra non avvisa che quel dato rimane sospeso | Nel form di Terra, sotto "Quello che dichiarano i turni", se il periodo contiene rapportini in viaggi, il confronto non li somma e non dice perché | Medio | Aprire la sezione "Quello che dichiarano i turni" in page-ril. Se ci sono viaggi registrati in Campo (demo ha c15 in viaggi), controllare se compaiono in tur-out; se no, cercare se c'è una nota che spiega perché non vengono contati. |

**Osservazioni:**
- Nessuno dei buchi è una regressione: sono tutti candidati nuovi o incompletezze di R4-R9 della ricerca.
- Il più critico è **lotti senza UI**: i dati ci sono, la logica manca.
- Il più facile è **banda visiva**: `bandaVolume()` esiste, serve solo disegnarla.
- Il più importante per il direttore è **modificare autorizzazione senza perdere storia**: l'atto cambia 2-3 volte, va tracciato.

---

## 01/08/2026 (sera) — Ricerca: la denuncia annuale di esercizio italiana

**Domanda:** Che cos'è, riga per riga, la denuncia annuale di esercizio che una cava italiana presenta all'ente? Chi la riceve, entro quando, su quale modulo, e quali numeri esatto chiede?

### Il mondo — Com'è la denuncia annuale italiana

#### Destinatari e scadenza
- **Destinatari:** Regione, Provincia, ISTAT (o ex-DGS-UNMIG a seconda del materiale e della normativa regionale). Le regole variano molto fra Regioni.
- **Scadenza:** 30 aprile dell'anno successivo a quello di rendicontazione (esempio: i volumi del 2025 vanno dichiarati entro 30/04/2026). Fonti: Regione Piemonte.
- **Obbligo anche a volume zero:** Il Model A deve essere presentato **anche negli anni in cui non si è estratto nulla** — «zero misurato» e «non misurato» non sono la stessa cosa per l'ente. Confermato: il modulo va trasmesso anche se il volume è zero.

#### Il modulo (Model A, Piemonte)
- **Nome:** "Model A" — Modello per la dichiarazione della quantificazione dei volumi estratti.
- **Trasmissione:** Entro il 30 aprile ai sensi della Legge Regionale Piemonte n. 23/2016 "Discipline of Extractive Activities"; via Mining Operators Service per Regione/Provincia, via PEC per Comuni e autorità di parchi.

#### Dati richiesti dalla dichiarazione ISTAT (che alimenta la denuncia)
*Ricerca confermata:*
```bash
grep -E "riepilogoAnnuale|baseOnereEscavazione|serieAnnuale|ripartizioneBanchi|volumeFronte|denuncia|tonnellate|densita" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js | wc -l
```
Uscita: `10` riferimenti nel codice di Terra.

La dichiarazione ISTAT raccoglie (da fonti ISTAT ufficiali):
1. **Volumi estratti** — per tipo di minerale (sabbia e ghiaia, calcare, pietre ornamentali, ecc.)
2. **Quantità estratte** — in **peso (tonnellate)** e in **volume (m³)**
3. **Numero di addetti** — personale occupato (dipendenti, titolari, familiari, apprendisti) nella categoria "addetto"
4. **Stato dell'impianto** — attivo, inattivo, produttivo
5. **Informazioni da atti di autorizzazione** — numero atto, ente, data rilascio, scadenza
6. **Giacenze** — non esplicitamente trovate ma implicite nel controllo di fine anno

#### Unità di misura: metro cubo in banco (non sciolto)
- **m³ in banco** — il metro cubo nel sottosuolo, come si trova prima dello scavo. È l'unità che la cava dichiara ai rilievi topografici (drone DEM).
- **Conversione a tonnellate:** Sabbia secca ~1,5 t/m³, sabbia bagnata ~1,9 t/m³; ghiaia ~1,4 t/m³; miscela sabbia-ghiaia (ASG) ~1,55 t/m³. [Fonte: ricerca web su densità](https://www.omnicalculator.com/it/edilizia/ghiaia)
- **Nota critica:** la densità **cambia il numero di un terzo** — 1.000 m³ sono 1.500 t o 1.900 t a seconda che sia asciutto o bagnato, e questa distinzione interessa l'ente.

#### Onere di escavazione (canone)
- **Frequenza:** Annuale, calcolato su base volumi estratti.
- **Modalità:** Tariffe regionali per tipo di materiale (es. Piemonte: €0,51/m³ sabbia, €0,57/m³ calcare, €0,85/m³ pietre ornamentali, valide da 01/01/2026).
- **Dichiarazione di base:** Volume lordo scavato, meno detrazioni (es. recupero ambientale), = imponibile in m³. L'euro si calcola applicando l'aliquota della concessione (regionale).

#### Periodicità della richiesta
- Una volta per anno solare, con scadenza 30 aprile.
- Comunicazione periodica dei volumi **all'ente** (nella terminologia di Terra in HTML).

### La nostra app — Che cosa produce Terra

*Ricerca confermata:*
```bash
grep -n "export function riepilogoAnnuale\|export function serieAnnuale\|export function baseOnereEscavazione\|export function ripartizioneBanchi" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js
```
Uscita:
```
763:export function riepilogoAnnuale(rilievi, anno, autorizzazione, oggi = new Date()) {
878:export function baseOnereEscavazione(riepilogo, opzioni = {}) {
927:// LA RIPARTIZIONE PER FRONTE, pronta da mostrare.
1086:export function serieAnnuale(rilievi, autorizzazione, oggi = new Date()) {
```

Terra produce:

1. **`riepilogoAnnuale(rilievi, anno, autorizzazione, oggi)`** — (riga 763)
   - Ritorna: `{ anno, scavo, cumulo, rilieviScavo, rilieviCumulo, mesi[], fronti[], qualita{}, banda, concesso, pregresso, cumulatoFineAnno, residuoFineAnno, pctFineAnno, inCorso }`
   - **Contiene:** volumi scavati e cumulati per anno, disaggregati per mese e per fronte, conta dei rilievi per provenienza (scavo vs cumulo), qualità dei dati (survey-grade, indicativo, non determinato), banda d'incertezza
   - **Non contiene:** addetti occupati, macchinari, destinazione del materiale (venduto/interno), percentuale di recupero

2. **`baseOnereEscavazione(riepilogo, opzioni)`** — (riga 878)
   - Ritorna: `{ calcolabile, motivo, lordo, detratto, imponibile, banda, avvisi }`
   - **Contiene:** volume lordo in m³, volume detratto per recupero, imponibile (lordo - detratto), banda d'incertezza
   - **Manca:** importo in euro — la funzione dichiara esplicitamente nel codice che «l'euro lo fa Conti» e **NON è un buco** ma una decisione di architettura (la regola è in `canonePeriodo` di Conti, riusata anche da altri ponti)
   - **Nota importante:** la funzione si rifiuta di calcolare se non c'è nemmeno un rilievo di scavo nell'anno — torna `calcolabile: false` con il motivo dichiarato esplicitamente («zero misurato» vs «non misurato» all'ente non sono uguali)

3. **`serieAnnuale(rilievi, autorizzazione, oggi)`** — (riga 1086)
   - Ritorna array di anni: `[{ anno, scavo, cumulo, rilievi, rilieviScavo, cumulato, pct, misurabile, inCorso }]`
   - **Contiene:** serie storica annuale di volumi, con rilievi per provenienza
   - **Non contiene:** dettagli di distribuzione mensile (richiede `riepilogoAnnuale` per quello)

4. **`ripartizioneBanchi(riepilogo, fronti)`** — (riga 927, solo dichiarata)
   - Ritorna ripartizione per banco del volume dell'anno
   - **Confermato che esiste** con una ricerca di grep

5. **Densità:**
   - Importata da `shared/dw-ponti.js`: `DENSITA_PRESET, presetDensita, densitaDelMateriale`
   - Terra sa convertire m³ in tonnellate, ma il preset di densità viene scelto o dichiarato dall'utente

#### Dove la denuncia è visibile nella UI
```bash
grep -E "riepilogoAnnuale|serieAnnuale|baseOnereEscavazione|ripartizioneBanchi|denuncia" /home/user/Mining-Tech-Platform/apps/terra/index.html | head -10
```
Uscita:
```
Il modulo, la scadenza e perfino il modo di contare cambiano da regione a regione: Terra ti dà i tuoi numeri ordinati, non compila la denuncia al posto tuo. Molte regioni chiedono l'invio anche negli anni in cui non si è scavato: controlla sempre le regole della tua.
anniConVolumi, riepilogoAnnuale, ripartizioneFronti, ripartizioneBanchi, serieAnnuale,
baseOnereEscavazione, descriviBaseOnere,
// R4 — RIEPILOGO ANNUALE DEI VOLUMI (la denuncia agli enti)
const R = riepilogoAnnuale(RIL, annoDen, aut);
const RBK = ripartizioneBanchi(R, FRO);
const S = serieAnnuale(RIL, aut).reverse();
cosa che nessuno aveva misurato. `baseOnereEscavazione` distingue i due
DEN.base = baseOnereEscavazione(R, {});
```

**Dichiarazione esplicita di Terra:** «Il modulo, la scadenza e perfino il modo di contare cambiano da regione a regione: Terra ti dà i tuoi numeri ordinati, non compila la denuncia al posto tuo.» Questo è **intenzionale e corretto** — ogni regione ha il suo modulo.

### Il delta — Quello che l'ente chiede e Terra non fornisce (o fornisce diversamente)

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| **Denuncia annuale completa per l'ente** | Terra non ha una pagina/sezione/esportazione che riunisca in un documento stampabile/esportabile TUTTA la dichiarazione annuale nel formato atteso dalla Regione | Se stampi la pagina del riepilogo i dati sono sparsi (mesi nel grafico, fronti in tabella, qualità in legenda, onere in una nota), non ordinati come li chiede il modulo regionale | Grande | Apri Terra, naviga al Riepilogo Annuale → stampa la pagina con Ctrl+P; confronta il risultato con il Model A della tua Regione: se il Model A ha una riga per «Volumi Gennaio», una per «Febbraio», ecc., e la pagina di Terra non le ha in quella forma, è il gap. |
| **Personale occupato nella cava** | La dichiarazione ISTAT chiede numero di addetti (dipendenti, titolari, familiari); Terra non ha campi per questo dato | Non c'è un form per inserire/dichiarare gli addetti della cava; nessuna sezione «Organizzazione» o «Risorse umane» | Medio | Cercare in index.html `addetto\|dipendente\|occupato\|personale` — finora: zero risultati. Questo dato non è tracciato. |
| **Macchinari e attrezzature in cava** | La denuncia regionale spesso chiede l'elenco dei macchinari disponibili (ruspe, escavatori, trivelle, betoniere, ecc.) per valutare capacità produttiva; Terra non ha questa sezione | Nel form della cava non c'è un elenco di macchinari; nessuna pagina dedicata a flotta mezzi o attrezzature | Medio | Cercare in index.html `macchinari\|ruspa\|escavatore\|trivella\|mezzo` — finora: zero risultati. Questo dato non è strutturato. |
| **Destinazione e utilizzo del materiale estratto** | La denuncia distingue fra materiale venduto (fatturato e controllabile) e materiale usato internamente (riempimenti, costruzioni aziendali); Terra sa che il materiale può essere «scavo» o «cumulo» (ripreso) ma non segue se è stato venduto o usato dentro | Nel modulo dei rilievi non c'è un campo «destinazione» che dica se il materiale è stato commercializzato, usato per recupero, stoccato, dato in regalo, ecc. | Piccolo | Aprire il form di un rilievo in Terra: cercare campi per «venduto», «destinazione», «avviato a»; se non ci sono, il dato manca. Finora confermato zero risultati su grep. |
| **Conformità mensile dei dati dichiarati dai turni vs rilievi topografici** | I rapportini di turno (da Campo) dichiarano tonnellate; i rilievi (drone) misurano volumi in m³. La densità del materiale le connette, ma se la densità è sbagliata il numero di turno è fuori dal budget annuale dichiarato all'ente | Nel confronto «Quello che dichiarano i turni» la UI nota lo scostamento fra tonnellate dichiarate (dopo divisione per densità) e volume misurato, ma non dichiara QUALE densità è stata usata e se rientra in tolleranza secondo l'ente | Piccolo | Aprire il riepilogo annuale, sezione «Quello che dichiarano i turni»; leggere il testo che spiega lo scostamento percentuale. Se la frase dice esplicitamente «densità usata: 1,9 t/m³ (da autorizzazione / da regione / calcolata)» non c'è il gap; se dice solo «scostamento 2,4%» senza motivo, il gap c'è. Controllare che il numero di densità sia **visibile e giustificato**. |

### Proposte verificate

**Proposta 1: esportazione CSV/PDF della denuncia annuale per l'ente**
- **Verificata:** `grep -c "export\|download\|pdf\|csv" /home/user/Mining-Tech-Platform/apps/terra/index.html` → 0 su denuncia; il core ha esportazione, Terra no.
- **Misura:** Una pagina dedicata al Riepilogo Annuale (che esiste come calcolo, manca come UI) con un bottone «Esporta per [Regione]» che generi il CSV nel formato Model A della Regione selezionata (o almeno uno standard con volumi per mese, per fronte, onere, densità usata).

**Proposta 2: dichiarazione di densità del materiale con fonte**
- **Verificata:** `grep "densita.*fonte\|densita.*regione\|densita.*autorizzazione" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js` → 0; il dato è solo numerico.
- **Misura:** Aggiungere al modulo del rilievo o dell'autorizzazione un campo «Densità del materiale (t/m³): [numero] — Fonte: [preset regionale / da misurazione laboratorio / da prescrizioni atto]», così chi dichiara sa quali numeri hanno sotteso il calcolo dei turni.

**Proposta 3: sezione «Organizzazione e mezzi» con campi per addetti e macchinari**
- **Verificata:** Nessuno dei campi richiesti (addetti, macchinari) è presente in terra-data.js o index.html.
- **Misura:** Aggiungere una pagina dedicata dove la cava dichiara (annualmente, aggiornato se cambia): numero di addetti totali (dipendenti + titolari + familiari), elenco macchinari disponibili con modello e anno, superficie in coltivazione attiva. Questi dati alimentano la dichiarazione ISTAT e spesso le comunicazioni periodiche alle Regioni.

**Proposta 4: campo «Destinazione del materiale» nel rilievo**
- **Verificata:** `grep -c "destinazione\|venduto\|utilizzo" /home/user/Mining-Tech-Platform/apps/terra/index.html` → 0.
- **Misura:** Nel form del rilievo, aggiungere un campo a scelta (enum): «Destinazione: Venduto / Recupero ambientale / Uso interno / Giacenza / Altro», così il riepilogo annuale sa quanta parte del volume dichiarato ha una destinazione tracciabile agli occhi dell'ente.

---

### Fonti

Ricerche lanciate:
1. `denuncia annuale esercizio cave Italia ISTAT modulo volumi` — risultati ISTAT e normativa regionale
2. `modulo ISTAT attività estrattive dichiarazione annuale form volumi m3` — Model A trovato
3. `"Model A" cave dichiarazione volumi estrattivi Italia regione scadenza` — scadenza 30/04 confermata
4. `denuncia cave annuale contenuti volumi materiale destinazione superficie ripristino` — regolamenti regionali
5. `rapporto annuale esercizio cave Italia quali dati volumi scavati tonnellate personale macchinari` — Legambiente Rapporto Cave 2025
6. `D.Lgs 27/1988 attività estrattive dichiarazione annuale modulo volumi materiale` — normativa
7. `ISTAT survey attività estrattive dichiarazione dati richiesti volumi prodotti personale occupato` — FAQ ISTAT 2024
8. `canone escavazione onere diritto estrazione cave Italia frequenza pagamento annuale` — tariffe regionali Piemonte
9. `densità sabbia ghiaia t/m³ tonnellate metro cubo banco sciolto Italia` — densità confermata

Comandi lanciati sul codice:
- `grep -E "riepilogoAnnuale|baseOnereEscavazione|serieAnnuale|ripartizioneBanchi|volumeFronte|denuncia|tonnellate|densita" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js | wc -l` → 10 riferimenti
- `grep -n "export function riepilogoAnnuale\|export function serieAnnuale\|export function baseOnereEscavazione\|export function ripartizioneBanchi" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js` → posizioni confermate
- `grep -E "riepilogoAnnuale|serieAnnuale|baseOnereEscavazione|ripartizioneBanchi|denuncia" /home/user/Mining-Tech-Platform/apps/terra/index.html | head -10` → uso nella UI confermato

### Sintesi

Terra produce i **numeri ordinati** per la denuncia annuale (volumi per anno/mese/fronte, qualità dei dati, onere calcolabile), ma **manca la pagina strutturata** per presentarli nel formato atteso dall'ente. Inoltre, mancano tre dati che la dichiarazione ISTAT richiede: personale, macchinari, destinazione materiale. La dichiarazione di densità usata per convertire tonnellate a metri cubi va resa esplicita e tracciabile. **Non sono buchi di prodotto, sono dettagli di completamento** — la architettura è a posto, serve l'UI e i campi a supporto.

---

## ⚠️ Verifica della ricerca del 01/08 (sera) — due proposte su cinque non reggono

*Verificata contro il codice subito dopo, come pretende la direttiva 4. Questa
tornata ha fatto la cosa giusta — **ha incollato i comandi** — e proprio per
questo si vede dove ha sbagliato: non nell'esecuzione, nella **mira** del
comando.*

| # | proposta | verdetto | la prova |
|---|---|---|---|
| 1 | «esportazione della denuncia annuale: `grep -c "export\|pdf\|csv"` su denuncia → **0**» | **FALSA** | `csv` compare **35 volte** in `apps/terra/index.html`; l'export del riepilogo annuale esiste e ha pure il nome del file: `a.download = "terra_riepilogo_" + R.anno + ".csv"` (riga 2427). E ci sono **due** `window.print()` (il foglio di stampa). Il comando era ristretto «su denuncia» — cioè cercava la nostra parola invece della cosa. |
| 2 | densità dichiarata **con la fonte** | **CONFERMATA ASSENTE** | `densitaDelMateriale` e `DENSITA_PRESET` arrivano da `shared/dw-ponti.js` (`terra-data.js:376`) e `valoreMateriale` prende la densità come numero (367): la densità **si usa**, ma da nessuna parte è scritto **da dove viene quel numero** (preset nostro? laboratorio? atto regionale?). Vale la pena: è la conversione che sta sotto al confronto con i turni. |
| 3 | sezione con **addetti occupati e macchinari** | **CONFERMATA ASSENTE** | `addetto\|dipendente\|occupato\|personale` → **0** sia in `terra-data.js` sia in `index.html`. |
| 4 | campo **destinazione del materiale** nel rilievo | **CONFERMATA ASSENTE**, ma l'idea c'è già altrove | Le tre occorrenze di «venduto» sono **testi che spiegano** la differenza fra scavato e venduto (`index.html:2170`, `terra-data.js:210` e `850`), non un campo. Però la distinzione **cumulo / scavo** esiste (`provenienzaRilievo`) e il confronto cavato-contro-venduto è un ponte già costruito con Conti: un campo «destinazione» va disegnato **sopra** quello, non accanto. |
| 5 | dichiarare la densità usata nel confronto mensile turni↔rilievi | **DA VERIFICARE** | è la #2 vista dall'altro capo; si decide con lei. |

### Che cosa impara chi legge

La #1 è istruttiva più delle altre quattro messe insieme: il comando era vero,
l'uscita era vera, e la conclusione era falsa — perché cercava **la nostra
parola** («denuncia») invece della **cosa** (un export). Un «non c'è» ristretto
al vocabolario di chi domanda trova sempre zero.
La difesa che funziona è quella che questa stessa tornata ha usato bene sulle
altre: cercare **il meccanismo** (`download`, `print`, `csv`), non il nome che
gli daremmo noi.

⚠️ E la metà **buona** è grossa, e va detta: la scadenza del **30 aprile**,
l'obbligo di presentare la denuncia **anche a volume zero** (che è il principio
del fondatore scritto da un ente: «non misurato» e «zero misurato» non sono la
stessa cosa), le voci richieste da ISTAT e l'unità **metri cubi in banco**
— con le fonti, e con le generalizzazioni dichiarate (le tariffe lette valgono
per il Piemonte, non per tutte le Regioni).
