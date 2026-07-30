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
  const al = (oggi instanceof Date ? oggi : new Date(oggi)).toISOString().slice(0, 10);
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
  "regolare",            // tutto in corso di validità
  "senza-scadenze",      // collegato, ma in Scudo non risulta nessun documento
  "non-collegato",       // manca `lavoratoreId`: non lo sappiamo, e si dice
  "collegamento-rotto",  // c'è un id, ma in Scudo non esiste più
];

// Le soglie sono quelle di Scudo, non nuove: 0 giorni = scaduta, entro 30 =
// in scadenza. Stanno qui perché ora servono a DUE app, e Scudo le ri-esporta
// col nome con cui le ha sempre chiamate.
export function statoScadenzaHSE(dataISO, oggi = new Date()) {
  const t = Date.parse(String(dataISO || "") + "T00:00:00");
  if (Number.isNaN(t)) return "regolare";
  const g = Math.floor((t - new Date(oggi).setHours(0, 0, 0, 0)) / 86400000);
  if (g < 0) return "scaduta";
  if (g <= 30) return "in-scadenza";
  return "regolare";
}

// Lo stato di UN operatore di Campo rispetto ai documenti che Scudo tiene per
// lui. Torna sempre un oggetto: non esistono risposte mancanti, esistono
// risposte che dicono «non lo so» e perché.
export function idoneitaOperatore(operatore, lavoratori, scadenze, oggi = new Date()) {
  const vuoto = { stato: "non-collegato", lavoratore: null, scadute: [], inScadenza: [], documenti: 0 };
  const rif = operatore && operatore.lavoratoreId != null ? String(operatore.lavoratoreId).trim() : "";
  if (!rif) return vuoto;
  const l = (lavoratori || []).find((x) => x && String(x.id) === rif) || null;
  if (!l) return { ...vuoto, stato: "collegamento-rotto" };
  const sue = (scadenze || []).filter((s) => s && String(s.lavoratoreId) === rif);
  if (!sue.length) return { stato: "senza-scadenze", lavoratore: l, scadute: [], inScadenza: [], documenti: 0 };
  const scadute = [], inScadenza = [];
  for (const s of sue) {
    const st = statoScadenzaHSE(s.dataScadenza, oggi);
    if (st === "scaduta") scadute.push(s);
    else if (st === "in-scadenza") inScadenza.push(s);
  }
  return {
    stato: scadute.length ? "scaduta" : inScadenza.length ? "in-scadenza" : "regolare",
    lavoratore: l, scadute, inScadenza, documenti: sue.length,
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
    nonCollegati: conta("non-collegato") + conta("collegamento-rotto"),
    // «sappiamo tutto e va tutto bene» è vero solo se non c'è nessun «non lo so»
    tuttoInRegola: righe.length > 0
      && righe.every((r) => r.stato === "regolare" || r.stato === "senza-scadenze"),
  };
}
