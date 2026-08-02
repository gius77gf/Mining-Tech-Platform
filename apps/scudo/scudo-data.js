// ============================================================
// Scudo — accesso dati (C1)
// Unica fonte dati dell'app: Firestore via SDK Deepwork ID
// (orgCollection, sigillato sull'organizzazione) con fallback ai
// dati demo quando il backend non è configurato o si è in tour.
//
// Collezioni (sotto organizations/{org}/apps/scudo/):
//   lavoratori/{id}: { nome, ruolo, tel, note, attivo }
//   scadenze/{id}:   { lavoratoreId|null, tipo, descrizione,
//                      dataScadenza (ISO yyyy-mm-dd), stato? }
//   documenti/{id}:  { titolo, meta, tipo?, cantiereId?|null,
//                      lavoratoreId?|null, allegatoNome?, allegatoData?
//                      (dataURL ≤ 400 KB — file grandi: Firebase Storage,
//                      arriverà col progetto live), stato: valido|da-rivedere|scaduto }
//                    → sui documenti di tipo "DSS" vivono anche i tre campi del
//                      CICLO DI VITA (D.Lgs 624/96 art. 6): dssRevisione (ISO,
//                      ultima revisione), dssMotivo (chiave di
//                      MOTIVI_REVISIONE_DSS) e dssTrasmissione (ISO, invio
//                      all'autorità di vigilanza). Stanno QUI e non in una
//                      collezione a parte, come i documenti di qualifica degli
//                      appaltatori: il DSS è un documento del registro, e il
//                      suo ciclo è fatto di date sue.
//                      ⛔ Sono OPZIONALI, e la loro assenza è uno stato che il
//                      prodotto sa raccontare: senza dssRevisione il DSS non è
//                      «aggiornato» né «scaduto», è NON DATABILE (cicloDss).
//   cantieri/{id}:   { nome, comune, tipo: cava|cantiere, stato: attivo|chiuso }
//   azioni/{id}:     { descrizione, responsabileId|null, scadenza (ISO),
//                      stato: aperta|in-corso|chiusa, esito?, dataChiusura?,
//                      origineTipo: evento|ispezione|nc|superamento|reclamo|"",
//                      origineId?|null, origineVoce?|null, origineNota?,
//                      origineApp?, origineData?, origineEtichetta? }
//                    → azione correttiva (CAPA) nata da un evento del registro
//                      infortuni/near-miss, da una voce non conforme di
//                      un'ispezione, o da una non conformità rilevata.
//                      "superamento" e "reclamo" arrivano da SENTINELLA
//                      (origineApp: "sentinella"): un superamento di soglia
//                      ambientale o il reclamo di un residente chiedono
//                      un'azione correttiva esattamente come un near-miss.
//                      Quelle azioni portano con sé il TESTO dell'origine
//                      (origineNota/origineData/origineEtichetta) perché
//                      Scudo non può leggere le collezioni di Sentinella:
//                      l'isolamento dello SDK è per organizzazione E per app.
//   infortuni/{id}:  { data (ISO), tipo: infortunio|near-miss, gravita,
//                      giorniAssenza, descrizione, luogo,
//                      categoria? (near-miss: tipo di rischio),
//                      anonimo? (bool), segnalatoDaId?|null, rapida? (bool),
//                      foto?: [{ nome, dataURL, didascalia? }] — max 3, e
//                      max 400 KB IN TUTTO (LIMITE_ALLEGATO): due allegati
//                      da 400 KB fanno il 104% del tetto di 1 MB del
//                      documento Firestore e la scrittura viene rifiutata,
//                      portandosi dietro l'evento intero. }
//   ispezioni/{id}:  { modello (chiave), nome, ambito, cantiereId|null,
//                      responsabileId|null, data (ISO), periodicitaGiorni|null,
//                      riferimento?, voci: [{ id, testo }],
//                      esiti: { voceId: { esito: conforme|non-conforme|na, nota,
//                        foto?: [{ nome, dataURL, didascalia? }] } }
//                      → le foto di TUTTE le voci stanno in questo unico
//                        documento, quindi i 400 KB sono il totale
//                        dell'ispezione, non della voce (bilancioFotoVoce),
//                      stato: programmata|in-corso|completata, dataChiusura?|null }
//   mansioni/{id}:   { nome, note?, requisiti: [chiave], dpi: [chiave],
//                      lavoratoriIds: [id] }
//                    → il lavoro che una persona fa in cava e ciò che SERVE per
//                      farlo: corsi/abilitazioni richiesti e DPI previsti.
//   nomine/{id}:     { ruolo (chiave), lavoratoreId, dal (ISO), al?|null, note? }
//                    → chi ricopre le figure della sicurezza (sorvegliante,
//                      preposto, RSPP, RLS, addetti emergenza…).
//   dpi/{id}:        { lavoratoreId, tipo (chiave), modello?, taglia?,
//                      dataConsegna (ISO), scadenza?|null, addestramento (bool),
//                      dataAddestramento?|null, note? }
//                    → registro delle consegne DPI (art. 77 D.Lgs 81/08).
//   analisi/{id}:    { eventoId, perche: [testo], causa (chiave di
//                      CAUSE_ANALISI), fatta (ISO), daChi (lavoratoreId|null),
//                      azioniId: [id] }
//                    → l'analisi della causa di un evento del registro (i «5
//                      Perché»). UNA SOLA per evento: se serve rifarla si
//                      corregge quella, invece di accumulare versioni fra cui
//                      nessuno sa quale valga.
//                      ⚠️ `azioniId` NON è il legame evento↔azione: quello vive
//                      dove è sempre vissuto, in `azioni.origineTipo`/
//                      `origineId`, ed è l'unico che le schermate leggono per
//                      dire quante azioni ha un evento. `azioniId` registra le
//                      azioni nate DOPO l'analisi, cioè quelle che il «perché»
//                      ha prodotto: due numeri diversi che dicono due cose
//                      diverse, e nessuno dei due è una copia dell'altro.
// Lo "stato" delle scadenze non si salva: si CALCOLA dalla data
// (scaduta / entro 30gg / regolare) — niente dati derivati nel DB.
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione, senzaDoppioni, dataISOEsiste,
         pezziDataURL, LIMITE_ALLEGATO } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  lavoratori: [
    { id: "d1", nome: "Mario Rossi", ruolo: "Fochino", tel: "", attivo: true },
    { id: "d2", nome: "Luca Bianchi", ruolo: "Escavatorista", tel: "", attivo: true },
    { id: "d3", nome: "Giulia Verdi", ruolo: "Preposto", tel: "", attivo: true },
    { id: "d4", nome: "Anna Neri", ruolo: "Impiegata", tel: "", attivo: true },
    { id: "d5", nome: "Paolo Gallo", ruolo: "Autista", tel: "", attivo: true },
    { id: "d6", nome: "Franco Riva", ruolo: "Fochino", tel: "", attivo: true },
    { id: "d7", nome: "Sara Conti", ruolo: "RSPP esterno", tel: "", attivo: true },
  ],
  // CHI È SCHIERATO, che in esercizio arriva da Campo (ponte P3, sola lettura).
  // Copiati dalla dimostrazione di Campo id per id: se le due dimostrazioni
  // dicessero cose diverse sulla stessa squadra, l'ecosistema smentirebbe sé
  // stesso proprio nel punto che serve a mostrare che le app si parlano.
  operatoriCampo: [
    { id: "o1", nome: "Mario Rossi", ruolo: "Fochino", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d1" },
    { id: "o2", nome: "Luca Bianchi", ruolo: "Perforatore", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d2" },
    { id: "o3", nome: "Giulia Verdi", ruolo: "Caposquadra", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d3" },
    { id: "o4", nome: "Paolo Gallo", ruolo: "Autista", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d5" },
    { id: "o5", nome: "Youssef Amrani", ruolo: "Manutentore", squadra: "Squadra C", stato: "non-disponibile" },
  ],
  squadreCampo: [
    { id: "q1", nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" },
    { id: "q2", nome: "Squadra B — Carico", persone: 3, area: "piazzale 2", stato: "operativa" },
    { id: "q3", nome: "Squadra C — Impianto", persone: 2, area: "frantoio", stato: "ferma" },
  ],
  scadenze: [
    { id: "s1", lavoratoreId: "d1", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-07-02" },
    { id: "s2", lavoratoreId: "d2", tipo: "Corso", descrizione: "Corso antincendio", dataScadenza: "2026-07-11" },
    { id: "s3", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione preposto", dataScadenza: "2026-08-09" },
    { id: "s4", lavoratoreId: "d6", tipo: "DPI", descrizione: "Consegna DPI", dataScadenza: "2026-08-15" },
    { id: "s5", lavoratoreId: "d5", tipo: "Patente", descrizione: "CQC rinnovo", dataScadenza: "2026-09-02" },
    { id: "s6", lavoratoreId: "d5", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-05-20" },
    { id: "s7", lavoratoreId: "d5", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-04-18" },
    { id: "s8", lavoratoreId: "d5", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-04-18" },
    { id: "s9", lavoratoreId: "d3", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-02-11" },
    { id: "s10", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2030-02-11" },
    { id: "s11", lavoratoreId: "d1", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-05-30" },
    { id: "s12", lavoratoreId: "d1", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-05-30" },
    { id: "s13", lavoratoreId: "d1", tipo: "Patente", descrizione: "Fochino — abilitazione brillamento mine", dataScadenza: "2028-05-30" },
    { id: "s14", lavoratoreId: "d6", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-01-20" },
    { id: "s15", lavoratoreId: "d6", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-03-05" },
    { id: "s16", lavoratoreId: "d6", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-03-05" },
    { id: "s17", lavoratoreId: "d6", tipo: "Patente", descrizione: "Fochino — abilitazione brillamento mine", dataScadenza: "2029-11-14" },
    { id: "s18", lavoratoreId: "d2", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-04-08" },
    { id: "s19", lavoratoreId: "d2", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2028-09-30" },
    { id: "s20", lavoratoreId: "d2", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2028-09-30" },
    { id: "s21", lavoratoreId: "d5", tipo: "Corso", descrizione: "Primo soccorso — aggiornamento addetti", dataScadenza: "2028-04-14" },
    { id: "s22", lavoratoreId: "d5", tipo: "Formazione", descrizione: "RLS — aggiornamento periodico", dataScadenza: "2027-06-15" },
  ],
  documenti: [
    { id: "c1", titolo: "DVR — Documento Valutazione Rischi", meta: "Aggiornato 03/2026", tipo: "DVR", stato: "valido" },
    { id: "c2", titolo: "Piano di Emergenza", meta: "Aggiornato 01/2026", tipo: "Altro", stato: "valido" },
    { id: "c3", titolo: "Nomine RSPP / addetti", meta: "Revisione richiesta", tipo: "Nomina", stato: "da-rivedere" },
    /* ⛔ IL DSS DELLA CAVA, ED È NON DATABILE DI PROPOSITO. Il documento c'è,
       il suo stato dice «valido» e la nota dice pure che è stato inviato: tre
       cose rassicuranti, e nessuna delle tre è una data che l'app possa
       leggere. È esattamente il caso per cui `cicloDss` esiste — un DSS di cui
       non si sa l'età non è «aggiornato» e non è «scaduto» — ed è anche il
       punto di partenza vero di una cava che carica il suo archivio.
       Il ciclo si compila dalla schermata Documenti: messe le date, la stessa
       riga passa a «in corso di validità» o a «certificazione scaduta». */
    { id: "c4", titolo: "DSS — Documento Sicurezza e Salute", meta: "Inviato ASL 02/2026", tipo: "DSS", cantiereId: "k1", stato: "valido",
      dssRevisione: null, dssMotivo: "", dssTrasmissione: null },
    { id: "c5", titolo: "Verbale consegna DPI — M. Rossi", meta: "Firmato 04/2026", tipo: "Verbale DPI", lavoratoreId: "d1", stato: "valido" },
    /* ⛔ UN DOCUMENTO DI CUI NESSUNO HA SCRITTO LO STATO. Ci si arriva con un
       import o con un archivio vecchio, ed è il caso per cui `D[d.stato]` ha
       il ripiego «Stato non indicato»: senza questa riga quella difesa non la
       vedeva nessuno — né il fondatore né uno scatto. Un dato che manca è uno
       stato che il prodotto sa raccontare, e la dimostrazione lo mostra. */
    { id: "c6", titolo: "Autorizzazione allo scarico acque di lavorazione", meta: "Da archivio cartaceo, stato non registrato", tipo: "Altro", cantiereId: "k1", stato: "" },
    /* I DOCUMENTI DI QUALIFICA DELLE IMPRESE ESTERNE. Vivono in QUESTO
       registro — non in un secondo archivio — collegati da `appaltatoreId`
       come gli altri si collegano a `cantiereId` e `lavoratoreId`; `scadenza`
       la legge `statoScadenza`, che è la stessa regola dello scadenzario.
       ⛔ Manca di proposito qualunque riga per «ap3»: è l'impresa NON
       VERIFICATA, e un'assenza è uno stato che il prodotto sa raccontare. */
    { id: "c7", titolo: "Visura CCIAA — Autotrasporti Valle srl", meta: "art. 26 c.1 lett. a)", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "cciaa", scadenza: "2027-02-10", stato: "valido" },
    { id: "c8", titolo: "Autocertificazione requisiti — Autotrasporti Valle srl", meta: "art. 47 DPR 445/2000", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "autocert", scadenza: null, stato: "valido" },
    { id: "c9", titolo: "DURC — Autotrasporti Valle srl", meta: "Validità 120 giorni", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "durc", scadenza: "2026-11-30", stato: "valido" },
    /* Officina Meccanica Sud: il camerale c'è ed è SCADUTO. Non è un dettaglio
       formale — è la riga per cui l'esito «scaduto» esiste separato da
       «incompleto»: qualcuno ha guardato, e quello che ha trovato non vale più. */
    { id: "c10", titolo: "Visura CCIAA — Officina Meccanica Sud snc", meta: "Da rinnovare", tipo: "Altro",
      appaltatoreId: "ap2", tipoQualifica: "cciaa", scadenza: "2026-05-31", stato: "da-rivedere" },
  ],
  cantieri: [
    { id: "k1", nome: "Cava Monte Alto", comune: "Comune di esempio", tipo: "cava", stato: "attivo" },
    { id: "k2", nome: "Cantiere cliente Edilcave", comune: "Comune di esempio", tipo: "cantiere", stato: "attivo" },
  ],
  /* LE IMPRESE ESTERNE. In una cava ci sono sempre: chi trasporta, chi ripara,
     chi perfora, chi ripristina. Le tre righe mostrano i tre esiti che la
     qualifica sa dire, e la terza è quella che conta: un'impresa **senza
     nessun documento** non è «idonea finché non si scopre il contrario», è
     NON VERIFICATA, ed è il caso su cui un ispettore guarda per primo. */
  appaltatori: [
    { id: "ap1", ragioneSociale: "Autotrasporti Valle srl", partitaIva: "0000000001",
      attivita: "Trasporto inerti", referente: "—", telefono: "", attivo: true },
    { id: "ap2", ragioneSociale: "Officina Meccanica Sud snc", partitaIva: "0000000002",
      attivita: "Manutenzione mezzi e frantoio", referente: "—", telefono: "", attivo: true },
    { id: "ap3", ragioneSociale: "Perforazioni Rocca srl", partitaIva: "0000000003",
      attivita: "Perforazione e volate", referente: "—", telefono: "", attivo: true },
  ],
  /* GLI APPALTI. Ogni riga è uno degli esiti che il modulo deve saper dire, e
     nessuna è di riempimento:
     · pa1 — tutto in ordine, in cava: DSS coordinato redatto, datato e
       SOTTOSCRITTO dall'impresa (art. 9 c.2 D.Lgs 624/96);
     · pa2 — ⛔ LA RIGA PER CUI ESISTE QUESTO MODULO. Sulla carta è impeccabile:
       DSS coordinato redatto, datato, sottoscritto, costi da interferenze
       indicati. Ma l'impresa che perfora col rischio di atmosfere esplosive
       **non è mai stata verificata** — nessun documento, nemmeno il camerale.
       L'esito NON è «a posto» e non è «da sistemare»: è **non verificato**, e
       si legge diverso dagli altri due. Un semaforo verde qui sarebbe la cosa
       peggiore che questa schermata possa fare, perché è quella che si mostra
       a un ispettore;
     · pa3 — fuori cava, e la durata in uomini-giorno **non è stata scritta**:
       non è un appalto esente, è un appalto su cui non si può decidere. È il
       caso per cui `duvriDovuto` ha tre risposte invece di due, e senza questa
       riga la dimostrazione non lo mostrerebbe mai;
     · pa4 — in cava, DSS coordinato redatto ma **mai sottoscritto**: senza la
       firma l'appaltatore non è responsabile della parte di sua competenza. */
  appalti: [
    { id: "pa1", appaltatoreId: "ap1", cantiereId: "k1", oggetto: "Trasporto inerti al piazzale",
      dataInizio: "2026-02-01", uominiGiorno: 120, natura: "", rischiValutati: true, rischiParticolari: [],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-01-28", coordSottoscritto: true,
      costiSicurezza: 1400, stato: "attivo" },
    { id: "pa2", appaltatoreId: "ap3", cantiereId: "k1", oggetto: "Perforazione fronte Est",
      dataInizio: "2026-06-15", uominiGiorno: 24, natura: "", rischiValutati: true, rischiParticolari: ["esplosive"],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-06-10", coordSottoscritto: true,
      costiSicurezza: 2200, stato: "attivo" },
    { id: "pa3", appaltatoreId: "ap2", cantiereId: "k2", oggetto: "Revisione impianto di frantumazione",
      dataInizio: "2026-07-20", uominiGiorno: null, natura: "", rischiValutati: false, rischiParticolari: [],
      coordRedattore: "", coordData: null, coordSottoscritto: false,
      costiSicurezza: null, stato: "attivo" },
    { id: "pa4", appaltatoreId: "ap1", cantiereId: "k1", oggetto: "Trasporto materiale di ripristino",
      dataInizio: "2026-07-01", uominiGiorno: 18, natura: "", rischiValutati: true, rischiParticolari: [],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-06-25", coordSottoscritto: false,
      costiSicurezza: 300, stato: "attivo" },
  ],
  infortuni: [
    { id: "i1", data: "2026-05-18", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Est", luogoTipo: "fronte", categoria: "caduta-massi", descrizione: "Caduta massi vicino al perforatore, nessun ferito" },
    { id: "i2", data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, luogo: "officina", luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },
    { id: "i3", data: "2026-06-24", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista principale", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, descrizione: "Dumper e pick-up incrociati in curva con poca visibilità" },
    { id: "i4", data: "2026-07-06", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Nord", luogoTipo: "fronte", categoria: "caduta-massi", rapida: true, descrizione: "Blocco staccato dal ciglio durante il disgaggio" },
    { id: "i5", data: "2026-07-15", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "impianto", luogoTipo: "impianto", categoria: "impianto", rapida: true, descrizione: "Riparo del nastro 3 trovato aperto a macchina ferma" },
    { id: "i6", data: "2026-07-21", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista di risalita", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, descrizione: "Pietra caduta dal cassone su tratto di pista con arginello basso" },
    // i7 sta in un ANNO PRECEDENTE di proposito: senza almeno due anni non
    // esiste un andamento da mostrare, e la dimostrazione deve contenere il
    // caso per cui la schermata è stata costruita.
    { id: "i7", data: "2025-09-12", tipo: "infortunio", gravita: "lieve", giorniAssenza: 12, luogo: "impianto", luogoTipo: "impianto", descrizione: "Contusione a un piede durante lo sblocco di un nastro" },
    /* ⛔ UN INFORTUNIO CON LA PROGNOSI ANCORA APERTA — decisione 17 del
       fondatore, 02/08. `giorniAssenza` è `null` di proposito, e non è un
       refuso: è lo stato in cui un infortunio si trova nei giorni in cui viene
       registrato, cioè quello per cui la difesa esiste. Senza questa riga la
       dimostrazione non poteva contenere il caso — come la fattura senza
       scadenza in Conti — e le frasi «almeno N giornate perse» e «indice di
       gravità (minimo)» sarebbero state codice morto. */
    { id: "i8", data: "2026-07-28", tipo: "infortunio", gravita: "lieve", giorniAssenza: null, luogo: "piazzale 2", luogoTipo: "piazzale", descrizione: "Distorsione alla caviglia scendendo dalla cabina del dumper — prognosi ancora aperta" },
  ],
  /* LE ORE LAVORATE, ANNO PER ANNO — il denominatore dei tre indici.
     ⛔ Il 2026 NON c'è, ed è la parte più importante della dimostrazione: è
     l'anno in corso, ha un infortunio registrato (i2) e non ha le ore. Così si
     vede quello che questa schermata serve a non far succedere — l'indice che
     manca proprio nell'anno in cui è appena successo qualcosa — invece di un
     grafico tutto verde che non insegna niente. Il 2024 è a zero infortuni con
     le ore note: quello è uno zero VERO, e si distingue dal buco del 2026. */
  oreAnno: [
    { id: "o1", anno: 2024, ore: 21500 },
    { id: "o2", anno: 2025, ore: 22100 },
  ],
  azioni: [
    { id: "a1", descrizione: "Disgaggio del fronte Est e ripristino della fascia di rispetto a valle", responsabileId: "d3", scadenza: "2026-07-31", stato: "in-corso", origineTipo: "evento", origineId: "i1" },
    { id: "a2", descrizione: "Consegna guanti antitaglio e addestramento agli addetti officina", responsabileId: "d7", scadenza: "2026-03-15", stato: "chiusa", esito: "Guanti consegnati e addestramento registrato", dataChiusura: "2026-03-12", origineTipo: "evento", origineId: "i2" },
    { id: "a3", descrizione: "Ripristinare la segnaletica di viabilità sulla pista principale", responsabileId: null, scadenza: "2026-06-30", stato: "aperta", origineTipo: "nc", origineNota: "Non conformità rilevata durante il giro di sorveglianza" },
    { id: "a4", descrizione: "Delimitare la fascia di rispetto al ciglio del fronte Nord", responsabileId: "d3", scadenza: "2026-08-09", stato: "aperta", origineTipo: "ispezione", origineId: "q1", origineVoce: "v2", origineNota: "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi" },
  ],
  // L'ANALISI DELLA CAUSA di due eventi su sei. Sono DUE di proposito, e non
  // cinque: `causeRicorrenti` risponde `leggibile: false` sotto MIN_TENDENZA, e
  // la dimostrazione deve far vedere proprio quella risposta — «sono stati
  // analizzati due eventi su sei, su così pochi non si legge nessuna
  // ricorrenza» — invece di una tendenza disegnata su due punti. Chi guarda la
  // dimostrazione vede il lavoro che manca, che è il punto della funzione.
  // Nessuna delle due catene finisce su una persona: sono l'esempio di come
  // vanno scritte, e il primo perché è la descrizione di quello che è successo.
  analisi: [
    { id: "an1", eventoId: "i1",
      perche: [
        "Un masso si è staccato dal fronte Est mentre si perforava sotto",
        "Sul ciglio era rimasto materiale sciolto dopo l'ultima volata",
        "La fascia di rispetto a valle non era delimitata",
        "La delimitazione non è prevista nel giro di sorveglianza",
      ],
      causa: "organizzativa", fatta: "2026-05-20", daChi: "d3", azioniId: ["a1"] },
    { id: "an2", eventoId: "i2",
      perche: [
        "Taglio alla mano su una lamiera durante una manutenzione",
        "I guanti in uso in officina non erano antitaglio",
        "In magazzino c'erano solo guanti da carico generico",
      ],
      causa: "dpi", fatta: "2026-02-05", daChi: "d7", azioniId: ["a2"] },
  ],
  ispezioni: [
    { id: "q1", modello: "fronte", nome: "Fronte di cava — stabilità e disgaggio", ambito: "Fronti",
      riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: stabilità dei fronti, caduta massi e franamento; alimenta la relazione annuale di stabilità.",
      periodicitaGiorni: 30, data: "2026-07-10", cantiereId: "k1", responsabileId: "d3",
      voci: [
        { id: "v1", testo: "Ciglio superiore libero da massi instabili e materiale sciolto" },
        { id: "v2", testo: "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi" },
        { id: "v3", testo: "Nessun blocco in equilibrio precario sulla parete" },
        { id: "v4", testo: "Altezza e pendenza dei gradoni come previsto nel DSS" },
        { id: "v5", testo: "Unghia del fronte libera da accumuli che ostacolano il lavoro" },
        { id: "v6", testo: "Nessuna fessura di trazione, venuta d'acqua o segno di movimento" },
        { id: "v7", testo: "Disgaggio eseguito dopo l'ultima volata e dopo le piogge forti" },
        { id: "v8", testo: "Accessi al fronte sbarrati e segnalati quando l'area non è operativa" },
      ],
      esiti: {
        v1: { esito: "conforme", nota: "" },
        v2: { esito: "non-conforme", nota: "Delimitazione rimossa durante l'ultimo sbancamento" },
        v3: { esito: "conforme", nota: "" }, v4: { esito: "conforme", nota: "" },
        v5: { esito: "conforme", nota: "" }, v6: { esito: "conforme", nota: "" },
        v7: { esito: "conforme", nota: "" }, v8: { esito: "na", nota: "Area operativa in continuo" },
      },
      stato: "completata", dataChiusura: "2026-07-10" },
    { id: "q2", modello: "piste", nome: "Piste e viabilità interna", ambito: "Piste",
      riferimento: "D.Lgs 81/08 titolo I e D.Lgs 624/96 — circolazione dei mezzi in sicurezza nei luoghi di lavoro.",
      periodicitaGiorni: 15, data: "2026-07-28", cantiereId: "k1", responsabileId: "d3",
      voci: [
        { id: "v1", testo: "Larghezza della pista adeguata al mezzo più grande in uso" },
        { id: "v2", testo: "Arginelli sui lati esposti presenti e integri" },
        { id: "v3", testo: "Fondo e pendenza in ordine, senza solchi o cedimenti" },
        { id: "v4", testo: "Segnaletica, limiti di velocità e precedenze visibili" },
        { id: "v5", testo: "Abbattimento delle polveri (bagnatura) eseguito" },
        { id: "v6", testo: "Incroci e punti ciechi con visibilità garantita" },
        { id: "v7", testo: "Aree di manovra, carico e scarico delimitate" },
        { id: "v8", testo: "Illuminazione sufficiente nei tratti usati con poca luce" },
      ],
      esiti: { v1: { esito: "conforme", nota: "" }, v2: { esito: "conforme", nota: "" } },
      stato: "in-corso", dataChiusura: null },
    /* ⛔ UNA ISPEZIONE DICHIARATA CHIUSA CON META' DELLE VOCI IN BIANCO. È il
       caso per cui esiste «Chiusa a metà»: zero non conformi su una checklist
       guardata a metà non è un buon risultato, è un risultato che non è stato
       misurato — e senza questa riga nella dimostrazione comparivano solo
       «Completata» (verde) e «In corso». La difesa c'era e non si vedeva. */
    { id: "q3", modello: "impianto", nome: "Impianto di lavorazione", ambito: "Frantoio e nastri",
      riferimento: "D.Lgs 81/08 titolo III — protezione degli organi in movimento e uso in sicurezza delle attrezzature.",
      periodicitaGiorni: 30, data: "2026-07-22", cantiereId: "k1", responsabileId: "d6",
      voci: [
        { id: "v1", testo: "Ripari fissi e mobili su pulegge, nastri e organi in movimento" },
        { id: "v2", testo: "Funi e pulsanti di emergenza dei nastri funzionanti e raggiungibili" },
        { id: "v3", testo: "Blocco della macchina in manutenzione (procedura di messa fuori servizio)" },
        { id: "v4", testo: "Passerelle, scale e parapetti integri e sgombri" },
        { id: "v5", testo: "Aspirazione e abbattimento polveri in funzione" },
        { id: "v6", testo: "Quadri elettrici chiusi, accessibili e senza cavi volanti" },
        { id: "v7", testo: "Nessun accumulo di materiale sotto nastri e tramogge" },
        { id: "v8", testo: "Accesso a tramogge e spazi confinati regolato da permesso di lavoro" },
      ],
      esiti: {
        v1: { esito: "conforme", nota: "" },
        v2: { esito: "conforme", nota: "" },
        v3: { esito: "conforme", nota: "" },
      },
      stato: "completata", dataChiusura: "2026-07-22" },
  ],
  mansioni: [
    { id: "n1", nome: "Escavatorista / palista",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "guanti"],
      lavoratoriIds: ["d2"] },
    { id: "n2", nome: "Fochino",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "fochino"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "occhiali", "guanti"],
      lavoratoriIds: ["d1", "d6"] },
    { id: "n3", nome: "Preposto di cava",
      requisiti: ["sorv-sanitaria", "form-generale", "form-preposto"],
      dpi: ["elmetto", "scarpe", "gilet"],
      lavoratoriIds: ["d3"] },
    { id: "n4", nome: "Autista dumper / camion",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
      dpi: ["elmetto", "scarpe", "gilet", "guanti"],
      lavoratoriIds: ["d5"] },
    /* ⛔ UNA MANSIONE DI CUI NESSUNO HA SCRITTO I REQUISITI — decisione 13 del
       fondatore, 02/08. È il caso normale di una mansione appena creata: c'è
       il nome, c'è la persona, e i corsi non li ha ancora messi nessuno. Fino
       a quel giorno la matrice rispondeva «può andare» in verde; adesso
       risponde «non lo sappiamo», e la dimostrazione deve contenere la riga
       per cui la quarta risposta esiste. `nessunRequisito` NON è dichiarato:
       è proprio quella dichiarazione che manca. */
    { id: "n5", nome: "Ufficio e pesa",
      requisiti: [],
      dpi: ["gilet", "scarpe"],
      lavoratoriIds: ["d4"] },
  ],
  nomine: [
    { id: "o1", ruolo: "sorvegliante", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "Turno unico, tutta la cava" },
    { id: "o2", ruolo: "preposto", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "" },
    { id: "o3", ruolo: "rspp", lavoratoreId: "d7", dal: "2024-09-16", al: null, note: "Incarico esterno" },
    { id: "o4", ruolo: "primo-soccorso", lavoratoreId: "d5", dal: "2025-04-14", al: null, note: "" },
    { id: "o5", ruolo: "antincendio", lavoratoreId: "d2", dal: "2025-04-14", al: null, note: "" },
    { id: "o6", ruolo: "rls", lavoratoreId: "d5", dal: "2024-11-08", al: null, note: "Eletto dai lavoratori" },
    /* ⛔ UNA NOMINA SENZA LA DATA DA CUI DECORRE: la persona c'è, ma davanti a
       un ispettore non si dimostra da quando. `organigrammaSicurezza` la conta
       in `senzaData` e la pagina la scrive in giallo — ma con tutte e sei le
       nomine datate quel ramo non si accendeva mai, e la difesa restava
       invisibile.
       ⚠️ Va su un ruolo SENZA requisito di formazione, e non a caso: nella
       pastiglia i due rossi della formazione vengono PRIMA di «Senza data di
       nomina», quindi su `preposto` — dove in dimostrazione nessuno ha il
       corso — si sarebbe visto «Formazione non registrata» e questa riga non
       avrebbe mostrato quello per cui esiste. E il rosso «Da nominare» non si
       perde: resta acceso su `medico`. */
    { id: "o7", ruolo: "direttore", lavoratoreId: "d3", dal: null, al: null, note: "Da registro cartaceo: data di decorrenza non riportata" },
  ],
  dpi: [
    { id: "e1", lavoratoreId: "d1", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2031-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e2", lavoratoreId: "d1", tipo: "scarpe", modello: "", taglia: "43", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e3", lavoratoreId: "d1", tipo: "otoprotettori", modello: "cuffie", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2027-01-12", addestramento: true, dataAddestramento: "2026-01-12", note: "" },
    { id: "e4", lavoratoreId: "d2", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2025-06-02", scadenza: "2030-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e5", lavoratoreId: "d2", tipo: "otoprotettori", modello: "inserti", taglia: "unica", dataConsegna: "2025-06-02", scadenza: "2026-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e6", lavoratoreId: "d3", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-03-09", scadenza: "2031-03-09", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e7", lavoratoreId: "d5", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-04-20", scadenza: "2031-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e8", lavoratoreId: "d5", tipo: "scarpe", modello: "", taglia: "44", dataConsegna: "2026-04-20", scadenza: "2028-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e9", lavoratoreId: "d5", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2026-04-20", scadenza: "2028-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e10", lavoratoreId: "d5", tipo: "guanti", modello: "", taglia: "9", dataConsegna: "2026-04-20", scadenza: "2027-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e11", lavoratoreId: "d1", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e12", lavoratoreId: "d1", tipo: "occhiali", modello: "", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e13", lavoratoreId: "d1", tipo: "guanti", modello: "", taglia: "10", dataConsegna: "2026-01-12", scadenza: "2027-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e14", lavoratoreId: "d6", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2031-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e15", lavoratoreId: "d6", tipo: "scarpe", modello: "", taglia: "45", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e16", lavoratoreId: "d6", tipo: "gilet", modello: "", taglia: "XL", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e17", lavoratoreId: "d6", tipo: "otoprotettori", modello: "cuffie", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2027-02-24", addestramento: true, dataAddestramento: "2026-02-24", note: "" },
    { id: "e18", lavoratoreId: "d6", tipo: "occhiali", modello: "", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e19", lavoratoreId: "d6", tipo: "guanti", modello: "", taglia: "10", dataConsegna: "2026-02-24", scadenza: "2027-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e20", lavoratoreId: "d2", tipo: "scarpe", modello: "", taglia: "43", dataConsegna: "2025-06-02", scadenza: "2027-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e21", lavoratoreId: "d2", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2025-06-02", scadenza: "2027-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e22", lavoratoreId: "d2", tipo: "guanti", modello: "", taglia: "9", dataConsegna: "2026-05-11", scadenza: "2027-05-11", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e23", lavoratoreId: "d3", tipo: "scarpe", modello: "", taglia: "38", dataConsegna: "2026-03-09", scadenza: "2028-03-09", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e24", lavoratoreId: "d3", tipo: "gilet", modello: "", taglia: "M", dataConsegna: "2026-03-09", scadenza: "2028-03-09", addestramento: false, dataAddestramento: null, note: "" },
    /* ⛔ QUESTA CONSEGNA ACCENDE DUE COSE CHE NESSUNO POTEVA VEDERE. Un DPI di
       III categoria consegnato e in corso di validità, ma con l'addestramento
       (art. 77 D.Lgs 81/08) mai registrato: è un'ASSENZA, e un'assenza nella
       dimostrazione è una cosa che il prodotto sa raccontare.
       Prima non c'era: le uniche due consegne di otoprotettori con
       addestramento richiesto lo avevano registrato, e la terza (Luca Bianchi)
       è **anche** scaduta — quindi la sua riga porta due motivi, la pastiglia
       dice «Da sostituire» e il bottone «Addestrato» non compare, perché si
       accende solo quando l'addestramento è l'UNICA cosa che manca. Risultato:
       la pastiglia «Addestramento» e quel bottone erano codice morto in
       dimostrazione.
       E accende anche il secondo giro di `allarmiDpi`, quello che pesca gli
       addestramenti FUORI dalle mansioni: l'autista dumper non ha gli
       otoprotettori fra i DPI della sua mansione, e il commento di quel giro
       dice esattamente perché va segnalato lo stesso. */
    { id: "e25", lavoratoreId: "d5", tipo: "otoprotettori", modello: "inserti", taglia: "unica", dataConsegna: "2026-05-18", scadenza: "2029-05-18", addestramento: false, dataAddestramento: null, note: "" },
    /* ⛔ LE DUE CONSEGNE SENZA DATA DI SOSTITUZIONE, E SONO DUE COSE DIVERSE —
       decisione 14 del fondatore, 02/08. Prima del 02/08 sarebbero state tutte
       e due VERDI, e nella tabella la data si sarebbe letta «—» per
       tutt'e due: la stessa faccia tranquilla per una risposta e per una
       domanda aperta.
       · e26: gli indumenti da lavoro non hanno una vita utile — il catalogo
         per loro non sa nemmeno proporre una data (`mesi: null`) — e qualcuno
         lo ha DICHIARATO. Quello è verde, ed è una risposta misurata.
       · e27: un facciale filtrante contro la silice, di III categoria, con la
         casella svuotata. Nessuno ha detto entro quando va sostituito: è
         giallo, e sta nel registro perché è il caso su cui il fondatore ha
         detto che «non lo sappiamo» pesa. L'addestramento è registrato di
         proposito, così l'unica cosa che manca è la data. */
    { id: "e26", lavoratoreId: "d3", tipo: "indumenti", modello: "", taglia: "M", dataConsegna: "2026-03-09", scadenza: null, nonScade: true, addestramento: false, dataAddestramento: null, note: "Vestiario: nessuna scadenza dichiarata dal costruttore" },
    { id: "e27", lavoratoreId: "d1", tipo: "maschera", modello: "FFP3", taglia: "unica", dataConsegna: "2026-06-15", scadenza: null, addestramento: true, dataAddestramento: "2026-06-15", note: "" },
  ],
};

/* Tipi di documento HSE gestiti (base normativa: D.Lgs 81/08; per le cave il
   documento di valutazione specifico è il DSS ex D.Lgs 624/96 art. 6/10,
   da inviare all'ASL prima dell'avvio; il POS riguarda i cantieri edili
   in cui l'azienda opera come impresa esecutrice — D.Lgs 81/08 art. 89). */
export const TIPI_DOCUMENTO = [
  "DSS", "POS", "DVR", "DUVRI", "Nomina", "Verbale DPI",
  "Idoneità sanitaria", "Attestato formazione", "Altro",
];

// LA SOGLIA DELLE SCADENZE ORA SERVE A DUE APP — Scudo per il suo scadenzario e
// Campo per sapere se chi è in turno ha i documenti in corso — quindi vive in
// `shared/dw-ponti.js` e qui si RI-ESPORTA col nome con cui l'ha sempre chiamata
// questa app. Un alias non è una seconda implementazione: due copie uguali oggi
// divergono domani senza che nessuno lo veda, ed è già costato una giornata con
// la convenzione sui numeri.
// Nota tecnica, imparata rompendo tutto: `export { x } from "..."` NON crea un
// nome locale, quindi le trenta chiamate interne a `statoScadenza` di questo file
// restavano scoperte — dieci prove rosse subito, che è il comportamento giusto
// della suite. Serve importare e poi ri-esportare il nome.
import { statoScadenzaHSE } from "../../shared/dw-ponti.js";
import { dataPiuGiorni as dataPiuGiorniShell } from "../../shared/deepwork-id-client/dw-shell.js";
const statoScadenza = statoScadenzaHSE;
export { statoScadenza };

// Giudizio di IDONEITÀ SANITARIA (D.Lgs 81/2008 art. 41): esito della
// sorveglianza sanitaria per la mansione. La data della prossima visita
// resta nella scadenza "Visita medica"; qui si registra l'ESITO.
// Stati: "" = non definito, "idoneo", "prescrizioni" (idoneo con
// limitazioni), "non-idoneo".
export function idoneitaLabel(stato) {
  switch (stato) {
    case "idoneo":       return { cls: "ok",     label: "Idoneo" };
    case "prescrizioni": return { cls: "warn",   label: "Idoneo c/prescriz." };
    case "non-idoneo":   return { cls: "danger", label: "NON idoneo" };
    default:             return { cls: "",       label: "Idoneità n.d." };
  }
}
// Ciclo per il tap sul badge: n.d. → idoneo → prescrizioni → non-idoneo → n.d.
export function idoneitaSuccessivo(stato) {
  const seq = ["", "idoneo", "prescrizioni", "non-idoneo"];
  const i = seq.indexOf(seq.includes(stato) ? stato : "");
  return seq[(i + 1) % seq.length];
}
// Lavoratori attivi la cui idoneità richiede attenzione (per le urgenze).
export function idoneitaCriticita(lavoratori) {
  return lavoratori.filter(l => l.attivo && (l.idoneita === "non-idoneo" || l.idoneita === "prescrizioni"));
}

// Livello di urgenza FINE di una scadenza, per un'etichetta parlante nel
// scadenzario (oltre al badge grezzo di statoScadenza). Fasce ispirate ai
// promemoria multi-soglia (60/30/15/7/1 gg): rosso se scaduta o entro 7 gg,
// giallo entro 30, verde oltre. Additiva: NON tocca statoScadenza (che
// alimenta i KPI). Ritorna { cls, label, giorni } (giorni null se data
// mancante, così un dato incompleto non allarma).
// ⛔ «senza data» NON è verde (corretto il 03/08). Diceva già la parola
// giusta — ed è la stessa che usano Flotta e Terra — ma con `cls: "ok"`, cioè
// col colore di chi è a posto. Una data che non si può leggere è un avviso:
// stesso criterio di `statoRigaProgramma` in Sentinella, che sul «mai
// misurato» scrive «è un avviso e non un allarme».
// Nessuno dei cinque punti di chiamata passa una data assente per davvero
// (misurato): ci si arriva con una data ROTTA, e allora il giallo è giusto.
export function livelloScadenza(dataISO, oggi = new Date()) {
  if (!dataISO) return { cls: "warn", label: "senza data", giorni: null };
  const g = giorniTra(dataISO, oggi);
  if (isNaN(g)) return { cls: "warn", label: "senza data", giorni: null };
  if (g < 0)  return { cls: "danger", label: "scaduta da " + (-g) + " gg", giorni: g };
  if (g === 0) return { cls: "danger", label: "scade oggi", giorni: 0 };
  if (g <= 7)  return { cls: "danger", label: "tra " + g + " gg", giorni: g };
  if (g <= 30) return { cls: "warn",   label: "tra " + g + " gg", giorni: g };
  return { cls: "ok", label: "tra " + g + " gg", giorni: g };
}

// Data GG/MM/AAAA da ISO (formattazione pura, per i testi da inviare).
function dataIt(iso) {
  const s = String(iso || "").slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || "—");
}

// Testo PRONTO di un promemoria/convocazione per il lavoratore la cui scadenza
// (visita medica, corso, patentino…) è scaduta o in scadenza, da copiare e
// inviare (email/SMS). Serve al responsabile sicurezza a sollecitare il
// rinnovo senza riscrivere ogni volta. Ritorna null se non c'è nulla di
// urgente (scadenza regolare), se manca il nome del lavoratore o la data.
// Pura e testabile: nessun DOM, `oggi` iniettabile.
export function testoPromemoria(scadenza, lavoratore, oggi = new Date()) {
  const sc = scadenza || {};
  const nome = ((lavoratore && lavoratore.nome) || "").trim();
  if (!nome || !sc.dataScadenza) return null;
  const st = statoScadenza(sc.dataScadenza, oggi);
  if (st === "regolare") return null;                 // niente di urgente da sollecitare
  const g = giorniTra(sc.dataScadenza, oggi);
  const tipo = (sc.tipo || "adempimento").trim() || "adempimento";
  const cosa = (sc.descrizione || sc.tipo || "adempimento").trim() || "adempimento";
  const quando = st === "scaduta"
    ? `risulta SCADUTA dal ${dataIt(sc.dataScadenza)} (${-g} giorni fa)`
    : g === 0
      ? `scade OGGI, ${dataIt(sc.dataScadenza)}`
      : `scade il ${dataIt(sc.dataScadenza)} (tra ${g} ${g === 1 ? "giorno" : "giorni"})`;
  return [
    `Oggetto: promemoria scadenza — ${tipo}`,
    ``,
    `Gentile ${nome},`,
    `ti ricordiamo che «${cosa}» ${quando}.`,
    `Ti chiediamo di contattare l'ufficio per programmare il rinnovo il prima possibile, così da mantenere la tua idoneità al lavoro in cava.`,
    `Grazie per la collaborazione.`,
  ].join("\n");
}

// Registro infortuni e near-miss: riepilogo per il "cartellone sicurezza".
// La metrica di testa è i GIORNI SENZA INFORTUNI (giorni dall'ultimo infortunio
// VERO — i near-miss non azzerano il contatore, ma si contano a parte perché
// segnalano i rischi prima che diventino infortuni). Più: numero infortuni,
// di cui gravi, near-miss, e giorni di assenza totali. `giorniSenza` è null se
// non c'è nessun infortunio registrato (nessuna data da cui contare). Pura e
// testabile; `oggi` iniettabile.
// ⛔ LE GIORNATE PERSE DI UN INFORTUNIO A PROGNOSI APERTA NON SONO ZERO —
// decisione 17 del fondatore, 02/08.
// Fino a quel giorno il campo «giorni di assenza» lasciato vuoto valeva `0`
// dappertutto (`+x.giorniAssenza || 0`), e la ragione scritta il 31/07 era
// buona: in un **near-miss** la colonna vuota vuol dire davvero «nessuna
// assenza», ed è il caso normale. Quella ragione però non copre l'infortunio
// registrato mentre la **prognosi è ancora aperta**: lì i giorni non si sanno
// *ancora*. Misurato su un anno da 20.000 ore, con un infortunio da 12 giorni
// già a registro: aggiungendone uno a prognosi aperta la frequenza saliva da
// 50 a 100 — giusto, l'infortunio c'è stato — ma la **gravità restava 0,6** e
// il LTIFR **50**. Cioè l'app diceva «un infortunio in più che non è costato
// nemmeno una giornata», che è esattamente quello che ancora non si sa.
//
// La distinzione è la stessa già usata per la base d'asta di una gara in Conti:
// **il vuoto resta vuoto, lo zero scritto apposta resta zero**. E dipende dal
// tipo, perché il vuoto vuol dire due cose diverse:
//   · near-miss  → nessuna assenza, cioè 0. (La ragione del 31/07, intatta.)
//   · infortunio → `null`, prognosi ancora aperta.
// Torna `null` anche per un valore illeggibile: «non si sa» copre tutt'e due, e
// l'unica risposta che non deve mai uscire da qui è uno zero non misurato.
export function giornateAssenza(evento) {
  const e = evento || {};
  const g = e.giorniAssenza;
  const vuoto = g === null || g === undefined || (typeof g === "string" && g.trim() === "");
  if (e.tipo !== "infortunio") return vuoto ? 0 : Math.max(0, +g || 0);
  if (vuoto) return null;
  /* ⚠️ Il vuoto si controlla PRIMA di convertire, e non è pignoleria: `+null`
     fa `0` e `Number.isFinite(0)` risponde `true` — è lo stesso tranello che
     il 05/08 faceva rispondere «0%» ad `avanzamentoLotto` per un lotto che
     nessuno aveva mai misurato. */
  const n = +g;
  return Number.isFinite(n) ? Math.max(0, n) : null;
}
// Un infortunio le cui giornate perse non sono ancora scritte. I near-miss non
// ci finiscono mai: per loro il vuoto è una risposta, non una domanda aperta.
export function prognosiAperta(evento) {
  return !!(evento && evento.tipo === "infortunio") && giornateAssenza(evento) === null;
}

export function riepilogoInfortuni(infortuni, oggi = new Date()) {
  const list = infortuni || [];
  const veri = list.filter(x => x.tipo === "infortunio");
  const nearMiss = list.filter(x => x.tipo === "near-miss");
  let ultimo = null;
  for (const x of veri) {
    const d = (x.data || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!ultimo || d > ultimo)) ultimo = d;
  }
  const giorniSenza = ultimo ? Math.max(0, -giorniTra(ultimo, oggi)) : null;
  const giorniAssenzaTot = veri.reduce((s, x) => s + (giornateAssenza(x) || 0), 0);
  const prognosiAperte = veri.filter(prognosiAperta).length;
  const gravi = veri.filter(x => x.gravita === "grave").length;
  return { infortuni: veri.length, nearMiss: nearMiss.length, gravi, giorniSenza, ultimo,
    giorniAssenzaTot, prognosiAperte,
    /* bandiera: le giornate perse sono TUTTE scritte. Quando è falsa
       `giorniAssenzaTot` è un MINIMO, e chi lo disegna deve dirlo — se no il
       totale si legge come un consuntivo, che è il verso in cui rassicura. */
    noto: prognosiAperte === 0 };
}

/* La frase che accompagna il totale delle giornate perse. Sta qui e non nella
   pagina per la stessa ragione di `descriviCartella`: quello che un numero
   dichiara è una REGOLA, e a scriverla dev'essere uno solo. È anche la lettura
   della bandiera `noto` — che altrimenti sarebbe una guardia scollegata. */
export function descriviGiornatePerse(r) {
  const x = r || {};
  const g = +x.giorniAssenzaTot || 0;
  if (x.noto !== false) return g === 1 ? "1 giornata persa" : g + " giornate perse";
  const n = +x.prognosiAperte || 0;
  return "almeno " + g + (g === 1 ? " giornata persa" : " giornate perse") + ": "
    + (n === 1 ? "di un infortunio la prognosi è ancora aperta" : "di " + n + " infortuni la prognosi è ancora aperta")
    + ", le sue giornate non sono ancora contate";
}

// ============================================================
// AZIONI CORRETTIVE (CAPA)
// Da un evento (infortunio o near-miss) o da una non conformità nasce
// un'azione: cosa fare, chi la fa, entro quando, com'è finita. Chiude il
// cerchio "segnala → correggi → verifica" ed è ciò che la L. 198/2025
// chiede di tracciare insieme agli eventi (eventi *e azioni correttive*).
// Lo stato AVANZAMENTO si salva (aperta → in corso → chiusa), mentre il
// semaforo della SCADENZA resta CALCOLATO dalla data, con lo stesso schema
// già usato dallo scadenzario (statoScadenza/livelloScadenza): nessun dato
// derivato nel database.
// ============================================================

// Etichetta dell'avanzamento (non del semaforo: quello viene dalla data).
export function azioneLabel(stato) {
  switch (stato) {
    case "in-corso": return { cls: "warn", label: "In corso" };
    case "chiusa":   return { cls: "ok",   label: "Chiusa" };
    default:         return { cls: "danger", label: "Aperta" };
  }
}
// Ciclo per il tap sul badge: aperta → in corso → chiusa → aperta.
export function azioneStatoSuccessivo(stato) {
  const seq = ["aperta", "in-corso", "chiusa"];
  const i = seq.indexOf(seq.includes(stato) ? stato : "aperta");
  return seq[(i + 1) % seq.length];
}
// Semaforo di un'azione, con lo STESSO schema delle scadenze: un'azione
// chiusa è sempre "regolare" (non scade più), le altre seguono la data.
// Ritorna "scaduta" | "in-scadenza" | "regolare".
/* ⛔ «SENZA DATA» NON È «REGOLARE» (corretto il 04/08). La riga diceva «senza
   data non allarma», ed era la stessa scorciatoia già corretta in
   `livelloScadenza` il 03/08: un'azione correttiva aperta di cui nessuno ha
   scritto l'entro-quando usciva verde come una in perfetto orario. Non allarma
   è giusto — è un avviso, non un allarme — ma la parola giusta esiste già e la
   dice `statoScadenza`: «senza data», gialla, ed è la stessa che usano Flotta e
   Terra. I due form dell'app (Scudo e il ponte di Sentinella) la data la
   pretendono: ci si arriva con un import o con un dato vecchio. */
export function statoAzione(azione, oggi = new Date()) {
  const a = azione || {};
  if (a.stato === "chiusa") return "regolare";
  return statoScadenza(a.scadenza, oggi);
}
// Azioni ancora da chiudere che sono scadute o in scadenza: sono quelle che
// devono entrare nel semaforo del Quadro e nello scadenzario, prima le più
// urgenti. Pura e testabile; `oggi` iniettabile.
export function azioniUrgenti(azioni, oggi = new Date()) {
  return (azioni || [])
    .filter(a => a.stato !== "chiusa" && a.scadenza && statoAzione(a, oggi) !== "regolare")
    .sort((a, b) => (a.scadenza < b.scadenza ? -1 : a.scadenza > b.scadenza ? 1 : 0));
}
// Riepilogo per la testata della pagina Azioni e per i KPI del Quadro.
export function riepilogoAzioni(azioni, oggi = new Date()) {
  const list = azioni || [];
  const aperte = list.filter(a => a.stato !== "chiusa");
  const scadute = aperte.filter(a => statoAzione(a, oggi) === "scaduta").length;
  const inScadenza = aperte.filter(a => statoAzione(a, oggi) === "in-scadenza").length;
  return {
    totale: list.length,
    aperte: list.filter(a => (a.stato || "aperta") === "aperta").length,
    inCorso: list.filter(a => a.stato === "in-corso").length,
    chiuse: list.filter(a => a.stato === "chiusa").length,
    daChiudere: aperte.length, scadute, inScadenza,
  };
}
// Azioni generate da un evento del registro (per risalire evento → azioni).
export function azioniDiEvento(azioni, eventoId) {
  if (!eventoId) return [];
  return (azioni || []).filter(a => a.origineTipo === "evento" && a.origineId === eventoId);
}
// Azioni nate dalle voci non conformi di un'ispezione (ispezione → azioni).
export function azioniDiIspezione(azioni, ispezioneId) {
  if (!ispezioneId) return [];
  return (azioni || []).filter(a => a.origineTipo === "ispezione" && a.origineId === ispezioneId);
}

// ── Azioni che arrivano dall'AMBIENTE (Sentinella) ────────────────────
// Un superamento di soglia o il reclamo di un residente non sono un
// problema "di un'altra app": chiedono un responsabile e una data come
// ogni altra azione correttiva, e vivono nello stesso scadenzario. Queste
// due funzioni servono solo a RICONOSCERLE, per scrivere l'origine giusta
// e per non farla cancellare da una modifica fatta dal form.
export const ORIGINI_AMBIENTE = ["superamento", "reclamo"];
export function daAmbiente(a) {
  return ORIGINI_AMBIENTE.includes(String((a || {}).origineTipo || ""));
}
// Etichetta breve dell'origine ambientale, per il badge nell'elenco.
export function etichettaAmbiente(a) {
  return (a || {}).origineTipo === "reclamo" ? "Reclamo" : "Superamento";
}
// ── Azioni che arrivano dalla PRODUZIONE (Campo) ──────────────────────
// Un fermo di produzione registrato al fronte — «frantoio intasato, 55 minuti»
// — chiede un responsabile e una data come ogni altra azione correttiva, e
// vive nello stesso scadenzario. È il gemello del ponte con Sentinella, e la
// ragione per cui questa provenienza esiste è che senza di lei Scudo la
// raccontava come una NON CONFORMITÀ: la riga cadeva nell'ultimo ramo di
// `origineTesto`, e un fermo di macchina non è una non conformità.
// ⚠️ La parola è scritta anche qui perché Scudo non può importare il modulo di
// Campo (l'isolamento dello SDK è per organizzazione E per app): è la stessa
// scelta già presa per `ORIGINI_AMBIENTE`. La difesa è la prova che pretende
// `scudo.ORIGINI_CAMPO` e `campo.ORIGINE_FERMO` uguali.
export const ORIGINI_CAMPO = ["fermo"];
export function daCampo(a) {
  return ORIGINI_CAMPO.includes(String((a || {}).origineTipo || ""));
}
// Quante azioni ambientali ci sono e come stanno: serve alla riga di
// riepilogo della pagina Azioni. Compatibilità: senza nessuna, tutti zero.
export function riepilogoAmbiente(azioni) {
  const l = (azioni || []).filter(daAmbiente);
  return {
    totale: l.length,
    superamenti: l.filter(a => a.origineTipo === "superamento").length,
    reclami: l.filter(a => a.origineTipo === "reclamo").length,
    daChiudere: l.filter(a => a.stato !== "chiusa").length,
  };
}

// ============================================================
// S2 · SEGNALAZIONE RAPIDA DEI NEAR-MISS
// Un mancato infortunio si segnala in piedi sul piazzale, con i guanti,
// in pochi secondi — o non lo segnala nessuno. Le due liste qui sotto
// servono proprio a questo: si TOCCA una categoria e un luogo invece di
// scrivere, e la segnalazione è già completa. Restano modificabili con il
// campo libero, perché nessun elenco copre tutte le cave.
// Le categorie vengono dai rischi tipici delle attività estrattive
// (caduta massi e instabilità dei fronti, viabilità delle piste, organi in
// movimento dell'impianto, volata); il riferimento normativo del
// tracciamento è la L. 198/2025 (ex D.L. 159/2025).
// ============================================================
export const NEARMISS_CATEGORIE = [
  { chiave: "caduta-massi",  etichetta: "Caduta massi" },
  { chiave: "instabilita",   etichetta: "Fronte instabile" },
  { chiave: "mezzi",         etichetta: "Mezzi e investimento" },
  { chiave: "ribaltamento",  etichetta: "Ribaltamento" },
  { chiave: "caduta",        etichetta: "Caduta o scivolamento" },
  { chiave: "impianto",      etichetta: "Impianto e nastri" },
  { chiave: "volata",        etichetta: "Volata e proiezioni" },
  { chiave: "elettrico",     etichetta: "Elettrico o incendio" },
  { chiave: "sostanze",      etichetta: "Polveri e sostanze" },
  { chiave: "altro",         etichetta: "Altro" },
];
export const NEARMISS_LUOGHI = [
  { chiave: "fronte",   etichetta: "Fronte" },
  { chiave: "pista",    etichetta: "Piste" },
  { chiave: "piazzale", etichetta: "Piazzale" },
  { chiave: "impianto", etichetta: "Impianto" },
  { chiave: "officina", etichetta: "Officina" },
  { chiave: "deposito", etichetta: "Deposito" },
  { chiave: "uffici",   etichetta: "Uffici" },
  { chiave: "altro",    etichetta: "Altro" },
];
export function categoriaNearMiss(chiave) {
  const c = NEARMISS_CATEGORIE.find(x => x.chiave === chiave);
  return c ? c.etichetta : "";
}
export function luogoNearMiss(chiave) {
  const l = NEARMISS_LUOGHI.find(x => x.chiave === chiave);
  return l ? l.etichetta : "";
}
// Descrizione già scritta quando chi segnala non aggiunge niente: la
// segnalazione resta leggibile nel registro anche se è costata tre tocchi.
export function descrizioneNearMiss({ categoria, luogoTipo, luogo, dettaglio } = {}) {
  const d = (dettaglio || "").trim();
  if (d) return d;
  const cat = categoriaNearMiss(categoria);
  const dove = (luogo || "").trim() || luogoNearMiss(luogoTipo);
  if (cat && dove) return cat + " — " + dove;
  return cat || dove || "Near-miss segnalato";
}

// Riepilogo AGGREGATO dei near-miss del periodo (L. 198/2025: dati aggregati
// sugli eventi *e* sulle azioni correttive adottate). Conta il periodo scelto
// in giorni (null = tutto lo storico), raggruppa per categoria e per luogo e
// dice quante segnalazioni hanno prodotto un'azione correttiva.
// `pochi` è vero quando i numeri sono troppo bassi per leggerci una tendenza:
// in quel caso l'interfaccia lo dice invece di disegnare grafici che
// suggeriscono andamenti inesistenti. Pura e testabile; `oggi` iniettabile.
/* ⛔ SOTTO QUESTA SOGLIA NON SI LEGGE UNA TENDENZA, e la soglia sta in UN POSTO
   SOLO. Era scritta a mano dentro `riepilogoNearMiss` (`list.length < 5`), e
   serviva anche all'analisi delle cause: ricopiarla avrebbe voluto dire due
   numeri che divergono al primo ripensamento, con due schermate della stessa
   app che dicono «pochi dati» a soglie diverse. */
export const MIN_TENDENZA = 5;
export function troppoPochiPerTendenza(quanti) { return (+quanti || 0) < MIN_TENDENZA; }

export function riepilogoNearMiss(infortuni, azioni, giorni = 90, oggi = new Date()) {
  const tutti = (infortuni || []).filter(x => x.tipo === "near-miss");
  const dentro = (x) => {
    if (giorni == null) return true;
    const g = giorniTra(x.data, oggi);      // negativo = nel passato
    return Number.isFinite(g) && g <= 0 && -g <= giorni;
  };
  const list = tutti.filter(dentro);
  const conta = (etichettaDi) => {
    const per = {};
    for (const x of list) {
      const lab = etichettaDi(x);
      per[lab] = (per[lab] || 0) + 1;
    }
    return Object.entries(per).map(([etichetta, valore]) => ({ etichetta, valore }))
      .sort((a, b) => b.valore - a.valore || a.etichetta.localeCompare(b.etichetta, "it"));
  };
  const perTipo = conta(x => categoriaNearMiss(x.categoria) || "Non classificato");
  // Il luogo può arrivare da un tocco (luogoTipo) o essere scritto a mano nel
  // registro di sempre (luogo): il conteggio tiene buoni tutti e due.
  const perLuogo = conta(x => luogoNearMiss(x.luogoTipo) || (x.luogo || "").trim() || "Luogo non indicato");
  const ids = new Set(list.map(x => x.id));
  const azi = (azioni || []).filter(a => a.origineTipo === "evento" && ids.has(a.origineId));
  const conAzione = new Set(azi.map(a => a.origineId)).size;
  const anonime = list.filter(x => x.anonimo).length;
  return {
    giorni, totale: list.length, totaleStorico: tutti.length,
    perTipo, perLuogo, anonime,
    conAzione, senzaAzione: list.length - conAzione,
    azioni: azi.length, azioniChiuse: azi.filter(a => a.stato === "chiusa").length,
    pochi: troppoPochiPerTendenza(list.length),
  };
}

// ============================================================
// S3 · ISPEZIONI E CHECKLIST PERIODICHE
// Modelli riutilizzabili con le voci tipiche dell'attività estrattiva.
// Ogni voce ha un esito (conforme / non conforme / non applicabile) e una
// nota; le voci NON CONFORMI generano le azioni correttive di S1, già
// collegate all'ispezione. Le periodicità sono PROPOSTE (giorni), non
// verità di legge: le conferma l'RSPP con il DSS della cava.
// ============================================================
export const ESITI_ISPEZIONE = [
  { chiave: "conforme",     etichetta: "Conforme",       breve: "OK",  cls: "ok" },
  { chiave: "non-conforme", etichetta: "Non conforme",   breve: "NO",  cls: "danger" },
  { chiave: "na",           etichetta: "Non applicabile", breve: "N/A", cls: "tag" },
];
export function esitoLabel(chiave) {
  return ESITI_ISPEZIONE.find(e => e.chiave === chiave) || null;
}

export const MODELLI_ISPEZIONE = [
  {
    chiave: "sorveglianza", nome: "Giro di sorveglianza", ambito: "Tutta la cava",
    giorni: 1,
    riferimento: "D.Lgs 624/96 — il sorvegliante controlla i luoghi di lavoro dove si svolge l'attività.",
    voci: [
      "Fronti e piste percorribili, nessun pericolo evidente in vista",
      "Tutti indossano i DPI previsti (elmetto, gilet, scarpe, protettori udito)",
      "Nessun mezzo lasciato in posizione pericolosa o senza freno",
      "Segnaletica, sbarramenti e delimitazioni al loro posto",
      "Near-miss e anomalie del turno precedente presi in carico",
      "Presenza in cava di almeno un addetto a primo soccorso e antincendio",
    ],
  },
  {
    chiave: "fronte", nome: "Fronte di cava — stabilità e disgaggio", ambito: "Fronti",
    giorni: 30,
    riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: stabilità dei fronti, caduta massi e franamento; alimenta la relazione annuale di stabilità.",
    voci: [
      "Ciglio superiore libero da massi instabili e materiale sciolto",
      "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi",
      "Nessun blocco in equilibrio precario sulla parete",
      "Altezza e pendenza dei gradoni come previsto nel DSS",
      "Unghia del fronte libera da accumuli che ostacolano il lavoro",
      "Nessuna fessura di trazione, venuta d'acqua o segno di movimento",
      "Disgaggio eseguito dopo l'ultima volata e dopo le piogge forti",
      "Accessi al fronte sbarrati e segnalati quando l'area non è operativa",
    ],
  },
  {
    chiave: "piste", nome: "Piste e viabilità interna", ambito: "Piste",
    giorni: 15,
    riferimento: "D.Lgs 81/08 titolo I e D.Lgs 624/96 — circolazione dei mezzi in sicurezza nei luoghi di lavoro.",
    voci: [
      "Larghezza della pista adeguata al mezzo più grande in uso",
      "Arginelli sui lati esposti presenti e integri",
      "Fondo e pendenza in ordine, senza solchi o cedimenti",
      "Segnaletica, limiti di velocità e precedenze visibili",
      "Abbattimento delle polveri (bagnatura) eseguito",
      "Incroci e punti ciechi con visibilità garantita",
      "Aree di manovra, carico e scarico delimitate",
      "Illuminazione sufficiente nei tratti usati con poca luce",
    ],
  },
  {
    chiave: "impianto", nome: "Impianto di lavorazione", ambito: "Frantoio e nastri",
    giorni: 30,
    riferimento: "D.Lgs 81/08 titolo III — protezione degli organi in movimento e uso in sicurezza delle attrezzature.",
    voci: [
      "Ripari fissi e mobili su pulegge, nastri e organi in movimento",
      "Funi e pulsanti di emergenza dei nastri funzionanti e raggiungibili",
      "Blocco della macchina in manutenzione (procedura di messa fuori servizio)",
      "Passerelle, scale e parapetti integri e sgombri",
      "Aspirazione e abbattimento polveri in funzione",
      "Quadri elettrici chiusi, accessibili e senza cavi volanti",
      "Nessun accumulo di materiale sotto nastri e tramogge",
      "Accesso a tramogge e spazi confinati regolato da permesso di lavoro",
    ],
  },
  {
    chiave: "mezzi", nome: "Mezzi e officina", ambito: "Mezzi",
    giorni: 30,
    riferimento: "D.Lgs 81/08 art. 71 e D.M. 11/04/2011 — controlli, manutenzione e verifiche periodiche delle attrezzature.",
    voci: [
      "Controllo giornaliero dei mezzi eseguito e registrato dagli operatori",
      "Cinture, cicalino e luci di retromarcia funzionanti",
      "Estintori a bordo controllati e in corso di validità",
      "Verifiche periodiche delle attrezzature di sollevamento in regola",
      "Nessuna perdita di olio o gasolio; area di rifornimento in ordine",
      "Attrezzature di officina con ripari e in buono stato",
      "Rifiuti, oli esausti e stracci raccolti nei contenitori dedicati",
      "DPI degli addetti disponibili, integri e della taglia giusta",
    ],
  },
  {
    chiave: "dpi-emergenza", nome: "DPI, emergenza e presidi", ambito: "Sito",
    giorni: 90,
    riferimento: "D.Lgs 81/08 artt. 43-46 e 77 — gestione dell'emergenza, primo soccorso e uso dei DPI.",
    voci: [
      "Cassetta di primo soccorso completa e nei termini di scadenza",
      "Estintori e idranti controllati, segnalati e raggiungibili",
      "Vie di fuga e punto di raccolta liberi e segnalati",
      "Numeri di emergenza e planimetrie esposti e leggibili",
      "Verbali di consegna DPI firmati e aggiornati",
      "Addestramento fatto per i DPI di III categoria e i protettori dell'udito",
      "Prova di emergenza dell'anno eseguita e verbalizzata",
    ],
  },
];

export function modelloIspezione(chiave) {
  return MODELLI_ISPEZIONE.find(m => m.chiave === chiave) || null;
}

// Record di una nuova ispezione a partire da un modello: le voci vengono
// COPIATE dentro l'ispezione, così un modello che cambia domani non riscrive
// le ispezioni già fatte (un controllo firmato non si modifica a posteriori).
export function nuovaIspezioneDaModello(chiave, { data, cantiereId, responsabileId, stato } = {}) {
  const m = modelloIspezione(chiave);
  if (!m) return null;
  return {
    modello: m.chiave, nome: m.nome, ambito: m.ambito,
    riferimento: m.riferimento || "", periodicitaGiorni: m.giorni || null,
    data: data || "", cantiereId: cantiereId || null, responsabileId: responsabileId || null,
    voci: m.voci.map((testo, i) => ({ id: "v" + (i + 1), testo })),
    esiti: {}, stato: stato || "in-corso", dataChiusura: null,
  };
}

// Conteggio degli esiti di un'ispezione (compresa la parte ancora da fare).
export function riepilogoIspezione(isp) {
  const voci = (isp && isp.voci) || [], esiti = (isp && isp.esiti) || {};
  let conformi = 0, nonConformi = 0, na = 0;
  for (const v of voci) {
    const e = esiti[v.id] && esiti[v.id].esito;
    if (e === "conforme") conformi++;
    else if (e === "non-conforme") nonConformi++;
    else if (e === "na") na++;
  }
  const totale = voci.length, fatte = conformi + nonConformi + na;
  return { totale, fatte, daFare: totale - fatte, conformi, nonConformi, na,
    completa: totale > 0 && fatte === totale,
    percento: totale ? Math.round(fatte / totale * 100) : 0 };
}

// Voci non conformi di un'ispezione, con la loro nota: sono quelle che
// diventano azioni correttive.
export function vociNonConformi(isp) {
  const esiti = (isp && isp.esiti) || {};
  return ((isp && isp.voci) || [])
    .filter(v => esiti[v.id] && esiti[v.id].esito === "non-conforme")
    .map(v => ({ id: v.id, testo: v.testo, nota: (esiti[v.id].nota || "").trim() }));
}

// Semaforo di un'ispezione: completata = regolare; programmata o in corso
// seguono la data con lo stesso schema dello scadenzario.
export function statoIspezione(isp, oggi = new Date()) {
  const i = isp || {};
  if (i.stato === "completata") return "regolare";
  // stessa correzione di `statoAzione`: un'ispezione programmata senza data non
  // è in ordine, è un'ispezione di cui non si sa quando va fatta
  return statoScadenza(i.data, oggi);
}

// Riepilogo per la testata della pagina Ispezioni.
/* ⛔ UNA VOCE SENZA ESITO NON È UNA VOCE CONFORME. Un'ispezione si può chiudere
   lasciandone indietro qualcuna — la modale di chiusura lo dice, «resteranno
   così» — ma da lì in poi non se ne trovava più traccia: nell'elenco restava il
   verde «Completata», e la testata contava le non conformi TROVATE. Zero non
   conformi su una checklist guardata a metà è il numero tranquillo di cui parla
   il principio: non è stato misurato niente, e il conto lo dice a posto.
   `senzaEsito` sono le voci mai giudicate dentro le ispezioni CHIUSE (in quelle
   ancora aperte è lavoro in corso, non una mancanza), `parziali` quante
   ispezioni ne hanno almeno una. */
export function riepilogoIspezioni(ispezioni, oggi = new Date()) {
  const list = ispezioni || [];
  const aperte = list.filter(i => i.stato !== "completata");
  const chiuse = list.filter(i => i.stato === "completata");
  return {
    totale: list.length,
    completate: chiuse.length,
    parziali: chiuse.filter(i => riepilogoIspezione(i).daFare > 0).length,
    senzaEsito: chiuse.reduce((s, i) => s + riepilogoIspezione(i).daFare, 0),
    daFare: aperte.length,
    scadute: aperte.filter(i => statoIspezione(i, oggi) === "scaduta").length,
    nonConformi: list.reduce((s, i) => s + riepilogoIspezione(i).nonConformi, 0),
  };
}

// ============================================================
// S3b · LA FOTO COME PROVA (eventi del registro e voci d'ispezione)
//
// Davanti a un near-miss o a una protezione mancante la prima cosa che si fa
// è tirare fuori il telefono, ed è la prima cosa che un ispettore chiede
// quando domanda «avete una prova?». Fino a oggi la graffetta esisteva solo
// sui DOCUMENTI: infortuni e ispezioni non avevano nessun campo per una foto.
//
// ⛔ LA REGOLA DELL'ALLEGATO NON SI RISCRIVE. «Questo file va bene?» è
// `controllaAllegato` di `shared/`, che Scudo importa già per i documenti e
// che usa anche Sentinella; «di che cosa è fatto questo dataURL?» è
// `pezziDataURL`. Qui c'è SOLO ciò che quelle due non sanno: quanto pesa una
// foto GIÀ SALVATA, e quanto spazio resta quando le foto sono più d'una.
//
// ⛔ IL NUMERO CHE HA DECISO «PIÙ D'UNA O UNA SOLA», misurato prima di
// scrivere una riga. Le foto viaggiano dentro il documento Firestore, che ha
// un tetto di 1.048.576 byte; il base64 cresce di un terzo, più i 23
// caratteri di «data:image/jpeg;base64,». Quindi:
//     1 foto da 400 KB →   546.159 byte di dataURL =  52,1% del tetto  ✅
//     2 foto da 400 KB → 1.092.318 byte            = 104,2% del tetto  ❌
// Due allegati al limite della singola NON stanno nel documento: la scrittura
// viene rifiutata e con essa TUTTO il record — l'evento, non solo la foto.
// Per questo il limite qui è sul TOTALE e non sulla singola foto, e il totale
// resta `LIMITE_ALLEGATO` (400 KB di file = 52,1% del tetto, metà documento
// libera per il resto). Le foto ammesse sono al massimo TRE: a 400 KB in tutto
// sono 133 KB l'una, che è l'ultima divisione in cui un fronte di cava resta
// leggibile ingrandendolo; una quarta casella prometterebbe uno spazio che il
// tetto non ha.
//
// ⛔ E PER L'ISPEZIONE IL TOTALE È DI TUTTA L'ISPEZIONE, non della voce: le
// voci di una checklist stanno in UN SOLO documento (`esiti: { voceId: … }`),
// quindi cinque voci fotografate al limite fanno 2,6 volte il tetto. È la
// trappola che `bilancioFotoVoce` esiste per chiudere.
//
// ⛔ L'ASSENZA DI UNA FOTO NON È UN DATO SFAVOREVOLE, e qui va guardata al
// verso opposto del solito: un infortunio senza foto non è «meno grave» né
// «mal documentato» — chi soccorre non fotografa, ed è giusto così. Non c'è
// nessun punteggio di completezza: `pastigliaFoto(0)` risponde `null`, cioè
// niente pastiglia e niente colore, e la pastiglia non ha MAI una classe
// d'allarme.
// ============================================================

// Quante foto si possono attaccare a un evento o a una voce d'ispezione.
export const MAX_FOTO = 3;
/* Sotto un kilobyte non ci sta nessuna foto: uno spazio residuo più piccolo
   di così vale zero. Serve anche a non dover riscrivere il «meno di 1 KB» di
   `controllaAllegato` — sopra questa soglia i KB arrotondati sono onesti. */
const SPAZIO_MINIMO_FOTO = 1024;

/* Quanto pesa il FILE dietro una foto già salvata, in byte, per poterlo
   confrontare con `LIMITE_ALLEGATO` (che è misurato su `file.size`).
   ⛔ Torna `null`, non `0`, quando il dataURL non si sa leggere: uno zero
   sarebbe un'assenza spacciata per «non occupa spazio», e il budget si
   sfonderebbe in silenzio portandosi dietro tutto il record. */
export function pesoFoto(f) {
  const pz = pezziDataURL(f && f.dataURL);
  if (!pz || !pz.base64) return null;
  const c = String(pz.contenuto || "");
  const corpo = c.replace(/=+$/, ""), pad = c.length - corpo.length;
  if (pad > 2 || c.length % 4 !== 0 || !/^[A-Za-z0-9+/]*$/.test(corpo)) return null;
  return Math.floor(c.length / 4) * 3 - pad;
}

// Le foto di un evento del registro (infortunio o near-miss).
export function fotoDiEvento(ev) {
  return (ev && Array.isArray(ev.foto) ? ev.foto : []).filter(f => f && f.dataURL);
}
// Le foto attaccate a UNA voce della checklist.
export function fotoDiVoce(isp, voceId) {
  const e = isp && isp.esiti && isp.esiti[voceId];
  return (e && Array.isArray(e.foto) ? e.foto : []).filter(f => f && f.dataURL);
}
/* TUTTE le foto di un'ispezione, con la voce a cui appartengono.
   ⚠️ Si scorrono gli ESITI, non le voci: una foto rimasta su una voce che il
   modello non ha più occupa spazio nel documento esattamente come le altre, e
   scorrendo `voci` non la vedrebbe nessuno — cioè il budget direbbe che c'è
   posto proprio quando non c'è. */
export function fotoDiIspezione(isp) {
  const esiti = (isp && isp.esiti) || {};
  const testo = Object.fromEntries(((isp && isp.voci) || []).map(v => [v.id, v.testo]));
  const out = [];
  for (const id of Object.keys(esiti)) {
    const e = esiti[id];
    if (!e || !Array.isArray(e.foto)) continue;
    for (const f of e.foto) if (f && f.dataURL)
      out.push(Object.assign({ voceId: id, voce: testo[id] || "" }, f));
  }
  return out;
}

/* Si può aggiungere un'altra foto? `condivise` sono le foto che stanno nello
   STESSO documento ma in un'altra casella (le altre voci dell'ispezione):
   contano nello spazio, non nel numero. La bandiera `misurabile` dichiara il
   caso in cui il conto non si può fare, e la legge `testoBilancioFoto`. */
export function bilancioFoto(foto, opts = {}) {
  const max = opts.max === undefined ? MAX_FOTO : opts.max;
  const limite = opts.limite === undefined ? LIMITE_ALLEGATO : opts.limite;
  const proprie = (Array.isArray(foto) ? foto : []).filter(Boolean);
  const condivise = (Array.isArray(opts.condivise) ? opts.condivise : []).filter(Boolean);
  let usati = 0, misurabile = true;
  for (const f of proprie.concat(condivise)) {
    const p = pesoFoto(f);
    if (p === null) misurabile = false; else usati += p;
  }
  const quante = proprie.length;
  const residuo = misurabile ? Math.max(0, limite - usati) : 0;
  const motivo = !misurabile ? "peso-illeggibile"
    : quante >= max ? "numero"
    : residuo < SPAZIO_MINIMO_FOTO ? "spazio" : "";
  return { quante, max, usati, residuo, misurabile, pieno: motivo !== "", motivo, limite };
}

/* Il bilancio di UNA voce d'ispezione, col totale preso su tutta l'ispezione.
   La pagina chiama questa e non `bilancioFoto`, perché comporre le condivise a
   mano è esattamente l'errore che fa passare cinque foto da 400 KB. */
export function bilancioFotoVoce(isp, voceId) {
  const tutte = fotoDiIspezione(isp);
  return bilancioFoto(fotoDiVoce(isp, voceId), { condivise: tutte.filter(f => f.voceId !== voceId) });
}

/* Che cosa dire di quel bilancio. Una risposta per OGNI motivo che
   `bilancioFoto` sa produrre (regola 18 di run-stile). */
export function testoBilancioFoto(b) {
  const x = b || {};
  const kb = (n) => Math.round((+n || 0) / 1024) + " KB";
  switch (x.motivo) {
    case "peso-illeggibile":
      return "Una delle foto già salvate non si riesce a pesare: finché c'è non so dire quanto spazio resta. Toglila e riprova.";
    case "numero":
      return `Ci sono già ${x.quante} foto, il massimo: per aggiungerne un'altra togline una.`;
    case "spazio":
      return `Le foto hanno già usato i ${kb(x.limite)} disponibili: per aggiungerne un'altra togline una.`;
    default:
      return `Puoi aggiungere ancora ${x.max - x.quante} foto: restano ${kb(x.residuo)} in tutto.`;
  }
}

/* La pastiglia con quante foto ci sono.
   ⛔ Con zero foto NON torna una pastiglia «0 foto»: torna `null`. Un evento
   senza foto non è un evento mal documentato, e un contatore a zero accanto
   agli altri badge lo farebbe sembrare. La classe è vuota — il grigio dei
   badge neutri — e non diventa mai `warn` né `danger`. */
export function pastigliaFoto(n) {
  const q = Math.max(0, Math.trunc(+n) || 0);
  if (!q) return null;
  return { testo: q === 1 ? "1 foto" : q + " foto", classe: "" };
}

/* Di che cosa è questa foto. Una foto senza contesto, tre mesi dopo, non la sa
   leggere nessuno: vale la didascalia scritta da chi ha scattato, e in
   mancanza il soggetto a cui la foto è attaccata (la voce della checklist, la
   descrizione dell'evento). Torna `null` — e non una stringa vuota — quando
   non c'è né l'una né l'altro, così la pagina lo può DIRE invece di mostrare
   una miniatura muta. */
export function contestoFoto(f, contesto = "") {
  const d = String((f && f.didascalia) || "").trim();
  if (d) return d;
  const c = String(contesto || "").trim();
  return c || null;
}

// Data di oggi + N giorni in ISO (per la prossima ispezione ricorrente e per
// la scadenza proposta alle azioni correttive).
// ⛔ RI-ESPORTATA da `shared/`: era scritta identica anche in Sentinella, e le
// due copie si erano già staccate sul caso d'errore. Un alias non è una seconda
// implementazione. docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md
export const dataPiuGiorni = dataPiuGiorniShell;

// Import registro infortuni da CSV (onboarding: caricare lo storico eventi di
// una cava). Colonne: data;tipo;gravita;giorniAssenza;descrizione[;luogo]
// (header opzionale). Tiene solo le righe con data valida (AAAA-MM-GG). tipo:
// "infortunio" oppure "near-miss" (qualsiasi altro valore → near-miss, il caso
// più prudente per il contatore "giorni senza infortuni"). descrizione/luogo
// sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseInfortuniCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, tipo, gravita, giorniAssenza, descrizione, luogo] = parseCsvLine(r);
      const g = numIt(giorniAssenza);
      const tp = (tipo || "").trim().toLowerCase() === "infortunio" ? "infortunio" : "near-miss";
      return {
        data: (data || "").trim(),
        tipo: tp,
        gravita: (gravita || "").trim().toLowerCase() === "grave" ? "grave" : "lieve",
        /* decisione 17: la colonna vuota di un INFORTUNIO non è uno zero — la
           prognosi può essere ancora aperta. Per un near-miss lo è, ed è il
           caso normale: la ragione scritta il 31/07 resta valida per lui. */
        giorniAssenza: Number.isFinite(g) ? Math.max(0, g) : (tp === "infortunio" ? null : 0),
        descrizione: (descrizione || "").trim(),
        luogo: (luogo || "").trim(),
      };
    })
    // un infortunio con una data che non esiste entrerebbe negli indici
    // infortunistici e nel riepilogo annuale (03/08)
    .filter(x => dataISOEsiste(x.data));
}

// Copertura formazione/competenze PER TIPO (visite mediche, corsi, DPI,
// patentini…): per ogni tipo conta quante scadenze sono regolari / in
// scadenza / scadute. È la "matrice" che dice se l'azienda è coperta su
// ciascun adempimento. Ordinata dalla situazione peggiore (più scadute).
// Pura e testabile.
export function coperturaFormazione(scadenze) {
  const per = {};
  for (const s of scadenze || []) {
    const t = (s.tipo || "Altro");
    const g = per[t] || (per[t] = { tipo: t, totale: 0, scadute: 0, inScadenza: 0, regolari: 0 });
    g.totale++;
    const st = statoScadenza(s.dataScadenza);
    if (st === "scaduta") g.scadute++;
    else if (st === "in-scadenza") g.inScadenza++;
    else g.regolari++;
  }
  return Object.values(per).sort((a, b) =>
    (b.scadute - a.scadute) || (b.inScadenza - a.inScadenza) || a.tipo.localeCompare(b.tipo, "it"));
}

// IL MURO DELLE SCADENZE: quante scadenze cadono in ciascuno dei prossimi N
// mesi (di serie 12), più l'ARRETRATO già scaduto tenuto a parte. Serve a
// vedere in che mese si accumula il lavoro — cinque visite mediche nello
// stesso mese si prenotano in una mattina sola invece di rincorrerle una per
// una. Conta le scadenze dello scadenzario: le azioni correttive hanno una
// loro pagina e un loro semaforo, e non entrano qui.
// Ritorna { scadute, totale, da: "AAAA-MM", a: "AAAA-MM",
//           mesi: [{ chiave:"2026-07", mese:6, anno:2026, etichetta:"lug", totale }] }.
// Le scadenze oltre l'orizzonte non si contano (non sono un problema di
// quest'anno) ma restano nel `fuori`. Pura e testabile; `oggi` iniettabile.
const MESI_BREVI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

export function muroScadenze(scadenze, oggi = new Date(), quantiMesi = 12) {
  const n = Math.max(1, Math.round(quantiMesi));
  const mesi = [];
  const indice = {};
  for (let i = 0; i < n; i++) {
    const d = new Date(oggi.getFullYear(), oggi.getMonth() + i, 1);
    const chiave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const voce = { chiave, mese: d.getMonth(), anno: d.getFullYear(), etichetta: MESI_BREVI[d.getMonth()], totale: 0 };
    indice[chiave] = voce;
    mesi.push(voce);
  }
  let scadute = 0, fuori = 0, totale = 0;
  for (const s of scadenze || []) {
    const iso = String(s.dataScadenza || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) continue;
    totale++;
    if (statoScadenza(iso, oggi) === "scaduta") { scadute++; continue; }
    const voce = indice[iso.slice(0, 7)];
    if (voce) voce.totale++; else fuori++;
  }
  return {
    scadute, fuori, totale, mesi,
    da: mesi[0].chiave, a: mesi[mesi.length - 1].chiave,
    nelPeriodo: mesi.reduce((s, m) => s + m.totale, 0),
  };
}

// Nome esteso del mese (per i testi: «il mese più carico è ottobre 2026»).
export const MESI_NOMI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

// Adempimenti HSE TIPICI di una cava, come voci preimpostate dello
// scadenzario (stessa idea di SOGLIE_PRESET in Sentinella): l'utente sceglie
// l'adempimento invece di digitarlo, e Scudo prepara descrizione e tipo. Fonti
// e ragionamento in vault/RICERCA_HSE_SCADENZE_CAVA.md. Doppio binario: D.Lgs
// 81/2008 (generale) + D.Lgs 624/1996 (estrattivo, DSS). categoria = persona
// (legata al lavoratore) | azienda (di sito). `tipo` mappa sui tipi già
// presenti nel form. Le PERIODICITÀ non sono qui: dipendono dal DVR/DSS e dal
// medico competente → ogni preset porta `daVerificare` (niente scadenza
// automatica, la data la mette l'utente).
// I preset del blocco "cava" (D.Lgs 624/96) portano anche una PERIODICITÀ
// SUGGERITA in mesi (`mesi`) e il RIFERIMENTO normativo (`riferimento`) da
// mostrare come nota informativa. La periodicità è solo una PROPOSTA che
// l'utente può cambiare: non è una verità assoluta e non è consulenza legale.
// `mesi: null` = periodicità non fissata dalla norma (la decide l'azienda col
// proprio consulente, oppure l'evento che la fa scattare).
export const SCADENZE_PRESET = [
  { chiave: "sorv-sanitaria",   categoria: "persona", tipo: "Visita medica", etichetta: "Sorveglianza sanitaria — visita periodica (art. 41)", mesi: 12, riferimento: "D.Lgs 81/2008 art. 41 — di norma annuale, salvo diversa periodicità stabilita dal medico competente." },
  { chiave: "form-generale",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione generale + specifica (art. 37)", mesi: null, riferimento: "D.Lgs 81/2008 art. 37 e Accordo Stato-Regioni — la formazione iniziale non ha scadenza, ma va aggiornata." },
  { chiave: "form-aggiorn",     categoria: "persona", tipo: "Formazione",    etichetta: "Aggiornamento formazione lavoratori", mesi: 60, riferimento: "Accordo Stato-Regioni — aggiornamento periodico (di prassi quinquennale)." },
  { chiave: "form-preposto",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento preposto", mesi: 24, riferimento: "D.L. 146/2021 — individuazione obbligatoria del preposto e aggiornamento almeno biennale." },
  { chiave: "form-dirigente",   categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento dirigente", mesi: 60, riferimento: "Accordo Stato-Regioni — aggiornamento periodico del dirigente." },
  { chiave: "primo-soccorso",   categoria: "persona", tipo: "Corso",         etichetta: "Primo soccorso — aggiornamento addetti", mesi: 36, riferimento: "D.M. 388/2003 — aggiornamento della parte pratica di norma triennale." },
  { chiave: "antincendio",      categoria: "persona", tipo: "Corso",         etichetta: "Antincendio — aggiornamento addetti", mesi: 60, riferimento: "D.M. 2 settembre 2021 — aggiornamento periodico degli addetti antincendio." },
  { chiave: "rls",              categoria: "persona", tipo: "Formazione",    etichetta: "RLS — aggiornamento periodico", mesi: 12, riferimento: "D.Lgs 81/2008 art. 37 — aggiornamento annuale (durata secondo il numero di lavoratori)." },
  { chiave: "patentino-attr",   categoria: "persona", tipo: "Patente",       etichetta: "Abilitazione attrezzature (escavatore, PLE, gru…)", mesi: 60, riferimento: "Accordo Stato-Regioni 22/02/2012 — aggiornamento quinquennale delle abilitazioni." },
  { chiave: "fochino",          categoria: "persona", tipo: "Patente",       etichetta: "Fochino — abilitazione brillamento mine", mesi: null, riferimento: "D.P.R. 302/1956 — licenza rilasciata dal Prefetto: la scadenza è quella indicata sul titolo." },
  { chiave: "dss",              categoria: "azienda", tipo: "Altro",         etichetta: "DSS — Documento di Sicurezza e Salute (D.Lgs 624/96)", mesi: null, riferimento: "D.Lgs 624/96 artt. 6 e 10 — il DSS integra l'art. 28 del D.Lgs 81/08; va trasmesso all'autorità di vigilanza prima dell'inizio dei lavori." },
  { chiave: "dvr",              categoria: "azienda", tipo: "Altro",         etichetta: "DVR — aggiornamento", mesi: null, riferimento: "D.Lgs 81/2008 art. 29 — rielaborazione in occasione di modifiche significative, infortuni o nuovi rischi." },
  { chiave: "verifica-attr",    categoria: "azienda", tipo: "Altro",         etichetta: "Verifica periodica attrezzature (D.M. 11/04/2011)", mesi: 12, riferimento: "D.M. 11/04/2011 — periodicità secondo l'allegato VII del D.Lgs 81/08: dipende dal tipo di attrezzatura." },
  { chiave: "riunione-sic",     categoria: "azienda", tipo: "Altro",         etichetta: "Riunione periodica di sicurezza (art. 35)", mesi: 12, riferimento: "D.Lgs 81/2008 art. 35 — almeno una volta l'anno nelle aziende con più di 15 lavoratori, con verbale." },
  // --- Adempimenti tipici delle industrie estrattive (D.Lgs 624/96) ---
  { chiave: "stabilita-fronti", categoria: "cava"   , tipo: "Altro",         etichetta: "Relazione annuale sulla stabilità dei fronti", mesi: 12, riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: relazione su stabilità dei fronti, caduta massi e franamento, predisposta o aggiornata annualmente." },
  { chiave: "dss-certif",       categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — certificazione annuale del datore di lavoro", mesi: 12, riferimento: "D.Lgs 624/96 art. 6 — il datore di lavoro certifica ogni anno l'attualità del Documento di Sicurezza e Salute." },
  { chiave: "dss-aggiorn",      categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — aggiornamento dopo modifiche o incidenti", mesi: null, riferimento: "D.Lgs 624/96 artt. 6 e 10 — il DSS va aggiornato quando cambiano le lavorazioni o dopo un incidente: la data la fissa l'evento, non il calendario." },
  { chiave: "dss-trasmiss",     categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — trasmissione all'autorità di vigilanza", mesi: null, riferimento: "D.Lgs 624/96 — il DSS va trasmesso all'autorità di vigilanza prima dell'inizio dei lavori (e dopo gli aggiornamenti)." },
  { chiave: "esposti-silice",   categoria: "cava"   , tipo: "Altro",         etichetta: "Registro esposti — silice cristallina respirabile", mesi: 36, riferimento: "D.Lgs 81/08 art. 243 (silice cristallina respirabile da processo: allegato XLII dal D.Lgs 44/2020) — registro degli esposti aggiornato almeno ogni tre anni." },
  { chiave: "rumore-vibraz",    categoria: "cava"   , tipo: "Altro",         etichetta: "Valutazione rumore e vibrazioni — aggiornamento", mesi: 48, riferimento: "D.Lgs 81/08 titolo VIII capi II e III — la valutazione va aggiornata periodicamente e a ogni modifica rilevante delle lavorazioni." },
  { chiave: "sorvegliante",     categoria: "cava"   , tipo: "Altro",         etichetta: "Sorvegliante di cava — nomina e formazione", mesi: null, riferimento: "D.Lgs 624/96 — figura obbligatoria nelle attività estrattive: verificare nomina in essere e formazione aggiornata." },
];

// Ritorna il preset con quella chiave (o null). daVerificare SEMPRE true: la
// periodicità è una proposta, va confermata con RSPP, medico competente e
// consulente dell'azienda.
export function presetScadenza(chiave) {
  const p = SCADENZE_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, mesi: (p.mesi == null ? null : p.mesi), daVerificare: true } : null;
}

// Data proposta a partire da oggi + N mesi (ISO AAAA-MM-GG), per precompilare
// la scadenza di un preset. Ritorna null se la periodicità non è un numero
// positivo (periodicità non fissata: la data la mette l'utente). Se il giorno
// non esiste nel mese di arrivo (31 → mese di 30 giorni) si prende l'ultimo
// giorno utile, così non si scivola al mese dopo. Pura e testabile.
export function dataDaPeriodicita(mesi, oggi = new Date()) {
  const m = Number(mesi);
  if (!Number.isFinite(m) || m <= 0) return null;
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
  d.setMonth(d.getMonth() + Math.round(m));
  const giorno = Math.min(oggi.getDate(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
  d.setDate(giorno);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ============================================================
// IL CICLO DI VITA DEL DSS (D.Lgs 624/96 art. 6)
// ============================================================
// Il DSS c'era già come TIPO di documento, con il suo stato a tre valori
// (valido / da rivedere / scaduto) messo a mano, e c'erano già quattro voci di
// scadenzario che lo nominano (`dss`, `dss-certif`, `dss-aggiorn`,
// `dss-trasmiss`). Quello che non c'era è il CICLO: chi lo aggiorna, quando, e
// che cosa lo fa scadere. Uno stato messo a mano dice quello che qualcuno ha
// digitato l'ultima volta che ci ha pensato; questo dice quello che risulta.
//
// ⛔ E IL PUNTO PER CUI ESISTE È IL TERZO STATO. Un DSS senza una data di
// revisione leggibile NON è «aggiornato» e NON è «scaduto»: è **non databile**,
// e va detto con la sua parola. È il principio del fondatore nel punto in cui
// costa di più, perché il DSS è il primo documento che un ispettore chiede in
// una cava: un badge verde su un documento di cui non sappiamo l'età sarebbe
// la cosa peggiore che questa schermata possa fare.
// Allo stesso modo «nessun infortunio grave registrato» non vuol dire «non
// serve aggiornarlo»: le modifiche delle lavorazioni — nuovo fronte, nuovo
// metodo, nuovo impianto — Scudo non le vede, e quindi lo scrive INVECE di
// lasciar credere di aver guardato anche quelle (costante `CIECO_DSS`).
//
// Campi sul documento di tipo "DSS" nel registro `documenti` (nessun secondo
// archivio, come per i documenti di qualifica degli appaltatori):
//   dssRevisione:    ISO — data dell'ultima revisione
//   dssMotivo:       chiave di MOTIVI_REVISIONE_DSS
//   dssTrasmissione: ISO — data di invio all'autorità di vigilanza
//
// ⚠️ FONTI SECONDARIE. I riferimenti normativi qui sotto ripetono quelli già
// scritti nei preset di scadenzario, che vengono da ricerca su fonti
// SECONDARIE: il testo primario non è stato letto riga per riga. Nella pagina
// il blocco porta la formula che Scudo usa già — «nota informativa, non un
// parere legale» — e la periodicità di dodici mesi è quella del preset
// `dss-certif`, cioè una PROPOSTA, non una verità di legge riga per riga.

// Perché il DSS è stato rivisto. I due motivi «dopo…» sono i fatti che la
// norma indica come scatenanti; gli altri due sono il calendario e l'origine.
export const MOTIVI_REVISIONE_DSS = [
  { chiave: "prima-stesura", nome: "Prima stesura",
    riferimento: "D.Lgs 624/96 art. 6 — il DSS è redatto prima dell'inizio dei lavori." },
  { chiave: "periodica", nome: "Revisione periodica",
    riferimento: "D.Lgs 624/96 art. 6 — il datore di lavoro certifica ogni anno l'attualità del documento." },
  { chiave: "dopo-evento", nome: "Dopo un infortunio o un incidente",
    riferimento: "D.Lgs 624/96 artt. 6 e 10 — la data la fissa l'evento, non il calendario." },
  { chiave: "dopo-modifica", nome: "Dopo una modifica delle lavorazioni",
    riferimento: "D.Lgs 624/96 artt. 6 e 10 — nuovo fronte, nuovo metodo di coltivazione, nuovo impianto." },
];
export function motivoRevisioneDss(chiave) {
  return MOTIVI_REVISIONE_DSS.find((m) => m.chiave === chiave) || null;
}

// I mesi della certificazione annuale: NON un numero nuovo, è quello del preset
// `dss-certif` — se un giorno cambia là, cambia qui. Una periodicità scritta due
// volte è una periodicità che si stacca.
const MESI_CERTIF_DSS = (SCADENZE_PRESET.find((p) => p.chiave === "dss-certif") || {}).mesi || 12;

/* I DSS di una cava, dal più recente al più vecchio. Vivono nel registro
   `documenti` che Scudo ha già, collegati da `cantiereId` come il DSS della
   dimostrazione lo è sempre stato. */
export function dssDiCantiere(documenti, cantiereId) {
  if (!cantiereId) return [];
  return (documenti || [])
    .filter((d) => d && d.tipo === "DSS" && d.cantiereId === cantiereId)
    .sort((a, b) => String(b.dssRevisione || "").localeCompare(String(a.dssRevisione || "")));
}

/* ⛔ I DSS CHE NON SONO COLLEGATI A NESSUNA CAVA. Senza questa riga il modulo
   direbbe «non registrato» su una cava mentre il suo DSS è in archivio, appeso
   a niente: un allarme falso manda a rifare un documento che c'è, ed è il modo
   più veloce per far spegnere l'allarme a chi lo riceve. */
export function dssScollegati(documenti) {
  return (documenti || []).filter((d) => d && d.tipo === "DSS" && !d.cantiereId);
}

// La frase che dichiara quello che Scudo NON ha potuto guardare. Sta in una
// costante perché la dicono tre stati su sette e riscriverla tre volte è il
// modo in cui, fra un mese, ne resteranno due.
const CIECO_DSS = "Le modifiche delle lavorazioni Scudo non le vede: se sono cambiati il fronte, "
  + "il metodo di coltivazione o l'impianto, il DSS va rivisto lo stesso.";

/* Il ciclo di UN DSS. `documento` è quello della cava (o null: la cava non ne
   ha nessuno). Le scadenze non si giudicano qui — le dice `statoScadenza`,
   cioè `statoScadenzaHSE` di `shared/dw-ponti.js`, la stessa dello scadenzario
   e dei turni di Campo — e la data della certificazione annuale la calcola
   `dataDaPeriodicita`, la stessa che precompila i preset. Pura e testabile;
   `oggi` iniettabile. */
export function cicloDss(documento, infortuni, oggi = new Date()) {
  const d = documento || null;
  const rev = d && dataISOEsiste(d.dssRevisione) ? String(d.dssRevisione).slice(0, 10) : null;
  const tra = d && dataISOEsiste(d.dssTrasmissione) ? String(d.dssTrasmissione).slice(0, 10) : null;
  const mot = (d && d.dssMotivo) || "";
  const veri = (infortuni || []).filter((x) => x && x.tipo === "infortunio" && dataISOEsiste(x.data));
  const graviRegistrati = veri.filter((x) => x.gravita === "grave").length;
  // Confronto STRETTO: un infortunio dello stesso giorno della revisione si
  // considera già dentro il documento. Con `>=` una cava che rivede il DSS il
  // giorno dell'incidente — cioè che fa la cosa giusta — resterebbe rossa.
  const dopo = rev ? veri.filter((x) => String(x.data).slice(0, 10) > rev) : [];
  const graviDopo = dopo.filter((x) => x.gravita === "grave");
  const giorni = rev ? -giorniTra(rev, oggi) : null;
  const scadenzaCertificazione = rev
    ? dataDaPeriodicita(MESI_CERTIF_DSS, new Date(rev + "T00:00:00")) : null;
  const statoCertificazione = rev ? statoScadenza(scadenzaCertificazione, oggi) : "senza data";
  // Tre valori, e il terzo conta: `null` = non lo sappiamo (manca una delle due
  // date). `false` = sappiamo che la revisione in vigore non è stata trasmessa.
  const trasmissioneAllineata = (!rev || !tra) ? null : tra >= rev;

  const base = {
    presente: !!d, documentoId: d ? d.id : null, revisione: rev, motivo: mot,
    motivoNome: (motivoRevisioneDss(mot) || {}).nome || "",
    trasmissione: tra, trasmissioneAllineata, giorniDaRevisione: giorni,
    scadenzaCertificazione, statoCertificazione,
    eventiDopo: dopo, graviDopo: graviDopo.length, graviRegistrati,
  };

  if (!d) return { ...base, noto: false, stato: "assente",
    perche: "Nel registro documenti non c'è nessun DSS collegato a questa cava. Non vuol dire che non "
      + "esista: vuol dire che da qui non lo vediamo, e finché è così questa schermata non dimostra niente." };
  if (!rev) return { ...base, noto: false, stato: "non-databile",
    perche: "Il DSS è in archivio ma non ha una data di revisione leggibile: non è «aggiornato» e non è "
      + "«scaduto», è non databile. Finché quella data manca non si può dire nient'altro." };
  /* Una data di revisione nel FUTURO è un errore di digitazione, e senza questa
     riga darebbe il verde per un anno intero: è la stessa famiglia dello 0% di
     `avanzamentoLotto`, un numero tranquillo prodotto da un dato sbagliato. */
  if (giorni < 0) return { ...base, noto: false, stato: "revisione-futura",
    perche: "La data dell'ultima revisione cade nel futuro (fra " + (-giorni) + " giorni): è un errore di "
      + "compilazione, e tutto quello che verrebbe dopo sarebbe calcolato su una data falsa." };
  if (graviDopo.length) return { ...base, noto: true, stato: "da-aggiornare",
    perche: "Dopo l'ultima revisione " + (graviDopo.length === 1
      ? "è stato registrato un infortunio grave" : "sono stati registrati " + graviDopo.length + " infortuni gravi")
      + ": il DSS va aggiornato." };
  if (statoCertificazione === "scaduta") return { ...base, noto: true, stato: "certificazione-scaduta",
    perche: "Ultima revisione " + giorni + " giorni fa: i dodici mesi sono passati. " + CIECO_DSS };
  if (statoCertificazione === "in-scadenza") return { ...base, noto: true, stato: "certificazione-in-scadenza",
    perche: "Ultima revisione " + giorni + " giorni fa: i dodici mesi scadono entro trenta giorni. " + CIECO_DSS };
  return { ...base, noto: true, stato: "regolare",
    perche: "Ultima revisione " + giorni + " giorni fa, dentro i dodici mesi, e dopo di essa "
      + (graviRegistrati ? "non risultano infortuni gravi" : "Scudo non ha registrato nessun infortunio grave")
      + ". " + CIECO_DSS };
}

/* Chi consuma la bandiera `noto`: sta nel modulo e non nella pagina, come per
   `descriviQualifica`, perché la frase che distingue «non a posto» da «non lo
   sappiamo» va decisa in un posto solo (regola 7 di run-stile). */
export function descriviCicloDss(c) {
  if (!c) return "";
  return (c.noto ? "" : "Non lo sappiamo — ") + c.perche;
}

/* La trasmissione all'autorità di vigilanza è un obbligo SUO, separato
   dall'attualità del documento: si dice su una riga sua, con la sua parola, e
   `null` non diventa mai un sì. */
export function descriviTrasmissioneDss(c) {
  if (!c || !c.presente) return "";
  if (c.trasmissioneAllineata === true)
    return "Trasmesso all'autorità di vigilanza il " + c.trasmissione + ", dopo l'ultima revisione.";
  if (c.trasmissioneAllineata === false)
    return "L'ultimo invio all'autorità di vigilanza (" + c.trasmissione + ") è anteriore alla revisione del "
      + c.revisione + ": la versione in vigore non risulta trasmessa.";
  return c.trasmissione
    ? "Risulta un invio all'autorità di vigilanza il " + c.trasmissione + ", ma senza una data di revisione "
      + "non si sa a quale versione si riferisca."
    : "Non risulta nessun invio all'autorità di vigilanza. Non vuol dire che non sia stato trasmesso: "
      + "vuol dire che qui non ne resta traccia.";
}

/* ⛔ LA FORMA CORTA, E NON È UN VEZZO: LO SCATTO L'HA PRETESA. La riga del
   Quadro ha `-webkit-line-clamp:2`, e mettendoci `descriviCicloDss` il testo
   finiva tagliato a «non è…» — cioè proprio la parte che il principio del
   fondatore esiste per far leggere, morta sullo schermo. Le due uscite giuste
   sono note: o il dato va in un posto suo, o non ci va. Qui va la forma corta,
   che è una frase INTERA; quella lunga vive nella schermata Documenti, dove sta
   in un `form-hint` che non taglia niente. Sta nel modulo, e non nella pagina,
   perché anche la versione corta è una frase sul «non lo so» (regola 7). */
export function sintesiCicloDss(stato) {
  switch (stato) {
    case "assente":                    return "Nessun DSS collegato a questa cava";
    case "non-databile":               return "Manca la data dell'ultima revisione";
    case "revisione-futura":           return "La data di revisione cade nel futuro";
    case "da-aggiornare":              return "Infortunio grave dopo l'ultima revisione";
    case "certificazione-scaduta":     return "Più di dodici mesi dall'ultima revisione";
    case "certificazione-in-scadenza": return "I dodici mesi scadono entro trenta giorni";
    case "regolare":                   return "Rivisto entro i dodici mesi";
    default:                           return "Stato del ciclo non indicato";
  }
}

/* Badge del ciclo. È uno `switch` con `default`, non una mappa: una mappa a cui
   manca uno stato uccide la pagina al disegno (regola 18), e questa funzione di
   stati ne sa dire sette. */
export function etichettaCicloDss(stato) {
  switch (stato) {
    case "assente":                    return { cls: "warn",   label: "Non registrato" };
    case "non-databile":               return { cls: "warn",   label: "Non databile" };
    case "revisione-futura":           return { cls: "warn",   label: "Data da correggere" };
    case "da-aggiornare":              return { cls: "danger", label: "Da aggiornare" };
    case "certificazione-scaduta":     return { cls: "danger", label: "Certificazione scaduta" };
    case "certificazione-in-scadenza": return { cls: "warn",   label: "Certificazione in scadenza" };
    case "regolare":                   return { cls: "ok",     label: "In corso di validità" };
    default:                           return { cls: "warn",   label: "Stato non indicato" };
  }
}

/* Le cave il cui DSS chiede qualcosa, per le urgenze del Quadro: prima i rossi.
   Una cava CHIUSA resta fuori — non ci si lavora — ma una cava attiva senza
   nessun DSS collegato ci entra, ed è la riga più silenziosa di tutte. */
export function dssDaSeguire(documenti, cantieri, infortuni, oggi = new Date()) {
  const peso = (s) => (etichettaCicloDss(s).cls === "danger" ? 0 : 1);
  return (cantieri || [])
    .filter((c) => c && c.tipo === "cava" && c.stato !== "chiuso")
    .map((c) => ({ cantiere: c, ...cicloDss(dssDiCantiere(documenti, c.id)[0] || null, infortuni, oggi) }))
    .filter((r) => r.stato !== "regolare")
    .sort((a, b) => peso(a.stato) - peso(b.stato));
}

// IMPORT DELL'ANAGRAFICA LAVORATORI DA CSV.
//
// Perché è nata qui, il 31/07: era l'UNICO dei diciassette import del prodotto
// scritto dentro la pagina invece che come funzione pura — quindi l'unico che
// nessuna prova poteva guardare. Ed è l'anagrafica delle PERSONE, il primo
// file che una cava carica.
//
// ⚠️ Portandola fuori è venuto a galla un difetto che nella pagina non si
// vedeva: il controllo del doppione guardava solo l'elenco GIÀ in archivio, e
// quell'elenco non si aggiornava mentre il file scorreva. Non è un caso di
// scuola: l'esportazione di Scudo scrive **una riga per ogni scadenza**, così
// un lavoratore con tre scadenze compare tre volte nel suo stesso file.
// Ri-caricandolo — il modo più naturale di spostare i dati da una postazione a
// un'altra — in anagrafica comparivano tre «Rossi». Qui il doppione si toglie
// DENTRO il file, a parità di nome ignorando maiuscole e spazi; il confronto
// con chi è già in archivio resta alla pagina, che è l'unica a conoscerlo.
//
// Colonne: nome;ruolo;telefono (intestazione facoltativa). Si saltano le righe
// senza nome, l'intestazione e la riga «AZIENDA» che l'esportazione usa per le
// scadenze non intestate a nessuno. I nomi sono testo grezzo → escapare dove
// mostrati. Pura e testabile.
export function parseLavoratoriCsv(text) {
  const letti = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .map(r => {
      const [nome, ruolo, tel] = parseCsvLine(r);
      return {
        nome: (nome || "").trim(),
        ruolo: (ruolo || "").trim(),
        tel: (tel || "").trim(),
        attivo: true,
      };
    })
    .filter(l => l.nome && !/^(nome|azienda)$/i.test(l.nome));
  /* Il doppione dentro il file lo toglie la regola CONDIVISA: era nata qui il
     31/07, ma la misura ha detto che lo stesso buco stava in dieci gestori su
     dieci in tutte e sei le app. Una regola che serve a sei app vive in
     shared/ e si CHIAMA, non si ricopia. */
  return senzaDoppioni(letti, l => l.nome);
}

// Import scadenze da CSV (onboarding: caricare lo scadenzario esistente —
// visite mediche, corsi, patentini con le date — invece di riscriverlo a
// mano). Colonne: lavoratore;tipo;descrizione;scadenza (header opzionale).
// Il lavoratore è un NOME (l'associazione all'id avviene a valle, nella UI);
// vuoto o "AZIENDA" = scadenza aziendale (lavoratore null). Tiene solo le
// righe con data valida (AAAA-MM-GG); tipo assente → "Altro". Pura e testabile.
export function parseScadenzeCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "lavoratore"))
    .map(r => {
      const [lavoratore, tipo, descrizione, scadenza] = parseCsvLine(r);
      const lav = (lavoratore || "").trim();
      return {
        lavoratore: (lav && !/^azienda$/i.test(lav)) ? lav : null,
        tipo: (tipo || "").trim() || "Altro",
        descrizione: (descrizione || "").trim() || null,
        dataScadenza: (scadenza || "").trim(),
      };
    })
    /* ⛔ LA FORMA NON È L'ESISTENZA (corretto il 03/08). Questo filtro guardava
       solo `/^\d{4}-\d{2}-\d{2}$/`, e «2026-13-45» ha quella forma: entrava in
       archivio e — con il vecchio `statoScadenzaHSE` — restava verde per sempre.
       Adesso si pretende che la data ESISTA davvero: `Date.parse` la rifiuta, e
       la riga non entra. */
    .filter(p => dataISOEsiste(p.dataScadenza));
}

// ============================================================
// S4 · MANSIONI, REQUISITI DI FORMAZIONE E NOMINE
// La domanda vera del titolare non è «quanti corsi scadono», è: «CHI POSSO
// MANDARE A FARE QUEL LAVORO DOMANI MATTINA?». Per rispondere servono tre
// cose: che lavoro è (la mansione), che cosa serve per farlo (corsi,
// abilitazioni, DPI) e chi ce l'ha davvero.
// Le scadenze NON vivono in un mondo a parte: la formazione richiesta da una
// mansione è una riga dello SCADENZARIO che già esiste, con lo stesso
// semaforo (statoScadenza) usato in tutta l'app. Qui si legge quello, non si
// duplica niente.
// ============================================================

// Confronto "morbido" dei testi: minuscole, senza accenti né punteggiatura.
// Serve a riconoscere che «Corso antincendio» e «Antincendio — aggiornamento
// addetti» parlano della stessa cosa.
export function normalizzaTesto(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

// Etichetta corta (per le pillole della matrice: nello spazio di un badge non
// ci sta «Sorveglianza sanitaria — visita periodica (art. 41)»).
const BREVE_REQUISITO = {
  "sorv-sanitaria": "Visita medica",
  "form-generale":  "Formazione base",
  "form-aggiorn":   "Aggiornamento",
  "form-preposto":  "Preposto",
  "form-dirigente": "Dirigente",
  "primo-soccorso": "Primo soccorso",
  "antincendio":    "Antincendio",
  "rls":            "RLS",
  "patentino-attr": "Abilitazione attrezzature",
  "fochino":        "Fochino",
  "sorvegliante":   "Sorvegliante",
};
// Parole che identificano l'adempimento dentro una descrizione scritta a mano.
// Servono a NON far risultare "mancante" un corso che l'azienda ha già in
// scadenzario solo perché l'ha chiamato con parole sue.
const PAROLE_REQUISITO = {
  "sorv-sanitaria": ["visita medica", "sorveglianza sanitaria", "medico competente", "idoneita"],
  "form-generale":  ["formazione generale", "formazione specifica", "formazione lavoratori", "formazione base"],
  "form-aggiorn":   ["aggiornamento formazione", "aggiornamento lavoratori", "aggiornamento quinquennale"],
  "form-preposto":  ["preposto"],
  "form-dirigente": ["dirigente"],
  "primo-soccorso": ["primo soccorso"],
  "antincendio":    ["antincendio", "antincendi"],
  "rls":            ["rls", "rappresentante dei lavoratori"],
  "patentino-attr": ["abilitazione attrezzature", "patentino", "escavatore", "pale caricatrici", "carrello elevatore", "ple"],
  "fochino":        ["fochino", "brillamento"],
  "sorvegliante":   ["sorvegliante"],
};

// I requisiti che una mansione può richiedere sono gli stessi adempimenti già
// presenti nello scadenzario (SCADENZE_PRESET): stessa etichetta, stessa
// periodicità proposta, stesso riferimento. Così, quando dalla matrice si
// aggiunge un corso mancante, nasce una scadenza IDENTICA a quelle che
// l'utente crea a mano dal menu degli adempimenti tipici.
export const REQUISITI_FORMAZIONE = SCADENZE_PRESET
  .filter(p => p.categoria === "persona" || p.chiave === "sorvegliante")
  .map(p => ({
    chiave: p.chiave, etichetta: p.etichetta, tipo: p.tipo, mesi: p.mesi,
    riferimento: p.riferimento,
    breve: BREVE_REQUISITO[p.chiave] || p.etichetta,
    parole: PAROLE_REQUISITO[p.chiave] || [],
  }));

export function requisitoFormazione(chiave) {
  return REQUISITI_FORMAZIONE.find(r => r.chiave === chiave) || null;
}
// Requisito "sicuro" anche per una chiave sconosciuta (dati vecchi o scritti a
// mano): meglio una riga con l'etichetta grezza che una schermata rotta.
export function requisitoSicuro(chiave) {
  return requisitoFormazione(chiave)
    || { chiave, etichetta: String(chiave || "requisito"), breve: String(chiave || "requisito"),
         tipo: "Formazione", mesi: null, riferimento: "", parole: [] };
}

// Una scadenza dello scadenzario "copre" un requisito?
// Tre modi, dal più sicuro al più tollerante:
//   1. la scadenza è nata da quell'adempimento (campo `preset`/`requisito`);
//   2. la descrizione è la stessa (a meno di maiuscole e accenti);
//   3. la descrizione contiene una delle parole che identificano l'adempimento.
export function scadenzaCopreRequisito(scadenza, req) {
  if (!scadenza || !req) return false;
  const ch = req.chiave;
  if (ch && (scadenza.preset === ch || scadenza.requisito === ch)) return true;
  const a = normalizzaTesto(scadenza.descrizione), b = normalizzaTesto(req.etichetta);
  if (!a) return false;
  if (b && (a === b || a.includes(b) || b.includes(a))) return true;
  return (req.parole || []).some(p => a.includes(normalizzaTesto(p)));
}

// Stato di UN requisito per UNA persona, letto dalle sue scadenze.
// "mancante" = non c'è nessuna riga in scadenzario; altrimenti lo stesso
// semaforo delle scadenze (scaduta / in-scadenza / regolare). Se ci sono più
// righe (rinnovi successivi) vale la più lontana nel tempo: è l'ultimo rinnovo.
export function statoRequisito(req, scadenzeLavoratore, oggi = new Date()) {
  const trovate = (scadenzeLavoratore || []).filter(s => scadenzaCopreRequisito(s, req));
  if (!trovate.length) return { stato: "mancante", scadenza: null, scadenzaId: null, giorni: null };
  const migliore = trovate.slice().sort((a, b) =>
    String(b.dataScadenza || "").localeCompare(String(a.dataScadenza || "")))[0];
  const g = giorniTra(migliore.dataScadenza, oggi);
  return {
    stato: statoScadenza(migliore.dataScadenza, oggi),
    scadenza: migliore.dataScadenza || null,
    scadenzaId: migliore.id || null,
    giorni: Number.isFinite(g) ? g : null,
  };
}

// Mansioni tipiche di una cava, già pronte con i loro requisiti e i loro DPI:
// si sceglie dall'elenco invece di scrivere tutto da zero, e poi si corregge.
// Come per i preset dello scadenzario: è una BASE DI PARTENZA da adattare al
// DVR e al DSS della propria cava, non un elenco di verità di legge.
export const MANSIONI_PRESET = [
  { chiave: "escavatorista", nome: "Escavatorista / palista",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "guanti"] },
  { chiave: "autista", nome: "Autista dumper / camion",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "gilet", "guanti"] },
  { chiave: "perforatore", nome: "Perforatore",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "maschera", "antivibranti"] },
  { chiave: "fochino", nome: "Fochino",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "fochino"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "occhiali", "guanti"] },
  { chiave: "impianto", nome: "Addetto impianto / frantoio",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "maschera", "guanti"] },
  { chiave: "manutentore", nome: "Manutentore / officina",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "occhiali", "guanti", "otoprotettori"] },
  { chiave: "preposto", nome: "Preposto di cava",
    requisiti: ["sorv-sanitaria", "form-generale", "form-preposto"],
    dpi: ["elmetto", "scarpe", "gilet"] },
  { chiave: "sorvegliante", nome: "Sorvegliante",
    requisiti: ["sorv-sanitaria", "form-generale", "sorvegliante"],
    dpi: ["elmetto", "scarpe", "gilet"] },
  { chiave: "uffici", nome: "Ufficio e pesa",
    requisiti: ["sorv-sanitaria", "form-generale"],
    dpi: ["gilet", "scarpe"] },
];
export function mansionePreset(chiave) {
  return MANSIONI_PRESET.find(m => m.chiave === chiave) || null;
}

// ============================================================
// S5 · DPI — CATALOGO E CONSEGNE
// Art. 77 D.Lgs 81/08: i DPI si consegnano in modo documentato, e per i DPI
// di III categoria e per i protettori dell'udito l'ADDESTRAMENTO è
// obbligatorio (in cava sono entrambi la norma, non l'eccezione).
// La "durata" è la vita utile indicativa dichiarata dal costruttore: qui è
// solo una PROPOSTA per calcolare la data di sostituzione, non una regola.
// ============================================================
export const TIPI_DPI = [
  { chiave: "elmetto",       etichetta: "Elmetto",                          breve: "Elmetto",        cat: "II",  addestramento: false, mesi: 60 },
  { chiave: "scarpe",        etichetta: "Scarpe antinfortunistiche",        breve: "Scarpe",         cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "gilet",         etichetta: "Indumenti ad alta visibilità",     breve: "Alta visibilità",cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "guanti",        etichetta: "Guanti da lavoro / antitaglio",    breve: "Guanti",         cat: "II",  addestramento: false, mesi: 12 },
  { chiave: "occhiali",      etichetta: "Occhiali o visiera",               breve: "Occhiali",       cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "otoprotettori", etichetta: "Otoprotettori (cuffie o inserti)", breve: "Otoprotettori",  cat: "II",  addestramento: true,  mesi: 12,
    nota: "Protettori dell'udito: l'addestramento è obbligatorio anche se non sono di III categoria." },
  { chiave: "maschera",      etichetta: "Facciale filtrante / respiratore", breve: "Maschera",       cat: "III", addestramento: true,  mesi: 12,
    nota: "Contro le polveri (silice cristallina respirabile): III categoria, addestramento obbligatorio." },
  { chiave: "imbracatura",   etichetta: "Imbracatura anticaduta",           breve: "Imbracatura",    cat: "III", addestramento: true,  mesi: 12,
    nota: "III categoria: addestramento obbligatorio e controllo periodico del dispositivo." },
  { chiave: "dielettrici",   etichetta: "Guanti e attrezzi dielettrici",    breve: "Dielettrici",    cat: "III", addestramento: true,  mesi: 12,
    nota: "III categoria (rischio elettrico): addestramento obbligatorio." },
  { chiave: "antivibranti",  etichetta: "Guanti antivibranti",              breve: "Antivibranti",   cat: "II",  addestramento: false, mesi: 12 },
  { chiave: "indumenti",     etichetta: "Indumenti da lavoro",              breve: "Indumenti",      cat: "I",   addestramento: false, mesi: null },
  { chiave: "altro",         etichetta: "Altro DPI",                        breve: "Altro DPI",      cat: "II",  addestramento: false, mesi: null },
];
export function tipoDpi(chiave) {
  return TIPI_DPI.find(t => t.chiave === chiave) || null;
}
export function tipoDpiSicuro(chiave) {
  return tipoDpi(chiave)
    || { chiave, etichetta: String(chiave || "DPI"), breve: String(chiave || "DPI"), cat: "II", addestramento: false, mesi: null };
}

// Ultima consegna di quel tipo di DPI a quella persona (la più recente).
export function ultimaConsegnaDpi(consegne, lavoratoreId, tipo) {
  const list = (consegne || []).filter(c => c.lavoratoreId === lavoratoreId && c.tipo === tipo);
  if (!list.length) return null;
  return list.slice().sort((a, b) =>
    String(b.dataConsegna || "").localeCompare(String(a.dataConsegna || "")))[0];
}
// Stato di una consegna: "mancante" (mai consegnato) oppure lo stesso semaforo
// delle scadenze sulla data di sostituzione. `addestramentoMancante` è vero
// quando il tipo lo richiede e non risulta fatto.
//
// ⛔ UNA CONSEGNA SENZA DATA DI SOSTITUZIONE NON È «REGOLARE» — decisione 14
// del fondatore, 02/08. Fino a quel giorno il ternario qui sotto rispondeva
// `"regolare"` quando la casella era vuota, e da lì in poi quel dispositivo
// non produceva **mai più** un avviso di sostituzione: nella tabella la data
// si leggeva «—» e nel riepilogo il pezzo risultava a posto. Su un facciale
// filtrante contro la silice quel verde diceva una cosa che nessuno aveva
// misurato — il form la scadenza la PROPONE dai mesi del tipo, ma si può
// svuotare, e allora l'unica cosa che si sa è che il DPI è stato consegnato.
// La risposta è `"senza data"`, che NON è una parola nuova: è la convenzione
// che `statoScadenzaHSE` usa già in tre app, e che i trenta punti di Scudo che
// confrontano con `!== "regolare"` cominciano da soli a mostrare fra le cose
// da guardare. Basta quindi togliere il ternario e lasciar rispondere lei.
// `nonScade` è la via d'uscita, e serve: `TIPI_DPI` ha due voci con `mesi:
// null` (indumenti da lavoro, «altro DPI») per cui una data non si può
// nemmeno proporre. Chi dichiara che quel pezzo non ha una vita utile lo
// scrive, e da quel momento il verde è una risposta MISURATA invece che un
// vuoto travestito.
export function statoConsegnaDpi(consegna, oggi = new Date()) {
  if (!consegna) return { stato: "mancante", scadenza: null, addestramentoMancante: false, nonScade: false };
  const t = tipoDpi(consegna.tipo);
  const nonScade = consegna.nonScade === true;
  return {
    stato: nonScade ? "regolare" : statoScadenza(consegna.scadenza, oggi),
    scadenza: consegna.scadenza || null,
    addestramentoMancante: !!(t && t.addestramento) && !consegna.addestramento,
    nonScade,
  };
}

// ============================================================
// LA MATRICE: chi può fare quel lavoro domani mattina
// Quattro risposte, perché di mattina non c'è tempo di leggere una tabella:
//   · "puo"      → può andare;
//   · "attenzione" → può andare, ma c'è qualcosa da sistemare (un corso che
//                    scade, un DPI da consegnare o un addestramento da fare);
//   · "non-so"   → non lo sappiamo: nessuno ha ancora scritto che cosa serve
//                  per questa mansione (decisione 14 → vedi qui sotto);
//   · "no"       → non può: manca o è scaduto qualcosa di bloccante.
// Bloccano: persona non in forza, idoneità sanitaria negativa, un corso
// richiesto mancante o scaduto. I DPI NON bloccano ma pesano: l'app sa se la
// consegna è REGISTRATA, non se il lavoratore ha l'elmetto in mano — dirlo
// come certezza sarebbe una bugia. Restano in evidenza, non nascosti.
//
// ⛔ LA QUARTA RISPOSTA — decisione 13 del fondatore, 02/08. Una mansione
// creata, con le persone assegnate, ma per cui **nessuno ha ancora scritto
// quali corsi servono**: fino a quel giorno tutti risultavano «può andare», in
// verde. Tecnicamente coerente — non è richiesto niente, quindi non manca
// niente — ma le due letture di quel verde sono opposte: «questa mansione non
// richiede corsi particolari» oppure «nessuno ha ancora detto che cosa serve»,
// che su una mansione appena creata è il caso più probabile. Il fondatore ha
// scelto: **non lo sappiamo**, uno stato suo, distinto sia da «può» sia da
// «non può», e i conteggi lo dicono invece di assorbirlo nel verde.
// La via d'uscita è una dichiarazione, non un silenzio: `nessunRequisito` sulla
// mansione vuol dire «per questo lavoro non servono corsi», e da quel momento
// il verde torna a essere una risposta misurata.
// ============================================================

/* Il verso in cui le quattro risposte si scavalcano, in una funzione sua e non
   dentro un ternario lungo: è una MAPPA DI STATI, e la regola 18 di
   `run-stile.mjs` la può leggere solo se le risposte stanno in dei `return`.
   ⛔ L'ordine non è estetico. «no» viene per primo anche quando i requisiti
   sono ignoti, perché un bloccante è una cosa MISURATA (non è in forza, è
   stato giudicato non idoneo alla visita): quella la sappiamo, e sapere che
   non può andare batte non sapere che cosa gli servirebbe.
   E «non-so» viene PRIMA di «attenzione» perché «attenzione» afferma «può
   andare, ma…», e quel «può andare» è esattamente ciò che non si può dire. */
export function esitoAbilitazione(bloccanti, attenzioni, requisitiIgnoti) {
  if ((bloccanti || []).length) return "no";
  if (requisitiIgnoti) return "non-so";
  if ((attenzioni || []).length) return "attenzione";
  return "puo";
}

/* «Di questa mansione non si sa che cosa richieda»: nessun requisito censito e
   nessuno ha dichiarato che non ne servono. Una mansione che dichiara
   `nessunRequisito` ha una risposta, ed è «non ne servono». */
export function requisitiIgnoti(mansione) {
  const m = mansione || {};
  if (m.nessunRequisito === true) return false;
  return !((m.requisiti || []).length);
}
export function abilitazioneLavoratore(lav, mansione, scadenze, consegneDpi, oggi = new Date()) {
  const l = lav || {};
  const scLav = (scadenze || []).filter(s => s.lavoratoreId === l.id);
  const requisiti = ((mansione && mansione.requisiti) || []).map(ch => {
    const req = requisitoSicuro(ch);
    const st = statoRequisito(req, scLav, oggi);
    return { chiave: req.chiave, etichetta: req.etichetta, breve: req.breve, mesi: req.mesi, ...st };
  });
  const dpi = ((mansione && mansione.dpi) || []).map(ch => {
    const t = tipoDpiSicuro(ch);
    const c = ultimaConsegnaDpi(consegneDpi, l.id, ch);
    const st = statoConsegnaDpi(c, oggi);
    return { chiave: t.chiave, etichetta: t.etichetta, breve: t.breve || t.etichetta, cat: t.cat, consegna: c, ...st };
  });
  const bloccanti = [], attenzioni = [];
  if (l.attivo === false) bloccanti.push("non è in forza");
  if (l.idoneita === "non-idoneo") bloccanti.push("giudicato non idoneo alla visita medica");
  if (l.idoneita === "prescrizioni") attenzioni.push("idoneo con prescrizioni");
  for (const r of requisiti) {
    if (r.stato === "mancante") bloccanti.push("manca " + r.breve.toLowerCase());
    else if (r.stato === "scaduta") bloccanti.push(r.breve.toLowerCase() + " scaduta il " + dataIt(r.scadenza));
    else if (r.stato === "in-scadenza") attenzioni.push(r.breve.toLowerCase() + " in scadenza");
  }
  for (const d of dpi) {
    if (d.stato === "mancante") attenzioni.push(d.etichetta.toLowerCase() + ": consegna mai registrata");
    else if (d.stato === "scaduta") attenzioni.push(d.etichetta.toLowerCase() + " da sostituire");
    else if (d.stato === "in-scadenza") attenzioni.push(d.etichetta.toLowerCase() + " in scadenza");
    // decisione 14: consegnato, ma nessuno ha detto entro quando va sostituito
    else if (d.stato === "senza data") attenzioni.push(d.etichetta.toLowerCase() + ": " + MOTIVO_SENZA_SOSTITUZIONE);
    if (d.addestramentoMancante && d.stato !== "mancante") attenzioni.push("addestramento " + d.etichetta.toLowerCase() + " da registrare");
  }
  const ignoti = requisitiIgnoti(mansione);
  const esito = esitoAbilitazione(bloccanti, attenzioni, ignoti);
  return { lavoratore: l, mansione: mansione || null, requisiti, dpi, bloccanti, attenzioni,
           requisitiIgnoti: ignoti, esito };
}

// La matrice di UNA mansione: una riga per persona, prima chi può andare.
export function matriceMansione(mansione, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  const ids = (mansione && mansione.lavoratoriIds) || [];
  const ordine = { puo: 0, attenzione: 1, "non-so": 2, no: 3 };
  return ids
    .map(id => (lavoratori || []).find(l => l.id === id))
    .filter(Boolean)
    .map(l => abilitazioneLavoratore(l, mansione, scadenze, consegneDpi, oggi))
    .sort((a, b) => (ordine[a.esito] - ordine[b.esito])
      || String(a.lavoratore.nome || "").localeCompare(String(b.lavoratore.nome || ""), "it"));
}

// Riepilogo di tutte le mansioni (per il quadro d'insieme e per il grafico):
// quante persone possono andare, quante con riserva, quante no.
export function riepilogoMansioni(mansioni, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  return (mansioni || []).map(m => {
    const righe = matriceMansione(m, lavoratori, scadenze, consegneDpi, oggi);
    return {
      mansione: m, totale: righe.length,
      puo: righe.filter(r => r.esito === "puo").length,
      attenzione: righe.filter(r => r.esito === "attenzione").length,
      /* decisione 13: le persone di cui non si sa. NON si sommano ai «puo» —
         era esattamente quello che succedeva prima, e il numero verde in cima
         alla matrice le contava fra chi può andare domani mattina. */
      nonSo: righe.filter(r => r.esito === "non-so").length,
      no: righe.filter(r => r.esito === "no").length,
      requisitiIgnoti: requisitiIgnoti(m),
      righe,
    };
  }).sort((a, b) => (b.no - a.no) || (b.attenzione - a.attenzione) || (b.nonSo - a.nonSo)
    || String(a.mansione.nome || "").localeCompare(String(b.mansione.nome || ""), "it"));
}

// Le persone che oggi NON possono fare almeno una delle mansioni assegnate:
// è il numero che va in cima al Quadro, perché è quello che ferma il lavoro.
export function lavoratoriScoperti(mansioni, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  const per = new Map();
  for (const m of mansioni || []) {
    for (const r of matriceMansione(m, lavoratori, scadenze, consegneDpi, oggi)) {
      if (r.esito !== "no") continue;
      const id = r.lavoratore.id;
      const v = per.get(id) || { lavoratore: r.lavoratore, mansioni: [], motivi: [] };
      v.mansioni.push(m.nome);
      for (const b of r.bloccanti) if (!v.motivi.includes(b)) v.motivi.push(b);
      per.set(id, v);
    }
  }
  return [...per.values()].sort((a, b) =>
    String(a.lavoratore.nome || "").localeCompare(String(b.lavoratore.nome || ""), "it"));
}

// ============================================================
// NOMINE DELLA SICUREZZA
// In cava il SORVEGLIANTE è obbligatorio (D.Lgs 624/96) e il PREPOSTO va
// individuato formalmente (D.Lgs 81/08, modificato dal D.L. 146/2021): non
// basta che qualcuno "faccia da capo". Qui si tiene chi è nominato, da
// quando, e se la formazione collegata è in regola — sempre leggendo lo
// scadenzario, mai un elenco parallelo.
// Nota informativa, non un parere legale: obblighi e figure vanno confermati
// con l'RSPP e il consulente dell'azienda.
// ============================================================
export const NOMINE_RUOLI = [
  { chiave: "sorvegliante", etichetta: "Sorvegliante", breve: "Sorvegliante", obbligatoria: true, multiplo: true,
    requisito: "sorvegliante",
    riferimento: "D.Lgs 624/96 — figura obbligatoria nelle attività estrattive.",
    spiega: "È chi controlla ogni giorno i luoghi di lavoro della cava e ferma ciò che non va." },
  { chiave: "direttore", etichetta: "Direttore responsabile", breve: "Direttore", obbligatoria: true, multiplo: false,
    requisito: null,
    riferimento: "D.Lgs 624/96 — responsabile della conduzione dell'attività estrattiva.",
    spiega: "È la persona che risponde della conduzione tecnica della cava." },
  { chiave: "preposto", etichetta: "Preposto", breve: "Preposto", obbligatoria: true, multiplo: true,
    requisito: "form-preposto",
    riferimento: "D.Lgs 81/08 e D.L. 146/2021 — individuazione obbligatoria e aggiornamento almeno biennale.",
    spiega: "Sovrintende al lavoro degli altri e interviene subito se qualcuno lavora male." },
  { chiave: "rspp", etichetta: "RSPP", breve: "RSPP", obbligatoria: true, multiplo: false, requisito: null,
    riferimento: "D.Lgs 81/08 art. 17 — designazione obbligatoria, non delegabile dal datore di lavoro.",
    spiega: "Responsabile del servizio di prevenzione e protezione: interno o consulente esterno." },
  { chiave: "medico", etichetta: "Medico competente", breve: "Medico", obbligatoria: true, multiplo: false, requisito: null,
    riferimento: "D.Lgs 81/08 art. 18 — obbligatorio quando è prevista la sorveglianza sanitaria (in cava, di norma, sì).",
    spiega: "Fa le visite mediche e decide l'idoneità alla mansione." },
  { chiave: "rls", etichetta: "RLS", breve: "RLS", obbligatoria: true, multiplo: true, requisito: "rls",
    riferimento: "D.Lgs 81/08 artt. 47-50 — rappresentante dei lavoratori per la sicurezza.",
    spiega: "Eletto dai lavoratori: va formato e aggiornato ogni anno." },
  { chiave: "primo-soccorso", etichetta: "Addetto primo soccorso", breve: "Primo soccorso", obbligatoria: true, multiplo: true,
    requisito: "primo-soccorso",
    riferimento: "D.Lgs 81/08 art. 45 e D.M. 388/2003 — addetti designati e formati.",
    spiega: "Deve essercene almeno uno presente quando si lavora." },
  { chiave: "antincendio", etichetta: "Addetto antincendio ed evacuazione", breve: "Antincendio", obbligatoria: true, multiplo: true,
    requisito: "antincendio",
    riferimento: "D.Lgs 81/08 art. 43 e D.M. 2 settembre 2021 — addetti designati e formati.",
    spiega: "Deve essercene almeno uno presente quando si lavora." },
  { chiave: "dirigente", etichetta: "Dirigente", breve: "Dirigente", obbligatoria: false, multiplo: true,
    requisito: "form-dirigente",
    riferimento: "D.Lgs 81/08 — chi organizza il lavoro con poteri di spesa e decisione.",
    spiega: "Serve solo se in azienda c'è davvero questa figura." },
];
export function ruoloNomina(chiave) {
  return NOMINE_RUOLI.find(r => r.chiave === chiave) || null;
}
// Una nomina è ATTIVA oggi se è già decorsa e non è ancora finita.
export function nominaAttiva(n, oggi = new Date()) {
  if (!n) return false;
  if (n.dal) { const g = giorniTra(n.dal, oggi); if (Number.isFinite(g) && g > 0) return false; }
  if (n.al)  { const g = giorniTra(n.al, oggi);  if (Number.isFinite(g) && g < 0) return false; }
  return true;
}
// L'organigramma della sicurezza: un blocco per ruolo, con chi c'è e com'è
// messa la sua formazione. `mancante` = ruolo obbligatorio senza nessuno.
export function organigrammaSicurezza(nomine, lavoratori, scadenze, oggi = new Date()) {
  return NOMINE_RUOLI.map(r => {
    const attive = (nomine || []).filter(n => n.ruolo === r.chiave && nominaAttiva(n, oggi));
    const req = r.requisito ? requisitoFormazione(r.requisito) : null;
    const persone = attive.map(n => {
      const l = (lavoratori || []).find(x => x.id === n.lavoratoreId) || null;
      const form = (req && l)
        ? statoRequisito(req, (scadenze || []).filter(s => s.lavoratoreId === l.id), oggi)
        : null;
      return { nomina: n, lavoratore: l, requisito: req, formazione: form };
    });
    const senzaFormazione = persone.filter(p => p.formazione &&
      (p.formazione.stato === "mancante" || p.formazione.stato === "scaduta")).length;
    const inScadenza = persone.filter(p => p.formazione && p.formazione.stato === "in-scadenza").length;
    // ⛔ UNA NOMINA COPRE IL RUOLO SOLO SE LA PERSONA C'È ANCORA.
    // Una nomina che punta a un lavoratore cancellato dall'anagrafica — o non
    // più in forza — non copre niente: il ruolo è scoperto. Prima il conto
    // guardava soltanto quante nomine c'erano, e otto ruoli obbligatori di
    // legge (RSPP, medico competente, sorvegliante…) restavano VERDI su una
    // sedia vuota. La nomina resta comunque nell'elenco: si deve poter capire
    // chi era, e la pagina lo scrive («persona non più in anagrafica»).
    const valide = persone.filter(p => p.lavoratore && p.lavoratore.attivo !== false);
    const senzaPersona = persone.length - valide.length;
    const mancante = !!r.obbligatoria && valide.length === 0;
    /* ⛔ UNA NOMINA SENZA LA DATA DA CUI DECORRE È UNA NOMINA CHE NON SI PUÒ
       DIMOSTRARE. `nominaAttiva` la tiene per attiva — ed è giusto, il contrario
       direbbe «nessuno è nominato» su un ruolo che una persona ce l'ha — ma il
       ruolo usciva verde e la pastiglia diceva «Nomina attiva» / «In regola»:
       il colore tranquillo su un dato che nessuno ha scritto. È un avviso, non
       un allarme (la persona c'è), quindi giallo e non rosso.
       Il form scrive sempre una data (`dal || oggiISO()`): ci si arriva con un
       import o con un dato vecchio. `dataISOEsiste` e non `!n.dal`, perché una
       data impossibile — «2025-02-30» — è illeggibile quanto una mancante. */
    const senzaData = valide.filter(p => !dataISOEsiste(p.nomina.dal)).length;
    const stato = (mancante || senzaFormazione || senzaPersona) ? "danger"
      : (inScadenza || senzaData) ? "warn" : (valide.length ? "ok" : "mute");
    return { ruolo: r, persone, valide, senzaPersona, senzaData, mancante, senzaFormazione, inScadenza, stato, requisito: req };
  });
}
// Quello che va sistemato subito: ruoli obbligatori scoperti e nominati senza
// la formazione in regola. Alimenta le urgenze del Quadro.
export function nomineDaSistemare(organigramma) {
  return (organigramma || []).filter(x => x.stato === "danger");
}

// ============================================================
// DPI: quello che deve EMERGERE
// Un elenco di consegne non serve a niente se non dice chi è scoperto. Qui si
// incrociano le mansioni (che dicono quali DPI servono) con le consegne
// registrate: mai consegnato, da sostituire, addestramento non registrato.
// ============================================================
// ⛔ IL MOTIVO SI SCRIVE UNA VOLTA SOLA. `riepilogoDpi` conta le righe
// cercando il motivo DENTRO il testo (`motivo.includes(...)`): due stesure
// della stessa frase, in due punti di `allarmiDpi`, e il conteggio ne vedrebbe
// una sola — senza nessun errore da leggere. La frase è distinta da «da
// sostituire» di proposito: sono due lavori diversi, uno è comprare il pezzo
// nuovo, l'altro è andare a leggere il libretto del costruttore.
export const MOTIVO_SENZA_SOSTITUZIONE = "senza data di sostituzione";

export function allarmiDpi(mansioni, lavoratori, consegne, oggi = new Date()) {
  const out = [], indice = new Map();
  const lavById = Object.fromEntries((lavoratori || []).map(l => [l.id, l]));
  // Una riga per persona e dispositivo: se sullo stesso elmetto c'è più di un
  // problema (scaduto E senza addestramento) si scrivono nella stessa riga.
  // Due righe uguali una sotto l'altra sembrano un errore del programma.
  const aggiungi = (lav, tipo, etichetta, motivo, gravita, mansione, scadenza, consegnaId, addestramento) => {
    const k = lav.id + "|" + tipo;
    const gia = indice.get(k);
    if (gia) {
      if (!gia.motivo.includes(motivo)) gia.motivo += " · " + motivo;
      if (gravita === "danger") gia.gravita = "danger";
      if (!gia.mansione && mansione) gia.mansione = mansione;
      if (addestramento) gia.addestramento = true;
      return;
    }
    const rec = { lavoratoreId: lav.id, lavoratore: lav.nome, tipo, etichetta, motivo, gravita,
      mansione: mansione || "", scadenza: scadenza || null, consegnaId: consegnaId || null,
      addestramento: !!addestramento };
    indice.set(k, rec);
    out.push(rec);
  };
  for (const m of mansioni || []) {
    for (const id of m.lavoratoriIds || []) {
      const l = lavById[id];
      if (!l || l.attivo === false) continue;
      for (const ch of m.dpi || []) {
        const t = tipoDpiSicuro(ch);
        const c = ultimaConsegnaDpi(consegne, id, ch);
        const st = statoConsegnaDpi(c, oggi);
        const cid = c ? c.id : null;
        if (st.stato === "mancante") aggiungi(l, ch, t.etichetta, "mai consegnato", "danger", m.nome, null, null, false);
        else if (st.stato === "scaduta") aggiungi(l, ch, t.etichetta, "da sostituire", "danger", m.nome, st.scadenza, cid, false);
        else if (st.stato === "in-scadenza") aggiungi(l, ch, t.etichetta, "in scadenza", "warn", m.nome, st.scadenza, cid, false);
        // decisione 14: è GIALLO, non rosso — il dispositivo c'è, quello che
        // manca è la data entro cui va sostituito. Non si sa se è ancora buono.
        else if (st.stato === "senza data") aggiungi(l, ch, t.etichetta, MOTIVO_SENZA_SOSTITUZIONE, "warn", m.nome, null, cid, false);
        if (st.addestramentoMancante && st.stato !== "mancante")
          aggiungi(l, ch, t.etichetta, "addestramento non registrato", "warn", m.nome, null, cid, true);
      }
    }
  }
  // Addestramento mancante anche fuori dalle mansioni: un DPI di III categoria
  // consegnato senza addestramento è comunque una cosa fuori posto (art. 77).
  for (const c of consegne || []) {
    const l = lavById[c.lavoratoreId];
    if (!l || l.attivo === false) continue;
    const t = tipoDpiSicuro(c.tipo);
    const st = statoConsegnaDpi(c, oggi);
    if (st.stato === "scaduta") aggiungi(l, c.tipo, t.etichetta, "da sostituire", "danger", "", st.scadenza, c.id, false);
    if (st.stato === "senza data") aggiungi(l, c.tipo, t.etichetta, MOTIVO_SENZA_SOSTITUZIONE, "warn", "", null, c.id, false);
    if (st.addestramentoMancante) aggiungi(l, c.tipo, t.etichetta, "addestramento non registrato", "warn", "", null, c.id, true);
  }
  const peso = { danger: 0, warn: 1 };
  return out.sort((a, b) => (peso[a.gravita] - peso[b.gravita])
    || String(a.lavoratore || "").localeCompare(String(b.lavoratore || ""), "it"));
}

export function riepilogoDpi(consegne, allarmi) {
  const list = consegne || [], al = allarmi || [];
  return {
    consegne: list.length,
    persone: new Set(list.map(c => c.lavoratoreId)).size,
    daSistemare: al.length,
    mancanti: al.filter(a => a.motivo.includes("mai consegnato")).length,
    daSostituire: al.filter(a => a.motivo.includes("da sostituire")).length,
    addestramenti: al.filter(a => a.motivo.includes("addestramento non registrato")).length,
    // decisione 14: il conteggio deve DIRLO, non assorbirlo nel verde.
    senzaSostituzione: al.filter(a => a.motivo.includes(MOTIVO_SENZA_SOSTITUZIONE)).length,
  };
}

// Righe del VERBALE DI CONSEGNA di una persona: tutte le consegne, dalla più
// recente. È il foglio che in ispezione viene chiesto per primo (art. 77).
export function verbaleDpi(lavoratore, consegne, oggi = new Date()) {
  const id = lavoratore && lavoratore.id;
  const righe = (consegne || []).filter(c => c.lavoratoreId === id)
    .slice().sort((a, b) => String(b.dataConsegna || "").localeCompare(String(a.dataConsegna || "")))
    .map(c => {
      const t = tipoDpiSicuro(c.tipo);
      const st = statoConsegnaDpi(c, oggi);
      return { consegna: c, tipo: t, stato: st.stato,
        addestramentoRichiesto: !!t.addestramento, addestramentoFatto: !!c.addestramento };
    });
  return {
    lavoratore: lavoratore || null,
    righe,
    conAddestramento: righe.filter(r => r.addestramentoRichiesto).length,
    addestramentiMancanti: righe.filter(r => r.addestramentoRichiesto && !r.addestramentoFatto).length,
  };
}

/* LA CARTELLA DEL LAVORATORE — il fascicolo che si esibisce all'ispettore.
   ═══════════════════════════════════════════════════════════════════════
   Era l'ultimo pezzo davvero mancante dei cinque documenti prioritari: il
   verbale DPI si stampava già, la cartella no.

   ⛔ NON CALCOLA NIENTE DI NUOVO, ed è il punto. Tutto quello che serve Scudo
   lo sa già dire — `statoScadenza`, `matriceMansione`, `verbaleDpi`,
   `nominaAttiva`. Questa funzione mette in fila per UNA persona quello che
   l'app sa già, nell'ordine in cui un ispettore lo chiede. Scriverci dentro un
   secondo calcolo sarebbe l'ennesima copia di una regola.

   ⛔ QUELLO CHE INVECE VALE LA PENA SCRIVERE È `vuoti`, e la ragione è che un
   fascicolo stampato mente **per omissione**: una sezione vuota su un foglio
   che esce dalla stampante si legge «a questa persona non serve», mentre la
   verità è «non è stato registrato niente». Sono due frasi diverse davanti a
   un ispettore, e la seconda va scritta.
   Il caso che ha cambiato il disegno mentre lo provavo in scratchpad: una
   persona **senza mansione**. Il primo prototipo la trattava come chiunque
   altro e la cartella usciva con corsi e DPI vuoti — che si legge «non gli
   spetta niente». Senza mansione invece non si SA che cosa gli spetti: è
   `matriceMansione` a dirlo, e senza mansione quella domanda non ha risposta.

   `completa` è false appena c'è un vuoto: un fascicolo senza dati non è il
   fascicolo di una persona in regola, è un fascicolo non compilato. */
export function cartellaLavoratore(lavoratore, dati, oggi = new Date()) {
  const l = lavoratore || null;
  if (!l) return { trovato: false, motivo: "Nessun lavoratore scelto.", vuoti: [], completa: false };
  const d = dati || {};
  const scadenze = d.scadenze || [], mansioni = d.mansioni || [],
        dpi = d.dpi || [], nomine = d.nomine || [], documenti = d.documenti || [];

  const sue = scadenze
    .filter(s => s && String(s.lavoratoreId || "") === String(l.id))
    /* ⚠️ `statoScadenza` prende la DATA e restituisce una stringa, non prende
       la riga e non restituisce un oggetto: passandogli la scadenza intera
       rispondeva «senza data» su righe che la data ce l'hanno. Misurato, non
       indovinato — ed è la stessa lezione del `scadenzeDiChiLavora` di poco fa. */
    .map(s => ({ scadenza: s, stato: statoScadenza(s.dataScadenza, oggi) }));
  const mie = mansioni.filter(m => (m.lavoratoriIds || []).includes(l.id));
  const verbale = verbaleDpi(l, dpi, oggi);
  const sueNomine = nomine.filter(n => n.lavoratoreId === l.id && nominaAttiva(n, oggi));
  const suoiDoc = documenti.filter(x => x.lavoratoreId === l.id);

  const vuoti = [];
  if (!mie.length)
    vuoti.push("Nessuna mansione assegnata: senza mansione non si sa quali corsi e quali DPI gli spettino.");
  if (!sue.length)
    vuoti.push("Nessuna scadenza registrata: non vuol dire «in regola», vuol dire che non è stato registrato niente.");
  if (!verbale.righe.length)
    vuoti.push("Nessun DPI consegnato risulta a registro.");

  return {
    trovato: true, lavoratore: l,
    scadenze: sue, mansioni: mie, verbale, nomine: sueNomine, documenti: suoiDoc,
    vuoti, completa: vuoti.length === 0,
  };
}

/* La frase che chiude la cartella, scritta dal modulo per la stessa ragione di
   `descriviBaseOnere` in Terra: quello che un documento dichiara è una REGOLA,
   e chi la scrive dev'essere uno solo. Legge `completa`, che altrimenti
   sarebbe una bandiera che non guarda nessuno (regola 20 di run-stile). */
export function descriviCartella(cartella) {
  const c = cartella || {};
  if (!c.trovato) return c.motivo || "Cartella non disponibile.";
  if (c.completa)
    return "Tutte le sezioni della cartella contengono dati registrati in Scudo alla data di stampa.";
  /* ⚠️ NON ri-elenca i vuoti: quelli li scrive già ogni sezione, e sul foglio
     stampato la ripetizione era tre righe di rumore in fondo a un documento
     che va letto in fretta. Qui si dice la cosa che le sezioni NON dicono —
     come vanno lette. L'elenco resta in `vuoti`, per chi lo vuole (la modale
     lo usa, perché lì le sezioni non ci sono). */
  const n = c.vuoti.length;
  return "⚠️ Questa cartella non è completa: " + n
    + (n === 1 ? " sezione è senza righe" : " sezioni sono senza righe")
    + ". Le sezioni senza righe non vanno lette come «non dovuto»: vanno compilate.";
}

/* ⛔ CHI NON HA NEMMENO UNA SCADENZA NON È «REGOLARE»: È NON VERIFICATO.
   `regolari` è il numero verde in cima al Quadro, e ci finiva dentro anche la
   persona di cui non è stata registrata NESSUNA riga — né visita medica, né
   formazione, né patentino — cioè esattamente quella di cui non si sa niente.
   Nella dimostrazione erano due su sette, e nessuna delle due si distingueva
   da chi ha davvero tutto in ordine.
   La regola non è nuova e non è nostra: `idoneitaDiTurno`, in
   `shared/dw-ponti.js`, tiene `senzaScadenze` FUORI dai regolari e scrive la
   ragione — «sommarlo ai tutto a posto trasformerebbe un non lo so in un sì».
   Era scritta lì per Campo e violata qui.
   `senzaScadenze` sta a parte e non si somma: non è un allarme (una persona
   appena assunta ci passa) ma nemmeno un «a posto», e chi guarda deve leggerlo. */
export function kpiFrom(lavoratori, scadenze) {
  const st = scadenze.map(s => statoScadenza(s.dataScadenza));
  const scadute = st.filter(x => x === "scaduta").length;
  const trenta = st.filter(x => x === "in-scadenza").length;
  const conProblemi = new Set(
    scadenze.filter(s => statoScadenza(s.dataScadenza) !== "regolare")
            .map(s => s.lavoratoreId).values());
  const conScadenze = new Set(scadenze.map(s => s.lavoratoreId));
  const attivi = lavoratori.filter(l => l.attivo);
  return {
    scadute, trenta,
    regolari: attivi.filter(l => conScadenze.has(l.id) && !conProblemi.has(l.id)).length,
    senzaScadenze: attivi.filter(l => !conScadenze.has(l.id)).length,
  };
}

// ── PONTE CON SENTINELLA, LATO DEMO ──────────────────────────────────
// In LIVE non serve niente di tutto questo: Sentinella scrive le sue
// azioni nella collezione `azioni` di Scudo passando dallo SDK
// (orgCollection sull'appId "scudo"), e Scudo se le ritrova insieme alle
// altre. In demo/tour, invece, non esiste nessun backend e le due app sono
// due pagine diverse: il "finto backend" condiviso è una riga di
// localStorage. Copia gemella (stessa chiave) in
// apps/sentinella/sentinella-data.js, che le scrive.
// Se localStorage non è disponibile (navigazione privata, quota piena) si
// prosegue senza: la pagina non si rompe, semplicemente non vede il ponte.
const PONTE_DEMO_KEY = "deepwork.demo.azioni-ponte";
function ponteDemoLeggi() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(PONTE_DEMO_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}
function ponteDemoScrivi(lista) {
  try { globalThis.localStorage.setItem(PONTE_DEMO_KEY, JSON.stringify((lista || []).slice(-200))); return true; }
  catch (e) { return false; }
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P3 CON CAMPO — la regola sta in `shared/dw-ponti.js` perché serve a due
// app, e Scudo la ri-esporta col nome con cui la chiamano le sue pagine.
// ══════════════════════════════════════════════════════════════════════
export { inTurnoOggi, scadenzeDiChiLavora } from "../../shared/dw-ponti.js";

export async function scudoData() {
  // tenta il backend reale; qualunque problema → demo (tour/mockup)
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "scudo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, deleteDoc, doc, updateDoc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        lavoratori: () => read("lavoratori"),
        scadenze:   () => read("scadenze"),
        documenti:  () => read("documenti"),
        infortuni:  () => read("infortuni"),
        /* le ore lavorate dell'anno: senza di queste gli indici infortunistici
           non si calcolano, e non si stimano. Un'organizzazione che non le ha
           mai scritte legge una lista vuota, come per gli incassi. */
        oreAnno:    () => read("oreAnno"),
        cantieri:   () => read("cantieri"),
        azioni:     () => read("azioni"),
        ispezioni:  () => read("ispezioni"),
        // Collezioni di S4/S5: le organizzazioni già attive non le hanno
        // ancora. Firestore, su una collezione che non esiste, risponde con
        // un elenco vuoto: le schermate si aprono vuote, non si rompono.
        mansioni:   () => read("mansioni"),
        nomine:     () => read("nomine"),
        dpi:        () => read("dpi"),
        /* l'analisi della causa degli eventi. Come le collezioni di S4/S5: chi
           non ne ha mai scritta una legge un elenco vuoto, e il registro si
           apre con tutti gli eventi «senza un perché» — che è la verità. */
        analisi:    () => read("analisi"),
        /* le imprese esterne e i loro appalti. Come le collezioni di S4/S5:
           chi non le ha mai scritte legge un elenco vuoto — e la schermata NON
           dice «tutto a posto», dice che non c'è ancora niente da mostrare. */
        appaltatori: () => read("appaltatori"),
        appalti:     () => read("appalti"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
      // ── PONTE P3 CON CAMPO — SOLA LETTURA ─────────────────────────────
      // Il gemello di quello che Campo ha verso Scudo: seconda istanza dell'SDK
      // sull'app "campo", stessa organizzazione, percorso da `orgCollection`.
      // Scudo LEGGE chi è schierato e non tocca niente: le squadre si fermano e
      // si rimettono in turno in Campo, che resta l'unica strada per quel dato.
      // Se Campo non c'è torna null, e lo scadenzario resta quello di sempre —
      // senza fingere che non stia lavorando nessuno, che darebbe «niente da
      // fermare» proprio quando non si è guardato.
      let idCampo;                     // undefined = mai provato, null = non c'è
      const leggiCampo = async (nome) => {
        if (idCampo === undefined) {
          try { idCampo = await DeepworkID.init({ appId: "campo" }); }
          catch (e) { idCampo = null; }
        }
        if (!idCampo) return null;
        try {
          return (await getDocs(idCampo.orgCollection(nome))).docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      api.operatoriCampo = () => leggiCampo("operatori");
      api.squadreCampo = () => leggiCampo("squadre");
    } else if (id.authState() === "tour") {
      mode = "tour";
    }
  } catch (e) { /* backend assente: demo */ }

  if (mode !== "live") {
    // demo/tour: dati in memoria, scritture solo locali (non persistite)
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      lavoratori: async () => mem.lavoratori,
      scadenze:   async () => mem.scadenze,
      // in dimostrazione chi è schierato non arriva da Campo: è finto, ma
      // copiato dalla dimostrazione di Campo id per id (vedi DEMO.operatoriCampo)
      operatoriCampo: async () => mem.operatoriCampo || [],
      squadreCampo:   async () => mem.squadreCampo || [],
      documenti:  async () => mem.documenti,
      infortuni:  async () => mem.infortuni,
      oreAnno:    async () => mem.oreAnno || (mem.oreAnno = []),
      cantieri:   async () => mem.cantieri,
      // le azioni di esempio PIÙ quelle arrivate da Sentinella (ponte demo):
      // in demo le due app comunicano solo così, in live è la stessa
      // collezione e questa riga non esiste nemmeno.
      azioni:     async () => [...mem.azioni, ...ponteDemoLeggi().filter(a => !mem.azioni.some(x => x.id === a.id))],
      ispezioni:  async () => mem.ispezioni,
      mansioni:   async () => mem.mansioni || [],
      nomine:     async () => mem.nomine || [],
      dpi:        async () => mem.dpi || [],
      analisi:    async () => mem.analisi || (mem.analisi = []),
      appaltatori: async () => mem.appaltatori || (mem.appaltatori = []),
      appalti:     async () => mem.appalti || (mem.appalti = []),
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => {
        const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId);
        if (x) { Object.assign(x, data); return; }
        // azione arrivata da Sentinella: l'avanzamento si scrive dove sta,
        // così tornando sul superamento se ne vede lo stato aggiornato.
        if (name !== "azioni") return;
        const p = ponteDemoLeggi(), y = p.find(v => v.id === docId);
        if (y) { Object.assign(y, data); ponteDemoScrivi(p); }
      },
      rimuovi: async (name, docId) => {
        mem[name] = (mem[name] || []).filter(x => x.id !== docId);
        if (name === "azioni") ponteDemoScrivi(ponteDemoLeggi().filter(x => x.id !== docId));
      },
    };
  }
  return { mode, ...api };
}

// ============================================================
// INDICI INFORTUNISTICI (IF, IG, LTIFR)
// ------------------------------------------------------------
// Sono i tre numeri con cui un'azienda si confronta col proprio settore, e
// quelli che un committente chiede in fase di qualifica:
//
//   IF    = infortuni × 1.000.000 / ore lavorate       (frequenza)
//   IG    = giornate perse × 1.000 / ore lavorate      (gravità)
//   LTIFR = infortuni CON assenza × 1.000.000 / ore    (lost time injury rate)
//
// ⛔ E TUTTI E TRE DIVIDONO PER LE ORE LAVORATE, che Scudo non ha. La
// tentazione è ricavarle: numero di operatori × 1.700 ore l'anno, e il numero
// esce. Sarebbe un **denominatore inventato**, e su un indice che si porta in
// gara o si confronta con la media di settore un denominatore inventato non è
// un'approssimazione: è una dichiarazione falsa fatta con la faccia di un
// calcolo. Un'azienda con molti part-time o molti interinali starebbe fuori
// di parecchio, e nessuno potrebbe accorgersene guardando il risultato.
//
// Quindi: senza le ore l'indice **non si calcola**, e la funzione lo dice —
// `calcolabile: false` e la ragione in chiaro. È lo stesso principio del
// prodotto applicato per la quinta volta: l'assenza di un dato non è un dato
// favorevole, e qui il travestimento sarebbe un indice **basso**, cioè la
// notizia migliore che un'azienda possa leggere sulla propria sicurezza.
export function indiciInfortunistici(infortuni, oreLavorate, anno = new Date().getFullYear()) {
  const y = String(anno);
  const nell_anno = (infortuni || []).filter(i =>
    i && i.tipo === "infortunio" && String(i.data || "").slice(0, 4) === y);
  const conAssenza = nell_anno.filter(i => (giornateAssenza(i) || 0) > 0);
  /* ⛔ decisione 17: l'infortunio a prognosi aperta NON entra fra quelli «con
     assenza» (non si sa se ce ne sarà) e NON entra fra quelli senza (che è la
     lettura tranquilla che il vecchio `|| 0` produceva da solo). Ha un secchio
     suo — assenza **da quantificare** — ed è lui a rendere IG e LTIFR un
     minimo invece che un consuntivo. */
  const daQuantificare = nell_anno.filter(prognosiAperta).length;
  const giornatePerse = nell_anno.reduce((t, i) => t + Math.max(0, giornateAssenza(i) || 0), 0);
  const ore = +oreLavorate;
  const base = { anno: +anno, infortuni: nell_anno.length, conAssenza: conAssenza.length,
                 daQuantificare,
                 /* bandiera: tutte le giornate perse dell'anno sono scritte.
                    Falsa ⇒ `giornatePerse`, `indiceGravita` e `ltifr` sono
                    MINIMI. La legge `descriviIndici`, qui sotto. */
                 noto: daQuantificare === 0,
                 giornatePerse, oreLavorate: Number.isFinite(ore) && ore > 0 ? ore : null };
  if (!(Number.isFinite(ore) && ore > 0))
    return { ...base, calcolabile: false, indiceFrequenza: null, indiceGravita: null, ltifr: null,
      motivo: "Servono le ORE LAVORATE dell'anno: senza di quelle i tre indici non si possono "
        + "calcolare. Non vengono stimate dal numero di operatori — un denominatore inventato "
        + "renderebbe l'indice inconfrontabile con la media di settore, e più basso del vero." };
  const r2 = (n) => Math.round(n * 100) / 100;
  return { ...base, calcolabile: true,
    indiceFrequenza: r2(nell_anno.length * 1e6 / ore),
    indiceGravita: r2(giornatePerse * 1e3 / ore),
    ltifr: r2(conAssenza.length * 1e6 / ore) };
}

/* Come si legge l'indice di gravità di quell'anno, scritto dal modulo (regola
   7: la stessa frase decisa in un posto solo) e lettura della bandiera `noto`.
   Torna `null` quando non c'è niente da avvertire: chi la disegna scrive la
   riga solo se c'è, invece di riservare spazio a un avviso che non arriva. */
export function avvisoGravitaMinima(r) {
  const x = r || {};
  if (x.noto !== false) return null;
  const n = +x.daQuantificare || 0;
  return "L'indice di gravità del " + x.anno + " è un MINIMO: "
    + (n === 1 ? "di un infortunio dell'anno la prognosi è ancora aperta"
               : "di " + n + " infortuni dell'anno la prognosi è ancora aperta")
    + ", quindi le giornate perse contate finora sono " + x.giornatePerse
    + " ma non sono tutte. Scritte le giornate, l'indice sale — non è un valore da confrontare con la media di settore finché resta così.";
}

// ============================================================
// L'ANDAMENTO DEGLI INDICI NEL TEMPO (anno per anno)
// ------------------------------------------------------------
// I tre numeri da soli dicono dove si è; l'andamento dice DOVE SI STA ANDANDO,
// ed è la domanda che fanno un committente in qualifica e un ispettore.
//
// ⛔ ANNO PER ANNO, E NON PER SCELTA ESTETICA: le ore lavorate — il
// denominatore di tutti e tre — Scudo le raccoglie **per anno** (collezione
// `oreAnno`, un record {anno, ore}). Un andamento MENSILE avrebbe quindi un
// numeratore mensile e un denominatore annuale spalmato: cioè dodici indici
// costruiti su ore inventate. È lo stesso divieto già scritto sopra, applicato
// all'asse del tempo invece che al totale.
//
// Le regole di onestà, tutte già in casa e qui solo applicate:
//  · un anno SENZA ore non vale zero: vale **buco**. La riga esce
//    `calcolabile: false` con la sua ragione, e il grafico riceve `null` —
//    che il motore non scavalca. Un anno a zero disegnato in mezzo a due anni
//    misurati è la bugia più tranquilla che questa schermata possa dire;
//  · un anno con INFORTUNI ma senza ore è il caso peggiore, perché è quello in
//    cui il buco nasconde una notizia brutta: esce a parte in
//    `conEventiSenzaOre`, perché l'interfaccia lo dica per nome;
//  · due registrazioni di ore DIVERSE per lo stesso anno non si risolvono
//    scegliendone una: quell'anno diventa non calcolabile e la ragione lo
//    scrive. Prendere l'ultima cambierebbe l'indice senza che si veda;
//  · il confronto è fra gli ultimi DUE anni misurati, che non sono per forza
//    consecutivi: `adiacenti` e `salto` esistono perché la pagina non scriva
//    «rispetto all'anno scorso» saltando un buco di tre anni;
//  · su questi indici **scendere è migliorare**: il verso lo dice la funzione
//    (`migliora`/`peggiora`/`stabile`/`misto`), così nessuno lo deduce dal
//    segno e lo colora al contrario. `misto` esiste perché il caso vero —
//    meno infortuni ma più gravi — non si riassume in una freccia sola;
//  · da zero non esiste una variazione in percentuale: `variazione` è `null` e
//    `variazionePerche` lo scrive, invece di stampare un ∞ o un 100% inventato;
//  · sotto `MIN_TENDENZA` eventi non si legge una tendenza: `pochi` è la stessa
//    bandiera, con la stessa soglia, che usa già il riepilogo dei near-miss.
export const INDICI_TREND = [
  { chiave: "indiceFrequenza", sigla: "IF", nome: "Indice di frequenza" },
  { chiave: "indiceGravita", sigla: "IG", nome: "Indice di gravità" },
  { chiave: "ltifr", sigla: "LTIFR", nome: "LTIFR" },
];

/* L'anno si legge ESATTAMENTE come lo legge indiciInfortunistici (`slice(0,4)`).
   La prima stesura pretendeva la data ISO intera, ed era una seconda regola:
   un infortunio registrato con `data: "2026"` entrava nel conteggio dell'anno
   ma il suo anno non compariva nella serie — l'indice c'era e la riga no. */
function annoRegistrato(x) {
  const y = String((x && x.data) || "").slice(0, 4);
  return /^\d{4}$/.test(y) ? +y : null;
}

/* Le ore per anno, con i doppioni tolti di mezzo invece che risolti a caso. */
function orePerAnno(oreAnni) {
  const per = new Map(), dubbi = new Set();
  for (const r of oreAnni || []) {
    const a = +((r && r.anno)), o = +((r && r.ore));
    if (!Number.isInteger(a) || !(Number.isFinite(o) && o > 0)) continue;
    if (per.has(a) && per.get(a) !== o) dubbi.add(a);
    per.set(a, o);
  }
  for (const a of dubbi) per.delete(a);
  return { per, dubbi };
}

export function andamentoIndici(infortuni, oreAnni, opts = {}) {
  const annoFine = Number.isInteger(+opts.annoFine) ? +opts.annoFine : new Date().getFullYear();
  const finestra = Math.max(2, Math.round(+opts.finestra) || 6);
  const { per: ore, dubbi } = orePerAnno(oreAnni);
  const conEventi = new Set();
  for (const i of infortuni || []) if (i && i.tipo === "infortunio") {
    const a = annoRegistrato(i); if (a != null) conEventi.add(a);
  }
  const noti = [...new Set([...ore.keys(), ...conEventi, ...dubbi])].filter(a => a <= annoFine);
  const primo = Math.max(noti.length ? Math.min(...noti) : annoFine, annoFine - finestra + 1);
  const anni = [];
  for (let a = primo; a <= annoFine; a++) {
    const r = indiciInfortunistici(infortuni, ore.has(a) ? ore.get(a) : null, a);
    anni.push(dubbi.has(a)
      ? { ...r, motivo: "Per il " + a + " ci sono DUE registrazioni di ore diverse: finché non ne resta "
          + "una sola l'indice non si calcola, perché sceglierne una cambierebbe il risultato senza che si veda." }
      : r);
  }
  const misurabili = anni.filter(r => r.calcolabile);
  const fuoriPeriodo = noti.filter(a => a < primo).sort((a, b) => a - b);
  const oreFuoriPeriodo = fuoriPeriodo.filter(a => ore.has(a));
  return {
    anni, dal: primo, al: annoFine,
    misurabili: misurabili.length,
    conEventiSenzaOre: anni.filter(r => !r.calcolabile && r.infortuni > 0).map(r => r.anno),
    anniDubbi: [...dubbi].filter(a => a >= primo && a <= annoFine).sort((a, b) => a - b),
    fuoriPeriodo, oreFuoriPeriodo,
    confronto: confrontaUltimiDueAnni(misurabili, primo, annoFine, oreFuoriPeriodo),
    indici: INDICI_TREND,
  };
}

/* Il confronto fra gli ultimi due anni MISURATI. Non è esportata: l'unica
   porta è `andamentoIndici`, così non nascono due modi di leggere il verso. */
function confrontaUltimiDueAnni(misurabili, dal, al, oreFuori) {
  const coda = oreFuori.length
    ? " Fuori dal periodo mostrato ci sono anche le ore del " + oreFuori.join(", ") + "."
    : "";
  if (misurabili.length < 2)
    return { confrontabile: false, pochi: false, verso: null, per: [],
      motivo: (misurabili.length === 0
        ? "Nel periodo " + dal + "–" + al + " non c'è nessun anno con le ore lavorate: senza il "
          + "denominatore non c'è nessun indice, quindi neanche un andamento."
        : "Nel periodo " + dal + "–" + al + " c'è un anno solo con le ore lavorate (" + misurabili[0].anno
          + "): per dire se gli indici salgono o scendono ne servono almeno due.") + coda };
  const a = misurabili[misurabili.length - 1], da = misurabili[misurabili.length - 2];
  const eventi = da.infortuni + a.infortuni;
  const per = INDICI_TREND.map(d => {
    const v0 = da[d.chiave], v1 = a[d.chiave], delta = Math.round((v1 - v0) * 100) / 100;
    return { ...d, da: v0, a: v1, delta,
      variazione: v0 > 0 ? Math.round((v1 - v0) / v0 * 1000) / 10 : null,
      variazionePerche: v0 > 0 ? null
        : "Il " + da.anno + " era a zero: una variazione in percentuale non esiste, si legge il valore.",
      verso: delta === 0 ? "stabile" : delta < 0 ? "migliora" : "peggiora" };
  });
  const versi = new Set(per.map(p => p.verso)); versi.delete("stabile");
  return { confrontabile: true, motivo: null, da: da.anno, a: a.anno,
    adiacenti: a.anno - da.anno === 1, salto: a.anno - da.anno,
    /* decisione 17: se in uno dei due anni una prognosi è ancora aperta, il
       verso di IG e LTIFR è letto su un numero che deve ancora salire. Non si
       nasconde il confronto — si dice che quel verso può cambiare. */
    daQuantificare: da.daQuantificare + a.daQuantificare,
    noto: da.noto !== false && a.noto !== false,
    eventi, pochi: troppoPochiPerTendenza(eventi), per,
    verso: versi.size === 0 ? "stabile" : versi.size > 1 ? "misto" : [...versi][0] };
}

// ============================================================
// L'ANALISI DELLA CAUSA (i «5 Perché»), E LA SUA DIFESA
// ------------------------------------------------------------
// Scudo aveva già la catena evento → azione correttiva (`origineTipo`/
// `origineId`, `statoAzione`, `riepilogoNearMiss`), e la pagina spinge ad
// aprire l'azione subito dopo la segnalazione dicendo — testuale — che
// «registrarlo serve a poco se non si corregge quello che l'ha causato».
// Ma il «quello che l'ha causato» non era scritto da nessuna parte: la parola
// CAUSA compariva una volta sola in tutta l'app, dentro quella frase.
// Piano per esteso: docs/PIANO_CAUSA_RADICE_SCUDO.md
//
// ⛔ I «5 Perché» hanno una fama migliore di quella che meritano, e vanno
// introdotti sapendolo: portano a una causa sola, danno risposte diverse a
// persone diverse, e finiscono quasi sempre SULLA PERSONA («perché non ha
// guardato» → «perché è distratto»), il che come azione correttiva produce un
// richiamo, cioè niente. La difesa è di prodotto, non di metodo — e non vieta:
// CHIEDE. Se lo strumento accusa, chi lo usa smette di scrivere la verità, ed è
// la stessa regola del ponte con Terra che non dà la colpa a chi compila.
export const CAUSE_ANALISI = [
  { chiave: "tecnica", etichetta: "Tecnica", esempio: "attrezzatura rotta, protezione mancante, mezzo inadeguato" },
  { chiave: "organizzativa", etichetta: "Organizzativa", esempio: "procedura assente, sorveglianza non prevista, turni" },
  { chiave: "formazione", etichetta: "Formazione", esempio: "mansione affidata senza addestramento, istruzione mai data" },
  { chiave: "dpi", etichetta: "DPI", esempio: "DPI mancante, sbagliato, o non usabile nel lavoro reale" },
  { chiave: "ambientale", etichetta: "Ambientale", esempio: "fronte instabile, pista, meteo, visibilità, rumore" },
  { chiave: "comportamentale", etichetta: "Comportamentale", esempio: "scelta di chi lavorava — con le difese qui sotto" },
];

/* Le parole che nominano una persona senza fare un nome. Non serve beccarle
   tutte: serve CHIEDERE quando ce n'è una. */
const RUOLI_PERSONA = ["operatore", "lavoratore", "addetto", "collega", "autista",
  "conducente", "dipendente", "manovratore", "fochino", "capocantiere"];

/* ⛔ IL NOME DI UNA PERSONA NON SI INDOVINA: SI CERCA.
   Un'euristica linguistica in italiano è una pessima idea — «Rossi» è un
   cognome e anche un colore, «Bo» è un cognome e sta dentro «bordo» — e un
   controllo che sbaglia ACCUSA CHI HA SCRITTO LA VERITÀ, cioè fa esattamente
   il danno che dovrebbe evitare. Ma Scudo ha già l'elenco dei LAVORATORI: il
   confronto è coi nomi veri dell'azienda, a parola intera. */
export function nominaUnaPersona(testo, lavoratori) {
  const t = normalizzaTesto(testo);
  if (!t) return null;
  const intera = (parola) => new RegExp("(^| )" + parola + "( |$)").test(t);
  for (const l of lavoratori || []) {
    const nome = normalizzaTesto((l || {}).nome
      || ((l || {}).cognome ? (l.cognome + " " + (l.nome || "")) : ""));
    if (!nome) continue;
    // il cognome da solo basta: nei verbali si scrive «Rossi non ha guardato»
    const pezzi = nome.split(" ").filter((p) => p.length >= 3);
    if (pezzi.some(intera))
      return { tipo: "nome", trovato: String((l.nome || l.cognome || "")).trim() };
  }
  for (const r of RUOLI_PERSONA) if (intera(r)) return { tipo: "ruolo", trovato: r };
  return null;
}

/* Le due righe che BLOCCANO riguardano dati mancanti; quelle che riguardano il
   CONTENUTO chiedono e basta. Un'analisi che finisce su una persona resta
   valida: a volte è davvero un comportamento, e vietarlo insegnerebbe solo a
   scrivere quello che l'app vuole sentire. */
export function validaAnalisi(bozza, lavoratori) {
  const b = bozza || {};
  const perche = (b.perche || []).map((x) => String(x || "").trim()).filter(Boolean);
  const avvisi = [];
  if (perche.length < 2)
    avvisi.push({ campo: "perche", grave: true,
      testo: "Serve almeno un secondo perché: il primo è quasi sempre la descrizione di quello che è successo, non la sua causa." });
  const chi = nominaUnaPersona(perche[perche.length - 1] || "", lavoratori);
  if (chi)
    avvisi.push({ campo: "perche", grave: false,
      testo: `L'ultimo perché nomina una persona${chi.tipo === "nome" ? " (" + chi.trovato + ")" : ""}. È quello che è successo, o è la persona a cui è successo? Se sotto c'è una condizione — un'attrezzatura, una procedura, un addestramento — è quella la causa da correggere.` });
  if (b.causa === "comportamentale" && perche.length < 3)
    avvisi.push({ campo: "causa", grave: false,
      testo: "«Comportamentale» da sola non è un'analisi: scrivi anche perché quel comportamento era possibile. Quasi sempre sotto c'è una causa tecnica, organizzativa o di formazione." });
  if (!CAUSE_ANALISI.some((c) => c.chiave === b.causa))
    avvisi.push({ campo: "causa", grave: true,
      testo: "Scegli la famiglia della causa: serve a capire quali cause si ripetono, che è la domanda a cui questa scheda deve rispondere." });
  return { valida: !avvisi.some((a) => a.grave), avvisi };
}

/* L'analisi di un evento, se qualcuno l'ha fatta. Una sola per evento: se
   serve rifarla si corregge quella, invece di accumulare versioni fra cui
   nessuno sa quale valga. */
export function analisiDiEvento(analisi, eventoId) {
  const id = String(eventoId || "");
  if (!id) return null;
  return (analisi || []).find((a) => a && String(a.eventoId || "") === id) || null;
}

/* ⛔ GLI EVENTI RIMASTI SENZA UN PERCHÉ. Senza questo conto l'analisi la fa chi
   ha voglia, e il registro si riempie di eventi muti: è la differenza fra una
   funzione che c'è e una che viene usata.
   Gli infortuni con assenza vengono per primi — sono quelli su cui l'ente
   chiede conto — poi i near-miss, e dentro ogni gruppo i più recenti prima. */
export function eventiSenzaAnalisi(infortuni, analisi) {
  const fatti = new Set((analisi || []).map((a) => String((a || {}).eventoId || "")).filter(Boolean));
  const gravita = (e) => (+((e || {}).giorniAssenza) > 0 ? 2 : (e || {}).tipo === "near-miss" ? 0 : 1);
  return (infortuni || [])
    .filter((e) => e && e.id && !fatti.has(String(e.id)))
    .sort((a, b) => gravita(b) - gravita(a)
      || String(b.data || "").localeCompare(String(a.data || "")));
}

/* ⛔ QUALI CAUSE TORNANO — e su quante analisi, che è la parte che rende il
   numero leggibile. Tre eventi analizzati su venti NON dicono «la causa
   principale è organizzativa»: dicono che sono stati analizzati tre eventi su
   venti, e su così pochi non si legge nessuna ricorrenza. La guardia è la
   stessa di `riepilogoNearMiss`, chiamata e non ricopiata. */
export function causeRicorrenti(infortuni, analisi) {
  const eventi = (infortuni || []).filter((e) => e && e.id);
  const conAnalisi = (analisi || []).filter((a) => a && a.causa
    && eventi.some((e) => String(e.id) === String(a.eventoId || "")));
  const per = {};
  for (const a of conAnalisi) per[a.causa] = (per[a.causa] || 0) + 1;
  const righe = CAUSE_ANALISI
    .map((c) => ({ chiave: c.chiave, etichetta: c.etichetta, quante: per[c.chiave] || 0 }))
    .filter((r) => r.quante > 0)
    .sort((a, b) => b.quante - a.quante);
  return { righe, analizzati: conAnalisi.length, eventi: eventi.length,
    /* «leggibile» non vuol dire «ci sono dati»: vuol dire che ce n'è abbastanza
       da poterci leggere qualcosa. Le due cose confuse producono la freccia
       verso l'alto disegnata su due punti. */
    leggibile: !troppoPochiPerTendenza(conAnalisi.length),
    motivo: troppoPochiPerTendenza(conAnalisi.length)
      ? `${conAnalisi.length === 0 ? "Nessun evento è stato analizzato" : "Solo " + conAnalisi.length + " event" + (conAnalisi.length === 1 ? "o è stato analizzato" : "i sono stati analizzati")} su ${eventi.length}: servono almeno ${MIN_TENDENZA} analisi prima di poter dire quali cause si ripetono.`
      : "" };
}

// ══════════════════════════════════════════════════════════════════════
// APPALTATORI, QUALIFICA E DOCUMENTO DI COORDINAMENTO
// ══════════════════════════════════════════════════════════════════════
// In una cava le imprese esterne ci sono sempre: trasportatori, manutentori,
// ditte di perforazione, imprese di ripristino. Il committente ha due obblighi
// che nascono insieme, e questa parte del modulo serve a tenerli in ordine.
//
// ⛔ E IL SECONDO OBBLIGO, IN CAVA, NON È IL DUVRI. È la cosa che vale la pena
// sapere di tutto questo blocco:
//  · fuori dalla cava (un cantiere di un cliente) vale la regola generale —
//    art. 26 c.3 D.Lgs 81/08, che chiede al committente il DUVRI;
//  · DENTRO la cava vale la norma speciale delle attività estrattive —
//    art. 9 D.Lgs 624/96, che chiede al TITOLARE il **DSS coordinato**: gli
//    appaltatori gli trasmettono la propria valutazione dei rischi, lui la
//    valuta insieme ai rischi dell'attività estrattiva e redige il documento
//    coordinato, e gli appaltatori — sentiti i propri rappresentanti dei
//    lavoratori — lo **sottoscrivono**, diventando responsabili della parte di
//    loro competenza (art. 9 c.2).
// Le due differenze che cambiano il lavoro di chi usa Scudo sono queste: il
// DSS coordinato vuole una FIRMA che il DUVRI non vuole, e le esclusioni del
// comma 3-bis (natura intellettuale, mera fornitura, cinque uomini-giorno)
// stanno nell'art. 26 e riguardano il DUVRI — nelle fonti lette non risultano
// riportate per il DSS coordinato. Scudo quindi NON le applica alla cava, e lo
// scrive in chiaro invece di applicarle in silenzio: è una nota informativa,
// non un parere legale, e va confermata con l'RSPP come già la nota della
// L. 198/2025 qui sopra.

/* I documenti della qualifica.
   ⛔ `obbligatorio` DICE UNA COSA PRECISA, e vale la pena non gonfiarla: l'art.
   26 c.1 lett. a) ne elenca DUE, il certificato camerale e l'autocertificazione
   ex art. 47 DPR 445/2000. Il **DURC** non è in quell'elenco — è obbligatorio
   per i cantieri (art. 90 c.9) e nella pratica lo chiedono quasi tutti i
   committenti, ma dichiararlo «obbligo dell'art. 26» sarebbe far fare lavoro
   inutile citando male una norma, e toglierebbe credibilità al resto della
   schermata. Sta nell'elenco come prassi, con la sua provenienza scritta. */
export const TIPI_DOC_APPALTATORE = [
  { chiave: "cciaa", nome: "Certificato CCIAA", obbligatorio: true, scade: true,
    fonte: "art. 26 c.1 lett. a) n.1 D.Lgs 81/08" },
  { chiave: "autocert", nome: "Autocertificazione dei requisiti", obbligatorio: true, scade: false,
    fonte: "art. 26 c.1 lett. a) n.2 D.Lgs 81/08 — art. 47 DPR 445/2000" },
  { chiave: "durc", nome: "DURC", obbligatorio: false, scade: true,
    fonte: "prassi di qualifica — NON elencato dall'art. 26" },
  { chiave: "dvr", nome: "DVR dell'impresa", obbligatorio: false, scade: false,
    fonte: "serve al titolare per redigere il DSS coordinato — art. 9 c.2 D.Lgs 624/96" },
  { chiave: "lavoratori", nome: "Elenco lavoratori e idoneità", obbligatorio: false, scade: false,
    fonte: "prassi di qualifica" },
  { chiave: "polizza", nome: "Polizza RC", obbligatorio: false, scade: true,
    fonte: "prassi contrattuale" },
];
export function tipoDocAppaltatore(chiave) {
  return TIPI_DOC_APPALTATORE.find((t) => t.chiave === chiave) || null;
}

/* I documenti di qualifica vivono nel registro `documenti` che Scudo ha già —
   con il suo allegato e la regola condivisa di `controllaAllegato` — collegati
   da `appaltatoreId`, esattamente come gli altri si collegano a `cantiereId` e
   `lavoratoreId`. Nessun secondo archivio. */
export function docDiAppaltatore(documenti, appaltatoreId) {
  if (!appaltatoreId) return [];
  return (documenti || []).filter((d) => d && d.appaltatoreId === appaltatoreId);
}

/* ⛔ UN APPALTATORE DI CUI NON SI È VERIFICATO NIENTE NON È IDONEO: È **NON
   VERIFICATO**, e le due cose si dicono in modo diverso. È il principio del
   fondatore nel punto in cui costa di più, perché questa è la schermata che si
   mostra a un ispettore: un semaforo verde su un'anagrafica vuota sarebbe la
   cosa peggiore che questo modulo possa fare.
   La scadenza NON si giudica qui: la dice `statoScadenza`, cioè
   `statoScadenzaHSE` di `shared/dw-ponti.js`, la stessa che regola lo
   scadenzario e i turni di Campo. Un certificato camerale e un DURC hanno una
   scadenza come tutto il resto, e non ne meritano una seconda copia. */
export function qualificaAppaltatore(appaltatore, documenti, oggi = new Date()) {
  const id = appaltatore && appaltatore.id;
  const suoi = docDiAppaltatore(documenti, id);
  const per = new Map();
  for (const d of suoi) if (d.tipoQualifica) per.set(d.tipoQualifica, d);

  const mancanti = [], scaduti = [], senzaData = [], inScadenza = [];
  for (const t of TIPI_DOC_APPALTATORE) {
    const d = per.get(t.chiave);
    if (!d) { if (t.obbligatorio) mancanti.push(t.nome); continue; }
    if (!t.scade) continue;
    const st = statoScadenza(d.scadenza, oggi);
    if (st === "scaduta") scaduti.push(t.nome);
    else if (st === "senza data") senzaData.push(t.nome);
    else if (st === "in-scadenza") inScadenza.push(t.nome);
  }

  const base = { appaltatoreId: id || null, quanti: suoi.length, mancanti, scaduti, senzaData, inScadenza,
    obbligatoriRichiesti: TIPI_DOC_APPALTATORE.filter((t) => t.obbligatorio).length };

  if (!suoi.length)
    return { ...base, noto: false, esito: "non-verificato",
      perche: "Di questa impresa non è stato acquisito nessun documento: l'idoneità tecnico-professionale "
        + "non è stata verificata. Non vuol dire che non sia idonea — vuol dire che non lo sappiamo." };
  if (scaduti.length)
    return { ...base, noto: true, esito: "scaduto", perche: "Scaduti: " + scaduti.join(", ") + "." };
  if (mancanti.length)
    return { ...base, noto: true, esito: "incompleto",
      perche: "Manca quello che l'art. 26 c.1 lett. a) chiede di acquisire: " + mancanti.join(", ") + "." };
  if (senzaData.length)
    return { ...base, noto: false, esito: "senza-data",
      perche: "Senza una data leggibile non si sa se sono ancora validi: " + senzaData.join(", ") + "." };
  if (inScadenza.length)
    return { ...base, noto: true, esito: "in-scadenza", perche: "In scadenza entro 30 giorni: " + inScadenza.join(", ") + "." };
  return { ...base, noto: true, esito: "verificato",
    perche: "I documenti dell'art. 26 sono stati acquisiti e sono in corso di validità." };
}

/* Chi consuma la bandiera `noto`: sta nel modulo e non nella pagina perché la
   frase che distingue «non a posto» da «non lo sappiamo» va decisa in un posto
   solo (regola 7 di run-stile). */
export function descriviQualifica(q) {
  if (!q) return "";
  return (q.noto ? "" : "Non lo sappiamo — ") + q.perche;
}

/* Quale documento di coordinamento è in gioco: dipende da DOVE si lavora. */
export function documentoCoordinamento(cantiere) {
  if (((cantiere && cantiere.tipo) || "") === "cava")
    return { sigla: "DSS coordinato", nome: "Documento di sicurezza e salute coordinato",
             norma: "art. 9 D.Lgs 624/96", esclusioniAmmesse: false, sottoscrizione: true };
  return { sigla: "DUVRI", nome: "Documento unico di valutazione dei rischi da interferenze",
           norma: "art. 26 c.3 D.Lgs 81/08", esclusioniAmmesse: true, sottoscrizione: false };
}

/* I rischi che l'art. 26 c.3-bis mette al riparo dalle esclusioni: se ci sono,
   il documento va fatto comunque, anche per due giorni di lavoro. In cava
   «atmosfere esplosive» non è un'ipotesi di scuola. */
export const RISCHI_PARTICOLARI = [
  { chiave: "incendio", nome: "Rischio di incendio di livello elevato" },
  { chiave: "confinati", nome: "Attività in ambienti confinati" },
  { chiave: "cancerogeni", nome: "Agenti cancerogeni, mutageni o biologici" },
  { chiave: "amianto", nome: "Amianto" },
  { chiave: "esplosive", nome: "Atmosfere esplosive" },
];
export function rischioParticolare(chiave) {
  return RISCHI_PARTICOLARI.find((r) => r.chiave === chiave) || null;
}

const NATURE_ESCLUSE = {
  intellettuale: "servizio di natura intellettuale",
  fornitura: "mera fornitura di materiali o attrezzature",
};
export const NATURE_APPALTO = [
  { chiave: "", nome: "Lavori o servizi in cava" },
  { chiave: "intellettuale", nome: "Servizio di natura intellettuale" },
  { chiave: "fornitura", nome: "Mera fornitura di materiali o attrezzature" },
];

/* SERVE O NON SERVE il documento di coordinamento.
   ⛔ I CASI ESCLUSI CONTANO QUANTO QUELLI INCLUSI: dire «obbligatorio» dove non
   lo è fa fare lavoro inutile e toglie credibilità a tutto il resto. Ma la
   direzione pericolosa è l'altra, ed è quella che questa funzione difende:
   **«non lo so» non è «non serve»**. La durata non registrata sarebbe finita a
   zero (`+null` fa 0, e 0 ≤ 5), cioè l'appalto di cui nessuno ha scritto niente
   sarebbe uscito ESENTE — la risposta più tranquilla, data sul dato mancante.
   Perciò `serve` ha tre valori e non due, e `noto: false` accompagna il terzo.
   Anche l'esclusione vera vuole una condizione: il c.3-bis la concede «sempre
   che» non ci siano rischi particolari, quindi finché nessuno li ha guardati
   l'esclusione non si può concedere. */
export function duvriDovuto(appalto, cantiere) {
  const a = appalto || {};
  const doc = documentoCoordinamento(cantiere);
  const rischi = (Array.isArray(a.rischiParticolari) ? a.rischiParticolari : [])
    .map((k) => rischioParticolare(k)).filter(Boolean);

  if (rischi.length)
    return { ...doc, noto: true, serve: true,
      perche: "Ci sono rischi particolari (" + rischi.map((r) => r.nome.toLowerCase()).join(", ")
        + "): le esclusioni del comma 3-bis non si applicano, e il documento va fatto." };

  if (!doc.esclusioniAmmesse)
    return { ...doc, noto: true, serve: true,
      perche: "Il lavoro si svolge in cava: il documento è il DSS coordinato dell'art. 9 D.Lgs 624/96, "
        + "che scatta quando entra un'impresa esterna. Le esclusioni del comma 3-bis riguardano il DUVRI "
        + "dell'art. 26 e Scudo non le applica alla cava." };

  const ug = a.uominiGiorno;
  const ugNoto = ug !== null && ug !== undefined && ug !== "" && Number.isFinite(+ug) && +ug >= 0;
  const nat = NATURE_ESCLUSE[a.natura];

  if (nat && a.rischiValutati === true)
    return { ...doc, noto: true, serve: false,
      perche: "È una " + nat + " e i rischi particolari sono stati esclusi: il DUVRI non è richiesto (art. 26 c.3-bis)." };
  if (nat)
    return { ...doc, noto: false, serve: null,
      perche: "È una " + nat + ", che il comma 3-bis esclude — ma solo «sempre che» non ci siano rischi "
        + "particolari, e nessuno li ha ancora guardati." };
  if (!ugNoto)
    return { ...doc, noto: false, serve: null,
      perche: "Non è stata registrata la durata in uomini-giorno: sopra i cinque il DUVRI è richiesto, "
        + "sotto no. Senza quel numero non si può dire, e un appalto su cui non si sa non è un appalto esente." };
  if (+ug > 5)
    return { ...doc, noto: true, serve: true,
      perche: "La durata è di " + (+ug) + " uomini-giorno, sopra la soglia dei cinque: il DUVRI è richiesto." };
  if (a.rischiValutati !== true)
    return { ...doc, noto: false, serve: null,
      perche: "La durata è di " + (+ug) + " uomini-giorno, sotto la soglia — ma l'esclusione vale «sempre che» "
        + "non ci siano rischi particolari, e nessuno li ha ancora guardati." };
  return { ...doc, noto: true, serve: false,
    perche: "Durata di " + (+ug) + " uomini-giorno e nessun rischio particolare: il DUVRI non è richiesto (art. 26 c.3-bis)." };
}

/* I COSTI DELLE INTERFERENZE — art. 26 c.5: vanno indicati specificamente **a
   pena di nullità** del contratto, e non sono soggetti a ribasso.
   ⛔ `+"" fa 0`: un campo lasciato vuoto sarebbe diventato «zero euro
   dichiarati», cioè un adempimento assolto da un campo mai compilato. Zero
   dichiarato è una posizione che qualcuno si prende e va motivata; vuoto è il
   contratto che rischia la nullità. */
export function costiInterferenze(appalto) {
  const v = appalto && appalto.costiSicurezza;
  if (v === null || v === undefined || (typeof v === "string" && v.trim() === ""))
    return { indicati: false, importo: null,
      perche: "I costi della sicurezza da interferenze non sono indicati. L'art. 26 c.5 li vuole indicati "
        + "specificamente A PENA DI NULLITÀ del contratto, e non soggetti a ribasso." };
  const n = +v;
  if (!Number.isFinite(n) || n < 0)
    return { indicati: false, importo: null, perche: "Il valore registrato per i costi da interferenze non è un importo leggibile." };
  return { indicati: true, importo: n,
    perche: n === 0
      ? "Costi da interferenze dichiarati pari a zero: è una dichiarazione, non un campo vuoto, e va motivata nel documento di coordinamento."
      : "Costi da interferenze indicati, e non soggetti a ribasso." };
}

/* ⛔ IL DUVRI NON È UN ALLEGATO, È UNA DECISIONE: va detto CHI l'ha redatto,
   QUANDO, e per quale appalto. Un documento di coordinamento senza data non
   copre nessun periodo, e uno senza redattore non attribuisce a nessuno la
   responsabilità che il committente non può delegare. Perciò gli stati sono
   sette e non due: la graffetta non è fra questi.
   Lo stato `tardivo` esiste perché l'art. 26 c.3 vuole il documento **allegato
   al contratto**: se porta una data successiva all'avvio dei lavori, i primi
   giorni non erano coperti — ed è un fatto che si vede solo confrontando due
   date che nessuno confronta a mano. */
export const STATI_COORDINAMENTO = ["non-decidibile", "non-dovuto", "non-redatto",
  "senza-data", "senza-redattore", "tardivo", "da-sottoscrivere", "in-vigore"];

export function statoCoordinamento(appalto, cantiere, oggi = new Date()) {
  const a = appalto || {};
  const dov = duvriDovuto(a, cantiere);
  if (dov.serve === null) return { ...dov, stato: "non-decidibile" };
  if (dov.serve === false) return { ...dov, stato: "non-dovuto" };

  const red = String(a.coordRedattore || "").trim();
  const dataOk = statoScadenza(a.coordData, oggi) !== "senza data";
  if (!red && !dataOk)
    return { ...dov, stato: "non-redatto",
      perche: dov.sigla + " dovuto e non risulta redatto: non c'è né un redattore né una data." };
  if (!dataOk)
    return { ...dov, stato: "senza-data",
      perche: "Il " + dov.sigla + " risulta redatto da " + red + " ma senza data: un documento di "
        + "coordinamento senza data non copre nessun periodo." };
  if (!red)
    return { ...dov, stato: "senza-redattore",
      perche: "Il " + dov.sigla + " ha una data ma non dice chi l'ha redatto: la responsabilità del "
        + "coordinamento è del committente e va scritta col nome di chi se l'è presa." };

  /* ⛔ SI CONFRONTANO I GIORNI, NON LE STRINGHE INTERE. Il prototipo rispondeva
     «tardivo» su un documento firmato LO STESSO GIORNO dell'avvio, perché
     «2026-03-01T08:00» è maggiore di «2026-03-01» per il confronto fra
     stringhe: un ritardo inventato da un'ora attaccata alla data. */
  const gg = (x) => String(x || "").slice(0, 10);
  if (statoScadenza(a.dataInizio, oggi) !== "senza data" && gg(a.coordData) > gg(a.dataInizio))
    return { ...dov, stato: "tardivo",
      perche: "Il " + dov.sigla + " è datato " + dataIt(a.coordData) + ", dopo l'inizio dei lavori ("
        + dataIt(a.dataInizio) + "): i primi giorni non erano coperti." };

  if (dov.sottoscrizione && a.coordSottoscritto !== true)
    return { ...dov, stato: "da-sottoscrivere",
      perche: "Il DSS coordinato è redatto ma l'impresa non l'ha sottoscritto: l'art. 9 c.2 del D.Lgs 624/96 "
        + "vuole la firma, ed è con quella che l'appaltatore diventa responsabile della parte di sua competenza." };

  return { ...dov, stato: "in-vigore", perche: "Redatto da " + red + " il " + dataIt(a.coordData) + "." };
}

/* La riga dell'appalto: le tre domande insieme — l'impresa è qualificata? il
   documento di coordinamento c'è? i costi sono indicati?
   ⛔ CIÒ CHE DICHIARA `noto: false` FINISCE FRA GLI **IGNOTI**, NON FRA I
   PROBLEMI. Sommarlo ai problemi farebbe passare per «fuori regola» un appalto
   che nessuno ha ancora guardato; ignorarlo lo farebbe passare per «a posto».
   Sono tre esiti perché i casi sono tre. */
export function statoAppalto(appalto, cantiere, appaltatore, documenti, oggi = new Date()) {
  const qualifica = qualificaAppaltatore(appaltatore, documenti, oggi);
  const coordinamento = statoCoordinamento(appalto, cantiere, oggi);
  const costi = costiInterferenze(appalto);
  const problemi = [], ignoti = [];
  if (!qualifica.noto) ignoti.push(descriviQualifica(qualifica));
  else if (qualifica.esito !== "verificato" && qualifica.esito !== "in-scadenza") problemi.push(qualifica.perche);
  if (!coordinamento.noto) ignoti.push(coordinamento.perche);
  else if (coordinamento.stato !== "in-vigore" && coordinamento.stato !== "non-dovuto") problemi.push(coordinamento.perche);
  if (coordinamento.serve === true && !costi.indicati) problemi.push(costi.perche);
  return { appaltoId: (appalto && appalto.id) || null, qualifica, coordinamento, costi, problemi, ignoti,
    noto: ignoti.length === 0,
    esito: problemi.length ? "da-sistemare" : (ignoti.length ? "non-verificato" : "a-posto") };
}

export function appaltiDiCantiere(appalti, cantiereId) {
  if (!cantiereId) return [];
  return (appalti || []).filter((a) => a && a.cantiereId === cantiereId);
}
export function appaltiDiAppaltatore(appalti, appaltatoreId) {
  if (!appaltatoreId) return [];
  return (appalti || []).filter((a) => a && a.appaltatoreId === appaltatoreId);
}

/* Il riepilogo che si mostra a un ispettore.
   ⛔ NESSUN APPALTO REGISTRATO NON VUOL DIRE NESSUNA IMPRESA IN CAVA — è la
   stessa distinzione che Campo fa nell'appello del turno fra «non c'è» e «non
   lo so». Un registro vuoto qui non dimostra la conformità: dimostra che non è
   stato compilato, e la bandiera lo dice. */
export function riepilogoAppalti(appalti, cantieri, appaltatori, documenti, oggi = new Date()) {
  const perCant = new Map((cantieri || []).filter((c) => c && c.id).map((c) => [c.id, c]));
  const perApp = new Map((appaltatori || []).filter((a) => a && a.id).map((a) => [a.id, a]));
  const attivi = (appalti || []).filter((a) => a && a.stato !== "chiuso");
  const righe = attivi.map((a) => ({ appalto: a,
    ...statoAppalto(a, perCant.get(a.cantiereId), perApp.get(a.appaltatoreId), documenti, oggi) }));
  const conta = (e) => righe.filter((r) => r.esito === e).length;

  if (!attivi.length)
    return { quanti: 0, aPosto: 0, daSistemare: 0, nonVerificati: 0, righe: [], noto: false,
      testo: "Nessun appalto registrato. Non vuol dire che in cava non entri nessuna impresa esterna: vuol "
        + "dire che qui non ne risulta nessuna, e finché è così questa schermata non dimostra niente." };

  const daSistemare = conta("da-sistemare"), nonVerificati = conta("non-verificato"), aPosto = conta("a-posto");
  return { quanti: attivi.length, aPosto, daSistemare, nonVerificati, righe, noto: nonVerificati === 0,
    testo: (daSistemare || nonVerificati)
      ? [daSistemare ? daSistemare + (daSistemare === 1 ? " appalto da sistemare" : " appalti da sistemare") : "",
         nonVerificati ? nonVerificati + (nonVerificati === 1 ? " su cui manca una verifica" : " su cui mancano verifiche") : ""]
          .filter(Boolean).join(", ") + ", su " + attivi.length + " attiv" + (attivi.length === 1 ? "o" : "i") + "."
      : "Tutt" + (attivi.length === 1 ? "o l'unico appalto attivo ha" : "i e " + attivi.length + " gli appalti attivi hanno")
        + " impresa qualificata, documento di coordinamento in vigore e costi da interferenze indicati." };
}

/* Le imprese su cui c'è qualcosa da fare, per le urgenze del Quadro. */
export function appaltatoriDaVerificare(appaltatori, documenti, oggi = new Date()) {
  return (appaltatori || []).filter((a) => a && a.attivo !== false)
    .map((a) => ({ appaltatore: a, ...qualificaAppaltatore(a, documenti, oggi) }))
    .filter((r) => r.esito !== "verificato" && r.esito !== "in-scadenza");
}
