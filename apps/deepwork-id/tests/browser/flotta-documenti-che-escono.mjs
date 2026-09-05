/* IN FLOTTA IL FILE CHE ESCE DICE QUELLO CHE DICE LO SCHERMO
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node flotta-documenti-che-escono.mjs [--porta=8530]
     node flotta-documenti-che-escono.mjs --controprova   (rimette i difetti: DEVE fallire)

   PERCHÉ ESISTE. La domanda di `CLAUDE.md` è: *dove questa app compone
   qualcosa che ESCE — un CSV, un PDF, una frase di riepilogo — chi decide i
   suoi numeri?* Se la risposta non è «la stessa funzione che li decide a
   schermo», lì c'è una copia debole. È il posto dove nessuna prova guarda,
   perché le prove chiamano il modulo e i file li compone la **pagina**.
   ⚠️ E il modo di misurarlo NON è leggere il codice: il censimento statico su
   cinque app aveva dato **zero**. Si preme il bottone e si apre il file.
   Flotta ha **nove** punti d'uscita ed era l'unica app grossa senza un banco
   che ne aprisse uno: `flotta-disegni` guarda i pixel, `flotta-frasi-da-uno`
   il singolare, e i file non li apriva nessuno.

   CHE COSA HA TROVATO, l'08/08: **quattro** difetti in quattro file, e tutti
   e quattro nella stessa famiglia — il documento che esce dice una cosa più
   TRANQUILLA di quella che lo schermo mostra.

   1 · `flotta_situazione.csv` — «PIANIFICATA» DOVE LO SCHERMO È ROSSO.
       La colonna `stato` di ogni manutenzione era la parola `pianificata`,
       scritta **fissa nel modello di riga**. `statoOrdine` sa dire tre cose —
       «da fare», «in corso» e «attesa pezzi» — e l'ultima sullo schermo porta
       `cls: "danger"`, col perché scritto nel modulo: *il lavoro è fermo
       perché manca un pezzo, è la ragione più frequente di una macchina ferma
       a lungo*. Cioè una macchina ferma ad aspettare un ricambio finiva in
       questo foglio — quello che si gira al responsabile o all'officina —
       come «pianificata».
       Lo stato si mette **a mano** dalla scheda dell'ordine
       (`data-odl-stato` → `salvaOrdine(n, { stato })`), quindi il caso non è
       teorico: è un tocco. Verificato prima di scrivere la riga.

   2 · `flotta-giri-macchina.csv` — «TUTTO A POSTO» SENZA AVER GUARDATO.
       L'export decideva da `const male = (c.voci || []).filter(v => v.esito
       === "no")`: un giro che dichiara `anomalie: 2` ma **non porta l'elenco
       delle voci** usciva `tutto a posto ; 0`, mentre lo schermo, sullo stesso
       record, scrive il badge giallo «2 da vedere» (decide da `+c.anomalie`).
       ⚠️ ONESTÀ SULLA GRAVITÀ, perché la misura l'ha ridimensionata: quella
       forma di record **oggi non è producibile dall'app**. L'unico punto che
       crea un controllo (`db.aggiungi("controlli", dati)`) scrive sempre
       `voci`, e `anomalie: r.no` esce dallo stesso elenco, quindi i due campi
       nascono d'accordo. È un difetto **latente** — vive per i record vecchi,
       per un import, per una scrittura parziale — e resta scritto qui perché
       *la versione giusta era già in questo stesso file 220 righe più in
       basso* (il CSV del libretto, che quel caso lo distingue in tre rami e
       nel commento racconta esattamente questo difetto). Una correzione fatta
       a un export e non all'altro: è la firma della copia debole.

   3 · `flotta-registro-interventi.csv` — LO ZERO SOMMABILE. La cella
       dell'importo era `(+w.costo) || 0`: un intervento chiuso senza scrivere
       quanto è costato usciva con uno **0**, e chi apre il file in un foglio
       quello zero lo SOMMA credendolo misurato. Lo schermo la pastiglia
       dell'importo non la disegna affatto; il libretto scrive «costo non
       scritto». Ed è l'export più grande dell'app, quello che si porta al
       commercialista.
       ⚠️ La correzione non è `> 0` ma `numeroDichiarato`, perché uno **zero
       scritto** è un dato — una riparazione in garanzia costa davvero zero — e
       va tenuto distinto dal campo mai compilato. Il banco misura tutt'e due i
       casi INSIEME: da soli, «0» e «vuoto» sembrano la stessa scelta.

   4 · `flotta-lista-della-spesa.csv` — DUE INCERTEZZE DICHIARATE E MAI LETTE.
       È la regola 20 applicata a un export: il modulo si accorge di non poter
       misurare bene e lo dice con una bandiera, e se quella bandiera non la
       legge nessuno il numero tranquillo si stampa lo stesso.
       · `r.affidabile` (`episodi >= 2`) — a schermo «un solo consumo
         registrato: è un ordine di grandezza, non una media», e quella
         bandiera decide perfino se PROPORRE una soglia più bassa. Nel file il
         consumo usciva come un numero fermo: chi lo riceve ordina una quantità
         calcolata su un episodio solo credendola una media;
       · `p.senzaData` — gli interventi con ricambi il cui giorno non si legge
         restano FUORI dal consumo, e l'errore va nella direzione che
         tranquillizza: un magazzino più magro del vero.

   ⛔ IL BANCO NON PORTA DENTRO NESSUN VALORE ATTESO. È la lezione del 07/08:
   un banco che si scrive in pancia «il totale fa 2395,1» invecchia col
   crescere della dimostrazione e poi **accusa il prodotto** di una cosa che
   ha fatto il prodotto. Qui ogni riga del file si confronta con quello che la
   **schermata** dice nello stesso istante, letto per selettore: se un giorno
   le parole cambiano, cambiano in tutt'e due i posti e il banco resta verde
   per la ragione giusta.

   ⚠️ E IL CENSIMENTO È DICHIARATO, ADESSO CHIUSO: **nove su nove**. Gli altri
   cinque documenti — fermi macchina, scadenze di legge, costi, ricambi e il
   libretto del mezzo — sono stati aperti e sono risultati **puliti**. Il
   cantiere che aveva letto il codice li dava per puliti, ma un negativo
   DEDOTTO non vale niente: su cinque app il censimento statico su questa
   stessa domanda aveva dato zero mentre i difetti c'erano. Adesso è misurato.
   Su quei cinque le prove sono più larghe (il file esce, non è la sola
   intestazione, nessuna cella dice «undefined», «null» o «NaN») più, sul
   libretto, che i vuoti li dichiari a parole: sono i due modi in cui Flotta è
   già stata morsa. Non è la stessa profondità dei primi quattro, e va detto:
   «pulito» qui vuol dire «nessuna di QUESTE domande ha trovato niente».

   ⛔ E IL 09/08 QUELLA RIGA È STATA MESSA ALLA PROVA, PERCHÉ ERA UN INVITO:
   dichiarava di sé la propria superficialità e nessuno l'aveva raccolto. Su
   due dei cinque, RIFACENDO LE DOMANDE DEI PRIMI QUATTRO — ogni cella
   confrontata con la schermata sullo stesso istante, e i record **degradati**
   (una data che non esiste, un numero mai scritto) montati apposta — sono
   usciti **due difetti veri**. Cioè il «pulito» era esatto e la domanda era
   corta, che è la differenza fra un negativo misurato e un negativo completo.

   5 · `flotta-fermi-macchina.csv` — «CHIUSO» SU UN FERMO CHE NESSUNO SA
       QUANDO È FINITO. `durataFermo` sa dire tre cose e la colonna `stato` ne
       scriveva due (`f.aperto ? "ancora fermo" : "chiuso"`): un fermo con una
       delle due date illeggibile usciva **«chiuso»** con la colonna dei
       giorni **vuota** — un episodio concluso a zero giornate perse, dove lo
       schermo scrive la pastiglia «data non valida». È la regola 18 applicata
       a un file. Lo stato ha adesso un nome nel modulo (`statoFermo`) e lo
       leggono in due, la pastiglia e la cella.
       ⚠️ ONESTÀ SULLA GRAVITÀ: quel record oggi l'app non lo sa produrre —
       `validaFermo` rifiuta sia il giorno che non esiste sia la ripartenza
       prima della partenza. **Latente**, come il difetto 2, e corretto per la
       stessa ragione: la versione giusta era già in questo stesso file, nello
       scadenzario, che il suo terzo stato (`senza-data`) lo scrive da sempre.

   6 · `flotta_situazione.csv` — «ok» E «soglia min 0» SU UN PEZZO CHE UNA
       SOGLIA NON CE L'HA, e stavolta la copia debole era **la schermata**.
       `parseRicambiCsv` decide dal 30/07 che la soglia mancante resta `null`,
       col perché scritto nella sua prova: *«una soglia inventata fa suonare
       un allarme che nessuno ha chiesto, oppure lo tace»*. Ogni posto che
       doveva DIRE qualcosa di quel ricambio se ne teneva una copia più
       debole, `+r.sogliaMin || 0`, cioè la soglia inventata — e quindi
       taceva: la riga del magazzino scriveva «soglia minima 0» con la
       pastiglia verde «ok», questo foglio scriveva «ok» e «soglia min 0», e
       la priorità operativa «/ min 0».
       ⚠️ E questo NON è latente: si riproduce premendo il bottone vero
       «Importa ricambi CSV» con la colonna `sogliaMin` vuota. L'app dichiara
       nel messaggio d'import «2 sono senza soglia minima e non entreranno
       nell'avviso di sotto-scorta» — e un istante dopo, nella riga che resta,
       si smentiva. Il CSV del magazzino, un bottone più in là, la soglia la
       scriveva **vuota** da sempre: il file sapeva e lo schermo no.
       Adesso la parola la decide `statoScorta`, che ha quattro stati
       (`esaurito`, `sotto-scorta`, `senza-soglia`, `a-posto`) e **non sposta
       nessun avviso** — c'è una prova in `run-kpi` che confronta caso per
       caso chi entra in `sottoScorta` col filtro di prima.
*/
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { azzeraFrasi, frasiVisibili, contiNellaFrase, righeDiDato, postiDaFrase } from "./giro.mjs";

const QUI = dirname(fileURLToPath(import.meta.url));
const R = process.env.DW_RADICE || join(QUI, "..", "..", "..", "..");
const PORTA = +((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1] || 8530);
const CONTROPROVA = process.argv.includes("--controprova");

const PAGINA = join("apps", "flotta", "index.html");
const MODULO = join("apps", "flotta", "flotta-data.js");

/* I cinque difetti, nella forma testuale che avevano prima della correzione.
   ⚠️ Una tabella d'iniezione cita il codice TESTUALMENTE, e il codice si
   muove — quasi sempre perché è migliorato. Quando non combacia più non
   succede niente di visibile: la pagina servita resta sana e la controprova
   gira su un prodotto sano dicendo «non distingue». Per questo ogni
   sostituzione conta i suoi soggetti e pretende ESATTAMENTE uno, e
   `iniezioni-fresche.mjs` rilegge questa tabella da fermo, in `npm test`. */
const DIFETTI = [
  // 1 · la parola fissa al posto dello stato vero
  ["};${csvCell(statoOrdine(n).breve)};${csvCell(n.orePreviste ? \"a \" + (+n.orePreviste).toLocaleString(\"it-IT\", { useGrouping: true }) + \" h motore\"",
   "};pianificata;${csvCell(n.orePreviste ? \"a \" + n.orePreviste + \" h motore\""],
  /* 2 · l'esito del giro deciso dalle sole voci, ignorando `anomalie`.
     ⚠️ L'ANCORA È CORTA DI PROPOSITO, e questa riga è nata sbagliata: la
     prima stesura citava le CINQUE righe del modello di riga, e un'ora dopo
     non combaciavano più — avevo cambiato `s.voci` in `s.dettaglio` per non
     perdere la nota di chi fa il giro. Non è successo niente di visibile: la
     pagina servita è rimasta sana, la controprova ha girato su un prodotto
     sano, e il riepilogo ha detto «✔ distingue» perché era caduto l'ALTRO
     difetto. L'ha presa solo il conto dei difetti rimessi — che è la ragione
     per cui quel conto esiste.
     Adesso l'ancora è la sola riga che deve restare ferma, e il vecchio
     comportamento si rimette ombreggiando `s`: il modello di riga può
     cambiare quanto vuole, l'iniezione arriva lo stesso.
     ⚠️ Otto spazi, non sei: la stessa riga esiste anche nel libretto (4529).
     Con l'indentazione i soggetti restano uno, e se un giorno diventassero
     due il banco lo dice invece di sceglierne uno a caso. */
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO (`csvGiriMacchina`): due spazi in meno. */
  ["      const s = statoGiro(c);",
   "      const s = (() => { const male = (c.voci || []).filter(v => v.esito === \"no\");\n          return { etichetta: male.length ? \"con anomalie\" : \"tutto a posto\", anomalie: male.length,\n                   nominate: true, voci: male.map(v => v.etichetta), dettaglio: male }; })();", MODULO],
  // 3 · lo zero sommabile al posto della cella vuota, nel registro interventi
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO (`csvRegistroInterventi`): due spazi in meno. */
  ["                 numeroDichiarato(w.costo) == null ? \"\" : numeroDichiarato(w.costo), w.note || \"\",",
   "                 (+w.costo) || 0, w.note || \"\",", MODULO],
  // 4 · la lista della spesa senza la colonna `episodi`
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO (`csvListaDellaSpesa`): due spazi in meno. */
  ["                         r.episodi == null ? \"\" : r.episodi].map(csvCell).join(\";\")));",
   "                         \"\"].map(csvCell).join(\";\")));", MODULO],
  /* 5 · e la lista della spesa senza l'avvertenza sugli interventi rimasti
     fuori dal conto. Sta qui perché senza di lei quelle due prove non
     sapevano fallire: la quarta iniezione toglie la COLONNA, non la CODA, e
     una prova che nessuna iniezione può far cadere è una prova che non
     dimostra niente — anche quando il riepilogo intorno a lei è rosso. */
  ["  if (p.senzaData) {", "  if (false) {", MODULO],   /* ⏱️ sul MODULO dal 05/09 */
  /* 6 · il file perde una riga in silenzio e la FRASE non se ne accorge: è la
     forma esatta del difetto che il confronto frase↔file esiste per prendere.
     Un mezzo sparisce dalla situazione, e il riepilogo continua a dire sei. */
  ["    for (const m of MEZ.slice().sort((a, b) => a.nome.localeCompare(b.nome, \"it\")))",
   "    for (const m of MEZ.slice(1).sort((a, b) => a.nome.localeCompare(b.nome, \"it\")))"],
  /* 7 · la colonna «stato» dei fermi che sa dire due cose su tre: un fermo con
     una data illeggibile usciva «chiuso», e la colonna dei giorni vuota.
     ⚠️ L'ancora è la riga della CELLA, non l'intero modello: sopra di lei c'è
     un commento lungo che racconta il difetto, e citarlo lo renderebbe
     un'iniezione scaduta al primo ritocco della prosa. */
  /* ⏱️ RI-ANCORATA il 05/09 sul MODULO: il registro dei fermi è salito in
     `csvFermiMacchina`, con due spazi in meno di indentazione. */
  ["       f.statoTx, f.note || \"\"].map(csvCell).join(\";\")));",
   "       f.aperto ? \"ancora fermo\" : \"chiuso\", f.note || \"\"].map(csvCell).join(\";\")));", MODULO],
  /* 8 · e la riga del ricambio nella situazione, che a un pezzo senza soglia
     minima diceva «ok» con accanto «soglia min 0» — una soglia che nessuno ha
     scritto. La decisione adesso la prende `statoScorta`, la stessa che
     disegna la pastiglia sullo schermo. */
  ["      const s = statoScorta(r);\n      csv += `ricambio;${csvCell(r.nome)};${csvCell(s.label)};${csvCell(\"giacenza \" + s.giacenza + (s.soglia == null ? \" · soglia minima non impostata\" : \" · soglia min \" + s.soglia))}\\n`;",
   "      const scorta = new Set(sottoScorta(RIC).map(x => x.id));\n      csv += `ricambio;${csvCell(r.nome)};${scorta.has(r.id) ? \"sotto scorta\" : \"ok\"};${csvCell(\"giacenza \" + (+r.giacenza || 0) + \" · soglia min \" + (+r.sogliaMin || 0))}\\n`;"],
];

/* I casi si montano nel MODULO servito, mai sul disco: la cartella viva resta
   immobile e i cantieri paralleli non se ne accorgono.
   ⛔ E si scrivono DOPO la dichiarazione di DEMO, non dentro il suo letterale:
   un `DEMO.x = [...]` più in basso butterebbe via l'iniezione un istante dopo
   averla fatta — è già successo, e la riga «i casi hanno agganciato» diceva
   ok perché guardava il FILE invece dello STATO. */
const CASI = `
/* ── casi montati dal banco flotta-documenti-che-escono.mjs (mai sul disco) ── */
{
  const oggi = new Date().toISOString().slice(0, 10);
  /* TRE ordini di lavoro, uno per stato, così il file deve dire tre parole
     diverse. Senza il terzo il banco non distinguerebbe «scrive lo stato» da
     «scrive sempre la stessa parola giusta per caso». */
  DEMO.manutenzioni = [
    { id: "m-daf", titolo: "Tagliando 500 h", mezzo: "Escavatore E2", dataPrevista: oggi, orePreviste: 6000 },
    { id: "m-cor", titolo: "Sostituzione cingoli", mezzo: "Pala P1", dataPrevista: oggi, stato: "in-corso" },
    { id: "m-att", titolo: "Pompa idraulica", mezzo: "Dumper D3", dataPrevista: oggi, stato: "attesa-ricambi" },
  ];
  /* Un giro che DICHIARA due anomalie senza portare l'elenco delle voci: è la
     forma che l'app di oggi non sa più produrre, e che il file trattava come
     «tutto a posto». Accanto, un giro normale con le sue voci, perché un
     campione solo non distingue «funziona» da «sono tutti uguali». */
  DEMO.controlli = [
    { id: "g-muto", data: oggi, mezzo: "Dumper D3", tipo: "dumper", operatore: "Luca",
      ore: 4100, anomalie: 2, note: "" },
    { id: "g-pieno", data: oggi, mezzo: "Escavatore E2", tipo: "escavatore", operatore: "Marco",
      ore: 3210, anomalie: 1, note: "",
      voci: [{ chiave: "freni", etichetta: "Freni, sterzo e comandi", esito: "no", nota: "", critica: true },
             { chiave: "livelli", etichetta: "Livelli", esito: "ok", nota: "", critica: false }] },
  ];
  /* Gli interventi servono a DUE documenti insieme: il registro (la cella
     dell'importo) e la lista della spesa (che si costruisce dai ricambi
     consumati). I tre costi sono i tre casi che la cella deve distinguere —
     scritto, ZERO scritto (una riparazione in garanzia costa davvero zero) e
     mai scritto — e non si possono ridurre a due: è proprio la coppia
     «zero vero / zero inventato» che il difetto confondeva. */
  const gg = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  DEMO.interventi = [
    { id: "i-caro", data: gg(10), titolo: "Sostituzione filtro", mezzo: "Escavatore E2",
      ricambio: "Filtro olio", costo: 120, note: "" },
    { id: "i-zero", data: gg(20), titolo: "Ripasso in garanzia", mezzo: "Pala P1",
      ricambio: "Filtro olio", costo: 0, note: "" },
    { id: "i-muto", data: gg(30), titolo: "Registrazione cingoli", mezzo: "Dumper D3",
      ricambio: "Filtro olio", note: "" },
    /* e uno il cui GIORNO NON SI LEGGE, con un ricambio dentro: resta fuori
       dal consumo, quindi la proposta è un minimo — ed è la cosa che il file
       non diceva */
    { id: "i-senzadata", data: "2026-02-30", titolo: "Intervento con data impossibile",
      mezzo: "Pala P1", ricambio: "Filtro olio", costo: 40, note: "" },
  ];
  /* ⚠️ QUI DENTRO NIENTE ACCENTI GRAVI: questo blocco è un template literal
     letto dal banco, quindi un nome di funzione scritto fra apici inversi
     NON è una citazione, chiude la stringa — e il file non si compila più.
     È scritto in CLAUDE.md e mi è successo due volte in un'ora.
     Il secondo pezzo NON ha la soglia minima, ed è la forma che l'app produce
     davvero: parseRicambiCsv scrive sogliaMin null da sempre e il messaggio
     d'import la conta («N sono senza soglia minima e non entreranno
     nell'avviso di sotto-scorta»). Serve accanto al primo perché un campione
     solo non distingue «lo dichiara» da «dice sempre la stessa cosa». */
  DEMO.ricambi = [
    { id: "r-filtro", nome: "Filtro olio", giacenza: 0, sogliaMin: 1, prezzo: 18 },
    { id: "r-nosogl", nome: "Cinghia ventola", giacenza: 3, prezzo: 40 },
  ];
  /* Due fermi con una data che non si legge, in coda a quelli della
     dimostrazione. ⚠️ ONESTÀ SULLA GRAVITÀ: l'app di oggi non li sa produrre
     — validaFermo rifiuta sia il giorno che non esiste sia la ripartenza
     prima della partenza, e il bottone «è ripartito» ripassa di lì. Sono
     latenti (record vecchi, un import), e stanno qui perché la colonna
     dello stato li chiamava «chiuso» con la colonna dei giorni vuota. */
  DEMO.fermi = (DEMO.fermi || []).concat([
    { id: "f-fineNo", mezzo: "Pala P1", causale: "verifica", inizio: gg(9), fine: "2026-02-30", note: "" },
    { id: "f-inizioNo", mezzo: "Dumper D3", causale: "guasto", inizio: "2026-02-30", fine: "", note: "" },
  ]);
}
`;

let iniezioni = 0, rimessi = new Set();
/* ⛔ OGNI INIEZIONE DICHIARA IL SUO FILE, E SI APPLICA SOLO LÌ (05/09). Fino a
   oggi `applica` girava sulla sola PAGINA e ignorava il terzo elemento: le
   iniezioni riancorate sul MODULO (i fermi, `statoGiro`, il costo, `episodi`,
   `senzaData`) non mordevano niente, e la controprova stampava «✔ distingue»
   grazie alle altre — con la riga «i 8 difetti sono stati rimessi davvero»
   rossa in mezzo, che nessuno leggeva. Peggio: l'ancora di `statoGiro` a sei
   spazi è una SOTTOSTRINGA della riga a otto del libretto, quindi mordeva la
   pagina nel posto sbagliato e si contava rimessa. Un'iniezione senza file
   vale per la pagina, come prima. */
const applica = (t, file) => {
  for (const [i, [da, a, f]] of DIFETTI.entries()) {
    if ((f || PAGINA) !== file) continue;
    if (!t.includes(da)) continue;
    const n = t.split(da).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA (#${i + 1}): ${n} soggetti`); continue; }
    t = t.replace(da, a); rimessi.add(i);
  }
  return t;
};
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) t = applica(t, MODULO);
    corpo = Buffer.from(t + CASI, "utf8"); iniezioni++;
  }
  if (CONTROPROVA && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA, e poi si RILEGGE DAL SERVER
   il contrassegno col proprio pid — la sola prova che chi risponde è mio. Un
   banco che riusa la porta di un altro non fallisce: misura la copia di
   qualcun altro e dice cose vere su una cartella che nessuno sta guardando. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{
  const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · CONTROPROVA" : ""}`);
}

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
/* I CSV escono da un `<a download>` con un href `data:`: il click vero
   scaricherebbe un file, quindi si intercetta e se ne legge il contenuto. */
await pg.addInitScript(() => {
  window.__scaricati = [];
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/flotta/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };

dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioni > 0, "il modulo servito porta i casi del banco", iniezioni);
if (CONTROPROVA) dice(rimessi.size === DIFETTI.length,
  `i ${DIFETTI.length} difetti sono stati rimessi davvero`, [...rimessi]);

/* ⛔ LA PROVA DI AVER NAVIGATO. Un banco che misura una schermata che non c'è
   risponde «tutto a posto»: `vaiA` vuole l'id del BOTTONE, e un id sbagliato
   finisce nel `.catch()` senza dire niente. */
const vaiA = async (navId, pageId) => {
  await pg.click("#" + navId).catch(() => {});
  await pg.waitForTimeout(500);
  const viva = await pg.evaluate((p) => {
    const el = document.getElementById(p);
    return !!el && getComputedStyle(el).display !== "none";
  }, pageId);
  dice(viva, `sono davvero sulla schermata ${pageId}`);
  return viva;
};
/* La regola «la frase dichiara quello che il file contiene» sta in `giro.mjs`,
   l'attrezzo che tutti i banchi importano: la usa anche il banco di Conti, e
   una regola usata due volte in questa casa si scrive una volta. */
let fraseConNumero = 0, fraseSenzaNumero = 0, fraseMuta = 0, senzaPosto = 0;
const scarica = async (btn) => {
  await pg.evaluate(() => { window.__scaricati = []; });
  /* ⛔ SI AZZERANO LE FRASI PRIMA DI PREMERE. La prima stesura leggeva tutti
     gli `.esito` visibili DOPO il click, e ne raccoglieva anche di vecchi —
     rimasti a schermo da un export precedente — quindi il «primo numero della
     frase» era il conto di un'altra esportazione: otto KO tutti falsi, con la
     prova che li smentiva stampata accanto («Esportati: 6 mezzi… | Esportati 2
     giri macchina»). Il righello, non il soggetto, per l'ennesima volta: la
     frase da guardare è quella che nasce da QUESTO click. */
  await azzeraFrasi(pg);
  await pg.click("#" + btn).catch(() => {});
  await pg.waitForTimeout(500);
  const g = await pg.evaluate(() => window.__scaricati);
  if (!g.length) return null;
  const href = g[g.length - 1].href;
  /* ⚠️ IN FLOTTA I DUE FILE NON ESCONO NELLO STESSO MODO: la situazione è un
     `data:` URL, i giri macchina un `blob:` (con in più il BOM per Excel).
     La prima stesura di questa riga decodificava sempre come `data:`, cioè
     tagliava alla prima virgola — che in un `blob:` non c'è: `indexOf` dava
     -1, il taglio restituiva l'URL stesso, e il banco misurava «un file di
     una riga» accusando il prodotto di esportare un CSV vuoto. Il righello,
     non il soggetto: il primo sospettato di una misura che non torna. */
  const testo = href.startsWith("blob:")
    ? await pg.evaluate((u) => fetch(u).then((r) => r.text()), href)
    : decodeURIComponent(href.slice(href.indexOf(",") + 1));
  const righe = testo.replace(/^﻿/, "").split(/\r?\n/).filter(Boolean);
  /* il confronto frase↔file: si guarda il PRIMO numero della frase, che è
     quello del conto («Esportati 12 interventi»), e lo si mette accanto alle
     righe di dato (tolta l'intestazione). */
  /* ⚠️ LA PRIMA STESURA DI QUESTO CONFRONTO SBAGLIAVA TRE VOLTE SU OTTO, e i
     tre KO erano tutti il righello: prendeva il PRIMO numero della frase e lo
     voleva uguale alle righe. Ma «Esportati: 6 mezzi, 3 manutenzioni, 1
     ricambio» porta TRE conti (e 6+3+1 fa esattamente le 10 righe del file);
     «Esportate 3 scadenze, più 3 mezzi senza nessuna» ne porta due; e la lista
     della spesa ha una riga in più che è l'AVVERTENZA sugli interventi fuori
     dal conto, non un dato. Un allarme che sbaglia tre volte su otto insegna a
     non guardarlo — e il prodotto, in tutt'e tre i casi, aveva ragione.
     La domanda giusta è più larga di un'uguaglianza e resta stretta abbastanza
     da mordere: **le righe di DATO del file devono essere fra i numeri che la
     frase dichiara, o la loro somma.** Le righe senza `;` non sono dati (sono
     avvertenze in coda, una cella sola), e l'intestazione non si conta. */
  const frase = await frasiVisibili(pg);
  const numeri = contiNellaFrase(frase);
  if (numeri.length) {
    fraseConNumero++;
    const dati = righeDiDato(righe);
    const somma = numeri.reduce((t, x) => t + x, 0);
    dice(numeri.includes(dati) || somma === dati,
      `le righe del file sono fra i numeri che la frase dichiara (${btn})`,
      { frase: frase.slice(0, 100), numeri, righeDiDato: dati });
  } else if (frase.trim()) fraseSenzaNumero++;
    else if (await postiDaFrase(pg) > 0) fraseMuta++;
    else senzaPosto++;
  return { nome: g[g.length - 1].nome, righe };
};
const colonna = (riga, i) => (riga.split(";")[i] || "").replace(/^"|"$/g, "").replace(/""/g, '"');

// ═══════════ 1 · la situazione: lo stato di un ordine di lavoro ═══════════
console.log("\n════════ flotta_situazione.csv ════════");
if (await vaiA("nav-mez", "page-mez")) {
  const f = await scarica("btn-flotta-export");
  dice(!!f, "il file esce davvero");
  if (f) {
    const man = f.righe.filter((r) => r.startsWith("manutenzione;"));
    dice(man.length === 3, "le tre manutenzioni sono nel file", man.length);
    /* ⛔ NIENTE VALORI ATTESI SCRITTI QUI DENTRO: le parole si prendono dalla
       SCHERMATA degli ordini, nello stesso istante e sullo stesso stato. */
    const aSchermo = await (async () => {
      await pg.click("#nav-man").catch(() => {});
      await pg.waitForTimeout(500);
      return pg.evaluate(() => [...document.querySelectorAll("#man-list .item")].map((el) => ({
        nome: (el.querySelector(".name") || {}).textContent || "",
        badge: [...el.querySelectorAll(".acts .badge")].map((x) => x.textContent.trim()),
      })));
    })();
    dice(aSchermo.length === 3, "e sono tre anche a schermo", aSchermo.length);

    const statiNelFile = man.map((r) => colonna(r, 2));
    dice(new Set(statiNelFile).size === 3,
      "il file dice tre stati DIVERSI (non la stessa parola tre volte)", statiNelFile);
    dice(!statiNelFile.includes("pianificata"),
      "nessuna riga porta più la parola fissa «pianificata»", statiNelFile);
    /* l'ordine in attesa di un pezzo: a schermo è un badge rosso, e nel file
       deve portare la stessa parola — è il cuore di questo banco */
    const rigaAttesa = man.find((r) => colonna(r, 1).includes("Pompa idraulica"));
    const vocaboloAttesa = colonna(rigaAttesa || "", 2);
    const badgeAttesa = (aSchermo.find((x) => x.nome.includes("Pompa idraulica")) || {}).badge || [];
    dice(badgeAttesa.includes(vocaboloAttesa),
      "«attesa pezzi»: la parola del file è una di quelle che lo schermo mostra",
      { file: vocaboloAttesa, schermo: badgeAttesa });
    dice(vocaboloAttesa !== "" && vocaboloAttesa !== "pianificata",
      "e non è la parola tranquilla su una macchina ferma ad aspettare un pezzo", vocaboloAttesa);
    /* le ore raggruppate come le scrive lo schermo (6.000, non 6000) */
    const rigaOre = man.find((r) => colonna(r, 1).includes("Tagliando"));
    dice(/6\.000/.test(colonna(rigaOre || "", 3)),
      "le ore escono raggruppate come a schermo", colonna(rigaOre || "", 3));

    /* ⛔ E NELLO STESSO FOGLIO, LE RIGHE DEL MAGAZZINO: un pezzo senza soglia
       minima usciva «ok» con accanto «soglia min 0». La soglia che manca è
       una decisione dichiarata e provata dal 30/07 (`parseRicambiCsv`: «una
       soglia inventata fa suonare un allarme che nessuno ha chiesto, oppure
       lo tace»), e qui veniva inventata. Le parole si prendono dalla
       SCHERMATA del magazzino, nello stesso istante. */
    const ric = f.righe.filter((r) => r.startsWith("ricambio;"));
    const magazzino = await (async () => {
      await pg.click("#nav-man").catch(() => {});
      await pg.waitForTimeout(500);
      return pg.evaluate(() => [...document.querySelectorAll("#ric-list .item")].map((el) => ({
        nome: (el.querySelector(".name") || {}).textContent || "",
        badge: [...el.querySelectorAll(".acts .badge")].map((x) => x.textContent.trim().toLowerCase()),
        meta: (el.querySelector(".meta") || {}).textContent || "",
      })));
    })();
    dice(ric.length === magazzino.length && ric.length === 2,
      "i due ricambi ci sono nel file e a schermo", { file: ric.length, schermo: magazzino.length });
    for (const riga of ric) {
      const nome = colonna(riga, 1);
      const aVideo = magazzino.find((x) => x.nome.trim() === nome.trim());
      if (!aVideo) { dice(false, `«${nome}» a schermo non c'è: NON MISURATO`, magazzino.map((x) => x.nome)); continue; }
      dice(aVideo.badge.includes(colonna(riga, 2).toLowerCase()),
        `«${nome}»: la parola del file è quella della pastiglia`,
        { file: colonna(riga, 2), schermo: aVideo.badge });
    }
    /* la prova che conta è la COPPIA: da sola, una riga senza soglia non
       distingue «lo dichiara» da «dice sempre la stessa cosa» */
    const senzaSoglia = ric.find((r) => colonna(r, 1).includes("Cinghia"));
    dice(!/soglia min 0\b/.test(colonna(senzaSoglia || "", 3)),
      "il pezzo senza soglia non porta più la soglia inventata «soglia min 0»", colonna(senzaSoglia || "", 3));
    dice(colonna(senzaSoglia || "", 2) !== "ok",
      "e la sua colonna di stato non è la parola tranquilla «ok»", colonna(senzaSoglia || "", 2));
    const conSoglia = ric.find((r) => colonna(r, 1).includes("Filtro olio"));
    dice(/soglia min 1\b/.test(colonna(conSoglia || "", 3)),
      "mentre dove la soglia c'è si scrive, com'è sempre stato", colonna(conSoglia || "", 3));
  }
}

/* ═══════ 1b · i fermi: la colonna «stato» che sapeva dire due cose su tre ═══════
   `durataFermo` risponde «ancora fermo», «chiuso» e — quando una delle due
   date non si legge — `giorni: null`, che sullo schermo è la pastiglia «data
   non valida». Il file quella terza risposta non ce l'aveva: usciva
   **«chiuso»** con la colonna dei giorni **vuota**, cioè un episodio concluso
   a zero giornate perse esattamente dove lo schermo grida.
   ⚠️ Il confronto è con la SCHERMATA, non con una parola scritta qui dentro. */
console.log("\n════════ flotta-fermi-macchina.csv · la terza risposta ════════");
if (await vaiA("nav-mez", "page-mez")) {
  const f = await scarica("btn-fer-csv");
  dice(!!f, "il file dei fermi esce davvero");
  if (f) {
    const aVideo = await pg.evaluate(() => [...document.querySelectorAll("#fer-list .item")].map((el) => ({
      nome: (el.querySelector(".name") || {}).textContent || "",
      badge: [...el.querySelectorAll(".acts .badge")].map((x) => x.textContent.trim().toLowerCase()),
    })));
    const illeggibili = aVideo.filter((x) => x.badge.some((b) => b.includes("data non valida")));
    /* ⛔ LA PRECONDIZIONE, DICHIARATA: se i due fermi con la data storta non
       sono a schermo la domanda non ha senso, e allora il banco NON accusa —
       dice «non misurato» ed esce diverso da zero. Un soggetto non misurato
       non è un soggetto a posto. */
    dice(illeggibili.length === 2,
      "PRECONDIZIONE: i due fermi con la data illeggibile sono a schermo",
      aVideo.map((x) => x.badge.join("/")));
    if (illeggibili.length === 2) {
      const righe = f.righe.slice(1).filter(Boolean);
      const conGiorniVuoti = righe.filter((r) => colonna(r, 4) === "");
      dice(conGiorniVuoti.length === 2,
        "e nel file due righe hanno la colonna dei giorni vuota", righe.map((r) => colonna(r, 4)));
      const statiVuoti = conGiorniVuoti.map((r) => colonna(r, 5));
      dice(statiVuoti.every((s) => s !== "chiuso"),
        "nessuna di quelle righe si dichiara «chiuso»: senza giorni non si è chiuso niente", statiVuoti);
      dice(statiVuoti.every((s) => aVideo.some((x) => x.badge.includes(s.toLowerCase()))),
        "e la parola del file è quella che lo schermo mostra sulla stessa riga",
        { file: statiVuoti, schermo: aVideo.map((x) => x.badge).flat() });
      /* la coppia: le righe leggibili devono dire ancora le due parole di
         sempre, se no la prova passerebbe anche con un file che dice
         «data non valida» dappertutto */
      const statiSani = righe.filter((r) => colonna(r, 4) !== "").map((r) => colonna(r, 5));
      dice(statiSani.length > 0 && statiSani.every((s) => s === "ancora fermo" || s === "chiuso"),
        "e i fermi leggibili dicono ancora «ancora fermo» / «chiuso»", statiSani);
    }
  }
}

// ═══════════ 2 · i giri macchina: l'esito del controllo ═══════════
console.log("\n════════ flotta-giri-macchina.csv ════════");
if (await vaiA("nav-giro", "page-giro")) {
  const f = await scarica("btn-giro-csv");
  dice(!!f, "il file esce davvero");
  if (f) {
    const righe = f.righe.slice(1);
    dice(righe.length === 2, "i due giri sono nel file", righe.length);
    const muto = righe.find((r) => colonna(r, 1).includes("D3"));
    dice(!!muto, "il giro che dichiara anomalie senza elencarle è nel file");
    if (muto) {
      dice(colonna(muto, 5) !== "tutto a posto",
        "un giro con due anomalie dichiarate NON esce «tutto a posto»", colonna(muto, 5));
      dice(colonna(muto, 6) === "2",
        "e le due anomalie si contano anche se non si sanno chiamare per nome", colonna(muto, 6));
      dice(/non registrat/i.test(colonna(muto, 7)),
        "il file dichiara che il dettaglio delle voci non c'è, invece di lasciare la cella vuota",
        colonna(muto, 7));
    }
    const pieno = righe.find((r) => colonna(r, 1).includes("E2"));
    if (pieno) dice(/Freni/.test(colonna(pieno, 7)),
      "e il giro che le voci ce le ha continua a nominarle", colonna(pieno, 7));
  }
}

// ═══════════ 3 · il registro interventi: la cella dell'importo ═══════════
console.log("\n════════ flotta-registro-interventi.csv ════════");
if (await vaiA("nav-man", "page-man")) {
  const f = await scarica("btn-int-csv");
  dice(!!f, "il file esce davvero");
  if (f) {
    const righe = f.righe.slice(1);
    const cella = (titolo) => colonna(righe.find((r) => colonna(r, 1).includes(titolo)) || "", 4);
    dice(righe.length >= 3, "gli interventi sono nel file", righe.length);
    dice(cella("Sostituzione filtro") === "120", "un costo scritto esce com'è", cella("Sostituzione filtro"));
    /* ⛔ i due casi che il difetto confondeva, e che vanno letti INSIEME:
       senza la coppia, «0» e «vuoto» sembrano la stessa scelta */
    dice(cella("garanzia") === "0", "uno ZERO scritto resta zero: una riparazione in garanzia costa davvero zero",
      cella("garanzia"));
    dice(cella("Registrazione cingoli") === "",
      "un costo MAI scritto lascia la cella vuota: in un foglio uno zero si somma credendolo misurato",
      cella("Registrazione cingoli"));
  }
}

// ═══════════ 4 · la lista della spesa: le due incertezze dichiarate ═══════════
console.log("\n════════ flotta-lista-della-spesa.csv ════════");
if (await vaiA("nav-man", "page-man")) {
  /* la proposta non si può fare senza i giorni di consegna: è l'app a dirlo,
     e senza questo passaggio il banco misurerebbe un rifiuto invece di un file */
  await pg.fill("#sco-consegna", "7").catch(() => {});
  await pg.dispatchEvent("#sco-consegna", "change").catch(() => {});
  await pg.waitForTimeout(400);
  const f = await scarica("btn-sco-csv");
  dice(!!f, "il file esce davvero");
  if (f) {
    const intest = f.righe[0].split(";");
    dice(intest.includes("episodi"),
      "c'è la colonna «episodi»: chi riceve il foglio sa su quanti consumi è calcolata la media", intest);
    const riga = f.righe.slice(1).find((r) => colonna(r, 0).includes("Filtro"));
    dice(!!riga && colonna(riga, 7) !== "", "e la colonna è piena", riga && colonna(riga, 7));
    /* il quarto intervento ha la data «30 febbraio», che non esiste: resta
       fuori dal consumo, quindi le quantità sono un MINIMO — e il file lo dice */
    const avviso = f.righe.find((r) => /fuori dal conto/i.test(r));
    dice(!!avviso, "il file dichiara gli interventi rimasti fuori dal conto", f.righe.slice(-1));
    dice(!!avviso && /MINIMO/.test(avviso), "e dice da che parte tira l'errore", avviso);
  }
}

/* ═══════════ 5-9 · gli altri cinque documenti ═══════════
   ⛔ QUI CI SI ASPETTA DI NON TROVARE NIENTE, ED È PROPRIO PER QUESTO CHE SI
   APRONO. Il cantiere che ha letto il codice li aveva dichiarati puliti, con
   la riga citata — ma su cinque app il censimento **statico** su questa stessa
   domanda aveva dato **zero** mentre i difetti c'erano: il modo di misurarlo
   non è leggere, è premere il bottone e aprire il file. Un negativo misurato
   vale quanto un difetto; un negativo dedotto non vale niente.
   Le prove qui sotto non ripetono per ognuno tutta la famiglia: chiedono le
   due cose che in Flotta sono già morse — che il file non sia vuoto quando lo
   schermo mostra righe, e che **nessuna cella tranquilla** (uno `0` o una
   parola fissa) stia dove il dato non c'è. */
const CONVENZIONI = [
  ["flotta-fermi-macchina.csv", "nav-mez", "page-mez", "btn-fer-csv"],
  ["flotta-scadenze-di-legge.csv", "nav-sca", "page-sca", "btn-sca-csv"],
  ["flotta-costi.csv", "nav-cos", "page-cos", "btn-cos-csv"],
  ["flotta_ricambi.csv", "nav-man", "page-man", "btn-ric-export"],
];
for (const [nome, nav, pagina, bottone] of CONVENZIONI) {
  console.log(`\n════════ ${nome} ════════`);
  if (!(await vaiA(nav, pagina))) continue;
  const f = await scarica(bottone);
  dice(!!f, "il file esce davvero");
  if (!f) continue;
  dice(f.righe.length >= 2, "e non è la sola intestazione", f.righe.length);
  /* ⚠️ La domanda è sulle celle, non sulle righe: uno zero SCRITTO è un dato
     (una spesa di zero euro, zero giorni di fermo), quindi non si può
     accusare uno `0` a vista. Quello che si pretende è più stretto e più
     onesto: che il file non contenga la parola `undefined` né `null` né `NaN`
     — le tre firme di un dato mancante scritto come se fosse un valore. */
  const male = f.righe.filter((r) => /(^|;)"?(undefined|null|NaN)"?(;|$)/.test(r));
  dice(male.length === 0, "nessuna cella dice «undefined», «null» o «NaN»", male.slice(0, 2));
  dice(!/\bundefined\b/.test(f.righe.join("\n")),
    "e nemmeno dentro una frase composta", (f.righe.find((r) => /undefined/.test(r)) || "").slice(0, 120));
}

console.log("\n════════ libretto-<mezzo>.csv ════════");
if (await vaiA("nav-mez", "page-mez")) {
  /* il libretto vive nella scheda di UN mezzo: si apre la prima */
  await pg.evaluate(() => {
    const r = document.querySelector("#mez-list .item [data-scheda-mezzo]");
    if (r) r.click();
  });
  await pg.waitForTimeout(600);
  const aperta = await pg.evaluate(() => {
    const el = document.getElementById("page-sch");
    return !!el && getComputedStyle(el).display !== "none";
  });
  dice(aperta, "la scheda del mezzo si è aperta");
  if (aperta) {
    const f = await scarica("btn-sch-csv");
    dice(!!f, "il libretto esce davvero");
    if (f) {
      dice(f.righe.length >= 2, "e non è la sola intestazione", f.righe.length);
      dice(!/\bundefined\b/.test(f.righe.join("\n")), "nessun «undefined» nel libretto");
      /* il libretto è il documento che questa app cura di più: dichiara i
         vuoti a parole invece di lasciarli vuoti. Si pretende che almeno una
         di quelle dichiarazioni ci sia, se no vuol dire che il caso non è
         stato costruito e la prova non sta guardando niente. */
      const dichiara = f.righe.filter((r) => /nessun|non registrat|non scritto|non calcolabile/i.test(r)).length;
      dice(dichiara > 0, "e i vuoti li dichiara a parole invece di lasciarli in bianco", dichiara);
    }
  }
}

await b.close(); srv.close();
/* ⛔ IL SILENZIO HA DUE CAUSE OPPOSTE, E VANNO SEPARATE. «Frase mostrata senza
   un conto» dice qualcosa sul PRODOTTO; «nessun posto dove dirla» direbbe che
   il selettore non guarda dove crede, cioè una cosa sul RIGHELLO. Contarle
   insieme fa passare la seconda per la prima — misurato l'08/08 su Genesi,
   dove stavo per allargare un selettore che invece funzionava. */
console.log(`  ·  frasi di riepilogo confrontate col file: ${fraseConNumero}`
  + ` · MOSTRATE ma senza un conto: ${fraseSenzaNumero}`
  + ` · il posto per dirla c'è e resta MUTO: ${fraseMuta}`
  + ` · nessun posto per dirla (sarebbe il righello): ${senzaPosto}`);
console.log(`\nRisultato documenti che escono da Flotta: ${ok} passati, ${ko} falliti`
  + `  ·  9 punti d'uscita su 9 aperti`);
/* ⛔ In controprova il rosso è quello VOLUTO: si esce 0 se il banco ha saputo
   distinguere, cioè se almeno una prova è caduta. */
if (CONTROPROVA) {
  console.log(ko > 0 ? "✔ CONTROPROVA: il banco distingue (i KO qui sopra sono voluti)"
                     : "⛔ CONTROPROVA: NON DISTINGUE — rimessi i difetti, nessuna prova è caduta");
  process.exit(ko > 0 ? 0 : 1);
}
process.exit(ko > 0 ? 1 : 0);
