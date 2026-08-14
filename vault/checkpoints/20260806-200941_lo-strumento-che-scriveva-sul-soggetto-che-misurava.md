# Checkpoint — 2026-08-06 20:09:41 UTC

## Tipo
unit-complete (quattro unità: Sentinella e Scudo riverificate, il core raccolto,
il banco delle modali corretto con le due uscite fuori schermo che ha trovato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b627316` — *Il banco che non apriva niente leggeva l'impronta DOPO averci
scritto sopra — e da lì sono uscite due uscite fuori schermo*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 71 | **Sentinella riverificata** (`2fef9c7`) | arretrato **8 → 0**, totale 19 → 11 |
| 72 | **il core raccolto** (`7ba9c42`) | grafico da **3 px a 120 px** su 2261,7 mc |
| 73 | **Scudo riverificata** (`f951e4e`) | arretrato **7 → 0**, totale 11 → **4** |
| 74 | **il banco delle modali** (`b627316`) | modali **0 → 11** su 68, comandi **6.800 → 980** |

## ⛔ Il filo del blocco: *lo strumento che scrive sul soggetto che misura*

La causa dello «0 modali su 68» — cercata per giorni nel selettore, poi nella
dimostrazione vuota — era **una riga**: `SCEGLI` metteva il contrassegno
`data-dw-sonda` sull'elemento **prima** di calcolarne l'impronta, e
`identita`/`forma` leggono il `dataset`. Quindi la lista dei fatti riceveva
`BUTTON|btn-x|dwSonda=1` mentre il confronto del giro dopo guardava l'elemento
**senza** contrassegno (`TOCCA` lo toglie). Non combaciavano mai: tutt'e due le
difese contro i doppioni erano morte, e i 6.800 «comandi provati» che sembravano
la prova di una superficie senza dati erano **lo stesso pugno di comandi**
contato migliaia di volte.

**La regola che ne resta:** *uno strumento che SCRIVE sul soggetto che sta
misurando deve leggerlo PRIMA di scriverci.* Il contrassegno serve a ritrovare
l'elemento dopo, non a descriverlo.

Controprova che distingue: rimesso il **solo** difetto dell'ordine in una copia
del banco (controllata sintatticamente prima di lanciarla, perché la prima
iniezione aveva prodotto una virgoletta di troppo e misurava un errore di
sintassi), la versione difettosa a **12 minuti e 14 secondi** non aveva ancora
finito il core, mentre quella corretta lo chiude e stampa il censimento.

## ⛔ La seconda faccia del filo della settimana: *il disegno che mente*

«I numeri che mentono con la faccia tranquilla» aveva una forma non ancora
censita, trovata raccogliendo il core: **il numero è giusto e a mentire è il
disegno**. Il grafico «Produzione mc · ultimi 6 mesi» generava la barra di
luglio con `style="height:100%"` e `data-val="2261.7 mc"`, e la disegnava
**3 px** — identica ai cinque mesi a zero. `.chart-bars` è alto 120px ma la
colonna dentro, con `align-items:flex-end`, resta alta quanto il suo contenuto:
`height:100%` si risolveva contro `auto` e vinceva `min-height:3px`. CSS valido,
percentuale presente, zero errori in console.
⚠️ **Non si vedeva perché non c'era mai stata una barra alta:** senza dati
d'esempio tutti i mesi sono a zero, e sei stanghette uguali sono quello che ci
si aspetta da un grafico vuoto. È la dimostrazione ad averlo reso visibile.
Da qui i **tre cantieri** aperti in parallelo (Terra, Conti, Sentinella) con lo
stesso mandato: censire ogni geometria che rappresenta una quantità e misurarne
i pixel contro il valore.

## ⚠️ Le tre cose di metodo che valgono oltre le unità

1. **«CI STA» NON È «SI USA», e il primo verde era una trappola.** Reso cedevole
   il blocco della topbar, la pagina non scorreva più — e «ESCI» era diventato
   largo **16 px** su 44 di altezza: dentro lo schermo e impossibile da premere.
   Fermandosi al primo numero verde si consegnava un difetto **peggiore** di
   quello di partenza, perché invisibile a chi misura l'overflow. Adesso cede la
   ricerca, e i tre comandi tengono 44×44 col punto centrale che appartiene a
   loro.
2. **UNA TERZA FORMA DI INVECCHIAMENTO DEI DOCUMENTI**, trovata su Scudo: non il
   «non c'è» sbagliato né quello scaduto, ma **il verdetto che regge mentre la
   PROVA scade**. Due righe: «l'unica stampa è il verbale DPI» (le stampe sono
   due) e «restano i tre export CSV» (sono quattro). Il giudizio non cambia, ma
   chi riapre la riga fra un mese verifica la prova, la trova falsa, e butta via
   **tutta** la riga — aprendo un cantiere su una funzione che esiste già.
3. **IL CONTO MENTE, IL CAMPIONE NO — tre volte in un blocco.** La mia sonda su
   `window.DB` ha risposto «0 volate, 0 mezzi» mentre le linguette mostravano i
   dati (`DB` non sta su `window`); una misura della chat ha detto «campo largo
   0» perché leggeva prima che la schermata fosse disegnata; e su Sentinella
   «13 occorrenze di wireless|LoRa|IoT» erano tutte `colOra`, `colValore`,
   `colora` — più, nelle righe aggiunte, la sillaba di **«al·lora·»**.

## Stato delle prove
Giro `node` **21 comandi, 0 caduti** sulla copia di ciò che si committa, a ogni
commit. Arretrato dei documenti del delta: **4 commit** — solo Campo; terra,
conti, flotta, sentinella e scudo a **zero**.
Banco delle modali sul core: **11 modali diverse, 436 aperture, 9.054 elementi
misurati, 306 voci di tendina, 980 comandi provati**.
A 320 px: **30 sezioni su 30** senza scorrimento orizzontale, con e senza modale.

## Che cosa sta girando adesso
**Tre cantieri**, sul filo del disegno che mente: **Terra**, **Conti**,
**Sentinella**. Hanno già scritto su `apps/conti/`, `apps/terra/`, due banchi
nuovi (`conti-barre-peso.mjs`, `sentinella-disegni.mjs`) e i due registri
condivisi (`tutti.mjs`, `run-kpi.mjs`) — che vanno raccolti **app per app**, con
l'indice costruito da `HEAD` per i file che non sono miei.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, uno per volta, con la procedura solita
   (indice da `HEAD` per i file altrui, worktree ricreata, giro `node` sulla
   copia, scatto guardato). ⚠️ `tutti.mjs` e `run-kpi.mjs` li toccano **in tre**:
   vanno raccolti per ultimi e letti riga per riga, o due bande si sovrascrivono.
2. **`docs/CONCORRENTI_CAMPO.md`** è l'ultimo arretrato (4 commit): stessa
   riverifica di oggi, con il `grep` sulle sole righe **aggiunte** dal diff —
   che è la forma che oggi ha funzionato tre volte su tre ed è molto più veloce
   del giro sui file interi.
3. **Le cinque superfici che il banco delle modali elenca come «non guardate»**
   (vetrina, campo, conti, genesi, terra): adesso che il banco funziona, sono
   una misura vera e non più una domanda aperta.
4. **La pastiglia «NON SALVA» sovrapposta al nome** a 320 px: dichiarata,
   misurata in tutt'e due le versioni, non corretta. Risulta `position:static` e
   misura **fuori dalla scatola del proprio padre** — il primo passo è capire
   quella contraddizione, non spostare la pastiglia.
5. I **due difetti di Genesi** dichiarati e non corretti (la seconda copia di
   Box–Muller a `genesi.html:1484` che ombreggia l'originale, e la riga 1910 che
   rifà a mano il corpo di `jitterGeo`).

## Code aperte, dichiarate
Le **19 decisioni** scadono **domani, venerdì 07/08**: se non arriva risposta si
procede con la colonna «la mia risposta», dichiarandolo nel commit. Restano
ferme le 6 che richiedono il fondatore; la riga **DUVRI** e la **scadenza della
comunicazione annuale** aspettano lui col suo RSPP.
⚠️ Il ripiego `||25` di `riassegnaSequenzaAuto` nel core è **il valore vietato**
dei dati di riferimento del fondatore, e finirebbe a schermo come `25ms`, `50ms`,
`75ms` sulla sequenza. La dimostrazione lo evita scrivendo il ritardo a mano su
ogni volata; il ripiego in sé resta e va tolto — unità sua, dichiarata qui
perché non si perda.

## Blocchi
Nessuno.
