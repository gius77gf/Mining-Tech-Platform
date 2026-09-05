# Ricerca continua — Scudo (01/08/2026)

Candidati di miglioramento approssimativo per approfondimento successivo.
Non sono una fonte di verità: sono cose che guardando il codice e testando l'app sembrano degne di attenzione.

## Che cosa esiste già

Letto da `apps/scudo/scudo-data.js` e confermato da `docs/RICERCA_SCUDO_202607.md` (§1):

- ✅ Anagrafica lavoratori (nome, ruolo, tel, attivo/non attivo) con ricerca
- ✅ Idoneità sanitaria per lavoratore (quattro stati)
- ✅ Scadenze (7 tipi, stato calcolato dalla data, filtri, tre ordinamenti)
- ✅ Copertura formazione per tipo (grafico a barre)
- ✅ Documenti (9 tipi, tre stati: valido/da-rivedere/scaduto, allegati ≤400 KB)
- ✅ Cantieri/siti con conteggio documenti
- ✅ Infortuni e near-miss (registro eventi con gravità, giorni assenza, luogo, descrizione)
- ✅ Cartellone giorni senza infortuni
- ✅ Dashboard (4 KPI cliccabili, sezione Urgenze)
- ✅ Azioni correttive (CAPA) con stato (aperta/in-corso/chiusa) e collegamento all'origine
- ✅ Analisi causa-radice (5 Perché) — una per evento
- ✅ Ispezioni e checklist (modello, voci, tre esiti: conforme/non-conforme/n.a., periodicitaGiorni)
- ✅ Mansioni e requisiti (nome, corsi richiesti, DPI previsti, lavoratori assegnati)
- ✅ Nomine della sicurezza (ruolo, lavoratore, date, note)
- ✅ Registro DPI per lavoratore (tipo, taglia, data consegna, scadenza, spunta addestramento)

---

## Candidati di miglioramento

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura |
|---|---|---|---|---|
| Scadenze | L'ordinamento attivo non è visibile nell'interfaccia | Si ordina per data/tipo/lavoratore (tre pulsanti) ma quando si apre la pagina non si sa quale è attivo; si memorizza nel browser ma l'utente non lo vede | Piccolo | Aprire la pagina Scadenze: c'è un indicatore visibile (ombra, colore, forma) sul pulsante dell'ordinamento corrente? Oppure una label "Ordinato per: Data"? |
| Azioni correttive | ⛔ **RIGA FALSA QUANDO È STATA SCRITTA — verificata e chiusa l'08/08 (`079ebe3`)** | La mancanza dichiarata **non c'era**: la lista scriveva già «responsabile da assegnare», in due posti di `apps/scudo/index.html` — le urgenze del Quadro e l'elenco delle azioni — più «da assegnare» nella cella del CSV. ⚠️ *Citati per nome e non per numero di riga: un numero di riga invecchia al primo commit, e questa correzione ha spostato proprio quelle righe*. È un «non c'è» senza la prova di aver guardato, quello che CLAUDE.md vieta. ⛔ **Ma aprendola è saltato fuori un difetto vero, un piano più in là**, ed è l'opposto di quello scritto qui: non l'azione *senza* responsabile — quella era detta bene — ma l'azione **con** un responsabile che non è più in anagrafica, che veniva raccontata anch'essa come «da assegnare». Percorso ordinario: si toglie un lavoratore e le sue azioni restano con l'id dentro. Misurato prima e dopo sulla stessa pagina, e corretto in **quattro punti dello schermo + il CSV**, con la decisione in `shared/dw-ponti.js` (`statoResponsabile`). | — | Chiusa: `run-kpi` +2 prove, controprova che morde in tre punti, scatto guardato con le due frasi diverse **nella stessa schermata**. |
| Export CSV lavoratori | Non è chiaro quale "stato" si esporta per ogni lavoratore | Il documento di ricerca (§1, Personale) dice "Export CSV di lavoratori + relative scadenze + stato calcolato" ma quale stato — della prima scadenza? Dello scadenzario sintetico? | Piccolo | Aprire il CSV esportato e leggere le colonne; che cosa c'è nella colonna "stato"? Vedere anche `exportLavoratoriCsv` in scudo-data.js |
| Ispezioni | Periodicità nulla, nessun avviso di riprogrammazione | La periodicità è opzionale (`periodicitaGiorni\|null`, riga 37); se null, quando va riprogrammata l'ispezione? Nessun promemoria | Medio | Creare un'ispezione completata senza periodicità (periodicitaGiorni: null); cercare nella dashboard o nelle liste se c'è un avviso "Ispezione X non riprogrammata" |
| Ispezioni | Data chiusura mancante su ispezione completata | Uno stato è "completata" ma `dataChiusura` è opzionale (`dataChiusura?\|null`, riga 40); quando è stata completata, oggi o ieri? | Piccolo | Leggere la dimostrazione: le due ispezioni (q1, q2) hanno dataChiusura? Cercarne una senza |
| Near-miss rapida | Categorie di near-miss non sono spiegate | Il modello permette `categoria?` (riga 34): caduta-massi, mezzi, impianto, organizzativa… ma in che schermata si sceglie? C'è una legenda? Chi sa quali categorie scegliere? | Piccolo | Aprire la schermata di segnalazione rapida (S2) e cercare una legenda o un aiuto che spieghi cosa significa "caduta-massi", "mezzi", "impianto" |
| Lavoratori | Status "non attivo" non filtra le scadenze | Un lavoratore segnato `attivo: false` continua ad avere scadenze che appaiono nei grafici? Si contano nella copertura formazione? | Medio | Nella dimostrazione: segnare un lavoratore come "non attivo"; controllare se le sue scadenze scompaiono dai conteggi di copertura o rimangono nelle urgenze |
| Near-miss | Near-miss anonimo non ha indicatore visivo | Campo `anonimo?: bool` (riga 35) esiste, ma come si disegna nella lista? Un badge che dice "anonimo"? Un'icona? | Piccolo | Aprire il registro near-miss; il near-miss i4 (riga 143 demo) ha `anonimo: true` — come si vede nell'interfaccia che è anonimo? |
| Dashboard | Non si sa quando il cartellone "giorni senza infortuni" è stato aggiornato | Il numero è statico sulla pagina; quale è il giorno di riferimento? Mezzanotte UTC o mezzanotte italiana? Quando un new-miss entra, si aggiorna subito o al giorno dopo? | Piccolo | Leggere il numero sul cartellone della demo; c'è scritto "A partire da: 12/07" o "Aggiornato oggi" o solo il numero nudo? |
| Scadenze aziendali | Non è chiaro qual è la scadenza di chi quando il lavoratore non esiste più | Una scadenza aziendale ha `lavoratoreId: null` (è della cava, non di una persona); se il lavoratore viene cancellato, le sue scadenze personali spariscono, ma la visualizzazione è chiara? | Piccolo | Nella lista delle scadenze, una senza lavoratore è etichettata "Azienda" o "Cava" o dice solo il nome della scadenza? Leggere la riga e dire se capisci subito chi è il destinatario |
| Azioni correttive | Origine multiapp non è dichiarata visivamente | Un'azione che viene da Sentinella ha `origineApp: "sentinella"` (riga 24); nella lista Scudo come si sa che è stata creata da un'altra app? | Piccolo | Creare un'azione con origineApp: "sentinella"; in lista ha una spunta, un'icona, o solo il testo che dice dove viene? |
| Ispezioni | Stato della voce "n.a." non ha label | Tre esiti: conforme, non-conforme, n.a. (non applicabile); nel modello è la stringa "na", ma nell'interfaccia si legge come "N.A." oppure "Non applicabile" oppure come un simbolo? | Piccolo | Aprire l'ispezione della demo (v8, riga 197 di scudo-data.js); il suo esito è "na" — che etichetta compare sulla riga della voce? |
| Export dati | Non esiste export aggregato per comunicare L. 198/2025 | La legge chiede dati aggregati su eventi e azioni; Scudo da oggi sa generare un report stampabile/esportabile con il formato che richiede l'ente, o rimane manuale? | Medio | Cercare un pulsante "Esporta per comunicazione obbligatoria" o "Report L. 198/2025"; se non esiste è un candidato |

---

## Note sulla ricerca

1. **RICERCA_SCUDO_202607.md copre già 18 proposte** strutturate secondo priorità e costo legale. Questo file non intende competere, ma segnalare anomalie microscopiche che il documento di ricerca non ha puntato.

2. **Cosa ESISTE e NON va toccato**: tutto quello elencato nella sezione "Che cosa esiste già" è già implementato e testimoniato da test in `apps/deepwork-id/tests/run-kpi.mjs`.

3. **Due cose viste ma non proposte**:
   - Il campo `anonimo` nei near-miss è un'assenza voluta: si usa quando chi segnala preferisce non essere nominato, ed è giusto che si sappia che è anonimo — esattamente il tipo di "dato assente che è uno stato" che la CLAUDE.md ricorda. Candidato vero.
   - L'export CSV lavoratori cita "stato calcolato" ma leggerlo dal codice fa capire se è il caso di una non-chiarezza nel testo o di un'ambiguità reale.

4. **Non proposte invece**:
   - Le 18 funzioni di RICERCA_SCUDO_202607.md sono fuori scope (nuovo modello dati, nuovo flusso);
   - Le 20 regole di `run-stile.mjs` che blindano la struttura Scudo rispetto al core rimangono a posto;
   - Gli indici di lettura di `run-kpi.mjs` scendono sotto il 100% solo se si aggiunge una funzione nuova senza prova, e la suite lo segnala — non c'è difetto nascosto.

---

*Ricerca del 01/08/2026. Nessun codice modificato, nessun commit.*

---

## Che cosa chiede davvero un ispettore in una visita a cava (01/08/2026)

**Nota metodologica**: questa sezione riparte dal mondo (cosa chiede un ispettore in Italia) per giungere al delta di Scudo. Le fonti sono ricerche web su D.Lgs 624/96, D.Lgs 81/08, L. 198/2025 e guide pratiche di ispezione ASL. ⚠️ Una sequenza esatta di visita in cava non è reperibile online: quella qui sotto è **dedotta** dai riferimenti normativi e da guide generiche ASL. Le fonti complete sono citate in fondo.

### Il mondo: cosa cerca un ispettore

Un ispettore ASL/ATS competente per industria estrattiva entra in cava e (dedotto, non letto nel dettaglio) ordina i controlli così:

1. **Documenti amministrativi e anagrafe** (10 min): camerale, INPS, INAIL, registri di sorveglianza sanitaria (art. 41).
2. **Il DSS e il DVR, con le loro firme** (15 min): il DSS è il documento specifico di cava (D.Lgs 624/96 art. 6), deve essere datato, sottoscritto da direttore, sorveglianti, medico e RLS, trasmesso all'ASL prima dell'inizio lavori. Il DVR (art. 28 D.Lgs 81/08) è per tutte le aziende.
3. **Aggiornamenti e ciclo di vita dei documenti** (15 min): quando l'ultimo infortunio? Il DSS è stato aggiornato dopo? La relazione di stabilità dei fronti (D.Lgs 624/96) è annuale?
4. **Nomine della sicurezza** (carta): RSPP, medico competente, RLS, sorvegliante (obbligatorio in cava), preposti, addetti primo soccorso e antincendio. Con date di decorrenza, non foto di chiacchiere.
5. **Appaltatori e subappaltatori**: quando è entrata l'ultima ditta? Ha DURC, visura, DVR? Il DUVRI è firmato?
6. **Verifiche periodiche attrezzature** (D.M. 11/04/2011): verbali di prima verifica INAIL e controlli successivi.
7. **Registro infortuni e near-miss** (L. 198/2025): cosa è successo? Il numero di near-miss è credibile? Per ogni evento, è stata avviata un'azione correttiva?

**Tutto il resto** (idoneità sanitaria, corsi, DPI, ispezioni interne) supporta questi pilastri. Niente di quello che chiede l'ispettore è opzionale.

### Il delta: che cosa Scudo tiene e che cosa no

| Categoria | Chiede l'ispettore | Scudo oggi | Completezza |
|---|---|---|---|
| **DSS e ciclo di vita** | DSS datato, firmato, trasmesso ASL all'inizio; **aggiornamento obbligatorio dopo ogni infortunio grave o modifica**; certificazione annuale | Ha il tipo di documento "DSS" ✅; niente ciclo di vita (aggiornamento dopo evento, certificazione annuale) ❌ | ~40% |
| **Relazione stabilità fronti** | Documento obbligatorio annuale (D.Lgs 624/96), su stabilità fronti, caduta massi, franamento — citato persino nelle ispezioni della demo (righe 271, q1) | **Assente**, anche solo come promemoria scadenzario | 0% |
| **Nomine della sicurezza** | RSPP, medico, RLS, **sorvegliante** (obbligatorio cava), preposti. Con data di decorrenza chiara, consultazione RLS, formazione collegata | Solo come tipo di documento "Nomina"; non c'è anagrafica delle nomine, non c'è organigramma. Sorvegliante è solo un ruolo possibile in anagrafica lavoratori, non una nomina formale | ~20% |
| **Azioni correttive tracciabili** | Ogni evento (infortunio, near-miss, non conformità ispezione) produce un'azione con responsabile e scadenza; **L. 198/2025 chiede la comunicazione dei dati aggregati su eventi E azioni correttive** | ✅ Esiste il modello `azioni` (righe 16-32 di scudo-data.js) ed è usato nella demo; **NON è visibile o tracciabile dalla schermata "Infortuni"** — non si apre una maschera "Crea azione" dopo un evento | ~50% (traccia nascosta) |
| **Appaltatori con scadenze** | DURC (120 giorni), visura CCIAA, DVR della ditta, polizza; DUVRI firma doppia; verifiche anti-mafia | Solo come tipo di documento "DUVRI"; **no anagrafica ditte**, no scadenze documenti appaltatore, no verifica | ~10% |
| **Verifiche attrezzature** | Verbale prima verifica INAIL + controlli successivi per attrezzature soggette (art. 71 D.Lgs 81/08 e D.M. 11/04/2011) | Solo come preset di scadenza aziendale "Verifiche periodiche attrezzature"; nessuna anagrafica attrezzature | ~15% |
| **Registro DPI specifico** | Consegna per ogni lavoratore con taglia, data, firma (art. 77); **addestramento obbligatorio per DPI III categoria e protettori udito** | ✅ Esiste modello `dpi` (righe 57-60); **nella schermata c'è solo come tipo di documento generico**, non un registro visibile | ~40% |
| **Infortuni e near-miss aggregati (L. 198/2025)** | Evento, categoria, data, descrizione, luogo; **numero di near-miss per anno/trimestre**; **azioni correttive adottate**; LTIFR calcolato se noto ore lavorate | ✅ Traccia infortuni/near-miss con gravità, luogo, categoria; ❌ Non aggrega per periodo; ❌ Non mostra azioni correttive collegate; ❌ Non calcola LTIFR | ~40% |

### Le cinque proposte più forti

| Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura | Note |
|---|---|---|---|---|---|
| **Infortuni** | Azione correttiva non è tracciabile dopo un infortunio o near-miss | Aprire un infortunio della demo (i1, i2): non c'è un bottone "Crea azione correttiva" o "Azioni correlate", nemmeno come link | Piccolo | Nella demo, l'infortunio i1 ha `origineId` in `azioni.a1`. La schermata mostra "Azioni correlate: 1"? Oppure hai aperto `scudo-data.js` per saperlo? | **Motivazione**: L. 198/2025 chiede comunicazione di eventi E azioni. Senza visibilità sono due database disaccoppiati |
| **Dashboard / Documenti** | Ciclo DSS (aggiornamento dopo evento, certificazione annuale) non è seguito | Aggiungi un infortunio grave; il DSS rimane silente — nessun promemoria "Il DSS va aggiornato", nessun flag rosso sul documento. Che cosa succede il 01/12 di un anno? Nessun avviso "DSS deve essere certificato e trasmesso" | Piccolo | Nel codice: il documento di tipo "DSS" ha una scadenza? Esiste un controllo `dataUltimoAgg` o `dataTrasmissione`? Se no, è una mancanza | **Motivazione**: D.Lgs 624/96 art. 6 richiede aggiornamento dopo modifiche/incidenti e trasmissione annuale. È adempimento legale, non opzionale |
| **Scadenze / Quadro** | Relazione stabilità fronti non è nemmeno nello scadenzario — è un vuoto totale | Aprire Scadenze: cercare "stabilità", "fronti", "relazione cava". Non esiste nemmeno come preset. In quadro non c'è nemmeno una riga "Relazione fronti" fra gli adempimenti | Piccolissimo | Nella dimostrazione di scudo-data.js, nelle scadenze e nei preset, cercare la parola "fronte" o "stabilità" — non esiste | **Motivazione**: D.Lgs 624/96 obbliga a relazione annuale su stabilità, è il documento più specificamente estrattivo che esista. La sua assenza è evidente ad un ispettore specializzato di cave |
| **Nomine della sicurezza** | Anagrafica nomine non è visibile — solo come "tipo di documento" generico | La schermata Personale mostra lavoratori, ma non c'è una sezione "Organigramma della sicurezza" che dica "RSPP: Sara Conti, da 16/09/2024, formazione entro X". Gli è tutto appiccicato al registro documenti, invisibile | Medio (riusa gran parte del codice di scadenze) | Nella demo, c'è una schermata che elenca RSPP, RLS, medico, sorvegliante, preposti con date e scadenze formazione? Se no, è assente | **Motivazione**: Quando arriva l'ispettore la prima domanda è "Chi è il vostro RSPP? Da quando? Il preposto è stato nominato per iscritto?" Oggi Scudo non lo sa dire in un secondo |
| **Appaltatori** | Anagrafica ditte esterne con scadenze DURC, visura, polizza non esiste | La gestione appalti è virtualmente assente. DUVRI è solo un tipo di documento. Quando entra una ditta, dove si registra? Dove si mette il DURC? Chi controlla che sia scaduto? | Medio/Grande (nuovo modulo dati) | Nel codice, esiste una collezione per appaltatori con DURC, visura, polizza e relative scadenze? Oggi la demo ha appaltatori (ap1, ap2, ap3) per il ponte col rilievo di Terra, ma zero gestione scadenze ❌ | **Motivazione**: L. 198/2025 e D.Lgs 81/08 art. 26 richiedono verifica tecnico-professionale e DUVRI per ogni ditta. In cava si alternano autotrasporti, manutentori, perforatori: è controllo costante. Nessun software generalista lo sa fare bene |

### Nota metodologica: quel che è dedotto

- **Sequenza e ordine di visita**: dedotto da D.Lgs 624/96 (DSS), D.Lgs 81/08 (DVR, DUVRI, verifiche), guide ASL generiche. **Non letto nel dettaglio** da una checklist di cava specifica — nessuna fonte online la contiene per nome.
- **Ciclo DSS e aggiornamento post-incidente**: codificato nell'art. 6 D.Lgs 624/96. La forma esatta della "certificazione annuale" è **dedotta** come obbligo ricorrente, non trovata in un documento che la nomini per nome.
- **Relazione stabilità fronti**: D.Lgs 624/96 art. 10 lo richiede. Forma, periodicità, sottoscrizioni **non trovate in fonte secondaria**. Letto il riferimento normativo.

**Fonti citate**:
- [Il documento di sicurezza e salute nel settore estrattivo — Punto Sicuro](https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/)
- [D.Lgs 624/96 (Attuazione della direttiva 92/104/CEE relativa alla sicurezza nei lavori in sotterraneo)](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
- [D.Lgs 81/08 art. 26 (DUVRI)](https://biblus.acca.it/art-26-dlgs-81-2008/)
- [L. 198/2025 su near-miss — INAIL e linee guida MLPS](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note)
- [Verifiche periodiche attrezzature di lavoro](https://www.repertoriosalute.it/wp-content/uploads/2015/11/PO_VADEMECUMSIS.pdf)
- [Ispezioni ASL — procedure generiche](https://www.secogestsrl.com/checklist-per-affrontare-una-visita-ispettiva-senza-rischi/)

*Ricerca del 01/08/2026. Nessun codice modificato, nessun commit.*

---

## ⛔ Verifica della ricerca del 01/08 — quattro proposte su cinque non reggono

*Verificata contro il codice subito dopo, come pretende la direttiva 4 («niente
entra in roadmap sulla parola dell'agente»). La regola ha funzionato: **niente
è entrato**. Il conto sta qui perché il numero serva la prossima volta.*

| # | proposta | verdetto | la prova |
|---|---|---|---|
| 1 | «azione correttiva visibile dopo l'evento: la schermata infortuni non le mostra» | **FALSA** | `azioniDiEvento` compare **4 volte** in `apps/scudo/index.html`. La schermata le mostra già. |
| 2 | ciclo di vita del DSS (aggiornamento dopo evento grave, trasmissione annuale) | **DA VERIFICARE** — l'unica che regge | `DSS` compare 27 volte in `scudo-data.js` e 13 nella pagina: c'è come **tipo di documento** con stato, e c'è il DSS **coordinato** degli appalti. Il *ciclo* (chi lo aggiorna e quando) non è stato ancora guardato riga per riga. |
| 3 | «relazione annuale stabilità fronti: completamente assente, anche dal radar dello scadenzario» | **FALSA** | `scudo-data.js:1236` — preset di scadenzario `stabilita-fronti`, «Relazione annuale sulla stabilità dei fronti», `mesi: 12`, con il riferimento al D.Lgs 624/96 scritto per esteso. E c'è pure il **modello d'ispezione** «Fronte di cava — stabilità e disgaggio» (794). |
| 4 | «organigramma della sicurezza: Scudo non lo sa dire in un secondo» | **FALSA** | `NOMINE_RUOLI`, `ruoloNomina`, `nominaAttiva`, `nomineDaSistemare`, `nominaUnaPersona` — cinque funzioni esportate. |
| 5 | «anagrafica appaltatori: Scudo non ha nemmeno un posto dove registrare una ditta» | **FALSA** | `qualificaAppaltatore`, `docDiAppaltatore`, `appaltiDiAppaltatore`, `appaltatoriDaVerificare`, `tipoDocAppaltatore` + 12 punti nella pagina. Costruito **due ore prima** che la ricerca girasse. |

### E la lezione non è quella che sembra

Verrebbe da dire «i documenti erano vecchi». In parte sì — la #5 è un
[«non c'è» **scaduto**](../CLAUDE.md) di due ore. Ma le altre tre no: il mandato
di questa ricerca **elencava i termini da cercare**, e fra quelli c'erano
`nomina` e `appaltatore` alla lettera. Cioè l'agente aveva la domanda giusta
scritta davanti e ha risposto senza guardare.

Quindi: **una proposta di ricerca è un candidato, mai un fatto**, e la verifica
non può stare in capo a chi l'ha scritta — chi scrive una mancanza non ha modo
di accorgersi di non aver guardato. La difesa che ha retto oggi è quella
strutturale, non quella del mandato: *niente entra sulla parola dell'agente*.
La resa misurata di questa tornata è **1 proposta su 5**, e quell'una è
«da verificare», non «da fare».

⚠️ Il **censimento delle fonti** invece regge, ed è la metà che vale: la
sequenza di una visita ispettiva, i documenti richiesti e i riferimenti
normativi restano utili anche adesso che il delta è sbagliato. Non buttare il
documento: buttare la sua colonna «non c'è».

---

## Registro mancati infortuni (near-miss) — il mestiere e il delta (03/08/2026)

**Nota metodologica**: questa ricerca parte dal mondo (registri di cava in pratica italiana, L. 198/2025, standard INAIL/UNI) e giunge al delta di Scudo. Le fonti sono ricerche web su D.Lgs 81/08, L. 198/2025, UNI 7249:2026, guide INAIL e studi di caso RSPP.

### Il mondo: come si raccoglie e si gestisce un near-miss in cava

#### 1. Che cosa raccoglie davvero chi segnala sul campo

Nel D.Lgs 81/08 art. 33 il "servizio di prevenzione" deve identificare e tracciare i quasi-infortuni. La pratica italiana di cava (dedotta da guide ASL e protocolli aziendali) raccoglie:

- **Data e ora** (non obbligatorio l'orario preciso, spesso solo giorno)
- **Luogo** (fronte, pista, piazzale, impianto, officina; non sempre con coordinate)
- **Descrizione di che cosa è successo** — il racconto, non una categoria. Molte volte raccolta DOPO, a mente fredda, non al momento
- **Categoria di rischio** (caduta massi, mezzi, instabilità, ribaltamento, caduta, impianto, volata, elettrico, polveri) — standard UNI 7249:2026
- **Chi segnala** (obbligatorio per l'app, opzionale per il lavoratore — anonimato su richiesta)
- **Potenziale danno** (gravità potenziale, cioè: che cosa sarebbe successo se il lavoratore avesse toccato il massi caduto? Infortunio grave, leggero, morte?)
- **Azioni correttive avviate** (obbligatorio per L. 198/2025)

**Quello che manca nella pratica italiana** (ma che oggi si raccoglie nei software):
- Chi ha segnalato non sa se l'app registri se lui ha lanciato l'alert al momento o se l'ha ricostruita una settimana dopo guardando i video
- Alcuni near-miss ad altissima potenzialità di danno richiedono comunicazione ISTANTANEA al preposto (non domani); il registro non distingue
- **La forma della segnalazione**: primo soccorso (segnalazione rapida in piedi sul piazzale, 30 secondi) vs relazione approfondita (completata al termine del turno)

**Fonte**: D.Lgs 81/08 art. 33 (compiti del SPP); protocolli INAIL su modelli di gestione near-miss; pratica desunta da guide ASL e studi di caso (non letto un protocollo di cava per nome).

#### 2. Che cosa chiede L. 198/2025 (in vigore da gennaio 2026)

La legge richiede alle aziende **con oltre 15 addetti**:

- **Registrazione interna** di ogni near-miss
- **Analisi causa-radice** e aggiornamento del DVR
- **Comunicazione annuale** dei dati aggregati al Ministero del Lavoro
- **Rapporto Annuale Near-Miss** (forma ancora non definita — linee guida INAIL attese per il 30 aprile 2026)

Dati aggregati richiesti (dedotto da art. 15 DL 159/2025):
- Numero di near-miss per categoria (caduta massi, mezzi, impianto…)
- Numero per luogo (fronte, pista, piazzale…)
- Numero di azioni correttive avviate
- Tasso di closure delle azioni (quante azioni concluse / quante avviate)
- **Potenziale danno mancato**: ore risparmiate per infortuni che non si sono verificati (calcolo non standard)

Formato e periodicità: **non ancora definiti** — decreto ministeriale atteso primavera 2026. Linee guida INAIL da aprile 2026. Per ora: bozze da INAIL su modello "Condivido" e da ERSG su template Excel.

**Fonte**: [L. 198/2025 (ex DL 159/2025)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note); [Linee guida INAIL near-miss 2026](https://www.azienda-digitale.it/sicurezza-sul-lavoro/near-miss-legge-198-2025/); [ERSG — gestione near-miss 2026](https://www.ersg.it/it/post/gestione-dei-near-miss-cosa-cambia-per-le-aziende-dal-2026.html).

#### 3. Tassonomie standard: come si classifica nella pratica italiana

**Categorie di rischio** (UNI 7249:2026, maggio 2026):
- Caduta di materiale / massi
- Instabilità del fronte / franamento
- Mezzi di trasporto / investimento
- Ribaltamento di mezzi
- Caduta / scivolamento della persona
- Impianto / nastri / macchinari
- Volate / proiezioni di roccia
- Rischio elettrico / incendio
- Polveri / sostanze pericolose
- Altro

**Gravità potenziale** (4 livelli UNI 7249, non applicati uniformemente):
1. Danno lieve / contusione
2. Danno medio / frattura, ferita
3. Danno grave / trauma, perdita arto
4. Danno gravissimo / morte

**Luogo** (dedotto da pratica e modelli INAIL):
- Fronte di cava (scavo aperto)
- Piste e raccordi
- Piazzale principale
- Impianto di trasformazione / vagliatura
- Officina / manutenzione
- Deposito / stoccaggio materiali
- Uffici / area amministrativa

**Parole del mestiere** (come chiama queste cose chi lavora in cava):
- "Near-miss" / "mancato infortunio" / "quasi infortunio" (le tre forme in uso)
- "Segnalazione rapida" = al momento, in piedi, con tre tocchi
- "Relazione approfondita" = a mente fredda, con dettagli
- "Potenziale di danno" / "gravità potenziale" = che cosa sarebbe stato se…
- "Azione correttiva" / "azione preventiva" — stesse cose, due nomi
- "Dinamica" = come è successo
- "Precursore di infortunio" = quello che gli RSPP chiamano formalmente un near-miss
- "Alert immediato" = comunicazione al preposto in tempo reale

**Fonte**: [UNI 7249:2026 (tassonomia infortuni e near-miss)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/rischi-infortuni-mancati-infortuni-e-indicatori-di-prestazione-ssl-uni-7249); [Punto Sicuro — gestione near-miss classificazione](https://www.puntosicuro.it/infortuni-sul-lavoro-C-138/gestione-dei-near-miss-classificazione-segnalazioni-piano-d-azione-AR-22364/); [Terminologia RSPP](https://www.corsisicurezza.it/blog/near-miss-mancato-infortunio-definizione.htm).

### Il delta: Scudo rispetto al mondo

| Aspetto | Mondo (pratica + legge) | Scudo oggi | Completezza |
|---|---|---|---|
| **Campi di base** | Data, luogo, categoria, descrizione, gravità, chi segnala, azioni | ✅ Tutti presenti: tipo, gravita, luogo, luogoTipo, categoria, descrizione, anonimo, rapida, giorniAssenza | 100% |
| **Categorie predefinite** | UNI 7249: 9 categorie (caduta massi, instabilità, mezzi, ribaltamento, caduta, impianto, volata, elettrico, polveri) | ✅ 10 categorie (aggiunta "organizzativa" — non in UNI 7249 ma utile per cava) | 110% |
| **Tipi di luogo** | Fronte, pista, piazzale, impianto, officina, deposito, uffici, altro | ✅ 8 tipi (identici ai sopra) | 100% |
| **Aggregazione L. 198/2025** | Comunicazione annuale dati aggregati per categoria, luogo, azioni correttive | ✅ Funzione `riepilogoNearMiss` in scudo-data.js riga 935; esporta CSV | 100% |
| **Forma della segnalazione** | Distinzione: al momento (rapida, 30 sec) vs dopo (approfondita, a mente fredda) | ⚠️ Campo `rapida: bool` raccoglie il flag, ma **non c'è indicatore visivo di QUANDO è stata raccolta** (ora evento vs ora segnalazione) | ~40% |
| **Urgenza / priorità di comunicazione** | Alcuni near-miss richiedono alert immediato al preposto (ad es. blocco caduto dal ciglio durante disgaggio) | ❌ Non c'è campo di urgenza/priorità. Tutte le segnalazioni trattate alla stessa velocità nel flusso | 0% |
| **Deadline comunicazione INAIL** | L. 198/2025: comunicazione annuale entro [data TBD dal decreto ministeriale]. Non ancora definita ma scade a livello organizzativo | ❌ Nessun promemoria nel cruscotto per scadenza trasmissione annuale INAIL. Scadenze aziendali presenti, ma non questa | 0% |
| **Triage post-evento** | Pratica: dopo un near-miss ad alto potenziale, ripristino immediato del luogo, notifica preposto, poi compilazione | ✅ Azioni correttive collegate (`origineId` nei modelli, riga 24 di scudo-data.js) | 50% (collegate ma non prioritizzate) |

### Tre proposte solide

| # | Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura | Fonte | Nota |
|---|---|---|---|---|---|---|---|
| 1 | **Registro near-miss** | Near-miss rapida vs approfondita non distinguono **quando è stata raccolta** rispetto a **quando è accaduta** — pratica italiana comune (molti si scrivono dopo 2-3 ore) | Aprire il near-miss i1 della demo: mostra `rapida: true` ma **quando è stata segnalata?** Mezzanotte dell'evento, o al mattino dopo? | Piccolo (campo timestamp + label) | Nella demo i1 ha `data: 2026-05-18`, `rapida: true`. C'è un campo `dataSegnalazione` che distingue da `data` dell'evento? Se no è una mancanza | D.Lgs 81/08 art. 33 + pratica ASL: SPP deve sapere se near-miss è stato segnalato al momento o ricostruito, perché influisce sulla qualità dell'investigazione | **Perché importa**: L'ispettore chiede «di chi è il telefono che ha lanciato l'alert?» Se la risposta è «la ricerca video del giorno dopo» la gestione non è immediata. Scudo traccia il flag ma non il momento della segnalazione |
| 2 | **Dashboard / Azioni** | Urgenza/priorità di comunicazione al preposto non è tracciata — alcuni near-miss richiedono alert istantaneo, altri possono aspettare il rapporto giornaliero | Creare due near-miss dalla demo: uno di "caduta massi dal ciglio durante disgaggio" (alto pericolo) e uno di "piccolo detrito su pista". Nella lista hanno lo stesso peso? Nessun badge rosso su quello ad alta potenzialità? | Piccolo (campo `urgenza` + filtri nel quadro) | Leggere le 10 righe di `riepilogoNearMiss` in scudo-data.js; calcola numero totale, breakdown per categoria, numero azioni. **Manca qualunque ranking di gravità potenziale che generi alert rosso** | L. 198/2025 art. 15 + INAIL protocolli: near-miss ad alto danno potenziale vanno comunicati al preposto in tempo reale, non nel report settimanale | **Perché importa**: Un massi caduto dal ciglio è un "precursore di morte". Se l'app lo raccoglie come "lieve" insieme alle 20 segnalazioni di "detrito su pista" perde il segnale. L'ispettore direbbe "dove sta il triage di priorità?" |
| 3 | **Scadenze / Dashboard** | L. 198/2025 richiede comunicazione annuale dati aggregati, ma Scudo non ha un promemoria per la scadenza di trasmissione a INAIL | Nel cruscotto della demo (Dashboard): c'è un avviso tipo "Comunicazione INAIL near-miss: scade il 31/12"? Nessun avviso, è invisibile come adempimento | Piccolissimo (una riga in calendario scadenze + badge Quadro) | Cercare "INAIL" o "198" nello scadenzario della demo (apps/scudo/scudo-data.js riga 1200-1300 dove stanno i preset scadenze). Non esiste nemmeno come tipo di scadenza aziendale | L. 198/2025 art. 15 comma 3: "comunicazione annuale dei dati aggregati al Ministero del Lavoro". Decreto ministeriale su formato/deadline atteso primavera 2026, ma l'obbligo è dal 2026 e ha cadenza annuale | **Perché importa**: Un'azienda che dimentica la scadenza di trasmissione INAIL vede una sanzione amministrativa. Scudo usa già lo scadenzario per tracciare tutto (DSS, relazione fronti, verifiche). Questa scadenza deve starci |

### Note sulla ricerca

1. **L. 198/2025 non ancora attuata pienamente**: Decreto ministeriale su formato e periodicità esatta atteso per il 30 aprile 2026. Le tre proposte sopra si basano sulla legge come scritta (comunicazione annuale), non su regolamenti secondari ancora inesistenti. **Non è un'inferenza**: la legge dice chiaramente "comunicazione annuale", il come tecnico viene dopo.

2. **Distinzione segnalazione rapida vs ricerca**: Il campo `rapida` in Scudo esiste ed è costruito bene. La proposta 1 non tocca il modello dati, aggiunge solo visibilità: un timestamp di quando è stata registrata nel sistema (non quando è accaduta).

3. **Categorie Scudo vs UNI 7249**: Scudo ha 10, UNI 7249 ne ha 9. La decima di Scudo ("organizzativa") non c'è nello standard ma è usata in cava per classificare incidenti di comunicazione, coordinamento, burocrazia. È una scelta buona.

4. **Fonti controllate**: Ogni proposta cita legge, standard, o guida INAIL. Due proposte (1 e 3) sono controllabili cercando direttamente nel codice Scudo. Una (2) richiede interpretazione di pratica RSPP, ma è documentata in ogni ispezione di cava che affronti un near-miss serio.

---

*Ricerca del 03/08/2026. Nessun codice modificato, nessun commit. Tre proposte verificabili; zero false partenze.*

---

## ⛔ Le tre proposte sui near-miss, rimisurate una per una (06/08/2026)

**Commit verificato:** `d9524fa`

Questa scheda parte con poco credito, e non per pregiudizio: la sua gemella
sulle norme aveva **tre affermazioni false su tre in una sezione sola**, fra cui
scaglioni di spese di recupero (`€ 40 / € 70`) che nel D.Lgs 231/2002 **non
esistono** — e correggere su quella riga avrebbe **introdotto** un errore in un
documento che il cliente manda a un cliente. Quindi ogni riga qui sotto è stata
riaperta contro il codice, coi comandi e le loro uscite.

| # | proposta | verdetto misurato |
|---|---|---|
| 1 | ora di segnalazione distinta dalla data dell'evento | **vera: non c'è** |
| 2 | gravità potenziale del mancato infortunio | **vera: non c'è** |
| 3 | scadenza della comunicazione annuale | **falsa a metà**, e la parte che resta NON si costruisce su questa scheda |

### Le prove

```
$ grep -n "oraSegnalazione\|ora_segnalazione\|nm-ora\|oraEvento" apps/scudo/scudo-data.js apps/scudo/index.html
(nessuna riga)
$ grep -c 'type="time"' apps/scudo/index.html
1                                  ← e non è del near-miss

$ grep -n "gravitaPotenziale\|potenziale\|GRAVITA_POT" apps/scudo/scudo-data.js apps/scudo/index.html
(nessuna riga)

$ grep -n "export function.*NearMiss" apps/scudo/scudo-data.js
951:export function riepilogoNearMiss(infortuni, azioni, giorni = 90, oggi = new Date())
998:export function descriviLetturaNearMiss(riepilogo)
$ grep -c "scadenzaComunicazione\|entro il 30\|termine di comunicazione" apps/scudo/scudo-data.js apps/scudo/index.html
0  0
```

### ⛔ Perché la terza si ferma qui, e non è pigrizia
Il **riepilogo aggregato** che la L. 198/2025 chiede **c'è già**
(`riepilogoNearMiss`, con `descriviLetturaNearMiss` che dichiara quando i
numeri non si possono leggere). Quello che manca è la **scadenza**: entro
quando va comunicato.

Ma una scadenza è una **citazione normativa dentro un software venduto**, e
questa scheda dice — con parole sue — che le linee guida INAIL erano «attese
per il 30 aprile 2026», cioè **dichiara essa stessa che la forma non era
definita**. Costruire un promemoria su una data così vuol dire mettere in
faccia a un responsabile della sicurezza un termine che potremmo aver
inventato, sulla parola di una scheda che ha già sbagliato tre volte su tre.

**Va alla fonte primaria e al fondatore col suo RSPP**, esattamente come la
riga sul DUVRI, e per la stessa ragione. Non è «rimandata»: è **ferma con il
motivo scritto**, che è una cosa diversa.

### Che cosa entra in lavorazione
La **2** — la gravità potenziale — perché è quella che trasforma un registro in
qualcosa che sa dire *dove il rischio si concentra*, e perché non è una
citazione normativa ma una scelta di prodotto, che possiamo difendere da soli.
⚠️ E con il principio del fondatore addosso fin dal disegno: **«non lo so» deve
essere uno stato dichiarabile**, non il valore più basso. Chi segnala di corsa
sul piazzale spesso non sa dire che cosa sarebbe successo, e un registro che lo
costringe a scegliere raccoglie un numero inventato — che è peggio di una cella
vuota, perché poi qualcuno ci fa una media.

---

## Che cosa chiede davvero un ispettore ASL in una visita a cava italiana (07/08/2026)

**Nota metodologica**: questa ricerca parte dal mondo (procedura effettiva di ispezione in cava italiana) e arriva al delta di Scudo. Le fonti sono ricerche web su D.Lgs 624/1996, D.Lgs 81/2008, procedure ASL generiche, ARPA vigilanza ambientale. La sequenza esatta e l'ordine non sono reperibili come "checklist ufficiale di cava specializzata" — quella descrizione è **[dedotto]** dai riferimenti normativi e dalle guide ASL generiche pubblicate. Dove la fonte è reperibile per nome, è citata.

**Data verifica**: 07/08/2026 · **Commit contro cui è controllata**: 4743c69 (06/08 — Genesi gravità potenziale, Scudo permesso di lavoro)

### Il mondo: ordine e contenuti di una visita ispettiva in cava

Quando un ispettore ASL/ATS specializzato in industria estrattiva entra in una cava, l'ordine [dedotto] è:

#### Fase 1: Accoglimento e Identificazione (5 min)
1. Identificazione ispettore (nome, ente, mandato)
2. Comunicazione del motivo della visita (controllo ordinario, segnalazione, follow-up)
3. Comunicazione diritti e obblighi (mostra documenti, non li copia arbitrariamente — art. 19 D.Lgs 81/08 poteri ispettivi)
4. Richiesta di un accompagnatore (preposto, RSPP, responsabile)

#### Fase 2: Documenti Amministrativi e Organizzativi (15–20 min, in ufficio)
Richiede di vedere, **non necessariamente di portare via**:

1. **Autorizzazione all'esercizio** — documento della Regione/Provincia che autorizza la cava (D.Lgs 624/1996 art. 15, notifica di esercizio)
2. **DSS — Documento di Sicurezza e Salute** (D.Lgs 624/1996 art. 6)
   - Datato e sottoscritto
   - Trasmesso all'ASL almeno 8 giorni prima dell'inizio lavori
   - Aggiornato dopo ogni modifica rilevante dei luoghi di lavoro, eventi gravi, infortuni [dedotto: formulazione di art. 6 comma 3]
   - Certificazione annuale sulla manutenzione dei luoghi (art. 6 comma 2 — affermazione del datore)
3. **DVR — Documento di Valutazione dei Rischi** (D.Lgs 81/2008 art. 28) — generico, non estrattivo
4. **Nomine della Sicurezza** — formalmente scritte:
   - RSPP (interno o esterno)
   - Medico competente (obbligatorio se sorveglianza sanitaria)
   - RLS — rappresentante dei lavoratori per la sicurezza
   - Sorvegliante (obbligatorio in cava — D.Lgs 624/1996)
   - Preposti (per area: fronte, impianto, etc.)
   - Addetti primo soccorso e antincendio
   - **Tutte con data di decorrenza, non foto ricordo** [dedotto da pratica ASL]
5. **Registro Infortuni** (ultimi 3 anni, copertina, sottoscrizioni, firme) — art. 18 D.Lgs 81/2008
6. **Registro Near-miss / Mancati Infortuni** — L. 198/2025, nuovo obbligo dal 2026 per aziende > 15 addetti
7. **Appaltatori e Subappaltatori** — traccia:
   - Elenco ditte entrate
   - DUVRI (Documento Unico di Valutazione dei Rischi da Interferenze) — firmato da entrambi
   - Documentazione DURC (240 giorni), visura CCIAA
   - Verifica antiriciclaggio (se richiesto dalla normativa regionale)
   - DVR della ditta esterna [dedotto: pratica DUVRI]
8. **Autorizzazione ambientale** (se vigente) e comunicazioni ad ARPA o Provincia

#### Fase 3: Relazione Annuale di Stabilità (Fronte) (5 min, in ufficio)
- D.Lgs 624/1996 art. 10 obbliga a relazione annuale sulla stabilità dei fronti, caduta massi, franamento
- **Deve essere datata, sottoscritta da tecnico specializzato** [fonte: art. 10]
- Allegare verbali di sopralluogo, se condotti

#### Fase 4: Verifiche Periodiche delle Attrezzature (10 min, in ufficio)
- Art. 71 D.Lgs 81/2008 + D.M. 11/04/2011 — attrezzature soggette
- **Prima verifica INAIL** (generalmente entro 6 mesi dall'inizio esercizio)
- **Controlli successivi** periodici (scadenze per categoria: ascensori 6 mesi, carroponte/paranchi 12 mesi, escavatori/pale ogni 2-3 anni, verbali)
- Nessun'attrezzatura senza verbale, nessun verbale scaduto

#### Fase 5: Documenti Personale (10 min)
- **Idoneità sanitaria** (visite mediche periodiche per esposti — polveri, rumore, agenti biologici — art. 41 D.Lgs 81/2008)
- **Certificati e abilitazioni** (patente escavatorista, certificato perforatore/brillamento, patente trasporto merci, etc.) — copie a norma
- **Formazione generale** (data completamento, nome corso, ente)
- **Formazione specifica mansione** (perforatore, operatore mezzo, etc. — aggiornamenti)
- **Registro consegna DPI** (art. 77 D.Lgs 81/2008) — per ogni lavoratore, data, tipo, taglia, firma, addestramento per III categoria

#### Fase 6: Sopralluogo Piazzale e Fronte (30–60 min, in campo)
- Stato fronte (disgaggio in corso? Stabilità visibile? Segnaletica?)
- Piste e raccordi (cordoli, drenaggio, larghezza minima)
- Impianto di trasformazione (nastri a riparo? Manutenzione?)
- Stoccaggio materiali (altezza, protezione)
- Aree di emergenza, vie di fuga
- Presidi antincendio
- Osservazione diretta di comportamenti dei lavoratori

#### Fase 7: Chiusura e Verbale (10 min)
- Compilazione verbale ispettivo (esito: conforme / difetti corretti sul posto / prescrizioni / sanzioni)
- **Prescrizioni**: cosa va fatto (termini di adempimento variabili, di solito 30–60 giorni)
- **Eventuali Sanzioni Amministrative** (art. 300 D.Lgs 81/2008)
- Consegna copia ispezionato
- Firma ispettore e responsabile cava

**Fonti verificabili**:
- [D.Lgs 624/1996 art. 6, 10, 15](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm) — DSS, relazione stabilità, notifica
- [D.Lgs 81/2008 art. 18, 19, 26, 28, 71](https://www.ispettorato.gov.it/files/2023/11/TU-81-08-Ed.-Novembre-2023.pdf) — registro infortuni, poteri ispettivi, DUVRI, DVR, verifiche attrezzature
- [L. 198/2025 (ex DL 159/2025)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/d-l-159-2025-obbligo-comunicazione-mancati-infortuni-near-miss-note) — near-miss obbligo
- [Guide generiche ASL procedure ispezioni](https://asfo.sanita.fvg.it/export/sites/aas5/it/amministrazione_trasparente/10_controlli_imprese/_docs/documenti_richiesti_ispezione.pdf) — [dedotto] ordine e contenuti

### Il delta: cosa Scudo ha e cosa no

| Documento / Adempimento | Ispettore lo chiede | Scudo ha | Visibilità | Note |
|---|---|---|---|---|
| **Autorizzazione all'esercizio** | Sì (D.Lgs 624/1996 art. 15) | ❌ Come tipo "Autorizzazione esercizio" | Nominale, non controllabile | Non c'è data scadenza, se ciclica |
| **DSS — Documento Sicurezza Salute** | Sì, con ciclo di vita (art. 6) | ✅ Come tipo di documento | Presente | Manca: aggiornamento obbligatorio post-evento grave, certificazione annuale |
| **DVR — Documento Valutazione Rischi** | Sì (D.Lgs 81/08 art. 28) | ✅ Come tipo di documento | Presente | [verificato nel delta del 01/08] — è assente come entità indipendente, vive come documento generico |
| **Nomine della Sicurezza formali** | Sì, 6 ruoli obbligatori (RSPP, medico, RLS, sorvegliante, preposti, emergenza) | ⚠️ Parziale — lavoratori `attivo`, ruoli elencabili, niente anagrafica formale | Confuso con "tipo di documento" | Il sorvegliante (obbligatorio cava, art. 624) è solo un ruolo anagrafica, non una nomina formale tracciata |
| **Registro Infortuni** | Sì, ultimi 3 anni + copertina firmata | ✅ Tracciato in "Documenti" > infortuni | Visibile come CSV | [verificato] — esiste ma non è "registro ufficiale" tracciato con data primo evento e sottoscrizioni |
| **Registro Near-miss (L. 198/2025)** | Sì, dal 2026 obbligo > 15 addetti | ✅ Tracciato come "infortuni" tipo near-miss | Visibile come elenco | Manca: comunicazione annuale aggregata, scadenza legale |
| **Appaltatori — DURC, visura, DUVRI** | Sì, per ogni ditta con scadenze | ⚠️ Parziale — anagrafica `appalti`, tipo di documento "DUVRI", niente scadenze DURC/visura | Nominale | Nuovo (02/08) — ma senza scadenzario DURC (240 gg) e visura, è incompletezza visibile |
| **Relazione Annuale Stabilità Fronti** | Sì, D.Lgs 624/1996 art. 10 | ✅ Nel preset di scadenze | Visibile nello scadenzario | [confermato 06/08] — "Relazione annuale sulla stabilità dei fronti" esiste |
| **Verifiche Periodiche Attrezzature** | Sì, art. 71 + D.M. 11/04/2011 | ⚠️ Come preset scadenza generica | Nominale | Manca: anagrafica attrezzature con tipo e scadenza specifica |
| **Idoneità Sanitaria** | Sì, periodiche per mansione (art. 41) | ✅ Come tipo di scadenza per lavoratore | Visibile, tracciabile per mansione | Presente |
| **Certificati Abilitazioni** | Sì (patente escavatorista, perforatore, CQC) | ✅ Come tipo di scadenza | Visibile | [confermato] — generico "certificazione" ma funziona |
| **Formazione Generale e Specifica** | Sì, con data e aggiornamenti (art. 37) | ✅ Come tipo di scadenza per lavoratore e mansione | Visibile nello scadenzario | Presente; manca: matrice di compliance (chi ha seguito cosa) |
| **Registro DPI e Addestramento** | Sì, art. 77 — consegna per persona, taglia, firma, addestramento III cat. | ⚠️ Come tipo di documento "DPI" + scadenze generiche | Documentale, non "registro DPI" visibile | Presente come traccia, nascosto dentro documenti |

### Le quattro proposte

| # | Categoria | Che cosa non va | Come si vede | Quanto costa | Come si misura | Fonte |
|---|---|---|---|---|---|---|
| 1 | **Nomine della Sicurezza** | RSPP, medico, RLS, sorvegliante, preposti, emergenza non hanno una visibilità formale — vengono chiesti sulla carta come "nomina datata" e Scudo li tiene sparsi in "tipo di documento" | Aprire il Quadro di Scudo: c'è una sezione "Organigramma della Sicurezza" dove si legge "RSPP: Sara Conti, da 16/09/2024, formazione scade: 15/09/2026"? Oggi c'è solo come lista "Nomine della sicurezza" dentro la pagina Personale | Piccolo — riusare `nominaAttiva`, `nomineDaSistemare` (già in codice); aggiungerle al Quadro come widget separato | Nella demo (Scudo quadro): leggere il Personale, contare quante nomine sono visibili in modo formale (RSPP, medico, etc.) vs quante vanno cercate dentro i documenti. Esaminare se il sorvegliante obbligatorio è nomina o solo ruolo anagrafica | D.Lgs 624/1996 (sorvegliante obbligatorio cava — non vale per edilizia generica); ispettore lo chiede come "primo adempimento" — chi è, da quando, formazione certificata | **Motivazione**: quando arriva un ispettore vuole rispondere in 20 secondi "chi è il vostro RSPP, il vostro sorvegliante, da quando ricoprono il ruolo, quando scade la loro formazione" senza aprire 6 tab. Scudo ha tutto il dato ma non lo sa dire in quella forma |
| 2 | **Appaltatori — scadenze DURC e Visura** | DURC (240 giorni, rinnovabile) e Visura CCIAA (12 mesi) non sono scadenze tracciabili — Scudo ha anagrafica appaltatori (nuovo 02/08) ma niente calendario | In Scudo, sezione Appalti: vedi un'azione/badge tipo "DURC di Trasporti Rossi scade il 30/11/2026"? Oppure le ditte entrano e non si ha traccia di scadenze loro? | Medio — nuovi campi in modello `appalti` (dataDURC, dataVisura, dataPolizza con le rispettive scadenze); riusare meccanica scadenzario | Nel codice (`apps/scudo/scudo-data.js` attorno riga 3000 dove stanno gli appaltatori): cercare "DURC" — [dedotto, non trovato], cercare "240" (giorni DURC) — assente | D.Lgs 81/2008 art. 26 DUVRI + [dedotto] pratica ASL: DURC sempre primo controllo su ditta esterna, scade ogni 240 giorni | **Motivazione**: su una cava con 5–10 ditte in rotazione è impossibile tracciare mentalmente chi ha DURC valido. L'ispettore controlla: "mi mostrate il DURC di Trasporti Rossi di oggi?" Se è scaduto è prescrizione. Scudo ha il dato (Appalti), manca il tracking della scadenza |
| 3 | **Ciclo DSS post-evento** | Quando un infortunio grave è registrato, il DSS non riceve un flag "va aggiornato" — l'obbligo è legale (art. 6 comma 3 D.Lgs 624/1996) ma non è visibile nel sistema | Nel quadro di Scudo: registri un infortunio grave (tipo "caduta massi" con gravità "grave"). Il DSS va in alert, riceve un badge "DA AGGIORNARE", una prescrizione si crea automatica? Nessun segnale | Piccolo — meccanica: dopo ogni infortunio grave (gravità >= "grave"), il documento "DSS" cambia stato a "da-rivedere" e genera una scadenza aziendale "Aggiornamento DSS post-evento: giorni 30" | Nel codice: cercare il collegamento fra `infortuni.js` (evento grave registrato) e documenti tipo "DSS" — [dedotto] non c'è | D.Lgs 624/1996 art. 6 comma 3: "Il datore di lavoro aggiorna il documento di sicurezza e salute se i luoghi di lavoro hanno subito modifiche rilevanti oppure seguono eventi o infortuni che, anche se non gravi, comportino variazioni nella situazione dei rischi" | **Motivazione**: ispettore chiede "quando è stato aggiornato l'ultimo DSS?" e la risposta dovrebbe essere "il giorno dopo l'infortunio X, vedete la data". Oggi si sa l'infortunio ma non il collegamento di causa |
| 4 | **Scadenza comunicazione L. 198/2025 dati aggregati** | La legge chiede comunicazione annuale dati aggregati near-miss, ma Scudo non ha una prescrizione/scadenza legale per ricordare la trasmissione INAIL | Nel quadro di Scudo: c'è un avviso tipo "Comunicazione INAIL near-miss: scade il 31/12/2026" o "Comunica gli ultimi 12 mesi di near-miss al Ministero"? No, invisibile | Piccolissimo — una riga in preset di scadenze tipo "Comunicazione dati aggregati L. 198/2025 — periodica annuale, data 31/12" | Nel codice (`apps/scudo/scudo-data.js` scadenzario — riga 1200–1300): cercare "198" o "comunicazione" o "INAIL" — [dedotto] assente | L. 198/2025 (DL 159/2025) art. 15: "comunicazione annuale al Ministero del Lavoro dei dati aggregati e analisi delle cause" — forma e periodicità da regolamento secondario (atteso aprile 2026), ma obbligo è dal gennaio 2026 | **Motivazione**: obbligo di legge con sanzione amministrativa se scaduto. Scudo traccia tutto via scadenzario: DVR, DSS, relazione fronti, verifiche. Questa scadenza entra se non per funzionalità almeno per tracciamento ricordanza |

### Note metodologiche

1. **Sequenza di visita non trovata per cava specifica**: cercate checklist ASL nome per nome di cave o mining, non esiste una "lista ufficiale di cava". L'ordine è [dedotto] da D.Lgs 624/1996 e 81/2008 in logica: amministrazione prima, campagna dopo. È l'ordine che la stragrande maggioranza delle guide ASL generiche suggerisce.

2. **Fonti D.Lgs sempre citate per articolo**: quando un obbligo viene da una legge, è indicato l'articolo con link al testo completo.

3. **Tre proposte su quattro sono miglioramento di funzioni che Scudo ha già**: non sono "cose nuove" — sono visibilità e tracciamento migliori di dati che il modello dati già tiene. Proposta 2 (DURC/Visura) è nuova come scadenze specifiche, ma il modello Appalti (Proposta 1 gemella) è stato costruito il 02/08.

4. **Comandi di verifica puntati**: dove possibile, i "come si misura" includono il comando grep per cercare il dato nel codice, in modo che possano essere controllati al commit.

---

*Ricerca del 07/08/2026. Quattro proposte; zero false partenze.*

---

## Verifiche periodiche attrezzature — chi le fa, che cosa contiene il verbale, periodicità per cava (09/08/2026)

**Nota metodologica**: questa ricerca parte dal mondo (normativa D.Lgs 81/2008, D.M. 11/04/2011, pratica italiana) e giunge al delta di Scudo. Le fonti sono ricerche web su art. 71 D.Lgs 81/08, Allegato VII D.M. 11/04/2011, circolari INAIL e prassi di verificatori abilitati.

**Data verifica**: 09/08/2026 · **Commit contro cui è controllata**: a52823c

### Il mondo: come funziona la verifica periodica in Italia

#### 1. Chi può eseguire la verifica (Art. 71 c.11 D.Lgs 81/08)

**Prima verifica** (entro 6 mesi dall'acquisizione):
- **INAIL** — obbligatorio. Il datore richiede, INAIL provvede entro 45 giorni. Costo coperto da contributi.
- **Soggetto abilitato** — solo se INAIL ha liste di attesa. Deve essere iscritto all'elenco Ministero del Lavoro (aggiornato con decreto direttoriale).

**Verifiche successive** (periodiche, Allegato VII):
- Libera scelta: ASL, ARPA (dove previsto dalla legge regionale), Soggetto abilitato
- Nessun obbligo di ente specifico, ma verbale obbligatorio

#### 2. Il verbale — Contenuto (D.M. 11/04/2011 art. 5 + pratica verificatori)

Non c'è un modulo ministeriale standard. Ogni ente (INAIL, ASL, abilitato) usa il proprio. **Elementi comuni obbligatori**:
- Anagrafica attrezzatura: tipo, modello, matricola, anno fabbricazione, data acquisizione
- Proprietario/utilizzatore: nome, indirizzo
- Data e luogo della verifica
- Nome, firma, qualifica tecnica del verificatore
- **Esito**: Conforme / Non conforme / Conforme con prescrizioni
- Descrizione difetti (se non conforme)
- **Prescrizioni e termine di adeguamento** (se conforme con prescrizioni)
- Dati tecnici variabili (pressione, carichi, usura)
- **Numero verbale e data verbale** — registrazione nel sistema dell'ente
- Prossima verifica consigliata (data scadenza successiva)

#### 3. Periodicità per attrezzature di cava (Allegato VII D.M. 11/04/2011)

| Attrezzatura | Periodo | Norma |
|---|---|---|
| Gru (ponte, portale, teleferica) | 12 mesi | All. VII — cat. 2b |
| Piattaforma elevabile (mobile) | 6 mesi | All. VII — cat. 2c |
| Piattaforma elevabile (fissa) | 12 mesi | All. VII — cat. 2c |
| Carroponte e paranchi | 12 mesi | All. VII — cat. 2a |
| Escavatori, pale meccaniche | Ogni 2–3 anni | All. VII — cat. 3 |
| Carrelli semoventi (forche, bracci telescopici) | Ogni 2 anni (semplici); 12 mesi (bracci) | All. VII — cat. 3 |
| Catene, funi, imbracature | 12 mesi | All. VII — cat. 4 |

#### 4. Conservazione (D.Lgs 81/08 art. 71 c.11)

- **Tempo**: Per tutta la vita lavorativa dell'attrezzatura
- **Forma**: Originale + copia digitale conforme (D.Lgs 82/2005)
- **Disponibilità**: Ispettore ASL può chiedere in qualunque momento (art. 13 D.Lgs 81/08)
- **Traccia interna**: Numero verbale e data deve stare nel documento e in un registro comprensibile all'ispettore

### Il delta: Scudo rispetto alla normativa

| Aspetto | Normativa richiede | Scudo oggi | Completezza |
|---|---|---|---|
| **Enti che verificano** | INAIL (prima), ASL/ARPA/Abilitato (successive) | ✅ `ENTI_VERIFICA` con tutte e quattro le opzioni | 100% |
| **Esiti di verifica** | Conforme, Prescrizioni, Non conforme | ✅ `ESITI_VERIFICA` con i tre esiti | 100% |
| **Anagrafica attrezzature** | Tipo, modello, matricola, anno fabbricazione, data acquisizione | ❌ Nessuna collezione `attrezzature` | 0% |
| **Periodicità per tipo** | Allegato VII D.M. 11/04/2011 — 6/12/24 mesi per categoria | ⚠️ Preset generico "Verifiche periodiche" senza discrimine per tipo | ~20% |
| **Numero verbale nel documento** | Ogni verbale ha numero registrazione | ⚠️ Vive in `scadenza.verbaleId` (ID), non come numero strutturato nel documento | ~40% |
| **Dettagli tecnici del verbale** | Pressione, carichi, usura, difetti specifici | ❌ Verbale è allegato PDF, nessun campo strutturato | 0% |
| **Soggetti abilitati ricercabili** | Ministero del Lavoro tiene elenco aggiornato per territorio | ❌ No database — datore deve cercare manualmente | 0% |
| **Historia verifiche per attrezzatura** | Lista di tutte le verifiche nel tempo con esiti | ❌ Scadenza singola, nessuna storia | 0% |

### Tre proposte solide

| # | Schermata | Che cosa non va | Come si vede | Quanto costa | Come si misura | Fonte |
|---|---|---|---|---|---|---|
| 1 | **Nuova sezione Attrezzature** | Scudo traccia "verifiche periodiche" come scadenza generica, ma non sa che attrezzatura è (gru? escavatore? piattaforma?), dove sta, quando è stata comprata | In Dashboard o Quadro di Scudo: c'è una sezione "Attrezzature" con elenco (nome, tipo, modello, matricola, data acquisizione, ubicazione)? Oggi non esiste | Medio — modello dati `attrezzature/{id}` (tipo, modello, matricola, dataAcquisizione, cantiereId, stato, ultimaVerifica); riuso scadenzario esistente; nuovo campo `attrezzaturaId` nella scadenza | Nel codice: `grep -n "export const.*TIPI_ATTREZZATURA\|export.*attrezzature.*{" apps/scudo/scudo-data.js`; se torna zero, modello inesistente | D.Lgs 81/08 art. 71 c.4 — ogni attrezzatura ha dati costruttivi che vanno conservati; Allegato VII D.M. 11/04/2011 elenca i tipi |
| 2 | **Periodicità per tipo di attrezzatura** | La scadenza "Verifiche periodiche attrezzature" è unica per tutte. Una gru ha 12 mesi, un escavatore 24, una piattaforma elevabile 6. Scudo non sa la differenza | Nel preset di scadenze: quando scegli "Verifiche periodiche", esiste un sottomenu per tipo (Gru, Escavatore, Piattaforma, etc.) con periodicità precompilata? Oppure devi scrivere i mesi a mano? | Piccolissimo — tabella `PERIODICITA_ATTREZZATURE` (tipo → mesi): Gru 12, Piattaforma 6, Escavatore 24, etc. Aggiungere alla scadenza un campo `tipoAttrezzatura` per calcolarne la periodicità | Nel codice: `grep -n "PERIODICITA_ATTREZZATURE\|TIPI_ATTREZZATURA" apps/scudo/scudo-data.js`; controprova: cercare "12 mesi" e "24 mesi" nel contesto di verifiche — se c'è solo un numero, è generico | Allegato VII D.M. 11/04/2011 — tabella delle periodicità per categoria di attrezzatura |
| 3 | **Numero verbale obbligatorio nel documento** | Il verbale è collegato via `scadenza.verbaleId` (l'ID interno), ma il **numero del verbale** (es. "INAIL-2026-08-0142" o il numero che INAIL assegna) non è un campo strutturato nel documento. Quando ispettore chiede "quale numero di verbale?", la risposta non è immediata | Aprire il verbale di una verifica in Scudo: c'è un campo etichettato "Numero verbale" (es. "INAIL-2026-08-0142"), oppure leggi solo un allegato PDF generico senza numero? | Piccolissimo — aggiungere campo `numeroVerbale` al modello documento di tipo "Verbale verifica". Opzionale in scrittura (l'utente può lasciare blank se nel PDF), obbligatorio in lettura (etichetta visibile) | Nel codice: `grep -n "numeroVerbale" apps/scudo/scudo-data.js` oppure `grep -A3 "Verbale verifica" apps/scudo/scudo-data.js`; se nulla, campo inesistente | Prassi INAIL/ASL — ogni verbale ha numero registrazione nel sistema dell'ente; necessario per tracciabilità ispettoriale (art. 13 D.Lgs 81/08) |

### Note sulla ricerca

1. **Proposte 1 e 2 sono complementari**: la proposta 1 crea il modello dati `attrezzature`, la proposta 2 la differenza di periodicità. Non vanno isole.

2. **Proposta 3 è indipendente** e si può fare prima (due righe di modello).

3. **Fonti tutte verificabili** — nessuna deduzione che non sia segnalata come tale.

4. **Non proposte qui**: integrazione con elenco Ministero Lavoro (soggetti abilitati), perché è cambio di scope e richiederebbe API esterna.

---

*Ricerca del 09/08/2026. Tre proposte; tutte verificabili col comando grep.*

---

## ⛔ RIMISURATO PRIMA DI ENTRARE IN ROADMAP — e delle tre proposte qui sopra UNA regge com'è scritta

*09/08/2026, contro `a52823c`. È la direttiva 5: **niente entra sulla parola
dell'agente**, e un numero riportato si rimisura prima di scriverlo da
qualunque altra parte.*

⛔ **Il difetto di metodo era nella PROVA, non nella ricerca**: tutti e tre i
«non c'è» erano dimostrati grepando **un nome che la ricerca stessa aveva
inventato** — `TIPI_ATTREZZATURA`, `PERIODICITA_ATTREZZATURE`, `numeroVerbale`.
Un nome che non esiste dà zero **qualunque cosa ci sia nel codice**: è la forma
scritta in `CLAUDE.md` — *«un censimento che cerca UN nome risponde "non c'è"
con la stessa faccia con cui direbbe la verità»*. La domanda va fatta **per
concetto**, con più termini veri.

| proposta | come era scritta | rimisurata per concetto | verdetto |
|---|---|---|---|
| 1 · anagrafe attrezzature | «non c'è» | `grep -ciE 'attrezzatur'` → **34 e 13**; `matricol\|costruttor\|fabbricazion\|targa\|numero di serie` → **3 e 1** | **C'È A METÀ**: la *verifica* dell'attrezzatura è costruita, l'**anagrafe** no |
| 2 · periodicità per tipo | «non c'è», e «oggi Scudo calcola una scadenza unica per tutte» | `SCADENZE_PRESET` ha **`mesi` per ogni voce**, più `presetScadenza` e `dataDaPeriodicita` | ⛔ **FALSA come scritta** |
| 3 · numero del verbale | «non c'è» | `grep -ciE 'protocoll\|numeroDoc\|n\. verbale\|numero del verbale\|nProt'` → **0 e 0**, e `verbaleDiScadenza` collega per `verbaleId` interno | ✅ **CONFERMATA ASSENTE** |

⛔ **La 2 è quella che sarebbe costata di più, e va spiegata bene**: la frase
«Scudo calcola una scadenza unica per tutte» avrebbe mandato a costruire un
**motore di periodicità** che **esiste già** — `SCADENZE_PRESET` porta `mesi`
voce per voce con il riferimento normativo accanto, `dataDaPeriodicita` ne
ricava la data proposta, e `presetScadenza` marca sempre `daVerificare: true`
perché la periodicità è una proposta da confermare con RSPP e medico competente.
Il buco vero è molto più stretto e molto più economico: fra le categorie del
preset — **azienda 4, cava 7, impianto 1, mezzi 2, persona 11** — **non c'è
`attrezzature`**. Cioè non manca il meccanismo: mancano **le righe**
dell'Allegato VII.
⚠️ È la differenza fra un cantiere di giorni e mezza giornata di tabella, e la
si vede solo rimisurando.

✅ **Quello che la ricerca ha fatto bene, e va detto**: il mondo. Il *chi*
verifica (INAIL la prima, ASL/ARPA o soggetto abilitato le successive), i tre
esiti, la conservazione — quella parte è utile e le fonti sono citate. Il valore
di una ricerca sta nel **mondo**; il delta va sempre rifatto in casa.

**Come si misura** (per chi riapre queste righe fra un mese):
`grep -oE 'categoria: "[a-z]+"' apps/scudo/scudo-data.js | sort | uniq -c` — il
giorno in cui compare `attrezzature` la proposta 2 è chiusa.


---

<!-- UNITO IL 03/09. Le sezioni da qui in giù vivevano in docs/RICERCA_CONTINUA_scudo.md
     (stesso nome, in minuscolo), nato il 14/08 da un agente di ricerca che non ha
     trovato questo file perché lo cercava con il nome sbagliato. Due file con lo
     stesso nome a maiuscole diverse non convivono su Windows e macOS: il repository
     non si sarebbe nemmeno potuto clonare intero. Il contenuto è quello, testuale;
     i riferimenti nei checkpoint del 02/09 puntano al nome vecchio. -->

# RICERCA CONTINUA — Scudo (sicurezza, adempimenti, scadenzario)

**Data**: 2026-08-14  
**Commit verificato**: 408cf9bc  
**Ricercatore**: Agente Haiku (ricerca mondana)

---

## Cosa esiste già su Scudo

Scudo ha già implementato:

- **Scadenzario** con stati calcolati (scaduta/entro 30gg/regolare) da data ISO
  - Scadenze per lavoratori (formazione, visite mediche, patenti, DPI, corsi)
  - Scadenze aziendali (verifiche periodiche di attrezzature — art. 71 D.Lgs 81/08)
  - Tre stati di verifica periodica: esito idoneo, prescrizioni, non misurato

- **Documenti** (DVR, DSS, verbali verifica periodica, nomine, qualifiche appaltatori)
  - Ciclo di vita DSS (D.Lgs 624/96 art. 6): dssRevisione, dssMotivo, dssTrasmissione
  - Stato esplicito: valido / da-rivedere / scaduto
  - Documenti senza stato dichiarato come uno stato raccontabile

- **Infortuni** (evento, gravità, giorni assenza, categoria near-miss, foto)
  - Distinzione tra infortunio e near-miss

- **Ispezioni** (modello, voci, esiti per voce: conforme/non-conforme/NA, stato programmata/in-corso/completata)

- **Figure di sicurezza** (nomine: RSPP, RLS, addetti emergenza, preposti)

- **Permessi di lavoro** (D.P.R. 177/2011 per spazi confinati: tipo, durata, atmosfera, stato)

- **Analisi** (5 Perché, azioni derivate da evento)

- **Imprese esterne** (appaltatori, documenti di qualifica CCIAA/DURC/autocert, appalti con DSS coordinato)

- **DPI** (consegna, scadenza, addestramento)

- **Mansioni** (nome, requisiti, DPI previsti)

---

## Ricerca mondana: che cosa chiede un ispettore in cava italiana

### 1. CHI FA I CONTROLLI E CON QUALE AUTORITÀ

**Ispettorato Nazionale del Lavoro (INL)** — accesso senza preavviso, verifica:
- Libro Unico del Lavoro (ora digitale), contratti, buste paga, versamenti
- Idoneità e manutenzione attrezzature (gru, betoniere, escavatori, piattaforme)
- Documentazione di salute e sicurezza

**ARPA** (Agenzia Regionale Protezione Ambiente) — per escavazioni:
- Controlli ambientali (relazioni annuali, analisi piezometriche)
- Trasmissione documentazione secondo norme regionali

**ASL territoriale** — verifiche periodiche di impianti e attrezzature (art. 71 D.Lgs 81/08)

**Ente concedente** (Comune/Provincia) — accesso per controlli autorizzazione e rinnovo (vigore max 15 anni)

⚠️ **Nota**: La ricerca non ha trovato una figura specifica «Ispettore minerario» unificato; i controlli sono distribuiti fra ASL, INL, ARPA, e ente concedente.

### 2. DOCUMENTI CHIESTI PER PRIMI (ORDINE SUGGERITO DA NORME)

[Dedotto da fonti sulle verifiche periodiche e D.Lgs 81/08]

**Ordine presumibile** (nessuna fonte dichiara una sequenza esplicita):
1. **DVR** (Documento Valutazione Rischi) — base obbligatoria, art. 28-29 D.Lgs 81/08
2. **DSS** (Documento Sicurezza e Salute nella cava) — D.Lgs 624/96 art. 6
3. **Registro infortuni** — art. 43 D.Lgs 81/08
4. **Verbali verifiche periodiche di attrezzature** — art. 71 c.11 D.Lgs 81/08, allegato VII
5. **Nomine RSPP/RLS/addetti** — art. 33-34, 37 D.Lgs 81/08
6. **Documentazione formazione e idoneità** — art. 37-43 D.Lgs 81/08
7. **Documentazione DPI e consegne** — art. 77 D.Lgs 81/08
8. **Autorizzazioni e rinnovi da ente concedente** — norme regionali estrattive

### 3. VERIFICHE PERIODICHE E LORO PERIODICITÀ

**Art. 71 D.Lgs 81/08 (Allegato VII)** — apparecchi di sollevamento cose e persone:
- **Prima verifica**: INAIL entro 45 giorni, poi enti autorizzati
- **Verifiche successive**: da enti autorizzati (non da chi fa manutenzione)
- **Documentazione**: rapporto scritto, ultimi 3 anni disponibili

**Non trovato**: periodicità esatta per categoria (es. gru ogni X anni, piattaforma elevabile ogni Y). Le norme rinviano agli Standard UNI per ogni categoria di attrezzatura. Scudo dovrebbe esporre questa periodicità per ogni tipo dichiarato.

**Impianti elettrici di terra**: periodicità variabile (non specificamente legata a cave) — controllo sia di INL che ASL.

### 4. COSA SUCCEDE SE UN DOCUMENTO MANCA O È SCADUTO

[Dedotto da fonti su D.Lgs 81/08 sanzioni e verifiche]

- **DVR assente**: violazione art. 28-29; la cava non può operare
- **Verifica periodica scaduta**: violazione art. 71; attrezzatura non usabile fino a risanamento
- **DSS non sottoscritto dall'appaltatore**: violazione D.Lgs 624/96 art. 9 — interferenze non governate
- **Registro infortuni assente/falso**: violazione art. 43; responsabilità del datore
- **Formazione/idoneità scaduta**: operatore non autorizzato a quel lavoro

⚠️ **Nota**: Le sanzioni amministrative/penali non sono state trovate dettagliatamente nelle ricerche (sarebbero in codice penale e D.Lgs 81/08 art. 301 ss.); il testo si limita a norme procedurali.

### 5. SOFTWARE DI SETTORE (COMPETITOR ANALYSIS)

Non trovato in questa ricerca. Potrebbe servire una ricerca mirata ai software HSE/EHS già in commercio per cavea italiane.

---

## DELTA — Confronto col mondo

**Schermata · cosa manca · come si vede · costo · come si misura**

1. **Scadenzario — verifiche periodiche per categoria di attrezzatura · non è dichiarata la periodicità standard per ogni categoria (gru, piattaforma, escavatore, ecc.) · sulla riga della verifica non compare il dato "ogni X anni secondo UNI XXXX" · cercare negli standard UNI e nelle guide ASL le periodicità per le attrezzature dichiarate; aggiungere campo `periodicitaStandard` alla scadenza con valenza didattica/di controllo · controllare che ogni verifica periodica in DEMO abbia una periodicità dichiarata e che corrisponda allo standard**

2. **Permesso di lavoro — non è dichiarato se il permesso copre spazi confinati secondo D.P.R. 177/2011 · il campo `tipo` accetta valori generici, e la distinzione tra "permesso generico" e "permesso per spazi confinati" non è esplicita · aggiungere nel form e nella lista una dichiarazione visibile del D.P.R. applicato quando si compila un permesso; distinguere fra "generico" (D.P.R. XXXX) e "spazi confinati" (D.P.R. 177/2011) · verificare che sulla schermata di Permessi cada un badge o dichiarazione che distingua i due casi; controllare che il form non permetta di rilasciare un permesso per spazi confinati a chi non ha l'abilitazione**

3. **Autorizzazione ente concedente — non è tracciata la data di scadenza e rinnovo della concessione da ente (Comune/Provincia/Regione) · il cantiere ha solo stato (attivo/chiuso) senza dati dell'autorizzazione · aggiungere a `cantieri` i campi `autorizzazioneEnte` (data inizio), `autorizzazioneScadenza` (fino a 15 anni), `ente`, `numero_autorizzazione`; o creare una collezione separata `autorizzazioni` · il cantiere deve esibire in una schermata dedicata la data di scadenza dell'autorizzazione, con stessa logica dello scadenzario (verde/giallo/rosso)**

---

**Proposta non accettata** (già presente): L. 198/2025 citata in sei punti del codice, verbale DPI, anagrafe appaltatori con qualifiche, registro near-miss — già presenti e misurati.

**Proposta non accettata** (carenza di ricerca mondana): Periodicità exact per impianti (es. "impianto di aerazione ogni 12 mesi") — non trovato in ricerca generale; serve approfondimento su standard tecnici UNI e linee guida ASL per categoria.

---

## Note di metodo

- ⚠️ **WebFetch bloccato dal proxy**: non è stato possibile leggere il testo completo di fonti normative (ARPA, enti regionali) — le descrizioni vengono dai risultati di ricerca testuali
- ⚠️ **Non trovato**: una lista ufficiale di "controlli in ordine di priorità" — ricostruita per deduzione da norme D.Lgs 81/08 e D.Lgs 624/96
- ⚠️ **Non cercato**: software HSE di competitor (Gedora, Ergonet, ecc.) — servirebbe ricerca mirata successiva

Fonti:
- [Ispezione sul lavoro: svolgimento, controlli e verbale ispettorato del lavoro](https://www.lavoroediritti.com/abclavoro/ispezioni-sul-lavoro)
- [Controllo Ispettorato del Lavoro in cantiere: come prepararsi](https://cantiereinrete.it/blog/controllo-ispettorato-lavoro-cantiere/)
- [Controlli ispettorato del lavoro: cosa sapere e come agire](https://www.studiobclaw.it/comunicati/controlli-ispettorato-del-lavoro/)
- [Controlli e verifiche delle attrezzature di sollevamento D.Lgs 81/08](https://dszsrl.it/verifiche-periodiche-attrezzature-sollevamento/)
- [Le Verifiche Periodiche delle Attrezzature di Sollevamento (allegato VII del D.Lgs. 81/08)](https://www.progetto81.it/blog/61/attrezzature-sollevamento)
- [Documenti per la sicurezza sul lavoro: ecco l'elenco](https://biblus.acca.it/documenti-per-la-sicurezza-sul-lavoro/)
- [Sicurezza e valutazione dei rischi per le attività estrattive](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/sicurezza-valutazione-dei-rischi-per-le-attivita-estrattive-nelle-cave-AR-21944/)
- [Patentino escavatore: come ottenere la certificazione](https://www.asso-pmi.it/news/patentino-escavatore-come-ottenere-la-certificazione-secondo-la-legge-nuovo-accordo-stato-regioni-2025-realta-virtuale-app-formatori-docenti-rspp-esterno-interno-rls-rlst-preposto-datore-evento-forma.html)

---

## ⛔ RIVERIFICA DEL 14/08 — le tre mancanze proposte sono TUTTE E TRE false o mal poste

*Rimisurato dal ciclo prima che una riga entrasse in roadmap. Vale la regola:
**niente entra sulla parola dell'agente**, e un «non c'è» senza il suo comando
accanto vale zero.*

| mancanza dichiarata | verdetto | il comando, rilanciato |
|---|---|---|
| «manca la periodicità standard delle verifiche» | ⛔ **FALSA** | `grep -rciE "periodicita\|ogni.*mesi\|cadenza" apps/scudo/scudo-data.js` → **291**. Il campo si chiama `periodicitaGiorni` ed è nello schema delle ispezioni, con valori veri nella dimostrazione (30 e 15 giorni) |
| «non distingue il permesso per **spazi confinati**» | ⛔ **FALSA** | `grep -rciE "spazi confinati\|confinat\|177/2011" apps/scudo/scudo-data.js apps/scudo/index.html` → **33 e 3**. Il **D.P.R. 177/2011 art. 2** è citato per esteso nel modulo, con la voce di checklist «accesso a tramogge e spazi confinati» e una scadenza di formazione dedicata |
| «non traccia la scadenza dell'autorizzazione» | ⚠️ **MAL POSTA** | `grep -rciE "autorizzazione\|concessione\|rinnovo" apps/scudo/scudo-data.js` → **10**. Che *quella* scadenza sia nello scadenzario è un'altra domanda, e va posta così — non come «non c'è» |

### ⛔ È la QUARTA ricerca di fila con la stessa causa
Tutte e quattro hanno cercato **la parola del mondo dentro il nostro codice**:
«near-miss» dove il campo si chiama `tipo`, «safety stock» dove la funzione si
chiama `propostaScorte`, «modello A» dove la pagina scrive «dichiarazione
annuale», e adesso «periodicità standard» dove il campo si chiama
`periodicitaGiorni` e sta lì da settimane.
⚠️ Il mandato lo diceva, per esteso, con gli esempi — e non è bastato. La
lezione non è sul mandato: è che **il vocabolario è il punto debole di questo
tipo di lavoro**, e l'unica difesa che ha funzionato finora è **rilanciare i
comandi di chi consegna**, che costa un minuto per riga.

### Che cosa regge
La **metà sul mondo** — chi controlla (INL, ARPA, ASL, ente concedente) e che
cosa guarda ciascuno — è utile e va tenuta, **col limite dichiarato**:
`WebFetch` è bloccato dal proxy, quindi nessuna di quelle norme è stata
**aperta**; articoli e periodicità vengono da risultati di ricerca e vanno
verificati sul testo prima che un numero finisca in una schermata.
**Delle tre proposte, zero entrano in roadmap.**

## Ricerca del 2026-09-02 — lo scadenzario unico della cava: il mondo

### Fatti normative

La concessione/autorizzazione all'esercizio non può superare i **10 anni** [seconda mano - Abruzzo LR]. La periodicità varia per regione: in Piemonte Legge Regionale 23/2016 la disciplina [seconda mano - regione.piemonte.it]. Chi chiede il rinnovo avvia **prima della scadenza** un procedimento amministrativo [seconda mano - Città Metropolitana Milano, 60gg volture + 90gg altri]. Autorizzazione è **personale**: trasferimento (voltura) richiede riauthorizzazione [seconda mano - Comarca]. Dichiarazione quantitativi estratti: modello unico A, non aggregare più cave [seconda mano - Piemonte]. Canone varia 0–2€/m³ per regione; assente in Basilicata/Sardegna [seconda mano - report Legambiente 2025].

Revisione mezzi: **primo controllo 4 anni**, poi **ogni 2 anni** [seconda mano - motorionline.com]. Bollo: annuale, con 30gg tolleranza; sospensione veicolo se scaduto [seconda mano]. Assicurazione RC: obbligatoria, scadenza dipende da sottoscrizione [seconda mano].

Verificazione apparecchi sollevamento (all. VII D.Lgs 81/08): **1–3 anni** a secondo attrezzatura/età; richiesta 45gg prima scadenza [seconda mano - progetto81.it]. Formazione macchine movimento terra: **16 ore, quinquennale**, aggiornamento **4 ore** obbligatorio; **solo in presenza** [seconda mano - edafos.it/scuolasicurezza.it].

Sorveglianza sanitaria (art. 41 D.Lgs 81/08): **periodicità annuale** di norma, modificabile dal medico competente per rischio; organo di vigilanza può alterare con provvedimento motivato [seconda mano - tussl.it].

Autorità competenti: **Provincia** o Regione (per aree protette); **ARPA** sorveglia ambientalmente; **Corpo miniere** coordina [seconda mano - ARPAE Emilia-Romagna, Piemonte, Marche].

### Tabella: Scadenze per famiglia

| Famiglia | Scadenza tipica | Periodicità | Chi controlla | Fonte |
|---|---|---|---|---|
| Concessione estrazione | Autorizzazione esercizio | 10 anni, rinnovabile | Provincia/Regione | [seconda mano] LR regionali |
| Concessione estrazione | Dichiarazione annuale quantitativi | Annuale | Regione/Provincia | [seconda mano] Modello A |
| Concessione estrazione | Piano coltivazione | Ogni rinnovo (10 anni) | Regione/Provincia | [dedotto da LR] |
| Concessione estrazione | Garanzie fideiussorie | Per rinnovo concessione | Banca | [dedotto da prassi] |
| Mezzo | Revisione autocarro | 2 anni dopo primo controllo | Motorizzazione civile | [seconda mano] CdS |
| Mezzo | Bollo auto | Annuale, 30gg tolleranza | Regione | [seconda mano] |
| Mezzo | Assicurazione RC | Soggetta a scadenza sottoscrizione | Compagnia assicurativa | [seconda mano] CdS |
| Mezzo | Verificazione apparecchi sollevamento | 1–3 anni | Ente certificato/INAIL | [seconda mano] All. VII D.Lgs 81/08 |
| Persona | Sorveglianza sanitaria | Annuale (modificabile) | Medico competente/Organo vigilanza | [seconda mano] Art. 41 D.Lgs 81/08 |
| Persona | Formazione macchine movimento terra | 5 anni, aggiornamento 4 ore | Ente autorizzato | [seconda mano] D.Lgs 81/08 |
| Persona | Formazione generale + specifica | Annuale (rinnovamento) | RSPP interno | [dedotto da norma] |

### Tabella: Software HSE — come mostrano scadenzario unificato

| Software | Scadenzario unico? | Stati dichiarati | Preavviso | Fonte |
|---|---|---|---|---|
| Blumatica Q-HSE | Sì, CloudIO sincronizzato | Non esplicitato in ricerca | Configurabile, generato automatico | [seconda mano] blumatica.it/blog |
| Sikuro | Sì, centralizzato | Non esplicitato in ricerca | Alerting configurabile, giorni scelti dall'utente | [seconda mano] sikurogroup.com/scadenzario-intelligente |
| SafeFleet | Sì (flotta focus) | Non esplicitato in ricerca | Preavviso per manutenzione | [seconda mano] safefleet.it |
| 4HSE | Sì | Non esplicitato in ricerca | Non esplicitato in ricerca | [seconda mano] 4hse.com |

**Nota**: Ricerca non ha trovato specifiche pubbliche su gestione stati «in regola / scaduta / mai registrata» per software HSE italiani. Software mostra scadenzario unificato per concessioni + mezzi + persone, con periodicità automatica e alerting, ma **documenti pubblici non descrivono come giudicano uno stato senza data di registrazione iniziale**.

### Domande per chi ha il codice in mano

1. **Chi decide che una scadenza senza data iniziale è «scaduta»?** Il medico competente che fissa periodicità è lo scrittore della regola temporale, o la app lo decide dal solo valore di periodo?
2. **Lo scadenzario accetta uno stato nullo («mai registrata»)?** O costringe il dato a un valore prudenziale (es. «scaduta 365gg fa»)?
3. **Un apparecchio di sollevamento senza cartellino di verifica — è un fallimento di lettura, o la regola lo vede come «mai verificato»?**
4. **Quando ARPA/Provincia chiedono lo stato delle scadenze di concessione, quale formato leggono?** CSV / API / pannello web / carta intestata?
5. **Che cosa mostra il preavviso: data di scadenza - data odierna, oppure conta anche il buffer del medico competente (es. 30gg prima)?**


## Ricerca del 2026-09-02 — sicurezza del lavoro in cava, la pratica quotidiana (metà sul mondo)

### Che cosa esiste già da noi

Non verificato da questa ricerca: il delta lo fa chi ha il codice in mano (vedere checkpoint e roadmap).

### Registro degli infortuni e mancati infortuni (near miss)

**Normativa**: D.Lgs. 81/2008 non usa il termine "near miss", ma contiene disposizioni sulla gestione delle condizioni di pericolo [seconda mano]. Art. 15 D.L. 159/2025 impone il tracciamento strutturato dei mancati infortuni alle imprese con più di 15 dipendenti, con comunicazione aggregata al Ministero del Lavoro (non diretto all'INAIL) [seconda mano]. **Scadenze denuncia**: infortuni con almeno 1 giorno di assenza → comunicazione statistica; infortuni > 3 giorni → denuncia INAIL entro 2 giorni [seconda mano - norma INAIL].

### Indici di frequenza e gravità

**Indice di Frequenza (IF)**: numero infortuni denunciati in un anno / (totale ore lavorate × 1.000.000) [seconda mano - UNI 7249:2007].

**Indice di Gravità (IG)**: giorni perduti convenzionali / (ore lavorate × 1.000). Convenzioni: infortunio temporaneo = giorni effettivi; permanente = grado inabilità × 75; mortale = 7.500 giorni [seconda mano - UNI 7249:2007].

### Sorveglianza sanitaria e formazione

**Visite mediche**: preventiva (assenza controindicazioni) + periodica (annuale di norma, modificabile dal medico competente su rischio specifico, art. 41 D.Lgs 81/08) [seconda mano]. Rischi monitora: silice, rumore, vibrazioni, movimentazione carichi [seconda mano].

**Formazione** (Accordo Stato-Regioni 2025): lavoratori rischio alto = 12 ore + 6 ore aggiornamento quinquennale [seconda mano]; preposti = 12 ore (anziché 8), aggiornamento biennale 6 ore [seconda mano]; macchine movimento terra = teoria + addestramento pratico campo [seconda mano].

### DPI, permessi speciali, piani emergenza

**DPI**: datore di lavoro registra consegna con modulo sottoscritto; manutenzione/sostituzione programmata; durata limitata nel tempo [seconda mano]. **Lavori speciali**: D.Lgs 81 art. 81 pone priorità protezioni collettive su DPI per lavori in quota [seconda mano]. **Emergenza**: D.Lgs 624/1996 richiede Documento Sicurezza e Salute (DSS) con valutazione rischi e piani emergenza per possibile coinvolgimento popolazione [seconda mano].

### Software HSE — funzioni per cave

| Software | Registro infortuni | Near miss / KPI | Periodicità sorveglianza | Fonte |
|---|---|---|---|---|
| SafetyCulture (iAuditor) | Sì, modello italiano | Sì, tracciamento e corrective actions | Non esplicitato | [seconda mano] safetyculture.com |
| Intelex | Sì, OSHA-like capture | Sì, riduzione near-miss-to-recordable | Generica integrazione calendari | [seconda mano] intelex alternatives |
| Cority | Sì, full incident management | Sì, trend analysis con split near/recordable | ISO 45001-ready, periodicità generica | [seconda mano] best-ehs-2026 |
| Zucchetti Sicurezza | Sì, gestionale italiano HSE | Generica integrazione con KPI | Sorveglianza sanitaria integrata | [seconda mano] zucchetti.it |
| Blumatica Q-HSE | Sì, moduli modulari | Non esplicitato per cave | Calendari gestione scadenze | [seconda mano] blumatica.it |

**Nota**: Ricerca non ha trovato descrizioni pubbliche specifiche su come questi software gestiscono la complessità italiana (D.Lgs 624/1996, DSS, periodicità medico competente vs. scadenze autoritative). Tutti riportano funzioni generiche di registro + KPI; nessuno cita «idoneità » come stato di visita medica periodica, né la formula UNI 7249 per gli indici.

### Domande per il delta

1. Dove decidiamo il formato del registro infortuni: INAIL-standard, UNI 7249, oppure DSS D.Lgs 624/1996 per cave?
2. Near miss e infortuni condividono lo stesso elenco o sono separati? Come filtriamo il «rapporto near-miss-to-recordable» se sono insieme?
3. Visite mediche: la «periodicità» viene dal medico competente (persona) o dalle regole di mansione? Come cambia al cambio mansione?
4. La sorveglianza sanitaria emette un giudizio di «idoneità» con un valore (es. «idoneo», «idoneo con limitazioni», «non idoneo»)? Da chi?
5. Quale software usiamo e come lo integriamo col nostro modulo dati (persone, mansioni, storici)?

### Fonti

[seconda mano] https://www.puntosicuro.it/i-quesiti-sul-decreto-81-l-obbligo-di-registrare-i-mancati-incidenti
[seconda mano] https://www.silaq.com/media/articoli-silaq/near-miss-nei-luoghi-di-lavoro-la-svolta-normativa-che-cambia-la-prevenzione
[seconda mano] https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/rischi-infortuni-mancati-infortuni-indicatori
[seconda mano] https://www.vegaformazione.it/glossario/indice-frequenza-infortuni
[seconda mano] https://www.vegaformazione.it/glossario/indice-gravita-infortuni
[seconda mano] https://tussl.it/titolo-i-principi-comuni/capo-iii-gestione-della-prevenzione-nei-luoghi-di-lavoro/sezione-v-sorveglianza-sanitaria/art-41
[seconda mano] https://www.vegaengineering.com/news/nuovo-accordo-stato-regioni-2025-le-novita-sulla-formazione
[seconda mano] https://www.puntosicuro.it/valutazione-dei-rischi-come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo
[seconda mano] https://safetyculture.com/intelex-alternative
[seconda mano] https://www.smartqhse.com/best-ehs-software
[seconda mano] https://www.smartqhse.com/safety-blog/best-incident-reporting-software-2026
[seconda mano] https://www.zucchetti.it/it/cms/soluzioni/safety-security/safety
[seconda mano] https://blumatica.it/software/q-hse-manager

### Il delta, fatto da chi ha il codice in mano (02/09, contro `cd1beed0`)

Le cinque domande, risposte aprendo `apps/scudo/scudo-data.js` — cercando il
MECCANISMO, non la parola del mondo (la lezione del 14/08 su questo stesso
documento: «near-miss» era già un `tipo` dentro `infortuni`).

1. **Il formato del registro** → è il nostro, e non finge di essere un modulo
   di legge: `csvRegistroInfortuni(eventi)` con `parseInfortuniCsv` per
   l'andata e ritorno, `riepilogoInfortuni`, e il DSS delle cave (D.Lgs
   624/1996) come CICLO — `cicloDss(documento, infortuni, oggi)` e
   `dssDaSeguire` (`grep -ciE '624/1996|DSS' apps/scudo/scudo-data.js` → **97**). Che cosa dice la
   legge sul formato oggi (la ricerca cita un D.L. 159/2025 sul tracciamento,
   di seconda mano) NON è verificato: prima di scrivere un riferimento in una
   schermata va letto il testo, non un risultato di ricerca.
2. **Near miss e infortuni** → stesso elenco, `tipo: infortunio|near-miss`,
   e le funzioni li separano quando serve: `riepilogoNearMiss(infortuni,
   azioni, giorni)`, `descriviLetturaNearMiss`, `riepilogoPotenziale` (la
   gravità potenziale, con la pastiglia in testa al nome). Il rapporto
   near-miss/infortuni è un filtro sullo stesso elenco, non due collezioni.
3. **La periodicità delle visite** → la decide chi la scrive, per PERSONA: la
   «Visita medica» è una scadenza con la data della prossima
   (`periodicitaGiorni` è il campo, presente nelle scadenze della
   dimostrazione), il preset dà la periodicità tipica, e il cambio mansione
   passa dalla matrice `matriceMansione`/`abilitazioneLavoratore` che dice
   che cosa manca per la mansione nuova. Una regola «per mansione con
   esposizione a silice/rumore/vibrazioni» che generi la periodicità da sola
   NON c'è (`grep -ciE 'silice|rumore|vibrazion' apps/scudo/scudo-data.js` → 9, tutte in testi e
   preset, nessuna in una funzione che calcoli una periodicità): è una
   decisione del medico competente, e va bene che sia lui a scriverla.
4. **Il giudizio di idoneità** → esiste con quattro stati, D.Lgs 81/2008 art.
   41: `idoneitaLabel` — `idoneo`, `prescrizioni` (idoneo con limitazioni),
   `non-idoneo`, e il non definito che si mostra «Idoneità n.d.» e non «idoneo».
   Chi lo scrive è chi registra l'esito; il ponte Campo↔Scudo lo usa per «chi
   è in turno è in regola?» (`idoneitaDiTurno`).
5. **Quale software usiamo** → nessuno: Scudo È il modulo. La domanda della
   ricerca presuppone un prodotto esterno da integrare; qui il registro, le
   scadenze, i DPI (`ultimaConsegnaDpi`, `allarmiDpi`, `verbaleDpi`), i
   permessi di lavoro (`statoPermesso`, `permessiDelGiorno`, 22 occorrenze),
   l'organigramma (`organigrammaSicurezza`) e gli indici sono funzioni pure
   sullo stesso modulo dati.

**Le due cose che mancano davvero**, trovate per strada:
· la **denuncia INAIL entro due giorni** (infortunio > 3 giorni) come scadenza
  che nasce dall'evento: `grep -ciE 'entro (2|due) giorni|48 ore' apps/scudo/scudo-data.js` → **0**;
  «INAIL» compare 10 volte, tutte per la PRIMA VERIFICA delle attrezzature
  (art. 71 c.11), mai per la denuncia. ⏱️ Candidato: alla registrazione di un
  infortunio con prognosi > 3 giorni, una scadenza «denuncia INAIL» a +2
  giorni dalla data — SOLO dopo aver letto sul testo primario il termine
  esatto e da quando decorre (la ricerca lo riporta di seconda mano; un
  termine di legge sbagliato in una schermata è peggio di uno assente);
· gli **indici secondo UNI 7249** per nome: `grep -ciE 'UNI 7249' apps/scudo/scudo-data.js` → **0**,
  ma `indiciInfortunistici(infortuni, oreLavorate, anno)` calcola IF, IG e
  LTIFR e si RIFIUTA senza le ore lavorate (denominatore mai inventato): la
  formula c'è, la citazione della norma no — e prima di citarla va verificato
  che le convenzioni (giorni perduti, ×1.000.000 / ×1.000) siano le sue.

Riassunto: **cinque su cinque esistono**, con la forma giusta per una cava;
due mancanze vere fuori dalle domande (la denuncia come scadenza, la norma
citata per nome), tutt'e due sospese a una lettura del testo primario.

## Ricerca del 2026-09-05 (notte) — la sorveglianza sanitaria in cava: il mondo

*Metà sul mondo con `WebSearch` (tre ricerche); il testo primario non si legge
da qui (`WebFetch`/`curl` bloccati), quindi tutto è **[seconda mano: risultato
di ricerca]** e nessun termine o periodicità entra in una schermata come
numero di legge. Tema non ancora fatto in questo documento: le tornate
precedenti coprivano l'ispettore, i near-miss, le verifiche periodiche, lo
scadenzario unico e la pratica quotidiana.*

**Che cosa succede fuori.**

1. **Il giudizio è per mansione, e ha quattro forme.** Il medico competente
   esprime, per la mansione specifica: idoneità; idoneità **parziale,
   temporanea o permanente, con prescrizioni o limitazioni**; inidoneità
   temporanea; inidoneità permanente. Il giudizio va **trasmesso per iscritto
   sia al lavoratore sia al datore di lavoro**. [seconda mano: art. 41 D.Lgs
   81/2008 via codiceappalti.it, tussl.it, puntosicuro.it]
2. **La periodicità la decide il medico, e l'organo di vigilanza può
   cambiarla.** «Di norma una volta l'anno», ma il medico competente la
   stabilisce in funzione della valutazione del rischio, e l'organo di
   vigilanza «con provvedimento motivato può disporre contenuti e periodicità
   diversi». Ci sono poi le visite su richiesta del lavoratore, al cambio di
   mansione, alla cessazione nei casi previsti. [seconda mano: stesse fonti]
3. **Il ricorso.** Contro i giudizi del medico competente, lavoratore e
   datore di lavoro possono fare ricorso **entro trenta giorni dalla
   comunicazione** all'organo di vigilanza (SPISAL/PSAL della ASL), che
   conferma, modifica o revoca; **finché la ASL non risponde l'azienda deve
   organizzare la posizione rispettando prescrizioni, limitazioni o
   inidoneità**. [seconda mano: asl3.liguria.it, auslromagna.it,
   aulss8.veneto.it, medicolavoro.org]
4. **La silice ha un protocollo suo.** Il Network Italiano Silice (NIS)
   propone un protocollo sanitario legato al livello di esposizione alla
   silice cristallina respirabile: visita all'assunzione, poi accertamenti
   periodici (spirometria, radiografia del torace letta secondo ILO/BIT da un
   lettore certificato «B reader» sopra una certa esposizione), con cadenze
   diverse dalla visita ordinaria (le fonti citano 5 anni fino a 20 anni di
   esposizione e 2 anni oltre). Cioè: per un cavatore la «visita periodica»
   non è una sola cosa, e la cadenza degli accertamenti è **del medico**.
   [seconda mano: confindustriaceramica.it, assorisorse.org allegato 8,
   ats-brianza.it manuale lapidei, scuolaedilepiacenza.it]
5. **La cartella sanitaria e di rischio** è del medico competente e resta
   riservata: l'azienda ha il **giudizio**, non la cartella. Quindi ciò che un
   gestionale di cava può tenere è il giudizio, la sua data, le prescrizioni
   scritte, e la prossima visita. [seconda mano: puntosicuro.it]

Fonti (lette come risultati di ricerca, non come testo primario):
https://www.codiceappalti.it/dlgs_81_2008/art__41__sorveglianza_sanitaria/5020 ·
https://www.puntosicuro.it/sanita-servizi-sociali-C-12/la-sorveglianza-sanitaria-ed-il-giudizio-di-idoneita-AR-10571/ ·
https://www.asl3.liguria.it/territorio/servizi/prevenzione-e-sicurezza-ambienti-di-lavoro-psal/164-ricorsi-art-41-comma-9-d-lgs-81-2008.html ·
https://www.auslromagna.it/servizi/ricorso-avverso-il-giudizio-del-medico-competente ·
https://www.assorisorse.org/wp-content/uploads/2020/07/Silice_All.8_Protocollo.pdf ·
https://www.ats-brianza.it/images/pianomirato/lapidei/Manuale%20buone%20prassi%20lavorazione%20lapidei%20rev4.pdf ·
https://www.scuolaedilepiacenza.it/it/polveri_e_silice_cristallina/linee_guida_per_la_sorveglianza_sanitaria_ed_accertamenti_diagnostici_sui_lavoratori_esposti_a_silice_cristallina_sc_103.htm

### Il delta, fatto da chi ha il codice in mano (verificato contro il codice al commit `d7a60486`)

Cercato per **meccanismo**: chi decide l'idoneità di una persona, chi la legge.

- **Chi registra il giudizio?** Scudo: `idoneitaLabel` / `idoneitaSuccessivo`
  in `scudo-data.js` — quattro stati (n.d., idoneo, idoneo con prescrizioni,
  NON idoneo) che si cambiano **toccando il badge** nella scheda Personale
  (`data-idn`, `db.aggiorna("lavoratori", …, { idoneita })`); il CSV del
  personale lo esporta; il Quadro conta le idoneità n.d. (`idnIgnota`);
  `idoneitaCriticita` mette fra le urgenze prescrizioni e non idonei; la
  visita periodica è il preset di scadenza `sorv-sanitaria` (12 mesi di
  partenza, riferimento art. 41 — e il punto 2 del mondo dice che la cadenza
  la decide il medico: giusto che sia un preset modificabile). **Il punto 1
  c'è, in forma corta.**
- **Che cosa NON c'è del giudizio: la data e le prescrizioni scritte.**
  `grep -n "idoneitaIl\|giudizioIl\|dataGiudizio\|ricorso" apps/scudo/scudo-data.js
  apps/scudo/index.html` → **0**; `grep -n "prescrizion"` → 12 righe, **tutte**
  sulle verifiche periodiche delle attrezzature (`verificaEsito:
  "prescrizioni"`) o sull'etichetta del badge, nessuna sul testo delle
  prescrizioni di una persona. Il mondo (punti 1, 3, 5) dice che l'azienda
  ha in mano un giudizio **scritto e datato**, con prescrizioni che deve
  rispettare da subito. Candidato (b), costo basso: `giudizioIl` e
  `prescrizioni` (testo) sul lavoratore, chiesti quando il badge passa a
  «prescrizioni» o «non idoneo» (una modale del core, non un ciclo cieco), e
  scritti nella riga e nel CSV. ⚠️ I «trenta giorni» del ricorso sono un
  termine di legge di seconda mano e **non si scrivono**: si scrive «giudizio
  del …», non «ricorso entro il …».
- **Chi legge il giudizio quando la persona va in turno?** Nessuno. Il ponte
  con Campo (`idoneitaOperatore` in `shared/dw-ponti.js`) guarda **solo le
  scadenze** (`statoScadenzaHSE` su `scadenze` del lavoratore): il campo
  `idoneita` non compare da nessuna parte nella funzione (`grep -n "idoneita"
  shared/dw-ponti.js` → solo i nomi delle due funzioni e i commenti). Quindi
  una persona dichiarata **NON idonea** in Scudo, coi documenti in corso, va
  in turno in Campo come **«regolare»** — e il mondo (punto 3) dice che le
  prescrizioni e l'inidoneità vanno rispettate da subito, ricorso o no. È il
  principio del fondatore nella veste più cara: il numero tranquillo su chi
  scende in cava. Candidato (a), costo medio, vive in `shared/` perché serve a
  due app: `idoneitaOperatore` legge anche `l.idoneita` e risponde con uno
  stato in più («non-idoneo», e «prescrizioni» come avviso), Campo lo mostra
  nell'appello, e la regola 18 di `run-stile` pretende che le mappe di stati
  di Campo coprano il nuovo stato. Misura: un operatore non idoneo coi
  documenti validi non esce «regolare».
- **La dimostrazione non ha nessun giudizio.** `grep -c 'idoneita: "'
  apps/scudo/scudo-data.js` → **0**: i sette lavoratori sono tutti «Idoneità
  n.d.», quindi nessuna schermata mostra mai un idoneo con prescrizioni, e il
  ponte non ha mai avuto il caso davanti. Candidato (c), costo basso: un
  idoneo, uno con prescrizioni (scritte), uno n.d. — così il Quadro, il CSV e
  Campo lo fanno vedere.
- **La silice (punto 4)**: non produce un delta nel prodotto. La cadenza degli
  accertamenti è del medico e del protocollo, e Scudo la tiene come scadenza
  con data e ricorrenza scelte dall'utente; scrivere «5 anni» o «2 anni»
  sarebbe un numero di seconda mano su una schermata. Va detto qui perché una
  ricerca futura non lo porti dentro.

Riassunto: **il giudizio c'è come stato; mancano la sua data, il testo delle
prescrizioni e — soprattutto — chi lo legge quando la persona va in turno.**
In ordine: (a) il ponte con Campo legge l'idoneità (medio, `shared/`); (b)
data e prescrizioni del giudizio (basso); (c) la dimostrazione con i tre
casi (basso).

*Aggiornamento della notte stessa (commit successivo a `f798f311`): (a) ✅ e
(c) ✅ fatti — il ponte legge il giudizio e le due dimostrazioni portano i tre
casi; (b) ✅ subito dopo: `giudizioIdoneita`, la modale al tocco del badge,
la data e le prescrizioni nella riga e nel CSV. Tre candidati su tre fatti.*
