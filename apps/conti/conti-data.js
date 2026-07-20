// ============================================================
// Conti — accesso dati (C4). Schema condiviso (orgCollection da
// autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/conti/):
//   fatture/{id}: { numero, cliente, importo, emessa (ISO), scadenza (ISO), incassata (bool) }
//   gare/{id}:    { titolo, base, scadenza (ISO), stato: aperta|vinta|persa }
// KPI CALCOLATI: da incassare, in scadenza, gare aperte, DSO.
// ============================================================

const DEMO = {
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
    ? Math.round(aperte.reduce((t, f) => t + Math.max(0, -giorni(f.emessa, oggi)), 0) / aperte.length)
    : 0;
  return { daIncassare, inScadenza, gareAperte, dso };
}

export async function contiData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "conti" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        fatture: () => read("fatture"), gare: () => read("gare"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n).firestore, id.orgCollection(n).path + "/" + i), d),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      fatture: async () => mem.fatture, gare: async () => mem.gare,
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); mem[n].push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = mem[n].find(v => v.id === i); if (x) Object.assign(x, d); },
    };
  }
  return { mode, ...api };
}
