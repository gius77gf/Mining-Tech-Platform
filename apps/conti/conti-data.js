// ============================================================
// Conti — accesso dati (C4). Schema condiviso (orgCollection da
// autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/conti/):
//   fatture/{id}: { numero, cliente, clienteId?, importo, emessa (ISO), scadenza (ISO), incassata (bool),
//                   imponibile?, ivaImporto?, totale?, righe? [], ddtIds? [], tipo? }
//   clienti/{id}: { ragioneSociale, piva, sdi (codice destinatario o PEC), indirizzo,
//                   sconto (%), fido (€), note }
//   gare/{id}:    { titolo, base, scadenza (ISO), stato: aperta|vinta|persa }
//   prodotti/{id}:{ nome, unitaPrezzo: "t"|"m3", prezzo (€/unità), densita (t/m³), iva (%),
//                   scaglioni?: [{ da (quantità nell'unità del listino), prezzo (€/unità) }]
//                               oppure [{ da, sconto (%) }] — prezzi a scaglioni
//                               di quantità. Facoltativo: i prodotti di prima
//                               non ce l'hanno e si comportano esattamente come
//                               prima (nessuna banda = listino pieno) }
//   pesate/{id}:  { numero (progressivo per anno), data (ISO), clienteId, cliente,
//                   prodottoId, prodotto, lordo (t), tara (t), netto (t),
//                   unitaVendita "t"|"m3", quantita (nell'unità di vendita), densita,
//                   prezzoUnitario (€/unità di vendita), aliquotaIva (%),
//                   mezzo (targa), destinatario, fatturaId|null,
//                   ordineId?|null (l'ordine del cliente a cui la consegna
//                   scala: facoltativo, le pesate di prima non ce l'hanno) }
//   ordini/{id}:  { numero (PREV/AAAA/NNN), numeroOrdine? (ORD/AAAA/NNN, dato
//                   all'accettazione), data (ISO), validoAl (ISO|null),
//                   clienteId?, cliente (testo), stato: bozza|inviato|
//                   accettato|rifiutato|annullato, decisoIl? (ISO),
//                   riferimento, note, righe [{ prodottoId, descrizione,
//                   quantita|null, unita "t"|"m3", densita, prezzoUnitario|
//                   null, scontoPct, aliquota, imponibile|null }] }
//   incassi/{id}:  { fatturaId, data (ISO: il giorno in cui i soldi sono ARRIVATI),
//                    importo (€), metodo ("bonifico"|"assegno"|"contanti"|"riba"|"") }
//   costi/{id}:    { data (ISO), voce (chiave di VOCI_COSTO), importo (€), nota,
//                    registratoIl? (ISO: il giorno in cui è stato BATTUTO, non
//                    quello del documento — serve a riconoscere le voci
//                    arrivate dopo la chiusura del mese) }
//   chiusure/{id}: { mese ("AAAA-MM"), chiusoIl (ISO), vociAssenti [chiavi],
//                    nota } — «per questo mese ho finito di inserire». NON è un
//                    lucchetto: un costo arrivato dopo si registra lo stesso.
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

import { parseCsvLine, leggiCsv, numIt, giorniTra, isIntestazione, dataISOEsiste,
         AVVISO_DECIMALE as AVVISO_DECIMALE_SHELL } from "../../shared/deepwork-id-client/dw-shell.js";
import { provenienzaDi, misuratoPeriodo } from "../../shared/dw-ponti.js";
/* la classificazione dei costi vive in shared/ perché serve anche a Flotta:
   qui si RI-ESPORTA, non si riscrive. Un alias non è una seconda
   implementazione — è la regola che è costata una giornata sui numeri. */
/* ⚠️ `export … from` RI-ESPORTA ma NON lega il nome in questo modulo: è un
   passaggio, non un import. `riepilogoCosti` qui sotto usa `gruppoDiVoce`,
   quindi serve anche l'import vero — con `export … from` da solo il modulo
   si carica e muore alla prima chiamata, senza errori di sintassi. */
export { VOCI_COSTO, voceCosto, gruppoDiVoce } from "../../shared/dw-ponti.js";
import { gruppoDiVoce, VOCI_COSTO } from "../../shared/dw-ponti.js";

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
    /* f7: LA FATTURA SENZA SCADENZA — il caso su cui l'app diceva le cose più
       tranquillizzanti che sapesse dire: badge verde «Regolare», fascia «non
       scaduto», e nell'età media del credito contata **zero giorni**, col suo
       posto al denominatore (misurato: 92 gg → 46 gg, e la frase accanto
       passava a «sotto controllo»). È il caso per cui esistono
       `statoScadenzaFattura` e la fascia `senzaScadenza`, e adesso si VEDE.
       ⚠️ Fino al 01/08 non poteva stare qui: `run-demo.mjs` pretendeva che ogni
       fattura dimostrativa avesse emissione e scadenza valide, quindi la
       dimostrazione non poteva contenere proprio il caso che il prodotto era
       appena stato costruito per raccontare. Quella regola adesso distingue un
       dato CORROTTO (che deve cadere) da un dato ASSENTE (che è uno stato che
       l'app sa dire). Emessa c'è, scadenza no: è come arrivano dagli import. */
    { id: "f7", numero: "2026/037", cliente: "Cave del Sud", importo: 4400, emessa: "2026-06-18", scadenza: null, incassata: false },
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
    /* ⛔ LA GARA APERTA SENZA BASE D'ASTA. Il Quadro somma le basi delle gare
       aperte, e il commento accanto a quella riga dice già la regola: «un
       totale parziale che non dice di esserlo è un totale che inganna». La
       riga sa dichiararlo — «(1 senza base)» — ma tutte e quattro le gare
       d'esempio la base ce l'avevano, quindi non lo diceva mai.
       È un'ASSENZA, ed è additiva: la somma delle basi non si muove, sale il
       numero delle aperte e compare il conto di quelle non sommabili. Storia
       vera: il bando è uscito, l'importo a base d'asta si legge negli
       allegati e non è ancora stato trascritto. */
    { id: "g5", titolo: "Consorzio ASI — forniture 2027 (bando appena uscito)", base: null, scadenza: "2026-09-15", stato: "aperta" },
  ],
  // listino d'esempio: un prodotto venduto a metro cubo (sabbia) accanto a
  // quelli venduti a tonnellata, così si vede subito a cosa serve la densità.
  prodotti: [
    /* p1 porta una scala a SCONTI, p2 una scala a PREZZI: sono le due forme
       che il listino sa dire, e la dimostrazione le fa vedere tutt'e due
       accanto. p3 e p4 non hanno scaglioni — è la maggioranza dei prodotti, e
       si comportano esattamente come prima. */
    { id: "p1", nome: "Stabilizzato 0/30", unitaPrezzo: "t",  prezzo: 8.5,  densita: 1.9, iva: 22,
      scaglioni: [{ da: 250, sconto: 4 }, { da: 1000, sconto: 7 }] },
    { id: "p2", nome: "Pietrisco 8/12",    unitaPrezzo: "t",  prezzo: 12,   densita: 1.5, iva: 22,
      scaglioni: [{ da: 100, prezzo: 11.2 }, { da: 500, prezzo: 10.5 }] },
    { id: "p3", nome: "Sabbia lavata 0/4", unitaPrezzo: "m3", prezzo: 22,   densita: 1.6, iva: 22 },
    { id: "p4", nome: "Massi da scogliera",unitaPrezzo: "t",  prezzo: 15.5, densita: 2.4, iva: 22 },
    // p5: prodotto VECCHIO senza densità dichiarata (il form oggi la pretende,
    // ma un listino nato prima può averne). Sta qui apposta: fa vedere cosa
    // succede quando la densità manca — Conti non converte e lo dice.
    // ⛔ E CON UNA SCALA ADDOSSO fa vedere il caso peggiore: ordinato in metri
    // cubi, lo scaglione NON si può scegliere — e Conti non ripiega né sulla
    // banda più bassa «per prudenza» né sul listino pieno, dice che non lo sa.
    { id: "p5", nome: "Misto di cava (non classificato)", unitaPrezzo: "t", prezzo: 6.5, densita: null, iva: 22,
      scaglioni: [{ da: 200, prezzo: 6 }] },
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
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: "storico",
      /* ⛔ Causale e «a cura di» NON stanno su tutte le pesate d'esempio, e non
         e' una dimenticanza: fino al 01/08 il foglio le dichiarava FISSE
         («Vendita», «a cura del mittente») su ogni DDT, e nessuno poteva
         accorgersene. Qui la prima e' compilata, s4 e' a cura di un vettore, e
         le altre restano vuote — cosi' si vede il riquadro «questo documento
         non e' completo» invece di un DDT che sembra a posto. */
      causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "s2", numero: "2026/002", data: "2026-03-09", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p2", prodotto: "Pietrisco 8/12", lordo: 40, tara: 13.8, netto: 26.2,
      unitaVendita: "t", quantita: 26.2, densita: 1.5, prezzoUnitario: 12, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: "storico" },
    { id: "s3", numero: "2026/003", data: "2026-04-14", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 43.3, tara: 14.2, netto: 29.1,
      unitaVendita: "t", quantita: 29.1, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Cantiere SS115 km 12", fatturaId: "storico", causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "s4", numero: "2026/004", data: "2026-05-08", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 36, tara: 13.6, netto: 22.4,
      unitaVendita: "m3", quantita: 14, densita: 1.6, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: "storico",
      // il trasporto a cura di un VETTORE terzo, col suo nome: e' l'unico caso
      // in cui il foglio deve scrivere chi trasporta al posto del mittente
      causaleTrasporto: "vendita", trasportoACura: "vettore", vettore: "Autotrasporti Ragusa Srl" },
    { id: "s5", numero: "2026/005", data: "2026-06-05", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p4", prodotto: "Massi da scogliera", lordo: 45.3, tara: 15.1, netto: 30.2,
      unitaVendita: "t", quantita: 30.2, densita: 2.4, prezzoUnitario: 15.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Molo di Pozzallo", fatturaId: "storico", causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "s6", numero: "2026/006", data: "2026-06-22", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42, tara: 14.2, netto: 27.8,
      unitaVendita: "t", quantita: 27.8, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: "storico", causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "d1", numero: "2026/007", data: "2026-07-06", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 42.16, tara: 14.2, netto: 27.96,
      unitaVendita: "t", quantita: 27.96, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", ordineId: "o1", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "d2", numero: "2026/008", data: "2026-07-13", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p2", prodotto: "Pietrisco 8/12", lordo: 39.4, tara: 13.8, netto: 25.6,
      unitaVendita: "t", quantita: 25.6, densita: 1.5, prezzoUnitario: 12, aliquotaIva: 22,
      mezzo: "FT 421 KP", destinatario: "Cantiere SS115 km 12", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "d3", numero: "2026/009", data: "2026-07-17", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p1", prodotto: "Stabilizzato 0/30", lordo: 43.9, tara: 14.2, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 1.9, prezzoUnitario: 8.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Cantiere SS115 km 12", ordineId: "o1", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "vettore" },
    { id: "d4", numero: "2026/010", data: "2026-07-20", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 35.2, tara: 13.6, netto: 21.6,
      unitaVendita: "m3", quantita: 13.5, densita: 1.6, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" },
    { id: "d5", numero: "2026/011", data: "2026-07-24", clienteId: "c1", cliente: "Edilcave Srl",
      prodottoId: "p4", prodotto: "Massi da scogliera", lordo: 44.8, tara: 15.1, netto: 29.7,
      unitaVendita: "t", quantita: 29.7, densita: 2.4, prezzoUnitario: 15.5, aliquotaIva: 22,
      mezzo: "GA 907 TR", destinatario: "Molo di Pozzallo", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" },
    // d6: DDT del prodotto SENZA densità. Le tonnellate ci sono (le ha pesate
    // la bilancia), i metri cubi no: non si inventano. Serve a far vedere che
    // il confronto col cavato si ferma e spiega, invece di stimare.
    { id: "d6", numero: "2026/012", data: "2026-07-27", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p5", prodotto: "Misto di cava (non classificato)", lordo: 40.7, tara: 14.3, netto: 26.4,
      unitaVendita: "t", quantita: 26.4, densita: null, prezzoUnitario: 6.5, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null, causaleTrasporto: "vendita", trasportoACura: "mittente" },
    /* ⛔ VENDUTA A METRO CUBO E SENZA DENSITÀ: i m³ non si possono calcolare
       dalle tonnellate, e la riga scrive «quantità non calcolabile» invece di
       tirare a indovinare una densità. Il form la blocca in scrittura — ci si
       arriva da un import o da un dato vecchio — ma il caso esiste, e finché
       non stava in dimostrazione quella frase non la vedeva nessuno.
       ⚠️ È LOCALE: una riga su tredici. Il criterio scritto il 01/08 dice che
       un caso da dimostrare deve poter mancare senza portarsi via il resto —
       questo lo rispetta, il «residuo non calcolabile» di Terra no. */
    { id: "d7", numero: "2026/013", data: "2026-07-29", clienteId: "c2", cliente: "Stradesud",
      prodottoId: "p3", prodotto: "Sabbia lavata 0/4", lordo: 38.2, tara: 13.9, netto: 24.3,
      unitaVendita: "m3", quantita: null, densita: null, prezzoUnitario: 22, aliquotaIva: 22,
      mezzo: "DR 118 XS", destinatario: "Piazzale Modica", fatturaId: null,
      causaleTrasporto: "vendita", trasportoACura: "mittente" },
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
  // REGISTRO COSTI d'esempio. Tre righe stanno qui apposta perché fanno vedere
  // cosa succede quando il dato non è pulito — che è la condizione normale del
  // primo mese di uso, e l'app deve dirlo invece di nasconderlo:
  //  · c8 ha una voce che NON è nell'elenco → finisce fra le «non classificate»,
  //    non fra le spese generali (una voce che nessuno ha scelto);
  //  · c9 è senza data → non sparisce dal periodo in silenzio, si conta a parte;
  //  · c1/c4 sono voci `daMezzo`: Flotta le registra già, e chi somma deve
  //    saperlo per non contarle due volte.
  costi: [
    // GENNAIO–LUGLIO, con le voci che tornano ogni mese: è così che si presenta
    // il registro di una cava vera, e serve anche a far vedere la CHIUSURA DEL
    // MESE — che senza voci ricorrenti non ha niente da chiedere.
    { id: "c01", data: "2026-02-05", voce: "personale", importo: 55, nota: "Squadra di fronte, febbraio" },
    { id: "c02", data: "2026-02-14", voce: "carburante", importo: 26, nota: "Gasolio pala e dumper" },
    { id: "c03", data: "2026-02-28", voce: "energia", importo: 62, nota: "Bolletta impianto, gen-feb" },
    { id: "c04", data: "2026-03-05", voce: "personale", importo: 58, nota: "Squadra di fronte, marzo" },
    { id: "c05", data: "2026-03-13", voce: "carburante", importo: 24, nota: "Gasolio, rifornimento" },
    { id: "c06", data: "2026-03-18", voce: "esplosivo", importo: 48, nota: "Volata del 18 marzo" },
    { id: "c07", data: "2026-03-26", voce: "manutenzione", importo: 40, nota: "Denti benna + filtri" },
    { id: "c08", data: "2026-04-06", voce: "personale", importo: 60, nota: "Squadra di fronte, aprile" },
    { id: "c09", data: "2026-04-15", voce: "carburante", importo: 28, nota: "Gasolio, rifornimento" },
    { id: "c10", data: "2026-04-30", voce: "energia", importo: 66, nota: "Bolletta impianto, mar-apr" },
    { id: "c11", data: "2026-04-22", voce: "lavorazione", importo: 100, nota: "Vagliatura conto terzi" },
    { id: "c12", data: "2026-05-06", voce: "personale", importo: 57, nota: "Squadra di fronte, maggio" },
    { id: "c13", data: "2026-05-14", voce: "carburante", importo: 25, nota: "Gasolio, rifornimento" },
    { id: "c14", data: "2026-05-21", voce: "esplosivo", importo: 52, nota: "Volata del 20 maggio" },
    { id: "c15", data: "2026-06-04", voce: "personale", importo: 62, nota: "Squadra di fronte, giugno" },
    { id: "c16", data: "2026-06-12", voce: "carburante", importo: 27, nota: "Gasolio, rifornimento" },
    { id: "c17", data: "2026-06-25", voce: "manutenzione", importo: 34, nota: "Tagliando escavatore" },
    { id: "c18", data: "2026-06-30", voce: "energia", importo: 70, nota: "Bolletta impianto, mag-giu" },
    { id: "c19", data: "2026-06-30", voce: "canone", importo: 98, nota: "Canone di escavazione, primo semestre" },
    // ⛔ voce FUORI ELENCO: finisce fra le «non classificate», non fra le spese
    //    generali — un'etichetta che nessuno ha scelto
    { id: "c20", data: "2026-06-30", voce: "consulenze", importo: 60, nota: "Perizia geologica (voce fuori elenco)" },
    { id: "c21", data: "2026-07-06", voce: "personale", importo: 59, nota: "Squadra di fronte, luglio" },
    { id: "c22", data: "2026-07-16", voce: "carburante", importo: 30, nota: "Gasolio, secondo rifornimento" },
    { id: "c23", data: "2026-07-20", voce: "lavorazione", importo: 105, nota: "Frantumazione conto terzi" },
    { id: "c24", data: "2026-07-25", voce: "generali", importo: 88, nota: "Assicurazioni e amministrazione" },
    // ⛔ SENZA DATA: non sparisce da un periodo in silenzio, si conta a parte
    { id: "c25", data: "", voce: "ripristino", importo: 120, nota: "Fattura del vivaista, data da recuperare" },
    /* A luglio manca l'ENERGIA, che negli altri mesi c'è tre volte su cinque:
       è la riga che la chiusura del mese chiede di confermare. */
  ],
  // canone di escavazione: l'aliquota NON è cablata, cambia da regione a regione.
  impostazioni: [
    { id: "s1", canoneUnita: "m3", canoneAliquota: 0.55, canoneNota: "Valore di esempio: metti la tariffa della tua concessione.",
      // intestazione dei documenti stampati (DDT e fatture): dati d'esempio
      aziendaNome: "Cava di esempio S.r.l.", aziendaPiva: "00000000000",
      aziendaIndirizzo: "Contrada Esempio 1, Ragusa", aziendaContatti: "0932 000000 · amministrazione@esempio.it" },
  ],
  /* PREVENTIVI E ORDINI d'esempio. ⛔ Come per la fattura senza scadenza, la
     dimostrazione DEVE contenere i casi che il prodotto esiste per raccontare,
     non solo quelli che funzionano: qui ci sono l'offerta scaduta che nessuno
     ha richiamato, quella arrivata da un import senza data di validità, la
     fornitura a chiamata di cui il consegnato NON è misurabile, e l'ordine a
     zero con dei DDT dello stesso cliente che nessuno ha agganciato. Un
     campione di soli casi sani è un campione che non mostra niente. */
  ordini: [
    { id: "o1", numero: "PREV/2026/001", numeroOrdine: "ORD/2026/001", data: "2026-06-15",
      validoAl: "2026-07-15", clienteId: "c1", cliente: "Edilcave Srl", stato: "accettato",
      decisoIl: "2026-06-28", riferimento: "Richiesta del 12/06 — cantiere SS115",
      note: "Consegne scaglionate su tutta l'estate, a chiamata del capocantiere.",
      righe: [{ prodottoId: "p1", descrizione: "Stabilizzato 0/30", quantita: 300, unita: "t",
        densita: 1.9, prezzoUnitario: 8.5, scontoPct: 5, aliquota: 22, imponibile: 2422.5 }] },
    { id: "o2", numero: "PREV/2026/002", data: "2026-07-20", validoAl: "2026-08-20",
      clienteId: "c2", cliente: "Stradesud", stato: "inviato", riferimento: "Mail del 18/07",
      note: "", righe: [
        { prodottoId: "p3", descrizione: "Sabbia lavata 0/4", quantita: 200, unita: "m3",
          densita: 1.6, prezzoUnitario: 22, scontoPct: 0, aliquota: 22, imponibile: 4400 },
        { prodottoId: "p2", descrizione: "Pietrisco 8/12", quantita: 80, unita: "t",
          densita: 1.5, prezzoUnitario: 12, scontoPct: 0, aliquota: 22, imponibile: 960 }] },
    /* ⛔ SCADUTA E NESSUNO L'HA RICHIAMATA. Il prezzo si era tenuto fermo per
       un mese, il mese è passato e l'offerta è morta da sola. È il caso per cui
       esiste `preventiviDaSeguire`: senza, sparisce in fondo alla lista. */
    { id: "o3", numero: "PREV/2026/003", data: "2026-06-10", validoAl: "2026-07-15",
      cliente: "Comune di Modica", stato: "inviato", riferimento: "Prot. 4412 del 08/06", note: "",
      righe: [{ prodottoId: "p4", descrizione: "Massi da scogliera", quantita: 500, unita: "t",
        densita: 2.4, prezzoUnitario: 15.5, scontoPct: 0, aliquota: 22, imponibile: 7750 }] },
    { id: "o4", numero: "PREV/2026/004", data: "2026-05-04", validoAl: "2026-06-04",
      clienteId: "c2", cliente: "Stradesud", stato: "rifiutato", decisoIl: "2026-05-22",
      riferimento: "", note: "Prezzo fuori mercato rispetto alla cava di Comiso.",
      righe: [{ prodottoId: "p1", descrizione: "Stabilizzato 0/30", quantita: 1000, unita: "t",
        densita: 1.9, prezzoUnitario: 9.2, scontoPct: 0, aliquota: 22, imponibile: 9200 }] },
    /* ⛔ FORNITURA A CHIAMATA: prezzo bloccato, quantità da vedersi. Il
       consegnato NON è «0%» — non esiste un ordinato con cui fare la frazione.
       È il caso su cui una barra di avanzamento direbbe la bugia più comoda. */
    { id: "o5", numero: "PREV/2026/005", numeroOrdine: "ORD/2026/002", data: "2026-07-02",
      validoAl: "2026-08-02", clienteId: "c1", cliente: "Edilcave Srl", stato: "accettato",
      decisoIl: "2026-07-08", riferimento: "Accordo quadro 2026",
      note: "Prezzo bloccato fino a fine anno, quantità a chiamata.",
      righe: [{ prodottoId: "p2", descrizione: "Pietrisco 8/12", quantita: null, unita: "t",
        densita: 1.5, prezzoUnitario: 11.5, scontoPct: 5, aliquota: 22, imponibile: null }] },
    /* ⛔ ZERO CONSEGNATO, MA IL DDT 2026/010 È DELLO STESSO CLIENTE E DELLO
       STESSO PRODOTTO e non è agganciato a nessun ordine: lo zero è vero e
       probabilmente è una svista. Si dice, e si offre di collegarlo. */
    { id: "o6", numero: "PREV/2026/006", numeroOrdine: "ORD/2026/003", data: "2026-07-01",
      validoAl: "2026-07-31", clienteId: "c2", cliente: "Stradesud", stato: "accettato",
      decisoIl: "2026-07-05", riferimento: "", note: "",
      righe: [{ prodottoId: "p3", descrizione: "Sabbia lavata 0/4", quantita: 100, unita: "m3",
        densita: 1.6, prezzoUnitario: 22, scontoPct: 0, aliquota: 22, imponibile: 2200 }] },
    /* ⛔ SENZA DATA DI VALIDITÀ. Arriva così dai vecchi fogli: un'offerta
       mandata e mai datata. Non è «valida»: è un prezzo bloccato per sempre,
       e in cava gli inerti si muovono col gasolio. */
    { id: "o7", numero: "PREV/2026/007", data: "2026-07-11", validoAl: null,
      clienteId: "c1", cliente: "Edilcave Srl", stato: "inviato", riferimento: "", note: "",
      righe: [{ prodottoId: "p4", descrizione: "Massi da scogliera", quantita: 120, unita: "t",
        densita: 2.4, prezzoUnitario: 15.5, scontoPct: 5, aliquota: 22, imponibile: 1767 }] },
    /* ⛔ L'ORDINE CHE ARRIVA ALLO SCAGLIONE PIÙ ALTO, e che fa vedere la
       composizione: 800 t di Pietrisco cadono nella banda «da 500 t» (10,50
       €/t invece di 12,00 di listino) e sopra ci va il 5% di Edilcave. Le due
       cose stanno in due colonne diverse del documento e per questo non si
       pestano i piedi: 800 × 10,50 − 5% = 7.980 €. La riga porta con sé quale
       banda ha usato, fotografata come il prezzo: se domani il listino cambia,
       l'offerta già mandata resta questa e sa ancora dire perché. */
    { id: "o8", numero: "PREV/2026/008", numeroOrdine: "ORD/2026/004", data: "2026-07-18",
      validoAl: "2026-08-17", clienteId: "c1", cliente: "Edilcave Srl", stato: "accettato",
      decisoIl: "2026-07-24", riferimento: "Fornitura sottofondo — lotto 2",
      note: "Prezzo da scaglione: 800 t superano la soglia delle 500.",
      righe: [{ prodottoId: "p2", descrizione: "Pietrisco 8/12", quantita: 800, unita: "t",
        densita: 1.5, prezzoUnitario: 10.5, scontoPct: 5, aliquota: 22, imponibile: 7980,
        scaglione: { da: 500, a: null, unita: "t", tipo: "prezzo", prezzo: 10.5, sconto: 0 },
        scontoCliente: 5, scontoScaglione: 0, motivoSenzaPrezzo: "" }] },
  ],
};

// ⛔ Alias di `giorniTra`: lo stesso involucro di due righe era scritto anche
// in Sentinella. Un alias non è una seconda implementazione.
export const giorni = giorniTra;

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
// ⛔ RI-ESPORTATA, non ridichiarata: era scritta alla lettera in quattro
// moduli dati. Un alias non è una seconda implementazione.
// Vedi docs/NUMERI_MESSAGGIO_DOPPIO_202608.md
export const AVVISO_DECIMALE = AVVISO_DECIMALE_SHELL;

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

export function kpiFrom(fatture, gare, oggi = new Date(), note = null) {
  const aperte = fatture.filter(f => !f.incassata);
  // apertoDi: con un acconto registrato conta il RESIDUO, non il totale della
  // fattura. Senza incassi registrati residuo = importo, quindi il numero è
  // identico a quello di prima.
  const daIncassare = aperte.reduce((t, f) => t + apertoDi(f, note), 0);
  const inScadenza = aperte.filter(f => giorni(f.scadenza, oggi) <= 10).length;
  const gareAperte = gare.filter(g => g.stato === "aperta").length;
  // Età media del credito aperto: media dei giorni dall'emissione sulle fatture NON
  // ancora incassate. NON è il DSO (Days Sales Outstanding = crediti/vendite×giorni):
  // è l'anzianità media dei crediti aperti, onesta e utile per capire quanto "vecchio"
  // è il credito che l'azienda ha in giro. (DSO vero → roadmap: serve il fatturato del periodo.)
  /* ⛔ UNA FATTURA SENZA DATA D'EMISSIONE NON HA ZERO GIORNI DI VITA. Fino a ieri
     la riga era `Math.max(0, -giorni(f.emessa, oggi) || 0)`: su una
     fattura senza `emessa` — l'import da CSV le produce, `parseFattureCsv`
     lascia `emessa: null` quando la colonna è vuota — `giorni` risponde NaN,
     `-NaN || 0` fa ZERO, e quello zero entrava nella media CON il suo posto al
     denominatore. Misurato: due fatture da 92 giorni più una senza data danno
     **46** invece di 92, cioè l'indicatore si dimezza e la scritta accanto
     passa da «sopra i 45 giorni» a «sotto controllo». L'assenza travestita da
     credito giovane, e sempre nel verso che tranquillizza.
     Adesso la guardia sta PRIMA della conversione (`Number.isFinite`, che su
     zero risponde vero e quindi da sola non basterebbe), le non databili si
     contano a parte, e senza nemmeno una fattura misurabile la risposta è
     `null` — «non lo so», che è diverso da «zero giorni». */
  let etaTot = 0, etaConto = 0, etaSenzaData = 0;
  for (const f of aperte) {
    const g = giorni(f.emessa, oggi);
    if (!Number.isFinite(g)) { etaSenzaData++; continue; }
    etaTot += Math.max(0, -g); etaConto++;
  }
  return { daIncassare, inScadenza, gareAperte,
           etaCredito: etaConto ? Math.round(etaTot / etaConto) : null,
           etaConto, etaSenzaData };
}

/* ⛔ LO STATO DELLA SCADENZA DI UNA FATTURA, in un posto solo e testabile.
   Serviva perché la pagina lo calcolava DUE volte a mano (il badge dell'elenco
   e la striscia colorata della riga), tutt'e due con `giorni(f.scadenza)` letto
   crudo: e `giorni` di una scadenza che non c'è risponde NaN, che non è né
   `< 0` né `<= 10`. Risultato: una fattura SENZA SCADENZA cadeva nell'ultimo
   ramo e usciva col badge verde «Regolare» — la stessa forma esatta del
   requisito senza righe in scadenzario dato per «regolare» in Scudo.
   «senza-scadenza» non è un allarme (nessuno è in ritardo: non si sa quando
   dovrebbe pagare) ed è per quello che vive come stato a sé. */
export function statoScadenzaFattura(fattura, oggi = new Date()) {
  const g = giorni((fattura || {}).scadenza, oggi);
  if (!Number.isFinite(g)) return { stato: "senza-scadenza", giorni: null };
  if (g < 0) return { stato: "insoluta", giorni: g };
  if (g <= 10) return { stato: "in-scadenza", giorni: g };
  return { stato: "regolare", giorni: g };
}

// Aging degli incassi: suddivide le fatture NON incassate per fasce di
// ritardo rispetto alla scadenza (giorni negativi = scaduto). È lo
// strumento amministrativo con cui si capisce quanto credito è "vecchio"
// e va sollecitato per primo. Ogni fascia: numero fatture + importo.
export function agingIncassi(fatture, oggi = new Date(), note = null) {
  const b = {
    nonScaduto: { conto: 0, importo: 0 },
    g1_30:      { conto: 0, importo: 0 },
    g31_60:     { conto: 0, importo: 0 },
    g61_90:     { conto: 0, importo: 0 },
    oltre90:    { conto: 0, importo: 0 },
    // ⛔ NÉ SCADUTA NÉ NON SCADUTA: vedi qui sotto.
    senzaScadenza: { conto: 0, importo: 0 },
  };
  for (const f of fatture) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    // quello che pesa nell'aging è ciò che RESTA da incassare: un acconto già
    // arrivato non è più credito scaduto
    const imp = apertoDi(f, note);
    let k;
    /* ⛔ UNA FATTURA SENZA SCADENZA HA UN SECCHIO SUO. Fino a ieri finiva in
       «non scaduto», con la motivazione — giusta a metà — che non bisogna
       gonfiare lo scaduto. Ma «non scaduto» è la fascia TRANQUILLA: un credito
       di cui nessuno sa quando dovrebbe rientrare veniva contato, in verde,
       insieme a quello nei termini, e nulla nel risultato diceva che era lì.
       È la stessa cosa dell'appello di Campo: chi nessuno ha spuntato non si
       conta né presente né assente. Le fatture senza scadenza esistono davvero
       — `parseFattureCsv` lascia `scadenza: null` quando la colonna del file è
       vuota — e la risposta giusta è farle vedere per quello che sono, così
       chi le trova ci scrive la data. Lo `scadutoTot` non cambia di un
       centesimo: quella metà della vecchia decisione resta. */
    if (!Number.isFinite(g)) k = "senzaScadenza";
    else if (g >= 0) k = "nonScaduto";
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
        /* ⚠️ NIENTE ZERO DI COMODO SULLA BASE D'ASTA (31/07). La base viene
           SOMMATA: `gareRiepilogo` calcola il valore delle gare aperte, vinte
           e perse. Una base illeggibile messa a zero abbassa quei totali in
           silenzio — il titolare guarda «quanto vale quello per cui stiamo
           correndo» e vede un numero più piccolo del vero, senza sapere
           perché. A differenza del prezzo di un prodotto, però, una gara SENZA
           base è legittima (a volte non è ancora pubblicata): la gara entra, la
           base resta vuota, e chi somma la salta dicendolo. */
        base: Number.isFinite(b) && b >= 0 ? b : null,
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
export function testoSollecito(fattura, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT, note = null) {
  const f = fattura || {};
  // si sollecita ciò che RESTA da avere: se il cliente ha già versato un
  // acconto, chiedergli di nuovo l'intero sarebbe una lettera sbagliata.
  const totDoc = round2(+f.importo || 0);
  const imp = apertoDi(f, note);
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
export function incassoAtteso(fatture, giorniAvanti = 30, oggi = new Date(), note = null) {
  let importo = 0, conto = 0;
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (Number.isFinite(g) && g >= 0 && g <= giorniAvanti) { importo += apertoDi(f, note); conto++; }
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
export function esposizioneClienti(fatture, oggi = new Date(), clienti = [], note = null) {
  const per = {};
  for (const f of fatture || []) {
    if (f.incassata) continue;
    // residuo meno storno: né l'acconto già arrivato né la parte stornata
    // sono esposizione, e una fattura stornata per intero esce dal fido
    const imp = apertoDi(f, note);
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
export function estrattoContoCliente(cliente, fatture, oggi = new Date(), tassoAnnuo = TASSO_MORA_DEFAULT, clienti = [], note = null) {
  const rif = cliente && typeof cliente === "object" ? cliente : { cliente: cliente };
  const nome = String(rif.cliente || "").trim();
  const chiave = rif.chiave || null;
  if (!nome && !chiave) return null;
  const kNome = chiaveNome(nome);
  const aperte = (fatture || []).filter(f =>
    !f.incassata && apertoDi(f, note) > 0 && (chiave
      ? chiaveCliente(f, clienti) === chiave
      : chiaveNome(nomeCliente(f, clienti)) === kNome));
  if (!aperte.length) return null;
  aperte.sort((a, b) => (a.scadenza || "").localeCompare(b.scadenza || ""));
  const e = (v) => "€ " + euroIt(v);
  let totale = 0, scaduto = 0, moraTot = 0, scaduteN = 0;
  const righe = aperte.map(f => {
    const imp = apertoDi(f, note);                        // residuo dovuto, meno lo stornato
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
// ⛔ `mesi` E' UN CONTEGGIO, e va difeso come tale (chiuso il 03/08). Il ciclo
// qui sotto gira `mesi` volte creando una `Date` e una chiave a ogni giro:
// passandogli una DATA nella casella del conteggio — sbaglio invitato, perché
// in questo file `agingIncassi`, `prioritaIncasso`, `esposizioneClienti` e
// `kpiFrom` hanno tutte `oggi` in seconda o terza posizione e questa è l'unica
// in cui il secondo posto è un numero — `i < mesi` la converte in millisecondi
// dall'epoca: 1.785.456.000.000 giri, e la scheda muore di MEMORIA. Non un
// numero sbagliato: la pagina che non risponde più, senza un errore da
// mostrare. docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
const MESI_ORIZZONTE_MAX = 60;
export function incassoPerMese(fatture, mesi = 6, oggi = new Date(), note = null) {
  const n = Math.floor(+mesi);
  mesi = Number.isFinite(n) && n > 0 ? Math.min(n, MESI_ORIZZONTE_MAX) : 6;
  const o = new Date(oggi); o.setHours(0, 0, 0, 0);
  const km = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const ordine = [], perMese = {};
  for (let i = 0; i < mesi; i++) { const k = km(new Date(o.getFullYear(), o.getMonth() + i, 1)); ordine.push(k); perMese[k] = { mese: k, conto: 0, importo: 0 }; }
  const scadute = { conto: 0, importo: 0 };
  for (const f of fatture || []) {
    if (f.incassata) continue;
    const g = giorni(f.scadenza, oggi);
    if (!Number.isFinite(g)) continue;                 // senza data valida: non pianificabile
    const imp = apertoDi(f, note);                     // solo ciò che resta da incassare
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
/* ⛔ UNA FATTURA SENZA SCADENZA NON È UNA FATTURA IN ORARIO. Fino al 01/08
   questa funzione le dava `ritardo: 0` — lo stesso numero di una fattura
   comodamente nei termini — e poi ordinava per ritardo decrescente. Effetto:
   la fattura di cui si sa MENO finiva in fondo, e il pannello «chi sollecitare»
   ne mostra tre: quella spariva. La pagina aveva perfino la frase pronta
   («senza scadenza: non si sa entro quando») e non la vedeva nessuno.
   Non è un numero tranquillo su uno schermo: è un ORDINAMENTO tranquillo, che
   è più difficile da vedere perché non scrive niente di falso — nasconde.
   Adesso `ritardo` è **null** quando la scadenza non c'è (come `giorni`
   risponde `null`, e come tutto il resto del modulo distingue «non lo so» da
   «zero»), e chi ordina lo tratta a parte con `senzaScadenza`.
   ⚠️ DOVE metterla nell'ordine è una scelta di prodotto, non un calcolo: qui
   resta **in fondo alle rankate ma davanti a chi non ha ritardo**, perché una
   cosa che non si sa vale più attenzione di una che si sa essere a posto. Se
   il fondatore la vuole in cima, si cambia una riga — ma non si torna a
   chiamarla zero. */
export function prioritaIncasso(fatture, oggi = new Date(), note = null) {
  return (fatture || [])
    .filter(f => !f.incassata)
    .map(f => {
      const g = giorni(f.scadenza, oggi);
      const noto = Number.isFinite(g);
      return { f, ritardo: noto ? Math.max(0, -g) : null, senzaScadenza: !noto };
    })
    .sort((a, b) => {
      const ra = a.ritardo, rb = b.ritardo;
      if (ra != null && rb != null && ra !== rb) return rb - ra;   // più in ritardo prima
      if (ra != null && rb == null) return ra > 0 ? -1 : 1;        // in ritardo prima; in orario dopo
      if (ra == null && rb != null) return rb > 0 ? 1 : -1;
      return apertoDi(b.f, note) - apertoDi(a.f, note);
    });
}

// Riepilogo delle gare d'appalto: quante aperte/vinte/perse, valore a
// base d'asta per stato, e tasso di vittoria sulle sole gare DECISE
// (vinte+perse; le aperte non contano ancora). tassoVittoria è null se
// non c'è ancora nessuna gara decisa. Funzione pura e testabile.
export function gareRiepilogo(gare) {
  const per = (s) => (gare || []).filter(g => g.stato === s);
  /* Le gare senza base non si contano nel totale — sommarle come zero sarebbe
     lo stesso — ma si CONTANO a parte: un totale che esclude qualcosa senza
     dirlo è un totale che inganna chi lo legge. */
  /* ⚠️ `Number.isFinite(+g.base)` DA SOLO NON BASTA: `+null` fa 0, che è
     finito — quindi una base mancante passerebbe per un numero valido e
     tornerebbe a valere zero, cioè esattamente il difetto che si sta togliendo.
     Trovato da un test, non a mente. */
  const conBase = (g) => g && g.base != null && g.base !== "" && Number.isFinite(+g.base);
  const somma = (arr) => arr.reduce((t, g) => t + (conBase(g) ? +g.base : 0), 0);
  const senzaBase = (arr) => arr.filter(g => !conBase(g)).length;
  const aperte = per("aperta"), vinte = per("vinta"), perse = per("persa");
  const decise = vinte.length + perse.length;
  return {
    aperte: aperte.length, vinte: vinte.length, perse: perse.length,
    baseAperta: somma(aperte), baseVinta: somma(vinte), basePersa: somma(perse),
    apertesenzaBase: senzaBase(aperte),
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
export function prossimoNumero(numeri, anno = new Date().getFullYear(), cifre = 3, prefisso = "") {
  const y = String(anno);
  const p = String(prefisso || "");
  let max = 0;
  for (const n of numeri || []) {
    let s = String(n == null ? "" : n).trim();
    /* con un prefisso si guardano SOLO i numeri di quella serie, e senza
       prefisso SOLO quelli senza — se no le due serie si contaminano e la
       nota NC/2026/004 farebbe saltare la fattura 2026/004 */
    if (p) { if (!s.startsWith(p)) continue; s = s.slice(p.length); }
    else if (/^[A-Za-z]/.test(s)) continue;
    let m = /^(\d{4})\s*[\/\-.]\s*(\d+)$/.exec(s);
    if (m && m[1] === y) { max = Math.max(max, +m[2]); continue; }
    m = /^(\d+)\s*[\/\-.]\s*(\d{4})$/.exec(s);
    if (m && m[2] === y) max = Math.max(max, +m[1]);
  }
  return p + y + "/" + String(max + 1).padStart(cifre, "0");
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
export function apertoDi(fattura, note) {
  const f = fattura || {};
  const base = Number.isFinite(+f.residuo) ? round2(Math.max(0, +f.residuo)) : round2(+f.importo || 0);
  // ⛔ e quello che una nota di credito ha già stornato NON è più esigibile.
  // `note` è facoltativo: chi non lo passa ha esattamente il numero di prima —
  // ed è così che questa riga è entrata senza cambiare nessuno dei chiamanti
  // che ancora non sanno delle note.
  if (!note || !note.length) return base;
  return round2(Math.max(0, base - stornatoDi(f.id, note)));
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

/* ⛔ LO SCONTO DEL CLIENTE È UNA PERCENTUALE SULL'IMPONIBILE, non un prezzo
   diverso. Sono due cose che sembrano uguali e non lo sono:
   · piegando lo sconto dentro il prezzo unitario, quel prezzo va arrotondato
     ai centesimi e l'errore si moltiplica per la quantità. Misurato su una
     differita vera (2.230 t a 12,34 €/t con il 5%): **6,69 € di meno** del
     dovuto, e su un documento fiscale i centesimi non sono un dettaglio;
   · e soprattutto: un DDT italiano il prezzo di listino lo SCRIVE, e lo sconto
     lo scrive accanto. Chi riceve il documento deve poter rifare il conto.
   Quindi `prezzoUnitario` resta il **listino**, e lo sconto viaggia con lui. */
export function scontoValido(cliente) {
  const s = +((cliente || {}).sconto);
  if (!Number.isFinite(s) || s <= 0) return 0;
  return round2(Math.min(100, s));
}
// L'imponibile di una riga: quantità × prezzo di listino, meno lo sconto.
// In un posto solo, perché lo usano la pesata singola e la fattura differita —
// e due arrotondamenti diversi sullo stesso conto darebbero due totali diversi
// sullo stesso mese.
export function imponibileRiga(quantita, prezzoUnitario, scontoPct) {
  const q = +quantita;
  if (!Number.isFinite(q)) return 0;
  const sc = Math.min(100, Math.max(0, +scontoPct || 0));
  return round2(q * (+prezzoUnitario || 0) * (1 - sc / 100));
}

// ============================================================
// PREZZI A SCAGLIONI DI QUANTITÀ (N9)
// ------------------------------------------------------------
// Gli inerti non si vendono a prezzo unico: chi ritira 5.000 t per un cantiere
// non paga il listino di chi ne prende tre. Fino a qui Conti aveva UNA sola
// percentuale per cliente, e la politica di prezzo per volume la teneva il
// venditore in testa — cioè da nessuna parte.
//
// ⛔ LA FORMA È «DA», NON «DA…A», e non è un dettaglio: è quello che rende
//    IMPOSSIBILI per costruzione le due cose che il mandato vieta. Con le
//    fasce scritte a coppie (0–99, 100–499, 500–∞) i buchi e le sovrapposizioni
//    si scrivono per sbaglio ogni volta che si corregge un estremo — e il
//    controllo che li cerca va scritto, mantenuto, e sbaglia. Con una sola
//    soglia per riga un buco non è rappresentabile: ogni quantità cade
//    nell'ultima soglia che ha superato. Resta UNA cosa da controllare, e la
//    controlla `validaScaglioni`: due righe che partono dalla stessa quantità.
//
// ⛔ LA SOGLIA APPARTIENE ALLO SCAGLIONE PIÙ ALTO: 100 t esatte pagano il
//    prezzo «da 100». È la lettura naturale di un listino («da 100 t: 11,20»)
//    ed è detta una volta, nella pagina, sotto la tabella.
//
// ⛔ LA BANDA BASE È IL LISTINO, E SI VEDE. Se la prima soglia scritta è
//    maggiore di zero, la scala si completa in basso con una riga «fino a N» al
//    prezzo di listino, marcata `implicita`. Non è un'inferenza nascosta: la
//    pagina la disegna come le altre, così nessuno deve indovinare che cosa
//    paga chi ritira poco.
//
// ⛔ E QUANDO LA BANDA NON SI PUÒ SCEGLIERE, NON SE NE SCEGLIE UNA. Una
//    quantità in metri cubi su una scala in tonnellate, senza densità, non si
//    converte: lì non vale né «la più bassa per prudenza» né il listino pieno —
//    `calcolabile: false` e il perché scritto. Stessa cosa per la fornitura a
//    chiamata: senza quantità lo scaglione non esiste ancora, e un prezzo
//    unitario tranquillo sarebbe una promessa che non è stata fatta.
// ============================================================

/* ⛔ COME SI COMPONGONO SCONTO CLIENTE E SCAGLIONE — DECISIONE DICHIARATA, E
   UNA SOLA STRADA. Le due cose vivono in due colonne diverse del documento e
   si sommano: `scontoPct = sconto cliente + sconto scaglione`, con il tetto
   del 100% che `imponibileRiga` già impone.

   Perché SOMMATI e non «a cascata» (il classico 20+10 dell'ingrosso, cioè
   1−0,95×0,92 = 12,6% invece di 13%): tutt'e due gli sconti li facciamo NOI,
   sulla stessa vendita — non c'è nessuna catena di intermediari da modellare —
   e soprattutto questo file ha già deciso, dodici righe più su, che *chi riceve
   il documento deve poter rifare il conto*. «5% cliente + 8% quantità = 13%» lo
   rifà chiunque a mente; 1−(0,95×0,92) no. La differenza sta nella terza cifra
   e va a favore del cliente: fra sbagliare di 0,4% in meno e di 0,4% in più,
   la telefonata arriva solo nel secondo caso.

   Perché NON «il maggiore vince» e non «uno esclude l'altro»: sono due
   promesse fatte per due ragioni diverse — una a chi ritira tanto, una a chi è
   cliente da anni. Farne vincere una vuol dire rimangiarsi l'altra, e il
   cliente che si vede annullare lo sconto contrattuale *proprio perché* ha
   ordinato di più fa la telefonata che nessuno vuole ricevere.

   ⚠️ E UNA SCALA A PREZZI NON DIVENTA MAI UNA PERCENTUALE, né il contrario:
   · scala a PREZZI → la banda dà il `prezzoUnitario` (esatto, è già un prezzo)
     e il suo sconto vale 0. Lo sconto cliente resta quello che era;
   · scala a SCONTI → il `prezzoUnitario` resta il LISTINO e la percentuale si
     somma. Piegarla dentro il prezzo la costringerebbe ad arrotondarsi ai
     centesimi, e l'errore si moltiplica per la quantità: misurato in prototipo
     su 2.230 t a 12,34 €/t con l'8%, **6,24 € in meno** del dovuto. È la stessa
     ragione per cui, dodici righe più su, lo sconto del cliente non si piega
     nel prezzo — qui vale identica, quindi la risposta è identica.
   Le due forme non si mescolano nella stessa scala (`validaScaglioni` la
   rifiuta): una tabella che riga per riga cambia moneta non la legge nessuno. */

/* Legge `prodotto.scaglioni` e ne restituisce la scala ordinata, oppure i
   problemi che le impediscono di essere una scala. `ok: true` con `quanti: 0`
   vuol dire «questo prodotto non ha scaglioni», che NON è un errore: è come si
   comportano tutti i prodotti scritti prima di oggi. */
export function validaScaglioni(prodotto) {
  const p = prodotto || {};
  const unita = p.unitaPrezzo === "m3" ? "m3" : "t";
  const grezze = Array.isArray(p.scaglioni) ? p.scaglioni.filter(Boolean) : [];
  const problemi = [];
  if (!grezze.length) return { ok: true, quanti: 0, tipo: null, unita, scala: [], problemi };

  const dichiarato = (v) => v != null && String(v).trim() !== "";
  const conPrezzo = grezze.filter((r) => dichiarato(r.prezzo)).length;
  const conSconto = grezze.filter((r) => dichiarato(r.sconto)).length;
  let tipo = null;
  if (conPrezzo && conSconto) problemi.push("la scala mescola prezzi e sconti: scegli l'una o l'altra forma.");
  else if (conPrezzo) tipo = "prezzo";
  else if (conSconto) tipo = "sconto";
  else problemi.push("nessuno scaglione dice né un prezzo né uno sconto.");

  const viste = new Set();
  const righe = [];
  for (const r of grezze) {
    const da = +r.da;
    if (!Number.isFinite(da) || da < 0) { problemi.push("una soglia di quantità non è un numero valido."); continue; }
    const k = String(round3(da));
    if (viste.has(k)) { problemi.push("due scaglioni partono dalla stessa quantità (" + k + "): si sovrappongono."); continue; }
    viste.add(k);
    if (tipo === "prezzo") {
      const v = +r.prezzo;
      /* ⛔ NIENTE PREZZO ZERO, ed è la regola già scritta per l'import del
         listino: uno zero fa sembrare gratis un prodotto che non lo è, e da lì
         finisce in un DDT e poi in una fattura. */
      if (!Number.isFinite(v) || v <= 0) { problemi.push("lo scaglione da " + k + " non ha un prezzo maggiore di zero."); continue; }
      righe.push({ da: round3(da), prezzo: round2(v), sconto: null });
    } else if (tipo === "sconto") {
      const v = +r.sconto;
      if (!Number.isFinite(v) || v < 0 || v > 100) { problemi.push("lo sconto dello scaglione da " + k + " deve stare fra 0 e 100."); continue; }
      righe.push({ da: round3(da), prezzo: null, sconto: round2(v) });
    }
  }
  righe.sort((a, b) => a.da - b.da);

  const listino = round2(+p.prezzo || 0);
  const scala = [];
  if (!righe.length || righe[0].da > 0)
    scala.push({ da: 0, prezzo: tipo === "prezzo" ? listino : null,
                 sconto: tipo === "sconto" ? 0 : null, implicita: true });
  for (const r of righe) scala.push({ ...r, implicita: false });
  // `a` è la soglia dello scaglione successivo, cioè dove questo finisce (esclusa).
  for (let i = 0; i < scala.length; i++) scala[i].a = i + 1 < scala.length ? scala[i + 1].da : null;
  return { ok: problemi.length === 0, quanti: righe.length, tipo, unita, scala, problemi };
}

/* Come si chiama uno scaglione. Vive qui e non nella pagina perché la usano
   anche `descriviScaglione` e l'export: scritta nella pagina, il giorno che
   serve al CSV se ne scriverebbe una seconda, diversa.
   ⚠️ IL FORMATO DEL NUMERO SI PASSA DA FUORI, e non è pignoleria: `1500`
   scritto con `toLocaleString("it-IT")` diventa «1500» in Node e «1.500» in
   Chromium (vedi docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md), quindi un'etichetta
   costruita qui con la formattazione dentro sarebbe una prova che passa dove
   l'utente non guarda. Di suo scrive il numero nudo; la pagina le passa il
   proprio formattatore. */
export function etichettaScaglione(banda, unita, fmt) {
  const b = banda || {};
  const n = typeof fmt === "function" ? fmt : String;
  const u = " " + (UNITA_LABEL[unita] || UNITA_LABEL.t);
  if (b.a == null) return (+b.da > 0 ? "da " + n(b.da) + u + " in su" : "qualunque quantità");
  if (!(+b.da > 0)) return "fino a " + n(b.a) + u;
  return "da " + n(b.da) + u;
}

/* Quale scaglione vale per questa quantità. `calcolabile: false` quando la
   banda NON si può scegliere, e `motivo` dice quale dei tre casi è — la pagina
   ne ha bisogno perché due sono errori da correggere e uno (la fornitura a
   chiamata) è un'offerta legittima che va salvata lo stesso. */
export function scaglionePer(prodotto, quantita, unita) {
  const p = prodotto || {};
  const v = validaScaglioni(p);
  const uL = v.unita;
  const uChiesta = unita === "t" || unita === "m3" ? unita : uL;
  const base = { tipo: v.tipo, unita: uL, scala: v.scala, quanti: v.quanti, banda: null,
                 indice: -1, quantitaListino: null, prezzoScala: null, scontoScaglione: 0 };
  if (!v.quanti) return { ...base, calcolabile: true, motivo: "nessuna-scala", perche: "" };
  if (!v.ok) return { ...base, calcolabile: false, motivo: "scala-non-valida", perche: v.problemi[0] };
  /* ⛔ `Number.isFinite(+quantita)` DA SOLO NON BASTA: `+null` fa 0 e
     `Number.isFinite(0)` risponde true, quindi una quantità assente prenderebbe
     la banda base — che è esattamente il prezzo più caro spacciato per scelta.
     È la trappola che questo file documenta in altri quattro punti. */
  const dich = quantita != null && String(quantita).trim() !== "" && Number.isFinite(+quantita);
  if (!dich) return { ...base, calcolabile: false, motivo: "quantita-assente",
    perche: "la quantità non è indicata, e lo scaglione si decide sulla quantità" };
  const qL = uChiesta === uL ? round3(+quantita)
    : convertiQuantita(+quantita, uChiesta, uL, densitaValida(p));
  if (qL == null) return { ...base, calcolabile: false, motivo: "densita-mancante",
    perche: "la quantità è in " + UNITA_LABEL[uChiesta] + ", gli scaglioni sono in "
      + UNITA_LABEL[uL] + ", e senza densità non si convertono" };
  let i = 0;
  for (let k = 0; k < v.scala.length; k++) if (v.scala[k].da <= qL) i = k;
  const b = v.scala[i];
  return { ...base, calcolabile: true, motivo: "", perche: "", banda: b, indice: i,
           quantitaListino: qL, prezzoScala: b.prezzo,
           scontoScaglione: b.sconto == null ? 0 : b.sconto };
}

/* La frase che accompagna lo scaglione, e il posto in cui la bandiera
   `calcolabile` viene LETTA (regola 20 di run-stile: una non-misurabilità che
   non legge nessuno non protegge niente). Stessa forma di `descriviAvanzamento`.
   Il formattatore dei numeri si passa da fuori, per la ragione scritta sopra. */
export function descriviScaglione(sc, fmt) {
  const s = sc || {};
  const n = typeof fmt === "function" ? fmt : String;
  if (!s.calcolabile) return "Lo scaglione non si può applicare: " + (s.perche || "dato mancante") + ".";
  if (s.motivo === "nessuna-scala" || !s.banda) return "Prezzo di listino: questo prodotto non ha scaglioni.";
  const dove = etichettaScaglione(s.banda, s.unita, n);
  if (s.banda.implicita) return "Sotto il primo scaglione (" + dove + "): prezzo di listino pieno.";
  return s.tipo === "sconto"
    ? "Scaglione " + dove + ": " + n(s.scontoScaglione) + "% sulla quantità."
    : "Scaglione " + dove + ": " + n(s.prezzoScala) + " €/" + (UNITA_LABEL[s.unita] || UNITA_LABEL.t) + ".";
}

/* IL PREZZO DI UNA RIGA, IN UN POSTO SOLO. Mette insieme la banda e lo sconto
   del cliente secondo la regola dichiarata qui sopra, e restituisce le due
   cose che il documento stampa: il prezzo unitario e UNA percentuale.
   `prezzoUnitario: null` quando la banda non si è potuta scegliere — chi chiama
   legge `scaglione.motivo` per sapere se è un errore da correggere o
   un'offerta a chiamata da salvare così. */
export function applicaScaglione(prodotto, quantita, unita, cliente) {
  const p = prodotto || {};
  const uL = p.unitaPrezzo === "m3" ? "m3" : "t";
  const u = unita === "t" || unita === "m3" ? unita : uL;
  const dens = densitaValida(p);
  /* la conversione del prezzo fra le due unità è quella di
     `prezzoPerTonnellata`/`prezzoPerMetroCubo`: qui si riusa la formula, non se
     ne scrive una seconda che domani diverge. */
  const inUnita = (vL) => vL == null ? null
    : u === uL ? round2(vL)
    : !dens ? null
    : u === "m3" ? round2(vL * dens) : round2(vL / dens);
  const sc = scaglionePer(p, quantita, u);
  const scontoCliente = scontoValido(cliente);
  const listino = inUnita(+p.prezzo || 0);
  if (!sc.calcolabile)
    return { prezzoUnitario: null, listino, scontoPct: scontoCliente, scontoCliente,
             scontoScaglione: 0, scaglione: sc };
  const prezzoL = sc.prezzoScala != null ? sc.prezzoScala : (+p.prezzo || 0);
  return { prezzoUnitario: inUnita(prezzoL), listino, scontoCliente,
           scontoScaglione: sc.scontoScaglione,
           scontoPct: round2(Math.min(100, scontoCliente + sc.scontoScaglione)),
           scaglione: sc };
}

// Riga di pesata completa a partire da pesi, prodotto, anagrafica e CLIENTE:
// quantità nell'unità in cui il prodotto si VENDE (t o m³), prezzo di listino,
// sconto del cliente e valore.
// La densità, il prezzo e lo sconto vengono FOTOGRAFATI qui: se domani il
// listino cambia o il cliente cambia condizioni, il DDT già emesso resta
// quello che è stato consegnato e fatturato.
// ⚠️ Il quarto parametro è un SOPRAINSIEME: chi non passa il cliente ha il
// comportamento di prima (sconto zero), e i DDT salvati prima del 03/08 —
// quando lo sconto non veniva applicato a nessuno — restano quello che sono.
export function rigaPesata(prodotto, lordo, tara, cliente) {
  const p = prodotto || {};
  const netto = nettoPesata(lordo, tara);
  const unitaVendita = p.unitaPrezzo === "m3" ? "m3" : "t";
  const densita = densitaValida(p);
  const quantita = unitaVendita === "t" ? netto : convertiQuantita(netto, "t", "m3", densita);
  const prezzoUnitario = round2(+p.prezzo || 0);
  const scontoPct = scontoValido(cliente);
  const valore = quantita == null ? null : imponibileRiga(quantita, prezzoUnitario, scontoPct);
  return { netto, unitaVendita, densita: densita || null, quantita,
           prezzoUnitario, scontoPct, aliquotaIva: +p.iva || 0, valore };
}

// Valore di una pesata già salvata (usa i dati fotografati sul documento).
export function valorePesata(pesata) {
  const d = pesata || {};
  const q = +d.quantita;
  if (!Number.isFinite(q)) return 0;
  return imponibileRiga(q, d.prezzoUnitario, d.scontoPct);
}

// Tonnellate e metri cubi di una pesata (i m³ solo se la densità c'era).
export function quantitaPesata(pesata) {
  const d = pesata || {};
  const t = +d.netto || 0;
  /* ⛔ `Number.isFinite(+d.quantita)` DA SOLO NON BASTA, ed è la trappola che
     questo file documenta in altri due punti: `+null` fa **0**, e
     `Number.isFinite(0)` risponde **true**. Quindi una pesata venduta a metro
     cubo con `quantita: null` — ci si arriva da un import o da un dato vecchio,
     il form la blocca — usciva con **0 m³** invece che «non calcolabile».
     Zero metri cubi su un DDT non è un vuoto: è una consegna dichiarata di
     niente. Trovato il 01/08 mettendo quel caso in dimostrazione: il codice
     c'era da prima, e nessuno poteva vederlo. */
  const qDich = d.quantita;
  const qNota = !(qDich == null || String(qDich).trim() === "") && Number.isFinite(+qDich);
  const m3 = d.unitaVendita === "m3" && qNota
    ? +qDich : convertiQuantita(t, "t", "m3", d.densita);
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
// ⚠️ Lo SCONTO entra nella chiave del raggruppamento. Due consegne dello stesso
// prodotto allo stesso prezzo ma con sconti diversi — succede quando le
// condizioni del cliente cambiano a metà mese — restano due righe, come devono:
// unirle vorrebbe dire scegliere quale dei due sconti raccontare.
export function righeDaPesate(pesate) {
  const per = {};
  for (const p of pesate || []) {
    const unita = p.unitaVendita === "m3" ? "m3" : "t";
    const prezzo = round2(+p.prezzoUnitario || 0);
    const aliquota = Math.max(0, +p.aliquotaIva || 0);
    const sconto = Math.min(100, Math.max(0, round2(+p.scontoPct || 0)));
    const k = [p.prodottoId || p.prodotto || "—", unita, prezzo, sconto, aliquota].join("|");
    const r = per[k] || (per[k] = { prodottoId: p.prodottoId || null,
      descrizione: String(p.prodotto || "Prodotto"), unita, prezzoUnitario: prezzo,
      scontoPct: sconto, aliquota, quantita: 0, imponibile: 0, ddt: [], ddtIds: [] });
    const q = Number.isFinite(+p.quantita) ? +p.quantita : (+p.netto || 0);
    r.quantita = round3(r.quantita + q);
    r.ddt.push(p.numero || "—");
    r.ddtIds.push(p.id);
  }
  const righe = Object.values(per).sort((a, b) => a.descrizione.localeCompare(b.descrizione, "it"));
  for (const r of righe) r.imponibile = imponibileRiga(r.quantita, r.prezzoUnitario, r.scontoPct);
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

/* ⛔ SU QUALE MATERIALE SI PAGA IL CANONE? Fino al 03/08 questa funzione
   rispondeva in un modo solo — il **venduto**, ricavato dalle pesate — mentre
   Terra scriveva al titolare «la base di calcolo sono N m³ di scavo misurato»
   e lo mandava qui. Erano due numeri diversi: fra scavato e venduto ci sono le
   scorte di piazzale, gli scarti e il materiale usato per il ripristino. Il
   numero che Terra prometteva non lo produceva nessuno.
   Adesso la base è una SCELTA dichiarata (`impostazioni.canoneBase`), e la
   risposta dice sempre quale ha usato e quanto valeva l'altra.

   ⚠️ L'ASIMMETRIA FRA LE DUE BASI È VOLUTA, e non è un dettaglio:
   · **nessuna pesata** nel periodo vuol dire che non è stato venduto niente,
     e allora il dovuto è **zero**: è un fatto;
   · **nessun rilievo** nel periodo NON vuol dire che non è stato scavato
     niente: vuol dire che **nessuno ha misurato**. Lì il dovuto è `null` e la
     funzione dice perché — uno zero direbbe «non devi niente», che è
     esattamente il numero tranquillo dove non è stato misurato niente. */
export const BASI_CANONE = [
  { chiave: "venduto", etichetta: "Materiale venduto (dalle pesate)",
    spiega: "Somma dei DDT del periodo, convertiti nell'unità dell'aliquota." },
  { chiave: "scavato", etichetta: "Materiale scavato (dai rilievi di Terra)",
    spiega: "Metri cubi misurati dai rilievi, al netto delle riprese dai cumuli — quelle erano già state scavate." },
];
export function canonePeriodo(pesate, impostazioni, dal, al, rilievi) {
  const cfg = impostazioni || {};
  const unita = cfg.canoneUnita === "t" ? "t" : "m3";
  const baseScelta = cfg.canoneBase === "scavato" ? "scavato" : "venduto";
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
  const perProdotto = Object.values(per).sort((a, b) => b.t - a.t);
  for (const r of perProdotto) r.dovuto = round2((unita === "t" ? r.t : r.m3) * aliquota);
  const comune = { unita, aliquota, baseScelta,
    tonnellate: round2(tot.t), metriCubi: round3(tot.m3),
    senzaDensita: tot.senzaDensita, perProdotto,
    viaggi: perProdotto.reduce((s, r) => s + r.viaggi, 0) };

  if (baseScelta === "scavato") {
    /* Lo scavato lo misura `misuratoPeriodo` di `shared/dw-ponti.js`, la stessa
       funzione che Terra usa per il suo riepilogo: due conti diversi sullo
       stesso materiale darebbero due importi diversi per la stessa cava. */
    const mis = misuratoPeriodo(rilievi, d1, d2);
    const scavatoM3 = mis ? mis.m3 : null;
    if (!mis || !mis.rilievi) {
      return { ...comune, scavatoM3: mis ? mis.m3 : null, rilieviUsati: mis ? mis.rilievi : 0,
        m3DaCumuli: mis ? mis.m3Cumulo : 0,
        base: null, dovuto: null,
        motivo: rilievi == null
          ? "I rilievi di Terra non sono raggiungibili: senza quelli lo scavato non si può misurare."
          : "Nessun rilievo elaborato in questo periodo: lo scavato non è stato misurato. "
            + "Uno zero qui direbbe che non c'è niente da pagare, mentre la verità è che nessuno ha misurato." };
    }
    if (unita === "t") {
      return { ...comune, scavatoM3, rilieviUsati: mis.rilievi, m3DaCumuli: mis.m3Cumulo,
        base: null, dovuto: null,
        motivo: "L'aliquota è a tonnellata ma i rilievi misurano metri cubi: per convertirli servirebbe la "
          + "densità del banco in posto, che non è quella del materiale sciolto e qui non c'è. "
          + "Metti l'aliquota a metro cubo, oppure usa il materiale venduto, dove le tonnellate sono pesate." };
    }
    return { ...comune, scavatoM3, rilieviUsati: mis.rilievi, m3DaCumuli: mis.m3Cumulo,
      base: round3(scavatoM3), dovuto: round2(scavatoM3 * aliquota), motivo: "" };
  }

  const base = unita === "t" ? tot.t : tot.m3;
  return { ...comune, base: round3(base), dovuto: round2(base * aliquota),
           scavatoM3: null, rilieviUsati: 0, m3DaCumuli: 0, motivo: "" };
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
        // e le note di credito: come per gli incassi, un'organizzazione che
        // non ne ha mai emesse legge una lista vuota, senza errori
        note: () => read("note"),
        // e il registro costi: stessa storia, chi non ne ha mai registrato uno
        // legge una lista vuota
        costi: () => read("costi"),
        // preventivi e ordini: chi non ne ha mai fatto uno legge vuoto, e
        // l'app funziona esattamente come prima — il ciclo che parte dalla
        // pesata resta valido, l'ordine è un passo IN PIÙ, non obbligatorio
        ordini: () => read("ordini"),
        // le chiusure di mese: chi non ne ha mai dichiarata una legge vuoto
        chiusure: () => read("chiusure"),
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
      note: async () => mem.note || (mem.note = []),
      costi: async () => mem.costi || (mem.costi = []),
      ordini: async () => mem.ordini || (mem.ordini = []),
      chiusure: async () => mem.chiusure || (mem.chiusure = []),
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

// ============================================================
// LA NOTA DI CREDITO (art. 26 DPR 633/1972)
// ------------------------------------------------------------
// La finestra che elimina una fattura scrive, testuale, che «una fattura
// realmente emessa non va cancellata, va gestita con una nota di credito» — e
// il documento di cui parlava non esisteva. Ora esiste.
//
// ⛔ NON è una fattura col meno davanti. Misurato il 03/08: la scorciatoia dà
// il numero giusto DOVE SI GUARDA (il KPI in cima) e sbagliato dove non si
// guarda — `esposizioneClienti` salta gli importi negativi e il fido non si
// libera, `agingIncassi` conta la nota come una fattura scaduta da sollecitare.
// E nel tracciato della fattura elettronica gli importi negativi non sono
// nemmeno ammessi: il verso «in diminuzione» lo dà soltanto il tipo TD04.
//
// ⛔ E STORNATA NON È SALDATA. Una nota totale su una fattura mai pagata porta
// il residuo a zero: se quello zero facesse scattare «saldata», tutto ciò che
// misura i tempi di pagamento conterebbe come «pagata in N giorni» una fattura
// che è stata ANNULLATA, e il cliente peggiore diventerebbe il più puntuale.
// È l'assenza di un dato — il pagamento — travestita da residuo a zero.
// Misurato il 04/08 sul modo in cui la gente lo fa OGGI (un finto incasso per
// portarla a zero): una sola fattura annullata porta il tempo medio di
// pagamento da 30 a 101 giorni, e la direzione dell'errore dipende dalla data
// che si scrive nel finto incasso.
// Ricerca e decisioni: docs/RICERCA_NOTE_DI_CREDITO_202608.md
// ============================================================
/* ── LE CAUSALI, con il comma che le regge e il termine che ne discende ──────
   Art. 26 DPR 633/1972. Il comma non è un dettaglio da giuristi: decide se
   esiste un termine di dodici mesi, e quindi se l'app deve avvisare. */
export const CAUSALI_NOTA = [
  { id: "resa", label: "Merce resa o rifiutata", comma: 2, termine: null },
  { id: "annullamento", label: "Annullamento, risoluzione o recesso", comma: 2, termine: null },
  { id: "sconto-contratto", label: "Abbuono o sconto previsto dal contratto", comma: 2, termine: null },
  { id: "errore", label: "Errore di fatturazione", comma: 3, termine: 12 },
  { id: "accordo", label: "Accordo sopravvenuto fra le parti", comma: 3, termine: 12 },
  { id: "sconto-successivo", label: "Sconto concesso dopo l'emissione", comma: 3, termine: 12 },
];
export function causaleNota(id) {
  return CAUSALI_NOTA.find((c) => c.id === String(id || "")) || null;
}


/* ── LA CAUSALE DEL TRASPORTO E CHI TRASPORTA (DDT) ───────────────────────
   ⛔ IL FOGLIO DICHIARAVA DUE COSE CHE NESSUNO AVEVA SCRITTO. Fino al 01/08 il
   documento di trasporto stampava «Causale del trasporto: **Vendita**» e
   «Trasporto a cura di: **mittente**» — **fissi nel codice**, su ogni DDT.

   Non è un dettaglio di forma. Il DDT è il documento che viaggia sul camion e
   che la Guardia di Finanza legge a un posto di blocco: la causale decide se
   quel materiale è venduto, dato in conto lavorazione, reso, o spostato fra due
   depositi della stessa ditta — e da lì se ci vuole una fattura. Un materiale
   mandato in conto lavorazione con scritto «Vendita» è una dichiarazione
   sbagliata fatta dall'app al posto dell'utente; «trasporto a cura del
   mittente» quando il cliente è venuto a ritirare con un camion suo sposta la
   responsabilità del trasporto sulla persona sbagliata.

   È il principio del fondatore nel posto in cui costa di più: non un numero
   tranquillo su uno schermo, ma una **dichiarazione** su un documento fiscale.
   Quando non è indicata, il foglio lo dice — come fa già con l'IVA delle
   fatture registrate a importo unico. */
export const CAUSALI_TRASPORTO = [
  { id: "vendita", label: "Vendita" },
  { id: "conto-lavorazione", label: "Conto lavorazione" },
  { id: "conto-visione", label: "Conto visione o prova" },
  { id: "reso", label: "Reso al fornitore" },
  { id: "trasferimento", label: "Trasferimento fra depositi della ditta" },
  { id: "omaggio", label: "Omaggio" },
  { id: "riparazione", label: "Riparazione o manutenzione" },
];
export function causaleTrasporto(id) {
  return CAUSALI_TRASPORTO.find((c) => c.id === String(id || "")) || null;
}

export const TRASPORTO_A_CURA = [
  { id: "mittente", label: "Mittente", spiega: "Consegniamo noi, con un mezzo nostro o incaricato da noi." },
  { id: "destinatario", label: "Destinatario", spiega: "Il cliente viene a ritirare con un mezzo suo." },
  { id: "vettore", label: "Vettore", spiega: "Un trasportatore terzo, che va indicato sul documento." },
];
export function trasportoACura(id) {
  return TRASPORTO_A_CURA.find((c) => c.id === String(id || "")) || null;
}

/* Quello che al DDT manca per essere un documento completo, detto una volta
   sola perché lo dicano allo stesso modo la pagina e il foglio stampato.
   ⛔ Restituisce un elenco di MANCANZE, non un booleano «valido»: un DDT si
   stampa lo stesso — il camion parte — ma chi lo stampa deve sapere che cosa
   ci sta scrivendo sopra. */
export function mancanzeDdt(pesata) {
  const p = pesata || {};
  const mancano = [];
  if (!causaleTrasporto(p.causaleTrasporto))
    mancano.push("la causale del trasporto (vendita, conto lavorazione, reso…): decide come va trattata la consegna");
  const cura = trasportoACura(p.trasportoACura);
  if (!cura)
    mancano.push("chi cura il trasporto (mittente, destinatario o vettore)");
  else if (cura.id === "vettore" && !String(p.vettore || "").trim())
    mancano.push("il nome del vettore: il trasporto è dichiarato a cura di un vettore, ma non è scritto quale");
  return mancano;
}


/* ── QUANTO È GIÀ STATO STORNATO ────────────────────────────────────────────
   Le note parziali possono essere più d'una: la somma è quella che conta, e
   non può superare il totale della fattura. Importi POSITIVI: una nota non è
   una fattura col meno davanti (nel tracciato elettronico i negativi non sono
   nemmeno ammessi — il verso lo dà il tipo documento TD04). */
export function stornatoDi(fatturaId, note) {
  const id = String(fatturaId == null ? "" : fatturaId);
  if (!id) return 0;
  return round2((note || [])
    .filter((n) => n && String(n.fatturaId) === id && !n.bozza)
    .reduce((t, n) => t + Math.abs(+n.totale || 0), 0));
}

/* ── LO STATO A TRE VIE ─────────────────────────────────────────────────────
   ⛔ STORNATA NON È SALDATA, ed è il difetto che questa unità esiste per
   impedire. Una nota totale su una fattura mai pagata porta il residuo a zero:
   se quello zero facesse scattare «saldata», `tempoMedioPagamento` conterebbe
   come «pagata in N giorni» una fattura che nessuno ha pagato, e il cliente
   peggiore diventerebbe il più puntuale.
   È l'assenza di un dato — il pagamento — travestita da residuo a zero. */
export function statoFattura(fattura, incassi, note) {
  const f = fattura || {};
  const s = statoIncasso(f, incassi);
  const stornato = Math.min(stornatoDi(f.id, note), s.totale);
  const esigibile = round2(Math.max(0, s.totale - stornato));
  const residuo = round2(Math.max(0, esigibile - s.incassato));
  /* stornata per intero: esce dal credito, ma NON entra nei tempi di pagamento */
  if (stornato > 0 && esigibile === 0)
    return { ...s, stato: "stornata", stornato, esigibile, residuo: 0, saldata: false,
             contaNeiTempi: false, parziale: false };
  if (residuo === 0 && s.incassato > 0)
    return { ...s, stato: "saldata", stornato, esigibile, residuo: 0, saldata: true,
             contaNeiTempi: true };
  return { ...s, stato: "aperta", stornato, esigibile, residuo, saldata: false,
           parziale: s.incassato > 0, contaNeiTempi: false };
}

/* ── LA VALIDAZIONE: dice PERCHÉ non si può, e AVVISA senza bloccare ────────
   Sul termine dei dodici mesi l'app avvisa e lascia procedere: la materia ha
   eccezioni che un software non può giudicare, e sbagliare per eccesso di
   blocco è comunque sbagliare. */
export function validaNota(nota, fattura, note, oggi = new Date()) {
  const n = nota || {}, f = fattura || {};
  const errori = [], avvisi = [];
  if (!f.id) errori.push("Serve la fattura da stornare: una nota senza fattura collegata è fiscalmente orfana.");
  const c = causaleNota(n.causale);
  if (!c) errori.push("Serve la causale della rettifica: è quella che decide il termine.");

  const totale = f.id ? round2(importiFattura(f).totale) : 0;
  const giaStornato = stornatoDi(f.id, note);
  const stornabile = round2(Math.max(0, totale - giaStornato));
  const importo = round2(Math.abs(+n.totale || 0));
  if (!(importo > 0)) errori.push("L'importo della nota dev'essere maggiore di zero.");
  else if (importo > stornabile + 0.005)
    errori.push(`L'importo supera quello che resta da stornare: ${stornabile.toFixed(2)} € `
      + `(la fattura è ${totale.toFixed(2)} €, già stornati ${giaStornato.toFixed(2)} €).`);

  if (c && c.termine != null && /^\d{4}-\d{2}-\d{2}/.test(String(f.emessa || ""))) {
    const mesi = mesiFra(String(f.emessa).slice(0, 10), oggi);
    if (mesi > c.termine)
      avvisi.push(`Sono passati ${mesi} mesi dall'emissione, oltre i ${c.termine} previsti per questa causale `
        + `(art. 26 comma ${c.comma}): l'IVA potrebbe non essere recuperabile. Verifica col commercialista.`);
  }
  return { ok: errori.length === 0, errori, avvisi, stornabile, giaStornato, totale };
}

function mesiFra(dataISO, oggi) {
  const a = new Date(dataISO + "T00:00:00");
  const b = new Date(oggi);
  let m = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) m--;
  return m;
}

/* ── LA NOTA COSTRUITA DALLA FATTURA ────────────────────────────────────────
   Totale o parziale, importi POSITIVI, e il collegamento alla fattura
   originaria — che nel tracciato è `DatiFattureCollegate` e senza il quale la
   nota è formalmente valida ma fiscalmente orfana. */
export function notaDaFattura(fattura, causale, importo, numero) {
  const f = fattura || {};
  const imp = importiFattura(f);
  const totale = importo == null ? imp.totale : round2(Math.abs(+importo || 0));
  const quota = imp.totale > 0 ? totale / imp.totale : 0;
  return {
    tipo: "TD04",
    numero: numero || null,
    emessa: null,
    cliente: f.cliente || "",
    clienteId: f.clienteId || null,
    fatturaId: f.id || null,
    fatturaNumero: f.numero || null,
    fatturaData: f.emessa || null,
    causale: causale || null,
    imponibile: round2(imp.imponibile * quota),
    ivaImporto: round2(imp.ivaImporto * quota),
    totale,
    aliquotaIva: imp.aliquota,
    integrale: Math.abs(totale - imp.totale) < 0.005,
  };
}

// ============================================================
// IL REGISTRO COSTI DELLA CAVA — totali per gruppo, e il costo al metro cubo
// ------------------------------------------------------------
// La classificazione sta in `shared/dw-ponti.js` (ri-esportata qui sopra): qui
// ci sono i due conti che ne discendono.
export function riepilogoCosti(costi, dal = "", al = "") {
  const d1 = String(dal || ""), d2 = String(al || "");
  const dentro = (c) => {
    const d = String(c && c.data || "").slice(0, 10);
    if (!d1 && !d2) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;   // senza data non si può collocare
    return (!d1 || d >= d1) && (!d2 || d <= d2);
  };
  const righe = (costi || []).filter(c => c && +c.importo > 0);
  const nelPeriodo = righe.filter(dentro);
  const perGruppo = {};
  let totale = 0, nonClassificate = 0, importoNonClassificate = 0;
  for (const c of nelPeriodo) {
    const g = gruppoDiVoce(c.voce);
    const imp = round2(+c.importo || 0);
    perGruppo[g] = round2((perGruppo[g] || 0) + imp);
    totale = round2(totale + imp);
    if (g === "non-classificata") { nonClassificate++; importoNonClassificate = round2(importoNonClassificate + imp); }
  }
  /* ⛔ le voci SENZA DATA non spariscono: si contano a parte. Escluderle da un
     periodo e non dirlo farebbe risultare un mese più economico di quello che è,
     ed è la forma esatta del principio — un totale tranquillo ottenuto
     lasciando fuori quello che non si sapeva dove mettere. */
  const nonDatate = righe.filter(c => !/^\d{4}-\d{2}-\d{2}$/.test(String(c.data || "").slice(0, 10)));
  /* Le righe tornano indietro insieme ai totali perché la schermata deve
     mostrare ESATTAMENTE quelle che ha sommato. Rifiltrarle nella pagina
     vorrebbe dire riscrivere `dentro` una seconda volta, e due copie della
     stessa regola divergono al primo ritocco: il totale direbbe una cosa e
     l'elenco sotto un'altra, senza che niente lo segnali. */
  return { totale, perGruppo, conto: nelPeriodo.length,
           nonClassificate, importoNonClassificate,
           senzaData: (d1 || d2) ? nonDatate.length : 0,
           righe: nelPeriodo, righeSenzaData: (d1 || d2) ? nonDatate : [] };
}

// ⛔ E IL COSTO AL METRO CUBO NON SI CALCOLA SENZA I METRI CUBI. È la stessa
// forma degli indici infortunistici: il denominatore è il dato che manca più
// spesso, e inventarlo (o peggio, trattarlo come 1) darebbe un costo unitario
// che sembra una misura. Qui il travestimento sarebbe un numero BASSO, cioè la
// notizia che chi guarda vuole leggere.
export function costoPerMetroCubo(costi, volumeM3, dal = "", al = "") {
  const r = riepilogoCosti(costi, dal, al);
  const v = +volumeM3;
  if (!(Number.isFinite(v) && v > 0))
    return { ...r, volumeM3: null, costoM3: null, calcolabile: false,
      motivo: "Serve il volume estratto nel periodo: senza, il costo al metro cubo non si "
        + "calcola. Il volume arriva dai rilievi di Terra, o si scrive a mano." };
  return { ...r, volumeM3: v, costoM3: round2(r.totale / v), calcolabile: true, motivo: "" };
}

// ============================================================
// IL DENOMINATORE PRESO DA DOVE ESISTE GIÀ — il ponte col volume di Terra
// ------------------------------------------------------------
// `costoPerMetroCubo` chiedeva i metri cubi a mano, e i metri cubi ci sono:
// li misura Terra, e Conti li legge già col ponte in sola lettura che serve al
// confronto cavato/venduto. Chiederli a chi guarda voleva dire, in pratica,
// che il costo al metro cubo non lo calcolava nessuno.
//
// ⛔ QUATTRO ASSENZE DIVERSE, QUATTRO FRASI DIVERSE. «Nessun volume» detto
// allo stesso modo per quattro cause fa fare la cosa sbagliata a tre persone
// su quattro: chi ha solo riprese da cumulo deve sapere che il cumulo NON è
// scavo nuovo (e come denominatore conterebbe due volte lo stesso materiale),
// chi ha solo rilievi pianificati deve sapere che manca l'elaborazione, non la
// misura.
export function volumeDaTerra(rilievi, dal = "", al = "") {
  const c = cavatoPeriodo(rilievi, dal, al);
  if (c == null)
    return { m3: null, usabile: false, rilievi: 0, cumuloM3: 0, rilieviCumulo: 0,
      pianificati: 0, fuoriPeriodo: 0, primo: null, ultimo: null,
      motivo: "I rilievi di Terra non si leggono da qui: o l'app non è attiva per la tua organizzazione, o non hai il permesso di vederli." };
  const base = { m3: null, usabile: false, rilievi: c.rilievi, cumuloM3: c.cumuloM3,
    rilieviCumulo: c.rilieviCumulo, pianificati: c.pianificati, fuoriPeriodo: c.fuoriPeriodo,
    primo: c.primo, ultimo: c.ultimo };
  if (c.rilievi === 0) {
    const motivo = c.rilieviCumulo > 0
      ? "Nel periodo ci sono solo riprese da cumulo: è materiale già cavato prima, non scavo nuovo, e come denominatore conterebbe due volte lo stesso materiale."
      : c.pianificati > 0
        ? "I rilievi che riguardano questo periodo sono ancora pianificati: un rilievo previsto non è un volume misurato."
        : c.fuoriPeriodo > 0
          ? "Terra ha dei rilievi, ma nessuno cade in questo periodo: allarga le date, oppure guarda il periodo che i rilievi coprono davvero."
          : "Terra non ha ancora nessun rilievo elaborato: il volume estratto non è stato misurato da nessuno.";
    return { ...base, motivo };
  }
  return { ...base, m3: c.m3, usabile: true, motivo: "" };
}

/* ⛔ QUANTI COSTI STANNO FUORI DA QUELLO CHE I RILIEVI HANNO MISURATO.
   ------------------------------------------------------------
   La prima versione di questo avviso confrontava le DATE: «i rilievi coprono
   dal 28/02, il periodo parte dall'01/01». Sbagliato, e la prova in banco l'ha
   mostrato al primo colpo: un rilievo misura il volume tolto **da quello
   prima**, quindi la sua data è la FINE dell'intervallo che copre, non
   l'inizio — e un periodo che finisce il 31/12 «scoperto» da agosto in poi è
   semplicemente il futuro. L'avviso partiva su un caso sano.
   La domanda vera non è sulle date: è se NUMERATORE e DENOMINATORE guardano lo
   stesso pezzo di tempo. E quella si misura coi costi in mano — quante voci, e
   per quanti euro, cadono fuori dall'intervallo davvero misurato. Quelle
   spese stanno nel totale e il loro volume no: il costo al metro cubo esce
   più ALTO del vero, e un numero sbagliato in senso prudente resta sbagliato. */
export function costiFuoriDaiRilievi(righe, primo, ultimo) {
  const p = String(primo || ""), u = String(ultimo || "");
  if (!p || !u) return { quante: 0, importo: 0, misurabile: false };
  let quante = 0, importo = 0;
  for (const c of righe || []) {
    const d = String((c || {}).data || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;   // le voci senza data si contano altrove
    if (d < p || d > u) { quante++; importo = round2(importo + (+c.importo || 0)); }
  }
  return { quante, importo, misurabile: true };
}

// ============================================================
// LA CHIUSURA DEL MESE — e il margine, che senza di lei non esiste
// ------------------------------------------------------------
// ⛔ I RICAVI SONO COMPLETI PER COSTRUZIONE, I COSTI NO. I ricavi nascono da
// pesate e fatture, che qualcuno ha dovuto emettere; i costi ci sono solo se
// qualcuno li ha battuti a mano. Il mese in cui la busta paga non è stata
// registrata non dà un errore: dà «margine 42%», in verde, in cima alla
// pagina. È il numero più pericoloso che questa app possa mostrare, ed è
// l'assenza travestita nella sua forma più convincente — perché stavolta il
// numero è ALTO, cioè quello che si spera.
// E il registro costi AUMENTA il rischio invece di ridurlo: prima non c'era
// nessun costo e nessuno si sarebbe sognato di calcolare un margine; adesso i
// costi ci sono, sembrano completi, e dividerli è immediato.
// Piano e ragionamento per esteso: docs/PIANO_CHIUSURA_MESE_CONTI.md
const meseDi = (d) => String(d || "").slice(0, 7);
const eMese = (m) => /^\d{4}-\d{2}$/.test(String(m || ""));

export function statoMese(costi, chiusure, mese) {
  if (!eMese(mese)) return { stato: "aperto", mese, chiusura: null, arrivi: 0, importoArrivi: 0 };
  const c = (chiusure || []).find((x) => x && x.mese === mese) || null;
  if (!c) return { stato: "aperto", mese, chiusura: null, arrivi: 0, importoArrivi: 0 };
  /* ⛔ Un mese dichiarato chiuso a cui arrivano voci dopo NON torna aperto: il
     margine che qualcuno ha già letto, e magari stampato, non si può far
     sparire. Ma non è nemmeno più quello dichiarato, e un numero che cambia in
     silenzio dopo essere stato dato per definitivo è peggio di uno mancante.
     ⚠️ E l'ASSENZA di `registratoIl` vale «non lo so», mai «arrivato dopo»: i
     costi già in archivio quel campo non ce l'hanno, e in JavaScript
     `undefined > "2026-08-04"` è VERO — senza il `|| ""` ogni voce vecchia
     diventerebbe un arrivo tardivo e ogni mese chiuso sarebbe «con arrivi». */
  const dopo = (costi || []).filter((x) => x && meseDi(x.data) === mese
    && String(x.registratoIl || "") > String(c.chiusoIl || ""));
  return { stato: dopo.length ? "chiuso-con-arrivi" : "chiuso", mese, chiusura: c,
    arrivi: dopo.length, importoArrivi: round2(dopo.reduce((t, x) => t + (+x.importo || 0), 0)) };
}

/* ⛔ QUALI VOCI MANCANO RISPETTO A COME LAVORA QUESTA CAVA. Non esiste un
   elenco di voci obbligatorie: cambia da cava a cava, e inventarlo vorrebbe
   dire accusare di incompletezza chi paga la squadra da un'altra società.
   L'elenco si impara dallo STORICO dell'azienda stessa: una voce è «abituale»
   se compare in almeno metà degli altri mesi. Sotto quella soglia non si
   chiede niente — una spesa capitata due volte l'anno non è una dimenticanza. */
export function vociMancantiNelMese(costi, mese, soglia = 0.5) {
  if (!eMese(mese)) return { mancanti: [], mesiVisti: 0, misurabile: false };
  const righe = (costi || []).filter((c) => c && +c.importo > 0 && /^\d{4}-\d{2}/.test(String(c.data || "")));
  const mesi = [...new Set(righe.map((c) => meseDi(c.data)))].filter((m) => m !== mese);
  if (!mesi.length) return { mancanti: [], mesiVisti: 0, misurabile: false };
  const quiCi = new Set(righe.filter((c) => meseDi(c.data) === mese).map((c) => c.voce));
  const mancanti = [];
  for (const v of VOCI_COSTO) {
    if (quiCi.has(v.chiave)) continue;
    const quanti = mesi.filter((m) => righe.some((c) => meseDi(c.data) === m && c.voce === v.chiave)).length;
    if (quanti / mesi.length >= soglia)
      mancanti.push({ chiave: v.chiave, etichetta: v.etichetta, suQuanti: quanti, mesi: mesi.length });
  }
  return { mancanti, mesiVisti: mesi.length, misurabile: true };
}

export function margineMese(fatture, note, costi, chiusure, mese) {
  const st = statoMese(costi, chiusure, mese);
  const man = vociMancantiNelMese(costi, mese);
  const spesa = round2((costi || []).filter((c) => c && meseDi(c.data) === mese && +c.importo > 0)
    .reduce((t, c) => t + (+c.importo || 0), 0));
  const fuori = { stato: st.stato, mese, costi: spesa, mancanti: man.mancanti,
    dichiarateAssenti: [], ricavi: null, ricaviLordi: null, storni: null,
    margine: null, marginePct: null, calcolabile: false };
  if (st.stato === "aperto")
    return { ...fuori, motivo: man.mancanti.length
      ? `Il mese non è chiuso, e rispetto agli altri mesi mancano i costi di ${man.mancanti.map((x) => x.etichetta.toLowerCase()).join(", ")}. Un margine calcolato adesso sarebbe più alto del vero.`
      : "Il mese non è ancora dichiarato chiuso: finché non lo è, i costi possono essere incompleti e il margine uscirebbe più alto del vero." };
  /* RICAVI PER COMPETENZA: le fatture emesse nel mese, al netto delle note di
     credito emesse nel mese. Confonderli con gli INCASSI darebbe due margini
     diversi per lo stesso mese, giusti tutti e due — il modo migliore per non
     essere creduti. */
  const emesse = (fatture || []).filter((f) => f && meseDi(f.emessa) === mese);
  const lordo = round2(emesse.reduce((t, f) => t + importiFattura(f).imponibile, 0));
  const storni = round2((note || []).filter((n) => n && meseDi(n.emessa) === mese)
    .reduce((t, n) => t + (+n.imponibile || 0), 0));
  const ricavi = round2(lordo - storni);
  const margine = round2(ricavi - spesa);
  /* ⛔ Chiudere il mese dichiarando «l'esplosivo questo mese non c'è» è una
     RISPOSTA; chiuderlo senza dire niente di una voce che negli altri mesi c'è
     sempre non lo è. Senza questa sottrazione la schermata scriverebbe
     «margine 92%» e sotto «manca il personale» — contraddicendosi da sola
     PROPRIO QUANDO l'utente aveva risposto. */
  const dichiarate = new Set((st.chiusura && st.chiusura.vociAssenti) || []);
  const nonDichiarate = man.mancanti.filter((x) => !dichiarate.has(x.chiave));
  return { ...fuori, ricavi, ricaviLordi: lordo, storni, margine,
    mancanti: nonDichiarate, dichiarateAssenti: [...dichiarate],
    /* la percentuale NON si calcola su ricavi zero: sarebbe Infinity, che
       sullo schermo è indistinguibile da un numero. Il margine negativo sì:
       quello è un dato vero e va mostrato. */
    marginePct: ricavi > 0 ? round2(100 * margine / ricavi) : null,
    calcolabile: true,
    motivo: nonDichiarate.length
      ? `Il mese è chiuso, ma ${nonDichiarate.length === 1 ? "una voce non è mai stata dichiarata" : nonDichiarate.length + " voci non sono mai state dichiarate"}: ${nonDichiarate.map((x) => x.etichetta.toLowerCase()).join(", ")}. Se ${nonDichiarate.length === 1 ? "quella spesa c'è stata" : "quelle spese ci sono state"} e non ${nonDichiarate.length === 1 ? "è" : "sono"} in elenco, il margine qui sopra è più alto del vero.`
      : "" };
}

// ============================================================
// C11 · L'ESTRATTO CONTO DELLA BANCA — ABBINAMENTO DEI MOVIMENTI
//
// PERCHÉ ESISTE. Fino a oggi Conti era l'unico posto in cui un dato che esiste
// già altrove andava ribattuto a mano: i soldi arrivano in banca, e l'incasso
// lo si registra guardando l'estratto conto e ricopiando. Da lì viene il danno
// peggiore che questa app sappia fare — un sollecito con la mora ex D.Lgs
// 231/2002 mandato su una fattura GIÀ PAGATA. Non è un dettaglio sbagliato: è
// una lettera sbagliata a un cliente.
//
// ⛔ IL NOME. In Conti `riconciliazione` è già presa e vuol dire un'altra cosa
// (cavato contro venduto, il ponte con Terra): qui si dice **abbinamento**, che
// è la parola con cui i gestionali italiani chiamano l'accostamento di un
// movimento bancario a una fattura. Scartata «spunta», che in questa stessa
// app indica già la casella da spuntare («Spunta tutti» sui DDT): la stessa
// parola per due cose, dentro una app sola, è il modo di rendere entrambe
// illeggibili.
//
// LE TRE REGOLE CHE DECIDONO SE QUESTA FUNZIONE È BUONA O DANNOSA:
// 1. LA PROPOSTA SI PROPONE, NON SI APPLICA. Nessuna riga di qui scrive niente:
//    si restituiscono proposte con accanto IL MOTIVO per cui sono state fatte.
//    Un abbinamento sbagliato marca incassata una fattura che non lo è, e da lì
//    il sollecito non parte più e il credito si perde.
// 2. LA CERTEZZA È GRADUATA E DETTA. `certo` (il numero della fattura è nella
//    causale E l'importo è esattamente quello aperto) non è `probabile`
//    (acconto dichiarato, o cliente + importo). E ⛔ un abbinamento INCERTO NON
//    È UN ABBINAMENTO: sotto `probabile` la riga NON porta nessuna proposta —
//    porta le alternative, e decide l'utente. Non si applica «tanto è
//    probabile».
// 3. UN MOVIMENTO CHE NON ABBINA NON SPARISCE. Ogni riga del file esce di qui,
//    anche quella con la data illeggibile e quella in uscita, con scritto
//    perché. `riepilogoAbbinamento` conta separatamente entrate, uscite e
//    scartate, così la somma torna sempre con le righe del file.
//
// CHE COSA COPRE E CHE COSA NO — dichiarato, non lasciato intendere:
//  · COPERTI: il CSV con una colonna importo firmata, il CSV con due colonne
//    (entrate/uscite), il pagamento PARZIALE (acconto) e quello CUMULATIVO —
//    quest'ultimo in due modi, quando la causale nomina le fatture e quando il
//    cliente si riconosce ed esiste UNA SOLA combinazione delle sue fatture
//    aperte che fa quella cifra.
//  · FUORI, e con la ragione: (a) **MT940 e CAMT.053** (i tracciati SWIFT/ISO
//    che alcune banche esportano) — sono formati a blocchi, non tabellari, e
//    leggerli male vuol dire sbagliare gli importi in silenzio; l'utente
//    scarica il CSV, che ogni home banking italiano offre. (b) Il cumulativo
//    **senza cliente riconoscibile**: cercare la combinazione su tutto
//    l'archivio produce risposte sicure e sbagliate, perché di sottoinsiemi che
//    fanno la stessa somma ce n'è quasi sempre più d'uno. (c) I movimenti in
//    **uscita**: si elencano e si dichiarano, ma non si abbinano ai costi —
//    quello è un altro lavoro, e farlo a metà sarebbe peggio che non farlo.
//    (d) Gli anni a **due cifre** nelle date (12/07/26): si scartano con il
//    motivo scritto, invece di indovinare il secolo su una data contabile.
// ============================================================

/* L'IMPORTO, NEI FORMATI CHE GLI ESTRATTI CONTO SCRIVONO DAVVERO.
   ⛔ Misurato prima di irrigidire, come vuole CLAUDE.md: `numIt` da solo legge
   giusto 9 formati su 15 fra quelli raccolti dagli export bancari italiani.
   I sei che non passavano non chiedono un secondo `numIt` — chiedono una
   PULITURA prima: valuta appiccicata (`1.234,56 EUR`, `€ 1.234,56`), spazio o
   apostrofo come separatore delle migliaia (`1 234,56`, anche con lo spazio
   unificatore U+00A0 e quello stretto U+202F), segno DOPO il numero
   (`1.234,56-`, che i gestionali di derivazione mainframe scrivono così) e
   parentesi tonde per il negativo (`(1.234,56)`, stile contabile anglosassone).
   Poi decide `numIt`, che è la convenzione condivisa e non si riscrive. */
export function importoBancario(cella) {
  let s = String(cella == null ? "" : cella).trim();
  if (!s) return NaN;
  let segno = 1;
  const par = /^\((.*)\)$/.exec(s);
  if (par) { segno = -1; s = par[1].trim(); }
  s = s.replace(/[€$£]|\b(?:EUR|USD|GBP)\b/gi, "").trim();
  const coda = /^(.*?)([+-])$/.exec(s);
  if (coda) { if (coda[2] === "-") segno = -segno; s = coda[1].trim(); }
  s = s.replace(/[\s  ']/g, "");
  const n = numIt(s);
  return Number.isFinite(n) ? segno * n : NaN;
}

/* LA DATA. La forma italiana (GG/MM/AAAA, anche con - o .) diventa ISO; se la
   cella è già ISO si prende com'è. Poi ⛔ l'ESISTENZA la decide `dataISOEsiste`
   di `shared/`, che è la funzione giusta e sta lì da mesi: «2026-02-30» ha la
   forma di una data e non è una data, e `Date.parse` non la rifiuta — la fa
   SCORRERE al 2 marzo. Un movimento spostato di due giorni in silenzio falsa i
   giorni medi di pagamento del cliente.
   Gli anni a due cifre (12/07/26) restano fuori di proposito: il secolo si
   indovinerebbe, e su una data contabile è meglio una riga scartata a voce alta
   che una datata al 1926. */
export function isoDaDataItaliana(cella) {
  const s = String(cella == null ? "" : cella).trim();
  if (!s) return "";
  const m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/.exec(s);
  const iso = m ? `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}` : s.slice(0, 10);
  return dataISOEsiste(iso) ? iso : "";
}

/* IL FILE. Colonne: data;valuta;descrizione;importo — oppure, quando la banca
   tiene entrate e uscite in due colonne, data;valuta;descrizione;entrate;uscite.
   Le due forme si distinguono da sole: se le ultime DUE celle sono numeri
   leggibili è la seconda forma, e il movimento vale entrata meno uscita.
   ⛔ NESSUNA RIGA SPARISCE. Una riga con la data illeggibile o l'importo
   illeggibile esce lo stesso, con `scarto` scritto in italiano: un import muto
   è il modo migliore per perdere dei soldi senza accorgersene. */
const INTESTAZIONE_ESTRATTO = /^\s*"?(?:data|date)\b/i;
export function parseMovimentiCsv(text) {
  /* ⛔ SI LEGGE IL TESTO INTERO, NON RIGA PER RIGA — e non è una raffinatezza:
     è stato misurato il 01/08. Le banche la descrizione lunga la scrivono su
     PIÙ RIGHE dentro le virgolette, e spezzando il file sugli a-capo un
     bonifico da 12.300 € diventava due righe rotte, scartate tutt'e due. Lo
     scarto era dichiarato — quindi non silenzioso — ma il pagamento non si
     abbinava, e la fattura restava aperta con la sua mora che corre.
     `leggiCsv` sta in `shared/`: legge il testo come una macchina a stati,
     quindi l'a-capo dentro le virgolette è un carattere come gli altri, e
     decide il separatore una volta su TUTTO il file invece che per riga. */
  const out = [];
  for (const cel of leggiCsv(text).righe) {
    if (INTESTAZIONE_ESTRATTO.test(cel.join(";"))) continue;
    const [dataRaw, valutaRaw, descr, a, b] = cel;
    const data = isoDaDataItaliana(dataRaw);
    const ia = importoBancario(a), ib = importoBancario(b);
    let importo = NaN;
    if (Number.isFinite(ia) && Number.isFinite(ib)) importo = Math.abs(ia) - Math.abs(ib);
    else if (Number.isFinite(ia)) importo = ia;
    else if (Number.isFinite(ib)) importo = -Math.abs(ib);
    out.push({
      riga: out.length + 1,
      data,
      valuta: isoDaDataItaliana(valutaRaw),
      descrizione: String(descr || "").trim(),
      importo: Number.isFinite(importo) ? round2(importo) : null,
      scarto: !data ? (String(dataRaw || "").trim() ? "data non riconosciuta" : "data mancante")
            : !Number.isFinite(importo) ? "importo non leggibile in nessuna delle colonne" : "",
    });
  }
  return out;
}

/* IL NUMERO DELLA FATTURA DENTRO LA CAUSALE — dal verso giusto.
   I numeri delle nostre fatture li CONOSCIAMO: si cerca il numero dentro la
   causale, invece di indovinare quali gruppi di cifre della causale siano un
   numero di fattura. Il verso sbagliato prende per numero di fattura la data
   («31 luglio»), il numero del mandato e l'IBAN.
   Due risposte, e la differenza pesa nel grado: "pieno" = c'è il numero intero
   (2026/031, o rovesciato 031/2026); "progressivo" = c'è solo la parte
   progressiva ma preceduta da una parola che dice che è una fattura (FT 31,
   FATT. N. 31). Un «31» nudo non vale: in una causale il 31 è quasi sempre un
   giorno. "" = non c'è. */
const PAROLE_FATTURA = "(?:fatt(?:ura)?|ft|fra|doc(?:umento)?|n(?:r|um(?:ero)?)?)";
export function numeroInCausale(numero, causale) {
  const num = String(numero || "").trim();
  const txt = String(causale || "").toUpperCase().replace(/\s*\/\s*/g, "/").replace(/\s+/g, " ");
  if (!num || !txt) return "";
  const N = num.toUpperCase().replace(/\s*\/\s*/g, "/");
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (new RegExp(`(?:^|[^0-9A-Z])${esc(N)}(?![0-9])`).test(txt)) return "pieno";
  const p = /^(\d{4})[-/](\d{1,6})$|^(\d{1,6})[-/](\d{4})$/.exec(N);
  const conParola = (nudo) =>
    new RegExp(`${PAROLE_FATTURA}\\.?\\s*(?:N\\.?\\s*)?0*${nudo}(?![0-9])`, "i").test(txt);
  if (p) {
    const anno = p[1] || p[4], nudo = String(+(p[2] || p[3]));
    if (new RegExp(`(?:^|[^0-9])0*${nudo}[-/]${anno}(?![0-9])`).test(txt)) return "pieno";
    return conParola(nudo) ? "progressivo" : "";
  }
  return /^\d{1,6}$/.test(N) && conParola(String(+N)) ? "progressivo" : "";
}

/* IL NOME DEL CLIENTE DENTRO LA CAUSALE. Confronto morbido con `chiaveNome`,
   la stessa che in questa app tiene insieme «Rossi srl» e «Rossi S.r.l.»: qui
   non si riscrive una seconda normalizzazione. Due difese contro il falso
   positivo: le chiavi corte (meno di 4 caratteri) non valgono come indizio —
   «SPA» comparirebbe in mezza rubrica — e la forma societaria si toglie prima
   del secondo tentativo, perché la banca scrive «EDILCAVE» dove l'anagrafica
   dice «Edilcave Srl». */
export function clienteInCausale(nome, causale) {
  const k = chiaveNome(nome);
  if (!k || k.length < 4) return false;
  const c = chiaveNome(causale);
  if (!c) return false;
  if (c.includes(k)) return true;
  const corto = k.replace(/\b(?:srl|srls|spa|snc|sas|scarl|soc|societa|coop)\b/g, "").replace(/\s+/g, " ").trim();
  return corto.length >= 4 && c.includes(corto);
}

/* IL BONIFICO CUMULATIVO SENZA I NUMERI IN CAUSALE. Cerca i sottoinsiemi delle
   fatture aperte che sommano all'importo, e ⛔ risponde SOLO se la soluzione è
   UNA: due combinazioni che tornano non sono un abbinamento, sono una scelta —
   e una scelta la fa l'utente. Si fermano a `maxFatture` per due ragioni, e la
   seconda conta più della prima: il costo cresce come 2^n, ma soprattutto più
   fatture ci sono più è probabile che di combinazioni che tornano ce ne sia
   più d'una, cioè che la risposta sia inutile.
   I conti si fanno in CENTESIMI interi: 0,1 + 0,2 in virgola mobile non fa 0,3,
   e un abbinamento che dipende da quell'errore sarebbe irriproducibile. */
export function combinazioneUnica(aperti, importo, maxFatture = 10) {
  const lista = (aperti || []).filter((f) => f && +f.aperto > 0);
  if (lista.length < 2 || lista.length > maxFatture) return null;
  const cent = (v) => Math.round((+v || 0) * 100);
  const val = lista.map((f) => cent(f.aperto));
  let trovate = 0, prima = null;
  const giro = (i, resto, scelte) => {
    if (trovate > 1) return;
    if (resto === 0 && scelte.length >= 2) { trovate++; if (!prima) prima = scelte.slice(); return; }
    if (i >= val.length || resto <= 0) return;
    giro(i + 1, resto - val[i], scelte.concat(i));
    giro(i + 1, resto, scelte);
  };
  giro(0, cent(importo), []);
  return trovate === 1 ? prima.map((i) => lista[i]) : null;
}

/* I QUATTRO GRADI, in ordine di certezza. Solo i primi due portano una
   proposta; gli altri due portano il motivo e le alternative. */
export const GRADI_ABBINAMENTO = ["certo", "probabile", "debole", "nessuno"];
const CENT_ABB = (v) => Math.round((+v || 0) * 100);

/* ⛔ LO STESSO MOVIMENTO CARICATO DUE VOLTE. L'estratto conto lo si scarica a
   fine mese e lo si ricarica il mese dopo, e i giorni si sovrappongono quasi
   sempre. Senza questa guardia il secondo caricamento riproporrebbe gli stessi
   incassi, e confermarli li conterebbe due volte: la fattura risulterebbe
   sovra-incassata e i giorni medi di pagamento del cliente falsati.
   L'impronta è fattura + giorno + importo al centesimo: è quello che un
   estratto conto ripete identico, ed è l'unica cosa che si può confrontare. */
export function movimentoGiaRegistrato(mov, fatturaId, incassi) {
  const m = mov || {};
  const d = String(m.data || ""), i = CENT_ABB(m.importo);
  if (!d || !fatturaId) return false;
  return (incassi || []).some((x) => x && x.fatturaId === fatturaId
    && String(x.data || "").slice(0, 10) === d && CENT_ABB(x.importo) === i);
}

/* L'ABBINAMENTO. Prende i movimenti letti dal file e le fatture dell'archivio,
   e restituisce UNA RIGA PER MOVIMENTO più il riepilogo. Pura: non tocca
   niente, non scrive niente, non conosce il DOM. */
export function abbinaMovimenti(movimenti, fatture, incassi = [], clienti = [], note = null) {
  const conIncassi = applicaIncassi(fatture || [], incassi || []);
  const scheda = (f) => ({ id: f.id, numero: String(f.numero || ""),
    cliente: f.cliente || "", clienteId: f.clienteId || "",
    aperto: round2(apertoDi(f, note)), totale: round2(+f.importo || 0),
    scadenza: f.scadenza || null });
  const tutte = conIncassi.map(scheda);
  const aperte = tutte.filter((c) => c.aperto > 0.005);
  const chiuse = tutte.filter((c) => c.aperto <= 0.005);
  const nomeDi = (c) => {
    const an = (clienti || []).find((k) => k && k.id === c.clienteId);
    return (an && an.ragioneSociale) || c.cliente || "";
  };
  const righe = guardiaStessaFattura(
    (movimenti || []).map((m) => esitoMovimento(m, aperte, chiuse, nomeDi, incassi)), aperte);
  return { righe, riepilogo: riepilogoAbbinamento(righe) };
}

/* ⛔ DUE MOVIMENTI DELLO STESSO FILE CHE PROPONGONO LA STESSA FATTURA.
   Ogni riga viene giudicata da sola contro l'aperto DI PARTENZA — ed è giusto
   così, perché finché l'utente non conferma non è successo niente. Ma due
   bonifici uguali sulla stessa fattura uscivano tutt'e due «certo, saldo
   esatto», e chi conferma in blocco registra il doppio. Trovato in scratchpad
   il 05/08, prima che entrasse nel modulo.
   Non si sceglie per l'utente quale delle due vale: scendono TUTTE a `debole`,
   che è la regola — un abbinamento incerto non è un abbinamento. */
function guardiaStessaFattura(righe, aperte) {
  const per = new Map();
  for (const r of righe)
    if (r.grado === "certo" || r.grado === "probabile")
      for (const p of r.proposta) {
        if (!per.has(p.fatturaId)) per.set(p.fatturaId, []);
        per.get(p.fatturaId).push(p);
      }
  const sforate = new Set();
  for (const [id, voci] of per) {
    if (voci.length < 2) continue;
    const ap = (aperte.find((a) => a.id === id) || {}).aperto || 0;
    if (voci.reduce((t, v) => t + CENT_ABB(v.importo), 0) > CENT_ABB(ap)) sforate.add(id);
  }
  if (!sforate.size) return righe;
  return righe.map((r) => {
    const toccate = r.proposta.filter((p) => sforate.has(p.fatturaId));
    if (!toccate.length) return r;
    return { ...r, grado: "debole", proposta: [],
      alternative: r.proposta.map((p) => ({ fatturaId: p.fatturaId, numero: p.numero,
                                            cliente: p.cliente, aperto: p.aperto })),
      motivi: r.motivi.concat("stessa fattura in più movimenti"),
      perche: `più movimenti di questo file propongono la fattura ${toccate.map((p) => p.numero).join(", ")}`
        + " e insieme superano quello che resta aperto: confermarli tutti registrerebbe un incasso che non c'è."
        + " Scegli tu quale vale." };
  });
}

function esitoMovimento(m, aperte, chiuse, nomeDi, incassi) {
  const base = { riga: m.riga, data: m.data, descrizione: m.descrizione, importo: m.importo,
                 proposta: [], alternative: [], motivi: [], giaRegistrato: false };
  if (m.scarto) return { ...base, verso: "scartato", grado: "nessuno", perche: m.scarto };
  if (!(m.importo > 0))
    return { ...base, verso: m.importo < 0 ? "uscita" : "entrata", grado: "nessuno",
             perche: m.importo < 0
               ? "movimento in uscita: qui si abbinano gli incassi, e i pagamenti che escono si registrano fra i costi"
               : "movimento a zero: non c'è nessun incasso da abbinare" };

  const misura = (c) => ({ ...c, num: numeroInCausale(c.numero, m.descrizione),
                           cli: clienteInCausale(nomeDi(c), m.descrizione),
                           diff: CENT_ABB(m.importo) - CENT_ABB(c.aperto) });
  const cand = aperte.map(misura);
  const conNumero = cand.filter((c) => c.num);
  const esatte = cand.filter((c) => c.diff === 0);
  const cliCand = cand.filter((c) => c.cli);
  const nomi = (l) => l.map((c) => c.numero).join(", ");
  const eur = (cent) => euroIt(Math.abs(cent) / 100);

  // (a) CUMULATIVO DICHIARATO: la causale nomina più fatture e la somma torna.
  if (conNumero.length >= 2 && conNumero.reduce((t, c) => t + CENT_ABB(c.aperto), 0) === CENT_ABB(m.importo))
    return proponi(base, "certo", conNumero,
      `la causale nomina ${conNumero.length} fatture (${nomi(conNumero)}) e la somma di quello che resta aperto fa esattamente ${euroIt(m.importo)} €`,
      ["numeri in causale", "somma esatta"], incassi);

  // (b) UNA SOLA FATTURA NOMINATA IN CAUSALE.
  if (conNumero.length === 1) {
    const c = conNumero[0];
    const eti = c.num === "pieno" ? "numero in causale" : "numero (progressivo) in causale";
    if (c.diff === 0)
      return proponi(base, "certo", [c],
        `la causale nomina la fattura ${c.numero} e l'importo è esattamente quello che resta aperto`,
        [eti, "importo esatto"], incassi);
    if (c.diff < 0)
      return proponi(base, "probabile", [c],
        `la causale nomina la fattura ${c.numero}, ma l'importo è più basso di ${eur(c.diff)} €: è un acconto, e la fattura resta aperta per quella cifra`,
        [eti, "pagamento parziale"], incassi);
    return decidi(base, [c].concat(esatte),
      `la causale nomina la fattura ${c.numero} ma l'importo la supera di ${eur(c.diff)} €: può pagare anche dell'altro, e a dirlo devi essere tu`,
      [eti, "importo più alto della fattura"]);
  }
  if (conNumero.length >= 2)
    return decidi(base, conNumero,
      `la causale nomina ${conNumero.length} fatture (${nomi(conNumero)}) ma la somma di quello che resta aperto non fa ${euroIt(m.importo)} €: scegli tu quali paga, e per quanto`,
      ["più numeri in causale", "somma che non torna"]);

  /* (b bis) IL NUMERO C'È MA LA FATTURA È GIÀ SALDATA — e va DETTO.
     ⛔ È il caso in cui tacere costa di più: senza questa risposta la riga
     usciva con «nella causale non si riconosce niente», che è falso e manda a
     cercare dalla parte sbagliata. Qui invece si nomina la fattura e si dice
     che è già a posto: o l'incasso è già registrato, o c'è un pagamento doppio
     da verificare col cliente. */
  const saldate = chiuse.map((c) => ({ ...c, num: numeroInCausale(c.numero, m.descrizione) }))
    .filter((c) => c.num);
  if (saldate.length) {
    const una = saldate.length === 1;
    /* ⛔ E PRIMA DI TUTTO: È PROPRIO QUESTO MOVIMENTO, GIÀ REGISTRATO?
       È il caso più frequente di tutti — l'estratto conto ricaricato il mese
       dopo, coi giorni che si sovrappongono. La prima stesura rispondeva «o
       l'incasso è già registrato oppure c'è un pagamento doppio»: vera ma
       tiepida, quando invece la risposta si SA. Trovata dalla prova, che
       pretendeva `giaRegistrato` e otteneva `false`. */
    const stesse = saldate.filter((c) => movimentoGiaRegistrato(m, c.id, incassi));
    if (stesse.length)
      return { ...base, verso: "entrata", grado: "nessuno", giaRegistrato: true,
        proposta: stesse.map((c) => ({ fatturaId: c.id, numero: c.numero, cliente: c.cliente,
                                       aperto: c.aperto, importo: m.importo })),
        motivi: ["numero in causale", "già registrato"],
        perche: `questo movimento è già registrato sulla fattura ${nomi(stesse)}, con la stessa data e lo stesso importo:`
          + " registrarlo di nuovo lo conterebbe due volte" };
    return { ...base, verso: "entrata", grado: "nessuno",
      motivi: ["numero in causale", "fattura già saldata"],
      perche: `la causale nomina ${una ? "la fattura" : "le fatture"} ${nomi(saldate)}, che risulta${una ? "" : "no"} già saldat${una ? "a" : "e"}:`
        + " se il bonifico è vero, o l'incasso è già stato registrato oppure c'è un pagamento doppio da verificare col cliente" };
  }

  // (c) NESSUN NUMERO: si ragiona su importo e cliente.
  const esatteCliente = esatte.filter((c) => c.cli);
  if (esatteCliente.length === 1)
    return proponi(base, "probabile", esatteCliente,
      `la causale non porta nessun numero di fattura, ma il nome «${nomeDi(esatteCliente[0])}» c'è e l'importo coincide con la sua unica fattura aperta da ${euroIt(m.importo)} €`,
      ["cliente in causale", "importo esatto"], incassi);
  if (esatteCliente.length > 1)
    return decidi(base, esatteCliente,
      `${esatteCliente.length} fatture dello stesso cliente hanno esattamente questo importo (${nomi(esatteCliente)}): non è un abbinamento, è una scelta`,
      ["cliente in causale", "più fatture con lo stesso importo"]);

  // (d) CUMULATIVO NON DICHIARATO: col cliente riconosciuto e UNA sola
  //     combinazione. Più di una combinazione che torna è una scelta, non un esito.
  if (cliCand.length >= 2 && !esatte.length) {
    const comb = combinazioneUnica(cliCand, m.importo);
    if (comb)
      return proponi(base, "probabile", comb,
        `il nome «${nomeDi(cliCand[0])}» è nella causale e c'è una sola combinazione delle sue fatture aperte che fa ${euroIt(m.importo)} €: ${nomi(comb)}`,
        ["cliente in causale", "combinazione unica"], incassi);
  }
  if (cliCand.length)
    return decidi(base, cliCand.concat(esatte),
      `il cliente si riconosce nella causale, ma nessuna sua fattura aperta${cliCand.length >= 2 ? " — né una combinazione unica delle sue fatture —" : ""} fa ${euroIt(m.importo)} €:`
      + " può essere un acconto o un pagamento cumulativo, e a dirlo devi essere tu",
      ["cliente in causale", "importo che non torna"]);
  if (esatte.length === 1)
    return decidi(base, esatte,
      `una sola fattura aperta ha questo importo (${esatte[0].numero}), ma nella causale non c'è né il suo numero né il nome del cliente`,
      ["solo importo esatto"]);
  if (esatte.length > 1)
    return decidi(base, esatte,
      `${esatte.length} fatture aperte hanno questo importo (${nomi(esatte)}) e la causale non dice di chi è: scegli tu`,
      ["più fatture con lo stesso importo"]);

  // (e) NIENTE — e il perché va detto per esteso, perché è la riga che l'utente
  //     dovrà lavorare a mano.
  const clienteAltrove = chiuse.some((c) => clienteInCausale(nomeDi(c), m.descrizione));
  return { ...base, verso: "entrata", grado: "nessuno",
    perche: !aperte.length
      ? "non c'è nessuna fattura aperta con cui confrontare questo movimento"
      : clienteAltrove
        ? "il cliente della causale si riconosce, ma non ha nessuna fattura ancora aperta: o l'incasso è già registrato, o questo bonifico paga qualcosa che non è una fattura"
        : "nella causale non si riconosce né un numero di fattura né il nome di un cliente, e nessuna fattura aperta ha questo importo" };
}

/* Una riga CON proposta. L'importo proposto è tutto il movimento quando la
   fattura è una sola (così l'acconto entra per quello che è arrivato) e
   l'aperto di ciascuna quando sono più d'una. */
function proponi(base, grado, cand, perche, motivi, incassi) {
  const proposta = cand.map((c) => ({ fatturaId: c.id, numero: c.numero, cliente: c.cliente,
    aperto: c.aperto, importo: cand.length === 1 ? base.importo : c.aperto }));
  if (proposta.every((p) => movimentoGiaRegistrato(base, p.fatturaId, incassi)))
    return { ...base, verso: "entrata", grado: "nessuno", giaRegistrato: true, proposta,
      motivi: motivi.concat("già registrato"),
      perche: `su ${proposta.length === 1 ? "questa fattura" : "queste fatture"} c'è già un incasso con la stessa data e lo stesso importo:`
        + " registrarlo di nuovo lo conterebbe due volte" };
  return { ...base, verso: "entrata", grado, proposta, motivi, perche };
}

/* Una riga SENZA proposta, da decidere a mano, con i candidati da scegliere. */
function decidi(base, cand, perche, motivi) {
  const visti = new Set();
  const alternative = cand.filter((c) => c && !visti.has(c.id) && visti.add(c.id))
    .map((c) => ({ fatturaId: c.id, numero: c.numero, cliente: c.cliente, aperto: c.aperto }));
  return { ...base, verso: "entrata", grado: "debole", alternative, motivi, perche };
}

/* IL RIEPILOGO, con la bandiera.
   ⛔ L'ASSENZA DI UN DATO NON È UN DATO FAVOREVOLE: zero movimenti da decidere
   perché nessun estratto conto è mai stato caricato NON è «tutto abbinato».
   Perciò `misurabile` dice se c'è stato qualcosa da guardare, e `perche` lo
   scrive; la schermata legge quella bandiera e mostra lo stato vuoto invece dei
   contatori a zero, che sarebbero tutti tranquilli e tutti senza significato.
   E le tre categorie sommano SEMPRE a `letti` (entrate + uscite + scartati):
   se un giorno non tornassero, vorrebbe dire che una riga del file è sparita. */
export function riepilogoAbbinamento(righe) {
  const r = righe || [];
  const daConfermare = r.filter((x) => x.grado === "certo" || x.grado === "probabile");
  return {
    letti: r.length,
    entrate: r.filter((x) => x.verso === "entrata").length,
    uscite: r.filter((x) => x.verso === "uscita").length,
    scartati: r.filter((x) => x.verso === "scartato").length,
    certi: r.filter((x) => x.grado === "certo").length,
    probabili: r.filter((x) => x.grado === "probabile").length,
    daConfermare: daConfermare.length,
    daDecidere: r.filter((x) => x.grado === "debole").length,
    senzaCandidato: r.filter((x) => x.grado === "nessuno" && x.verso === "entrata" && !x.giaRegistrato).length,
    giaRegistrati: r.filter((x) => x.giaRegistrato).length,
    importoDaConfermare: round2(daConfermare.reduce((t, x) => t + (+x.importo || 0), 0)),
    misurabile: r.length > 0,
    perche: r.length ? "" : "nessun estratto conto caricato: non è ancora stato confrontato niente",
  };
}

/* UN ESTRATTO CONTO D'ESEMPIO, scritto come lo esporta una banca italiana:
   separatore punto e virgola, data GG/MM/AAAA, importi con il punto delle
   migliaia e la virgola dei decimali. Serve a due cose: far provare la
   schermata a chi non ha un file sotto mano, e ⛔ tenere in casa i casi che
   questa funzione esiste per raccontare — l'acconto, il saldo, il cumulativo,
   il movimento in uscita, quello già registrato e quello che non abbina.
   ⚠️ È scritto A MANO e non generato dal nostro esportatore, di proposito: un
   giro scrivi→leggi dimostra che le nostre due metà vanno d'accordo FRA LORO,
   non che il formato sia quello che scrive la banca. Le prove guardano il
   TESTO di questa costante (`;18.300,00`, `21/07/2026`), non solo il risultato. */
export const ESTRATTO_ESEMPIO = [
  "Data;Data valuta;Descrizione;Importo",
  "02/07/2026;02/07/2026;BONIFICO DA EDILCAVE SRL ACCONTO FATT 2026/031;6.000,00",
  "14/07/2026;14/07/2026;BONIFICO ORD: STRADESUD SALDO FATT 2026/034;9.750,00",
  "16/07/2026;16/07/2026;BONIFICO COMUNE DI MODICA MANDATO 4412;8.100,00",
  "18/07/2026;18/07/2026;BONIFICO A NS FAVORE;5.900,00",
  "20/07/2026;20/07/2026;COMMISSIONI E SPESE DI TENUTA CONTO;-4,50",
  "21/07/2026;21/07/2026;BONIFICO DA EDILCAVE SRL SALDO FATT 2026/031;12.300,00",
  "22/07/2026;22/07/2026;VERSAMENTO CONTANTI;1.000,00",
  "23/07/2026;23/07/2026;BONIFICO DA CAVE DEL SUD;4.400,00",
].join("\n") + "\n";

// ============================================================
// PREVENTIVO E CONFERMA D'ORDINE (N9)
// ------------------------------------------------------------
// Fino a oggi il ciclo di Conti partiva dalla PESATA: il primo documento che
// l'app conosceva era il DDT di un camion già carico. Ma in cava prima del
// camion c'è una richiesta d'offerta, un prezzo che si tiene fermo per un po',
// e una conferma. Senza quel pezzo l'app non sa rispondere alla domanda con
// cui si programma la settimana: «quanto materiale ho già venduto e non ho
// ancora consegnato?».
//
// UN DOCUMENTO SOLO, NON DUE. Il preventivo accettato DIVENTA l'ordine: stesso
// documento, stesse righe, stato che cambia e un numero d'ordine in più. Due
// documenti separati vorrebbero dire due liste da tenere allineate, e la prima
// volta che qualcuno modifica una riga solo di qua le due si staccano.
//
// ⛔ LO SCADUTO E IL RIFIUTATO NON SONO VENDUTO. È la ragione per cui
//    `portafoglioOrdini` filtra su `ordineConfermato` e non sulla presenza del
//    documento: un preventivo che il cliente non ha mai firmato, contato nel
//    venduto, è materiale che non uscirà mai dal piazzale.
//
// ⛔ E «QUANTO È STATO CONSEGNATO» NON È SEMPRE UN NUMERO. Un ordine di cui
//    non si sa quanto è stato consegnato NON è «0% consegnato»: uno zero
//    racconta «non ancora cominciato», che è una cosa che si sa. Qui la
//    risposta è la bandiera `misurabile` con il suo `perche`, e la pagina la
//    legge PRIMA di disegnare la barra. I tre casi che la fanno scattare sono
//    di mestiere, non di codice:
//    1. la riga è senza quantità ordinata — è una fornitura «a chiamata»,
//       prezzo bloccato e quantità da vedersi: non esiste una frazione;
//    2. un DDT agganciato non ha una quantità nell'unità dell'ordine (venduto
//       a metro cubo senza densità, oppure arrivato da un import senza netto);
//    3. lo stesso prodotto è ordinato in due unità e manca la densità per
//       sommarle.
//    E c'è un quarto caso che NON è una non-misurabilità ma le somiglia, e
//    andava separato: zero consegnato con dei DDT di quel cliente e di quel
//    prodotto che nessuno ha agganciato a nessun ordine. Lì il numero è vero
//    (agganciato non c'è niente) ma è probabile che sia una svista, quindi
//    `daAgganciare` li CONTA e la pagina li offre da collegare. Un fatto
//    accanto al numero, non un'inferenza al posto del numero.
//
// Collezione: ordini/{id} = { numero (serie PREV/AAAA/NNN), numeroOrdine
//   (serie ORD/AAAA/NNN, assegnato all'accettazione), data (ISO), validoAl
//   (ISO), clienteId, cliente (testo di ripiego), stato, decisoIl (ISO),
//   righe [], note, riferimento (la richiesta del cliente) }.
// Sulle pesate compare un campo in più, facoltativo: `ordineId`. Le pesate di
// prima non ce l'hanno e non cambiano di una virgola.
// ============================================================

/* ⚠️ SI CHIAMA `STATI_PREVENTIVO` E NON `STATI_ORDINE` PERCHÉ QUEL NOME È GIÀ
   PRESO: Flotta lo esporta per gli ORDINI DI LAVORO dell'officina
   (`flotta-data.js:1574`), che con un ordine di un cliente non c'entrano
   niente. Due app che esportano lo stesso nome per due cose diverse è
   esattamente ciò che `nomi-doppi.mjs` esiste per prendere. */
export const STATI_PREVENTIVO = [
  { id: "bozza", label: "Bozza", cls: "", spiega: "Ci stai ancora lavorando: il cliente non l'ha visto." },
  { id: "inviato", label: "Inviato", cls: "warn", spiega: "Mandato al cliente, in attesa di risposta." },
  { id: "accettato", label: "Accettato", cls: "ok", spiega: "Il cliente ha confermato: da qui in poi è un ordine, e i DDT gli si agganciano." },
  { id: "rifiutato", label: "Rifiutato", cls: "danger", spiega: "Il cliente ha detto di no. Non entra nel venduto." },
  { id: "annullato", label: "Annullato", cls: "", spiega: "Ritirato prima della risposta. Non entra nel venduto." },
];
export function statoPreventivoLabel(id) {
  return STATI_PREVENTIVO.find((s) => s.id === String(id || "")) || STATI_PREVENTIVO[0];
}

/* ⛔ LO STATO VERO DI UN PREVENTIVO È IN PARTE CALCOLATO, come per le fatture
   (`statoScadenzaFattura`, che questa funzione imita di proposito): «scaduto»
   non lo scrive nessuno, lo dice il calendario. Un preventivo inviato il cui
   `validoAl` è passato è scaduto anche se nessuno l'ha toccato.
   ⚠️ E L'ACCETTAZIONE FERMA L'OROLOGIO. La validità serve fino alla firma: un
   ordine confermato a giugno non «scade» a luglio perché l'offerta durava
   trenta giorni — quello è un impegno preso, e va consegnato. Fino a metà
   stesura questa funzione guardava la data anche sugli accettati, e un ordine
   vivo sarebbe uscito dal portafoglio da solo.
   ⛔ E «senza-validita» È UNO STATO SUO. Un'offerta senza data di scadenza è
   un prezzo bloccato per sempre, e in cava i prezzi degli inerti si muovono
   col gasolio: farla passare per «valida» è il numero tranquillo dove non è
   stato deciso niente. Una BOZZA invece resta bozza: non è stata mandata a
   nessuno, quindi non c'è nessuna promessa da datare. */
export function statoPreventivo(ordine, oggi = new Date()) {
  const o = ordine || {};
  const s = String(o.stato || "bozza");
  if (s === "accettato" || s === "rifiutato" || s === "annullato") return { stato: s, giorni: null };
  if (s === "bozza") return { stato: "bozza", giorni: null };
  /* ⚠️ `dataISOEsiste` PRIMA di contare i giorni, e non è pignoleria: una
     prova ha preso il difetto mentre la si scriveva. `new Date("2026-02-30")`
     non fallisce — JS fa SCORRERE il giorno che non esiste al 2 marzo — quindi
     `giorni()` restituisce un numero e un'offerta con la data storta usciva
     «scaduta» invece che «senza validità». È lo stesso errore che il 01/08 la
     `isDate` di `run-demo.mjs` faceva su questa identica data, e la funzione
     giusta era in `shared/` da mesi: qui non se ne scrive una seconda. */
  const g = dataISOEsiste(String(o.validoAl || "").slice(0, 10)) ? giorni(o.validoAl, oggi) : NaN;
  if (!Number.isFinite(g)) return { stato: "senza-validita", giorni: null };
  if (g < 0) return { stato: "scaduto", giorni: g };
  return { stato: "inviato", giorni: g };
}

// Un preventivo è un ORDINE solo se è stato accettato. Scritto una volta e
// usato ovunque serva, così «che cosa entra nel venduto» è deciso in un posto.
export function ordineConfermato(ordine, oggi = new Date()) {
  return statoPreventivo(ordine, oggi).stato === "accettato";
}

/* RIGA DI PREVENTIVO — i numeri si FOTOGRAFANO, come in `rigaPesata`: se
   domani il listino cambia o il cliente cambia condizioni, l'offerta già
   mandata resta quella che è stata mandata.
   L'unità può essere diversa da quella del listino (si ordina a metro cubo un
   prodotto listinato a tonnellata: succede sui riempimenti), e allora il
   prezzo si converte con la densità — dalle stesse formule di
   `prezzoPerTonnellata`/`prezzoPerMetroCubo`, non da altre. Senza densità il
   prezzo è `null`: meglio nessun numero che un numero falso.
   ⛔ E la quantità VUOTA resta `null`, non zero. `+null` fa 0 e
   `Number.isFinite(0)` risponde true: è la trappola che questo file documenta
   in altri tre punti, e qui produrrebbe un'offerta di zero tonnellate.

   ⛔ ED È QUI CHE VIVE LO SCAGLIONE, non sul DDT, e la ragione è di mestiere:
   lo scaglione si decide sulla quantità **della trattativa**, e un DDT è un
   camion. Sceglierlo sulla portata di un autocarro vorrebbe dire far pagare il
   prezzo del privato — 28 t alla volta — a chi ha comprato 5.000 t per un
   cantiere: esattamente il difetto che questa funzione esiste per togliere.
   Chi vende a scaglioni fa un'offerta; chi non la fa vende a listino, come
   prima. (Che il DDT agganciato a un ordine erediti il prezzo dell'ordine è
   una cosa che oggi NON succede — non succedeva nemmeno prima — ed è un
   cantiere suo, dichiarato e non fatto qui.) */
export function rigaPreventivo(prodotto, quantita, cliente, unitaScelta) {
  const p = prodotto || {};
  const unitaListino = p.unitaPrezzo === "m3" ? "m3" : "t";
  const unita = unitaScelta === "t" || unitaScelta === "m3" ? unitaScelta : unitaListino;
  const dens = densitaValida(p);
  const dich = quantita != null && String(quantita).trim() !== "" && Number.isFinite(+quantita);
  const q = dich ? round3(+quantita) : null;
  /* prezzo e sconto vengono da `applicaScaglione`: è l'unico posto in cui la
     banda e lo sconto del cliente si mettono insieme. Un prodotto senza scala
     ne esce con il listino e lo sconto cliente, cioè identico a prima. */
  const a = applicaScaglione(p, q, unita, cliente);
  const prezzoUnitario = a.prezzoUnitario;
  const scontoPct = a.scontoPct;
  const imponibile = (q == null || prezzoUnitario == null) ? null
    : imponibileRiga(q, prezzoUnitario, scontoPct);
  return { prodottoId: p.id || null, descrizione: String(p.nome || "Prodotto"),
           quantita: q, unita, densita: dens || null, prezzoUnitario, scontoPct,
           aliquota: Math.max(0, +p.iva || 0), imponibile,
           /* che cosa ha deciso il prezzo, FOTOGRAFATO come tutto il resto: un
              prezzo che cambia senza dire perché è un prezzo che il cliente
              contesta. `null` per i prodotti senza scala (e per le righe
              salvate prima di oggi, che restano quello che sono). */
           scaglione: a.scaglione.banda && !a.scaglione.banda.implicita
             ? { da: a.scaglione.banda.da, a: a.scaglione.banda.a, unita: a.scaglione.unita,
                 tipo: a.scaglione.tipo, prezzo: a.scaglione.prezzoScala,
                 sconto: a.scaglione.scontoScaglione }
             : null,
           scontoCliente: a.scontoCliente, scontoScaglione: a.scontoScaglione,
           /* la ragione per cui il prezzo manca, quando manca: la pagina deve
              distinguere «scrivi la densità» da «è una fornitura a chiamata». */
           motivoSenzaPrezzo: prezzoUnitario != null ? ""
             : (a.scaglione.motivo && a.scaglione.motivo !== "nessuna-scala"
                ? a.scaglione.motivo : "densita-mancante") };
}

/* Totali del preventivo: passano da `totaliDaRighe`, la stessa funzione della
   fattura. Due conti diversi sullo stesso imponibile darebbero un preventivo e
   una fattura che non tornano, ed è la cosa che il cliente nota per prima.
   Le righe senza importo (quantità da vedersi) NON entrano nel totale e si
   CONTANO a parte: un totale che esclude qualcosa senza dirlo è un totale che
   inganna — la stessa regola delle gare senza base d'asta. */
export function totaliPreventivo(ordine) {
  const righe = ((ordine || {}).righe || []).filter(Boolean);
  const conImporto = righe.filter((r) => r.imponibile != null);
  const t = totaliDaRighe(conImporto);
  return { ...t, righe: righe.length, senzaImporto: righe.length - conImporto.length };
}

/* Come si riconosce «lo stesso prodotto» fra una riga d'ordine e un DDT:
   l'id se c'è, il nome altrimenti (i DDT vecchi e gli import hanno solo il
   nome). Scritto una volta perché lo usano l'aggancio e i candidati. */
function chiaveProdotto(x) {
  const id = x && x.prodottoId;
  if (id != null && String(id).trim() !== "") return "id:" + String(id);
  return "nome:" + String((x && (x.descrizione || x.prodotto)) || "").trim().toLowerCase();
}

/* Quantità di un DDT letta nell'unità chiesta. `null` = non si sa, e non è
   zero: un DDT venduto a metro cubo senza densità non si converte, e uno
   arrivato da un import senza netto non dichiara niente. Ripiegare su
   `+p.netto || 0` darebbe una consegna di ZERO tonnellate — cioè un numero
   tranquillo dove non è stato misurato niente. */
function quantitaDdtIn(pesata, unita) {
  const p = pesata || {};
  const uP = p.unitaVendita === "m3" ? "m3" : "t";
  const dich = (v) => v != null && String(v).trim() !== "" && Number.isFinite(+v);
  const q = dich(p.quantita) ? +p.quantita : (uP === "t" && dich(p.netto) ? +p.netto : null);
  if (q == null) return null;
  return uP === unita ? round3(q) : convertiQuantita(q, uP, unita, p.densita);
}

/* CONSEGNATO PER PRODOTTO — e «per prodotto» non è un dettaglio: si aggrega
   per prodotto e non per riga. Un ordine può avere due righe dello stesso
   prodotto a prezzi diversi (500 t a 12 €/t più 300 t del secondo lotto a 11
   €/t: in cava è la norma), e un DDT non dice a quale delle due appartiene.
   Attribuendoli alla prima riga si otteneva 160% su una e 0% sull'altra —
   trovato in prototipo, prima di scriverlo qui. */
export function consegnatoOrdine(ordine, pesate) {
  const o = ordine || {};
  const righe = (o.righe || []).filter(Boolean);
  const agganciate = (pesate || []).filter((p) =>
    p && o.id != null && String(p.ordineId || "") === String(o.id));
  const per = new Map();
  for (const r of righe) {
    const k = chiaveProdotto(r);
    const g = per.get(k) || { chiave: k, descrizione: r.descrizione, unita: r.unita,
      ordinato: 0, consegnato: 0, ddt: [], righe: 0, misurabile: true, perche: "" };
    g.righe++;
    if (r.quantita == null) {
      g.misurabile = false;
      if (!g.perche) g.perche = "una riga è senza quantità ordinata (è una fornitura a chiamata)";
    } else if (r.unita !== g.unita) {
      const c = convertiQuantita(r.quantita, r.unita, g.unita, r.densita);
      if (c == null) { g.misurabile = false;
        if (!g.perche) g.perche = "due righe dello stesso prodotto in unità diverse, e manca la densità per sommarle"; }
      else g.ordinato = round3(g.ordinato + c);
    } else g.ordinato = round3(g.ordinato + r.quantita);
    per.set(k, g);
  }
  /* Un DDT agganciato all'ordine ma di un prodotto che nell'ordine non c'è NON
     consuma l'ordine: il cliente ha ordinato pietrisco, quel carico di sabbia
     è un'altra cosa. Si tiene a parte e si dice, invece di sparire. */
  const fuoriOrdine = [];
  for (const p of agganciate) {
    const g = per.get(chiaveProdotto(p));
    if (!g) { fuoriOrdine.push(p); continue; }
    g.ddt.push(p.numero || "—");
    const q = quantitaDdtIn(p, g.unita);
    if (q == null) {
      g.misurabile = false;
      if (!g.perche) g.perche = "il DDT " + (p.numero || "—") + " non ha una quantità nell'unità dell'ordine";
      continue;
    }
    g.consegnato = round3(g.consegnato + q);
  }
  /* Il residuo tiene il SEGNO. Consegnare più dell'ordinato succede — l'ultimo
     camion carica un po' di più — e un residuo bloccato a zero lo nasconderebbe
     proprio a chi deve fatturarlo. */
  const prodotti = [...per.values()].map((g) => ({ ...g,
    residuo: g.misurabile ? round3(g.ordinato - g.consegnato) : null }));
  return { prodotti, fuoriOrdine, ddtAgganciati: agganciate.length };
}

/* I DDT CHE NESSUNO HA AGGANCIATO. Stesso cliente, stesso prodotto dell'ordine,
   senza `ordineId`, non anteriori al preventivo. Non è un'inferenza: quei
   documenti esistono davvero, e servono a distinguere «non è ancora partito
   niente» da «è partito e nessuno l'ha collegato». La pagina li offre da
   agganciare, così l'avviso diventa un gesto invece che un rimprovero. */
export function ddtDaAgganciare(ordine, pesate) {
  const o = ordine || {};
  const chiavi = new Set((o.righe || []).filter(Boolean).map(chiaveProdotto));
  const dal = String(o.data || "");
  return (pesate || []).filter((p) => p
    && !(p.ordineId != null && String(p.ordineId).trim() !== "")
    && o.clienteId && String(p.clienteId || "") === String(o.clienteId)
    && chiavi.has(chiaveProdotto(p))
    && (!dal || String(p.data || "") >= dal))
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")));
}

/* AVANZAMENTO DELL'ORDINE. `percentuale` è `null` quando non si può misurare,
   e la bandiera `misurabile` con il suo `perche` dicono perché: è il principio
   del fondatore applicato a una barra di avanzamento, che è il posto dove uno
   zero mente meglio di tutti. */
export function avanzamentoOrdine(ordine, pesate) {
  const c = consegnatoOrdine(ordine, pesate);
  const base = { ...c, daAgganciare: ddtDaAgganciare(ordine, pesate).length };
  if (!c.prodotti.length)
    return { ...base, percentuale: null, misurabile: false, perche: "il preventivo non ha righe" };
  const cieche = c.prodotti.filter((x) => !x.misurabile);
  if (cieche.length)
    return { ...base, percentuale: null, misurabile: false,
      perche: cieche.length === c.prodotti.length ? cieche[0].perche
        : "su " + cieche.length + " prodotti di " + c.prodotti.length + " manca il dato — " + cieche[0].perche };
  const ordinato = c.prodotti.reduce((t, x) => t + x.ordinato, 0);
  if (!(ordinato > 0))
    return { ...base, percentuale: null, misurabile: false,
      perche: "l'ordinato è zero, e non c'è nessuna frazione da calcolare" };
  const consegnato = c.prodotti.reduce((t, x) => t + x.consegnato, 0);
  return { ...base, percentuale: Math.round(100 * consegnato / ordinato), misurabile: true, perche: "" };
}

/* La frase che accompagna l'avanzamento. Vive QUI e non nella pagina perché
   «come si racconta una non-misurabilità» è una decisione sola: scritta nella
   pagina, il giorno che serve anche nel report se ne scriverebbe una seconda,
   diversa (regola 7 di CLAUDE.md). La pagina legge `misurabile` per il colore
   della barra e questa funzione per il testo. */
export function descriviAvanzamento(av) {
  const a = av || {};
  if (!a.misurabile) return "Quanto è stato consegnato non si può misurare: " + (a.perche || "dato mancante") + ".";
  if (a.percentuale === 0 && a.daAgganciare > 0)
    /* «ce ne sono 1» non lo scrive nessuno: il singolare va scritto, come per
       «1 fattura aperta». Un testo che si vede solo quando il numero è uno
       resta sbagliato per mesi, perché il caso più frequente è il plurale. */
    return "Nessun DDT agganciato a quest'ordine, ma "
      + (a.daAgganciare === 1 ? "ce n'è 1" : "ce ne sono " + a.daAgganciare)
      + " di questo cliente e di questi prodotti senza ordine: controlla se vanno collegati.";
  if (a.percentuale === 0) return "Non è ancora partito niente: nessun DDT agganciato.";
  if (a.percentuale > 100) return "Consegnato più dell'ordinato: controlla il residuo prodotto per prodotto.";
  if (a.percentuale >= 100) return "Ordine consegnato per intero.";
  return "Consegnato il " + a.percentuale + "% dell'ordinato.";
}

/* PORTAFOGLIO ORDINI: quanto vale il confermato. È la cifra con cui si
   programma la settimana, e per questo NON deve contenere né gli scaduti né i
   rifiutati — un preventivo che nessuno ha firmato, contato nel venduto, è
   materiale che non uscirà mai dal piazzale.
   ⛔ E dichiara quanti ordini non sa misurare, invece di contarli come pieni o
   come vuoti: `nonMisurabili` è la parte del portafoglio di cui non si sa se è
   ancora da consegnare.
   ⛔ `senzaImporto` È LA STESSA DIFESA SUL VALORE, e senza di lei il difetto
   sarebbe passato: una fornitura a chiamata ha righe con l'imponibile `null`,
   e `totaliPreventivo` le esclude dal totale — giustamente, perché non c'è
   niente da sommare. Ma allora il valore del portafoglio è PARZIALE, e un
   totale che esclude qualcosa senza dirlo è un totale che inganna. Trovato
   guardando i dati d'esempio: l'ordine a chiamata compariva nel conto degli
   ordini e valeva zero euro, in silenzio. */
export function portafoglioOrdini(ordini, pesate, oggi = new Date()) {
  let valore = 0, quanti = 0, nonMisurabili = 0, daConsegnare = 0, completati = 0, senzaImporto = 0;
  for (const o of ordini || []) {
    if (!ordineConfermato(o, oggi)) continue;
    quanti++;
    const t = totaliPreventivo(o);
    valore = round2(valore + t.imponibile);
    if (t.senzaImporto > 0) senzaImporto++;
    const a = avanzamentoOrdine(o, pesate);
    if (!a.misurabile) nonMisurabili++;
    else if (a.percentuale >= 100) completati++;
    else daConsegnare++;
  }
  return { quanti, valore, daConsegnare, completati, nonMisurabili, senzaImporto };
}

/* I preventivi che chiedono una mossa, dal più urgente. Un'offerta inviata
   scade da sola: se nessuno la richiama, il prezzo che si era tenuto fermo
   sparisce e nessuno se n'è accorto. */
export function preventiviDaSeguire(ordini, oggi = new Date(), entroGiorni = 7) {
  const out = [];
  for (const o of ordini || []) {
    const s = statoPreventivo(o, oggi);
    if (s.stato === "scaduto") out.push({ ordine: o, stato: s.stato, giorni: s.giorni, urgenza: 0 });
    else if (s.stato === "senza-validita") out.push({ ordine: o, stato: s.stato, giorni: null, urgenza: 1 });
    else if (s.stato === "inviato" && s.giorni <= entroGiorni)
      out.push({ ordine: o, stato: s.stato, giorni: s.giorni, urgenza: 2 });
  }
  return out.sort((a, b) => a.urgenza - b.urgenza
    || (a.giorni == null ? 0 : a.giorni) - (b.giorni == null ? 0 : b.giorni)
    || String(a.ordine.numero || "").localeCompare(String(b.ordine.numero || ""), "it", { numeric: true }));
}
