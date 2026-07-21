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

## Flotta — ore motore / telemetria
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

## Conti — fatture
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

## Terra — rilievi drone (volumi)
Pagina **Rilievi → Importa rilievi (CSV)**.
- **Colonne**: `data;volumeM3;metodo;gsd` (metodo e gsd facoltativi)
- **Esempio**:
  ```
  data;volumeM3;metodo;gsd
  2026-07-15;19400;RTK+GCP;2
  2026-07-01;18600;;
  ```
- **Note**: servono una data valida e un volume in metri cubi ≥ 0. `metodo`
  (RTK, PPK, GCP…) e `gsd` (cm/pixel) rendono il volume "difendibile" in un
  controllo, ma non sono obbligatori.

## Campo — piano di carico della volata (fochino)
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

## Sentinella — 2) registro volate (brogliaccio di brillamento)
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

## Riepilogo colonne (per copiare al volo)
| App | Import | Colonne |
|---|---|---|
| Scudo | Anagrafica | `nome;ruolo;telefono` |
| Scudo | Scadenzario | `lavoratore;tipo;descrizione;scadenza` |
| Scudo | Infortuni | `data;tipo;gravita;giorniAssenza;descrizione;luogo` |
| Flotta | Ore/telemetria | `mezzo;ore;carburante` |
| Conti | Fatture | `numero;cliente;importo;emessa;scadenza;incassata` |
| Terra | Rilievi | `data;volumeM3;metodo;gsd;fronte` (metodo/gsd/fronte facoltativi) |
| Campo | Piano volata | `foro;x;fila;prof;prog;borr;rit` |
| Sentinella | Sensori | `nome;tipo;valore;soglia;unita;nota` |
| Sentinella | Registro volate | `data;fronte;nFori;kgTotali;kgMaxRitardo;distanzaRicettore;esito;note` |

Tutte e sei le app verticali hanno anche l'**esportazione** in CSV, per backup
o per girare i dati a un consulente.
