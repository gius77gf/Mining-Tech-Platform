# Roadmap Settimana — lun 27/07 → sab 01/08/2026
### v5.0 "SALTO DI QUALITÀ" — costruita sulle 9 ricerche parallele del 26/07

> Direttive del fondatore (26/07): *«questa settimana voglio che si faccia il
> salto di qualità»* · ricerca approfondita su ogni app · **estetica del core
> copiata al 100% su tutte le app, con il colore di ognuna come dominante** ·
> **lavoro in contemporanea su tutte e sei le app** · niente revisione serale,
> al suo posto ricerca continua · tutto curato nei minimi dettagli.

**Come si lavora questa settimana**: in ogni ciclo si tengono aperti **più
cantieri insieme** (un agente per app: i file sono separati, `apps/<nome>/`,
quindi non ci sono conflitti). Si serializza solo ciò che tocca `shared/`,
`docs/` e `vault/`. Cadenza routine: **ogni 3 ore, lun–sab**.

---

## L'ECCELLENZA È LO STANDARD — dottrina permanente
*(fondatore 27/07: «salvale come determinanti per qualsiasi scelta futura»
— versione integrale in `CLAUDE.md`)*

1. **Nulla lasciato al caso**, nemmeno una virgola.
2. **Si parte dai migliori prodotti in circolazione**: si cercano, si
   studiano, si emulano, e poi si fa **meglio di loro**.
3. **Ricerca approfondita prima di ogni scelta**, su tutto.
4. **Confronto affiancato col riferimento, almeno tre iterazioni.** Non ci
   si ferma quando funziona: ci si ferma quando è **eccellente**.

**Sequenza dichiarata dal fondatore**: *questa settimana l'estetica* →
*nei giorni successivi lo standard di ogni funzione e funzionalità*, con
lo stesso livello di approfondimento.

## LO STANDARD DI QUALITÀ — come si giudica "fatto bene"
*(fondatore 27/07: «si può aumentare e di molto la qualità... puoi fare di
meglio». Applicare le variabili di colore NON produce qualità.)*

La qualità percepita nasce da **materia e profondità**, non dalla tinta:
1. **Luce stratificata**: non un gradiente solo, ma luce d'ambiente +
   riflesso sul bordo alto + ombra propria + ombra proiettata. Gli oggetti
   devono avere spessore, non essere rettangoli colorati.
2. **Bordi che catturano la luce**: bordo alto più chiaro, basso più scuro,
   come un oggetto illuminato dall'alto (la riga `::before` del core).
3. **Aloni d'ambiente** nella tinta dell'app: atmosfera, non nero piatto.
4. **Alone che segue il mouse** sulle superfici interattive: è la firma
   dinamica del core, oggi assente nelle app.
5. **Micro-profondità** su badge, pillole, bottoni, campi: ognuno col suo
   spessore.
6. **Tipografia**: gerarchia vera, cifre allineate nelle tabelle, titoli col
   trattamento del core.
7. **Movimento**: curve morbide, stati hover/focus/attivo che rispondono.
8. **Ritmo**: spaziature su una scala coerente, nessun "quasi allineato".

**Il metodo che fa la differenza**: dopo ogni modifica, aprire l'app e il
core affiancati, e correggere dove l'app è più povera. **Almeno tre
iterazioni** guarda-correggi-riguarda: la prima versione non è mai quella
buona. Non ci si ferma quando funziona, ci si ferma quando è **bello**.

## BLOCCO 0 — ESTETICA: LE APP DIVENTANO GEMELLE DEL CORE *(trasversale)*
Riferimento vincolante: `docs/SPECIFICA_ESTETICA_CORE.md` (specifica estratta
valore per valore dal core `index.html`). Ogni app cambia **solo** nel colore
dominante. Verifica obbligatoria con screenshot prima/dopo.

- [x] **E1-E6. Le sei app portate al livello del core** ✅ *(27/07)* —
      Scudo, Flotta, Sentinella, Conti, Campo, Terra: struttura del core
      pelo per pelo, palette propria fusa in tutte le superfici, 43
      dialoghi del browser eliminati, icone in SVG, ~40 stati vuoti, oltre
      150 coppie di contrasto verificate. Sette difetti funzionali trovati
      col confronto affiancato e corretti.
- [ ] **E0. CONSOLIDAMENTO in `shared/`** *(in corso)* — la parte comune
      dello stile sale nei fogli condivisi, in ogni app restano solo
      palette e regole specifiche. Aggiunti nello stesso passaggio **tema
      chiaro, modalità sole** (oggi chi la attiva nel core resta al buio
      nelle app) e **scheletri di caricamento**. Verifica immagine per
      immagine prima/dopo: l'aspetto non deve cambiare di un pixel.
- [ ] **E7. Genesi** — allineamento delle parti 2D/HUD al core (la scena 3D
      ha una sua estetica già approvata).
- [ ] **E8. Verifica finale** — le sette pagine affiancate: devono sembrare
      la stessa famiglia, distinguibili solo dal colore.

**Accenti definitivi** (decisi il 27/07; Flotta cambia perché aveva la
tinta identica a Sentinella e le due app non si distinguevano):

| App | Accento | Chiaro | Nota |
|---|---|---|---|
| Campo | `#d3633a` | `#f49c7d` | cotto |
| Scudo | `#8c75dc` | `#b7a8f9` | viola-indaco |
| Terra | `#659b2c` | `#9ac577` | oliva-erba |
| Conti | `#009f8f` | `#4dcebd` | teal profondo |
| Sentinella | `#288ee0` | `#78bcfc` | blu (schiarito per il contrasto) |
| **Flotta** | **`#c360a6`** | **`#e798cd`** | **magenta lampone** |

Regola di leggibilità: l'accento base solo per bordi e pallini, l'accento
**chiaro** è l'unico ammesso per il testo (va corretto `.dw-btn.secondary`,
usato 65 volte, oggi sotto la soglia di contrasto).

## BLOCCO 0-bis — SECONDA ONDATA DI RICERCA *(valore del prodotto)*
Taglio diverso dalla prima ondata: non "cosa manca per legge", ma **cosa
rende il prodotto prezioso per chi lo compra**.
- [ ] `docs/RICERCA_VALORE_PRODOTTO_202607.md` — funzioni ad alto rapporto
      valore/lavoro, i dieci dettagli che fanno sembrare il prodotto curato,
      e il vantaggio dell'ecosistema collegato (un dato inserito una volta,
      utile in cinque posti).
- [ ] `docs/RICERCA_DOCUMENTI_ENTI_202607.md` — il calendario annuale degli
      adempimenti di una cava italiana e quali documenti possiamo generare
      noi: è la funzione per cui il cliente paga volentieri.
- [ ] `docs/RICERCA_CRUSCOTTO_TITOLARE_202607.md` — la vista che fa capire
      in dieci secondi come sta andando la cava, e il centro avvisi unico
      che raccoglie scadenze e anomalie dalle sei app.

## BLOCCO 1 — FONDAMENTA: I DIFETTI REALI TROVATI NEL CODICE
La ricerca ha trovato **difetti concreti**, non solo funzioni mancanti.
Vengono prima di ogni funzione nuova: senza queste basi il resto non regge.

- [x] **F1. Campo — data e turno su ogni registrazione** ✅ *(28/07)* — la
      fondazione di ogni confronto e indicatore.
- [x] **F2. Campo — piano di carico salvato** ✅ *(28/07)* — collezione
      `pianocarico` via SDK: non si perde più al refresh.
- [x] **F3. Campo — produzione in numeri + unità** ✅ *(28/07)* — quantità e
      unità separate: ora è sommabile e sblocca i ponti verso Terra e Conti.
- [x] **F4. Conti — anagrafica clienti** ✅ *(28/07)* — con P.IVA e codice
      destinatario: chiuso il bug dei duplicati che falsavano l'esposizione.
- [x] **F5. Sentinella — serie storica visibile** ✅ *(28/07)* — grafico SVG
      poi portato a livello di strumento di misura (soglia, rombi, fasce).
- [x] **F6. Flotta — scadenze di legge dei mezzi** ✅ *(28/07)* — con
      semaforo, preset normativi modificabili e proposta della ricorrenza.

## BLOCCO 1-bis — I GRAFICI *(dal motore condiviso)*
Piano e motivazioni in `docs/PIANO_GRAFICI.md`. Motore in
`shared/dw-grafici.js` (SVG puro, nessuna libreria).

- [x] **Motore grafici + fluidità** ✅ *(29/07)* — linee/aree con soglia,
      barre, barre ordinate col taglio all'80%, ciambella, sparkline,
      avanzamento con tacca; tooltip, animazione d'ingresso, tre temi,
      tabella «Dati» su ogni grafico. Corretto un difetto che chiudeva il
      tooltip sopra le barre in **tutte e sei** le app.
- [x] **Flotta** ✅ — dove va la spesa, costo di officina per mezzo,
      disponibilità con la tacca del riferimento di settore.
- [x] **Conti** ✅ — previsione incassi 6 mesi, esposizione per cliente con
      la tacca del fido, invecchiamento del credito in barre vere.
- [x] **Terra** ✅ — avanzamento anno con la tacca del pro-quota, volumi per
      mese, volumi per fronte. Vita cava tenuta a mano: è migliore.
- [x] **Scudo** ✅ — copertura formazione per tipo + muro delle scadenze.
- [x] **Sentinella** ✅ — tessera del punto messo peggio con sparkline.
- [x] **Campo** ✅ — scostamento carica per foro, cause di fermo col taglio all'80%, minuti di fermo per giornata.
- [x] **Sbloccati gli andamenti di Flotta** ✅ *(29/07)* — aggiunti il campo
      data sulle voci di costo (le vecchie restano valide, marcate «senza
      data») e la fotografia giornaliera del parco mezzi. Fatti spesa mese
      per mese e disponibilità giorno per giorno, **solo a barre**: una
      linea disegnerebbe i giorni in cui l'app non è stata aperta.
- [ ] **Resta da sbloccare**: la `dataIncasso` vera sulle fatture di Conti,
      oggi ripiegata sulla data di emissione. Finché manca, il grafico
      emesso-contro-incassato NON si fa.

## BLOCCO 2 — LE SEI APP, PROPOSTE DALLA RICERCA *(in parallelo)*
Dettaglio e fonti in `docs/RICERCA_<APP>_202607.md`.

**Scudo** (sicurezza) — `docs/RICERCA_SCUDO_202607.md`
- [x] S1. **Azioni correttive (CAPA)** ✅ *(27/07)* — legame nei due sensi
      con l'evento, stati aperta→in corso→chiusa con esito, dentro il
      semaforo e lo scadenzario esistenti.
- [x] S2. **Near-miss dal telefono** ✅ *(29/07, `7747f2c`)* — quattro tocchi
      senza digitare, opzione anonima vera, azione correttiva in un tocco,
      riepilogo aggregato che sotto le 5 segnalazioni non finge statistiche.
- [x] S3. **Ispezioni e checklist periodiche** ✅ *(29/07, `7747f2c`)* — sei
      modelli riutilizzabili; le voci non conformi generano le azioni di S1
      già collegate, senza doppioni se l'ispezione si riapre.
- [x] S4. **Matrice formazione per mansione + nomine** ✅ *(29/07, `2e4691b`)*
      — risponde a «chi posso mandare domani mattina», col motivo scritto.
      Un corso mancante o scaduto blocca, un DPI mai consegnato avvisa: sono
      cose diverse e restano distinte. Sorvegliante e preposto compresi.
- [x] S5. **Registro DPI per lavoratore** ✅ *(29/07, `2e4691b`)* — consegna,
      addestramento, verbale stampabile; un DPI mai consegnato a chi fa una
      mansione che lo richiede emerge in cima e nomina la mansione.
- [x] S6. **Preset D.Lgs. 624/96** ✅ *(27/07)* — 7 voci specifiche delle
      industrie estrattive, periodicità solo proposta e modificabile.

**Campo** (operazioni) — `docs/RICERCA_CAMPO_202607.md`
- [x] C1. **Assegnazione attività a squadra/mezzo** ✅ *(29/07, `b5ea8fe`)* —
      anagrafica operatori, filtro «senza squadra», vista «cosa tocca a me».
- [x] C2. **Obiettivo di turno e scostamento** ✅ *(29/07, `b5ea8fe`)* — su
      t, m³, viaggi o attività concluse, leggibile durante il turno.
- [x] C3. Storico settimana, checklist inizio turno, presenze, firma di
      chiusura ✅ *(29/07, `b5ea8fe`)*.
- [x] C4. **Turno chiuso = turno non scrivibile** ✅ *(29/07)* — tutti i **20**
      punti di scrittura passano da un solo guardiano, quindi il blocco non
      può essere dimenticato in un angolo. Riapertura tracciata: chiede chi e
      perché, non cancella mai le precedenti, e compare nel rapporto
      stampabile. Le registrazioni vecchie senza data e turno restano
      modificabili: nessuno si ritrova i dati bloccati dall'oggi al domani.
- [x] C5. **Foto sull'anomalia** ✅ *(29/07)* — ridimensionata nel browser
      prima di essere salvata (2,5 MB → 233 kB), nessun servizio esterno.
- [x] C6. **Meteo e condizioni del sito** ✅ *(29/07)* — voce fissa di ogni
      rapporto di turno serio, e spiega i fermi che Campo già misura.

**Flotta** (mezzi) — `docs/RICERCA_FLOTTA_202607.md`
- [x] L1–L4 **tutte e quattro** ✅ *(29/07, `1d3df21`)* — giro macchina in
      tre tocchi con checklist per tipo di mezzo, le voci «non va» che
      diventano manutenzioni collegate e le voci di sicurezza che propongono
      di fermare il mezzo; fascicolo unico con stampa del libretto; piani a
      ore e a calendario che si ripianificano dalle ore vere del contatore;
      carburante tank-to-tank in l/h e €/h, che quando non è calcolabile dice
      perché invece di mostrare un numero. Corretta nel passaggio una
      regressione che avrebbe rotto la pagina alle organizzazioni esistenti.

**Conti** (economia) — `docs/RICERCA_CONTI_202607.md`
- [x] N1–N5 **tutte e cinque** ✅ *(29/07, `0194fbc`)* — listino con densità
      e conversione €/t↔€/m³ che senza densità non inventa numeri; fattura
      con imponibile+IVA e numerazione progressiva per anno, retrocompatibile
      al centesimo con le fatture a importo secco; registro pesate/DDT col
      netto calcolato; **fattura differita dai DDT** raggruppata per prodotto,
      con i DDT che non possono rientrare in una seconda fattura e tornano
      liberi se la fattura viene eliminata; canone di escavazione con
      aliquota impostata dall'utente, mai cablata.

**Sentinella** (ambiente) — `docs/RICERCA_SENTINELLA_202607.md`
- [x] T1–T4 **tutte e quattro** ✅ *(29/07, `947a934`)* — import CSV con
      parser scritto in casa e colonne scelte dall'utente, anteprima riga per
      riga col motivo di ogni scarto; anagrafica ricettori la cui soglia
      vince su quella del punto, e se le unità non coincidono non converte
      niente ma segnala il conflitto; report di conformità stampabile in A4;
      registro reclami. Corretto un difetto grave trovato guardando la
      stampa: «µg/m³» diventava «MG/M³» per un maiuscolo di stile.

**Terra** (rilievi e autorizzazioni) — `docs/RICERCA_TERRA_202607.md`
- [x] R1. **Scheda autorizzazione** ✅ *(27/07)* — con storico delle
      varianti e badge vigente/archiviata.
- [x] R2. **Contatore vita cava** ✅ *(27/07)* — residuo sul totale
      concesso, soglia di guardia impostabile, anni residui dal ritmo medio,
      confronto 'scade prima il titolo o il volume'.
- [x] R3. **Scadenzario Terra** ✅ *(27/07)* — semaforo, ricorrenze e
      proposta automatica della scadenza successiva.
- [x] R4. **Riepilogo annuale per la denuncia** ✅ *(29/07, `43dcc53`)* —
      scheda dedicata, stampabile ed esportabile, con i mesi a zero tenuti
      apposta e la ripartizione per fronte.
- [x] R5. **Scavo contro cumulo** ✅ *(29/07, `43dcc53`)* — la ripresa da
      cumulo non consuma più il volume concesso, in tutti i conti; i rilievi
      salvati senza il campo valgono scavo e i numeri di prima non cambiano.
      Coperto da due test nella suite KPI.

**Aggiunte del 29/07 sera** *(oltre alle proposte delle schede)*
- [x] **Conti — data di incasso vera con acconti** ✅ *(`3b00a52`)* — ultimo
      buco dati dell'ecosistema chiuso: giorni reali di pagamento, incassi
      parziali, e il grafico emesso-contro-incassato che con pochi mesi non
      disegna una linea finta. Fatture vecchie incassate senza data intatte.
- [x] **Flotta — ordine di lavoro e fermi macchina** ✅ *(`4c70110`)* — la
      manutenzione diventa il documento dell'officina (manodopera, ricambi,
      costo che va in magazzino, costi e fascicolo) e la disponibilità reale
      esce dai fermi con le causali. Scelto il riordino ricambi al posto del
      QR, perché ora i consumi veri esistono.
- [x] **Campo — turno chiuso non riscrivibile** ✅ *(`5f9ca5a`)* — venti
      punti di scrittura dietro un solo guardiano, riapertura tracciata.
- [x] **Terra e Sentinella — verbale di rilievo, confronto rilievi,
      programma di monitoraggio** ✅ *(29/07, `048aaee`)* — più cinque unità
      di misura che il maiuscolo di stile stravolgeva in Terra.
- [x] **Motore grafici — note che si moltiplicavano al ridisegno**
      ✅ *(29/07, `ea5d4c9`)* — la frase «soglia fuori scala» si ripeteva a
      ogni rotazione o anteprima di stampa, anche nel documento consegnato
      all'ente. Corretto alla radice in `shared/`, non nella singola app.
- [x] **Test: blindate le funzioni nuove della giornata** ✅ *(29/07,
      `8a680f4`)* — 179 → 201. Le asserzioni scritte a mano per verificare i
      cantieri diventano permanenti: incassi parziali e compatibilità delle
      fatture vecchie, costo dell'ordine di lavoro e disponibilità dei mezzi,
      turno firmato non riscrivibile, e la distinzione di Scudo fra il corso
      che blocca e il DPI che avvisa.

## BLOCCO 3 — GENESI: DAL "QUANTO" AL "DOVE"
`docs/RICERCA_GENESI_202607.md`. Gap centrale emerso: **Genesi dice quanto,
non dice dove** — dà un numero medio per l'intera volata, i professionali
danno mappe per foro.

- [x] **A1. Editor del fronte nel 3D** ✅ *(26/07, `af9d6aa`)*
- [x] **A2. Colonne di carica segmentate** ✅ *(26/07, `c966d45`)*
- [x] **A3. Mappa delle quote** ✅ *(26/07, `64c08cf`)*
- [x] **G1. Contorni isocroni sulla pianta** ✅ *(28/07, `c5e178f`)* — livello
      «Isocrone» sulla pianta, passo dei ms scelto o automatico, legenda che
      resta anche negli screenshot.
- [x] **G2. Burden relief foro per foro** ✅ *(28/07, `c5e178f`)* — ms/m a
      ciascun foro invece della media globale, badge colorati sulla pianta,
      finestra ms/m impostabile, il dato finisce anche nell'export CSV.
- [x] **G3. Legge di sito K/β dai referti del sismografo** ✅ *(29/07,
      `f388a3f`)* — regressione sui referti reali, riga di progetto al 95°
      percentile, R² e intervallo calibrato, avviso quando la volata estrapola
      fuori da quell'intervallo, import CSV con scelta delle colonne. Rifiuta
      i dati che non fanno una legge onesta (meno di 3 referti, stessa
      distanza scalata, pendenza fuori da 0,5–3). Opt-in: senza attivazione
      restano i valori da litologia.
- [x] **G4. Ritardi a mano e rete di innesco** ✅ *(29/07, `c542009`)* — il
      ritardo del singolo foro si mette a mano e si torna al calcolato; il
      livello «Innesco» ricostruisce chi accende chi e verifica che i
      raccordi richiesti esistano davvero fra quelli in commercio, indicando
      il taglio più vicino quando non ci sono.
- [x] **G5. Mappa dell'energia** ✅ *(29/07, `8ddd8d8`)* — consumo specifico
      sul blocco che ogni foro serve davvero, più il burden vero in
      perpendicolare alla faccia, che è cosa diversa dal volume servito.
- [x] **G6. Banda d'incertezza da precisione di perforazione** ✅ *(29/07,
      `695c4f9`)* — errore al colletto e deviazione impostabili, geometria
      perturbata 300 volte ricostruendo anche le file davanti, banda del
      burden minimo al piede e della pezzatura, e probabilità che almeno un
      foro finisca sotto il 70% del burden di progetto. Seme dalla
      geometria: la banda non balla a ogni ridisegno.
- [ ] G7–G9: ottimizzatore di volata, report professionale, rifiniture scena.

## BLOCCO 4 — I PONTI TRA LE APP *(il valore d'insieme)*
Qui sta la ragione per cui sei app valgono più di sei programmi: **un dato
inserito una volta serve in cinque posti**.

- [x] **P0. Campo → Genesi: la carica reale torna alla riconciliazione**
      ✅ *(29/07, `061d2e9`)* — il consuntivo esce nello stesso formato del
      piano (file vecchi ancora leggibili), con lo scarto in chili **col
      segno** e la misura non arrotondata; Genesi lo rilegge per nome di
      colonna e precompila solo ciò che il file sa, lasciando vuote con la
      ragione scritta le misure che solo l'uomo può fare. Ogni numero dichiara
      da dove viene. Emerso dalla prova, e ora detto dall'app: il totale può
      essere in linea mentre ogni singolo foro è fuori del 20%.
- [x] **P5. Sentinella → Scudo: dal superamento all'azione correttiva**
      ✅ *(29/07, `f71b19a`)* — un superamento o un reclamo genera in un tocco
      l'azione dentro lo scadenzario esistente di Scudo, collegata alla sua
      origine e senza doppioni; lo stato si rivede dal lato ambientale. Il
      collegamento con la volata è dichiarato **coincidenza, non causa**.
- [x] **P1. Sentinella → Genesi: le volate misurate tarano la legge di sito**
      ✅ *(29/07, `ecec323`)* — il cerchio si chiude: la PPV misurata si
      aggancia alla volata (dallo strumento o a mano), i referti escono nel
      formato che la «Legge di sito» sa già leggere, e Genesi mostra la
      provenienza di ognuno. **Nessuna PPV inventata**: una volata senza
      misura non diventa referto, e il motivo è scritto. La regressione è
      stata riverificata ricalcolandola con una formulazione diversa da quella
      del codice — K95=1493, β=1,53, R²=0,896, identici.
      **Resta da fare il verso opposto**: la volata progettata in Genesi che
      nasce «prevista» nel registro di Sentinella.
- [x] **P1-bis. Genesi → Sentinella: la volata progettata nasce «prevista»**
      ✅ *(29/07, `0847e0a`)* — chiude il doppio inserimento. Entra come
      prevista e si conferma quando succede davvero, correggendo i dati. Tre
      guardie indipendenti impediscono che una previsione diventi un referto.
- [x] **P3/P4. Terra ↔ Conti — cavato contro venduto** ✅ *(30/07, `1d3a58e`)*
      — vive in Conti perché è lì che la densità è dichiarata; senza densità
      **non converte e non stima**. Otto stati, di cui tre che si rifiutano di
      mentire: disavanzo (venduto più del cavato: è un buco, non scorte),
      implausibile oltre il 35% (è un errore da cercare), no-densità.
- [ ] P2. **Campo → Terra**: produzione del turno → volumi per fronte.
      *(l'unico ponte che resta)*

## BLOCCO 6 — SECONDE ITERAZIONI: I DIFETTI DICHIARATI, CHIUSI
Non feature nuove: i difetti che i cantieri avevano trovato e scritto nero su
bianco invece di nascondere. Ognuno era piccolo, ognuno era vero.
- [x] **S1. Unità di misura mai in maiuscolo — alla radice** ✅ *(30/07,
      `aab9d07`)* — la causa stava in `shared/dw-grafici`, non nelle app: tre
      toppe locali (Terra, Sentinella, Campo) per un difetto solo. Chromium
      trasforma `µ` nella mu greca maiuscola, quindi `µg/m³` diventava
      `ΜG/M³`: milligrammi, mille volte tanto, sul rapporto che va all'ente.
      Ora il motore avvolge da sé l'unità e le tre toppe sono via, così
      «VOCE» e «QUOTA» tornano maiuscole come nel core.
- [x] **S2. Campo e Genesi — numeri all'italiana** ✅ *(30/07, `ff362aa`)* —
      il badge scriveva «44.7 KG», `riconDelta` «+3.0 cm». Tre formattatori
      per app al posto di una decina di copie a mano, e la riga di confine
      scritta: i numeri **mostrati** vanno all'italiana, quelli **scambiati**
      nei CSV restano col punto.
- [x] **S3. Sentinella — la virgola non decuplica più** ✅ *(30/07,
      `2b661f7`)* — misurato: in `type=number` digitando «2,4» il browser
      salva **24** e lo dichiara valido. Tutti e 14 i campi decimali
      convertiti con validazione propria. Più la tessera «Tagliandi 30gg» di
      Flotta, che contava solo i tagliandi a data.
- [x] **S4. Scudo — i comandi si possono toccare** ✅ *(30/07, `7fd693b`)* —
      da 30×30 a 44 px di altezza su tutti i comandi, stacco da 5 a 16 px, e
      sei comandi che erano **invisibili e irraggiungibili** dentro testi
      troncati. Misurato con `elementFromPoint` a cinque larghezze.
- [x] **S5. Genesi — via i tre dialoghi del browser** ✅ *(30/07, `88ba5a1`)* —
      e poi gli **ultimi tre della piattaforma**, due dei quali nel core
      (`14aadf3`): la calibrazione della scala, che decide ogni misura presa
      dalla foto, e la rimozione di un membro dall'organizzazione.
- [x] **S6. La virgola in tutte le app** ✅ *(30/07)* — Sentinella `2b661f7`,
      Campo `a1d8436`, Genesi `26e6f0e`, Flotta/Conti/Terra nei punti stabili.
      Poi la scoperta che contava: le sei app leggevano «1.250» in **tre modi
      diversi**, perché la convenzione era scritta quattro volte. Ora vive in
      `shared/deepwork-id-client/dw-shell.js` (`1385928`) e tutte e sei
      delegano (`4f4b4d3`).
- [x] **S8. Piano di carico: colonne per nome, non per posizione** ✅ *(30/07,
      `74e6712`)* — un file con le colonne in ordine diverso si caricava
      **senza errori**, con la profondità nel borraggio. Trovato per caso
      sbagliando un'intestazione in una prova.
- [x] **S9. Le regole vincolanti diventano controlli** ✅ *(30/07, `78e59ec`)* —
      `run-stile.mjs`, 39 controlli in CI: niente dialoghi del browser, unità
      mai in maiuscolo, nessun campo decimale `type=number`.
- [x] **S10. IL CORE: i campi decimali e chi li legge** ✅ *(30/07, `e7a6bcd`
      + `30e2b2e` + `71fc0a7`)* — è il prodotto che va in produzione a ogni
      merge, e ci è voluto in **tre passaggi**, perché ogni passaggio ha fatto
      vedere quanto il precedente non guardava:
      1. `e7a6bcd` — i **32 campi con lo step frazionario**, fra cui le
         coordinate GPS della cava (`cf-lat`/`cf-lon`: «37,0625» diventava
         370625) e i parametri di volata. Cercando `a-mh` è venuto fuori un
         difetto vero: quel campo si poteva scrivere e non veniva **mai letto**.
      2. `30e2b2e` — altri **34 campi** che si dichiaravano decimali col solo
         `inputmode`, nella stessa schermata: diametro del foro, spalla e
         interasse del calcolatore di carica, i quattro parametri di Kuz-Ram,
         le percentuali di frammentazione (dove `step="1"` vietava 12,5 su una
         percentuale «decimale»). La regola di `run-stile.mjs` non li vedeva:
         guardava una firma sola su due.
      3. `71fc0a7` — **chi li legge**: 17 passavano da `parseNum0`, che di ciò
         che non capisce fa **zero**. Un costo di riparazione a zero, ore di
         lavoro a zero, litri a zero — e `dep-new` azzerava una giacenza.
      Il core adesso importa `numeroScritto` da `shared/` come le sei app, con
      una guardia sola sul documento che parla quando si lascia il campo, e
      `perCampo` dove l'app scrive un numero **dentro** un campo (la
      calibrazione della scala della foto lo scriveva col punto inglese).
      Regola 4 in CI: nessun campo decimale si legge con `parseNum0`.
      ⚠️ Il core **non si può provare col browser in questo ambiente** (importa
      Firebase e tre librerie da CDN, la rete verso gstatic/jsdelivr è chiusa):
      si estraggono le funzioni e si eseguono contro il **markup vero** preso
      dal file, che per il tipo di un campo e per la ricerca dell'etichetta
      basta e prova esattamente la cosa giusta.
- [x] **S7. Ponte P2 Campo → Terra** ✅ *(30/07, `30a95fa`)* — **l'ultimo
      ponte, e i cinque sono chiusi.** Non come era stato scritto qui («la
      produzione del turno alimenta i volumi per fronte»): quella formulazione
      era il difetto. La produzione di turno **non deve alimentare i volumi**,
      perché i rilievi consumano il volume CONCESSO e finiscono nel riepilogo
      che va agli ENTI, portano metodo e GSD che li rendono difendibili in
      audit, e sommarli conterebbe **due volte** la stessa roccia — quella che
      i camion portano via è quella che il volo poi misura come vuoto di scavo.
      Quindi il dichiarato resta **dichiarato**: riempie il buco fra due voli
      del drone (l'unica cosa che Terra può dire di quel periodo) e si
      **confronta** col rilievo quando arriva. E il confronto vive a livello di
      **cava**, non di fronte, perché i rapportini di Campo non hanno un fronte
      e indovinarlo lo metterebbe sul concesso sbagliato: scritto in pagina
      invece che aggirato.

- [x] **S11. `parseNum` del core: la convenzione arriva anche ai file delle
      macchine** ✅ *(30/07)* — `parseFloat` teneva la testa e buttava la coda:
      «2,4,5» dava 2,4 e «3x4» dava 3. La misura prima di irrigidire è servita:
      cinque delle 145 letture sono celle del CSV di una perforatrice, che scrive
      l'energia in **notazione scientifica** — irrigidire a occhio avrebbe rotto
      l'import in silenzio. Ora `scientifica` è un interruttore **spento** di
      serie (in un campo «2e5» battuto per sbaglio non diventa duecentomila) e lo
      accende solo chi legge una macchina. Trovati strada facendo due difetti
      latenti: l'arrotondamento condiviso che **peggiorava** il numero sopra 2^53
      (una coordinata UTM a 10 decimali), e `isNaN(null)` che è **false**, per cui
      sei guardie dell'import lasciavano passare un null nel foro.
      L'import della perforatrice adesso **dice** quello che non riesce a leggere,
      riga per riga, prima di importare: un «n/a» diventava zero e quel foro
      entrava nella volata con profondità zero, invisibile.

- [x] **S12. I campi INTERI: la virgola non entra più di nascosto** ✅ *(30/07)*
      — 50 campi su sette superfici. Restano `type="number"` perché lì lo
      **spinner serve**, ma la misura ha **smentito l'ipotesi** del checkpoint:
      non basta leggere la validità, perché su «1,5» Chromium fa «15» e risponde
      `checkValidity() === true` — il numero è già distrutto e dichiarato buono.
      Si rifiuta il carattere su `beforeinput`, con la guardia in `shared/` una
      volta sola. Detto senza girarci intorno: «1,5» resta «15», il valore non
      migliora — migliora che chi scrive lo **sappia**. Dove migliora anche il
      valore è «1.500», che l'app leggeva 1,5.
      Limite del browser, misurato: su `type="number"` non c'è cursore
      (`selectionStart` è null, `setSelectionRange` lancia), quindi un incolla
      con separatori si ripulisce solo a campo vuoto e altrimenti si rifiuta.
      Regola 5 in CI: se una superficie ha campi interi, monta la guardia.

- [x] **S13. Terza iterazione sulla sezione dei turni di Terra** ✅ *(30/07,
      `95e0abb`)* — renderizzati i sei stati che non avevo mai visto (Campo
      assente, nessun turno, nessun rilievo, un rilievo solo, sopra la misura,
      sopra di poco). Quattro difetti, **tre visibili solo a schermo**, e il
      peggiore stava nel mio progetto: la banda di coerenza valeva in un senso
      solo, quindi un eccesso dell'1% diventava un allarme rosso — la ragione
      contro cui avevo scelto soglie larghe, violata tre righe sotto il commento
      che la spiegava. Senza rilievi il dichiarato si **perdeva** (due note
      grigie mentre in archivio c'erano quindici rapportini). La terza tessera a
      390 px restava a metà larghezza, e la convenzione dell'app stava dieci
      righe sopra. E la tendina del periodo, per coerenza col riferimento, ma coi
      **confini dei voli** invece di date libere: meglio togliere la possibilità
      di fare la domanda sbagliata che spiegare dopo perché la risposta non vale.

- [x] **S14. Il ponte P2 nei due sensi + `shared/dw-ponti.js`** ✅ *(30/07,
      `0bb30ca` + `d3345e7`)* — il ponte andava in un senso solo: chi compila il
      rapportino non sapeva che fine faceva il numero che scriveva. Prima di
      scriverne una seconda copia, la logica è passata in
      **`shared/dw-ponti.js`**: serve a due app e non è di nessuna delle due, e
      riscriverla era esattamente il difetto costato una giornata coi numeri.
      Spostata anche la **regola del cumulo**, che era già scritta due volte
      (Terra e Conti). Il test pretende l'**identità** delle funzioni, non il
      comportamento: due copie uguali oggi divergono domani.
      Lato Campo la decisione che conta è il **tono**: nessun rimprovero, perché
      un rimprovero fa scrivere numeri prudenti invece di veri. Regola 6 in CI lo
      tiene, e ha richiesto il complemento di `mascheraCodice` — il testo che
      l'utente legge vive **dentro** le stringhe, che quella maschera nasconde.
      E la densità non si chiede due volte: viene dal materiale già scritto
      nell'autorizzazione di Terra.

- [x] **S15. L'ultima copia della regola del cumulo, e la regola 7 in CI** ✅
      *(30/07, `401f3eb`)* — `conti-data.js` teneva `eCumulo`, copia privata con
      un commento che dichiarava di essere «la stessa regola di Terra». Il verso è
      stato guardato **prima**: invertirlo farebbe consumare la concessione a
      roccia tolta anni fa, senza nessun errore e senza nessun test rosso. La
      prima versione della regola 7 vietava la cosa sbagliata — segnalava tre usi
      legittimi, fra cui `soloCumulo` di Terra: confrontare il *risultato* della
      funzione condivisa è normale, quello che va vietato è **ricavare la
      provenienza dal record grezzo**.

- [x] **S16. Il grafico dichiarato-contro-misurato, e i buchi nel motore
      condiviso** ✅ *(30/07, `75c9483`)* — due linee sulla stessa unità, non lo
      scostamento in %: una percentuale nasconde la scala, e un 10% su 500 m³ non
      è un 10% su 20.000. Ma **il motore condiviso non sapeva fare i buchi**:
      `percorso` univa tutti i valori numerici in un tratto continuo, quindi
      `[95, null, 140]` diventava una linea intera — un segmento che nessuno ha
      misurato, contro il commento della funzione stessa e contro la regola già
      scritta per gli altri grafici. Corretto alla radice (tratti separati, area
      chiusa tratto per tratto), con la verifica che i cinque grafici di
      riferimento restino **identici carattere per carattere**.
      Due difetti visti sullo screenshot: il grafico si disegnava anche con **un
      punto solo** (legenda che promette una linea inesistente), e la
      dimostrazione non raccontava niente — ora lo scarto passa dal 12% al 7% al
      2,4%, che è la storia per cui il grafico esiste.

- [x] **S17. Prove permanenti + seconda iterazione lato Campo** ✅ *(31/07,
      `5165097` + `4ccfa6a`)* — le prove sui buchi sono passate dallo scratchpad
      alla suite (il browser serviva per **scoprire**, non per tenere chiuso: sono
      funzioni pure, e il motore le espone in `dwGrafici.geometria`). Sul lato
      Campo la seconda iterazione ha trovato il difetto peggiore possibile per
      questo progetto: **un confronto incompleto che dichiarava un accordo**. Coi
      viaggi fuori dal conto la frase diceva «i due numeri si parlano» — il calcolo
      diceva `parziale: true`, era la frase a leggere metà del risultato.
      E la sedicesima prova sbagliata, la prima **muta**: `String.replace` su un
      bersaglio che non combacia non fa niente e non lo dice, quindi uno stato
      «con-viaggi» era in realtà quello normale. Ora entrambe le prove sugli stati
      pretendono che la trasformazione abbia cambiato la sorgente.

- [x] **S18. Terza iterazione lato Campo: le tre iterazioni sono fatte su
      entrambi i capi del ponte** ✅ *(31/07, `9a2df65`)* — due note invece di una,
      che è già la convenzione dell'app. Il costo è **misurato e dichiarato**: il
      caso parziale cresce a 209 px (due padding), quello normale scende a 115 e
      quello senza densità a 101. Trentun pixel comprano un testo che si legge
      invece di un blocco che si salta. E la seconda differenza dal lato Terra —
      nessuna tendina del periodo — è ora una **decisione scritta**: chi compila
      guarda il periodo appena chiuso, lo storico è una domanda da quadro di
      controllo e sta in Terra col grafico.

- [x] **S19. Le etichette dell'asse X: misurate, non contate** ✅ *(31/07,
      `7d335ff`)* — il motore condiviso scampionava col solo conto e poi aggiungeva
      l'ultima comunque: con quattro nomi di fronte veri a 390 px si sovrapponevano
      di 12 px, e tutte le prove sui grafici usavano `A B C D`. Ora le larghezze si
      **misurano** con `getBBox` invece di stimarle — la prima versione stimava in
      pixel di schermo una geometria che vive in unità del viewBox, e sbagliava di
      un terzo nel verso che non protegge. Le due **estremità** hanno la precedenza:
      quel difetto (asse senza inizio) non produceva nessuna sovrapposizione, si è
      visto solo guardando lo screenshot. La regola sta in `tenuteX`, funzione pura
      esposta in `dwGrafici.geometria`: 18 asserzioni nuove nella suite, e sette
      grafici di riferimento identici carattere per carattere a due larghezze.

**La convenzione sui numeri è chiusa.** Sei app, core, campi scritti a mano,
campi interi, file delle macchine.

## BLOCCO 5 — FONDAZIONE E QUALITÀ
- [ ] Q1. Proposte di `docs/RICERCA_DEEPWORKID_202607.md` (ruoli reali di
      cava, onboarding, GDPR) — *da leggere quando la ricerca è depositata*.
- [ ] Q2. Suite test da 364 a **oltre 420** (nuove collezioni e helper).
- [ ] Q3. Revisione di sicurezza del codice nuovo.

---

## VINCOLI INVARIATI
- ⛔ **Dati di riferimento del fondatore**: mai in interfaccia, export o
  documenti (regola ferrea, `CLAUDE.md`).
- Niente push diretto su main: si passa da Pull Request.
- **Nessuna spesa**: ogni scheda di ricerca distingue il gratis dal
  richiede-spesa. Non si attiva nulla a pagamento.
- **Soglie di sicurezza**: in Italia non esiste un limite numerico di legge
  per le vibrazioni in ambiente di vita (UNI 9916 rimanda alla curva DIN
  4150-3). Ogni soglia proposta **va confermata dal fondatore** e resta
  modificabile dal cliente.
- Le regole ambientali e i canoni **cambiano da regione a regione**: mai
  scrivere soglie o aliquote fisse nel codice.

## IN ATTESA DEL FONDATORE (non bloccano il lavoro)
1. **Progetto Firebase** (10 minuti) → sblocca il go-live delle sei app.
2. **Prova del drone** → sblocca il burden reale sul fronte vero.
3. **Via libera alle curve di sicurezza** USBM + DIN (pronte, documentate).
4. Nuova **PR verso main** per il lavoro di questa settimana.

## RIFERIMENTI
- Ricerche: `docs/RICERCA_{SCUDO,CAMPO,FLOTTA,CONTI,SENTINELLA,TERRA,GENESI}_202607.md`
- Estetica: `docs/SPECIFICA_ESTETICA_CORE.md`
- Ultimo checkpoint: `vault/checkpoints/` (file col timestamp più alto)
