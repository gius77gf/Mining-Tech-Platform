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
- **Isolamento**: i dati caricati entrano SOLO nell'organizzazione del cliente.
  Nessun'altra azienda li vede mai.
- **Backup**: ogni schermata di import ha accanto un bottone **Esporta (CSV)**
  che scarica gli stessi dati nel formato ri-caricabile. Serve per fare una
  copia di sicurezza o per spostare i dati: il file esportato si re-importa
  senza duplicare (le righe già presenti vengono saltate).

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
- **Note**: un nome già presente viene saltato (niente doppioni). Solo il nome
  è obbligatorio.

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

Contati i punti d'importazione veri dentro le sei app: sono **quindici**, e sono
esattamente quelli descritti qui sopra. Tutto il resto oggi si inserisce dalle
schermate, una voce alla volta:

| App | Si carica da CSV | Va inserito a mano |
|---|---|---|
| **Scudo** | lavoratori, scadenzario, infortuni | documenti aziendali, DPI, ispezioni, cantieri, azioni correttive |
| **Flotta** | parco mezzi, ore motore | ricambi, costi, rifornimenti, manutenzioni programmate |
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
3. **I ricambi di Flotta** — un magazzino si conta in centinaia di righe.

Non è un difetto del prodotto: è il confine di quello che sa fare oggi, e
scriverlo serve a **non prometterlo in vendita** e a sapere da dove ripartire.

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
