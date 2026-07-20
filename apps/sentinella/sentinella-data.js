// ============================================================
// Sentinella — accesso dati (C5). Schema condiviso (orgCollection
// da autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/sentinella/):
//   monitoraggi/{id}: { nome, tipo, valore, soglia, unita, nota }
//     → lo stato si CALCOLA: valore/soglia ≥1 superamento, ≥0.9 attenzione
//   adempimenti/{id}: { titolo, ente, scadenza (ISO) } → urgenza dalle date
//   registri/{id}:    { titolo, nota, stato: aggiornato|in-attesa }
// ============================================================

const DEMO = {
  monitoraggi: [
    { id: "v1", nome: "Vibrazioni V1 — abitato Sud", tipo: "vibrazioni", valore: 1.8, soglia: 5, unita: "mm/s", nota: "ultimo evento 12/07" },
    { id: "v2", nome: "Vibrazioni V2 — confine Nord", tipo: "vibrazioni", valore: 5.6, soglia: 5, unita: "mm/s", nota: "volata fronte Nord 17/07" },
    { id: "p1", nome: "Polveri PM10 — confine Est", tipo: "polveri", valore: 36.8, soglia: 40, unita: "µg/m³", nota: "media 7gg" },
    { id: "r1", nome: "Rumore — perimetro Ovest", tipo: "rumore", valore: 62, soglia: 70, unita: "dB(A)", nota: "campagna 06/2026" },
    { id: "a1", nome: "Acque — vasca decantazione", tipo: "acque", valore: 12, soglia: 35, unita: "mg/l SST", nota: "campionamento 15/07" },
  ],
  adempimenti: [
    { id: "d1", titolo: "Relazione annuale emissioni", ente: "ARPA", scadenza: "2026-08-10" },
    { id: "d2", titolo: "Rinnovo AUA", ente: "SUAP", scadenza: "2026-09-30" },
    { id: "d3", titolo: "Verifica fonometrica semestrale", ente: "—", scadenza: "2026-09-30" },
  ],
  registri: [
    { id: "g1", titolo: "Registro rifiuti", nota: "ultimo carico 16/07", stato: "aggiornato" },
    { id: "g2", titolo: "Registro acque meteoriche", nota: "aggiornato 07/2026", stato: "aggiornato" },
    { id: "g3", titolo: "Formulari trasporto", nota: "3 in attesa di quarta copia", stato: "in-attesa" },
  ],
};

export function statoMisura(m) {
  const r = (+m.valore || 0) / Math.max(0.001, +m.soglia || 1);
  if (r >= 1) return { cls: "danger", label: "Superamento", ratio: r };
  if (r >= 0.9) return { cls: "warn", label: "Attenzione", ratio: r };
  return { cls: "ok", label: "Conforme", ratio: r };
}
export function giorni(dataISO, oggi = new Date()) {
  return Math.floor((new Date(dataISO + "T00:00:00") - oggi) / 86400000);
}
export function kpiFrom(monitoraggi, adempimenti) {
  return {
    attivi: monitoraggi.length,
    superamenti: monitoraggi.filter(m => statoMisura(m).cls === "danger").length,
    adempimenti30: adempimenti.filter(a => giorni(a.scadenza) <= 30).length,
  };
}

export async function sentinellaData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "sentinella" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        monitoraggi: () => read("monitoraggi"), adempimenti: () => read("adempimenti"), registri: () => read("registri"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n).firestore, id.orgCollection(n).path + "/" + i), d),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n).firestore, id.orgCollection(n).path + "/" + i)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      monitoraggi: async () => mem.monitoraggi, adempimenti: async () => mem.adempimenti, registri: async () => mem.registri,
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = mem[n].find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = mem[n].filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
