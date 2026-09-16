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

---

## 07/08/2026 — Approfondimento: la dichiarazione annuale italiana (il mondo reale)

**Data della ricerca:** 07/08/2026  
**Verificato contro:** commit 78bd45a  
**Dichiarazione preliminare:** La ricerca del 01/08 ha coperto le funzioni di calcolo e i dati ISTAT. Questo blocco approfondisce: (1) chi chiede davvero la denuncia e quando; (2) il contenuto esatto di moduli regionali reali; (3) cosa manca a Terra per la compliance. Terra produce i numeri, ma manca il contesto normativo dichiarato.

### 1. Il mondo — Dichiarazione annuale di esercizio in Italia: destinatari, scadenze, moduli

#### Destinatari e periodicità (prove pubblicate)
La denuncia annuale di esercizio di una cava italiana va presentata **in copie a destinatari diversi**, con frequenza **annuale**:

1. **ISTAT** (Istituto Nazionale di Statistica)
   - **Che cosa:** Indagine sulle attività estrattive non energetiche (ISTAT, survey annuale)
   - **Scadenza:** 30 aprile dell'anno successivo (per i volumi dell'anno precedente) [fonte: Regione Piemonte, Legge Regionale n. 23/2016]
   - **Modulo:** "Model A" in Piemonte, ma il nome varia per Regione (Lombardia usa "Dichiarazione di esercizio", ecc.) — [dedotto: ogni Regione personalizza il modulo]
   - **Dati richiesti da ISTAT:** volumi estratti (m³ in banco), quantità in tonnellate, numero addetti, stato impianto (attivo/inattivo), informazioni dall'atto autorizzativo [fonte: ISTAT FAQ 2024]

2. **Ente regionale (Provincia/Regione)**
   - **Che cosa:** Dichiarazione per il calcolo del canone di coltivazione (onere di escavazione)
   - **Scadenza:** 30 aprile (confermato per Piemonte; altre Regioni possono avere termini diversi) [dedotto: VERIFICARE per ogni Regione]
   - **Dati:** volume lordo scavato, detrazioni (recupero ambientale), imponibile (base su cui calcolare l'euro)
   - **Aliquota:** tariffe regionali per m³ per materiale (es. Piemonte 2026: €0,51/m³ sabbia, €0,57/m³ calcare) [fonte: Piemonte; altre Regioni hanno tariffe diverse]

3. **Comuni/Enti di controllo (Ispettorato Miniere ex-DGS, ora suddiviso per Regione)**
   - **Che cosa:** Comunicazione periodica dello stato di esercizio
   - **Scadenza:** Dipende dalla Regione; Piemonte usa la stessa scadenza (30 aprile) [dedotto]
   - **Via:** PEC o portale regionale [dedotto]

#### Il "zero misurato" è una dichiarazione obbligatoria
Una cava che **non ha scavato nulla in un anno** deve comunque presentare la denuncia annuale, dichiarando esplicitamente che non c'è stato scavo nel periodo. Il modulo va trasmesso anche se il volume è zero — la distinzione fra "non misurato" (nessun rilievo, fermo impianto) e "zero misurato" (rilievi effettuati, non ha estratto) è rilevante per l'ente [fonte: ISTAT, principio del fondatore confermato da prassi]. ⚠️ **Una cava in fermo tecnico che non presenta la denuncia perde diritti di coltivazione** [dedotto: vincolo normativo non esplicito a Terra].

#### Unità di misura obbligatoria: metro cubo in banco
La dichiarazione deve essere in **m³ in banco** (il volume nel sottosuolo prima dello scavo), non in "m³ sciolto" (volume dopo estrazione). La densità del materiale serve a convertire in tonnellate per pagare il canone, ma il numero ufficiale è il metro cubo in banco [fonte: ISTAT, DGS/Ispettorati].

### 2. La nostra app — Cosa Terra già fa bene

*Verificato per comando nel codice di terra-data.js (linee indicate).*

| Funzione | Riga | Che cosa calcola | Stato |
|----------|------|---|---|
| `riepilogoAnnuale()` | 941 | Volumi scavati e cumulati per anno, mesi e fronti; qualità dei rilievi (survey-grade/indicativo); banda d'incertezza | ✅ Completo |
| `baseOnereEscavazione()` | 1063 | Volume lordo, detratto per recupero, imponibile; distingue "calcolabile" da "non calcolabile" | ✅ Completo (il principio "zero misurato" è dichiarato esplicitamente) |
| `serieAnnuale()` | 1510 | Serie storica annuale di volumi con rilievi per provenienza (scavo/cumulo) | ✅ Completo |
| Export CSV (Riepilogo annuale) | 2856 | Crea file CSV con mesi, fronti, banchi, confronto col concesso; celle vuote dove non misurato | ✅ Completo (segue il principio "zero misurato" vs "non misurato") |
| `descriviBaseOnere()` | 1100 | Racconta in parole la base dell'onere per il foglio stampato | ⚠️ A metà — vedi delta |
| Densità (campo atto) | 2877-2879 | Memorizza densità e sua provenienza (atto/laboratorio/preset/manuale), data e riferimento | ✅ Tracciata (ma non dichiarata nel riepilogo) |

**Terra applica correttamente il principio del fondatore:** distingue "nessun rilievo nel mese" (cella vuota nel CSV) da "rilievo fatto, volume zero" (scrive 0). Questo è il livello di rigore che ISTAT chiede.

### 3. Il delta — Quello che l'ente chiede e Terra non fornisce (o non dichiara)

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| **Riepilogo annuale — dichiarazione di densità** | Il file CSV esportato contiene volumi in m³, ma non dichiara **quale densità è stata applicata** per il calcolo dei turni (confronto cavato vs dichiarato) | Nel CSV o nel foglio stampato, accanto ai mesi scrivono "Volume: 45.800 m³" ma non scrivono "densità usata: 1,6 t/m³ (da atto / da laboratorio / da preset)" | Piccolo | Esportare il riepilogo annuale → aprire il CSV: cercare la riga con densità usata e la sua fonte. Se assente, il gap c'è. Oppure stampare il foglio: lo stesso. In terra-data.js `descriviBaseOnere()` non dichiara la densità, scrive solo volumi. |
| **Denuncia ISTAT — campo addetti occupati** | La dichiarazione ISTAT richiede il numero di addetti della cava (dipendenti, titolari, familiari, apprendisti); Terra non ha campi per questo | Nel form non c'è una sezione «Organizzazione» o «Risorsa umane»; nessun campo «Numero addetti: [_]» | Medio | Aprire Terra → cercare in tutti i form (atto, fronte, rilievo, lotto) un campo per «personale», «addetti», «dipendenti» — assente. `grep -E "addetto|dipendente|occupato|personale" apps/terra/terra-data.js` → **zero risultati** |
| **Denuncia ISTAT — parco mezzi e attrezzature** | Molte Regioni nel modulo annuale chiedono l'elenco dei macchinari disponibili in cava per valutare capacità produttiva dichiarata | Nel form della cava non c'è una sezione per i mezzi; nessuna pagina «Flotta» o «Attrezzature» | Medio | Cercare in index.html `macchinari|ruspa|escavatore|pala|trivella|mezzo` — **zero risultati**. Terra non traccia il parco mezzi (è in Flotta, non in Terra). |
| **Denuncia ISTAT — destinazione e utilizzo del materiale** | La dichiarazione distingue fra materiale venduto (fatturato) e materiale usato internamente (riempimenti, costruzioni); la norma chiede di dichiarare il volume per destinazione | Nel form del rilievo non c'è un campo «Questo materiale è stato: venduto / usato in recupero / usato internamente / in giacenza» | Piccolo | Nel form di un rilievo, cercare un campo enum per destinazione — non c'è. Il dato "venduto" è solo nel ponte P2 con Conti (è un calcolo, non una dichiarazione dell'utente). |
| **Riepilogo annuale — dichiarazione esplicita di "non misurato"** | Quando un anno non ha nessun rilievo di scavo, Terra sa che la base dell'onere non è calcolabile; il foglio stampato dichiara il motivo. Ma il CSV **non dichiara se il volume è zero o non è stato misurato** — scrive una cella vuota per il totale | Nel CSV esportato, la riga del totale annuale ha tre valori (mesi | fronti | banchi); se non c'è stato nessun rilievo di scavo, il totale dei mesi scrive una cella vuota. Non c'è una nota nel file che spieghi se è «zero misurato» o «non misurato». | Piccolo | Esportare il riepilogo annuale di un anno senza rilievi di scavo → aprire il CSV → leggere la riga `totale;Anno 2026;;0;0` — se il primo volume è vuoto, il CSV non dichiara la ragione. La pagina stampata lo spiega (`descriviBaseOnere`), il file no. |
| **Moduli regionali specifici per Regione** | Terra calcola i numeri per la denuncia ISTAT, ma non sa che i moduli cambiano per Regione (Piemonte Model A, Lombardia ha un form diverso, ecc.). Non c'è un campo «Regione di registrazione» per adattare il formato di esportazione | Nel form non c'è un campo che dice «Questa cava è in Piemonte» oppure «Lombardia». Il CSV esportato non ha un header che dichiara il modulo o la Regione | Medio | Nel form della cava o dell'atto, cercare un campo «Regione» o «Provincia» — non c'è (il modello della cava è uno solo, non è parametrizzato per Regione) |

### Proposte verificate

**Proposta 1: dichiarare la densità usata nel riepilogo annuale**
- **Verificata:** `descriviBaseOnere()` (riga 1100) scrive il volume imponibile senza dichiarare quale densità è stata applicata al rilievo. Il CSV (riga 2856) non ha una colonna per densità.
- **Misura:** Aggiungere una riga al CSV o al foglio stampato che reciti «Densità del materiale usata: [numero] t/m³ (Fonte: [atto/laboratorio/preset])», così chi legge la denuncia sa su quale presupposto il numero è stato calcolato — e sa se è difendibile in caso di controllo.

**Proposta 2: sezione «Organizzazione della cava» con campi per addetti**
- **Verificata:** Nessun campo in terra-data.js o index.html per addetti occupati, numero dipendenti, titolari, familiari.
- **Misura:** Aggiungere una pagina (o una sezione del form di atto) con campi: «Personale occupato (dipendenti): [_]», «Titolari: [_]», «Familiari: [_]», «Stagionali nella stagione (media): [_]». Questi numeri vanno dichiarati annualmente a ISTAT e sono tracciabili nei registri dell'azienda.

**Proposta 3: campo enum «Destinazione del materiale» nel rilievo**
- **Verificata:** `provenienzaDi()` distingue scavo da cumulo, ma non traccia dove il materiale **va** — è venduto? usato in recupero? in giacenza? La distinzione cumulo/scavo dice **da dove viene**, non **dove va**.
- **Misura:** Aggiungere un campo nel modulo di rilievo (enum, una sola risposta): «Destinazione: Venduto / Recupero ambientale / Uso interno / Giacenza / Altro», così la denuncia annuale può aggregare per destinazione se l'ente lo chiede.

**Proposta 4: dichiarare nel CSV il principio "zero misurato" vs "non misurato"**
- **Verificata:** Il foglio stampato (descriviBaseOnere) lo spiega, il CSV lascia la cella vuota. Chi non legge il foglio ma solo il file non sa la ragione.
- **Misura:** Aggiungere una nota in fondo al CSV che dichiara (una sola volta): «Note: le celle vuote nella colonna scavo indicano che non c'è stato nessun rilievo nel periodo; lo zero indica che il rilievo è stato effettuato ma il volume misurato era zero. La base dell'onere è calcolabile solo se c'è stato almeno un rilievo di scavo nell'anno.» Questo rende il file autoesplicativo.

### Fonti e comandi

**Verifica nel codice:**
```bash
grep -n "export function riepilogoAnnuale\|export function baseOnereEscavazione\|export function serieAnnuale" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js
# Uscita: 941, 1063, 1510

grep -n "\.download.*terra_riepilogo\|descriviBaseOnere" /home/user/Mining-Tech-Platform/apps/terra/index.html
# Uscita: riga 2856 export CSV, descriviBaseOnere importato

grep -E "addetto|dipendente|occupato|personale" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js /home/user/Mining-Tech-Platform/apps/terra/index.html
# Uscita: zero risultati (addetti non tracciati)

grep "densitaFonte\|densitaQuando\|densitaRiferimento" /home/user/Mining-Tech-Platform/apps/terra/terra-data.js
# Uscita: riga 14-23 nella collezione autorizzazioni, poi non dichirata nel riepilogo
```

**Ricerche effettuate (il mondo):**
1. ISTAT attività estrattive — survey annuale, modulo, scadenza 30 aprile, volumi richiesti [fonte: ISTAT FAQ, prassi regionale]
2. D.Lgs 27/1988 — normativa quadro attività estrattive [dedotto: normativa di riferimento nazionale]
3. Regione Piemonte, Legge Regionale n. 23/2016 — modello A, scadenza, oneri [fonte: LR, confermato 01/08]
4. Canone di coltivazione — tariffe regionali, periodicità annuale [fonte: Piemonte 2026; altre Regioni variano]
5. Densità materiali estratti — conversione m³ ↔ tonnellate per tipo (sabbia 1.5-1.9, ghiaia 1.4, ecc.) [fonte: pratiche di industria estrattiva]
6. Zero misurato vs non misurato — principio ISTAT: la denuncia va presentata anche a volume zero [fonte: principio del fondatore, confermato da ISTAT]

### Sintesi per Terra

Terra ha l'**infrastruttura giusta** per la denuncia annuale:
- Calcola volumi disaggregati per anno, mese, fronte, banco, con qualità rilievi e banda
- Applica il principio "zero misurato" correttamente (cella vuota se non misurato, 0 se misurato)
- Esporta CSV e consente stampa
- Traccia densità e sua fonte nei dati, ma non la dichiara nel riepilogo

**Mancano tre cose che la normativa chiede:**
1. **Addetti occupati** — campo annuale obbligatorio in ISTAT
2. **Parco mezzi** — spesso richiesto dalle Regioni
3. **Destinazione del materiale** — per disaggregare venduto vs interno

**E una cosa che serve alla compliance:**
4. **Dichiarazione della densità usata** nel riepilogo, così il numero è tracciabile e difendibile

**Non sono buchi architetturali.** Sono dettagli di completamento — i numeri ci sono, serve dichiararli nel formato che l'ente capisce.

---

### ⏱️ Verifica del 07/08, subito dopo — e la proposta sulla densità va riscritta

Chi ha scritto il blocco qui sopra ha detto una cosa vera e ne ha dedotta una
falsa, e la seconda **stavo per correggerla io** prima di misurare. Sta qui
perché nessuno la rifaccia.

**Vero, e verificato coi comandi:**
- `grep -ci` per `addetti`, `occupati`, `dipendenti`, `parco mezzi`,
  `macchinari` su `apps/terra/terra-data.js` e `apps/terra/index.html`:
  **0 e 0 in tutti e dieci i casi**. Se sono righe obbligatorie del modulo
  annuale, la mancanza è reale.
- Il prospetto della denuncia (`fogliaStampa()`) e il secondo foglio non
  nominano mai la densità: `grep -ci densit` in tutt'e due → **0 e 0**.

**Falso come conseguenza, e questo è il punto:** «chi legge il prospetto o il
CSV non sa su quale densità poggia il confronto cavato-dichiarato». Misurato:
- il prospetto della denuncia non stampa **nessuna tonnellata** — `grep` per
  `tonnellate|ton|t/m³` fra le sue 220 righe: **zero**. È tutto in metri cubi;
- i due export CSV (`terra_riepilogo_<anno>.csv`, `terra_fronti_rilievi.csv`)
  non nominano né tonnellate né densità.

Cioè **la densità non entra in nessuno dei documenti che escono da Terra**, e
aggiungere lì la sua dichiarazione sarebbe rumore, non una correzione: una riga
che spiega su che cosa poggia un numero che quel foglio non contiene.
⚠️ E lo schermo la dichiara già: `descriviDensita` e `densitaPerEnte` sono
chiamate in tre punti della pagina (2922, 3751, 3754), e `densitaPerEnte`
esiste apposta per la domanda «questo numero regge davanti a un ispettore?».

**Dove la domanda invece vale davvero**, e resta aperta: il **ponte Terra ↔
Conti**, cioè cavato in m³ contro venduto in tonnellate. Lì la densità entra nel
conto per forza, ed è lì che va cercata la sua dichiarazione — non nel prospetto.

*(Verificato al commit `9bae83a`. La proposta originale resta scritta sopra, non
cancellata: serve a ricordare che la parte vera e la parte dedotta viaggiavano
nella stessa riga.)*


---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_terra.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

# Ricerche continue — Terra

## Ricerca del 2026-09-02 — il rilievo e la dichiarazione dei quantitativi: il mondo

### Fatti dal mondo

1. **Rilievo fotogrammetrico con drone**: il rapporto professionale contiene GSD (Ground Sampling Distance, la dimensione reale di un pixel sul terreno), punti di controllo a terra (GCP) per precisione centimetrica o sub-centimetrica, errore RMS (accettabile quando inferiore a 1-2 volte il GSD), modello 3D, ortofoto e dati per calcolo volumetrico con errori inferiori all'1% [seconda mano: geocorsi.it; ispezionicondrone.it].

2. **Laser scanner terrestre e LiDAR da drone**: precision millimetrica per scanner professionali (Faro, Riegl); LiDAR da drone consegue 2-5 cm di accuratezza assoluta in condizioni corrette. Utilizzati per DTM, curve di livello, calcoli volumetrici in tempi brevi [seconda mano: microgeo.it; ingenio-web.it; dronezero.net].

3. **Densità in banco**: calcare solido 2200-2600 kg/m³, calcare frantumato ~2240 kg/m³ (variabile per spazi vuoti); terra ~1800 kg/m³ per conversione volume-tonnellate [seconda mano: omnicalculator.com; contabilità di cantiere].

4. **Dichiarazione annuale statistica mineraria**: i titolari di autorizzazione comunicano annualmente volumi estratti (m³ o tonnellate) alle Regioni. Rilevazione nazionale ISTAT realizzata annualmente su "Pressione antropica e rischi naturali". Deadline in genere aprile dell'anno successivo [seconda mano: regione.piemonte.it; istat.it].

5. **Canone di escavazione**: calcolato su volume di materiale estratto, varia per litotipo e Regione. Piemonte: aggiornamento 2026 con L.R. 16/2025 (agosto 6, 2025), adeguamento ISTAT ogni due anni [seconda mano: regione.piemonte.it].

6. **Distribuzione geografica cave**: Lombardia 484 siti, Piemonte 434, Veneto 372, Toscana 369 (anno 2017). Lombardi produce oltre 23 milioni t, Piemonte 10,6 Mt, Veneto 9,4 Mt di sabbia e ghiaia [seconda mano: istat.it, 2019].

### Software e formati del rapporto professionale

| Software | Formato rapporto | Dati contenuti | Fonte |
|----------|-----------------|-----------------|-------|
| Pix4D | PDF, GeoTIFF, LAS, DXF | Ortofoto, nuvola di punti, DSM, volume | [seconda mano: coptrz.com; dronedesk.io] |
| DroneDeploy | PDF, GeoTIFF, LAS | Mappa 2D/3D, ortomosaico, rilievo volumetrico | [seconda mano: dslrpros.com; skyebrowse.com] |
| Agisoft Metashape | PDF, OBJ, LAS, DXF | Modello 3D, ortomosaico, nuvola di punti | [seconda mano: coptrz.com; wezom.com] |
| Propeller | PDF, DXF, LandXML | Volume, profili di scavo/riporto, rilievo | [seconda mano: dronedesk.io] |
| Carlson Suite | DXF, LandXML, ASCII | DTM, profili volumetrici, curve di livello | [seconda mano: carlsonsoft.com indicato in topgeometri.it] |
| Geocat (italiano) | DXF, WinCAD | Rilievo topografico, integrazione Carlson | [seconda mano: topgeometri.it] |

### Canone di escavazione per Regione

| Regione | Base calcolo | Aliquota indicativa | Fonte |
|---------|-------------|-------------------|--------|
| Piemonte | Volume m³ estratto per litotipo | Aggiornata 2026 (L.R. 16/2025), dettagli su foglio calcolo "Servizio Esercenti" | [seconda mano: regione.piemonte.it] |
| Nazionale (quadro) | m³ estratti da rilievo o tonnellate vendute | <50 €/m³ in alcune Regioni (simbolico), aliquote crescenti per tipo minerale | [seconda mano: quarryandconstructionweb.it] |
| Lombardia, Veneto, Toscana | Non specificato in risultati | Gestiti dai singoli enti regionali; dati ISTAT disponibili per volumi ma non tariffe pubbliche | [seconda mano: istat.it; indicatoriambientali.isprambiente.it] |

### Domande per chi ha il codice in mano

1. Chi converte il volume in banco (m³ misurati dal rilievo drone/laser) alle tonnellate da dichiarare alle Regioni, e con quale densità (2200-2600 per calcare)?
2. Come Terra concilia il volume in banco del rilievo con il peso venduto alla pesa (che è il dato fiscale della vendita)?
3. Il rilievo professionale è conservato per controlli da parte dell'ente estrattivo, e se sì con quale formato standardizzato (PDF, DXF, LandXML, nuvola LAS)?
4. Come si passa da periodicità del rilievo (mensile? trimestrale? annuale?) alle dichiarazioni regionali (scadenza aprile dell'anno dopo)?
5. Se il canone si calcola su m³ estratto, chi legge quella misura dal rilievo drone e la consegna all'amministratore per il pagamento?

---

## Ricerca del 2026-09-02 — il rilievo periodico con il drone e la dichiarazione all'ente (metà sul mondo)

### Che cosa esiste già da noi

Non verificato da questa ricerca: il delta lo fa chi ha il codice.

### I parametri del volo e l'accuratezza attesa

**GSD (Ground Sample Distance)**: GSD tipico per rilievi professionali in cava 1–2,5 cm/px (risultati: Wingtra, Propeller, JOUAV). Il calcolo dipende da altezza di volo, risoluzione sensore e lunghezza focale: GSD = (altezza volo × larghezza sensore) / (lunghezza focale × larghezza immagine) [seconda mano: wingtra.com; enterprise-insights.dji.com].

**Altezza di volo**: varia da 30 a 120 m per rilievi in cava, dipendente da GSD desiderato e da conformazione del terreno (differenze di quota riducono il GSD locale) [seconda mano: propelleraero.com; dslrpros.com].

**Ground Control Points (GCP)**: 5–8 GCP distribuiti ai vertici e al centro dell'area, oppure fino a uno solo se usato PPK; best practice: 2–4 checkpoint indipendenti per verifica [seconda mano: propelleraero.com; unmannedtechshop.co.uk; skyebrowse.com].

**RTK/PPK**: RTK (Real-Time Kinematic) offre 1–2 cm di accuratezza in tempo reale via base station; PPK (Post-Processed Kinematic) applica le correzioni dopo il volo, accuratezza identica, più robusto a interruzioni di collegamento [seconda mano: dronedeploy.com; geonadir.com; propelleraero.com].

**Sovrapposizione foto**: tipicamente 60–80% sovrapposto longitudinale e 30–40% laterale per rilievo fotogrammetrico solido [seconda mano: pix4d.com; agisoft.com].

**Accuratezza attesa**: orizzontale 1–3 cm, verticale 2–3 cm con GCP; senza GCP ma con PPK, 2–5 cm orizzontale e 5–10 cm verticale. RICS Band D/E: ±10–25 mm su dettagli, ±2–4% su volumi [seconda mano: propelleraero.com; angellsurveys.com].

### Come si confrontano due rilievi e le cause d'errore

**Differenza DEM (DEM of Difference)**: confronto tra superficie rilevata a due tempi diversi tramite sottrazione punto per punto; il risultato è una mappa di altimetrie differenziali [seconda mano: sciencedirect.com; arxiv.org].

**Superficie di riferimento**: scelta di un piano di riferimento stabile (base della cava, banco naturale) su cui agganciare i rilievi successivi; errori se il riferimento si muove o subisce assestamenti [seconda mano: provincia.pc.it; geoteasrl.it].

**Vegetazione e zone d'acqua**: cause di errore; la vegetazione nasconde il suolo e produce scarti fino a 50 cm; le zone d'acqua causano perdita di dati (riflessi, assorbimento ottico). Mitigation: use NDVI-based masking, LiDAR penetrante (quando disponibile), rilievi in stagioni a minor vegetazione [seconda mano: nature.com; arxiv.org; ncbi.nlm.nih.gov].

### Frequenza dei rilievi e rapporto all'ente

**Periodicità**: mensile, trimestrale o annuale dipende da velocità di escavazione e obbligo contrattuale; per cave in attività, controllo almeno trimestrale [seconda mano: provincia.pc.it; acqualodigiana.it].

**Stato Avanzamento Lavori (SAL)**: redatto periodicamente (mensile o per milestone), contiene quantità estratte (m³ o t), descrizione e costi; firmato da direttore lavori [seconda mano: pedago.it; ingenio-web.it; studiopetrillo.com].

**Dichiarazione all'ente**: deadline tipicamente aprile dell'anno successivo per dichiarazione annuale statistica; Piemonte: comunicazione via portale "Servizio Esercenti Minerari"; in Campania, pagamento contributi entro 31/3 o 30/9 dell'anno seguente [seconda mano: regione.piemonte.it].

### Software e forma del calcolo volumetrico

| Prodotto | Calcolo volume | Input | Output |
|----------|---|---|---|
| Pix4D | DEM + superficie riferimento = prism volume | Ortofoto, nuvola punti | m³, GeoTIFF, DXF |
| Agisoft Metashape | Point cloud → superficie → diferenza | Immagini drone → DSM/DTM | m³, LAS, OBJ, DXF |
| DJI Terra | LiDAR o fotogrammetria → DEM | Volo DJI + RTK/PPK | Ortomosaico, DEM, DXF |
| Propeller | Volume app su DSM | Immagini, GCP/RTK | m³, PDF, DXF |
| Trimble Stratus | Point cloud → superficie | Dati Propeller | m³, profili cut/fill, DXF |
| Carlson Suite | Point cloud + DTM → volume | LAS, DXF, nuvola | m³, LandXML, profili |

[seconda mano: propelleraero.com; dronedeploy.com; researchgate.net; carlsonps.com; anvil.so]

### Domande per il delta (il confronto con la nostra app)

1. Chi decide la tolleranza ammissibile per un rilievo periodico (es. ±3% o ±5 m³ su un volume calcolato)?
2. Come Terra distingue fra errore legittimo di misura (variabilità dello strumento, vegetazione residua) e variazione reale del volume?
3. Il rilievo periodico è conservato in un formato che permette il confronto automatico di due date diverse (LAS, DEM in griglia)?
4. La nostra app accetta il confine della cava come superficie di riferimento per il calcolo differenziale, o richiede un datum esterno?
5. Come Terra gestiSce la conversione automatica fra m³ in banco (dal DEM) e tonnellate dichiarabili (con quale densità per litotipo)?

### Fonti (tutte [seconda mano])

- wingtra.com/surveying-gis/ground-sample-distance/
- enterprise-insights.dji.com/blog/ground-sample-distance
- propelleraero.com/ (blog e volume calculation articles)
- dronedeploy.com/blog/what-is-the-difference-between-rtk-ppk-and-gcp-and-why-does-it-matter
- geonadir.com/rtk-explained/
- unmannedtechshop.co.uk/blogs/knowledge-base/ground-control-points-guide-drone-mapping
- skyebrowse.com/news/posts/ground-control-points-guide
- angellsurveys.com/insights/drone-mining-quarry-survey-volumetrics-guide/
- nature.com (DEM accuracy, water extraction)
- arxiv.org (DEM differencing in mining)
- ncbi.nlm.nih.gov (vegetation monitoring in mines)
- provincia.pc.it/Allegati/Livelli/Allegato%207_Rilievi%20topografici...
- acqualodigiana.it/wp/wp-content/uploads/2020/03/GARA-2020-01-RILIEVI...
- pedago.it/blog/stato-avanzamento-lavori.htm
- ingenio-web.it/articoli/stato-avanzamento-lavori...
- studiopetrillo.com/relazione-conto-finale.html
- regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale
- researchgate.net (Agisoft/Pix4D/DJI Terra comparison)
- carlsonps.com/products/carlson-photocapture
- anvil.so/post/pix4d-vs-agisoft-photogrammetry-software-comparison


### Il delta, fatto da chi ha il codice in mano (02/09, contro `8d0fb886`)

Le cinque domande, risposte aprendo `apps/terra/terra-data.js`.

1. **Chi decide la tolleranza di un rilievo** → la decide il METODO scritto sul
   rilievo, non una percentuale a mano: `classeAccuratezza(rilievo)` legge il
   metodo (RTK/PPK/GCP, con le negazioni «senza GCP» riconosciute) e il GSD
   (`grep -ci GSD apps/terra/terra-data.js` → 23, `GCP` → 14, `RTK` → 11), `bandaVolume(volumeM3,
   tolleranzaPct)` scrive la forbice, e un rilievo senza metodo ha tolleranza
   **ignota**, non zero: `incertezzaScavo` somma le tolleranze note e DICHIARA
   chi copre e chi no (misurato il 03/08 sul verbale per l'ente: 388 m³ «di
   incertezza» erano il 2 % di UN rilievo su quattro). La «± 3 %» della
   ricerca (RICS, di seconda mano) non entra: la classe la dà il metodo.
2. **Errore di misura contro variazione vera** → non si distingue con un
   numero: si distingue con la BANDA. Due rilievi consecutivi hanno ciascuno la
   propria banda, e il confronto cavato/venduto e il verbale scrivono il ± accanto
   al volume; sotto la banda una differenza non è una variazione. Vegetazione e
   acqua (`grep -ci vegetaz apps/terra/terra-data.js` → 0, `acqua` → 0) NON sono campi: sono cause
   che un rilievo dovrebbe scrivere nella nota del metodo. ⏱️ Candidato debole:
   un campo «zone escluse dal calcolo» sul rilievo; da chiedere in cava se
   qualcuno lo compilerebbe.
3. **Il formato del rilievo** → Terra conserva il VOLUME e i metadati (data,
   metodo, GSD, quota base, provenienza), non il DEM (`grep -ciE 'DEM' apps/terra/terra-data.js` → 7,
   tutti in testi/commenti). Il confronto automatico fra due date è sui volumi
   dichiarati (`rilievoPrecedente`, `serieAnnuale`), non fra superfici: il DEM
   vive nel software del drone e nel visore nuvola di Genesi (la nuvola stessa
   non entra in Firestore, §4a del piano Genesi — un LAS pesa quanto tutta
   l'organizzazione). È una scelta scritta, non una mancanza da colmare.
4. **La superficie di riferimento** → non è una domanda di Terra: il volume
   arriva già calcolato (dal drone, dal visore o a mano); Terra registra la
   quota di fondo dell'atto (`quotaFondoM`) e la quota base del ritaglio del
   visore (`quotaBase`, che quando la nuvola non è georeferenziata è `null` e
   il foglio lo dice — 13/08). Il datum resta nel software di calcolo.
5. **m³ in banco → tonnellate** → esiste da oggi in shared: `densitaDellaCava`
   (atto → laboratorio → valore tipico da verificare) e `cavatoInTonnellate`,
   che Conti usa nel Report; la densità è UNA per cava, dichiarata sull'atto,
   non «per litotipo» in un listino — chiederla due volte darebbe due risposte
   per la stessa cava (il commento di `densitaDelMateriale`).

**Il rapporto all'ente**: `riepilogoAnnuale(rilievi, anno, autorizzazione)`
(somma prudente delle bande, cumulato e residuo del titolo) e il foglio
stampato con la dichiarazione di incompletezza. I NOMI degli adempimenti per
regione e le scadenze (aprile, 31/3 e 30/9…) che la ricerca riporta sono di
seconda mano e NON vanno in nessuna schermata: è la decisione 21 di
`docs/DECISIONI_WEEKEND.md`, allargata alla dichiarazione annuale.

Riassunto: **quattro su cinque esistono (1, 2, 4, 5), il 3 è una scelta
dichiarata**; nessun numero della ricerca entra nel prodotto.

## Ricerca del 2026-09-04 (sera) — la garanzia finanziaria e la chiusura del lotto: il mondo

*Metà sul mondo, fatta con `WebSearch` (sei ricerche); `WebFetch`/`curl` non
leggono il testo primario, quindi ogni contenuto qui sotto è **[seconda
mano: risultato di ricerca]** e nessun numero o termine di legge entra in
una schermata. Tema non ancora toccato in questo documento: le tornate
precedenti coprivano il rilievo, la dichiarazione annuale e il drone.*

**Che cosa succede fuori, quando un lotto di cava finisce.**

1. **La garanzia è dimensionata sul recupero, non sullo scavo.** In Piemonte
   la Regione pubblica «linee guida per gli interventi di recupero ambientale
   dei siti di cava e relativi importi economici unitari, da utilizzare per il
   calcolo delle fideiussioni» (DGR 17-8699 del 05/04/2019, aggiornamento
   della DGR 2010), con «indirizzi in merito alla durata e alle modifiche
   delle garanzie fideiussorie (riduzioni, svincolo totale e parziale)». Cioè
   l'importo nasce da **superficie da recuperare × costo unitario per tipo di
   intervento**, e la Regione tiene il listino. [seconda mano:
   regione.piemonte.it, legislazionetecnica.it]
2. **Lo svincolo è per lotti, e lo decide un verbale.** Quando il recupero è
   fatto «per fasi (lotti), il Comune svincola solo la parte di garanzia
   corrispondente alle opere completate e certificate»; la richiesta va
   accompagnata da «una relazione che descrive le opere eseguite con
   riferimento al progetto e alle prescrizioni, e una planimetria aggiornata
   con le aree recuperate». In Lombardia (l.r. 14/1998) lo svincolo è disposto
   dal Comune «entro 90 giorni dalla richiesta, previa verifica del compimento
   delle opere di ricomposizione previste dal progetto». [seconda mano:
   risultati su bura.regione.abruzzo.it, bosettiegatti.eu, regione.lombardia.it]
3. **La fine dei lavori si comunica, e si certifica.** In Veneto (l.r.
   13/2018) il titolare «comunica alla Regione la fine dei lavori entro trenta
   giorni, allegando l'attestazione di regolare esecuzione»; poi un
   **sopralluogo** con titolare, direttore dei lavori, funzionario regionale e
   rappresentante del Comune, con verbale firmato da tutti; e sulla base del
   verbale la Giunta «svincola la garanzia» oppure convoca il titolare.
   [seconda mano: bur.regione.veneto.it, regione.veneto.it/ripristino-e-garanzie]
4. **La garanzia sopravvive alla cava.** «Una cava cessata è quella non più
   oggetto di estrazione, comprese le esaurite e quelle recuperate per le quali
   è certificato il completamento del recupero»: finché il verbale non c'è, la
   cava non è cessata e la polizza va tenuta in vita. Il recupero ambientale è
   «un vincolo spesso disatteso» (giurisprudenza citata da rgaonline.it).
   [seconda mano]
5. **Il rapporto col Codice degli appalti non c'entra.** Le ricerche sullo
   «svincolo progressivo» portano quasi solo alle garanzie definitive degli
   appalti pubblici (svincolo automatico fino al 75% con gli stati di
   avanzamento): è un altro istituto, e va tenuto fuori da Terra per non
   confondere chi legge. [seconda mano: diritto.it, lavoripubblici.it]

Fonti (tutte lette come risultati di ricerca, non come testo primario):
https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/delibera-della-giunta-regionale-n-17-8699-5-aprile-2019 ·
https://legislazionetecnica.it/node/1519701 ·
https://www.bosettiegatti.eu/info/norme/lombardia/1998_014.html ·
https://bur.regione.veneto.it/BurvServices/pubblica/DettaglioLegge.aspx?id=366192 ·
https://www.regione.veneto.it/web/energia/ripristino-e-garanzie ·
https://rgaonline.it/giurisprudenza/il-recupero-ambientale-delle-cave-un-vincolo-spesso-disatteso/ ·
https://bura.regione.abruzzo.it/sites/bura.regione.abruzzo.it/files/bollettini/2025-07-22/bollettino-speciale-numero-182-del-25-07-2025.pdf

### Il delta, fatto da chi ha il codice in mano (verificato contro il codice al commit `4df4a12a`)

Cercato per **meccanismo**, aprendo le funzioni, non per parola.

- **Chi sa in che stato è un lotto, collaudo compreso?** `STATI_LOTTO` =
  previsto → aperto → esaurito → in-recupero → **recuperato → collaudato**
  (`terra-data.js`, blocco «IL PIANO DI COLTIVAZIONE A LOTTI»); la pagina
  mette il badge «senza collaudo» su un recuperato senza `collaudatoIl`
  (`grep -n "senza collaudo" apps/terra/index.html` → 1, la riga del lotto) e
  il modulo spiega «Collaudato non è recuperato: il secondo lo dice l'azienda,
  il primo lo dice l'ente col suo verbale». **Il punto 4 del mondo c'è.**
- **Chi sa che la garanzia va tenuta viva fino allo svincolo?**
  `TIPI_SCADENZA_TERRA` ha «Fideiussione — validità o rinnovo» con la nota
  «va tenuta in vita fino allo svincolo, che di norma arriva solo dopo il
  collaudo finale» e «Collaudo finale / fine lavori — passaggio necessario per
  chiudere il cantiere e liberare la garanzia»; la dimostrazione ha la polizza
  con rinnovo annuale (`t2`). **La scadenza c'è; il legame con i lotti no**
  (vedi sotto).
- **Chi sa quanto vale la garanzia e quanta ne libera un lotto collaudato?**
  Nessuno: `grep -c "importo\|euro" apps/terra/terra-data.js` → 8, **tutte**
  sulla tariffa del canone («l'euro lo fa Conti»); `grep -n "svincol"` → 3,
  tutte in note di testo. Il mondo (punti 1-2) dice che l'importo nasce dalla
  superficie da recuperare e si svincola **per lotto**. ⚠️ Gli importi unitari
  sono un listino regionale di seconda mano e **non entrano**; quello che può
  entrare è la **dichiarazione**: sul lotto «quota di garanzia» scritta
  dall'utente dalla propria polizza, e in Piano «garanzia ancora vincolata su
  lotti non collaudati / liberabile dopo il collaudo di …», con «non
  dichiarata» dove manca. Costo medio; misura: due lotti con quota, uno
  collaudato, il Piano dice la somma dei non collaudati e dichiara il terzo.
- **Chi sa che il collaudo è stato CHIESTO?** Nessuno: `grep -c
  "collaudoChiestoIl" apps/terra/terra-data.js apps/terra/index.html` → 0 e
  0; `lo2` lo dice in una **nota libera** («Collaudo chiesto all'ente: fino al
  verbale il lotto non è chiuso»), che nessun conto legge. Il mondo (punto 3)
  distingue tre momenti — fine lavori comunicata, sopralluogo, verbale — e
  Terra ne ha solo il primo (`recuperoFinitoIl`) e l'ultimo (`collaudatoIl`).
  Candidato a costo basso: `collaudoChiestoIl` sul lotto, e nella riga del
  lotto «recuperato il … · collaudo chiesto il …» oppure «**recuperato da N
  giorni, collaudo non ancora chiesto**» — N è misurato in casa, non un
  termine di legge. Misura: un lotto recuperato senza richiesta dice i giorni;
  con la richiesta dice la data; il collaudato non dice niente.
- **Chi compone la relazione e la planimetria per chiedere lo svincolo?**
  Nessuno, in questa forma: `grep -n "^export function .*[Ll]otti"` →
  `detrazioneRecupero`, `divarioRecupero`, `rilieviFuoriDaiLotti`,
  `conformitaProgetto` — conti, non documenti. Il verbale del rilievo esiste
  (`_numRegistrato`, «Come è stato ottenuto il numero»), la dichiarazione
  annuale esiste, ma «relazione di fine lavori del lotto» (superficie, volume
  di progetto e misurato, date, rilievi che lo coprono, detrazione per
  recupero) no. Candidato a costo medio; misura: il foglio esce con gli stessi
  numeri della riga del lotto e dichiara «—» dove non è stato misurato. La
  planimetria resta fuori: Terra non disegna aree.
- **Il punto 5** (appalti pubblici) non produce nessun delta: è da tenere
  fuori, e va detto qui perché una ricerca futura non lo porti dentro.

Riassunto: **due punti su cinque esistono (collaudo come stato, garanzia come
scadenza)**, tre sono candidati **dichiarativi** — nessun importo e nessun
termine di legge entra nel prodotto. In ordine di costo: `collaudoChiestoIl`
(basso), quota di garanzia per lotto (medio), relazione di fine lavori (medio).

*Aggiornamento del 05/09 (riga scritta a posteriori, perché chi ha chiuso le
tre unità non aveva aggiornato questa): tutti e tre ✅ la notte stessa —
`collaudoChiestoIl` come data del lotto con «recuperato da N giorni, collaudo
non ancora chiesto» (`attesaCollaudo`, commit `6118fced`); la quota di
garanzia per lotto scritta dall'utente e sommata sui non collaudati
(`garanziaVincolata`, commit `80dc105c`); la relazione di fine lavori del lotto
(`relazioneLotto`, commit `a6122576`) con «che cosa manca» scritto. Prova:
`grep -c "collaudoChiestoIl" apps/terra/terra-data.js` → 5;
`grep -n "^export function \(attesaCollaudo\|garanziaVincolata\|relazioneLotto\)" apps/terra/terra-data.js`
→ 3 righe.*

## Ricerca del 2026-09-11 — lo scavo confrontato con il progetto: che cosa controlla l'ente, che cosa vendono i software (metà sul mondo)

*Strumento: `WebSearch` (funziona); `WebFetch` è bloccato, quindi **nessuna
fonte è stata letta per intero**: ogni fatto viene da un risultato di ricerca
ed è marcato `[seconda mano]`. Nessun numero di legge è entrato in una
schermata; le regole restano regionali e le imposta l'utente.*

### Fatti dal mondo [tutti di seconda mano]

- **Chi controlla che lo scavo stia dentro il progetto, in Italia.** Le pagine
  di Province e Regioni (Lecco, Vicenza, Novara, Piemonte, Città metropolitana
  di Milano): la vigilanza **amministrativa** sul rispetto del progetto
  approvato spetta al **Comune**; la **polizia mineraria** (Provincia/Regione)
  fa i sopralluoghi in cava, accerta le infrazioni, notifica le sanzioni, e
  vigila su esplosivi, attrezzature e sicurezza dei lavoratori. L'autorizzazione
  è il progetto esecutivo approvato «in conformità al piano d'area». [seconda
  mano]
- **Che cosa è un piano di coltivazione, e a che scala.** Dalle linee guida
  regionali (Valle d'Aosta) e dai progetti depositati (Sardegna, Toano, Vazzano):
  la coltivazione avviene **per fasi/lotti** con durata fissata nel decreto, con
  un **cronoprogramma per anno** (preparazione, opere, estrazione, recupero),
  **planimetrie e sezioni in scala 1:500** che mostrano le fasi, e — nei
  pluriennali — un **volume commerciabile annuo per lotto** (un esempio citato:
  ~50.000 m³/anno). Il recupero è progressivo e i lotti si chiudono in un
  ordine dichiarato. [seconda mano]
- **Che cosa vendono i software per il «progetto contro il rilevato».**
  Propeller: si importa il **disegno del pit** (KML/DXF) e lo si sovrappone
  all'ultimo rilievo per controllare **altezze dei banchi, angoli di faccia e
  avanzamento** rispetto alla specifica, e per dire quanto materiale manca al
  disegno; il confronto fra la superficie attuale e quella di progetto è la
  misura dell'avanzamento. Le guide dei rilevatori (Angell, AAI, HireDronePilot)
  aggiungono la ragione geotecnica: **banchi troppo stretti, scarpate troppo
  ripide, creste scavate oltre il limite** non sono solo un problema di
  conformità, sono un rischio di instabilità «che cresce piano e cede di
  colpo». [seconda mano, siti dei produttori e dei fornitori]
- **Quindi gli assi del confronto, fuori, sono quattro**: la **quota di
  fondo** (verticale), il **perimetro/limite di scavo** (orizzontale), la
  **geometria dei banchi** (altezza, larghezza, angolo di scarpata) e il
  **volume per lotto e per anno** contro il cronoprogramma. [deduzione dalle
  tre righe sopra]

### Fonti (risultati di ricerca, nessuna letta per intero)

- Città metropolitana di Milano, *Polizia mineraria* —
  https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/Polizia-mineraria
- Regione Piemonte, *Polizia mineraria* —
  https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/polizia-mineraria
- Provincia di Novara, *Attività estrattive — vigilanza e polizia mineraria* —
  https://www.provincia.novara.it/Ambiente/DifesaSuolo/AttivitaEstrattive/vigilanza.php
- Provincia di Lecco, *Suolo, cave e bonifiche* —
  https://www.provincia.lecco.it/elemento-amministrazione/ufficio-suolo-e-cave/
- Regione Valle d'Aosta, *Linee guida sulla documentazione da presentare* —
  https://www.regione.vda.it/allegato.aspx?pk=44927
- Regione Valle d'Aosta, *Piano di coltivazione di cava* (progetto VIA) —
  https://www.regione.vda.it/territorio/allegati/progetti_via_1259_27_D.PCC%20Piano%20di%20Coltivazione%20di%20Cava.pdf
- Comune di Toano, *Piano di coltivazione e progetto di sistemazione* —
  https://www.comune.toano.re.it/wp-content/uploads/R2.1_PSC_Fora-di-Cavola_Progetto.pdf
- Propeller, *Quarry surveying software* —
  https://www.propelleraero.com/aggregatess/
- Propeller, *How to use drone survey data on your quarry* —
  https://www.propelleraero.com/blog/how-to-use-drone-survey-data-on-your-quarry/
- Angell Surveys, *Drone mining & quarry survey guide* —
  https://angellsurveys.com/insights/drone-mining-quarry-survey-volumetrics-guide/

### Domande per il delta (sul MECCANISMO — nessuna risposta qui)

1. Chi confronta lo scavo con la **quota di fondo** del progetto, e per
   quale unità (fronte, lotto, atto)?
2. Chi confronta il **volume** scavato con quello previsto dal lotto e
   dall'anno?
3. Chi sa se un lotto è stato scavato **prima di essere aperto** dal
   cronoprogramma?
4. Chi confronta la **geometria del banco** (altezza, angolo di scarpata) con
   il progetto?
5. Chi confronta il **perimetro** dello scavo con il limite autorizzato?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `3778e399`)

Cercato per **meccanismo**, aprendo le funzioni, non per parola.

- **Domande 1, 2 e 3 — CI SONO, in una funzione sola**, e la riga «Pit
  progression monitoring» di `CONCORRENTI_TERRA` era **scaduta**: diceva
  «nessuna delle due confronta lo scavo con una geometria di progetto», ed è
  la seconda forma d'invecchiamento (vera quando scritta, poi colmata).
  `conformitaProgetto(fronti, lotti, rilievi, autorizzazione)` (`terra-data.js`)
  giudica **tre assi**: più giù del fondo autorizzato (`conformitaQuota` →
  `fondoAutorizzato`, che prende la quota di fondo dal lotto o, se manca,
  dall'atto, e la dichiara «non misurabile» senza inventare uno zero;
  `statoConformitaQuota` → oltre / al-limite / dentro / non-misurabile, senza
  soglie di guardia inventate), più di quanto il lotto prevede
  (`avanzamentoLotto`), e in un lotto che il progetto non ha ancora aperto; e
  restituisce sempre il conto dei non misurabili sui tre assi. La pagina la
  chiama sul Titolo (`grep -c 'conformitaProgetto(' apps/terra/index.html` →
  **1**), e la dimostrazione ha una quota di fondo sul lotto (335) e una
  sull'atto (300): `grep -c 'quotaFondoM:' apps/terra/terra-data.js` → **2**
  nei dati. Il volume per anno contro il cronoprogramma è la denuncia annuale
  (`riepilogoAnnuale`). **Riga di `CONCORRENTI_TERRA` corretta oggi.**
- **Domanda 4 — MANCA, ed è del mestiere.** I fronti hanno `quota` e `banco`
  ma nessuna geometria: `grep -ciE 'pendenza|scarpat|altezza (del )?banco|angolo'
  apps/terra/terra-data.js apps/terra/index.html` → **7 e 2**, e le
  occorrenze sono **tutte testi** («Verifica stabilità scarpata» nel
  dettaglio di un fronte, «rimodellamento delle scarpate» nella nota di un
  lotto): nessun campo, nessun confronto. È l'asse che Propeller vende
  («altezze dei banchi, angoli di faccia contro la specifica») e quello che
  le guide legano alla stabilità. **Delta concreto, candidato**: sul lotto
  (o sull'atto) `altezzaBancoMaxM` e `pendenzaMaxGradi` **dichiarati
  dall'utente** dal progetto (niente valori nostri: sono materia regionale e
  di progetto), sul fronte `altezzaBancoM` e `pendenzaGradi` misurati dal
  rilievo, e un verdetto nella stessa forma di `statoConformitaQuota` —
  dentro / al-limite / oltre / non-misurabile — con il conto dei non
  misurabili. Genesi conosce già l'altezza del banco della volata (`H`):
  un ponte, non un rifacimento. In roadmap come voce aperta — ✅ **e fatta lo
  stesso giorno** (`geometriaAmmessa`, `conformitaGeometria`, quarto asse di
  `conformitaProgetto`): la riga resta per il metodo, non come lavoro da fare.
- **Domanda 5 — ASSENTE, e chiede una decisione.** `grep -ciE 'fascia di
  rispetto|perimetr'` → **0 e 0** in tutt'e due i file. Confrontare il
  perimetro dello scavo con il limite autorizzato vuol dire avere una
  geometria (un poligono dell'area autorizzata e il contorno del rilievo),
  cioè entrare nel dominio dei DEM e delle ortofoto che Terra oggi riceve
  come **numeri** (il volume del rilievo), non come superfici. Non è un
  campo in più: è una decisione di prodotto (Terra legge file geometrici?).
  Dichiarato, non aperto.

## Ricerca del 2026-09-11 — secondo giro: che cosa consegna il topografo col rilievo annuale, e che cosa firma il direttore responsabile (il mondo)

⚠️ **Seconda mano, marcata**: fatta con `WebSearch` (che risponde), non con
`WebFetch` (che non legge il testo primario). Nessun numero di norma entra in
una schermata; le regole restano regionali e le imposta l'utente. Quelli qui
sotto servono a decidere il delta.

### Come va, fuori

- **Che cosa deve contenere il rilievo di un'area di cava**, da un capitolato
  provinciale (Piacenza, «Rilevamento topografico e batimetrico delle aree di
  cava»): **capisaldi fissi** individuati o materializzati attorno all'area;
  orografia, idrografia, strade, fabbricati, **limiti e riferimenti
  catastali**, alberi isolati o in filare, sempre rilevati e riportati.
  *[risultati di ricerca: provincia.pc.it]*
- **Che cosa chiede l'ente per lo stato di avanzamento**: sezioni
  longitudinali e trasversali in scala non inferiore a **1:1000** con lo
  **stato originario, lo stato attuale e lo stato finale**, e il **calcolo dei
  volumi estratti e residui** (Regolamento regionale Calabria 8/2023, di
  attuazione della L.R. 40/2009); rilievo planoaltimetrico dello stato
  attuale con sezioni (Umbria); rilievo entro sei mesi dall'approvazione del
  piano, in scala 1:1000/1:500, **georeferenziato** (Gauss-Boaga) e consegnato
  in **dwg/dxf** (Piano cave Varese). *[risultati di ricerca:
  olympus.uniurb.it, regione.umbria.it, cartografia.provincia.va.it]*
- **La statistica annuale**: chi ha un'autorizzazione di cava trasmette ogni
  anno i **dati statistici** (produzione, e — nel regolamento siciliano di
  polizia mineraria — il **numero medio degli operai**, che il sindaco riporta
  all'ufficio minerario entro il primo trimestre) attraverso un servizio
  telematico regionale (Piemonte, L.R. 23/2016, «Servizio Esercenti
  Minerari»; Lombardia, catasto cave e miniere CATCM, manuale gennaio 2026).
  *[risultati di ricerca: regione.piemonte.it, edizionieuropee.it,
  caveminiere.servizirl.it]*
- **Chi firma**: la figura della polizia mineraria è il **direttore
  responsabile** (D.P.R. 128/1959, art. 20: la denuncia di esercizio porta il
  suo nome e quello dei sorveglianti per turno, ogni cambio si denuncia
  entro otto giorni; deve essere ingegnere o perito minerario). «Direttore
  dei lavori» è la parola del cantiere edile, non della cava.
  *[risultati di ricerca: legislazionetecnica.it, edizionieuropee.it,
  puntosicuro.it]*
- **Che cosa consegna il topografo dopo un volo**: una **relazione tecnica del
  rilievo** (esiste come elaborato depositato: Volterra) con **sistema di
  riferimento** (acquisizione, riferimento ed elaborazione devono essere
  coerenti), **numero e precisione dei punti di controllo a terra (GCP)** —
  l'accuratezza assoluta del rilievo non può superare quella dei GCP, che
  vanno misurati meglio del GSD — sovrapposizioni (75–85 % frontale, 60–70 %
  laterale), strumento, data, operatore e i **residui (RMSE)**
  dell'elaborazione. *[risultati di ricerca: cloud.ldpgis.it/volterra,
  ispezionicondrone.it, 3dmetrica.it, professionedrone.com]*
- **Lo standard di accuratezza**: ASPRS «Positional Accuracy Standards for
  Digital Geospatial Data», edizione 2 versione 2 (2024): l'**RMSE è l'unica
  misura** riconosciuta; le soglie sono indipendenti da GSD, scala e
  intervallo di curva; addenda per lidar, fotogrammetria, **UAS** e obliqua.
  *[risultati di ricerca: asprs.org, support.geocue.com, lidarmag.com]*
- **Quanto sbaglia un volume da drone**, secondo chi vende il servizio:
  **2–5 %** con RTK/PPK e buona pianificazione, **1–3 %** con lidar; per i
  rapporti «difendibili in un audit» (royalty, fatturazione) **4–6 GCP**
  misurati con GNSS; un caso citato: ±2,6 % contro stazione totale. Il rilievo
  **annuale** serve a verificare i volumi estratti contro quelli autorizzati;
  le nuvole «congelano» lo stato del sito e si confrontano anno su anno
  (CloudCompare, open source); un DTM per i volumi non è un DTM per il
  progetto o per il drenaggio. *[risultati di ricerca: propelleraero.com,
  dronedeploy.com, dragonflyaerialsolutions.net, miningsurveys.com,
  3dmetrica.it, dronezero.net]*

### Fonti (risultati di ricerca, non lette per intero)

provincia.pc.it (Allegato 7, rilievi topografici aree di cava) ·
olympus.uniurb.it (Reg. reg. Calabria 8/2023) · regione.umbria.it (rilievo
planoaltimetrico stato attuale, sezioni) · cartografia.provincia.va.it (Piano
cave Varese, normativa tecnica) · regione.piemonte.it (statistica mineraria
annuale) · edizionieuropee.it (D.P.R. 128/1959 art. 20; D.P.Reg. Sicilia
7/1958) · legislazionetecnica.it (art. 20) · caveminiere.servizirl.it (CATCM
2.2.1) · cloud.ldpgis.it/volterra (relazione tecnica del rilievo a mezzo
drone) · ispezionicondrone.it · 3dmetrica.it (rilievo annuale di cava;
precisione con drone) · professionedrone.com · dronezero.net · asprs.org ·
support.geocue.com · lidarmag.com · propelleraero.com · dronedeploy.com ·
dragonflyaerialsolutions.net · miningsurveys.com.

### Domande per il delta (sul MECCANISMO, non sul nome)

1. Chi compone il verbale di un rilievo, e che cosa ci scrive: data, fronte,
   metodo, GSD, classe, banda, chi l'ha eseguito, l'atto, il confronto col
   precedente?
2. Il rilievo sa da dove viene la sua incertezza — sistema di riferimento,
   punti di controllo, RMSE — o la tolleranza è quella **tipica** di una
   classe?
3. Chi firma i fogli che escono, e con che nome?
4. Chi calcola i volumi estratti e residui e lo stato originario?
5. Chi tratta planimetrie, piano quotato, sezioni, dxf?
6. Chi risponde alla statistica annuale (produzione e addetti medi)?
7. Chi ricorda che il rilievo è annuale?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `e5e2ea6a`)

- **Domanda 1 — C'È.** `grep -cE '^export function
  (verbaleRilievo|classeAccuratezza|bandaVolume|confrontoRilievi|rilievoPrecedente)'
  apps/terra/terra-data.js` → 5. Il verbale scrive data, fronte e quota,
  scavo o cumulo, tipo di elaborato, metodo, GSD, classe con tolleranza,
  volume con banda, «eseguito da», i quattro dati dell'atto e il rilievo di
  partenza; ogni cosa che manca finisce in `nonMisurati`. Niente da
  aggiungere.
- **Domanda 2 — MANCA, ed è il delta piccolo.** Il rilievo ha sette campi
  (`grep -oE 'id="new-ril-[a-z]+"' apps/terra/index.html | sort -u` → data,
  fronte, gsd, metodo, prov, rilevatore, vol) e la tolleranza è quella della
  classe: `grep -n 'tolleranzaPct: [0-9]' apps/terra/terra-data.js` → 2 e 8,
  mentre `grep -cE 'r\.tolleranza|rilievo\.tolleranza'` → 0. Sistema di
  riferimento, capisaldi e RMSE: `grep -ciE 'epsg|gauss|etrf|sistema di
  riferimento|capisald|rmse|punti di controllo|ground control'` → modulo 2,
  pagina 0 — e le due righe del modulo sono la stessa frase del foglio, «le
  tolleranze sono valori tipici del metodo di rilievo e vanno confermate con i
  punti di controllo del rilevatore»: Terra **sa** di non averli e lo dichiara.
  Il mondo dice che il numero vero sta nella relazione del topografo (RMSE,
  GCP), ed è **quello** che il verbale dovrebbe portare quando c'è: un campo
  facoltativo con la tolleranza dichiarata dal rilevatore, la banda calcolata
  su quella, e il foglio che scrive «dichiarata dal rilevatore» invece di
  «tipica del metodo». Senza il campo, resta la classe. **Mancanza
  confermata, aperta** — un campo, una riga nel verbale, una prova.
  ✅ **FATTO lo stesso giorno, unità 93**: `tolleranzaPct` nel rilievo,
  `classeAccuratezza` con `fonte` e `tolleranzaTipica`, il verbale e la riga
  che dicono di chi è il numero. Prova: `grep -c '"rilevatore" : "classe"'
  apps/terra/terra-data.js` → 1 (la sola riga che decide). Il CSV dei rilievi
  non lo porta ancora: dichiarato in roadmap.
  ✅ E il CSV lo porta dall'unità 104: `grep -c 'provenienza;tolleranzaPct'
  apps/terra/terra-data.js` → 1.
  ⚠️ Che cosa NON entra: il sistema di riferimento e la nuvola. Terra riceve
  numeri, non superfici (vedi la domanda 5).
- **Domanda 3 — C'È, con la parola sbagliata.** I tre fogli di Terra hanno le
  righe di firma (verbale: «Il rilevatore / Il direttore dei lavori»;
  relazione di lotto e riepilogo annuale: «Il titolare / Il direttore dei
  lavori»). `grep -oiE 'direttore (responsabile|dei lavori)'
  apps/terra/index.html | sort | uniq -c` → 3 «direttore dei lavori», 0
  «direttore responsabile». La figura del D.P.R. 128 è il **direttore
  responsabile**, e così lo chiamano già Scudo (`NOMINE_RUOLI`, etichetta
  «Direttore responsabile»; le firme del fascicolo) e Sentinella (la relazione
  per l'ARPA: «Il direttore responsabile»). Tre app, due nomi per la stessa
  persona: **mancanza confermata, aperta** — tre righe, parole del mestiere.
  ✅ **FATTO lo stesso giorno, unità 93**: `grep -oiE 'direttore
  (responsabile|dei lavori)' apps/terra/index.html | sort | uniq -c` → 3
  «direttore responsabile», 0 «dei lavori»; una prova in `run-kpi` pretende
  la stessa parola nelle tre app.
- **Domanda 4 — C'È.** `grep -cE '^export function
  (riepilogoAnnuale|prospettoDenuncia|riservaResidua|estrattoComplessivo|vitaCava)'`
  → 5; lo stato originario è `estrattoPregressoM3` nell'autorizzazione
  (`grep -c` → 4). Niente da aggiungere.
- **Domanda 5 — DICHIARATO, non riaperto.** Planimetrie, piano quotato,
  sezioni, dxf: `grep -ciE 'piano quotato|stato di fatto|sezion[ei]
  topograf|\.dxf|\.dwg|planimetr'` → modulo 2, pagina 9, e sono la scadenza
  «Rilievo periodico dei lavori (planimetrie aggiornate)», i commenti «la
  planimetria resta fuori: Terra non disegna aree» e le classi `.dwg-*` dei
  grafici. È la domanda 5 della ricerca precedente (fascia di rispetto,
  perimetro): Terra legge volumi, non superfici, e se debba leggere file
  geometrici è una decisione di prodotto. Resta dichiarata.
- **Domanda 6 — DICHIARATO, chiede una decisione.** La produzione annuale
  c'è (`prospettoDenuncia`, «dichiarazione annuale dei quantitativi estratti»).
  Il **numero medio di addetti** non lo calcola nessuno: `grep -ciE 'addetti
  medi|media (degli|dei) addetti|numero medio'` → scudo 0, campo 0, terra 0.
  I dati ci sono in due app (i lavoratori di Scudo, le presenze di Campo); il
  modulo è regionale e il posto in cui comporlo (Terra, che parla all'ente,
  o Scudo, che sa chi lavora) è una scelta di prodotto. Dichiarato, non
  aperto.
- **Domanda 7 — C'È.** `grep -c 'chiave: "rilievo"' apps/terra/terra-data.js`
  → 1: il preset di scadenza del rilievo periodico esiste, con l'etichetta
  che nomina le planimetrie.

**Riassunto** — 2 mancanze **confermate e aperte**, tutt'e due piccole (la
tolleranza dichiarata dal rilevatore nel verbale; «direttore responsabile»
al posto di «direttore dei lavori» nelle tre firme), 2 **dichiarate** che
chiedono una decisione (le geometrie; la statistica degli addetti), 3 **già a
posto** (il verbale, i volumi estratti e residui, la cadenza annuale).

## Ricerca del 2026-09-11 — terzo giro: quando lo scavo esce dal progetto serve una variante — e quale (il mondo)

*Terzo giro su Terra. Strumento: `WebSearch` (sette ricerche); `WebFetch`
risponde `EGRESS_BLOCKED`: **nessuna fonte è stata letta per intero**, tutto
di seconda mano dai riassunti dei risultati. Segue la metà sul delta, fatta
da chi ha il codice in mano.*

### Come va, fuori [tutto di seconda mano]

- **La variante è materia REGIONALE, e le regioni non la definiscono allo
  stesso modo.** Il punto comune è la distinzione fra variante
  **sostanziale** (nuova autorizzazione, con il suo iter) e **non
  sostanziale** (procedura semplificata, la durata del titolo non cambia).
  Che cosa cade di qua o di là lo decide ogni legge regionale:
  · **Toscana, L.R. 35/2015 art. 23 c. 1** (dai riassunti): è sostanziale la
    variante con **difformità volumetriche oltre il 4,5 % dei volumi
    autorizzati** (se almeno 1.000 m³, con un tetto di 9.500 m³), quella
    che cambia la **configurazione finale** del sito, quella che introduce
    l'**esplosivo**, e quella che fa crescere la **garanzia finanziaria**.
    Fuori da questi casi l'autorizzazione si modifica con l'art. 19 della
    L. 241/1990, mantenendo la durata iniziale;
  · **Piemonte, L.R. 23/2016**: il «10 %» che circola è sull'**estensione
    territoriale** dei poli e dei bacini estrattivi del piano regionale (a
    parità di volumi autorizzabili), cioè un'altra grandezza — non è una
    soglia sullo scavato;
  · **Veneto, L.R. 13/2018**: i criteri per riconoscere le modifiche non
    sostanziali al progetto di coltivazione li fissa la **Giunta**, e la
    modifica non sostanziale si autorizza (o nega) sentito il Comune;
  · **Lombardia, L.R. 20/2021**: «modifiche non sostanziali» sono quelle che
    l'autorità competente giudica di effetto irrilevante sull'ambiente, con
    le modalità operative rimandate alla Giunta;
  · in più regioni le modifiche **urgenti per la sicurezza** non contano come
    variante sostanziale; le varianti fuori da vincoli paesaggistici e
    ambientali sono spesso «non sostanziali» anche ai fini della VIA.
- **Che cosa guarda l'ente**: la vigilanza sulle cave è soprattutto la
  **congruenza fra lo scavo e il progetto autorizzato** (Trentino, relazione
  di controllo sulle cave; Varese, «controllo dell'attività estrattiva» con
  computo metrico dei volumi): il rilievo topografico annuale dello **stato
  di avanzamento** si confronta con il progetto **alla stessa scala e con le
  stesse sezioni**, i capisaldi restano fissi, i volumi si computano e si
  firmano; in alcuni comuni il rilievo si fa **in presenza del tecnico
  comunale** o con perizia giurata.
- **Il mestiere**: prima di chiedere una variante il direttore
  responsabile vuole sapere **quanto** è la difformità (in m³ e in %) e su
  **quale asse** (volume, quota, perimetro, sequenza dei lotti), perché è
  quel numero — contro la soglia della sua regione — che decide se è un
  aggiornamento con una lettera o una nuova autorizzazione con VIA.

### Fonti (risultati di ricerca, nessuna letta per intero)

- Toscana: raccoltanormativa.consiglio.regione.toscana.it (L.R. 35/2015, pdf);
  olympus.uniurb.it (id 29286); regione.toscana.it, decreto 6776 del
  01/04/2026 all. B «istanza di nuova autorizzazione o variante sostanziale»;
  edizionieuropee.it § 4.3.19; arpat.toscana.it; quarryandconstructionweb.it.
- Piemonte: regione.piemonte.it (L.R. 23/2016, BU46S1); olympus.uniurb.it (id
  17012); legislazionetecnica.it; arianna.consiglioregionale.piemonte.it.
- Veneto: bur.regione.veneto.it (L.R. 13/2018, id 366192; PRAC variante NTA,
  all. B); amministrativistiveneti.it «Prime riflessioni sulla L.R. 13/2018».
- Lombardia: normelombardia.consiglio.regione.lombardia.it (L.R. 20/2021);
  legislazionetecnica.it; portale.assimpredilance.it; ancebrescia.it.
- Emilia-Romagna: demetra.regione.emilia-romagna.it (L.R. 17/1991);
  ambientediritto.it (TAR Parma 256/2011). Sicilia: ars.sicilia.it (L.R.
  6/2024 e nota di lettura 2023). Abruzzo: consiglio.regione.abruzzo.it.
- Vigilanza e rilievi: consiglio.provincia.tn.it «Controllo sullo stato di
  attuazione… cave»; cartografia.provincia.va.it «Rilievi topografici delle
  cave e controllo dell'attività estrattiva — computo metrico volumi» e
  «Normativa tecnica»; comune.modena.it (relazione tecnica di un progetto
  di coltivazione); atti.comune.parma.it (schema di convenzione);
  3dfotogram.com; exeo.it «L'autorizzazione amministrativa alla coltivazione
  di una cava»; legislazionetecnica.it (domanda di autorizzazione,
  disposizioni attuative).

### Domande per il delta (sul MECCANISMO, non sul nome)

1. **Chi dice all'utente «qui serve una variante»**, e su quali assi (volume,
   quota, geometria, sequenza dei lotti)?
2. **Chi sa se la variante sarebbe sostanziale o no** — cioè chi confronta la
   difformità con la soglia della regione?
3. **Chi calcola la difformità** in m³ e in % rispetto all'autorizzato?
4. **Dove vive una variante** una volta chiesta (una pratica con il suo
   stato?) e che cosa cambia nei conti quando viene approvata?

### Il delta, fatto da chi ha il codice in mano (11/09, verificato contro il commit `727e8b47`)

- **Domanda 1 — C'È SUL VOLUME E SULLA QUOTA, tace sugli altri due assi.**
  La pagina nomina la variante in **4 punti** (`grep -c 'chiedi una
  variante|rinnovo o variante|senza una variante' apps/terra/index.html` →
  4): la proiezione di fine anno in rosso («rallenta o chiedi una
  variante»), il volume autorizzato esaurito («fermati o chiedi una
  variante»), la soglia di guardia («prepara rinnovo o variante»), e il
  fronte arrivato al fondo («da lì non si scende più senza una variante»). I
  verdetti «oltre» della **geometria del banco** e del **lotto non ancora
  aperto** dicono che cosa non va ma non dicono la parola: piccolo delta,
  una frase per asse, nella stessa voce della domanda 2.
- **Domanda 2 — MANCA, E NON PUÒ ESSERE UN NUMERO NOSTRO.** `grep -ciE
  'sostanzial' apps/terra/terra-data.js apps/terra/index.html` → **0 e 0**.
  La soglia che separa la variante sostanziale (nuova autorizzazione) da
  quella non sostanziale (procedura semplificata) è **regionale** — in
  Toscana un 4,5 % sui volumi autorizzati [seconda mano], in Piemonte un
  10 % che però misura l'estensione dei poli, in Veneto e Lombardia un
  criterio della Giunta — quindi Terra **non la sa** e non deve inventarla.
  Quello che può fare è la stessa cosa che fa con la soglia di guardia
  (`sogliaGuardiaPct`, impostata dall'utente): un campo sull'atto,
  `difformitaSostanzialePct`, **dichiarato dall'utente dal proprio
  regolamento**, vuoto di default; quando c'è, la difformità misurata si
  confronta con lui e la pagina dice «sopra la soglia che hai dichiarato:
  la variante sarebbe sostanziale» o «sotto: non sostanziale, procedura
  semplificata — verifica col tuo regolamento»; quando manca, non dice
  niente e il suggerimento del campo spiega che dipende dalla regione,
  **senza scrivere il 4,5 %** (un numero di legge di seconda mano non entra
  in una schermata). **Mancanza confermata, aperta, piccola.**
  ✅ **FATTO l'11/09 (unità 112)**: `difformitaSostanzialePct` sull'atto,
  `difformitaVolumetrica` + `giudizioVariante` nel modulo, la riga nella
  scheda del Titolo, e la parola «variante» sulla sequenza e sul banco.
- **Domanda 3 — C'È.** La difformità in percentuale la calcolano già
  `proiezioneAnno` (`pctPiano` contro `pianificatoAnnuoM3`, con «presto»
  quando l'anno è appena cominciato) e `avanzamentoLotto(lotto, misuratoM3)`
  (percentuale del lotto, `null` senza rilievi); il cumulato contro il
  concesso (`riserveM3`) sta nel foglio per l'ente. Un «oltre del X %» è
  `pct − 100`: il numero esiste, gli manca solo la soglia con cui confrontarsi.
- **Domanda 4 — C'È COME PRATICA, e i conti non si toccano da soli — ed è
  giusto.** La collezione `piano` ha lo stato `vigente | in-esame`, e la
  dimostrazione porta «Variante fronte Sud» in esame. Quando una variante
  viene approvata i numeri nuovi (quota di fondo, volumi, scadenza) **li
  scrive l'utente sull'atto**, perché vengono dal titolo nuovo: nessun
  automatismo, dichiarato.

**Riassunto** — 1 mancanza **confermata e aperta** (la soglia della variante
sostanziale dichiarata dall'utente, più la parola «variante» sui due assi che
la tacciono), 2 a posto (chi dice «variante» sul volume e sulla quota; chi
calcola la difformità), 1 dichiarata (il piano in esame non tocca i conti).

---

## 15/09 — quinto giro di ricerca mirata: riconciliazione piano-vs-reale e margine autorizzazione

*Nota di processo: prodotta da un agente in background (mandato "prima il
mondo, poi la nostra app", fonti Datamine/K-MINE/FleetRabbit), riverificata
di persona sul codice vero prima di entrare qui. Il file è finito, per
errore di prompt, sotto il nome sbagliato (`docs/RICERCA_CONTINUA_terra.md`,
minuscolo — lo stesso incidente "sei documenti doppi" già chiuso il 05/09):
il contenuto vero è stato unito qui e il duplicato cancellato.*

**Lacuna 1 — CONFERMATA, con una sfumatura.** `proiezioneAnnua()`
(`terra-data.js:655`) dà già `pctPiano`, cioè quanto il ritmo ANNUALE si
discosta dal piano annuo — non è vero che manchi ogni "scarto piano-vs-
reale", come diceva la prima stesura della ricerca. Manca però la
granularità MENSILE che la ricerca chiedeva davvero: nessuna funzione
confronta "volume pianificato del mese" con "volume reale del mese" per
dire "avanti/indietro di N m³ questo mese". Verificato:
`grep -i "varianza\|variance\|scarto.*piano" apps/terra/terra-data.js` →
zero. Costo indicativo: una funzione che divide il piano annuo per 12 e
confronta col mese corrente di `volumiPerMese()`.

**Lacuna 2 — CONFERMATA, i dati grezzi ci sono già.** `vitaCava()`
(`terra-data.js:1074`) calcola sia `anniResidui` (anni al ritmo medio) sia,
internamente, `giorniTra(dataScadenza, oggi)` — e li confronta per dare
`scadePrimaIlTitolo` (booleano). Ma il **margine** fra i due (quanti giorni
o mesi separano l'esaurimento dalla scadenza) non è calcolato né restituito:
solo "chi arriva prima", non "di quanto". `annoEsaurimento` è un ANNO, non
una data — troppo grezzo per un margine in giorni. Non è un dato mancante
dal modulo (gli ingredienti — `anniResidui`, `dataScadenza` — sono già nel
valore di ritorno): è un calcolo in più, non una ricerca nuova.

**Lacuna 3 — CONFERMATA.** `ritmoMedioAnnuo()` (`terra-data.js:1041`)
calcola UN SOLO ritmo, sulla finestra dichiarata dall'utente (`anniRitmo`,
default 3 anni) — nessun confronto fra una finestra corta (es. ultimi 90
giorni) e quella lunga per rilevare un'accelerazione o un rallentamento.
Verificato: `grep -n "ultimi.*giorni\|trend\|accelera\|decelera" apps/terra/terra-data.js`
→ zero. Una cava che negli ultimi tre mesi ha quasi raddoppiato il ritmo
non riceve nessun avviso finché non si vede nel cumulato dell'anno.

**Riassunto** — 3 lacune **confermate**, tutte e tre nella stessa famiglia
(la riconciliazione ha i FONDAMENTALI — vita cava, proiezione annuale,
confronto con la scadenza del titolo — ma non le metriche comparative a
grana più fine: mese contro mese, giorni di margine, finestra corta contro
lunga). Nessuna è un dato nuovo da raccogliere: sono tutti calcoli
aggiuntivi sopra dati che Terra ha già in mano.

⏱️ **LA LACUNA 2 ERA GIÀ CHIUSA IL GIORNO STESSO — è la stessa famiglia del
«non c'è» scaduto, dentro la stessa sessione.** L'agente ha scritto questa
riga il 15/09 leggendo `vitaCava()` senza `margineGiorni`; un cantiere di
codice, nello stesso ciclo e nello stesso giorno (unità precedente,
`014f20b7`), l'aveva già aggiunto — la ricerca gira in background mentre
altri cantieri avanzano, e i due non si parlano finché non si confronta il
documento col codice PRIMA di scrivere. `grep -n "margineGiorni"
apps/terra/terra-data.js` → 3 occorrenze (dichiarazione, calcolo, valore di
ritorno). Nessuna azione da fare qui: la riga resta per il metodo, non come
lavoro aperto.
✅ **FATTO il 15/09 (unità di questo blocco)**: la lacuna 1,
`varianzaMensilePiano(rilievi, pianificatoAnnuoM3, oggi)` — il mese
corrente contro il piano annuo diviso 12 (dichiarato come media, non un
piano mensile vero: Terra non ne ha uno), con la stessa disciplina
dell'assenza-non-favorevole: un mese senza nessun rilievo di scavo elaborato
non è un mese a zero, è "non ancora misurato", e la funzione lo dichiara
invece di calcolare uno scarto finto. Riusa `volumiPerMese` (stessa regola
di aggregazione, non riscritta). Wired nella schermata del piano estrattivo
(`pia-mese`), accanto alla proiezione di fine anno.
✅ **FATTO lo stesso giorno**: la lacuna 3, `tendenzaRitmo(rilievi, oggi,
anni, finestraGiorni=90)` — confronta il ritmo degli ultimi 90 giorni
(default) con quello di `ritmoMedioAnnuo`. Non riscrive il calcolo: il
corpo comune (filtro solo-scavo, volume, durata, annualizzazione) è stato
estratto in un helper privato `ritmoNellaFinestra`, e sia `ritmoMedioAnnuo`
sia `tendenzaRitmo` lo chiamano — la stessa regola di `shared/` applicata
dentro un modulo solo, per non avere due copie della stessa formula che
divergono in silenzio. Soglia dichiarata `TOLLERANZA_RITMO_PCT = 20` (più
larga di quella del carburante di Flotta: il ritmo di una cava oscilla di
più — weekend, manutenzioni, cambio fronte — di un consumo di gasolio).
Wired nel riquadro "Vita della cava", solo quando accelera o rallenta in
modo misurabile (silenzio quando la finestra corta non ha abbastanza
storico: non si forza un "non lo so" su una nota secondaria).
**Il quinto giro di ricerca su Terra è ora chiuso su tutte e tre le sue
lacune.**

---

## 15/09 — sesto giro di ricerca mirata: conformità geometrica del fronte e sezioni trasversali

### Come il mondo lo fa

**Conformità geometrica**: il monitoraggio della geometria dei fronti di scavo va oltre il semplice controllo volumetrico. Nel settore estrattivo, la conformità geometrica si verifica tramite sezioni trasversali misurate a intervalli regolari lungo l'asse del fronte — **ogni 5-10 m nella fase esecutiva** [fonte: Provincia di Varese, documento normativa tecnica per cave; ANAS S.p.A., standard per rilievi di gallerie]. 

Le sezioni trasversali registrano:
- **Quota di fondo** — verifica se il banco è stato scavato fino alla profondità autorizzata (under-break: scavo insufficiente; over-break: scavo oltre il previsto)
- **Pendenza della scarpata** — verifica se l'inclinazione rimane entro i massimi stabiliti
- **Altezza del banco** — verifica la distanza fra fondo e cresta del fronte
- **Andamento lineare** — progressione della cresta (arretramento del crest) lungo l'asse

**Strumenti**: software specializzato (es. Strayos Highwall Compliance) crea modelli 3D della cava, genera profili di sezioni trasversali da rilievi fotogrammetrici, e **confronta automaticamente il profilo reale con quello del progetto**, producendo mappe di calore che identificano:
- **Crest loss** — perdita di spalla superiore (scavo troppo profondo ai margini)
- **Toe flare** — allargamento laterale del piede del fronte (over-break ai lati)
- **Over-break localizzato** — scavo oltre la quota di fondo in zone specifiche
- **Under-break localizzato** — scavo incompleto in sezioni isolate

[fonte: blog.strayos.com "Highwall Compliance"; topodrone.com "Quarry Surveying"; MDPI "Qualitative Assessment of Point Cloud from SLAM-Based MLS for Quarry Digital Twin Creation"]

### Che cosa fa Terra oggi

`conformitaGeometria(fronte, lotto, autorizzazione)` [terra-data.js:3759] confronta **due assi**:
1. **Altezza del banco**: `fronte.altezzaBancoM` vs `amm.altezza.valore` (massimo dichiarato)
2. **Pendenza**: `fronte.pendenzaGradi` vs `amm.pendenza.valore` (massimo dichiarato)

Ogni asse produce:
- `misurabile: true/false` — se il confronto è stato fatto
- `stato: "oltre" | "al-limite" | "dentro" | "non-misurabile"` — esito della conformità
- `margine` — differenza fra misurato e massimo (gradi/metri)

Visualizzazione sulla schermata [index.html:2315-2328]: "altezza 3.8 m su 5 m · pendenza 70° su 75° · massimi del lotto" — verdetto colorato "banco dentro il progetto" o "fuori progetto".

Dati misurati sono caricati come:
- `altezzaBancoM` — altezza totale del banco misurata
- `pendenzaGradi` — inclinazione misurata
- `fronteId` — identificativo del fronte
- Nessun dato per sezioni trasversali, profili, o variabilità geometrica lungo l'asse

### Il delta

| Aspetto | Nel mondo | In Terra | Costo |
|---------|-----------|----------|-------|
| **Sezioni trasversali** | Multiple (ogni 5-10 m), profili misurati a intervalli | Una sola misurazione per fronte (punto singolo) | Aggiungere storage e funzioni per profili multipli |
| **Over-break localizzato** | Rilevato e mappato in sezioni specifiche | Non monitorato (solo altezza totale) | Aggiungere confronto quota di fondo per sezione |
| **Variabilità geometrica** | Identificazione di crest loss, toe flare per zona | Non rilevata (media unica per fronte) | Funzioni di interpolazione e confronto per sezioni |
| **Reportistica** | Mappe di calore, visualizzazione spaziale, profili | Testo "altezza X su Y" · "pendenza X su Y" | UI di visualizzazione profili + export dati sezioni |
| **Automazione conformità** | Sistema identifica over/under-break per ogni sezione | Utente scrive manualmente altezza e pendenza misurate | Interfaccia per acquisire profilo trasversale da rilievo |

### Proposta per il delta

Le tre lacune costituiscono una famiglia (il "dettaglio geometrico" della conformità):

1. **Piccola**: aggiungere un campo `quotaFondoM` al fronte per monitorare over-break/under-break — non solo l'altezza totale del banco (altezza = quota cresta - quota fondo). La formula esiste già (`conformitaProgetto` legge `quotaScavoAutorizzata`), manca il confronto nel modulo. `grep -n "quotaFondo\|quotaScavo" apps/terra/terra-data.js` → funzione `conformitaQuota` (riga 3586) controlla la quota di fondo rispetto a quella autorizzata, quindi il confronto esiste già ma vive **separato** da `conformitaGeometria` (che controlla altezza e pendenza). Unificazione: `conformitaGeometria` dovrebbe includere also `quotaFondoM` o un campo merged. **Mancanza confermata**: il fronte non dichiara la quota di fondo separatamente, il modulo la deduce dall'altezza, il confronto esiste per la quota ma non è esposto nella geometria del fronte.

   ⛔ **SMENTITA (15/09, riverifica di persona prima di scrivere qualunque
   cosa in roadmap): «vive separato» è falso, e la "mancanza confermata"
   non c'è.** `conformitaQuota` e `conformitaGeometria` non sono separate:
   `conformitaProgetto` (`terra-data.js:3626`) le chiama ENTRAMBE per ogni
   fronte e le combina nello stesso oggetto riga — `{...conformitaQuota(f,
   lo, autorizzazione), geometria: conformitaGeometria(f, lo,
   autorizzazione)}` (riga 3640-3641) — cioè esattamente l'unificazione
   che la ricerca proponeva di costruire. E la pagina la usa così:
   `apps/terra/index.html:2298` sceglie il PEGGIORE fra `r.stato` (quota) e
   `(r.geometria||{}).stato` (altezza/pendenza) con `peggioreConf(...)` per
   decidere il colore della riga — un fronte fuori quota E dentro
   geometria, o viceversa, mostra comunque il colore allarmante. La
   ricerca ha guardato `conformitaGeometria` da sola e ha concluso che il
   confronto sulla quota le mancasse, senza risalire a chi la chiama
   (`conformitaProgetto`) e a come il risultato arriva alla pagina — la
   stessa famiglia di errore di "cercare il nome invece del meccanismo",
   applicata a una funzione che esiste ma **un livello più in su** di dove
   si è guardato. Nessuna azione: la funzione che questa proposta voleva
   costruire c'è già.

2. **Media**: aggiungere supporto per **sezioni trasversali multiple** — la pagina consente oggi un `fronteId` per rilievo ma non più sezioni di uno stesso fronte. Una struttura come `sezioniM3: [{distanzaM: 0, altezzaBancoM: 5.2, pendenzaGradi: 72, quotaFondoM: 345}, {distanzaM: 10, altezzaBancoM: 5.1, pendenzaGradi: 71, quotaFondoM: 344.5}, ...]` permetterebbe di rilevare variabilità. **Mancanza confermata**: nessun campo per sezioni trasversali. Il rilievo di una cava professionale le produce sempre (drone + DEM genera ortofoto + DEM ad alta risoluzione da cui si estraggono sezioni), ma Terra le scarta — tiene solo volumetria aggregata.

3. **Grande**: non è propriamente una "mancanza" di Terra bensì una scelta di **ambito di responsabilità**. Le mappe di calore e l'identificazione automatica di over-break/toe flare/crest loss richiederebbero un modello 3D della cava e funzioni di confronto geometrico che escono dal dominio di Terra (volume estratto, stato della cava, vita della concessione). La visione corretta è che Terra **acquisisce i dati** (sezioni trasversali, profili) e **un modulo di conformità geometrica** (oggi esterno, domani possibile integrazione) li analizza. Finché il modulo non esiste, l'acquisizione rimane un dettaglio opzionale.

### Riassunto

**Una lacuna confermata, una smentita, una fuori scope** (riverificato il 15/09):
1. ⛔ **SMENTITA** — «quota di fondo non unificata con la geometria»: `conformitaProgetto` le combina già entrambe per ogni fronte, e la pagina sceglie il peggiore dei due stati (`terra-data.js:3626-3641`, `index.html:2298`). Vedi la correzione qui sopra. Nessuna azione.
2. **Confermata** — Nessun supporto per sezioni trasversali multiple: il rilievo professionale le genera sempre (5-10 m di passo), Terra tiene solo un punto per fronte. Media, strutturalmente fattibile (aggiungere un array di sezioni), non ancora riverificata riga per riga sul codice di persona prima di scriverla in roadmap.
3. **Fuori scope, dichiarato dalla ricerca stessa** — mappe di calore/rilevazione automatica di crest loss/toe flare: richiedono un modello 3D di confronto geometrico che esula dal dominio di Terra (che acquisisce dati, non li analizza geometricamente). Non un cantiere.

**Fonti citate**:
- [Provincia di Varese, Piano Cave, Normativa tecnica](https://cartografia.provincia.va.it/downloads/Pianocave/pianocave_adottato/relazioni/Normativa_tecnica.pdf)
- [ANAS S.p.A., standard per rilievi in sotterraneo](https://va.mite.gov.it/File/Documento/9333)
- [Strayos, Highwall Compliance](https://blog.strayos.com/product-spotlight-highwall-compliance/)
- [TopoDrone, Quarry Surveying](https://topodrone.com/services/quarry-surveying/)
- [MDPI, Point Cloud SLAM per Digital Twin](https://www.mdpi.com/2076-3417/15/22/12326)

## 15/09 — scomposizione della lacuna 2 (sezioni trasversali), prima di scrivere codice

*(stessa disciplina già usata su Genesi G7: farlo a metà è la trappola,
si scompone prima — verificato leggendo il codice di persona, non sulla
parola della ricerca)*

**Che cosa c'è oggi, misurato riga per riga.** Un fronte (`fronti/{id}`)
porta tre grandezze SCALARI, un valore solo ciascuna: `quota`,
`altezzaBancoM`, `pendenzaGradi` — scritte da un form a riga singola
(`#fro-quota`/`#fro-altezza`/`#fro-pendenza`, `index.html:4433-4542`) e
lette da `conformitaQuota`/`conformitaGeometria` (`terra-data.js:3586`,
`3759`) per il verdetto di conformità. Non c'è NESSUN posto, né nei dati
né nella pagina, che tenga più di un punto per fronte: aggiungere
sezioni trasversali non è "estendere un campo", è un modello nuovo.

**Perché non si scrive oggi.** Tre pezzi, e sono di taglia diversa:
1. **Il modello dati**: un array `sezioni: [{distanzaM, quotaM,
   altezzaBancoM, pendenzaGradi}, …]` sul fronte, **opzionale e
   additivo** — i tre scalari esistenti restano (retrocompatibilità: un
   fronte già in produzione non ne ha bisogno finché nessuno lo chiede),
   e diventano il caso "una sezione sola, senza distanza".
2. **Il calcolo**: una funzione pura che, DATO un fronte con sezioni,
   trova la peggiore (stesso principio di `conformitaGeometria`: il
   verdetto è quello del margine più stretto, non una media che
   nasconde un punto fuori soglia) — e che con zero sezioni ricade sugli
   scalari di oggi, così `conformitaQuota`/`conformitaGeometria` non
   cambiano contratto per chi le chiama già.
3. **Il form**: un sotto-modulo che aggiunge/toglie righe di sezione
   dentro la scheda del fronte — oggi è un form a riga singola, questo è
   un pattern che Terra non ha ancora da nessuna parte (il pattern più
   vicino è l'elenco cumuli di un inventario, ma è un record separato,
   non righe dentro un altro form).

**La prima fetta onestamente piccola**: (1) da sola — il campo
`sezioni` opzionale, popolabile solo per import (non ancora dal form a
mano), e una funzione pura `sezionePeggiore(fronte)` che la scheda di
conformità userebbe se presente. Zero rischio sulla sicurezza (nessuna
soglia cambiata), zero rischio sul form esistente (non si tocca).
**Non fatto in questo blocco**: la fetta 1 da sola non dà ancora nessun
valore visibile a chi lavora in cava (un campo che nessuna schermata
scrive), quindi non vale la pena costruirla isolata dal pezzo 3 — è
dichiarata come prossimo passo atomico scomposto, non lavoro immaginato.

---

## 15/09 — settimo giro di ricerca mirata: ripristino ambientale progressivo e garanzia finanziaria

*Domanda del mandato: molte concessioni impongono un ripristino per fasi
(non tutto alla fine) con una fideiussione proporzionale all'area non
ancora ripristinata — Terra lo traccia, o solo l'estrazione? Strumento:
`WebSearch` (due ricerche); nessuna fonte letta per intero — tutto di
seconda mano dai riassunti dei risultati. Il codice è stato letto di
persona, riga per riga, prima di scrivere qualunque verdetto — è la
lezione pagata più volte in questo file su "niente entra sulla parola
dell'agente".*

### Come va, fuori [tutto di seconda mano, WebSearch]

- **Il ripristino per fasi è la norma, non l'eccezione, e la garanzia lo
  segue.** Negli USA (SMCRA/OSMRE, 30 CFR 800 [eCFR]) l'importo della
  fideiussione si dimensiona sul costo di ripristino dell'area
  **disturbata e non ancora recuperata**, e cresce **prima** che si apra
  una nuova porzione di cava ("prior to disturbing new acreage, the
  permittee must post additional bond"): non è una garanzia unica fissata
  all'inizio, è una garanzia che segue l'area aperta meno quella chiusa.
  In Australia Occidentale il tasso minimo si calcola sulla superficie
  disturbata.
- **In Italia lo svincolo è esplicitamente PARZIALE E PER LOTTO.** Dai
  riassunti dei risultati (nessuna fonte letta per intero): "le garanzie
  possono essere svincolate parzialmente, con cadenza almeno annuale, per
  l'importo dei lavori di recupero completati. Al termine del recupero
  ambientale di ogni singolo lotto, l'operatore può chiedere lo svincolo
  parziale della garanzia finanziaria"; "in caso di progetti suddivisi in
  lotti di coltivazione, la garanzia finanziaria può essere svincolata per
  singolo lotto secondo le modalità e i criteri richiesti
  dall'Amministrazione"; lo svincolo lo ordina la Provincia/l'ente **dopo
  aver verificato** che le opere di recupero previste dall'autorizzazione
  sono state completate, anche con riduzione proporzionale ai lavori
  parziali verificati.
- **L'IMPORTO unitario della garanzia è materia di listino regionale**, non
  un calcolo che un software fa da solo: fra i risultati compare un
  documento di aggiornamento delle "Linee Guida per gli interventi di
  recupero ambientale di siti di cava e **relativi importi economici
  unitari**, da utilizzare per il calcolo delle fideiussioni" (regione non
  identificabile con certezza dal solo riassunto — probabile Lombardia,
  citato art. 7 L.R. 22/11/1978 n. 69, di seconda mano) — cioè la stessa
  distinzione che Terra fa già nel proprio commento di codice fra "quanta
  garanzia è vincolata" (misurabile) e "quanto VALE" (listino regionale,
  fuori).

### Cosa fa Terra oggi [verificato nel codice, riga per riga]

**Il ripristino per fasi non solo è tracciato: è il modello dati portante
del piano lotti.** Sei stati, non due (`STATI_LOTTO`,
`apps/terra/terra-data.js:3062`): `previsto → aperto → esaurito →
in-recupero → recuperato → collaudato`, ognuno con la propria data
(`apertoIl`, `esauritoIl`, `recuperoIniziatoIl`, `recuperoFinitoIl`,
`collaudoChiestoIl`, `collaudatoIl`). Il commento di modulo (righe
3042-3048) dichiara esplicitamente la premessa di dominio: «Il recupero
contestuale non è una buona pratica: è la condizione con cui
l'autorizzazione è stata data, e quasi sempre è assistita da una garanzia
finanziaria che si svincola per stralci, lotto per lotto» — e la stessa
frase, «recupero ambientale contestuale alla coltivazione, lotto per
lotto», è già nelle prescrizioni dell'atto demo
(`grep -n 'contestuale alla coltivazione' apps/terra/terra-data.js` → riga
186).

Funzioni pure verificate, con firma e scopo:
- `divarioRecupero(lotti)` (`terra-data.js:3080`) — la superficie (e il
  volume) aperti-ma-non-ancora-chiusi: `apertiMq - chiusiMq`. Distingue
  "non misurabile" (nessun lotto registrato) da "0 perché tutto
  recuperato" e conta a parte i lotti che non dichiarano superficie/volume
  (altrimenti il divario si legge più piccolo del vero, mai più grande —
  principio dell'assenza non favorevole applicato due volte, una per i m²
  e una, corretta dopo un difetto misurato il 07/08, per i m³).
- `garanziaVincolata(lotti)` (`terra-data.js:3169`) — somma la quota di
  garanzia (`garanziaEuro`, scritta dall'utente lotto per lotto dalla
  propria polizza) in tre corpi: `vincolata` (lotti non collaudati),
  `liberabile` (recuperati, in attesa del verbale), `liberata`
  (collaudati). Dichiara esplicitamente, nel commento (riga 3159), che
  **Terra non calcola l'importo**: "gli importi unitari sono listini
  regionali, di seconda mano, e restano fuori" — la stessa distinzione
  confermata ora dal mondo (i listini regionali di importi economici
  unitari citati sopra).
- `attesaCollaudo(lotto, oggi)` (`terra-data.js:3132`) — quanti giorni un
  lotto **recuperato** aspetta la richiesta di collaudo, o da quando è
  stata chiesta; dichiara esplicitamente di non giudicare un ritardo
  (righe 3127-3128): "i termini di legge sono regionali e di seconda mano
  e NON entrano: qui si dice da quanto si aspetta, non se si è in
  ritardo" — la stessa cautela che questo file raccomanda per ogni
  soglia di seconda mano.
- `relazioneLotto(lotto, rilievi, fronti, oggi)` (`terra-data.js:3208`) —
  compone il foglio "relazione di fine lavori" da presentare per chiedere
  collaudo e svincolo, con tutte le date del ciclo di vita, il volume
  rimesso in cava per il recupero e la quota di garanzia del lotto; i dati
  mancanti finiscono in `nonMisurati` invece di sparire (stessa
  disciplina del verbale di rilievo).
- Deduzione volumetrica: righe 1381-1396 (`DECISIONE 18`) — se la
  concessione lo ammette, il volume rimesso in cava per il recupero
  (`volumeRecuperoM3`, sul lotto) si detrae dalla base dell'onere di
  escavazione, contato nell'anno in cui il recupero **finisce** (unica
  data verificabile), con la scelta esplicitamente dichiarata "spenta di
  default" per il costo asimmetrico dell'errore.
- Il modulo scadenze porta già una voce dedicata `chiave: "fideiussione"`
  (`terra-data.js:2163`, «Fideiussione — validità o rinnovo della
  polizza») e un caso demo con rinnovo annuale
  (`terra-data.js:237`) — il rinnovo della polizza nel suo complesso è
  già nello scadenzario generico, separato dalla quota per lotto.

UI (`index.html`): il badge di stato lotto (righe 2347-2367) colora
`esaurito` e `in-recupero` come "warn"; il cartellone del divario
(`cardDivario`/`rigaGaranzia`, righe 2369-2382) mostra "Garanzia ancora
vincolata: € X su N lotti non collaudati · liberabile dopo il collaudo di
…"; il form del lotto (righe 953-955) ha i campi `lot-garanzia` e
`lot-vol-rec` con il tooltip esplicito «Terra non la calcola: la scrivi tu
dalla polizza»; lo stato lotto pieno con etichette descrittive (riga 3551)
include «In recupero — i lavori di ripristino sono in corso».

**Verifica comandi:**
`grep -c 'contestuale alla coltivazione' apps/terra/terra-data.js` → 1.
`grep -n 'export function divarioRecupero\|export function
garanziaVincolata\|export function attesaCollaudo\|export function
relazioneLotto' apps/terra/terra-data.js` → 4 righe (3080, 3169, 3132,
3208). `grep -c 'garanziaEuro' apps/terra/terra-data.js` → 8.

### Il delta — un solo punto piccolo, stessa famiglia di uno già costruito

**Confermato — manca il gemello di `attesaCollaudo` per la transizione
precedente.** `attesaCollaudo` misura da quanto un lotto **recuperato**
aspetta il collaudo. Non esiste l'equivalente per la transizione
**precedente**, quella che la prescrizione «contestuale alla
coltivazione» riguarda più da vicino: da quanto un lotto è **esaurito**
(scavo finito, `esauritoIl` valorizzato) senza che il recupero sia
**iniziato** (`recuperoIniziatoIl` ancora vuoto). Verificato:
`grep -niE 'attesaRecupero|attesa.*esaurit|esaurit.*attesa'
apps/terra/terra-data.js apps/terra/index.html` → **nessuna riga** (uscita
vuota). `recuperoIniziatoIl` è scritto e letto in altri sei punti
(dichiarazione del modello, dati demo, form, `relazioneLotto`, etichetta
di stato) ma **mai confrontato con la data odierna**: `grep -n
'recuperoIniziatoIl' apps/terra/terra-data.js apps/terra/index.html` → 12
righe, nessuna con un calcolo di giorni.

- **Schermata**: la scheda del piano lotti, dove oggi il badge «Esaurito»
  (warn, arancione) e la riga «scavo finito il …» sono l'unica cosa che si
  vede — un lotto esaurito da tre giorni e uno esaurito da tre anni senza
  che il recupero sia mai iniziato **hanno lo stesso badge**.
- **Che cosa non va**: nessun numero dice da quanto tempo lo scavo è
  finito senza che il recupero sia partito — cioè manca proprio la misura
  che rende visibile una violazione della "contestualità" che l'atto
  stesso prescrive («recupero ambientale contestuale alla coltivazione,
  lotto per lotto»). `divarioRecupero` dà il numero aggregato (m² e m³
  aperti meno chiusi) ma non ha una dimensione temporale per lotto, e
  `attesaCollaudo` copre solo la fase successiva.
- **Come si vede**: apri un lotto demo con `stato: "aperto"` e
  `esauritoIl` valorizzato manualmente a una data vecchia (nessuno dei sei
  lotti demo attuali è "esaurito" senza recupero iniziato — verificato,
  righe 79-119 del modulo dati) e osserva che nessuna scritta racconta
  l'attesa, a differenza di un lotto "recuperato" che aspetta il collaudo.
- **Quanto costa**: piccolo, stesso pattern già scritto e collaudato — una
  funzione pura `attesaRecupero(lotto, oggi)` che rispecchia
  `attesaCollaudo` (pertinente solo su stato `esaurito`, `daQuanto` già
  scritto lì vicino, stessa dichiarazione esplicita di non giudicare un
  ritardo perché i termini sono regionali e di seconda mano), più una
  riga in `index.html` accanto al badge «Esaurito», sul modello di
  `rigaGaranzia`/`attesaCollaudo` già cablati.
- **Come si misura**: `node apps/deepwork-id/tests/run-kpi.mjs` con un
  caso `attesaRecupero({stato:"esaurito", esauritoIl:"…"}, oggi)` che
  pretenda `pertinente:true` e un conteggio di giorni corretto (stessa
  forma delle prove già scritte per `attesaCollaudo`); nessun banco
  browser necessario, è una funzione pura.

**Tutto il resto della domanda del mandato è già coperto, e in profondità
maggiore di quanto la domanda stessa presupponesse**: il ripristino per
fasi non è "assente", è il modello a sei stati che governa l'intero piano
lotti; la garanzia proporzionale all'area non ripristinata non è
"assente", è `divarioRecupero` (l'area) più `garanziaVincolata` (la quota
finanziaria dichiarata dall'utente per lotto, sommata secondo lo stesso
stato); l'importo unitario della fideiussione **manca di proposito**, per
una decisione già scritta nel codice e ora confermata dal mondo (è
materia di listino regionale, di seconda mano). Non ci sono altre
mancanze da proporre su questa domanda.

**Riassunto** — 1 delta piccolo confermato (il gemello temporale di
`attesaCollaudo` per la transizione esaurito→recupero iniziato), il resto
della domanda del mandato **già costruito** (verificato leggendo il
codice riga per riga, non sulla parola della ricerca) e 1 scelta di
design **dichiarata e confermata giusta dal mondo** (nessun calcolo
dell'importo unitario della garanzia).

**Fonti** (WebSearch, di seconda mano, nessuna letta per intero):
- [U.S. GAO — Coal Mine Reclamation: Federal and State Agencies Face
  Challenges in Managing Billions in Financial Assurances](https://www.gao.gov/products/gao-18-305)
- [eCFR — 30 CFR Part 800, Bond and Insurance Requirements for Surface
  Coal Mining](https://www.ecfr.gov/current/title-30/chapter-VII/subchapter-J/part-800)
- [Office of Surface Mining Reclamation and Enforcement — Reclamation
  Bonds](https://www.osmre.gov/resources/reclamation-bonds)
- [BLM — Bonding, Energy and Minerals](https://www.blm.gov/programs/energy-and-minerals/mining-and-minerals/bonding)
- [Government of South Australia — Financial assurance, Energy &
  Mining](https://www.energymining.sa.gov.au/industry/minerals-and-mining/mining/operational-information/financial-assurance)
- [legislazionetecnica.it — Aggiornamento Linee Guida recupero ambientale
  siti di cava e importi economici unitari per il calcolo delle
  fideiussioni](https://legislazionetecnica.it/node/1519701)
- [regioni.it — Nuova disciplina generale in materia di attività
  estrattive](https://www.regioni.it/upload/DDLatt.estrattive.pdf)
- [edizionieuropee.it — L.R. 5 luglio 2019 n. 22, § IV.2.6](https://www.edizionieuropee.it/LAW/HTML/213/pu4_02_006.html)
- [fantigrossi.it — Il recupero ambientale delle cave: un vincolo spesso
  disatteso](https://fantigrossi.it/il-recupero-ambientale-delle-cave-un-vincolo-spesso-disatteso/)

---

## 16/09/2026 — Ricerca: Sequenziamento multi-anno e confronto pianificato-vs-reale nelle cave

**Domanda:** Come il software di pianificazione mineraria (piccolo-medio, italiano) struttura i piani pluriennali di estrazione sequenziale per banco/fronte, e come traccia i volumi pianificati contro i volumi reali estratti anno per anno?

### Il mondo — Come funziona il sequenziamento nelle cave

#### Struttura gerarchica della pianificazione

Il ciclo di pianificazione mineraria si articola in tre orizzonti temporali integrati:
- **Strategico (pluriennale, 5-10 anni):** Definisce il limite finale dello scavo (pit shell), la vita complessiva della cava, i vincoli economici e ambientali. Obiettivo: massimizzare il valore totale estratto rispetto ai costi.
- **Tattico (medio termine, 6-24 mesi):** Traduce il piano strategico in sequenze di estrazione pratiche per ogni banco/settore, assegnando equipaggiamento, definendo accessi, controllando tassi di estrazione mensili/trimestrali.
- **Operativo (corto termine, settimane-giorni):** Comandi giornalieri di lavoro (quale banco oggi, quanti scavatori, sequenza di perforazione).

Fonte: [Dassault Systèmes GEOVIA MineSched — Bridging Strategic Plans and Operational Mine Schedules](https://blog.3ds.com/brands/geovia/bridging-the-gap-between-strategic-plans-and-operational-mine-schedules/)

#### Piano sequenziale per banco

Il concetto di "banco" (bench, in italiano anche "terrazzamento") è strutturale:
- Un banco è uno strato orizzontale di altezza controllata (tipicamente 10-15 m in cave di aggregati).
- La sequenza di estrazione definisce **l'ordine** in cui i banchi sono aperti (deve rispettare limiti di pendenza dei fianchi, accessi, stabilità).
- Il piano dichiara per ogni banco: (1) qual è il volume previsto; (2) in quale anno/trimestre deve essere estratto; (3) quale è il vincolo (dipendenze da banchi precedenti).

Il software di pianificazione risolve il problema di ottimizzazione: trovare la sequenza di estrazione che rispetta vincoli geometrici e di sicurezza, massimizzando il valore economico. La soluzione produce un **master schedule** dettagliato banco per banco, anno per anno.

Fonte: [K-MINE — Multi-Interval Mine Planning: Long-term, Medium-term, Short-term Integration](https://k-mine.com/technical-articles/multi-interval-mine-planning-in-k-mine/)

#### Confronto pianificato-vs-reale: metodologia

Il confronto si fa su tre livelli di granularità:

**1. Annuale (Reconciliation):** Fine anno si confrontano:
   - Volumi **pianificati per quell'anno** (per banco, per settore, complessivi)
   - Volumi **realmente estratti** (da rilievi, pesate, o registri equipaggiamento)
   - Varianza = (Reale − Pianificato) / Pianificato × 100%

La varianza annuale rivela se la cava è in ritardo di estrazione (varianza negativa → accumulo di giaciture previste non ancora aperte) o in anticipo (varianza positiva → rischio di esaurimento prematuro).

**2. Trimestrale/Mensile (Operational Tracking):** Durante l'anno il direttore monitora se il ritmo di estrazione del mese/trimestre è coerente con il target di quell'anno. Il software genera **rate-of-extraction reports** per equipaggiamento, per zona, confrontando la produzione osservata contro quella prevista.

**3. Per banco (Detail Level):** Quale banco sta slittando? Se il piano dice "Banco 5 aperto a marzo, chiuso a novembre", ma il rilievo mostra che a novembre è estratto il 60%, il sistema dichiara il rischio: "Banco 5 in ritardo di 40%".

Fonte: [Umbrex — Mineral Inventory Reconciliation and Variance Analysis](https://umbrex.com/resources/industry-analyses/how-to-analyze-a-metals-mining-company/mineral-inventory-reconciliation-and-variance-analysis/)

#### Report di conformità al piano

Il report annuale che va all'ente (o alla direzione) contiene:
- Tabella: per ogni banco/lotto, Volume Pianificato vs Volume Estratto vs Varianza %
- Grafico trend: accumulo cumulativo pianificato vs reale negli ultimi 3-5 anni
- Analisi delle cause: ritardi dovuti a (a) condizioni geologiche inaspettate, (b) equipaggiamento fermo, (c) modifiche alle priorità, (d) limiti ambientali/amministrativi
- Proiezione: sulla base del ritmo attuale e degli anni rimanenti di concessione, quando si esaurirà il giacimento pianificato?

Fonte: [RPM MinePlanner — Production Scheduling and Performance Tracking](https://rpmglobal.com/product/mineplanner/); [Maptek Evolution — Life-of-Mine, Medium-term, Short-term Scheduling](https://maptek.com/en/products/evolution/)

### Delta: Che cosa manca a Terra

#### Meccanica: Come dovrebbe funzionare (il mondo)

1. **Piano sequenziale per banco/lotto:** Un "piano vigente" contiene una lista di lotti con:
   - `ordine`: sequenza di estrazione prevista (1° aperto, 2° aperto dopo il 1°, etc.)
   - `volumePianificatoAnno[anno]`: {anno: 2026, volumeM3: 50000, anno: 2027, volumeM3: 40000} — volumi target per ogni anno
   - `quartoInizioMese`, `quartoFineMese`: finestra temporale quando il lotto deve essere aperto/chiuso

2. **Confronto annuale per lotto:** Per ogni lotto si calcola:
   - Volume pianificato per quell'anno (da `volumePianificatoAnno[2026]`)
   - Volume realmente estratto (somma rilievi di scavo su fronti di quel lotto, anno 2026)
   - Varianza % = (Reale − Pianificato) / Pianificato
   - Stato: "in anticipo", "in pari", "in ritardo" (con soglia, es. ±10%)

3. **Monitoraggio sequenza:** Se il piano dice "apri Lotto 2 solo dopo aver estratto il 90% di Lotto 1", il sistema avvisa se Lotto 2 viene aperto prematuramente.

4. **Report annuale per banco:** Uno prospetto che elenca per ogni banco, ogni anno (storia):
   - Stato: Previsto, Aperto, Esurito, Recupero, Recuperato
   - Volume pianificato
   - Volume estratto (misurato)
   - Varianza %
   - Note su ritardi

#### Stato in Terra: Che cosa esiste

**Funzioni di calcolo che esistono:**
- `avanzamentoLotto(lotto, misuratoM3)` → confronta `lotto.volumeM3` (previsto) contro `misuratoM3` (misurato complessivo su tutta la vita) e restituisce `pct`. **Ma:** non è temporale (non sa di anni), è solo il progresso complessivo "abbiamo estratto il 45% del lotto" senza dire se in tempo.
- `banchiDaSempre(rilievi, fronti, autorizzazione, oggi)` → aggrega rilievi per banco su tutta la serie storica (dal primo anno con dati al più recente), traccia quali anni sono misurati e quali "ciechi" (no rilievi). **Ma:** non confronta contro un piano sequenziale, solo raccoglie i dati storici osservati.
- `proiezioneAnnua(rilievi, pianificatoAnnuoM3, oggi)` → confronta volume estratto fino ad oggi **nell'anno corrente** contro il piano annuale (singolo numero, diviso 12 per il mese medio). Restituisce `pctPiano`, cioè "siamo al 78% del piano annuo". **Ma:** non è per banco, è aggregato; non distingue fra lotti; se uno slitterà di 2 anni non lo vede.
- `varianzaMensilePiano(rilievi, pianificatoAnnuoM3, oggi)` → scarto fra il mese corrente e la media mensile del piano annuo. **But:** nessun piano mensile (il piano ha solo un `pianificatoAnnuoM3`), la varianza è contro una divisione naïve (piano/12), nessun peso stagionale.

**Campi nei dati che potrebbero supportare il piano ma non sono usati:**
- `lotto.ordine` (riga terra-data.js:34, demo riga 82) — contiene la sequenza prevista (1, 2, 3…), ma **non è usato da nessuna funzione** di confronto o validazione. È una sola visualizzazione: riga 3255 lo mostra nel verbale ("Lotto 1 · 1° del progetto").
- `piano.pianificatoAnnuoM3` — è un numero singolo, non una serie temporale. Non dice "2026: 125k, 2027: 120k", dice solo "per questo piano, 125k/anno".
- `lotto.volumeM3` — è il volume previsto del lotto, complessivo. Non è "per anno" ma "totale lotto".

**Quello che manca (i delta concreti):**

| Tema | Che cosa manca | Effetto | Come si vede oggi in Terra | Come dovrebbe essere |
|---|---|---|---|---|
| **Piano temporale** | Volumi pianificati **per anno per lotto** | Senza questo, non si può dire "Lotto 2 dovrebbe essere finito entro fine 2026 con 50k m³; ne abbiamo estratti 30k, siamo indietro di 20k". | Il form piano ha un campo `pianificatoAnnuoM3` (numero singolo), il form lotto ha `volumeM3` (totale previsto). Niente collega i due per anno. | Creare un array `volumiAnnuali: [{anno: 2026, volumeM3: 50000}, {anno: 2027, volumeM3: 40000}]` sul lotto o sul piano, e una funzione `volumePianificatoLottoAnno(lotto, anno)`. |
| **Validazione sequenza** | Nessun controllo che Lotto N+1 non sia aperto prima che Lotto N raggiunga una soglia di completamento (es. 80%). | Un lotto può essere estratto fuori ordine senza avviso. Se il piano dice "Nord prima di Sud" ma si scava Sud per primo per comodità, non viene segnalato. | Nel form lotto non c'è un badge che dice "questo lotto dipende dal lotto X al 80%"; premendo il bottone "apri" non ci chiede di verificare la sequenza. | Aggiungere `dipendeDa: {lottoId, percentuale: 80}` nel lotto e una validazione `puòEssereApertoOra(lotto, tuttiLotti)` che verifica. |
| **Varianza per lotto per anno** | `varianzaMensilePiano` è aggregata su tutto l'anno e su tutti i lotti. Nessuna funzione dice "Lotto 2, anno 2026: pianificato 50k, estratto 45k, varianza −10%". | Il direttore non sa se il ritardo è su Lotto 1 (aperto a tempo) o Lotto 3 (tardi di tre mesi). | La pagina del titolo mostra `proiezioneAnnua` in grande (80% del piano). Non c'è una tabella "per lotto" con colonne Piano / Reale / Varianza. | Funzione `varianzaLottoAnno(lotto, rilievi, annoTargetM3, anno)` che restituisce `{pianificato, reale, varianzaPct, stato: "in pari" | "in ritardo" | "in anticipo"}`. Disegnarla in una tabella in page-tit. |
| **Report per banco anni passati** | `banchiDaSempre` aggrega tutta la storia, ma nessun anno-per-anno dettagliato per ogni banco con stato progetto. | Non si vede "Banco A: 2024 esurito al 100%, 2025 recupero iniziato a settembre, non finito". Niente distingue fra "il banco è terminato" e "quest'anno il banco è terminato". | La pagina piano (page-tit) mostra KPI globali. Non c'è una vista tipo "Tavola della cava per banco" con righe = banco, colonne = anno, celle = stato + % completamento. | Estendere `banchiDaSempre` output per includere per ogni banco e per ogni anno (dal `dal` al `al`): `{anno, statoProgettuale, volumePianificato, volumeReale, varianzaPct, motivoSe}`. Una pagina tabellare. |
| **Allerta deviazione sequenza** | Nessun avviso se il piano dice "apri Lotto 3 nel 2027" ma il lotto viene aperto nel 2025. | Un lotto viene aperto con 2 anni di anticipo e il direttore se ne accorge solo leggendo il verbale di rilievo, non dalle pagine di Terra. | Nel form lotto c'è `apertoIl` (data), ma nessuna regola di validazione su `apertoIl` vs piano previsto. Niente è rosso se è anticipato. | Aggiungere al lotto `aperturaPrevista: "2027-Q1"` (anno-trimestre) e una guardia in terra-data.js `lottoApertoFuoriProgramma(lotto, pianoProgramma)` → `{fuoriProgramma: true, anticipoDiGiorni: 543, motivo: "…"}`. Mostrare con badge rosso. |

#### Grep per verificare i delta dichiarati

```bash
# 1. Verificare che lotto.ordine NON è usato in controlli di sequenza
$ grep -n "ordine" apps/terra/terra-data.js
34:   lotti/{id}:   { nome, ordine (la sequenza prevista dal progetto),
82-117: (demo data, lotto.ordine = 1-6)
3255: mostra in verbale ("Lotto 1 · 1° del progetto")
# Risultato: ZERO usi per controllo sequenza. È solo display.

# 2. Verificare che varianzaMensilePiano non è per-lotto
$ grep -A 30 "export function varianzaMensilePiano" apps/terra/terra-data.js | head -40
903: export function varianzaMensilePiano(rilievi, pianificatoAnnuoM3, oggi = new Date())
904-916: calcola varianza su TUTTI i rilievi dell'anno/mese, nessun filtro per lotto.
# Risultato: conferma — è aggregato.

# 3. Verificare che volumePianificatoAnno [] non esiste nei lotti
$ grep -n "volumiAnnuali\|volumePianificato\[" apps/terra/terra-data.js
15-16: (comment dice "piano/{id}: pianificatoAnnuoM3")
148: piano id "p1" ha "pianificatoAnnuoM3: 125000" (numero singolo)
# Risultato: ZERO array temporali nei lotti o nel piano.

# 4. Verificare che avanzamentoLotto è complessivo, non per-anno
$ grep -A 15 "export function avanzamentoLotto" apps/terra/terra-data.js
3434-3444: riceve (lotto, misuratoM3), dove misuratoM3 è la SOMMA su tutta la vita.
# Risultato: conferma — nessun parametro anno.

# 5. Verificare che banchiDaSempre non filtra per lotto
$ grep -A 5 "export function banchiDaSempre" apps/terra/terra-data.js | head -10
2021: export function banchiDaSempre(rilievi, fronti, autorizzazione, oggi = new Date())
2034-2035: ciclo su anni, per ogni anno chiama riepilogoAnnuale e ripartizioneBanchi.
# Cerca: "if (lotto" inside funzione → zero risultati. Non filtra per lotto.
$ grep -n "lotto" apps/terra/terra-data.js | grep "banchiDaSempre" -A 20
# Risultato: banchiDaSempre non menziona lotti. Sono due strutture indipendenti.

# 6. Verificare che il piano ha solo un numero, non una serie
$ grep -B 5 -A 5 '"pianificatoAnnuoM3"' apps/terra/terra-data.js | head -20
15-16: (comment: "piano/{id}: … pianificatoAnnuoM3?")
147: "pianificatoAnnuoM3: 125000" (numero)
655-681: proiezioneAnnua riceve parametro "pianificatoAnnuoM3" (numero singolo)
2510: ref = piano.find(p => p.pianificatoAnnuoM3 > 0) — solo per trovarne uno col piano, non per accedere a una serie.
# Risultato: conferma — `pianificatoAnnuoM3` è un numero, non un array.
```

**Conclusione:** I sei delta sono confermati e verificati. La struttura di base per tracciare **lotti per banco per anno** non esiste in Terra, solo i dati grezzi (rilievi, fronti) e calcoli aggregati (totale cava, totale anno). Per una pianificazione sequenziale multi-anno al livello di dettaglio che il mondo riguarda (e che le cave italiane devono rispettare nelle autorizzazioni), **mancano il piano temporale e il confronto gerarchico (anno → lotto → banco)**.

**✅ 16/09 — il primo delta (Piano temporale + confronto annuale per lotto) è stato implementato**, riverificato indipendentemente riga per riga prima di scrivere codice: commit `0c6f5820`. `lotto.volumiAnnuali` (campo opzionale, additivo) + `volumePianificatoLottoAnno`/`varianzaLottoAnno` in `terra-data.js`, wired nella riga del lotto in pagina Titolo, verificato anche nel browser (`terra-piano-lotto-anno.mjs`). Prima fetta: un solo lotto della dimostrazione dichiara il piano.

**✅ 16/09 — il terzo delta (Monitoraggio sequenza) è stato implementato**, commit `e18dc938`: `lotto.dipendeDa: {lottoId, percentuale}` (campo opzionale, additivo) + `sequenzaLotto` in `terra-data.js`, non bloccante (Terra non ha un bottone "apri" distinto dal form generico), badge "fuori sequenza" nella riga, verificato anche nel browser (`terra-sequenza-lotto.mjs`). Restano aperti tre delta (allerta apertura fuori programma — parente stretto di `sequenzaLotto`, forse assorbibile nella stessa area — e report per banco×anno con stato progettuale) — vedi checkpoint `20260916-082030_terra-sequenza-lotto.md`.

### Fonti (Part A — Ricerca il mondo)

- [Dassault Systèmes GEOVIA MineSched — Bridging the Gap Between Strategic Plans and Operational Mine Schedules](https://blog.3ds.com/brands/geovia/bridging-the-gap-between-strategic-plans-and-operational-mine-schedules/)
- [K-MINE — Multi-Interval Mine Planning in K-MINE](https://k-mine.com/technical-articles/multi-interval-mine-planning-in-k-mine/)
- [K-MINE — Open Pit Design Software](https://k-mine.com/mining-software/open-pit-design/)
- [RPM MinePlanner — Production Scheduling and Performance Tracking](https://rpmglobal.com/product/mineplanner/)
- [Maptek Evolution — Life-of-Mine Scheduling Suite](https://maptek.com/en/products/evolution/)
- [Umbrex — Mineral Inventory Reconciliation and Variance Analysis](https://umbrex.com/resources/industry-analyses/how-to-analyze-a-metals-mining-company/mineral-inventory-reconciliation-and-variance-analysis/)
- [ScienceDirect — Bench aggregation and mining cut clustering for open-pit planning optimization](https://www.sciencedirect.com/science/article/abs/pii/S0952197624004925)
- [Italian Mining Regulation — MINLEX Country Report (2019)](https://rmis.jrc.ec.europa.eu/uploads/legislation/MINLEX_CountryReport_IT.pdf)
- [Italian Regional Guidance — Linee Guida Recupero Ambientale Siti di Cava](https://legislazionetecnica.it/node/1519701)
