// ============================================================
// Campo — accesso dati (C2). Stesso schema di scudo-data.js:
// Firestore via SDK Deepwork ID (orgCollection) da autenticati,
// demo in memoria altrimenti (tour/mockup).
// Collezioni (sotto organizations/{org}/apps/campo/):
//   attivita/{id}:   { titolo, dettaglio, stato: pianificata|in-corso|anomalia|conclusa }
//   squadre/{id}:    { nome, persone, area, stato: operativa|ferma }
//   rapportini/{id}: { titolo, squadra, ora, stato: bozza|inviato }
// ============================================================

export const DEMO = {
  attivita: [
    { id: "a1", titolo: "Perforazione fronte Est", dettaglio: "Squadra A · 14/22 fori", stato: "in-corso" },
    { id: "a2", titolo: "Volata fronte Nord", dettaglio: "Ore 12:30 · fochino M. Rossi", stato: "pianificata" },
    { id: "a3", titolo: "Carico e trasporto", dettaglio: "Piazzale 2 → frantoio", stato: "in-corso" },
    { id: "a4", titolo: "Frantoio primario", dettaglio: "Fermo per intasamento tramoggia", stato: "anomalia" },
  ],
  squadre: [
    { id: "q1", nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" },
    { id: "q2", nome: "Squadra B — Carico", persone: 3, area: "piazzale 2", stato: "operativa" },
    { id: "q3", nome: "Squadra C — Impianto", persone: 2, area: "frantoio", stato: "ferma" },
  ],
  rapportini: [
    { id: "r1", titolo: "Rapportino perforazione", squadra: "Squadra A", ora: "11:20", stato: "inviato" },
    { id: "r2", titolo: "Rapportino impianto", squadra: "Squadra C", ora: "", stato: "bozza" },
    { id: "r3", titolo: "Rapportino trasporti", squadra: "Squadra B", ora: "10:05", stato: "inviato" },
  ],
};

export function kpiFrom(attivita, squadre, rapportini) {
  return {
    squadreAttive: squadre.filter(q => q.stato === "operativa").length,
    inCorso: attivita.filter(a => a.stato === "in-corso").length,
    rapportiniOggi: rapportini.filter(r => r.stato === "inviato").length,
    anomalie: attivita.filter(a => a.stato === "anomalia").length,
  };
}

export async function campoData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "campo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        attivita: () => read("attivita"),
        squadre: () => read("squadre"),
        rapportini: () => read("rapportini"),
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
      attivita: async () => mem.attivita,
      squadre: async () => mem.squadre,
      rapportini: async () => mem.rapportini,
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      aggiorna: async (name, docId, data) => { const x = mem[name].find(v => v.id === docId); if (x) Object.assign(x, data); },
      rimuovi: async (name, docId) => { mem[name] = mem[name].filter(v => v.id !== docId); },
    };
  }
  return { mode, ...api };
}
