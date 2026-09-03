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
