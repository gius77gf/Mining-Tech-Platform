# Il cruscotto del titolare — ricerca luglio 2026

Documento per Giuseppe. **Nessuna modifica al codice**: qui c'è solo il progetto.

La domanda di partenza è una sola:

> Il titolare della cava apre il telefono alle 7 del mattino. In **dieci secondi**,
> senza toccare niente, cosa deve capire?

E la seconda, che è quella che vale soldi:

> Cosa può dargli il nostro ecosistema di sei app che **nessun gestionale singolo**
> gli può dare?

Metodo: ho letto la prima ondata di ricerca (`docs/RICERCA_*_202607.md`), la
specifica estetica (`docs/SPECIFICA_ESTETICA_CORE.md`), poi il codice di tutte e
sei le app più l'hub e il core, e infine ho fatto 23 ricerche sul web (italiano e
inglese) su progettazione di cruscotti direzionali, indicatori di cava, semafori,
centri avvisi, accessibilità dei grafici e primo accesso.

Regola che attraversa tutto: **onestà**. Ogni tessera che propongo dice da quale
app arriva il dato e se **oggi** quel dato esiste davvero. Dove non esiste, lo
scrivo, e la proposta si ferma lì. Un cruscotto con caselle vuote è peggio di un
cruscotto piccolo.

---

## 0. Le cinque cose da sapere prima di leggere il resto

1. **Da tre a sette numeri sopra la piega.** È il consenso di tutte le fonti
   (Domo, ThoughtSpot, Bernard Marr, i manuali italiani per PMI). Un cruscotto con
   40 indicatori non viene letto: sotto i tre non serve, sopra i sette diventa un
   report. Il resto va sotto, o dietro un clic.
2. **Un numero senza contesto non è un indicatore, è una decorazione.** "1.240 t"
   non dice niente. "1.240 t · 96% del piano · in crescita" dice tutto. Ogni
   tessera deve avere **valore + confronto + tendenza**, sempre e comunque.
3. **Se il numero cambia e nessuno fa niente, quel numero non va sul cruscotto.**
   È il test che separa gli indicatori azionabili da quelli "di vanità".
4. **Il rosso deve dire cosa fare.** Un cruscotto che segnala e basta scarica sul
   titolare tutto il lavoro di capire. Ogni stato rosso o giallo porta con sé una
   frase d'azione e un pulsante che apre esattamente il punto giusto dell'app.
5. **Le tessere non si riordinano da sole.** La posizione è memoria muscolare:
   dopo una settimana il titolare sa che la cassa sta in alto a destra e ci guarda
   senza leggere l'etichetta. Il rosso si vede dal colore e si legge nel centro
   avvisi, non spostando le tessere.

E il pericolo numero uno, dalle fonti sugli errori tipici (Stephen Few,
"Common Pitfalls in Dashboard Design"): **grafici messi lì perché fanno figura**.
Nel nostro caso significa: niente torte, niente lancette da cruscotto d'auto,
niente 3D, niente doppio asse.

---

## 1. Il progetto del cruscotto

### 1.1 Dove vive

Nell'**hub** (`apps/index.html`), che oggi è solo un elenco di collegamenti alle
app: nove riquadri con nome, descrizione e stato, **zero dati**. Quella pagina è
già il posto dove il titolare atterra, ma non gli dice niente.

> ### ⛔ Aggiornamento del 02/08 — quella pagina NON può ospitare il cruscotto
>
> Verificato leggendo il file, non a memoria: `apps/index.html` **non ha nessuno
> script a modulo, nessun Firebase, nessuno SDK**. È una pagina **statica e
> pubblica** — la vetrina che si apre davanti a un cliente prima che entri.
>
> Un cruscotto con i numeri della cava lì dentro vorrebbe dire due cose
> inaccettabili: che quei dati stanno su una pagina **senza login**, e che la
> vetrina commerciale mostra i numeri di **un'azienda vera** a chiunque abbia il
> collegamento. La regola del multi-tenant non è negoziabile: ogni accesso ai
> dati passa dallo SDK e dall'organizzazione di chi è entrato.
>
> Il progetto del cruscotto — le tessere, la frase, il centro avvisi, le regole
> di onestà — resta **valido parola per parola**. Cambia solo **dove vive**, e
> quella è una scelta di prodotto, non tecnica: sta al punto **15** di
> `DECISIONI_WEEKEND.md`.
>
> Le tre strade, in breve:
> - **(a) nel core** (`index.html` alla radice), nella home che già cambia con
>   il ruolo: veloce, ha già login e dati, ma mette i numeri delle sei app dentro
>   il prodotto che si chiama Deepwork;
> - **(b) una app nuova** `apps/quadro/`: la più pulita e la più coerente con
>   l'ecosistema — il Quadro è una vista, e le viste qui sono app — ma è un
>   cantiere intero;
> - **(c) dentro Deepwork ID** (`apps/deepwork-id/`), che è già la porta
>   d'ingresso autenticata: il titolare entra e la prima cosa che vede è il
>   Quadro. Costo medio, e non sposta nessuna identità di prodotto.


La proposta: l'hub diventa il **Quadro**. Sopra, il cruscotto. Sotto, l'elenco
delle app come oggi (che resta utile: è il menu).

Nome proposto: **"Il Quadro"** — la stessa parola che le sei app usano già per la
loro schermata di riepilogo. Coerente e italiano.

### 1.2 La gerarchia visiva, dall'alto in basso

```
┌──────────────────────────────────────────────┐
│  RIGA 0 — la frase                           │  1 riga
│  "Oggi 3 cose chiedono attenzione."          │
│  aggiornato alle 06:58                       │
├──────────────────────────────────────────────┤
│  RIGA 1 — le sei tessere                     │  la piega sta qui
│  ┌────┐ ┌────┐ ┌────┐                        │
│  │ T1 │ │ T2 │ │ T3 │                        │
│  └────┘ └────┘ └────┘                        │
│  ┌────┐ ┌────┐ ┌────┐                        │
│  │ T4 │ │ T5 │ │ T6 │                        │
│  └────┘ └────┘ └────┘                        │
├──────────────────────────────────────────────┤
│  RIGA 2 — CENTRO AVVISI (max 5 righe)        │
│  •  •  •  •  •     [vedi tutti (12)]         │
├──────────────────────────────────────────────┤
│  RIGA 3 — tre grafici semplici               │  sotto la piega
├──────────────────────────────────────────────┤
│  RIGA 4 — tre tessere secondarie             │
├──────────────────────────────────────────────┤
│  RIGA 5 — le app (l'hub di oggi)             │
└──────────────────────────────────────────────┘
```

**Su telefono** tutto diventa una colonna sola, nello stesso ordine. Le fonti sul
mobile sono concordi: non si affiancano tessere su schermo stretto, si impila e si
taglia senza pietà. Sopra la piega del telefono ci stanno **la frase + due
tessere**: quindi l'ordine delle sei conta davvero.

### 1.3 La riga 0 — la frase

Una riga di testo generata da tre regole, in questo ordine:

| Se… | La frase è |
|---|---|
| c'è almeno un avviso rosso | **"Oggi N cose chiedono attenzione."** (rosso) |
| solo avvisi gialli | "N cose da sistemare questa settimana." (giallo) |
| niente | "Tutto in ordine." (verde) |

A destra, in piccolo e grigio: **"aggiornato alle 06:58"**. Serve a dire che i
numeri sono freschi. Senza quella riga, il titolare non sa se sta guardando ieri.

### 1.4 Anatomia di una tessera

Tutte le tessere sono uguali. È voluto: la ripetizione è quello che rende il
cruscotto leggibile in dieci secondi.

```
┌──────────────────────────────────────┐
│ ▌ PRODUZIONE ANNO            ← etichetta (.kpi-lbl, 10px maiuscolo)
│ ▌                                    │
│ ▌   82%           ╭─╯╰─╮            ← valore grande (.kpi-val, 30px)
│ ▌                     ╰──            │  + micro-grafico a destra
│ ▌ 141.000 su 172.000 m³             ← il confronto, in chiaro
│ ▌ ▲ +6% sul mese scorso             ← la tendenza, con freccia E parola
│ ▌ ──────────────────────────         │
│ ▌ ⚠ Rallenta: al ritmo di oggi       ← la riga d'azione (solo se giallo/rosso)
│ ▌   sfori a novembre. Apri Terra →   │
└──────────────────────────────────────┘
   ↑ striscia colorata a sinistra = colore dell'app di provenienza
```

Cinque pezzi, sempre gli stessi:

1. **Etichetta** — cosa sto guardando, in due parole.
2. **Valore grande** — un numero solo. Nel core il `.kpi-val` è testo in gradiente
   ambra: **si tiene solo quando la tessera è verde**. Quando è gialla o rossa il
   numero diventa tinta piena (`--warn` / `--danger`), altrimenti il semaforo non
   si vede.
3. **Il confronto** — su cosa: obiettivo, mese scorso, o riferimento di settore.
   Senza questa riga il numero non significa niente.
4. **La tendenza** — freccia **più** parola ("in crescita" / "in calo" / "stabile")
   più micro-grafico. Tre modi di dire la stessa cosa, perché chi non distingue i
   colori o guarda al sole veda comunque.
5. **La riga d'azione** — compare **solo** quando la tessera non è verde. È la
   differenza fra un cruscotto che informa e uno che serve.

E la **striscia colorata a sinistra** (`border-left: 4px`, esattamente come le
schede del core) usa il colore dell'app da cui viene il dato: verde Terra, teal
Conti, viola Scudo, blu Sentinella, arancio Campo, magenta Flotta. Così il
titolare impara senza sforzo da dove arrivano le cose, e quando clicca non si
sorprende di finire in un'altra app.

> Nota estetica: la tessera è la `.tile` del core, con `--card`, bordo `--border`,
> raggio 12px, l'alone che segue il mouse (`::after` con `radial-gradient`), il
> sollevamento di 3px al passaggio. **Nessuna riga luminosa in cima**: nel core non
> esiste (vedi `SPECIFICA_ESTETICA_CORE.md` §1.4). Il cruscotto deve sembrare
> costruito lo stesso giorno del core, non un pezzo aggiunto dopo.

### 1.5 Le sei tessere, una per una

L'ordine è quello di lettura: prima il motore (produco?), poi i soldi (incasso?),
poi le condizioni (mezzi, persone, ambiente, autorizzazione).

---

#### T1 · PRODUZIONE ANNO

| | |
|---|---|
| **Valore grande** | % del piano annuo raggiunta (es. `82%`) |
| **Confronto** | `141.000 su 172.000 m³ autorizzati per l'anno` |
| **Tendenza** | proiezione a fine anno: `al ritmo di oggi chiudi a 168.000 m³` |
| **Micro-grafico** | barre dei volumi degli ultimi 6 mesi |
| **Fonte** | **Terra** — `rilievi` (campo `volumeM3`, `data`, `stato: elaborato`) e `piano` (campo `pianificatoAnnuoM3`) |
| **Funzione già esistente** | `proiezioneAnnua()` in `apps/terra/terra-data.js` — calcola già estratto, frazione d'anno, proiezione e semaforo |
| **Clic** | apre **Terra → Rilievi**, filtrata sull'anno in corso |
| **Oggi si può fare?** | **Sì, subito.** È l'indicatore più pronto che abbiamo. |

**Perché questo e non "tonnellate di oggi".** Le tonnellate del giorno sarebbero
più belle, ma il volume in Terra si aggiorna solo quando si fa un rilievo (una
volta al mese, o meno). Un numero "produzione di oggi" alimentato da rilievi
mensili sarebbe finto. La produzione giornaliera vera esiste in **Campo**
(`rapportini.prodQta` + `prodUnita`), ma è per turno e senza un obiettivo con cui
confrontarla: torna nella tessera secondaria T7.

---

#### T2 · CASSA — SCADUTO DA INCASSARE

| | |
|---|---|
| **Valore grande** | euro scaduti e non incassati (es. `€ 48.300`) |
| **Confronto** | `su € 214.000 di credito aperto · 23%` |
| **Tendenza** | `atteso nei prossimi 30 giorni: € 96.000` |
| **Micro-grafico** | quattro barrette dell'invecchiamento: 1-30 / 31-60 / 61-90 / oltre 90 giorni |
| **Fonte** | **Conti** — `fatture` (`importo`, `scadenza`, `incassata`) |
| **Funzioni già esistenti** | `agingIncassi()`, `incassoAtteso()`, `kpiFrom()` in `apps/conti/conti-data.js` |
| **Clic** | apre **Conti → Fatture**, filtro "insolute", ordinate per giorni di ritardo |
| **Oggi si può fare?** | **Sì, subito.** Conti è l'app con i calcoli più maturi del repo. |

**Perché lo scaduto e non il fatturato.** Il fatturato è un numero di vanità: fa
piacere e non fa fare niente. Lo scaduto invece produce **una telefonata**. Conti
sa già dire a chi telefonare per primo (`prioritaIncasso()`) e sa già scrivere il
testo del sollecito.

> ### ⚠️ Aggiornamento del 02/08 — il tempo di incasso adesso si MISURA
>
> Quando questa scheda è stata scritta, Conti non sapeva **quando** una fattura
> era stata incassata: c'era solo la spunta «incassata». Da lì la conclusione
> prudente qui sotto — niente DSO, si scrive «età media del credito».
>
> Adesso non è più così. Conti registra la **data vera dell'incasso** (anche per
> acconti multipli) e `tempoMedioPagamento()` restituisce i **giorni medi fra
> emissione e saldo** contati sulle date vere, più i **giorni medi oltre la
> scadenza**. È meglio del DSO classico, non peggio: il DSO è una **stima** che
> divide il credito per il fatturato di periodo, questo è una **misura**.
>
> Con una regola di onestà già scritta nel codice e coperta da prove: le fatture
> segnate incassate **senza data** (quelle di prima) restano **fuori dalla media**
> e vengono contate a parte in `senzaData`. Contarle a zero giorni farebbe
> sembrare i clienti più puntuali di quanto sono.
>
> **Per la tessera T2** questo vuol dire che la riga della tendenza può dire una
> cosa vera e utile: *«i tuoi clienti pagano in media a 47 giorni, 12 oltre la
> scadenza»* — e, se ci sono fatture senza data, dirlo accanto invece di
> nasconderlo.

**Onestà sul DSO.** Il DSO (giorni medi di incasso) è l'indicatore che tutti i
manuali italiani citano per la liquidità. **Non lo possiamo calcolare oggi**:
serve il fatturato del periodo, che Conti non ha (il codice lo dice esplicitamente:
`etaCredito` non è il DSO). Mettere "DSO" su una tessera calcolandolo in un altro
modo sarebbe scorretto verso un commercialista. Si scrive **"età media del
credito"**, che è quello che sappiamo davvero.

---

#### T3 · MEZZI DISPONIBILI

| | |
|---|---|
| **Valore grande** | % di mezzi operativi (es. `86%`) |
| **Confronto** | `12 operativi su 14 · riferimento di settore 92-94%` |
| **Tendenza** | `2 fermi: Dumper 3 (guasto), Pala 1 (verifica)` |
| **Micro-grafico** | ~~nessuno~~ **la linea della disponibilità registrata** — vedi l'aggiornamento del 02/08 |
| **Fonte** | **Flotta** — `mezzi` (campo `stato`), `disponibilita` (la fotografia del giorno), `fermi` (inizio, fine, causale) |
| **Funzioni già esistenti** | `disponibilitaFlotta()`, `disponibilitaStorico()`, `fotografiaDaRegistrare()`, `affidabilitaFlotta()` |
| **Clic** | apre **Flotta → Mezzi**, filtro "non operativi" |
| **Oggi si può fare?** | **Sì, subito, e ORA anche con l'andamento.** |

> **Aggiornamento del 02/08.** Quando la scheda è stata scritta, Flotta sapeva
> dire solo com'era messo il parco **adesso**. Adesso registra una **fotografia
> al giorno** (`fotografiaDaRegistrare`, una riga sola per giornata) e soprattutto
> i **fermi** come fatti con un inizio, una fine e una causale — da cui esce la
> disponibilità **reale** (`giorni-macchina persi / giorni-macchina disponibili`),
> non la fotografia di adesso. Due cose da tenere per la tessera: la percentuale
> «adesso» e quella «sui 30 giorni» sono **due numeri diversi** e vanno etichettati
> come tali; e i giorni **senza registrazione** non valgono «tutto operativo» —
> `disponibilitaStorico` li conta in `giorniSenza` apposta per poterli scrivere.

Il riferimento 92-94% è già scritto dentro Flotta. Il cruscotto lo riusa: è l'unico
modo per far capire a un titolare se 86% è buono o pessimo.

---

#### T4 · SICUREZZA

| | |
|---|---|
| **Valore grande** | giorni senza infortuni (es. `147`) |
| **Confronto** | `12 mesi: 1 infortunio, 4 mancati infortuni` |
| **Tendenza** | il record precedente, se superato: `mai così bene` |
| **Micro-grafico** | nessuno |
| **Fonte** | **Scudo** — `infortuni` (`data`, `tipo: infortunio / near-miss`, `gravita`, `giorniAssenza`) |
| **Funzione già esistente** | `riepilogoInfortuni()` in `apps/scudo/scudo-data.js` (i mancati infortuni **non** azzerano il contatore: è corretto) |
| **Clic** | apre **Scudo → Infortuni** |
| **Oggi si può fare?** | **Sì, subito.** |

**Onestà sugli indici infortunistici.** Indice di frequenza e indice di gravità
sono gli indicatori "veri" della sicurezza, quelli che finiscono nel DVR. Si
calcolano su **ore lavorate**, che nessuna delle nostre app registra. Non li
mettiamo, e non li promettiamo. Il cartellone "giorni senza infortuni" è uno
strumento reale usato in tutte le cave del mondo, ed è quello che sappiamo fare
bene.

Nota: **il numero grande della sicurezza non diventa mai rosso.** Un contatore a
zero è un lutto, non un allarme da cruscotto. Quando il contatore si azzera la
tessera diventa **neutra** con la frase "infortunio registrato il 14/07 — chiudi
l'indagine". La regola completa è in §2.

---

#### T5 · AMBIENTE

| | |
|---|---|
| **Valore grande** | punti di misura fuori soglia (es. `1`) |
| **Confronto** | `su 9 punti monitorati · 7 conformi, 1 in attenzione` |
| **Tendenza** | `ultima misura fuori soglia: 3 giorni fa, Vibrazioni P2` |
| **Micro-grafico** | la serie storica dell'ultimo punto fuori soglia, con la linea della soglia |
| **Fonte** | **Sentinella** — `monitoraggi` (`valore`, `soglia`, `unita`, `letture[]`) |
| **Funzioni già esistenti** | `statoMisura()`, `riepilogoConformita()`, `serieStorica()` in `apps/sentinella/sentinella-data.js` |
| **Clic** | apre **Sentinella → Monitoraggi**, filtro "superamento" |
| **Oggi si può fare?** | **Sì, subito, ed è l'unica tessera con un vero grafico storico** (Sentinella è l'unica app che tiene lo storico delle letture). |

---

#### T6 · AUTORIZZAZIONE — QUANTO RESTA

| | |
|---|---|
| **Valore grande** | anni di vita residua al ritmo attuale (es. `6,2 anni`) |
| **Confronto** | `riserve residue 1.070.000 m³` |
| **Tendenza** | `al ritmo del piano: 172.000 m³/anno` |
| **Micro-grafico** | una barra che si svuota |
| **Fonte** | **Terra** — `piano` (`riserveM3`, `pianificatoAnnuoM3`) + `rilievi` |
| **Funzione già esistente** | `riservaResidua()` in `apps/terra/terra-data.js` |
| **Clic** | apre **Terra → Piano** |
| **Oggi si può fare?** | **Sì, subito.** Le riserve restano un numero digitato a mano (ed è giusto: le stima un tecnico), ma ~~la scadenza dell'atto non esiste~~ **adesso esiste** — vedi qui sotto. |

> **Aggiornamento del 02/08.** Terra ha uno **scadenzario del titolo** con i tipi
> tipici già pronti da scegliere invece che da digitare: scadenza
> dell'**autorizzazione**, **fideiussione**, screening/VIA, collaudo, rilievo
> periodico, comunicazione dei volumi all'ente. Con una regola vincolante scritta
> nel codice e coperta da prove: **nessuna periodicità è cablata**, perché termini
> e ricorrenze cambiano da regione a regione e da atto ad atto — li mette sempre
> l'utente, e la proposta esce marcata «da verificare».
> Per la tessera questo vuol dire che «quanti anni mi restano» può dire **due**
> cose invece di una: gli anni di **materiale** e gli anni di **titolo**. E la più
> corta delle due è quella che conta.

Questa è la tessera che un gestionale generalista non ha mai. Per un titolare di
cava è la domanda esistenziale: *quanti anni mi restano?*

---

### 1.5-bis · Prova sul campo — le sei tessere si riempiono davvero?

*Misurato il 02/08 chiamando le funzioni con l'archivio dimostrativo di ogni
app. «Esiste la funzione» si vede dall'elenco; qui la domanda era un'altra:
**che numero esce**, e contiene le tre cose che la scheda pretende?*

| tessera | esce questo | è azionabile? |
|---|---|---|
| **T1 Produzione anno** | estratti **79.400 m³** su un piano di **125.000**, frazione d'anno 0,58 → proiezione **137.221 m³**, **110% del piano**, stato **rosso** | **Sì**: dice «al ritmo di oggi **sfori l'autorizzato**», che è la cosa che fa alzare il telefono |
| **T2 Cassa** | **28.050 €** scaduti su 42.050 da incassare; invecchiamento 2 fatture in 1-30 giorni; tempo medio di incasso **26 giorni**, **4 in anticipo** sulla scadenza | **Sì**, e con la riga d'onestà: **1 fattura senza data** resta fuori dalla media e si dichiara |
| **T3 Mezzi** | **67% adesso** (4 operativi su 6) ma **92,2% sui 30 giorni** contando i fermi veri; 14 giorni-macchina persi su 180; il peggiore è **Dumper D3** con 11 giorni e un fermo **ancora aperto** | **Sì**, e i due numeri vanno etichettati: «adesso» e «sui 30 giorni» dicono cose diverse |
| **T4 Sicurezza** | **178 giorni** senza infortuni; 12 mesi: 1 infortunio, 5 mancati infortuni, 0 gravi | **Sì** |
| **T5 Ambiente** | **1 superamento** e 1 in attenzione su 5 punti monitorati | **Sì** |
| **T6 Autorizzazione** | riserve residue **1.120.600 m³** → **8,9 anni** di materiale. Ma il titolo scade il **14/03/2031**, cioè **~4,6 anni** | **Sì, e con la cosa che vale davvero**: le due risposte sono diverse, e **quella che conta è la più corta** |
| **T7 La giornata** | attività del turno, fermi, rapportini consegnati | **Sì** |

**Il caso T6 merita una riga in più.** Un gestionale generalista, se anche
avesse le riserve, direbbe «ti restano quasi nove anni». La verità è che ne
restano **quattro e mezzo**, perché prima del materiale finisce il **titolo**. È
esattamente il tipo di cosa che si vede solo mettendo insieme due app, ed è la
ragione per cui il Quadro esiste.

> **Nota di metodo, pagata sul momento.** La prima passata di questa prova
> rispondeva `null` su T1 e T6, e sembrava che le due tessere non fossero
> alimentabili. Non era vero: avevo passato a `proiezioneAnnua` l'oggetto
> dell'autorizzazione dove voleva un **numero**, e a `riservaResidua` la stessa
> cosa. È la regola di `CLAUDE.md`: quando una prova risponde male, prima di
> dire che c'è un difetto si legge **come il codice si aspetta i dati** — una
> prova sbagliata che accusa il codice fa perdere più tempo di nessuna prova.

### 1.6 Le tre tessere secondarie (sotto la piega)

Stessa forma, meno peso visivo (numero a 20px invece di 30px).

#### T7 · LA GIORNATA IN CORSO
Attività concluse su totale, minuti di fermo, squadre che non hanno consegnato il
rapportino. **Fonte:** Campo (`attivita` con `data`+`turno`, `rapportini`,
`squadre`). **Funzioni:** `avanzamentoGiornata()`, `paretoFermi()`,
`coperturaRapportini()`. **Clic:** Campo → Attività. **Oggi:** sì, subito.

#### T8 · COSTO DEI MEZZI PER TONNELLATA
Costi registrati in Flotta diviso le tonnellate stimate da Terra.
~~**Oggi: NO**~~ → **Oggi: SÌ per metà.** *(aggiornamento del 02/08)* I costi di
Flotta **hanno una data**: `costiPerMese()` li raggruppa per mese di competenza,
e con due regole di onestà già coperte da prove — le voci **senza data** non
vengono attribuite a nessun mese ma **dichiarate** a parte, e un mese **senza
registrazioni non è un mese a zero euro** (non compare, e `mancanti` dice quanti
sono). Anche i rifornimenti col prezzo entrano da soli nei costi, con la loro data.
Resta aperta l'altra metà: il **legame con la cava**, cioè a quale sito attribuire
il costo quando i siti sono più d'uno. Con un sito solo la divisione «costi del
mese / tonnellate del mese» si può già fare, ed è onesta purché il mese abbia
registrazioni da tutt'e due le parti.

#### T9 · GARE E LAVORI
Gare aperte, valore a base d'asta, tasso di vittoria. **Fonte:** Conti (`gare`).
**Funzione:** `gareRiepilogo()`. **Oggi:** sì, subito — ma è la meno urgente:
è un indicatore commerciale, non operativo. Sta bene in fondo.

---

### 1.7 Cosa NON mettere sul cruscotto (e perché)

| Tentazione | Perché no |
|---|---|
| Fatturato totale, tonnellate totali dall'inizio | Numeri di vanità: crescono sempre, non fanno fare niente. |
| Una torta con la ripartizione dei costi | Le torte si leggono male. La ripartizione sta in Flotta, dove serve. Sul cruscotto va il **totale**, non la fetta. |
| Il meteo | Bello, ma non è un indicatore di andamento della cava. Sta nel core, dove è già. |
| Un contatore di documenti caricati | Misura l'attività del software, non quella della cava. |
| Percentuali senza il numero sotto | "86%" senza "12 su 14" costringe a indovinare quanto è grande la torta. |
| Un numero con quattro decimali | In cava non esiste la quarta cifra decimale. Arrotondare è un atto di rispetto. |
| Indici infortunistici, OEE, DSO | Servono dati che oggi nessuno inserisce (ore lavorate, tempo teorico di turno, fatturato di periodo). Vedi §4. |

---

### 1.8 Le cinque domande che solo l'ecosistema sa rispondere

Questa è la parte commerciale del documento: **il motivo per cui sei app collegate
valgono più di sei app comprate da sei fornitori diversi.** Nessun gestionale
singolo può rispondere a queste domande, perché ognuna attraversa due o tre app.

1. **"Quanto mi costa davvero una tonnellata?"**
   Costi (Flotta) ÷ tonnellate (Terra, via densità del litotipo). Un software di
   manutenzione sa i costi ma non i volumi. Un software di rilievo sa i volumi ma
   non i costi. *Stato: manca il campo data sui costi — §4.3.*

2. **"Il fermo di stamattina, quanto mi è costato?"**
   Campo sa che il frantoio è fermo da 90 minuti per guasto. Flotta sa che quel
   mezzo aveva un tagliando scaduto. Terra sa quanti m³/ora fa quel fronte.
   Mettendo insieme i tre pezzi si passa da "c'è stato un fermo" a "quel tagliando
   rimandato è costato 340 tonnellate". *Stato: serve un ritmo produttivo di
   riferimento — §4.3.*

3. **"La volata di ieri ha fatto tremare le case?"**
   Genesi ha progettato la carica, Campo ha registrato la carica reale foro per
   foro, Sentinella ha la misura di vibrazione e il registro volate con la
   distanza dal ricettore. Una riga sola di storia: progetto → esecuzione →
   effetto. *Stato: parzialmente possibile — Genesi oggi salva solo nel browser
   (§4.3), ma Campo e Sentinella si parlano già.*

4. **"Chi c'è sul fronte adesso è in regola?"**
   Scudo sa chi ha l'idoneità scaduta. Campo sa quale squadra è in turno. Oggi le
   squadre di Campo hanno un **numero** di persone, non i **nomi**. Con quel
   collegamento, il cruscotto potrebbe dire "attenzione: nella squadra B c'è una
   persona con visita medica scaduta". *Stato: serve il legame squadre ↔ persone —
   §4.3. Ma è la funzione più venduta dell'intero progetto.*

5. **"Il materiale che ho scavato è lo stesso che ho venduto?"**
   Terra sa i m³ rilevati col drone. Conti sa quanto è stato fatturato. La
   differenza fra i due è la riconciliazione: cali, giacenze, o un problema.
   *Stato: serve una tonnellata di riferimento comune — §4.3.*

Vale la pena scriverlo così, anche nei materiali di vendita: **non vendiamo sei
app, vendiamo le risposte che stanno in mezzo alle sei app.**

---

## 2. La regola dei semafori

### 2.1 Il principio: il cruscotto non inventa soglie

Questa è la regola più importante di tutto il documento.

Ogni app ha **già** le sue soglie, scritte nel codice, testate, coerenti con la
norma. Il cruscotto **non ne inventa di nuove**: chiama le stesse funzioni e mostra
lo stesso colore. Altrimenti succede il disastro classico: il cruscotto dice verde
e l'app dice giallo, e il titolare smette di fidarsi di tutti e due.

**Nessuno stato semaforo viene salvato su Firestore.** Si ricalcola sempre dalla
data o dal valore. È già così in tutte e sei le app, ed è la scelta giusta: un
"verde" salvato tre mesi fa è una bugia che invecchia da sola.

### 2.2 Le soglie che già esistono (da riusare tali e quali)

| Cosa | Rosso | Giallo | Verde | Dove sta scritto |
|---|---|---|---|---|
| Scadenza (persone, documenti, adempimenti, mezzi) | già scaduta | entro 30 giorni | oltre 30 giorni | Scudo, Sentinella, Flotta — tutte e tre usano 0/30 |
| Scadenze di legge dei mezzi | scaduta o oggi | entro il preavviso | oltre | Flotta, preavviso **regolabile dall'utente**, 30 gg di default |
| Manutenzione a ore motore | ore superate | mancano ≤ 50 ore | oltre | Flotta |
| Ricambio a magazzino | giacenza 0 | giacenza ≤ soglia minima | sopra | Flotta |
| Misura ambientale | ≥ 100% della soglia | ≥ 90% della soglia | sotto | Sentinella |
| Proiezione volumi | > 100% dell'autorizzato | ≥ 90% | sotto | Terra |
| Sollecito fattura | oltre 45 giorni di ritardo | 1-45 giorni | in termine | Conti |
| Scostamento carica volata | oltre 25% | 10-25% | ≤ 10% | Campo |
| Accuratezza di un rilievo | — | metodo indicativo (±8%) | survey-grade (±2%) | Terra |

Osservazione utile: **la regola migliore del repo è quella di Sentinella** (90% /
100% della soglia), perché è **relativa**. Funziona con qualunque unità di misura e
con qualunque soglia decida il cliente. È il modello da estendere ovunque ci sia
un obiettivo numerico.

### 2.3 Le soglie nuove che servono al cruscotto (e la loro giustificazione)

Solo due, entrambe costruite sul modello relativo di Sentinella:

| Tessera | Verde | Giallo | Rosso | Perché questi numeri |
|---|---|---|---|---|
| **T1 Produzione anno** | ≥ 95% del pro-quota | 85-95% | < 85% | Le fonti sui semafori (ClearPoint, Intrafocus, SimpleKPI) convergono su ±5% verde / ±10% giallo. Sotto l'85% del pro-quota il piano annuale non si recupera più senza una decisione. |
| **T3 Mezzi disponibili** | ≥ 90% | 80-90% | < 80% | Il riferimento di settore è 92-94% (già citato in Flotta); la media reale è 72-78%. 90/80 è la lettura onesta per una cava italiana. |

Per **T2 Cassa** e **T6 Autorizzazione** il colore lo dà l'aggregato:

- **T2**: rosso se c'è almeno una fattura oltre 90 giorni **oppure** se lo scaduto
  supera il 25% del credito aperto; giallo se c'è scaduto ma sotto quelle soglie;
  verde se non c'è scaduto.
- **T6**: rosso se restano meno di 2 anni di riserve; giallo sotto i 5; verde sopra.
  *(Due e cinque anni sono i tempi tipici di un iter autorizzativo in Italia: sono
  i numeri di partenza, il titolare li deve poter cambiare.)*

**Tutte le soglie devono essere modificabili dal cliente**, con il valore di
partenza scritto chiaro. Flotta lo fa già per il preavviso delle scadenze
(salvato nel browser). È la strada giusta: una cava di dieci mezzi e una di
cinquanta non hanno la stessa idea di "poco".

### 2.4 La tabella delle azioni — cosa fare quando è rosso

Questa tabella è il cuore del cruscotto. Senza, abbiamo fatto un poster.

| Tessera | Giallo → cosa suggerire | Rosso → cosa suggerire |
|---|---|---|
| **T1 Produzione** | "Sei sotto il ritmo. Guarda i fermi della settimana." → Campo, Pareto fermi | "Al ritmo attuale sfori il volume autorizzato a novembre." → Terra, Piano. Oppure il contrario: "chiudi l'anno al 78% del piano" → decisione di direzione |
| **T2 Cassa** | "N fatture da sollecitare. Il testo è già pronto." → Conti, priorità di incasso | "€X fermi da oltre 90 giorni su N clienti. Valuta il recupero formale (mora di legge già calcolata)." → Conti, estratto conto cliente |
| **T3 Mezzi** | "N mezzi in verifica. Controlla se bloccano il fronte." → Flotta, mezzi | "Disponibilità sotto l'80%: N mezzi fermi da G giorni. Priorità del giorno già ordinata." → Flotta, priorità operative |
| **T4 Sicurezza** | *(non esiste il giallo)* | *(non esiste il rosso — vedi sotto)* |
| **T5 Ambiente** | "Punto X al 94% della soglia. Riduci la carica per ritardo o allontana il fronte." → Sentinella, monitoraggi | "Superamento su X. Registra la misura, avvisa il consulente, verifica la volata del giorno." → Sentinella, registro volate |
| **T6 Autorizzazione** | "Restano meno di 5 anni. L'iter di rinnovo dura anni: comincia a parlarne." → Terra, Piano | "Meno di 2 anni di riserve al ritmo attuale." → Terra, Piano |
| **T7 Giornata** | "N squadre non hanno consegnato il rapportino." → Campo, rapportini | "Oltre N minuti di fermo oggi, causale principale: guasto meccanico." → Campo, Pareto |

**Il caso speciale della sicurezza.** La tessera T4 non ha semaforo nel senso
normale. Un contatore alto non è "verde per merito" e un contatore a zero non è
"rosso per colpa": è un fatto appena successo. La regola:

- contatore ≥ 30 giorni → tessera **verde**, nessuna riga d'azione;
- contatore < 30 giorni → tessera **neutra** (grigia, non gialla) con la riga
  "infortunio del [data] — l'indagine è chiusa?";
- il rosso della sicurezza **non sta qui**: sta nel centro avvisi, sotto forma di
  scadenze superate (visita medica scaduta, formazione scaduta, non idoneità).
  Quelle sì che sono azionabili.

Questo evita l'effetto perverso che tutti gli RSPP conoscono: se il contatore
diventa rosso, gli infortuni piccoli smettono di essere dichiarati.

### 2.5 Il colore da solo non basta mai

Circa l'8% dei maschi non distingue rosso e verde. In cava, al sole, con gli
occhiali da sole, la percentuale pratica è molto più alta. Quindi, **sempre e in
ogni tessera**, tre codifiche insieme:

1. **Colore** — `--success` / `--warn` / `--danger` del core.
2. **Simbolo** — `●` in regola · `▲` attenzione · `■` critico. (Forme diverse, non
   solo colori diversi. E niente emoji nei simboli di stato: cambiano faccia da un
   telefono all'altro.)
3. **Parola** — "in regola" / "attenzione" / "critico", scritta.

Più la **posizione**: il centro avvisi mette in cima le cose rosse. L'ordine è
un'informazione, e si legge anche in bianco e nero.

E in **modalità sole** (`body.outdoor-mode`, che il core ha già: fondo bianco,
testo 18px, bersagli 60px, niente ombre) il cruscotto deve funzionare uguale: è
la modalità con cui si guarda il telefono in piazzale.

---

## 3. Il centro avvisi unico

### 3.1 L'idea in una frase

**Un posto solo dove finisce tutto quello che scade o è fuori norma, da tutte e sei
le app, ordinato per gravità, dove ogni riga ha un pulsante che fa qualcosa.**

Oggi il titolare, per sapere cosa lo aspetta, deve aprire sei app e guardare sei
liste di "Urgenze" / "Priorità" / "Priorità operative". Tre app su sei hanno già
costruito una lista aggregata al loro interno — e sono le migliori parti di quelle
app. Il centro avvisi fa lo stesso, un piano sopra.

### 3.2 Cosa ci finisce dentro, app per app

| App | Cosa manda | Da quale dato |
|---|---|---|
| **Scudo** | scadenze superate e in scadenza (visite, corsi, patentini, DPI); lavoratori non idonei o idonei con prescrizioni; documenti scaduti o da rivedere; azioni correttive scadute | `scadenze.dataScadenza`, `lavoratori.idoneita`, `documenti.stato`, `azioni.scadenza` |
| **Flotta** | manutenzioni scadute o vicine (a data e a ore motore); scadenze di legge dei mezzi; ricambi sotto scorta o esauriti; mezzi fermi | `manutenzioni.dataPrevista`/`orePreviste`, `scadenze.dataScadenza`, `ricambi.giacenza`, `mezzi.stato` |
| **Conti** | fatture scadute con il livello di sollecito consigliato; clienti oltre fido; gare in scadenza | `fatture.scadenza`, `clienti.fido`, `gare.scadenza` |
| **Sentinella** | punti in superamento o in attenzione; adempimenti verso gli enti in scadenza; registri non aggiornati | `monitoraggi.valore/soglia`, `adempimenti.scadenza`, `registri.stato` |
| **Terra** | proiezione oltre il volume autorizzato; rilievi pianificati e mai eseguiti; fronti sospesi da troppo tempo | `proiezioneAnnua()`, `rilievi.stato: pianificato` con data passata, `fronti.stato` |
| **Campo** | squadre senza rapportino a fine turno; attività in anomalia aperte da più di un turno; fermi oltre soglia | `coperturaRapportini()`, `attivita.stato: anomalia`, `attivita.fermoMin` |

### 3.3 Come si presenta una riga

```
■  Visita medica scaduta — M. Rossi                   SCUDO
   scaduta da 12 giorni · lavoratore attivo
   [Rinnova]  [Copia promemoria]  [Rinvia 7 gg]
```

Quattro elementi obbligatori:

- **Simbolo + colore** a sinistra (`■` rosso / `▲` giallo).
- **Titolo in una riga**: cosa e chi. Niente gergo.
- **Sottotitolo**: da quanto, e perché è grave. *"Scaduta da 12 giorni"* è
  un'informazione. *"Stato: non conforme"* non lo è.
- **Etichetta dell'app** a destra, nel colore dell'app.
- **Da uno a tre pulsanti**, di cui il primo è l'azione ovvia.

Graficamente è la `.sitem` del core: fondo `--card`, raggio 8px, `border-left: 3px`
del colore dello stato, scivolamento di 3px al passaggio del mouse. Identica alle
liste che il titolare vede già dentro le app.

### 3.4 Le sette regole contro il rumore

Il rischio di un centro avvisi è diventare la cartella spam: dopo due settimane
nessuno lo guarda più. Dalle fonti su *alert fatigue* (PagerDuty, Courier,
LogicMonitor, Smashing Magazine) e dal buon senso di cava:

1. **Tre livelli, non dieci.**
   **Rosso** = già fuori norma o scaduto (fermerebbe la cava o costa soldi adesso).
   **Giallo** = scade entro 30 giorni (si programma, non si rincorre).
   **Grigio** = informativo (nascosto per impostazione predefinita).
   Chi definisce dieci livelli di priorità sta in realtà dicendo che non sa quali
   contano.

2. **Massimo cinque righe in home.** Poi *"vedi tutti (12)"*. Cinque è il numero
   che si legge in dieci secondi. Un elenco di venti righe è un elenco di zero
   righe.

3. **Si raggruppa per oggetto, non per evento.** Quattro corsi di formazione in
   scadenza fanno **una** riga: *"Formazione: 4 scadenze entro 30 giorni"*, che si
   apre. Non quattro righe uguali. È la regola della "deduplicazione" di tutti i
   sistemi di allerta seri.

4. **Un avviso senza pulsante non è un avviso, è una statistica.** Se non esiste
   qualcosa che il titolare possa fare da lì, quella riga va tolta e messa in una
   tessera. Test brutale, ma pulisce l'elenco meglio di qualunque discussione.

5. **Si può rinviare, e il rinvio si vede.** Ogni riga ha *"Rinvia 7 giorni"*. Chi
   non può rinviare, ignora. Ma il rinvio **non cancella**: la riga torna, e nel
   dettaglio si legge *"rinviato 2 volte"*. Rinviare tre volte lo stesso avviso è
   un'informazione di gestione.

6. **Ordinamento a regole, non a punteggio segreto.** Il titolare deve poter capire
   perché una riga sta in cima:
   a) prima i rossi, poi i gialli;
   b) dentro lo stesso colore, prima quello che è scaduto da più tempo;
   c) a parità, prima quello che vale più soldi (una fattura da €40.000 batte una
   da €400);
   d) a parità di tutto, prima quello che riguarda le persone.
   Quattro regole scritte in italiano, verificabili. Niente algoritmo misterioso.

7. **"Novità dall'ultimo accesso".** Non mandiamo email (costerebbe, e non
   possiamo spendere). Ma il centro avvisi può segnare in grassetto le righe
   comparse dopo l'ultima visita, con la data dell'ultimo accesso salvata nel
   browser. Costo zero, effetto "riepilogo giornaliero".

### 3.5 Il collegamento con il "quarto d'ora del mattino"

Le fonti sui *daily huddle* (le riunioni operative di cinque-quindici minuti a
inizio giornata, standard nelle cave e negli impianti) dicono che funzionano se c'è
**una lavagna sola** che tutti guardano.

Il centro avvisi è quella lavagna. Con una funzione in più, praticamente gratis:
un pulsante **"Stampa il punto della giornata"** che genera una pagina A4 con la
frase di stato, le sei tessere e i cinque avvisi. Campo ha già un rapporto di fine
turno stampabile: si riusa lo stesso meccanismo (una finestra con CSS di stampa,
zero librerie).

---

## 4. Cosa possiamo mostrare già oggi, e cosa no

Sezione della verità. L'ho scritta leggendo il codice, non le brochure.

### 4.1 Pronto subito — il dato c'è e il calcolo pure

Queste quattordici cose si costruiscono **richiamando funzioni che esistono già**,
senza toccare le app:

| Cosa | Funzione già scritta | File |
|---|---|---|
| Estratto sull'anno e proiezione vs autorizzato | `proiezioneAnnua()` | `apps/terra/terra-data.js` |
| Riserve residue e anni di vita | `riservaResidua()` | `apps/terra/terra-data.js` |
| m³ del mese, rilievi del mese, avanzamento piano | `kpiFrom()` | `apps/terra/terra-data.js` |
| Scaduto, invecchiamento del credito, incasso atteso | `agingIncassi()`, `incassoAtteso()` | `apps/conti/conti-data.js` |
| Previsione incassi mese per mese (6 mesi) | `incassoPerMese()` | `apps/conti/conti-data.js` |
| Clienti esposti e oltre fido | `esposizioneClienti()` | `apps/conti/conti-data.js` |
| Tasso di vittoria sulle gare | `gareRiepilogo()` | `apps/conti/conti-data.js` |
| Disponibilità della flotta | `disponibilitaFlotta()` | `apps/flotta/flotta-data.js` |
| Scadenze di legge dei mezzi col semaforo | `contaScadenzeMezzi()` | `apps/flotta/flotta-data.js` |
| Ricambi sotto scorta / esauriti | `sottoScorta()` | `apps/flotta/flotta-data.js` |
| Scadenze del personale (scadute / 30 gg / regolari) | `kpiFrom()`, `statoScadenza()` | `apps/scudo/scudo-data.js` |
| Giorni senza infortuni, mancati infortuni, gravità | `riepilogoInfortuni()` | `apps/scudo/scudo-data.js` |
| Conformità ambientale e serie storica con soglia | `riepilogoConformita()`, `serieStorica()` | `apps/sentinella/sentinella-data.js` |
| Avanzamento giornata, produzione per turno, Pareto fermi | `avanzamentoGiornata()`, `totaliProduzione()`, `paretoFermi()` | `apps/campo/campo-data.js` |

Sono **tutte e sei le tessere principali** più T7 e T9. Il cruscotto minimo è già
alla nostra portata.

### 4.2 L'ostacolo tecnico da risolvere prima (uno solo, ma vero)

Lo SDK Deepwork ID isola i dati per app: `orgCollection()` scrive sempre dentro
`organizations/{azienda}/apps/{app}/{collezione}`, e `DeepworkID.init()` si chiama
una volta sola con **un** nome di app.

Un cruscotto che legge sei app deve quindi:
- **o** avviare l'SDK sei volte (una per app);
- **o** aggiungere allo SDK un modo pulito per leggere una collezione di un'altra
  app della stessa azienda.

La seconda è più ordinata. In tutti e due i casi **le regole di sicurezza Firestore
vanno riviste e ri-testate**: si concede la lettura fra app **dentro la stessa
organizzazione**, mai fuori. È il cuore della promessa multi-tenant, quindi va
fatto con i test (i 19 test di `apps/deepwork-id/tests` vanno estesi, non aggirati).

Nota di sicurezza: il cruscotto è per il titolare, quindi va anche deciso **chi lo
vede**. Il core ha già un permesso `dashboard` limitato ai ruoli `admin` e
`ufficio`: lo stesso principio vale qui. Un capoturno non deve vedere lo scaduto
dei clienti.

Regola d'oro per la costruzione: **il cruscotto legge e basta.** Non scrive mai
niente in nessuna app. Se una riga di avviso ha un pulsante "Rinnova", quel
pulsante **apre l'app giusta al punto giusto**; non modifica il dato da fuori. Così
resta una sola strada per scrivere ogni dato, e nessuna app può essere corrotta dal
cruscotto.

### 4.3 Non si può fare oggi — e cosa manca esattamente

Qui la lista è precisa apposta: ogni riga dice **la cosa piccola** che sblocca la
funzione.

| Vorremmo mostrare | Perché oggi no | Cosa serve prima (piccolo e concreto) |
|---|---|---|
| **Costo per tonnellata** | I costi in Flotta hanno voce, importo e nota ma **nessuna data** e nessun legame con la cava. Non si può dire "i costi di luglio". | Aggiungere `data` (e più avanti `cavaId`) alla voce di costo. Mezz'ora di lavoro, sblocca l'indicatore economico più richiesto. |
| **Andamento della disponibilità mezzi** | Flotta salva lo **stato attuale** del mezzo, non la sua storia. Non esiste "com'era la disponibilità a giugno". | Una fotografia giornaliera automatica (una riga al giorno: data + operativi + totale). Poche righe, e nasce il grafico. |
| **Andamento dei costi** | Stesso motivo: i costi non hanno data. | Come sopra. |
| **DSO (giorni medi di incasso)** | ~~Serve il fatturato del periodo, che Conti non ha.~~ **SBLOCCATO il 02/08** — vedi l'aggiornamento qui sotto. | — |
| **Scadenza dell'autorizzazione di cava** | Terra **non ha** l'atto autorizzativo: nessun campo per ente, numero, data di scadenza, volume totale concesso, prescrizioni. La tessera T6 sa dire "quanti anni di riserve", non "quando scade il permesso". | Una scheda "Autorizzazione" in Terra con ente, numero, scadenza, volume concesso. È anche la funzione che manca di più a Terra secondo la sua ricerca. |
| **Fideiussione, collaudo, ripristino** | Non esistono in nessuna app. | Vedi sopra: stessa scheda. |
| **"Chi è in turno è in regola?"** | Le squadre di Campo hanno un **numero** di persone, non i **nomi**; i lavoratori con le idoneità stanno in Scudo. I due mondi non si toccano. | Un elenco di persone dentro la squadra, collegato agli `id` dei lavoratori di Scudo. È la funzione più forte dell'intero ecosistema: vale la pena farla presto. |
| **Azioni correttive nel centro avvisi** | Scudo **ha già** tutta la logica delle azioni correttive (`azioni`, con responsabile, scadenza, stato, origine) e persino i riquadri nella pagina — ma il livello dati non legge la collezione, e il riquadro punta a una schermata che non esiste. Un clic lì oggi dà errore. | Completare il collegamento in Scudo (una riga nel livello dati + la schermata). **È anche un piccolo difetto da correggere a prescindere dal cruscotto.** |
| **Qualunque dato di Genesi** | Genesi salva **solo nel browser** (localStorage), non per azienda. Due persone della stessa cava vedono volate diverse. | Portare le volate di Genesi su Firestore con lo SDK, come le altre app. Lavoro non piccolo, ma è l'unico modo per far entrare Genesi nel cruscotto. |
| **Confronto progetto/reale delle volate** | Il piano di carico esiste in Campo (`pianocarico.reale`) ma si popola solo importando un CSV da Genesi; nei dati di esempio è vuoto. | Vedi sopra: il ponte Genesi → Campo diventerebbe automatico. |
| **OEE / disponibilità impianto** | Ci sono le causali di fermo e i minuti, ma manca il **tempo teorico disponibile** del turno. | Un campo "ore del turno". Ma prima chiediamoci se serve davvero a un titolare di cava: l'OEE è un indicatore da fabbrica. |
| **Indici infortunistici (frequenza, gravità)** | Servono le **ore lavorate**, che nessuna app registra. | Non lo proponiamo. Il cartellone "giorni senza infortuni" copre il bisogno vero. |

### 4.4 Il consiglio sull'ordine dei lavori

1. Il cruscotto **di sola lettura** con le sei tessere e il centro avvisi, usando
   solo le funzioni già esistenti (§4.1) — dopo aver sistemato la lettura fra app e
   le regole Firestore (§4.2).
2. Il campo **data sui costi** di Flotta → sblocca il costo per tonnellata.
3. La scheda **Autorizzazione** in Terra → sblocca la scadenza del permesso, che è
   l'avviso più importante che una cava possa ricevere.
4. Il legame **squadre ↔ persone** fra Campo e Scudo → sblocca la domanda che
   nessun concorrente sa rispondere.
5. La **fotografia giornaliera** della flotta → sblocca gli andamenti.

I punti 2 e 3 sono piccoli e valgono molto. Il punto 4 è la funzione di bandiera.

---

## 5. I grafici in SVG puro

Vincolo assoluto: **nessuna libreria esterna**. Le pagine devono restare autonome
(e gratis). Il core oggi usa Chart.js da un CDN per tre grafici a ciambella: nel
cruscotto **non lo facciamo**, sia perché aggiunge una dipendenza esterna, sia
perché le ciambelle non sono il grafico giusto.

**La buona notizia: il modello esiste già in casa.** In
`apps/sentinella/index.html` (righe 216-250) c'è un vero grafico a linee disegnato
a mano in SVG, con griglia, linea di soglia tratteggiata ed etichetta. La geometria
è calcolata da una funzione pura (`serieStorica()` in `sentinella-data.js`), il
disegno è nella pagina. È il pattern giusto: **il calcolo separato dal disegno**.
Va estratto in un piccolo aiuto condiviso e riusato.

### 5.1 I quattro grafici ammessi (e nessun altro)

| Grafico | Quando | Come si fa |
|---|---|---|
| **Micro-grafico (sparkline)** | dentro una tessera, per la tendenza | `<polyline>` di 6-12 punti, 64×20 px, senza assi, senza etichette. È una "parola disegnata", non un grafico. Serve la forma, non i valori. |
| **Barre verticali** | andamenti a passi (m³ per mese, incassi per mese) | Un `<rect>` per barra. **Sempre dallo zero.** |
| **Barre orizzontali** | classifiche (Pareto dei fermi, ripartizione costi, invecchiamento del credito) | Un `<rect>` per riga, con l'etichetta scritta accanto alla barra, non in una legenda. |
| **Barra con obiettivo (bullet)** | "quanto ho fatto rispetto a quanto dovevo" | Una barra sottile che avanza, una tacca verticale per l'obiettivo, bande grigie chiare dietro per le zone. Inventata da Stephen Few proprio per sostituire le lancette: dice le stesse cose in un decimo dello spazio. È il grafico giusto per T1 e T6. |

**Vietati:** torte e ciambelle con più di quattro fette (si leggono male, e con
quattro fette tanto vale scrivere i numeri), lancette e tachimetri (occupano
tantissimo e dicono un numero solo), 3D (fa perdere fino al 30% di velocità di
comprensione), doppio asse verticale (si può far dire quello che si vuole), aree
sovrapposte.

### 5.2 Come si disegna, in concreto

Due formule, e poi è tutta aritmetica delle medie.

Prendiamo un riquadro `viewBox="0 0 W H"` con un margine `p`:

```
x del punto i  =  p + i * (W - 2p) / (n - 1)
y del valore v =  H - p - (v - min) / (max - min) * (H - 2p)
```

La `y` è "al contrario" perché in SVG lo zero sta in alto. Per le barre dallo zero
si mette `min = 0`, e allora l'altezza della barra è `v / max * (H - 2p)`.

Regole di impianto:

- **Sempre `viewBox`**, e nel CSS `width: 100%; height: auto`. Così il grafico si
  adatta da solo al telefono e non serve ridisegnarlo quando la finestra cambia.
- **Il calcolo sta in una funzione pura** (dentro `<app>-data.js` o in un aiuto
  condiviso), che restituisce punti, percorso e tacche. Il disegno sta nella
  pagina. Come fa già Sentinella: così la geometria si può collaudare senza aprire
  un browser.
- **Massimo ~50 punti.** Oltre, si aggrega (per settimana, per mese). Un grafico
  con 400 punti in un riquadro largo 300px è rumore.
- **Niente `<foreignObject>`**, niente filtri SVG, niente ombre dentro l'SVG: si
  comportano male in stampa e su qualche telefono.

### 5.3 Onestà della scala

- **Le barre partono sempre da zero.** Non è pignoleria: l'altezza della barra *è*
  il valore. Se la base non è zero, le altezze mentono. Le fonti (Datawrapper in
  testa) sono unanimi e non ammettono eccezioni.
- **Le linee possono partire sopra lo zero**, perché una linea racconta la forma
  del cambiamento, non la grandezza assoluta. Ma allora **il primo e l'ultimo
  valore dell'asse vanno scritti**, sempre. Il micro-grafico dentro la tessera non
  ha assi: proprio per questo il numero grande accanto è obbligatorio.
- **Nessun grafico da solo.** Ogni grafico ha accanto, in testo, il numero che
  conta. Chi non vede bene, chi stampa in bianco e nero e chi guarda al sole legge
  il numero.
- **Percentuali sempre accompagnate dall'assoluto.** "86% (12 su 14)".
- **La soglia si disegna.** Quando esiste un limite (soglia ambientale, obiettivo,
  volume autorizzato), va tracciata come linea tratteggiata con l'etichetta.
  Sentinella lo fa già ed è la cosa che rende il suo grafico immediatamente utile.

### 5.4 Colori e leggibilità su fondo scuro

- Il fondo del cruscotto è quello del core (`--bg: #100d07`, schede `--card:
  #221c0e`). Su fondo scuro si ha più libertà di colori — ma i minimi restano:
  **4,5:1 per il testo**, **3:1 per linee, barre e simboli**.
- Vale la **regola dei due accenti** già stabilita nella specifica estetica:
  `--app-accent` (base) solo per **bordi, barre, pallini, riempimenti**;
  `--app-accent2` (chiaro) è **l'unico ammesso per il testo e i numeri**. Nel
  cruscotto questa regola è ancora più importante, perché i sei colori delle app
  convivono nella stessa schermata.
- **Spessore delle linee: 1,5-2px.** Sotto 1px, su fondo scuro e su schermo al
  sole, la linea sparisce.
- **Rosso e verde non devono mai essere l'unica differenza** fra due serie. Se due
  linee vanno distinte, si usano anche **tratteggio diverso** e **etichetta
  attaccata alla linea** (meglio della legenda: la legenda costringe a fare avanti
  e indietro con gli occhi).
- **Etichette dirette invece delle legende**, sempre che ci stiano.
- **Niente animazioni** sui grafici, se non una dissolvenza. E vanno spente con
  `prefers-reduced-motion`. In cava si guarda il telefono per due secondi:
  un'animazione di ingresso di mezzo secondo è un quarto del tempo disponibile.
- In **modalità sole** (fondo bianco) i colori vanno ricontrollati: gli accenti
  chiari (`--app-accent2`), pensati per il fondo scuro, su bianco diventano
  illeggibili. Serve la variante scura di ogni accento.

### 5.5 Accessibilità di un grafico SVG

Struttura minima, da applicare a tutti:

- L'`<svg>` porta `role="img"` e `aria-labelledby` che punta a un `<title>` e a un
  `<desc>` interni.
- Il `<title>` è il titolo breve: *"Volumi estratti per mese"*.
- Il `<desc>` è la frase che descrive l'andamento: *"Da gennaio a giugno, in
  crescita da 9.800 a 14.200 m³, con un calo ad aprile."* Scritta da noi, non
  generata: due righe di codice e il grafico diventa comprensibile a chi non lo
  vede.
- Se il grafico è puramente decorativo (il micro-grafico dentro la tessera, che
  ripete un'informazione già scritta accanto): `aria-hidden="true"`. Meglio niente
  che una descrizione doppia.
- I grafici con più di sei punti importanti hanno anche un collegamento **"vedi i
  numeri"** che apre la tabellina. Costa poco ed è il modo più solido.

---

## 6. Il percorso del primo accesso

Una parte della ricerca riguardava l'accoglienza di un nuovo cliente. Il cruscotto è
il punto in cui questo problema si vede: **il primo giorno il cruscotto è vuoto.**
Sei tessere con "0" e "—" sono l'anti-vendita perfetta.

### 6.1 Cosa dicono le fonti, e cosa ne facciamo

**Dati di esempio: sì, ma dichiarati.** Il consenso è netto: mostrare il prodotto
che funziona prima che l'utente abbia inserito qualcosa. Noi siamo già messi bene:
tutte e sei le app hanno una modalità dimostrativa con dati finti e un avviso in
alto. La regola da tenere: **la fascia "stai guardando dati di esempio" deve essere
impossibile da confondere con il vero**, e ci deve essere un pulsante **"Cancella i
dati di esempio"** che lascia la casa pulita. Un cliente che scopre dopo tre mesi
un mezzo finto in mezzo ai suoi perde fiducia in tutto.

**Il vuoto va progettato.** "Nessun dato" è una porta chiusa. Ogni tessera senza
dati mostra: *cosa manca*, *perché conviene*, *un pulsante che porta lì*. Esempio
per T1: *"Non ci sono ancora rilievi. Con un rilievo sai quanto hai estratto e
quanto ti resta di autorizzato. → Aggiungi il primo rilievo"*.

**Da tre a cinque passi, non venti.** Le fonti concordano: la lista di avvio ha da
tre a cinque voci, ognuna legata a un risultato che l'utente riconosce, con la
possibilità di uscire.

**I passi devono parlare della cava, non del software.** *"Carica il parco mezzi"*
va bene. *"Configura le entità del modulo Fleet"* no.

### 6.2 La lista di avvio proposta (cinque passi)

Vive nel cruscotto stesso, come una tessera in cima che sparisce quando è finita.
Ogni passo ha un import da CSV, perché tutte le app ce l'hanno già e un titolare di
cava un elenco in Excel ce l'ha quasi sempre.

| # | Passo | Cosa sblocca | Come si fa in un minuto |
|---|---|---|---|
| 1 | **Chi lavora in cava** | tessera Sicurezza, metà del centro avvisi | import CSV in Scudo (nome; ruolo; telefono) |
| 2 | **Le scadenze delle persone** | il centro avvisi diventa vero | in Scudo ci sono già 14 adempimenti tipici di cava preimpostati: si scelgono da un elenco, non si scrivono |
| 3 | **I mezzi** | tessera Mezzi | import CSV in Flotta (nome; area; ore; stato) |
| 4 | **Il piano e le riserve** | tessere Produzione e Autorizzazione | in Terra: volume annuo e riserve, due numeri |
| 5 | **Le fatture aperte** | tessera Cassa | import CSV in Conti |

Cinque passi, tutti con import, tutti con un risultato visibile **immediatamente**
sul cruscotto. La barra in cima dice *"3 di 5 — il tuo Quadro è quasi completo"*.
È la regola più importante di tutte: **ogni passo deve accendere qualcosa che si
vede**, altrimenti è compilazione di moduli.

E i passi devono poter essere **saltati e ripresi**. Un titolare che non ha ancora
i dati delle fatture non deve restare bloccato: salta il 5, il cruscotto mostra
cinque tessere su sei e la sesta dice cosa manca.

### 6.3 Una nota su quanto guidare

Il visitatore guidato con le nuvolette che spiegano ogni pulsante è la cosa che
tutti fanno e nessuno finisce. Per il nostro pubblico — un titolare di cava, non un
impiegato — meglio l'opposto: **cruscotto pieno di dati di esempio dal primo
secondo**, una fascia che lo dichiara, la lista dei cinque passi, e nient'altro.
Chi vuole capire clicca; chi non vuole, guarda i numeri e capisce lo stesso. È
esattamente la filosofia della modalità dimostrativa che le app hanno già: va solo
estesa al cruscotto.

---

## 7. Riassunto in dieci righe

1. Il cruscotto vive nell'hub, si chiama **Quadro**, e sta sopra l'elenco delle app.
2. Una frase di stato, **sei tessere**, il **centro avvisi**, tre grafici, tre
   tessere secondarie. In quest'ordine.
3. Le sei tessere: **Produzione anno · Cassa · Mezzi · Sicurezza · Ambiente ·
   Autorizzazione**. Tutte e sei si possono fare **oggi**.
4. Ogni tessera ha valore, confronto, tendenza e — se non è verde — **la frase che
   dice cosa fare** e il pulsante che ci porta.
5. Il cruscotto **non inventa soglie**: riusa quelle delle app, che già esistono e
   sono coerenti con le norme.
6. Il centro avvisi raccoglie scadenze e anomalie dalle sei app, **massimo cinque
   righe**, raggruppate, con pulsante, rinviabili, ordinate con quattro regole
   scritte in italiano.
7. Il cruscotto **legge e basta**: non scrive mai niente in nessuna app.
8. Prima di costruirlo va risolta **la lettura fra app** nello SDK, con le regole
   Firestore riviste e ri-testate: è il cuore della promessa multi-tenant.
9. Tre cose piccole sbloccano tre indicatori grossi: **data sui costi** di Flotta
   (costo per tonnellata), **scheda Autorizzazione** in Terra (scadenza del
   permesso), **squadre con i nomi** in Campo (chi è in turno è in regola).
10. Grafici in SVG a mano, quattro tipi soli, barre sempre dallo zero, il numero
    sempre scritto accanto, mai il colore da solo. Il modello è già in casa: il
    grafico di Sentinella.

---

## 8. Fonti

### Progettazione di cruscotti direzionali
- [Dashboard Design Best Practices: Layouts & Examples — Domo](https://www.domo.com/learn/article/dashboard-design-examples-best-practices)
- [Dashboard Design: Examples and Best Practices — ThoughtSpot](https://www.thoughtspot.com/data-trends/dashboard-design-examples-best-practices)
- [Executive Dashboard Design Best Practices: 10 Rules](https://appdeck.com/blog/executive-dashboard-design-best-practices)
- [Common Pitfalls in Dashboard Design — Stephen Few (PDF)](https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf)
- [Thirteen Common Mistakes in Dashboard Design](https://medium.com/@antonioneto_17307/thirteen-common-mistakes-in-dashboard-design-cc1a0dc07750)
- [What is the 5-second rule in executive dashboard design?](https://customerscience.com.au/customer-experience-2/designing-actionable-dashboards-the-5-second-rule-for-executives/)
- [Dashboards: Making Charts and Graphs Easier to Understand — Nielsen Norman Group](https://www.nngroup.com/articles/dashboards-preattentive/)
- [Design for glanceable interfaces](https://medium.com/design-bootcamp/design-for-glanceable-interfaces-how-preattentive-vision-shapes-intuitive-interactions-d2042b119280)
- [Management by exception — Wikipedia](https://en.wikipedia.org/wiki/Management_by_exception)
- [12 Dashboard Layout Patterns That Actually Work](https://www.datawirefra.me/blog/dashboard-layout-patterns)
- [Dashboard UI design: From KPIs to layouts that convert — Setproduct](https://www.setproduct.com/blog/dashboard-ui-design)

### Cruscotti direzionali in italiano (PMI)
- [Cruscotto Aziendale PMI: come monitorare la salute della tua impresa — Studio Aldegheri](https://studioaldegheri.it/cruscotto-aziendale-pmi/)
- [Il Cruscotto Direzionale: dal processo al KPI — 888 Software Products](https://www.888sp.com/it/blog/il-cruscotto-direzionale-dal-processo-al-kpi/)
- [Cruscotti direzionali e KPI: conoscere per decidere](https://projectmanagementeuropa.com/cruscotti-direzionali-e-kpi-conoscere-per-decidere/)
- [Il cruscotto di controllo aziendale e le KPI](https://esperto-business-plan.eu/cruscotto-di-controllo-aziendale/)

### Anatomia di un indicatore
- [Anatomy of the KPI Card](https://nastengraph.substack.com/p/anatomy-of-the-kpi-card)
- [Better KPI visualizations: KPI card best practices — Tabular Editor](https://tabulareditor.com/blog/kpi-card-best-practices-dashboard-design)
- [KPI Cards on a Dashboard: What Types Exist? — Qlik Community](https://community.qlik.com/t5/Member-Articles/KPI-Cards-on-a-Dashboard-What-Types-Exist/ta-p/2543950)
- [Prescriptive analytics and next best action — Trendskout](https://trendskout.com/en/ai-and-machine-learning-functions/prescriptive-analytics-and-next-best-action/)
- [What is Prescriptive Analytics and How Does It Drive Actions](https://www.flexrule.com/archives/what-is-prescriptive-analytics/)

### Semafori e soglie
- [RAG Status for KPIs: The Red-Amber-Green Playbook — ClearPoint Strategy](https://www.clearpointstrategy.com/blog/establish-rag-statuses-for-kpis)
- [Red, amber, green — RAG reporting — Intrafocus Academy](https://www.intrafocus.academy/red-amber-green-rag-reporting/)
- [How to setup RAG KPIs — SimpleKPI](https://support.simplekpi.com/KPIsTargets/RAG)
- [Performance Reporting: How To Use Traffic Light Colours And RAG Ratings — Bernard Marr](https://bernardmarr.com/performance-reporting-how-to-use-traffic-light-colours-and-rag-ratings-in-dashboards/)

### Indicatori di cava e di miniera
- [Mining Industry KPIs: 30 Metrics + Formulas — Opsima](https://opsima.com/blog/kpis/mining-industry-kpis/)
- [Mining Industry KPI Examples — Spider Strategies](https://www.spiderstrategies.com/kpi/industry/mining/)
- [Quarry Haul Truck Reports, KPIs & Fleet Performance Analytics](https://heavyvehicleinspection.com/article/quarry-haul-truck-operator-reports-kpis)
- [Mining KPIs 2025: Essential Metrics For Powerful Efficiency — Farmonaut](https://farmonaut.com/mining/mining-kpis-2025-essential-metrics-for-powerful-efficiency)
- [How Quarry Management Software Improves Compliance — Kynection](https://www.kynection.com.au/understanding-quarry-management-software-for-production-dispatch-and-compliance/)
- [Essential Systems and Software for the Modern Quarry — CEBA Solutions](https://www.cebasolutions.com/blog-posts/essential-systems-and-software-for-the-modern-quarry)
- [Piano di monitoraggio ambientale delle attività estrattive di cava — Assimpredil Ance](https://portale.assimpredilance.it/articoli/piano-di-monitoraggio-ambientale-delle-attivita-estrattive-di-cava)

### Sicurezza sul lavoro
- [Indice di frequenza e gravità infortuni: calcolo e formule — Ordex](https://ordex.it/blog/indice-di-frequenza-e-gravita-infortuni)
- [Indici infortunistici: significato, tipi e utilizzo](https://sistemigestione.com/indici-infortunistici.html)
- [Come leggere (bene) gli indici di infortuni e malattie professionali — Lavorofacile](https://www.lavorofacile.it/news/come-leggere--bene--gli-indici-di-infortuni-e-malattie-professionali-e-confrontarli-con-i-dati-nazionali)

### Indicatori economici
- [DSO: l'indicatore per gestire la tua liquidità — Coface](https://www.coface.it/news-economia-insights/dso-ovvero-l-importanza-di-controllare-i-tempi-di-incasso)
- [DSO, aging e percentuale insoluti: le metriche chiave del recupero crediti — HealFi](https://www.healfi.it/news/finanza/dso-aging-e-percentuale-insoluti-le-metriche-chiave-del-recupero-crediti)
- [Come monitorare il credito commerciale: strumenti, KPI e cruscotti — Abbrevia](https://www.abbrevia.it/affidabilita-commerciale/monitorare-il-credito-commerciale/)

### Avvisi aggregati e rumore
- [Understanding Alert Fatigue & How to Prevent it — PagerDuty](https://www.pagerduty.com/resources/digital-operations/learn/alert-fatigue/)
- [How to Reduce Notification Fatigue: 7 Proven Product Strategies — Courier](https://www.courier.com/blog/how-to-reduce-notification-fatigue-7-proven-product-strategies-for-saas)
- [Design Guidelines For Better Notifications UX — Smashing Magazine](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/)
- [Best Practices for Notification Centers — Courier](https://www.courier.com/guides/how-to-build-a-notification-center/chapter-3-best-practices-for-notification-centers)
- [Preventing Alert Fatigue in Network Monitoring — LogicMonitor](https://www.logicmonitor.com/blog/network-monitoring-avoid-alert-fatigue)
- [What Is a Daily Huddle? Benefits and Best Practices — KPI Fire](https://www.kpifire.com/blog/daily-huddle/)

### Visualizzazione onesta e accessibile
- [Why our column and bar charts start at zero — Datawrapper Academy](https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero)
- [It's never okay to crop the y-axis, except when it is — Observable](https://observablehq.com/blog/never-okay-crop-y-axis-except-when-it-is)
- [Truncating the Y-Axis: Threat or Menace? — Michael Correll (arXiv)](https://arxiv.org/pdf/1907.02035)
- [How Accessibility Standards Can Empower Better Chart Visual Design — Smashing Magazine](https://www.smashingmagazine.com/2024/02/accessibility-standards-empower-better-chart-visual-design/)
- [Color palettes and accessibility features for data visualization — Carbon Design](https://medium.com/carbondesign/color-palettes-and-accessibility-features-for-data-visualization-7869f4874fca)
- [It's time for a more sophisticated color contrast check for data visualizations — Datawrapper](https://www.datawrapper.de/blog/color-contrast-check-data-vis-wcag-apca)
- [5 Tips on Designing Colorblind-Friendly Visualizations — Tableau](https://www.tableau.com/blog/examining-data-viz-rules-dont-use-red-green-together)
- [The Ultimate Checklist for Accessible Data Visualisations — A11Y Collective](https://www.a11y-collective.com/blog/accessible-charts/)

### Grafici in SVG puro
- [How to Make Charts with SVG — CSS-Tricks](https://css-tricks.com/how-to-make-charts-with-svg/)
- [How to Scale SVG — CSS-Tricks](https://css-tricks.com/scale-svg/)
- [preserveAspectRatio — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio)
- [Creating Accessible SVG Charts and Infographics](https://accessibility-test.org/blog/compliance/creating-accessible-svg-charts-and-infographics/)
- [SVG Accessibility / ARIA roles for charts — W3C Wiki](https://www.w3.org/wiki/SVG_Accessibility/ARIA_roles_for_charts)
- [Accessible SVG line graphs — Léonie Watson](https://tink.uk/accessible-svg-line-graphs/)
- [Making SVG content fully accessible — data.europa.eu](https://data.europa.eu/apps/data-visualisation-guide/making-svg-content-fully-accessible)
- [Bullet graph — Wikipedia](https://en.wikipedia.org/wiki/Bullet_graph)
- [What Is a Bullet Graph? Definition, Uses & Examples — Domo](https://www.domo.com/learn/charts/bullet-graphs)
- [Sparkline theory and practice — Edward Tufte](https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/)
- [Executive dashboards — Edward Tufte](https://www.edwardtufte.com/notebook/executive-dashboards/)

### Primo accesso
- [SaaS Onboarding Flows: 8 Real Examples & UX Patterns](https://www.saasui.design/blog/saas-onboarding-flows-that-actually-convert-2026)
- [The Complete SaaS Onboarding Checklist — Userlist](https://userlist.com/blog/saas-onboarding-checklist/)
- [SaaS Onboarding Examples: Lessons from 20+ Top Products — Appcues](https://www.appcues.com/blog/saas-user-onboarding)
- [Empty States as Onboarding: A Practical UX Playbook — 72Technologies](https://www.72technologies.com/blog/empty-states-as-onboarding-surface)
- [Empty States — GitLab Design System](https://design.gitlab.com/regions/empty-states)

### Perché un ecosistema batte sei programmi separati
- [What is the benefit of an integrated solution versus a point solution? — Planon](https://planonsoftware.com/us/resources/blogs/what-is-the-benefit-of-an-integrated-solution-versus-a-point-solution/)
- [Point Solutions Or An Integrated Platform: A Business-Critical Decision — Forbes](https://www.forbes.com/councils/forbesfinancecouncil/2022/11/17/point-solutions-or-an-integrated-platform-a-business-critical-decision/)
- [All-in-One Platform vs Multiple Point Solutions — BQE](https://www.bqe.com/blog/all-in-one-platforms-vs-point-solution-software-which-one-is-better)

---

## Collegati

- `docs/SPECIFICA_ESTETICA_CORE.md` — i valori esatti dello stile da rispettare
- `docs/RICERCA_SCUDO_202607.md`, `RICERCA_CAMPO_202607.md`,
  `RICERCA_FLOTTA_202607.md`, `RICERCA_CONTI_202607.md`,
  `RICERCA_SENTINELLA_202607.md`, `RICERCA_TERRA_202607.md` — cosa c'è e cosa manca
  in ciascuna app
- `docs/STATO_PRODOTTO.md` — il quadro d'insieme in parole semplici
- `docs/ONBOARDING_DATI.md` — il caricamento iniziale dei dati

*Documento di sola ricerca. Nessuna modifica al codice.*
