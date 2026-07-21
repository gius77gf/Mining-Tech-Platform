// ============================================================
// Conti — accesso dati (C4). Schema condiviso (orgCollection da
// autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/conti/):
//   fatture/{id}: { numero, cliente, importo, emessa (ISO), scadenza (ISO), incassata (bool) }
//   gare/{id}:    { titolo, base, scadenza (ISO), stato: aperta|vinta|persa }
// KPI CALCOLATI: da incassare, in scadenza, gare aperte, DSO.
// ============================================================

export const DEMO = {
  fatture: [
    { id: "f1", numero: "2026/031", cliente: "Edilcave Srl", importo: 18300, emessa: "2026-06-07", scadenza: "2026-07-08", incassata: false },
    { id: "f2", numero: "2026/034", cliente: "Stradesud", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25", incassata: false },
    { id: "f3", numero: "2026/035", cliente: "Comune di Modica", importo: 8100, emessa: "2026-07-10", scadenza: "2026-08-10", incassata: false },
    { id: "f4", numero: "2026/036", cliente: "Calcestruzzi RG", importo: 5900, emessa: "2026-07-18", scadenza: "2026-08-18", incassata: false },
    { id: "f5", numero: "2026/028", cliente: "Edilcave Srl", importo: 12000, emessa: "2026-05-12", scadenza: "2026-06-12", incassata: true },
  ],
  gare: [
    { id: "g1", titolo: "Comune di Ragusa — inerti 2026-27", base: 120000, scadenza: "2026-07-28", stato: "aperta" },
    { id: "g2", titolo: "ANAS — manutenzione SS115", base: 340000, scadenza: "2026-08-12", stato: "aperta" },
    { id: "g3", titolo: "Consorzio bonifica — massi scogliera", base: 85000, scadenza: "2026-06-30", stato: "vinta" },
    { id: "g4", titolo: "Provincia — pietrisco lotto 3", base: 60000, scadenza: "2026-05-15", stato: "persa" },
  ],
};

export function giorni(dataISO, oggi = new Date()) {
  return Math.floor((new Date(dataISO + "T00:00:00") - oggi) / 86400000);
}

export function kpiFrom(fatture, gare, oggi = new Date()) {
  const aperte = fatture.filter(f => !f.incassata);
  const daIncassare = aperte.reduce((t, f) => t + (+f.importo || 0), 0);
  const inScadenza = aperte.filter(f => giorni(f.scadenza, oggi) <= 10).length;
  const gareAperte = gare.filter(g => g.stato === "aperta").length;
  // DSO ~ media dei giorni dall'emissione (sulle fatture non incassate)
  const dso = aperte.length
    ? Math.round(aperte.reduce((t, f) => t + Math.max(0, -giorni(f.emessa, oggi) || 0), 0) / aperte.length)
    : 0;
  return { daIncassare, inScadenza, gareAperte, dso };
}

// Aging degli incassi: suddivide le fatture NON incassate per fasce di
// ritardo rispetto alla scadenza (giorni negativi = scaduto). È lo
// strumento amministrativo con cui si capisce quanto credito è "vecchio"
// e va sollecitato per primo. Ogni fascia: numero fatture + importo.
export function agingIncassi(fatture, oggi = new Date()) {
  const b = {
    nonScaduto: { conto: 0, importo: 0 },
    g1_30:      { conto: 0, importo: 0 },
    g31_60:     { conto: 0, importo: 0 },
    g61_90:     { conto: 0, importo: 0 },
    oltre90:    { conto: 0, importo: 0 },
  };
  for (const f of fatture) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    // fattura senza data (o data non valida): non è classificabile come
    // scaduta → la contiamo come "non scaduto", non gonfiamo lo scaduto.
    if (isNaN(g)) { b.nonScaduto.conto++; b.nonScaduto.importo += (+f.importo || 0); continue; }
    const imp = +f.importo || 0;
    let k;
    if (g >= 0) k = "nonScaduto";
    else { const r = -g; k = r <= 30 ? "g1_30" : r <= 60 ? "g31_60" : r <= 90 ? "g61_90" : "oltre90"; }
    b[k].conto++; b[k].importo += imp;
  }
  b.scadutoTot = b.g1_30.importo + b.g31_60.importo + b.g61_90.importo + b.oltre90.importo;
  return b;
}

// Incasso atteso nei prossimi N giorni: somma delle fatture aperte la cui
// scadenza cade da oggi a oggi+N (non ancora scadute). È l'entrata di cassa
// PREVISTA, complementare all'aging (che guarda al ritardo passato).
export function incassoAtteso(fatture, giorniAvanti = 30, oggi = new Date()) {
  let importo = 0, conto = 0;
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g >= 0 && g <= giorniAvanti) { importo += (+f.importo || 0); conto++; }
  }
  return { conto, importo };
}

// Priorità di incasso: ordina le fatture APERTE per urgenza — prima le più
// in ritardo, a parità di ritardo prima l'importo più alto. Serve a sapere
// CHI sollecitare per primo. Ogni voce porta i giorni di ritardo (0 se non
// ancora scaduta). Funzione pura e testabile.
export function prioritaIncasso(fatture, oggi = new Date()) {
  return (fatture || [])
    .filter(f => !f.incassata)
    .map(f => {
      const g = giorni(f.scadenza, oggi);
      return { f, ritardo: Number.isFinite(g) ? Math.max(0, -g) : 0 };
    })
    .sort((a, b) => b.ritardo - a.ritardo || (+b.f.importo || 0) - (+a.f.importo || 0));
}

// Riepilogo delle gare d'appalto: quante aperte/vinte/perse, valore a
// base d'asta per stato, e tasso di vittoria sulle sole gare DECISE
// (vinte+perse; le aperte non contano ancora). tassoVittoria è null se
// non c'è ancora nessuna gara decisa. Funzione pura e testabile.
export function gareRiepilogo(gare) {
  const per = (s) => (gare || []).filter(g => g.stato === s);
  const somma = (arr) => arr.reduce((t, g) => t + (+g.base || 0), 0);
  const aperte = per("aperta"), vinte = per("vinta"), perse = per("persa");
  const decise = vinte.length + perse.length;
  return {
    aperte: aperte.length, vinte: vinte.length, perse: perse.length,
    baseAperta: somma(aperte), baseVinta: somma(vinte), basePersa: somma(perse),
    tassoVittoria: decise ? Math.round(100 * vinte.length / decise) : null,
  };
}

export async function contiData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "conti" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        fatture: () => read("fatture"), gare: () => read("gare"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), d),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      fatture: async () => mem.fatture, gare: async () => mem.gare,
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); mem[n].push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = mem[n].find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = mem[n].filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
