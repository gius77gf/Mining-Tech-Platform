// ============================================================
// Terra — accesso dati (C6). Stesso schema di scudo-data.js:
// Firestore via SDK Deepwork ID (orgCollection) da autenticati,
// demo in memoria altrimenti (tour/mockup).
// Collezioni (sotto organizations/{org}/apps/terra/):
//   fronti/{id}:  { nome, banco, quota, dettaglio,
//                   avanzamento (0-100), stato: attivo|sospeso }
//   rilievi/{id}: { titolo, data (ISO yyyy-mm-dd), tipo,
//                   volumeM3|null, stato: elaborato|pianificato }
//   piano/{id}:   { titolo, dettaglio, stato: vigente|in-esame,
//                   pianificatoAnnuoM3?, riserveM3? }
// I KPI non si salvano mai: si CALCOLANO dai rilievi
// (volumi mese = somma dei volumi elaborati del mese,
//  avanzamento piano = estratto anno / pianificato anno).
// ============================================================

import { parseCsvLine, numIt } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  fronti: [
    { id: "f1", nome: "Fronte Nord", banco: "banco 2", quota: 340, dettaglio: "Prossima volata 12:30", avanzamento: 72, stato: "attivo" },
    { id: "f2", nome: "Fronte Est", banco: "banco 1", quota: 355, dettaglio: "Perforazione in corso · 14/22 fori", avanzamento: 41, stato: "attivo" },
    { id: "f3", nome: "Fronte Sud", banco: "banco 3", quota: 320, dettaglio: "Verifica stabilità scarpata", avanzamento: 18, stato: "sospeso" },
  ],
  rilievi: [
    { id: "r1", titolo: "Rilievo drone 15/07", data: "2026-07-15", tipo: "Ortofoto + DEM", volumeM3: 19400, stato: "elaborato", metodo: "RTK+GCP", gsd: "2" },
    { id: "r2", titolo: "Rilievo drone 01/07", data: "2026-07-01", tipo: "Ortofoto + DEM", volumeM3: 18600, stato: "elaborato" },
    { id: "r3", titolo: "Rilievo drone 16/06", data: "2026-06-16", tipo: "Ortofoto + DEM", volumeM3: 21300, stato: "elaborato" },
    { id: "r4", titolo: "Rilievo drone 15/05", data: "2026-05-15", tipo: "Ortofoto + DEM", volumeM3: 20100, stato: "elaborato" },
    { id: "r5", titolo: "Prossimo rilievo", data: "2026-08-01", tipo: "Drone pianificato", volumeM3: null, stato: "pianificato" },
  ],
  piano: [
    { id: "p1", titolo: "Autorizzazione vigente", dettaglio: "Scadenza 2029", stato: "vigente", pianificatoAnnuoM3: 125000, riserveM3: 1200000 },
    { id: "p2", titolo: "Variante fronte Sud", dettaglio: "Da valutare dopo verifica stabilità", stato: "in-esame" },
  ],
};

// formattazione compatta dei volumi (38k, 1.2M) per i KPI
export function fmtM3(v) {
  if (v == null) return "—";
  if (v >= 1e6) return (Math.round(v / 1e5) / 10) + "M";
  if (v >= 1e3) return Math.round(v / 1e3) + "k";
  return String(v);
}

// Volume estratto da un fronte = somma dei m³ dei rilievi ELABORATI di
// quel fronte (i pianificati e i volumi assenti non contano). È il "m³
// estratti" mostrato per fronte. Funzione pura e testabile.
export function volumeFronte(rilievi, fronteId) {
  return (rilievi || [])
    .filter(r => r.fronteId === fronteId && r.stato === "elaborato" && r.volumeM3 != null)
    .reduce((s, r) => s + r.volumeM3, 0);
}

// Da volume estratto (m³ in banco) a tonnellate e valore economico:
// tonnellate = m³ × densità (t/m³); valore = tonnellate × prezzo (€/t).
// È l'anello che lega il rilievo alla contabilità. Densità e prezzo
// dipendono dal materiale (l'utente li imposta). Numeri non validi → 0.
export function valoreMateriale(volumeM3, densita, prezzoTon) {
  const v = Math.max(0, +volumeM3 || 0), d = Math.max(0, +densita || 0), p = Math.max(0, +prezzoTon || 0);
  const tonnellate = v * d;
  return { tonnellate, valore: tonnellate * p };
}

// Qualità del dato di un rilievo: mette insieme metodo (RTK/PPK, GCP…) e
// GSD in una stringa breve, così il volume è "difendibile" in audit senza
// doverlo ricalcolare. Stringa vuota se non si sa nulla. Pura e testabile.
export function qualitaRilievo(r) {
  const parti = [];
  if (r && r.metodo) parti.push(r.metodo);
  if (r && r.gsd != null && String(r.gsd).trim() !== "") parti.push("GSD " + r.gsd + " cm");
  return parti.join(" · ");
}

// Deplezione delle riserve: dalla riserva stimata, da quanto già estratto
// nell'anno e dal ritmo annuo pianificato, calcola la riserva RESIDUA e la
// durata stimata in anni. È la "personalità" di Terra (nessun competitor la
// racconta in modo semplice). Ritorna null se non c'è una riserva stimata;
// anni null se il ritmo annuo non è noto. Pura e testabile.
export function riservaResidua(riserveM3, estrattoAnno, rateAnnuoM3) {
  if (riserveM3 == null) return null;
  const residuo = Math.max(0, (+riserveM3 || 0) - (+estrattoAnno || 0));
  const rate = +rateAnnuoM3 || 0;
  return { residuo, anni: rate > 0 ? residuo / rate : null };
}

// Andamento dei volumi: confronta gli ULTIMI DUE rilievi elaborati (per data)
// per dire a colpo d'occhio se l'estrazione sta accelerando o rallentando —
// utile per capire se si è "in pari" col piano. Ritorna null se non ci sono
// almeno due rilievi elaborati con volume. Pura e testabile.
export function trendVolumi(rilievi) {
  const el = (rilievi || [])
    .filter(r => r.stato === "elaborato" && r.volumeM3 != null)
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  if (el.length < 2) return null;
  const ultimo = +el[0].volumeM3 || 0, precedente = +el[1].volumeM3 || 0;
  const delta = ultimo - precedente;
  return { ultimo, precedente, delta, pct: precedente > 0 ? Math.round(100 * delta / precedente) : null };
}

// Import rilievi elaborati da CSV (onboarding: caricare lo storico dei
// rilievi drone). Colonne: data;volumeM3[;metodo;gsd] (header opzionale).
// Tiene solo le righe con data valida (AAAA-MM-GG) e volume numerico ≥ 0.
// Pura e testabile.
export function parseRilieviCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !/^data\s*;/i.test(r))
    .map(r => {
      const [data, volumeM3, metodo, gsd] = parseCsvLine(r);
      return {
        data: (data || "").trim(),
        volumeM3: numIt(volumeM3),
        metodo: (metodo || "").trim() || null,
        gsd: (gsd || "").trim() || null,
      };
    })
    .filter(p => /^\d{4}-\d{2}-\d{2}$/.test(p.data) && Number.isFinite(p.volumeM3) && p.volumeM3 >= 0);
}

export function kpiFrom(fronti, rilievi, piano, oggi = new Date()) {
  // mese/anno correnti in ora LOCALE (le date dei rilievi sono stringhe locali
  // yyyy-mm-dd): con toISOString, nelle prime ore dopo mezzanotte del 1° del
  // mese si sarebbe puntato al mese/anno precedente azzerando i volumi.
  const ym = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).padStart(2, "0")}`;  // yyyy-mm
  const anno = String(oggi.getFullYear());
  const elaborati = rilievi.filter(r => r.stato === "elaborato" && r.volumeM3 != null);
  const mese = elaborati.filter(r => (r.data || "").slice(0, 7) === ym);
  const volumiMese = mese.reduce((s, r) => s + r.volumeM3, 0);
  const estrattoAnno = elaborati.filter(r => (r.data || "").slice(0, 4) === anno)
                                .reduce((s, r) => s + r.volumeM3, 0);
  const ref = piano.find(p => p.pianificatoAnnuoM3 > 0);
  const avanzamento = ref ? Math.round(100 * estrattoAnno / ref.pianificatoAnnuoM3) : null;
  return {
    volumiMese,
    rilieviMese: mese.length,
    avanzamento,                                       // % (null se piano assente)
    riserveM3: ref && ref.riserveM3 != null ? ref.riserveM3 : null,
    frontiAttivi: fronti.filter(f => f.stato === "attivo").length,
  };
}

export async function terraData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "terra" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        fronti: () => read("fronti"),
        rilievi: () => read("rilievi"),
        piano: () => read("piano"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), data),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) { /* backend assente: demo */ }

  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      fronti: async () => mem.fronti,
      rilievi: async () => mem.rilievi,
      piano: async () => mem.piano,
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = mem[name].find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = mem[name].filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
