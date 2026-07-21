// ============================================================
// Sentinella — accesso dati (C5). Schema condiviso (orgCollection
// da autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/sentinella/):
//   monitoraggi/{id}: { nome, tipo, valore, soglia, unita, nota }
//     → lo stato si CALCOLA: valore/soglia ≥1 superamento, ≥0.9 attenzione
//   adempimenti/{id}: { titolo, ente, scadenza (ISO) } → urgenza dalle date
//   registri/{id}:    { titolo, nota, stato: aggiornato|in-attesa }
// ============================================================

import { parseCsvLine, numIt } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
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
// Riepilogo di conformità: quanti monitoraggi sono conformi / in
// attenzione / in superamento, a colpo d'occhio. Usa statoMisura (stessa
// logica dei badge). Funzione pura e testabile.
export function riepilogoConformita(monitoraggi) {
  const r = { conformi: 0, attenzione: 0, superamento: 0, totale: (monitoraggi || []).length };
  for (const m of monitoraggi || []) {
    const c = statoMisura(m).cls;
    if (c === "danger") r.superamento++;
    else if (c === "warn") r.attenzione++;
    else r.conformi++;
  }
  return r;
}

// Import monitoraggi (sensori/centraline) da CSV (onboarding: caricare i punti
// di misura esistenti con soglia e ultimo valore invece di crearli a mano).
// Colonne: nome;tipo;valore;soglia;unita[;nota] (header opzionale). Tiene solo
// le righe con nome, valore numerico ≥ 0 e soglia > 0 (servono per calcolare
// lo stato conforme/attenzione/superamento). Pura e testabile.
export function parseMonitoraggiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !/^nome\s*;/i.test(r))
    .map(r => {
      const [nome, tipo, valore, soglia, unita, nota] = parseCsvLine(r);
      return {
        nome: (nome || "").trim(),
        tipo: (tipo || "").trim() || "",
        valore: numIt(valore),
        soglia: numIt(soglia),
        unita: (unita || "").trim() || "",
        nota: (nota || "").trim() || "",
      };
    })
    .filter(m => m.nome && Number.isFinite(m.valore) && m.valore >= 0 && Number.isFinite(m.soglia) && m.soglia > 0);
}

export function kpiFrom(monitoraggi, adempimenti) {
  return {
    attivi: monitoraggi.length,
    superamenti: monitoraggi.filter(m => statoMisura(m).cls === "danger").length,
    adempimenti30: adempimenti.filter(a => giorni(a.scadenza) <= 30).length,
  };
}

// ------------------------------------------------------------
// Libreria di SOGLIE NORMATIVE preimpostate: aiuta chi non è
// tecnico a impostare un sensore con un valore di riferimento
// corretto invece di doverlo cercare. I valori vengono da fonti
// secondarie concordanti (vedi ecosistema-vault "Soglie normative
// — riferimento per Sentinella"): NON sono verità legale, quindi
// ognuno porta l'avviso `daVerificare`. La soglia reale del sito
// dipende dalle prescrizioni autorizzative (AUA/AIA), dalla classe
// acustica comunale e dalla perizia. Il rumore ambientale NON è
// preimpostato: il limite assoluto dipende dalla classe acustica,
// quindi metterne uno fisso sarebbe fuorviante.
export const SOGLIE_PRESET = [
  { chiave: "din-res-fond",  tipo: "vibrazioni", etichetta: "Vibrazioni · residenziale, <10 Hz (DIN 4150-3)",        valore: 5,    unita: "mm/s",  fonte: "DIN 4150-3, fondazione riga 2" },
  { chiave: "din-res-alto",  tipo: "vibrazioni", etichetta: "Vibrazioni · residenziale, piano alto (DIN 4150-3)",    valore: 15,   unita: "mm/s",  fonte: "DIN 4150-3, piano più alto riga 2" },
  { chiave: "din-sens-fond", tipo: "vibrazioni", etichetta: "Vibrazioni · sensibile/storico, <10 Hz (DIN 4150-3)",   valore: 3,    unita: "mm/s",  fonte: "DIN 4150-3, fondazione riga 3" },
  { chiave: "din-ind-fond",  tipo: "vibrazioni", etichetta: "Vibrazioni · industriale/commerciale, <10 Hz (DIN 4150-3)", valore: 20, unita: "mm/s", fonte: "DIN 4150-3, fondazione riga 1" },
  { chiave: "usbm-intonaco", tipo: "vibrazioni", etichetta: "Vibrazioni · volata su intonaco, 4-15 Hz (USBM RI8507)", valore: 12.7, unita: "mm/s", fonte: "USBM RI 8507" },
  { chiave: "usbm-altafreq", tipo: "vibrazioni", etichetta: "Vibrazioni · volata, >40 Hz (USBM RI8507)",             valore: 50.8, unita: "mm/s",  fonte: "USBM RI 8507" },
  { chiave: "airblast-133",  tipo: "airblast",   etichetta: "Sovrappressione d'aria da volata (USBM RI8485)",        valore: 133,  unita: "dB",    fonte: "USBM RI 8485 / OSM" },
  { chiave: "pm10-giorno",   tipo: "polveri",    etichetta: "PM10 · media giornaliera (UE 2008/50/CE)",              valore: 50,   unita: "µg/m³", fonte: "Dir. UE 2008/50/CE" },
  { chiave: "pm10-anno",     tipo: "polveri",    etichetta: "PM10 · media annua (UE 2008/50/CE)",                    valore: 40,   unita: "µg/m³", fonte: "Dir. UE 2008/50/CE" },
  { chiave: "pm10-2030",     tipo: "polveri",    etichetta: "PM10 · media annua dal 2030 (UE 2024/2881)",            valore: 20,   unita: "µg/m³", fonte: "Dir. UE 2024/2881" },
];

// Ritorna il preset con quella chiave (o null). daVerificare è
// SEMPRE true: nessun valore normativo va usato senza controllo.
export function presetSoglia(chiave) {
  const p = SOGLIE_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}

// Distanza scalata (scaled distance) di una volata: SD = R / √W, dove R è
// la distanza (m) dal punto di volata al ricettore e W la carica massima
// di esplosivo per ritardo (kg). È l'indicatore standard per prevedere le
// vibrazioni: più è alta, minore è il rischio di superare le soglie PPV.
// Ritorna null se i dati non sono validi (niente divisione per zero/NaN).
export function scaledDistance(distanzaM, caricaKg) {
  const r = +distanzaM, w = +caricaKg;
  if (!(r > 0) || !(w > 0)) return null;
  return r / Math.sqrt(w);
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
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), d),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
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
