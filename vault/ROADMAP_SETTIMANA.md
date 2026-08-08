# Roadmap Settimana — lunedì 03/08 → venerdì 07/08/2026
### v6.0 "LO STANDARD DELLE FUNZIONI" — dalla sequenza dichiarata dal fondatore il 27/07

> La settimana precedente (27/07 → 01/08, l'estetica) resta nella storia di git:
> `git show 934b3c3:vault/ROADMAP_SETTIMANA.md`. Questo file rappresenta **solo
> la settimana in corso**. I checkpoint invece non si sovrascrivono mai.

---

## 🔴 Quello che aspetta te, Giuseppe

Domenica **02/08 abbiamo lavorato insieme, passo per passo**, e due sono
chiuse. Le aperte sono **24**; la pagina d'ingresso di
`docs/DECISIONI_WEEKEND.md` le ordina per quanto costano **a te**.

- ✅ **Chiusa la 3** — i dati di default del core sono **dimostrativi**, e non
  sulla parola: l'IBAN è quello d'esempio dei manuali, i telefoni sono in
  sequenza, i cognomi sono i segnaposto classici. Niente da bonificare, e cade
  anche l'urgenza della rotazione password (la **4** resta, ma solo come «da
  togliere prima del primo cliente vero»).
- 🟡 **La 2 è a un click**: le regole del Firebase esistente erano
  `allow read, write: if true` — **chiunque su internet poteva leggere,
  scrivere e cancellare** quel database. Le regole nuove sono scritte e
  versionate (`firestore.rules.core-vecchio`); manca solo che il fondatore
  prema «Pubblica» in console. ⚠️ Chiudere **non spegne il sito**: il core ha
  già `initDBOfflineFallback`, e il suo commento nomina alla lettera il caso
  «security rules bloccanti».
- ⏸ **La 1 (Firebase nuovo) è rimandata con la ragione**: serve a far entrare
  persone vere con un account vero, e finché non c'è un cliente pilota non ha
  nessuno a cui servire. Si fa in dieci minuti quando arriva, e si collauda
  con lui.
- 🟡 **Le quattro gemelle — 13, 14, 16, 17** — sono la stessa domanda e
  aspettano una riga sola. ⚠️ *Erano state annunciate come «dieci»: sono
  quattro, contate una per una. Lo stesso difetto che togliamo dal prodotto,
  fatto da noi in un documento.*
- Le altre **quindici** sono scelte di prodotto: se entro venerdì non arriva
  risposta si procede con la colonna «la mia risposta», **dichiarandolo nel
  commit**.

- [x] ✅ **D-bis. SETTE DELLE QUINDICI PRESE il 07/08 — e otto restano aperte,
      dichiarate.** Il piano preparato alle 14:45 si è rivelato giusto nella
      divisione e va tenuto per la parte che resta. Applicate scrivendole:
      **6** (la geometria del fronte resta chiusa finché la 7 non porta un volo
      vero), **8** (il criterio: quella che l'ispettore chiede per prima),
      **10c** (più utenti, e ne segue che la 10b va chiusa PRIMA del primo
      cliente), **11a/11b/11c** (diario e tavolo da disegno; le tre
      sovrapposizioni si tolgono da Deepwork in ordine dichiarato; due app e il
      ponte), **12b** (si dice in chiaro comunque, anche quando la 12a
      esisterà). ⛔ Ognuna porta scritto **decisa dal ciclo, non dal
      fondatore**, e si cambia con una riga.
      ⚠️ Le **otto che vogliono un cantiere** (5a, 5b, 10a, 10b, 12a, 15,
      18a, 18b) NON sono state spuntate: la risposta c'è, ma dichiararle prese
      senza averle costruite sarebbe esattamente la faccia tranquilla su un
      lavoro non fatto. E per la **5b** la prima unità resta la **misura** (che
      cosa succede a due persone che scrivono la stessa riga), non la funzione.

- [ ] **D-ter. Le otto verdi che vogliono un cantiere** — 5a, 5b, 10a, 10b, 12a,
      15, 18a, 18b, con la risposta già scritta in `docs/DECISIONI_WEEKEND.md`.

- [x] ~~**D-bis. Il piano di applicazione delle quindici verdi**~~ — preparato il
      07/08 alle 14:45 perché a fine giornata l'applicazione sia meccanica e non
      improvvisata. ⚠️ **Sono quindici, non diciannove**: le quattro gemelle
      (13, 14, 16, 17) le ha decise il fondatore il 02/08 con «vai» e sono già
      attuate — il conto va detto giusto, e il documento lo dichiara già.
      Si dividono in due mucchi, e vanno trattati in modo diverso:
      · **Sette sono decisioni da SCRIVERE**, e si applicano in minuti perché
        non toccano codice: **6** (la geometria del fronte resta com'è finché
        non c'è un volo vero — dipende dalla 7, che è gialla), **8** (si sceglie
        la funzione che l'ispettore chiede per prima, non quella più citata dai
        concorrenti), **10c** (più utenti al primo cliente), **11a/11b/11c**
        (Deepwork è il diario, Genesi il tavolo da disegno; le tre
        sovrapposizioni si tolgono da Deepwork; alla presentazione due app e il
        ponte), **12b** (lo si dice in chiaro prima del pilota **comunque**,
        anche con l'export).
      · **Otto vogliono un cantiere**, con la sua misura: **5a** (il messaggio
        di un salvataggio non riuscito: «non è stato salvato», mai un codice),
        **5b** (il lavoro senza rete — e la mia risposta dice «prima misuro cosa
        succede a due persone che scrivono la stessa riga», quindi la **prima
        unità è la misura**, non la funzione), **10a** (l'abbonamento come
        barriera vera), **10b** (chi può cancellare), **12a** (export
        ri-caricabile), **15** (dove vive «Il Quadro»), **18a/18b** (il volume
        del recupero e l'anno in cui conta).
      ⛔ **E ognuna, quando si applica, va scritta nel commit come decisa dal
      ciclo e non dal fondatore** — è la condizione con cui è stata concessa, e
      serve a poterla cambiare in qualunque momento.
      ⚠️ Le quattro fuori dal mucchio restano ferme: due non si prendono da
      soli mai (sicurezza), due vogliono che il fondatore apra qualcosa di suo.
- [ ] **D. Le 24 decisioni ancora aperte** — `docs/DECISIONI_WEEKEND.md`,
      pagina d'ingresso in cima al file.

---

## 🎯 L'obiettivo della settimana

La sequenza l'hai dichiarata tu il 27/07: **prima l'estetica, nei giorni
successivi lo standard di ogni funzione e funzionalità, con lo stesso livello di
approfondimento.** L'estetica è la settimana scorsa. Questa è **lo standard
delle funzioni** — e la notte fra l'1 e il 2 agosto ha detto da dove si comincia.

⛔ **Il filo che tiene insieme tutto quello che è saltato fuori: i numeri che
mentono con la faccia tranquilla.** In una notte sola, su codice che passava
tutte le prove:

| dove | che cosa diceva all'utente | che cosa era vero |
|---|---|---|
| Flotta · costo orario | «63,03 €/h», e la macchina in cima alla classifica | **28,61 €/h** (+120%), e la macchina cara era un'altra |
| Conti · scadenze | «fattura insoluta da 152 giorni» | la scadenza era il **30 febbraio**, un giorno che non esiste |
| Genesi · soglia vibrazioni | «50,8 mm/s», la più permissiva | la frequenza era illeggibile: **non si poteva dire** |
| Terra · densità | conversione fatta a 1,6 t/m³ | un valore **prestampato nel form**, che nessuno aveva scelto |
| Sentinella · grafico letture | «30/02/2026» come un giorno qualunque | idem |

Nessuno era un errore di calcolo. Erano tutti **la stessa cosa**: un numero
scritto dove non era stato misurato niente. È il principio che hai dato tu, e
questa settimana serve a farlo valere **funzione per funzione**, non a memoria.

## Task

### A — Chiudere ciò che la notte ha lasciato a metà (lunedì)

- [x] ✅ **A1. Flotta — la metà gasolio del costo orario.** Chiuso il 02/08. I
      tre scarti confermati alla cifra (Pala P1 **+93,7%**, Dumper D1 +50,4%,
      Escavatore E1 +49,2%), e la prova che vale più dei numeri: l'identità
      `euroOra = euroOraOfficina + euroOraCarburante` **prima non tornava** e
      adesso torna al centesimo su tutti e tre. `totale`, `officina` e
      `carburante` **identici** prima e dopo su tutti e sei i mezzi: nessun euro
      speso è sparito.
      ⛔ Ma la parte che conta è il **buco nelle prove**, non la correzione: le
      sedici prove della pagella erano tutte **relative** («la media è la spesa
      diviso le ore»), quindi restavano verdi **con qualunque numeratore**,
      difetto compreso. Ora i numeri della dimostrazione sono fissati accanto a
      come sarebbero col primo pieno dentro — il confronto affiancato **dentro
      la suite**, non in uno scratchpad che alla sessione dopo non esiste.
      ⚠️ E un esito che **smentisce** l'ipotesi del mandato, detto com'è: nessun
      verdetto della pagella cambia e la classifica non si muove. Quello che
      cambia è la **Pala P1, che esce dalla banda dal lato buono** — «un'ora sua
      costa meno della media del parco», la buona notizia che prima la
      schermata non diceva.
      *Il difetto era*: `consumoPerMezzo` scarta il primo pieno (il gasolio
      della finestra è quello messo *dopo* la prima lettura) e
      `costoOrarioMezzo` lo rimetteva nel numeratore — due conti della stessa
      cosa che divergono, dieci righe sotto il commento che lo vieta.
- [x] ✅ **A2. `shared/` — la densità della cava, una sola.** Chiuso il 02/08, e
      il difetto **misurato prima** sullo stato precedente: con la stessa
      autorizzazione Terra dava **1,95** t/m³ (dal certificato di laboratorio) e
      Campo **1,90** (il valore tipico). A valle, sulla stessa
      `riconciliazioneTurni`: scostamento **2,56% in Terra e 0% in Campo**,
      stessa cava, stesso mese. Nessuna delle due sbagliava da sola.
      ⛔ **E il buco vero era altrove.** L'identità difendeva il lato `shared/`,
      ma rimettendo il difetto **su Campo** — import compreso — `run-kpi`,
      `run-stile`, `nomi-doppi` e `copertura-funzioni` restavano **tutte e
      quattro verdi**: le suite `node` non aprono le pagine, quindi il lato dove
      il difetto nasce era scoperto. Aggiunte quattro prove che leggono **chi
      chiama** `riconciliazioneTurni` invece di elencarlo a mano.
      ⚠️ **La lezione non prevista**, e vale più dell'unità: la copia
      «identica» della funzione **è divergesa nell'atto stesso di copiarla** —
      un controllo scritto diverso su una riga, e con quella versione una
      densità **0** scritta per errore veniva sostituita di nascosto dal valore
      tipico. L'ha presa una prova, non una rilettura. È la regola del `shared/`
      dimostrata dal vivo.
      *Il difetto era*: Terra leggeva la densità dall'atto o dal laboratorio e
      Campo restava sul preset, pur costruendo la stessa riconciliazione.
      Adesso la regola sta in `shared/dw-ponti.js` con la prova di **identità**
      (`terra.X === ponti.X`), non di somiglianza.
- [x] ✅ **A3. Conti — il DDT eredita il prezzo dell'ordine.** Chiuso il 02/08.
      Misurato prima di scrivere: un camion da 25,6 t fatturato **291,84 €**
      invece di 255,36 (**+14,3%**), e su una fattura differita di 32 camion
      **+1.167,36 €**; sui due DDT già agganciati in dimostrazione, +24,50 €
      (il 5% concordato non arrivava). `prezzoDaOrdine` è l'unico posto che
      decide, con `fonte` e la bandiera `calcolabile`; dove non si sa (5 casi:
      prodotto fuori ordine, due righe a condizioni diverse, densità mancante,
      riga senza prezzo, documento non accettato) **non si ripiega**.
      La decisione, con la ragione scritta nel modulo: **vale il pattuito** —
      un'offerta firmata è un impegno preso su un numero, e seguirlo al listino
      la farebbe smettere di essere una promessa in tutt'e due i versi.
      8 controprove su 8 sanno fallire. ⚠️ Due volte hanno risposto «non
      distingue»: era la **quarta causa** (iniezione puntata su una prova che
      guarda un'altra funzione), corretto il puntamento, non il codice.
      Visto **solo negli screenshot**: la tendina tagliava proprio «10,50/t −5%»
      a 1280px, e una frase di conferma diceva il contrario del riquadro sotto.
- [~] **A4. Un banco per le modali.** In scrittura (`modali-dentro.mjs`, già
      nel LEGGIMI dei banchi). Non chiuso: il ciclo si è interrotto due volte.
      **Originale:** Stanotte due difetti veri dentro le
      finestre di dialogo li ha trovati **solo un occhio umano**: un'unità in
      maiuscolo in Sentinella, e in Terra le etichette di una tendina tagliate a
      320px — dove il taglio si portava via *esattamente la differenza fra le
      due fonti*. Nessun banco apre le modali: quella classe di difetto oggi è
      scoperta dall'automatico.

### A-bis — Quello che la domenica ha aggiunto, e non era in programma

- [x] ✅ **La decisione 2 chiusa e verificata dall'esterno.** Il fondatore ha
      pubblicato le regole chiuse del Firebase pubblico; una lettura anonima
      dell'API REST risponde **403 PERMISSION_DENIED** (prima tornava con i
      documenti dentro). Le regole sono versionate in
      `firestore.rules.core-vecchio`, con dentro quelle vecchie e come si torna
      indietro.
- [x] ✅ **Il messaggio che il core dava a TUTTI era falso.** Chiuse le regole,
      il ramo di ripiego non è più il caso raro: prende ogni visitatore, e
      diceva «⚠ Modalità degradata — connessione database non disponibile» —
      falso (la connessione c'era) e muto sulla cosa che riguarda chi legge:
      che **quello che scrive non viene salvato**. Ora `motivoDatiNonSalvati`
      in `shared/` (tre teste, una coda sola, e la causa detta solo quando si
      sa), badge «NON SALVA» acceso per tutta la sessione, banco
      `ripiego-messaggio.mjs` — 36 asserzioni, controprova che ne fa cadere 10.
      ⛔ E lo **scatto** ha trovato quello che il codice non mostrava: il toast
      era `nowrap` + `ellipsis`, e a 320px **dieci messaggi del core** venivano
      tagliati (il più lungo 109 caratteri, ne entravano ~45). Misurato su 125
      messaggi: prima tagliati, ora **zero**, al massimo tre righe.
- [x] ✅ **La nuvola di punti, e il 30% di volume che non c'era.** Il fondatore
      non può volare col drone: misurata la rete (`raw.githubusercontent` sì,
      `github.com`/`api.github.com`/OpenTopography no), scaricati **due file
      LAS pubblici veri** e letti dal nostro `parseLAS` (110.000 punti in
      **34 ms**). Ma di un rilievo vero non si conosce la risposta giusta:
      quindi `nuvola-di-prova.mjs`, un fronte di cava il cui volume esatto si
      **integra** (14.880 m³).
      ⛔ Ha trovato subito che `volumeCumulo` difendeva la **base** dai punti
      spuri e la **cima** no: **40 punti volanti su 120.000 — lo 0,03% —**
      valevano **+29,9%** del volume con la cella a 2 m (200 punti: +118,7%).
      Corretto con la «cima sostenuta»: dopo, +4,92%. E non taglia il vero —
      sul file LiDAR pubblico cambia lo **0,00%** (2 celle su 103.951), su una
      guglia di roccia il −0,003%, su una nuvola pulita **zero celle toccate**.
      Imparato: il **piazzale non è scenografia** (senza, il 2° percentile
      alzava la base e lo scarto era −8,51%) e la **nord UTM perde 25 cm in
      `float32`**, non «un paio di centimetri».
- [x] ✅ **Un controllo che gira solo in CI si scopre dopo il push.** La CI è
      caduta su un `${...}` fuori da ogni template in `sentinella/index.html`:
      errore di sintassi duro, pagina morta, e **tutte** le suite `node` verdi
      perché nessuna importa le pagine. Ora `sintassi-pagine.mjs` compila i
      blocchi `<script>` di tutte le 15 pagine dentro il giro di casa, con
      l'elenco **derivato** dalla cartella e la controprova a tappeto (14 su 14).

### A-ter — La notte fra il 2 e il 3 agosto: il core e le date impossibili

*Sette unità, ognuna con la misura prima e dopo. Il filo è sempre quello: **un
numero scritto dove non era stato misurato niente**.*

- [x] ✅ **La tabella del delta scritta sei volte era già divergente.** Gli
      addendi non facevano il totale (Sentinella `15+4+1+0` su 22, Conti
      `9+5+0+2` su 18) **e** le sei copie erano già diverse fra loro. Tre
      controlli, controprova su due piani.
- [x] ✅ **Il core: una data illeggibile diventava un OK verde.** `null` dava
      «scaduta da 56 anni», `30/02/2026` dava `NaN` — e con `NaN` sono false
      **tutt'e due** le domande, quindi un mezzo mostrava il badge **OK verde**
      e un promemoria **spariva** da entrambi gli elenchi e dal pallino rosso.
      Sei punti corretti; la regola giusta era in `shared/` da mesi.
- [x] ✅ **Un rapportino appena aperto dichiarava «0,0 mc».** La media di zero
      fori misurati non è zero: non c'è. La stessa espressione era scritta
      **quattro volte**, e una delle quattro era già giusta.
      ⏳ **Resta aperto**: le due copie nel percorso di **salvataggio** scrivono
      `0` nel documento, e non c'è guardia che impedisca di salvare un
      rapportino senza un solo foro misurato. È una decisione di prodotto (vedi
      il commit `7050dea`), non una correzione ovvia.
- [x] ✅ **Conti: la premessa di una decisione dichiarata era falsa in tre
      punti**, e i totali della fattura erano **più bassi del vero con la
      spunta già messa**. Più il DDT **stampato** che scriveva «€ 0,00».
- [x] ✅ **Sentinella: una misura di vibrazione portata a zero e registrata
      come correzione di qualcuno.** `+null` è 0, la guardia lo lasciava
      passare. E lo zero scritto davvero continua a passare.
- [x] ✅ **Flotta e Campo: gli ultimi punti del censimento.** Una data
      impossibile faceva scrivere «Disponibilità reale **NaN%**» su tutta la
      pagina dei fermi, e in Campo una registrazione con «2026-02-32» mandava
      la sezione in **ciclo infinito**: la schermata non si disegnava affatto.
      Corretto **un solo predicato** invece di otto chiamanti.
      ⚠️ E la lezione: correggere non bastava, perché togliendo il dato
      sbagliato la disponibilità **saliva**. Ora le tre schermate dichiarano
      che cosa è rimasto fuori.
- [x] ✅ **Genesi esce dalla pagina: 174 → 168 funzioni.** Estratta la
      riconciliazione previsto-vs-reale, +25 prove, i quattro scatti identici
      byte per byte. Cinque difetti trovati e **dichiarati senza correggerli**
      (fra cui un CSV che esce dall'azienda senza la difesa contro la
      CSV-injection): sono il mandato del cantiere che gira adesso.
- [x] ✅ **Le due righe perse di Conti ritrovate**, non coperte con un numero.
      Arretrato di Conti da 12 commit a **zero**.
- [x] ✅ **Genesi: i cinque difetti dichiarati sono corretti** (`7cb8df7`). Il
      più grave era il CSV dello storico senza la difesa contro la
      CSV-injection — `@SUM(1+1)` usciva **nudo** dal file che si apre in Excel
      a casa del cliente — e il più insidioso `_ricColore(null)`, **verde**
      perché `Math.abs(null)` fa 0: era la trappola in cui sarebbe caduta la
      correzione principale. Ogni prova che li **blindava** è stata riscritta
      più giusta, non più permissiva.
- [x] ✅ **La regola 20 guardava sei app su sette, e non lo diceva** (`2dfd3d8`).
      Genesi ne restava fuori perché la sua pagina si chiama `genesi.html` e
      l'elenco era costruito per convenzione; e la dichiarazione aveva **due
      forme** (`bandiera:` e `const bandiera =`) di cui se ne cercava una sola,
      quindi per Genesi la regola non poteva scattare **in nessun caso**. Due
      righe di prosa erano false e sono state rimisurate: la copertura non è
      «tre app su sei», è **sette su sette, 18 bandiere**.
- [x] ✅ **Terra: i documenti che escono dall'azienda** (`ae26773`). Cinque zeri
      tranquilli trovati alla **seconda passata**, aprendo la pagina: il
      prospetto annuale per l'ente diceva «Totale 2026 · **0**» su un anno che
      nessuno ha misurato, il verbale di rilievo «fra **0 e 0** m³» su un volume
      illeggibile, e il riquadro del valore «**€ 0**» a due gesti di distanza.
      Banco nuovo del browser, 26 prove, 8 difetti rimessi su 8.

- [x] ✅ **Il core stampava «Fori: 0 · Metri: 0,0 · Mc: 0,0»** su un turno mai
      misurato (`f035a13`), e il caso peggiore era l'altro: la maglia è un
      campo **opzionale**, quindi venti fori veri e sessanta metri perforati
      davano «0,0 mc» per una moltiplicazione per zero. La regola sta in
      `shared/`, e sistema elenco, scheda, quattro documenti che escono
      dall'azienda, la riconciliazione (che scriveva «+0,0%» in verde) e i
      grafici. ⏳ Il **salvataggio** resta la decisione di prodotto di
      `7050dea`.
- [x] ✅ **Scudo: il permesso di lavoro** (`22999aa`), perché la nostra
      checklist chiedeva una spunta su un documento che l'app non sapeva
      produrre: 27 funzioni, copertura 130 → 157, otto controprove.
- [x] ✅ **La riga del documento che l'aveva proposto è aggiornata**
      (`1d53ce7`) — direttiva 7, che era una regola scritta e non applicata:
      confermate di Scudo 7 → 6, tabella del delta riscritta in tutti e sei.
- [x] ✅ **Un banco del browser difende i rapportini non misurati**
      (`62fc449`): 18 prove, quattro difetti veri rimessi ne fanno cadere otto.
      Prima quella difesa viveva solo negli scatti di uno scratchpad.
- [x] ✅ **Campo: la pillola della squadra copriva il badge** (`613c3b6`) —
      198 px in un blocco da 131, e **+9 anche a 390 px**. Il banco diceva «2
      schermate pulite» prima e dopo, perché chiedeva «esce dallo schermo?» e
      quella usciva dal **proprio riquadro**: adesso `fuori-schermo.mjs` ha due
      domande, con l'arretrato di Sentinella stampato e non preteso.

- [x] ✅ **Conti: sei zeri nei file che escono dall'azienda** (`e8933c0`), e uno
      **rientrava dall'import**: la gara col bando appena uscito usciva `;0;` e
      rientrando diventava una gara da zero euro, facendo sparire l'avviso che
      spiega il totale. Più l'IVA `0` su tutte e sette le fatture a importo
      unico, mentre il foglio stampato si rifiuta di scriverla.
- [x] ✅ **Sentinella: il file per l'ARPA usava un'altra soglia** (`380fb76`).
      Col ricettore più severo del punto lo schermo diceva **Superamento** e il
      file **Conforme**: il documento che va al consulente assolveva un punto
      segnato in rosso. Più «undefined», «tra NaN gg» e i chili del mese sommati
      come zero.
- [x] ✅ **Il fochino: «0 kg» non è «nessuno ha scritto i chili»** (`34db532`).
      Dodici fori caricati con la colonna in bianco davano `tot_kg: 0` — ed è il
      numero dietro cui stanno autorizzazione, deposito e denuncia. Il caso a
      metà adesso dice «almeno X kg».
- [x] ✅ **Flotta: un badge VERDE che diceva «NaN gg»** (`394ca35`), e il gasolio
      a **1,000 €/l invece di 1,500** perché i litri senza spesa restavano al
      denominatore: −33% nella direzione che rassicura. Più il contatore sceso
      che dava 0,68 l/h invece di 2,22 — e `ritmoOreMezzi` quel caso lo
      rifiutava già.
- [x] ✅ **La barra alta si tagliava in tutte e sei le app** (`66b570a`),
      perdendo sempre «Deepwork». Era una copia più debole del `.role-sm` del
      core, e il banco che avrebbe dovuto vederla portava scritto nel commento
      che il taglio era «apposta».
- [x] ✅ **La ricerca continua riverificata** (`0b4d8a1`): tre mancanze
      proposte, **due false** — l'esplosivo ha già un rapportino fochino suo,
      foro per foro. Fermate prima di diventare lavoro.

- [x] ✅ **Il PDF del fochino non diceva quanto esplosivo era stato usato**
      (`396449b`): stampava tutto tranne il numero per cui quel documento
      esiste. E i chili per foro mancavano anche dalla scheda, che è la ragione
      per cui il totale può essere «almeno».
- [x] ✅ **Campo, seconda passata** (`5b10204`): nel CSV una giornata con **tre
      guasti mai misurati** era identica a una senza fermi, **2.300 t** sparivano
      dallo storico senza che niente lo dicesse, e il ponte con Terra contava i
      rapportini con una sottrazione che toglieva UN rapportino per qualunque
      numero di viaggi.
- [x] ✅ **La regola generale scritta in CLAUDE.md** (`9a6689d`): la copia debole
      non è sparsa, sta **dove il documento si compone** — 24 difetti in 5 app,
      tutti nello stesso posto, e il censimento statico su quelle app era a zero.
- [x] ✅ **Le parole del mestiere** (`91d0a3a`): il vocabolario regge, nessuna
      parola sbagliata; e una proposta su due era falsa, fermata dalla
      riverifica.
- [x] ✅ **Il core si fermava sulla schermata d'accesso per tutti i banchi** —
      chiuso in `71875c1`. ⏳ Resta scoperta la **seconda causa**: le modali del
      core continuano a non aprirsi (0 su 68, con 6.800 comandi provati).

- [x] ✅ **Genesi, seconda passata** (`efac49a`): un campo svuotato lasciava **28
      righe su 28** calcolate su un valore che nel campo non c'era più, senza un
      avviso; `Limite PPV (mm/s);null` nel CSV archiviato; due copie deboli di
      `csvCell` sopravvissute alla correzione del mattino; e la bandiera `pochi`
      letta da una schermata sola su tre.
- [x] ✅ **Scudo, seconda passata** (`395c165`): pastiglia **verde «tutte
      regolari»** su tre visite mediche dalla data illeggibile, l'assegnato
      cancellato che accorciava il denominatore da solo, la cartella per
      l'ispettore che stampava la chiave interna del DPI, e il badge «In
      miglioramento» su un indice che deve ancora salire.
- [x] ✅ **Il core era un guscio per tutti i banchi** (`71875c1`): 258 caratteri
      di testo e **un** bottone. Con l'accesso vero sono uscite **5 violazioni
      AA** mai viste: quattro corrette, la quinta era il banco che misurava una
      **dissolvenza** — adesso le salta e le conta.
- [x] ✅ **SECONDA PASSATA CHIUSA SU TUTTE E SEI LE APP**: Terra 5, Conti 6,
      Flotta 6, Sentinella 5, Campo 4, Genesi 4, Scudo 5, più quattro nel core.
      **Trentanove difetti veri**, e il censimento statico su quelle app era a
      **zero**.

- [x] ✅ **Il rapportino stampato non diceva chi chiude il turno** (`2fa4c90`):
      l'app registra chi ha premuto «Salva», che è la creazione di un record,
      non una sottoscrizione di responsabilità. Adesso il foglio lo dice per
      quello che è, con le due righe per la firma — **senza** annunciare una
      «firma digitale» che non c'è.
- [x] ✅ **La consegna di turno elencava le causali dei fermi e non la durata**
      (`a6185f9`), mentre lo schermo scrive già i minuti. E sotto c'era un
      numero tranquillo vero: `paretoFermi` sommava un guasto **mai misurato**
      valendo zero — con **due prove esistenti** che lo blindavano, una delle
      quali pretendeva letteralmente `minuti: 0`.
- [x] ✅ **La regola del banco che confessa** (`7a5e6ba`): «68 da aprire, 0
      aperte» stampato da mesi in fondo a una pagina di verde. Le righe che
      dicono «non ho guardato» vanno lette **prima** dei KO.
- [x] ✅ **LA CECITÀ SULLE MODALI DEL CORE: TROVATA, ED ERA UNA RIGA** (`b627316`).
      **0 → 11 modali su 68**, comandi provati **6.800 → 980**.
      Non era il selettore (`301b5b7` lo aveva già smentito) e non era la
      dimostrazione vuota (riempirla, `7ba9c42`, da sola non è bastata): in
      `SCEGLI` il contrassegno `data-dw-sonda` veniva messo **prima** che si
      calcolasse l'impronta, e `identita`/`forma` leggono il `dataset` — quindi
      la lista dei fatti riceveva `…|dwSonda=1` mentre il confronto del giro
      dopo guardava l'elemento senza contrassegno. Non combaciavano **mai**:
      tutt'e due le difese contro i doppioni erano morte e il banco ripremeva
      lo stesso pugno di comandi. Controprova: col solo difetto rimesso, a
      **12 min 14 s** il core non era ancora finito.
      ⛔ La riga chiedeva «fai stampare al banco quanti candidati ha trovato e
      quanti ne ha aperti» — ed era la strada giusta: è **quel censimento** che
      ha reso visibile il numero, ma la causa non stava nel conteggio. La
      lezione da tenere: *uno strumento che scrive sul soggetto che misura deve
      leggerlo prima di scriverci.*
      ⚠️ Restano «non guardate» vetrina, campo, conti, genesi e terra: adesso
      che il banco funziona, misurarle è un'unità sua e non più una domanda
      aperta.

- [x] ✅ **Due uscite fuori schermo a 320 px, trovate appena il banco ha aperto
      le modali** (`b627316`). Home **343 → 320** (il bottone «ESCI» fuori, e su
      HEAD il blocco dell'identità era largo **zero**) e chat **379 → 320**
      («INVIA» a 379: il messaggio si scriveva e non si mandava). Tutt'e due
      sono la stessa forma — *una regola provata a una larghezza sola* — e in
      tutt'e due la difesa c'era, **scollegata**: `flex-shrink:1` sul figlio
      dentro un padre che non cede. 30 sezioni su 30 adesso senza scorrimento
      orizzontale.
      ⚠️ E il primo verde era una trappola: reso cedevole il blocco, «ESCI»
      stava dentro lo schermo **largo 16 px**. «Ci sta» non è «si usa».
- [x] ✅ **La pastiglia «NON SALVA» non sta più sopra il nome** (`47ab5c8`).
      La stranezza — `position:static` e misura **fuori dalla scatola del
      padre** — era il **traboccamento all'indietro**: con
      `justify-content:flex-end`, quando il contenuto non ci sta esce dalla
      parte opposta, cioè a sinistra, e il documento **non scorre** — quindi
      nessun controllo sull'overflow poteva vederlo. Chiusa con tre cose
      misurate: la pastiglia diventa un punto sotto i 360 px (76 → 23 px, e
      resta il colore, che è quello che dice se si salva), la ricerca si
      stringe alla sua lente e si apre al tocco, e cede **prima** l'identità.
      ⛔ **E ho dato la colpa a due cose sbagliate prima di trovare quella
      giusta**, scritte tutt'e due nel file: (1) «vince l'ultimo `@media`» —
      vero, ma spiegava una dichiarazione su tre; (2) quella vera, lo **stile
      in linea**, che batte qualunque regola del foglio. Il segnale ingannevole:
      il browser rispondeva `mq360: true` e nascondeva il testo, cioè tutti i
      segnali che la regola fosse attiva, mentre tre dichiarazioni su quattro
      venivano buttate. *Quando una regola non morde si guarda chi vince
      davvero, non lo si deduce.*

- [x] ✅ **Le due copie di Genesi dichiarate e non corrette** (`66ae5b1`): la
      seconda Box–Muller che **ombreggiava** l'import (e scriveva `6.2831853`
      dove il modulo scrive `2*Math.PI`), e il corpo di `jitterGeo` ricopiato a
      mano. ⛔ La seconda esisteva **perché mancava un argomento**: il seme era
      inchiodato a 7 e lì servivano `11+k`. È la terza volta oggi che una copia
      nasce da una firma troppo stretta — prima di ricopiare un corpo, la
      domanda è se all'originale manchi un parametro.

- [x] ✅ **IL BANCO DELLE MODALI HA GUARDATO TUTTE E NOVE LE SUPERFICI**
      (`4743c69`). Riparato stamattina, il censimento completo: **core 11/68**
      (2 difetti, le uscite fuori schermo), **sentinella 10/13** (5 difetti di
      maiuscolo, corretti), e pulite conti 12/22, terra 6/11, flotta 6/14,
      campo 5/19, scudo 2/34, genesi 1/2. Vetrina e le due pagine di ID sono
      **non raggiunte**, e il banco lo dichiara invece di dirle a posto.
      ⚠️ E il limite si legge nella colonna: su Scudo apre **2 su 34**, quindi
      «pulita» lì vuol dire pulita **su due**.

- [x] ✅ **Il singolare sale in `shared/`** (`18725f1`): **351** ternari scritti
      a mano nelle app, **8** nel core, **zero** in `shared/`. Nascono `plurale`
      e `conta`; il core ne adotta i dieci punti in cui il conto vale uno più
      spesso che altrove. ⛔ La funzione ha sbagliato **tre volte** prima di
      funzionare, e le tre stesure sono scritte accanto a lei: la terza è la
      trappola `Number(null) === 0` presa **mentre scrivevo il commento che
      diceva che lì non c'entrava**.
- [x] ✅ **IL TESTO CHE MENTE — filo nuovo, e in una sera ha reso 53 frasi**
      (`6c738f7`). Conti (4.746 frasi rese, **22 stringhe in 9 punti**), Terra
      (744 righe, **18 punti**), Genesi (838 censite, **13**). Le tre che
      contano più delle altre:
      · **Conti**: «LORDO (T)», «TARA (T)» a schermo **e sul DDT stampato** —
        su un documento ex DPR 472/1996 la tonnellata diventava un **tesla**;
      · **Terra**: sul foglio che va all'**ente**, «1 **indicativi**», mentre le
        altre due voci dello stesso elenco erano giuste;
      · **Genesi**: una previsione **presentata come un fatto** — la PPV
        cambiava da 6,4 a 2,8 mm/s accendendo una legge di sito che il modulo
        stesso dichiara provvisoria, e tre superfici mostravano solo il numero.
      ⛔ E tutti e tre hanno trovato **una copia debole di `conta`/`plurale`**
      nella propria app senza saperlo l'uno dell'altro (`plur` con 103 usi in
      Conti, `_ricPlur` in Genesi, e Terra ne stava scrivendo una terza).
      Adesso sono alias, e le prove pretendono l'**identità**.

- [x] ✅ **Banco `uno-solo.mjs`**: cerca «1 <plurale>» nel testo **reso** di
      tutte le superfici — 67 schermate, 176.000 caratteri, 33 parole, 6
      invariabili dichiarate («1 foto» è giusto). Nasce da un fallimento del
      `grep`, che nel core aveva detto «non resta niente» mentre la pagina
      diceva ancora «1 rapportini». Ha trovato subito un «1 rapportini» in
      **Campo**, che nessun cantiere stava guardando.
      ⚠️ Al primo giro ha **accusato un innocente** («1 MEZZI» in Flotta: due
      piastrelle di KPI unite dall'a capo di `innerText`).

- [ ] **I ternari del singolare che restano nelle app.** Non si traducono in
      una notte; quando si fa, si fa con `conta`/`plurale`, non a mano. I tre
      cantieri del filo «il testo che mente» stanno guardando lì.

- [x] ✅ **Il banco delle modali su Terra: 0 difetti** (6 modali aperte su 11,
      22 aperture, 188 elementi). Risultato pulito e onesto, che prima della
      correzione di stamattina quel banco non sapeva produrre.

- [x] ✅ **La dimostrazione del core era vuota dove l'app lavora** (`63928d4`):
      `@volate` da **0 a 4** righe cliccabili. I casi sono scelti — uno senza un
      solo foro misurato, uno misurato senza la maglia — perché sono i due stati
      che l'app ha imparato a raccontare oggi, e metterli nella dimostrazione è
      il modo di mostrarli.
- [x] ✅ **Il numero ha smentito il commit di prima** (`301b5b7`): le modali del
      core restano **0 su 68**, il selettore non era la causa. Scritto nel file
      perché il prossimo non ricominci da lì.
- [x] ✅ **Le 5 violazioni AA del core** (`d2f86db`). Tre erano già state chiuse
      da `71875c1` — la riga era **scaduta**, il difetto della direttiva 7 fatto
      da noi. Le due rimaste sono state trovate solo facendo **una seconda
      domanda che non si era mai fatta nessuno**: ⛔ *e quello che adesso non si
      dipinge?* Il banco del contrasto misura 343 testi e risponde «0 sotto
      soglia» — vero, e muto su tutto ciò che compare solo in un momento
      difficile (il pallino delle notifiche, la pillola «non salva», il toast,
      gli avatar dei ruoli). `.av-su` **2,65:1** (le iniziali di una persona e
      il numero di riga del registro accessi) e `.av-mz` **3,35:1** («MZ», «€»)
      → **5,69** e **5,43**, tinte più profonde della stessa famiglia. Scatto
      prima/dopo guardato; verificate a mano prima di toccare un colore, perché
      `.av` è 12px in 800 e quindi la soglia è 4,5, non 3.
      ⛔ **E il censimento nuovo ha sbagliato tre volte prima di funzionare**,
      tutte e tre «il controllo che non guarda dove crede»: una regola di stile
      **ora ha `cssRules`** (CSS annidato) e `if (r.cssRules) continue` saltava
      **620 regole su 649** rispondendo «0 candidate»; un `.catch(() => [])`
      ingoiava l'eccezione stampando lo stesso zero; e la prima versione
      accusava `.chart-bar` a 1,56:1, cioè un colore per il testo che ce
      **avevo messo io**. Controprova `--controprova-censimento` nel giro:
      una classe che nel DOM non compare mai, trovata e bocciata.
      ✅ **E poi girato su tutte e quattordici le superfici, su una copia
      immobile del committato** (i cantieri stavano scrivendo). Il risultato va
      detto com'è, senza gonfiarlo: **4.443 testi misurati, 0 sotto soglia**;
      **220 classi** con un fondo proprio non compaiono mai durante il giro, ne
      sono state fatte comparire e misurate **41**, e **nessuna** è sotto
      soglia. Cioè: **il core era l'eccezione**, le sei app su questo asse sono
      pulite. Le altre **179** restano dichiarate come «non giudicabili fuori
      dal loro posto» — poggiano sul fondo di chi le contiene, e misurarle in
      un contenitore inventato vorrebbe dire accusarle per dove le ho messe io.
      Un censimento che non trova niente è una risposta, non un fallimento:
      quello che dimostra è che le due del core non erano la punta di nulla.

### B — Lo standard delle funzioni, app per app (martedì → venerdì)

- [x] ✅ **B1. La caccia sistematica ai numeri tranquilli.** Chiusa il 02/08, e
      il numero che conta è il **rapporto segnalati/veri**: sette giri di
      affinamento, dal primo cercatore (1.127 segnalati, illeggibile) al
      finale — **16 segnalati, 12 veri, 3 su 4**. Il 01/08 un controllo era
      stato scartato con 2 veri su 8: qui il rapporto è invertito.
      Perimetro dichiarato: 7 moduli dati, **16.584 righe**. Punti per app:
      campo 2 · conti 4 · flotta 3 · scudo 0 · sentinella 1 · terra 6 · genesi 0.
      I due che pesano di più, misurati: `apertoDi` legge una fattura da mille
      euro come **saldata** (`+null` fa 0 e `Number.isFinite(0)` è true), e
      `giorniFraDate` dà **60 giorni** su una scadenza al **30 febbraio**.
      Scelta di consegna: **stampa e dichiara**, non fa cadere la CI sui punti
      nuovi — con un falso su quattro una regola che ferma un cantiere verrebbe
      spenta. Pretende invece l'altra metà, quella senza rischio: nessun punto
      dichiarato che non si presenta più. *(Testo originale:)* La
      `sonda-vuoto` esiste già e ne dichiara sette: va estesa a cercare il
      **pattern** — `+null`, `|| 0`, `Number.isFinite(0)`, una media senza
      denominatore, un rapporto con numeratore e denominatore su periodi
      diversi — e a **contare quanti ne trova in ognuna delle sei app**. Il
      numero è la misura del lavoro che resta.
- [x] ✅ **B2. Chiusa il 02/08 — ma i due difetti del mandato erano GIÀ chiusi.**
      Corretti il 01/08 alle 23:05 e 23:08 (`b84c594`, `3cfef1d`), con le prove:
      questa riga era un **«non c'è» scaduto**, scritto dal kickoff arrivato
      *dopo* le correzioni. È esattamente il caso descritto in CLAUDE.md —
      rileggere il documento non basta, perché il documento è la cosa vecchia.
      Quello vero, trovato dal cantiere e vivo in HEAD, era un altro: `ppvLimit`
      risponde `null` per **due** ragioni e la scheda le raccontava tutt'e due
      come «frequenza illeggibile», mandando a correggere il campo giusto.
      Ora `ppvSenzaSoglia` le distingue e `ppvLimit` la chiama invece di
      ripetere le guardie. Le soglie USBM/DIN **non sono cambiate**: impronta su
      12 norme × 20.025 frequenze, `sha256` identico prima e dopo.
      E il secondo difetto **non era raggiungibile**, dimostrato invece che
      dichiarato (6.700 insiemi costruiti apposta + il confine analitico): non è
      stata inventata una correzione per un caso che non esiste.
      *(Testo originale:)* un
      **codice di norma sconosciuto** prende in silenzio la soglia residenziale
      (l'etichetta e il numero raccontano due cose diverse), e `sitoFit` scrive
      **`r2: 0`** dove r² non è calcolabile.
- [ ] **B3. Genesi continua a uscire dalla pagina.** ⏱️ *Numeri rimisurati il
      06/08, perché erano invecchiati di tre unità mentre nessuno se ne
      accorgeva — «186 → 174» era il conto di due giorni prima.* Oggi, contati
      lanciando `copertura-funzioni.mjs` e `genesi-estraibili.mjs` invece che a
      memoria: **171** funzioni ancora dentro `genesi.html`, e le estraibili
      **senza rifare il modo in cui Genesi tiene il suo stato** sono **87** —
      59 leggono una o due variabili del modulo (si portano fuori
      passandogliele), 6 scrivono nel DOM e restano dov'è giusto che restino.
      Le altre **84** non sono un trasloco: sono una decisione di architettura,
      e vanno chiamate così invece di finire in una stima ottimistica.
      È l'unico pezzo di prodotto che vive quasi tutto fuori dalla portata
      delle prove.
- [ ] **B4. Le mancanze confermate del delta**, in ordine di quanto le chiede un
      ispettore. ⏱️ **Ricontate il 07/08 leggendo i documenti**, non a memoria —
      il conto qui scritto era del 02/08 e si era mosso parecchio:

          | app | «CONFERMATA ASSENTE» | «SCADUTA» |
          | campo 11 · sentinella 13 · conti 8 · flotta 5 · terra 4 · scudo 0 |
          | totale **42** (era 54) | totale **18** (erano 6) |

      ⚠️ **Correzione dello stesso pomeriggio: 41 → 42.** Il primo conto cercava
      `CONFERMAT[AO] ASSENTE` e ha perso l'unica riga al plurale, «CONFERMATE
      ASSENTI». Censito il vocabolario intero della colonna del verdetto:
      **C'è 31 · CONFERMATO/A/E ASSENTE/I 42 · C'È A METÀ 19 · FALSA 4**.
      Un conto fatto con un termine invece che col vocabolario sbaglia sempre in
      difetto, ed è la ragione per cui il vocabolario adesso è scritto qui.
      ⚠️ **E lo zero di Scudo va detto meglio di come l'avevo detto**: non «le
      scrive con altre parole» — la sua tabella è organizzata **per funzione**
      (`Redazione automatica DVR`, `Organigramma dinamico…`) invece che per
      verdetto in grassetto, e la parola «assente» compare **7 volte nella
      prosa**. Cioè quel documento non è confrontabile con gli altri cinque
      finché le sei tabelle non parlano la stessa lingua.

      Cioè in cinque giorni **tredici mancanze si sono chiuse** e la riga se n'è
      accorta: è il numero che la regola «chi chiude un'unità aggiorna la riga
      del documento che gliel'aveva proposta» esiste per far muovere, e si sta
      muovendo nel verso giusto.
      ⚠️ **E lo zero di Scudo non vuol dire che Scudo non abbia mancanze**: quel
      documento le scrive con altre parole («gli export sono quattro, non tre»,
      «resta assente il ponte»), quindi questo conto misura una **forma di
      scrittura**, non la verità. Un conto che dipende da come è scritta una
      riga va letto sapendolo — e sistemarlo vuol dire uniformare le sei
      tabelle, non stringere la ricerca.

### C — Ricerca continua, nei tempi morti

- [x] ✅ **C1. Verificate contro il codice** (07/08) le tre proposte della
      ricerca sulle verifiche periodiche delle attrezzature (D.Lgs 81/08 art. 71
      e Allegato VII, D.M. 11/04/2011). **Una su tre era giusta com'era scritta**,
      e le altre due andavano dette in un altro modo — che è il punto per cui
      questa verifica esiste:
      1. **il verificatore non è tracciato → VERO.**
         `grep -ci verificator` e `grep -ci organismo` su `apps/scudo/scudo-data.js`
         e `apps/scudo/index.html`: **0 e 0 in tutti e quattro**. Una
         `scadenze/{id}` porta `{lavoratoreId, tipo, descrizione, dataScadenza,
         stato}` e basta: **chi** ha eseguito la verifica (ASL/ARPA o organismo
         abilitato) non ha un campo. È la seconda cosa che un ispettore chiede
         dopo «quando».
      2. **il verbale non allegato → DA RISCRIVERE.** Gli allegati **esistono**
         (`documenti/{id}` ha `allegatoNome` e `allegatoData`, `grep -ci allegat`
         dà 17 e 32), ma vivono sui **documenti**, non sulle **scadenze**:
         il verbale si può archiviare e **niente lo lega alla scadenza che
         chiude**. La mancanza vera è il *legame*, non l'allegato.
      3. **l'esito come testo libero → FALSO, ed è peggio: non c'è affatto.**
         `esito` compare 80 e 225 volte, ma su **azioni** e **ispezioni**: nello
         schema di una `scadenze/{id}` non c'è nessun campo esito. Quindi non è
         un campo da irrigidire, è un campo da **aggiungere** — e con l'esito
         va deciso che cosa vuol dire «verifica con prescrizioni», che è lo
         stato in cui una cava si trova davvero.
      ⛔ Due «non c'è» su tre riscritti: è la stessa proporzione misurata il
      01/08, e la ragione per cui niente entra in roadmap sulla parola di chi
      propone.
- [x] ✅ **C1-bis. I tre campi della verifica periodica** (`7395e87`):
      `ENTI_VERIFICA` (INAIL, ASL, ARPA, soggetto abilitato — quattro istituti
      giuridici, ognuno con la sua fonte), `ESITI_VERIFICA` con «idonea con
      prescrizioni» **dichiarato dedotto dalla prassi** e la data entro cui
      chiuderle, e il legame col verbale.
      ⛔ **E il legame NON è `origineTipo`/`origineId` come avevo detto io**: quella
      forma è polimorfa perché l'altro capo sono sei collezioni, qui è una sola —
      `origineTipo` sarebbe una costante e direbbe il verso sbagliato. È
      `verbaleId`, coi **tre stati** di `idoneitaOperatore` (`assente` ≠ `rotto`).
      ⚠️ E gli **scatti** hanno trovato due difetti che nessuna prova vedeva: una
      pastiglia verde «REGOLARE» attaccata a una rossa «PRESCRIZIONI SCADUTE»
      (nessuno legge due pastiglie come due domande: vince la tranquilla) e un
      emoji dove l'elenco dice «icone disegnate».
      Prove **1844 → 1853**, copertura **688/688**.
- [ ] **Le due code della verifica periodica**: la prova della modale vive in
      scratchpad (21 prove, 21 passate) e va portata in `tests/browser/` **e
      registrata in `tutti.mjs`**, se no alla sessione dopo non esiste; e il
      contrasto di Scudo è misurato **solo nel tema buio** (612 testi, 0 sotto
      soglia) — chiaro e sole vanno rimisurati.
- [ ] **C2. Ricerca a rotazione**, una app per giro, col vincolo che ha fatto la
      differenza: **incollare il comando e la sua uscita** per ogni «non c'è».
      Misurato su tre tornate: chi va a cercare **il meccanismo** nel modulo
      rende 3 proposte su 3; chi cerca **la nostra parola** rende 1 su 5.

### E — Rimandati dalla settimana dell'estetica (aperti, non decaduti)

- [ ] **E0.** Consolidamento in `shared/` — proseguito parecchio stanotte (data
      italiana, lettura CSV, allegati, conto dei giorni, unità di misura), resta
      il censimento di ciò che è ancora scritto due volte.
- [ ] **E7.** Genesi — allineamento delle parti 2D/HUD al core (la scena 3D
      resta come sta: è un'altra cosa).
- [ ] **E8.** Verifica finale: le sette pagine affiancate devono sembrare la
      stessa famiglia.
- [ ] **G7–G9.** Genesi: ottimizzatore di volata, report professionale,
      rifiniture di scena.
- [ ] **Q1.** Proposte di `docs/RICERCA_DEEPWORKID_202607.md` (ruoli reali
      dentro l'organizzazione) — legata alla decisione **10b/10c**.

## Vincoli

- Non pushare mai su `main`: si lavora sul branch di sessione, per `main` si
  passa da Pull Request.
- Nessuna spesa (domini, piani a pagamento) prima della commercializzazione.
- ⛔ I dati di riferimento del fondatore non compaiono **mai** in interfaccia,
  export o documenti.
- ⛔ Soglie di sicurezza (curve USBM/DIN), dati di default sensibili e
  mitigazione password: **non si toccano** senza conferma esplicita in chat.
- Commit piccoli e frequenti; un checkpoint **nuovo** per ogni unità completata,
  mai sovrascritto.

- [x] ✅ **Il rapporto stampato di Campo** (`6048442`): un fermo mai misurato e
  uno da 55 minuti erano **la stessa riga**. Misurato premendo il bottone.
- [x] ✅ **Il delta di Campo riverificato** (`adce399`): «contractor induction»
  da assente confermata a ⏱️ **scaduta in parte** — l'anagrafe appaltatori di
  Scudo era entrata **due ore e mezzo dopo** che la riga la dichiarava assente.
  Arretrato di Campo da 12 commit a **0**.
- [x] ✅ **Sentinella · il report per l'ente** (`1fef8c0`): «Conforme» su un anno
  **misurato per tre mesi**, e nessuna riga del foglio lo diceva.
- [x] ✅ **Flotta · il giro macchina** (`924721d`): il badge usciva verde o rosso
  **a seconda dell'ordine dell'elenco**, e tre centimetri più su la stessa
  schermata diceva già «1 con anomalie».
- [x] ✅ **Conti · i documenti stampati** (`4a389aa`): «**IVA 19%**», un'aliquota
  che in Italia non esiste, ricavata per divisione e finita in tre posti.
- [x] ✅ **Il banco del contrasto accusava quattro colori sani del core**
  (`85ab6cc`), e il checkpoint diceva di **scurire la palette del fondatore**.
  Tre trappole nuove, tutte nel verso che **accusa**.
- [x] ✅ **Conti · la cifra dello stato «grave»** (`3250e33`): 2,17:1, il numero
  meno leggibile della pagina era quello che compare quando c'è un problema.
- [x] ✅ **Terra · il file dei rilievi** (`f274e91`): la **stima** di un rilievo
  mai fatto usciva come volume misurato, e le date senza l'anno.
- [x] ✅ **Regola 24** (`fc10c5b`): un gradiente che dipinge cifre porta il suo
  conto accanto — e sta in una suite `node`, perché **il banco vede solo gli
  stati che la dimostrazione mette in scena**.
- [x] ✅ **Campo · il near-miss dal fronte** + **Scudo · i CSV** (`88bc73f`): la
  mancanza riverificata come la più importante di Campo. Un compositore solo, in
  `shared/`, con la prova d'identità che il record di Scudo non è cambiato.
- [x] ✅ **Conti · il tasso di mora scaduto da 34 giorni** (`898b454`), citato
  come vigente in una lettera che nomina la legge. Tre stati, e `null` non è «sì».
- [x] ✅ **La scheda sulle norme smentita** (`19098db`): tre affermazioni su tre
  false in una sezione sola. La riga DUVRI resta **ferma**, dichiarata.
- [x] ✅ **Cinque funzioni chiamate che non esistevano** (`1cd1c73`, `757f0b9`),
  e **quattro erano messaggi d'errore**: i messaggi che spiegano cosa non va
  lanciavano un ReferenceError invece di comparire. Da lì `nomi-liberi.mjs`.
- [x] ✅ **Il core** (`b35f647`): una striscia invisibile — il toast con
  `pointer-events:auto` — copriva **6 comandi su 137**, due dei quali di
  esportazione. E la versione giusta era già in `shared/`: qui **la copia era
  migliore dell'originale**.
- [x] ✅ **Regola 25** (`aae9fb9`): un elemento fisso e invisibile non deve
  mangiare i tocchi, verificato su 14 superfici.
- [x] ✅ **Flotta · i fogli stampati** (`998a60e`): «€ 12.750,00» chiede 169 px
  in 138 **solo sulla carta**, sul foglio che si dà a chi compra la macchina.
- [x] ✅ **Sentinella · i fogli stampati** (`b03e2df`): una lettura datata **30
  febbraio** contata solo dal documento per l'ente, che diceva «Non conforme»
  mentre lo schermo diceva zero superamenti.
- [x] ✅ **Genesi · il foglio che si porta in cava** (`56747db`): non diceva
  **SUPERA** dove lo schermo lo dice, non aveva l'airblast, e il confronto A/B
  regalava cinque celle verdi a una **calibrazione**.
- [x] ✅ **Il ponte Genesi → Sentinella** (`f9e71de`): una legge tarata su **tre
  referti** arrivava «calibrata». Nessuna delle due app sbagliava da sola: il
  fatto si perdeva **nel passaggio**.
- [x] ✅ **Scudo · i documenti che escono** (`1857d83`): **cinque cartelle su
  sette** uscivano dalla stampante dichiarandosi «complete», in grigio, con
  dentro una visita medica **scaduta** e un DPI da sostituire. `completa`
  risponde a «ci sono sezioni senza righe?» — è una domanda sola, e finché era
  l'unica una cartella piena di roba scaduta si dichiarava tranquilla. Più: lo
  **stato del documento** che sul fascicolo usciva come una cella bianca, il
  riepilogo per persona scritto a mano con **tre risposte su quattro** (sale in
  `shared/`, `statoPeggioreScadenze`), e il promemoria che su una riga «senza
  data» rispondeva con un motivo **falso**.
- [x] ✅ **La dimostrazione dichiarata sui fogli stampati** (`3be554d`), Conti e
  Terra: in modalità tour lo schermo lo dice **due volte** e la stampa nasconde
  tutt'e due. Un foglio di dimostrazione — il DDT che viaggia sul camion, il
  prospetto che si allega alla comunicazione annuale — si portava a un
  controllo senza niente che lo distinguesse da uno vero. In Terra la stampa lo
  nascondeva ancora meglio: i due fogli vivono in una **finestra nuova**, dove
  il `@media print` della pagina non arriva mai.
  ⚠️ Restano **Scudo e Campo** (cantieri aperti) e **i CSV di tutte e sei**.
- [x] ✅ **Terra riverificata** (`3e92bf2`): le quattro assenze reggono dopo
  sedici commit, e **l'arretrato dei documenti scende da 57 a 41**. ⚠️ Ma la
  riverifica stava per dire il contrario: il primo `grep` rispondeva 21/33/5
  occorrenze, e guardando **che cosa** aveva trovato erano «taglio» dentro
  *detta·glio·* e «floating» in un commento. **Un conto senza il suo campione
  non è una misura.**
- [x] ✅ **Genesi esce dalla pagina** (`6c8e902`): **171 → 166** funzioni fuori
  dalla portata delle prove. Il gruppo scelto è **il caso che resta lo stesso**
  — il posto dove un difetto non si vede, perché un generatore rotto
  restituisce comunque numeri fra 0 e 1. Spostate identiche carattere per
  carattere; scena 3D prima/dopo: **0 pixel diversi su 408.500**.
- [x] ✅ **Scudo · la gravità potenziale** (`50dfe1b`): «e se fosse andata
  male?», con **«non lo so» come pulsante** e non come cella vuota. Con 4
  valutazioni su 5 l'app **si rifiuta di fare la classifica** e lo dice.
  Copertura **656/656**. Tre difetti presi da tre controlli diversi, fra cui
  `badge info` che è una **collisione di nomi** nel CSS condiviso: la pastiglia
  ereditava `flex:1 1 120px` e prendeva 460 px.

- [x] ✅ **Il banco delle unità era cieco sulla tonnellata** (`65df01b`):
  `unita-maiuscole.mjs` diceva «nessuna unità in maiuscolo» mentre «LORDO (T)»
  era a schermo e **sul DDT stampato**. La `t` **nuda** non era in elenco (c'erano
  `t/m³` e `€/t`: è quella somiglianza che rende il buco invisibile). Le due
  misure fatte **prima** di cambiare, su una copia di `HEAD`: col difetto vero
  rimesso, elenco vecchio **0** violazioni e nuovo **2**; su 14 superfici sane
  **0** falsi allarmi. ⛔ E la sua controprova provava **una unità su 33**:
  adesso ne inietta una per ognuna e stampa **35/35**.
- [x] ✅ **Scudo · il testo che mente** (`4c323eb`): «1 segnalazione **SONO**
  meno di 5» anche nel CSV che esce dall'azienda — il sostantivo il singolare
  ce l'aveva, a mancarlo era il **verbo**. E dentro `cartellaLavoratore` una
  copia debole di `conta` che su `null` scriveva «**null** scadenze» sul
  fascicolo che si mostra a un ispettore: **quarta app in un giorno** a
  riscriversela in casa. ⚠️ Tre `const conta` locali **ombreggiavano** il nome
  importato: rinominate.
- [x] ✅ **Flotta, Campo e Sentinella con UN dato solo** (`912a8b3`): **24**
  frasi in Flotta, a partire dalla **prima che si legge aprendo l'app** («1
  mezzi operativi su 1»); in Sentinella «misure registrate in **1 giorno
  diversi**» sul foglio per l'**ARPA**; in Campo il verbo, perché «attività» è
  invariabile. I casi si costruiscono nei **dati serviti** (`rotte` in
  `apriSuperficie`), mai sul file. Banchi **112 → 116**. ⚠️ I due KO del banco
  di Flotta erano **due id inventati dal banco**, non pezzi mancanti di
  prodotto: sesta volta in un giorno che sbaglia il controllo.

- [x] ✅ **In Flotta «è ripartito» non faceva NIENTE da una settimana**
  (`942db1e`): `chiediDati()` chiamata **sei volte** e mai definita — il commit
  `486011d` del 31/07 aveva portato in `shared/dw-app-ui.js` **sette** delle
  otto funzioni della struttura del core, e la ottava la usava una app sola.
  Provato **premendo il bottone**: `chiediDati is not defined`, 0 modali. Dopo:
  1 modale, 0 errori.
  ⛔ La parte che vale più della correzione: `nomi-liberi.mjs` esiste apposta
  per questa famiglia e diceva verde. Il riconoscitore dei dichiarati prendeva
  **tutta la riga**, quindi legava ogni parola sulla stessa riga di un `const`
  — cieco sulla forma più frequente che il codice abbia. Stretto: **2** falsi
  allarmi nuovi in tutto, dichiarabili per nome, e **1 difetto vero**.
  ⚠️ E `UI_CONDIVISA` di `run-stile` aveva **6** nomi a mano contro i **10**
  che la struttura espone: adesso è derivato.
- [x] ✅ **La ricerca sul DDT verificata prima di entrare in roadmap**
  (`78fd448`): i due «non c'è» (*porto*, *aspetto esteriore*) sono **veri**, ma
  la giustificazione era inventata — «DPR 472/1996 art. 7 e 8» non esistono (è
  un **articolo unico**), e quei due elementi erano requisiti della **bolla di
  accompagnamento** che proprio quel decreto ha **abolito**. Le nostre quattro
  citazioni della norma in Conti sono invece **corrette**. Le due proposte
  restano buone come **prassi commerciale**, mai come obbligo di legge.

- [x] ✅ **Venti classi che nessun foglio definiva** (`eb05653`): censite le
  classi usate in un `class="…"` letterale su 12 pagine contro quelle davvero
  definite — **20 orfane su 1158**. In **Flotta** due difetti veri: quattro
  bottoni `mini` a **grandezza piena** (la riga era scritta identica in
  **cinque** app e mancava alla sesta) e due avvisi che **non erano rossi**
  (misurato: `rgb(242,228,237)`, cioè il colore del testo normale → dopo
  `rgb(240,94,92)`). In **Scudo** altre due, passate al cantiere che ha il file.
  ⛔ E la prima correzione **non mordeva**: messa nel foglio sbagliato, il
  browser rispondeva ancora 13px — non la specificità, l'**ordine di
  caricamento**. `getComputedStyle` l'ha detto in tre secondi.
- [x] ✅ **L'etichetta che dichiarava più copertura di quella che aveva**
  (`dc858f6`): «25 export, 4 app» quando ne preme **32** su **cinque**. Il conto
  è stato **tolto**, non aggiornato — un numero a mano dentro un controllo
  invecchia da solo. E l'elenco derivato della struttura condivisa adesso ha la
  prova che non può riaccorciarsi: con quello a mano restavano fuori `avvisa`
  (5 usi), `mostraTesto` (1) e `chiediDati` (6).

- [x] ✅ **Genesi · i file che escono** (`d07ca2f`): i nove bottoni che salvano
  un FILE non li aveva mai aperti nessuno. Aperti, **32 numeri** confrontati col
  loro valore a schermo: il file di scambio scriveva lo **scatter d'innesco**
  invece del ritardo (`42` → `42,332516881726825`) e il giro di andata e ritorno
  riportava una volata da **42 ms a 25**; la scheda archiviata col rapportino
  non diceva da dove viene la PPV (due file identici tranne una riga, 1,9 contro
  4,1, con la legge dichiarata **provvisoria** dallo schermo); l'airblast non
  c'era; e la riconciliazione, coi valori scritti **con la virgola** come si
  scrive in cava, faceva **sparire** tre misure dallo storico.
- [x] ✅ **Campo · i file che escono** (`3e03c7c`): 22 documenti aperti premendo
  il bottone, **347 celle** confrontate. Il grave: un rapporto **datato 07/08**
  con `2.510 t`, di cui **2.300 t** da un rapportino **senza data**, e zero
  dichiarazioni — mentre lo schermo lo dice **due volte**. ⚠️ Il numero non era
  sbagliato: mancava la dichiarazione, e la regola giusta era già nel modulo,
  usata dallo storico e non dai documenti. Più cinque frasi col numero 1.
  ✅ E dove Campo era già a posto, col conto accanto: `ore_lavorate` resta
  **vuota** (non `0`) quando manca un orario, provato su 5 persone in 5 stati.

- [x] ✅ **Il rosso che ho corretto non si vede nella dimostrazione**
  (`4e13874`): avevo misurato `b.bad` su un elemento **iniettato**. Cercandolo
  **vero** su tutte le sezioni di Flotta: **zero** `<b class="bad">` visibili —
  i due casi che li producono nei dati d'esempio non capitano mai. La regola è
  giusta, ma **nessun banco può vederla oggi**, e dirlo cambia quanto vale quel
  verde. ⚠️ Un pieno senza spesa fra i dati d'esempio renderebbe **visibile la
  funzione** e **misurabile la regola**: unità a sé, da fare ad albero fermo.
- [x] ✅ **CLAUDE.md · un file di scambio porta il nominale, non il campione**
  (`9bc3e66`): famiglia nuova, dal difetto di Genesi. Il segno da riconoscere è
  **un numero con quindici decimali dove lo schermo ne mostra zero**, e il modo
  di prenderlo è **rifare il giro** — il file da solo è coerente con sé stesso.
- [x] ✅ **I riferimenti della roadmap erano fermi al 03/08** (`6d6727e`):
  dicevano 2.092 prove e 84 banchi, sono **2.193** e **120**. Con lo storico
  conservato e la nota che quei tre numeri non si scrivono a mente.

- [x] ✅ **Scudo e Conti con un dato solo** (`4ecf023`): **30 frasi**, e in
  tutt'e trenta **il sostantivo era già giusto** — a mancarlo erano il verbo, il
  participio, l'aggettivo. Le due che escono: nel CSV L. 198/2025 «l'unico
  near-miss … **Sono** meno di 5», e nel promemoria mandato al lavoratore
  «SCADUTA dal 06/08 (**1 giorni fa**)». In Conti otto messaggi di export
  («**Esportate** 1 fattura») e `margineMese` che scriveva «mancano **i costi
  di** personale» con una voce sola.
  ⛔ E il setaccio classico «1 <plurale>» è **cieco** su questa famiglia,
  misurato: resta verde mentre 13 asserzioni cadono. Da lì un secondo setaccio
  che guarda la parola **prima** del numero.
  ⛔ E la mia proposta su `.acc` era **sbagliata**: il cantiere l'ha misurata —
  `.dw-accent` è battuta da `.note b:not(.badge)`, non cambiava un pixel, e su
  `--card2` fa 4,30:1, **sotto AA**. Tolta invece che sostituita.
- [x] ✅ **Sei bottoni di Genesi erano bottoni di sistema** (`6781700`): grigio
  `rgb(239,239,239)`, testo nero, raggio **0**, **Arial** — dentro un'app con la
  sua palette, e sono proprio **quelli che producono i documenti**. `btn-sec` non
  è mai esistita; la classe vera è `btn`, che usano già 35 bottoni suoi.

- [x] ✅ **Il banco delle modali guardava 11 finestre su 68 del core**
  (`e5b1405`): adesso ne apre **38**, con **176 aperture vere** (le 436 di prima
  erano gonfie). Tre cause misurate, e la prima vale per chiunque scriva un
  banco: il controllo «sono rimasto dove ero?» era `p.url()`, e in una app a
  **schermata sola** l'indirizzo non cambia mai — rispondeva sempre di sì.
  `SEZIONI_CORE` conteneva **17 schermate su 33**: ogni banco del browser
  guardava metà core. Dentro le finestre nuove: **cinque `<a>` alti 15 px** (fra
  cui numeri di telefono), la **data tagliata** dove distingue cinque rapportini,
  e la Dashboard che rendeva il documento largo **678 px su uno schermo da 390**.
- [x] ✅ **Terra e Sentinella con un dato solo** (`5b4c82e`): **9 frasi**, e una
  finisce nella «**Riferibilità delle misure**» del report per l'ARPA. ✅ Il
  report ARPA però è **pulito** (4.626 caratteri, 0 frasi) e con un punto senza
  soglia dice «Senza soglia», non «Conforme».
- [x] ✅ **Il registro infortuni usciva senza dirsi dimostrazione** (`38fdb23`):
  Scudo lo dichiarava sui fogli **stampati** e non sui **CSV**. E la controprova
  ha detto di essere **mezza cieca** invece di tacere.
- [x] ✅ **La mora si calcolava sullo stornato** (`c59eb83`): `apertoDi` passava
  le note di credito in **12 chiamate su 15**; le tre rimaste erano nella pagina,
  e una chiedeva interessi ex D.Lgs 231/2002 su un importo **già stornato**.
- [x] ✅ **Due elenchi di rilevatori invece di uno** (`38a03da`): «nessuna frase
  al plurale» voleva dire due cose diverse a seconda del banco — ed erano
  **tutt'e due verdi**.

- [x] ✅ **Un rosso che voleva dire verde** (`ba8ede8`): la controprova di
  `ripiego-messaggio` stampava **la stessa identica frase** della passata sana, e
  nel registro del giro completo le due righe stanno a centosessanta di distanza.
  Ci sono cascato: ho aperto un cantiere su **dieci difetti che non esistevano**.
  ⛔ Ma sotto ce n'era uno vero e più grave: la controprova si accontentava di
  `falliti > 0`, quindi avrebbe detto «SA fallire» anche col **banco rotto** e il
  rilevatore mai messo alla prova. Adesso guarda **quali** asserzioni cadono —
  zero sulla struttura, ogni caso morso — e su tre difetti rimessi dà tre
  diagnosi giuste. Stessa trappola cercata negli altri quattro banchi: uno solo
  ce l'aveva.
- [x] ✅ **`ords` con la esse non esiste** (`9c5e3c1`): tre filtri di Scudo con
  `display:block` e `gap: normal` invece di `flex` e `gap:8px`. Il refuso di una
  classe **non fa rumore** — nessun errore, nessuna prova rossa, niente da
  leggere. Trovato dal censimento delle classi orfane, misurato col browser.
- [x] ✅ **Il traboccamento all'indietro non era di un elemento: era di una
  parola** (`6a975bf`): l'unico KO del giro. A 320 px il corpo del core andava a
  **333 px** e nessun elemento sporgeva a destra, perché il colpevole **non è un
  elemento**: è il messaggio che `build3D` scrive senza rete, con dentro
  l'indirizzo intero del CDN — una parola sola di 60 caratteri, **345,6 px in
  uno spazio di 320**, che dentro un flex centrato esce **12,8 px per parte**.
  Il testo nudo dentro un flex è una **scatola anonima**: `querySelectorAll('*')`
  non la vede (173 nodi guardati, 0 sporgenti; col `TreeWalker` sui nodi di
  testo, 1 colpevole al primo colpo). ⚠️ E la scelta ovvia era sbagliata,
  provata prima di scriverla: `overflow-wrap:break-word` — la forma che il core
  usa già in `.toast` — lascia il corpo a 333/320, perché non riduce la
  larghezza **minima** e un elemento di flex ha `min-width:auto`.
- [x] ✅ **La prima domanda dava 14 orfane e sette erano ganci di JavaScript**
  (`ed8ec85`): il censimento buttato giù a mano per trovare `ords` è entrato
  nelle prove, ma **non com'era**. «Quale foglio la definisce?» segnalava
  `chk-item`, `uf-cava`, `cv-dest` — classi vivissime, cercate con
  `querySelectorAll`. La **seconda domanda** («ogni occorrenza sta dentro un
  `class="…"`?») porta 14 → **4**, tutte vere. ⚠️ E due dei falsi allarmi
  venivano dai **commenti**, per la terza volta in un giorno.
  Controprova su due versi: 12 refusi iniettati in memoria su 12 pagine, 12
  visti; e un gancio di JavaScript **non** segnalato.
- [x] ✅ **Il registro del giro dice quali passate sono controprove** (`5d298c1`):
  un rosso voluto letto come un guasto **due volte in due ore**, la seconda da chi
  aveva appena scritto la difesa per la prima. La cura non è un setaccio più
  furbo: `tutti.mjs` quel dato ce l'ha in mano (`eControprova`) e finiva solo nel
  riepilogo. **Un dato che il programma ha in mano non si indovina dal testo.**
- [x] ✅ **Non erano due difetti: era l'unico gradiente del core senza un
  inchiostro** (`73f9380`). Le uniche 2 violazioni AA su 4.568 testi e 14
  superfici, tutt'e due nel core: `--grad3` fallisce **alle estremità opposte con
  inchiostri opposti**, quindi ogni superficie dipinta con quel gradiente nasceva
  bocciata. Derivato da `--g-blast`, 452 testi / **0 sotto soglia**, e cinque
  bottoni che scrivevano il rosso a mano diventati **una classe**.
- [x] ✅ **Flotta: un pieno senza spesa metteva una macchina PRIMA in classifica
  a zero euro l'ora** (`4938125`). `spesaInFinestra = 0` → `€ 0,00/h` → prima in
  `pagellaMezzi`: il principio del fondatore nella sua forma più pura.
- [x] ✅ **Le 57 classi che il banco elencava e non giudicava** (`5d57cbc`).
  Composte sulle superfici che l'app **dichiara** (`--bg`, `--card`, `--card2`),
  caso peggiore + forbice: **57 su 57 giudicate, cinque difetti veri** —
  `var(--danger)` usato come **inchiostro** su una velatura rossa, che va
  benissimo da pieno ed è troppo scuro da inchiostro. Il core guadagna
  `--ink-dg`, gemello chiaro di `--ink-su-pieno`. ⚠️ E **quattro KO respinti**
  dopo verifica: sono contenitori d'icona (`<svg>` con `aria-hidden`), per cui
  la soglia è 3 e non 4,5 — dichiarati con la prova invece di spostare quattro
  colori sani. La resa l'avevo stimata in **1** difetto: erano cinque, perché il
  prototipo guardava solo le sei app e non il core.
- [x] ✅ **`vaiA` spendeva 17 secondi per sezione cliccando l'incliccabile**
  (`33b5251`). Apriva **ogni** accordion chiuso della pagina — sette su Flotta e
  Scudo, **tutti invisibili** — e Playwright bruciava 2,5 s per ognuno prima che
  un `.catch(() => {})` se li mangiasse. Scudo da **oltre 15 s a 0,59**, Flotta
  da 9–15 a 0,57, **senza perdere copertura** (614 testi identici, in 22 secondi
  invece di minuti). Non l'avevo causata io: sul commit di ieri gli stessi
  numeri alla decina di millisecondi.
- [x] ✅ **Un banco che si pianta fermava il giro in silenzio, per sempre**
  (`744af32`). Sette ore e trentasette di giro, quattro e trentotto delle quali
  su un banco appeso, aspettato da un `p.on('close')` senza limite. Il danno non
  è il tempo: **il registro si tronca a metà e sembra completo** — l'avevo letto
  tre volte senza vedere che era fermo. Ora un limite per passata uccide
  l'albero, **dichiara** che quella passata non è stata misurata e tira avanti,
  e il giro non può dirsi verde. Controprova nei due versi, 9 prove.
- [x] ✅ **Trentadue frasi che con «1» dicevano «1 righe»** (`a3086fa`,
  `7517c07`). I banchi del singolare guardano quello che la **dimostrazione**
  rende con n=1; il sorgente le ha tutte: «Letto: 1 righe» sull'import di un
  CSV, «negli ultimi 1 giorni» in nove punti di Flotta (`finestra =
  Math.max(1, …)`), «ogni 1 mesi» su un campo libero, «1 letture», «1 fori».
  E la sostituzione **non è meccanica**: con «1» cambiano articolo,
  preposizione e verbo. La regola automatica è stata **provata e scartata coi
  numeri** — 22 falsi su 38 con la finestra di caratteri, **5 su 28** con la
  guardia cercata sulla variabile giusta — e i cinque residui hanno un nome
  (una lista letterale, due termini di legge, «foto» che è invariabile).
- [x] ✅ **La guardia che vede una funzione provata e mai usata** (`1290225`,
  `60d55ce`). `copertura-funzioni` dice «703 su 703» ed è vero: a chiamarle
  sono le **prove**. Su 645 funzioni esportate, **sei** non le chiama il
  prodotto. Il righello ha sbagliato **quattro** volte prima di reggere (i
  commenti spogliati a mano, l'elenco delle pagine a mano, un'iniezione che
  non iniettava, il riepilogo non in fondo). ⚠️ E due delle sei le avevo
  etichettate «da collegare» **giudicando dal nome**: aprendo le pagine erano
  **superate** da forme migliori. «Mai chiamata» non vuol dire «manca».
- [x] ✅ **Il censimento del contrasto guardava una classe su sei** (`bdb7e05`).
  La riga più grossa del giro diceva «234 classi con un fondo proprio non sono
  mai comparse: **41** fatte comparire e misurate», e il banco intanto stampava
  «4700 testi, 0 sotto soglia». Tre difetti del righello, indipendenti:
  «copre?» deciso dal **testo** della dichiarazione invece che dal browser
  (`var(--card)` non lo soddisfaceva: 68 opache su 122 marcate «non
  coprente»); una **combinazione** di classi data per vista perché lo erano le
  sue parti; un campione che **nasce nascosto** e veniva contato fra i
  misurati. **41 → 182 su 239**, e sei difetti veri nel core — fra cui il toast
  d'errore e il badge «scaduta» a corpo 9 — più le **tre pastiglie d'esito** di
  Scudo che in luce diventavano dello stesso viola, perché una regola di
  `shared/` vince per specificità su quella dell'app.
- [x] ✅ **Il sollecito di pagamento di Conti usciva nudo negli appunti**
  (`3177317`). Trovato leggendo la riga «NON MISURATE: conti — copiano negli
  appunti ma non hanno una riga in COME», che il banco dichiarava da giorni in
  fondo a un riepilogo verde. I due testi che una persona incolla in un'email
  per chiedere soldi a un cliente non dichiaravano di essere una dimostrazione.
  La regola sale in `shared/` (era scritta **due volte con due comportamenti
  diversi** e a Conti mancava del tutto); il banco passa da un bottone per app
  a una **lista**: 7 → 19 prove, 1 → 3 uscite raggiunte.
- [x] ✅ **Le unità nude che il banco NON POTEVA vedere** (`d5692f6`). Il banco
  scarta gli elementi senza area — filtro **giusto**, e proprio per questo non si
  aggiusta: lo rende cieco su tutto ciò che compare **dopo**. Il riquadro
  Kuz-Ram del core è `display:none` finché non si calcola, e dentro c'era
  «X50 (cm)» → «X50 (CM)». Rifatta la stessa domanda **staticamente** sul
  sorgente: **7 difetti veri** su 925 elementi, sei nel core, e **uno solo** era
  quello che il banco vedeva. Regola 2 estesa alle pagine (310 → **314**), con
  denominatore (986 elementi, 102 classi, 15 superfici), tre eccezioni per nome
  e la controprova. Il righello ha sbagliato **tre volte** prima di reggere, e
  la terza — il commento CSS che entra nel selettore che lo segue — lo rendeva
  cieco proprio sull'unico caso già noto.
- [x] ✅ **Le unità in maiuscolo: il banco non guardava le maiuscole**
  (`c753ccc`). «Mc totali» renderizzato «MC TOTALI» e il banco diceva pulito. 15
  casi in più, **11 veri** (17 etichette del core, unità in coda fra parentesi
  come negli altri 44 punti) e **4 dichiarati** con la ragione.
- [x] ✅ **Quattro cantieri insieme** (`e34aff3`): **24 grafici su 38 fuori
  scala** in cinque app su sei (il documento diceva «uno su tre», misurato sulle
  sole schermate d'apertura); e in Scudo, Conti e Sentinella la domanda «chi
  decide i numeri di ciò che esce» ha risposto in **quattro versi** — il file più
  povero, **lo schermo più povero**, tutt'e due che tacciono, e **un'uscita che
  nessun banco guardava** (gli appunti, che vanno a una persona). Il difetto che
  pesa: nel sollecito una **nota di credito** usciva come acconto del cliente.
- [x] ✅ **Il banco del contrasto guardava un tema su tre** (`aca474d`). Le app ne
  hanno **tre** e il non misurato che pesa è `sole`, quello per chi legge il
  telefono **in cava, sotto il sole**. ⛔ E aperto quel tema il **righello** era
  rotto: `color-mix()` Chromium lo risolve in `color(srgb 0.16 …)` coi canali da
  **0 a 1**, e il banco li leggeva come 0-255 → **1,01:1** su testo nerissimo su
  bianco. **560 bocciature → 29**, e le 29 sono ancora da guardare. Sul tema
  scuro: 4.638 testi, **0 sotto soglia**.
- [x] ✅ **Tre cantieri interrotti a metà da un limite, portati a termine**
  (`a1bfee4`). `run-kpi` girava già 1841/1841: mancavano una funzione senza prova
  (`terra.numeroRegistrato`), un banco **non registrato né tracciato**
  (`genesi-piano-innesco.mjs`) e i conti dei documenti. Lanciando il banco è
  saltato fuori il suo ultimo KO, vero: il messaggio di conferma non nominava
  l'**innesco**, che è il campo che riaperto sbagliato porta lo scatter da 0,1 a
  8,0 ms in silenzio.
- [x] ✅ **Il righello dei colori adesso lo chiede al browser** (`6043235`). La
  prima correzione era una toppa: `oklab(…)` lo produce il **browser**
  interpolando, e nessun foglio lo scrive. Si dipinge un pixel su una tela e lo
  si rilegge — vale per ogni notazione, oggi e domani; e quando il colore non lo
  capisce nemmeno il browser, la risposta è `null`: **non misurabile non è
  bocciato e non è promosso**. Esito onesto: **54 vere su 3.694** nel tema
  `sole`, due verificate a mano alla cifra.
- [x] ✅ **Il runner del giro riusava il server di un altro giro** (`4643be7`).
  Costato un giro intero e **ventidue KO** che accusavano Scudo di non esistere.
  La regola del contrassegno col pid era scritta in CLAUDE.md dal 01/08 e la
  rispettavano i singoli banchi: **non la rispettava il file da cui dipendono
  tutti**. Controprova nei due versi, `impronta-giro` 10 → **15** prove.
- [x] ✅ **Sentinella nei temi chiari** (`24c4d89`): chiaro **10 → 0**, sole
  **10 → 0**, scuro 0 → 0, testi misurati identici. ⛔ E la scoperta che allarga
  tutto: **non è un difetto del sole, è un difetto di tutto ciò che non è buio**
  — rimisurato da me su tutte e sei le app, `--tema=chiaro` dà **54 sotto
  soglia**, lo stesso numero del sole. Causa unica: `--success/--warn/--danger`
  dichiarati **una volta sola, per il buio**. E servono **due livelli**, non uno,
  se no il numerone d'ambra diventa marrone: si vede solo affiancando gli scatti.
- [x] ✅ **`PALETTE_APP` Parte 6** (`26c0a7a`): le sei palette erano verificate a
  contrasto in **un tema su tre**. La regola che si aggiunge alle otto: *una
  palette non è finita finché non è verificata nei tre temi*.
- [x] ✅ **La forbice del righello** (`c9b0163` + `a3d71cc`): sopra un fondo a
  gradiente il banco accoppiava il pixel d'inchiostro più chiaro col pixel di
  fondo più scuro **anche agli angoli opposti** — 2,92 dichiarato contro **4,71**
  renderizzato — e lo faceva mentre **cinque cantieri sceglievano colori
  guardando quei numeri**. La geometria vera è un cantiere a sé; farla a metà
  sarebbe peggio. Adesso tiene il caso peggiore e **dichiara la forbice**: 4,05
  sui numeroni dentro un gradiente (dove il conto a mano lo smentiva), **zero**
  sui testi su fondo pieno (dove aveva ragione alla cifra).
- [x] ✅ **I due soli KO del giro pulito erano del banco, non del prodotto**
  (`96d96f2`). Schermo e PDF, stesso istante, stesso stato: `46 · 419 · 3466`,
  **coincidono**. Il banco pretendeva numeri esatti fino al 06/08, quando la
  dimostrazione ha guadagnato un quinto rapportino. E crollando ne nascondeva
  **altre undici** (19 prove invece di 30). Adesso i totali sono **derivati** e
  il banco dichiara invece di morire: 19 → **34** prove.
- [x] ✅ **Regola 27** (`1476d45`): **Genesi non ha la modalità sole** e nessuno
  lo diceva — l'ha detto un banco elencando quello che non poteva misurare. Le
  otto superfici senza i tre temi sono dichiarate con la ragione.
- [x] ✅ **Flotta nei temi chiari** (`b50c8b4`): chiaro **13 → 0**, sole **13 →
  0**, testi identici. ⛔ E su **una delle tredici il banco aveva torto** (il
  `.n` verde vale 3,01, non 2,93): l'ha smentito un righello che valuta i due
  gradienti **nello stesso punto fisico**, ed è la settima trappola che la
  forbice segnalava. ⚠️ Conferma indipendente: le tinte scelte sono a **ΔE 8,8 /
  3,2 / 4,6** da quelle che Sentinella aveva già scelto per la **carta**.
- [x] ✅ **Il report del core a periodo aperto si sovrascriveva da solo**: usciva
  `Report_tecnico__.pdf`. ⚠️ E scrivendo la correzione avevo chiamato un
  `oggiLocale()` che **non esiste** — la famiglia di `chiediDati`. Preso
  cercando in casa; verificato che `nomi-liberi` l'avrebbe preso (7/0 → 6/1).
- [x] ✅ **Conti nei temi chiari** (`099f375`): chiaro **10 → 0**, sole **10 →
  0**, buio invariato **ai pixel** (il fondo di rumore degli scatti è identico
  alla differenza prima/dopo). ⛔ E la **regola 24** di `run-stile` accusava
  Conti di **tre cose false**: teneva una mappa sola e un fondo solo, quindi
  misurava la palette di giorno contro la scheda del buio. La faccia che
  *assolve* era peggiore — bastava scrivere una fermata con `color-mix()` o
  dietro un `var()` perché quel gradiente sparisse dai giudicati **in silenzio**.
  Soggetti 17 → **20**, con la controprova di giorno. ⚠️ E `.meta.pesa` era
  tagliata **in verticale**, non in larghezza: il `display:-webkit-box` sta in
  `shared/`, e Chromium lo riporta `flow-root` col clamp ancora vivo.
- [x] ✅ **Terra nei temi chiari** (`f73efba`): chiaro **2 → 0**, sole **2 → 0**,
  testi identici, buio identico **al md5** degli scatti. ⛔ Ma il «2» non era un
  merito: dei **18** `color:var(--stato)` di Terra — il massimo delle sei app —
  il banco ne poteva vedere **uno**. Forzando gli stati mai mostrati dalla
  dimostrazione: **8 misure, 8 sotto soglia**, fino a **1,77:1**. ⚠️ E la
  forbice, letta sul «759k», **non ribalta** il verdetto: 0,08 di scarto, non
  1,8 — dipende da dove stanno le due fermate, e lo dice solo la geometria.
- [x] ✅ **La copertura di Terra, non la sua palette** (`4d611be`): quei cinque
  stati erano a **zero in tutto il documento**. Cambiato il **dato** e non la
  classe (`estrattoPregressoM3` 340.000 → 880.000, cumulato all'**81,8%**):
  `.vita.warn` 0 → 2, `.kpi.warn` 0 → 1, `.riga.att` 0 → 2, e i colori messi
  stamattina **alla cieca** sono adesso verificati sul vero (572 testi, 0 sotto
  soglia nei tre temi). ⛔ E il cantiere ha **smentito il mandato con la
  misura**: `.vita.danger` e `.riga.dng` non sono raggiungibili insieme a
  `warn`, una dimostrazione mostra l'uno o l'altro. Resta aperto: quei due, e i
  sei produttori di `.riga.att` fuori dalla scheda vita cava.
- [x] ✅ **Il prospetto annuale di Terra usciva dal foglio** (`4d611be`), ultimo
  KO aperto del giro: **435 px di documento in 390**, e non era un nodo di testo
  (129 camminati col `TreeWalker`, zero parole inspezzabili) — erano **tre
  tabelle**, perché `nowrap` su `.n` colpiva anche le **intestazioni**. Provate
  e scartate col numero: `anywhere` da solo (402), il margine più stretto (412).
- [x] ✅ **Campo nei temi chiari** (`98fe776`): chiaro **10 → 0**, sole 10 → 0.
  Uno dei dieci era un'accusa falsa (3,15 ai pixel contro 2,86 del banco), e
  cade **fra i quattro con la forbice**. ⚠️ Il giallo a quella chiarezza non
  può restare giallo: il gamut sRGB non ci arriva, ed è dichiarato. E i due
  bottoni gemelli non erano gemelli — «assente» **gridava più di** «presente»
  (4,66 contro 3,13), che è un difetto di significato.
- [x] ✅ **Scudo nei temi chiari** (`73d1ae3`): chiaro **9 → 0**, sole 9 → 0.
  **Sesta app su sei.** Due dei nove passavano già. La risposta per gli avatar
  era **già in casa**: `--app-support` che Scudo dichiara, 5,59:1 con più croma
  di prima. ⚠️ E il righello nuovo ha sbagliato tre volte prima di misurare,
  sempre con lo stesso segno — un rapporto di **1,02:1**, il fondo letto due
  volte.
- [x] ✅ **Il setaccio del campione scappato** (`0b7b46a`): la regola scritta in
  prosa in CLAUDE.md — «quindici decimali dove lo schermo ne mostra zero» — è
  adesso un controllo su **due** banchi, 143 + 2.097 numeri. Soglia **misurata**
  (113/12/18/**zero**), unica eccezione dichiarata per nome. ⛔ E la prima
  stesura era cieca proprio sul file per cui era nata: le guardie contro il
  raggruppamento delle migliaia rifiutavano **ogni numero seguito da virgola**,
  cioè tutto un JSON — `0 numeri guardati` con un **ok** accanto. L'ha preso il
  conto dei soggetti, non l'esito.
- [x] ✅ **I due temi chiari nel giro** (`d8a6f6d`): esecuzioni **129 → 132**,
  e sono entrate **solo adesso** che le sei app sono a zero — registrarle
  stamattina avrebbe messo il giro in rosso tutto il giorno, cioè lo avrebbe
  reso un rumore da ignorare. Tutt'e tre le passate provate a mano prima:
  chiaro 3.694/0, sole 3.696/0, controprova di giorno 6 su 6 bocciate.
- [x] ✅ **I nomi dei due livelli** (`d15fb80`): Conti li aveva chiamati
  `--danger-ink`, le altre cinque `--ink-dg`. Allineati (20 sostituzioni,
  contrasto identico). ⚠️ E la regola automatica per impedirlo è stata
  **pensata e scartata con la misura**: sarebbe stata **5 eccezioni su 13
  nomi**, e un allarme al 38% di eccezioni insegna a non guardarlo. La
  convenzione sta in `PALETTE_APP.md` PARTE 7, con la regola che le sei app
  hanno scoperto separatamente: *un colore che fa anche da pieno non si
  riscrive, gli si affianca un inchiostro*, e gli inchiostri sono **due
  livelli**.
- [x] ✅ **L'arretrato dei documenti conta anche quello che morde** (`f49a3dd`):
  **33 grezzi → 7 che mordono**, Flotta a **zero**. Le sei palette di stamattina
  avevano alzato il contatore di sei senza toccare una funzione o un bottone.
- [x] ✅ **La prima riga trovata dal conto nuovo** (`57b4107`):
  `CONCORRENTI_CAMPO.md` si contraddiceva **dentro lo stesso riquadro** —
  intestazione «completa dal 01/08», corpo «manca». Sotto, la causa: il commento
  di schema di `scudo-data.js:29` elencava le origini **senza `fermo`**, da sei
  giorni. ⛔ Commit di verifica **non** spostato: riverificata una riga, non il
  documento.
- [x] ✅ **Il tema morto del core** (`a93f8ee`): **137** selettori
  `body.outdoor-mode` tolti, −10.965 caratteri, e l'aspetto verificato con
  **50 scatti su 52 byte-identici** (i due fuori sono la quota di storage, che
  cambia col disco: sette md5 in sette giri, tre dei quali su HEAD). ⚠️ Le 13
  `body:not(.outdoor-mode)` **non** sono morte e restano: `:not()` conta come
  una classe, toglierlo abbassa la specificità.
- [x] ✅ **Le strisce di stato, WCAG 1.4.11** (`f6b42ee`): chiaro **72 → 0**,
  sole **57 → 0**, scuro invariato al bit. Terzo livello `--bar-*` dichiarato
  una volta in `shared/`. ⛔ Censimento **per effetto**: 122 dichiarazioni con
  un token di stato + **145 con un colore letterale**, invisibili al censimento
  per nome che ne contava 13. Banco nuovo `contrasto-non-testo.mjs`, banchi
  132 → **137**.
- [x] ✅ **Il banco della barra a quattro larghezze** (`27655b4`): il difetto
  riferito da uno scatto (etichette di Conti tagliate a 430) **non c'era** —
  164 voci, zero tagliate — e io l'avevo riportato in due checkpoint senza
  rimisurarlo. Allargando il banco è però uscito un difetto **vero**.
- [ ] **Chi misura la larghezza dei fogli stampati, e chi no** — misurato il
  07/08 dopo che il prospetto di Terra è uscito dalla larghezza del foglio a
  390 px (435 in 390). Quel difetto l'ha trovato `stampe-fs.mjs`, che visita
  **quattro** superfici: Flotta, Sentinella, Conti, Terra. Più `campo-foglio-turno`
  per Campo. Restano **senza nessuna misura di larghezza** i fogli di **Genesi**
  (`genesi-foglio-in-cava.mjs` non guarda le dimensioni) e di **Scudo**
  (`scudo-documenti.mjs` idem).
  ✅ Genesi **misurata a mano oggi e sana**: `btn-report` catturato da
  `window.open` e reso a 390 e 320 px → documento 390 su 390 e 320 su 320,
  **dentro** in tutt'e due, nessun elemento che sporge. ⚠️ Con due limiti
  dichiarati: l'elenco dei bottoni è stato filtrato sul testo («stampa»,
  «foglio») e ne ha trovato **uno solo**, e la resa è senza `@media print`.
  Resta da fare: la stessa misura su Scudo, e portarla **dentro i due banchi**
  invece di lasciarla in una misura a mano che alla sessione dopo non esiste.
- [ ] **`fuori-schermo` chiede la domanda A a 390 e 360, la B anche a 320** —
  l'asimmetria si legge nel file, riga per riga: `LARGHEZZE = [390, 360]` per
  «la pagina esce dallo schermo?» e `LARGHEZZE_RIQUADRO = [390, 360, 320]` per
  «l'elemento esce dal suo riquadro?», col commento che dice — giustamente —
  che 320 px «non è un caso limite ma lo schermo su cui vive» Campo.
  ⛔ Il costo di quella riga è già stato pagato: il **traboccamento del corpo
  del core a 320 px** (333 px in 320, l'indirizzo del CDN in una parola sola da
  60 caratteri) è stato trovato **a mano**, non da questo banco — che a 320 la
  domanda A non la fa. ⚠️ Prima di aggiungerla va **misurato quanti allarmi
  nuovi porta** (la regola dell'ampiezza: si stringe su una copia e si contano),
  e il tentativo di oggi non è riuscito perché il server statico di prova non
  si è alzato — quindi il numero **non c'è ancora**, ed è dichiarato mancante
  invece che inventato.
- [x] ✅ **Sentinella a 320 px** (`69078fa`): la barra ci sta — 328 in 302 →
  **302 in 302**, con la soglia misurata (ci sta fino a 345, esce da 344).
  ⛔ E **la mia diagnosi era falsa**: «rimpicciolire il carattere fa salire il
  minimo» aveva il numero giusto e la causa sbagliata — a 320 px il foglio
  condiviso applicava già font 8px, e la mia prova alzava la **spaziatura** da
  .8 a .9 (51 lettere × 0,1 = i 5 px comparsi). Anche il «minimo = sei volte la
  colonna più larga» era dedotto e falso: è la **somma** (327,80 chiesti alla
  griglia).
  ✅ E la seconda domanda ha trovato il difetto grosso: nel tema **sole**
  Sentinella era tagliata **a tutte le larghezze** (fino a **141 px** a 320, due
  voci intere sparite), perché `body.dw.outdoor-mode .nav button{font-size:11px}`
  batte per specificità ogni gradino del foglio condiviso. Scala outdoor
  calcolata sul caso peggiore di ogni intervallo e rimisurata a **undici**
  larghezze: 0 tagliate.
- [ ] **Un file che esce con un nome FISSO si sovrascrive, e oggi e' costato
  quattro volte.** Censiti i nomi degli export sulle nove superfici (07/08):
  **45 fissi contro 14 costruiti**. ⛔ Ma una regola lessicale «ogni export deve
  avere un nome che distingue due salvataggi» sparerebbe **45 allarmi**, e la
  maggior parte sarebbero falsi: per un registro intero (`conti_listino.csv`,
  `flotta_ricambi.csv`) il nome fisso e' **giusto** — due salvataggi che si
  sovrascrivono sono quello che si vuole. Scartata come regola, come e' stata
  scartata quella sui nomi degli inchiostri: il discriminante non e' scrivibile
  in una regex.
  **La domanda che li separa, e va fatta a mano**: *il contenuto di questo file
  dipende da qualcosa che l'utente ha SELEZIONATO?* Se si', due scelte diverse
  escono con lo stesso nome e la seconda cancella la prima senza che il browser
  chieda niente. I quattro casi di oggi erano tutti cosi': il report del core a
  periodo aperto, due moduli vuoti di formato diverso, due turni della stessa
  cava nello stesso giorno, e le due uscite 3D (queste ultime **non corrette**,
  perche' irraggiungibili nella dimostrazione).
  **I candidati rimasti, da aprire e misurare**: `genesi-demo.volata.json` e
  `genesi_signature_composito.csv` — il primo e' *una* volata, il secondo *una*
  onda importata, e tutt'e due escono con un nome fisso.
- [ ] **Il banco della barra guarda un tema su tre** — è il buco che ha lasciato
  passare il difetto del sole di Sentinella per giorni. Aggiungergli `--tema=`
  chiude la classe intera, e lo strumento è già scritto.
  ⛔ E il conto di che cosa trova: nel tema **sole** tagliano anche **Flotta a
  320 px (16 px)** e **Terra a 320 px (11 px)**, misurati. ⚠️ E **Conti nel sole
  risponde «ok» senza provare niente**: il suo `.nav button{overflow:hidden}`
  azzera la min-width dell'elemento di griglia, quindi la barra non trabocca
  **mai** e a essere tagliate sono le etichette dentro il bottone — una domanda
  a cui quel banco, così com'è, non può rispondere.
- [ ] **«Adempimenti» è la parola che governa il minimo di Sentinella** (11
  lettere, 64,81 px): accorciarla toglierebbe ~18 px, ed è la sola strada per
  portare i bersagli di tocco a 320 px sopra i 44 (oggi tre voci stanno a
  41,4). È una decisione di **prodotto**, non presa — e «Scadenze» è già la voce
  di Scudo e di Flotta.
- [x] ✅ **La parte 7 estesa col terzo livello** (`84de2d8`) e **la ricerca su
  Scudo** (`a01bbcc`, 127 righe, 34 con fonte, ~45 `[dedotto]` — da rimisurare
  prima di diventare unità).
- [x] ✅ **Le 54 dei temi chiari — chiuse tutte e sei** (`24c4d89` Sentinella,
  `b50c8b4` Flotta, `099f375` Conti, `f73efba` Terra, `98fe776` Campo,
  `73d1ae3` Scudo). Ognuna decisa con la sua ricerca cromatica sul **proprio**
  fondo peggiore, non con una formula unica: i fondi dei temi chiari sono velati
  dell'accento di ciascuna app e si scostano di ~0,3. `--tema=chiaro` e
  `--tema=sole` sono registrati in `tutti.mjs` da `d8a6f6d`, con la controprova
  di giorno.
  ⚠️ E il conto onesto: delle 32 accuse del banco **quattro erano false**, tutte
  fra i casi con la forbice larga — la geometria del gradiente è il cantiere che
  chiude quel dubbio.
- [x] ✅ **Le quattro classi morte tolte** (`f576131`): 1.154 → **1.150** classi,
  morte 4 → 0. La seconda metà della regola ha fatto il suo lavoro per la prima
  volta, pretendendo che sparissero anche le righe che le scusavano. ⚠️ Svuotato
  l'elenco, la suite stampava «0 passati, 0 falliti» — il verde di un file
  **inerte**: aggiunte due prove che dicono che ha guardato qualcosa.
- [x] ✅ **Il tema outdoor del core è codice morto** (`e331747`): **136**
  occorrenze di stile che non si vedono mai, e ci abbiamo ragionato sopra **in
  due** su un caso che non può succedere. Ora c'è un commento **e** una prova con
  quattro condizioni, fra cui — all'opposto — che `dw-tema.js` quella classe la
  metta davvero nelle app. La rimozione vera resta dichiarata e non fatta.
- [x] ✅ **Terza avvertenza su `run-kpi`** (`006088f`): una prova scritta in
  fondo non può essere `async`, perché l'`await` sta a metà file e il totale si
  stampa senza aspettarla. Non è «dopo il `process.exit`»: è **dopo l'await**.
- [x] ✅ **La Dashboard senza rete** (`4ee8f4e`): tre rettangoli vuoti che non
  dicevano perche' — il principio del fondatore applicato a un DISEGNO invece
  che a un numero. Chart.js viene da un CDN, quindi senza rete quello e' lo
  stato NORMALE, e in cava il segnale non c'e'. Era anche **la schermata che
  nessuna prova aveva mai aperto** (`nav('dashboard')` sollevava). Trovata da
  una riga «non ho guardato», letta invece che saltata.
- [x] ✅ **La guardia del PDF guardava una libreria su due** (`1678fa4`): otto
  copie identiche su `jspdf`, **zero** controlli sulle undici chiamate ad
  `autoTable`. E «una c'e' e l'altra no» e' uno stato che il service worker
  permette **apposta** (precacha ogni indirizzo col proprio `.catch()`).
  Misurato: nessun PDF e **nessun messaggio**.
- [x] ✅ **I decimali col punto nel core** (`3776a30`): 11 numeri a schermo su
  32 schermate, accanto a date italiane. Nasce `perLettura` in `shared/`, la
  gemella di `perCampo` — e la convenzione giusta era gia' scritta a mano nel
  PDF.
- [x] ✅ **Le tre copie del formattatore** (`9818d4a`, `ecf5024`): `numeroIt` di
  Campo e le DUE di Flotta diventano `perLettura`. La copia di Flotta era gia'
  divergente (`null` → «0»), ed era **gia' censita** in `sonda-vuoto.mjs`: la
  sua riga e' stata ritirata perche' la trappola non c'e' piu'.
- [x] ✅ **Il punto decimale nelle sei app: non c'e'** (`8d9ed88`, `556f2db`):
  0 su 41 sezioni, con la prova e il denominatore. La prima misura ne diceva
  **217**, tutti falsi — erano migliaia scritte bene, e il segno era che il
  conto era alto proprio dove la difesa e' piu' forte.
- [x] ✅ **I riquadri del rapportino che si sta scrivendo** (`76ecc35`): a
  rapportino vuoto i metri dicevano «0.0» in mezzo a media e mc che dicevano
  gia' «—» (terza volta per questa coppia); e con **un foro a 9 m** e la maglia
  vuota usciva «9.0 metri · 9.00 media · **0.0 mc**», perche' `parseMaglia("")`
  da' B=0 e S=0. Il guardiano copriva «nessuna profondita'» e non «nessuna
  maglia» — il caso per cui `misureRapportino` esiste, gia' risolto in
  `shared/` per il rapportino salvato. Ora il form fa giudicare il modulo.
  Banco 19 → **25** prove, controprova 5/5 difetti e 10 cadute. E la sonda che
  contava i decimali col punto (**4 a schermo su 21 schermate**, quindi niente
  cantiere sul separatore) e' quella che li ha fatti saltare fuori.
- [x] ✅ **L'elenco delle volate del core, quarta copia debole** (`f108ef0`):
  `misureVolataProgetto` è in `shared/` **ed è importata in `index.html`** —
  documento, scheda e riquadro la chiamavano, l'elenco no, e scriveva «0 mc»
  dove nessuno aveva misurato le profondità facendo sparire i chili quando
  erano zero. Ora `volRiga`, accanto a `volKg`/`volMc`, con la forma di
  `rappRiga`. **La misura ha deciso il lavoro**: riusare `volKg`/`volMc` era la
  cosa ovvia e non ci stanno (295px su 252 a 390, tagliati a ogni larghezza) —
  e per quella strada è saltato fuori un **quinto** sito, il riquadro «ultime
  volate» della dashboard, tagliato da prima. Limite dichiarato: a 320px una
  combinazione esce lo stesso (197 su 194) e il banco la stampa. Banchi
  **147 → 149**, controprova 7 KO.
- [x] ✅ **Terra · il divario di recupero che cambiava SEGNO** (`74aa564`): la
  ragione era già scritta nel commento di `divarioRecupero` — «un divario
  calcolato su tre lotti quando ce ne sono sei è più piccolo del vero» — ma per
  i **m²** soltanto. La riga accanto usa lo stesso `somma` con `(+x[campo] ||
  0)`: un lotto che il volume non lo dichiara valeva **zero m³**. E aperta la
  pagina non era «più piccolo»: tolto il volume di `lo5`, il Piano scriveva
  **-43.000 m³** dove il vero è **+97.000** — si legge «il recupero è avanti in
  volume», cioè il contrario. Stato **previsto** dal prodotto (`volumeM3: m3.ok
  ? m3.valore : null`), invisibile solo perché nella dimostrazione tutti e sei
  i lotti il volume ce l'hanno. Ora `senzaM3` con la sua riga d'avviso (resa
  **misurata** nel DOM, non dedotta), **6 asserzioni** nuove, controprova che
  cade. `run-kpi` **1886 → 1887**.
- [x] ✅ **Terra · il vuoto che usciva zero e RIENTRAVA come misura** (`8583a0b`):
  `csvRilievi` teneva la copia debole di `numeroDichiarato` — che sta in
  `shared/` e la usano già Conti e Sentinella — proprio nel posto che CLAUDE.md
  indica per primo, **dove l'app compone qualcosa che ESCE**. La stringa vuota
  convertita fa 0 e `Number.isFinite(0)` risponde true, quindi un volume in
  bianco usciva scritto `0`; e il danno è nel **ritorno**: `parseRilieviCsv` lo
  accetta, `rilievoUsabile` lo dichiara buono, e quello zero entra nei KPI, nel
  riepilogo annuale e nella **denuncia** come un volume misurato. La prova che
  difendeva quel punto c'era e guardava `null`: quinta causa dell'elenco, il
  caso difeso non c'era nella prova. Poi la promessa sopra — «Scaricati 8
  rilievi nel formato che questa pagina sa ri-caricare», e ne rientravano
  **7**: ora `rientroRilievi` lo dice con la ragione, **derivando** la risposta
  dalle due funzioni vere invece di riscriverla. ⛔ E quel messaggio **non si
  era mai visto**: `conta(...)` non era importata nella pagina, quindi il
  gestore moriva subito dopo il download — errore duro, presente su `HEAD`, su
  un bottone che un banco preme 41 volte. `nomi-liberi` non lo vede perché
  guarda il **file**, non lo **scope** (misurato: tolto l'import, resta verde).
  Banco CSV **219 → 225 ok**: la lettura degli errori arrivava **prima** dei
  clic, il giro scrivi/leggi diceva «> 0» senza denominatore, e
  `terra_rilievi.csv` non era nemmeno in elenco. Prove **1887 → 1889**,
  copertura **702 → 703**.
- [x] ✅ **`nomi-liberi` · la seconda domanda: il nome esiste, ma esiste QUI?**
  (`457fee6`). Il controllo raccoglieva i nomi legati in un insieme **unico per
  file**: bastava un omonimo qualunque, dichiarato ovunque, per spegnerlo su
  quel nome — guardava il FILE, non lo SCOPE. È così che il `conta` di Terra è
  passato. Ora c'è una **seconda domanda** accanto alla prima, che giudica per
  blocchi di graffe. ⚠️ Costo misurato **prima** di irrigidire, e ha diretto il
  lavoro: **2** falsi allarmi con una regex per le dichiarazioni (`const N=60,
  gx=(i)=>…` perde il secondo), **11** ancorando il blocco al dichiaratore
  (`const {jsPDF}=window.jspdf` scambia la graffa della destrutturazione per il
  blocco), **0** con l'ancora sulla parola `const` — e **1, quello giusto**, col
  difetto rimesso. Cioè nessuno dei tredici veniva dalla domanda: venivano tutti
  dal **righello**. `nomiLegati` ha guadagnato un argomento invece di una copia,
  e nel farlo è emerso che una sua regex ne teneva due in una (`nome: (` è una
  proprietà, `nome = (` combacia anche con un `const` qualunque): con quella
  unita la controprova restava **verde col difetto dentro**. Prove **7 → 10**.
- [x] ✅ **La seconda domanda anche sui MODULI** (`ba14cdc`). Nei moduli il
  difetto è **peggiore**: un nome libero non fa rumore all'import, esplode
  quando quella riga viene **eseguita** — magari in un ramo che le prove non
  toccano. ⚠️ Costo misurato **prima** di pretenderlo: **0 allarmi su 6.698
  chiamate e 18 moduli**. Controprova: `somma` è dichiarata dentro **tre**
  funzioni diverse di `terra-data.js`, cioè la forma esatta dell'omonimo che
  inganna la prima domanda; iniettata una sua chiamata in `anniConVolumi`, la
  prova pretende che la prima resti cieca, che la seconda la veda, e che sul
  modulo sano non accusi nessuna delle tre dichiarazioni vere. Prove
  **10 → 12**.
- [x] ✅ **Scudo · la data di consegna dei DPI che si leggeva «non serve»**
  (`c26971b`). Sul **verbale** — il foglio che il lavoratore **firma**, prova
  della consegna ex art. 77 D.Lgs 81/2008 — la colonna «Consegnato il»
  scriveva **«—»** per una data assente, vuota o **impossibile**; e su un
  foglio stampato «—» si legge «non serve». La colonna **accanto** era stata
  corretta il 03/08 per la stessa identica ragione: misurate affiancate sugli
  stessi dati, «Sostituire entro» diceva «non indicata» e «Consegnato il» «—».
  Ora `statoConsegnaDpi` porta la bandiera `leggibile` (nome preso dal
  vocabolario della **regola 20**, così il controllo la governa) e la leggono
  **tre** stampe: verbale, registro DPI, cartella del lavoratore. ⚠️
  Raggiungibilità **dichiarata**: il form pretende la data e un import dei DPI
  non c'è — latente, non impossibile. Misurato premendo il bottone e leggendo
  il foglio riga per riga (iniezione nella risposta HTTP): sei righe tengono la
  data, l'iniettata dice «non indicata». Prove **1889 → 1890**.
- [x] ✅ **Scudo entra nel banco dei fogli stampati** (`65037a2`, doc
  `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md`). «Scudo resta fuori da questo
  banco» stava nell'intestazione di `stampe-fs.mjs` da **cinque giorni**, in
  una riga che racconta una storia invece di essere un elenco che si legge — e
  intanto ai suoi due fogli (verbale DPI, cartella del lavoratore) **nessuno
  faceva la domanda di quel banco**: dichiari di essere fatto di dati
  d'esempio, e dici che cosa comporta? È la stessa superficie su cui il 03/08 e
  l'08/08 sono usciti due difetti veri. Ora è dentro nei **due versi**:
  controprova che spegne la **decisione** (4 KO su Scudo, 26 sul giro, 0
  iniezioni mancate) e `--live` che pretende il foglio **pulito** sui dati veri
  (50/50). Banco **58 → 73** prove.
  ⛔ **E l'errore mio vale più dell'unità**: la prima stesura del documento
  diceva «rapporto di turno di Campo: nessun banco». **Falso** —
  `campo-foglio-turno.mjs` ha tre passate, e i fogli di Scudo erano premuti da
  altri tre banchi. Avevo cercato **dentro un file solo** e concluso «non c'è»
  per tutto il resto: la mossa che la direttiva 5 vieta agli agenti, fatta da
  me la stessa notte in cui l'ho applicata a due cantieri. Un `grep -rln` di
  tre secondi la smentiva. La correzione sta **in cima** al documento.
- [x] ✅ **Sentinella · i due trattini del report che va a un ente** (`db04ac5`).
  Giudicati **uno per uno** gli otto «—» del report ambientale, invece di
  contarli: **sei sono giusti** (colonna «Ora», che il prodotto dichiara
  facoltativa fin dall'import — assenza prevista, non mancanza) e **due erano
  difetti**. La cella **SD** smentiva il paragrafo sopra di sé, che dice a
  parole «senza di essi la distanza scalata non si calcola»: era l'unica cella
  della riga rimasta fuori da `cellaVolata`, ed è quella che dipende da tutte
  le altre. E i **superamenti** di un punto senza soglia: il commento del
  codice sapeva già che «0» sarebbe stata una cifra tranquilla, e aveva scelto
  come rimedio **un trattino** — la stessa cifra tranquilla in un altro
  vestito. Il banco adesso porta il **denominatore** («nessun trattino fuori
  dalla colonna Ora» + «6 nella colonna Ora»), così un terzo trattino dove
  serve una ragione si vedrebbe. Controprova: rimessi tutt'e due, 4 fuori
  posto e il banco cade.
- [x] ✅ **Scudo · «Modello: —» sul verbale firmato, e la chiave doppia**
  (`976e2a0`). Stessa domanda dei trattini portata sui due fogli appena entrati
  nel banco: il verbale ne aveva **cinque**, tutti nella colonna «Modello». Su
  un foglio che il lavoratore firma quel segno si legge «questo dispositivo non
  ha un modello», mentre nessuno l'ha registrato — e l'art. 77 chiede che il DPI
  sia **identificabile**. Ora «non registrato». ⚠️ La colonna «Taglia» tiene il
  trattino ed è **voluto** («unica» è una risposta vera): l'eccezione sta nel
  banco **per nome**, non in una regola larga.
  ⛔ **E la lezione vera**: le due iniezioni di Scudo erano **due voci con la
  stessa chiave** nello stesso oggetto — la seconda cancella la prima **senza un
  errore da leggere**. La controprova rispondeva «ok» proprio sulla riga dei
  trattini e stampava «0 iniezioni mancate», cioè tutti i segnali di una
  controprova sana; l'ha smascherata solo il fatto che la riga che doveva cadere
  non cadeva. È la **sesta causa** dell'elenco: lo strumento sotto. Banco
  **73 → 76**.
- [x] ✅ **La regola dei trattini scritta UNA volta, e la misura sugli altri
  fogli** (`ce62251`). Me n'ero accorto **dopo** averla copiata due volte, a
  un'ora di distanza: ora è `TRATTINI`, con l'elenco **dichiarato** delle
  colonne in cui il vuoto è una risposta vera («Ora» in Sentinella, «Taglia» in
  Scudo) e i **nomi** delle colonne colpevoli in uscita. ⚠️ La firma vuole **un
  argomento solo**: `pg.evaluate(fn, x)` ne passa uno, e a due parametri
  `ammesse` sarebbe arrivata `undefined` — la guardia avrebbe accusato proprio
  le colonne legittime. Sugli altri fogli gira come **misura**: Flotta 15
  («Quota»), Conti preventivo 2 («Sconto», **giusti**), DDT 0, fattura 2
  («Quantità», «Prezzo unitario», sulla riga a **importo unico**), Terra non
  misurata (finestra nuova). ⛔ **Nessuno corretto, di proposito**: un trattino
  si **giudica**, non si conta, e sono candidati dichiarati nel documento.
- [x] ✅ **Flotta · i 15 trattini «Quota» erano il principio applicato**
  (`d974936`). Guardati uno per uno, il verdetto si **ribalta**: quella colonna
  è spenta **di proposito** (`quota: false`) perché sommare percentuali non ha
  senso, e il commento porta la misura che l'ha fatta spegnere — «la giornata a
  0 mezzi operativi si dichiarava *quota 0,0%*», il numero più tranquillo
  proprio sul giorno in cui la cava era ferma. Accusarlo sarebbe stato mandare a
  rovinare una cosa sana. ⚠️ E il **righello era largo**: guardava `body` in
  `@media print`, cioè tutta la pagina e non il foglio — dichiarando «Quota»
  ammessa i quindici si dividono in **10 giusti** e **5 fuori tabella**, che
  finché il banco non sa localizzare **non si giudicano**.
  📊 **Bilancio della notte sui trattini**: 30 guardati — **9 difetti veri
  corretti**, **18 giusti**, **3 aperti e dichiarati**. Un trattino su tre era
  una faccia tranquilla; due su tre erano il prodotto che diceva la verità.
- [x] ✅ **Flotta · «dal — — ancora fermo» sul libretto** (`e27fe4a`).
  Localizzati i quattro trattini «fuori tabella» — il passo che il checkpoint
  prima diceva di fare **prima** di giudicare — e uno era un difetto vero: un
  fermo senza data d'inizio usciva sul foglio stampato come «Guasto meccanico ·
  **dal — — ancora fermo**», con un trattino al posto della data e la frase
  spezzata a metà, su un documento che si porta a chi compra la macchina. La
  causa era il segno che serviva: la frase composta **a mano in due punti**.
  Ora `quandoFermo`, scritta una volta e usata da tutt'e due. Gli altri tre
  trattini sono **giusti** (tessere «Consumo»/«Gasolio» e il conto dei giorni,
  che senza la data d'inizio non si può fare).
  ⛔ **E il controllo scritto stanotte ha preso il MIO errore**: `dataISOEsiste`
  usata senza importarla, `nomi-liberi` rosso al primo giro — la stessa famiglia
  di `chiediDati` e di `conta`, vista **prima del commit** invece che una
  settimana dopo. Il banco ora **localizza** i trattini fuori tabella e guarda
  `#page-sch`, il foglio vero, invece di `body`.
- [x] ✅ **Conti · la fattura a importo unico** (`4c1bb43`). Chiusi gli **ultimi
  due trattini non giudicati** dei cinque fogli: quantità e prezzo unitario di
  una fattura registrata a importo unico non mancano per sbaglio, **non ci sono
  per scelta**, e due trattini in mezzo a una tabella di numeri si leggono
  «niente da segnalare» — su un documento fiscale la differenza la nota chi
  legge. Ora «non dettagliata». ⚠️ E nella **stessa riga** l'aliquota il
  trattino lo **tiene**, per una decisione già scritta: un'aliquota che non c'è
  è la dichiarazione di un'operazione **non imponibile**, cioè una cosa vera.
  Tre celle vicine, due risposte diverse — la ragione per cui un trattino si
  **giudica** e non si conta.
  📊 **Bilancio chiuso sui quattro fogli raggiunti**: **11 difetti corretti**,
  **11 giusti**, 10 che non erano nel foglio, **0 aperti**. Resta fuori solo la
  denuncia di **Terra**, che apre una finestra nuova.
- [x] ✅ **Terra · l'ultimo foglio scoperto, e il censimento chiuso** (`36c7815`).
  Il riepilogo annuale vive in una **finestra a parte**, e per questo nessuna
  misura lo raggiungeva — «non misurato» non è «a posto». Misurato: **zero**
  trattini. Con questo **tutti** i fogli raggiungibili sono stati premuti,
  letti e giudicati: **10 difetti corretti, 11 trattini giusti, 0 aperti**.
  ⛔ E gli undici «giusti» sono la metà che vale di più: sono i posti in cui il
  prodotto **si rifiuta** di scrivere un numero comodo (la «Quota» spenta
  perché sommare percentuali non ha senso, l'ora facoltativa per disegno,
  l'aliquota assente che su una fattura dichiara un'operazione **non
  imponibile**). Accusarli sarebbe stato il danno peggiore della notte.
- [x] ✅ **I trattini diventano regola su Conti e Terra** (`1ab3654`). Dopo aver
  giudicato ogni trattino uno per uno, le misure diventano **regole** — ma solo
  dove il giudizio è chiuso, e con le colonne ammesse dichiarate **per nome**:
  Conti soglia **zero** fuori da «Sconto» (l'unica in cui il vuoto è uno stato
  vero), Terra soglia **zero** senza colonne ammesse. ⛔ **Flotta resta una
  misura**, e la ragione è scritta: dei quattro trattini rimasti tre sono
  legittimi ma stanno **fuori da qualunque tabella**, e un elenco che dovesse
  nominare testo di pagina invece di intestazioni sarebbe **fragile** — una
  regola fragile che sbaglia insegna a non guardarla. Banco **76 → 82**.
- [x] ✅ **La controprova della regola nuova di Conti** (`290f72b`). Una regola
  senza controprova è una riga che **non si sa se sappia fallire**: rimessi i
  due trattini della riga a importo unico, la regola cade e **nomina le colonne
  colpevoli**. ⚠️ L'iniezione sta in una chiave **nuova**, guardato prima di
  scriverla — `DIFETTI` non aveva Conti, e una chiave doppia cancella la prima
  senza far rumore: la lezione di mezz'ora prima ha funzionato al primo riuso.
  ⏱️ Terra resta **senza** controprova, e dichiarato: sui suoi fogli i trattini
  sono **zero**, quindi non c'è un difetto vero da rimettere — inventarne uno
  proverebbe il **rilevatore**, non il prodotto.
- [x] ✅ **Misurato il costo della TERZA domanda di `nomi-liberi`** (`219f2cf`).
  I nomi **riferiti** dentro un template (`${nome}`) sono la forma con cui
  queste pagine compongono ogni riga di interfaccia, e oggi non li guarda
  nessuno. Misurato **prima** di scrivere codice, come pretende la regola:
  **3.742 riferimenti su 12 pagine, 2 allarmi, tutt'e due FALSI** — `CSS` (già
  in `GLOBALI`) e `_fSW` di Genesi, che è il **terzo dichiaratore** di un
  `const` spezzato su due righe. Rumore atteso: **zero**, purché il controllo
  riusi `nomiDichiarati` e l'elenco vero. ⛔ **Terza volta in una notte che i
  falsi allarmi vengono dal RIGHELLO e non dalla domanda** — sta diventando il
  segno più affidabile che ci sia.
- [x] ✅ **`nomi-liberi` · la TERZA domanda: un nome riferito che non esiste**
  (`8136ab2`). `${nome}` dentro un template è il modo in cui queste pagine
  compongono **ogni riga di interfaccia**: un nome libero lì **uccide il
  disegno** come una chiamata inesistente uccide il tocco, e le prime due
  domande non lo vedono. ⚠️ Si cerca sul **testo** e non sul codice mascherato
  — i template vivono dentro le stringhe, e `mascheraCodice` spegnerebbe proprio
  ciò che si vuole leggere. Ampiezza già misurata: **3.771 usi su 10 pagine,
  zero liberi**. Controprova con la forma esatta che le altre non vedono:
  `RIPOSO_MINIMO_ORE`, importata da Campo e usata **solo** dentro due template —
  tolta dall'import la pagina morirebbe al primo disegno dell'appello, e la
  prova pretende **quattro** cose, fra cui che la **prima** domanda resti cieca.
  Prove **12 → 15**.
- [x] ✅ **La terza domanda anche sui MODULI** (`aabadeb`). Lì un nome libero
  dentro un template **non fa rumore all'import**: esplode quando quella riga
  viene **eseguita**, magari in un ramo che le prove non toccano. Misurato:
  **181 riferimenti su 18 moduli, zero liberi**. ⚠️ E la soglia del «ha davvero
  guardato» l'avevo scritta **a occhio** (200): la prova è caduta al primo giro
  sui 181 veri — una soglia si prende dalla **misura**, non dall'impressione, ed
  è la quarta volta stanotte che il righello sbaglia prima del soggetto.
  📊 **`nomi-liberi` chiude la notte a 7 → 16 prove**, tre domande ognuna col suo
  denominatore stampato e ognuna con una controprova che porta dentro un difetto
  **vero** (il `conta` di Terra, il `somma` di `terra-data`, il
  `RIPOSO_MINIMO_ORE` di Campo).
- [x] ✅ **Flotta · i trattini diventano regola, e l'eccezione che non si
  riusciva a nominare era un difetto**. Guardati uno per uno i quattro trattini
  rimasti sul libretto macchina: cinque sono **risposte vere** e stanno
  nell'elenco **per nome** («Quota», spenta di proposito perché sommare
  percentuali non ha senso; «Consumo», «Gasolio», «Ore motore», «Officina», le
  tessere dove il commento del codice dice già «non misurato non è zero» — e
  dove quel «—» ha **sostituito** un «€ 0,00» in verde). ⛔ Il sesto **non è
  finito in elenco**, ed è la parte che insegna: il conto dei giorni di un fermo
  senza data d'inizio scriveva «—» accanto a righe che dicono «11 giorni», cioè
  «nessun giorno». La sua etichetta è la frase intera della riga, quindi
  nominarlo sarebbe stato **fragile** — e la via giusta non era allargare la
  regola, era **dare la parola al prodotto**: adesso scrive «non calcolabili».
  **Un'eccezione che non si riesce a nominare è spesso il segno che non è
  un'eccezione.** ⚠️ E una prova esistente era agganciata **al segno** invece
  che alla cosa: pretendeva il trattino. Ora pretende la parola.
- [x] ✅ **Misurata la QUARTA forma di `nomi-liberi`, e l'aspettativa era
  sbagliata** (`dd15588`). Un nome riferito **nudo** (`const x = pippo`,
  `f(a, pippo)`, `return pippo`), fuori dai template e dalle chiamate. Me
  l'ero segnata come «rumore troppo alto, potrebbe dire di lasciar perdere»:
  **35 allarmi su 69.412 riferimenti**, tutti falsi per **tre ragioni diverse**
  — una decina di globali dichiarabili per nome; ⛔ **i COMMENTI** (`chiave ×3`
  nel core sono tre commenti in italiano: `mascheraCodice` maschera le
  **stringhe**, non i commenti, e questa forma **li incontra** — servono
  **tutt'e due** i tokenizzatori); e i **flag di una regex** (`/…/gu`).
  **Verdetto: si può fare.** Resta misura finché non è fatta — una guardia che
  accusa 35 volte a vuoto insegna a non guardarla. ⚠️ E prima ancora il
  righello: senza `\b` davanti al lookahead la regex combaciava con un
  **prefisso** del nome (3.354 allarmi tronchi di una lettera). **Quarto
  righello storto della notte.**
- [x] ✅ **`nomi-liberi` 35 → 9, e ogni scalino era il righello** (`4b87ed4`).
  ⛔ **La mia prima diagnosi era sbagliata e va letta per prima**: avevo scritto
  che i tre `chiave` del core erano **commenti**, e che serviva `senzaCommenti`.
  Falso — verificato mascherando il core e cercando il nome nel codice **vivo**:
  `chiave` sta in `for(const[campo,chiave]of…)`, cioè **`const[` senza spazio**,
  e il riconoscitore chiedeva `\s+`. `mascheraCodice` i commenti li toglie già:
  **il tokenizzatore era giusto, a sbagliare era il riconoscitore** — e quel
  riconoscitore sta sotto la **prima** e la **seconda** domanda. Poi undici
  globali e cinque parole chiave, entrati con la ragione. ⏱️ I **nove** che
  restano sono censiti uno per uno, e quattro vengono dal **dichiaratore su più
  righe** (`nomiDichiarati` si ferma al `\n`) — la stessa causa di `_fSW`. Per
  questo la quarta forma **resta misura**: oggi accuserebbe **codice sano**.
- [x] ✅ **Un a capo chiude la dichiarazione solo se la chiude davvero**
  (`199bf05`). `nomiDichiarati` si fermava al primo `\n`, quindi in
  `const a = …, b = …,` **a capo** `c = …` tutto ciò che stava sotto la prima
  riga risultava **libero**: quattro nomi sani accusati, più `_fSW`. ⛔ **E la
  verifica che conta qui è il SECONDO verso**, dichiarata nel checkpoint
  **prima** della modifica: allargando un riconoscitore il rischio non è il
  rumore, è renderlo **cieco**. Le tre controprove con dentro un difetto vero
  restano rosse quando devono, 16 prove su 16. Quarta forma **9 → 7**.
  📊 **Percorso completo 35 → 34 → 9 → 7, e ogni scalino era il righello**: il
  lookahead senza `\b`, `const[` senza spazio, gli elenchi incompleti, il
  dichiaratore multi-riga. Mai il prodotto.
- [x] ✅ **Una regex dopo una FRECCIA era letta come una divisione** (`31af9a3`).
  Terza volta che questa famiglia morde, e stavolta nel **tokenizzatore
  condiviso**, cioè sotto tutte e 29 le regole di `run-stile`. Dietro a `=>`
  l'ultimo carattere non bianco è un `>`, che non era fra quelli dopo i quali
  ci sta un'espressione: `c => /carburante/i.test(c)` veniva preso per una
  **divisione** e il corpo della regex restava codice. Misurato: **158 `=> /`**
  nel repository, **460 tratti e 18.420 caratteri** che tornano a essere quello
  che sono. ⚠️ **Il difetto era LATENTE e va detto com'è**: nessuna delle sette
  regex dopo una freccia contiene una virgoletta, quindi non aveva ancora
  nascosto niente — la prova sulla fase dava **10.304 dichiarazioni prima e
  10.304 dopo**, perché nessuna ancora cadeva dentro quei tratti. Basterà una
  regex ordinaria come `s => /['"]/.test(s)` perché l'apostrofo apra una
  stringa che corre fino in fondo al file. ⛔ **Il `+` è stato provato e
  SCARTATO con la misura**, perché nessuno lo rimetta alla cieca: porta **3
  tratti**, due dei quali erano artefatti del `>` mancante, e in cambio rompe
  `i++ / 2` mangiandosi il resto della riga.
- [x] ✅ **La quarta forma a ZERO, e da misura diventa REGOLA** (`nomi-liberi`
  16 → **19 prove**). ⛔ **Il percorso vale più del numero d'arrivo: 35 → 34 →
  9 → 7 → 6 → 0, e nessuno dei sei scalini era il prodotto.** Gli ultimi tre:
  la regex dopo la freccia (`carburante`, difetto del tokenizzatore, non di
  questo file); i **flag di una regex** presi per un nome — e non si
  riconoscono dalla forma, perché `i`, `g`, `s` sono anche nomi veri, ma dalla
  **posizione**, che la maschera sa dire alla lettera; e lo **IIFE che espone
  il globale col nome del suo parametro** (`global.dwGrafici = api`) invece che
  con la parola `window`.
  ⚠️ **E le due stesure sbagliate restano scritte nel file, perché qui il
  rischio è la CECITÀ**: quell'elenco alimenta tutte e quattro le domande.
  Elencando per nome le scritture del globale entravano `_larg` e `_t`, che
  sono `var self = this`; prendendo ogni `function(x){` per uno IIFE entravano
  `className` e `textContent`. Derivando invece lo IIFE **più esterno**:
  **2 nomi in più in tutto** su 325 già legati.
  ⚠️ **E una riga che avevo scritto era falsa, corretta prima di lasciarla**:
  «nei moduli ci pensa `import-esistenti`». No — quello verifica il verso
  **opposto** (che un nome importato esista dall'altra parte). ⏱️ **I moduli
  restano fuori dalla quarta domanda e nessun altro controllo li copre**:
  dichiarato nel riepilogo invece che taciuto.
- [x] ✅ **La quarta domanda anche nei MODULI** (`bad3fc4`), cioè il buco
  dichiarato un'ora prima. `nomi-liberi` **19 → 22 prove**, e la strada dai
  **67 allarmi allo ZERO** è stata tutta di **righello**, nessuno di prodotto:
  1. i **parametri dei metodi abbreviati** — `nomiLegati` legava il **nome**
     del metodo e non i suoi argomenti, perché un metodo non ha la parola
     `function` (11 nel solo SDK), e non si vedeva perché le prime tre domande
     un parametro non lo incontrano: non si chiama e non sta in un `${…}`;
  2. le **ri-esportazioni** — `export { A, B } from "…"` non dichiara e non
     usa, **inoltra** (6 in Campo);
  3. `globalThis` e `self` mancanti fra i globali, e `self` è il globale di un
     **service worker**, dove `window` non esiste (5 in `genesi-sw.js`);
  4. il **valore di default che tronca l'elenco dei parametri**: con `[^)]*`
     la cattura finiva sulla parentesi di `new Date()` e tutto quello che
     veniva dopo restava libero (`preavvisoGiorni` ×10, `semestre` ×4) — otto
     dei nove ultimi.
  ⚠️ **Il costo della stretta è misurato e dichiarato, non arrotondato**:
  entrano **24 nomi su 10.711** già legati, in 4 file. Diciannove sono
  parametri veri, tre sono cifre, `null` è già una parola chiave: resta **una
  sola cecità vera**, `getFullYear`, scritta accanto al codice.
  ⚠️ E due inciampi che valgono più della correzione: la suite **non finiva
  più** (due `\s*` separati da gruppi opzionali che mangiano spazi — con
  `[ \t]` torna lineare), e il **primo soggetto della controprova era
  sbagliato** (`SOGLIA_TURNI` in `terra-data.js` non è dichiarato, sta in una
  ri-esportazione): a fermarlo è stata la riga «l'iniezione non ha sostituito
  niente», che è lì apposta.
- [x] ✅ **Tolte 191 `git worktree` morte** (3 GB liberati). Non è
  manutenzione oziosa: una di quelle — `giro-copia-7002`, su un commit
  vecchio — era la cartella che un `python3 -m http.server` **sopravvissuto al
  riavvio del contenitore** stava ancora servendo sulla porta 8823 da **7 ore
  e 52 minuti**. Il giro nuovo si è fermato da sé («gli ho chiesto il mio
  contrassegno e mi ha risposto niente») invece di misurare la copia di
  qualcun altro: la difesa scritta in CLAUDE.md ha funzionato alla lettera.

- [x] ✅ **La QUINTA domanda: un nome importato e mai usato** (`ed444ea`),
  cioè il **verso opposto** delle prime quattro — non «questo nome esiste?» ma
  «questo nome, che esiste, serve a qualcuno?». **990 import su 21 file, 59
  inerti.** Non è un errore duro: un import inutile è **inerte**. Il danno è di
  lettura e **mente sul legame fra due file** — chi apre la pagina di Terra
  crede che usi `SOGLIA_TURNI`, chi tocca `terra-data.js` crede di avere un
  consumatore in più. Stessa famiglia dell'**eccezione che non serve più** di
  `sonda-vuoto`. ⚠️ **Il righello sbaglia nel verso giusto, ed è una scelta**:
  legge su **tutto** il testo e non sul codice mascherato, così se sbaglia dice
  «è usato» — il verso giusto per una domanda che propone di **cancellare
  righe**; la controprova prova tutt'e due i versi. ⚠️ **E il primo sospetto è
  stato verificato invece che creduto**: Flotta importa `statoScadenzaMezzo`
  senza usarlo e sembrava la **copia debole** di CLAUDE.md — non lo è, la
  pagina usa `scadenzeOrdinate`, che quello stato lo calcola dentro. Sono
  **pulizia, non un difetto**, e dirlo evita di mandare il cantiere dopo a
  cercare una cosa che non c'è. ⏱️ Resta **misura** finché le 59 righe non sono
  tolte: è lavoro sulle **pagine**, e va fatto col giro del browser fermo.

- [x] ✅ **I 34 punti di decisione dello strumento, e tre numeri veri nei
  documenti** (`2116de4`). Il buco della freccia l'avevo trovato **per caso**:
  vuol dire che gli altri, se ci sono, aspettano il **prossimo caso**. Adesso i
  punti in cui `mascheraCodice` deve decidere qualcosa sono interrogati uno per
  uno con la risposta giusta accanto — **34**. ⚠️ **Esito onesto: nessun buco
  nuovo, 34 su 34.** Il valore non è quello che ha trovato oggi, è che da
  domani nessuno dei 34 si può riaprire in silenzio; e **sa fallire** (33/34
  sul tokenizzatore di prima). Le due prove nuove hanno fatto invecchiare i
  documenti **nello stesso istante** (2.307 → 2.309) e `numeri-nei-documenti`
  ha fatto cadere il giro: ha funzionato come deve. Aggiornandoli, due cose che
  nessuno guardava: in `DEVELOPMENT.md` **gli addendi non tornavano** (1890 +
  297 + **63** + 32 + 9 + 8 = 2299, non 2307), e in `DECISIONI_WEEKEND.md`
  c'era «**19** banchi che aprono le pagine» dove sono **153** — vecchio di un
  **ordine di grandezza**, perché l'elenco `BROWSER` del controllo ne guardava
  **due su tre**, e il documento fuori elenco è proprio quello che si apre per
  **decidere**. ⛔ **Un numero è sorvegliato solo dove il controllo ARRIVA, e
  l'elenco di dove arriva va guardato quanto il numero.** ⚠️ E il conto dei
  banchi l'ho chiesto al file che lo sa: con una regex mia ne trovavo **143**,
  dieci in meno — il righello più debole era di nuovo il mio.

- [x] ✅ **Le due viste del tokenizzatore devono continuare a essere due**
  (`d8a47f4`). `CLAUDE.md` dice da tempo che i tokenizzatori sono **due e vanno
  scelti**; dal 31/07 leggono la **stessa** classificazione — la cosa giusta,
  ed è anche quella che rende possibile il guasto peggiore: se una delle due
  finisse per comportarsi come l'altra, **tutte** le regole sui TESTI
  diventerebbero cieche e continuerebbero a rispondere «nessuna violazione».
  **Nessuna prova lo sorvegliava.** La prova non guarda com'è scritto il codice
  — quello cambia — ma **che cosa sopravvive**: la stessa parola in tre posti
  (stringa, commento di riga, commento di blocco) dev'essere vista **0** volte
  dalla prima vista e **1** dalla seconda; se i due numeri diventano uguali, le
  viste si sono fuse. `run-stile` **299 → 300**, e i tre documenti seguono
  nello stesso commit (2.309 → **2.310**) perché la prova nuova li fa
  invecchiare nell'istante in cui esiste.

- [x] ✅ **`sw.js` rotto passava il giro intero — chiusi i moduli a sé stanti**
  (`c71ea57`). ⛔ **Misurato, non supposto**: rotto `sw.js` con un
  `const rotto = ;` su una copia staccata, il giro `node` ha risposto **23
  comandi, 0 caduti, uscita 0**. Un errore di sintassi **duro** nel **service
  worker del core** — che va in produzione a ogni merge e tiene la cache della
  PWA — passava la verifica «sulla copia di quello che si committa», e lo
  trovava solo la CI **dopo** il push. È la regola scritta nell'intestazione di
  quel file stesso, trovata violata un'altra volta. ⚠️ **«Lo nomina» non vuol
  dire «lo compila»**: il primo controllo era un `grep` dei nomi dentro le
  suite e diceva che `sw.js` era «nominato da `nomi-liberi`» — vero e
  irrilevante, lo legge come **testo**. I moduli dati erano davvero coperti
  perché `run-kpi` li **importa**. La differenza non si vede da un elenco di
  nomi: si vede **rompendo il file e guardando chi se ne accorge**. ⚠️ L'elenco
  è **derivato** (service worker, funzioni, moduli condivisi e dati per
  convenzione), non ricopiato da quello della CI. ⛔ **E la prima stesura della
  controprova scriveva sul modulo VERO**: avrebbe funzionato, ma sarebbe stata
  una trappola armata a ogni commit, perché il giro `node` si lancia **proprio**
  mentre il giro del browser cammina. Ora l'iniezione va in una cartella
  temporanea. Costo: **0,3 secondi**; 19 moduli compilati, controprova 14/14
  pagine e 19/19 moduli.

- [x] ✅ **Le regole di sicurezza si possono provare QUI, e il numero era 58
  invece di 68** (`a5dca00`). Il comando scritto in `CLAUDE.md` sbagliava due
  volte: dava `emulators:exec … "npm test"` (che qui **non parte**) e diceva
  «19 test», che è il conto dell'**SDK**. Misurato lanciandolo:
  `--only firestore` + `node run.mjs` → **68 prove, 0 fallite**, cioè la
  **barriera multi-tenant** — il muro fra aziende concorrenti — **verificabile
  prima del push, e nessuno lo faceva**; `--only firestore,auth` conferma SDK
  **19** e primo avvio **8**. ⛔ L'emulatore delle **funzioni** non parte:
  chiede la rete e la politica del contenitore la nega — quindi `npm test`
  intero fallisce **non per un difetto nostro**, e le 21 prove sulle funzioni
  restano solo in CI. Detto invece che lasciato credere che «l'emulatore non si
  possa usare». ⛔ E **58 → 68** in tre posti, totale emulatore **106 → 116**,
  con dichiarato **quale addendo non è stato rimisurato e perché**.
  ⛔ **E la quarta forma di invecchiamento colta sul fatto un'ora dopo averla
  scritta**: `DEVELOPMENT.md` diceva ancora «il numero da citare resta 2.251» e
  «il giro completo esegue 2.474» mentre il titolo sopra diceva già 2.310 — il
  controllo sorveglia il **totale**, non la prosa che lo spiega. Rimisurato:
  sei suite **2.310**, giro completo **2.576**, e **ogni** addendo della nota
  era vecchio (sintassi 15 → 34, import 134 → 140, nomi liberi 7 → 24).

- [x] ✅ **`giro-sicurezza`: un comando solo per la barriera fra aziende
  concorrenti** (`40640da`). La scoperta dell'unità prima era scritta in un
  checkpoint, cioè in un posto che si dimentica: ora è un comando che alza
  l'emulatore da sé e prova **95 casi** (68 regole di sicurezza, 19 SDK, 8
  primo avvio), tre giri su tre. ⛔ **Dichiara quello che non ha guardato,
  sopra il riepilogo e non in fondo**: `run-fns.mjs` (21) vuole l'emulatore
  delle funzioni, che qui non parte. ⛔ **E se `firebase` o `java` non
  rispondono si ferma dicendolo (uscita 2)** invece di stampare «0 caduti», che
  sarebbe il verde più falso che ci sia. Controprova nei due versi: una suite
  **inesistente** → «non ha girato», una suite che **gira e fallisce** → ✗ col
  conto vero, tutt'e due 0 su 1 e uscita 1. ⚠️ Il conto si legge dalla **riga
  di riepilogo della suite**, non dall'uscita del processo: un processo può
  uscire 0 anche senza aver provato niente.

- [x] ✅ **Sentinella è il primo documento ad arrivare a ZERO di arretrato**
  (`ca99a55`). **Riverificato, non ridatato**: zero occorrenze su 34 termini nel
  diff dei 12 commit (622 righe aggiunte), e la riga a metà sulla
  certificazione rimisurata sui file interi (`61672`, `matricola`, `serial`… →
  0 ciascuno). L'unico commit che morde ha aggiunto quattro funzioni, nessuna
  delle quali costruisce una cosa dichiarata assente. **Arretrato 12 → 0**,
  totale delle sei app **71 → 59**, «mordono» 16 → 15. ⚠️ **E la prima
  riverifica l'ho sbagliata io**: senza confini di parola `LoRa` combacia con
  «co·lora·to», `API` con «C·API·TO», e tutte e 50 le `m/s` sono `mm/s` —
  l'unità della PPV. Cinque falsi allarmi su cinque, **il righello**. Scritto
  anche nel documento, perché una riverifica fatta male manda a lavorare su
  mancanze immaginarie.

- [x] ✅ **Terra è il secondo documento a zero — arretrato 71 → 46 in due
  unità** (`2d292ad`). Terra aveva il caso più insidioso: 13 commit e **cinque
  che mordono**, il numero più alto delle sei. Quei cinque hanno costruito sei
  funzioni e un bottone «Scarica rilievi (CSV)», e **nessuna** è una delle
  quattro cose dichiarate assenti. **Zero occorrenze su 11 termini in 815 righe
  aggiunte**; sui file interi restano quattro parole, tutte estranee (`fill` è
  l'attributo SVG, `taglio` è la classe CSS `dwg-taglio`, `riempimento` un
  commento sulla barra, `floating` la frase «floating-point number»).
  📊 **Arretrato 71 → 59 → 46, «mordono» 16 → 10, documenti a zero 0 → 2 su 6.**
  ⚠️ E la lezione dei **confini di parola** pagata su Sentinella è servita
  subito: senza, `pit` e `cut` sarebbero entrati in decine di parole.

- [x] ✅ **Flotta è il terzo documento a zero — arretrato 71 → 38 in tre unità**
  (`c292bd9`). Era la più economica delle quattro rimaste, e **il perché è
  un'informazione**: **zero commit che mordono** su otto — in quell'intervallo
  Flotta ha cambiato **come** dice le cose, non **quali** cose sa fare. Sul
  diff due sole occorrenze, tutt'e due `fattura` e tutt'e due **prosa** (un
  commento e la nota di un rifornimento della dimostrazione): nessun **legame**
  fra fattura e ordine di lavoro. Sui file interi `km` → **0**, che è la prova
  diretta della riga sui piani a chilometri; `budget` → 1, ed è un commento.
  📊 **Arretrato 71 → 59 → 46 → 38; tre documenti su sei a zero.**

- [x] ✅ **L'arretrato dei sei documenti di ricerca va a ZERO** (`237c02b`),
  chiudendo Campo, Conti e Scudo. `documenti-invecchiati.mjs` dichiarava **71
  commit** «per essere visto scendere»: adesso dice **0, di cui 0 che
  mordono**, per tutti e sei — la prima volta da quando il conto esiste.
  📊 **71 → 59 → 46 → 38 → 29 → 15 → 0**; «mordono» 16 → 0; documenti a zero
  0 → **6 su 6**. ⚠️ Due righe di Conti si sono mosse **intorno** senza
  spostarsi, e sta scritto (la pesa: «si digitano» adesso è stretto, una pesata
  può entrare da un file; l'SDI: il codice destinatario viaggia anche nel CSV,
  ma `FatturaPA` e `p7m` restano a zero). ⛔ **E una prova è invecchiata per la
  SECONDA volta sulla stessa riga** di Scudo («gli export CSV sono quattro» →
  cinque): il verdetto regge, ma quel conto scade a ogni export nuovo, cioè
  **è il numero sbagliato da scrivere** — la riga vive del `grep` su
  `xlsx|excel|jspdf`, che dà zero anche oggi.

- [x] ✅ **Anche la SOMMA SCRITTA deve fare il totale** (`2d905ff`). Il
  controllo sugli addendi c'era, ma leggeva **una notazione sola**: quella a
  parole di `STATO_PRODOTTO.md`. La forma **aritmetica** di `DEVELOPMENT.md`
  («1890 + 300 + 71 + 32 + 9 + 8») non la guardava nessuno — e ci stava dentro
  un difetto vero: «1890 + 297 + **63** + 32 + 9 + 8» fa **2299**, non i 2307
  dichiarati due parole prima. ⚠️ **L'ho trovato a occhio, cioè per fortuna e
  non per controllo.** Stessa lezione dell'elenco `BROWSER` che guardava due
  documenti su tre, in un'altra veste: qui il controllo non arrivava per una
  differenza di **notazione**. La controprova rimette il difetto vero (71 → 63)
  e pretende **almeno cinque addendi**, perché una catena letta a metà
  tornerebbe «a posto» sommando due numeri. 24 → 26 prove.

- [x] ✅ **L'elenco dei MODULI di `run-stile` non era confrontato con niente**
  (`577b5cf`). `SUPERFICI` ha la sua guardia dal 03/08; `MODULI` no, ed è
  scritto a mano **nello stesso file, dieci righe più in là**. Al primo colpo:
  **tre moduli condivisi fuori da ogni regola** — `deepwork-id-client/index.js`
  (l'SDK da cui passa ogni accesso ai dati), `dw-tema.js` (il motore dei temi,
  proprio dove le regole del colore avrebbero più da dire) e `dw-fluido.js`.
  Aggiunti: 300 → 309 prove e **nessuna cade**. ⚠️ **Il risultato onesto è che
  lì dentro non si nascondeva un difetto** — il punto è che per trovarlo
  bisognava **avere l'idea di guardare**, e la guardia toglie quel bisogno.
  Controprova: tolto `dw-tema.js`, il controllo cade e lo **nomina**.
  ⚠️ Terza volta stanotte per la stessa lezione (`BROWSER` due documenti su
  tre, la somma scritta, questo elenco): **un elenco scritto a mano si accorcia
  da solo**. E i numeri sono stati **rimisurati**: 2.320 e 2.589 — il mio conto
  a mano dava 2.588, il +1 era `import esistenti` che conta per file.

- [x] ✅ **Dichiarata l'altra metà del perimetro della copertura** (`23dcd43`).
  Il censimento diceva già che Genesi resta fuori; **cinque moduli condivisi**
  no — quindi «703 su 703, tutte al 100%», il numero che finisce nei documenti
  del fondatore, si leggeva **più largo di quello che è**. La ragione è tecnica
  (legge gli `export` ESM, e quei cinque espongono globali o sono una classe) e
  **non sono scoperti**: adesso è scritto **dove** sono provati.
  ⚠️ **Una ragione tecnica non dichiarata è indistinguibile da una
  dimenticanza** — ed è per questo che un'ora prima tre moduli erano fuori da
  ogni regola di `run-stile` senza che nessuno lo sapesse. ⚠️ E due risultati
  **negativi** scritti come i positivi: `genesi-formato.js` era già nel
  censimento (sembrava il candidato più probabile), e `run-kpi` e
  `import-esistenti` il disco lo leggono già.

- [x] ✅ **`classi-orfane`: l'elenco delle pagine si deriva dal disco — ne
  perdeva quattro** (`f77a45a`). `run-stile` ha la sua guardia dal 03/08 e quel
  giorno trovò quattro pagine dimenticate, «**due che l'utente apre davvero**».
  Qui la guardia non c'era e mancavano **le stesse due**
  (`non-autorizzato.html` e il portone di Genesi): la correzione era stata
  fatta in un file e non nell'altro — **la copia debole applicata a un elenco**.
  12 → **14 pagine**, 1.152 → **1.184 classi**, **zero morte**; la controprova
  scala (14 iniezioni su 14). ⚠️ E per la quarta volta stanotte **il righello
  sono stato io**: un `grep` che pretendeva un prefisso di cartella mi ha
  nascosto che il **core** era già nella lista.
  📊 Filo delle tre unità sugli elenchi a mano: `BROWSER` perdeva 1 documento su
  3, `MODULI` 3 moduli condivisi, `PAGINE` 2 pagine vere.

- [x] ✅ **`leggi-giro`: il lettore che separa il rosso VOLUTO da quello VERO**
  (`087ef5b`). In un registro da cinquemila righe le due specie di rosso si
  scrivono uguali, e il 07/08 questo è costato **due volte in due ore**. La
  cura era già metà fatta — `tutti.mjs` dichiara nell'intestazione quali
  passate sono controprove — ma **mancava chi lo leggesse**. Questo legge la
  **dichiarazione**, non le parole, e mette **prima** le righe «non ho
  guardato». Provato sul registro vero: **42 passate, 369 KO voluti tenuti
  fuori, 4 KO veri, 49 righe cieche**; e dichiara il registro **tronco** quando
  manca la riga d'uscita. Controprova sulle due trappole vere (la
  sotto-intestazione a sei uguali, il KO dentro una controprova).

- [x] ✅ **I soggetti del modo erano TRE, e il commento diceva DUE**
  (`b646f9e`). Primo KO del giro raccolto, e più interessante di come sembrava.
  `--live` fa credere a Campo di essere in produzione e iniettava il modo in
  **due** posti; dal 06/08 sono **tre** (c'è anche il **nome del file**). Il
  commento del banco diceva testualmente «I SOGGETTI SONO DUE» proprio mentre
  ne mancava uno. Effetto **doppio e in direzioni opposte**: nella passata
  normale accusava il prodotto per il marchio che il prodotto mette di
  proposito; nella passata `--live` **non poteva accorgersi** se il nome
  smettesse di obbedire al modo — «i fogli escono puliti» detto avendo guardato
  **due vestiti su tre**. Corretti tutt'e due, e l'asserzione è **più giusta,
  non più permissiva** (uguaglianza esatta nei due versi, non un suffisso).
  35/35 in entrambe le passate, iniezioni «come live» **6 → 9**. ⚠️ Il prodotto
  non è stato toccato: mancava chi lo verificasse.

- [x] ✅ **La riga accusava il prodotto per una CORREZIONE del prodotto**
  (`3a2fc27`). Secondo KO del giro: l'asserzione portava dentro `/56/` e
  `/su 12/`, e la frase è cambiata **di proposito** con `f108ef0` («"0 mc" dove
  nessuno aveva misurato») — cioè il banco ostacolava una correzione fatta in
  nome del **principio del fondatore**. ⚠️ E il `56` era **peggio**: un numero
  atteso scritto a mano. **Quattro righe più in basso lo stesso file fa già la
  cosa giusta** («i due numeri si prendono dai due posti e si confrontano»): la
  riga sbagliata stava **sopra** quella giusta. Adesso prova il **significato**
  — quanti fori, e la riserva dichiarata con «almeno». Provato che distingue su
  cinque casi, e **accetta anche la frase vecchia** (non ho pinnato la nuova al
  posto di quella vecchia). 67 passate, 0 cadute; prodotto non toccato.

## Riferimenti

- Ultimo checkpoint **per data vera**:
  `vault/checkpoints/20260808-025303_un-a-capo-che-chiude-solo-se-chiude.md`
  *(dato da `node apps/deepwork-id/tests/date-checkpoint.mjs`, non letto a occhio:
  per NOME il più alto sarebbe `20260805-100000_…`, che è stato scritto **tre
  giorni prima**. Questa riga era ferma al 01/08: il puntatore al file più
  fresco era lui stesso il più vecchio.)*
  ⚠️ *Non* il più alto in ordine alfabetico: in `vault/checkpoints/` ci sono
  ancora file **datati avanti** rispetto al giorno in cui sono entrati in git
  (640 precedenti alla regola, contati da `date-checkpoint.mjs`). Chi va per
  nome apre il file sbagliato credendo che sia il più fresco.
- Le decisioni: `docs/DECISIONI_WEEKEND.md` — pagina d'ingresso in cima.
- Stato misurato all'**08/08** (lanciando le suite, non a memoria):
  **2.326 prove** che girano senza rete — e la frase va letta stretta: sono la
  somma delle **sei** suite che contano asserzioni (`run-kpi` 1892, `run-stile`
  314, `run-helpers` 71, `run-pointcloud` 32, `run-manifest` 9, `run-demo` 8),
  non tutto ciò che gira nel giro `node`, che di comandi ne ha **23**.
  Copertura **703/703** e nessuna funzione scoperta; **153 esecuzioni** che
  aprono le pagine in un browser vero (**71** file di banco distinti, contati
  dalla tabella `BANCHI` di `tutti.mjs` e non a occhio dalla cartella, che ne
  ha 75 perché contiene anche gli aiuti — `giro.mjs`, `impronta.mjs`, il
  runner stesso).
  *(Al 07/08 sera erano 2.307; al 07/08 notte 2.193, 662/662 e 120; al 03/08 pomeriggio 2.092,
  649/649 e 84; al 02/08 1.838, 591/591 e 49.)*
  ⚠️ **Questi numeri non si scrivono a mente** — ma attenzione al
  denominatore: `numeri-nei-documenti.mjs` sorveglia `docs/DEVELOPMENT.md` e
  `docs/STATO_PRODOTTO.md`, **non questo file**. Ed è per questo che la riga
  qui sopra è rimasta ferma a «120 banchi» mentre ne erano già 147: qui il
  controllo non arriva, e l'aggiornamento è a mano. Chi la legge lo sappia.
