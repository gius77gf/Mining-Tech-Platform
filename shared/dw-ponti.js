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
import { isoLocale, dataISOEsiste, giorniTra } from "./deepwork-id-client/dw-shell.js";

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
    /* c'è qualcosa che NON è entrato nel totale in m³? Allora il confronto è
       per difetto, e chi legge deve saperlo prima di trarne conclusioni.
       ⛔ E UN TURNO CHE NON HA DICHIARATO NIENTE MANCAVA DA QUESTO ELENCO, che
       è il caso più frequente dei tre. Misurato il 14/08 sulla cava sintetica e
       riprodotto su un caso minimo: quattro turni da 225 m³ contro un rilievo
       da 1.000 m³ danno `coerente` al 10%; se **due dei quattro lasciano la
       quantità in bianco** il verdetto diventa `implausibile` al 55% — cioè la
       pagina scrive **«C'è un errore da cercare»** in rosso, e manda a cercarlo
       nei rilievi o nelle stime dei turni, dove c'è solo un campo lasciato
       vuoto. E `parziale` restava **false**, mentre il commento qui sopra
       prometteva l'opposto.
       ⚠️ Il conto c'era già (`senzaProduzione`) e non lo leggeva **nessuno**:
       `grep -rn senzaProduzione --include=*.html` dava **0**. Guardia
       scollegata, la famiglia della regola 20 di `run-stile`.
       ⚠️ Non si sa se quei turni abbiano prodotto: è precisamente ciò che
       nessuno ha misurato. Ed è per questo che il confronto è per difetto e non
       si può concludere — l'assenza di un dato non è un dato favorevole. */
    parziale: (!densOk && t > 0) || viaggi > 0 || senzaProduzione > 0,
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
//   no-misura      · nel periodo non c'è NESSUN rilievo elaborato: non si sa
//   misura-zero    · un rilievo elaborato C'È, e ha misurato ZERO: il fronte
//                    non si è mosso. È il contrario di «non si sa», e quando i
//                    turni dichiarano qualcosa è l'allarme più forte di tutti
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
  /* ⛔ UNO ZERO MISURATO NON È UNA MISURA MANCANTE, ed è il principio del
     fondatore nel verso che nessuno guarda: qui non c'era un dato assente
     spacciato per favorevole, c'era un dato PRESENTE spacciato per assente.
     Fino al 09/08 questa riga diceva `!(mis.m3 > 0)` e mandava nello stesso
     stato due cose opposte: «nel periodo non ha volato nessuno» e «si è volato,
     e dal fronte non manca niente». Il dato per distinguerle era già lì
     accanto — `mis.rilievi` — e la pagina di Terra scriveva, sullo zero
     misurato, «non risulta nessun rilievo elaborato di scavo»: una frase
     FALSA, e falsa proprio quando i turni dichiarano una produzione, cioè
     quando lo schermo dovrebbe gridare che il fronte non si è mosso.
     ⚠️ Lo stato è nuovo, quindi lo devono coprire tutti i suoi lettori
     (regola 18): Terra lo racconta, Campo lo tratta come prima. */
  if (mis === null || !(mis.rilievi > 0)) return { ...base, stato: "no-misura" };
  if (!(mis.m3 > 0)) return { ...base, stato: "misura-zero" };
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
    /* ⛔ QUI C'ERA `+((r||{}).volumeM3)` CON `Number.isFinite(v)`, ED È LA
       TRAPPOLA PER CUI ESISTE `numeroDichiarato` — scritta nel ponte che quella
       funzione la ospita, novecento righe più in giù. `+null` fa **0** e `+""`
       fa **0**, e `Number.isFinite(0)` risponde **true**: quindi un rilievo
       *elaborato* senza volume **contava come rilievo**.
       Misurato il 14/08 su tre rilievi (due sani più uno al 01/07):
         volumeM3 assente  → {m3:3000, rilievi:2, ultimo:"2026-03-20"}   ✓
         volumeM3 null     → {m3:3000, rilievi:3, ultimo:"2026-07-01"}   ⛔
         volumeM3 ""       → identico al null                            ⛔
         volumeM3 "abc"    → {m3:3000, rilievi:2, ultimo:"2026-03-20"}   ✓
       Cioè **due assenze, due comportamenti**: `abc` veniva scartato e `null`
       no. E il danno non è il conto: è `ultimo`, **la data dell'ultima misura**,
       spostata avanti da un rilievo che non ha misurato niente. Da qui passano
       il grafico turni-contro-misurato di Terra e la base del canone di Conti,
       cioè un numero che finisce in un conto verso un ente.
       ⚠️ Uno zero **scritto** resta un dato e continua a contare: la differenza
       fra «non ho tolto niente» e «nessuno ha misurato» è tutto il punto. */
    const v = numeroDichiarato((r || {}).volumeM3);
    const d = String((r || {}).data || "");
    if ((r || {}).stato === "pianificato") pianificati++;
    if ((r || {}).stato !== "elaborato" || v == null || !dataISOBuona(d)) continue;
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
    /* ⛔ LA SORELLA DI `misuratoPeriodo`, E AVEVA UN ALTRO CONTRATTO. Qui la
       guardia era `volumeM3 != null && Number.isFinite(+volumeM3)`: il `!= null`
       prende `null` e `undefined`, ma **non la stringa vuota** — e `+""` fa
       **0**, che `Number.isFinite` accetta. Misurato il 14/08, sullo stesso
       vettore di rilievi:
         volumeM3 ""  → intervalliFraRilievi **2**, misuratoPeriodo **2**
         volumeM3 null → intervalliFraRilievi 1,  misuratoPeriodo 2
       cioè un rilievo che non ha misurato niente **apriva un intervallo**, e
       proprio in una funzione il cui commento qui sopra dice che esiste per
       togliere la possibilità di chiedere «un periodo che non corrisponde a
       nessuna misura». Si smentiva da sola sulle due forme più comuni
       dell'assenza.
       ⚠️ È la regola di CLAUDE.md: **due sorelle con due contratti**. Corretta
       una, la seconda non produce un errore — produce una divergenza
       silenziosa. Adesso decidono con la stessa funzione. */
    .filter(r => r && r.stato === "elaborato" && numeroDichiarato(r.volumeM3) != null
      && dataISOBuona(r.data) && provenienzaDi(r) === "scavo")
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
// DA DOVE VIENE LA DENSITÀ DI QUESTA CAVA
// ══════════════════════════════════════════════════════════════════════
//
// ⛔ PERCHÉ STA QUI E NON IN TERRA, e non è una questione d'ordine. Fino
// all'01/08 questo blocco viveva in `apps/terra/terra-data.js`, e la
// conseguenza è stata MISURATA: Terra risolveva la densità dall'atto →
// laboratorio → preset, mentre `apps/campo/index.html` chiamava
// `densitaDelMateriale(vig.materiale)`, cioè **solo il preset**. Con la stessa
// autorizzazione — densità di laboratorio 1,95 t/m³ scritta nell'atto — Terra
// riconciliava a **1,95** e Campo a **1,90**: due schermate, due scostamenti,
// la stessa cava, lo stesso mese, e nessuna delle due sbagliata da sola.
// Le due app costruiscono la STESSA `riconciliazioneTurni` (qui sopra), quindi
// il fattore che la moltiplica deve essere uno: è la regola vincolante — ciò
// che serve a due app vive qui e l'app lo RI-ESPORTA, un alias non è una
// seconda implementazione.
//
// ⛔ COSA SI È SPOSTATO E COSA NO. Qui sta il minimo che rende la regola una
// sola: il vocabolario chiuso, `densitaDichiarata` (che costruisce il record
// che `densitaDellaCava` restituisce: separarli vorrebbe dire chiamare il
// modulo di un'altra app) e `densitaDellaCava`. `densitaPerEnte` e
// `descriviDensita` sono rimaste in Terra: rispondono a domande che solo Terra
// pone — «questo numero regge davanti a un ispettore?» e «che riga scrivo sotto
// il campo?» — e Campo non le chiama. `shared/` non è un cassetto dove si mette
// per ordine: spostare per ordine è il modo in cui lo diventa.
//
// La densità è la sola cosa che fa parlare due grandezze che in cava si
// misurano separatamente: i turni dichiarano TONNELLATE, il drone misura METRI
// CUBI. Da lei passano due numeri che escono dall'azienda — il confronto fra
// dichiarato e misurato, e il valore del materiale — e finché è solo un numero
// in un campo, un valore tipico preso da un manuale e un certificato di
// laboratorio sul materiale di QUESTA cava si presentano identici.
//
// ⛔ NON HANNO LO STESSO PESO DAVANTI A CHI CHIEDE. Sono quattro cose diverse:
//   · `atto`        — il numero prescritto dall'atto o dal disciplinare. Non è
//                     una misura del materiale: è la regola con cui l'ente
//                     stesso vuole che si converta. Non si discute.
//   · `laboratorio` — una prova sul materiale di questa cava, con la sua data e
//                     il suo certificato. È la più forte tecnicamente: è
//                     l'unica delle quattro che MISURA questo materiale.
//   · `preset`      — il valore tipico del litotipo (`DENSITA_PRESET` qui
//                     sopra). Utile per non partire da zero, ma è letteratura:
//                     non è stato misurato niente qui.
//   · `manuale`     — l'ha scritta una persona. Sappiamo CHI, non DA DOVE.
//
// ⛔ E LA QUINTA NON È UN RIPIEGO SULLE ALTRE. Una densità di cui non risulta la
// provenienza NON è «preset» e NON è «a mano»: è NON DICHIARATA, e chi legge il
// numero deve saperlo. È la stessa forma di `origineDi` di Terra e di
// `provenienzaMisura` di Sentinella — l'assenza si dice, non si riempie.
//
// ⚠️ DOV'È LA DIFFERENZA CON LE ALTRE DUE PROVENIENZE DELL'ECOSISTEMA, che
// esistono già e non sono questa. `origineDi` di Terra descrive **come è stato
// calcolato** un volume: metodo, lato cella, quota di base. `provenienzaMisura`
// di Sentinella descrive **per che strada è entrato** un numero già misurato da
// uno strumento. Qui non si descrive né un calcolo né una strada: si dice **chi
// risponde** di un fattore di conversione che non è stato misurato in cava e
// che moltiplica tutto quello che ci passa dentro. Nessuna delle tre
// risponderebbe alla domanda delle altre, e per questo i nomi sono diversi:
// `nomi-doppi.mjs` non deve confonderle.
//
// ⚠️ È SEMPRE IL PESO DI VOLUME **IN BANCO**, non quello del materiale sciolto
// in mucchio né quello del prodotto finito a listino (che è la densità di
// Conti, un'altra cosa): il rilievo misura il vuoto lasciato dallo scavo.

/* Il vocabolario, chiuso. Cinque parole: aggiungerne una sesta vorrebbe dire
   aggiungere un soggetto che risponde del numero. */
export const DENS_ATTO = "atto";
export const DENS_LABORATORIO = "laboratorio";
export const DENS_PRESET = "preset";
export const DENS_MANO = "manuale";
export const DENS_NON_DICHIARATA = "non dichiarata";

/* Come si mostra ognuna. `cls` è la classe del semaforo, e la scelta è la
   stessa già presa in Sentinella: **«a mano» non è un allarme** — è una
   pratica legittima, e un badge giallo su ogni densità battuta a mano sarebbe
   un rimprovero continuo, che si impara a non guardare. Giallo lo prende solo
   ciò che non si sa. Il `preset` resta neutro ma la sua etichetta dice da sola
   che è provvisorio, perché lo è: `presetDensita` marca ogni valore tipico
   `daVerificare` da quando esiste.
   ⚠️ `breve` sta dentro una pillola accanto a un campo stretto: la forma
   lunga è `label`, ed è quella che va nelle frasi dove non c'è un'etichetta
   accanto a dire di che si parla. */
/* ⚠️ E `label` NON È «LA VERSIONE LUNGA»: è la voce di una TENDINA, e una
   tendina ha una larghezza. Le prime stesure dicevano «Prova di laboratorio
   sul materiale di questa cava» e «Valore prescritto dall'atto autorizzativo»:
   a 320 px Chromium le taglia a «Prova di laboratorio sul mate…», cioè proprio
   dove sta la differenza fra le due fonti forti. Non si vedeva leggendo il
   codice — l'ha trovato lo scatto. Quello che il taglio si portava via lo dice
   già `descriviDensita` di Terra, per esteso, nella riga sotto i campi. */
export const FONTI_DENSITA = {
  [DENS_ATTO]:            { cls: "ok",   breve: "dall'atto",      label: "Prescritta dall'atto" },
  [DENS_LABORATORIO]:     { cls: "ok",   breve: "laboratorio",    label: "Prova di laboratorio" },
  [DENS_PRESET]:          { cls: "",     breve: "valore tipico",  label: "Valore tipico del litotipo" },
  [DENS_MANO]:            { cls: "",     breve: "a mano",         label: "Inserita a mano" },
  [DENS_NON_DICHIARATA]:  { cls: "warn", breve: "non dichiarata", label: "Provenienza non dichiarata" },
};

/* LA DENSITÀ COM'È SCRITTA. Legge, non deduce: un `da` che non sta nel
   vocabolario ricade su «non dichiarata» invece di essere corretto a
   indovinare.
   Ritorna { densita, leggibile, grezza, da, noto, quando, riferimento,
   etichetta, fonte }. Le bandiere le consuma `descriviDensita`, dentro il
   modulo di Terra: la pagina non deve decidere come si racconta una densità
   senza provenienza, se no la regola starebbe scritta in due posti. */
export function densitaDichiarata(d) {
  const o = (d && typeof d === "object") ? d : {};
  /* ⛔ IDEMPOTENTE, e non è eleganza: la pagina si passa in giro il record già
     normalizzato. Il prototipo perdeva `grezza` al secondo giro, e un «0»
     scritto da qualcuno tornava indietro come «densità non impostata» — cioè
     l'errore dell'utente spariva proprio rileggendo il proprio dato. */
  const g = (o.densita == null && typeof o.grezza === "string" && o.grezza !== "") ? o.grezza : o.densita;
  const vuoto = (g == null || (typeof g === "string" && g.trim() === ""));
  const n = vuoto ? null : +g;
  /* `leggibile` risponde SOLO a «è un numero?»: «1,9» con la virgola italiana
     per JavaScript non lo è, e qui non lo si legge — sarebbe la seconda copia
     di `numeroDaCampo`, che è il difetto che questo repo ha già pagato. «0»
     invece È un numero, e non è una densità: sono due errori diversi e hanno
     due frasi diverse.
     ⛔ E `+null` fa ZERO con `Number.isFinite(0)` a true: il controllo del
     vuoto viene PRIMA, se no una densità assente tornerebbe «0 t/m³», cioè un
     numero al posto dell'ammissione. */
  const siLegge = vuoto || Number.isFinite(n);
  const densita = (siLegge && !vuoto && n > 0) ? n : null;
  const da = String(o.da || "").trim().toLowerCase();
  const siSa = Object.prototype.hasOwnProperty.call(FONTI_DENSITA, da) && da !== DENS_NON_DICHIARATA;
  /* ⚠️ `leggibile:` e `noto:` scritte per esteso, non in forma breve: la regola
     20 di `run-stile.mjs` riconosce una bandiera dai DUE PUNTI, e con
     `{ leggibile, noto }` non l'avrebbe vista — cioè non avrebbe controllato
     che qualcuno le legga. Una guardia che non sa di dover guardare non
     protegge niente, ed è lo stesso difetto della guardia scollegata. */
  return {
    densita, leggibile: siLegge,
    grezza: vuoto ? "" : String(g),
    da: siSa ? da : DENS_NON_DICHIARATA, noto: siSa,
    quando: siSa ? String(o.quando || "").trim() : "",
    riferimento: siSa ? String(o.riferimento || "").trim() : "",
    etichetta: siSa ? String(o.etichetta || "").trim() : "",
    fonte: siSa ? String(o.fonte || "").trim() : "",
  };
}

/* LA DENSITÀ DI QUESTA CAVA, presa dall'atto dove sta il resto dei suoi dati.
   Un posto solo: il materiale è già scritto lì, e chiedere la densità una
   seconda volta da un'altra parte vorrebbe dire avere due risposte per la
   stessa cava — è la ragione per cui la pagina di Terra già riempiva il campo
   dal materiale, e questa funzione ne prende il posto aggiungendo la
   provenienza. Dall'01/08 la chiama anche Campo, sulla stessa autorizzazione:
   è il motivo per cui vive qui.
   ⛔ SI RIPIEGA SUL VALORE TIPICO SOLO SE NON È STATO SCRITTO NIENTE. Se
   qualcuno ha scritto un valore impossibile, o ha dichiarato la fonte senza il
   numero, sostituirglielo con un preset nasconde il suo errore e gli mette in
   mano un numero che non ha scelto.
   ⛔ E UN NUMERO SENZA FONTE NON DIVENTA «A MANO»: resta «non dichiarata». */
export function densitaDellaCava(autorizzazione) {
  const a = autorizzazione || {};
  const daAtto = String(a.densitaFonte || "").trim().toLowerCase() === DENS_ATTO;
  const scritta = densitaDichiarata({
    densita: a.densita, da: a.densitaFonte, quando: a.densitaQuando,
    // l'atto è già identificato dal suo numero: se nessuno ha scritto un
    // riferimento più preciso, quello è il documento da esibire
    riferimento: a.densitaRiferimento || (daAtto ? a.numeroAtto : ""),
  });
  if (scritta.grezza !== "" || scritta.noto) return scritta;
  const p = densitaDelMateriale(a.materiale);
  if (!p) return densitaDichiarata(null);
  return densitaDichiarata({ densita: p.densita, da: DENS_PRESET, etichetta: p.etichetta, fonte: p.fonte });
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
    stato: statoPeggioreScadenze(sue, oggi),
    lavoratore: l, scadute, inScadenza, senzaData, documenti: sue.length,
  };
}

/* LO STATO PEGGIORE FRA PIÙ SCADENZE — la regola che stava scritta due volte.
   ═══════════════════════════════════════════════════════════════════════
   ⛔ Nasce il 03/08 da un difetto MISURATO nell'elenco Personale di Scudo: il
   riepilogo per persona era scritto lì a mano come

       prob.some(scaduta) ? "scaduta" : (prob.length ? "in-scadenza" : "regolare")

   cioè con TRE risposte per una funzione che ne sa dire QUATTRO. Una persona
   le cui uniche scadenze hanno la data illeggibile (o mai scritta) usciva con
   la pastiglia gialla **«In scadenza»** — che è un'affermazione precisa su una
   data che nessuno conosce — mentre lo scadenzario, sulla stessa riga, scrive
   «Senza data». Due schermate della stessa app, due risposte, e quella più
   tranquilla era anche quella sbagliata.
   La stessa domanda la faceva già `idoneitaOperatore` qui sopra, con la
   risposta giusta e da mesi: era la regola scritta due volte, la più debole
   nella pagina (il difetto che CLAUDE.md chiama «la copia più debole»).

   ⚠️ SU UN ELENCO VUOTO RISPONDE `null`, non «regolare». Chi non ha nemmeno
   una scadenza non è a posto: è una persona di cui non si sa niente, e chi
   chiama deve dirlo con parole sue («Nessuna scadenza», «senza-scadenze»).
   Un `"regolare"` qui sarebbe il verde su una cosa mai guardata. */
export function statoPeggioreScadenze(scadenze, oggi = new Date()) {
  let scadute = 0, inScadenza = 0, senzaData = 0, quante = 0;
  for (const s of scadenze || []) {
    quante++;
    const st = statoScadenzaHSE(s && s.dataScadenza, oggi);
    if (st === "scaduta") scadute++;
    else if (st === "in-scadenza") inScadenza++;
    else if (st === "senza data") senzaData++;
  }
  if (!quante) return null;
  return scadute ? "scaduta" : inScadenza ? "in-scadenza" : senzaData ? "senza data" : "regolare";
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
// PONTE · FLOTTA → CONTI — LO STESSO EURO CONTATO DUE VOLTE
// ══════════════════════════════════════════════════════════════════════
//
// ⛔ IL VOCABOLARIO C'ERA GIÀ, LO SCAMBIO NO — E IN MEZZO C'ERA UN DIFETTO.
// Flotta e Conti importano tutt'e due `VOCI_COSTO` da qui, quindi parlano la
// stessa lingua sui costi da sempre. E la bandiera `daMezzo` qui sopra dice,
// con il suo commento, perché esiste: «servono a non contarle DUE VOLTE quando
// Conti sommerà le proprie».
//
// Misurato il 27/08, chi quella bandiera la LEGGE:
//     grep -rc "daMezzo" shared/dw-ponti.js apps/conti/index.html apps/flotta/flotta-data.js
//     → shared 11 · conti 4 · **flotta 0**
//
// Cioè la difesa era **a senso unico**: Conti avvisa chi inserisce («anche in
// Flotta»), filtra i doppioni e mette il titolo sul menu — e non può mostrare
// QUALE spesa, perché i dati non passavano. Faceva già la domanda giusta senza
// poter avere la risposta, e l'unica difesa vera era che qualcuno si ricordasse
// che il gasolio sta anche di là.
//
// Questa funzione è la risposta: mette in fila, voce per voce, quanto ha Conti
// e quanto ha Flotta sulle SOLE voci che si sovrappongono.
//
// ── QUATTRO SCELTE, E TUTTE E QUATTRO SONO IL PRINCIPIO DEL FONDATORE ──
// 1. **Flotta non raggiungibile non è Flotta a zero.** Se la lettura non
//    riesce si risponde `{disponibile:false}` e non si stampa nessun numero:
//    un totale tranquillo ottenuto da un'app che non ha risposto sarebbe la
//    bugia peggiore, perché darebbe il via libera a inserire il doppione.
// 2. **Uno zero SCRITTO non sparisce.** Il filtro somma solo gli importi > 0 —
//    giusto — ma se ci si fermasse lì una voce registrata a zero uscirebbe dal
//    risultato identica a «nessuna riga». Sono due cose diverse: la prima
//    qualcuno l'ha scritta. Si contano a parte (`importoNonPositivo`).
//    ⚠️ È la stessa correzione che `riepilogoCosti` di Conti ha già fatto, e
//    scrivendo questa funzione l'avevo copiata A METÀ: la firma esatta della
//    copia debole. L'ha presa la prova in scratchpad, prima del modulo.
// 3. **Le righe senza data si contano, non si buttano.** Escluderle da un
//    periodo in silenzio farebbe sembrare un mese più economico di com'è.
// 4. **Il conto delle righe accompagna il totale.** Tre righe che sommano zero
//    e nessuna riga sono due situazioni diverse, e chi legge deve poterle
//    distinguere senza aprire l'elenco.
//
// ⚠️ E si guardano SOLO le voci `daMezzo`. Le altre — personale, energia,
// esplosivo, canone, ripristino — Flotta non le registra per costruzione, e
// metterle qui produrrebbe un confronto in cui metà delle righe dice sempre
// «Flotta non ce l'ha»: rumore che nasconde le tre che contano.
export function confrontoCostiMezzi(costiConti, costiFlotta, dal = "", al = "") {
  const d1 = String(dal || ""), d2 = String(al || "");
  if (costiFlotta == null) return { disponibile: false, motivo: "flotta-non-raggiungibile" };

  const dentro = (c) => {
    const d = String(c && c.data || "").slice(0, 10);
    if (!d1 && !d2) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;   // senza data non si può collocare
    return (!d1 || d >= d1) && (!d2 || d <= d2);
  };
  const r2 = (n) => Math.round(n * 100) / 100;
  const suMezzo = (c) => (voceCosto(c && c.voce) || {}).daMezzo === true;

  const somma = (righe) => {
    const tutte = (righe || []).filter(Boolean);
    const per = {}, conto = {};
    let senzaData = 0;
    for (const c of tutte) {
      if (!suMezzo(c)) continue;
      if (numeroDichiarato(c.importo) === null || +c.importo <= 0) continue;
      if (!dentro(c)) { if (d1 || d2) senzaData++; continue; }
      const k = voceCosto(c.voce).chiave;
      per[k] = r2((per[k] || 0) + (+c.importo || 0));
      conto[k] = (conto[k] || 0) + 1;
    }
    return {
      per, conto, senzaData,
      senzaImporto: tutte.filter(c => suMezzo(c) && numeroDichiarato(c.importo) === null).length,
      importoNonPositivo: tutte.filter(c => suMezzo(c) && numeroDichiarato(c.importo) !== null && +c.importo <= 0).length,
    };
  };

  const C = somma(costiConti), F = somma(costiFlotta);
  const voci = VOCI_COSTO.filter(v => v.daMezzo).map(v => {
    const c = C.per[v.chiave] === undefined ? null : C.per[v.chiave];
    const f = F.per[v.chiave] === undefined ? null : F.per[v.chiave];
    return {
      chiave: v.chiave, etichetta: v.etichetta, conti: c, flotta: f,
      righeConti: C.conto[v.chiave] || 0, righeFlotta: F.conto[v.chiave] || 0,
      entrambe: c !== null && f !== null,
    };
  });
  return {
    disponibile: true, voci,
    entrambe: voci.filter(v => v.entrambe).length,
    totaleConti: r2(voci.reduce((a, v) => a + (v.conti || 0), 0)),
    totaleFlotta: r2(voci.reduce((a, v) => a + (v.flotta || 0), 0)),
    senzaData: { conti: C.senzaData, flotta: F.senzaData },
    senzaImporto: { conti: C.senzaImporto, flotta: F.senzaImporto },
    importoNonPositivo: { conti: C.importoNonPositivo, flotta: F.importoNonPositivo },
  };
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P5 · CAMPO → SCUDO — IL MANCATO INFORTUNIO SEGNALATO DAL FRONTE
// ══════════════════════════════════════════════════════════════════════
//
// ⛔ NON È UNA FUNZIONE CHE MANCA ALL'ECOSISTEMA: È UNA FUNZIONE CHE NON STA
// DOVE STA LA PERSONA. Il giro completo esiste in Scudo da prima — il pulsante
// «Segnala un near-miss», il registro, il riepilogo aggregato nella forma che
// chiede la L. 198/2025, l'azione correttiva collegata. Quello che mancava è
// che chi è al fronte ha in mano CAMPO, non Scudo, e la differenza è il
// MOMENTO: un fermo si registra a mente fredda a fine turno, un near-miss o lo
// si segnala nei trenta secondi dopo o non lo segnala più. Ed è precisamente il
// dato che la legge nuova chiede di contare.
//
// ⛔ PERCHÉ IL COMPOSITORE DEL RECORD STA QUI, E NON IN CAMPO. La prima stesura
// lo metteva in `campo-data.js`, seguendo il precedente di `bozzaAzioneFermo`.
// Sarebbe stato il difetto misurato il 03/08 su cinque app: **dove il documento
// si compone**. Il documento qui è il record `infortuni/{id}` di Scudo, e
// componerlo in due posti — la pagina di Scudo e quella di Campo — vuol dire
// due forme che divergono al primo ripensamento, senza che nessuna prova se ne
// accorga, perché ognuna delle due è coerente con sé stessa. Il compositore è
// **uno** e i due chiamanti gli passano solo il loro «chi».
// La prova che lo tiene onesto non è che «si comporta bene»: è che sui casi
// della pagina di Scudo restituisce un record **identico** a quello che quella
// pagina scriveva prima.
//
// ⛔ E QUI IL PRINCIPIO DEL FONDATORE HA UNA FORMA PRECISA: «NON LO SO» NON È
// «ANONIMA». Sono due cose diverse e portano a due comportamenti diversi:
//   · **anonima** è una SCELTA — qualcuno ha toccato il pulsante apposta, ed è
//     la scelta che tiene vivo un registro vero;
//   · **non collegato** è un lavoro non ancora fatto: la persona c'è e ha un
//     nome, ma non è legata alla sua scheda di Scudo (`lavoratoreId`), quindi
//     nel registro il nome non comparirà;
//   · **non indicato** è una casella che nessuno ha compilato.
// Scrivere `anonimo: true` negli ultimi due sarebbe la solita assenza
// travestita da fatto: gonfierebbe il conteggio delle segnalazioni anonime —
// che è un indicatore di clima, non un residuo — e toglierebbe a chi legge il
// motivo per riparare il collegamento. È la stessa idea dell'appello del turno
// di Campo, dove chi nessuno ha spuntato non si conta né presente né assente.
// La bandiera è `noto`, e chi non la legge lascia la pagina a mostrare un
// numero tranquillo: la legge la pagina di Campo, che al suo posto mostra
// `motivoChi`.
//
// ⛔ E NON SI ACCOPPIA PER NOME. MAI — la stessa decisione del ponte P3, per la
// stessa ragione misurata: nei dati d'esempio Campo ha un «Marco Rossi» e Scudo
// un «Mario Rossi». Qui il rischio è più sottile che sulle visite mediche, ma è
// lo stesso: attaccare una segnalazione alla persona sbagliata. Si passa
// l'`id`, e senza id la risposta è «non lo so», detta.
//
// ⛔ LA DATA DEVE ESISTERE, e non è pignoleria: `riepilogoNearMiss` di Scudo
// seleziona il periodo con `giorniTra`, quindi un near-miss con una data che
// non esiste — «2026-02-30», che `Date.parse` NON rifiuta, fa scorrere al 2
// marzo — non cadrebbe in nessun periodo e sparirebbe dal riepilogo aggregato
// che si consegna. Una segnalazione che non si può salvare bene non si salva:
// si dice perché.
//
// Il vocabolario (categorie, luoghi, descrizione automatica) è **spostato** qui
// da `apps/scudo/scudo-data.js`, dove viveva: da quando serve anche a Campo,
// una seconda copia sarebbe due elenchi che divergono — e una categoria che
// esiste di qua e non di là finisce nel riepilogo di Scudo come «Non
// classificato», cioè un dato perso in silenzio. Scudo li ri-esporta coi nomi
// con cui li ha sempre chiamati: un alias non è una seconda implementazione.

/* Le categorie vengono dai rischi tipici delle attività estrattive (caduta
   massi e instabilità dei fronti, viabilità delle piste, organi in movimento
   dell'impianto, volata); il riferimento normativo del tracciamento è la
   L. 198/2025 (ex D.L. 159/2025). Si TOCCA una voce invece di scrivere, e la
   segnalazione è già completa. */
export const NEARMISS_CATEGORIE = [
  { chiave: "caduta-massi",  etichetta: "Caduta massi" },
  { chiave: "instabilita",   etichetta: "Fronte instabile" },
  { chiave: "mezzi",         etichetta: "Mezzi e investimento" },
  { chiave: "ribaltamento",  etichetta: "Ribaltamento" },
  { chiave: "caduta",        etichetta: "Caduta o scivolamento" },
  { chiave: "impianto",      etichetta: "Impianto e nastri" },
  { chiave: "volata",        etichetta: "Volata e proiezioni" },
  { chiave: "elettrico",     etichetta: "Elettrico o incendio" },
  { chiave: "sostanze",      etichetta: "Polveri e sostanze" },
  { chiave: "altro",         etichetta: "Altro" },
];
export const NEARMISS_LUOGHI = [
  { chiave: "fronte",   etichetta: "Fronte" },
  { chiave: "pista",    etichetta: "Piste" },
  { chiave: "piazzale", etichetta: "Piazzale" },
  { chiave: "impianto", etichetta: "Impianto" },
  { chiave: "officina", etichetta: "Officina" },
  { chiave: "deposito", etichetta: "Deposito" },
  { chiave: "uffici",   etichetta: "Uffici" },
  { chiave: "altro",    etichetta: "Altro" },
];
export function categoriaNearMiss(chiave) {
  const c = NEARMISS_CATEGORIE.find(x => x.chiave === chiave);
  return c ? c.etichetta : "";
}
export function luogoNearMiss(chiave) {
  const l = NEARMISS_LUOGHI.find(x => x.chiave === chiave);
  return l ? l.etichetta : "";
}
// Descrizione già scritta quando chi segnala non aggiunge niente: la
// segnalazione resta leggibile nel registro anche se è costata tre tocchi.
export function descrizioneNearMiss({ categoria, luogoTipo, luogo, dettaglio } = {}) {
  const d = (dettaglio || "").trim();
  if (d) return d;
  const cat = categoriaNearMiss(categoria);
  const dove = (luogo || "").trim() || luogoNearMiss(luogoTipo);
  if (cat && dove) return cat + " — " + dove;
  return cat || dove || "Near-miss segnalato";
}

/* I MODI DI SAPERE (o di non sapere) CHI HA SEGNALATO. Vocabolario chiuso:
   aggiungerne uno vorrebbe dire aggiungere un modo di rispondere alla domanda
   «di chi è questa segnalazione?». */
export const CHI_SEGNALA = ["anonima", "collegato", "non-collegato", "non-indicato"];

/* LA SEGNALAZIONE, PRONTA DA SCRIVERE nel registro `infortuni` di Scudo.
   Funzione PURA: non scrive niente, prepara il record e dice che cosa non va.
   Ritorna sempre un oggetto — non esistono risposte mancanti:
     { ok, problemi: [], record: {…}|null, chi, noto, motivoChi }
   · `problemi` sono le frasi da mostrare a chi sta compilando, nell'ordine in
     cui conviene sistemarle. Vuoto quando `ok`.
   · `chi` è una delle quattro parole di `CHI_SEGNALA`; `noto` dice se il
     registro potrà scrivere qualcosa di vero su chi ha segnalato, e
     `motivoChi` è la frase da mostrare quando non potrà.
   · `record` è `null` finché non si può comporre: un record a metà messo in
     archivio è peggio di nessun record.
   `s.chi` è `{ lavoratoreId?, nome? }` oppure `null`: Scudo passa l'id che ha
   scelto nella sua tendina, Campo passa il proprio operatore (che l'id ce l'ha
   solo se qualcuno l'ha collegato). `s.app`, `s.turno` e `s.squadra` si
   scrivono SOLO se ci sono, così un record composto da Scudo resta identico a
   com'era invece di guadagnare tre colonne vuote.
   `oggi` è iniettabile: le prove non dipendono dall'orologio di chi le lancia. */
export function bozzaNearMiss(s = {}, oggi = new Date()) {
  const categoria = String((s && s.categoria) || "").trim();
  const luogoTipo = String((s && s.luogoTipo) || "").trim();
  const data = String((s && s.data) || "").slice(0, 10);
  const problemi = [];
  if (!NEARMISS_CATEGORIE.some((x) => x.chiave === categoria))
    problemi.push("Tocca prima che cosa è successo: è la prima fila di pulsanti.");
  if (!NEARMISS_LUOGHI.some((x) => x.chiave === luogoTipo))
    problemi.push("Tocca dove è successo: serve a capire dove intervenire.");
  /* ⛔ `dataISOEsiste` e non `Date.parse`: «2026-02-30» non è NaN, JavaScript lo
     fa scivolare al 2 marzo — e una segnalazione datata a un giorno che non
     esiste esce da tutti i periodi del riepilogo aggregato. */
  if (!dataISOEsiste(data))
    problemi.push("Senza una data che esiste la segnalazione non entrerebbe in nessun riepilogo.");
  else if (giorniTra(data, oggi) > 0)
    problemi.push("La data della segnalazione non può essere nel futuro.");

  const anonimo = !!(s && s.anonimo);
  const p = (s && s.chi && typeof s.chi === "object") ? s.chi : null;
  const rif = p && p.lavoratoreId != null ? String(p.lavoratoreId).trim() : "";
  const chi = anonimo ? "anonima" : !p ? "non-indicato" : rif ? "collegato" : "non-collegato";
  const noto = chi === "anonima" || chi === "collegato";
  const nome = (p && String(p.nome || "").trim()) || "";
  const motivoChi =
    chi === "non-collegato"
      ? (nome ? "«" + nome + "»" : "Questa persona") + " non è collegata alla sua scheda in Scudo: "
        + "la segnalazione parte lo stesso, ma nel registro risulterà senza nome. "
        + "Non è la stessa cosa di una segnalazione anonima."
      : chi === "non-indicato"
      ? "Nessuno ha indicato chi segnala: nel registro la segnalazione risulterà senza nome. "
        + "Non è la stessa cosa di una anonima — se vuoi restare anonimo, tocca il pulsante apposta."
      : "";

  if (problemi.length) return { ok: false, problemi, record: null, chi, noto, motivoChi };

  const record = {
    data, tipo: "near-miss", gravita: "lieve", giorniAssenza: 0,
    categoria, luogoTipo, luogo: luogoNearMiss(luogoTipo),
    /* `s && s.dettaglio` come tutte le altre letture qui sopra: oggi questa
       riga non si raggiunge con un `s` non-oggetto (senza categoria valida ci
       si ferma prima), ma la difesa che dipende dall'ORDINE dei controlli è
       una difesa che il primo riordino toglie senza che nessuno lo veda. */
    descrizione: descrizioneNearMiss({ categoria, luogoTipo, dettaglio: s && s.dettaglio }),
    anonimo, segnalatoDaId: chi === "collegato" ? rif : null, rapida: true,
  };
  const app = String((s && s.app) || "").trim();
  const turno = String((s && s.turno) || "").trim();
  const squadra = String((s && s.squadra) || "").trim();
  if (app) record.origineApp = app;
  if (turno) record.turno = turno;
  if (squadra) record.squadra = squadra;
  return { ok: true, problemi: [], record, chi, noto, motivoChi };
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

/* ⛔ CHI È IL RESPONSABILE: LA DECISIONE STA QUI, LA FRASE È DI OGNI APP.
   Nata in Sentinella l'08/08 e traslocata qui **il giorno stesso**, quando è
   servita alla seconda app — è la regola di casa, e la seconda app è proprio
   quella che possiede il dato: **Scudo**.
   Il difetto che chiude, misurato affiancando i casi: un id che punta a
   qualcuno che **non è più in anagrafica** veniva detto «responsabile da
   assegnare», in quattro punti di Scudo e nel CSV che va all'ispettore. È
   falso, e nel modo che fa danno: chi legge crede che nessuno se ne stia
   occupando e magari riassegna. Un id che c'è dice che **qualcuno era stato
   scelto**, sempre; se il nome non si trova, il fatto riguarda l'ANAGRAFICA o
   la NOSTRA lettura, non l'azione.
   Cinque stati, e la ragione di ognuno:
     · `assente`          — nessun id: «da assegnare» è vero;
     · `trovato`          — id e nome: si dice il nome;
     · `illeggibile`      — l'elenco non si è potuto leggere (`leggibile:false`,
                            che è il caso dei PONTI: Sentinella legge i
                            lavoratori da Scudo). `noto:false`, perché è un
                            non-so e va scritto in modo che si veda;
     · `fuori-anagrafica` — l'elenco si legge e la persona non c'è più;
     · `senza-nome`       — la riga c'è ma il nome è vuoto. ⚠️ NON è
                            raggiungibile dai percorsi del prodotto (il form di
                            Scudo pretende il nome e `parseLavoratoriCsv`
                            scarta le righe senza), e sta qui lo stesso perché
                            oggi produceva un «resp. » con il nome mancante —
                            un vuoto con la faccia tranquilla. Dichiarato
                            irraggiungibile invece che spacciato per frequente.
   ⚠️ `leggibile` vale `true` per difetto: chi legge la PROPRIA anagrafica non
   ha nessuna lettura che possa fallire, e passare la bandiera a mano ovunque
   sarebbe un modo di dimenticarla dove serve. */
export function statoResponsabile(azione, lavoratori, leggibile = true) {
  const id = (azione && azione.responsabileId) || "";
  if (!id) return { stato: "assente", nome: "", noto: true };
  const trovato = (lavoratori || []).find((l) => l && l.id === id);
  if (trovato && trovato.nome) return { stato: "trovato", nome: String(trovato.nome), noto: true };
  if (trovato) return { stato: "senza-nome", nome: "", noto: true };
  if (!leggibile) return { stato: "illeggibile", nome: "", noto: false };
  return { stato: "fuori-anagrafica", nome: "", noto: true };
}

/* ⛔ IL NUMERO CHE QUALCUNO HA DICHIARATO, oppure `null`. Traslocata qui dal
   modulo di Sentinella il 07/08, quando è servita alla SECONDA app (Conti, per
   il file delle pesate che si ri-carica) — ed è la regola di casa: una regola
   che serve a due app vive in `shared/`, non nel modulo di una delle due, e
   **non si riscrive**. L'app la ri-esporta col nome con cui l'ha sempre
   chiamata: un alias non è una seconda implementazione.
   Perché esiste: `Number.isFinite(+x)` da sola NON risponde a questa domanda,
   perché `+null` fa **0** e `+""` fa **0**, e `Number.isFinite(0)` risponde
   **true**. Cioè il controllo che sembra il più severo lascia passare le due
   forme più comuni dell'assenza. Il 03/08 tre prove nuove su cinque sono
   cadute qui, in un blocco scritto proprio per togliere quel difetto.
   Dove morde: in un file che ESCE — o che rientra — una casella vuota non è
   uno zero, ed è la differenza fra «il ricettore è a zero metri» e «la
   distanza non l'ha scritta nessuno». */
export function numeroDichiarato(x) {
  if (x == null || String(x).trim() === "") return null;
  const v = +x;
  return Number.isFinite(v) ? v : null;
}

/* ⛔ IL PERCORSO PUNTATO, ANCHE NELLA DIMOSTRAZIONE — e senza questa funzione la
   correzione contro la perdita silenziosa funzionerebbe SOLO col database vero.
   ══════════════════════════════════════════════════════════════════════════
   L'08/08 la misura della decisione 5b (`docs/DUE_PERSONE_STESSA_RIGA.md`) ha
   detto che due persone che spuntano voci DIVERSE della stessa lista si
   cancellano a vicenda, in silenzio: la lista viene letta, cambiata in un
   punto e riscritta INTERA. La cura è scrivere il **percorso puntato**
   (`"esiti.dpi"`), che Firestore applica al singolo campo — misurato: le due
   spunte convivono.
   Ma il livello dati di ogni app ha DUE strade: Firestore quando c'è il login,
   e un elenco in memoria per la dimostrazione. Quella in memoria fa
   `Object.assign(x, data)`, e `Object.assign` di una chiave `"esiti.dpi"`
   crea una proprietà **letterale con il punto dentro**: misurato,
   `{"esiti":{"dpi":false},"esiti.dpi":true}` — la spunta non si vede, e non
   c'è nessun errore da leggere. Cioè la correzione avrebbe funzionato con i
   dati veri e **rotto la dimostrazione**, che è quello che il fondatore mostra.
   Sta in `shared/` perché serve a tutte e sei le app, e per la ragione di
   sempre: una regola scritta sei volte diverge sei volte. */
export function applicaPercorsi(oggetto, dati) {
  for (const [k, v] of Object.entries(dati || {})) {
    if (!k.includes(".")) { if (v === DW_CANCELLA) delete oggetto[k]; else oggetto[k] = v; continue; }
    const parti = k.split(".");
    let cur = oggetto;
    for (let i = 0; i < parti.length - 1; i++) {
      const p = parti[i];
      /* un ramo che non esiste, o che non è un oggetto, si apre: è quello che
         fa Firestore, e il caso «era `null`» capita davvero su una riga vecchia */
      if (cur[p] === null || typeof cur[p] !== "object" || Array.isArray(cur[p])) cur[p] = {};
      cur = cur[p];
    }
    const ultima = parti[parti.length - 1];
    if (v === DW_CANCELLA) delete cur[ultima]; else cur[ultima] = v;
  }
  return oggetto;
}

/* ⛔ TOGLIERE UNA VOCE COL PERCORSO PUNTATO — il contrassegno che serviva.
   ══════════════════════════════════════════════════════════════════════════
   Aprendo i dodici punti della misura 5b si è visto che i tre a OGGETTO non
   sono «una riga»: le due ispezioni di Scudo sanno anche **togliere** una voce
   («una voce senza esito, senza nota e senza foto non ha più niente da dire»),
   e col percorso puntato una cancellazione non si scrive con `undefined` — si
   scrive con `deleteField()` di Firestore.
   Ma le pagine non hanno in mano le primitive di Firestore: il livello dati le
   nasconde apposta. Serve quindi un **contrassegno** che la pagina possa
   scrivere e che ognuna delle due strade traduca a modo suo — `deleteField()`
   col database vero, `delete` nella dimostrazione.
   È un oggetto **congelato e unico**, non una stringa: una stringa sentinella
   può collidere con un dato vero scritto da una persona, e questo è il genere
   di collisione che non produce niente da leggere. */
export const DW_CANCELLA = Object.freeze({ __dwCancella: true });

/* La traduzione per la strada di Firestore. `deleteField` arriva come
   ARGOMENTO invece di essere importata qui: `shared/dw-ponti.js` è un modulo
   puro che gira anche in `node`, e importare Firebase da gstatic lo
   spezzerebbe. È la firma allargata al posto della copia. */
export function traduciCancellazioni(dati, deleteField) {
  const out = {};
  for (const [k, v] of Object.entries(dati || {})) out[k] = v === DW_CANCELLA ? deleteField() : v;
  return out;
}

/* ⛔ E COSTRUIRE I PERCORSI SI FA QUI, PERCHÉ HA UN CASO CHE NON SI PUÒ FARE.
   Da `{ dpi: true, luci: false }` si ricava `{ "esiti.dpi": true, … }`. Ma se
   una chiave contiene **già un punto**, il percorso puntato la spezzerebbe e
   scriverebbe in un ramo che non esiste: un dato che finisce nel posto
   sbagliato **senza nessun errore**, cioè la forma peggiore.
   Qui si risponde `null` invece di indovinare — è la convenzione di casa per
   «non si può» — e chi chiama torna a riscrivere l'oggetto intero, che è meno
   buono ma non è sbagliato. */
export function percorsiDi(campo, voci) {
  const out = {};
  for (const [k, v] of Object.entries(voci || {})) {
    if (String(k).includes(".")) return null;
    out[`${campo}.${k}`] = v;
  }
  return out;
}

/* ⛔ RILEGGI-E-RISCRIVI IN MODO ATOMICO — per gli ELENCHI, dove il percorso
   puntato non arriva.
   ══════════════════════════════════════════════════════════════════════════
   La misura 5b divide i dodici punti in due famiglie. Per gli OGGETTI basta il
   percorso puntato. Per gli ELENCHI no, e la ragione è stata misurata punto per
   punto invece che dedotta: uno **corregge** una lettura già dentro (l'indice di
   un array non si scrive col percorso puntato), uno aggiunge **e taglia** a un
   massimo, uno è un **import in blocco**. Nessuno dei tre è un `arrayUnion`.
   Quello che serve davvero è rileggere la riga e riscriverla **senza che
   nessuno si infili in mezzo**: una transazione. Firestore la rifà da capo se
   qualcuno ha scritto nel frattempo, quindi la lettura su cui si decide è
   sempre quella vera — che è esattamente ciò che mancava.
   Le primitive arrivano come ARGOMENTI perché questo modulo è puro e gira anche
   in `node`: importare Firebase da gstatic lo spezzerebbe. È la firma allargata
   al posto della copia, per la terza volta in questo file. */
export async function trasformaAtomico({ rif, runTransaction, deleteField } = {}, cambia) {
  /* ⛔ CHI NON RICEVE QUELLO CHE GLI SERVE LO DICE, non muore su un `TypeError`.
     Trovato dalla `sonda-vuoto` l'08/08: chiamata senza niente, questa funzione
     esplodeva leggendo `rif.firestore`. Un errore di lettura di proprietà non
     dice a nessuno che cosa manca; una frase sì. */
  if (!rif || typeof runTransaction !== "function" || typeof cambia !== "function")
    throw new Error("trasformaAtomico: servono la riga, runTransaction e la funzione che decide i cambi.");
  return runTransaction(rif.firestore, async (tx) => {
    const scatto = await tx.get(rif);
    /* ⛔ una riga cancellata nel frattempo non si RESUSCITA: `update` su un
       documento che non c'è viene rifiutata (misurato, caso 5), e qui si
       risponde con la stessa chiarezza invece di ricrearla di nascosto. */
    if (!scatto.exists()) throw new Error("La riga non c'è più: qualcuno l'ha tolta mentre la modificavi.");
    const cambi = cambia(scatto.data());
    if (!cambi) return;                       // niente da fare: si esce senza scrivere
    tx.update(rif, traduciCancellazioni(cambi, deleteField));
  });
}

/* La stessa cosa per la DIMOSTRAZIONE, dove non c'è nessuna transazione da
   fare (un solo browser, nessuno con cui accavallarsi) ma il CONTRATTO deve
   essere identico: stessa firma, stesso «niente da fare non scrive», stesso
   errore se la riga non c'è più. Se i due contratti divergono, la
   dimostrazione smette di dimostrare. */
export function trasformaInMemoria(riga, cambia) {
  if (typeof cambia !== "function")
    throw new Error("trasformaInMemoria: serve la funzione che decide i cambi.");
  if (!riga) throw new Error("La riga non c'è più: qualcuno l'ha tolta mentre la modificavi.");
  const cambi = cambia({ ...riga });
  if (!cambi) return riga;
  return applicaPercorsi(riga, cambi);
}
