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
      - [x] **5b — la MISURA, che viene prima della funzione** *(08/08)*: fatta e
            scritta in `docs/DUE_PERSONE_STESSA_RIGA.md`, con lo strumento che la
            rifà (`tests/due-persone-stessa-riga.mjs`, sotto emulatore). Sei casi
            misurati con due contesti autenticati e le regole vere. Campi diversi
            **convivono**; lo stesso campo **vince l'ultimo**; ma il caso che le
            app usano davvero — la lista letta, cambiata in un punto e
            **riscritta intera** — fa **sparire in silenzio** la spunta
            dell'altro. Censiti **12 punti in 4 app**; la cura è una riga per
            punto (il percorso puntato), provata nella misura stessa.
            ⚠️ La **funzione** (coda offline) NON è fatta e non va fatta prima:
            mettere in coda scritture che si cancellano a vicenda moltiplica il
            problema invece di risolverlo.
      - [ ] **Il tema del SOLE su quattro superfici su dieci — proposta misurata
            (08/08)**. Nata da 24 righe «NON misurata» del giro del browser, che
            si leggono prima dei KO. Misurato con `<script src>` (non a
            occhio, e non contando i commenti — sbagliato una volta oggi):
            caricano `shared/dw-tema.js` **solo le sei app verticali**. Fuori
            restano il **core** (che ha un suo impianto a due temi, chiaro e
            scuro, dichiarato nel suo commento), e — **senza nessun tema** — la
            **vetrina**, **Genesi** e **Deepwork ID**.
            ⚠️ Perché conta e non è un dettaglio: il sole è il tema che rende
            leggibile un telefono **in cava**. Genesi si usa **al fronte**, e la
            schermata di **accesso** è la prima cosa che si apre, all'aperto.
            ⛔ **NON fatto di proposito**: l'estetica è una direttiva vincolante
            del fondatore (palette propria per app, scelta con ricerca cromatica
            vera e verificata per contrasto). Qui c'è la misura e il perché;
            la scelta è sua.
      - [x] ✅ **5b — i 12 punti**: **11 su 12** non riscrivono più l'elenco
            intero (percorso puntato, contrassegno di cancellazione,
            transazioni); il dodicesimo (`atmosfera`) è fuori **con la ragione**,
            e una prova pretende che resti così.
      - [x] ✅ **5b — la MISURA del lavoro senza rete** *(08/08)*, che il
            fondatore aveva messo prima della funzione. Fatta col ponteggio
            nuovo (`tests/browser/ponte-emulatore.mjs`) e
            `tests/browser/coda-offline.mjs`. Esito in
            `docs/DUE_PERSONE_STESSA_RIGA.md`: la coda **arriva da sola** al
            ritorno della rete (buono), ma **chi era staccato sovrascrive in
            silenzio** chi era in linea — la stessa perdita silenziosa che
            questa settimana sta togliendo, un piano più in su, e **le
            transazioni non la coprono**.
      - [ ] **5b — la DECISIONE che ne segue, ed è del fondatore**: accendere la
            coda offline vuol dire scegliere *chi vince* e *come si dice a chi ha
            perso*. Senza quella risposta, accenderla introdurrebbe una perdita
            silenziosa: quindi **non è stata accesa**.

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

- [ ] **I ternari del singolare che restano nelle app** — ⏱️ *censito da capo
      l'09/08, e adesso c'è un numero invece di un'impressione: **54 punti da
      leggere** in 12 file su 16 guardati, con **69 scartati** perché hanno una
      guardia sulla loro variabile e **9** perché sono costanti.* Poi lavorati
      su cinque superfici — Sentinella 7, Scudo 3, Genesi 10 (pagina e modulo),
      Campo 5, core 1 — e il conto è sceso a **24 in 8 file**. Restano Conti,
      Flotta (il gruppo più numeroso: ore motore, giorni di copertura, mesi
      registrati, finestra dei fermi) e Terra — poi chiusa anche Flotta (7).
      ⏱️ **Stato all'09/08 dopo sei unità: 115 candidati → 17, e i 17 hanno
      TUTTI una ragione scritta**, cioè il filo è esaurito, non abbandonato:
      · **6 sono commenti o testo di questo file** (il ruolo di misura, non un
        controllo: non toglie i commenti multi-riga, ed è dichiarato);
      · **4 hanno un dominio che non contiene 1**: `quantiMesi` ∈ {12,6,4} in
        Scudo, `v.slice(1)` ∈ {6,12,24} in Flotta, `c.termine` ∈ {12,24} per
        l'art. 26, e `mesi > c.termine` che ne discende;
      · **4 sono guardati da un'altra variabile che li obbliga a ≥ 2**:
        `p.n` di Sentinella (`abbastanza` = `letture.length >= minLetture`, e
        `minLetture` è un `Math.max(2, …)`), `m.n` di Genesi (`nums.length < 2`
        esce prima), `righe.length` di Conti (≥ `varianti.size` > 1), e la voce
        senza data di Conti (ternario su `una`);
      · **3 sono le ORE MOTORE di Flotta** (`orePreviste`, `ogniOre`, `v.ore`):
        un piano a **un'ora** motore non è un caso del mestiere — dichiarati
        invece che cambiati, perché toccare un soggetto sano è il difetto che
        questa notte ha già evitato due volte.
      Restano al plurale **dichiarati**: «campioni» di un'onda sismografica
      (migliaia; un'onda da un campione non è un'onda) e «foto», invariabile.
      ⛔ **E IL CASO CHE NESSUN CENSIMENTO PUÒ PRENDERE: la guardia c'era, ma su
      un altro numero.** In Campo `r.scadute.length > 1` decide **se** scrivere
      la coda, ma il numero **stampato** è `length - 1`, che vale esattamente
      **1** quando i documenti sono due — il caso più comune. «e altri 1
      documenti». Sono due variabili diverse che sembrano la stessa: quella che
      decide e quella che si legge.
      ⚠️ E una riga segnalata **non è ancora un difetto**: in Scudo una
      correzione è stata fatta e poi **ripristinata**, perché `quantiMesi` vale
      12, 6 o 4 — mai 1. Non si tocca un soggetto sano perché lo dice il
      righello. Non si traducono in una notte; quando si fa,
      si fa con `conta`/`plurale`, non a mano.
      ⛔ **E IL CENSIMENTO PRECEDENTE VEDEVA IL 14% DEI SUOI SOGGETTI**, per la
      ragione di sempre: conosceva **una sintassi sola**. Cercava solo i
      template literal (`${n} fori`) e non la **concatenazione** (`+n+' fori'`),
      che è la forma con cui Genesi e Sentinella scrivono quasi tutto: 16
      candidati contro **115**. È la stessa famiglia del «censimento che cerca
      UN nome» costato trecento righe di banco, e dei commenti da togliere in
      tutt'e tre le sintassi di una pagina.
      ⚠️ E il righello ha sbagliato due volte prima di reggere, tutt'e due col
      segno che si riconosce: (1) l'estrattore del nome pretendeva un `+` che il
      pattern aveva **già mangiato**, e rispondeva «nome vuoto» a **tutti** i
      109 casi — un difetto identico dappertutto è il modo in cui si vede di
      stare guardando il righello; (2) la guardia veniva cercata in **una riga**
      di contesto, mentre un ternario scritto su quattro righe mette
      `x === 1` in cima e il plurale in fondo (il ritmo dei rilievi di Terra,
      **sano**, risultava un difetto). Con tre righe di contesto: 109 → 54.

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
- [ ] **B3. Genesi continua a uscire dalla pagina.** ⏱️ *Numeri rimisurati
      l'**09/08** lanciando `copertura-funzioni.mjs` e `genesi-estraibili.mjs`,
      non a memoria — ed erano di nuovo invecchiati: la riga diceva **171**
      funzioni nella pagina e sono **166**, e **87** estraibili quando sono
      **82** (57 leggono una o due variabili del modulo e si portano fuori
      passandogliele, 6 scrivono nel DOM con `$(...)` e restano dov'è giusto
      che restino, 25 ne leggono più di dieci e lì è un rifacimento).*
      ⚠️ È la **terza** rimisurazione di questa stessa riga in tre giorni
      («186 → 174» il 04/08, **171** il 06/08, **166** oggi), e ogni volta il
      numero era sceso senza che nessuno lo aggiornasse: un conto che si muove
      da solo va **derivato da un comando**, non ricopiato — la riga adesso
      dice **quale** comando.
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
- [x] ✅ **Le due code della verifica periodica — chiuse tutt'e due, e la riga
      era rimasta aperta per giorni sopra un lavoro già fatto** (verificato
      l'09/08 col comando, non a memoria). ① La prova della modale non vive più
      in scratchpad: è `tests/browser/scudo-verifica-periodica.mjs` (17
      asserzioni), portata dentro da `f81d127` — il cui messaggio dice proprio
      «riscritta perché la prima era rimasta nello scratchpad» — ed è
      **registrata** in `tutti.mjs` alle righe 375-376, con la sua controprova.
      ② Il contrasto non è più «un tema su tre»: `contrasto.mjs` è registrato
      con `--tema=chiaro` e `--tema=sole` (righe 90-91) più quattro controprove,
      e le sei palette chiare sono state chiuse una per una (`73d1ae3` per
      Scudo).
      ⏱️ **Quinta riga in due giorni che proponeva un lavoro già chiuso.** Le
      altre quattro: la geometria dei gradienti in `CLAUDE.md`, la scala
      `--nav-scala`, il commento di `stampe-fs` su Campo, e la mia riga su Scudo
      di stanotte. La cura è la direttiva 7 — **chi chiude un'unità aggiorna la
      riga che gliel'aveva proposta** — e qui non è stata applicata perché il
      lavoro è arrivato da un cantiere che quella riga non l'aveva letta.
- [ ] **C2. Ricerca a rotazione**, una app per giro, col vincolo che ha fatto la
      differenza: **incollare il comando e la sua uscita** per ogni «non c'è».
      Misurato su tre tornate: chi va a cercare **il meccanismo** nel modulo
      rende 3 proposte su 3; chi cerca **la nostra parola** rende 1 su 5.

### E — Rimandati dalla settimana dell'estetica (aperti, non decaduti)

- [ ] **E0.** Consolidamento in `shared/` — proseguito parecchio stanotte (data
      italiana, lettura CSV, allegati, conto dei giorni, unità di misura), resta
      il censimento di ciò che è ancora scritto due volte.
      ⏱️ **PRIMO PEZZO DEL CENSIMENTO, MISURATO L'09/08 — e il risultato è più
      grosso di quanto la riga lasciasse pensare.** `shared/dw-app-shell.css`
      definisce **18** classi (`top`, `sec`, `page`, `item`, `name`, `meta`,
      `badge`, `avatar`, `note`, `info`, `sub`, `arr`, `active`, `accent`,
      `ok`, `warn`, `dw`, `dw-home`) ed è dichiarato in `CLAUDE.md` come «il
      veicolo tecnico della STRUTTURA». Ma **lo carica solo 2 pagine su 8**:

      | pagina | carica `dw-app-shell.css` | classi condivise usate | ridefinite NELLA pagina |
      |---|---|---|---|
      | conti | **sì** | 18/18 | — |
      | sentinella | **sì** | 18/18 | — |
      | flotta | no | 18/18 | **16/18** |
      | scudo | no | 18/18 | **12/18** |
      | terra | no | 18/18 | 7/18 |
      | campo | no | 17/18 | 7/18 |
      | core | no | 11/18 | 6/18 |
      | genesi | no | 8/18 | — |

      Cioè le sei verticali **parlano la stessa lingua** (17-18 classi su 18) ma
      sei pagine su otto se la **riscrivono in casa**: l'allineamento non è
      tenuto dal foglio condiviso, è tenuto dalla **convenzione** — e da adesso
      da `famiglia-strutture.mjs`, che è l'unica cosa che se ne accorgerebbe.
      Delle 18, **una sola** (`dw`) è definita anche in `deepwork-style.css`,
      quindi le altre 17 non arrivano da lì.
      ⛔ **NON è un cantiere da aprire di slancio, ed è la ragione per cui non
      l'ho aperto**: far caricare il foglio a sei pagine tocca sei file e può
      cambiare l'aspetto di tutto, e la direttiva sull'estetica è del fondatore.
      Quello che serviva era il **numero**, e adesso c'è. Si rifà con
      `scratchpad/sing/vocab.mjs` (o si riscrive in dieci righe: quali classi
      definisce il foglio, chi lo carica, chi le ridefinisce).
      ⚠️ E il core è il caso a parte, già misurato dall'altro verso: non ha né
      `.top` né `.sec` (usa `.sec-title`), quindi con le sei condivide **11**
      classi su 18 e il resto lo chiama in un altro modo.
      ⏱️ **SECONDO PEZZO: le pagine che ridefiniscono divergono davvero dal
      foglio?** Misurato, e il conto va letto con la sua ampiezza: su **16
      proprietà confrontabili** (poche, perché il confronto vede solo i
      selettori semplici `.x{…}` e le pagine usano quasi sempre selettori
      composti) escono **13 divergenze**. Ma **5 stanno dentro `@media print`**
      e vengono confrontate con la regola di **schermo**: due mondi che non si
      applicano mai insieme, cioè **falsi allarmi per costruzione**. È la
      trappola già pagata su `run-stile` — un controllo statico sui valori CSS
      che non sa in che contesto vive la regola.
      ⛔ **Le 8 che restano non sono difetti: sono un SEGNALE, e punta al foglio
      condiviso.** Sono tre sole decisioni, e ognuna è presa **in tre app**:
      `.arr` a 15px invece di 18 (Flotta, Scudo, Terra), `.arr` in `--muted2`
      invece di `--muted` (Flotta, Terra), `.item{cursor:pointer}` invece di
      `default` (Campo, Flotta, Terra). Quando **tre app su sei** scavalcano la
      stessa dichiarazione **nella stessa direzione**, il valore sbagliato è
      quello condiviso — è la forma esatta del caso `.nav button` del tema del
      sole, dove tre app che ridicevano la stessa scala hanno rivelato che il
      difetto stava in `shared/`.
      ⚠️ **Misura, non regola** (e scritto qui perché nessuno la rifaccia alla
      cieca): con un denominatore di 16 proprietà e 5 falsi allarmi su 13, un
      controllo automatico su questo fronte oggi **non regge**. Servirebbe prima
      un confronto che conosca il **contesto** della regola (`@media`, selettore
      composto) — e quello è un cantiere a sé.
      ⛔ **E LA PRIMA DELLE TRE È STATA INSEGUITA, MISURATA, E SI È RIVELATA UN
      FALSO ALLARME MIO — quarta volta stanotte, e vale scriverla.** Sembrava
      che `.item{cursor:default}` del foglio condiviso fosse un'affordance
      sbagliata: aprendo Conti e Sentinella — le due che caricano il foglio —
      contavo **74 e 26 righe cliccabili con la manina spenta**. Sotto c'era il
      mio righello: contavo cliccabile una riga che **contiene** un bottone,
      mentre `promesse-tocco.mjs` scrive nella sua intestazione che *«un
      aggancio DENTRO la riga non conta: lì il bersaglio è il bottone»*.
      Rimisurato con la sua regola: **Conti 9 righe agganciate davvero, 0 senza
      manina; Sentinella 0 e 0.** Il `default` è **deliberato** (nasce da quel
      banco il 01/08, contro le righe di mockup che promettevano un tocco e non
      facevano niente), e le tre app che lo scavalcano hanno righe costruite da
      JavaScript che la manina se la mettono in riga.
      ⚠️ La lezione, che è sempre la stessa: **quando una mia misura contraddice
      un banco che esiste, il sospettato è il righello, non il banco** — e la
      risposta stava scritta nell'intestazione del banco, che era da leggere
      PRIMA di misurare.
- [ ] **E7.** Genesi — allineamento delle parti 2D/HUD al core (la scena 3D
      resta come sta: è un'altra cosa).
- [ ] **E8.** Verifica finale: le sette pagine affiancate devono sembrare la
      stessa famiglia.
      ✅ **La METÀ misurabile è chiusa l'09/08 ed è dentro il giro**:
      `tests/browser/famiglia-strutture.mjs` (20 asserzioni, **6 superfici su
      6**, 0 dichiarate non misurate) pinza ciò che
      `docs/E8_LE_PAGINE_AFFIANCATE.md` aveva trovato **identico** — barra alta,
      altezza e tipografia del titolo di sezione — col riferimento preso dalla
      prima superficie invece che scritto a mano, e con la controprova.
      ⛔ Prima viveva **nello scratchpad**: il documento, alla riga «come si
      rifà», mandava a `scratchpad/<tuo>/famiglia.mjs`. Una difesa nello
      scratchpad alla sessione dopo non esiste — è lo stesso difetto della prova
      della verifica periodica di Scudo, e adesso la riga del documento è
      corretta (direttiva 7).
      ⚠️ **Resta aperta la metà che i numeri non sanno fare**: il foglio a
      contatto va **guardato**. I numeri dicono se una barra è alta uguale, non
      se la pagina *sembra* della stessa famiglia — e il banco non finge di
      saperlo.
- [ ] **G7–G9.** Genesi: ottimizzatore di volata, report professionale,
      rifiniture di scena.
- [ ] **Q1.** Proposte di `docs/RICERCA_DEEPWORKID_202607.md` (ruoli reali
      dentro l'organizzazione) — legata alla decisione **10b/10c**.

- [ ] **I 20 KO del giro del 09/08, riverificati sul commit di adesso** — la
  riverifica è cominciata e i primi due fronti hanno risposto in modo opposto,
  che è esattamente perché la sezione 0 esiste:
  · ✅ **Conti, i due KO sul CSV dei costi: GIÀ CHIUSI.** `conti-documenti-che-escono`
    sul commit di adesso dà **81 passati, 0 falliti, 12 punti d'uscita su 12
    aperti**. Erano veri a `7cddb59` e li ha chiusi il lavoro sulle voci senza
    importo. Senza la sottrazione dell'età si sarebbe aperto un cantiere su un
    difetto che non c'è più;
  · ⛔ **Scudo, le tendine tagliate: ANCORA VERE, 5 su 5.** `modali-dentro
    --solo=scudo` le ridà tutte (12 aperture di modale, 324 elementi, 120 voci
    di tendina, 1 superficie su 1). È la famiglia più numerosa del giro e
    nessuna unità del 08-09/08 l'ha toccata.
  ⛔ **La diagnosi, che è la parte che vale**: nella modale «Verifica
  periodica» le voci si compongono come `${d.titolo} · ${d.tipo}`, e i titoli
  della dimostrazione cominciano **tutti** con la stessa frase — «Verbale
  verifica periodica — ». Dentro *quel* menù a tendina quel prefisso porta
  **zero informazione** (il menù elenca solo verbali, e l'etichetta sopra dice
  già «Il verbale»): quello che distingue è la **coda** — «piattaforma
  elevabile», «autogru 30 t» — ed è proprio la coda che viene tagliata. 561 px
  di testo in 284 a 390 px, in 214 a 320.
  ⛔ **E LA STRADA CHE AVEVO SCRITTO QUI È STATA PROVATA E NON FUNZIONA — la
  lascio scritta col perché, perché sembra giusta.** L'idea era «togliere ciò
  che è identico fra tutte le voci», calcolando il prefisso comune. Scritta,
  provata in scratchpad su sei casi (tutti corretti), messa nella pagina… e il
  banco ha ridato **gli stessi 5 KO, identici**. Il motivo sta una riga più su
  nel codice: `docOrd` non sono i **verbali**, è `DOC` — **tutti** i documenti,
  soltanto ordinati coi verbali davanti. Il prefisso comune fra «DVR», «POS» e
  «Verbale verifica periodica — …» è **vuoto**, quindi la funzione faceva
  correttamente niente. Il prefisso lo condividono i due verbali **fra loro**,
  non con la lista. **Ripristinato**: un codice che misurabilmente non fa
  niente, dentro una modale di conformità, è peggio del KO aperto.
  ⛔ **La strada vera, e la ragione per cui è un'altra**: il banco misura la
  voce **selezionata a tendina CHIUSA**, e un `<select>` chiuso non manda a
  capo — con un titolo lungo taglierà **sempre**, qualunque cosa si tolga.
  Quindi non si combatte la piattaforma: la parte che distingue va messa dove
  si può leggere — **un suggerimento sotto il campo che mostra il titolo intero
  del documento scelto**, aggiornato al cambio. Così la tendina resta quello
  che è e l'informazione arriva lo stesso.
  ⚠️ E `#vf-ente` («Soggetto pubblico o privato abilitato», 254 px in 214) è un
  caso diverso e **non si tocca senza il fondatore**: è il termine dell'**art.
  71 c.11**, non una nostra etichetta.
  · ⛔ **Campo, i 3 del foglio di turno: ANCORA VERI, e nella direzione che
    pesa.** La passata normale dà **35 passati, 0 falliti** — è la variante
    `--live` a cadere (32/3), cioè quella che finge i **dati veri**: con i dati
    veri la consegna `.txt` **continua a dichiararsi fatta di dati d'esempio**
    (la riga sta al carattere 33, prima del primo dato). È il danno peggiore
    che questa famiglia di banchi esiste per impedire — l'opposto del caso di
    Scudo, dove il rischio era marchiare il fascicolo di un lavoratore vero.
    ⚠️ E non è un'iniezione scaduta: `iniezioni-fresche` dà **215/215 sul
    bersaglio**, e il banco dichiara «6 iniezioni come live».
    ⚠️ **Da riverificare col flag giusto**: la prima passata che ho lanciato era
    quella di serie e diceva 0 falliti — la riga del giro si chiama «foglio di
    turno · **coi dati veri tace**», e in `tutti.mjs` è `['--live']`. Riverificare
    un KO con la passata sbagliata è il modo più facile di dichiararlo chiuso.
  ✅ **RIVERIFICA COMPLETA: 20 su 20 guardati sul commit di adesso.**
  **2 chiusi** (il CSV dei costi di Conti) e **18 ancora veri**:
  | fronte | quanti | nota |
  |---|---|---|
  | tendine di Scudo (`#vf-verbale`, `#vf-ente`) | 5 | 561 px in 284 · 499 in 284 · 254 in 214 |
  | foglio di turno di Campo (`--live`) | 3 | la consegna vera si dichiara d'esempio |
  | frasi della nuvola di Genesi | 4 | ritaglio e sottocampionamento |
  | stati «non misurato» di Campo | 2 | non compaiono in `#rap-cop` e `#disp-stato` |
  | tendina di Sentinella (`#ppv-scelta`) | 2 | **290 px in 284**: sei px |
  | barre di peso di Conti | 1 | fasce a zero da confrontare |
  | manina di Campo | 1 | ✅ **chiusa il 09/08**: `.pon-voce` è la testata di un pannello già aperto, non una voce che si apre → `cursor:default`. 519 voci su 14 superfici, da 1 a **0** |
  ⛔ **QUELLO CHE AVEVO SCRITTO QUI ERA FALSO, E LA SMENTITA È LA PARTE UTILE.**
  Avevo dichiarato i 2 stati di Campo «buchi di prodotto, provato col comando»:
  `grep -c "rapportini ancora senza data"` dava **0 e 0**, e ne avevo concluso
  che la frase non fosse mai stata scritta. **Il primo dei due non è un buco:
  la frase c'è, funziona, e il banco la stava chiedendo al PLURALE.**
  Il reso dice «(**1 rapportino** ancora senza data)» — uno solo, quindi
  `conta` scrive giusto al singolare — e la regex del banco pretendeva
  «rapportini». Difetto del **banco**, corretto lì (`/rapportin[io] …/`).
  ⚠️ E l'errore del mio `grep` è quello che vale: nel sorgente quelle parole
  **non sono adiacenti** — in mezzo c'è
  `${conta(sdRap, "rapportino", "rapportini")}` — e lo diventano solo nel
  **reso**. **Un `grep` su un testo interpolato risponde «non c'è» con la
  stessa faccia della verità**, ed è la stessa famiglia del censimento che
  cerca un nome solo. La misura giusta era aprire la pagina e leggere
  `#rap-cop`, che costa un minuto.
  ⚠️ Ed è il filo del singolare che torna dall'altra parte: il prodotto era
  **già** corretto, e a essere scritta al plurale era l'**attesa**.
  Sono due «numeri tranquilli» nel senso del fondatore: la riga della copertura
  dice «rapportini consegnati da 2/3 squadre» mentre uno **senza data** resta
  fuori dal conto **senza dirlo**; e la disponibilità stamperebbe una
  percentuale dove i due numeri **si contraddicono** (fermo oltre la durata
  dichiarata del turno) invece di dire «non calcolabile». Il secondo è l'unico
  caso del banco che **non può stare nella dimostrazione** — è un dato
  *corrotto*, non *assente* — e si raggiunge digitando.
  ⛔ **E ANCHE IL SECONDO NON È UN BUCO DI PRODOTTO — ma qui la correzione
  facile avrebbe prodotto un VERDE FALSO, ed è la ragione per cui non l'ho
  fatta.** Riprodotto il caso del banco passo per passo (apri `#nav-rap`,
  scrivi `0,5` in `#disp-ore`, tocca `#btn-disp`, leggi `#disp-stato`):
  · il prodotto dice **«DISPONIBILITÀ NON CALCOLATA»** e **non stampa nessuna
    percentuale** — cioè fa esattamente quello che il principio del fondatore
    chiede — mentre il banco cerca «non calcolab**ile**». **Una parola di
    scarto fra l'attesa e il prodotto**, come per il rapportino al plurale;
  · ma il motivo che la pagina scrive è **«non è registrata nessuna attività
    per questo turno»**, non la contraddizione fra fermo e durata: nella
    dimostrazione quel turno **non ha attività**, quindi lo scenario **non
    raggiunge il caso** che il banco esiste per provare.
  ⛔ Quindi correggere solo la parola lo farebbe passare **senza aver mai
  provato la contraddizione**: è la prova che non prova niente. Il lavoro vero
  è **lo scenario** — registrare prima un'attività con dei minuti di fermo, poi
  dichiarare un turno più corto — e allora la parola si aggiusta da sé perché
  si vedrà che cosa la pagina scrive **in quel** caso.
  ⚠️ Due KO su due, in questa famiglia, erano **attese del banco** e non
  difetti del prodotto. Vale la pena dirlo: il conto «17 veri» di stanotte è
  una stima **per eccesso**, e ogni riverifica lo sta abbassando.
  ⛔ **MA I 4 DI GENESI SONO PRODOTTO, e si vede solo leggendo il RESO** — la
  stessa lettura che avrebbe risparmiato le due diagnosi sbagliate qui sopra.
  Il banco chiede `41.230`, `88.000 punti caricati`, `120.000 punti caricati`;
  la pagina rende:
  · `41230 punti nel ritaglio · volume ≈ 1.234 m³`
  · `250000 punti disegnati su 3.000.000 caricati`
  · `88000 punti caricati` · `120000 punti caricati`
  Cioè **i numeri non sono formattati all'italiana**: `41230` invece di
  `41.230`. E si vede che la formattazione **c'è altrove nella stessa riga**
  («1.234 m³», «3.000.000 caricati»), quindi non è una scelta: è un punto
  saltato.
  ⚠️ Non è la sottigliezza del raggruppamento a quattro cifre fra Node e
  Chromium (`min2`, `docs/MIGLIAIA_NODE_CONTRO_CHROMIUM.md`): questi sono
  numeri a cinque, sei e sette cifre resi **nel browser** e non raggruppati
  affatto.
  ⛔ **Prossimo passo**: trovare dove si compongono quelle quattro frasi e
  passarle dal formattatore che la riga usa già due parole più in là.
  ⛔ **APERTO IL PIÙ PICCOLO PER PRIMO — e ha risposto alla domanda di disegno,
  ma non come credevo: QUESTA FAMIGLIA NON SI CHIUDE ACCORCIANDO IL TESTO.**
  La tendina di Sentinella sfora di **6 px** a 390 (290 contro 284) e di 76 a
  320. Aprendo il codice, tre fatti che decidono:
  1. **l'autore lo sapeva già** — il commento sopra dice «etichette corte:
     dentro un `<select>` di una modale da 440 px una riga lunga viene
     tagliata, e un dato tagliato non si legge»: la voce **è già** la versione
     corta, `«5,6 mm/s · <punto>»`;
  2. **quello che sfora è DATO DELL'UTENTE** — il nome del punto di misura
     («Vibrazioni V2 — confine Nord»). Non è nostro e non ha lunghezza massima:
     un cliente col nome più lungo farà cadere il banco comunque;
  3. **il «suggerimento sotto» che avevo ipotizzato come strada giusta per
     Scudo ESISTE GIÀ QUI**: `#ppv-info`, che mostra il dettaglio del punto
     scelto. E il banco cade lo stesso.
  ⛔ Quindi la domanda non è di prodotto ma di **standard del banco**: così
  com'è posta — «la voce scelta si legge tutta a tendina chiusa» — è
  **inevitabilmente fallibile** da un nome abbastanza lungo, su qualunque app.
  Le due uscite oneste sono (a) accettare la voce tagliata **quando il dato
  intero è leggibile lì accanto** (che è il caso di Sentinella, e sarebbe da
  costruire per Scudo), oppure (b) cambiare il campo — non più un `<select>`
  nativo, ma un elenco che va a capo. **La (a) cambia uno standard e la (b) è
  un pezzo di interfaccia nuovo: nessuna delle due la prendo da sola.**
  ⚠️ È la stessa disciplina del `#vf-ente` di Scudo (termine di legge) e della
  scala `--nav-scala`: quando la strada tocca una decisione del fondatore, si
  porta la **misura** e le **due uscite**, non una correzione fatta di slancio.

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
  ✅ **Scudo misurata l'09/08, ed è dentro il banco** (`scudo-documenti.mjs`):
  i due fogli stampabili — il verbale DPI e la cartella del lavoratore — hanno
  adesso la loro prova di larghezza, con l'iniezione che la fa cadere
  (27/27 difetti rimessi, controprova OK). Esito: **tutt'e due ci stanno**.
  ⛔ **E LA PRIMA STESURA ACCUSAVA UN FOGLIO SANO** — il righello, non il
  soggetto, per l'ennesima volta. Copiando la domanda di `stampe-fs` chiedevo
  `scrollWidth <= window.innerWidth` a **430, 390 e 320 px**, e il verbale
  cadeva a tutt'e tre con 626 px. Ma un foglio che vive dentro `@media print`
  **non si stampa sul telefono, si stampa sulla carta**, e la carta la pagina
  la dichiara: `@page{size:A4; margin:16mm 14mm}` → 210 − 28 = 182 mm =
  **688 px CSS**. I 626 px della tabella a otto colonne ci stanno con 62 px di
  margine. La correzione «ovvia» sarebbe stata **togliere una colonna al
  verbale che in ispezione viene chiesto per primo**: un righello che sbaglia
  manda a rovinare cose sane. Adesso la larghezza si **legge dalla regola
  `@page`** invece di essere scritta a mano, e se la regola non c'è il banco lo
  dichiara e ripiega su A4 invece di far finta di saperlo.
  ⛔ **E LA STESSA DOMANDA VA RIFATTA A `stampe-fs.mjs`, CON UN SOSPETTO
  PRECISO — misurato in parte l'09/08, e la parte che manca è dichiarata.**
  Quel banco misura i suoi fogli contro la **finestra** (390 px). I suoi
  soggetti vivono in un popup, quindi a schermo la domanda ha senso; ma quei
  fogli **si stampano**, e allora il denominatore giusto è la carta.
  Misurato: dichiarano una regola `@page` **Flotta, Sentinella e Conti**;
  **Terra e Campo no** (quindi per loro la carta è A4 coi margini del browser,
  ~718 px). E la direzione dell'errore è quella che fa male: **390 px è più
  STRETTO di 718**, quindi quel banco può produrre **accuse false**, non
  assoluzioni false — che è esattamente quello che è successo a me sul verbale
  di Scudo, dove 626 px «non ci stavano» in 390 e ci stanno benissimo in 688.
  ✅ **E IL SOSPETTO SI RISOLVE AL CONTRARIO DI COME L'AVEVO SCRITTO — vale la
  pena tenerlo, perché la correzione è il metodo.** Avevo scritto che il
  difetto del prospetto di Terra («435 px dentro 390») poteva essere
  un'accusa falsa. Ragionato fino in fondo, non lo è, e nemmeno può esserlo:
  **la domanda di `stampe-fs` è più STRETTA di quella della carta**, non
  diversa. Un foglio che ci sta in 390 px ci sta per forza anche in 718 —
  quindi quel banco **non può produrre assoluzioni false**, e le sue accuse
  chiedono al foglio più di quanto chieda la stampante. Chiedere di più è una
  scelta difendibile: un prospetto che si legge anche su un telefono è meglio,
  non peggio, e la correzione del 07/08 ha reso il foglio più robusto invece
  che inseguire un difetto immaginario.
  ⚠️ Quello che resta vero del sospetto è solo il **nome**: chiamare «larghezza
  del foglio» una misura contro la finestra è il modo in cui qualcuno un giorno
  copierà quella domanda dove il denominatore conta davvero — cioè su un foglio
  che vive in `@media print`, come i due di Scudo, dove 390 px accusano un
  documento che ci sta con 62 px di margine. La differenza sta nel **dove vive
  il foglio**: un popup si misura contro la finestra, un `@media print` contro
  la carta.
  ⛔ La cosa da fare non è quindi cambiare `stampe-fs`, ed è la ragione per cui
  non l'ho toccato: **è che la funzione che decide la carta stia in un posto
  solo**, così chi scrive il prossimo banco trova la domanda giusta già fatta.
  Fatto: `larghezzaCarta` e `regolaPage` sono in `giro.mjs`.
  ✅ **E Genesi è entrata l'09/08: adesso la misura sta DENTRO il banco**, non
  più in una prova a mano che alla sessione dopo non esiste.
  `genesi-foglio-in-cava.mjs` leggeva il documento come **testo** e non ne
  guardava mai le dimensioni; adesso il foglio viene **reso** in una pagina alla
  larghezza della carta e misurato, nodi di testo compresi (la scatola anonima
  che `querySelectorAll` non vede). Esito: **ci sta** — 718 px.
  ⚠️ **Il denominatore è dichiarato, e qui è più debole che in Scudo**: il
  documento di Genesi **non porta nessuna regola `@page`** — cercata, non c'è —
  quindi la carta non si può leggere dal foglio, e si ripiega su A4 coi margini
  del browser (190 mm = 718 px). Il ripiego lo **stampa il banco** a ogni
  passata invece di nasconderlo: se un giorno Genesi dichiarasse la sua carta,
  quella misura andrebbe letta da lì.
  Con questo, **tutte e otto** le superfici che stampano hanno una misura di
  larghezza dentro un banco.
- [x] ✅ **`fuori-schermo` fa la domanda A anche a 320 px — e il numero che
  mancava adesso c'è: ZERO allarmi nuovi.** Per settimane le due domande hanno
  guardato larghezze diverse (A a 390 e 360, B anche a 320), e il costo era già
  stato pagato: il **traboccamento del corpo del core a 320 px** — 333 px in
  320, l'indirizzo del CDN in una parola sola da 60 caratteri — l'ha trovato
  una misura **a mano**, non questo banco, che a 320 la domanda A non la
  faceva. La riga precedente diceva «il numero non c'è ancora, ed è dichiarato
  mancante invece che inventato» perché il server di prova non si era alzato.
  Misurato l'09/08 con `--larghezze=320` su tutte e quattordici le superfici,
  contro un server **mio** e verificato tale: **12 schermate pulite, 0 fuori
  dallo schermo**, 4.393 elementi guardati; i 10 segnalati sono **tutti** della
  domanda B e stanno già nell'arretrato dichiarato (2 del core — «Giuseppe F.»
  nel `.logo-sm` e il «3» della campanella — e 8 di Sentinella).
  ⛔ È la regola dell'ampiezza applicata nel verso giusto: **il costo della
  stretta si misura, non si teme.** Il timore era ragionevole e la misura l'ha
  smentito in una passata.
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
- [x] ✅ **Un file che esce con un nome FISSO si sovrascrive, e oggi e' costato
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
  ✅ **I due candidati sono CHIUSI, e lo erano già** (verificato il 09/08
  leggendo le due righe, non a memoria):
  · `apps/genesi/genesi.html:2709` →
    `'Volata_' + (out.volata.numero || 1) + '_' + out.volata.data + '.volata.json'`
    — due volate diverse escono con nomi diversi;
  · `apps/genesi/genesi.html:3455` → `'genesi_composito_' + _pezzo + '.csv'`,
    dove `_pezzo` è **nome dell'onda + numero di fori + ritardo**, col commento
    che lo dice: *«due confronti diversi non si sovrascrivono più»*.
  ⚠️ **Quinta riga in una notte che proponeva un lavoro già fatto** (le altre:
  la geometria dei gradienti, la scala `--nav-scala`, «Campo è il lavoro dopo»,
  e «Scudo resta da aprire» — quest'ultima scritta da me poche ore prima).
  Cinque in un giorno non è distrazione: è il **costo strutturale** di lavorare
  a cantieri paralleli, dove chi chiude non è chi aveva scritto la riga. La
  direttiva 7 è la sola cura, e va applicata **nello stesso commit** che chiude
  il lavoro, non «poi».
- [x] ✅ **Il banco della barra guarda tutti e tre i temi, e i tre difetti che
  questa riga elencava sono chiusi** — verificato l'09/08 **rilanciando le tre
  passate a mano**, non guardando il codice: lo strumento c'era già
  (`--tema=` in `barra-etichette.mjs`, registrato in `tutti.mjs` alle righe
  434-436), ma la riga elencava **difetti misurati**, e uno strumento che
  esiste non dice niente su di loro.
  | tema | etichette | fuori posto | tagliate DENTRO il bottone |
  |---|---|---|---|
  | scuro | 164 su 24 barre (14 superfici) | **0** | **0** |
  | sole | 164 su 24 barre | **0** | **0** |
  | chiaro | 164 su 24 barre | **0** | **0** |
  Quindi: **Flotta a 320 px nel sole** (dava 16 px) e **Terra a 320 px** (11 px)
  passano; e **Conti non risponde più «ok» senza provare niente** — la seconda
  domanda («la parola sta nel suo bottone?») è quella che una barra con
  `overflow:hidden` non poteva sentirsi fare, e adesso viene fatta e conta
  zero. Il denominatore è dichiarato: **8 superfici su 14 NON misurate** nei
  due temi chiari, perché non caricano `dw-tema.js` — un tema che non si
  accende non è un tema che passa.
  ⚠️ **E per misurarlo ho dovuto alzare un server mio.** Il banco legge la
  porta **per posizione** (`process.argv[2]`), quindi `--tema=sole` come primo
  argomento diventa la porta e si va su `http://127.0.0.1:NaN/`; e non alza
  nessun server, mentre la sua porta di casa (8823) era tenuta dal giro in
  corso, che serve **un commit più vecchio**. È la trappola silenziosa scritta
  in `CLAUDE.md`: un banco che trova la porta occupata e la riusa misura la
  copia di qualcun altro. Ho servito la mia cartella su 8990 e **verificato che
  fosse la mia** prima di credere a un numero.
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

- [x] ✅ **«Responsabile da assegnare» detto a una lettura fallita** (`48450a2`).
  Difetto **vero nel prodotto**, ed è il filo della settimana nella sua forma
  più pura: un'etichetta tranquilla dove non è stato misurato niente.
  In Sentinella il responsabile di un'azione correttiva si ricava cercando il
  suo id nell'elenco dei lavoratori che arriva **da Scudo**, e il ponte diceva
  `read("lavoratori").catch(() => [])`: una lettura fallita — rete, permessi,
  l'altra app non raggiungibile — diventava **«non c'è nessuno»**. Misurati i
  tre stati affiancati, due erano **indistinguibili**:
  · Scudo letto e il responsabile c'è → «responsabile Mario Rossi»
  · Scudo letto e davvero non c'è nessuno → «responsabile da assegnare»
  · **Scudo NON letto** → «responsabile da assegnare» ⛔ **falso**: quell'azione
    un responsabile ce l'ha, e chi legge la riga può riassegnarla a un altro.
  Adesso il ponte dichiara la bandiera `leggibile` e `descriviResponsabile` la
  **legge** (regola 20: una non-misurabilità che non legge nessuno non protegge
  niente): la frase diventa «responsabile assegnato, il **nome** non si legge da
  Scudo» — e si stampa in **neretto**, perché è un non-so, non un fatto. Quarto
  stato che prima non esisteva: id presente ed elenco leggibile ma persona non
  trovata → «non più in anagrafica», che non è «da assegnare» perché qualcuno
  era stato scelto. E la modale non toglie più il campo in silenzio: dice
  perché non si può assegnare da qui.
  Prove: run-kpi **1908 → 1910**, controprova che morde (rimesso il vecchio
  comportamento: «atteso false, ottenuto true»), file ripristinato da una copia
  `cp`. Scatti **guardati** sui due stati, con la schermata visibile dichiarata
  (`page-dash`): lo stato B in dimostrazione **non si raggiunge premendo i
  bottoni** — non si sceglie un nome da un elenco che non si legge — quindi il
  record lo costruisce la pagina e la sonda gli aggiunge l'id, che è esattamente
  ciò che in produzione lascia un'azione aperta quando Scudo era leggibile e
  adesso non lo è. Limite dichiarato: in dimostrazione Scudo non si interroga
  affatto, quindi la frase che si vede sempre è quella del **non leggibile**.

- [x] ✅ **In Scudo «da assegnare» copriva anche chi non è più in anagrafica**
  (`079ebe3`). Nata da una riga di ricerca che era **falsa** — diceva che
  un'azione senza responsabile «appare in lista senza che nessuno sappia che è
  un buco», e invece Scudo scriveva già «responsabile da assegnare» in due
  punti. Aprendola per verificarla è saltato fuori il difetto vero, che è
  **l'opposto**: non l'azione *senza* responsabile, ma quella **con** un
  responsabile che dall'anagrafica è stato tolto. Percorso ordinario, misurato
  premendo i bottoni: si rimuove un lavoratore, le sue azioni restano con l'id
  dentro, e da quel momento dicono «da assegnare» — cioè *nessuno se ne
  occupa*, di un'azione che un responsabile ce l'ha.
  **Quattro copie della stessa domanda**, nessuna delle quali conosceva quello
  stato: le urgenze del Quadro, l'elenco delle azioni, le due righe delle
  ispezioni (dove il responsabile **spariva** dalla frase invece di dichiararsi),
  lo scadenzario — e la **quinta nel CSV**, che è il foglio che va all'ispettore.
  La decisione adesso è una sola e sta in `shared/dw-ponti.js`
  (`statoResponsabile`, cinque stati); la **frase** resta di ogni app, perché
  Sentinella nomina Scudo — lo legge da fuori — e Scudo no.
  ⛔ E la **causa** è dichiarata prima: la finestra che chiede conferma della
  rimozione elencava le scadenze e taceva sulle azioni e ispezioni di cui quella
  persona è responsabile. Adesso le conta e dice che restano senza responsabile
  in anagrafica — è l'ultimo momento in cui si possono riassegnare.
  Verifiche: `run-kpi` **1910 → 1912**, controprova che morde in **tre** prove;
  scatto **guardato** con le due frasi diverse **nella stessa schermata** («da
  assegnare» su a3, «non più in anagrafica» su a1 e a4), e il **CSV scaricato e
  aperto** che dice le stesse parole dello schermo. ⚠️ Un difetto è stato
  trovato **nel mio stesso testo** dallo scatto e non dalla rilettura: «1
  ispezione non ancora **chiuse**».

- [x] ✅ **L'arretrato dei sei documenti torna a ZERO — 11 commit e 2 ⛔ in
  un'unità sola** (`57b6ca3`). È la direttiva 7 che funziona come deve: i due
  ⛔ erano lì **per due modifiche mie di poche ore prima**, e chi chiude un'unità
  aggiorna il documento che quell'unità tocca — se no il conto sale da solo e
  chi lo legge non sa più se guarda un ritardo o rumore di fondo.
  Riverificato **per davvero**, non incollando una data (la suite la
  rifiuterebbe, ma la suite guarda le date e non le righe — la lettura è mia):
  · **Scudo** `924c442`→`079ebe3`: 1 commit, morde, **una** funzione nuova
    (`etichettaResponsabile`). I sei verdetti «confermato assente» reggono, con
    le ricerche rifatte — zero `xlsx`, `excel`, `jspdf`, `notific`,
    `versionamento`, `offline` sui file di oggi **e** sulle 93 righe aggiunte.
    E il conto degli export, la riga già scaduta **due volte**, resta **cinque**
    — ricontato aprendo i nomi dei file, non a memoria: quest'unità ha cambiato
    *che cosa c'è dentro* una colonna, non *quanti file escono*.
  · **Sentinella** `db04ac5`→`079ebe3`: 9 commit, uno morde, **una** funzione
    (`descriviResponsabile`). Nessuna delle tredici confermate la riguarda, e
    non a occhio: quelle parlano di **condizioni della misura**, di **come esce
    il documento** e di **quanto ci si mette ad accorgersene**. Una funzione che
    sceglie una frase non costruisce niente di tutto ciò.
  · **Terra** `8583a0b`→`57c78cf`: 4 commit, **nessuno morde**, +18 righe — un
    inchiostro alzato per il contrasto, un `m³` avvolto nella sua `<span>`, il
    passaggio ad `applicaPercorsi`. Zero funzioni nuove, zero verdetti mossi:
    era **rumore**, e valeva la pena scriverlo perché smettesse di sembrare
    ritardo.
  Misura: **arretrato 11 → 0 commit, 2 ⛔ → 0**, tutti e sei ✓.

- [x] ✅ **Un giro lungo non diceva quanto era vecchio, e stavo per riaprire
  cinque difetti chiusi** (`237fd67`). Successo **di persona**, ed è il modo
  in cui questa riga vale più della correzione. Il giro del browser lanciato
  stamattina — cinque ore e mezza — dichiarava **cinque contrasti sotto soglia**
  fra core e Flotta: `.login-msg` 4,10 · `.sync-badge.offline` 3,75 ·
  `.btn-danger` 3,89 · `.photo-del` 4,01 · `.chk-cr` 3,90. Tutti **veri**, e
  tutti **già chiusi** da `5d57cbc` — **trentotto minuti dopo** il commit che
  quel giro attesta, cioè quasi cinque ore prima che io leggessi il registro.
  Ero a un passo dall'aprire un cantiere su difetti che non esistono.
  ⛔ Il dato c'era già e non veniva sottratto: `tutti.mjs` scrive nella prima
  riga il commit su cui gira. Adesso `leggi-giro.mjs` apre con una **sezione 0**
  — prima ancora delle righe «non ho guardato» — che dice di quanti commit il
  branch è andato avanti **e quanti di quelli toccano le superfici misurate**
  (core, app, `shared/`). Su questo registro stampa: *«attesta `c3888fe`, il
  branch è avanti di 55 commit, di cui **20** toccano le superfici misurate»*.
  Un pomeriggio di soli documenti non fa più sembrare vecchio un giro fresco.
  Controprova nei **tre** versi che contano — vecchio, fresco (`HEAD` → 0 e 0),
  e **non lo so** quando il commit non è nella storia, invece di uno zero
  tranquillizzante. Provata contro il difetto rimesso: fallisce con «*un commit
  che non esiste dovrebbe dare «non lo so», non un numero*».
  ⚠️ E la controprova è stata **registrata in `npm test`**: una guardia che non
  gira è la stessa cosa di una guardia che non c'è, e questo file è pieno di
  quella lezione.

- [x] ✅ **La dichiarazione di controprova era un'etichetta su una riga, e non
  bastava** (`23712e6`). Trovato **leggendo il registro con lo strumento appena
  scritto**, che è il modo in cui doveva andare. Il runner dichiara «qui sotto
  il rosso è quello VOLUTO» subito dopo la **propria** intestazione — ma molti
  banchi stampano una **propria** intestazione a otto uguali, e da lì in giù la
  dichiarazione non copre più niente: i KO voluti tornano a leggersi come
  difetti veri. Successo davvero: `struttura di Genesi · controprova`
  dichiarava, poi il banco apriva «Genesi: la struttura è quella del core? ·
  controprova» e i suoi **quattordici** KO voluti finivano fra quelli veri.
  È la **terza** volta che questa famiglia morde, e la cura del 07/08 valeva
  solo per i banchi che non si intestano da sé.
  Adesso `tutti.mjs` **chiude** la dichiarazione e il lettore la legge come un
  **intervallo**. L'ereditarietà finisce alla chiusura — ereditare per sempre
  dipingerebbe di «voluto» tutto il resto del giro, che è il difetto opposto e
  peggiore: provato nei due versi.
- [x] ✅ **E l'asserzione sull'età era vera in casa e falsa in CI** (`23712e6`).
  La CI è caduta sul commit precedente, e **aveva ragione**: pretendevo che
  `HEAD~5` desse esattamente **5**, e in CI ha dato **1407**. Causa: GitHub non
  prova il branch, prova il **merge** del branch col ramo di destinazione, e da
  un commit di fusione `HEAD~5..HEAD` raccoglie anche tutto il secondo genitore.
  **Riprodotto in casa** su un commit di fusione vero (`5a4c5b6`): **126**
  invece di 5 — cioè la causa è misurata, non dedotta. Adesso si prova una
  proprietà vera dappertutto e non tautologica: il conto **cresce** andando
  indietro, e non è mai zero per un commit che non è HEAD; e il caso «storia
  corta o clone superficiale» si **dichiara** invece di sparire.
  ⚠️ È la regola «verde in casa, rosso in CI» in una veste nuova: le altre due
  volte erano gli **scrittori** diversi (un trigger assente in casa) e
  l'**ordine** di due eventi; questa è la **forma della storia di git**. La
  domanda da farsi resta la stessa: *sotto un ambiente diverso, che forma ha
  lo stato su cui sto scrivendo un'asserzione?*

- [x] ✅ **Tre iniezioni di controprova erano SCADUTE: puntavano a codice che
  non esiste più** (`6b9d419`). Famiglia nuova, e il denominatore è misurato:
  **174 iniezioni in 20 banchi, 3 che non trovavano più il loro pezzo → 0**.
  Una controprova con l'iniezione scaduta non fa rumore: il file resta **sano**,
  il banco «non distingue», e la riga che lo dice — «*1 non hanno trovato il
  loro pezzo: la controprova vale meno di quello che sembra*» — sta in fondo a
  un registro di cinquemila righe. È la **terza delle cinque cause** di «non
  distingue», quella in cui non si tocca né la prova né il codice.
  E la causa di tutte e tre è la stessa, ed è **buona**: il prodotto è
  migliorato e l'iniezione è rimasta indietro.
  · `genesi-numeri-tranquilli`: cercava `const _prov = (_st.fonte==='sito' && …)`
    scritto a mano nella schermata; il 03/08 quella decisione è passata a
    `provenienzaPpv` perché il **foglio stampabile** non ce l'aveva. Ora 7/7
    iniezioni, **18** prove cadute, uscita 0 (prima 6/7 e uscita 1).
  · `core-documenti-che-escono`: cercava la `m` **nuda**, e le unità sono state
    avvolte in `<span class="u">` dal cantiere delle unità sotto le maiuscole.
    Ora 15/15, **29** cadute, uscita 0; passata sana **67/0**.
  · `genesi-foglio-in-cava`: cercava la riga della base PPV scritta per esteso,
    diventata la funzione `_ppvBaseHtml` perché la usano in due. Ora 6/6,
    **12** cadute, uscita 0; passata sana **35/35**.
  ⚠️ **E il primo righello sbagliava**, con il segno di sempre — un difetto
  identico in tre righe dello stesso banco: leggeva ogni tabella come
  `[cerca, sostituisci]` e `scudo-disegni` usa `[file, cerca, sostituisci]`,
  quindi il **nome del file** finiva nel posto della stringa. Sei allarmi
  diventano **tre veri** appena il righello impara la seconda forma.
  ⚠️ E un secondo censimento — «quali banchi non guardano il modo controprova
  nella riga di uscita» — è stato **provato e scartato**: dava 54 su 66, ma
  molti invertono il verdetto **prima**, dentro `dice()`, e la riga d'uscita non
  deve nominarlo. Misurava la forma, non la sostanza. La lista vera la dà il
  giro, che sta girando.
  ⚠️ Il crollo di `genesi-foglio-in-cava` visto durante la verifica era **della
  mia sonda**: tre banchi di fila sulla **stessa porta**, e il server di prima
  non l'aveva ancora liberata. Da solo: 35/35.

- [x] ✅ **Un'iniezione scaduta adesso la prende una suite, in tre secondi
  invece che in sei ore** (`e26ff87`). Le tre di prima le ha trovate il giro
  del browser — cioè un registro da cinquemila righe letto a mano. Adesso c'è
  `apps/deepwork-id/tests/iniezioni-fresche.mjs`, che **non apre un browser e
  non alza un server**: guarda le stringhe e i file, e gira in `npm test`, cioè
  **prima** del commit. Misura dichiarata: **174 iniezioni sul bersaglio su
  174**, 20 banchi letti, su 32 file di prodotto — e l'elenco dei file è
  **derivato dal disco**, così un'app nuova entra da sola.
  Il banco la cui tabella non si legge da fermi (`scudo-documenti`, la costruisce
  da variabili) è **dichiarato con la ragione**, e l'elenco è **sorvegliato**:
  se diventasse leggibile, o se ne comparisse un altro, il controllo cade — è
  la disciplina di `sonda-vuoto`, un'eccezione che non serve più è un'eccezione
  che nasconde. Controprova: una stringa inventata non deve essere trovata (se
  no il confronto è rotto), e col difetto rimesso il controllo **nomina** il
  banco colpevole.
- [x] ✅ **E QUELL'ECCEZIONE ERA ESATTAMENTE IL POSTO DOVE IL DIFETTO VIVEVA.**
  L'unico banco tenuto fuori — `scudo-documenti`, «la tabella si costruisce da
  variabili» — è stato aperto l'08/08 e dentro c'erano **sei iniezioni scadute
  su ventisei**. Il banco stampava «✔ CONTROPROVA OK», perché le venti rimaste
  bastavano a farlo cadere: il rosso c'era, sembrava tutto a posto, e nessuno
  aveva letto la riga «20/26 difetti rimessi». È la forma peggiore — un
  controllo che passa avendo guardato meno di quello che crede — e la ragione
  è la solita e **buona**: il codice si è mosso perché è migliorato (quattro
  export saliti nel modulo accanto alle funzioni che decidono le stesse cose a
  schermo, un `LAV.find(…)` a mano diventato `etichettaResponsabile`, e le
  parentesi dei parametri delle funzioni freccia).
  Ri-ancorate tutte e sei: **26/26 rimesse, 41 prove cadute** (erano 20/26 e 34).
  E l'eccezione è **tolta, non dichiarata meglio**: le variabili che la tabella
  usa sono costanti di stringa del banco stesso, quindi si leggono e si passano
  all'`eval` come preambolo. Adesso **212 iniezioni su 212, 23 banchi, ZERO
  eccezioni** (erano 174 in 20 con una).
  ⚠️ **E il righello ha rifatto l'errore che sta già scritto qui sopra**, in
  senso contrario: leggeva il terzo elemento come `[file, cerca, sostituisci]`
  (la forma di `scudo-disegni`) mentre `scudo-documenti` scrive
  `[cerca, sostituisci, file]` — sei falsi allarmi, tutti nello stesso banco,
  che è il segno con cui si riconosce di guardare il righello. Adesso non
  indovina la posizione: **chiede ai dati** qual è il percorso di prodotto vero,
  e le due convenzioni si leggono uguali.
  ⚠️ E l'unità è nata da un errore mio, che vale più della correzione: cercando
  i punti d'uscita di Scudo avevo grepato `__usciti` in quel banco, trovato
  **zero**, e concluso «Scudo non ha nessun banco che apra un CSV». Il gancio si
  chiama `__scaricati` e vive 380 righe più in giù. Avevo già scritto **trecento
  righe** di banco nuovo con quella frase falsa nell'intestazione, e l'ho
  buttato: quattro dei cinque punti d'uscita erano già aperti. **Un censimento
  che cerca UN nome risponde «non c'è» con la stessa faccia con cui direbbe la
  verità.**
- [x] ✅ **`scudo_azioni_copia.csv` era l'ultimo punto d'uscita che nessun banco
  apriva — adesso Scudo è 5 su 5.** La copia di sicurezza non è il prospetto: il
  prospetto porta lo stato CALCOLATO e la frase dell'origine (che rientrando
  verrebbero ricalcolate sbagliate), la copia i campi CRUDI e il collegamento
  evento → azione, che è quello che un organo di vigilanza cerca. Quattro prove
  nuove (esce, non è lo stesso file del prospetto, non porta il semaforo, non
  perde azioni per strada) e la loro iniezione: la copia che perde un'azione **in
  silenzio**. Banco **80 → 86**, 0 KO.
  ⚠️ **La generalizzazione della regola delle frasi è stata provata e SCARTATA
  di nuovo, e stavolta la decisione era già scritta.** Il banco nuovo accusava
  «Esportati 7 lavoratori e 26 scadenze, di cui 2 senza nessuna scadenza» contro
  28 righe (= 26 + 2), e stavo per allargare `giro.mjs` a una **somma parziale
  qualunque**. Quella strada era già stata misurata e respinta, con la ragione
  scritta accanto all'eccezione: con `[6,3,1]` anche 9 è una somma parziale, e
  l'iniezione di Flotta smetterebbe di essere vista. **Una regola indebolita per
  far passare un caso vale meno di un caso dichiarato** — e una decisione presa
  con la misura va cercata prima di rifarla.
- [x] ✅ **E l'ULTIMA superficie della terza gamba era il core, con un CSV solo
  e la frase che contava un'altra cosa.** Il core ha **un** export di file
  (`deepwork_fori_fronte_*.csv`): il file lo scrive `foriDalModello`, che
  **filtra** (`m && m.position`), e il messaggio contava
  `_recon.markers.length`. Un segno senza posizione entrava nel numero
  annunciato e non nel file — la forma esatta di questa famiglia. Corretto
  **contando una volta sola**: l'array si calcola, e la sua lunghezza va sia
  nel file sia nella frase.
  ⚠️ **Onestà sulla gravità**: oggi i segni li crea un punto solo, che scrive
  sempre `position`, quindi la divergenza è **latente** — vive per un modello
  ricaricato, un record vecchio, una scrittura parziale. Resta corretta perché
  il difetto gemello in Flotta era latente allo stesso modo.
  ⚠️ **E quell'export non lo apre nessun banco per una ragione MISURATA, non
  per svista**: `_recon` è una variabile del modulo (`let _recon=null`), quindi
  non si inietta da fuori, e senza rete il 3D non parte affatto. A sorvegliarlo
  è la **regola 31** di `run-stile`, che è statica: la riga della frase non può
  contenere `markers.length`. Controprova nei due versi, e provata a fallire
  rimettendo il difetto nel core (poi ripristinato **da copia**, non con
  `git checkout`).
  ⚠️ Il righello ha sbagliato una volta, col segno di sempre: l'ancora era una
  regex che provava a scavalcare le parentesi (`[^)]*` si ferma alla prima `)`
  di `plurale(...)`), quindi non trovava la frase **né nel core né nella sua
  controprova** — cioè la regola accusava sé stessa. Adesso l'ancora è la riga.
- [x] ✅ **I «60 import inerti» NON diventano una regola, e adesso la decisione è
  scritta coi numeri.** `nomi-liberi` misurava la quinta forma (importati e mai
  usati) e in **due punti** diceva «MISURA, **non ancora** regola» — cioè un
  invito, e in questa casa un invito lasciato in giro viene raccolto. La riga
  prometteva pure la strada: «diventa regola quando le righe inerti sono state
  tolte dalle pagine».
  Guardati **uno per uno** l'08/08, la conclusione è l'opposta: **un import
  inerte non è un difetto, è quasi sempre il segno che una decisione è salita
  dove doveva.**
  · `campo: csvCell` — Campo non compone più nessuna cella a mano: i suoi
    quattro file li costruiscono `csvAppello`, `csvStorico`, `csvAttivita` e
    `csvSquadre` **nel modulo**. L'import è il residuo di un refactor giusto;
  · `sentinella: CSV_VOLATE_INTESTAZIONE` / `CSV_RICETTORI_INTESTAZIONE` — le
    usa il modulo dentro `csvRegistroVolate` e `csvRicettori`: la pagina
    **delega invece di ricopiare**;
  · `flotta: AVVISO_DECIMALE` / `AVVISO_MIGLIAIA` — Flotta li **mostra già**,
    attraverso `messaggioNumero`, che se li porta dentro.
  Toglierli vorrebbe dire toccare **dieci pagine per zero difetti misurati**:
  è la stessa contabilità con cui è stata scartata la scala `--nav-scala`.
  ⚠️ **E la versione stretta è stata provata e scartata anche lei, col conto**:
  «la pagina importa una costante di testo E scrive lo stesso testo a mano?» dà
  **2 allarmi, tutti e due falsi** — le due righe di Flotta che scrivono
  l'avviso sulle migliaia **con l'esempio del proprio campo** («6000, non
  6.000» invece del generico «1250, non 1.250»). Non è una copia debole: è una
  **specializzazione**, ed è migliore della costante.
  La misura **resta**, perché serve: un numero che salta di colpo dice che
  qualcuno ha spostato del codice, ed è il momento di guardare.
- [x] ✅ **E l'ultimo KO di Conti era il banco che pinnava il testo di ieri**
  (`e26ff87`). `conti-frasi` chiedeva «**Esportati** 1 prodotto (CSV)» e la
  pagina scrive «**Esportato** 1 prodotto», che in italiano è la forma giusta:
  il 07/08 `plurale(...)` ha imparato anche il **participio**. Cioè il banco
  contava come difetto una **correzione**. Corretto rendendo l'asserzione **più
  giusta, non più permissiva** — si pretende il participio singolare **e** che
  il plurale non compaia, invece di allargare a `Esportat[oi]`.

- [x] ✅ **Flotta: il CSV che va al commercialista scriveva una data che non
  esiste, e lo schermo diceva «—»** (`a21f50a`). Trovato applicando la domanda
  di `CLAUDE.md` — *dove questa app compone qualcosa che ESCE, chi decide i suoi
  numeri?* — e la risposta era **no**: la pagina decideva «ha una data» dalla
  **forma** (`/^\d{4}-\d{2}-\d{2}$/`) in **otto punti**, mentre il suo stesso
  modulo usa `dataISOEsiste` **undici** volte. La regola sta in `shared/` da mesi.
  Misurato iniettando una voce di costo datata **2026-02-30** nella risposta
  HTTP (mai sul file: la dimostrazione non può contenerla, `run-demo` vieta di
  proposito una data corrotta), e servendo come controprova **la versione vera
  di `HEAD`**, non una mia ricostruzione:
  | | prima (`HEAD`) | adesso |
  |---|---|---|
  | schermo | «—» | «senza data» |
  | **CSV** | `2026-02-30` | cella **vuota** |
  | messaggio | «di cui **1** senza data» | «di cui **2**» |
  ⛔ Cioè lo **schermo era già onesto** — lo salvava `dataIt`, che una data
  impossibile la rifiuta — e a mentire era **il file**, che è esattamente il
  posto dove nessuna prova guarda. E il conto in fondo al messaggio contava
  quella voce fra quelle **con** la data.
  Gli otto punti erano la stessa decisione otto volte: quali costi di
  carburante entrano nel mese, come si scrive la data a schermo, se si programma
  la manutenzione successiva, il precompilato e la guardia della modifica, i
  giorni di distanza (dove `Date.parse` faceva **scorrere** il 30/02 al 2 marzo,
  cioè dava un numero **sbagliato** invece che sconosciuto), la cella del CSV e
  il conto dei «senza data».
  ⚠️ **E la prima controprova era disonesta senza volerlo**: rimetteva la regola
  della forma in **due** punti su otto, e faceva sembrare che lo schermo dicesse
  già «senza data». Una ricostruzione a metà non è lo stato di prima — è un
  terzo stato che non è mai esistito. Con `git show HEAD:` il confronto è quello
  vero.

- [x] ✅ **La stessa domanda alle altre cinque app: venti punti in sei, adesso
  zero — e una regola che li tiene fuori** (`4a5175a`). Dopo Flotta (8) sono
  stati letti **uno per uno** gli altri dodici: Scudo **4**, Genesi **3**,
  Sentinella **2**, Terra **2**, Campo **1**. Tutti la stessa decisione, e i
  posti dicono perché conta: sei sono **guardie sull'ingresso** («Serve una data
  valida», «Serve la data prevista della volata») — cioè quelle che decidono se
  una data impossibile **entra in archivio** — e uno data il **file che
  Sentinella importa** da Genesi.
  ⛔ E il caso più eloquente: il **modulo** di Genesi questa regola l'aveva
  imparata il **03/08**, e il commento in cima a `genesi-data.js` lo racconta
  per esteso — mentre la **pagina** teneva ancora la copia più debole in tre
  punti. La forma peggiore del difetto non è l'invenzione, è la copia più
  debole di una regola che sta già in casa.
  **Regola 30** di `run-stile`, con la controprova nei due versi (la vede
  rimessa in una pagina vera; non accusa un commento). ⚠️ Il costo della stretta
  è stato misurato **prima** di scriverla: dopo la correzione le occorrenze sono
  **zero su otto superfici**, quindi la regola nasce senza nessun falso allarme
  da dichiarare. Stile **314 → 316**.

- [x] ✅ **Settantuno copie di giri morti, 1,3 GB — e chi muore non può pulire**
  (`4a5175a`). Trovata **fermando** un giro: `git worktree list` ne elencava
  **71**. In fondo a `tutti.mjs` c'è scritto che la copia si toglie «SEMPRE,
  anche se il giro è caduto», e quella riga vale per un giro che **arriva** in
  fondo: un `SIGKILL` — o una sessione che finisce — non esegue nessun `finally`.
  ⛔ E su questa macchina il disco è un'**allocazione fissa**: quando finisce, le
  **scritture** falliscono mentre `df` mostra spazio libero. Cioè il costo non è
  ordine, è un giro che un giorno muore per un motivo che non c'entra niente.
  L'unico momento in cui qualcuno può pulire è **l'avvio del giro successivo**,
  e adesso è lì. Si toglie solo ciò che ha il nome del giro (`giro-copia-<pid>`)
  **e il cui pid non è più vivo**: una copia di un giro che sta girando adesso
  non si tocca, se no sarebbe la stessa famiglia del server riusato — un giro
  che sabota l'altro. Controprova nei due versi: con una copia finta dal pid
  morto e una dal pid vivo, ne toglie **una** e lascia l'altra.
  ⚠️ **E la regola violata era di casa**: «il giro completo si lancia una volta
  per blocco, alla fine, mai mentre si lavora». Lanciandolo a metà ho fatto
  durare ogni giro `node` **venti minuti invece di due**, e l'ho fermato per
  questo — trovando le 71 copie solo perché mi sono fermato a guardare.

- [x] ✅ **E il server del giro morto teneva la porta, servendo una cartella
  cancellata** (`85978b2`). Seconda metà, misurata **subito dopo**: tolte le 71
  copie, il giro nuovo si è **rifiutato di partire** — «non riesco ad alzare un
  server statico sulla porta 8823». Il colpevole era il `python3 -m http.server`
  del giro ucciso, ancora vivo, con `cwd = /home/user/giro-copia-16814
  **(deleted)**`: l'orfano che `CLAUDE.md` descrive da giorni, quello che
  risponde con **404 su tutto**.
  ⚠️ E il rifiuto di partire è la guardia che **funziona**: meglio fermarsi che
  misurare la copia di un altro. Ma nessuno toglieva l'orfano, quindi il giro
  restava impossibile da lanciare finché non ci si metteva a mano.
  Adesso lo toglie il giro successivo, con un criterio che non può sbagliare
  bersaglio: **solo la nostra porta**, e solo se la cartella servita **non
  esiste più**. Un giro vivo ha una cwd che esiste e non viene toccato.
  Controprova in `tests/browser/server-orfani.mjs`, **collegata a `npm test`**:
  alza due server, cancella la cartella di uno, e pretende che ne tolga **uno**
  e lasci **l'altro** — se uccidesse il sano sarebbe peggio del difetto.
  ⚠️ **E le due sonde in shell che l'hanno preceduta erano sbagliate tutt'e
  due**, con lo stesso segno di sempre: un `cd` dentro una catena messa in
  background non vale per il processo che parte, e `pgrep` conta **sé stesso**.
  Riscritta in node, dove i pid li dà chi li genera. È la regola di casa — *non
  calcolare a mano ciò che il programma sa già dire* — pagata due volte in dieci
  minuti.

- [x] ✅ **Campo: la stessa domanda, e la risposta è «niente da correggere»**
  (misura, nessun commit sul prodotto). Applicata la domanda di `CLAUDE.md` —
  *dove questa app compone qualcosa che ESCE, chi decide i suoi numeri?* — ai
  **cinque** file che Campo esporta: `campo_appello`, `campo_storico`,
  `campo_attivita`, `campo_squadre`, `campo_consuntivo_carico`. Tutti e cinque
  chiamano il **modulo** (`csvAppello`, `csvStorico`, `csvAttivita`,
  `csvSquadre`, `pianoConsuntivoCsv`), e accanto all'appello c'è il commento che
  racconta quando non era così: *«finché lo componeva questa riga, la colonna
  `ore_lavorate` usciva nuda anche quando `orariPresenza` aveva già dichiarato
  di non fidarsi degli orari»*.
  ⚠️ **Scritto perché un risultato negativo misurato vale più di un censimento
  non fatto**: senza questa riga, il prossimo che legge la regola in `CLAUDE.md`
  rifà lo stesso giro su Campo per scoprire la stessa cosa. Il denominatore è
  cinque su cinque.

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
- Stato misurato all'**08/08 sera** (lanciando le suite, non a memoria):
  **2.366 prove** che girano senza rete. La frase va letta stretta: è la somma
  delle **sette** suite che contano asserzioni (`run-kpi` 1921, `run-stile` 318,
  `run-helpers` 71, `run-pointcloud` 32, `run-manifest` 9, `run-demo` 8,
  `bootstrap-rivendicazioni` 7), non tutto ciò che gira nel giro `node` — che di
  asserzioni ne esegue **2.663** e di comandi ne ha **32**.
  ⚠️ *Fino a stasera questa riga contava **sei** suite e i tre documenti
  sorvegliati ne contavano sette: due convenzioni per lo stesso numero, che è
  il modo più facile di far sembrare sbagliato un conto giusto. Adesso è una
  sola.*
  Copertura **713/713** e nessuna funzione scoperta; **157 esecuzioni** che
  aprono le pagine in un browser vero, da **70** file di banco distinti (contati
  dalla tabella `BANCHI` di `tutti.mjs`, non a occhio dalla cartella, che di
  `.mjs` ne ha 82 perché contiene anche gli aiuti — `giro.mjs`, `impronta.mjs`,
  il runner stesso).
  *(Al 08/08 pomeriggio 2.326, 703/703 e 153; al 07/08 sera 2.307; al 07/08
  notte 2.193, 662/662 e 120; al 03/08 pomeriggio 2.092, 649/649 e 84; al 02/08
  1.838, 591/591 e 49.)*
  ⚠️ **Questi numeri non si scrivono a mente** — ma attenzione al
  denominatore: `numeri-nei-documenti.mjs` sorveglia `docs/DEVELOPMENT.md`,
  `docs/STATO_PRODOTTO.md` e `docs/DECISIONI_WEEKEND.md`, **non questo file**.
  Ed è per questo che la riga qui sopra era rimasta a «120 banchi» mentre ne
  erano già 147: qui il controllo non arriva, e l'aggiornamento è a mano. Chi
  la legge lo sappia.

## 08/08 sera — «chi decide i numeri di ciò che ESCE?»

Filone della settimana (*i numeri che mentono con la faccia tranquilla*),
portato su tutte le app con la domanda di `CLAUDE.md`. **Otto difetti veri in
un pomeriggio, tutti della stessa famiglia**: il documento che esce dice una
cosa più tranquilla di quella che lo schermo mostra.

- [x] **core** — i fori del modello 3D avevano DUE numerazioni e si chiamavano
      tutt'e due «foro N» (4 righe su 4 indicavano un foro diverso nei due
      documenti). Decisione unica in `foriDalModello` + regola 31 di `run-stile`.
- [x] **Flotta 9/9** — «pianificata» su un ordine fermo ad aspettare un
      ricambio (a schermo ROSSO); «tutto a posto» su un giro con anomalie
      dichiarate; lo ZERO SOMMABILE sul costo mai scritto; due incertezze
      dichiarate dal modulo e mai lette dalla lista della spesa. Banco nuovo,
      nove documenti su nove aperti.
- [x] **Conti 3/12** — il residuo che ignorava le NOTE DI CREDITO nel file che
      va in banca **e** nella riga della lista (la schermata si smentiva da
      sola in tre punti); un prodotto senza prezzo che usciva **GRATIS** nel
      listino che si manda al cliente.
- [x] **Campo 6/6, Sentinella 5/5, Terra 3/3** — aperti e puliti: negativi
      **misurati**, col denominatore dichiarato.
- [x] **Igiene degli strumenti** — `porte-banchi.mjs`: nessun banco riusa la
      porta di un altro (48 con server, 36 col contrassegno, **0** che
      riusano). Ha corretto una mia diagnosi falsa scritta in due checkpoint.
- [x] **Genesi · la TERZA gamba della domanda** — la domanda di `CLAUDE.md`
      nomina «un CSV, un PDF, **una frase di riepilogo**», e la terza su Genesi
      non era mai stata chiesta. Misurata: dei sette file CSV che il banco apre,
      **sette uscivano in silenzio** — il posto per dirlo (`#toast`) c'era ed era
      **vuoto**, mentre Flotta, Conti, Scudo e Campo annunciano tutti quanto ne
      esce. Non un numero che mente: un numero che non c'è. Adesso i **sei**
      export CSV di Genesi dicono quanto ne è uscito, col conto preso dalle
      righe VERE del file. Banco **66 → 73 prove**, `7 muti → 7 confrontate`,
      0 falliti; iniezione nuova (un foro in più annunciato di quanti ne escono),
      6/6 rimesse, **23** prove cadute in controprova.
      ⚠️ Il conto NON è un ornamento: `sitoExport` **filtra** (`d>0 && w>0 &&
      ppv>0`), e oggi lo schermo filtra allo stesso modo — verificato leggendo
      `sitoRender`, che usa la stessa `P` — ma niente tiene in passo due filtri
      scritti in due punti. La frase è ciò che rende visibile la divergenza.
- [x] **E il righello si è accusato da solo, prima del prodotto.** Il primo
      conteggio diceva «non viste dal selettore: 7», cioè una cosa sul RIGHELLO,
      e stavo per allargare il selettore: `#toast` in Genesi c'è (riga 972). Le
      due cause del silenzio sono **opposte** — nessun posto dove dirlo (misura
      cieca) oppure posto vuoto (prodotto muto) — e contarle insieme fa passare
      la prima per la seconda. Separate (`postiDaFrase` in `giro.mjs`, che riusa
      il selettore invece di riscriverlo): **7 muti, 0 senza posto**.
- [x] ✅ **Scudo: 5 punti d'uscita su 5.** ⚠️ E questa riga è rimasta scritta
      «resta da aprire» **per ore dopo che il lavoro era chiuso**, in una
      giornata in cui ho corretto la stessa forma tre volte altrove (la
      geometria dei gradienti in `CLAUDE.md`, la scala `--nav-scala`, «Campo è
      il lavoro dopo» in `stampe-fs`). La quarta l'ho scritta **io**, poche ore
      prima, ed è la dimostrazione che la direttiva 7 — *chi chiude un'unità
      aggiorna la riga che gliel'aveva proposta* — non è un adempimento: è la
      sola cosa che impedisce a un cantiere già fatto di rinascere.
      Nel merito: quattro dei cinque erano **già aperti** da `scudo-documenti`
      (l'avevo dedotto assente grepando **un solo** nome, `__usciti`, mentre il
      gancio si chiama `__scaricati`), e il quinto —
      `scudo_azioni_copia.csv` — è entrato lì dentro con quattro prove e la sua
      iniezione.
- [x] ✅ **Domanda chiusa (09/08): una voce di costo senza importo spariva in
      silenzio — adesso lo dichiara.** `riepilogoCosti` la scartava alla
      **prima riga**, e da lì in poi non esisteva per nessuno: né nel totale,
      né in `conto`, né nell'elenco a schermo, né nel CSV.
      ⛔ **E la decisione non andava presa: era già presa, dieci righe più giù
      nella stessa funzione**, dove le voci senza **data** vengono contate e
      dichiarate invece che buttate — col commento che spiega perché. Una
      correzione fatta a metà del proprio file è la firma della copia debole,
      e qui i due casi erano nello stesso posto.
      ⚠️ **Quello che NON cambia, di proposito: che cosa si somma.** Sommare un
      importo che non si legge è impossibile, e se un negativo sia una
      correzione da contare è una domanda di prodotto **a sé**, che resta
      aperta. Qui cambia solo che l'omissione **si vede**: totali invariati
      (6200 prima e dopo).
      ⚠️ **E i tre motivi restano separati perché portano a gesti diversi**: una
      data si mette, un importo mai scritto si compila, uno zero o un negativo
      **l'ha scritto qualcuno** e va capito. Lo zero SCRITTO non si confonde col
      campo mai riempito — `numeroDichiarato`, la funzione che in questa casa
      distingue le due cose.
      ⛔ **E la frase più tranquilla della schermata poteva essere falsa**:
      «Nessuna voce lasciata fuori» guardava **solo** le voci senza data, cioè
      dichiarava «nessuna» avendo in mano uno dei tre motivi. Adesso li nomina
      tutti e tre.
      Verifiche: `run-kpi` **1921 → 1922**, 0 falliti (il caso nuovo mette alla
      prova tutti e quattro i modi in cui un importo non si legge — `null`,
      stringa vuota, «abc», e lo zero scritto); `run-stile` 318/0,
      `sonda-vuoto` 15/0 con **5 tranquilli trovati e 5 dichiarati**,
      sintassi delle pagine 34/0.
- [x] ✅ **La SECONDA gamba della domanda (il PDF / il foglio stampato) è
      coperta su tutte e otto le superfici — misurato, non dedotto.** Il
      censimento è stato fatto cercando **più nomi** (`emulateMedia`,
      `window.open`, `__stampa`, «stampat»), che è la correzione dell'errore
      costato trecento righe due ore prima. Esito: `stampe-fs` ne guarda sei,
      Campo ha `campo-foglio-turno`, il core ha `core-documenti-che-escono`.
      **Nessun buco.**
      ⛔ **Ma un'eccezione dichiarata era doppiamente scaduta**, e diceva il
      contrario del vero: «resta fuori **Campo** … vuole l'impianto che
      raccoglie il popup — non è dimenticanza, **è il lavoro dopo**».
      · l'impianto che raccoglie il popup **è in quel file**, costruito per
        Terra il giorno in cui Terra è entrata;
      · e il lavoro non è dopo: `campo-foglio-turno` apre la finestra, legge il
        foglio in `@media print`, scarica la consegna `.txt` e chiede **la
        domanda di `stampe-fs`** su tutt'e due (`⛔ il rapporto dichiara di
        essere fatto di dati di esempio`, e la gemella sulla consegna).
      ⚠️ **Terza volta in una notte che una riga propone un lavoro già chiuso**
      (le altre: la geometria dei gradienti in `CLAUDE.md`, la scala
      `--nav-scala`) — e il costo non è teorico, è il banco di Scudo scritto e
      buttato. Il documento `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md` la
      correzione **l'aveva già fatta**: a restare indietro era il commento nel
      codice, cioè il posto dove uno la legge mentre lavora.
- [x] ✅ **E quel censimento è diventato un controllo, `fogli-guardati.mjs`, in
      `npm test`** — perché una difesa che resta nello scratchpad, alla sessione
      dopo non esiste. Domanda: *ogni superficie che sa stampare è premuta da
      almeno un banco?* Oggi **8 su 8**, con 79 banchi letti e l'elenco delle
      superfici **derivato** da `SUPERFICI` di `giro.mjs` (un terzo elenco a
      mano sarebbe quello che si accorcia da solo).
      ⛔ **E la prima stesura dichiarava Genesi SCOPERTA. Non lo era.**
      «Premere un foglio» è scritto in **quattro** modi — `emulateMedia`,
      l'evento `popup`, un gancio `__stampa`, e `window.open` **sostituita** in
      un `addInitScript` — e la quarta è quella che usano proprio Genesi e
      Campo. È lo stesso errore del censimento delle iniezioni (che conosceva
      una sola forma di tabella) e di quello che poche ore prima è costato
      trecento righe: **un censimento che conosce N convenzioni chiama
      «mancante» la N+1**. Per questo i quattro gesti sono **dichiarati e
      contati**, e una prova pretende che servano ancora tutti e quattro: quando
      il controllo accusa, la prima domanda è «è nata una quinta convenzione?».
      ⚠️ **E la controprova ha trovato un buco nel controllo stesso**: lo
      spoglio dei commenti stava dal **chiamante**, quindi un secondo chiamante
      col testo grezzo perdeva la difesa — e un gesto scritto dentro un
      commento contava come codice. È la guardia scollegata (regola 17) nel
      posto più beffardo: dentro il controllo scritto per non farsi ingannare.
      Adesso `senzaCommenti` sta **dentro `chiPreme`**, dove la decisione si
      prende. Senza quello spoglio il core risultava premuto da **25** banchi
      (ne sono 12) e Campo restava «coperto» anche cancellando il suo unico
      banco vero: 7 prove, 0 falliti, quattro controprove nei due versi.
      ⏱️ **E la suite nuova è entrata SUBITO nel numero che si cita al
      fondatore**, perché lasciarla fuori sarebbe stata la **quarta forma
      dell'invecchiamento** — un numero vero, sorvegliato, e più **stretto**
      della frase che lo presenta («2.367 prove girano senza rete e senza
      browser»). Il criterio era già scritto in `numeri-nei-documenti`, per la
      stessa ragione, il giorno che entrò `bootstrap-rivendicazioni`: **prove di
      comportamento, senza rete e senza browser**. Adesso **2.370**, otto suite.
      ⚠️ E il controllo sugli **addendi** ha fatto il suo mestiere: aggiornato
      il totale, ha visto che la scomposizione accanto sommava ancora 2.367 —
      «due numeri che si contraddicono nella stessa riga».
