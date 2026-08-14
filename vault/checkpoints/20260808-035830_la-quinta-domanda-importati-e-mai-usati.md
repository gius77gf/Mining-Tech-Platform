# Checkpoint — 2026-08-08T03:58:30Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ed444ea` — *nomi-liberi: la quinta domanda — un nome importato e mai usato*

## Che cosa è stato completato

Aperta la **quinta domanda**, che è il **verso opposto** delle prime quattro.
Quelle chiedono *«questo nome esiste?»*; questa chiede *«questo nome, che
esiste, serve a qualcuno?»*.

**Misura: 990 import su 21 file, 59 inerti.** Resta **misura e non regola**
finché quelle righe non sono tolte — è lavoro sulle **pagine**, e va fatto col
giro del browser fermo.

## Perché vale, visto che non rompe niente

Un import inutile è **inerte**: la pagina si apre e funziona. Il danno è di
lettura, e **mente sul legame fra due file** — chi apre la pagina di Terra
crede che usi `SOGLIA_TURNI`, e chi tocca `terra-data.js` crede di avere un
consumatore in più e sta attento a non cambiarne il significato. È la stessa
famiglia dell'**eccezione che non serve più** di `sonda-vuoto`: una riga che
descrive un rapporto che non c'è.

## ⚠️ Il righello sbaglia nel verso giusto, ed è una scelta

Legge nel modo più **prudente**: su **tutto** il testo dei blocchi, non sul
codice mascherato. Un nome può comparire dentro un `${…}`, dentro un attributo
`on*`, o dentro una stringa che poi diventa codice. Se questo righello sbaglia,
sbaglia dicendo **«è usato»** — che è il verso giusto in cui sbagliare per una
domanda che propone di **cancellare righe**.
La controprova prova **tutt'e due i versi**: un nome aggiunto all'import e mai
scritto altrove viene visto; `RIPOSO_MINIMO_ORE`, che si usa **solo** dentro
un template, non viene toccato.

## ⚠️ E il primo sospetto è stato verificato invece che creduto

Flotta importa `statoScadenzaMezzo` e non lo usa: sembrava la **copia debole**
di CLAUDE.md — la pagina che decide uno stato per conto suo invece di
chiamare la funzione del modulo. **Non lo è**: la pagina usa
`scadenzeOrdinate`, che quello stato lo calcola dentro. Le 59 righe sono
**pulizia**, non un difetto.
Lo scrivo perché il contrario avrebbe mandato il cantiere dopo a cercare per
un'ora una cosa che non c'è — ed è il costo di ogni «non c'è» dichiarato senza
la sua prova, al rovescio.

## Prove

- Giro `node` sulla copia di quello che si committava: **23 comandi, 0 caduti**.
- `nomi-liberi`: **22 → 24 prove**, 0 fallite. Il totale doveva salire.

## In volo

⏳ Il **giro del browser** sulla porta **8823**,
`scratchpad/io-core/giro-7.txt`, copia di `958018d`, pid 28054. A questo
checkpoint **782 righe**, dentro la fase del contrasto (Scudo).
⛔ **Finché cammina non si toccano pagine né moduli dati**: l'impronta di
`tutti.mjs` esclude `tests/`, `docs/` e `vault/` — non le pagine. È per questo
che la quinta domanda è entrata come **misura** e la pulizia delle 59 righe è
il passo dopo, non questo.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`),
nell'ordine che non si negozia:
1. le righe **«non ho guardato»** — già viste passando: il banco del contrasto
   dichiara che su Genesi **69 classi che dipingono un fondo non sono mai
   comparse** (22 misurate, 47 solo elencate), e cifre simili altrove. Regola
   del **denominatore**: un conteggio basso di violazioni va diviso per i
   soggetti che il banco ha **potuto vedere**;
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara da
   sé);
3. se esce con **2** si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** e portare la quinta domanda a regola.
  Sono su sei pagine e alcuni moduli; l'elenco lo stampa la suite stessa
  (`[misura] quinta forma`), quindi non va ricopiato a mano da nessuna parte —
  si rilancia e si legge. Un'unità per app, così ogni commit tocca un file
  solo e il giro non serializza niente.

## Blocchi
Nessuno.
