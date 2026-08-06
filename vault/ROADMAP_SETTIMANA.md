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
- [ ] **La cecità sulle modali del core: la causa NON è nota** — e questa riga
      va letta insieme alle due qui sotto, perché fino al 06/08 diceva
      «correzione sul disco, misura in corso» mentre la misura era **già
      arrivata e diceva di no** (`301b5b7`: il selettore `.sitem` non era la
      causa, le modali restano **0 su 68**). ⏱️ Seconda riga scaduta trovata
      oggi su undici aperte, dopo quella delle violazioni AA: la roadmap ha lo
      stesso difetto che `documenti-invecchiati.mjs` misura sui documenti del
      delta, e su di lei non lo misura nessuno.
      Quello che resta aperto è la domanda vera: **perché il gesto generico non
      raggiunge le modali del core** (e nemmeno quelle di vetrina, campo, conti,
      genesi e terra, che il giro elenca come «non guardate»). Il passo giusto
      non è indovinare un terzo selettore: è far **stampare al banco quanti
      candidati ha trovato e quanti ne ha aperti**, superficie per superficie —
      la difesa già scritta in CLAUDE.md, «quanti soggetti ha guardato
      davvero», applicata a sé stesso.

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
- [ ] **B3. Genesi continua a uscire dalla pagina.** Da 186 funzioni dentro
      `genesi.html` siamo a **174**; le estraibili senza toccare l'architettura
      sono circa **90**. È l'unico pezzo di prodotto che vive quasi tutto fuori
      dalla portata delle prove.
- [ ] **B4. Le mancanze confermate del delta**, in ordine di quanto le chiede un
      ispettore. Conto aggiornato al 02/08: **54 confermate**, 6 **scadute**
      (colmate senza che la riga lo sapesse), 2 **colmate di proposito**. Regola
      nuova: chi chiude un'unità **aggiorna la riga del documento che gliel'aveva
      proposta** — è la sola cosa che fa scendere l'arretrato.

### C — Ricerca continua, nei tempi morti

- [ ] **C1. Verificare contro il codice** le tre proposte della ricerca sulle
      verifiche periodiche delle attrezzature (D.Lgs 81/08 art. 71 e Allegato
      VII, DM 11/04/2011): il **verificatore** non tracciato, il **verbale** non
      allegato, l'**esito** come testo libero invece che come lista.
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

## Riferimenti

- Ultimo checkpoint **per data vera**:
  `vault/checkpoints/20260803-141020_i-documenti-che-escono-tutte-e-sei-piu-il-core.md`
  *(dato da `node apps/deepwork-id/tests/date-checkpoint.mjs`, non letto a occhio:
  per NOME il più alto sarebbe `20260805-100000_…`, che è stato scritto **tre
  giorni prima**. Questa riga era ferma al 01/08: il puntatore al file più
  fresco era lui stesso il più vecchio.)*
  ⚠️ *Non* il più alto in ordine alfabetico: in `vault/checkpoints/` ci sono
  ancora file **datati avanti** rispetto al giorno in cui sono entrati in git
  (640 precedenti alla regola, contati da `date-checkpoint.mjs`). Chi va per
  nome apre il file sbagliato credendo che sia il più fresco.
- Le decisioni: `docs/DECISIONI_WEEKEND.md` — pagina d'ingresso in cima.
- Stato misurato al **03/08 pomeriggio**: **2.092 prove** che girano senza rete,
  copertura **649/649** e nessuna funzione scoperta, **84 banchi** che aprono le
  pagine in un browser vero, **21 comandi** nel giro `node` di casa.
  *(Al 02/08 erano 1.838, 591/591 e 49 banchi.)*
