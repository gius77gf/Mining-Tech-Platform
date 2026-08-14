# Conti — ricerca luglio 2026: il ciclo economico della cava

Documento per Giuseppe. Obiettivo: capire **cosa Conti fa oggi**, **cosa manca**
davvero (per legge, per confronto coi gestionali di settore, per valore) e **cosa
possiamo costruire senza spendere un euro**.

Regola che attraversa tutto il documento: **onestà**. Dove Conti può solo
*preparare* un documento e non *inviarlo*, lo scrivo. Dove servirebbe un servizio a
pagamento, lo scrivo e la proposta si ferma lì.

Aggiorna e sostituisce, per la parte di analisi, `docs/CONTI_FATTURAZIONE_ROADMAP.md`
(che resta valido: qui c'è più dettaglio, la parte tributi di settore e la tabella
delle priorità).

---

## 1. Inventario onesto — cosa c'è già in Conti

Conti oggi è fatto da due soli file: `apps/conti/index.html` (~460 righe) e
`apps/conti/conti-data.js` (~370 righe). Quattro schermate: **Quadro, Fatture,
Gare, Report**.

### Fatture (c'è)
- Elenco con **filtri** (tutte / da incassare / insolute / incassate),
  **ordinamento** per scadenza, importo o cliente (la scelta viene ricordata),
  **ricerca** per cliente o numero, conteggio dei risultati.
- **Nuova fattura** a mano: numero, cliente, importo, scadenza. Controllo che il
  numero non sia già usato.
- **Modifica** di una fattura esistente e **cancellazione** (per correggere errori).
- **Segna incassata / annulla incasso** con un tocco, con data di incasso.
- **Import da CSV** (`numero;cliente;importo;emessa;scadenza[;incassata]`), salta i
  numeri già presenti.

### Recupero crediti (c'è, ed è la parte più curata)
- **Aging degli incassi**: crediti aperti divisi in non scaduto / 1-30 / 31-60 /
  61-90 / oltre 90 giorni, con totale dello scaduto.
- **Interessi di mora di legge** (D.Lgs 231/2002) calcolati per ogni fattura in
  ritardo, tasso 10,15% (1° semestre 2026) + €40 forfettari art. 6.
- **Livello di sollecito** automatico (1° sollecito / 2° sollecito / ultimo avviso).
- **Testo del sollecito pronto** da copiare e incollare in email o PEC.
- **Estratto conto per cliente** pronto da copiare (tutte le fatture aperte, mora,
  spese, totale dovuto).
- **Esposizione per cliente** (chi ci deve di più e quanto è già scaduto).
- **Priorità di incasso** nel Quadro (chi chiamare per primo).

### Gare e appalti (c'è)
- Elenco con filtri per stato, ricerca, aggiunta, esito **vinta/persa**.
- **Riepilogo**: quante aperte/vinte/perse, valore a base d'asta, **tasso di
  vittoria** sulle gare decise.
- **Import e export CSV** delle gare.

### Report (c'è)
- Incassato del mese, incassato totale, da incassare, **incasso atteso a 30 giorni**,
  **età media del credito** aperto, gare aperte.
- **Previsione incassi mese per mese** (6 mesi avanti), con le scadute messe a parte.
- **Export CSV della situazione fatture** per il commercialista.

### Impianto tecnico (c'è)
- App installabile sul telefono (PWA), stile Deepwork, **isolamento multi-tenant**
  vero (i dati passano dallo SDK `deepwork-id-client`, mai percorsi scritti a mano).
- Modalità **dimostrativa/tour** con dati finti quando non si è dentro
  un'organizzazione.

### Quello che NON c'è (e va detto chiaro)
Conti oggi è un **ottimo scadenzario**: sa dirti chi ti deve quanto e da quanto
tempo. **Non è ancora un ciclo di vendita.** Mancano:

| Manca | Conseguenza pratica |
|---|---|
| **Prodotti e listino** | Non esiste il concetto di "stabilizzato", "sabbia", "pietrisco 8/12". |
| **Quantità** | Nessuna tonnellata, nessun m³: la fattura è solo un importo secco. |
| **Pesate / DDT** | Il documento base della vendita in cava non esiste. |
| **IVA** | Nessun imponibile / IVA / totale: un numero solo. Impossibile fare un registro IVA. |
| **Anagrafica clienti** | Il cliente è **testo libero riscritto ogni volta**. "Edilcave Srl" ed "edilcave srl" diventano due clienti diversi: esposizione ed estratto conto si spaccano. È il difetto più insidioso di oggi. |
| **Numerazione automatica** | Il numero fattura si digita a mano: si può saltare o duplicare. |
| **Costi e uscite** | Conti vede solo le entrate: non può dire se guadagni. |
| **Marginalità, costo per tonnellata** | Nessun indicatore economico di produzione. |
| **Incassi parziali / acconti / note di credito** | Una fattura è solo "incassata sì/no". Un acconto non è registrabile. |
| **XML fattura elettronica, PDF** | Nessun documento generabile. |
| **Canoni e tributi di cava** | Nessuna traccia. |

---

## 2. Cosa manca — per legge, per confronto, per valore

### 2.1 Obblighi italiani che riguardano una cava che vende inerti

**Il DDT (documento di trasporto), DPR 472/1996.**
Ha sostituito la vecchia bolla di accompagnamento. Non ha un formato obbligatorio
("forma libera"), ma deve contenere almeno: data di consegna o spedizione,
dati di cedente e cessionario (e dell'eventuale vettore), natura/qualità/quantità
dei beni. Va emesso **prima dell'inizio del trasporto**. Numerazione progressiva
senza salti né duplicati, conservazione 10 anni. Il DDT può benissimo essere
digitale (PDF, XML, altro): la legge non lo vieta, ma per avere pieno valore
"informatico" va firmato digitalmente e conservato a norma.

**La fattura differita — è ESATTAMENTE il flusso della cava.**
Se i movimenti di merce sono documentati da DDT, si può emettere **una sola fattura
riepilogativa entro il 15 del mese successivo** alla consegna. Tradotto: cinquanta
viaggi di camion in un mese → cinquanta DDT → **una fattura** il mese dopo. Oggi
Conti non sa fare niente di tutto questo, e questo è il pezzo di valore più grande
che manca.

**Fattura elettronica e SdI.**
Obbligatoria in formato XML FatturaPA, trasmessa al Sistema di Interscambio.
Attenzione a una novità recente: dal **15 maggio 2026** lo SdI applica la versione
**1.9.1** delle specifiche tecniche, e le fatture col tracciato vecchio **vengono
scartate**. Se un giorno genereremo XML, dobbiamo puntare a 1.9.1.

**IVA.** Gli inerti sono **beni** → **IVA 22% ordinaria**. Il *reverse charge*
edilizia **non** si applica alla semplice fornitura di materiali (riguarda i servizi
e i subappalti): se lo mettiamo, deve essere una spunta opzionale per riga con la
nota "verifica col commercialista", **mai** automatica. Servono i **registri IVA**
(vendite) e la loro conservazione per **10 anni** (art. 2220 codice civile).

**Vendite alla Pubblica Amministrazione** — e qui Conti già ci sta dentro, visto che
gestisce gare con Comuni, Province, ANAS. Serve:
- **Codice Univoco Ufficio** della PA (6 caratteri, si trova sull'indice IPA; per i
  privati invece il codice destinatario è di 7 caratteri);
- **CIG** (10 caratteri, identifica la gara) e **CUP** (15 caratteri, identifica il
  progetto) per la tracciabilità degli appalti (L. 136/2010);
- **split payment**: l'IVA la versa l'ente direttamente allo Stato, e nell'XML il
  campo `EsigibilitaIVA` deve valere **"S"**.
Questo è un pezzo di valore vero: chi vende ai Comuni sbaglia spesso questi campi e
si vede la fattura scartata.

**Conservazione a norma 10 anni.** Richiede firma digitale, marca temporale
periodica e regole AgID. **Non si può fare dentro un browser.** Va fatta fuori (vedi
sezione 4).

### 2.2 Tributi specifici del settore estrattivo (oggi assenti in Conti)

Questa è la parte che i gestionali generici non hanno e che nessuno racconta bene.
Chi coltiva una cava paga, oltre alle tasse normali:

- **Canone di concessione / diritti di escavazione** alla Regione (e spesso ai
  Comuni), calcolati sul **materiale cavato**, tipicamente in **€/m³** o **€/t**.
  Variano moltissimo da regione a regione: si va da pochi centesimi a oltre 2 €/m³.
  In media nazionale valgono intorno al **3,5% del prezzo di vendita**, ma è una
  media con estremi enormi.
- **Ripartizione tra enti**: in Lombardia (L.R. 20/2021) l'operatore versa **84% al
  Comune** sede della cava e ai comuni impattati, **14% alla Provincia/Città
  metropolitana**, **2% alla Regione**. In Veneto è previsto un **+15% alla Regione**
  in aggiunta ai diritti di escavazione.
- **Indennità al proprietario del fondo** per ogni m³ estratto, dove la concessione
  la prevede.
- **Dichiarazione annuale dei quantitativi estratti** alla Regione (in Veneto, per
  esempio, **entro il 28 febbraio** dell'anno successivo: tipo e quantità di
  materiale estratto e utilizzato industrialmente).

**Implicazione per Conti:** non possiamo (e non dobbiamo) codificare le tariffe di
20 regioni: cambiano e ci renderebbero responsabili di errori. La cosa giusta è un
**parametro impostabile dall'organizzazione** (€/m³ o €/t, più eventuale quota
percentuale) e un **registro dei quantitativi** che poi produce da solo il numero da
mettere in dichiarazione e la stima del canone dovuto.

### 2.3 Cosa hanno i gestionali di settore (e noi no)

Dai software italiani per cave/inerti e da quelli americani per aggregates, le
funzioni ricorrenti sono sempre le stesse:

- **Ticket di pesata**: lordo, tara, **netto = lordo − tara**, prodotto, cliente,
  cantiere, vettore, targa. Pesate anche non presidiate.
- **Anagrafiche complete**: clienti, cantieri/commesse, vettori, mezzi e targhe,
  prodotti.
- **Listini e prezzi contrattuali**: prezzo di listino per prodotto + prezzo
  speciale per cliente/cantiere + sconto + possibilità di forzare il prezzo sul
  singolo viaggio.
- **Fido cliente con "credit watch"**: limite di credito e allarme al superamento.
- **Costi di trasporto**: molte cave vendono **franco cava** (trasporto escluso) e a
  parte quotano il trasporto a **fasce di chilometri** (es. 3 €/t entro 10 km,
  4 €/t 11-20 km, 6 €/t 21-30 km) oppure a €/m³ + maggiorazione per km oltre soglia.
- **Statistiche di vendita** per prodotto, cliente, periodo; giacenze di magazzino
  per prodotto; export in PDF/CSV/XLSX.

### 2.4 Indicatori economici che servono davvero a una cava

- **Costo per tonnellata prodotta**: è il numero re. Va scomposto in perforazione,
  abbattimento, ripresa, trasporto interno, frantumazione. La letteratura di settore
  segnala che l'abbattimento pesa solo il 10-20% del costo totale, ma **condiziona
  tutti gli altri**: risparmiare lì e peggiorare la pezzatura fa salire ripresa,
  trasporto e frantumazione. È il motivo per cui il costo/tonnellata va guardato
  **intero**, non per voce.
- **Margine di contribuzione per prodotto** = prezzo di vendita − costo variabile
  unitario. Dice quale prodotto conviene davvero spingere.
- **Break-even (punto di pareggio)** = costi fissi ÷ margine di contribuzione
  unitario. Cioè: **quante tonnellate devo vendere questo mese per non perderci**.
- **Prezzo minimo di vendita** sotto il quale una fornitura fa perdere soldi.
- Dal lato crediti Conti ha già aging, età media del credito ed esposizione: manca il
  **DSO vero** (crediti ÷ fatturato × giorni), che diventa calcolabile solo quando
  avremo il fatturato del periodo.

---

## 3. Tabella delle proposte

Difficoltà: **S** = poche ore, **M** = una giornata o due, **L** = più unità di
lavoro. Priorità: **P1** = fondamenta, senza cui il resto non sta in piedi.

| # | Nome | Cosa fa | Perché serve | Diff. | Prio |
|---|---|---|---|---|---|
| 1 | **Anagrafica clienti** | Scheda cliente: ragione sociale, P.IVA/CF, indirizzo, codice destinatario o PEC, sconto, termini di pagamento, fido | Oggi il cliente è testo libero: nascono duplicati che spaccano esposizione ed estratto conto. È la base di tutto il resto | M | **P1** |
| 2 | **Listino prodotti** | Prodotti con pezzatura, unità (t o m³), prezzo, **densità** per convertire m³↔t, aliquota IVA | Senza prodotti non esistono né DDT né marginalità. La densità serve perché €/t e €/m³ **non** sono interscambiabili | S/M | **P1** |
| 3 | **Registro pesate / DDT** | Riga di pesata: data, cliente, cantiere, prodotto, lordo, tara, **netto**, prezzo, vettore/targa; numerazione progressiva | È il documento base della vendita in cava e l'obbligo del DPR 472/1996 | L | **P1** |
| 4 | **Fattura differita dai DDT** | A fine mese raggruppa i DDT per cliente e propone **una fattura riepilogativa** con l'elenco dei DDT | È il flusso reale (tanti viaggi → una fattura entro il 15 del mese dopo). Il valore più alto dell'intero elenco | L | **P1** |
| 5 | **Fattura con imponibile e IVA** | Righe, imponibile, IVA 22%, totale, riepilogo per aliquota, numerazione automatica | Oggi la fattura è un importo secco: inutilizzabile per il registro IVA e per l'XML | M | **P1** |
| 6 | **Fido e rischio cliente** | Limite di credito per cliente, allarme al superamento, ritardo medio storico | Dati che Conti **già possiede**: si sblocca con poco lavoro | S | P2 |
| 7 | **Incassi parziali e acconti** | Un incasso diventa un movimento con data e importo, non un sì/no | In cava gli acconti e i pagamenti a rate sono normali | M | P2 |
| 8 | **Note di credito** | Documento di storno collegato alla fattura | Errori e resi capitano: senza questo si "cancella" la fattura, che è sbagliato | M | P2 |
| 9 | **Registro costi / uscite** | Costi fissi e variabili per mese e categoria (gasolio, esplosivo, manutenzioni, personale, canoni) | Senza costi Conti non può dire se guadagni | M | P2 |
| 10 | **Costo per tonnellata e marginalità per prodotto** | Costi ÷ tonnellate vendute; margine di contribuzione per prodotto | L'indicatore che dice quale prodotto conviene | M | P2 |
| 11 | **Break-even mensile** | Costi fissi ÷ margine medio a tonnellata = tonnellate da vendere per pareggiare | Risposta secca a "quanto devo vendere per non perderci" | S | P2 |
| 12 | **Statistiche di vendita** | Venduto per prodotto / cliente / mese, con tonnellate e valore | È la funzione più richiesta ai gestionali di settore | M | P2 |
| 13 | **Generatore XML FatturaPA 1.9.1** | Produce il file `.xml` valido (inclusi campi PA: CUU, CIG/CUP, split payment) da scaricare | Grande valore percepito, ma **noi generiamo, non inviamo** (vedi sezione 4) | L | P2 |
| 14 | **Stampa PDF di cortesia** | DDT, fattura, estratto conto stampabili dal browser (`window.print` + CSS di stampa) | Il camionista vuole un foglio in mano. Costo zero, nessuna libreria | M | P2 |
| 15 | **Trasporto a fasce di chilometri** | Tariffa €/t o €/m³ per fascia km, aggiunta alla riga di vendita | È il modo in cui il trasporto viene davvero venduto in cava | S | P3 |
| 16 | **Canone di escavazione stimato** | Aliquota €/m³ o €/t impostabile dall'organizzazione → canone stimato sul cavato, con promemoria della dichiarazione annuale | Tributo che nessun gestionale generico calcola, e varia per regione | S | P3 |
| 17 | **Storico solleciti** | Registra data e livello di ogni sollecito inviato | Serve come prova e per non sollecitare due volte | S | P3 |
| 18 | **Ponte Terra → Conti** | m³ rilevati dal drone → tonnellate via densità → valore a listino | Collega due app dell'ecosistema (già in roadmap come B3) | M | P3 |
| 19 | **Export commercialista** | CSV in stile registro IVA vendite + eventuale cartella di XML | Chiude il ciclo verso chi tiene la contabilità | S | P3 |
| 20 | **Backup completo dell'organizzazione** | Esporta/reimporta tutto in un file JSON | Sicurezza dei dati, oggi l'export è solo parziale | S | P3 |

**Ordine consigliato:** 1 → 2 → 5 → 3 → 4. Sono cinque mattoni che, messi in fila,
trasformano Conti da scadenzario a **ciclo di vendita della cava**. Tutto il resto
(marginalità, XML, statistiche) si appoggia su questi.

---

## 4. Cosa possiamo fare GRATIS e cosa costerebbe

Il fondatore ha vietato ogni spesa prima della commercializzazione. Quindi questa
sezione è la più importante del documento.

### ✅ Gratis, dentro Conti, nel browser — lo possiamo fare

| Cosa | Come |
|---|---|
| Anagrafiche, listini, DDT, fatture, scadenzario | Firestore già in uso tramite lo SDK, nessun costo aggiuntivo |
| Tutti i calcoli (IVA, netto pesata, mora, marginalità, break-even, canone stimato) | JavaScript nel browser |
| **Generare il file XML FatturaPA** | Costruzione del testo XML lato client, nessuna libreria a pagamento. Esistono anche moduli JavaScript open source di riferimento |
| **Controllo formale** dell'XML prima dell'export (campi obbligatori, lunghezze, formati) | JavaScript. **Non** è la validazione ufficiale: l'ultima parola è dello SdI |
| Stampa PDF di cortesia (DDT, fattura, estratto conto) | Funzione di stampa del browser + CSS di stampa. Zero librerie, zero costi |
| Export CSV per il commercialista | Già fatto oggi per le fatture, va esteso |
| Funzionamento offline e installazione su telefono | PWA, già presente |

### ✅ Gratis, ma FUORI da Conti — l'utente lo fa altrove (e va scritto nell'app)

| Cosa | Dove, gratis |
|---|---|
| **Inviare la fattura allo SdI** | Portale **Fatture e Corrispettivi** dell'Agenzia delle Entrate (accesso con SPID/CIE/CNS), oppure **PEC aziendale** verso `sdi01@pec.fatturapa.it`. Entrambi gratuiti |
| **Conservazione a norma 10 anni** | Servizio di conservazione **gratuito dell'Agenzia delle Entrate**, si attiva dal portale Fatture e Corrispettivi aderendo all'accordo di servizio |
| Trovare il codice ufficio di un ente pubblico | Indice PA (IPA), consultazione gratuita |

### ❌ Richiederebbe una spesa — quindi NON lo facciamo, e non lo promettiamo

| Cosa | Perché costa |
|---|---|
| **Canale accreditato allo SdI** (invio e ricezione automatici dall'app) | Serve un intermediario/provider accreditato: è un abbonamento |
| **Ricevere le fatture di acquisto** dei fornitori | Stessa cosa: serve un canale accreditato o la PEC gestita fuori |
| **Conservatore privato a norma** | Servizio a pagamento (quello dell'Agenzia è gratis: usiamo quello) |
| **Firma digitale e marca temporale** | Serve un certificato a pagamento. Nota: per B2B/B2C la firma **non è obbligatoria**; lo è verso la PA |
| **Lettura automatica del peso dalla pesa a ponte** | Serve hardware e il software del bilanciaio. Conti importa i dati a valle, non pilota la bilancia |
| **Lettura automatica di fatture/documenti (OCR o AI)** | Servizio esterno a consumo |
| Validazione XSD ufficiale server-side | Richiederebbe un server nostro. Ci fermiamo al controllo formale in JavaScript, dicendolo |

### La frase che deve stare dentro l'app

Ovunque Conti tocchi la fattura elettronica, va mostrata una riga fissa tipo:

> «Conti prepara il file XML e i documenti. L'invio allo SdI e la conservazione a
> norma si fanno **gratis** dal portale Fatture e Corrispettivi dell'Agenzia delle
> Entrate, oppure tramite il tuo commercialista.»

Non è una limitazione da nascondere: è la differenza tra un'app onesta e una che si
prende una responsabilità fiscale che non può reggere.

---

## 5. Fonti

**DDT e fattura differita**
- Camera di commercio di Torino — Il Documento di Trasporto (DDT): https://www.to.camcom.it/321-il-documento-di-trasporto-ddt
- Fiscomania — Documento di trasporto: cos'è e come si compila: https://fiscomania.com/documento-di-trasporto-ddt/
- BibLus/ACCA — DDT trasporto: cos'è, come si compila, quando si emette: https://biblus.acca.it/ddt-trasporto-cos-e-come-si-compila-quando-si-emette/
- EC News — L'utilizzo del documento di trasporto nella disciplina IVA: https://www.ecnews.it/lutilizzo-del-documento-di-trasporto-nella-disciplina-iva/
- Danea — DDT: come si compila ed esempio: https://www.danea.it/blog/ddt-documento-di-trasporto/
- TeamSystem — Obblighi di conservazione e firma dei DDT: https://www.teamsystem.com/magazine/identita-digitale/gli-obblighi-di-conservazione-e-firma-dei-ddt/

**Fattura elettronica, SdI, formato FatturaPA**
- Agenzia delle Entrate — Area fatturazione elettronica: https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica
- Agenzia delle Entrate — Come si invia una fattura elettronica al cliente: https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica/guida-fatturazione-elettronica/come-predisporre-inviare-ricevere-fe/come-inviare-fe-al-cliente
- Agenzia delle Entrate — Servizi gratuiti per predisporre, inviare, conservare e consultare: https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica/fatturazione-elettronica-site-area/servizi-consultazione-e-conservaz-fatture-elettroniche
- Agenzia delle Entrate — Specifiche tecniche versione 1.9.1 (utilizzabili dal 15 maggio 2026): https://www.agenziaentrate.gov.it/portale/specifiche-tecniche-versione-1.9.1-%C2%A0-utilizzabili-dal-15-maggio-2026-
- FatturaPA.gov.it — Formato FatturaPA: https://www.fatturapa.gov.it/it/norme-e-regole/documentazione-fattura-elettronica/formato-fatturapa/
- PMI.it — Specifiche 1.9.1 in vigore dal 15 maggio 2026: https://www.pmi.it/tecnologia/software-e-web/493394/fattura-elettronica-specifiche-tecniche-sdi-1-9-1.html

**Fatture verso la Pubblica Amministrazione (CUU, CIG, CUP, split payment)**
- Guida CIG, CUP e split payment: https://www.fatturah.it/blog/fattura-elettronica-pubblica-amministrazione
- Danea — Codifica del cliente PA e compilazione: https://www.danea.it/blog/fatture-elettroniche-pa-accorgimenti-da-adottare-nella-codifica-del-cliente-pa-e-nella-compilazione-e-invio-della-fattura/

**Registri IVA e conservazione**
- Agenzia delle Entrate — Il servizio di conservazione a norma: https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica/guida-fatturazione-elettronica/i-servizi-dell-agenzia-fe/servizio-conservazione-elettronica
- Agenzia delle Entrate — FAQ registrazione e conservazione delle fatture: https://www.agenziaentrate.gov.it/portale/schede/comunicazioni/fatture-e-corrispettivi/faq-fe/risposte-alle-domande-piu-frequenti-categoria/registrazione-e-conservazione-delle-fatture
- Danea — Registri IVA obbligatori: definizione, tenuta e conservazione: https://www.danea.it/blog/registri-iva/
- BibLus/ACCA — Registro IVA: cos'è, tenuta, conservazione: https://biblus.acca.it/registro-iva-cos-e-tenuta-conservazione/

**Canoni di concessione, diritti di escavazione, dichiarazioni**
- Regione Lombardia — L.R. 20/2021 attività estrattive di cava: https://www.regione.lombardia.it/wps/portal/istituzionale/HP/DettaglioAvviso/servizi-e-informazioni/enti-e-operatori/ambiente-ed-energia/cave/nuova-legge-in-attivita-estrattive-di-cava-lr-20-del-2021/nuova-legge-in-attivita-estrattive-di-cava-lr-20-del-2021
- ANCE Lombardia — riparto dei diritti di escavazione (84/14/2%): https://lombardia.ance.it/2021/11/19/approvata-da-regione-lombardia-la-nuova-legge-sulle-attivit-estrattive/
- Regione Veneto — legge regionale attività estrattive (diritti di escavazione, dichiarazione annuale): https://bur.regione.veneto.it/BurvServices/pubblica/DettaglioLegge.aspx?id=366192
- Regione Liguria — L.R. 12/2012, testo unico attività estrattiva: https://olympus.uniurb.it/index.php?option=com_content&view=article&id=9737:2012ligurial12&catid=27&Itemid=137
- Legambiente — Rapporto Cave (canoni medi, ~3,5% del prezzo di vendita): https://www.reteambiente.it/repository/normativa/rapporto_cave_2014.pdf

**Gestionali di settore e listini**
- InfoMinds — gestionale per produttori di inerti, pese e vendita: https://infominds.eu/settori/edilizia/produttori-inerti-calcestruzzo-cave/
- Project S.r.l. — software cave e impianti: https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html
- SMSTurbo — aggregates scale ticketing (fido cliente, prezzi contrattuali): https://www.creativeinfo.net/industries/aggregates-scale-ticketing/
- Weighpay — quarry software: https://www.weighpay.com/construction-aggregate-quarry-software
- Esempio di listino cava con trasporto a fasce km: https://www.fratellicotellessa.it/inerti/Listino%20Prezzi%20INERTI.pdf

**Indicatori economici**
- Pit & Quarry — Maximizing your cost per ton: https://www.pitandquarry.com/maximizing-your-cost-per-ton/
- TeamSystem — Break Even Point: definizione e calcolo: https://www.teamsystem.com/magazine/glossario/break-even-point/
- Margine di contribuzione: cos'è e come calcolarlo: https://www.businesscoachingitalia.com/margine-di-contribuzione-cose-e-come-calcolarlo/

**Generazione XML lato client (fattibilità tecnica)**
- Modulo JavaScript open source per fatture elettroniche: https://github.com/f2net/fattura-elettronica
- Forum Italia — creazione XML client-based: https://forum.italia.it/t/creazione-xml-client-based/10191
