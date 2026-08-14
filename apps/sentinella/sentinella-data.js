// ============================================================
// Sentinella — accesso dati (C5). Schema condiviso (orgCollection
// da autenticati, demo in memoria altrimenti).
// Collezioni (sotto organizations/{org}/apps/sentinella/):
//   monitoraggi/{id}: { nome, tipo, valore, soglia, unita, nota,
//                       ricettoreId, letture:[{data,ora,valore}] }
//     → lo stato si CALCOLA: valore/soglia ≥1 superamento, ≥0.9 attenzione
//   adempimenti/{id}: { titolo, ente, scadenza (ISO) } → urgenza dalle date
//   registri/{id}:    { titolo, nota, stato: aggiornato|in-attesa }
//   ricettori/{id}:   { nome, tipo, distanza, classe, soglia, unita, nota }
//     → il punto sensibile da proteggere (casa, scuola, confine). Le norme
//       ragionano per RICETTORE: la soglia del ricettore, se impostata,
//       vince su quella del punto di misura collegato.
//   reclami/{id}:     { data, ora, tipo, ricettoreId, chi, descrizione,
//                       azione, stato: aperto|chiuso }
//   programma/{id}:   { monitoraggioId, ogniGiorni, tolleranzaGiorni,
//                       dal, nota, attivo } → il piano di monitoraggio:
//       che cosa va misurato, dove e ogni quanto. Lo stato (in regola /
//       da fare / in ritardo) si CALCOLA dall'ultima lettura del punto.
// ============================================================

import { parseCsvLine, csvCell, numIt, giorniTra, isIntestazione, numeroScritto, dataISOEsiste,
         senzaDoppioni, istanteLocale, plurale, conta,
         AVVISO_DECIMALE as AVVISO_DECIMALE_SHELL,
         dataPiuGiorni as dataPiuGiorniShell } from "../../shared/deepwork-id-client/dw-shell.js";
// Una scadenza è una scadenza: lo stato della taratura lo dice la stessa
// funzione che lo dice per le visite mediche di Scudo e per i documenti di
// Campo. Non se ne scrive una quarta (regola del `shared/`).
import { statoScadenzaHSE, applicaPercorsi, traduciCancellazioni, trasformaAtomico, trasformaInMemoria,
         statoResponsabile } from "../../shared/dw-ponti.js";
/* ⛔ `statoPonte` e `azioniDiOrigine` STAVANO QUI, ed erano identiche — misurate
   byte per byte — alle due di Campo. Una regola che serve a due app vive in
   `shared/`: qui restano col nome con cui le pagine le hanno sempre chiamate,
   che è un alias e non una seconda implementazione. */
export { azioniDiOrigine, statoPonte } from "../../shared/dw-ponti.js";
/* ⛔ `leggiCsv` STAVA QUI, ed era l'unico lettore di CSV completo
   dell'ecosistema: regge il separatore deciso su tutto il file, le virgolette
   doppie raddoppiate, il BOM e — quello che conta — **l'a capo DENTRO un campo
   quotato**. Serve a due app da quando Conti legge l'estratto conto della
   banca, e le banche la descrizione lunga la scrivono su piu' righe. Vive in
   `shared/`, e qui resta il nome che le pagine di Sentinella hanno sempre
   usato. */
export { leggiCsv } from "../../shared/deepwork-id-client/dw-shell.js";

export const DEMO = {
  monitoraggi: [
    { id: "v1", nome: "Vibrazioni V1 — abitato Sud", tipo: "vibrazioni", valore: 1.8, soglia: 5, unita: "mm/s", nota: "ultimo evento 12/07", ricettoreId: "rc1",
      /* Lo strumento in regola: il certificato copre tutte le letture. */
      tarature: [ { data: "2026-02-10", scadenza: "2027-02-09", ente: "Centro LAT n. 118", certificato: "LAT 118-2026/441", nota: "sismografo, canale terna" } ],
      /* LA CATENA DI CUSTODIA COMPLETA (T2d): tutte e quattro le letture
         arrivano dal file esportato dal sismografo, col nome del file e il
         momento dell'import. È il caso «tracciata», quello che il report
         può dichiarare senza riserve. */
      letture: [ { data: "2026-06-08", ora: "10:20", valore: 2.4, origine: { da: "import", file: "V1_giugno.csv", quando: "2026-07-01T08:42:00" } },
                 { data: "2026-06-19", ora: "11:05", valore: 1.9, origine: { da: "import", file: "V1_giugno.csv", quando: "2026-07-01T08:42:00" } },
                 { data: "2026-06-30", ora: "10:40", valore: 3.1, origine: { da: "import", file: "V1_giugno.csv", quando: "2026-07-01T08:42:00" } },
                 { data: "2026-07-12", ora: "11:15", valore: 1.8, origine: { da: "import", file: "V1_luglio.csv", quando: "2026-07-20T09:05:00" } } ] },
    { id: "v2", nome: "Vibrazioni V2 — confine Nord", tipo: "vibrazioni", valore: 5.6, soglia: 5, unita: "mm/s", nota: "volata fronte Nord 17/07", ricettoreId: "rc2",
      /* ⛔ IL BUCO FRA DUE TARATURE. Il certificato vecchio è scaduto il
         30/06 e il nuovo parte dal 10/07: le letture del 06/07 cadono in
         mezzo, e il report deve dirlo. È il caso per cui questa sezione
         esiste, quindi la dimostrazione lo contiene invece di nasconderlo. */
      tarature: [ { data: "2025-07-01", scadenza: "2026-06-30", ente: "Centro LAT n. 118", certificato: "LAT 118-2025/302" },
                  { data: "2026-07-10", scadenza: "2027-07-09", ente: "Centro LAT n. 118", certificato: "LAT 118-2026/512" } ],
      /* ⛔ LA CUSTODIA MISTA, E LA MISURA CORRETTA (T2d). Questo punto porta
         i tre casi che il documento deve saper distinguere, perché sono i
         tre che capitano davvero in cava:
         · 05/06 e 16/06 · dal file dello strumento;
         · 27/06 · battuta a mano leggendo il display, e poi CORRETTA il
           giorno dopo: era entrata come 4,2 e il valore vero era 5,2 — una
           cifra letta male al volo. Il report dice che è stata corretta,
           quando, e qual era il numero entrato in origine: senza, sarebbe un
           valore ritoccato che sembra quello originale. ⚠️ E la direzione
           conta: la correzione ALZA il numero, cioè è il caso in cui
           qualcuno potrebbe sospettare il contrario — è lì che la catena di
           custodia serve, non quando il ritocco fa comodo a chi la legge;
         · 06/07 · provenienza NON dichiarata: la riga c'è, ma non risulta
           per che strada sia entrata. NON è «a mano», ed è la stessa lettura
           che cade nel buco fra due tarature — le due cose non si sommano,
           si dicono tutt'e due. */
      letture: [ { data: "2026-06-05", ora: "09:50", valore: 3.2, origine: { da: "import", file: "V2_giugno.csv", quando: "2026-07-01T08:44:00" } },
                 { data: "2026-06-16", ora: "10:10", valore: 4.4, origine: { da: "import", file: "V2_giugno.csv", quando: "2026-07-01T08:44:00" } },
                 { data: "2026-06-27", ora: "10:35", valore: 5.2, origine: { da: "manuale", quando: "2026-06-27T17:10:00", corretta: { quando: "2026-06-28T08:30:00", prima: 4.2 } } },
                 { data: "2026-07-06", ora: "11:00", valore: 3.9 },
                 { data: "2026-07-17", ora: "10:25", valore: 5.6, origine: { da: "import", file: "V2_luglio.csv", quando: "2026-07-20T09:07:00" } } ] },
    { id: "p1", nome: "Polveri PM10 — confine Est", tipo: "polveri", valore: 36.8, soglia: 40, unita: "µg/m³", nota: "media 7gg", ricettoreId: "rc3",
      /* ⛔ NESSUNA `origine`, E NON È UNA DIMENTICANZA. È il caso di TUTTE le
         letture registrate prima che la catena di custodia esistesse, cioè
         la maggior parte dell'archivio di ogni cliente il giorno in cui
         questa unità va in mano sua. La dimostrazione lo contiene apposta:
         un campo assente è uno stato che il prodotto sa raccontare
         («provenienza non dichiarata»), non un refuso da nascondere. */
      letture: [ { data: "2026-06-14", valore: 22.5 }, { data: "2026-06-21", valore: 31 }, { data: "2026-06-28", valore: 44.2 }, { data: "2026-07-05", valore: 28.4 }, { data: "2026-07-12", valore: 33.7 }, { data: "2026-07-19", valore: 36.8 } ] },
    { id: "r1", nome: "Rumore — perimetro Ovest", tipo: "rumore", valore: 62, soglia: 70, unita: "dB(A)", nota: "campagna 06/2026", ricettoreId: "rc1",
      /* TUTTE A MANO, ed è la prassi vera: la campagna fonometrica la fa un
         tecnico acustico esterno, che consegna una relazione su carta. I
         livelli si ricopiano. Non è un errore da correggere — è una strada
         d'ingresso diversa, e il documento la dichiara invece di far
         sembrare questi dB usciti da un file come gli altri. */
      letture: [ { data: "2026-06-10", ora: "14:30", valore: 58, origine: { da: "manuale", quando: "2026-06-11T09:00:00" } },
                 { data: "2026-06-24", ora: "15:00", valore: 64, origine: { da: "manuale", quando: "2026-06-25T08:50:00" } },
                 { data: "2026-07-08", ora: "14:45", valore: 61, origine: { da: "manuale", quando: "2026-07-09T09:15:00" } },
                 { data: "2026-07-22", ora: "15:20", valore: 62, origine: { da: "manuale", quando: "2026-07-23T08:40:00" } } ] },
    { id: "a1", nome: "Acque — vasca decantazione", tipo: "acque", valore: 12, soglia: 35, unita: "mg/l SST", nota: "campionamento 15/07" },
    /* ⛔ IL PUNTO SENZA SOGLIA STA NELLA DIMOSTRAZIONE, ed è una scelta presa
       col criterio di `docs/QUANDO_UN_CASO_VA_IN_DIMOSTRAZIONE.md`: è
       un'**assenza**, ed è **additiva** — aggiungerlo non porta via nessun
       numero agli altri quattro punti. È il caso della decisione 16 del
       fondatore, e prima del 02/08 l'app su un punto così scriveva «Conforme»
       in verde nel report che va all'ente: un limite che nessuno ha mai
       stabilito, dichiarato rispettato.
       ⚠️ Perché una centralina nuova non ha subito un limite: la soglia la
       fissa l'autorizzazione o una classificazione acustica, e nel frattempo
       si misura lo stesso. È il caso vero, non uno costruito per la prova. */
    { id: "pv1", nome: "Polveri PM10 — piazzale nuovo", tipo: "polveri", valore: 22.4, unita: "µg/m³",
      nota: "centralina installata il 20/07, limite non ancora fissato dall'autorizzazione",
      /* ⚠️ NIENTE TARATURA, e non per pigrizia: dandogliela la prova
         «quanti strumenti hanno almeno un certificato» passava da 2 a 3, cioè
         il punto nuovo cambiava un numero che non c'entra niente con lui.
         Un caso da dimostrare deve aggiungere UNA cosa, non spostarne due:
         qui la cosa da mostrare è la soglia che manca. E una centralina
         installata da dodici giorni senza il certificato ancora registrato è
         il caso vero, che il report già sa dichiarare. */
      /* ⛔ LE LETTURE CI VOGLIONO, se no il caso NON si vede dove serve.
         Misurato: col solo punto e nessuna lettura, il report di conformità —
         cioè il documento che va all'ente, il posto dove prima usciva
         «Conforme» su un limite mai stabilito — **non lo mostrava affatto**,
         perché il periodo raccoglie le letture. Il caso stava in dimostrazione
         e non si vedeva dove il difetto viveva. Con tre letture il punto entra
         nel report e ci dichiara che un giudizio non si può dare. */
      letture: [ { data: "2026-07-22", ora: "09:30", valore: 19.6, origine: { da: "import", file: "PV1_luglio.csv", quando: "2026-08-01T07:50:00" } },
                 { data: "2026-07-27", ora: "09:20", valore: 24.1, origine: { da: "import", file: "PV1_luglio.csv", quando: "2026-08-01T07:50:00" } },
                 { data: "2026-07-31", ora: "09:40", valore: 22.4, origine: { da: "import", file: "PV1_luglio.csv", quando: "2026-08-01T07:50:00" } } ] },
  ],
  ricettori: [
    { id: "rc1", nome: "Casa Bianchi — via Cava 12", tipo: "abitazione", distanza: 320, classe: "III", soglia: 5, unita: "mm/s", nota: "abitazione più vicina al fronte Sud" },
    { id: "rc2", nome: "Confine Nord — mappale 214", tipo: "confine", distanza: 90, classe: "V", soglia: 20, unita: "mm/s", nota: "confine di proprietà, nessun edificio" },
    { id: "rc3", nome: "Scuola primaria — via Roma 4", tipo: "scuola", distanza: 640, classe: "I", soglia: 40, unita: "µg/m³", nota: "ricettore sensibile: orario scolastico 08–16" },
    /* ⛔ IL RICETTORE DI CUI NON SI SA QUANTO È LONTANO. La distanza governa la
       lettura di qualunque livello misurato lì — è il denominatore della
       distanza scalata e il primo numero che un ente guarda — quindi la sua
       assenza NON è un dettaglio d'anagrafica: è il motivo per cui su quel
       ricettore non si può dire quasi niente. La riga lo scrive («distanza non
       indicata») invece di lasciare il posto vuoto, e prima di oggi non lo
       vedeva nessuno perché tutti e tre i ricettori la distanza ce l'avevano.
       Assenza, e additiva: nessun punto di misura è collegato a questo, quindi
       non cambia nessun conteggio del report.
       Storia vera: il ricettore lo si aggiunge quando arriva un esposto, e la
       distanza si misura dopo, sulla mappa catastale. */
    { id: "rc4", nome: "Cascina Ferrero — strada vicinale", tipo: "abitazione", distanza: null, classe: "", soglia: null, unita: "", nota: "aggiunto dopo un esposto: distanza da misurare sulla mappa catastale" },
  ],
  reclami: [
    { id: "x1", data: "2026-07-17", ora: "10:30", tipo: "vibrazione", ricettoreId: "rc1", chi: "Sig. Bianchi",
      descrizione: "Ha sentito tremare i vetri durante la volata del mattino.",
      azione: "Mostrata la misura di V1 (1,8 mm/s, sotto soglia) e la scheda della volata.", stato: "chiuso" },
    { id: "x2", data: "2026-07-20", ora: "07:45", tipo: "polvere", ricettoreId: "rc3",
      chi: "Direzione scolastica", descrizione: "Polvere sui davanzali lato cava dopo giornata ventosa.",
      azione: "Bagnatura piste raddoppiata, verifica PM10 in corso.", stato: "aperto" },
  ],
  /* `periodoMesi` e `giorniConsegna` dicono che PERIODO copre l'adempimento —
     da lì `periodoAdempimento` ricava «dal … al» e il Report parte già su quei
     giorni. ⛔ E d2 li lascia VUOTI di proposito: un rinnovo di autorizzazione
     non copre nessun periodo di misure, quindi la dimostrazione contiene anche
     il caso in cui l'app deve dire che non lo sa. È la stessa scelta di
     `run-demo.mjs` sulla fattura senza scadenza: un campo assente non è un
     refuso, è uno stato che il prodotto sa raccontare. */
  adempimenti: [
    { id: "d1", titolo: "Relazione annuale emissioni", ente: "ARPA", scadenza: "2026-08-10",
      periodoMesi: 12, giorniConsegna: 0 },
    { id: "d2", titolo: "Rinnovo AUA", ente: "SUAP", scadenza: "2026-09-30" },
    { id: "d3", titolo: "Verifica fonometrica semestrale", ente: "—", scadenza: "2026-09-30",
      periodoMesi: 6, giorniConsegna: 0 },
  ],
  registri: [
    { id: "g1", titolo: "Registro rifiuti", nota: "ultimo carico 16/07", stato: "aggiornato" },
    { id: "g2", titolo: "Registro acque meteoriche", nota: "aggiornato 07/2026", stato: "aggiornato" },
    { id: "g3", titolo: "Formulari trasporto", nota: "3 in attesa di quarta copia", stato: "in-attesa" },
  ],
  programma: [
    // il piano: ogni riga dice ogni quanti giorni va misurato un punto.
    // La tolleranza è il ritardo che l'azienda considera accettabile
    // prima di parlare di ritardo vero.
    { id: "pr1", monitoraggioId: "p1", ogniGiorni: 7,   tolleranzaGiorni: 2, dal: "2026-06-14", nota: "Centralina PM10 al confine: scarico settimanale dei dati.", attivo: true },
    { id: "pr2", monitoraggioId: "v1", ogniGiorni: 15,  tolleranzaGiorni: 3, dal: "2026-06-08", nota: "Sismografo abitato Sud.", attivo: true },
    { id: "pr3", monitoraggioId: "v2", ogniGiorni: 15,  tolleranzaGiorni: 3, dal: "2026-06-05", nota: "Sismografo confine Nord.", attivo: true },
    { id: "pr4", monitoraggioId: "r1", ogniGiorni: 90,  tolleranzaGiorni: 7, dal: "2026-06-10", nota: "Campagna fonometrica trimestrale del tecnico acustico.", attivo: true },
    { id: "pr5", monitoraggioId: "a1", ogniGiorni: 182, tolleranzaGiorni: 10, dal: "", nota: "Campionamento acque della vasca.", attivo: true },
  ],
  volate: [
    // b1 · progettata in Genesi (porta con sé la PPV PREVISTA) e già sparata:
    //      appena si collega la PPV misurata del sismografo compare lo scarto
    //      previsto → misurato, che è il motivo per cui il registro serve.
    { id: "b1", data: "2026-07-17", fronte: "Fronte Nord", nFori: 42, kgTotali: 480, kgMaxRitardo: 18, distanzaRicettore: 320, esito: "regolare", note: "",
      stato: "eseguita", ppvPrevista: 4.6, ppvPrevLimite: 5, ppvPrevNorma: "DIN residenziale @ 25 Hz",
      ppvPrevFonte: "genesi-litologia", airblastPrevisto: 118, codiceVolata: "GEN-20260717-4f2a1" },
    // b2 · registrata a mano prima che esistesse il campo «stato»: vale come
    //      ESEGUITA, ed è la prova di compatibilità con lo storico.
    { id: "b2", data: "2026-07-03", fronte: "Fronte Est", nFori: 36, kgTotali: 410, kgMaxRitardo: 22, distanzaRicettore: 280, esito: "regolare", note: "" },
    // b3 · progettata in Genesi e NON ancora sparata: sta nel registro come
    //      PREVISTA, non conta nei kg del mese e non può diventare un referto.
    { id: "b3", data: "2026-08-04", fronte: "Fronte Sud", nFori: 38, kgTotali: 430, kgMaxRitardo: 20, distanzaRicettore: 240, esito: "regolare", note: "",
      stato: "prevista", ppvPrevista: 3.9, ppvPrevLimite: 5, ppvPrevNorma: "DIN residenziale @ 25 Hz",
      ppvPrevFonte: "genesi-litologia", airblastPrevisto: 121, codiceVolata: "GEN-20260804-9c71b" },
    /* ⛔ LA VOLATA CHE NON DICHIARA LA DISTANZA. Succede: il brogliaccio si
       compila in cava, e il campo della distanza del ricettore resta vuoto.
       È un'ASSENZA — quindi sta nei dati d'esempio, e serve a far vedere la
       cosa che il prodotto sa dire: nella tabella del report per l'ente la
       casella scrive «non dichiarato» e sopra la tabella compare quante
       volate del periodo non sono complete. Prima di oggi qui usciva
       «distanza 0 m», che su un documento si legge come il ricettore dentro
       il fronte, e la distanza scalata non si sarebbe potuta calcolare
       comunque. */
    { id: "b4", data: "2026-07-24", fronte: "Fronte Nord", nFori: 34, kgTotali: 390, kgMaxRitardo: 19, distanzaRicettore: null, esito: "regolare", note: "", stato: "eseguita" },
    /* ⛔ IL LIMITE DI PROGETTO SENZA LA NORMA DA CUI È PRESO. Nella tabella
       «previsto, misurato e scarto» del report l'ultima colonna riporta il
       limite dichiarato sul progetto **con la norma**: è un riferimento di
       contesto che l'ente legge per capire da dove viene quel numero. Un
       limite senza la sua norma è un numero senza provenienza — e il report lo
       scrive («norma non indicata sul progetto») invece di lasciar credere che
       la citazione ci sia. Prima di oggi non lo vedeva nessuno: l'unica volata
       con previsione (`b3`) la norma ce l'aveva.
       Assenza, e additiva: questa volata porta tutti i suoi numeri, quindi non
       cambia il conto delle righe incomplete della tabella sopra. */
    { id: "b5", data: "2026-07-10", fronte: "Fronte Est", nFori: 40, kgTotali: 455, kgMaxRitardo: 21, distanzaRicettore: 300, esito: "regolare", note: "", stato: "eseguita",
      ppvPrevista: 4.2, ppvPrevLimite: 5, ppvPrevNorma: "", ppvPrevFonte: "manuale" },
  ],
};

// ⛔ «QUESTA SOGLIA VALE?» SI CHIEDE IN UN POSTO SOLO. La stessa condizione era
// scritta a mano in cinque punti del modulo (`sogliaEfficace`, `serieStorica`,
// `ultimaLetturaOltre`, `statPeriodo`, e il ripiego di `statoMisura`) — e la
// quinta copia si comportava in modo diverso dalle altre quattro: dove loro
// dicevano «non c'è» lei metteva **1**. È il difetto della regola riscritta,
// con il costo già pagato una volta dalla convenzione sui numeri.
// Vale > 0 e finita: zero non è una soglia (non si divide), un negativo non è
// un limite, e una stringa vuota o `null` sono l'assenza.
const sogliaValida = (v) => Number.isFinite(+v) && +v > 0;

// ⛔ «CONFORME» SENZA AVER MISURATO NIENTE (corretto il 03/08). Un punto appena
// configurato nasce con `valore: 0, letture: []` — nessuno ha misurato — e qui
// il rapporto faceva zero, zero è sotto 0,9, e la risposta era «Conforme»,
// verde. Con sei punti appena creati il cartellone diceva «6 punti entro
// soglia», il KPI diceva 6 e ogni badge diceva Conforme: il primo giorno di
// ogni cliente, prima ancora di appoggiare uno strumento.
// È più grave che altrove perché Sentinella è l'app del report all'ente, e il
// principio violato è NATO QUI («senza dati non è conforme»): il report era
// stato corretto, il badge, il KPI e il cartellone no.
//
// Il rilevatore è `ultimaLettura`, non `letture.length`: valida data e valore,
// quindi una riga rotta non conta come misura. Vocabolario e classe sono quelli
// che Sentinella USA GIÀ in `statoRigaProgramma` — «Mai misurato», `warn`,
// «è un avviso e non un allarme: magari il punto è stato appena creato».
//
// ⚠️ IL CONFINE È STRETTO, ed è stato spostato DUE volte prima di essere
// giusto. La prima stesura faceva scattare «mai misurato» su qualunque punto
// senza `letture` — e ha fatto cadere dodici prove, fra cui una marcata ⛔ col
// suo perché scritto: «un punto senza storico è comunque un superamento, con la
// voce *valore-corrente* invece di una data. Farlo sparire perché non c'è una
// data da citare toglierebbe dall'elenco un superamento vero.» Quella decisione
// era già stata presa, e vale.
// Quindi la regola è più stretta: «mai misurato» solo quando non c'è NESSUNA
// informazione — né una lettura datata né un valore dichiarato maggiore di
// zero. Un valore digitato a mano continua a contare come sempre.
// Resta un caso indistinguibile e va detto: un punto che dichiara esattamente
// ZERO senza letture si comporta come uno appena creato. È la direzione sicura
// — chiede una misura invece di sostenere che ce n'è una.
// docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md
// ⛔ E LA SECONDA FACCIA È LA SOGLIA CHE NON C'È (decisione 16, approvata dal
// fondatore il 02/08). Fin qui la riga del rapporto diceva
// `+mm.soglia || 1`: non una scelta scritta da qualcuno, un ripiego messo per
// non dividere per zero. Misurato su un punto senza soglia, prima:
//   · 0,8 → «Conforme», verde;
//   · 1,2 → «Superamento», rosso;
//   · soglia −3 → rapporto 1200, cioè un superamento del 120.000% inventato
//     (`Math.max(0.001, -3)` fa 0,001: il ripiego non copriva nemmeno i
//     negativi).
// Cioè sbagliava in tutt'e due i versi sullo stesso punto: un verde
// tranquillizzante a chi non ha nessun limite da rispettare, e un allarme
// inventato a chi sta sopra un numero che nessuno ha scelto.
// Senza soglia non si può dire né conforme né non conforme: la risposta è uno
// STATO A SÉ, «Senza soglia», giallo come gli altri avvisi di questa app —
// non un allarme (nessuno ha sbagliato una misura), ma una cosa da sistemare.
// La bandiera `calcolabile` viaggia col rapporto e la leggono la pagina (che
// senza di lei scriverebbe «0%», perché `Math.round(null*100)` fa zero) e
// `prioritaConformita` qui sotto.
// ⚠️ L'ORDINE FRA I DUE AVVISI È UNA SCELTA: «mai misurato» viene PRIMA.
// Un punto senza letture E senza soglia è tutt'e due le cose; la prima da fare
// resta registrare una misura, ed è anche il comportamento che c'era, quindi
// nessun punto già in archivio cambia badge per un motivo diverso da questo.
// ⚠️ La guardia `Math.max(0.001, …)` resta anche se adesso la soglia è > 0 per
// costruzione: con una soglia subnormale (1e-320) la divisione darebbe
// `Infinity`, e `Math.round(Infinity*100)` finisce sulla pagina come
// «Infinity%».
export function statoMisura(m) {
  const mm = m || {};
  const v = +mm.valore;
  if (!ultimaLettura(mm) && !(Number.isFinite(v) && v > 0))
    return { cls: "warn", label: "Mai misurato", stato: "mai", ratio: null, calcolabile: false };
  if (!sogliaValida(mm.soglia))
    return { cls: "warn", label: "Senza soglia", stato: "senza-soglia", ratio: null, calcolabile: false };
  const r = (+mm.valore || 0) / Math.max(0.001, +mm.soglia);
  if (r >= 1) return { cls: "danger", label: "Superamento", stato: "superamento", ratio: r, calcolabile: true };
  if (r >= 0.9) return { cls: "warn", label: "Attenzione", stato: "attenzione", ratio: r, calcolabile: true };
  return { cls: "ok", label: "Conforme", stato: "conforme", ratio: r, calcolabile: true };
}
// ⛔ Alias di `giorniTra`: lo stesso involucro di due righe era scritto anche
// in Conti. Un alias non è una seconda implementazione.
export const giorni = giorniTra;
// Riepilogo di conformità: quanti monitoraggi sono conformi / in
// attenzione / in superamento, a colpo d'occhio. Usa statoMisura (stessa
// logica dei badge). Funzione pura e testabile.
// ⛔ E UN PUNTO SENZA SOGLIA NON STA IN NESSUNA DELLE TRE (decisione 16). Non è
// conforme — non c'è nessun limite rispetto a cui esserlo —, non è in
// attenzione e non è un superamento: esce dal numeratore E dal denominatore
// della conformità, e per questo ha un suo conto che chi mostra deve
// DICHIARARE. `giudicabili` è quel denominatore, scritto una volta qui invece
// che ricalcolato a mano da ogni schermata: «3 conformi su 5 punti» e «3
// conformi su 3 giudicabili» sono due frasi diverse, e la seconda è quella
// vera.
export function riepilogoConformita(monitoraggi) {
  const r = { conformi: 0, attenzione: 0, superamento: 0, maiMisurati: 0,
    senzaSoglia: 0, giudicabili: 0, totale: (monitoraggi || []).length };
  for (const m of monitoraggi || []) {
    const st = statoMisura(m);
    // ⛔ Lo `stato` si guarda PRIMA della classe: «mai misurato», «senza data» e
    // «senza soglia» condividono il giallo con «Attenzione», e leggendo solo
    // `cls` finirebbero contati come punti vicini alla soglia — un'altra
    // affermazione falsa, solo in un'altra direzione.
    if (st.stato === "mai") r.maiMisurati++;
    else if (st.stato === "senza-soglia") r.senzaSoglia++;
    else if (st.cls === "danger") r.superamento++;
    else if (st.cls === "warn") r.attenzione++;
    else r.conformi++;
  }
  r.giudicabili = r.conformi + r.attenzione + r.superamento;
  return r;
}

// I punti su cui l'app NON PUÒ dire niente perché nessuno ha scritto una
// soglia — con la soglia che vale davvero, cioè guardando anche il ricettore
// (un punto senza soglia propria collegato a un ricettore che ne ha una NON è
// senza soglia: quella del ricettore è il limite scritto per quella casa).
// Serve dove la frase rischia di essere tranquilla: il ponte con Scudo dice
// «nessun punto è oltre soglia», ed è vero solo per i punti una soglia ce
// l'hanno.
export function puntiSenzaSoglia(monitoraggi, ricettori) {
  return (monitoraggi || [])
    .filter(m => m && sogliaEfficace(m, ricettori).valore == null)
    .map(m => ({ id: m.id, nome: m.nome || "Punto di misura",
      n: (((m || {}).letture) || []).length }));
}

// Data GG/MM/AAAA da ISO (formattazione pura per i testi delle allerte).
function dataIt(iso) {
  const s = String(iso || "").slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || "—");
}

// PRIORITÀ DI CONFORMITÀ per la dashboard: un'unica lista ordinata di allerte
// che unisce (1) i monitoraggi non conformi — superamento (danger) o attenzione
// (warn) — e (2) gli adempimenti ambientali: SCADUTI = danger (un termine
// mancato con l'ente è una criticità, non un semplice avviso — prima erano
// mostrati come "warn"), in scadenza entro 30 gg = warn. Danger prima. Ogni
// voce { gravita, categoria, titolo, dettaglio, badge }; titolo/dettaglio sono
// testo grezzo (nome misura/nota/ente) → escapare dove mostrati. Pura e
// testabile; `oggi` iniettabile.
export function prioritaConformita(monitoraggi, adempimenti, oggi = new Date()) {
  const items = [];
  for (const m of monitoraggi || []) {
    const st = statoMisura(m);
    if (st.cls === "ok") continue;
    const u = unitaMisura(m);
    items.push({ gravita: st.cls, categoria: "misura",
      titolo: m.nome || "Misura",
      // il numero era incollato grezzo: 36.8 col punto inglese, sulla prima
      // schermata dell'app, accanto a numeri scritti con la virgola
      // ⛔ E su un punto MAI MISURATO il numero non va scritto affatto: `valore`
      // lì è lo zero con cui il punto nasce, e «0 µg/m³ / soglia 40» è la riga
      // più tranquilla che si possa leggere — accanto a un badge che dice
      // «Mai misurato». Due frasi opposte sulla stessa riga: quella con la
      // cifra è la sola che si guarda.
      // ⛔ E SU UN PUNTO SENZA SOGLIA non si scrive «/ soglia —»: quel trattino
      // è l'assenza travestita da dato, appesa a una cifra che sembra il
      // risultato di un confronto. Si dice che cosa manca, e basta.
      // La bandiera `calcolabile` è la stessa che porta il rapporto: qui è
      // letta per decidere se una frase con un confronto ha senso.
      // ⚠️ CORTA DI PROPOSITO, e la lunghezza l'ha decisa lo SCATTO. La prima
      // stesura spiegava anche il perché («ma non c'è un limite rispetto a cui
      // giudicarlo»): la riga di dettaglio è tagliata a due righe
      // (`-webkit-line-clamp:2`), e a 430 px quella coda finiva sotto il taglio
      // insieme alla nota del punto — cioè testo morto. La spiegazione vive
      // dove si può leggere: il riepilogo dei Monitoraggi e il report.
      // ⛔ E L'UNITÀ È QUELLA CHE L'APP MOSTRA, non il campo grezzo: `m.unita`
      // è quello che l'utente ha scritto, `unitaMisura` è quello che il
      // grafico, il report e il file per l'ARPA scrivono — con il ripiego per
      // tipo di grandezza. Un punto senza unità entra davvero
      // (`parseMonitoraggiCsv` accetta la colonna vuota), e su di lui questa
      // riga — la prima schermata dell'app — diceva «41  / soglia 40»: la
      // cifra nuda, con due spazi, mentre il file per l'ARPA sulla stessa
      // misura scrive «µg/m³». Il terzo ramo per giunta scriveva lo spazio
      // anche senza unità, dove gli altri due la guardia ce l'avevano.
      dettaglio: (st.stato === "mai"
        ? "nessuna misura registrata" + (sogliaValida(m.soglia)
            ? " · soglia " + numeroIt(m.soglia) + (u ? " " + u : "")
            : " · e nessuna soglia impostata")
        : !st.calcolabile
        ? "nessuna soglia impostata · ultimo valore " + numeroIt(m.valore) + (u ? " " + u : "")
        : numeroIt(m.valore) + (u ? " " + u : "") + " / soglia " + numeroIt(m.soglia))
        + (m.nota ? " · " + m.nota : ""),
      badge: st.label });
  }
  for (const a of adempimenti || []) {
    const g = giorni(a.scadenza, oggi);
    if (!Number.isFinite(g) || g > 30) continue;
    const scaduto = g < 0;
    items.push({ gravita: scaduto ? "danger" : "warn", categoria: "adempimento",
      titolo: a.titolo || "Adempimento",
      dettaglio: (a.ente && a.ente !== "—" ? a.ente + " · " : "") + "entro " + dataIt(a.scadenza),
      badge: scaduto ? "scaduto da " + (-g) + " gg" : g + " gg" });
  }
  const rank = { danger: 0, warn: 1 };
  const catRank = { misura: 0, adempimento: 1 };
  return items.sort((x, y) =>
    (rank[x.gravita] - rank[y.gravita]) ||
    (catRank[x.categoria] - catRank[y.categoria]) ||
    String(x.titolo).localeCompare(String(y.titolo), "it"));
}

// ------------------------------------------------------------
// SERIE STORICA di un punto di misura (F5). Lo storico `letture`
// esisteva già nei dati ma non si vedeva da nessuna parte: qui si
// calcola la GEOMETRIA del grafico (funzione pura, testabile), il
// disegno SVG lo fa la pagina. Nessuna libreria esterna.
// ------------------------------------------------------------

// Unità di ripiego per tipo di grandezza, usata SOLO se il punto non
// ha già la sua unità scritta dall'utente (che ha sempre la priorità).
export const UNITA_TIPO = {
  vibrazioni: "mm/s",
  airblast: "dB",
  rumore: "dB(A)",
  polveri: "µg/m³",
  acque: "mg/l",
};
export function unitaMisura(m) {
  const u = String((m && m.unita) || "").trim();
  return u || UNITA_TIPO[String((m && m.tipo) || "").trim().toLowerCase()] || "";
}

// Numero in formato italiano (virgola decimale), senza decimali inutili.
// Di serie i numeri da cento in su arrotondano all'unità: è la regola di
// lettura di tutta l'app e non si cambia, perché «1.286,00 letture» non
// aggiunge niente. Ma su ALCUNI numeri quell'arrotondamento cancella una
// misura: la distanza del ricettore scritta 312,5 m diventava «313 m» sulla
// riga della volata, cioè nel registro che va all'ente. Per quei casi si
// chiedono i decimali esplicitamente col secondo argomento; per tutti gli
// altri il comportamento è identico a prima, quindi nessuna chiamata
// esistente cambia di una virgola.
// `null` e `""` NON sono zero. `+null` fa 0, quindi la funzione scriveva «0»
// per un dato che manca: su un rapporto di monitoraggio «0 µg/m³» è un fatto,
// e falso, mentre il trattino dice la verità — non è stato misurato. Che fosse
// un difetto e non una scelta lo diceva l'incoerenza: `undefined` dava già il
// trattino, `null` no.
export function numeroIt(v, dec) {
  if (v === null || v === "") return "—";
  const n = +v;
  if (!Number.isFinite(n)) return "—";
  const d = dec == null ? (Math.abs(n) >= 100 ? 0 : 2) : Math.max(0, Math.min(6, dec | 0));
  return n.toLocaleString("it-IT", { maximumFractionDigits: d, useGrouping: true });
}

/* LA FRASE CHE UNO SCREEN READER LEGGE SOTTO UN GRAFICO DI SERIE — in un
   posto solo, e nel modulo perché è qui che una prova può guardarla.
   ⛔ ERA SCRITTA TRE VOLTE NELLA PAGINA, e ognuna delle tre teneva la guardia
   su una metà DIVERSA: la serie storica di un punto e il grafico del report
   accordavano «letture» e dicevano «1 superamenti»; l'andamento del ricettore
   accordava «superamenti» e diceva «1 letture» — e sopra di lui il commento
   spiegava proprio che «1 superamenti» lì si SENTE. Tre copie della stessa
   didascalia, tre difetti complementari: è la copia debole di CLAUDE.md
   applicata a una frase, nel posto dove il documento si compone.
   ⚠️ `apertura` È UN ARGOMENTO, NON UNA SECONDA FUNZIONE: le tre frasi
   cominciano in tre modi («Serie storica di X», «Andamento di X nel periodo»,
   «Andamento di X») e da lì in poi sono identiche. Anche `dal`/`al` e `max`
   sono facoltativi per la stessa ragione — chi non li ha non li passa, invece
   di avere una funzione sua. Pura. */
export function ariaSerie(apertura, s) {
  const d = s || {};
  const u = d.unita ? " " + d.unita : "";
  return String(apertura) + ": " + conta(d.n, "lettura", "letture")
    + (d.dal && d.al ? " dal " + d.dal + " al " + d.al : "")
    + (d.max != null ? ", massimo " + numeroIt(d.max) + u : "")
    + (d.soglia != null
        ? ", soglia " + numeroIt(d.soglia) + u + ", " + conta(d.superamenti, "superamento", "superamenti")
        : "")
    + ".";
}

// ══════════════════════════════════════════════════════════════════════
// NUMERI SCRITTI A MANO — la virgola decimale, che in cava è la norma
// Chi compila questi campi è un fochino italiano, e un fochino italiano
// scrive «2,4». Fino a ieri i campi decimali erano <input type="number">,
// e quel tipo di campo NON è neutro rispetto alla virgola: la specifica
// HTML gli impone come valore un «valid floating-point number», cioè col
// PUNTO. Che il browser accetti o no la virgola digitata dipende dal
// locale del browser (non dalla pagina, quindi `lang="it"` non c'entra e
// non risolve): dove non la accetta, il carattere non entra e `.value`
// consegna la STRINGA VUOTA. Il `replace(",", ".")` che il codice faceva
// non vedeva mai la virgola, perché la virgola era già stata buttata via
// prima. Risultato: la PPV misurata — il dato da cui nasce la legge di
// sito — si perdeva in silenzio, senza un errore da leggere.
// Da qui in poi i campi decimali sono <input type="text"
// inputmode="decimal">: sul telefono resta la tastiera numerica, il
// carattere digitato arriva SEMPRE al codice, e il numero lo legge questa
// funzione. Il prezzo da pagare è che min/max/step del browser non
// valgono più: la validazione è nostra, ed è qui.
// Accetta «2,4» · «2.4» · «1.250,75» · «1,250.75» · spazi intorno.
// Ritorna { vuoto, ok, valore, grezzo, motivo } — chi chiama scrive il
// messaggio, perché il messaggio giusto dipende dal campo.
// Pura e testabile.
// ══════════════════════════════════════════════════════════════════════
// ⛔ RI-ESPORTATA, non ridichiarata: era scritta alla lettera in quattro
// moduli dati. Un alias non è una seconda implementazione.
// Vedi docs/NUMERI_MESSAGGIO_DOPPIO_202608.md
export const AVVISO_DECIMALE = AVVISO_DECIMALE_SHELL;

export function numeroDaCampo(testo, opts = {}) {
  // Delega al lettore CONDIVISO (`shared/deepwork-id-client/dw-shell.js`).
  // La convenzione era finita scritta quattro volte in modi diversi, e le sei
  // app leggevano «1.250» in tre modi: Flotta chiedeva sempre, Conti e Terra
  // risolvevano quando una sola lettura era possibile, e qui — come in Campo e
  // Genesi — passava 1,25 in silenzio. Stesso difetto delle unità in maiuscolo:
  // tre toppe locali per una causa sola. Qui resta solo ciò che è di
  // Sentinella: i quattro decimali con cui la PPV viene salvata sulla volata.
  return numeroScritto(testo, { decimali: 4, ...opts });
}

// Chiave di ordinamento di una lettura: data + ora. Le letture senza ora
// (inserite a mano) restano all'inizio del loro giorno — è il comportamento
// che c'era prima, quindi nessuna serie storica esistente cambia forma.
export function chiaveOrdine(l) {
  return String((l && l.data) || "").slice(0, 10) + " " + String((l && l.ora) || "");
}

// Data GG/MM/AAAA (o GG/MM) da ISO, per le etichette del grafico.
function dataBreve(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ""));
  return m ? `${m[3]}/${m[2]}` : String(iso || "");
}

// Passo "gradevole" per le tacche dell'asse dei valori (1, 2, 2.5, 5, 10 × 10^n).
function passoGradevole(grezzo) {
  if (!(grezzo > 0)) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(grezzo)));
  const n = grezzo / e;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * e;
}

const r1 = (n) => Math.round(n * 10) / 10;

// Geometria della serie storica di un punto di misura.
// Ritorna { vuoto, n, unita, soglia, box, punti, path, xTicks, yTicks,
//           lineaSoglia, superamenti, mostraPunti, max, ultimo, dal, al }.
// Regole: l'asse dei valori parte da 0; la SOGLIA è quella impostata
// dall'utente sul punto (mai inventata) e rientra nella scala solo se
// non schiaccia la linea dei dati — altrimenti resta segnalata come
// `fuoriScala`. Le etichette delle date si diradano da sole quando le
// letture sono tante, e i pallini spariscono sopra `maxPunti` lasciando
// solo la linea e i superamenti (che restano SEMPRE marcati).
export function serieStorica(m, opts = {}) {
  const w = +opts.larghezza || 320, h = +opts.altezza || 170;
  const maxEtichette = Math.max(2, +opts.maxEtichette || 6);
  const maxPunti = Math.max(2, +opts.maxPunti || 30);
  const padL = 42, padR = 12, padT = 14, padB = 26;
  const box = { w, h, x0: padL, y0: padT, x1: w - padR, y1: h - padB };
  const unita = unitaMisura(m);
  const sogliaRaw = +((m || {}).soglia);
  const soglia = Number.isFinite(sogliaRaw) && sogliaRaw > 0 ? sogliaRaw : null;
  // Ordinamento per data E ORA: con l'import dallo strumento (T1) nello stesso
  // giorno arrivano molte letture, e una serie storica fuori ordine
  // racconterebbe un andamento che non è mai esistito.
  const letture = (((m || {}).letture) || [])
    .map(l => ({ data: String((l && l.data) || "").slice(0, 10), ora: String((l && l.ora) || ""), valore: +((l || {}).valore) }))
    .filter(l => Number.isFinite(l.valore))
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });

  const base = {
    vuoto: letture.length === 0, n: letture.length, unita, soglia, box,
    punti: [], path: "", xTicks: [], yTicks: [], lineaSoglia: null,
    superamenti: 0, mostraPunti: true, max: null, ultimo: null, dal: "", al: "",
  };
  if (!letture.length) return base;

  const valori = letture.map(l => l.valore);
  const vmax = Math.max(...valori);
  const sogliaInScala = soglia != null && (vmax <= 0 || soglia <= vmax * 2.5);
  const alto = Math.max(vmax, sogliaInScala ? soglia : 0) * 1.1;
  const passo = passoGradevole((alto || 1) / 4);
  const yMax = Math.max(passo, Math.ceil((alto || passo) / passo) * passo);
  const px = (i) => letture.length === 1
    ? (box.x0 + box.x1) / 2
    : box.x0 + (i * (box.x1 - box.x0)) / (letture.length - 1);
  const py = (v) => box.y1 - (Math.min(Math.max(v, 0), yMax) / yMax) * (box.y1 - box.y0);

  const punti = letture.map((l, i) => ({
    x: r1(px(i)), y: r1(py(l.valore)), valore: l.valore, data: l.data, ora: l.ora,
    dataIt: dataIt(l.data) + (l.ora ? " " + l.ora : ""), etichetta: numeroIt(l.valore) + (unita ? " " + unita : ""),
    oltre: soglia != null && l.valore >= soglia,
  }));

  // etichette dei tempi diradate: prima, ultima e alcune intermedie
  const passoEt = Math.max(1, Math.ceil((letture.length - 1) / (maxEtichette - 1)) || 1);
  const idx = [];
  for (let i = 0; i < letture.length; i += passoEt) idx.push(i);
  if (idx[idx.length - 1] !== letture.length - 1) idx.push(letture.length - 1);
  const xTicks = idx.map(i => ({ x: punti[i].x, label: dataBreve(letture[i].data) }));

  const yTicks = [];
  for (let v = 0; v <= yMax + passo / 1000; v += passo) yTicks.push({ y: r1(py(v)), valore: v, label: numeroIt(v) });

  return {
    ...base,
    punti,
    path: punti.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" "),
    xTicks, yTicks,
    lineaSoglia: soglia == null ? null : {
      y: r1(py(soglia)), valore: soglia, fuoriScala: !sogliaInScala,
      label: numeroIt(soglia) + (unita ? " " + unita : ""),
    },
    superamenti: punti.filter(p => p.oltre).length,
    mostraPunti: letture.length <= maxPunti,
    max: vmax, ultimo: letture[letture.length - 1].valore,
    dal: dataIt(letture[0].data), al: dataIt(letture[letture.length - 1].data),
  };
}

// Import monitoraggi (sensori/centraline) da CSV (onboarding: caricare i punti
// di misura esistenti con soglia e ultimo valore invece di crearli a mano).
// Colonne: nome;tipo;valore;soglia;unita[;nota] (header opzionale). Tiene solo
// le righe con nome, valore numerico ≥ 0 e soglia > 0 (servono per calcolare
// lo stato conforme/attenzione/superamento). Pura e testabile.
export function parseMonitoraggiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, tipo, valore, soglia, unita, nota] = parseCsvLine(r);
      return {
        nome: (nome || "").trim(),
        tipo: (tipo || "").trim() || "",
        valore: numIt(valore),
        soglia: numIt(soglia),
        unita: (unita || "").trim() || "",
        nota: (nota || "").trim() || "",
      };
    })
    .filter(m => m.nome && Number.isFinite(m.valore) && m.valore >= 0 && Number.isFinite(m.soglia) && m.soglia > 0);
}

// IMPORT DEI RICETTORI DA CSV.
// Perché esiste: il ricettore è l'anagrafica su cui poggia tutto il
// monitoraggio — è quello che trasforma «una misura» in «una misura IN UN PUNTO
// CHE HA UN NOME», che è ciò che chiede chi legge il report. Fino al 30/07 era
// l'unica cosa di Sentinella che si poteva solo battere a mano, e una cava che
// ha già l'elenco delle case e dei confini in un foglio lo riscriveva riga per
// riga.
//
// Colonne: nome;tipo;distanza;classe;soglia;unita;nota
//
// ⛔ LA SOGLIA CHE MANCA RESTA MANCANTE — e qui vale doppio rispetto a
// qualunque altro campo. La soglia di un ricettore è un numero di SICUREZZA:
// inventarne uno "ragionevole" vorrebbe dire dichiarare conforme o non conforme
// una misura sulla base di un valore che nessuno ha scelto. La soglia propria
// del ricettore è già facoltativa nel prodotto (`sogliaEfficace` gestisce il
// caso), quindi qui basta non riempirla: se il file non ce l'ha, resta `null` e
// il ricettore vale comunque come anagrafica.
// ⚠️ Nessuna curva e nessun valore di riferimento vengono toccati da questa
// funzione: legge quello che il cliente scrive nel suo file, e basta.
//
// Tipo e classe si confrontano coi vocabolari dell'app (`TIPI_RICETTORE`,
// `CLASSI_ACUSTICHE`): quello che non si riconosce diventa «altro» per il tipo e
// resta vuoto per la classe — meglio un campo vuoto, che si vede e si corregge,
// di una classe acustica sbagliata, che decide una soglia.
export function parseRicettoriCsv(text) {
  const tipi = TIPI_RICETTORE.map(t => t.chiave);
  const classi = CLASSI_ACUSTICHE.map(c => c.chiave);
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"))
    .map(r => {
      const [nome, tipo, distanza, classe, soglia, unita, nota] = parseCsvLine(r);
      const ti = (tipo || "").trim().toLowerCase();
      const cl = (classe || "").trim().toUpperCase();
      /* ⛔ `di >= 0` FACEVA ENTRARE LO ZERO, e uno zero entrato qui è un
         ricettore che nessuna schermata sa mostrare: tutte e quattro
         chiedono `> 0` e scrivono «distanza non indicata». Restava un dato
         morto in archivio che il file esportato però riscriveva come `0`
         metri. La decisione è una: la prende `distanzaDelRicettore`. */
      const di = distanzaDelRicettore({ distanza: numIt(distanza) });
      const so = sogliaDelRicettore({ soglia: numIt(soglia) });
      return {
        nome: (nome || "").trim(),
        tipo: tipi.includes(ti) ? ti : "altro",
        distanza: di,
        classe: classi.includes(cl) ? cl : "",
        soglia: so,
        unita: (unita || "").trim() || "",
        nota: (nota || "").trim() || "",
      };
    })
    .filter(r => r.nome);
}

/* ⛔ «E LE RIGHE CHE NON SONO ENTRATE?» — IL LETTORE LE CANCELLA E LA PAGINA
   NON POTREBBE DIRLO NEMMENO VOLENDO.
   ══════════════════════════════════════════════════════════════════════════
   Il `.filter` sta DENTRO il lettore, che restituisce solo i sopravvissuti:
   chi chiama riceve un elenco più corto e non ha modo di sapere né quante
   righe mancano né perché. Chi importa 200 righe e ne vede 180 non sa quali
   venti — è l'assenza di un dato nella sua forma più tranquilla, cioè il
   principio del fondatore applicato all'INGRESSO invece che all'uscita.
   ⚠️ E qui la riga persa è un PUNTO SENSIBILE che per l'app non esiste: nessuna
   misura gli si può collegare, non compare in nessun report di conformità, e
   il conto dei ricettori — che è quello che si porta all'ente — è più basso del
   vero. Un ricettore mancante non fa suonare niente: fa TACERE.
   La forma è quella di `scartiFattureCsv` in Conti (13/08), che a sua volta
   viene da `rientroRilievi` di Terra: `persi: [{ nome, ragione }]`. I conti si
   chiamano `lette` ed `entrano` perché il file è di qualcun altro.
   ⛔ IL VERDETTO NON SI RISCRIVE: lo si chiede al lettore riga per riga
   (`parseRicettoriCsv(riga).length`). La scala delle ragioni SPIEGA e basta.
   ⚠️ QUI SI PERDE IN UN CASO SOLO — il nome — ed è la forma MITE del difetto,
   non la sua assenza: misurato il 13/08, 3 righe scritte → 2 entrate. Tutto il
   resto è facoltativo per una decisione già presa e scritta sopra: la SOGLIA
   che manca resta mancante (è un numero di sicurezza e non si inventa), la
   distanza a zero non entra ma non fa cadere la riga. Quindi non c'è nessuna
   ragione da spiegare oltre all'identità.
   ⛔ E LA RIGA TUTTA VUOTA NON È UNA PERDITA: un foglio di calcolo salva le
   righe di coda come `;;;;;;`, che dopo il `trim` non è vuota e arriva fino al
   filtro sul nome. Si contano a parte (`vuote`) e non si dicono: accusare
   l'utente di un difetto del suo Excel è il falso allarme che insegna a non
   guardare i messaggi. */
export function scartiRicettoriCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "nome"));
  const persi = [];
  let nRiga = 0, vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseRicettoriCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    persi.push({ nome: "riga " + nRiga, ragione: "manca il nome del ricettore" });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

/* PERCHÉ UNA DATA SCRITTA «01/09/2026» NON ENTRA, E PERCHÉ SI È DECISO COSÌ.
   ══════════════════════════════════════════════════════════════════════════
   ⛔ LA DECISIONE, presa con la misura e non per riflesso (13/08). Un foglio
   di calcolo italiano una data la scrive `01/09/2026` da sé, quindi il caso
   NON è di scuola: chi si fa mandare le scadenze dal consulente in un foglio e
   le reimporta qui non ne vede entrare nessuna. Le uscite erano due —
   accettarla, oppure rifiutarla DICENDOLO — e un rifiuto silenzioso non è
   nessuna delle due.
   Si rifiuta, dicendolo, per un numero: nel 2026 **132 date su 365 (36,2%)**
   si leggono in due modi diversi e tutti e due esistono (`01/09` è il 1°
   settembre in Italia e il 9 gennaio altrove), e nel file non c'è NIENTE che
   dica quale delle due sia. Accettarle vorrebbe dire spostare in silenzio più
   di un terzo delle date di un registro che va all'ARPA — che è esattamente il
   difetto per cui `dataISOEsiste` è nata il 03/08: «una scadenza spostata di
   due giorni in silenzio è peggio di una scartata a voce alta». Qui lo scarto
   smette di essere silenzioso, e questo era il difetto.
   ⚠️ E una seconda ragione, strutturale: in casa NON c'è nessun lettore di
   date all'italiana. Provato cercando in `shared` e in tutti i moduli dati
   una qualunque espressione regolare che legga giorno, mese e anno separati
   da barre o punti (`grep -rnE` sui file `.js`, con la forma «una o due
   cifre, separatore, una o due cifre, separatore, due o quattro cifre»):
   **zero righe**. Il comando per esteso sta nella consegna del cantiere —
   qui no, perché contiene i caratteri che chiuderebbero questo commento. Scriverne uno sarebbe una regola
   che serve a due app (Scudo ha lo stesso caso sullo scadenzario), e una
   regola che serve a due app vive in `shared/`, non in due moduli.
   ⚠️ IL MESSAGGIO NON PROPONE LA CONVERSIONE — non scrive «volevi dire
   2026-09-01?» — proprio perché quale sia il giorno non lo sa: dice il formato
   che serve e mostra quello che ha trovato.
   ⛔ E LE PAROLE SONO QUELLE CHE LE NOVE FUNZIONI DI B5 HANNO GIÀ, non nuove:
   censite, le loro diciassette ragioni sono convergute su quattro forme, e le
   due che servono qui sono «la data non è stata scritta» e «la data non
   esiste». La data all'italiana è il terzo caso di quella scala — c'è qualcosa
   e non si legge — quindi porta la forma già usata da sei ragioni, con appesa
   la sola cosa che serve per rimediare. Niente punto finale: la ragione viene
   composta dentro una frase più lunga.
   ⚠️ Questa spiegazione serve a DUE app e finché sta scritta due volte può
   divergere: la difesa è in `run-kpi.mjs`, che pretende da Sentinella e Scudo
   la STESSA frase sullo stesso valore. La sua casa vera è `shared/`, e ci sta
   scrivendo un altro cantiere. */
function ragioneData(grezza) {
  const s = String(grezza == null ? "" : grezza).trim();
  if (!s) return "la data non è stata scritta";
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return "la data non esiste";
  return "la data non si legge: va scritta AAAA-MM-GG, non «" + s + "»";
}

export function kpiFrom(monitoraggi, adempimenti) {
  return {
    attivi: monitoraggi.length,
    superamenti: monitoraggi.filter(m => statoMisura(m).cls === "danger").length,
    adempimenti30: adempimenti.filter(a => giorni(a.scadenza) <= 30).length,
  };
}

// Import degli ADEMPIMENTI ambientali da CSV (onboarding: caricare la lista di
// scadenze fornita dal consulente — AUA/AIA/ARPA, fonometrie, relazioni…).
// Colonne: titolo;ente;scadenza (header opzionale). Tiene solo le righe con
// titolo ed una scadenza valida (AAAA-MM-GG); ente vuoto → "—". titolo/ente
// sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseAdempimentiCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "titolo"))
    .map(r => {
      /* Le due colonne in coda sono FACOLTATIVE e dicono che periodo copre
         l'adempimento (vedi `periodoAdempimento`). Un file scritto con le tre
         colonne di sempre entra identico a prima: le due chiavi restano
         `null`, cioè «non dichiarato», che è diverso da zero — uno zero
         dedotto sposterebbe il periodo in avanti in silenzio. */
      const [titolo, ente, scadenza, periodoMesi, giorniConsegna] = parseCsvLine(r);
      const dichiarato = (c) => {
        const v = numeroDichiarato(String(c == null ? "" : c).trim().replace(",", "."));
        return v == null ? null : v;
      };
      return {
        titolo: (titolo || "").trim(),
        ente: (ente || "").trim() || "—",
        scadenza: (scadenza || "").trim(),
        periodoMesi: dichiarato(periodoMesi),
        giorniConsegna: dichiarato(giorniConsegna),
      };
    })
    // `dataISOEsiste` e non la sola forma: «2026-13-45» e «2026-02-30» hanno
    // la forma giusta e non esistono — il primo entrerebbe e non scadrebbe
    // mai, il secondo scivolerebbe al 2 marzo. (03/08)
    .filter(a => a.titolo && dataISOEsiste(a.scadenza));
}

/* Le righe di scadenzario ambientale che NON entrano, con la ragione — vedi il
   blocco lungo sopra `scartiRicettoriCsv` per la forma e per il perché.
   ⚠️ Misurato il 13/08: **5 righe scritte → 1 entrata**. Delle quattro cadute,
   una era senza titolo, una senza data, una con `2026-13-45` — tutte e tre
   giuste — e la quarta era `01/09/2026`, cioè il formato che un foglio di
   calcolo italiano scrive da sé. Ed è il file che arriva dal consulente.
   ⚠️ E l'adempimento perso è quello che NON scade: non compare in
   `adempimenti30`, non entra nella conformità, non fa suonare niente. Il
   principio del fondatore rovesciato — l'assenza di un dato letta come dato
   favorevole — applicato all'ingresso.
   ⛔ L'ORDINE DELLE DUE RAGIONI segue quello del filtro (`a.titolo &&
   dataISOEsiste`): prima l'identità, poi la data. Se si spiegasse la data a una
   riga che non ha nemmeno il titolo, chi legge correggerebbe la cosa sbagliata.
   ⚠️ Le due colonne in coda (periodo e giorni di consegna) sono facoltative per
   decisione scritta sopra e non fanno perdere niente: non hanno una ragione. */
export function scartiAdempimentiCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "titolo"));
  const persi = [];
  let nRiga = 0, vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseAdempimentiCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    const titolo = (c[0] || "").trim();
    persi.push({
      nome: titolo || "riga " + nRiga,
      ragione: !titolo ? "manca il titolo dell'adempimento" : ragioneData(c[2]),
    });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

// Registro delle VOLATE (brogliaccio di brillamento): riepilogo per il quadro.
// In Italia il registro delle volate è un adempimento; qui è il log degli
// eventi con carica e distanza. Ritorna: totale, quante questo mese, kg totali
// del mese, data dell'ultima volata, e quante hanno avuto una contestazione.
// Pura e testabile; `oggi` iniettabile (mese-calendario locale).
// ⛔ QUI DENTRO ENTRANO SOLO LE VOLATE ESEGUITE (T9). Una volata soltanto
// PREVISTA non è un evento: i suoi chili non sono stati sparati e la sua data
// non è ancora accaduta. Contarla falserebbe «questo mese», i kg del mese e
// l'ultima volata — numeri che finiscono in un documento verso gli enti. Le
// previste si contano a parte, con `riepilogoPreviste`.
// COMPATIBILITÀ: una volata senza il campo `stato` (tutte quelle registrate
// prima che esistesse) vale come ESEGUITA, quindi su uno storico esistente
// questa funzione restituisce esattamente gli stessi numeri di prima.
/* IL NUMERO CHE QUALCUNO HA DICHIARATO, oppure `null`. Scritta una volta sola
   perché `Number.isFinite(+x)` da sola NON risponde a questa domanda: `+null`
   fa **0** e `+""` fa **0**, e `Number.isFinite(0)` risponde **true**. Cioè il
   controllo che sembra il più severo lascia passare le due forme più comuni
   dell'assenza — ed è successo mentre si correggeva proprio questo difetto:
   tre prove nuove su cinque sono cadute qui il 03/08, in un blocco scritto per
   toglierlo. `csvRegistroVolate` la stessa regola ce l'aveva già, scritta
   dentro di sé come `cella`: adesso la chiama, così è una sola. */
/* ✅ TRASLOCATA IN `shared/dw-ponti.js` il 07/08, quando è servita anche a
   Conti: qui resta l'alias col nome di sempre, così le trenta chiamate di
   questo file non cambiano. Un alias non è una seconda implementazione, e la
   prova pretende l'IDENTITÀ (`sentinella.numeroDichiarato === ponti.…`), non
   il comportamento: due copie uguali oggi divergono domani senza che nessuno
   lo veda. */
export { numeroDichiarato } from "../../shared/dw-ponti.js";
import { numeroDichiarato } from "../../shared/dw-ponti.js";

export function riepilogoVolate(volate, oggi = new Date()) {
  const list = (volate || []).filter(v => !volataPrevista(v));
  const o = new Date(oggi);
  const ym = `${o.getFullYear()}-${String(o.getMonth() + 1).padStart(2, "0")}`;
  const questoMese = list.filter(v => (v.data || "").slice(0, 7) === ym);
  /* ⛔ I CHILI CHE NESSUNO HA DICHIARATO NON SONO ZERO CHILI (03/08). Qui c'era
     `s + (+v.kgTotali || 0)`: la stessa guardia che `csvRegistroVolate` si era
     già tolta di mezzo con la sua ragione scritta («una casella vuota non è uno
     zero»), e che `parseVolateCsv` evita apposta rispondendo `null` su una cella
     vuota o illeggibile. La riga della lista lo diceva già bene — «kg non
     dichiarati» — e il riepilogo SOPRA di lei sommava quelle stesse volate come
     zero e stampava un totale sicuro: la frase e il numero accanto si
     smentivano. Misurato su tre volate del mese con 120 kg dichiarati e due
     celle vuote: prima «questo mese: 3 (120 kg)», cioè 120 kg spalmati su tre
     volate come se fossero tutti i chili sparati.
     Adesso i chili si sommano solo su chi li dichiara e viaggiano con il loro
     denominatore: `kgMeseNoti` (quante volate del mese hanno un numero) e
     `kgMeseSenza` (quante no). Senza nemmeno una dichiarazione `kgMese` è
     `null` — «non lo so», la convenzione dell'ecosistema — e chi mostra scrive
     «—» invece di uno zero. La bandiera la legge la pagina: un totale parziale
     si annuncia come parziale. */
  const conKg = questoMese.map(v => numeroDichiarato((v || {}).kgTotali)).filter(k => k != null);
  const kgMese = conKg.length ? conKg.reduce((s, k) => s + k, 0) : null;
  let ultima = null;
  for (const v of list) {
    const d = (v.data || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!ultima || d > ultima)) ultima = d;
  }
  const contestazioni = list.filter(v => v.esito === "contestazione").length;
  return { totale: list.length, questoMese: questoMese.length, kgMese,
    kgMeseNoti: conKg.length, kgMeseSenza: questoMese.length - conKg.length,
    ultima, contestazioni };
}

// Import registro volate da CSV. Colonne: data;fronte;nFori;kgTotali;
// kgMaxRitardo;distanzaRicettore;esito[;note][;ppvMisurata;ppvFonte;ppvPunto;ppvOra]
// [;stato;ppvPrevista;ppvPrevLimite;ppvPrevNorma;ppvPrevFonte;airblastPrevisto;codiceVolata]
// (header opzionale). Tiene solo le righe con data valida (AAAA-MM-GG).
// esito: "contestazione" o "regolare" (default regolare). I numerici via numIt.
// fronte/note grezzi → escapare dove mostrati. Pura e testabile.
// Le quattro colonne della PPV misurata (T8) e le sette della volata prevista
// (T9) sono FACOLTATIVE e stanno in coda: un file esportato prima che
// esistessero si importa esattamente come prima — stessi campi, niente in più —
// e la volata resta senza PPV e ESEGUITA, che è quello che è.
// ⛔ La PPV PREVISTA non entra MAI nelle colonne della PPV misurata: sono due
// colonne diverse perché sono due cose diverse (vedi T9).
export function parseVolateCsv(text) {
  /* ⛔ `null`, non `0`: una casella vuota nel file non è una dichiarazione di
     zero. Rispondeva `0` — e da lì il registro, e il report per l'ente,
     scrivevano «0 m» dove nessuno aveva misurato niente. Vale anche per una
     cella illeggibile: `refertoDaVolata` la conta fra i motivi per cui la
     volata non è ancora un referto, che è la risposta giusta. */
  const num = (v) => { const n = numIt(v); return Number.isFinite(n) ? Math.max(0, n) : null; };
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, fronte, nFori, kgTotali, kgMaxRitardo, distanzaRicettore, esito, note,
             ppvMisurata, ppvFonte, ppvPunto, ppvOra,
             stato, ppvPrevista, ppvPrevLimite, ppvPrevNorma, ppvPrevFonte, airblastPrevisto,
             codiceVolata] = parseCsvLine(r);
      let v = {
        data: (data || "").trim(),
        fronte: (fronte || "").trim(),
        nFori: num(nFori), kgTotali: num(kgTotali), kgMaxRitardo: num(kgMaxRitardo),
        distanzaRicettore: num(distanzaRicettore),
        esito: (esito || "").trim().toLowerCase() === "contestazione" ? "contestazione" : "regolare",
        note: (note || "").trim(),
      };
      const ppv = campiPpvVolata(numIt(ppvMisurata), {
        fonte: (ppvFonte || "").trim().toLowerCase() === PPV_STRUMENTO ? PPV_STRUMENTO : PPV_MANUALE,
        punto: (ppvPunto || "").trim(), data: v.data, ora: (ppvOra || "").trim(),
      });
      if (ppv) v = { ...v, ...ppv };
      const prev = campiPrevisioneVolata(numIt(ppvPrevista), {
        limite: numIt(ppvPrevLimite), norma: ppvPrevNorma,
        fonte: ppvPrevFonte, airblast: numIt(airblastPrevisto),
      });
      if (prev) v = { ...v, ...prev };
      const st = statoDaTesto(stato);
      if (st) v = { ...v, stato: st };
      const cod = String(codiceVolata == null ? "" : codiceVolata).trim();
      if (cod) v = { ...v, codiceVolata: cod };
      return v;
    })
    .filter(v => dataISOEsiste(v.data));
}

/* Le righe del registro volate che NON entrano, con la ragione — vedi il
   blocco lungo sopra `scartiRicettoriCsv` per la forma e per il perché.
   ⛔ E QUI LA RIGA PERSA PESA PIÙ CHE ALTROVE: il registro delle volate è un
   ADEMPIMENTO, cioè un documento verso gli enti. Una volata che non entra non
   compare nel totale, non compare nei chili del mese, non sposta «l'ultima
   volata» e non si conta fra le contestazioni — e tutti quei numeri finiscono
   in un foglio che qualcuno firma. Un registro più corto del vero non ha
   nessun segno che lo dica: è un documento *tranquillo* e sbagliato.
   ⚠️ Misurato il 13/08: **5 righe scritte → 2 entrate**. Le tre cadute erano
   una data vuota, una `2026-13-45` e una `01/09/2026`.
   ⚠️ SI PERDE SOLO PER LA DATA, ed è giusto che sia così: fronte, fori, chili e
   distanza sono tutti facoltativi per una decisione scritta sopra (una cella
   vuota non è uno zero, e `refertoDaVolata` la conta fra i motivi per cui la
   volata non è ancora un referto). La data no: senza, la volata non ha un
   giorno in cui è avvenuta, e un evento senza quando non è un evento. */
export function scartiVolateCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"));
  const persi = [];
  let nRiga = 0, vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseVolateCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    /* il NOME che comparirà nel messaggio: chi apre il file cerca la volata per
       il suo codice, e solo se non c'è ripiega sul fronte e poi sulla riga. */
    const cod = String(c[18] == null ? "" : c[18]).trim(), fronte = (c[1] || "").trim();
    persi.push({ nome: cod || fronte || "riga " + nRiga, ragione: ragioneData(c[0]) });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

// ------------------------------------------------------------
// Libreria di SOGLIE NORMATIVE preimpostate: aiuta chi non è
// tecnico a impostare un sensore con un valore di riferimento
// corretto invece di doverlo cercare. I valori vengono da fonti
// secondarie concordanti (vedi ecosistema-vault "Soglie normative
// — riferimento per Sentinella"): NON sono verità legale, quindi
// ognuno porta l'avviso `daVerificare`. La soglia reale del sito
// dipende dalle prescrizioni autorizzative (AUA/AIA), dalla classe
// acustica comunale e dalla perizia. Il rumore ambientale NON è
// preimpostato: il limite assoluto dipende dalla classe acustica,
// quindi metterne uno fisso sarebbe fuorviante.
export const SOGLIE_PRESET = [
  { chiave: "din-res-fond",  tipo: "vibrazioni", etichetta: "Vibrazioni · residenziale, <10 Hz (DIN 4150-3)",        valore: 5,    unita: "mm/s",  fonte: "DIN 4150-3, fondazione riga 2" },
  { chiave: "din-res-alto",  tipo: "vibrazioni", etichetta: "Vibrazioni · residenziale, piano alto (DIN 4150-3)",    valore: 15,   unita: "mm/s",  fonte: "DIN 4150-3, piano più alto riga 2" },
  { chiave: "din-sens-fond", tipo: "vibrazioni", etichetta: "Vibrazioni · sensibile/storico, <10 Hz (DIN 4150-3)",   valore: 3,    unita: "mm/s",  fonte: "DIN 4150-3, fondazione riga 3" },
  { chiave: "din-ind-fond",  tipo: "vibrazioni", etichetta: "Vibrazioni · industriale/commerciale, <10 Hz (DIN 4150-3)", valore: 20, unita: "mm/s", fonte: "DIN 4150-3, fondazione riga 1" },
  { chiave: "usbm-intonaco", tipo: "vibrazioni", etichetta: "Vibrazioni · volata su intonaco, 4-15 Hz (USBM RI8507)", valore: 12.7, unita: "mm/s", fonte: "USBM RI 8507" },
  { chiave: "usbm-altafreq", tipo: "vibrazioni", etichetta: "Vibrazioni · volata, >40 Hz (USBM RI8507)",             valore: 50.8, unita: "mm/s",  fonte: "USBM RI 8507" },
  { chiave: "airblast-133",  tipo: "airblast",   etichetta: "Sovrappressione d'aria da volata (USBM RI8485)",        valore: 133,  unita: "dB",    fonte: "USBM RI 8485 / OSM" },
  { chiave: "pm10-giorno",   tipo: "polveri",    etichetta: "PM10 · media giornaliera (UE 2008/50/CE)",              valore: 50,   unita: "µg/m³", fonte: "Dir. UE 2008/50/CE" },
  { chiave: "pm10-anno",     tipo: "polveri",    etichetta: "PM10 · media annua (UE 2008/50/CE)",                    valore: 40,   unita: "µg/m³", fonte: "Dir. UE 2008/50/CE" },
  { chiave: "pm10-2030",     tipo: "polveri",    etichetta: "PM10 · media annua dal 2030 (UE 2024/2881)",            valore: 20,   unita: "µg/m³", fonte: "Dir. UE 2024/2881" },
];

// Ritorna il preset con quella chiave (o null). daVerificare è
// SEMPRE true: nessun valore normativo va usato senza controllo.
export function presetSoglia(chiave) {
  const p = SOGLIE_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, daVerificare: true } : null;
}

// Distanza scalata (scaled distance) di una volata: SD = R / √W, dove R è
// la distanza (m) dal punto di volata al ricettore e W la carica massima
// di esplosivo per ritardo (kg). È l'indicatore standard per prevedere le
// vibrazioni: più è alta, minore è il rischio di superare le soglie PPV.
// Ritorna null se i dati non sono validi (niente divisione per zero/NaN).
export function scaledDistance(distanzaM, caricaKg) {
  const r = +distanzaM, w = +caricaKg;
  if (!(r > 0) || !(w > 0)) return null;
  return r / Math.sqrt(w);
}

// Carica MASSIMA per ritardo (kg) per non scendere sotto una distanza scalata
// OBIETTIVO a una data distanza dal ricettore: è l'inverso di scaledDistance,
// W = (R / SD)². Serve in progettazione: "a questa casa, per restare sopra la
// SD di sicurezza, non superare X kg per ritardo". null se i dati non sono
// validi. La SD obiettivo va scelta dallo storico del sito / dalla soglia PPV.
export function caricaMax(distanzaM, sdObiettivo) {
  const r = +distanzaM, sd = +sdObiettivo;
  if (!(r > 0) || !(sd > 0)) return null;
  return (r / sd) ** 2;
}

// La prima riga è un'INTESTAZIONE? Lo è quando contiene almeno una cella
// non vuota e nessuna cella che sia un numero: "Data;Ora;PPV" sì,
// "12/07/2026;10:30;4,8" no. Serve solo come proposta: nella schermata
// l'utente può sempre correggere con una spunta.
export function paresIntestazione(righe) {
  const r = (righe || [])[0];
  if (!r || !r.length) return false;
  const piene = r.filter(c => String(c || "").trim() !== "");
  if (!piene.length) return false;
  return !piene.some(c => Number.isFinite(numIt(c)));
}

// Data in ISO (AAAA-MM-GG) da quasi tutti i formati che si trovano negli
// export: 2026-07-12 · 2026/07/12 · 12/07/2026 · 12-07-2026 · 12.07.2026 ·
// 12/07/26, anche seguiti dall'ora nella stessa cella. Regola dichiarata e
// scritta anche nella schermata: con due numeri di due cifre si legge
// GIORNO/MESE (formato italiano), mai mese/giorno. Ritorna "" se non è una
// data vera (il 31/02 viene scartato, non "corretto"). Pura e testabile.
export function dataIso(v) {
  const s = String(v == null ? "" : v).trim();
  if (!s) return "";
  const comp = (a, me, g) => {
    const A = +a, M = +me, G = +g;
    if (!(A >= 1900 && A <= 2999) || !(M >= 1 && M <= 12) || !(G >= 1 && G <= 31)) return "";
    const d = new Date(Date.UTC(A, M - 1, G));
    if (d.getUTCFullYear() !== A || d.getUTCMonth() !== M - 1 || d.getUTCDate() !== G) return "";
    return `${A}-${String(M).padStart(2, "0")}-${String(G).padStart(2, "0")}`;
  };
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
  if (m) return comp(m[1], m[2], m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/.exec(s);
  if (m) { let a = m[3]; if (a.length === 2) a = (+a > 70 ? "19" : "20") + a; return comp(a, m[2], m[1]); }
  return "";
}

// Ora HH:MM da una cella che può essere "10:30", "10:30:12" o una data
// completa "12/07/2026 10:30". Si accettano SOLO i due punti come
// separatore: con il punto "12.07" sarebbe la data, non le 12 e 7 minuti.
// Ritorna "" se non c'è un'ora leggibile (l'ora è facoltativa).
export function oraHm(v) {
  const m = /(\d{1,2}):(\d{2})/.exec(String(v == null ? "" : v));
  if (!m) return "";
  const h = +m[1], mi = +m[2];
  if (h > 23 || mi > 59) return "";
  return String(h).padStart(2, "0") + ":" + String(mi).padStart(2, "0");
}

// Nomi di colonna che gli strumenti usano più spesso: servono SOLO a
// proporre una mappatura di partenza quando il file ha l'intestazione.
// La scelta finale resta sempre dell'utente.
const INDIZI = {
  data:   ["data", "date", "giorno", "data/ora", "datetime", "data e ora", "timestamp", "date/time"],
  ora:    ["ora", "time", "orario", "hh:mm", "ora evento"],
  valore: ["valore", "value", "ppv", "pvs", "picco", "peak", "misura", "livello", "level",
           "laeq", "leq", "db", "dba", "pm10", "pm 10", "concentrazione", "mm/s", "vel", "risultato"],
};
// Propone quale colonna è data, ora e valore leggendo l'intestazione.
// Ritorna { colData, colOra, colValore } con -1 = "non trovata".
// Se l'intestazione non c'è (o non dice niente) ripiega sulla posizione:
// prima colonna = data, ultima colonna numerica = valore.
export function proponiMappa(righe, conIntestazione) {
  const out = { colData: -1, colOra: -1, colValore: -1 };
  const head = (righe || [])[0] || [];
  if (conIntestazione) {
    const norm = head.map(h => String(h || "").trim().toLowerCase());
    const trova = (chiavi, escludi) => norm.findIndex((h, i) =>
      !escludi.includes(i) && h && chiavi.some(k => h === k || h.includes(k)));
    out.colData = trova(INDIZI.data, []);
    out.colOra = trova(INDIZI.ora, [out.colData]);
    out.colValore = trova(INDIZI.valore, [out.colData, out.colOra]);
  }
  const dati = (righe || []).slice(conIntestazione ? 1 : 0);
  if (out.colData < 0) {
    out.colData = (dati[0] || []).findIndex(c => dataIso(c) !== "");
    if (out.colData < 0) out.colData = 0;
  }
  if (out.colValore < 0) {
    const r = dati[0] || [];
    for (let i = r.length - 1; i >= 0; i--)
      if (i !== out.colData && i !== out.colOra && Number.isFinite(numIt(r[i]))) { out.colValore = i; break; }
    if (out.colValore < 0) out.colValore = Math.min(r.length - 1, out.colData + 1);
  }
  return out;
}

// Applica la mappatura scelta dall'utente e restituisce UNA VOCE PER RIGA
// del file, buona o scartata che sia, con il motivo scritto in italiano.
// Nessuna riga sparisce in silenzio: l'anteprima le mostra tutte, perché
// un import muto è il modo migliore per perdere dati senza accorgersene.
export function preparaLetture(righe, mappa) {
  const m = mappa || {};
  const cD = +m.colData, cO = +m.colOra, cV = +m.colValore;
  const dati = (righe || []).slice(m.conIntestazione ? 1 : 0);
  const cella = (r, i) => (Number.isFinite(i) && i >= 0 ? String(r[i] == null ? "" : r[i]) : "");
  return dati.map((r, k) => {
    const dataRaw = cella(r, cD), oraRaw = cella(r, cO), valRaw = cella(r, cV);
    const data = dataIso(dataRaw);
    // L'ora si cerca prima nella colonna scelta e POI, se lì non c'è, nella
    // cella della data: molti strumenti scrivono "12/07/2026 10:30" in una
    // casella sola, e capita che il file abbia ANCHE una colonna Ora che per
    // quelle righe è vuota.
    // ⛔ Il ripiego non è una gentilezza. Senza, l'ora veniva buttata, e due
    // misure dello stesso giorno con lo stesso valore finivano con la stessa
    // firma (data + ora + valore): la seconda spariva come doppione e
    // l'interfaccia annunciava «1 doppione scartato» — una frase sicura e non
    // vera, su una serie storica che va all'ente.
    // La colonna scelta VINCE: questo è un ripiego, non una sovrascrittura.
    const ora = (cO >= 0 ? oraHm(oraRaw) : "") || oraHm(dataRaw);
    const valore = numIt(valRaw);
    let motivo = "";
    if (!data) motivo = dataRaw ? "data non riconosciuta" : "data mancante";
    else if (!Number.isFinite(valore)) motivo = valRaw ? "valore non numerico" : "valore mancante";
    else if (valore < 0) motivo = "valore negativo";
    return { riga: k + 1 + (m.conIntestazione ? 1 : 0), dataRaw, oraRaw, valRaw, data, ora, valore, ok: !motivo, motivo };
  });
}

// Quante letture si tengono per punto di misura. L'import dallo strumento
// porta centinaia di righe: 50 (il vecchio limite dell'inserimento a mano)
// butterebbe via quasi tutto il file appena importato.
export const MAX_LETTURE = 500;

// Firma di una lettura per riconoscere i DOPPIONI: stessa data, stessa ora
// e stesso valore = stessa lettura. Reimportare lo stesso file (o il file
// della settimana che si sovrappone al precedente) non deve raddoppiare la
// serie storica: su un documento che va all'ente sarebbe un falso.
export function firmaLettura(l) {
  return chiaveOrdine(l) + "|" + (Math.round((+((l || {}).valore) || 0) * 1e6) / 1e6);
}

// Unisce le letture importate a quelle già presenti: scarta i doppioni
// (anche quelli DENTRO lo stesso file), riordina per data+ora e tiene le
// ultime MAX_LETTURE. Ritorna anche i conteggi da mostrare all'utente.
// ⛔ LA RIGA TENUTA SI RICOSTRUISCE CAMPO PER CAMPO, e questo è il punto in
// cui la catena di custodia (T2d) si spezzerebbe senza che nessuno lo veda:
// una lettura importata arriva con la sua `origine`, e ricopiando solo
// data/ora/valore la provenienza si perderebbe **all'ingresso**, cioè
// esattamente dove viene registrata. Il documento poi direbbe «provenienza
// non dichiarata» su misure appena importate da un file.
// ⚠️ E NON si riempie all'indietro: un doppione resta scartato, non diventa
// l'occasione per attribuire un file a una lettura che c'era già (vedi T2d).
export function unisciLetture(esistenti, nuove, max = MAX_LETTURE) {
  const gia = new Set((esistenti || []).map(firmaLettura));
  const tenute = [];
  let duplicati = 0;
  for (const l of nuove || []) {
    const f = firmaLettura(l);
    if (gia.has(f)) { duplicati++; continue; }
    gia.add(f);
    tenute.push({ data: l.data, valore: +l.valore, ...(l.ora ? { ora: l.ora } : {}),
                  ...(l.origine && typeof l.origine === "object" ? { origine: l.origine } : {}) });
  }
  const tutte = [...(esistenti || []), ...tenute]
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return {
    letture: tutte.slice(-max),
    aggiunte: tenute.length, duplicati,
    tagliate: Math.max(0, tutte.length - max),
  };
}

// ══════════════════════════════════════════════════════════════════════
// T2 · RICETTORI (casa, scuola, confine)
// Le norme non ragionano "in generale": ragionano sul punto sensibile che
// subisce l'effetto. Il ricettore porta distanza, tipo, classe acustica e
// — se l'utente la imposta — la SUA soglia, che è quella scritta
// nell'autorizzazione per quella casa. I valori di partenza dei preset
// normativi restano quelli che erano: qui si aggiunge solo la possibilità
// che l'azienda scriva la soglia del proprio ricettore.
// ══════════════════════════════════════════════════════════════════════

export const TIPI_RICETTORE = [
  { chiave: "abitazione", etichetta: "Abitazione" },
  { chiave: "scuola",     etichetta: "Scuola" },
  { chiave: "ospedale",   etichetta: "Ospedale / casa di cura" },
  { chiave: "confine",    etichetta: "Confine di proprietà" },
  { chiave: "storico",    etichetta: "Edificio storico / sensibile" },
  { chiave: "altro",      etichetta: "Altro" },
];
export const etichettaTipo = (t) =>
  (TIPI_RICETTORE.find(x => x.chiave === String(t || "").toLowerCase()) || {}).etichetta || "Ricettore";

// Classi acustiche comunali (DPCM 14/11/1997): servono a DESCRIVERE il
// ricettore e a ricordare all'utente quale zona gli ha assegnato il Comune.
// Nessun limite numerico viene dedotto da qui: il limite lo scrive
// l'autorizzazione, e in Sentinella lo imposta l'utente.
export const CLASSI_ACUSTICHE = [
  { chiave: "I",   etichetta: "I · aree particolarmente protette" },
  { chiave: "II",  etichetta: "II · prevalentemente residenziali" },
  { chiave: "III", etichetta: "III · di tipo misto" },
  { chiave: "IV",  etichetta: "IV · di intensa attività umana" },
  { chiave: "V",   etichetta: "V · prevalentemente industriali" },
  { chiave: "VI",  etichetta: "VI · esclusivamente industriali" },
];

export const trovaRicettore = (ricettori, id) =>
  (ricettori || []).find(r => r && r.id === id) || null;

/* ⛔ QUANTI METRI DICHIARA UN RICETTORE — E ZERO NON È UNA DISTANZA.
   Misurato il 07/08 compilando il modulo vero: scritto «0» nella distanza (il
   modulo lo accettava, e il suo stesso messaggio d'errore diceva «un numero di
   metri NON NEGATIVO»), sullo stesso ricettore, nello stesso istante:
     · SCHERMO → «Cascina al confine · distanza non indicata»
     · FILE    → `Cascina al confine;abitazione;0;;;;`
   Cioè il file esportato collocava la casa a ZERO METRI dal fronte. È la
   stessa frase che il report già rifiutava di scrivere sulle volate («distanza
   0 m si legge come il ricettore dentro il fronte»), rifatta nell'unico export
   che la pagina componeva ancora a mano.
   La regola `> 0` non era mancante: era scritta QUATTRO volte nella pagina —
   l'elenco dei ricettori, la testata del report, la scheda del punto e il
   confronto con la distanza della volata — e zero volte dove il file si
   compone. Adesso è una funzione sola, e chi la chiama non può divergere.
   ⚠️ `+r.distanza` e non `numIt`: il valore in archivio è già un numero (lo
   fanno `numeroDaCampo` nel modulo e `numIt` nell'import). Una stringa con la
   virgola qui torna `null`, ed è esattamente quello che lo schermo fa già —
   la funzione non cambia nessun comportamento, li unifica. */
export function distanzaDelRicettore(r) {
  const d = +((r || {}).distanza);
  return Number.isFinite(d) && d > 0 ? d : null;
}
/* La soglia PROPRIA di un ricettore, o `null`. Stessa storia della distanza:
   `sogliaValida` stava in questo file da sempre e la pagina se n'era tenuta
   una copia (`Number.isFinite(+r.soglia) && +r.soglia > 0`), `sogliaEfficace`
   una terza e `parseRicettoriCsv` una quarta. Un alias non è una seconda
   implementazione: qui dentro la decisione la prende `sogliaValida`. */
export function sogliaDelRicettore(r) {
  const s = +((r || {}).soglia);
  return sogliaValida(s) ? s : null;
}

// SOGLIA CHE VALE DAVVERO per un punto di misura.
// Regola, dichiarata anche nell'interfaccia: se il punto è collegato a un
// ricettore che ha una soglia propria E la stessa unità di misura, vince
// quella del ricettore (è il limite scritto per quella casa). In tutti gli
// altri casi vale la soglia del punto. Se le unità non coincidono NON si
// converte niente: si tiene la soglia del punto e si segnala, perché una
// conversione indovinata su un valore di sicurezza è un errore grave.
// Ritorna { valore, fonte: "ricettore"|"punto", ricettore, unita, conflitto }.
export function sogliaEfficace(m, ricettori) {
  const uM = String(unitaMisura(m) || "").trim().toLowerCase();
  const propria = +((m || {}).soglia);
  const base = Number.isFinite(propria) && propria > 0 ? propria : null;
  const r = trovaRicettore(ricettori, (m || {}).ricettoreId);
  const sr = sogliaDelRicettore(r);
  const uR = r ? String(r.unita || "").trim().toLowerCase() : "";
  const nome = r ? r.nome : "";
  if (r && sr != null) {
    if (!uR || !uM || uR === uM)
      return { valore: sr, fonte: "ricettore", ricettore: nome, unita: r.unita || unitaMisura(m), conflitto: false };
    return { valore: base, fonte: "punto", ricettore: nome, unita: unitaMisura(m), conflitto: true, unitaRicettore: r.unita };
  }
  return { valore: base, fonte: "punto", ricettore: nome, unita: unitaMisura(m), conflitto: false };
}

// ══════════════════════════════════════════════════════════════════════
// T2b · LA TARATURA DELLO STRUMENTO
// Perché esiste: il report di conformità va all'ente e dice «conforme»
// sulla base di numeri che li ha scritti uno strumento. Se quello
// strumento non era tarato, il numero non vale — e fino a qui il prodotto
// non sapeva nemmeno la domanda. È il principio del fondatore in un punto
// nuovo: un «conforme» tranquillo su misure di cui non si sa niente.
//
// ⛔ LA DOMANDA GIUSTA NON È «È TARATO OGGI?», È «ERA TARATO QUEL GIORNO?».
// Una lettura di marzo non è coperta dal certificato emesso ad aprile, e
// non lo è nemmeno se oggi lo strumento è in regola. Per questo si tiene
// lo STORICO dei certificati, non l'ultima scadenza: un certificato copre
// l'intervallo [data, scadenza], e una lettura è coperta se cade dentro
// uno di quegli intervalli.
//
// ⛔ E «NON COPERTA» SI DIVIDE IN DUE, perché le due cose non si dicono
// allo stesso modo a chi legge:
//   · «scoperta»          → la lettura cade DOPO l'inizio dello storico ma
//                           in nessun intervallo: o il certificato era
//                           scaduto, o c'è un buco fra due tarature. È un
//                           problema vero, e va detto;
//   · «prima-dello-storico» → la lettura è precedente alla prima taratura
//                           registrata. Lo strumento poteva benissimo
//                           essere tarato: semplicemente qui non risulta.
//                           Dire «scoperta» sarebbe accusare l'utente di
//                           una cosa non misurata — l'errore opposto a
//                           quello che questa sezione corregge.
// Le date si leggono con `dataISOEsiste` e non con `Date.parse`, che il 30
// febbraio non lo rifiuta: lo fa scivolare al 2 marzo, cioè allungherebbe
// una copertura di due giorni in silenzio.
// ══════════════════════════════════════════════════════════════════════

// I certificati leggibili, in ordine di data. Scarta quelli con date che
// non esistono e quelli con la scadenza PRIMA della taratura: un
// intervallo alla rovescia non copre niente, e tenerlo vorrebbe dire
// coprire con un dato incoerente.
function certificatiTaratura(tarature) {
  return (tarature || [])
    .map(t => ({
      data: String((t || {}).data || "").slice(0, 10),
      scadenza: String((t || {}).scadenza || "").slice(0, 10),
      ente: String((t || {}).ente || "").trim(),
      certificato: String((t || {}).certificato || "").trim(),
      nota: String((t || {}).nota || "").trim(),
    }))
    .filter(t => dataISOEsiste(t.data) && dataISOEsiste(t.scadenza) && t.scadenza >= t.data)
    .sort((a, b) => a.data < b.data ? -1 : a.data > b.data ? 1 : 0);
}

// Com'era messa la taratura il giorno di UNA lettura.
// Ritorna { stato, certificato, scartate, perche } con stato fra
// "coperta" | "scoperta" | "prima-dello-storico" | "non-dichiarata".
export function coperturaTaratura(tarature, dataISO) {
  const g = String(dataISO || "").slice(0, 10);
  const cert = certificatiTaratura(tarature);
  const scartate = (tarature || []).length - cert.length;
  if (!cert.length) {
    return { stato: "non-dichiarata", certificato: null, scartate,
      perche: scartate
        ? "le tarature registrate per questo strumento hanno date che non esistono"
        : "nessuna taratura registrata per questo strumento" };
  }
  if (!dataISOEsiste(g)) {
    return { stato: "non-dichiarata", certificato: null, scartate,
      perche: "la lettura non ha una data leggibile: non si può dire sotto quale taratura è stata presa" };
  }
  const dentro = cert.find(t => t.data <= g && g <= t.scadenza);
  if (dentro) return { stato: "coperta", certificato: dentro, scartate, perche: "" };
  if (g < cert[0].data) {
    return { stato: "prima-dello-storico", certificato: null, scartate,
      perche: "la lettura è precedente alla prima taratura registrata: lo strumento poteva essere tarato, ma qui non risulta" };
  }
  return { stato: "scoperta", certificato: null, scartate,
    perche: "nessuna taratura registrata copre la data della lettura" };
}

// Come sta la taratura di uno strumento OGGI, per la lista dei punti.
// ⛔ Lo stato lo dice `statoScadenzaHSE`, che sta in shared/ e la usano già
// Scudo e Campo: una scadenza è una scadenza, e la regola che serve a più
// app non si riscrive (è il difetto costato una giornata intera con la
// convenzione sui numeri). Qui si aggiunge solo il caso che quella funzione
// non può conoscere: nessun certificato registrato.
export function statoTaraturaStrumento(punto, oggi = new Date()) {
  const cert = certificatiTaratura((punto || {}).tarature);
  if (!cert.length) return { stato: "non-dichiarata", ultima: null, scadenza: null, n: 0 };
  const ultima = cert[cert.length - 1];
  return { stato: statoScadenzaHSE(ultima.scadenza, oggi), ultima, scadenza: ultima.scadenza, n: cert.length };
}

export const STATI_TARATURA = {
  "regolare":       { cls: "ok",     label: "Taratura valida" },
  "in-scadenza":    { cls: "warn",   label: "Taratura in scadenza" },
  "scaduta":        { cls: "danger", label: "Taratura scaduta" },
  "senza data":     { cls: "warn",   label: "Taratura senza data" },
  "non-dichiarata": { cls: "warn",   label: "Taratura non dichiarata" },
};

// Quello che il report dichiara all'ente sulle tarature.
// ⛔ NON tocca l'esito sulle soglie, ed è voluto: sono due domande diverse
// («le misure hanno superato il limite?» e «di chi erano quelle misure?»),
// e mescolarle vorrebbe dire cambiare un giudizio di conformità sulla base
// di un dato amministrativo. Restano affiancate, e il report le dice
// tutt'e due.
// ⛔ `stato` non risponde mai "coperte" quando non c'è niente di
// dichiarato: senza nessun certificato la risposta è "non-dichiarata",
// che è un avviso, non un via libera.
/* ⛔ IL CONTO DELLE LETTURE COPERTE, IN UN POSTO SOLO. Lo scrivevano in tre:
   qui dentro (tre secchi), la scheda della taratura nella pagina (quattro
   secchi, perché lì «prima dello storico» e «nessuna taratura» si dicono
   diverse) e — dal 07/08 — il file per l'ARPA ne voleva un quarto. Tre copie
   dello stesso ciclo divergono senza che nessuno lo veda: la firma troppo
   stretta era proprio quella dei tre secchi, che non sa dire il quarto caso.
   Questa risponde con tutti e quattro; chi ne vuole tre li somma. */
export function contaCoperture(tarature, letture) {
  const c = { coperta: 0, scoperta: 0, "prima-dello-storico": 0, "non-dichiarata": 0 };
  for (const l of (letture || [])) {
    const s = coperturaTaratura(tarature, (l || {}).data).stato;
    if (c[s] != null) c[s]++;
  }
  c.totale = c.coperta + c.scoperta + c["prima-dello-storico"] + c["non-dichiarata"];
  // «non note» = le due che non sono né coperte né scoperte, come le conta il report
  c.nonNote = c["prima-dello-storico"] + c["non-dichiarata"];
  return c;
}

export function taratureDelReport(punti, oggi = new Date()) {
  let coperte = 0, scoperte = 0, nonNote = 0;
  const perPunto = (punti || []).map(p => {
    const m = (p || {}).m || {};
    const q = contaCoperture(m.tarature, (p || {}).letture);
    const conta = { coperte: q.coperta, scoperte: q.scoperta, nonNote: q.nonNote };
    coperte += conta.coperte; scoperte += conta.scoperte; nonNote += conta.nonNote;
    return { nome: (p || {}).nome || m.nome || "Punto di misura", ...conta,
             oggi: statoTaraturaStrumento(m, oggi).stato };
  });
  const nLetture = coperte + scoperte + nonNote;
  const stato = !nLetture ? "senza-letture"
    : scoperte ? "scoperte"
    : nonNote === nLetture ? "non-dichiarata"
    : nonNote ? "parziale"
    : "coperte";
  return { perPunto, coperte, scoperte, nonNote, nLetture, stato };
}

// La frase che finisce nel documento. Le parole contano: è un testo che
// legge un funzionario, e deve dire cosa si sa e cosa non si sa senza
// lasciargli dedurre niente.
export const DICHIARAZIONI_TARATURA = {
  "coperte":        { cls: "ok",     testo: "Tutte le letture del periodo sono state prese con strumenti la cui taratura, registrata in Sentinella, era valida alla data della misura." },
  "parziale":       { cls: "warn",   testo: "Per una parte delle letture del periodo la taratura dello strumento non risulta registrata alla data della misura: il documento non può dichiararla." },
  "non-dichiarata": { cls: "warn",   testo: "Per nessuna lettura del periodo risulta registrata la taratura dello strumento: il documento riporta i valori misurati, non la loro riferibilità." },
  "scoperte":       { cls: "danger", testo: "Una o più letture del periodo sono state prese in un giorno non coperto da nessuna taratura registrata." },
  "senza-letture":  { cls: "warn",   testo: "Nel periodo non ci sono letture, quindi non c'è nessuna taratura da verificare." },
};

// ══════════════════════════════════════════════════════════════════════
// T2c · I CERTIFICATI CHE ARRIVANO DA UN FILE, E QUELLI CHE SCADONO
// Due cose rimaste aperte da T2b, e sono facce dello stesso problema: una
// dichiarazione amministrativa che costa fatica a tenere aggiornata resta
// indietro, e un report che poggia su un archivio vecchio dice «non
// dichiarata» dove la carta invece c'è.
//
// ⛔ QUESTA SEZIONE NON TOCCA NESSUN GIUDIZIO DI CONFORMITÀ. Non legge
// soglie, non legge curve, non cambia l'esito di un report: sposta pezzi di
// carta. Vale identica la decisione di T2b — la taratura sta ACCANTO
// all'esito, mai dentro.
// ══════════════════════════════════════════════════════════════════════

// L'IMPORT DEI CERTIFICATI DA CSV.
// Perché esiste: una cava con otto strumenti ricopia otto certificati
// all'anno, campo per campo, e il centro di taratura glieli manda già in
// elenco. Battere a mano una data è il modo più facile per scriverne una
// sbagliata su un dato che poi finisce in un documento verso l'ente.
//
// Colonne: strumento;data;scadenza;centro;certificato[;nota]
// (intestazione facoltativa, riconosciuta dalla prima colonna «strumento»;
// è la stessa che scrive `csvTarature`, così il giro export → import torna).
//
// ⛔ LE DATE SI LEGGONO CON `dataIso`, MAI CON `Date.parse`. È il lettore che
// Sentinella usa già per l'import dallo strumento (T1): regge ISO e forma
// italiana, e — questo è il punto — il 30 febbraio lo RIFIUTA invece di farlo
// scivolare al 2 marzo. Una data scivolata di due giorni allungherebbe in
// silenzio la copertura di un certificato, cioè farebbe risultare «coperte»
// letture che non lo sono: l'esatto contrario di quello che T2b esiste per
// dire. Il suo esito è sempre una data ISO che esiste, quindi `coperturaTaratura`
// la ritrova buona più avanti.
// ⚠️ Ne eredita anche la convenzione sugli anni a due cifre (12/04/26 →
// 2026): è la regola già scritta e dichiarata di quel lettore, e non se ne
// inventa una seconda diversa per questo file.
//
// ⛔ NESSUNA RIGA SPARISCE IN SILENZIO. Esce una voce per ogni riga del file,
// buona o scartata che sia, con il motivo scritto in italiano e il NUMERO DI
// RIGA vero (quello del file, non quello dopo aver tolto vuote e
// intestazione): un import che scarta metà del file senza dirlo è peggio di
// un import che fallisce, perché chi lo lancia crede di aver caricato tutto.
//
// ⚠️ UNA SCADENZA PRIMA DELLA TARATURA SI SCARTA, NON SI RADDRIZZA. Le due
// date invertite sono un intervallo che non copre nessun giorno: girarle
// vorrebbe dire inventare quale delle due l'utente ha sbagliato a scrivere,
// e coprire delle letture con una decisione presa dal programma. È la stessa
// regola che `certificatiTaratura` applica già ai dati in archivio.
export function parseTaratureCsv(text) {
  return String(text == null ? "" : text).split(/\r?\n/)
    .map((r, i) => ({ testo: r.trim(), n: i + 1 }))
    .filter(x => x.testo && !isIntestazione(x.testo, "strumento"))
    .map(x => {
      const [strumento, dataRaw, scadRaw, ente, certificato, nota] = parseCsvLine(x.testo);
      const s = String(strumento || "").trim();
      const dR = String(dataRaw || "").trim(), sR = String(scadRaw || "").trim();
      const data = dataIso(dR), scadenza = dataIso(sR);
      let motivo = "";
      if (!s) motivo = "manca il nome dello strumento";
      else if (!data) motivo = dR ? "la data della taratura non è una data" : "manca la data della taratura";
      else if (!scadenza) motivo = sR ? "la scadenza non è una data" : "manca la scadenza";
      else if (scadenza < data) motivo = "la scadenza viene prima della taratura";
      return {
        riga: x.n, strumento: s, dataRaw: dR, scadenzaRaw: sR, data, scadenza,
        ente: String(ente || "").trim(), certificato: String(certificato || "").trim(),
        nota: String(nota || "").trim(),
        ok: !motivo, motivo,
      };
    });
}

// Confronto fra nomi: spazi di contorno, spazi doppi e maiuscole non contano.
// Chi scrive un elenco a mano scrive «polveri p2» dove l'app ha «Polveri P2».
function chiaveStrumento(s) {
  return String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " ");
}

// A CHI VA OGNI CERTIFICATO — e che cosa si fa di quelli che non trovano casa.
//
// ⛔ UNO STRUMENTO CHE NON ESISTE NON SI CREA, E LA RAGIONE NON È PRUDENZA
// GENERICA. Un punto di misura non è un'etichetta: porta una SOGLIA e
// un'unità, ed è la soglia a decidere se una misura è conforme. Un
// certificato di taratura non dice niente né dell'una né dell'altra. Crearne
// uno da qui vorrebbe dire far comparire nell'elenco dei monitoraggi un punto
// con una soglia che nessuno ha scelto — cioè un giudizio di conformità
// fabbricato da un file amministrativo. La riga si scarta, e il nome che non
// si è trovato viene DETTO (`sconosciuti`), così chi ha caricato il file sa
// se correggere il nome nel file o creare prima il punto di misura.
//
// ⚠️ E UN NOME CHE CORRISPONDE A DUE STRUMENTI NON SI ASSEGNA AL PRIMO. Il
// nome corto («Polveri P2», la parte prima del trattino lungo, che è quella
// che la pagina mostra nelle tendine) può essere di due punti diversi:
// attaccare il certificato a uno dei due a caso vorrebbe dire dichiarare
// riferibili le letture dello strumento sbagliato.
//
// Il doppione si cerca in due posti, come in ogni import dell'ecosistema:
// dentro il file appena letto — con la regola condivisa `senzaDoppioni`, non
// una copia — e contro quello che è GIÀ registrato sullo strumento. Due
// certificati con le stesse due date sullo stesso strumento sono lo stesso
// certificato: è la stessa chiave che il form usa già per non farne
// registrare due a mano.
export function abbinaTarature(voci, monitoraggi) {
  const indice = new Map();
  const agg = (k, id) => { if (!k) return; if (!indice.has(k)) indice.set(k, new Set()); indice.get(k).add(id); };
  for (const m of monitoraggi || []) {
    const nome = String((m || {}).nome || "");
    agg(chiaveStrumento(nome), (m || {}).id);
    agg(chiaveStrumento(nome.split(" — ")[0]), (m || {}).id);
  }
  const perId = new Map((monitoraggi || []).map(m => [(m || {}).id, m]));

  const abbinate = (voci || []).map(v => {
    if (!v.ok) return { ...v, puntoId: "", nomePunto: "" };
    const ids = indice.get(chiaveStrumento(v.strumento));
    if (!ids || !ids.size)
      return { ...v, puntoId: "", nomePunto: "", ok: false, motivo: "nessuno strumento si chiama così" };
    if (ids.size > 1)
      return { ...v, puntoId: "", nomePunto: "", ok: false, motivo: "il nome corrisponde a più di uno strumento" };
    const id = [...ids][0];
    const m = perId.get(id) || {};
    const gia = ((m.tarature) || []).some(t =>
      String((t || {}).data || "").slice(0, 10) === v.data
      && String((t || {}).scadenza || "").slice(0, 10) === v.scadenza);
    if (gia)
      return { ...v, puntoId: id, nomePunto: m.nome || "", ok: false, motivo: "già registrata su questo strumento" };
    return { ...v, puntoId: id, nomePunto: m.nome || "" };
  });

  const tenute = new Set(
    senzaDoppioni(abbinate.filter(v => v.ok), v => `${v.puntoId}|${v.data}|${v.scadenza}`).map(v => v.riga));
  const finali = abbinate.map(v =>
    (v.ok && !tenute.has(v.riga)) ? { ...v, ok: false, motivo: "ripetuta nel file" } : v);

  const conta = new Map();
  const sconosciuti = [];
  for (const v of finali) {
    if (v.ok) continue;
    conta.set(v.motivo, (conta.get(v.motivo) || 0) + 1);
    if (v.motivo === "nessuno strumento si chiama così" && !sconosciuti.includes(v.strumento))
      sconosciuti.push(v.strumento);
  }
  const pronte = finali.filter(v => v.ok).length;
  return {
    voci: finali,
    // `letti` è il totale delle righe con dei dati dentro, e `pronte +
    // scartate` gli torna sempre uguale: è così che chi guarda il riepilogo
    // vede subito se il file è entrato tutto.
    riepilogo: {
      letti: finali.length, pronte, scartate: finali.length - pronte,
      motivi: [...conta.entries()].map(([motivo, n]) => ({ motivo, n }))
        .sort((a, b) => b.n - a.n || a.motivo.localeCompare(b.motivo, "it")),
      sconosciuti,
    },
  };
}

// Le colonne del file, in un posto solo: le scrive l'export e le riconosce
// l'import (`isIntestazione` guarda la prima). Due elenchi in due punti
// diversi si scollano.
/* ══════════════════════════════════════════════════════════════════════
   L'ARCHIVIO DEI RICETTORI IN UN FILE.

   ⛔ PERCHÉ È SALITO QUI DENTRO, il 07/08 — ed è la seconda volta che questa
   riga si scrive. Il 03/08 `csvAmbiente` è salito nel modulo con scritto
   accanto «è l'unico export dell'app che non passava da una funzione pura».
   Non era vero, e nessuno l'ha riletto: i ricettori uscivano da nove parole di
   template dentro il gestore del bottone, ed erano rimasti indietro esattamente
   come l'altro. Un censimento vale più di una correzione puntuale, ed è la
   ragione per cui questo blocco esiste.
   Il difetto misurato premendo il bottone (07/08, modulo compilato a mano con
   distanza «0», che il modulo stesso accettava):
     · SCHERMO → «distanza non indicata»
     · FILE    → `Cascina al confine;abitazione;0;;;;`
   Un ricettore a zero metri dal fronte, scritto in un file che si manda a un
   consulente o a un ente. La colpa non era del `?? ""`, che sull'assenza è
   giusto: era che il file non chiedeva a nessuno **se quel numero fosse una
   distanza**, mentre le quattro schermate lo chiedevano tutte.

   Le colonne restano quelle di `parseRicettoriCsv` — un posto solo decide le
   colonne, se no export e import si scollano al primo cambiamento — e il giro
   scrivi/leggi è provato in `run-kpi.mjs` sul TESTO, non solo sull'identità:
   una coppia scrivi/leggi resta verde anche se sbagliano tutt'e due insieme.
   ⚠️ `csvCell` anche su tipo e classe, che vengono da un elenco chiuso: è la
   stessa ragione per cui ci passa l'unità, ed era già scritta qui accanto —
   la cintura si allaccia anche per il tratto corto. */
export const CSV_RICETTORI_INTESTAZIONE = "nome;tipo;distanza;classe;soglia;unita;nota";

export function csvRicettori(ricettori) {
  const righe = (ricettori || []).map(r => {
    const d = distanzaDelRicettore(r), s = sogliaDelRicettore(r);
    return [
      csvCell((r || {}).nome || ""), csvCell((r || {}).tipo || ""),
      d == null ? "" : String(d), csvCell((r || {}).classe || ""),
      s == null ? "" : String(s), csvCell((r || {}).unita || ""),
      csvCell((r || {}).nota || ""),
    ].join(";");
  });
  return CSV_RICETTORI_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
}

export const CSV_TARATURE_INTESTAZIONE = "strumento;data;scadenza;centro;certificato;nota";

// L'ARCHIVIO DEI CERTIFICATI IN UN FILE.
// ⛔ ESCONO TUTTI, ANCHE QUELLI CON LE DATE ROTTE. Esportare solo i leggibili
// vorrebbe dire che chi fa un backup, o chi riapre il proprio file, si ritrova
// un archivio più corto senza che nessuno glielo abbia detto. Il file è la
// fotografia di quello che c'è; a dire che una riga non si può usare ci pensa
// l'import, che lo dichiara riga per riga.
// Le celle di testo passano da `csvCell`: il nome del centro di taratura è
// campo libero e un punto e virgola dentro spezzerebbe la riga in silenzio.
export function csvTarature(monitoraggi) {
  const righe = [];
  for (const m of monitoraggi || [])
    for (const t of ((m || {}).tarature || []))
      righe.push([
        csvCell((m || {}).nome || ""),
        String((t || {}).data || ""), String((t || {}).scadenza || ""),
        csvCell((t || {}).ente || ""), csvCell((t || {}).certificato || ""),
        csvCell((t || {}).nota || ""),
      ].join(";"));
  return CSV_TARATURE_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
}

// ══════════════════════════════════════════════════════════════════════
// IL FILE PER L'ARPA / IL CONSULENTE AMBIENTALE
//
// ⛔ PERCHÉ È SALITO QUI DENTRO, il 03/08. Stava scritto a mano nel gestore
// del bottone dentro la pagina — nove righe di template — e lì nessuna prova
// lo guardava: è l'unico export dell'app che non passava da una funzione pura,
// e infatti era rimasto indietro rispetto a tutte le schermate. Tre difetti
// misurati sul dato di dimostrazione, tutti nella stessa direzione (il file
// dice all'ente qualcosa di diverso da quello che l'app dice all'utente):
//
//  1. ⛔ LA SOGLIA DEL RICETTORE NON ARRIVAVA NEL FILE. Il gestore ciclava su
//     `MON`, non su `MON.map(conSoglia)`: cioè su tutto il resto dell'app la
//     soglia che vale è quella scritta nell'autorizzazione per QUELLA casa, e
//     nel file esportato era quella del punto. Misurato su `DEMO`, punto
//     «Vibrazioni V2 — confine Nord»: schermo «soglia 20 · Conforme», file
//     «soglia 5 · Superamento». E nel verso che conta — un ricettore PIÙ
//     SEVERO del punto (punto 20, casa 5, lettura 6) — schermo
//     «Superamento», file «soglia 20 · **Conforme**»: il documento che il
//     cliente manda al consulente assolveva un punto che l'app segna in rosso.
//     Il commento di `conSoglia`, nella pagina, elencava già chi deve passare
//     da lì — «semaforo, KPI, grafico, allerte, report» — e l'export non era
//     nell'elenco perché nessuno l'aveva riguardato.
//  2. ⛔ `undefined` SCRITTO NELLA COLONNA DELLA SOGLIA. `${m.soglia}` su un
//     punto senza soglia (decisione 16, ed è in `DEMO`) finiva nel file come
//     la parola `undefined`. Un campo vuoto dice «non c'è»; quella parola non
//     dice niente e sporca chi rilegge il file con un altro programma.
//  3. ⛔ «tra NaN gg» SU UN ADEMPIMENTO SENZA DATA LEGGIBILE. La stessa riga
//     era già stata corretta nella LISTA il 03/08 («Senza data», giallo, con
//     il suo perché scritto sopra) e non qui: `giorni("")` non fa zero, fa
//     `NaN`, e `NaN < 0` è falso, quindi si finiva nel ramo tranquillo.
//
// Il valore di un punto MAI MISURATO esce vuoto e non `0`: quello zero è il
// valore con cui il punto nasce, non una misura, ed è la stessa regola per cui
// la riga delle volate scrive «kg non dichiarati» invece di «0 kg».
// I numeri escono col punto decimale, come negli altri tre export di questa
// app: è un file per un'altra macchina, non per un foglio italiano.
// La colonna `origine_soglia` è IN CODA e facoltativa da leggere, come le
// colonne aggiunte al registro volate: chi taglia alle prime sette ritrova
// esattamente il file di prima.
//
// ⛔ E LE DUE COLONNE IN FONDO, dal 07/08: `taratura` e `provenienza`. Il file
// diceva «Conforme» e basta, mentre le stesse misure, sullo SCHERMO e sul
// REPORT, portavano due riserve che il file taceva:
//   · ogni riga dell'elenco dei punti ha il badge della taratura, e il report
//     ha una sezione intera intitolata «Riferibilità delle misure»;
//   · la tabella del report dichiara la provenienza LETTURA PER LETTURA, e
//     `provenienzaMisura` alza per questo la bandiera `noto` — che qui dentro
//     non la leggeva nessuno. Una bandiera che l'export non legge non protegge
//     niente: è la regola 20 di `run-stile` nel punto in cui nessuno guarda,
//     perché le prove chiamano il modulo e il file lo compone chi esporta.
// Misurato sulla dimostrazione: «Polveri PM10 — confine Est» usciva
// `36.8;µg/m³;40;Attenzione` — sei letture, nessun certificato registrato e
// nessuna delle sei che dichiari da dove viene. Il report, sulle stesse,
// scrive «per 2 letture di questo punto non risulta nessuna taratura» e
// «NON DICHIARATA» su ogni riga.
//
// ⛔ E LA DOMANDA GIUSTA NON È «È TARATO OGGI?»: è «era tarato QUEL GIORNO?»,
// e sta scritta accanto a `coperturaTaratura` da quando quella sezione esiste.
// Scrivere qui il badge di `statoTaraturaStrumento` sarebbe stato più corto e
// SBAGLIATO nel verso che rassicura: sulla dimostrazione «Vibrazioni V2» oggi
// ha un certificato valido — badge «Taratura valida» — e in mezzo al suo
// storico c'è una lettura che cade nel buco fra due certificati. Il file porta
// perciò il conto delle sue LETTURE, che sono quelle che il file contiene,
// e lo conta con `contaCoperture`, la stessa del report e della scheda.
export const CSV_AMBIENTE_INTESTAZIONE =
  "tipo;nome;valore;unita;soglia;stato;dettaglio;origine_soglia;taratura;provenienza";

/* La riferibilità delle letture di UN punto, in una cella. Le parole sono
   quelle che la scheda della taratura usa già a schermo: «coperte», «cadono in
   un giorno che nessuna taratura registrata copre», «precedenti alla prima
   taratura registrata». Un punto senza letture non ha niente da coprire e la
   cella resta vuota — l'assenza si dice tacendo solo quando non c'è nemmeno la
   domanda, e qui la domanda non c'è. */
function cellaTaratura(m) {
  const c = contaCoperture((m || {}).tarature, (m || {}).letture);
  if (!c.totale) return "";
  const pezzi = [];
  /* ⚠️ QUESTA CELLA FINISCE NEL FOGLIO PER L'ENTE, e con UNA lettura sola
     scriveva «1 coperte da una taratura valida» e «1 precedenti alla prima
     taratura registrata». La guardia giusta stava sei righe più in giù, nella
     STESSA funzione sorella, sulle correzioni (`corrette === 1 ? …`). */
  if (c.coperta) pezzi.push(conta(c.coperta, "coperta da una taratura valida", "coperte da una taratura valida"));
  if (c.scoperta) pezzi.push(c.scoperta + " in un giorno che nessuna taratura registrata copre");
  if (c["prima-dello-storico"]) pezzi.push(conta(c["prima-dello-storico"], "precedente alla prima taratura registrata", "precedenti alla prima taratura registrata"));
  if (c["non-dichiarata"]) pezzi.push(c["non-dichiarata"] + " senza nessuna taratura da confrontare");
  return pezzi.join(" · ") + " su " + c.totale;
}
/* La catena di custodia delle letture di UN punto, in una cella. Legge la
   bandiera `noto` di `provenienzaMisura`: un'origine scritta ma non
   riconosciuta NON ricade su «a mano», resta «senza provenienza dichiarata».
   Le correzioni si contano a parte perché sono la cosa che un funzionario
   cerca per prima, e sul dato di dimostrazione ce n'è una che ALZA il valore. */
function cellaProvenienza(m) {
  let file = 0, mano = 0, ignota = 0, corrette = 0;
  for (const l of (((m || {}).letture) || [])) {
    const p = provenienzaMisura(l);
    if (!p.noto) ignota++; else if (p.da === FONTE_IMPORT) file++; else if (p.da === FONTE_MANO) mano++;
    if (p.corretta) corrette++;
  }
  if (!(file + mano + ignota)) return "";
  const pezzi = [];
  if (file) pezzi.push(file + " da file dello strumento");
  if (mano) pezzi.push(conta(mano, "inserita a mano", "inserite a mano"));
  if (ignota) pezzi.push(ignota + " senza provenienza dichiarata");
  if (corrette) pezzi.push(corrette + (corrette === 1 ? " corretta dopo la registrazione" : " corrette dopo la registrazione"));
  return pezzi.join(" · ");
}

export function csvAmbiente(monitoraggi, adempimenti, ricettori, oggi = new Date()) {
  /* ⛔ `numeroDichiarato` e non `Number.isFinite(+x)`: `+null` fa 0. Scritta a
     mano, questa cella riscriveva `2026-07-02:0` su una lettura senza valore —
     il difetto che il file esiste per non fare, rifatto nella correzione. */
  const n = (x) => { const v = numeroDichiarato(x); return v == null ? "" : String(Math.round(v * 1e4) / 1e4); };
  const righe = [];
  for (const m of monitoraggi || []) {
    const eff = sogliaEfficace(m, ricettori);
    // la stessa copia con cui ragionano tutte le schermate: la soglia che vale
    const st = statoMisura(eff.valore != null ? { ...m, soglia: eff.valore } : m);
    const storico = (((m || {}).letture) || [])
      .map(l => String((l || {}).data || "") + ":" + n((l || {}).valore)).join(" ");
    const origine = eff.valore == null ? ""
      : eff.conflitto
      ? "punto di misura · il ricettore " + (eff.ricettore || "collegato") + " ha una soglia in "
        + (eff.unitaRicettore || "un'altra unità") + ", non applicata e non convertita"
      : eff.fonte === "ricettore" ? "ricettore " + (eff.ricettore || "")
      : "punto di misura";
    righe.push([
      "monitoraggio", csvCell((m || {}).nome || ""),
      st.stato === "mai" ? "" : n((m || {}).valore),
      csvCell(unitaMisura(m)), n(eff.valore), st.label, csvCell(storico), csvCell(origine),
      csvCell(cellaTaratura(m)), csvCell(cellaProvenienza(m)),
    ].join(";"));
  }
  for (const a of adempimenti || []) {
    const g = giorniTra((a || {}).scadenza, oggi);
    const stato = !Number.isFinite(g) ? "senza data"
      : g < 0 ? "scaduto da " + (-g) + " gg"
      : "tra " + g + " gg";
    const ente = (a || {}).ente && a.ente !== "—" ? a.ente + " · " : "";
    /* ⛔ IL FILE DICE LA STESSA COSA DELLO SCHERMO, e la decide la STESSA
       funzione. È la regola «dove il documento si compone, chi decide i suoi
       numeri?»: la riga dello scadenzario mostra il periodo coperto, e un file
       che tace lascerebbe credere che di quel periodo non si sappia niente. */
    const per = periodoAdempimento(a);
    righe.push([
      "adempimento", csvCell((a || {}).titolo || ""), "", "", "", stato,
      csvCell(ente + "entro " + (dataISOEsiste(String((a || {}).scadenza || "").slice(0, 10))
        ? String(a.scadenza).slice(0, 10) : "data non indicata")
        + " · " + (per.noto
          ? "periodo coperto dal " + per.dal + " al " + per.al
          : "periodo coperto non dichiarato")), "",
      /* un adempimento non è una misura: non ha né taratura né provenienza, e
         le due celle restano vuote invece di dire qualcosa di tranquillo */
      "", "",
    ].join(";"));
  }
  return CSV_AMBIENTE_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
}

// LA TARATURA CHE SCADE, NELLE ALLERTE DEL QUADRO.
// Fino al 01/08 lo stato si vedeva solo entrando nella sezione, cioè lo
// scopriva chi era già andato a cercarlo. Ma una taratura che scade non è un
// dettaglio d'archivio: dal giorno dopo ogni lettura di quello strumento
// risulta SCOPERTA, e chi se ne accorge davanti al report per l'ente non può
// più rimediare — un certificato non si fa fare a ritroso.
//
// ⛔ E ALLORA PERCHÉ NON TUTTI GLI STATI? Perché il Quadro è già denso e una
// lista che dice tutto non la legge nessuno. Entrano SOLO le due che sono una
// scadenza arrivata:
//   · `scaduta`     → danger, come un adempimento con l'ente mancato;
//   · `in-scadenza` → warn, con la stessa finestra di 30 giorni che il Quadro
//                     usa già per gli adempimenti (la decide `statoScadenzaHSE`
//                     in `shared/`, non un numero riscritto qui).
// Restano FUORI, e sono decisioni, non dimenticanze:
//   · `regolare` — non c'è niente da fare;
//   · `non-dichiarata` — è lo stato di un archivio che non è ancora
//     cominciato, non una scadenza arrivata. Metterlo qui vorrebbe dire che il
//     primo giorno l'app apre con una riga per OGNI strumento, per sempre
//     finché qualcuno non carica tutti i certificati: il Quadro diventerebbe
//     illeggibile proprio per chi non ha ancora niente da leggerci. E non
//     resta muto: lo dicono già il badge sulla riga del punto di misura, il
//     conto della sezione e la dichiarazione del report.
// Conseguenza voluta: un archivio senza nessun certificato registrato aggiunge
// ZERO righe al Quadro. Le righe compaiono a chi ha già dichiarato una
// taratura — cioè esattamente a chi può fare qualcosa.
//
// Stessa forma delle altre allerte ({ gravita, categoria, titolo, dettaglio,
// badge }) così si mescolano senza casi particolari. `oggi` iniettabile.
export function allerteTaratura(monitoraggi, oggi = new Date()) {
  const out = [];
  for (const m of monitoraggi || []) {
    const t = statoTaraturaStrumento(m, oggi);
    if (t.stato !== "scaduta" && t.stato !== "in-scadenza") continue;
    const scaduta = t.stato === "scaduta";
    const g = giorni(t.scadenza, oggi);
    out.push({
      gravita: scaduta ? "danger" : "warn",
      categoria: "taratura",
      titolo: (m || {}).nome || "Strumento",
      /* ⚠️ IL SESTO CAMPO, E LA RAGIONE. Le altre allerte portano a una
         schermata; questa porta a una SEZIONE che parla di uno strumento alla
         volta, e la tendina si ricorda l'ultimo scelto. Senza l'id, chi tocca
         «Rumore — perimetro Ovest» atterra su una sezione che gli racconta i
         certificati di un altro strumento — con l'aria di parlare di quello
         che ha appena toccato. Le altre sorgenti non hanno questo campo e la
         pagina non glielo chiede: lo legge solo per categoria «taratura». */
      puntoId: (m || {}).id || "",
      /* ⚠️ Corto di proposito: la riga di dettaglio delle allerte è tagliata a
         due righe, quindi una frase appesa in fondo non la legge nessuno. Il
         numero del certificato e il centro stanno nella sezione, che è dove si
         va a cercarli; qui ci va la sola cosa che serve per decidere. */
      dettaglio: scaduta
        ? "taratura scaduta il " + dataIt(t.scadenza) + " · letture non più coperte"
        : "taratura valida fino al " + dataIt(t.scadenza) + " · poi non copre più",
      badge: scaduta ? "scaduta da " + (-g) + " gg" : g + " gg",
    });
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// T2d · LA CATENA DI CUSTODIA DEL DATO DI MISURA
// «Da dove viene questo numero, e chi può dire di averlo visto entrare?»
//
// PERCHÉ. Il prodotto di Sentinella non è un cruscotto: è un documento che
// va a un ente. Un PPV in mm/s o un livello in dB valgono quanto la loro
// provenienza — e fino a oggi il report affiancava, nella STESSA tabella e
// con lo STESSO aspetto, numeri usciti dal file dello strumento e numeri
// digitati a mano da qualcuno. Chi legge non aveva modo di distinguerli.
// È la seconda metà di T2b: là si dichiara se lo strumento era tarato («di
// chi sono questi numeri»), qui **per che strada sono entrati**.
//
// ⛔ IL CUORE, ED È IL PRINCIPIO DEL FONDATORE: una misura di cui NON si
// conosce la provenienza non è «a mano» e non è «da file». È
// **provenienza non dichiarata**, e va detto. Il ripiego comodo sarebbe
// contarla fra quelle a mano (sono le più vecchie, ed è probabile): sarebbe
// un'invenzione scritta in un documento verso un ente. Il ripiego opposto —
// contarla fra le strumentali — sarebbe peggio ancora. Quindi è un terzo
// stato, e i tre conti restano separati fino alla frase finale.
// ⚠️ Tutte le letture registrate PRIMA di questa unità cadono lì, ed è
// giusto così: nessuno può dire per che strada sono entrate.
//
// ⛔ E NON SI RIEMPIE ALL'INDIETRO. Reimportando lo stesso file, le letture
// già presenti con provenienza ignota **non** diventano «importate da quel
// file»: la firma coincide, ma «lo stesso numero lo stesso giorno» non
// dimostra che quella riga venga da lì. Riempirla sarebbe inventare una
// custodia, cioè il difetto che questa sezione esiste per togliere.
//
// ⚠️ DOV'È LA DIFFERENZA CON TERRA, che una provenienza ce l'ha già
// (`origineDi`/`descriviOrigine`). Là si descrive **come è stato calcolato**
// un volume — metodo, lato cella, quota di base, ritaglio — e il vocabolario
// è `visore|manuale|csv`. Qui si descrive **per che strada è entrato** un
// numero già misurato da uno strumento, e la domanda che Terra non si pone
// (perché un rilievo non si ritocca) è la terza: **è stato corretto dopo?**
// Stesso principio, due oggetti diversi: nessuna delle due funzioni
// risponderebbe alla domanda dell'altra. Per questo non è un alias di
// `shared/` — e per questo i nomi sono diversi, così `nomi-doppi.mjs` non
// le confonde.
// ══════════════════════════════════════════════════════════════════════

// Il vocabolario, chiuso. Tre parole e basta: aggiungerne una quarta
// vorrebbe dire aggiungere una strada per cui un numero entra.
export const FONTE_IMPORT = "import";       // arrivata dal file esportato dallo strumento
export const FONTE_MANO = "manuale";        // digitata da una persona nel campo della misura
export const FONTE_IGNOTA = "non dichiarata";  // non si sa: NON è un ripiego su una delle due

// Come si mostra ognuna delle tre. `cls` è la classe del semaforo:
// ⛔ «a mano» NON è un allarme — è una pratica legittima, e un badge giallo
// su ogni misura battuta a mano sarebbe un rimprovero continuo che si
// impara a non guardare. Giallo lo prende SOLO ciò che non si sa.
/* ⚠️ `breve` VIVE IN UNA COLONNA, E LA COLONNA HA UN COSTO. La prima
   stesura scriveva «provenienza non dichiarata» dentro la cella: a 320 px
   quella pillola occupava tre righe e allargava la tabella al punto da
   spingere **la colonna dell'esito fuori dallo schermo** — cioè il verdetto,
   che è la ragione per cui il documento esiste. Non si vedeva leggendo il
   codice: l'ha trovato lo scatto. La colonna si intitola già «Provenienza»,
   quindi ripeterlo nella cella era anche una ridondanza.
   `label` resta la forma lunga, ed è quella che va negli elenchi e nelle
   frasi dove non c'è un'intestazione a dire di che si parla. */
export const FONTI_MISURA = {
  [FONTE_IMPORT]: { cls: "ok",   breve: "da file",        label: "Importata dal file dello strumento" },
  [FONTE_MANO]:   { cls: "",     breve: "a mano",         label: "Inserita a mano" },
  [FONTE_IGNOTA]: { cls: "warn", breve: "non dichiarata", label: "Provenienza non dichiarata" },
};

// Da dove viene UNA lettura. Non deduce niente: legge quello che è scritto.
// La bandiera `noto` la consuma `descriviProvenienza` qui sotto, che su
// `false` scrive una frase diversa invece di tacere.
export function provenienzaMisura(l) {
  const o = (l || {}).origine;
  const vuota = { da: FONTE_IGNOTA, noto: false, file: "", quando: "", corretta: null };
  if (!o || typeof o !== "object") return vuota;
  /* ⛔ UNA CORREZIONE SU UN VALORE ILLEGGIBILE RESTA UNA CORREZIONE. Se il
     numero di partenza non era un numero, `prima` vale `null` — e la frase
     lo dice. Pretendere che `prima` fosse finito per riconoscere la
     correzione l'avrebbe fatta sparire proprio nel caso più sospetto. */
  /* ⚠️ `co.prima != null` PRIMA di `Number.isFinite`, e non è pignoleria:
     `+null` fa **zero** e `Number.isFinite(0)` risponde **true**, quindi un
     valore d'origine illeggibile sarebbe tornato indietro come «in origine
     era 0» — un numero di misura, tranquillo, al posto dell'ammissione. È
     la stessa trappola di `avanzamentoLotto` («0%» dove nessuno ha
     misurato), e l'ha trovata la prova, non la rilettura. */
  const co = o.corretta;
  const corretta = (co && typeof co === "object")
    ? { quando: String(co.quando || ""),
        prima: (co.prima != null && Number.isFinite(+co.prima)) ? +co.prima : null }
    : null;
  const da = String(o.da || "").trim().toLowerCase();
  if (da !== FONTE_IMPORT && da !== FONTE_MANO) return { ...vuota, corretta };
  return { da, noto: true, file: String(o.file || "").trim(),
           quando: String(o.quando || "").trim(), corretta };
}

/* Il momento, scritto come lo legge una persona. L'istante è quello di
   `istanteLocale` di `shared/` (giorno LOCALE, mai `toISOString()`), quindi
   qui basta rimontarlo: la data la scrive `dataIt`.
   ⚠️ La validità del giorno la decide `dataISOEsiste`, NON `dataIt`: il
   `dataIt` di questo modulo, su una data che non esiste, restituisce «—»
   invece di una stringa vuota, e un «il —» in mezzo a una frase del
   documento sarebbe peggio del silenzio. E `dataISOEsiste` il 30 febbraio
   lo rifiuta invece di farlo scivolare al 2 marzo. */
function quandoIt(istante) {
  const s = String(istante || "");
  const g = s.slice(0, 10);
  if (!dataISOEsiste(g)) return "";
  const ora = /^\d{2}:\d{2}/.exec(s.slice(11));
  return dataIt(g) + (ora ? " alle " + ora[0] : "");
}

// La frase che finisce nel documento, per UNA misura.
// ⛔ Primo requisito, come per `descriviOrigine` di Terra: senza provenienza
// la frase NON deve sembrare una misura tracciata. Chi legge è un
// funzionario, e una riga che tace lascia credere che il numero sia
// verificabile.
export function descriviProvenienza(l, punto) {
  const p = provenienzaMisura(l);
  const nome = String(((punto || {}).nome) || "").trim();
  const a = nome ? `allo strumento «${nome}»` : "al punto di misura";
  let t;
  if (!p.noto)
    t = "Provenienza non dichiarata: per questa misura non risulta se sia stata importata "
      + `dal file dello strumento o inserita a mano. È attribuita ${a}.`;
  else if (p.da === FONTE_IMPORT)
    t = "Misura importata" + (p.file ? ` dal file «${p.file}»` : " da un testo incollato nella schermata di import")
      + (p.quando ? ` il ${quandoIt(p.quando)}` : "") + `, attribuita ${a}.`;
  else
    t = "Misura inserita a mano" + (p.quando ? ` il ${quandoIt(p.quando)}` : "")
      + `, attribuita ${a}: il valore non proviene da un file dello strumento.`;
  if (p.corretta)
    t += " Il valore è stato CORRETTO dopo l'inserimento"
      + (p.corretta.quando ? ` il ${quandoIt(p.corretta.quando)}` : "")
      + (p.corretta.prima != null
          ? `: il valore registrato in origine era ${numeroIt(p.corretta.prima)}.`
          : ": il valore registrato in origine non è leggibile.");
  return t;
}

// I campi da scrivere su una lettura che nasce adesso. Funzione pura come
// `campiPpvVolata`: prepara il record, non lo salva. `quando` iniettabile
// perché le prove non dipendano dall'orologio di chi le lancia.
export function campiProvenienza(da, opts = {}) {
  const quando = String(opts.quando || istanteLocale());
  if (da === FONTE_IMPORT)
    return { origine: { da: FONTE_IMPORT, file: String(opts.file || "").trim(), quando } };
  return { origine: { da: FONTE_MANO, quando } };
}

// LA CORREZIONE DI UNA MISURA GIÀ REGISTRATA.
// ⛔ Il valore nuovo non prende il posto del vecchio in silenzio: la lettura
// si porta dietro che è stata corretta, QUANDO, e QUAL ERA il numero
// entrato in origine. Su un documento che va all'ente, una misura ritoccata
// che sembra quella originale è la cosa peggiore che questa app possa fare.
// ⚠️ IL LIMITE, DICHIARATO: si conservano il PRIMO valore e l'ULTIMA
// correzione, non tutti i passaggi intermedi. Correggendo due volte, `prima`
// resta il numero d'origine — è quello che interessa a chi legge il
// documento («questo non è il numero che è entrato»), e un archivio di
// versioni sarebbe un'altra cosa, da decidere a parte.
// Ritorna `null` quando non c'è niente da fare (valore illeggibile o
// negativo): uno strumento non misura meno di zero.
export function correggiLettura(l, nuovo, quando) {
  if (!l || typeof l !== "object") return null;
  /* ⛔ LA GUARDIA C'ERA E NON PRENDEVA IL CASO PIÙ FACILE. Qui c'era
     `const v = +nuovo`, e `+null`, `+""` e `+[]` fanno tutt'e tre **0**, che
     è finito e non è negativo: passavano. Misurato il 03/08 su una lettura da
     3,2 mm/s:

       correggiLettura(l, null)  → valore: 0, prima: 3,2
       correggiLettura(l, "")    → valore: 0, prima: 3,2
       correggiLettura(l, [])    → valore: 0, prima: 3,2
       correggiLettura(l, "boh") → rifiutata (giusto)

     Cioè: una **misura di vibrazione portata a zero e registrata come una
     correzione fatta da qualcuno**, con l'ora e il valore di prima. Non è un
     numero tranquillo di troppo: è un dato ambientale falsificato, con la
     firma. E lo zero **scritto davvero** deve continuare a passare — capita
     di correggere a zero — quindi non si può rifiutare lo 0: si deve
     rifiutare il **vuoto**, che è un'altra cosa.
     `numIt` (in `shared/`) fa esattamente questo: legge i numeri veri, anche
     con la virgola italiana, e risponde `NaN` a tutto ciò che numero non è. */
  const v = numIt(nuovo);
  if (!Number.isFinite(v) || v < 0) return null;
  /* ⛔ «PRIMA VALEVA ZERO» È UNA COSA CHE SI SCRIVE NEL REGISTRO. Qui c'era
     `+l.valore`, e su una lettura con `valore: null` faceva **0**: la
     correzione veniva registrata con `prima: 0`, cioè affermando che quella
     misura valeva zero — mentre non aveva nessun valore. Misurato il 03/08:
       correggiLettura({valore: null}, 2) → prima: 0      ← falso
       correggiLettura({}, 0)             → prima: null   ← giusto
     Due vuoti, due risposte diverse, nello stesso punto: `+undefined` è NaN e
     `+null` è 0. `numIt` li tratta tutt'e due per quello che sono. */
  const prec = numIt(l.valore);
  if (Number.isFinite(prec) && prec === v) return { ...l };   // stesso numero: nessuna correzione finta
  const p = provenienzaMisura(l);
  const o = (l.origine && typeof l.origine === "object") ? { ...l.origine } : { da: FONTE_IGNOTA };
  o.corretta = {
    quando: String(quando || istanteLocale()),
    prima: p.corretta ? p.corretta.prima : (Number.isFinite(prec) ? prec : null),
  };
  return { ...l, valore: v, origine: o };
}

/* ⛔ QUANDO LA QUOTA NON STRUMENTALE SMETTE DI ESSERE TRASCURABILE. Una
   soglia qualunque sarebbe arbitraria, quindi il peso non ce l'ha: i tre
   conti si scrivono SEMPRE nel documento, e questa soglia decide soltanto
   se la frase di accompagnamento alza la voce. Una misura su cinque è il
   punto in cui la composizione smette di essere un dettaglio. */
export const QUOTA_NON_STRUMENTALE = 0.2;

// La composizione delle misure di un report: quante strumentali, quante a
// mano, quante di provenienza ignota, quante corrette.
// ⛔ Come le tarature, sta ACCANTO all'esito e non dentro: «hanno superato
// la soglia?» e «per che strada sono entrate?» sono due domande diverse, e
// far cambiare un giudizio di conformità per la strada d'ingresso sarebbe
// sbagliato in tutt'e due i versi.
export function composizioneProvenienza(punti) {
  let importate = 0, aMano = 0, nonDichiarate = 0, corrette = 0;
  for (const p of punti || [])
    for (const l of (((p || {}).letture) || [])) {
      const pr = provenienzaMisura(l);
      if (pr.da === FONTE_IMPORT) importate++;
      else if (pr.da === FONTE_MANO) aMano++;
      else nonDichiarate++;
      if (pr.corretta) corrette++;
    }
  const n = importate + aMano + nonDichiarate;
  const fuori = aMano + nonDichiarate;
  // ⛔ `null` e non `0`: senza misure la quota non è «zero per cento
  // a mano», è una frazione che non si può calcolare.
  const quota = n ? fuori / n : null;
  const stato = !n ? "senza-letture"
    : nonDichiarate === n ? "non-dichiarata"
    : !fuori ? "tracciata"
    : quota >= QUOTA_NON_STRUMENTALE ? "non-trascurabile"
    : "mista";
  return { importate, aMano, nonDichiarate, corrette, n, fuori, quota, stato };
}

// La frase del documento. Parole scelte per un funzionario: dicono cosa si
// sa e cosa non si sa, senza lasciargli dedurre niente.
// ⚠️ Copre tutti e cinque gli stati che `composizioneProvenienza` sa dire
// (regola 18 dello stile): una mappa più corta ucciderebbe la pagina al
// disegno, senza nessun errore di sintassi da vedere.
export const DICHIARAZIONI_PROVENIENZA = {
  "tracciata":        { cls: "ok",   testo: "Tutte le misure del periodo provengono da file esportati dagli strumenti e importati in Sentinella: nessun valore è stato digitato a mano." },
  "mista":            { cls: "warn", testo: "La maggior parte delle misure del periodo proviene da file degli strumenti; una parte minore è stata inserita a mano oppure non dichiara la propria provenienza." },
  "non-trascurabile": { cls: "warn", testo: "Una quota non trascurabile delle misure del periodo NON proviene da un file dello strumento: è stata inserita a mano oppure non dichiara la propria provenienza. Il documento riporta quei valori come sono stati registrati, senza poterli ricondurre a un file dello strumento." },
  "non-dichiarata":   { cls: "warn", testo: "Nessuna misura del periodo dichiara la propria provenienza: non risulta se i valori siano stati importati da file degli strumenti o inseriti a mano. Il documento riporta i valori registrati, non la strada per cui sono entrati." },
  "senza-letture":    { cls: "warn", testo: "Nel periodo non ci sono misure, quindi non c'è nessuna provenienza da dichiarare." },
};

// ══════════════════════════════════════════════════════════════════════
// T2e · IL PERIODO DICHIARATO CONTRO IL PERIODO DAVVERO MISURATO
// ══════════════════════════════════════════════════════════════════════
// Perché esiste: in testa al report c'è scritto «Periodo: dal 01/01/2026 al
// 31/12/2026» e in fondo c'è scritto «Conforme». Fra le due righe nessuno
// diceva che le misure si fermavano al 10 marzo. Chi legge — un funzionario
// che ha in mano un documento intestato a dodici mesi — non ha modo di
// accorgersene: dovrebbe scorrere ogni tabella e confrontare le date a mente.
// È la stessa famiglia del «conforme» su punti mai misurati: un giudizio
// tranquillo su una finestra di tempo che non è stata guardata.
//
// ⛔ QUESTA FUNZIONE NON GIUDICA, E NON È PIGRIZIA. «Quante misure bastano»
// dipende dall'autorizzazione del sito e dal programma di monitoraggio, e una
// soglia inventata qui (metà periodo? trenta giorni?) sarebbe arbitraria — la
// stessa ragione per cui `QUOTA_NON_STRUMENTALE` pesa solo sul tono e non sui
// numeri. Qui i numeri si scrivono SEMPRE e il lettore giudica: giorni
// dichiarati, primo e ultimo giorno misurato, giorni scoperti in testa e in
// coda, e il vuoto più lungo. `stato` distingue solo tre situazioni di FATTO.
//
// ⛔ IL FONDO DEL PERIODO SI TAGLIA A OGGI. Un report generato il 25 marzo su
// «tutto il 2026» ha 281 giorni davanti che non sono un buco: non sono ancora
// passati. Senza questo taglio l'avviso sarebbe partito su un caso sano — lo
// stesso errore di mestiere del ponte col volume di Terra, dove il confronto
// fra le date accusava un rilievo che era a posto.
//
// ⛔ E IL VUOTO PIÙ LUNGO SERVE PERCHÉ TESTA E CODA NON BASTANO: due misure,
// una a gennaio e una a dicembre, coprono il periodo agli estremi e lasciano
// dentro 348 giorni senza niente. Guardando solo `giorniPrima`/`giorniDopo`
// quel report sembrerebbe completo.
export function coperturaPeriodo(punti, dal, al, oggi = new Date()) {
  const d = dataISOEsiste(String(dal || "").slice(0, 10)) ? String(dal).slice(0, 10) : "";
  const a = dataISOEsiste(String(al || "").slice(0, 10)) ? String(al).slice(0, 10) : "";
  const o = new Date(oggi);
  const p2 = (n) => String(n).padStart(2, "0");
  const oggiISO = `${o.getFullYear()}-${p2(o.getMonth() + 1)}-${p2(o.getDate())}`;
  const aUtile = a ? (a > oggiISO ? oggiISO : a) : "";
  const oltreOggi = !!(a && a > oggiISO);
  // i giorni fra due date ISO, col conto locale di `shared/` (mai
  // `new Date(x) - new Date(y)`: è la copia debole che dà «scaduta da 56 anni»)
  const fra = (x, y) => giorniTra(y, new Date(x + "T00:00:00"));

  const tutti = [...new Set((punti || []).flatMap(p => (((p || {}).letture) || [])
    .map(l => String((l || {}).data || "").slice(0, 10))))].filter(dataISOEsiste).sort();

  const base = { dal: d, al: a, alUtile: aUtile, oltreOggi, prima: null, ultima: null,
    nGiorniMisurati: 0, giorniDichiarati: null, giorniPrima: null, giorniDopo: null,
    vuotoMax: null, vuotoDal: null, vuotoAl: null };
  // senza nessun estremo dichiarato il report dice «tutto lo storico»: non
  // c'è nessuna finestra promessa da confrontare, e fingere di misurarla
  // sarebbe inventarsi il termine di paragone.
  if (!d && !a) return { ...base, stato: "senza-periodo",
    prima: tutti[0] || null, ultima: tutti[tutti.length - 1] || null, nGiorniMisurati: tutti.length };

  const inizio = d || tutti[0] || "";
  const fine = aUtile || tutti[tutti.length - 1] || "";
  // ⛔ dentro la finestra DICHIARATA (non quella tagliata a oggi): una misura
  // registrata con data futura ma dentro il periodo è una misura del periodo.
  const dentro = tutti.filter(g => (!inizio || g >= inizio) && (!a || g <= a));
  if (!dentro.length || !inizio || !fine) return { ...base, stato: "senza-letture" };

  const giorniDichiarati = fine >= inizio ? fra(inizio, fine) + 1 : null;
  const giorniPrima = Math.max(0, fra(inizio, dentro[0]));
  const giorniDopo = Math.max(0, fra(dentro[dentro.length - 1], fine));

  let vuotoMax = 0, vuotoDal = null, vuotoAl = null;
  const segna = (n, da, aX) => { if (n > vuotoMax) { vuotoMax = n; vuotoDal = da; vuotoAl = aX; } };
  segna(giorniPrima, inizio, piuGiorni(dentro[0], -1));
  for (let i = 0; i < dentro.length - 1; i++)
    segna(fra(dentro[i], dentro[i + 1]) - 1, piuGiorni(dentro[i], 1), piuGiorni(dentro[i + 1], -1));
  segna(giorniDopo, piuGiorni(dentro[dentro.length - 1], 1), fine);

  return { ...base, stato: "misurato", prima: dentro[0], ultima: dentro[dentro.length - 1],
    nGiorniMisurati: dentro.length, giorniDichiarati, giorniPrima, giorniDopo,
    vuotoMax, vuotoDal, vuotoAl };
}

// La frase del documento. Come per tarature e provenienza: dice cosa si sa e
// cosa non si sa, e i numeri li scrive sempre la pagina accanto.
// ⚠️ Copre tutti e tre gli stati che `coperturaPeriodo` sa dire (la stessa
// coppia funzione↔mappa della regola 18 dello stile).
export const DICHIARAZIONI_COPERTURA = {
  "misurato":      { cls: "",     testo: "Il documento dichiara un periodo: qui sotto ci sono i giorni in cui una misura è stata davvero registrata e quelli in cui non ce n'è nessuna. Quante misure servano lo stabiliscono l'autorizzazione del sito e il programma di monitoraggio: questo documento riporta i fatti, non li giudica." },
  "senza-letture": { cls: "warn", testo: "Nel periodo dichiarato non risulta registrata nessuna misura: il documento non copre nemmeno un giorno di quelli che dichiara." },
  "senza-periodo": { cls: "",     testo: "Non è stato dichiarato nessun periodo: il documento riporta tutto lo storico registrato, quindi non c'è una finestra di tempo promessa da confrontare con le misure." },
};

// ══════════════════════════════════════════════════════════════════════
// T2f · DALL'ADEMPIMENTO AL PERIODO DEL REPORT
// ══════════════════════════════════════════════════════════════════════
// Perché esiste. Lo scadenzario sa QUANDO va consegnato un adempimento; il
// Report chiede «dal» e «al» e li fa DIGITARE. Fra le due cose non c'era
// niente, quindi chi prepara la relazione trimestrale indovina il trimestre —
// e produce un documento perfettamente coerente SUL PERIODO SBAGLIATO. È la
// famiglia del numero tranquillo in una veste nuova: qui non mente nessun
// numero, mente la DOMANDA a cui il documento risponde, e nessuno se ne
// accorge perché due date scritte a mano non sono smentite da niente.
//
// ⛔ E NON È LA `PERIODICITA` DEL PROGRAMMA. Quella dice ogni quanto si MISURA
// un punto (e vale in giorni, con la sua convenzione dichiarata: «mensile» =
// 30 giorni). Questa dice quanto tempo COPRE un documento, e lì i giorni non
// bastano: un trimestre che chiude il 30/09 comincia il 01/07, non il 03/07,
// e un report per l'ente che parte due giorni dopo il trimestre è un report
// che due giorni non li ha guardati. Quindi si conta in MESI DI CALENDARIO,
// che è il modo in cui le prescrizioni autorizzative sono scritte.
//
// ⛔ SERVONO DUE COSE DICHIARATE, E LA SECONDA NON HA UN RIPIEGO. La scadenza
// da sola non basta: fra la fine del periodo coperto e il termine di consegna
// c'è quasi sempre un intervallo («la relazione annuale entro il 30 aprile
// dell'anno successivo»). Dedurre zero vorrebbe dire spostare TUTTO il
// periodo in avanti di quanto vale il termine vero — cioè fabbricare
// esattamente il difetto che questa unità esiste per togliere, e con l'aria
// di essere giusto. Quindi `giorniConsegna` non dichiarato ⇒ non si sa; uno
// zero SCRITTO è invece una risposta legittima («il periodo chiude il giorno
// della scadenza»). È la stessa differenza fra `null` e 0 che regge tutto il
// resto del modulo: `+null` fa zero, e uno zero dedotto è un numero tranquillo.
export const PERIODI_ADEMPIMENTO = [
  { chiave: "mensile",        etichetta: "Un mese",       mesi: 1 },
  { chiave: "bimestrale",     etichetta: "Due mesi",      mesi: 2 },
  { chiave: "trimestrale",    etichetta: "Tre mesi",      mesi: 3 },
  { chiave: "quadrimestrale", etichetta: "Quattro mesi",  mesi: 4 },
  { chiave: "semestrale",     etichetta: "Sei mesi",      mesi: 6 },
  { chiave: "annuale",        etichetta: "Un anno",       mesi: 12 },
];

// Data ISO spostata INDIETRO di n mesi di calendario, in UTC. Se il giorno non
// esiste nel mese d'arrivo (31/03 − 1 mese) si serra all'ultimo giorno utile
// invece di scivolare al mese dopo — è la stessa convenzione che Scudo usa per
// andare avanti (`dataDaPeriodicita`), scritta qui perché va nel verso opposto
// e in UTC (le date di questo modulo sono ISO, non `Date` locali).
// Ritorna "" se la data di partenza non è un giorno che esiste: `dataISOEsiste`
// e non una regex sulla forma, perché «2026-02-30» la forma ce l'ha.
export function dataMenoMesi(dataISO, n) {
  const s = String(dataISO || "").slice(0, 10);
  if (!dataISOEsiste(s)) return "";
  const [a, m, g] = s.split("-").map(Number);
  const mesi = Math.round(+n || 0);
  const tot = (a * 12 + (m - 1)) - mesi;
  const aa = Math.floor(tot / 12), mm = ((tot % 12) + 12) % 12;
  const p2 = (x) => String(x).padStart(2, "0");
  const ultimo = new Date(Date.UTC(aa, mm + 1, 0)).getUTCDate();
  return `${aa}-${p2(mm + 1)}-${p2(Math.min(g, ultimo))}`;
}

// IL PERIODO CHE UN ADEMPIMENTO COPRE, ricavato da quello che l'adempimento
// DICHIARA: `periodoMesi` (quanti mesi di calendario copre) e `giorniConsegna`
// (quanti giorni dopo la fine del periodo cade la scadenza).
//   al  = scadenza − giorniConsegna
//   dal = (al + 1 giorno) − periodoMesi mesi
// Il «+1 giorno» prima di togliere i mesi non è un dettaglio: senza di lui un
// semestre che chiude il 30/09 comincerebbe il 31/03 invece che il 01/04,
// perché marzo ha 31 giorni e settembre 30.
// La bandiera è `noto`, lo stesso vocabolario di `provenienzaMisura` e
// `descriviResponsabile`; a leggerla sono `descriviPeriodoAdempimento` qui
// sotto e la pagina, che sul falso NON porta a un documento ma dice cosa manca.
// `motivo` è sempre una delle quattro chiavi di `DICHIARAZIONI_PERIODO`.
// Pura e testabile.
export function periodoAdempimento(a) {
  const vuoto = { noto: false, dal: "", al: "", mesi: null, giorniConsegna: null, giorni: null };
  const scad = String((a || {}).scadenza || "").slice(0, 10);
  /* ⛔ `numeroDichiarato` e non `+x`: `periodoMesi: null` e `periodoMesi: ""`
     valgono zero con la conversione, e `Number.isFinite(0)` risponde true —
     la trappola che in questa casa ha già prodotto «0%» dove nessuno aveva
     misurato. Qui produrrebbe un periodo di zero mesi, cioè `dal` = `al` + 1. */
  const pm = numeroDichiarato((a || {}).periodoMesi);
  const mesi = (pm != null && pm >= 1 && pm <= 120) ? Math.round(pm) : null;
  const gcv = numeroDichiarato((a || {}).giorniConsegna);
  const gc = (gcv != null && gcv >= 0) ? Math.round(gcv) : null;
  if (!dataISOEsiste(scad)) return { ...vuoto, mesi, giorniConsegna: gc, motivo: "scadenza-illeggibile" };
  if (mesi == null) return { ...vuoto, giorniConsegna: gc, motivo: "senza-periodicita" };
  if (gc == null) return { ...vuoto, mesi, motivo: "senza-termine" };
  const al = piuGiorni(scad, -gc);
  const dal = al ? dataMenoMesi(piuGiorni(al, 1), mesi) : "";
  if (!al || !dal || dal > al) return { ...vuoto, mesi, giorniConsegna: gc, motivo: "scadenza-illeggibile" };
  return { noto: true, dal, al, mesi, giorniConsegna: gc,
           /* ⚠️ L'ORDINE DEGLI ARGOMENTI: `giorniTra(bersaglio, da)`, come lo
              chiama `coperturaPeriodo` (`fra(x, y) → giorniTra(y, …x)`). Scritto
              al contrario dà i giorni col segno rovesciato, cioè un periodo
              lungo −92 giorni con l'aria di un numero. */
           giorni: giorniTra(al, new Date(dal + "T00:00:00")) + 1, motivo: "ricavato" };
}

// La frase che la pagina mostra. Quattro chiavi, quante ne sa dire
// `periodoAdempimento`: è la coppia funzione↔mappa della regola 18 di
// `run-stile.mjs`, e il giorno che nascesse un quinto motivo la mappa lo
// direbbe invece di far morire la pagina al disegno.
// ⛔ Nessuna delle tre frasi di «non lo so» propone un periodo di ripiego, ed è
// il punto: un trimestre plausibile scritto al posto di quello vero sarebbe
// indistinguibile da quello giusto per chi legge il documento finito.
export const DICHIARAZIONI_PERIODO = {
  "ricavato":             { cls: "",     testo: "Il periodo coperto da questo adempimento si ricava dalla scadenza e da quanto l'adempimento dichiara di coprire: il report parte già su quei giorni, senza scriverli a mano." },
  "senza-periodicita":    { cls: "warn", testo: "Questo adempimento non dichiara quanto tempo copre, quindi il periodo del report non si ricava. Scrivilo sulla scadenza (quanti mesi copre) oppure scegli le date a mano nel Report." },
  "senza-termine":        { cls: "warn", testo: "Manca il termine di consegna: non si sa quanti giorni passano fra la fine del periodo coperto e la scadenza, e senza quel numero il periodo scivolerebbe in avanti. Scrivilo sulla scadenza — se il periodo chiude il giorno stesso della scadenza, il numero è zero." },
  "scadenza-illeggibile": { cls: "warn", testo: "La data di scadenza non è un giorno che esiste, quindi non c'è nessun punto da cui contare all'indietro: il periodo del report non si ricava." },
};

// Il periodo detto come lo legge una persona, con la bandiera accanto. La
// bandiera la consuma anche questa funzione (non solo la pagina): su `false`
// scrive che cosa manca invece di tacere o di dire un intervallo.
export function descriviPeriodoAdempimento(a) {
  const p = periodoAdempimento(a);
  const voce = PERIODI_ADEMPIMENTO.find(x => x.mesi === p.mesi);
  return {
    ...p,
    // ⚠️ «1 mesi» si sente: il numero davanti a un singolare si toglie.
    durata: p.mesi == null ? "" : voce ? voce.etichetta.toLowerCase()
      : p.mesi === 1 ? "un mese" : p.mesi + " mesi",
    testo: p.noto
      ? "periodo dell'adempimento: dal " + dataIt(p.dal) + " al " + dataIt(p.al)
      : p.motivo === "senza-periodicita" ? "periodo dell'adempimento non dichiarato"
      : p.motivo === "senza-termine" ? "periodo dell'adempimento non ricavabile: manca il termine di consegna"
      : "periodo dell'adempimento non ricavabile: la scadenza non è un giorno che esiste",
  };
}

// ══════════════════════════════════════════════════════════════════════
// T3 · REPORT DI CONFORMITÀ
// È il documento che il cliente consegna all'ente: periodo, ricettore,
// letture, soglia applicata (e da dove viene), superamenti, esito.
// Funzione PURA: prende i dati e restituisce il contenuto del documento,
// senza toccare né la pagina né la stampa. `oggi` iniettabile.
// ══════════════════════════════════════════════════════════════════════
// L'ESITO DI UN PUNTO, in una funzione sua. Sta fuori da `reportConformita`
// per due ragioni: la stessa regola vale per il singolo punto e per il
// documento intero (che è la stessa domanda fatta al mucchio), e una mappa di
// stati — `ESITI`, qui sotto — va confrontata con le risposte di UNA funzione,
// se no il giorno che ne nasce una quarta la pagina muore al disegno
// (regola 18 di run-stile).
// ⛔ L'ORDINE DELLE DOMANDE È IL PUNTO. Prima «c'è una misura?», poi «c'è un
// limite?», solo alla fine «l'ha superato?». Fino al 02/08 la seconda domanda
// non veniva fatta: un punto con letture e senza soglia usciva **«conforme»**,
// perché nessuna lettura risultava «oltre» una soglia che non c'era. Cioè il
// documento che va all'ente dichiarava rispettato un limite mai scritto.
export function esitoPunto(nLetture, nSuperamenti, soglia) {
  if (!(+nLetture > 0)) return "senza-dati";
  if (!sogliaValida(soglia)) return "senza-soglia";
  if (+nSuperamenti > 0) return "non-conforme";
  return "conforme";
}

export function reportConformita(o = {}) {
  const dal = String(o.dal || "").slice(0, 10);
  const al = String(o.al || "").slice(0, 10);
  const ricettori = o.ricettori || [];
  const ricettoreId = o.ricettoreId || "";
  const ricettore = ricettoreId ? trovaRicettore(ricettori, ricettoreId) : null;
  /* ⛔ UNA DATA SI GIUDICA PER QUEL CHE VALE, NON PER COM'È SCRITTA — e qui
     dentro c'era la copia debole, nel posto peggiore: la funzione che compone
     il documento che va all'ente. Il filtro era `if (!g) return false` e poi
     due confronti fra STRINGHE: «2026-02-30» — un giorno che non esiste — è
     una stringa maggiore di «2026-01-01» e minore di «2026-12-31», quindi
     entrava nel report. La regola giusta è nello stesso file da mesi:
     `lettureNelPeriodo`, che alimenta ogni schermata, chiede `dataISOEsiste`.
     Misurato su un punto con tre letture, una datata 30 febbraio a 99 µg/m³
     con la soglia a 40:
       · SCHERMO (`statPeriodo`): 2 letture, massimo 20, zero superamenti;
       · DOCUMENTO (questa funzione): 3 letture, massimo 99, UN superamento,
         esito «Non conforme» — e la riga stampata portava «—» nella colonna
         della data, perché `dataIt` un 30 febbraio lo rifiuta.
     Due verità sullo stesso archivio, e quella scritta sulla carta era
     l'unica che usciva dall'azienda.
     `nelPeriodo` filtra anche reclami e volate, e `parseVolateCsv` la data
     non la valida affatto: senza periodo dichiarato («tutto lo storico»)
     entrava perfino «boh». */
  const dataUsabile = (d) => dataISOEsiste(String(d || "").slice(0, 10));
  const nelPeriodo = (d) => {
    const g = String(d || "").slice(0, 10);
    if (!dataUsabile(g)) return false;
    return (!dal || g >= dal) && (!al || g <= al);
  };
  /* ⛔ E QUELLO CHE RESTA FUORI VA DICHIARATO, se no si è solo spostata la
     bugia: una riga registrata che sparisce dal documento senza una parola è
     l'assenza scambiata per un dato favorevole — la stessa forma di
     `affidabilitaFlotta.senzaDate`, che i suoi fermi non collocabili li conta
     a parte e li dice. Qui si contano le righe che il documento NON ha potuto
     usare perché il giorno che portano scritto non esiste (o, per le letture,
     perché il valore non è un numero). Una riga esclusa perché cade FUORI dal
     periodo NON si conta: quella è un'esclusione legittima e non una mancanza
     — è la sola ragione per cui il conto non passa da `nelPeriodo`.
     ⚠️ E il conto guarda l'ARCHIVIO, non la finestra: una riga illeggibile
     non ha una data con cui decidere se è del periodo, quindi la domanda «è
     dei giorni che sto raccontando?» su di lei non ha risposta. La frase che
     la pagina scrive dice infatti «in archivio», e chiede di correggerla lì. */
  const scartataPerData = (x) => !dataUsabile((x || {}).data);

  const punti = (o.monitoraggi || [])
    .filter(m => !ricettoreId || m.ricettoreId === ricettoreId)
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      /* ⛔ `origine` viaggia con la lettura fin dentro il documento (T2d):
         la tabella del report ne scrive la provenienza riga per riga, e
         `composizioneProvenienza` la conta. Ricopiando solo data/ora/valore
         — che è come stava scritto prima — il documento avrebbe potuto
         dichiarare la composizione soltanto dicendo «non lo so» su tutto. */
      const grezze = ((m.letture) || [])
        .map(l => ({ data: String((l || {}).data || "").slice(0, 10), ora: String((l || {}).ora || ""), valore: +((l || {}).valore),
                     ...((l || {}).origine && typeof l.origine === "object" ? { origine: l.origine } : {}) }));
      // le letture registrate su questo punto che il documento non può usare:
      // il giorno non esiste, oppure il valore non è un numero
      const scartate = grezze.filter(l => scartataPerData(l) || !Number.isFinite(l.valore)).length;
      const letture = grezze
        .filter(l => Number.isFinite(l.valore) && nelPeriodo(l.data))
        .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; })
        /* ⛔ `oltre` HA TRE RISPOSTE, NON DUE (decisione 16). Con `false` la
           tabella del documento scriveva su OGNI riga il tag verde «entro
           soglia» — su un punto dove nessuna soglia esiste. `null` è la
           convenzione dell'ecosistema per «non si può dire», e la pagina la
           legge per scrivere «non confrontata». I filtri non cambiano:
           `null` è falso, quindi `letture.filter(l => l.oltre)` conta le
           stesse righe di prima. */
        .map(l => ({ ...l, oltre: eff.valore == null ? null : l.valore >= eff.valore }));
      const valori = letture.map(l => l.valore);
      const superamenti = letture.filter(l => l.oltre);
      return {
        m, nome: m.nome || "Punto di misura", unita: unitaMisura(m), soglia: eff,
        ricettore: trovaRicettore(ricettori, m.ricettoreId),
        letture, n: letture.length, scartate,
        max: valori.length ? Math.max(...valori) : null,
        min: valori.length ? Math.min(...valori) : null,
        media: valori.length ? valori.reduce((s, v) => s + v, 0) / valori.length : null,
        superamenti, nSuperamenti: superamenti.length,
        esito: esitoPunto(valori.length, superamenti.length, eff.valore),
      };
    });

  const nLetture = punti.reduce((s, p) => s + p.n, 0);
  const nSuperamenti = punti.reduce((s, p) => s + p.nSuperamenti, 0);
  const conDati = punti.filter(p => p.n > 0);
  /* ⛔ IL DENOMINATORE DEL DOCUMENTO. `conDati` diceva «di questi punti
     qualcuno ha misurato»; non diceva «di questi punti si può giudicare la
     conformità», che è la domanda a cui il documento risponde. Un punto con
     venti letture e nessuna soglia stava in `conDati` e portava zero
     superamenti: bastava lui a far scrivere «Conforme» in testa al report.
     Adesso i giudicabili sono un conto a sé e viaggiano nel documento
     (`nPuntiSenzaSoglia`), perché la pagina li deve DICHIARARE accanto
     all'esito invece di lasciarli sparire dentro un aggettivo tranquillo. */
  const giudicabili = conDati.filter(p => p.soglia.valore != null);
  const senzaSoglia = conDati.filter(p => p.soglia.valore == null);
  /* ⛔ E I PUNTI MAI MISURATI VANNO CONTATI ANCHE LORO, per la stessa ragione
     dei senza-soglia e con la stessa forma. Misurato il 03/08 su tre punti,
     uno solo con letture: il documento scriveva «Conforme» in testa, «Punti di
     misura: 3» nella prima casella, e NIENTE sui due punti su cui nessuno
     aveva misurato niente — perché la riga che mette il denominatore accanto
     al verdetto si accendeva solo se c'erano punti senza soglia
     (`nPuntiSenzaSoglia && …`). Il fatto stava scritto in fondo, nella scheda
     di ciascun punto; l'esito no. È «l'assenza di un dato non è un dato
     favorevole» nel posto in cui questo prodotto quel principio l'ha inventato. */
  const senzaLetture = punti.filter(p => p.n === 0);
  /* ⛔ E UN PIANO PIÙ SU: I RICETTORI SU CUI NON C'È NEMMENO UN PUNTO.
     Misurato il 03/08 con tre ricettori in archivio e uno solo monitorato: la
     testata prometteva «Ricettore: tutti i ricettori della cava», il verdetto
     diceva «Conforme», e degli altri due il documento non faceva parola —
     non comparivano da nessuna parte, perché senza punti non c'è niente da
     elencare. È la stessa mancanza dei punti mai misurati vista un piano più
     su, ed è la domanda che il controllo di prima non si faceva: un punto
     senza letture almeno una scheda ce l'ha, un ricettore senza punti no.
     Solo quando il report è di TUTTA la cava: scelto un ricettore, il
     documento è suo e il caso «nessun punto collegato» lo racconta già. */
  const ricettoriSenzaPunti = ricettoreId ? [] : ricettori
    .filter(r => r && r.id && !(o.monitoraggi || []).some(m => m && m.ricettoreId === r.id))
    .map(r => r.nome || "Ricettore senza nome");
  const esito = esitoPunto(conDati.length, nSuperamenti, giudicabili.length ? 1 : 0);

  const reclamiSuoi = (o.reclami || []).filter(x => !ricettoreId || x.ricettoreId === ricettoreId);
  const reclami = reclamiSuoi
    .filter(x => nelPeriodo(x.data))
    .sort((a, b) => chiaveOrdine(a) < chiaveOrdine(b) ? 1 : -1);

  // Le volate del periodo entrano come CONTESTO: spiegano i picchi. Se il
  // report è di un solo ricettore restano comunque, perché la volata è un
  // evento della cava, non del ricettore.
  // ⛔ Solo le ESEGUITE (T9): questo documento va all'ente e dice «cosa è
  // avvenuto». Una volata soltanto prevista non è avvenuta, e scriverla qui
  // sarebbe una dichiarazione falsa.
  const volateEseguite = (o.volate || []).filter(v => !volataPrevista(v));
  const volate = volateEseguite.filter(v => nelPeriodo(v.data))
    .sort((a, b) => String(a.data || "") < String(b.data || "") ? 1 : -1);
  /* Le righe che il documento ha dovuto lasciare fuori perché il giorno che
     portano scritto non è un giorno che esiste. Si contano SEMPRE, anche a
     zero: è la stessa scelta dei tre conti della provenienza. */
  const scartate = {
    letture: punti.reduce((s, p) => s + p.scartate, 0),
    reclami: reclamiSuoi.filter(scartataPerData).length,
    volate: volateEseguite.filter(scartataPerData).length,
  };
  scartate.totale = scartate.letture + scartate.reclami + scartate.volate;

  // La taratura degli strumenti sta ACCANTO all'esito, non dentro: dice di
  // chi sono i numeri, non se hanno superato il limite. Vedi T2b.
  const tarature = taratureDelReport(punti, o.oggi ? new Date(o.oggi) : new Date());
  /* ⛔ E IL CONTO PER PUNTO VA ATTACCATO AL PUNTO, se no non lo legge nessuno.
     `taratureDelReport` lo calcolava da sempre (`perPunto`), e la pagina
     leggeva solo il totale: il documento diceva «una o più letture sono state
     prese in un giorno non coperto da nessuna taratura» senza dire QUALE
     strumento, e la scheda del punto — dove chi legge sta guardando i numeri
     di quel punto — non ne faceva parola. Una guardia calcolata e mai letta
     non protegge niente. `perPunto` esce dalla stessa `map` che costruisce
     `punti`, quindi gli indici corrispondono per costruzione; la prova
     accanto pretende che i nomi combacino, perché «per costruzione» è
     esattamente ciò che si rompe in silenzio. */
  punti.forEach((p, i) => { p.taratura = tarature.perPunto[i] || null; });

  // La CATENA DI CUSTODIA delle misure del periodo (T2d). Sta accanto
  // all'esito come le tarature, e per la stessa ragione: risponde a «per
  // che strada sono entrati questi numeri», non a «hanno superato il
  // limite». Si conta sulle letture DEL PERIODO, non su tutto l'archivio.
  const provenienza = composizioneProvenienza(punti);

  // Il periodo DICHIARATO contro quello davvero misurato (T2e). Sta accanto
  // all'esito come tarature e provenienza, e per la stessa ragione: risponde a
  // «di quali giorni parla questo documento», non a «hanno superato il limite».
  const copertura = coperturaPeriodo(punti, dal, al, o.oggi ? new Date(o.oggi) : new Date());

  return {
    dal, al, ricettore, ricettoreId,
    punti, nPunti: punti.length, nPuntiConDati: conDati.length,
    nPuntiGiudicabili: giudicabili.length, nPuntiSenzaSoglia: senzaSoglia.length,
    nPuntiSenzaLetture: senzaLetture.length,
    puntiSenzaLetture: senzaLetture.map(p => p.nome),
    nRicettoriSenzaPunti: ricettoriSenzaPunti.length, ricettoriSenzaPunti,
    copertura, scartate,
    nLetture, nSuperamenti, esito, tarature, provenienza,
    reclami, nReclami: reclami.length,
    volate, nVolate: volate.length,
    vuoto: punti.length === 0,
    generato: (o.oggi ? new Date(o.oggi) : new Date()),
  };
}

// Etichetta e gravità dell'esito, in parole che capisce anche chi non è
// un tecnico. Sono le stesse facce del semaforo del resto dell'app.
// ⛔ QUATTRO, NON TRE (decisione 16). «Senza dati» e «Senza soglia» si
// somigliano e non sono la stessa cosa, e il documento va all'ente: la prima
// dice che nessuno ha misurato, la seconda che si è misurato ma non c'è nessun
// limite scritto con cui confrontare. Confonderle vorrebbe dire mandare
// qualcuno a cercare letture che ci sono già.
// ⚠️ Ogni chiave qui dentro deve esistere fra le risposte di `esitoPunto`, e
// viceversa: è la coppia che la regola 18 di `run-stile.mjs` confronta.
export const ESITI = {
  "conforme":    { cls: "ok",     label: "Conforme",     testo: "Nel periodo considerato nessuna lettura ha raggiunto la soglia applicata." },
  "non-conforme":{ cls: "danger", label: "Non conforme", testo: "Nel periodo considerato una o più letture hanno raggiunto o superato la soglia applicata." },
  "senza-dati":  { cls: "warn",   label: "Senza dati",   testo: "Nel periodo considerato non ci sono letture registrate: il report non può dire se il limite è stato rispettato." },
  "senza-soglia":{ cls: "warn",   label: "Senza soglia", testo: "Le letture del periodo ci sono, ma su questi punti non è impostata nessuna soglia: non essendoci un limite scritto, il report non può dire né che è stato rispettato né che è stato superato. La soglia si imposta sul punto di misura, oppure sul ricettore a cui il punto è collegato." },
};

// ══════════════════════════════════════════════════════════════════════
// T4 · RECLAMI ED ESPOSTI
// ══════════════════════════════════════════════════════════════════════
export const TIPI_RECLAMO = [
  { chiave: "rumore",     etichetta: "Rumore" },
  { chiave: "polvere",    etichetta: "Polvere" },
  { chiave: "vibrazione", etichetta: "Vibrazione" },
  { chiave: "acque",      etichetta: "Acque" },
  { chiave: "altro",      etichetta: "Altro" },
];
export const etichettaReclamo = (t) =>
  (TIPI_RECLAMO.find(x => x.chiave === String(t || "").toLowerCase()) || {}).etichetta || "Altro";

// Riepilogo dei reclami per il quadro: quanti in tutto, quanti ancora
// aperti, e la data dell'ultimo. Pura e testabile.
export function riepilogoReclami(reclami) {
  const l = reclami || [];
  let ultimo = null;
  for (const x of l) {
    const d = String((x || {}).data || "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(d) && (!ultimo || d > ultimo)) ultimo = d;
  }
  return { totale: l.length, aperti: l.filter(x => (x || {}).stato !== "chiuso").length, ultimo };
}

// ══════════════════════════════════════════════════════════════════════
// T5 · PROGRAMMA DI MONITORAGGIO
// Le letture entrano, ma finora nessuno diceva se il PIANO è stato
// rispettato — ed è la prima cosa che un ente chiede: che cosa misuri,
// dove, ogni quanto, e se sei in pari. Una riga di programma dice
// «questo punto va misurato ogni N giorni»; lo stato NON si salva, si
// calcola dall'ultima lettura di quel punto, esattamente come lo stato
// delle scadenze. Così non esiste il caso di una riga «in regola»
// salvata mesi fa e mai più aggiornata.
// NIENTE periodicità di legge cablate: frequenze e tolleranze cambiano
// da autorizzazione a autorizzazione e le imposta l'utente.
// Collezione:
//   programma/{id}: { monitoraggioId, ogniGiorni, tolleranzaGiorni,
//                     dal (ISO, facoltativa), nota, attivo }
// COMPATIBILITÀ: la collezione può non esistere (nessuna riga) — tutte
// le funzioni ritornano liste e conteggi vuoti, niente si rompe.
// ══════════════════════════════════════════════════════════════════════

// Periodicità tipiche, come voci del menù: sono solo scorciatoie per
// scrivere il numero di giorni, non regole. «Mensile» qui vale 30 giorni
// (e lo scriviamo nell'interfaccia): un mese di calendario non ha una
// durata fissa, e far finta di sì renderebbe il conto meno prevedibile.
export const PERIODICITA = [
  { chiave: "giornaliera",  etichetta: "Ogni giorno",       giorni: 1 },
  { chiave: "settimanale",  etichetta: "Ogni settimana",    giorni: 7 },
  { chiave: "quindicinale", etichetta: "Ogni due settimane", giorni: 15 },
  { chiave: "mensile",      etichetta: "Ogni mese",         giorni: 30 },
  { chiave: "bimestrale",   etichetta: "Ogni due mesi",     giorni: 60 },
  { chiave: "trimestrale",  etichetta: "Ogni tre mesi",     giorni: 90 },
  { chiave: "semestrale",   etichetta: "Ogni sei mesi",     giorni: 182 },
  { chiave: "annuale",      etichetta: "Ogni anno",         giorni: 365 },
];
// Etichetta parlante della frequenza: se i giorni coincidono con una
// periodicità tipica si usa il suo nome, altrimenti «ogni N giorni».
export function etichettaFrequenza(ogniGiorni) {
  const n = Math.round(+ogniGiorni || 0);
  if (!(n > 0)) return "frequenza non impostata";
  const p = PERIODICITA.find(x => x.giorni === n);
  /* ⛔ «ogni 1 giorni» — e non è un caso di scuola: un punto misurato tutti i
     giorni è la frequenza più stretta che questa app sappia programmare, cioè
     quella di chi ha un problema aperto. La parola giusta è «ogni giorno»,
     senza il numero: in italiano il «1» davanti si toglie. */
  if (p) return p.etichetta.toLowerCase();
  return n === 1 ? "ogni giorno" : "ogni " + n + " giorni";
}

// Data ISO spostata di n giorni (calcolo in UTC per non inciampare
// nell'ora legale). Ritorna "" se la data non è valida.
export function piuGiorni(dataISO, n) {
  const s = String(dataISO || "").slice(0, 10);
  /* ⛔ IL COMMENTO QUI SOPRA DICEVA IL FALSO, e per un anno. «Ritorna "" se la
     data non è valida»: la prova era una regex sulla **forma**, quindi
     `piuGiorni("2026-02-30", 5)` rispondeva **"2026-03-07"** — `Date` fa
     scorrere il 30 febbraio al 2 marzo, e da lì conta cinque giorni. Una
     scadenza costruita su un giorno che non esiste, e con l'aria di essere
     giusta. `dataISOEsiste` è la sola cosa che difende, ed è in `shared/`. */
  if (!dataISOEsiste(s)) return "";
  const d = new Date(s + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + Math.round(+n || 0));
  return d.toISOString().slice(0, 10);
}

// L'ultima lettura registrata su un punto di misura (per data e ora),
// oppure null. Pura.
export function ultimaLettura(m) {
  const l = (((m || {}).letture) || [])
    .map(x => ({ data: String((x || {}).data || "").slice(0, 10), ora: String((x || {}).ora || ""), valore: +((x || {}).valore) }))
    .filter(x => dataISOEsiste(x.data) && Number.isFinite(x.valore))
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return l.length ? l[l.length - 1] : null;
}

// Stato di UNA riga di programma. Si calcola dall'ultima lettura del punto
// collegato: prossima = ultima + ogni quanti giorni; poi
//   · oltre la tolleranza  → in ritardo (rosso)
//   · scaduta ma dentro la tolleranza → da fare (giallo)
//   · non ancora scaduta   → in regola (verde)
// Senza nessuna lettura si guarda la data di inizio, se c'è; senza
// nemmeno quella lo stato è «mai misurato», che è un avviso e non un
// allarme: magari il punto è stato appena creato.
export function statoRigaProgramma(riga, monitoraggio, oggi = new Date()) {
  const r = riga || {};
  const ogni = Math.round(+r.ogniGiorni || 0);
  const toll = Math.max(0, Math.round(+r.tolleranzaGiorni || 0));
  const ul = ultimaLettura(monitoraggio);
  const dal = /^\d{4}-\d{2}-\d{2}$/.test(String(r.dal || "")) ? String(r.dal) : null;
  const base = { ogniGiorni: ogni, tolleranzaGiorni: toll, ultima: ul ? ul.data : null,
    ultimoValore: ul ? ul.valore : null, maiMisurato: !ul, dal, prossima: null, giorni: null, ritardo: 0 };
  if (r.attivo === false) return { ...base, stato: "sospesa", cls: "", label: "Sospesa" };
  if (!(ogni > 0)) return { ...base, stato: "senza-frequenza", cls: "warn", label: "Senza frequenza" };
  const partenza = ul ? ul.data : dal;
  if (!partenza) return { ...base, stato: "mai", cls: "warn", label: "Mai misurato" };
  const prossima = piuGiorni(partenza, ogni);
  const g = giorniTra(prossima, oggi);              // > 0 = ancora nel futuro
  const ritardo = g < 0 ? -g : 0;
  const stato = g < -toll ? "in-ritardo" : g <= 0 ? "da-fare" : "in-regola";
  const cls = stato === "in-ritardo" ? "danger" : stato === "da-fare" ? "warn" : "ok";
  const label = stato === "in-ritardo" ? "In ritardo di " + ritardo + (ritardo === 1 ? " giorno" : " giorni")
    : stato === "da-fare" ? (ritardo ? "Da fare da " + ritardo + (ritardo === 1 ? " giorno" : " giorni") : "Da fare oggi")
    : "Fra " + g + (g === 1 ? " giorno" : " giorni");
  return { ...base, prossima, giorni: g, ritardo, stato, cls, label };
}

// Il programma con dentro il punto di misura e il suo stato, ordinato
// per urgenza: prima i ritardi (dal più lungo), poi i mai misurati, poi
// quello che sta per scadere, in fondo ciò che è in regola e le righe
// sospese. Le righe che puntano a un punto sparito restano visibili con
// `monitoraggio: null`: sparire in silenzio sarebbe peggio.
export function programmaEsteso(programma, monitoraggi, oggi = new Date()) {
  const rank = { "in-ritardo": 0, "senza-frequenza": 1, mai: 2, "da-fare": 3, "in-regola": 4, sospesa: 5 };
  return (programma || []).map(r => {
    const m = (monitoraggi || []).find(x => x && x.id === r.monitoraggioId) || null;
    return { riga: r, monitoraggio: m, nome: m ? (m.nome || "Punto di misura") : "Punto non più in elenco",
      stato: statoRigaProgramma(r, m, oggi) };
  }).sort((a, z) =>
    (rank[a.stato.stato] - rank[z.stato.stato]) ||
    (z.stato.ritardo - a.stato.ritardo) ||
    String(a.nome).localeCompare(String(z.nome), "it"));
}

// Conteggi per le tessere: quante righe in regola, da fare, in ritardo,
// mai misurate, sospese.
export function riepilogoProgramma(programma, monitoraggi, oggi = new Date()) {
  const out = { totale: 0, inRegola: 0, daFare: 0, inRitardo: 0, mai: 0, sospese: 0, senzaFrequenza: 0 };
  for (const v of programmaEsteso(programma, monitoraggi, oggi)) {
    out.totale++;
    const s = v.stato.stato;
    if (s === "in-ritardo") out.inRitardo++;
    else if (s === "da-fare") out.daFare++;
    else if (s === "mai") out.mai++;
    else if (s === "sospesa") out.sospese++;
    else if (s === "senza-frequenza") out.senzaFrequenza++;
    else out.inRegola++;
  }
  return out;
}

// Le righe che chiedono attenzione, nella stessa forma delle allerte del
// quadro ({ gravita, categoria, titolo, dettaglio, badge }) così si
// mescolano con misure e adempimenti senza casi particolari.
export function allerteProgramma(programma, monitoraggi, oggi = new Date()) {
  return programmaEsteso(programma, monitoraggi, oggi)
    .filter(v => ["in-ritardo", "da-fare", "mai", "senza-frequenza"].includes(v.stato.stato))
    .map(v => ({
      gravita: v.stato.cls === "danger" ? "danger" : "warn",
      categoria: "programma",
      titolo: v.nome,
      dettaglio: "misura in programma · "
        + (v.stato.ogniGiorni > 0 ? etichettaFrequenza(v.stato.ogniGiorni) : "frequenza non impostata")
        + (v.stato.ultima ? " · ultima misura " + dataIt(v.stato.ultima) : " · nessuna misura registrata"),
      badge: v.stato.label,
    }));
}

// ══════════════════════════════════════════════════════════════════════
// T6 · ANDAMENTO PER RICETTORE, CON CONFRONTO FRA PERIODI
// La domanda è «come sta andando dove abita la gente, rispetto al mese
// scorso». Le funzioni qui sotto preparano i numeri; il disegno lo fa il
// motore condiviso dei grafici. Regola di onestà: se le letture non
// bastano NON si inventa una linea — si dice quante ce ne sono.
// ══════════════════════════════════════════════════════════════════════

// Primo e ultimo giorno di un mese (anno, mese 1-12), in ISO.
export function limitiMese(anno, mese) {
  const a = Math.round(+anno), m = Math.round(+mese);
  const p = (n) => String(n).padStart(2, "0");
  const ultimo = new Date(Date.UTC(a, m, 0)).getUTCDate();
  return { dal: `${a}-${p(m)}-01`, al: `${a}-${p(m)}-${p(ultimo)}`, anno: a, mese: m };
}

// Letture di un punto dentro un intervallo (estremi compresi), ordinate.
export function lettureNelPeriodo(m, dal, al) {
  const d = String(dal || "").slice(0, 10), a = String(al || "").slice(0, 10);
  return (((m || {}).letture) || [])
    .map(l => ({ data: String((l || {}).data || "").slice(0, 10), ora: String((l || {}).ora || ""), valore: +((l || {}).valore) }))
    .filter(l => dataISOEsiste(l.data) && Number.isFinite(l.valore))
    .filter(l => (!d || l.data >= d) && (!a || l.data <= a))
    .sort((x, z) => { const kx = chiaveOrdine(x), kz = chiaveOrdine(z); return kx < kz ? -1 : kx > kz ? 1 : 0; });
}

// Statistiche di un punto in un periodo: quante letture, media, massimo,
// minimo e quanti superamenti della soglia applicata (>= soglia, come in
// tutto il resto dell'app). Senza letture torna n = 0 e valori null.
// ⛔ SUPERAMENTI: ZERO SU ZERO MISURE NON È UN BUON RISULTATO. Media, massimo
// e minimo dicevano già `null` su un mese senza letture; i superamenti no,
// dicevano 0 — ed è il numero che si legge per primo, perché è quello che
// l'ente guarda. In tabella finiva un «0» accanto a due trattini, cioè
// l'unica cifra della riga, su un mese in cui nessuno ha misurato niente.
// Senza letture la risposta è `null` = «non lo so», e chi mostra scrive «—».
// Con le letture ma senza soglia resta 0: quella scelta è già dichiarata e
// provata («non se ne inventa una per poter contare»), e chi mostra scrive
// comunque «—» perché sa che la soglia non c'è.
export function statPeriodo(m, dal, al, soglia) {
  const l = lettureNelPeriodo(m, dal, al);
  const v = l.map(x => x.valore);
  const s = Number.isFinite(+soglia) && +soglia > 0 ? +soglia : null;
  return {
    dal, al, n: l.length, letture: l,
    media: v.length ? v.reduce((a, b) => a + b, 0) / v.length : null,
    max: v.length ? Math.max(...v) : null,
    min: v.length ? Math.min(...v) : null,
    superamenti: !v.length ? null : s == null ? 0 : v.filter(x => x >= s).length,
  };
}

// Confronto fra il mese in corso e quello prima, per un punto di misura.
// `confrontabile` è vero solo se in ENTRAMBI i mesi c'è almeno una
// lettura; `debole` avvisa quando una media poggia su una lettura sola.
export function confrontoMesi(m, soglia, oggi = new Date()) {
  const o = new Date(oggi);
  const cur = limitiMese(o.getFullYear(), o.getMonth() + 1);
  const p = new Date(o.getFullYear(), o.getMonth() - 1, 1);
  const pre = limitiMese(p.getFullYear(), p.getMonth() + 1);
  const corrente = { ...statPeriodo(m, cur.dal, cur.al, soglia), anno: cur.anno, mese: cur.mese };
  const precedente = { ...statPeriodo(m, pre.dal, pre.al, soglia), anno: pre.anno, mese: pre.mese };
  const confrontabile = corrente.n > 0 && precedente.n > 0;
  const deltaMedia = confrontabile ? corrente.media - precedente.media : null;
  const deltaPct = confrontabile && precedente.media > 0
    ? Math.round(1000 * deltaMedia / precedente.media) / 10 : null;
  return {
    corrente, precedente, confrontabile,
    debole: confrontabile && (corrente.n < 2 || precedente.n < 2),
    deltaMedia, deltaPct,
    // ⛔ Come `deltaMedia` e `deltaPct`: senza uno dei due mesi non c'è
    // differenza da dire. Prima usciva un numero anche quando un mese era
    // vuoto — e con due mesi vuoti usciva `0`, cioè «nessun peggioramento»
    // ricavato dal nulla. Con `null` in mezzo la sottrazione avrebbe fatto
    // finta di sapere lo stesso (`null - 3` fa −3).
    deltaSuperamenti: confrontabile ? corrente.superamenti - precedente.superamenti : null,
  };
}

// Tutto quello che serve alla schermata «andamento per ricettore»: per
// ogni punto di misura collegato a quel ricettore, la soglia applicata,
// le letture della finestra scelta (di serie 6 mesi, mese in corso
// compreso), il confronto coi due mesi e il numero minimo di letture per
// disegnare una linea onesta (`abbastanza`, di serie 3).
export function andamentoRicettore(monitoraggi, ricettori, ricettoreId, opts = {}) {
  const oggi = opts.oggi ? new Date(opts.oggi) : new Date();
  const mesi = Math.max(1, Math.round(+opts.mesi || 6));
  const minLetture = Math.max(2, Math.round(+opts.minLetture || 3));
  const inizio = limitiMese(new Date(oggi.getFullYear(), oggi.getMonth() - (mesi - 1), 1).getFullYear(),
    new Date(oggi.getFullYear(), oggi.getMonth() - (mesi - 1), 1).getMonth() + 1);
  const fine = limitiMese(oggi.getFullYear(), oggi.getMonth() + 1);
  const punti = (monitoraggi || [])
    .filter(m => m && m.ricettoreId === ricettoreId)
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      const letture = lettureNelPeriodo(m, inizio.dal, fine.al);
      return {
        m, nome: m.nome || "Punto di misura", unita: unitaMisura(m), soglia: eff,
        letture, n: letture.length, abbastanza: letture.length >= minLetture,
        confronto: confrontoMesi(m, eff.valore, oggi),
      };
    });
  return { ricettore: trovaRicettore(ricettori, ricettoreId), punti, mesi, minLetture,
    dal: inizio.dal, al: fine.al };
}

// ══════════════════════════════════════════════════════════════════════
// T7 · IL PONTE VERSO SCUDO — dall'evento ambientale all'azione correttiva
//
// Un superamento di soglia o un reclamo di un residente non finisce quando
// è stato registrato: quasi sempre richiede che QUALCUNO faccia QUALCOSA
// ENTRO una data. Quel meccanismo esiste già, e sta in Scudo: le azioni
// correttive (aperta → in corso → chiusa) collegate alla loro origine con
// `origineTipo` / `origineId` / `origineVoce`. Qui NON se ne costruisce un
// secondo: Sentinella scrive nella stessa collezione `azioni` di Scudo,
// usando due nuovi valori di `origineTipo` — "superamento" e "reclamo" —
// e marcando `origineApp: "sentinella"`.
//
// Perché l'azione porta con sé anche il TESTO dell'origine (`origineNota`,
// `origineData`, `origineEtichetta`): Scudo non può leggere le collezioni
// di Sentinella (l'isolamento dello SDK è per organizzazione E per app), e
// un'azione che dicesse solo «origine: superamento xyz» sarebbe illeggibile
// per l'RSPP. Quindi l'azione si porta dietro la fotografia del fatto che
// l'ha generata, scritta in italiano.
//
// NIENTE DOPPIONI: l'identità di un superamento è il punto di misura PIÙ il
// giorno della lettura che l'ha causato (`origineVoce`). Se il giorno dopo
// il punto supera di nuovo, quello è un fatto nuovo e merita un'azione
// nuova; se si torna sullo stesso superamento, l'azione è già lì.
// ══════════════════════════════════════════════════════════════════════

export const PONTE_APP = "sentinella";
export const ORIGINE_SUPERAMENTO = "superamento";
export const ORIGINE_RECLAMO = "reclamo";

// Data di oggi + N giorni, in ISO. Serve solo a PROPORRE una scadenza
// all'azione correttiva: la decide comunque chi la apre.
// ⛔ RI-ESPORTATA da `shared/`: era scritta identica anche in Scudo, e la copia
// di qui rispondeva `""` dove quella di là rispondeva `null` — due copie uguali
// che si erano già staccate. docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md
export const dataPiuGiorni = dataPiuGiorniShell;

// L'ultima lettura che ha raggiunto o superato una soglia (>= soglia, la
// stessa regola del semaforo in tutto il resto dell'app). Senza soglia
// valida, o senza letture oltre, torna null.
export function ultimaLetturaOltre(m, soglia) {
  const s = +soglia;
  if (!Number.isFinite(s) || s <= 0) return null;
  const l = (((m || {}).letture) || [])
    .map(x => ({ data: String((x || {}).data || "").slice(0, 10), ora: String((x || {}).ora || ""), valore: +((x || {}).valore) }))
    .filter(x => dataISOEsiste(x.data) && Number.isFinite(x.valore) && x.valore >= s)
    .sort((a, b) => { const ka = chiaveOrdine(a), kb = chiaveOrdine(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  return l.length ? l[l.length - 1] : null;
}

// I SUPERAMENTI APERTI: i punti che ADESSO sono oltre la soglia applicata
// (esattamente i punti "danger" del semaforo e del KPI del Quadro). Per
// ognuno si dice anche QUANDO: la lettura che l'ha causato. Se il punto non
// ha letture (valore digitato a mano sulla scheda) la voce esiste comunque,
// con `data: ""` e chiave "valore-corrente": è un superamento vero, solo
// senza una data da citare.
// Ritorna una lista ordinata dal più grave (rapporto valore/soglia).
export function superamentiAperti(monitoraggi, ricettori) {
  return (monitoraggi || [])
    .map(m => {
      const eff = sogliaEfficace(m, ricettori);
      if (eff.valore == null) return null;                 // senza soglia non esiste superamento
      const st = statoMisura({ ...m, soglia: eff.valore });
      if (st.cls !== "danger") return null;
      const l = ultimaLetturaOltre(m, eff.valore);
      const data = l ? l.data : "";
      return {
        m, id: m.id, nome: m.nome || "Punto di misura",
        unita: eff.unita || unitaMisura(m),
        valore: +m.valore, soglia: eff, st,
        lettura: l, data,
        voce: data || "valore-corrente",
        ricettore: trovaRicettore(ricettori, m.ricettoreId),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.st.ratio - a.st.ratio);
}

// Testo della soglia applicata, con l'unità: si ripete in più punti e deve
// dire sempre la stessa cosa.
function testoSoglia(sup) {
  const u = sup.unita ? " " + sup.unita : "";
  return numeroIt(sup.soglia.valore) + u
    + (sup.soglia.fonte === "ricettore" && sup.soglia.ricettore ? " (soglia del ricettore " + sup.soglia.ricettore + ")" : "");
}

// LA BOZZA DELL'AZIONE nata da un superamento. Funzione PURA: prepara il
// record che verrà scritto nella collezione `azioni` di Scudo. Chi la apre
// può cambiare testo, responsabile e data prima di confermare.
export function bozzaAzioneSuperamento(sup, opts = {}) {
  if (!sup || !sup.id) return null;
  const u = sup.unita ? " " + sup.unita : "";
  const quando = sup.data ? " del " + dataIt(sup.data) : "";
  const nota = "Superamento ambientale (Sentinella) — " + sup.nome + quando + ": misurato "
    + numeroIt(sup.valore) + u + " con soglia applicata " + testoSoglia(sup)
    + (sup.ricettore ? " · ricettore: " + sup.ricettore.nome : "");
  return {
    descrizione: String(opts.descrizione || ("Riportare «" + sup.nome + "» entro la soglia ambientale")).trim(),
    responsabileId: opts.responsabileId || null,
    scadenza: String(opts.scadenza || "").slice(0, 10),
    stato: "aperta", esito: "", dataChiusura: null,
    origineTipo: ORIGINE_SUPERAMENTO, origineApp: PONTE_APP,
    origineId: sup.id, origineVoce: sup.voce,
    origineData: sup.data || "",
    origineEtichetta: sup.nome,
    origineNota: nota,
  };
}

// LA BOZZA DELL'AZIONE nata da un reclamo. Stesso schema: un reclamo è un
// fatto unico, quindi `origineVoce` resta la sua data (o "reclamo" se non
// c'è) e il doppione si controlla sull'id.
export function bozzaAzioneReclamo(rec, ricettore, opts = {}) {
  if (!rec || !rec.id) return null;
  const tipo = etichettaReclamo(rec.tipo).toLowerCase();
  const nota = "Reclamo di un residente (Sentinella) — " + etichettaReclamo(rec.tipo)
    + (rec.data ? " del " + dataIt(rec.data) : "") + (rec.ora ? " alle " + rec.ora : "")
    + (ricettore ? " · ricettore: " + ricettore.nome : "")
    + (rec.chi ? " · segnalato da " + rec.chi : "")
    + (rec.descrizione ? " · «" + rec.descrizione + "»" : "");
  return {
    descrizione: String(opts.descrizione || ("Dare seguito al reclamo per " + tipo
      + (ricettore ? " a " + ricettore.nome : "") + (rec.data ? " del " + dataIt(rec.data) : ""))).trim(),
    responsabileId: opts.responsabileId || null,
    scadenza: String(opts.scadenza || "").slice(0, 10),
    stato: "aperta", esito: "", dataChiusura: null,
    origineTipo: ORIGINE_RECLAMO, origineApp: PONTE_APP,
    origineId: rec.id, origineVoce: String(rec.data || "reclamo").slice(0, 10),
    origineData: String(rec.data || "").slice(0, 10),
    origineEtichetta: etichettaReclamo(rec.tipo) + (ricettore ? " · " + ricettore.nome : ""),
    origineNota: nota,
  };
}

// ── COINCIDENZA CON LA VOLATA ────────────────────────────────────────
// Un superamento nello stesso giorno di una volata va GUARDATO. Non va
// spiegato: due fatti nello stesso giorno sono due fatti nello stesso
// giorno, e basta. Il testo qui sotto è volutamente prudente e viene
// mostrato tale e quale, perché scrivere «causato dalla volata» dentro un
// documento che finisce all'ente è un autogol — e spesso è anche falso.
export const AVVISO_COINCIDENZA =
  "Coincidenza di data, non una causa dimostrata: per collegare i due fatti "
  + "servono la misura strumentale dell'evento, l'ora e una valutazione tecnica.";

// ⛔ Solo le volate ESEGUITE (T9): «quel giorno è stata registrata una volata»
// è un fatto, e un progetto non è un fatto. Con una prevista qui, un
// superamento risulterebbe accompagnato da un evento mai avvenuto.
export function volateDelGiorno(volate, dataISO) {
  const d = String(dataISO || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return [];
  return (volate || []).filter(v => !volataPrevista(v))
    .filter(v => String((v || {}).data || "").slice(0, 10) === d);
}

// Riga di contesto pronta da mostrare accanto a un superamento (o a un
// reclamo) quando quel giorno c'è stata una volata. Torna null se non ce
// n'è nessuna: nessuna riga inventata.
export function coincidenzaVolata(volate, dataISO) {
  const v = volateDelGiorno(volate, dataISO);
  if (!v.length) return null;
  const fronti = [...new Set(v.map(x => String((x || {}).fronte || "").trim()).filter(Boolean))];
  return {
    n: v.length, volate: v, fronti,
    testo: (v.length === 1 ? "Quel giorno è stata registrata una volata" : "Quel giorno sono state registrate " + v.length + " volate")
      + (fronti.length ? " (" + fronti.join(", ") + ")" : "") + ".",
    avviso: AVVISO_COINCIDENZA,
  };
}

// ── IL TRASPORTO ─────────────────────────────────────────────────────
// Da autenticati: SDK Deepwork ID inizializzato sull'app di destinazione
// ("scudo"), stessa organizzazione, e SEMPRE orgCollection — mai un
// percorso Firestore scritto a mano.
// In demo/tour non esiste nessun backend: come il resto dell'app si lavora
// su dati finti, ma qui i due schermi sono due pagine diverse, quindi il
// "finto backend" è una riga di localStorage condivisa fra le due app dello
// stesso browser. Serve solo a far vedere la catena completa; non è un
// canale dati e non esiste in live. La copia gemella di queste tre funzioni
// sta in apps/scudo/scudo-data.js (stessa chiave), che le legge.
export const PONTE_DEMO_KEY = "deepwork.demo.azioni-ponte";

export function ponteDemoLeggi() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(PONTE_DEMO_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}
export function ponteDemoScrivi(lista) {
  try {
    globalThis.localStorage.setItem(PONTE_DEMO_KEY, JSON.stringify((lista || []).slice(-200)));
    return true;
  } catch (e) { return false; }   // navigazione privata, quota piena: si prosegue senza
}

/* ⛔ «RESPONSABILE DA ASSEGNARE» NON È LA STESSA COSA DI «NON RIESCO A LEGGERE
   CHI È». Misurato l'08/08, ed è il filo di questa settimana: un'etichetta
   tranquilla dove non è stato misurato niente.
   Sullo schermo di Sentinella il responsabile di un'azione correttiva si
   ricava cercando il suo id nell'elenco dei lavoratori che arriva **da
   Scudo**. Se quella lettura fallisce — rete, permessi, l'altra app non
   raggiungibile — l'elenco arriva vuoto, e un'azione **che il responsabile ce
   l'ha** veniva mostrata come «responsabile da assegnare». Cioè un'affermazione
   sull'AZIONE, mentre il fatto riguarda la NOSTRA lettura: chi legge quella
   riga pensa che nessuno se ne stia occupando, e magari lo riassegna.
   I tre stati sono diversi e vanno detti diversi:
     · l'id c'è e il nome si trova           → si dice il nome;
     · l'id NON c'è                          → «da assegnare», ed è vero;
     · l'id c'è ma l'elenco non è leggibile  → si dice CHE NON SI SA, non che
                                               non c'è.
   La bandiera `leggibile` la mette `ponteScudo` e la legge questa funzione:
   una non-misurabilità dichiarata e non letta non protegge niente (regola 20).
   ⛔ E LA DECISIONE NON STA PIÙ QUI: sta in `shared/dw-ponti.js`, perché lo
   stesso giorno è servita alla seconda app — **Scudo**, che quel dato lo
   possiede. Qui resta solo la FRASE, che è di Sentinella: è lei a nominare
   Scudo, perché è lei che deve leggerlo da fuori. Una regola che serve a due
   app vive in `shared/` e non si riscrive; una frase che parla di un'altra app
   non è una regola condivisa. */
export function descriviResponsabile(azione, lavoratori, leggibile = true) {
  const s = statoResponsabile(azione, lavoratori, leggibile);
  const testo = s.stato === "trovato" ? "responsabile " + s.nome
    : s.stato === "assente" ? "responsabile da assegnare"
    : s.stato === "illeggibile" ? "responsabile assegnato, il nome non si legge da Scudo"
    : s.stato === "senza-nome" ? "responsabile assegnato, in anagrafica non ha un nome"
    /* leggibile ma non trovato: la persona non è più in anagrafica. È un fatto,
       e va detto — non è «da assegnare», perché qualcuno era stato scelto. */
    : "responsabile non più in anagrafica";
  return { testo, noto: s.noto };
}

export async function ponteScudo() {
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "scudo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      return {
        mode: "live",
        azioni: () => read("azioni"),
        /* ⛔ la lettura fallita NON diventa «non ce n'è»: si dichiara con la
           bandiera, che `descriviResponsabile` legge. */
        lavoratori: () => read("lavoratori").then(
          (lista) => ({ lista, leggibile: true }),
          () => ({ lista: [], leggibile: false })),
        aggiungi: (rec) => addDoc(id.orgCollection("azioni"), rec),
      };
    }
  } catch (e) { /* SDK assente o non autenticati: si prosegue in demo */ }
  return {
    mode: "demo",
    azioni: async () => ponteDemoLeggi(),
    /* in dimostrazione Scudo non si può interrogare affatto: è «non leggibile»,
       non «non ce n'è» — la differenza è quella che questa unità esiste per fare */
    lavoratori: async () => ({ lista: [], leggibile: false }),
    aggiungi: async (rec) => {
      const nuova = { id: "pn" + Math.random().toString(36).slice(2, 8), ...rec };
      ponteDemoScrivi([...ponteDemoLeggi(), nuova]);
      return nuova;
    },
  };
}

// ══════════════════════════════════════════════════════════════════════
// T8 · IL PONTE VERSO GENESI — dalla volata misurata alla LEGGE DI SITO
//
// Genesi prevede le vibrazioni con la legge di Devine  PPV = K · SD^−β,
// dove SD = distanza / √(carica per ritardo). K e β però non sono
// universali: sono di QUELLA cava. Finché nessuno li misura, Genesi li
// stima dalla litologia — valori da manuale, cautelativi, ma non "la tua
// roccia". Per ricavarli davvero servono dei REFERTI, e un referto è fatto
// di tre numeri: distanza del punto di misura, carica massima per ritardo,
// PPV registrata.
//
// Quei tre numeri Sentinella li ha già quasi tutti: il registro volate
// porta la distanza del ricettore e i kg massimi per ritardo, il sismografo
// porta la PPV. Manca solo il collegamento fra la volata e la misura di
// quel giorno — ed è tutto quello che si fa qui. Nessuna formula nuova:
// la regressione la fa Genesi, che ce l'ha già.
//
// ⛔ LA PPV NON SI INVENTA. Se per una volata non c'è una misura, quella
// volata NON diventa un referto: resta in elenco col motivo scritto. Un
// referto inventato falserebbe K e β, e da K e β dipendono le distanze di
// sicurezza: è il posto dove un numero finto fa più danno di tutti.
//
// Stile: come il ponte verso Scudo, il referto si porta dietro la
// FOTOGRAFIA di dove viene la misura (`ppvFonte`, `ppvPuntoNome`,
// `ppvData`), perché Genesi non può leggere le collezioni di Sentinella e
// un numero di cui non si sa la provenienza non è un dato.
// ══════════════════════════════════════════════════════════════════════

export const PPV_STRUMENTO = "strumento";   // letta dal sismografo fra i punti di misura
export const PPV_MANUALE = "manuale";       // trascritta dal referto di uno strumento non censito

// Quanti referti servono. Sono le stesse due soglie che usa Genesi nella
// modale «Legge di sito»: sotto 3 la retta non esiste (da due punti passa
// qualunque retta), sotto 8 la pendenza si muove ancora a ogni misura
// nuova. Ripetute qui per poterlo DIRE all'utente prima che esporti.
export const MIN_REFERTI = 3;
export const REFERTI_SOLIDI = 8;

// Perché una volata non è ancora un referto. Ogni motivo dice anche COME si
// rimedia: un elenco di mancanze senza il rimedio lascia l'utente fermo.
export const MOTIVI_REFERTO = [
  // Sta per primo perché è il motivo più grave: non è un dato che manca, è un
  // fatto che non è ancora avvenuto (T9).
  { chiave: "prevista", breve: "la conferma che è stata sparata", etichetta: "Volata ancora soltanto prevista",
    come: "È un progetto arrivato da Genesi, non un evento: dopo lo sparo confermala come eseguita (correggendo i dati se in cava è cambiato qualcosa), poi collega la PPV misurata dal sismografo. La PPV prevista non diventa mai un referto." },
  { chiave: "ppv", breve: "la PPV misurata", etichetta: "Manca la PPV misurata",
    come: "Collega la lettura del sismografo di quel giorno, oppure trascrivi il valore dal referto dello strumento." },
  { chiave: "distanza", breve: "la distanza del ricettore", etichetta: "Manca la distanza del ricettore",
    come: "Sono i metri fra la volata e il punto dove era piazzato il sismografo: si scrivono sulla riga del registro." },
  { chiave: "carica", breve: "la carica massima per ritardo", etichetta: "Manca la carica massima per ritardo",
    come: "Sono i kg che detonano nella stessa finestra di ritardo — quella che fa vibrare, non il totale della volata." },
];
export function motivoReferto(chiave) {
  return MOTIVI_REFERTO.find(m => m.chiave === chiave)
    || { chiave: String(chiave || ""), breve: "un dato", etichetta: "Dato mancante", come: "" };
}

// La PPV collegata a una volata, o null. Non deduce NIENTE: legge soltanto
// quello che è stato scritto sulla volata. Una volata vecchia, registrata
// prima che questi campi esistessero, torna null — non un valore finto.
export function ppvDiVolata(v) {
  const val = +((v || {}).ppvMisurata);
  if (!Number.isFinite(val) || val <= 0) return null;
  const strumento = String((v || {}).ppvFonte || "") === PPV_STRUMENTO;
  return {
    valore: val,
    fonte: strumento ? PPV_STRUMENTO : PPV_MANUALE,
    puntoId: String((v || {}).ppvPuntoId || ""),
    punto: String((v || {}).ppvPuntoNome || "").trim(),
    data: String((v || {}).ppvData || "").slice(0, 10),
    ora: String((v || {}).ppvOra || "").trim(),
  };
}

// Come si dice a parole da dove viene una PPV. Usata sia nell'elenco sia
// nel CSV: deve dire sempre la stessa cosa.
export function testoFontePpv(ppv) {
  if (!ppv) return "";
  if (ppv.fonte === PPV_STRUMENTO)
    return "sismografo" + (ppv.punto ? " · " + ppv.punto : "") + (ppv.ora ? " · " + ppv.ora : "");
  return "trascritta a mano dal referto";
}

// Accorcia la voce di una tendina fino a farla stare nello spazio che c'è.
//
// ⛔ PERCHÉ ESISTE, e non è una scelta estetica. Un `<select>` CHIUSO non manda
// a capo: quando la voce scelta è più larga del campo, il browser la taglia da
// solo e quello che sparisce è la CODA — cioè, in una tendina, esattamente la
// parte che distingue una voce dall'altra. Misurato il 09/08 sulla modale che
// collega la PPV: «5,6 mm/s · Vibrazioni V2 — confine Nord» chiede 289,6 px e
// ne ha 284 a 390 px di schermo, 214 a 320. Non si combatte la piattaforma:
// si taglia noi, si DICHIARA il taglio col puntino, e il testo intero resta
// leggibile nel suggerimento sotto il campo (mai solo nel `title`: in cava si
// tocca, e un tooltip non lo apre nessuno).
//
// ⚠️ `quanto(testo)` deve tornare la larghezza in PIXEL, e a darla è il
// browser (uno span col font vero della tendina). Un conto sui CARATTERI qui
// sarebbe la solita copia debole: sbaglia su ogni carattere proporzionale, e
// «Vibrazioni V2 — confine Nord» è pieno di lettere strette.
//
// ⚠️ Se lo spazio non è misurabile o il righello non c'è, la voce torna
// INTERA: meglio un testo che il browser taglia (e che si rilegge sotto) che
// un testo mutilato da noi su una misura che non abbiamo. È il principio del
// fondatore applicato al taglio — una misura che non c'è non autorizza niente.
//
// ⚠️ VIVREBBE IN `shared/`: la stessa domanda ce l'ha Scudo (le voci della
// verifica periodica, 5 KO sullo stesso banco). Sta qui perché il cantiere che
// l'ha scritta non poteva toccare `shared/`: quando le due app si incontrano,
// questa funzione va portata in `shared/dw-ponti.js` e ri-esportata da qui col
// suo nome — un alias, non una seconda copia.
export function accorciaVoceTendina(testo, spazio, quanto) {
  const t = String(testo == null ? "" : testo);
  if (typeof quanto !== "function") return t;
  const s = +spazio;
  if (!Number.isFinite(s) || s <= 0) return t;
  const intero = +quanto(t);
  if (!Number.isFinite(intero)) return t;
  if (intero <= s) return t;
  const PUNTINI = "…";
  if (+quanto(PUNTINI) > s) return PUNTINI;
  // si lavora sui PUNTI DI CODICE, non sulle unità UTF-16: tagliare a metà una
  // coppia surrogata lascerebbe mezzo carattere nella voce
  const c = [...t];
  // e il separatore appeso si toglie, se no resta «Vibrazioni V2 —…»
  const componi = (n) => c.slice(0, n).join("").replace(/[\s·—–-]+$/u, "") + PUNTINI;
  let basso = 0, alto = c.length;
  while (basso < alto) {
    const mezzo = Math.ceil((basso + alto) / 2);
    const w = +quanto(componi(mezzo));
    if (Number.isFinite(w) && w <= s) basso = mezzo; else alto = mezzo - 1;
  }
  return componi(basso);
}

// Le letture di VIBRAZIONE registrate nel giorno di una volata: sono le
// candidate a diventare la PPV di quella volata. Ordinate dalla più alta,
// che è quella che conta per la conformità e per la legge di sito.
// `unitaOk` dice se il punto misura in mm/s: se misura in un'altra unità il
// numero NON è una PPV in mm/s e non va usato come tale — l'interfaccia lo
// mostra ma non lo fa scegliere.
export function lettureVibrazioniDelGiorno(monitoraggi, dataISO) {
  const d = String(dataISO || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return [];
  const out = [];
  for (const m of monitoraggi || []) {
    if (String((m || {}).tipo || "").trim().toLowerCase() !== "vibrazioni") continue;
    const unita = unitaMisura(m) || "";
    const unitaOk = /^mm\s*\/\s*s$/i.test(unita.trim());
    for (const l of (m.letture || [])) {
      const val = +((l || {}).valore);
      if (String((l || {}).data || "").slice(0, 10) !== d) continue;
      if (!Number.isFinite(val) || val <= 0) continue;
      out.push({ puntoId: m.id, punto: String(m.nome || "Punto di misura"),
        unita, unitaOk, data: d, ora: String((l || {}).ora || "").trim(), valore: val });
    }
  }
  return out.sort((a, b) => b.valore - a.valore);
}

// I campi da scrivere sulla volata per collegarle una PPV. Funzione pura:
// prepara il record, non lo salva. `null` se il valore non è una misura.
export function campiPpvVolata(valore, opts = {}) {
  const v = +valore;
  if (!Number.isFinite(v) || v <= 0) return null;
  const strumento = opts.fonte === PPV_STRUMENTO;
  return {
    ppvMisurata: Math.round(v * 1e4) / 1e4,
    ppvFonte: strumento ? PPV_STRUMENTO : PPV_MANUALE,
    ppvPuntoId: strumento ? String(opts.puntoId || "") : "",
    ppvPuntoNome: strumento ? String(opts.punto || "").trim() : "",
    ppvData: String(opts.data || "").slice(0, 10),
    ppvOra: strumento ? String(opts.ora || "").trim() : "",
  };
}
// I campi che TOLGONO la PPV da una volata (correzione di un errore): si
// azzerano tutti insieme, mai il valore senza la sua provenienza.
export const CAMPI_PPV_VUOTI = { ppvMisurata: 0, ppvFonte: "", ppvPuntoId: "", ppvPuntoNome: "", ppvData: "", ppvOra: "" };

// UNA volata letta come referto: i tre numeri che servono a Genesi, più
// l'elenco di quelli che mancano. `pronto` è vero solo se ci sono tutti e
// tre — e la PPV deve essere una misura, non una stima.
// ⛔ VINCOLO T9, IL PIÙ IMPORTANTE DI TUTTO IL PONTE: una volata PREVISTA non
// diventa un referto, mai, per nessun motivo — nemmeno se porta una PPV
// prevista da Genesi e nemmeno se ha distanza e carica. La legge di sito
// decide le distanze di sicurezza: se dentro la regressione entrasse un valore
// PREVISTO al posto di uno MISURATO, la legge confermerebbe sé stessa e le
// distanze di sicurezza uscirebbero da un calcolo circolare. Per questo il
// motivo «prevista» è l'UNICO che viene elencato quando la volata è prevista:
// non si chiede all'utente di riempire una PPV che non può esistere ancora.
export function refertoDaVolata(volata) {
  const v = volata || {};
  const d = +v.distanzaRicettore, w = +v.kgMaxRitardo;
  const prevista = volataPrevista(v);
  const ppv = prevista ? null : ppvDiVolata(v);
  const motivi = [];
  if (prevista) motivi.push("prevista");
  else {
    if (!ppv) motivi.push("ppv");
    if (!(d > 0)) motivi.push("distanza");
    if (!(w > 0)) motivi.push("carica");
  }
  return {
    id: String(v.id || ""), data: String(v.data || "").slice(0, 10),
    fronte: String(v.fronte || "").trim(),
    d: d > 0 ? d : null, w: w > 0 ? w : null,
    ppv: ppv ? ppv.valore : null, misura: ppv,
    prevista,
    previsione: previsioneDiVolata(v),
    sd: scaledDistance(d, w),
    pronto: !prevista && motivi.length === 0, motivi,
  };
}

// Il riferimento scritto accanto al referto in Genesi: serve a poter
// risalire dalla riga della regressione alla volata che l'ha prodotta.
export function riferimentoReferto(r) {
  const parti = ["Volata " + dataIt(r && r.data)];
  if (r && r.fronte) parti.push(r.fronte);
  if (r && r.misura) parti.push(r.misura.fonte === PPV_STRUMENTO
    ? (r.misura.punto || "sismografo") : "PPV a mano");
  return parti.join(" · ");
}

// TUTTO il registro letto come referti: quante volate sono già utilizzabili
// e quante no, con il motivo. È la vista che serve a capire cosa manca per
// avere la legge del proprio sito, invece di restare davanti a un numero
// che non arriva. Pura e testabile.
export function refertiDaVolate(volate) {
  const tutti = (volate || []).map(refertoDaVolata)
    // prima ciò su cui c'è da lavorare, poi dal fatto più recente
    .sort((a, b) => (a.pronto ? 1 : 0) - (b.pronto ? 1 : 0)
      || String(b.data || "").localeCompare(String(a.data || "")));
  const pronti = tutti.filter(r => r.pronto);
  const mancanti = tutti.filter(r => !r.pronto);
  const motivi = { prevista: 0, ppv: 0, distanza: 0, carica: 0 };
  for (const r of mancanti) for (const m of r.motivi) if (motivi[m] != null) motivi[m]++;
  const sd = pronti.map(r => r.sd).filter(x => Number.isFinite(x));
  const sdMin = sd.length ? Math.min.apply(null, sd) : null;
  const sdMax = sd.length ? Math.max.apply(null, sd) : null;
  // Senza escursione di distanza scalata la pendenza β non è ricavabile:
  // è lo stesso limite che Genesi segnala come "stessaSD". Meglio dirlo
  // qui, prima che l'utente esporti e si trovi la legge rifiutata.
  const escursione = (sdMin && sdMax && sdMin > 0) ? sdMax / sdMin : null;
  return {
    tutti, pronti, mancanti,
    totale: tutti.length, nPronti: pronti.length, nMancanti: mancanti.length,
    motivi, minimo: MIN_REFERTI, solidi: REFERTI_SOLIDI,
    abbastanza: pronti.length >= MIN_REFERTI,
    mancanoAlMinimo: Math.max(0, MIN_REFERTI - pronti.length),
    sdMin, sdMax, escursione,
    sdTutteUguali: escursione != null && escursione < 1.02,
    conPpv: tutti.filter(r => r.misura).length,
    // quante righe del registro sono ancora progetti: si dice a parte, perché
    // «da completare» e «non ancora sparata» sono due situazioni diverse
    nPreviste: tutti.filter(r => r.prevista).length,
  };
}

// Numero per il CSV: punto decimale (è un file per un'altra macchina, non
// per un foglio italiano) e nessuno zero inutile in coda.
function numeroCsvReferto(n) {
  const v = +n;
  if (!Number.isFinite(v)) return "";
  return String(Math.round(v * 1e4) / 1e4);
}
// Cella di testo del CSV dei referti. Il lettore di Genesi spezza le righe
// su ; e su TAB (e su una virgola seguita da testo) e NON interpreta le
// virgolette: quindi una cella non può contenere quei caratteri, e
// virgolettarla la spezzerebbe in due invece di proteggerla. Si sostituiscono
// con uno spazio: si perde un carattere di un'etichetta, non una riga.
function cellaCsvReferto(s) {
  return String(s == null ? "" : s).replace(/[;,"\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
}

// L'intestazione del file dei referti. L'ordine delle prime tre colonne è
// quello che la modale «Legge di sito» di Genesi si aspetta di default
// (distanza, carica per ritardo, PPV): così il file entra senza che nessuno
// debba rimappare le colonne a mano. Le altre tre sono la tracciabilità.
export const CSV_REFERTI_INTESTAZIONE = "distanza_m;carica_per_ritardo_kg;ppv_mms;riferimento;data;origine";

// Il file dei referti per Genesi. Entrano SOLO le volate pronte: una volata
// senza PPV misurata non compare, e non compare nemmeno con la PPV a zero.
// ⛔ `!r.prevista` è una SECONDA guardia, volutamente ridondante con
// refertoDaVolata (che già non marca `pronto` una prevista): questo file
// determina le distanze di sicurezza, e un solo punto di controllo su una cosa
// così è troppo poco. Se un domani qualcuno costruisse un referto a mano
// dimenticandosi lo stato, qui si fermerebbe comunque.
export function csvRefertiGenesi(referti) {
  const pronti = (referti || []).filter(r => r && r.pronto && !r.prevista && r.d > 0 && r.w > 0 && r.ppv > 0)
    .slice().sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")));
  const righe = pronti.map(r => [
    numeroCsvReferto(r.d), numeroCsvReferto(r.w), numeroCsvReferto(r.ppv),
    cellaCsvReferto(riferimentoReferto(r)), r.data || "", "sentinella",
  ].join(";"));
  return CSV_REFERTI_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
}

// ══════════════════════════════════════════════════════════════════════
// T9 · IL PONTE DA GENESI — la volata PROGETTATA entra nel registro
//
// Il verso opposto di T8. Chi progetta una volata in Genesi conosce già tutto
// quello che il registro chiede: data, fronte, numero di fori, kg totali, kg
// massimi per ritardo (la MIC, che Genesi calcola dai tempi di detonazione),
// distanza del ricettore e la PPV PREVISTA. Finora quei numeri andavano
// ridigitati a mano qui: stessa volata, due digitazioni, due occasioni di
// sbagliare. Qui arrivano dal file, nello stesso formato del registro volate
// che Sentinella già importa (`parseVolateCsv`): nessun formato nuovo.
//
// LE DUE DISTINZIONI CHE TENGONO IN PIEDI TUTTO:
//
// 1. PREVISTA ≠ ESEGUITA. Una volata progettata non è una volata sparata: i
//    suoi chili non sono stati consumati, la sua data può essere domani. Se le
//    due cose si mescolassero, il registro — che è un documento verso gli enti
//    — direbbe che è stato sparato dell'esplosivo che è ancora in deposito.
//    Perciò la volata nasce PREVISTA e diventa ESEGUITA solo quando qualcuno lo
//    conferma, potendo correggere i dati: in cava il progetto cambia.
//
// 2. PPV PREVISTA ≠ PPV MISURATA. La prima è il risultato di un modello (la
//    legge di Devine di Genesi), la seconda è quello che ha registrato un
//    sismografo. Stanno in campi diversi (`ppvPrevista` / `ppvMisurata`), si
//    mostrano con etichette diverse, e solo la seconda può diventare un referto
//    per la legge di sito. Il confronto fra le due è il motivo per cui questo
//    registro serve: dice se il modello ci prende, nella cava del cliente.
//
// COMPATIBILITÀ (regola dura): una volata che non ha il campo `stato` — cioè
// tutte quelle registrate prima di oggi — vale come ESEGUITA. È ciò che è: era
// stata scritta nel brogliaccio dopo lo sparo. Nessun conteggio esistente
// cambia, e nessuna riga va convertita.
// ══════════════════════════════════════════════════════════════════════

export const VOL_PREVISTA = "prevista";   // progettata, non ancora sparata
export const VOL_ESEGUITA = "eseguita";   // sparata: è un evento del registro

// Lo stato scritto in un file, letto con tolleranza (Genesi scrive "prevista",
// ma un file compilato a mano può dire "progetto" o "sparata"). Ritorna ""
// quando la colonna non c'è o non dice niente: chi chiama decide, e per il
// registro il silenzio significa ESEGUITA — vedi statoVolata.
export function statoDaTesto(s) {
  const t = String(s == null ? "" : s).trim().toLowerCase();
  if (!t) return "";
  if (/^(prevista|previsto|progetto|progettata|programmata|pianificata)$/.test(t)) return VOL_PREVISTA;
  if (/^(eseguita|eseguito|sparata|sparato|fatta|effettuata)$/.test(t)) return VOL_ESEGUITA;
  return "";
}

// Lo stato di una volata del registro. UNICO punto in cui si decide, così non
// esistono due parti dell'app che leggono lo stesso campo in due modi.
export function statoVolata(v) {
  return statoDaTesto((v || {}).stato) === VOL_PREVISTA ? VOL_PREVISTA : VOL_ESEGUITA;
}
export const volataPrevista = (v) => statoVolata(v) === VOL_PREVISTA;
export const volatePreviste = (volate) => (volate || []).filter(volataPrevista);
export const volateEseguite = (volate) => (volate || []).filter(v => !volataPrevista(v));

// Come si presenta lo stato a schermo. La prevista NON usa i colori del
// semaforo (verde/giallo/rosso): non è un giudizio di conformità, è un'altra
// natura di riga, e prende il colore dell'app.
export function etichettaStatoVolata(v) {
  return volataPrevista(v)
    ? { stato: VOL_PREVISTA, cls: "accent", label: "Prevista" }
    : { stato: VOL_ESEGUITA, cls: "", label: "Eseguita" };
}

// I campi della PREVISIONE arrivata da Genesi. Funzione pura: prepara il
// record, non lo salva. `null` se non c'è una PPV prevista utilizzabile —
// senza il numero principale il resto (limite, norma, airblast) non ha un
// significato proprio, e mezza previsione è peggio di nessuna.
// ⛔ Non scrive MAI nei campi ppvMisurata*: quelli sono della misura.
export function campiPrevisioneVolata(valore, opts = {}) {
  const v = +valore;
  if (!Number.isFinite(v) || v <= 0) return null;
  const lim = +opts.limite, ab = +opts.airblast;
  const fonte = String(opts.fonte || "").trim().toLowerCase();
  return {
    ppvPrevista: Math.round(v * 1e4) / 1e4,
    ppvPrevLimite: Number.isFinite(lim) && lim > 0 ? Math.round(lim * 1e4) / 1e4 : 0,
    ppvPrevNorma: String(opts.norma || "").trim(),
    ppvPrevFonte: /^genesi/.test(fonte) ? fonte : (fonte || "genesi"),
    airblastPrevisto: Number.isFinite(ab) && ab > 0 ? Math.round(ab * 10) / 10 : 0,
  };
}
// I campi che TOLGONO la previsione (per esempio quando la riga viene
// ricompilata a mano e il progetto non c'entra più): si azzerano insieme, mai
// il numero senza la sua provenienza.
export const CAMPI_PREVISIONE_VUOTI = { ppvPrevista: 0, ppvPrevLimite: 0, ppvPrevNorma: "", ppvPrevFonte: "", airblastPrevisto: 0 };

// La previsione agganciata a una volata, o null. Come ppvDiVolata non deduce
// niente: legge soltanto quello che è scritto. Una volata registrata a mano
// non ha previsione, e resta senza — non con una calcolata qui.
export function previsioneDiVolata(v) {
  const val = +((v || {}).ppvPrevista);
  if (!Number.isFinite(val) || val <= 0) return null;
  const lim = +((v || {}).ppvPrevLimite), ab = +((v || {}).airblastPrevisto);
  const fonte = String((v || {}).ppvPrevFonte || "").trim().toLowerCase();
  return {
    valore: val,
    limite: Number.isFinite(lim) && lim > 0 ? lim : null,
    norma: String((v || {}).ppvPrevNorma || "").trim(),
    fonte, daGenesi: /^genesi/.test(fonte),
    // Genesi dice anche SU CHE BASE ha previsto: la legge di sito ricavata dai
    // referti di questa cava, oppure i valori da manuale della litologia. Una
    // previsione calibrata sul sito vale più di una da manuale, e l'utente ha
    // il diritto di sapere quale delle due sta leggendo.
    calibrata: /sito/.test(fonte),
    /* ⛔ E «CALIBRATA» NON VUOL DIRE «SOLIDA», dal 03/08. `sitoFit` alza la
       bandiera `pochi` sotto gli otto referti e Genesi, due schermate prima di
       mandare il file, scrive in giallo «Legge provvisoria: la pendenza si
       muove ancora parecchio a ogni misura nuova». Quella bandiera nel file non
       c'era: qui arrivava `genesi-sito`, il `/sito/` rispondeva vero e questa
       app scriveva «legge di sito CALIBRATA» su una legge tarata su TRE
       referti. Il numero tranquillo che attraversa il confine fra due app.
       Adesso Genesi lo dichiara in due colonne, e qui si legge.
       ⚠️ Tre stati, non due, ed è il terzo che conta: un file **vecchio** non
       ha quelle colonne, e allora la risposta è `null` — «non è dichiarato» —
       mai `false`, che vorrebbe dire «l'abbiamo controllato ed è solida». */
    provvisoria: (() => {
      if (!/sito/.test(fonte)) return null;          // la domanda non si pone
      const g = String((v || {}).ppvPrevProvvisoria || "").trim().toLowerCase();
      return (g === "si" || g === "no") ? g === "si" : null;
    })(),
    referti: (() => {
      const n = +(v || {}).ppvPrevReferti;
      return Number.isFinite(n) && n > 0 ? n : null;
    })(),
    airblast: Number.isFinite(ab) && ab > 0 ? ab : null,
  };
}

// Come si dice a parole da dove viene una previsione. Sta accanto al numero
// ovunque compaia: una PPV senza la sua provenienza si confonde con una misura.
// Corto di proposito: sta in coda a una riga che porta già il previsto, il
// limite e la norma, e su un telefono ogni parola in più mangia quella dopo.
export function testoFontePrevisione(p) {
  if (!p) return "";
  if (!p.daGenesi) return "previsione";
  if (!p.calibrata) return "da Genesi · stima dalla litologia";
  const q = p.referti ? " (" + p.referti + " " + plurale(p.referti, "referto", "referti") + ")" : "";
  if (p.provvisoria === true) return "da Genesi · legge di sito PROVVISORIA" + q;
  if (p.provvisoria === false) return "da Genesi · legge di sito calibrata" + q;
  /* file vecchio: la legge è di sito, ma su quanti referti non lo sappiamo —
     e non saperlo va detto, non arrotondato verso la risposta che tranquillizza */
  return "da Genesi · legge di sito, su quanti referti non è dichiarato";
}

// IL CONFRONTO PREVISTO → MISURATO: esiste solo quando ci sono entrambi i
// numeri, e non si inventa nulla quando ne manca uno. Nessun giudizio di
// conformità qui: il limite arrivato da Genesi si RIPORTA come contesto
// dichiarato, ma il semaforo di Sentinella resta quello della soglia del punto
// di misura (o del ricettore). Due semafori diversi sullo stesso schermo
// sarebbero un difetto, non una funzione.
export function scartoPpvVolata(v) {
  const p = previsioneDiVolata(v), m = ppvDiVolata(v);
  if (!p || !m) return null;
  const delta = m.valore - p.valore;
  return {
    previsto: p.valore, misurato: m.valore,
    delta: Math.round(delta * 1e4) / 1e4,
    pct: p.valore > 0 ? Math.round(1000 * delta / p.valore) / 10 : null,
    verso: delta > 0.00005 ? "sopra" : delta < -0.00005 ? "sotto" : "uguale",
    previsione: p, misura: m,
  };
}

// LA CONFERMA: da PREVISTA a ESEGUITA. Funzione pura — prepara i campi da
// scrivere e l'elenco di ciò che non va, senza salvare niente.
// I dati si possono correggere perché in cava il progetto cambia: fori saltati,
// carica ridotta, data spostata. Quello che NON si tocca è la previsione: resta
// scritta com'era, altrimenti il confronto previsto→misurato sarebbe un
// confronto con un numero aggiustato dopo, cioè niente.
// La data non può essere nel futuro: è la stessa regola del registro a mano,
// per lo stesso motivo (una volata eseguita è un fatto avvenuto).
export function confermaVolataEseguita(volata, corr = {}, oggi = new Date()) {
  const v = volata || {};
  const errori = [];
  if (!v.id) errori.push({ campo: "", testo: "Volata non trovata nel registro." });
  else if (!volataPrevista(v)) errori.push({ campo: "", testo: "Questa volata è già registrata come eseguita: non c'è niente da confermare." });
  // Campo NON toccato (chiave assente) → resta il valore del progetto.
  // Campo SVUOTATO dall'utente ("") → zero: è una correzione, non una
  // dimenticanza, e va rispettata come nel form del registro a mano.
  // I numeri arrivano dai campi decimali della modale, scritti a mano: la
  // virgola italiana vale quanto il punto, e «1.250,5» vale 1250,5. Se non
  // si legge un numero il campo torna a zero, come prima.
  const num = (x, fall) => {
    if (x === undefined || x === null) { const f = +fall; return Number.isFinite(f) && f >= 0 ? f : 0; }
    const n = numIt(x);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  const data = String(corr.data == null ? (v.data || "") : corr.data).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data))
    errori.push({ campo: "data", testo: "Serve la data in cui la volata è stata sparata." });
  else if (giorniTra(data, oggi) > 0)
    errori.push({ campo: "data", testo: "La data non può essere nel futuro: una volata eseguita è già avvenuta. Se non è ancora stata sparata, lasciala prevista." });
  const campi = {
    stato: VOL_ESEGUITA,
    data,
    fronte: String(corr.fronte == null ? (v.fronte || "") : corr.fronte).trim(),
    nFori: num(corr.nFori, v.nFori),
    kgTotali: num(corr.kgTotali, v.kgTotali),
    kgMaxRitardo: num(corr.kgMaxRitardo, v.kgMaxRitardo),
    distanzaRicettore: num(corr.distanzaRicettore, v.distanzaRicettore),
    esito: String(corr.esito || v.esito || "").trim().toLowerCase() === "contestazione" ? "contestazione" : "regolare",
    note: String(corr.note == null ? (v.note || "") : corr.note).trim(),
  };
  // che cosa è cambiato rispetto al progetto: si mostra all'utente prima di
  // salvare, perché una correzione silenziosa su un documento è un problema
  const cambi = [];
  const conf = [["data", "data"], ["fronte", "fronte"], ["nFori", "n° fori"],
    ["kgTotali", "kg totali"], ["kgMaxRitardo", "kg max per ritardo"],
    ["distanzaRicettore", "distanza del ricettore"], ["esito", "esito"], ["note", "note"]];
  for (const [k, et] of conf) {
    const prima = k === "esito" ? (v.esito || "regolare") : (v[k] == null ? "" : v[k]);
    if (String(prima) !== String(campi[k])) cambi.push({ campo: k, etichetta: et, da: prima, a: campi[k] });
  }
  return { ok: errori.length === 0, errori, campi, cambi };
}

// Riepilogo delle volate PREVISTE, per la riga sopra il registro. `daConfermare`
// sono quelle la cui data è già arrivata e che nessuno ha ancora confermato: è
// l'unico avviso che serve, perché una volata sparata e mai confermata lascia un
// buco nel brogliaccio. Pura; `oggi` iniettabile.
// ⛔ E I CHILI SEGUONO LA REGOLA DEI CHILI DEL MESE (03/08). Qui c'era lo
// stesso `+v.kgTotali || 0` corretto in `riepilogoVolate`: nessuno oggi legge
// questo numero — la riga delle previste mostra il conto e la prossima data —
// ma lasciarlo lì è la copia debole che aspetta il giorno in cui qualcuno lo
// mostra. `kgTotaliSenza` dice su quante previste il totale NON è fatto.
export function riepilogoPreviste(volate, oggi = new Date()) {
  const l = volatePreviste(volate);
  let daConfermare = 0, prossima = null;
  let kgTotali = null, kgTotaliSenza = 0;
  for (const v of l) {
    const kg = numeroDichiarato((v || {}).kgTotali);
    if (kg == null) kgTotaliSenza++;
    else kgTotali = (kgTotali || 0) + kg;
    const d = String(v.data || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
    if (giorniTra(d, oggi) <= 0) daConfermare++;
    else if (!prossima || d < prossima) prossima = d;
  }
  return { totale: l.length, daConfermare, prossima, kgTotali, kgTotaliSenza };
}

// L'ordine del registro a schermo: prima le PREVISTE in ordine di calendario
// (quelle la cui data è passata vengono per prime: sono quelle da confermare),
// poi le ESEGUITE dalla più recente, che è l'ordine che il registro ha sempre
// avuto. Pura, così l'ordine è testabile e non vive dentro un innerHTML.
export function volateOrdinate(volate) {
  const p = volatePreviste(volate).slice()
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")));
  const e = volateEseguite(volate).slice()
    .sort((a, b) => String(b.data || "").localeCompare(String(a.data || "")));
  return [...p, ...e];
}

// LA FIRMA per riconoscere i DOPPIONI all'import. Se il file porta un codice
// volata (lo scrive Genesi) vale quello: sopravvive alla conferma, che può
// aver corretto fori, chili e persino la data — quindi reimportare il file del
// progetto dopo la conferma non crea una riga fantasma. Senza codice si torna
// alla firma di prima (data|fronte|fori|kg), così i file già in giro si
// deduplicano esattamente come prima.
export function firmaVolata(v) {
  const cod = String((v || {}).codiceVolata || "").trim().toLowerCase();
  if (cod) return "cod|" + cod;
  return [String((v || {}).data || ""), String((v || {}).fronte || "").trim().toLowerCase(),
    +((v || {}).nFori) || 0, +((v || {}).kgTotali) || 0].join("|");
}

// L'INTESTAZIONE del registro volate: le 8 colonne di sempre, le 4 della PPV
// misurata (T8) e le 7 della volata prevista (T9), in coda e facoltative.
// È lo stesso ordine che legge parseVolateCsv qui sopra — stanno nello stesso
// file di proposito: due elenchi di colonne in due punti diversi si scollano.
// Genesi scrive queste stesse colonne (vedi apps/genesi/genesi.html, «Manda a
// Sentinella»): lasciando VUOTE le quattro della PPV misurata, che una volata
// non ancora sparata non può avere.
export const CSV_VOLATE_INTESTAZIONE =
  "data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note;"
  + "ppvMisurata;ppvFonte;ppvPunto;ppvOra;"
  + "stato;ppvPrevista;ppvPrevLimite;ppvPrevNorma;ppvPrevFonte;airblastPrevisto;codiceVolata";

// Il file del registro volate. Ogni riga dichiara il suo `stato`, così il giro
// export → import non perde la distinzione fra progetto e evento. Pura e
// testabile: le celle di testo passano da csvCell (virgolette e guardia
// anti-formula), i numeri escono col punto decimale perché è un file per
// un'altra macchina.
export function csvRegistroVolate(volate) {
  const n = (x) => { const v = +x; return Number.isFinite(v) ? String(Math.round(v * 1e4) / 1e4) : ""; };
  /* ⛔ UNA CASELLA VUOTA NON È UNO ZERO, e sul registro delle volate è la
     differenza fra «il ricettore è a zero metri» e «la distanza non l'ha
     scritta nessuno». Prima qui c'era `n(+v.nFori || 0)`: la guardia `|| 0`
     trasformava l'assenza in una dichiarazione, e il file esportato — che va
     all'ente, o torna dentro con l'import — la portava come tale.
     ⚠️ E la regola stava scritta QUI DENTRO, in due righe che sembrano una
     comodità locale: il 03/08 è servita altre due volte (i chili del mese e il
     file per l'ARPA) e riscriverla a mano è costato tre prove rosse, perché
     `Number.isFinite(+null)` risponde **true**. Adesso è `numeroDichiarato`,
     una sola, e questa riga la chiama — il comportamento è identico. */
  const cella = (x) => { const v = numeroDichiarato(x); return v == null ? "" : n(v); };
  const righe = (volate || []).slice()
    .sort((a, b) => String(a.data || "").localeCompare(String(b.data || "")))
    .map(v => {
      const p = ppvDiVolata(v), q = previsioneDiVolata(v);
      return [
        String(v.data || ""), csvCell(v.fronte || ""),
        cella(v.nFori), cella(v.kgTotali), cella(v.kgMaxRitardo), cella(v.distanzaRicettore),
        v.esito === "contestazione" ? "contestazione" : "regolare", csvCell(v.note || ""),
        p ? n(p.valore) : "", p ? p.fonte : "", csvCell(p ? p.punto : ""), p ? p.ora : "",
        statoVolata(v),
        q ? n(q.valore) : "", q && q.limite != null ? n(q.limite) : "",
        csvCell(q ? q.norma : ""), q ? q.fonte : "",
        q && q.airblast != null ? n(q.airblast) : "",
        csvCell(v.codiceVolata || ""),
      ].join(";");
    });
  return CSV_VOLATE_INTESTAZIONE + "\n" + (righe.length ? righe.join("\n") + "\n" : "");
}

export async function sentinellaData() {
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "sentinella" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, updateDoc, deleteDoc, doc, deleteField, runTransaction } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (n) => (await getDocs(id.orgCollection(n))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        monitoraggi: () => read("monitoraggi"), adempimenti: () => read("adempimenti"), registri: () => read("registri"), volate: () => read("volate"),
        ricettori: () => read("ricettori"), reclami: () => read("reclami"), programma: () => read("programma"),
        aggiungi: (n, d) => addDoc(id.orgCollection(n), d),
        logout: () => id.logout(),
        aggiorna: (n, i, d) => updateDoc(doc(id.orgCollection(n), i), traduciCancellazioni(d, deleteField)),
        /* ⛔ per gli ELENCHI: rileggi-e-riscrivi in modo ATOMICO. Il percorso
           puntato non arriva su un array (un indice non si scrive così), e
           `arrayUnion` non copre né la correzione di una lettura già dentro né
           il taglio a un massimo. La transazione rifà il giro se qualcuno ha
           scritto nel frattempo: la lettura su cui si decide è sempre vera. */
        trasforma: (n, i, cambia) => trasformaAtomico(
          { rif: doc(id.orgCollection(n), i), runTransaction, deleteField }, cambia),
        rimuovi: (n, i) => deleteDoc(doc(id.orgCollection(n), i)),
      };
    } else if (id.authState() === "tour") mode = "tour";
  } catch (e) {}
  if (mode !== "live") {
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      monitoraggi: async () => mem.monitoraggi, adempimenti: async () => mem.adempimenti, registri: async () => mem.registri, volate: async () => mem.volate,
      ricettori: async () => mem.ricettori, reclami: async () => mem.reclami, programma: async () => mem.programma || [],
      logout: async () => {},
      aggiungi: async (n, d) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[n] = mem[n] || []).push({ id, ...d }); return { id }; },
      aggiorna: async (n, i, d) => { const x = (mem[n] || (mem[n] = [])).find(v => v.id === i); if (x) applicaPercorsi(x, d); },
      /* stesso CONTRATTO della strada vera, transazione a parte: se i due
         divergono, la dimostrazione smette di dimostrare */
      trasforma: async (n, i, cambia) => trasformaInMemoria((mem[n] || (mem[n] = [])).find(v => v.id === i), cambia),
      rimuovi: async (n, i) => { mem[n] = (mem[n] || []).filter(v => v.id !== i); },
    };
  }
  return { mode, ...api };
}
