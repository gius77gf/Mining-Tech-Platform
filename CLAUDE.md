# Mining-Tech-Platform — istruzioni per Claude

Monorepo dell'ecosistema Deepwork: software per cave/attività
estrattive, venduto ad aziende spesso CONCORRENTI tra loro.
Fondatore: Giuseppe (non tecnico — spiegare le cose in modo semplice,
in italiano, senza dare conoscenze per scontate).

## Struttura
- Radice: Deepwork core (index.html monolite ~8k righe, PWA su
  Netlify — deploy automatico ad ogni merge su main)
- `apps/<nome>/` — le app dell'ecosistema (deepwork-id, genesi, scudo,
  campo, flotta, conti, sentinella, terra). Ognuna raggiungibile
  online come /apps/<nome>/ sul sito esistente (vedi apps/DEPLOY.md)
- `shared/` — stile deepwork vincolante (deepwork-style.css,
  dw-app-shell.css) e SDK identità (deepwork-id-client/)
- `vault/` — memoria di lavoro: ROADMAP_SETTIMANA.md + checkpoints/
- `docs/` — audit e piani (AUDIT_SICUREZZA.md, MITIGAZIONE_PASSWORD.md)

## Procedura dei cicli di lavoro automatici
1. `git pull` per allinearsi, poi leggere vault/ROADMAP_SETTIMANA.md
   e il checkpoint PIÙ RECENTE in vault/checkpoints/ (timestamp più
   alto nel nome, esclusa la sottocartella archivio): riprendere dal
   suo "Prossimo passo atomico".
2. Unità piccole, commit frequenti. Al completamento di OGNI unità:
   nuovo file checkpoint (MAI sovrascrivere i precedenti) con task
   completato, hash commit, prossimo passo atomico preciso; aggiornare
   lo stato del task in ROADMAP_SETTIMANA.md.
3. OGNI ciclo lavora FINO AD ESAURIMENTO DEI CREDITI, senza eccezioni
   (regola del fondatore, ribadita due volte): finita un'unità se ne
   inizia SUBITO un'altra; se la roadmap sembra finita si prosegue con
   seconde iterazioni, rimandati, test, revisioni — il lavoro non
   finisce mai da solo. VIETATO "chiudere il blocco" o fermarsi per
   scelta: l'unico stop legittimo è il limite tecnico della
   piattaforma. Il "punto stabile" (commit pulito + checkpoint
   completo dopo ogni unità) serve SOLO a rendere sicura
   l'interruzione forzata, mai a giustificare una fermata volontaria.
4. Ciclo serale: NON più un blocco fisso di revisione (direttiva
   fondatore 26/07). Al suo posto si prosegue con ricerca e sviluppo; la
   qualità si tiene con verifiche dentro OGNI unità (screenshot, test,
   controllo sintassi).
5. LAVORO IN CONTEMPORANEA su tutte e sei le app (direttiva 26/07): in
   ogni ciclo più cantieri aperti insieme, un agente per app (i file
   sono separati in apps/<nome>/, nessun conflitto). Si serializza solo
   ciò che tocca shared/, docs/, vault/.

## Regole vincolanti
- ⛔ DATI DI RIFERIMENTO DEL FONDATORE — REGOLA FERREA E IMMUTABILE
  (25/07, non va più ripetuta): i dati che il fondatore ha fornito
  all'inizio erano SOLO ORIENTATIVI, per far capire i video che stava
  mostrando. NON devono comparire da nessuna parte nell'interfaccia,
  nei testi, negli export o nei documenti dell'app: archivio dei 190
  video, le 6/23 volate misurate, maglia 4,5×3,5, Nonel 25 ms, 15-20
  fori, calcare come "dominio di validità", e qualunque altra citazione
  di quella origine. Si possono USARE internamente per i calcoli e le
  calibrazioni, ma MAI mostrare né citare. Nessuna eccezione.
- ⛔ STILE — DIRETTIVA VINCOLANTE (fondatore 27/07, sostituisce quella
  del 25/07; «su questo non transigo»). Due metà da non confondere:
  1. **STRUTTURA: IDENTICA AL CORE, PELO PER PELO.** Le app copiano
     l'impianto estetico e le dinamiche di funzionamento del core
     Deepwork (index.html alla radice) senza cambiare "una virgola":
     stessa struttura di pagina, topbar, navigazione, card, liste,
     form, modali, toast, stati vuoti; stessi raggi, bordi, gradienti,
     ombre, spaziature, tipografia, transizioni, animazioni, alone che
     seguo il mouse; stessi comportamenti di interazione. Niente
     scorciatoie: `alert()`/`confirm()` del browser sono vietati, si usa
     il toast del core.
  2. **COLORE: IDENTITÀ PROPRIA DI OGNI APP.** NON si copiano i colori
     del core: quelli sono di Deepwork. Ogni app ha una **palette
     propria e un proprio carattere**, costruita attorno al suo colore
     principale, che va **fuso in tutto il contesto** (sfondi, aloni
     d'ambiente, bordi, grafici, stati) — non un accento sparso su un
     tema altrui. Ammessi colori di appoggio scelti per armonia, se
     servono a renderla più professionale e piacevole.
  Il punto di partenza è che oggi le app sono «un'accozzaglia di colori
  che non porta da nessuna parte»: l'obiettivo è una palette **armonica,
  accattivante e professionale** per ciascuna, decisa con ricerca
  cromatica vera e verificata per contrasto/leggibilità.
  shared/deepwork-style.css resta il veicolo tecnico della STRUTTURA;
  la palette per app passa dalle variabili di tema dell'app.
- 🎯 **L'ECCELLENZA È LO STANDARD — DETERMINANTE PER OGNI SCELTA FUTURA**
  (fondatore 27/07, da applicare a qualsiasi decisione, per sempre):
  1. **Nulla è lasciato al caso.** Ogni singola virgola e ogni singolo
     dettaglio vanno decisi con cognizione, non per abitudine o fretta.
  2. **Si parte dai migliori prodotti in circolazione**: si cercano, si
     studiano, si emulano — e poi si fa **meglio di loro**. Il metro non è
     "funziona", è "è il migliore che si possa fare".
  3. **Ricerca approfondita prima di ogni scelta**, su tutto: funzioni,
     interazioni, testi, estetica. Le ricerche vivono in `docs/` e vanno
     tradotte in unità concrete, mai gonfiate.
  4. **Metodo del confronto affiancato**: dopo ogni modifica si mette il
     risultato accanto al riferimento (il core, o il miglior prodotto di
     categoria) e si corregge dove il nostro è più povero. **Almeno tre
     iterazioni**: la prima versione non è mai quella buona. Non ci si
     ferma quando funziona, ci si ferma **quando è eccellente**.
  5. Sequenza dichiarata dal fondatore: **questa settimana l'estetica**,
     nei giorni successivi **lo standard di ogni funzione e funzionalità**,
     con lo stesso livello di approfondimento.
- **QUALITÀ VISIVA — cosa la produce davvero** (non basta applicare le
  variabili di colore): luce stratificata (ambiente + riflesso sul bordo
  alto + ombra propria + ombra proiettata), bordi che catturano la luce,
  aloni d'ambiente nella tinta dell'app, alone che segue il mouse,
  micro-profondità su badge/pillole/bottoni/campi, gerarchia tipografica
  vera con cifre allineate, movimento con curve morbide, spaziature su una
  scala coerente. Riferimenti: `docs/SPECIFICA_ESTETICA_CORE.md`,
  `docs/PALETTE_APP.md`.
- ⛔ **UNA REGOLA CHE SERVE A DUE APP VIVE IN `shared/`.** Non nel modulo di una
  delle due (nessuna app importa il modulo dati di un'altra) e **mai riscritta**:
  è il difetto che è costato una giornata intera con la convenzione sui numeri,
  finita scritta quattro volte con tre comportamenti diversi. Il posto per la
  logica che sta **fra** le app è `shared/dw-ponti.js`; il modulo dell'app la
  **ri-esporta** col nome con cui l'ha sempre chiamata, così le pagine non
  cambiano — un alias non è una seconda implementazione.
  E il test pretende l'**identità** (`terra.X === ponti.X`), non il
  comportamento: due copie uguali oggi divergono domani senza che nessuno lo veda.
- **MISURARE PRIMA DI IRRIGIDIRE.** Due volte in un giorno l'ipotesi ragionevole
  era falsa: sui campi interi «basta leggere `checkValidity()`» — no, su «1,5»
  Chromium fa «15» e risponde **true**; e su `parseNum` «si può irrigidire» — no,
  cinque letture sono celle di CSV di una perforatrice, che scrive in notazione
  scientifica. Mezz'ora di misura prima, invece di una correzione che rompe in
  silenzio.
- MULTI-TENANT: isolamento totale dei dati tra organizzazioni. Ogni
  accesso dati delle app passa dallo SDK deepwork-id-client
  (orgCollection), mai percorsi Firestore costruiti a mano.
- GIT: sviluppo sul branch di sessione designato. Niente push diretto
  su main: gli aggiornamenti passano da Pull Request (prassi:
  merge via PR anche per vault/ e docs/). Commit piccoli con messaggi
  chiari.
- SOLDI: nessuna spesa (domini, piani a pagamento) prima della fase di
  commercializzazione — decisione esplicita del fondatore.
- SICUREZZA: docs/MITIGAZIONE_PASSWORD.md è PREPARATA ma NON attivata
  senza conferma esplicita del fondatore in conversazione.

## Test
- ⚠️ **LA SUITE ESISTE E COPRE TUTTE LE APP.** Tre cantieri di fila hanno
  scritto «la mia app non ha una suite in cui mettere i test» e non è vero:
  `apps/deepwork-id/tests/run-kpi.mjs` importa **tutti** i moduli
  `apps/<nome>/<nome>-data.js`, quindi qualunque funzione pura di qualunque
  app si testa lì. Si lancia con `node apps/deepwork-id/tests/run-kpi.mjs`,
  senza emulatori e senza rete. Due avvertenze imparate a spese nostre:
  1. i test vanno inseriti **prima** del blocco di riepilogo finale, che
     chiude con `process.exit`: appesi in coda non vengono mai eseguiti, e il
     totale resta invariato senza che nulla segnali l'errore;
  2. si controlla sempre che il **totale sia salito**, non solo che i falliti
     siano zero: un file di test inerte dice «0 falliti» come uno che passa.
- Le altre suite locali (`run-demo.mjs`, `run-helpers.mjs`,
  `run-pointcloud.mjs`, `run-manifest.mjs`, `run-stile.mjs`) girano anch'esse
  con `node`.
- **`run-stile.mjs` rende verificabili le regole vincolanti** che prima
  vivevano solo qui — sette, al 31/07: niente dialoghi del browser, unità mai in
  maiuscolo, nessun campo decimale `type="number"`, nessun campo decimale letto
  col lettore che fa zero, la guardia sui campi interi montata dove servono, il
  ponte con Terra che non dà la colpa a chi compila, e la provenienza di un
  rilievo decisa in un posto solo. L'intestazione del file le elenca con la
  ragione di ognuna. Quando nasce un'app va aggiunta all'elenco `SUPERFICI`.
- **Due tokenizzatori, e vanno scelti**: `mascheraCodice` maschera il
  **contenuto** delle stringhe (giusto per i dialoghi — un `prompt(` dentro una
  stringa non è una chiamata), `senzaCommenti` toglie **solo i commenti** e tiene
  il resto (giusto per le regole sui TESTI, che vivono dentro le stringhe).
  Prendere quello sbagliato dà una regola che non guarda dove crede: la regola 6
  è caduta segnalando il commento che documentava la decisione.
- **Il browser serve per SCOPRIRE un difetto, non per tenerlo chiuso.** Le prove
  sui buchi dei grafici sono nate con Playwright, ma `tratti`/`percorso` prendono
  numeri e restituiscono una stringa: vivono in `run-kpi.mjs` e girano sempre. Il
  motore le espone di proposito in `dwGrafici.geometria`. Una difesa che resta
  nello scratchpad, alla sessione dopo non esiste.
- **Quello che il browser scopre e basta vive in `apps/deepwork-id/tests/browser/`**
  (vedi il suo LEGGIMI). Ci sta `interi-superfici.mjs`, che digita davvero nei
  29 campi interi di tutte e sette le superfici — 87 asserzioni, e con
  `--senza-guardia` ne devono cadere due su tre per campo. È così che è venuto
  fuori che Terra aveva una **seconda copia** della regola degli interi e
  «1.500» diventava «500».
- ⚠️ **IL CORE NON SI APRE IN LOCALE, e non è colpa del login.** Tutto il suo
  programma sta in un `<script type="module">` che importa Firebase da
  `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano
  solo i segnaposto che il core installa apposta («Funzione nav non ancora
  pronta»). Chi non lo sa passa un'ora a chiedersi perché `nav('ufficio')` non
  faccia niente: non è il `nav` del core. Si monta
  `tests/browser/finto-firebase.mjs` PRIMA di `goto` e il core parte davvero.
- ⚠️ **UNA PROVA CHE NON SA FALLIRE NON DIMOSTRA NIENTE.** Ogni controllo
  nuovo va provato **contro il difetto**: si rimette il difetto e si pretende
  che il controllo fallisca. Costa due minuti e ha già salvato due volte:
  1. `run-stile.mjs` passava su tutte le superfici **e** passava anche con un
     `window.prompt()` rimesso a mano nel core, perché tagliava i commenti con
     `replace(/\/\*[\s\S]*?\*\//g,'')` e il core scendeva da 537.000 a 137.000
     caratteri: `/*` e `*/` compaiono anche dentro stringhe ed espressioni
     regolari, l'accoppiamento non greedy legava i delimitatori sbagliati e
     cancellava 400.000 caratteri di codice **vivo**. Ora la controprova
     inietta il dialogo nei file veri, dentro la suite.
  2. La correzione delle unità nei grafici: le 11 asserzioni girate sulla
     versione precedente del motore ne facevano fallire 8. Senza quel passaggio
     non si sapeva se stessero misurando qualcosa.
- ⚠️ **IL CONTROLLO CHE NON GUARDA DOVE CREDE.** Variante della regola qui
  sopra, e più insidiosa: il controllo **sa** fallire, ma il suo filtro esclude
  proprio i casi che contano, e allora risponde «pulito» senza aver guardato
  niente. Il 31/07 è successo **tre volte in un giorno**:
  1. il censimento dei doppioni cercava la forma `.some(` e non vedeva i
     quattro gestori che usano un `Set` — quelli che facevano la cosa giusta;
     poi lo stesso filtro è finito **dentro la regola** nata da quel censimento,
     che quindi era cieca proprio dove il codice era sano;
  2. la controprova del banco degli id iniettava il difetto sostituendo il
     **primo** `</body>`, che in Terra, Genesi e Campo sta dentro le stringhe
     dei modelli di stampa: su tre superfici su nove il difetto non arrivava mai
     nella pagina e la controprova diceva «pulito»;
  3. la sonda sulle tendine scartava gli elementi con **altezza zero** — cioè
     tutte quelle delle sezioni non aperte — e rispondeva «nessuna tendina
     taglia il testo» mentre uno screenshot mostrava il contrario.
  La difesa: dopo aver scritto un controllo, chiedersi **quanti soggetti ha
  guardato davvero** e stamparlo (`84 tendine misurate`, `20 gestori`,
  `9 superfici`). Un numero che non torna si vede; un «zero violazioni» no.
- Quando si misura qualcosa nel browser, due trappole già pestate:
  `document.elementFromPoint` vive nel **viewport** (un elemento sotto la piega
  risponde `null` e sembra irraggiungibile: va portato in vista), e «questo
  punto è mio» significa l'elemento **o un suo discendente** — accettando anche
  un antenato si misura la riga intera e vengono fuori aree di tocco da 80 px
  che non esistono. E `innerText` su una scheda nascosta ricade su
  `textContent`, quindi il maiuscolo non si vede: va letta la trasformazione
  **effettiva** con `getComputedStyle`.
- Quando un test fallisce dopo un lavoro nuovo, prima di dire che c'è un
  difetto va letto **come il codice si aspetta i dati**: succede spesso che
  sia la prova a indovinare male i nomi dei campi, e una prova sbagliata che
  accusa il codice fa perdere più tempo di nessuna prova. Se invece il test è
  invecchiato perché il prodotto è migliorato, si corregge rendendo
  l'asserzione **più giusta, non più permissiva** (vedi `contiene`).
- Regole di sicurezza Firestore: `cd apps/deepwork-id && firebase
  emulators:exec --project demo-deepwork "cd tests && npm test"`
  (richiede firebase-tools + Java; 19 test, devono passare tutti).
- Verifica visiva pagine: server statico locale + screenshot
  (Playwright/Chromium preinstallato). Gli screenshot vanno **guardati**, non
  solo prodotti: nella giornata del 29/07 un campo scomparso, una miniatura
  illeggibile e un'unità di misura stravolta dal maiuscolo sono stati trovati
  così, e nessuno di quei difetti si vedeva leggendo il codice.
- ⚠️ La cartella scratchpad è **condivisa** fra i cantieri paralleli: ogni
  agente deve creare una propria sottocartella, altrimenti si sovrascrivono i
  file di prova a vicenda (è già successo più volte).

## Contesto di progetto
- Vault Obsidian di visione/ricerca: repo gius77gf/ecosistema-vault
  (mappa ecosistema, roadmap generale, schede delle 6 app, wiki
  ricerca competitor).
- Genesi vive in apps/genesi (spostata dal vecchio repo genesi-app,
  che resta solo come archivio storico).
- Deepwork ID (apps/deepwork-id/ARCHITETTURA.md) è la Fase 0: tutte le
  app dipendono da lui per login/abbonamenti/isolamento.
