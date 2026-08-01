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
