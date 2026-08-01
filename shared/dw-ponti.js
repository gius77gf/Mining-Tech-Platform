// ══════════════════════════════════════════════════════════════════════
// I PONTI FRA LE APP — la logica che non appartiene a nessuna delle due
// ══════════════════════════════════════════════════════════════════════
//
// PERCHÉ QUESTO FILE ESISTE. Il ponte Campo → Terra serve a due app: Terra
// mostra quello che i turni hanno dichiarato, e Campo deve poter mostrare a chi
// compila il rapportino se quel numero si è poi parlato col rilievo. La logica
// non è di nessuna delle due: se stesse in `terra-data.js`, Campo dovrebbe
// importare il modulo di un'altra app (accoppiamento che nessun'altra parte
// della piattaforma ha) oppure **riscriverla** — che è esattamente il difetto
// costato una giornata intera: la convenzione sui numeri era finita scritta
// quattro volte, e le sei app leggevano «1.250» in tre modi diversi senza che
// nessun test se ne accorgesse.
//
// Regola per chi aggiunge un ponte: se due app hanno bisogno della stessa
// regola, la regola vive qui. `terra-data.js` la ri-esporta, così le pagine di
// Terra continuano a importare da dove hanno sempre importato — un alias non è
// una seconda implementazione.
//
import { isoLocale, dataISOEsiste } from "./deepwork-id-client/dw-shell.js";

// Tutto quello che c'è qui è PURO e testabile: nessun accesso ai dati, nessun
// DOM. Le letture dei dati restano nei moduli delle app, che passano dall'SDK.

// ── LA PROVENIENZA DI UN RILIEVO ──────────────────────────────────────────
// Un rilievo può misurare due cose molto diverse: SCAVO (materiale tolto dal
// fronte, che CONSUMA il volume concesso) e CUMULO (materiale già estratto,
// ripreso da un mucchio sul piazzale: movimentazione, non nuovo scavo).
// Sommarli farebbe credere di aver consumato più concessione di quella vera,
// col rischio di fermare la cava per un limite non raggiunto.
// COMPATIBILITÀ: un rilievo salvato prima che questo campo esistesse non ha
// `provenienza` e vale SCAVO, cioè si comporta come prima.
// Sta qui perché la stessa regola serve a Terra, a Conti (nel ponte cavato
// contro venduto) e al ponte P2: tre posti, una regola.
export function provenienzaDi(r) {
  return String((r && r.provenienza) || "").trim().toLowerCase() === "cumulo" ? "cumulo" : "scavo";
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P2 — CAMPO → TERRA: quello che i turni dichiarano, fra due rilievi
// ══════════════════════════════════════════════════════════════════════
//
// A COSA SERVE. Terra misura col drone, e un volo si fa una volta al mese o
// meno. Fra due voli Terra non sa niente: la tessera dice il volume dell'ultimo
// rilievo e resta ferma per settimane, mentre la cava continua a produrre. I
// turni invece sanno ogni giorno quanto è uscito. Questo ponte porta in Terra
// quel numero, e serve a due cose: una **stima corrente** fra due rilievi, e un
// **confronto** quando il rilievo nuovo arriva.
//
// IL MODO DI SBAGLIARE PEGGIORE DEL PROBLEMA CHE RISOLVE, e come è stato
// evitato. La tentazione è far entrare la produzione di turno fra i rilievi,
// così le tessere di Terra si aggiornano da sole. Sarebbe il difetto peggiore
// della piattaforma, per tre ragioni che non si vedono subito:
//   1. i rilievi **consumano il volume concesso** e finiscono nel riepilogo
//      annuale che il cliente **consegna agli enti**. Un conteggio di viaggi
//      dichiarato da un preposto non è una misura, e in un documento
//      autorizzativo prenderebbe l'aspetto di una misura;
//   2. un rilievo porta con sé **metodo e GSD** — è difendibile in audit
//      (`qualitaRilievo`). Un numero dichiarato non ha niente di tutto questo:
//      dentro l'insieme dei rilievi sarebbe l'unico indifendibile, e nessuno
//      saprebbe più quale;
//   3. **si conterebbe due volte** la stessa roccia: quella che i camion hanno
//      portato via è la stessa che il volo successivo misura come vuoto di
//      scavo. Sommarle raddoppia.
// Quindi qui NON si crea nessun rilievo, mai. Le funzioni sono pure e
// restituiscono numeri **dichiarati**, tenuti separati e nominati come tali.
//
// COSA QUESTO PONTE NON PUÒ FARE, e va detto invece di aggirarlo: i rapportini
// di Campo **non hanno un fronte**. Il fronte compare solo come testo dentro il
// titolo di un'attività o nell'area di una squadra, e indovinarlo da lì
// attribuirebbe metri cubi a un fronte sbagliato — cioè al volume concesso
// sbagliato. Il confronto quindi vive a livello di **cava**, non di fronte, e
// lo dichiara. Se un giorno Campo avrà il fronte sul rapportino, il confronto
// per fronte si aggiunge senza toccare niente di questo.
//
// IL CONTRATTO CON CAMPO. Un rapportino porta la produzione in `prodQta` +
// `prodUnita`, con le unità ammesse `t` / `m³` / `viaggi` (vedi
// `produzioneDi` e `UNITA_PRODUZIONE` in apps/campo/campo-data.js). Questa è la
// forma del dato che attraversa il confine; un test in
// apps/deepwork-id/tests/run-kpi.mjs verifica che la lettura qui e quella di
// Campo dicano la stessa cosa sugli stessi record, così se Campo cambia la
// forma il disallineamento **fallisce** invece di restare in silenzio.

const RAPP_UNITA = ["t", "m³", "viaggi"];
const dataISOBuona = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || ""));
const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;

// La produzione dichiarata da un rapportino: { qta, unita } oppure null.
// Stessa regola di Campo: serve una quantità > 0, e l'unità sconosciuta ricade
// sulle tonnellate. Un rapportino in BOZZA conta: la produzione è produzione,
// ed è la stessa scelta che Campo fa nello stato dell'obiettivo di turno.
export function produzioneRapportino(r) {
  const q = +((r && r.prodQta) ?? NaN);
  if (!Number.isFinite(q) || q <= 0) return null;
  return { qta: q, unita: RAPP_UNITA.includes(r && r.prodUnita) ? r.prodUnita : RAPP_UNITA[0] };
}

// QUANTO HANNO DICHIARATO I TURNI in un periodo, riportato in metri cubi dove
// si può. Le tre unità non si trattano allo stesso modo, e la differenza è il
// punto della funzione:
//   · m³   → si sommano così come sono, è già la grandezza di Terra;
//   · t    → servono i metri cubi, quindi la DENSITÀ (t/m³). Senza densità non
//            si converte e non si stima: quelle tonnellate restano fuori dal
//            totale in m³ e vengono contate a parte (`tSenzaDensita`), come nel
//            ponte Terra ↔ Conti. Una densità inventata sposta il confronto di
//            quanto il confronto dovrebbe misurare;
//   · viaggi → **non si convertono mai**. Per farlo servirebbe la portata del
//            mezzo, che Terra non ha e che cambia da camion a camion e da
//            carico a carico. Si contano e si dichiarano a parte.
// Ritorna null se i rapportini non arrivano: «non lo so» e «zero» sono due
// risposte diverse. Pura e testabile.
export function produzioneDichiarata(rapportini, dal, al, densita) {
  if (!Array.isArray(rapportini)) return null;
  const d1 = String(dal || ""), d2 = String(al || "");
  const dens = +densita;
  const densOk = Number.isFinite(dens) && dens > 0;
  let m3Diretti = 0, t = 0, viaggi = 0, turni = 0, senzaProduzione = 0, senzaData = 0;
  let primo = null, ultimo = null;
  for (const r of rapportini) {
    const d = String((r || {}).data || "");
    if (!dataISOBuona(d)) { senzaData++; continue; }
    if (d1 && d < d1) continue;
    if (d2 && d > d2) continue;
    const p = produzioneRapportino(r);
    if (!p) { senzaProduzione++; continue; }
    turni++;
    if (!primo || d < primo) primo = d;
    if (!ultimo || d > ultimo) ultimo = d;
    if (p.unita === "m³") m3Diretti = r3(m3Diretti + p.qta);
    else if (p.unita === "t") t = r2(t + p.qta);
    else viaggi += p.qta;
  }
  const m3DaTonnellate = densOk ? r3(t / dens) : 0;
  const m3 = r3(m3Diretti + m3DaTonnellate);
  return {
    m3, m3Diretti, m3DaTonnellate,
    t, tSenzaDensita: densOk ? 0 : t,
    viaggi, turni, senzaProduzione, senzaData,
    primo, ultimo,
    densita: densOk ? dens : null,
    // c'è qualcosa che NON è entrato nel totale in m³? Allora il confronto è
    // per difetto, e chi legge deve saperlo prima di trarne conclusioni.
    parziale: (!densOk && t > 0) || viaggi > 0,
  };
}

// Le soglie del giudizio, in % di quanto ha misurato il rilievo.
// NON sono quelle del ponte Terra ↔ Conti (10% / 35%), e la differenza è
// voluta: là si confrontano due misure (un rilievo e una pesa), qui una misura
// con una STIMA A OCCHIO fatta a fine turno da chi ha altro da fare. Pretendere
// la stessa precisione farebbe suonare l'allarme su una differenza normale, e un
// allarme che suona sempre insegna a non guardarlo più.
export const SOGLIA_TURNI = { coerente: 15, attenzione: 40 };

// IL CONFRONTO fra quello che il rilievo ha MISURATO e quello che i turni hanno
// DICHIARATO, nello stesso periodo. Ritorna sempre uno `stato` che dice come va
// letto il numero:
//   no-campo       · i rapportini non arrivano: senza dichiarato non c'è confronto
//   no-misura      · nel periodo non c'è nessun rilievo elaborato con volume
//   no-dichiarato  · nel periodo nessun turno ha dichiarato una produzione
//   no-densita     · i turni hanno dichiarato solo tonnellate (senza densità)
//                    e/o viaggi: niente è convertibile in m³, non si confronta
//   coerente       · scostamento dentro il ±15% del misurato
//   attenzione     · fra il 15% e il 40%: conviene andare a guardare
//   implausibile   · oltre il 40%: non è imprecisione di stima, è un errore
//   sopra-misura   · dichiarato maggiore del misurato OLTRE la banda di
//                    coerenza: i turni dicono di aver tirato fuori più roccia di
//                    quanta ne manchi dal fronte. O le stime sono gonfie, o il
//                    rilievo non copre tutto quello che è stato scavato.
// `scostamento` è misurato − dichiarato in m³. Il segno conta e non si
// arrotonda via: senza verso non si sa da che parte cercare, e `verso` lo dice
// a parole ("sotto" o "sopra") perché il segno da solo si legge male.
//
// ⚠️ LA BANDA VALE NEI DUE SENSI, e la prima versione no. Guardando lo stato
// «sopra-misura» renderizzato si è visto il difetto: qualunque eccesso, anche
// dell'1%, diventava un allarme rosso. Ma se una stima a occhio può stare
// quindici punti SOTTO la misura senza che sia un problema, può stare quindici
// punti SOPRA per la stessa ragione — è la stessa imprecisione, nell'altro
// verso. Un allarme che scatta su una differenza normale insegna a non
// guardarlo più, che è esattamente ciò che queste soglie dovevano evitare.
// Sopra la banda, però, il verso cambia il SIGNIFICATO: dichiarare più roccia di
// quanta ne manchi dal fronte non è imprecisione, è una delle due cose scritte
// sopra. Per questo lo stato resta distinto.
export function riconciliazioneTurni(rilievi, rapportini, dal, al, densita) {
  const dich = produzioneDichiarata(rapportini, dal, al, densita);
  const mis = misuratoPeriodo(rilievi, dal, al);
  const base = { mis, dich, scostamento: null, pct: null,
                 parziale: !!(dich && dich.parziale) };
  if (dich === null) return { ...base, stato: "no-campo" };
  if (mis === null || !(mis.m3 > 0)) return { ...base, stato: "no-misura" };
  if (!dich.turni) return { ...base, stato: "no-dichiarato" };
  if (!(dich.m3 > 0)) return { ...base, stato: "no-densita" };
  const scostamento = r3(mis.m3 - dich.m3);
  const pct = r2(100 * scostamento / mis.m3);
  const verso = scostamento < 0 ? "sopra" : "sotto";
  const fuori = Math.abs(pct);
  const stato = fuori <= SOGLIA_TURNI.coerente ? "coerente"
    : verso === "sopra" ? "sopra-misura"
    : fuori <= SOGLIA_TURNI.attenzione ? "attenzione"
    : "implausibile";
  return { ...base, stato, scostamento, pct, verso };
}

// Quanto hanno MISURATO i rilievi nel periodo: solo gli ELABORATI con un
// volume, e solo lo SCAVO — un cumulo ripreso dal piazzale non è roccia uscita
// dal fronte, mentre i turni che lo caricano la dichiarano come produzione. È
// una delle ragioni per cui il dichiarato può risultare più alto, e la funzione
// conta i cumuli a parte così il confronto può dirlo. null se i rilievi non
// arrivano. Pura e testabile.
export function misuratoPeriodo(rilievi, dal, al) {
  if (!Array.isArray(rilievi)) return null;
  const d1 = String(dal || ""), d2 = String(al || "");
  let m3 = 0, n = 0, m3Cumulo = 0, nCumulo = 0, pianificati = 0;
  let primo = null, ultimo = null;
  for (const r of rilievi) {
    const v = +((r || {}).volumeM3);
    const d = String((r || {}).data || "");
    if ((r || {}).stato === "pianificato") pianificati++;
    if ((r || {}).stato !== "elaborato" || !Number.isFinite(v) || !dataISOBuona(d)) continue;
    if (d1 && d < d1) continue;
    if (d2 && d > d2) continue;
    if (provenienzaDi(r) === "cumulo") { m3Cumulo = r3(m3Cumulo + v); nCumulo++; continue; }
    m3 = r3(m3 + v); n++;
    if (!primo || d < primo) primo = d;
    if (!ultimo || d > ultimo) ultimo = d;
  }
  return { m3, rilievi: n, m3Cumulo, rilieviCumulo: nCumulo, pianificati, primo, ultimo };
}

// IL PERIODO NATURALE DEL CONFRONTO: fra i due ultimi rilievi elaborati.
// Non è un mese di calendario, ed è meglio così: il volume di un rilievo è
// l'accumulo dall'ultimo volo, quindi confrontarlo con un mese qualsiasi
// significa mettere insieme intervalli diversi e leggere uno scostamento che
// nasce solo dalle date. Il periodo parte dal giorno DOPO il penultimo rilievo
// (quel giorno è già dentro la misura precedente) e finisce col giorno
// dell'ultimo. Serve la data di DUE rilievi: con uno solo non c'è un intervallo,
// e allora null. Pura e testabile.
// TUTTI gli intervalli fra due voli consecutivi, dal più recente. Serve perché
// la sezione del confronto ha una tendina per scegliere il periodo — come la
// sezione «Confronto fra due rilievi» che le sta sopra, per coerenza — ma le
// scelte NON sono date libere: sono i confini dei voli. Una data libera
// permetterebbe di chiedere un periodo che non corrisponde a nessuna misura, e
// il numero che ne esce sarebbe uno scostamento nato solo dalle date. Meglio
// togliere la possibilità di fare la domanda sbagliata che spiegare dopo perché
// la risposta non vale.
export function intervalliFraRilievi(rilievi) {
  if (!Array.isArray(rilievi)) return [];
  const date = [...new Set(rilievi
    .filter(r => r && r.stato === "elaborato" && r.volumeM3 != null
      && Number.isFinite(+r.volumeM3) && dataISOBuona(r.data) && provenienzaDi(r) === "scavo")
    .map(r => String(r.data)))].sort();
  const out = [];
  for (let i = 1; i < date.length; i++) {
    const g = new Date(date[i - 1] + "T00:00:00Z");
    g.setUTCDate(g.getUTCDate() + 1);
    const dal = g.toISOString().slice(0, 10), al = date[i];
    if (dal > al) continue;                       // due voli lo stesso giorno
    out.push({ dal, al, rilievoPrecedente: date[i - 1] });
  }
  return out.reverse();                           // il più recente per primo
}

// Il periodo naturale: l'intervallo più recente. null se non ce n'è nessuno.
export function periodoFraUltimiRilievi(rilievi) {
  const l = intervalliFraRilievi(rilievi);
  return l.length ? l[0] : null;
}

// LA STIMA CORRENTE: dal giorno dopo l'ultimo rilievo elaborato a oggi, quanto
// hanno dichiarato i turni. È il numero che riempie il buco fra due voli del
// drone — l'unica cosa che Terra può dire di quel periodo, e va detta come
// stima dichiarata, mai come volume misurato.
// Ritorna null se non c'è nessun rilievo elaborato da cui partire (senza un
// punto di partenza non è un avanzamento, è solo una somma) o se i rapportini
// non arrivano. Pura e testabile: `oggi` si passa.
export function avanzamentoDaUltimoRilievo(rilievi, rapportini, densita, oggi = new Date()) {
  const mis = misuratoPeriodo(rilievi, "", "");
  if (mis === null || !mis.ultimo) return null;
  const giornoDopo = new Date(mis.ultimo + "T00:00:00Z");
  giornoDopo.setUTCDate(giornoDopo.getUTCDate() + 1);
  const dal = giornoDopo.toISOString().slice(0, 10);
  // ⛔ il giorno di «oggi» si legge in ora LOCALE: `toISOString()` su una data
  // locale scrive il giorno UTC, e in Italia fra mezzanotte e le due sarebbe
  // IERI — con il rilievo di ieri il buco da riempire non esisterebbe più e il
  // riquadro dell'avanzamento sparirebbe. I due `toISOString` qui sopra invece
  // restano: quelli entrano ed escono in UTC (`T00:00:00Z` + `setUTCDate`) e
  // sono coerenti.
  const al = isoLocale(oggi instanceof Date ? oggi : new Date(oggi));
  if (dal > al) return null;                      // il rilievo è di oggi: niente buco da riempire
  const dich = produzioneDichiarata(rapportini, dal, al, densita);
  if (dich === null) return null;
  const giorni = Math.round((new Date(al + "T00:00:00Z") - new Date(dal + "T00:00:00Z")) / 86400000) + 1;
  return { dal, al, giorni, dallUltimoRilievo: mis.ultimo, dich };
}

// Libreria di DENSITÀ di riferimento (peso di volume "in banco", t/m³) per
// litotipo: aiuta chi non è tecnico a impostare la densità nel calcolo del
// valore (m³ → tonnellate → euro) invece di indovinarla. Valori TIPICI da
// fonti secondarie concordanti (vedi vault/RICERCA_DENSITA_MATERIALI.md): NON
// sono una misura del materiale specifico, quindi ognuno porta l'avviso
// `daVerificare` (via presetDensita). La densità reale dipende da porosità,
// fratturazione e umidità: va confermata col laboratorio prima di usarla per
// numeri contrattuali. Serve la densità IN SITU (il rilievo misura il vuoto di
// scavo), non quella del materiale sciolto in mucchio.
export const DENSITA_PRESET = [
  { chiave: "calcare-compatto", etichetta: "Calcare compatto",              densita: 2.6, fonte: "Geostru / Testo Unico Sicurezza (2,5–2,7)" },
  { chiave: "calcare-tenero",   etichetta: "Calcare tenero",                densita: 2.2, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "dolomia",          etichetta: "Dolomia",                       densita: 2.8, fonte: "Geostru" },
  { chiave: "basalto",          etichetta: "Basalto",                       densita: 2.9, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "granito",          etichetta: "Granito",                       densita: 2.7, fonte: "Geostru / Testo Unico Sicurezza" },
  { chiave: "arenaria",         etichetta: "Arenaria",                      densita: 2.3, fonte: "Geostru (2,2–2,6)" },
  { chiave: "marmo",            etichetta: "Marmo",                         densita: 2.7, fonte: "Geostru" },
  { chiave: "gesso",            etichetta: "Gesso",                         densita: 2.3, fonte: "Geostru" },
  { chiave: "argilla",          etichetta: "Argilla compatta",              densita: 2.1, fonte: "Testo Unico Sicurezza" },
  { chiave: "sabbia-ghiaia",    etichetta: "Sabbia e ghiaia (deposito)",    densita: 1.9, fonte: "riferimento deposito naturale in banco" },
];

// Ritorna il preset di densità con quella chiave (o null). daVerificare è
// SEMPRE true: nessun valore tipico va usato senza conferma di laboratorio.
export function presetDensita(chiave) {
  const p = DENSITA_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}

// LA DENSITÀ DAL MATERIALE SCRITTO NELL'AUTORIZZAZIONE. Il materiale della cava
// è già nell'atto («Sabbia e ghiaia»), quindi chiedere la densità una seconda
// volta significa avere due risposte possibili per la stessa cava. Si cerca il
// preset il cui nome compare nel materiale dell'atto, o viceversa — «Sabbia e
// ghiaia» ↔ «Sabbia e ghiaia (deposito)». null se non si riconosce: meglio
// nessuna densità che una sbagliata, perché su questo confronto la densità
// sposta i metri cubi quanto il confronto dovrebbe misurare.
export function densitaDelMateriale(materiale) {
  const nome = String(materiale || "").trim().toLowerCase();
  if (!nome) return null;
  const p = DENSITA_PRESET.find((x) => {
    const e = x.etichetta.toLowerCase().replace(/\s*\([^)]*\)\s*/g, " ").trim();
    return e === nome || nome.includes(e) || e.includes(nome);
  });
  return p ? { ...p, daVerificare: true } : null;
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P3 · CAMPO ↔ SCUDO — «chi è in turno è in regola?»
// ══════════════════════════════════════════════════════════════════════
//
// La domanda è la più importante che l'ecosistema sappia porre, e nessuna app
// da sola può rispondere: Campo sa CHI sta lavorando adesso, Scudo sa chi ha la
// visita medica valida e la formazione in corso. Finché i due mondi non si
// toccano, un caposquadra manda al fronte una persona con l'idoneità scaduta
// senza modo di saperlo.
//
// ⛔ NON SI ACCOPPIA PER NOME. MAI. È la decisione più importante di questo
// ponte, e non è prudenza teorica: nei dati di esempio Campo ha un «Marco
// Rossi» e Scudo un «Mario Rossi», Campo ha «Anna Conti» e Scudo ha «Anna Neri»
// e «Sara Conti». Un accoppiamento per nome — anche «intelligente» — avrebbe
// dichiarato in regola una persona guardando i documenti di un'altra. Su una
// visita medica un falso positivo è peggio di nessuna risposta: chi non sa,
// controlla; chi crede di sapere, no. Quindi il collegamento è un ID esplicito
// (`lavoratoreId` sull'operatore di Campo) e senza ID la risposta è «non lo so»,
// detta chiaramente.
//
// E NON È UN GIUDIZIO SULLA PERSONA. Vale la stessa lezione del ponte con
// Terra: se lo strumento sembra un cartellino di demerito, chi lo usa smette di
// scriverci dentro i dati veri. Qui si dice che un DOCUMENTO è scaduto — un
// fatto amministrativo che si risolve prenotando una visita — non che qualcuno
// «non è a posto».

export const ESITI_TURNO = [
  "scaduta",             // almeno un documento scaduto: va risolto prima del turno
  "in-scadenza",         // scade entro 30 giorni: si prenota adesso, senza fermare nessuno
  "senza data",          // almeno un documento con una data che non si può leggere
  "regolare",            // tutto in corso di validità
  "senza-scadenze",      // collegato, ma in Scudo non risulta nessun documento
  "non-collegato",       // manca `lavoratoreId`: non lo sappiamo, e si dice
  "collegamento-rotto",  // c'è un id, ma in Scudo non esiste più
];

// Le soglie sono quelle di Scudo, non nuove: 0 giorni = scaduta, entro 30 =
// in scadenza. Stanno qui perché ora servono a DUE app, e Scudo le ri-esporta
// col nome con cui le ha sempre chiamate.
// ⛔ UNA DATA CHE NON SI PUÒ LEGGERE NON È UNA SCADENZA A POSTO (corretto il
// 03/08). Prima qui c'era `if (Number.isNaN(t)) return "regolare"`, e non era
// una trappola dormiente: `parseScadenzeCsv` di Scudo filtrava le righe con
// `/^\d{4}-\d{2}-\d{2}$/`, che controlla la FORMA e non l'esistenza — quindi
// «2026-13-45» entrava in archivio e restava VERDE per sempre. Una visita
// medica con un errore di battitura non compariva fra le urgenti, non entrava
// nel muro delle scadenze e non generava promemoria.
// Si risponde «senza data», che è il termine che l'ecosistema usa già in tre
// app (Flotta, Scudo, Terra) — non uno nuovo. Chi confronta con `!== "regolare"`
// (quasi tutti i trenta punti di chiamata di Scudo) comincia da solo a
// mostrarla fra quelle da guardare, ed è il verso giusto.
// Racconto e misure: docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
export function statoScadenzaHSE(dataISO, oggi = new Date()) {
  // `dataISOEsiste` e non `Date.parse`: «2026-02-30» non è NaN, JavaScript lo
  // fa scivolare al 2 marzo — una scadenza spostata di due giorni in silenzio.
  if (!dataISOEsiste(dataISO)) return "senza data";
  const t = Date.parse(String(dataISO).slice(0, 10) + "T00:00:00");
  const g = Math.floor((t - new Date(oggi).setHours(0, 0, 0, 0)) / 86400000);
  if (g < 0) return "scaduta";
  if (g <= 30) return "in-scadenza";
  return "regolare";
}

// Lo stato di UN operatore di Campo rispetto ai documenti che Scudo tiene per
// lui. Torna sempre un oggetto: non esistono risposte mancanti, esistono
// risposte che dicono «non lo so» e perché.
export function idoneitaOperatore(operatore, lavoratori, scadenze, oggi = new Date()) {
  const vuoto = { stato: "non-collegato", lavoratore: null, scadute: [], inScadenza: [], senzaData: [], documenti: 0 };
  const rif = operatore && operatore.lavoratoreId != null ? String(operatore.lavoratoreId).trim() : "";
  if (!rif) return vuoto;
  const l = (lavoratori || []).find((x) => x && String(x.id) === rif) || null;
  if (!l) return { ...vuoto, stato: "collegamento-rotto" };
  const sue = (scadenze || []).filter((s) => s && String(s.lavoratoreId) === rif);
  if (!sue.length) return { stato: "senza-scadenze", lavoratore: l, scadute: [], inScadenza: [], senzaData: [], documenti: 0 };
  // ⛔ `senzaData` esiste perché il difetto corretto in `statoScadenzaHSE` si
  // ripresentava qui un piano più su: un documento con la data illeggibile non
  // era né scaduto né in scadenza, quindi cadeva nel `else` e l'operatore
  // risultava «regolare». Contarlo fra i regolari vuol dire mandare a lavorare
  // qualcuno di cui non sappiamo se il documento è valido.
  const scadute = [], inScadenza = [], senzaData = [];
  for (const s of sue) {
    const st = statoScadenzaHSE(s.dataScadenza, oggi);
    if (st === "scaduta") scadute.push(s);
    else if (st === "in-scadenza") inScadenza.push(s);
    else if (st === "senza data") senzaData.push(s);
  }
  return {
    stato: scadute.length ? "scaduta" : inScadenza.length ? "in-scadenza"
      : senzaData.length ? "senza data" : "regolare",
    lavoratore: l, scadute, inScadenza, senzaData, documenti: sue.length,
  };
}

// Il quadro di un TURNO: gli operatori che stanno lavorando, ognuno col suo
// stato, più il conto che serve a scrivere una frase sola invece di far contare
// le righe a chi guarda.
// `nonCollegati` è tenuto separato dai regolari di proposito: sommarlo ai
// «tutto a posto» trasformerebbe un «non lo so» in un «sì», che è il modo più
// facile per rendere inutile un controllo di sicurezza.
export function idoneitaDiTurno(operatori, lavoratori, scadenze, oggi = new Date()) {
  const righe = (operatori || []).map((o) => ({
    operatore: o, ...idoneitaOperatore(o, lavoratori, scadenze, oggi),
  }));
  const conta = (s) => righe.filter((r) => r.stato === s).length;
  return {
    righe,
    scadute: conta("scaduta"),
    inScadenza: conta("in-scadenza"),
    regolari: conta("regolare"),
    senzaScadenze: conta("senza-scadenze"),
    // due modi diversi di non sapere, tenuti distinti perché portano a due azioni
    // diverse: «non collegato» è un lavoro non ancora fatto, «collegamento rotto»
    // è un dato da riparare — qualcuno ha tolto quella scheda da Scudo. Il
    // riepilogo che li chiamava entrambi «non collegate» diceva una cosa falsa
    // della seconda, che collegata lo è eccome.
    senzaCollegamento: conta("non-collegato"),
    collegamentiRotti: conta("collegamento-rotto"),
    nonCollegati: conta("non-collegato") + conta("collegamento-rotto"),
    // «sappiamo tutto e va tutto bene» è vero solo se non c'è nessun «non lo so»
    tuttoInRegola: righe.length > 0
      && righe.every((r) => r.stato === "regolare" || r.stato === "senza-scadenze"),
  };
}

// ── L'ALTRA METÀ DEL PONTE P3: dal lato di SCUDO ──────────────────────
//
// Chi tiene lo scadenzario vede cinquanta scadenze e non sa quali riguardano
// persone che stanno lavorando ADESSO. Non è una sfumatura: la visita medica
// scaduta di chi è al fronte oggi e quella di chi è in ferie da un mese hanno la
// stessa data e due urgenze diverse.
//
// COSA VUOL DIRE «STA LAVORANDO ADESSO», deciso e scritto. I dati di Campo
// permettono due risposte, e sono domande diverse:
//   · l'operatore è IN FORZA in una squadra OPERATIVA → è schierato oggi;
//   · l'operatore è nominato su un'attività di oggi → è impegnato su un lavoro.
// Si sceglie la PRIMA, e la ragione è che la seconda ha un buco: in Campo
// l'attività può non avere nessun nome sopra (nei dati d'esempio due su cinque
// non ce l'hanno), quindi «nessuna attività a suo nome» non vuol dire «non sta
// lavorando». Una definizione che scambia un dato mancante per un fatto
// produrrebbe esattamente il falso negativo che questo ponte esiste per evitare.
// La squadra invece c'è sempre, e il suo stato lo decide chi comanda il turno.
//
// E NON È UNA CLASSIFICA. L'ordine serve a sapere da dove cominciare, non a dire
// chi è più in ritardo: si ordina per urgenza del DOCUMENTO, e a parità vince chi
// è in turno — non il contrario.

export function inTurnoOggi(operatori, squadre) {
  const operative = new Set(
    (squadre || [])
      .filter((q) => q && String(q.stato || "").toLowerCase() !== "ferma")
      .map((q) => nomeBase(q.nome)),
  );
  return (operatori || []).filter(
    (o) => o && o.stato !== "non-disponibile" && operative.has(nomeBase(o.squadra)),
  );
}

// «Squadra A — Perforazione» e «Squadra A» sono la stessa squadra: in Campo il
// nome della squadra porta anche la specialità dopo un trattino, mentre
// l'operatore ne conserva solo la parte iniziale. Senza questo, nessun operatore
// risulterebbe mai in una squadra operativa — e il ponte direbbe che non lavora
// nessuno, che è il modo peggiore di sbagliare: silenzioso e rassicurante.
function nomeBase(nome) {
  return String(nome || "").split(/\s+[—–-]\s+/)[0].trim().toLowerCase();
}

// Le scadenze di Scudo con accanto la risposta alla domanda «questa persona sta
// lavorando adesso?». Torna l'elenco ordinato per urgenza.
export function scadenzeDiChiLavora(scadenze, lavoratori, operatori, squadre, oggi = new Date()) {
  const schierati = inTurnoOggi(operatori, squadre);
  const idInTurno = new Set(
    schierati.map((o) => (o.lavoratoreId != null ? String(o.lavoratoreId).trim() : "")).filter(Boolean),
  );
  const perId = new Map((lavoratori || []).map((l) => [String(l.id), l]));
  // «senza data» sta PRIMA di «regolare»: una riga che non si può leggere va
  // guardata, non lasciata in fondo insieme a quelle a posto.
  const peso = { scaduta: 0, "in-scadenza": 1, "senza data": 2, regolare: 3 };
  const righe = (scadenze || [])
    .filter((s) => s && s.lavoratoreId != null)
    .map((s) => {
      const rif = String(s.lavoratoreId).trim();
      return {
        scadenza: s,
        lavoratore: perId.get(rif) || null,
        stato: statoScadenzaHSE(s.dataScadenza, oggi),
        inTurno: idInTurno.has(rif),
      };
    })
    .sort((a, b) =>
      peso[a.stato] - peso[b.stato]
      || (b.inTurno ? 1 : 0) - (a.inTurno ? 1 : 0)
      || String(a.scadenza.dataScadenza).localeCompare(String(b.scadenza.dataScadenza)));
  return {
    righe,
    // il conto che serve a scrivere una frase invece di far contare le righe
    daFermare: righe.filter((r) => r.inTurno && r.stato === "scaduta").length,
    inTurnoDaPrenotare: righe.filter((r) => r.inTurno && r.stato === "in-scadenza").length,
    schierati: schierati.length,
    // quante persone schierate NON si riesce a collegare: senza questo il conto
    // «nessuno da fermare» varrebbe anche quando non si è guardato niente
    schieratiNonCollegati: schierati.filter((o) => !o.lavoratoreId).length,
  };
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P2 — CAMPO → TERRA: LA PRODUZIONE DEL TURNO, FRONTE PER FRONTE
// ══════════════════════════════════════════════════════════════════════
// Terra sa quanto è stato cavato in tutto fra un rilievo e l'altro, ma non
// **da dove**: l'avanzamento di ogni fronte resta fermo all'ultimo volo del
// drone. Chi guarda il piano di coltivazione vuole sapere se il Nord sta
// correndo e il Sud è fermo, non solo il totale.
//
// ⛔ NON SI ACCOPPIA PER NOME. MAI. La squadra ha un campo `area` che dice
// «fronte Est», e sarebbe comodo confrontarlo col nome del fronte in Terra:
// è la stessa scorciatoia che qui ha già fatto danni. Basta che qualcuno
// rinomini un fronte, o scriva «Est» invece di «fronte Est», e la produzione
// finisce sul fronte sbagliato senza che nessuno se ne accorga — un errore
// muto su un numero che va nella denuncia annuale. Si accoppia per
// `fronteId`, e chi non ce l'ha finisce dichiaratamente in «non attribuita».
//
// Quello che NON fa, e non deve fare: non ripartisce «a intuito» la
// produzione senza fronte. Una stima inventata, messa accanto a una misura,
// diventa indistinguibile da essa nel giro di una settimana.
export function produzionePerFronte(rapportini, fronti, dal, al, densita) {
  if (!Array.isArray(rapportini)) return null;
  const elenco = Array.isArray(fronti) ? fronti : [];
  const nomeDi = new Map(elenco.map((f) => [String(f && f.id), (f && f.nome) || "(senza nome)"]));
  const d1 = String(dal || ""), d2 = String(al || "");
  const dens = +densita;
  const densOk = Number.isFinite(dens) && dens > 0;

  const per = new Map();                 // fronteId → accumulo
  const vuoto = () => ({ m3Diretti: 0, t: 0, viaggi: 0, turni: 0 });
  let senzaFronte = vuoto();
  let fronteSconosciuto = vuoto();       // ha un id, ma quel fronte non esiste
  let scartati = 0;

  for (const r of rapportini) {
    const d = String((r || {}).data || "");
    if (!dataISOBuona(d)) { scartati++; continue; }
    if (d1 && d < d1) continue;
    if (d2 && d > d2) continue;
    const p = produzioneRapportino(r);
    if (!p) { scartati++; continue; }
    const idF = (r || {}).fronteId ? String(r.fronteId) : "";
    let dove;
    if (!idF) dove = senzaFronte;
    else if (!nomeDi.has(idF)) dove = fronteSconosciuto;
    else {
      if (!per.has(idF)) per.set(idF, vuoto());
      dove = per.get(idF);
    }
    dove.turni++;
    if (p.unita === "m³") dove.m3Diretti = r3(dove.m3Diretti + p.qta);
    else if (p.unita === "t") dove.t = r2(dove.t + p.qta);
    else dove.viaggi += p.qta;
  }

  const chiudi = (a) => {
    const m3DaTonnellate = densOk ? r3(a.t / dens) : 0;
    return { ...a, m3DaTonnellate, m3: r3(a.m3Diretti + m3DaTonnellate),
             tSenzaDensita: densOk ? 0 : a.t };
  };
  const righe = [...per.entries()]
    .map(([id, a]) => ({ fronteId: id, nome: nomeDi.get(id), ...chiudi(a) }))
    .sort((x, y) => y.m3 - x.m3 || String(x.nome).localeCompare(String(y.nome), "it"));

  const senza = chiudi(senzaFronte);
  const ignoto = chiudi(fronteSconosciuto);
  const m3Attribuito = r3(righe.reduce((s, x) => s + x.m3, 0));
  const m3Totale = r3(m3Attribuito + senza.m3 + ignoto.m3);

  // la quota si calcola sull'ATTRIBUITO, non sul totale: dire «il Nord è il
  // 40%» quando il 50% non si sa da dove viene è un modo elegante di mentire
  const conQuota = righe.map((x) => ({ ...x,
    quotaPct: m3Attribuito > 0 ? Math.round(1000 * x.m3 / m3Attribuito) / 10 : null }));

  return {
    righe: conQuota,
    senzaFronte: senza,
    fronteSconosciuto: ignoto,
    m3Attribuito, m3Totale,
    // quanto del totale si sa da dove viene: sotto una certa soglia la
    // ripartizione non va mostrata come se fosse una risposta
    copertura: m3Totale > 0 ? Math.round(1000 * m3Attribuito / m3Totale) / 10 : null,
    densita: densOk ? dens : null,
    // se resta qualcosa fuori dai m³ (tonnellate senza densità, o viaggi), il
    // confronto è per difetto e chi legge deve saperlo
    parziale: (!densOk && (senza.t > 0 || ignoto.t > 0 || righe.some((x) => x.t > 0)))
              || senza.viaggi > 0 || ignoto.viaggi > 0 || righe.some((x) => x.viaggi > 0),
    scartati,
  };
}

// ============================================================
// LE VOCI DI COSTO DELLA CAVA — la classificazione, in un posto solo
// ------------------------------------------------------------
// ⛔ STA IN `shared/` PERCHÉ SERVE A DUE APP, e la regola è vincolante: una
// classificazione scritta due volte diverge alla prima aggiunta, e allora i
// costi di Flotta e quelli di Conti smettono di sommarsi — senza che nessun
// controllo se ne accorga, perché ognuna delle due è coerente con sé stessa.
//
// Il censimento diceva «registro costi: da fare, si parte da zero». **Non è
// vero**, ed è stato misurato il 03/08: un registro costi **esiste già in
// Flotta** (`costi/{voce, importo, nota, data}`, con `ripartizioneCosti` e
// `costiPerMese`). Quello che manca non è il registro: è che copre solo il
// MEZZO. Personale, energia, esplosivo, canone e ripristino non hanno posto, e
// sono le voci senza le quali «quanto costa un metro cubo» non si può scrivere.
//
// `daMezzo` dice quali voci Flotta già registra: servono a non contarle DUE
// VOLTE quando Conti sommerà le proprie. Chi somma tutto deve sapere che il
// gasolio è già dentro il registro dei mezzi.
export const VOCI_COSTO = [
  { chiave: "carburante", etichetta: "Carburante", gruppo: "mezzi", daMezzo: true },
  { chiave: "manutenzione", etichetta: "Manutenzione e ricambi", gruppo: "mezzi", daMezzo: true },
  { chiave: "noleggio", etichetta: "Noleggi e leasing", gruppo: "mezzi", daMezzo: true },
  { chiave: "personale", etichetta: "Personale", gruppo: "produzione", daMezzo: false },
  { chiave: "esplosivo", etichetta: "Esplosivo e accessori", gruppo: "produzione", daMezzo: false },
  { chiave: "energia", etichetta: "Energia elettrica", gruppo: "impianto", daMezzo: false },
  { chiave: "lavorazione", etichetta: "Frantumazione e vagliatura", gruppo: "impianto", daMezzo: false },
  { chiave: "canone", etichetta: "Canone di escavazione", gruppo: "concessione", daMezzo: false },
  { chiave: "ripristino", etichetta: "Ripristino ambientale", gruppo: "concessione", daMezzo: false },
  { chiave: "generali", etichetta: "Spese generali", gruppo: "generali", daMezzo: false },
];

export function voceCosto(chiave) {
  return VOCI_COSTO.find((v) => v.chiave === String(chiave || "")) || null;
}

// ⛔ UNA VOCE CHE NON È NELL'ELENCO NON DIVENTA «generali». Sarebbe la solita
// assenza travestita: il costo entrerebbe nei totali sotto un'etichetta che
// nessuno ha scelto, e sparirebbe dalla ripartizione per gruppo che serve a
// capire DOVE si spende. Si dichiara non classificata, e chi somma decide.
export function gruppoDiVoce(chiave) {
  const v = voceCosto(chiave);
  return v ? v.gruppo : "non-classificata";
}

// ══════════════════════════════════════════════════════════════════════
// LA RISPOSTA A UN FATTO — la stessa regola per due app
// ══════════════════════════════════════════════════════════════════════
// «Questo fatto ha avuto una risposta?» se la chiedono Sentinella (un
// superamento di soglia, un reclamo) e Campo (un fermo di produzione), e la
// risposta è la stessa perché le azioni sono le stesse: quelle di Scudo.
//
// ⛔ Erano scritte DUE VOLTE, e misurate byte per byte erano identiche a meno
// del nome (806 e 809 caratteri, `statoPonte` contro `statoRisposta`). È
// esattamente la forma di debito che il CLAUDE.md descrive: due copie uguali
// oggi divergono domani senza che nessuno lo veda — il giorno in cui una
// impara a distinguere «in ritardo» da «da chiudere», l'altra continua a dire
// la vecchia cosa, e nessuna prova se ne accorge perché ognuna prova la sua.
// Il cantiere che ha scritto la seconda l'ha DICHIARATA in un commento invece
// di nasconderla; qui la si chiude.
//
// Le due app la ri-esportano col nome con cui l'hanno sempre chiamata — un
// alias non è una seconda implementazione — e la prova pretende
// l'IDENTITÀ (`campo.statoRisposta === ponti.statoPonte`), non che si
// comportino allo stesso modo: due funzioni che oggi si comportano uguale
// sono due funzioni, e domani sono due comportamenti.

// Le azioni nate da una certa origine. `voce` è facoltativa: senza, tornano
// tutte le azioni di quell'origine; con, solo quelle di quella precisa voce.
// Serve a Sentinella, dove lo stesso punto di misura supera la soglia in più
// giorni e ogni superamento è una voce sua.
export function azioniDiOrigine(azioni, tipo, id, voce) {
  if (!id) return [];
  return (azioni || []).filter((a) => a && a.origineTipo === tipo && a.origineId === id
    && (voce == null || voce === "" || a.origineVoce === voce));
}

// Il semaforo di un gruppo di azioni: nessuna / da chiudere / tutte chiuse.
// ⛔ «Nessuna azione» è ROSSA, ed è il principio del fondatore nella sua forma
// più diretta: l'assenza di una risposta non è una risposta buona. La domanda
// dell'ispettore è «e poi?», e una lista vuota è quello che non si vuole
// dovergli rispondere.
export function statoPonte(azioni) {
  const l = azioni || [];
  const chiuse = l.filter((a) => (a || {}).stato === "chiusa").length;
  const inCorso = l.filter((a) => (a || {}).stato === "in-corso").length;
  if (!l.length) return { n: 0, chiuse: 0, inCorso: 0, daChiudere: 0, cls: "danger", label: "Nessuna azione" };
  if (chiuse === l.length) {
    return { n: l.length, chiuse, inCorso: 0, daChiudere: 0, cls: "ok",
      label: l.length === 1 ? "Azione chiusa" : l.length + " azioni chiuse" };
  }
  const daChiudere = l.length - chiuse;
  return { n: l.length, chiuse, inCorso, daChiudere, cls: "warn",
    label: inCorso && daChiudere === inCorso
      ? (inCorso === 1 ? "Azione in corso" : inCorso + " azioni in corso")
      : daChiudere + (daChiudere === 1 ? " azione da chiudere" : " azioni da chiudere") };
}
