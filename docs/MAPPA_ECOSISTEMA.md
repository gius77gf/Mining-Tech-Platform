# La mappa dell'ecosistema — che cosa c'è, che cosa manca, e dove si può collegare

> Nasce dalla richiesta del fondatore del 26/08: «credo che si possano fare
> molti più collegamenti di quelli attualmente presenti». Aveva ragione, e qui
> c'è il numero.

⛔ **COME LEGGERE QUESTO DOCUMENTO.** Ogni riga dice **come è stata misurata**.
Dove c'è un comando, si rilancia; dove c'è scritto «da verificare», non è stato
misurato e non va usato per decidere. È la regola di casa: *un comando si
rilancia, un numero si può solo credere.*

Verificato contro il commit dichiarato in fondo.

---

## 1. I ponti che esistono oggi: SEI su cinquantasei

> ⏱️ Scritto il 26/08. Dal 02/09 sono **sette**: il settimo è Flotta→Conti, e sta
> raccontato in §3a. Il titolo resta com'era perché il conto vivo è la tabella in §6.

Un ponte è un'app che legge i dati di un'altra. Si misura cercando chi
inizializza l'SDK con l'`appId` di qualcun altro:

    grep -rn "appId:" apps/*/*-data.js apps/*/*.html | grep -v node_modules

| app | legge i dati di | è letta da |
|---|---|---|
| Terra | Campo | Campo, Conti |
| Campo | Terra (3 punti), Scudo | Terra, Scudo |
| Scudo | Campo | Campo, Sentinella |
| Conti | Terra | **nessuno** |
| Sentinella | Scudo | **nessuno** |
| **Flotta** | **nessuno** | **nessuno** |
| **Genesi** | **nessuno** | **nessuno** |
| Deepwork ID | — | — *(è l'identità, non produce dati di cava: giusto così)* |

**Sei collegamenti su 56 direzioni possibili.** C'è un triangolo vivo — Terra,
Campo, Scudo — e tutto il resto sta ai margini.

⛔ **MA QUESTO CONTO HA UN PUNTO CIECO, E L'HO SCOPERTO DOPO AVERLO SCRITTO:
guarda un solo TIPO di ponte.** Cerca chi legge i dati di un'altra app dal
database. Esiste una seconda forma — **il file** — e con quella Genesi e
Sentinella sono collegate da tempo: Genesi esporta un CSV con esattamente le
colonne che il registro volate di Sentinella vuole, e la sua schermata lo dice
in chiaro («la volata entra come PREVISTA, e nessuno la ridigita»).
Quindi «Genesi è letta da: nessuno» è **letteralmente vero e fuorviante**, ed è
il difetto contro cui questo repository mette in guardia: una frase esatta con
un verdetto falso. Il numero **6** vale per i ponti di dati; i ponti di file
sono un'altra cosa e vanno contati a parte — **non è stato fatto**.

⚠️ **E «isolata» va detto con precisione, perché sono due cose diverse.**
Flotta non scambia **dati** con nessuno, ma usa le **regole** condivise
(`shared/dw-ponti.js`, 4 riferimenti). Genesi non usa né le une né gli altri.
Confondere le due porterebbe a cercare il problema di Flotta nel posto
sbagliato.

---

## 2. Che cosa tiene ciascuna app

I nomi delle collezioni **non** si leggono cercando `orgCollection('nome')`:
quel nome è una **variabile**, e cercandolo come stringa il conto dà zero su
tre app su sei — un righello che risponde «non c'è» con la faccia della verità.
Si leggono da chi le chiama:

    grep -oE "\b(leggi|read|aggiungi|carica)\(\s*['\"][a-zA-Z]+['\"]" apps/<app>/<app>-data.js

| app | funzioni | schermate | che cosa tiene |
|---|---|---|---|
| **Terra** | 63 | 6 | autorizzazioni, fronti, lotti, piano, rilievi, scadenze |
| **Campo** | 98 | 5 | attività, checklist, chiusure, durate, meteo, obiettivi, operatori, piano di carico, presenze, rapportini, squadre |
| **Flotta** | 78 | 6 | controlli, **costi**, disponibilità, fermi, interventi, manutenzioni, mezzi, ricambi, rifornimenti, **scadenze** |
| **Scudo** | 156 | 8 | analisi, appaltatori, appalti, **azioni**, cantieri, documenti, DPI, infortuni, ispezioni, **lavoratori**, mansioni, nomine, oreAnno, permessi, **scadenze** |
| **Conti** | 121 | 10 | chiusure, clienti, **costi**, fatture, gare, impostazioni, incassi, note, ordini, pesate, prodotti |
| **Sentinella** | 99 | 6 | adempimenti, **azioni**, **lavoratori**, monitoraggi, programma, reclami, registri, ricettori, volate |
| **Genesi** | 50 | — | *niente di condiviso: vedi §4* |

**665 funzioni, 41 schermate.**

---

## 3. Le sovrapposizioni — cioè i ponti che si costruiscono da soli

Non sono idee: sono **nomi che compaiono in due o più app**, e ognuno è un
punto in cui oggi qualcuno scrive la stessa cosa due volte.

### 3a. `costi` — Flotta **e** Conti · *il caso più maturo, e c'è un difetto vero*
Le due app **parlano già la stessa lingua**: importano tutt'e due
`VOCI_COSTO`, `voceCosto` e `gruppoDiVoce` da `shared/dw-ponti.js`.

    grep -c "VOCI_COSTO" apps/flotta/flotta-data.js apps/conti/conti-data.js   → 1 e 4

⛔ **E NON È SOLO UNA COMODITÀ MANCATA: C'È IL RISCHIO DI CONTARE DUE VOLTE LO
STESSO EURO.** In `shared/dw-ponti.js` ogni voce di costo porta una bandiera
`daMezzo`, che dice quali spese **Flotta registra già** (carburante,
manutenzione, noleggi). Il commento accanto lo scrive senza giri:

> «`daMezzo` dice quali voci Flotta già registra: servono a non contarle DUE
> volte» · «Flotta le registra già, e chi somma deve saperlo»

Chi legge quella bandiera, misurato:

    grep -rc "daMezzo" shared/dw-ponti.js apps/conti/index.html apps/flotta/flotta-data.js
    → shared 11 · conti 4 · **flotta 0**

Cioè **la difesa è a senso unico**: Conti avvisa chi inserisce («anche in
Flotta»), filtra i doppioni e mette l'avviso sul menu; Flotta non sa nemmeno
che la bandiera esista. E soprattutto: Conti **fa già la domanda giusta e non
può avere la risposta** — sa che quella spesa sta anche di là, e non può
mostrare quale.

**Valore: alto — non è una comodità, è la correttezza di un totale.
Costo: basso**, perché la parte difficile (il vocabolario comune) è già fatta e
il punto d'aggancio esiste già nella pagina di Conti.

✅ **COSTRUITO IL 02/09 — e la riga qui sopra resta per raccontare da dove si
partiva.** Il ponte è nella direzione Flotta→Conti, perché è Conti a sommare:
· `confrontoCostiMezzi` in `shared/dw-ponti.js` (7 prove in `run-kpi`), che
  mette in fila sulle sole voci `daMezzo` quanto c'è in Conti e quanto in
  Flotta nel periodo, voce per voce, e dichiara a parte le righe senza data,
  senza importo e a zero — un importo scritto zero NON sparisce nel conto;
· `api.costiFlotta` in `apps/conti/conti-data.js`, seconda istanza SDK pigra
  con `appId: "flotta"` sul modello di `rilieviTerra`: `null` se Flotta non
  risponde, e `null` resta `null` fino alla schermata;
· nella schermata Costi di Conti l'avviso «anche in Flotta» è diventato la
  tabella del confronto, con **tre esiti distinti**: Flotta non raggiungibile
  (nota in tono avviso, **nessun numero di Flotta**, «non lo do per zero»);
  voci in tutt'e due (riga evidenziata, «gonfiato fino a …»); Flotta che
  risponde e non ha niente nel periodo (detto anche quello).
Misurato col browser a 430 e 320 px nei tre temi: con la dimostrazione
carburante e manutenzione escono «in tutt'e due» (Flotta 50 € su 2 righe e
49 € su 2 righe), il noleggio solo di là, la riga senza data dichiarata; col
modulo servito che risponde `null` la nota è in tono avviso e non contiene
nessuno zero. Contrasti degli inchiostri della tabella ≥ 5,5:1 in tutti e tre
i temi. La pagina non scorre mai di lato; a 320 px scorre la sola cassa della
tabella.

    grep -c "confrontoCostiMezzi" shared/dw-ponti.js apps/conti/conti-data.js apps/conti/index.html
    → 2 · 1 · 3   (definizione, ri-esportazione, import + chiamata + commento)

⚠️ Quello che il ponte NON fa, e va detto: non toglie il doppione, lo
**mostra**. Decidere in quale app vive una spesa resta della persona.

✅ **E IL VERSO DI RITORNO, Conti→Flotta, È COSTRUITO LO STESSO GIORNO** (02/09,
cantiere parallelo): `api.costiConti` in `flotta-data.js` (seconda istanza SDK
con `appId: "conti"`, `null` se non risponde), la nota del confronto nella
schermata dei costi di Flotta con gli stessi tre esiti, e il contrassegno
«anche in Conti» sulla riga uguale **alla cifra** (stessa voce da mezzo, stesso
giorno, stesso importo: `doppioniAllaCifra`). ⚠️ Con una differenza che vale
la pena scrivere: qui la voce è a **testo libero** («Gasolio pala»), non una
chiave di `VOCI_COSTO`, quindi prima di chiamare la funzione condivisa le righe
vanno **tradotte** (`chiaveVoceMezzo` → `costiPerConfronto`); senza, Flotta
risultava a zero — misurato. Le voci che la traduzione non riconosce si
contano e si dicono (`nonClassificate`), non spariscono.

    grep -c "confrontoCostiMezzi" apps/flotta/flotta-data.js apps/flotta/index.html → 1 · 3

### 3b. `scadenze` — Terra, Flotta **e** Scudo
Tre app tengono un proprio scadenzario, ognuna col suo stato. Chi dirige la
cava non ha un posto solo dove vedere *che cosa scade questo mese*.
**Valore: alto** (è la domanda che un titolare fa ogni lunedì).
**Costo: medio** — gli stati vanno unificati senza rompere i tre esistenti.

### 3c. Le persone — `lavoratori` (Scudo, Sentinella) e `operatori` (Campo)
Le stesse persone in tre elenchi. Scudo↔Campo un ponte ce l'ha già
(`idoneitaDiTurno`); Sentinella no.
**Valore: alto** — una persona assunta va inserita una volta, non tre.
**Costo: medio**, e va deciso **chi è la fonte** (probabilmente Scudo).

### 3d. `azioni` — Scudo **e** Sentinella
Azioni correttive in due posti. Chi ne ha una aperta di sicurezza e una
ambientale non le vede insieme. **Valore: medio. Costo: basso.**

### 3e. `volate` — Sentinella **e** Genesi · *il ponte c'è già, ma è un file*
⚠️ **Qui mi ero sbagliato, e la correzione conta.** Genesi **esporta già** un
CSV con esattamente le colonne del registro volate di Sentinella, e la volata
entra di là come *PREVISTA* senza che nessuno la ridigiti. Il codice lo dice
in chiaro, e si legge in `apps/genesi/genesi.html` (la schermata `sentRender`).

Quello che **manca** non è il collegamento: è che passi da un **file** che
qualcuno deve esportare e importare a mano, invece che dai dati condivisi. E
manca il terzo lato: Campo registra il **turno vero**, e nessuno confronta il
*progettato con il reale* — che è già in roadmap come rimandato.

**Valore: molto alto** (è il cuore del mestiere). **Costo: alto**, e per una
ragione strutturale che viene prima: vedi §4.

### 3f. La produzione — `rilievi` (Terra), `rapportini` (Campo), `pesate` (Conti)
Tre misure della stessa cosa: il drone misura il volume, il turno dichiara la
produzione, la pesa registra quello che esce. Terra↔Campo e Conti↔Terra
esistono già; **manca il triangolo**, cioè la riconciliazione a tre.
**Valore: alto. Costo: medio.**

---

## 4. Il blocco strutturale: Genesi non esce dal browser

⛔ Genesi **non usa `orgCollection` nemmeno una volta**. I suoi dati stanno in
`localStorage`, con quattro chiavi:

    grep -oE "localStorage\.(get|set)Item\('[a-zA-Z]+'" apps/genesi/*.js apps/genesi/genesi.html

`genesiCmp` (confronti), `genesiRicon` (storico riconciliazioni), `genesiSent`,
`genesiSito` (punti del sito).

⛔ **Misurato il 02/09, e il conto qui sopra era stretto — di nuovo il righello
che cerca UNA forma.** Le chiavi sono **nove**, non quattro: quel `grep` cerca
il letterale `localStorage.getItem('…')`, e Genesi ne scrive tre per alias
(`_lsGet('genesiVolate')`) o per concatenazione (`'genesiCmp' + slot`). E i
ponti di **file** già vivi sono **quattro**, non uno: Genesi→Sentinella
(`parseVolateCsv`), Genesi→Campo (`parsePianoCsv`), Campo→Genesi
(`pianoConsuntivoCsv`) e Genesi→Terra **via chiave del browser** (Terra legge
`genesiNuvole`). Il censimento completo, coi pesi misurati in Chromium (una
volata 561 B, la nuvola da 700.000 punti che NON sta in nessun archivio e non
deve), i vincoli (l'offline prima di tutto: è la decisione 5b del fondatore) e
un piano in 8 unità ≈ 20 ore sta in `docs/GENESI_FUORI_DAL_BROWSER.md`.

**Quindi Genesi non è isolata per dimenticanza: è isolata perché quello che
produce non esce dalla macchina di chi l'ha usata.** Un collega che apre Genesi
da un altro computer non vede niente di quello che hai progettato.

Questo cambia l'ordine dei lavori: **finché i dati di Genesi restano locali,
nessun ponte verso di lei è possibile.** Il primo passo non è il ponte — è
portare le sue volate nei dati dell'organizzazione.

✅ **E la chiave `genesiSent` NON era un abbozzo: è il ponte verso Sentinella,
finito e funzionante — l'ho verificato invece di lasciarlo «da verificare».**
È la schermata da cui esce il CSV che Sentinella importa, e porta accanto una
riga che vale la pena leggere, perché è il principio del fondatore applicato a
un file che legge un'ALTRA app: «`null` NON È ZERO, nemmeno qui — anzi
soprattutto qui», con il racconto di un limite non calcolabile che usciva
come **0** e che Sentinella avrebbe letto come una soglia superata da
qualunque volata.

⚠️ Ma il ponte passa da un **file**, non dai dati: se le volate di Genesi
restano nel browser, quel file lo deve esportare e importare una persona. È
questo che va sciolto per primo.

---

## 5. Che cosa questo documento NON dice

Per onestà, e perché nessuno lo usi per decidere cose che non copre:

- **non dice se ogni singola app funzioni bene.** Ha contato funzioni,
  schermate e collezioni; non ha aperto le schermate una per una. Il giudizio
  «cosa manca a Conti» richiede una passata dedicata, app per app;
- **non dice quali sovrapposizioni siano lo STESSO oggetto.** `scadenze` in
  Terra sono autorizzazioni minerarie, in Flotta revisioni dei mezzi, in Scudo
  visite mediche: si somigliano nel nome, e prima di unirle va verificato che
  la domanda dell'utente sia davvero una sola;
- **non ha misurato il valore in ore risparmiate.** «Valore alto» è un
  giudizio, non una misura;
- **non ha censito i ponti fatti con un FILE.** Il censimento cerca chi legge
  il database di un'altra app; Genesi→Sentinella passa da un CSV ed è sfuggito
  al primo giro. Ne esistono altri? **Non è stato misurato**, e finché non lo
  è, ogni «non c'è» di questo documento vale per i ponti di dati soltanto.
  ⚠️ È il difetto che questo repository chiama per nome: *un censimento che
  cerca UNA forma risponde «non c'è» con la stessa faccia con cui direbbe la
  verità.* L'ho rifatto, e l'ha preso solo l'aver aperto il codice di Genesi
  invece di fidarmi del mio conto.

---

## 6. Il conto, per vederlo scendere

| | oggi |
|---|---|
| ponti di DATI esistenti | **8** su 56 direzioni *(era 6; il settimo è Flotta→Conti e l'ottavo il suo ritorno Conti→Flotta, tutt'e due del 02/09, §3a)* |
| ponti di FILE | almeno **1** (Genesi→Sentinella) — mai censiti, vedi §1 |
| app che nessuno legge | **3** (Genesi, Sentinella, Deepwork ID) *(era 5: Flotta la legge Conti, e Conti la legge Flotta)* |
| app senza alcuno scambio DATI | **1** (Genesi) — Deepwork ID esclusa, è l'identità *(era 2)* |
| …di cui davvero scollegate da tutto | **0** *(era 1, Flotta)*: Genesi un ponte ce l'ha, di file |
| sovrapposizioni non collegate | **5 famiglie** (§3) *(era 6: la 3a è collegata in un verso)* |

Chi costruisce un ponte aggiorna questa tabella.

---

Verificato contro il commit `d521c96d` del 2026-08-26.
