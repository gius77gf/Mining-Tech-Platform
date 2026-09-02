# RICERCA CONTINUA — Scudo (sicurezza, adempimenti, scadenzario)

**Data**: 2026-08-14  
**Commit verificato**: 408cf9bc  
**Ricercatore**: Agente Haiku (ricerca mondana)

---

## Cosa esiste già su Scudo

Scudo ha già implementato:

- **Scadenzario** con stati calcolati (scaduta/entro 30gg/regolare) da data ISO
  - Scadenze per lavoratori (formazione, visite mediche, patenti, DPI, corsi)
  - Scadenze aziendali (verifiche periodiche di attrezzature — art. 71 D.Lgs 81/08)
  - Tre stati di verifica periodica: esito idoneo, prescrizioni, non misurato

- **Documenti** (DVR, DSS, verbali verifica periodica, nomine, qualifiche appaltatori)
  - Ciclo di vita DSS (D.Lgs 624/96 art. 6): dssRevisione, dssMotivo, dssTrasmissione
  - Stato esplicito: valido / da-rivedere / scaduto
  - Documenti senza stato dichiarato come uno stato raccontabile

- **Infortuni** (evento, gravità, giorni assenza, categoria near-miss, foto)
  - Distinzione tra infortunio e near-miss

- **Ispezioni** (modello, voci, esiti per voce: conforme/non-conforme/NA, stato programmata/in-corso/completata)

- **Figure di sicurezza** (nomine: RSPP, RLS, addetti emergenza, preposti)

- **Permessi di lavoro** (D.P.R. 177/2011 per spazi confinati: tipo, durata, atmosfera, stato)

- **Analisi** (5 Perché, azioni derivate da evento)

- **Imprese esterne** (appaltatori, documenti di qualifica CCIAA/DURC/autocert, appalti con DSS coordinato)

- **DPI** (consegna, scadenza, addestramento)

- **Mansioni** (nome, requisiti, DPI previsti)

---

## Ricerca mondana: che cosa chiede un ispettore in cava italiana

### 1. CHI FA I CONTROLLI E CON QUALE AUTORITÀ

**Ispettorato Nazionale del Lavoro (INL)** — accesso senza preavviso, verifica:
- Libro Unico del Lavoro (ora digitale), contratti, buste paga, versamenti
- Idoneità e manutenzione attrezzature (gru, betoniere, escavatori, piattaforme)
- Documentazione di salute e sicurezza

**ARPA** (Agenzia Regionale Protezione Ambiente) — per escavazioni:
- Controlli ambientali (relazioni annuali, analisi piezometriche)
- Trasmissione documentazione secondo norme regionali

**ASL territoriale** — verifiche periodiche di impianti e attrezzature (art. 71 D.Lgs 81/08)

**Ente concedente** (Comune/Provincia) — accesso per controlli autorizzazione e rinnovo (vigore max 15 anni)

⚠️ **Nota**: La ricerca non ha trovato una figura specifica «Ispettore minerario» unificato; i controlli sono distribuiti fra ASL, INL, ARPA, e ente concedente.

### 2. DOCUMENTI CHIESTI PER PRIMI (ORDINE SUGGERITO DA NORME)

[Dedotto da fonti sulle verifiche periodiche e D.Lgs 81/08]

**Ordine presumibile** (nessuna fonte dichiara una sequenza esplicita):
1. **DVR** (Documento Valutazione Rischi) — base obbligatoria, art. 28-29 D.Lgs 81/08
2. **DSS** (Documento Sicurezza e Salute nella cava) — D.Lgs 624/96 art. 6
3. **Registro infortuni** — art. 43 D.Lgs 81/08
4. **Verbali verifiche periodiche di attrezzature** — art. 71 c.11 D.Lgs 81/08, allegato VII
5. **Nomine RSPP/RLS/addetti** — art. 33-34, 37 D.Lgs 81/08
6. **Documentazione formazione e idoneità** — art. 37-43 D.Lgs 81/08
7. **Documentazione DPI e consegne** — art. 77 D.Lgs 81/08
8. **Autorizzazioni e rinnovi da ente concedente** — norme regionali estrattive

### 3. VERIFICHE PERIODICHE E LORO PERIODICITÀ

**Art. 71 D.Lgs 81/08 (Allegato VII)** — apparecchi di sollevamento cose e persone:
- **Prima verifica**: INAIL entro 45 giorni, poi enti autorizzati
- **Verifiche successive**: da enti autorizzati (non da chi fa manutenzione)
- **Documentazione**: rapporto scritto, ultimi 3 anni disponibili

**Non trovato**: periodicità esatta per categoria (es. gru ogni X anni, piattaforma elevabile ogni Y). Le norme rinviano agli Standard UNI per ogni categoria di attrezzatura. Scudo dovrebbe esporre questa periodicità per ogni tipo dichiarato.

**Impianti elettrici di terra**: periodicità variabile (non specificamente legata a cave) — controllo sia di INL che ASL.

### 4. COSA SUCCEDE SE UN DOCUMENTO MANCA O È SCADUTO

[Dedotto da fonti su D.Lgs 81/08 sanzioni e verifiche]

- **DVR assente**: violazione art. 28-29; la cava non può operare
- **Verifica periodica scaduta**: violazione art. 71; attrezzatura non usabile fino a risanamento
- **DSS non sottoscritto dall'appaltatore**: violazione D.Lgs 624/96 art. 9 — interferenze non governate
- **Registro infortuni assente/falso**: violazione art. 43; responsabilità del datore
- **Formazione/idoneità scaduta**: operatore non autorizzato a quel lavoro

⚠️ **Nota**: Le sanzioni amministrative/penali non sono state trovate dettagliatamente nelle ricerche (sarebbero in codice penale e D.Lgs 81/08 art. 301 ss.); il testo si limita a norme procedurali.

### 5. SOFTWARE DI SETTORE (COMPETITOR ANALYSIS)

Non trovato in questa ricerca. Potrebbe servire una ricerca mirata ai software HSE/EHS già in commercio per cavea italiane.

---

## DELTA — Confronto col mondo

**Schermata · cosa manca · come si vede · costo · come si misura**

1. **Scadenzario — verifiche periodiche per categoria di attrezzatura · non è dichiarata la periodicità standard per ogni categoria (gru, piattaforma, escavatore, ecc.) · sulla riga della verifica non compare il dato "ogni X anni secondo UNI XXXX" · cercare negli standard UNI e nelle guide ASL le periodicità per le attrezzature dichiarate; aggiungere campo `periodicitaStandard` alla scadenza con valenza didattica/di controllo · controllare che ogni verifica periodica in DEMO abbia una periodicità dichiarata e che corrisponda allo standard**

2. **Permesso di lavoro — non è dichiarato se il permesso copre spazi confinati secondo D.P.R. 177/2011 · il campo `tipo` accetta valori generici, e la distinzione tra "permesso generico" e "permesso per spazi confinati" non è esplicita · aggiungere nel form e nella lista una dichiarazione visibile del D.P.R. applicato quando si compila un permesso; distinguere fra "generico" (D.P.R. XXXX) e "spazi confinati" (D.P.R. 177/2011) · verificare che sulla schermata di Permessi cada un badge o dichiarazione che distingua i due casi; controllare che il form non permetta di rilasciare un permesso per spazi confinati a chi non ha l'abilitazione**

3. **Autorizzazione ente concedente — non è tracciata la data di scadenza e rinnovo della concessione da ente (Comune/Provincia/Regione) · il cantiere ha solo stato (attivo/chiuso) senza dati dell'autorizzazione · aggiungere a `cantieri` i campi `autorizzazioneEnte` (data inizio), `autorizzazioneScadenza` (fino a 15 anni), `ente`, `numero_autorizzazione`; o creare una collezione separata `autorizzazioni` · il cantiere deve esibire in una schermata dedicata la data di scadenza dell'autorizzazione, con stessa logica dello scadenzario (verde/giallo/rosso)**

---

**Proposta non accettata** (già presente): L. 198/2025 citata in sei punti del codice, verbale DPI, anagrafe appaltatori con qualifiche, registro near-miss — già presenti e misurati.

**Proposta non accettata** (carenza di ricerca mondana): Periodicità exact per impianti (es. "impianto di aerazione ogni 12 mesi") — non trovato in ricerca generale; serve approfondimento su standard tecnici UNI e linee guida ASL per categoria.

---

## Note di metodo

- ⚠️ **WebFetch bloccato dal proxy**: non è stato possibile leggere il testo completo di fonti normative (ARPA, enti regionali) — le descrizioni vengono dai risultati di ricerca testuali
- ⚠️ **Non trovato**: una lista ufficiale di "controlli in ordine di priorità" — ricostruita per deduzione da norme D.Lgs 81/08 e D.Lgs 624/96
- ⚠️ **Non cercato**: software HSE di competitor (Gedora, Ergonet, ecc.) — servirebbe ricerca mirata successiva

Fonti:
- [Ispezione sul lavoro: svolgimento, controlli e verbale ispettorato del lavoro](https://www.lavoroediritti.com/abclavoro/ispezioni-sul-lavoro)
- [Controllo Ispettorato del Lavoro in cantiere: come prepararsi](https://cantiereinrete.it/blog/controllo-ispettorato-lavoro-cantiere/)
- [Controlli ispettorato del lavoro: cosa sapere e come agire](https://www.studiobclaw.it/comunicati/controlli-ispettorato-del-lavoro/)
- [Controlli e verifiche delle attrezzature di sollevamento D.Lgs 81/08](https://dszsrl.it/verifiche-periodiche-attrezzature-sollevamento/)
- [Le Verifiche Periodiche delle Attrezzature di Sollevamento (allegato VII del D.Lgs. 81/08)](https://www.progetto81.it/blog/61/attrezzature-sollevamento)
- [Documenti per la sicurezza sul lavoro: ecco l'elenco](https://biblus.acca.it/documenti-per-la-sicurezza-sul-lavoro/)
- [Sicurezza e valutazione dei rischi per le attività estrattive](https://www.puntosicuro.it/attivita-estrattive-minerali-C-17/sicurezza-valutazione-dei-rischi-per-le-attivita-estrattive-nelle-cave-AR-21944/)
- [Patentino escavatore: come ottenere la certificazione](https://www.asso-pmi.it/news/patentino-escavatore-come-ottenere-la-certificazione-secondo-la-legge-nuovo-accordo-stato-regioni-2025-realta-virtuale-app-formatori-docenti-rspp-esterno-interno-rls-rlst-preposto-datore-evento-forma.html)

---

## ⛔ RIVERIFICA DEL 14/08 — le tre mancanze proposte sono TUTTE E TRE false o mal poste

*Rimisurato dal ciclo prima che una riga entrasse in roadmap. Vale la regola:
**niente entra sulla parola dell'agente**, e un «non c'è» senza il suo comando
accanto vale zero.*

| mancanza dichiarata | verdetto | il comando, rilanciato |
|---|---|---|
| «manca la periodicità standard delle verifiche» | ⛔ **FALSA** | `grep -rciE "periodicita\|ogni.*mesi\|cadenza" apps/scudo/scudo-data.js` → **291**. Il campo si chiama `periodicitaGiorni` ed è nello schema delle ispezioni, con valori veri nella dimostrazione (30 e 15 giorni) |
| «non distingue il permesso per **spazi confinati**» | ⛔ **FALSA** | `grep -rciE "spazi confinati\|confinat\|177/2011" apps/scudo/scudo-data.js apps/scudo/index.html` → **33 e 3**. Il **D.P.R. 177/2011 art. 2** è citato per esteso nel modulo, con la voce di checklist «accesso a tramogge e spazi confinati» e una scadenza di formazione dedicata |
| «non traccia la scadenza dell'autorizzazione» | ⚠️ **MAL POSTA** | `grep -rciE "autorizzazione\|concessione\|rinnovo" apps/scudo/scudo-data.js` → **10**. Che *quella* scadenza sia nello scadenzario è un'altra domanda, e va posta così — non come «non c'è» |

### ⛔ È la QUARTA ricerca di fila con la stessa causa
Tutte e quattro hanno cercato **la parola del mondo dentro il nostro codice**:
«near-miss» dove il campo si chiama `tipo`, «safety stock» dove la funzione si
chiama `propostaScorte`, «modello A» dove la pagina scrive «dichiarazione
annuale», e adesso «periodicità standard» dove il campo si chiama
`periodicitaGiorni` e sta lì da settimane.
⚠️ Il mandato lo diceva, per esteso, con gli esempi — e non è bastato. La
lezione non è sul mandato: è che **il vocabolario è il punto debole di questo
tipo di lavoro**, e l'unica difesa che ha funzionato finora è **rilanciare i
comandi di chi consegna**, che costa un minuto per riga.

### Che cosa regge
La **metà sul mondo** — chi controlla (INL, ARPA, ASL, ente concedente) e che
cosa guarda ciascuno — è utile e va tenuta, **col limite dichiarato**:
`WebFetch` è bloccato dal proxy, quindi nessuna di quelle norme è stata
**aperta**; articoli e periodicità vengono da risultati di ricerca e vanno
verificati sul testo prima che un numero finisca in una schermata.
**Delle tre proposte, zero entrano in roadmap.**

## Ricerca del 2026-09-02 — lo scadenzario unico della cava: il mondo

### Fatti normative

La concessione/autorizzazione all'esercizio non può superare i **10 anni** [seconda mano - Abruzzo LR]. La periodicità varia per regione: in Piemonte Legge Regionale 23/2016 la disciplina [seconda mano - regione.piemonte.it]. Chi chiede il rinnovo avvia **prima della scadenza** un procedimento amministrativo [seconda mano - Città Metropolitana Milano, 60gg volture + 90gg altri]. Autorizzazione è **personale**: trasferimento (voltura) richiede riauthorizzazione [seconda mano - Comarca]. Dichiarazione quantitativi estratti: modello unico A, non aggregare più cave [seconda mano - Piemonte]. Canone varia 0–2€/m³ per regione; assente in Basilicata/Sardegna [seconda mano - report Legambiente 2025].

Revisione mezzi: **primo controllo 4 anni**, poi **ogni 2 anni** [seconda mano - motorionline.com]. Bollo: annuale, con 30gg tolleranza; sospensione veicolo se scaduto [seconda mano]. Assicurazione RC: obbligatoria, scadenza dipende da sottoscrizione [seconda mano].

Verificazione apparecchi sollevamento (all. VII D.Lgs 81/08): **1–3 anni** a secondo attrezzatura/età; richiesta 45gg prima scadenza [seconda mano - progetto81.it]. Formazione macchine movimento terra: **16 ore, quinquennale**, aggiornamento **4 ore** obbligatorio; **solo in presenza** [seconda mano - edafos.it/scuolasicurezza.it].

Sorveglianza sanitaria (art. 41 D.Lgs 81/08): **periodicità annuale** di norma, modificabile dal medico competente per rischio; organo di vigilanza può alterare con provvedimento motivato [seconda mano - tussl.it].

Autorità competenti: **Provincia** o Regione (per aree protette); **ARPA** sorveglia ambientalmente; **Corpo miniere** coordina [seconda mano - ARPAE Emilia-Romagna, Piemonte, Marche].

### Tabella: Scadenze per famiglia

| Famiglia | Scadenza tipica | Periodicità | Chi controlla | Fonte |
|---|---|---|---|---|
| Concessione estrazione | Autorizzazione esercizio | 10 anni, rinnovabile | Provincia/Regione | [seconda mano] LR regionali |
| Concessione estrazione | Dichiarazione annuale quantitativi | Annuale | Regione/Provincia | [seconda mano] Modello A |
| Concessione estrazione | Piano coltivazione | Ogni rinnovo (10 anni) | Regione/Provincia | [dedotto da LR] |
| Concessione estrazione | Garanzie fideiussorie | Per rinnovo concessione | Banca | [dedotto da prassi] |
| Mezzo | Revisione autocarro | 2 anni dopo primo controllo | Motorizzazione civile | [seconda mano] CdS |
| Mezzo | Bollo auto | Annuale, 30gg tolleranza | Regione | [seconda mano] |
| Mezzo | Assicurazione RC | Soggetta a scadenza sottoscrizione | Compagnia assicurativa | [seconda mano] CdS |
| Mezzo | Verificazione apparecchi sollevamento | 1–3 anni | Ente certificato/INAIL | [seconda mano] All. VII D.Lgs 81/08 |
| Persona | Sorveglianza sanitaria | Annuale (modificabile) | Medico competente/Organo vigilanza | [seconda mano] Art. 41 D.Lgs 81/08 |
| Persona | Formazione macchine movimento terra | 5 anni, aggiornamento 4 ore | Ente autorizzato | [seconda mano] D.Lgs 81/08 |
| Persona | Formazione generale + specifica | Annuale (rinnovamento) | RSPP interno | [dedotto da norma] |

### Tabella: Software HSE — come mostrano scadenzario unificato

| Software | Scadenzario unico? | Stati dichiarati | Preavviso | Fonte |
|---|---|---|---|---|
| Blumatica Q-HSE | Sì, CloudIO sincronizzato | Non esplicitato in ricerca | Configurabile, generato automatico | [seconda mano] blumatica.it/blog |
| Sikuro | Sì, centralizzato | Non esplicitato in ricerca | Alerting configurabile, giorni scelti dall'utente | [seconda mano] sikurogroup.com/scadenzario-intelligente |
| SafeFleet | Sì (flotta focus) | Non esplicitato in ricerca | Preavviso per manutenzione | [seconda mano] safefleet.it |
| 4HSE | Sì | Non esplicitato in ricerca | Non esplicitato in ricerca | [seconda mano] 4hse.com |

**Nota**: Ricerca non ha trovato specifiche pubbliche su gestione stati «in regola / scaduta / mai registrata» per software HSE italiani. Software mostra scadenzario unificato per concessioni + mezzi + persone, con periodicità automatica e alerting, ma **documenti pubblici non descrivono come giudicano uno stato senza data di registrazione iniziale**.

### Domande per chi ha il codice in mano

1. **Chi decide che una scadenza senza data iniziale è «scaduta»?** Il medico competente che fissa periodicità è lo scrittore della regola temporale, o la app lo decide dal solo valore di periodo?
2. **Lo scadenzario accetta uno stato nullo («mai registrata»)?** O costringe il dato a un valore prudenziale (es. «scaduta 365gg fa»)?
3. **Un apparecchio di sollevamento senza cartellino di verifica — è un fallimento di lettura, o la regola lo vede come «mai verificato»?**
4. **Quando ARPA/Provincia chiedono lo stato delle scadenze di concessione, quale formato leggono?** CSV / API / pannello web / carta intestata?
5. **Che cosa mostra il preavviso: data di scadenza - data odierna, oppure conta anche il buffer del medico competente (es. 30gg prima)?**

