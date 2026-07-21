# Roadmap di Visione — Ecosistema Deepwork

> Documento di **visione a medio-lungo termine**. Non sostituisce
> `vault/ROADMAP_SETTIMANA.md` (che è tattica, settimana per settimana):
> qui c'è la mappa del **potenziale pieno** di ogni app e dell'ecosistema.
> Nasce dalla ricerca di prodotto per singola app — 7 schede
> "Potenziale — <App>" in `ecosistema-vault/50 - Wiki ricerca/`, ricerca
> web del 2026-07-21. Ogni raccomandazione è taggata per impatto/sforzo
> (S/M/L) e per **"subito"** (browser, dati inseriti a mano) vs
> **"integrazione"** (hardware, centraline, pesa, SdI, telematics).

## Perché questo documento
Il fondatore ha chiesto **qualità massima** e una **mole di lavoro
maggiore**: la roadmap tattica si esaurisce in poche sessioni, questa no.
Qui raccogliamo, app per app, dove ognuna può arrivare rispetto ai
migliori prodotti mondiali, e quali funzioni la avvicinano a quel
traguardo restando dentro i vincoli Deepwork (browser, multi-tenant,
stile unico, nessuna spesa hardware imposta al cliente, italiano +
normativa italiana).

Il messaggio della ricerca è incoraggiante: **il lavoro "subito" (senza
hardware) è tanto e di valore reale.** Sommando le sole voci di taglia S
sulle 7 app c'è già un backlog che tiene impegnate molte sessioni, prima
ancora di toccare le integrazioni.

## La tesi dell'ecosistema: il ciclo chiuso
Il valore non è la singola app, ma il **ciclo chiuso** dei dati di cava,
che oggi nessun competitor copre in italiano e con normativa italiana:

```
Genesi (progetto volata) → Campo (esecuzione, carica reale per foro)
   → Terra (rilievo drone, m³ realmente estratti) → Conti (m³ → valore,
   fatture) ; con Flotta (mezzi/costi che muovono il materiale) e
   Scudo + Sentinella (sicurezza persone + ambiente) come presidi
   trasversali su tutto il ciclo.
```

I "big" (Orica, Maptek, Maxam, Command Alkon, Propeller, Envirosuite…)
vendono ciascuno un pezzo verticale, spesso caro ed enterprise. Il
fossato Deepwork è **collegare i pezzi** e parlare italiano/normativa
italiana a una cava media. Ogni sezione indica i **ponti** verso le
altre app: sono la roadmap che conta di più.

---

## Genesi — simulatore di volata 3D
*(Scheda completa: [[Potenziale — Genesi]]. Ricerca competitor già svolta
nel ciclo precedente.)*

**Posizionamento accertato:** blast-design INDIPENDENTE dai fornitori di
esplosivo (fuori: Maxam/Orica/Austin), LEGGERO senza server in sito né
droni obbligatori (fuori: Maptek/Strayos), in italiano con normativa
italiana (fuori: tutti). Fossato unico: simulazione visiva 3D
**calibrata su volate reali filmate** — nessuno dei sei competitor lo fa.

**Direzioni (valore/sforzo):**
1. **Flyrock inverso** — dal vincolo di gittata alla carica conforme.
   `flyrockEst` esiste già: è calcolo. S/M.
2. **Registro "progettato vs reale" foro per foro** — ponte Genesi↔Campo. M.
3. **Secondo modello di frammentazione** (KCO/Swebrec accanto a Kuz-Ram). S.
4. **Loading rules** per tipo roccia → carica proposta. M.
5. **Post-volata**: previsto vs misurato da foto muckpile. L (in visione).

**Ponti:** Campo (carica reale), Terra (volume abbattuto vs previsto),
Sentinella (vibrazioni → soglie PPV).

## Terra — rilievo drone e gestione volumetrica
*(Scheda: [[Potenziale — Terra]].)*

**Posizionamento:** Terra sta **a valle** del drone. Non elabora
fotogrammetria pesante: importa ortofoto+DEM già prodotti e ci ragiona
sopra. I competitor (Propeller, DroneDeploy, Pix4D, Maptek) sono forti
sul rilievo ma **nessuno racconta in modo semplice l'avanzamento del
piano annuo e il valore economico del materiale** a un gestore non
tecnico: lì è lo spazio di Terra. Accuratezza di riferimento: volume
1–3% in buone condizioni, RTK/PPK ~3 cm; a Terra serve **documentare**
l'accuratezza, non produrla.

**Direzioni:**
1. Import DEM (GeoTIFF) + volume per fronte (TIN/base surface). M.
2. Cruscotto "estratto vs pianificato" + riserva residua. La personalità
   di Terra. M.
3. m³ → tonnellate → valore (densità + shrink/swell). Ponte a Conti. S.
4. Report con qualità del dato documentata (RTK/PPK, GCP, GSD). S.
5. Overlay progetto di volata (DXF/LandXML) + change-detection tra DEM. M.

**Ponti:** Genesi (volume vs previsto), Conti (m³ → valore), core (piano).

## Scudo — HSE del personale
*(Scheda: [[Potenziale — Scudo]].)*

**Posizionamento:** i big orizzontali (SafetyCulture, Quentic, Intelex)
sono forti su ispezioni/incidenti; i gestionali italiani presidiano la
compliance D.Lgs 81/08 ma con UX datata. Spazio di Scudo: verticale
cava, mobile/offline moderno, semplice, multi-tenant, in italiano.

**Direzioni — SUBITO nel browser:**
1. Scadenzario unificato (visite mediche, corsi, DPI, patentini) con
   alert multi-soglia (60/30/15/7/1 giorno). Cuore 81/08. S.
2. Giudizio di idoneità sanitaria strutturato (art. 41). S.
3. Matrice competenze/formazione con gap e scadenze. M.
4. Registro near-miss/infortuni con causa radice (5 Perché) + azioni
   correttive. Leva proattiva n.1 (piramide 1:29:300). M.
5. Cruscotto KPI: TRIR, LTIFR, indice di frequenza/gravità. M.
- *Dopo:* PTW/LOTO digitali, mobile/offline con firma, AI near-miss.

**Ponti:** core (anagrafica lavoratori/turni), Sentinella (HSE ambiente ↔
persone), Campo (formazione ↔ chi è in turno).

## Flotta — mezzi, manutenzione e costi
*(Scheda: [[Potenziale — Flotta]].)*

**Posizionamento:** i generalisti (Fleetio $4–10/mezzo/mese) fissano lo
standard PMI; i FMS minerari (DISPATCH, Wenco, Hexagon) sono enterprise e
sovradimensionati per la cava media. Valore per il cliente tipico:
**sapere quanto costa e quanto rende ogni mezzo, e non farsi fermare da
un guasto o da un ricambio mancante.**

**Direzioni — SUBITO, inserimento manuale:**
1. Cruscotto KPI per mezzo/flotta: disponibilità %, utilizzo %, costo/ora,
   costo/tonnellata. M.
2. Ordini di lavoro (work order) che consumano ricambi. M.
3. Magazzino ricambi con soglia di riordino e alert (il 34% dei ritardi
   nasce dai ricambi mancanti). M.
4. TCO semplificato per mezzo. S–M.
5. Scadenzario predittivo "leggero" (proietta ore/giorno recenti). S.
- *Dopo (hardware):* import telematics OEM, connettore ISO 15143-3,
  predittiva su fault code J1939/DM1, TPMS gomme.

**KPI di riferimento:** disponibilità world-class 92–94% (camion),
utilizzo 70–85%, OEE >85%. Calcolabili subito dai dati già raccolti.

**Ponti:** Campo (mezzi in turno, fermi), Conti (costi → margine),
Sentinella (consumi/emissioni).

## Campo — operativo di campo / produzione
*(Scheda: [[Potenziale — Campo]].)*

**Posizionamento:** i competitor (Micromine Pitram, MineExcellence,
Newtrax, DISPATCH) sono enterprise e orientati a grandi flotte. Campo può
essere il **diario di turno digitale** semplice della cava media, che poi
chiude il cerchio con Genesi.

**Direzioni — SUBITO, inserimento manuale:**
1. Rapportino di turno digitale + handover strutturato (PDF/riassunto). M.
2. Causali di fermo standardizzate (downtime reasons): senza di esse non
   si calcolano OEE/disponibilità. S.
3. KPI di turno dai dati manuali: tonnellaggi, fermi, Disponibilità,
   Utilizzo. M.
4. Ciclo carico-trasporto semplificato (n. viaggi × payload nominale). M.
5. PWA offline-first "store and forward". M.
- *Dopo:* chiusura cerchio blast→produttività caricatore (dig time
  −12/46% se P80 600→200 mm), Match Factor/dispatch, import pesa/telemetria.

**Ponti:** Genesi (carica reale per foro → produttività), Flotta (mezzi
in turno), Terra (produzione → volume), Conti (produzione → valore).

## Conti — amministrazione e commerciale
*(Scheda: [[Potenziale — Conti]].)*

**Posizionamento:** all'estero suite quote-to-cash (Command Alkon); in
Italia gestionali che partono dalla pesa. Spazio di Conti: la parte
**crediti/incassi/margine** chiara e leggera, in italiano, che si integra
poi con pesa e SdI.

**Direzioni — SUBITO, inserimento manuale:**
1. Scadenzario incassi + aging clienti + DSO in dashboard
   (DSO = crediti ÷ vendite a credito × giorni). S.
2. Solleciti automatici a livelli (pre-scadenza, 15/30/60 gg) + priorità. M.
3. Anagrafica clienti + listini per materiale con prezzi contrattuali
   (prezzo per materiale **e** per distanza/nolo: il trasporto vale ~45%). M.
4. Report margine su 3 assi (commessa, cava, materiale). M.
5. Modulo gare/appalti: base d'asta, ribasso, stato, scadenze. S.
6. Previsione incassi + scoring cliente (AI leggera sui dati interni). M/L.
- *Dopo (integrazione/normativa):* fatturazione elettronica SdI/FatturaPA
  (XML, invio, notifiche scarto); ciclo pesa→ticket→fattura.

**Ponti:** Terra/Campo (m³/t → valore), core (clienti).

## Sentinella — monitoraggio ambientale e compliance
*(Scheda: [[Potenziale — Sentinella]].)*

**Posizionamento:** i competitor (Envirosuite, Instantel, Svantek,
Sigicom, Trolex) vendono strumenti+piattaforma cari. Spazio di Sentinella:
**scadenzario adempimenti + soglie** semplice, in italiano, che poi si
apre alle centraline via API.

**Direzioni — SUBITO, inserimento manuale + soglie:**
1. Scadenzario adempimenti AUA/AIA con reminder (AUA dura 15 anni, rinnovo
   −6 mesi; relazioni annuali; calibrazioni). Obbligo di legge. M.
2. Registro letture + motore soglie (PM10, rumore, PPV, airblast) con
   stato verde/giallo/rosso. M.
3. Libreria soglie normative preimpostate (PM10 50/40 µg/m³; differenziale
   rumore 5/3 dB; DIN 4150-3; airblast 133 dB), con avviso "verificare
   valore ufficiale" dove non confermato. S.
4. Archivio evidenze + audit trail immodificabile. M.
5. Registro volate (carica per ritardo, distanza) collegabile alle
   vibrazioni. S.
6. Export report ARPA/enti (PDF/CSV). M.
- *Dopo (hardware):* connettore centraline API/MQTT/Modbus, grafico
  PPV↔scaled distance, anomaly detection, predictive maintenance sensori.

**Ponti:** Genesi (volata → vibrazioni), Scudo (HSE), core.

---

## Temi trasversali (valgono per tutte le app)
La ricerca fa emergere schemi ricorrenti: conviene costruirli **una volta
sola** in `shared/` e riusarli ovunque.

1. **Scadenzario + soglie con alert multi-livello** — Scudo (visite/corsi),
   Flotta (manutenzioni), Sentinella (adempimenti/letture), Conti (incassi).
   È lo stesso mattone: stato regolare/in-scadenza/scaduto + reminder.
2. **KPI onesti con formule note** — Flotta (OEE/disponibilità), Campo
   (Match Factor/cycle time), Scudo (TRIR/LTIFR), Conti (DSO). "—" quando
   il dato manca, mai numeri finti (già prassi Deepwork).
3. **Mobile/offline "store and forward"** — Campo e Scudo lo richiedono
   davvero (in cava manca la rete). PWA + coda di sincronizzazione.
4. **Import/export CSV robusti + audit trail** — ogni app ne ha bisogno;
   già presenti helper `csvCell`/`parseCsvLine` in `shared/`.
5. **AI "leggera" nel browser, dopo i dati** — anomaly detection statistica
   (Z-score), previsioni di breve termine, priorità: utile solo quando c'è
   storico pulito. Prima i dati strutturati, poi l'AI.
6. **I ponti dati fra app** — il vero fossato. Prima i registri comuni
   (foro, turno, lettura, carico), poi i collegamenti automatici.

## Come diventa lavoro
La regola operativa: **estrarre le voci "subito/S" e versarle in
`ROADMAP_SETTIMANA.md`** come task atomici; le voci M/L diventano epiche
da spezzare. Priorità suggerita (valore/sforzo, tutto senza hardware):

| # | App | Voce "subito" | Taglia |
|---|-----|---------------|--------|
| 1 | Sentinella | Libreria soglie normative preimpostate | S |
| 2 | Conti | Dashboard DSO + aging incassi | S |
| 3 | Scudo | Giudizio idoneità sanitaria strutturato | S |
| 4 | Terra | m³ → tonnellate → valore (densità) | S |
| 5 | Campo | Causali di fermo standardizzate | S |
| 6 | Flotta | Scadenzario manutenzione "predittivo leggero" | S |
| 7 | Genesi | Secondo modello frammentazione (KCO/Swebrec) | S |
| 8 | Conti | Modulo gare/appalti (base d'asta, stato) | S |
| 9 | Sentinella | Registro volate collegabile alle vibrazioni | S |
| 10 | Terra | Report con qualità del dato documentata | S |

Poi le epiche M (scadenzari completi, KPI, work order, rapportino turno,
report margine) e infine le L/integrazioni (SdI, pesa, telematics,
centraline, mobile/offline con firma). Il "ciclo chiuso" (ponti
Genesi↔Campo↔Terra↔Conti) è l'epica strategica che attraversa tutto.

## Nota di metodo e limiti
Ricerca web del 2026-07-21. In questa sessione l'apertura diretta delle
pagine (WebFetch) era spesso bloccata (403); le schede si basano su
ricerche (WebSearch) che restituiscono estratti reali con URL reali. I
prezzi dei competitor sono quasi sempre non pubblici (segnati "n.d." nelle
schede). Le soglie normative sono riportate solo dove confermate; quelle
non verificate numero-per-numero (es. singole bande DIN 4150-3) sono
segnalate come "da verificare sulla norma ufficiale" prima di
implementarle. Le fonti puntuali sono nelle 7 schede della wiki.
