# Ricerca continua — Sentinella (01/08/2026)

Candidati di miglioramento emersi dalla lettura delle schermate, del modulo dati e della roadmap implementata.

## Che cosa esiste già

- **F5**: serie storica con grafico SVG (linea, soglia, superamenti, punti)
- **T1**: import CSV letture con colonne a scelta dell'utente, anteprima riga per riga
- **T2**: anagrafica ricettori con soglia che vince su quella del punto
- **T3**: report di conformità stampabile in A4 per periodo / ricettore
- **T4**: registro reclami con tipo, collegamento al ricettore, stato aperto/chiuso
- **T5**: programma di monitoraggio con stato calcolato (in regola, da fare, in ritardo, mai misurato)
- **T6**: andamento per ricettore con confronto fra periodi (mese corrente vs mese prima)
- **T7**: ponte verso Scudo (superamenti e reclami generano azioni correttive)
- Soglie preimpostate (10 voci: DIN, USBM, airblast, PM10)
- Volate "previste" (da Genesi) e "eseguite" nel registro con distanza scalata e carica massima
- Esito esplicito del report: conforme / non conforme / senza dati

---

## Candidati di miglioramento

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| **Monitoraggi** | Lo stato "Mai misurato" non spiega perché il punto non è stato ancora registrato — se è nuovo, se non ha una misura in programma, o se il programma è scaduto. È il primo stato che l'utente vede ma racconta poco. | Punto creato oggi: stato «Mai misurato», senza sapere se è un punto appena creato (niente da fare) o se il programma dice «doveva essere misurato il 15 gennaio» (criticità da gestire). | Piccolo | Creare 3 punti: uno senza programma, uno con data inizio nel passato, uno appena aggiunto al programma. Verificare che la label dello stato li distingua, non con un numero ma con il motivo scritto (es. «Nessun programma», «Programma scaduto da 10 giorni»). |
| **Programma** | Un punto con programma non dice quale è la frequenza attesa — solo quella che è stata impostata, in giorni. «Ogni 7 giorni» e «ogni 15 giorni» dicono il numero, ma non il nome: per una campagna fonometrica trimestrale non è ovvio che sia 90 giorni. | Pagina programma: voci «Ogni 7 giorni», «Ogni 90 giorni». Un tecnico acustico legge «trimestrale» come una parola, non come un conto di giorni. | Piccolo | Leggere la pagina e verificare che la frequenza sia detta a parole dove possibile (settimanale, trimestrale, semestrale) o con il numero dove non c'è un nome standard. Oggi dice sempre il numero. |
| **Report conformità** | Il report dice «conforme / non conforme / senza dati», ma se senza dati scrive una frase che prova a rassicurare («non ci sono letture, quindi non si sa»). Su un documento all'ente, un ricettore senza misure non è un ricettore conforme — è un ricettore NON MISURATO. L'app dice giusto nel modulo (esito = "senza-dati"), ma il testo del report lo ammorbidisce. | Report per un ricettore nuovo (ricettore aggiunto dopo un reclamo, senza ancora nessuna misura collegata): badge «Senza dati», testo «Nel periodo considerato non ci sono letture registrate: il report non può dire se il limite è stato rispettato.» Non dice che nessuno ha mai misurato lì. | Piccolo | Leggere il testo dell'esito di un report con ricettore senza misure. Verificare che dica esplicitamente «Nessuna misura è stata ancora registrata nel punto X» invece di una frase impersonale. |
| **Volate previste** | Una volata progettata in Genesi nasce «prevista» nel registro. Ma il numero di previsioni non si conta da nessuna parte: quanti fori, quanti chili di esplosivo sono in programma? L'ente fa domande come «quanto avete sparato questo mese» e la risposta mescola previsto e realizzato. | Quadro / Registri: il riepilogo mensile dice «10 volate eseguite» (preso da `riepilogoVolate`, che scarta le previste) e niente sulle previste. Se il mese ha 3 volate già eseguite e 2 programmate, il numero che vediamo è 3, e il secondo registro non dice niente su quello che ancora verrà. | Medio | Verificare che il riepilogo mensile distingua: volate eseguite, volate previste, kg totali dei mesi passati (finito), kg programmati per quello in corso (ancora da sparare). Misure: nome dell'indicatore, numero mostrato, unità. |
| **Programma sospeso** | Una riga di programma può essere sospesa (campo `attivo: false`), ma la sospensione non ha una data di fine — è indefinita. Se la app non l'avvisa nessuno la riattiva mai. | Pagina programma: una riga dice «Sospesa», niente altro. Nessun avviso di «quando ricominciare». | Piccolo | Sospendere una riga di programma, chiudere l'app, riaprire dopo una settimana. Verificare che la pagina avvisi esplicitamente che c'è una riga sospesa da N giorni e proponga di riattivare. |
| **Reclami chiusi** | Un reclamo si marca come chiuso, ma l'app non chiede la data di chiusura né l'esito della risposta data al residente. Un giorno il cliente vede «reclamo della Sig.ra Rossi, chiuso» e non sa quando è stato chiuso né se è stato risolto o solo archiviato. | Pagina reclami: riga con «stato: chiuso», niente altro. È un fatto archiviato, non una risposta. | Piccolo | Marcare un reclamo come chiuso e verificare che la pagina chieda almeno la data di chiusura e un'etichetta di esito (es. «risolto», «inoltrato all'ente», «non affrontabile»). |
| **Scadenze adempimenti** | Una scadenza di adempimento che scade passa da «10 giorni» a «scaduto da 1 giorno» quando arriva il giorno X. Ma se nessuno controlla la pagina non vede il cambio di colore finché non ritorna. In quel momento l'adempimento è già rosso da ore. | Quadro: una tessera dice «3 adempimenti entro 30 giorni». Uno di questi scade oggi. Se non apro la pagina fino a domani lo vedo rosso e non so da quanto. | Piccolo | Andare a letto con un adempimento giallo (entro 3 giorni). Dormire. Accendere il dispositivo il giorno dopo della scadenza, senza riaprire l'app nel mezzo. Verificare che sulla tessera del Quadro sia scritto da quando è scaduto, non solo il colore rosso. |
| **Numero di superamenti annui (PM10)** | Il modulo misura i superamenti entro un periodo, ma non ha una "fine dell'anno" automatica. Per il PM10 la legge dice «non più di 35 superamenti l'anno». L'app non sa fare il conto annuale e poi azzerarlo il 1 gennaio. | Pagina monitoraggi: un punto PM10 mostra l'ultimo valore e lo stato (conforme/attenzione/superamento). Non c'è da nessuna parte il conto di «superamenti quest'anno». | Medio | Nel modulo dati trovare la funzione che conta i superamenti (esiste in `reportConformita` e `statPeriodo`). Verificare se calcolasse l'anno solare attualmente. Misura: aggiungere una riga di output che dica «anno 2026: 18 superamenti su 35 consentiti». |
| **Volate senza norma citata** | Una volata nel registro entra con `ppvPrevNorma: ""` (vuoto). Il report per l'ente mette il limite numerico ma non dice da quale norma viene. L'ente vede «4,5 mm/s / limite 5 mm/s» e non sa se è DIN, USBM o una soglia locale. | Dati: b5 nella demo ha `ppvPrevLimite: 5` e `ppvPrevNorma: ""`. Report della volata: la riga dice «limite 5 mm/s» senza dire che è un limite senza norma. | Piccolo | Leggere il file HTML di Sentinella dove disegna il report della volata. Verificare che quando `ppvPrevNorma` è vuoto scriva esplicitamente «(norma non dichiarata)» accanto al numero, non lasci il lettore che indovini. |
| **Superamento senza ricettore** | Un monitoraggio è collegato a un ricettore che ha la distanza (campo `distanza`). Se il ricettore non ha distanza (null) o non è collegato, il calcolo della distanza scalata non si può fare. L'app non dice perché quando il calcolo fallisce. | Punto di misura su un ricettore senza distanza: la soglia efficace si calcola, ma SD = R / √W non si calcola. Il grafico, il confronto con il sito, il limite della PPV non saranno mai tarati. Nessun avviso. | Piccolo | Creare un ricettore senza distanza, collegarvi un monitoraggio, cercare il calcolo di SD in una pagina che lo mostri (es. il report di volata, la scheda del monitoraggio). Verificare che dica «distanza non disponibile» e non mostri un numero. |
| **Esito della volata senza PPV misurata** | Una volata marchiata come «eseguita» potrebbe non avere PPV misurata (la volata è stata fatta, ma il sismografo non era lì o non ha registrato). L'app la mostra lo stesso nel riepilogo come se fosse un referto completo. | Dati: b2 e b4 sono volate eseguite senza `ppvMisurata`. Report della volata mensile: il numero di «volate completate» include sia quelle misurate che quelle senza. | Piccolo | Nella funzione `refertoDaVolata` (che esiste in sentinella-data.js) o negli export: verificare che il report dica quante delle volate eseguite hanno una PPV misurata, e quante no. Misura: aggiungere una riga di riepilogo che dica «14 volate eseguite, 11 misurate, 3 senza sismografo». |
| **Tolleranza del programma indefinita** | Il programma di monitoraggio ha una tolleranza (`tolleranzaGiorni`): "la misura è entro soglia fino a questo ritardo, poi diventa da fare". Ma se è una freccia rossa (in ritardo) da mesi nessuno sa quando ripristinare. Non c'è una data di "scadenza della tolleranza". | Pagina programma: una riga dice «In ritardo di 45 giorni». Entro il giallo (tolleranza) rientra ancora — è giallo. Dopo scade il giallo e diventa rosso. Non c'è scritto quando il rosso scatta, l'utente non sa «mi resta 5 giorni di tolleranza» o «la tolleranza è già scaduta». | Piccolo | Creare una riga di programma con ultima misura 20 giorni fa, ogniGiorni=7, tolleranzaGiorni=10. La prossima era il giorno 7, il giallo vale 7+10=17 giorni. Oggi è il giorno 20, in rosso. Verificare che la label dello stato dica «In ritardo di 3 giorni oltre la tolleranza» con il numero esatto. |



---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_sentinella.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

## Ricerca del 2026-09-02 — monitoraggio ambientale di una cava con esplosivo (metà sul mondo)

### Che cosa esiste già da noi
Non verificato da questa ricerca: il delta lo fa chi ha il codice.

### Normi e soglie — vibrazioni (PPV)

**UNI 9916:2004** [seconda mano: risultato ricerca]: misura Peak Particle Velocity (PPV) in mm/s, range 0,1–150 Hz. Soglie variate per tipo edificio (residenziale, industriale, storico) e frequenza dominante, senza limiti precisi — fornisce metodo di misura e valutazione. Analisi FFT su tre assi (X, Y, Z).

**DIN 4150-3** [seconda mano]: range 1–80 Hz per confort. PPV in mm/s. Soglie per strutture ordinarie vs. sensibili/storiche. Vieta danni strutturali (crepe, deformazioni). Punti di rilievo e velocità massime per vibrazioni transitorie e continue.

**USBM RI-8507 (USA)** [seconda mano]: soglie PPV 0,5–2,0 in/s (ca. 12,7–50,8 mm/s) per strutture residenziali, dipendenti da frequenza e tipo di muratura. Studio su 76 strutture, 219 esplosioni. Base della maggior parte delle normative USA.

### Rumore — D.Lgs 447/1995
[seconda mano]: Legge quadro italiana. Limiti diurni/notturni per sei classi acustiche (es. diurno classe I residenziale: 50 dB; classe VI industriale: 70 dB). Periodo notturno 22:00–06:00. Criterio differenziale: +5 dB giorno, +3 dB notte (ambient − residual).

### Polveri — D.Lgs 155/2010
[seconda mano]: PM10 limite giornaliero 50 µg/m³ (non superabile >35 volte/anno); media annuale 40 µg/m³. Applicato ai recettori.

### Taratura e catena delle registrazioni

**Fonometri classe 1** [seconda mano]: taratura prima e dopo ogni sessione con calibratore Accredia certificato (rinnovato ogni 12 mesi, norma IEC 61672). Frequenza più ampia e tolleranze più strette di classe 2.

**Sismografi** [seconda mano]: taratura annuale conforme UNI 9916. Catena metrologica documentata ininterrotta verso standard nazionali/internazionali. ARPA gestisce laboratori LAT (Laboratorio di Taratura) per certificazione.

**Registrazioni** [seconda mano]: ARPA misura frequenze variabili (mensile–annuale) per matrice ambientale. Rapporti riportano metodi, frequenza, parametri di processo, sistemi di abbattimento.

### Rapporto all'ente (ARPA)

[seconda mano]: Frequenza e contenuti dipendono dalle specifiche autorizzative (AIA). Piano di monitoraggio dichiara: punti di misura, frequenza, parametri, metodologie. Report contiene risultati per ogni matrice, confronto con limiti normativi. Firma richiesta da tecnico competente.

### Strumenti e software

| Prodotto | Funzioni | Fonte |
|----------|----------|-------|
| Instantel Blastmate/Minimate | Registra PPV (5 modi: single shot, continuous, manual, histogram). Software Vision II/Blastware. Report compliance | [seconda mano] |
| Sigicom INFRA | Wireless vibration, air blast, noise, dust, crack movement. INFRA Net: web-based reporting, allarmi, grafici | [seconda mano] |
| Syscom Instruments MR3000C | Vibration monitoring civile/mining/blasting. Cloud SCS software, near real-time | [seconda mano] |
| 01dB Duo + Syscom | Noise + vibration integrati | [seconda mano] |
| Vibrock V901/V9000 | Full software suite seismica | [seconda mano] |

### Domande per il delta (confronto con Sentinella)

1. Chi decide in Sentinella la soglia PPV per un recettore specifico (edificio residenziale vs. industriale) e come si applica DIN 4150-3 vs. USBM RI-8507 per siti transnazionali?
2. La app distingue airblast (dB(L)) da rumore D.Lgs 447/1995, e consente allarmi automatici SMS/mail se superata una soglia?
3. Come gestisce la taratura degli strumenti e la catena metrologica — vi è un registro certificato con date e laboratori LAT?
4. Esporta rapporti ARPA con i contenuti richiesti (frequenza, metodologie, firma tecnico competente)?
5. Integra i dati di PM10 dai campionatori e li confronta con D.Lgs 155/2010 (50 µg/m³ giornaliero)?
6. Consente impostazione di soglie differenziate per classe acustica di zona e criteri differenziali diurno/notturno?

### Fonti (tutte [seconda mano])

- [Instantel Products](https://www.instantel.com/products)
- [Sigicom INFRA System](https://www.sigicom.com/)
- [Syscom Instruments – Orica](https://www.orica.com/en/digital-solutions/geosolutions/syscom-instruments-sa)
- [ARPA Lombardia – Taratura strumenti](https://www.arpalombardia.it/temi-ambientali/aria/rete-di-rilevamento/qualita-dei-dati/taratura-degli-strumenti/)
- [D.Lgs 155/2010 – Qualità dell'aria](https://leg13.camera.it/parlam/leggi/deleghe/testi/10155dl.htm)
- [ARPA Umbria – Monitoraggio ambientale](https://www.arpa.umbria.it/resources/documenti/Via_protocolli/PROTOCOLLO%20192.pdf)
- [Vibrock Downloads](https://www.vibrock.com/downloads/)

### Il delta, fatto da chi ha il codice in mano (02/09, contro `ba83a289`)

Le sei domande, risposte aprendo `apps/sentinella/sentinella-data.js` e
cercando il MECCANISMO. Per ogni «non c'è» il comando e la sua uscita.

1. **La soglia PPV per un ricettore** → la decide chi registra il ricettore,
   con i preset di norma a portata di mano e MAI applicati da soli:
   `presetSoglia` (DIN 4150-3 residenziale/sensibile/industriale per banda di
   frequenza, USBM RI 8507 intonaco e alta frequenza, `daVerificare` SEMPRE
   true — «nessun valore normativo va usato senza controllo»),
   `sogliaDelRicettore` (la soglia propria della casa) e `sogliaEfficace` (se
   il ricettore ha la sua e la stessa unità vince quella, se no la soglia del
   punto, e con unità diverse NON si converte: si segnala). DIN contro USBM
   non è una scelta «per sito transnazionale»: sono due preset accanto, e la
   scelta resta di chi firma. `grep -c 'tipo: "vibrazioni"' apps/sentinella/sentinella-data.js` → 8.
2. **Airblast contro rumore** → distinti per tipo e unità: `unitaMisura` dà
   `airblast: "dB"` e `rumore: "dB(A)"`, il preset `airblast-133` (USBM RI
   8485) esiste, il piano di volata porta `airblastPrevisto`. Gli **allarmi
   via SMS/mail NON ci sono**: `grep -ciE 'sms|e-?mail' apps/sentinella/sentinella-data.js` → **0**. Le
   allerte esistono a schermo (`allerteTaratura`, i superamenti nel Quadro);
   una notifica fuori dall'app è un servizio (Cloud Function + un fornitore
   di SMS) e una SPESA: decisione del fondatore, non di un cantiere.
3. **Taratura e catena metrologica** → esiste ed è il pezzo più solido:
   `coperturaTaratura`, `statoTaraturaStrumento` (con `statoScadenzaHSE` di
   shared: una scadenza è una scadenza), `contaCoperture`, `taratureDelReport`,
   CSV andata e ritorno (`parseTaratureCsv`/`csvTarature`), `allerteTaratura`
   — 106 occorrenze di «taratur». Il laboratorio è un campo del certificato
   (`grep -ciE 'accredia|\bLAT\b|laboratorio' apps/sentinella/sentinella-data.js` → 3): c'è, ma non c'è un
   elenco chiuso di laboratori accreditati — e non deve esserci, cambierebbe
   fuori dal codice.
4. **Il rapporto all'ente** → esiste: `reportConformita` con i quattro esiti
   per punto (`senza-dati`, `senza-soglia`, `non-conforme`, `conforme` — e
   «senza dati» NON è «conforme», CLAUDE.md), le tarature del periodo dentro
   il report (`taratureDelReport`), «ARPA» 11 volte. Frequenza e firma del
   tecnico competente sono di chi lo firma: il report non firma per nessuno.
5. **PM10** → esiste come tipo (`polveri`, µg/m³, 17 occorrenze) con i preset
   della media annua (UE 2008/50/CE: 40; UE 2024/2881 dal 2030: 20), tutti
   `daVerificare`. **Il limite giornaliero con i superamenti ammessi l'anno
   NON c'è** (`grep -ciE '155/2010' apps/sentinella/sentinella-data.js` → **0**; nessun preset «giornaliero»):
   la ricerca lo riporta di seconda mano (50 µg/m³, 35 superamenti). ⏱️
   Candidato: un preset «PM10 · media giornaliera» e il conto dei superamenti
   nell'anno — SOLO dopo aver letto il D.Lgs 155/2010 sul testo, non su un
   risultato di ricerca. Una soglia di legge sbagliata in una schermata è
   peggio di una assente.
6. **Soglie per classe acustica e criterio differenziale** → **non ci sono**:
   `grep -c 'tipo: "rumore"' apps/sentinella/sentinella-data.js` → **0** preset per il rumore, `grep -ciE
   'notturn|differenziale' apps/sentinella/sentinella-data.js` → **0**. La classe acustica compare tre volte
   nei COMMENTI come «la decisione che fissa la soglia» ed è lasciata a chi
   registra il ricettore, che scrive il limite in dB(A). ⏱️ Candidato: i
   preset delle sei classi (diurno/notturno) dal D.P.C.M. 14/11/1997 — stessa
   condizione: testo primario prima, `daVerificare` sempre.

Riassunto: **quattro esistono (1, 2 in parte, 3, 4)**, tre mancanze vere —
le notifiche fuori dall'app (una spesa: del fondatore), il limite giornaliero
del PM10 coi superamenti, le classi acustiche — le ultime due sospese a una
lettura del testo primario. Nessun numero di norma riportato dalla ricerca
entra nel prodotto.

---

## Ricerca del 2026-09-04 — i file dei sismografi e il rapporto del perito (metà sul mondo)

**Nessuna pagina primaria è stata letta: ogni articolo, soglia, formato o prodotto citato viene da risultati di ricerca (`WebSearch`) ed è di SECONDA MANO.** `WebFetch`/`curl` non sono stati usati (bloccati per direttiva). Le soglie DIN 4150-3, UNI 9916, USBM RI 8507/8485, SN 640312a riportate qui sono di seconda mano: nel prodotto non si toccano senza il testo primario.

### Già scritto il 02/09 (non ripetuto qui)
La sezione del 02/09 copre: le soglie normative (UNI 9916, DIN 4150-3, USBM RI-8507, D.Lgs 447/1995 rumore, D.Lgs 155/2010 polveri), la taratura (fonometri classe 1, sismografi, laboratori LAT/ARPA), il contenuto generale del rapporto ARPA (piano di monitoraggio, frequenza da AIA, firma di tecnico competente) e un primo elenco di produttori/software (Instantel, Sigicom INFRA, Syscom MR3000C, 01dB+Syscom, Vibrock). Il delta di quel giorno ha già verificato su `sentinella-data.js`: preset di soglia con `daVerificare`, distinzione airblast/rumore, taratura con CSV andata/ritorno, `reportConformita` a quattro esiti, PM10 come tipo senza limite giornaliero, nessun preset per le classi acustiche. Questa ricerca **non ripete** quei punti: si concentra sui FILE che escono dallo strumento, sul contenuto puntuale del rapporto del perito (planimetria, legge di attenuazione, classificazione edificio, chi firma/a chi va/con che frequenza) e sui software di gestione (presentazione, tracciabilità, gestione evento non valido).

### 1. I sismografi e il formato dei file esportati

**Instantel (Minimate/Minimate Plus/Micromate/Blastmate III)** [seconda mano]: cinque modalità di registrazione — Single Shot, Continuous, Manual, Histogram, Histogram Combo (fonte: groundvibrationmonitoring.com, Minimate Plus FAQ). Il software **Blastware** (moduli Compliance + Advanced) gestisce, programma e scarica gli eventi; l'analisi dell'evento completo riporta: ora dell'evento, sorgente del trigger, PPV per ogni canale di vibrazione, picco di sovrapressione aerea, frequenze zero-crossing (ZC), picco vettore somma (PVS), accelerazione massima, spostamento massimo (fonte: pagina prodotto Blastware Advanced Module). I file grezzi `.BIN` si convertono con l'Export Wizard di Blastware in ASCII, MATLAB (.mat) o HDF5; gli eventi si esportano anche in XML e in report PDF (fonte: Blastware FAQ). Il software **THOR** (piattaforma desktop, inclusa con ogni strumento) raggruppa/filtra/ordina gli eventi per: numero di serie dello strumento, data, ora, livello di trigger, PPV, tipo di evento, frequenza di campionamento (fonte: Instantel Event Management Software, pagina prodotto THOR). **Vision** è la piattaforma cloud di Instantel (alternativa/affiancata a THOR) per ospitare, riportare e analizzare gli eventi da remoto (fonte: pagina prodotto THOR). Non è stato trovato con WebSearch un elenco pubblico delle colonne esatte del CSV/TXT esportato (separatore, intestazioni letterali): query `Instantel Blastware CSV export column headers PPV frequency separator` non ha restituito una tabella di colonne — solo l'elenco dei CAMPI presenti (sopra), non il file grezzo.

**Sigicom (INFRA C22/D10/S10-S11/Point)** [seconda mano]: registra PPV e frequenza dominante, trasmette in continuo al cloud Sigicom per allerta a soglia automatica e reportistica (fonte: pagina prodotto INFRA C22). I sensori S10/S11 misurano la sovrapressione aerea per la conformità a standard nazionali/internazionali. **INFRA Net** è lo strumento cloud di project management: vista dati in tempo reale online, analisi, creazione report, esportazione delle visualizzazioni (fonte: pagina prodotto S10/S11, sito Sigicom construction-site-monitoring). Non trovato con WebSearch il formato file di export puntuale (CSV/JSON, colonne) di INFRA Net: query `Sigicom INFRA Net API export CSV format columns` non ha restituito una specifica tecnica pubblica.

**Syscom (MR3000/MR3003, ROCK)** [seconda mano]: **SCS (Syscom Cloud Software)** gestisce/visualizza/riporta i dati di ROCK, MR3003, MR3000; ogni strumento MR3000 si associa al cloud con un token univoco e i dati registrati vengono inviati automaticamente a SCS. Esporta in formato binario o ASCII. Include confronto automatico con curve di conformità («compliance-curve comparison») e reportistica automatica, con template di report configurabili per evento o file di fondo (fonte: SCS brochure, pagina Syscom "Your questions answered", Geoengineer.org).

**GeoSIG (GMSplus, software GeoDAS)** [seconda mano]: GeoDAS è applicazione Windows per la configurazione strumento e l'acquisizione dati da qualunque strumento GeoSIG standard; supporta export/import verso vari formati e può collegarsi automaticamente a un database SEISAN esistente. Non trovato con WebSearch il dettaglio delle colonne di export per il monitoraggio da volata specificamente (il manuale GeoDAS trovato è generico sismologia/ingegneria strutturale, non focalizzato su blasting in cava).

**Nomis Seismographs (Mini-SuperGraph II)** [seconda mano]: software **SuperGraphics Suite** per reportistica e analisi da semplice a complessa di dati sismici e sonori; nessun dettaglio di formato file trovato con WebSearch (query `Nomis SuperGraphics CSV export format columns` non ha restituito specifiche).

**White Industrial Seismology (Mini-Seis III Pro)** [seconda mano]: software **Seismograph Data Analysis** comunica e scarica dati dagli strumenti via connessione locale o remota (TCP/IP); **Alpha-Blast** ottimizza i tempi di ritardo analizzando combinazioni per frequenza, spostamento e rapporto alta/bassa frequenza. Servizio di **Reporting automatico**: se lo strumento ha un dispositivo di accesso remoto, i dati vengono inviati automaticamente e possono generare notifiche email/SMS ai destinatari designati (fonte: pagina "Automatic Reporting Service"). Non trovato con WebSearch il formato colonne del file esportato.

**Riassunto sul punto 1**: tutti i produttori dichiarano PPV per asse, frequenza (dominante o zero-crossing), vettore somma/picco vettore somma, sovrapressione aerea, ora/data e identificativo dello strumento come contenuto minimo comune dell'evento; **nessuna ricerca ha restituito una tabella pubblica letterale di intestazioni-colonna e separatore** per nessuno dei sei produttori — è un limite dichiarato di questa ricerca, non un'assenza del dato nel mondo (probabilmente i manuali tecnici completi con le tabelle di export non sono indicizzati o richiedono accesso diretto al PDF, che WebFetch non può leggere qui).

### 2. Il rapporto del perito/tecnico dopo un monitoraggio

**Legge di attenuazione / "legge di sito"** [seconda mano, fonte principale: Roberto Folchi, "Monitoraggio delle onde elastiche", Metrologia Applicata, nitrex-explosives-engineering.com]: la velocità di vibrazione in punti diversi da quelli misurati si stima per estrapolazione dalla curva di decadimento (legge di sito) del sito nella direzione specifica, oppure per interpolazione di misure fatte lungo un allineamento. La regressione statistica richiede cautele per massimizzarne l'affidabilità e va accompagnata dall'indicazione dei limiti di rappresentatività (non è stata trovata con WebSearch la formula esplicita `PPV = K·(D/√Q)^-α` scritta per esteso in una fonte italiana consultabile: query `"legge di sito" K alpha scaled distance regressione minimi quadrati cava` ha restituito solo pagine generiche sul metodo dei minimi quadrati, non la formula applicata al caso volate — il documento Folchi la tratta ma il contenuto integrale non è stato recuperabile via ricerca, solo il titolo/riassunto).

**UNI 9916** [seconda mano]: norma (revisione 2014) "Criteri di misura e valutazione degli effetti delle vibrazioni sugli edifici". Copre: scelta del metodo di misura, trattamento dati, valutazione dei fenomeni vibratori rispetto alla risposta strutturale e all'integrità architettonica; obiettivo di ottenere dati comparabili fra misure fatte in tempi diversi sullo stesso edificio o su edifici diversi con la stessa sorgente. Range di frequenza 0,1–150 Hz. Tratta i "danni di soglia" (fessurazioni, distacco di intonaco) e non i danni strutturali pericolosi. Si applica a edifici vicini a traffico veicolare/ferroviario, cantieri, attività industriali (fonte: Ingenio-web, Promos Ricerche, ediliziainrete.it).

**DIN 4150-3** [seconda mano]: divide gli edifici in classi (industriale/commerciale, civile, sensibile) su bande di frequenza 4-8/8-30/30-100 Hz con velocità massime combinate: industriale 20/20-40/40-50 mm/s, civile 5/5-15/15-20 mm/s, sensibile 3/3-8/8-10 mm/s (valori indicativi riportati da fonti secondarie, non dal testo della norma). Distingue misura a livello di fondazione (dove entra l'energia vibratoria, curve limite applicate direttamente) da misura all'ultimo piano (soglia consigliata 2,5 mm/s residenziale, 10 mm/s industriale/commerciale per vibrazione continua di lunga durata) (fonte: micromega-dynamics.com, svantek.com, oculustech.au — tutte fonti commerciali di seconda mano, valori da verificare sul testo DIN originale).

**SN 640312a (norma svizzera)** [seconda mano]: usata insieme a Circolare 23/07/1986; permette la scelta fra vibrazione di breve o lunga durata e il tipo di edificio (industriale, residenziale, monumento, tubazione) (fonte: guida.cfsl.ch, pagine commerciali PCE Instruments). Nessun valore numerico di soglia trovato con WebSearch per questa norma.

**Contenuto del rapporto** [seconda mano, generico ambientale non specifico a volate]: il piano di monitoraggio ambientale (PMA) dichiara punti di misura, frequenza, parametri, metodologie; ARPA valuta con **cadenza trimestrale** i rapporti del proponente su vari componenti ambientali (fonte: ARPAT piano di monitoraggio vibrazioni, va.mite.gov.it). Non è stata trovata con WebSearch una fonte che descriva puntualmente la cadenza specifica «per volata / mensile / annuale» per il rapporto di monitoraggio da volata in cava in Italia (query `relazione mensile monitoraggio vibrazioni cava trasmessa Comune ARPA committente tecnico abilitato firma cadenza` non ha restituito un documento con questo dettaglio esplicito) — è verosimile che vari per prescrizione autorizzativa (AIA/autorizzazione cava), come già scritto nella sezione del 02/09, ma questa ricerca non ha trovato un valore standard.

**Classificazione danno edificio** [seconda mano]: il rapporto tra effetti vibratori e danno indotto alle strutture dipende da molti parametri — dimensioni edificio, materiali, metodo costruttivo, tipo di fondazione; le norme correlano il livello di danno alla PPV tramite curve di correlazione empirico-statistiche (fonte: Ediltecnico.it "Vibrazioni e danni edifici").

### 3. I software di monitoraggio: presentazione, tracciabilità, eventi non validi

**Presentazione grafica** [seconda mano]: i software di monitoraggio scaricano i dati e generano report grafici/numerici con i valori di picco registrati, le frequenze e altri dati importanti; le versioni avanzate fanno analisi spettrale FFT, filtraggio dati, modifica di scale, regressioni lineari. Alcuni sismografi (fonte: geonoise.com, geonica.com) dichiarano conformità a USBM/OSMRE, DIN 4150, UNE 22381 (Spagna) con funzioni «USBM/OSM/DIN Analysis» e FFT a schermo per revisione e stampa. Esiste un programma pubblico statunitense — **OSMRE BIVDEP** (Blast-Induced Vibration Data Evaluation Program) — dedicato proprio alla valutazione dei dati di vibrazione da volata rispetto alle curve regolatorie (fonte: osmre.gov, documentazione tecnica), a conferma che il confronto grafico PPV/frequenza con curve normative è una funzione standard del settore, non solo dei produttori commerciali privati.

**Sovrapressione aerea in dB(L)**: gli strumenti che misurano il rumore impulsivo da volata registrano tipicamente fino a 2 Hz in basso; queste misure "scala lineare" si esprimono in dB(L). Il limite USBM RI-8485 / OSMRE è 133 dB(L) (banda 2-200 Hz) per la sicurezza strutturale — a 133 dB corrisponde una sovrapressione di circa 0,015 psi, associata alla caduta di scaglie di intonaco sciolto. Questo livello, pur «sicuro» per la struttura, genera comunque lamentele significative dei residenti (fonte: cedd.gov.hk, revey associates handout).

**Gestione evento non valido / trigger da fonte estranea** [seconda mano, generico]: i sismografi da volata iniziano a registrare a soglie di trigger impostate abbastanza basse da rilevare la volata ma abbastanza alte da evitare registrazioni accidentali da attività non correlate (es. attività umana nei pressi). Sistemi avanzati distinguono eventi originati dal sito operativo da eventi estranei (camminare, tagliare l'erba, camion su strada) confrontando i livelli di vibrazione fra più stazioni: se un evento non compare in modo coerente su più postazioni, viene scartato come non correlato al sito (fonte: imseismology.org, softdb.com master-trigger). Non è stata trovata con WebSearch una descrizione puntuale di COME un singolo software commerciale (Instantel/Sigicom/Syscom) marca esplicitamente un evento come «non valido» nell'interfaccia (es. un flag «rejected» visibile nell'elenco eventi) — solo il principio generale del filtro multi-stazione.

**Tracciabilità/taratura nel software** [seconda mano, generico gestione calibrazione — non specifico al settore blast]: i sistemi di gestione calibrazione tracciano ogni scadenza, certificato, limite di tolleranza e non conformità; ogni interazione (inserimento dati, caricamento certificato, modifica scadenza, perfino la sola visualizzazione) viene registrata con utente e timestamp in un registro immutabile; ogni evento di calibrazione è collegato a un certificato digitale con identità strumento, data, esito, tecnico (fonte: articoli generici su calibration management software — nessuna fonte specifica trovata per un prodotto di monitoraggio blast che documenti pubblicamente questa funzione).

### 4. Le parole del mestiere in italiano (come le usano fonti reali)

Dalle fonti trovate: **vettore somma** — dal seismogramma (una componente verticale + due orizzontali ortogonali) si ricostruisce il vettore misurato e la sua variazione nel tempo (fonte: distad.unimi.it, sismografo.pdf). **Sovrapressione** — le onde di sovrapressione da esplosione sono un contributo importante alla sismicità indotta; l'assenza di sovrapressione aerea aumenta l'attenuazione dei livelli di vibrazione (fonte: stessa area di ricerca accademica). **Volata** — il monitoraggio della sismicità da cariche esplosive in gallerie minerarie è condotto con geofoni per registrare i valori di picco della velocità particellare in funzione della distanza scalata (fonte: ricerca accademica generica). **Sismografo** — strumento per la registrazione di onde elastiche; il moto del terreno è rilevato da un sensore chiamato geofono, amplificato e filtrato elettronicamente (fonte: Folchi). **Taratura** — verifiche periodiche di controllo del trasduttore, con normativa italiana che indica un intervallo di verifica annuale (fonte: Folchi). Non è stato possibile, con WebSearch, reperire un fac-simile o un estratto letterale di un rapporto/referto reale di monitoraggio da volata in cava italiana che usasse insieme i termini «postazione», «recettore», «referto», «legge di sito» nel loro contesto naturale — le ricerche mirate (query `"referto" sismografo volata cava "postazione" "recettore" tecnico competente relazione esempio`) hanno restituito solo documenti di relazione sismica geotecnica (per l'edilizia, non per il monitoraggio da volata), fuori tema.

### Fonti

| URL | Che cosa dice | Fiducia |
|---|---|---|
| https://www.instantel.com/products/thor | THOR desktop, Vision cloud; THOR ordina eventi per serial number/data/ora/trigger/PPV/tipo evento/sample rate | media (sito produttore) |
| https://www.instantel.com/blastware-faqs | Blastware: export BIN→ASCII/MAT/HDF5, XML, report PDF | media (sito produttore) |
| https://www.instantel.com/media/1756/download (Blastware Advanced Module) | Contenuto evento: ora, trigger source, PPV per canale, picco sovrapressione, frequenze ZC, PVS, accelerazione/spostamento max | media (sito produttore) |
| https://groundvibrationmonitoring.com/ground-vibration-monitoring-recording/ | Cinque modalità di registrazione Instantel (Single Shot, Continuous, Manual, Histogram, Histogram Combo) | media |
| https://www.sigicom.com/products/vibration/infra-c22-wireless-vibration-monitor/ | INFRA C22: PPV e frequenza dominante trasmessi al cloud per allerta automatica | media (sito produttore) |
| https://www.sigicom.com/products/noise/s10-s11-air-blast-sensor/ | INFRA Net: vista dati real-time, analisi, report, export | media (sito produttore) |
| https://www.syscom.ch/wp-content/uploads/SCS-brochure.pdf | SCS: gestione cloud MR3000/MR3003/ROCK, token univoco, export binario/ASCII, confronto curve di conformità | media (brochure produttore) |
| https://www.geosig.com/Software/GeoDAS | GeoDAS: applicazione Windows, acquisizione/configurazione, export/import multi-formato, link a SEISAN | media (sito produttore) |
| https://nomis.com/home/ ; supergraphics-suite.software.informer.com | Nomis Mini-SuperGraph II + SuperGraphics Suite, nessun dettaglio formato file | bassa (nessun dettaglio tecnico) |
| https://whiteseis.com/automatic-reporting-service/ | White: Seismograph Data Analysis, Alpha-Blast, reporting automatico con notifica email/SMS | media (sito produttore) |
| https://www.nitrex-explosives-engineering.com/wp-content/uploads/2018/10/03-Monitoraggio-delle-onde-elastiche.pdf (Folchi) | Legge di sito per estrapolazione/interpolazione, vettore somma, taratura annuale, sismografo/geofono | media (solo riassunto recuperato, non il testo integrale) |
| http://geo-tec.it/wp-content/uploads/2015/02/Norme-UNI-9916-04-...pdf (titolo) + ingenio-web.it | UNI 9916: criteri di misura, range 0,1–150 Hz, danni di soglia, revisione 2014 | media |
| https://micromega-dynamics.com/din-4150-3-vibration-limits-buildings/ | DIN 4150-3: classi edificio, bande di frequenza, valori mm/s per fondazione/ultimo piano | media (sito commerciale, valori da verificare sul testo originale) |
| https://guida.cfsl.ch/panoramica-della-guida/ambiente-di-lavoro/vibrazioni-nell_ambiente-di-lavoro/valori-limite-per-vibrazioni | SN 640312a: breve/lunga durata, tipo edificio, nessun valore numerico trovato | bassa |
| https://www.arpat.toscana.it/.../piano-di-monitoraggio-ambientale-vibrazioni | PMA: contenuti, valutazione ARPA con cadenza trimestrale (generico ambientale, non specifico volate) | media |
| https://www.cedd.gov.hk/filemanager/eng/content_417/er232links.pdf | dB(L), limite USBM 133 dB(L) 2-200 Hz, 0,015 psi | media |
| https://higherlogicdownload.s3.amazonaws.com/.../TAC%20-%202013%20VIBRATION%20AND%20AIR-OVERPRESSURE... (Revey Associates) | 133 dB(L) sicuro strutturalmente ma genera lamentele residenti | media |
| https://www.osmre.gov/sites/default/files/inline-files/OSMRE_BIVDEP%202.0%20Documentation.pdf | BIVDEP: programma USA per valutare dati vibrazione da volata contro curve regolatorie | media |
| https://imseismology.org/xes/ ; https://www.softdb.com/monitoring/advanced-features/master-trigger/ | Trigger multi-stazione per scartare eventi non correlati al sito (camion, attività umana) | media |
| https://ediltecnico.it/vibrazioni-e-danni-agli-edifici/ | Correlazione danno-PPV dipende da molti parametri edificio, curve empirico-statistiche | media |

### Domande per il delta (sul MECCANISMO, non risposte)

1. In Sentinella, chi legge un file/CSV di eventi esportato da un sismografo (Instantel/Sigicom/Syscom/altro), e quali colonne si aspetta? C'è già una funzione di import per un formato di uno di questi produttori, o l'unico ingresso è il CSV "a colonne libere" già censito il 02/09 (T1)?
2. Chi decide, quando manca, la frequenza dominante di un evento — la calcola l'app da un waveform, o è sempre un valore che l'utente inserisce a mano leggendo lo strumento?
3. C'è un posto dove Sentinella distingue un evento "valido" da uno "trigger spurio" (mezzo, temporale) — un campo di stato dell'evento, o ogni riga registrata è trattata come una volata vera?
4. Chi calcola/mostra una legge di attenuazione (PPV in funzione della distanza scalata) per un fronte/cava, con la sua regressione — esiste una funzione che fa questo conto, o la distanza scalata (`SD = R/√W`, già trovata il 02/09) è l'unico calcolo presente senza la curva/regressione che ne deriva?
5. Il report di volata/monitoraggio che Sentinella genera cita la classificazione dell'edificio/ricettore (industriale, civile, sensibile) usata per scegliere la soglia, o resta implicita nel numero scelto da chi registra il ricettore?
6. Il vettore somma (PVS/risultante triassiale) è un campo distinto dal singolo PPV per asse nel modulo dati, o Sentinella lavora solo con un valore di PPV già "riassunto" dall'utente?
7. Chi traccia, in Sentinella, che un certo export/report è stato scaricato e da chi (un log di accesso ai documenti), rispetto alla sola scadenza di taratura già censita il 02/09?

### Il delta, fatto da chi ha il codice in mano (04/09, verificato contro il commit `70c66b87`)

Risposte alle sette domande aprendo le funzioni di `apps/sentinella/sentinella-data.js`,
non cercando i nomi del mondo nel codice. Ogni «non c'è» porta il comando.

1. **Chi legge un file di eventi.** `preparaLetture(righe, mappa)`: un
   lettore GENERICO con una mappa di colonne scelta dall'utente (`colData`,
   `colOra`, `colValore`, `conIntestazione`), con il ripiego «data e ora nella
   stessa cella», la firma anti-doppione (`firmaLettura`) e `unisciLetture`.
   Non esiste un import per marca: `grep -ci "instantel\|sigicom\|syscom" apps/sentinella/sentinella-data.js apps/sentinella/index.html`
   → 0 e 0. Cioè la scelta di prodotto è già «qualunque CSV, l'utente indica
   le tre colonne»; il mondo dice che un evento porta anche PPV per asse,
   frequenza e sovrapressione, e qui entra **un valore solo** per lettura.
2. **La frequenza dominante.** Non è un campo della lettura né della volata:
   `grep -n "frequenz" sentinella-data.js` trova solo la frequenza del
   PROGRAMMA (ogni N giorni: `etichettaFrequenza`) e le etichette delle soglie
   DIN («residenziale, <10 Hz») in `SOGLIE_NORMA`. La banda di frequenza è
   dunque scelta a mano da chi imposta la soglia (la chiave `din-res-fond` /
   `din-res-alto`), non letta dall'evento. Nessuno la calcola: non c'è un
   waveform.
3. **Evento valido / trigger spurio.** Non c'è uno stato dell'evento:
   `grep -n "spurio\|trigger" sentinella-data.js` → 0. Esiste
   `correggiLettura(l, nuovo, quando)` (la correzione tracciata di un valore)
   ed esiste `coincidenzaVolata(volate, dataISO)` /
   `lettureVibrazioniDelGiorno`, cioè il collegamento «questa lettura è di
   quel giorno di volata»: una lettura senza volata quel giorno è un candidato
   trigger spurio, ma il prodotto non lo dice.
4. **La legge di attenuazione.** `scaledDistance(R, W)` e `caricaMax(R, SD)`
   ci sono; la regressione NO, per scelta scritta nel codice (commento sopra
   `refertoDaVolata`: «la regressione la fa Genesi, che ce l'ha già», e il
   vincolo T9: una volata prevista non entra mai nei referti). Il ponte
   Sentinella → Genesi porta i referti (`refertiDaVolate`, `csvRefertiGenesi`).
5. **La classe dell'edificio.** ⚠️ Prima risposta sbagliata e corretta
   rileggendo la pagina: il campo `classe` del ricettore («I», «III», «V») è
   la **classe acustica** della zonizzazione (la pagina lo scrive così, «classe
   acustica», nella scheda e nel report), non la classe DIN dell'edificio. La
   classe DIN sta nella CHIAVE della soglia scelta a mano (`SOGLIE_NORMA`:
   `din-res-fond`, `din-sens-fond`, `din-ind-fond`) e nel `tipo` del ricettore
   («abitazione», «scuola», «confine»); la soglia efficace la decide
   `sogliaEfficace(m, ricettori)` (vince quella del ricettore se l'unità
   coincide; nessuna conversione). Nel report per l'ente entrano il tipo, la
   distanza e la classe acustica (`grep -n "classe acustica" apps/sentinella/index.html`
   → scheda e report), non la parola «DIN residenziale»: la norma scelta si
   legge solo dall'etichetta della soglia.
6. **Il vettore somma.** Un solo `valore` per lettura e una sola `ppvMisurata`
   per volata (`ppvDiVolata`): non esistono i tre assi né la risultante
   (`grep -n "ppvX\|risultante\|vettore" sentinella-data.js` → 0). Chi
   inserisce sceglie che cosa scrivere (di solito il PVS letto dallo strumento).
7. **Chi ha scaricato.** Nessun registro degli scarichi: i CSV/report escono
   dal browser senza traccia (`grep -n "scaricat" apps/sentinella/index.html`
   → solo il gancio di prova dei banchi). La sola tracciabilità è la taratura
   dello strumento (`statoTaraturaStrumento`, `contaCoperture`).

**Che cosa ne segue** (candidati, non cantieri; nessun numero di norma entra
in una schermata senza il testo primario):
- (a) ✅ **fatta il 04/09, sera** — la mappa di `preparaLetture` accetta
  cinque colonne facoltative (`proponiColonneEvento`: tre assi, frequenza,
  sovrapressione); il valore resta la colonna scelta, oppure la risultante
  √(L²+T²+V²) dai tre assi (`risultanteAssi`, mai a due assi); `campiEvento`
  è l'unico elenco di che cosa viaggia con la lettura (ingresso, schermate,
  report, CSV con `evento` e `valore_da` in coda); `provenienzaValore` dice
  quale colonna ha giudicato. Misurato: run-kpi +10, banco
  `sentinella-evento-import` 52/0 — il file di prova a otto colonne rientra
  con i suoi assi nella serie, nel report e nel CSV. La riga 6 qui sopra
  («non esistono i tre assi né la risultante») è invecchiata da quel giorno.
- (b) ✅ **fatta il 04/09** — la lettura dichiarata non valida con la
  ragione (`RAGIONI_ANNULLAMENTO`: mezzo di passaggio, temporale, prova dello
  strumento, altro con testo), `annullaLettura`/`ripristinaLettura` simmetriche
  a `correggiLettura` (il valore resta scritto), `letturaValida` in un filtro
  solo (`lettureLeggibili`) da cui ereditano tutti i conti, che dichiarano
  `annullate`; `letturaSenzaVolata` è un suggerimento a tre risposte, non
  un'esclusione. Misurato: `riepilogoConformita` cambia solo con la
  dichiarazione (run-kpi 2531 → 2545), banco `sentinella-annullate` 60/0 e
  controprova che cade (6 su 60) quando il filtro viene tolto.
- (c) ✅ **fatta il 04/09, notte** — la frequenza è un campo della lettura
  (`extra.freq`, dalla colonna dell'import) e `frequenzaFuoriBanda` dichiara
  quando è fuori dalla banda della soglia applicata; la banda la dichiarano i
  preset (`bandaPreset`, trascritta dall'etichetta) e il punto ricorda il
  preset da cui nasce la soglia (`sogliaPreset`). ⚠️ Non «sceglie la banda
  DIN al posto della chiave»: il limite dell'altra banda sarebbe un numero di
  norma di seconda mano, quindi Sentinella dice «fuori banda» e rimanda alla
  norma. Misurato: run-kpi +4, banco `sentinella-evento-import` 56/0.
- (d) la NORMA della soglia (l'etichetta di `SOGLIE_NORMA`, «DIN
  residenziale, <10 Hz») scritta nel foglio per l'ente accanto al numero, così
  chi legge sa da dove viene il limite: costo basso; misura: il banco
  `sentinella-report-dichiarazioni` legge l'etichetta nel testo del foglio.
  Da verificare prima se il foglio la scrive già per un'altra via.

---

## Ricerca del 2026-09-05 — il «diario delle volate» e la relazione periodica per l'ente (metà sul mondo)

**Strumento**: solo `WebSearch` (sei ricerche); `WebFetch` risponde `EGRESS_BLOCKED`,
quindi **nessuna pagina primaria è stata letta**: ogni riga qui sotto è di
seconda mano, dai riassunti dei risultati, e va marcata così. **Che cosa esiste
già in Sentinella**: non verificato da questa ricerca — il delta lo fa chi ha il
codice in mano (vedi le domande in fondo). La sezione del 02/09 copre già le
norme (UNI 9916, DIN 4150-3, USBM) e i software dei produttori: qui si guarda
**il documento che l'ente riceve e ciò che l'ispettore chiede**.

### Fatti dal mondo

1. **Il «diario delle attività» quando si usano esplosivi.** Le linee guida di
   ARPA FVG per il piano di monitoraggio di un'attività estrattiva soggetta a
   VIA dicono che, quando l'attività usa esplosivi, tenere un diario è **parte
   integrante del monitoraggio ambientale**: vi si registrano **modalità e
   frequenza delle volate eseguite**, i **riferimenti alle comunicazioni fatte
   alle autorità competenti o alla popolazione**, e gli **eventuali reclami
   ricevuti**. Il diario resta **a disposizione per i controlli** delle autorità.
   [seconda mano: arpa.fvg.it, LG21.02 «Linee guida concernenti la redazione di
   un piano di monitoraggio… attività estrattiva»]
2. **Le norme che il piano cita**: UNI 9614 (vibrazioni negli edifici e criterio
   del disturbo alle persone) accanto a UNI 9916 (effetti sugli edifici). Cioè
   il piano guarda **due** cose: il danno e il disturbo. [seconda mano: stessa
   linea guida]
3. **Il rapporto post-operam sulle vibrazioni**, quando è prescritto, va
   trasmesso all'autorità regionale competente e contiene **i valori misurati**,
   **considerazioni sulle soglie di percezione e sull'interferenza con le
   attività**, e **le eventuali misure di mitigazione da adottare**. [seconda
   mano: va.mite.gov.it, relazione tecnica di un piano di monitoraggio rumore
   e vibrazioni — opera infrastrutturale, non una cava]
4. **La cadenza**: le fonti trovate non danno una cadenza generale per le cave
   («entro il …» non è uscito in nessun risultato): la cadenza è **una
   prescrizione dell'autorizzazione**, caso per caso. Per i PMA ambientali
   generici ARPAT indica una valutazione **trimestrale** (già scritto il 02/09).
   [seconda mano; e l'assenza di un risultato NON prova che una cadenza standard
   non esista]
5. **La polizia mineraria** (DPR 128/1959, D.Lgs 624/1996, D.Lgs 81/2008) fa
   ispezioni in cava, e fra le attività elencate ci sono la **sorveglianza
   sull'uso degli esplosivi**, le verifiche periodiche e straordinarie degli
   impianti, e la **previsione e misura dei livelli di vibrazione indotti dagli
   esplosivi**. Prima della visita l'ufficio **esamina il registro dei
   rapporti** e annota sul registro l'avvenuto esame. [seconda mano:
   regione.piemonte.it, cittametropolitana.mi.it, osservatorioamianto.it]
6. **Il verbale della volata per la pubblica sicurezza**: nelle procedure di
   questura citate, il questore può prescrivere **un verbale dettagliato delle
   operazioni di sparo** (luogo, data, …) oppure, in alternativa, la
   **dichiarazione del fochino firmata da tutti i presenti** nelle diverse fasi
   e **la registrazione della centralina sismo-acustica** che misura vibrazioni
   e sovrapressione aerea. Cioè la misura strumentale può **valere come
   documentazione** della volata. [seconda mano: sicurezzapubblica.wikidot.com,
   scuolaedile.com «Prescrizioni esplosivi» — fonti secondarie, da verificare
   prima di scriverle in una schermata]
7. **La tabella tipica della relazione** (dalle relazioni tecniche di
   monitoraggio trovate, gallerie e grandi opere, non cave): per ogni evento
   **PPV per asse e vettore somma, frequenza dominante (FFT), confronto con la
   soglia della classe di edificio** (DIN 4150-3 ripresa in appendice B della
   UNI 9916); nei casi di esplosioni il **fattore di cresta** può arrivare a 6.
   [seconda mano: va.mite.gov.it «Approfondimento relativo alla tematica
   Vibrazioni»; vielleacustica.it; svantek.it]

### Fonti (risultati di ricerca, nessuna letta per intero)

| URL | Che cosa dice | Fiducia |
|---|---|---|
| https://www.arpa.fvg.it/documents/3561/LG21.02_e2_r1_Redaz_piano_monitor_attivita_estrattiva_01_paFXjlI.pdf | LG ARPA FVG: diario delle volate (modalità, frequenza, comunicazioni, reclami), a disposizione dei controlli; UNI 9614 + UNI 9916 | alta (ente pubblico, linea guida ufficiale) — **ma non letta** |
| https://www.arpa.fvg.it/temi/temi/supporto-tecnico-e-controlli/pubblicazioni/linee-guida-concernenti-la-redazione-di-un-piano-di-monitoraggio-relativo-alla-procedura-di-valutazione-di-impatto-ambientale-via-di-unattivita-estrattiva/ | la pagina che presenta la linea guida | alta |
| https://va.mite.gov.it/File/Documento/474594 | relazione tecnica di un PMA rumore e vibrazioni: contenuto del rapporto post-operam | media (documento di un'opera, non una cava) |
| https://va.mite.gov.it/File/Documento/743447 | approfondimento «Vibrazioni»: appendice B UNI 9916 → DIN 4150; fattore di cresta | media |
| https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/polizia-mineraria | attività della polizia mineraria, fra cui la misura delle vibrazioni da esplosivo | alta (ente) |
| https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/Polizia-mineraria | ispezioni, verbali, sanzioni | alta (ente) |
| http://sicurezzapubblica.wikidot.com/esplosivi · https://www.scuolaedile.com/public/Seminario_21_11_11/07-17%20Prescrizioni%20esplosivi.pdf | verbale della volata o dichiarazione del fochino + registrazione della centralina | bassa (fonti secondarie) |
| https://www.arpa.marche.it/rumore-e-vibrazioni · https://www.arpalombardia.it/temi-ambientali/rumore-e-vibrazioni/ | ruolo di ARPA: supporto tecnico a Comuni e Province | media |

### Domande per il delta (sul MECCANISMO — nessuna risposta qui)

1. Il registro volate di Sentinella è il «diario» della linea guida? Cioè: chi
   registra, accanto a una volata, **la comunicazione fatta** (a chi, quando,
   con quale riferimento) e **il reclamo ricevuto** — esiste un campo o un
   collegamento fra la volata e la collezione dei reclami, o le due vivono
   separate e si accostano solo per data (la «coincidenza» già censita)?
2. Il report per l'ente (`reportConformita`) porta **le due letture** — il danno
   agli edifici (UNI 9916/DIN) e il **disturbo alle persone** (UNI 9614) — o solo
   la prima? Se il disturbo non c'è, il report lo dichiara o tace?
3. Il report contiene una sezione **«misure di mitigazione»** (che cosa si è
   fatto o si farà dopo un superamento) o si ferma al verdetto? Chi la
   scriverebbe — le azioni correttive del ponte con Scudo sono già quel posto?
4. Il report è **per periodo prescritto** (trimestre, semestre, anno) con la
   data di trasmissione e il destinatario **scritti sul documento**, e c'è un
   posto che ricorda **quando scade la prossima trasmissione** (come per le
   tarature), o la cadenza vive solo nella testa di chi lo manda?
5. Per la polizia mineraria: esiste una stampa del registro volate «da tenere
   a disposizione» con **modalità e frequenza** delle volate (numero di volate
   nel periodo, chili per ritardo, fronte) e l'esame dell'ispettore annotabile?
6. La registrazione della centralina può «valere come verbale»: il foglio di
   una volata di Sentinella porta insieme **i dati della volata e la misura
   dell'evento** (PPV per asse, vettore somma, frequenza, aria) con lo
   strumento e la taratura, così che un fochino possa allegarlo?

⚠️ **Il delta non è scritto qui di proposito** (regola del 14/08): lo fa il
ciclo con il codice in mano, partendo dal meccanismo — `reportConformita`,
`taratureDelReport`, la collezione `reclami`, `volateDelGiorno`/`coincidenzaVolata`,
il foglio di stampa della volata — non cercando «diario» o «UNI 9614» nel codice.

### Il delta, fatto da chi ha il codice in mano (05/09, verificato contro il commit `0c807ba3`)

Risposte alle sei domande aprendo `apps/sentinella/sentinella-data.js` e
`apps/sentinella/index.html`, dal meccanismo; ogni «non c'è» col comando.

1. **Il diario.** Il registro volate (`volate/{id}`: data, fronte, nFori,
   kgTotali, kgMaxRitardo, distanzaRicettore, esito, stato, la previsione da
   Genesi e la PPV misurata) e la collezione `reclami/{id}` (data, ora, tipo,
   ricettoreId, chi, descrizione, **azione**, **stato**) ci sono tutt'e due, e
   il report per periodo li porta insieme (`reportConformita` → `volate`,
   `reclami`). Il legame fra una volata e un reclamo è **solo la data**
   (`coincidenzaVolata`, con l'avviso che una coincidenza non è una causa).
   **La comunicazione fatta** (a chi, quando, con quale riferimento) NON c'è:
   `grep -ci "comunicat\|preavvis" apps/sentinella/sentinella-data.js
   apps/sentinella/index.html` → **0 e 0**. È la terza voce del diario della
   linea guida, e manca.
2. **Le due letture.** Il report giudica la soglia del punto (o del ricettore):
   è il danno agli edifici. Il disturbo alle persone (UNI 9614) non c'è e il
   documento non dice di non valutarlo: `grep -ci "9614\|disturbo"` → **0 e 0**.
3. **Le mitigazioni.** `grep -ci "mitigazion"` → **0 e 0**. Le azioni
   correttive nate da un superamento vivono in Scudo (ponte T7,
   `bozzaAzioneSuperamento`, `azioniDiOrigine`), ma il report **non le
   legge**: un superamento esce col numero e senza «che cosa si è fatto».
4. **La cadenza.** C'è, e vive negli **adempimenti**: `periodoMesi` e
   `giorniConsegna`, e `periodoAdempimento` (T2f) fa partire il report sul
   periodo ricavato dalla scadenza — la dimostrazione ha «Relazione annuale
   emissioni · ARPA». Quello che il documento NON scrive è il **destinatario**
   e la **data di trasmissione**: `grep -ci "destinatario\|trasmission"` →
   **0 e 0** nel modulo; la pagina stampa il periodo e la data di generazione.
5. **Il registro a disposizione dell'ispettore.** C'è a metà: il report per
   periodo ha la sezione «Volate del periodo» (data, fronte, fori, kg totali,
   kg max/ritardo, distanza, SD) e il registro esce in CSV
   (`csvRegistroVolate`). Una stampa del solo registro non c'è, e non serve
   finché il report la contiene.
6. **La scheda della volata con la misura.** Non c'è una stampa per singola
   volata: `grep -n "scheda della volata\|schedaVolata\|vol-scheda"
   apps/sentinella/index.html` → **0** (la frase «scheda della volata» sta solo
   nel reclamo d'esempio). La misura dell'evento per asse (`campiEvento`,
   `risultanteAssi`) e la taratura dello strumento esistono; quello che manca è
   il foglio che le mette accanto ai dati della volata.

**Che cosa ne segue** (candidati, in ordine di costo, nessuno aperto):
- (a) ✅ **fatta il 05/09** — `campiComunicazioneVolata`, `descriviComunicazione`,
  `DESTINATARI_COMUNICAZIONE`; tre colonne in coda al CSV del registro
  (censimento aggiornato); azione «Segna la comunicazione» sulla riga; la riga
  e la tabella «Volate del periodo» del report la scrivono, e quando manca
  scrivono «nessuna comunicazione registrata» (`grep -c "descriviComunicazione"
  apps/sentinella/index.html` → 4). run-kpi +3; banchi `sentinella-numeri-tranquilli`
  e `sentinella-report-dichiarazioni` con le prove nuove;
- (b) ✅ **fatta il 05/09** — `PORTATA_REPORT`, una frase in corsivo sotto le
  dichiarazioni del report (`grep -c "PORTATA_REPORT" apps/sentinella/index.html`
  → 2: l'import e l'uso);
- (c) ✅ **fatta il 05/09** — `rispostaSuperamento(azioni, puntoId)` e
  `FRASI_RISPOSTA`; `reportConformita` riceve `azioni` (`null` = Scudo non
  leggibile, che NON è «nessuna») e la scheda del punto in superamento scrive
  «Azioni correttive: …» con lo stato di `statoPonte`
  (`grep -c "rispostaSuperamento" apps/sentinella/sentinella-data.js` → 2);
- (d) ✅ **fatta a metà il 05/09** — `intestazioneOrigineReport(a, p)`: quando il
  report parte da un adempimento il DOCUMENTO scrive «Redatto per l'adempimento
  «…» (ente), periodo dal … al …, scadenza il …», e la riga sparisce appena si
  toccano le date (direbbe il falso). La **data di trasmissione** resta fuori:
  nessuno la registra oggi, ed è un fatto che solo chi invia può scrivere —
  candidato a sé, dopo che il fondatore dice se il report va «segnato come
  trasmesso»;
- (e) **il foglio della singola volata** con dati della volata + misura
  dell'evento + strumento e taratura, «da allegare al verbale» — costo medio,
  e la frase «vale come verbale» NON va scritta sul foglio finché la fonte
  primaria non è letta (le due fonti trovate sono secondarie).
