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
//   documenti/{id}:  { titolo, meta, stato: valido|da-rivedere|scaduto }
// Lo "stato" delle scadenze non si salva: si CALCOLA dalla data
// (scaduta / entro 30gg / regolare) — niente dati derivati nel DB.
// ============================================================

import { parseCsvLine, giorniTra } from "../../shared/deepwork-id-client/dw-shell.js";

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
    { id: "c1", titolo: "DVR — Documento Valutazione Rischi", meta: "Aggiornato 03/2026", stato: "valido" },
    { id: "c2", titolo: "Piano di Emergenza", meta: "Aggiornato 01/2026", stato: "valido" },
    { id: "c3", titolo: "Nomine RSPP / addetti", meta: "Revisione richiesta", stato: "da-rivedere" },
  ],
};

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

// Adempimenti HSE TIPICI di una cava, come voci preimpostate dello
// scadenzario (stessa idea di SOGLIE_PRESET in Sentinella): l'utente sceglie
// l'adempimento invece di digitarlo, e Scudo prepara descrizione e tipo. Fonti
// e ragionamento in vault/RICERCA_HSE_SCADENZE_CAVA.md. Doppio binario: D.Lgs
// 81/2008 (generale) + D.Lgs 624/1996 (estrattivo, DSS). categoria = persona
// (legata al lavoratore) | azienda (di sito). `tipo` mappa sui tipi già
// presenti nel form. Le PERIODICITÀ non sono qui: dipendono dal DVR/DSS e dal
// medico competente → ogni preset porta `daVerificare` (niente scadenza
// automatica, la data la mette l'utente).
export const SCADENZE_PRESET = [
  { chiave: "sorv-sanitaria",   categoria: "persona", tipo: "Visita medica", etichetta: "Sorveglianza sanitaria — visita periodica (art. 41)" },
  { chiave: "form-generale",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione generale + specifica (art. 37)" },
  { chiave: "form-aggiorn",     categoria: "persona", tipo: "Formazione",    etichetta: "Aggiornamento formazione lavoratori" },
  { chiave: "form-preposto",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento preposto" },
  { chiave: "form-dirigente",   categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento dirigente" },
  { chiave: "primo-soccorso",   categoria: "persona", tipo: "Corso",         etichetta: "Primo soccorso — aggiornamento addetti" },
  { chiave: "antincendio",      categoria: "persona", tipo: "Corso",         etichetta: "Antincendio — aggiornamento addetti" },
  { chiave: "rls",              categoria: "persona", tipo: "Formazione",    etichetta: "RLS — aggiornamento periodico" },
  { chiave: "patentino-attr",   categoria: "persona", tipo: "Patente",       etichetta: "Abilitazione attrezzature (escavatore, PLE, gru…)" },
  { chiave: "fochino",          categoria: "persona", tipo: "Patente",       etichetta: "Fochino — abilitazione brillamento mine" },
  { chiave: "dss",              categoria: "azienda", tipo: "Altro",         etichetta: "DSS — Documento di Sicurezza e Salute (D.Lgs 624/96)" },
  { chiave: "dvr",              categoria: "azienda", tipo: "Altro",         etichetta: "DVR — aggiornamento" },
  { chiave: "verifica-attr",    categoria: "azienda", tipo: "Altro",         etichetta: "Verifica periodica attrezzature (D.M. 11/04/2011)" },
  { chiave: "riunione-sic",     categoria: "azienda", tipo: "Altro",         etichetta: "Riunione periodica di sicurezza (art. 35)" },
];

// Ritorna il preset con quella chiave (o null). daVerificare SEMPRE true: la
// periodicità va confermata con RSPP / medico competente.
export function presetScadenza(chiave) {
  const p = SCADENZE_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}

// Import scadenze da CSV (onboarding: caricare lo scadenzario esistente —
// visite mediche, corsi, patentini con le date — invece di riscriverlo a
// mano). Colonne: lavoratore;tipo;descrizione;scadenza (header opzionale).
// Il lavoratore è un NOME (l'associazione all'id avviene a valle, nella UI);
// vuoto o "AZIENDA" = scadenza aziendale (lavoratore null). Tiene solo le
// righe con data valida (AAAA-MM-GG); tipo assente → "Altro". Pura e testabile.
export function parseScadenzeCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !/^lavoratore\s*;/i.test(r))
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
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = mem[name].find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = mem[name].filter(x => x.id !== docId); },
    };
  }
  return { mode, ...api };
}
