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
    { id: "a5", titolo: "Controllo pre-turno mezzi", dettaglio: "Squadra B · completato", stato: "conclusa" },
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

// Causali di fermo STANDARDIZZATE: senza una lista fissa non si possono
// calcolare OEE e disponibilità (servono categorie confrontabili nel
// tempo, non testo libero). Sono le voci tipiche di un fermo in cava.
export const CAUSALI_FERMO = [
  "Guasto meccanico",
  "Mancanza materiale",
  "Attesa mezzo",
  "Intasamento impianto",
  "Meteo",
  "Manutenzione programmata",
  "Cambio turno",
  "Sicurezza",
  "Altro",
];

// Riepilogo dei fermi (attività in stato "anomalia") per causale, ordinato
// per frequenza decrescente. Una causale non riconosciuta o assente
// confluisce in "Altro". Funzione pura e testabile.
export function riepilogoFermi(attivita) {
  const conteggi = {};
  for (const a of attivita || []) {
    if (a.stato !== "anomalia") continue;
    const c = CAUSALI_FERMO.includes(a.causale) ? a.causale : "Altro";
    conteggi[c] = (conteggi[c] || 0) + 1;
  }
  return Object.entries(conteggi)
    .map(([causale, conto]) => ({ causale, conto }))
    .sort((a, b) => b.conto - a.conto || a.causale.localeCompare(b.causale, "it"));
}

// Riassunto testuale di un rapportino di turno STRUTTURATO (turno, squadra,
// produzione, consegne per il turno successivo = handover). Serve alla lista
// e all'eventuale export/consegna. Stringa vuota se non c'è nulla. Pura e
// testabile.
export function riassuntoRapportino(r) {
  const parti = [];
  if (r && r.turno) parti.push("Turno " + r.turno);
  if (r && r.squadra) parti.push(r.squadra);
  if (r && r.produzione) parti.push("Produzione: " + r.produzione);
  if (r && r.note) parti.push("Consegne: " + r.note);
  return parti.join(" · ");
}

export function kpiFrom(attivita, squadre, rapportini) {
  return {
    squadreAttive: squadre.filter(q => q.stato === "operativa").length,
    inCorso: attivita.filter(a => a.stato === "in-corso").length,
    rapportiniOggi: rapportini.filter(r => r.stato === "inviato").length,
    anomalie: attivita.filter(a => a.stato === "anomalia").length,
  };
}

// Piano di carico importato da CSV (colonne: foro;x;fila;prof;prog;borr;rit).
// Solo foro e prog vengono usati per calcoli/chiavi, quindi qui si coercono
// a numero e le righe con valori non validi vengono scartate. Gli altri
// campi restano testo grezzo del file: vanno SEMPRE escapati dove mostrati
// (vedi docs/AUDIT_SICUREZZA.md punto 13). Funzione pura e testabile.
export function parsePianoCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !/^foro;/i.test(r))
    .map(r => {
      const [foro, x, fila, prof, prog, borr, rit] = r.split(";");
      return { foro: +foro, x, fila, prof, prog: +prog, borr, rit, reale: null };
    })
    .filter(p => p.foro > 0 && p.prog > 0);
}

// Ponte progettato-vs-reale (Genesi→Campo): scostamento della carica REALE
// dal progetto, per foro. Funzioni pure e testabili — sono il cuore del
// registro che il fochino usa per capire se ha caricato come previsto.
// scartoPct: frazione |reale-prog|/prog (null se non ancora registrato).
export function scartoPct(reale, prog) {
  if (reale == null) return null;
  return Math.abs(reale - prog) / (prog || 1);
}
// scartoLivello: classifica lo scostamento — ok ≤10%, warn ≤25%, oltre danger.
export function scartoLivello(reale, prog) {
  const s = scartoPct(reale, prog);
  if (s == null) return "da-registrare";
  if (s <= 0.10) return "ok";
  if (s <= 0.25) return "warn";
  return "danger";
}
// Riepilogo del consuntivo di volata: progettato totale, stimato reale
// (carica reale dei fori registrati + progetto per quelli ancora da
// registrare), scostamento % e livello. È il numero che il fochino legge
// in cima al registro. Funzione pura e testabile; null se piano vuoto.
export function pianoRiepilogo(piano) {
  if (!piano || !piano.length) return null;
  const reg = piano.filter(p => p.reale != null);
  const progettatoKg = piano.reduce((t, p) => t + p.prog, 0);
  const stimatoKg = reg.reduce((t, p) => t + p.reale, 0)
                  + piano.filter(p => p.reale == null).reduce((t, p) => t + p.prog, 0);
  const pct = Math.round((stimatoKg - progettatoKg) / progettatoKg * 100);
  return {
    registrati: reg.length,
    totale: piano.length,
    progettatoKg,
    stimatoKg,
    pct,
    livello: scartoLivello(stimatoKg, progettatoKg),
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
