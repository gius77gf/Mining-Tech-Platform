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
//                      origineTipo: evento|ispezione|nc|"", origineId?|null,
//                      origineVoce?|null, origineNota? }
//                    → azione correttiva (CAPA) nata da un evento del registro
//                      infortuni/near-miss, da una voce non conforme di
//                      un'ispezione, o da una non conformità rilevata.
//   infortuni/{id}:  { data (ISO), tipo: infortunio|near-miss, gravita,
//                      giorniAssenza, descrizione, luogo,
//                      categoria? (near-miss: tipo di rischio),
//                      anonimo? (bool), segnalatoDaId?|null, rapida? (bool) }
//   ispezioni/{id}:  { modello (chiave), nome, ambito, cantiereId|null,
//                      responsabileId|null, data (ISO), periodicitaGiorni|null,
//                      riferimento?, voci: [{ id, testo }],
//                      esiti: { voceId: { esito: conforme|non-conforme|na, nota } },
//                      stato: programmata|in-corso|completata, dataChiusura?|null }
// Lo "stato" delle scadenze non si salva: si CALCOLA dalla data
// (scaduta / entro 30gg / regolare) — niente dati derivati nel DB.
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione } from "../../shared/deepwork-id-client/dw-shell.js";

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
  scadenze: [
    { id: "s1", lavoratoreId: "d1", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-07-02" },
    { id: "s2", lavoratoreId: "d2", tipo: "Corso", descrizione: "Corso antincendio", dataScadenza: "2026-07-11" },
    { id: "s3", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione preposto", dataScadenza: "2026-08-09" },
    { id: "s4", lavoratoreId: "d6", tipo: "DPI", descrizione: "Consegna DPI", dataScadenza: "2026-08-15" },
    { id: "s5", lavoratoreId: "d5", tipo: "Patente", descrizione: "CQC rinnovo", dataScadenza: "2026-09-02" },
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
};

/* Tipi di documento HSE gestiti (base normativa: D.Lgs 81/08; per le cave il
   documento di valutazione specifico è il DSS ex D.Lgs 624/96 art. 6/10,
   da inviare all'ASL prima dell'avvio; il POS riguarda i cantieri edili
   in cui l'azienda opera come impresa esecutrice — D.Lgs 81/08 art. 89). */
export const TIPI_DOCUMENTO = [
  "DSS", "POS", "DVR", "DUVRI", "Nomina", "Verbale DPI",
  "Idoneità sanitaria", "Attestato formazione", "Altro",
];

export function statoScadenza(dataISO, oggi = new Date()) {
  const giorni = giorniTra(dataISO, oggi);
  if (giorni < 0) return "scaduta";
  if (giorni <= 30) return "in-scadenza";
  return "regolare";
}

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
export function livelloScadenza(dataISO, oggi = new Date()) {
  if (!dataISO) return { cls: "ok", label: "senza data", giorni: null };
  const g = giorniTra(dataISO, oggi);
  if (isNaN(g)) return { cls: "ok", label: "senza data", giorni: null };
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
// la scadenza proposta alle azioni correttive). Pura; `oggi` iniettabile.
export function dataPiuGiorni(giorni, oggi = new Date()) {
  const n = Number(giorni);
  if (!Number.isFinite(n)) return null;
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + Math.round(n));
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

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
    .filter(p => /^\d{4}-\d{2}-\d{2}$/.test(p.dataScadenza));
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
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
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
      documenti:  async () => mem.documenti,
      infortuni:  async () => mem.infortuni,
      cantieri:   async () => mem.cantieri,
      azioni:     async () => mem.azioni,
      ispezioni:  async () => mem.ispezioni,
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = (mem[name] || []).filter(x => x.id !== docId); },
    };
  }
  return { mode, ...api };
}
