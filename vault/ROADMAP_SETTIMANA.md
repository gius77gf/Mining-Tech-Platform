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
- [ ] **D. Le 24 decisioni ancora aperte** *(⏱️ **verificato il 09/08, e il 24 è
      giusto — ma la derivazione non era scritta da nessuna parte, quindi la
      scrivo qui perché nessuno debba rifarla**: `docs/DECISIONI_WEEKEND.md` ha
      **18** titoli `## N`, di cui **cinque** (5, 10, 11, 12, 18) si aprono in
      **dodici** sotto-decisioni con la lettera. Gli atomi contabili sono quindi
      13 + 12 = **25**, meno la **3** che è chiusa → **24**. Un numero senza la
      sua derivazione si ricontrolla da capo ogni volta, e ogni volta può dare un
      risultato diverso — è la lezione del 42/41/47 di stamattina.)* —
      `docs/DECISIONI_WEEKEND.md`,
      pagina d'ingresso in cima al file.

---

- [x] ✅ **B11. IL RIPIEGO SILENZIOSO — censito a tre gradini in quattro app, e
      il conto onesto è 343 → 144 → 1 vivo.** ⏱️ *14/08.* Nasce dal caso
      capostipite chiuso stanotte in Genesi (`B = D2.B || SPALLA`: la distanza a
      cui si mandano via le persone usciva da una spalla che nessuno aveva
      scritto) e dal `Math.max(0, a − b)` di Conti, che reggeva su un invariante
      non scritto da nessuna parte. La domanda: **un ingresso che l'utente non
      ha scritto, sostituito da una costante di mestiere, e il numero che ne
      esce si presenta come misurato.**
      **I tre gradini, dichiarati perché il primo NON è il conto dei difetti:**
      · **343 candidati** per forma (campo 55 · conti 122 · flotta 96 · terra
        70). ⚠️ Un `grep` nudo ne dà **407**: i 64 di scarto sono **commenti** —
        questo repository cita per esteso i difetti di questa famiglia, quindi
        un censimento che non toglie i commenti **si conta addosso la propria
        documentazione**;
      · **144 pertinenti** (l'ingresso lo scrive l'utente e la costante è di
        mestiere). I 199 scartati con la ragione: 186 ripieghi a zero su
        contatori, 11 finestre di visualizzazione, 2 fra ordinamenti e conteggi;
      · **1 difetto vivo, 1 latente, 2 non raggiungibili.**
      **Il vivo — Flotta, `consumoRicambi`.** Un intervento *vecchio* nomina il
      ricambio senza dire quante unità, e il conto ne mette **1**. Da lì passano
      soglia proposta, pezzi da ordinare e spesa. Rimisurato da me sulla copia
      di quello che si committa, con sei interventi identici salvo la quantità:
      **6 pezzi col ripiego contro 18 col dato vero**, `attendibile` **false**
      contro **true**. Direzione: **rassicura** — «non devi ordinare niente»
      dove il magazzino va sotto. ⚠️ Ma il verso **non è garantito**: con un
      pezzo che si consuma a frazioni l'errore va dall'altra parte. L'unica cosa
      certa è che quel numero poggia su quantità mai scritte, ed è quello che
      adesso l'app dichiara.
      ⛔ **E il conto ESISTEVA GIÀ e non lo leggeva nessuno**: `grep -c
      'daInterventiVecchi' apps/flotta/index.html` sul committato → **0**,
      contro `senzaData` → 10 nello stesso file. Una dichiarazione che nessuno
      legge non protegge niente — è la regola 20 di `run-stile`, e la cura è la
      forma già in casa: la bandiera `attendibile` (vocabolario chiuso) letta in
      **due** punti della pagina.
      **Lasciato fermo, con la misura:** `canonePeriodo` di Conti risponde
      `dovuto: 0` con l'aliquota mai impostata — uno zero tranquillo su soldi
      dovuti all'ente — ma l'unico lettore rifà la guardia per conto suo e
      mostra «—». Spostarla nel modulo è un cambio di contratto: **il rischio
      resta la copia debole**, il giorno che un export chiami quella funzione.
      E `rigaPesata`: forma pertinente, ingresso **non assentabile** (il form
      pretende `prezzo > 0`, il lettore CSV filtra i nulli).
      **Sano, verificato**: i 17 `volumeM3 || 0` di Terra sono protetti a monte
      da `rilievoUsabile`; `fineTurno` di Campo si rifiuta di dare per scontate
      «otto ore»; il `Math.max(0, parco − mezziLista.length)` di Flotta regge
      per costruzione. I punti d'uscita (CSV/PDF) scrivono celle vuote, non zeri.
      **Controprova**: 3 iniezioni indipendenti — bandiera sempre vera (cadono 2
      prove su 3), costante da 1 a 3 (cade la terza, e le altre due no), e la
      lettura tolta dalla pagina (**la regola 20 di `run-stile` diventa rossa**:
      la bandiera è sorvegliata, non può tornare scollegata in silenzio).
      **Misure**: `run-kpi` 2249 → **2252**, 0 falliti.

- [x] ✅ **CONTI · LO ZERO SUI SOLDI DOVUTI ALL'ENTE — e il fratello VIVO che
      nessuno aveva censito.** ⏱️ *14/08, nata dal censimento B11 che l'aveva
      lasciata ferma con la misura.*
      `canonePeriodo` faceva `+cfg.canoneAliquota || 0`: con la tariffa **mai
      impostata** rispondeva `dovuto: 0` e `motivo: ""` — uno zero tranquillo su
      soldi dovuti a un ente. Non era vivo perché l'unico lettore rifaceva la
      guardia per conto suo: cioè la guardia stava nella **pagina**, non nella
      funzione, che è la definizione di copia debole. Misurato sulla
      dimostrazione: aliquota vera **98,62 €**, aliquota assente/`null`/`""`/
      `"abc"`/`0` → **0** con `perProdotto[].calcolabile: true`.
      ⛔ **E misurando è saltato fuori il fratello, che era VIVO** (aliquota
      presente): senza nessuna consegna dotata di densità il totale usciva
      **`€ 0,00`** mentre **tutte** le righe sotto dicevano «—». Adesso dicono
      la stessa cosa.
      · La cura è nel modulo, col vocabolario chiuso: `noto` (la tariffa c'è) e
        `calcolabile` (la base si misura), `dovuto: null` e un `motivo` che dice
        **quale dei due** manca. I **quattro** punti che componevano il dovuto
        sono diventati **uno**: due dei quattro moltiplicavano per l'aliquota
        senza chiedersi se ci fosse.
      · La pagina **legge le bandiere** invece di rifare la guardia; `senzaAli`
        resta solo per scegliere la frase, non il numero. Tutti e cinque i punti
        che leggevano `c.aliquota`/`c.base`/`c.dovuto` sono guardati.
      ✅ **Nessuna regressione, misurata riga per riga**: dove l'utente vedeva
      «—» vede «—», e l'unico caso che cambia è quello in cui prima leggeva
      `€ 0,00` su un conto non calcolabile.
      ⚠️ **Il canone non ha nessun punto d'uscita** (né CSV né stampa): è la
      ragione per cui era latente, e la ragione per cui andava corretto lo
      stesso. Chiamati comunque tutti e sei i compositori CSV e le tre stampe:
      nessuna copia debole, i «non si può dire» escono **vuoti**.
      ⛔ **Una prova esistente BENEDICEVA lo zero**: si chiamava «`canonePeriodo`
      senza aliquota non inventa un dovuto» e pretendeva `dovuto === 0` — cioè
      passava per un motivo diverso da quello nel suo nome. Riscritta più
      **giusta**, non più permissiva.
      **Controprova**: 3 iniezioni → 5 e 1 prove cadute; la terza («tolgo la
      lettura dalla pagina») **non distingue**, ed è la causa 2 di `CLAUDE.md`
      (difesa in profondità): `noto` lo consuma anche il modulo, che è il
      disegno giusto — e adesso la correttezza non dipende più dalla pagina.
      **Misure**: `run-kpi` 2252 → **2259** (delta isolato per sottrazione),
      0 falliti.

- [x] ✅ **SENTINELLA · LA CONFERMA DI UNA VOLATA INVENTAVA TRE NUMERI, E
      «CONFORME» SU UN SUPERAMENTO.** ⏱️ *14/08, seconda metà del censimento
      B11 — le due app che parlano con gli enti.*
      **Censimento a tre gradini, coi comandi**: `grep` nudo **884** → nel
      codice vivo **872** (12 erano commenti) → tolta la coda dei segnaposto di
      stampa (`|| ''`, `|| '—'`: 498) **374** → di cui **ripiego di mestiere
      72** → **pertinenti 56** (Scudo 28, Sentinella 28) → **difetti veri 2,
      tutti e due in Sentinella. Scudo: zero.**
      ⚠️ Il conto grosso è vero e inutile: quattro quinti sono `|| ''` di
      stampa, che non entrano in nessun calcolo. Il confine è **dichiarato**,
      non indovinato. E un classificatore automatico è stato **provato e
      scartato**: lasciava 306 righe da leggere a mano, cioè non separava
      niente.
      **1. La conferma della volata — VIVO.** Tre penne scrivono i quattro campi
      numerici del registro; due rispondevano già `null` su un dato non
      dichiarato, la terza scriveva **0**, in due metà indipendenti: nel modulo
      `+null` fa **0** e `Number.isFinite(0)` risponde `true`; nella pagina i
      quattro campi erano **prestampati** con `num(+v.X || 0)`, cioè uno zero
      già scritto nella casella che l'utente firma.
      ✅ **Rimisurato da me, prima e dopo, sullo stesso caso** (volata prevista,
      confermata senza toccare niente): `kgTotali/kgMaxRitardo/distanzaRicettore`
      **`0 / 0 / 0` → `null / null / null`**. Nel CSV del registro la riga
      passava da `;24;0;0;0;regolare;` a `;24;;;;regolare;`.
      ⛔ **Direzione: RASSICURA, su un file che va all'ente** — «il ricettore è
      a **zero metri**» dove nessuno ha misurato. E il denominatore che doveva
      dirlo **esisteva già** ed è letto in due punti: il ripiego lo teneva a
      zero.
      ⚠️ `refertoDaVolata` **non è toccato** (guardia `> 0`): le distanze di
      sicurezza e il ponte con Genesi erano e restano al sicuro.
      **2. `statoMisura` diceva «Conforme» su un superamento — latente.**
      `(+mm.valore || 0) / Math.max(0.001, +mm.soglia)`: una **seconda lettura**
      dello stesso numero, con una guardia più debole di quella tre righe sopra.
      ✅ Rimisurato da me con soglia 5 e ultima lettura **9**, `valore`
      illeggibile: **prima** `{cls:"ok", label:"Conforme", ratio:0,
      calcolabile:true}` — **dopo** `{cls:"danger", label:"Superamento",
      ratio:1.8}`. La stessa parola finisce in `csvAmbiente`, il file per
      l'ARPA.
      ⚠️ **Raggiungibilità dichiarata, non gonfiata**: tutti gli scrittori di
      `monitoraggi` tengono `valore` in sincrono con l'ultima lettura, quindi ci
      si arriva con un dato scritto a mano o con una riga più vecchia del filtro.
      ⛔ **E UN'ECCEZIONE ERA IL POSTO DOVE IL DIFETTO VIVEVA**: `sonda-vuoto`
      aveva **trovato** questo punto e l'aveva perso — lo scusava come «è il
      valore PRECOMPILATO di un campo di modulo», citando il commento che
      giustificava il ripiego. Quella ragione non è il motivo per cui il caso è
      innocuo: **è il meccanismo del difetto**. Due righe che si davano ragione
      a vicenda.
      **Punti d'uscita**: chiamati, non letti — otto compositori, tutti
      dichiarano il «non si può dire» (cella vuota più la colonna `nota`,
      «senza data», indici `null` col `motivo`, esito «senza-soglia»). Nessuna
      copia debole: il lavoro del 03/08 regge.
      **Controprova**: 3 iniezioni indipendenti → **7 · 1 · 2** prove cadute.
      Ogni metà è sorvegliata **da sola**: nessuna delle due poteva bastare.
      **Misure**: `run-kpi` 2259 → **2270**, 0 falliti.
      ⛔ **E QUESTA RIGA, CHE AVEVO SCRITTO IO, ERA UNA DECISIONE GIÀ PRESA CHE
      RINASCEVA.** Diceva: «`accorciaVoceTendina` vivrebbe in `shared/dw-ponti.js`
      (il suo commento dice che serve anche a Scudo), è la regola del `shared/` e
      va fatta». **Falsa**, e il cantiere mandato a farla si è fermato **prima di
      spostare qualunque cosa**, con le prove:
      · chi la chiama, sul codice **senza commenti**, in 51 file di prodotto:
        **3 occorrenze, tutte in Sentinella**. Prima Sentinella, dopo Sentinella;
      · l'unica occorrenza in Scudo è **un commento, e dice l'opposto**: «`#vf-esito`
        è un'etichetta NOSTRA, non il titolo di un documento scritto dall'utente…
        qui il testo lo scriviamo noi, e allora lo si scrive corto»;
      · e la decisione era **già stata presa con la misura il 09/08**, dodici
        minuti dopo che quel commento era nato: *«oggi il secondo consumatore NON
        esiste, e la regola scatta su "serve a due app", non su "potrebbe
        servire"»* (`048af9f5`).
      ⚠️ **La forma da riconoscere**: il commento diceva «**VIVREBBE** in
      `shared/`» — una **previsione**, scritta onestamente da chi non poteva
      toccare `shared/`. Cinque giorni dopo un cantiere l'ha letta come un
      **fatto**, e io l'ho riportata in roadmap senza rileggere i checkpoint. Una
      previsione scritta in un commento **sopravvive alla decisione che la
      respinge**, perché la decisione sta in un checkpoint e il commento sta
      accanto al codice.
      ⏱️ **Quello che invece è vero e resta aperto, misurato dallo stesso
      cantiere**: il taglio di un testo è scritto **tre volte**, e non fra
      Sentinella e Scudo — fra Sentinella e **`shared/dw-grafici.js`**. `tagliaA`
      (in `shared/`) e `accorcia` (in Scudo) **spezzano le coppie surrogate**
      (UTF-16), `componi` dentro `accorciaVoceTendina` no (`[...t]`); e i tre
      tolgono separatori diversi. Misurato: **6 casi su 8 divergono** fra
      `tagliaA` e `componi`, e su 6 casi mirati `accorcia` lascia un separatore
      appeso in **4** e mezzo carattere in **1**.
      ⚠️ **Ma sui dati veri non morde**: passando i **56 testi della
      dimostrazione** dai punti d'uso reali, **27 vengono tagliati, 0 con
      separatore appeso, 0 con mezzo carattere**. È **latente**, e va scritto
      così — la prima fixture del cantiere usava `D.eventi` e
      `D.modelliIspezione`, che **non esistono**: la solita tabella indovinata.

- [ ] **B12. IL RIPIEGO SILENZIOSO NEL CORE — censito, e sono CANDIDATI, non
      difetti.** ⏱️ *14/08, censimento statico fatto da me; il core è l'unica
      superficie che i tre cantieri di questa notte non hanno guardato, ed è
      quella che il fondatore mostra per prima.*
      **I tre gradini, coi numeri** (commenti tolti con `senzaCommenti` di
      `tests/tokenizza.mjs`, sui blocchi `<script>` del core — il programma sta
      lì dentro):
      · **407 candidati** per forma nel codice vivo (**418** col grezzo: **11
        erano commenti**);
      · di quei 407: **271** sono segnaposto di stampa (`|| '—'`, `|| ''`) che
        non entrano in nessun calcolo, **95** sono ripieghi a **zero** su
        contatori, e **41** sono ripieghi di **mestiere** — una costante che non
        è né zero né una stringa;
      · dei 41, **una buona metà non è di questa famiglia**: `clientWidth||360`,
        `devicePixelRatio||1`, `M.userData.op||0.5`, `power||1`, `quality||0.8`,
        `d.channels||1` sono misure del **disegno**, non dati che scrive
        l'utente.
      ✅ **IL CAPOFILA È CHIUSO dal commit `5bcaf0b3` del 14/08 — rimisurato il
      14/08 alle 15:14Z prima di scriverlo, e la ragione è più stretta di quella
      che stavo per scrivere a memoria.** Diceva: «`getBorraggio` e
      `getSpaziatura` finiscono su `|| 3.5` e `|| 4`, e non servono solo al
      disegno: `generaMagliaFori` calcola i fori per fila con `Math.floor(L/S)`,
      cioè un **conteggio che l'utente legge** poggia su una spaziatura
      inventata». La prima metà è ancora vera **per il disegno, dichiarato**; la
      seconda no, e a dirlo è il conto dei **chiamanti**, non la lettura della
      funzione:

          grep -n "generaMagliaFori" index.html
          5378:  v.fori=tipo==='galleria'?generaGalleria(v):generaMagliaFori(v);
          5438:function generaMagliaFori(v){
          7368:      v.fori=v.tipo==='galleria'?generaGalleria(v):generaMagliaFori(v);

      · **7368** è «Rigenera maglia», e da `5bcaf0b3` è **dietro
        `magliaGenerabile(v)`**: se le misure non ci sono il bottone non genera
        niente e lo **dice** («Schema non generabile: manca …»);
      · **5378** è la creazione di una volata **nuova**, e lì la maglia viene
        **scritta** un attimo prima (`borraggio: B||3.5`, `spaziatura: S||4`
        dentro l'oggetto): è il default legittimo che questa riga stessa
        dichiarava, non un numero inventato a valle.
      Cioè non c'è nessuna terza strada per cui un conteggio di fori nasca da
      una spaziatura mai scritta. ⚠️ **Stavo per scrivere «già chiuso» sulla
      fiducia nel mio commit di stamattina, ed era la conclusione giusta con la
      prova sbagliata** — che è il difetto che questo file chiama «una prova che
      invecchia non rende la riga sbagliata: la rende non credibile».
      ⛔ **QUELLO CHE RESTA APERTO, e va misurato prima di chiamarlo difetto**,
      è il **fronte**, non la maglia: `v.fronte.lunghezza_m || 20` alla riga
      4814 contro `|| 5` alle righe 4897, 5480, 5482 e 5564 — **lo stesso campo
      con due costanti diverse**, venti metri in un punto e cinque nell'altro —
      più `altezza_m || 4`, `calotta_m || 1`, `pref.fori || 5`,
      `pref.diametro || 89`.
      ⚠️ **Perché è un candidato e non un difetto**: `borraggio: B||3.5` alla
      creazione di una volata **nuova** è un default legittimo — l'utente poi lo
      cambia. La domanda vera è l'altra: *che cosa succede a una volata che quel
      campo non ce l'ha* (importata, o vecchia)? A rispondere non è la lettura
      del codice: è aprire la pagina con quel campo assente e guardare il numero
      dei fori. **Il core non si importa da `node`** (tutto il suo programma sta
      in un `<script type="module">` che carica Firebase da `gstatic`), quindi
      la misura vuole il **browser** con `tests/browser/finto-firebase.mjs`
      montato prima di `goto` — e va fatta **quando nessun giro sta girando**.
      ⛔ **E il vincolo del fondatore vale doppio qui**: nulla di quei valori
      deve **comparire** come se fosse un dato misurato, e le soglie di
      sicurezza non si toccano.
      **Altre due famiglie contate nello stesso passaggio**, da guardare con la
      stessa domanda: **3** punti `Number.isFinite(+x)` — dove `+null` fa **0** e
      `Number.isFinite(0)` risponde **true**, il tranello per cui esiste
      `numeroDichiarato` in `shared/` — e **10** punti `Math.max(0, …)`, dove
      quello zero di comodo nasconde un invariante che nessuno ha scritto.
      ⛔ **E IL CENSIMENTO ADESSO È UNO STRUMENTO, non un `grep` a memoria**:
      `apps/deepwork-id/tests/ripieghi-silenziosi.mjs` (misura dichiarata, non
      va in `npm test`), con `--solo=<superficie>`. Era stato **riscritto da
      zero quattro volte in due notti**, una per cantiere, ognuna con un
      righello un po' diverso — che è alla lettera la regola «gli strumenti di
      misura vivono nei test, non nello scratchpad».
      **Il quadro completo, misurato in un colpo su 15 superfici:**

      | superficie | candidati | commenti | stampa | zero | **MESTIERE** | `+finite` | `max(0,` |
      |---|---|---|---|---|---|---|---|
      | core | 407 | 11 | 271 | 95 | **41** | 3 | 10 |
      | genesi · pagina | 248 | 23 | 52 | 77 | **119** | 0 | 38 |
      | campo · pagina | 122 | 0 | 100 | 1 | **21** | 2 | 2 |
      | sentinella · pagina | 120 | 3 | 101 | 5 | **14** | 6 | 4 |
      | campo · modulo | 153 | 2 | 111 | 31 | **11** | 7 | 23 |
      | flotta · modulo | 132 | 7 | 88 | 34 | **10** | 2 | 25 |
      | terra · pagina | 78 | 2 | 54 | 14 | **10** | 1 | 4 |
      | conti · modulo | 226 | 11 | 165 | 52 | **9** | 7 | 21 |
      | flotta · pagina | 167 | 2 | 115 | 44 | **8** | 3 | 5 |
      | sentinella · modulo | 193 | 5 | 179 | 6 | **8** | 3 | 7 |
      | conti · pagina | 223 | 8 | 164 | 52 | **7** | 1 | 6 |
      | terra · modulo | 106 | 5 | 52 | 48 | **6** | 8 | 11 |
      | genesi · modulo | 24 | 14 | 5 | 14 | **5** | 1 | 1 |
      | scudo · modulo | 154 | 3 | 131 | 21 | **2** | 1 | 7 |
      | scudo · pagina | 157 | 1 | 155 | 1 | **1** | 0 | 1 |
      | **totale** | **2.510** | **97** | **1.743** | **495** | **272** | **45** | **165** |

      ⛔ **La riga che salta agli occhi è Genesi · pagina: 119 ripieghi di
      mestiere, tre volte il core e cinque volte chiunque altro** — ed è
      esattamente l'app dove il capostipite viveva. Non vuol dire 119 difetti:
      vuol dire che è **lì** che questa domanda va fatta per prima.
      ⚠️ E i **97 commenti** contati a parte sono la misura del pericolo
      opposto: senza toglierli, il censimento si conta addosso la propria
      documentazione.
      ⛔ **E `Math.max(0, …)` VA SPACCATO IN DUE, se no quel 165 non dice
      niente.** Quasi tutti sono **clamp** — tengono un valore dentro il suo
      dominio, e vanno benissimo. Quella pericolosa è la **sottrazione fra due
      insiemi**, dove lo zero di comodo nasconde un invariante che nessuno ha
      scritto: il 13/08 in Conti, rotto l'invariante, non diventava negativa —
      **faceva sparire delle consegne**. Misurate: **38 su 165**, e non sono
      sparse — `conti · modulo` **9**, `flotta · modulo` **8**, `terra · modulo`
      **5**, `core` **3**, `conti · pagina` **3**, `genesi · pagina` **3**.
      ⚠️ **E il righello ha sbagliato DUE VOLTE prima di reggere, con lo stesso
      segno**: la prima stesura chiedeva che il carattere prima del meno non
      fosse uno spazio (per escludere il meno unario) e quindi perdeva
      `Math.max(0, tot - persi)`, **la forma più comune di tutte**; la seconda
      prendeva il corpo con una regex non-greedy, che si ferma al primo `)` e
      quindi non vedeva `Math.max(0, f(x) - g(y))`. Il numero è passato da **6**
      a **38**, cioè la prima misura era una sottostima di sei volte — e a
      dirlo è stata la **controprova scritta dentro lo strumento**, che gira a
      ogni lancio e lo **ferma** se non distingue le due forme. La rilettura
      non l'aveva vista né la prima né la seconda volta.
      *(La tabella qui sopra è misurata sul commit `f1ae57ee`; i numeri di
      Genesi si muovono perché un cantiere ci sta lavorando. Il numero vero lo
      dà lo strumento, non questa tabella.)*
      ⛔ **E IL 14/08 LO STRUMENTO HA DICHIARATO UN PROPRIO PUNTO CIECO, MISURATO:
      la sinistra del `||` poteva essere un'ESPRESSIONE FRA PARENTESI**, e la
      prima stesura voleva un identificatore — quindi `(f() && f().x) || 100` e
      `parseNum(x) || 30` gli sfuggivano. L'ha visto un cantiere su Genesi (30
      in più nella sua sola pagina); misurato su **tutte** le superfici il salto
      è **269 → 370 ripieghi di mestiere, cioè 101 entrati**: il censimento
      vedeva il **73% della famiglia** e lo stampava come se fosse il totale.
      ⚠️ Non è rumore — il valore a destra è comunque una costante di mestiere, e
      che a sinistra ci sia un nome o una chiamata non cambia che cosa succede
      quando il dato non c'è. **I numeri buoni sono quelli nuovi**: core **59**
      (era 41), `genesi · pagina` **146** (era 119), `scudo · pagina` **7** (era
      1), totale **370** su **2.844** candidati.
      ⚠️ **È la seconda volta in un'ora che questo strumento sottostima** — prima
      le sottrazioni (6 contro 38), adesso la forma. Tutt'e due le volte il
      numero sbagliato era **già stato stampato e citato**, e tutt'e due le volte
      a prenderlo è stata una **misura del costo fatta prima di allargare**, non
      la rilettura. Un righello nuovo si prova contro il difetto **anche quando
      il difetto è nel righello**.
      ⛔ **E la terza volta è nel verso opposto: SOVRASTIMAVA.** La destra della
      forma combacia con la sola **iniziale maiuscola** di una chiamata o di un
      membro — `) || String(x)`, `) || Math.abs(y)`, `IC[k] || IC.altro` — e li
      contava come costanti di mestiere. L'ha dichiarato il cantiere che ne aveva
      **14 su 56** (il 25% della colonna su quattro app); misurato su tutte le
      superfici sono **58 su 362, il 16%**. La colonna adesso guarda **il
      carattere dopo il match**: se è `(` o `.`, non è una costante.
      **Il numero onesto è 304**, e i tre movimenti di questo strumento in due
      ore — 269 → 370 → 304 — sono la ragione per cui un censimento che dichiara
      un totale deve dire **su quale forma l'ha contato**: senza, il suo numero è
      una misura della propria regex.
      ⛔ **E QUELLA CORREZIONE NON AVEVA CORRETTO NIENTE — per tre giorni, con la
      diagnosi giusta scritta accanto.** `String` non è tutto maiuscolo: la
      destra è `[A-Z_][A-Z_0-9]*`, quindi combacia con la sola `S` e il
      carattere dopo il match è la `t`, non `(`. La guardia guardava un punto
      **in mezzo a un nome**, e il commento sopra di lei dichiarava il difetto
      chiuso. L'hanno rimisurato **due cantieri indipendenti lo stesso giorno**
      (11 su 18 in Conti, 7 su 22 in Flotta), il che è anche il segno da
      riconoscere: due misure indipendenti che accusano lo stesso strumento.
      La domanda che mancava è la terza — *il match è finito, o si è fermato
      dentro un nome più lungo?* Sullo stesso albero: **300 → 225**, il core
      **invariato a 50** (i suoi erano tutti veri).
      ⚠️ E stringere non produce rumore, produce **cecità**: quindi non si sono
      contati gli allarmi nuovi ma **i nomi che escono**, e gli 80 sono `String`
      57, `Number` 5, `Math` 3, `NaN` 3, `Array` 1, sei variabili in
      maiuscoletto — e **cinque numeri in notazione scientifica che erano
      ripieghi VERI**: i `|| 1e9` che mandano in fondo a un ordinamento un
      recettore la cui distanza non si legge, e l'`|| 1e-9` che salva una
      divisione. Per quelli si è **allargato il numero** invece di stringere, se
      no la stretta si portava via cinque casi buoni insieme a settantacinque
      cattivi. Adesso il righello **si interroga sui suoi 16 punti di
      decisione** all'avvio e si ferma se ne sbaglia uno (col difetto rimesso ne
      sbaglia 7): un buco trovato per caso vuol dire che gli altri aspettano il
      prossimo caso.

- [x] ✅ **TERRA · «RISERVA RESIDUA STIMATA: 0 m³ · DURATA ~0 ANNI» DOVE NESSUNO
      AVEVA SCRITTO QUANTO RESTA.** ⏱️ *14/08, terza metà del censimento dei
      ripieghi silenziosi — Campo e Terra.*
      **I tre gradini**: **659 candidati** per forma (Campo 393, Terra 266) →
      fuori **482 per dichiarazione** (segnaposto di stampa `|| ''` e contenitori
      `|| []`: non sono numeri che si presentano come misurati) → **85
      pertinenti** guardati uno per uno → **2 difetti veri**, più uno lasciato
      fermo con la misura. ⚠️ E **3 commenti in Campo, 9 in Terra** venivano
      contati come codice da un `grep` nudo.
      **Il difetto corretto — `riservaResidua`, direzione ACCUSA.** La guardia
      era sulla **forma** (`riserveM3 == null`), quindi accettava `""`, `"  "`,
      `"abc"`, e due righe sotto `(+riserveM3 || 0)` li leggeva **zero**.
      ✅ Rimisurato da me, prima e dopo, con la firma vera:
      `"" | "  " | "abc"` → **`{residuo: 0, anni: 0}`** prima, **`null`** adesso;
      e uno **zero scritto** resta `{0, 0}` in tutt'e due — un dato dichiarato
      non si perde. Sullo schermo quel `{0,0}` diventava «**Riserva residua
      stimata: 0 m³ · durata ~0 anni**»: dice che la cava è finita dove la verità
      è che nessuno ha scritto quanto resta.
      ⛔ E c'era la **seconda lettura più debole**, il segno di questa famiglia:
      la pagina si era riscritta la stessa guardia (`!= null`, che accetta `""`).
      Adesso legge solo la risposta del modulo — una regola, un posto. La cura usa
      `numeroDichiarato` di `shared/dw-ponti.js`, **già importato**: nessuna
      guardia nuova.
      ⚠️ **Raggiungibilità dichiarata**: `riserveM3` non ha un campo nel form
      (l'unico id che gli somiglia è il riquadro che *mostra*), quindi il caso
      arriva da dati scritti fuori dall'interfaccia o da un archivio vecchio —
      **latente, non impossibile**.
      **I punti d'uscita, chiamati e non letti**: cinque uscite di Campo e due di
      pagina scrivono **celle vuote**, mai zeri; e su una cava senza nessun
      rilievo schermo, foglio stampato e CSV dicono ormai la stessa cosa
      (`—` / «non misurato» / cella vuota) — **il difetto del 13/08 è chiuso**.
      **Il setaccio a tappeto, come denominatore**: chiamate **tutte** le funzioni
      esportate dai due moduli senza dati (Campo 112 funzioni/1069 chiamate,
      Terra 78/778); i numeri che ne escono sono contatori, tranne il `residuo: 0`
      di cui sopra.
      ⚠️ **Due candidati che sembravano difetti e non lo erano**, con la prova:
      `produzioneDi` e `statoObiettivo` ripiegano su `UNITA_PRODUZIONE[0]`, ma i
      due writer sono `<select>` popolati con l'elenco intero e non c'è nessun
      import CSV di rapportini. **Non raggiungibili dall'interfaccia.**
      **Controprova**: 3 iniezioni → **1 · 10 · 4** prove cadute.
      **Misure**: `run-kpi` 2270 → **2275**, 0 falliti.

## 🧭 Le voci APERTE, per nome — indice

*Questo file è lungo **migliaia di righe** e cresce appendendo sezioni datate in
fondo: le voci aperte più recenti finiscono **in coda**, dopo i «Riferimenti»,
dove chi legge la sezione «Task» non le trova. Questo indice esiste per quello.*

⛔ **Per NOME, non per riga.** I numeri di riga di questo file scadono a ogni
commit — misurato il 09/08: **87 riferimenti su 91** non trovavano più il loro
nome. Un nome si cerca con `grep`; una riga si sposta.
⏱️ **Si rigenera così** (e chi lo rigenera non deve fidarsi di questo elenco):

```sh
grep -n "^- \[ \] \*\*" vault/ROADMAP_SETTIMANA.md
```

- `D-ter. Le otto verdi che vogliono un cantiere`
- `B12. IL RIPIEGO SILENZIOSO NEL CORE — censito, e sono CANDIDATI, non`
- `D. Le 24 decisioni ancora aperte`
- `B3. Genesi continua a uscire dalla pagina`
- `B0-septies. CHE COSA DISEGNA UNA PIANTA SENZA MAGLIA — i ripieghi`
- `B0-quaterdecies. IL TEMA CHIARO DEL CORE NON È MAI STATO MISURATO PER`
- `B0-duodecies. I CLAMP DELLE TRE SUPERFICI CHE IL CENSIMENTO NON AVEVA`
- `B0-bis. TRE FAMIGLIE DI INIEZIONI CHE NESSUN CONTROLLO SORVEGLIA — e`
- `B0. I CANTIERI DEL BROWSER E IL GIRO SI RUBANO LA MACCHINA — misurato`
- `B4. Le mancanze confermate del delta`
- `C2. Ricerca a rotazione`
- `E0`
- `E7`
- `E8`
- `G7–G9`
- `Q1`
- `I 20 KO del giro del 09/08, riverificati sul commit di adesso`
- `«Adempimenti» è la parola che governa il minimo di Sentinella`
- `B7. `sentinella-periodo-adempimento` È INTERMITTENTE — e va rimisurato a`

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

- [x] ✅ **I ternari del singolare che restano nelle app** *(chiuso l'09/08:
  **115 candidati → 17, e i 17 hanno tutti una ragione scritta**, cioè il filo
  è esaurito e non abbandonato. Verificato oggi anche l'ultimo caso rimasto
  aperto nel testo qui sotto — «e altri 1 documenti» di Campo: la correzione è
  **in pagina** (`apps/campo/index.html`, `plurale(r.scadute.length - 1, "un
  altro documento", …)`), quindi la riga proponeva un lavoro già fatto. Resta
  scritta per intero perché il suo valore è il metodo: il censimento
  precedente vedeva il **14%** dei suoi soggetti conoscendo una sintassi sola,
  e la regola automatica è stata provata e scartata con i numeri.)* — ⏱️
  *censito da capo
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
      ✅ **SECONDA FETTA, 09/08: `computeMIC` → `micFinestra(holes, kg)` (blocco
      G11).** MIC è la **massima carica che parte dentro una finestra di 8 ms**,
      cioè la testa della catena più delicata dell'app:
      `MIC → distanza scalata recDist/√MIC → PPV prevista K·SD^(−β) → confronto
      con il limite di norma`. Sbagliarla non produce un difetto grafico:
      produce un «sotto soglia» su una volata che sotto soglia **non è**. Ha
      otto punti di chiamata, fra cui il foglio stampato, il CSV e il piano di
      innesco XML che leggono software di terzi.
      Le prove nuove fissano tre comportamenti che leggendo il codice si
      deducevano male: il bordo della finestra è **aperto a destra** (due fori a
      7,999 ms contano insieme, a 8,0 esatti no); un foro **senza `tDet` vale
      0**, quindi una volata di cui nessuno ha calcolato la sequenza risulta
      tutta simultanea — che è il verso **prudente**, e va bene così; e
      `holes: null` solleva invece di rispondere un numero.
      ⚠️ **Il conto delle funzioni NON è sceso (163 → 163), e la ragione è una
      misura, non una scusa**: nella pagina `computeMIC` resta come **legame**
      fra lo stato del progetto e la funzione pura
      (`return micFinestra(D2.holes, D2.kg);`), esattamente come `interpFronte`
      per `interpProf` — un punto di legame solo invece di ripetere
      `D2.holes, D2.kg` in otto punti di chiamata, che sarebbe la
      «copia da firma troppo stretta» al contrario. Quindi **`genesi-estraibili`
      conta le DICHIARAZIONI, non la logica**, e un trasloco-con-legame gli è
      invisibile: la misura che vede il lavoro è **189 → 38 caratteri** di
      logica nella pagina, e `t0+8` che nel file compare adesso **0 volte**.
      ✅ Trasloco provato **parola per parola**: la vecchia implementazione
      estratta dal file, non riscritta a mano, messa accanto alla nuova su
      **20.000 casi generati** più 4 di bordo → **0 divergenze**.
      ✅ Sette iniezioni, ognuna fa cadere la sua prova — compresa quella
      anti-trappola, che non si accontenta del **nome** (che nella pagina resta)
      ma pretende che sia sparito il **corpo**.
      ✅ **CHIUSO LO STESSO GIORNO (`6188cdf`), e il conto è cambiato in
      corsa.** `micFinestra` risponde **`null`** quando non c'è niente da
      contare, `micSenzaConto` dice **perché**, `esitoMic` dà il verdetto — e
      sono gemelle esatte di `ppvSenzaSoglia`/`ppvLimit`/`esitoAirblast`, che
      stanno trenta righe più su nello stesso file: convenzione **ripresa**, non
      inventata.
      ⛔ **E metà del lavoro sta nei LETTORI, per una misura che ha ribaltato la
      priorità**: il difetto di partenza vale **7,3×**, ma un `null` **non
      letto** vale **199×** — 0,12 mm/s invece di 23,95 — e l'airblast scende da
      135,4 a 104,5 dB(L). Una bandiera che non legge nessuno non protegge
      niente (regola 20), e col flag importato e non letto `run-stile` cade a
      316. Sette lettori sistemati e **aperti davvero premendo i bottoni**: il
      CSV della scheda volata, il **piano d'innesco XML** (era
      `<MaxInstantCharge>0.0</>` — il file che legge un software di terzi,
      adesso elemento vuoto con `status="non-calcolabile"` e il commento «non
      usare per programmare i detonatori»), il foglio stampabile, il CSV che
      attraversa verso **Sentinella**, la scheda validatori, `sitoGrafico` e la
      riconciliazione.
      ⚠️ Due stesure **bocciate in scratchpad** prima di scrivere nel modulo, e
      valgono: `if(!H.length)` lascia in piedi il **secondo** numero tranquillo,
      quello nel ramo dei fori **pieni**; e `Number.isFinite` **non basta**,
      perché `+null` fa **0**, che è finito — il `null` va nominato per nome.
      ⚠️ Uno zero **misurato** resta `0`: è un fatto, non un'assenza.
      ⛔ Nessuna soglia toccata (133 dB(L), curve USBM/DIN, K e β).
      ⏱️ **Resta aperto e dichiarato**: `k.qtot` porta lo **stesso zero** — col
      `kg` illeggibile la scheda scrive «Carica totale (kg);0». Alimenta costi,
      margine e €/m³, quindi è un cantiere suo.
      ⛔ **IL TESTO QUI SOTTO È COM'ERA QUANDO IL DIFETTO ERA APERTO** —
      `computeMIC()` su un progetto **senza fori disegnati** risponde la carica
      di **un** foro, cioè il valore più basso possibile, cioè la PPV più
      tranquilla. Misurato sul progetto di partenza (60 kg/foro, recettore
      300 m, K=1140, β=1,6): 12 fori sullo stesso ritardo → MIC 720 kg → PPV
      **23,95 mm/s**; nessun foro → MIC 60 kg → PPV **3,28 mm/s**, cioè
      **7,3 volte più bassa**. È «l'assenza di un dato non è un dato
      favorevole» nella sua forma classica, sul numero con cui si decide se una
      volata si può sparare.
      **Raggiungibilità misurata**: cinque punti di chiamata generano la maglia
      prima, ma **otto chiamate a `computeKPI()` no** — `cmpSave`, il CSV,
      `_riconCampoHtml`, `riconRender`, `riconSave`, `sigRender`, `volSnapshot`,
      `simulaPerforazione`. La cura giusta è `null` («non calcolabile») con i
      lettori che lo sanno leggere, ed è **un cantiere a sé**: la prova nuova
      intanto lo **fissa e lo nomina** invece di lasciarlo dedurre.
      ✅ **PRIMA FETTA PORTATA FUORI il 09/08: `interpProf` (blocco G9).**
      166 → **165** funzioni nella pagina, e il numero è di nuovo **derivato**
      dal comando, non ricopiato. Non è la più grossa: è quella che **pesa di
      più**, perché dice di quanto il fronte si scosta dal piano verticale a una
      certa distanza, e da lei dipendono la posizione dei fori sul disegno 2D e
      la **burden reale** di ognuno — quanta roccia ha davanti — che è il numero
      con cui si decide una carica. Nella pagina **nessuna prova poteva
      chiamarla**; adesso ne ha **cinque**, e la quinta è quella che conta:
      *«è USCITA dalla pagina, non copiata»*, cioè la trappola del trasloco che
      lascia la vecchia copia dentro e importa anche la nuova — la pagina
      userebbe la sua e le altre quattro blinderebbero una funzione che nessuno
      chiama.
      ⚠️ **Trasloco, non miglioria**: il corpo è arrivato parola per parola.
      Quello che è cambiato è che adesso il suo comportamento è **scritto**
      invece che dedotto — profilo vuoto → 0, fuori dal rilievo **non si
      estrapola** (estrapolare la quota di un fronte oltre dove qualcuno è
      andato a misurare vorrebbe dire inventare la roccia), l'ordinamento si fa
      **dentro su una copia**, e due punti sulla stessa `x` non producono `NaN`.
      ⛔ **E IL CENSIMENTO È OTTIMISTA, misurato aprendo la sua lista.** Fra le
      «25 che si portano fuori come sono» ce ne sono che **non vanno in un
      modulo dati**: `nomeCampoD2` fa `el.closest('label')` (prende un elemento
      del DOM come **argomento**, quindi il filtro sul `$(...)` non la vede),
      e `skyTexture`/`softTexture` creano una `<canvas>`. Il criterio «nessuna
      variabile del modulo e nessun `$(...)`» è giusto per dire *dove vive lo
      stato*, non per dire *dove può vivere la funzione*: la seconda domanda —
      **tocca il DOM in qualunque modo, anche ricevendolo?** — non è ancora
      nel righello, ed è dichiarata qui invece di far credere che le 25 siano
      25.
      ✅ **SECONDA FETTA, blocco G10: `_sentNum` e `isoColore`.** 165 → **163**
      funzioni nella pagina, `run-kpi` 1928 → **1932**. Tutt'e due decidono
      qualcosa che **esce** o che si **guarda**, e nessuna prova poteva
      chiamarle:
      · `_sentNum` scrive i numeri nel file che Genesi consegna a
        **Sentinella**, e porta il principio del fondatore dentro un file che
        passa fra due app: un valore che non si legge esce **vuoto**, non «0»
        — uno zero in una colonna di PPV si leggerebbe «misurato, ed è zero».
        La prova che dà senso a tutte le altre è quella sullo **zero vero**,
        che deve restare «0»: se anche lui uscisse vuoto la regola non
        distinguerebbe più le due cose. E l'arrotondamento a quattro decimali
        non è cosmetico — senza, `0,1+0,2` finirebbe nel CSV come
        `0.30000000000000004`;
      · `isoColore` dà il colore di un'isocrona, con saturazione e luminosità
        che **calano** insieme: si prova la monotonia, non i tre numeri.
      ⚠️ **E la seconda domanda ha già scartato un candidato**, che è la prova
      che serviva scriverla: `riconStorico` legge `localStorage`, quindi nel
      modulo non ci va — e il commento della pagina lo diceva già («restano qui
      `riconStorico`, `riconSave`… che leggono `localStorage`, il DOM o lo
      stato del progetto»). Il censimento la conta fra le 25: sono **tre** i
      motivi per cui quel numero è ottimista — il DOM ricevuto come argomento,
      la `<canvas>` creata, e ora lo **stato del browser**.
      ⛔ **E ALLORA LA TERZA FETTA NON È STATA ALTRO CODICE SPOSTATO: È IL
      RIGHELLO.** Aperti a mano tutti i candidati rimasti, **quasi nessuno era
      un trasloco** — otto leggono `localStorage`, due creano una `<canvas>`,
      due maneggiano THREE, una ferma nodi Web Audio, una riceve un elemento
      del DOM. Continuare a estrarre dalla lista voleva dire lavorare dove non
      si può; correggere la lista vale per tutte le volte dopo.
      `genesi-estraibili.mjs` fa adesso la **seconda domanda** — *tocca il DOM
      in qualunque modo, anche ricevendolo, o l'ambiente del browser?* — e la
      **propaga per chiamata**, perché senza propagazione rispondeva di no a
      metà dei colpevoli (`sitoLegge` chiama `sitoStore`, `gvv` chiama
      `gLeggi`).
      **Effetto sui numeri, che è il punto:** «si portano fuori come sono»
      **23 → 6**, ed estraibili in totale **81 → 62**. Delle 6 rimaste, aperte
      una per una, **solo `_sentOggi` è davvero pura** — ed è un alias di una
      riga di `shared/`, quindi non serve. **La colonna è esaurita**: il
      cantiere che resta sono le **56** che leggono una o due variabili del
      modulo, cioè un **cambio di firma**, non un trasloco.
      ⚠️ E il righello **dichiara quello che ancora non vede** invece di
      stringere a metà: le tre cause rimaste (uno stato in un `let` che
      l'euristica salta, un oggetto THREE ricevuto come argomento, una funzione
      di libreria) non si distinguono senza sapere i **tipi**, e un righello «un
      po' meno sbagliato» è peggio di uno che dichiara il suo dubbio — regola
      già pagata su `contrasto.mjs`.
- [x] ✅ **IL GIRO DEL 09/08 LETTO CON `leggi-giro.mjs` — UN SOLO KO VERO, E ERA
      GIÀ CHIUSO QUATTRO ORE DOPO.** Lettura **parziale**: il giro era ancora
      vivo quando l'ho letto, e lo strumento lo dichiara da sé («né una riga
      *USCITA* né il conto finale: il giro NON è arrivato in fondo»).
      Il denominatore, che è la parte che rende leggibile tutto il resto:
      **177 passate lette — 87 controprove (il loro rosso è VOLUTO), 90 sane**,
      **918 KO voluti tenuti fuori**, **74 righe «non ho guardato»**, e
      **KO veri: 1**.
      ⛔ Senza quella separazione il registro dichiara **919** rossi. Con essa,
      **uno**. È la ragione per cui `leggi-giro.mjs` esiste, ed è la stessa
      trappola che il 07/08 aveva fatto aprire un cantiere su dieci difetti
      inesistenti.
      L'unico KO vero: *scudo @320 «Verifica periodica · Autogru 3»: la tendina
      `#vf-ente` mostra «Soggetto pubblico o privato abilitato» tagliato — chiede
      254 px in 214*. **Chiuso da `1040c23`** lo stesso pomeriggio, cioè
      **prima** che il giro arrivasse a stamparlo: adesso la voce è «Soggetto
      abilitato» (172 px) e la parola di legge dell'art. 71 c.11 sta per esteso
      nella nota che va a capo.
      ⚠️ **E la sezione 0 va letta prima di tutto**: il giro attesta `c6694e7` e
      il branch è avanti di **37 commit, di cui 18 toccano le superfici
      misurate**. Ogni KO lì dentro è vero **a quel commit**, non adesso — e
      questo ne è la dimostrazione, non un'ipotesi.

- [x] ⛔ **B0-quater. SORVEGLIANTE E SORVEGLIATO SBAGLIAVANO INSIEME — ed è la
      ragione per cui nessun banco l'aveva mai visto.** È la scoperta più grossa
      del 09/08, e non è un difetto in più: è una **famiglia nuova**.
      `accorciaVoceTendina` di Sentinella accorcia una voce contro un budget di
      pixel. Quel budget lo calcolava `adattaVoci()` così:
      `const spazio = s.clientWidth - paddingLeft - paddingRight;` — cioè **la
      formula identica, carattere per carattere**, che `modali-dentro` usava per
      **giudicare** se la voce ci stesse. Comando: `git show b1cb14c~1:
      apps/sentinella/index.html | grep -n 'clientWidth - .*padding'` → la riga
      c'era, nel **prodotto**.
      ⛔ **Quindi il prodotto accorciava con un righello cieco di 20 px e il
      banco lo assolveva con lo stesso righello cieco.** La frase non era
      sbagliata e nemmeno la funzione: era sbagliata **la misura**, e i due si
      davano ragione a vicenda. **Un errore condiviso fra chi misura e chi è
      misurato è invisibile per costruzione** — nessuna quantità di prove lo
      trova, perché le prove sono d'accordo col difetto.
      ⚠️ Il budget vero contro quello usato: 320 px → **194** invece di 214;
      360 → 234 invece di 254; 390 → **264** invece di 284; 430 → 304 invece di
      324. L'ingombro non testuale è 48 px (28 di padding + 20 di freccia e
      bordi), e il codice ne toglieva 28.
      ⚠️ **La domanda da farsi d'ora in poi**, quando un banco assolve qualcosa
      che a occhio non torna: *il prodotto e il banco stanno usando la stessa
      formula?* Se sì, il verde non vuol dire niente. La cura è un **righello
      indipendente** — qui `tendine-nelle-finestre`, scritto separatamente, che
      infatti dà lo stesso verdetto con un pixel di scarto.
      ⛔ **E LA CORREZIONE FACILE ERA IL VERDE FALSO, sull'altro difetto.** Nel
      core il banco accusava l'etichetta «— nessuna —» (150 px in 142), che è
      **nostra**: accorciarla avrebbe fatto tornare **verde il banco** lasciando
      tagliati i due **nomi di cava** — «Cava Monte Serra» chiede 178 px, «Cava
      Valle Secca» 174 — cioè **il dato dell'utente**. La causa vera era la
      **scatola**: `.frow` è una griglia `1fr 1fr` che si ripiega solo sotto i
      360 px, quindi a 390 la tendina è larga **142**. Tolto quel contenitore
      attorno a Data e Cava: 0 tagliate su 3 a tutte e quattro le larghezze.
      ⚠️ E il limite dei 360 px **non** è stato toccato: `.frow` la usano **54
      righe** del core, quasi tutte con due campi corti che in due colonne stanno
      benissimo. Allargarlo per tutti avrebbe allungato cinquantatré moduli per
      sistemarne uno.
      ⚠️ **Regola che ne esce, piccola e cara**: quando si corregge un righello,
      si rileggono **i numeri che quel righello aveva scritto in giro** — nei
      commenti c'erano misure vecchie («289,6 contro 284 disponibili») che
      raccontavano la versione sbagliata **con la faccia della misura**.
      ✅ Soggetti guardati da `modali-dentro`, prima e dopo: core 38 modali · 176
      aperture · 3.636 elementi · 530 comandi, Sentinella 11 · 50 · 594 · 140 —
      **identici**, KO **1 → 0** su tutt'e due. Il banco è verde perché i difetti
      non ci sono più, non perché guardi meno roba.
      ✅ **E LA FAMIGLIA È CHIUSA, non solo il caso — censita subito dopo, che è
      la domanda che una famiglia nuova impone**: *quella formula cieca è usata
      altrove?* Comando:
      `git grep -n 'clientWidth *-' -- index.html 'apps/<app>/index.html'
      'shared/<x>.js' 'apps/deepwork-id/tests/browser/<b>.mjs'` (scritto con i
      segnaposto perché la stellina seguita da una barra chiude un commento).
      **Undici occorrenze, e nel prodotto ne resta ZERO che calcoli qualcosa**:
      le due in `apps/scudo/index.html` e `apps/sentinella/index.html` sono i
      **commenti** che raccontano il difetto corretto, le altre stanno nei banchi
      — e l'unica che *calcola* è in `tendine-nelle-finestre.mjs`, tenuta
      **apposta** come righello «vecchio» per stampare a ogni giro **quanto è
      larga la banda cieca**. Cioè la formula sbagliata sopravvive solo dove
      serve a misurare sé stessa.

- [x] **B0-quinquies. `#sm-cava` DEL CORE — l'altro dei due tagli, e NON è detto
      che si corregga con la parola.** ✅ *Chiuso: la correzione era **già** in
      `b1cb14c` (18:09), e la scatola era davvero il colpevole — Data e Cava
      tolte dalla `.frow`, quindi 142 → **312 px** a 390. Questa riga è nata in
      `8df983b` alle **21:29**, tre ore e venti DOPO, leggendo il commit vecchio
      (`7717de1`, 17:49): è il «non c'è» **scaduto** di `CLAUDE.md` nella forma
      peggiore — e la riga sotto, che si lamentava che il difetto «viveva solo
      in un messaggio di commit», descriveva senza saperlo anche la sua
      correzione.*
      ⛔ **E il perché dei 142 px non era «metà della riga»: era il campo
      accanto.** Chiesto alla griglia con `min-content`, non dedotto:
      `input[type=date]` ha min-content **161 px** e non sa stringersi (tre
      caselle e l'icona del calendario le disegna il browser); a 390 la riga
      vale 312 meno 9 di gap = **303**, e `1fr` è `minmax(auto, 1fr)` — la data
      si tiene i suoi 161 e alla tendina resta **303 − 161 = 142**. Predetto
      142, misurato 142. Chi divideva per due sbagliava di 9,5 px e cercava nel
      posto sbagliato.
      ⚠️ **E il difetto viveva anche a 430**, dove `modali-dentro` non guarda
      (gira a 390 e 320): lì «— nessuna —» ci stava e a essere tagliati erano i
      **due nomi di cava**. Accorciare la parola avrebbe fatto tornare verde il
      banco lasciando in piedi il taglio del **dato** — cioè la prova che la
      correzione ovvia era quella sbagliata.
      **Soggetti guardati, prima e dopo** (`modali-dentro --solo=core`): KO
      1 → **0**; aperture 176 = 176, voci 106 = 106, comandi 530 = 530;
      elementi 3642 → 3636, e i **sei** in meno sono i tre `<div>` di sola
      impaginazione moltiplicati per le due larghezze — non «vinto misurando di
      meno». Bersagli di tocco rimisurati: 6 × 4 larghezze, **zero** sotto
      44×44.

      ⏱️ *Il testo originale della riga, tenuto perché è la misura di com'era:*
      Trovato il 09/08 dal righello di
      `modali-dentro` una volta corretto: nella finestra «Nuovo sismogramma» la
      voce vuota **«— nessuna —»** chiede **149 px in 142** a 390. Da `7717de1`
      il banco è **rosso lì**, di proposito.
      ⚠️ **Sta scritto qui perché finora viveva solo in un messaggio di commit**,
      che è il posto dove le cose si perdono: `grep -c 'sm-cava'` sulla roadmap
      dava **0**.
      ⛔ **E la correzione ovvia probabilmente è quella sbagliata.** «— nessuna —»
      è **già** la forma più corta della convenzione dell'ecosistema
      («— nessun esito —», «— nessun verbale —»): accorciarla vorrebbe dire
      rompere la convenzione per sette pixel. Il numero sospetto è **l'altro**:
      la tendina è una `.finput` **a tutta larghezza** dentro una modale, e a
      390 px di schermo la sua scatola è **142**. Prima si chiede **perché è
      così stretta** — `getComputedStyle`, non deduzione — e solo dopo si decide
      fra la parola e la scatola.
      ⚠️ Il precedente da non ripetere: il 07/08 una diagnosi scritta con
      sicurezza e **dedotta invece che misurata** ha mandato il cantiere dopo a
      non provare la strada giusta.
      **Come si misura**: `modali-dentro.mjs --solo=core` deve tornare verde
      **senza che i soggetti guardati calino** (aperture, elementi, voci,
      comandi).

- [ ] **B0-septies. CHE COSA DISEGNA UNA PIANTA SENZA MAGLIA — i ripieghi
      rimasti, e sono una DECISIONE, non un trasloco.** Cinque funzioni di
      disegno tengono ancora `D2.S||3.5`, `D2.B||3`, `D2.prof||10`:
      `computeEnergia2D`, `computeSeq2D`, `computeRelief2D`, `_spazTipico`,
      `drawInnesco`. Sono la ragione per cui, con la spalla illeggibile, **la
      maglia degenera a un burden di 0,3 m** — ed è da lì che nasceva l'8,33
      kg/m³ che accusava dodici fori.
      ⚠️ **Non è la stessa cosa dei numeri**: un numero che non si può calcolare
      si dichiara «non calcolabile» e chi lo legge lo capisce. Una **pianta** non
      può dichiararsi: o disegna qualcosa, o non disegna niente. Quindi la
      domanda è di prodotto, non di codice — *che cosa vede l'utente che apre il
      2D di una volata a cui manca la maglia?* Una pianta vuota con una frase, o
      la maglia di progetto dichiarata come proposta?
      ⛔ Farla a metà è la trappola: se le cinque divergono, la pianta e i numeri
      raccontano due volate diverse.
      **Come si misura**: apri una volata con `design.B:null` e guarda il burden
      dei fori disegnati — se è 0,3 m, il difetto è ancora lì.

- [x] **B0-nonies. CON L'INTERASSE ASSENTE LA PAGINA DI GENESI *MUORE*, E IL
      MESSAGGIO CHE DOVEVA SPIEGARLO NON ARRIVA MAI.** ✅ *Chiuso il 10/08.*
      **Misurato** (server proprio, contrassegno del pid riletto, caso nei dati
      e iniezioni nella risposta HTTP — il file di prodotto mai toccato):
      con `design.S:null` la scheda validatori passa da **0 righe a 28**, gli
      errori di pagina da **1 a 0**, e il toast da **`""`** a una frase che
      **nomina l'interasse**. Sulla volata sana le 28 righe sono confrontate a
      macchina prima/dopo: `diff -u` → **identiche, non è cambiato un carattere**.
      ⚠️ *La riga diceva «29 righe invece di 0»: sono **28**, misurate tre volte.*
      ⛔ **Perché moriva `S` e non `B`, `n`, `Lm`, e non è «per caso»**: quelli
      escono dalle coordinate dei fori, che sono sempre numeri (`c*null` fa 0, la
      maglia degenera ma i `.toFixed` reggono). `Sm` era **l'unico che ripiegava
      su un dato di progetto grezzo**. La guardia scritta è più stretta di quella
      proposta — `Number.isFinite(D2.S)` invece di `Sm===null` — perché la forma
      proposta reggeva su `null` ma **non** su `''`, `undefined` o una stringa,
      che scoppiano identiche. E l'uscita «senza fori», che restituiva `D2.S`
      grezzo, è stata normalizzata: **due uscite con due contratti sono una copia
      più debole**.
      ⛔ **Il toast spostato PRIMA del disegno non era dimostrabile sul caso di
      partenza** (col `.toFixed` chiuso arriverebbe comunque): è difesa in
      profondità, la seconda lettura di «non distingue». Dimostrata a parte con
      un **guasto finto** dentro `renderScheda2D` — ordine nuovo: il messaggio
      arriva lo stesso; ordine vecchio: `"[]"`. *Una dichiarazione che dipende
      dalla riuscita del disegno è una dichiarazione che il prossimo guasto del
      disegno cancella.*
      ⛔ **E il «Rapporto S/B» non era un numero tranquillo: ACCUSAVA** — «maglia
      stretta in larghezza», cioè dava la colpa alla maglia per un campo che
      nessuno aveva compilato; il badge non poteva vederlo perché `null/3` fa
      **0**, finito, dentro la fascia bassa. Ora la domanda è sugli **operandi**.
      Il motivo «non calcolabile» non è stato ricopiato: alla riga che c'era
      mancava **un parametro** (la coda), non un gemello — `nonCalcolabile(lab,
      why, coda)` ha assorbito anche le **quattro copie a mano** già presenti
      nella stessa funzione: markup scritto **1 volta, 7 chiamanti**.
      **Prove**: 4 in `run-kpi` (2034 → **2038**). ⚠️ *Il cantiere prevedeva
      «+43»: `run-kpi` conta i `test(`, non le asserzioni. Il numero giusto
      è +4, e va scritto qui perché la prossima consegna non lo rifaccia.*
      Iniezioni: **5, tutte a segno**, 195 caratteri — e una cambia **zero
      caratteri** (uno scambio di posizione), il caso in cui la conta mente.
      ⏱️ **Restano misurate e NON toccate, per B0-septies**: con l'interasse
      assente i fori finiscono tutti a `mx 0`, quindi il MIC passa da 58 a **696
      kg** (tutti e dodici insieme) e la PPV al recettore da 6,4 a **44,0 mm/s**.
      Genesi *accusa* una volata con numeri nati da una maglia che nessuno ha
      scritto. E nel caso `design.B:null` restano «Spalla/Ø **0·Ø**» con la
      spiegazione falsa, e «Rigidità H/B» con **pallino rosso e spiegazione
      vuota**.

      ⏱️ *Il testo originale della riga:*
- [x] **B0-nonies (com'era, e resta per la MISURA — non è lavoro da fare: la
      chiusura sta più su in questo file). CON L'INTERASSE ASSENTE LA PAGINA DI GENESI MUORE, E IL
      MESSAGGIO CHE DOVEVA SPIEGARLO NON ARRIVA MAI.** ⏱️ *Trovato il 09/08
      misurando i campi di B0-sexies; **pre-esistente**, non nato oggi
      (`git show aec46eb^:apps/genesi/genesi.html | grep -n "isFinite(Sm)"` dà
      la stessa riga).* In `measureGeom2D`: `if(!isFinite(Sm)) Sm=D2.S;` e poi
      `S:+Sm.toFixed(2)` — con `D2.S` assente `Sm` diventa `null` e il
      `.toFixed` è un **TypeError**: `measureGeom2D → renderScheda2D → draw2D →
      setScreen` si spezza, la scheda validatori esce a **0 righe** invece di
      29.
      ⛔ **E il danno peggiore è il secondo**: il toast di `volataSenzaValori` —
      quello scritto apposta per dire *«un valore non si legge»* — sta nella
      riga **dopo** `setScreen('design')`, quindi non viene mai eseguito.
      Misurato: con `design.S:null` il toast è `""` e c'è 1 errore di pagina;
      con `design.B:null` (che non passa di lì) il toast compare regolarmente.
      Cioè la difesa costruita per l'assenza **è disinnescata proprio dal caso
      che deve coprire**.
      ⚠️ La correzione ovvia — `S:(Sm===null?null:+Sm.toFixed(2))` — è stata
      provata **nella risposta HTTP** e la pagina smette di morire (28 righe, 0
      errori, nessun «NaN»), ma **lascia due numeri tranquilli**: «Rapporto S/B
      **0,00**» e «Carica consigliata **~0 kg/foro**». Le due si chiudono col
      motivo già presente due righe sopra (`if(pf===null) … 'non calcolabile'`);
      la terza cosa che resta — «12 fori · **0 m** fronte» — è la maglia, cioè
      **B0-septies**, e farla a metà è la trappola dichiarata lì.
      **Come si misura**: apri una volata con `design.S:null` e guarda se la
      scheda validatori ha righe e se il toast compare.

- [x] **B0-undecies. IL CLAMP USATO COME GUARDIA FUORI DA GENESI — censito su
      cinque app, e ne sono usciti DUE difetti veri, uno dei quali sui soldi.**
      ✅ *Chiuso il 10/08.* Censimento col comando (commenti tolti, e sulle
      pagine solo il contenuto dei `<script>`): **163 clamp, 51 di forma
      sospetta, 79 ripieghi `||` su un campo utente** — scudo 15/5, flotta
      37/13, conti 53/17, terra 26/8, sentinella 32/8. Poi il verdetto uno per
      uno: **48 clamp giusti, 2 difetti, 2 candidati aperti**.
      ⚠️ **Il denominatore dichiarato ha 52 righe contro 51 clamp sospette, e la
      riga in più È il difetto di Conti**: non è una `Math.max`, è un ternario
      che le passa uno zero. **Una ricerca fatta solo su `Math.max(` non
      l'avrebbe trovato.**
      · **TERRA** — `ritmoMedioAnnuo`: `Math.max(0.5, +anni || 0) || 3`, dove il
        `|| 3` era **codice morto** (`Math.max(0.5, x)` non è mai falso).
        Svuotando «Ritmo medio su (anni)» la finestra diventava **sei mesi** e il
        riquadro «Vita della cava» passava da «restano circa 1,6 anni,
        esaurimento verso il 2028» a «**Ritmo medio non ancora calcolabile:
        servono almeno tre mesi di rilievi elaborati**» — cioè **dava la colpa
        ai rilievi**, che coprono 8,6 mesi e ci sono tutti.
      · **CONTI** — `aggiornaNetto`: `rl.ok ? rl.valore : 0`. Il commento sopra
        prometteva già «un peso che non si legge NON diventa zero silenzioso»,
        ma **solo per l'illeggibile**; l'**assente** diventava zero. Con la tara
        vuota, su «Massi da scogliera» a 15,50 €/t: netto **32,50 t** e «Valore
        della consegna **€ 503,75**» dove il vero è 18,30 t / € 283,65 —
        **€ 220,10 di troppo, +77%**, su un riquadro che prepara un documento
        fiscale. Adesso il netto dice «—» e la frase nomina **quale** peso manca.
      ⛔ **E le quattro prove su `ritmoMedioAnnuo` che c'erano già restano VERDI
      col difetto rimesso**: è la misura di quanto quel buco fosse scoperto.
      Le quattro nuove (`run-kpi` 2042 → **2046**) sono metà e metà: due sanno
      fallire, due dichiarano il contratto che **non** doveva cambiare — sono
      quelle che impediscono la «correzione facile» `+anni || 3`.
      ⚠️ **La parte di Conti non ha una prova pura, e va detto**: `nettoPesata`
      non è cambiata (è giusta), il difetto era **nella pagina** — la famiglia
      «le prove chiamano il modulo e i file li compone la pagina».
      ✅ **Il banco che lo preme è stato scritto il 10/08** dentro
      `conti-numeri-tranquilli.mjs` (nessun file nuovo: il banco di Conti c'era
      già e non guardava lì): **quattro stati del modulo pesata** — senza tara,
      senza lordo, coi due, intonso — e **otto asserzioni**, da 20 a **28 ok**.
      La controprova rimette il difetto in due pezzi e riproduce i numeri esatti
      del racconto: con la tara vuota il netto torna **«32,50»** invece del
      trattino, col lordo vuoto il campo si riempie da solo di **«0,00»**.
      ⚠️ E **due** delle otto NON cadono con il difetto dentro, di proposito:
      sono la metà che dichiara il contratto che **non** doveva cambiare (coi
      due pesi il netto resta 18,3; sul modulo intonso il riquadro tace). Un
      banco in cui cadono tutte è un banco che non distingue «non calcola» da
      «non calcola mai».
      ⏱️ **Proposta per `shared/`, non fatta**: `valoreCampo` adesso servirebbe a
      **due** app, quindi il suo posto è `shared/dw-ponti.js` con Genesi che la
      **ri-esporta** con lo stesso nome (alias, non seconda implementazione) e il
      test che pretende l'**identità**. Intanto Terra è stata corretta **senza
      copiare la funzione**: due righe di guardia in loco.
      ⏱️ **Candidato aperto, dichiarato e non misurato**:
      `apps/conti/conti-data.js` — una fattura importata **senza importo** esce
      in silenzio dall'estratto conto e dal sollecito (`apertoDi(f) > 0` la
      filtra). Serve costruire l'import CSV con la colonna vuota.

- [x] **C1. «undefined» DISEGNATO SUI FORI, E «UNDEFINED FILE» NELLA STRISCIA
      DEI KPI — visti in uno SCATTO, non leggendo il codice.** ⏱️ *Trovati il
      10/08 guardando l'immagine della schermata «Sequenza sparo» del core,
      mentre si verificava un'altra correzione.*
      Con una volata i cui fori non hanno il ritardo, il disegno 2D scrive
      **`undefined`** accanto a ogni foro lungo il fronte, e la striscia dei KPI
      sopra il pannello dice **«UNDEFINED FILE»**. È la famiglia già raccolta in
      `CLAUDE.md` — «undefined/undefined/boh» stampato a schermo in 58 punti di
      una pagina — nella sua veste peggiore, perché **non è un numero
      sbagliato: è una parola inglese in un prodotto italiano**, e chi la vede
      pensa che l'app sia rotta.
      ⚠️ **Non è la scena di prova**: la scena è stata resa realistica (numero
      della volata, fori numerati di seguito) e le due scritte **restano**. Le
      due righe della lista dei fori, invece, dicono già «—»: è di nuovo la
      stessa pagina che si racconta in due modi.
      ✅ **Chiuso il 10/08, commit `4263c6d`** — e non cercandola nel codice: una
      sonda ha camminato i **nodi di testo del DOM** e ha detto dove sono, sei
      `<text>` in `#ec-canvas` e un `<b>` in `#ec-stats`. I due punti stavano
      dove nessuna regex li avrebbe accostati (il numero di **sequenza** mai
      assegnato, e il numero di **file** della maglia).
      ⚠️ E il numero di sequenza era scritto in **due** punti del file — la vista
      del fronte e quella della galleria: l'`assert` sul numero di occorrenze ha
      fermato la sostituzione, che ne cercava una. Senza, avrei corretto **metà
      difetto** senza accorgermene, perché le due viste non si aprono insieme.
      La correzione sta in **una funzione sola** (`seqDetta`), e lo zero resta
      zero in tutt'e tre i punti: è un valore vero, non un'assenza.
      Il banco adesso lo pretende: «nessun «undefined» a schermo (0 nodi)», con
      l'elenco dei colpevoli stampato quando ce ne sono.

- [x] ✅ **B0-terdecies. FLOTTA NON AVEVA IL SUO BANCO «NUMERI TRANQUILLI» — e
      appena scritto ne ha trovati due.** *Chiuso il 13/08.*
      Non è nato da un sospetto sul codice, ma **dall'elenco dei controlli**:
      sei app su otto avevano il loro banco della famiglia, Flotta no. È la
      regola della settimana applicata a sé stessa — *un numero è sorvegliato
      solo dove il controllo ARRIVA*, e l'elenco di dove arriva va guardato
      quanto il numero.
      ```sh
      ls apps/deepwork-id/tests/browser/ | grep numeri-tranquilli
      campo · conti · genesi · scudo · sentinella · terra      (Flotta: niente)
      ```
      ⚠️ **La prima cosa misurata è stata che il MODULO non ha difetti**:
      ventotto chiamate a `flotta-data.js` con l'assenza al posto del dato non
      hanno prodotto un solo numero inventato — ogni zero tranquillo uscito era
      una decisione scritta e motivata nel file. I due difetti stavano nella
      **pagina**, dove il documento si compone, e sono **tutti e due la quarta
      copia di una regola già scritta nello stesso file**:
      · **«quanto costa un'ora»: la riga che si spezzava in due «ma».** Il
        totale si incollava davanti al perché con un `, ma ` e l'iniziale
        abbassata; funziona per quattro dei cinque `perche` di
        `costoOrarioMezzo`, e il quinto è già fatto di due parti. A schermo:
        «€ 300,00 spesi, **ma** le ore lavorate si sanno, **ma** nessuna delle
        spese che cadono in questo periodo porta il suo importo». Due «ma», e
        per chi legge una contraddizione (i 300 € ci sono: cadono fuori dal
        periodo coperto dal contatore). La **pagella**, ottocento righe più
        sotto, sullo stesso mezzo e con lo stesso `perche`, la scriveva già
        giusta. Il caso entra da un tocco: due pieni col contatore, il secondo
        col campo della spesa lasciato vuoto;
      · **«€ 0,00» sulla lista dei costi** dove l'importo non è mai stato
        scritto — `eur(null)`. La stessa decisione era già presa **tre volte**
        in questo file (il registro interventi la pastiglia non la disegna, il
        libretto scrive «costo non scritto», il CSV degli interventi lascia la
        cella vuota, col perché per esteso: *chi apre il file in un foglio
        quello zero lo SOMMA credendolo misurato*). Corretti insieme la riga,
        il CSV dei costi e le due finestre di conferma.
        ⚠️ **Onestà su da dove nasce una voce così**: dai form di Flotta non
        nasce (`grep -n "parseCostiCsv" apps/flotta/flotta-data.js` → niente;
        «Registra spesa» pretende un importo maggiore di zero; la voce
        «Carburante» si crea solo `if (v.euro > 0)`). È il record scritto
        altrove o prima — la specie di `m6` senza `tipo` e `n1` senza `stato`,
        che la dimostrazione porta apposta.
      Banco nuovo `flotta-numeri-tranquilli.mjs`: **24 passate, 0 cadute**;
      controprova **20/5** (i difetti rimessi la fanno cadere). Iscritto in
      `tutti.mjs`: esecuzioni **186 → 188**, file di banco **77 → 78**.

- [ ] **B0-quaterdecies. IL TEMA CHIARO DEL CORE NON È MAI STATO MISURATO PER
      IL CONTRASTO — e la riga che lo dice porta la ragione SBAGLIATA.**
      ⏱️ *Trovato il 13/08 leggendo le righe «non ho guardato» del giro del
      browser, che in questa casa si leggono PRIMA dei KO.* Il banco del
      contrasto stampa, per il tema `chiaro` e per il tema `sole`:
      > ⚠️ core non ha il tema «chiaro»: la classe viene tolta dalla pagina
      > stessa. NON misurata.
      e conta **8 superfici su 14 non misurate** in ognuno dei due temi.
      ⛔ **Per il `sole` la frase è vera; per il `chiaro` è falsa.** Il comando e
      la sua uscita:
      ```sh
      grep -n "body.light-mode{" index.html        →  7971
      grep -n "function temaChiaro" index.html     →  1340
      ```
      Il core il tema chiaro **ce l'ha** (`applyTheme` fa
      `classList.toggle('light-mode', temaChiaro())`); quello che non ha è
      `window.dwTema`, cioè l'interruttore **condiviso** che il banco usa per le
      app. Il banco chiede «questa superficie sa che cos'è questo tema?» e
      risponde giusto alla sua domanda — ma la frase che stampa dice un'altra
      cosa, e chi la legge conclude che non ci sia niente da misurare.
      ⚠️ Il tentativo precedente è **documentato nel banco** e va letto prima di
      rifarlo: appiccicare la classe non funziona, perché il programma del core
      sta in un `<script type="module">` e `applyTheme` non è su `window` — così
      il banco misurò il core in un tema che non poteva avere e sputò decine di
      KO falsi.
      **La via che regge**, ed è quella che gli altri banchi del core usano già:
      si passa dai **dati**, non dalla classe. Nel servito, `index.html:262`
      dichiara `theme:'dark'` dentro le impostazioni di partenza: sostituendolo
      con `theme:'light'` il core entra nel suo tema chiaro **dalla propria
      porta**, e `applyTheme` lo conferma invece di toglierlo. Poi si misura, e
      la riga «non misurata» resta solo per il `sole`, che il core davvero non
      ha (il suo foglio lo dichiara: «Il core ha DUE temi, scuro e chiaro»).
      **Perché conta**: è la superficie che il fondatore mostra per prima, ed è
      la stessa famiglia che l'08/08 fece passare 41 → 182 classi misurate e
      **sei difetti di contrasto veri nel core** che nessun banco aveva visto.
      ⚠️ E la lezione oltre al caso: **una riga «non ho guardato» va letta anche
      nella RAGIONE che porta, non solo nel numero.** Qui il numero era giusto
      (8 superfici non misurate) e la ragione no.

      ✅ **FATTA LA MISURA, il 13/08 — e sotto c'erano SESSANTUNO testi.** Il
      banco adesso fa entrare il core nel suo tema chiaro **dai dati** (le
      impostazioni di partenza dichiarano `theme:'dark'`; servite con
      `'light'`, `applyTheme` conferma la classe invece di toglierla), e la
      sostituzione si **conta**: se non trova quel testo il banco si ferma
      invece di misurare il buio credendo di misurare il chiaro.
      Il confronto che toglie ogni dubbio sul righello — **stessa superficie,
      stessi 451 testi, stesso banco, stesso minuto**:

      | tema | testi misurati | sotto soglia |
      |---|---|---|
      | scuro | 451 | **0** |
      | chiaro | 451 | **61** |

      Cioè a cambiare non è lo strumento: è il tema. E il meccanismo si legge
      in una riga sola del foglio — `body.light-mode` ridefinisce le
      **superfici** (`--bg`, `--card`, `--card2`, `--text`, `--muted`) e **non
      ridefinisce gli inchiostri di stato**. Un verde `#66bb6a` che sul fondo
      scuro regge, su una scheda **bianca** fa **1,9:1**: sono i «35%», «69%»,
      «31%» dell'elenco. È l'immagine speculare della lezione dell'08/08 («il
      bianco su un pieno di stato non regge»): **un inchiostro di stato pensato
      per il buio non regge sul chiaro.**
      ⚠️ **I 61 non entrano in un cantiere sulla parola del banco**: l'08/08, su
      32 KO di contrasto, **quattro erano accuse false**, tutte fra i casi a
      forbice larga. Qui la forbice è stampata accanto a ognuno — `.addbtn` ha
      **5,46**, gli altri stanno sotto 0,4 — quindi si rimisurano a mano i casi
      a forbice larga e si correggono gli altri.

- [x] ✅ **B0-octodecies. CONTI: LA FATTURA CHIEDEVA AL CLIENTE LA METÀ DI
      QUELLO CHE GLI ERA STATO CONSEGNATO.** *Chiuso il 13/08, ed è il difetto
      più caro della giornata.* `valoreDdt` — nata il 03/08 **proprio** per non
      scrivere «€ 0,00» dove non è stato misurato niente — conosceva **un solo
      fattore su due**: sapeva fermarsi sulla **quantità**, e sul **prezzo**
      lasciava lavorare `imponibileRiga`, dove `+null || 0` fa zero. Rispondeva
      `{valore: 0, calcolabile: true}`: **la bandiera alzata sul caso che quella
      funzione esiste per prendere.**
      La regola giusta era già scritta **due volte nello stesso file**
      (`prezzoDaOrdine` risponde `calcolabile:false`, e il form del DDT si ferma
      con «IL PREZZO NON DETERMINABILE FERMA IL DDT»): mancava dove il documento
      è **già salvato**.
      **La porta, misurata e non dedotta**: *Pesate → «Ri-carica copia (CSV)»*.
      `csvPesate` scrive la cella del prezzo **vuota** quando il prezzo non c'è,
      e `parsePesateCsv` la rilegge `null` **di proposito** — un file ritoccato
      a mano o uscito da un altro gestionale arriva così.
      Su un DDT da 25,6 t di pietrisco rientrato senza prezzo:

      | dove | prima | adesso |
      |---|---|---|
      | DDT stampato, colonna Prezzo | `€ 0,00/t` | non indicato |
      | DDT stampato, valore consegna | `€ 0,00` | non calcolabile, col perché |
      | Registro Pesate | `€ 0,00` | `—` · «prezzo non scritto sul DDT» |
      | CSV prospetto DDT | `0` | cella vuota |
      | **fattura differita** (1 DDT sano + 1 muto) | **374,78 €**, bandiera alzata | si ferma, e dice **quale** DDT |
      | la stessa, col prezzo scritto | — | **749,57 €** |

      Cioè si chiedeva al cliente **la metà**, e niente lo diceva. E
      `righeDaPesate` **fondeva** la riga senza prezzo con le forniture a prezzo
      zero vere: il documento raccontava come «regalato» qualcosa che nessuno
      aveva deciso di regalare.
      ⛔ **E la correzione ne ha scoperto un secondo, di quelli che nascono
      dalle correzioni**: `venditePerProdotto` ricavava un conto con
      `Math.max(0, senzaDensita − nonValorizzabili)`, che reggeva
      sull'invariante «non valorizzabile è sempre anche senza densità» — vero
      finché le ragioni erano **una**. Rotto l'invariante la sottrazione non
      diventava negativa: **faceva sparire dalla riga** le consegne che un
      valore ce l'hanno. Sbagliava nella direzione tranquilla. Adesso si
      **conta**, non si deduce.
      ⚠️ Due «€ 0,00» **misurati e non corretti, con la prova che non c'è
      porta**: la finestra «Elimina costo» (quella voce non ha nessuna riga da
      cui premere la ✕) e `csvSituazioneFatture` con `importo: null` (il form
      pretende `> 0` e l'import filtra `> 0`).
      Prove: `run-kpi` **2097 → 2103**, e la controprova rimette **cinque**
      difetti e ne fa cadere **sei su sei**. Il banco `conti-numeri-tranquilli`
      aveva un'iniezione **scaduta** per via della correzione:
      `iniezioni-fresche` l'ha presa in tre secondi (356/357 → **357/357**).

- [x] ✅ **B0-septdecies. SENTINELLA: TRE COPIE PIÙ DEBOLI, TUTTE NEL PUNTO IN
      CUI L'APP *DICE* QUALCOSA.** *Chiuso il 13/08.* I file che escono erano
      **puliti** — il CSV per l'ARPA, i ricettori, le tarature, le volate, i
      referti e il report di conformità passano tutti dal modulo, verificati uno
      per uno. I difetti stavano nelle **finestre di conferma** e nell'**unità
      di misura**:
      · **«Rimuovere il punto di misura»** mostrava la soglia scritta sulla
        scheda invece di quella che vale. È il **settimo** posto della famiglia
        di `conSoglia`. Misurato sulla dimostrazione: la riga sotto il dito
        dell'utente dice «soglia **20** · dal ricettore Confine Nord — mappale
        214», la finestra diceva «(soglia **5** mm/s)». E su un punto senza
        soglia scriveva «(soglia **—** µg/m³)», il trattino con l'unità
        accanto, dove tutta l'app dice «nessuna soglia impostata»;
      · **«Rimuovere la taratura»** accusava dove il modulo assolve: il conto
        era `stato !== "coperta"`, la **quarta** copia del ciclo che
        `contaCoperture` scrive una volta sola. Misurato: la finestra diceva
        «**4 letture** non risulteranno coperte da nessuna taratura», e il
        report dopo la rimozione dichiara **zero** scoperte e 4 «senza taratura
        da confrontare» — l'avviso rosso di un difetto che non c'è, e proprio
        sul caso che il modulo documenta come «accusare l'utente di una cosa non
        misurata». ⚠️ Nel verso opposto le due risposte coincidono: il difetto
        si vede **solo dove divergono**;
      · **l'unità letta dal campo grezzo** `m.unita` invece che da
        `unitaMisura` — in cinque punti, fra cui la prima schermata. Un punto
        senza unità entra davvero (`parseMonitoraggiCsv` chiede nome, valore e
        soglia, **non** l'unità): su quello l'allerta scriveva «**41  / soglia
        40**», cifra nuda e doppio spazio, mentre il file per l'ARPA sulla
        stessa misura scrive `36.8;µg/m³;40;Attenzione`.
      ⚠️ Un «non c'è» **dichiarato con la prova**: un punto senza soglia
      collegato a un ricettore non è costruibile dall'interfaccia (il form
      pretende la soglia e l'import filtra `soglia > 0`), quindi la frase della
      finestra «Rimuovere il ricettore» oggi non può mentire. **Non toccata.**
      Nessuna soglia di sicurezza sfiorata. Prove: `run-kpi` **2092 → 2097**,
      e la controprova ne fa cadere **4 su 5** — la quinta resta verde ed è
      dichiarato perché: è una prova di **identità** fra cinque punti, sorveglia
      che la regola resti una sola, non questo difetto.

- [x] ✅ **B0-sexdecies. TERRA: IL CUMULATO E IL RESIDUO DEL TITOLO SUL FOGLIO
      CHE VA ALL'ENTE.** *Chiuso il 13/08.* La regola c'era **nella stessa
      pagina, con la sua ragione scritta dal 07/08**: senza nessuna misura sotto
      il titolo la frase diceva *«il cumulato arriva a 0 m³ — lo 0% del concesso
      — e restano 1.200.000 m³»*, tre numeri rassicuranti costruiti sul niente.
      Il **foglio stampato** e il **CSV** quella frase la scrivevano ancora,
      identica, coi suoi numeri: leggevano `residuoFineAnno != null` invece
      della bandiera `misurabile`.
      Misurato col titolo compilato e **zero rilievi** — che è lo stato del
      primo giorno d'uso, e ci si arriva compilando la scheda Titolo e premendo
      «Stampa il riepilogo»:

      | dove | prima | dopo |
      |---|---|---|
      | schermo | `—` | `—` |
      | stampa · Cumulato a fine 2026 | **0 m³ (0% del concesso)** | non misurato |
      | stampa · Residuo del concesso | **1.200.000 m³** | non misurato |
      | CSV · Cumulato / Residuo | **`;0`** e **`;1200000`** | celle vuote, col motivo nell'etichetta |

      ⛔ **E la parte che vale più del difetto: il banco scritto apposta non lo
      vedeva.** `terra-numeri-tranquilli` costruisce l'anno cieco svuotando i
      rilievi, ma la dimostrazione dichiara `estrattoPregressoM3: 880000` →
      `misurabile` resta **vero** e la sezione non veniva nemmeno attraversata.
      Il banco sorvegliava la bandiera **per ANNO** e non quella **per TITOLO**:
      *un banco che guarda il posto giusto con la fixture sbagliata risponde
      «pulito» senza aver guardato.*
      · Minore, misurato: il **verbale** arrotondava all'unità il volume copiato
        dall'atto (`n0` → `nD`), mentre il prospetto duecento righe più su
        dichiara la regola opposta — e i decimali sono raggiungibili
        (`1.200.000,50` entra come 1200000,5).
      · Un «non c'è» **dichiarato con la prova**: una quota testuale
        stamperebbe «Quota NaN m» in tre posti, ma non ci si arriva da nessuna
        porta (`parseFrontiCsv` e il form filtrano tutt'e due). Non toccato:
        sarebbe una guardia contro un caso che oggi non esiste.
      Prove: `run-kpi` **2088 → 2092**, con la controprova che rimette le due
      forme vere del difetto e pretende che il conto delle celle scoperte salga
      da 0 a 2.

- [x] ✅ **B0-quindecies. IL TEMA CHIARO DEL CORE: DA 61 TESTI SOTTO SOGLIA A
      ZERO, e la causa era UNA.** *Chiuso il 13/08.* *Aperta il 13/08 dalla misura qui sopra.* Non sono
      sessantuno decisioni: `body.light-mode` ridefinisce le superfici e non gli
      inchiostri di stato. La correzione sta nel **blocco della palette**, non
      nei sessantuno punti — ed è la stessa forma della correzione dell'08/08,
      che diede un nome al valore (`--ink-su-pieno`) con i conti scritti
      accanto. ⚠️ Prima di toccare un colore: rimisurare a mano i casi a
      **forbice larga** (`.addbtn`, 5,46) — è lì che l'08/08 stavano tutte e
      quattro le accuse false.

      ✅ **ESITO, in tre iterazioni col confronto affiancato** (stessa
      superficie, stesso banco, stessi 451 testi):

      | | chiaro | scuro |
      |---|---|---|
      | partenza | **61 sotto soglia** | 0 |
      | 1 · inchiostri di testo nominati e scuriti | **11** | 0 |
      | 2 · i colori scritti dentro le stringhe JS, il gradiente-testo | **0** | 0 |
      | 3 · passata estetica dagli scatti + pallini di sezione | **0** | 0 |

      Gli **11** rimasti dopo la prima iterazione sono la regola «un censimento
      che cerca UN nome»: il censimento cercava `color:var(--X)` e quei colori
      stavano **dentro stringhe JS** (venti punti), in due `#ef5350` scritti a
      mano, e nel **gradiente che dipinge il testo** dei numeroni — che non è un
      colore.
      ⛔ **E il caso a forbice larga aveva la causa sbagliata scritta accanto.**
      `.addbtn` **non compare in nessuna delle 26 sezioni** del core: quel
      numero esiste solo nel campione che il banco pianta. Rimisurato a mano
      nello stesso modo: a riposo fa **6,39 / 7,15 / 6,11**, forbice 1,04, tutte
      sopra soglia. Ma `1,90:1` su bianco è **alla cifra** `#ffab00` su
      `#ffffff`, e l'unico `#ffab00` che quel bottone può avere è il suo
      `:hover`. Quindi **l'accusa era vera su uno stato reale** — col dito
      sopra, in chiaro, quel bottone era illeggibile — e la riga del banco la
      attribuiva a uno scarto **fra superfici** quando lo scarto è **fra due
      stati**. Dopo la correzione: **6,16:1**.
      **La correzione sta nella palette**: undici token nuovi col conto
      misurato scritto accanto, e nel `:root` valgono `var(--…)` — così **il
      tema scuro non può cambiare per costruzione**, ed è verificato.
      ⚠️ **Una strada scartata con la misura**: scurire `--amber` dentro
      `light-mode` invece di dare un nome nuovo. `--amber` non è solo
      inchiostro — sette punti scrivono `background:var(--amber);color:#100d07`,
      dove il nero fa **10,23:1**; scurendola al minimo che serve al testo quei
      sette scendono a **3,78:1**. Sarebbe stato lo scambio di un difetto con
      l'altro.
      · Tre ambra scritti a mano **dentro** `light-mode` erano la copia debole
        di questo token, e **nessuno dei tre passava** (3,62 · 3,62 · 2,93).

- [x] ✅ **B0-novodecies. IL CONTRASTO NON TESTUALE DEL CORE ADESSO SI MISURA —
      e il banco aveva DUE difetti del righello prima ancora del prodotto**
      (`c7ae9fdf`). *La misura è chiusa; le correzioni al core sono la voce
      **B0-duovicies** qui sotto.*
      ⛔ **Le righe «non ho guardato» erano 21 e CINQUE ERANO FALSE**: `usati`
      viveva dentro il ciclo che gira **una volta per sezione**, quindi un
      selettore che vive in una schermata sola veniva dichiarato «mai comparso»
      dalle altre venticinque. Accusava cinque voci che sono **a schermo**.
      Fatta la sottrazione dopo tutte le sezioni: **21 → 16**, verdetti
      invariati.
      ⛔ **E il censimento chiedeva «sta nel DOM?» mentre la misura guarda solo
      il VISIBILE**: un soggetto reso e mai mostrato sarebbe sparito da tutt'e
      due i conti — il buco del `.toast.success` di `CLAUDE.md`. Misurato:
      `.scad-badge.warn`, `.scad-badge.danger` e `.sitem.danger` hanno **22 nodi
      ciascuno e ZERO visibili** in tutte e 26 le sezioni. Adesso il censimento
      fa la stessa domanda della misura, e quei tre **restano** dichiarati.
      Le 16 righe classificate **con la sonda, non dedotte**: 3 sono **CSS
      morto**, 3 esistono e non si vedono mai, 10 non entrano mai nel DOM.

      | tema | elementi | dipinte | con colore di stato | righe | sotto 3:1 |
      |---|---|---|---|---|---|
      | buio | 1915 | 1739 | 135 | 50 | **1** |
      | chiaro | 1915 | 1739 | 53 | 15 | **6** |
      | sole | — | — | — | — | il core non ce l'ha, **verificato** |

      ⚠️ **Il 50 del buio è gonfiato e va detto**: 33 di quelle righe sono
      `--ink-am`/`--ink-am2`, che al buio valgono *letteralmente* `var(--amber)`
      — l'ambra di marca. Le righe di stato vere al buio sono **17**.
      ⛔ **E la controprova del banco stava per essere promossa da un prodotto
      rotto**: il core **non riceve l'iniezione** (non ha i `--bar-…`, `grep -c`
      → 0 contro 3 in Campo), quindi i suoi sei KO veri avrebbero fatto dire «✓
      so fallire» a un banco che non aveva iniettato niente — la terza delle
      cinque cause. Adesso l'iniezione si conta **per superficie**.
      ⛔ **Due verdi falsi chiusi**: `--solo=` con un nome sconosciuto e «zero
      superfici misurate» uscivano **0**. Il primo l'ho incontrato di persona
      lanciando `--solo=core`: rispondeva «0 app misurate» **ed usciva zero** —
      il banco diceva «tutto a posto» proprio mentre dichiarava di non aver
      guardato niente.
      ⚠️ **Da sapere per chi legge il giro**: col core nell'elenco le passate
      225 e 226 di `tutti.mjs` diventano **rosse** su sette difetti **veri**.
      Non è una regressione. E nel giro completo del chiaro (7 superfici, 15.213
      elementi) **le sei app sono tutte a zero**: il core era insieme l'unica
      superficie **non misurata** e l'unica **con difetti** — il costo esatto di
      un elenco scritto a mano.

- [x] ✅ **IL LAVORO DI STANOTTE VERIFICATO NEL BROWSER, sulla copia immobile di
      `904b8385`.** *13/08, 22:09.* I sedici difetti chiusi stanotte erano
      provati dalle suite `node` e dai banchi lanciati **durante** il lavoro,
      cioè su un albero in cui altri cantieri scrivevano. Rilanciati i cinque
      banchi «numeri tranquilli» delle app che nessun cantiere sta toccando, su
      una `git worktree` staccata su HEAD:
      Conti **28/0** · Terra **49/0** · Sentinella **26/0** · Flotta **24/0** ·
      Campo **92/0**. Nessuna regressione.
      ⚠️ Scudo e Genesi **non** sono stati rimisurati, ed è dichiarato invece
      che taciuto: due cantieri ci stanno scrivendo dentro adesso, e un verdetto
      preso a metà scrittura non è un verdetto (regola **B0-ter**). Vanno
      rilanciati alla chiusura di quei due.
- [x] ✅ **UN AGENTE HA DICHIARATO UN LIMITE CHE NON C'ERA, e l'ho creduto per
      trenta secondi.** *13/08.* La ricerca sull'assenza dichiarata nei file di
      scambio è tornata con **tutta la metà sul mondo `[dedotto]`** e la ragione
      in fondo: «l'accesso esterno è bloccato dal proxy». Verificata da me:
      `curl https://ec.europa.eu/eurostat/` → **403 CONNECT tunnel failed**, vero;
      ma lo strumento `WebSearch` — che è **differito** e va caricato con
      `ToolSearch` — risponde, e sulla stessa domanda ha dato **otto risultati
      veri** da `sdmx.org`. La rete c'era: mancava lo strumento.
      ⛔ La regola scritta in `CLAUDE.md`: **«niente entra sulla parola
      dell'agente» vale anche quando l'agente dichiara un LIMITE**, e il mandato
      di ricerca **nomina lo strumento e vieta l'altro**. Un documento tutto
      dedotto sul mondo sarebbe entrato con la faccia di una ricerca.
- [x] ✅ **B0-duovicies. I SETTE CONTRASTI NON TESTUALI DEL CORE — e la causa
      era UNA RIGA CHE NON C'ERA.** *Chiuso il 13/08.* `--success/--warn/
      --danger` erano dichiarati **una volta sola**, nel `:root` del buio, e
      `body.light-mode` ridichiarava solo gli inchiostri dei **testi**: nel
      chiaro una striscia `var(--warn)` restava l'ambra del buio su carta
      bianca. Adesso ci sono i tre `--bar-ok/--bar-wr/--bar-dg` — i nomi che
      `shared/dw-app-ui.css` usa già — in **tutt'e due** i blocchi di palette,
      col conto misurato accanto, e 21 sostituzioni meccaniche nei punti non
      testuali. Stessa superficie, stesso banco:

      | | chiaro | buio |
      |---|---|---|
      | prima | 9 sopra / **6 sotto** | 49 / **1** |
      | dopo | **15 / 0** | **49 / 0** |

      1.914 elementi guardati e 1.739 superfici non testuali, **invariati**; le
      regole mai comparse (il denominatore) restano **16 e 18**. I testi restano
      **450/0** nei due temi.
      ⚠️ **Il `var(--…)` va ripetuto nel blocco chiaro, e la ragione è
      MISURATA**: una custom property è sostituita **dove è dichiarata**, non
      dove è usata — scritta solo nel `:root` dà il verde del buio anche sotto
      `light-mode` (provato in Chromium, non dedotto). La controprova toglie
      **quella sola riga** e i sei KO tornano **alla cifra**: 1,74 · 2,63 ×4 ·
      2,98.
      ⚠️ **Il KO del buio non era della famiglia, e il tratto accusato non era
      il peggiore.** Era l'icona di `.tile-volata`: il banco vedeva il solo
      lampo `#ffd54f` (2,45) perché **combacia per valore** con `--ink-am2`,
      mentre il corpo bianco del trivello — **sette tratti su otto** — stava a
      **2,23** e non lo guardava nessuno. La piastrella aveva già deciso il suo
      inchiostro con la misura («sull'arancione vince l'inchiostro scuro»);
      l'SVG non l'aveva seguita. Otto tratti a `currentColor`: **5,52** sul
      punto che il banco leggeva.
      ⛔ **E qui il denominatore SCENDE di uno** (135 → 134 superfici di stato),
      e va detto: quel soggetto non è a posto perché è migliorato **e**
      invisibile al banco — adesso è legato al colore del **testo** della stessa
      piastrella, che `contrasto.mjs` misura. Un soggetto sorvegliato male
      scambiato con uno sorvegliato bene, **non un KO fatto sparire**.
      · **NON corretto `--info`** (la striscia di serie di `.info-box`, 2,26 nel
        chiaro): il banco la dichiara decorativa, e `shared/dw-app-ui.css`
        spiega con la misura di sei app perché un livello per `--info` non è mai
        stato deciso. Il core aggiunge i **tre** che esistono e non il quarto:
        inventarlo qui sarebbe **divergere proprio nel nome che serve a non
        divergere**.
      · **NON corretti i PIENI**: sotto ci va `--ink-su-pieno` a 8,20 / 9,98 /
        5,56; un `--warn` scurito li porterebbe a **3,78**.
      · in più, due pastiglie in linea scrivevano ancora `color:#fff` su
        `--danger` (**3,49**): portate a `--ink-su-pieno`, **5,56**.

- [x] ✅ **B0-duovicies (seconda parte). LA BARRA IN ALTO SUL RAMO DEL TOCCO: il
      nome dell'utente cedeva al posto della ricerca, e le tre domande del banco
      non potevano vederlo.** *Chiuso il 13/08.* `barra-alto-indietro` dava «0 da
      guardare» sui due rami e i due temi — **e aveva ragione**: il danno stava
      tutto **dentro** i bordi. Col ramo `pointer:coarse` acceso e la pastiglia
      «NON SALVA», nome/ricerca in px:

      | | scrivania | tocco |
      |---|---|---|
      | 320 px | 47,19 / 37,81 | **23,42** / 61,58 |
      | 430 px | 117,88 / 57,13 | 85,91 / 89,09 |
      | 560 px | 153,39 / 69,95 | 122,31 / 106,27 |

      I **23,77 px** che a 320 px il nome perde sono **esattamente** quelli che
      la ricerca guadagna: non spazio sparito, spazio **riassegnato al
      contrario** della decisione scritta nel foglio. Causa:
      `.topbar-search-input{width:120px}` dentro `pointer:coarse` — un ramo che
      **fissa** invece di **scalare**, e che vince per posizione sui gradini per
      larghezza. **Stessa forma del tema del sole.** Tolto (resta
      `min-height:44px`, che è del **dito**), e il bordo della barra sotto i 360
      px portato da 8 a 4: **i due rami adesso danno gli stessi numeri alla
      cifra**, e a 320 px il nome passa da 23,42 a **53,44**.
      Misurato su **14 larghezze × 2 rami × 2 temi**: esce 0 · sovrappone 0 ·
      scorre 0, con **144 figli confrontati** per combinazione. E su 14
      superfici a una larghezza: 0, con «7 superfici senza nessuna barra in alto
      — **zero soggetti, NON a posto**» dichiarato.
      ⚠️ Il giro 7 superfici × 10 larghezze **non è arrivato in fondo**: ucciso
      dal suo `timeout` dopo 30 minuti. **Detto invece che lasciato credere.**
      · **QUARTA DOMANDA AL BANCO**, perché le tre che aveva erano cieche per
        costruzione: *dove una barra ha insieme l'identità e una ricerca,
        l'identità non può restare più stretta della ricerca.* Un **confronto
        fra due elementi**, non una soglia in pixel che invecchia col carattere
        e con la lingua. Controprova: rimessa la larghezza fissa, cade **8 volte
        su 10** larghezze.
      · **UN'ECCEZIONE DICHIARATA E SORVEGLIATA**: a 320 px sul ramo del tocco
        la casella è **39,56×44** invece di 44×44. Quel `width` fisso faceva
        **due mestieri** — la scala, che sbagliava, e il pavimento per il dito,
        che era giusto. Le due strade per riavere il pavimento sono state
        **provate e misurate**: `min-width:44px` rimette **4,44 px di
        traboccamento all'indietro sopra il nome** (cioè alla lettera il difetto
        che questo banco esiste per prendere), e `min-width:min-content` porta
        il nome a **11 px**, peggio dei 23,42 di partenza. Fra «nome 53,44 con
        casella 39,56» e «nome 23,42 con casella 61,58», la scala del foglio
        aveva già deciso. Sta in `TOCCHI_SCUSATI` **con la forbice 38-41 px** —
        se domani scendesse a 20 non sarebbe più lo stesso caso — e il banco
        **pretende che l'eccezione si presenti ancora**.
- [x] ✅ **B0-vicies. LA PASTIGLIA «NON SALVA» SI SOVRAPPONEVA AL NOME UTENTE —
      e la segnalazione aveva ragione sul fatto e torto sulla causa.**
      *Chiuso il 13/08.* La sovrapposizione c'era: a 430 px la pastiglia stava a
      **109,58–186** dentro un genitore che parte da **174,89** — **65,31 px
      fuori dalla scatola del padre**, **59,31 × 18 px sopra il nome**, e
      `scrollWidth == clientWidth` (430 = 430), cioè **nessun controllo
      sull'overflow poteva vederlo**.
      ⛔ **Ma non è un difetto del tema chiaro**: nel buio gli stessi numeri
      **alla cifra**. Nel chiaro si nota di più perché lì il bottone del tema è
      acceso, fondo ambra pieno, e **copre** invece di lasciar trasparire. È la
      seconda volta in una sera che un'accusa è **vera sul fatto e sbagliata
      sulla causa** (la prima è `.addbtn`): uno scatto propone, una misura
      decide — e decide anche **di che cosa** si tratta.
      · **La banda è 361→560 px**, non «430», e il peggiore è **431** (esce
        106,53), dove la ricerca risale da 74 a 130 px;
      · succede **anche senza la pastiglia**: a 431 il bottone del tema esce di
        56,81 e ne copre 44 del nome;
      · ⛔ **il ramo che conta di più non è quello che si misura per primo**:
        Chromium da scrivania **non è** `pointer:coarse`, e il blocco del tocco
        — quello che comanda su un telefono vero — **fissa** la ricerca a 120
        px. Lì il difetto arrivava fino a **320 px** (120,08 fuori, 42,77 sul
        nome), cioè proprio dove la correzione sembrava averlo chiuso.
      ⛔ **E due regole CSS non facevano niente da sempre**: le due
      `.topbar-search-input` dentro il blocco dei 360 px erano scavalcate dalla
      regola base con la **scorciatoia** `padding`, trecentocinquanta righe più
      in basso. Misurato: a 320 px `getComputedStyle` dava `padding-right:10px`.
      CSS valido, nessun errore, e **niente da leggere** — la famiglia della
      classe che nessuno dipinge.
      **Dopo**: 14 larghezze × 2 rami × 2 temi, con e senza pastiglia — **esce
      0 · sovrappone 0 · scorre 0**. Bersagli di tocco sul ramo del tocco: **0
      KO su 40**. Contrasto del core: **450 testi, 0 sotto soglia** nei due
      temi — 450 e non 451 perché a 430 px «NON SALVA» è ora un punto, e la cosa
      è **provata invece che dedotta** (a 600 px, dove il testo c'è, torna
      451/0).
      ⚠️ **Un numero provato e scartato, perché nessuno lo rimetta**:
      `flex-shrink:3` sull'identità torna a traboccare di 2,97 px a 320;
      `flex-shrink:2` porta la ricerca a 40 px sul ramo del tocco, sotto la
      soglia di un bersaglio. **4** è l'unico che dà zero a 14 larghezze per due
      rami.
      Banco nuovo `browser/barra-alto-indietro.mjs`, iscritto con **sei**
      passate: `--tocco` **legge dalla pagina** le regole `pointer:coarse` e le
      rimette in coda (31 trapiantate, **dichiarate**) invece di ricopiarle, così
      non invecchia. Controprova nei due rami: **39** e **76** casi visti col
      vecchio stato rimesso.
      ⏱️ **Arretrato lasciato dichiarato nel file**: sul ramo del tocco con la
      pastiglia accesa il nome resta 18 px a 320 — «Gi…», coi puntini, senza
      sovrapposizione né taglio. Causa: il blocco `pointer:coarse` **fissa** la
      ricerca invece di scalarla, la stessa forma del difetto del tema del sole.
      Scalarla vuol dire tagliare il segnaposto «Cerca…»: è un cantiere suo.

- [x] ✅ **B0-unvicies. IL ROSSO SCRITTO A MANO: MISURATO E *NON* UNIFICATO.**
      *Chiuso il 13/08 con un NO.* Il contrasto è stato letto sul fondo
      **renderizzato** (il velo composto sulla barra), inchiostro e fondo nello
      stesso punto:

      | | rapporto |
      |---|---|
      | buio, `#ff9a95` (il valore a mano) | **7,61:1** |
      | buio, `--ink-dg-vel` (`#ff8f8b`) | **7,05:1** |
      | chiaro (già il token) | **5,34:1** |

      Il token nel buio **peggiora di 0,56**. Passano tutt'e due la soglia, ma
      il vincolo era «se e solo se non peggiora nessuno dei due»: **la copia
      resta, dichiarata**, coi tre numeri scritti nel commento.
      ⚠️ E il commento precedente diceva «4,22:1 contro i 4,5 che servono»:
      quel numero **non si riproduce** sul fondo vero. La riga adesso chiede a
      chi lo rimette di scrivere **su che fondo** l'ha composto — un rapporto di
      contrasto senza il fondo su cui è stato composto non è una misura.
- [ ] **B0-duodecies. I CLAMP DELLE TRE SUPERFICI CHE IL CENSIMENTO NON AVEVA
      GUARDATO — core, Campo, Scudo.** ⏱️ *Censite il 10/08 con lo stesso
      comando delle altre cinque app (commenti tolti con `senzaCommenti`, sulle
      pagine solo il contenuto dei `<script>`).*

      | superficie | clamp | di forma sospetta |
      |---|---|---|
      | core `index.html` | 54 | **8** |
      | `apps/campo/index.html` | 3 | 2 |
      | `apps/campo/campo-data.js` | 27 | **19** |
      | `apps/scudo/index.html` | 3 | 2 |
      | `apps/scudo/scudo-data.js` | 11 | 5 |
      | **totale** | **98** | **36** |

      ⛔ **E «sospetta» vuol dire CANDIDATA, non difettosa**: sulle altre cinque
      app il rapporto vero è stato **48 giuste su 52 giudicate**, cioè meno di
      una su dieci era un difetto. Chi apre questa riga deve **leggere**, non
      correggere a tappeto.
      ✅ **Due già lette e ASSOLTE**, con la ragione, così nessuno le rifà:
      · `scudo-data.js` `giornateAssenza` — sembra la forma del difetto di Conti
        (`vuoto ? 0 : …`) ed è invece il contrario: il vuoto si controlla
        **prima** di convertire e i due significati sono separati per tipo
        (near-miss → 0, infortunio → `null`). È la **decisione 17** del
        fondatore, già costruita;
      · `scudo-data.js` `giorniAssenza:` nel normalizzatore — stessa cosa.
      ⚠️ **La forma più frequente di Campo è `Math.max(0, +x || 0)`**, cioè il
      ripiego **prima** del clamp: l'assenza esce **zero**. Non è
      automaticamente un difetto — Campo ha già `fermiSenzaMinuti` e la guardia
      `(fermi && senza >= fermi)`, cioè la **bandiera letta a valle** — ma è
      esattamente il punto in cui va chiesto *«questo zero lo ha scritto
      qualcuno?»*, una riga per volta.
      **Come si rimisura**: il comando è nella riga **B0-undecies**; qui cambia
      solo l'elenco dei file.

      ✅ **CAMPO LETTO TUTTO, il 13/08** — 29 righe in `campo-data.js` e 3 in
      `index.html`, una per una. **Un difetto vero su 32**, e conferma il
      rapporto delle altre app (meno di uno su dieci).
      · Il difetto è **`apps/campo/index.html:3523`**, il punto in cui si
        SALVANO i minuti di fermo digitati sull'anomalia:
        `Math.max(0, Math.round(+e.target.value || 0))`. Chi **svuota** il campo
        (o digita qualcosa che un `type=number` non accetta, e allora `.value`
        è «») scriveva nel database `fermoMin: 0`, e da lì in poi l'assenza non
        era più recuperabile da nessuno. È l'**unico** punto di scrittura
        numerico della pagina fatto così: gli altri 26 passano da
        `numeroDaCampo` o dalla guardia del vuoto.
        ⛔ E il danno si vedeva **sullo stesso foglio stampato**, in due
        tabelle a poche righe di distanza: la tabella delle causali scriveva
        «Guasto meccanico | 1 | **0 min**» *senza* la coda «N su M senza i
        minuti registrati», mentre la tabella della disponibilità, più giù,
        diceva già «2 fermi (**di cui 1 senza minuti**)». Il CSV delle attività
        usciva con `;0` — una misura, per chi apre il file e somma la colonna.
        La regola giusta era **già scritta in questo file**, sul campo «Persone»
        delle squadre (`3757`): vuoto o illeggibile → `null`. La solita regola
        scritta due volte, la seconda più debole.
        Prove: `run-kpi` **2054 → 2058** (sorgente del punto di scrittura,
        comportamento su quattro forme dell'assenza, le due tabelle dello stesso
        foglio, l'accordo file↔schermo su cinque valori).
      ✅ **SCUDO LETTO TUTTO, il 13/08** — 48 righe in `scudo-data.js` e la
      lettura delle ore nella pagina. **Quattro difetti**, e tutti e quattro
      della stessa famiglia: *una regola già scritta in casa, ricopiata più
      debole dove qualcuno doveva DIRE qualcosa*.
      · **Il cartellone «Giorni senza infortuni» scriveva `NaN`** — o taceva su
        infortuni che ci sono. `riepilogoInfortuni` sceglieva l'ultimo
        infortunio con `/^\d{4}-\d{2}-\d{2}$/`: una **forma**, non un valore.
        «2026-13-45» quella forma ce l'ha, e siccome `ultimo` si sceglie
        confrontando stringhe una data impossibile **vince sempre**. Misurato:
        infortunio vero del 01/06/2026 + una riga «2026-13-45» → `giorniSenza:
        NaN`, cioè il numero grande in cima alla schermata diventa **NaN** (e
        con la cornice gialla, perché `NaN >= 30` è falso) al posto di **73**.
        Nell'altro verso: tre infortuni con tutte le date illeggibili →
        cartellone «**Nessun infortunio registrato**» mentre la riga sotto
        contava «Infortuni: 3». Corretto con `dataISOEsiste` — che questo
        stesso file usa già in `cicloDss` e `parseInfortuniCsv` — più la
        bandiera `dataIgnota`, **letta dalla pagina**: una bandiera che nessuno
        legge non protegge niente.
      · **Gli indici IF/IG/LTIFR sceglievano le ore fra due registrazioni
        contraddittorie.** La pagina faceva `ORE.find(o => +o.anno === annoOra)`
        — la **prima** che capita — mentre il modulo si RIFIUTA di sceglierne
        una, con la ragione scritta: *sceglierne una cambierebbe il risultato
        senza che si veda*. Misurato con 20.000 e 45.000 ore registrate per il
        2026: la scheda in alto scriveva «IF 50,00 · IG 0,60 · LTIFR 50,00 su
        20.000 ore lavorate» e la scheda **subito sotto, sullo stesso schermo**,
        «per il 2026 ci sono DUE registrazioni di ore diverse: l'indice non si
        calcola». Con l'altro record per primo: **IF 22,22**. Sono i tre numeri
        che si portano in gara.
      · **La prognosi ancora aperta valeva «zero giorni»** nell'elenco degli
        eventi da analizzare (`+null` fa 0): l'infortunio di cui le giornate non
        si sanno *ancora* finiva sotto a uno da zero giorni misurati — proprio
        quello su cui l'ente chiede conto, che il commento della funzione
        promette di mettere per primo.
      · **Il fascicolo del lavoratore taceva su una nomina con la data di fine
        illeggibile**, col commento che dichiarava «è la stessa regola di
        `organigrammaSicurezza`»: la copia debole che si annuncia gemella.
        L'Organigramma la contava in `senzaData` dal 07/08; il foglio che si
        stampa per l'ispettore no. E la **quinta** copia era la testata della
        modale «Perché è successo».
        Prove: `run-kpi` **2058 → 2063**, ognuna col suo caso di controllo.

      ✅ **SCUDO — I CLAMP RICENSITI, il 13/08** *(passata diversa da quella qui
      sopra: là si guardava dove il documento si compone, qui i clamp)*, **e il
      censimento del 10/08 era vecchio di 33 clamp.** Rifatto sul commit di adesso: **44 clamp veri** (5 in
      `index.html` su 4 blocchi `<script>`, 39 in `scudo-data.js`), **38 di forma
      sospetta**, **zero difetti nei clamp** — in linea con le altre app. Tutti e
      44 letti uno per uno: i `|| 0` di Scudo stanno quasi sempre nei *lettori*
      delle bandiere (`descriviGiornatePerse`, `descriviLetturaNearMiss`,
      `avvisoGravitaMinima`), cioè sul valore **già dichiarato**, e il punto di
      scrittura della pagina (`giorniAssenza` dell'infortunio) controlla il vuoto
      **prima** di convertire — non è il difetto di Campo.
      ⚠️ **Allargare il censimento all'else-zero (`x ? y : 0`, che è il mirror
      del difetto di Conti) e a `?? 0` è stato provato e SCARTATO con la
      misura**, perché nessuno lo rifaccia alla cieca: da 44 a **81
      occorrenze**, e le 37 nuove sono **tutte** inizializzatori di
      accumulatore, comparatori di `sort` e mappe d'ordine — tranne
      `riepilogoIspezione.percento`, giudicata sana **con riserva e dichiarata**
      (con zero voci `completa` è già falsa e la pagina scrive «0 voci su 0»,
      cioè si dichiara da sé). L'allargamento non paga.
      · ⛔ **E IL DIFETTO NON ERA UN CLAMP: ERA IL SUO VICINO DI CASA** — trovato
        giudicando i due clamp di `indiciInfortunistici`, perché per dire se
        `giornateAssenza(i) || 0` fosse sano bisognava prima stabilire **chi
        entra** nell'anno. È la stessa forma che B0-undecies dichiara di sé.
        **Un infortunio di cui non si legge l'anno spariva da IF, IG e LTIFR
        senza lasciare una riga.** La scelta di chi entra si faceva con
        `String(i.data).slice(0,4) === String(anno)`: una **forma**. Un evento
        senza data non cade in nessun anno, quindi non è al numeratore di
        nessuna riga della serie — e `noto` restava `true`, cioè la bandiera che
        esiste per dichiarare i minimi dichiarava tutto conosciuto.
        Misurato **aprendo la pagina**, non leggendo il codice: su un registro di
        due infortuni, uno con la data e uno senza, il cartellone scrive
        «Infortuni: 2 · 14 giornate perse» e la scheda degli indici, **due righe
        più giù e sugli stessi dati**, scriveva «Anno 2026 · 1 infortunio · 10
        giornate perse · **IF 50,00 · IG 0,50 · LTIFR 50,00**» **senza dire che
        quel 50 potrebbe essere la metà del vero**: se quell'infortunio è del
        2026 gli indici sono **100,00 · 0,70 · 100,00**. Sui tre numeri che si
        portano in gara, e nel verso che **rassicura**.
        ⚠️ *Riletta il 14/08 rimisurando il modulo da me: la prima stesura
        scriveva «dove il vero è 100,00», e sarebbe una promessa che il prodotto
        non mantiene — `indiciInfortunistici` risponde **ancora 50** e deve
        farlo, perché il conto non si tocca. Verificato:*
        `IF 50 · senzaAnno 1` *con l'infortunio senza data,* `IF 50 · senzaAnno
        0` *senza. Il 100 è il valore **condizionale**, non il valore vero: a
        cambiare non è il numero, è che adesso accanto c'è scritto che non si sa.*
        ⛔ **Il conto NON è cambiato** — una soglia di sicurezza non si tocca di
        testa propria: è cambiato che chi manca si **conta** (`senzaAnno`) e si
        **dice** (`avvisoInfortuniSenzaAnno`, scritta nel modulo accanto alle
        sorelle e disegnata dalla pagina in **tutt'e due** i rami della scheda,
        compreso quello «non calcolabili» — che è dove un conteggio più basso del
        vero passerebbe per un conto onesto).
      · ⛔ **E L'ANNO LO LEGGEVANO IN DUE, CON UN COMMENTO CHE PROMETTEVA
        L'IDENTITÀ** («si legge ESATTAMENTE come lo legge `indiciInfortunistici`»):
        la copia debole **che si annuncia gemella**, la stessa forma pagata lo
        stesso giorno dal fascicolo del lavoratore. Provate a tappeto **21 forme
        della data × 4 anni**, le due letture divergevano in **una** combinazione
        sola (`"0000-01-01"` con anno 0), cioè erano gemelle per ogni anno vero.
        ⛔ **E per questo la controprova NON distingueva**: le forme passano anche
        con le due letture separate rimesse — caso **(1)** di «non distingue», i
        dati fanno coincidere la risposta giusta con quella sbagliata. La prova
        che regge pretende l'**identità sul SORGENTE** (nel corpo di
        `indiciInfortunistici` non c'è più nessun `slice(0, 4)`): è la regola di
        `shared/` applicata dentro un file solo.
      Prove: `run-kpi` **2110 → 2116**, con **5 iniezioni** di controprova che
      fanno cadere rispettivamente **4, 1, 1, 1 e 1** prova; ripristino **da
      copia**, mai `git checkout`, e ogni iniezione dichiara il soggetto toccato.

      ✅ **IL CORE LETTO TUTTO, il 13/08** — chiusa così la terza e ultima
      superficie di questa voce. I difetti non stavano nei clamp della
      geometria (una mesh che ha bisogno di una dimensione non dichiara niente
      a nessuno) ma dove il numero **finisce a schermo**:
      · **il meteo del proxy**: `(j.wind||0)*3.6` scriveva «Vento **0 km/h**»
        su un campo che il proxy non aveva mandato — e in cava il vento decide
        la polvere e se far brillare. Gli altri tre campi non avevano nemmeno
        il ripiego: uscivano «undefined°» e «Umidità undefined%»;
      · **la cronologia della cava**: «12 fori · **0 mc**» su una volata con le
        profondità mai scritte, mentre la scheda della stessa volata scrive già
        «né chili né volume». E la risposta era **in casa**: `volMc`, scritta
        insieme a `volKg` e **mai chiamata da nessuno**, a sedici righe dalla
        sua gemella;
      · **i contatori dei mezzi**: «0 ore» e «0 km» scritti in cinque punti a
        mano, e due di quei punti dicevano due cose diverse dello stesso mezzo.
        Adesso è `contatoreMezzo`, uno solo, nella forma di `volKg`/`focKg`;
      · **il contatore mai letto diventava un mezzo nuovo di fabbrica**: «Ore
        iniziali» e «Contachilometri» sono facoltativi e venivano letti con
        `parseNum0`, che del vuoto fa ZERO — e quello zero finiva **nel
        database**. Il lettore giusto (`numDaCampo`, «per i campi
        FACOLTATIVI») era in quel file da mesi;
      · **«5 ÷ 0 =» rispondeva 0**: il principio del fondatore nella sua forma
        più pura, sulla calcolatrice che l'app offre a chi è in cava.
      Prove: `run-kpi` **2063 → 2088** con quelle di Campo qui sotto.

      ⚠️ **Tre cose MISURATE E NON CORRETTE**, perché non spettano a un
      cantiere:
      · **`0` ha due letture opposte, e sono tutt'e due blindate da prove
        verdi.** Sullo stesso record `fermoMin: 0`, `minutiFermoDi` risponde
        «una misura» (e alimenta il CSV), mentre `anomalieAperte`,
        `disponibilitaTurno`, `storicoSettimana`, `registrazioniSenzaGiorno` e
        il `value` del campo dicono «non misurato». Cinque contro uno — e
        cambiare l'uno fa cadere **4 asserzioni** che difendono esplicitamente
        il verso opposto. È una **decisione di prodotto da arbitrare**. Con la
        correzione di oggi quello zero non nasce più da solo: ci arriva solo chi
        digita «0» apposta.
      · **`mediaFermiAlGiorno` dà `media: 0` dove non è stato misurato niente.**
        `fermiPerGiorno` fa entrare nella somma un guasto mai misurato valendo
        zero, e la riga non porta il conto dei «senza minuti», quindi la media
        non può dichiararsi un minimo. Misurato: tre giornate con un guasto mai
        misurato → `media: 0`; e un giorno da 100 min con due giornate di guasti
        mai misurati → `media: 33`, **identico** allo stesso giorno con nessun
        fermo negli altri due. La pagina lo dichiara **a parole** nella nota del
        grafico, quindi è mitigato, non chiuso: il **numero** resta tranquillo.
        Correggerlo vuol dire aggiungere un campo alle righe di `fermiPerGiorno`,
        e due prove le confrontano con `eq` sull'oggetto intero: non è una
        correzione minima.
      · ✅ **CHIUSA il 13/08 — `mediaFermiAlGiorno`**: `fermiPerGiorno` adesso
        porta sulle sue righe `fermiConMinuti` e `fermiSenzaMinuti`, e la media
        ha le stesse **tre** uscite che `minutiFermoTesto` e `csvStorico`
        usavano già («0 min» misurato · `null` quando nessun fermo porta i
        minuti · un **minimo** dichiarato quando solo alcuni li portano). Prima
        le tre situazioni davano `media: 0` e `media: 33` due volte, cioè lo
        stesso numero per casi diversi.
      · **Scudo, `giornateAssenza` ramo near-miss**: un valore *presente ma
        illeggibile* («n.d.», «1,5») diventa **0**, mentre lo stesso valore su
        un infortunio torna `null`. Nel registro consegnato all'RSPP la cella
        esce `…;near-miss;lieve;0;…`. Non corretto perché per un near-miss
        «nessuna assenza» è vero per definizione, e far tornare `null`
        scriverebbe la **parola** `null` in quella cella (`csvRegistroInfortuni`
        fa `aperta ? "" : giornateAssenza(x)`) — cioè il difetto già pagato in
        Conti. Va deciso **insieme a come quella cella deve uscire**.

- [x] ✅ **B0-decies — CHIUSA il 14/08, e la parte che vale è che i tre difetti
      ERANO GIÀ CHIUSI: questa riga stava mandando qualcuno a rifare un lavoro
      fatto il 10/08.** `recDist`, `recFreq` e `psCharge` sono stati sistemati
      dal commit `3cec34f2`, e il 13/08 `browser/genesi-campi-assenti.mjs` ha
      tolto anche le tre eccezioni che li scusavano. La riga era rimasta `[ ]`
      perché nessuno l'aveva spuntata — la **terza forma d'invecchiamento** di
      `CLAUDE.md`, quella per cui una riga che propone un lavoro già fatto lo fa
      **rinascere**. Riverificato prima di crederci, con i comandi:
      `(D2.recDist||300)` → **0**, `+D2.recFreq+' Hz'` → **0**,
      `Math.max(2,Math.min(120,…))` → **0** sul codice **senza commenti**
      (il primo `grep`, coi commenti dentro, rispondeva **1**: erano le righe
      che citano il difetto per raccontarlo).
      ⛔ **E riverificando è saltato fuori il RESIDUO, che è un difetto nuovo di
      famiglia diversa: l'ingresso è quello vero, a mentire è la FRASE che lo
      racconta.** Sulla DIN residenziale la scheda scriveva la frequenza
      arrotondata all'intero: **9,6 Hz** → soglia **5 mm/s** (giusta, 9,6 < 10)
      raccontata come **«5 mm/s @ 10 Hz»** — e a 10 Hz la tabella dice **15**.
      La coppia mostrata **non esiste nella norma**, quindi chi verifica il
      verdetto sulla tabella conclude che l'app sbagli, nel verso permissivo.
      Idem a 49,6 → «15 @ 50» dove a 50 sono 20. E `normaConFrequenza`
      concatenava la frequenza **grezza**: nel CSV archiviato col rapportino e
      nel file per Sentinella usciva «@ **9.6** Hz», l'unica cifra col punto in
      due file italiani.
      Rimisurato da me sulla copia di quello che si committa:
      `9,6 → 5 mm/s · «DIN residenziale @ 9,6 Hz»`, `49,6 → 15 · @ 49,6`,
      `10 → 15`, `50 → 20`, `25 → 15`.
      ⛔ **Nessuna soglia toccata**: `ppvLimit` decide sul numero vero come
      prima: cambia solo quante cifre si scrivono. E `gnum` era **già
      importato** — nessuna funzione nuova, nessuna copia debole.
      ⛔ **E una decisione FERMATA al fondatore, invece che presa**: rendere
      `dRecFreq` un intero all'ingresso porterebbe 9,6 → 10 e la soglia da 5 a
      **15 mm/s**, cioè renderebbe l'app **più permissiva** su un numero che
      decide se si può sparare. È una soglia di sicurezza: sta scritto qui
      invece di essere fatto.
      ⚠️ **Limiti dichiarati**: due decimali (oltre, `9.996` torna «10 Hz», e
      c'è l'asserzione che lo scrive); e una frequenza non intera arriva da una
      volata **salvata**, non dalla tastiera, perché il campo è `type="number"
      step="1"` con la guardia degli interi montata.
      **Controprova**: 2 iniezioni, 2 cadute su asserzioni **diverse** — e la
      seconda cambia **zero caratteri** (`,2` → `,0`), cioè il conto dei
      caratteri da solo avrebbe mentito: a dirlo è stata la prova caduta.
      **Misure**: `run-kpi` 2248 → **2249**, 0 falliti.

- [x] **B0-decies (com'era, e resta per la MISURA — non è lavoro da fare). IL
      RECETTORE ASSENTE FA DIRE A GENESI «SUPERA» CON UN NUMERO
      DI CINQUE CIFRE — e una delle tre esclusioni non regge alla misura.**
      ⏱️ *Misurato il 09/08 sui tre campi che B0-sexies teneva fuori.*
      · **`recDist`**: il danno non è al secondo clic, è a **ZERO clic**.
        Subito dopo «Apri», con la distanza assente, la scheda dichiara **PPV al
        recettore 67.627,4 mm/s** (riferimento 6,4) e **Airblast 172 dB(L)**
        (riferimento 127), col verdetto **«SUPERA»** — e nel «perché» scrive
        «a **— m** (SD 0,0 m/kg^½)»: cioè **sa** di non avere la distanza e
        calcola lo stesso. È il principio del fondatore rovesciato — non un
        numero tranquillo, un'**accusa** — la stessa famiglia della geometria
        chiusa in `aec46eb`.
      · **`recFreq`**: ⛔ **la ragione dell'esclusione era sbagliata.** Era
        «c'è `ppvLimit` in mezzo, e le soglie non si toccano»; misurando, a zero
        clic la scheda dice già *«Non si può dire se è sotto soglia: la
        frequenza dominante attesa non è un numero leggibile»* — cioè
        `ppvLimit` **gestisce già** la frequenza assente, e il `Math.max(2, …)`
        non protegge una soglia: la **distrugge**, trasformando quel «non si può
        dire» in «Soglia DIN residenziale 5 mm/s @ 2 Hz → SUPERA». Si corregge
        **senza decidere niente** su `ppvLimit`.
      · **`psCharge`**: la ragione scritta («metterlo a null farebbe dire
        *carica lineare troppo bassa*») descrive uno stato **che c'è già**: a
        zero clic il valore mostra «— kg/m» e il «perché» dice già «Carica
        lineare troppo bassa», perché `null < 0.25` è vero. Correggere il campo
        cambierebbe solo `0,10` → `—`; l'allarme falso **è già lì** e va chiuso
        comunque.
      ⛔ **Resta fermo il vincolo vero**: le soglie di sicurezza (curve
      USBM/DIN, `ppvLimit`) non si toccano senza conferma del fondatore. Qui non
      si toccano — si smette di **inventare gli ingressi** che ci vanno dentro.

- [x] **B3-ter. «Sui 1 fori già caricati» — e undici righe sotto la guardia
      giusta c'è già.** ✅ *Chiuso il 10/08, e la famiglia CENSITA invece che
      corretta a occhio.*
      **Il censimento**, con lo strumento che usa `classifica` di
      `tests/tokenizza.mjs` (non un tokenizzatore nuovo: un buco lì è un buco
      lì, non uno nuovo) e col denominatore stampato in due gradini dichiarati:
      `apps/campo/index.html` **499 slot, 59 candidati, 36 scoperti → 24**, e
      i 24 + 2 rimasti sono stati **letti uno per uno** e sono tutti
      non-difetti, con la ragione (rapporti `N/M parola`, invariabili come
      «attività», valori che non sono conteggi, un artefatto del righello).
      **Corrette 14 frasi** e **assorbite 3 guardie scritte a mano**.
      ⛔ **Non è stata scritta nessuna funzione nuova per il singolare**:
      `plurale()`/`conta()` sono in `shared/deepwork-id-client/dw-shell.js` e
      Campo le importava già (`index.html:1221`, `campo-data.js:53`) — sarebbe
      stata la **quinta copia**. Quello che mancava è che le frasi del carico
      parziale le componeva **la pagina**, cioè «la copia debole dove il
      documento si compone»: ora `frasiCaricoParziale(par, marca)` sta nel
      modulo, dove una prova può guardarla. E `marca` **è un argomento, non una
      seconda funzione** — il riepilogo vuole il numero in `<b>`, il toast lo
      vuole nudo: la prova in scratchpad ha bocciato la prima stesura proprio
      lì, coi tag stampati come testo dentro il toast.
      **Prove**: 4 in `run-kpi` (2038 → **2042**), e col difetto rimesso cadono
      **tutte e quattro** — nessuna passa per un motivo diverso dal suo nome.
      **Nel browser**: 19 verifiche su 5 scene — 0 registrati → nessuna riga
      «finora»; 1 → «**Sul foro già caricato**»; 3 → **alla lettera come
      prima**, così `campo-numeri-tranquilli` non si muove; il piede → «manca
      ancora **1 foro**»; il toast → senza `<b>`.
      ⛔ **E il righello ha sbagliato due volte, e vale più del risultato**: il
      primo «slot» era *qualunque* codice fra due stringhe (493 candidati quasi
      tutti finti — uno slot è solo un punto in cui il valore **finisce nel
      testo**); e la ricerca della guardia sull'espressione dava
      `par.registrati` **protetta** da una guardia di un *altro* conto, cioè
      **assolveva proprio la riga del difetto**.
      ⛔ **E la ragione per cui nessun banco l'aveva preso** vale da sola:
      `DEMO.pianocarico` è `[]`, quindi `tagliaAUno` su una lista vuota non
      produce niente e **l'intera schermata del piano di carico non è misurata
      da nessun banco che apra la dimostrazione** — è lo stesso «non si vedeva
      perché non c'era mai stata una barra alta». Mettere un piano nella
      dimostrazione è **un'unità a sé** (aprirebbe quella schermata a tutti i
      banchi esistenti, e tocca dati che `campo-disegni` si inietta da sé).
      ⏱️ **Elenco per le altre app, PROPOSTO dal censimento e NON verificato**
      — su Campo il rapporto vero è stato 36 grezzi → 14 difetti, quindi questi
      numeri non si moltiplicano: core 40, conti 39, flotta 27, sentinella 19,
      terra 15, scudo 12, genesi 12 candidati grezzi. I letti a mano che
      sembrano veri: la **stessa frase d'import** in Flotta (2 punti) e
      Sentinella (3), «Ogni ${m} mesi» in Flotta, «Dei ${nPunti} punti» in
      Sentinella, «${length} DPI previsti» in Scudo, «${skipped} saltati» nel
      core. ⚠️ E lo strumento, se lo si vuole stabile, va portato in
      `apps/deepwork-id/tests/` — gli strumenti di misura non vivono nello
      scratchpad.

      ⏱️ *Il testo originale della riga:*
- [x] **B3-ter (com'era, e resta per la MISURA — non è lavoro da fare: la
      chiusura del 10/08 sta più su in questo file). «Sui 1 fori già caricati» — e undici righe sotto la guardia
      giusta c'è già.** ⏱️ *Trovato il 09/08 dal banco del ponte di Campo.*
      Con **esattamente un** foro registrato, `apps/campo/index.html` compone
      «Sui **1** fori già caricati: 118,5 kg contro 100 kg previsti +19%».
      Con «1» cambia anche la preposizione («**Sul** foro già caricato»). ⚠️ E
      la stessa pagina, undici righe più sotto, la guardia ce l'ha:
      `dopo.registrati === 1 ? "sul primo foro caricato" : "sui " + … + " fori
      caricati"`. Cioè **la regola scritta due volte, la seconda più debole** —
      la famiglia raccolta in `CLAUDE.md`, qui in casa e nello stesso file.
      **Come si misura**: un piano con un foro solo registrato, e si legge la
      riga di riepilogo.

- [x] **B4-bis. LE TENDINE DEL CORE NON LE MISURA NESSUN BANCO, E IL BANCO CHE
      DOVREBBE NON DICE «non ho guardato»: MUORE.** ⏱️ *Trovato il 09/08
      chiudendo B0-quinquies.* `tendine-nelle-finestre.mjs --solo=core` **non
      monta il finto Firebase**, quindi non entra nel core e cade su
      `window.__provaUtente is not a function` (uscita 1); vale anche per
      `--tutte`, che il core ce l'ha in `CANDIDATE`. Conseguenza **dichiarata**:
      a 360 e 430 px le tendine del core oggi non le guarda nessuno — e
      `modali-dentro` gira a 390 e 320, cioè proprio le due larghezze dove il
      taglio di `#sm-cava` **non** si vedeva.
      ⛔ È la forma peggiore della famiglia «un banco che dichiara di essere
      cieco»: qui non dichiara niente, **muore**, e un banco morto in un giro si
      legge come una riga rossa qualunque. La cura è un argomento
      (`montaFintoFirebase` passato ad `apriSuperficie`), come già fatto per gli
      altri banchi che aprono il core.
      ✅ **Chiuso il 10/08.** Da **banco morto** a **268 finestre aperte**: 67 per
      larghezza (28 diverse), 14 tendine, **48 voci misurate, 0 tagliate**, a
      320/360/390/430. La prova d'ingresso è stampata a ogni larghezza — **699
      caratteri e 8 comandi** contro i 258 e l'unico bottone del guscio — e il
      guscio si riconosce **per nome** (`#screen-login` a schermo), non per
      soglia: in quel caso la larghezza si dichiara NON GUARDATA invece di
      essere assolta. Scudo, prima e dopo, **identico** (6 finestre, 8 tendine,
      60 voci, 18/12/12/10 tagliate).
      ⚠️ **Il taglio di `#sm-cava` a 430 citato qui sopra NON si è riprodotto**:
      i due nomi di cava chiedono 178 e 174 px in una scatola da **352**. Non è
      una smentita di `modali-dentro` (cammina sui comandi a modo suo e può aver
      aperto quella tendina in un altro stato) — sta scritto perché il prossimo
      non lo cerchi credendo di averlo perso.
      ⛔ **E il banco ha trovato tre difetti in sé stesso**, di cui uno grosso:
      usava `ko === 0` come prova del «rosso voluto», ma su una superficie non
      pretesa quella domanda è «ho guardato?» — vera **anche col difetto
      dentro**, cioè la controprova avrebbe accusato sé stessa. Ora il rosso
      voluto sono le **voci visibili tagliate**, e il core è entrato in
      `PRETESE` (un taglio futuro è un KO, non una riga stampata).
      ⏱️ Registrate in `tutti.mjs` **due passate a sé** per il core: senza
      argomenti il banco guarda solo Scudo, quindi la correzione da sola non lo
      rimetteva nel giro — la morte del banco era la causa, la cecità l'effetto.

- [x] **B0-octies. LA TABELLA DEL CANTIERE DI GENESI ERA FALSA IN SETTE NUMERI
      SU SETTE, SOTTO UN AVVERTIMENTO CHE DICEVA COME SAREBBE SUCCESSO.**
      *(chiuso il 09/08, commit `1805f43`)* `genesi-estraibili.mjs` misura
      quante funzioni si portano fuori dalla pagina senza cambiargli la firma;
      la sua tabella sta in `docs/DEVELOPMENT.md` e, **identica**, dentro il
      commento dello strumento che la produce. Diceva 46 · 64 · 27 · 31 · 24,
      cioè «110 su 192»; lo strumento stampa **29 · 58 · 23 · 28 · 31, cioè 65
      su 169**. Non una svista: nel frattempo tre fette di Genesi sono davvero
      uscite dalla pagina — **il documento invecchiava mentre il lavoro andava
      bene**, che è il verso in cui qui capita sempre.
      ⛔ Sotto quella tabella c'era scritto *«se un giorno divergono, ha ragione
      l'uscita e torto il commento»*. Divergevano da otto giorni. Terza volta in
      due giorni: **dichiarare un punto cieco non lo illumina.**
      E il totale grosso era scritto **a mano dentro il `console.log`** — la
      riga che esiste per dire «guardate il numero giusto» contrapponeva un
      `192` che non era più di nessuno.
      **Adesso lo sorveglia `numeri-nei-documenti.mjs`** (+3 prove), che lancia
      il censimento e pretende la tabella uguale alla sua uscita **scaglione per
      scaglione** — il totale da solo no: il 01/08 la somma era giusta e gli
      addendi vecchi. Controprovato col difetto vero rimesso, in tutt'e due i
      rami (uno scaglione: **zero caratteri** di differenza, quindi l'ancora è
      un `assert` sulla stringa, non una conta).
      ⚠️ E `docs/PIANO_GENESI_MODULO_DATI.md` ha perso la colonna dei valori «di
      oggi», scritta la mattina e già vecchia la sera (diceva `run-kpi` 1979, ne
      esegue 2033): **restano solo i comandi, che non invecchiano**. Portava
      anche un `su b9d4724` che sembrava una verifica e non lo era — quel commit
      non ha mai toccato quel file (`git log b9d4724 -- <file>` → `b964a73`).
      **Come si rimisura**: `node apps/deepwork-id/tests/numeri-nei-documenti.mjs`
      deve stampare «cantiere di Genesi: N funzioni nella pagina, M estraibili,
      5 scaglioni confrontati col documento».

- [x] **B0-sexies. GLI ALTRI QUINDICI CAMPI CHE INVENTANO IL PROPRIO MINIMO —
      contati, non stimati.** ✅ *Rimisurato il 09/08: **ne restano TRE**, non
      quindici, e sono esattamente i tre che questa riga escludeva già —
      `psCharge`, `recDist`, `recFreq`. Gli altri dodici erano stati chiusi da
      `aec46eb`, che è il commit della riga qui sotto: il «15» era vero quando è
      stato scritto e scaduto poche ore dopo.* Il comando che lo dice, ancorato
      ai **nomi** e coi commenti tolti (due commenti dentro `applyDesign`
      **citano** la forma vecchia, e un `grep` grezzo li conta come codice: dà 5
      invece di 3): si prende `senzaCommenti` da `tests/tokenizza.mjs`, si
      taglia il corpo fra `function applyDesign(){` e `function
      syncDesignInputs(`, e si contano le righe con `||D2.` e `Math.max(` →
      **8 ripieghi, 3 col clamp**.
      **Verificato anche nel browser**, campo per campo con `design.<campo>:
      null` e due tocchi: dodici restano **vuoti**, tre si riempiono
      (`psCharge` 0,1 · `recDist` 20 · `recFreq` 2). Statica e browser danno lo
      stesso numero.
      ⚠️ E la controprova che il banco sa fallire: rimettendo `Math.max(1.5,
      Math.min(8, gvv('dB')||D2.B))` **nella risposta HTTP** (mai sul file, +7
      caratteri), `dB` torna a riempirsi di «1,5» **e il powder factor passa da
      «non calcolabile» a 1,10 kg/m³** — un KPI fabbricato.
      ⏱️ *Il testo originale, tenuto perché è la misura di com'era:* Chiuso il clamp della **carica** (B0-quater), il
      cantiere ha censito il resto: in `applyDesign` ci sono **20** ripieghi
      `||D2.x`, di cui **16 numerici col clamp**; corretto quello della carica,
      ne restano **15**. Misurato nel browser aprendo i campi **uno alla volta**
      col proprio valore a `null`: **24 campi su 27 inventano il proprio minimo
      al secondo clic**. I tre che non lo fanno sono `dRit` (nessun clamp) e
      `dErrColl`/`dDev`, che hanno già la guardia esplicita.
      Al secondo clic diventano: `B` 1,5 · `S` 1,5 · `diam` 50 · `perRow` 3 ·
      `file` 1 · `prof` 6 · `stem` 0,5 · `sub` 0 · `ritardoFila` 8 · `ucs` 5 ·
      `eMod` 2 · `psSpacing` 0,3 · `psCharge` 0,1 · `recDist` 20 · `recFreq` 2.
      `valoreCampo` è già in casa: ognuno è **una riga**.
      ⛔ **MA LA GEOMETRIA NON SI CORREGGE SOLO IN `applyDesign`, e questa è la
      ragione per cui non è stata toccata**: `pfNominale()` scrive
      `consumoSpecifico(D2.kg, (D2.B||3)*(D2.S||3.5)*(D2.prof||10))` — una
      **seconda invenzione a valle**, raggiungibile **già subito dopo `apri`**,
      senza nemmeno il secondo clic. Con `B:null` il consumo specifico si
      calcola su una spalla di **3 m che nessuno ha scritto**, e la leggono
      quattro punti (mappa dell'energia, riquadro 3D, relief, scheda ispettore).
      Correggere la geometria a metà **lascerebbe la bugia dov'era**.
      ⚠️ E i due campi del **recettore** (`recDist` 300 → 20 m, `recFreq`
      25 → 2 Hz) inventano nella direzione che **allarma**, non che rassicura:
      resta invenzione, ma è un cantiere con `ppvLimit` dentro.
      ⚠️ I ripieghi `||0` su costi e acqua **non sono un difetto**: `costoVolata`
      dichiara la scelta — «un prezzo non inserito è *non lo addebito*».
      ⚠️ E `psCharge` è una carica, ma metterla a `null` senza toccare la riga
      «Presplit» farebbe dire *«carica lineare troppo bassa: taglio
      incompleto»* su un valore che nessuno ha scritto: **farla a metà è
      peggio**.

- [x] ✅ **B0-quater. IL CLAMP CHE FABBRICAVA 5 kg/FORO ERA GIÀ CHIUSO — E SOTTO
      C'ERA L'ULTIMO NUMERO CHE L'ASSENZA INVENTAVA, NELL'UNICA DIREZIONE CHE
      RASSICURA.** *Rimisurata il 13/08 col browser **prima** di toccare
      qualunque cosa, ed è servito: la prima metà della voce era **scaduta**.*
      I blocchi G14–G16 (commit `a3757c81`, 09-10/08) l'avevano già chiusa.
      Aprendo una volata con `design.kg:null` e toccando la sequenza, il campo
      «Carica per foro» resta **vuoto**, il consumo specifico dice **«non
      calcolabile»** e l'X50 pure — e il toast all'apertura **nomina** il valore
      che manca. Cioè: se il cantiere si fosse fidato della riga invece di
      misurare, avrebbe «corretto» una cosa già corretta.
      ⛔ **Ma affiancando le 29 righe della scheda validatori con la carica e
      senza — il metodo del «rapporto fra due valori diversi» — ventotto erano
      identiche e UNA sola diversa**: «Confin. colletto (SDOB) **5,84 m/kg⅓**»
      contro **1,43**. E 5,84 sta **sopra** la soglia 1,4: il pallino si
      dipingeva **verde**, con «colletto ben confinato: disturbo superficiale
      minimo». Meno carica dichiarata = colletto che *sembra* più sicuro — e lì
      la carica non era poca: **non c'era**.
      ⛔ **E la stessa formula viveva in DUE posti con due ripieghi OPPOSTI**:
      la scheda faceva `Math.min(null, cap)` = 0 → 5,84, e `flyrockEst` faceva
      `Q = D2.kg || P.kg || 50`, cioè si **inventava una carica intera** → 1,43.
      Le due bugie **si compensavano per caso**, quindi la correzione che veniva
      in mente — togliere il ripiego a una sola delle due — avrebbe **dimezzato
      la distanza di sgombero**: misurato, gittata **101 m** con la carica
      inventata e **49,3 m** con lo zero, cioè sgombero persone **404 → 197 m**,
      senza un rosso da leggere. È «il contratto allargato a metà» di
      `CLAUDE.md`, visto **prima** che facesse danno.
      **Fatto** (blocco G17): `confinamentoColletto` in `genesi-data.js` è
      l'**unica** implementazione dell'SDOB e risponde `null` con la sua ragione;
      la scheda, la stima flyrock e il calcolo inverso dicono «non calcolabile»;
      e i **dodici** lettori a valle sanno leggerla — `computeKPI` (dove
      `Math.round(null)` faceva **0 m di sgombero**), il confronto A/B, il CSV
      della scheda volata (tre celle a zero, in un file che si archivia col
      rapportino), il foglio che si porta in cava, il disco a terra nel 3D e la
      legenda dei raggi-X, che scriveva «esplosivo 60 kg».
      ⛔ **NESSUNA SOGLIA TOCCATA**: `ppvLimit`, le curve USBM/DIN, i 133 dB(L),
      la soglia SDOB 1,4/0,9 e le formule Richards&Moore/McKenzie/Lundborg sono
      le stesse.
      ✅ **RIMISURATO DA ME il 14/08**, perché questi numeri sono finiti nel
      documento che il fondatore apre e non potevano restare sulla parola di un
      cantiere: `confinamentoColletto({kg:58, stem:2.2, diam:102})` →
      **sdob 1,4280…**, cioè l'1,43 pubblicato **alla cifra**; con `kg:null` →
      **`sdob:null`, `calcolabile:false`**, con la bandiera `carica:true` e la
      frase che nomina il dato che manca. Regge. Qui si smette solo di **inventare gli ingressi**. Sul progetto
      sano i numeri sono identici alla cifra: SDOB **1,43** · gittata **101 m** ·
      sgombero **202 / 404 m**.
      **Prove**: 8 in `run-kpi` (G17), e `genesi-campi-assenti.mjs` da 36 a **55**
      asserzioni — con `dKg`, che è il campo che dà il nome a questa voce e che
      quel banco **non aveva mai guardato**.
      ⛔ E i suoi «tre esclusi per decisione presa» erano un'**eccezione che non
      serviva più**: `psCharge`, `recDist` e `recFreq` sono corretti dal 10/08 e
      il banco continuava a stampare «atteso 0,1 · 20 · 2», cioè
      un'affermazione **falsa sul prodotto**, scritta sotto la riga «e va detto».
      **Controprova**: **18 iniezioni su 18** a segno, **21 prove cadute su 55**
      (sana 55/0), coi tre KO che stampano i numeri storici — 5,84 · 49 m →
      99/197 m · borr. ≥ 1,9 m. E le due asserzioni nel **verso opposto** («col
      dato vero l'SDOB è ancora 1,43») restano verdi sotto iniezione: se
      cadessero, vorrebbe dire che la difesa ha **spento** la riga invece di
      renderla onesta.

- [x] ✅ **B0-tervicies. LA SPALLA ASSENTE: la gittata del flyrock usava un
      BURDEN CHE NESSUNO AVEVA SCRITTO.** *Chiuso il 14/08, raccogliendo il
      lavoro di un cantiere morto sul limite di sessione **prima di consegnare**:
      le sue misure non sono arrivate, quindi qui c'è solo ciò che ho potuto
      **verificare io** sulla copia di quello che si committa.*
      `flyrockEst` faceva `B = D2.B || SPALLA`: con la spalla mai scritta, la
      distanza a cui si mandano via le **persone** usciva da un ripiego globale
      `let SPALLA = 3.0`. È il fratello del difetto chiuso poche ore prima
      (`Q = D2.kg || P.kg || 50`), sull'altro ingresso della stessa formula.
      ⛔ **E il metodo di G17 — affiancare le righe della scheda col dato e senza
      — QUI NON LO VEDEVA**, ed è la lezione che vale più dell'unità: la riga
      della gittata **non cambiava**, 101 m con la spalla e 101 m senza. Il
      ripiego riempiva il buco così bene da farsi assolvere dal confronto.
      **Un numero identico non è un numero verificato.**
      Adesso `gittataSenzaSpalla` e `FLY_SENZA_SPALLA` vivono in
      `genesi-data.js`, e la gittata si dichiara non calcolabile **solo dove la
      spalla decide davvero**: nell'83,1% delle 40.500 combinazioni provate la
      spalla non sposta la gittata di un millimetro — entra in **una sola** delle
      quattro formule (il face burst di Richards&Moore) e la gittata è il
      **massimo** delle quattro. Un «non calcolabile» secco avrebbe **spento una
      riga utile in cinque casi su sei**.
      Dove invece decide, decide **nel verso che rassicura**: con Ø102, borraggio
      2,2 m e 58 kg, la spalla vera dà «133 m → sgombero 267/533 m» e la spalla
      assente «101 m → 202/404 m» — **129 metri di sgombero persone in meno**.
      ⛔ **Nessuna soglia e nessuna formula toccate**: `gittataSenzaSpalla` non ne
      conosce nessuna, riceve il face burst **come funzione** e gli altri due
      numeri già fatti. Decide soltanto che cosa si fa quando un ingresso manca.
      **Misure mie, sulla copia**: `run-kpi` 2182 → **2193**, 0 falliti;
      copertura `genesi-data.js` 64 → **66/66**, condivisi **173/173**;
      `iniezioni-fresche` **378/378**; `sintassi-pagine` 34/0; giro `node`
      **2.984** asserzioni, **34 comandi a posto, 0 caduti**.
      ⚠️ **Quello che NON posso attestare**, perché il cantiere è morto prima di
      dirmelo: la sua controprova `node`. L'ultima riga che ha fatto in tempo a
      mandare parla del **banco** — «20/20 iniezioni a bersaglio, 25 prove cadute
      su 64», coi quattro KO della sezione spalla che riproducono i numeri
      storici — e quella è una misura sua, non mia. Il giro del browser la
      rimisurerà.
- [x] ✅ **B0-ter. MENTRE UN CANTIERE SCRIVE, UN ROSSO LETTO SULL'ALBERO VIVO NON
      È UN VERDETTO.** Misurato il 09/08 su me stesso: leggendo l'albero mentre
      un cantiere ci scriveva, `run-stile` ha detto **316 passati e 2 falliti**;
      rilanciato **subito dopo**, **318 e 0**. Non era un difetto, era una
      **lettura a metà scrittura**.
      ⚠️ E la parte che vale: **lo stesso cantiere me l'aveva già segnalato
      stamattina** — «una esecuzione di `run-stile` ha detto 316/2 e non si è più
      riprodotta in sei esecuzioni successive» — e io l'avevo **annotato senza
      trarne la conseguenza**. Un avvertimento ricevuto e non convertito in
      regola è un avvertimento che si ripaga.
      ⛔ La regola: il verdetto si prende sulla **copia immobile** (`git
      worktree` + `git diff --cached | git apply` + `git -C "$W" add -A`), non
      sull'albero vivo. Vale in tutt'e due i versi, ed è il verso **rosso**
      quello che costa di più: un rosso falso fa aprire un cantiere su difetti
      che non esistono — è già successo il 07/08 con dieci KO immaginari.
      ⚠️ È il secondo costo dei cantieri paralleli, dopo quello della riga qui
      sotto: il primo allunga il giro, questo **rende inaffidabile ogni misura
      presa di corsa**. Nessuno dei due contraddice la direttiva 3; tutt'e due
      dicono **come** si lavora mentre i cantieri girano.

- [ ] **B0-bis. TRE FAMIGLIE DI INIEZIONI CHE NESSUN CONTROLLO SORVEGLIA — e
      una di loro è già rimasta rotta per giorni.** `iniezioni-fresche.mjs`
      esiste per prendere l'iniezione **scaduta**: quella che cita il codice
      testualmente, non lo trova più perché il codice è migliorato, e allora la
      controprova gira su un prodotto **sano** dichiarando «non distingue». Il
      09/08 ha 309 iniezioni su 309 a bersaglio.
      ⛔ **Ma le famiglie A, B e C di `modali-dentro.mjs` non ci sono dentro**:
      le loro iniezioni si chiamano `inietta(rel, da, a, cosa)`, e non sono né
      una tabella del vocabolario né una `.replace("…")` — cioè nessuna delle due
      forme che il censimento sa leggere. La famiglia **D**, nata il 09/08, ci
      entra perché è stata scritta come **mappa** `rotta → {da, a}`.
      ⚠️ **Non è teoria**: la storia di quel file racconta che **l'iniezione A è
      rimasta rotta per giorni**, ed è esattamente il caso per cui il controllo
      è stato costruito. È dichiarato nel commento del banco, non taciuto — ma
      «un'eccezione dichiarata onestamente resta un posto in cui nessuno
      guarda», e questa casa l'ha già pagata due volte (le sei iniezioni scadute
      di `scudo-documenti`, e il nome dentro la regex che teneva fuori una
      tabella su quattro).
      **Come si misura**: `node apps/deepwork-id/tests/iniezioni-fresche.mjs`
      stampa il denominatore — quante tabelle in quanti banchi. Il giorno in cui
      A, B e C entrano, quel numero sale e le tre spariscono da questa riga.
      ⚠️ **Non fatto perché il file è di un cantiere in corso**, non perché sia
      difficile: portare le tre alla forma a mappa è un'unità sua.

- [ ] **B0. I CANTIERI DEL BROWSER E IL GIRO SI RUBANO LA MACCHINA — misurato
      il 09/08, e ridimensiona la direttiva 3 SOLO per i banchi.** Il giro del
      browser è partito alle **13:03:34Z** e ha fatto **145 passate in 119
      minuti** — 0,82 minuti l'una. Poi ho aperto tre cantieri che aprono
      Chromium (contrasto a tre larghezze, il righello delle tendine, e prima
      ancora Scudo): dalle 15:02 alle 17:12 ha fatto **10 passate in 130
      minuti**, cioè **13 minuti l'una**. **Circa sedici volte più lento.**
      Nel momento della misura: **34 processi Chromium** vivi e **5 banchi del
      browser** in corso fuori dal giro.
      ⚠️ **Il confondimento va dichiarato, se no il numero vale meno di quello
      che sembra**: le passate della coda **non sono le stesse** di quelle della
      testa, e potrebbero essere intrinsecamente più pesanti. Non ho un
      esperimento controllato — ho un rapporto di 16× e trentaquattro Chromium.
      Quindi si scrive **come indizio forte, non come causa provata**, ed è
      esattamente il modo in cui questa casa distingue una misura da una
      deduzione.
      ⛔ **La regola operativa che ne segue, e che NON contraddice la direttiva
      3**: il primo moltiplicatore è misurato sui cantieri che **scrivono file**
      (241 e 258 modifiche in un giorno contro 92 lavorando in fila), e quella
      resta. Ma un cantiere che **apre Chromium** non è dello stesso tipo:
      contende la stessa risorsa del giro, e il giro è la cosa che nessun altro
      può rifare. **Mentre un giro cammina, i cantieri paralleli si aprono su
      lavoro che NON apre il browser** — moduli, documenti, suite `node` — e i
      banchi si mettono in coda.
      ⚠️ E il costo non si vede: il giro non rallenta con un avviso, si allunga.
      Chi lo guarda dopo trova un registro da cinque ore e nessuna riga che dica
      perché.
      ⛔ **E IL MIO RIGHELLO ERA ETICHETTATO MALE — correzione scritta un'ora
      dopo, perché il numero l'avevo già committato.** Ho contato le «passate»
      con `grep -cE '^════════'`, e quelle otto uguali **non sono solo le
      intestazioni del runner**: molti banchi ne stampano una **loro**, a otto
      uguali, ed è scritto in `CLAUDE.md` da ieri — l'avevo letto e ho scritto
      il setaccio lo stesso. Prova: su un giro che ne aveva registrate **161**
      il conto diceva **176**, cioè quindici in più di quelle che esistono.
      ⚠️ Che cosa resta in piedi e che cosa no: il **rapporto** regge, perché
      lo stesso righello sbagliato ha misurato tutt'e due gli estremi; la
      **parola** no. Non sono «passate», sono **intestazioni di sezione** — ed è
      «l'etichetta più larga del suo numero», censita in `CLAUDE.md` e rifatta
      da me nello stesso pomeriggio in cui la citavo.
      **Come si misura, adesso che lo so**: non con un `grep` proprio, ma con
      `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` — che è lo
      strumento scritto apposta per non farsi ingannare da quel registro, e che
      apre dicendo di quanti commit il branch è andato avanti. L'esperimento
      pulito resta da fare: rilanciare **le stesse** passate della coda a
      macchina scarica, e costa un giro.

- [x] **B3-bis. Il bottone d'uscita di Campo che nessun banco preme — e non è
      un bottone qualunque: è il PONTE con Genesi.** ✅ *Chiuso il 09/08.*
      **Perché non era premuto, misurato e non dedotto**: il bottone esiste e
      non è disabilitato, ma nasce `style="display:none"` e `pianoRender` lo
      accende **solo** se `PIANO.length`, mentre `DEMO.pianocarico` è `[]`.
      Con un piano iniettato passa da `display:none` / 0×0 a `flex` /
      267,7×44. ⚠️ La riga diceva «serve un piano in stato utile»: **non
      serve** — basta un piano qualunque, anche di un foro solo.
      **Che cosa guarda adesso il banco** (`campo-numeri-tranquilli.mjs`,
      69 → **92** verifiche): 1 bottone premuto · 5 righe di dato · **15 valori
      confrontati fra schermo, file e lettore di Genesi** · 6 asserzioni sul
      **testo** del file. Tre gambe indipendenti, e servono tutte: `numIt` legge
      `1234.567` e `1.234,567` allo stesso modo, quindi **il solo giro di andata
      e ritorno non avrebbe visto un file scritto all'italiana** — ed è
      esattamente l'avvertimento di `CLAUDE.md` sulle coppie scrivi/leggi.
      **Esito**: 15 valori su 15 tornano identici dal lettore di Genesi, con la
      coppia che conta — il foro mai pesato torna «non lo so», quello a zero
      torna zero. **Nessun difetto di prodotto nel ponte.**
      **Controprova**: il consuntivo ricomposto **a mano nella pagina** invece
      che da `pianoConsuntivoCsv` (la copia debole dove il documento si compone),
      iniettato nella risposta HTTP — 40 KO, 17 iniezioni su 17 a segno, e sotto
      ci sta la conferma che le tre gambe servono: con quel difetto **Genesi
      legge 1.250 kg di progetto come 1,25 kg, in silenzio**.
      ⏱️ *Il testo originale della riga:* ⏱️ *Misurato il 09/08
      chiedendo a Campo la domanda che `CLAUDE.md` fa alle altre cinque app —
      «dove questa app compone qualcosa che ESCE, chi decide i suoi numeri?».*
      ✅ **La parte statica è pulita, e va detto che è la parte DEBOLE**: tutti e
      cinque i punti d'uscita di Campo compongono il file **nel modulo**
      (`csvAttivita`, `csvSquadre`, `csvAppello`, `csvStorico`,
      `pianoConsuntivoCsv`), ognuno con il commento che racconta la volta in cui
      non era così. Ma il censimento statico su quelle cinque app dava **zero**,
      e i ventiquattro difetti li ha trovati **chi ha premuto il bottone**.
      ⛔ **E il bottone, qui, non lo preme nessuno.** Comando:
      `grep -rl btn-piano-export apps/deepwork-id/tests/browser/` → **niente**,
      mentre gli altri quattro (`btn-att-export`, `btn-squ-export`,
      `btn-pre-export`, `btn-set-export`) escono tutti in
      `campo-numeri-tranquilli.mjs`. Quattro su cinque premuti, il quinto no.
      ⚠️ **Perché proprio quello conta più degli altri**: il file che produce —
      `campo_consuntivo_carico.csv` — è quello che il messaggio invita a
      rileggere **in Genesi → Riconciliazione**. Cioè Campo lo scrive e
      **un'altra app lo legge**: è una coppia scrivi/leggi che attraversa il
      confine fra due app, e su quelle `CLAUDE.md` avverte che *«una prova di
      andata e ritorno resta verde se le due metà sbagliano insieme»*.
      ⚠️ La funzione **è provata** al banco `node` (`pianoConsuntivoCsv` compare
      cinque volte in `run-kpi.mjs`, e Campo è a 123/123): quello che non è
      provato è il **gestore del bottone**. È esattamente la forma con cui il
      difetto di Terra è vissuto in produzione per giorni — «Scarica rilievi»
      chiamava un nome che nella pagina non esisteva, **il file usciva** e il
      gestore moriva subito dopo, senza un messaggio.
      **Da fare**: aggiungere la quinta pressione a `campo-numeri-tranquilli.mjs`
      (dove stanno già le altre quattro), con la fixture di un piano importato,
      e pretendere che un foro **senza carica reale** non esca come uno zero.
      ⚠️ Non fatto in questa unità e dichiarato: serve la fixture del piano, ed
      è un'unità sua — non un'aggiunta di tre righe.
      ⏱️ **E IL DENOMINATORE DI TUTTO L'ECOSISTEMA, misurato subito dopo: è
      L'UNICO.** Censiti tutti i `<button>` d'uscita delle sette superfici (id
      che contiene `export`, `csv`, `pdf`, `stampa`, `scarica`, `download`) e
      chiesto per ognuno quale banco lo nomina: **39 bottoni, 1 senza nessun
      banco**, e quell'uno è `btn-piano-export`. Cioè la copertura dei punti
      d'uscita è al **97%**, e il buco è esattamente sul ponte fra due app —
      il che lo rende più interessante, non meno.
      ⛔ **E il primo conto era 44 e 3, con DUE falsi allarmi su tre**: cercando
      gli `id` senza pretendere che fossero `<button>`, il censimento aveva
      raccolto `pdfm-cava` e `pdfm-mese` del core, che sono un `<select>` e un
      `<input type="month">` **dentro** la finestra del PDF — campi di un modulo,
      non bottoni da premere. Accusavano il core, cioè la superficie che il
      fondatore mostra per prima, di due buchi che non ha.
      ⚠️ La lezione è quella di sempre e vale la pena riscriverla perché è
      successa **mentre misuravo un buco vero**: il sospettato è il righello. Un
      censimento che seleziona per **nome** invece che per **cosa è** trova
      soggetti che non esistono — ed è la stessa forma del «un nome dentro una
      regex» che questa settimana è già costata un elenco intero.

- [ ] **B4. Le mancanze confermate del delta**, in ordine di quanto le chiede un
      ispettore. ⏱️ **Ricontate il 07/08 leggendo i documenti**, non a memoria —
      il conto qui scritto era del 02/08 e si era mosso parecchio:

          | app | «CONFERMATA ASSENTE» | «SCADUTA» |
          | campo 11 · sentinella 13 · conti 8 · flotta 5 · terra 4 · **scudo 6** |
          | totale **47** (era 54 · ⛔ NON 42 e NON 41: vedi qui sotto) | totale **14** (⛔ non 18) |

      ⏱️ **13 → 14 il 09/08, e il verdetto che si è mosso vale più del numero.**
      La riga *hazard / near-miss tracking* di Campo era «**C'È A METÀ**
      (nell'ecosistema)», e la metà mancante era proprio Campo: è stata
      costruita il **03/08 alle 12:57** (`88bc73f`), **tre ore e quarantotto
      minuti dopo** la verifica di quella mattina. Prova:
      `grep -ciE 'near-miss|mancato infortunio' apps/campo/campo-data.js
      apps/campo/index.html` → **11 e 14**, dove il 03/08 dava 0 e 0.
      ⛔ **E il documento lo sapeva già**: duecento righe più in là il suo
      racconto del 06/08 elencava «il near-miss segnalato dal fronte» fra le
      cose costruite. Il racconto era aggiornato, **la tabella no** — cioè le
      due metà dello stesso file in disaccordo, ed è la ragione per cui la
      direttiva 7 chiede di aggiornare *la riga che aveva proposto il lavoro*
      e non solo di scrivere che il lavoro è fatto.
      ⚠️ **E la correzione facile è stata rifiutata con la misura**: restava
      davvero una mancanza vicina — l'`hazard` come *condizione insicura*,
      distinta dal near-miss (`grep -ciE 'hazard|condizione insicura|
      osservazione di sicurezza'` su Campo e Scudo → **0 ovunque**) — e sarebbe
      bastato appoggiarcisi per tenere in piedi il verdetto vecchio. È una
      mancanza **diversa** da quella dichiarata: sta scritta come nota nuova,
      non usata per non far scendere il numero.

      ⚠️ **Correzione dello stesso pomeriggio: 41 → 42.** Il primo conto cercava
      `CONFERMAT[AO] ASSENTE` e ha perso l'unica riga al plurale, «CONFERMATE
      ASSENTI». Censito il vocabolario intero della colonna del verdetto:
      **C'è 31 · CONFERMATO/A/E ASSENTE/I 42 · C'È A METÀ 19 · FALSA 4**.
      Un conto fatto con un termine invece che col vocabolario sbaglia sempre in
      difetto, ed è la ragione per cui il vocabolario adesso è scritto qui.
      ⛔ **E QUELLA CORREZIONE ERA SBAGLIATA: IL NUMERO GIUSTO È 41, non 42.**
      Rimisurato il 09/08 contando **solo le celle di tabella**, non le
      occorrenze nel file:
      `grep -cE "^\s*\|.*\*\*CONFERMAT[AOEI] ASSENT[EI]\*\*" docs/CONCORRENTI_*.md`
      → campo 11 · conti 8 · flotta 5 · **scudo 1** · sentinella 13 · terra 4.
      Ma quell'uno di Scudo, aperto, è la **riga d'intestazione della sezione**
      — «**CONFERMATE ASSENTI** — in ordine di quanto le chiederebbe un
      ispettore» — non il verdetto di una funzione. Quindi i verdetti veri sono
      **41**, e Scudo resta a **zero**.
      ⚠️ **Il segno c'era e nessuno l'aveva letto: gli addendi non tornavano.**
      La riga scriveva «11 · 13 · 8 · 5 · 4 · 0 = **42**», e quella somma fa
      **41**. È il difetto che `CLAUDE.md` chiama la **quarta forma
      d'invecchiamento** — un numero fuori dalla portata del controllo, con la
      somma scritta accanto che lo smentisce — e stavolta l'aveva prodotto
      proprio la correzione che diceva di aver reso il conto più preciso:
      allargare il vocabolario al plurale ha fatto entrare **un'intestazione**.
      ⛔ La lezione, che è nuova: **un vocabolario più largo prende anche le
      righe che PARLANO del verdetto invece di darlo.** Il filtro che le separa
      non è la parola, è **dove sta**: una cella di tabella con altre due celle
      accanto, non una riga che apre una sezione.
      ✅ **E DA OGGI QUEL NUMERO È SORVEGLIATO**, invece di essere ricontato a
      mano ogni due giorni: `numeri-nei-documenti.mjs` conta i verdetti **dai
      sei documenti** e li confronta con quello che questa riga dichiara. Niente
      soglia scritta a mano — un numero **derivato**, che cade se una mancanza
      si chiude e qualcuno aggiorna il documento senza aggiornare la roadmap.
      Cioè fa scattare esattamente la regola «chi chiude un'unità aggiorna la
      riga che gliel'aveva proposta».
      ⚠️ Controprova fatta (copia + ripristino + `diff -q`): rimettendo «42» il
      controllo cade e **stampa la scomposizione per app**, così chi legge sa
      subito dove guardare.
      ⛔ **E APPENA IL CONTROLLO HA STAMPATO LA SCOMPOSIZIONE, IL NUMERO È
      CAMBIATO UN'ALTRA VOLTA: 47.** Vederlo per app — «scudo **0**» accanto a
      un documento che nel suo riepilogo scrive «Confermate assenti: **6**» —
      ha reso ovvio quello che due conti a mano non avevano visto. Le tre
      stesure di oggi, con la causa di ognuna:
      · **42** — cercava la parola nel FILE: prendeva un'intestazione di sezione;
      · **41** — cercava la forma in **grassetto**, che usano cinque documenti
        su sei: Scudo scrive `CONFERMATA` liscio, e contava **zero**;
      · **47** — il verdetto **comincia** con «CONFERMATA» ed è **maiuscolo**.
        La maiuscola serve: senza, entrava
        `| quando | confermate | false | ⏱️ scadute | a metà | totale |`, cioè
        l'intestazione della tabella di riepilogo di Sentinella. E «comincia»
        serve: «⏱️ **A METÀ** — *era* CONFERMATA» è una mancanza **chiusa**,
        che il verdetto nomina solo per raccontarne la storia.
      ⚠️ **Tre numeri in un giorno, una causa sola**: il righello guardava una
      **forma di scrittura** invece del verdetto — che è alla lettera quello che
      questa riga diceva già in prosa, e che nessuno aveva applicato al proprio
      strumento. Adesso il criterio è *dove comincia la cella, e con che
      maiuscole*: la cosa più vicina al significato che si possa chiedere a un
      testo.
      ⏱️ **E LE «SCADUTE» SONO 13, NON 18** — misurate con lo stesso criterio e
      da oggi sorvegliate anche loro: campo 3 · conti 3 · flotta 0 · scudo 2 ·
      sentinella 3 · terra 2.
      ⚠️ **E il 18 non si ricostruisce, va detto invece di aggiustarlo a
      posteriori.** Provate le combinazioni ovvie: i verdetti `SCADUTA` sono
      **13**; aggiungendo le righe «⏱️ A METÀ — *era* CONFERMATA, colmata a
      metà» (3, tutte in Scudo) si arriva a **16**. Nessun criterio che abbia
      provato dà 18. Il numero veniva da un conto a mano del 07/08 e non è
      ricostruibile dai documenti: **si sostituisce con quello misurato e si
      dichiara che non torna**, invece di inventargli una definizione che lo
      giustifichi.
      ✅ E **lo zero di Scudo non c'era mai stato**: quel documento è
      confrontabile con gli altri cinque, scrive solo il verdetto senza
      grassetto. Cade con lui anche la nota qui sotto sull'«uniformare le sei
      tabelle» — resta vero che Scudo le **ordina** per sezione invece che per
      verdetto, ma i suoi verdetti si contano come gli altri.
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
      ✅ **CENSIMENTO CHIUSO IL 09/08: tutte e 47 rilanciate una per una, ZERO
      verdetti cambiati, DODICI prove che non tornavano più.** Per app: terra 4
      (3 prove scadute), flotta 5 (3), scudo 6 (**0**), conti 8 (4), campo 11
      (1), sentinella 13 (1).
      ⛔ Il risultato che conta non è il 47: è che **le verifiche erano fatte
      bene e a marcire è solo il modo in cui sono scritte** — e marcisce
      **perché il repository cresce**. Le quattro cause, adesso in `CLAUDE.md`:
      un termine corto dentro parole comuni (`miglia` in `famiglia`), una
      parola polisemica (`firma` di una **funzione**), il nostro gergo che
      entra nel conto («questo cantiere» detto del **nostro** lavoro), e
      un'unità che è un pezzo di un'altra (`m/s` dentro `mm/s`).
      ✅ **E lo zero di Scudo, che questa riga chiamava «non confrontabile», non
      c'era mai stato**: il documento scrive `CONFERMATA` senza grassetto, ecco
      tutto. Ne ha **sei**, e sono anche le uniche sei prove che riproducono
      **tutte** — perché ogni sua riga porta il **comando** con le alternative
      e l'uscita attesa invece di un conteggio. Cade quindi il «uniformare le
      sei tabelle»: quello che va uniformato è la **forma della prova**, non la
      tabella, ed è scritto in `CLAUDE.md`.

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
      ⛔ **⏱️ RIMISURATO IL 09/08, E DELLE TRE «DECISIONI» NE RESTA UNA: DUE SU
      TRE ERANO RIGHE MORTE.** Il ragionamento qui sopra è giusto in generale ed
      è stato applicato ai soggetti sbagliati — la terza (`cursor`) era già
      caduta come falso allarme del righello, e adesso cade anche la prima.
      · **`font-size:15px` — INERTE in tre app su quattro.** Prima cosa: gli
        scavalcamenti non sono tre ma **quattro** (c'è anche Sentinella), il che
        sembrava rafforzare il segnale. Poi il carattere: `.arr` conteneva il
        chevron `›`, e il commento in `shared/dw-app-ui.css` dichiarava
        «**nelle sei app, 52 volte**». Oggi il `›` dentro un `class="arr"`
        sopravvive in **Scudo soltanto, 14 volte** — le altre cinque app sono
        passate a un'icona SVG interpolata. Comando:
        `grep -oE 'class="arr[^"]*"[^>]*>\s*›' apps/*/index.html | wc -l` → **14**.
        Le icone le dimensiona `--arr-ico`, che **ogni app dichiara per sé**
        (campo 16, conti 15, flotta 15, scudo 15, sentinella 17, terra 17),
        quindi in Flotta, Sentinella e Terra quel `font-size` non tocca niente:
        sono **residui** di quando `.arr` era un carattere, non un accordo.
        E l'unica che un carattere ce l'ha ancora — Scudo — se lo riscrive a
        15px, cioè la riga condivisa oggi governa **zero caratteri**.
      · **`color:var(--muted2)` — VIVA, e questa sì è una decisione.** `.arr svg`
        dipinge con `stroke:currentColor`, quindi il `color` di `.arr` è ciò che
        colora le icone: campo, conti, scudo e sentinella lo prendono dal foglio
        condiviso, **flotta e terra** lo scavalcano. Due app su sei: sotto la
        soglia con cui `.nav button` è stato cambiato, e resta una scelta di
        palette per app, non un difetto del condiviso.
      ⛔ **DECISIONE, con la misura invece che con l'impressione: NON si cambia
      il valore condiviso.** Toccarlo avrebbe modificato sei pagine sulla forza
      di **tre dichiarazioni che non fanno niente**. È la stessa uscita del
      `.nav button`: «con un solo soggetto che morde, sei file di rischio non se
      li merita — e questo è il conto, non un'impressione».
      ⚠️ La lezione generale, che vale per ogni conteggio letto come consenso:
      **prima di leggere N scavalcamenti come un accordo, si guarda se quelle
      dichiarazioni fanno ancora qualcosa.** Un residuo e una decisione si
      scrivono identici.
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
  ⏱️ **AGGIORNAMENTO DEL GIRO SUCCESSIVO (quello delle 06:56Z, letto alle
  12:0x): 14 KO veri, e sono DUE famiglie sole.** Il giro attesta `494863f` e
  il branch era già avanti di **60 commit, 18 sulle superfici misurate** —
  quindi ogni KO è stato riverificato prima di guardarlo:
  · **7 tendine tagliate** (Scudo 5 + Sentinella 2) → **ancora vere**, ed è la
    famiglia qui sotto: aspetta il fondatore;
  · **3 di Sentinella + 4 di Campo** → **già chiusi nel pomeriggio**, e sono i
    difetti che i cantieri paralleli hanno trovato e io ho corretto: il banco
    li stava misurando su un commit in cui esistevano ancora. Rimisurati sul
    committato con un server mio e il contrassegno riletto: `sentinella-disegni`
    **48/0**, `campo-numeri-tranquilli` **69/0**.
  ⛔ **Cioè zero cantieri nuovi da questo giro**, e non perché non ci fosse
  niente: perché quello che c'era era già stato preso da un'altra strada,
  quattro ore prima che il giro finisse di dirlo.
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
    ⛔ **E QUESTA RIGA ERA FALSA — LA LASCIO CON LA SMENTITA, PERCHÉ L'ERRORE
    VALE PIÙ DELLA CORREZIONE.** Avevo scritto: *«non è un'iniezione scaduta:
    `iniezioni-fresche` dà 215/215 sul bersaglio, e il banco dichiara 6
    iniezioni come live»*. Erano **esattamente** un'iniezione scaduta.
    · il «215/215» era vero e **non voleva dire niente qui**: quel controllo
      leggeva solo le tabelle chiamate `const DIFETTI = [`, e questa si chiama
      `COME_LIVE` — cioè guardava dappertutto tranne dove stavo cercando;
    · il «6 iniezioni come live» era il numero **giusto per contarne 9**: tre
      voci per tre rotte servite, e una delle tre non agganciava mai. Il numero
      basso era il sintomo, e l'ho letto come una conferma.
    Il banco lo diceva anche in chiaro — «⛔ INIEZIONE MANCATA: 0 soggetti» e in
    fondo «l'iniezione «come live» non ha trovato il suo soggetto: **il giro non
    vale**» — dentro un registro da cinquemila righe, e io ho riverificato **due
    volte** questi tre KO credendoli prodotto.
    ✅ **Chiusi il 09/08 re-ancorando l'iniezione: `--live` dà 35/0, 9 iniezioni.**
    Il prodotto era giusto da sempre: sui dati veri la consegna `.txt` **non**
    si dichiara d'esempio, perché il file si chiama `consegna_turno.txt` senza
    marchio e l'avviso non c'è.
    ⚠️ **Da riverificare col flag giusto**: la prima passata che ho lanciato era
    quella di serie e diceva 0 falliti — la riga del giro si chiama «foglio di
    turno · **coi dati veri tace**», e in `tutti.mjs` è `['--live']`. Riverificare
    un KO con la passata sbagliata è il modo più facile di dichiararlo chiuso.
  ✅ **RIVERIFICA COMPLETA: 20 su 20 guardati sul commit di adesso.**
  All'atto della riverifica: **2 chiusi** (il CSV dei costi di Conti) e **18
  ancora veri**. Poi le unità della giornata, e il bilancio finale è questo:
  ⛔ **13 CHIUSI · 7 APERTI, E TUTTI E SETTE GLI APERTI ASPETTANO IL
  FONDATORE** (le tendine tagliate di Scudo 5 e Sentinella 2).
  ⚠️ **E il numero che cambia il modo di leggere il prossimo giro è un altro:
  SEI DEI VENTI NON ERANO DIFETTI DEL PRODOTTO.** Contati per causa, e i conti
  tornano a venti:
  · **7 difetti veri del prodotto, chiusi**: il CSV dei costi di Conti (2, già
    chiusi da altre unità prima della riverifica), le quattro frasi della
    nuvola di Genesi (raggruppamento perso), la manina di Campo su una testata
    di pannello;
  · **6 attese sbagliate o non arrivate del BANCO**: il plurale chiesto su «1
    rapportino»; la scena della disponibilità che non arrivava; la soglia delle
    fasce vuote invecchiata con la dimostrazione; e i **tre** del foglio di
    turno di Campo, dove un'iniezione scaduta faceva servire la dimostrazione
    alla passata «coi dati veri»;
  · **7 difetti veri ancora aperti**: le tendine, che non si chiudono
    accorciando il testo perché quello che sfora è **dato dell'utente**.
  ⛔ La regola pratica che ne segue, e vale per ogni giro futuro: **un KO non è
  un difetto finché non lo si è riprodotto con la SUA passata e con
  l'INIEZIONE VIVA.** Sono due condizioni diverse, e nessuna delle due si vede
  leggendo il registro.
  ⚠️ **E questo conto è già stato sbagliato una volta oggi**, nei checkpoint
  delle 07:18 e 08:15, che dicevano «11 chiusi · 9 aperti» e «undici su venti
  non erano difetti del prodotto». Contati riga per riga sono **13 e 7**, e i
  non-difetti sono **6**: avevo tenuto un totale a mente invece di rifare la
  somma dalla tabella. È lo stesso difetto che i controlli sui documenti
  esistono per prendere, fatto sul documento che li racconta.
  Il dettaglio dei venti, con lo stato di ciascuno:
  | fronte | quanti | nota |
  |---|---|---|
  | tendine di Scudo (`#vf-verbale`, `#vf-ente`) | 5 | 561 px in 284 · 499 in 284 · 254 in 214 |
  | foglio di turno di Campo (`--live`) | 3 | ✅ **chiusi il 09/08 — erano FANTASMA**: iniezione `COME_LIVE` scaduta, la passata «coi dati veri» serviva la dimostrazione. Il prodotto era giusto. `--live` 35/0 |
  | frasi della nuvola di Genesi | 4 | ritaglio e sottocampionamento |
  | stati «non misurato» di Campo | 2 | ✅ **chiusi tutt'e due, e nessuno dei due era il prodotto**: il primo era il banco che chiedeva il plurale su «1 rapportino»; il secondo era il banco che **non sapeva distinguere una scena non arrivata da un prodotto che mente**. `stati-non-misurati` **83/0** |
  | tendina di Sentinella (`#ppv-scelta`) | 2 | **290 px in 284**: sei px |
  | barre di peso di Conti | 1 | ✅ **chiuso il 09/08 — era il BANCO, invecchiato perché la dimostrazione è migliorata**: pretendeva **due** fasce vuote accanto ai 12 €, e da `069d70e` («assente non è corrotto») la demo ha una fattura **senza scadenza**, quindi di vuote ne resta una. Il prodotto disegnava giusto: 3 px per 12 €, 0 px per uno zero vero. `conti-barre-peso` **15/0** |
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
  ⛔ **CAUSA TROVATA, ED È LA TRAPPOLA CHE `CLAUDE.md` NOMINA — CON ME DENTRO.**
  Le frasi si compongono in `_puntiNuvola` con `_ricPlur`, che è `conta` di
  `shared/`, e **`conta` scrive `String(n)`: non raggruppa**. Misurato:
  `conta(41230,'punto','punti')` → `"41230 punti"`. Sulla stessa riga `tot`
  passa da `gnum(tot,0)` e infatti esce `3.000.000`: ecco perché uno è
  raggruppato e l'altro no.
  ⚠️ **E NELLA MIA UNITÀ SU GENESI DI STANOTTE HO FATTO LA STESSA
  SOSTITUZIONE**, in nove punti: `gnum(k.nf,0)+' fori'` →
  `_ricPlur(k.nf,'foro','fori')`. Ho corretto il singolare e **tolto il
  raggruppamento** senza accorgermene. È esattamente *«una funzione nuova che
  prende il posto di una vecchia si porta dietro il mestiere, non le difese»*.
  In pratica non si vede — fori di una volata e referti stanno sotto il
  migliaio — ma **il principio è rotto lo stesso**, e va rivisto insieme a
  questo.
  ✅ **CHIUSO IL PEZZO DI GENESI** (`9907c75`): `_puntiNuvola` compone
  `gnum(n,0) + ' ' + plurale(n, sing, plur)` — il conto lo formatta chi sa
  formattarlo, la parola la accorda chi sa accordarla — e `punti-nuvola` passa
  da **4 KO a 7 passate, 0 fallite**. `shared/` **non è stato toccato**.
  ⚠️ Effetto collaterale preso subito dal giro `node`: l'iniezione di
  `genesi-frasi-limite` citava la riga vecchia. Ri-ancorata, 215/215.
  ⛔ **RESTA IL RESTO, E LA SCOPERTA È CHE NON È SOLO MIO — misurato.** La
  griglia del disegno è limitata (`perRow` fra 3 e **30**), quindi i conti
  costruiti *nell'interfaccia* stanno sotto il migliaio e non si vedrebbero
  mai. Ma i conti che arrivano da un **file importato** non hanno tetto:
  · `holes.length` del **piano XML** — «Piano XML importato: 1234 fori»;
  · `r.campo.foriTot` del **consuntivo di Campo**.
  Il primo passava da `gnum` **prima del 06/08** e ha perso il raggruppamento
  quando è stato portato a `_ricPlur` per correggere il singolare: cioè la
  stessa trappola, **fatta da altri prima che da me**, sulla riga che legge un
  file di un cliente.
  ✅ **CHIUSO IL 09/08, E DALLA PARTE GIUSTA: NON I VENTI PUNTI, LA FUNZIONE.**
  Il passo che avevo scritto qui — «i nove punti miei + i due da import, con la
  forma già provata in `_puntiNuvola`» — era **la strada sbagliata**, e a dirlo
  è una regola che sta in `CLAUDE.md` da giorni: *una copia nasce quasi sempre
  da una firma troppo stretta*, e la cura è **aggiungere alla funzione**, non
  ricopiare il corpo. Contando i punti prima di toccarli sono venuti fuori
  **una ventina** di `_ricPlur`, non nove — e ognuno di quei venti sarebbe
  stato un posto da cui la divergenza può ricominciare.
  Il difetto era **uno solo, nella firma**: `conta` accordava la parola e
  scriveva il numero con `String(n)`, cioè faceva **metà** del mestiere. Adesso
  passa da `perLettura` — il formattatore che sta venti righe più in giù nello
  stesso file — e `conta(41230, "punto", "punti")` scrive «41.230 punti».
  ⛔ **Costo misurato, non temuto**: 139 punti di chiamata in sei app e il
  core, 23 riferimenti nelle suite, **giro `node` 34/0 senza toccare nessuna
  prova esistente**. Cioè nessuna prova asseriva un `conta` a quattro cifre —
  il che è anche il motivo per cui il difetto è vissuto tanto: la
  dimostrazione conta cose piccole.
  ⚠️ **`useGrouping` ESPLICITO**, come pretendeva la riga qui sotto: non si
  chiama `toLocaleString` a mano ma `perLettura`, che lo scrive. La prova nuova
  contiene apposta il caso a **quattro cifre** — `conta(6375, …)` → «6.375» —
  che è l'unico in cui Node e Chromium si scostano al valore di default.
  ⚠️ E **due decimali, non zero**: con `0` un `conta(2.5, …)` sarebbe stato
  arrotondato a «3» in silenzio. Con 2 l'intero resta intero e il decimale esce
  all'italiana («2,5», non il «2.5» col punto che scriveva `String`).
  ⛔ **E le due copie scritte ieri sono state TOLTE**, che è la parte che chiude
  davvero il cerchio: `nPunti` in `_puntiNuvola` e il `gnum + plurale` del
  piano XML erano nati perché la funzione condivisa non finiva il lavoro — ora
  che lo finisce, tornano `_ricPlur`. Una copia lasciata «tanto funziona» è la
  divergenza di domani.
  ⚠️ Le due iniezioni di `genesi-frasi-limite` si sono mosse per la **terza**
  volta in due giorni, stavolta all'indietro: ri-ancorate con la ragione,
  **296/296** e il banco 31/0 sano, 11/11 iniezioni, 16 prove cadute.
  ⚠️ E i tre documenti che dichiarano il conto delle prove *(allora tre; dal
  09/08 sono **quattro**, è entrata questa roadmap)* sono stati aggiornati
  **addendi compresi** (1922 → 1923, 2.370 → 2.371): il controllo guarda il
  totale e non la somma scritta accanto, ed è la quarta forma d'invecchiamento.
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
- [x] ✅ **Chi misura la larghezza dei fogli stampati, e chi no** *(chiuso
  l'09/08: **otto superfici su otto** hanno la misura dentro un banco, e la
  regola della carta sta in un posto solo — `larghezzaCarta`/`regolaPage` in
  `giro.mjs`. La riga resta per intero perché il suo valore è il METODO: un
  righello che misura un foglio da stampa contro la finestra del telefono
  produce **accuse false**, e la correzione «ovvia» era togliere una colonna al
  verbale che l'ispettore chiede per primo.)* — misurato il
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
  **2 nomi in più in tutto** su 327 già legati.
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
  sei suite **2.310**, giro completo **2.694**, e **ogni** addendo della nota
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
  ⏱️ **AGGIORNATA IL 13/08 — e la riga «non ho guardato» che dichiarava era
  FALSA.** «`run-fns.mjs` (21) vuole l'emulatore delle funzioni, che qui non
  parte» non era vero: l'emulatore parte, e le 21 cadevano con
  `functions/not-found` perché `apps/deepwork-id/functions/node_modules` era
  **vuota**. Un `npm ci` e sono **21 passati, 0 falliti**. Il giro adesso ne
  prova **quattro su quattro, 123 prove** (75 · 19 · 8 · 21) e l'elenco `FUORI`
  è **vuoto** — tenuto come riga, non cancellato, così il conto si vede.
  ⛔ Due cose imparate scrivendolo, tutt'e due della famiglia «lo strumento, non
  il mondo»: in un contenitore fresco `firebase` **non è sul PATH** (adesso si
  ripiega su `npx --yes firebase-tools@13`, e lo **dichiara** quando lo fa); e
  senza le dipendenze il giro **si ferma dicendo quale `npm ci` lanciare**
  invece di stampare ventuno rossi che sembrano difetti del prodotto —
  controprovato togliendo la cartella: **uscita 2, niente provato**, e col
  ripristino 123 di nuovo.

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

- [x] ✅ **E QUELLA FRASE, SCRITTA IN FONDO ALLA RIGA QUI SOPRA, DESCRIVEVA IL
  CONTROLLO CHE LA RIGA QUI SOPRA AVEVA APPENA COSTRUITO** *(09/08)*.
  `iniezioni-fresche` cercava `const DIFETTI = [` — **un nome, dentro una
  regex**. Fuori restavano `DIFETTO`, `DIFETTI_MODULO`, `DIFETTI_PAGINA`,
  `DIFETTI_FLOTTA`, `DIFETTI_MOTORE`, `DIFETTO_MODULO`, `INIEZIONI`,
  `COME_LIVE` e ogni tabella scritta come **oggetto** (`DIFETTI = {` per rotta).
  Il conto: **215 iniezioni dichiarate, 296 esistenti** — una su quattro non era
  guardata da nessuno, e il file stampava «zero scadute».
  ⚠️ E si nascondeva meglio di un'eccezione: un elenco dichiarato l'avrei
  riletto (è la disciplina di `sonda-vuoto`, ed è scritta due righe più su), un
  nome dentro una regex **non si presenta come una scelta**.
  **Le tre scadute che c'erano sotto**, tutte per la ragione buona di sempre —
  il codice si è mosso perché è migliorato:
  · `campo-foglio-turno · COME_LIVE`, l'avviso passato a
    `avvisoTestoDimostrazione`: costava **TRE KO fantasma** nel giro del 08/08.
    La passata `--live` serviva la pagina in modo *dimostrazione* e accusava la
    consegna `.txt` di «non dichiarare i dati di esempio» — che li dichiarava,
    perché di esempio lo era davvero. Li avevo riverificati **due volte**
    credendoli prodotto. Adesso `--live` dà **35/0** (era 32/3) e 9 iniezioni.
  · `scudo-frasi-da-uno · DIFETTI_PAGINA`, la frase dell'export cresciuta di un
    ramo in mezzo («di cui N senza nessuna scadenza registrata»). Adesso la
    controprova rimette **17 su 17** e fa cadere 19 prove su 44.
  · `scudo-verifica-periodica · INIEZIONI`, che ha cambiato **file**: il CSV del
    personale è salito nel modulo dati (`csvPersonaleScadenze`). Quel banco la
    saltava in **silenzio totale**, senza nemmeno un conto, e la sua controprova
    diceva «✔ OK» con **2 difetti su 3** rimessi. Adesso 3 su 3, e cadono 7
    prove invece di 5 (il banco serve le iniezioni anche al modulo).
  ⚠️ **La strada senza nomi è stata provata e SCARTATA con la misura**, perché
  nessuno la rifaccia alla cieca: giudicare una tabella dalla **forma** («è una
  lista di coppie di stringhe») dà **9 allarmi di cui 7 falsi** — `COMBINAZIONI`
  di `note-stato` sono classi CSS, `PAROLE` e `PLURALI` sono parole, `GIRI` e
  `LISTE` sono selettori. Quindi il criterio resta il nome, ma **il
  denominatore si dichiara**: le 6 tabelle di coppie fuori dal vocabolario si
  contano e si stampano, così una quarta convenzione compare come un numero
  invece che come silenzio.
  ⚠️ E c'era una **terza convenzione di posizione**, `[nome, cerca, sostituisci]`
  di `salvataggio-offline`, dove nessun elemento è un percorso e il primo è una
  frase in italiano: due falsi allarmi. Quello che tutte e tre hanno in comune è
  che l'iniezione è una coppia **adiacente** — con tre elementi si guarda il
  **penultimo**. E due forme in più: `[cerca, sost, 1]` (le occorrenze attese) e
  la forma a oggetto `{file, da, a}`, che è la più onesta di tutte perché la
  stringa da cercare ha un **nome** e non va indovinata affatto.
  Costo dell'allargamento, misurato **prima** di farlo come pretende la regola:
  **81 iniezioni entrate, 3 scadute vere, ZERO falsi allarmi.**
  Esito: **296 su 296, 44 tabelle in 35 banchi, 0 illeggibili** (erano 215 in
  23). Il fondo dell'asserzione sul denominatore è salito da 100 a **250**: su
  un valore che sale, una soglia bassa è cieca proprio nel verso che rassicura.
  Controprova rifatta rimettendo l'ancora vecchia di `COME_LIVE`: il controllo
  **nomina banco e tabella** e cade.
  ✅ **E LA SECONDA DOMANDA, aggiunta lo stesso giorno: l'ancora è viva — ma è
  viva NEL FILE CHE IL BANCO SERVE?** La prima cerca in qualunque file di
  prodotto, e questo lascia un buco della forma **esatta** che stamattina è
  costata una controprova muta: la riga di `scudo-verifica-periodica` era
  **salita nel modulo dati**, e cercata a tappeto si sarebbe trovata lì e
  dichiarata «viva» mentre il banco non la trovava dove sostituisce.
  Si può chiedere solo dove il bersaglio è **dichiarato** — il percorso nella
  tupla, il campo `file` della forma a oggetto, o la **chiave** dell'oggetto
  per rotta: sono **38 su 296**, quindi è una guardia **parziale** e il numero
  si stampa invece di lasciar credere che valga per tutte.
  ⚠️ Costo misurato prima di scriverla: **zero allarmi nuovi** su 38. Non trova
  niente oggi; chiude una forma che oggi non c'è.
  ⚠️ Provata sul caso storico vero (rimettendo `file: PAGINA` su un'ancora che
  ormai vive nel modulo): la prima domanda dice **✓ viva**, la seconda **✗ non
  lì** e nomina file e riga. È il modo in cui si riconosce che le due domande
  non sono la stessa.
  ⛔ **E una terza strada è stata provata e SCARTATA con la misura**, perché
  nessuno la rifaccia: censire i banchi che **applicano** un'iniezione senza
  dichiarare se l'hanno trovata. Il righello a `grep` dava «2 muti, 36 senza un
  `.replace` riconoscibile» — cioè misurava i **nomi delle variabili**, non il
  comportamento, e 36 identici sono il segno di sempre che si guarda il
  righello. Ma soprattutto la domanda è **già risolta un piano più su**:
  `iniezioni-fresche` gira in `npm test` e controlla **tutte** le ancore contro
  il sorgente vero, quindi un'ancora non può più morire in silenzio per più di
  un commit — che un singolo banco lo dichiari o no. *(Quante siano lo dice il
  comando, non questa riga: `node apps/deepwork-id/tests/iniezioni-fresche.mjs`.
  Erano 296 quando l'ho scritta stamattina, ed è salito nel pomeriggio con i
  banchi nuovi: un numero qui dentro sarebbe già vecchio, e un comando no.)*

- [x] ✅ **La stessa famiglia senza iniezioni: un banco che porta dentro un
  conto della DIMOSTRAZIONE** *(09/08)*. `conti-barre-peso` dava 14 ok e 1 KO,
  e il KO era la **precondizione**: `zeri.length >= 2`, «accanto ci sono fasce
  a zero da confrontare». Quando il banco è nato, «Scaduto oltre 90 gg» e
  «Senza scadenza» erano tutt'e due vuote; poi il commit `069d70e` — *«assente
  non è corrotto: la dimostrazione può mostrare il caso»* — ha messo nella demo
  una fattura **senza data di scadenza**, che è esattamente il caso per cui la
  difesa era stata costruita. Da allora le fasce vuote sono **una**.
  Il prodotto era giusto e lo dicevano già tutte le altre asserzioni: 12 € →
  **3 px**, zero vero → **0 px**, 17 coppie nei pixel del loro rapporto, 0
  collisioni.
  ⛔ **E la correzione NON è «allargare per far passare»** — che qui era a
  portata di mano ed è la trappola scritta nel checkpoint delle 04:54. Il conto
  che serviva davvero è *«lo zero è disegnato zero in modo SISTEMATICO, non per
  caso su una riga sola»*, e non stava lì: sta nella sezione 2, che guarda tutte
  e quattro le liste. Lì il fondo è stato **alzato** da `> 0` a `>= 2` (le righe
  a zero sono **8** e non dipendono da una singola fascia). Nella sezione 1
  resta la domanda diretta, che di vuote ne vuole **una**, e il conto delle
  fasce adesso **si stampa** («1 vuote su 6: Scaduto oltre 90 gg») invece di
  essere una soglia che un dato nuovo fa cadere.
  ⚠️ Verificato che non si perde niente: nella controprova la coppia cade lo
  stesso con una vuota sola — «12 € → 0 px, € 0 → 0 px». Banco **15/0** sano,
  **5 KO** con il difetto rimesso.
  ⛔ La regola che ne esce, ed è gemella di quella delle iniezioni scadute: **un
  banco che porta dentro un numero della dimostrazione invecchia quando la
  dimostrazione migliora, e accusa il prodotto per una cosa che ha fatto il
  prodotto.** Vale per le soglie quanto per le ancore. Si derivano, o si
  stampano accanto al verdetto.

- [x] ✅ **E IL TERZO DELLA GIORNATA È IL PIÙ INSIDIOSO: UN BANCO CHE NON SA
  DISTINGUERE UNA SCENA NON ARRIVATA DA UN PRODOTTO CHE MENTE** *(09/08)*.
  L'ultimo KO di Campo — «disponibilità che non torna» — è caduto **una volta
  su cinque**, con «non compare in `#disp-stato`», e nelle altre quattro è
  passato. Sul commit di adesso, senza toccare niente.
  Ho misurato invece di dedurre: il caso isolato dà **10 su 10**, il banco
  intero **3 su 3**, e nel giro storto la pagina non aveva ancora caricato le
  attività della dimostrazione — quindi lo stato era «non è registrata nessuna
  attività per questo turno» invece della contraddizione. Il prodotto è giusto
  in tutt'e due i rami (`"oltre"` scrive «non calcolabile» col motivo,
  `"non-calcolabile"` scrive «Disponibilità non calcolata» con quello che
  manca): l'ho letto nel reso, non nel sorgente.
  ⛔ **Il segno che l'ha tradito è un numero che nessuno guarda: 82 prove
  invece di 83.** Un caso che cade ne dichiara **una** invece di due — è la
  regola «un banco che crolla dichiara meno prove», qui in versione mite. Senza
  quel confronto avrei aperto un cantiere sul prodotto per la terza volta oggi.
  ⚠️ E questo è il difetto peggiore di tutti e tre, perché è **intermittente**:
  un'accusa falsa che si presenta di rado è indistinguibile da un difetto vero
  quando si presenta, e il giro del browser gira una volta ogni molte ore.
  **La cura**: il caso dichiara una **precondizione** (`pronta`), cioè la cosa
  che deve essere sullo schermo perché la scena abbia senso — qui «N min di
  fermo», il numero che la contraddizione deve superare. Il banco l'aspetta
  fino a 6 s; se non arriva **non accusa**: scrive `⚠️ NON MISURATO`, elenca il
  caso fra le righe «non ho guardato» **prima** dei KO col testo che ha trovato
  davvero, e **esce 1** — un soggetto non misurato non è un soggetto a posto.
  ⚠️ Provata nei due versi (`cp` + ripristino + `diff -q`): con una `pronta`
  che non arriva mai il banco dichiara il caso e **USCITA=1**, con quella vera
  fa **83/0**. La controprova generale continua a cadere come deve.
  ⛔ È la regola di casa applicata a una **scena** invece che a un'iniezione:
  *un'iniezione si verifica dove il programma la legge, non dove l'hai
  scritta.* Qui il programma legge i minuti di fermo del turno, e la scena si
  verifica leggendo che ci siano.
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

- Ultimo checkpoint **per data vera** — ⛔ **questa riga non lo NOMINA più: lo
  fa dire al comando.**

      node apps/deepwork-id/tests/date-checkpoint.mjs

  stampa in fondo *«Da quale checkpoint riparte davvero un ciclo»*, col file
  giusto **e** con quello che si aprirebbe seguendo il nome, e di quanto sono
  distanti.
  ⛔ *Perché è cambiata: qui c'era scritto un nome di file, aggiornato a mano.
  Un puntatore così è sbagliato **quasi sempre**, perché cambia a ogni unità e
  chi chiude l'unità pensa al lavoro, non al puntatore. Misurato: la riga
  diceva `20260808-025303_…` mentre il più recente era di **oggi**, e la nota
  accanto raccontava che la stessa riga era già rimasta indietro **una volta**,
  ferma al 01/08 — cioè «lo aggiorno a mano» era già stato provato e aveva già
  fallito. **Un comando si rilancia; un nome si può solo credere.***
  ⚠️ *Non* il più alto in ordine alfabetico: in `vault/checkpoints/` ci sono
  ancora file **datati avanti** rispetto al giorno in cui sono entrati in git
  (640 precedenti alla regola, contati da `date-checkpoint.mjs`). Chi va per
  nome apre il file sbagliato credendo che sia il più fresco.
- Le decisioni: `docs/DECISIONI_WEEKEND.md` — pagina d'ingresso in cima.
- Stato misurato al **18/08** (lanciando le suite, non a memoria):
  **2.876 prove girano senza rete**. La frase va letta stretta: è la somma
  delle **nove** suite che contano asserzioni (`run-kpi` 2396, `run-stile` 327,
  `run-helpers` 75, `run-pointcloud` 32, `claims-convergenza` 19, `run-manifest` 9,
  `run-demo` 8, `bootstrap-rivendicazioni` 7, `fogli-guardati` 3), non tutto ciò che gira nel
  giro `node` — che di comandi ne ha **34** e di asserzioni ne esegue di più:
  `node apps/deepwork-id/tests/giro-node.mjs | grep -oE '[0-9]+ passati' | awk '{s+=$1} END {print s}'`
  → **2691** al 09/08.
  ⚠️ *Fino all'08/08 questa riga contava **sei** suite e i tre documenti
  sorvegliati ne contavano sette: due convenzioni per lo stesso numero, che è
  il modo più facile di far sembrare sbagliato un conto giusto. Adesso è una
  sola.*
  Copertura **751/751** e nessuna funzione scoperta; **200 esecuzioni** che
  aprono le pagine in un browser vero, da **82** file di banco distinti (contati
  dalla tabella `BANCHI` di `tutti.mjs`, non a occhio dalla cartella, che di
  `.mjs` ne ha di più perché contiene anche gli aiuti — `giro.mjs`,
  `impronta.mjs`, il runner stesso).
  *(Al 08/08 pomeriggio 2.326, 703/703 e 153; al 07/08 sera 2.307; al 07/08
  notte 2.193, 662/662 e 120; al 03/08 pomeriggio 2.092, 649/649 e 84; al 02/08
  1.838, 591/591 e 49.)*
  ⚠️ **Questi numeri non si scrivono a mente, e dal 09/08 tre di loro non si
  scrivono nemmeno a mano**: `numeri-nei-documenti.mjs` adesso sorveglia anche
  **questo file** — il totale delle prove, le esecuzioni del browser e i file
  di banco distinti. Tutto il resto di questa roadmap resta a mano: il
  controllo arriva su tre numeri, non su tutti, e chi la legge lo sappia.
  ⛔ *Perché è cambiato: la riga vecchia diceva onestamente «qui il controllo
  non arriva» — ed era nata la prima volta che questo file era invecchiato
  («120 banchi» quando ne erano 147). **Non ha impedito la seconda.** Al 09/08
  lo stesso numero era scritto qui dentro in **tre valori diversi** (2.366
  nella riga di stato, 2.370 in fondo, 2.371 in un racconto di mezzo) mentre le
  suite ne eseguivano **2.380**, e le esecuzioni del browser erano ferme a 157
  su 159. **Dichiarare un punto cieco non lo illumina**: chi incontra il numero
  non ha modo di sapere se la riga è di oggi o di tre giorni fa, e la
  dichiarazione sta duecento righe più in basso di lui.*

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
      comportamento, senza rete e senza browser**. Quella sera **2.370**, otto
      suite — *e quel «adesso» è invecchiato in un giorno: il valore vivo sta
      nella riga di stato dei Riferimenti, che dal 09/08 è sorvegliata. Un
      racconto datato resta vero; un racconto che dice «adesso» diventa falso
      da solo, ed è la terza forma dell'invecchiamento applicata a noi.*
      ⚠️ E il controllo sugli **addendi** ha fatto il suo mestiere: aggiornato
      il totale, ha visto che la scomposizione accanto sommava ancora 2.367 —
      «due numeri che si contraddicono nella stessa riga».

## 09/08 pomeriggio — le tendine tagliate, e i righelli che dichiarano meno di quello che credono

Blocco a tre cantieri paralleli (Scudo, Sentinella, Conti) lanciati dopo la
lettura del giro, più le unità mie sugli strumenti. **Rimisurato tutto io prima
di scriverlo qui**: niente entra sulla parola dell'agente.

- [x] **Sentinella, le 2 tendine tagliate: chiuse, e la strada tipografica
      SCARTATA COI NUMERI.** `modali-dentro --solo=sentinella` dà adesso
      **1 superficie pulita, 0 cose da guardare** (50 aperture, 594 elementi,
      8 voci di tendina, 140 comandi — denominatori **identici** al prima:
      il banco ha guardato la stessa roba, non di meno).
      ⛔ **I 6 px a 390 non si chiudevano col carattere**, ed è una misura non
      un'opinione: dentro `@media (hover:none),(pointer:coarse)` il foglio
      condiviso scrive `font-size:16px !important`. Col puntatore **fine**
      (come gira il banco) 15 px si ottengono e bastavano; col puntatore
      **grossolano** — il telefono in cava, cioè dove il prodotto vive — restano
      **16**. Rimpicciolire avrebbe chiuso *il righello e non il prodotto*.
      È la regola «si guarda CHI VINCE, non lo si deduce» nella veste peggiore:
      la correzione sembrava funzionare proprio dove nessuno la usa.
- [x] **Conti: un terzo di una consegna spariva da un totale verde.**
      `venditePerProdotto` contava il valore ma non **quello che saltava**, e la
      pagina la correzione ce l'aveva già in **due elenchi su tre** (registro
      Pesate e «Consegnato da fatturare»): la firma della copia debole.
      Rimisurato da me sulla dimostrazione: *Sabbia lavata 0/4 — 68,3 t per
      €605, di cui **24,3 t non valorizzabili**, più di un terzo*, prima
      dichiarati da nessuna parte.
      ⚠️ E la discriminazione che il cantiere ha tenuto invece di collassare:
      «Misto di cava», venduto a tonnellata **senza densità**, ha un valore
      perfettamente calcolabile e resta **non segnalato** — dedurre
      «non valorizzabile» da «senza densità» avrebbe messo un avviso su una
      riga sana. Verificato: `parziale false`.
- [x] **`barra-etichette`: il core entra nel banco dopo due giorni di diagnosi
      inventata**, e la controprova guadagna la scomposizione.
      Copertura **164 → 180 etichette su 28 barre, 14 superfici**; il core
      **16/0** a 430/390/360/320.
      ⛔ **E la scomposizione ha fruttato subito più del core**: la controprova
      completa passa (13 fuori posto) ma dichiara che **su tre superfici
      l'iniezione non morde — core, campo, flotta**. Campo e Flotta erano nel
      banco *da prima*: per loro quella controprova **non ha mai dimostrato
      niente**, e nessuno lo sapeva perché il verdetto era un totale unico.
      *Ogni addendo ha un lettore che lo conosce; il totale no.*
- [x] **`id · amministrazione`, la superficie «NON RAGGIUNTA» del banco delle
      modali: NON è un difetto, è una scelta — misurata, non dedotta.**
      Le sue due conferme («Rimuovere dall'organizzazione?», «Revocare
      l'invito?») non si aprono perché `guard()` in `admin.html` corto-circuita
      senza backend vivo: *«Anteprima: le azioni saranno attive quando il
      backend Firebase sarà configurato»*. Premuto davvero il bottone: `#modal`
      resta senza `show`, zero errori di pagina. La pagina è raggiungibile e
      piena (3 membri + 1 invito, bottoni visibili) — quindi il banco ha
      ragione a dire «non ho misurato niente», e ha torto a lasciarla fra i
      buchi da colmare: va **dichiarata con la sua ragione**, accanto alle
      cinque già dichiarate «senza modali per costruzione».
      ⚠️ Il mio righello ha sbagliato due volte prima di arrivarci: cercava
      `.modal`/`[role=dialog]` quando il contenitore è `#modal` con `.show`, e
      ha risposto «nessuna modale» su una pagina sana. Il sospettato più facile
      è il soggetto; era il righello.
- [x] **Scudo, le 4 tendine `#vf-verbale`: chiuse. Resta `#vf-ente`, che aspetta
      te.** `modali-dentro --solo=scudo` va da **5 KO a 1**, rimisurato da me;
      i denominatori reggono (12 aperture, 120 voci di tendina, 1 superficie su
      1) e le «voci tagliate ma non scelte» scendono da 13 a 10.
      La strada NON è stata quella del prefisso comune (scartata in roadmap):
      è per **singolo documento** — si toglie dal titolo l'apertura che ripete
      il tipo del documento stesso — quindi risponde uguale con due voci o con
      duecento, e il confronto passa da `normalizzaTesto`, che esisteva già.
      ⚠️ E ha trovato un difetto **latente che nessun banco diceva**: la voce
      vuota «— nessun verbale collegato —» è quella **selezionata di default**
      su una verifica appena aperta e a 320 px chiedeva 217,9 px in 196. Nella
      dimostrazione tutt'e due le verifiche il verbale ce l'hanno già, quindi
      quel caso non si presentava mai.

### Quello che questi tre cantieri lasciano aperto (dichiarato, non taciuto)

- ✅ **`accorciaVoceTendina` NON si sposta in `shared/` — deciso con la misura il
  09/08, riverificato il 14/08, e questa riga resta solo per non farlo rinascere
  una terza volta.** Scudo ha la stessa domanda e ha imboccato un'altra strada
  (`voceDocumentoInElenco`, per singolo documento): non è un duplicato, e il
  commento di Scudo dice **per iscritto** che lì il troncamento non si vuole.
  Chi la chiama, misurato sul codice senza commenti in 51 file di prodotto: **3
  occorrenze, tutte in Sentinella**. La regola del `shared/` scatta su «serve a
  due app», **non** su «potrebbe servire».
- ⚠️ **`#vf-esito` di Scudo**: «— nessun esito registrato —» chiede 201,9 px in
  196 a 320. Stesso difetto latente appena chiuso su `#vf-verbale`, su un campo
  diverso, mai finito in un KO. **Non toccato**, segnalato.
- ✅ **`contrasto.mjs` non apre le modali** — *era* un buco del banco (613 testi,
  0 sotto soglia, ma nessuno dentro una finestra): il contrasto delle note nuove
  era stato misurato **a mano in scratchpad** — 6,03:1 buio, 7,38:1 chiaro,
  10,39:1 sole — cioè fuori da qualunque prova che giri da sola.
  **CHIUSO il 09/08 con DUE passate, che stanno insieme e non una al posto
  dell'altra**, perché rispondono a due domande diverse:
  · `--modali` **raggiunge le finestre col gesto**: 90 finestre aperte su 186
    candidate, **4.686 testi**, 1 sotto soglia (il core, poi corretto). Copre il
    **corpo** che ogni app si costruisce con classi sue;
  · `--forzate` **fa comparire le finestre che il gesto non raggiunge**: 206
    aperture su 9 superfici, **124 testi distinti**, 0 sotto soglia. Copre le
    **parole della struttura condivisa** — titolo, corpo, bottoni del piede —
    che sono le stesse per tutte le conferme e che nessun gesto apre da solo.
  ⚠️ **Denominatore dichiarato, non nascosto**: su **cinque** superfici
  (`vetrina`, `id · non autorizzato`, `genesi · accesso`, `id · accesso`,
  `id · profilo`) la passata forzata misura **0 testi**, perché lì nessuna
  finestra si apre. Il banco le **nomina** e dice a lettere che «non vuol dire
  *a posto*: vuol dire che lì questa controprova non ha potuto dire niente» —
  invece di contarle fra le cieche, che le avrebbe fatte sparire in un numero.
  ✅ Controprova completa: **9 superfici avvelenate, 9 l'hanno bocciata**, e il
  testimone `color-mix` bocciato **0 volte su 9** (deve essere 0, se no il
  righello accuserebbe un colore sano).
  ⏱️ **E IL 09/08 A SERA, TRE LARGHEZZE INVECE DI UNA — con due scoperte che
  valgono più della copertura aggiunta.**
  ⛔ **La larghezza di prima era 430 px, e non stava scritta in nessun punto di
  `contrasto.mjs`**: è il valore predefinito di `apriSuperficie` in `giro.mjs`
  (`larghezza = 430`). Quattordici superfici, tre temi, quattro passate — **un
  telefono solo**, e un numero che **non si presentava come una decisione**.
  Adesso ne gira **tre** (`--larghezze=`, lo stesso nome che usa già
  `fuori-schermo.mjs`: battezzare la stessa idea in un secondo modo è la
  divergenza che si paga più cara).
  ⛔ **E SOTTO C'ERA UN DIFETTO VERO, PREESISTENTE, IN UNA CONTROPROVA CHE NON
  POTEVA PASSARE.** `--modali --controprova` contava fra le **cieche** le sei
  superfici che di finestre non ne hanno **nessuna**: la passata registrata
  stampava «CONTROPROVA INCOMPLETA» e usciva **1**. Riprodotto in un minuto a
  430 px senza larghezze (`--solo=vetrina` → «1 avvelenata, 0 l'hanno
  bocciata», uscita 1). Corretto con l'esenzione già scritta per `--forzate`,
  tenuta **stretta**: si scusa solo dove non si è aperta **nessuna** finestra —
  se una finestra si apre e il veleno non arriva, resta cieca e la controprova
  cade. È la stessa distinzione di tutta la giornata: «non ho potuto guardare»
  non è «ho guardato e va bene».
  ⚠️ **A 320 px la soglia si sposta davvero, e nessun banco poteva vederlo**: i
  testi che dentro le finestre prendono la soglia del «testo grande» (3:1) sono
  **20 a 430 px, 20 a 390, 15 a 320** — **cinque cambiano soglia a 4,5:1 senza
  cambiare colore**. Sono cinque numeri `.sv` a 20px nel **core**, e il
  meccanismo è verificato sul sorgente: `.sv{font-size:20px;font-weight:800}` e
  un `@media(max-width:360px)` che li porta a **18px** — 20px in grassetto sta
  **sopra** il confine dei 18,66, 18px sta **sotto**. Oggi reggono anche 4,5:1
  (**0 KO**), ma il margine si è stretto e va saputo.
  ✅ Esito delle tre larghezze: `--modali` 90 finestre su 186 a ciascuna,
  **952 testi**, **0 KO**; `--forzate` 206 aperture, **106 testi**, **0 KO**.
  Controprove: 27 superfici·larghezza avvelenate su `--forzate`, **27 bocciate**,
  testimone 0; 16 su 16 su `--modali`, testimone 0.
  ⚠️ E tre difese di righello aggiunte, di cui una che avrebbe fatto stampare
  «0 sotto soglia» **senza aver misurato niente**: la chiave dei doppioni non
  portava la larghezza, quindi 430 si mangiava 320.
- ⚠️ **`.avatar.warn` non è dipinta da nessuno** (l'unico stato che il foglio
  condiviso conosce è `.sup`), e resta viva in `ric-list` di Conti da prima di
  oggi. `classi-orfane` non la vede perché guarda il **nome** — `warn` è
  vivissima come `.badge.warn` — non la **combinazione**.

- [x] **B5 (com'era, e resta per la MISURA che l'ha aperta — non è lavoro da
      fare: la chiusura è la voce «LE RIGHE CHE L'IMPORT CANCELLA ADESSO SI
      VEDONO», più giù in questo file). I LETTORI CSV CHE CANCELLANO UNA RIGA IN
      SILENZIO — il rovescio esatto della passata di stanotte.** ⏱️ *Aperta il 13/08 dalla ricerca
      sull'assenza dichiarata (`docs/RICERCA_CONTINUA_ASSENZA.md`), con i numeri
      **rimisurati** prima di scriverli qui.*
      Stanotte abbiamo guardato i file che **escono** e trovato sedici difetti.
      Questa riga guarda i file che **entrano**: quando qualcuno importa un CSV e
      a una riga manca un numero, il lettore la **cancella**, e il `.filter` sta
      **dentro** il lettore — che restituisce solo i sopravvissuti. Quindi la
      pagina **non potrebbe dirlo nemmeno volendo**: chi importa 200 righe e ne
      vede 180 non ha modo di sapere quali venti mancano né perché.
      È il principio del fondatore all'ingresso: una riga cancellata in silenzio
      è la forma più tranquilla che l'assenza possa prendere.
      ⛔ **Il numero è di CANDIDATI, non di difetti**, e i due righelli non vanno
      d'accordo: la ricerca dice **13 su 23** («può scartare per un dato
      mancante», giudicato leggendo), il censimento statico rifatto da me dice
      **15 su 23** («scarta e non lo dichiara»). Due domande diverse, due numeri
      diversi — e nessuno dei due è il conto dei difetti: un `.filter` che toglie
      l'intestazione o l'ultima riga vuota è **giusto**. Sulle passate di questa
      forma il rapporto vero è stato meno di uno su dieci.
      ✅ **La forma esiste già in casa e non va reinventata**: `rientroRilievi`
      di Terra torna `{scritti, rientrano, persi:[{nome, ragione}]}`. È l'unica,
      e guarda il giro di andata e ritorno di ciò che scriviamo NOI, non
      l'ingresso di un file altrui — se ne prende la **forma**, non il corpo.
      ⚠️ E il contratto va allargato con la testa: se `parseXCsv` torna un array
      e domani un oggetto, si rompe ogni chiamante (è la famiglia del `NaN`
      silenzioso di `disegnaSpark`). La strada quasi sempre giusta è una funzione
      **accanto**, come `rientroRilievi` sta accanto a `parseRilieviCsv`.
      **Come si misura**: si costruisce un CSV con una riga a cui manca il
      numero, lo si passa al lettore e si **contano** le righe che tornano; e la
      pagina, dopo l'import, deve dire quante sono entrate, quante no e **perché**
      — se no è la guardia scollegata della regola 20.
      *In lavorazione dal 13/08 sui nove candidati di Campo, Conti, Flotta e
      Terra; i sei di Scudo e Sentinella restano da fare (quelle due app le
      stavano scrivendo altri cantieri).*

- [x] ✅ **LA CI ERA ROSSA SU UNA RIGA SOLA DA ORE, E ADESSO IL DIFETTO È
      DICHIARATO INVECE CHE ROSSO.** *13/08.* Il checkpoint `20260813-164000_…`
      fu scritto **predicendo** l'ora invece di leggerla da `date -u`: è entrato
      in git alle **16:37:45**, due minuti avanti. Il file è già stato riscritto
      col nome giusto, ma `date-checkpoint.mjs` legge **ogni percorso mai
      aggiunto** alla storia — di proposito, se no basterebbe un `git mv` per
      farlo tacere.
      ⛔ **Toglierlo davvero chiede un `--force-with-lease`, che è distruttivo e
      resta fermo al fondatore.** Quindi la scelta vera era fra due mali: una CI
      rossa su quella riga sola — che **insegna a non guardare il rosso**, ed è
      il difetto peggiore di tutti, già raccolto in `CLAUDE.md` — e
      un'**eccezione dichiarata per nome**. Scelta la seconda, con la difesa che
      questo repository usa già per le eccezioni: una seconda prova **cade il
      giorno in cui quel percorso smette di essere mal datato**, cioè il giorno
      in cui la storia viene riscritta. **L'eccezione non può sopravvivere alla
      sua causa.**
      ⚠️ E la controprova sta nei **due versi**, senza toccare nessun file (le
      funzioni prendono la mappa): con l'eccezione attiva un **altro**
      checkpoint mal datato cade lo stesso — l'eccezione non è un interruttore —
      e col percorso risanato l'elenco dei mal datati non lo contiene più.
      **Il giro `node` è adesso 34 comandi a posto, 0 caduti**, per la prima
      volta stanotte: **2.913** asserzioni.
      ⛔ **Il blocco NON è chiuso**: la storia va ancora riscritta, e finché non
      succede la voce `SCUSATI` resta lì a dirlo.

- [x] ✅ **B4-ter. DALL'ADEMPIMENTO IN SCADENZA AL REPORT DI ESATTAMENTE QUEL
      PERIODO** *(13/08, Sentinella).* **La forma del difetto è nuova e vale più
      dell'unità**: non un numero falso, ma **un documento vero che risponde a
      un'altra domanda**. Lo scadenzario sapeva QUANDO va consegnato un
      adempimento; il Report faceva **digitare** «dal» e «al»; fra le due cose
      non c'era niente — quindi il periodo lo indovinava chi premeva il bottone,
      e **due date scritte a mano non sono smentite da niente**: i numeri sono
      tutti veri, a essere sbagliata è la **domanda** a cui rispondono.
      Oggi dalla riga della scadenza si arriva al Report con l'intervallo già
      impostato e **dichiarato a schermo** — «Periodo dell'adempimento «X»: dal
      01/04/2026 al 30/09/2026 (183 giorni). Le date non sono state scelte a
      mano.» — e la frase **sparisce** appena si tocca una data, perché da lì in
      poi direbbe il falso.
      ⛔ **`PERIODICITA` non si poteva riusare, ed è la misura che lo dice**:
      quella conta i **giorni** con cui si MISURA un punto («trimestrale» = 90);
      un documento si conta in **mesi di calendario**, se no il trimestre che
      chiude il 30/09 comincia il **03/07** e il report per l'ente non guarda il
      1° e il 2 luglio. Lista nuova `PERIODI_ADEMPIMENTO`, in mesi.
      ⛔ **E il termine di consegna NON ha un ripiego.** Dedurre zero sposta
      **tutto** il periodo in avanti: misurato sulla relazione annuale «entro il
      30/04», il periodo vero è **01/01→31/12/2025** e con lo zero dedotto
      sarebbe stato **01/05/2025→30/04/2026** — un documento vero su un altro
      anno. Uno zero **scritto** è una risposta; uno zero **dedotto** è il
      difetto che questa unità esiste per togliere. Quando non si sa, il bottone
      **dice cosa manca e non naviga**: portare al Report con un trimestre
      plausibile già scritto sarebbe indistinguibile da quello giusto per chi
      legge il documento finito.
      ⛔ **NIENTE INVIO AUTOMATICO, e non è una mancanza da colmare**: siamo una
      PWA senza backend, quindi «invio automatico» scritto in un'interfaccia che
      non invia niente sarebbe un numero tranquillo. La riga di
      `docs/CONCORRENTI_SENTINELLA.md` resta **CONFERMATA ASSENTE** (sentinella
      13, totale 47 invariati); a cambiare è la sua **prova**, che diceva «lo
      scadenzario non produce il report» ed è falsa da oggi — la **terza forma
      d'invecchiamento**, prodotta dal nostro stesso lavoro nella stessa
      giornata.
      ⚠️ **Due difetti li ha trovati lo SCATTO, non il codice**: la coda «copre
      … → …» appesa a `.meta` finiva sotto il `-webkit-line-clamp:2` del foglio
      condiviso — testo morto **proprio sul dato che dice se il report partirà
      giusto** — e l'etichetta a due righe disallineava i campi. Il periodo ha
      adesso una riga sua (`.ade-per`), e il banco **misura** che non sia
      tagliata (`scrollHeight > clientHeight`): un banco che legge il DOM non se
      ne sarebbe accorto, `textContent` c'è anche quando non si vede.
      ⛔ **E la controprova del banco andava fatta UN'INIEZIONE PER VOLTA**: con
      tutte e cinque insieme due difetti **si mascherano a vicenda** (una riga
      già nascosta non può «non sparire») e la controprova dichiara riuscita una
      prova cieca — la **seconda** delle sei cause travestita da verde. Da qui
      `--difetto=N`: singolarmente cadono 4 · 1 · 1 · 3 · 7 controlli.
      Prove: **+16** in `run-kpi` (2124 → 2140, 0 falliti) e il banco
      `browser/sentinella-periodo-adempimento.mjs` (34 ok, 0 KO; controprova 13
      caduti su 34, 5 iniezioni su 5 a segno). Controprova `node`: **16
      iniezioni, 15 distinte, 1 cieca DICHIARATA** — `+periodoMesi` al posto di
      `numeroDichiarato` è difesa in profondità dal limite `>= 1`, e **resta
      nell'elenco con la ragione** invece di essere tolta per avere un conto più
      bello. Fondo di copertura di Sentinella **134 → 139** (conto vero
      139/139): a 134 la guardia stava cinque sotto e non poteva più scattare.

- [x] ✅ **B5. LE RIGHE CHE L'IMPORT CANCELLA ADESSO SI VEDONO, CON LA RAGIONE**
      *(13/08 — nove lettori di Campo, Conti, Flotta e Terra).* Rovescio esatto
      della passata sui file che **escono**: il `.filter` che scarta una riga sta
      **dentro** il lettore, che restituisce solo i sopravvissuti — quindi la
      pagina **non poteva dirlo nemmeno volendo**.
      ⛔ **E il denominatore non somiglia a quelli delle altre passate: nove su
      nove.** Non è un `.filter` scritto male, è **strutturale**, ed è per questo
      che il rapporto «meno di uno su dieci» qui non vale: la domanda era puntata
      su un difetto di forma, non su una svista.
      Misura (righe **scritte → entrate**): `conti.parseFattureCsv` **6→1** ·
      `terra.parseRilieviCsv` **6→1** · `conti.parseIncassiCsv` **5→1** ·
      `flotta.parseTelemetriaCsv` **5→1** · `conti.parseListinoCsv` **4→1** ·
      `conti.parsePesateCsv` 4→2 · `campo.parseSquadreCsv`,
      `flotta.parseMezziCsv`, `terra.parseFrontiCsv` 4→3.
      Il caso peggiore è **Conti fatture**: cinque righe su sei sparivano, e una
      riga persa è un credito che non entra nell'aging, nei solleciti né
      nell'esposizione del cliente — **il totale a schermo è più basso del vero e
      non c'è niente da leggere che lo dica**.
      ✅ **E quello che è SANO non deve dichiarare niente**, misurato e non
      dedotto: `.filter(Boolean)` sulle righe vuote (9/9) e il filtro
      sull'intestazione (9/9) sono giusti; e così la **riga di coda `;;;` che un
      foglio di calcolo salva da sé** — dopo il `trim` non è vuota e arriva fino
      ai filtri, ma contarla vorrebbe dire **accusare l'utente di un difetto del
      suo Excel**. Ha un contatore suo (`vuote`) e resta muta.
      **La forma**: nove funzioni `scarti<X>Csv` **accanto** ai lettori — non un
      ritorno allargato, che avrebbe rotto tutti i chiamanti (è il caso
      `disegnaSpark`) — con la forma di `rientroRilievi`:
      `{lette, entrano, persi:[{nome, ragione}], vuote}`. **Zero chiamanti
      toccati**, e il verdetto **non è riscritto**: si chiede al lettore riga per
      riga.
      ⛔ **Un difetto in più che il censimento non prometteva**: l'import del
      **listino** un conto ce l'aveva già, e sbagliava in due modi — ricontava le
      righe grezze con una **seconda copia** di `isIntestazione` e attribuiva a
      *tutte* le righe cadute la ragione «non avevano un prezzo leggibile»,
      **falsa** quando a mancare è il nome. *Un numero giusto con una ragione
      sbagliata costa più di nessuna ragione.*
      ⚠️ Completata la mappa di `esito` in Campo e Flotta: aveva **due voci su
      tre** e faceva ricadere l'avviso sul **neutro** — «non è successo niente»
      proprio dove la frase dice che delle righe non sono entrate (regola 18).
      ⚠️ **Le iniezioni hanno bocciato due righelli del cantiere stesso**, tutti
      e due nel verso che rassicura (il taglio del gestore cominciava *dopo* la
      riga iniettata; un conto per pagina non vedeva un gestore su due):
      corretti **restringendo**, non allentando.
      ⚠️ E questa unità ha **fatto scadere due iniezioni** di
      `terra-frasi-da-uno.mjs`, che citavano il codice fino al `+ ".");` finale:
      la controprova girava su un prodotto sano **senza che niente diventasse
      rosso**. Rimesse sul bersaglio, `iniezioni-fresche` torna **376/376**.
      Prove: `run-kpi` **2140 → 2182** (+42), banco nuovo
      `browser/import-righe-perse.mjs` (**57 prove**, controprova 8 iniezioni su
      8 → **48 cadute su 57**, soglia **derivata** `prove − CASI.length` e non
      scritta a mano).
      **Debito dichiarato con la misura**: il motore di `frasePersi` è scritto
      **quattro volte**, una per pagina, e va in `shared/dw-app-ui.js` (non fatto
      perché in `shared/` stavano scrivendo altri); e restano **quattro** lettori
      nelle stesse app con la forma mite del difetto — `campo.parsePianoCsv`,
      `conti.parseGareCsv`, `conti.parseClientiCsv`, `flotta.parseRicambiCsv`,
      tutti **3→2** sulla riga senza identità — più i **sei** di Scudo e
      Sentinella, lasciati stare perché ci stavano lavorando altri cantieri.
      ✅ `conti.parseMovimentiCsv` **3→3**: l'unico che già dichiarava gli
      scartati.

- [x] ✅ **B5-bis. I SEI LETTORI DI SCUDO E SENTINELLA — e le sei funzioni che un
      cantiere morto ha lasciato SENZA PROVA.** *Chiuso il 14/08.* Il cantiere è
      morto sul limite di sessione **dopo** aver scritto le funzioni e **prima**
      di provarle: `copertura-funzioni` le ha trovate come «**6 SENZA PROVA**»,
      che è esattamente il caso per cui quel censimento esiste. Le prove le ha
      scritte chi ha raccolto il lavoro, **misurando che cosa le funzioni fanno
      davvero** — non che cosa il cantiere diceva che facessero, perché non ha
      fatto in tempo a dirlo.
      Misura (righe **scritte → entrate**): `scudo.parseScadenzeCsv` **4 → 1**,
      `sentinella.parseAdempimentiCsv` **3 → 1**, `sentinella.parseVolateCsv`
      **3 → 1**, `scudo.parseLavoratoriCsv` e `sentinella.parseRicettoriCsv`
      2 → 1 sulla riga senza identità.
      ✅ **E la decisione sulla data italiana è stata presa bene**: `01/09/2026`
      — il formato che un foglio di calcolo italiano scrive **da solo** — viene
      **rifiutato dicendolo**, con la ragione che nomina il formato che serve
      («va scritta AAAA-MM-GG, non «01/09/2026»»). Un rifiuto **muto** non
      sarebbe stato nessuna delle due scelte possibili.
      ✅ **E le ragioni rispettano la convenzione delle quattro forme** senza che
      il cantiere l'avesse ancora ricevuta quando ha scritto: «non è stata
      scritta» ≠ «non esiste» ≠ «non si legge».
      ⛔ **UN DIFETTO DEL CONTROLLO, trovato dal suo stesso rosso**: il gestore
      dell'anagrafica di Scudo ha rinominato `saltate` in `gia` — **a ragione**,
      perché il vecchio messaggio metteva quattro cose diverse in un numero solo
      — e la **regola 12** di `run-stile` ha smesso di vederlo, perché
      riconosceva i gestori dal **nome del contatore** (`dup|saltat\w*`). Il
      segno non è stato un allarme: è stata la **controprova**, che togliendo la
      difesa dal file vero non produceva **nessuna violazione nuova**. *Una
      regola che smette di guardare un soggetto non lo dice: lo dice solo la sua
      controprova.* Adesso la domanda è **strutturale** — dentro un ramo guardato
      da `.some(`/`.has(`, c'è un contatore che si alza **e** un `continue`? —
      e il costo è stato misurato **prima**: riconosciuti **10 → 11** gestori,
      l'unico che entra è proprio quello rinominato, **nessuno esce**, zero falsi
      allarmi.
      ⚠️ E l'unità ha fatto **scadere un'iniezione** di `scudo-frasi-da-uno`, che
      citava la frase vecchia: rimessa sul bersaglio, `iniezioni-fresche` torna
      **378/378**.
      **Misure**: `run-kpi` 2223 → **2229** (+6, le sei prove mancanti);
      `run-stile` **321/0**; copertura app **751/751**; giro `node` **3.023**
      asserzioni, **34 comandi a posto, 0 caduti**.
      ⛔ **E QUI VA CORRETTA UNA COSA CHE AVEVO SCRITTO IO POCHE ORE PRIMA, ED
      ERA FALSA.** Avevo lasciato scritto: *«`scartiVolateCsv` nomina la riga
      persa con l'ORA quando a mancare è la data, quindi due righe diverse si
      chiamano tutt'e due «10:00»»*. **Non è vero, e il difetto era nella mia
      prova**: il CSV che le avevo passato aveva le colonne
      `data;ora;cava;…` mentre il lettore vuole `data;fronte;nFori;…`, quindi
      il campo che il messaggio usa per il nome pescava l'**ora**. Con un file
      vero il prodotto risponde bene: «**Fronte Sud** → la data non è stata
      scritta» e «**Fronte Est** → la data non esiste», e il ripiego
      `cod || fronte || "riga N"` c'era già.
      ⚠️ **È la terza volta in una notte che una fixture sbagliata accusa un
      prodotto sano** (le altre due su `parseScadenzeCsv` e `parseFattureCsv`, e
      tutt'e due erano colonne indovinate invece che lette). La regola di casa
      esiste già — *«prima di dire che c'è un difetto va letto COME il codice si
      aspetta i dati: una prova sbagliata che accusa il codice fa perdere più
      tempo di nessuna prova»* — e stanotte l'ho pagata tre volte. La difesa che
      costa dieci secondi: **si legge la riga di destrutturazione del lettore
      prima di scrivere il CSV**, non dopo che il numero non torna.
      ⛔ E la ragione per cui questa correzione è scritta invece che cancellata:
      una riga di roadmap che propone un lavoro **manda qualcuno a farlo**. Un
      difetto immaginario lasciato scritto costa un cantiere.
- [x] ✅ **B6 — CHIUSA il 14/08, e il candidato era un difetto: 26 contatori
      dicevano «0» dove non era stato misurato niente.** La finestra è **larga e
      osservabile**, e il perché è misurato: `window.go` arriva da
      `shared/dw-app-ui.js` in **45–176 ms** mentre il programma dell'app aspetta
      il proprio modulo dati — quindi in quella finestra la barra in basso
      **funziona** e si aprono tutte le sezioni.
      **Denominatore: 19 schermate su 19 fotografate dentro la finestra** (Campo
      5, Scudo 8, Sentinella 6), **42 numeri visibili** misurati (26 contatori +
      16 KPI).
      · **26 contatori a «0»** — `Squadre in turno 0`, `Chi c'è oggi 0`,
        `Lavoratori 0`, `Permessi di lavoro 0`, `Centraline e sensori 0`,
        `Registro volate 0`… — corretti a **«—»**, 30 in tutto.
      · **16 KPI non erano un difetto**: nascevano già «—». La forma giusta era
        **nella stessa pagina, due righe più su**.
      ⛔ **E il censimento per parola della voce era un falso positivo per
      intero**: l'`1` di Campo è un commento sulla foto, i `2` di Terra sono la
      data di caricamento *nel visore*. Le app hanno **zero** parole per «sto
      caricando» — la forma da riusare non era quella, era il «—» dei KPI.
      ✅ **Misura del dopo, stesso ritardo e stesse 19 schermate: 0 numeri
      tranquilli su 42.** E il **verso opposto** misurato apposta: dopo l'arrivo
      dei dati **nessun contatore resta «—»** (54 guardati) — scrivere «non lo
      so» dove la verità è un numero sarebbe peggio del difetto.
      **Il banco**: `browser/finestra-caricamento.mjs`, soggetti presi dal **DOM**
      e non da un elenco (un contatore nuovo scritto con «0» cade da solo), col
      contrassegno del pid riletto dal server. Sano **15/0**; controprova **30
      iniezioni su 30 sul bersaglio**, 3 KO voluti; registrato in `tutti.mjs`.
      ⚠️ Un difetto del righello, trovato e corretto: `pon-tot` esiste identico
      in Campo **e** Sentinella, e un insieme di sole stringhe contava 29 su 30 —
      il banco si accusava da solo di un'iniezione scaduta inesistente.
      ⏱️ **Candidato misurato e NON corretto** (è un'altra famiglia): dentro la
      finestra **i comandi delle sezioni sono morti ma sembrano vivi** — premuto
      «Aggiungi» in tutt'e tre le app non succede niente, nessun toast, nessun
      errore. È la famiglia di `chiediDati`, e vuole una decisione su *che cosa*
      deve dire la pagina.

- [x] **B6 (com'era, e resta per la MISURA che l'ha aperta — non è lavoro da
      fare). «NON ANCORA CARICATO» NON È «NON C'È» — la quarta faccia del tema
      della settimana, e per ora è un CANDIDATO, non un difetto.** ⏱️ *Aperta il
      13/08 a notte, dopo che le prime tre facce erano chiuse: i file che
      **escono** (16 difetti), i file che **entrano** (9 lettori su 9), e il
      documento vero che risponde a un'altra domanda.*
      La domanda: **fra l'apertura della pagina e l'arrivo dei dati, che cosa
      c'è scritto sullo schermo?** Se in quella finestra un KPI disegna «0» o un
      elenco dice «nessun rilievo», l'app sta dicendo una cosa **falsa e
      tranquilla** — ed è lo stesso principio del fondatore applicato al
      **tempo** invece che al dato: *l'assenza di un dato non è un dato
      favorevole*, e «non lo so ancora» non è «non c'è».
      ⚠️ **Il segnale, e va letto per quello che è.** Comando:
      `for a in campo conti flotta scudo sentinella terra; do grep -ciE
      "caricamento|sto caricando|non ancora caricat" apps/$a/index.html; done`
      → **campo 1 · terra 2 · conti 0 · flotta 0 · scudo 0 · sentinella 0**.
      Quattro app su sei non hanno **nessuna** parola per dire «sto caricando».
      ⛔ **Ma questo NON è il conto dei difetti**, ed è esattamente l'errore che
      questo file ha già pagato tre volte: un censimento per **parola** misura
      una forma di scrittura, non la verità. Un'app può non avere quella parola
      **perché non le serve** — se disegna solo dopo aver ricevuto i dati, la
      finestra non esiste e non c'è niente da dire.
      ⚠️ E leggere il codice non basta a chiudere la domanda: in Scudo lo stato
      nasce come `let LAV = [], SCA = [], …` e `refresh()` è chiamata più giù,
      ma **se paint e caricamento si incrocino lo dice solo l'orologio**, non
      l'ordine delle righe. Dedurlo da qui sarebbe la diagnosi pubblicata e
      falsa già pagata il 07/08.
      **Come si misura** (ed è l'unica cosa che chiude la voce): si apre la
      pagina con la sorgente dati **rallentata** — un ritardo iniettato nella
      risposta HTTP del modulo dati, mai sul file — e si **fotografa lo schermo
      prima** che i dati arrivino. Il KO è un **numero o una frase tranquilla**
      in quella finestra: «0 mezzi», «nessuna scadenza», un KPI a zero. Il
      denominatore da stampare è **quante schermate si sono riuscite a
      fotografare in quella finestra**: se la finestra è troppo stretta per
      essere vista, quello è il risultato e va scritto — non un verde.

- [x] ✅ **LA CONVENZIONE DELLE RAGIONI — misurata invece che decisa, ed è un
      risultato BUONO.** *13/08, a valle di B5.* Censite le ragioni dei `persi[]`
      delle nove funzioni `scarti<X>Csv`: **17 stringhe distinte**, e — **senza
      che nessuno le avesse coordinate** — convergono su **quattro forme sole**:
      · «X **non è stato scritto**» — il campo è vuoto, nessuno l'ha compilato;
      · «X **non si legge**» — c'è qualcosa, ma non è un numero o una data;
      · «la data **non esiste**» — forma giusta, giorno inesistente (`2026-13-45`);
      · «X **è negativo**» — valore fuori dominio;
      più «manca il cliente» / «manca il nome della squadra» per l'identità.
      Comando: `grep -rhoE '"(il |la |l.|manca|non )[^"]{6,60}(scritt|legge|
      misurat|esiste|negativ)[^"]*"' apps/*/[a-z]*-data.js | sort | uniq -c`.
      ⚠️ **E la prima domanda era quella sbagliata**: cercando `ragione: "…"` il
      censimento ha risposto **zero**, con la faccia con cui avrebbe detto la
      verità — le ragioni non sono scritte come letterali di quel campo, si
      compongono. È la regola già scritta, incontrata di persona.
      ✅ **La distinzione fra «non è stato scritto» e «non si legge» va tenuta**,
      e non è pignoleria: è la stessa che gli standard internazionali fanno fra
      *missing* e *invalid* (vedi `docs/RICERCA_CONTINUA_ASSENZA.md`), e per chi
      riceve il file cambia **che cosa deve andare a chiedere**.
      ⚠️ **Niente punto finale**: sedici su diciassette non ce l'hanno, perché la
      ragione si compone dentro una frase più lunga. La diciassettesima **non è
      una ragione di lettore** — è un `motivo` di Terra che chiude una frase sua,
      e lì il punto è giusto: guardata prima di «correggerla», che l'avrebbe
      rotta.
      ⛔ **Perché è stata scritta ADESSO e non domani**: nel momento in cui è
      stata misurata, **due cantieri stavano scrivendo dieci lettori nuovi
      insieme**. È esattamente il punto in cui una convenzione diverge — il
      difetto già pagato qui con la convenzione sui numeri, finita scritta
      quattro volte con tre comportamenti diversi. La convenzione è stata
      **mandata ai due cantieri mentre lavoravano**, col vincolo di dichiarare
      nella consegna ogni forma nuova che dovessero coniare.

- [ ] **B7. `sentinella-periodo-adempimento` È INTERMITTENTE — e va rimisurato a
      MACCHINA FERMA prima che qualcuno ci apra un cantiere.** ⏱️ *13/08, notte,
      rilanciandolo sul committato: è nato oggi e non era mai girato fuori dal
      cantiere che l'ha scritto.*
      Tre passate di fila **sullo stesso commit**, senza che nulla cambiasse:

      | passata | esito |
      |---|---|
      | il cantiere che l'ha scritto | **34 ok, 0 KO** |
      | prima mia | 22 ok, **2 KO**, 2 non misurati |
      | seconda mia | 16 ok, **2 KO**, 4 non misurati |
      | terza mia | **tutto verde** |

      ⛔ **Il totale che scende è il segno**, non i KO: 34 → 26 → 22 asserzioni
      dichiarate. È «un banco che non raggiunge il suo soggetto dichiara meno
      prove», già scritto in `CLAUDE.md`, e qui il banco fa la cosa **giusta** —
      scrive `NON MISURATO`, elenca le righe che non sono arrivate a schermo e
      **non accusa**. Quella parte funziona.
      ⚠️ **Quello che resta da capire è il KO «la pagina non solleva errori»**:
      nelle due passate storte la pagina un errore lo solleva, nella terza no.
      **Non l'ho inseguito adesso, e la ragione è misurata**: mentre giravano,
      sulla macchina c'erano **tre cantieri** con i loro Chromium. Un'accusa
      raccolta sotto contesa è indistinguibile da una vera, ed è esattamente il
      caso che il 09/08 è costato **due riverifiche** perché incontrato da solo,
      senza le passate in cui era verde.
      ⛔ **Quindi non aprire un cantiere su questi due KO senza averli prima
      rivisti a macchina scarica.** Se a macchina ferma spariscono, il difetto è
      la **scena** (la precondizione va allargata anche al controllo degli
      errori di pagina, che oggi non ne ha una); se restano, è prodotto e allora
      c'è un errore vero da leggere nella console.
      **Come si misura**: nessun altro processo pesante in giro (`ps -eo
      pid=,args= | grep chrome`), tre passate di fila, e si guarda **il totale
      delle asserzioni dichiarate** prima dei KO.
      ⏱️ **E il 14/08 la stessa famiglia ha morso una SUITE `node`, non un
      banco** — che è la prova che non riguarda il browser ma la **macchina**.
      Il giro `node --tz` ha dichiarato caduto `funzioni-mai-usate.mjs` **solo
      in ora italiana**, e per un attimo sembrava un difetto che dipende
      dall'orologio (che sarebbe stato serio: l'ora italiana è quella del
      cliente). Rilanciata **da sola**, con lo stesso `TZ=Europe/Rome`:
      **4 passati, 0 falliti**, 699 funzioni guardate. Non era l'orologio: sulla
      macchina c'erano **un giro del browser e un cantiere**.
      ⛔ E il segno che lo distingue da un difetto vero è nel registro: il
      comando è caduto **senza stampare nessuna riga `✗`** — cioè non ha
      fallito un'asserzione, è **morto**. Un test che fallisce dice quale; uno
      che soccombe alla macchina non dice niente.
      **Quindi la regola pratica, per chi legge un rosso mentre gira altro**:
      prima di aprire un cantiere si rilancia **quel solo comando, da solo**. Se
      passa, il rosso parlava della macchina.

- [x] ✅ **IL DEBITO DI B5, CHIUSO TUTTO E DUE** *(14/08, raccogliendo un cantiere
      morto sul limite di sessione prima di consegnare: le sue misure non sono
      arrivate, quindi qui c'è solo ciò che ho **verificato io** sulla copia).*
      **A · `frasePersi` in un posto solo.** Era scritta **quattro volte**, una
      per pagina, in Campo, Conti, Flotta e Terra. Adesso sta in
      `shared/deepwork-id-client/dw-shell.js`, accanto a `conta` che già usa.
      ✅ **E la misura dice una cosa che vale la pena scrivere: le quattro copie
      erano ancora IDENTICHE carattere per carattere** (stesso md5, `diff` a
      coppie vuoto). Cioè **si è fatto in tempo**: non c'è nessuna divergenza da
      raccontare come era costata la convenzione sui numeri, finita scritta
      quattro volte con tre comportamenti diversi. Questa volta la regola di
      `shared/` è stata applicata **prima** che il costo maturasse.
      ⚠️ E la guardia non è scollegata: `run-stile` ha una **regola 32** che
      pretende che le quattro pagine **la usino davvero** invece di tenersene una
      copia. Non poteva essere gratis — `UI_CONDIVISA` è derivato dai `window.X =`
      di `dw-app-ui.js`, e questa funzione sta in `dw-shell.js`, che è un modulo
      ESM: il controllo è scritto a mano lì, con la ragione.
      **B · I quattro lettori ancora muti**, la forma mite dello stesso difetto:
      `campo.parsePianoCsv`, `conti.parseGareCsv`, `conti.parseClientiCsv`,
      `flotta.parseRicambiCsv` — tutti perdevano **la riga senza identità** e
      nessuno lo diceva. Adesso hanno la loro `scarti<X>Csv` **accanto**, con la
      forma di `rientroRilievi`, e la pagina lo dice.
      **Misure mie, sulla copia**: `run-kpi` 2193 → **2226**, 0 falliti;
      copertura app 741 → **751/751**; condivisi 173 → **174/174** (`dw-shell.js`
      47 → 48); giro `node` **3.017** asserzioni, **34 comandi a posto, 0
      caduti**; `run-stile` **verde** con la regola 32 dentro.
      ⚠️ **Quello che NON posso attestare**: la controprova del cantiere, che non
      ha fatto in tempo a mandarla. Le prove ci sono e passano; che **sappiano
      fallire** lo dirà chi rimette i difetti.

- [x] ✅ **IL CONTROLLO PER ADDENDO, messo DOVE I NUMERI NASCONO** *(14/08, e
      nato da un errore mio di un'ora prima).* Nei documenti avevo scritto
      «**2226 + 318** + 75 + …» dove il vero era «**2223 + 321** + …»: due
      addendi sbagliati **che si cancellavano**. Quindi la somma tornava, il
      totale era giusto, e **ogni controllo diceva ✓** — è alla lettera il caso
      «coerente ma falsa» che `numeri-nei-documenti.mjs` descrive nel proprio
      commento, e che **lì non si può prendere**: quel file non lancia le suite,
      e il conto statico delle prove non funziona perché si generano dentro i
      cicli (**2.122 statiche contro 2.229 vere**). Allargare la regex sarebbe
      la strada sbagliata, come è già scritto nel suo commento.
      Quindi il controllo sta in `giro-node.mjs`, che è **l'unico posto che le
      ha lanciate tutte** e ha il totale di ognuna: confronta **ogni addendo
      scritto nel documento con la suite che l'ha prodotto**, e lo nomina.
      ⚠️ **L'elenco delle otto suite NON è riscritto**: si legge da
      `numeri-nei-documenti.mjs`, che già ce l'ha e nello stesso ordine in cui i
      documenti scrivono la somma — **derivato, non gemello**. Se domani le
      suite diventano nove, il controllo lo sa da sé; e se l'elenco non si legge
      **lo dichiara** invece di tacere.
      ⛔ **E alla prima passata ha trovato un difetto in sé stesso**, che vale
      più della sua nascita: `fogli-guardati.mjs` compare **due volte** nel giro
      (due passate con flag diversi) e la prima stesura le **sommava** — 3 + 7 =
      **10** contro i 3 veri. È la «ripetizione contata come roba nuova» che
      questo stesso file racconta per il **4741** di `orologio-cliente`, rifatta
      da chi la stava citando. Adesso si tiene la **prima** passata.
      **Controprova**, ed è quella che conta: rimessi **due addendi che si
      compensano** (2226 + 324), la somma torna e il totale è giusto — il giro
      cade lo stesso e li nomina tutti e due, con la suite accanto. Ripristino
      da copia con `diff -q`, mai `git checkout`.

- [x] ✅ **B8. IL FILE SBAGLIATO NON ENTRA PIÙ IN SILENZIO — e la difesa non
      rompe il caso che doveva restare.** *Chiuso il 14/08.*
      Importando in Scudo, nell'anagrafica dei lavoratori, un CSV **di fatture**,
      entravano **due lavoratori chiamati «numero» e «2026/001»** e niente lo
      diceva. Adesso il file viene **riconosciuto** e l'app dice **di che file si
      tratta**: «l'elenco delle fatture di Conti».
      ⛔ **La difesa ovvia era già esclusa**, ed è la ragione per cui questa voce
      era stata scritta col limite dentro: i lettori tollerano **di proposito**
      un file **senza** intestazione, perché chi esporta da un gestionale e
      incolla solo i dati deve poter importare. Quindi non si pretende
      l'intestazione: si riconosce quella di un'**altra** tabella e ci si ferma.
      `CSV_TABELLE` in `shared/deepwork-id-client/dw-shell.js` ne censisce **42**.
      ✅ **I tre numeri, misurati da me e non presi sulla parola del cantiere**
      (`fileDiAltraTabella(testo, ammesse)`):
      · **42 intestazioni legittime provate → 0 rifiutate per sbaglio**. È il
        numero da cui dipendeva tutto: un falso allarme qui **blocca un import
        buono**, che è peggio del difetto;
      · un CSV di un'altra app → **riconosciuto**, con l'etichetta leggibile;
      · un file **senza intestazione** → **passa**, come prima.
      ⛔ **E il controllo per addendo, scritto un'ora prima, ha preso ME**: dopo
      questa unità `run-stile` è passata da 321 a **322**, io avevo aggiornato
      solo l'addendo di `run-kpi`, e la somma scritta faceva **2693 contro
      2694**. Il giro l'ha nominato — «l'addendo 2 (run-stile.mjs) dice 321, la
      suite ne ha eseguite 322» — invece di lasciarlo passare come ha fatto
      stanotte con la coppia che si compensava.
      ⚠️ **E una misura buttata, che vale come lezione**: la prima volta ho letto
      «42 su 42 rifiutate per sbaglio» e stavo per aprire un difetto. Era la mia
      prova: `CSV_TABELLE` è un **array**, e passavo l'indice dove la funzione
      vuole l'elenco degli id ammessi. **Quinta fixture sbagliata in una notte**,
      e la regola scritta in `CLAUDE.md` poche ore prima l'ha fermata prima che
      diventasse un'accusa.
      **Misure**: `run-kpi` 2229 → **2238**, `run-stile` **322/0**, condivisi
      174 → **179/179** (`dw-shell.js` 48 → 53), giro `node` **3.033**
      asserzioni, **34 comandi a posto, 0 caduti**.
- [x] ✅ **B9 — CHIUSA il 14/08: `ragioneData` vive in un posto solo, e il
      guardiano è passato da NOVE lettori a DICIANNOVE.**
      · La funzione sta in `shared/deepwork-id-client/dw-shell.js`; Scudo e
        Sentinella la ri-esportano, e la prova pretende l'**IDENTITÀ**
        (`scudo.X === sentinella.X === shell.X`), non il comportamento — due
        copie uguali oggi divergono domani senza che nessuno lo veda.
        Riverificato da me sulla copia: `true` per tutt'e due.
      ⛔ **LA FORMA DELL'ALIAS NON È INDIFFERENTE, ed è una misura.** Scritto
        `export { X } from "…"` l'alias è **invisibile** a `nomi-doppi.mjs`,
        che censisce i nomi con `^export function` e `^export const`. Con la
        forma giusta (`export const ragioneData = ragioneDataShell`) quel
        controllo passa da **38 nomi / 24 alias / 11 coppie** a **40 / 26 /
        13** — rimisurato da me: `40 nomi guardati · 26 alias, 5 divergenze
        dichiarate, 0 da sistemare`. Un alias che non si conta è un soggetto
        in meno guardato, e nessuno se ne accorge.
      ⛔ **E IL VALORE D'ESEMPIO CHE AVEVO SCRITTO IO IN QUESTA VOCE ERA
        SBAGLIATO — l'ha detto il soggetto, aperto prima di scrivere il caso.**
        Dicevo che `01/03/2026` e `2026-02-30` davano la stessa frase: vale per
        i lettori **solo-ISO**, non per `parseTaratureCsv`, che legge con
        `dataIso` e la forma italiana la **accetta** (misurato: entra e diventa
        `2026-03-01`). La coppia che davvero si fondeva è `2026-02-30` contro
        `non lo so`, e adesso dice «la data della taratura **non esiste**»
        contro «**non si legge**: va scritta AAAA-MM-GG oppure GG/MM/AAAA». Il
        vuoto è passato dal dialetto «manca la data della taratura» al canone
        «non è stata scritta».
      ⛔ **La firma ha guadagnato tre parametri** (`soggetto`, `formato`,
        `haForma`) invece di una seconda copia — la copia nasceva proprio da
        una firma troppo stretta, che è la regola già scritta in `CLAUDE.md`.
        Senza argomenti il comportamento è identico a quello delle due copie
        (verificato: «la data non è stata scritta» · «la data non esiste» · «la
        data non si legge: va scritta AAAA-MM-GG, non «boh»»). E `haForma` non
        ricopia le regex di `dataIso`: adesso sono una costante sola.
      · **Guardiano: 19 su 19**, con l'elenco **derivato dal disco** e il
        numeratore **raccolto** dalle tre tabelle di casi (9+4+6) mentre
        girano, non riscritto a mano. L'etichetta vecchia è stata corretta: «i
        NOVE censiti la mattina del 13/08» — **non** «tutti quelli delle
        quattro app», che sono 13.
      ⚠️ **Dichiarato dentro la prova**: «tabella propria» vuol dire un CSV con
        i suoi casi rotti, NON che ogni ragione sia provata. I sei di Scudo e
        Sentinella restano più magri dei tredici.
      ⛔ **E LA CONTROPROVA HA BOCCIATO UNO STRATO DELLA DIFESA**, che vale più
        del difetto: la prova «zero corpi propri» cade su una copia chiamata
        `ragioneData`, ma **non** su una chiamata `ragioneDataPrivata` — è la
        regola già scritta, «le copie deboli hanno sempre un nome diverso».
        L'hanno presa le prove sul **comportamento**, e il limite sta scritto
        accanto alla prova: nessuno legga «zero corpi doppi» come «nessuna
        copia».
      ⏱️ **E un «non c'è» FALSO trovato per strada**, in `apps/scudo/`: il
        commento sopra `ragioneData` dichiarava «in casa NON c'è nessun lettore
        di date all'italiana — provato col `grep`: zero righe». **Sono due**, e
        c'erano già: `dataIso` (Sentinella — la usa proprio l'import delle
        tarature) e `isoDaDataItaliana` (Conti). Il **verdetto regge**, ma è la
        «prova scaduta con verdetto giusto»: rende la riga non credibile, e chi
        la riverifica butta via anche il giudizio.
      **Controprova**: 5 iniezioni → **5 · 2 · 4 · 4 · 3** prove cadute, ognuna
      con l'`assert` sul testo cercato e il ripristino da copia + `diff -q`.
      **Misure, rifatte da me sulla copia di quello che si committa**: `run-kpi`
      2238 → **2248**, 0 falliti; copertura app 751 → **753/753**; condivisi 179
      → **180/180** (`dw-shell.js` 53 → **54/54**, e il fondo alzato con lui);
      `nomi-doppi` 40/0; giro `node` **34 comandi a posto**.

- [x] **B9 (com'era, e resta per la MISURA che l'ha aperta — non è lavoro da
      fare). `ragioneData` È SCRITTA DUE VOLTE, E IL GUARDIANO COPRE NOVE LETTORI
      SU DICIANNOVE.** ⏱️ *Aperta il 14/08 dalla ricerca sulle parole, coi due
      numeri **rimisurati da me** prima di scriverli qui.*
      · `grep -rn "^export function scarti[A-Za-z]*Csv" apps shared | wc -l` →
        **19**. Il guardiano in `run-kpi` ne copre **9**, e la sua etichetta dice
        «tutti e nove i lettori di Campo/Conti/Flotta/Terra» mentre quelle
        quattro app ne hanno **13**: è l'**etichetta più larga del suo numero**,
        e Scudo e Sentinella sono fuori del tutto.
      · `grep -rn "function ragioneData" apps shared` → **due**, identiche
        (`scudo-data.js` e `sentinella-data.js`); `grep -rn "ragioneData"
        shared/` → **niente**. La casa condivisa che il codice stesso dichiara
        **non è mai arrivata**, ed è la regola che questa casa paga più spesso.
      ⛔ **E la divergenza è già cominciata, che è la ragione per cui vale la
      pena farlo adesso**: `parseTaratureCsv` di Sentinella parla un dialetto
      suo — «manca la data della taratura» dove il canone è «non è stata
      scritta», e soprattutto «**non è una data**», che **fonde** «non si legge»
      e «la data non esiste». Sono **due rimedi diversi**: uno si corregge
      riscrivendo il formato, l'altro andando a chiedere il giorno vero. La
      forma giusta sta **nello stesso file, 750 righe più su**.
      **Come si misura**: (1) l'elenco dei lettori si **deriva dal disco**, non
      si scrive a mano, e togliendone uno la prova deve **cadere**; (2) sul
      medesimo valore Scudo e Sentinella devono dare la **stessa identica**
      stringa (`ok(a === b)`); (3) `01/03/2026` e `2026-02-30` devono dare **due
      frasi diverse** (`ok(a !== b)`), dove oggi ne danno una; (4) la funzione
      condivisa si prova per **identità** (`scudo.X === ponti.X`), non per
      comportamento — due copie uguali oggi divergono domani.
      ⚠️ **Non aperto subito perché tocca `shared/`**, dove sta scrivendo il
      cantiere di **B8**: si serializza, come vuole la direttiva.
      ✅ E la parte che **non** va toccata, misurata e scritta perché nessuno la
      «uniformi»: Campo dice «non è maggiore di zero» e Terra «è negativo», e
      **è giusto così** — un foro a zero è sbagliato, un volume a zero è lo
      **zero misurato**. Uniformarle romperebbe una distinzione vera.
- [x] ✅ **B10 — CHIUSA il 14/08: il giro si può lanciare A PEZZI, e un pezzo lo
      DICHIARA.** `--solo=<pezzo>[,<pezzo>]` e `--da=<n>` sul runner, derivati
      dall'elenco `BANCHI` che già esisteva. Misure: `--solo=scudo` sceglie
      **12 passate su 198**, e si porta dietro **5 controprove** dello stesso
      file — un banco scelto senza la sua controprova girerebbe senza la prova
      di saper fallire. Senza filtro restano **198 su 198**.
      ⛔ **La metà che è costata di più non è il filtro, è la DICHIARAZIONE.**
      Un giro parziale stampa le stesse identiche frasi di uno intero: stesse
      intestazioni, stesso «N banchi a posto». Adesso in cima **e** in fondo
      c'è `⚠️ GIRO PARZIALE: N passate su 198 (--solo=…). Le altre M NON sono
      state misurate — e un soggetto non misurato NON è un soggetto a posto.`
      E un nome sconosciuto **ferma il giro prima di alzare il server**
      (uscita 2), invece di uscire zero come faceva `contrasto-non-testo.mjs`.
      ⚠️ **E il righello della prova leggeva 192 passate su 198**: sei nomi
      contengono un apostrofo sfuggito (`che c\'è`, `all\'indietro`) e
      `'([^']+)'` si ferma lì. A prenderlo è stato il **denominatore** scritto
      come asserzione — *quante righe aprono una passata, quante ne ho lette?*
      — non la rilettura. Quarto apostrofo che inganna uno strumento in questa
      casa.
      Prove: `apps/deepwork-id/tests/browser/filtro-banchi.mjs`, **25**, con la
      metà pura sui banchi VERI e tre giri **finti** (niente browser) per il
      collegamento al runner, nei due versi.

- [x] **B10 (com'era, e resta per la MISURA che l'ha aperta — non è lavoro da
      fare). IL GIRO COMPLETO NON PUÒ FINIRE, E ADESSO C'È IL NUMERO.** ⏱️
      *Misurato il 14/08 sul giro lanciato alle 04:29.*
      Dieci passate in **41 minuti** = **4,1 min/passata**; in `tutti.mjs` ce ne
      sono **198**. Sono **13,5 ore**. Cioè il giro **non finisce dentro una
      sessione** — e non è un caso isolato: quello di ieri è stato spento a
      **3h52 con 60 passate**, e i suoi primi KO erano contrasti **chiusi cinque
      ore prima**.
      ⛔ **Il difetto non è che sia lento: è che è ALL-OR-NOTHING.** `tutti.mjs`
      accetta `--limite=`, `--radice-impronta=`, `--banchi-finti` — ma **nessun
      filtro** per lanciare solo le passate che coprono le superfici toccate.
      Prova: `grep -nE "argv|--solo" apps/deepwork-id/tests/browser/tutti.mjs`
      → quattro flag, **nessuno seleziona i banchi**. (I singoli banchi il
      `--solo=` ce l'hanno: manca al **runner**.)
      ⚠️ Conseguenza vera, e si è vista due notti di fila: **l'unica verifica
      completa che questo repository ha non arriva mai in fondo**, quindi o si
      legge un parziale, o si legge un registro che attesta un commit di ore
      prima. Le due letture sbagliate che ne nascono sono già scritte qui:
      **accuse che sembrano fresche** e **KO già chiusi**.
      **Che cosa serve**: un `--solo=<banco|app>` (e/o `--da=<n>`) sul runner,
      derivato dall'elenco `BANCHI` che già esiste — così un ciclo verifica in
      **minuti** le superfici che ha toccato, e il giro intero resta per quando
      c'è una notte da dedicargli.
      **Come si misura**: il conto delle passate lanciate deve **scendere** col
      filtro e restare **198** senza; e un nome sconosciuto deve **uscire
      diverso da zero** invece di lanciare tutto o niente — è lo stesso difetto
      già trovato e chiuso su `contrasto-non-testo.mjs`, dove `--solo=` con un
      nome sbagliato usciva **zero** dichiarando di non aver guardato niente.
      ⚠️ **Non fatto adesso**: `tutti.mjs` è in uso dal giro che sta girando, e
      un cantiere sta scrivendo nella stessa cartella.
- [x] ✅ **DIRETTIVA 7 — i tre delta più morsi riverificati: 61 righe, ZERO
      verdetti sbagliati.** *14/08.* L'arretrato di `documenti-invecchiati` era
      salito a **25 commit, 14 che mordono**: il prezzo di una notte produttiva.
      Riguardate **tutte** le righe di verdetto di Scudo (17), Campo (22) e
      Sentinella (22).
      ✅ **Verdetti cambiati: zero.** Le verifiche erano fatte bene. A marcire è
      la **forma della prova**, ed è la stessa misura del 09/08 (0 verdetti, 12
      prove) — con la causa dominante che **non è un errore di nessuno**: il
      repository cresce, e i due conti caduti davvero sono saliti **perché è
      stato fatto del lavoro buono** (i lettori che dichiarano le righe
      scartate).
      ⛔ **La forma che marcisce di più è il NUMERO DI RIGA**: 41 su 42 delle
      citazioni col nome accanto erano scadute (`indiciInfortunistici`
      dichiarato a 2508, sta a 4002). Nei sei documenti le citazioni `file:riga`
      scendono da **145 a 63** — misurato da me:
      `grep -ohE "[a-z-]+\.(js|html):[0-9]+" docs/CONCORRENTI_*.md | wc -l` → **63**.
      ⛔ **Tre righelli sbagliati trovati, e due li aveva scritti il cantiere
      stesso**: un `grep -c 'a|b'` **senza `-E`** già in casa (cercava la stringa
      letterale e rispondeva **0** — un «non c'è» prodotto dal righello, proprio
      sulla riga che serviva a dimostrare che una cosa **c'è**); un `grep -o`
      senza `-h` su due file, che conta **+1** per il nome del file; e le barre
      di `grep -E` **nude** dentro una cella di tabella, che spezzavano la riga
      in dieci colonne.
      ✅ **E li ha presi il RILANCIO, non la rilettura**: tutti gli **85 comandi**
      scritti nei tre documenti sono stati riesguiti da uno script — **85 su 85
      riproducono l'uscita dichiarata**. È la conferma pratica della regola già
      scritta: *un comando si rilancia, un numero si può solo credere.*
      ⚠️ **Due numeri ricaratterizzati invece che ricontati**, perché un conteggio
      scade e una caratterizzazione no: le occorrenze di `logo` in Campo (che
      crescono da sole con `riepilogoFermi`, `dialogo`, `meteorologo`) e il
      `m/s` di Sentinella, dove adesso la prova è l'**uguaglianza fra due
      conti** — ogni `m/s` è dentro un `mm/s` — che non invecchia.
      **Arretrato**: 25 commit / 14 che mordono → **18 / 5** (rimisurato da me
      dopo aver committato B8: il cantiere aveva letto 12, ed è cresciuto perché
      nel frattempo il ramo si è mosso; i «che mordono» combaciano).

## 14/08 mattina — il rosso che si presenta una volta su trenta

- [x] ✅ **B13 — CHIUSA il 14/08: due trigger sullo stesso utente, e quello
      rimasto indietro CANCELLAVA un'organizzazione dal token.** L'ha aperta la
      CI, cadendo su `run-sdk.mjs` («membro di DUE org cambia org attiva» →
      *Non sei membro di questa organizzazione*) su un commit che conteneva
      **solo un file di checkpoint**. In casa, con gli stessi tre emulatori
      (firestore+auth+functions), **19/0 per tre giri di fila**: tutti i segni
      di quello che si chiama «flaky» e si rilancia.
      **Il meccanismo**: `rebuildClaims` legge le membership e scrive i claims.
      Due scritture di membership ravvicinate sullo stesso utente svegliano
      **due** trigger; quello partito prima ha letto una fotografia in cui la
      seconda membership non c'era ancora, e se la sua scrittura atterra per
      **ultima** nel token resta **una org sola**. Su Firestore la membership
      dice `active`, il token dice di no, e non lo segnala niente — nessun
      errore, nessuna riga di registro — finché qualcuno non riscrive una
      membership.
      **La cura**: dopo aver scritto si **rilegge** (`convergiClaims` in
      `apps/deepwork-id/functions/claims.js`). Il trigger rimasto indietro, alla
      seconda occhiata, vede il mondo completo e rimette a posto ciò che aveva
      appena guastato. Regge perché l'ultimo trigger a partire legge **sempre**
      dopo l'ultima scrittura di membership: il solo modo di finire storti era
      che una lettura vecchia atterrasse dopo la sua, e adesso quella rilegge.
      **Il costo, misurato e dichiarato**: quando non è cambiato niente — il
      caso normale — le scritture sul token restano **una** e le letture
      diventano **due**; solo il trigger in ritardo paga due scritture e tre
      letture. Il tetto è dichiarato: dopo `giriMax` giri si esce con
      `convergiuto: false` e lo si scrive nel registro, invece di girare in
      eterno.
      ⛔ **E la difesa NON poteva essere una prova che aspetta la gara**:
      sarebbe stata verde quasi sempre **anche col difetto rimesso** — 1 su 30
      in CI, 0 su 3 in casa — cioè non avrebbe saputo fallire. L'ordine delle
      mosse è **scritto** con dei finti: «il rimasto indietro scrive per
      ultimo», sempre.
      Prove: `apps/deepwork-id/tests/claims-convergenza.mjs`, **19**, senza
      emulatore; con la forma vecchia rimessa ne cadono **8**. E sotto
      l'emulatore, con la correzione: funzioni **21/0**, SDK **19/0**, primo
      avvio **8/0**.

- [x] ✅ **B14 — CHIUSA il 14/08: nella finestra di caricamento un comando
      premuto non faceva NIENTE, e il silenzio è peggio di un numero falso.**
      B6 aveva curato i **contatori** («—» invece di «0»); restavano i
      **comandi**. La barra in basso funziona (arriva con `dw-app-ui.js`,
      `defer`), quindi si gira per tutte le sezioni — ma le azioni sono
      agganciate con `addEventListener` **dentro il modulo**, che parte solo
      quando `<app>-data.js` è arrivato.
      **Misura (prima schermata, tre app): 18 comandi su 21 premuti senza
      niente** — nessun toast, nessuna modale, nessun errore in console, il DOM
      identico byte per byte. «Segnala un near-miss» in Campo e in Scudo, e
      tutti i riquadri KPI. L'unico che rispondeva era il tasto del tema, che
      vive dentro `dw-app-ui.js`.
      ⚠️ **Non è la stessa famiglia del «0»**: là l'app diceva una cosa falsa e
      tranquilla, qui non dice niente — e su un telefono in cava il silenzio si
      legge «è rotta» oppure «ha funzionato».
      **La cura, in un posto solo**: una guardia in cattura in
      `shared/dw-app-ui.js` che, finché i dati non ci sono, ferma il comando e
      risponde col toast «I dati stanno ancora arrivando: un istante e riprova».
      ⛔ E **il punto in cui si disarma esisteva già**: il corpo di un modulo
      parte solo quando tutti i suoi import sono risolti, quindi la finestra
      finisce esattamente quando il modulo comincia — e la prima cosa che tutte
      e sei le app fanno lì è chiamare `dwUiAggancia`. **Zero righe nelle sei
      pagine.**
      **Provata nei due versi**, che qui è obbligatorio: se la guardia non si
      disarmasse, l'app resterebbe muta per sempre — un difetto peggiore di
      quello curato. `finestra-caricamento.mjs` ha una terza domanda (dentro la
      finestra ogni comando risponde: **55 premuti, 0 muti**) e una quarta
      (dopo i dati nessuno dice più «sto caricando»). **21 passati, 0 falliti.**
      Controprova: neutralizzata la guardia in `shared/`, cadono **le due
      domande su tutte e tre le app** (31 iniezioni su 31 a bersaglio).
      ⚠️ E il verdetto della controprova **non conta più i KO**: contava «uno per
      app», cioè un numero scritto a mano, invecchiato il giorno stesso in cui
      le domande sono diventate due. Adesso tiene, per ogni famiglia, l'insieme
      delle app cadute — una domanda nuova si dichiara lì invece di spostare un
      totale.

- [x] ✅ **B15 — CHIUSA il 14/08: la finestra di caricamento era misurata su
      TRE app su sei, e nelle altre tre il difetto c'era ancora.** Il banco era
      stato scritto sulle app che il difetto ce l'avevano; le altre non erano
      «a posto», erano **non misurate**. Aprendole: **Flotta 10 contatori nati
      «0», Conti 9** — cioè esattamente ciò che B6 aveva curato in Campo,
      Scudo e Sentinella. Corretti (nascono «—»), col commento che spiega la
      ragione dentro le due pagine.
      ⛔ **E la prima misura sulle tre app nuove era FALSA, per la fixture.**
      Il server del banco ritardava `(campo|scudo|sentinella)-data.js` — un
      elenco dentro una regex: aggiungendo tre app all'elenco `APPS` il
      ritardo **non le ha seguite**, i loro dati sono arrivati subito, e il
      banco ha accusato Flotta di **16 «numeri tranquilli»** che erano i
      valori VERI della dimostrazione e di comandi «muti» che invece
      navigavano. Adesso si ritarda il modulo dell'**app che si sta
      misurando**, e il nome lo dice il ciclo.
      **Due eccezioni dichiarate e sorvegliate**, trovate dalla domanda del
      verso opposto («dopo i dati nessun contatore resta —»): i due contatori
      della scheda di un **ordine di lavoro** in Flotta (esiste solo quando
      qualcuno ne apre uno) e il KPI «m³ estratti mese» di Terra, che resta
      «—» perché nella dimostrazione nessun rilievo cade nel mese in corso —
      `fmtM3(null)` risponde «—», ed è la risposta giusta. Per poterlo
      dichiarare quel KPI ha adesso un **id**: un elemento che un controllo
      deve nominare deve avere un nome.
      Misure: **22 schermate su 22** nelle tre app nuove, **21 passati, 0
      falliti**; 61 comandi premuti dentro la finestra, 0 muti.
