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
- [ ] S4. **Matrice formazione per mansione** + nomine (incluso il
      **sorvegliante**, obbligatorio in cava, e il preposto).
- [ ] S5. **Registro DPI per lavoratore** (consegna, addestramento, verbale).
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
- [ ] **G6. Banda d'incertezza da precisione di perforazione** (Monte-Carlo,
      tutto sintetico).
- [ ] G7–G9: ottimizzatore di volata, report professionale, rifiniture scena.

## BLOCCO 4 — I PONTI TRA LE APP *(il valore d'insieme)*
- [ ] P1. **Genesi → Sentinella**: la volata progettata entra nel registro di
      monitoraggio; Sentinella aggiunge il misurato e calcola lo scarto. Con
      abbastanza volate si tara la legge di sito e il dato **torna in Genesi**
      (chiude il cerchio con G3).
- [ ] P2. **Campo → Terra**: produzione del turno → volumi per fronte.
- [ ] P3. **Terra → Conti**: m³ → tonnellate → valore (usando la densità di N1).
- [ ] P4. **Riconciliazione**: m³ estratti vs tonnellate vendute.

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
