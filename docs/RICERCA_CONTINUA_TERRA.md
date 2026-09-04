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
