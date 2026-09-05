// ============================================================
// Scudo — accesso dati (C1)
// Unica fonte dati dell'app: Firestore via SDK Deepwork ID
// (orgCollection, sigillato sull'organizzazione) con fallback ai
// dati demo quando il backend non è configurato o si è in tour.
//
// Collezioni (sotto organizations/{org}/apps/scudo/):
//   lavoratori/{id}: { nome, ruolo, tel, note, attivo }
//   scadenze/{id}:   { lavoratoreId|null, tipo, descrizione,
//                      dataScadenza (ISO yyyy-mm-dd), stato? }
//   documenti/{id}:  { titolo, meta, tipo?, cantiereId?|null,
//                      lavoratoreId?|null, allegatoNome?, allegatoData?
//                      (dataURL ≤ 400 KB — file grandi: Firebase Storage,
//                      arriverà col progetto live), stato: valido|da-rivedere|scaduto }
//                    → sui documenti di tipo "DSS" vivono anche i tre campi del
//                      CICLO DI VITA (D.Lgs 624/96 art. 6): dssRevisione (ISO,
//                      ultima revisione), dssMotivo (chiave di
//                      MOTIVI_REVISIONE_DSS) e dssTrasmissione (ISO, invio
//                      all'autorità di vigilanza). Stanno QUI e non in una
//                      collezione a parte, come i documenti di qualifica degli
//                      appaltatori: il DSS è un documento del registro, e il
//                      suo ciclo è fatto di date sue.
//                      ⛔ Sono OPZIONALI, e la loro assenza è uno stato che il
//                      prodotto sa raccontare: senza dssRevisione il DSS non è
//                      «aggiornato» né «scaduto», è NON DATABILE (cicloDss).
//   cantieri/{id}:   { nome, comune, tipo: cava|cantiere, stato: attivo|chiuso }
//   azioni/{id}:     { descrizione, responsabileId|null, scadenza (ISO),
//                      stato: aperta|in-corso|chiusa, esito?, dataChiusura?,
//                      origineTipo: evento|ispezione|nc|superamento|reclamo|fermo|"",
//                      ⚠️ `fermo` è entrato il 01/08 col ponte Campo → Scudo
//                      (`ORIGINI_CAMPO`, riga 913) e questo elenco non se n'era
//                      accorto per sei giorni: un commento di schema che non
//                      elenca un valore che il codice accetta fa concludere che
//                      quel caso non esista — ed è successo, in un documento del
//                      delta (`docs/CONCORRENTI_CAMPO.md`, riga «anomalie:
//                      radice, azione correttiva»).
//                      origineId?|null, origineVoce?|null, origineNota?,
//                      origineApp?, origineData?, origineEtichetta? }
//                    → azione correttiva (CAPA) nata da un evento del registro
//                      infortuni/near-miss, da una voce non conforme di
//                      un'ispezione, o da una non conformità rilevata.
//                      "superamento" e "reclamo" arrivano da SENTINELLA
//                      (origineApp: "sentinella"): un superamento di soglia
//                      ambientale o il reclamo di un residente chiedono
//                      un'azione correttiva esattamente come un near-miss.
//                      Quelle azioni portano con sé il TESTO dell'origine
//                      (origineNota/origineData/origineEtichetta) perché
//                      Scudo non può leggere le collezioni di Sentinella:
//                      l'isolamento dello SDK è per organizzazione E per app.
//   infortuni/{id}:  { data (ISO), tipo: infortunio|near-miss, gravita,
//                      giorniAssenza, descrizione, luogo,
//                      categoria? (near-miss: tipo di rischio),
//                      anonimo? (bool), segnalatoDaId?|null, rapida? (bool),
//                      foto?: [{ nome, dataURL, didascalia? }] — max 3, e
//                      max 400 KB IN TUTTO (LIMITE_ALLEGATO): due allegati
//                      da 400 KB fanno il 104% del tetto di 1 MB del
//                      documento Firestore e la scrittura viene rifiutata,
//                      portandosi dietro l'evento intero. }
//   ispezioni/{id}:  { modello (chiave), nome, ambito, cantiereId|null,
//                      responsabileId|null, data (ISO), periodicitaGiorni|null,
//                      riferimento?, voci: [{ id, testo }],
//                      esiti: { voceId: { esito: conforme|non-conforme|na, nota,
//                        foto?: [{ nome, dataURL, didascalia? }] } }
//                      → le foto di TUTTE le voci stanno in questo unico
//                        documento, quindi i 400 KB sono il totale
//                        dell'ispezione, non della voce (bilancioFotoVoce),
//                      stato: programmata|in-corso|completata, dataChiusura?|null }
//   mansioni/{id}:   { nome, note?, requisiti: [chiave], dpi: [chiave],
//                      lavoratoriIds: [id] }
//                    → il lavoro che una persona fa in cava e ciò che SERVE per
//                      farlo: corsi/abilitazioni richiesti e DPI previsti.
//   nomine/{id}:     { ruolo (chiave), lavoratoreId, dal (ISO), al?|null, note? }
//                    → chi ricopre le figure della sicurezza (sorvegliante,
//                      preposto, RSPP, RLS, addetti emergenza…).
//   dpi/{id}:        { lavoratoreId, tipo (chiave), modello?, taglia?,
//                      dataConsegna (ISO), scadenza?|null, addestramento (bool),
//                      dataAddestramento?|null, note? }
//                    → registro delle consegne DPI (art. 77 D.Lgs 81/08).
//   analisi/{id}:    { eventoId, perche: [testo], causa (chiave di
//                      CAUSE_ANALISI), fatta (ISO), daChi (lavoratoreId|null),
//                      azioniId: [id] }
//                    → l'analisi della causa di un evento del registro (i «5
//                      Perché»). UNA SOLA per evento: se serve rifarla si
//                      corregge quella, invece di accumulare versioni fra cui
//                      nessuno sa quale valga.
//                      ⚠️ `azioniId` NON è il legame evento↔azione: quello vive
//                      dove è sempre vissuto, in `azioni.origineTipo`/
//                      `origineId`, ed è l'unico che le schermate leggono per
//                      dire quante azioni ha un evento. `azioniId` registra le
//                      azioni nate DOPO l'analisi, cioè quelle che il «perché»
//                      ha prodotto: due numeri diversi che dicono due cose
//                      diverse, e nessuno dei due è una copia dell'altro.
//   permessi/{id}:   { tipo (chiave di TIPI_PERMESSO), lavoro, luogo,
//                      cantiereId|null, dal/al (AAAA-MM-GGTHH:MM, ora LOCALE),
//                      rilasciatoDaId, riceventeId|null, sorveglianteId|null,
//                      appaltoId|null, misure: [chiave di MISURE_PERMESSO],
//                      atmosfera?: { ossigeno, lel, h2s, co, ora }|null,
//                      stato: bozza|aperto|sospeso|chiuso|revocato,
//                      chiusuraOra?|null, chiusuraDaId?|null, note? }
//                    → il PERMESSO DI LAVORO: autorizza un lavoro pericoloso
//                      in un luogo e in una finestra di tempo (D.P.R. 177/2011
//                      per gli spazi confinati). È quello che sta dietro alla
//                      voce di checklist «accesso a tramogge e spazi confinati
//                      regolato da permesso di lavoro»: senza, quella spunta
//                      non ha niente sotto (provaVoce).
//                      ⛔ `dal`/`al` sono ISTANTI, non date: un permesso senza
//                      finestra non autorizza un turno, autorizza per sempre.
//                      `atmosfera` assente NON è aria buona (letturaAtmosfera).
// Lo "stato" delle scadenze non si salva: si CALCOLA dalla data
// (scaduta / entro 30gg / regolare) — niente dati derivati nel DB.
// ============================================================

/* ⛔ `conta` E `plurale` ARRIVANO DA `shared/`, E NON SI RISCRIVONO QUI. Il
   06/08 questo file ne aveva una copia debole (`const q = (n, uno, tanti) =>
   n + " " + (n === 1 ? uno : tanti)`, dentro `cartellaLavoratore`): identica
   su un numero buono, diversa su `null` — dove la copia scriveva «null
   scadenze» e quella di `shared/` scrive «— scadenze». Quel testo finisce sul
   fascicolo che si stampa e si mostra a un ispettore. È la stessa copia debole
   che lo stesso giorno è saltata fuori in Conti, Terra e Genesi, tre cantieri
   che non si parlavano: quando una funzione si riscrive da sola in quattro app
   il posto giusto è uno solo.
   ⚠️ Le tre `const conta` locali di questo file — che contavano righe, non
   parole — sono state rinominate (`raggruppa`, `quanti`) proprio perché
   ombreggiavano questo nome: un `conta(n, "voce", "voci")` scritto dentro una
   di quelle funzioni avrebbe chiamato in silenzio l'altra cosa. */
import { parseCsvLine, numIt, giorniTra, isIntestazione, senzaDoppioni, dataISOEsiste,
         csvCell, leggiCsv,
         dataIt, isoLocale, pezziDataURL, LIMITE_ALLEGATO,
         conta, plurale } from "../../shared/deepwork-id-client/dw-shell.js";

/* IL `tipo` CHE FA DI UNA SCADENZA UNA VERIFICA PERIODICA DI ATTREZZATURA.
   Sta qui sopra `SCADENZE_PRESET` perché il preset `verifica-attr` lo usa, e
   `tipo` è l'unico contrassegno che TUTTE le strade scrivono: il form
   (`btn-add-scad` salva `tipo`), il preset (che riempie il form) e l'import
   CSV, che ha una colonna `tipo`. Il campo `preset` invece lo scrive solo il
   flusso dei requisiti di mansione — misurato: `btn-add-scad` non lo salva —
   quindi appenderci sopra il riconoscimento avrebbe dato un controllo cieco
   proprio sulle righe create dal form, che sono la maggioranza. */
export const TIPO_VERIFICA_PERIODICA = "Verifica periodica";

export const DEMO = {
  lavoratori: [
    /* IL GIUDIZIO DEL MEDICO (05/09): tre casi da far vedere — un idoneo, uno
       con prescrizioni SCRITTE (d5, che in Campo è o4, regolare coi documenti),
       uno NON idoneo (d2, che in Campo è o2 nella Squadra A operativa), così il
       ponte ha davanti il caso per cui esiste — e la dimostrazione di Campo
       continua a mostrare anche una persona in regola.
       Gli altri restano «n.d.»: è lo stato di chi non ha mai registrato niente. */
    { id: "d1", nome: "Mario Rossi", ruolo: "Fochino", tel: "", attivo: true },
    { id: "d2", nome: "Luca Bianchi", ruolo: "Escavatorista", tel: "", attivo: true, idoneita: "non-idoneo", giudizioIl: "2026-08-20" },
    { id: "d3", nome: "Giulia Verdi", ruolo: "Preposto", tel: "", attivo: true },
    { id: "d4", nome: "Anna Neri", ruolo: "Impiegata", tel: "", attivo: true, idoneita: "idoneo", giudizioIl: "2026-03-11" },
    { id: "d5", nome: "Paolo Gallo", ruolo: "Autista", tel: "", attivo: true, idoneita: "prescrizioni", prescrizioni: "Niente lavori in quota; otoprotettori sempre in cabina", giudizioIl: "2026-06-02" },
    { id: "d6", nome: "Franco Riva", ruolo: "Fochino", tel: "", attivo: true },
    { id: "d7", nome: "Sara Conti", ruolo: "RSPP esterno", tel: "", attivo: true },
  ],
  // CHI È SCHIERATO, che in esercizio arriva da Campo (ponte P3, sola lettura).
  // Copiati dalla dimostrazione di Campo id per id: se le due dimostrazioni
  // dicessero cose diverse sulla stessa squadra, l'ecosistema smentirebbe sé
  // stesso proprio nel punto che serve a mostrare che le app si parlano.
  /* LE SCADENZE DI TERRA E DI FLOTTA, copiate riga per riga dalle loro
     dimostrazioni (02/09) — `run-kpi` pretende che restino uguali a quelle,
     id per id e data per data, così una modifica di là si vede di qua. Servono
     al muro di tutta la cava: c'è la fideiussione in scadenza, la prescrizione
     senza data, la verifica periodica scaduta. */
  scadenzeTerra: [
    { id: "t1", tipo: "autorizzazione", descrizione: "Scadenza del titolo autorizzativo", dataScadenza: "2031-03-14", preavvisoGiorni: 180, ricorrenzaMesi: null, note: "" },
    { id: "t2", tipo: "fideiussione", descrizione: "Polizza fideiussoria — rinnovo annuale", dataScadenza: "2026-09-30", preavvisoGiorni: 90, ricorrenzaMesi: 12, note: "Si svincola solo dopo il collaudo finale." },
    { id: "t3", tipo: "rilievo", descrizione: "Rilievo periodico dei lavori", dataScadenza: "2026-08-10", preavvisoGiorni: 30, ricorrenzaMesi: 6, note: "" },
    { id: "t4", tipo: "screening-via", descrizione: "Prescrizione dello screening da ottemperare", dataScadenza: "2026-07-10", preavvisoGiorni: 60, ricorrenzaMesi: null, note: "" },
    { id: "t5", tipo: "prescrizione", descrizione: "Prescrizione dell'atto — termine da chiarire con l'ente", dataScadenza: null, preavvisoGiorni: 60, ricorrenzaMesi: null, note: "Sul titolo il termine è illeggibile: chiesto chiarimento." },
  ],
  scadenzeFlotta: [
    { id: "sc1", mezzo: "Escavatore E1", tipo: "Verifica periodica", chiave: "verifica-periodica", dataScadenza: "2026-07-10", mesi: 12, documento: "verbale ASL 2025/118", note: "", ultimaData: "2025-07-10", ultimoEsito: "regolare" },
    { id: "sc2", mezzo: "Pala P1", tipo: "Funi e catene", chiave: "funi-catene", dataScadenza: "2026-08-12", mesi: 3, documento: "registro di controllo", note: "" },
    { id: "sc3", mezzo: "Dumper D1", tipo: "Revisione", chiave: "revisione", dataScadenza: "2029-03-01", mesi: 60, documento: "libretto di circolazione", note: "mezzo targato" },
  ],
  operatoriCampo: [
    { id: "o1", nome: "Mario Rossi", ruolo: "Fochino", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d1" },
    { id: "o2", nome: "Luca Bianchi", ruolo: "Perforatore", squadra: "Squadra A", stato: "in-forza", lavoratoreId: "d2" },
    { id: "o3", nome: "Giulia Verdi", ruolo: "Caposquadra", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d3" },
    { id: "o4", nome: "Paolo Gallo", ruolo: "Autista", squadra: "Squadra B", stato: "in-forza", lavoratoreId: "d5" },
    { id: "o5", nome: "Youssef Amrani", ruolo: "Manutentore", squadra: "Squadra C", stato: "non-disponibile" },
  ],
  squadreCampo: [
    { id: "q1", nome: "Squadra A — Perforazione", persone: 4, area: "fronte Est", stato: "operativa" },
    { id: "q2", nome: "Squadra B — Carico", persone: 3, area: "piazzale 2", stato: "operativa" },
    { id: "q3", nome: "Squadra C — Impianto", persone: 2, area: "frantoio", stato: "ferma" },
  ],
  scadenze: [
    { id: "s1", lavoratoreId: "d1", tipo: "Visita medica", descrizione: "Visita medica periodica", dataScadenza: "2026-07-02" },
    { id: "s2", lavoratoreId: "d2", tipo: "Corso", descrizione: "Corso antincendio", dataScadenza: "2026-07-11" },
    { id: "s3", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione preposto", dataScadenza: "2026-08-09" },
    { id: "s4", lavoratoreId: "d6", tipo: "DPI", descrizione: "Consegna DPI", dataScadenza: "2026-08-15" },
    { id: "s5", lavoratoreId: "d5", tipo: "Patente", descrizione: "CQC rinnovo", dataScadenza: "2026-09-02" },
    { id: "s6", lavoratoreId: "d5", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-05-20" },
    { id: "s7", lavoratoreId: "d5", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-04-18" },
    { id: "s8", lavoratoreId: "d5", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-04-18" },
    { id: "s9", lavoratoreId: "d3", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-02-11" },
    { id: "s10", lavoratoreId: "d3", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2030-02-11" },
    { id: "s11", lavoratoreId: "d1", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-05-30" },
    { id: "s12", lavoratoreId: "d1", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-05-30" },
    { id: "s13", lavoratoreId: "d1", tipo: "Patente", descrizione: "Fochino — abilitazione brillamento mine", dataScadenza: "2028-05-30" },
    { id: "s14", lavoratoreId: "d6", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-01-20" },
    { id: "s15", lavoratoreId: "d6", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2029-03-05" },
    { id: "s16", lavoratoreId: "d6", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2029-03-05" },
    { id: "s17", lavoratoreId: "d6", tipo: "Patente", descrizione: "Fochino — abilitazione brillamento mine", dataScadenza: "2029-11-14" },
    { id: "s18", lavoratoreId: "d2", tipo: "Visita medica", descrizione: "Sorveglianza sanitaria — visita periodica (art. 41)", dataScadenza: "2027-04-08" },
    { id: "s19", lavoratoreId: "d2", tipo: "Formazione", descrizione: "Formazione generale + specifica (art. 37)", dataScadenza: "2028-09-30" },
    { id: "s20", lavoratoreId: "d2", tipo: "Formazione", descrizione: "Aggiornamento formazione lavoratori", dataScadenza: "2028-09-30" },
    { id: "s21", lavoratoreId: "d5", tipo: "Corso", descrizione: "Primo soccorso — aggiornamento addetti", dataScadenza: "2028-04-14" },
    { id: "s22", lavoratoreId: "d5", tipo: "Formazione", descrizione: "RLS — aggiornamento periodico", dataScadenza: "2027-06-15" },
    /* L'ADDESTRAMENTO PER GLI SPAZI CONFINATI (D.P.R. 177/2011 art. 2 c.1 lett.
       f e h). Ce l'ha SOLO Franco Riva, ed è di proposito: è lui che riceve il
       permesso pw1, e la matrice deve poter dire «può andare» su una riga e
       «non può» su tutte le altre. Un permesso rilasciato a chi quel corso non
       l'ha fatto è la cosa che il modulo esiste per fermare. */
    { id: "s23", lavoratoreId: "d6", tipo: "Formazione", descrizione: "Spazi confinati — informazione, formazione e addestramento", dataScadenza: "2027-09-30" },
    /* LE VERIFICHE PERIODICHE DELLE ATTREZZATURE (art. 71 c.11 D.Lgs 81/08,
       allegato VII). Sono le PRIME scadenze aziendali della dimostrazione
       (`lavoratoreId: null`): un'autogru non è di nessuno in particolare, e
       finché non ce n'era una l'intero ramo «azienda» — la riga «azienda»
       dell'elenco, il blocco AZIENDA del CSV, la promessa della modale che
       toglie una persona — non compariva mai nella dimostrazione.
       ⛔ E LE TRE RIGHE SONO TRE STATI DIVERSI DI PROPOSITO, perché un
       campione solo non distingue «funziona» da «sono tutti uguali»: una
       verifica andata bene col suo verbale, una con prescrizioni il cui
       termine è già passato, e una di cui non si sa niente — che è quella per
       cui questo blocco esiste. */
    { id: "s24", lavoratoreId: null, tipo: TIPO_VERIFICA_PERIODICA, descrizione: "Autogru 30 t — verifica periodica", dataScadenza: "2027-03-18",
      verificaEnte: "abilitato", verificaChi: "Organismo abilitato — iscr. elenco MLPS", verificaEsito: "idonea", verbaleId: "c11" },
    { id: "s25", lavoratoreId: null, tipo: TIPO_VERIFICA_PERIODICA, descrizione: "Piattaforma elevabile — verifica periodica", dataScadenza: "2026-11-27",
      verificaEnte: "asl", verificaChi: "ASL territoriale", verificaEsito: "prescrizioni", verificaEntro: "2026-07-15", verbaleId: "c12" },
    /* Nessun esito, nessun verificatore, nessun verbale: la data è LONTANA,
       quindi lo scadenzario la disegna verde e tranquilla. È esattamente il
       «numero tranquillo dove non è stato misurato niente», e serve nella
       dimostrazione perché è il caso che `statoVerificaPeriodica` esiste per
       raccontare — non un dato dimenticato. */
    { id: "s26", lavoratoreId: null, tipo: TIPO_VERIFICA_PERIODICA, descrizione: "Carrello semovente a braccio telescopico — verifica periodica", dataScadenza: "2027-06-30" },
  ],
  documenti: [
    { id: "c1", titolo: "DVR — Documento Valutazione Rischi", meta: "Aggiornato 03/2026", tipo: "DVR", stato: "valido" },
    { id: "c2", titolo: "Piano di Emergenza", meta: "Aggiornato 01/2026", tipo: "Altro", stato: "valido" },
    { id: "c3", titolo: "Nomine RSPP / addetti", meta: "Revisione richiesta", tipo: "Nomina", stato: "da-rivedere" },
    /* ⛔ IL DSS DELLA CAVA, ED È NON DATABILE DI PROPOSITO. Il documento c'è,
       il suo stato dice «valido» e la nota dice pure che è stato inviato: tre
       cose rassicuranti, e nessuna delle tre è una data che l'app possa
       leggere. È esattamente il caso per cui `cicloDss` esiste — un DSS di cui
       non si sa l'età non è «aggiornato» e non è «scaduto» — ed è anche il
       punto di partenza vero di una cava che carica il suo archivio.
       Il ciclo si compila dalla schermata Documenti: messe le date, la stessa
       riga passa a «in corso di validità» o a «certificazione scaduta». */
    { id: "c4", titolo: "DSS — Documento Sicurezza e Salute", meta: "Inviato ASL 02/2026", tipo: "DSS", cantiereId: "k1", stato: "valido",
      dssRevisione: null, dssMotivo: "", dssTrasmissione: null },
    { id: "c5", titolo: "Verbale consegna DPI — M. Rossi", meta: "Firmato 04/2026", tipo: "Verbale DPI", lavoratoreId: "d1", stato: "valido" },
    /* ⛔ UN DOCUMENTO DI CUI NESSUNO HA SCRITTO LO STATO. Ci si arriva con un
       import o con un archivio vecchio, ed è il caso per cui `D[d.stato]` ha
       il ripiego «Stato non indicato»: senza questa riga quella difesa non la
       vedeva nessuno — né il fondatore né uno scatto. Un dato che manca è uno
       stato che il prodotto sa raccontare, e la dimostrazione lo mostra. */
    { id: "c6", titolo: "Autorizzazione allo scarico acque di lavorazione", meta: "Da archivio cartaceo, stato non registrato", tipo: "Altro", cantiereId: "k1", stato: "" },
    /* I DOCUMENTI DI QUALIFICA DELLE IMPRESE ESTERNE. Vivono in QUESTO
       registro — non in un secondo archivio — collegati da `appaltatoreId`
       come gli altri si collegano a `cantiereId` e `lavoratoreId`; `scadenza`
       la legge `statoScadenza`, che è la stessa regola dello scadenzario.
       ⛔ Manca di proposito qualunque riga per «ap3»: è l'impresa NON
       VERIFICATA, e un'assenza è uno stato che il prodotto sa raccontare. */
    { id: "c7", titolo: "Visura CCIAA — Autotrasporti Valle srl", meta: "art. 26 c.1 lett. a)", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "cciaa", scadenza: "2027-02-10", stato: "valido" },
    { id: "c8", titolo: "Autocertificazione requisiti — Autotrasporti Valle srl", meta: "art. 47 DPR 445/2000", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "autocert", scadenza: null, stato: "valido" },
    { id: "c9", titolo: "DURC — Autotrasporti Valle srl", meta: "Validità 120 giorni", tipo: "Altro",
      appaltatoreId: "ap1", tipoQualifica: "durc", scadenza: "2026-11-30", stato: "valido" },
    /* Officina Meccanica Sud: il camerale c'è ed è SCADUTO. Non è un dettaglio
       formale — è la riga per cui l'esito «scaduto» esiste separato da
       «incompleto»: qualcuno ha guardato, e quello che ha trovato non vale più. */
    { id: "c10", titolo: "Visura CCIAA — Officina Meccanica Sud snc", meta: "Da rinnovare", tipo: "Altro",
      appaltatoreId: "ap2", tipoQualifica: "cciaa", scadenza: "2026-05-31", stato: "da-rivedere" },
    /* I VERBALI DELLE VERIFICHE PERIODICHE, cioè i documenti che le scadenze
       s24 e s25 chiudono (`verbaleId`). La terza attrezzatura (s26) non ne ha
       nessuno, ed è il caso che conta: lo scadenzario la disegna verde perché
       la data è lontana, e senza questo blocco nessuno saprebbe che di quella
       verifica non si sa niente. */
    { id: "c11", titolo: "Verbale verifica periodica — autogru 30 t", meta: "Esito positivo", tipo: "Verbale di verifica periodica", cantiereId: "k1", stato: "valido" },
    { id: "c12", titolo: "Verbale verifica periodica — piattaforma elevabile", meta: "Positivo con prescrizioni", tipo: "Verbale di verifica periodica", cantiereId: "k1", stato: "valido" },
  ],
  cantieri: [
    { id: "k1", nome: "Cava Monte Alto", comune: "Comune di esempio", tipo: "cava", stato: "attivo" },
    { id: "k2", nome: "Cantiere cliente Edilcave", comune: "Comune di esempio", tipo: "cantiere", stato: "attivo" },
  ],
  /* LE IMPRESE ESTERNE. In una cava ci sono sempre: chi trasporta, chi ripara,
     chi perfora, chi ripristina. Le tre righe mostrano i tre esiti che la
     qualifica sa dire, e la terza è quella che conta: un'impresa **senza
     nessun documento** non è «idonea finché non si scopre il contrario», è
     NON VERIFICATA, ed è il caso su cui un ispettore guarda per primo. */
  appaltatori: [
    { id: "ap1", ragioneSociale: "Autotrasporti Valle srl", partitaIva: "0000000001",
      attivita: "Trasporto inerti", referente: "—", telefono: "", attivo: true },
    { id: "ap2", ragioneSociale: "Officina Meccanica Sud snc", partitaIva: "0000000002",
      attivita: "Manutenzione mezzi e frantoio", referente: "—", telefono: "", attivo: true },
    { id: "ap3", ragioneSociale: "Perforazioni Rocca srl", partitaIva: "0000000003",
      attivita: "Perforazione e volate", referente: "—", telefono: "", attivo: true },
  ],
  /* GLI APPALTI. Ogni riga è uno degli esiti che il modulo deve saper dire, e
     nessuna è di riempimento:
     · pa1 — tutto in ordine, in cava: DSS coordinato redatto, datato e
       SOTTOSCRITTO dall'impresa (art. 9 c.2 D.Lgs 624/96);
     · pa2 — ⛔ LA RIGA PER CUI ESISTE QUESTO MODULO. Sulla carta è impeccabile:
       DSS coordinato redatto, datato, sottoscritto, costi da interferenze
       indicati. Ma l'impresa che perfora col rischio di atmosfere esplosive
       **non è mai stata verificata** — nessun documento, nemmeno il camerale.
       L'esito NON è «a posto» e non è «da sistemare»: è **non verificato**, e
       si legge diverso dagli altri due. Un semaforo verde qui sarebbe la cosa
       peggiore che questa schermata possa fare, perché è quella che si mostra
       a un ispettore;
     · pa3 — fuori cava, e la durata in uomini-giorno **non è stata scritta**:
       non è un appalto esente, è un appalto su cui non si può decidere. È il
       caso per cui `duvriDovuto` ha tre risposte invece di due, e senza questa
       riga la dimostrazione non lo mostrerebbe mai;
     · pa4 — in cava, DSS coordinato redatto ma **mai sottoscritto**: senza la
       firma l'appaltatore non è responsabile della parte di sua competenza. */
  appalti: [
    { id: "pa1", appaltatoreId: "ap1", cantiereId: "k1", oggetto: "Trasporto inerti al piazzale",
      dataInizio: "2026-02-01", uominiGiorno: 120, natura: "", rischiValutati: true, rischiParticolari: [],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-01-28", coordSottoscritto: true,
      costiSicurezza: 1400, stato: "attivo" },
    { id: "pa2", appaltatoreId: "ap3", cantiereId: "k1", oggetto: "Perforazione fronte Est",
      dataInizio: "2026-06-15", uominiGiorno: 24, natura: "", rischiValutati: true, rischiParticolari: ["esplosive"],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-06-10", coordSottoscritto: true,
      costiSicurezza: 2200, stato: "attivo" },
    { id: "pa3", appaltatoreId: "ap2", cantiereId: "k2", oggetto: "Revisione impianto di frantumazione",
      dataInizio: "2026-07-20", uominiGiorno: null, natura: "", rischiValutati: false, rischiParticolari: [],
      coordRedattore: "", coordData: null, coordSottoscritto: false,
      costiSicurezza: null, stato: "attivo" },
    { id: "pa4", appaltatoreId: "ap1", cantiereId: "k1", oggetto: "Trasporto materiale di ripristino",
      dataInizio: "2026-07-01", uominiGiorno: 18, natura: "", rischiValutati: true, rischiParticolari: [],
      coordRedattore: "RSPP dell'azienda", coordData: "2026-06-25", coordSottoscritto: false,
      costiSicurezza: 300, stato: "attivo" },
  ],
  infortuni: [
    { id: "i1", data: "2026-05-18", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Est", luogoTipo: "fronte", categoria: "caduta-massi", gravitaPotenziale: "mortale", descrizione: "Caduta massi vicino al perforatore, nessun ferito" },
    { id: "i2", data: "2026-02-03", tipo: "infortunio", gravita: "lieve", giorniAssenza: 4, luogo: "officina", luogoTipo: "officina", descrizione: "Taglio alla mano durante una manutenzione" },
    { id: "i3", data: "2026-06-24", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista principale", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, gravitaPotenziale: "mortale", descrizione: "Dumper e pick-up incrociati in curva con poca visibilità" },
    { id: "i4", data: "2026-07-06", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "fronte Nord", luogoTipo: "fronte", categoria: "caduta-massi", rapida: true, gravitaPotenziale: "grave", descrizione: "Blocco staccato dal ciglio durante il disgaggio" },
    /* ⛔ i5 È SENZA `gravitaPotenziale`, E DI PROPOSITO. Un campo assente non
       è un refuso: è uno stato che il prodotto sa raccontare, e la
       dimostrazione deve contenerlo — se no la funzione appena costruita per
       dire «nessuno l'ha valutato» non avrebbe niente da mostrare. È anche il
       caso realistico: il riparo di un nastro trovato aperto a macchina ferma
       è esattamente l'episodio su cui chi segnala NON sa dire come sarebbe
       finita, e costringerlo a scegliere raccoglierebbe un numero inventato. */
    { id: "i5", data: "2026-07-15", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "impianto", luogoTipo: "impianto", categoria: "impianto", rapida: true, descrizione: "Riparo del nastro 3 trovato aperto a macchina ferma" },
    { id: "i6", data: "2026-07-21", tipo: "near-miss", gravita: "lieve", giorniAssenza: 0, luogo: "pista di risalita", luogoTipo: "pista", categoria: "mezzi", anonimo: true, rapida: true, gravitaPotenziale: "lieve", descrizione: "Pietra caduta dal cassone su tratto di pista con arginello basso" },
    // i7 sta in un ANNO PRECEDENTE di proposito: senza almeno due anni non
    // esiste un andamento da mostrare, e la dimostrazione deve contenere il
    // caso per cui la schermata è stata costruita.
    { id: "i7", data: "2025-09-12", tipo: "infortunio", gravita: "lieve", giorniAssenza: 12, luogo: "impianto", luogoTipo: "impianto", descrizione: "Contusione a un piede durante lo sblocco di un nastro" },
    /* ⛔ UN INFORTUNIO CON LA PROGNOSI ANCORA APERTA — decisione 17 del
       fondatore, 02/08. `giorniAssenza` è `null` di proposito, e non è un
       refuso: è lo stato in cui un infortunio si trova nei giorni in cui viene
       registrato, cioè quello per cui la difesa esiste. Senza questa riga la
       dimostrazione non poteva contenere il caso — come la fattura senza
       scadenza in Conti — e le frasi «almeno N giornate perse» e «indice di
       gravità (minimo)» sarebbero state codice morto. */
    { id: "i8", data: "2026-07-28", tipo: "infortunio", gravita: "lieve", giorniAssenza: null, luogo: "piazzale 2", luogoTipo: "piazzale", descrizione: "Distorsione alla caviglia scendendo dalla cabina del dumper — prognosi ancora aperta" },
  ],
  /* LE ORE LAVORATE, ANNO PER ANNO — il denominatore dei tre indici.
     ⛔ Il 2026 NON c'è, ed è la parte più importante della dimostrazione: è
     l'anno in corso, ha un infortunio registrato (i2) e non ha le ore. Così si
     vede quello che questa schermata serve a non far succedere — l'indice che
     manca proprio nell'anno in cui è appena successo qualcosa — invece di un
     grafico tutto verde che non insegna niente. Il 2024 è a zero infortuni con
     le ore note: quello è uno zero VERO, e si distingue dal buco del 2026. */
  oreAnno: [
    { id: "o1", anno: 2024, ore: 21500 },
    { id: "o2", anno: 2025, ore: 22100 },
  ],
  azioni: [
    { id: "a1", descrizione: "Disgaggio del fronte Est e ripristino della fascia di rispetto a valle", responsabileId: "d3", scadenza: "2026-07-31", stato: "in-corso", origineTipo: "evento", origineId: "i1" },
    { id: "a2", descrizione: "Consegna guanti antitaglio e addestramento agli addetti officina", responsabileId: "d7", scadenza: "2026-03-15", stato: "chiusa", esito: "Guanti consegnati e addestramento registrato", dataChiusura: "2026-03-12", origineTipo: "evento", origineId: "i2" },
    { id: "a3", descrizione: "Ripristinare la segnaletica di viabilità sulla pista principale", responsabileId: null, scadenza: "2026-06-30", stato: "aperta", origineTipo: "nc", origineNota: "Non conformità rilevata durante il giro di sorveglianza" },
    { id: "a4", descrizione: "Delimitare la fascia di rispetto al ciglio del fronte Nord", responsabileId: "d3", scadenza: "2026-08-09", stato: "aperta", origineTipo: "ispezione", origineId: "q1", origineVoce: "v2", origineNota: "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi" },
  ],
  // L'ANALISI DELLA CAUSA di due eventi su sei. Sono DUE di proposito, e non
  // cinque: `causeRicorrenti` risponde `leggibile: false` sotto MIN_TENDENZA, e
  // la dimostrazione deve far vedere proprio quella risposta — «sono stati
  // analizzati due eventi su sei, su così pochi non si legge nessuna
  // ricorrenza» — invece di una tendenza disegnata su due punti. Chi guarda la
  // dimostrazione vede il lavoro che manca, che è il punto della funzione.
  // Nessuna delle due catene finisce su una persona: sono l'esempio di come
  // vanno scritte, e il primo perché è la descrizione di quello che è successo.
  analisi: [
    { id: "an1", eventoId: "i1",
      perche: [
        "Un masso si è staccato dal fronte Est mentre si perforava sotto",
        "Sul ciglio era rimasto materiale sciolto dopo l'ultima volata",
        "La fascia di rispetto a valle non era delimitata",
        "La delimitazione non è prevista nel giro di sorveglianza",
      ],
      causa: "organizzativa", fatta: "2026-05-20", daChi: "d3", azioniId: ["a1"] },
    { id: "an2", eventoId: "i2",
      perche: [
        "Taglio alla mano su una lamiera durante una manutenzione",
        "I guanti in uso in officina non erano antitaglio",
        "In magazzino c'erano solo guanti da carico generico",
      ],
      causa: "dpi", fatta: "2026-02-05", daChi: "d7", azioniId: ["a2"] },
  ],
  ispezioni: [
    { id: "q1", modello: "fronte", nome: "Fronte di cava — stabilità e disgaggio", ambito: "Fronti",
      riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: stabilità dei fronti, caduta massi e franamento; alimenta la relazione annuale di stabilità.",
      periodicitaGiorni: 30, data: "2026-07-10", cantiereId: "k1", responsabileId: "d3",
      voci: [
        { id: "v1", testo: "Ciglio superiore libero da massi instabili e materiale sciolto" },
        { id: "v2", testo: "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi" },
        { id: "v3", testo: "Nessun blocco in equilibrio precario sulla parete" },
        { id: "v4", testo: "Altezza e pendenza dei gradoni come previsto nel DSS" },
        { id: "v5", testo: "Unghia del fronte libera da accumuli che ostacolano il lavoro" },
        { id: "v6", testo: "Nessuna fessura di trazione, venuta d'acqua o segno di movimento" },
        { id: "v7", testo: "Disgaggio eseguito dopo l'ultima volata e dopo le piogge forti" },
        { id: "v8", testo: "Accessi al fronte sbarrati e segnalati quando l'area non è operativa" },
      ],
      esiti: {
        v1: { esito: "conforme", nota: "" },
        v2: { esito: "non-conforme", nota: "Delimitazione rimossa durante l'ultimo sbancamento" },
        v3: { esito: "conforme", nota: "" }, v4: { esito: "conforme", nota: "" },
        v5: { esito: "conforme", nota: "" }, v6: { esito: "conforme", nota: "" },
        v7: { esito: "conforme", nota: "" }, v8: { esito: "na", nota: "Area operativa in continuo" },
      },
      stato: "completata", dataChiusura: "2026-07-10" },
    { id: "q2", modello: "piste", nome: "Piste e viabilità interna", ambito: "Piste",
      riferimento: "D.Lgs 81/08 titolo I e D.Lgs 624/96 — circolazione dei mezzi in sicurezza nei luoghi di lavoro.",
      periodicitaGiorni: 15, data: "2026-07-28", cantiereId: "k1", responsabileId: "d3",
      voci: [
        { id: "v1", testo: "Larghezza della pista adeguata al mezzo più grande in uso" },
        { id: "v2", testo: "Arginelli sui lati esposti presenti e integri" },
        { id: "v3", testo: "Fondo e pendenza in ordine, senza solchi o cedimenti" },
        { id: "v4", testo: "Segnaletica, limiti di velocità e precedenze visibili" },
        { id: "v5", testo: "Abbattimento delle polveri (bagnatura) eseguito" },
        { id: "v6", testo: "Incroci e punti ciechi con visibilità garantita" },
        { id: "v7", testo: "Aree di manovra, carico e scarico delimitate" },
        { id: "v8", testo: "Illuminazione sufficiente nei tratti usati con poca luce" },
      ],
      esiti: { v1: { esito: "conforme", nota: "" }, v2: { esito: "conforme", nota: "" } },
      stato: "in-corso", dataChiusura: null },
    /* ⛔ UNA ISPEZIONE DICHIARATA CHIUSA CON META' DELLE VOCI IN BIANCO. È il
       caso per cui esiste «Chiusa a metà»: zero non conformi su una checklist
       guardata a metà non è un buon risultato, è un risultato che non è stato
       misurato — e senza questa riga nella dimostrazione comparivano solo
       «Completata» (verde) e «In corso». La difesa c'era e non si vedeva. */
    { id: "q3", modello: "impianto", nome: "Impianto di lavorazione", ambito: "Frantoio e nastri",
      riferimento: "D.Lgs 81/08 titolo III — protezione degli organi in movimento e uso in sicurezza delle attrezzature.",
      periodicitaGiorni: 30, data: "2026-07-22", cantiereId: "k1", responsabileId: "d6",
      voci: [
        { id: "v1", testo: "Ripari fissi e mobili su pulegge, nastri e organi in movimento" },
        { id: "v2", testo: "Funi e pulsanti di emergenza dei nastri funzionanti e raggiungibili" },
        { id: "v3", testo: "Blocco della macchina in manutenzione (procedura di messa fuori servizio)" },
        { id: "v4", testo: "Passerelle, scale e parapetti integri e sgombri" },
        { id: "v5", testo: "Aspirazione e abbattimento polveri in funzione" },
        { id: "v6", testo: "Quadri elettrici chiusi, accessibili e senza cavi volanti" },
        { id: "v7", testo: "Nessun accumulo di materiale sotto nastri e tramogge" },
        { id: "v8", testo: "Accesso a tramogge e spazi confinati regolato da permesso di lavoro" },
      ],
      esiti: {
        v1: { esito: "conforme", nota: "" },
        v2: { esito: "conforme", nota: "" },
        v3: { esito: "conforme", nota: "" },
        /* ⛔ ECCO IL CASO PER CUI ESISTE IL PERMESSO DI LAVORO, e va visto.
           La voce v8 chiede che l'accesso a tramogge e spazi confinati sia
           «regolato da permesso di lavoro», e qui è spuntata CONFORME. Per il
           22/07 su Cava Monte Alto, però, nel registro dei permessi non c'è
           niente: il permesso pw3 è del 16/07 e pw1 del 03/08. Cioè la spunta
           verde non ha niente dietro — ed è quello che `provaVoce` dice, in
           chiaro, sotto la voce: non è «conforme», è «non lo sappiamo».
           Senza questa riga la difesa esisterebbe e non la vedrebbe nessuno,
           come è già successo con la nomina senza data e con la mansione senza
           requisiti. */
        v8: { esito: "conforme", nota: "" },
      },
      stato: "completata", dataChiusura: "2026-07-22" },
  ],
  /* I PERMESSI DI LAVORO. Quattro righe per quattro verdetti diversi: uno
     valido adesso, uno chiuso come si deve, uno lasciato aperto dopo la fine
     della sua finestra (il primo che un ispettore cerca), e uno affidato a
     un'impresa esterna il cui documento di coordinamento non risulta. */
  permessi: [
    { id: "pw1", tipo: "confinato", lavoro: "Pulizia della tramoggia di alimentazione del frantoio",
      luogo: "Tramoggia TR-01, quota +4 m", cantiereId: "k1",
      dal: "2026-08-03T07:30", al: "2026-08-03T13:00",
      rilasciatoDaId: "d3", riceventeId: "d6", sorveglianteId: "d1", appaltoId: null,
      misure: ["sezionamento", "svuotamento", "bonifica", "ventilazione", "atmosfera",
        "sorvegliante-fuori", "recupero", "emergenza", "dpi"],
      atmosfera: { ossigeno: "20,8", lel: "0", h2s: "0", co: "2", ora: "07:20" },
      stato: "aperto", chiusuraOra: null, chiusuraDaId: null, note: "" },
    { id: "pw2", tipo: "caldo", lavoro: "Saldatura del telaio del vaglio in officina",
      luogo: "Officina, banco 2", cantiereId: "k1",
      dal: "2026-07-25T08:00", al: "2026-07-25T12:00",
      rilasciatoDaId: "d3", riceventeId: "d2", sorveglianteId: null, appaltoId: null,
      misure: ["infiammabili", "estintore", "vigilanza-dopo", "delimitazione", "dpi"],
      atmosfera: null,
      stato: "chiuso", chiusuraOra: "2026-07-25T11:40", chiusuraDaId: "d3",
      note: "Sorveglianza antincendio mantenuta fino alle 12:40." },
    /* ⛔ APERTO E FUORI DALLA SUA FINESTRA DA GIORNI. Non è un errore di
       compilazione: o il lavoro è finito e nessuno ha chiuso il permesso — e
       allora il registro racconta una cava con qualcuno perennemente dentro
       una tramoggia — o si è lavorato fuori dall'autorizzazione. È il caso che
       si vede solo confrontando due date che nessuno confronta a mano. */
    { id: "pw3", tipo: "confinato", lavoro: "Ispezione interna del silo del filler",
      luogo: "Silo SF-02", cantiereId: "k1",
      dal: "2026-07-16T06:30", al: "2026-07-16T11:00",
      rilasciatoDaId: "d3", riceventeId: "d6", sorveglianteId: "d1", appaltoId: null,
      misure: ["sezionamento", "svuotamento", "bonifica", "ventilazione", "atmosfera",
        "sorvegliante-fuori", "recupero", "emergenza", "dpi"],
      atmosfera: { ossigeno: "20,9", lel: "0", h2s: "0", co: "1", ora: "06:20" },
      stato: "aperto", chiusuraOra: null, chiusuraDaId: null, note: "" },
    /* Il permesso affidato a un'IMPRESA ESTERNA: i corsi dei suoi addetti non
       stanno nella nostra anagrafe, e fingere di controllarli sarebbe peggio
       che dire che non li controlliamo. Quello che si verifica è la qualifica
       dell'impresa e il documento di coordinamento — e per l'appalto pa3 non
       risulta né redattore né data. */
    { id: "pw4", tipo: "energia", lavoro: "Sostituzione del riduttore del nastro N3",
      luogo: "Nastro N3, testa motrice", cantiereId: "k2",
      dal: "2026-08-04T07:00", al: "2026-08-04T17:00",
      rilasciatoDaId: "d3", riceventeId: null, sorveglianteId: null, appaltoId: "pa3",
      misure: ["sezionamento", "delimitazione", "avviso-turno", "dpi"],
      atmosfera: null,
      stato: "aperto", chiusuraOra: null, chiusuraDaId: null, note: "" },
    /* ⛔ LA BOZZA CHE ASPETTA LA MISURA DELL'ARIA, e non è un caso di scuola:
       l'atmosfera si misura pochi minuti prima di aprire il passo d'uomo, non
       il giorno prima. Fino ad allora il permesso non è «quasi a posto», è
       NON LO SAPPIAMO — ed è la riga per cui `letturaAtmosfera` distingue
       «non misurata» da «entro i limiti». Senza, quel ramo esisterebbe e la
       dimostrazione non lo mostrerebbe mai. */
    { id: "pw5", tipo: "confinato", lavoro: "Sostituzione del rivestimento antiusura in tramoggia",
      luogo: "Tramoggia TR-02", cantiereId: "k1",
      dal: "2026-08-05T07:00", al: "2026-08-05T12:30",
      rilasciatoDaId: "d3", riceventeId: "d6", sorveglianteId: "d1", appaltoId: null,
      misure: ["sezionamento", "svuotamento", "bonifica", "ventilazione", "atmosfera",
        "sorvegliante-fuori", "recupero", "emergenza", "dpi"],
      atmosfera: null,
      stato: "bozza", chiusuraOra: null, chiusuraDaId: null, note: "" },
  ],
  mansioni: [
    { id: "n1", nome: "Escavatorista / palista",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "guanti"],
      lavoratoriIds: ["d2"] },
    { id: "n2", nome: "Fochino",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "fochino"],
      dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "occhiali", "guanti"],
      lavoratoriIds: ["d1", "d6"] },
    { id: "n3", nome: "Preposto di cava",
      requisiti: ["sorv-sanitaria", "form-generale", "form-preposto"],
      dpi: ["elmetto", "scarpe", "gilet"],
      lavoratoriIds: ["d3"] },
    { id: "n4", nome: "Autista dumper / camion",
      requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
      dpi: ["elmetto", "scarpe", "gilet", "guanti"],
      lavoratoriIds: ["d5"] },
    /* ⛔ UNA MANSIONE DI CUI NESSUNO HA SCRITTO I REQUISITI — decisione 13 del
       fondatore, 02/08. È il caso normale di una mansione appena creata: c'è
       il nome, c'è la persona, e i corsi non li ha ancora messi nessuno. Fino
       a quel giorno la matrice rispondeva «può andare» in verde; adesso
       risponde «non lo sappiamo», e la dimostrazione deve contenere la riga
       per cui la quarta risposta esiste. `nessunRequisito` NON è dichiarato:
       è proprio quella dichiarazione che manca. */
    { id: "n5", nome: "Ufficio e pesa",
      requisiti: [],
      dpi: ["gilet", "scarpe"],
      lavoratoriIds: ["d4"] },
  ],
  nomine: [
    { id: "o1", ruolo: "sorvegliante", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "Turno unico, tutta la cava" },
    { id: "o2", ruolo: "preposto", lavoratoreId: "d3", dal: "2025-02-03", al: null, note: "" },
    { id: "o3", ruolo: "rspp", lavoratoreId: "d7", dal: "2024-09-16", al: null, note: "Incarico esterno" },
    { id: "o4", ruolo: "primo-soccorso", lavoratoreId: "d5", dal: "2025-04-14", al: null, note: "" },
    { id: "o5", ruolo: "antincendio", lavoratoreId: "d2", dal: "2025-04-14", al: null, note: "" },
    { id: "o6", ruolo: "rls", lavoratoreId: "d5", dal: "2024-11-08", al: null, note: "Eletto dai lavoratori" },
    /* ⛔ UNA NOMINA SENZA LA DATA DA CUI DECORRE: la persona c'è, ma davanti a
       un ispettore non si dimostra da quando. `organigrammaSicurezza` la conta
       in `senzaData` e la pagina la scrive in giallo — ma con tutte e sei le
       nomine datate quel ramo non si accendeva mai, e la difesa restava
       invisibile.
       ⚠️ Va su un ruolo SENZA requisito di formazione, e non a caso: nella
       pastiglia i due rossi della formazione vengono PRIMA di «Senza data di
       nomina», quindi su `preposto` — dove in dimostrazione nessuno ha il
       corso — si sarebbe visto «Formazione non registrata» e questa riga non
       avrebbe mostrato quello per cui esiste. E il rosso «Da nominare» non si
       perde: resta acceso su `medico`. */
    { id: "o7", ruolo: "direttore", lavoratoreId: "d3", dal: null, al: null, note: "Da registro cartaceo: data di decorrenza non riportata" },
  ],
  dpi: [
    { id: "e1", lavoratoreId: "d1", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2031-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e2", lavoratoreId: "d1", tipo: "scarpe", modello: "", taglia: "43", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e3", lavoratoreId: "d1", tipo: "otoprotettori", modello: "cuffie", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2027-01-12", addestramento: true, dataAddestramento: "2026-01-12", note: "" },
    { id: "e4", lavoratoreId: "d2", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2025-06-02", scadenza: "2030-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e5", lavoratoreId: "d2", tipo: "otoprotettori", modello: "inserti", taglia: "unica", dataConsegna: "2025-06-02", scadenza: "2026-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e6", lavoratoreId: "d3", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-03-09", scadenza: "2031-03-09", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e7", lavoratoreId: "d5", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-04-20", scadenza: "2031-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e8", lavoratoreId: "d5", tipo: "scarpe", modello: "", taglia: "44", dataConsegna: "2026-04-20", scadenza: "2028-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e9", lavoratoreId: "d5", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2026-04-20", scadenza: "2028-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e10", lavoratoreId: "d5", tipo: "guanti", modello: "", taglia: "9", dataConsegna: "2026-04-20", scadenza: "2027-04-20", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e11", lavoratoreId: "d1", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e12", lavoratoreId: "d1", tipo: "occhiali", modello: "", taglia: "unica", dataConsegna: "2026-01-12", scadenza: "2028-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e13", lavoratoreId: "d1", tipo: "guanti", modello: "", taglia: "10", dataConsegna: "2026-01-12", scadenza: "2027-01-12", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e14", lavoratoreId: "d6", tipo: "elmetto", modello: "", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2031-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e15", lavoratoreId: "d6", tipo: "scarpe", modello: "", taglia: "45", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e16", lavoratoreId: "d6", tipo: "gilet", modello: "", taglia: "XL", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e17", lavoratoreId: "d6", tipo: "otoprotettori", modello: "cuffie", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2027-02-24", addestramento: true, dataAddestramento: "2026-02-24", note: "" },
    { id: "e18", lavoratoreId: "d6", tipo: "occhiali", modello: "", taglia: "unica", dataConsegna: "2026-02-24", scadenza: "2028-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e19", lavoratoreId: "d6", tipo: "guanti", modello: "", taglia: "10", dataConsegna: "2026-02-24", scadenza: "2027-02-24", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e20", lavoratoreId: "d2", tipo: "scarpe", modello: "", taglia: "43", dataConsegna: "2025-06-02", scadenza: "2027-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e21", lavoratoreId: "d2", tipo: "gilet", modello: "", taglia: "L", dataConsegna: "2025-06-02", scadenza: "2027-06-02", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e22", lavoratoreId: "d2", tipo: "guanti", modello: "", taglia: "9", dataConsegna: "2026-05-11", scadenza: "2027-05-11", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e23", lavoratoreId: "d3", tipo: "scarpe", modello: "", taglia: "38", dataConsegna: "2026-03-09", scadenza: "2028-03-09", addestramento: false, dataAddestramento: null, note: "" },
    { id: "e24", lavoratoreId: "d3", tipo: "gilet", modello: "", taglia: "M", dataConsegna: "2026-03-09", scadenza: "2028-03-09", addestramento: false, dataAddestramento: null, note: "" },
    /* ⛔ QUESTA CONSEGNA ACCENDE DUE COSE CHE NESSUNO POTEVA VEDERE. Un DPI di
       III categoria consegnato e in corso di validità, ma con l'addestramento
       (art. 77 D.Lgs 81/08) mai registrato: è un'ASSENZA, e un'assenza nella
       dimostrazione è una cosa che il prodotto sa raccontare.
       Prima non c'era: le uniche due consegne di otoprotettori con
       addestramento richiesto lo avevano registrato, e la terza (Luca Bianchi)
       è **anche** scaduta — quindi la sua riga porta due motivi, la pastiglia
       dice «Da sostituire» e il bottone «Addestrato» non compare, perché si
       accende solo quando l'addestramento è l'UNICA cosa che manca. Risultato:
       la pastiglia «Addestramento» e quel bottone erano codice morto in
       dimostrazione.
       E accende anche il secondo giro di `allarmiDpi`, quello che pesca gli
       addestramenti FUORI dalle mansioni: l'autista dumper non ha gli
       otoprotettori fra i DPI della sua mansione, e il commento di quel giro
       dice esattamente perché va segnalato lo stesso. */
    { id: "e25", lavoratoreId: "d5", tipo: "otoprotettori", modello: "inserti", taglia: "unica", dataConsegna: "2026-05-18", scadenza: "2029-05-18", addestramento: false, dataAddestramento: null, note: "" },
    /* ⛔ LE DUE CONSEGNE SENZA DATA DI SOSTITUZIONE, E SONO DUE COSE DIVERSE —
       decisione 14 del fondatore, 02/08. Prima del 02/08 sarebbero state tutte
       e due VERDI, e nella tabella la data si sarebbe letta «—» per
       tutt'e due: la stessa faccia tranquilla per una risposta e per una
       domanda aperta.
       · e26: gli indumenti da lavoro non hanno una vita utile — il catalogo
         per loro non sa nemmeno proporre una data (`mesi: null`) — e qualcuno
         lo ha DICHIARATO. Quello è verde, ed è una risposta misurata.
       · e27: un facciale filtrante contro la silice, di III categoria, con la
         casella svuotata. Nessuno ha detto entro quando va sostituito: è
         giallo, e sta nel registro perché è il caso su cui il fondatore ha
         detto che «non lo sappiamo» pesa. L'addestramento è registrato di
         proposito, così l'unica cosa che manca è la data. */
    { id: "e26", lavoratoreId: "d3", tipo: "indumenti", modello: "", taglia: "M", dataConsegna: "2026-03-09", scadenza: null, nonScade: true, addestramento: false, dataAddestramento: null, note: "Vestiario: nessuna scadenza dichiarata dal costruttore" },
    { id: "e27", lavoratoreId: "d1", tipo: "maschera", modello: "FFP3", taglia: "unica", dataConsegna: "2026-06-15", scadenza: null, addestramento: true, dataAddestramento: "2026-06-15", note: "" },
  ],
};

/* Tipi di documento HSE gestiti (base normativa: D.Lgs 81/08; per le cave il
   documento di valutazione specifico è il DSS ex D.Lgs 624/96 art. 6/10,
   da inviare all'ASL prima dell'avvio; il POS riguarda i cantieri edili
   in cui l'azienda opera come impresa esecutrice — D.Lgs 81/08 art. 89). */
export const TIPI_DOCUMENTO = [
  "DSS", "POS", "DVR", "DUVRI", "Nomina", "Verbale DPI",
  /* Il verbale della verifica periodica di un'attrezzatura (art. 71 c.11
     D.Lgs 81/08): è il documento che una scadenza di verifica CHIUDE, ed è
     quello che l'organo di vigilanza chiede in mano. Sta in questo registro e
     non in un archivio suo, come i documenti di qualifica degli appaltatori. */
  "Verbale di verifica periodica",
  "Idoneità sanitaria", "Attestato formazione", "Altro",
];

// LA SOGLIA DELLE SCADENZE ORA SERVE A DUE APP — Scudo per il suo scadenzario e
// Campo per sapere se chi è in turno ha i documenti in corso — quindi vive in
// `shared/dw-ponti.js` e qui si RI-ESPORTA col nome con cui l'ha sempre chiamata
// questa app. Un alias non è una seconda implementazione: due copie uguali oggi
// divergono domani senza che nessuno lo veda, ed è già costato una giornata con
// la convenzione sui numeri.
// Nota tecnica, imparata rompendo tutto: `export { x } from "..."` NON crea un
// nome locale, quindi le trenta chiamate interne a `statoScadenza` di questo file
// restavano scoperte — dieci prove rosse subito, che è il comportamento giusto
// della suite. Serve importare e poi ri-esportare il nome.
import { statoScadenzaHSE, applicaPercorsi, traduciCancellazioni, trasformaAtomico, trasformaInMemoria,
         statoResponsabile } from "../../shared/dw-ponti.js";
/* le pagine lo chiamano col nome di casa: un alias non è una seconda
   implementazione (regola del `shared/`) */
export { percorsiDi, DW_CANCELLA } from "../../shared/dw-ponti.js";
import { dataPiuGiorni as dataPiuGiorniShell } from "../../shared/deepwork-id-client/dw-shell.js";
const statoScadenza = statoScadenzaHSE;
export { statoScadenza };
// lo scadenzario di tutta la cava è una regola di shared/ (serve a tre app): qui
// solo il nome, lo stesso oggetto
export { scadenzeUnite } from "../../shared/dw-ponti.js";

// Giudizio di IDONEITÀ SANITARIA (D.Lgs 81/2008 art. 41): esito della
// sorveglianza sanitaria per la mansione. La data della prossima visita
// resta nella scadenza "Visita medica"; qui si registra l'ESITO.
// Stati: "" = non definito, "idoneo", "prescrizioni" (idoneo con
// limitazioni), "non-idoneo".
export function idoneitaLabel(stato) {
  switch (stato) {
    case "idoneo":       return { cls: "ok",     label: "Idoneo" };
    case "prescrizioni": return { cls: "warn",   label: "Idoneo c/prescriz." };
    case "non-idoneo":   return { cls: "danger", label: "NON idoneo" };
    default:             return { cls: "",       label: "Idoneità n.d." };
  }
}
// Ciclo per il tap sul badge: n.d. → idoneo → prescrizioni → non-idoneo → n.d.
export function idoneitaSuccessivo(stato) {
  const seq = ["", "idoneo", "prescrizioni", "non-idoneo"];
  const i = seq.indexOf(seq.includes(stato) ? stato : "");
  return seq[(i + 1) % seq.length];
}
/* IL GIUDIZIO SCRITTO E DATATO (05/09, candidato (b) della ricerca sulla
   sorveglianza sanitaria). Il mondo dice che il giudizio del medico arriva
   PER ISCRITTO, con le prescrizioni e una data: fino a oggi il badge ciclava
   quattro stati senza chiedere niente, e «idoneo con prescrizioni» restava
   un colore senza il testo — una prescrizione che non si legge è una
   prescrizione che non si rispetta. Qui si decide che cosa è un giudizio
   valido: con «prescrizioni» il testo è obbligatorio; con «non idoneo» è
   facoltativo (il medico può scrivere solo l'inidoneità); la data è
   facoltativa ma, se c'è, deve esistere e non stare nel futuro; su «idoneo»
   e «n.d.» le prescrizioni si azzerano (erano del giudizio precedente).
   ⚠️ Niente «ricorso entro trenta giorni»: è un termine di legge di seconda
   mano e non entra. Ritorna { ok, idoneita, prescrizioni, giudizioIl,
   motivo, messaggio }. Pura. */
export function giudizioIdoneita(stato, testo, data, oggi = new Date()) {
  const st = ["", "idoneo", "prescrizioni", "non-idoneo"].includes(stato) ? stato : "";
  const t = String(testo == null ? "" : testo).trim();
  const d = String(data == null ? "" : data).trim().slice(0, 10);
  if (st === "prescrizioni" && !t)
    return { ok: false, motivo: "prescrizioni-mancanti", messaggio: "Un giudizio «con prescrizioni» senza le prescrizioni scritte non si può rispettare: copia quelle del medico." };
  if (d && !dataISOEsiste(d))
    return { ok: false, motivo: "data-non-valida", messaggio: "La data del giudizio non è un giorno che esiste." };
  if (d && giorniTra(d, oggi) > 0)
    return { ok: false, motivo: "data-futura", messaggio: "La data del giudizio è nel futuro: il medico non l'ha ancora scritto." };
  return { ok: true, idoneita: st, prescrizioni: st === "prescrizioni" || st === "non-idoneo" ? t : "",
    giudizioIl: st ? (d || null) : null, motivo: "", messaggio: "" };
}

// Lavoratori attivi la cui idoneità richiede attenzione (per le urgenze).
export function idoneitaCriticita(lavoratori) {
  return lavoratori.filter(l => l.attivo && (l.idoneita === "non-idoneo" || l.idoneita === "prescrizioni"));
}

// Livello di urgenza FINE di una scadenza, per un'etichetta parlante nel
// scadenzario (oltre al badge grezzo di statoScadenza). Fasce ispirate ai
// promemoria multi-soglia (60/30/15/7/1 gg): rosso se scaduta o entro 7 gg,
// giallo entro 30, verde oltre. Additiva: NON tocca statoScadenza (che
// alimenta i KPI). Ritorna { cls, label, giorni } (giorni null se data
// mancante, così un dato incompleto non allarma).
// ⛔ «senza data» NON è verde (corretto il 03/08). Diceva già la parola
// giusta — ed è la stessa che usano Flotta e Terra — ma con `cls: "ok"`, cioè
// col colore di chi è a posto. Una data che non si può leggere è un avviso:
// stesso criterio di `statoRigaProgramma` in Sentinella, che sul «mai
// misurato» scrive «è un avviso e non un allarme».
// Nessuno dei cinque punti di chiamata passa una data assente per davvero
// (misurato): ci si arriva con una data ROTTA, e allora il giallo è giusto.
export function livelloScadenza(dataISO, oggi = new Date()) {
  if (!dataISO) return { cls: "warn", label: "senza data", giorni: null };
  const g = giorniTra(dataISO, oggi);
  if (isNaN(g)) return { cls: "warn", label: "senza data", giorni: null };
  if (g < 0)  return { cls: "danger", label: "scaduta da " + (-g) + " gg", giorni: g };
  if (g === 0) return { cls: "danger", label: "scade oggi", giorni: 0 };
  if (g <= 7)  return { cls: "danger", label: "tra " + g + " gg", giorni: g };
  if (g <= 30) return { cls: "warn",   label: "tra " + g + " gg", giorni: g };
  return { cls: "ok", label: "tra " + g + " gg", giorni: g };
}

/* ⛔ QUI C'ERA UNA COPIA DEBOLE DI `dataIt` (tolta il 03/08), ed è la famiglia
   descritta in CLAUDE.md: «un controllo che guarda COM'È SCRITTO un dato invece
   di CHE COSA VALE». La copia teneva buona qualunque stringa della FORMA
   `\d{4}-\d{2}-\d{2}`, e «2026-13-45» quella forma ce l'ha. Le due frasi che
   ne uscivano non erano sullo schermo: erano in due testi che ESCONO.
     · `testoPromemoria` — il messaggio che si copia e si manda al lavoratore —
       scriveva «scade il 45/13/2026 (tra NaN giorni)», e su «2026-02-30» il
       30 febbraio. Nella stessa riga dell'app lo schermo diceva «senza data»
       dal 03/08 (`statoScadenzaHSE`): schermo e messaggio si smentivano.
     · `statoPermesso` scriveva «Permesso chiuso il —», perché la copia debole
       per una data assente rispondeva «—», che è VERO, e il `? :` che doveva
       togliere il pezzo non scattava mai.
   La versione di `shared/` passa da `dataISOEsiste` e ha il secondo argomento
   per il vuoto: `dataIt(x, "")` rende di nuovo vivo quel ternario. */

// Testo PRONTO di un promemoria/convocazione per il lavoratore la cui scadenza
// (visita medica, corso, patentino…) è scaduta o in scadenza, da copiare e
// inviare (email/SMS). Serve al responsabile sicurezza a sollecitare il
// rinnovo senza riscrivere ogni volta. Ritorna null se non c'è nulla di
// urgente (scadenza regolare) o se manca il nome del lavoratore.
// Pura e testabile: nessun DOM, `oggi` iniettabile.
/* ⛔ LA GUARDIA `!sc.dataScadenza` È USCITA DI QUI (03/08), e il difetto si
   vedeva solo premendo il bottone. La riga il cui campo data non è mai stato
   scritto e la riga con la data ILLEGGIBILE («2026-13-45») sono la STESSA COSA
   a schermo — lo scadenzario scrive «Senza data» su tutt'e due, e su tutt'e due
   disegna il bottone «Promemoria», perché il criterio è `stato !== "regolare"`.
   Premendolo: sulla seconda usciva il messaggio giusto, sulla prima la pagina
   rispondeva «Il promemoria si può preparare solo per la scadenza di un
   lavoratore, e solo se è in scadenza o già scaduta» — che è FALSO due volte
   (è di un lavoratore, e il suo stato non è regolare). Guardava COM'È SCRITTO
   il dato invece di CHE COSA VALE: `statoScadenza` le due cose le tratta già
   uguali, ed è lei che deve decidere. */
export function testoPromemoria(scadenza, lavoratore, oggi = new Date()) {
  const sc = scadenza || {};
  const nome = ((lavoratore && lavoratore.nome) || "").trim();
  if (!nome) return null;
  const st = statoScadenza(sc.dataScadenza, oggi);
  if (st === "regolare") return null;                 // niente di urgente da sollecitare
  const g = giorniTra(sc.dataScadenza, oggi);
  const tipo = (sc.tipo || "adempimento").trim() || "adempimento";
  const cosa = (sc.descrizione || sc.tipo || "adempimento").trim() || "adempimento";
  /* ⛔ IL QUARTO CASO, che mancava: «senza data». Le tre righe qui sotto
     davano per scontato che una scadenza non regolare avesse una data
     leggibile, e con «2026-13-45» il messaggio da mandare al lavoratore
     usciva «scade il 45/13/2026 (tra NaN giorni)». Chi lo riceve legge una
     scadenza precisa che non esiste; chi l'ha mandato non se ne accorge,
     perché lo schermo su quella riga scrive «senza data». La frase adesso
     dice quello che si sa — che va rinnovata — e non inventa l'entro-quando.
     Stessa regola 18 di `run-stile`, applicata a un testo invece che a una
     mappa di badge: `statoScadenza` sa dire quattro cose, e chi la legge deve
     avere quattro risposte. */
  /* ⚠️ La frase del quarto caso vale per TUTT'E DUE i modi di non avere una
     data — quella illeggibile e quella mai scritta — perché per chi riceve il
     messaggio sono la stessa cosa: nello scadenzario non risulta un
     entro-quando. Dire «non è leggibile» su un campo vuoto sarebbe raccontare
     un guasto che non c'è. */
  const quando = st === "senza data"
    ? "va rinnovata, ma nel nostro scadenzario non risulta una data di scadenza leggibile: non possiamo dirti entro quando"
    : st === "scaduta"
      /* ⛔ «(1 giorni fa)», e questo testo NON resta sullo schermo: il bottone
         Promemoria lo copia negli appunti perché finisca in un'email o in un
         SMS al lavoratore. È il documento che esce da questa schermata, e il
         giorno dopo la scadenza è proprio quando lo si manda. Il ramo «tra N
         giorni» qui sotto il singolare ce l'aveva già. */
      ? `risulta SCADUTA dal ${dataIt(sc.dataScadenza)} (${conta(-g, "giorno", "giorni")} fa)`
      : g === 0
        ? `scade OGGI, ${dataIt(sc.dataScadenza)}`
        : `scade il ${dataIt(sc.dataScadenza)} (tra ${g} ${g === 1 ? "giorno" : "giorni"})`;
  return [
    `Oggetto: promemoria scadenza — ${tipo}`,
    ``,
    `Gentile ${nome},`,
    `ti ricordiamo che «${cosa}» ${quando}.`,
    `Ti chiediamo di contattare l'ufficio per programmare il rinnovo il prima possibile, così da mantenere la tua idoneità al lavoro in cava.`,
    `Grazie per la collaborazione.`,
  ].join("\n");
}

// Registro infortuni e near-miss: riepilogo per il "cartellone sicurezza".
// La metrica di testa è i GIORNI SENZA INFORTUNI (giorni dall'ultimo infortunio
// VERO — i near-miss non azzerano il contatore, ma si contano a parte perché
// segnalano i rischi prima che diventino infortuni). Più: numero infortuni,
// di cui gravi, near-miss, e giorni di assenza totali. `giorniSenza` è null se
// non c'è nessun infortunio registrato (nessuna data da cui contare). Pura e
// testabile; `oggi` iniettabile.
// ⛔ LE GIORNATE PERSE DI UN INFORTUNIO A PROGNOSI APERTA NON SONO ZERO —
// decisione 17 del fondatore, 02/08.
// Fino a quel giorno il campo «giorni di assenza» lasciato vuoto valeva `0`
// dappertutto (`+x.giorniAssenza || 0`), e la ragione scritta il 31/07 era
// buona: in un **near-miss** la colonna vuota vuol dire davvero «nessuna
// assenza», ed è il caso normale. Quella ragione però non copre l'infortunio
// registrato mentre la **prognosi è ancora aperta**: lì i giorni non si sanno
// *ancora*. Misurato su un anno da 20.000 ore, con un infortunio da 12 giorni
// già a registro: aggiungendone uno a prognosi aperta la frequenza saliva da
// 50 a 100 — giusto, l'infortunio c'è stato — ma la **gravità restava 0,6** e
// il LTIFR **50**. Cioè l'app diceva «un infortunio in più che non è costato
// nemmeno una giornata», che è esattamente quello che ancora non si sa.
//
// La distinzione è la stessa già usata per la base d'asta di una gara in Conti:
// **il vuoto resta vuoto, lo zero scritto apposta resta zero**. E dipende dal
// tipo, perché il vuoto vuol dire due cose diverse:
//   · near-miss  → nessuna assenza, cioè 0. (La ragione del 31/07, intatta.)
//   · infortunio → `null`, prognosi ancora aperta.
// Torna `null` anche per un valore illeggibile: «non si sa» copre tutt'e due, e
// l'unica risposta che non deve mai uscire da qui è uno zero non misurato.
export function giornateAssenza(evento) {
  const e = evento || {};
  const g = e.giorniAssenza;
  const vuoto = g === null || g === undefined || (typeof g === "string" && g.trim() === "");
  if (e.tipo !== "infortunio") return vuoto ? 0 : Math.max(0, +g || 0);
  if (vuoto) return null;
  /* ⚠️ Il vuoto si controlla PRIMA di convertire, e non è pignoleria: `+null`
     fa `0` e `Number.isFinite(0)` risponde `true` — è lo stesso tranello che
     il 05/08 faceva rispondere «0%» ad `avanzamentoLotto` per un lotto che
     nessuno aveva mai misurato. */
  const n = +g;
  return Number.isFinite(n) ? Math.max(0, n) : null;
}
// Un infortunio le cui giornate perse non sono ancora scritte. I near-miss non
// ci finiscono mai: per loro il vuoto è una risposta, non una domanda aperta.
export function prognosiAperta(evento) {
  return !!(evento && evento.tipo === "infortunio") && giornateAssenza(evento) === null;
}

export function riepilogoInfortuni(infortuni, oggi = new Date()) {
  const list = infortuni || [];
  const veri = list.filter(x => x.tipo === "infortunio");
  const nearMiss = list.filter(x => x.tipo === "near-miss");
  /* ⛔ IL CARTELLONE SCEGLIEVA L'ULTIMO INFORTUNIO GUARDANDO COM'È SCRITTA LA
     DATA, NON CHE COSA VALE. La riga era `/^\d{4}-\d{2}-\d{2}$/.test(d)`: una
     forma, non un valore. «2026-13-45» e «2026-02-30» quella forma ce l'hanno,
     e siccome `ultimo` si sceglie confrontando le STRINGHE, una data
     impossibile **vince sempre** su una vera. Da lì `giorniTra` risponde `NaN`
     e il numero grande in cima alla schermata — quello che in cava si guarda
     per primo — diventa **NaN**, con la cornice gialla per giunta
     (`NaN >= 30` è falso). Misurato: un infortunio vero del 01/06/2026 più una
     riga «2026-13-45» davano `giorniSenza: NaN` al posto di 73.
     La regola giusta era già in casa e in questo stesso file: `cicloDss` filtra
     gli infortuni con `dataISOEsiste`, `organigrammaSicurezza` conta così le
     nomine, e `parseInfortuniCsv` scarta così le righe in import. Qui era
     rimasta la copia più debole, e proprio sulla metrica di testa.
     ⚠️ Raggiungibilità dichiarata, non gonfiata: il form usa `type="date"` con
     `max`, e l'import passa da `dataISOEsiste` dal 03/08 — **latente, non
     impossibile**, come per `statoConsegnaDpi`: ci si arriva con un dato
     scritto a mano, con una riga più vecchia di quel filtro, o con un'altra app
     che scrive nella stessa collezione.
     ⛔ E gli scartati NON spariscono in silenzio: senza `dataIgnota` un
     registro di tre infortuni tutti con la data illeggibile darebbe
     `giorniSenza: null`, cioè il cartellone «Nessun infortunio registrato» —
     la frase più tranquilla di questa schermata — mentre la riga sotto conta
     «Infortuni: 3». L'assenza di una data non è l'assenza di un infortunio. */
  let ultimo = null;
  const dataDi = (x) => String((x || {}).data || "").slice(0, 10);
  for (const x of veri) {
    const d = dataDi(x);
    if (dataISOEsiste(d) && (!ultimo || d > ultimo)) ultimo = d;
  }
  const dataIgnota = veri.filter(x => !dataISOEsiste(dataDi(x))).length;
  const giorniSenza = ultimo ? Math.max(0, -giorniTra(ultimo, oggi)) : null;
  const giorniAssenzaTot = veri.reduce((s, x) => s + (giornateAssenza(x) || 0), 0);
  const prognosiAperte = veri.filter(prognosiAperta).length;
  const gravi = veri.filter(x => x.gravita === "grave").length;
  return { infortuni: veri.length, nearMiss: nearMiss.length, gravi, giorniSenza, ultimo,
    giorniAssenzaTot, prognosiAperte,
    /* quanti infortuni non hanno una data che si possa leggere: il conteggio
       dei giorni non li vede, e chi disegna il cartellone deve dirlo invece di
       lasciar credere che il numero grande li comprenda. */
    dataIgnota,
    /* bandiera: le giornate perse sono TUTTE scritte. Quando è falsa
       `giorniAssenzaTot` è un MINIMO, e chi lo disegna deve dirlo — se no il
       totale si legge come un consuntivo, che è il verso in cui rassicura. */
    noto: prognosiAperte === 0 };
}

/* La frase che accompagna il totale delle giornate perse. Sta qui e non nella
   pagina per la stessa ragione di `descriviCartella`: quello che un numero
   dichiara è una REGOLA, e a scriverla dev'essere uno solo. È anche la lettura
   della bandiera `noto` — che altrimenti sarebbe una guardia scollegata. */
export function descriviGiornatePerse(r) {
  const x = r || {};
  const g = +x.giorniAssenzaTot || 0;
  if (x.noto !== false) return g === 1 ? "1 giornata persa" : g + " giornate perse";
  const n = +x.prognosiAperte || 0;
  return "almeno " + g + (g === 1 ? " giornata persa" : " giornate perse") + ": "
    + (n === 1 ? "di un infortunio la prognosi è ancora aperta" : "di " + n + " infortuni la prognosi è ancora aperta")
    + ", le sue giornate non sono ancora contate";
}

// ============================================================
// AZIONI CORRETTIVE (CAPA)
// Da un evento (infortunio o near-miss) o da una non conformità nasce
// un'azione: cosa fare, chi la fa, entro quando, com'è finita. Chiude il
// cerchio "segnala → correggi → verifica" ed è ciò che la L. 198/2025
// chiede di tracciare insieme agli eventi (eventi *e azioni correttive*).
// Lo stato AVANZAMENTO si salva (aperta → in corso → chiusa), mentre il
// semaforo della SCADENZA resta CALCOLATO dalla data, con lo stesso schema
// già usato dallo scadenzario (statoScadenza/livelloScadenza): nessun dato
// derivato nel database.
// ============================================================

// Etichetta dell'avanzamento (non del semaforo: quello viene dalla data).
export function azioneLabel(stato) {
  switch (stato) {
    case "in-corso": return { cls: "warn", label: "In corso" };
    case "chiusa":   return { cls: "ok",   label: "Chiusa" };
    default:         return { cls: "danger", label: "Aperta" };
  }
}
// Ciclo per il tap sul badge: aperta → in corso → chiusa → aperta.
export function azioneStatoSuccessivo(stato) {
  const seq = ["aperta", "in-corso", "chiusa"];
  const i = seq.indexOf(seq.includes(stato) ? stato : "aperta");
  return seq[(i + 1) % seq.length];
}
// Semaforo di un'azione, con lo STESSO schema delle scadenze: un'azione
// chiusa è sempre "regolare" (non scade più), le altre seguono la data.
// Ritorna "scaduta" | "in-scadenza" | "regolare".
/* ⛔ «SENZA DATA» NON È «REGOLARE» (corretto il 04/08). La riga diceva «senza
   data non allarma», ed era la stessa scorciatoia già corretta in
   `livelloScadenza` il 03/08: un'azione correttiva aperta di cui nessuno ha
   scritto l'entro-quando usciva verde come una in perfetto orario. Non allarma
   è giusto — è un avviso, non un allarme — ma la parola giusta esiste già e la
   dice `statoScadenza`: «senza data», gialla, ed è la stessa che usano Flotta e
   Terra. I due form dell'app (Scudo e il ponte di Sentinella) la data la
   pretendono: ci si arriva con un import o con un dato vecchio. */
export function statoAzione(azione, oggi = new Date()) {
  const a = azione || {};
  if (a.stato === "chiusa") return "regolare";
  return statoScadenza(a.scadenza, oggi);
}
/* ⛔ CHI DEVE FARE QUESTA AZIONE — DETTO IN UN POSTO SOLO, PER LO SCHERMO E PER
   IL FILE CHE ESCE. Scritta l'08/08 su un difetto vero, e la domanda che l'ha
   trovato è quella di CLAUDE.md: *dove questa app compone qualcosa che ESCE,
   chi decide i suoi numeri?* Qui la risposta era **no**: la lista faceva
   `byId[a.responsabileId]` e l'export del CSV teneva la sua terza copia
   (`const nome = (id) => …` dentro la funzione d'export). Tutt'e due
   rispondevano «da assegnare» a un id che punta a qualcuno **non più in
   anagrafica** — cioè dicevano che nessuno se ne occupa di un'azione che un
   responsabile ce l'ha, e lo dicevano anche al foglio che va all'ispettore.
   E il percorso che ci porta è ordinario: si toglie un lavoratore
   dall'anagrafica e le sue azioni restano, con l'id dentro.
   La decisione (quale dei cinque stati) sta in `shared/dw-ponti.js` perché la
   condivide con Sentinella; qui c'è solo come Scudo la scrive.
   Due campi perché due consumatori, **una decisione sola**:
     · `testo` — la riga della lista, con «resp.» davanti al nome;
     · `nome`  — la cella del CSV, senza prefisso.
   `noto` resta a `false` solo quando la risposta è un non-so: in Scudo non
   succede mai (la sua anagrafica se la legge in casa), e sta qui perché la
   funzione è la stessa che serve ai ponti. */
export function etichettaResponsabile(azione, lavoratori) {
  const s = statoResponsabile(azione, lavoratori);
  if (s.stato === "trovato") return { testo: "resp. " + s.nome, nome: s.nome, stato: s.stato, noto: true };
  if (s.stato === "assente") return { testo: "responsabile da assegnare", nome: "da assegnare", stato: s.stato, noto: true };
  if (s.stato === "senza-nome") return { testo: "responsabile senza nome in anagrafica",
    nome: "senza nome in anagrafica", stato: s.stato, noto: true };
  return { testo: "responsabile non più in anagrafica", nome: "non più in anagrafica",
    stato: s.stato, noto: s.noto };
}

// Azioni ancora da chiudere che sono scadute o in scadenza: sono quelle che
// devono entrare nel semaforo del Quadro e nello scadenzario, prima le più
// urgenti. Pura e testabile; `oggi` iniettabile.
export function azioniUrgenti(azioni, oggi = new Date()) {
  return (azioni || [])
    .filter(a => a.stato !== "chiusa" && a.scadenza && statoAzione(a, oggi) !== "regolare")
    .sort((a, b) => (a.scadenza < b.scadenza ? -1 : a.scadenza > b.scadenza ? 1 : 0));
}
// Riepilogo per la testata della pagina Azioni e per i KPI del Quadro.
export function riepilogoAzioni(azioni, oggi = new Date()) {
  const list = azioni || [];
  const aperte = list.filter(a => a.stato !== "chiusa");
  const scadute = aperte.filter(a => statoAzione(a, oggi) === "scaduta").length;
  const inScadenza = aperte.filter(a => statoAzione(a, oggi) === "in-scadenza").length;
  return {
    totale: list.length,
    aperte: list.filter(a => (a.stato || "aperta") === "aperta").length,
    inCorso: list.filter(a => a.stato === "in-corso").length,
    chiuse: list.filter(a => a.stato === "chiusa").length,
    daChiudere: aperte.length, scadute, inScadenza,
  };
}
// Azioni generate da un evento del registro (per risalire evento → azioni).
export function azioniDiEvento(azioni, eventoId) {
  if (!eventoId) return [];
  return (azioni || []).filter(a => a.origineTipo === "evento" && a.origineId === eventoId);
}
// Azioni nate dalle voci non conformi di un'ispezione (ispezione → azioni).
export function azioniDiIspezione(azioni, ispezioneId) {
  if (!ispezioneId) return [];
  return (azioni || []).filter(a => a.origineTipo === "ispezione" && a.origineId === ispezioneId);
}

// ── Azioni che arrivano dall'AMBIENTE (Sentinella) ────────────────────
// Un superamento di soglia o il reclamo di un residente non sono un
// problema "di un'altra app": chiedono un responsabile e una data come
// ogni altra azione correttiva, e vivono nello stesso scadenzario. Queste
// due funzioni servono solo a RICONOSCERLE, per scrivere l'origine giusta
// e per non farla cancellare da una modifica fatta dal form.
export const ORIGINI_AMBIENTE = ["superamento", "reclamo"];
export function daAmbiente(a) {
  return ORIGINI_AMBIENTE.includes(String((a || {}).origineTipo || ""));
}
// Etichetta breve dell'origine ambientale, per il badge nell'elenco.
export function etichettaAmbiente(a) {
  return (a || {}).origineTipo === "reclamo" ? "Reclamo" : "Superamento";
}
// ── Azioni che arrivano dalla PRODUZIONE (Campo) ──────────────────────
// Un fermo di produzione registrato al fronte — «frantoio intasato, 55 minuti»
// — chiede un responsabile e una data come ogni altra azione correttiva, e
// vive nello stesso scadenzario. È il gemello del ponte con Sentinella, e la
// ragione per cui questa provenienza esiste è che senza di lei Scudo la
// raccontava come una NON CONFORMITÀ: la riga cadeva nell'ultimo ramo di
// `origineTesto`, e un fermo di macchina non è una non conformità.
// ⚠️ La parola è scritta anche qui perché Scudo non può importare il modulo di
// Campo (l'isolamento dello SDK è per organizzazione E per app): è la stessa
// scelta già presa per `ORIGINI_AMBIENTE`. La difesa è la prova che pretende
// `scudo.ORIGINI_CAMPO` e `campo.ORIGINE_FERMO` uguali.
export const ORIGINI_CAMPO = ["fermo"];
export function daCampo(a) {
  return ORIGINI_CAMPO.includes(String((a || {}).origineTipo || ""));
}
/* DA DOVE NASCE UN'AZIONE, DECISO IN UN POSTO SOLO (07/08).
   ═══════════════════════════════════════════════════════════════════════
   ⛔ ERANO DUE FUNZIONI: `origineTesto` disegnava la riga a schermo e `orig`
   componeva la colonna `origine` del CSV delle azioni correttive — la copia
   debole che CLAUDE.md descrive, nel posto esatto in cui la descrive («dove
   questa app compone qualcosa che ESCE, chi decide i suoi numeri?»).
   Misurato premendo il bottone e aprendo il file, sui 17 casi che l'origine
   di un'azione può avere: **30 testi identici su 34 e 4 divergenti**, e tutti
   e quattro erano difetti veri, in DUE VERSI OPPOSTI.
     · il FILE era più povero (3 casi) — il ramo `daCampo` non c'era, quindi
       un'azione nata da un FERMO DI PRODUZIONE cadeva nell'ultimo ramo e il
       CSV la chiamava «non conformità: Fermo di produzione (Campo) — Frantoio
       intasato…». È precisamente l'errore che lo schermo aveva corretto il
       03/08, con scritto accanto il motivo: «un fermo di macchina non è una
       non conformità, e finisce davanti a un ispettore» — e il documento che
       finisce davanti all'ispettore è questo file, non lo schermo. Senza
       `origineNota` era anche peggio: colonna VUOTA, cioè un'azione nata da
       niente in un foglio di conformità;
     · lo SCHERMO era più povero (1 caso) — su un'ispezione TOLTA dall'archivio
       scriveva «da un'ispezione rimossa» e buttava via `origineNota`, che per
       le azioni nate da ispezione è il testo della voce non conforme
       (`origineNota: v.nota || v.testo`), cioè l'UNICA traccia rimasta di che
       cosa era stato trovato. Il file quella coda la scriveva già.
   ⛔ E LE DUE VOCI RESTANO DUE, con un PARAMETRO invece di due corpi: è la
   regola «una copia nasce quasi sempre da una firma troppo stretta». La
   differenza è vera e voluta — in una riga di elenco si legge «da ispezione
   «Fronte di cava» del 10/07/2026», in una colonna che si chiama già
   `origine` il «da» è rumore e le virgolette basse le mangia il foglio di
   calcolo; e la voce del documento porta anche la DESCRIZIONE dell'evento,
   perché chi apre il CSV non ha l'app davanti per andarsela a cercare.
   `voce: "documento"` per il file, tutto il resto per lo schermo.
   ⚠️ `ctx` prende gli ELENCHI e non due mappe già fatte: la pagina le mappe
   ce le ha (`infById`, `ispById`) ma il CSV no, e chiedere a chi chiama di
   costruirle sarebbe far decidere a lui una cosa che non lo riguarda.
   Pura e testabile. */
export function origineAzione(azione, ctx = {}, opts = {}) {
  const a = azione || {};
  const doc = opts.voce === "documento";
  const infortuni = ctx.infortuni || [], ispezioni = ctx.ispezioni || [];
  /* la fotografia che l'azione si porta dietro dalle altre app: è testo
     scritto in italiano, e quando c'è vince su qualunque frase generica */
  const nota = String(a.origineNota == null ? "" : a.origineNota).trim();
  const coda = nota ? " — " + nota : "";
  const quando = (iso, prep) => iso ? " " + prep + " " + dataIt(iso) : "";

  if (daAmbiente(a)) return nota || (doc
    ? etichettaAmbiente(a) + " (Sentinella)" + quando(a.origineData, "del")
    : (a.origineTipo === "reclamo" ? "da un reclamo" : "da un superamento di soglia")
      + " registrato in Sentinella" + quando(a.origineData, "il"));

  if (daCampo(a)) return nota || (doc
    ? "fermo di produzione (Campo)" + quando(a.origineData, "del")
    : "da un fermo di produzione registrato in Campo" + quando(a.origineData, "il"));

  if (a.origineTipo === "evento") {
    const e = infortuni.find(x => x && x.id === a.origineId);
    /* ⛔ `coda` anche qui, per la stessa ragione dell'ispezione: se un giorno
       un'azione nata da un evento porterà una nota, sparire non è un'opzione.
       Oggi non ne porta (`origineNota: daEvento ? "" : nota`), quindi questa
       riga non cambia nessun testo — è la difesa, non una funzione nuova. */
    if (!e) return (doc ? "evento non più in archivio" : "da un evento rimosso dal registro") + coda;
    return doc
      ? (e.tipo || "evento") + " del " + dataIt(e.data) + (e.descrizione ? " — " + e.descrizione : "")
      : "da " + (e.tipo === "infortunio" ? "infortunio" : "near-miss") + " del " + dataIt(e.data);
  }

  if (a.origineTipo === "ispezione") {
    const i = ispezioni.find(x => x && x.id === a.origineId);
    if (!i) return (doc ? "ispezione non più in archivio" : "da un'ispezione rimossa") + coda;
    return (doc ? "ispezione " + i.nome + " del " + dataIt(i.data)
                : "da ispezione «" + i.nome + "» del " + dataIt(i.data)) + coda;
  }

  return nota ? "non conformità: " + nota : "";
}

/* COME SI CHIAMA UNA SCADENZA, DECISO IN UN POSTO SOLO (07/08).
   ═══════════════════════════════════════════════════════════════════════
   ⛔ TRE SUPERFICI, TRE RISPOSTE DIVERSE, e la più povera era la STAMPA — il
   verso che nessuno cerca. Una riga dello scadenzario ha due campi: `tipo`,
   che è la FAMIGLIA («Formazione», «Patente», «Visita medica»), e
   `descrizione`, che è l'adempimento vero («Aggiornamento formazione
   lavoratori», «Fochino — abilitazione brillamento mine»).
   Lo scadenzario a schermo e il CSV del personale scrivevano `descrizione`;
   la CARTELLA DEL LAVORATORE — cioè il fascicolo che si esibisce
   all'ispettore — scriveva `tipo || "—"`. Misurato premendo il bottone sulla
   dimostrazione, per Mario Rossi: due obblighi distinti uscivano dalla
   stampante come due righe IDENTICHE, «Formazione 30/05/2029 · regolare»
   ripetuta due volte, e il patentino di fochino usciva «Patente». È la stessa
   famiglia della chiave interna stampata al posto dell'etichetta dei DPI,
   corretta il 03/08 due sezioni più in là dello stesso foglio.
   ⛔ E NESSUNA DELLE TRE ERA GIUSTA SUL CASO LIMITE: una scadenza importata
   da CSV può avere `descrizione: null` e `tipo: "Altro"` (lo scrive
   `parseScadenzeCsv`). Lì schermo e file lasciavano il nome VUOTO, e la
   stampa scriveva «—» — che su un foglio si legge «non serve», la decisione
   14 di questo stesso file. La regola vera le contiene tutt'e tre: la
   descrizione se c'è, se no la famiglia, e se non c'è nemmeno quella lo si
   DICE invece di lasciare il bianco.
   Pura e testabile. */
export function etichettaScadenza(scadenza) {
  const s = scadenza || {};
  const d = String(s.descrizione == null ? "" : s.descrizione).trim();
  if (d) return d;
  const t = String(s.tipo == null ? "" : s.tipo).trim();
  return t || "scadenza senza descrizione";
}

// Quante azioni ambientali ci sono e come stanno: serve alla riga di
// riepilogo della pagina Azioni. Compatibilità: senza nessuna, tutti zero.
export function riepilogoAmbiente(azioni) {
  const l = (azioni || []).filter(daAmbiente);
  return {
    totale: l.length,
    superamenti: l.filter(a => a.origineTipo === "superamento").length,
    reclami: l.filter(a => a.origineTipo === "reclamo").length,
    daChiudere: l.filter(a => a.stato !== "chiusa").length,
  };
}

// ============================================================
// S2 · SEGNALAZIONE RAPIDA DEI NEAR-MISS
// Un mancato infortunio si segnala in piedi sul piazzale, con i guanti,
// in pochi secondi — o non lo segnala nessuno. Le liste servono proprio a
// questo: si TOCCA una categoria e un luogo invece di scrivere, e la
// segnalazione è già completa. Restano modificabili con il campo libero,
// perché nessun elenco copre tutte le cave.
//
// ⛔ IL VOCABOLARIO E IL COMPOSITORE DEL RECORD VIVONO IN `shared/dw-ponti.js`,
// dal 03/08, e qui si RI-ESPORTANO coi nomi con cui Scudo li ha sempre
// chiamati — un alias non è una seconda implementazione. La ragione è che da
// oggi il near-miss si segnala anche da CAMPO, cioè dall'app che ha in mano
// chi sta al fronte: una seconda copia di questo elenco sarebbe due
// vocabolari che divergono, e una categoria che esiste di qua e non di là
// finisce nel riepilogo aggregato come «Non classificato» — un dato perso in
// silenzio, dentro il documento che chiede la L. 198/2025.
// `bozzaNearMiss` è il compositore UNICO del record `infortuni/{id}`: prima
// lo componeva a mano `inviaSegnalazione` in index.html, e con due pagine che
// scrivono lo stesso documento sarebbe stata la famiglia di difetti misurata
// il 03/08 — «dove il documento si compone».
// ============================================================
export {
  NEARMISS_CATEGORIE, NEARMISS_LUOGHI, CHI_SEGNALA,
  categoriaNearMiss, luogoNearMiss, descrizioneNearMiss, bozzaNearMiss,
} from "../../shared/dw-ponti.js";
/* ⚠️ E L'`import` SERVE DAVVERO, non è un doppione della riga qui sopra:
   `export … from` RI-ESPORTA, non LEGA — il nome non esiste dentro questo
   file. `riepilogoNearMiss`, dodici righe più in giù, chiama
   `categoriaNearMiss` e `luogoNearMiss`: senza questa riga morirebbe con
   «categoriaNearMiss is not defined». È lo stesso inciampo già pagato in
   `apps/campo/campo-data.js` con `statoRisposta`, scritto lì nel commento. */
import { categoriaNearMiss, luogoNearMiss } from "../../shared/dw-ponti.js";

// Riepilogo AGGREGATO dei near-miss del periodo (L. 198/2025: dati aggregati
// sugli eventi *e* sulle azioni correttive adottate). Conta il periodo scelto
// in giorni (null = tutto lo storico), raggruppa per categoria e per luogo e
// dice quante segnalazioni hanno prodotto un'azione correttiva.
// `pochi` è vero quando i numeri sono troppo bassi per leggerci una tendenza:
// in quel caso l'interfaccia lo dice invece di disegnare grafici che
// suggeriscono andamenti inesistenti. Pura e testabile; `oggi` iniettabile.
/* ⛔ SOTTO QUESTA SOGLIA NON SI LEGGE UNA TENDENZA, e la soglia sta in UN POSTO
   SOLO. Era scritta a mano dentro `riepilogoNearMiss` (`list.length < 5`), e
   serviva anche all'analisi delle cause: ricopiarla avrebbe voluto dire due
   numeri che divergono al primo ripensamento, con due schermate della stessa
   app che dicono «pochi dati» a soglie diverse. */
export const MIN_TENDENZA = 5;
export function troppoPochiPerTendenza(quanti) { return (+quanti || 0) < MIN_TENDENZA; }

/* ⛔ LA FINESTRA DEL PERIODO E L'ETICHETTA DEL LUOGO STANNO QUI, UNA VOLTA SOLA.
   Erano scritte dentro `riepilogoNearMiss`; da quando le usa anche il riepilogo
   della GRAVITÀ POTENZIALE sarebbero due copie della stessa regola — la forma
   di difetto che in questo repository è già costata una giornata. Non sono
   esportate perché non servono fuori: la regola sta in un posto solo dentro il
   file che la usa. */
function dentroFinestraNM(x, giorni, oggi) {
  if (giorni == null) return true;
  const g = giorniTra((x || {}).data, oggi);   // negativo = nel passato
  return Number.isFinite(g) && g <= 0 && -g <= giorni;
}
// Il luogo può arrivare da un tocco (luogoTipo) o essere scritto a mano nel
// registro di sempre (luogo): il conteggio tiene buoni tutti e due.
function etichettaLuogoNM(x) {
  return luogoNearMiss((x || {}).luogoTipo) || String((x || {}).luogo || "").trim() || "Luogo non indicato";
}

export function riepilogoNearMiss(infortuni, azioni, giorni = 90, oggi = new Date()) {
  const tutti = (infortuni || []).filter(x => x.tipo === "near-miss");
  const list = tutti.filter(x => dentroFinestraNM(x, giorni, oggi));
  const raggruppa = (etichettaDi) => {
    const per = {};
    for (const x of list) {
      const lab = etichettaDi(x);
      per[lab] = (per[lab] || 0) + 1;
    }
    return Object.entries(per).map(([etichetta, valore]) => ({ etichetta, valore }))
      .sort((a, b) => b.valore - a.valore || a.etichetta.localeCompare(b.etichetta, "it"));
  };
  const perTipo = raggruppa(x => categoriaNearMiss(x.categoria) || "Non classificato");
  const perLuogo = raggruppa(etichettaLuogoNM);
  const ids = new Set(list.map(x => x.id));
  const azi = (azioni || []).filter(a => a.origineTipo === "evento" && ids.has(a.origineId));
  const conAzione = new Set(azi.map(a => a.origineId)).size;
  const anonime = list.filter(x => x.anonimo).length;
  return {
    giorni, totale: list.length, totaleStorico: tutti.length,
    perTipo, perLuogo, anonime,
    conAzione, senzaAzione: list.length - conAzione,
    azioni: azi.length, azioniChiuse: azi.filter(a => a.stato === "chiusa").length,
    pochi: troppoPochiPerTendenza(list.length),
  };
}

/* ⛔ COME VA LETTO IL RIEPILOGO, e sta qui perché il FILE che esce e lo
   SCHERMO devono dirlo con la stessa voce (03/08).
   Davanti a pochi eventi la pagina si rifiuta di disegnare le due classifiche
   e scrive «non c'è una tendenza da leggere, e disegnarla sarebbe una bugia»;
   il CSV del riepilogo — quello che serve alla comunicazione prevista dalla
   L. 198/2025 — scriveva le stesse righe «tipo» e «luogo» in fila, **senza una
   parola**, e chi lo apre non ha modo di sapere che sono tre puntini.
   Stessa cosa, peggiore, col periodo vuoto: `totale = 0` usciva come «nessun
   near-miss segnalato», e la pagina invece dice quanti ce ne sono NELLO
   STORICO. Un file che va a un ente non può dire «zero» dove l'app sa «zero in
   questi 90 giorni, N prima»: è il principio del fondatore — l'assenza di un
   dato non è un dato favorevole.
   Legge `pochi`, che altrimenti nel documento non lo guardava nessuno. */
export function descriviLetturaNearMiss(riepilogo) {
  const x = riepilogo || {};
  const t = +x.totale || 0;
  if (t === 0) {
    const s = +x.totaleStorico || 0;
    return s
      ? "Nessuna segnalazione nel periodo scelto. Non vuol dire che non sia successo niente: "
        + "nello storico ce ne sono " + s + ". Allarga il periodo per vederle."
      : "Nessun near-miss registrato. Un registro vuoto non vuol dire che non succeda niente: "
        + "vuol dire che non si segnala.";
  }
  if (x.pochi)
    /* ⚠️ IL VERBO STAVA FUORI DAL TERNARIO, e con una segnalazione sola la
       frase usciva «1 segnalazione SONO meno di 5» — anche nel CSV che si
       manda fuori. Il singolare c'era: era il verbo a non averlo. */
    return "ATTENZIONE alla lettura: " + conta(t, "segnalazione", "segnalazioni")
      + plurale(t, " è", " sono") + " meno di " + MIN_TENDENZA + ", la soglia sotto la quale l'app non disegna nessuna "
      + "classifica. Le righe «tipo» e «luogo» qui sotto sono un conteggio, non una tendenza.";
  return "";
}

// ============================================================
// S2b · LA GRAVITÀ POTENZIALE — «e se fosse andata male?»
//
// Il registro dei near-miss raccoglie che cosa è successo, dove, chi segnala e
// che cosa si è fatto per correggerlo. Non raccoglie la cosa che trasforma un
// elenco di episodi in qualcosa che sa dire DOVE IL RISCHIO SI CONCENTRA: un
// masso caduto a due metri da un uomo e un masso caduto in un piazzale deserto
// sono lo stesso «evento», e non sono lo stesso rischio. Contati insieme, il
// secondo diluisce il primo — ed è il primo quello per cui il registro esiste.
//
// ⛔ NON È UN ADEMPIMENTO E NON VA RACCONTATO COME TALE. Nessuna legge citata
// da Scudo chiede la gravità potenziale: è una SCELTA DI PRODOTTO, si difende
// da sola e i testi la presentano come tale. Qui dentro non si scrivono
// articoli, non si nominano norme e non si inventano termini.
//
// ⛔ E IL VINCOLO DI DISEGNO VIENE PRIMA DEL CODICE: «NON LO SO» È UNO STATO
// DICHIARABILE, NON IL VALORE PIÙ BASSO. Chi segnala di corsa sul piazzale
// spesso non sa dire che cosa sarebbe successo, e un registro che lo costringe
// a scegliere raccoglie un numero INVENTATO — peggio di una cella vuota,
// perché poi qualcuno ci fa una media e la media ha la faccia tranquilla.
// Da lì tre conseguenze, e sono le tre che questo blocco deve rispettare:
//   1. la gravità potenziale è FACOLTATIVA, e non averla è uno stato che l'app
//      sa raccontare (`descriviPotenziale`), non un buco;
//   2. ogni numero aggregato dichiara su quanti episodi è calcolato e quanti
//      non sono valutati, e risponde `null` — non zero, non «lieve» — quando
//      non si può dire;
//   3. la parola e il colore di «non valutata» non sono quelli di «lieve»:
//      sono cose diverse e vanno viste diverse (pastiglia neutra `tag`, non
//      `info`), ed è la pagina a doverlo rispettare.
//
// ⚠️ LA SCALA RIUSA LE PAROLE DI CASA, e la terza è dichiarata. `lieve` e
// `grave` sono le stesse due parole con cui Scudo classifica gli infortuni
// VERI (campo `gravita`): non se ne inventano di nuove per una cosa che esiste.
// `mortale` è il gradino che la scala degli infortuni non ha — e non ce l'ha
// per una ragione che qui non vale: quella scala descrive un danno AVVENUTO,
// questa descrive un danno EVITATO, e l'unica risposta per cui vale la pena
// tenere il registro è proprio «ci scappava il morto». Senza quel gradino la
// funzione non risponderebbe alla domanda per cui è stata scritta.
// ============================================================
/* Vocabolario CHIUSO, dal meno al più grave. `ordine` serve al confronto e
   all'ordinamento — mai la posizione nell'array, che il primo riordino
   cambierebbe in silenzio. `cls` è la pastiglia con cui la pagina lo disegna:
   sta qui e non nella pagina perché una mappa parallela nella pagina è
   esattamente il difetto della regola 18 (una funzione che sa dire N stati e
   una mappa che ne disegna N−1 uccide la pagina al disegno). Portandosi il
   proprio colore, il livello non ha nessuna mappa da tenere allineata. */
export const GRAVITA_POTENZIALE = [
  /* ⚠️ «lieve» NON usa `info`, e la ragione è stata TROVATA IN UNO SCATTO,
     non leggendo il codice: `shared/dw-app-ui.css` ha `.info{flex:1 1 120px}`
     — la colonna di testo di ogni riga di lista, usata 36 volte nella sola
     pagina di Scudo. Una pastiglia `badge info` eredita quel `flex` (nessuno
     dei due la contraddice) e si ALLARGA a metà riga: «LIEVE 2» prendeva 460
     px accanto a «GRAVE 1» da 120. Nessun errore, nessuna prova rossa, e
     leggendo il codice non si vede. La lezione è più larga del caso: il
     vocabolario delle pastiglie e quello dell'IMPIANTO di pagina vivono nello
     stesso spazio di nomi, e `info` appartiene già al secondo. */
  { chiave: "lieve",   ordine: 1, etichetta: "Lieve",   cls: "ok",
    domanda: "Una medicazione, nessun giorno di assenza" },
  { chiave: "grave",   ordine: 2, etichetta: "Grave",   cls: "warn",
    domanda: "Un infortunio con giorni di assenza" },
  { chiave: "mortale", ordine: 3, etichetta: "Mortale", cls: "danger",
    domanda: "Ci scappava il morto, o un'invalidità permanente" },
];
/* Da quale gradino in su un near-miss «poteva finire con un infortunio». Sta
   in una costante perché la usano il conteggio, la classifica per luogo e la
   frase: tre copie dello stesso `>= 2` divergono al primo ripensamento. */
export const ORDINE_POTENZIALE_ALTO = 2;

/* Il livello di un evento, oppure `null` se non è stato valutato.
   ⛔ UN VALORE CHE NON STA NEL VOCABOLARIO VALE «NON VALUTATO», MAI «LIEVE».
   Ci si arriva con un import o con un dato vecchio, ed è la direzione che
   conta: farlo scivolare sul gradino più basso sarebbe il numero tranquillo
   costruito su una parola che nessuno sa leggere. */
export function potenzialeDi(evento) {
  const c = String(((evento || {}).gravitaPotenziale) || "").trim();
  return GRAVITA_POTENZIALE.find((g) => g.chiave === c) || null;
}

/* La frase per la riga del registro, ed è il consumatore della non-misurabilità
   di un evento singolo: senza di lei «non valutata» resterebbe un `null` che
   nessuno racconta.
   ⚠️ Risponde `""` per tutto ciò che non è un near-miss, e non è una svista:
   di un infortunio VERO si sa già che cosa è successo, quindi chiedergli come
   poteva finire non ha senso — e scrivergli accanto «non valutata» sarebbe
   accusarlo di una mancanza che non ha. */
export function descriviPotenziale(evento) {
  if (((evento || {}).tipo) !== "near-miss") return "";
  const g = potenzialeDi(evento);
  return g ? "se andava male: " + g.etichetta.toLowerCase() : "gravità potenziale non valutata";
}

/* DOVE IL RISCHIO SI CONCENTRA, e quanto di quella risposta è misurato.
   Guarda solo i near-miss (per la ragione scritta in `descriviPotenziale`) e
   solo quelli dentro il periodo, con la stessa finestra del riepilogo
   aggregato — `dentroFinestraNM`, chiamata e non ricopiata.
   Le tre risposte che possono valere `null` invece di un numero tranquillo:
     · `quotaAlto` — una percentuale su meno di MIN_TENDENZA valutati è una
       misura su un campione di uno o due: «100% ad alto potenziale» con un
       solo episodio valutato è la bugia più convincente che questa funzione
       potrebbe dire;
     · `dove` — la classifica per luogo, `null` sotto la soglia E `null` quando
       nessun luogo ha nemmeno un episodio sopra il gradino: senza quello non
       c'è niente da concentrare, e la prima riga uscirebbe lo stesso portandosi
       dietro la frase «in testa c'è Fronte con 0 episodi che potevano finire
       male» (misurato in prova, prima di scrivere qui);
     · `piuAlto` — `null` finché nessuno ha valutato niente.
   ⛔ E I LUOGHI CON ZERO VALUTATI NON ENTRANO NELLA CLASSIFICA: un luogo con
   cinque episodi che nessuno ha valutato non è un luogo sicuro, è un luogo non
   misurato. Se finisse in fondo alla classifica lo si leggerebbe come il più
   tranquillo — l'assenza di un dato letta come un dato favorevole. Escono in
   `luoghiCiechi`, con quanti episodi hanno, e la pagina li mostra a parte.
   `noto` è vero solo quando c'è almeno un episodio E sono valutati tutti: con
   zero episodi «tutti valutati» sarebbe la parola tranquilla sulla scatola
   vuota. Pura e testabile; `oggi` iniettabile. */
export function riepilogoPotenziale(infortuni, giorni = 90, oggi = new Date()) {
  const tutti = (infortuni || []).filter((x) => x && x.tipo === "near-miss");
  const list = tutti.filter((x) => dentroFinestraNM(x, giorni, oggi));
  const val = list.filter((x) => potenzialeDi(x));
  const leggibile = !troppoPochiPerTendenza(val.length);
  /* ⛔ SENZA NEMMENO UN EPISODIO NON SI RESTITUISCE LA SCALA, e a pretenderlo è
     stata `sonda-vuoto.mjs` — non l'ho visto io. Chiamata a vuoto, questa
     funzione rispondeva con le tre righe a zero, e ognuna si portava dietro la
     propria pastiglia: `cls: "ok"` (una risposta TRANQUILLA) e `cls: "danger"`
     (un ALLARME) su un registro in cui non è successo niente. Sullo schermo non
     si vedeva — la pagina non disegna niente con zero episodi — ma la funzione
     è pubblica, e la prossima che la disegnasse si troverebbe un verde e un
     rosso dove nessuno ha misurato. Zero episodi non è «tutti lievi»: è che non
     c'è nessuna ripartizione. Con episodi ma nessuna valutazione le tre righe
     restano, e stanno accanto al conto dei non valutati: lì gli zeri hanno il
     loro denominatore a fianco. */
  const perLivello = list.length === 0 ? [] : GRAVITA_POTENZIALE.map((g) => ({
    chiave: g.chiave, etichetta: g.etichetta, cls: g.cls,
    quanti: val.filter((x) => potenzialeDi(x).chiave === g.chiave).length,
  }));
  const alto = val.filter((x) => potenzialeDi(x).ordine >= ORDINE_POTENZIALE_ALTO).length;
  const piuAlto = GRAVITA_POTENZIALE.slice().reverse()
    .find((g) => val.some((x) => potenzialeDi(x).chiave === g.chiave)) || null;
  const quotaAlto = leggibile ? Math.round((alto * 1000) / val.length) / 10 : null;

  const per = new Map();
  for (const x of list) {
    const et = etichettaLuogoNM(x);
    if (!per.has(et)) per.set(et, { etichetta: et, eventi: 0, valutati: 0, nonValutati: 0, alto: 0, piuAlto: null });
    const r = per.get(et);
    r.eventi++;
    const g = potenzialeDi(x);
    if (!g) { r.nonValutati++; continue; }
    r.valutati++;
    if (g.ordine >= ORDINE_POTENZIALE_ALTO) r.alto++;
    if (!r.piuAlto || g.ordine > r.piuAlto.ordine) r.piuAlto = g;
  }
  const righe = [...per.values()];
  /* La guardia su `piuAlto` non è ridondante perché il filtro viene prima: è
     una difesa che oggi non serve e che sopravvive al primo riordino, ed è la
     lezione già pagata in `bozzaNearMiss` di `shared/`. */
  const ord = (r) => (r.piuAlto ? r.piuAlto.ordine : 0);
  const perLuogo = righe.filter((r) => r.valutati > 0)
    .sort((a, b) => b.alto - a.alto || ord(b) - ord(a)
      || b.valutati - a.valutati || a.etichetta.localeCompare(b.etichetta, "it"));
  const luoghiCiechi = righe.filter((r) => r.valutati === 0)
    .sort((a, b) => b.eventi - a.eventi || a.etichetta.localeCompare(b.etichetta, "it"))
    .map((r) => ({ etichetta: r.etichetta, eventi: r.eventi }));

  return {
    giorni, eventi: list.length, totaleStorico: tutti.length,
    valutati: val.length, nonValutati: list.length - val.length,
    perLivello, alto, quotaAlto, piuAlto, perLuogo, luoghiCiechi,
    dove: leggibile && perLuogo[0] && perLuogo[0].alto > 0 ? perLuogo[0] : null,
    /* bandiera: ce n'è abbastanza da poterci leggere qualcosa. Non vuol dire
       «ci sono dati» — è la stessa distinzione di `causeRicorrenti`. */
    leggibile,
    /* bandiera: la gravità potenziale è scritta su TUTTI gli episodi del
       periodo. Quando è falsa ogni conteggio qui dentro è un MINIMO. */
    noto: list.length > 0 && val.length === list.length,
  };
}

/* Come va letto quel riepilogo — e sta nel modulo, non nella pagina, perché lo
   SCHERMO e il FILE che esce devono dirlo con la stessa voce (è la regola già
   scritta per `descriviLetturaNearMiss`). È anche il posto in cui le bandiere
   `leggibile` e `noto` vengono LETTE: senza questa funzione sarebbero due
   guardie scollegate, cioè dichiarazioni che non proteggono niente. */
export function descriviRischioPotenziale(riepilogo) {
  const r = riepilogo || {};
  const ev = +r.eventi || 0, val = +r.valutati || 0, non = +r.nonValutati || 0;
  if (ev === 0) {
    const s = +r.totaleStorico || 0;
    return s
      ? "Nessun near-miss nel periodo scelto: non c'è niente di cui dire come poteva finire. "
        + "Nello storico ce n'" + (s === 1 ? "è 1" : "sono " + s) + "."
      : "Nessun near-miss registrato: la gravità potenziale non ha ancora niente da misurare.";
  }
  if (val === 0)
    return "Nessuno dei " + ev + " near-miss del periodo ha una gravità potenziale scritta, quindi "
      + "dove il rischio si concentra NON si può dire. Non vuol dire che sia basso: vuol dire che "
      + "non l'ha valutato nessuno. Scriverla è facoltativo, e si fa in un tocco dal registro.";
  const testa = non
    ? val + " near-miss su " + ev + (val === 1 ? " ha" : " hanno") + " la gravità potenziale scritta, "
      + non + " no. "
    : (ev === 1 ? "L'unico near-miss del periodo ha la gravità potenziale scritta. "
                : "Tutti e " + ev + " i near-miss del periodo hanno la gravità potenziale scritta. ");
  if (!r.leggibile)
    /* ⛔ IL VERBO STAVA FUORI DAL TERNARIO, ed è la seconda volta in due giorni
       su questo stesso riepilogo: la testa qui sopra il singolare l'ha imparato
       («L'unico near-miss del periodo ha…») e la coda no, quindi con una sola
       valutazione usciva «L'unico near-miss del periodo ha la gravità
       potenziale scritta. SONO meno di 5». La frase esce anche nel CSV della
       L. 198/2025, cioè nel foglio che l'azienda consegna. */
    return testa + plurale(val, "È", "Sono") + " meno di " + MIN_TENDENZA + ": l'app non dice dove il rischio si concentra, "
      + "perché una classifica costruita su così pochi episodi sarebbe una bugia.";
  const d = r.dove;
  if (!d)
    return testa + "Nessuno di quelli valutati poteva finire con un infortunio: sono tutti «lieve». "
      + "È il conto di quello che è stato valutato, non di quello che è successo.";
  return testa + "Il rischio si concentra su " + d.etichetta + ": " + d.alto
    + (d.alto === 1 ? " episodio poteva" : " episodi potevano") + " finire con un infortunio, su "
    + d.valutati + " valutat" + (d.valutati === 1 ? "o" : "i")
    + (d.nonValutati ? " — e lì " + d.nonValutati + (d.nonValutati === 1 ? " non è valutato" : " non sono valutati") : "")
    + ".";
}

// ============================================================
// S3 · ISPEZIONI E CHECKLIST PERIODICHE
// Modelli riutilizzabili con le voci tipiche dell'attività estrattiva.
// Ogni voce ha un esito (conforme / non conforme / non applicabile) e una
// nota; le voci NON CONFORMI generano le azioni correttive di S1, già
// collegate all'ispezione. Le periodicità sono PROPOSTE (giorni), non
// verità di legge: le conferma l'RSPP con il DSS della cava.
// ============================================================
export const ESITI_ISPEZIONE = [
  { chiave: "conforme",     etichetta: "Conforme",       breve: "OK",  cls: "ok" },
  { chiave: "non-conforme", etichetta: "Non conforme",   breve: "NO",  cls: "danger" },
  { chiave: "na",           etichetta: "Non applicabile", breve: "N/A", cls: "tag" },
];
export function esitoLabel(chiave) {
  return ESITI_ISPEZIONE.find(e => e.chiave === chiave) || null;
}

export const MODELLI_ISPEZIONE = [
  {
    chiave: "sorveglianza", nome: "Giro di sorveglianza", ambito: "Tutta la cava",
    giorni: 1,
    riferimento: "D.Lgs 624/96 — il sorvegliante controlla i luoghi di lavoro dove si svolge l'attività.",
    voci: [
      "Fronti e piste percorribili, nessun pericolo evidente in vista",
      "Tutti indossano i DPI previsti (elmetto, gilet, scarpe, protettori udito)",
      "Nessun mezzo lasciato in posizione pericolosa o senza freno",
      "Segnaletica, sbarramenti e delimitazioni al loro posto",
      "Near-miss e anomalie del turno precedente presi in carico",
      "Presenza in cava di almeno un addetto a primo soccorso e antincendio",
    ],
  },
  {
    chiave: "fronte", nome: "Fronte di cava — stabilità e disgaggio", ambito: "Fronti",
    giorni: 30,
    riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: stabilità dei fronti, caduta massi e franamento; alimenta la relazione annuale di stabilità.",
    voci: [
      "Ciglio superiore libero da massi instabili e materiale sciolto",
      "Fascia di rispetto al ciglio delimitata e rispettata dai mezzi",
      "Nessun blocco in equilibrio precario sulla parete",
      "Altezza e pendenza dei gradoni come previsto nel DSS",
      "Unghia del fronte libera da accumuli che ostacolano il lavoro",
      "Nessuna fessura di trazione, venuta d'acqua o segno di movimento",
      "Disgaggio eseguito dopo l'ultima volata e dopo le piogge forti",
      "Accessi al fronte sbarrati e segnalati quando l'area non è operativa",
    ],
  },
  {
    chiave: "piste", nome: "Piste e viabilità interna", ambito: "Piste",
    giorni: 15,
    riferimento: "D.Lgs 81/08 titolo I e D.Lgs 624/96 — circolazione dei mezzi in sicurezza nei luoghi di lavoro.",
    voci: [
      "Larghezza della pista adeguata al mezzo più grande in uso",
      "Arginelli sui lati esposti presenti e integri",
      "Fondo e pendenza in ordine, senza solchi o cedimenti",
      "Segnaletica, limiti di velocità e precedenze visibili",
      "Abbattimento delle polveri (bagnatura) eseguito",
      "Incroci e punti ciechi con visibilità garantita",
      "Aree di manovra, carico e scarico delimitate",
      "Illuminazione sufficiente nei tratti usati con poca luce",
    ],
  },
  {
    chiave: "impianto", nome: "Impianto di lavorazione", ambito: "Frantoio e nastri",
    giorni: 30,
    riferimento: "D.Lgs 81/08 titolo III — protezione degli organi in movimento e uso in sicurezza delle attrezzature.",
    voci: [
      "Ripari fissi e mobili su pulegge, nastri e organi in movimento",
      "Funi e pulsanti di emergenza dei nastri funzionanti e raggiungibili",
      "Blocco della macchina in manutenzione (procedura di messa fuori servizio)",
      "Passerelle, scale e parapetti integri e sgombri",
      "Aspirazione e abbattimento polveri in funzione",
      "Quadri elettrici chiusi, accessibili e senza cavi volanti",
      "Nessun accumulo di materiale sotto nastri e tramogge",
      "Accesso a tramogge e spazi confinati regolato da permesso di lavoro",
    ],
  },
  {
    chiave: "mezzi", nome: "Mezzi e officina", ambito: "Mezzi",
    giorni: 30,
    riferimento: "D.Lgs 81/08 art. 71 e D.M. 11/04/2011 — controlli, manutenzione e verifiche periodiche delle attrezzature.",
    voci: [
      "Controllo giornaliero dei mezzi eseguito e registrato dagli operatori",
      "Cinture, cicalino e luci di retromarcia funzionanti",
      "Estintori a bordo controllati e in corso di validità",
      "Verifiche periodiche delle attrezzature di sollevamento in regola",
      "Nessuna perdita di olio o gasolio; area di rifornimento in ordine",
      "Attrezzature di officina con ripari e in buono stato",
      "Rifiuti, oli esausti e stracci raccolti nei contenitori dedicati",
      "DPI degli addetti disponibili, integri e della taglia giusta",
    ],
  },
  {
    chiave: "dpi-emergenza", nome: "DPI, emergenza e presidi", ambito: "Sito",
    giorni: 90,
    riferimento: "D.Lgs 81/08 artt. 43-46 e 77 — gestione dell'emergenza, primo soccorso e uso dei DPI.",
    voci: [
      "Cassetta di primo soccorso completa e nei termini di scadenza",
      "Estintori e idranti controllati, segnalati e raggiungibili",
      "Vie di fuga e punto di raccolta liberi e segnalati",
      "Numeri di emergenza e planimetrie esposti e leggibili",
      "Verbali di consegna DPI firmati e aggiornati",
      "Addestramento fatto per i DPI di III categoria e i protettori dell'udito",
      "Prova di emergenza dell'anno eseguita e verbalizzata",
    ],
  },
];

export function modelloIspezione(chiave) {
  return MODELLI_ISPEZIONE.find(m => m.chiave === chiave) || null;
}

// Record di una nuova ispezione a partire da un modello: le voci vengono
// COPIATE dentro l'ispezione, così un modello che cambia domani non riscrive
// le ispezioni già fatte (un controllo firmato non si modifica a posteriori).
export function nuovaIspezioneDaModello(chiave, { data, cantiereId, responsabileId, stato } = {}) {
  const m = modelloIspezione(chiave);
  if (!m) return null;
  return {
    modello: m.chiave, nome: m.nome, ambito: m.ambito,
    riferimento: m.riferimento || "", periodicitaGiorni: m.giorni || null,
    data: data || "", cantiereId: cantiereId || null, responsabileId: responsabileId || null,
    voci: m.voci.map((testo, i) => ({ id: "v" + (i + 1), testo })),
    esiti: {}, stato: stato || "in-corso", dataChiusura: null,
  };
}

// Conteggio degli esiti di un'ispezione (compresa la parte ancora da fare).
export function riepilogoIspezione(isp) {
  const voci = (isp && isp.voci) || [], esiti = (isp && isp.esiti) || {};
  let conformi = 0, nonConformi = 0, na = 0;
  for (const v of voci) {
    const e = esiti[v.id] && esiti[v.id].esito;
    if (e === "conforme") conformi++;
    else if (e === "non-conforme") nonConformi++;
    else if (e === "na") na++;
  }
  const totale = voci.length, fatte = conformi + nonConformi + na;
  return { totale, fatte, daFare: totale - fatte, conformi, nonConformi, na,
    completa: totale > 0 && fatte === totale,
    percento: totale ? Math.round(fatte / totale * 100) : 0 };
}

// Voci non conformi di un'ispezione, con la loro nota: sono quelle che
// diventano azioni correttive.
export function vociNonConformi(isp) {
  const esiti = (isp && isp.esiti) || {};
  return ((isp && isp.voci) || [])
    .filter(v => esiti[v.id] && esiti[v.id].esito === "non-conforme")
    .map(v => ({ id: v.id, testo: v.testo, nota: (esiti[v.id].nota || "").trim() }));
}

// Semaforo di un'ispezione: completata = regolare; programmata o in corso
// seguono la data con lo stesso schema dello scadenzario.
export function statoIspezione(isp, oggi = new Date()) {
  const i = isp || {};
  if (i.stato === "completata") return "regolare";
  // stessa correzione di `statoAzione`: un'ispezione programmata senza data non
  // è in ordine, è un'ispezione di cui non si sa quando va fatta
  return statoScadenza(i.data, oggi);
}

// Riepilogo per la testata della pagina Ispezioni.
/* ⛔ UNA VOCE SENZA ESITO NON È UNA VOCE CONFORME. Un'ispezione si può chiudere
   lasciandone indietro qualcuna — la modale di chiusura lo dice, «resteranno
   così» — ma da lì in poi non se ne trovava più traccia: nell'elenco restava il
   verde «Completata», e la testata contava le non conformi TROVATE. Zero non
   conformi su una checklist guardata a metà è il numero tranquillo di cui parla
   il principio: non è stato misurato niente, e il conto lo dice a posto.
   `senzaEsito` sono le voci mai giudicate dentro le ispezioni CHIUSE (in quelle
   ancora aperte è lavoro in corso, non una mancanza), `parziali` quante
   ispezioni ne hanno almeno una. */
export function riepilogoIspezioni(ispezioni, oggi = new Date()) {
  const list = ispezioni || [];
  const aperte = list.filter(i => i.stato !== "completata");
  const chiuse = list.filter(i => i.stato === "completata");
  return {
    totale: list.length,
    completate: chiuse.length,
    parziali: chiuse.filter(i => riepilogoIspezione(i).daFare > 0).length,
    senzaEsito: chiuse.reduce((s, i) => s + riepilogoIspezione(i).daFare, 0),
    daFare: aperte.length,
    scadute: aperte.filter(i => statoIspezione(i, oggi) === "scaduta").length,
    nonConformi: list.reduce((s, i) => s + riepilogoIspezione(i).nonConformi, 0),
  };
}

// ============================================================
// S3b · LA FOTO COME PROVA (eventi del registro e voci d'ispezione)
//
// Davanti a un near-miss o a una protezione mancante la prima cosa che si fa
// è tirare fuori il telefono, ed è la prima cosa che un ispettore chiede
// quando domanda «avete una prova?». Fino a oggi la graffetta esisteva solo
// sui DOCUMENTI: infortuni e ispezioni non avevano nessun campo per una foto.
//
// ⛔ LA REGOLA DELL'ALLEGATO NON SI RISCRIVE. «Questo file va bene?» è
// `controllaAllegato` di `shared/`, che Scudo importa già per i documenti e
// che usa anche Sentinella; «di che cosa è fatto questo dataURL?» è
// `pezziDataURL`. Qui c'è SOLO ciò che quelle due non sanno: quanto pesa una
// foto GIÀ SALVATA, e quanto spazio resta quando le foto sono più d'una.
//
// ⛔ IL NUMERO CHE HA DECISO «PIÙ D'UNA O UNA SOLA», misurato prima di
// scrivere una riga. Le foto viaggiano dentro il documento Firestore, che ha
// un tetto di 1.048.576 byte; il base64 cresce di un terzo, più i 23
// caratteri di «data:image/jpeg;base64,». Quindi:
//     1 foto da 400 KB →   546.159 byte di dataURL =  52,1% del tetto  ✅
//     2 foto da 400 KB → 1.092.318 byte            = 104,2% del tetto  ❌
// Due allegati al limite della singola NON stanno nel documento: la scrittura
// viene rifiutata e con essa TUTTO il record — l'evento, non solo la foto.
// Per questo il limite qui è sul TOTALE e non sulla singola foto, e il totale
// resta `LIMITE_ALLEGATO` (400 KB di file = 52,1% del tetto, metà documento
// libera per il resto). Le foto ammesse sono al massimo TRE: a 400 KB in tutto
// sono 133 KB l'una, che è l'ultima divisione in cui un fronte di cava resta
// leggibile ingrandendolo; una quarta casella prometterebbe uno spazio che il
// tetto non ha.
//
// ⛔ E PER L'ISPEZIONE IL TOTALE È DI TUTTA L'ISPEZIONE, non della voce: le
// voci di una checklist stanno in UN SOLO documento (`esiti: { voceId: … }`),
// quindi cinque voci fotografate al limite fanno 2,6 volte il tetto. È la
// trappola che `bilancioFotoVoce` esiste per chiudere.
//
// ⛔ L'ASSENZA DI UNA FOTO NON È UN DATO SFAVOREVOLE, e qui va guardata al
// verso opposto del solito: un infortunio senza foto non è «meno grave» né
// «mal documentato» — chi soccorre non fotografa, ed è giusto così. Non c'è
// nessun punteggio di completezza: `pastigliaFoto(0)` risponde `null`, cioè
// niente pastiglia e niente colore, e la pastiglia non ha MAI una classe
// d'allarme.
// ============================================================

// Quante foto si possono attaccare a un evento o a una voce d'ispezione.
export const MAX_FOTO = 3;
/* Sotto un kilobyte non ci sta nessuna foto: uno spazio residuo più piccolo
   di così vale zero. Serve anche a non dover riscrivere il «meno di 1 KB» di
   `controllaAllegato` — sopra questa soglia i KB arrotondati sono onesti. */
const SPAZIO_MINIMO_FOTO = 1024;

/* Quanto pesa il FILE dietro una foto già salvata, in byte, per poterlo
   confrontare con `LIMITE_ALLEGATO` (che è misurato su `file.size`).
   ⛔ Torna `null`, non `0`, quando il dataURL non si sa leggere: uno zero
   sarebbe un'assenza spacciata per «non occupa spazio», e il budget si
   sfonderebbe in silenzio portandosi dietro tutto il record. */
export function pesoFoto(f) {
  const pz = pezziDataURL(f && f.dataURL);
  if (!pz || !pz.base64) return null;
  const c = String(pz.contenuto || "");
  const corpo = c.replace(/=+$/, ""), pad = c.length - corpo.length;
  if (pad > 2 || c.length % 4 !== 0 || !/^[A-Za-z0-9+/]*$/.test(corpo)) return null;
  return Math.floor(c.length / 4) * 3 - pad;
}

// Le foto di un evento del registro (infortunio o near-miss).
export function fotoDiEvento(ev) {
  return (ev && Array.isArray(ev.foto) ? ev.foto : []).filter(f => f && f.dataURL);
}
// Le foto attaccate a UNA voce della checklist.
export function fotoDiVoce(isp, voceId) {
  const e = isp && isp.esiti && isp.esiti[voceId];
  return (e && Array.isArray(e.foto) ? e.foto : []).filter(f => f && f.dataURL);
}
/* TUTTE le foto di un'ispezione, con la voce a cui appartengono.
   ⚠️ Si scorrono gli ESITI, non le voci: una foto rimasta su una voce che il
   modello non ha più occupa spazio nel documento esattamente come le altre, e
   scorrendo `voci` non la vedrebbe nessuno — cioè il budget direbbe che c'è
   posto proprio quando non c'è. */
export function fotoDiIspezione(isp) {
  const esiti = (isp && isp.esiti) || {};
  const testo = Object.fromEntries(((isp && isp.voci) || []).map(v => [v.id, v.testo]));
  const out = [];
  for (const id of Object.keys(esiti)) {
    const e = esiti[id];
    if (!e || !Array.isArray(e.foto)) continue;
    for (const f of e.foto) if (f && f.dataURL)
      out.push(Object.assign({ voceId: id, voce: testo[id] || "" }, f));
  }
  return out;
}

/* Si può aggiungere un'altra foto? `condivise` sono le foto che stanno nello
   STESSO documento ma in un'altra casella (le altre voci dell'ispezione):
   contano nello spazio, non nel numero. La bandiera `misurabile` dichiara il
   caso in cui il conto non si può fare, e la legge `testoBilancioFoto`. */
export function bilancioFoto(foto, opts = {}) {
  const max = opts.max === undefined ? MAX_FOTO : opts.max;
  const limite = opts.limite === undefined ? LIMITE_ALLEGATO : opts.limite;
  const proprie = (Array.isArray(foto) ? foto : []).filter(Boolean);
  const condivise = (Array.isArray(opts.condivise) ? opts.condivise : []).filter(Boolean);
  let usati = 0, misurabile = true;
  for (const f of proprie.concat(condivise)) {
    const p = pesoFoto(f);
    if (p === null) misurabile = false; else usati += p;
  }
  const quante = proprie.length;
  const residuo = misurabile ? Math.max(0, limite - usati) : 0;
  const motivo = !misurabile ? "peso-illeggibile"
    : quante >= max ? "numero"
    : residuo < SPAZIO_MINIMO_FOTO ? "spazio" : "";
  return { quante, max, usati, residuo, misurabile, pieno: motivo !== "", motivo, limite };
}

/* Il bilancio di UNA voce d'ispezione, col totale preso su tutta l'ispezione.
   La pagina chiama questa e non `bilancioFoto`, perché comporre le condivise a
   mano è esattamente l'errore che fa passare cinque foto da 400 KB. */
export function bilancioFotoVoce(isp, voceId) {
  const tutte = fotoDiIspezione(isp);
  return bilancioFoto(fotoDiVoce(isp, voceId), { condivise: tutte.filter(f => f.voceId !== voceId) });
}

/* Che cosa dire di quel bilancio. Una risposta per OGNI motivo che
   `bilancioFoto` sa produrre (regola 18 di run-stile). */
export function testoBilancioFoto(b) {
  const x = b || {};
  const kb = (n) => Math.round((+n || 0) / 1024) + " KB";
  switch (x.motivo) {
    case "peso-illeggibile":
      return "Una delle foto già salvate non si riesce a pesare: finché c'è non so dire quanto spazio resta. Toglila e riprova.";
    case "numero":
      return `Ci sono già ${x.quante} foto, il massimo: per aggiungerne un'altra togline una.`;
    case "spazio":
      return `Le foto hanno già usato i ${kb(x.limite)} disponibili: per aggiungerne un'altra togline una.`;
    default:
      return `Puoi aggiungere ancora ${x.max - x.quante} foto: restano ${kb(x.residuo)} in tutto.`;
  }
}

/* La pastiglia con quante foto ci sono.
   ⛔ Con zero foto NON torna una pastiglia «0 foto»: torna `null`. Un evento
   senza foto non è un evento mal documentato, e un contatore a zero accanto
   agli altri badge lo farebbe sembrare. La classe è vuota — il grigio dei
   badge neutri — e non diventa mai `warn` né `danger`. */
export function pastigliaFoto(n) {
  const q = Math.max(0, Math.trunc(+n) || 0);
  if (!q) return null;
  return { testo: q === 1 ? "1 foto" : q + " foto", classe: "" };
}

/* Di che cosa è questa foto. Una foto senza contesto, tre mesi dopo, non la sa
   leggere nessuno: vale la didascalia scritta da chi ha scattato, e in
   mancanza il soggetto a cui la foto è attaccata (la voce della checklist, la
   descrizione dell'evento). Torna `null` — e non una stringa vuota — quando
   non c'è né l'una né l'altro, così la pagina lo può DIRE invece di mostrare
   una miniatura muta. */
export function contestoFoto(f, contesto = "") {
  const d = String((f && f.didascalia) || "").trim();
  if (d) return d;
  const c = String(contesto || "").trim();
  return c || null;
}

// Data di oggi + N giorni in ISO (per la prossima ispezione ricorrente e per
// la scadenza proposta alle azioni correttive).
// ⛔ RI-ESPORTATA da `shared/`: era scritta identica anche in Sentinella, e le
// due copie si erano già staccate sul caso d'errore. Un alias non è una seconda
// implementazione. docs/LA_STESSA_REGOLA_SCRITTA_DUE_VOLTE.md
export const dataPiuGiorni = dataPiuGiorniShell;

// Import registro infortuni da CSV (onboarding: caricare lo storico eventi di
// una cava). Colonne: data;tipo;gravita;giorniAssenza;descrizione[;luogo]
// (header opzionale). Tiene solo le righe con data valida (AAAA-MM-GG). tipo:
// "infortunio" oppure "near-miss" (qualsiasi altro valore → near-miss, il caso
// più prudente per il contatore "giorni senza infortuni"). descrizione/luogo
// sono testo grezzo → escapare dove mostrati. Pura e testabile.
export function parseInfortuniCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "data"))
    .map(r => {
      const [data, tipo, gravita, giorniAssenza, descrizione, luogo] = parseCsvLine(r);
      const g = numIt(giorniAssenza);
      const tp = (tipo || "").trim().toLowerCase() === "infortunio" ? "infortunio" : "near-miss";
      return {
        data: (data || "").trim(),
        tipo: tp,
        /* ⛔ UNA GRAVITÀ CHE NON SI RICONOSCE NON DIVENTA UNA FASCIA. Qui
           c'era `... === "grave" ? "grave" : "lieve"`, cioè: colonna vuota →
           «lieve», e soprattutto **«mortale» → «lieve»**. Un file scritto da un
           altro gestionale non usa per forza le nostre due parole, ed è
           esattamente il caso dell'import.
           ⚠️ E la svista si vede meglio dai due vicini di casa, nello STESSO
           oggetto: `tipo` su un valore ignoto ricade su «near-miss» — il caso
           **prudente**, e il commento lo dice — e `giorniAssenza` ha tre righe
           di ragione per non trasformare una colonna vuota in uno zero. La
           gravità, in mezzo a loro, ricadeva sulla parola che tranquillizza.
           `null` è la convenzione di casa per «non dichiarato» (la stessa di
           `giorniAssenza` a prognosi aperta e di `scadenza` in
           `parseAzioniCsv`): il KPI degli infortuni gravi conta `=== "grave"`
           e quindi non cambia, l'export scrive la cella vuota invece di una
           parola falsa, e la riga a schermo lo dichiara. */
        gravita: ["grave", "lieve"].includes((gravita || "").trim().toLowerCase())
          ? (gravita || "").trim().toLowerCase() : null,
        /* decisione 17: la colonna vuota di un INFORTUNIO non è uno zero — la
           prognosi può essere ancora aperta. Per un near-miss lo è, ed è il
           caso normale: la ragione scritta il 31/07 resta valida per lui. */
        giorniAssenza: Number.isFinite(g) ? Math.max(0, g) : (tp === "infortunio" ? null : 0),
        descrizione: (descrizione || "").trim(),
        luogo: (luogo || "").trim(),
      };
    })
    // un infortunio con una data che non esiste entrerebbe negli indici
    // infortunistici e nel riepilogo annuale (03/08)
    .filter(x => dataISOEsiste(x.data));
}

/* ⛔ IL REGISTRO CHE SI CONSEGNA ALL'RSPP LO SCRIVE UNA FUNZIONE, non una
   stringa nella pagina — e qui la ragione pesa più che altrove, perché le sue
   celle le decidono `prognosiAperta` e `giornateAssenza`, cioè **le stesse che
   decidono lo schermo**. Finché la riga stava nella pagina, che restassero le
   stesse era un fatto, non una prova: nessuna suite `node` poteva guardarlo.
   La decisione 17, riletta qui invece che riscritta: la prognosi ancora aperta
   esce come **cella vuota**, mai come `0`. Uno zero in questo file sarebbe un
   dato inventato in un documento che si consegna. La settima colonna dice a
   parole perché quella cella è vuota — in **coda** e non in mezzo, perché
   `parseInfortuniCsv` legge sei colonne per posizione e il giro deve restare
   identico.
   L'ordine per data fa parte della forma del file e sta qui. */
/* ⛔ IL FOGLIO DI CONFORMITÀ DEL PERSONALE — l'ultimo dei sette file che si
   ri-caricano a stare dentro la pagina, e quello che portava più regole scritte
   nei commenti e provate da nessuno. Adesso stanno qui, accanto alle funzioni
   che le decidono, e `run-kpi` le può guardare.
   `documenti` arriva come ARGOMENTO invece che da una variabile del modulo: è
   la firma allargata che questo repository preferisce alla copia — nella pagina
   era un `vfCella` chiuso su `DOC`.
   Le quattro regole, riLETTE e non riscritte:
   1. la colonna `stato` dice solo che cosa fa la DATA; su una verifica
      periodica non basta, perché la prossima può cadere fra un anno («regolare»)
      e l'ultima può essere andata male. La colonna in più la decide
      `statoVerificaPeriodica`, la stessa che disegna il badge a schermo;
   2. dove non è una verifica la cella NON resta bianca: in un foglio di
      conformità una cella vuota si legge «niente da segnalare»; ci va «—»;
   3. `s.dataScadenza || ""`: senza il ripiego una riga il cui campo non è mai
      stato scritto usciva con la PAROLA «undefined» (lo stesso difetto trovato
      in Conti col «null» scritto per esteso);
   4. la scadenza rimasta SENZA la sua persona è dell'AZIENDA. Il criterio è
      quello dello schermo — chi non è agganciato a un lavoratore CONOSCIUTO —
      non «chi non ha un lavoratoreId»: un id che punta a una persona tolta
      dall'anagrafica non è vuoto, è un id che non trova niente, e quelle righe
      sparivano dal file mentre la modale PROMETTE che non vanno perse.
   ⛔ E la riga «AZIENDA» è un accordo con `parseLavoratoriCsv`, che la salta
      per nome (`/^(nome|azienda)$/i`). Finché il file lo componeva la pagina,
      quell'accordo era tenuto da una coincidenza fra due posti che non si
      parlano: nessuna prova poteva vederlo, e cambiando questa parola si
      sarebbe importato un lavoratore fantasma. Adesso c'è la prova. */
export function csvPersonaleScadenze(lavoratori, scadenze, documenti) {
  const SENZA = "nessuna scadenza registrata";
  const LAV = (lavoratori || []).filter(Boolean);
  const SCA = (scadenze || []).filter(Boolean);
  const vf = (sc) => { const v = statoVerificaPeriodica(sc, documenti); return v ? v.badge : "—"; };
  /* `prescrizioni` e `giudizio` (la data) in coda dal 05/09: chi taglia alle
     prime otto ritrova il file di prima; vuote dove il giudizio non c'è */
  const righe = ["nome;ruolo;telefono;idoneita;scadenza;data;stato;verifica periodica;prescrizioni;giudizio"];
  for (const l of LAV) {
    const idn = idoneitaLabel(l.idoneita).label;
    const sue = SCA.filter((s) => s.lavoratoreId === l.id);
    const chi = [csvCell(l.nome || ""), csvCell(l.ruolo || ""), csvCell(l.tel || ""), csvCell(idn)];
    const coda = [csvCell(l.prescrizioni || ""), dataISOEsiste(l.giudizioIl) ? String(l.giudizioIl).slice(0, 10) : ""];
    if (!sue.length) { righe.push([...chi, "", "", SENZA, "—", ...coda].join(";")); continue; }
    for (const s of sue) {
      righe.push([...chi, csvCell(etichettaScadenza(s)), s.dataScadenza || "",
        statoScadenza(s.dataScadenza), csvCell(vf(s)), ...coda].join(";"));
    }
  }
  const noti = new Set(LAV.map((l) => l.id));
  for (const s of SCA.filter((x) => !noti.has(x.lavoratoreId))) {
    righe.push(["AZIENDA", "", "", "", csvCell(etichettaScadenza(s)), s.dataScadenza || "",
      statoScadenza(s.dataScadenza), csvCell(vf(s)), "", ""].join(";"));
  }
  return righe.join("\n") + "\n";
}

export const NOTA_PROGNOSI_APERTA =
  "prognosi ancora aperta: le giornate di assenza non sono ancora contate";
export function csvRegistroInfortuni(eventi) {
  const righe = ["data;tipo;gravita;giorniAssenza;descrizione;luogo;nota"];
  const ordinati = (eventi || []).filter(Boolean)
    .slice().sort((a, b) => ((a.data || "") < (b.data || "") ? -1 : 1));
  for (const x of ordinati) {
    const aperta = prognosiAperta(x);
    righe.push([
      x.data || "",
      x.tipo || "",
      x.gravita || "",
      aperta ? "" : giornateAssenza(x),
      csvCell(x.descrizione || ""),
      csvCell(x.luogo || ""),
      aperta ? NOTA_PROGNOSI_APERTA : "",
    ].join(";"));
  }
  return righe.join("\n") + "\n";
}

// Copertura formazione/competenze PER TIPO (visite mediche, corsi, DPI,
// patentini…): per ogni tipo conta quante scadenze sono regolari / in
// scadenza / scadute. È la "matrice" che dice se l'azienda è coperta su
// ciascun adempimento. Ordinata dalla situazione peggiore (più scadute).
// Pura e testabile.
/* ⛔ IL QUARTO SECCHIO, E L'`else` CHE LO INGHIOTTIVA (03/08, seconda passata).
   `statoScadenza` sa dire QUATTRO cose dal 03/08 — «scaduta», «in-scadenza»,
   «senza data», «regolare» — e qui i secchi erano tre: il terzo era un `else`,
   quindi «senza data» finiva fra i REGOLARI. Misurato su quattro righe di
   «Visita medica», tre con una data che non si legge («2026-13-45»,
   «2026-02-30», vuota) e una vera: la funzione rispondeva
   `{ totale: 4, scadute: 0, inScadenza: 0, regolari: 4 }`, la riga dell'elenco
   scriveva «4 in regola · 0 in scadenza · 0 scadute — su 4 in totale» con la
   pastiglia VERDE «tutte regolari», e sopra il grafico diceva «Nessun buco di
   copertura: su tutti i tipi di adempimento registrati le persone sono in
   regola». Tre visite mediche di cui non si sa niente, raccontate come tre
   visite mediche a posto.
   È la stessa famiglia già corretta in `statoScadenzaHSE` (che il «regolare»
   su NaN lo aveva perso) e in `idoneitaOperatore` (che il `senzaData` lo ha
   aggiunto): la regola era in casa, e l'`else` di questa funzione non l'aveva
   ricevuta. Un `else` finale è comodo finché la funzione che sta sopra non
   impara a dire una risposta in più — ed è precisamente il caso della regola
   18 di `run-stile.mjs`, applicata a un conteggio invece che a una mappa. */
/* ⛔ LA VERIFICA PERIODICA HA DUE STATI, E QUESTA FUNZIONE NE LEGGEVA UNO SOLO
   (02/09). Misurato aprendo la schermata Scadenze sulla dimostrazione: la riga
   «Verifica periodica» diceva «3 in regola · 0 in scadenza · 0 scadute» con la
   pastiglia VERDE «tutte regolari», e quindici righe più sotto la stessa
   schermata — con `verificheDaSistemare` — scriveva «1 con prescrizioni
   scadute · 1 mai verificata, su 3»; nel Quadro le stesse due attrezzature
   stavano in rosso e in giallo. Qui contava SOLO la data della prossima
   verifica, che per tutt'e tre è nel futuro: cioè una verifica mai fatta e una
   con le prescrizioni scadute entravano fra i «regolari». È l'assenza di un
   dato letta come dato favorevole, e la regola giusta esisteva già in questo
   file (`statoVerificaPeriodica`): la copia più debole, non l'invenzione.
   Adesso ogni riga sta in UN secchio solo, e il peggio vince: la data scaduta
   prima di tutto (la prossima verifica è dovuta), poi la verifica negativa
   (non idonea, prescrizioni scadute), poi la data in scadenza o illeggibile,
   poi la verifica incerta (mai fatta, esito non letto, verbale mancante,
   prescrizioni aperte o senza data). `documenti` serve al verbale: senza il
   registro un'«idonea» resta «verbale mancante», che è la verità di quello che
   qui si vede. Per i tipi che non sono verifiche i due secchi nuovi restano a
   zero e il conto è quello di prima. */
export function coperturaFormazione(scadenze, oggi = new Date(), documenti = null) {
  const per = {};
  for (const s of scadenze || []) {
    const t = (s.tipo || "Altro");
    const g = per[t] || (per[t] = { tipo: t, totale: 0, scadute: 0, inScadenza: 0, senzaData: 0,
      verificheNegative: 0, verificheIncerte: 0, regolari: 0 });
    g.totale++;
    const st = statoScadenza(s.dataScadenza, oggi);
    const v = scadenzaDiVerifica(s) ? statoVerificaPeriodica(s, documenti, oggi) : null;
    if (st === "scaduta") g.scadute++;
    else if (v && v.cls === "danger") g.verificheNegative++;
    else if (st === "in-scadenza") g.inScadenza++;
    else if (st === "senza data") g.senzaData++;
    else if (v && v.cls !== "ok") g.verificheIncerte++;
    else g.regolari++;
  }
  const rosse = (c) => c.scadute + c.verificheNegative;
  const gialle = (c) => c.inScadenza + c.senzaData + c.verificheIncerte;
  return Object.values(per).sort((a, b) =>
    (rosse(b) - rosse(a)) || (gialle(b) - gialle(a))
    || a.tipo.localeCompare(b.tipo, "it"));
}

/* Quante righe di quel tipo chiedono di fare qualcosa. Sta qui e non nella
   pagina perché la sommavano DUE punti (la barra del grafico e la pastiglia
   dell'elenco) e il terzo che nasce domani la riscriverebbe più debole: la
   prima stesura era `scadute + inScadenza`, cioè quella che lasciava fuori il
   secchio appena aggiunto. Una riga senza data non è «da rinnovare» — non si
   sa nemmeno se sia scaduta — ma è da sistemare, ed è l'unico modo perché
   qualcuno la guardi. */
export function daSistemareCopertura(c) {
  const x = c || {};
  return (+x.scadute || 0) + (+x.inScadenza || 0) + (+x.senzaData || 0)
    + (+x.verificheNegative || 0) + (+x.verificheIncerte || 0);
}

/* Il colore e la pastiglia di un tipo, decisi in UN posto. La pagina li
   scriveva due volte con lo stesso ternario (la barra del grafico e la
   pastiglia dell'elenco), e un secchio nuovo li avrebbe dovuti aggiornare
   tutt'e due: è così che «tutte regolari» sarebbe rimasto verde su una
   verifica negativa in uno dei due posti. Il peggio decide, nell'ordine dei
   secchi di `coperturaFormazione`. */
export function statoCopertura(c) {
  const x = c || {};
  const n = (k) => +x[k] || 0;
  /* un tipo senza nessuna riga non è «tutte regolari»: non c'è niente da
     misurare, e lo si dice (è la sonda dei tranquilli a pretenderlo) */
  if (!n("totale")) return { cls: "warn", badge: "niente registrato" };
  if (n("scadute")) return { cls: "danger", badge: conta(n("scadute"), "scaduta", "scadute") };
  /* «negativa» e «incerta» senza la parola «verifica»: la riga porta già il
     tipo, e a 360 px la pastiglia lunga spingeva il dettaglio oltre le due
     righe del taglio (misurato il 02/09: «— su 3 in totale» spariva). */
  if (n("verificheNegative")) return { cls: "danger", badge: conta(n("verificheNegative"), "negativa", "negative") };
  if (n("inScadenza")) return { cls: "warn", badge: n("inScadenza") + " in scadenza" };
  if (n("senzaData")) return { cls: "warn", badge: n("senzaData") + " senza data" };
  if (n("verificheIncerte")) return { cls: "warn", badge: conta(n("verificheIncerte"), "incerta", "incerte") };
  return { cls: "ok", badge: "tutte regolari" };
}

// IL MURO DELLE SCADENZE: quante scadenze cadono in ciascuno dei prossimi N
// mesi (di serie 12), più l'ARRETRATO già scaduto tenuto a parte. Serve a
// vedere in che mese si accumula il lavoro — cinque visite mediche nello
// stesso mese si prenotano in una mattina sola invece di rincorrerle una per
// una. Conta le scadenze dello scadenzario: le azioni correttive hanno una
// loro pagina e un loro semaforo, e non entrano qui.
// Ritorna { scadute, totale, da: "AAAA-MM", a: "AAAA-MM",
//           mesi: [{ chiave:"2026-07", mese:6, anno:2026, etichetta:"lug", totale }] }.
// Le scadenze oltre l'orizzonte non si contano (non sono un problema di
// quest'anno) ma restano nel `fuori`. Pura e testabile; `oggi` iniettabile.
const MESI_BREVI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

export function muroScadenze(scadenze, oggi = new Date(), quantiMesi = 12) {
  const n = Math.max(1, Math.round(quantiMesi));
  const mesi = [];
  const indice = {};
  for (let i = 0; i < n; i++) {
    const d = new Date(oggi.getFullYear(), oggi.getMonth() + i, 1);
    const chiave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const voce = { chiave, mese: d.getMonth(), anno: d.getFullYear(), etichetta: MESI_BREVI[d.getMonth()], totale: 0 };
    indice[chiave] = voce;
    mesi.push(voce);
  }
  /* ⛔ DUE MODI DI SPARIRE DAL MURO, tutti e due misurati il 03/08 e tutti e
     due nel verso che tranquillizza.
     1. La riga con una data che non si può leggere ma che ha la FORMA giusta
        («2026-13-45», «2026-02-30») passava il filtro qui sopra — che guarda
        com'è SCRITTA la data, non che cosa vale — non era «scaduta», e il mese
        «2026-13» non esiste nell'indice: finiva in `fuori`, cioè nel secchio
        che la pagina racconta «Altre N scadenze cadono più in là e non sono
        disegnate qui». Ma quella data non cade più in là: non cade da nessuna
        parte.
     2. La riga con la data VUOTA usciva dal `continue` prima ancora di essere
        contata: non entrava né in `totale`, né in `fuori`, né in un mese.
        Spariva da tutti e due gli elenchi, ed è la forma peggiore perché non
        lascia nemmeno un numero da cui accorgersene.
     Adesso la domanda la fa `statoScadenza` — «che cosa vale questa data»,
     non «com'è scritta» — e le righe illeggibili hanno un secchio loro che la
     pagina legge. `totale` resta il numero delle righe DATABILI, perché è
     quello che regge la frase «le N scadenze registrate cadono più in là». */
  let scadute = 0, fuori = 0, totale = 0, senzaData = 0;
  for (const s of scadenze || []) {
    const iso = String(s.dataScadenza || "").slice(0, 10);
    const st = statoScadenza(iso, oggi);
    if (st === "senza data") { senzaData++; continue; }
    totale++;
    if (st === "scaduta") { scadute++; continue; }
    const voce = indice[iso.slice(0, 7)];
    if (voce) voce.totale++; else fuori++;
  }
  return {
    scadute, fuori, totale, senzaData, mesi,
    da: mesi[0].chiave, a: mesi[mesi.length - 1].chiave,
    nelPeriodo: mesi.reduce((s, m) => s + m.totale, 0),
  };
}

// Nome esteso del mese (per i testi: «il mese più carico è ottobre 2026»).
export const MESI_NOMI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];


// Adempimenti HSE TIPICI di una cava, come voci preimpostate dello
// scadenzario (stessa idea di SOGLIE_PRESET in Sentinella): l'utente sceglie
// l'adempimento invece di digitarlo, e Scudo prepara descrizione e tipo. Fonti
// e ragionamento in vault/RICERCA_HSE_SCADENZE_CAVA.md. Doppio binario: D.Lgs
// 81/2008 (generale) + D.Lgs 624/1996 (estrattivo, DSS). categoria = persona
// (legata al lavoratore) | azienda (di sito). `tipo` mappa sui tipi già
// presenti nel form. Le PERIODICITÀ non sono qui: dipendono dal DVR/DSS e dal
// medico competente → ogni preset porta `daVerificare` (niente scadenza
// automatica, la data la mette l'utente).
// I preset del blocco "cava" (D.Lgs 624/96) portano anche una PERIODICITÀ
// SUGGERITA in mesi (`mesi`) e il RIFERIMENTO normativo (`riferimento`) da
// mostrare come nota informativa. La periodicità è solo una PROPOSTA che
// l'utente può cambiare: non è una verità assoluta e non è consulenza legale.
// `mesi: null` = periodicità non fissata dalla norma (la decide l'azienda col
// proprio consulente, oppure l'evento che la fa scattare).
export const SCADENZE_PRESET = [
  { chiave: "sorv-sanitaria",   categoria: "persona", tipo: "Visita medica", etichetta: "Sorveglianza sanitaria — visita periodica (art. 41)", mesi: 12, riferimento: "D.Lgs 81/2008 art. 41 — di norma annuale, salvo diversa periodicità stabilita dal medico competente." },
  { chiave: "form-generale",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione generale + specifica (art. 37)", mesi: null, riferimento: "D.Lgs 81/2008 art. 37 e Accordo Stato-Regioni — la formazione iniziale non ha scadenza, ma va aggiornata." },
  { chiave: "form-aggiorn",     categoria: "persona", tipo: "Formazione",    etichetta: "Aggiornamento formazione lavoratori", mesi: 60, riferimento: "Accordo Stato-Regioni — aggiornamento periodico (di prassi quinquennale)." },
  { chiave: "form-preposto",    categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento preposto", mesi: 24, riferimento: "D.L. 146/2021 — individuazione obbligatoria del preposto e aggiornamento almeno biennale." },
  { chiave: "form-dirigente",   categoria: "persona", tipo: "Formazione",    etichetta: "Formazione/aggiornamento dirigente", mesi: 60, riferimento: "Accordo Stato-Regioni — aggiornamento periodico del dirigente." },
  { chiave: "primo-soccorso",   categoria: "persona", tipo: "Corso",         etichetta: "Primo soccorso — aggiornamento addetti", mesi: 36, riferimento: "D.M. 388/2003 — aggiornamento della parte pratica di norma triennale." },
  { chiave: "antincendio",      categoria: "persona", tipo: "Corso",         etichetta: "Antincendio — aggiornamento addetti", mesi: 60, riferimento: "D.M. 2 settembre 2021 — aggiornamento periodico degli addetti antincendio." },
  { chiave: "rls",              categoria: "persona", tipo: "Formazione",    etichetta: "RLS — aggiornamento periodico", mesi: 12, riferimento: "D.Lgs 81/2008 art. 37 — aggiornamento annuale (durata secondo il numero di lavoratori)." },
  { chiave: "patentino-attr",   categoria: "persona", tipo: "Patente",       etichetta: "Abilitazione attrezzature (escavatore, PLE, gru…)", mesi: 60, riferimento: "Accordo Stato-Regioni 22/02/2012 — aggiornamento quinquennale delle abilitazioni." },
  { chiave: "fochino",          categoria: "persona", tipo: "Patente",       etichetta: "Fochino — abilitazione brillamento mine", mesi: null, riferimento: "D.P.R. 302/1956 — licenza rilasciata dal Prefetto: la scadenza è quella indicata sul titolo." },
  /* ⛔ AGGIUNTO COL PERMESSO DI LAVORO, e senza di lui il permesso per gli
     spazi confinati non poteva funzionare: `formazionePermesso` chiede a
     `statoRequisito` se chi entra in tramoggia è formato, e senza una chiave
     in questo elenco la risposta era «mancante» PER CHIUNQUE — anche per chi
     il corso l'aveva fatto. Trovato in scratchpad prima di scriverlo nel
     modulo: otto prove rosse, una causa sola.
     La periodicità è `null` come per il fochino: il D.P.R. 177/2011 non ne
     fissa una, la stabilisce la procedura di lavoro dell'azienda. */
  { chiave: "form-confinati",   categoria: "persona", tipo: "Formazione",    etichetta: "Spazi confinati — informazione, formazione e addestramento", mesi: null, riferimento: "D.P.R. 177/2011 art. 2 c.1 lett. f) e h) — formazione mirata ai rischi propri di queste attività e addestramento di tutto il personale impiegato, datore di lavoro compreso. La periodicità la fissa la procedura aziendale." },
  { chiave: "dss",              categoria: "azienda", tipo: "Altro",         etichetta: "DSS — Documento di Sicurezza e Salute (D.Lgs 624/96)", mesi: null, riferimento: "D.Lgs 624/96 artt. 6 e 10 — il DSS integra l'art. 28 del D.Lgs 81/08; va trasmesso all'autorità di vigilanza prima dell'inizio dei lavori." },
  { chiave: "dvr",              categoria: "azienda", tipo: "Altro",         etichetta: "DVR — aggiornamento", mesi: null, riferimento: "D.Lgs 81/2008 art. 29 — rielaborazione in occasione di modifiche significative, infortuni o nuovi rischi." },
  /* ⚠️ IL `tipo` DI QUESTA VOCE NON È PIÙ «Altro»: è `TIPO_VERIFICA_PERIODICA`,
     ed è quello che accende i tre campi della verifica (chi l'ha eseguita,
     l'esito, il verbale). Finché era «Altro» quei campi non si sarebbero
     accesi mai, e il controllo avrebbe risposto «nessuna violazione» senza
     aver guardato niente. */
  { chiave: "verifica-attr",    categoria: "azienda", tipo: TIPO_VERIFICA_PERIODICA, etichetta: "Verifica periodica attrezzature (D.M. 11/04/2011)", mesi: 12, riferimento: "D.M. 11/04/2011 — periodicità secondo l'allegato VII del D.Lgs 81/08: dipende dal tipo di attrezzatura." },
  { chiave: "riunione-sic",     categoria: "azienda", tipo: "Altro",         etichetta: "Riunione periodica di sicurezza (art. 35)", mesi: 12, riferimento: "D.Lgs 81/2008 art. 35 — almeno una volta l'anno nelle aziende con più di 15 lavoratori, con verbale." },
  // --- Adempimenti tipici delle industrie estrattive (D.Lgs 624/96) ---
  { chiave: "stabilita-fronti", categoria: "cava"   , tipo: "Altro",         etichetta: "Relazione annuale sulla stabilità dei fronti", mesi: 12, riferimento: "D.Lgs 624/96 — coltivazioni a cielo aperto: relazione su stabilità dei fronti, caduta massi e franamento, predisposta o aggiornata annualmente." },
  { chiave: "dss-certif",       categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — certificazione annuale del datore di lavoro", mesi: 12, riferimento: "D.Lgs 624/96 art. 6 — il datore di lavoro certifica ogni anno l'attualità del Documento di Sicurezza e Salute." },
  { chiave: "dss-aggiorn",      categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — aggiornamento dopo modifiche o incidenti", mesi: null, riferimento: "D.Lgs 624/96 artt. 6 e 10 — il DSS va aggiornato quando cambiano le lavorazioni o dopo un incidente: la data la fissa l'evento, non il calendario." },
  { chiave: "dss-trasmiss",     categoria: "cava"   , tipo: "Altro",         etichetta: "DSS — trasmissione all'autorità di vigilanza", mesi: null, riferimento: "D.Lgs 624/96 — il DSS va trasmesso all'autorità di vigilanza prima dell'inizio dei lavori (e dopo gli aggiornamenti)." },
  { chiave: "esposti-silice",   categoria: "cava"   , tipo: "Altro",         etichetta: "Registro esposti — silice cristallina respirabile", mesi: 36, riferimento: "D.Lgs 81/08 art. 243 (silice cristallina respirabile da processo: allegato XLII dal D.Lgs 44/2020) — registro degli esposti aggiornato almeno ogni tre anni." },
  { chiave: "rumore-vibraz",    categoria: "cava"   , tipo: "Altro",         etichetta: "Valutazione rumore e vibrazioni — aggiornamento", mesi: 48, riferimento: "D.Lgs 81/08 titolo VIII capi II e III — la valutazione va aggiornata periodicamente e a ogni modifica rilevante delle lavorazioni." },
  { chiave: "sorvegliante",     categoria: "cava"   , tipo: "Altro",         etichetta: "Sorvegliante di cava — nomina e formazione", mesi: null, riferimento: "D.Lgs 624/96 — figura obbligatoria nelle attività estrattive: verificare nomina in essere e formazione aggiornata." },
];

// Ritorna il preset con quella chiave (o null). daVerificare SEMPRE true: la
// periodicità è una proposta, va confermata con RSPP, medico competente e
// consulente dell'azienda.
export function presetScadenza(chiave) {
  const p = SCADENZE_PRESET.find(x => x.chiave === chiave);
  return p ? { ...p, mesi: (p.mesi == null ? null : p.mesi), daVerificare: true } : null;
}

// Data proposta a partire da oggi + N mesi (ISO AAAA-MM-GG), per precompilare
// la scadenza di un preset. Ritorna null se la periodicità non è un numero
// positivo (periodicità non fissata: la data la mette l'utente). Se il giorno
// non esiste nel mese di arrivo (31 → mese di 30 giorni) si prende l'ultimo
// giorno utile, così non si scivola al mese dopo. Pura e testabile.
export function dataDaPeriodicita(mesi, oggi = new Date()) {
  const m = Number(mesi);
  if (!Number.isFinite(m) || m <= 0) return null;
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), 1);
  d.setMonth(d.getMonth() + Math.round(m));
  const giorno = Math.min(oggi.getDate(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
  d.setDate(giorno);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ============================================================
// LA VERIFICA PERIODICA DI UN'ATTREZZATURA — CHI L'HA FATTA, COM'È ANDATA,
// E DOV'È IL VERBALE
// ============================================================
// PRIMA IL MONDO. Le attrezzature dell'allegato VII del D.Lgs 81/08 (gru,
// autogru, piattaforme elevabili, carrelli semoventi a braccio telescopico,
// apparecchi a pressione, generatori di vapore…) vanno sottoposte a VERIFICHE
// PERIODICHE — art. 71 c.11. E la norma non dice solo «vanno fatte»: dice
// anche CHI le fa.
//   · la PRIMA verifica la fa l'INAIL, che vi provvede entro 45 giorni dalla
//     richiesta; scaduto quel termine il datore di lavoro può rivolgersi a
//     un altro soggetto pubblico o privato abilitato;
//   · le SUCCESSIVE le fanno, a libera scelta del datore di lavoro, la ASL
//     (o l'ARPA dove lo prevede una legge regionale) oppure un soggetto
//     pubblico o privato ABILITATO, iscritto nell'elenco che il Ministero del
//     Lavoro aggiorna con decreto direttoriale (al 03/08/2026 è il 74°).
//     Il soggetto privato abilitato è incaricato di pubblico servizio.
//   · i risultati dei controlli vanno riportati PER ISCRITTO e conservati —
//     almeno quelli degli ultimi tre anni — a disposizione degli organi di
//     vigilanza (art. 71 c.9).
// Fonti (secondarie, non il testo primario riga per riga): art. 71 c.9 e c.11
// D.Lgs 81/08; D.M. 11/04/2011; INAIL, «Istruzioni operative per la prima
// verifica periodica»; decreti direttoriali di aggiornamento dell'elenco dei
// soggetti abilitati.
//
// POI LA NOSTRA APP. Prima di questo blocco una `scadenze/{id}` portava
// `{lavoratoreId, tipo, descrizione, dataScadenza}` e basta: misurato il
// 07/08, `verificator` e `organismo` davano ZERO occorrenze sia nel modulo sia
// nella pagina. Cioè Scudo sapeva dire QUANDO va rifatta una verifica e non
// sapeva dire CHI ha fatto l'ultima, COM'È ANDATA e DOV'È il verbale — le tre
// cose che un ispettore chiede in quest'ordine.
//
// ⛔ E IL PUNTO PER CUI ESISTE È LO STATO «NON VERIFICATA». Una scadenza di
// verifica periodica senza esito NON è «regolare»: la sua data può essere
// lontanissima e il semaforo dello scadenzario verde, ma di quell'attrezzatura
// non si sa se l'ultima verifica sia andata bene. È il principio del fondatore
// («l'assenza di un dato non è un dato favorevole») nella stessa forma già
// scritta per l'anagrafe appaltatori (`qualificaAppaltatore`, «non vuol dire
// che non sia idonea — vuol dire che non lo sappiamo») e per le voci di
// checklist senza permesso (`provaVoce`).
//
// Campi sulla `scadenze/{id}`, tutti OPZIONALI e tutti letti solo quando
// `scadenzaDiVerifica` dice di sì:
//   verificaEnte:   chiave di ENTI_VERIFICA — chi ha eseguito la verifica
//   verificaChi:    testo — QUALE ASL/ARPA, o la ragione sociale del soggetto
//                   abilitato. Facoltativo: la sua assenza si DICE, non
//                   cambia il semaforo (il verbale allegato porta quel nome).
//   verificaEsito:  chiave di ESITI_VERIFICA
//   verificaEntro:  ISO — entro quando vanno sanate le PRESCRIZIONI
//   verbaleId:      id di `documenti/{id}` — il verbale che chiude la verifica

/* CHI ESEGUE LA VERIFICA. Una lista e non un campo libero, perché le quattro
   risposte sono quattro istituti giuridici diversi, non quattro modi di
   scrivere lo stesso nome: chi mette «Ing. Rossi» in un campo di testo scrive
   una cosa che nessuno può ricontrollare.
   ⚠️ `quando` è una NOTA INFORMATIVA, non una regola: Scudo non rifiuta
   «INAIL» su una verifica successiva né «ASL» su una prima. Sapere se una
   verifica è la prima richiede la storia dell'attrezzatura, che Scudo non ha —
   e un divieto costruito su un dato che non si possiede è un divieto che
   sbaglia. */
export const ENTI_VERIFICA = [
  { chiave: "inail", nome: "INAIL", quando: "prima verifica",
    fonte: "art. 71 c.11 D.Lgs 81/08 — per la prima verifica il datore di lavoro si avvale dell'INAIL, che vi provvede entro 45 giorni dalla richiesta." },
  { chiave: "asl", nome: "ASL", quando: "verifiche successive alla prima",
    fonte: "art. 71 c.11 D.Lgs 81/08 — le successive sono effettuate, su libera scelta del datore di lavoro, dalla ASL." },
  { chiave: "arpa", nome: "ARPA", quando: "verifiche successive alla prima",
    fonte: "art. 71 c.11 D.Lgs 81/08 — al posto della ASL dove ciò sia previsto con legge regionale." },
  /* ⚠️ «Soggetto abilitato» e non «Soggetto pubblico o privato abilitato»: il
     `nome` è la voce di una TENDINA, e una tendina chiusa non va a capo. Chiesto
     al browser (clone con `width:max-content`, cioè testo + padding + la freccia
     che Chromium disegna dentro la scatola) la voce lunga chiedeva 302 px e
     tagliava a DUE larghezze — 320 px (in 242) e 360 px (in 282) — mentre le
     altre tre voci sono INAIL, ASL e ARPA e ci stanno ovunque.
     ⛔ E LA PAROLA DI LEGGE NON SI PERDE: «soggetto pubblico o privato
     abilitato» è il termine dell'art. 71 c.11, quindi è stato spostato — per
     esteso e fra virgolette — dentro `fonte`, che la finestra stampa sotto la
     tendina in un `form-hint` che VA A CAPO e si legge tutto. La regola è
     quella già applicata due volte in questa app: quello che una tendina non
     può mostrare si scrive nella nota viva sotto, non lo si taglia coi puntini.
     ⚠️ Misurato prima di scrivere: la voce non esce da nessun documento — i
     cinque file prodotti premendo tutti i comandi di export non la contengono
     (il CSV del personale scrive `badge`, non `ente.nome`), e nel codice vivo
     `ente.nome` compare in UN punto solo, la riga dello scadenzario. */
  { chiave: "abilitato", nome: "Soggetto abilitato", quando: "prima verifica (oltre i termini) e successive",
    fonte: "art. 71 c.11 e c.13 D.Lgs 81/08 e D.M. 11/04/2011 — il «soggetto pubblico o privato abilitato»: abilitazione con iscrizione nell'elenco tenuto dal Ministero del Lavoro e aggiornato con decreto direttoriale." },
];
export function enteVerifica(chiave) {
  return ENTI_VERIFICA.find((e) => e.chiave === chiave) || null;
}
/* Una chiave sconosciuta (un dato vecchio, una migrazione) torna SÉ STESSA
   invece di sparire: è la regola già scritta per `etichettaCausa` nella pagina
   — un valore che non si sa leggere si mostra, non si nasconde. */
export function enteVerificaSicuro(chiave) {
  const k = String(chiave == null ? "" : chiave).trim();
  if (!k) return null;
  return enteVerifica(k) || { chiave: k, nome: k, quando: "", fonte: "" };
}

/* COM'È ANDATA. Tre risposte, non un campo di testo.
   ⚠️ FONTE E DEDUZIONE, tenute separate. Che l'esito possa essere positivo o
   negativo — e che con esito negativo l'attrezzatura non si usi finché non è
   sanata e riverificata — è la sostanza della verifica periodica ed è scritto
   nella prassi dei soggetti abilitati (fonti secondarie). Il caso di mezzo,
   «idonea CON PRESCRIZIONI» — anomalia che non compromette la sicurezza
   immediata, l'attrezzatura resta utilizzabile ma qualcosa va sistemato — è
   la classificazione che i verificatori usano nei verbali; il D.Lgs 81/08 non
   la nomina con queste parole. È DEDOTTO dalla prassi, non letto in una
   norma, ed è anche il caso in cui una cava si trova davvero: per questo ha un
   campo suo, la data ENTRO cui sanare. */
export const ESITI_VERIFICA = [
  { chiave: "idonea", etichetta: "Idonea", cls: "ok",
    spiega: "Verifica superata: l'attrezzatura può essere usata." },
  { chiave: "prescrizioni", etichetta: "Idonea con prescrizioni", cls: "warn",
    spiega: "Può essere usata, ma il verbale chiede di sistemare qualcosa entro una data." },
  { chiave: "non-idonea", etichetta: "Non idonea", cls: "danger",
    spiega: "L'attrezzatura non va usata finché non è sanata e riverificata con esito positivo." },
];
export function esitoVerifica(chiave) {
  return ESITI_VERIFICA.find((e) => e.chiave === chiave) || null;
}

/* QUESTA SCADENZA È UNA VERIFICA PERIODICA? Il confronto passa da
   `normalizzaTesto`, che l'app usa già per riconoscere che «Corso antincendio»
   e «Antincendio — aggiornamento» parlano della stessa cosa: il `tipo` arriva
   anche da un CSV scritto a mano, dove «verifica periodica» minuscolo è la
   norma e non un errore. Un `===` secco avrebbe guardato COM'È SCRITTO il dato
   invece di CHE COSA VALE. */
export function scadenzaDiVerifica(scadenza) {
  return normalizzaTesto((scadenza || {}).tipo) === normalizzaTesto(TIPO_VERIFICA_PERIODICA);
}

/* IL LEGAME COL VERBALE. Il verbale è un documento del registro `documenti`,
   con la sua graffetta e il suo allegato: nessun secondo archivio, come per i
   documenti di qualifica degli appaltatori e per il ciclo del DSS.
   ⛔ TRE STATI E NON DUE, ed è la distinzione che `idoneitaOperatore` fa già
   fra «non collegato» e «collegamento rotto»: nessun verbale indicato è un
   lavoro non ancora fatto; un `verbaleId` che non trova più niente è un dato
   da riparare — qualcuno ha tolto quel documento dal registro. Sommarli
   direbbe una cosa falsa del secondo. */
export function verbaleDiScadenza(scadenza, documenti) {
  const id = (scadenza || {}).verbaleId == null ? "" : String(scadenza.verbaleId).trim();
  if (!id) return { stato: "assente", documento: null };
  const d = (documenti || []).find((x) => x && String(x.id) === id) || null;
  return d ? { stato: "trovato", documento: d } : { stato: "rotto", documento: null };
}

/* COME SI SCRIVE UN DOCUMENTO DENTRO IL MENÙ «IL VERBALE».
   ══════════════════════════════════════════════════════════════════════════
   ⛔ IL DIFETTO, MISURATO. Le voci si scrivevano `titolo · tipo`, e un verbale
   di verifica periodica dice il proprio tipo DUE VOLTE: una nel titolo
   («Verbale verifica periodica — piattaforma elevabile») e una nel suffisso.
   In una tendina CHIUSA — che non manda a capo — quelle due ripetizioni si
   mangiano tutto lo spazio, e a essere tagliata è proprio la coda che
   distingue un verbale dall'altro: «piattaforma elevabile», «autogru 30 t».
   Chiesto al browser col font vero della tendina: la voce intera chiede
   561 px dove ce ne sono 266 a 390 e 196 a 320; la sola coda ne chiede 148.
   ⛔ E LA STRADA OVVIA È GIÀ STATA PROVATA E SCARTATA — non si rifà: calcolare
   il prefisso COMUNE fra le voci non toglie niente, perché l'elenco non sono i
   verbali, sono TUTTI i documenti (un archivio caricato da carta può avere il
   verbale classificato «Altro», e nasconderglielo vorrebbe dire non farglielo
   collegare mai): fra «DVR», «POS» e «Verbale verifica periodica — …» il
   prefisso comune è vuoto. Qui la domanda è un'altra e non guarda l'elenco:
   questo titolo apre RIPETENDO IL PROPRIO tipo? È una domanda per documento,
   quindi risponde uguale che il menù ne contenga due o duecento.
   ⚠️ Il confronto passa da `normalizzaTesto` — la stessa di `scadenzaDiVerifica`
   — perché il titolo arriva anche da un CSV scritto a mano: «VERBALE VERIFICA
   PERIODICA - Paranco» e «Verbale di verifica periodica: paranco» sono la
   stessa cosa scritta in due modi, e un `startsWith` avrebbe guardato COM'È
   SCRITTO il dato invece di CHE COSA VALE.
   ⚠️ E niente si perde: il titolo per esteso la pagina lo scrive in un
   `form-hint` sotto il campo, che va a capo e si legge. */
const PAROLE_VUOTE_TITOLO = new Set(["di", "del", "dello", "della", "dei", "degli",
  "delle", "da", "il", "lo", "la", "i", "gli", "le", "l", "un", "uno", "una", "e", "per", "a"]);
const paroleUtiliTitolo = (s) => normalizzaTesto(s).split(" ")
  .filter((w) => w && !PAROLE_VUOTE_TITOLO.has(w));

/* ⛔ LA DOMANDA SI FA UNA VOLTA SOLA, E NON SI DEDUCE DAL RISULTATO. La prima
   stesura chiedeva a `voceDocumentoInElenco` se il taglio fosse avvenuto
   CONFRONTANDO le due stringhe: ma sul documento intitolato esattamente come
   il proprio tipo il taglio non lascia niente, la funzione restituisce il
   titolo intero (una voce vuota sarebbe peggio), il confronto risponde «non ho
   tagliato» e il tipo finiva scritto DUE VOLTE — «Verbale di verifica
   periodica · Verbale di verifica periodica». Preso dalla prova in
   scratchpad, prima che entrasse nel modulo. */
function apreColProprioTipo(titolo, tipo) {
  const a = paroleUtiliTitolo(titolo), b = paroleUtiliTitolo(tipo);
  if (!b.length || a.length < b.length) return false;
  return b.every((w, i) => a[i] === w);
}

/* Il titolo senza l'apertura che ripete il suo stesso tipo. Se non la ripete —
   o se togliendola non resterebbe niente — torna il titolo INTERO: una voce di
   tendina vuota non si sceglie, e sparire è peggio che essere lunghi. */
export function titoloSenzaTipoRipetuto(titolo, tipo) {
  const t = String(titolo == null ? "" : titolo).trim();
  if (!t || !apreColProprioTipo(t, tipo)) return t;
  const attese = paroleUtiliTitolo(tipo);
  const re = /[0-9A-Za-zÀ-ÖØ-öø-ÿ]+/g;
  let m, k = 0, fine = 0;
  while (k < attese.length && (m = re.exec(t)) !== null) {
    const p = normalizzaTesto(m[0]);
    if (!p || PAROLE_VUOTE_TITOLO.has(p)) continue;
    k++; fine = m.index + m[0].length;
  }
  const coda = t.slice(fine).replace(/^[\s·:;,.‐-―-]+/, "").trim();
  return coda || t;
}

/* L'etichetta con cui un documento del registro compare in un menù a tendina.
   Il tipo si appende SOLO se il titolo non lo dice già: dirlo una terza volta
   è il rumore che mangiava lo spazio della coda. */
export function voceDocumentoInElenco(documento) {
  const d = documento || {};
  const titolo = String(d.titolo == null ? "" : d.titolo).trim();
  const tipo = String(d.tipo == null ? "" : d.tipo).trim();
  /* un documento senza titolo esiste (import da carta): non si mostra una voce
     vuota, si mostra quello che si sa — e se non si sa niente lo si dichiara,
     invece di lasciare una riga muta che sembra un errore di caricamento */
  if (!titolo) return tipo || "(documento senza titolo)";
  if (apreColProprioTipo(titolo, tipo)) return titoloSenzaTipoRipetuto(titolo, tipo);
  return tipo ? titolo + " · " + tipo : titolo;
}

/* LO STATO DELLA VERIFICA. Torna `null` — e non un oggetto tranquillo — per
   una scadenza che non è una verifica periodica: è la stessa convenzione di
   `statoPeggioreScadenze`, «non si può calcolare» si dice `null`.
   `cls` e `badge` escono da QUI e non da una mappa nella pagina: una mappa
   scritta là è quello che la regola 18 di `run-stile` esiste per impedire —
   il giorno in cui questa funzione impara un settimo stato, `B[st][0]`
   ucciderebbe la pagina al disegno, senza nessun errore di sintassi da
   vedere. È la stessa scelta già fatta per `livelloScadenza`.
   La data delle prescrizioni la giudica `statoScadenza` (cioè
   `statoScadenzaHSE` di `shared/dw-ponti.js`, la stessa dello scadenzario, dei
   turni di Campo e dell'anagrafe appaltatori): una data «2026-13-45» non è né
   scaduta né valida, è NON LEGGIBILE, e qui vuol dire che non si sa entro
   quando. */
export function statoVerificaPeriodica(scadenza, documenti, oggi = new Date()) {
  if (!scadenzaDiVerifica(scadenza)) return null;
  const s = scadenza || {};
  const verbale = verbaleDiScadenza(s, documenti);
  const ente = enteVerificaSicuro(s.verificaEnte);
  const chi = String(s.verificaChi == null ? "" : s.verificaChi).trim();
  const base = { scadenzaId: s.id == null ? null : s.id, ente, chi, verbale,
    entro: s.verificaEntro || null };
  /* Le due code si scrivono UNA volta e si appendono a ogni ramo: il verbale
     che manca e il verificatore che non risulta vanno detti sempre, non solo
     nel ramo in cui fanno cambiare colore. Nella prima stesura la coda sul
     verificatore stava nel solo ramo «non verificata» — cioè una verifica
     dichiarata IDONEA da nessuno usciva verde e muta, che è esattamente il
     numero tranquillo su una cosa mai guardata. */
  const codaVerbale = verbale.stato === "trovato" ? ""
    : verbale.stato === "rotto"
      ? " Il verbale collegato non è più nel registro documenti: il collegamento è rotto."
      : " Il verbale non è allegato: qui non c'è il documento che lo dimostri.";
  const codaChi = ente ? "" : " E non risulta chi l'abbia eseguita.";
  const fine = codaVerbale + codaChi;

  const es = s.verificaEsito == null ? "" : String(s.verificaEsito).trim();
  if (!es) return { ...base, esito: "non-verificata", cls: "warn", badge: "Non verificata", noto: false,
    /* qui la coda sul verificatore NON si appende: senza un esito registrato
       «non risulta chi l'abbia eseguita» è una seconda volta la stessa cosa,
       e una frase che si ripete si smette di leggere. */
    /* ⚠️ e la frase NON ripete «non lo sappiamo»: quel prefisso lo mette già
       `descriviVerificaPeriodica` leggendo `noto`, e la prima stesura lo
       diceva due volte nella stessa riga. */
    perche: "Di questa verifica periodica non risulta nessun esito: non vuol dire che l'attrezzatura non "
      + "sia a posto, vuol dire che nessuno ha registrato com'è andata." + codaVerbale };
  const e = esitoVerifica(es);
  if (!e) return { ...base, esito: "esito-non-letto", cls: "warn", badge: "Esito non letto", noto: false,
    perche: "L'esito registrato («" + es + "») non è fra quelli che Scudo sa leggere, quindi non si può "
      + "dire se l'attrezzatura sia utilizzabile." + fine };
  if (e.chiave === "non-idonea") return { ...base, esito: "non-idonea", cls: "danger", badge: "Non idonea", noto: true,
    perche: "Verifica con ESITO NEGATIVO: l'attrezzatura non va usata finché non è sanata e riverificata "
      + "con esito positivo." + fine };
  if (e.chiave === "prescrizioni") {
    const st = statoScadenza(s.verificaEntro, oggi);
    if (st === "senza data") return { ...base, esito: "prescrizioni-senza-data", cls: "warn",
      badge: "Prescrizioni", noto: false,
      perche: "La verifica è andata bene MA CON PRESCRIZIONI, e non risulta una data leggibile entro cui "
        + "sanarle: non si sa entro quando." + fine };
    if (st === "scaduta") return { ...base, esito: "prescrizioni-scadute", cls: "danger",
      badge: "Prescrizioni scadute", noto: true,
      perche: "Le prescrizioni della verifica andavano sanate entro il " + dataIt(s.verificaEntro)
        + ", e il termine è passato." + fine };
    return { ...base, esito: "prescrizioni-aperte", cls: "warn", badge: "Prescrizioni", noto: true,
      perche: "Verifica superata, ma con prescrizioni da sanare entro il " + dataIt(s.verificaEntro) + "." + fine };
  }
  /* ⛔ «IDONEA» DETTA DA NOI NON È UN VERBALE. Un esito positivo digitato senza
     il documento che lo dimostra è la stessa cosa della voce di checklist
     segnata conforme senza il permesso dietro (`provaVoce`): la verifica può
     essere stata fatta davvero — il verbale magari è in un cassetto — ma qui
     non c'è niente che lo provi, e questa è la schermata che si mostra a un
     ispettore, che il verbale lo chiede in mano. */
  if (verbale.stato !== "trovato") return { ...base, esito: "idonea-senza-verbale", cls: "warn",
    badge: "Verbale mancante", noto: false,
    perche: "L'esito registrato è positivo, ma non c'è il verbale che lo dimostri."
      + (verbale.stato === "rotto" ? " Il documento collegato non è più nel registro." : "") + codaChi };
  return { ...base, esito: "idonea", cls: "ok", badge: "Idonea", noto: true,
    perche: "Verifica eseguita con esito positivo, con il verbale allegato." + codaChi };
}

/* Chi consuma la bandiera `noto`, e sta nel modulo per la stessa ragione di
   `descriviQualifica` e `descriviProva`: la frase che distingue «non va bene»
   da «non lo sappiamo» va decisa in un posto solo (regola 7 di run-stile). */
export function descriviVerificaPeriodica(v) {
  if (!v) return "";
  return (v.noto ? "" : "Non lo sappiamo — ") + v.perche;
}

/* LE VERIFICHE CHE CHIEDONO QUALCOSA, per il Quadro e per il riepilogo.
   ⛔ Su uno scadenzario SENZA nessuna verifica periodica torna `quante: 0` e
   `noto: false`: non è «tutte le attrezzature sono a posto», è «di attrezzature
   soggette a verifica periodica qui non ne risulta nessuna». È la stessa
   distinzione di `riepilogoPermessi` sul registro vuoto, e serve per la stessa
   ragione — il verde su una schermata dove non è stato registrato niente. */
export function verificheDaSistemare(scadenze, documenti, oggi = new Date()) {
  const ORDINE = { danger: 0, warn: 1, ok: 2 };
  const righe = [];
  for (const s of scadenze || []) {
    const v = statoVerificaPeriodica(s, documenti, oggi);
    if (v) righe.push({ scadenza: s, ...v });
  }
  const daSistemare = righe.filter((r) => r.cls !== "ok")
    .sort((a, b) => (ORDINE[a.cls] - ORDINE[b.cls])
      || String(a.scadenza.dataScadenza || "").localeCompare(String(b.scadenza.dataScadenza || "")));
  const quanti = (...e) => righe.filter((r) => e.includes(r.esito)).length;
  return {
    quante: righe.length, righe, daSistemare,
    bloccate: quanti("non-idonea"),
    conPrescrizioni: quanti("prescrizioni-aperte", "prescrizioni-scadute", "prescrizioni-senza-data"),
    prescrizioniScadute: quanti("prescrizioni-scadute"),
    nonVerificate: quanti("non-verificata", "esito-non-letto"),
    senzaVerbale: righe.filter((r) => r.verbale.stato !== "trovato" && r.esito !== "non-verificata").length,
    noto: righe.length > 0 && daSistemare.length === 0,
    testo: !righe.length
      ? "Nello scadenzario non risulta nessuna verifica periodica di attrezzature. Non vuol dire che in "
        + "cava non ce ne siano di soggette all'allegato VII: vuol dire che qui non ne è registrata nessuna."
      : daSistemare.length
        ? [quanti("non-idonea") ? quanti("non-idonea") + (quanti("non-idonea") === 1 ? " non idonea" : " non idonee") : "",
           quanti("prescrizioni-scadute") ? quanti("prescrizioni-scadute") + " con prescrizioni scadute" : "",
           quanti("prescrizioni-aperte", "prescrizioni-senza-data") ? quanti("prescrizioni-aperte", "prescrizioni-senza-data") + " con prescrizioni da sanare" : "",
           quanti("non-verificata", "esito-non-letto") ? quanti("non-verificata", "esito-non-letto") + (quanti("non-verificata", "esito-non-letto") === 1 ? " mai verificata" : " mai verificate") : "",
           quanti("idonea-senza-verbale") ? quanti("idonea-senza-verbale") + " senza il verbale" : ""]
          .filter(Boolean).join(" · ") + ", su " + conta(righe.length, "verifica registrata", "verifiche registrate") + "."
        : (righe.length === 1
            ? "L'unica verifica periodica registrata è in regola, con il suo verbale."
            : "Tutte le " + righe.length + " verifiche periodiche registrate sono in regola, con il loro verbale."),
  };
}

// ============================================================
// IL CICLO DI VITA DEL DSS (D.Lgs 624/96 art. 6)
// ============================================================
// Il DSS c'era già come TIPO di documento, con il suo stato a tre valori
// (valido / da rivedere / scaduto) messo a mano, e c'erano già quattro voci di
// scadenzario che lo nominano (`dss`, `dss-certif`, `dss-aggiorn`,
// `dss-trasmiss`). Quello che non c'era è il CICLO: chi lo aggiorna, quando, e
// che cosa lo fa scadere. Uno stato messo a mano dice quello che qualcuno ha
// digitato l'ultima volta che ci ha pensato; questo dice quello che risulta.
//
// ⛔ E IL PUNTO PER CUI ESISTE È IL TERZO STATO. Un DSS senza una data di
// revisione leggibile NON è «aggiornato» e NON è «scaduto»: è **non databile**,
// e va detto con la sua parola. È il principio del fondatore nel punto in cui
// costa di più, perché il DSS è il primo documento che un ispettore chiede in
// una cava: un badge verde su un documento di cui non sappiamo l'età sarebbe
// la cosa peggiore che questa schermata possa fare.
// Allo stesso modo «nessun infortunio grave registrato» non vuol dire «non
// serve aggiornarlo»: le modifiche delle lavorazioni — nuovo fronte, nuovo
// metodo, nuovo impianto — Scudo non le vede, e quindi lo scrive INVECE di
// lasciar credere di aver guardato anche quelle (costante `CIECO_DSS`).
//
// Campi sul documento di tipo "DSS" nel registro `documenti` (nessun secondo
// archivio, come per i documenti di qualifica degli appaltatori):
//   dssRevisione:    ISO — data dell'ultima revisione
//   dssMotivo:       chiave di MOTIVI_REVISIONE_DSS
//   dssTrasmissione: ISO — data di invio all'autorità di vigilanza
//
// ⚠️ FONTI SECONDARIE. I riferimenti normativi qui sotto ripetono quelli già
// scritti nei preset di scadenzario, che vengono da ricerca su fonti
// SECONDARIE: il testo primario non è stato letto riga per riga. Nella pagina
// il blocco porta la formula che Scudo usa già — «nota informativa, non un
// parere legale» — e la periodicità di dodici mesi è quella del preset
// `dss-certif`, cioè una PROPOSTA, non una verità di legge riga per riga.

// Perché il DSS è stato rivisto. I due motivi «dopo…» sono i fatti che la
// norma indica come scatenanti; gli altri due sono il calendario e l'origine.
export const MOTIVI_REVISIONE_DSS = [
  { chiave: "prima-stesura", nome: "Prima stesura",
    riferimento: "D.Lgs 624/96 art. 6 — il DSS è redatto prima dell'inizio dei lavori." },
  { chiave: "periodica", nome: "Revisione periodica",
    riferimento: "D.Lgs 624/96 art. 6 — il datore di lavoro certifica ogni anno l'attualità del documento." },
  { chiave: "dopo-evento", nome: "Dopo un infortunio o un incidente",
    riferimento: "D.Lgs 624/96 artt. 6 e 10 — la data la fissa l'evento, non il calendario." },
  { chiave: "dopo-modifica", nome: "Dopo una modifica delle lavorazioni",
    riferimento: "D.Lgs 624/96 artt. 6 e 10 — nuovo fronte, nuovo metodo di coltivazione, nuovo impianto." },
];
export function motivoRevisioneDss(chiave) {
  return MOTIVI_REVISIONE_DSS.find((m) => m.chiave === chiave) || null;
}

// I mesi della certificazione annuale: NON un numero nuovo, è quello del preset
// `dss-certif` — se un giorno cambia là, cambia qui. Una periodicità scritta due
// volte è una periodicità che si stacca.
const MESI_CERTIF_DSS = (SCADENZE_PRESET.find((p) => p.chiave === "dss-certif") || {}).mesi || 12;

/* I DSS di una cava, dal più recente al più vecchio. Vivono nel registro
   `documenti` che Scudo ha già, collegati da `cantiereId` come il DSS della
   dimostrazione lo è sempre stato. */
export function dssDiCantiere(documenti, cantiereId) {
  if (!cantiereId) return [];
  return (documenti || [])
    .filter((d) => d && d.tipo === "DSS" && d.cantiereId === cantiereId)
    .sort((a, b) => String(b.dssRevisione || "").localeCompare(String(a.dssRevisione || "")));
}

/* ⛔ I DSS CHE NON SONO COLLEGATI A NESSUNA CAVA. Senza questa riga il modulo
   direbbe «non registrato» su una cava mentre il suo DSS è in archivio, appeso
   a niente: un allarme falso manda a rifare un documento che c'è, ed è il modo
   più veloce per far spegnere l'allarme a chi lo riceve. */
export function dssScollegati(documenti) {
  return (documenti || []).filter((d) => d && d.tipo === "DSS" && !d.cantiereId);
}

// La frase che dichiara quello che Scudo NON ha potuto guardare. Sta in una
// costante perché la dicono tre stati su sette e riscriverla tre volte è il
// modo in cui, fra un mese, ne resteranno due.
const CIECO_DSS = "Le modifiche delle lavorazioni Scudo non le vede: se sono cambiati il fronte, "
  + "il metodo di coltivazione o l'impianto, il DSS va rivisto lo stesso.";

/* Il ciclo di UN DSS. `documento` è quello della cava (o null: la cava non ne
   ha nessuno). Le scadenze non si giudicano qui — le dice `statoScadenza`,
   cioè `statoScadenzaHSE` di `shared/dw-ponti.js`, la stessa dello scadenzario
   e dei turni di Campo — e la data della certificazione annuale la calcola
   `dataDaPeriodicita`, la stessa che precompila i preset. Pura e testabile;
   `oggi` iniettabile. */
export function cicloDss(documento, infortuni, oggi = new Date()) {
  const d = documento || null;
  const rev = d && dataISOEsiste(d.dssRevisione) ? String(d.dssRevisione).slice(0, 10) : null;
  const tra = d && dataISOEsiste(d.dssTrasmissione) ? String(d.dssTrasmissione).slice(0, 10) : null;
  const mot = (d && d.dssMotivo) || "";
  const veri = (infortuni || []).filter((x) => x && x.tipo === "infortunio" && dataISOEsiste(x.data));
  const graviRegistrati = veri.filter((x) => x.gravita === "grave").length;
  // Confronto STRETTO: un infortunio dello stesso giorno della revisione si
  // considera già dentro il documento. Con `>=` una cava che rivede il DSS il
  // giorno dell'incidente — cioè che fa la cosa giusta — resterebbe rossa.
  const dopo = rev ? veri.filter((x) => String(x.data).slice(0, 10) > rev) : [];
  const graviDopo = dopo.filter((x) => x.gravita === "grave");
  const giorni = rev ? -giorniTra(rev, oggi) : null;
  const scadenzaCertificazione = rev
    ? dataDaPeriodicita(MESI_CERTIF_DSS, new Date(rev + "T00:00:00")) : null;
  const statoCertificazione = rev ? statoScadenza(scadenzaCertificazione, oggi) : "senza data";
  // Tre valori, e il terzo conta: `null` = non lo sappiamo (manca una delle due
  // date). `false` = sappiamo che la revisione in vigore non è stata trasmessa.
  const trasmissioneAllineata = (!rev || !tra) ? null : tra >= rev;

  const base = {
    presente: !!d, documentoId: d ? d.id : null, revisione: rev, motivo: mot,
    motivoNome: (motivoRevisioneDss(mot) || {}).nome || "",
    trasmissione: tra, trasmissioneAllineata, giorniDaRevisione: giorni,
    scadenzaCertificazione, statoCertificazione,
    eventiDopo: dopo, graviDopo: graviDopo.length, graviRegistrati,
  };

  if (!d) return { ...base, noto: false, stato: "assente",
    perche: "Nel registro documenti non c'è nessun DSS collegato a questa cava. Non vuol dire che non "
      + "esista: vuol dire che da qui non lo vediamo, e finché è così questa schermata non dimostra niente." };
  if (!rev) return { ...base, noto: false, stato: "non-databile",
    perche: "Il DSS è in archivio ma non ha una data di revisione leggibile: non è «aggiornato» e non è "
      + "«scaduto», è non databile. Finché quella data manca non si può dire nient'altro." };
  /* Una data di revisione nel FUTURO è un errore di digitazione, e senza questa
     riga darebbe il verde per un anno intero: è la stessa famiglia dello 0% di
     `avanzamentoLotto`, un numero tranquillo prodotto da un dato sbagliato. */
  /* ⛔ E I GIORNI SI SCRIVONO CON `conta`, IN TUTT'E QUATTRO I RAMI. Il DSS
     rivisto ieri faceva dire a questa funzione «Ultima revisione 1 giorni fa»
     — ed è il primo giorno di vita del documento, cioè il momento in cui uno
     lo apre per controllare di averlo registrato bene. Due dei quattro rami
     (i dodici mesi) con un giorno solo non ci arrivano mai, ma la regola si
     scrive una volta per tutte: due versioni della stessa frase divergono, ed
     è il difetto che questo repository ha già pagato più volte. */
  if (giorni < 0) return { ...base, noto: false, stato: "revisione-futura",
    perche: "La data dell'ultima revisione cade nel futuro (fra " + conta(-giorni, "giorno", "giorni") + "): è un errore di "
      + "compilazione, e tutto quello che verrebbe dopo sarebbe calcolato su una data falsa." };
  if (graviDopo.length) return { ...base, noto: true, stato: "da-aggiornare",
    perche: "Dopo l'ultima revisione " + (graviDopo.length === 1
      ? "è stato registrato un infortunio grave" : "sono stati registrati " + graviDopo.length + " infortuni gravi")
      + ": il DSS va aggiornato." };
  if (statoCertificazione === "scaduta") return { ...base, noto: true, stato: "certificazione-scaduta",
    perche: "Ultima revisione " + conta(giorni, "giorno", "giorni") + " fa: i dodici mesi sono passati. " + CIECO_DSS };
  if (statoCertificazione === "in-scadenza") return { ...base, noto: true, stato: "certificazione-in-scadenza",
    perche: "Ultima revisione " + conta(giorni, "giorno", "giorni") + " fa: i dodici mesi scadono entro trenta giorni. " + CIECO_DSS };
  return { ...base, noto: true, stato: "regolare",
    perche: "Ultima revisione " + conta(giorni, "giorno", "giorni") + " fa, dentro i dodici mesi, e dopo di essa "
      + (graviRegistrati ? "non risultano infortuni gravi" : "Scudo non ha registrato nessun infortunio grave")
      + ". " + CIECO_DSS };
}

/* Chi consuma la bandiera `noto`: sta nel modulo e non nella pagina, come per
   `descriviQualifica`, perché la frase che distingue «non a posto» da «non lo
   sappiamo» va decisa in un posto solo (regola 7 di run-stile). */
export function descriviCicloDss(c) {
  if (!c) return "";
  return (c.noto ? "" : "Non lo sappiamo — ") + c.perche;
}

/* La trasmissione all'autorità di vigilanza è un obbligo SUO, separato
   dall'attualità del documento: si dice su una riga sua, con la sua parola, e
   `null` non diventa mai un sì. */
export function descriviTrasmissioneDss(c) {
  if (!c || !c.presente) return "";
  if (c.trasmissioneAllineata === true)
    return "Trasmesso all'autorità di vigilanza il " + c.trasmissione + ", dopo l'ultima revisione.";
  if (c.trasmissioneAllineata === false)
    return "L'ultimo invio all'autorità di vigilanza (" + c.trasmissione + ") è anteriore alla revisione del "
      + c.revisione + ": la versione in vigore non risulta trasmessa.";
  return c.trasmissione
    ? "Risulta un invio all'autorità di vigilanza il " + c.trasmissione + ", ma senza una data di revisione "
      + "non si sa a quale versione si riferisca."
    : "Non risulta nessun invio all'autorità di vigilanza. Non vuol dire che non sia stato trasmesso: "
      + "vuol dire che qui non ne resta traccia.";
}

/* ⛔ LA FORMA CORTA, E NON È UN VEZZO: LO SCATTO L'HA PRETESA. La riga del
   Quadro ha `-webkit-line-clamp:2`, e mettendoci `descriviCicloDss` il testo
   finiva tagliato a «non è…» — cioè proprio la parte che il principio del
   fondatore esiste per far leggere, morta sullo schermo. Le due uscite giuste
   sono note: o il dato va in un posto suo, o non ci va. Qui va la forma corta,
   che è una frase INTERA; quella lunga vive nella schermata Documenti, dove sta
   in un `form-hint` che non taglia niente. Sta nel modulo, e non nella pagina,
   perché anche la versione corta è una frase sul «non lo so» (regola 7). */
export function sintesiCicloDss(stato) {
  switch (stato) {
    case "assente":                    return "Nessun DSS collegato a questa cava";
    case "non-databile":               return "Manca la data dell'ultima revisione";
    case "revisione-futura":           return "La data di revisione cade nel futuro";
    case "da-aggiornare":              return "Infortunio grave dopo l'ultima revisione";
    case "certificazione-scaduta":     return "Più di dodici mesi dall'ultima revisione";
    case "certificazione-in-scadenza": return "I dodici mesi scadono entro trenta giorni";
    case "regolare":                   return "Rivisto entro i dodici mesi";
    default:                           return "Stato del ciclo non indicato";
  }
}

/* Badge del ciclo. È uno `switch` con `default`, non una mappa: una mappa a cui
   manca uno stato uccide la pagina al disegno (regola 18), e questa funzione di
   stati ne sa dire sette. */
export function etichettaCicloDss(stato) {
  switch (stato) {
    case "assente":                    return { cls: "warn",   label: "Non registrato" };
    case "non-databile":               return { cls: "warn",   label: "Non databile" };
    case "revisione-futura":           return { cls: "warn",   label: "Data da correggere" };
    case "da-aggiornare":              return { cls: "danger", label: "Da aggiornare" };
    case "certificazione-scaduta":     return { cls: "danger", label: "Certificazione scaduta" };
    case "certificazione-in-scadenza": return { cls: "warn",   label: "Certificazione in scadenza" };
    case "regolare":                   return { cls: "ok",     label: "In corso di validità" };
    default:                           return { cls: "warn",   label: "Stato non indicato" };
  }
}

/* Le cave su cui si lavora: una cava CHIUSA non chiede niente a nessuno.
   Sta in una funzione perché la chiedono in DUE — chi cerca i DSS da seguire e
   chi cerca i registri muti — e una regola che serve a due posti scritta due
   volte è una regola che si stacca (è la stessa ragione di `MESI_CERTIF_DSS`). */
function caveAperte(cantieri) {
  return (cantieri || []).filter((c) => c && c.tipo === "cava" && c.stato !== "chiuso");
}

/* Le cave il cui DSS chiede qualcosa, per le urgenze del Quadro: prima i rossi.
   Una cava CHIUSA resta fuori — non ci si lavora — ma una cava attiva senza
   nessun DSS collegato ci entra, ed è la riga più silenziosa di tutte. */
export function dssDaSeguire(documenti, cantieri, infortuni, oggi = new Date()) {
  const peso = (s) => (etichettaCicloDss(s).cls === "danger" ? 0 : 1);
  return caveAperte(cantieri)
    .map((c) => ({ cantiere: c, ...cicloDss(dssDiCantiere(documenti, c.id)[0] || null, infortuni, oggi) }))
    .filter((r) => r.stato !== "regolare")
    .sort((a, b) => peso(a.stato) - peso(b.stato));
}

/* ⛔ I REGISTRI MUTI — CHE COSA IL QUADRO NON HA POTUTO GUARDARE.
   ══════════════════════════════════════════════════════════════════════
   PERCHÉ ESISTE, e va detto col caso misurato perché nessuno la tolga. Quando
   nessuna delle undici famiglie di urgenze produce una riga, il Quadro mostra
   il pannello VERDE «Nessuna urgenza», e la sua frase dichiara in regola otto
   cose: idoneità, mansioni, nomine, scadenze, azioni correttive, ciclo del DSS,
   permessi di lavoro e verifiche periodiche delle attrezzature.
   Misurato il 14/08 aprendo la pagina (non leggendo il codice), su una cava con
   il personale a posto e tutti gli altri registri vuoti: il Quadro scriveva
   «…**sono tutti in regola**» e la schermata Personale, **sugli stessi dati e
   nello stesso istante**, scriveva «di 1 non c'è nessuna scadenza registrata:
   **non è «a posto», è una persona di cui non si sa niente**». Due schermate
   della stessa app che si smentiscono, e quella che rassicura è la prima che si
   apre — in un'app di sicurezza «rassicura» vuol dire che nessuno va a
   controllare.
   ⚠️ Non è un allarme e non deve diventarlo: un registro vuoto non è un
   difetto. È la differenza fra «guardato e a posto» e «non c'era niente da
   guardare», ed è il principio del fondatore — *l'assenza di un dato non è un
   dato favorevole*. Il precedente in casa è `CIECO_DSS`, che dice esattamente
   questo per un registro solo: qui è la stessa cosa per gli altri sette.
   ⛔ E NESSUNA VOCE INVENTA UN CRITERIO NUOVO: ognuna passa dal meccanismo che
   già decide quella cosa altrove — `idoneitaLabel` (che per l'idoneità mai
   dichiarata risponde con la classe VUOTA), `lavoratoriIds` (l'assegnazione che
   legge `riepilogoMansioni`), `kpiFrom.senzaScadenze` (che i «regolari» li
   tiene fuori apposta), `verificheDaSistemare.quante` e `caveAperte`. Se un
   giorno una di quelle decisioni cambia, cambia anche qui.
   Torna un elenco (vuoto = non c'è niente da dichiarare), ordinato dalle
   persone alle cose: `{ chiave, quanti, frase }`. */
export function registriMuti(dati, oggi = new Date()) {
  const d = dati || {};
  const lav = d.lavoratori || [], sca = d.scadenze || [], mans = d.mansioni || [];
  const attivi = lav.filter((l) => l && l.attivo);
  const out = [];
  const dire = (chiave, quanti, frase) => { if (quanti > 0) out.push({ chiave, quanti, frase }); };

  const idnIgnota = attivi.filter((l) => idoneitaLabel(l && l.idoneita).cls === "").length;
  dire("idoneita", idnIgnota,
    "di " + conta(idnIgnota, "persona in forza", "persone in forza")
    + " l'idoneità sanitaria non è mai stata dichiarata");

  const senzaMansione = attivi.filter((l) =>
    !mans.some((m) => (((m && m.lavoratoriIds) || [])).includes(l && l.id))).length;
  dire("mansioni", senzaMansione,
    conta(senzaMansione, "persona in forza", "persone in forza")
    + (senzaMansione === 1 ? " non ha" : " non hanno") + " nessuna mansione assegnata");

  const senzaSca = kpiFrom(lav, sca).senzaScadenze;
  dire("scadenze", senzaSca,
    "di " + conta(senzaSca, "persona in forza", "persone in forza") + " non c'è nessuna scadenza registrata");

  dire("verifiche", verificheDaSistemare(sca, d.documenti || [], oggi).quante === 0 ? 1 : 0,
    "nello scadenzario non risulta nessuna attrezzatura con verifica periodica (all. VII)");

  dire("dss", caveAperte(d.cantieri).length === 0 ? 1 : 0,
    "non c'è nessuna cava aperta in anagrafica: del ciclo del DSS non si può dire niente");

  dire("ispezioni", (d.ispezioni || []).length === 0 ? 1 : 0,
    "non è registrata nessuna ispezione: non c'è nessuna checklist da confrontare coi permessi");

  dire("permessi", (d.permessi || []).length === 0 ? 1 : 0,
    "non è registrato nessun permesso di lavoro");

  return out;
}

// IMPORT DELL'ANAGRAFICA LAVORATORI DA CSV.
//
// Perché è nata qui, il 31/07: era l'UNICO dei diciassette import del prodotto
// scritto dentro la pagina invece che come funzione pura — quindi l'unico che
// nessuna prova poteva guardare. Ed è l'anagrafica delle PERSONE, il primo
// file che una cava carica.
//
// ⚠️ Portandola fuori è venuto a galla un difetto che nella pagina non si
// vedeva: il controllo del doppione guardava solo l'elenco GIÀ in archivio, e
// quell'elenco non si aggiornava mentre il file scorreva. Non è un caso di
// scuola: l'esportazione di Scudo scrive **una riga per ogni scadenza**, così
// un lavoratore con tre scadenze compare tre volte nel suo stesso file.
// Ri-caricandolo — il modo più naturale di spostare i dati da una postazione a
// un'altra — in anagrafica comparivano tre «Rossi». Qui il doppione si toglie
// DENTRO il file, a parità di nome ignorando maiuscole e spazi; il confronto
// con chi è già in archivio resta alla pagina, che è l'unica a conoscerlo.
//
// Colonne: nome;ruolo;telefono (intestazione facoltativa). Si saltano le righe
// senza nome, l'intestazione e la riga «AZIENDA» che l'esportazione usa per le
// scadenze non intestate a nessuno. I nomi sono testo grezzo → escapare dove
// mostrati. Pura e testabile.
export function parseLavoratoriCsv(text) {
  const letti = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .map(r => {
      const [nome, ruolo, tel] = parseCsvLine(r);
      return {
        nome: (nome || "").trim(),
        ruolo: (ruolo || "").trim(),
        tel: (tel || "").trim(),
        attivo: true,
      };
    })
    .filter(l => l.nome && !/^(nome|azienda)$/i.test(l.nome));
  /* Il doppione dentro il file lo toglie la regola CONDIVISA: era nata qui il
     31/07, ma la misura ha detto che lo stesso buco stava in dieci gestori su
     dieci in tutte e sei le app. Una regola che serve a sei app vive in
     shared/ e si CHIAMA, non si ricopia. */
  return senzaDoppioni(letti, l => l.nome);
}

/* ⛔ «E LE RIGHE CHE NON SONO ENTRATE?» — IL LETTORE LE CANCELLA E LA PAGINA
   NON POTREBBE DIRLO NEMMENO VOLENDO.
   ══════════════════════════════════════════════════════════════════════════
   Il `.filter` sta DENTRO il lettore, che restituisce solo i sopravvissuti:
   chi chiama riceve un elenco più corto e non ha modo di sapere né quante
   righe mancano né perché. Chi importa 200 lavoratori e ne vede 180 non sa
   quali venti — è l'assenza di un dato nella sua forma più tranquilla, cioè il
   principio del fondatore applicato all'INGRESSO invece che all'uscita. E qui
   la riga persa è una PERSONA che non esiste più per l'app: non ha scadenze,
   non compare nella copertura della formazione, non risulta scoperta di
   niente — cioè sparisce nella direzione tranquilla.
   La forma è quella di `scartiFattureCsv` in Conti (13/08), che a sua volta
   viene da `rientroRilievi` di Terra: `persi: [{ nome, ragione }]`. I conti si
   chiamano `lette` ed `entrano` perché il file è di qualcun altro — non
   l'abbiamo scritto noi.
   ⛔ IL VERDETTO NON SI RISCRIVE: lo si chiede al lettore riga per riga
   (`parseLavoratoriCsv(riga).length`). La scala delle ragioni SPIEGA e basta,
   e quando non sa spiegare dice «il lettore la scarta» invece di indovinare.
   ⛔ E TRE FAMIGLIE DI RIGHE NON SONO PERDITE, per tre ragioni diverse:
     · l'INTESTAZIONE e la riga «AZIENDA» sono la convenzione del NOSTRO
       export (una scadenza non intestata a nessuno), quindi non sono righe
       dell'utente: si tolgono in cima, come `isIntestazione` nel riferimento;
     · la riga tutta vuota — un foglio di calcolo salva le righe di coda come
       `;;`, che dopo il `trim` non è vuota e arriva fino ai filtri — si conta
       a parte (`vuote`) e non si dice: accusare l'utente di un difetto del suo
       Excel è il falso allarme che insegna a non guardare i messaggi;
     · ⛔ e il DOPPIONE dentro il file NON va in `persi`, che è la decisione
       che conta di questa funzione. `csvPersonaleScadenze` scrive **una riga
       per ogni scadenza**, quindi un lavoratore con tre scadenze compare tre
       volte nel proprio file: ri-caricare il nostro export — che è il modo
       normale di spostare i dati da una postazione a un'altra — produrrebbe
       una frase tipo «40 righe del file non sono entrate» su un'operazione
       perfettamente riuscita. È lo stesso falso allarme della riga di coda,
       con un costo più alto perché è quello che succede *sempre*. Ha un
       contatore suo (`ripetute`), che la pagina dice con le sue parole.
   ⚠️ QUINDI QUI `entrano` NON È `lette − persi.length`: sarebbe più alto del
   vero, cioè un numero tranquillo. È `lette − persi.length − ripetute`, e
   `run-kpi` pretende che sia ESATTAMENTE `parseLavoratoriCsv(text).length` —
   un'invariante che si può controllare, non un conto da credere. */
export function scartiLavoratoriCsv(text) {
  const intestazione = (c) => /^(nome|azienda)$/i.test(String(c == null ? "" : c).trim());
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !intestazione(parseCsvLine(r)[0]));
  const persi = [];
  const visti = new Set();
  let nRiga = 0, vuote = 0, ripetute = 0;
  for (const riga of righe) {
    nRiga++;
    const c = parseCsvLine(riga);
    if (parseLavoratoriCsv(riga).length) {
      /* il doppione lo decide `senzaDoppioni`, che il lettore chiama sul file
         intero: qui si rifà la stessa CHIAVE (il nome), non la stessa regola —
         la regola resta una sola, in `shared/`. */
      const k = (c[0] || "").trim();
      if (visti.has(k)) { ripetute++; continue; }
      visti.add(k);
      continue;
    }
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    persi.push({ nome: "riga " + nRiga, ragione: "manca il nome del lavoratore" });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length - ripetute, persi, vuote, ripetute };
}

/* PERCHÉ UNA DATA SCRITTA «01/09/2026» NON ENTRA, E PERCHÉ SI È DECISO COSÌ.
   ══════════════════════════════════════════════════════════════════════════
   ⛔ LA DECISIONE, presa con la misura e non per riflesso (13/08). Un foglio
   di calcolo italiano una data la scrive `01/09/2026` da sé, quindi il caso
   NON è di scuola: chi esporta le scadenze da Excel e le reimporta qui non ne
   vede entrare nessuna. Le uscite erano due — accettarla, oppure rifiutarla
   DICENDOLO — e un rifiuto silenzioso non è nessuna delle due.
   Si rifiuta, dicendolo, per un numero: nel 2026 **132 date su 365 (36,2%)**
   si leggono in due modi diversi e tutti e due esistono (`01/09` è il 1°
   settembre in Italia e il 9 gennaio altrove), e nel file non c'è NIENTE che
   dica quale delle due sia. Accettarle vorrebbe dire spostare in silenzio più
   di un terzo delle scadenze di uno scadenzario di sicurezza — che è
   esattamente il difetto per cui `dataISOEsiste` è nata il 03/08: «una
   scadenza spostata di due giorni in silenzio è peggio di una scartata a voce
   alta». Qui lo scarto smette di essere silenzioso, e questo era il difetto.
   ⛔ E LA «SECONDA RAGIONE» CHE STAVA QUI ERA UN «NON C'È» FALSO — corretto il
   14/08 rifacendo il suo stesso comando. Diceva: «in casa NON c'è nessun
   lettore di date all'italiana, provato con un `grep -rnE` sui moduli dati:
   **zero righe**». Sono **due**, e c'erano già quando quella riga è stata
   scritta: `dataIso` in `sentinella-data.js` (legge `12/07/2026`, `12.07.26` e
   la forma ISO, e la usa l'import delle tarature) e `isoDaDataItaliana` in
   `conti-data.js` (legge `GG/MM/AAAA` e lascia fuori gli anni a due cifre,
   dichiarandolo). Il comando li trova tutt'e due in un secondo.
   ⚠️ IL VERDETTO NON CAMBIA — qui la data all'italiana si rifiuta, e la
   ragione è quella sopra, il 36,2%: è l'unica che regge. Ma una riga che porta
   una prova falsa accanto a un giudizio giusto è **peggio** di una riga senza
   prova, perché chi la riverifica fra un mese trova la prova sbagliata e butta
   via anche il giudizio. E la ragione strutturale, con i due lettori in mano,
   si capovolge: non «bisognerebbe scriverne uno», ma **«ce ne sono già due, e
   fanno scelte diverse sugli anni a due cifre»** — cioè, se un giorno servisse
   qui, la strada è portarne UNO in `shared/` dopo aver deciso quel punto, non
   scriverne un terzo. È la regola di questa casa: la risposta è quasi sempre
   già in casa, e «non c'è» va provato, non dichiarato.
   ⚠️ IL MESSAGGIO NON PROPONE LA CONVERSIONE — non scrive «volevi dire
   2026-09-01?» — proprio perché quale sia il giorno non lo sa: dice il
   formato che serve e mostra quello che ha trovato. Proporre sarebbe
   ri-decidere di straforo la cosa che si è deciso di non decidere.
   ⛔ E LE PAROLE SONO QUELLE CHE LE NOVE FUNZIONI DI B5 HANNO GIÀ, non nuove:
   censite, le loro diciassette ragioni sono convergute su quattro forme, e le
   due che servono qui sono «la data non è stata scritta» (il campo è vuoto:
   nessuno l'ha compilato) e «la data non esiste» (forma giusta, giorno
   inesistente). La data all'italiana è il terzo caso di quella scala — «c'è
   qualcosa e non si legge» — quindi porta la forma già usata da sei ragioni,
   «non si legge», con appesa la sola cosa che chi legge deve sapere per
   rimediare. La distinzione fra «non è stato scritto» e «non si legge» si
   tiene perché cambia che cosa si va a chiedere a chi ha mandato il file.
   Niente punto finale: la ragione viene composta dentro una frase più lunga.
   ✅ TRASLOCATA IN `shared/deepwork-id-client/dw-shell.js` IL 14/08, ed è la
   riga qui sotto che era rimasta indietro: per giorni questo commento ha
   dichiarato che la casa era `shared/` mentre il corpo stava qui — e la stessa
   dichiarazione, con lo stesso corpo, stava anche in `sentinella-data.js`. Chi
   la chiama non cambia niente: si ri-esporta col nome di sempre, e `run-kpi`
   pretende l'IDENTITÀ (`scudo.ragioneData === shell.ragioneData`), non il
   comportamento — due copie uguali oggi divergono domani senza che nessuno lo
   veda, ed è esattamente quello che era già cominciato a succedere.
   ⚠️ E LA FORMA DELL'ALIAS NON È INDIFFERENTE, misurato il 14/08: scritto
   `export { ragioneData } from "…"` l'alias è invisibile a `nomi-doppi.mjs`,
   che censisce i nomi con `^export function` e `^export const` — il nome non
   entra nel confronto app-contro-`shared/` e il suo denominatore non sale.
   La forma usata qui è quella che questa casa usa già per `dataPiuGiorni`, ed
   è VISTA da quel controllo. (Il verso pericoloso lo prendeva comunque: chi
   riscrivesse il corpo con `export function ragioneData(` verrebbe accusato
   di «RISCRITTA IN CASA». Ma un alias che non si conta è un soggetto in
   meno guardato, e qui i soggetti si contano.) */
import { ragioneData as ragioneDataShell } from "../../shared/deepwork-id-client/dw-shell.js";
export const ragioneData = ragioneDataShell;

// Import scadenze da CSV (onboarding: caricare lo scadenzario esistente —
// visite mediche, corsi, patentini con le date — invece di riscriverlo a
// mano). Colonne: lavoratore;tipo;descrizione;scadenza (header opzionale).
// Il lavoratore è un NOME (l'associazione all'id avviene a valle, nella UI);
// vuoto o "AZIENDA" = scadenza aziendale (lavoratore null). Tiene solo le
// righe con data valida (AAAA-MM-GG); tipo assente → "Altro". Pura e testabile.
export function parseScadenzeCsv(text) {
  return String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "lavoratore"))
    .map(r => {
      const [lavoratore, tipo, descrizione, scadenza] = parseCsvLine(r);
      const lav = (lavoratore || "").trim();
      return {
        lavoratore: (lav && !/^azienda$/i.test(lav)) ? lav : null,
        tipo: (tipo || "").trim() || "Altro",
        descrizione: (descrizione || "").trim() || null,
        dataScadenza: (scadenza || "").trim(),
      };
    })
    /* ⛔ LA FORMA NON È L'ESISTENZA (corretto il 03/08). Questo filtro guardava
       solo `/^\d{4}-\d{2}-\d{2}$/`, e «2026-13-45» ha quella forma: entrava in
       archivio e — con il vecchio `statoScadenzaHSE` — restava verde per sempre.
       Adesso si pretende che la data ESISTA davvero: `Date.parse` la rifiuta, e
       la riga non entra. */
    .filter(p => dataISOEsiste(p.dataScadenza));
}

/* Le righe dello scadenzario che NON entrano, con la ragione — vedi il blocco
   lungo sopra `scartiLavoratoriCsv` per la forma e per il perché.
   ⚠️ QUI SI PERDE SOLO PER LA DATA, e va detto perché è il contrario di quello
   che si immagina: lavoratore, tipo e descrizione sono tutti facoltativi (una
   scadenza senza lavoratore è AZIENDALE, il tipo assente diventa «Altro»), e
   l'unica cosa che fa cadere la riga è la data. Misurato il 13/08 con quattro
   righe scritte: **una entrava**, e delle tre cadute due erano una data vuota
   e una data che non esiste — giuste — mentre la terza era `01/09/2026`, cioè
   quello che un foglio di calcolo italiano scrive da sé.
   ⛔ E LA PAGINA FACEVA GIÀ METÀ DEL LAVORO, che è ciò che rendeva il buco più
   insidioso di uno silenzio pieno: contava e dichiarava i DOPPIONI e i nomi
   NON TROVATI in anagrafica, ma li contava su quello che il lettore aveva
   restituito. Le righe cadute qui dentro non erano mai esistite per lei, e un
   messaggio che elenca due categorie su tre si legge come completo. */
export function scartiScadenzeCsv(text) {
  const righe = String(text || "").split(/\r?\n/).map(r => r.trim()).filter(Boolean)
    .filter(r => !isIntestazione(r, "lavoratore"));
  const persi = [];
  let nRiga = 0, vuote = 0;
  for (const riga of righe) {
    nRiga++;
    if (parseScadenzeCsv(riga).length) continue;
    const c = parseCsvLine(riga);
    if (c.every(x => String(x == null ? "" : x).trim() === "")) { vuote++; continue; }
    /* il NOME che comparirà nel messaggio: chi legge il file cerca la persona,
       e solo se non c'è nemmeno quella ripiega sul numero di riga. */
    const lav = (c[0] || "").trim(), desc = (c[2] || "").trim(), tipo = (c[1] || "").trim();
    persi.push({ nome: lav || desc || tipo || "riga " + nRiga, ragione: ragioneData(c[3]) });
  }
  const lette = righe.length - vuote;
  return { lette, entrano: lette - persi.length, persi, vuote };
}

// ============================================================
// S4 · MANSIONI, REQUISITI DI FORMAZIONE E NOMINE
// La domanda vera del titolare non è «quanti corsi scadono», è: «CHI POSSO
// MANDARE A FARE QUEL LAVORO DOMANI MATTINA?». Per rispondere servono tre
// cose: che lavoro è (la mansione), che cosa serve per farlo (corsi,
// abilitazioni, DPI) e chi ce l'ha davvero.
// Le scadenze NON vivono in un mondo a parte: la formazione richiesta da una
// mansione è una riga dello SCADENZARIO che già esiste, con lo stesso
// semaforo (statoScadenza) usato in tutta l'app. Qui si legge quello, non si
// duplica niente.
// ============================================================

// Confronto "morbido" dei testi: minuscole, senza accenti né punteggiatura.
// Serve a riconoscere che «Corso antincendio» e «Antincendio — aggiornamento
// addetti» parlano della stessa cosa.
export function normalizzaTesto(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

// Etichetta corta (per le pillole della matrice: nello spazio di un badge non
// ci sta «Sorveglianza sanitaria — visita periodica (art. 41)»).
const BREVE_REQUISITO = {
  "sorv-sanitaria": "Visita medica",
  "form-generale":  "Formazione base",
  "form-aggiorn":   "Aggiornamento",
  "form-preposto":  "Preposto",
  "form-dirigente": "Dirigente",
  "primo-soccorso": "Primo soccorso",
  "antincendio":    "Antincendio",
  "rls":            "RLS",
  "patentino-attr": "Abilitazione attrezzature",
  "fochino":        "Fochino",
  "sorvegliante":   "Sorvegliante",
  "form-confinati": "Spazi confinati",
};
// Parole che identificano l'adempimento dentro una descrizione scritta a mano.
// Servono a NON far risultare "mancante" un corso che l'azienda ha già in
// scadenzario solo perché l'ha chiamato con parole sue.
const PAROLE_REQUISITO = {
  "sorv-sanitaria": ["visita medica", "sorveglianza sanitaria", "medico competente", "idoneita"],
  "form-generale":  ["formazione generale", "formazione specifica", "formazione lavoratori", "formazione base"],
  "form-aggiorn":   ["aggiornamento formazione", "aggiornamento lavoratori", "aggiornamento quinquennale"],
  "form-preposto":  ["preposto"],
  "form-dirigente": ["dirigente"],
  "primo-soccorso": ["primo soccorso"],
  "antincendio":    ["antincendio", "antincendi"],
  "rls":            ["rls", "rappresentante dei lavoratori"],
  "patentino-attr": ["abilitazione attrezzature", "patentino", "escavatore", "pale caricatrici", "carrello elevatore", "ple"],
  "fochino":        ["fochino", "brillamento"],
  "sorvegliante":   ["sorvegliante"],
  /* ⚠️ NON basta «confinati»: chi scrive lo scadenzario a mano usa tanto
     «spazi confinati» quanto «ambienti confinati» (è il nome che il D.P.R.
     177/2011 e il manuale della Commissione consultiva usano), e c'è chi
     scrive «DPR 177». Tre forme, un solo adempimento. */
  "form-confinati": ["spazi confinati", "ambienti confinati", "dpr 177", "sospetti di inquinamento"],
};

// I requisiti che una mansione può richiedere sono gli stessi adempimenti già
// presenti nello scadenzario (SCADENZE_PRESET): stessa etichetta, stessa
// periodicità proposta, stesso riferimento. Così, quando dalla matrice si
// aggiunge un corso mancante, nasce una scadenza IDENTICA a quelle che
// l'utente crea a mano dal menu degli adempimenti tipici.
export const REQUISITI_FORMAZIONE = SCADENZE_PRESET
  .filter(p => p.categoria === "persona" || p.chiave === "sorvegliante")
  .map(p => ({
    chiave: p.chiave, etichetta: p.etichetta, tipo: p.tipo, mesi: p.mesi,
    riferimento: p.riferimento,
    breve: BREVE_REQUISITO[p.chiave] || p.etichetta,
    parole: PAROLE_REQUISITO[p.chiave] || [],
  }));

export function requisitoFormazione(chiave) {
  return REQUISITI_FORMAZIONE.find(r => r.chiave === chiave) || null;
}
// Requisito "sicuro" anche per una chiave sconosciuta (dati vecchi o scritti a
// mano): meglio una riga con l'etichetta grezza che una schermata rotta.
export function requisitoSicuro(chiave) {
  return requisitoFormazione(chiave)
    || { chiave, etichetta: String(chiave || "requisito"), breve: String(chiave || "requisito"),
         tipo: "Formazione", mesi: null, riferimento: "", parole: [] };
}

// Una scadenza dello scadenzario "copre" un requisito?
// Tre modi, dal più sicuro al più tollerante:
//   1. la scadenza è nata da quell'adempimento (campo `preset`/`requisito`);
//   2. la descrizione è la stessa (a meno di maiuscole e accenti);
//   3. la descrizione contiene una delle parole che identificano l'adempimento.
export function scadenzaCopreRequisito(scadenza, req) {
  if (!scadenza || !req) return false;
  const ch = req.chiave;
  if (ch && (scadenza.preset === ch || scadenza.requisito === ch)) return true;
  const a = normalizzaTesto(scadenza.descrizione), b = normalizzaTesto(req.etichetta);
  if (!a) return false;
  if (b && (a === b || a.includes(b) || b.includes(a))) return true;
  return (req.parole || []).some(p => a.includes(normalizzaTesto(p)));
}

// Stato di UN requisito per UNA persona, letto dalle sue scadenze.
// "mancante" = non c'è nessuna riga in scadenzario; altrimenti lo stesso
// semaforo delle scadenze (scaduta / in-scadenza / regolare). Se ci sono più
// righe (rinnovi successivi) vale la più lontana nel tempo: è l'ultimo rinnovo.
export function statoRequisito(req, scadenzeLavoratore, oggi = new Date()) {
  const trovate = (scadenzeLavoratore || []).filter(s => scadenzaCopreRequisito(s, req));
  if (!trovate.length) return { stato: "mancante", scadenza: null, scadenzaId: null, giorni: null };
  const migliore = trovate.slice().sort((a, b) =>
    String(b.dataScadenza || "").localeCompare(String(a.dataScadenza || "")))[0];
  const g = giorniTra(migliore.dataScadenza, oggi);
  return {
    stato: statoScadenza(migliore.dataScadenza, oggi),
    scadenza: migliore.dataScadenza || null,
    scadenzaId: migliore.id || null,
    giorni: Number.isFinite(g) ? g : null,
  };
}

// Mansioni tipiche di una cava, già pronte con i loro requisiti e i loro DPI:
// si sceglie dall'elenco invece di scrivere tutto da zero, e poi si corregge.
// Come per i preset dello scadenzario: è una BASE DI PARTENZA da adattare al
// DVR e al DSS della propria cava, non un elenco di verità di legge.
export const MANSIONI_PRESET = [
  { chiave: "escavatorista", nome: "Escavatorista / palista",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "guanti"] },
  { chiave: "autista", nome: "Autista dumper / camion",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "gilet", "guanti"] },
  { chiave: "perforatore", nome: "Perforatore",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "patentino-attr"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "maschera", "antivibranti"] },
  { chiave: "fochino", nome: "Fochino",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn", "fochino"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "occhiali", "guanti"] },
  { chiave: "impianto", nome: "Addetto impianto / frantoio",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "gilet", "otoprotettori", "maschera", "guanti"] },
  { chiave: "manutentore", nome: "Manutentore / officina",
    requisiti: ["sorv-sanitaria", "form-generale", "form-aggiorn"],
    dpi: ["elmetto", "scarpe", "occhiali", "guanti", "otoprotettori"] },
  { chiave: "preposto", nome: "Preposto di cava",
    requisiti: ["sorv-sanitaria", "form-generale", "form-preposto"],
    dpi: ["elmetto", "scarpe", "gilet"] },
  { chiave: "sorvegliante", nome: "Sorvegliante",
    requisiti: ["sorv-sanitaria", "form-generale", "sorvegliante"],
    dpi: ["elmetto", "scarpe", "gilet"] },
  { chiave: "uffici", nome: "Ufficio e pesa",
    requisiti: ["sorv-sanitaria", "form-generale"],
    dpi: ["gilet", "scarpe"] },
];
export function mansionePreset(chiave) {
  return MANSIONI_PRESET.find(m => m.chiave === chiave) || null;
}

// ============================================================
// S5 · DPI — CATALOGO E CONSEGNE
// Art. 77 D.Lgs 81/08: i DPI si consegnano in modo documentato, e per i DPI
// di III categoria e per i protettori dell'udito l'ADDESTRAMENTO è
// obbligatorio (in cava sono entrambi la norma, non l'eccezione).
// La "durata" è la vita utile indicativa dichiarata dal costruttore: qui è
// solo una PROPOSTA per calcolare la data di sostituzione, non una regola.
// ============================================================
export const TIPI_DPI = [
  { chiave: "elmetto",       etichetta: "Elmetto",                          breve: "Elmetto",        cat: "II",  addestramento: false, mesi: 60 },
  { chiave: "scarpe",        etichetta: "Scarpe antinfortunistiche",        breve: "Scarpe",         cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "gilet",         etichetta: "Indumenti ad alta visibilità",     breve: "Alta visibilità",cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "guanti",        etichetta: "Guanti da lavoro / antitaglio",    breve: "Guanti",         cat: "II",  addestramento: false, mesi: 12 },
  { chiave: "occhiali",      etichetta: "Occhiali o visiera",               breve: "Occhiali",       cat: "II",  addestramento: false, mesi: 24 },
  { chiave: "otoprotettori", etichetta: "Otoprotettori (cuffie o inserti)", breve: "Otoprotettori",  cat: "II",  addestramento: true,  mesi: 12,
    nota: "Protettori dell'udito: l'addestramento è obbligatorio anche se non sono di III categoria." },
  { chiave: "maschera",      etichetta: "Facciale filtrante / respiratore", breve: "Maschera",       cat: "III", addestramento: true,  mesi: 12,
    nota: "Contro le polveri (silice cristallina respirabile): III categoria, addestramento obbligatorio." },
  { chiave: "imbracatura",   etichetta: "Imbracatura anticaduta",           breve: "Imbracatura",    cat: "III", addestramento: true,  mesi: 12,
    nota: "III categoria: addestramento obbligatorio e controllo periodico del dispositivo." },
  { chiave: "dielettrici",   etichetta: "Guanti e attrezzi dielettrici",    breve: "Dielettrici",    cat: "III", addestramento: true,  mesi: 12,
    nota: "III categoria (rischio elettrico): addestramento obbligatorio." },
  { chiave: "antivibranti",  etichetta: "Guanti antivibranti",              breve: "Antivibranti",   cat: "II",  addestramento: false, mesi: 12 },
  { chiave: "indumenti",     etichetta: "Indumenti da lavoro",              breve: "Indumenti",      cat: "I",   addestramento: false, mesi: null },
  { chiave: "altro",         etichetta: "Altro DPI",                        breve: "Altro DPI",      cat: "II",  addestramento: false, mesi: null },
];
export function tipoDpi(chiave) {
  return TIPI_DPI.find(t => t.chiave === chiave) || null;
}
export function tipoDpiSicuro(chiave) {
  return tipoDpi(chiave)
    || { chiave, etichetta: String(chiave || "DPI"), breve: String(chiave || "DPI"), cat: "II", addestramento: false, mesi: null };
}

// Ultima consegna di quel tipo di DPI a quella persona (la più recente).
export function ultimaConsegnaDpi(consegne, lavoratoreId, tipo) {
  const list = (consegne || []).filter(c => c.lavoratoreId === lavoratoreId && c.tipo === tipo);
  if (!list.length) return null;
  return list.slice().sort((a, b) =>
    String(b.dataConsegna || "").localeCompare(String(a.dataConsegna || "")))[0];
}
// Stato di una consegna: "mancante" (mai consegnato) oppure lo stesso semaforo
// delle scadenze sulla data di sostituzione. `addestramentoMancante` è vero
// quando il tipo lo richiede e non risulta fatto.
//
// ⛔ UNA CONSEGNA SENZA DATA DI SOSTITUZIONE NON È «REGOLARE» — decisione 14
// del fondatore, 02/08. Fino a quel giorno il ternario qui sotto rispondeva
// `"regolare"` quando la casella era vuota, e da lì in poi quel dispositivo
// non produceva **mai più** un avviso di sostituzione: nella tabella la data
// si leggeva «—» e nel riepilogo il pezzo risultava a posto. Su un facciale
// filtrante contro la silice quel verde diceva una cosa che nessuno aveva
// misurato — il form la scadenza la PROPONE dai mesi del tipo, ma si può
// svuotare, e allora l'unica cosa che si sa è che il DPI è stato consegnato.
// La risposta è `"senza data"`, che NON è una parola nuova: è la convenzione
// che `statoScadenzaHSE` usa già in tre app, e che i trenta punti di Scudo che
// confrontano con `!== "regolare"` cominciano da soli a mostrare fra le cose
// da guardare. Basta quindi togliere il ternario e lasciar rispondere lei.
// `nonScade` è la via d'uscita, e serve: `TIPI_DPI` ha due voci con `mesi:
// null` (indumenti da lavoro, «altro DPI») per cui una data non si può
// nemmeno proporre. Chi dichiara che quel pezzo non ha una vita utile lo
// scrive, e da quel momento il verde è una risposta MISURATA invece che un
// vuoto travestito.
/* ⛔ `leggibile` DICE SE LA DATA DI CONSEGNA SI PUÒ LEGGERE, e non c'era.
   Misurato il 08/08 mettendo i due fogli sugli stessi dati: la colonna
   «Sostituire entro» del verbale, corretta il 03/08 per questa identica
   ragione, su una scadenza assente scrive «non indicata»; la colonna accanto —
   «Consegnato il» — su una data assente, vuota o **impossibile** scriveva
   «—», che su un foglio stampato si legge «non serve». Ed è la data che quel
   foglio esiste per provare: un verbale di consegna dei DPI (art. 77 D.Lgs
   81/2008) lo firma il lavoratore, e senza il giorno non prova niente.
   Lo stato lo decide il modulo e le tre stampe lo LEGGONO — è la regola già
   scritta nel commento della colonna vicina: «la colonna legge lo stato della
   riga, non ri-decide».
   ⚠️ Raggiungibilità dichiarata, non gonfiata: il form pretende la data
   (`if (!lavoratoreId || !tipo || !dataConsegna)`) e un import dei DPI non
   esiste, quindi oggi il caso arriva solo da dati vecchi o scritti a mano —
   **latente, non impossibile**, come per `rilievoUsabile` in Terra. */
export function statoConsegnaDpi(consegna, oggi = new Date()) {
  if (!consegna) return { stato: "mancante", scadenza: null, addestramentoMancante: false, nonScade: false, leggibile: false };
  const t = tipoDpi(consegna.tipo);
  const nonScade = consegna.nonScade === true;
  return {
    stato: nonScade ? "regolare" : statoScadenza(consegna.scadenza, oggi),
    scadenza: consegna.scadenza || null,
    addestramentoMancante: !!(t && t.addestramento) && !consegna.addestramento,
    nonScade,
    leggibile: dataISOEsiste(String(consegna.dataConsegna == null ? "" : consegna.dataConsegna).slice(0, 10)),
  };
}

// ============================================================
// LA MATRICE: chi può fare quel lavoro domani mattina
// Quattro risposte, perché di mattina non c'è tempo di leggere una tabella:
//   · "puo"      → può andare;
//   · "attenzione" → può andare, ma c'è qualcosa da sistemare (un corso che
//                    scade, un DPI da consegnare o un addestramento da fare);
//   · "non-so"   → non lo sappiamo: nessuno ha ancora scritto che cosa serve
//                  per questa mansione (decisione 14 → vedi qui sotto);
//   · "no"       → non può: manca o è scaduto qualcosa di bloccante.
// Bloccano: persona non in forza, idoneità sanitaria negativa, un corso
// richiesto mancante o scaduto. I DPI NON bloccano ma pesano: l'app sa se la
// consegna è REGISTRATA, non se il lavoratore ha l'elmetto in mano — dirlo
// come certezza sarebbe una bugia. Restano in evidenza, non nascosti.
//
// ⛔ LA QUARTA RISPOSTA — decisione 13 del fondatore, 02/08. Una mansione
// creata, con le persone assegnate, ma per cui **nessuno ha ancora scritto
// quali corsi servono**: fino a quel giorno tutti risultavano «può andare», in
// verde. Tecnicamente coerente — non è richiesto niente, quindi non manca
// niente — ma le due letture di quel verde sono opposte: «questa mansione non
// richiede corsi particolari» oppure «nessuno ha ancora detto che cosa serve»,
// che su una mansione appena creata è il caso più probabile. Il fondatore ha
// scelto: **non lo sappiamo**, uno stato suo, distinto sia da «può» sia da
// «non può», e i conteggi lo dicono invece di assorbirlo nel verde.
// La via d'uscita è una dichiarazione, non un silenzio: `nessunRequisito` sulla
// mansione vuol dire «per questo lavoro non servono corsi», e da quel momento
// il verde torna a essere una risposta misurata.
// ============================================================

/* Il verso in cui le quattro risposte si scavalcano, in una funzione sua e non
   dentro un ternario lungo: è una MAPPA DI STATI, e la regola 18 di
   `run-stile.mjs` la può leggere solo se le risposte stanno in dei `return`.
   ⛔ L'ordine non è estetico. «no» viene per primo anche quando i requisiti
   sono ignoti, perché un bloccante è una cosa MISURATA (non è in forza, è
   stato giudicato non idoneo alla visita): quella la sappiamo, e sapere che
   non può andare batte non sapere che cosa gli servirebbe.
   E «non-so» viene PRIMA di «attenzione» perché «attenzione» afferma «può
   andare, ma…», e quel «può andare» è esattamente ciò che non si può dire. */
export function esitoAbilitazione(bloccanti, attenzioni, requisitiIgnoti) {
  if ((bloccanti || []).length) return "no";
  if (requisitiIgnoti) return "non-so";
  if ((attenzioni || []).length) return "attenzione";
  return "puo";
}

/* «Di questa mansione non si sa che cosa richieda»: nessun requisito censito e
   nessuno ha dichiarato che non ne servono. Una mansione che dichiara
   `nessunRequisito` ha una risposta, ed è «non ne servono». */
export function requisitiIgnoti(mansione) {
  const m = mansione || {};
  if (m.nessunRequisito === true) return false;
  return !((m.requisiti || []).length);
}
export function abilitazioneLavoratore(lav, mansione, scadenze, consegneDpi, oggi = new Date()) {
  const l = lav || {};
  const scLav = (scadenze || []).filter(s => s.lavoratoreId === l.id);
  const requisiti = ((mansione && mansione.requisiti) || []).map(ch => {
    const req = requisitoSicuro(ch);
    const st = statoRequisito(req, scLav, oggi);
    return { chiave: req.chiave, etichetta: req.etichetta, breve: req.breve, mesi: req.mesi, ...st };
  });
  const dpi = ((mansione && mansione.dpi) || []).map(ch => {
    const t = tipoDpiSicuro(ch);
    const c = ultimaConsegnaDpi(consegneDpi, l.id, ch);
    const st = statoConsegnaDpi(c, oggi);
    return { chiave: t.chiave, etichetta: t.etichetta, breve: t.breve || t.etichetta, cat: t.cat, consegna: c, ...st };
  });
  const bloccanti = [], attenzioni = [];
  if (l.attivo === false) bloccanti.push("non è in forza");
  if (l.idoneita === "non-idoneo") bloccanti.push("giudicato non idoneo alla visita medica");
  if (l.idoneita === "prescrizioni") attenzioni.push("idoneo con prescrizioni");
  for (const r of requisiti) {
    if (r.stato === "mancante") bloccanti.push("manca " + r.breve.toLowerCase());
    else if (r.stato === "scaduta") bloccanti.push(r.breve.toLowerCase() + " scaduta il " + dataIt(r.scadenza));
    else if (r.stato === "in-scadenza") attenzioni.push(r.breve.toLowerCase() + " in scadenza");
  }
  for (const d of dpi) {
    if (d.stato === "mancante") attenzioni.push(d.etichetta.toLowerCase() + ": consegna mai registrata");
    else if (d.stato === "scaduta") attenzioni.push(d.etichetta.toLowerCase() + " da sostituire");
    else if (d.stato === "in-scadenza") attenzioni.push(d.etichetta.toLowerCase() + " in scadenza");
    // decisione 14: consegnato, ma nessuno ha detto entro quando va sostituito
    else if (d.stato === "senza data") attenzioni.push(d.etichetta.toLowerCase() + ": " + MOTIVO_SENZA_SOSTITUZIONE);
    if (d.addestramentoMancante && d.stato !== "mancante") attenzioni.push("addestramento " + d.etichetta.toLowerCase() + " da registrare");
  }
  const ignoti = requisitiIgnoti(mansione);
  const esito = esitoAbilitazione(bloccanti, attenzioni, ignoti);
  return { lavoratore: l, mansione: mansione || null, requisiti, dpi, bloccanti, attenzioni,
           requisitiIgnoti: ignoti, esito };
}

/* ⛔ UN ID ASSEGNATO A CUI NON CORRISPONDE PIÙ NESSUNO NON È UNA PERSONA IN
   MENO: È UNA PERSONA DI CUI NON SI SA NIENTE (03/08).
   `matriceMansione` costruisce le righe con `.find(...)` + `.filter(Boolean)`:
   un id rimasto in `lavoratoriIds` dopo che il lavoratore è stato tolto
   dall'anagrafica sparisce, e con lui sparisce il suo stato. Non è un caso di
   laboratorio — `db.rimuovi("lavoratori", …)` cancella la persona e NON tocca
   le mansioni (la finestra di conferma parla delle scadenze e non le nomina).
   Misurato su una mansione con due assegnati di cui uno cancellato: la
   pastiglia dell'elenco passa da «1/2» a «1/1», cioè dal giallo al VERDE, e la
   riga scrive «1 persona» dove ne risultano assegnate due. Se quello tolto era
   proprio il «no», il rosso della mansione se ne va con lui.
   La regola non è nuova ed è nello stesso file, dodici funzioni più su:
   `organigrammaSicurezza` conta `senzaPersona` e la pagina scrive «persona non
   più in anagrafica», perché «una nomina copre il ruolo solo se la persona c'è
   ancora». Qui non era arrivata. Si conta a parte — non fra chi può, non fra
   chi non può — e chi guarda la mansione lo legge. */
export function assegnatiSenzaAnagrafe(mansione, lavoratori) {
  const ids = (mansione && mansione.lavoratoriIds) || [];
  const noti = new Set((lavoratori || []).map(l => l && l.id));
  return ids.filter(id => !noti.has(id)).length;
}

// La matrice di UNA mansione: una riga per persona, prima chi può andare.
export function matriceMansione(mansione, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  const ids = (mansione && mansione.lavoratoriIds) || [];
  const ordine = { puo: 0, attenzione: 1, "non-so": 2, no: 3 };
  return ids
    .map(id => (lavoratori || []).find(l => l.id === id))
    .filter(Boolean)
    .map(l => abilitazioneLavoratore(l, mansione, scadenze, consegneDpi, oggi))
    .sort((a, b) => (ordine[a.esito] - ordine[b.esito])
      || String(a.lavoratore.nome || "").localeCompare(String(b.lavoratore.nome || ""), "it"));
}

// Riepilogo di tutte le mansioni (per il quadro d'insieme e per il grafico):
// quante persone possono andare, quante con riserva, quante no.
export function riepilogoMansioni(mansioni, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  return (mansioni || []).map(m => {
    const righe = matriceMansione(m, lavoratori, scadenze, consegneDpi, oggi);
    return {
      mansione: m, totale: righe.length,
      puo: righe.filter(r => r.esito === "puo").length,
      attenzione: righe.filter(r => r.esito === "attenzione").length,
      /* decisione 13: le persone di cui non si sa. NON si sommano ai «puo» —
         era esattamente quello che succedeva prima, e il numero verde in cima
         alla matrice le contava fra chi può andare domani mattina. */
      nonSo: righe.filter(r => r.esito === "non-so").length,
      no: righe.filter(r => r.esito === "no").length,
      /* Gli id assegnati che in anagrafica non esistono più. NON si sommano né
         a `totale` né a nessuno dei quattro esiti: non sono persone di cui si
         sa qualcosa, sono righe rimaste appese. `assegnati` è il numero che
         c'è scritto sulla mansione, e la differenza col `totale` è tutta qui. */
      assegnati: ((m && m.lavoratoriIds) || []).length,
      senzaPersona: assegnatiSenzaAnagrafe(m, lavoratori),
      requisitiIgnoti: requisitiIgnoti(m),
      righe,
    };
  }).sort((a, b) => (b.no - a.no) || (b.attenzione - a.attenzione) || (b.nonSo - a.nonSo)
    || (b.senzaPersona - a.senzaPersona)
    || String(a.mansione.nome || "").localeCompare(String(b.mansione.nome || ""), "it"));
}

// Le persone che oggi NON possono fare almeno una delle mansioni assegnate:
// è il numero che va in cima al Quadro, perché è quello che ferma il lavoro.
export function lavoratoriScoperti(mansioni, lavoratori, scadenze, consegneDpi, oggi = new Date()) {
  const per = new Map();
  for (const m of mansioni || []) {
    for (const r of matriceMansione(m, lavoratori, scadenze, consegneDpi, oggi)) {
      if (r.esito !== "no") continue;
      const id = r.lavoratore.id;
      const v = per.get(id) || { lavoratore: r.lavoratore, mansioni: [], motivi: [] };
      v.mansioni.push(m.nome);
      for (const b of r.bloccanti) if (!v.motivi.includes(b)) v.motivi.push(b);
      per.set(id, v);
    }
  }
  return [...per.values()].sort((a, b) =>
    String(a.lavoratore.nome || "").localeCompare(String(b.lavoratore.nome || ""), "it"));
}

// ============================================================
// NOMINE DELLA SICUREZZA
// In cava il SORVEGLIANTE è obbligatorio (D.Lgs 624/96) e il PREPOSTO va
// individuato formalmente (D.Lgs 81/08, modificato dal D.L. 146/2021): non
// basta che qualcuno "faccia da capo". Qui si tiene chi è nominato, da
// quando, e se la formazione collegata è in regola — sempre leggendo lo
// scadenzario, mai un elenco parallelo.
// Nota informativa, non un parere legale: obblighi e figure vanno confermati
// con l'RSPP e il consulente dell'azienda.
// ============================================================
export const NOMINE_RUOLI = [
  { chiave: "sorvegliante", etichetta: "Sorvegliante", breve: "Sorvegliante", obbligatoria: true, multiplo: true,
    requisito: "sorvegliante",
    riferimento: "D.Lgs 624/96 — figura obbligatoria nelle attività estrattive.",
    spiega: "È chi controlla ogni giorno i luoghi di lavoro della cava e ferma ciò che non va." },
  { chiave: "direttore", etichetta: "Direttore responsabile", breve: "Direttore", obbligatoria: true, multiplo: false,
    requisito: null,
    riferimento: "D.Lgs 624/96 — responsabile della conduzione dell'attività estrattiva.",
    spiega: "È la persona che risponde della conduzione tecnica della cava." },
  { chiave: "preposto", etichetta: "Preposto", breve: "Preposto", obbligatoria: true, multiplo: true,
    requisito: "form-preposto",
    riferimento: "D.Lgs 81/08 e D.L. 146/2021 — individuazione obbligatoria e aggiornamento almeno biennale.",
    spiega: "Sovrintende al lavoro degli altri e interviene subito se qualcuno lavora male." },
  { chiave: "rspp", etichetta: "RSPP", breve: "RSPP", obbligatoria: true, multiplo: false, requisito: null,
    riferimento: "D.Lgs 81/08 art. 17 — designazione obbligatoria, non delegabile dal datore di lavoro.",
    spiega: "Responsabile del servizio di prevenzione e protezione: interno o consulente esterno." },
  { chiave: "medico", etichetta: "Medico competente", breve: "Medico", obbligatoria: true, multiplo: false, requisito: null,
    riferimento: "D.Lgs 81/08 art. 18 — obbligatorio quando è prevista la sorveglianza sanitaria (in cava, di norma, sì).",
    spiega: "Fa le visite mediche e decide l'idoneità alla mansione." },
  { chiave: "rls", etichetta: "RLS", breve: "RLS", obbligatoria: true, multiplo: true, requisito: "rls",
    riferimento: "D.Lgs 81/08 artt. 47-50 — rappresentante dei lavoratori per la sicurezza.",
    spiega: "Eletto dai lavoratori: va formato e aggiornato ogni anno." },
  { chiave: "primo-soccorso", etichetta: "Addetto primo soccorso", breve: "Primo soccorso", obbligatoria: true, multiplo: true,
    requisito: "primo-soccorso",
    riferimento: "D.Lgs 81/08 art. 45 e D.M. 388/2003 — addetti designati e formati.",
    spiega: "Deve essercene almeno uno presente quando si lavora." },
  { chiave: "antincendio", etichetta: "Addetto antincendio ed evacuazione", breve: "Antincendio", obbligatoria: true, multiplo: true,
    requisito: "antincendio",
    riferimento: "D.Lgs 81/08 art. 43 e D.M. 2 settembre 2021 — addetti designati e formati.",
    spiega: "Deve essercene almeno uno presente quando si lavora." },
  { chiave: "dirigente", etichetta: "Dirigente", breve: "Dirigente", obbligatoria: false, multiplo: true,
    requisito: "form-dirigente",
    riferimento: "D.Lgs 81/08 — chi organizza il lavoro con poteri di spesa e decisione.",
    spiega: "Serve solo se in azienda c'è davvero questa figura." },
];
export function ruoloNomina(chiave) {
  return NOMINE_RUOLI.find(r => r.chiave === chiave) || null;
}
// Una nomina è ATTIVA oggi se è già decorsa e non è ancora finita.
export function nominaAttiva(n, oggi = new Date()) {
  if (!n) return false;
  if (n.dal) { const g = giorniTra(n.dal, oggi); if (Number.isFinite(g) && g > 0) return false; }
  if (n.al)  { const g = giorniTra(n.al, oggi);  if (Number.isFinite(g) && g < 0) return false; }
  return true;
}
// L'organigramma della sicurezza: un blocco per ruolo, con chi c'è e com'è
// messa la sua formazione. `mancante` = ruolo obbligatorio senza nessuno.
/* ⛔ «DI QUESTA NOMINA UNA DATA NON SI LEGGE» È UNA REGOLA SOLA, E STAVA
   SCRITTA DUE VOLTE CON DUE COMPORTAMENTI. Il 07/08 `organigrammaSicurezza`
   ha imparato a guardare anche la data di FINE (con una `al` illeggibile
   `nominaAttiva` non scatta — `giorniTra` risponde `NaN` — e il ruolo usciva
   verde su una nomina scaduta chissà quando). La `cartellaLavoratore` non l'ha
   saputo: la sua riga guardava solo `dal`, col commento che dichiarava «è la
   stessa regola di `organigrammaSicurezza`» — cioè la copia debole che si
   annuncia gemella. Misurato: nomina con `al: "2026-13-45"`, l'Organigramma la
   conta in `senzaData` e colora il ruolo, il **fascicolo che si stampa per
   l'ispettore** non scrive niente e chiude con la riga tranquilla.
   Adesso la domanda è una funzione sola e le due la CHIAMANO: un alias non è
   una seconda implementazione, e la prova pretende che rispondano uguale. */
/* QUALE delle due date non si legge, e non solo «una delle due»: le due cose
   sono due lavori diversi (scrivere da quando decorre, correggere la fine) e
   il fascicolo le elenca separate. È la firma allargata invece della copia —
   `nominaSenzaDataLeggibile` è la stessa domanda con la risposta ridotta a
   sì/no, non una seconda implementazione.
   `dal` si pretende sempre (una nomina che non dice da quando decorre non si
   dimostra), `al` solo quando c'è: una nomina senza fine è a tempo
   indeterminato, non una nomina rotta. */
function dateNominaIlleggibili(n) {
  const x = n || {};
  return { dal: !dataISOEsiste(x.dal), al: !!x.al && !dataISOEsiste(x.al) };
}
function nominaSenzaDataLeggibile(n) {
  const d = dateNominaIlleggibili(n);
  return d.dal || d.al;
}

export function organigrammaSicurezza(nomine, lavoratori, scadenze, oggi = new Date()) {
  return NOMINE_RUOLI.map(r => {
    const attive = (nomine || []).filter(n => n.ruolo === r.chiave && nominaAttiva(n, oggi));
    const req = r.requisito ? requisitoFormazione(r.requisito) : null;
    const persone = attive.map(n => {
      const l = (lavoratori || []).find(x => x.id === n.lavoratoreId) || null;
      const form = (req && l)
        ? statoRequisito(req, (scadenze || []).filter(s => s.lavoratoreId === l.id), oggi)
        : null;
      return { nomina: n, lavoratore: l, requisito: req, formazione: form };
    });
    const senzaFormazione = persone.filter(p => p.formazione &&
      (p.formazione.stato === "mancante" || p.formazione.stato === "scaduta")).length;
    const inScadenza = persone.filter(p => p.formazione && p.formazione.stato === "in-scadenza").length;
    // ⛔ UNA NOMINA COPRE IL RUOLO SOLO SE LA PERSONA C'È ANCORA.
    // Una nomina che punta a un lavoratore cancellato dall'anagrafica — o non
    // più in forza — non copre niente: il ruolo è scoperto. Prima il conto
    // guardava soltanto quante nomine c'erano, e otto ruoli obbligatori di
    // legge (RSPP, medico competente, sorvegliante…) restavano VERDI su una
    // sedia vuota. La nomina resta comunque nell'elenco: si deve poter capire
    // chi era, e la pagina lo scrive («persona non più in anagrafica»).
    const valide = persone.filter(p => p.lavoratore && p.lavoratore.attivo !== false);
    const senzaPersona = persone.length - valide.length;
    const mancante = !!r.obbligatoria && valide.length === 0;
    /* ⛔ UNA NOMINA SENZA LA DATA DA CUI DECORRE È UNA NOMINA CHE NON SI PUÒ
       DIMOSTRARE. `nominaAttiva` la tiene per attiva — ed è giusto, il contrario
       direbbe «nessuno è nominato» su un ruolo che una persona ce l'ha — ma il
       ruolo usciva verde e la pastiglia diceva «Nomina attiva» / «In regola»:
       il colore tranquillo su un dato che nessuno ha scritto. È un avviso, non
       un allarme (la persona c'è), quindi giallo e non rosso.
       Il form scrive sempre una data (`dal || oggiISO()`): ci si arriva con un
       import o con un dato vecchio. `dataISOEsiste` e non `!n.dal`, perché una
       data impossibile — «2025-02-30» — è illeggibile quanto una mancante. */
    /* ⛔ E GUARDAVA SOLO `dal`. Misurato il 07/08: con una data di FINE
       illeggibile («2026-13-45», «2026-02-30», «boh») la nomina resta attiva —
       `giorniTra` risponde `NaN` e la guardia di `nominaAttiva` non scatta —
       e siccome `senzaData` non la guardava, il ruolo obbligatorio usciva
       VERDE «In regola» su una nomina scaduta chissà quando.
       ⚠️ E la correzione NON va in `nominaAttiva`: provata lì, faceva SPARIRE
       la nomina dall'elenco, e due prove esistenti l'hanno fermata con la loro
       ragione scritta — «la nomina resta comunque nell'elenco: si deve poter
       capire chi era». Una data illeggibile non è un motivo per nascondere: è
       un motivo per DICHIARARE. Quindi si allarga la bandiera, che è già il
       posto dove questa app dice «questa data non si legge». */
    const senzaData = valide.filter(p => nominaSenzaDataLeggibile(p.nomina)).length;
    const stato = (mancante || senzaFormazione || senzaPersona) ? "danger"
      : (inScadenza || senzaData) ? "warn" : (valide.length ? "ok" : "mute");
    return { ruolo: r, persone, valide, senzaPersona, senzaData, mancante, senzaFormazione, inScadenza, stato, requisito: req };
  });
}
// Quello che va sistemato subito: ruoli obbligatori scoperti e nominati senza
// la formazione in regola. Alimenta le urgenze del Quadro.
export function nomineDaSistemare(organigramma) {
  return (organigramma || []).filter(x => x.stato === "danger");
}

// ============================================================
// DPI: quello che deve EMERGERE
// Un elenco di consegne non serve a niente se non dice chi è scoperto. Qui si
// incrociano le mansioni (che dicono quali DPI servono) con le consegne
// registrate: mai consegnato, da sostituire, addestramento non registrato.
// ============================================================
// ⛔ IL MOTIVO SI SCRIVE UNA VOLTA SOLA. `riepilogoDpi` conta le righe
// cercando il motivo DENTRO il testo (`motivo.includes(...)`): due stesure
// della stessa frase, in due punti di `allarmiDpi`, e il conteggio ne vedrebbe
// una sola — senza nessun errore da leggere. La frase è distinta da «da
// sostituire» di proposito: sono due lavori diversi, uno è comprare il pezzo
// nuovo, l'altro è andare a leggere il libretto del costruttore.
export const MOTIVO_SENZA_SOSTITUZIONE = "senza data di sostituzione";

export function allarmiDpi(mansioni, lavoratori, consegne, oggi = new Date()) {
  const out = [], indice = new Map();
  const lavById = Object.fromEntries((lavoratori || []).map(l => [l.id, l]));
  // Una riga per persona e dispositivo: se sullo stesso elmetto c'è più di un
  // problema (scaduto E senza addestramento) si scrivono nella stessa riga.
  // Due righe uguali una sotto l'altra sembrano un errore del programma.
  const aggiungi = (lav, tipo, etichetta, motivo, gravita, mansione, scadenza, consegnaId, addestramento) => {
    const k = lav.id + "|" + tipo;
    const gia = indice.get(k);
    if (gia) {
      if (!gia.motivo.includes(motivo)) gia.motivo += " · " + motivo;
      if (gravita === "danger") gia.gravita = "danger";
      if (!gia.mansione && mansione) gia.mansione = mansione;
      if (addestramento) gia.addestramento = true;
      return;
    }
    const rec = { lavoratoreId: lav.id, lavoratore: lav.nome, tipo, etichetta, motivo, gravita,
      mansione: mansione || "", scadenza: scadenza || null, consegnaId: consegnaId || null,
      addestramento: !!addestramento };
    indice.set(k, rec);
    out.push(rec);
  };
  for (const m of mansioni || []) {
    for (const id of m.lavoratoriIds || []) {
      const l = lavById[id];
      if (!l || l.attivo === false) continue;
      for (const ch of m.dpi || []) {
        const t = tipoDpiSicuro(ch);
        const c = ultimaConsegnaDpi(consegne, id, ch);
        const st = statoConsegnaDpi(c, oggi);
        const cid = c ? c.id : null;
        if (st.stato === "mancante") aggiungi(l, ch, t.etichetta, "mai consegnato", "danger", m.nome, null, null, false);
        else if (st.stato === "scaduta") aggiungi(l, ch, t.etichetta, "da sostituire", "danger", m.nome, st.scadenza, cid, false);
        else if (st.stato === "in-scadenza") aggiungi(l, ch, t.etichetta, "in scadenza", "warn", m.nome, st.scadenza, cid, false);
        // decisione 14: è GIALLO, non rosso — il dispositivo c'è, quello che
        // manca è la data entro cui va sostituito. Non si sa se è ancora buono.
        else if (st.stato === "senza data") aggiungi(l, ch, t.etichetta, MOTIVO_SENZA_SOSTITUZIONE, "warn", m.nome, null, cid, false);
        if (st.addestramentoMancante && st.stato !== "mancante")
          aggiungi(l, ch, t.etichetta, "addestramento non registrato", "warn", m.nome, null, cid, true);
      }
    }
  }
  // Addestramento mancante anche fuori dalle mansioni: un DPI di III categoria
  // consegnato senza addestramento è comunque una cosa fuori posto (art. 77).
  for (const c of consegne || []) {
    const l = lavById[c.lavoratoreId];
    if (!l || l.attivo === false) continue;
    const t = tipoDpiSicuro(c.tipo);
    const st = statoConsegnaDpi(c, oggi);
    if (st.stato === "scaduta") aggiungi(l, c.tipo, t.etichetta, "da sostituire", "danger", "", st.scadenza, c.id, false);
    if (st.stato === "senza data") aggiungi(l, c.tipo, t.etichetta, MOTIVO_SENZA_SOSTITUZIONE, "warn", "", null, c.id, false);
    if (st.addestramentoMancante) aggiungi(l, c.tipo, t.etichetta, "addestramento non registrato", "warn", "", null, c.id, true);
  }
  const peso = { danger: 0, warn: 1 };
  return out.sort((a, b) => (peso[a.gravita] - peso[b.gravita])
    || String(a.lavoratore || "").localeCompare(String(b.lavoratore || ""), "it"));
}

export function riepilogoDpi(consegne, allarmi) {
  const list = consegne || [], al = allarmi || [];
  return {
    consegne: list.length,
    persone: new Set(list.map(c => c.lavoratoreId)).size,
    daSistemare: al.length,
    mancanti: al.filter(a => a.motivo.includes("mai consegnato")).length,
    daSostituire: al.filter(a => a.motivo.includes("da sostituire")).length,
    addestramenti: al.filter(a => a.motivo.includes("addestramento non registrato")).length,
    // decisione 14: il conteggio deve DIRLO, non assorbirlo nel verde.
    senzaSostituzione: al.filter(a => a.motivo.includes(MOTIVO_SENZA_SOSTITUZIONE)).length,
  };
}

// Righe del VERBALE DI CONSEGNA di una persona: tutte le consegne, dalla più
// recente. È il foglio che in ispezione viene chiesto per primo (art. 77).
export function verbaleDpi(lavoratore, consegne, oggi = new Date()) {
  const id = lavoratore && lavoratore.id;
  const righe = (consegne || []).filter(c => c.lavoratoreId === id)
    .slice().sort((a, b) => String(b.dataConsegna || "").localeCompare(String(a.dataConsegna || "")))
    .map(c => {
      const t = tipoDpiSicuro(c.tipo);
      const st = statoConsegnaDpi(c, oggi);
      return { consegna: c, tipo: t, stato: st.stato, leggibile: st.leggibile,
        addestramentoRichiesto: !!t.addestramento, addestramentoFatto: !!c.addestramento };
    });
  return {
    lavoratore: lavoratore || null,
    righe,
    conAddestramento: righe.filter(r => r.addestramentoRichiesto).length,
    addestramentiMancanti: righe.filter(r => r.addestramentoRichiesto && !r.addestramentoFatto).length,
  };
}

/* LA CARTELLA DEL LAVORATORE — il fascicolo che si esibisce all'ispettore.
   ═══════════════════════════════════════════════════════════════════════
   Era l'ultimo pezzo davvero mancante dei cinque documenti prioritari: il
   verbale DPI si stampava già, la cartella no.

   ⛔ NON CALCOLA NIENTE DI NUOVO, ed è il punto. Tutto quello che serve Scudo
   lo sa già dire — `statoScadenza`, `matriceMansione`, `verbaleDpi`,
   `nominaAttiva`. Questa funzione mette in fila per UNA persona quello che
   l'app sa già, nell'ordine in cui un ispettore lo chiede. Scriverci dentro un
   secondo calcolo sarebbe l'ennesima copia di una regola.

   ⛔ QUELLO CHE INVECE VALE LA PENA SCRIVERE È `vuoti`, e la ragione è che un
   fascicolo stampato mente **per omissione**: una sezione vuota su un foglio
   che esce dalla stampante si legge «a questa persona non serve», mentre la
   verità è «non è stato registrato niente». Sono due frasi diverse davanti a
   un ispettore, e la seconda va scritta.
   Il caso che ha cambiato il disegno mentre lo provavo in scratchpad: una
   persona **senza mansione**. Il primo prototipo la trattava come chiunque
   altro e la cartella usciva con corsi e DPI vuoti — che si legge «non gli
   spetta niente». Senza mansione invece non si SA che cosa gli spetti: è
   `matriceMansione` a dirlo, e senza mansione quella domanda non ha risposta.

   `completa` è false appena c'è un vuoto: un fascicolo senza dati non è il
   fascicolo di una persona in regola, è un fascicolo non compilato. */
/* LO STATO DI UN DOCUMENTO, DECISO IN UN POSTO SOLO (03/08).
   ═══════════════════════════════════════════════════════════════════════
   La mappa stava SOLO nella pagina (`const D = {valido, da-rivedere,
   scaduto}` + il ripiego giallo «Stato non indicato»), e serviva a disegnare
   l'elenco dei Documenti. Poi è arrivata la CARTELLA del lavoratore, che
   quello stato non lo aveva a portata di mano e quindi ha stampato la riga
   SENZA: sul fascicolo che si esibisce all'ispettore, «Nomine RSPP / addetti»
   compariva come un titolo e una cella libera, identica a un documento
   valido. Non è un numero sbagliato, è un numero che non c'è — e su un foglio
   una cella vuota accanto a un documento si legge «a posto».
   Copiare la mappa nella cartella sarebbe stata la copia debole. Sta qui, e la
   leggono tutt'e due.
   ⚠️ `valido` è il terzo campo di proposito: senza, chi vuole sapere «questo
   documento è a posto?» se lo ricalcola confrontando l'etichetta con la
   stringa «Valido», che è la forma invece della sostanza. */
export function etichettaStatoDocumento(stato) {
  const M = {
    valido:        { cls: "ok",     label: "Valido",      valido: true },
    "da-rivedere": { cls: "warn",   label: "Da rivedere", valido: false },
    scaduto:       { cls: "danger", label: "Scaduto",     valido: false },
  };
  /* Un documento di cui lo stato non è scritto — un import, un archivio
     cartaceo — non è un documento valido: si dichiara che non si sa, in
     giallo. Cadere sul verde sarebbe peggio del crash che questo ripiego
     evita. */
  return M[String(stato == null ? "" : stato).trim()]
      || { cls: "warn", label: "Stato non indicato", valido: false };
}

export function cartellaLavoratore(lavoratore, dati, oggi = new Date()) {
  const l = lavoratore || null;
  if (!l) return { trovato: false, motivo: "Nessun lavoratore scelto.", vuoti: [], daSistemare: [], completa: false };
  const d = dati || {};
  const scadenze = d.scadenze || [], mansioni = d.mansioni || [],
        dpi = d.dpi || [], nomine = d.nomine || [], documenti = d.documenti || [];

  const sue = scadenze
    .filter(s => s && String(s.lavoratoreId || "") === String(l.id))
    /* ⚠️ `statoScadenza` prende la DATA e restituisce una stringa, non prende
       la riga e non restituisce un oggetto: passandogli la scadenza intera
       rispondeva «senza data» su righe che la data ce l'hanno. Misurato, non
       indovinato — ed è la stessa lezione del `scadenzeDiChiLavora` di poco fa. */
    .map(s => ({ scadenza: s, stato: statoScadenza(s.dataScadenza, oggi) }));
  const mie = mansioni.filter(m => (m.lavoratoriIds || []).includes(l.id));
  const verbale = verbaleDpi(l, dpi, oggi);
  const sueNomine = nomine.filter(n => n.lavoratoreId === l.id && nominaAttiva(n, oggi));
  const suoiDoc = documenti.filter(x => x.lavoratoreId === l.id);

  const vuoti = [];
  if (!mie.length)
    vuoti.push("Nessuna mansione assegnata: senza mansione non si sa quali corsi e quali DPI gli spettino.");
  if (!sue.length)
    vuoti.push("Nessuna scadenza registrata: non vuol dire «in regola», vuol dire che non è stato registrato niente.");
  if (!verbale.righe.length)
    vuoti.push("Nessun DPI consegnato risulta a registro.");

  /* ⛔ `vuoti` GUARDA LE SEZIONI SENZA RIGHE. NESSUNO GUARDAVA LE RIGHE CHE
     CI SONO (03/08). Misurato premendo il bottone sulla dimostrazione:
     **cinque cartelle su sette** uscivano dalla stampante con la riga di
     chiusura «Tutte le sezioni della cartella contengono dati registrati in
     Scudo alla data di stampa», in grigio — e dentro c'erano una visita
     medica SCADUTA (che `abilitazioneLavoratore` chiama bloccante), un DPI da
     sostituire, un addestramento da fare, una nomina di cui non si dimostra
     da quando decorre. Il foglio scriveva «DA SOSTITUIRE» su una riga e due
     centimetri più sotto si dichiarava tranquillo.
     Non è la stessa domanda di `vuoti` ed è per questo che è sfuggita: una
     cartella COMPLETA non è una cartella IN REGOLA. Le due cose vanno dette
     tutt'e due, e la seconda non si calcola qui — si LEGGE dagli stati che
     questa funzione ha già messo in ogni riga (regola del posto solo).
     ⚠️ `in-scadenza` sta FUORI di proposito: non è una riga fuori regola, è
     un preavviso, e il foglio lo scrive già accanto alla riga. Metterlo qui
     avrebbe fatto uscire un avviso su quasi ogni cartella, e un avviso che
     c'è sempre non lo legge più nessuno. */
  const stScad = sue.map(x => x.stato), stDpi = verbale.righe.map(r => r.stato);
  const righeGuaste = [
    [stScad.filter(x => x === "scaduta").length, "scadenza già scaduta", "scadenze già scadute"],
    [stScad.filter(x => x === "senza data").length, "scadenza senza una data leggibile", "scadenze senza una data leggibile"],
    [stDpi.filter(x => x === "scaduta").length, "DPI da sostituire", "DPI da sostituire"],
    [stDpi.filter(x => x === "senza data").length, "DPI senza data di sostituzione", "DPI senza data di sostituzione"],
    [verbale.addestramentiMancanti, "addestramento ancora da fare", "addestramenti ancora da fare"],
    /* La stessa regola di `organigrammaSicurezza`, e adesso la STESSA funzione:
       `nominaSenzaDataLeggibile` guarda `dal` **e** `al`. Prima la frase «è la
       stessa regola» era scritta accanto a una copia che guardava una data
       sola, ed è così che questo foglio taceva su una nomina che l'Organigramma
       segnalava. */
    [sueNomine.filter(n => dateNominaIlleggibili(n).dal).length, "nomina senza la data da cui decorre", "nomine senza la data da cui decorrono"],
    /* ⛔ LA RIGA CHE MANCAVA. Con una data di FINE illeggibile («2026-13-45»)
       `nominaAttiva` non scatta — `giorniTra` risponde `NaN` — quindi la
       nomina resta nell'elenco come attiva, e questo foglio non diceva niente.
       L'Organigramma la conta in `senzaData` dal 07/08 e colora il ruolo. */
    [sueNomine.filter(n => dateNominaIlleggibili(n).al).length, "nomina la cui data di fine non si legge", "nomine la cui data di fine non si legge"],
    [suoiDoc.filter(x => !etichettaStatoDocumento(x.stato).valido).length,
      "documento non valido o dallo stato non registrato", "documenti non validi o dallo stato non registrato"],
  ];
  const daSistemare = righeGuaste.filter(([n]) => n > 0).map(([n, uno, tanti]) => conta(n, uno, tanti));

  return {
    trovato: true, lavoratore: l,
    scadenze: sue, mansioni: mie, verbale, nomine: sueNomine, documenti: suoiDoc,
    vuoti, daSistemare, completa: vuoti.length === 0,
  };
}

/* La frase che chiude la cartella, scritta dal modulo per la stessa ragione di
   `descriviBaseOnere` in Terra: quello che un documento dichiara è una REGOLA,
   e chi la scrive dev'essere uno solo. Legge `completa`, che altrimenti
   sarebbe una bandiera che non guarda nessuno (regola 20 di run-stile). */
/* IL VERBALE DI CONSEGNA DEI DPI, LE RIGHE (05/09). Le decideva la pagina
   (`costruisciVerbale`) a partire da `verbaleDpi`, ma le PAROLE delle celle —
   «non registrato» sul modello, «non indicata» sulla data illeggibile, «DA
   SOSTITUIRE» sulla scadenza passata, «fatto (non obbligatorio)» / «DA FARE»
   sull'addestramento — vivevano lì, dove nessuna prova senza browser le
   legge. Qui ogni cella è testo, la pagina disegna. Decisione 14: su un
   foglio stampato «—» si legge «non serve», quindi chi non ha registrato lo
   dice; la taglia resta col trattino perché «unica» esiste davvero come
   risposta. Nei testi il grassetto si scrive «**così**». Pura. */
export function fogliaVerbaleDpi(lavoratore, opzioni) {
  const { dpi, mansioni, oggi } = opzioni || {};
  const lav = lavoratore || {};
  const v = verbaleDpi(lav, Array.isArray(dpi) ? dpi : []);
  const mans = (Array.isArray(mansioni) ? mansioni : []).filter((m) => m && (m.lavoratoriIds || []).includes(lav.id)).map((m) => m.nome).join(", ");
  const nonMisurati = [];
  const conta = (n, s, p) => n + " " + (n === 1 ? s : p);
  let senzaModello = 0, senzaData = 0, senzaSost = 0, daFare = 0;
  const righe = v.righe.map((r) => {
    const c = r.consegna || {};
    // se l'addestramento non è obbligatorio ma è stato fatto lo stesso, il
    // foglio lo dice: è lavoro fatto e registrato
    const add = !r.addestramentoRichiesto
      ? (r.addestramentoFatto ? "fatto (non obbligatorio)" : "non previsto")
      : (r.addestramentoFatto ? "fatto" + (c.dataAddestramento ? " il " + dataIt(c.dataAddestramento) : "") : "DA FARE");
    if (!c.modello) senzaModello++;
    if (!r.leggibile) senzaData++;
    if (c.nonScade !== true && r.stato === "senza data") senzaSost++;
    if (r.addestramentoRichiesto && !r.addestramentoFatto) daFare++;
    /* la colonna «Sostituire entro» LEGGE lo stato della riga, non ri-decide:
       una maschera da sostituire da anni non esce come una valida fino al 2099 */
    const sost = c.nonScade === true ? "non scade (dichiarato)"
      : r.stato === "senza data" ? "non indicata"
      : dataIt(c.scadenza) + (r.stato === "scaduta" ? " — DA SOSTITUIRE" : r.stato === "in-scadenza" ? " — da sostituire a breve" : "");
    return [String(r.tipo.etichetta || c.tipo || ""), String(r.tipo.cat || ""), c.modello ? String(c.modello) : "non registrato",
      String(c.taglia || "—"), r.leggibile ? dataIt(c.dataConsegna) : "non indicata", sost, add, ""];
  });
  if (senzaModello) nonMisurati.push(conta(senzaModello, "dispositivo senza il modello registrato", "dispositivi senza il modello registrato"));
  if (senzaData) nonMisurati.push(conta(senzaData, "consegna senza la data", "consegne senza la data"));
  if (senzaSost) nonMisurati.push(conta(senzaSost, "dispositivo senza data di sostituzione", "dispositivi senza data di sostituzione"));
  if (daFare) nonMisurati.push(conta(daFare, "addestramento da fare", "addestramenti da fare"));
  return {
    titolo: "Verbale di consegna dei DPI", sottotitolo: "Dispositivi di protezione individuale — art. 77 D.Lgs 81/2008",
    dati: [["Azienda / cava", "", true], ["Lavoratore", String(lav.nome || ""), false], ["Mansione", mans || String(lav.ruolo || "—"), false],
      ["Data del verbale", dataIt(isoLocale(oggi || new Date())), false]],
    colonne: ["Dispositivo", "Cat.", "Modello", "Taglia", "Consegnato il", "Sostituire entro", "Addestramento", "Firma"],
    righe, vuota: "Per questa persona non risulta registrata nessuna consegna.",
    dichiarazione: "Il lavoratore dichiara di aver ricevuto i dispositivi elencati, di essere stato informato sui rischi da cui proteggono e di aver ricevuto l'**addestramento** dove indicato come fatto. Si impegna a **usarli** quando previsto, ad **averne cura**, a **non modificarli** e a **segnalare subito** difetti, danni o smarrimenti al preposto o al datore di lavoro (artt. 20 e 78 D.Lgs 81/2008).",
    firme: ["Firma del lavoratore", "Firma di chi consegna (datore di lavoro o preposto)"],
    piede: "Documento preparato con Scudo · Deepwork — " + conta(v.righe.length, "dispositivo", "dispositivi")
      + (v.addestramentiMancanti ? " · addestramenti ancora da fare: " + v.addestramentiMancanti : "")
      + ". Nota informativa, non un parere legale: il contenuto va verificato con l'RSPP dell'azienda.",
    addestramentiMancanti: v.addestramentiMancanti, nonMisurati,
  };
}

/* LA CARTELLA DEL LAVORATORE, LE SEZIONI (05/09). `cartellaLavoratore` decide
   che cosa c'è e che cosa manca; qui si compongono le RIGHE del fascicolo che
   si esibisce all'ispettore — l'adempimento e non la famiglia
   (`etichettaScadenza`), l'etichetta del DPI e non la chiave interna, lo stato
   della consegna, lo stato del documento (`etichettaStatoDocumento`) — e ogni
   sezione vuota porta la frase che dice perché, invece di restare bianca.
   La riga di chiusura la scrive `descriviCartella`, con `allarme` quando
   c'è qualcosa da sistemare. Pura. */
export function fogliaCartella(cartella, oggi = new Date()) {
  const c = cartella || {};
  const l = c.lavoratore || {};
  const sez = (titolo, righe, vuoto) => ({ titolo, righe, vuoto: righe.length ? "" : vuoto });
  const sezioni = [
    sez("Mansioni assegnate", (c.mansioni || []).map((m) => [String(m.nome || ""), (m.requisiti || []).length + " requisiti · " + (m.dpi || []).length + " DPI previsti"]),
      "Nessuna mansione assegnata: senza mansione non si sa quali corsi e quali DPI gli spettino."),
    sez("Formazione e scadenze", (c.scadenze || []).map((x) => [etichettaScadenza(x.scadenza),
      (x.scadenza.dataScadenza ? dataIt(x.scadenza.dataScadenza) : "senza data") + " · " + String(x.stato || "—")]),
      "Nessuna scadenza registrata: non vuol dire «in regola», vuol dire che non è stato registrato niente."),
    sez("Dispositivi di protezione consegnati", ((c.verbale || {}).righe || []).map((r) => [String(r.tipo.etichetta || r.consegna.tipo || ""),
      (r.leggibile ? dataIt(r.consegna.dataConsegna) : "data di consegna non indicata")
      + (r.consegna.taglia ? " · taglia " + String(r.consegna.taglia) : "")
      + (r.stato === "scaduta" ? " · **da sostituire**" : r.stato === "in-scadenza" ? " · da sostituire a breve" : r.stato === "senza data" ? " · **senza data di sostituzione**" : "")
      + (r.addestramentoRichiesto ? (r.addestramentoFatto ? " · addestramento fatto" : " · **addestramento da fare**") : "")]),
      "Nessun DPI consegnato risulta a registro."),
  ];
  if ((c.nomine || []).length)
    sezioni.push(sez("Nomine attive", c.nomine.map((n) => [(ruoloNomina(n.ruolo) || {}).etichetta || String(n.ruolo || ""), n.dal ? "dal " + dataIt(n.dal) : "senza data di nomina"]), ""));
  if ((c.documenti || []).length)
    sezioni.push(sez("Documenti collegati", c.documenti.map((d) => { const e = etichettaStatoDocumento(d.stato);
      return [String(d.titolo || ""), (e.valido ? e.label : "**" + e.label + "**") + (d.meta ? " · " + String(d.meta) : "")]; }), ""));
  return {
    titolo: "Cartella del lavoratore",
    sottotitolo: String(l.nome || "") + (l.ruolo ? " · " + String(l.ruolo) : "") + " — documento preparato con Deepwork Scudo il " + dataIt(isoLocale(oggi || new Date())),
    sezioni,
    chiusura: { testo: descriviCartella(c), allarme: !(c.completa && !(c.daSistemare || []).length) },
    firme: ["Luogo e data", "Il datore di lavoro"],
    nonMisurati: (c.vuoti || []).concat(c.daSistemare || []),
  };
}

export function descriviCartella(cartella) {
  const c = cartella || {};
  if (!c.trovato) return c.motivo || "Cartella non disponibile.";
  /* ⛔ LA CODA CHE MANCAVA: le righe REGISTRATE e non in regola. `completa`
     risponde a «ci sono sezioni senza righe?», che è una domanda sola — e
     finché era l'unica, un fascicolo pieno di roba scaduta chiudeva con una
     riga tranquilla in grigio. L'elenco lo compone `cartellaLavoratore` dagli
     stati che stampa lui stesso: qui si dice solo COME va letto. */
  const guai = c.daSistemare || [];
  const coda = guai.length
    ? " ⚠️ E non tutto quello che è registrato è in regola: " + guai.join(", ")
      + ". Una cartella completa non è una cartella in regola: queste righe il foglio le riporta una per una."
    : "";
  if (c.completa)
    return "Tutte le sezioni della cartella contengono dati registrati in Scudo alla data di stampa." + coda;
  /* ⚠️ NON ri-elenca i vuoti: quelli li scrive già ogni sezione, e sul foglio
     stampato la ripetizione era tre righe di rumore in fondo a un documento
     che va letto in fretta. Qui si dice la cosa che le sezioni NON dicono —
     come vanno lette. L'elenco resta in `vuoti`, per chi lo vuole (la modale
     lo usa, perché lì le sezioni non ci sono). */
  const n = c.vuoti.length;
  return "⚠️ Questa cartella non è completa: " + n
    + (n === 1 ? " sezione è senza righe" : " sezioni sono senza righe")
    + ". Le sezioni senza righe non vanno lette come «non dovuto»: vanno compilate." + coda;
}

/* ⛔ CHI NON HA NEMMENO UNA SCADENZA NON È «REGOLARE»: È NON VERIFICATO.
   `regolari` è il numero verde in cima al Quadro, e ci finiva dentro anche la
   persona di cui non è stata registrata NESSUNA riga — né visita medica, né
   formazione, né patentino — cioè esattamente quella di cui non si sa niente.
   Nella dimostrazione erano due su sette, e nessuna delle due si distingueva
   da chi ha davvero tutto in ordine.
   La regola non è nuova e non è nostra: `idoneitaDiTurno`, in
   `shared/dw-ponti.js`, tiene `senzaScadenze` FUORI dai regolari e scrive la
   ragione — «sommarlo ai tutto a posto trasformerebbe un non lo so in un sì».
   Era scritta lì per Campo e violata qui.
   `senzaScadenze` sta a parte e non si somma: non è un allarme (una persona
   appena assunta ci passa) ma nemmeno un «a posto», e chi guarda deve leggerlo. */
export function kpiFrom(lavoratori, scadenze) {
  const st = scadenze.map(s => statoScadenza(s.dataScadenza));
  const scadute = st.filter(x => x === "scaduta").length;
  const trenta = st.filter(x => x === "in-scadenza").length;
  const conProblemi = new Set(
    scadenze.filter(s => statoScadenza(s.dataScadenza) !== "regolare")
            .map(s => s.lavoratoreId).values());
  const conScadenze = new Set(scadenze.map(s => s.lavoratoreId));
  const attivi = lavoratori.filter(l => l.attivo);
  return {
    scadute, trenta,
    regolari: attivi.filter(l => conScadenze.has(l.id) && !conProblemi.has(l.id)).length,
    senzaScadenze: attivi.filter(l => !conScadenze.has(l.id)).length,
  };
}

// ── PONTE CON SENTINELLA, LATO DEMO ──────────────────────────────────
// In LIVE non serve niente di tutto questo: Sentinella scrive le sue
// azioni nella collezione `azioni` di Scudo passando dallo SDK
// (orgCollection sull'appId "scudo"), e Scudo se le ritrova insieme alle
// altre. In demo/tour, invece, non esiste nessun backend e le due app sono
// due pagine diverse: il "finto backend" condiviso è una riga di
// localStorage. Copia gemella (stessa chiave) in
// apps/sentinella/sentinella-data.js, che le scrive.
// Se localStorage non è disponibile (navigazione privata, quota piena) si
// prosegue senza: la pagina non si rompe, semplicemente non vede il ponte.
const PONTE_DEMO_KEY = "deepwork.demo.azioni-ponte";
function ponteDemoLeggi() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(PONTE_DEMO_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}
function ponteDemoScrivi(lista) {
  try { globalThis.localStorage.setItem(PONTE_DEMO_KEY, JSON.stringify((lista || []).slice(-200))); return true; }
  catch (e) { return false; }
}
/* E il gemello del ponte P5: i near-miss segnalati dal fronte, che in demo
   arrivano da Campo per la stessa strada. Chiave diversa perché sono un'altra
   collezione (`infortuni`, non `azioni`). ⛔ Senza questa riga la dimostrazione
   direbbe una cosa falsa dell'ecosistema: si segnala in Campo, si apre Scudo, e
   nel registro non c'è niente — cioè il contrario di quello che il ponte fa in
   esercizio, dove il registro è UNO SOLO. */
const EVENTI_DEMO_KEY = "deepwork.demo.eventi-ponte";
function eventiDemoLeggi() {
  try {
    const v = JSON.parse(globalThis.localStorage.getItem(EVENTI_DEMO_KEY) || "[]");
    return Array.isArray(v) ? v.filter(x => x && x.id) : [];
  } catch (e) { return []; }
}

// ══════════════════════════════════════════════════════════════════════
// PONTE P3 CON CAMPO — la regola sta in `shared/dw-ponti.js` perché serve a due
// app, e Scudo la ri-esporta col nome con cui la chiamano le sue pagine.
// ══════════════════════════════════════════════════════════════════════
export { inTurnoOggi, scadenzeDiChiLavora } from "../../shared/dw-ponti.js";
/* `statoPeggioreScadenze` sta in `shared/` per la stessa ragione: la usa
   `idoneitaOperatore` (per Campo) e la usa l'elenco Personale di Scudo, che
   se ne teneva una versione a tre risposte su quattro. Un alias non è una
   seconda implementazione. */
export { statoPeggioreScadenze } from "../../shared/dw-ponti.js";

export async function scudoData() {
  // tenta il backend reale; qualunque problema → demo (tour/mockup)
  let mode = "demo", api = null;
  try {
    const { DeepworkID } = await import("../../shared/deepwork-id-client/index.js");
    const id = await DeepworkID.init({ appId: "scudo" });
    if (id.user && id.authState() === "member") {
      const { getDocs, addDoc, deleteDoc, doc, updateDoc, deleteField, runTransaction } =
        await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      mode = "live";
      const read = async (name) =>
        (await getDocs(id.orgCollection(name))).docs.map(d => ({ id: d.id, ...d.data() }));
      api = {
        lavoratori: () => read("lavoratori"),
        scadenze:   () => read("scadenze"),
        documenti:  () => read("documenti"),
        infortuni:  () => read("infortuni"),
        /* le ore lavorate dell'anno: senza di queste gli indici infortunistici
           non si calcolano, e non si stimano. Un'organizzazione che non le ha
           mai scritte legge una lista vuota, come per gli incassi. */
        oreAnno:    () => read("oreAnno"),
        cantieri:   () => read("cantieri"),
        azioni:     () => read("azioni"),
        ispezioni:  () => read("ispezioni"),
        // Collezioni di S4/S5: le organizzazioni già attive non le hanno
        // ancora. Firestore, su una collezione che non esiste, risponde con
        // un elenco vuoto: le schermate si aprono vuote, non si rompono.
        mansioni:   () => read("mansioni"),
        nomine:     () => read("nomine"),
        dpi:        () => read("dpi"),
        /* l'analisi della causa degli eventi. Come le collezioni di S4/S5: chi
           non ne ha mai scritta una legge un elenco vuoto, e il registro si
           apre con tutti gli eventi «senza un perché» — che è la verità. */
        analisi:    () => read("analisi"),
        /* le imprese esterne e i loro appalti. Come le collezioni di S4/S5:
           chi non le ha mai scritte legge un elenco vuoto — e la schermata NON
           dice «tutto a posto», dice che non c'è ancora niente da mostrare. */
        appaltatori: () => read("appaltatori"),
        appalti:     () => read("appalti"),
        /* i permessi di lavoro. Come le altre collezioni arrivate dopo: chi
           non ne ha mai scritto uno legge un elenco vuoto — e la schermata NON
           dice «tutto a posto», dice che finché è così le voci di checklist
           che chiedono un permesso non hanno niente dietro. */
        permessi:    () => read("permessi"),
        aggiungi: (name, data) => addDoc(id.orgCollection(name), data),
        logout: () => id.logout(),
        aggiorna: (name, docId, data) => updateDoc(doc(id.orgCollection(name), docId), traduciCancellazioni(data, deleteField)),
        /* per gli ELENCHI: rileggi-e-riscrivi in modo ATOMICO — la stessa
           funzione condivisa che usa Sentinella, non una seconda copia */
        trasforma: (name, docId, cambia) => trasformaAtomico(
          { rif: doc(id.orgCollection(name), docId), runTransaction, deleteField }, cambia),
        rimuovi: (name, docId) => deleteDoc(doc(id.orgCollection(name), docId)),
      };
      // ── PONTE P3 CON CAMPO — SOLA LETTURA ─────────────────────────────
      // Il gemello di quello che Campo ha verso Scudo: seconda istanza dell'SDK
      // sull'app "campo", stessa organizzazione, percorso da `orgCollection`.
      // Scudo LEGGE chi è schierato e non tocca niente: le squadre si fermano e
      // si rimettono in turno in Campo, che resta l'unica strada per quel dato.
      // Se Campo non c'è torna null, e lo scadenzario resta quello di sempre —
      // senza fingere che non stia lavorando nessuno, che darebbe «niente da
      // fermare» proprio quando non si è guardato.
      let idCampo;                     // undefined = mai provato, null = non c'è
      const leggiCampo = async (nome) => {
        if (idCampo === undefined) {
          try { idCampo = await DeepworkID.init({ appId: "campo" }); }
          catch (e) { idCampo = null; }
        }
        if (!idCampo) return null;
        try {
          return (await getDocs(idCampo.orgCollection(nome))).docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) { return null; }
      };
      api.operatoriCampo = () => leggiCampo("operatori");
      api.squadreCampo = () => leggiCampo("squadre");
      /* IL MURO DI TUTTA LA CAVA (02/09, ponte 3b): le scadenze della concessione
         (Terra) e dei mezzi (Flotta) si leggono con la stessa forma di Campo —
         una seconda istanza SDK pigra per app, `null` se non risponde. ⛔ Il
         `null` resta `null` fino alla schermata: «Terra non ha risposto» e
         «Terra non ha scadenze» sono due frasi diverse, e la seconda sarebbe
         il via libera a dimenticare il rinnovo della fideiussione. */
      const leggiAltra = (appId) => { let idAltra;
        return async (nome) => {
          if (idAltra === undefined) { try { idAltra = await DeepworkID.init({ appId }); } catch (e) { idAltra = null; } }
          if (!idAltra) return null;
          try { return (await getDocs(idAltra.orgCollection(nome))).docs.map(d => ({ id: d.id, ...d.data() })); }
          catch (e) { return null; }
        }; };
      const leggiTerra = leggiAltra("terra"), leggiFlotta = leggiAltra("flotta");
      api.scadenzeTerra = () => leggiTerra("scadenze");
      api.scadenzeFlotta = () => leggiFlotta("scadenze");
    } else if (id.authState() === "tour") {
      mode = "tour";
    }
  } catch (e) { /* backend assente: demo */ }

  if (mode !== "live") {
    // demo/tour: dati in memoria, scritture solo locali (non persistite)
    const mem = JSON.parse(JSON.stringify(DEMO));
    api = {
      lavoratori: async () => mem.lavoratori,
      scadenze:   async () => mem.scadenze,
      // in dimostrazione chi è schierato non arriva da Campo: è finto, ma
      // copiato dalla dimostrazione di Campo id per id (vedi DEMO.operatoriCampo)
      operatoriCampo: async () => mem.operatoriCampo || [],
      squadreCampo:   async () => mem.squadreCampo || [],
      // e le scadenze di Terra e di Flotta: finte, copiate dalle loro
      // dimostrazioni riga per riga (vedi DEMO.scadenzeTerra / scadenzeFlotta)
      scadenzeTerra:  async () => mem.scadenzeTerra || [],
      scadenzeFlotta: async () => mem.scadenzeFlotta || [],
      documenti:  async () => mem.documenti,
      // gli eventi di esempio PIÙ i near-miss segnalati dal fronte in Campo
      // (ponte P5 in demo): in esercizio è la stessa collezione e questa riga
      // non esiste nemmeno.
      infortuni:  async () => [...mem.infortuni, ...eventiDemoLeggi().filter(x => !mem.infortuni.some(y => y.id === x.id))],
      oreAnno:    async () => mem.oreAnno || (mem.oreAnno = []),
      cantieri:   async () => mem.cantieri,
      // le azioni di esempio PIÙ quelle arrivate da Sentinella (ponte demo):
      // in demo le due app comunicano solo così, in live è la stessa
      // collezione e questa riga non esiste nemmeno.
      azioni:     async () => [...mem.azioni, ...ponteDemoLeggi().filter(a => !mem.azioni.some(x => x.id === a.id))],
      ispezioni:  async () => mem.ispezioni,
      mansioni:   async () => mem.mansioni || [],
      nomine:     async () => mem.nomine || [],
      dpi:        async () => mem.dpi || [],
      analisi:    async () => mem.analisi || (mem.analisi = []),
      appaltatori: async () => mem.appaltatori || (mem.appaltatori = []),
      appalti:     async () => mem.appalti || (mem.appalti = []),
      permessi:    async () => mem.permessi || (mem.permessi = []),
      logout: async () => {},
      aggiungi: async (name, data) => { const id = "m" + Math.random().toString(36).slice(2, 8); (mem[name] = mem[name] || []).push({ id, ...data }); return { id }; },
      /* stesso CONTRATTO della strada vera, transazione a parte */
      trasforma: async (name, docId, cambia) =>
        trasformaInMemoria((mem[name] || (mem[name] = [])).find(v => v.id === docId), cambia),
      aggiorna: async (name, docId, data) => {
        const x = (mem[name] || (mem[name] = [])).find(v => v.id === docId);
        if (x) { applicaPercorsi(x, data); return; }
        // azione arrivata da Sentinella: l'avanzamento si scrive dove sta,
        // così tornando sul superamento se ne vede lo stato aggiornato.
        if (name !== "azioni") return;
        const p = ponteDemoLeggi(), y = p.find(v => v.id === docId);
        if (y) { Object.assign(y, data); ponteDemoScrivi(p); }
      },
      rimuovi: async (name, docId) => {
        mem[name] = (mem[name] || []).filter(x => x.id !== docId);
        if (name === "azioni") ponteDemoScrivi(ponteDemoLeggi().filter(x => x.id !== docId));
      },
    };
  }
  return { mode, ...api };
}

// ============================================================
// INDICI INFORTUNISTICI (IF, IG, LTIFR)
// ------------------------------------------------------------
// Sono i tre numeri con cui un'azienda si confronta col proprio settore, e
// quelli che un committente chiede in fase di qualifica:
//
//   IF    = infortuni × 1.000.000 / ore lavorate       (frequenza)
//   IG    = giornate perse × 1.000 / ore lavorate      (gravità)
//   LTIFR = infortuni CON assenza × 1.000.000 / ore    (lost time injury rate)
//
// ⛔ E TUTTI E TRE DIVIDONO PER LE ORE LAVORATE, che Scudo non ha. La
// tentazione è ricavarle: numero di operatori × 1.700 ore l'anno, e il numero
// esce. Sarebbe un **denominatore inventato**, e su un indice che si porta in
// gara o si confronta con la media di settore un denominatore inventato non è
// un'approssimazione: è una dichiarazione falsa fatta con la faccia di un
// calcolo. Un'azienda con molti part-time o molti interinali starebbe fuori
// di parecchio, e nessuno potrebbe accorgersene guardando il risultato.
//
// Quindi: senza le ore l'indice **non si calcola**, e la funzione lo dice —
// `calcolabile: false` e la ragione in chiaro. È lo stesso principio del
// prodotto applicato per la quinta volta: l'assenza di un dato non è un dato
// favorevole, e qui il travestimento sarebbe un indice **basso**, cioè la
// notizia migliore che un'azienda possa leggere sulla propria sicurezza.
export function indiciInfortunistici(infortuni, oreLavorate, anno = new Date().getFullYear()) {
  /* ⛔ L'ANNO LO LEGGE `annoRegistrato`, NON UNA SECONDA REGOLA SCRITTA QUI.
     Erano due: qui `String(i.data).slice(0,4) === String(anno)`, e più giù
     `annoRegistrato` col commento che PROMETTEVA l'identità («si legge
     ESATTAMENTE come lo legge indiciInfortunistici»). Una promessa scritta in
     un commento non è un'identità: è la copia debole che si annuncia gemella,
     la stessa forma già pagata dal fascicolo del lavoratore. Provate a tappeto
     su 21 forme della data × 4 anni, le due letture divergevano in **una**
     combinazione sola — `"0000-01-01"` con `anno` 0 — cioè erano gemelle per
     ogni anno vero: la divergenza qui sparisce per costruzione. */
  const nell_anno = (infortuni || []).filter(i =>
    i && i.tipo === "infortunio" && annoRegistrato(i) === +anno);
  /* ⛔ E GLI INFORTUNI DI CUI NON SI LEGGE L'ANNO NON CADONO IN NESSUN ANNO:
     spariscono da IF, IG e LTIFR **senza lasciare una riga**, cioè dai tre
     numeri che si portano in gara e si confrontano con la media di settore, e
     spariscono nel verso che rassicura — l'indice esce PIÙ BASSO del vero.
     Misurato su un registro di due infortuni, uno con la data e uno senza: il
     cartellone in cima alla stessa schermata scrive «Infortuni: 2» e la sua
     riga «⚠️ 1 infortunio registrato non ha una data che si possa leggere»
     (`riepilogoInfortuni.dataIgnota`), e la scheda degli indici — due righe
     più giù, sugli stessi dati — scriveva «Anno 2026 · 1 infortunio ·
     IF 50,00 · IG 0,50 · LTIFR 50,00» dove il vero è **IF 100,00 · IG 0,70 ·
     LTIFR 100,00**: la metà, con `noto: true`, cioè con la bandiera che esiste
     per dire «questi sono minimi» che dichiarava tutto conosciuto.
     È il principio del fondatore sul dato che ESCE: l'assenza non è un dato
     favorevole. Non cambia chi entra nel conto — quello resta com'era, e una
     soglia di sicurezza non si tocca di testa propria — ma adesso chi manca si
     **conta e si dice**, e a dirlo è `avvisoInfortuniSenzaAnno` qui sotto
     (regola 20: una bandiera che non legge nessuno non protegge niente). */
  const senzaAnno = (infortuni || []).filter(i =>
    i && i.tipo === "infortunio" && annoRegistrato(i) === null).length;
  const conAssenza = nell_anno.filter(i => (giornateAssenza(i) || 0) > 0);
  /* ⛔ decisione 17: l'infortunio a prognosi aperta NON entra fra quelli «con
     assenza» (non si sa se ce ne sarà) e NON entra fra quelli senza (che è la
     lettura tranquilla che il vecchio `|| 0` produceva da solo). Ha un secchio
     suo — assenza **da quantificare** — ed è lui a rendere IG e LTIFR un
     minimo invece che un consuntivo. */
  const daQuantificare = nell_anno.filter(prognosiAperta).length;
  const giornatePerse = nell_anno.reduce((t, i) => t + Math.max(0, giornateAssenza(i) || 0), 0);
  const ore = +oreLavorate;
  const base = { anno: +anno, infortuni: nell_anno.length, conAssenza: conAssenza.length,
                 daQuantificare,
                 /* quanti infortuni del REGISTRO non si possono attribuire a
                    nessun anno: non sono in questo conteggio e non sono in
                    quello di nessun altro anno. Vale per ogni riga della serie
                    proprio perché quegli eventi non appartengono a nessuna. */
                 senzaAnno,
                 /* bandiera: tutte le giornate perse dell'anno sono scritte.
                    Falsa ⇒ `giornatePerse`, `indiceGravita` e `ltifr` sono
                    MINIMI. La legge `descriviIndici`, qui sotto. */
                 noto: daQuantificare === 0,
                 giornatePerse, oreLavorate: Number.isFinite(ore) && ore > 0 ? ore : null };
  if (!(Number.isFinite(ore) && ore > 0))
    return { ...base, calcolabile: false, indiceFrequenza: null, indiceGravita: null, ltifr: null,
      motivo: "Servono le ORE LAVORATE dell'anno: senza di quelle i tre indici non si possono "
        + "calcolare. Non vengono stimate dal numero di operatori — un denominatore inventato "
        + "renderebbe l'indice inconfrontabile con la media di settore, e più basso del vero." };
  const r2 = (n) => Math.round(n * 100) / 100;
  return { ...base, calcolabile: true,
    indiceFrequenza: r2(nell_anno.length * 1e6 / ore),
    indiceGravita: r2(giornatePerse * 1e3 / ore),
    ltifr: r2(conAssenza.length * 1e6 / ore) };
}

/* Come si legge l'indice di gravità di quell'anno, scritto dal modulo (regola
   7: la stessa frase decisa in un posto solo) e lettura della bandiera `noto`.
   Torna `null` quando non c'è niente da avvertire: chi la disegna scrive la
   riga solo se c'è, invece di riservare spazio a un avviso che non arriva. */
export function avvisoGravitaMinima(r) {
  const x = r || {};
  if (x.noto !== false) return null;
  const n = +x.daQuantificare || 0;
  return "L'indice di gravità del " + x.anno + " è un MINIMO: "
    + (n === 1 ? "di un infortunio dell'anno la prognosi è ancora aperta"
               : "di " + n + " infortuni dell'anno la prognosi è ancora aperta")
    + ", quindi le giornate perse contate finora sono " + x.giornatePerse
    + " ma non sono tutte. Scritte le giornate, l'indice sale — non è un valore da confrontare con la media di settore finché resta così.";
}

/* La lettura della bandiera `senzaAnno`, scritta dal modulo per la stessa
   ragione di `avvisoGravitaMinima` e `descriviGiornatePerse`: quello che un
   numero dichiara è una REGOLA, e a scriverla dev'essere uno solo.
   Torna `null` quando non c'è niente da avvertire — chi la disegna scrive la
   riga solo se c'è, invece di riservare spazio a un avviso che non arriva.
   ⚠️ Dice «più bassi del vero» e non «sbagliati»: gli eventi mancanti stanno
   al numeratore di tutti e tre gli indici, quindi la direzione si sa anche
   senza sapere in che anno sarebbero caduti. */
export function avvisoInfortuniSenzaAnno(r) {
  const x = r || {};
  const n = +x.senzaAnno || 0;
  if (!(n > 0)) return null;
  return (n === 1
      ? "Nel registro c'è 1 infortunio di cui non si legge l'anno"
      : "Nel registro ci sono " + n + " infortuni di cui non si legge l'anno")
    + ": non è in nessuno di questi conteggi, perché non si sa a quale anno attribuirlo. "
    + "IF, IG e LTIFR sono quindi più BASSI del vero — scritta la data " + (n === 1 ? "dell'evento" : "degli eventi")
    + ", risalgono. Non sono numeri da portare in gara finché resta così.";
}

// ============================================================
// L'ANDAMENTO DEGLI INDICI NEL TEMPO (anno per anno)
// ------------------------------------------------------------
// I tre numeri da soli dicono dove si è; l'andamento dice DOVE SI STA ANDANDO,
// ed è la domanda che fanno un committente in qualifica e un ispettore.
//
// ⛔ ANNO PER ANNO, E NON PER SCELTA ESTETICA: le ore lavorate — il
// denominatore di tutti e tre — Scudo le raccoglie **per anno** (collezione
// `oreAnno`, un record {anno, ore}). Un andamento MENSILE avrebbe quindi un
// numeratore mensile e un denominatore annuale spalmato: cioè dodici indici
// costruiti su ore inventate. È lo stesso divieto già scritto sopra, applicato
// all'asse del tempo invece che al totale.
//
// Le regole di onestà, tutte già in casa e qui solo applicate:
//  · un anno SENZA ore non vale zero: vale **buco**. La riga esce
//    `calcolabile: false` con la sua ragione, e il grafico riceve `null` —
//    che il motore non scavalca. Un anno a zero disegnato in mezzo a due anni
//    misurati è la bugia più tranquilla che questa schermata possa dire;
//  · un anno con INFORTUNI ma senza ore è il caso peggiore, perché è quello in
//    cui il buco nasconde una notizia brutta: esce a parte in
//    `conEventiSenzaOre`, perché l'interfaccia lo dica per nome;
//  · due registrazioni di ore DIVERSE per lo stesso anno non si risolvono
//    scegliendone una: quell'anno diventa non calcolabile e la ragione lo
//    scrive. Prendere l'ultima cambierebbe l'indice senza che si veda;
//  · il confronto è fra gli ultimi DUE anni misurati, che non sono per forza
//    consecutivi: `adiacenti` e `salto` esistono perché la pagina non scriva
//    «rispetto all'anno scorso» saltando un buco di tre anni;
//  · su questi indici **scendere è migliorare**: il verso lo dice la funzione
//    (`migliora`/`peggiora`/`stabile`/`misto`), così nessuno lo deduce dal
//    segno e lo colora al contrario. `misto` esiste perché il caso vero —
//    meno infortuni ma più gravi — non si riassume in una freccia sola;
//  · da zero non esiste una variazione in percentuale: `variazione` è `null` e
//    `variazionePerche` lo scrive, invece di stampare un ∞ o un 100% inventato;
//  · sotto `MIN_TENDENZA` eventi non si legge una tendenza: `pochi` è la stessa
//    bandiera, con la stessa soglia, che usa già il riepilogo dei near-miss.
export const INDICI_TREND = [
  { chiave: "indiceFrequenza", sigla: "IF", nome: "Indice di frequenza" },
  { chiave: "indiceGravita", sigla: "IG", nome: "Indice di gravità" },
  { chiave: "ltifr", sigla: "LTIFR", nome: "LTIFR" },
];

/* L'UNICA lettura dell'anno di un infortunio: la usano `indiciInfortunistici`
   (chi entra nel conto di quell'anno) e la serie qui sotto (quali anni
   esistono). Prima erano DUE, e questo commento diceva «si legge ESATTAMENTE
   come lo legge indiciInfortunistici» — cioè prometteva l'identità invece di
   averla. Adesso è una funzione sola, e la promessa non può più scadere.
   La prima stesura pretendeva la data ISO intera, ed era una seconda regola:
   un infortunio registrato con `data: "2026"` entrava nel conteggio dell'anno
   ma il suo anno non compariva nella serie — l'indice c'era e la riga no.
   ⚠️ Torna `null` quando l'anno non si legge, e quel `null` non è un anno da
   ripiegare: è la ragione per cui `senzaAnno` esiste e viene dichiarato. */
function annoRegistrato(x) {
  const y = String((x && x.data) || "").slice(0, 4);
  return /^\d{4}$/.test(y) ? +y : null;
}

/* Le ore per anno, con i doppioni tolti di mezzo invece che risolti a caso. */
function orePerAnno(oreAnni) {
  const per = new Map(), dubbi = new Set();
  for (const r of oreAnni || []) {
    const a = +((r && r.anno)), o = +((r && r.ore));
    if (!Number.isInteger(a) || !(Number.isFinite(o) && o > 0)) continue;
    if (per.has(a) && per.get(a) !== o) dubbi.add(a);
    per.set(a, o);
  }
  for (const a of dubbi) per.delete(a);
  return { per, dubbi };
}

export function andamentoIndici(infortuni, oreAnni, opts = {}) {
  const annoFine = Number.isInteger(+opts.annoFine) ? +opts.annoFine : new Date().getFullYear();
  const finestra = Math.max(2, Math.round(+opts.finestra) || 6);
  const { per: ore, dubbi } = orePerAnno(oreAnni);
  const conEventi = new Set();
  for (const i of infortuni || []) if (i && i.tipo === "infortunio") {
    const a = annoRegistrato(i); if (a != null) conEventi.add(a);
  }
  const noti = [...new Set([...ore.keys(), ...conEventi, ...dubbi])].filter(a => a <= annoFine);
  const primo = Math.max(noti.length ? Math.min(...noti) : annoFine, annoFine - finestra + 1);
  const anni = [];
  for (let a = primo; a <= annoFine; a++) {
    const r = indiciInfortunistici(infortuni, ore.has(a) ? ore.get(a) : null, a);
    anni.push(dubbi.has(a)
      ? { ...r, motivo: "Per il " + a + " ci sono DUE registrazioni di ore diverse: finché non ne resta "
          + "una sola l'indice non si calcola, perché sceglierne una cambierebbe il risultato senza che si veda." }
      : r);
  }
  const misurabili = anni.filter(r => r.calcolabile);
  const fuoriPeriodo = noti.filter(a => a < primo).sort((a, b) => a - b);
  const oreFuoriPeriodo = fuoriPeriodo.filter(a => ore.has(a));
  return {
    anni, dal: primo, al: annoFine,
    misurabili: misurabili.length,
    conEventiSenzaOre: anni.filter(r => !r.calcolabile && r.infortuni > 0).map(r => r.anno),
    anniDubbi: [...dubbi].filter(a => a >= primo && a <= annoFine).sort((a, b) => a - b),
    fuoriPeriodo, oreFuoriPeriodo,
    confronto: confrontaUltimiDueAnni(misurabili, primo, annoFine, oreFuoriPeriodo),
    indici: INDICI_TREND,
  };
}

/* Il confronto fra gli ultimi due anni MISURATI. Non è esportata: l'unica
   porta è `andamentoIndici`, così non nascono due modi di leggere il verso. */
function confrontaUltimiDueAnni(misurabili, dal, al, oreFuori) {
  const coda = oreFuori.length
    ? " Fuori dal periodo mostrato ci sono anche le ore del " + oreFuori.join(", ") + "."
    : "";
  if (misurabili.length < 2)
    return { confrontabile: false, pochi: false, verso: null, per: [],
      motivo: (misurabili.length === 0
        ? "Nel periodo " + dal + "–" + al + " non c'è nessun anno con le ore lavorate: senza il "
          + "denominatore non c'è nessun indice, quindi neanche un andamento."
        : "Nel periodo " + dal + "–" + al + " c'è un anno solo con le ore lavorate (" + misurabili[0].anno
          + "): per dire se gli indici salgono o scendono ne servono almeno due.") + coda };
  const a = misurabili[misurabili.length - 1], da = misurabili[misurabili.length - 2];
  const eventi = da.infortuni + a.infortuni;
  const per = INDICI_TREND.map(d => {
    const v0 = da[d.chiave], v1 = a[d.chiave], delta = Math.round((v1 - v0) * 100) / 100;
    return { ...d, da: v0, a: v1, delta,
      variazione: v0 > 0 ? Math.round((v1 - v0) / v0 * 1000) / 10 : null,
      variazionePerche: v0 > 0 ? null
        : "Il " + da.anno + " era a zero: una variazione in percentuale non esiste, si legge il valore.",
      verso: delta === 0 ? "stabile" : delta < 0 ? "migliora" : "peggiora" };
  });
  const versi = new Set(per.map(p => p.verso)); versi.delete("stabile");
  return { confrontabile: true, motivo: null, da: da.anno, a: a.anno,
    adiacenti: a.anno - da.anno === 1, salto: a.anno - da.anno,
    /* decisione 17: se in uno dei due anni una prognosi è ancora aperta, il
       verso di IG e LTIFR è letto su un numero che deve ancora salire. Non si
       nasconde il confronto — si dice che quel verso può cambiare.
       ⛔ E FINO AL 03/08 QUEL «SI DICE» NON LO DICEVA NESSUNO: `noto` e
       `daQuantificare` erano scritti qui e non li leggeva né la pagina né il
       modulo — la guardia scollegata della regola 20, sulla bandiera che il
       principio del fondatore esiste per far leggere. Misurato su tre
       infortuni nel 2025 e tre nel 2026 (di cui uno a prognosi aperta), 20.000
       ore per anno: la scheda mostrava la pastiglia VERDE «In miglioramento»
       con «Indice di gravità: 3,00 → 0,15 (−95,0%) migliora» e «LTIFR: 150,00
       → 100,00 (−33,3%) migliora», e da nessuna parte che quei due numeri
       devono ancora salire. Adesso la frase la scrive `avvisoAndamentoMinimo`,
       qui sotto, e i due anni sono separati perché la DIREZIONE dell'errore
       dipende da quale dei due ha le giornate mancanti. */
    daQuantificare: da.daQuantificare + a.daQuantificare,
    daQuantificarePrecedente: da.daQuantificare,
    daQuantificareRecente: a.daQuantificare,
    noto: da.noto !== false && a.noto !== false,
    eventi, pochi: troppoPochiPerTendenza(eventi), per,
    verso: versi.size === 0 ? "stabile" : versi.size > 1 ? "misto" : [...versi][0] };
}

/* La lettura della bandiera `noto` del CONFRONTO, gemella di
   `avvisoGravitaMinima` e scritta per la stessa ragione (regola 7: quello che
   un numero dichiara è una regola, e a scriverla dev'essere uno solo). Torna
   `null` quando non c'è niente da avvertire, così chi disegna non riserva
   spazio a un avviso che non arriva.
   ⚠️ `noto !== false` e non `!noto`: un confronto costruito prima che la
   bandiera esistesse non ha la proprietà, e `!undefined` la farebbe scattare
   su ogni riga. */
export function avvisoAndamentoMinimo(confronto) {
  const c = confronto || {};
  if (!c.confrontabile || c.noto !== false) return null;
  const dopo = +c.daQuantificareRecente || 0, prima = +c.daQuantificarePrecedente || 0;
  const q = (n) => n === 1 ? "un infortunio" : n + " infortuni";
  const dove = dopo && prima
    ? "in tutti e due gli anni ci sono infortuni a prognosi ancora aperta (" + q(prima)
      + " nel " + c.da + ", " + q(dopo) + " nel " + c.a + ")"
    : dopo
      ? "nel " + c.a + " la prognosi di " + q(dopo) + " è ancora aperta"
      : "nel " + c.da + " la prognosi di " + q(prima) + " è ancora aperta";
  /* La direzione dell'errore NON è la stessa nei due casi, e dirla al
     contrario sarebbe peggio che tacere: le giornate che mancano nell'anno
     recente fanno sembrare il confronto migliore del vero, quelle che mancano
     nell'anno di partenza lo fanno sembrare peggiore. */
  const verso = dopo
    ? "l'anno più recente ha giornate perse ancora da contare, quindi il suo indice di gravità e "
      + "il suo LTIFR possono solo SALIRE: un «migliora» letto adesso può diventare un «peggiora»."
    : "le giornate che mancano sono nell'anno di partenza, quindi il confronto sta partendo da un "
      + "valore più basso del vero.";
  return "Indice di gravità e LTIFR di questo confronto sono MINIMI: " + dove + ", e " + verso;
}

// ============================================================
// L'ANALISI DELLA CAUSA (i «5 Perché»), E LA SUA DIFESA
// ------------------------------------------------------------
// Scudo aveva già la catena evento → azione correttiva (`origineTipo`/
// `origineId`, `statoAzione`, `riepilogoNearMiss`), e la pagina spinge ad
// aprire l'azione subito dopo la segnalazione dicendo — testuale — che
// «registrarlo serve a poco se non si corregge quello che l'ha causato».
// Ma il «quello che l'ha causato» non era scritto da nessuna parte: la parola
// CAUSA compariva una volta sola in tutta l'app, dentro quella frase.
// Piano per esteso: docs/PIANO_CAUSA_RADICE_SCUDO.md
//
// ⛔ I «5 Perché» hanno una fama migliore di quella che meritano, e vanno
// introdotti sapendolo: portano a una causa sola, danno risposte diverse a
// persone diverse, e finiscono quasi sempre SULLA PERSONA («perché non ha
// guardato» → «perché è distratto»), il che come azione correttiva produce un
// richiamo, cioè niente. La difesa è di prodotto, non di metodo — e non vieta:
// CHIEDE. Se lo strumento accusa, chi lo usa smette di scrivere la verità, ed è
// la stessa regola del ponte con Terra che non dà la colpa a chi compila.
export const CAUSE_ANALISI = [
  { chiave: "tecnica", etichetta: "Tecnica", esempio: "attrezzatura rotta, protezione mancante, mezzo inadeguato" },
  { chiave: "organizzativa", etichetta: "Organizzativa", esempio: "procedura assente, sorveglianza non prevista, turni" },
  { chiave: "formazione", etichetta: "Formazione", esempio: "mansione affidata senza addestramento, istruzione mai data" },
  { chiave: "dpi", etichetta: "DPI", esempio: "DPI mancante, sbagliato, o non usabile nel lavoro reale" },
  { chiave: "ambientale", etichetta: "Ambientale", esempio: "fronte instabile, pista, meteo, visibilità, rumore" },
  { chiave: "comportamentale", etichetta: "Comportamentale", esempio: "scelta di chi lavorava — con le difese qui sotto" },
];

/* Le parole che nominano una persona senza fare un nome. Non serve beccarle
   tutte: serve CHIEDERE quando ce n'è una. */
const RUOLI_PERSONA = ["operatore", "lavoratore", "addetto", "collega", "autista",
  "conducente", "dipendente", "manovratore", "fochino", "capocantiere"];

/* ⛔ IL NOME DI UNA PERSONA NON SI INDOVINA: SI CERCA.
   Un'euristica linguistica in italiano è una pessima idea — «Rossi» è un
   cognome e anche un colore, «Bo» è un cognome e sta dentro «bordo» — e un
   controllo che sbaglia ACCUSA CHI HA SCRITTO LA VERITÀ, cioè fa esattamente
   il danno che dovrebbe evitare. Ma Scudo ha già l'elenco dei LAVORATORI: il
   confronto è coi nomi veri dell'azienda, a parola intera. */
export function nominaUnaPersona(testo, lavoratori) {
  const t = normalizzaTesto(testo);
  if (!t) return null;
  const intera = (parola) => new RegExp("(^| )" + parola + "( |$)").test(t);
  for (const l of lavoratori || []) {
    const nome = normalizzaTesto((l || {}).nome
      || ((l || {}).cognome ? (l.cognome + " " + (l.nome || "")) : ""));
    if (!nome) continue;
    // il cognome da solo basta: nei verbali si scrive «Rossi non ha guardato»
    const pezzi = nome.split(" ").filter((p) => p.length >= 3);
    if (pezzi.some(intera))
      return { tipo: "nome", trovato: String((l.nome || l.cognome || "")).trim() };
  }
  for (const r of RUOLI_PERSONA) if (intera(r)) return { tipo: "ruolo", trovato: r };
  return null;
}

/* Le due righe che BLOCCANO riguardano dati mancanti; quelle che riguardano il
   CONTENUTO chiedono e basta. Un'analisi che finisce su una persona resta
   valida: a volte è davvero un comportamento, e vietarlo insegnerebbe solo a
   scrivere quello che l'app vuole sentire. */
export function validaAnalisi(bozza, lavoratori) {
  const b = bozza || {};
  const perche = (b.perche || []).map((x) => String(x || "").trim()).filter(Boolean);
  const avvisi = [];
  if (perche.length < 2)
    avvisi.push({ campo: "perche", grave: true,
      testo: "Serve almeno un secondo perché: il primo è quasi sempre la descrizione di quello che è successo, non la sua causa." });
  const chi = nominaUnaPersona(perche[perche.length - 1] || "", lavoratori);
  if (chi)
    avvisi.push({ campo: "perche", grave: false,
      testo: `L'ultimo perché nomina una persona${chi.tipo === "nome" ? " (" + chi.trovato + ")" : ""}. È quello che è successo, o è la persona a cui è successo? Se sotto c'è una condizione — un'attrezzatura, una procedura, un addestramento — è quella la causa da correggere.` });
  if (b.causa === "comportamentale" && perche.length < 3)
    avvisi.push({ campo: "causa", grave: false,
      testo: "«Comportamentale» da sola non è un'analisi: scrivi anche perché quel comportamento era possibile. Quasi sempre sotto c'è una causa tecnica, organizzativa o di formazione." });
  if (!CAUSE_ANALISI.some((c) => c.chiave === b.causa))
    avvisi.push({ campo: "causa", grave: true,
      testo: "Scegli la famiglia della causa: serve a capire quali cause si ripetono, che è la domanda a cui questa scheda deve rispondere." });
  return { valida: !avvisi.some((a) => a.grave), avvisi };
}

/* L'analisi di un evento, se qualcuno l'ha fatta. Una sola per evento: se
   serve rifarla si corregge quella, invece di accumulare versioni fra cui
   nessuno sa quale valga. */
export function analisiDiEvento(analisi, eventoId) {
  const id = String(eventoId || "");
  if (!id) return null;
  return (analisi || []).find((a) => a && String(a.eventoId || "") === id) || null;
}

/* ⛔ GLI EVENTI RIMASTI SENZA UN PERCHÉ. Senza questo conto l'analisi la fa chi
   ha voglia, e il registro si riempie di eventi muti: è la differenza fra una
   funzione che c'è e una che viene usata.
   Gli infortuni con assenza vengono per primi — sono quelli su cui l'ente
   chiede conto — poi i near-miss, e dentro ogni gruppo i più recenti prima. */
export function eventiSenzaAnalisi(infortuni, analisi) {
  const fatti = new Set((analisi || []).map((a) => String((a || {}).eventoId || "")).filter(Boolean));
  /* ⛔ E «CON ASSENZA» SI CHIEDE A `giornateAssenza`, NON AL CAMPO GREZZO. La
     riga era `+((e || {}).giorniAssenza) > 0`: `+null` fa `0`, quindi
     l'infortunio a **prognosi ancora aperta** — quello di cui le giornate non
     si sanno *ancora*, cioè il caso per cui esiste la decisione 17 — finiva
     nello stesso secchio di un infortunio con zero giorni MISURATI, sotto a
     uno di gennaio da 14 giorni. Ed è esattamente l'evento su cui l'ente
     chiede conto, cioè quello che questa riga di commento promette di mettere
     per primo.
     `prognosiAperta` e `giornateAssenza` sono nello stesso file e decidono già
     lo schermo, il CSV del registro e gli indici: qui c'era la quarta lettura,
     più debole delle altre tre. */
  const gravita = (e) => ((prognosiAperta(e) || giornateAssenza(e) > 0) ? 2
    : (e || {}).tipo === "near-miss" ? 0 : 1);
  return (infortuni || [])
    .filter((e) => e && e.id && !fatti.has(String(e.id)))
    .sort((a, b) => gravita(b) - gravita(a)
      || String(b.data || "").localeCompare(String(a.data || "")));
}

/* ⛔ QUALI CAUSE TORNANO — e su quante analisi, che è la parte che rende il
   numero leggibile. Tre eventi analizzati su venti NON dicono «la causa
   principale è organizzativa»: dicono che sono stati analizzati tre eventi su
   venti, e su così pochi non si legge nessuna ricorrenza. La guardia è la
   stessa di `riepilogoNearMiss`, chiamata e non ricopiata. */
export function causeRicorrenti(infortuni, analisi) {
  const eventi = (infortuni || []).filter((e) => e && e.id);
  const conAnalisi = (analisi || []).filter((a) => a && a.causa
    && eventi.some((e) => String(e.id) === String(a.eventoId || "")));
  const per = {};
  for (const a of conAnalisi) per[a.causa] = (per[a.causa] || 0) + 1;
  const righe = CAUSE_ANALISI
    .map((c) => ({ chiave: c.chiave, etichetta: c.etichetta, quante: per[c.chiave] || 0 }))
    .filter((r) => r.quante > 0)
    .sort((a, b) => b.quante - a.quante);
  return { righe, analizzati: conAnalisi.length, eventi: eventi.length,
    /* «leggibile» non vuol dire «ci sono dati»: vuol dire che ce n'è abbastanza
       da poterci leggere qualcosa. Le due cose confuse producono la freccia
       verso l'alto disegnata su due punti. */
    leggibile: !troppoPochiPerTendenza(conAnalisi.length),
    motivo: troppoPochiPerTendenza(conAnalisi.length)
      ? `${conAnalisi.length === 0 ? "Nessun evento è stato analizzato" : "Solo " + conAnalisi.length + " event" + (conAnalisi.length === 1 ? "o è stato analizzato" : "i sono stati analizzati")} su ${eventi.length}: servono almeno ${MIN_TENDENZA} analisi prima di poter dire quali cause si ripetono.`
      : "" };
}

// ══════════════════════════════════════════════════════════════════════
// APPALTATORI, QUALIFICA E DOCUMENTO DI COORDINAMENTO
// ══════════════════════════════════════════════════════════════════════
// In una cava le imprese esterne ci sono sempre: trasportatori, manutentori,
// ditte di perforazione, imprese di ripristino. Il committente ha due obblighi
// che nascono insieme, e questa parte del modulo serve a tenerli in ordine.
//
// ⛔ E IL SECONDO OBBLIGO, IN CAVA, NON È IL DUVRI. È la cosa che vale la pena
// sapere di tutto questo blocco:
//  · fuori dalla cava (un cantiere di un cliente) vale la regola generale —
//    art. 26 c.3 D.Lgs 81/08, che chiede al committente il DUVRI;
//  · DENTRO la cava vale la norma speciale delle attività estrattive —
//    art. 9 D.Lgs 624/96, che chiede al TITOLARE il **DSS coordinato**: gli
//    appaltatori gli trasmettono la propria valutazione dei rischi, lui la
//    valuta insieme ai rischi dell'attività estrattiva e redige il documento
//    coordinato, e gli appaltatori — sentiti i propri rappresentanti dei
//    lavoratori — lo **sottoscrivono**, diventando responsabili della parte di
//    loro competenza (art. 9 c.2).
// Le due differenze che cambiano il lavoro di chi usa Scudo sono queste: il
// DSS coordinato vuole una FIRMA che il DUVRI non vuole, e le esclusioni del
// comma 3-bis (natura intellettuale, mera fornitura, cinque uomini-giorno)
// stanno nell'art. 26 e riguardano il DUVRI — nelle fonti lette non risultano
// riportate per il DSS coordinato. Scudo quindi NON le applica alla cava, e lo
// scrive in chiaro invece di applicarle in silenzio: è una nota informativa,
// non un parere legale, e va confermata con l'RSPP come già la nota della
// L. 198/2025 qui sopra.

/* I documenti della qualifica.
   ⛔ `obbligatorio` DICE UNA COSA PRECISA, e vale la pena non gonfiarla: l'art.
   26 c.1 lett. a) ne elenca DUE, il certificato camerale e l'autocertificazione
   ex art. 47 DPR 445/2000. Il **DURC** non è in quell'elenco — è obbligatorio
   per i cantieri (art. 90 c.9) e nella pratica lo chiedono quasi tutti i
   committenti, ma dichiararlo «obbligo dell'art. 26» sarebbe far fare lavoro
   inutile citando male una norma, e toglierebbe credibilità al resto della
   schermata. Sta nell'elenco come prassi, con la sua provenienza scritta. */
export const TIPI_DOC_APPALTATORE = [
  { chiave: "cciaa", nome: "Certificato CCIAA", obbligatorio: true, scade: true,
    fonte: "art. 26 c.1 lett. a) n.1 D.Lgs 81/08" },
  { chiave: "autocert", nome: "Autocertificazione dei requisiti", obbligatorio: true, scade: false,
    fonte: "art. 26 c.1 lett. a) n.2 D.Lgs 81/08 — art. 47 DPR 445/2000" },
  { chiave: "durc", nome: "DURC", obbligatorio: false, scade: true,
    fonte: "prassi di qualifica — NON elencato dall'art. 26" },
  { chiave: "dvr", nome: "DVR dell'impresa", obbligatorio: false, scade: false,
    fonte: "serve al titolare per redigere il DSS coordinato — art. 9 c.2 D.Lgs 624/96" },
  { chiave: "lavoratori", nome: "Elenco lavoratori e idoneità", obbligatorio: false, scade: false,
    fonte: "prassi di qualifica" },
  { chiave: "polizza", nome: "Polizza RC", obbligatorio: false, scade: true,
    fonte: "prassi contrattuale" },
];
export function tipoDocAppaltatore(chiave) {
  return TIPI_DOC_APPALTATORE.find((t) => t.chiave === chiave) || null;
}

/* I documenti di qualifica vivono nel registro `documenti` che Scudo ha già —
   con il suo allegato e la regola condivisa di `controllaAllegato` — collegati
   da `appaltatoreId`, esattamente come gli altri si collegano a `cantiereId` e
   `lavoratoreId`. Nessun secondo archivio. */
export function docDiAppaltatore(documenti, appaltatoreId) {
  if (!appaltatoreId) return [];
  return (documenti || []).filter((d) => d && d.appaltatoreId === appaltatoreId);
}

/* ⛔ UN APPALTATORE DI CUI NON SI È VERIFICATO NIENTE NON È IDONEO: È **NON
   VERIFICATO**, e le due cose si dicono in modo diverso. È il principio del
   fondatore nel punto in cui costa di più, perché questa è la schermata che si
   mostra a un ispettore: un semaforo verde su un'anagrafica vuota sarebbe la
   cosa peggiore che questo modulo possa fare.
   La scadenza NON si giudica qui: la dice `statoScadenza`, cioè
   `statoScadenzaHSE` di `shared/dw-ponti.js`, la stessa che regola lo
   scadenzario e i turni di Campo. Un certificato camerale e un DURC hanno una
   scadenza come tutto il resto, e non ne meritano una seconda copia. */
export function qualificaAppaltatore(appaltatore, documenti, oggi = new Date()) {
  const id = appaltatore && appaltatore.id;
  const suoi = docDiAppaltatore(documenti, id);
  const per = new Map();
  for (const d of suoi) if (d.tipoQualifica) per.set(d.tipoQualifica, d);

  const mancanti = [], scaduti = [], senzaData = [], inScadenza = [];
  for (const t of TIPI_DOC_APPALTATORE) {
    const d = per.get(t.chiave);
    if (!d) { if (t.obbligatorio) mancanti.push(t.nome); continue; }
    if (!t.scade) continue;
    const st = statoScadenza(d.scadenza, oggi);
    if (st === "scaduta") scaduti.push(t.nome);
    else if (st === "senza data") senzaData.push(t.nome);
    else if (st === "in-scadenza") inScadenza.push(t.nome);
  }

  const base = { appaltatoreId: id || null, quanti: suoi.length, mancanti, scaduti, senzaData, inScadenza,
    obbligatoriRichiesti: TIPI_DOC_APPALTATORE.filter((t) => t.obbligatorio).length };

  if (!suoi.length)
    return { ...base, noto: false, esito: "non-verificato",
      perche: "Di questa impresa non è stato acquisito nessun documento: l'idoneità tecnico-professionale "
        + "non è stata verificata. Non vuol dire che non sia idonea — vuol dire che non lo sappiamo." };
  if (scaduti.length)
    return { ...base, noto: true, esito: "scaduto", perche: "Scaduti: " + scaduti.join(", ") + "." };
  if (mancanti.length)
    return { ...base, noto: true, esito: "incompleto",
      perche: "Manca quello che l'art. 26 c.1 lett. a) chiede di acquisire: " + mancanti.join(", ") + "." };
  if (senzaData.length)
    return { ...base, noto: false, esito: "senza-data",
      perche: "Senza una data leggibile non si sa se sono ancora validi: " + senzaData.join(", ") + "." };
  if (inScadenza.length)
    return { ...base, noto: true, esito: "in-scadenza", perche: "In scadenza entro 30 giorni: " + inScadenza.join(", ") + "." };
  return { ...base, noto: true, esito: "verificato",
    perche: "I documenti dell'art. 26 sono stati acquisiti e sono in corso di validità." };
}

/* Chi consuma la bandiera `noto`: sta nel modulo e non nella pagina perché la
   frase che distingue «non a posto» da «non lo sappiamo» va decisa in un posto
   solo (regola 7 di run-stile). */
export function descriviQualifica(q) {
  if (!q) return "";
  return (q.noto ? "" : "Non lo sappiamo — ") + q.perche;
}

/* Quale documento di coordinamento è in gioco: dipende da DOVE si lavora. */
export function documentoCoordinamento(cantiere) {
  if (((cantiere && cantiere.tipo) || "") === "cava")
    return { sigla: "DSS coordinato", nome: "Documento di sicurezza e salute coordinato",
             norma: "art. 9 D.Lgs 624/96", esclusioniAmmesse: false, sottoscrizione: true };
  return { sigla: "DUVRI", nome: "Documento unico di valutazione dei rischi da interferenze",
           norma: "art. 26 c.3 D.Lgs 81/08", esclusioniAmmesse: true, sottoscrizione: false };
}

/* I rischi che l'art. 26 c.3-bis mette al riparo dalle esclusioni: se ci sono,
   il documento va fatto comunque, anche per due giorni di lavoro. In cava
   «atmosfere esplosive» non è un'ipotesi di scuola. */
export const RISCHI_PARTICOLARI = [
  { chiave: "incendio", nome: "Rischio di incendio di livello elevato" },
  { chiave: "confinati", nome: "Attività in ambienti confinati" },
  { chiave: "cancerogeni", nome: "Agenti cancerogeni, mutageni o biologici" },
  { chiave: "amianto", nome: "Amianto" },
  { chiave: "esplosive", nome: "Atmosfere esplosive" },
];
export function rischioParticolare(chiave) {
  return RISCHI_PARTICOLARI.find((r) => r.chiave === chiave) || null;
}

const NATURE_ESCLUSE = {
  intellettuale: "servizio di natura intellettuale",
  fornitura: "mera fornitura di materiali o attrezzature",
};
export const NATURE_APPALTO = [
  { chiave: "", nome: "Lavori o servizi in cava" },
  { chiave: "intellettuale", nome: "Servizio di natura intellettuale" },
  { chiave: "fornitura", nome: "Mera fornitura di materiali o attrezzature" },
];

/* SERVE O NON SERVE il documento di coordinamento.
   ⛔ I CASI ESCLUSI CONTANO QUANTO QUELLI INCLUSI: dire «obbligatorio» dove non
   lo è fa fare lavoro inutile e toglie credibilità a tutto il resto. Ma la
   direzione pericolosa è l'altra, ed è quella che questa funzione difende:
   **«non lo so» non è «non serve»**. La durata non registrata sarebbe finita a
   zero (`+null` fa 0, e 0 ≤ 5), cioè l'appalto di cui nessuno ha scritto niente
   sarebbe uscito ESENTE — la risposta più tranquilla, data sul dato mancante.
   Perciò `serve` ha tre valori e non due, e `noto: false` accompagna il terzo.
   Anche l'esclusione vera vuole una condizione: il c.3-bis la concede «sempre
   che» non ci siano rischi particolari, quindi finché nessuno li ha guardati
   l'esclusione non si può concedere. */
export function duvriDovuto(appalto, cantiere) {
  const a = appalto || {};
  const doc = documentoCoordinamento(cantiere);
  /* ⛔ UN SITO CHE NON C’È NON È «FUORI CAVA». Misurato il 03/09 svuotando
     l’anagrafe dei siti nella risposta HTTP del modulo: l’appalto di ripristino
     della dimostrazione, che ha il DSS coordinato NON sottoscritto, passava da
     «da sistemare» ad «A POSTO» — perché senza il sito la regola diventava
     quella del DUVRI, che la firma non la chiede. Il sito manca in due modi
     veri: il modulo lo lascia facoltativo (`cantiereId: null`) e togliere un
     sito dall’anagrafe non tocca i suoi appalti. In tutt’e due non si sa se è
     una cava, quindi non si sa quale documento serve: «non lo sappiamo», non
     «a posto». La sigla resta quella del DUVRI — un sito che non si trova non
     diventa una cava con le sue regole — ma il verdetto no. */
  if (!cantiere)
    return { ...doc, noto: false, serve: null,
      perche: "Il sito dell’appalto non è indicato, o non è più in anagrafe: senza sapere se è una cava "
        + "non si sa se serve il DSS coordinato (art. 9 D.Lgs 624/96) o il DUVRI (art. 26 D.Lgs 81/08), "
        + "e un appalto di cui non si sa non è un appalto a posto." };
  const rischi = (Array.isArray(a.rischiParticolari) ? a.rischiParticolari : [])
    .map((k) => rischioParticolare(k)).filter(Boolean);

  if (rischi.length)
    return { ...doc, noto: true, serve: true,
      perche: "Ci sono rischi particolari (" + rischi.map((r) => r.nome.toLowerCase()).join(", ")
        + "): le esclusioni del comma 3-bis non si applicano, e il documento va fatto." };

  if (!doc.esclusioniAmmesse)
    return { ...doc, noto: true, serve: true,
      perche: "Il lavoro si svolge in cava: il documento è il DSS coordinato dell'art. 9 D.Lgs 624/96, "
        + "che scatta quando entra un'impresa esterna. Le esclusioni del comma 3-bis riguardano il DUVRI "
        + "dell'art. 26 e Scudo non le applica alla cava." };

  const ug = a.uominiGiorno;
  const ugNoto = ug !== null && ug !== undefined && ug !== "" && Number.isFinite(+ug) && +ug >= 0;
  const nat = NATURE_ESCLUSE[a.natura];

  if (nat && a.rischiValutati === true)
    return { ...doc, noto: true, serve: false,
      perche: "È una " + nat + " e i rischi particolari sono stati esclusi: il DUVRI non è richiesto (art. 26 c.3-bis)." };
  if (nat)
    return { ...doc, noto: false, serve: null,
      perche: "È una " + nat + ", che il comma 3-bis esclude — ma solo «sempre che» non ci siano rischi "
        + "particolari, e nessuno li ha ancora guardati." };
  if (!ugNoto)
    return { ...doc, noto: false, serve: null,
      perche: "Non è stata registrata la durata in uomini-giorno: sopra i cinque il DUVRI è richiesto, "
        + "sotto no. Senza quel numero non si può dire, e un appalto su cui non si sa non è un appalto esente." };
  if (+ug > 5)
    return { ...doc, noto: true, serve: true,
      perche: "La durata è di " + (+ug) + " uomini-giorno, sopra la soglia dei cinque: il DUVRI è richiesto." };
  if (a.rischiValutati !== true)
    return { ...doc, noto: false, serve: null,
      perche: "La durata è di " + (+ug) + " uomini-giorno, sotto la soglia — ma l'esclusione vale «sempre che» "
        + "non ci siano rischi particolari, e nessuno li ha ancora guardati." };
  return { ...doc, noto: true, serve: false,
    perche: "Durata di " + (+ug) + " uomini-giorno e nessun rischio particolare: il DUVRI non è richiesto (art. 26 c.3-bis)." };
}

/* I COSTI DELLE INTERFERENZE — art. 26 c.5: vanno indicati specificamente **a
   pena di nullità** del contratto, e non sono soggetti a ribasso.
   ⛔ `+"" fa 0`: un campo lasciato vuoto sarebbe diventato «zero euro
   dichiarati», cioè un adempimento assolto da un campo mai compilato. Zero
   dichiarato è una posizione che qualcuno si prende e va motivata; vuoto è il
   contratto che rischia la nullità. */
export function costiInterferenze(appalto) {
  const v = appalto && appalto.costiSicurezza;
  if (v === null || v === undefined || (typeof v === "string" && v.trim() === ""))
    return { indicati: false, importo: null,
      perche: "I costi della sicurezza da interferenze non sono indicati. L'art. 26 c.5 li vuole indicati "
        + "specificamente A PENA DI NULLITÀ del contratto, e non soggetti a ribasso." };
  const n = +v;
  if (!Number.isFinite(n) || n < 0)
    return { indicati: false, importo: null, perche: "Il valore registrato per i costi da interferenze non è un importo leggibile." };
  return { indicati: true, importo: n,
    perche: n === 0
      ? "Costi da interferenze dichiarati pari a zero: è una dichiarazione, non un campo vuoto, e va motivata nel documento di coordinamento."
      : "Costi da interferenze indicati, e non soggetti a ribasso." };
}

/* ⛔ IL DUVRI NON È UN ALLEGATO, È UNA DECISIONE: va detto CHI l'ha redatto,
   QUANDO, e per quale appalto. Un documento di coordinamento senza data non
   copre nessun periodo, e uno senza redattore non attribuisce a nessuno la
   responsabilità che il committente non può delegare. Perciò gli stati sono
   sette e non due: la graffetta non è fra questi.
   Lo stato `tardivo` esiste perché l'art. 26 c.3 vuole il documento **allegato
   al contratto**: se porta una data successiva all'avvio dei lavori, i primi
   giorni non erano coperti — ed è un fatto che si vede solo confrontando due
   date che nessuno confronta a mano. */
export const STATI_COORDINAMENTO = ["non-decidibile", "non-dovuto", "non-redatto",
  "senza-data", "senza-redattore", "tardivo", "da-sottoscrivere", "in-vigore"];

export function statoCoordinamento(appalto, cantiere, oggi = new Date()) {
  const a = appalto || {};
  const dov = duvriDovuto(a, cantiere);
  if (dov.serve === null) return { ...dov, stato: "non-decidibile" };
  if (dov.serve === false) return { ...dov, stato: "non-dovuto" };

  const red = String(a.coordRedattore || "").trim();
  const dataOk = statoScadenza(a.coordData, oggi) !== "senza data";
  if (!red && !dataOk)
    return { ...dov, stato: "non-redatto",
      perche: dov.sigla + " dovuto e non risulta redatto: non c'è né un redattore né una data." };
  if (!dataOk)
    return { ...dov, stato: "senza-data",
      perche: "Il " + dov.sigla + " risulta redatto da " + red + " ma senza data: un documento di "
        + "coordinamento senza data non copre nessun periodo." };
  if (!red)
    return { ...dov, stato: "senza-redattore",
      perche: "Il " + dov.sigla + " ha una data ma non dice chi l'ha redatto: la responsabilità del "
        + "coordinamento è del committente e va scritta col nome di chi se l'è presa." };

  /* ⛔ SI CONFRONTANO I GIORNI, NON LE STRINGHE INTERE. Il prototipo rispondeva
     «tardivo» su un documento firmato LO STESSO GIORNO dell'avvio, perché
     «2026-03-01T08:00» è maggiore di «2026-03-01» per il confronto fra
     stringhe: un ritardo inventato da un'ora attaccata alla data. */
  const gg = (x) => String(x || "").slice(0, 10);
  if (statoScadenza(a.dataInizio, oggi) !== "senza data" && gg(a.coordData) > gg(a.dataInizio))
    return { ...dov, stato: "tardivo",
      perche: "Il " + dov.sigla + " è datato " + dataIt(a.coordData) + ", dopo l'inizio dei lavori ("
        + dataIt(a.dataInizio) + "): i primi giorni non erano coperti." };

  if (dov.sottoscrizione && a.coordSottoscritto !== true)
    return { ...dov, stato: "da-sottoscrivere",
      perche: "Il DSS coordinato è redatto ma l'impresa non l'ha sottoscritto: l'art. 9 c.2 del D.Lgs 624/96 "
        + "vuole la firma, ed è con quella che l'appaltatore diventa responsabile della parte di sua competenza." };

  return { ...dov, stato: "in-vigore", perche: "Redatto da " + red + " il " + dataIt(a.coordData) + "." };
}

/* La riga dell'appalto: le tre domande insieme — l'impresa è qualificata? il
   documento di coordinamento c'è? i costi sono indicati?
   ⛔ CIÒ CHE DICHIARA `noto: false` FINISCE FRA GLI **IGNOTI**, NON FRA I
   PROBLEMI. Sommarlo ai problemi farebbe passare per «fuori regola» un appalto
   che nessuno ha ancora guardato; ignorarlo lo farebbe passare per «a posto».
   Sono tre esiti perché i casi sono tre. */
export function statoAppalto(appalto, cantiere, appaltatore, documenti, oggi = new Date()) {
  const qualifica = qualificaAppaltatore(appaltatore, documenti, oggi);
  const coordinamento = statoCoordinamento(appalto, cantiere, oggi);
  const costi = costiInterferenze(appalto);
  const problemi = [], ignoti = [];
  if (!qualifica.noto) ignoti.push(descriviQualifica(qualifica));
  else if (qualifica.esito !== "verificato" && qualifica.esito !== "in-scadenza") problemi.push(qualifica.perche);
  if (!coordinamento.noto) ignoti.push(coordinamento.perche);
  else if (coordinamento.stato !== "in-vigore" && coordinamento.stato !== "non-dovuto") problemi.push(coordinamento.perche);
  if (coordinamento.serve === true && !costi.indicati) problemi.push(costi.perche);
  return { appaltoId: (appalto && appalto.id) || null, qualifica, coordinamento, costi, problemi, ignoti,
    noto: ignoti.length === 0,
    esito: problemi.length ? "da-sistemare" : (ignoti.length ? "non-verificato" : "a-posto") };
}

export function appaltiDiCantiere(appalti, cantiereId) {
  if (!cantiereId) return [];
  return (appalti || []).filter((a) => a && a.cantiereId === cantiereId);
}
export function appaltiDiAppaltatore(appalti, appaltatoreId) {
  if (!appaltatoreId) return [];
  return (appalti || []).filter((a) => a && a.appaltatoreId === appaltatoreId);
}

/* Il riepilogo che si mostra a un ispettore.
   ⛔ NESSUN APPALTO REGISTRATO NON VUOL DIRE NESSUNA IMPRESA IN CAVA — è la
   stessa distinzione che Campo fa nell'appello del turno fra «non c'è» e «non
   lo so». Un registro vuoto qui non dimostra la conformità: dimostra che non è
   stato compilato, e la bandiera lo dice. */
export function riepilogoAppalti(appalti, cantieri, appaltatori, documenti, oggi = new Date()) {
  const perCant = new Map((cantieri || []).filter((c) => c && c.id).map((c) => [c.id, c]));
  const perApp = new Map((appaltatori || []).filter((a) => a && a.id).map((a) => [a.id, a]));
  const attivi = (appalti || []).filter((a) => a && a.stato !== "chiuso");
  const righe = attivi.map((a) => ({ appalto: a,
    ...statoAppalto(a, perCant.get(a.cantiereId), perApp.get(a.appaltatoreId), documenti, oggi) }));
  const quanti = (e) => righe.filter((r) => r.esito === e).length;

  if (!attivi.length)
    return { quanti: 0, aPosto: 0, daSistemare: 0, nonVerificati: 0, righe: [], noto: false,
      testo: "Nessun appalto registrato. Non vuol dire che in cava non entri nessuna impresa esterna: vuol "
        + "dire che qui non ne risulta nessuna, e finché è così questa schermata non dimostra niente." };

  const daSistemare = quanti("da-sistemare"), nonVerificati = quanti("non-verificato"), aPosto = quanti("a-posto");
  return { quanti: attivi.length, aPosto, daSistemare, nonVerificati, righe, noto: nonVerificati === 0,
    testo: (daSistemare || nonVerificati)
      ? [daSistemare ? conta(daSistemare, "appalto da sistemare", "appalti da sistemare") : "",
         nonVerificati ? nonVerificati + (nonVerificati === 1 ? " su cui manca una verifica" : " su cui mancano verifiche") : ""]
          .filter(Boolean).join(", ") + ", su " + attivi.length + " attiv" + (attivi.length === 1 ? "o" : "i") + "."
      : "Tutt" + (attivi.length === 1 ? "o l'unico appalto attivo ha" : "i e " + attivi.length + " gli appalti attivi hanno")
        + " impresa qualificata, documento di coordinamento in vigore e costi da interferenze indicati." };
}

/* Le imprese su cui c'è qualcosa da fare, per le urgenze del Quadro. */
export function appaltatoriDaVerificare(appaltatori, documenti, oggi = new Date()) {
  return (appaltatori || []).filter((a) => a && a.attivo !== false)
    .map((a) => ({ appaltatore: a, ...qualificaAppaltatore(a, documenti, oggi) }))
    .filter((r) => r.esito !== "verificato" && r.esito !== "in-scadenza");
}

// ============================================================
// S8 · IL PERMESSO DI LAVORO
//
// ⛔ NASCE DA UN DIFETTO, NON DA UN ELENCO DI FUNZIONI. La checklist
// dell'impianto chiede da sempre «Accesso a tramogge e spazi confinati
// regolato da permesso di lavoro» (MODELLI_ISPEZIONE, modello "impianto") —
// cioè obbliga chi ispeziona a rispondere sì/no su un adempimento che l'app
// non sapeva emettere né conservare: la spunta «sì» non aveva niente dietro.
// È il principio del fondatore applicato a una RISPOSTA invece che a un
// numero: una conferma di conformità dove non è stato verificato niente.
//
// CHE COS'È. Un permesso di lavoro è il documento con cui chi comanda il sito
// autorizza un lavoro pericoloso in un LUOGO e in una FINESTRA DI TEMPO, dice
// CHI lo rilascia e CHI lo riceve, elenca le MISURE che devono essere in atto
// prima di cominciare, e si CHIUDE quando il lavoro finisce. Le quattro cose
// che lo rendono un permesso e non un modulo sono: il periodo di validità, le
// due firme, le misure verificate prima, la chiusura.
//
// DA DOVE VIENE QUELLO CHE C'È SCRITTO QUI.
//   · **D.P.R. 177/2011** (ambienti sospetti di inquinamento o confinati):
//     art. 2 c.1 lett. f) e h) — informazione, formazione e addestramento di
//     tutto il personale impiegato, datore di lavoro compreso; lett. g) —
//     DPI, strumentazione e attrezzature idonee; art. 3 c.2 — il datore di
//     lavoro committente individua un proprio RAPPRESENTANTE, formato quanto
//     chi entra, che vigila per tutta la durata; art. 3 c.3 — PROCEDURA DI
//     LAVORO scritta, comprensiva della fase di soccorso e del coordinamento
//     con il sistema di emergenza del SSN e dei Vigili del fuoco.
//   · La prassi dei sistemi di permesso di lavoro (guida HSE «Guidance on
//     permit-to-work systems», HSG250) per le parti che la norma italiana non
//     scrive: chi rilascia e chi accetta, l'identificazione precisa
//     dell'attrezzatura, il periodo di validità limitato, la restituzione
//     («hand-back») al termine, il permesso esposto sul posto di lavoro.
//   · I tipi di permesso in uso negli impianti (fiamma/calore, scavo, circuiti
//     elettrici, generico, spazi confinati) — qui ridotti ai cinque che una
//     cava con impianto usa davvero.
// ⚠️ Le fonti primarie NON sono state aperte una per una da questa sessione
// (il proxy le blocca): quanto sopra viene da ricerca secondaria e dalla
// manualistica italiana. I riferimenti sono scritti perché siano VERIFICABILI
// da chi legge, non perché siano un parere legale — che infatti la pagina
// dichiara di non essere.
//
// COME SI AGGANCIA A QUELLO CHE SCUDO HA GIÀ. Un permesso che non guarda la
// formazione di chi lo riceve è un modulo, non un controllo:
//   · chi lo RICEVE passa da `statoRequisito`, la stessa funzione della
//     matrice «chi posso mandare domani mattina»;
//   · se lo esegue un'IMPRESA ESTERNA passa da `statoAppalto`, quindi dalla
//     qualifica dell'art. 26 e dal documento di coordinamento;
//   · il SITO è un cantiere del registro, chi rilascia e chi sorveglia sono
//     lavoratori dell'anagrafe.
// Nessun secondo archivio, nessuna seconda anagrafe.
// ============================================================

/* ⚠️ `AAAA-MM-GGTHH:MM` — quello che scrive `<input type="datetime-local">` —
   letto come ORA LOCALE e costruito campo per campo. `new Date(stringa)`
   cambia significato a seconda di che cosa gli si dà: con la sola data è UTC,
   con la T è locale, con la Z è di nuovo UTC. Il contenitore gira in UTC e le
   cave stanno in Italia (regola 15), quindi qui non si indovina: si legge la
   stringa e si costruisce la data con i pezzi. E si RILEGGE quello che si è
   costruito, perché «2026-02-30T08:00» JavaScript non lo rifiuta — lo fa
   scivolare al 2 marzo (la stessa trappola di `dataISOEsiste`). */
export function istantePermesso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(s || ""));
  if (!m) return null;
  const Y = +m[1], M = +m[2], G = +m[3], h = +m[4], mi = +m[5];
  const d = new Date(Y, M - 1, G, h, mi, 0, 0);
  if (d.getFullYear() !== Y || d.getMonth() !== M - 1 || d.getDate() !== G
      || d.getHours() !== h || d.getMinutes() !== mi) return null;
  return d;
}

/* Un numero misurato, oppure `null`. NON `parseNum0`: di ciò che non capisce
   quello fa ZERO, e su un LEL zero è la risposta più tranquilla che esista
   («ampiamente sotto il 10%») data su un campo che nessuno ha compilato. */
function misuraLetta(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const s = String(v).trim();
  if (!s) return null;
  const n = numIt(s);
  return Number.isFinite(n) ? n : null;
}

/* LE MISURE CHE DEVONO ESSERE IN ATTO. Ognuna con la sua provenienza, e le
   prassi sono dichiarate prassi: «D.Lgs 81/08 art. 77» e «prassi dei permessi
   per lavoro a caldo» non sono la stessa cosa, e spacciare la seconda per la
   prima toglierebbe credibilità anche alla prima. */
export const MISURE_PERMESSO = [
  { chiave: "sezionamento", nome: "Macchina sezionata, bloccata e cartellinata, chiavi in custodia",
    fonte: "D.Lgs 81/08 art. 71 c.4 e allegato VI — nessun intervento con la macchina in moto" },
  { chiave: "svuotamento", nome: "Tramoggia o silo svuotato, alimentazione e scarico intercettati",
    fonte: "prassi di impianto — in tramoggia il materiale che può scendere è il primo rischio" },
  { chiave: "bonifica", nome: "Ambiente bonificato, lavato e aperto prima dell'accesso",
    fonte: "prassi per gli ambienti sospetti di inquinamento" },
  { chiave: "ventilazione", nome: "Ventilazione forzata attiva per tutta la durata del lavoro",
    fonte: "prassi — si applica in caso di carenza di ossigeno o di accumulo di gas" },
  { chiave: "atmosfera", nome: "Atmosfera misurata prima dell'accesso e tenuta sotto controllo durante",
    fonte: "D.P.R. 177/2011 art. 3 c.3 — la procedura di lavoro" },
  { chiave: "sorvegliante-fuori", nome: "Sorvegliante all'esterno per tutta la durata, in contatto continuo",
    fonte: "D.P.R. 177/2011 art. 3 c.3 — la procedura comprende la fase di soccorso" },
  { chiave: "recupero", nome: "Attrezzatura di recupero pronta all'accesso (treppiede, argano, imbracatura)",
    fonte: "D.P.R. 177/2011 art. 2 c.1 lett. g) — DPI, strumentazione e attrezzature idonee" },
  { chiave: "emergenza", nome: "Procedura di emergenza scritta e coordinata con 118 e Vigili del fuoco",
    fonte: "D.P.R. 177/2011 art. 3 c.3 — coordinamento col sistema di emergenza del SSN e dei VVF" },
  { chiave: "infiammabili", nome: "Materiale infiammabile rimosso o protetto attorno al punto di lavoro",
    fonte: "prassi dei permessi per lavoro a caldo" },
  { chiave: "estintore", nome: "Estintore a portata di mano e addetto antincendio presente",
    fonte: "D.M. 2 settembre 2021 — gestione della sicurezza antincendio nei luoghi di lavoro" },
  { chiave: "vigilanza-dopo", nome: "Sorveglianza antincendio mantenuta dopo la fine del lavoro",
    fonte: "prassi dei permessi per lavoro a caldo — molti principi d'incendio partono a lavoro finito" },
  { chiave: "ancoraggi", nome: "Punti di ancoraggio verificati e sistema anticaduta indossato",
    fonte: "D.Lgs 81/08 art. 115 — sistemi di protezione contro le cadute dall'alto" },
  { chiave: "area-sotto", nome: "Area sottostante delimitata contro la caduta di oggetti",
    fonte: "D.Lgs 81/08 titolo IV capo II — lavori in quota" },
  { chiave: "delimitazione", nome: "Area di lavoro delimitata e segnalata",
    fonte: "D.Lgs 81/08 titolo V — segnaletica di salute e sicurezza" },
  { chiave: "dpi", nome: "DPI previsti per questo lavoro consegnati e indossati",
    fonte: "D.Lgs 81/08 art. 77" },
  { chiave: "avviso-turno", nome: "Il turno in corso sa che si lavora lì, e fino a quando",
    fonte: "prassi dei sistemi di permesso di lavoro — il permesso si espone sul posto" },
];
export function misuraPermesso(chiave) {
  return MISURE_PERMESSO.find((m) => m.chiave === chiave) || null;
}
/* Misura «sicura» anche per una chiave sconosciuta (dati vecchi): meglio una
   riga con la chiave grezza che una schermata rotta — come `requisitoSicuro`. */
export function misuraPermessoSicura(chiave) {
  return misuraPermesso(chiave) || { chiave, nome: String(chiave || "misura"), fonte: "" };
}

/* I CINQUE TIPI. `misure` sono quelle che il tipo PRETENDE (non dichiararle è
   un problema, non una dimenticanza); `requisiti` sono le chiavi di
   REQUISITI_FORMAZIONE che chi riceve il permesso deve avere in corso di
   validità; `atmosfera` e `sorvegliante` dicono se il tipo ha bisogno della
   misura dell'aria e di qualcuno che resti fuori. */
export const TIPI_PERMESSO = [
  { chiave: "confinato", nome: "Spazio confinato — tramogge, sili, serbatoi, vasche", breve: "Spazio confinato",
    riferimento: "D.P.R. 177/2011 — art. 3 c.3: procedura di lavoro comprensiva della fase di soccorso e del "
      + "coordinamento con 118 e Vigili del fuoco; art. 3 c.2: rappresentante del datore di lavoro committente "
      + "presente per tutta la durata; art. 2 c.1: qualificazione dell'impresa e addestramento del personale.",
    atmosfera: true, sorvegliante: true,
    requisiti: ["form-confinati", "form-generale", "sorv-sanitaria"],
    misure: ["sezionamento", "svuotamento", "bonifica", "ventilazione", "atmosfera",
      "sorvegliante-fuori", "recupero", "emergenza", "dpi"] },
  { chiave: "caldo", nome: "Lavoro a caldo — saldatura, taglio, molatura", breve: "Lavoro a caldo",
    riferimento: "D.M. 2 settembre 2021 e D.Lgs 81/08 titolo I capo III sez. VI — gestione del rischio incendio "
      + "nei luoghi di lavoro: il lavoro che produce fiamme, scintille o calore va autorizzato e sorvegliato.",
    atmosfera: false, sorvegliante: false,
    requisiti: ["antincendio", "form-generale"],
    misure: ["infiammabili", "estintore", "vigilanza-dopo", "delimitazione", "dpi"] },
  { chiave: "quota", nome: "Lavoro in quota — nastri, sili, coperture", breve: "Lavoro in quota",
    riferimento: "D.Lgs 81/08 titolo IV capo II — lavori in quota; art. 115 sui sistemi di protezione contro "
      + "le cadute dall'alto.",
    atmosfera: false, sorvegliante: false,
    requisiti: ["form-generale", "sorv-sanitaria"],
    misure: ["ancoraggi", "area-sotto", "delimitazione", "dpi"] },
  { chiave: "energia", nome: "Esclusione delle energie — manutenzione su macchina", breve: "Esclusione energie",
    riferimento: "D.Lgs 81/08 art. 71 c.4 e allegato VI — messa fuori servizio, blocco e segnalazione prima "
      + "di ogni intervento di manutenzione, riparazione o pulizia.",
    atmosfera: false, sorvegliante: false,
    requisiti: ["form-generale"],
    misure: ["sezionamento", "delimitazione", "avviso-turno", "dpi"] },
  { chiave: "generico", nome: "Altro lavoro pericoloso — permesso generico", breve: "Generico",
    riferimento: "Prassi dei sistemi di permesso di lavoro: copre il lavoro che non rientra negli altri tipi e "
      + "che va comunque autorizzato per iscritto, con un periodo di validità e una chiusura.",
    atmosfera: false, sorvegliante: false,
    requisiti: ["form-generale"],
    misure: ["delimitazione", "dpi", "avviso-turno"] },
];
export function tipoPermesso(chiave) {
  return TIPI_PERMESSO.find((t) => t.chiave === chiave) || null;
}
export function tipoPermessoSicuro(chiave) {
  return tipoPermesso(chiave) || { chiave: chiave || "", nome: String(chiave || "permesso"),
    breve: String(chiave || "permesso"), riferimento: "", atmosfera: false, sorvegliante: false,
    requisiti: [], misure: [] };
}

/* I VALORI DI RIFERIMENTO DELL'ARIA, e sono dichiarati per quello che sono.
   Il D.P.R. 177/2011 non scrive nessuna soglia: questi sono i valori operativi
   che la manualistica riprende dai limiti di esposizione (ACGIH) e dalla
   prassi internazionale, e vanno confermati nella procedura di lavoro della
   cava. Scriverli come «limiti di legge» sarebbe la stessa cosa che dichiarare
   il DURC un obbligo dell'art. 26. */
export const LIMITI_ATMOSFERA = [
  { chiave: "ossigeno", nome: "Ossigeno", unita: "%", min: 19.5, max: 23.5 },
  { chiave: "lel", nome: "Infiammabili", unita: "% LEL", min: null, max: 10 },
  { chiave: "h2s", nome: "Acido solfidrico", unita: "ppm", min: null, max: 10 },
  { chiave: "co", nome: "Ossido di carbonio", unita: "ppm", min: null, max: 25 },
];
export const FONTE_ATMOSFERA = "Valori operativi di riferimento — ossigeno fra 19,5 e 23,5%, infiammabili "
  + "sotto il 10% del limite inferiore di esplodibilità, acido solfidrico entro 10 ppm, ossido di carbonio "
  + "entro 25 ppm. Non sono una soglia scritta nel D.P.R. 177/2011: vanno confermati nella procedura di "
  + "lavoro della cava insieme all'RSPP.";

/* ⛔ L'ARIA NON MISURATA NON È ARIA BUONA. Quattro strumenti, quattro numeri, e
   il caso che morde non è quello fuori scala: è il campo VUOTO. `+""` fa zero,
   e zero sul LEL vuol dire «ampiamente sotto il 10%», cioè la risposta più
   tranquillizzante che questa funzione sappia dare, data su una misura che
   nessuno ha fatto. Perciò gli esiti sono quattro e non due, e `incompleta`
   esiste apposta: tre gas nei limiti e uno mai misurato non è «entro i
   limiti». */
export function letturaAtmosfera(misure) {
  const m = misure || {};
  const righe = [], fuori = [], mancanti = [];
  for (const L of LIMITI_ATMOSFERA) {
    const v = misuraLetta(m[L.chiave]);
    if (v === null) {
      mancanti.push(L.nome);
      righe.push({ ...L, valore: null, leggibile: false, entro: null });
      continue;
    }
    const entro = (L.min === null || v >= L.min) && (L.max === null || v <= L.max);
    righe.push({ ...L, valore: v, leggibile: true, entro });
    if (!entro) fuori.push(L.nome);
  }
  const quando = String(m.ora || "").trim();
  if (mancanti.length === LIMITI_ATMOSFERA.length)
    return { leggibile: false, esito: "non-misurata", righe, fuori, mancanti, quando,
      perche: "L'atmosfera non è stata misurata. Un'aria non misurata non è un'aria buona: è un'aria di cui non si sa niente." };
  if (fuori.length)
    return { leggibile: true, esito: "fuori-limite", righe, fuori, mancanti, quando,
      perche: "Fuori dai valori di riferimento: " + fuori.join(", ") + ". Non si entra." };
  if (mancanti.length)
    return { leggibile: false, esito: "incompleta", righe, fuori, mancanti, quando,
      perche: "Non è stato misurato: " + mancanti.join(", ") + ". Quello che è stato misurato sta nei valori di "
        + "riferimento, ma un gas che nessuno ha cercato non è un gas assente." };
  return { leggibile: true, esito: "entro-i-limiti", righe, fuori, mancanti, quando,
    perche: "Tutte e quattro le misure stanno nei valori di riferimento"
      + (quando ? ", lettura delle " + quando : "") + "." };
}
/* Chi consuma la bandiera `leggibile`: sta nel modulo e non nella pagina
   perché la frase che distingue «non a posto» da «non lo sappiamo» va decisa
   in un posto solo (regola 7, e regola 20 per la bandiera). */
export function descriviAtmosfera(l) {
  if (!l) return "";
  return (l.leggibile ? "" : "Non lo sappiamo — ") + l.perche;
}

/* Le misure che il tipo pretende e che nessuno ha dichiarato in atto. */
export function misureMancanti(permesso) {
  const t = tipoPermessoSicuro(permesso && permesso.tipo);
  const messe = new Set(Array.isArray(permesso && permesso.misure) ? permesso.misure : []);
  return (t.misure || []).filter((k) => !messe.has(k)).map((k) => misuraPermessoSicura(k));
}

/* LA FINESTRA DI VALIDITÀ, che è ciò che distingue un permesso da un modulo.
   ⛔ «Senza finestra» non è «sempre valido»: è un permesso che non autorizza
   un turno, e quindi non autorizza niente. `noto: false` lo dichiara. */
export function finestraPermesso(permesso, ora = new Date()) {
  const p = permesso || {};
  const dal = istantePermesso(p.dal), al = istantePermesso(p.al);
  if (!dal && !al)
    return { noto: false, stato: "senza-finestra", ore: null,
      perche: "Il permesso non dice da quando a quando vale. Un permesso senza finestra non autorizza un "
        + "turno: vale per sempre, che è il contrario di un permesso." };
  if (!dal || !al)
    return { noto: false, stato: "senza-finestra", ore: null,
      perche: "Il permesso ha " + (dal ? "l'inizio ma non la fine" : "la fine ma non l'inizio")
        + ": la finestra di validità non si può leggere." };
  if (al <= dal)
    return { noto: false, stato: "finestra-storta", ore: null,
      perche: "La fine non viene dopo l'inizio: la finestra di validità non si può leggere." };
  const ore = Math.round((al - dal) / 36e5 * 10) / 10;
  const t = ora.getTime();
  if (t < dal.getTime())
    return { noto: true, stato: "non-ancora", ore, perche: "Il lavoro è autorizzato ma non è ancora cominciato." };
  if (t > al.getTime())
    return { noto: true, stato: "finita", ore, perche: "La finestra di validità è finita." };
  return { noto: true, stato: "in-corso", ore, perche: "Il permesso è dentro la sua finestra di validità." };
}

/* CHI RICEVE IL PERMESSO È FORMATO PER QUEL LAVORO? La domanda passa da
   `statoRequisito`, la stessa della matrice «chi posso mandare domani
   mattina»: nessuna seconda regola sulla formazione, e se domani cambia il
   modo di riconoscere un corso cambia in un posto solo. */
export function formazionePermesso(permesso, lavoratori, scadenze, oggi = new Date()) {
  const p = permesso || {};
  const t = tipoPermessoSicuro(p.tipo);
  const lav = (lavoratori || []).find((l) => l && l.id === p.riceventeId) || null;
  /* Un'impresa esterna non ha le sue persone nella nostra anagrafe, e fingere
     di controllarne i corsi sarebbe peggio che dire che non li controlliamo:
     quello che si verifica lì è la qualifica dell'impresa (art. 26) e il
     documento di coordinamento, e lo fa `impresaPermesso`. */
  if (!lav && p.appaltoId)
    return { noto: true, esito: "impresa-esterna", lavoratore: null, mancanti: [], scaduti: [], righe: [],
      perche: "Il lavoro lo esegue un'impresa esterna: la formazione dei suoi addetti la garantisce l'impresa, "
        + "e quello che si verifica qui è la sua qualifica e il documento di coordinamento." };
  if (!lav)
    return { noto: false, esito: "senza-nome", lavoratore: null, mancanti: [], scaduti: [], righe: [],
      perche: "Il permesso non dice a chi è rilasciato — né una persona né un'impresa — quindi non si è "
        + "potuto controllare che chi entra sia formato per questo lavoro." };
  const sue = (scadenze || []).filter((s) => s && s.lavoratoreId === lav.id);
  const righe = [], mancanti = [], scaduti = [];
  for (const ch of t.requisiti || []) {
    const req = requisitoSicuro(ch);
    const st = statoRequisito(req, sue, oggi);
    righe.push({ chiave: ch, breve: req.breve, ...st });
    if (st.stato === "scaduta") scaduti.push(req.breve);
    else if (st.stato === "mancante") mancanti.push(req.breve);
    else if (st.stato === "senza data") mancanti.push(req.breve + " (riga senza data)");
  }
  if (scaduti.length)
    return { noto: true, esito: "scaduto", lavoratore: lav, mancanti, scaduti, righe,
      perche: lav.nome + " ha " + (scaduti.length === 1 ? "un requisito scaduto" : scaduti.length + " requisiti scaduti")
        + ": " + scaduti.join(", ") + "." };
  if (mancanti.length)
    return { noto: true, esito: "mancante", lavoratore: lav, mancanti, scaduti, righe,
      perche: "Di " + lav.nome + " non risulta in scadenzario: " + mancanti.join(", ") + "." };
  return { noto: true, esito: "in-regola", lavoratore: lav, mancanti, scaduti, righe,
    perche: lav.nome + " ha in corso di validità i requisiti che questo permesso richiede." };
}

/* L'IMPRESA ESTERNA CHE ESEGUE IL LAVORO — riusa `statoAppalto` per intero.
   Ritorna `null` quando il lavoro è interno: non è un'assenza da dichiarare,
   è una domanda che non si pone. */
export function impresaPermesso(permesso, ctx = {}, oggi = new Date()) {
  const p = permesso || {};
  if (!p.appaltoId) return null;
  const appalto = (ctx.appalti || []).find((a) => a && a.id === p.appaltoId) || null;
  if (!appalto)
    return { noto: false, esito: "non-verificato", appalto: null, appaltatore: null, statoAppalto: null,
      perche: "Il permesso rimanda a un appalto che nel registro non c'è più: non si sa quale impresa lo esegue." };
  const cantiere = (ctx.cantieri || []).find((c) => c && c.id === appalto.cantiereId) || null;
  const appaltatore = (ctx.appaltatori || []).find((a) => a && a.id === appalto.appaltatoreId) || null;
  const st = statoAppalto(appalto, cantiere, appaltatore, ctx.documenti || [], oggi);
  /* ⛔ PROBLEMI E IGNOTI RESTANO SEPARATI ANCHE QUI. `statoAppalto` può dire
     tutt'e due le cose insieme (un camerale scaduto E un DUVRI indecidibile):
     schiacciarle in un `perche` solo, come faceva la prima versione, produceva
     «Non lo sappiamo — Scaduti: Certificato CCIAA» — cioè un fatto NOTO
     annunciato come incerto. Le due liste viaggiano intere e chi le legge
     decide dove metterle. */
  return { noto: st.noto, esito: st.esito, appalto, appaltatore, statoAppalto: st,
    problemi: st.problemi, ignoti: st.ignoti,
    perche: st.esito === "a-posto"
      ? "L'impresa che esegue il lavoro è qualificata e il documento di coordinamento è in vigore."
      : (st.problemi.concat(st.ignoti)[0] || "") };
}

/* ⛔ IL CATALOGO DEGLI ESITI STA QUI, NON NELLA PAGINA — regola 18 tolta alla
   radice invece che sorvegliata. Una mappa dei badge scritta nella pagina si
   stacca il giorno in cui questa funzione impara una risposta in più, e la
   pagina muore AL DISEGNO senza nessun errore di sintassi da leggere. Qui la
   mappa È il vocabolario della funzione: la pagina legge `esitoPermesso`, e
   una prova in `run-kpi` pretende che ogni esito raggiungibile stia
   nell'elenco E che ogni voce dell'elenco sia raggiungibile. */
export const ESITI_PERMESSO = [
  { chiave: "bozza",            etichetta: "Bozza",               cls: "tag",    striscia: "st-accent" },
  { chiave: "non-rilasciabile", etichetta: "Non rilasciabile",    cls: "danger", striscia: "st-danger" },
  { chiave: "da-completare",    etichetta: "Non lo sappiamo",     cls: "warn",   striscia: "st-warn" },
  { chiave: "non-ancora",       etichetta: "Non ancora aperto",   cls: "tag",    striscia: "st-accent" },
  { chiave: "valido",           etichetta: "Valido ora",          cls: "ok",     striscia: "st-ok" },
  { chiave: "da-fermare",       etichetta: "Da fermare",          cls: "danger", striscia: "st-danger" },
  { chiave: "da-verificare",    etichetta: "Non lo sappiamo",     cls: "warn",   striscia: "st-warn" },
  { chiave: "scaduto",          etichetta: "Scaduto e non chiuso", cls: "danger", striscia: "st-danger" },
  { chiave: "sospeso",          etichetta: "Sospeso",             cls: "warn",   striscia: "st-warn" },
  { chiave: "chiuso",           etichetta: "Chiuso",              cls: "tag",    striscia: "st-mute" },
  { chiave: "revocato",         etichetta: "Revocato",            cls: "danger", striscia: "st-mute" },
];
export function esitoPermesso(chiave) {
  return ESITI_PERMESSO.find((e) => e.chiave === chiave) || null;
}
export function esitoPermessoSicuro(chiave) {
  return esitoPermesso(chiave) || { chiave: String(chiave || ""), etichetta: String(chiave || "—"),
    cls: "tag", striscia: "st-accent" };
}

/* IL VERDETTO. Tre secchi come in `statoAppalto`, e per la stessa ragione:
   ciò che dichiara `noto: false` finisce fra gli IGNOTI, non fra i problemi.
   Sommarlo ai problemi farebbe passare per «fuori regola» un permesso che
   nessuno ha ancora finito di compilare; ignorarlo lo farebbe passare per «a
   posto», che è la direzione pericolosa. */
export function statoPermesso(permesso, ctx = {}, oggi = new Date()) {
  const p = permesso || {};
  const t = tipoPermessoSicuro(p.tipo);
  const finestra = finestraPermesso(p, oggi);
  const atmosfera = t.atmosfera ? letturaAtmosfera(p.atmosfera) : null;
  const formazione = formazionePermesso(p, ctx.lavoratori, ctx.scadenze, oggi);
  const impresa = impresaPermesso(p, ctx, oggi);
  const mancanti = misureMancanti(p);
  const base = { permessoId: p.id || null, tipo: t, finestra, atmosfera, formazione, impresa,
    misureMancanti: mancanti };

  const stato = String(p.stato || "bozza");
  if (stato === "chiuso")
    return { ...base, stato, noto: true, problemi: [], ignoti: [], esito: "chiuso",
      /* `dataIt(x, "")` e non `dataIt(x)`: col trattino di ripiego il ternario
         era morto e la frase usciva «Permesso chiuso il —». */
      perche: "Permesso chiuso" + (dataIt(p.chiusuraOra, "") ? " il " + dataIt(p.chiusuraOra, "") : "")
        + ": il lavoro è finito e l'autorizzazione è stata restituita." };
  if (stato === "revocato")
    return { ...base, stato, noto: true, problemi: [], ignoti: [], esito: "revocato",
      perche: "Permesso revocato: il lavoro non è autorizzato." };

  const problemi = [], ignoti = [];
  if (!finestra.noto) ignoti.push(finestra.perche);
  if (!String(p.rilasciatoDaId || "").trim())
    problemi.push("Non è scritto chi rilascia il permesso: un'autorizzazione che nessuno firma non autorizza nessuno.");
  if (mancanti.length)
    problemi.push("Non " + (mancanti.length === 1 ? "è dichiarata in atto una misura"
      : "sono dichiarate in atto " + mancanti.length + " misure")
      + " che questo tipo di permesso richiede: " + mancanti.map((m) => m.nome.toLowerCase()).join("; ") + ".");
  if (t.sorvegliante && !String(p.sorveglianteId || "").trim())
    problemi.push("Non è indicato chi resta all'esterno a sorvegliare per tutta la durata del lavoro.");
  if (atmosfera) {
    /* ⚠️ Qui va `perche` e NON `descriviAtmosfera`: quella premette già «Non lo
       sappiamo — », e `descriviPermesso` lo premette a sua volta. La prima
       versione scriveva «Non lo sappiamo — Non lo sappiamo — l'atmosfera non è
       stata misurata», e si vede solo leggendo l'uscita. La bandiera
       `leggibile` la legge la riga qui sotto, che è quel che la regola 20
       chiede: consumata, non solo dichiarata. */
    if (atmosfera.esito === "fuori-limite") problemi.push(atmosfera.perche);
    else if (!atmosfera.leggibile) ignoti.push(atmosfera.perche);
  }
  if (!formazione.noto) ignoti.push(formazione.perche);
  else if (formazione.esito !== "in-regola" && formazione.esito !== "impresa-esterna") problemi.push(formazione.perche);
  if (impresa) {
    if (!impresa.statoAppalto) ignoti.push(impresa.perche);   // l'appalto non c'è più
    else {
      if (impresa.problemi.length) problemi.push("Impresa esterna: " + impresa.problemi[0]);
      if (impresa.ignoti.length) ignoti.push("Impresa esterna: " + impresa.ignoti[0]);
    }
  }

  if (stato === "sospeso")
    return { ...base, stato, noto: ignoti.length === 0, problemi, ignoti, esito: "sospeso",
      perche: "Permesso sospeso: il lavoro è fermo e non riprende senza una nuova verifica delle condizioni." };

  if (stato !== "aperto")
    return { ...base, stato: "bozza", noto: ignoti.length === 0, problemi, ignoti,
      esito: problemi.length ? "non-rilasciabile" : (ignoti.length ? "da-completare" : "bozza"),
      perche: problemi.length
        ? "Non si può rilasciare così. " + problemi[0]
        : (ignoti.length ? ignoti[0] : "Bozza completa: manca solo il rilascio.") };

  /* ⛔ LA FINESTRA FINITA SU UN PERMESSO ANCORA APERTO SI DICE PRIMA DI TUTTO
     IL RESTO, ed è il caso che un ispettore cerca: o il lavoro è finito e
     nessuno ha chiuso il permesso (e allora il registro racconta una cava in
     cui c'è sempre qualcuno dentro una tramoggia), o si sta lavorando fuori
     dall'autorizzazione. Non è un dettaglio da mettere in coda ai problemi. */
  if (finestra.stato === "finita")
    return { ...base, stato, noto: true, problemi, ignoti, esito: "scaduto",
      perche: "La finestra di validità è finita e il permesso risulta ancora aperto: o il lavoro è finito e "
        + "nessuno l'ha chiuso, o si sta lavorando fuori dall'autorizzazione." };
  if (problemi.length)
    return { ...base, stato, noto: ignoti.length === 0, problemi, ignoti, esito: "da-fermare", perche: problemi[0] };
  if (ignoti.length)
    return { ...base, stato, noto: false, problemi, ignoti, esito: "da-verificare", perche: ignoti[0] };
  if (finestra.stato === "non-ancora")
    return { ...base, stato, noto: true, problemi, ignoti, esito: "non-ancora", perche: finestra.perche };
  return { ...base, stato, noto: true, problemi, ignoti, esito: "valido",
    perche: "Rilasciato, dentro la sua finestra di validità, con tutte le misure dichiarate in atto." };
}
/* ⚠️ «NON LO SAPPIAMO» SI PREMETTE SOLO SE NON C'È UN FATTO ACCERTATO DA DIRE.
   Un permesso può avere insieme un fatto misurato («il camerale dell'impresa è
   scaduto») e un buco («nessuno ha guardato i rischi particolari»): la prima
   versione premetteva «Non lo sappiamo» anche al fatto misurato, cioè
   annunciava come incerto qualcosa che era stato guardato.
   ⛔ E RESTA UNA FRASE SOLA di proposito. Questa esce nella riga di dettaglio
   dell'elenco, che ha `-webkit-line-clamp:2`: una seconda frase appesa in
   fondo non la legge nessuno. Gli altri problemi e gli altri buchi si vedono
   nel pannello del permesso, che ha lo spazio per elencarli. */
export function descriviPermesso(st) {
  if (!st) return "";
  if ((st.problemi || []).length) return st.perche;
  return (st.noto ? "" : "Non lo sappiamo — ") + st.perche;
}

/* ⛔ IL PONTE CON LA CHECKLIST — È DA QUI CHE È NATO TUTTO.
   Il riconoscimento è per TESTO, come `scadenzaCopreRequisito` fa con i corsi,
   e non con una bandierina nel modello: le voci vengono COPIATE dentro
   l'ispezione quando la si avvia (`nuovaIspezioneDaModello`), quindi una
   bandierina aggiunta al modello oggi non comparirebbe nelle ispezioni già
   compilate — cioè proprio quelle su cui la domanda si pone. */
export function voceChiedePermesso(testo) {
  const t = normalizzaTesto(testo);
  if (!t || !t.includes("permesso di lavoro")) return null;
  if (/confinat|tramogg|silo|serbatoi|vasc/.test(t)) return "confinato";
  if (/caldo|saldatur|fiamma|molatur/.test(t)) return "caldo";
  if (/quota|anticadut/.test(t)) return "quota";
  return "generico";
}

/* I permessi che coprono un GIORNO: la finestra contiene quel giorno e il sito
   è lo stesso — o uno dei due non lo dichiara, e allora non è un motivo per
   scartarlo. Il confronto è fra stringhe di dieci caratteri, non fra istanti:
   qui la domanda è «quel giorno», non «a quell'ora». */
export function permessiDelGiorno(permessi, { tipo, cantiereId, giorno } = {}) {
  const g = String(giorno || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g)) return [];
  return (permessi || []).filter((p) => {
    if (!p) return false;
    if (tipo && p.tipo !== tipo) return false;
    if (cantiereId && p.cantiereId && p.cantiereId !== cantiereId) return false;
    const dal = String(p.dal || "").slice(0, 10), al = String(p.al || "").slice(0, 10);
    if (!dal || !al) return false;
    return dal <= g && g <= al;
  });
}

/* LA PROVA DIETRO UNA VOCE DI CHECKLIST.
   ⛔ «Conforme» su una voce che chiede un permesso, senza nessun permesso nel
   registro, NON è conforme: è «non lo sappiamo». La voce può essere stata
   guardata davvero — magari il permesso è su un foglio nel cassetto — ma qui
   non c'è niente che lo dimostri, e questa schermata è quella che si mostra a
   un ispettore. */
export function provaVoce(ispezione, voce, permessi, ctx = {}, oggi = new Date()) {
  const isp = ispezione || {}, v = voce || {};
  const chiede = voceChiedePermesso(v.testo);
  const risposta = ((isp.esiti || {})[v.id] || {}).esito || "";
  if (!chiede)
    return { chiede: null, noto: true, esito: "non-richiesta", risposta, permessi: [], stati: [], perche: "" };
  const trovati = permessiDelGiorno(permessi, { tipo: chiede, cantiereId: isp.cantiereId, giorno: isp.data });
  const stati = trovati.map((p) => ({ permesso: p, ...statoPermesso(p, ctx, oggi) }));
  const rotti = stati.filter((s) => s.esito === "da-fermare" || s.esito === "scaduto" || s.esito === "non-rilasciabile");
  const tipoNome = tipoPermessoSicuro(chiede).breve.toLowerCase();

  if (!trovati.length)
    return { chiede, noto: false, esito: "senza-prova", risposta, permessi: [], stati: [],
      perche: "Per il giorno dell'ispezione non risulta registrato nessun permesso di lavoro «" + tipoNome
        + "» su questo sito. La voce può essere stata guardata davvero, ma qui non c'è niente che lo dimostri: "
        + "non è «conforme», è «non lo sappiamo»." };
  if (rotti.length)
    return { chiede, noto: true, esito: "prova-da-sistemare", risposta, permessi: trovati, stati,
      perche: (rotti.length === 1 ? "Il permesso registrato quel giorno ha un problema"
        : rotti.length + " dei permessi registrati quel giorno hanno un problema") + ": " + rotti[0].perche };
  return { chiede, noto: true, esito: "con-prova", risposta, permessi: trovati, stati,
    perche: trovati.length === 1
      ? "Dietro questa spunta c'è un permesso di lavoro registrato, valido quel giorno."
      : "Dietro questa spunta ci sono " + trovati.length + " permessi di lavoro registrati, validi quel giorno." };
}
export function descriviProva(pr) {
  if (!pr || !pr.chiede) return "";
  return (pr.noto ? "" : "Non lo sappiamo — ") + pr.perche;
}

/* Le voci date per CONFORMI che dietro non hanno niente. È il numero da cui è
   partito tutto, e va nelle urgenze del Quadro: una checklist verde su un
   adempimento mai registrato è esattamente il «numero tranquillo dove non è
   stato misurato niente» del principio del fondatore. */
export function conformiSenzaProva(ispezioni, permessi, ctx = {}, oggi = new Date()) {
  const fuori = [];
  for (const isp of ispezioni || []) {
    for (const v of (isp && isp.voci) || []) {
      const pr = provaVoce(isp, v, permessi, ctx, oggi);
      if (!pr.chiede || pr.risposta !== "conforme" || pr.esito === "con-prova") continue;
      fuori.push({ ispezioneId: isp.id || null, ispezione: isp.nome || "", data: isp.data || "",
        voceId: v.id, testo: v.testo, esito: pr.esito, noto: pr.noto, perche: pr.perche });
    }
  }
  return fuori;
}

/* Il riepilogo in cima alla pagina.
   ⛔ REGISTRO VUOTO NON VUOL DIRE «IN CAVA NON SI ENTRA IN UNA TRAMOGGIA» — è
   la stessa distinzione di `riepilogoAppalti`, e qui pesa di più perché è
   proprio l'assenza di righe che rende senza prova le voci di checklist. */
export function riepilogoPermessi(permessi, ctx = {}, oggi = new Date()) {
  const list = (permessi || []).filter(Boolean);
  const righe = list.map((p) => ({ permesso: p, ...statoPermesso(p, ctx, oggi) }));
  const quanti = (...e) => righe.filter((r) => e.includes(r.esito)).length;
  const daFermare = quanti("da-fermare", "non-rilasciabile");
  const scaduti = quanti("scaduto");
  const daVerificare = quanti("da-verificare", "da-completare");
  if (!list.length)
    return { quanti: 0, aperti: 0, validi: 0, daFermare: 0, scaduti: 0, daVerificare: 0, righe: [], noto: false,
      testo: "Nessun permesso di lavoro registrato. Non vuol dire che in cava non entri nessuno in una "
        + "tramoggia: vuol dire che qui non ne risulta nessuno, e finché è così le voci di checklist che "
        + "chiedono un permesso non hanno niente dietro." };
  return { quanti: list.length, aperti: righe.filter((r) => r.stato === "aperto").length,
    validi: quanti("valido"), daFermare, scaduti, daVerificare, righe, noto: daVerificare === 0,
    testo: (daFermare || scaduti || daVerificare)
      ? [daFermare ? daFermare + " da fermare" : "",
         scaduti ? scaduti + (scaduti === 1 ? " scaduto e non chiuso" : " scaduti e non chiusi") : "",
         daVerificare ? daVerificare + (daVerificare === 1 ? " su cui manca una verifica" : " su cui mancano verifiche") : ""]
        .filter(Boolean).join(" · ") + ", su " + list.length + " registrat" + (list.length === 1 ? "o" : "i") + "."
      /* ⛔ «Tutti i 1 permessi registrati sono in ordine»: il ramo tranquillo
         era l'unico senza singolare — le tre voci del ramo storto ce l'hanno
         una per una, dodici righe più su. Ed è la frase che si legge in cima
         alla schermata quando va tutto bene, cioè quella che si legge di più. */
      : (list.length === 1
          ? "L'unico permesso registrato è in ordine."
          : "Tutti i " + list.length + " permessi registrati sono in ordine.") };
}

/* I permessi che riguardano un sito, dal più recente: serve alla pagina e al
   pannello che si apre dalla voce di checklist. */
export function permessiDiCantiere(permessi, cantiereId) {
  if (!cantiereId) return [];
  return (permessi || []).filter((p) => p && p.cantiereId === cantiereId);
}

/* ⛔ IL REGISTRO DELLE AZIONI CORRETTIVE CHE SI RI-CARICA — decisione 12a,
   sesta e ultima voce.
   ⚠️ `scudo_azioni_correttive.csv` esiste già ed è un **prospetto**: porta lo
   stato calcolato (`statoAzione`, che dice se è scaduta) e la frase
   dell'origine composta da `origineAzione` — cose che servono a chi legge, e
   che rientrando sarebbero ricalcolate sbagliate. Questa è la copia: i campi
   crudi, id compresi.
   ⚠️ E l'origine sono SEI campi, non una frase: `origineTipo`, `origineId`,
   `origineVoce`, `origineNota`, `origineApp`, `origineData`,
   `origineEtichetta`. Perderli vorrebbe dire ri-caricare un registro in cui
   nessuna azione sa più da quale evento è nata — e il collegamento
   evento → azione è proprio quello che un organo di vigilanza cerca. */
export const CSV_AZIONI_INTESTAZIONE =
  "id;descrizione;responsabileId;scadenza;stato;esito;dataChiusura;"
  + "origineTipo;origineId;origineVoce;origineNota;origineApp;origineData;origineEtichetta";

/* IL PROSPETTO DELLE AZIONI CORRETTIVE (05/09): il file che si porta al
   controllo — semaforo, responsabile con la parola, la frase dell'origine.
   Stava nella pagina, composto cella per cella dalle funzioni giuste
   (`statoAzione`, `etichettaResponsabile`, `origineAzione`): la composizione
   però la provava solo il browser. Qui la provano anche le suite `node`, e la
   pagina fa quello che fa per la copia di sicurezza: chiama. Stesso ordine
   dell'elenco a schermo (chiuse in fondo, poi per data, senza data in coda).
   `ctx`: { lavoratori, infortuni, ispezioni }. Pura. */
export const CSV_PROSPETTO_AZIONI_INTESTAZIONE = "descrizione;responsabile;scadenza;semaforo;stato;esito;dataChiusura;origine";
export function csvProspettoAzioni(azioni, ctx = {}, oggi = new Date()) {
  const lav = ctx.lavoratori || [];
  const nome = (id) => etichettaResponsabile({ responsabileId: id }, lav).nome;
  const orig = (a) => origineAzione(a, { infortuni: ctx.infortuni || [], ispezioni: ctx.ispezioni || [] }, { voce: "documento" });
  let csv = CSV_PROSPETTO_AZIONI_INTESTAZIONE + "\n";
  for (const a of (azioni || []).slice().sort((x, y) => (x.stato === "chiusa") - (y.stato === "chiusa")
      || String(x.scadenza || "9999").localeCompare(String(y.scadenza || "9999"))))
    csv += `${csvCell(a.descrizione || "")};${csvCell(nome(a.responsabileId))};${a.scadenza || ""};${statoAzione(a, oggi)};${a.stato || "aperta"};${csvCell(a.esito || "")};${a.dataChiusura || ""};${csvCell(orig(a))}\n`;
  return csv;
}

/* IL RIEPILOGO DEI NEAR-MISS PER LA COMUNICAZIONE (05/09): la stessa storia
   del prospetto qui sopra. Le regole del file — lo storico accanto al periodo,
   la nota di lettura del modulo, il denominatore prima dei gradini, i luoghi
   ciechi con la loro riga — c'erano già, sparse nella pagina; adesso stanno
   in una funzione che `run-kpi` può chiamare. `giorni`: 0 o null = tutto lo
   storico. Pura. */
export function etichettaPeriodoNearMiss(giorni) {
  const g = +giorni;
  if (!(g > 0)) return "tutto lo storico";
  if (g === 365) return "ultimi 12 mesi";
  return "ultimi " + g + " giorni";
}
export function csvRiepilogoNearMiss(infortuni, azioni, giorni, oggi = new Date()) {
  const r = riepilogoNearMiss(infortuni, azioni, giorni || null, oggi);
  let csv = "sezione;voce;numero\n";
  csv += `periodo;${csvCell(etichettaPeriodoNearMiss(giorni))};\n`;
  csv += `totale;near-miss segnalati;${r.totale}\n`;
  csv += `totale;near-miss nello storico (fuori periodo compresi);${r.totaleStorico}\n`;
  csv += `totale;di cui in forma anonima;${r.anonime}\n`;
  { const nota = descriviLetturaNearMiss(r);
    if (nota) csv += `lettura;${csvCell(nota)};\n`; }
  for (const t of r.perTipo) csv += `tipo;${csvCell(t.etichetta)};${t.valore}\n`;
  for (const l of r.perLuogo) csv += `luogo;${csvCell(l.etichetta)};${l.valore}\n`;
  // le righe «potenziale» non escono MAI da sole: prima il denominatore e la frase
  { const rp = riepilogoPotenziale(infortuni, giorni || null, oggi);
    csv += `potenziale;near-miss con la gravità potenziale valutata;${rp.valutati}\n`;
    csv += `potenziale;near-miss NON valutati;${rp.nonValutati}\n`;
    csv += `potenziale;${csvCell(descriviRischioPotenziale(rp))};\n`;
    for (const g of rp.perLivello) csv += `potenziale;se andava male: ${csvCell(g.etichetta.toLowerCase())};${g.quanti}\n`;
    for (const l of rp.perLuogo)
      csv += `potenziale;${csvCell(l.etichetta)} — episodi che potevano finire con un infortunio (su ${conta(l.valutati, "valutato", "valutati")}, ${l.nonValutati} no);${l.alto}\n`;
    for (const l of rp.luoghiCiechi)
      csv += `potenziale;${csvCell(l.etichetta)} — nessun episodio valutato: non si sa come poteva finire;${l.eventi}\n`; }
  csv += `azioni;near-miss con almeno un'azione correttiva;${r.conAzione}\n`;
  csv += `azioni;near-miss ancora senza azione;${r.senzaAzione}\n`;
  csv += `azioni;azioni correttive aperte da near-miss;${r.azioni}\n`;
  csv += `azioni;di cui chiuse;${r.azioniChiuse}\n`;
  return csv;
}

export function csvAzioni(azioni) {
  const righe = [CSV_AZIONI_INTESTAZIONE];
  for (const a of (azioni || []).slice()
    .sort((x, y) => String(x.scadenza || "9999").localeCompare(String(y.scadenza || "9999")))) {
    if (!a) continue;
    righe.push([
      csvCell(a.id || ""), csvCell(a.descrizione || ""), csvCell(a.responsabileId || ""),
      a.scadenza || "", csvCell(a.stato || "aperta"), csvCell(a.esito || ""), a.dataChiusura || "",
      csvCell(a.origineTipo || ""), csvCell(a.origineId || ""), csvCell(a.origineVoce || ""),
      csvCell(a.origineNota || ""), csvCell(a.origineApp || ""), a.origineData || "",
      csvCell(a.origineEtichetta || ""),
    ].join(";"));
  }
  return righe.join("\n") + "\n";
}

export function parseAzioniCsv(text) {
  return (leggiCsv(String(text || "")).righe || [])
    .filter((c) => c.length && !isIntestazione(c.join(";"), "id"))
    .map((c) => {
      const [id, descrizione, responsabileId, scadenza, stato, esito, dataChiusura,
        origineTipo, origineId, origineVoce, origineNota, origineApp, origineData, origineEtichetta] = c;
      const t = (x) => { const v = String(x == null ? "" : x).trim(); return v || null; };
      const out = {
        id: t(id), descrizione: t(descrizione) || "",
        /* ⛔ `null` e non `""`: lo schema dice `responsabileId|null`, e
           «responsabile da assegnare» è uno stato che l'app mostra — una
           stringa vuota lo trasformerebbe in un id che non trova nessuno. */
        responsabileId: t(responsabileId),
        /* una scadenza che non esiste NON diventa «senza data»: senza data è
           uno stato dichiarato, una data impossibile è un dato da riparare */
        scadenza: dataISOEsiste(String(scadenza || "").trim()) ? String(scadenza).trim() : null,
        stato: ["aperta", "in-corso", "chiusa"].includes(String(stato || "").trim()) ? String(stato).trim() : "aperta",
        esito: t(esito) || "",
        dataChiusura: dataISOEsiste(String(dataChiusura || "").trim()) ? String(dataChiusura).trim() : null,
        origineTipo: t(origineTipo) || "",
      };
      /* i campi facoltativi dell'origine si scrivono solo se ci sono: assenti
         vogliono dire «questa azione non viene da lì», e metterli vuoti
         inventerebbe un collegamento rotto */
      for (const [k, v] of [["origineId", origineId], ["origineVoce", origineVoce],
        ["origineNota", origineNota], ["origineApp", origineApp],
        ["origineData", origineData], ["origineEtichetta", origineEtichetta]]) {
        const x = t(v);
        if (x) out[k] = x;
      }
      return out;
    })
    /* un'azione senza descrizione non è un'azione: nel registro sarebbe una
       riga che non dice che cosa bisogna fare */
    .filter((a) => a.descrizione);
}

/* Le righe del registro delle azioni correttive che NON entrano, con la
   ragione — vedi il blocco lungo sopra `scartiLavoratoriCsv`.
   ⚠️ QUESTO LETTORE PERDE LA RIGA IN UN CASO SOLO — la descrizione — ed è la
   forma MITE del difetto, non la sua assenza: 4 righe scritte → 3 entrate,
   misurato il 13/08. Ma quella riga è un'azione correttiva che sparisce da un
   registro che un organo di vigilanza legge, e non c'è niente che lo dica.
   ⛔ QUI IL FILE SI LEGGE CON `leggiCsv` E NON SPEZZANDO SULLE RIGHE, perché è
   così che lo legge `parseAzioniCsv`: la descrizione di un'azione può contenere
   un a capo dentro un campo fra virgolette, e un conto fatto sulle righe
   FISICHE direbbe un numero più alto del vero — cioè accuserebbe l'utente di
   righe perse che non ha mai scritto. È la stessa ragione per cui `leggiCsv`
   esiste (la causale di un bonifico su più righe in Conti).
   ⚠️ E `vuote` RESTA ZERO PER COSTRUZIONE, dichiarato invece che nascosto:
   `leggiCsv` butta già via le righe con tutte le celle vuote (`chiudiRiga`
   spinge solo se `riga.some(…)`), quindi la riga di coda `;;;` di un foglio di
   calcolo non arriva nemmeno qui. Il campo c'è lo stesso per non avere due
   forme di `scarti…Csv` da ricordare. */
export function scartiAzioniCsv(text) {
  const righe = (leggiCsv(String(text || "")).righe || [])
    .filter((c) => c.length && !isIntestazione(c.join(";"), "id"));
  const persi = [];
  let nRiga = 0;
  for (const c of righe) {
    nRiga++;
    if (parseAzioniCsv(c.map((x) => csvCell(x == null ? "" : x)).join(";")).length) continue;
    persi.push({
      nome: (c[0] || "").trim() || "riga " + nRiga,
      ragione: "manca la descrizione dell'azione",
    });
  }
  return { lette: righe.length, entrano: righe.length - persi.length, persi, vuote: 0 };
}
