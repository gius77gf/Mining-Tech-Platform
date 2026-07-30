# Onboarding dati — come preparare i CSV per caricare una cava

Data: 2026-07-21 · Per Giuseppe e per il cliente pilota. Questo foglio dice,
app per app, **quale file preparare** per caricare i dati storici senza
riscriverli a mano. È il manuale pratico del **Passo 6 del PIANO_GO_LIVE**.

## Regole valide per tutti i file
- **Formato**: un file **CSV** (da Excel: *File → Salva con nome → CSV*). In
  Italia Excel separa le colonne col **punto e virgola `;`** — è quello che
  serve.
- **Date**: sempre nel formato **AAAA-MM-GG** (es. `2026-09-15`). È l'errore
  più comune: una data scritta `15/09/2026` viene scartata.
- **Numeri**: va bene sia il formato italiano (`18.300,50`) sia quello inglese
  (`18,300.50`), con o senza separatore delle migliaia — anche `1.234.567` o
  `1,234,567` vengono letti correttamente. Regola semplice: l'**ultimo**
  separatore è quello dei decimali (`1234,5` = 1234,50). Le righe con un numero
  davvero illeggibile vengono scartate, non caricate storte.
- **Testo con il punto e virgola dentro** (es. un cliente "Rossi; & Figli"):
  mettilo **tra virgolette** (`"Rossi; & Figli"`). Excel lo fa già da solo
  quando salvi in CSV, e i file **esportati** dalle app sono già a posto: si
  possono ri-importare senza perdere nulla.
- **Prima riga**: puoi lasciare l'intestazione (i nomi delle colonne): il
  sistema la riconosce e la salta.
- **Righe sbagliate**: una riga senza i dati obbligatori viene semplicemente
  saltata, senza bloccare le altre. Alla fine l'app dice quante ne ha caricate.
- **Righe ripetute** *(uniformato il 31/07 in tutte le app)*: se la stessa cosa
  compare **due volte nello stesso file**, entra **una volta sola** — vale la
  prima riga, e maiuscole o spazi in più non la fanno sembrare una cosa diversa
  («Rossi Mario» e « ROSSI MARIO » sono la stessa persona). Il messaggio finale
  distingue **due ragioni diverse**, e vale la pena leggerle:
  - «**già presenti (saltate)**» → quella riga c'era già in archivio, e non
    andava ricaricata: non c'è niente da correggere;
  - «**ripetute nel file**» → è il **tuo file** a nominarla più volte. Se non te
    l'aspettavi, conviene guardare il foglio di calcolo prima del prossimo
    caricamento.

  Non vale ovunque, e non è una svista. Due eccezioni, per due ragioni diverse:
  - la **telemetria** di Flotta **aggiorna** le ore dei mezzi invece di
    aggiungerli: ripetere una riga riscrive lo stesso valore, non crea niente;
  - il **piano di carico** di Campo *(dal 31/07)*: se lo stesso **numero di
    foro** compare due volte, **non ne viene tolta nessuna** — e l'app te lo
    dice, con l'elenco dei fori ripetuti, **prima** di salvare. Il motivo è che
    lì il doppione non è un fastidio da ripulire ma un **errore nel progetto
    della volata**: togliere una riga farebbe sparire una carica e abbassare il
    totale dell'esplosivo senza che nessuno sappia perché. Se è un errore del
    file, si corregge nel foglio di calcolo e si ricarica.
- **Isolamento**: i dati caricati entrano SOLO nell'organizzazione del cliente.
  Nessun'altra azienda li vede mai.
- **Backup**: accanto a ogni import c'è un **Esporta (CSV)** che scarica gli
  stessi dati **nello stesso formato**: serve per la copia di sicurezza e per
  spostare i dati da una postazione all'altra. Sono sette, verificati uno per
  uno il 31/07 con una prova che rimanda il file dentro l'app:
  **squadre** (Campo), **gare** e **listino** (Conti), **magazzino ricambi**
  (Flotta), **anagrafica lavoratori** e **registro infortuni** (Scudo),
  **ricettori** (Sentinella).
  ⛔ **Gli altri file che le app scaricano NON sono backup, sono prospetti**, e
  non vanno confusi: la *situazione fatture* di Conti, la *prima nota incassi*,
  le *pesate/DDT*, i *prezzi convertiti* del listino, la *situazione* di Flotta,
  i *riepiloghi* di Terra e Sentinella, le *azioni correttive* e il *riepilogo
  near-miss* di Scudo. Servono al commercialista o all'ente, hanno colonne
  calcolate (stato, residuo, giorni di pagamento) e **non si ri-caricano**: se
  provi, l'app dice che il file non è valido. Non è un difetto — è che quei
  file rispondono a un'altra domanda.
  ⚠️ Quindi: **la copia di sicurezza di quello che il cliente ha scritto** si fa
  con i sette qui sopra. Per tutto il resto — pesate, DDT, incassi, azioni
  correttive — oggi **non esiste un file che si ri-carica**, e va saputo prima
  di contarci.
  ⚠️ **Fino al 30/07 questa frase era vera solo a metà**, e vale la pena
  saperlo perché spiega cosa poteva succedere prima: le righe già in archivio
  venivano saltate, sì, ma un file che nominava la **stessa cosa più volte** le
  caricava tutte. Non è un caso raro: l'esportazione di Scudo scrive una riga
  per ogni **scadenza**, quindi un lavoratore con tre scadenze compare tre volte
  nel proprio file, e ri-caricarlo faceva comparire tre volte la stessa persona.
  Dal 31/07 non succede più in nessuna app.

---

## Scudo — 1) anagrafica lavoratori
Pagina **Personale → Importa da CSV**.
- **Colonne**: `nome;ruolo;telefono`
- **Esempio**:
  ```
  nome;ruolo;telefono
  Mario Rossi;Fochino;333 1112222
  Luca Bianchi;Escavatorista;
  ```
- **Note**: solo il nome è obbligatorio; ruolo e telefono possono restare vuoti
  e restano vuoti (nessun numero inventato).
- **Niente doppioni, in due sensi** *(corretto il 31/07)*: viene saltato sia un
  nome **già in archivio**, sia lo stesso nome ripetuto **dentro il file** —
  maiuscole e spazi non fanno due persone diverse, e vale la prima riga.
  Serve davvero: l'**Esporta CSV** di Scudo scrive una riga per ogni
  **scadenza**, quindi un lavoratore con tre scadenze compare tre volte nel
  proprio file. Fino al 30/07 ri-caricare quel file — il modo più naturale di
  spostare i dati da una postazione all'altra — faceva comparire tre volte la
  stessa persona in anagrafica.

## Scudo — 2) scadenzario (visite, corsi, patentini)
Pagina **Scadenze → Importa scadenze (CSV)**.
- **Colonne**: `lavoratore;tipo;descrizione;scadenza`
- **Esempio**:
  ```
  lavoratore;tipo;descrizione;scadenza
  Mario Rossi;Visita medica;Periodica;2026-09-01
  Luca Bianchi;Corso;Antincendio;2026-10-15
  AZIENDA;DVR;Revisione DVR;2027-03-01
  ```
- **Note**: il **lavoratore** viene collegato per **nome** all'anagrafica
  (caricala prima!). Se il nome non c'è, o scrivi `AZIENDA`/lasci vuoto, la
  scadenza entra come **aziendale**. Serve solo una **data valida**; il tipo
  se manca diventa "Altro".

## Scudo — 3) registro infortuni e near-miss
Pagina **Documenti → Infortuni e near-miss → Importa da CSV**.
- **Colonne**: `data;tipo;gravita;giorniAssenza;descrizione;luogo`
- **Esempio**:
  ```
  data;tipo;gravita;giorniAssenza;descrizione;luogo
  2026-02-03;infortunio;lieve;4;Taglio alla mano;officina
  2026-05-18;near-miss;lieve;0;Caduta massi vicino al perforatore;fronte Est
  ```
- **Note**: `tipo` è `infortunio` oppure `near-miss` (qualsiasi altro valore
  diventa *near-miss*, il caso più prudente per il contatore "giorni senza
  infortuni"). `gravita` è `lieve` o `grave`. Serve solo una **data valida**.

## Flotta — 1) parco mezzi
Pagina **Mezzi → Importa parco (CSV)**.
- **Colonne**: `nome;area;ore;stato`
- **Esempio**:
  ```
  nome;area;ore;stato
  Escavatore E1 — CAT 352;fronte Est;5870;operativo
  Dumper D3 — CAT 745;officina;9105;fermo
  ```
- **Note**: serve solo il **nome**; un mezzo con lo stesso nome viene saltato
  (niente doppioni). `stato` è `operativo`, `fermo` o `verifica` (default
  operativo). È il modo rapido per caricare una flotta intera all'avvio, invece
  di aggiungere i mezzi uno a uno.

## Flotta — 2) ore motore / telemetria
Pagina **Mezzi → Importa telemetria (CSV)**.
- **Colonne**: `mezzo;ore;carburante` (il carburante è facoltativo)
- **Esempio**:
  ```
  mezzo;ore;carburante
  Escavatore E1;5870;120
  Dumper D1;8420;
  ```
- **Note**: il **mezzo** viene collegato per **nome** (crea prima i mezzi). Le
  ore non fanno mai **scendere** il contatore (un valore più basso è ignorato).
  Le ore sono numeri interi.

## Conti — 1) fatture
Pagina **Fatture → Importa fatture (CSV)**.
- **Colonne**: `numero;cliente;importo;emessa;scadenza;incassata`
  (l'ultima colonna è facoltativa)
- **Esempio**:
  ```
  numero;cliente;importo;emessa;scadenza;incassata
  2026/031;Edilcave Srl;18300;2026-06-07;2026-07-08;
  2026/034;Stradesud;9750,50;2026-06-25;2026-07-25;si
  ```
- **Note**: servono numero, cliente e un importo maggiore di zero. Un numero
  già presente viene saltato. `incassata` si scrive `si` / `1` / `x` (vuoto =
  non incassata).

## Conti — 2) gare d'appalto
Pagina **Gare → Importa gare (CSV)**.
- **Colonne**: `titolo;base;scadenza;stato`
- **Esempio**:
  ```
  titolo;base;scadenza;stato
  Comune di Ragusa — inerti 2026-27;120000;2026-07-28;aperta
  ANAS — manutenzione SS115;340000;2026-08-12;aperta
  ```
- **Note**: serve solo il **titolo**; una gara con lo stesso titolo viene
  saltata. `stato` è `aperta`, `vinta` o `persa` (default aperta).
- **Backup**: il bottone **Esporta gare (CSV)** scarica le gare nello stesso
  formato dell'import, così il file si può ri-caricare (o conservare come
  copia).

## Conti — 3) listino prodotti *(dal 30/07)*
Pagina **Listino → Importa listino CSV**.
- **Colonne**: `nome;unita;prezzo;densita;iva`
- **Esempio**:
  ```
  nome;unita;prezzo;densita;iva
  Stabilizzato 0/30;t;8,50;1,9;22
  Sabbia lavata 0/4;mc;22,00;1,6;22
  Misto di cava;t;6,50;;22
  ```
- **`unita`**: `t` (a tonnellata) oppure `mc` / `m3` / `m³` (a metro cubo). Si
  accettano anche `ton` e `tonnellate`; quello che non si riconosce diventa `t`,
  che in cava è il caso normale, e si corregge dalla scheda.
- ⛔ **`densita` si può lasciare vuota, e resta vuota.** Serve a passare da metri
  cubi a tonnellate: se il tuo listino non ce l'ha, il prodotto entra lo stesso
  (è vendibile) ma per quello Conti **non converte** — e te lo dice subito, col
  numero di quanti sono. Non ne viene inventata nessuna: una densità sbagliata
  finisce in una fattura e poi nella denuncia annuale.
- **`iva`**: se manca vale 22.
- **Backup**: **Esporta CSV** scarica il listino nello stesso formato.

## Sentinella — 4) ricettori (case, scuole, confini) *(dal 30/07)*
Pagina **Monitoraggi → Importa ricettori CSV**.
- **Colonne**: `nome;tipo;distanza;classe;soglia;unita;nota`
- **Esempio**:
  ```
  nome;tipo;distanza;classe;soglia;unita;nota
  Casa Bianchi — via Cava 12;abitazione;320;III;5;mm/s;la più vicina al fronte
  Confine Nord — mappale 214;confine;90;;;;
  Scuola primaria — via Roma 4;scuola;640;I;40;µg/m³;orario 08–16
  ```
- **`tipo`**: `abitazione`, `scuola`, `ospedale`, `confine`, `storico`, `altro`.
  Quello che non si riconosce diventa `altro`.
- ⛔ **`soglia` e `classe` si possono lasciare vuote, e restano vuote.** Sono
  numeri di **sicurezza** — la classe acustica ne decide una — e non se ne
  inventa nessuna: dichiarerebbero conforme o non conforme una misura sulla base
  di un valore che nessuno ha scelto. Senza soglia propria, i punti collegati
  usano la loro; l'app dice per quanti ricettori manca.
- **Backup**: **Esporta CSV** scarica i ricettori nello stesso formato.

## Flotta — 3) magazzino ricambi *(dal 30/07)*
Pagina **Officina → Importa ricambi CSV**.
- **Colonne**: `nome;giacenza;sogliaMin;prezzo`
- **Esempio**:
  ```
  nome;giacenza;sogliaMin;prezzo
  Filtro olio motore CAT;6;4;48,00
  Denti benna escavatore;0;3;
  Olio idraulico (fusto 200L);1;;420,00
  ```
- ⚠️ **Le tre colonne si comportano in modo diverso quando sono vuote**, ed è
  voluto:
  - **`giacenza` vuota vale ZERO.** Un pezzo in magazzino senza quantità è un
    pezzo **finito**, e zero è ciò che fa scattare l'avviso di sotto-scorta:
    lasciarla indefinita nasconderebbe proprio i pezzi da ordinare.
  - **`sogliaMin` vuota resta vuota**: quel ricambio si conta ma **non entra nel
    sotto-scorta** finché non gliela scrivi. L'app te lo dice appena finito il
    caricamento, col numero.
  - **`prezzo` vuoto resta vuoto**: uno zero farebbe sembrare gratis un pezzo
    che non lo è, e il prezzo entra nel conto dei costi.
- **Backup**: **Esporta CSV** scarica il magazzino nello stesso formato.

## Terra — 1) fronti di scavo
Pagina **Fronti → Importa fronti (CSV)**.
- **Colonne**: `nome;banco;quota;stato`
- **Esempio**:
  ```
  nome;banco;quota;stato
  Fronte Nord;banco 2;340;attivo
  Fronte Sud;banco 3;320;sospeso
  ```
- **Note**: serve solo il **nome**; un fronte con lo stesso nome viene saltato.
  `stato` è `attivo` o `sospeso` (default attivo). Carica **prima** i fronti se
  vuoi che i rilievi importati (sotto) si colleghino a un fronte per nome.

## Terra — 2) rilievi drone (volumi)
Pagina **Rilievi → Importa rilievi (CSV)**.
- **Colonne**: `data;volumeM3;metodo;gsd;fronte` (metodo, gsd e fronte
  facoltativi)
- **Esempio**:
  ```
  data;volumeM3;metodo;gsd;fronte
  2026-07-15;19400;RTK+GCP;2;Fronte Nord
  2026-07-01;18600;;;
  ```
- **Note**: servono una data valida e un volume in metri cubi ≥ 0. `metodo`
  (RTK, PPK, GCP…) e `gsd` (cm/pixel) rendono il volume "difendibile" in un
  controllo, ma non sono obbligatori. `fronte` (facoltativo) collega il rilievo
  a un fronte **per nome**: carica **prima** i fronti (sopra) perché il
  collegamento funzioni; un nome non riconosciuto lascia il rilievo non
  assegnato.

## Campo — 1) squadre di cantiere
Pagina **Squadre → Importa squadre (CSV)** (oppure aggiungile a mano dal form).
- **Colonne**: `nome;persone;area;stato`
- **Esempio**:
  ```
  nome;persone;area;stato
  Squadra A — Perforazione;4;fronte Est;operativa
  Squadra C — Impianto;2;frantoio;ferma
  ```
- **Note**: serve solo il **nome**; una squadra con lo stesso nome viene
  saltata. `stato` è `operativa` o `ferma` (default operativa).
- **Backup**: il bottone **Esporta squadre (CSV)** scarica le squadre nello
  stesso formato dell'import, così il file si può ri-caricare o conservare.

## Campo — 2) piano di carico della volata (fochino)
Pagina **Volata → Importa piano (CSV)**. È il "ponte" dal disegno volata
(Genesi) al campo: si carica il piano progettato e poi si registra la carica
reale foro per foro.
- **Colonne**: `foro;x;fila;prof;prog;borr;rit`
  (numero foro; posizione m; fila; profondità m; carica progettata kg;
  borraggio m; ritardo ms)
- **Esempio**:
  ```
  foro;x;fila;prof;prog;borr;rit
  1;3.5;A;12;100;2;20
  2;4;B;12;80;2;18
  ```
- **Note**: servono almeno il numero foro e la carica progettata. È l'unico
  file "tecnico"; per un pilota HSE/flotta non è necessario.

## Sentinella — sensori / centraline
Pagina **Monitoraggi → Importa sensori (CSV)**.
- **Colonne**: `nome;tipo;valore;soglia;unita;nota` (nota facoltativa)
- **Esempio**:
  ```
  nome;tipo;valore;soglia;unita;nota
  Vibrazioni V1 — abitato Sud;vibrazioni;1.8;5;mm/s;ultimo evento 12/07
  Polveri PM10 — confine Est;polveri;36.8;40;µg/m³;media 7gg
  ```
- **Note**: servono nome, un valore ≥ 0 e una **soglia > 0** (serve per
  calcolare lo stato conforme/attenzione/superamento). Un sensore con lo stesso
  nome viene saltato. Le singole letture nel tempo si registrano poi dall'app;
  qui si carica il quadro dei punti di misura con l'ultimo valore. Le soglie di
  legge preimpostate (DIN/USBM/UE) restano disponibili nel form del sensore.

## Sentinella — 2) scadenze ambientali (adempimenti)
Pagina **Adempimenti → Importa scadenze (CSV)**.
- **Colonne**: `titolo;ente;scadenza`
- **Esempio**:
  ```
  titolo;ente;scadenza
  Relazione annuale emissioni;ARPA;2026-08-10
  Rinnovo AUA;SUAP;2026-09-30
  ```
- **Note**: servono **titolo** e una **scadenza valida**; l'ente se manca
  diventa "—". Righe uguali (stesso titolo e stessa data) già presenti vengono
  saltate. Comodo per caricare la lista che ti dà il consulente ambientale.

## Sentinella — 3) registro volate (brogliaccio di brillamento)
Pagina **Registri → Registro volate → Importa da CSV**.
- **Colonne**: `data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note`
- **Esempio**:
  ```
  data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note
  2026-07-17;Fronte Nord;42;480;18;320;regolare;
  2026-07-03;Fronte Est;36;410;22;280;contestazione;reclamo vicino
  ```
- **Note**: `esito` è `regolare` o `contestazione` (default *regolare*). I campi
  numerici accettano formato italiano o inglese. La **distanza scalata** (SD) di
  ogni volata viene calcolata da `distanzaRicettore` e `kgMaxRitardo`. Serve
  solo una **data valida**.

---

## ⚠️ Cosa NON si carica da CSV, oggi *(verificato il 30/07)*

*Questo elenco non c'era, e la sua assenza si paga al momento peggiore. Chi legge
il documento conclude — giustamente — «ecco cosa posso caricare»; nessuno gli
dice che **il resto va scritto a mano**, e lo scopre il primo giorno con
l'azienda davanti.*

Contati i punti d'importazione veri dentro le sei app: sono **diciotto**
*(ricontati il 31/07: erano quindici il 30/07, prima che nascessero il listino
di Conti, i ricettori di Sentinella e il magazzino di Flotta)*, e sono
esattamente quelli descritti qui sopra. Tutto il resto oggi si inserisce dalle
schermate, una voce alla volta:

| App | Si carica da CSV | Va inserito a mano |
|---|---|---|
| **Scudo** | lavoratori, scadenzario, infortuni | documenti aziendali, DPI, ispezioni, cantieri, azioni correttive |
| **Flotta** | parco mezzi, ore motore, **ricambi** *(dal 30/07)* | costi, rifornimenti, manutenzioni programmate |
| **Conti** | fatture, gare, **listino prodotti** *(dal 30/07)* | anagrafica clienti, registro pesate/DDT, canoni |
| **Terra** | fronti, rilievi | autorizzazioni, piano estrattivo |
| **Campo** | squadre, piano di carico | operatori, attività, rapportini |
| **Sentinella** | letture strumento, monitoraggi, scadenze, registro volate, **ricettori** *(dal 30/07)* | programma di monitoraggio, reclami |

**I tre che farebbero più male al primo cliente**, perché sono proprio quelli che
una cava ha già in un foglio di calcolo:

1. ~~Il listino prodotti di Conti~~ — ✅ **fatto il 30/07**: si carica da CSV
   (`nome;unita;prezzo;densita;iva`) e si riesporta. La densità che manca
   **resta mancante** e l'app lo dice appena finito il caricamento: da m³ a
   tonnellate si passa proprio con quel numero, e inventarlo trasformerebbe un
   dato assente in un dato sbagliato che finisce in una fattura.
2. ~~I ricettori di Sentinella~~ — ✅ **fatto il 30/07**: si caricano da CSV
   (`nome;tipo;distanza;classe;soglia;unita;nota`) e si riesportano. ⛔ **La
   soglia e la classe acustica non si inventano mai**: sono numeri di sicurezza
   e la classe ne decide una. Se il file non le ha restano vuote — un campo
   vuoto si vede e si corregge, una soglia inventata dichiara conforme o non
   conforme una misura sulla base di un valore che nessuno ha scelto.
3. ~~I ricambi di Flotta~~ — ✅ **fatto il 30/07**: si caricano da CSV
   (`nome;giacenza;sogliaMin;prezzo`) e si riesportano. Qui le regole sono
   **tre diverse**, perché dipendono da cosa fa il dato: la **giacenza** che
   manca vale **zero** (un pezzo senza quantità è un pezzo finito, e zero è ciò
   che fa scattare il sotto-scorta); la **soglia minima** resta vuota (una
   soglia inventata fa suonare un allarme che nessuno ha chiesto); il
   **prezzo** resta vuoto (uno zero farebbe sembrare gratis un pezzo che non lo
   è).

**Tutti e tre chiusi il 30/07**, nell'ordine in cui erano stati messi. Restano
fuori le cose della colonna di destra: non è un difetto del prodotto, è il
confine di quello che sa fare oggi, e scriverlo serve a **non prometterlo in
vendita** e a sapere da dove ripartire.

---

## Riepilogo colonne (per copiare al volo)
| App | Import | Colonne |
|---|---|---|
| Scudo | Anagrafica | `nome;ruolo;telefono` |
| Scudo | Scadenzario | `lavoratore;tipo;descrizione;scadenza` |
| Scudo | Infortuni | `data;tipo;gravita;giorniAssenza;descrizione;luogo` |
| Flotta | Parco mezzi | `nome;area;ore;stato` |
| Flotta | Ore/telemetria | `mezzo;ore;carburante` |
| Conti | Fatture | `numero;cliente;importo;emessa;scadenza;incassata` |
| Conti | Gare | `titolo;base;scadenza;stato` |
| Terra | Fronti | `nome;banco;quota;stato` |
| Terra | Rilievi | `data;volumeM3;metodo;gsd;fronte` (metodo/gsd/fronte facoltativi) |
| Campo | Squadre | `nome;persone;area;stato` |
| Campo | Piano volata | `foro;x;fila;prof;prog;borr;rit` |
| Sentinella | Sensori | `nome;tipo;valore;soglia;unita;nota` |
| Sentinella | Adempimenti | `titolo;ente;scadenza` |
| Sentinella | Registro volate | `data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note` |

Tutte e sei le app verticali hanno anche l'**esportazione** in CSV, per backup
o per girare i dati a un consulente.
