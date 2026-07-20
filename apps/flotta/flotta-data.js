// ============================================================
// Flotta — accesso dati (C3). Schema condiviso: Firestore via SDK
// Deepwork ID (orgCollection) da autenticati, demo in memoria
// altrimenti. Collezioni (sotto organizations/{org}/apps/flotta/):
//   mezzi/{id}:        { nome, ore, area, stato: operativo|fermo|verifica }
//   manutenzioni/{id}: { titolo, mezzo, dataPrevista (ISO) }
//   costi/{id}:        { voce, importo (EUR), nota }
// L'urgenza delle manutenzioni si CALCOLA dalla data (mai salvata).
// ============================================================

const DEMO = {
  mezzi: [
    { id: "m1", nome: "Escavatore E1 — CAT 352", ore: 5870, area: "fronte Est", stato: "operativo" },
    { id: "m2", nome: "Escavatore E2 — Volvo EC480", ore: 3210, area: "piazzale", stato: "operativo" },
    { id: "m3", nome: "Dumper D1 — CAT 745", ore: 8420, area: "", stato: "operativo" },
    { id: "m4", nome: "Dumper D3 — CAT 745", ore: 9105, area: "officina", stato: "fermo" },
    { id: "m5", nome: "Perforatrice P2 — Epiroc", ore: 2980, area: "fronte Est", stato: "verifica" },
    { id: "m6", nome: "Pala P1 — CAT 980", ore: 6540, area: "frantoio", stato: "operativo" },
  ],
  manutenzioni: [
    { id: "n1", titolo: "Tagliando 500h", mezzo: "Escavatore E1", dataPrevista: "2026-07-31" },
    { id: "n2", titolo: "Rotazione gomme", mezzo: "Dumper D1", dataPrevista: "2026-08-05" },
    { id: "n3", titolo: "Revisione annuale", mezzo: "Pala P1", dataPrevista: "2026-08-20" },
  ],
  costi: [
    { id: "c1", voce: "Carburante", importo: 8400, nota: "+6% sul mese scorso" },
    { id: "c2", voce: "Ricambi e officina", importo: 3150, nota: "" },
    { id: "c3", voce: "Noleggi esterni", importo: 1200, nota: "gru mobile 2gg" },
  ],
};

export function urgenza(dataISO, oggi = new Date()) {
  const g = Math.floor((new Date(dataISO + "T00:00:00") - oggi) / 86400000);
  if (g < 0) return { cls: "danger", label: "Scaduta", giorni: g };
  if (g <= 30) return { cls: "warn", label: g + " gg", giorni: g };
  return { cls: "ok", label: g + " gg", giorni: g };
}

export function kpiFrom(mezzi, manutenzioni, costi) {
  return {
    operativi: mezzi.filter(m => m.stato === "operativo").length,
    inManutenzione: mezzi.filter(m => m.stato !== "operativo").length,
    tagliandi30: manutenzioni.filter(n => { const g = urgenza(n.dataPrevista).giorni; return g <= 30; }).length,
    carburante: costi.filter(c => /carburante/i.test(c.voce)).reduce((t, c) => t + (+c.importo || 0), 0),
  };
}

export async function flottaData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "flotta" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        mezzi: () => read("mezzi"), manutenzioni: () => read("manutenzioni"), costi: () => read("costi"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n).firestore, id.orgCollection(n).path + "/" + i), d),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      mezzi: async () => mem.mezzi, manutenzioni: async () => mem.manutenzioni, costi: async () => mem.costi,
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); mem[n].push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = mem[n].find(v => v.id === i); if (x) Object.assign(x, d); },
    };
  }
  return { mode, ...api };
}
