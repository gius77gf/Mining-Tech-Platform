/* I DOCUMENTI CHE ESCONO DA SCUDO — provati premendo il bottone e aprendo il
   file, non leggendo il codice.
   ────────────────────────────────────────────────────────────────────────
   Uso:
     node scudo-documenti.mjs [--porta=8730]
     node scudo-documenti.mjs --controprova   (rimette TUTTI i difetti: DEVE fallire)
     node scudo-documenti.mjs --controprova --difetti=13,16   (solo quelli)
     node scudo-documenti.mjs --live          (Scudo crede di essere in produzione:
                                               i due fogli devono uscire PULITI)
     node scudo-documenti.mjs --dimmi         (stampa i file interi)

   PERCHÉ ESISTE. Le prove `node` chiamano il modulo; i FILE li compone la
   pagina, e lì non guardava nessuno — è il posto misurato il 03/08 in cinque
   app su cinque. I difetti che questo banco tiene chiusi sono tutti della
   stessa famiglia: **il documento era più tranquillo dello schermo**. Quattro
   CSV, e i due FOGLI STAMPABILI (il verbale DPI e la cartella).

   1. AZIONI CORRETTIVE. Il file portava `stato` (aperta/in corso/chiusa) e la
      data, e basta: un'azione «aperta» scaduta da 34 giorni usciva scritta
      identica a una che scade fra un anno, e una senza entro-quando usciva con
      la cella vuota — a schermo, sulla stessa riga, c'è la pastiglia rossa
      «Scaduta» e la scritta «senza data». Il responsabile mancante era una
      cella vuota, che in un foglio si legge «non serve»; a schermo è
      «responsabile da assegnare».
   2. PERSONALE E SCADENZE. Chi non ha NEMMENO UNA riga in scadenzario nel file
      c'era (quel difetto era già stato evitato) ma con le ultime tre celle
      BIANCHE, in mezzo a righe che dicono «regolare» e «scaduta». Lo schermo
      su quella persona scrive la pastiglia gialla «Nessuna scadenza» e in
      testata «non è «a posto», è una persona di cui non si sa niente».
   3. RIEPILOGO L. 198/2025. Sotto la soglia `MIN_TENDENZA` la pagina si
      RIFIUTA di disegnare le classifiche («disegnarla sarebbe una bugia») e il
      file le scriveva in fila senza una parola; e con zero segnalazioni nella
      finestra scriveva `0` senza dire quante ce ne sono nello storico.
   4. REGISTRO INFORTUNI. La prognosi ancora aperta usciva come cella vuota
      nella colonna dei giorni — giusto, non è uno zero — ma senza dirlo: in un
      foglio di calcolo una cella vuota in quella colonna si legge «zero
      giorni», che è di nuovo il numero tranquillo che la decisione 17 esisteva
      per togliere.
   5. VERBALE DPI. La colonna «Sostituire entro» ri-decideva invece di leggere
      lo stato della riga: una maschera da sostituire dal 2020 usciva stampata
      come una valida fino al 2099.
   6. CARTELLA DEL LAVORATORE. La riga di chiusura guardava solo le sezioni
      SENZA righe (`completa`), quindi cinque cartelle su sette chiudevano in
      grigio con «Tutte le sezioni contengono dati registrati» mentre dentro
      c'era una visita medica scaduta e un DPI da sostituire. E il documento
      collegato usciva col titolo e una cella bianca: lo stato — quello che
      nell'elenco dei Documenti è una pastiglia — non c'era.
   7. LA DIMOSTRAZIONE NON DICHIARATA (06/08). Il difetto più grosso dei due
      fogli, e non stava nei numeri: stava in ciò che NON c'era scritto. In
      modalità tour lo schermo dichiara due volte che i dati sono d'esempio —
      la fascia `#tour-banner` e la riga `#mode-note` — e la stampa le nasconde
      TUTT'E DUE, perché `.tour-banner` e `.page` stanno nell'elenco di ciò che
      è comando e non documento. Misurato in `emulateMedia({media:"print"})`
      PRIMA della correzione: `#tour-banner` a `display:none`, `#mode-note`
      alto 0 px e fuori da `body.innerText`, e nel foglio zero occorrenze di
      «esempio», «tour» o «dimostrazione». Cioè: un verbale di dimostrazione
      con il nome di una persona, le date, le righe per le firme e il timbro
      dell'art. 77 si porta a un controllo e niente lo distingue da uno vero.
      Adesso la dichiarazione sta DENTRO `#verbale`, che è l'unica cosa che la
      stampa lascia in piedi, e ci arriva da un punto solo (`scriviFoglio`).
   8. E SA TACERE. Un avviso che compare sempre non lo legge più nessuno, e
      «DATI DI ESEMPIO» stampato sulla cartella vera di un lavoratore vero
      sarebbe il difetto opposto e più costoso. `--live` fa credere a Scudo di
      essere in produzione e pretende i due fogli PULITI: senza quel giro il
      banco avrebbe provato solo che l'avviso sa comparire, mai che sa stare
      zitto.

   ⛔ I CASI SI COSTRUISCONO NEI DATI SERVITI, non nel file su disco: accanto
   ci sono cantieri che scrivono e un giro del browser può partire in qualunque
   momento. Il server qui sotto appende in coda a `scudo-data.js` le righe che
   montano i casi; il repo non si tocca.
   ⛔ E LE DATE DEI CASI SI CALCOLANO AL CARICAMENTO, non si scrivono: la
   dimostrazione ha date assolute, quindi un banco che si fidasse di loro
   misurerebbe cose diverse a seconda del giorno in cui gira. */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
const PORTA = Number((process.argv.find((a) => a.startsWith("--porta=")) || "").split("=")[1]) || 8730;
const CONTROPROVA = process.argv.includes("--controprova");
const DIMMI = process.argv.includes("--dimmi");

/* I CASI. `scudoData()` in demo fa `JSON.parse(JSON.stringify(DEMO))`, quindi
   basta mutare l'oggetto al caricamento del modulo. */
const CASI = `
/* ── casi montati dal banco scudo-documenti.mjs (mai sul disco) ── */
{
  const gg = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  /* NEAR-MISS: si toglie quello che la dimostrazione ha (date assolute) e se ne
     mettono TRE dentro la finestra dei 90 giorni — sotto MIN_TENDENZA, quindi
     la pagina non disegna le classifiche — e QUATTRO fuori, così il file deve
     dire tutt'e due le cose: come va letto, e quanti sono nello storico. */
  DEMO.infortuni = DEMO.infortuni.filter((x) => x.tipo !== "near-miss");
  /* ⛔ E LE TRE DENTRO IL PERIODO NON SONO UGUALI: due portano la GRAVITÀ
     POTENZIALE («e se fosse andata male?») e la terza no, ed è in un luogo
     tutto suo. Serve a mettere nel file, insieme, i tre casi che quella
     funzione esiste per tenere separati: un episodio che poteva finire male,
     uno che sarebbe finito con poco, e uno di cui NESSUNO ha detto niente —
     più un luogo in cui non è stato valutato nulla, che non è un luogo
     sicuro. Senza la terza, il documento non avrebbe mai un «non valutato» da
     dichiarare, e la difesa resterebbe non misurata. */
  const nmCasi = [
    [10, "fronte", "fronte Est",  "mortale"],
    [20, "fronte", "fronte Est",  "lieve"],
    [30, "impianto", "impianto",  null],
  ];
  for (const [i, [n, lt, lg, pot]] of nmCasi.entries())
    DEMO.infortuni.push({ id: "znmd" + i, tipo: "near-miss", data: gg(n), gravita: "lieve",
      categoria: "caduta-massi", luogoTipo: lt, descrizione: "Segnalazione dentro il periodo", luogo: lg,
      ...(pot ? { gravitaPotenziale: pot } : {}) });
  for (const [i, n] of [400, 401, 402, 403].entries())
    DEMO.infortuni.push({ id: "znmf" + i, tipo: "near-miss", data: gg(n), gravita: "lieve",
      categoria: "mezzi", luogoTipo: "pista", descrizione: "Segnalazione fuori periodo", luogo: "pista principale" });
  /* AZIONI: i quattro casi del semaforo, tutti deterministici. */
  DEMO.azioni.push({ id: "zscad", descrizione: "Rifare l'arginello della pista di risalita",
    responsabileId: "d3", scadenza: "2020-01-01", stato: "aperta" });
  DEMO.azioni.push({ id: "zsenza", descrizione: "Rivedere il piano di emergenza dopo la modifica del piazzale",
    responsabileId: null, scadenza: null, stato: "aperta" });
  DEMO.azioni.push({ id: "zimposs", descrizione: "Sostituire la rete paramassi del fronte Nord",
    responsabileId: "d3", scadenza: "2026-13-45", stato: "aperta" });
  DEMO.azioni.push({ id: "zreg", descrizione: "Verifica annuale delle funi del carroponte",
    responsabileId: "d3", scadenza: "2099-12-31", stato: "aperta" });
  /* Una scadenza il cui campo data non è mai stato scritto: nel file usciva
     con la PAROLA «undefined». Va ad Anna Neri (d4); Sara Conti (d7) resta la
     persona senza NEMMENO una riga. */
  DEMO.scadenze.push({ id: "zundef", lavoratoreId: "d4", tipo: "Corso", descrizione: "Preposto — aggiornamento" });
  /* Due scadenze rimaste SENZA la loro persona (tolta dall'anagrafica): l'id
     c'è ma non trova nessuno. La modale che toglie una persona promette che
     «resteranno in elenco come scadenze aziendali: non vanno perse». */
  DEMO.scadenze.push({ id: "zorf1", lavoratoreId: "d99", tipo: "Corso",
    descrizione: "Antincendio della persona tolta dall'anagrafica", dataScadenza: "2020-06-01" });
  DEMO.scadenze.push({ id: "zorf2", lavoratoreId: "d99", tipo: "Visita medica",
    descrizione: "Visita medica della persona tolta dall'anagrafica", dataScadenza: "2020-05-01" });
  /* DPI di Anna Neri (d4): i tre casi della colonna «Sostituire entro» del
     verbale — una in corso, una SCADUTA da due anni, una senza data. */
  DEMO.dpi.push({ id: "zdpiok", lavoratoreId: "d4", tipo: "elmetto", modello: "Elmo Z",
    taglia: "U", dataConsegna: "2026-06-01", scadenza: "2099-06-01" });
  DEMO.dpi.push({ id: "zdpiscad", lavoratoreId: "d4", tipo: "maschera", modello: "FFP3 X",
    taglia: "M", dataConsegna: "2020-01-10", scadenza: "2020-07-10", addestramento: false });
  DEMO.dpi.push({ id: "zdpisenza", lavoratoreId: "d4", tipo: "otoprotettori", modello: "Cuffie Y",
    taglia: "U", dataConsegna: "2021-03-01", addestramento: false });
  /* CARTELLA. Anna Neri (d4) ha mansione, scadenze e DPI: la sua cartella è
     COMPLETA — e dentro ha una maschera da sostituire dal 2020, due
     addestramenti da fare e una scadenza senza data. È il caso esatto del
     difetto: completa non vuol dire in regola.
     Le si aggiunge un documento collegato di cui NESSUNO ha scritto lo stato:
     nell'elenco dei Documenti la pastiglia dice «Stato non indicato», sul
     foglio la riga usciva col titolo e una cella bianca. */
  DEMO.documenti.push({ id: "zdoc", titolo: "Attestato antincendio da archivio cartaceo",
    tipo: "Altro", lavoratoreId: "d4", meta: "", stato: "" });
  DEMO.nomine.push({ id: "znom", ruolo: "antincendio", lavoratoreId: "d4", dal: null, al: null, note: "" });
}
`;

/* LA CONTROPROVA rimette i difetti nella PAGINA servita (e, dal 03/08, anche
   nel MODULO servito: la frase che chiude la cartella la scrive lui), uno per
   difetto, e conta le sostituzioni: un `replace` che non trova niente esce in
   silenzio e dichiara riuscita una prova mai partita.
   Terzo elemento della riga = il file da toccare; assente vuol dire la pagina. */
const PAGINA = "apps/scudo/index.html", MODULO = "apps/scudo/scudo-data.js";
/* Dal 06/08 c'è un terzo soggetto d'iniezione: la DECISIONE «questi dati sono
   veri?», che è salita in `shared/` perché era scritta in quattro varianti
   dentro quattro pagine. Il vestito (riquadro, CSS, e soprattutto la frase che
   dice la conseguenza per QUEL foglio lì) è rimasto in Scudo, ed è giusto: un
   verbale si fa firmare, una cartella si tiene agli atti. */
const CONDIVISO = "shared/deepwork-id-client/dw-shell.js";
const DIFETTI = [
  // 1a. l'intestazione delle azioni senza la colonna del semaforo
  ['let csv = "descrizione;responsabile;scadenza;semaforo;stato;esito;dataChiusura;origine\\n";',
   'let csv = "descrizione;responsabile;scadenza;stato;esito;dataChiusura;origine\\n";'],
  // 1b. la riga senza `statoAzione`, e il responsabile mancante come cella vuota
  ['const nome = (id) => { const l = LAV.find(x => x.id === id); return l ? l.nome : "da assegnare"; };',
   'const nome = (id) => { const l = LAV.find(x => x.id === id); return l ? l.nome : ""; };'],
  ["${a.scadenza || \"\"};${statoAzione(a)};${a.stato || \"aperta\"}", "${a.scadenza || \"\"};${a.stato || \"aperta\"}"],
  // 2. la persona senza nemmeno una riga, con la cella `stato` bianca
  ['${csvCell(idn)};;;${SENZA}\\n`;', '${csvCell(idn)};;;\\n`;'],
  // 3. il riepilogo L.198 senza lo storico e senza la nota di lettura
  ['csv += `totale;near-miss nello storico (fuori periodo compresi);${r.totaleStorico}\\n`;', ""],
  ['{ const nota = descriviLetturaNearMiss(r);\n      if (nota) csv += `lettura;${csvCell(nota)};\\n`; }', ""],
  // 4. il registro infortuni senza la colonna che dice la prognosi aperta
  ['let csv = "data;tipo;gravita;giorniAssenza;descrizione;luogo;nota\\n";',
   'let csv = "data;tipo;gravita;giorniAssenza;descrizione;luogo\\n";'],
  ['${csvCell(x.luogo||"")};`\n        + `${prognosiAperta(x) ? "prognosi ancora aperta: le giornate di assenza non sono ancora contate" : ""}\\n`;',
   '${csvCell(x.luogo||"")}\\n`;'],
  /* 5. l'ordine del file delle azioni: `scadenza || ""` mandava in TESTA — cioè
        nel posto delle più urgenti — chi la data non ce l'ha, e mescolava le
        chiuse alle aperte. */
  ['AZI.slice().sort((x, y) => (x.stato === "chiusa") - (y.stato === "chiusa")\n        || String(x.scadenza || "9999").localeCompare(String(y.scadenza || "9999")))',
   'AZI.slice().sort((x, y) => String(x.scadenza || "").localeCompare(String(y.scadenza || "")))'],
  // 6. la data mai scritta che usciva come la PAROLA «undefined»
  ['${csvCell(s.descrizione)};${s.dataScadenza || ""};${statoScadenza(s.dataScadenza)}\\n`;\n    }',
   '${csvCell(s.descrizione)};${s.dataScadenza};${statoScadenza(s.dataScadenza)}\\n`;\n    }'],
  /* 8. il secondo giro che chiedeva «non è di nessuno?» invece di «non è di
        nessuno di QUESTI?»: le scadenze della persona tolta sparivano. */
  ['const noti = new Set(LAV.map(l => l.id));\n    for (const s of SCA.filter(x => !noti.has(x.lavoratoreId)))',
   'for (const s of SCA.filter(x => !x.lavoratoreId))'],
  /* 7. la colonna «Sostituire entro» del VERBALE che ri-decideva invece di
        leggere `r.stato`: una maschera da sostituire da anni stampata come una
        valida fino al 2099. */
  ['${\n          c.nonScade === true ? "non scade (dichiarato)"\n          : r.stato === "senza data" ? "non indicata"\n          : fmtData(c.scadenza) + (r.stato === "scaduta" ? " — DA SOSTITUIRE"\n                                 : r.stato === "in-scadenza" ? " — da sostituire a breve" : "")}',
   '${c.scadenza ? fmtData(c.scadenza) : (c.nonScade === true ? "non scade (dichiarato)" : "non indicata")}'],
  /* ── LA CARTELLA DEL LAVORATORE (03/08) ────────────────────────────────
    13. la riga del documento collegato senza il suo stato: sul foglio usciva
        titolo + `meta` (testo libero, spesso vuoto) e basta. */
  ['c.documenti.map(d => { const e = etichettaStatoDocumento(d.stato);\n            return riga(d.titolo, (e.valido ? "" : "<b>") + esc(e.label) + (e.valido ? "" : "</b>")\n              + (d.meta ? " · " + esc(d.meta) : "")); })',
   'c.documenti.map(d => riga(d.titolo, esc(d.meta || "")))'],
  // 14. il colore della riga di chiusura deciso solo dalle sezioni vuote
  ['${c.completa && !c.daSistemare.length ? "color:#555;" : "color:#8a0000;font-weight:600;"}',
   '${c.completa ? "color:#555;" : "color:#8a0000;font-weight:600;"}'],
  // 15. la finestra prima di stampare che non dice che cosa si troverà dentro
  ['      + (c.daSistemare.length\n        ? "<br><br>⚠️ <b>Completa non vuol dire in regola:</b> fra le righe registrate ce ne sono che non lo sono — "\n          + esc(c.daSistemare.join(", ")) + ". Il foglio le riporta una per una."\n        : "")\n', ""],
  /* 16. LA CODA DELLA FRASE, che sta nel MODULO: senza, un fascicolo con
         dentro una visita medica scaduta chiude con «Tutte le sezioni …
         contengono dati registrati». */
  ['  const coda = guai.length\n    ? " ⚠️ E non tutto quello che è registrato è in regola: " + guai.join(", ")\n      + ". Una cartella completa non è una cartella in regola: queste righe il foglio le riporta una per una."\n    : "";',
   "  const coda = \"\";", MODULO],
  /* ── IL PROMEMORIA CHE SI MANDA AL LAVORATORE (03/08) ──────────────────
    17. il riepilogo per persona con TRE risposte su quattro: chi ha solo
        scadenze senza data usciva con la pastiglia gialla «In scadenza». */
  ['      const st = statoPeggioreScadenze(sue);\n      const bg = st ? B[st] : ["warn", "Nessuna scadenza"];',
   '      const st = prob.some(s => statoScadenza(s.dataScadenza) === "scaduta") ? "scaduta" : (prob.length ? "in-scadenza" : "regolare");\n      const bg = sue.length ? B[st] : ["warn", "Nessuna scadenza"];'],
  /* 18. la guardia che guardava COM'È SCRITTO il dato: col campo data mai
         scritto il promemoria non si preparava, e la pagina dava un motivo
         falso — mentre sulla data ILLEGGIBILE, che a schermo è lo stesso
         stato, usciva regolarmente. */
  ["  if (!nome) return null;", "  if (!nome || !sc.dataScadenza) return null;", MODULO],
  /* ── LA DIMOSTRAZIONE DICHIARATA SUI DUE FOGLI (06/08) ─────────────────
    19. IL BUCO NELLA SUA FORMA PIÙ SEMPLICE: il foglio esce senza la
        dichiarazione. È lo stato in cui Scudo era prima del 06/08. */
  ['  const scriviFoglio = (frase, html) => { $("verbale").innerHTML = avvisoEsempio(frase) + html; };',
   '  const scriviFoglio = (frase, html) => { $("verbale").innerHTML = html; };'],
  /* 20. IL BUCO NELLA SUA FORMA VERA, che è più insidiosa: la dichiarazione
        c'è nel DOM, ma sta dove la stampa non la fa uscire. È esattamente
        quello che succedeva con `#tour-banner` e `#mode-note`, e una prova
        scritta su `textContent` passerebbe lo stesso. Qui si riproduce con la
        via più corta — la regola di stampa spenta — e a prenderlo devono
        essere `innerText` in `emulateMedia({media:"print"})` e lo stile
        calcolato, non il sorgente. */
  ["  body.stampa-verbale #verbale .esempio{\n    border:2pt solid #14121c;",
   "  body.stampa-verbale #verbale .esempio{\n    display:none; border:2pt solid #14121c;"],
  /* 21. LA DICHIARAZIONE GENERICA: c'è, si vede, e non dice che cosa comporta
        per QUEL foglio lì. «Dati di esempio» da solo lo si legge come una nota
        di cortesia; «non va fatto firmare» è un'istruzione. */
  ['? `<div class="esempio"><b>DATI DI ESEMPIO — modalità tour (${esc(m)}).</b> ${frase}</div>`',
   '? `<div class="esempio"><b>DATI DI ESEMPIO — modalità tour (${esc(m)}).</b></div>`'],
  /* 22. UN FOGLIO SOLO DEI DUE dice la sua conseguenza: la cartella passa dal
        punto unico ma con la frase vuota. Serve a pinnare che le prove
        guardano TUTT'E DUE i fogli — un banco che ne legge uno e chiama
        «coperti» tutti e due è il controllo che non guarda dove crede. */
  ['"Questa cartella non riguarda nessun lavoratore reale: non va esibita a un ispettore "\n      + "né tenuta agli atti come fascicolo personale.", `', '"", `'],
  /* 23. LA DECISIONE SPENTA, E DAL 06/08 STA IN UN ALTRO FILE. «Che cosa conta
         come dimostrazione» è salito in `shared/deepwork-id-client/dw-shell.js`
         (era in quattro varianti dentro quattro pagine). Le iniezioni 19-22
         restano nella PAGINA e toccano le chiamate e il vestito; questa tocca
         lo strato sotto, e i due strati devono cadere separatamente — se
         spegnendo la decisione condivisa i fogli continuassero a dichiararsi,
         vorrebbe dire che una copia debole è rinata dentro Scudo.
         ⛔ È anche la difesa contro la quarta delle cinque cause di CLAUDE.md:
         un'iniezione lasciata a mirare il posto vecchio non fallisce, dice
         «MANCATA» in una riga di log e lascia il banco verde. */
  ['  return modo === "live" ? null : String(modo || "non dichiarata");',
   "  return null;", CONDIVISO],
  /* ── LA GRAVITÀ POTENZIALE NEL FILE (06/08) ────────────────────────────
    24. IL CONTEGGIO PER GRADINO SENZA IL SUO DENOMINATORE. Le righe «se
        andava male: lieve/grave/mortale» da sole sono la cosa che, aperta in
        un foglio di calcolo, diventa una media: chi legge non ha modo di
        sapere che sono calcolate su 2 episodi valutati su 3, né che l'app si
        rifiuta di dire dove il rischio si concentra. È lo stesso difetto del
        punto 3, sulla funzione nuova. */
  ['      csv += `potenziale;near-miss con la gravità potenziale valutata;${rp.valutati}\\n`;\n      csv += `potenziale;near-miss NON valutati;${rp.nonValutati}\\n`;\n      csv += `potenziale;${csvCell(descriviRischioPotenziale(rp))};\\n`;',
   ""],
  /* 25. IL LUOGO IN CUI NESSUNO HA VALUTATO NIENTE, TOLTO DAL FILE. A schermo
        ha una riga sua che dice «non si sa come poteva finire»; sparendo dal
        documento, un luogo non misurato si legge come un luogo senza problemi
        — l'assenza di un dato letta come un dato favorevole, nel foglio che
        va fuori. */
  ['      for (const l of rp.luoghiCiechi)\n        csv += `potenziale;${csvCell(l.etichetta)} — nessun episodio valutato: non si sa come poteva finire;${l.eventi}\\n`; }',
   "       }"],
];

/* ⛔ LA SECONDA DOMANDA: E SU UN FOGLIO VERO LA DICHIARAZIONE NON C'È?
   Le quattro iniezioni qui sopra provano che il banco vede l'avviso quando
   manca. Non provano la cosa opposta, che costa di più: «DATI DI ESEMPIO»
   stampato sulla cartella vera di un lavoratore vero, o sul verbale che si sta
   davvero facendo firmare. `--live` fa credere a Scudo di essere in produzione
   e allora i due fogli devono uscire PULITI: le prove sull'avviso si
   rovesciano.
   ⚠️ Si tocca SOLO la riga dell'avviso: la fascia `#tour-banner` continua a
   guardare `db.mode !== "live"` e resta accesa, ed è la prova che l'app è
   davvero in dimostrazione. Senza quel controllo un foglio pulito si
   scambierebbe per «il banco non ha caricato niente».
   ⚠️ E DAL 06/08 SI INIETTA NELLA PAGINA, NON NELLA DECISIONE CONDIVISA:
   `--live` non è un difetto, è la stessa decisione letta al contrario, e si
   chiede al modo che la pagina PASSA (`db.mode` → `"live"`). Così il giro
   attraversa davvero `modoDimostrazione` di `shared/`; spegnendola dall'interno
   il giro resterebbe verde anche se quella funzione smettesse di saper
   tacere — cioè proverebbe l'opposto di quello che dice di provare. */
const FINGE_LIVE = process.argv.includes("--live");
const COME_LIVE = [
  ["  const avvisoEsempio = (frase) => { const m = modoDimostrazione(db.mode);",
   '  const avvisoEsempio = (frase) => { const m = modoDimostrazione("live");'],
];
if (FINGE_LIVE && CONTROPROVA) {
  console.error("✗ --live e --controprova insieme non vogliono dire niente: il primo pretende i fogli puliti, il secondo li rompe.");
  process.exit(2);
}

let iniezioniCasi = 0;
/* ⚠️ UN INSIEME E NON UN CONTATORE: un file richiesto due volte farebbe
   salire il conto oltre il numero dei difetti, e la riga «12/12 rimessi»
   direbbe una cosa che non è successa. */
const rimessi = new Set();
/* `--difetti=9,12` rimette SOLO quelli, per vedere quale prova cade su quale
   difetto: la controprova a tappeto dice che il banco distingue, non CHE COSA
   distingue, e una prova può cadere per il difetto del vicino. */
const SOLO = ((process.argv.find((a) => a.startsWith("--difetti=")) || "").split("=")[1] || "")
  .split(",").filter(Boolean).map(Number);
/* La lista è DERIVATA dalla modalità, non gemella: `--live` non rimette
   difetti, sposta il confronto di una riga sola. Il conteggio dei soggetti
   toccati resta lo stesso in tutt'e due i casi, perché la trappola è la
   stessa: un `replace` che non trova niente esce in silenzio. */
const listaAttiva = () => (FINGE_LIVE ? COME_LIVE : DIFETTI);
const applica = (t, file) => {
  for (const [i, [da, a, dove]] of listaAttiva().entries()) {
    if ((dove || PAGINA) !== file) continue;
    if (!FINGE_LIVE && SOLO.length && !SOLO.includes(i + 1)) { rimessi.add(i); continue; }
    const n = t.split(da).length - 1;
    if (n !== 1) { console.log(`⛔ INIEZIONE MANCATA (#${i + 1}): ${n} soggetti per «${da.slice(0, 60).replace(/\n/g, "⏎")}…»`); continue; }
    t = t.replace(da, a); rimessi.add(i);
  }
  return t;
};
const TIPI = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const srv = createServer((q, s) => {
  const rotta = decodeURIComponent(q.url.split("?")[0]);
  /* ⛔ IL CONTRASSEGNO COL PROPRIO PID, RILETTO DAL SERVER. Un banco che trova
     la porta occupata e la RIUSA non fallisce: misura la copia di qualcun
     altro e dice cose vere su una cartella che nessuno sta guardando. */
  if (rotta === "/__contrassegno") { s.writeHead(200, { "content-type": "text/plain" }); return s.end(String(process.pid)); }
  let p = join(R, rotta);
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, "index.html");
  if (!existsSync(p)) { s.writeHead(404); return s.end("no"); }
  let corpo = readFileSync(p);
  if (p.endsWith(MODULO)) {
    let t = corpo.toString("utf8");
    if (CONTROPROVA) t = applica(t, MODULO);
    corpo = Buffer.from(t + CASI, "utf8"); iniezioniCasi++;
  }
  if ((CONTROPROVA || FINGE_LIVE) && p.endsWith(PAGINA)) corpo = Buffer.from(applica(corpo.toString("utf8"), PAGINA), "utf8");
  /* il terzo soggetto: la decisione condivisa. Va servita passando da
     `applica` come gli altri due, se no l'iniezione 23 non arriva mai e il
     conto dei difetti rimessi resta sotto — che è il modo silenzioso in cui
     una controprova smette di provare qualcosa. */
  if (CONTROPROVA && p.endsWith(CONDIVISO)) corpo = Buffer.from(applica(corpo.toString("utf8"), CONDIVISO), "utf8");
  s.writeHead(200, { "content-type": TIPI[extname(p)] || "application/octet-stream" });
  s.end(corpo);
});

/* ⛔ UNA PORTA OCCUPATA NON SI RIUSA: si CAMBIA. Qui girano cantieri
   paralleli, quindi si provano dodici porte; poi si RILEGGE DAL SERVER il
   contrassegno col proprio pid, che è la sola prova che chi risponde è mio. */
let porta = 0;
for (let i = 0; i < 12 && !porta; i++) {
  const t = PORTA + i;
  const preso = await new Promise((r) => { srv.once("error", () => r(false)); srv.listen(t, "127.0.0.1", () => r(true)); });
  if (preso) porta = t; else srv.removeAllListeners("error");
}
if (!porta) { console.error(`✗ nessuna porta libera fra ${PORTA} e ${PORTA + 11}: mi fermo invece di misurare la copia di qualcun altro.`); process.exit(2); }
{ const r = await fetch(`http://127.0.0.1:${porta}/__contrassegno`).then((x) => x.text()).catch(() => "");
  if (r !== String(process.pid)) { console.error(`✗ il contrassegno riletto dal server dice «${r}», il mio pid è ${process.pid}: mi fermo.`); process.exit(2); }
  console.log(`porta ${porta} · contrassegno riletto = pid ${process.pid} ✔${CONTROPROVA ? "  · CONTROPROVA" : ""}${FINGE_LIVE ? "  · FINGE LIVE (i due fogli devono uscire PULITI)" : ""}`); }

const { chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs");
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const pg = await b.newPage({ viewport: { width: 430, height: 950 } });
/* I CSV escono da un `<a download>` con un `data:` href: il click vero
   scaricherebbe un file, quindi si intercetta e si legge il contenuto. */
await pg.addInitScript(() => {
  window.__scaricati = [];
  window.print = () => { window.__stampato = (window.__stampato || 0) + 1; };
  const orig = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download) { window.__scaricati.push({ nome: this.download, href: this.href }); return; }
    return orig.apply(this, arguments);
  };
});
const errori = [];
pg.on("pageerror", (e) => errori.push(e.message));
await pg.goto(`http://127.0.0.1:${porta}/apps/scudo/index.html`);
await pg.waitForTimeout(2500);

let ok = 0, ko = 0;
const dice = (c, t, x) => { if (c) { ok++; console.log(`  ok  ${t}`); } else { ko++; console.log(`  KO  ${t}${x !== undefined ? ` -> ${JSON.stringify(x).slice(0, 400)}` : ""}`); } };
/* Le prove sulla dichiarazione «dati di esempio» si ROVESCIANO con `--live`:
   lì il foglio è vero e la riga non ci deve essere. Si rovescia anche il
   TESTO, e scritto a mano invece che con una `replace` sulla frase: un
   riepilogo che stampa «sta in cima al foglio» mentre ha appena verificato il
   contrario è la stessa bugia dello script che dichiara riuscita una prova mai
   partita — solo più difficile da vedere, perché è verde. */
const ATTESO = !FINGE_LIVE;
const diceAvviso = (c, demo, live, x) => dice(c === ATTESO, FINGE_LIVE ? `[live] ${live}` : demo, x);
dice(errori.length === 0, "la pagina non solleva errori", errori.slice(0, 2));
dice(iniezioniCasi > 0, "i casi sono stati montati nel modulo servito", iniezioniCasi);

const apriTutto = async () => {
  for (const acc of await pg.$$(".dc-sec.closed .dc-sec-h, details:not([open]) > summary, .sec.closed .sec-h")) {
    await acc.click({ timeout: 2000 }).catch(() => {}); await pg.waitForTimeout(70);
  }
};
const scarica = async (nav, id) => {
  if (nav) {
    await pg.click("#" + nav).catch(() => {});
    await pg.waitForTimeout(650);
    /* ⛔ LA PROVA DI AVER NAVIGATO. Un banco che misura una schermata che non
       c'è risponde «tutto a posto»: si pretende che la pagina giusta sia
       quella visibile prima di premere. */
    const viva = await pg.evaluate((n) => {
      const pagina = document.getElementById("page-" + n.replace(/^nav-/, ""));
      return !!pagina && getComputedStyle(pagina).display !== "none";
    }, nav);
    if (!viva) return { errore: "non ho navigato a " + nav };
    await apriTutto(); await pg.waitForTimeout(250);
  }
  if (!(await pg.$("#" + id))) return { errore: "bottone assente: " + id };
  await pg.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
  await pg.click("#" + id, { timeout: 4000 }).catch((e) => {});
  await pg.waitForTimeout(400);
  const g = await pg.evaluate(() => { const l = window.__scaricati.slice(); window.__scaricati = []; return l; });
  if (!g.length) return { errore: "nessun file uscito da " + id };
  return { nome: g[0].nome, testo: decodeURIComponent(g[0].href.replace(/^data:text\/csv;charset=utf-8,/, "")) };
};
const righe = (t) => t.split("\n").filter(Boolean);

/* ⛔ COME SI LEGGE UN FOGLIO: in `emulateMedia({media:"print"})`, e con
   `innerText` — non con `textContent`. La differenza È il difetto del 06/08:
   `textContent` risponde anche per ciò che la stampa NASCONDE, quindi una
   prova scritta su di lui direbbe «la dichiarazione c'è» proprio nel caso in
   cui dalla stampante non esce (è l'iniezione 20, ed è la forma che il difetto
   aveva davvero: la riga stava in `#tour-banner`, cioè in un elemento che
   `@media print` spegne).
   Si legge anche lo stato delle DUE dichiarazioni dello SCHERMO: sul foglio
   non arrivano, ed è la misura che dice perché la riga deve stare dentro
   `#verbale` invece che «da qualche parte nella pagina». */
const leggiFoglioStampato = async () => {
  await pg.emulateMedia({ media: "print" });
  await pg.waitForTimeout(250);
  const r = await pg.evaluate(() => {
    const v = document.getElementById("verbale");
    const e = v.querySelector(".esempio");
    const visibile = (el) => {
      if (!el) return false;
      const s = getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden" && el.getBoundingClientRect().height > 0;
    };
    return {
      stampato: (v.innerText || "").replace(/\s+/g, " ").trim(),
      nelDom: (v.textContent || "").replace(/\s+/g, " ").trim(),
      avvisoVisibile: visibile(e),
      avvisoPrimo: !!e && v.firstElementChild === e,
      bannerVisibile: visibile(document.getElementById("tour-banner")),
      modeNoteVisibile: visibile(document.getElementById("mode-note")),
    };
  });
  await pg.emulateMedia({ media: "screen" });
  await pg.waitForTimeout(120);
  return r;
};
/* Le quattro domande valgono per TUTT'E DUE i fogli e si scrivono una volta
   sola: un banco che ne legge uno e chiama coperti tutti e due è il controllo
   che non guarda dove crede. L'ultima cambia per foglio, perché la
   conseguenza di un verbale di consegna e quella di una cartella personale
   sono cose diverse. */
const proveAvviso = (f, chi, conseguenza) => {
  diceAvviso(/DATI DI ESEMPIO/.test(f.stampato),
    `⛔ ${chi}: il foglio che esce dalla stampante dichiara di essere fatto di dati d'esempio`,
    `⛔ ${chi}: su dati veri il foglio NON si dichiara d'esempio`, f.stampato.slice(0, 200));
  diceAvviso(f.avvisoVisibile,
    `⛔ ${chi}: e la dichiarazione si VEDE in stampa, non è solo scritta nel DOM`,
    `⛔ ${chi}: e non c'è nemmeno un riquadro vuoto da vedere`,
    { avvisoVisibile: f.avvisoVisibile, ancheNelDom: /DATI DI ESEMPIO/.test(f.nelDom) });
  diceAvviso(f.avvisoPrimo,
    `${chi}: sta in cima al foglio, prima della testata`,
    `${chi}: il foglio comincia dalla sua testata, senza niente davanti`, f.stampato.slice(0, 90));
  diceAvviso(conseguenza.test(f.stampato),
    `⛔ ${chi}: e dice che cosa comporta per QUESTO foglio, non «dati di esempio» e basta`,
    `⛔ ${chi}: e non porta nessuna delle frasi della dimostrazione`, f.stampato.slice(0, 300));
};

// ── 1 · LE AZIONI CORRETTIVE ───────────────────────────────────────────────
const azi = await scarica("nav-azio", "btn-azi-export");
dice(!azi.errore, "il CSV delle azioni esce", azi.errore);
if (!azi.errore) {
  if (DIMMI) console.log("\n[azioni]\n" + azi.testo + "\n");
  const R2 = righe(azi.testo), intest = R2[0].split(";");
  const col = (n) => intest.indexOf(n);
  const riga = (desc) => (R2.find((r) => r.startsWith(desc)) || "").split(";");
  dice(col("semaforo") >= 0, "c'è la colonna «semaforo», quella che a schermo è la pastiglia", intest);
  dice(riga("Rifare l'arginello")[col("semaforo")] === "scaduta",
    "un'azione APERTA e fuori tempo esce «scaduta», non solo «aperta»", riga("Rifare l'arginello"));
  dice(riga("Rifare l'arginello")[col("stato")] === "aperta", "e l'avanzamento resta la sua colonna", riga("Rifare l'arginello"));
  dice(riga("Rivedere il piano di emergenza")[col("semaforo")] === "senza data",
    "senza entro-quando il semaforo dice «senza data», non regolare", riga("Rivedere il piano di emergenza"));
  dice(riga("Rivedere il piano di emergenza")[col("responsabile")] === "da assegnare",
    "e il responsabile mancante è scritto, non una cella vuota", riga("Rivedere il piano di emergenza"));
  dice(riga("Sostituire la rete paramassi")[col("semaforo")] === "senza data",
    "una data che non esiste («2026-13-45») non passa per una scadenza qualunque", riga("Sostituire la rete paramassi"));
  dice(riga("Verifica annuale delle funi")[col("semaforo")] === "regolare",
    "e una lontana resta regolare", riga("Verifica annuale delle funi"));
  /* l'ordine del file è quello dell'elenco: chiuse in fondo, e chi non ha una
     data in coda invece che in testa (ordinando per `scadenza || ""` finiva
     prima di tutte, cioè nel posto delle più urgenti) */
  const pos = (d) => R2.findIndex((r) => r.startsWith(d));
  dice(pos("Rivedere il piano di emergenza") > pos("Rifare l'arginello"),
    "chi non ha una data non sta in testa al file", [pos("Rifare l'arginello"), pos("Rivedere il piano di emergenza")]);
  dice(pos("Consegna guanti antitaglio") === R2.length - 1, "e le chiuse stanno in fondo", pos("Consegna guanti antitaglio"));
}

// ── 2 · PERSONALE E SCADENZE ───────────────────────────────────────────────
const pers = await scarica("nav-pers", "btn-export-csv");
dice(!pers.errore, "il CSV di personale e scadenze esce", pers.errore);
if (!pers.errore) {
  if (DIMMI) console.log("\n[personale]\n" + pers.testo + "\n");
  const sara = righe(pers.testo).find((r) => r.startsWith("Sara Conti")) || "";
  dice(!!sara, "la persona senza NEMMENO una scadenza è nel file (non sparisce)", sara);
  dice(/nessuna scadenza registrata/.test(sara),
    "e la sua cella «stato» lo dice, invece di restare bianca", sara);
  dice(!/undefined|;null;/.test(pers.testo),
    "una data mai scritta non esce come la parola «undefined»",
    righe(pers.testo).filter((r) => /undefined|null/.test(r)));
  const anna = righe(pers.testo).find((r) => r.startsWith("Anna Neri")) || "";
  dice(/;senza data$/.test(anna), "e quella riga porta lo stato «senza data»", anna);
  /* ⛔ LA SCADENZA CHE HA PERSO LA SUA PERSONA. La modale che toglie un
     lavoratore promette che le sue scadenze «resteranno in elenco come
     scadenze aziendali: non vanno perse», e lo schermo le disegna con
     «azienda»; il file le lasciava fuori — non le reclamava nessun lavoratore
     e il secondo giro chiedeva `!x.lavoratoreId`, che un id sganciato non è. */
  const orfane = righe(pers.testo).filter((r) => /persona tolta dall'anagrafica/.test(r));
  dice(orfane.length === 2, "le scadenze della persona tolta sono nel file (la modale lo promette)", orfane);
  dice(orfane.every((r) => r.startsWith("AZIENDA;")),
    "e ci stanno come aziendali, che è la parola che usa lo schermo", orfane);
  /* la conta del toast e le righe del file devono parlare della stessa cosa */
  const quante = await pg.evaluate(() => (document.getElementById("import-esito").textContent || ""));
  const attese = +(quante.match(/e (\d+) scadenze/) || [0, 0])[1];
  const scritte = righe(pers.testo).length - 1 - righe(pers.testo).filter((r) => /nessuna scadenza registrata/.test(r)).length;
  dice(attese > 0 && attese === scritte,
    "e il numero annunciato («… e N scadenze») è quello delle righe scritte davvero", { attese, scritte, quante });
}

// ── 3 · IL RIEPILOGO PER LA L. 198/2025 ────────────────────────────────────
const nm = await scarica("nav-doc", "btn-nm-export");
dice(!nm.errore, "il CSV del riepilogo near-miss esce", nm.errore);
if (!nm.errore) {
  if (DIMMI) console.log("\n[near-miss]\n" + nm.testo + "\n");
  dice(/totale;near-miss segnalati;3\b/.test(nm.testo), "tre segnalazioni nella finestra", nm.testo);
  dice(/nello storico[^;]*;7\b/.test(nm.testo),
    "e il file dice quante sono NELLO STORICO: 3 nel periodo non è 3 in tutto", nm.testo);
  dice(/^lettura;/m.test(nm.testo), "c'è la riga che dice come va letto", nm.testo);
  dice(/ATTENZIONE alla lettura/.test(nm.testo) && /non una tendenza/.test(nm.testo),
    "e dice che sotto la soglia quelle righe sono un conteggio, non una tendenza", nm.testo);
  /* ⛔ «E SE FOSSE ANDATA MALE?» — e il denominatore accanto al numero.
     Il conteggio per gradino da solo, in un foglio di calcolo, diventa una
     media: chi legge deve trovare nello stesso file su quanti episodi è
     calcolato, quanti non sono valutati, e la frase che dice se quei numeri
     si possono leggere. */
  dice(/potenziale;near-miss con la gravità potenziale valutata;2\b/.test(nm.testo),
    "il file dice quanti near-miss sono valutati", nm.testo);
  dice(/potenziale;near-miss NON valutati;1\b/.test(nm.testo),
    "e quanti NON lo sono: due su tre non è due", nm.testo);
  dice(/se andava male: mortale;1\b/.test(nm.testo) && /se andava male: lieve;1\b/.test(nm.testo),
    "il conteggio per gradino c'è", nm.testo);
  dice(/potenziale;[^;]*sono meno di 5[^;]*;/i.test(nm.testo),
    "e con due valutati il file NON nomina nessuna concentrazione di rischio: lo dice",
    righe(nm.testo).filter((r) => /^potenziale;/.test(r)));
  /* ⛔ e il luogo in cui NESSUNO ha valutato niente non sparisce dal
     documento: un luogo non misurato non è un luogo sicuro. */
  dice(/potenziale;Impianto — nessun episodio valutato[^;]*;1\b/.test(nm.testo),
    "il luogo senza nessuna valutazione ha la sua riga, con la sua parola",
    righe(nm.testo).filter((r) => /^potenziale;/.test(r)));
  dice(!/potenziale;Impianto — episodi che potevano/.test(nm.testo),
    "e NON entra nella classifica per luogo, dove in fondo si leggerebbe come il più tranquillo",
    righe(nm.testo).filter((r) => /^potenziale;/.test(r)));
}

// ── 4 · IL REGISTRO INFORTUNI ──────────────────────────────────────────────
const inf = await scarica(null, "btn-inf-export");
dice(!inf.errore, "il CSV del registro infortuni esce", inf.errore);
if (!inf.errore) {
  if (DIMMI) console.log("\n[registro]\n" + inf.testo + "\n");
  /* ⛔ SI GUARDA LA COLONNA, NON LA RIGA. La prima stesura cercava «prognosi
     ancora aperta» nel TESTO della riga e passava anche con la colonna tolta:
     quelle parole stanno pure nella DESCRIZIONE dell'evento di dimostrazione.
     Il controllo che non guarda dove crede, alla prima esecuzione. */
  const iR = righe(inf.testo), iInt = iR[0].split(";"), iCol = (n) => iInt.indexOf(n);
  const aperta = (iR.find((r) => /Distorsione alla caviglia/.test(r)) || "").split(";");
  dice(aperta.length > 1, "l'infortunio a prognosi aperta è nel registro", aperta);
  dice(iCol("nota") >= 0, "c'è la colonna «nota», in coda per non toccare l'import", iInt);
  dice(aperta[iCol("giorniAssenza")] === "",
    "le sue giornate restano una cella VUOTA, non uno zero (decisione 17)", aperta);
  dice(/^prognosi ancora aperta/.test(aperta[iCol("nota")] || ""),
    "e adesso la colonna dice PERCHÉ è vuota: una cella bianca si legge «zero giorni»", aperta);
  const chiuso = (iR.find((r) => /Taglio alla mano/.test(r)) || "").split(";");
  dice(chiuso[iCol("giorniAssenza")] === "4" && (chiuso[iCol("nota")] || "") === "",
    "un infortunio chiuso porta i suoi giorni e nessuna nota", chiuso);
}

// ── 5 · IL VERBALE DPI, IL FOGLIO CHIESTO PER PRIMO IN ISPEZIONE ───────────
/* Misurato affiancando i DUE fogli sugli stessi dati: la CARTELLA scriveva
   «da sostituire» e il VERBALE, due bottoni più in là, stampava la data e
   basta. Lo stato `verbaleDpi` lo calcolava già per ogni riga. */
{
  await pg.click("#nav-pers").catch(() => {});
  await pg.waitForTimeout(600);
  await pg.click('#pers-tabs [data-tab="dpi"]').catch(() => {});
  await pg.waitForTimeout(450);
  const scelto = await pg.evaluate(() => {
    const s = document.getElementById("dpi-verb-lav");
    if (!s || ![...s.options].some((o) => o.value === "d4")) return false;
    s.value = "d4"; return s.value === "d4";
  });
  dice(scelto, "la scheda DPI è aperta e la persona si può scegliere", scelto);
  await pg.click("#btn-dpi-verb").catch(() => {});
  await pg.waitForTimeout(400);
  await pg.evaluate(() => {
    const b = [...document.querySelectorAll(".modal-ov button, .modal button")].find((x) => /^Stampa$/i.test(x.textContent.trim()));
    if (b) b.click();
  });
  await pg.waitForTimeout(400);
  const foglio = await pg.evaluate(() => (document.getElementById("verbale").textContent || "").replace(/\s+/g, " ").trim());
  if (DIMMI) console.log("\n[verbale DPI]\n" + foglio + "\n");
  dice(/Verbale di consegna dei DPI/.test(foglio), "il verbale si compone", foglio.slice(0, 120));
  dice(/10\/07\/2020 — DA SOSTITUIRE/.test(foglio),
    "una consegna scaduta è marcata sul foglio, non stampata come una qualunque", foglio.slice(0, 700));
  dice(/01\/06\/2099(?! —)/.test(foglio), "e una in corso di validità resta pulita", foglio.slice(0, 700));
  dice(/non indicata/.test(foglio), "la consegna senza data di sostituzione lo dice (decisione 14)", foglio.slice(0, 700));
  dice(!/—\s*<\/td>/.test(foglio) && !/ — $/.test(foglio), "e nessuna cella resta un trattino muto");

  /* ⛔ LA DIMOSTRAZIONE DICHIARATA. Prima si prova che l'app È in
     dimostrazione: senza questo controllo, in `--live`, un foglio pulito si
     scambierebbe per «il banco non ha caricato niente». La fascia guarda
     `db.mode` per conto suo e `--live` non la tocca. */
  dice(await pg.evaluate(() => getComputedStyle(document.getElementById("tour-banner")).display === "block"),
    "l'app è davvero in modalità dimostrazione: sullo schermo la fascia in alto è accesa");
  const fv = await leggiFoglioStampato();
  if (DIMMI) console.log("\n[verbale in stampa]\n" + JSON.stringify(fv, null, 1) + "\n");
  /* ⛔ LA MISURA CHE SPIEGA PERCHÉ LA RIGA STA LÌ, e non è rovesciata da
     `--live`: è un fatto delle regole di stampa, vero in tutt'e due i modi.
     Le due dichiarazioni dello schermo sul foglio NON arrivano — `.tour-banner`
     e `.page` stanno nell'elenco di ciò che è comando e non documento — quindi
     una dichiarazione scritta fuori da `#verbale` non protegge niente. */
  dice(!fv.bannerVisibile && !fv.modeNoteVisibile,
    "⛔ e le due dichiarazioni dello SCHERMO sul foglio non arrivano: ecco perché la riga deve stare dentro #verbale",
    { bannerVisibile: fv.bannerVisibile, modeNoteVisibile: fv.modeNoteVisibile });
  dice(/Verbale di consegna dei DPI/i.test(fv.stampato), "il foglio letto in stampa è davvero il verbale", fv.stampato.slice(0, 90));
  proveAvviso(fv, "verbale DPI", /non va fatto firmare/i);
}

// ── 6 · LA CARTELLA DEL LAVORATORE, IL FASCICOLO CHE SI ESIBISCE ──────────
/* ⛔ IL SECONDO FOGLIO STAMPABILE, e nessuno lo guardava. Misurato premendo il
   bottone sulla dimostrazione: CINQUE cartelle su sette chiudevano con «Tutte
   le sezioni della cartella contengono dati registrati in Scudo», in GRIGIO —
   e dentro c'era una visita medica scaduta, un DPI da sostituire, un
   addestramento da fare, una nomina senza la data da cui decorre. Il foglio
   scriveva «da sostituire» su una riga e due centimetri sotto si dichiarava
   tranquillo: `completa` risponde a «ci sono sezioni senza righe?», che è
   un'altra domanda.
   ⚠️ SI GUARDA ANCHE IL COLORE, non solo il testo: la riga di chiusura era
   grigia (#555) proprio nei casi in cui va letta. */
{
  const apriCartella = async (idLav) => {
    await pg.click("#nav-pers").catch(() => {});
    await pg.waitForTimeout(500);
    await pg.click('#pers-tabs [data-tab="dpi"]').catch(() => {});
    await pg.waitForTimeout(400);
    const scelto = await pg.evaluate((v) => {
      const s = document.getElementById("dpi-verb-lav");
      if (!s || ![...s.options].some((o) => o.value === v)) return false;
      s.value = v; return s.value === v;
    }, idLav);
    if (!scelto) return { errore: "la persona " + idLav + " non è scegliibile" };
    await pg.click("#btn-cartella").catch(() => {});
    await pg.waitForTimeout(400);
    const modale = await pg.evaluate(() => {
      const m = document.querySelector(".modal-ov");
      return m ? (m.textContent || "").replace(/\s+/g, " ").trim() : "";
    });
    if (!modale) return { errore: "nessuna modale per " + idLav };
    await pg.evaluate(() => {
      const b = [...document.querySelectorAll(".modal-ov button, .modal button")].find((x) => /^Stampa$/i.test(x.textContent.trim()));
      if (b) b.click();
    });
    await pg.waitForTimeout(400);
    /* Il colore della riga di chiusura si legge DALLA PAGINA (getComputedStyle
       sull'ultimo blocco prima delle firme), non dal sorgente: è il valore che
       finisce sul foglio. */
    const [foglio, colore] = await pg.evaluate(() => {
      const v = document.getElementById("verbale");
      const chiusura = [...v.querySelectorAll("div")].filter((d) => /cartella/i.test(d.textContent) && d.children.length === 0).pop();
      return [(v.textContent || "").replace(/\s+/g, " ").trim(),
              chiusura ? getComputedStyle(chiusura).color : "(non trovata)"];
    });
    return { modale, foglio, colore };
  };

  const guasta = await apriCartella("d4");
  dice(!guasta.errore, "la cartella di chi ha righe fuori regola si compone", guasta.errore);
  if (!guasta.errore) {
    if (DIMMI) console.log("\n[cartella d4]\n" + guasta.foglio + "\n[modale]\n" + guasta.modale + "\n");
    dice(/Cartella del lavoratore/.test(guasta.foglio), "il foglio si compone", guasta.foglio.slice(0, 120));
    /* la cartella di Anna Neri è COMPLETA (mansione, scadenze e DPI ci sono):
       è il caso esatto — completa e non in regola */
    dice(/Tutte le sezioni della cartella contengono dati/.test(guasta.foglio),
      "e questa cartella è davvero completa: nessuna sezione senza righe", guasta.foglio.slice(0, 200));
    dice(/non tutto quello che è registrato è in regola/.test(guasta.foglio),
      "ma la riga di chiusura non si ferma lì: dice che ci sono righe fuori regola", guasta.foglio.slice(-400));
    dice(/DPI da sostituire/.test(guasta.foglio) && /addestrament\w+ ancora da fare/.test(guasta.foglio),
      "e le elenca, invece di lasciarle da cercare nelle tabelle", guasta.foglio.slice(-400));
    dice(/completa non è una cartella in regola/i.test(guasta.foglio),
      "con la frase che spiega la differenza fra completa e in regola", guasta.foglio.slice(-300));
    /* #8a0000 = rgb(138, 0, 0) */
    dice(/rgb\(138,\s*0,\s*0\)/.test(guasta.colore),
      "e non è scritta in grigio: il colore segue le righe, non solo le sezioni", guasta.colore);
    dice(/Completa non vuol dire in regola/.test(guasta.modale),
      "la finestra prima di stampare dice che cosa si troverà dentro", guasta.modale.slice(0, 400));
    /* il documento collegato di cui nessuno ha scritto lo stato: nell'elenco
       dei Documenti la pastiglia dice «Stato non indicato», sul foglio la riga
       usciva col titolo e una cella bianca */
    dice(/Attestato antincendio da archivio cartaceo\s*Stato non indicato/.test(guasta.foglio),
      "il documento collegato porta il suo stato, non solo il titolo", (guasta.foglio.match(/Documenti collegati.{0,140}/) || [""])[0]);
    /* ⛔ IL SECONDO FOGLIO PORTA LA SUA DICHIARAZIONE, e con la SUA
       conseguenza: una cartella non si fa firmare, si esibisce e si tiene agli
       atti. Stessa funzione, frase diversa — è quello che «un posto solo» deve
       permettere, se no la decisione unica diventa una frase unica e sbagliata
       per metà dei fogli. */
    const fc = await leggiFoglioStampato();
    if (DIMMI) console.log("\n[cartella in stampa]\n" + JSON.stringify(fc, null, 1) + "\n");
    dice(/Cartella del lavoratore/i.test(fc.stampato), "il foglio letto in stampa è davvero la cartella", fc.stampato.slice(0, 90));
    proveAvviso(fc, "cartella del lavoratore", /non va esibita a un ispettore/i);
  }

  /* ⛔ IL CASO DI CONTROLLO, senza il quale «l'avviso c'è» non dimostra niente:
     un avviso che compare sempre non lo legge più nessuno. Franco Riva ha
     tutto a posto e la sua cartella deve restare pulita e grigia. */
  const sana = await apriCartella("d6");
  dice(!sana.errore, "la cartella di chi ha tutto a posto si compone", sana.errore);
  if (!sana.errore) {
    if (DIMMI) console.log("\n[cartella d6]\n" + sana.foglio + "\n");
    dice(!/non tutto quello che è registrato è in regola/.test(sana.foglio),
      "e NON porta l'avviso: un avviso che c'è sempre non lo legge nessuno", sana.foglio.slice(-300));
    dice(/rgb\(85,\s*85,\s*85\)/.test(sana.colore), "e resta grigia", sana.colore);
    dice(!/Completa non vuol dire in regola/.test(sana.modale), "nemmeno nella finestra", sana.modale.slice(0, 200));
  }
}

// ── 7 · IL PROMEMORIA CHE SI MANDA AL LAVORATORE ─────────────────────────
/* Non e' un file, ma esce lo stesso: si copia negli appunti e finisce in
   un'email o in un SMS. E il difetto era della stessa famiglia — due righe che
   a schermo dicono la STESSA cosa («Senza data», stessa pastiglia, stesso
   bottone) si comportavano in modo diverso premendo il bottone, perche' un
   `if` guardava se il campo era scritto invece di che cosa valeva. */
{
  await pg.click("#nav-pers").catch(() => {});
  await pg.waitForTimeout(600);
  /* ⛔ IL RIEPILOGO PER PERSONA. Anna Neri ha una sola scadenza, e il suo
     campo data non e' mai stato scritto: la pastiglia diceva «In scadenza» —
     un'affermazione precisa su una data che nessuno conosce. */
  const pastiglia = await pg.evaluate(() => {
    const r = [...document.querySelectorAll("#pers-list .item")].find((x) => /Anna Neri/.test(x.textContent));
    return r ? [...r.querySelectorAll(".badge")].map((b) => b.textContent.trim()).join(" | ") : "(riga assente)";
  });
  dice(/Senza data/.test(pastiglia) && !/In scadenza/.test(pastiglia),
    "nell'elenco Personale chi ha solo scadenze senza data NON è «In scadenza»", pastiglia);

  await pg.click("#nav-scad").catch(() => {});
  await pg.waitForTimeout(700);
  const prom = await pg.evaluate(async () => {
    const out = {};
    let copiato = null;
    const vero = navigator.clipboard && navigator.clipboard.writeText;
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t) => { copiato = t; } }, configurable: true });
    const r = [...document.querySelectorAll("#scad-list .item")].find((x) => /Preposto — aggiornamento/.test(x.textContent));
    if (!r) return { errore: "riga senza data non trovata nello scadenzario" };
    out.riga = r.textContent.replace(/\s+/g, " ").trim();
    const b = r.querySelector("[data-prom-scad]");
    out.bottone = !!b;
    if (b) { b.click(); await new Promise((z) => setTimeout(z, 400)); }
    out.copiato = copiato;
    out.esito = (document.getElementById("scad-esito") || {}).textContent || "";
    out.vero = !!vero;
    return out;
  });
  dice(!prom.errore, "la scadenza col campo data mai scritto è nello scadenzario", prom.errore);
  if (!prom.errore) {
    if (DIMMI) console.log("\n[promemoria]\n" + JSON.stringify(prom, null, 1) + "\n");
    dice(/Senza data/.test(prom.riga), "e a schermo dice «Senza data», come una data illeggibile", prom.riga);
    dice(prom.bottone, "il bottone «Promemoria» c'è (il criterio è «non regolare»)", prom.riga);
    dice(!!prom.copiato, "e premendolo il testo esce davvero", { esito: prom.esito, copiato: prom.copiato });
    dice(/non risulta una data di scadenza leggibile/.test(prom.copiato || ""),
      "il messaggio dice perché non c'è un entro-quando, invece di inventarlo", prom.copiato);
    dice(!/NaN|undefined|scade il/.test(prom.copiato || ""),
      "e non promette una data che non esiste", prom.copiato);
    dice(!/solo se è in scadenza o già scaduta/.test(prom.esito),
      "e la pagina non risponde con un motivo falso", prom.esito);
  }
}

console.log(`\n${ok} ok · ${ko} KO${CONTROPROVA ? `  ·  ${rimessi.size}/${DIFETTI.length} difetti rimessi` : ""}`);
if (CONTROPROVA) {
  const atteso = rimessi.size === DIFETTI.length;
  if (!atteso) {
    console.log("⛔ non tutti i difetti sono stati rimessi: il verde qui sotto non vuol dire niente.");
    console.log("   mancano i numeri: " + DIFETTI.map((_, i) => i + 1).filter((i) => !rimessi.has(i - 1)).join(", "));
  }
  console.log(ko > 0 && atteso ? "✔ CONTROPROVA OK: coi difetti rimessi il banco fallisce." : "⛔ CONTROPROVA FALLITA: il banco non distingue.");
}
/* ⛔ ANCHE `--live` DICHIARA QUANTI SOGGETTI HA TOCCATO. Se lo spostamento del
   confronto non fosse arrivato nella pagina servita, i fogli uscirebbero
   dichiarati e le prove rovesciate cadrebbero: un rosso, non un silenzio. Ma
   il caso opposto — un `replace` a vuoto che lascia la pagina intatta e che
   qualcuno legge come «Scudo sa tacere» — va reso impossibile qui. */
if (FINGE_LIVE) {
  const tutte = rimessi.size === COME_LIVE.length;
  console.log(`--live: ${rimessi.size}/${COME_LIVE.length} spostamenti del confronto arrivati nella pagina servita`);
  if (!tutte) console.log("⛔ lo spostamento NON è arrivato: questo giro non prova che Scudo sappia tacere.");
  else console.log(ko === 0 ? "✔ SU DATI VERI I DUE FOGLI ESCONO PULITI: la dichiarazione sa tacere."
                            : "⛔ su dati veri qualcosa continua a dichiararsi d'esempio.");
  await b.close(); srv.close();
  process.exit(tutte && ko === 0 ? 0 : 1);
}
await b.close(); srv.close();
process.exit(CONTROPROVA ? (ko > 0 && rimessi.size === DIFETTI.length ? 0 : 1) : (ko > 0 ? 1 : 0));
