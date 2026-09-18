# Sviluppo — come si lavora su questo repository

*Aggiornato il 31/07/2026. La versione precedente era ferma alla primissima
fase («v1.0 Field Operations Platform», «localStorage per persistenza dati») e
descriveva un prodotto che non esiste più: chi la leggeva si faceva un'idea
sbagliata di tutto — di dove stanno i dati, di quante superfici ci sono, di
cosa è già coperto da prove.*

## Cos'è, in due righe

Un monorepo di applicazioni web **senza framework e senza build**: HTML, CSS e
JavaScript a moduli, aperti direttamente dal browser. I dati stanno su
**Firestore**, isolati per organizzazione; senza login le app mostrano una
**demo** con dati finti, così si possono aprire e far vedere senza configurare
niente.

## Le superfici

| Dove | Cos'è |
|---|---|
| `index.html` (radice) | il **core** Deepwork: un monolite di ~8.000 righe, PWA |
| `apps/index.html` | la **vetrina** dell'ecosistema |
| `apps/<nome>/` | le sei app verticali: `campo`, `conti`, `flotta`, `scudo`, `sentinella`, `terra` |
| `apps/genesi/` | il simulatore di volata |
| `apps/deepwork-id/` | accesso, abbonamenti, isolamento (la «Fase 0») |
| `shared/` | stile vincolante + SDK identità + motore grafici + convenzioni comuni |

Ogni app verticale è fatta di due file: `index.html` (la pagina) e
`<nome>-data.js` (le **funzioni pure**: calcoli, letture CSV, riepiloghi). La
divisione non è estetica — è quello che rende le app **provabili senza
browser**.

## Aprire il progetto in locale

```sh
python3 -m http.server 8823        # dalla radice del repo
# poi: http://127.0.0.1:8823/apps/       (la vetrina)
#      http://127.0.0.1:8823/apps/conti/ (una app)
```

⚠️ **Il core (`/index.html`) non si apre in locale, e non è colpa del login.**
Tutto il suo programma sta in un `<script type="module">` che importa Firebase
da `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano i
segnaposto («Funzione nav non ancora pronta»). Per aprirlo davvero si monta
`apps/deepwork-id/tests/browser/finto-firebase.mjs` **prima** di navigare.

## Le prove

**3.622 prove girano senza rete e senza browser**, con `node` (contate lanciandole, non a memoria — al 18/09: 3128 + 330 + 83 + 32 + 9 + 8 + 7 + 3 + 22), dopo aver corretto in Conti (quarto giro di deep-pass) `registroVendite`: una fattura corretta con la matita mescolava imponibile/imposta calcolati dalle righe vecchie col totale registrato nuovo — dopo aver corretto in Campo (terzo giro di deep-pass) il rapporto di fine turno stampato e firmato, che non portava né i near-miss del turno né il giudizio di idoneità medica (ponte con Scudo) mentre il Quadro schermo e il documento gemello li mostravano già — dopo aver corretto in Sentinella (quarto giro di deep-pass) due delle quattro chiamate a `misuraFuoriCondizioni` rimaste senza il ponte meteo con Campo — dopo aver corretto in Terra (terzo giro di deep-pass) `varianzaLottoAnno`: un rilievo a calendario impossibile ribaltava il verdetto pianificato-vs-reale del lotto — dopo aver corretto in Flotta (secondo giro di deep-pass) tre difetti veri: i CSV esportati scrivevano i decimali col punto inglese invece della virgola italiana; il libretto macchina — «il foglio che si consegna a chi compra la macchina» — non riportava mai il costo orario completo (possesso + esercizio), il numero che il codice stesso dichiara decisivo; l'età del mezzo era calcolata e testata ma non compariva mai a schermo, solo nel CSV — dopo aver corretto in Terra (deep-pass) `sequenzaLotto`: l'articolo scritto a mano («il 80%») invece di `articoloNumero`, e in Flotta (ricerca continua sul mestiere) `PIANI_TAGLIANDO` che non dichiarava la fonte dei suoi passi a ore (generici di settore, non il libretto del mezzo) — dopo aver corretto in Scudo (censimento a doppio punto di chiamata, quinto difetto vero nello stesso giorno, ma di forma diversa: qui il lettore `parseInfortuniCsv` non leggeva affatto le tre colonne della denuncia INAIL, non una singola chiamata che le scartava) il registro infortuni: `dataCertificato`/`denunciaData`/`denunciaNumero`, scritte già nella settima colonna come frase per l'RSPP ma mai come dati rileggibili — un registro esportato e ri-caricato perdeva la denuncia già presentata, senza modale per correggerla dopo la registrazione; ottava/nona/decima colonna in coda, scrittore e lettore insieme, nuovo test con controprova, dopo aver corretto in Sentinella (censimento a doppio punto di chiamata, quarto difetto vero trovato con lo stesso metodo nello stesso giorno) `db.aggiungi("adempimenti",...)`: l'import CSV non passava `periodoMesi`/`giorniConsegna` che `parseAdempimentiCsv` già leggeva — un adempimento re-importato perdeva il periodo dichiarato, `periodoAdempimento` tornava "senza-periodicita" e il bottone "Prepara il report" si rifiutava di partire; nuovo test di wiring con controprova, dopo aver corretto in Conti (censimento a doppio punto di chiamata, terzo difetto vero trovato con lo stesso metodo nello stesso giorno) `csvClienti`/`parseClientiCsv`: la copia di sicurezza dell'anagrafica non portava `listinoId`, quindi un cliente col listino personalizzato ri-caricato dal backup tornava silenziosamente al listino base — quattordicesima colonna, scrittore e lettore insieme (non prima fetta: il campo esisteva già su entrambi i lati dello schermo), nuovo test con controprova, dopo aver corretto in Terra (passata di profondità, binario 2, nessun agente di ricerca) un ponte wired solo a metà: `tolleranzaPct` del rilevatore, provato a livello di modulo (`csvRilievi`/`parseRilieviCsv`/`classeAccuratezza`), non passava dal gestore di import CSV a `db.aggiungi` — un rilievo re-importato perdeva la tolleranza dichiarata e ricadeva sulla tipica in silenzio; stessa famiglia del bug di `rapportoGiornata` in Campo, trovato lo stesso giorno con lo stesso metodo (censimento a doppio punto di chiamata); normalizzato a `null`, non `undefined` (Firestore lancia su un campo `undefined`); nuovo test di wiring con controprova, dopo aver migrato a Conti (`csvClienti`) l'OTTAVO scrittore del vocabolario condiviso di P2 — e la CORREZIONE di un errore ripetuto tre volte: `csvClienti` non ha mai avuto una collisione di nome su `stato` (a differenza di `csvGare`, con cui era stato scartato "per contagio" senza un `grep` separato); `fido` è il campo che D1 misurava «assente (ok)», tredicesima colonna, restano davvero irraggiungibili solo `csvGare`/`csvSquadre`/`csvAzioni`, dopo aver migrato a Sentinella (`csvTarature`) il settimo scrittore del vocabolario condiviso di P2 — l'ultimo dei sei candidati liberi di D1 (allora creduti quattro, poi corretti a tre); settima colonna, prima fetta, dopo aver migrato a Conti (`csvListino`) il sesto scrittore del vocabolario condiviso di P2 — `prezzo` è il campo per cui D1 misurava una riga persa, stesso binario di Terra e degli incassi; sesta colonna, prima fetta; sei scrittori su undici, più della metà, dopo aver migrato a Sentinella (`csvRicettori`) il quinto scrittore del vocabolario condiviso di P2 — la prima volta che la riga non sparisce mai senza il valore misurato (un ricettore senza distanza resta un ricettore); scartati come candidati `csvClienti` e `csvGare` perché avevano già una colonna chiamata `stato` con un significato diverso; undicesima colonna, prima fetta, dopo aver migrato a Conti (`csvPesate`) il quarto scrittore del vocabolario condiviso di P2 — la prima volta con un TERZO codice: `pesiPesata` (riusata, non riscritta) distingue già un peso completo da uno letto a metà (un solo dei due, lordo o tara — `illeggibile`, un ticket guasto) da nessun peso (`mai-misurato`), tre stati genuinamente diversi; ventunesima colonna, prima fetta, dopo aver migrato a Conti (`csvIncassi`) il terzo scrittore del vocabolario condiviso di P2 — scelto invece di `csvPesate` perché più semplice (quattro colonne, un solo campo scartabile), stesso binario misurato/mai-misurato su `importo`, quinta colonna, prima fetta, dopo aver migrato a Terra (`csvRilievi`) il secondo scrittore del vocabolario condiviso di P2 — a differenza di Flotta, che aveva già i due stati scritti a mano, qui il modello non distingueva nessuna ragione per un volume mancante, quindi il binario resta lo stesso (misurato/mai-misurato); ottava colonna, prima fetta (solo lo scrittore, `parseRilieviCsv` resta posizionale e compatibile con i file vecchi), aggiornata anche `CSV_TABELLE` in `dw-shell.js`, dopo aver aggiunto in `shared/dw-ponti.js` il vocabolario condiviso di P2 (docs/RICERCA_CONTINUA_ASSENZA.md §4) — sei costanti (`STATO_CELLA_*`) per dire PERCHÉ una cella di un CSV è vuota o vale zero per convenzione, non solo CHE lo è; prima fetta: un solo scrittore migrato, `csvRicambi` di Flotta, che P4 aveva già trovato scritto con le stesse due parole a mano — il rischio che una seconda copia dello stesso vocabolario nasca da una firma troppo stretta era già lì, pronto a mordere il prossimo scrittore; gli altri dieci CSV restano il passo successivo, dopo aver corretto in Campo un buco di CABLAGGIO trovato con una lettura diretta del sorgente (nessun agente): il rapporto di fine turno STAMPATO E FIRMATO (`rapportoGiornata`, wired il 15/09 con la sezione "Volate del giorno", provata a fondo come funzione pura) non riceveva mai `volateSentinella` dalla pagina — diceva SEMPRE "Sentinella non raggiungibile", anche col ponte P6 che aveva letto dati veri — mentre il documento gemello `testoConsegnaTurno` lo riceveva già; il controllo di cablaggio che esisteva per questa chiamata guardava solo l'inizio della riga e non l'aveva mai visto, rinforzato per nominare esplicitamente il parametro; dopo una revisione di qualità sulla stessa unità: `csvRegistroInfortuni` e `fogliaCartella` non portavano la nota della denuncia INAIL che lo schermo già mostrava — la settima colonna del CSV era un `?:` che poteva dire un solo avviso alla volta, e ora compone un elenco (`note`, unito con " · ", la stessa forma dello schermo) invece di sceglierne uno tacendo gli altri; `csvRegistroInfortuni` guadagna anche un `oggi` iniettabile (prima usava `new Date()` fisso, non testabile a una data precisa), dopo aver aggiunto a Scudo (dal delta della ricerca continua sulla scadenza della denuncia INAIL, D.P.R. 1124/1965 art. 53, testo verificato via WebSearch) `scadenzaDenunciaInail`: due termini diversi da due basi diverse — 2 giorni dalla ricezione del certificato medico (`dataCertificato`, campo nuovo) per il caso ordinario (oltre 3 giorni di assenza), 24 ore dall'evento per il caso mortale. Il termine mortale è dichiarato come MASSIMO, non preciso: Scudo registra solo il giorno dell'infortunio, non l'ora, quindi non si può contare un termine in ore — si tiene il caso peggiore (il giorno dopo) e lo si dice. Applica anche la decisione 17 (l'assenza non è un dato favorevole) a un obbligo legale: una prognosi ancora aperta (`giorniAssenza: null`) non è "non dovuta", è "non si sa ancora" — due `motivo` diversi per due `null` diversi, non lo stesso "da valutare" indistinto. Wired nel registro degli eventi (nota testuale, non badge: la barra dei comandi è già piena) e nel modale di analisi; tre campi nuovi nel form di registrazione (`dataCertificato`/`denunciaData`/`denunciaNumero`) — nessun modo di tornarci sopra DOPO la registrazione, il registro è di sola aggiunta: un limite dichiarato, non nascosto. Verificato anche nel browser (`tests/browser/scudo-denuncia-inail.mjs`: i casi reali della dimostrazione, i2/i7/i9 con "manca il certificato" e i8 con "prognosi aperta" — le due ragioni non si scambiano mai), dopo aver costruito il ponte Campo→Sentinella (sovrapposizione 3g di `docs/MAPPA_ECOSISTEMA.md`, cercata il 15/09): `meteoDelGiorno` (in `shared/dw-ponti.js`, perché guarda la forma del dato di Campo) traduce i turni meteo di un giorno in `{pioggia, ventoForte}` — `pioggia` solo se TUTTI i turni di quel giorno sono d'accordo (altrimenti `null`, mai dedotta a caso), `ventoForte` è **sempre e solo** un sospetto qualitativo perché Campo non sa dare un numero in m/s, mai un verdetto. `ponteCampo()` in `sentinella-data.js` (stessa forma di `ponteScudo`, stessa esclusione dalla copertura) fa da async fetch; `misuraFuoriCondizioni` accetta un terzo argomento opzionale e retrocompatibile — un dato misurato in loco vince sempre su uno dedotto dal turno di Campo, e il confronto resta per GIORNO, non per l'istante della misura (Sentinella non registra il turno), dichiarato sempre nella frase mostrata all'utente. Wired su un solo punto di consumo (la riga della lettura), CSV ed export invariati di proposito. Non testabile end-to-end nel browser demo per lo stesso motivo di `ponteScudo`/`AZI` (in demo il ponte torna sempre "non leggibile"): verificato con test puri su `meteoDelGiorno` e `misuraFuoriCondizioni`, più un controllo sul cablaggio nel sorgente della pagina, dopo aver aggiunto a Terra (ultimo delta del tredicesimo giro di ricerca continua) `serieAnni` dentro `banchiDaSempre`: il totale «almeno 62.700 m³» diceva CHE un banco non è stato misurato in tutti gli anni della finestra, non DOVE — il modulo calcolava già il valore anno per anno dentro il proprio ciclo di somma e lo buttava via all'uscita. Prima fetta: solo il valore misurato/non misurato per anno, niente `statoProgettuale` né `volumePianificato` per banco (non esiste nel modello un'entità "banco" con un ciclo di vita proprio — decisione architetturale non presa qui, di proposito, per non scriverla di sfuggita). Nella sezione «Lo stesso banco, da sempre» della Denuncia, sotto il totale, compare la riga anno per anno (mostrata solo con più di un anno in finestra). Verificato anche nel browser (`tests/browser/terra-banchi-serie-anni.mjs`: la riga del banco 2 deve riportare ESATTAMENTE 2024 non misurato, 2025 22.000 m³, 2026 40.700 m³ — la stessa serie che il totale aggregato già dichiarava, non un secondo conto), dopo aver aggiunto a Terra (quinto dei sei delta dello stesso giro di ricerca, parente di `sequenzaLotto`) `aperturaFuoriProgramma`: un lotto può dichiarare `aperturaPrevista: "AAAA-MM"`, e la funzione confronta quel mese col vero `apertoIl` — non con l'avanzamento di un altro lotto (quello è `sequenzaLotto`), col CALENDARIO del progetto. `verso` usa un vocabolario diverso apposta ("anticipo"/"ritardo", non "avanti"/"indietro" di `varianzaLottoAnno"): una data non è un volume. Nella dimostrazione il Lotto 4, previsto per novembre 2023, è stato aperto a maggio 2024 — 183 giorni di ritardo, il caso più comune in cava (un'autorizzazione, un accesso). Verificato anche nel browser (`tests/browser/terra-apertura-programma.mjs`), dopo aver aggiunto a Sentinella (dal delta della ricerca continua, nono giro — escalation sui superamenti ripetuti, verificato indipendentemente sul codice vero prima di scrivere: `statPeriodo`/`confrontoMesi`/`andamentoRicettore` non sommano mai i superamenti di TUTTI i punti di un ricettore su una finestra mobile) `superamentiUltimiGiorni`: conta gli episodi sopra la soglia EFFICACE (quella del ricettore, non quella grezza del punto) di tutti i punti di un ricettore in una finestra mobile, e dichiara un `pattern` quando raggiungono la soglia — un parametro, non un numero cablato, perché nessuna fonte del mondo ne dà uno universale. La frase entra nella bozza dell'azione correttiva («è il 3° superamento negli ultimi 30 giorni su questo ricettore») e un badge compare nel ponte, entrambi silenziosi finché non c'è un pattern vero. Il caso non è nella dimostrazione reale (zero superamenti aperti oggi, misurato) — forzarlo su V2 avrebbe rotto la sua dimostrazione dedicata (la soglia del ricettore, 20 mm/s, vince su quella del punto, 5) — quindi verificato nel browser iniettando un punto apposta (`tests/browser/sentinella-escalation-superamenti.mjs`), mai sul file su disco, dopo aver aggiunto a Terra (stesso giro di ricerca) `sequenzaLotto`: `lotto.ordine` esiste da sempre ma non era mai usato in nessun controllo, solo mostrato nel verbale — un lotto può dichiarare `dipendeDa: {lottoId, percentuale}`, e la funzione dice (non blocca: Terra non ha un bottone "apri" distinto dal form generico) se è stato aperto rispettando la soglia sul lotto precedente, con la stessa forma `{pertinente, frase}` già usata da `attesaCollaudo`/`attesaRecupero`. Due stati nella dimostrazione, di proposito: il Lotto 5 è fuori sequenza (aperto prima che il Lotto 4 raggiungesse l'80%, oggi al 34,8%), il Lotto 6 la rispetta — verificato anche nel browser (`tests/browser/terra-sequenza-lotto.mjs`: il badge "fuori sequenza" e la frase devono riportare ESATTAMENTE la percentuale calcolata dal modulo), dopo aver aggiunto a Terra (dal delta della ricerca continua, sequenziamento multi-anno, verificato indipendentemente prima di scrivere codice) `varianzaLottoAnno`/`volumePianificatoLottoAnno`: `varianzaMensilePiano` è aggregata su TUTTI i lotti insieme, quindi non dice QUALE lotto sta slittando — un ritardo sul Lotto 3 si nasconde dietro un Lotto 1 in anticipo. Il nuovo campo opzionale `lotto.volumiAnnuali` porta il piano per anno, e il confronto riusa `volumeMisuratoDiLotto` filtrando i rilievi sull'anno invece di riscrivere il ponte lotto→fronte→rilievo — prima fetta: un solo lotto della dimostrazione (`lo4`) dichiara il piano, gli altri cinque restano silenziosi (campo nuovo, nessun numero inventato), il form per scriverlo dagli altri lotti resta il passo successivo — verificato anche nel browser (`tests/browser/terra-piano-lotto-anno.mjs`: la riga del lotto deve mostrare ESATTAMENTE il verso e lo scarto calcolati dal modulo, non un numero riscritto nella pagina), dopo aver aggiunto a Scudo (dal delta della ricerca continua, tema segnalato tre volte — luglio, 09/08, 16/09 — mai colmato prima d'ora) il fascicolo macchina: entità `attrezzature/{id}` (tipo/modello/matricola/costruttore/anno) collegata alla verifica periodica tramite `attrezzaturaId`, con `attrezzaturaDiScadenza` a distinguere «non ancora collegata» da «collegamento rotto» (un id che non trova più niente perché l'attrezzatura è stata tolta dall'anagrafica) e `descriviLegameAttrezzatura` a scriverne la frase — prima fetta: la verifica periodica già esistente si arricchisce (tendina di collegamento + nota viva con matricola/costruttore/anno), un form di censimento dedicato resta il passo successivo — verificato anche nel browser (`tests/browser/scudo-verifica-periodica.mjs`, esteso: la tendina deve mostrare il legame salvato e il salvataggio deve persistere alla riapertura, non solo mostrare la selezione fatta), dopo aver aggiunto a Scudo (dal delta della ricerca continua, dodicesimo giro) il preset `rischio-chimico` (gemello di `rumore-vibraz`, titolo IX D.Lgs 81/08) e il tipo di documento «Scheda dati di sicurezza (SDS)» — prima fetta: entrano nel ciclo di vita generico già esistente (scadenzario, valido/da rivedere/scaduto), i campi propri (sostanza, classificazione, data di revisione) restano il passo successivo — dopo aver aggiunto a Scudo (dal delta della ricerca continua, dodicesimo giro — "notifiche automatiche", primo passo senza server) `notificheScadenzeNonLette`: un contatore di scadenze urgenti che RESTA acceso finché la pagina Scadenze non si visita, non solo mentre la si guarda — "nuova" non è un campo salvato, si deduce confrontando `livelloScadenza` alla data dell'ultima visita (un solo timestamp, `impostazioni.scadenzeVisteIl`) con quello di oggi, senza dover storicizzare ogni scadenza — verificato anche nel browser (`tests/browser/scudo-notifiche-scadenze.mjs`: il badge deve sparire DOPO la visita, scrivendo il record davvero — un `aggiorna`→`aggiungi` scambiato non lo vedrebbe nessuna suite `node` — e nel farlo si è trovato un difetto CSS reale: `.badge` dichiara `display:inline-flex` con la stessa specificità di `[hidden]{display:none}`, quindi l'attributo `hidden` da solo non nasconde mai il badge — visibile solo misurando il RENDERING, non la proprietà DOM), dopo aver aggiunto a Conti (dal delta della ricerca continua, decimo giro) `statoPianoRientro`: un accordo di pagamento a rate su una fattura scaduta, fra il sollecito e la messa in mora formale — le rate sono una CASCATA (ogni rata copre il cumulato fino a lì, non un incasso a sé), e tre esiti dichiarati (`rispettato`/`in-ritardo`/`decaduto`, mai un "a posto" tacito): "decaduto" solo se la rata in ritardo resta scoperta anche quando scade anche la rata successiva, e allora il residuo torna nell'escalation intera del sollecito. Prima fetta come `componentiDelMezzo`/`sezionePeggiore`: sola lettura (un badge nell'elenco fatture), il form per registrare un piano dalla fattura resta il passo successivo — verificato anche nel browser (`tests/browser/conti-piano-rientro.mjs`: il badge deve comparire sulla fattura GIUSTA, un difetto — il confronto per `id` invece che per `fatturaId` — che nessuna suite `node` può vedere), dopo aver aggiunto a Conti (dal delta della ricerca continua, decimo giro) `statoRecupero`: `livelloSollecito`/`testoSollecito` ricalcolano il livello dal solo ritardo, ogni volta, senza sapere se una lettera è già PARTITA — un log leggero (`fattura.solleciti: [{livello, data, canale}]`) scritto SOLO quando l'utente conferma un invio già avvenuto (bottone "Segna come inviato" accanto a "Sollecito", nessun invio automatico) rende "mai comunicato" uno stato dichiarato invece di un livello zero, e distingue il livello comunicato da quello che il ritardo di oggi implicherebbe — verificato anche nel browser (`tests/browser/conti-solleciti-storico.mjs`: il bottone deve aprire la modale sulla FATTURA GIUSTA, un difetto — l'ID scambiato per il numero — che nessuna suite `node` può vedere, e la registrazione deve sopravvivere alla chiusura della modale), dopo aver aggiunto a Flotta (dal delta della ricerca continua, undicesimo giro — prima fetta) `componentiDelMezzo`/`vitaComponenti`: pneumatici, cingoli e denti benna guadagnano un punto di partenza sulle ore del mezzo, riusando lo schema di `azzeramentiDelMezzo`/`spezzaLetture` — verificato nel browser (`tests/browser/flotta-componenti-vita.mjs`), dove il PRIMO collegamento alla pagina aveva un difetto reale (il filtro per nome mezzo applicato a un elenco già scoperto a un mezzo solo, quindi sempre vuoto) che nessuna suite `node` poteva vedere, dopo aver corretto in Conti (dal delta della ricerca continua, decimo giro) `esitoMovimento`: un pagamento più basso dell'aperto che coincide con lo sconto cassa concordato (`scontoCassa: {pct, giorniEntro}` sulla fattura, `scontoCassaMaturato` la calcola) non è più letto come "è un acconto" — diventa grado `certo` con l'indicazione di registrare anche la nota di credito che chiude davvero la fattura; fuori termine, o senza uno sconto dichiarato, il comportamento resta quello di sempre, dopo aver aggiunto a Scudo (dal delta della ricerca continua, undicesimo giro — ICAM) `barriereRicorrenti`/`BARRIERE_MANCATE`: non «che cosa ha causato l'evento» ma «che cosa avrebbe dovuto fermarlo e non l'ha fatto», sorella di `causeRicorrenti` (stessa guardia di leggibilità, non ricopiata), con un chip multi-select nella modale di analisi (a differenza della causa, che è singola) — verificato anche nel browser (`tests/browser/scudo-barriere-icam.mjs`: il multi-select e la sua persistenza al salvataggio, che nessuna suite `node` può vedere) e con un caso vero già in demo (`an1`/i1, la fascia di rispetto non delimitata che il suo stesso «perché» già descriveva), dopo aver aggiunto a `leggiCsv` (dal delta della riverifica su PAROLE) `nRighe` — il numero di riga FISICO su cui comincia ogni riga logica, che un a capo dentro le virgolette può spostare senza chiudere la riga — e migrati con lei gli ultimi due lettori non standard rimasti (`scudo.scartiAzioniCsv`, `conti.scartiClientiCsv`): la migrazione dei 21 lettori CSV alle righe fisiche, aperta dal delta PAROLE del 15/09, è ora completa, dopo aver aggiunto a Flotta (dal delta della ricerca continua, undicesimo giro, che riprende un gap dichiarato aperto il 15/09) `frequenzaFermiControStoria` — terza sorella di `consumoControStoria`/`costoControStoria`: il RITMO dei fermi (episodi al giorno, non giorni persi) confrontato fra la finestra recente e la storia del mezzo, per accorgersi che un mezzo si guasta più spesso prima che scada un tagliando a soglia fissa — collegata a `prioritaOperative` come terza voce "trend" (badge "Fermi in aumento", tolleranza dichiarata `TOLLERANZA_FERMI_PCT=40`, nessuna fonte di settore per questo numero), dopo aver aggiunto a Conti (dal delta della ricerca continua, decimo giro) `concentrazionePortafoglio` — quanto pesa il cliente più esposto sul credito aperto totale, riusando `esposizioneClienti` invece di ricalcolare il totale una seconda volta, `calcolabile:false` quando il credito aperto è zero — mostrata nella scheda Clienti sotto la lista dell'esposizione, e verificata anche nel browser (`tests/browser/conti-barre-peso.mjs`, sezione 6: la quota scritta nella nota deve essere quella che le righe della lista stessa danno, non una copia ricalcolata a parte), dopo aver migrato anche l'ultima forma standard-nel-verdetto-ma-non-nella-firma rimasta fuori dal quarto lotto — `scartiTelemetriaCsv` di Flotta, che riconosce l'intestazione per NOME di colonna (`mappaTelemetriaCsv`) e non con una parola chiave fissa: il predicato passato a `righeCsvNumerate` chiede «sono la prima riga vista?» invece di «assomiglio a un'intestazione?», e la riga persa senza nome del mezzo torna a essere quella FISICA anche nella forma posizionale senza intestazione riconosciuta (controprova: rimessa la vecchia numerazione per posizione, `riga 5` torna `riga 3` e la prova cade), dopo aver aggiunto a `righeCsvNumerate` (dal delta della riverifica sul documento invecchiato PAROLE, proposta 4 del Blocco 2 — riscontrata identica in tutti e 21 i lettori) il numero di riga FISICO nel file invece della posizione nell'elenco già scartato, e migrati un secondo lotto (`scartiScadenzeCsv`/`scartiInfortuniCsv` di Scudo, `scartiMonitoraggiCsv`/`scartiRicettoriCsv`/`scartiAdempimentiCsv`/`scartiVolateCsv` di Sentinella) un terzo (`scartiSquadreCsv`/`scartiPianoCsv` di Campo, `scartiRicambiCsv`/`scartiMezziCsv` di Flotta) e un quarto (`scartiFattureCsv`/`scartiGareCsv`/`scartiListinoCsv` di Conti — i lettori standard sono ora tutti migrati), dopo aver esteso `righeCsvNumerate` per accettare anche un PREDICATO oltre a una parola chiave (senza cambiare il contratto a stringa per i 18 chiamanti già migrati) e aver migrato con lui `scartiLavoratoriCsv` di Scudo, che riconosce l'intestazione sulla prima cella già scomposta invece che con `isIntestazione` — restano cinque forme non standard basate su celle già parsate invece che su testo grezzo (`scartiAzioniCsv` di Scudo, `scartiTelemetriaCsv` di Flotta, `scartiPesateCsv`/`scartiIncassiCsv`/`scartiClientiCsv` di Conti), dopo aver aggiunto a Genesi (dal secondo giro di ricerca) `burdenPerForo` — il pannello «Burden per foro» sulla scheda Progetto 2D, che elenca il burden vero di TUTTI i fori insieme leggendo `h.burdenVero`/`h.burdenLoc` già scritti da `computeEnergia2D` a ogni rigenerazione della maglia: nessun import, nessun calcolo nuovo, verificato anche nel browser (`tests/browser/genesi-burden-per-foro.mjs`, 11 prove più la controprova), dopo aver riscritto in Sentinella (dal delta della riverifica su PAROLE, proposta 2) la provenienza del periodo di un adempimento al positivo invece che in negazione, e aggiunto a `run-stile.mjs` la regola 33 (proposta 3, metà b) — mai «non rilevato» in nessun testo, perché nei rapporti di prova italiani vuol dire il contrario di «non misurato» — dopo aver corretto in `numeri-nei-documenti.mjs` una regex che smetteva di leggere un modulo condiviso appena la sua copertura saliva sopra il fondo storico (l'ancora di fine riga non ammetteva il testo «(il fondo era N: alzalo)» che `copertura-funzioni.mjs` appende in quel caso — trovato perché `dw-shell.js` è salito da 61/61 a 62/62 nella stessa unità), dopo aver aggiunto a `sezionePeggiore` di Terra (dal delta del sesto giro di ricerca, lacuna 2 sulle sezioni trasversali per fronte, scomposta il 15/09 prima di scrivere codice) la prima fetta — un fronte porta un array opzionale e additivo di sezioni, e con zero sezioni il verdetto ricade identico su `conformitaGeometria`; collegata subito al posto di `conformitaGeometria` in `conformitaProgetto`, senza cambiare nessun contratto quando nessuna sezione è dichiarata (il form a righe ripetibili per scriverle resta la fetta successiva), dopo aver aggiunto a `scartiInfortuniCsv` di Scudo e `scartiMonitoraggiCsv` di Sentinella (dal delta della riverifica sul documento invecchiato ASSENZA) i due ultimi lettori CSV rimasti «muti» — adesso ogni riga scartata si nomina con la sua ragione, e `frasePersi` la appende ai messaggi d'import delle due pagine, dopo aver aggiunto al registro vendite di Conti (dal delta della ricerca su trasporto conto terzi e rese) la causale della nota, già scritta e mostrata altrove ma tenuta fuori dal CSV per il commercialista, a `attesaRecupero` di Terra (dal delta della ricerca sul ripristino progressivo) il gemello di `attesaCollaudo` per la transizione esaurito→recupero iniziato, a `lavoriNonConclusi` di Campo (dal delta della ricerca sulla consegna di turno) la causale e i minuti di un fermo nella riga stampata, non solo nel Pareto interno, a `testoPromemoriaAzione` di Scudo (dal delta della ricerca sulle azioni correttive) lo stesso promemoria manuale già usato per le scadenze dei lavoratori, ma per il responsabile di un'azione correttiva, a `etaMezzo` di Flotta (dal delta della ricerca continua sul TCO) la messa in servizio prima e il possesso come ripiego, mai un'età negativa su una data nel futuro, alla pagella di Flotta il costo orario col possesso portato in riga (già calcolato, mai passato al confronto fra mezzi) senza toccare verdetto o ordine, a `run-kpi` la prova che «saldata» e «parziale» non sono mai vere insieme in `statoFattura` di Conti, a `claims-convergenza` il limite a tre scritture, a `kpiFrom` di Scudo un `oggi` fisso, alla conformità di Terra il fronte conteso fra due lotti, a `tagliandiInScadenza` di Flotta lo stesso criterio di `urgenzaManutenzione`, a `fogliaVolata` di Sentinella la lettura trovata per valore e non solo per (data, ora), a `applicaIncassi` di Conti la cecità alle note di credito, a `cancellazioneLasciaBuco` la numerazione DDT senza salti dichiarata ma non imposta, al margine fra esaurimento e scadenza in `vitaCava` di Terra, alla sospensione temporanea in `abilitazioneLavoratore` di Scudo, a `reclamiPerRicettore` di Sentinella l'aggregazione per punto, a `costoControStoria` di Flotta il costo medio per intervento contro la sua storia, a `varianzaMensilePiano` di Terra lo scarto del mese corrente dal piano annuo, a `prioritaOperative` di Flotta le voci "trend" sul consumo e sul costo fuori tolleranza, a `avvisiChiusuraTurno` di Campo gli avvisi (non bloccanti) sull'appello e sulle attività aperte alla chiusura del turno, a `tendenzaRitmo` di Terra il ritmo corto contro quello lungo, a `testoSollecito` di Conti l'escalation per livello del sollecito, a `fattureOltre90` di Conti l'elenco per il commercialista, a `cartellaLavoratore` di Scudo gli infortuni della persona collegati al fascicolo, a `visitaRientroNecessaria`/`riepilogoInfortuni`/`cartellaLavoratore` di Scudo la visita medica di rientro dopo un'assenza oltre 60 giorni (art. 41 c.2 lett. e-ter), a `GRAVITA_INFORTUNIO`/`infortunioGrave`/`giornateConvenzionali` di Scudo il terzo e quarto gradino di gravità di un infortunio vero coi giorni convenzionali UNI 7249 nell'indice di gravità, a `#inf-list` di Scudo la lettura dell'etichetta di gravità dal vocabolario invece del campo grezzo (trovato da una QA visiva), e alla barra in basso di Sentinella il bottone «Scadenze» al posto di «Adempimenti» (i bersagli di tocco a 320px, misurati con Playwright, sono saliti da 41,4 a 45,61–46,86 px):

> ⚠️ **E quel numero conta NOVE suite, non tutto quello che gira.** Il giro
> `node` completo esegue **4119** asserzioni su **41** comandi — ⚠️ e quel
> numero **NON oscilla a parità di codice**: cambia solo quando cambiano le
> prove (misurato il 17/09 — la stessa apparente "oscillazione" vista quel
> pomeriggio, 4046→4091→4092, era il confronto fra un numero scritto in un
> commit precedente e una misura fresca dopo che il codice era già cambiato,
> non instabilità: tre lanci sullo STESSO commit invariato hanno dato 4092
> tutte e tre le volte), quindi non lo si insegue a mano: lo
> stampa `giro-node.mjs` ogni volta che gira (il
> quarantunesimo comando, dal 16/09, è `prove-grep-scadute.mjs`: rilancia i comandi
> `grep` scritti nei documenti di ricerca continua e confronta l'uscita con
> quella dichiarata — un "non c'è" scaduto in poche ore, non in giorni).
> ⏱️ **Dal 09/08 quel numero non si scrive più a mano: lo stampa il giro**
> (`node apps/deepwork-id/tests/giro-node.mjs`, riga «Asserzioni eseguite dal
> giro»), col suo denominatore accanto — 27 comandi su 41 hanno una riga da
> sommare (dal 15/09 anche `numeri-nei-documenti.mjs`, corretto un difetto suo:
> vedi il suo commento), e gli altri **14 sono nominati** invece che contati.
> ⛔ *E «lo stampa il giro» non bastava: era rimasto **2.757** mentre il giro ne
> eseguiva 2.815 — stale di cinquantotto — perché stamparlo e ricopiarlo a mano
> sono la stessa cosa. Dal 09/08 il giro, dopo aver stampato il totale,* **apre
> questi due documenti e pretende che dicano lo stesso numero**: se no scrive
> quale documento sbaglia e *esce diverso da zero. Un dato si sorveglia dove
> nasce — qui, che è l'unico posto che li ha lanciati tutti; in*
> `numeri-nei-documenti.mjs` *vorrebbe dire rilanciare il giro dentro il giro.*
> ⛔ *Prima era ricopiato a mano e diceva **2.663**, poi **2.728**: il vero è
> 2.757. E il difetto stava anche nel modo di misurarlo — il primo righello
> scritto per automatizzarlo prendeva il **primo** «N passati» dell'uscita di
> ogni comando, e* `orologio-cliente.mjs` *RILANCIA tre suite in ora italiana
> stampandone i riepiloghi: il conto si riprendeva il «1984 passati» di*
> `run-kpi` *una seconda volta e diceva **4741**, gonfiato del 72% da un comando
> solo. È una RIPETIZIONE contata come roba nuova — la stessa famiglia del
> riepilogo del giro del browser — e l'ha presa solo il confronto fra due
> righelli indipendenti. La forma che regge: si legge l'**ultima** riga, cioè il
> verdetto che il comando dà **di sé**.*
> ⚠️ *Fra i 12 non contati ci sono le controprove, che stampano un verdetto
> invece di un totale: girano davvero, e le loro asserzioni sono vere, ma su un
> difetto messo apposta.*
> ⚠️ *Questa nota era ferma al 07/08 e diceva 2.474 e «il numero da citare resta
> 2.251» mentre il titolo sopra diceva già 2.310: il controllo sorveglia il
> **totale**, non la prosa che lo spiega. È la quarta forma di invecchiamento
> raccolta in `CLAUDE.md`.*
> **Il numero da citare resta 3.203**, e la ragione è che le altre dieci contano
> **file, non prove**: `import esistenti` fa un'asserzione per file e `classi
> orfane` una per pagina, quindi il loro totale si muove ogni volta che nasce un
> file — un numero che cresce senza che nessuno abbia scritto una prova è un
> numero che non vuol dire niente. Le sei suite contano **casi**, e per questo
> sono quelle sorvegliate da `numeri-nei-documenti.mjs`.

E **1043 funzioni pure su 1043** sono chiamate per nome da quelle prove: tutte e
sei le app al 100%. Non è «provate bene» — è «non ce n'è nessuna che nessuno ha
ancora guardato», che è il minimo e finora non c'era.

⚠️ **Quel 802 conta le sei app, non i moduli condivisi**, e la riga di riepilogo
lo dice («in 6 app»). I condivisi si contano a parte — **343 su 343** in cinque
moduli: `dw-shell.js` **62/62**, `dw-ponti.js` **97/97**, `genesi-data.js` **170/170**, `genesi-formato.js` **9/9**, `pointcloud.js` **5/5**. Vanno guardati
con più attenzione delle app, non con meno: una funzione sbagliata lì sbaglia in
sei posti insieme.
⏱️ **Questi sei numeri sono invecchiati due volte in due giorni, e la seconda
volta sotto la riga che spiegava perché sarebbe successo.** Prima erano fermi a
«593 · 23/23 · 31/31 · 5/5», cioè a un perimetro di **tre** moduli; corretti
l'08/08 a «142 · 46/46 · 46/46 · 37/37», l'09/08 erano di nuovo falsi in cinque
valori su sei (165 · 47/47 · 47/47 · **58**/58). E accanto c'era scritto: *«il
controllo sorveglia il totale delle app, non questa scomposizione: rimisurati a
mano»*. **Dichiarare un punto cieco non lo illumina** — è la stessa lezione
della tabella di Genesi qui sopra, nello stesso documento, lo stesso giorno.
Da adesso li sorveglia `numeri-nei-documenti.mjs`, **modulo per modulo**, con
l'elenco dei moduli **derivato dall'uscita del censimento**: un modulo condiviso
nuovo entra da sé, e non c'è nessun elenco a mano che possa non sapere che
esiste.

⛔ **E il 100% vale per il perimetro misurato, non per tutto il prodotto.**
Le sei app hanno la loro logica in `apps/<nome>/<nome>-data.js`, che `node`
importa. **Genesi no**: le sue **136 funzioni** stanno dentro
`apps/genesi/genesi.html`, e da lì non si importano — di Genesi entrano nel
conto solo i moduli già tirati fuori (`pointcloud.js`, `genesi-formato.js`,
`genesi-data.js`, elencati con i loro conti nella tabella dei condivisi qui
sopra). ⏱️ *Fino al 09/08 questa riga diceva «entra solo `pointcloud.js`», ed
era vera il 01/08: gli altri due sono nati dopo. Terza riga dello stesso
documento invecchiata nella stessa giornata, e la sola difesa che ha funzionato
è stata un censimento che conta i numeri dichiarati e guarda quanti ne
sorveglia una regola.* Non è una svista da correggere in una riga — ma dal
01/08 «è un cantiere intero» ha smesso di essere una frase ed è diventato un
**numero**, perché una frase non dice da dove si comincia né quanto si è
avanzati. `node apps/deepwork-id/tests/genesi-estraibili.mjs` misura quante
funzioni si possono portare fuori **senza cambiargli la firma**:

| variabili del modulo che legge | funzioni |
|---|---|
| nessuna — si porta fuori com'è | **23** |
| una o due | **39** |
| da tre a cinque | 17 |
| da sei a dieci | 18 |
| più di dieci — lì è un rifacimento | 39 |

Cioè **47 su 136 si estraggono senza rifare il modo in cui Genesi tiene il suo
stato**, e le restanti 89 sono una decisione di architettura.
⏱️ *49→48, 57→56 e 143→142 il 14/09 (B3, stesso giorno): `_snapXY(D2, v)`,
l'ultimo "legame di una riga" rimasto nel blocco G34 (l'aggancio opzionale
alla griglia) — componeva solo `snapAGriglia` già pura. Dieci punti di
chiamata nella pagina, tutti dentro gli event handler del mouse dell'editor
2D, tutti aggiornati a passare `D2` (sostituzione globale sicura: `_snapXY(`
non compare in nessun altro contesto). Nessun wrapper lasciato. Stesso
margine dello strumento già visto su `activeProf`: `d2Move` guadagna
`renderInspector` nel proprio elenco "chiama" (chiamata presente nel suo
corpo da sempre, prima mascherata da `_snapXY`) — bucket "3-5" invariato.*
⏱️ *48→47, 56→55 e 142→141 il 15/09 (B3, cantiere ripreso dopo la misura
sul costo di `selRoccia`/`selEsplosivo`/`selInnesco`, vedi checkpoint
`20260914-234319`): `computeInnesco2D(D2)`. Il G39 del 14/09 aveva già
estratto `innescoSuMaglia`, ma aveva lasciato in pagina il legame a zero
argomenti — stessa forma di `computeEnergia2D`/`computeRelief2D` prima di
loro, e nessuna ragione strutturale per fermarsi un passo prima: unico
chiamante (`computeSeq2D`) già con `D2` in scope. Non lascia un wrapper
(era già zero-arg, ora è un'importazione). Difetto iniettato provato e
rimesso: uno scambio S/B è invisibile per costruzione (usati solo dentro
un `Math.max` simmetrico); il difetto verificabile è sulla sorgente dei
fori. Unico effetto collaterale: `computeSeq2D` perde `computeInnesco2D`
dal proprio elenco "chiama" (stessa famiglia già vista su
`computeEnergia2D`/`computeRelief2D`).*
⏱️ *47→46, 55→54 e 141→140 il 15/09 (B3, stesso giorno): `_sigDetTimes`
è uscita del tutto dalla pagina (nessuna funzione nuova nel modulo:
componeva SOLO `tempiDetonazione(D2)`, già esattamente la forma che
`genesi-data.js` espone dal G23 del 10/09 — un alias senza logica
propria, come `sitoStore`). I suoi due chiamanti (la modale del PPV
composito, il nome del file esportato) chiamano `tempiDetonazione(D2)`
direttamente. Nessuno spostamento di bucket per altre funzioni,
misurato confrontando `--elenco` prima/dopo.*
⏱️ *46→42, 54→50 e 140→139 il 15/09 (B3, stesso giorno): `mdlProfSnap`
è uscita del tutto dalla pagina (nessuna funzione nuova: componeva SOLO
`scattoProfili(P.profilo, D2.piede)`, già pura dal blocco G30 dell'11/09).
I suoi tre chiamanti (`mdlPushUndo`, `mdlUndo`, `mdlRedo`, la stessa
famiglia undo/redo del modello 3D) chiamano `scattoProfili` direttamente.
⚠️ **Effetto collaterale reale, non un margine dello strumento**: i tre
chiamanti leggevano `mdlUndoStack` (e `mdlRedoStack`/`MDL_UNDO_MAX`) e
basta — `P`/`D2` restavano dentro `mdlProfSnap()`, quindi mascherati.
Inlineando la composizione dentro i loro corpi, `P` e `D2` diventano
letture dirette e tutti e tre salgono dal bucket "1-2" al "3-5" (bucket
"1-2" 46→42, "3-5" 14→17: −4 e +3, non −1 e +0 come nelle unità
precedenti). Misurato confrontando `--elenco` prima/dopo su una
worktree, non dedotto.*
⏱️ *42→41, 50→49 e 139→138 il 15/09 (B3, stesso giorno): `crestZ` è
uscita del tutto dalla pagina (nessuna funzione nuova: componeva SOLO
`quotaCresta(P.profilo, x)`, già pura dal blocco G24 del 10/09). I sei
chiamanti — sparsi su funzioni non correlate (la scheda dei fori, la
sincronizzazione 3D del modello, l'esportazione del piede) — chiamano
`quotaCresta(P.profilo, x)` direttamente. A differenza di `mdlProfSnap`,
nessuno spostamento di bucket per altre funzioni: i sei chiamanti
leggevano già altre variabili proprie in numero sufficiente da non
cambiare scaglione con l'aggiunta di `P`, misurato confrontando
`--elenco` prima/dopo.*
⏱️ *41→40, 49→48, 168 su 168 condivisi (era 167) e 138→137 il 15/09
(B3, stesso giorno): `measureGeom2D(design)`. Il G35 del 13/09 aveva
già estratto `misuraGeom2D` ma lasciato in pagina il legame a zero
argomenti — sette punti di chiamata, tenuto per il nome corto invece
di ripetere tre campi ad ogni chiamata. Nessuna ragione per lasciarlo
in pagina: stesso nome, salito nel modulo con lo stato come primo
argomento esplicito. Difetto iniettato provato e rimesso: uno scambio
dei due campi nel composer si vede SOLO nel caso senza fori (con fori
veri la spaziatura si ricalcola dalle posizioni, stessa famiglia di
`_spazTipico`/`computeInnesco2D`), catturato dal test dedicato.
Nessuno spostamento di bucket per altre funzioni: i sette chiamanti
leggevano già abbastanza altre variabili di modulo, come per `crestZ`
e a differenza di `mdlProfSnap`, misurato confrontando `--elenco`
prima/dopo.*
⏱️ *40→39, 48→47 e 137→136 il 15/09 (B3, stesso giorno): `interpFronte`
è uscita del tutto dalla pagina
(nessuna funzione nuova: componeva SOLO `interpProf(D2.profilo, mx)`,
già pura dal blocco G9 del 09/08). Il legame più grande chiuso finora
per punti di chiamata (sedici, sparsi su funzioni di rendering non
correlate — il disegno 2D, la mappa dell'energia, la rete di
collegamento, l'editor del piede), sostituito con uno script Python
di replace globale (sicuro: la sottostringa non compare altrove,
confermato con `grep -c` prima e dopo). Nessuno spostamento di bucket
per altre funzioni, misurato confrontando `--elenco` prima/dopo: i
sedici chiamanti erano già in buckets più alti. Resta deferred il
gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46 punti di chiamata,
quasi tre volte questo).*
⏱️ *52→49, 60→57 e 146→143 il 14/09 (B3, stesso giorno): TRE funzioni uscite
insieme — `activeProf(D2)`, `d2HitTest(D2, px, py)`, `d2HitTestPt(D2, px, py)`
— perché `d2HitTest`/`d2HitTestPt` compongono `puntoTela`/`indicePiuVicino`
già pure e `d2HitTestPt` compone anche `activeProf`: non potevano cambiare
firma separatamente. `activeProf` è la prima fetta di B3 senza una funzione
pura preesistente da comporre — calcola direttamente da `D2.tool`, pura di
suo. `d2HitTest` sostituisce `interpFronte(mx)` (wrapper di pagina, resta:
sedici altri punti di chiamata) con `interpProf(D2.profilo, mx)` diretto,
come già per G41. Nessuna delle tre lascia un wrapper: sei punti di chiamata
in tutto.
⚠️ Effetto collaterale nel censimento, non un bucket-shift: `d2Move` mostra
`computeSeq2D` nel proprio elenco "chiama" dove prima non compariva — quella
chiamata è nel suo corpo da sempre (riga non toccata da questa unità), il
censimento la vedeva mascherata mentre elencava `activeProf`. Margine noto
dello strumento, non un difetto di questa fetta.*
⏱️ *54→52, 62→60 e 148→146 il 14/09 (B3, stesso giorno): DUE funzioni
indipendenti in un'unica unità — `_spazTipico(D2, H)` (componeva solo
`spaziaturaTipica` già pura dal blocco G24) e `innTaglioOk(D2, dt)`
(componeva solo `taglioRealizzabile` già pura dal blocco G25). Non
accoppiate come `scatterMs`/`computeRelief2D`: erano semplicemente gli
ultimi due "legami di una riga" rimasti nei rispettivi blocchi. Nessuna
delle due lascia un wrapper (tre punti di chiamata in tutto). Nessuno
spostamento di bucket per altre funzioni.*
⏱️ *55→54, 15→14, 63→62 e 150→148 il 14/09 (B3, stesso giorno): DUE funzioni in un'unica
unità, perché accoppiate — `scatterMs(D2)` (dal bucket "3-5": un falso
positivo del censimento, leggeva solo `D2` più tre parole corte di un
commento vicino) e `computeRelief2D(D2)` (dal bucket "1-2"), che chiama
`scatterMs` e quindi non poteva cambiare firma da sola. Componevano solo
`scatterInnesco`/`reliefSuMaglia` già pure. Nessuno dei due lascia un
wrapper (tre punti di chiamata in tutto, tutti aggiornati a passare `D2`).
Unico effetto collaterale reale: `computeSeq2D` perde `computeRelief2D`
dal proprio elenco "chiama" (stessa famiglia di `computeEnergia2D`).*
⏱️ *56→55, 64→63 e 151→150 il 14/09 (B3, stesso giorno): `isoPasso`, stesso
schema (`isoPasso(D2)`), componeva solo `passoIsocrone` già pura dal blocco
G24 (10/09) — come `computeEnergia2D`, esce DEL TUTTO dalla pagina (nessun
wrapper: due punti di chiamata, entrambi aggiornati a `isoPasso(D2)`).
Nessuno spostamento di bucket per altre funzioni.*
⏱️ *57→56, 65→64 e 152→151 il 14/09 (B3, stesso giorno): `computeEnergia2D`
è uscita dalla pagina DEL TUTTO (non lascia un wrapper: era void, un solo
punto di chiamata dentro `computeSeq2D`), stesso schema
(`computeEnergia2D(D2)`), componeva solo `energiaSuMaglia` già pura dal
blocco G41 (14/09). Unico effetto collaterale misurato confrontando
`--elenco` prima/dopo: `computeSeq2D` perde `computeEnergia2D` dal proprio
elenco "chiama" (non è più una funzione della pagina, è un import) —
nessuno spostamento di bucket vero.*
⏱️ *58→57, 66→65 e 153→152 il 14/09 (B3, stesso giorno): `reliefCls` è
uscita dalla pagina, stesso cambio di firma (`reliefCls(D2, r)`).
Componeva solo `classeRelief`, già pura in `genesi-data.js` dal blocco G26
(10/09) — la prima volta che B3 tocca un "legame di una riga" già marcato
"resta come legame" da un cantiere precedente, invece di uno senza quel
commento: la nota descriveva l'architettura di quel momento, non un
divieto a finire l'estrazione dopo. I suoi due chiamanti (`drawDesign2D`,
`renderInspector`) leggono già `D2` per conto proprio: nessuno spostamento
di bucket, misurato confrontando `--elenco` prima/dopo su una worktree.*
⏱️ *59→58, 67→66 e 154→153 il 14/09 (B3, stesso giorno): `pieDev` è
uscita dalla pagina, stesso cambio di firma (`pieDev(D2, x)`). Effetto
collaterale VERO, non rumore dello strumento: `mdlBuild` (che la
chiama) è passata dal bucket "sei-dieci" a "più di dieci" (19→18,
38→39) perché ora scrive `D2` esplicitamente nella chiamata — quel
token è nel suo corpo per davvero, non nel commento di qualcun altro.
Misurato confrontando `--elenco` prima/dopo: è l'unica funzione che ha
cambiato bucket.*
⏱️ *60→59, 68→67 e 155→154 il 14/09 (B3, cantiere del trasloco di Genesi,
ripreso dopo G47): `pfNominale` è uscita dalla pagina, con CAMBIO DI
FIRMA (`pfNominale(D2)` invece di leggere `D2` dalla chiusura) — lo
stesso schema già usato per ogni altro "legame di una riga" di questa
fascia. Componeva solo due funzioni già pure (`consumoSpecifico`,
`volumeForo`, già in `genesi-data.js`): nessun calcolo nuovo, solo
l'argomento esplicito. I cinque punti che la chiamavano nella pagina
passano ora `D2`.*
⏱️ *61→60, 18→19 e 69→68 il 14/09 (G47d, ULTIMA fetta di G47), e come per
G47a QUESTA VOLTA NON È UN CANTIERE VERO: `d2Snap` (una riga, legge solo
`D2` davvero) è finita nel bucket "sei-dieci" perché il commento italiano
appena scritto sopra di lei contiene le parole «dxf», «pts», «e», «a»,
«lo» — lo stesso margine accettato dello strumento già misurato su G47a.
`d2Down`/`drawDesign2D` hanno guadagnato "tratti" nel loro elenco per la
stessa ragione (il commento su G47d nomina "tratti" più volte). 155 non
cambia: nessuna funzione nuova, solo tre lette come se leggessero più
variabili di quante ne leggano davvero.*
⏱️ *60→61, 68→69 e 154→155 il 14/09 (G47b): una funzione nuova
(`syncStratiUI`, i livelli veri — mostra/nascondi/blocca per entità,
non i vecchi interruttori di un calcolo).*
⏱️ *59→60, 67→68 e 153→154 il 14/09 (G47c-2): una funzione nuova
(`syncTrattoUI`, la primitiva di disegno libero — tratti/polilinee senza
la semantica di prodotto di foro/fronte/piede), anche lei nel bucket
"una o due" (legge poco `D2`/`D2.tratti`).*
⏱️ *53→59, 61→67 e 147→153 il 14/09 (G47c-1): sei funzioni nuove
(`d2Snap`, `d2BtnSync`, `d2PushUndo`, `d2ApplySnap`, `d2Undo`, `d2Redo`),
l'annulla/ripristina per l'editor 2D che l'editor di modellazione 3D già
aveva (`mdlUndo`/`mdlRedo`) e l'editor 2D no. Tutte e sei nel bucket "una
o due": leggono poco stato del modulo (soprattutto `D2` e le due pile
`d2UndoStack`/`d2RedoStack`, dichiarate lì per lì), quindi si estraggono
senza rifare niente — il 86 (le funzioni che sono una vera decisione di
architettura) non si tocca.*
⏱️ *19→18 e 37→38 il 14/09 (G47a, prima fetta di "Genesi simile a un CAD" —
il fondatore ha risposto "tutto" alla domanda di chiarimento), e QUESTA VOLTA
NON È UN CANTIERE VERO: è il margine accettato dello strumento stesso
(intestazione di `genesi-estraibili.mjs`, "contenuto di stringa o commento
scambiato per una dipendenza da variabile del modulo"). Misurato confrontando
l'elenco `--elenco` prima/dopo in una worktree su HEAD: il commento italiano
aggiunto contiene 4 volte la parola «da» e il codice dichiara 5 volte `dy`
(il nome del nuovo campo "spalla") — due token corti che lo strumento tratta
come nomi di variabili del modulo ovunque compaiano nel testo, non solo dove
sono davvero letti. Sette funzioni lontanissime dal punto toccato
(`riconRender`, `_riconCampoHtml`, `sitoRender`, `applyDesign`,
`_riconForiHtml`, `sentRender`, `drawIsocrone2D`, `salvaVolata`,
`rockTextures`, `drawInnesco2D`, `flyrockInv`…) hanno guadagnato "da" o "dy"
nel proprio elenco di letture senza che una sola riga del loro corpo sia
cambiata — la riga numeri è la stessa, solo spostata più in basso nel file.
61 non si tocca: nessuna funzione ha cambiato bucket per una ragione vera.*
⏱️ *38→37 il 14/09 (G42), stesso giorno, ULTIMA fetta del gruppo:
`computeSeq2D` è diventata un legame di poche righe (`sequenzaSuMaglia` è
salita in `genesi-data.js`), settima volta sulla stessa famiglia di falso
positivo di G39/G40/G41. Il 60 sale a 61 per la stessa ragione.*
⏱️ *39→38 il 14/09 (G41), stesso giorno: `computeEnergia2D` è diventata un
legame di una riga (`energiaSuMaglia` è salita in `genesi-data.js`), sesta
volta sulla stessa famiglia di falso positivo di G39/G40. Il 59 sale a 60 per
la stessa ragione (bucket "più di dieci" → "una o due").*
⏱️ *20→19 il 14/09 (G40), stesso giorno: `computeRelief2D` è diventata un
legame di una riga (`reliefSuMaglia` è salita in `genesi-data.js`), stessa
famiglia esatta di G39 appena sopra. Il 59 sale di uno per la stessa ragione.*
⏱️ *21→20 il 14/09 (G39): `computeInnesco2D` è diventata un legame di una
riga (`innescoSuMaglia` è salita in `genesi-data.js`), e il legame stesso
legge una sola variabile del modulo — scivolato da "sei-dieci" a "una o
due". Il 58 sale di uno per la stessa ragione.*
⏱️ *22→21 e 38→39 il 14/09: `genMaglia2D` ha guadagnato una variabile del
modulo in più (la dichiarazione della maglia assente, G37/B0-septies) ed è
scivolata da "sei-dieci" a "più di dieci". Il 57 non cambia: le due colonne
che lo formano restano ferme.*

✅ **13/09 (G34): 147 → 148.** `_snapXY`, l'aggancio opzionale alla griglia nel
Progetto 2D (disegno di precisione — secondo pezzo di "tutte e tre le
alternative"), è nuova nella pagina e legge due variabili del modulo
(`D2.snap`, `D2.snapPasso`): cade nel bucket "una o due" e alza sia il totale
sia gli estraibili (55 → 56).

✅ **13/09 (G35), stesso giorno: `measureGeom2D` è salita in genesi-data.js
come `misuraGeom2D`.** Il totale nella pagina resta 148 (il wrapper c'è
ancora, una riga sola), ma la sua forma ridotta a `return
misuraGeom2D(D2.holes, D2.S, D2.B);` sposta il conteggio del censimento
statico dal bucket "3-5" (dove viveva per un falso positivo del
tokenizzatore sulle variabili locali `o`/`minx`) al bucket "una o due" (17→16,
48→49): il totale estraibile sale di uno (56→57), perché il wrapper stesso è
ormai un legame di una riga.

✅ **13/09 (G36), stesso giorno: `_puntiNuvola` è salita in genesi-data.js
con lo stesso nome, senza lasciare un wrapper.** Non leggeva `D2` per
niente: il censimento la marcava legata a nove variabili del modulo
(«lo, conta, c, locale, n, riga, a, si, su») per lo stesso falso positivo
già preso tre volte su questo file — lettere e parole dentro le sue
STRINGHE («nel ritaglio», «caricati», «disegnati su») e nei suoi commenti.
Effetto: il totale nella pagina scende **148 → 147** (nessun wrapper resta,
l'import la sostituisce), il bucket "6-10" scende **23 → 22**, gli
estraibili restano **57** (non erano mai stati contati lì: una funzione
tolta dalla pagina non è più "da estrarre", è già uscita).

⚠️ **13/09, stesso giorno: `d2Down` passa dal bucket "3-5" a "11+" per un
commento, non per il codice.** Aggiungendo la memoria dell'ultima selezione
(`D2.selPrev`, per la misura fra due fori qualunque — vedi G34quinquies in
`genesi.html`) è entrato anche un commento esplicativo di sei righe: il
tokenizzatore del censimento conta le parole sull'indentazione, non
distingue prosa da codice, e alcune parole del commento sono finite lette
come variabili del modulo. Non è un difetto della funzione (che legge
sempre `D2` e basta): 16→**15**, 37→**38**.

✅ **12/09 (unità 121, 122 e 124): 151 → 147.** `_sitoParseCsv`, `_sentCell`,
`esplCardHtml` e `innCardHtml` sono salite in `genesi-data.js`: il censimento
le marcava legate a variabili del modulo per due varianti dello stesso falso
positivo del suo tokenizzatore — lettere dentro le regex della funzione
(`_sitoParseCsv`, `_sentCell`) o dentro le sue STRINGHE (`esplCardHtml`,
`innCardHtml`: `'ritardi '`, `"es-nome"`) — lette a mano non leggevano nessuno
stato. I 55 estraibili non cambiano: erano già in quel conto, solo nel bucket
sbagliato.

⏱️ **Questi sette numeri erano tutt'e sette diversi fino al 09/08** — 46 · 64 ·
27 · 31 · 24, cioè «110 su 192» — e non perché qualcuno li avesse sbagliati:
erano veri il 01/08, e nel frattempo tre fette di Genesi sono uscite dalla
pagina. Erano scritti qui, e **identici** dentro il commento dello strumento
che li produce, sotto un avvertimento che diceva testualmente *«se un giorno
divergono, ha ragione l'uscita e torto il commento»*. Sono diversi da giorni.
Adesso li sorveglia `numeri-nei-documenti.mjs`, che lancia il censimento e
pretende che questa tabella sia la sua uscita: **dichiarare un punto cieco non
lo illumina**, sorvegliarlo sì. La domanda giusta non era
«quante sono», era «quante dipendono da uno stato condiviso»: una funzione che
legge una variabile del modulo non è una funzione pura scritta nel posto
sbagliato, è una funzione che va richiamata da capo in ogni punto che la usa (tirarne fuori
un modulo dati resta un cantiere intero), ma il numero non deve poter essere letto
per più di quello che è: dal 01/08 lo dichiara il censimento stesso, in fondo
alla sua uscita, e il conto lo **misura** invece di scriverlo a mano. Lo conta
`copertura-funzioni.mjs`, e questo numero lo verifica `numeri-nei-documenti.mjs`:
era già finito sbagliato due volte perché scritto a memoria.

```sh
node apps/deepwork-id/tests/run-kpi.mjs        # i calcoli delle sei app + i lettori CSV
node apps/deepwork-id/tests/run-stile.mjs      # le regole di stile vincolanti, rese verificabili
node apps/deepwork-id/tests/run-helpers.mjs    # numeri, unità, soldi, CSV condivisi
node apps/deepwork-id/tests/run-pointcloud.mjs # lettura nuvole di punti
node apps/deepwork-id/tests/run-manifest.mjs   # i manifest delle PWA
node apps/deepwork-id/tests/run-demo.mjs       # i dati della demo

# ⚠️ E POI, SEMPRE, con l'orologio del cliente. Questo contenitore è a
# Greenwich; le cave sono in Italia. Il 31/07 tre punti del prodotto
# sbagliavano il giorno OGNI GIORNO, e in UTC erano tutti verdi.
node apps/deepwork-id/tests/orologio-cliente.mjs   # le suite sensibili alla data, in TZ=Europe/Rome

# I numeri scritti QUI SOPRA e nei documenti del fondatore sono quelli veri?
# Il 31/07 tre conteggi erano invecchiati senza che nessuno se ne accorgesse:
# un numero in un documento non fallisce, sta lì.
node apps/deepwork-id/tests/numeri-nei-documenti.mjs

# Quante funzioni delle app sono davvero PROVATE? Per due giorni questo numero
# è stato contato a mano, e due volte è finito sbagliato in un documento.
# Stampa quante funzioni ha GUARDATO, e ha un FONDO per app: se scende, cade.
node apps/deepwork-id/tests/copertura-funzioni.mjs
node apps/deepwork-id/tests/copertura-funzioni.mjs --elenco   # dice anche QUALI mancano

# Lo stesso nome esportato da due app: è un alias o una copia? La regola del
# `shared/` era scritta in CLAUDE.md, cioè affidata alla memoria — e in un
# giorno solo ne sono uscite cinque violazioni. Qui o le due cose sono lo
# STESSO oggetto, o la differenza va DICHIARATA con la ragione.
# Guarda DUE coppie, e la seconda è arrivata dopo: app contro app, e app
# contro `shared/` — che è quella più facile da sbagliare, e per due giorni
# non la guardava nessuno. Stampa quanti confronti ha fatto.
node apps/deepwork-id/tests/nomi-doppi.mjs
```

**139 con l'emulatore Firestore** (**91** regole di sicurezza, 19 SDK, 21
funzioni, 8 primo avvio) — servono `firebase-tools` e Java.
✅ *Rimisurati il 05/09 in questo contenitore, in un solo* `emulators:exec
--only firestore,auth,functions` *(la CLI con* `npx --yes firebase-tools@13`*, le
dipendenze già installate): 81 + 19 + 8 + 21, tutti verdi, in circa un minuto.*
⏱️ **Qui c'era scritto 125, e i quattro addendi accanto ne fanno 123**: due
numeri che si contraddicono **nella stessa frase**, che è peggio di un numero
vecchio perché fanno dubitare di tutti gli altri. `STATO_PRODOTTO.md`, con gli
stessi quattro addendi, diceva **123** — cioè i due documenti del fondatore si
smentivano a vicenda. Trovato il 09/08 con un censimento dei numeri dichiarati
che nessuna regola sorveglia; adesso lo sorveglia `numeri-nei-documenti.mjs`,
in **tutt'e due** i documenti e **addendo per addendo**.
⚠️ E la distinzione che quel controllo ha reso chiara: le **21** sulle funzioni
si possono **contare** come le altre tre — sono `test(` scritti in
`run-fns.mjs`, e contarli non chiede nessun emulatore. Quello che non si può
verificare è che **passino**. «Non misurabile» riguardava il verde, non il
numero: tenerle fuori dal conto le lasciava invecchiare da sole. Il vecchio **106** portava un **58** sulle
regole di sicurezza che era fermo da tempo:

```sh
cd apps/deepwork-id && firebase emulators:exec --project demo-deepwork "cd tests && npm test"
```

⚠️ **Nel contenitore di sviluppo quel comando non parte**, e la ragione non è un
difetto nostro: `firebase` non è sul PATH e le `node_modules` non ci sono. Il
giro che gira davvero è uno solo:

```sh
node apps/deepwork-id/tests/giro-sicurezza.mjs   # 139 prove: 91 regole, 19 SDK, 8 primo avvio, 21 funzioni
```

Un comando solo, che alza l'emulatore da sé, ripiega su `npx firebase-tools@13`
quando `firebase` non c'è, e **dichiara in fondo quello che non ha potuto
guardare** — oggi **niente**. Se gli attrezzi o le dipendenze mancano si ferma
dicendo quale `npm ci` lanciare (uscita 2) invece di stampare «0 caduti», che
sarebbe il verde più falso che ci sia.

⛔ **Fino al 13/08 questa riga diceva 102, e le 21 prove sulle funzioni erano
dichiarate «verificabili solo in CI» perché «l'emulatore delle funzioni chiede
la rete e la politica del contenitore la nega».** Era falso. L'emulatore parte;
le 21 cadevano con `functions/not-found` perché
`apps/deepwork-id/functions/node_modules` era **vuota**. Un `npm ci` lì dentro e
fanno **21 passati, 0 falliti**. Per cinque giorni le difese che contano di più
— un'email non verificata non riscatta inviti, un utente anonimo non crea
un'organizzazione — sono state fuori dalla verifica di casa **per una cartella
vuota**, e nessuno ha riletto quel messaggio d'errore perché **la spiegazione
c'era già**. Il segno da riconoscere non è l'errore: è la **rinuncia scritta
accanto**.

**339 esecuzioni che aprono davvero le pagine** in Chromium — banchi distinti,
ognuno seguito dalla sua **controprova** (Chromium è già installato in
`/opt/pw-browsers/chromium`, **non** si lancia `playwright install`):

```sh
node apps/deepwork-id/tests/browser/tutti.mjs
```

### La regola che vale più del numero di prove

**Una prova che non sa fallire non dimostra niente** — e, dal 01/08, anche:
**una controprova va misurata nella sua COPERTURA, non solo nel suo esito.**

Il caso che l'ha insegnato: la regola che vieta i dialoghi del browser aveva la
sua controprova, e passava. Ma iniettava il difetto in **tre superfici a un
punto ciascuna**. Rimettendolo in tutti i punti dove la scansione era in
difficoltà, **764 iniezioni su 1030 non venivano viste**: la regola era cieca su
gran parte del codice, core compreso, mentre rispondeva «a posto».

Quindi, quando si scrive un controllo nuovo:

1. si rimette il difetto **nei file veri**, non su tre righe inventate — su tre
   righe inventate funzionava benissimo anche quella cieca;
2. lo si rimette **dove il codice è difficile** (dentro i template, dopo le
   stringhe), non in fondo al file, che è il posto più facile;
3. si **stampa quanti soggetti si sono guardati davvero** (`9 superfici`,
   `1030 iniezioni`, `84 tendine misurate`). Un numero che non torna si vede;
   uno «zero violazioni» ottenuto su zero soggetti no;
4. se il controllo ha un elenco di soggetti attesi, lo si **asserisce**: è così
   che è saltata fuori una settima superficie di cui non sapevamo.

Gli aiuti per farlo esistono già in `run-stile.mjs`: `controprovaSuiVeri(...)`
per i difetti che si **aggiungono**, e il blocco della regola 12 come esempio
per quelli che si **tolgono** (lì il difetto è l'assenza di una difesa).

Il dettaglio di ogni banco sta in `apps/deepwork-id/tests/browser/LEGGIMI.md`.

### Due cose da sapere prima di aggiungere una prova

1. **Va inserita PRIMA del blocco di riepilogo finale**, che chiude con
   `process.exit`: appesa in coda non viene mai eseguita, e il totale resta
   fermo senza che niente lo segnali.
2. **Si controlla che il totale sia SALITO**, non solo che i falliti siano
   zero: un file di prova inerte dice «0 falliti» esattamente come uno che
   funziona.

E ogni controllo nuovo va **provato contro il difetto**: si rimette il difetto
e si pretende che il controllo fallisca. Le ragioni, con i casi veri in cui è
servito, stanno in `CLAUDE.md`.

## Credenziali di prova

**Non sono elencate qui.** Nel core esistono utenti storici con password in
chiaro nel sorgente: è un problema noto e tracciato in
`docs/AUDIT_SICUREZZA.md`, con la mitigazione già scritta e **non attivata** in
`docs/MITIGAZIONE_PASSWORD.md` (aspetta una decisione del fondatore). Copiarle
in un secondo documento aumenta la superficie senza aggiungere niente: chi
sviluppa le trova nel core, chi legge questo file deve sapere che **esistono e
vanno sistemate**, non quali sono.

## Le regole che non sono opinioni

Stanno in `CLAUDE.md` e valgono per chiunque tocchi il codice: lo **stile**
identico al core con la palette propria di ogni app, l'**isolamento
multi-tenant** che passa sempre dall'SDK, e la regola che una **logica usata da
due app vive in `shared/`** e si chiama, non si ricopia. `run-stile.mjs` ne
rende **diciannove** verificabili in automatico.
