/* ⛔ SENTINELLA NELLA CAVA SINTETICA — le sette collezioni che l'app legge.
   ⚠️ NON VA IN npm test: è una LIBRERIA, non una suite — non asserisce niente,
   genera dati. Vale la lezione già pagata da `cava-sintetica.mjs`: un
   generatore rotto non fallisce, **ferma il lavoro di chi lo usa e sembra un
   problema loro**.
   ══════════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE, MISURATO. Prima di questo file la cava sintetica dava a
   Sentinella **22 righe su 3.078**, con **quattro collezioni vuote su sette**:
   `reclami`, `adempimenti`, `registri` e `programma` non esistevano, i
   `monitoraggi` erano **un punto solo** e le `letture` una ogni 30 giorni,
   tutte con un valore fra 0,8 e 5,3 e soglia 5. Cioè: `riepilogoProgramma`,
   `allerteProgramma`, `riepilogoReclami`, `periodoAdempimento`,
   `prioritaConformita` sul ramo degli adempimenti, `taratureDelReport`,
   `composizioneProvenienza` e metà di `reportConformita` non erano **mai**
   stati attraversati su volume. E su 1.008 letture generate non ce n'era
   **nemmeno una pari alla soglia**, che è il caso su cui `conSoglia` e
   `statoMisura` si giocano il verdetto (`>=`, non `>`).

   ⛔ I CASI DIFFICILI SI GARANTISCONO, NON SI SORTEGGIANO. È l'errore pagato
   **cinque volte** in `cava-sintetica.mjs`: una quota probabilistica su pochi
   elementi esce **zero** con certi semi, e allora la difesa che il prodotto ha
   costruito apposta non viene esercitata **e niente lo dice**. Qui ogni caso
   raro è deciso PRIMA e il caso ne discende; quanti ne sono usciti si legge in
   `casiSentinella()`, che si guarda **prima** dei risultati.

   ⛔ LA FORMA È LETTA DAI DATI E DAI LETTORI, NON DALLA MEMORIA. Ogni campo
   qui sotto porta scritto accanto **quale funzione lo legge**: è la difesa
   contro la fixture indovinata, che il 14/08 è costata nove accuse false in
   una notte (tre CSV con le colonne al posto sbagliato, e un lettore che
   scarta TUTTO letto come un lettore severo).
   ⚠️ Due forme sono VINCOLI DURI e non scelte estetiche:
     · `registri[].stato` ∈ {"aggiornato","in-attesa"} — la pagina fa
       `RB[r.stato][0]`, e una terza parola **uccide la pagina al disegno**
       (regola 18 di run-stile, nel caso in cui la mappa non è nel modulo);
     · `reclami[].tipo` sta in `TIPI_RECLAMO` e `ricettori[].tipo` in
       `TIPI_RICETTORE` — lì il ripiego c'è («Altro», «Ricettore»), quindi
       sbagliare non rompe: **nasconde**.

   ⛔ NESSUNA SOGLIA DI SICUREZZA È DECISA QUI. I limiti (5 mm/s, 40 µg/m³,
   70 dB(A), 35 mg/l) sono **copiati dalla dimostrazione che il fondatore ha
   validato**: questo file non asserisce nessuna norma e non ne cita nessuna.
   Genera letture; un limite non lo tocca.

   ⛔ QUESTI DATI NON SONO DATI VERI e non devono mai sembrarlo: nomi, note e
   descrizioni lo dichiarano riga per riga.

   Uso:  import { generaSentinella, casiSentinella } from "./sentinella.mjs";
         const s = generaSentinella(ctx);      // ctx dal generatore
         casiSentinella(s)                     // il censimento dei casi voluti */

/* i giorni fra due date li conta `shared/`, e non `new Date(a)-new Date(b)`:
   è la copia debole che dà «scaduta da 56 anni» */
import { giorniTra, dataISOEsiste } from "../../../../shared/deepwork-id-client/dw-shell.js";

/* ── che cosa mi serve dal generatore ──────────────────────────────────
   `ctx = { rnd, giorni, ana, d, fine, piu, T }`
     rnd()      il caso ripetibile (seme fisso) — condiviso col resto della cava
     giorni[]   { iso, mese } i giorni lavorativi, in ordine
     ana        { persone, squadre, operatori, fronti } — servono i `fronti`
     d          il diario: `d.volate` [{ giorno, fori, kgForo, fronteId, ppv }]
     fine       la data di fine della simulazione (ISO)
     piu(iso,n) una data spostata di n giorni
   ⚠️ `T` (la taglia) NON serve, e la ragione è scritta accanto a
   `generaSentinella`: quanti punti di misura ha una cava lo dice
   l'autorizzazione, non la produzione.
   Niente altro: `d.letture` NON si usa — una lettura ogni 30 giorni su un
   punto solo è esattamente il difetto che questo file chiude. */

export const PARAMETRI_SENTINELLA = {
  /* ⛔ Le soglie sono COPIE della dimostrazione validata dal fondatore, non
     numeri scelti qui: questo file non decide nessun limite di sicurezza. */
  sogliaVibrazioniAbitato:  { v: 5,   u: "mm/s",    da: "[demo] DEMO.ricettori rc1 / monitoraggi v1" },
  sogliaVibrazioniConfine:  { v: 20,  u: "mm/s",    da: "[demo] DEMO.ricettori rc2" },
  sogliaPolveri:            { v: 40,  u: "µg/m³",   da: "[demo] DEMO.ricettori rc3 / monitoraggi p1" },
  sogliaRumore:             { v: 70,  u: "dB(A)",   da: "[demo] DEMO.monitoraggi r1" },
  sogliaAcque:              { v: 35,  u: "mg/l SST",da: "[demo] DEMO.monitoraggi a1" },

  /* la CADENZA di ogni punto: è la stessa che finisce nel `programma`, così il
     piano e le misure raccontano la stessa storia (se no `statoRigaProgramma`
     direbbe «in ritardo» su una cava che misura regolarmente) */
  ogniGiorniPolveri:        { v: 7,   u: "giorni", da: "[demo] DEMO.programma pr1" },
  ogniGiorniVibrazioni:     { v: 15,  u: "giorni", da: "[demo] DEMO.programma pr2/pr3" },
  ogniGiorniRumore:         { v: 90,  u: "giorni", da: "[demo] DEMO.programma pr4" },
  ogniGiorniAcque:          { v: 182, u: "giorni", da: "[demo] DEMO.programma pr5" },
  ogniGiorniPiazzale:       { v: 30,  u: "giorni", da: "[dedotto] la centralina nuova, ancora senza limite" },

  /* i LIVELLI: tutti `[dedotto]`. Servono a far muovere i conti del software,
     NON a dire quanto vibra una cava — finché sono dedotti, ciò che questa
     cava dice sul mestiere non vale niente (avviso già scritto in PARAMETRI). */
  livelloPolveriBase:       { v: 24,  u: "µg/m³", da: "[dedotto]" },
  livelloPolveriDispersione:{ v: 16,  u: "µg/m³", da: "[dedotto]" },
  livelloRumoreBase:        { v: 58,  u: "dB(A)", da: "[dedotto]" },
  livelloRumoreDispersione: { v: 9,   u: "dB(A)", da: "[dedotto]" },
  livelloAcqueBase:         { v: 12,  u: "mg/l SST", da: "[dedotto]" },
  livelloAcqueDispersione:  { v: 14,  u: "mg/l SST", da: "[dedotto]" },
  livelloPiazzaleBase:      { v: 20,  u: "µg/m³", da: "[dedotto]" },
  livelloPiazzaleDispersione:{ v: 11, u: "µg/m³", da: "[dedotto]" },
  /* la PPV di fondo dei punti di vibrazione fra una volata e l'altra: il
     sismografo registra anche il traffico di cava, non solo gli spari */
  livelloFondoVibrazioni:   { v: 1.4, u: "mm/s", da: "[dedotto] fondo fra due volate" },

  reclamiAnnoPerRicettore:  { v: 1.6, u: "reclami/anno", da: "[dedotto]" },
  /* le prime letture dell'archivio non dichiarano la provenienza: è il caso
     vero di ogni cliente il giorno in cui la catena di custodia entra in
     funzione, e `composizioneProvenienza` esiste per raccontarlo */
  lettureSenzaProvenienza:  { v: 0.15, u: "quota iniziale dell'archivio", da: "[dedotto]" },
  quotaLettureAMano:        { v: 0.08, u: "quota", da: "[dedotto] battute leggendo il display" },
  /* il punto delle acque smette di essere campionato nell'ultimo quarto del
     periodo: è il modo per cui una riga di programma va **in ritardo** senza
     dipendere dal seme */
  quotaFinePeriodoAcqueFerme:{ v: 0.25, u: "quota del periodo", da: "[dedotto] garanzia del caso «in ritardo»" },
};
const P = (k) => PARAMETRI_SENTINELLA[k].v;

const mese = (isoStr) => String(isoStr || "").slice(0, 7);
const r2 = (n) => Math.round(n * 100) / 100;

/* ══════════════════════════════════════════════════════════════════════
   I RICETTORI — le forme le legge `distanzaDelRicettore`, `sogliaDelRicettore`,
   `sogliaEfficace`, `csvRicettori`, `andamentoRicettore`, e la tabella del
   report (`ricettoriSenzaPunti`).
   ⛔ `tipo` sta in `TIPI_RICETTORE` e `classe` in `CLASSI_ACUSTICHE`: fuori da
   quegli elenchi il ripiego c'è, quindi l'errore non romperebbe — nasconderebbe.
   ══════════════════════════════════════════════════════════════════════ */
function ricettoriDi() {
  return [
    { id: "rc1", nome: "Ricettore simulato R1 — abitazione", tipo: "abitazione", distanza: 320,
      classe: "III", soglia: P("sogliaVibrazioniAbitato"), unita: "mm/s",
      nota: "dato simulato: abitazione più vicina al fronte" },
    { id: "rc2", nome: "Ricettore simulato R2 — confine", tipo: "confine", distanza: 90,
      classe: "V", soglia: P("sogliaVibrazioniConfine"), unita: "mm/s",
      nota: "dato simulato: confine di proprietà, nessun edificio" },
    { id: "rc3", nome: "Ricettore simulato R3 — scuola", tipo: "scuola", distanza: 640,
      classe: "I", soglia: P("sogliaPolveri"), unita: "µg/m³",
      nota: "dato simulato: ricettore sensibile" },
    /* ⛔ GARANTITO: il ricettore di cui non si sa QUANTO È LONTANO. La distanza
       è il denominatore della distanza scalata, quindi la sua assenza non è un
       dettaglio d'anagrafica. `distanzaDelRicettore` risponde `null` e non 0. */
    { id: "rc4", nome: "Ricettore simulato R4 — cascina", tipo: "abitazione", distanza: null,
      classe: "", soglia: null, unita: "",
      nota: "dato simulato: distanza non ancora misurata sulla mappa" },
    /* ⛔ GARANTITO: un ricettore su cui NON è collegato nessun punto di misura.
       Lo conta `reportConformita.nRicettoriSenzaPunti`, e prima del 03/08 il
       documento non ne faceva parola: la testata prometteva «tutti i ricettori
       della cava» e il verdetto diceva «Conforme». */
    { id: "rc5", nome: "Ricettore simulato R5 — abitazione isolata", tipo: "abitazione", distanza: 850,
      classe: "II", soglia: P("sogliaVibrazioniAbitato"), unita: "mm/s",
      nota: "dato simulato: nessun punto di misura collegato" },
  ];
}

/* ══════════════════════════════════════════════════════════════════════
   I PUNTI DI MISURA — la scheda ferma. Le letture arrivano dopo.
   `tipo` lo legge `UNITA_TIPO`/`unitaMisura` e `lettureVibrazioniDelGiorno`
   (che cerca esattamente "vibrazioni"); `soglia` la legge `sogliaValida` e
   `sogliaEfficace`; `ricettoreId` `trovaRicettore`; `tarature[]`
   `certificatiTaratura` → `coperturaTaratura` / `statoTaraturaStrumento`.
   ══════════════════════════════════════════════════════════════════════ */
function schedePunti() {
  return [
    { id: "sv1", nome: "Punto simulato V1 — vibrazioni abitato", tipo: "vibrazioni", unita: "mm/s",
      soglia: P("sogliaVibrazioniAbitato"), ricettoreId: "rc1",
      ogni: P("ogniGiorniVibrazioni"), base: P("livelloFondoVibrazioni"), disp: 0.8,
      nota: "dato simulato: sismografo dell'abitato" },
    { id: "sv2", nome: "Punto simulato V2 — vibrazioni confine", tipo: "vibrazioni", unita: "mm/s",
      soglia: P("sogliaVibrazioniAbitato"), ricettoreId: "rc2",
      ogni: P("ogniGiorniVibrazioni"), base: P("livelloFondoVibrazioni") * 2.2, disp: 2.0,
      nota: "dato simulato: sismografo al confine" },
    { id: "sp1", nome: "Punto simulato P1 — polveri confine Est", tipo: "polveri", unita: "µg/m³",
      soglia: P("sogliaPolveri"), ricettoreId: "rc3",
      ogni: P("ogniGiorniPolveri"), base: P("livelloPolveriBase"), disp: P("livelloPolveriDispersione"),
      nota: "dato simulato: centralina PM10" },
    /* ⛔ GARANTITO PER COSTRUZIONE: la SOGLIA IN CONFLITTO DI UNITÀ. Questo
       punto misura in dB(A) ed è collegato a rc1, che ha una soglia in mm/s:
       `sogliaEfficace` NON converte, tiene quella del punto e alza
       `conflitto`. È la riga che `csvAmbiente` scrive per esteso nel file che
       va all'ente. Nella dimostrazione c'è già (r1 → rc1), qui resta. */
    { id: "sr1", nome: "Punto simulato R1 — rumore perimetro", tipo: "rumore", unita: "dB(A)",
      soglia: P("sogliaRumore"), ricettoreId: "rc1",
      ogni: P("ogniGiorniRumore"), base: P("livelloRumoreBase"), disp: P("livelloRumoreDispersione"),
      nota: "dato simulato: campagna fonometrica" },
    { id: "sa1", nome: "Punto simulato A1 — acque vasca", tipo: "acque", unita: "mg/l SST",
      soglia: P("sogliaAcque"), ricettoreId: "",
      ogni: P("ogniGiorniAcque"), base: P("livelloAcqueBase"), disp: P("livelloAcqueDispersione"),
      nota: "dato simulato: campionamento della vasca" },
    /* ⛔ GARANTITO: il punto CON letture e SENZA soglia (decisione 16). Non è
       conforme e non è non-conforme: `esitoPunto` risponde "senza-soglia" e
       `riepilogoConformita` lo tiene fuori da numeratore E denominatore.
       ⚠️ Nessun ricettore collegato, se no la soglia del ricettore lo salverebbe
       e il caso sparirebbe senza che niente lo dica. */
    { id: "spv1", nome: "Punto simulato P2 — piazzale nuovo", tipo: "polveri", unita: "µg/m³",
      soglia: null, ricettoreId: "",
      ogni: P("ogniGiorniPiazzale"), base: P("livelloPiazzaleBase"), disp: P("livelloPiazzaleDispersione"),
      nota: "dato simulato: centralina appena installata, limite non ancora fissato" },
    /* ⛔ GARANTITO: il punto SENZA NESSUNA LETTURA. `statoMisura` deve dire
       «Mai misurato» e non «Conforme» — è il difetto del 03/08, quando con sei
       punti appena creati il cartellone diceva «6 punti entro soglia».
       `senzaLetture: true` è letta SOLO qui dentro e non finisce nel record. */
    { id: "sq1", nome: "Punto simulato R2 — rumore cascina", tipo: "rumore", unita: "dB(A)",
      soglia: 65, ricettoreId: "rc4", ogni: 60, base: 0, disp: 0, senzaLetture: true,
      nota: "dato simulato: strumento installato, nessuna misura ancora registrata" },
  ];
}

/* le TARATURE. Quattro storie diverse, tutte garantite, perché
   `coperturaTaratura` sa dire quattro stati e nessuno di essi deve restare
   senza un soggetto: coperta · scoperta · prima-dello-storico · non-dichiarata. */
function tarature(punto, primoGiorno, fine, piu, campata) {
  /* ⛔ LE FINESTRE SI ANCORANO A `fine`, NON ALL'INIZIO — e la prima stesura
     faceva il contrario. Su una cava di UN MESE `piu(primoGiorno, 220)` cade
     nel futuro e la scadenza voluta («40 giorni fa») risultava PRIMA della
     data: `certificatiTaratura` scartava il certificato — giustamente, un
     intervallo alla rovescia non copre niente — e il caso «taratura scaduta»
     spariva. Il censimento sui dati diceva 1 perché guardava il record; il
     verdetto del prodotto (`allerteTaratura`) diceva **0**. È l'oracolo che
     non è il dato: a trovarlo è stato il minimo su dieci semi e tre durate. */
  const k = Math.max(3, Math.round(campata * 0.08));
  if (punto.id === "sv1") {
    /* GARANTITO «prima-dello-storico»: il certificato comincia DOPO l'inizio del
       periodo, quindi le prime letture non risultano coperte — e non sono
       accusate di esserlo, che è l'errore opposto.
       GARANTITO «in-scadenza»: l'ultimo certificato scade entro trenta giorni
       da `fine`, cioè dentro la finestra di `statoScadenzaHSE`. */
    const meta = piu(primoGiorno, k + Math.round(campata * 0.5));
    return [
      { data: piu(primoGiorno, k), scadenza: meta,
        ente: "Centro di taratura simulato", certificato: "SIM-0001", nota: "dato simulato" },
      { data: meta, scadenza: piu(fine, 12),
        ente: "Centro di taratura simulato", certificato: "SIM-0002", nota: "dato simulato" },
    ];
  }
  if (punto.id === "sv2") {
    /* ⛔ GARANTITI insieme: il BUCO fra due certificati (20 giorni scoperti) e
       la TARATURA SCADUTA — l'ultimo certificato è scaduto 40 giorni prima di
       `fine`, contati all'indietro DA `fine`, così vale a qualunque durata.
       Da lì `allerteTaratura` alza un `danger` e `taratureDelReport.stato`
       diventa "scoperte". */
    return [
      { data: piu(fine, -400), scadenza: piu(fine, -160),
        ente: "Centro di taratura simulato", certificato: "SIM-0101", nota: "dato simulato" },
      { data: piu(fine, -140), scadenza: piu(fine, -40),
        ente: "Centro di taratura simulato", certificato: "SIM-0102", nota: "dato simulato" },
    ];
  }
  if (punto.id === "sr1") {
    /* un certificato con la SCADENZA PRIMA della data: `certificatiTaratura` lo
       scarta, e `coperturaTaratura.scartate` lo conta invece di ignorarlo */
    return [
      { data: piu(fine, -300), scadenza: piu(fine, -320),
        ente: "Centro di taratura simulato", certificato: "SIM-0201", nota: "dato simulato: intervallo alla rovescia" },
      { data: piu(primoGiorno, -30), scadenza: piu(fine, 200),
        ente: "Centro di taratura simulato", certificato: "SIM-0202", nota: "dato simulato" },
    ];
  }
  /* ⛔ GARANTITO «non-dichiarata»: gli altri punti non hanno nessun
     certificato. Non è una dimenticanza: è l'archivio di ogni cliente il
     giorno in cui questa unità va in mano sua, e il report deve dirlo senza
     accusare nessuno. */
  return [];
}

/* ══════════════════════════════════════════════════════════════════════
   LE LETTURE — il cuore. Cadenza dal programma, livello dal parametro,
   e i casi voluti decisi PRIMA.
   Le legge `lettureLeggibili` (→ `ultimaLettura`, `lettureNelPeriodo`,
   `ultimaLetturaOltre`), `statPeriodo`, `serieStorica`, `reportConformita`,
   `contaCoperture`, `composizioneProvenienza`, `coperturaPeriodo`.
   ══════════════════════════════════════════════════════════════════════ */

/* la provenienza di UNA lettura. Tre strade, come le tre parole del
   vocabolario chiuso di `provenienzaMisura`: import · manuale · niente. */
function origineDi(punto, dataISO, i, quota, rnd, piu) {
  if (i < quota) return undefined;                       // archivio precedente alla catena di custodia
  if (punto.tipo === "rumore")                           // la campagna la consegna un tecnico su carta
    return { da: "manuale", quando: piu(dataISO, 1) + "T09:00:00" };
  if (rnd() < P("quotaLettureAMano"))
    return { da: "manuale", quando: dataISO + "T17:10:00" };
  return { da: "import", file: `SIM_${punto.id}_${mese(dataISO)}.csv`,
           quando: piu(dataISO, 2) + "T08:42:00" };
}

function generaLetture(punto, giorni, rnd, piu, meseVuoto, ppvPerGiorno) {
  if (punto.senzaLetture) return [];
  const passo = Math.max(1, Math.round(punto.ogni * 5 / 7));   // giorni lavorativi ↔ giorni di calendario
  const limiteAcque = punto.id === "sa1"
    ? Math.floor(giorni.length * (1 - P("quotaFinePeriodoAcqueFerme")))
    : Infinity;
  const grezze = [];
  for (let i = 0; i < giorni.length; i += passo) {
    if (i > limiteAcque) break;                                // le acque smettono: garantisce «in ritardo»
    grezze.push(giorni[i].iso);
  }
  /* le vibrazioni si misurano ANCHE il giorno della volata: è quello il numero
     che diventa la PPV del referto, e senza di lui `lettureVibrazioniDelGiorno`
     e `coincidenzaVolata` non hanno niente da trovare */
  if (punto.tipo === "vibrazioni")
    for (const g of ppvPerGiorno.keys()) if (!grezze.includes(g)) grezze.push(g);
  grezze.sort();

  /* ⛔ IL MESE SENZA NESSUNA MISURA. Si toglie a TUTTI i punti lo stesso mese,
     se no non è un buco del programma, è una riga che manca. Lo leggono
     `coperturaPeriodo` (`vuotoMax`), `statPeriodo` (n=0 → superamenti `null`,
     non 0) e `confrontoMesi` (`confrontabile: false`). */
  const date = meseVuoto ? grezze.filter(g => mese(g) !== meseVuoto) : grezze;

  const quotaIgnota = Math.max(1, Math.round(date.length * P("lettureSenzaProvenienza")));
  const out = date.map((g, i) => {
    const ppv = ppvPerGiorno.get(g);
    let valore;
    if (punto.tipo === "vibrazioni" && ppv != null) {
      /* la volata la sente di più chi è vicino: al confine (90 m) arriva quasi
         tutta, all'abitato (320 m) attenuata. ⚠️ `[dedotto]`: è una forma, non
         una legge di sito — quella la calcola Genesi sui referti veri. */
      valore = r2(punto.id === "sv2" ? ppv * (0.9 + rnd() * 0.5) : ppv * (0.55 + rnd() * 0.35));
    } else {
      valore = r2(Math.max(0.1, punto.base + (rnd() - 0.42) * punto.disp));
    }
    const ora = String(8 + (i % 9)).padStart(2, "0") + ":" + String((i * 7) % 60).padStart(2, "0");
    const origine = origineDi(punto, g, i, quotaIgnota, rnd, piu);
    return { data: g, ora, valore, ...(origine ? { origine } : {}) };
  });

  if (!out.length) return out;

  /* ⛔ GARANTITO: la LETTURA SENZA VALORE. È il difetto chiuso il 14/08 — la
     riga entrava nel report per l'ARPA come una misura di ZERO, e `scartate`
     restava a 0 perché vedeva `"boh"` e non vedeva `null`. La direzione era
     quella che RASSICURA: la media si allontanava dalla soglia. */
  if (punto.id === "sp1") {
    out[Math.min(2, out.length - 1)].valore = null;
    if (out.length > 12) out[Math.floor(out.length * 0.6)].valore = null;
  }
  /* ⛔ GARANTITA: la LETTURA ESATTAMENTE PARI ALLA SOGLIA. `conSoglia` e
     `statoMisura` decidono con `>=`, quindi pari alla soglia È un superamento —
     e su 1.008 letture il generatore precedente non ne produceva nessuna.
     Una a metà serie (entra nel report di qualunque periodo) e una in fondo
     (così `superamentiAperti` e il KPI del Quadro hanno un soggetto). */
  if (punto.id === "sv1") {
    const s = P("sogliaVibrazioniAbitato");                    // = soglia efficace: rc1 in mm/s
    out[Math.floor(out.length / 2)].valore = s;
    out[out.length - 1].valore = s;
  }
  /* ⛔ GARANTITA: una lettura CORRETTA dopo la registrazione, e la correzione
     ALZA il numero — è il caso in cui la catena di custodia serve davvero. */
  if (punto.id === "sv2") {
    /* ⚠️ `Math.min(1, len-1)` e non `len/3`: con la guardia `out.length > 3` la
       correzione non usciva sulle cave da un mese, e il minimo su dieci semi
       diceva **0**. Un caso garantito solo sulle campate lunghe non è garantito. */
    const k = Math.min(1, out.length - 1);
    out[k].origine = { da: "manuale", quando: out[k].data + "T17:10:00",
      corretta: { quando: piu(out[k].data, 1) + "T08:30:00", prima: r2(out[k].valore - 1) } };
  }
  /* ⛔ GARANTITA: una lettura con una DATA CHE NON ESISTE. `reportConformita`
     la conta in `scartate.letture` invece di farla sparire, e `lettureLeggibili`
     la rifiuta con `dataISOEsiste` (non con una regex sulla forma: «2026-02-30»
     la forma ce l'ha, e `Date` la fa scivolare al 2 marzo). */
  if (punto.id === "sp1")
    out.push({ data: String(out[0].data).slice(0, 4) + "-02-30", ora: "10:00",
      valore: r2(punto.base + punto.disp), origine: { da: "manuale", quando: "" } });
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   LE VOLATE — il brogliaccio. Le legge `riepilogoVolate`, `riepilogoPreviste`,
   `volateOrdinate`, `refertoDaVolata` (→ `ppvDiVolata`, `scaledDistance`),
   `coincidenzaVolata`, e la tabella di contesto di `reportConformita`.
   ══════════════════════════════════════════════════════════════════════ */
function generaVolate(d, ana, fine, piu, rnd, punti) {
  const nomeFronte = new Map((ana.fronti || []).map(f => [f.id, f.nome]));
  const sv1 = punti.find(p => p.id === "sv1");
  const lettureSv1 = new Map((sv1 ? sv1.letture : []).map(l => [l.data, l]));
  const tot = (d.volate || []).length;

  const out = (d.volate || []).map((v, i) => {
    const kgTotali = v.fori * v.kgForo;
    /* la carica per RITARDO non è il totale: sono i chili che detonano nella
       stessa finestra: due o tre fori per ritardo, come li fa un fochino */
    const kgMaxRitardo = Math.round(v.kgForo * (2 + Math.round(rnd())));
    const ultima = i === tot - 1;
    const l = lettureSv1.get(v.giorno);
    /* ⛔ GARANTITI, in ordine e non a sorteggio:
       · i % 9 === 4  → la volata SENZA la distanza del ricettore (`refertoDaVolata`
         motivo "distanza"; prima del 03/08 il report scriveva «0 m», cioè il
         ricettore dentro il fronte);
       · i % 13 === 7 → la volata senza i CHILI dichiarati (`kgMeseSenza`: una
         casella vuota non è uno zero);
       · i % 17 === 3 → l'esito «contestazione», che `riepilogoVolate` conta;
       · nessuna lettura quel giorno → nessuna PPV, motivo "ppv". */
    const senzaDistanza = i % 9 === 4;
    const senzaKg = i % 13 === 7;
    const ppv = l && l.valore != null ? l.valore : null;
    return {
      id: `sb${i + 1}`, data: v.giorno,
      fronte: nomeFronte.get(v.fronteId) || "Fronte simulato",
      nFori: v.fori,
      kgTotali: senzaKg ? null : kgTotali,
      kgMaxRitardo,
      distanzaRicettore: senzaDistanza ? null : 320,
      esito: i % 17 === 3 ? "contestazione" : "regolare",
      note: "volata simulata", stato: "eseguita",
      ...(ppv != null ? {
        ppvMisurata: ppv, ppvFonte: "strumento", ppvPuntoId: "sv1",
        ppvPuntoNome: sv1 ? sv1.nome : "", ppvData: v.giorno, ppvOra: l.ora,
      } : {}),
      /* ⛔ GARANTITO su una eseguita: il LIMITE DI PROGETTO SENZA LA NORMA da
         cui è preso. Il report scrive «norma non indicata sul progetto»
         invece di lasciar credere che la citazione ci sia. */
      ...(i % 11 === 5 ? {
        ppvPrevista: r2(v.ppv * (0.85 + rnd() * 0.3)), ppvPrevLimite: 5,
        ppvPrevNorma: "", ppvPrevFonte: "manuale",
      } : {}),
      ...(ultima ? { note: "volata simulata · ultima del periodo" } : {}),
    };
  });

  /* ⛔ E I TRE CASI QUI SOPRA SONO GARANTITI SOLO SE LE VOLATE SONO TANTE.
     `i % 9`, `i % 13` e `i % 17` su una cava piccola da un mese danno **due**
     volate in tutto: il minimo su dieci semi diceva `volateContestate: 0` e
     `volateLimiteSenzaNorma: 0`. Una condizione che dipende da quante righe ci
     sono non è una garanzia — è una quota scritta con l'aritmetica invece che
     col caso. Quindi si controlla, e se il caso non è uscito lo si mette. */
  const mettiSeManca = (test, applica) => { if (out.length && !out.some(test)) applica(out[Math.floor(out.length / 2)]); };
  mettiSeManca(v => v.esito === "contestazione", v => { v.esito = "contestazione"; });
  mettiSeManca(v => v.distanzaRicettore == null, v => { v.distanzaRicettore = null; });
  mettiSeManca(v => v.kgTotali == null, v => { v.kgTotali = null; });
  mettiSeManca(v => v.ppvPrevLimite > 0 && !String(v.ppvPrevNorma || "").trim(), v => {
    v.ppvPrevista = 4.2; v.ppvPrevLimite = 5; v.ppvPrevNorma = ""; v.ppvPrevFonte = "manuale"; });
  /* ⛔ E IL CASO OPPOSTO VA GARANTITO ANCHE LUI: almeno un REFERTO PRONTO, cioè
     una volata con PPV misurata, distanza e carica per ritardo. È quello che
     Genesi consuma per la legge di sito, e su una cava piccola da un mese
     usciva **zero** — le mancanze qui sopra si prendevano tutte le due volate.
     Le mancanze si mettono a metà elenco, il referto pronto in testa: con
     meno di due volate eseguite i due si sovrappongono, e allora il caso si
     dichiara mancante invece di essere finto.
     ⚠️ La PPV di ripiego è `manuale` — trascritta dal referto dello strumento —
     e NON `strumento`: dire «letta dal sismografo» quando non c'è nessuna
     lettura di quel giorno sarebbe inventare una catena di custodia. */
  if (out.length) {
    const t = out[0];
    if (!(t.ppvMisurata > 0)) {
      t.ppvMisurata = r2(1.5 + rnd() * 3); t.ppvFonte = "manuale";
      t.ppvPuntoId = ""; t.ppvPuntoNome = ""; t.ppvData = t.data; t.ppvOra = "";
    }
    if (!(t.distanzaRicettore > 0)) t.distanzaRicettore = 320;
    if (!(t.kgMaxRitardo > 0)) t.kgMaxRitardo = 120;
  }
  /* ⚠️ DICHIARATO: con UNA SOLA volata nel diario i due gruppi si sovrappongono
     (le mancanze vanno a metà elenco, che con un elemento è l'elemento stesso) e
     vince il referto pronto — quindi `volateSenzaDistanza` esce **0**. Misurato:
     succede solo con cave piccole e medie sotto i dodici mesi. Non lo si aggiusta
     inventando una volata: un evento che il diario della cava non ha renderebbe
     Sentinella incoerente con Campo e Terra, che è la lezione 4 del simulatore. */

  /* ⛔ GARANTITE: due volate PREVISTE (T9). Una nel futuro e una la cui data è
     già passata — quella è `daConfermare`, l'unico avviso che serve, perché una
     volata sparata e mai confermata lascia un buco nel brogliaccio.
     ⛔ E una prevista NON diventa MAI un referto: `refertoDaVolata` risponde
     col solo motivo "prevista", se no la legge di sito confermerebbe sé stessa. */
  const previste = [
    { id: "sbP1", data: piu(fine, 9), fronte: (ana.fronti[0] || {}).nome || "Fronte simulato",
      nFori: 38, kgTotali: 430, kgMaxRitardo: 20, distanzaRicettore: 320,
      esito: "regolare", note: "progetto simulato", stato: "prevista",
      ppvPrevista: 3.9, ppvPrevLimite: 5, ppvPrevNorma: "curva di progetto simulata",
      ppvPrevFonte: "genesi-litologia", airblastPrevisto: 121, codiceVolata: "SIM-PREV-1" },
    { id: "sbP2", data: piu(fine, -3), fronte: (ana.fronti[1] || ana.fronti[0] || {}).nome || "Fronte simulato",
      nFori: 41, kgTotali: null, kgMaxRitardo: 22, distanzaRicettore: 300,
      esito: "regolare", note: "progetto simulato, data già passata", stato: "prevista",
      ppvPrevista: 4.4, ppvPrevLimite: 5, ppvPrevNorma: "curva di progetto simulata",
      ppvPrevFonte: "genesi-litologia", airblastPrevisto: 118, codiceVolata: "SIM-PREV-2" },
  ];
  /* ⛔ GARANTITA: una volata con la data ILLEGGIBILE. `reportConformita` la
     conta in `scartate.volate`; senza di lei quel conto resta a zero e la
     difesa non viene mai attraversata. */
  const rotta = { id: "sbX", data: "boh", fronte: "Fronte simulato", nFori: 30,
    kgTotali: 300, kgMaxRitardo: 18, distanzaRicettore: 280, esito: "regolare",
    note: "dato simulato con la data illeggibile", stato: "eseguita" };
  return [...out, ...previste, rotta];
}

/* ══════════════════════════════════════════════════════════════════════
   I RECLAMI — li legge `riepilogoReclami` (totale, aperti, ultimo),
   `reportConformita` (li filtra per periodo e per ricettore, e conta le date
   illeggibili) e `bozzaAzioneReclamo` per il ponte con Scudo.
   ⛔ `tipo` sta in `TIPI_RECLAMO`, `stato` è "aperto" | "chiuso".
   ══════════════════════════════════════════════════════════════════════ */
function generaReclami(giorni, rnd, d, ric) {
  const anni = Math.max(0.1, giorni.length / 260);
  const quanti = Math.max(2, Math.round(anni * P("reclamiAnnoPerRicettore") * 2));
  const TIPI = ["vibrazione", "polvere", "rumore", "acque"];
  const out = [];
  /* ⛔ I reclami cadono il GIORNO DI UNA VOLATA quando ce n'è una: è così che
     arrivano davvero, ed è la sola forma in cui `coincidenzaVolata` — la
     funzione che risponde «quel giorno si è sparato» — ha qualcosa da trovare.
     Se le volate finiscono si ripiega su un giorno lavorativo. */
  const giorniVolata = (d.volate || []).map(v => v.giorno);
  for (let i = 0; i < quanti; i++) {
    const suVolata = giorniVolata.length && i % 3 !== 2;
    const data = suVolata
      ? giorniVolata[Math.floor(rnd() * giorniVolata.length)]
      : giorni[Math.floor(rnd() * giorni.length)].iso;
    out.push({
      id: `sx${i + 1}`, data, ora: String(7 + (i % 11)).padStart(2, "0") + ":30",
      tipo: TIPI[i % TIPI.length],
      ricettoreId: ric[i % 4].id,
      chi: `Segnalante simulato ${i + 1}`,
      descrizione: "Segnalazione simulata dalla cava sintetica.",
      /* ⛔ GARANTITI tutti e due gli stati: un reclamo APERTO non è un reclamo
         che non c'è, ed è il numero che `riepilogoReclami` mette sul Quadro. */
      azione: i % 3 === 0 ? "" : "Verifica simulata sui dati del punto collegato.",
      stato: i % 3 === 0 ? "aperto" : "chiuso",
    });
  }
  /* garantiti anche quando `quanti` è al minimo */
  out[0].stato = "aperto"; out[0].azione = "";
  out[out.length - 1].stato = "chiuso";
  /* ⛔ GARANTITO: un reclamo con la data ILLEGGIBILE → `scartate.reclami`. */
  out.push({ id: "sxX", data: "2026-02-30", ora: "09:00", tipo: "polvere",
    ricettoreId: ric[2].id, chi: "Segnalante simulato",
    descrizione: "Segnalazione simulata con una data che non esiste.",
    azione: "", stato: "aperto" });
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   GLI ADEMPIMENTI — li leggono `kpiFrom` (`adempimenti30`),
   `prioritaConformita` (scaduto = danger, entro 30 gg = warn),
   `periodoAdempimento` / `descriviPeriodoAdempimento` (che da `periodoMesi` e
   `giorniConsegna` ricavano il periodo su cui parte il Report) e `csvAmbiente`.
   ⛔ Tutti e quattro i motivi di `DICHIARAZIONI_PERIODO` hanno un soggetto:
   ricavato · senza-periodicita · senza-termine · scadenza-illeggibile.
   ══════════════════════════════════════════════════════════════════════ */
function generaAdempimenti(fine, piu, meseCieco) {
  const ultimoDelMese = (ym) => {
    const [a, m] = ym.split("-").map(Number);
    const u = new Date(Date.UTC(a, m, 0)).getUTCDate();
    return `${ym}-${String(u).padStart(2, "0")}`;
  };
  return [
    /* ⛔ GARANTITO: lo SCADUTO. `prioritaConformita` lo alza a `danger` — un
       termine mancato con l'ente non è un semplice avviso. */
    { id: "sd1", titolo: "Relazione annuale simulata (dati generati)", ente: "Ente simulato",
      scadenza: piu(fine, -12), periodoMesi: 12, giorniConsegna: 0 },
    /* GARANTITO: quello che scade dentro i trenta giorni → `warn`, e conta in
       `kpiFrom.adempimenti30` */
    { id: "sd2", titolo: "Verifica semestrale simulata", ente: "Ente simulato",
      scadenza: piu(fine, 18), periodoMesi: 6, giorniConsegna: 0 },
    /* ⛔ GARANTITO: SENZA PERIODICITÀ. Un rinnovo di autorizzazione non copre
       nessun periodo di misure: l'app deve dire che non lo sa invece di
       proporre un trimestre plausibile, che sarebbe indistinguibile da quello
       vero per chi legge il documento finito. */
    { id: "sd3", titolo: "Rinnovo autorizzazione simulato", ente: "Ente simulato",
      scadenza: piu(fine, 120) },
    /* ⛔ GARANTITO: SENZA TERMINE DI CONSEGNA. `periodoMesi` c'è, `giorniConsegna`
       no: senza quel numero il periodo scivolerebbe in avanti in silenzio. */
    { id: "sd4", titolo: "Comunicazione annuale simulata", ente: "Ente simulato",
      scadenza: piu(fine, 60), periodoMesi: 12 },
    /* ⛔ GARANTITO: la SCADENZA CHE NON È UN GIORNO CHE ESISTE. */
    { id: "sd5", titolo: "Adempimento simulato con data impossibile", ente: "Ente simulato",
      scadenza: String(fine).slice(0, 4) + "-02-30", periodoMesi: 3, giorniConsegna: 0 },
    /* ⛔ GARANTITO, E È IL CASO CHE COSTA: l'adempimento il cui PERIODO NON HA
       NESSUNA MISURA. `periodoAdempimento` lo ricava benissimo (`noto: true`),
       e il report che parte su quei giorni deve rispondere «senza-dati» — non
       «Conforme». È il principio del fondatore nel documento che va all'ente:
       l'assenza di un dato non è un dato favorevole. */
    { id: "sd6", titolo: "Relazione mensile simulata (periodo senza misure)", ente: "Ente simulato",
      scadenza: piu(ultimoDelMese(meseCieco), 10), periodoMesi: 1, giorniConsegna: 10 },
  ];
}

/* ══════════════════════════════════════════════════════════════════════
   I REGISTRI — la pagina fa `RB[r.stato][0]`: due parole sole, e una terza
   ucciderebbe la schermata al disegno senza nessun errore di sintassi.
   ══════════════════════════════════════════════════════════════════════ */
function generaRegistri() {
  return [
    { id: "sg1", titolo: "Registro simulato dei rifiuti", nota: "voce generata dalla cava sintetica", stato: "aggiornato" },
    { id: "sg2", titolo: "Registro simulato delle acque meteoriche", nota: "voce generata dalla cava sintetica", stato: "aggiornato" },
    /* ⛔ GARANTITO: almeno uno IN ATTESA — se no la sezione è tutta verde e il
       badge giallo non ha mai un soggetto. */
    { id: "sg3", titolo: "Formulari simulati di trasporto", nota: "voce generata dalla cava sintetica", stato: "in-attesa" },
    { id: "sg4", titolo: "Registro simulato degli esplosivi", nota: "voce generata dalla cava sintetica", stato: "in-attesa" },
  ];
}

/* ══════════════════════════════════════════════════════════════════════
   IL PROGRAMMA — lo legge `statoRigaProgramma` → `programmaEsteso` →
   `riepilogoProgramma` / `allerteProgramma`.
   ⛔ Ognuno dei SEI stati che `statoRigaProgramma` sa dire ha un soggetto
   garantito: in-regola · da-fare · in-ritardo · mai · senza-frequenza ·
   sospesa. Più la riga che punta a un punto sparito, che `programmaEsteso`
   tiene visibile («Punto non più in elenco») invece di far sparire in silenzio.
   ══════════════════════════════════════════════════════════════════════ */
function generaProgramma(punti, primoGiorno, fine) {
  const righe = [];
  const ultimaDi = (id) => {
    const p = punti.find(x => x.id === id);
    const l = (p ? p.letture : []).filter(x => x.valore != null && /^\d{4}-\d{2}-\d{2}$/.test(x.data));
    return l.length ? l[l.length - 1].data : null;
  };
  const spingi = (id, ogni, toll, nota, extra = {}) => righe.push({
    id: `spr${righe.length + 1}`, monitoraggioId: id, ogniGiorni: ogni,
    tolleranzaGiorni: toll, dal: primoGiorno, nota, attivo: true, ...extra });

  spingi("sp1", P("ogniGiorniPolveri"), 2, "Piano simulato: scarico settimanale della centralina PM10.");
  spingi("sv1", P("ogniGiorniVibrazioni"), 3, "Piano simulato: sismografo dell'abitato.");
  spingi("sv2", P("ogniGiorniVibrazioni"), 3, "Piano simulato: sismografo al confine.");
  spingi("spv1", P("ogniGiorniPiazzale"), 5, "Piano simulato: centralina del piazzale nuovo.");

  /* ⛔ GARANTITO «in-ritardo», e la garanzia NON poggia sul caso. Il punto delle
     acque smette di essere campionato nell'ultimo quarto del periodo (vedi
     `quotaFinePeriodoAcqueFerme`), quindi il divario dall'ultima lettura è noto:
     la frequenza si sceglie **da quel divario**, prendendo la periodicità tipica
     più lunga che lo faccia comunque sforare. Se il divario non basta la riga
     resta e il caso si dichiara mancante in `casiSentinella` — non si finge. */
  const ultimaAcque = ultimaDi("sa1");
  const divario = ultimaAcque ? -giorniTra(ultimaAcque, new Date(fine + "T00:00:00")) : 0;
  const CANDIDATI = [182, 90, 60, 30, 15, 7, 1];
  const ogniAcque = CANDIDATI.find(n => n < divario) || P("ogniGiorniAcque");
  spingi("sa1", ogniAcque, 0, "Piano simulato: campionamento della vasca di decantazione.");

  /* ⛔ GARANTITO «da-fare», ed è lo stato più stretto dei sei: la prossima
     misura è scaduta ma sta ancora dentro la tolleranza, cioè una finestra di
     pochi giorni. Sorteggiarlo vorrebbe dire non produrlo quasi mai — il
     minimo su dieci semi diceva **0**, e anche il massimo. Quindi la frequenza
     si sceglie dal divario vero del punto (`ogni = divario` → «Da fare oggi»),
     esattamente come per «in ritardo». Serve un punto con almeno un giorno di
     divario: si prende il più piccolo fra quelli che ce l'hanno, perché è il
     più verosimile. */
  const divarioDi = (id) => { const u = ultimaDi(id);
    return u ? -giorniTra(u, new Date(fine + "T00:00:00")) : null; };
  const candidato = punti.filter(p => p.id !== "sa1" && p.id !== "sq1")
    .map(p => ({ id: p.id, g: divarioDi(p.id) }))
    .filter(x => x.g != null && x.g >= 1)
    .sort((a, b) => a.g - b.g)[0];
  if (candidato)
    spingi(candidato.id, candidato.g, 5,
      "Piano simulato: misura in scadenza, ancora dentro la tolleranza.");

  /* ⛔ GARANTITO «mai»: la riga c'è, il punto esiste, e nessuno ha mai misurato.
     `dal` vuoto, se no si partirebbe da lì e lo stato sarebbe un ritardo. */
  righe.push({ id: `spr${righe.length + 1}`, monitoraggioId: "sq1",
    ogniGiorni: 60, tolleranzaGiorni: 7, dal: "",
    nota: "Piano simulato: strumento installato, mai misurato.", attivo: true });
  /* ⛔ GARANTITO «senza-frequenza»: ogni quanto misurare non è stato deciso. */
  righe.push({ id: `spr${righe.length + 1}`, monitoraggioId: "sr1",
    ogniGiorni: 0, tolleranzaGiorni: 0, dal: primoGiorno,
    nota: "Piano simulato: frequenza ancora da concordare.", attivo: true });
  /* ⛔ GARANTITO «sospesa». */
  righe.push({ id: `spr${righe.length + 1}`, monitoraggioId: "sp1",
    ogniGiorni: 30, tolleranzaGiorni: 5, dal: primoGiorno,
    nota: "Piano simulato: campagna sospesa.", attivo: false });
  /* ⛔ GARANTITO: la riga che punta a un punto CHE NON C'È PIÙ. */
  righe.push({ id: `spr${righe.length + 1}`, monitoraggioId: "s-rimosso",
    ogniGiorni: 15, tolleranzaGiorni: 3, dal: primoGiorno,
    nota: "Piano simulato: il punto di misura è stato tolto dall'elenco.", attivo: true });
  return righe;
}

/* ══════════════════════════════════════════════════════════════════════
   L'INSIEME.
   ══════════════════════════════════════════════════════════════════════ */
export function generaSentinella(ctx) {
  /* ⚠️ `T` (la taglia) NON si usa, ed è una decisione: quanti punti di misura
     ci sono in una cava lo scrive l'AUTORIZZAZIONE, non la produzione. Una
     cava grande non ha più centraline di una piccola — ha le stesse, con più
     letture dentro, e il volume qui cresce dalla campata e dalle volate. Il
     vantaggio pratico è che le tre taglie restano confrontabili sulla stessa
     configurazione. */
  const { rnd, giorni, ana, d, fine, piu } = ctx || {};
  if (!Array.isArray(giorni) || !giorni.length) {
    /* ⚠️ un calendario vuoto FERMA la generazione invece di consegnare sette
       collezioni vuote che nessuno distinguerebbe da una cava senza dati */
    throw new Error("generaSentinella: `giorni` è vuoto — senza calendario non c'è niente da misurare");
  }
  if (typeof rnd !== "function" || typeof piu !== "function")
    throw new Error("generaSentinella: servono `rnd` e `piu` dal generatore");

  const primoGiorno = giorni[0].iso;
  /* quanti giorni di CALENDARIO copre la simulazione: le finestre delle
     tarature si tarano su questo, se no una cava da un mese e una da due anni
     vogliono numeri diversi scritti a mano in due posti */
  const campata = Math.max(1, -giorniTra(primoGiorno, new Date(fine + "T00:00:00")));
  const ric = ricettoriDi();

  /* IL MESE CIECO — scelto PRIMA di generare, così tutti i punti lo saltano
     insieme. Si prende fra i mesi interni (mai il primo né l'ultimo: un buco
     agli estremi si confonde con l'inizio e la fine dell'archivio) e si
     preferisce quello con MENO volate, perché una volata senza la sua lettura
     resta senza PPV — legittimo, ma è un caso che non voglio moltiplicare. */
  const mesiSpan = [...new Set(giorni.map(g => mese(g.iso)))];
  const volatePerMese = new Map();
  for (const v of (d.volate || []))
    volatePerMese.set(mese(v.giorno), (volatePerMese.get(mese(v.giorno)) || 0) + 1);
  /* ⚠️ DICHIARATO E NON NASCOSTO: su una campata di UN MESE non esiste nessun
     mese interno, quindi il buco del programma NON si può produrre — un mese
     cieco agli estremi è indistinguibile dall'inizio o dalla fine
     dell'archivio. Da tre mesi in su il caso esce sempre. `casiSentinella` lo
     conta, quindi chi genera una cava da un mese lo legge come «0» in
     `maiProdotti` invece di crederlo provato. */
  const interni = mesiSpan.slice(1, -1);
  const meseVuoto = interni.length
    ? interni.slice().sort((a, b) =>
        ((volatePerMese.get(a) || 0) - (volatePerMese.get(b) || 0)) || (a < b ? -1 : 1))[0]
    : null;
  /* il mese su cui punta l'adempimento «periodo senza misure»: se non c'è un
     mese cieco dentro il periodo si usa quello PRIMA dell'inizio, che di
     letture non ne ha per costruzione */
  const meseCieco = meseVuoto || mese(piu(primoGiorno, -20));

  const ppvPerGiorno = new Map((d.volate || []).map(v => [v.giorno, v.ppv]));

  const punti = schedePunti().map(s => {
    const letture = generaLetture(s, giorni, rnd, piu, meseVuoto, ppvPerGiorno);
    /* `valore` è la fotografia dell'ultima misura, ed è come lo tengono TUTTI
       gli scrittori dell'app (`valore: ult ? ult.valore : …`). Su un punto mai
       misurato è `null` e non 0: `statoMisura` deve rispondere «Mai misurato»,
       e uno zero scritto sarebbe una misura. Le letture illeggibili non contano
       — è la stessa domanda di `lettureLeggibili`. */
    const buone = letture.filter(l => l.valore != null && /^\d{4}-\d{2}-\d{2}$/.test(l.data));
    const ult = buone.length ? buone[buone.length - 1] : null;
    return {
      id: s.id, nome: s.nome, tipo: s.tipo, unita: s.unita,
      soglia: s.soglia, ricettoreId: s.ricettoreId, nota: s.nota,
      valore: ult ? ult.valore : null,
      tarature: tarature(s, primoGiorno, fine, piu, campata),
      letture,
    };
  });

  const volate = generaVolate(d, ana, fine, piu, rnd, punti);
  const reclami = generaReclami(giorni, rnd, d, ric);
  const adempimenti = generaAdempimenti(fine, piu, meseCieco);
  const registri = generaRegistri();
  const programma = generaProgramma(punti, primoGiorno, fine);

  return {
    monitoraggi: punti, ricettori: ric, reclami, adempimenti, registri, programma, volate,
  };
}

/* ⛔ IL CENSIMENTO DEI CASI VOLUTI — si legge PRIMA dei risultati.
   Un generatore che non ha prodotto un caso non ha provato niente su quel caso,
   e senza questo conto la cosa passerebbe in silenzio. Sta in una funzione a
   parte, e DERIVA dai dati generati invece di essere scritto accanto a loro:
   un conto scritto due volte dice due cose diverse il giorno che una delle due
   smette di essere aggiornata.
   ⚠️ Si legge insieme a `maiProdotti`: «zero» non è «a posto», è «su questo
   caso questa cava non dimostra niente». */
export function casiSentinella(s, oggi) {
  const M = (s && s.monitoraggi) || [];
  const tutte = M.flatMap(m => (m.letture || []).map(l => ({ ...l, m })));
  /* ⛔ `dataISOEsiste` e NON una regex sulla forma. La prima stesura di questo
     censimento usava `/^\d{4}-\d{2}-\d{2}$/`, e la data impossibile che il
     generatore produce apposta — «2024-02-30» — quella forma ce l'ha: risultato,
     `lettureConDataImpossibile: 0` (il caso c'era e il righello non lo vedeva)
     e `mesiSenzaMisure: 6` invece di 1, perché quel finto febbraio allargava lo
     span di cinque mesi inesistenti. Due numeri sbagliati, in due direzioni
     opposte, dallo stesso errore già scritto in CLAUDE.md. */
  const ok = (x) => dataISOEsiste(String(x || "").slice(0, 10));
  const mesiConMisure = new Set(tutte.filter(l => l.valore != null && ok(l.data)).map(l => mese(l.data)));
  const mesiSpan = [...new Set(tutte.filter(l => ok(l.data)).map(l => mese(l.data)))].sort();
  const primo = mesiSpan[0], ultimo = mesiSpan[mesiSpan.length - 1];
  /* i mesi di calendario compresi fra il primo e l'ultimo misurato in cui non
     c'è NESSUNA misura: è il buco del programma, e lo si conta invece di
     dedurlo dalla variabile che l'ha prodotto */
  const mesiCiechi = [];
  if (primo && ultimo) {
    let [a, mm] = primo.split("-").map(Number);
    const [af, mf] = ultimo.split("-").map(Number);
    while (a * 12 + mm <= af * 12 + mf) {
      const k = `${a}-${String(mm).padStart(2, "0")}`;
      if (!mesiConMisure.has(k)) mesiCiechi.push(k);
      mm++; if (mm > 12) { mm = 1; a++; }
    }
  }
  const V = (s && s.volate) || [];
  const P_ = (s && s.programma) || [];
  /* il giorno rispetto a cui si dice «scaduta»: quello passato, oppure l'ultima
     misura leggibile. ⚠️ NON si ripiega su `new Date()`: un censimento che
     cambia risposta a seconda del giorno in cui lo si lancia non è un censimento. */
  const riferimento = ok(oggi) ? String(oggi).slice(0, 10)
    : (mesiSpan.length ? tutte.filter(l => ok(l.data)).map(l => l.data).sort().pop() : "9999-12-31");
  const casi = {
    puntiDiMisura:            M.length,
    lettureTotali:            tutte.length,
    lettureSenzaValore:       tutte.filter(l => l.valore == null).length,
    lettureConDataImpossibile:tutte.filter(l => !ok(l.data)).length,
    letturePariAllaSoglia:    tutte.filter(l => l.valore != null && l.m.id === "sv1"
                                && l.valore === PARAMETRI_SENTINELLA.sogliaVibrazioniAbitato.v).length,
    lettureSenzaProvenienza:  tutte.filter(l => !l.origine).length,
    lettureAMano:             tutte.filter(l => l.origine && l.origine.da === "manuale").length,
    lettureCorrette:          tutte.filter(l => l.origine && l.origine.corretta).length,
    puntiSenzaSoglia:         M.filter(m => m.soglia == null).length,
    puntiSenzaLetture:        M.filter(m => !(m.letture || []).length).length,
    puntiSenzaTaratura:       M.filter(m => !(m.tarature || []).length).length,
    tarateScadute:            M.filter(m => (m.tarature || []).length
                                && m.tarature[m.tarature.length - 1].scadenza < riferimento).length,
    mesiSenzaMisure:          mesiCiechi.length,
    ricettoriSenzaDistanza:   ((s && s.ricettori) || []).filter(r => r.distanza == null).length,
    ricettoriSenzaSoglia:     ((s && s.ricettori) || []).filter(r => r.soglia == null).length,
    ricettoriSenzaPunti:      ((s && s.ricettori) || [])
                                .filter(r => !M.some(m => m.ricettoreId === r.id)).length,
    volateEseguite:           V.filter(v => v.stato !== "prevista").length,
    volatePreviste:           V.filter(v => v.stato === "prevista").length,
    volateSenzaDistanza:      V.filter(v => v.distanzaRicettore == null).length,
    volateSenzaKg:            V.filter(v => v.kgTotali == null).length,
    volateConPpv:             V.filter(v => v.ppvMisurata > 0).length,
    volateSenzaPpv:           V.filter(v => v.stato !== "prevista" && !(v.ppvMisurata > 0)).length,
    volateContestate:         V.filter(v => v.esito === "contestazione").length,
    volateDataImpossibile:    V.filter(v => !ok(v.data)).length,
    volateLimiteSenzaNorma:   V.filter(v => v.ppvPrevLimite > 0 && !String(v.ppvPrevNorma || "").trim()).length,
    reclamiAperti:            ((s && s.reclami) || []).filter(x => x.stato !== "chiuso").length,
    reclamiChiusi:            ((s && s.reclami) || []).filter(x => x.stato === "chiuso").length,
    reclamiDataImpossibile:   ((s && s.reclami) || []).filter(x => !ok(x.data)).length,
    adempimentiSenzaPeriodo:  ((s && s.adempimenti) || []).filter(a => a.periodoMesi == null).length,
    adempimentiSenzaTermine:  ((s && s.adempimenti) || [])
                                .filter(a => a.periodoMesi != null && a.giorniConsegna == null).length,
    adempimentiDataImpossibile:((s && s.adempimenti) || []).filter(a => !ok(a.scadenza)).length,
    registriInAttesa:         ((s && s.registri) || []).filter(g => g.stato === "in-attesa").length,
    programmaSenzaFrequenza:  P_.filter(r => !(r.ogniGiorni > 0)).length,
    programmaSospese:         P_.filter(r => r.attivo === false).length,
    programmaPuntoSparito:    P_.filter(r => !M.some(m => m.id === r.monitoraggioId)).length,
  };
  return { ...casi, maiProdotti: Object.entries(casi).filter(([, n]) => n === 0).map(([k]) => k) };
}
