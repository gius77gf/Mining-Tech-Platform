// ============================================================
// Sentinella — accesso dati (C5). Schema condiviso (orgCollection
// da autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/sentinella/):
//   monitoraggi/{id}: { nome, tipo, valore, soglia, unita, nota,
//                       ricettoreId, letture:[{data,ora,valore}] }
//     → lo stato si CALCOLA: valore/soglia ≥1 superamento, ≥0.9 attenzione
//   adempimenti/{id}: { titolo, ente, scadenza (ISO) } → urgenza dalle date
//   registri/{id}:    { titolo, nota, stato: aggiornato|in-attesa }
//   ricettori/{id}:   { nome, tipo, distanza, classe, soglia, unita, nota }
//     → il punto sensibile da proteggere (casa, scuola, confine). Le norme
//       ragionano per RICETTORE: la soglia del ricettore, se impostata,
//       vince su quella del punto di misura collegato.
//   reclami/{id}:     { data, ora, tipo, ricettoreId, chi, descrizione,
//                       azione, stato: aperto|chiuso }
//   programma/{id}:   { monitoraggioId, ogniGiorni, tolleranzaGiorni,
//                       dal, nota, attivo } → il piano di monitoraggio:
//       che cosa va misurato, dove e ogni quanto. Lo stato (in regola /
//       da fare / in ritardo) si CALCOLA dall'ultima lettura del punto.
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  monitoraggi: [
    { id: "v1", nome: "Vibrazioni V1 — abitato Sud", tipo: "vibrazioni", valore: 1.8, soglia: 5, unita: "mm/s", nota: "ultimo evento 12/07", ricettoreId: "rc1",
      letture: [ { data: "2026-06-08", ora: "10:20", valore: 2.4 }, { data: "2026-06-19", ora: "11:05", valore: 1.9 }, { data: "2026-06-30", ora: "10:40", valore: 3.1 }, { data: "2026-07-12", ora: "11:15", valore: 1.8 } ] },
    { id: "v2", nome: "Vibrazioni V2 — confine Nord", tipo: "vibrazioni", valore: 5.6, soglia: 5, unita: "mm/s", nota: "volata fronte Nord 17/07", ricettoreId: "rc2",
      letture: [ { data: "2026-06-05", ora: "09:50", valore: 3.2 }, { data: "2026-06-16", ora: "10:10", valore: 4.4 }, { data: "2026-06-27", ora: "10:35", valore: 5.2 }, { data: "2026-07-06", ora: "11:00", valore: 3.9 }, { data: "2026-07-17", ora: "10:25", valore: 5.6 } ] },
    { id: "p1", nome: "Polveri PM10 — confine Est", tipo: "polveri", valore: 36.8, soglia: 40, unita: "µg/m³", nota: "media 7gg", ricettoreId: "rc3",
      letture: [ { data: "2026-06-14", valore: 22.5 }, { data: "2026-06-21", valore: 31 }, { data: "2026-06-28", valore: 44.2 }, { data: "2026-07-05", valore: 28.4 }, { data: "2026-07-12", valore: 33.7 }, { data: "2026-07-19", valore: 36.8 } ] },
    { id: "r1", nome: "Rumore — perimetro Ovest", tipo: "rumore", valore: 62, soglia: 70, unita: "dB(A)", nota: "campagna 06/2026", ricettoreId: "rc1",
      letture: [ { data: "2026-06-10", ora: "14:30", valore: 58 }, { data: "2026-06-24", ora: "15:00", valore: 64 }, { data: "2026-07-08", ora: "14:45", valore: 61 }, { data: "2026-07-22", ora: "15:20", valore: 62 } ] },
    { id: "a1", nome: "Acque — vasca decantazione", tipo: "acque", valore: 12, soglia: 35, unita: "mg/l SST", nota: "campionamento 15/07" },
  ],
  ricettori: [
    { id: "rc1", nome: "Casa Bianchi — via Cava 12", tipo: "abitazione", distanza: 320, classe: "III", soglia: 5, unita: "mm/s", nota: "abitazione più vicina al fronte Sud" },
    { id: "rc2", nome: "Confine Nord — mappale 214", tipo: "confine", distanza: 90, classe: "V", soglia: 20, unita: "mm/s", nota: "confine di proprietà, nessun edificio" },
    { id: "rc3", nome: "Scuola primaria — via Roma 4", tipo: "scuola", distanza: 640, classe: "I", soglia: 40, unita: "µg/m³", nota: "ricettore sensibile: orario scolastico 08–16" },
  ],
  reclami: [
    { id: "x1", data: "2026-07-17", ora: "10:30", tipo: "vibrazione", ricettoreId: "rc1", chi: "Sig. Bianchi",
      descrizione: "Ha sentito tremare i vetri durante la volata del mattino.",
      azione: "Mostrata la misura di V1 (1,8 mm/s, sotto soglia) e la scheda della volata.", stato: "chiuso" },
    { id: "x2", data: "2026-07-20", ora: "07:45", tipo: "polvere", ricettoreId: "rc3",
      chi: "Direzione scolastica", descrizione: "Polvere sui davanzali lato cava dopo giornata ventosa.",
      azione: "Bagnatura piste raddoppiata, verifica PM10 in corso.", stato: "aperto" },
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
  programma: [
    // il piano: ogni riga dice ogni quanti giorni va misurato un punto.
    // La tolleranza è il ritardo che l'azienda considera accettabile
    // prima di parlare di ritardo vero.
    { id: "pr1", monitoraggioId: "p1", ogniGiorni: 7,   tolleranzaGiorni: 2, dal: "2026-06-14", nota: "Centralina PM10 al confine: scarico settimanale dei dati.", attivo: true },
    { id: "pr2", monitoraggioId: "v1", ogniGiorni: 15,  tolleranzaGiorni: 3, dal: "2026-06-08", nota: "Sismografo abitato Sud.", attivo: true },
    { id: "pr3", monitoraggioId: "v2", ogniGiorni: 15,  tolleranzaGiorni: 3, dal: "2026-06-05", nota: "Sismografo confine Nord.", attivo: true },
    { id: "pr4", monitoraggioId: "r1", ogniGiorni: 90,  tolleranzaGiorni: 7, dal: "2026-06-10", nota: "Campagna fonometrica trimestrale del tecnico acustico.", attivo: true },
    { id: "pr5", monitoraggioId: "a1", ogniGiorni: 182, tolleranzaGiorni: 10, dal: "", nota: "Campionamento acque della vasca.", attivo: true },
  ],
  volate: [
    { id: "b1", data: "2026-07-17", fronte: "Fronte Nord", nFori: 42, kgTotali: 480, kgMaxRitardo: 18, distanzaRicettore: 320, esito: "regolare", note: "" },
    { id: "b2", data: "2026-07-03", fronte: "Fronte Est", nFori: 36, kgTotali: 410, kgMaxRitardo: 22, distanzaRicettore: 280, esito: "regolare", note: "" },
  ],
};

export function statoMisura(m) {
  const r = (+m.valore || 0) / Math.max(0.001, +m.soglia || 1);
  if (r >= 1) return { cls: "danger", label: "Superamento", ratio: r };
  if (r >= 0.9) return { cls: "warn", label: "Attenzione", ratio: r };
  return { cls: "ok", label: "Conforme", ratio: r };
}
export function giorni(dataISO, oggi = new Date()) {
  return giorniTra(dataISO, oggi);
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

// Data GG/MM/AAAA da ISO (formattazione pura per i testi delle allerte).
function dataIt(iso) {
  const s = String(iso || "").slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || "—");
}

// PRIORITÀ DI CONFORMITÀ per la dashboard: un'unica lista ordinata di allerte
// che unisce (1) i monitoraggi non conformi — superamento (danger) o attenzione
// (warn) — e (2) gli adempimenti ambientali: SCADUTI = danger (un termine
// mancato con l'ente è una criticità, non un semplice avviso — prima erano
// mostrati come "warn"), in scadenza entro 30 gg = warn. Danger prima. Ogni
// voce { gravita, categoria, titolo, dettaglio, badge }; titolo/dettaglio sono
// testo grezzo (nome misura/nota/ente) → escapare dove mostrati. Pura e
// testabile; `oggi` iniettabile.
export function prioritaConformita(monitoraggi, adempimenti, oggi = new Date()) {
  const items = [];
  for (const m of monitoraggi || []) {
    const st = statoMisura(m);
    if (st.cls === "ok") continue;
    items.push({ gravita: st.cls, categoria: "misura",
      titolo: m.nome || "Misura",
      dettaglio: m.valore + " " + (m.unita || "") + " / soglia " + m.soglia + (m.nota ? " · " + m.nota : ""),
      badge: st.label });
  }
  for (const a of adempimenti || []) {
    const g = giorni(a.scadenza, oggi);
    if (!Number.isFinite(g) || g > 30) continue;
    const scaduto = g < 0;
    items.push({ gravita: scaduto ? "danger" : "warn", categoria: "adempimento",
      titolo: a.titolo || "Adempimento",
      dettaglio: (a.ente && a.ente !== "—" ? a.ente + " · " : "") + "entro " + dataIt(a.scadenza),
      badge: scaduto ? "scaduto da " + (-g) + " gg" : g + " gg" });
  }
  const rank = { danger: 0, warn: 1 };
  const catRank = { misura: 0, adempimento: 1 };
  return items.sort((x, y) =>
    (rank[x.gravita] - rank[y.gravita]) ||
    (catRank[x.categoria] - catRank[y.categoria]) ||
    String(x.titolo).localeCompare(String(y.titolo), "it"));
}

// ------------------------------------------------------------
// SERIE STORICA di un punto di misura (F5). Lo storico `letture`
// esisteva già nei dati ma non si vedeva da nessuna parte: qui si
// calcola la GEOMETRIA del grafico (funzione pura, testabile), il
// disegno SVG lo fa la pagina. Nessuna libreria esterna.
// ------------------------------------------------------------

// Unità di ripiego per tipo di grandezza, usata SOLO se il punto non
// ha già la sua unità scritta dall'utente (che ha sempre la priorità).
export const UNITA_TIPO = {
  vibrazioni: "mm/s",
  airblast: "dB",
  rumore: "dB(A)",
  polveri: "µg/m³",
  acque: "mg/l",
};
export function unitaMisura(m) {
  const u = String((m && m.unita) || "").trim();
  return u || UNITA_TIPO[String((m && m.tipo) || "").trim().toLowerCase()] || "";
}

// Numero in formato italiano (virgola decimale), senza decimali inutili.
export function numeroIt(v) {
  const n = +v;
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("it-IT", { maximumFractionDigits: Math.abs(n) >= 100 ? 0 : 2 });
}

// Chiave di ordinamento di una lettura: data + ora. Le letture senza ora
// (inserite a mano) restano all'inizio del loro giorno — è il comportamento
// che c'era prima, quindi nessuna serie storica esistente cambia forma.
export function chiaveOrdine(l) {
  return String((l && l.data) || "").slice(0, 10) + " " + String((l && l.ora) || "");
}

// Data GG/MM/AAAA (o GG/MM) da ISO, per le etichette del grafico.
function dataBreve(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}` : String(iso || "");
}

// Passo "gradevole" per le tacche dell'asse dei valori (1, 2, 2.5, 5, 10 × 10^n).
function passoGradevole(grezzo) {
  if (!(grezzo > 0)) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(grezzo)));
  const n = grezzo / e;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * e;
}

const r1 = (n) => Math.round(n * 10) / 10;

// Geometria della serie storica di un punto di misura.
// Ritorna { vuoto, n, unita, soglia, box, punti, path, xTicks, yTicks,
//           lineaSoglia, superamenti, mostraPunti, max, ultimo, dal, al }.
// Regole: l'asse dei valori parte da 0; la SOGLIA è quella impostata
// dall'utente sul punto (mai inventata) e rientra nella scala solo se
// non schiaccia la linea dei dati — altrimenti resta segnalata come
// `fuoriScala`. Le etichette delle date si diradano da sole quando le
// letture sono tante, e i pallini spariscono sopra `maxPunti` lasciando
// solo la linea e i superamenti (che restano SEMPRE marcati).
export function serieStorica(m, opts = {}) {
  const w = +opts.larghezza || 320, h = +opts.altezza || 170;
  const maxEtichette = Math.max(2, +opts.maxEtichette || 6);
  const maxPunti = Math.max(2, +opts.maxPunti || 30);
  const padL = 42, padR = 12, padT = 14, padB = 26;
  const box = { w, h, x0: padL, y0: padT, x1: w - padR, y1: h - padB };
  const unita = unitaMisura(m);
  const sogliaRaw = +((m || {}).soglia);
  const soglia = Number.isFinite(sogliaRaw) && sogliaRaw > 0 ? sogliaRaw : null;
  // Ordinamento per data E ORA: con l'import dallo strumento (T1) nello stesso
  // giorno arrivano molte letture, e una serie storica fuori ordine
  // racconterebbe un andamento che non è mai esistito.
  const letture = (((m || {}).letture) || [])
    .map(l => ({ data: String((l && l.data) || "").slice(0, 10), ora: String((l && l.ora) || ""), valore: +((l || {}).valore) }))
    .filter(l => Number.isFinite(l.valore))
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });

  const base = {
    vuoto: letture.length === 0, n: letture.length, unita, soglia, box,
    punti: [], path: "", xTicks: [], yTicks: [], lineaSoglia: null,
    superamenti: 0, mostraPunti: true, max: null, ultimo: null, dal: "", al: "",
  };
  if (!letture.length) return base;

  const valori = letture.map(l => l.valore);
  const vmax = Math.max(...valori);
  const sogliaInScala = soglia != null && (vmax <= 0 || soglia <= vmax * 2.5);
  const alto = Math.max(vmax, sogliaInScala ? soglia : 0) * 1.1;
  const passo = passoGradevole((alto || 1) / 4);
  const yMax = Math.max(passo, Math.ceil((alto || passo) / passo) * passo);
  const px = (i) => letture.length === 1
    ? (box.x0 + box.x1) / 2
    : box.x0 + (i * (box.x1 - box.x0)) / (letture.length - 1);
  const py = (v) => box.y1 - (Math.min(Math.max(v, 0), yMax) / yMax) * (box.y1 - box.y0);

  const punti = letture.map((l, i) => ({
    x: r1(px(i)), y: r1(py(l.valore)), valore: l.valore, data: l.data, ora: l.ora,
    dataIt: dataIt(l.data) + (l.ora ? " " + l.ora : ""), etichetta: numeroIt(l.valore) + (unita ? " " + unita : ""),
    oltre: soglia != null && l.valore >= soglia,
  }));

  // etichette dei tempi diradate: prima, ultima e alcune intermedie
  const passoEt = Math.max(1, Math.ceil((letture.length - 1) / (maxEtichette - 1)) || 1);
  const idx = [];
  for (let i = 0; i < letture.length; i += passoEt) idx.push(i);
  if (idx[idx.length - 1] !== letture.length - 1) idx.push(letture.length - 1);
  const xTicks = idx.map(i => ({ x: punti[i].x, label: dataBreve(letture[i].data) }));

  const yTicks = [];
  for (let v = 0; v <= yMax + passo / 1000; v += passo) yTicks.push({ y: r1(py(v)), valore: v, label: numeroIt(v) });

  return {
    ...base,
    punti,
    path: punti.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" "),
    xTicks, yTicks,
    lineaSoglia: soglia == null ? null : {
      y: r1(py(soglia)), valore: soglia, fuoriScala: !sogliaInScala,
      label: numeroIt(soglia) + (unita ? " " + unita : ""),
    },
    superamenti: punti.filter(p => p.oltre).length,
    mostraPunti: letture.length <= maxPunti,
    max: vmax, ultimo: letture[letture.length - 1].valore,
    dal: dataIt(letture[0].data), al: dataIt(letture[letture.length - 1].data),
  };
}

// Import monitoraggi (sensori/centraline) da CSV (onboarding: caricare i punti
// di misura esistenti con soglia e ultimo valore invece di crearli a mano).
// Colonne: nome;tipo;valore;soglia;unita[;nota] (header opzionale). Tiene solo
// le righe con nome, valore numerico ≥ 0 e soglia > 0 (servono per calcolare
// lo stato conforme/attenzione/superamento). Pura e testabile.
export function parseMonitoraggiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
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

// Import degli ADEMPIMENTI ambientali da CSV (onboarding: caricare la lista di
// scadenze fornita dal consulente — AUA/AIA/ARPA, fonometrie, relazioni…).
// Colonne: titolo;ente;scadenza (header opzionale). Tiene solo le righe con
// titolo ed una scadenza valida (AAAA-MM-GG); ente vuoto → "—". titolo/ente
// sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseAdempimentiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "titolo"))
    .map(r => {
      const [titolo, ente, scadenza] = parseCsvLine(r);
      return {
        titolo: (titolo || "").trim(),
        ente: (ente || "").trim() || "—",
        scadenza: (scadenza || "").trim(),
      };
    })
    .filter(a => a.titolo && /^\d{4}-\d{2}-\d{2}$/.test(a.scadenza));
}

// Registro delle VOLATE (brogliaccio di brillamento): riepilogo per il quadro.
// In Italia il registro delle volate è un adempimento; qui è il log degli
// eventi con carica e distanza. Ritorna: totale, quante questo mese, kg totali
// del mese, data dell'ultima volata, e quante hanno avuto una contestazione.
// Pura e testabile; `oggi` iniettabile (mese-calendario locale).
export function riepilogoVolate(volate, oggi = new Date()) {
  const list = volate || [];
  const o = new Date(oggi);
  const ym = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`;
  const questoMese = list.filter(v => (v.data || "").slice(0, 7) === ym);
  const kgMese = questoMese.reduce((s, v) => s + (+v.kgTotali || 0), 0);
  let ultima = null;
  for (const v of list) {
    const d = (v.data || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!ultima || d > ultima)) ultima = d;
  }
  const contestazioni = list.filter(v => v.esito === "contestazione").length;
  return { totale: list.length, questoMese: questoMese.length, kgMese, ultima, contestazioni };
}

// Import registro volate da CSV. Colonne: data;fronte;nFori;kgTotali;
// kgMaxRitardo;distanzaRicettore;esito[;note][;ppvMisurata;ppvFonte;ppvPunto;ppvOra]
// (header opzionale). Tiene solo le righe con data valida (AAAA-MM-GG).
// esito: "contestazione" o "regolare" (default regolare). I numerici via numIt.
// fronte/note grezzi → escapare dove mostrati. Pura e testabile.
// Le quattro colonne della PPV misurata (T8) sono FACOLTATIVE e stanno in
// coda: un file esportato prima che esistessero si importa esattamente come
// prima, e la volata resta semplicemente senza PPV — mai con una inventata.
export function parseVolateCsv(text) {
  const num = (v) => { const n = numIt(v); return Number.isFinite(n) ? Math.max(0, n) : 0; };
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, fronte, nFori, kgTotali, kgMaxRitardo, distanzaRicettore, esito, note,
             ppvMisurata, ppvFonte, ppvPunto, ppvOra] = parseCsvLine(r);
      const v = {
        data: (data || "").trim(),
        fronte: (fronte || "").trim(),
        nFori: num(nFori), kgTotali: num(kgTotali), kgMaxRitardo: num(kgMaxRitardo),
        distanzaRicettore: num(distanzaRicettore),
        esito: (esito || "").trim().toLowerCase() === "contestazione" ? "contestazione" : "regolare",
        note: (note || "").trim(),
      };
      const ppv = campiPpvVolata(numIt(ppvMisurata), {
        fonte: (ppvFonte || "").trim().toLowerCase() === PPV_STRUMENTO ? PPV_STRUMENTO : PPV_MANUALE,
        punto: (ppvPunto || "").trim(), data: v.data, ora: (ppvOra || "").trim(),
      });
      return ppv ? { ...v, ...ppv } : v;
    })
    .filter(v => /^\d{4}-\d{2}-\d{2}$/.test(v.data));
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

// Carica MASSIMA per ritardo (kg) per non scendere sotto una distanza scalata
// OBIETTIVO a una data distanza dal ricettore: è l'inverso di scaledDistance,
// W = (R / SD)². Serve in progettazione: "a questa casa, per restare sopra la
// SD di sicurezza, non superare X kg per ritardo". null se i dati non sono
// validi. La SD obiettivo va scelta dallo storico del sito / dalla soglia PPV.
export function caricaMax(distanzaM, sdObiettivo) {
  const r = +distanzaM, sd = +sdObiettivo;
  if (!(r > 0) || !(sd > 0)) return null;
  return (r / sd) ** 2;
}

// ══════════════════════════════════════════════════════════════════════
// T1 · IMPORT DELLE LETTURE DALLO STRUMENTO
// Sismografi, fonometri e centraline esportano tutti un CSV, ma nessuno
// lo esporta uguale: cambia il separatore, cambia l'ordine delle colonne,
// cambia il formato della data. Per questo qui NON si indovina niente: il
// file viene letto in tabella grezza e poi è l'UTENTE a dire quale colonna
// è la data, quale l'ora e quale il valore. Nessun servizio esterno,
// nessuna libreria: il lettore è questo, sotto.
// ══════════════════════════════════════════════════════════════════════

// Separatore del file, deciso UNA volta su tutto il testo (non riga per
// riga): conta ; TAB e , che stanno FUORI dalle virgolette, e vince il più
// frequente con priorità al punto e virgola (l'export italiano di Excel e
// il nostro). Deciderlo per riga sarebbe un errore: una riga senza
// separatori sposterebbe tutte le colonne di quella riga.
function rilevaDelimTesto(t) {
  let q = false; const c = { ";": 0, "\t": 0, ",": 0 };
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === '"') { if (q && t[i + 1] === '"') i++; else q = !q; }
    else if (!q && (ch === ";" || ch === "\t" || ch === ",")) c[ch]++;
  }
  return c[";"] ? ";" : c["\t"] ? "\t" : ",";
}

// Legge un CSV intero in tabella (array di righe, ogni riga array di celle).
// Regge: separatore ; , o TAB · campi tra virgolette · virgolette doppie
// raddoppiate ("") · a capo DENTRO un campo quotato · BOM iniziale ·
// terminatori di riga Windows e Unix. Le righe completamente vuote spariscono.
// Ritorna { delim, righe }. Pura e testabile.
export function leggiCsv(testo) {
  const t = String(testo == null ? "" : testo).replace(/^\uFEFF/, "");
  if (!t.trim()) return { delim: ";", righe: [] };
  const delim = rilevaDelimTesto(t);
  const righe = [];
  let campo = "", riga = [], q = false;
  const chiudiRiga = () => {
    riga.push(campo); campo = "";
    if (riga.some(x => String(x).trim() !== "")) righe.push(riga.map(x => String(x).trim()));
    riga = [];
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { campo += '"'; i++; } else q = false; }
      else campo += c;
    } else if (c === '"') q = true;
    else if (c === delim) { riga.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && t[i + 1] === "\n") i++; chiudiRiga(); }
    else campo += c;
  }
  chiudiRiga();
  return { delim, righe };
}

// La prima riga è un'INTESTAZIONE? Lo è quando contiene almeno una cella
// non vuota e nessuna cella che sia un numero: "Data;Ora;PPV" sì,
// "12/07/2026;10:30;4,8" no. Serve solo come proposta: nella schermata
// l'utente può sempre correggere con una spunta.
export function paresIntestazione(righe) {
  const r = (righe || [])[0];
  if (!r || !r.length) return false;
  const piene = r.filter(c => String(c || "").trim() !== "");
  if (!piene.length) return false;
  return !piene.some(c => Number.isFinite(numIt(c)));
}

// Data in ISO (AAAA-MM-GG) da quasi tutti i formati che si trovano negli
// export: 2026-07-12 · 2026/07/12 · 12/07/2026 · 12-07-2026 · 12.07.2026 ·
// 12/07/26, anche seguiti dall'ora nella stessa cella. Regola dichiarata e
// scritta anche nella schermata: con due numeri di due cifre si legge
// GIORNO/MESE (formato italiano), mai mese/giorno. Ritorna "" se non è una
// data vera (il 31/02 viene scartato, non "corretto"). Pura e testabile.
export function dataIso(v) {
  const s = String(v == null ? "" : v).trim();
  if (!s) return "";
  const comp = (a, me, g) => {
    const A = +a, M = +me, G = +g;
    if (!(A >= 1900 && A <= 2999) || !(M >= 1 && M <= 12) || !(G >= 1 && G <= 31)) return "";
    const d = new Date(Date.UTC(A, M - 1, G));
    if (d.getUTCFullYear() !== A || d.getUTCMonth() !== M - 1 || d.getUTCDate() !== G) return "";
    return `${A}-${String(M).padStart(2, "0")}-${String(G).padStart(2, "0")}`;
  };
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
  if (m) return comp(m[1], m[2], m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/.exec(s);
  if (m) { let a = m[3]; if (a.length === 2) a = (+a > 70 ? "19" : "20") + a; return comp(a, m[2], m[1]); }
  return "";
}

// Ora HH:MM da una cella che può essere "10:30", "10:30:12" o una data
// completa "12/07/2026 10:30". Si accettano SOLO i due punti come
// separatore: con il punto "12.07" sarebbe la data, non le 12 e 7 minuti.
// Ritorna "" se non c'è un'ora leggibile (l'ora è facoltativa).
export function oraHm(v) {
  const m = /(\d{1,2}):(\d{2})/.exec(String(v == null ? "" : v));
  if (!m) return "";
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return "";
  return String(h).padStart(2, "0") + ":" + String(mi).padStart(2, "0");
}

// Nomi di colonna che gli strumenti usano più spesso: servono SOLO a
// proporre una mappatura di partenza quando il file ha l'intestazione.
// La scelta finale resta sempre dell'utente.
const INDIZI = {
  data:   ["data", "date", "giorno", "data/ora", "datetime", "data e ora", "timestamp", "date/time"],
  ora:    ["ora", "time", "orario", "hh:mm", "ora evento"],
  valore: ["valore", "value", "ppv", "pvs", "picco", "peak", "misura", "livello", "level",
           "laeq", "leq", "db", "dba", "pm10", "pm 10", "concentrazione", "mm/s", "vel", "risultato"],
};
// Propone quale colonna è data, ora e valore leggendo l'intestazione.
// Ritorna { colData, colOra, colValore } con -1 = "non trovata".
// Se l'intestazione non c'è (o non dice niente) ripiega sulla posizione:
// prima colonna = data, ultima colonna numerica = valore.
export function proponiMappa(righe, conIntestazione) {
  const out = { colData: -1, colOra: -1, colValore: -1 };
  const head = (righe || [])[0] || [];
  if (conIntestazione) {
    const norm = head.map(h => String(h || "").trim().toLowerCase());
    const trova = (chiavi, escludi) => norm.findIndex((h, i) =>
      !escludi.includes(i) && h && chiavi.some(k => h === k || h.includes(k)));
    out.colData = trova(INDIZI.data, []);
    out.colOra = trova(INDIZI.ora, [out.colData]);
    out.colValore = trova(INDIZI.valore, [out.colData, out.colOra]);
  }
  const dati = (righe || []).slice(conIntestazione ? 1 : 0);
  if (out.colData < 0) {
    out.colData = (dati[0] || []).findIndex(c => dataIso(c) !== "");
    if (out.colData < 0) out.colData = 0;
  }
  if (out.colValore < 0) {
    const r = dati[0] || [];
    for (let i = r.length - 1; i >= 0; i--)
      if (i !== out.colData && i !== out.colOra && Number.isFinite(numIt(r[i]))) { out.colValore = i; break; }
    if (out.colValore < 0) out.colValore = Math.min(r.length - 1, out.colData + 1);
  }
  return out;
}

// Applica la mappatura scelta dall'utente e restituisce UNA VOCE PER RIGA
// del file, buona o scartata che sia, con il motivo scritto in italiano.
// Nessuna riga sparisce in silenzio: l'anteprima le mostra tutte, perché
// un import muto è il modo migliore per perdere dati senza accorgersene.
export function preparaLetture(righe, mappa) {
  const m = mappa || {};
  const cD = +m.colData, cO = +m.colOra, cV = +m.colValore;
  const dati = (righe || []).slice(m.conIntestazione ? 1 : 0);
  const cella = (r, i) => (Number.isFinite(i) && i >= 0 ? String(r[i] == null ? "" : r[i]) : "");
  return dati.map((r, k) => {
    const dataRaw = cella(r, cD), oraRaw = cella(r, cO), valRaw = cella(r, cV);
    const data = dataIso(dataRaw);
    // se la colonna dell'ora non è stata scelta, l'ora si cerca nella cella
    // della data: molti strumenti scrivono "12/07/2026 10:30" in una casella sola
    const ora = oraHm(cO >= 0 ? oraRaw : dataRaw);
    const valore = numIt(valRaw);
    let motivo = "";
    if (!data) motivo = dataRaw ? "data non riconosciuta" : "data mancante";
    else if (!Number.isFinite(valore)) motivo = valRaw ? "valore non numerico" : "valore mancante";
    else if (valore < 0) motivo = "valore negativo";
    return { riga: k + 1 + (m.conIntestazione ? 1 : 0), dataRaw, oraRaw, valRaw, data, ora, valore, ok: !motivo, motivo };
  });
}

// Quante letture si tengono per punto di misura. L'import dallo strumento
// porta centinaia di righe: 50 (il vecchio limite dell'inserimento a mano)
// butterebbe via quasi tutto il file appena importato.
export const MAX_LETTURE = 500;

// Firma di una lettura per riconoscere i DOPPIONI: stessa data, stessa ora
// e stesso valore = stessa lettura. Reimportare lo stesso file (o il file
// della settimana che si sovrappone al precedente) non deve raddoppiare la
// serie storica: su un documento che va all'ente sarebbe un falso.
export function firmaLettura(l) {
  return chiaveOrdine(l) + "|" + (Math.round((+((l || {}).valore) || 0) * 1e6) / 1e6);
}

// Unisce le letture importate a quelle già presenti: scarta i doppioni
// (anche quelli DENTRO lo stesso file), riordina per data+ora e tiene le
// ultime MAX_LETTURE. Ritorna anche i conteggi da mostrare all'utente.
export function unisciLetture(esistenti, nuove, max = MAX_LETTURE) {
  const gia = new Set((esistenti || []).map(firmaLettura));
  const tenute = [];
  let duplicati = 0;
  for (const l of nuove || []) {
    const f = firmaLettura(l);
    if (gia.has(f)) { duplicati++; continue; }
    gia.add(f);
    tenute.push({ data: l.data, valore: +l.valore, ...(l.ora ? { ora: l.ora } : {}) });
  }
  const tutte = [...(esistenti || []), ...tenute]
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return {
    letture: tutte.slice(-max),
    aggiunte: tenute.length, duplicati,
    tagliate: Math.max(0, tutte.length - max),
  };
}

// ══════════════════════════════════════════════════════════════════════
// T2 · RICETTORI (casa, scuola, confine)
// Le norme non ragionano "in generale": ragionano sul punto sensibile che
// subisce l'effetto. Il ricettore porta distanza, tipo, classe acustica e
// — se l'utente la imposta — la SUA soglia, che è quella scritta
// nell'autorizzazione per quella casa. I valori di partenza dei preset
// normativi restano quelli che erano: qui si aggiunge solo la possibilità
// che l'azienda scriva la soglia del proprio ricettore.
// ══════════════════════════════════════════════════════════════════════

export const TIPI_RICETTORE = [
  { chiave: "abitazione", etichetta: "Abitazione" },
  { chiave: "scuola",     etichetta: "Scuola" },
  { chiave: "ospedale",   etichetta: "Ospedale / casa di cura" },
  { chiave: "confine",    etichetta: "Confine di proprietà" },
  { chiave: "storico",    etichetta: "Edificio storico / sensibile" },
  { chiave: "altro",      etichetta: "Altro" },
];
export const etichettaTipo = (t) =>
  (TIPI_RICETTORE.find(x => x.chiave === String(t || "").toLowerCase()) || {}).etichetta || "Ricettore";

// Classi acustiche comunali (DPCM 14/11/1997): servono a DESCRIVERE il
// ricettore e a ricordare all'utente quale zona gli ha assegnato il Comune.
// Nessun limite numerico viene dedotto da qui: il limite lo scrive
// l'autorizzazione, e in Sentinella lo imposta l'utente.
export const CLASSI_ACUSTICHE = [
  { chiave: "I",   etichetta: "I · aree particolarmente protette" },
  { chiave: "II",  etichetta: "II · prevalentemente residenziali" },
  { chiave: "III", etichetta: "III · di tipo misto" },
  { chiave: "IV",  etichetta: "IV · di intensa attività umana" },
  { chiave: "V",   etichetta: "V · prevalentemente industriali" },
  { chiave: "VI",  etichetta: "VI · esclusivamente industriali" },
];

export const trovaRicettore = (ricettori, id) =>
  (ricettori || []).find(r => r && r.id === id) || null;

// SOGLIA CHE VALE DAVVERO per un punto di misura.
// Regola, dichiarata anche nell'interfaccia: se il punto è collegato a un
// ricettore che ha una soglia propria E la stessa unità di misura, vince
// quella del ricettore (è il limite scritto per quella casa). In tutti gli
// altri casi vale la soglia del punto. Se le unità non coincidono NON si
// converte niente: si tiene la soglia del punto e si segnala, perché una
// conversione indovinata su un valore di sicurezza è un errore grave.
// Ritorna { valore, fonte: "ricettore"|"punto", ricettore, unita, conflitto }.
export function sogliaEfficace(m, ricettori) {
  const uM = String(unitaMisura(m) || "").trim().toLowerCase();
  const propria = +((m || {}).soglia);
  const base = Number.isFinite(propria) && propria > 0 ? propria : null;
  const r = trovaRicettore(ricettori, (m || {}).ricettoreId);
  const sr = r ? +r.soglia : NaN;
  const uR = r ? String(r.unita || "").trim().toLowerCase() : "";
  const nome = r ? r.nome : "";
  if (r && Number.isFinite(sr) && sr > 0) {
    if (!uR || !uM || uR === uM)
      return { valore: sr, fonte: "ricettore", ricettore: nome, unita: r.unita || unitaMisura(m), conflitto: false };
    return { valore: base, fonte: "punto", ricettore: nome, unita: unitaMisura(m), conflitto: true, unitaRicettore: r.unita };
  }
  return { valore: base, fonte: "punto", ricettore: nome, unita: unitaMisura(m), conflitto: false };
}

// ══════════════════════════════════════════════════════════════════════
// T3 · REPORT DI CONFORMITÀ
// È il documento che il cliente consegna all'ente: periodo, ricettore,
// letture, soglia applicata (e da dove viene), superamenti, esito.
// Funzione PURA: prende i dati e restituisce il contenuto del documento,
// senza toccare né la pagina né la stampa. `oggi` iniettabile.
// ══════════════════════════════════════════════════════════════════════
export function reportConformita(o = {}) {
  const dal = String(o.dal || "").slice(0, 10);
  const al = String(o.al || "").slice(0, 10);
  const ricettori = o.ricettori || [];
  const ricettoreId = o.ricettoreId || "";
  const ricettore = ricettoreId ? trovaRicettore(ricettori, ricettoreId) : null;
  const nelPeriodo = (d) => {
    const g = String(d || "").slice(0, 10);
    if (!g) return false;
    return (!dal || g >= dal) && (!al || g <= al);
  };

  const punti = (o.monitoraggi || [])
    .filter(m => !ricettoreId || m.ricettoreId === ricettoreId)
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      const letture = ((m.letture) || [])
        .map(l => ({ data: String((l || {}).data || "").slice(0, 10), ora: String((l || {}).ora || ""), valore: +((l || {}).valore) }))
        .filter(l => Number.isFinite(l.valore) && nelPeriodo(l.data))
        .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; })
        .map(l => ({ ...l, oltre: eff.valore != null && l.valore >= eff.valore }));
      const valori = letture.map(l => l.valore);
      const superamenti = letture.filter(l => l.oltre);
      return {
        m, nome: m.nome || "Punto di misura", unita: unitaMisura(m), soglia: eff,
        ricettore: trovaRicettore(ricettori, m.ricettoreId),
        letture, n: letture.length,
        max: valori.length ? Math.max(...valori) : null,
        min: valori.length ? Math.min(...valori) : null,
        media: valori.length ? valori.reduce((s, v) => s + v, 0) / valori.length : null,
        superamenti, nSuperamenti: superamenti.length,
        esito: !valori.length ? "senza-dati" : superamenti.length ? "non-conforme" : "conforme",
      };
    });

  const nLetture = punti.reduce((s, p) => s + p.n, 0);
  const nSuperamenti = punti.reduce((s, p) => s + p.nSuperamenti, 0);
  const conDati = punti.filter(p => p.n > 0);
  const esito = !conDati.length ? "senza-dati" : nSuperamenti ? "non-conforme" : "conforme";

  const reclami = (o.reclami || [])
    .filter(x => nelPeriodo(x.data))
    .filter(x => !ricettoreId || x.ricettoreId === ricettoreId)
    .sort((a, b) => chiaveOrdine(a) < chiaveOrdine(b) ? 1 : -1);

  // Le volate del periodo entrano come CONTESTO: spiegano i picchi. Se il
  // report è di un solo ricettore restano comunque, perché la volata è un
  // evento della cava, non del ricettore.
  const volate = (o.volate || []).filter(v => nelPeriodo(v.data))
    .sort((a, b) => String(a.data || "") < String(b.data || "") ? 1 : -1);

  return {
    dal, al, ricettore, ricettoreId,
    punti, nPunti: punti.length, nPuntiConDati: conDati.length,
    nLetture, nSuperamenti, esito,
    reclami, nReclami: reclami.length,
    volate, nVolate: volate.length,
    vuoto: punti.length === 0,
    generato: (o.oggi ? new Date(o.oggi) : new Date()),
  };
}

// Etichetta e gravità dell'esito, in parole che capisce anche chi non è
// un tecnico. Sono le stesse tre facce del semaforo del resto dell'app.
export const ESITI = {
  "conforme":    { cls: "ok",     label: "Conforme",     testo: "Nel periodo considerato nessuna lettura ha raggiunto la soglia applicata." },
  "non-conforme":{ cls: "danger", label: "Non conforme", testo: "Nel periodo considerato una o più letture hanno raggiunto o superato la soglia applicata." },
  "senza-dati":  { cls: "warn",   label: "Senza dati",   testo: "Nel periodo considerato non ci sono letture registrate: il report non può dire se il limite è stato rispettato." },
};

// ══════════════════════════════════════════════════════════════════════
// T4 · RECLAMI ED ESPOSTI
// ══════════════════════════════════════════════════════════════════════
export const TIPI_RECLAMO = [
  { chiave: "rumore",     etichetta: "Rumore" },
  { chiave: "polvere",    etichetta: "Polvere" },
  { chiave: "vibrazione", etichetta: "Vibrazione" },
  { chiave: "acque",      etichetta: "Acque" },
  { chiave: "altro",      etichetta: "Altro" },
];
export const etichettaReclamo = (t) =>
  (TIPI_RECLAMO.find(x => x.chiave === String(t || "").toLowerCase()) || {}).etichetta || "Altro";

// Riepilogo dei reclami per il quadro: quanti in tutto, quanti ancora
// aperti, e la data dell'ultimo. Pura e testabile.
export function riepilogoReclami(reclami) {
  const l = reclami || [];
  let ultimo = null;
  for (const x of l) {
    const d = String((x || {}).data || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!ultimo || d > ultimo)) ultimo = d;
  }
  return { totale: l.length, aperti: l.filter(x => (x || {}).stato !== "chiuso").length, ultimo };
}

// ══════════════════════════════════════════════════════════════════════
// T5 · PROGRAMMA DI MONITORAGGIO
// Le letture entrano, ma finora nessuno diceva se il PIANO è stato
// rispettato — ed è la prima cosa che un ente chiede: che cosa misuri,
// dove, ogni quanto, e se sei in pari. Una riga di programma dice
// «questo punto va misurato ogni N giorni»; lo stato NON si salva, si
// calcola dall'ultima lettura di quel punto, esattamente come lo stato
// delle scadenze. Così non esiste il caso di una riga «in regola»
// salvata mesi fa e mai più aggiornata.
// NIENTE periodicità di legge cablate: frequenze e tolleranze cambiano
// da autorizzazione a autorizzazione e le imposta l'utente.
// Collezione:
//   programma/{id}: { monitoraggioId, ogniGiorni, tolleranzaGiorni,
//                     dal (ISO, facoltativa), nota, attivo }
// COMPATIBILITÀ: la collezione può non esistere (nessuna riga) — tutte
// le funzioni ritornano liste e conteggi vuoti, niente si rompe.
// ══════════════════════════════════════════════════════════════════════

// Periodicità tipiche, come voci del menù: sono solo scorciatoie per
// scrivere il numero di giorni, non regole. «Mensile» qui vale 30 giorni
// (e lo scriviamo nell'interfaccia): un mese di calendario non ha una
// durata fissa, e far finta di sì renderebbe il conto meno prevedibile.
export const PERIODICITA = [
  { chiave: "giornaliera",  etichetta: "Ogni giorno",       giorni: 1 },
  { chiave: "settimanale",  etichetta: "Ogni settimana",    giorni: 7 },
  { chiave: "quindicinale", etichetta: "Ogni due settimane", giorni: 15 },
  { chiave: "mensile",      etichetta: "Ogni mese",         giorni: 30 },
  { chiave: "bimestrale",   etichetta: "Ogni due mesi",     giorni: 60 },
  { chiave: "trimestrale",  etichetta: "Ogni tre mesi",     giorni: 90 },
  { chiave: "semestrale",   etichetta: "Ogni sei mesi",     giorni: 182 },
  { chiave: "annuale",      etichetta: "Ogni anno",         giorni: 365 },
];
// Etichetta parlante della frequenza: se i giorni coincidono con una
// periodicità tipica si usa il suo nome, altrimenti «ogni N giorni».
export function etichettaFrequenza(ogniGiorni) {
  const n = Math.round(+ogniGiorni || 0);
  if (!(n > 0)) return "frequenza non impostata";
  const p = PERIODICITA.find(x => x.giorni === n);
  return p ? p.etichetta.toLowerCase() : "ogni " + n + " giorni";
}

// Data ISO spostata di n giorni (calcolo in UTC per non inciampare
// nell'ora legale). Ritorna "" se la data non è valida.
export function piuGiorni(dataISO, n) {
  const s = String(dataISO || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return "";
  const d = new Date(s + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + Math.round(+n || 0));
  return d.toISOString().slice(0, 10);
}

// L'ultima lettura registrata su un punto di misura (per data e ora),
// oppure null. Pura.
export function ultimaLettura(m) {
  const l = (((m || {}).letture) || [])
    .map(x => ({ data: String((x || {}).data || "").slice(0, 10), ora: String((x || {}).ora || ""), valore: +((x || {}).valore) }))
    .filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.data) && Number.isFinite(x.valore))
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return l.length ? l[l.length - 1] : null;
}

// Stato di UNA riga di programma. Si calcola dall'ultima lettura del punto
// collegato: prossima = ultima + ogni quanti giorni; poi
//   · oltre la tolleranza  → in ritardo (rosso)
//   · scaduta ma dentro la tolleranza → da fare (giallo)
//   · non ancora scaduta   → in regola (verde)
// Senza nessuna lettura si guarda la data di inizio, se c'è; senza
// nemmeno quella lo stato è «mai misurato», che è un avviso e non un
// allarme: magari il punto è stato appena creato.
export function statoRigaProgramma(riga, monitoraggio, oggi = new Date()) {
  const r = riga || {};
  const ogni = Math.round(+r.ogniGiorni || 0);
  const toll = Math.max(0, Math.round(+r.tolleranzaGiorni || 0));
  const ul = ultimaLettura(monitoraggio);
  const dal = /^\d{4}-\d{2}-\d{2}$/.test(String(r.dal || "")) ? String(r.dal) : null;
  const base = { ogniGiorni: ogni, tolleranzaGiorni: toll, ultima: ul ? ul.data : null,
    ultimoValore: ul ? ul.valore : null, maiMisurato: !ul, dal, prossima: null, giorni: null, ritardo: 0 };
  if (r.attivo === false) return { ...base, stato: "sospesa", cls: "", label: "Sospesa" };
  if (!(ogni > 0)) return { ...base, stato: "senza-frequenza", cls: "warn", label: "Senza frequenza" };
  const partenza = ul ? ul.data : dal;
  if (!partenza) return { ...base, stato: "mai", cls: "warn", label: "Mai misurato" };
  const prossima = piuGiorni(partenza, ogni);
  const g = giorniTra(prossima, oggi);              // > 0 = ancora nel futuro
  const ritardo = g < 0 ? -g : 0;
  const stato = g < -toll ? "in-ritardo" : g <= 0 ? "da-fare" : "in-regola";
  const cls = stato === "in-ritardo" ? "danger" : stato === "da-fare" ? "warn" : "ok";
  const label = stato === "in-ritardo" ? "In ritardo di " + ritardo + (ritardo === 1 ? " giorno" : " giorni")
    : stato === "da-fare" ? (ritardo ? "Da fare da " + ritardo + (ritardo === 1 ? " giorno" : " giorni") : "Da fare oggi")
    : "Fra " + g + (g === 1 ? " giorno" : " giorni");
  return { ...base, prossima, giorni: g, ritardo, stato, cls, label };
}

// Il programma con dentro il punto di misura e il suo stato, ordinato
// per urgenza: prima i ritardi (dal più lungo), poi i mai misurati, poi
// quello che sta per scadere, in fondo ciò che è in regola e le righe
// sospese. Le righe che puntano a un punto sparito restano visibili con
// `monitoraggio: null`: sparire in silenzio sarebbe peggio.
export function programmaEsteso(programma, monitoraggi, oggi = new Date()) {
  const rank = { "in-ritardo": 0, "senza-frequenza": 1, mai: 2, "da-fare": 3, "in-regola": 4, sospesa: 5 };
  return (programma || []).map(r => {
    const m = (monitoraggi || []).find(x => x && x.id === r.monitoraggioId) || null;
    return { riga: r, monitoraggio: m, nome: m ? (m.nome || "Punto di misura") : "Punto non più in elenco",
      stato: statoRigaProgramma(r, m, oggi) };
  }).sort((a, z) =>
    (rank[a.stato.stato] - rank[z.stato.stato]) ||
    (z.stato.ritardo - a.stato.ritardo) ||
    String(a.nome).localeCompare(String(z.nome), "it"));
}

// Conteggi per le tessere: quante righe in regola, da fare, in ritardo,
// mai misurate, sospese.
export function riepilogoProgramma(programma, monitoraggi, oggi = new Date()) {
  const out = { totale: 0, inRegola: 0, daFare: 0, inRitardo: 0, mai: 0, sospese: 0, senzaFrequenza: 0 };
  for (const v of programmaEsteso(programma, monitoraggi, oggi)) {
    out.totale++;
    const s = v.stato.stato;
    if (s === "in-ritardo") out.inRitardo++;
    else if (s === "da-fare") out.daFare++;
    else if (s === "mai") out.mai++;
    else if (s === "sospesa") out.sospese++;
    else if (s === "senza-frequenza") out.senzaFrequenza++;
    else out.inRegola++;
  }
  return out;
}

// Le righe che chiedono attenzione, nella stessa forma delle allerte del
// quadro ({ gravita, categoria, titolo, dettaglio, badge }) così si
// mescolano con misure e adempimenti senza casi particolari.
export function allerteProgramma(programma, monitoraggi, oggi = new Date()) {
  return programmaEsteso(programma, monitoraggi, oggi)
    .filter(v => ["in-ritardo", "da-fare", "mai", "senza-frequenza"].includes(v.stato.stato))
    .map(v => ({
      gravita: v.stato.cls === "danger" ? "danger" : "warn",
      categoria: "programma",
      titolo: v.nome,
      dettaglio: "misura in programma · "
        + (v.stato.ogniGiorni > 0 ? etichettaFrequenza(v.stato.ogniGiorni) : "frequenza non impostata")
        + (v.stato.ultima ? " · ultima misura " + dataIt(v.stato.ultima) : " · nessuna misura registrata"),
      badge: v.stato.label,
    }));
}

// ══════════════════════════════════════════════════════════════════════
// T6 · ANDAMENTO PER RICETTORE, CON CONFRONTO FRA PERIODI
// La domanda è «come sta andando dove abita la gente, rispetto al mese
// scorso». Le funzioni qui sotto preparano i numeri; il disegno lo fa il
// motore condiviso dei grafici. Regola di onestà: se le letture non
// bastano NON si inventa una linea — si dice quante ce ne sono.
// ══════════════════════════════════════════════════════════════════════

// Primo e ultimo giorno di un mese (anno, mese 1-12), in ISO.
export function limitiMese(anno, mese) {
  const a = Math.round(+anno), m = Math.round(+mese);
  const p = (n) => String(n).padStart(2, "0");
  const ultimo = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return { dal: `${a}-${p(m)}-01`, al: `${a}-${p(m)}-${p(ultimo)}`, anno: a, mese: m };
}

// Letture di un punto dentro un intervallo (estremi compresi), ordinate.
export function lettureNelPeriodo(m, dal, al) {
  const d = String(dal || "").slice(0, 10), a = String(al || "").slice(0, 10);
  return (((m || {}).letture) || [])
    .map(l => ({ data: String((l || {}).data || "").slice(0, 10), ora: String((l || {}).ora || ""), valore: +((l || {}).valore) }))
    .filter(l => /^\d{4}-\d{2}-\d{2}$/.test(l.data) && Number.isFinite(l.valore))
    .filter(l => (!d || l.data >= d) && (!a || l.data <= a))
    .sort((x, z) => { const kx = chiaveOrdine(x), kz = chiaveOrdine(z); return kx < kz ? -1 : kx > kz ? 1 : 0; });
}

// Statistiche di un punto in un periodo: quante letture, media, massimo,
// minimo e quanti superamenti della soglia applicata (>= soglia, come in
// tutto il resto dell'app). Senza letture torna n = 0 e valori null.
export function statPeriodo(m, dal, al, soglia) {
  const l = lettureNelPeriodo(m, dal, al);
  const v = l.map(x => x.valore);
  const s = Number.isFinite(+soglia) && +soglia > 0 ? +soglia : null;
  return {
    dal, al, n: l.length, letture: l,
    media: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null,
    max: v.length ? Math.max(...v) : null,
    min: v.length ? Math.min(...v) : null,
    superamenti: s == null ? 0 : v.filter(x => x >= s).length,
  };
}

// Confronto fra il mese in corso e quello prima, per un punto di misura.
// `confrontabile` è vero solo se in ENTRAMBI i mesi c'è almeno una
// lettura; `debole` avvisa quando una media poggia su una lettura sola.
export function confrontoMesi(m, soglia, oggi = new Date()) {
  const o = new Date(oggi);
  const cur = limitiMese(o.getFullYear(), o.getMonth() + 1);
  const p = new Date(o.getFullYear(), o.getMonth() - 1, 1);
  const pre = limitiMese(p.getFullYear(), p.getMonth() + 1);
  const corrente = { ...statPeriodo(m, cur.dal, cur.al, soglia), anno: cur.anno, mese: cur.mese };
  const precedente = { ...statPeriodo(m, pre.dal, pre.al, soglia), anno: pre.anno, mese: pre.mese };
  const confrontabile = corrente.n > 0 && precedente.n > 0;
  const deltaMedia = confrontabile ? corrente.media - precedente.media : null;
  const deltaPct = confrontabile && precedente.media > 0
    ? Math.round(1000 * deltaMedia / precedente.media) / 10 : null;
  return {
    corrente, precedente, confrontabile,
    debole: confrontabile && (corrente.n < 2 || precedente.n < 2),
    deltaMedia, deltaPct,
    deltaSuperamenti: corrente.superamenti - precedente.superamenti,
  };
}

// Tutto quello che serve alla schermata «andamento per ricettore»: per
// ogni punto di misura collegato a quel ricettore, la soglia applicata,
// le letture della finestra scelta (di serie 6 mesi, mese in corso
// compreso), il confronto coi due mesi e il numero minimo di letture per
// disegnare una linea onesta (`abbastanza`, di serie 3).
export function andamentoRicettore(monitoraggi, ricettori, ricettoreId, opts = {}) {
  const oggi = opts.oggi ? new Date(opts.oggi) : new Date();
  const mesi = Math.max(1, Math.round(+opts.mesi || 6));
  const minLetture = Math.max(2, Math.round(+opts.minLetture || 3));
  const inizio = limitiMese(new Date(oggi.getFullYear(), oggi.getMonth() - (mesi - 1), 1).getFullYear(),
    new Date(oggi.getFullYear(), oggi.getMonth() - (mesi - 1), 1).getMonth() + 1);
  const fine = limitiMese(oggi.getFullYear(), oggi.getMonth() + 1);
  const punti = (monitoraggi || [])
    .filter(m => m && m.ricettoreId === ricettoreId)
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      const letture = lettureNelPeriodo(m, inizio.dal, fine.al);
      return {
        m, nome: m.nome || "Punto di misura", unita: unitaMisura(m), soglia: eff,
        letture, n: letture.length, abbastanza: letture.length >= minLetture,
        confronto: confrontoMesi(m, eff.valore, oggi),
      };
    });
  return { ricettore: trovaRicettore(ricettori, ricettoreId), punti, mesi, minLetture,
    dal: inizio.dal, al: fine.al };
}

// ══════════════════════════════════════════════════════════════════════
// T7 · IL PONTE VERSO SCUDO — dall'evento ambientale all'azione correttiva
//
// Un superamento di soglia o un reclamo di un residente non finisce quando
// è stato registrato: quasi sempre richiede che QUALCUNO faccia QUALCOSA
// ENTRO una data. Quel meccanismo esiste già, e sta in Scudo: le azioni
// correttive (aperta → in corso → chiusa) collegate alla loro origine con
// `origineTipo` / `origineId` / `origineVoce`. Qui NON se ne costruisce un
// secondo: Sentinella scrive nella stessa collezione `azioni` di Scudo,
// usando due nuovi valori di `origineTipo` — "superamento" e "reclamo" —
// e marcando `origineApp: "sentinella"`.
//
// Perché l'azione porta con sé anche il TESTO dell'origine (`origineNota`,
// `origineData`, `origineEtichetta`): Scudo non può leggere le collezioni
// di Sentinella (l'isolamento dello SDK è per organizzazione E per app), e
// un'azione che dicesse solo «origine: superamento xyz» sarebbe illeggibile
// per l'RSPP. Quindi l'azione si porta dietro la fotografia del fatto che
// l'ha generata, scritta in italiano.
//
// NIENTE DOPPIONI: l'identità di un superamento è il punto di misura PIÙ il
// giorno della lettura che l'ha causato (`origineVoce`). Se il giorno dopo
// il punto supera di nuovo, quello è un fatto nuovo e merita un'azione
// nuova; se si torna sullo stesso superamento, l'azione è già lì.
// ══════════════════════════════════════════════════════════════════════

export const PONTE_APP = "sentinella";
export const ORIGINE_SUPERAMENTO = "superamento";
export const ORIGINE_RECLAMO = "reclamo";

// Data di oggi + N giorni, in ISO. Serve solo a PROPORRE una scadenza
// all'azione correttiva: la decide comunque chi la apre.
export function dataPiuGiorni(giorniAvanti, oggi = new Date()) {
  const n = Number(giorniAvanti);
  if (!Number.isFinite(n)) return "";
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + Math.round(n));
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// L'ultima lettura che ha raggiunto o superato una soglia (>= soglia, la
// stessa regola del semaforo in tutto il resto dell'app). Senza soglia
// valida, o senza letture oltre, torna null.
export function ultimaLetturaOltre(m, soglia) {
  const s = +soglia;
  if (!Number.isFinite(s) || s <= 0) return null;
  const l = (((m || {}).letture) || [])
    .map(x => ({ data: String((x || {}).data || "").slice(0, 10), ora: String((x || {}).ora || ""), valore: +((x || {}).valore) }))
    .filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.data) && Number.isFinite(x.valore) && x.valore >= s)
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return l.length ? l[l.length - 1] : null;
}

// I SUPERAMENTI APERTI: i punti che ADESSO sono oltre la soglia applicata
// (esattamente i punti "danger" del semaforo e del KPI del Quadro). Per
// ognuno si dice anche QUANDO: la lettura che l'ha causato. Se il punto non
// ha letture (valore digitato a mano sulla scheda) la voce esiste comunque,
// con `data: ""` e chiave "valore-corrente": è un superamento vero, solo
// senza una data da citare.
// Ritorna una lista ordinata dal più grave (rapporto valore/soglia).
export function superamentiAperti(monitoraggi, ricettori) {
  return (monitoraggi || [])
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      if (eff.valore == null) return null;                 // senza soglia non esiste superamento
      const st = statoMisura({ ...m, soglia: eff.valore });
      if (st.cls !== "danger") return null;
      const l = ultimaLetturaOltre(m, eff.valore);
      const data = l ? l.data : "";
      return {
        m, id: m.id, nome: m.nome || "Punto di misura",
        unita: eff.unita || unitaMisura(m),
        valore: +m.valore, soglia: eff, st,
        lettura: l, data,
        voce: data || "valore-corrente",
        ricettore: trovaRicettore(ricettori, m.ricettoreId),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.st.ratio - a.st.ratio);
}

// Le azioni nate da una certa origine. `voce` facoltativa: senza, tornano
// tutte le azioni di quell'origine (utile per il reclamo, che è un fatto
// solo); con, solo quelle di quel preciso superamento.
export function azioniDiOrigine(azioni, tipo, id, voce) {
  if (!id) return [];
  return (azioni || []).filter(a => a && a.origineTipo === tipo && a.origineId === id
    && (voce == null || voce === "" || a.origineVoce === voce));
}

// Il semaforo di un gruppo di azioni, per il badge che si vede accanto al
// superamento o al reclamo: nessuna / da chiudere / tutte chiuse. È la
// risposta alla domanda dell'ente «e voi cosa avete fatto?».
export function statoPonte(azioni) {
  const l = azioni || [];
  const chiuse = l.filter(a => (a || {}).stato === "chiusa").length;
  const inCorso = l.filter(a => (a || {}).stato === "in-corso").length;
  if (!l.length) return { n: 0, chiuse: 0, inCorso: 0, daChiudere: 0, cls: "danger", label: "Nessuna azione" };
  if (chiuse === l.length) return { n: l.length, chiuse, inCorso: 0, daChiudere: 0, cls: "ok",
    label: l.length === 1 ? "Azione chiusa" : l.length + " azioni chiuse" };
  const daChiudere = l.length - chiuse;
  return { n: l.length, chiuse, inCorso, daChiudere, cls: "warn",
    label: inCorso && daChiudere === inCorso
      ? (inCorso === 1 ? "Azione in corso" : inCorso + " azioni in corso")
      : daChiudere + (daChiudere === 1 ? " azione da chiudere" : " azioni da chiudere") };
}

// Testo della soglia applicata, con l'unità: si ripete in più punti e deve
// dire sempre la stessa cosa.
function testoSoglia(sup) {
  const u = sup.unita ? " " + sup.unita : "";
  return numeroIt(sup.soglia.valore) + u
    + (sup.soglia.fonte === "ricettore" && sup.soglia.ricettore ? " (soglia del ricettore " + sup.soglia.ricettore + ")" : "");
}

// LA BOZZA DELL'AZIONE nata da un superamento. Funzione PURA: prepara il
// record che verrà scritto nella collezione `azioni` di Scudo. Chi la apre
// può cambiare testo, responsabile e data prima di confermare.
export function bozzaAzioneSuperamento(sup, opts = {}) {
  if (!sup || !sup.id) return null;
  const u = sup.unita ? " " + sup.unita : "";
  const quando = sup.data ? " del " + dataIt(sup.data) : "";
  const nota = "Superamento ambientale (Sentinella) — " + sup.nome + quando + ": misurato "
    + numeroIt(sup.valore) + u + " con soglia applicata " + testoSoglia(sup)
    + (sup.ricettore ? " · ricettore: " + sup.ricettore.nome : "");
  return {
    descrizione: String(opts.descrizione || ("Riportare «" + sup.nome + "» entro la soglia ambientale")).trim(),
    responsabileId: opts.responsabileId || null,
    scadenza: String(opts.scadenza || "").slice(0, 10),
    stato: "aperta", esito: "", dataChiusura: null,
    origineTipo: ORIGINE_SUPERAMENTO, origineApp: PONTE_APP,
    origineId: sup.id, origineVoce: sup.voce,
    origineData: sup.data || "",
    origineEtichetta: sup.nome,
    origineNota: nota,
  };
}

// LA BOZZA DELL'AZIONE nata da un reclamo. Stesso schema: un reclamo è un
// fatto unico, quindi `origineVoce` resta la sua data (o "reclamo" se non
// c'è) e il doppione si controlla sull'id.
export function bozzaAzioneReclamo(rec, ricettore, opts = {}) {
  if (!rec || !rec.id) return null;
  const tipo = etichettaReclamo(rec.tipo).toLowerCase();
  const nota = "Reclamo di un residente (Sentinella) — " + etichettaReclamo(rec.tipo)
    + (rec.data ? " del " + dataIt(rec.data) : "") + (rec.ora ? " alle " + rec.ora : "")
    + (ricettore ? " · ricettore: " + ricettore.nome : "")
    + (rec.chi ? " · segnalato da " + rec.chi : "")
    + (rec.descrizione ? " · «" + rec.descrizione + "»" : "");
  return {
    descrizione: String(opts.descrizione || ("Dare seguito al reclamo per " + tipo
      + (ricettore ? " a " + ricettore.nome : "") + (rec.data ? " del " + dataIt(rec.data) : ""))).trim(),
    responsabileId: opts.responsabileId || null,
    scadenza: String(opts.scadenza || "").slice(0, 10),
    stato: "aperta", esito: "", dataChiusura: null,
    origineTipo: ORIGINE_RECLAMO, origineApp: PONTE_APP,
    origineId: rec.id, origineVoce: String(rec.data || "reclamo").slice(0, 10),
    origineData: String(rec.data || "").slice(0, 10),
    origineEtichetta: etichettaReclamo(rec.tipo) + (ricettore ? " · " + ricettore.nome : ""),
    origineNota: nota,
  };
}

// ── COINCIDENZA CON LA VOLATA ────────────────────────────────────────
// Un superamento nello stesso giorno di una volata va GUARDATO. Non va
// spiegato: due fatti nello stesso giorno sono due fatti nello stesso
// giorno, e basta. Il testo qui sotto è volutamente prudente e viene
// mostrato tale e quale, perché scrivere «causato dalla volata» dentro un
// documento che finisce all'ente è un autogol — e spesso è anche falso.
export const AVVISO_COINCIDENZA =
  "Coincidenza di data, non una causa dimostrata: per collegare i due fatti "
  + "servono la misura strumentale dell'evento, l'ora e una valutazione tecnica.";

export function volateDelGiorno(volate, dataISO) {
  const d = String(dataISO || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return [];
  return (volate || []).filter(v => String((v || {}).data || "").slice(0, 10) === d);
}

// Riga di contesto pronta da mostrare accanto a un superamento (o a un
// reclamo) quando quel giorno c'è stata una volata. Torna null se non ce
// n'è nessuna: nessuna riga inventata.
export function coincidenzaVolata(volate, dataISO) {
  const v = volateDelGiorno(volate, dataISO);
  if (!v.length) return null;
  const fronti = [...new Set(v.map(x => String((x || {}).fronte || "").trim()).filter(Boolean))];
  return {
    n: v.length, volate: v, fronti,
    testo: (v.length === 1 ? "Quel giorno è stata registrata una volata" : "Quel giorno sono state registrate " + v.length + " volate")
      + (fronti.length ? " (" + fronti.join(", ") + ")" : "") + ".",
    avviso: AVVISO_COINCIDENZA,
  };
}

// ── IL TRASPORTO ─────────────────────────────────────────────────────
// Da autenticati: SDK Deepwork ID inizializzato sull'app di destinazione
// ("scudo"), stessa organizzazione, e SEMPRE orgCollection — mai un
// percorso Firestore scritto a mano.
// In demo/tour non esiste nessun backend: come il resto dell'app si lavora
// su dati finti, ma qui i due schermi sono due pagine diverse, quindi il
// "finto backend" è una riga di localStorage condivisa fra le due app dello
// stesso browser. Serve solo a far vedere la catena completa; non è un
// canale dati e non esiste in live. La copia gemella di queste tre funzioni
// sta in apps/scudo/scudo-data.js (stessa chiave), che le legge.
export const PONTE_DEMO_KEY = "deepwork.demo.azioni-ponte";

export function ponteDemoLeggi() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(PONTE_DEMO_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}
export function ponteDemoScrivi(lista) {
  try {
    globalThis.localStorage.setItem(PONTE_DEMO_KEY, JSON.stringify((lista || []).slice(-200)));
    return true;
  } catch (e) { return false; }   // navigazione privata, quota piena: si prosegue senza
}

export async function ponteScudo() {
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "scudo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      return {
        mode: "live",
        azioni: () => read("azioni"),
        lavoratori: () => read("lavoratori").catch(() => []),
        aggiungi: (rec) => addDoc(id.orgCollection("azioni"), rec),
      };
    }
  } catch (e) { /* SDK assente o non autenticati: si prosegue in demo */ }
  return {
    mode: "demo",
    azioni: async () => ponteDemoLeggi(),
    lavoratori: async () => [],
    aggiungi: async (rec) => {
      const nuova = { id: "pn" + Math.random().toString(36).slice(2, 8), ...rec };
      ponteDemoScrivi([...ponteDemoLeggi(), nuova]);
      return nuova;
    },
  };
}

// ══════════════════════════════════════════════════════════════════════
// T8 · IL PONTE VERSO GENESI — dalla volata misurata alla LEGGE DI SITO
//
// Genesi prevede le vibrazioni con la legge di Devine  PPV = K · SD^−β,
// dove SD = distanza / √(carica per ritardo). K e β però non sono
// universali: sono di QUELLA cava. Finché nessuno li misura, Genesi li
// stima dalla litologia — valori da manuale, cautelativi, ma non "la tua
// roccia". Per ricavarli davvero servono dei REFERTI, e un referto è fatto
// di tre numeri: distanza del punto di misura, carica massima per ritardo,
// PPV registrata.
//
// Quei tre numeri Sentinella li ha già quasi tutti: il registro volate
// porta la distanza del ricettore e i kg massimi per ritardo, il sismografo
// porta la PPV. Manca solo il collegamento fra la volata e la misura di
// quel giorno — ed è tutto quello che si fa qui. Nessuna formula nuova:
// la regressione la fa Genesi, che ce l'ha già.
//
// ⛔ LA PPV NON SI INVENTA. Se per una volata non c'è una misura, quella
// volata NON diventa un referto: resta in elenco col motivo scritto. Un
// referto inventato falserebbe K e β, e da K e β dipendono le distanze di
// sicurezza: è il posto dove un numero finto fa più danno di tutti.
//
// Stile: come il ponte verso Scudo, il referto si porta dietro la
// FOTOGRAFIA di dove viene la misura (`ppvFonte`, `ppvPuntoNome`,
// `ppvData`), perché Genesi non può leggere le collezioni di Sentinella e
// un numero di cui non si sa la provenienza non è un dato.
// ══════════════════════════════════════════════════════════════════════

export const PPV_STRUMENTO = "strumento";   // letta dal sismografo fra i punti di misura
export const PPV_MANUALE = "manuale";       // trascritta dal referto di uno strumento non censito

// Quanti referti servono. Sono le stesse due soglie che usa Genesi nella
// modale «Legge di sito»: sotto 3 la retta non esiste (da due punti passa
// qualunque retta), sotto 8 la pendenza si muove ancora a ogni misura
// nuova. Ripetute qui per poterlo DIRE all'utente prima che esporti.
export const MIN_REFERTI = 3;
export const REFERTI_SOLIDI = 8;

// Perché una volata non è ancora un referto. Ogni motivo dice anche COME si
// rimedia: un elenco di mancanze senza il rimedio lascia l'utente fermo.
export const MOTIVI_REFERTO = [
  { chiave: "ppv", breve: "la PPV misurata", etichetta: "Manca la PPV misurata",
    come: "Collega la lettura del sismografo di quel giorno, oppure trascrivi il valore dal referto dello strumento." },
  { chiave: "distanza", breve: "la distanza del ricettore", etichetta: "Manca la distanza del ricettore",
    come: "Sono i metri fra la volata e il punto dove era piazzato il sismografo: si scrivono sulla riga del registro." },
  { chiave: "carica", breve: "la carica massima per ritardo", etichetta: "Manca la carica massima per ritardo",
    come: "Sono i kg che detonano nella stessa finestra di ritardo — quella che fa vibrare, non il totale della volata." },
];
export function motivoReferto(chiave) {
  return MOTIVI_REFERTO.find(m => m.chiave === chiave)
    || { chiave: String(chiave || ""), breve: "un dato", etichetta: "Dato mancante", come: "" };
}

// La PPV collegata a una volata, o null. Non deduce NIENTE: legge soltanto
// quello che è stato scritto sulla volata. Una volata vecchia, registrata
// prima che questi campi esistessero, torna null — non un valore finto.
export function ppvDiVolata(v) {
  const val = +((v || {}).ppvMisurata);
  if (!Number.isFinite(val) || val <= 0) return null;
  const strumento = String((v || {}).ppvFonte || "") === PPV_STRUMENTO;
  return {
    valore: val,
    fonte: strumento ? PPV_STRUMENTO : PPV_MANUALE,
    puntoId: String((v || {}).ppvPuntoId || ""),
    punto: String((v || {}).ppvPuntoNome || "").trim(),
    data: String((v || {}).ppvData || "").slice(0, 10),
    ora: String((v || {}).ppvOra || "").trim(),
  };
}

// Come si dice a parole da dove viene una PPV. Usata sia nell'elenco sia
// nel CSV: deve dire sempre la stessa cosa.
export function testoFontePpv(ppv) {
  if (!ppv) return "";
  if (ppv.fonte === PPV_STRUMENTO)
    return "sismografo" + (ppv.punto ? " · " + ppv.punto : "") + (ppv.ora ? " · " + ppv.ora : "");
  return "trascritta a mano dal referto";
}

// Le letture di VIBRAZIONE registrate nel giorno di una volata: sono le
// candidate a diventare la PPV di quella volata. Ordinate dalla più alta,
// che è quella che conta per la conformità e per la legge di sito.
// `unitaOk` dice se il punto misura in mm/s: se misura in un'altra unità il
// numero NON è una PPV in mm/s e non va usato come tale — l'interfaccia lo
// mostra ma non lo fa scegliere.
export function lettureVibrazioniDelGiorno(monitoraggi, dataISO) {
  const d = String(dataISO || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return [];
  const out = [];
  for (const m of monitoraggi || []) {
    if (String((m || {}).tipo || "").trim().toLowerCase() !== "vibrazioni") continue;
    const unita = unitaMisura(m) || "";
    const unitaOk = /^mm\s*\/\s*s$/i.test(unita.trim());
    for (const l of (m.letture || [])) {
      const val = +((l || {}).valore);
      if (String((l || {}).data || "").slice(0, 10) !== d) continue;
      if (!Number.isFinite(val) || val <= 0) continue;
      out.push({ puntoId: m.id, punto: String(m.nome || "Punto di misura"),
        unita, unitaOk, data: d, ora: String((l || {}).ora || "").trim(), valore: val });
    }
  }
  return out.sort((a, b) => b.valore - a.valore);
}

// I campi da scrivere sulla volata per collegarle una PPV. Funzione pura:
// prepara il record, non lo salva. `null` se il valore non è una misura.
export function campiPpvVolata(valore, opts = {}) {
  const v = +valore;
  if (!Number.isFinite(v) || v <= 0) return null;
  const strumento = opts.fonte === PPV_STRUMENTO;
  return {
    ppvMisurata: Math.round(v * 1e4) / 1e4,
    ppvFonte: strumento ? PPV_STRUMENTO : PPV_MANUALE,
    ppvPuntoId: strumento ? String(opts.puntoId || "") : "",
    ppvPuntoNome: strumento ? String(opts.punto || "").trim() : "",
    ppvData: String(opts.data || "").slice(0, 10),
    ppvOra: strumento ? String(opts.ora || "").trim() : "",
  };
}
// I campi che TOLGONO la PPV da una volata (correzione di un errore): si
// azzerano tutti insieme, mai il valore senza la sua provenienza.
export const CAMPI_PPV_VUOTI = { ppvMisurata: 0, ppvFonte: "", ppvPuntoId: "", ppvPuntoNome: "", ppvData: "", ppvOra: "" };

// UNA volata letta come referto: i tre numeri che servono a Genesi, più
// l'elenco di quelli che mancano. `pronto` è vero solo se ci sono tutti e
// tre — e la PPV deve essere una misura, non una stima.
export function refertoDaVolata(volata) {
  const v = volata || {};
  const d = +v.distanzaRicettore, w = +v.kgMaxRitardo;
  const ppv = ppvDiVolata(v);
  const motivi = [];
  if (!ppv) motivi.push("ppv");
  if (!(d > 0)) motivi.push("distanza");
  if (!(w > 0)) motivi.push("carica");
  return {
    id: String(v.id || ""), data: String(v.data || "").slice(0, 10),
    fronte: String(v.fronte || "").trim(),
    d: d > 0 ? d : null, w: w > 0 ? w : null,
    ppv: ppv ? ppv.valore : null, misura: ppv,
    sd: scaledDistance(d, w),
    pronto: motivi.length === 0, motivi,
  };
}

// Il riferimento scritto accanto al referto in Genesi: serve a poter
// risalire dalla riga della regressione alla volata che l'ha prodotta.
export function riferimentoReferto(r) {
  const parti = ["Volata " + dataIt(r && r.data)];
  if (r && r.fronte) parti.push(r.fronte);
  if (r && r.misura) parti.push(r.misura.fonte === PPV_STRUMENTO
    ? (r.misura.punto || "sismografo") : "PPV a mano");
  return parti.join(" · ");
}

// TUTTO il registro letto come referti: quante volate sono già utilizzabili
// e quante no, con il motivo. È la vista che serve a capire cosa manca per
// avere la legge del proprio sito, invece di restare davanti a un numero
// che non arriva. Pura e testabile.
export function refertiDaVolate(volate) {
  const tutti = (volate || []).map(refertoDaVolata)
    // prima ciò su cui c'è da lavorare, poi dal fatto più recente
    .sort((a, b) => (a.pronto ? 1 : 0) - (b.pronto ? 1 : 0)
      || String(b.data || "").localeCompare(String(a.data || "")));
  const pronti = tutti.filter(r => r.pronto);
  const mancanti = tutti.filter(r => !r.pronto);
  const motivi = { ppv: 0, distanza: 0, carica: 0 };
  for (const r of mancanti) for (const m of r.motivi) if (motivi[m] != null) motivi[m]++;
  const sd = pronti.map(r => r.sd).filter(x => Number.isFinite(x));
  const sdMin = sd.length ? Math.min.apply(null, sd) : null;
  const sdMax = sd.length ? Math.max.apply(null, sd) : null;
  // Senza escursione di distanza scalata la pendenza β non è ricavabile:
  // è lo stesso limite che Genesi segnala come "stessaSD". Meglio dirlo
  // qui, prima che l'utente esporti e si trovi la legge rifiutata.
  const escursione = (sdMin && sdMax && sdMin > 0) ? sdMax / sdMin : null;
  return {
    tutti, pronti, mancanti,
    totale: tutti.length, nPronti: pronti.length, nMancanti: mancanti.length,
    motivi, minimo: MIN_REFERTI, solidi: REFERTI_SOLIDI,
    abbastanza: pronti.length >= MIN_REFERTI,
    mancanoAlMinimo: Math.max(0, MIN_REFERTI - pronti.length),
    sdMin, sdMax, escursione,
    sdTutteUguali: escursione != null && escursione < 1.02,
    conPpv: tutti.filter(r => r.misura).length,
  };
}

// Numero per il CSV: punto decimale (è un file per un'altra macchina, non
// per un foglio italiano) e nessuno zero inutile in coda.
function numeroCsvReferto(n) {
  const v = +n;
  if (!Number.isFinite(v)) return "";
  return String(Math.round(v * 1e4) / 1e4);
}
// Cella di testo del CSV dei referti. Il lettore di Genesi spezza le righe
// su ; e su TAB (e su una virgola seguita da testo) e NON interpreta le
// virgolette: quindi una cella non può contenere quei caratteri, e
// virgolettarla la spezzerebbe in due invece di proteggerla. Si sostituiscono
// con uno spazio: si perde un carattere di un'etichetta, non una riga.
function cellaCsvReferto(s) {
  return String(s == null ? "" : s).replace(/[;,"\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

// L'intestazione del file dei referti. L'ordine delle prime tre colonne è
// quello che la modale «Legge di sito» di Genesi si aspetta di default
// (distanza, carica per ritardo, PPV): così il file entra senza che nessuno
// debba rimappare le colonne a mano. Le altre tre sono la tracciabilità.
export const CSV_REFERTI_INTESTAZIONE = "distanza_m;carica_per_ritardo_kg;ppv_mms;riferimento;data;origine";

// Il file dei referti per Genesi. Entrano SOLO le volate pronte: una volata
// senza PPV misurata non compare, e non compare nemmeno con la PPV a zero.
export function csvRefertiGenesi(referti) {
  const pronti = (referti || []).filter(r => r && r.pronto && r.d > 0 && r.w > 0 && r.ppv > 0)
    .slice().sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")));
  const righe = pronti.map(r => [
    numeroCsvReferto(r.d), numeroCsvReferto(r.w), numeroCsvReferto(r.ppv),
    cellaCsvReferto(riferimentoReferto(r)), r.data || "", "sentinella",
  ].join(";"));
  return CSV_REFERTI_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
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
        monitoraggi: () => read("monitoraggi"), adempimenti: () => read("adempimenti"), registri: () => read("registri"), volate: () => read("volate"),
        ricettori: () => read("ricettori"), reclami: () => read("reclami"), programma: () => read("programma"),
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
      monitoraggi: async () => mem.monitoraggi, adempimenti: async () => mem.adempimenti, registri: async () => mem.registri, volate: async () => mem.volate,
      ricettori: async () => mem.ricettori, reclami: async () => mem.reclami, programma: async () => mem.programma || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
