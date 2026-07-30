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
// LETTURA DAI RILIEVI DI TERRA (sola lettura, ponte cavato↔venduto): i rilievi
// NON sono di Conti, stanno sotto l'app Terra della STESSA organizzazione
// (organizations/{org}/apps/terra/rilievi). Si leggono con una seconda istanza
// dell'SDK (appId "terra"), quindi sempre da orgCollection: nessun percorso
// scritto a mano, nessuna scrittura. Vedi rilieviTerra() in fondo al file.
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
import { provenienzaDi } from "../../shared/dw-ponti.js";

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
    // p5: prodotto VECCHIO senza densità dichiarata (il form oggi la pretende,
    // ma un listino nato prima può averne). Sta qui apposta: fa vedere cosa
    // succede quando la densità manca — Conti non converte e lo dice.
    { id: "p5", nome: "Misto di cava (non classificato)", unitaPrezzo: "t", prezzo: 6.5, densita: null, iva: 22 },
  ],
  // pesate/DDT d'esempio. Le prime sei sono di mesi passati e GIÀ fatturate
  // (servono a far quadrare l'anno nel confronto cavato/venduto); le ultime
  // sono ancora da fatturare e fanno vedere la fattura differita (più DDT
  // dello stesso cliente → una fattura sola). Numerazione progressiva per
  // data, senza salti, come vuole il DPR 472/1996.
  pesate: [
    { id: "s1", numero: "2026/001", data: "2026-02-11", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42.6, tara: 14.2, netto: 28.4,
      unitaVendita: "t", quantita: 28.4, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: "storico" },
    { id: "s2", numero: "2026/002", data: "2026-03-09", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p2", prodotto: "Pietrisco 8/12", lordo: 40, tara: 13.8, netto: 26.2,
      unitaVendita: "t", quantita: 26.2, densita: 1.5, prezzoUnitario: 12, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: "storico" },
    { id: "s3", numero: "2026/003", data: "2026-04-14", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 43.3, tara: 14.2, netto: 29.1,
      unitaVendita: "t", quantita: 29.1, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Cantiere SS115 km 12", fatturaId: "storico" },
    { id: "s4", numero: "2026/004", data: "2026-05-08", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 36, tara: 13.6, netto: 22.4,
      unitaVendita: "m3", quantita: 14, densita: 1.6, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: "storico" },
    { id: "s5", numero: "2026/005", data: "2026-06-05", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p4", prodotto: "Massi da scogliera", lordo: 45.3, tara: 15.1, netto: 30.2,
      unitaVendita: "t", quantita: 30.2, densita: 2.4, prezzoUnitario: 15.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Molo di Pozzallo", fatturaId: "storico" },
    { id: "s6", numero: "2026/006", data: "2026-06-22", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42, tara: 14.2, netto: 27.8,
      unitaVendita: "t", quantita: 27.8, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: "storico" },
    { id: "d1", numero: "2026/007", data: "2026-07-06", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42.16, tara: 14.2, netto: 27.96,
      unitaVendita: "t", quantita: 27.96, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d2", numero: "2026/008", data: "2026-07-13", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p2", prodotto: "Pietrisco 8/12", lordo: 39.4, tara: 13.8, netto: 25.6,
      unitaVendita: "t", quantita: 25.6, densita: 1.5, prezzoUnitario: 12, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d3", numero: "2026/009", data: "2026-07-17", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 43.9, tara: 14.2, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Cantiere SS115 km 12", fatturaId: null },
    { id: "d4", numero: "2026/010", data: "2026-07-20", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 35.2, tara: 13.6, netto: 21.6,
      unitaVendita: "m3", quantita: 13.5, densita: 1.6, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null },
    { id: "d5", numero: "2026/011", data: "2026-07-24", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p4", prodotto: "Massi da scogliera", lordo: 44.8, tara: 15.1, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 2.4, prezzoUnitario: 15.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Molo di Pozzallo", fatturaId: null },
    // d6: DDT del prodotto SENZA densità. Le tonnellate ci sono (le ha pesate
    // la bilancia), i metri cubi no: non si inventano. Serve a far vedere che
    // il confronto col cavato si ferma e spiega, invece di stimare.
    { id: "d6", numero: "2026/012", data: "2026-07-27", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p5", prodotto: "Misto di cava (non classificato)", lordo: 40.7, tara: 14.3, netto: 26.4,
      unitaVendita: "t", quantita: 26.4, densita: null, prezzoUnitario: 6.5, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null },
  ],
  // RILIEVI DI TERRA (solo per la modalità dimostrativa): in un'organizzazione
  // vera arrivano dall'app Terra, qui sono finti ma COERENTI con le pesate
  // qui sopra, così il confronto cavato/venduto mostra numeri che quadrano.
  rilieviTerra: [
    { id: "t1", titolo: "Rilievo di fine febbraio", data: "2026-02-28", volumeM3: 31, stato: "elaborato", metodo: "RTK+GCP", gsd: "2" },
    { id: "t2", titolo: "Rilievo di fine aprile",   data: "2026-04-30", volumeM3: 46, stato: "elaborato", metodo: "RTK+GCP", gsd: "2" },
    { id: "t3", titolo: "Rilievo di fine giugno",   data: "2026-06-30", volumeM3: 47, stato: "elaborato", metodo: "RTK", gsd: "2.5" },
    { id: "t4", titolo: "Rilievo di fine luglio",   data: "2026-07-28", volumeM3: 54, stato: "elaborato", metodo: "RTK+GCP", gsd: "2" },
    // ripresa da un cumulo: materiale GIÀ cavato prima, non è nuovo scavo
    { id: "t5", titolo: "Ripresa dal cumulo di piazzale", data: "2026-05-20", volumeM3: 22, stato: "elaborato", metodo: "RTK", gsd: "2", provenienza: "cumulo" },
    // rilievo pianificato (senza volume) e rilievo dell'anno prima: nel
    // confronto non devono entrare, ed è giusto che si veda
    { id: "t6", titolo: "Prossimo rilievo", data: "2026-08-31", volumeM3: null, stato: "pianificato" },
    { id: "t0", titolo: "Rilievo di fine 2025", data: "2025-11-20", volumeM3: 40, stato: "elaborato", metodo: "RTK", gsd: "2" },
  ],
  // canone di escavazione: l'aliquota NON è cablata, cambia da regione a regione.
  impostazioni: [
    { id: "s1", canoneUnita: "m3", canoneAliquota: 0.55, canoneNota: "Valore di esempio: metti la tariffa della tua concessione.",
      // intestazione dei documenti stampati (DDT e fatture): dati d'esempio
      aziendaNome: "Cava di esempio S.r.l.", aziendaPiva: "00000000000",
      aziendaIndirizzo: "Contrada Esempio 1, Ragusa", aziendaContatti: "0932 000000 · amministrazione@esempio.it" },
  ],
};

export function giorni(dataISO, oggi = new Date()) {
  return giorniTra(dataISO, oggi);
}

// ══════════════════════════════════════════════════════════════════════
// NUMERI SCRITTI A MANO — la virgola decimale, che in Italia è la norma
// ------------------------------------------------------------------
// Chi compila Conti scrive «1.250,75», non «1250.75». Fino a ieri i campi
// decimali erano <input type="number">, e quel tipo di campo NON è neutro
// rispetto alla virgola: la specifica HTML gli impone come valore un «valid
// floating-point number», cioè col PUNTO, e il browser sanitizza quello che
// non rientra nella forma. Misurato in Chromium (identico in locale en-US e
// it-IT, quindi `lang="it"` non c'entra):
//   digitato «2,4»      → .value diventa «24»       e checkValidity() dice TRUE
//   digitato «1.250,75» → .value diventa «1.25075»
// Il primo caso salva un numero DIECI volte più grande e lo dichiara valido;
// il secondo, su `#ft-imp`, trasforma una fattura da milleduecentocinquanta
// euro in una da un euro e venticinque. Nessun `replace(",", ".")` può
// rimediare: la virgola è già stata buttata via prima che JS veda il valore.
// Da qui in poi i campi decimali sono <input type="text" inputmode="decimal">
// (sul telefono la tastiera resta numerica) e il numero lo legge questa
// funzione. Il prezzo da pagare è che min/max/step del browser non valgono
// più: la validazione è nostra, ed è qui.
//
// IL PUNTO AMBIGUO — perché su un'app di contabilità non si tira a indovinare.
// «1.250» in Italia è milleduecentocinquanta; per la specifica HTML (e per
// `numIt`, che di un solo punto non può sapere niente) è uno-virgola-due-cinque.
// Le due letture differiscono di MILLE volte: su un importo è la differenza
// fra una fattura e uno scontrino. Quando entrambe le letture stanno nei
// limiti del campo la funzione NON scegli: ritorna `motivo: "ambiguo"` con le
// due letture, e chi chiama chiede all'utente. Quando invece una sola delle
// due sta nei limiti, l'altra è impossibile per quel campo e non c'è niente
// da indovinare. Un separatore delle migliaia scritto per intero («1.250,75»)
// non è ambiguo e non chiede niente a nessuno.
//
// Ritorna { vuoto, ok, valore, grezzo, letture, motivo }; il messaggio lo
// scrive chi chiama, perché il messaggio giusto dipende dal campo.
// Pura e testabile: nessun DOM.
// ══════════════════════════════════════════════════════════════════════
export const AVVISO_DECIMALE =
  "Va bene sia la virgola sia il punto: «2,4» e «2.4» sono lo stesso numero.";

// un solo punto, esattamente tre cifre dopo, nessuna virgola: le due letture
// (migliaia / decimale) sono entrambe legittime e distano mille volte
const PUNTO_AMBIGUO = /^[-+]?\d{1,3}\.\d{3}$/;

function fuoriLimite(n, opts) {
  if (opts.positivo && !(n > 0)) return "non-positivo";
  if (opts.min != null && n < +opts.min) return "sotto-minimo";
  if (opts.max != null && n > +opts.max) return "sopra-massimo";
  return "";
}

export function numeroDaCampo(testo, opts = {}) {
  const grezzo = String(testo == null ? "" : testo).trim();
  // spazi di ogni specie (anche quelli che Intl usa come separatore) e il
  // simbolo dell'euro, che chi incolla da un altro documento porta con sé
  const pulito = grezzo.replace(/[\s\u00a0\u202f\u2009]/g, "").replace(/\u20ac/g, "");
  if (pulito === "") return { vuoto: true, ok: false, valore: null, grezzo, letture: [], motivo: "vuoto" };
  if (!/^[-+]?[\d.,]+$/.test(pulito))
    return { vuoto: false, ok: false, valore: null, grezzo, letture: [], motivo: "non-numero" };
  const dec = opts.decimali == null ? 2 : Math.max(0, Math.min(6, opts.decimali | 0));
  const p = Math.pow(10, dec);
  const arr = (n) => Math.round(n * p) / p;
  const letture = (PUNTO_AMBIGUO.test(pulito)
    ? [+pulito.replace(".", ""), numIt(pulito)]
    : [numIt(pulito)]).filter(Number.isFinite).map(arr);
  if (!letture.length)
    return { vuoto: false, ok: false, valore: null, grezzo, letture: [], motivo: "non-numero" };
  const cand = letture.map(n => ({ n, fuori: fuoriLimite(n, opts) }));
  const dentro = cand.filter(c => !c.fuori);
  if (letture.length === 2 && dentro.length === 2)
    return { vuoto: false, ok: false, valore: null, grezzo, letture, motivo: "ambiguo" };
  const scelto = dentro.length ? dentro[0] : cand[0];
  return scelto.fuori
    ? { vuoto: false, ok: false, valore: scelto.n, grezzo, letture, motivo: scelto.fuori }
    : { vuoto: false, ok: true, valore: scelto.n, grezzo, letture, motivo: "" };
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

// IMPORT DEL LISTINO DA CSV.
// Perché esiste: fino al 30/07 il listino era l'unica cosa di Conti che si
// poteva solo battere a mano, ed è quella che una cava ha GIÀ in un foglio di
// calcolo. Senza, la prima fattura del primo cliente si fa a mano — cioè
// esattamente la cosa che l'app promette di togliere.
//
// Colonne: nome;unita;prezzo;densita;iva
//
// ⚠️ LA DENSITÀ MANCANTE RESTA MANCANTE. È la decisione che conta di tutta la
// funzione. Un listino vero, nato prima dell'app, spesso la densità non ce
// l'ha; la tentazione è metterci un valore "ragionevole" per far funzionare le
// conversioni. Non si fa: da m³ a tonnellate si passa proprio con quel numero,
// e una densità inventata trasforma un dato mancante in un dato SBAGLIATO che
// nessuno andrà più a controllare — finisce in una fattura e poi in una
// denuncia annuale. Se manca resta `null`, e Conti dice che non può convertire
// (è lo stesso comportamento che il prodotto dimostrativo `p5` fa vedere).
//
// L'unità di prezzo: si accettano le scritture che uno usa davvero — «t»,
// «ton», «tonnellate», «mc», «m3», «m³» — perché un foglio di calcolo altrui
// non conosce le nostre convenzioni. Quello che non si riconosce diventa «t»,
// che è il caso di gran lunga più comune in cava, e resta correggibile a mano.
export function parseListinoCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, unita, prezzo, densita, iva] = parseCsvLine(r);
      const u = (unita || "").trim().toLowerCase().replace(/[.\s]/g, "");
      const pr = numIt(prezzo);
      const de = numIt(densita);
      const iv = numIt(iva);
      return {
        nome: (nome || "").trim(),
        unitaPrezzo: ["mc", "m3", "m³", "metrocubo", "metricubi"].includes(u) ? "m3" : "t",
        /* ⚠️ NIENTE ZERO DI COMODO SUL PREZZO (corretto il 31/07). Prima una
           riga col prezzo illeggibile entrava a ZERO: un prodotto che sembra
           gratis, e lo zero finisce in un DDT e poi in una fattura. È la stessa
           regola già scritta per il prezzo dei ricambi di Flotta — «uno zero
           farebbe sembrare gratis un pezzo che non lo è» — e qui non valeva. */
        prezzo: Number.isFinite(pr) ? Math.max(0, pr) : null,
        // niente valore di comodo: se non c'è, non c'è
        densita: Number.isFinite(de) && de > 0 ? de : null,
        iva: Number.isFinite(iv) && iv >= 0 ? iv : 22,
      };
    })
    /* ⛔ SENZA UN PREZZO LEGGIBILE LA RIGA NON ENTRA, e non è pignoleria: è
       quello che impedisce di caricare per sbaglio il FILE SBAGLIATO.
       Misurato il 31/07: ri-caricando nel listino il prospetto dei prezzi
       (`conti_listino_prezzi.csv`, che ha le colonne in un altro ordine)
       entravano tutti i prodotti con prezzo ZERO e con l'IVA presa dalla
       colonna del prezzo — «Stabilizzato 0/30» con IVA 8,5%. Nessun errore,
       nessun avviso: un listino intero sbagliato, pronto per finire in
       fattura. Adesso in quel file nessuna riga ha un prezzo leggibile nella
       sua colonna, quindi non entra niente e l'app dice quali colonne servono.
       Un prodotto senza prezzo non è vendibile: se serve caricarlo lo stesso,
       si scrive 0 apposta — che è una decisione di chi compila, non nostra. */
    .filter(p => p.nome && p.prezzo != null);
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
               dataSaldo: d, ultimo: null, senzaData: !d,
               giorniPagamento: d ? giorniFraDate(f.emessa, d) : null,
               ritardoPagamento: d ? giorniFraDate(f.scadenza, d) : null };
    }
    return { totale, incassato: 0, residuo: totale, eccedenza: 0,
             saldata: false, parziale: false, movimenti: [], conMovimenti: false,
             dataSaldo: null, ultimo: null, senzaData: false, giorniPagamento: null, ritardoPagamento: null };
  }

  const incassato = round2(movimenti.reduce((t, m) => t + m.importo, 0));
  const residuo = round2(Math.max(0, totale - incassato));
  const eccedenza = round2(Math.max(0, incassato - totale));
  const saldata = residuo === 0;
  const dataSaldo = saldata ? movimenti[movimenti.length - 1].data || null : null;
  return { totale, incassato, residuo, eccedenza,
           saldata, parziale: !saldata && incassato > 0,
           movimenti, conMovimenti: true, dataSaldo,
           ultimo: movimenti[movimenti.length - 1].data || null, senzaData: false,
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
      dataSaldo: s.dataSaldo, ultimoIncasso: s.ultimo, senzaDataIncasso: s.senzaData,
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
// Tiene conto a parte del materiale SENZA densità: le sue tonnellate sono
// vere (le ha pesate la bilancia), i suoi metri cubi no — e quindi né i m³
// né il valore per metro cubo possono comprenderlo.
export function venditePerProdotto(pesate, dal, al) {
  const d1 = String(dal || ""), d2 = String(al || "");
  const per = {};
  for (const p of pesate || []) {
    const d = String(p.data || "");
    if ((d1 && d < d1) || (d2 && d > d2)) continue;
    const nome = String(p.prodotto || "Prodotto");
    const q = quantitaPesata(p);
    const r = per[nome] || (per[nome] = { prodotto: nome, t: 0, m3: 0, valore: 0, viaggi: 0,
      senzaDensita: 0, tSenzaDensita: 0, valoreConvertibile: 0 });
    r.viaggi++; r.t = round2(r.t + q.t);
    const v = valorePesata(p);
    if (q.m3 == null) { r.senzaDensita++; r.tSenzaDensita = round2(r.tSenzaDensita + q.t); }
    else { r.m3 = round3(r.m3 + q.m3); r.valoreConvertibile = round2(r.valoreConvertibile + v); }
    r.valore = round2(r.valore + v);
  }
  return Object.values(per).sort((a, b) => b.valore - a.valore || b.t - a.t);
}

// ============================================================
// CAVATO CONTRO VENDUTO (N6) — il ponte fra Terra e Conti
// ------------------------------------------------------------
// La domanda del titolare: «ho cavato tot, e quanto ne ho venduto? dove sta
// la differenza?». Terra misura in METRI CUBI (rilievi), Conti pesa in
// TONNELLATE (DDT). Per confrontarli serve la DENSITÀ, e l'unica densità
// dichiarata dall'azienda sta nel listino di Conti — per questo il conto vive
// qui e non in Terra: dove sta la densità, sta il confronto.
//
// VERSO DELLA CONVERSIONE — è la scelta che decide se il numero è onesto.
// Si convertono le TONNELLATE VENDUTE IN METRI CUBI, prodotto per prodotto,
// con la densità che ogni DDT si porta dietro (fotografata il giorno della
// consegna). NON si fa il contrario: convertire i m³ cavati in tonnellate
// vorrebbe dire scegliere UNA densità per tutta la cava, cioè inventarla,
// perché il rilievo non sa quale prodotto uscirà da quel volume.
// Un DDT senza densità resta fuori dal confronto in m³ e viene contato a
// parte: le sue tonnellate esistono, i suoi metri cubi no.
//
// AVVERTENZA che l'app deve dire, non nascondere: il rilievo misura il volume
// IN BANCO (il vuoto lasciato dallo scavo), mentre la densità del listino è
// quella con cui si vende. Se è stata misurata sul materiale sciolto e non in
// banco, il confronto porta uno scarto sistematico. Qui non si corregge con
// nessun coefficiente inventato: si scrive.
// ============================================================

// COMPATIBILITÀ: un rilievo senza il campo `provenienza` vale SCAVO. È la
// stessa regola di Terra (provenienzaRilievo in apps/terra/terra-data.js):
// "cumulo" = materiale già cavato in passato e ripreso da un mucchio, quindi
// NON è nuovo scavo e non va sommato al cavato del periodo.
// La provenienza NON si ridefinisce qui. Fino a oggi questa riga era una copia
// della regola di Terra, con un commento che lo dichiarava: due implementazioni
// della stessa cosa, cioè una divergenza in attesa. Adesso la sorgente è
// `provenienzaDi` in `shared/dw-ponti.js`, la stessa che usano Terra e il ponte
// coi turni di Campo.
// ⚠️ Attenzione al VERSO se si tocca questo punto: qui «vero» vuol dire CUMULO,
// cioè materiale già estratto che NON consuma il volume concesso. Invertirlo per
// sbaglio farebbe consumare la concessione a roccia tolta anni fa, e il difetto
// non si vedrebbe da nessuna parte.
const eCumulo = (r) => provenienzaDi(r) === "cumulo";
const dataBuona = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || ""));

// Quanto è stato cavato nel periodo secondo i rilievi di Terra. Contano solo
// i rilievi ELABORATI con un volume: i pianificati sono un'intenzione, non
// una misura. Ritorna null se i rilievi non sono disponibili (Terra non
// raggiungibile): «non lo so» e «zero» sono due risposte diverse.
export function cavatoPeriodo(rilievi, dal, al) {
  if (!Array.isArray(rilievi)) return null;
  const d1 = String(dal || ""), d2 = String(al || "");
  let scavo = 0, cumulo = 0, nScavo = 0, nCumulo = 0, senzaMetodo = 0;
  let primo = null, ultimo = null, pianificati = 0, fuoriPeriodo = 0;
  for (const r of rilievi) {
    const v = +((r || {}).volumeM3);
    const d = String((r || {}).data || "");
    if ((r || {}).stato !== "elaborato" || !Number.isFinite(v) || !dataBuona(d)) {
      if ((r || {}).stato === "pianificato") pianificati++;
      continue;
    }
    if ((d1 && d < d1) || (d2 && d > d2)) { fuoriPeriodo++; continue; }
    if (eCumulo(r)) { cumulo = round3(cumulo + v); nCumulo++; }
    else {
      scavo = round3(scavo + v); nScavo++;
      if (!String(r.metodo || "").trim()) senzaMetodo++;
    }
    if (!primo || d < primo) primo = d;
    if (!ultimo || d > ultimo) ultimo = d;
  }
  return { m3: scavo, cumuloM3: cumulo, rilievi: nScavo, rilieviCumulo: nCumulo,
           senzaMetodo, primo, ultimo, pianificati, fuoriPeriodo };
}

// Quanto è stato venduto nel periodo secondo i DDT: tonnellate (sempre),
// metri cubi (solo dove la densità c'era) e valore.
export function vendutoPeriodo(pesate, dal, al) {
  const prodotti = venditePerProdotto(pesate, dal, al);
  let t = 0, m3 = 0, valore = 0, valoreConvertibile = 0, viaggi = 0,
      tSenzaDensita = 0, viaggiSenzaDensita = 0;
  for (const p of prodotti) {
    t = round2(t + p.t); m3 = round3(m3 + p.m3);
    valore = round2(valore + p.valore);
    valoreConvertibile = round2(valoreConvertibile + p.valoreConvertibile);
    viaggi += p.viaggi;
    tSenzaDensita = round2(tSenzaDensita + p.tSenzaDensita);
    viaggiSenzaDensita += p.senzaDensita;
  }
  const tConvertite = round2(t - tSenzaDensita);
  return {
    t, m3, valore, valoreConvertibile, viaggi, tSenzaDensita, tConvertite,
    viaggiSenzaDensita, prodotti,
    // quota di tonnellate che è stato possibile convertire in m³ (0–100)
    copertura: t > 0 ? round2(100 * tConvertite / t) : null,
    // densità media di quello che è uscito davvero dal cancello (t/m³).
    // È una VERIFICA del listino, non si usa per convertire il cavato.
    densitaMedia: m3 > 0 ? round3(tConvertite / m3) : null,
    // prezzo medio realizzato al metro cubo, sul solo venduto convertibile
    prezzoMedioM3: m3 > 0 ? round2(valoreConvertibile / m3) : null,
  };
}

// Soglie del giudizio sul divario, in % del cavato. Non sono legge: sono la
// distanza oltre la quale la differenza non si spiega più con lo sfrido e le
// tolleranze di misura, e conviene andare a guardare.
export const SOGLIA_DIVARIO = { coerente: 10, attenzione: 35 };

// IL CONFRONTO. Ritorna sempre uno `stato` che dice come va letto il numero:
//   no-terra     · i rilievi non arrivano: senza cavato non c'è confronto
//   no-cavato    · nel periodo non c'è nessun rilievo elaborato con volume
//   no-venduto   · nel periodo non c'è nessun DDT
//   no-densita   · ci sono DDT ma nessuno convertibile: manca la densità
//   coerente     · divario dentro il ±10% del cavato
//   attenzione   · divario fra il 10% e il 35%
//   implausibile · divario oltre il 35%: non è sfrido, è un errore da cercare
//   disavanzo    · venduto MAGGIORE del cavato: non sono scorte, è un buco
// `divario` è cavato − venduto in m³: quando è positivo è la stima di quanto
// è rimasto a piazzale, mai un dato misurato.
export function riconciliazione(rilievi, pesate, dal, al) {
  const cav = cavatoPeriodo(rilievi, dal, al);
  const ven = vendutoPeriodo(pesate, dal, al);
  const base = { cav, ven, divario: null, pct: null,
                 parziale: ven.viaggiSenzaDensita > 0, copertura: ven.copertura };
  if (cav === null) return { ...base, stato: "no-terra" };
  if (!cav.rilievi || !(cav.m3 > 0)) return { ...base, stato: "no-cavato" };
  if (!ven.viaggi) return { ...base, stato: "no-venduto" };
  if (!(ven.m3 > 0)) return { ...base, stato: "no-densita" };
  const divario = round3(cav.m3 - ven.m3);
  const pct = round2(100 * divario / cav.m3);
  const stato = divario < 0 ? "disavanzo"
    : pct <= SOGLIA_DIVARIO.coerente ? "coerente"
    : pct <= SOGLIA_DIVARIO.attenzione ? "attenzione"
    : "implausibile";
  return { ...base, stato, divario, pct };
}

// Valore del cavato a un prezzo di riferimento (€/m³): quanto varrebbe il
// materiale tolto dal fronte se venduto tutto a quel prezzo. NON è un ricavo
// e non va confrontato col fatturato: è un ordine di grandezza. null se il
// prezzo non c'è (per esempio un prodotto a €/t senza densità).
export function valoreCavato(m3, prezzoM3) {
  const v = +m3, p = +prezzoM3;
  if (!Number.isFinite(v) || v < 0 || !Number.isFinite(p) || p <= 0) return null;
  return round2(v * p);
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
      // ── PONTE CON TERRA — SOLA LETTURA ────────────────────────────────
      // Seconda istanza dell'SDK sull'app "terra", stessa organizzazione:
      // il percorso lo costruisce orgCollection, come per i dati di Conti.
      // Si apre solo quando serve (la prima volta che si guarda il
      // confronto), così l'avvio di Conti non rallenta. Se Terra non c'è, o
      // se la lettura non è permessa, si torna null: l'app dirà che il
      // cavato non è disponibile, senza inventare uno zero.
      let idTerra;                       // undefined = mai provato, null = non c'è
      api.rilieviTerra = async () => {
        if (idTerra === undefined) {
          try { idTerra = await DeepworkID.init({ appId: "terra" }); }
          catch (e) { idTerra = null; }
        }
        if (!idTerra) return null;
        try {
          return (await getDocs(idTerra.orgCollection("rilievi")))
            .docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
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
      // in dimostrazione i rilievi non arrivano da Terra: sono finti, ma
      // coerenti con le pesate d'esempio (vedi DEMO.rilieviTerra)
      rilieviTerra: async () => mem.rilieviTerra || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) Object.assign(x, d); },
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
