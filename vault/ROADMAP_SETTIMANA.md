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
- [x] **La STRUTTURA del core in un posto solo** *(02/08)* — toast, modale,
      conferma, richiesta di un valore, Escape, riquadri da tastiera e alone che
      segue il mouse erano scritti **sei volte** (27 copie, 76% delle righe
      identiche) e **una si era già staccata** per una ragione buona. Adesso
      stanno in `shared/dw-app-ui.js`, col **soprainsieme**: **28.865 caratteri**
      tolti dalle sei pagine. `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`
- [x] **La struttura resa una REGOLA, e la scansione che perdeva la fase**
      *(03/08)* — nasce la **regola 17**: chi carica `shared/dw-app-ui.js` non
      ridefinisce toast e modale, e chi le usa deve averle da qualche parte
      (togliere le funzioni scordando il `<script>` non è un errore di sintassi:
      la pagina si apre e muore al primo tocco). Scrivendola è saltato fuori che
      la **scansione sotto a tutte e diciassette le regole** perdeva la fase:
      **115 delle 195 funzioni di Genesi** erano prese per testo, e il core ne
      usciva pulito **per caso**. Corretta e blindata con una prova sullo
      strumento — *934 dichiarazioni, tutte codice*.
      `docs/LA_SCANSIONE_CHE_PERDEVA_LA_FASE.md`
- [x] **Gli ultimi sei export che nessuna prova nominava** *(03/08)* — copertura
      **405 → 410 su 411**. Erano tutti alias e costanti, cioè le cose che
      sembrano non aver bisogno di una prova: `TIPI_MEZZO` adesso è blindato su
      quello che conta (nessun indizio dentro un altro, altrimenti il tipo lo
      deciderebbe l'ORDINE dell'elenco) e il dato scritto in anagrafica vince
      sempre sull'indizio pescato dal nome.
- [ ] **Le due pagine dimenticate anche nei banchi del browser** *(trovato il
      03/08)* — `run-stile.mjs` adesso le guarda, ma l'elenco `SUPERFICI` di
      `tests/browser/giro.mjs` — quello che serve a **tutti e diciannove i
      banchi** — ne conosce ancora nove. La pagina «non autorizzato» e il
      portone di Genesi non vengono aperte da nessun banco: niente contrasto,
      niente id doppi, niente fuori-schermo. Va allungato l'elenco e rilanciato
      il giro.
- [x] **`perCampo` scritta due volte** ✅ *(03/08)* — identica **carattere per
      carattere** in `dw-shell.js` e in `flotta-data.js`. L'ha trovata la domanda
      che mancava a `nomi-doppi.mjs`: confrontava le app **fra loro**, mai
      un'app contro `shared/`. Adesso Flotta la ri-esporta, e il censimento
      delle funzioni pure arriva a **411 su 411**.
      `docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md`
- [x] **Il canone: due basi, e l'asimmetria fra loro** ✅ *(03/08)* — Terra
      prometteva «N m³ di scavo misurato», Conti calcolava sul **venduto**:
      € 89,23 contro € 97,90 sullo stesso periodo. Adesso la base è una scelta
      dichiarata. Nessuna pesata = dovuto **zero** (è un fatto); nessun rilievo
      = dovuto **null** (nessuno ha misurato).
- [x] **Tre cantieri in parallelo** ✅ *(03/08)* — **Sentinella**: previsto,
      misurato, scarto e norma citata nel report per l'ente, e ogni dato che
      manca detto a parole. **Campo**: la disponibilità di turno, e una misura
      parziale che **non prende il verde**. **Flotta**: la segnalazione guasto
      in ambra (un guasto è un avviso, non una cancellazione).
- [x] **Le dieci funzioni dei cantieri hanno le loro prove** ✅ *(03/08)* —
      copertura **424 su 424**, tutte e sei le app al 100%. Controprova: nove
      difetti, nove prove cadute. Trovato scrivendole: `oreMinuti(null)`
      rispondeva «0 min», che è un'affermazione falsa.
- [x] **Conti: lo sconto del cliente entra nel prezzo** ✅ *(03/08)* — la scheda
      diceva «sconto 5%» e ogni DDT usciva al **prezzo pieno**: `rigaPesata` il
      cliente non lo riceveva. Su una differita vera fa **1.375,91 €** in più su
      un mese. Lo sconto si toglie dall'**imponibile** (piegarlo nel prezzo ne
      perde 6,69 per l'arrotondamento) e si **vede** su anteprima, DDT
      stampato, fattura, differita e CSV. Banco nuovo con controprova.
- [x] **`go(id)` in un posto solo** ✅ *(03/08)* — la **seconda metà** della
      struttura: sei copie in due versioni diventano una, col soprainsieme
      (le guardie di Flotta per tutte, la sua mappa come parametro).
      **4.064 caratteri** tolti, e con loro sparisce l'**ultimo blocco
      `<script>` classico** di ogni app. Verificato **provando la navigazione**:
      62 asserzioni, 44 navigazioni, controprova che ne fa cadere sei. Nasce il
      banco `browser/navigazione.mjs`: **19 → 21** esecuzioni.
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
      ✅ **Rimessa a fuoco il 02/08** prima di costruirci sopra: **quattro** dei
      suoi «oggi non si può» erano invecchiati — il **tempo di incasso** (adesso
      si misura sulle date vere invece di stimarlo), l'**andamento dei mezzi**
      (Flotta storicizza e sa la disponibilità reale dai fermi), i **costi con la
      data**, e la **scadenza dell'atto** in Terra. Verificati chiamando le
      funzioni una per una, non a memoria. Restano prudenti, ed è giusto, gli
      indici infortunistici e l'OEE: servono ore lavorate che nessuna app ha.

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
- [x] **P2. Campo → Terra: produzione del turno → volumi per fronte** ✅
      *(30/07, `6c854de` + `7a2da26` + `6e99e5b`)* — **l'ultimo ponte, chiuso.**
      **Primo pezzo fatto** *(30/07, `6c854de`)* — `produzionePerFronte` in
      `shared/`, ri-esportata da Campo e Terra con test d'identità. Divide per
      fronte, tiene separati «senza fronte» e «fronte che non esiste più», non
      converte le tonnellate senza densità, non conta i viaggi come metri cubi,
      e calcola la quota sull'attribuito e non sul totale. ⛔ Accoppia per
      identificativo, mai per nome: controprova che rimette il difetto e fa
      cadere la guardia. Otto prove, totale 325 → 333.
      **Secondo pezzo** *(`7a2da26`)* — la tendina dei fronti nel rapportino di
      Campo, letti da Terra in sola lettura, con tre stati distinti e nessuno
      muto. Si registra l'identificativo, mai il nome. «Fronte non indicato»
      resta la prima voce.
      **Terzo pezzo** *(`6e99e5b`)* — Terra mostra la ripartizione dentro la
      stima corrente, con la copertura e un avviso sotto il 60%. Trovati
      guardando: i rapportini dimostrativi dentro Terra erano una seconda copia
      senza fronte (copertura zero: funzionava e sembrava rotto), l'unità in
      maiuscolo «1.637 M³», e un testo diventato falso.

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
      **Chiuso il punto aperto** *(31/07)* — la guardia era verificata solo per
      **montaggio**: che il pezzo ci sia non dice che funzioni su quel campo.
      Digitati davvero tutti e **10** i campi interi di Genesi navigando come
      naviga una persona (le due schermate, le cinque sezioni a fisarmonica, il
      pannello parametri del 3D): messaggio sulla virgola, «1.500» → 1500,
      intero normale che passa. **Controprova**: la stessa pagina con la guardia
      smontata fa cadere **20 asserzioni su 33**. La decisione è stata estratta
      in `decisioneIntero` — funzione pura in `shared/` — e provata in
      `run-kpi.mjs` (318 → **325**), perché un banco che vive nello scratchpad
      alla sessione dopo non esiste. Una prova era sbagliata: pretendeva che la
      guardia togliesse gli **spazi** delle migliaia; misurato, Chromium li
      toglie già da solo e «1 500 000» vale 1500000 — asserzione corretta al
      contrario, con la misura scritta accanto.
      **E poi le altre sei superfici** *(31/07)* — stesse tre domande, digitando:
      Campo 2/2, Flotta 4/4, Scudo 2/2, Sentinella 3/3, Terra 5/5. **48
      asserzioni**, e la controprova ne fa cadere **32** (esattamente le due per
      campo che dipendono dalla guardia). Il core resta fuori: si apre sulla
      schermata di accesso e i suoi tre campi interi stanno oltre il login, che
      in locale non si può fare.
      **Difetto vero trovato in Terra**: «1.500» diventava **«500»**. Terra
      aveva una **seconda implementazione** della stessa regola, scritta prima
      che la guardia vivesse in `shared/` e con un comportamento diverso —
      svuotava il campo. Montate tutte e due, la prima cifra spariva e restava
      un numero plausibile e sbagliato: proprio quello che lo svuotamento
      voleva evitare. Tolta la copia; restano in Terra solo i suoi TESTI e il
      segno rosso, che ora arrivano dalla guardia condivisa (che passa anche
      l'elemento a chi avvisa). **Regola 9 di `run-stile.mjs`**: nessuna
      superficie riscrive in casa la regola degli interi — e la controprova la
      rimette nel file vero per pretendere che fallisca.

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

- [x] **S20. Le etichette delle barre: troncate misurando, con respiro** ✅ *(31/07,
      `aac2ba9`)* — stessa classe di difetto della linea, in una funzione che nessuno
      aveva guardato. Misurato con nomi veri a 390 px: nel **verticale** la troncatura
      contava i caratteri e non lasciava respiro (due nomi di fronte attaccati di
      4 px, «Bravo»+«Charl…» una parola sola); nell'**orizzontale** non c'era
      troncatura affatto e un nome lungo **usciva dal disegno**. Ora la larghezza si
      misura e il taglio sta in `tagliaA`, pura: niente spazi o trattini appesi ai
      puntini. Respiro: **una** costante per tutto il motore. La rotazione delle
      etichette è stata considerata e **scartata con la ragione scritta**.
      `confronta-svg.mjs` esteso alle barre, con un caso dichiarato «deve cambiare»
      perché il confronto dimostri di guardare.

- [x] **S21. La ciambella: il numero al centro sta nel buco, misurando** ✅ *(31/07,
      `9e0355c`)* — terzo e ultimo tipo con la stessa famiglia di difetto. La prima
      misura diceva «0 problemi»: sono i **casi ostili scelti per far fallire il
      controllo** ad aver trovato i due difetti — il numero dimensionato per conto di
      caratteri («1.111.110 m³/giorno»: 127 px in un buco da 120) e il `centro` come
      **stringa**, scritto a dimensione fissa senza che niente lo fermasse (181 px in
      120). La regola del rimpicciolimento sta in `dimCheCiSta`, pura, con la misura
      passata da fuori: provata con un carattere finto, compreso quello che **non**
      scala. L'avanzamento è risultato pulito e non è stato toccato. Onestà: oggi
      nessuna app disegna la ciambella — è fondazione, non prodotto visibile.
      **Con questo il motore dei grafici è chiuso: tutti e quattro i tipi guardati
      con dati veri, e `confronta-svg.mjs` li copre tutti (34 confronti).**

- [x] **S22. Terra: la ripartizione per fronte dice anche la QUOTA** ✅ *(31/07,
      `bb978db`)* — prima unità di prodotto dopo il motore dei grafici, e **l'unità è
      cambiata dopo la prima verifica**: la ciambella dei materiali proposta dal
      checkpoint non reggeva (il materiale è un campo dell'autorizzazione, e ce n'è
      una sola: una fetta al 100%). La composizione che esiste davvero è per fronte,
      ed era già a schermo come elenco — mancava nel **numero**, non nella forma. Due
      difetti visti guardando, nessuno dei quali produceva un numero sbagliato: la
      riga «Senza fronte indicato» con badge «0 m³» che sembrava rotta (è una ripresa
      da cumulo, che per definizione non esce da un fronte) e la **quota** mancante.
      Regola in `ripartizioneFronti`, provata: 6 prove nuove, **307 KPI**, con la
      controprova e una che passa dalla dimostrazione vera.

- [x] **S23. Ponte P3 · Campo ↔ Scudo: «chi è in turno è in regola?»** ✅ *(31/07,
      `d1dfd94`)* — la funzione che la ricerca sul cruscotto chiama **la più forte
      dell'intero ecosistema**. Scelta leggendo le schede, non inventata: verificando
      §4.3 si è visto che **due voci su tredici erano già fatte** e una terza superata.
      ⛔ **Non si accoppia per nome**: le due dimostrazioni contenevano un «Marco
      Rossi» e un «Mario Rossi», un'«Anna Conti» e un'«Anna Neri» — un accoppiamento
      per nome avrebbe dichiarato in regola una persona guardando i documenti di
      un'altra. `lavoratoreId` esplicito, e senza id la risposta è «non lo so».
      I «non lo so» non si sommano ai «sì»; se Scudo non è leggibile la sezione
      **tace** invece di rassicurare. 313 KPI, sei prove nuove fra cui i due omonimi
      perfetti che NON si accoppiano e la coerenza fra le due dimostrazioni.

- [x] **S24. Ponte P3, l'altra metà: lo scadenzario sa chi lavora adesso** ✅ *(31/07,
      `7debecf`)* — il ponte è ora simmetrico come quello con Terra. La definizione di
      «sta lavorando adesso» è **decisa e scritta**: in forza in una squadra
      operativa, non «nominato su un'attività» — quella scambierebbe un dato mancante
      per un fatto. Il nome della squadra porta la specialità dopo un trattino, e
      senza riconoscerlo **nessuno** sarebbe mai risultato in turno: il ponte avrebbe
      detto «niente da fermare» sempre, con la faccia di chi ha guardato. Due difetti
      visti nell'output: la nota contava 3 e i contrassegni erano 2, e il contrassegno
      in fondo alla riga veniva mangiato dai puntini. **318 KPI.**
      Corretta anche una regressione della sera prima (`a6e15cc`): rinominando gli
      operatori avevo lasciato indietro le attività, e il conto «in carico oggi» era
      diventato zero **in silenzio**.

- [x] **S25. Il collegamento a Scudo si può FARE dall'app** ✅ *(31/07, `c528267`)* —
      `lavoratoreId` esisteva nel modello ma nessun cliente vero poteva impostarlo: il
      ponte funzionava solo sui dati finti. **Misurato prima di costruire**: le regole
      Firestore permettono già la lettura fra app della stessa organizzazione, quindi
      nessuna regola nuova. Il collegamento ha un **comando suo** perché il tocco sulla
      riga cambia già la disponibilità, e c'è una prova che verifica proprio che non si
      confondano. Tre difetti trovati **provando** il comando, non guardandolo: in
      dimostrazione erano tutti già collegati (elenco di sole voci disabilitate), un
      «non lo so» era colorato di **verde**, e «non collegato» stava in fondo invece che
      in cima. Dieci asserzioni che usano il comando davvero.

- [x] **S26. Ponte P3, terza iterazione: cinque stati mai visti** ✅ *(31/07,
      `5fb5f58`)* — un difetto, e sta nelle **parole**: il riepilogo diceva «non sono
      collegate» anche di chi **è** collegato a una scheda sparita. Sono due problemi
      con due azioni diverse — un lavoro non fatto contro un dato da riparare — e ora
      si contano separati. Due domande implicite chiuse e scritte: col filtro attivo
      la nota conta le persone **filtrate** (perché dice «fra chi è in elenco»), e la
      sezione di Campo conta **tutti** anche se la squadra è ferma, perché è la
      rubrica e non il turno. Gli altri quattro stati si comportano già bene e non è
      stato inventato niente da correggere.

- [x] **S27. Il ponte P3 nel Quadro, e l'ottava regola di stile** ✅ *(31/07,
      `4d69eca`)* — la risposta «chi è in turno è in regola?» arriva dove si guarda
      per primo, come **riga che compare** e non come tessera: una tessera «0» fissa
      insegna a non guardare quella zona. Due difetti: un avviso che si poteva toccare
      **senza che succedesse niente**, e `class="note avviso"` mai definito in Campo e
      Scudo — tre note rendevano **neutre** dove il codice diceva «attenzione». Da lì
      la regola 8 di `run-stile`, scritta al terzo tentativo: le prime due accusavano
      il codice invece del controllo. **84 stile** (erano 72), con la controprova sul
      difetto vero.
      *(Nota: una CI rossa in mezzo all'unità era un difetto intermittente
      dell'emulatore — stesso commit verde al rilancio, e quel commit toccava solo
      due file markdown. Diagnosi scritta nel checkpoint.)*

- [x] **S28. La CI intermittente: corsa nella prova, trigger che moriva** ✅ *(31/07,
      `41ea725`)* — diagnosi e non tentativo: la pulizia iniziale cancella utenti e
      documenti, i trigger delle cancellazioni arrivano **in ritardo** e riscrivono i
      claims dopo che il setup li ha impostati, azzerando l'`owner`. Due correzioni
      separate: la prova aspetta il claim (rimedio già usato due volte nello stesso
      file) e `rebuildClaims` smette di **morire** su un utente inesistente —
      assorbendo solo `auth/user-not-found`, perché ogni altro errore su un claim è
      un problema di sicurezza da vedere. **Nessuna delle due l'ho vista passare**:
      l'emulatore non parte in questo ambiente, la verifica è la CI.

- [x] **S29. Campo: quando so chi sei, il tuo lavoro sta in cima** ✅ *(31/07,
      `e3fb7ce`)* — difetto visibile solo guardando **l'insieme**: ogni pezzo del
      Quadro era stato deciso da solo, e «Cosa tocca a me» cominciava a **850 px**,
      sotto la piega, anche dopo aver detto chi si è. Campo è l'operativo di giornata:
      chi lo apre lo apre per sapere cosa deve fare. Ora il blocco sale in cima appena
      una persona si identifica — 174 px invece di 850 — e resta giù finché non lo fa,
      perché lì è solo un invito. Si muove solo dopo una scelta esplicita, e la scelta
      è salvata. Sei asserzioni sull'ordine, andata, ritorno e dopo un ricaricamento.

**La convenzione sui numeri è chiusa.** Sei app, core, campi scritti a mano,
campi interi, file delle macchine.

## BLOCCO 5 — FONDAZIONE E QUALITÀ
- [ ] Q1. Proposte di `docs/RICERCA_DEEPWORKID_202607.md` (ruoli reali di
      cava, onboarding, GDPR) — *da leggere quando la ricerca è depositata*.
- [ ] Q2. Suite test da 364 a **oltre 420** (nuove collezioni e helper).
      *30/07: KPI 341 + stile 115 + demo 7 + helper 43 + manifest 9 = **515**
      prove che girano con `node`, più i nove banchi del browser
      (`tests/browser/tutti.mjs`). La soglia è passata; resta da tenerla utile,
      non alta: le prove che contano sono quelle che hanno una controprova.*
- [x] Q3. Revisione di sicurezza del codice nuovo → `docs/REVISIONE_SICUREZZA_202607.md`.
      *Misurata con l'emulatore, non letta. L'isolamento fra organizzazioni
      concorrenti tiene (58 prove). Dentro l'azienda non c'è ancora niente:
      l'abbonamento non fa da barriera e il ruolo non conta per i dati delle
      app. Due proposte col loro costo, tre domande al fondatore, nessuna
      regola toccata.*

### Difetti chiusi il 01/08 — i controlli che non guardavano dove credevano
- [x] **La regola che vieta i dialoghi del browser era cieca.** I due
      tokenizzatori di `run-stile.mjs`, entrati in un backtick, correvano fino
      al backtick *successivo*: il contenuto di `${...}` finiva marcato come
      testo (ma è **codice**: `${prompt('x')}` è una chiamata), e con i template
      **annidati** il backtick che apre quello interno veniva preso per quello
      che chiude l'esterno — da lì bastava un apostrofo per aprire una stringa
      che correva in avanti masticando codice vivo. Misurato: **764 iniezioni
      su 1030 non venivano viste**, 31 punti su 37 nel solo core.
      La controprova esisteva e diceva ok: guardava **tre superfici a un punto
      ciascuna**, e nessuno cadeva dove la scansione si perdeva. Adesso è a
      tappeto (1030 iniezioni, numero stampato) e ha accanto la scansione
      ingenua tenuta apposta, per dimostrare che sa ancora fallire.
      *Lezione nuova in `CLAUDE.md`: una controprova va misurata anche nella
      sua **copertura**, non solo nel suo esito.*
- [x] **La nota del modo usata come lavagna** (`mode-note`): nove scritture in
      tre app cancellavano la conferma «stai lavorando sui dati reali». Ogni
      comando ha ora la sua nota (`rap-esito`, `rep-esito`, `reg-esito`), e due
      scritture dirette al DOM sono diventate `esito()`. *Nota di onestà: la
      prima lettura del difetto era esagerata — l'avviso «dati di esempio» NON
      spariva, quello è `tour-banner` e sta in cima, fuori dalle pagine.*
- [x] **Nessuna regola di stile ha più solo la controprova finta.** Le regole
      9, 10, 11, 12, 13 e 14 dimostravano di saper fallire su tre righe
      inventate — lo stesso identico livello di prova che aveva la regola 1
      prima che si scoprisse il buco. Adesso il difetto si rimette **nei file
      veri**, e proprio dove la scansione è più in difficoltà. Ognuna stampa
      quante superfici e quanti punti ha toccato.
- [x] **Regola 12**: l'`add` deve stare sullo stesso Set dell'`has`
      (`classList.add(` bastava a soddisfarla). Buco **latente**: misurato
      prima di stringere, tutti e sette i gestori aggiungevano già sulla
      variabile giusta.
- [x] **Il banco del contrasto sa fallire.** Misurava 3331 testi su nove
      superfici e rispondeva «0 sotto soglia» — il banco che fa più misure di
      tutta la suite — senza che niente dimostrasse che ne sapesse vedere uno.
      `--controprova` avvelena ogni superficie con una riga a ~1,15:1: 9 su 9
      la bocciano. E `contrasto.mjs` non era nemmeno documentato nel LEGGIMI.
- [x] **«La pagina monta davvero» passava anche col programma morto**, su nove
      superfici su nove: il markup delle app è quasi tutto statico, quindi Conti
      col modulo ucciso fa comunque 488 elementi e 54 campi. Aggiunta la prova
      «il programma è partito davvero» (la nota del modo: 57-72 caratteri viva,
      0 morta) con controprova `--senza-programma`, verde su 6 app su 6.
      Era anche **flaky** coi 2200 ms fissi: adesso aspetta la condizione.
- [x] **Il banco della doppia data** (dettaglio 8 della ricerca sul valore: un
      tempo relativo porta con sé la data). Alla prima esecuzione ha segnalato
      Flotta e **aveva torto lui**: «Fra 8 giorni (~08/08)» è la doppia forma in
      versione compatta, ed era il banco a pretendere l'anno. Corretto il banco,
      non il prodotto. 9 superfici, 0 violazioni; controprova 9 su 9.
- [x] **Decisione 5 misurata**: le app non si accorgono di essere offline (zero
      su sei) e la persistenza offline di Firestore non è configurata — quindi
      promettere «l'ho tenuto e lo salvo appena torna la linea» sarebbe falso.
      La decisione diventa doppia e la seconda metà (persistenza sì/no) tocca
      l'isolamento fra clienti: va al fondatore.
- [x] **Le funzioni che diventano soldi, documenti e decisioni non erano
      provate.** Censite le export dei sei moduli dati e cercate in TUTTE le
      suite: 208 su 338 non comparivano da nessuna parte. Fra quelle:
      `importiFattura` (imponibile, IVA, totale di una fattura),
      `canonePeriodo` (quello che si deve all'ente), `convertiQuantita`,
      `sogliaEfficace` (decide se una lettura è un superamento),
      `puntoDiRiordino`, `vitaCava`. **26 prove nuove**, ognuna vista fallire
      col difetto rimesso. KPI **433 → 460**.
      *Due lezioni pagate: una prova nuova non discriminava (i numeri scelti
      davano lo stesso risultato con e senza la difesa), e tre sono nate rosse
      perché avevo indovinato la forma dei dati invece di leggerla.*
- [x] **Copertura per priorità di danno, seconda tornata**: il report di
      conformità (il documento che va all'ente), chi va fermato e chi no
      (`lavoratoriScoperti`), il giro macchina. **58 prove nuove** in giornata.
- [x] ⚠️ **DIFETTO DI PRODOTTO trovato e corretto**: nel riquadro «giro
      macchina» il conteggio dei mezzi con anomalie guardava solo il PRIMO giro
      di ogni mezzo. Primo giro pulito, secondo giro con un'anomalia → il
      riquadro diceva **zero**. In cava il giro si fa a ogni cambio turno,
      quindi è il caso normale. Dipendeva perfino dall'ordine dell'elenco.
- [x] **Regola nuova in `CLAUDE.md`**: niente iniezioni di difetti nei moduli
      dati mentre gira un giro del browser — le pagine se li importano. Un giro
      a 19 banchi è stato buttato per questo, ed è un errore mio.
- [x] ⚠️ **SECONDO DIFETTO DI PRODOTTO**: «il contatore segna adesso 0 ore»
      era una frase **falsa**. `+null` fa 0 e `Number.isFinite(0)` dice true,
      quindi un mezzo senza contaore riceveva il tagliando programmato a 500 ore
      su una macchina che poteva essere a seimila. Stesso `+null === 0` già
      costato una volta sulla base d'asta delle gare. Corretto nella funzione
      **e** nella pagina.
- Regole **14**; stile **149 → 177** prove; banchi del browser **15 → 19**;
  prove `node` totali **760** (KPI **433 → 501**), **2 difetti di prodotto**
  trovati dalle prove nuove.

### Difetti chiusi il 30/07 (tutti «silenziosi»: nessuno dava errore)
- [x] La **striscia** e la **pastiglia** di un riquadro dicevano un colore
      diverso dal loro stato (Terra: proiezione fuori piano, verde a 1,64:1).
      Regole di stato ora in `shared/` una volta sola; banco `note-stato.mjs`
      con controprova (14 combinazioni su 48 cadono col difetto rimesso).
- [x] **«h»** (l'ora) non era fra le unità salvate dal maiuscolo: le pastiglie
      di Flotta dicevano «TRA 24,5 H». E l'elenco delle unità aveva l'**ordine
      scritto a mano**: «40 km/h» usciva «40 km/H», «2,6 kg/m³» usciva
      «kg/M³». Ora l'ordine si calcola.
- [x] **Conti non era in nessun elenco di banco**: un'app intera che nessuna
      prova del browser aveva mai aperto. L'elenco delle superfici sta ora solo
      in `giro.mjs`. Aggiunta la domanda che mancava: non «la guardia
      funziona?» ma «c'è?».
- [x] **Conti** aveva «13 GG», «-2 GG» e «DENSITÀ (T/M³)», e **Flotta**
      «€19,02/H»: trovati un'ora dopo che Conti è entrata nell'elenco delle
      superfici. Con loro un difetto di parole: una gara chiusa mostrava
      «-2 gg» invece di «chiusa da 2 gg».
- [x] **`docs/STATO_PRODOTTO.md` rimesso in pari**: era del 23/07 ed è il
      primo documento che l'indice fa aprire al fondatore. Sette schede su
      sette rilette **con l'app aperta davanti**, mai a memoria — in ognuna
      mancava molto, e in tre mancavano dei ponti.
- [x] **Due schede su nove facevano la stessa promessa** (Deepwork e Campo
      dicevano tutte e due «il rapportino non arriva più la sera tardi»).
      Trovato leggendo le nove schede di fila come le legge chi arriva.
- [x] **Vetrina, terza iterazione** con la ricerca depositata
      (`docs/RICERCA_VETRINA_202607.md`): cinque raccomandazioni su sette erano
      già rispettate, i due difetti veri erano la mancanza di gerarchia e
      l'assenza di prove esterne. Aggiunto «da dove comincio»: si smista per
      problema, non per prodotto. Scartata di proposito la griglia a scomparti.
- [x] **Niente fuori dallo schermo di un telefono**, e adesso lo dice un banco:
      nove superfici per due larghezze, 18 schermate pulite. Erano due i
      difetti trovati finora a occhio (Sentinella «REPORT», lo scorrimento
      laterale della vetrina).
- [x] **In Campo il contatore diceva «0» prima di sapere chi sei**: zero è una
      risposta, e la risposta vera era «non lo so ancora».
- [x] **Chiuse due decisioni rimaste a metà**: i soldi sugli assi dei grafici
      (due convenzioni, entrambe giuste, scritte dove uno le cerca) e i rischi
      R2/R3, che da ipotesi sono diventati misura.
- [x] **I soldi si scrivevano in tre modi**, uno per app, e tre erano anche
      gli spazi dopo il simbolo (unificatore, normale, nessuno). Ora una
      convenzione sola in `shared/`, con la regola 11 di `run-stile` che
      impedisce a un'app di riscriversela. Trovati per strada il meno che
      finiva in mezzo («€ -1234,50») e il `gap` della pastiglia che staccava
      l'unità dal numero.
- [x] **«Prova il tour» portava al modulo d'accesso**: il bottone principale
      della vetrina non manteneva la propria promessa.
- [x] **Vetrina, seconda iterazione**: le nove anteprime erano pigre (una su
      nove caricata all'arrivo, su un telefono), e i ponti erano sei nel
      codice, cinque nell'apertura, quattro in pagina.
- [x] Scritta la risposta alla domanda della presentazione — perché esistono
      sia Deepwork sia Genesi (`docs/PERCHE_DEEPWORK_E_GENESI.md`): tre
      proposte sulle sovrapposizioni, **in attesa del fondatore**.
- [x] **I modelli di CSV del documento e il codice non possono più
      allontanarsi**: 17 controlli danno gli esempi veri di
      `ONBOARDING_DATI.md` alle funzioni vere delle sei app e pretendono che
      entrino TUTTE le righe. Nato da una misura sul BOM di Excel che ha
      smentito la propria ipotesi (16 lettori, 16 risultati identici).
- [x] **L'anagrafica lavoratori di Scudo esce dalla pagina** (`parseLavoratoriCsv`):
      era l'unico dei diciassette import senza funzione pura, quindi l'unico
      che nessuna prova poteva guardare.
- [x] **Il doppione dentro il file, in tutte e sei le app.** Misurato: dieci
      gestori d'importazione su dieci cercavano il doppione solo contro
      l'elenco in archivio, che non si aggiorna mentre il file scorre —
      e l'export di Scudo scrive una riga per ogni scadenza, quindi
      ri-caricare il proprio file faceva comparire tre volte lo stesso
      lavoratore. Ora `senzaDoppioni` sta in `shared/` e la **regola 12** di
      `run-stile` impedisce che la difesa sparisca di nuovo.
- [x] **Il piano di carico è l'eccezione, ed è voluta**: due righe per lo stesso
      foro **non si tolgono**, si dicono. Toglierne una in silenzio farebbe
      sparire una carica e scendere il totale dell'esplosivo — la cosa peggiore
      per un'app in mano a un fochino.
- [x] **Il giro di andata e ritorno degli export**: sette file si ri-caricano
      davvero (provati), tutti gli altri sono prospetti. La promessa «ogni
      import ha accanto un export ri-caricabile» era falsa per più della metà ed
      è stata corretta in `ONBOARDING_DATI` e nel `PIANO_GO_LIVE`; la scelta se
      costruire i sei mancanti è la **decisione 12** del fondatore.
- [x] **Un bottone di Conti non faceva niente** (due elementi con lo stesso
      `id`), e la stessa cosa nascondeva due note in Flotta e Sentinella. Ora
      c'è il banco `id-unici.mjs` sulla pagina **viva** e la **regola 13** sui
      nomi dei file scaricati, che in Conti erano identici per due export
      diversi.
- [x] **Il giro degli zeri di comodo**, tutti e sei i lettori CSV, deciso ognuno
      su cosa fa quel numero: **quattro corretti** — il prezzo del listino (uno
      zero lo fa sembrare gratis, e finisce in fattura), le **ore motore** (il
      contatore comanda la manutenzione: uno zero fa sembrare il tagliando
      lontano su una macchina già oltre), la **base d'asta** (viene sommata nel
      valore delle gare aperte), le **persone di una squadra** («0 persone» è
      una frase falsa) — e **due lasciati con la ragione scritta** (i giorni
      d'assenza di un near-miss, la quota di un fronte).
- [x] **Il valore cattivo su tutti e sette gli export ri-caricabili**, e il
      controllo che conta le protezioni `csvCell` nella riga vera del sorgente:
      sui ricettori ce n'erano 2 dove ne servono 5, ed è così che l'unità
      «mm/s; dB(A)» finiva dentro la nota. La voce 9 dell'audit era «chiusa» dal
      21/07 ma il codice del 30/07 non la conosceva.
- [x] **Le tendine tagliate**: 84 misurate, 19 tagliano un'opzione, **zero**
      diventano ambigue — misura che ha evitato diciannove correzioni inutili.
      Corretti i due casi che si vedevano.
- [x] **Lo stato vuoto era scritto sei volte, e non uguali** (cinque prendono il
      disegno dell'icona, Conti il suo nome): ora una regola sola in `shared/`
      con l'alias per app. E il **terzo pezzo** che mancava a tutte e 99 gli
      stati vuoti — **come si comincia** — è entrato nelle sette schermate dove
      un cliente nuovo è davvero fermo, in tutte e sei le app. L'azione è
      facoltativa: si mette dove chi guarda è fermo, non dove è contento
      («Giornata tranquilla» non ha bisogno di un bottone).
- [x] **Banco `vuoti-azione.mjs`**: i bottoni degli stati vuoti puntano a
      qualcosa che **esiste**. Nato da un difetto mio — due id indovinati che
      avrebbero lasciato i bottoni muti, senza nessun errore da nessuna parte.

- [x] **La giornata degli otto difetti (31/07)**. Le prove sulle funzioni delle
      app sono passate da **433 a 783**, e non erano prove di forma: hanno fatto
      emergere **otto difetti veri**, tutti della stessa famiglia — *un numero o
      un colore tranquillo dove non è stato misurato niente*. Il racconto per il
      fondatore sta in `docs/DIFETTI_TROVATI_202607.md`; qui basta l'elenco:
      - il contatore che segnava **0 ore** su un mezzo senza contaore (due
        punti diversi: la finestra del tagliando e il form);
      - l'**anomalia del secondo turno** che spariva dal conto del giro macchina;
      - il grafico «ultimi 6 mesi» del core con la barra «mag» piena della
        produzione di **aprile** — sempre, tutto l'anno;
      - le **scadenze delle fatture** di Conti un giorno prima, sempre;
      - il **turno di notte** datato al giorno prima (rapportino, fattura,
        lettura), e Terra che **rifiutava** un rilievo di oggi come «futuro»;
      - la **misura del sismografo** che spariva dal report per l'ente,
        annunciata come «1 doppione scartato»;
      - il **ruolo di sicurezza obbligatorio verde** su una persona non più in
        azienda;
      - il badge **«tra 500 h» in verde** su un mezzo di cui non sappiamo le ore.
- [x] **«Oggi» è una sola cosa, e adesso vive in `shared/`.** `oggiISO` era
      scritta **sette** volte in tre versioni: ora `isoLocale`/`oggiISO`/
      `meseLocale`/`timbroLocale` stanno in `dw-shell.js` e le app le
      ri-esportano, col test che pretende l'**identità**. Corretti 40 punti su
      12 superfici (`docs/RICERCA_GIORNO_LOCALE_202607.md`).
- [x] **Le prove girano anche con l'orologio del cliente.**
      `apps/deepwork-id/tests/orologio-cliente.mjs`, in coda alla suite di CI,
      rilancia le suite sensibili alla data con `TZ=Europe/Rome`: il contenitore
      è a Greenwich, e tre di quegli otto difetti in UTC erano **invisibili**.
- [x] **Regola 15 di `run-stile.mjs`**: vietato prendere il giorno di calendario
      da `toISOString()` su una data costruita in ora locale. Guarda 21 file e
      stampa quanti — e perdona chi entra ed esce in UTC, che è coerente.
- [x] **Copertura delle funzioni pure, app per app** *(ricontata il 02/08
      cercando `app.<nome>` in run-kpi.mjs, non a memoria)*: Scudo 70/71 *(era 22)*,
      Terra 38/39 *(era 23)*, Conti 54/58 *(era 35)*, Flotta 65/71 *(era 29)*,
      Campo **73/73** *(era 26)*, Sentinella 101/107 *(era 37)*. Nessuna app è più sotto la metà; quello che resta scoperto
      sono quasi solo costanti e trasporto dati.
- [x] **Il principio usato come lente.** Scritta in `CLAUDE.md` la regola
      «l'assenza di un dato non è un dato favorevole», un audit ha chiamato
      **ogni funzione delle sei app con input vuoti** (2.058 chiamate) cercando
      le risposte rassicuranti: 39 candidati, letti uno per uno, **un difetto
      vero** (l'ottavo) e **una domanda per il fondatore** (punto 13 di
      `DECISIONI_WEEKEND.md`).
- [x] **Le regole di turno di Campo escono dai commenti.** 25 prove su
      `eMia`, `caricoSquadre`, `obiettivoDi`, `statoObiettivo`,
      `fermiPerGiorno`, `storicoSettimana`, `totaliSettimana`,
      `unitaPrevalente`: le attività senza squadra contate a parte, l'obiettivo
      a zero che è «atteso» e non un allarme, la produzione che conta le bozze,
      t e m³ che non si sommano, i giorni prima della prima registrazione fuori
      dal grafico dei fermi, la percentuale di concluse **vuota e non cento**
      quando non c'è nessuna attività. Controprova: 8 difetti su 8 fanno cadere
      la prova col loro nome. run-kpi 783 → **808**, totale node **1.091**.
- [x] **La foto dell'anomalia e il meteo di Campo.** 18 prove. `eFotoValida` è
      l'ultima cosa fra un `data:` scritto a mano e un `<img>` della pagina:
      bloccata contro SVG e `javascript:`. Il peso della foto si conta **in
      byte, non in caratteri base64**; la scaletta dei tentativi scende; una
      foto piccola non si stira mai. Sul meteo la prova scrive la cosa che
      conta: `meteoAvverso(null)` è false, e **non vuol dire bel tempo** — il
      cartellone si disegna solo se il riassunto dice qualcosa. run-kpi
      **826**, totale node **1.109**.
- [x] **I fermi delle macchine di Flotta.** 19 prove sul blocco da cui esce la
      disponibilità del parco: una giornata persa è persa **tutta**, un fermo di
      due mesi pesa solo per i trenta giorni della finestra, un fermo aperto
      conta fino a oggi **e lo dichiara**, senza data di inizio non c'è nessuna
      durata, un mese senza registrazioni **non è un mese a zero euro**, e una
      registrazione impossibile si scarta invece di diventare un 120% disegnato.
      Trovato per strada: `CAUSALI_FERMO` esiste in **due app** e non è la
      stessa cosa (attività di turno in Campo, macchine in Flotta) — c'è una
      prova che lo scrive. run-kpi **845**, totale node **1.128**.
- [x] **L'officina e le scorte di Flotta.** 18 prove dove un numero sbagliato
      costa: il **costo di un ordine non si scrive, si somma** — e quello che
      non ha prezzo si **dichiara** invece di passare per gratis; la **soglia di
      riordino** è consumo al giorno × (consegna + margine) e quando il consumo
      non c'è **non si propone**, con la media da un episodio solo dichiarata
      fragile. Bloccate anche «2,5 ore» che non diventano 25 e «12,5 litri» che
      non diventano 125. run-kpi **863**, totale node **1.146**.
- [x] **Il giro macchina e il libretto del mezzo.** 17 prove: un giro con voci
      senza risposta **non è completo**, una voce di sicurezza «non va» fa
      scattare il rosso mentre le altre restano un avviso, ogni «non va» apre
      una manutenzione che **dice da dove viene**, il tipo di mezzo **scelto**
      batte quello indovinato dal nome, il contaore non torna indietro. run-kpi
      **880**, totale node **1.163**. Dalla controprova (14/14, ma 13 al primo
      giro) è uscita una **terza causa** di «non distingue»: l'iniezione che non
      inietta niente — si guarda l'iniezione, non la prova né il codice.
- [x] **Gli incassi veri e i DDT di Conti.** 17 prove su una regola sola —
      *quello che non ha una data non entra in una media, e viene detto a parte*.
      Le fatture segnate «incassata» prima che la data esistesse restano fuori
      dalle medie invece di entrarci come pagamenti immediati (farebbero sembrare
      i clienti più puntuali di quanto sono); un movimento **orfano** non conta;
      l'incassato del grafico sta nel mese in cui i **soldi sono entrati**. Sui
      DDT: il netto è lordo − tara e non va sottozero, i metri cubi si fanno solo
      con la densità, e lo stesso prodotto a prezzi diversi resta una riga
      diversa. run-kpi **897**, totale node **1.180**.
- [x] **Una sola `messaggioNumero`** *(fatta il 02/08, appena finito il giro del
      browser: 19 banchi a posto)*. Insieme a lei sono andate in `shared/` anche
      **`dataPiuGiorni`** — scritta identica in Scudo e Sentinella e **già
      staccata** sul caso d'errore, e irrigidita nel passaggio — e **`giorni`**,
      tornato alias di `giorniTra`. Sette prove pretendono l'**identità**, non il
      comportamento, e `nomi-doppi.mjs` è entrato in CI: **0 da sistemare**.
      Cinque prove sono cadute perché blindavano la verità di prima; la più
      istruttiva affermava «6375» — la stringa che si vede **solo nelle prove**.
      run-kpi **969**, run-stile **212**, totale node **1.263**.
- [x] **Regola 16 dello stile: le migliaia si raggruppano per scritto** dentro i
      moduli, perché li leggono sia Node sia il browser e con le opzioni di serie
      **non dicono la stessa cosa**.
- [x] ~~**Una sola `messaggioNumero`.**~~ Misurato il 02/08: la funzione che dice
      «questo numero non l'ho capito» è scritta **due volte** (shell + Flotta) e
      `AVVISO_DECIMALE` **quattro volte**; tre messaggi su dieci sono diversi, e
      ognuna delle due versioni è migliore dell'altra in un punto. Correzione
      prescritta in `docs/NUMERI_MESSAGGIO_DOPPIO_202608.md`: **aspetta la fine
      del giro del browser**, perché tocca cinque moduli dati.
- [x] **La strada da cui entrano i numeri dello strumento (Sentinella).** 17
      prove sul lettore CSV, sulle date all'italiana (una data che non esiste si
      **scarta**, non si «corregge»), sull'ora e sulla **firma del doppione** —
      il punto esatto del difetto del 31/07. Dalla controprova (14/14): il BOM è
      protetto da **due guardie**, perché `U+FEFF` per `trim()` è uno spazio, e
      il banco adesso stampa quante guardie ha tolto. run-kpi **914**, totale
      node **1.197**.
- [x] **Le liste di Scudo e i DPI.** 13 prove su una regola sola — una chiave
      sconosciuta **non diventa mai la prima voce dell'elenco** — più «non
      applicabile» che non è «conforme» e il confronto morbido dei testi. Due
      cose scritte come SONO: `dataPiuGiorni(null)` risponde oggi (`Number(null)`
      è 0) ma non è raggiungibile, ed è nominata come trappola dormiente; e un
      **DPI senza data di sostituzione** risulta regolare per sempre → punto
      **14** di `DECISIONI_WEEKEND.md`. run-kpi **927**, totale node **1.210**.
- [x] **La denuncia annuale dei volumi (Terra).** 10 prove sulla distinzione da
      cui dipende il numero che va all'ente: **lo scavo consuma il titolo, la
      ripresa da un cumulo no**. Verificata anche **per differenza** — fra il
      cumulato di un anno e quello dell'anno prima ci deve stare esattamente lo
      scavo. Più: l'anno in corso c'è sempre anche a volumi zero, e nei tipi di
      scadenza del titolo **nessuna periodicità è cablata**. run-kpi **937**,
      totale node **1.220**.
- [x] **Il predicato «rilievo elaborato con volume», raccolto.** Era scritto
      **dieci volte** in `terra-data.js` in tre varianti: adesso è
      `rilievoUsabile` (il minimo per contare) e `rilievoUsabileConData` (in più
      la data vera, per chi **ordina** nel tempo). Che la riscrittura non abbia
      cambiato niente è dimostrato da un'**impronta** di tutte le funzioni pure
      di Terra presa prima e dopo — 34 chiamate a tappeto comprese — identica
      carattere per carattere. Nella controprova, allentare quella riga sola fa
      cadere anche la prova sulla **denuncia annuale**.
- [x] **Prevista o eseguita (Sentinella).** 11 prove sulle funzioni che tengono
      in piedi le **due nature di riga** del registro volate. La regola dura: una
      volata **senza stato vale eseguita** — il contrario farebbe sparire dal
      registro le volate vere di tutti gli anni passati. E la prevista **non
      prende i colori del semaforo**, perché non è un giudizio di conformità.
      run-kpi **948**, totale node **1.231**. Quello che resta scoperto nelle sei
      app è ormai quasi solo **caricatori dati** (vogliono la rete).
- [x] **Campo chiude a 73/73, prima app al cento per cento.** 11 prove su come
      si SCRIVE un numero: `null` e vuoto che non sono zero, il raggruppamento
      delle migliaia fissato a mano (al default 1286 esce «1.286» su Chromium e
      «1286» su Node), il meno tipografico, e la **carica reale non registrata
      che resta `null` e non zero** — zero chili in un foro falserebbe lo scarto
      e la riconciliazione con Genesi. Terza duplicazione trovata oggi:
      `numeroIt` esiste in due app e dà **sei risposte diverse su dodici**, ma le
      differenze sono volute e dichiarate — non va in `shared/`, e c'è una prova
      che rende visibile il confine. run-kpi **959**, totale node **1.242**.
- [x] **Conti: i centesimi e la pesata già emessa.** `round2` è la funzione da
      cui passa ogni importo: se gli acconti non tornano col totale al
      centesimo, parte un sollecito a un cliente in regola. E `valorePesata` non
      ripiega sul netto — su una pesata a metro cubo senza densità
      moltiplicherebbe tonnellate per un prezzo al metro cubo.
- [x] **La copertura si conta da sola**
      (`apps/deepwork-id/tests/copertura-funzioni.mjs`, in coda alla suite di
      CI). Due volte in due giorni ho scritto un numero di copertura sbagliato
      contandolo a memoria: adesso lo conta un programma, stampa **quante
      funzioni ha guardato** e ha un **fondo** per app che, se scende, fa
      cadere il controllo. Oggi: **401 funzioni coperte su 409** — Campo e
      Scudo al 100%, e quello che resta è tutto il blocco `messaggioNumero`.
- [x] **Il controllo che trova da solo la regola scritta due volte**
      (`apps/deepwork-id/tests/nomi-doppi.mjs`). La regola di `CLAUDE.md` sul
      `shared/` era **scritta**, cioè affidata alla memoria: il 02/08 ne sono
      uscite cinque violazioni in un giorno. Adesso ogni nome esportato da due
      moduli dati o è lo **stesso oggetto**, o sta in un elenco di divergenze
      **dichiarate con la ragione**. Guarda 12 nomi e ne trova 4 da sistemare —
      due già noti e **due nuovi**: `dataPiuGiorni` scritta identica in Scudo e
      Sentinella (e **già staccata**: su un valore non numerico una risponde
      `null` e l'altra `""`) e `giorni`, lo stesso involucro di due righe in
      Conti e Sentinella. Il controllo **fallisce** ed è giusto: entra in CI col
      commit che corregge.
- [x] **Per il fondatore**: `docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md` — perché
      una giornata di sole prove ha prodotto tre correzioni di struttura, e il
      criterio per distinguere quando è un difetto e quando no.
- [x] **Misurato: lo stesso numero si scrive in due modi.**
      `toLocaleString("it-IT")` sui numeri di **quattro cifre** dà «6.375» in
      Chromium e «6375» in Node (strategia `min2`). Non è un difetto del
      prodotto — dentro una pagina gira tutto nello stesso motore — ma lo è
      delle **prove**: i moduli dati li leggono tutt'e due, e la prova sulla
      frase del tagliando afferma «6375» mentre l'utente legge **6.375**. Stessa
      famiglia del difetto delle date. Misura e correzione in
      `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`.
- [x] **Genesi al condiviso: misurata prima di toccarla** ✅ *(03/08, `5e05c00`)* —
      l'ultima superficie con la struttura del core scritta in casa, e l'unica su
      cui il piano è stato **misurato prima** invece che scritto a intuito. Tre
      delle quattro cose trovate cambiano il piano, e nessuna si vede leggendo il
      codice delle funzioni: **(1)** Genesi non carica **niente** di `shared/` —
      non è togliere una copia da una pagina già collegata, è collegare una
      pagina mai collegata; **(2)** il nome `modal` è **già occupato**, dal
      **cancello di consenso** (l'avvertenza che vieta di usare i frammenti
      volanti per le distanze di sicurezza), e il prefisso `mdl` è sovraccarico —
      **sette** id sono dell'editor del fronte 3D, da rinominare sono **cinque**,
      non dodici; **(3)** il CSS **non** è una copia invecchiata, ed è il
      contrario dell'amministrazione: lì 15 regole su 18 identiche, qui **2 su
      14**, e tutte e dodici le divergenti divergono per *come si chiama la stessa
      idea*. Il numero che decide il piano: il foglio condiviso pronuncia **76**
      variabili, Genesi ne definisce **12**, le scoperte sono **72 su 76** — e una
      variabile CSS assente **non fallisce**, ricade sull'ereditato. Contagio:
      **22 selettori** cadrebbero su markup che Genesi ha già (`.kpi`, `.badge`,
      `.note`, non solo `.modal-*`). Ne esce un piano in **due unità**: A il solo
      JavaScript, B il colore — che chiede prima una voce in `PALETTE_APP.md` coi
      nomi del condiviso. Le sei misure stanno in `numeri-nei-documenti.mjs`
      (**8 → 14** prove) e sono **destinate a cadere**: l'unità A fa sparire i
      cinque id, e il documento va riscritto **subito**. Controprova: **otto**
      difetti su copie, otto cadute col nome giusto, sui file sani 7 passate e 0
      cadute.
- [x] **Ricerca: la nota di credito in Conti** ✅ *(03/08, `docs/RICERCA_NOTE_DI_CREDITO_202608.md`)* —
      è la voce in cima al censimento di Conti, e il motivo è che **l'app stessa
      dice che sta facendo la cosa sbagliata**: la finestra che elimina una
      fattura scrive «una fattura realmente emessa non va cancellata, va gestita
      con una nota di credito», e poi offre un solo bottone, che è quello che la
      viola. La scheda parte **misurando la scorciatoia ovvia** («è una fattura
      col meno davanti»), e la scorciatoia cade: `daIncassare` scende
      correttamente da 1.220 a 610, ma `esposizioneClienti` **salta** la nota
      (`imp <= 0`) e resta a 1.220 — due numeri della stessa app che si
      contraddicono, e quello tranquillo è in prima pagina. In più `agingIncassi`
      conta la nota **fra le fatture scadute da sollecitare**, e
      `prossimoNumero(["NC/2026/001",…])` risponde **`2026/001`**, cioè un numero
      **della serie delle fatture**, già usato. Una previsione mia era sbagliata
      ed è scritta: davo per buono che `apertoDi` schiacciasse i negativi a zero
      — il `Math.max(0,…)` sta nell'**altro ramo**. La trappola che vale la
      scheda è però un'altra: una nota **totale** porta il residuo a zero, e se
      da lì scattasse `saldata`, `tempoMedioPagamento` conterebbe come «pagata in
      N giorni» una fattura **annullata** — il cliente peggiore diventerebbe il
      più puntuale. Quattro decisioni prese (non è una fattura negativa · serie
      dedicata con `prossimoNumero` esteso · la causale si chiede e da lì
      l'avviso sui 12 mesi, che **avvisa e non blocca** · **stornata ≠ saldata**,
      terza via nello stato) e sette funzioni pure da scrivere. Norma verificata
      alla fonte: art. 26 DPR 633/72 commi 2 e 3, `TD04`,
      `DatiFattureCollegate`, e il fatto che **nel tracciato gli importi negativi
      non sono ammessi** — la forma che ci serve per non rompere i totali è la
      stessa che il formato pretende.
- [x] **Ricerca: il registro costi** ✅ *(03/08, `docs/RICERCA_REGISTRO_COSTI_202608.md`)* —
      seconda voce del censimento di Conti, e la scheda comincia dalla domanda
      che il censimento non si era posto: **esiste già?** Sì, e **non è in
      Conti**: è in **Flotta** (`costi/{voce, importo, nota, data|null}`, con
      `ripartizioneCosti` e `costiPerMese`), e ha già dentro le regole di onestà
      giuste — le voci senza data non si attribuiscono a nessun mese, e «un mese
      senza registrazioni **non è un mese a zero euro**». Scriverne un secondo in
      Conti sarebbe la duplicazione che la regola vincolante vieta. Ma quello di
      Flotta è **della flotta**: `voce` a testo libero, nessun posto per
      personale, energia, esplosivo, canone, ripristino, e nessun legame con la
      produzione — quindi nessun **costo per tonnellata**. Ordine di grandezza
      di ciò che manca (letteratura, miniera a cielo aperto, **indicativo**):
      trasporto 40,5% e caricamento 22,0% sono flotta, perforazione 15,1% e
      abbattimento 19,0% **no**. **La trappola che vale la scheda**: i ricavi in
      Conti sono completi per costruzione (nascono da pesate e fatture), i costi
      **solo se qualcuno li inserisce** — il mese in cui la busta paga non è
      stata registrata non dà un errore, dà «**margine 42%**», in verde, in cima
      alla pagina. Decisione: il margine è **`null`** finché il mese non è
      dichiarato **chiuso**, e una categoria mai usata **non è una categoria a
      zero**. Seconda trappola, il doppio conteggio: Flotta l'ha già incontrata
      al suo interno (`rifornimenti.costoId`) e si ripresenta fra le app col
      **canone**, che Conti già *calcola* da Terra — quindi ogni voce dichiara la
      sua `origine` e le calcolate non si digitano. Forma proposta: Conti prende
      una collezione sua e **legge** quella di Flotta col ponte in sola lettura
      che esiste già (`db.rilieviTerra()`, `conti-data.js:1470`), e la
      **classificazione** (`CATEGORIE_COSTO`, `categoriaDi`, fisso/variabile) va
      in `shared/dw-ponti.js` perché serve a due app. Sette funzioni pure, e il
      primo test non è l'aritmetica: è che `costoPerTonnellata` risponda `null`
      su un periodo con pesate e **senza** nessuna voce di personale.
- [x] **Ricerca: la tracciabilità del volume dal visore** ✅ *(03/08,
      `docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`)* — terza voce del censimento
      per valore. Il modo più netto di dirla: **il verbale di rilievo ha già una
      sezione intitolata «Come è stato ottenuto il numero», e per un volume che
      arriva dal visore non può dire niente di vero.** E non è che i parametri
      manchino: `volumeCumulo` ne ritorna **cinque** (`volume`, `areaCelle`,
      `celle`, `zBase`, `cella`) e il visore ne salva **uno** — gli altri sono
      **calcolati e buttati una riga dopo**; poi Terra prende il solo volume, e
      lascia indietro anche `puntiRitaglio` e `puntiTotali`, che il visore invece
      salva. Quanto pesano, **misurato** su un cono di volume noto (1.413,7 m³):
      cella 0,25 m → **−1,1%**, 0,5 → +2,1%, 1 → +8,6%, **2 → +22,1%** — e la
      cella **non la sceglie l'utente**, la sceglie il software con
      `(x1-x0)/60`, quindi ritagliare un fronte intero invece di un pezzo sposta
      il numero di un quinto **senza che il perché compaia da nessuna parte**. La
      quota di base è una **moltiplicazione**: 1 m di errore = area coperta in m³
      (sul cono, **729 m³**, cioè ~401 € di canone e 729 m³ di concessione). Più
      un **difetto vero** trovato misurando: il ponte mette la data a **oggi** e
      marca subito il campo valido, mentre il visore la data ce l'ha — chi
      elabora il volo del lunedì il giovedì si ritrova un rilievo datato giovedì,
      verde, e nessun motivo per guardarlo. Tre decisioni (la data non si
      inventa · il rilievo porta la sua `origine` in **un oggetto solo**, così
      `null` vuol dire «non sappiamo come è nato» · il verbale dice quello che sa
      e **ammette** quello che non sa) e cinque unità. Le misure non restano nel
      documento: **`run-pointcloud.mjs` 23 → 26**, che blindano il **verso** e
      non i decimali, con **cinque difetti** su copia e cinque cadute col nome
      giusto. E una correzione alla controprova stessa: la prima iniezione sulla
      base scriveva su una `const`, il modulo moriva e **tutte** le prove
      cadevano — un ✓ per il motivo sbagliato, caso (3) della tassonomia.
- [x] **Il fondo della copertura non faceva quello che c'era scritto** ✅ *(03/08)* —
      l'intestazione di `copertura-funzioni.mjs` prometteva: «se una app scende
      sotto il fondo vuol dire che sono state aggiunte funzioni senza prove».
      **Falso, e misurato**: aggiungendo a Terra un `export function
      funzioneMaiProvata` la conta va a **40/41, 98%** e il controllo esce
      **zero**. Il fondo sta sul numero di funzioni **coperte**, che aggiungendo
      codice non provato **non scende**: cattura le prove **tolte**, non il
      codice aggiunto senza prove — cioè proprio il caso che prometteva, e nella
      direzione che rassicura. Adesso la regola vera è **nessuna funzione
      scoperta** (tutte e sei le app sono al 100%: il fondo era una scala mentre
      si saliva), e il fondo resta come seconda guardia. Nello stesso passaggio,
      il censimento ha smesso di guardare solo `apps/<nome>/<nome>-data.js`: si
      chiamava «quante funzioni delle **app**» e lasciava fuori proprio il codice
      che la regola del `shared/` indica come il più pericoloso. Misurato prima
      di allarmarsi — la copertura vera lì è **46 su 46** (dw-ponti 18, dw-shell
      23, pointcloud 5): non c'era un buco nel prodotto, c'era un buco nel
      **controllo**, che diceva «tutto a posto» su un perimetro più stretto del
      suo nome. Controprova a tre difetti (funzione senza prova in una app · in
      un modulo condiviso · fondo alzato sopra il vero): tre su tre fanno cadere
      il censimento **col motivo giusto**, e uscita 1.
- [x] **Il «Conforme» che nessuno ha misurato** — trovato *(03/08,
      `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`)*, **correzione da fare** —
      passate a tappeto le **342 funzioni pure** dei sei moduli con input vuoti,
      cercando **un solo segno**: una risposta **tranquilla** dove non è stato
      misurato niente. Nove casi; otto legittimi e scritti come tali; **uno no**,
      ed è sulla prima schermata di Sentinella. Un punto di misura nasce con
      `valore: 0, letture: []` — nessuno ha misurato — e `statoMisura` risponde
      **«Conforme», verde**. Misurato con sei punti appena configurati: il
      cartellone dice «**6 punti entro soglia**», il KPI `k-conf` dice **6**, e
      ogni badge dice **Conforme**. Non è un caso limite: è **il primo giorno di
      ogni cliente**. Ed è più grave che altrove perché Sentinella è l'app del
      **report all'ente**, e il principio violato è **nato proprio qui** — il
      report era stato corretto, il badge, il KPI e il cartellone no. Correzione
      decisa: quarta risposta «**mai misurato**» con `ratio: null` (non `0`),
      `maiMisurati` in `riepilogoConformita`, e il cartellone che lo dice. ⚠️ Il
      test da scrivere **per primo** è quello che impedisce di correggere
      troppo: un punto con **una lettura a zero** deve restare **Conforme** —
      «anche zero è un dato valido» lo dice già l'interfaccia. Nate due
      trappole **dormienti** dichiarate (`scudo.statoAzione`/`statoIspezione`:
      «regolare» senza scadenza, ma **nessun percorso** ne crea una senza data —
      misurato). La sonda resta come **controllo**
      (`apps/deepwork-id/tests/sonda-vuoto.mjs`): fallisce se compare un caso
      **nuovo non dichiarato** — il verso che il fondo della copertura non sapeva
      catturare — e anche se un caso dichiarato **sparisce**, così l'elenco non
      invecchia. Oggi è **rosso** sull'unico difetto vero, ed **entra in
      `npm test` col commit che lo corregge**: rosso in CI per ore non serve a
      nessuno.
      **✅ Corretto** in `59c8601`, e il confine è stato spostato **due volte**
      prima di essere giusto: la prima stesura faceva scattare «mai misurato» su
      qualunque punto senza letture, e ha fatto cadere **dodici** prove — fra cui
      una marcata ⛔ col suo perché già scritto («un punto senza storico è
      comunque un superamento»). Quella decisione era **già stata presa**, e
      vale. La regola giusta è più stretta: «mai misurato» solo quando non c'è
      **nessuna** informazione, né una lettura datata né un valore dichiarato
      maggiore di zero. *La lezione: prima di aggiungere uno stato, cercare se il
      caso è già stato deciso — qui la decisione era scritta, con la sua ragione,
      dentro il **nome** di una prova.*
- [x] **La seconda forma di vuoto, e le tre facce di `urgenzaOre`** *(03/08)* —
      la prima sonda guardava la **lista vuota**; esiste un secondo vuoto, più
      frequente: **la riga c'è e non è compilata**. Rifatta con `[{}]` al posto
      di `[]`: **tre casi in più**, e uno merita di essere scritto.
      `flotta.urgenzaOre` con `orePreviste` a `null` risponde **«SCADUTA (+500
      h)» in rosso** — `+null === 0`, cioè un **allarme inventato**, ed è la
      ragione per cui la prima sonda non l'aveva visto: cercava il *tranquillo*,
      e questo è il contrario. Con un valore non numerico scrive «**tra NaN h**»
      in verde; con tutt'e due ignote dice «**a 0 h**», e il ramo giusto
      (`"a ore"`) non si raggiunge perché `+null` è finito. La cosa istruttiva:
      la funzione era stata **appena corretta** per il difetto gemello — il
      commento lo racconta, «*zero ore* e *non lo so* sono due cose diverse» — e
      la guardia è finita su **`oreAttuali`** e non su **`orePreviste`**. Stesso
      difetto, stessa funzione, stesso giorno: **metà chiusa e metà no**.
      Raggiungibilità misurata: **dormiente**, tutti e quattro i punti di
      chiamata guardano prima e il form passa da un validatore — ma la
      protezione poggia su quattro chiamanti che si ricordano, e la correzione è
      di **tre righe** dentro la funzione, nella stessa forma già scritta lì
      accanto. La sonda adesso prova **entrambe** le forme (12 casi, 11
      dichiarati con la ragione, 1 rosso). Corollario per `CLAUDE.md`: **anche
      una sonda copre solo la forma di vuoto che le si dà in pasto** — quando un
      controllo dice «tutto a posto», la domanda dopo non è «funziona?» ma «che
      cosa ha guardato?».
      **✅ Corretto** in `c985af2` (Flotta) e `59c8601` (Sentinella).
- [x] **La terza sonda non ha trovato quello che cercava, e non la si tiene**
      *(03/08)* — chiamava le funzioni coi **dati veri della dimostrazione**
      cercando «NaN», «undefined», «Invalid Date» nelle stringhe che l'utente
      legge. **Non ha finito**: si è piantata, e le combinazioni che genera sono
      in buona parte spazzatura. Come sonda **non vale** e **non entra nel
      repository** — gonfiare un risultato che non c'è è il modo più veloce di
      rendere inservibili anche le altre. Ma il punto in cui si è piantata vale
      due righe, perché **il modo di rompersi è peggio di un numero sbagliato**:
      `incassoPerMese(fatture, mesi = 6, oggi)` ha `for (let i = 0; i < mesi;
      i++)`, e passandogli una **data** nella casella del conteggio `i < mesi` la
      converte in millisecondi dall'epoca — **1.785.456.000.000 giri**, ognuno
      con una `Date` nuova e una chiave in più: la scheda **muore di memoria**,
      senza un errore da mostrare. Raggiungibilità: **nessuna dai dati**, solo
      sbagliando l'ordine degli argomenti — ma è uno sbaglio **invitato**, perché
      in Conti `agingIncassi`, `prioritaIncasso`, `esposizioneClienti` e
      `kpiFrom` hanno tutte `oggi` in seconda o terza posizione e questa è
      **l'unica** in cui il secondo posto è un conteggio. Due righe di guardia.
      E una lezione di metodo: **una cosa che non si blocca si prova in un
      processo figlio**, non nello stesso — oggi la prova giusta non farebbe
      *cadere* la suite, la **fermerebbe**, e una suite ferma non è un esito.
      Misurato in figlio: «non ritorna entro 6 secondi».
      **✅ Corretto** in `c985af2`: `mesi` accettato solo se finito, positivo e
      sotto un tetto di 60; tutto il resto ricade sul valore di serie.
- [x] **E come si chiama, il dato che manca?** *(03/08)* — prima di aggiungere
      un'etichetta nuova, la domanda che la direttiva sull'eccellenza impone:
      *come lo dice già l'app?* Censite le **120 etichette di stato** dei sei
      moduli, Sentinella ne aveva **cinque** che sembrano dire la stessa cosa —
      e guardate una per una **non lo dicono**: sono cinque **portate** diverse
      («Senza dati» un periodo · «Mai misurato» un punto · «Manca <il campo>» un
      campo · «Dato mancante» il ripiego · «Senza frequenza» un'impostazione). La
      precisione è giusta; il rischio è il **sesto** termine — e stavo per
      correrlo io, la scheda proponeva «senza data» per il punto importato da
      CSV. Controllo aggiunto a `sonda-vuoto.mjs`: chi ne aggiunge uno lo
      dichiara **con la sua portata**, e chi ne toglie uno accorcia l'elenco.
      ⚠️ **La controprova ha bocciato la prima versione**: il filtro cercava solo
      le frasi che **somigliavano già** a quelle note, quindi iniettando «Senza
      rilevazioni» — esattamente il sinonimo che il controllo esiste per fermare
      — **non succedeva niente**. Cieco proprio sul caso per cui era nato: è la
      **quarta** volta che si presenta *il controllo che non guarda dove crede*.
      Adesso il filtro è un **lessico dell'assenza**, e il suo limite è scritto
      invece che scoperto (ferma le varianti costruite con le parole
      dell'assenza, non un'invenzione lessicale: «Da rilevare» sì, «In attesa»
      no). Controprova a tre difetti, tre su tre col motivo giusto.
      **E poi si è visto che il vocabolario non è di Sentinella**: allargato il
      controllo a tutte e sei le app, **«senza data» è già la convenzione di TRE**
      (Flotta, Scudo, Terra) e «… n.d.» di **due** (Scudo «Idoneità n.d.», Terra
      «Accuratezza n.d.») — **11 etichette di assenza su 213**. Il vocabolario è
      già **dell'ecosistema**, non di un'app, e allora il posto dove tenerlo
      chiuso è uno solo. Ne segue la decisione che restava aperta: il punto
      importato senza storico si chiamerà **«senza data»**, come lo dicono già in
      tre — non un termine nuovo. Controprova rifatta a sei app: il sinonimo
      iniettato **in Flotta** (che la versione a una sola app non avrebbe visto),
      la famiglia rimasta senza chi la usa, il filtro accecato — tre su tre.
      *(E l'ancora dell'iniezione compariva **due** volte, perché la stessa riga
      di lettura sta in due giri: allungata col contesto, come per
      `durataTurnoDi`.)*
- [x] ✅ **UNA SCADENZA CON LA DATA ILLEGGIBILE È «REGOLARE» — e si arriva da un
      import CSV** *(trovato e **corretto** il 03/08, `706cbb1`;
      `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`)* — la sonda guardava le sei app; allargata a `shared/`
      — dove la regola vincolante dice che vive ciò che serve a due app, cioè
      dove un difetto **si moltiplica per sei** — ha risposto subito:
      `statoScadenzaHSE` fa `if (Number.isNaN(t)) return "regolare"`. Si vede in
      **Scudo**, l'app della sicurezza, dove è l'alias `statoScadenza` chiamato
      una **trentina** di volte. **Non è dormiente**: `parseScadenzeCsv` filtra
      con `/^\d{4}-\d{2}-\d{2}$/`, che controlla la **forma** e non l'esistenza —
      **`2026-13-45` passa**, `Date.parse` dà `NaN`, e la riga entra in archivio
      **verde per sempre**. Misurato: una scadenza di **idoneità sanitaria** con
      un errore di battitura non compare fra le urgenti, non entra nel muro, non
      genera promemoria. E dodici righe sotto, **nello stesso file**,
      `idoneitaOperatore` apre col commento «non esistono risposte mancanti,
      esistono risposte che dicono *non lo so* e perché» — due funzioni, stesso
      file, trattamento opposto. Correzione: `statoScadenzaHSE` risponde **«senza
      data»** (il termine che l'ecosistema già usa in tre app) e le trenta
      chiamate **non** si toccano, perché quasi tutte confrontano con
      `!== "regolare"` e quindi la riga rotta comincia **da sola** a comparire fra
      quelle da guardare; e `parseScadenzeCsv` controlla che la data **esista**,
      scartando la riga **dicendo perché**. La sonda adesso guarda anche
      `shared/dw-ponti.js`, `dw-shell.js` e `pointcloud.js`.
      **✅ Fatto** in `706cbb1`, e sono uscite **sei** correzioni dello stesso
      difetto: `statoScadenzaHSE` → «senza data»; `idoneitaOperatore`, che lo
      ripresentava un piano più su (un operatore con un documento illeggibile
      risultava «regolare»); il `peso` dell'ordinamento, dove un valore nuovo
      avrebbe dato `NaN` muto; `livelloScadenza` di Scudo (diceva già «senza
      data» ma **in verde**); la mappa `B` dei badge, senza la quale
      `B[st]` è `undefined` e la pagina muore al primo riquadro; e **tutta la
      famiglia gemella in Terra**, che aveva lo stesso difetto con altri nomi.
      Nata anche `dataISOEsiste` in `dw-shell.js`, perché **`Date.parse` da solo
      non basta**: «2026-02-30» non è `NaN`, JavaScript lo fa scivolare al 2
      marzo — una scadenza spostata di due giorni in silenzio.
      ⚠️ **Due prove blindavano il difetto**, e i loro nomi lo dicevano: «senza
      data non allarma» e «una scadenza SENZA data non allarma (= regolare)».
      Non erano sviste: erano la convinzione del momento messa per iscritto. Una
      terza (il riepilogo di Terra) **quadrava lo stesso**, perché la riga
      illeggibile finiva fra le «a posto»: il conto tornava e diceva una cosa
      falsa.

- [x] **Il banco di Genesi, scritto PRIMA della migrazione** ✅ *(04/08, `bb09c38`)* —
      `tests/browser/genesi-struttura.mjs`. Le tre trappole dell'unità A non sono
      errori di sintassi (la pagina si apre lo stesso), quindi il controllo deve
      **toccare la pagina**: i sette id dell'editor 3D ancora al loro posto, il
      **cancello di consenso** che si sblocca con la casella e dice ancora
      «vietato … sgombero», e il campo del nome **precompilato** — la trappola di
      `chiediValore`, che compilerebbe in silenzio. Con controprova incorporata
      (`--prima`) che rimette gli id `mdl*` **nella risposta HTTP**, senza toccare
      il file. ⚠️ Scritto e **non ancora eseguito**, e detto: girava il giro a 25
      banchi. Va lanciato prima della migrazione, e oggi deve fallire.
- [x] **Ricerca: l'evento di sicurezza dal campo → Scudo** ✅ *(04/08,
      `docs/RICERCA_EVENTO_SICUREZZA_DAL_CAMPO_202608.md`)* — il censimento
      parlava di «domande sui permessi Firestore»: **non ci sono**. Sentinella
      scrive già dentro Scudo (`ponteScudo`), e le regole permettono a qualunque
      **membro dell'organizzazione** di scrivere sotto qualunque `appId`. Da lì
      una cosa da dire bene: il confine fra **organizzazioni** è una barriera
      (regole + claim + 58 test), quello fra **app** è una **convenzione del
      percorso** — chiunque può inizializzare l'SDK con un altro `appId`, ed è
      quello che il ponte fa di proposito. Non è un difetto; non va raccontato
      come una garanzia.
      ⚠️ **E una «scoperta» che non lo era, corretta lo stesso giorno**: la prima
      stesura annunciava come nuovo l'obbligo di comunicazione dei near-miss
      (L. 198/2025). Era **già noto**, citato in sei punti di Scudo, con il
      prospetto aggregato **già fatto**. Annunciarlo sarebbe stato **gonfiare un
      risultato**, che la direttiva 5 vieta. Quello che resta ed è vero: la
      segnalazione dal campo non serve a costruire il prospetto — serve a
      **riempirlo di verità**, ed è il numeratore, non il foglio.
- [x] ✅ **IL VERDE SU UN ANNO CHE NESSUNO HA MISURATO** *(04/08)* — la sonda del
      vuoto chiamava le funzioni con **tutto** vuoto, e c'è una forma che non
      riproduceva mai: **un argomento assente accanto a uno buono** — proprio
      quella di `urgenzaOre`, dove le ore fatte si sanno e il tagliando previsto
      no. Con tutto vuoto una funzione si ferma sulla prima guardia e non arriva
      mai al conto che sbaglia. Aggiunte sei forme miste, è saltato fuori
      `terra.proiezioneAnnua`: `stato` rispondeva **"ok"** anche quando non
      c'era niente da proiettare, e la pagina di Terra ci **colora il KPI
      dell'avanzamento**. Misurato in pagina: con zero rilievi dell'anno il KPI
      era `kpi ok`, numero in **teal pieno `rgb(39,190,165)`**; e la frase
      accanto diceva «*al ritmo attuale ~0 m³ — sotto il limite autorizzato*».
      **Zero non è un ritmo lento: è l'assenza della misura.**
      La cosa istruttiva è **chi lo sapeva già**: il grafico dell'avanzamento si
      difendeva da solo (`stato === "ok" ? null`), il KPI no. Una regola che
      serve a due posti va scritta **una volta**, e il posto è la funzione: ora
      `stato` distingue `senza-rilievi` e `presto` dai tre stati che sono una
      **misura**, e i due chiamanti accendono il colore solo su quelli.
      Controprovato due volte: (a) rimesso il difetto, **`run-kpi` e la sonda
      cadono tutt'e due**, ripristino identico all'originale; (b) rimesso il
      difetto **e tolte le sei forme**, la sonda **non lo vede** — cioè sono
      state loro a trovarlo, non è un merito raccontato a vuoto.
      E il filtro nuovo (`valePer`: una forma vale solo se a quella funzione
      manca davvero qualcosa) ha **accecato la sonda al primo tentativo**,
      perché contava «presente» un array con dentro un record vuoto — che è la
      forma più produttiva di tutte. Se ne è accorta la **seconda guardia**
      (`campo.pianoRiepilogo` sparito dagli allarmi dichiarati): non era
      guarito, non veniva più chiamato. Reso ricorsivo: **885** somministrazioni
      scartate invece di 2.739. *Un filtro che toglie rumore va misurato anche
      su quello che toglie di buono.*
      Suite: **1.359 → 1.360**, tutte verdi con `TZ=Europe/Rome`.
- [x] ✅ **LA REGOLA VIOLATA DUE VOLTE È DIVENTATA UN CONTROLLO** *(04/08)* — non
      si modificano moduli dati e pagine mentre gira un giro del browser: scritto
      in `CLAUDE.md` dal 01/08, col racconto dei 19 banchi buttati e la
      domanda-guida. **Violata due volte in due giorni**, la seconda dal cantiere
      che il giorno prima aveva scritto il paragrafo. Il giro di oggi è stato
      ucciso; per fortuna era fermo a *flotta* e Terra non era ancora stata
      aperta — ma l'ho saputo **dopo**. Adesso `tutti.mjs` prende l'**impronta**
      dei file che le pagine caricano prima del giro, **dopo ogni banco** e alla
      fine: se qualcosa cambia **dichiara sé stesso NON VALIDO** (uscita `2`),
      dice dopo quale banco e **quanti banchi hanno ancora misurato il codice
      giusto** — invece di un riepilogo verde con un avviso in mezzo, che
      verrebbe letto come verde. Test, `docs/` e `vault/` non fanno scattare
      niente, di proposito: un controllo che grida al lupo dove il lavoro è
      permesso viene spento al secondo giro. **Due** controprove, perché la prima
      non basta: il rilevatore (`impronta.mjs --controprova`, 6 prove) e il
      **collegamento** (`impronta-giro.mjs`, 7 prove, su radice finta) — *una
      guardia scollegata non è un errore di sintassi*, come il `<script>`
      dimenticato. Trovato per strada: **`sonda-vuoto.mjs` non era in `npm
      test`** — un controllo permanente che girava solo a memoria. Ora c'è.
      E la CI del commit prima aveva ragione: `numeri-nei-documenti.mjs` ha visto
      tre documenti fermi a «1.359». Aggiornati.
- [x] ✅ **IL BANCO DI GENESI HA IMPARATO A FALLIRE ONESTAMENTE** *(04/08)* —
      `genesi-struttura.mjs`, scritto ieri **prima** della migrazione, oggi
      doveva cadere. È caduto, ma per arrivarci ha mostrato **tre difetti suoi**:
      (1) non falliva, **moriva** — `window.toast(...)` non esiste ancora e
      l'eccezione non raccolta ha ucciso il processo **alla nona prova su
      diciotto**, e un banco spento a metà non può dire quante prove ha fatto;
      (2) la controprova `--prima` non contava le proprie iniezioni; (3) e il
      conto **non bastava**. Qui la misura ha corretto l'ipotesi: mi aspettavo
      **zero** sostituzioni, ne è arrivata **una su sei** — `id="modal"`, perché
      oggi quell'id è del **cancello di consenso**, cioè **la trappola 1 scritta
      nell'intestazione di quel file**. Il difetto che il banco sorveglia era la
      ragione per cui la sua controprova mentiva, e con la guardia «ho iniettato
      qualcosa?» il verdetto sarebbe stato **verde**. La condizione giusta è
      un'altra: *una controprova dimostra qualcosa solo se, **tolta
      l'iniezione**, il banco passerebbe*. Ora `--prima` esce **3** e lo dichiara
      finché il `<script>` di `shared/dw-app-ui.js` non è nella pagina.
      Stato: **18 prove, 3 passate, 15 fallite** — e le tre che già passano sono
      quelle che la migrazione **non deve rompere** (nessun errore in pagina, i
      **sette** id dell'editor 3D, il bottone «salva la volata»).
      ⚠️ Non entra in `tutti.mjs` finché fallisce per progetto: ci va **con** la
      migrazione, nello stesso commit in cui comincia a passare.
- [x] ✅ **GENESI UNITÀ A — l'ultima copia della struttura è sparita** *(04/08)* —
      Genesi era l'**ultima** superficie a tenersi in casa `toast`, `mdlApri`,
      `mdlChiudi`, `chiedi`, `chiediValore` e i due ascoltatori. Ora le prende da
      `shared/dw-app-ui.js`, e `COPIA_PROPRIA` ha **un solo nome**: il core, che
      è l'originale. **21 sostituzioni contate**, −1.851 caratteri netti.
      Banco: **da 3/18 a 18/18**; controprova `--prima`: **14 cadute con 6
      iniezioni**, verdetto guadagnato.
      ⚠️ **Una quarta trappola che il piano non aveva**: il CSS vestiva il
      cancello di consenso **per id** — otto regole `#modal{…}`, fra cui
      `display:flex` senza condizione. Rinominando solo il markup, quelle regole
      sarebbero rimaste addosso al **nuovo** `#modal`, che è nascosto da una
      **classe** (`.modal-ov{display:none}`): l'id vince, e Genesi si sarebbe
      aperta con un **velo nero fisso** davanti a tutto, senza un errore in
      console. *Quando si sposta un nome non basta cercare chi lo chiama: va
      cercato anche chi lo veste.*
      ⚠️ **E una cosa vista solo nello screenshot**: l'etichetta della casella
      del consenso è `display:flex`, quindi ogni figlio è una **colonna** — il
      `<b>estetici</b>` finiva in una colonna sua e la frase dell'**avvertenza di
      sicurezza** usciva spezzata in quattro pezzi affiancati. Preesistente,
      invisibile nel codice, corretta con uno `<span>`.
      Non presi di proposito: `go()` (Genesi non ha `.page` né la pillola), il
      **foglio di stile** (unità B, e ora c'è un controllo che gli impedisce di
      entrare per distrazione) e l'**alone** sulle schede della Home — Genesi ne
      ha già uno suo, scritto in **pixel** contro la **percentuale** del
      condiviso: due mani sulla stessa variabile, due posizioni diverse.
      Tre prove «di passaggio» in `numeri-nei-documenti.mjs` sono cadute il
      giorno giusto e sono state **girate**, non cancellate: guardano il verso
      opposto. Banchi del browser **25 → 27**.

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
4. Nuova **PR verso main** per il lavoro di questa settimana. ⚠️ *Stato al
   31/07: la **PR #322** è aperta e contiene già anche il lavoro di oggi (stesso
   ramo), ma la sua **descrizione si ferma al 30/07** — chi la legge non trova la
   giornata su import/export, gli zeri di comodo e le due regole nuove. La
   descrizione è tua: dimmi se la aggiorno io o preferisci scriverla tu. La CI
   della PR gira anche le **106 prove con l'emulatore**, che in questo ambiente
   non partono.*

## RIFERIMENTI
- Ricerche: `docs/RICERCA_{SCUDO,CAMPO,FLOTTA,CONTI,SENTINELLA,TERRA,GENESI}_202607.md`
- Estetica: `docs/SPECIFICA_ESTETICA_CORE.md`
- Ultimo checkpoint: `vault/checkpoints/` (file col timestamp più alto)
