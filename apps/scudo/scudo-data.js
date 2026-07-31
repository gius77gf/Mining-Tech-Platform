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
//                      anonimo? (bool), segnalatoDaId?|null, rapida? (bool) }
//   ispezioni/{id}:  { modello (chiave), nome, ambito, cantiereId|null,
//                      responsabileId|null, data (ISO), periodicitaGiorni|null,
//                      riferimento?, voci: [{ id, testo }],
//                      esiti: { voceId: { esito: conforme|non-conforme|na, nota } },
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
// Lo "stato" delle scadenze non si salva: si CALCOLA dalla data
// (scaduta / entro 30gg / regolare) — niente dati derivati nel DB.
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione, senzaDoppioni, dataISOEsiste } from "../../shared/deepwork-id-client/dw-shell.js";

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
    { id: "c4", titolo: "DSS — Documento Sicurezza e Salute", meta: "Inviato ASL 02/2026", tipo: "DSS", cantiereId: "k1", stato: "valido" },
    { id: "c5", titolo: "Verbale consegna DPI — M. Rossi", meta: "Firmato 04/2026", tipo: "Verbale DPI", lavoratoreId: "d1", stato: "valido" },
  ],
  cantieri: [
    { id: "k1", nome: "Cava Monte Alto", comune: "Comune di esempio", tipo: "cava", stato: "attivo" },
    { id: "k2", nome: "Cantiere cliente Edilcave", comune: "Comune di esempio", tipo: "cantiere", stato: "attivo" },
  ],
  infortuni: [
    { id: "i1", data: "2026-05-18", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Est", luogoTipo: "fronte", categoria: "caduta-massi", descrizione: "Caduta massi vicino al perforatore, nessun ferito" },
    { id: "i2", data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, luogo: "officina", luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },
    { id: "i3", data: "2026-06-24", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista principale", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, descrizione: "Dumper e pick-up incrociati in curva con poca visibilità" },
    { id: "i4", data: "2026-07-06", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Nord", luogoTipo: "fronte", categoria: "caduta-massi", rapida: true, descrizione: "Blocco staccato dal ciglio durante il disgaggio" },
    { id: "i5", data: "2026-07-15", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "impianto", luogoTipo: "impianto", categoria: "impianto", rapida: true, descrizione: "Riparo del nastro 3 trovato aperto a macchina ferma" },
    { id: "i6", data: "2026-07-21", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista di risalita", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, descrizione: "Pietra caduta dal cassone su tratto di pista con arginello basso" },
  ],
  azioni: [
    { id: "a1", descrizione: "Disgaggio del fronte Est e ripristino della fascia di rispetto a valle", responsabileId: "d3", scadenza: "2026-07-31", stato: "in-corso", origineTipo: "evento", origineId: "i1" },
    { id: "a2", descrizione: "Consegna guanti antitaglio e addestramento agli addetti officina", responsabileId: "d7", scadenza: "2026-03-15", stato: "chiusa", esito: "Guanti consegnati e addestramento registrato", dataChiusura: "2026-03-12", origineTipo: "evento", origineId: "i2" },
    { id: "a3", descrizione: "Ripristinare la segnaletica di viabilità sulla pista principale", responsabileId: null, scadenza: "2026-06-30", stato: "aperta", origineTipo: "nc", origineNota: "Non conformità rilevata durante il giro di sorveglianza" },
    { id: "a4", descrizione: "Delimitare la fascia di rispetto al ciglio del fronte Nord", responsabileId: "d3", scadenza: "2026-08-09", stato: "aperta", origineTipo: "ispezione", origineId: "q1", origineVoce: "v2", origineNota: "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi" },
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
  ],
  nomine: [
    { id: "o1", ruolo: "sorvegliante", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "Turno unico, tutta la cava" },
    { id: "o2", ruolo: "preposto", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "" },
    { id: "o3", ruolo: "rspp", lavoratoreId: "d7", dal: "2024-09-16", al: null, note: "Incarico esterno" },
    { id: "o4", ruolo: "primo-soccorso", lavoratoreId: "d5", dal: "2025-04-14", al: null, note: "" },
    { id: "o5", ruolo: "antincendio", lavoratoreId: "d2", dal: "2025-04-14", al: null, note: "" },
    { id: "o6", ruolo: "rls", lavoratoreId: "d5", dal: "2024-11-08", al: null, note: "Eletto dai lavoratori" },
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
  const giorniAssenzaTot = veri.reduce((s, x) => s + (+x.giorniAssenza || 0), 0);
  const gravi = veri.filter(x => x.gravita === "grave").length;
  return { infortuni: veri.length, nearMiss: nearMiss.length, gravi, giorniSenza, ultimo, giorniAssenzaTot };
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
export function statoAzione(azione, oggi = new Date()) {
  const a = azione || {};
  if (a.stato === "chiusa") return "regolare";
  if (!a.scadenza) return "regolare";          // senza data non allarma
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
    pochi: list.length < 5,
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
  if (!i.data) return "regolare";
  return statoScadenza(i.data, oggi);
}

// Riepilogo per la testata della pagina Ispezioni.
export function riepilogoIspezioni(ispezioni, oggi = new Date()) {
  const list = ispezioni || [];
  const aperte = list.filter(i => i.stato !== "completata");
  return {
    totale: list.length,
    completate: list.filter(i => i.stato === "completata").length,
    daFare: aperte.length,
    scadute: aperte.filter(i => statoIspezione(i, oggi) === "scaduta").length,
    nonConformi: list.reduce((s, i) => s + riepilogoIspezione(i).nonConformi, 0),
  };
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
      return {
        data: (data || "").trim(),
        tipo: (tipo || "").trim().toLowerCase() === "infortunio" ? "infortunio" : "near-miss",
        gravita: (gravita || "").trim().toLowerCase() === "grave" ? "grave" : "lieve",
        giorniAssenza: Number.isFinite(g) ? Math.max(0, g) : 0,
        descrizione: (descrizione || "").trim(),
        luogo: (luogo || "").trim(),
      };
    })
    .filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.data));
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
export function statoConsegnaDpi(consegna, oggi = new Date()) {
  if (!consegna) return { stato: "mancante", scadenza: null, addestramentoMancante: false };
  const t = tipoDpi(consegna.tipo);
  return {
    stato: consegna.scadenza ? statoScadenza(consegna.scadenza, oggi) : "regolare",
    scadenza: consegna.scadenza || null,
    addestramentoMancante: !!(t && t.addestramento) && !consegna.addestramento,
  };
}

// ============================================================
// LA MATRICE: chi può fare quel lavoro domani mattina
// Tre risposte sole, perché di mattina non c'è tempo di leggere una tabella:
//   · "puo"      → può andare;
//   · "attenzione" → può andare, ma c'è qualcosa da sistemare (un corso che
//                    scade, un DPI da consegnare o un addestramento da fare);
//   · "no"       → non può: manca o è scaduto qualcosa di bloccante.
// Bloccano: persona non in forza, idoneità sanitaria negativa, un corso
// richiesto mancante o scaduto. I DPI NON bloccano ma pesano: l'app sa se la
// consegna è REGISTRATA, non se il lavoratore ha l'elmetto in mano — dirlo
// come certezza sarebbe una bugia. Restano in evidenza, non nascosti.
// ============================================================
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
    if (d.addestramentoMancante && d.stato !== "mancante") attenzioni.push("addestramento " + d.etichetta.toLowerCase() + " da registrare");
  }
  const esito = bloccanti.length ? "no" : (attenzioni.length ? "attenzione" : "puo");
  return { lavoratore: l, mansione: mansione || null, requisiti, dpi, bloccanti, attenzioni, esito };
}

// La matrice di UNA mansione: una riga per persona, prima chi può andare.
export function matriceMansione(mansione, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  const ids = (mansione && mansione.lavoratoriIds) || [];
  const ordine = { puo: 0, attenzione: 1, no: 2 };
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
      no: righe.filter(r => r.esito === "no").length,
      righe,
    };
  }).sort((a, b) => (b.no - a.no) || (b.attenzione - a.attenzione)
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
    const stato = (mancante || senzaFormazione || senzaPersona) ? "danger"
      : inScadenza ? "warn" : (valide.length ? "ok" : "mute");
    return { ruolo: r, persone, valide, senzaPersona, mancante, senzaFormazione, inScadenza, stato, requisito: req };
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

export function kpiFrom(lavoratori, scadenze) {
  const st = scadenze.map(s => statoScadenza(s.dataScadenza));
  const scadute = st.filter(x => x === "scaduta").length;
  const trenta = st.filter(x => x === "in-scadenza").length;
  const conProblemi = new Set(
    scadenze.filter(s => statoScadenza(s.dataScadenza) !== "regolare")
            .map(s => s.lavoratoreId).values());
  const regolari = lavoratori.filter(l => l.attivo && !conProblemi.has(l.id)).length;
  return { scadute, trenta, regolari };
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
        cantieri:   () => read("cantieri"),
        azioni:     () => read("azioni"),
        ispezioni:  () => read("ispezioni"),
        // Collezioni di S4/S5: le organizzazioni già attive non le hanno
        // ancora. Firestore, su una collezione che non esiste, risponde con
        // un elenco vuoto: le schermate si aprono vuote, non si rompono.
        mansioni:   () => read("mansioni"),
        nomine:     () => read("nomine"),
        dpi:        () => read("dpi"),
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
      cantieri:   async () => mem.cantieri,
      // le azioni di esempio PIÙ quelle arrivate da Sentinella (ponte demo):
      // in demo le due app comunicano solo così, in live è la stessa
      // collezione e questa riga non esiste nemmeno.
      azioni:     async () => [...mem.azioni, ...ponteDemoLeggi().filter(a => !mem.azioni.some(x => x.id === a.id))],
      ispezioni:  async () => mem.ispezioni,
      mansioni:   async () => mem.mansioni || [],
      nomine:     async () => mem.nomine || [],
      dpi:        async () => mem.dpi || [],
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
