/* ⛔ LA CAVA SINTETICA — un ecosistema che vive, per trovare i difetti che la
   dimostrazione non può mostrare.
   ══════════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE. Oggi la dimostrazione delle sei app pesa **408 righe in
   tutto** (campo 68, conti 77, flotta 58, scudo 125, sentinella 28, terra 52),
   e Terra copre ventitré mesi con **otto rilievi**. Su dati così non si può
   vedere:
     · che cosa si rompe col VOLUME — il difetto del 06/08 era una barra da
       2.261 m³ disegnata **3 px**, identica a cinque mesi a zero, e non si
       vedeva «perché senza dati d'esempio tutti i valori sono a zero, e
       stanghette uguali sono esattamente quello che ci si aspetta da un
       grafico vuoto»;
     · se i PONTI fra le app raccontano la stessa storia **nel tempo**: oggi
       sono provati con fixture scritte a mano, mai con una cava che cammina;
     · i casi che la dimostrazione non ha mai. La demo è quasi tutta «sana»,
       quindi le difese costruite in due settimane — «non misurato», «senza
       data», «non calcolabile» — non vengono quasi mai esercitate.

   ⛔ L'ORACOLO NON È IL DATO, È IL VERDETTO. Misurato il 14/08 prima di
   scrivere una riga di questo file, ed è la ragione per cui è fatto così.
   Confrontando i dati GREZZI fra `scudo.scadenze` e `campo.scadenzeScudo`
   uscivano **8 righe divergenti su 9** — lo stesso id puntava a persone
   diverse. Sembrava grave. Poi ho chiamato la funzione vera che decide
   (`idoneitaDiTurno` di `shared/dw-ponti.js`) su tutt'e due gli insiemi:
   **zero verdetti diversi su quattro persone** — Mario, Luca e Giulia
   «scaduta», Paolo «in-scadenza», identici. Il prodotto diceva la stessa cosa.
   Quindi: **un confronto fra record produce falsi allarmi; quello che conta è
   se le due schermate DICONO all'utente cose diverse.** Chi userà questo
   generatore misuri i verdetti, non le righe.

   ⛔ LE COPIE FRA APP SI DERIVANO, NON SI SCRIVONO. Ogni app porta una copia
   dei dati delle vicine (`campo.lavoratoriScudo`, `terra.rapportiniCampo`,
   `conti.rilieviTerra`…). In PRODUZIONE non è una copia: il ponte legge la
   collezione vera dell'altra app (`leggiScudo("scadenze")` →
   `orgCollection`). Nella dimostrazione invece sono array scritti a mano, e
   infatti hanno preso a divergere. Qui la copia è **derivata dall'originale
   per costruzione**: non può divergere, e se un giorno divergesse vorrebbe
   dire che è cambiata la derivazione, che è una cosa che si legge.

   ⚠️ I NUMERI DI QUESTO FILE SONO DICHIARATI, NON INVENTATI DI NASCOSTO. Tutti
   i parametri stanno nel blocco `PARAMETRI`, ognuno con la sua **provenienza**:
   `[demo]` ricavato dalla dimostrazione che il fondatore ha validato,
   `[dedotto]` scelto da me e non verificato, `[ricerca]` da una fonte citata
   in `docs/RICERCA_SIMULATORE_*.md`. Finché un parametro è `[dedotto]`, ciò che
   il simulatore dice **sul mestiere** non vale niente: vale solo ciò che dice
   sul COMPORTAMENTO DEL SOFTWARE, che è il motivo per cui è nato.

   ⛔ QUESTI DATI NON SONO DATI VERI e non devono mai sembrarlo: ogni cava
   generata porta `simulazione: true` e un nome che lo dichiara.

   Uso:  import { generaCava } from "./cava-sintetica.mjs";
         const c = generaCava({ mesi: 24, seme: 7 });
         c.terra.rilievi.length                                              */

/* ⛔ La densità NON si riscrive qui: si importa da dove il prodotto la
   decide. È la regola di CLAUDE.md sulla copia più debole — una densità
   scritta due volte diverge, e il ponte comincerebbe a confrontare due
   conversioni diverse senza che niente lo dica. */
import { densitaDelMateriale } from "../../../../shared/dw-ponti.js";

export const MATERIALE = "Calcare";

/* ── il caso, ma ripetibile ────────────────────────────────────────────
   Un generatore con `Math.random()` dà una cava diversa a ogni giro, e un
   difetto trovato non si riprodurrebbe: il seme è la differenza fra una misura
   e un aneddoto. È lo stesso motivo per cui Genesi usa un seme fisso nella
   banda d'incertezza. */
function seminatore(seme) {
  let s = seme >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ⛔ LA MEDIA NAZIONALE NON DESCRIVE NESSUNA CAVA ESISTENTE.
   È l'avviso più importante che la ricerca ha consegnato, e cambia la forma di
   questo file: le tre fonti convergono su ~66.000 t/anno per sito, ma una sola
   cava italiana ne dichiara **sedici volte tanto**. Generare «la cava media»
   vuol dire simulare una cosa che non esiste. Quindi la taglia è una SCELTA di
   chi genera, non un valore centrale con del rumore addosso.
   Fonte: `docs/RICERCA_SIMULATORE_produzione.md`. */
export const TAGLIE = {
  piccola: { produzioneAnnuaT: 25000,   persone: 4,  mezzi: 3 },
  media:   { produzioneAnnuaT: 66000,   persone: 7,  mezzi: 6 },
  grande:  { produzioneAnnuaT: 1200000, persone: 35, mezzi: 22 },
};

export const PARAMETRI = {
  giorniLavorativiSettimana: { v: 5, u: "giorni", da: "[dedotto]" },
  turniAlGiorno:             { v: 2, u: "turni",  da: "[demo] la dimostrazione ha Mattina e Pomeriggio" },
  oreTurno:                  { v: 8, u: "ore",    da: "[demo] durate.minuti = 480" },
  squadre:                   { v: 3, u: "squadre", da: "[demo] campo.squadre" },
  fronti:                    { v: 3, u: "fronti",  da: "[demo] terra.fronti" },

  /* ⛔ LA PRODUZIONE PER TURNO NON SI SCRIVE: SI DIVIDE. Prima era 260 t/turno,
     presa dall'obiettivo della dimostrazione, e con 524 turni all'anno avrebbe
     dato **136.000 t/anno** — il doppio di una cava media, senza che niente lo
     dicesse. Adesso l'ingresso è la produzione ANNUA (che è il numero che le
     fonti pubblicano) e il turno è quello che ne discende. */
  variazioneProduzione:      { v: 0.30, u: "quota", da: "[dedotto] ±30% attorno all'atteso" },

  /* ⛔ E LA STAGIONALITÀ CHE AVEVO SCRITTO ERA SBAGLIATA NEL VERSO PEGGIORE.
     Avevo messo agosto a 0,8 tirando a indovinare. L'unico dato che la ricerca
     ha trovato è **americano** (Fed di Chicago: minimo a febbraio, picco ad
     **agosto +7%**) e la ricerca stessa lo ha dichiarato NON trasferibile —
     copiarlo avrebbe messo il massimo dove l'Italia ha il fermo più profondo.
     ⚠️ Resta `[dedotto]`: la serie ISTAT che servirebbe (`DCSC_INDXPRODCOSTR_1`)
     esiste e non si è potuta leggere. La forma qui sotto è quella qualitativa
     descritta dalla ricerca — anno a DOPPIA GOBBA, minimi a gennaio-febbraio e
     ad agosto — e va verificata prima di ricavarne qualunque conclusione. */
  stagionalita:              { v: [0.65, 0.70, 0.95, 1.10, 1.20, 1.20, 1.05, 0.45, 1.15, 1.20, 1.00, 0.75],
                               u: "moltiplicatore per mese",
                               da: "[dedotto] forma qualitativa dalla ricerca; la serie ISTAT non è leggibile" },

  /* ⛔ LA FREQUENZA DELLE VOLATE NON È UN PARAMETRO, È UNA DIVISIONE:
     produzione ÷ (volume della volata × densità). Avevo scritto «una ogni 21
     giorni»: per una cava media sono **9-10 all'anno, circa una al mese**, e il
     mio numero era fuori di diciassette volte — avrebbe prodotto una cava che
     brilla come una grande e produce come una media, incoerente per
     costruzione. Ora le volate si contano dalla produzione. */
  /* ⚠️ CONTRADDIZIONE FRA DUE NUMERI DELLA STESSA RICERCA, dichiarata invece
     che appianata — è la regola che la ricerca stessa ha applicato a sé.
     Da una parte «una cava media fa 9-10 volate all'anno»; dall'altra un volume
     di volata tipo di 9.000 m³, che a 1,55 t/m³ fa 13.950 t e quindi, su 66.000
     t/anno, **4,7 volate**. I due non possono stare insieme.
     Tengo il CONTO DELLE VOLATE, perché è il dato riportato direttamente, e da
     lui ricavo il volume: 66.000 / 9,5 / 1,55 = **4.480 m³ a volata**. Il 9.000
     resta scritto qui accanto perché chi rifarà la ricerca lo incontrerà e deve
     sapere che è stato scartato, e perché. */
  volatePerAnnoCavaMedia:    { v: 9.5, u: "volate/anno", da: "[da risultati di ricerca] «9-10 all'anno, circa una al mese» per una cava media" },
  volumeVolataM3Scartato:    { v: 9000, u: "m³/volata", da: "[SCARTATO] darebbe 4,7 volate/anno contro le 9-10 riportate" },
  densitaBancoTM3:           { v: 1.55, u: "t/m³", da: "[da risultati di ricerca] densità implicita 1,45-1,60 dai listini; ⚠️ un produttore dichiara 1,75 per lo stesso materiale, discrepanza lasciata visibile" },

  giorniFraRilieviDrone:     { v: 30, u: "giorni", da: "[demo] «Terra misura col drone una volta al mese»" },
  giorniFraLettureAmbientali:{ v: 30, u: "giorni", da: "[dedotto]" },

  /* ⛔ INFORTUNI: 14,6 denunce ‰ addetti-anno (INAIL B 081 2015-19, 2.008
     denunce su 25-30.000 addetti). Avevo scritto 0,5 eventi/anno a prescindere
     dalle persone: per sette persone il vero è **0,10/anno**, cioè uno ogni
     dieci anni. Ero fuori di cinque volte, e nel verso che rende la cava più
     pericolosa di quella vera.
     ⚠️ Controprova indipendente riportata dalla ricerca: il tasso per 200.000 h
     (1,77) coincide quasi alla cifra con l'all-injury rate MSHA USA (1,74). Non
     prova che sia giusto, dice che non è assurdo. */
  infortuniPerMillePersoneAnno: { v: 14.6, u: "‰ addetti-anno", da: "[da risultati di ricerca] INAIL B 081 2015-19" },

  /* ⚠️ 5-9 segnalazioni/anno per VENTI addetti con un programma maturo: qui
     scalato sulle persone. Sotto 2 vuol dire un sistema che non raccoglie, non
     una cava sicura — ed è un'informazione sul PRODOTTO, non sul simulatore.
     ⛔ E la piramide di Heinrich NON si usa per far discendere i gravi dai
     near-miss: la critica moderna dice che solo ~20% degli eventi ha potenziale
     grave, e con cause DIVERSE dall'altro 80%. Sono due processi separati, e
     qui infatti si generano separatamente. */
  nearMissPerVentiPersoneAnno:  { v: 7, u: "eventi/anno", da: "[da risultati di ricerca] due strade convergenti" },

  /* ⛔ IL SERVIZIO IN CAVA DIMEZZA GLI INTERVALLI: il libretto dice 250 h, la
     cava li fa a 125 (moltiplicatore 0,5×, 80-100% di carico motore). Chi usa
     i nominali sottostima gli eventi del doppio. */
  oreFraTagliandi:           { v: 125, u: "ore", da: "[da risultati di ricerca] 250 h nominali × 0,5 per servizio in cava" },
  fermiMacchinaMese:         { v: 2,   u: "eventi/mese", da: "[dedotto]" },

  /* Il lato commerciale. ⚠️ Il divario fra legge e realtà è il dato che conta:
     30 giorni per il D.Lgs 231/2002, ~80 giorni reali nell'edilizia (Cribis). */
  prezzoTonnellataEuro:      { v: 15, u: "€/t", da: "[da risultati di ricerca] inerte da costruzione" },
  giorniIncassoReali:        { v: 80, u: "giorni", da: "[da risultati di ricerca] Cribis, edilizia" },
  giorniIncassoLegge:        { v: 30, u: "giorni", da: "[da risultati di ricerca] D.Lgs 231/2002, di seconda mano" },

  /* ⛔ I BUCHI VOLUTI — la ragione principale per cui questo generatore esiste.
     La dimostrazione è quasi tutta «sana», quindi le difese non vengono mai
     esercitate. Qui i casi che il prodotto DEVE saper raccontare si producono
     apposta, con una frequenza dichiarata. Un generatore che facesse solo dati
     puliti proverebbe il prodotto esattamente dove non serve. */
  quotaSenzaData:            { v: 0.03, u: "quota", da: "[dedotto] righe con la data mancante" },
  quotaSenzaMisura:          { v: 0.05, u: "quota", da: "[dedotto] rapportini senza quantità" },
  quotaMesiSenzaRilievo:     { v: 0.15, u: "quota", da: "[dedotto] mesi in cui il drone non ha volato" },
  quotaPersoneSenzaScadenze: { v: 0.10, u: "quota", da: "[dedotto] persone di cui non si sa niente" },
  /* l'errore di misura del volo, e i voli che non coprono tutto lo scavo: sono
     le due spiegazioni che il ponte Campo↔Terra deve saper nominare entrambe */
  erroreRilievo:             { v: 0.06, u: "quota", da: "[dedotto] ±6% fra due voli fotogrammetrici" },
  quotaVoliParziali:         { v: 0.12, u: "quota", da: "[dedotto] il volo non ha coperto tutto lo scavo" },
};

const P = (k) => PARAMETRI[k].v;

/* ── il calendario ─────────────────────────────────────────────────────
   Un giorno lavorativo non è «un giorno»: la domenica non si lavora, e ad
   agosto la cava rallenta. Il calendario è la spina dorsale — tutto il resto
   si appende a un giorno. */
function calendario(mesi, fine) {
  const giorni = [];
  const d = new Date(fine);
  d.setUTCDate(d.getUTCDate() - Math.round(mesi * 30.44));
  const stop = new Date(fine);
  while (d <= stop) {
    const dow = d.getUTCDay();
    const feriale = dow !== 0 && (P("giorniLavorativiSettimana") >= 6 || dow !== 6);
    if (feriale) giorni.push({ iso: d.toISOString().slice(0, 10), mese: d.getUTCMonth() });
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return giorni;
}

const iso = (d) => d.toISOString().slice(0, 10);
const piu = (isoStr, giorni) => {
  const d = new Date(isoStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + giorni);
  return iso(d);
};

const NOMI = ["Mario Rossi", "Luca Bianchi", "Giulia Verdi", "Paolo Gallo", "Anna Conti",
  "Davide Neri", "Sara Ferri", "Marco Riva", "Elena Costa", "Franco Mari",
  "Chiara Sala", "Andrea Lupo", "Ivan Bosco", "Rita Fava", "Gino Prato"];
const RUOLI = ["Fochino", "Escavatorista", "Palista", "Autista", "Capocantiere", "Addetto impianto"];

/* ══════════════════════════════════════════════════════════════════════
   L'ANAGRAFICA — la parte ferma, da cui tutto il resto dipende.
   Si genera UNA volta e la consumano tutte e sei le app: è questo che rende
   la cava un ecosistema invece di sei insiemi di numeri scollegati.
   ══════════════════════════════════════════════════════════════════════ */
function anagrafica(rnd, taglia) {
  const persone = Array.from({ length: taglia.persone }, (_, i) => ({
    id: `d${i + 1}`,
    nome: NOMI[i % NOMI.length],
    ruolo: RUOLI[i % RUOLI.length],
    attivo: true,
  }));
  const squadre = Array.from({ length: P("squadre") }, (_, i) => ({
    id: `q${i + 1}`,
    nome: `Squadra ${String.fromCharCode(65 + i)}`,
    persone: 2 + Math.floor(rnd() * 3),
    area: ["fronte Est", "fronte Nord", "impianto"][i % 3],
    stato: "operativa",
  }));
  /* gli operatori di Campo SONO le persone di Scudo, viste dall'altra app:
     `lavoratoreId` è il filo che tiene insieme le due anagrafiche, ed è quello
     che `idoneitaOperatore` segue per sapere se chi è in turno può lavorare */
  const operatori = persone.slice(0, Math.min(persone.length, 5)).map((p, i) => ({
    id: `o${i + 1}`,
    nome: p.nome,
    ruolo: p.ruolo,
    squadra: squadre[i % squadre.length].nome,
    stato: "in-forza",
    lavoratoreId: p.id,
  }));
  const fronti = Array.from({ length: P("fronti") }, (_, i) => ({
    id: `f${i + 1}`,
    nome: ["Fronte Nord", "Fronte Est", "Fronte Sud"][i % 3],
    stato: i === 2 ? "sospeso" : "attivo",
  }));
  return { persone, squadre, operatori, fronti };
}

/* ══════════════════════════════════════════════════════════════════════
   IL DIARIO — giorno per giorno, gli eventi che poi si distribuiscono fra le
   app. È qui che la cava «vive»: un evento nasce una volta e compare in più
   posti, come nella realtà.
   ══════════════════════════════════════════════════════════════════════ */
function diario(giorni, ana, rnd, taglia) {
  const ev = { turni: [], volate: [], rilievi: [], letture: [], infortuni: [], fermi: [] };
  let ultimoRilievo = -999, ultimaLettura = -999;
  const mesiSaltati = new Set();

  /* ── i tre numeri DERIVATI, non scritti ────────────────────────────
     La produzione per turno discende da quella annua; le volate dalla
     produzione; gli infortuni dalle persone. Scriverli a mano è il modo di
     produrre una cava che si contraddice da sola. */
  const anni = giorni.length / (52 * P("giorniLavorativiSettimana"));
  const turniTotali = giorni.length * P("turniAlGiorno");
  /* ⛔ LA STAGIONALITÀ SI NORMALIZZA, SE NO SPOSTA IL TOTALE. Il vettore ha
     media 0,95: usato così faceva produrre alla cava il **9% in meno** di
     quanto dichiarava, su tutte e tre le taglie — uno scarto SISTEMATICO, non
     rumore, e quindi il segno di un difetto del modello. Il danno vero non è il
     9%: è che uno scarto permanente fra il dichiarato di Campo e il misurato di
     Terra si sarebbe letto come un **difetto del prodotto**, e qualcuno avrebbe
     passato una giornata a cercarlo nel posto sbagliato.
     La stagionalità deve spostare i mesi FRA LORO, non il totale dell'anno. */
  const stagMedia = P("stagionalita").reduce((s, x) => s + x, 0) / P("stagionalita").length;
  const perTurno = taglia.produzioneAnnuaT * anni / Math.max(1, turniTotali) / stagMedia;
  /* il volume della volata si RICAVA dal conto delle volate riportato dalla
     ricerca (vedi la contraddizione dichiarata in PARAMETRI), non si scrive */
  const tVolata = TAGLIE.media.produzioneAnnuaT / P("volatePerAnnoCavaMedia");
  const volateAttese = (taglia.produzioneAnnuaT * anni) / tVolata;
  const giorniFraVolate = Math.max(1, Math.round(giorni.length / Math.max(1, volateAttese)));
  const infAnno = taglia.persone * P("infortuniPerMillePersoneAnno") / 1000;
  const nmAnno = taglia.persone * P("nearMissPerVentiPersoneAnno") / 20;
  let ultimaVolata = -giorniFraVolate;
  /* la densità IN BANCO, presa dal prodotto e non riscritta qui */
  const densitaBanco = densitaDelMateriale(MATERIALE).densita;
  let tDaUltimoVolo = 0;

  giorni.forEach((g, i) => {
    const stag = P("stagionalita")[g.mese] ?? 1;
    for (let t = 0; t < P("turniAlGiorno"); t++) {
      const turno = ["Mattina", "Pomeriggio", "Notte"][t];
      const squadra = ana.squadre[(i + t) % ana.squadre.length];
      const fronte = ana.fronti.filter((f) => f.stato === "attivo")[(i + t) % 2];
      const base = perTurno * stag;
      const q = Math.round(base * (1 + (rnd() - 0.5) * 2 * P("variazioneProduzione")));
      /* ⚠️ i buchi voluti: una quantità che manca NON è uno zero — è il caso
         che il prodotto deve saper raccontare, e senza di lui `prodQta: null`
         non viene mai esercitato */
      const senzaMisura = rnd() < P("quotaSenzaMisura");
      const senzaData = rnd() < P("quotaSenzaData");
      ev.turni.push({
        giorno: g.iso, turno, squadraId: squadra.id, squadra: squadra.nome,
        fronteId: fronte ? fronte.id : null,
        qta: senzaMisura ? null : q,
        dataScritta: senzaData ? "" : g.iso,
      });
      /* ⚠️ si accumula quello che è stato DICHIARATO, non quello che è stato
         prodotto: un turno senza quantità registrata è roccia che è uscita dal
         fronte e che nessuno ha scritto — ed è proprio la ragione per cui il
         volo può misurare più di quanto i turni dichiarano. */
      if (!senzaMisura) tDaUltimoVolo += q;
    }
    if (i - ultimaVolata >= giorniFraVolate) {
      ultimaVolata = i;
      const fori = 12 + Math.floor(rnd() * 12);
      ev.volate.push({ giorno: g.iso, fori, kgForo: 55 + Math.round(rnd() * 15),
        fronteId: ana.fronti[0].id, ppv: +(1.2 + rnd() * 4).toFixed(2) });
    }
    if (i - ultimoRilievo >= P("giorniFraRilieviDrone")) {
      ultimoRilievo = i;
      /* alcuni mesi il drone non vola: è il caso «non misurato» che Terra
         esiste per dichiarare, e che nella dimostrazione non c'è mai */
      if (rnd() >= P("quotaMesiSenzaRilievo")) {
        /* ⛔ IL VOLO MISURA QUELLO CHE I TURNI HANNO PORTATO VIA, NON UN NUMERO
           A CASO. Prima era `4000 + rnd()*8000`, indipendente dalla produzione:
           il ponte Campo↔Terra confrontava due grandezze scorrelate e diceva
           **«implausibile» nove mesi su nove**. Non era un difetto del prodotto
           — il prodotto aveva ragione, i dati ERANO incoerenti — ma era un
           simulatore che non può provare il ponte che esiste per provare.
           ⚠️ E LE DUE DENSITÀ NON SONO LA STESSA COSA, ed è l'errore che stava
           sotto: il drone misura il **vuoto lasciato nel fronte**, cioè roccia
           IN BANCO (2,6 t/m³ per il calcare); i listini quotano il materiale
           SCIOLTO (1,45-1,60). Convertendo col numero sbagliato il confronto
           usciva sballato di **1,62 volte**, che è esattamente 2,6/1,55.
           Si usa la densità che usa il PRODOTTO (`densitaDelMateriale`), non
           una scritta qui: se un giorno cambia là, cambia anche qui. */
        /* ⛔ UN RILIEVO DA CUMULO NON CONSUMA LA PRODUZIONE DEL FRONTE, e per
           un giro l'ha fatto: l'accumulatore si azzerava a ogni volo, cumulo
           compreso, ma il prodotto — giustamente — conta come «misurato» solo
           lo SCAVO. Risultato: quella produzione spariva dal lato misurato e il
           confronto sui due anni usciva **-24%** senza che nessuna delle due
           parti avesse torto. Un cumulo misura un mucchio sul piazzale, non il
           vuoto lasciato nel fronte: ha un volume suo e lascia intatto il
           conto del fronte. */
        const daCumulo = rnd() < 0.15;
        if (daCumulo) {
          ev.rilievi.push({ giorno: g.iso, fronteId: ana.fronti[i % 2].id,
            volumeM3: 200 + Math.round(rnd() * 800), provenienza: "cumulo" });
        } else {
          const tonnellate = tDaUltimoVolo;
          tDaUltimoVolo = 0;
          const erroreVolo = 1 + (rnd() - 0.5) * 2 * P("erroreRilievo");
          const m3Banco = Math.round(tonnellate / densitaBanco * erroreVolo);
          /* il volo che NON copre tutto lo scavo: è una delle due spiegazioni
             che il ponte deve nominare, e senza di lui non è mai esercitata.
             ⚠️ quello che non ha coperto NON sparisce: resta nell'accumulatore
             e lo misurerà il volo dopo, che è ciò che succede davvero. */
          const parziale = rnd() < P("quotaVoliParziali");
          const visto = parziale ? Math.round(m3Banco * 0.6) : m3Banco;
          if (parziale) tDaUltimoVolo = (m3Banco - visto) * densitaBanco;
          ev.rilievi.push({ giorno: g.iso, fronteId: ana.fronti[i % 2].id,
            volumeM3: Math.max(1, visto), provenienza: "scavo" });
        }
      } else mesiSaltati.add(g.iso.slice(0, 7));
    }
    if (i - ultimaLettura >= P("giorniFraLettureAmbientali")) {
      ultimaLettura = i;
      ev.letture.push({ giorno: g.iso, valore: +(0.8 + rnd() * 4.5).toFixed(2) });
    }
    if (rnd() < (infAnno + nmAnno) / 250) {
      /* ⚠️ i due processi sono SEPARATI, non uno derivato dall'altro: la critica
         moderna alla piramide di Heinrich dice che solo ~20% degli eventi ha
         potenziale grave, e con cause diverse dall'altro 80%. Qui la moneta
         decide solo a quale dei due appartiene l'evento appena estratto. */
      ev.infortuni.push({ giorno: g.iso,
        tipo: rnd() < infAnno / Math.max(infAnno + nmAnno, 1e-9) ? "infortunio" : "near-miss",
        personaId: ana.persone[Math.floor(rnd() * ana.persone.length)].id });
    }
    if (rnd() < P("fermiMacchinaMese") / 21) {
      ev.fermi.push({ giorno: g.iso, minuti: 30 + Math.round(rnd() * 240) });
    }
  });
  return { ...ev, mesiSaltati: [...mesiSaltati] };
}

/* ══════════════════════════════════════════════════════════════════════
   LA CAVA — mette insieme anagrafica e diario e ne ricava i sei insiemi nella
   forma che ogni app sa leggere.
   ⛔ Le copie fra app sono DERIVATE qui sotto, mai riscritte: è l'invariante
   che questo file esiste per garantire.
   ══════════════════════════════════════════════════════════════════════ */
export function generaCava({ mesi = 12, seme = 1, fine = "2026-08-14", taglia = "media" } = {}) {
  const T = TAGLIE[taglia];
  if (!T) {
    /* ⚠️ un nome sconosciuto FERMA la generazione invece di ripiegare sulla
       media: un simulatore che ripiega in silenzio genererebbe una cava
       diversa da quella chiesta, e chi legge i risultati non lo saprebbe. */
    throw new Error(`taglia sconosciuta: "${taglia}". Ce ne sono tre: ` + Object.keys(TAGLIE).join(", "));
  }
  const rnd = seminatore(seme);
  const giorni = calendario(mesi, fine);
  const ana = anagrafica(rnd, T);
  const d = diario(giorni, ana, rnd, T);

  /* ⛔ UN CASO CHE DEVE ESSERE PROVATO NON PUÒ DIPENDERE DAL SEME. Prima queste
     erano una quota probabilistica (10%), e sulla prima prova — 7 persone,
     seme 7 — sono uscite **zero persone senza scadenze**: cioè la difesa che
     Scudo ha costruito apposta («non è "a posto", è una persona di cui non si
     sa niente») non veniva esercitata, e **niente lo diceva**. È la stessa
     famiglia del banco che filtra e si ritrova zero soggetti: un generatore che
     produce zero istanze di un caso non fallisce, tace.
     Quindi i casi rari si **garantiscono**: almeno uno, sempre, e quanti ne
     sono stati prodotti finisce in `meta.casiVoluti`, dove si legge. */
  const scadenze = [];
  const senzaScadenze = new Set();
  const quantiSenza = Math.max(1, Math.round(ana.persone.length * P("quotaPersoneSenzaScadenze")));
  ana.persone.forEach((p, i) => {
    if (i < quantiSenza) { senzaScadenze.add(p.id); return; }   // di questa non si sa niente
    scadenze.push({
      id: `s${i + 1}`, lavoratoreId: p.id, tipo: "Visita medica",
      descrizione: "Visita medica periodica",
      dataScadenza: piu(fine, Math.round((rnd() - 0.35) * 400)),
    });
  });

  /* ⛔ TERZA VOLTA LO STESSO DIFETTO, e l'ha trovato ancora il censimento: su
     dieci semi `rilieviDaCumulo` scendeva a ZERO. È il caso che protegge la
     distinzione fra SCAVO e CUMULO — il materiale ripreso da un cumulo già
     estratto non è nuovo scavo e non deve consumare il volume concesso, che è
     una regola sorvegliata da `run-stile` perché se divergesse manderebbe metri
     cubi sbagliati in un documento che va all'ente. Senza un rilievo da cumulo
     nella cava sintetica, quella regola non viene mai attraversata.
     Tre volte lo stesso errore in un file solo: la lezione non è «garantisci
     questo caso», è che **in un generatore ogni caso raro va garantito per
     costruzione**, perché la probabilità non è una promessa. */
  if (d.rilievi.length && !d.rilievi.some((r) => r.provenienza === "cumulo")) {
    d.rilievi[Math.floor(d.rilievi.length / 2)].provenienza = "cumulo";
  }
  const rilievi = d.rilievi.map((r, i) => ({
    id: `r${i + 1}`, data: r.giorno, stato: "elaborato",
    volumeM3: r.volumeM3, provenienza: r.provenienza, fronteId: r.fronteId,
  }));

  const rapportini = d.turni.map((t, i) => ({
    id: `rs${i + 1}`, data: t.dataScritta, turno: t.turno, titolo: "Rapportino di turno",
    squadra: t.squadra, prodQta: t.qta, prodUnita: "t", ora: "13:00",
    stato: "inviato", fronteId: t.fronteId,
  }));

  /* ⛔ E LA SECONDA VOLTA LO STESSO DIFETTO, trovato dal censimento appena
     scritto: su dieci semi, `infortuniVeri` scendeva a **zero**. Un near-miss
     esce spesso, un infortunio vero no — e senza un infortunio vero gli indici
     IF, IG e LTIFR di Scudo non vengono mai calcolati su niente, compresa la
     difesa sull'infortunio senza anno leggibile chiusa il 14/08.
     Quindi si garantisce: se il caso non è uscito da sé, ce n'è uno per
     costruzione. Il conto resta dichiarato in `meta.casiVoluti`, così si vede
     che è un minimo garantito e non una frequenza vera. */
  if (!d.infortuni.some((x) => x.tipo === "infortunio") && giorni.length) {
    d.infortuni.push({ giorno: giorni[Math.floor(giorni.length / 2)].iso,
      tipo: "infortunio", personaId: ana.persone[0].id });
  }
  const infortuni = d.infortuni.map((x, i) => ({
    id: `i${i + 1}`, data: x.giorno, tipo: x.tipo,
    gravita: x.tipo === "near-miss" ? "lieve" : "media",
    giorniAssenza: x.tipo === "near-miss" ? 0 : 3 + Math.round(rnd() * 20),
    luogo: "fronte Nord", luogoTipo: "fronte", categoria: "caduta-massi",
    rapida: true, descrizione: "Evento generato dalla cava sintetica",
  }));

  /* ── LE SEI APP ─────────────────────────────────────────────────────
     ⚠️ Ogni `*Scudo`, `*Campo`, `*Terra` qui sotto è una DERIVAZIONE
     dell'originale, non una seconda scrittura: è la sola cosa che impedisce
     alle copie di divergere come sono divergute nella dimostrazione. */
  const scudo = {
    lavoratori: ana.persone, operatoriCampo: ana.operatori, squadreCampo: ana.squadre,
    scadenze, documenti: [], cantieri: [{ id: "c1", nome: "Cava simulata", tipo: "cava", stato: "attivo" }],
    appaltatori: [], appalti: [], infortuni,
    oreAnno: [{ id: "oa1", anno: 2026, ore: T.persone * 1700 }],
    azioni: [], analisi: [], ispezioni: [], permessi: [], mansioni: [], nomine: [], dpi: [],
  };

  const campo = {
    attivita: [], squadre: ana.squadre, operatori: ana.operatori,
    frontiTerra: ana.fronti,                       // ← derivato da terra.fronti
    lavoratoriScudo: scudo.lavoratori,             // ← derivato da scudo.lavoratori
    infortuniScudo: scudo.infortuni,               // ← derivato
    scadenzeScudo: scudo.scadenze,                 // ← derivato (qui la demo divergeva)
    rapportini, obiettivi: [], checklist: [], presenze: [], chiusure: [], meteo: [],
    durate: [], pianocarico: [],
    rilieviTerra: rilievi,                         // ← derivato da terra.rilievi
    autorizzazioniTerra: [{ id: "at1", stato: "vigente", materiale: "Calcare" }],
  };

  const terra = {
    fronti: ana.fronti, lotti: [], rilievi,
    piano: [], autorizzazioni: campo.autorizzazioniTerra,
    rapportiniCampo: rapportini,                   // ← derivato da campo.rapportini
    scadenze: [],
  };

  const sentinella = {
    monitoraggi: [{
      id: "m1", nome: "Ricettore abitazione via Cava", tipo: "vibrazioni",
      valore: d.letture.length ? d.letture[d.letture.length - 1].valore : null,
      soglia: 5, unita: "mm/s", nota: "", ricettoreId: "rc1", tarature: [],
      letture: d.letture.map((l, i) => ({ id: `l${i + 1}`, data: l.giorno, valore: l.valore })),
    }],
    ricettori: [{ id: "rc1", nome: "Abitazione via Cava", distanzaM: 320 }],
    reclami: [], adempimenti: [], registri: [],
    programma: [],
    volate: d.volate.map((v, i) => ({ id: `v${i + 1}`, data: v.giorno, fori: v.fori, ppv: v.ppv })),
  };

  const conti = {
    fatture: [], incassi: [],
    clienti: [{ id: "c1", ragioneSociale: "Edilsimulata Srl", piva: "00000000000",
      sdi: "SIM0000", indirizzo: "—", sconto: 0, fido: 50000, note: "" }],
    gare: [], prodotti: [{ id: "p1", nome: "Stabilizzato 0/30", unitaPrezzo: "t",
      prezzo: 8.5, densita: 1.9, iva: 22 }],
    pesate: [], rilieviTerra: rilievi,             // ← derivato da terra.rilievi
    costi: [], impostazioni: [], ordini: [],
  };

  const flotta = {
    mezzi: Array.from({ length: T.mezzi }, (_, i) => ({
      id: `m${i + 1}`, nome: `Mezzo ${i + 1}`, tipo: ["escavatore", "pala", "dumper"][i % 3],
      stato: "operativo",
    })),
    manutenzioni: [], fermi: d.fermi.map((f, i) => ({ id: `fm${i + 1}`, data: f.giorno, minuti: f.minuti })),
    controlli: [], rifornimenti: [], costi: [], interventi: [], ricambi: [],
    scadenze: [], disponibilita: [],
  };

  /* ⛔ IL CENSIMENTO DEI CASI VOLUTI — si legge PRIMA dei risultati.
     Un generatore che non ha prodotto un caso non ha provato niente su quel
     caso, e senza questo conto la cosa passerebbe in silenzio: è la regola
     delle righe «non ho guardato», applicata a chi i dati li fabbrica. */
  const casiVoluti = {
    rapportiniSenzaData:    rapportini.filter((r) => !r.data).length,
    rapportiniSenzaQta:     rapportini.filter((r) => r.prodQta === null).length,
    personeSenzaScadenze:   senzaScadenze.size,
    mesiSenzaRilievo:       d.mesiSaltati.length,
    rilieviDaCumulo:        rilievi.filter((r) => r.provenienza === "cumulo").length,
    infortuniVeri:          infortuni.filter((x) => x.tipo === "infortunio").length,
    nearMiss:               infortuni.filter((x) => x.tipo === "near-miss").length,
  };
  const maiProdotti = Object.entries(casiVoluti).filter(([, n]) => n === 0).map(([k]) => k);

  return {
    simulazione: true,
    meta: {
      simulazione: true,
      nome: "Cava sintetica (dati generati, NON reali)",
      seme, mesi, fine, taglia, produzioneAnnuaT: T.produzioneAnnuaT,
      giorniLavorativi: giorni.length,
      mesiSenzaRilievo: d.mesiSaltati,
      casiVoluti,
      /* ⚠️ NON è «tutto a posto»: è «questi casi non li ho generati, quindi su
         di loro questa cava non dimostra niente». */
      maiProdotti,
      generatoDa: "apps/deepwork-id/tests/simulatore/cava-sintetica.mjs",
    },
    campo, conti, flotta, scudo, sentinella, terra,
  };
}
