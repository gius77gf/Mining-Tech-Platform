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
