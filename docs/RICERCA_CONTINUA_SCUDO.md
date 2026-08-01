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
| Azioni correttive | Azione senza responsabile non dice chi la deve fare | La colonna `responsabileId` ammette null (modello dati, riga 16 di scudo-data.js); un'azione aperta senza responsabile appare nella lista senza che nessuno sappia che è un buco | Piccolo | Creare un'azione con responsabile vuoto; in lista appare con qualche indicatore visivo che nessuno è assegnato, o dice solo "Fatto da: —"? |
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
