# I documenti che una cava consegna a terzi — e quali possiamo generare noi

Ricerca di luglio 2026 per Giuseppe. Scritta in italiano semplice, senza dare
per scontato niente. **Non modifica nessun codice**: è solo un documento per
decidere.

La domanda di partenza è molto concreta:

> *In un anno, una cava italiana quali fogli deve consegnare a qualcun altro —
> enti, clienti, dipendenti — e quali di questi fogli possiamo produrre noi,
> con i dati che le nostre app già hanno?*

Questa è la domanda che vale soldi. Un cliente non paga volentieri per "un
gestionale": paga volentieri per **non passare tre giorni a rimettere insieme i
numeri** quando arriva la scadenza della denuncia annuale, o per **non pagare
il consulente** che gli ricopia a mano i dati che lui ha già.

---

## 0. Tre verità da tenere sempre presenti (prima di tutto il resto)

### Verità 1 — noi prepariamo i dati, non sostituiamo il professionista

Una buona parte dei documenti di una cava **deve essere firmata da qualcuno che
se ne assume la responsabilità penale**: il datore di lavoro, il direttore
responsabile della cava, un geologo, un ingegnere minerario, il medico
competente, un tecnico competente in acustica iscritto all'elenco nazionale, un
laboratorio prove.

Un software che dicesse "ti genero io il DSS" o "ti genero io la relazione di
stabilità dei fronti" **mentirebbe**, e nel momento in cui succede un incidente
quella bugia diventa un problema legale enorme — per il cliente e per noi.

La posizione onesta, e anche quella commercialmente più forte, è:

> **Deepwork raccoglie e ordina i dati, li stampa in un foglio pulito e datato,
> e te lo dà in mano. La firma e la responsabilità restano di chi la legge
> vuole.**

Detta così è vera **ed è comunque utilissima**: il 70% del lavoro (e del costo
del consulente) è proprio raccogliere e ordinare i dati.

### Verità 2 — le cave sono materia REGIONALE

Non esiste una legge nazionale che dica "il volume estratto si denuncia entro
il giorno X con il modulo Y". Ogni regione ha la sua legge, il suo piano
(PRAE/PAE), le sue scadenze, i suoi moduli e le sue tariffe.

Esempi verificati che mostrano quanto siano diverse le cose:

| Regione | Cosa cambia |
|---|---|
| **Piemonte** | Statistica mineraria annuale **entro il 30 aprile**, da inviare **anche se non si è estratto nulla**; onere per il diritto di escavazione entro il **30 aprile** sul materiale estratto l'anno prima |
| **Veneto** | Versamento annuo al Comune **entro il 28 febbraio**, parametrato a tipo e quantità di materiale estratto e utilizzato industrialmente |
| **Lombardia** | L.R. 20/2021: i titolari comunicano periodicamente i dati dell'attività estrattiva; dati di autocontrollo ambientale caricati sul portale **AUA Point** di ARPA entro il **31 marzo**; denuncia annuale acque pubbliche derivate al **31 marzo** |
| **Toscana, Puglia, Sicilia, Abruzzo…** | linee guida e procedure di collaudo/svincolo fideiussione proprie, con moduli propri |

**Conseguenza operativa vincolante per noi:** ⛔ **mai scrivere una scadenza o
una tariffa "di legge" fissa dentro il codice.** Tutto deve essere un
**parametro impostabile dall'azienda cliente** (data, tariffa €/m³, ente
destinatario), con un elenco di *esempi* dichiarati come esempi. Se scriviamo
"30 aprile" nel codice e il cliente è in Veneto, gli facciamo saltare una
scadenza e diventa colpa nostra.

### Verità 3 — non spendiamo niente, quindi non inviamo niente

Tutto quello che segue vive dentro una pagina web statica. Questo significa:

- ✅ **possiamo**: comporre un foglio ordinato, stamparlo dal browser
  (Stampa → *Salva come PDF*), esportare CSV, copiare testo negli appunti;
- ❌ **non possiamo**: firma digitale, marca temporale, conservazione a norma
  10 anni, invio automatico a un portale (SdI, RENTRI, INAIL, MUD), PEC.

Quindi il nostro prodotto è sempre lo stesso schema:

> **Deepwork produce il FOGLIO. L'invio lo fa l'utente, con gli strumenti che
> già usa (portale dell'ente, PEC del commercialista, consulente).**

---

## 1. Il calendario annuale degli adempimenti

Legenda dell'ultima colonna:
- 🟢 = **possiamo generarlo già oggi** (o con pochissimo lavoro sui dati che ci sono)
- 🟡 = **possiamo generarlo se aggiungiamo un pezzo** (indicato)
- 🔴 = **non possiamo** (serve firma, professionista abilitato, laboratorio o portale)

⚠️ = la scadenza o la regola **cambia da regione a regione**: va impostata dal cliente.

### 1a. Scadenze a data (più o meno) fissa

| Quando | Documento | A chi va | Riferimento | Dove sono i dati da noi | Noi |
|---|---|---|---|---|---|
| **16 febbraio** | Autoliquidazione INAIL — pagamento premio (F24) | INAIL | D.P.R. 1124/1965 | — (consulente del lavoro) | 🔴 |
| **28 febbraio / inizio marzo** (2026: 2 marzo) | Dichiarazione delle retribuzioni | INAIL | idem | — | 🔴 |
| **28 febbraio** ⚠️ | Versamento annuo al Comune su materiale estratto e utilizzato (esempio Veneto) | Comune | legge regionale | **Terra** (volumi) + **Conti** (tariffa) | 🟢 riepilogo dei m³ e calcolo |
| **31 marzo** | **Allegato 3B** — dati aggregati sanitari e di rischio dei lavoratori sotto sorveglianza sanitaria | INAIL (lo invia **il medico competente**) | art. 40 D.Lgs 81/2008, all. 3B | **Scudo** (elenco lavoratori e idoneità) | 🟡 elenco pronto per il medico; l'invio è suo |
| **31 marzo** ⚠️ | Dati di **autocontrollo emissioni in atmosfera** dell'anno precedente (in Lombardia via portale AUA Point, che sostituisce la PEC a Provincia/Comune/ARPA) | Autorità competente, Comune, ARPA | D.Lgs 152/2006 Titolo I Parte V + AUA | **Sentinella** (monitoraggi, adempimenti) | 🟡 raccolta e riepilogo; i **valori** vengono dal laboratorio |
| **31 marzo** ⚠️ | Denuncia annuale volumi d'acqua derivata/prelevata da pozzo (esempio Lombardia) | Regione / Provincia / Città metropolitana | R.D. 1775/1933 e norme regionali | — (oggi non abbiamo il dato) | 🟡 se aggiungiamo un contatore acqua in Sentinella |
| **30 aprile** ⚠️ | **Statistica mineraria annuale** — volumi estratti, lavorati, commercializzati, destinazione (esempio Piemonte; **va inviata anche a zero estrazione**) | Regione | legge regionale | **Terra** (rilievi, fronti, autorizzazioni) | 🟢 riepilogo annuale dei volumi |
| **30 aprile** ⚠️ | **Onere / diritto di escavazione** — pagamento sul materiale estratto l'anno prima | Regione (e Comuni) | leggi regionali; es. Piemonte DGR 23-6964/2018 | **Terra** (m³) + tariffa impostata dall'azienda | 🟢 calcolo m³ × tariffa |
| **Finestra annuale** (variabile) | **Rilevazione ISTAT "Cave e miniere"** (Pressione antropica e rischi naturali), portale GINO — **obbligo di risposta** | ISTAT | D.Lgs 322/1989 art. 7 + PSN | **Terra** (volumi, litotipi) + **Scudo** (addetti) | 🟡 foglio con i numeri da ricopiare nel questionario |
| **30 aprile → 2026: 3 luglio** | **MUD** — Modello Unico di Dichiarazione ambientale (rifiuti prodotti/gestiti l'anno prima) | Camera di Commercio | D.Lgs 152/2006 + DPCM annuale (2026: DPCM 30/01/2026) | oggi **non abbiamo** un registro rifiuti | 🟡 serve registro rifiuti in Sentinella |
| **Annuale, prima dell'inizio dei lavori** | **DSS** — Documento di Sicurezza e Salute, redatto/attestato annualmente dal datore di lavoro | tenuto in cava, trasmesso all'autorità di vigilanza | artt. 6 e 10 D.Lgs 624/1996 | **Scudo** (lavoratori, mansioni, DPI, ispezioni) + **Flotta** (attrezzature) | 🔴 il documento; 🟡 **gli allegati** |
| **Annuale** | **Relazione sulla stabilità dei fronti**, rischio caduta massi e franamento: altezza e pendenza dei fronti, metodo di coltivazione — *"predisposta o aggiornata annualmente"* | tenuta in cava / autorità di vigilanza | art. 52 D.Lgs 624/1996 | **Terra** (fronti: quota, banco, avanzamento) + **Scudo** (eventi) | 🔴 la relazione; 🟡 **la scheda dati per il tecnico** |
| **Annuale** (aziende > 15 lavoratori) | **Verbale della riunione periodica** di prevenzione | interno, esibito in ispezione | art. 35 D.Lgs 81/2008 | **Scudo** | 🟡 serve elenco partecipanti + ordine del giorno |
| **Annuale** | **Ispezione dell'organismo notificato** sul controllo di produzione di fabbrica (FPC) → rinnovo del certificato | Organismo notificato | Reg. UE 305/2011, sistema **2+** | **Conti** (prodotti) — oggi non c'è anagrafica prodotti | 🔴 il certificato; 🟡 lo **scadenzario delle prove** |
| **Ogni 3 anni** | **Registro degli esposti a cancerogeni** (silice cristallina respirabile da lavorazione) — variazioni comunicate ogni tre anni | INAIL + ASL, via applicativo telematico SINP | art. 243 D.Lgs 81/2008; all. XLII (D.Lgs 44/2020) | **Scudo** (lavoratori, mansioni) | 🔴 l'invio; 🟡 l'elenco degli esposti per mansione |
| **Annuale / biennale** ⚠️ | **Analisi periodiche**: emissioni, rumore, acque, polveri → rapporti di prova | Autorità competente, ARPA, Comune | AUA / prescrizioni autorizzative | **Sentinella** (monitoraggi, adempimenti) | 🔴 i rapporti; 🟢 **lo scadenzario + l'archivio** |
| **Annuale / biennale** | **Verifiche periodiche attrezzature** (all. VII D.Lgs 81/08): *prima* verifica INAIL entro 60 gg dalla richiesta, *successive* ASL/ARPA o soggetti abilitati entro 30 gg | INAIL / ASL / soggetto abilitato | D.M. 11 aprile 2011 | **Flotta** (mezzi, scadenze) | 🟡 serve anagrafica attrezzature soggette a verifica |

### 1b. Documenti legati a un evento (non a una data del calendario)

| Quando scatta | Documento | A chi va | Riferimento | Dove sono i dati | Noi |
|---|---|---|---|---|---|
| **8 giorni prima** di inizio o ripresa dei lavori | **Denuncia di esercizio**: estremi del titolo/autorizzazione, ubicazione, a cielo aperto o in sotterraneo, nome e domicilio del **direttore responsabile** e dei **sorveglianti per ogni turno** | autorità di vigilanza (racc. A/R) | art. 20 D.Lgs 624/1996 | **Scudo** (nomine) + **Terra** (autorizzazione) | 🟡 lettera precompilata |
| **entro 8 giorni** | Variazione del direttore responsabile o dei sorveglianti | autorità di vigilanza | art. 20 D.Lgs 624/1996 | **Scudo** | 🟡 stessa lettera |
| **entro 24 ore** | Incidente che ha causato **morte** o lesioni guarite in **oltre 30 giorni** — comunicazione del direttore responsabile | autorità di vigilanza | D.Lgs 624/1996 | **Scudo** (registro infortuni) | 🟡 testo precompilato, invio manuale |
| **entro 24 ore** | Infortunio **mortale o con pericolo di morte** | INAIL | D.P.R. 1124/1965 | **Scudo** | 🔴 portale INAIL |
| **entro 2 giorni** dal certificato medico | **Denuncia di infortunio** (assenza oltre 3 giorni) e **comunicazione ai fini statistici** (assenza di almeno 1 giorno, entro 48 ore) | INAIL | D.P.R. 1124/1965; D.Lgs 151/2015 (registro infortuni cartaceo **abolito**) | **Scudo** | 🔴 portale INAIL; 🟢 registro **interno** |
| **prima dell'inizio del trasporto**, ogni viaggio | **DDT** — documento di trasporto: data, cedente, cessionario, vettore, natura/qualità/quantità dei beni; numerazione progressiva; conservazione 10 anni | cliente + vettore | D.P.R. 472/1996 | **Conti** — oggi manca | 🟡 **la funzione più preziosa da fare** |
| **entro il 15 del mese successivo** | **Fattura differita** riepilogativa dei DDT del mese | cliente + SdI | art. 21 D.P.R. 633/1972 | **Conti** | 🟡 bozza sì, XML+invio no |
| **ogni fornitura** | **DoP — Dichiarazione di Prestazione** + marcatura CE dell'aggregato | cliente (e chi la chiede) | Reg. UE 305/2011; norme armonizzate UNI EN **12620** (calcestruzzo), **13242** (non legati/legati idraulici), **13043** (bituminose), **13139** (malte) | **Conti** — manca anagrafica prodotti | 🟡 generatore di DoP dai dati inseriti dall'azienda |
| **ogni carico di rifiuti** | **FIR / xFIR** — formulario di identificazione del rifiuto, digitale su **RENTRI** dal 13 febbraio 2026 per gli iscritti | trasportatore + destinatario | D.Lgs 152/2006; RENTRI | oggi non c'è | 🔴 piattaforma ministeriale con firma elettronica |
| **continuo** | **Registro cronologico di carico/scarico rifiuti** (RENTRI) | tenuto in azienda | D.Lgs 152/2006 | oggi non c'è | 🟡 doppione interno sì, ufficiale no |
| **continuo** | **Registro giornaliero degli esplosivi** (carico/scarico), **vidimato dal Prefetto** | Prefettura / autorità di P.S. | art. 55 TULPS; D.Lgs 624/96 art. 27 (licenza di fochino del Prefetto) | **Sentinella** (registro volate) + **Genesi** (progetto volata) | 🔴 il registro ufficiale; 🟢 lo **specchietto interno** |
| **ogni volata** | **Piano di tiro** (progetto esecutivo della volata: diametro, posizione, lunghezza e orientamento dei fori, carica, temporizzazione), richiamato dal progetto di coltivazione e dal DSS | tenuto in cava | prassi + D.Lgs 624/1996 | **Genesi** | 🟡 stampa del progetto; la firma resta del tecnico |
| **ogni consegna DPI** | **Verbale di consegna DPI** con firma del lavoratore + addestramento per DPI di III categoria e otoprotettori | lavoratore (copia) + azienda | art. 77 D.Lgs 81/2008 | **Scudo** | 🟡 serve elenco DPI per lavoratore |
| **ogni corso** | **Attestato di formazione** + fascicolo del corso (registro presenze firmato, docente, contenuti, test) — conservazione 10 anni | lavoratore + azienda | art. 37 D.Lgs 81/08; Accordo Stato-Regioni | **Scudo** | 🟡 registro presenze e archivio sì; l'attestato **valido** lo rilascia il soggetto formatore |
| **6 mesi prima della scadenza** | **Rinnovo AUA** (durata **15 anni**) | SUAP | D.P.R. 59/2013 | **Sentinella** (adempimenti) | 🟢 scadenza in scadenzario |
| **fine lavori / fine autorizzazione** ⚠️ | **Richiesta di collaudo e svincolo della fideiussione**: relazione che descrive e quantifica i lavori eseguiti + **planimetria aggiornata** con le superfici recuperate | Regione / Provincia / Comune (beneficiario della polizza) | leggi e linee guida regionali | **Terra** (volumi, fronti) — mancano le superfici recuperate | 🟡 fascicolo dati; la planimetria firmata no |
| **continuo** | **Planimetrie dei lavori aggiornate**, firmate da direttore e rilevatore | autorità mineraria | D.P.R. 128/1959 | **Terra** (archivio rilievi) | 🔴 il disegno firmato; 🟢 l'**archivio datato** dei rilievi |

---

## 2. Documento per documento: possiamo generarlo? e con quali dati?

Qui entro nel dettaglio. Per ogni voce dico **cosa serve**, **cosa manca**, e
soprattutto **quanto vale**.

### 2a. 🟢 Possiamo generarlo GIÀ OGGI (i dati ci sono)

**1. Riepilogo annuale dei volumi estratti** — app **Terra**
Terra ha già `rilievi` (data, volume m³, fronte, metodo, banda di incertezza),
`fronti` e `autorizzazioni`. Basta una pagina stampabile:
*anno, volume per fronte, volume per mese, totale, confronto col volume annuo
autorizzato, residuo*.
Non è il modulo ufficiale della Regione (che cambia ⚠️): è **il foglio dei
numeri da ricopiare nel modulo**, e già così toglie mezza giornata di lavoro.
Va scritto in testa: *"Riepilogo interno. Il modulo ufficiale è quello della
tua Regione."*

**2. Calcolo dell'onere / canone di escavazione** — **Terra** + **Conti**
m³ estratti × tariffa €/m³ **impostata dall'azienda**. Attenzione a due
dettagli veri che abbiamo trovato: in Piemonte la tariffa si applica al volume
**al netto** del materiale usato per il recupero ambientale della cava stessa,
e per la pietra ornamentale si applica alla quantità **commercializzata**, non
estratta. Quindi servono due caselle: "volume estratto", "volume detratto per
recupero". Mai una tariffa fissa nel codice.

**3. Cartella del lavoratore da esibire in ispezione** — **Scudo**
Una pagina per lavoratore: anagrafica, mansione, idoneità sanitaria e data,
corsi con scadenza, DPI consegnati, nomine. È **esattamente il fascicolo che
l'ispettore chiede**, e oggi in cava lo si mette insieme a mano dentro un
raccoglitore. Lavoro nostro: basso. Valore percepito: altissimo.

**4. Registro interno infortuni e near-miss + azioni correttive** — **Scudo**
Scudo ha già `infortuni` e `azioni`. Il registro cartaceo è abolito dal 2015,
ma la L. 198/2025 chiede alle aziende oltre 15 addetti dati aggregati su
near-miss **e azioni correttive**. Un riepilogo stampabile serve subito.
Va scritto in app: *"non sostituisce la denuncia INAIL"*.

**5. Registro delle volate** — **Sentinella**
Già c'è: data, fronte, n° fori, kg totali, kg max per ritardo, distanza dal
ricettore, esito. È **il documento che salva l'azienda** quando un vicino
contesta una vibrazione: dimostra cosa è stato fatto e quando. Serve solo la
stampa ordinata.

**6. Report di monitoraggio ambientale interno** — **Sentinella**
Punti di misura, soglia, letture con data, superamenti evidenziati. Da
allegare a quello che il consulente manda ad ARPA. I **valori certificati**
restano quelli del laboratorio: noi li archiviamo e li mettiamo in fila.

**7. Verbale di rilievo topografico** — **Terra**
Data, metodo (RTK/PPK/GCP), GSD, classe di accuratezza, volume **con la banda
± %**. Terra ha già `classeAccuratezza()` e `bandaVolume()`. Nessun concorrente
stampa un numero così onesto: è un piccolo capolavoro già fatto, va solo
messo su carta.

**8. Rapportino di turno / registro giornaliero** — **Campo**
Attività, squadre, fermi con causale, produzione. Stampabile come diario di
cantiere. Non è un obbligo di legge, ma è quello che il direttore di cava
tiene comunque e che serve quando si ricostruisce un evento.

**9. Scheda mezzo con storico** — **Flotta**
Mezzo, ore, manutenzioni fatte, ricambi, scadenze. Utile quando si vende il
mezzo, quando arriva la verifica periodica, quando si contesta una fattura di
officina.

**10. Scadenzario stampabile** — **tutte le app**
Un unico foglio "cosa scade nei prossimi 90 giorni", con ente destinatario.
È il documento che il direttore di cava attacca in ufficio.

### 2b. 🟡 Possiamo generarlo SE AGGIUNGIAMO qualcosa

**11. DDT — documento di trasporto** — **Conti**
*Cosa manca:* anagrafica clienti, cantieri/destinazioni, vettori con targa,
prodotti con unità di misura; numerazione progressiva annuale senza salti;
pagina di stampa.
*Perché vale tanto:* è il documento **più frequente in assoluto** (decine al
giorno), non ha un formato obbligatorio (la legge chiede solo contenuti
minimi), e sblocca la fattura differita — cinquanta viaggi in un mese =
cinquanta DDT = **una sola fattura** entro il 15 del mese dopo.
*Onestà:* un DDT digitale con pieno valore "informatico" vorrebbe firma
digitale e conservazione a norma. Il nostro DDT si **stampa** e si firma a
mano, come si fa oggi in cava. Va detto in app.

**12. Bozza di fattura differita dai DDT del mese** — **Conti**
*Cosa manca:* il collegamento DDT → fattura e il raggruppamento per cliente.
*Onestà:* possiamo produrre la **bozza leggibile**. L'XML FatturaPA da mandare
allo SdI (dal 15 maggio 2026 versione 1.9.1, il tracciato vecchio viene
scartato) e la conservazione a norma restano fuori: costano.

**13. Generatore di DoP (Dichiarazione di Prestazione)** — **Conti**
*Cosa manca:* un'anagrafica prodotti con, per ciascuno: codice identificativo
unico, uso previsto, **norma armonizzata** (UNI EN 12620 / 13242 / 13043 /
13139), sistema di valutazione (**2+** per gli aggregati), **numero del
certificato FPC** e nome dell'organismo notificato, e le caratteristiche
essenziali con i valori dichiarati (granulometria, forma, resistenza alla
frammentazione, contenuto di fini, sostanze pericolose…).
*Come funziona:* l'azienda inserisce una volta i dati, Deepwork compone il
foglio DoP e lo stampa per ogni cliente che lo chiede.
*Onestà, importante:* **i valori vengono dal laboratorio**, non da noi.
E **chi firma la DoP si assume la responsabilità del prodotto**: è il
fabbricante. Noi facciamo il modulo, non la certificazione.

**14. Scadenzario e archivio delle prove FPC** — **Conti** o **Sentinella**
La UNI EN 12620 fissa **frequenze minime di prova** (allegato H) per ogni
caratteristica. Un piccolo scadenzario "quale prova, su quale prodotto, ogni
quanto, ultima fatta, prossima" + archivio dei rapporti di prova è lavoro
piccolo e valore alto: è la prima cosa che l'organismo notificato guarda
all'ispezione annuale.

**15. Scheda dati per la relazione annuale di stabilità dei fronti** — **Terra** + **Scudo**
*Cosa manca:* in Terra, per ogni fronte, altezza e **pendenza**; in Scudo, un
tipo di ispezione "fronte di cava" (ciglio, unghia, gradoni, blocchi in
equilibrio precario, viabilità piste).
*Cosa produciamo:* un foglio con altezza/pendenza/metodo di coltivazione per
fronte, storico delle ispezioni, eventi anomali (piogge eccezionali, sismi,
distacchi). **Il geologo o l'ingegnere lo usa come base e firma lui la
relazione.** Questo è l'esempio perfetto della Verità 1: gli risparmiamo mezza
giornata di raccolta dati, ma non gli togliamo la firma.

**16. Allegati del DSS** — **Scudo** + **Flotta** + **Terra**
Il DSS non lo scriviamo noi. Ma i suoi allegati sì: elenco lavoratori e
mansioni, elenco attrezzature con verifiche periodiche, elenco DPI assegnati,
registro delle ispezioni, elenco delle procedure. Più il **promemoria di legge
più utile che esista**: *il DSS va aggiornato dopo modifiche significative e
dopo incidenti significativi* — quindi quando Scudo registra un incidente deve
dire "ricordati che il DSS va rivisto".

**17. Riepilogo dati per il MUD** — **Sentinella**
*Cosa manca:* un registro rifiuti (codice CER, quantità, data, destinatario,
numero FIR).
*Cosa produciamo:* il riepilogo annuale per codice CER da ricopiare nel MUD.
*Onestà:* il MUD si presenta alla Camera di Commercio per via telematica con
firma; noi non lo inviamo. E il registro cronologico ufficiale ormai è il
**RENTRI**: il nostro sarebbe un doppione interno, va detto chiaramente.

**18. Riepilogo per la rilevazione ISTAT "Cave e miniere"** — **Terra** + **Scudo**
Il questionario chiede volumi estratti per tipo di minerale, destinazione,
superfici, addetti. Terra ha i volumi, Scudo il numero di addetti. Un foglio
di riepilogo pronto è mezz'ora di lavoro risparmiata ogni anno — poco, ma è
un **obbligo di risposta** con sanzione, quindi il cliente se lo ricorda.

**19. Verbale della riunione periodica (art. 35)** — **Scudo**
*Cosa manca:* elenco partecipanti (datore, RSPP, medico competente, RLS) e
ordine del giorno.
*Cosa produciamo:* il verbale precompilato con i dati dell'anno (infortuni,
near-miss, formazione, DPI, esiti sorveglianza sanitaria) da stampare e far
firmare ai presenti.

**20. Registro presenze corsi e archivio attestati** — **Scudo**
*Onestà importante:* l'attestato **valido** lo rilascia il soggetto formatore,
non l'azienda. Noi teniamo il registro presenze, archiviamo la copia
dell'attestato e ricordiamo le scadenze. Non generiamo attestati: sarebbe
falso e pericoloso.

**21. Verbale di consegna DPI** — **Scudo**
*Cosa manca:* un elenco DPI (tipo, marca/modello, categoria) e l'assegnazione
al lavoratore.
*Cosa produciamo:* il modulo in due copie (una all'azienda, una al lavoratore)
con l'elenco dei DPI consegnati, la data, l'informazione/addestramento
ricevuto e gli spazi firma. Si stampa e si firma a mano.

**22. Lettera di denuncia di esercizio / variazione nomine** — **Scudo** + **Terra**
Testo precompilato con estremi dell'autorizzazione, ubicazione, tipo di
coltivazione, direttore responsabile e sorveglianti per turno. Da inviare
almeno **8 giorni prima** dell'inizio o della ripresa dei lavori, e per ogni
variazione entro 8 giorni. È una lettera che nessuno si ricorda di dover fare.

**23. Fascicolo per il collaudo e lo svincolo della fideiussione** — **Terra**
*Cosa manca:* per ogni lotto, la **superficie recuperata** e la percentuale di
recupero completato.
*Cosa produciamo:* la relazione-dati (lavori eseguiti, volumi, superfici
recuperate per lotto, confronto col progetto) e lo storico dei rilievi. La
planimetria firmata la fa il tecnico. ⚠️ la procedura cambia molto da regione a
regione: in alcune lo svincolo è **parziale e proporzionale** ai recuperi già
fatti — informazione che vale soldi veri per il cliente.

**24. Stampa del piano di tiro** — **Genesi**
Il piano di tiro è il progetto esecutivo della volata (fori, cariche,
temporizzazione) ed è richiamato dal progetto di coltivazione e dal DSS.
Genesi lo calcola già: manca solo una pagina di stampa pulita con data,
fronte, schema e parametri. Firma e responsabilità restano di chi la volata la
progetta.

**25. Specchietto interno del consumo esplosivi** — **Genesi** / **Sentinella**
⚠️ **Attenzione grossa:** il registro giornaliero degli esplosivi è **vidimato
dal Prefetto** (art. 55 TULPS). Il registro ufficiale resta quello cartaceo
vidimato. Il nostro può essere solo uno **specchietto interno di controllo**, e
va scritto a caratteri cubitali dentro l'app. Promettere il contrario sarebbe
gravissimo.

### 2c. 🔴 NON possiamo (e va detto subito, senza giri di parole)

| Documento | Perché no |
|---|---|
| **DSS** e **DVR** firmati | Li firmano datore di lavoro, RSPP, medico competente, sorveglianti e RLS. Sono valutazioni di rischio, non compilazioni |
| **Relazione di stabilità dei fronti** | Serve geologo / ingegnere minerario che si assume la responsabilità |
| **Valutazione di impatto acustico** | La firma solo un **tecnico competente in acustica iscritto all'elenco nazionale**, con fonometro di classe 1 |
| **Rapporti di prova** (aggregati, emissioni, acque, polveri, rumore) | Servono laboratorio e strumenti tarati |
| **Certificato FPC** | Lo rilascia l'organismo notificato dopo ispezione in stabilimento |
| **Allegato 3B** | Lo trasmette il **medico competente**, non l'azienda |
| **Denuncia infortunio INAIL** | Portale INAIL, nessuna API pubblica utilizzabile da una web-app |
| **MUD** | Invio telematico con firma alla Camera di Commercio |
| **FIR digitale / registro RENTRI** | Piattaforma ministeriale con firma elettronica e API riservate |
| **Fattura elettronica XML → SdI** | Comporre l'XML sarebbe possibile; trasmetterlo e conservarlo a norma costa |
| **Registro esposti a cancerogeni** | Trasmissione telematica su applicativo INAIL/SINP |
| **Registro esplosivi** | Vidimato dal Prefetto |
| **Planimetrie firmate** | Firma di direttore responsabile e rilevatore |
| **Conservazione a norma 10 anni** | Richiede firma digitale, marca temporale, regole AgID |

**La frase da mettere dentro le app** (proposta):

> *Deepwork raccoglie i tuoi dati e li stampa in un foglio ordinato e datato.
> Non firma, non invia e non sostituisce il tuo consulente, il tuo tecnico o il
> laboratorio. Le scadenze e le tariffe le imposti tu, perché cambiano da
> regione a regione.*

---

## 3. Priorità: i 5 documenti da fare per primi

Criterio: **quanto valore per il cliente diviso quanto lavoro per noi**.

### 1° — DDT (documento di trasporto) → app **Conti**
- **Valore: massimo.** È il documento più frequente di tutti, si emette prima
  di ogni viaggio, e apre la strada alla fattura differita mensile. È anche il
  motivo per cui una cava compra un gestionale.
- **Lavoro: medio-alto** — serve costruire le anagrafiche (clienti, cantieri,
  vettori, prodotti) che oggi in Conti mancano. Ma quelle anagrafiche servono
  comunque a tutto il resto.
- Formato: pagina stampabile A4 in tre copie + esportazione CSV.

### 2° — Riepilogo annuale volumi + calcolo dell'onere di escavazione → app **Terra**
- **Valore: alto.** È la scadenza annuale che fa perdere giornate intere, e in
  alcune regioni va presentata **anche se non si è estratto nulla**.
- **Lavoro: basso** — i dati (rilievi, fronti, autorizzazioni, volume annuo
  pianificato) sono già tutti dentro Terra. È quasi solo una pagina di stampa
  più una casella "tariffa €/m³" e una "volume detratto per recupero".
- ⚠️ Scadenza e tariffa **impostate dal cliente**, mai fisse nel codice.

### 3° — Cartella del lavoratore + verbale di consegna DPI → app **Scudo**
- **Valore: alto.** È il fascicolo fisico che si esibisce quando arriva
  l'ispettore, e oggi si costruisce a mano da un raccoglitore.
- **Lavoro: basso per la cartella** (i dati ci sono), **medio per i DPI**
  (serve l'elenco DPI e l'assegnazione al lavoratore).
- Bonus: mette Scudo in regola con l'art. 77, che oggi copre solo a metà.

### 4° — Fascicolo ambientale annuale → app **Sentinella**
- **Valore: alto.** Un unico stampato che raccoglie monitoraggi, letture,
  superamenti, registro volate e scadenze: è quello che il consulente
  ambientale chiede via mail ogni anno, e che oggi si mette insieme a mano.
- **Lavoro: basso** — Sentinella ha già monitoraggi, letture, volate e
  adempimenti; manca la pagina che li unisce e li stampa.
- ⚠️ In alcune regioni gli autocontrolli vanno caricati su portale entro il
  31 marzo: la scadenza va impostata dal cliente.

### 5° — Stato di avanzamento della coltivazione + verbale di rilievo → app **Terra**
- **Valore: medio-alto.** Serve tre volte: come documento periodico per l'ente,
  come base del fascicolo di collaudo/svincolo fideiussione, e come prova
  interna che il rilievo è stato fatto.
- **Lavoro: basso** — Terra ha già volumi, banda di incertezza, proiezione di
  fine anno e residuo autorizzato. Manca la stampa e, per il collaudo, il campo
  "superficie recuperata per lotto".
- È anche l'unico foglio in circolazione che dichiara onestamente l'incertezza
  del volume (**19.400 m³ ± 388**): è un elemento di distinzione vero.

---

## ⚠️ Rimisurato il 01/08 — quattro dei cinque non aspettano più i dati

Questa sezione è stata scritta stimando il lavoro. Rileggendola prima di
costruirci sopra, e **contando le funzioni invece di ricordarle**, le stime sono
in gran parte superate: nei cicli seguenti gli strati dati sono stati costruiti,
e oggi **quattro documenti su cinque aspettano solo la pagina**.

| # | documento | dati | che cosa manca davvero |
|---|---|---|---|
| 1 | **DDT** — Conti | `clienti` ✅ `prodotti` ✅ | ⛔ **`cantieri` e `vettori`: zero riferimenti nel modulo.** È l'unico buco di dati rimasto dei cinque. Poi la pagina. |
| 2 | **Riepilogo annuale + onere** — Terra | ✅ completo | solo la pagina di stampa |
| 3 | **Cartella lavoratore + verbale DPI** — Scudo | ✅ completo | solo la pagina |
| 4 | **Fascicolo ambientale** — Sentinella | ✅ completo | solo la pagina |
| 5 | **Avanzamento + verbale di rilievo** — Terra | ✅ completo | solo la pagina |

**Dove le stime erano più lontane dal vero, oggi:**

- **#3 diceva «lavoro medio per i DPI — serve l'elenco DPI e l'assegnazione al
  lavoratore».** Sono stati costruiti: Scudo ha **undici** funzioni sui DPI, fra
  cui `ultimaConsegnaDpi`, `statoConsegnaDpi`, `allarmiDpi`, `riepilogoDpi` — e
  **`verbaleDpi`**, cioè proprio il documento che questa scheda elencava come la
  parte difficile.
- **#4 diceva «manca la pagina che li unisce»**, ed è ancora esatto:
  `reportConformita` produce già periodo, ricettore, letture, soglia applicata
  con la sua provenienza, superamenti ed **esito** — compreso `senza-dati`, che
  è il principio dell'assenza nel suo posto d'origine.
- **#2 è stato completato il 01/08** con `onereEscavazione` e `descriviOnere`.
- **#5** ha già `proiezioneAnnua`, `classeAccuratezza`, `bandaVolume` e
  `descriviOrigine` — cioè anche la frase che dichiara **come è nato il numero**,
  che questa scheda indicava come l'elemento di distinzione.

**Conseguenza pratica, ed è il motivo per cui questa nota esiste:** chi riprende
da qui **non deve scrivere strati dati**. Se lo facesse, riscriverebbe roba che
c'è — l'errore che in questo progetto è già costato quattro volte. Il lavoro
rimasto è **una pagina di stampa per documento**, più le due anagrafiche
mancanti di Conti.

**Il primo dei rimandati (6°): il generatore di DoP** in Conti. Valore alto
verso i clienti, ma richiede prima l'anagrafica prodotti — che è la stessa che
serve al DDT. Quindi: si fa il DDT, e la DoP diventa quasi gratis subito dopo.

---

## 4. Come si stampa, senza spendere niente

Tutto con gli strumenti che già abbiamo:

1. **Una pagina di stampa dedicata** per ogni documento (non la schermata
   normale): intestazione con ragione sociale, sede e cava, titolo del
   documento, periodo di riferimento, data e ora di generazione.
2. **CSS `@media print`**: nascondere menu e pulsanti, forzare A4, ripetere
   l'intestazione della tabella su ogni pagina, evitare che una riga si spezzi
   a metà.
3. **Salvataggio in PDF**: il browser lo fa già (Stampa → *Destinazione: Salva
   come PDF*). Zero costi, zero librerie.
4. **Piè di pagina onesto**: *"Documento generato da Deepwork il gg/mm/aaaa.
   Documento interno di lavoro: non sostituisce i documenti firmati previsti
   dalla legge."*
5. **Esportazione CSV** accanto a ogni stampa, per chi deve ricopiare i numeri
   in un portale o in un foglio di calcolo.
6. **Numerazione progressiva** solo dove serve davvero (DDT, fatture): va
   salvata sul database dell'organizzazione, controllata contro i salti, e
   azzerata a inizio anno.

Cosa **non** facciamo: firma digitale, marca temporale, PEC, invio automatico,
conservazione a norma. Sono tutti servizi a pagamento.

---

## 5. Fonti

### Sicurezza in cava — D.Lgs 624/1996 e D.Lgs 81/2008
- [Testo del D.Lgs 624/1996 (Parlamento)](https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm)
- [Art. 20 — Direttore responsabile e sorvegliante, denunce di esercizio (8 giorni prima)](https://legislazionetecnica.it/node/1365369)
- [Il DSS per le attività estrattive — contenuti e aggiornamento annuale (StudioEssepi)](https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/documento-di-sicurezza-e-salute-dss-attivita-estrattive)
- [Come elaborare il DSS nel settore estrattivo (PuntoSicuro)](https://www.puntosicuro.it/valutazione-dei-rischi-C-59/come-elaborare-il-documento-di-sicurezza-salute-nel-settore-estrattivo-AR-23129/)
- [Regione Puglia DGR 570/2015 — Linee guida prevenzione e sicurezza in cava](https://olympus.uniurb.it/index.php?option=com_content&view=article&id=15828:pug570_15&catid=27&Itemid=137) ⚠️ *linee guida regionali: esistono equivalenti diversi in altre regioni*
- [Stabilità dei fronti: relazione da aggiornare annualmente](https://www.servizi-sicurezza-sul-lavoro.it/rischio-settore-cave-ed-attivita-estrattive-la-stabilita-dei-fronti)
- [Cave a cielo aperto: come assicurare la sicurezza dei lavoratori (InSic)](https://www.insic.it/sicurezza-sul-lavoro/valutazione-del-rischio-articoli/cave-a-cielo-aperto-come-assicurare-la-sicurezza-lavoratori/)
- [D.P.R. 128/1959 — Norme di polizia delle miniere e delle cave](https://www.certifico.com/sicurezza-lavoro/legislazione-sicurezza/70-decreti-sicurezza-lavoro/6277-d-p-r-9-aprile-1959-n-128)

### Documenti verso i dipendenti
- [Verbale di consegna DPI — fac-simile (Vega Engineering)](https://www.vegaengineering.com/modulistica/il-verbale-di-consegna-dei-dpi/)
- [Modulo consegna DPI e obblighi art. 77 (BibLus)](https://biblus.acca.it/modulo-consegna-dpi-ecco-il-fac-simile-da-scaricare-gratis/)
- [Attestati di formazione: contenuti, fascicolo del corso, conservazione 10 anni (BibLus)](https://biblus.acca.it/attestato-sicurezza-sul-lavoro/)
- [Rilascio degli attestati dal soggetto formatore (Vega Engineering)](https://www.vegaengineering.com/news/come-garantire-il-rilascio-dellattestato-del-corso-dal-soggetto-formatore-al-lavoratore/)
- [Allegato 3B — trasmissione all'INAIL entro il 31 marzo](https://www.insic.it/sicurezza-sul-lavoro/comunicazione-dei-dati-aggregati-e-sanitari-di-rischio-obblighi-e-scadenze-per-i-medici-competenti/)
- [Allegato 3B, scadenza 31/03/2026](https://cinemed.it/sorveglianza-sanitaria-invio-allegato-3b-al-31-03-2026/)
- [Registro degli esposti ad agenti cancerogeni — INAIL](https://www.inail.it/cs/Satellite?c=Page&cid=2443085351476&d=68&pagename=Internet/Page/paginaFoglia/layout)
- [Registro esposizione agenti cancerogeni: quando e come (Certifico)](https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/registro-esposizione-agenti-cancerogeni-quando-e-come)

### Infortuni e INAIL
- [Denuncia, certificazione medica e comunicazione di infortunio: termini (BibLus)](https://biblus.acca.it/semplificazioni-per-la-denuncia-di-infortunio-all-inail/)
- [La denuncia di infortunio: termini e scadenze (Studio Marchetti)](https://www.studiomarchetti.va.it/images/notizie/La_denuncia_di_infortunio__termini_e_scadenze.pdf)
- [Autoliquidazione INAIL 2025/2026 — istruzioni operative](https://portale.assimpredilance.it/articoli/inail-autoliquidazione-2025-2026-istruzioni-operative)
- [Autoliquidazione INAIL — pagina ufficiale](https://www.inail.it/portale/assicurazione/it/Datore-di-Lavoro/Impresa-con-dipendenti-industria-artigianato-terziario-altre-attivita/pagamento-premio-assicurativo-e-regolarita-impresa-con-dipendenti/autoliquidazione-impresa-con-dipendenti.html)

### Attrezzature
- [D.M. 11 aprile 2011 — verifiche periodiche attrezzature (Certifico)](https://www.certifico.com/sicurezza-lavoro/legislazione-sicurezza/decreti-sicurezza-lavoro/d-m-11-aprile-2011-verifica-impianti-e-attrezzature)
- [INAIL — manutenzione, controllo e verifica di un'attrezzatura](https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/conoscere-il-rischio/attrezzature-di-lavoro/manutenzione,-controllo-e-verifica-di-un-attrezzatura.html)

### Ambiente
- [MUD 2026 — scadenza prorogata al 3 luglio 2026 (LabAnalysis)](https://www.labanalysis.it/it/news/normativa/mud-2026-denuncia-annuale-rifiuti-anno-2025-scadenza-prorogata-al-03-luglio-2026.html)
- [MUD — Camera di Commercio / Ecocamere](https://www.ecocamere.it/adempimenti/MUD)
- [RENTRI 2026: dal 13 febbraio nuovi obblighi (Namirial)](https://focus.namirial.com/it/rentri-2026/)
- [RENTRI: scadenze e obblighi per il FIR digitale (PuntoSicuro)](https://www.puntosicuro.it/gestione-rifiuti-C-122/rentri-scadenze-obblighi-per-il-fir-digitale-le-categorie-escluse-AR-26080/)
- [AUA — durata 15 anni, rinnovo 6 mesi prima (Regione Emilia-Romagna)](https://ambiente.regione.emilia-romagna.it/it/valutazioni-ambientali-e-autorizzazioni/autorizzazioni/autorizzazione-unica-ambientale) ⚠️ *le modalità operative cambiano da regione a regione*
- [AUA Point per comunicare i dati di emissioni e scarichi — entro il 31 marzo (Assimpredil Ance)](https://portale.assimpredilance.it/articoli/aua-point-per-comunicare-i-dati-emissioni-in-atmosfera-e-o-agli-scarichi) ⚠️ *portale della sola Lombardia*
- [Controlli sulle emissioni in atmosfera — ARPA Piemonte](https://www.arpa.piemonte.it/scheda-informativa/controlli-sulle-emissioni-atmosfera)
- [Emissioni in atmosfera: obblighi, autorizzazioni e adempimenti (Artser)](https://www.artser.it/approfondimenti/emissioni-in-atmosfera-obblighi-autorizzazioni-e-adempimenti-per-le-imprese.html)
- [Denunce di prelievo di acque pubbliche — Città metropolitana di Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/utilizzo_prelievo_acque/denunce_prelievo.html) ⚠️ *regolata a livello regionale/provinciale*
- [Denuncia annuale quantitativi d'acqua pubblica derivata — Regione Lombardia](https://www.regione.lombardia.it/wps/portal/istituzionale/HP/DettaglioServizio/servizi-e-informazioni/Imprese/Sicurezza-ambientale-e-alimentare/Acqua/denuncia-annuale-uso-acque-pubbliche-derivate/denuncia-annuale-uso-acque-pubbliche-derivate) ⚠️
- [Valutazione di impatto acustico: solo tecnico competente iscritto all'elenco nazionale](https://www.syrios.it/impatto-clima-tecnico-acustico-rumore-mantova-reggio-emilia-modena-verona-parma/acustica-ambientale/valutazione-documentazione-impatto-acustico/)

### Autorizzazione, volumi, oneri, collaudo — ⚠️ tutto regionale
- [Statistica mineraria annuale — Regione Piemonte (entro il 30 aprile, anche a zero estrazione)](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/statistica-mineraria-annuale) ⚠️
- [Onere per il diritto di escavazione — Regione Piemonte (entro il 30 aprile)](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione) ⚠️
- [Legge regionale Veneto — versamento annuo al Comune entro il 28 febbraio](https://bur.regione.veneto.it/BurvServices/pubblica/DettaglioLegge.aspx?id=366192) ⚠️
- [Gestione dell'attività estrattiva — Città metropolitana di Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/gestione_att_estrattiva/index.html) ⚠️
- [L.R. Lombardia 20/2021 — coltivazione sostenibile di sostanze minerali di cava](https://normelombardia.consiglio.regione.lombardia.it/normelombardia/accessibile/main.aspx?iddoc=lr002021110800020&view=showdoc) ⚠️
- [Linee guida recupero ambientale e svincolo (totale/parziale) delle fideiussioni](https://legislazionetecnica.it/node/1519701) ⚠️
- [Presentazione delle fideiussioni — Regione Puglia](https://pugliacon.regione.puglia.it/web/sit-puglia-ambiente/presentazione-delle-fidejussioni) ⚠️
- [Il recupero ambientale delle cave: un vincolo spesso disatteso (RGA Online)](https://rgaonline.it/giurisprudenza/il-recupero-ambientale-delle-cave-un-vincolo-spesso-disatteso/)
- [Cave — Provincia di Cuneo](https://www.provincia.cuneo.it/cave/index) ⚠️

### Statistica nazionale
- [ISTAT — Rilevazione "Pressione antropica e rischi naturali: attività estrattive da cave e miniere" (obbligo di risposta)](https://www.istat.it/informazioni-sulla-rilevazione/rilevazione-pressione-antropica-e-rischi-naturali-le-attivita-estrattive-da-cave-e-miniere/)
- [Fac-simile del modello "Cave e miniere" (ISTAT)](https://www.istat.it/fascicoloSidi/1551/FACSIMILE%20Modello%20rilevazione%20CAVE%20E%20MINIERE%20ediz.%202023.pdf)
- [Portale GINO per la raccolta dati](https://gino.istat.it/pressantropica/)
- [MASE — Le attività estrattive da cave e miniere](https://unmig.mase.gov.it/le-attivita-estrattive-da-cave-e-miniere/)

### Documenti verso i clienti
- [Regolamento UE 305/2011 — CPR (Certifico)](https://www.certifico.com/marcatura-ce/direttive-nuovo-approccio/regolamento-cpr/regolamento-prodotti-da-costruzione-cpr-305-2011)
- [Dichiarazione di Prestazione (DoP) — cos'è e cosa contiene](https://www.certifico.com/marcatura-ce/documenti-marcatura-ce/documenti-riservati-marcatura-ce/dichiarazione-di-prestazione-dop-regolamento-prodotti-da-costruzione-305-2011)
- [Marcatura CE per aggregati — UNI EN 12620 e 13242](http://www.simeasrl.it/servizi/certificazioni/marcatura-ce-aggregati-reg-30511-uni-13242-ed-uni-12620/)
- [Sistema 2+: l'organismo notificato ispeziona lo stabilimento ogni anno e rilascia il certificato FPC (ICMQ)](http://icmq.it/materiali-prodotti/certificazione-controllo-produzione-fabbrica-fpc.php)
- [UNI EN 12620 — aggregati per calcestruzzo (UNI)](https://www.uni.com/aggregati-per-calcestruzzo-2/)
- [Le prove e i controlli sugli aggregati — frequenze minime (Istituto Giordano)](https://www.infobuild.it/infobuild/archive.media/386559d831cc3e462c2cfb00e05eb376Proveecontrolli-Ing.GentiNallbati.pdf)
- [Esempio reale di DoP di una cava di pietrischetto (Unicalcestruzzi)](https://www.unicalcestruzzi.it/documents/87676/2965912/DoP+A38+Fossano+06400A38A+Pietrischetto+12620+13043+13242+Rev+13.pdf)

### Esplosivi
- [Fochino — Prefettura di Roma (licenza del Prefetto)](https://www1.prefettura.it/roma/contenuti/Fochino-5633190.htm)
- [Procedura di sicurezza: uso degli esplosivi in cava (registri di carico/scarico)](https://www.testo-unico-sicurezza.com/procedura-di-sicurezza-uso-degli-esplosivi-in-cava.html)
- [Vidimazione dei registri di P.S. — il registro giornaliero esplosivi è vidimato dal Prefetto (art. 55 TULPS)](https://www.conarmi.org/faq_scheda.jsp?idnews=3056)
- [Schema di procedura di sicurezza esplosivi — Regione Toscana](https://www301.regione.toscana.it/bancadati/atti/Contenuto.xml?id=5138049&nomeFile=Delibera_n.64_del_31-01-2017-Allegato-A) ⚠️

### Come lo fanno i software di settore
- [Project Building — gestionale cave e impianti: bollettazione, listini per cliente e cantiere, fatturazione per cantiere, DDT fornitori](https://project-srl.it/software-edilizia/project-building-software-impianti-e-cave.html)
- [Generazione DDT precompilati dalle commesse (Dinamico)](https://lnx.dinamico.it/help/dinamico-enterprise/documenti/gestione-documenti)
- [Template di stampa configurabili, PDF/Excel (1C-ERP)](https://www.1c-erp.it/supporto/guida-utente-gestionale/stampa-documenti/)

**Cosa fanno loro e possiamo copiare senza spendere:** modelli di stampa
configurabili per tipo di documento, precompilazione automatica dei campi dai
dati già inseriti, numerazione progressiva, e la stessa informazione esportata
in tre formati (stampa/PDF, CSV, testo negli appunti). Tutto qui: non c'è
niente di magico, c'è solo il lavoro di mettere i dati in un foglio ordinato.

---

## 6. Collegati

- `docs/RICERCA_TERRA_202607.md` — autorizzazione, denuncia volumi, oneri di
  escavazione, fideiussione (approfondimento della parte "produzione")
- `docs/RICERCA_CONTI_202607.md` — DDT, fattura differita, fattura elettronica,
  tributi estrattivi
- `docs/RICERCA_SCUDO_202607.md` — obblighi di sicurezza non coperti
- `docs/RICERCA_SENTINELLA_202607.md` — monitoraggi ambientali e soglie
- `docs/SCUDO_NORMATIVA_CAVE.md` — quadro normativo di base

---

## In una riga

**Il nostro prodotto non è "un gestionale": è la macchina che trasforma i dati
che il cliente inserisce comunque in fogli pronti da consegnare — e il primo
foglio da fare è il DDT, il secondo è il riepilogo annuale dei volumi.**
