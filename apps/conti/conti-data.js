// ============================================================
// Conti — accesso dati (C4). Schema condiviso (orgCollection da
// autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/conti/):
//   fatture/{id}: { numero, cliente, clienteId?, importo, emessa (ISO), scadenza (ISO), incassata (bool),
//                   imponibile?, ivaImporto?, totale?, righe? [], ddtIds? [], tipo? }
//   clienti/{id}: { ragioneSociale, piva, sdi (codice destinatario o PEC), indirizzo,
//                   sconto (%), fido (€), note }
//   gare/{id}:    { titolo, base, scadenza (ISO), stato: aperta|vinta|persa }
//   prodotti/{id}:{ nome, unitaPrezzo: "t"|"m3", prezzo (€/unità), densita (t/m³), iva (%) }
//   pesate/{id}:  { numero (progressivo per anno), data (ISO), clienteId, cliente,
//                   prodottoId, prodotto, lordo (t), tara (t), netto (t),
//                   unitaVendita "t"|"m3", quantita (nell'unità di vendita), densita,
//                   prezzoUnitario (€/unità di vendita), aliquotaIva (%),
//                   mezzo (targa), destinatario, fatturaId|null }
//   incassi/{id}:  { fatturaId, data (ISO: il giorno in cui i soldi sono ARRIVATI),
//                    importo (€), metodo ("bonifico"|"assegno"|"contanti"|"riba"|"") }
//   impostazioni/{id}: { canoneUnita: "t"|"m3", canoneAliquota (€/unità), canoneNota }
// IMPORTI DELLA FATTURA (compatibilità all'indietro, regola ferma): le fatture
// vecchie hanno solo `importo` (importo secco) → valgono come IMPONIBILE con IVA 0
// (vedi importiFattura). Le fatture nuove salvano imponibile + ivaImporto + totale
// e tengono `importo` = TOTALE, così aging, esposizione, incassi e solleciti — che
// leggono `importo` — continuano a funzionare senza toccare una riga.
// CLIENTE DI UNA FATTURA: `clienteId` è il collegamento all'anagrafica; `cliente`
// resta salvato come TESTO di ripiego (fatture vecchie o cliente cancellato), così
// niente si rompe né sparisce. Vedi clienteDiFattura/nomeCliente più sotto.
// INCASSI (compatibilità, regola ferma): l'incasso è un MOVIMENTO a sé (data +
// importo), così esistono acconti e saldo. Una fattura marcata `incassata` che
// NON ha movimenti vale INCASSATA PER INTERO, con la sua vecchia `dataIncasso`
// se c'era: nessun numero già mostrato cambia finché non si registra un incasso
// nuovo. Le organizzazioni senza la collezione `incassi` leggono una lista
// vuota e l'app funziona esattamente come prima. Vedi statoIncasso/apertoDi.
// KPI CALCOLATI: da incassare, in scadenza, gare aperte, età media del credito.
// ============================================================

import { parseCsvLine, numIt, giorniTra, isIntestazione } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  // fatture d'esempio: alcune già collegate all'anagrafica (clienteId), altre
  // con il solo testo libero — e volutamente scritto in modi diversi — per far
  // vedere come funziona il collegamento delle fatture vecchie.
  fatture: [
    { id: "f1", numero: "2026/031", cliente: "Edilcave Srl", clienteId: "c1", importo: 18300, emessa: "2026-06-07", scadenza: "2026-07-08", incassata: false },
    { id: "f2", numero: "2026/034", cliente: "Stradesud", clienteId: "c2", importo: 9750, emessa: "2026-06-25", scadenza: "2026-07-25", incassata: false },
    { id: "f3", numero: "2026/035", cliente: "Comune di Modica", importo: 8100, emessa: "2026-07-10", scadenza: "2026-08-10", incassata: false },
    { id: "f4", numero: "2026/036", cliente: "Calcestruzzi RG", importo: 5900, emessa: "2026-07-18", scadenza: "2026-08-18", incassata: false },
    // f5: fattura VECCHIA, marcata incassata e senza data d'incasso. Serve a
    // tenere sotto gli occhi il caso di compatibilità: vale incassata per
    // intero, e nei tempi di pagamento resta contata a parte come "senza data".
    { id: "f5", numero: "2026/028", cliente: "edilcave s.r.l.", importo: 12000, emessa: "2026-05-12", scadenza: "2026-06-12", incassata: true },
    // f6: saldata con DUE movimenti (acconto + saldo): è il caso normale in
    // cava, ed è quello che rende veri i giorni di pagamento.
    { id: "f6", numero: "2026/030", cliente: "Stradesud", clienteId: "c2", importo: 7320, emessa: "2026-06-02", scadenza: "2026-07-02", incassata: true, dataIncasso: "2026-06-28" },
  ],
  // Movimenti di incasso: il giorno in cui i soldi sono ARRIVATI davvero.
  incassi: [
    { id: "i1", fatturaId: "f6", data: "2026-06-15", importo: 3000, metodo: "bonifico" },
    { id: "i2", fatturaId: "f6", data: "2026-06-28", importo: 4320, metodo: "bonifico" },
    // acconto su una fattura già scaduta: "scaduta" e "scaduta ma in parte
    // incassata" sono due cose diverse, e ora si vedono diverse.
    { id: "i3", fatturaId: "f1", data: "2026-07-02", importo: 6000, metodo: "bonifico" },
  ],
  clienti: [
    { id: "c1", ragioneSociale: "Edilcave Srl", piva: "01234567890", sdi: "ABC1234", indirizzo: "Zona industriale, Ragusa", sconto: 5, fido: 25000, note: "" },
    { id: "c2", ragioneSociale: "Stradesud", piva: "09876543210", sdi: "stradesud@pec.example.it", indirizzo: "SS115 km 12, Modica", sconto: 0, fido: 15000, note: "" },
  ],
  gare: [
    { id: "g1", titolo: "Comune di Ragusa — inerti 2026-27", base: 120000, scadenza: "2026-07-28", stato: "aperta" },
    { id: "g2", titolo: "ANAS — manutenzione SS115", base: 340000, scadenza: "2026-08-12", stato: "aperta" },
    { id: "g3", titolo: "Consorzio bonifica — massi scogliera", base: 85000, scadenza: "2026-06-30", stato: "vinta" },
    { id: "g4", titolo: "Provincia — pietrisco lotto 3", base: 60000, scadenza: "2026-05-15", stato: "persa" },
  ],
  // listino d'esempio: un prodotto venduto a metro cubo (sabbia) accanto a
  // quelli venduti a tonnellata, così si vede subito a cosa serve la densità.
  prodotti: [
    { id: "p1", nome: "Stabilizzato 0/30", unitaPrezzo: "t",  prezzo: 8.5,  densita: 1.9, iva: 22 },
    { id: "p2", nome: "Pietrisco 8/12",    unitaPrezzo: "t",  prezzo: 12,   densita: 1.5, iva: 22 },
    { id: "p3", nome: "Sabbia lavata 0/4", unitaPrezzo: "m3", prezzo: 22,   densita: 1.6, iva: 22 },
    { id: "p4", nome: "Massi da scogliera",unitaPrezzo: "t",  prezzo: 15.5, densita: 2.4, iva: 22 },
  ],
  // pesate/DDT d'esempio, tutte ancora da fatturare: servono a far vedere la
  // fattura differita (più DDT dello stesso cliente → una fattura sola).
  pesate: [
    { id: "d1", numero: "2026/001", data: "2026-07-06", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42.16, tara: 14.2, netto: 27.96,
      unitaVendita: "t", quantita: 27.96, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d2", numero: "2026/002", data: "2026-07-13", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p2", prodotto: "Pietrisco 8/12", lordo: 39.4, tara: 13.8, netto: 25.6,
      unitaVendita: "t", quantita: 25.6, densita: 1.5, prezzoUnitario: 12, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d3", numero: "2026/003", data: "2026-07-17", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 43.9, tara: 14.2, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d4", numero: "2026/004", data: "2026-07-20", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 35.2, tara: 13.6, netto: 21.6,
      unitaVendita: "m3", quantita: 13.5, densita: 1.6, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null },
    { id: "d5", numero: "2026/005", data: "2026-07-24", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p4", prodotto: "Massi da scogliera", lordo: 44.8, tara: 15.1, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 2.4, prezzoUnitario: 15.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Molo di Pozzallo", fatturaId: null },
  ],
  // canone di escavazione: l'aliquota NON è cablata, cambia da regione a regione.
  impostazioni: [
    { id: "s1", canoneUnita: "m3", canoneAliquota: 0.55, canoneNota: "Valore di esempio: metti la tariffa della tua concessione." },
  ],
};

export function giorni(dataISO, oggi = new Date()) {
  return giorniTra(dataISO, oggi);
}

export function kpiFrom(fatture, gare, oggi = new Date()) {
  const aperte = fatture.filter(f => !f.incassata);
  // apertoDi: con un acconto registrato conta il RESIDUO, non il totale della
  // fattura. Senza incassi registrati residuo = importo, quindi il numero è
  // identico a quello di prima.
  const daIncassare = aperte.reduce((t, f) => t + apertoDi(f), 0);
  const inScadenza = aperte.filter(f => giorni(f.scadenza, oggi) <= 10).length;
  const gareAperte = gare.filter(g => g.stato === "aperta").length;
  // Età media del credito aperto: media dei giorni dall'emissione sulle fatture NON
  // ancora incassate. NON è il DSO (Days Sales Outstanding = crediti/vendite×giorni):
  // è l'anzianità media dei crediti aperti, onesta e utile per capire quanto "vecchio"
  // è il credito che l'azienda ha in giro. (DSO vero → roadmap: serve il fatturato del periodo.)
  const etaCredito = aperte.length
    ? Math.round(aperte.reduce((t, f) => t + Math.max(0, -giorni(f.emessa, oggi) || 0), 0) / aperte.length)
    : 0;
  return { daIncassare, inScadenza, gareAperte, etaCredito };
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
    if (isNaN(g)) { b.nonScaduto.conto++; b.nonScaduto.importo += apertoDi(f); continue; }
    // quello che pesa nell'aging è ciò che RESTA da incassare: un acconto già
    // arrivato non è più credito scaduto
    const imp = apertoDi(f);
    let k;
    if (g >= 0) k = "nonScaduto";
    else { const r = -g; k = r <= 30 ? "g1_30" : r <= 60 ? "g31_60" : r <= 90 ? "g61_90" : "oltre90"; }
    b[k].conto++; b[k].importo += imp;
  }
  b.scadutoTot = b.g1_30.importo + b.g31_60.importo + b.g61_90.importo + b.oltre90.importo;
  return b;
}

// Import fatture da CSV (per l'avvio: caricare le fatture esistenti invece
// di riscriverle a mano). Colonne: numero;cliente;importo;emessa;scadenza
// [;incassata] (header opzionale). Coerce importo a numero, incassata a
// booleano ("si"/"true"/"1"); scarta le righe senza numero/cliente/importo
// valido. numero/cliente sono testo grezzo → escapare dove mostrati. Pura.
export function parseFattureCsv(text) {
  const vero = (v) => /^(si|sì|true|1|x)$/i.test(String(v || "").trim());
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "numero"))
    .map(r => {
      const [numero, cliente, importo, emessa, scadenza, incassata] = parseCsvLine(r);
      return {
        numero: (numero || "").trim(), cliente: (cliente || "").trim(),
        importo: numIt(importo),
        emessa: (emessa || "").trim() || null, scadenza: (scadenza || "").trim() || null,
        incassata: vero(incassata),
      };
    })
    .filter(f => f.numero && f.cliente && Number.isFinite(f.importo) && f.importo > 0);
}

// Import delle GARE d'appalto da CSV (onboarding: caricare le gare in corso e
// il loro esito). Colonne: titolo;base;scadenza;stato (header opzionale). Tiene
// solo le righe con un titolo; base via numIt (≥0); stato aperta|vinta|persa
// (default aperta). titolo è testo grezzo → escapare dove mostrato. Pura e
// testabile.
export function parseGareCsv(text) {
  const stati = ["aperta", "vinta", "persa"];
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "titolo"))
    .map(r => {
      const [titolo, base, scadenza, stato] = parseCsvLine(r);
      const b = numIt(base);
      const s = (stato || "").trim().toLowerCase();
      return {
        titolo: (titolo || "").trim(),
        base: Number.isFinite(b) ? Math.max(0, b) : 0,
        scadenza: (scadenza || "").trim() || null,
        stato: stati.includes(s) ? s : "aperta",
      };
    })
    .filter(g => g.titolo);
}

// Interessi di mora di legge (D.Lgs 231/2002, transazioni commerciali) su una
// fattura insoluta: danno un NUMERO vero al sollecito. Decorrono dal giorno
// dopo la scadenza, senza messa in mora. Interessi = importo × tasso%/100 ×
// giorni/365. Tasso di riferimento BCE + 8 punti (1° sem 2026 = 10,15%); è un
// parametro aggiornabile ogni semestre, DA CONFERMARE col commercialista. Più
// €40 forfettari di spese (art. 6), esposti a parte. Zero se non in ritardo.
// Vedi vault/RICERCA_INTERESSI_MORA.md. Pura e testabile.
export const TASSO_MORA_DEFAULT = 10.15;   // % annuo — 1° semestre 2026 (GU 15/2026)
export const SPESE_RECUPERO_231 = 40;      // € forfettari art. 6 D.Lgs 231/2002

export function interessiMora(importo, giorniRitardo, tassoAnnuo = TASSO_MORA_DEFAULT) {
  const imp = +importo || 0, g = +giorniRitardo || 0, t = +tassoAnnuo || 0;
  if (imp <= 0 || g <= 0 || t <= 0) return { interessi: 0, giorni: Math.max(0, g), tasso: t };
  const interessi = Math.round(imp * (t / 100) * (g / 365) * 100) / 100;
  return { interessi, giorni: g, tasso: t };
}

// Livello di sollecito in base ai giorni di ritardo di una fattura insoluta:
// nessuno (non scaduta), 1° sollecito, 2° sollecito, ultimo avviso. Fasce
// pensate come promemoria progressivi. Pura e testabile.
export function livelloSollecito(giorniRitardo) {
  const g = +giorniRitardo || 0;
  if (g <= 0)  return { livello: 0, label: "", cls: "ok" };
  if (g <= 15) return { livello: 1, label: "1° sollecito", cls: "warn" };
  if (g <= 45) return { livello: 2, label: "2° sollecito", cls: "warn" };
  return { livello: 3, label: "ultimo avviso", cls: "danger" };
}

// Formattazioni PURE (niente locale ICU, così i test sono deterministici):
// euro all'italiana (18.300 / 83,42) e data GG/MM/AAAA da ISO.
function euroIt(v) {
  const n = Math.round((+v || 0) * 100) / 100;
  const [int, dec] = Math.abs(n).toFixed(2).split(".");
  const intG = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const seg = dec === "00" ? intG : intG + "," + dec;
  return (n < 0 ? "-" : "") + seg;
}
function dataIt(iso) {
  const s = String(iso || "").slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || "—");
}

// Testo PRONTO di un sollecito di pagamento per una fattura INSOLUTA, da
// copiare e inviare (email/PEC). Mette insieme gli estremi della fattura, i
// giorni di ritardo, gli interessi di mora di legge (D.Lgs 231/2002) e i €40
// forfettari art. 6, con un totale dovuto. Ritorna null se la fattura NON è
// scaduta (niente da sollecitare) o se i dati non sono validi. La nota "da
// confermare col commercialista" resta nell'interfaccia, non nella lettera al
// cliente. Pura e testabile: nessun DOM, `oggi` e `tasso` iniettabili.
export function testoSollecito(fattura, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT) {
  const f = fattura || {};
  // si sollecita ciò che RESTA da avere: se il cliente ha già versato un
  // acconto, chiedergli di nuovo l'intero sarebbe una lettera sbagliata.
  const totDoc = round2(+f.importo || 0);
  const imp = apertoDi(f);
  const acconti = round2(Math.max(0, totDoc - imp));
  const g = giorni(f.scadenza, oggi);
  if (imp <= 0 || !Number.isFinite(g) || g >= 0) return null;   // non scaduta, saldata o dati non validi
  const ritardo = -g;
  const m = interessiMora(imp, ritardo, tassoAnnuo);
  const totale = Math.round((imp + m.interessi + SPESE_RECUPERO_231) * 100) / 100;
  const cliente = (f.cliente || "").trim() || "Spett.le cliente";
  const numero = (f.numero || "").trim() || "—";
  const tassoTxt = String(tassoAnnuo).replace(".", ",");
  const e = (v) => "€ " + euroIt(v);
  return [
    `Oggetto: sollecito di pagamento — fattura ${numero}`,
    ``,
    `Spett.le ${cliente},`,
    acconti > 0
      ? `risulta ancora da saldare la fattura n. ${numero} di ${e(totDoc)}, scaduta il ${dataIt(f.scadenza)} (${ritardo} giorni di ritardo): a fronte di acconti per ${e(acconti)} resta scoperto ${e(imp)}.`
      : `risulta non ancora saldata la fattura n. ${numero} di ${e(imp)}, scaduta il ${dataIt(f.scadenza)} (${ritardo} giorni di ritardo).`,
    ``,
    `La preghiamo di provvedere al pagamento nel più breve tempo possibile. Ai sensi del D.Lgs 231/2002 sulle transazioni commerciali, dalla scadenza maturano interessi di mora al tasso del ${tassoTxt}% annuo, oltre a ${e(SPESE_RECUPERO_231)} di spese forfettarie di recupero (art. 6).`,
    ``,
    `Riepilogo alla data odierna:`,
    ...(acconti > 0
      ? [`- Importo fattura: ${e(totDoc)}`, `- Acconti già ricevuti: ${e(acconti)}`, `- Residuo scoperto: ${e(imp)}`]
      : [`- Importo fattura: ${e(imp)}`]),
    `- Interessi di mora (stima, ${ritardo} gg): ${e(m.interessi)}`,
    `- Spese forfettarie art. 6: ${e(SPESE_RECUPERO_231)}`,
    `- Totale dovuto: ${e(totale)}`,
    ``,
    `Gli interessi sono calcolati al tasso di legge vigente e saranno aggiornati alla data dell'effettivo pagamento. Restiamo a disposizione per ogni chiarimento.`,
    `Distinti saluti.`,
  ].join("\n");
}

// Incasso atteso nei prossimi N giorni: somma delle fatture aperte la cui
// scadenza cade da oggi a oggi+N (non ancora scadute). È l'entrata di cassa
// PREVISTA, complementare all'aging (che guarda al ritardo passato).
export function incassoAtteso(fatture, giorniAvanti = 30, oggi = new Date()) {
  let importo = 0, conto = 0;
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g >= 0 && g <= giorniAvanti) { importo += apertoDi(f); conto++; }
  }
  return { conto, importo };
}

// ---------- ANAGRAFICA CLIENTI (F4) ----------
// Chiave di confronto di un nome scritto a mano: minuscole, senza accenti né
// punteggiatura, spazi normalizzati. È il cuore della correzione: "Rossi srl",
// "Rossi S.r.l." e "rossi  srl" sono LO STESSO cliente, ma finivano in tre righe
// diverse di esposizione ed estratto conto. Pura e testabile.
export function chiaveNome(nome) {
  return String(nome || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // accenti via (Società = Societa)
    .toLowerCase()
    .replace(/[.,;:'"`´&()\[\]{}\-_/\\]/g, "")          // punteggiatura via (S.r.l. = srl)
    .replace(/\s+/g, " ").trim();
}

// Cliente di anagrafica collegato a una fattura: il documento con quel
// `clienteId`, oppure — per le fatture vecchie che hanno solo il testo — il
// cliente la cui ragione sociale coincide a meno di maiuscole/punteggiatura.
// null se non c'è corrispondenza (allora vale il testo libero). Pura.
export function clienteDiFattura(fattura, clienti) {
  const f = fattura || {}, lista = clienti || [];
  if (f.clienteId) return lista.find(c => c.id === f.clienteId) || null;
  const k = chiaveNome(f.cliente);
  return k ? (lista.find(c => chiaveNome(c.ragioneSociale) === k) || null) : null;
}

// Nome del cliente da MOSTRARE per una fattura: la ragione sociale
// dell'anagrafica quando il cliente è collegato, altrimenti il testo libero
// salvato (ripiego, così nessuna fattura resta senza nome). Pura.
export function nomeCliente(fattura, clienti) {
  const c = clienteDiFattura(fattura, clienti);
  return String((c && c.ragioneSociale) || (fattura || {}).cliente || "").trim() || "—";
}

// Chiave con cui le fatture vengono RAGGRUPPATE per cliente: l'id di anagrafica
// se il cliente è collegato (o riconosciuto dal nome), altrimenti il nome
// normalizzato. Così le varianti di scrittura tornano una riga sola. Pura.
export function chiaveCliente(fattura, clienti) {
  const c = clienteDiFattura(fattura, clienti);
  return c ? "id:" + c.id : "nome:" + (chiaveNome((fattura || {}).cliente) || "—");
}

// Fatture ancora NON riconducibili all'anagrafica, raggruppate per nome
// normalizzato: è l'elenco di lavoro della migrazione ("questi nomi vanno
// collegati a un cliente, o ne creo uno"). Porta gli id delle fatture del
// gruppo, così l'interfaccia le collega tutte in un colpo. Pura e testabile.
export function clientiDaCollegare(fatture, clienti) {
  const per = {};
  for (const f of fatture || []) {
    if (clienteDiFattura(f, clienti)) continue;
    const nome = String(f.cliente || "").trim();
    const k = chiaveNome(nome);
    if (!k) continue;                       // fattura senza nome: niente da collegare
    const p = per[k] || (per[k] = { chiave: k, nome, conto: 0, importo: 0, ids: [] });
    p.conto++; p.importo += (+f.importo || 0); p.ids.push(f.id);
  }
  return Object.values(per).sort((a, b) => b.conto - a.conto || a.nome.localeCompare(b.nome, "it"));
}

// Esposizione per CLIENTE: totale delle fatture NON incassate per ogni cliente,
// dal più esposto, con quante fatture e quanto è già scaduto. Serve al credito
// per sapere CHI chiamare per primo (l'esposizione concentrata è il rischio
// vero). Raggruppa per anagrafica quando il cliente è collegato o riconoscibile
// dal nome (niente più doppioni da maiuscole/punteggiatura) e segnala il
// superamento del fido. Ignora le fatture con importo ≤ 0. Pura e testabile.
export function esposizioneClienti(fatture, oggi = new Date(), clienti = []) {
  const per = {};
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const imp = apertoDi(f);            // residuo: l'acconto già arrivato non è esposizione
    if (imp <= 0) continue;
    const k = chiaveCliente(f, clienti);
    const c = clienteDiFattura(f, clienti);
    const p = per[k] || (per[k] = { chiave: k, cliente: nomeCliente(f, clienti),
      clienteId: c ? c.id : null, fido: c && +c.fido > 0 ? +c.fido : 0,
      totale: 0, scaduto: 0, conto: 0 });
    p.totale += imp; p.conto++;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g < 0) p.scaduto += imp;
  }
  return Object.values(per)
    .map(p => ({ ...p, oltreFido: p.fido > 0 && p.totale > p.fido }))
    .sort((a, b) => b.totale - a.totale || a.cliente.localeCompare(b.cliente, "it"));
}

// ESTRATTO CONTO di un cliente: testo pronto (email/PEC) che elenca TUTTE le
// sue fatture aperte con importo, scadenza, ritardo e interessi di mora, e
// chiude con i totali (aperto, scaduto, mora, spese €40 per fattura scaduta,
// totale dovuto). Serve quando un cliente ha PIÙ fatture aperte e vuoi
// mandargli il quadro completo, non un sollecito per singola fattura. Ritorna
// null se il cliente non ha fatture aperte. La nota "da confermare col
// commercialista" resta nell'interfaccia. `cliente` accetta il nome (testo)
// oppure una riga di esposizioneClienti ({ chiave, cliente }): con la chiave le
// fatture del gruppo entrano tutte, comprese quelle col nome scritto in un
// altro modo. Pura e testabile.
export function estrattoContoCliente(cliente, fatture, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT, clienti = []) {
  const rif = cliente && typeof cliente === "object" ? cliente : { cliente: cliente };
  const nome = String(rif.cliente || "").trim();
  const chiave = rif.chiave || null;
  if (!nome && !chiave) return null;
  const kNome = chiaveNome(nome);
  const aperte = (fatture || []).filter(f =>
    !f.incassata && apertoDi(f) > 0 && (chiave
      ? chiaveCliente(f, clienti) === chiave
      : chiaveNome(nomeCliente(f, clienti)) === kNome));
  if (!aperte.length) return null;
  aperte.sort((a, b) => (a.scadenza || "").localeCompare(b.scadenza || ""));
  const e = (v) => "€ " + euroIt(v);
  let totale = 0, scaduto = 0, moraTot = 0, scaduteN = 0;
  const righe = aperte.map(f => {
    const imp = apertoDi(f);                              // residuo dovuto
    const acconti = round2(Math.max(0, round2(+f.importo || 0) - imp));
    totale += imp;
    const g = giorni(f.scadenza, oggi);
    const ritardo = Number.isFinite(g) && g < 0 ? -g : 0;
    let coda;
    if (ritardo > 0) {
      scaduto += imp; scaduteN++;
      const m = interessiMora(imp, ritardo, tassoAnnuo);
      moraTot += m.interessi;
      coda = `scaduta da ${ritardo} gg · mora ~${e(m.interessi)}`;
    } else {
      coda = Number.isFinite(g) ? "non ancora scaduta" : "senza scadenza";
    }
    return `- n. ${(f.numero || "—")} · ${e(imp)}${acconti > 0 ? ` (residuo, acconti ${e(acconti)})` : ""} · scad. ${dataIt(f.scadenza)} · ${coda}`;
  });
  const spese = scaduteN * SPESE_RECUPERO_231;
  const totaleDovuto = Math.round((totale + moraTot + spese) * 100) / 100;
  const od = new Date(oggi);
  const oiso = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, "0")}-${String(od.getDate()).padStart(2, "0")}`;
  const out = [
    `Estratto conto — ${nome || nomeCliente(aperte[0], clienti)}`,
    `Data: ${dataIt(oiso)}`,
    ``,
    `Fatture aperte (${aperte.length}):`,
    ...righe,
    ``,
    `Totale aperto: ${e(totale)}`,
    `Di cui scaduto: ${e(scaduto)}`,
  ];
  if (scaduteN > 0) {
    out.push(`Interessi di mora stimati (D.Lgs 231/2002, ${String(tassoAnnuo).replace(".", ",")}%): ${e(moraTot)}`);
    out.push(`Spese forfettarie art. 6 (${e(SPESE_RECUPERO_231)} × ${scaduteN} fatture scadute): ${e(spese)}`);
    out.push(`Totale dovuto ad oggi: ${e(totaleDovuto)}`);
  }
  out.push(``, `La preghiamo di provvedere alla regolarizzazione. Restiamo a disposizione per ogni chiarimento.`);
  return out.join("\n");
}

// Previsione incassi per MESE: raggruppa le fatture non incassate e non ancora
// scadute per mese-calendario (yyyy-mm) nei prossimi `mesi` mesi, così si vede
// la liquidità attesa nel tempo e non solo un totale a finestra. Le fatture già
// SCADUTE e non incassate finiscono in un bucket "scadute" a parte (vanno
// sollecitate, non pianificate come entrata futura). Ora locale. Pura e testabile.
export function incassoPerMese(fatture, mesi = 6, oggi = new Date()) {
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  const km = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ordine = [], perMese = {};
  for (let i = 0; i < mesi; i++) { const k = km(new Date(o.getFullYear(), o.getMonth() + i, 1)); ordine.push(k); perMese[k] = { mese: k, conto: 0, importo: 0 }; }
  const scadute = { conto: 0, importo: 0 };
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (!Number.isFinite(g)) continue;                 // senza data valida: non pianificabile
    const imp = apertoDi(f);                           // solo ciò che resta da incassare
    if (g < 0) { scadute.conto++; scadute.importo += imp; continue; }
    const k = (f.scadenza || "").slice(0, 7);          // yyyy-mm della scadenza
    if (perMese[k]) { perMese[k].conto++; perMese[k].importo += imp; }  // oltre l'orizzonte: ignorata
  }
  return { mesi: ordine.map(k => perMese[k]), scadute };
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
    .sort((a, b) => b.ritardo - a.ritardo || apertoDi(b.f) - apertoDi(a.f));
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

// ============================================================
// LISTINO PRODOTTI (N1) — €/t e €/m³ NON sono interscambiabili
// ------------------------------------------------------------
// Un prodotto si vende a TONNELLATA oppure a METRO CUBO: il prezzo è scritto
// in una sola delle due unità. Per passare da una all'altra serve la DENSITÀ
// del materiale (tonnellate per metro cubo): 1 m³ di prodotto pesa `densita`
// tonnellate. Senza densità la conversione NON si può fare, e infatti qui
// ritorna null invece di inventare un numero.
//   €/m³ = €/t × densità        €/t = €/m³ ÷ densità
//   m³   = t ÷ densità          t   = m³ × densità
// ============================================================

export const round2 = (v) => Math.round((+v || 0) * 100) / 100;
const round3 = (v) => Math.round((+v || 0) * 1000) / 1000;

// Densità utilizzabile: deve essere un numero > 0, altrimenti niente conversione.
export function densitaValida(prodotto) {
  const d = +((prodotto || {}).densita);
  return Number.isFinite(d) && d > 0 ? d : null;
}

// Prezzo del prodotto in €/tonnellata (null se andrebbe convertito e manca la densità).
export function prezzoPerTonnellata(prodotto) {
  const p = prodotto || {}, v = +p.prezzo || 0;
  if (p.unitaPrezzo === "m3") { const d = densitaValida(p); return d ? round2(v / d) : null; }
  return round2(v);
}

// Prezzo del prodotto in €/metro cubo (null se manca la densità per convertire).
export function prezzoPerMetroCubo(prodotto) {
  const p = prodotto || {}, v = +p.prezzo || 0;
  if (p.unitaPrezzo === "m3") return round2(v);
  const d = densitaValida(p);
  return d ? round2(v * d) : null;
}

// Conversione di una quantità fra tonnellate e metri cubi con la densità del
// prodotto. null se la densità manca: meglio nessun numero che un numero falso.
export function convertiQuantita(valore, da, a, densita) {
  const v = +valore || 0;
  if (da === a) return round3(v);
  const d = +densita;
  if (!Number.isFinite(d) || d <= 0) return null;
  return da === "t" && a === "m3" ? round3(v / d)
       : da === "m3" && a === "t" ? round3(v * d)
       : null;
}

export const UNITA_LABEL = { t: "t", m3: "m³" };

// ============================================================
// FATTURA CON IVA (N2)
// ------------------------------------------------------------
// COMPATIBILITÀ: le fatture salvate prima avevano solo `importo`. Quelle
// valgono come imponibile con IVA 0 e totale = importo: nessun dato si perde
// e nessuna riga di archivio cambia significato.
// ============================================================

// Importi normalizzati di una fattura, vecchia o nuova che sia.
export function importiFattura(fattura) {
  const f = fattura || {};
  const haIva = f.imponibile != null || f.ivaImporto != null || f.totale != null;
  if (!haIva) {
    const imp = +f.importo || 0;
    return { imponibile: round2(imp), ivaImporto: 0, totale: round2(imp),
             aliquota: null, conIva: false };
  }
  const imponibile = round2(f.imponibile != null ? +f.imponibile : (+f.importo || 0));
  const ivaImporto = round2(+f.ivaImporto || 0);
  const totale = round2(f.totale != null ? +f.totale : imponibile + ivaImporto);
  const aliquota = f.aliquotaIva != null ? +f.aliquotaIva
    : (imponibile > 0 ? Math.round(ivaImporto / imponibile * 100) : null);
  return { imponibile, ivaImporto, totale, aliquota, conIva: true };
}

// Totali di una fattura a partire dalle sue righe, con il riepilogo per
// aliquota (è quello che serve al registro IVA: ogni aliquota fa storia a sé).
// Riga: { descrizione, quantita, unita, prezzoUnitario, imponibile, aliquota }.
export function totaliDaRighe(righe) {
  const per = {};
  let imponibile = 0;
  for (const r of righe || []) {
    const base = round2(r.imponibile != null ? +r.imponibile : (+r.quantita || 0) * (+r.prezzoUnitario || 0));
    const al = Math.max(0, +r.aliquota || 0);
    imponibile = round2(imponibile + base);
    const p = per[al] || (per[al] = { aliquota: al, imponibile: 0, imposta: 0 });
    p.imponibile = round2(p.imponibile + base);
  }
  let ivaImporto = 0;
  const perAliquota = Object.values(per).sort((a, b) => a.aliquota - b.aliquota);
  for (const p of perAliquota) { p.imposta = round2(p.imponibile * p.aliquota / 100); ivaImporto = round2(ivaImporto + p.imposta); }
  return { imponibile, ivaImporto, totale: round2(imponibile + ivaImporto), perAliquota };
}

// NUMERAZIONE PROGRESSIVA PER ANNO (fatture e DDT hanno registri separati).
// Legge i numeri già usati nell'anno — sia "2026/037" sia "37/2026" — e
// propone il primo libero, in formato AAAA/NNN. Così non si salta e non si
// duplica: il numero non si digita più a mano.
export function prossimoNumero(numeri, anno = new Date().getFullYear(), cifre = 3) {
  const y = String(anno);
  let max = 0;
  for (const n of numeri || []) {
    const s = String(n == null ? "" : n).trim();
    let m = /^(\d{4})\s*[\/\-.]\s*(\d+)$/.exec(s);
    if (m && m[1] === y) { max = Math.max(max, +m[2]); continue; }
    m = /^(\d+)\s*[\/\-.]\s*(\d{4})$/.exec(s);
    if (m && m[2] === y) max = Math.max(max, +m[1]);
  }
  return y + "/" + String(max + 1).padStart(cifre, "0");
}

// ============================================================
// INCASSI — LA DATA VERA IN CUI I SOLDI SONO ARRIVATI (N6)
// ------------------------------------------------------------
// Fino a ieri l'incasso era un sì/no e la data ripiegava su quella di
// emissione: qualunque conto sui TEMPI DI PAGAMENTO era finto. Adesso ogni
// versamento è un movimento con la sua data e il suo importo, quindi esistono
// gli ACCONTI (in cava un acconto e un saldo sono la norma).
//
// LE DUE REGOLE CHE NON SI TOCCANO
// 1. COMPATIBILITÀ. Una fattura marcata `incassata` SENZA movimenti vale
//    incassata per intero, con la sua vecchia `dataIncasso` se c'era. Chi non
//    ha mai registrato un incasso vede esattamente i numeri di prima.
// 2. I SOLDI NON SI ARROTONDANO. Tutto passa da round2 (centesimi): la somma
//    degli acconti deve tornare col totale della fattura AL CENTESIMO, non
//    "quasi". Il residuo è totale − incassato, sempre a due decimali.
// ============================================================

// Movimenti di UNA fattura, in ordine di data (importi normalizzati a centesimi).
export function movimentiDiFattura(fatturaId, incassi) {
  const id = String(fatturaId == null ? "" : fatturaId);
  if (!id) return [];
  return (incassi || [])
    .filter(m => m && String(m.fatturaId) === id)
    .map(m => ({ ...m, importo: round2(+m.importo || 0), data: String(m.data || "").slice(0, 10) }))
    .sort((a, b) => a.data.localeCompare(b.data) || a.importo - b.importo);
}

// Giorni fra due date ISO (b − a), in UTC e senza fuso: deterministica, così
// "quanti giorni ci ha messo a pagare" dà lo stesso numero ovunque giri l'app.
// null se una delle due date manca o non è una data.
export function giorniFraDate(daISO, aISO) {
  const ok = /^\d{4}-\d{2}-\d{2}$/;
  const a = String(daISO || "").slice(0, 10), b = String(aISO || "").slice(0, 10);
  if (!ok.test(a) || !ok.test(b)) return null;
  return Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / 86400000);
}

// STATO DI INCASSO di una fattura: quanto è entrato davvero, quanto resta, se
// è saldata, quando, e in quanti giorni. È il cuore dell'unità: tutto il resto
// (aging, esposizione, grafici, solleciti) si appoggia qui. Pura e testabile.
export function statoIncasso(fattura, incassi) {
  const f = fattura || {};
  const totale = round2(importiFattura(f).totale);
  const movimenti = movimentiDiFattura(f.id, incassi);

  if (!movimenti.length) {
    if (f.incassata) {                      // ── compatibilità: incassata "vecchio stile"
      const d = /^\d{4}-\d{2}-\d{2}/.test(String(f.dataIncasso || "")) ? String(f.dataIncasso).slice(0, 10) : null;
      return { totale, incassato: totale, residuo: 0, eccedenza: 0,
               saldata: true, parziale: false, movimenti: [], conMovimenti: false,
               dataSaldo: d, senzaData: !d,
               giorniPagamento: d ? giorniFraDate(f.emessa, d) : null,
               ritardoPagamento: d ? giorniFraDate(f.scadenza, d) : null };
    }
    return { totale, incassato: 0, residuo: totale, eccedenza: 0,
             saldata: false, parziale: false, movimenti: [], conMovimenti: false,
             dataSaldo: null, senzaData: false, giorniPagamento: null, ritardoPagamento: null };
  }

  const incassato = round2(movimenti.reduce((t, m) => t + m.importo, 0));
  const residuo = round2(Math.max(0, totale - incassato));
  const eccedenza = round2(Math.max(0, incassato - totale));
  const saldata = residuo === 0;
  const dataSaldo = saldata ? movimenti[movimenti.length - 1].data || null : null;
  return { totale, incassato, residuo, eccedenza,
           saldata, parziale: !saldata && incassato > 0,
           movimenti, conMovimenti: true, dataSaldo, senzaData: false,
           giorniPagamento: saldata ? giorniFraDate(f.emessa, dataSaldo) : null,
           ritardoPagamento: saldata ? giorniFraDate(f.scadenza, dataSaldo) : null };
}

// Fatture "decorate" con il loro stato di incasso: è la lista che usa tutta
// l'app. `importo` NON viene toccato (resta il totale del documento, come sta
// scritto sulla fattura); si aggiunge `residuo`, che è ciò che manca ancora.
// `incassata` viene ricalcolata SOLO quando ci sono movimenti: senza movimenti
// resta quella salvata, e i numeri di prima restano identici.
export function applicaIncassi(fatture, incassi) {
  return (fatture || []).map(f => {
    const s = statoIncasso(f, incassi);
    return { ...f,
      incassata: s.conMovimenti ? s.saldata : !!f.incassata,
      incassato: s.incassato, residuo: s.residuo, eccedenza: s.eccedenza,
      parziale: s.parziale, conMovimenti: s.conMovimenti, nMovimenti: s.movimenti.length,
      dataSaldo: s.dataSaldo, senzaDataIncasso: s.senzaData,
      giorniPagamento: s.giorniPagamento, ritardoPagamento: s.ritardoPagamento };
  });
}

// Importo ancora APERTO di una fattura: il residuo se lo stato di incasso è
// stato calcolato, altrimenti l'importo pieno. Senza incassi registrati il
// residuo È l'importo: ecco perché nessun totale cambia da solo.
export function apertoDi(fattura) {
  const f = fattura || {};
  return Number.isFinite(+f.residuo) ? round2(Math.max(0, +f.residuo)) : round2(+f.importo || 0);
}

// INCASSATO in un periodo (estremi inclusi; date vuote = tutto l'archivio):
// somma dei movimenti veri, più — per compatibilità — le fatture marcate
// incassate senza movimenti, contate alla loro data d'incasso. Quelle senza
// data entrano solo nel totale d'archivio (non sono databili) e vengono
// riportate a parte: è un numero che va detto, non nascosto.
export function incassatoPeriodo(fatture, incassi, dal, al) {
  const d1 = String(dal || ""), d2 = String(al || ""), tutto = !d1 && !d2;
  const dentro = (d) => !!d && (!d1 || d >= d1) && (!d2 || d <= d2);
  const validi = new Set((fatture || []).map(f => String(f.id)));
  let daMovimenti = 0, movimenti = 0;
  for (const m of incassi || []) {
    if (!validi.has(String(m.fatturaId))) continue;      // movimento orfano: non conta
    if (!dentro(String(m.data || "").slice(0, 10))) continue;
    daMovimenti = round2(daMovimenti + round2(+m.importo || 0)); movimenti++;
  }
  let vecchie = 0, fattureVecchie = 0, senzaData = 0, importoSenzaData = 0;
  for (const f of fatture || []) {
    const s = statoIncasso(f, incassi);
    if (s.conMovimenti || !s.saldata) continue;
    if (!s.dataSaldo) {                                   // incassata senza data
      senzaData++; importoSenzaData = round2(importoSenzaData + s.totale);
      if (tutto) { vecchie = round2(vecchie + s.totale); fattureVecchie++; }
      continue;
    }
    if (!dentro(s.dataSaldo)) continue;
    vecchie = round2(vecchie + s.totale); fattureVecchie++;
  }
  return { importo: round2(daMovimenti + vecchie), daMovimenti, movimenti,
           senzaMovimenti: vecchie, fattureVecchie, senzaData, importoSenzaData };
}

// TEMPI REALI DI PAGAMENTO per cliente: giorni medi fra emissione e saldo, e
// giorni medi oltre la scadenza. Contano solo le fatture SALDATE con una data
// vera; quelle marcate incassate senza data restano fuori dalla media e
// vengono contate a parte (senzaData), perché una media su date inventate
// sarebbe peggio di nessuna media. Pura e testabile.
export function tempiPagamentoClienti(fatture, incassi, clienti = []) {
  const per = {};
  for (const f of fatture || []) {
    const s = statoIncasso(f, incassi);
    if (!s.saldata) continue;
    const k = chiaveCliente(f, clienti);
    const p = per[k] || (per[k] = { chiave: k, cliente: nomeCliente(f, clienti),
      conto: 0, importo: 0, conGiorni: 0, giorniTot: 0, conRitardo: 0, ritardoTot: 0,
      senzaData: 0, ultimo: null });
    p.conto++; p.importo = round2(p.importo + s.totale);
    if (s.giorniPagamento == null) { p.senzaData++; continue; }
    p.conGiorni++; p.giorniTot += s.giorniPagamento;
    if (s.ritardoPagamento != null) { p.conRitardo++; p.ritardoTot += s.ritardoPagamento; }
    if (!p.ultimo || s.dataSaldo > p.ultimo) p.ultimo = s.dataSaldo;
  }
  return Object.values(per)
    .map(p => ({ ...p,
      giorniMedi: p.conGiorni ? Math.round(p.giorniTot / p.conGiorni) : null,
      ritardoMedio: p.conRitardo ? Math.round(p.ritardoTot / p.conRitardo) : null }))
    .sort((a, b) => (b.giorniMedi == null ? -1 : b.giorniMedi) - (a.giorniMedi == null ? -1 : a.giorniMedi)
      || b.importo - a.importo);
}

// Tempo medio di pagamento su TUTTE le fatture saldate (media per fattura).
export function tempoMedioPagamento(fatture, incassi) {
  let giorniTot = 0, n = 0, ritTot = 0, nRit = 0, senzaData = 0;
  for (const f of fatture || []) {
    const s = statoIncasso(f, incassi);
    if (!s.saldata) continue;
    if (s.giorniPagamento == null) { senzaData++; continue; }
    giorniTot += s.giorniPagamento; n++;
    if (s.ritardoPagamento != null) { ritTot += s.ritardoPagamento; nRit++; }
  }
  return { giorni: n ? Math.round(giorniTot / n) : null, conto: n, senzaData,
           ritardo: nRit ? Math.round(ritTot / nRit) : null };
}

// EMESSO CONTRO INCASSATO, mese per mese (finestra che finisce col mese in
// corso). Prima della data vera dell'incasso questo confronto non si poteva
// fare onestamente: l'incassato sarebbe stato appiccicato al mese di
// emissione, cioè avrebbe copiato l'altra serie. `conDato` dice quanti mesi
// hanno davvero qualcosa dentro: con troppo pochi mesi una linea sarebbe una
// finzione, e l'interfaccia mostra i numeri invece del disegno.
export function emessoIncassato(fatture, incassi, mesi = 6, oggi = new Date()) {
  const o = new Date(oggi);
  const km = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ordine = [], per = {};
  for (let i = mesi - 1; i >= 0; i--) {
    const k = km(new Date(o.getFullYear(), o.getMonth() - i, 1));
    ordine.push(k); per[k] = { mese: k, emesso: 0, incassato: 0, emesse: 0, movimenti: 0, vecchie: 0 };
  }
  for (const f of fatture || []) {
    const k = String(f.emessa || "").slice(0, 7);
    if (!per[k]) continue;
    per[k].emesso = round2(per[k].emesso + round2(importiFattura(f).totale));
    per[k].emesse++;
  }
  const validi = new Set((fatture || []).map(f => String(f.id)));
  for (const m of incassi || []) {
    if (!validi.has(String(m.fatturaId))) continue;
    const k = String(m.data || "").slice(0, 7);
    if (!per[k]) continue;
    per[k].incassato = round2(per[k].incassato + round2(+m.importo || 0));
    per[k].movimenti++;
  }
  let senzaData = 0, importoSenzaData = 0;
  for (const f of fatture || []) {                       // compatibilità
    const s = statoIncasso(f, incassi);
    if (s.conMovimenti || !s.saldata) continue;
    if (!s.dataSaldo) { senzaData++; importoSenzaData = round2(importoSenzaData + s.totale); continue; }
    const k = s.dataSaldo.slice(0, 7);
    if (!per[k]) continue;
    per[k].incassato = round2(per[k].incassato + s.totale); per[k].vecchie++;
  }
  const lista = ordine.map(k => per[k]);
  return { mesi: lista,
    conDato: lista.filter(m => m.emesso > 0 || m.incassato > 0).length,
    emesso: round2(lista.reduce((t, m) => t + m.emesso, 0)),
    incassato: round2(lista.reduce((t, m) => t + m.incassato, 0)),
    senzaData, importoSenzaData };
}

// ============================================================
// PESATE / DDT (N3) — DPR 472/1996
// ------------------------------------------------------------
// Il netto NON si digita: è sempre lordo − tara. È il numero che va in
// fattura, quindi deve venire dal calcolo, non dalla mano di chi scrive.
// ============================================================

export function nettoPesata(lordo, tara) {
  return round2(Math.max(0, (+lordo || 0) - (+tara || 0)));
}

// Riga di pesata completa a partire da pesi, prodotto e anagrafica: quantità
// nell'unità in cui il prodotto si VENDE (t o m³), prezzo unitario e valore.
// La densità e il prezzo vengono FOTOGRAFATI qui: se domani il listino cambia,
// il DDT già emesso resta quello che è stato consegnato e fatturato.
export function rigaPesata(prodotto, lordo, tara) {
  const p = prodotto || {};
  const netto = nettoPesata(lordo, tara);
  const unitaVendita = p.unitaPrezzo === "m3" ? "m3" : "t";
  const densita = densitaValida(p);
  const quantita = unitaVendita === "t" ? netto : convertiQuantita(netto, "t", "m3", densita);
  const prezzoUnitario = round2(+p.prezzo || 0);
  const valore = quantita == null ? null : round2(quantita * prezzoUnitario);
  return { netto, unitaVendita, densita: densita || null, quantita,
           prezzoUnitario, aliquotaIva: +p.iva || 0, valore };
}

// Valore di una pesata già salvata (usa i dati fotografati sul documento).
export function valorePesata(pesata) {
  const d = pesata || {};
  const q = +d.quantita;
  if (!Number.isFinite(q)) return 0;
  return round2(q * (+d.prezzoUnitario || 0));
}

// Tonnellate e metri cubi di una pesata (i m³ solo se la densità c'era).
export function quantitaPesata(pesata) {
  const d = pesata || {};
  const t = +d.netto || 0;
  const m3 = d.unitaVendita === "m3" && Number.isFinite(+d.quantita)
    ? +d.quantita : convertiQuantita(t, "t", "m3", d.densita);
  return { t: round2(t), m3: m3 == null ? null : round3(m3) };
}

// ============================================================
// FATTURA DIFFERITA DAI DDT (N4)
// ------------------------------------------------------------
// È il flusso vero della cava: tanti viaggi documentati da DDT nel mese, UNA
// fattura riepilogativa (entro il 15 del mese successivo alla consegna).
// ============================================================

// DDT ancora da fatturare di un cliente in un periodo (estremi inclusi).
export function pesateDaFatturare(pesate, clienteId, dal, al) {
  const d1 = String(dal || ""), d2 = String(al || "");
  return (pesate || [])
    .filter(p => !p.fatturaId)
    .filter(p => !clienteId || p.clienteId === clienteId)
    .filter(p => { const d = String(p.data || "");
      return (!d1 || d >= d1) && (!d2 || d <= d2); })
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || ""))
      || String(a.numero || "").localeCompare(String(b.numero || ""), "it", { numeric: true }));
}

// Righe di fattura raggruppate PER PRODOTTO (a parità di prezzo, unità e
// aliquota: prezzi diversi dello stesso prodotto restano righe diverse, come
// deve essere). Ogni riga porta i numeri dei DDT che la compongono.
export function righeDaPesate(pesate) {
  const per = {};
  for (const p of pesate || []) {
    const unita = p.unitaVendita === "m3" ? "m3" : "t";
    const prezzo = round2(+p.prezzoUnitario || 0);
    const aliquota = Math.max(0, +p.aliquotaIva || 0);
    const k = [p.prodottoId || p.prodotto || "—", unita, prezzo, aliquota].join("|");
    const r = per[k] || (per[k] = { prodottoId: p.prodottoId || null,
      descrizione: String(p.prodotto || "Prodotto"), unita, prezzoUnitario: prezzo,
      aliquota, quantita: 0, imponibile: 0, ddt: [], ddtIds: [] });
    const q = Number.isFinite(+p.quantita) ? +p.quantita : (+p.netto || 0);
    r.quantita = round3(r.quantita + q);
    r.ddt.push(p.numero || "—");
    r.ddtIds.push(p.id);
  }
  const righe = Object.values(per).sort((a, b) => a.descrizione.localeCompare(b.descrizione, "it"));
  for (const r of righe) r.imponibile = round2(r.quantita * r.prezzoUnitario);
  return righe;
}

// Anteprima completa della fattura differita: righe raggruppate + totali +
// riepilogo per aliquota. Ritorna null se non c'è nessun DDT selezionato.
export function fatturaDaPesate(pesate) {
  const lista = (pesate || []).filter(Boolean);
  if (!lista.length) return null;
  const righe = righeDaPesate(lista);
  const t = totaliDaRighe(righe);
  const date = lista.map(p => String(p.data || "")).filter(Boolean).sort();
  return { righe, ...t, ddtIds: lista.map(p => p.id),
           ddtNumeri: lista.map(p => p.numero || "—"),
           dal: date[0] || null, al: date[date.length - 1] || null, conto: lista.length };
}

// ============================================================
// CANONE / DIRITTI DI ESCAVAZIONE (N5)
// ------------------------------------------------------------
// L'aliquota la imposta l'organizzazione (€/t o €/m³): cambia da regione a
// regione e da concessione a concessione, quindi NON è cablata da nessuna
// parte. Qui si calcola solo il dovuto sul materiale del periodo.
// ============================================================

export function canonePeriodo(pesate, impostazioni, dal, al) {
  const cfg = impostazioni || {};
  const unita = cfg.canoneUnita === "t" ? "t" : "m3";
  const aliquota = +cfg.canoneAliquota || 0;
  const d1 = String(dal || ""), d2 = String(al || "");
  const per = {};
  let tot = { t: 0, m3: 0, senzaDensita: 0 };
  for (const p of pesate || []) {
    const d = String(p.data || "");
    if ((d1 && d < d1) || (d2 && d > d2)) continue;
    const q = quantitaPesata(p);
    const nome = String(p.prodotto || "Prodotto");
    const r = per[nome] || (per[nome] = { prodotto: nome, t: 0, m3: 0, viaggi: 0, senzaDensita: 0 });
    r.viaggi++; r.t = round2(r.t + q.t);
    if (q.m3 == null) { r.senzaDensita++; tot.senzaDensita++; }
    else r.m3 = round3(r.m3 + q.m3);
    tot.t = round2(tot.t + q.t);
    if (q.m3 != null) tot.m3 = round3(tot.m3 + q.m3);
  }
  const base = unita === "t" ? tot.t : tot.m3;
  const perProdotto = Object.values(per).sort((a, b) => b.t - a.t);
  for (const r of perProdotto) r.dovuto = round2((unita === "t" ? r.t : r.m3) * aliquota);
  return { unita, aliquota, tonnellate: round2(tot.t), metriCubi: round3(tot.m3),
           base: round3(base), dovuto: round2(base * aliquota),
           senzaDensita: tot.senzaDensita, perProdotto,
           viaggi: perProdotto.reduce((s, r) => s + r.viaggi, 0) };
}

// Venduto per prodotto in un periodo (tonnellate, metri cubi e valore): è la
// statistica che ogni gestionale di settore ha e che dice cosa tira davvero.
export function venditePerProdotto(pesate, dal, al) {
  const d1 = String(dal || ""), d2 = String(al || "");
  const per = {};
  for (const p of pesate || []) {
    const d = String(p.data || "");
    if ((d1 && d < d1) || (d2 && d > d2)) continue;
    const nome = String(p.prodotto || "Prodotto");
    const q = quantitaPesata(p);
    const r = per[nome] || (per[nome] = { prodotto: nome, t: 0, m3: 0, valore: 0, viaggi: 0 });
    r.viaggi++; r.t = round2(r.t + q.t);
    if (q.m3 != null) r.m3 = round3(r.m3 + q.m3);
    r.valore = round2(r.valore + valorePesata(p));
  }
  return Object.values(per).sort((a, b) => b.valore - a.valore || b.t - a.t);
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
        fatture: () => read("fatture"), gare: () => read("gare"), clienti: () => read("clienti"),
        prodotti: () => read("prodotti"), pesate: () => read("pesate"),
        // le organizzazioni di prima non hanno la collezione degli incassi:
        // Firestore restituisce semplicemente una lista vuota, niente errori
        incassi: () => read("incassi"),
        impostazioni: () => read("impostazioni"),
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
      fatture: async () => mem.fatture, gare: async () => mem.gare, clienti: async () => mem.clienti,
      prodotti: async () => mem.prodotti, pesate: async () => mem.pesate,
      incassi: async () => mem.incassi || (mem.incassi = []),
      impostazioni: async () => mem.impostazioni,
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
