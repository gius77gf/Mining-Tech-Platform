# Checkpoint — 2026-08-08T05:21:53Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`237c02b` — *Campo, Conti e Scudo riverificati: l'arretrato dei sei documenti
va a ZERO*

## Che cosa è stato completato

Chiusi gli ultimi tre documenti. `documenti-invecchiati.mjs` dichiarava **71
commit** di arretrato su sei documenti, e la sua intestazione diceva che stava
lì **«per essere visto scendere»**. Adesso dice **0 commit, di cui 0 che
mordono**, per tutti e sei. È la prima volta da quando il conto esiste.

| | arretrato | mordono | a zero |
|---|---|---|---|
| prima di stanotte | **71** | 16 | 0 su 6 |
| Sentinella | 59 | 15 | 1 |
| Terra | 46 | 10 | 2 |
| Flotta | 38 | 10 | 3 |
| Campo | 29 | 7 | 4 |
| Conti | 15 | 3 | 5 |
| Scudo | **0** | **0** | **6 su 6** |

## I tre di questa unità

- **Campo** (9 commit, 3 mordono): hanno costruito `csvAppello`,
  `csvAttivita`, `minutiFermoDi`, `senzaGiornoDiLavoro`. Le undici righe
  assenti parlano tutte di **hardware e integrazioni** — GPS, geofencing, IoT,
  tablet in cabina, dispatch, RFID, telemetria multi-marca, offline,
  multi-cava, meteo DTN, manutenzione predittiva: **zero sul diff e zero sui
  file interi**, che è la forma più forte in cui un «non c'è» può reggere.
- **Conti** (14 commit, 4 mordono): solo import/export CSV. Le otto righe
  reggono. ⚠️ **Ma due si sono mosse INTORNO senza spostarsi, e sta scritto**:
  la pesa (*«le pesate si digitano»* adesso è **stretto** — una pesata può
  entrare anche da un file, pur restando lontanissima da un driver seriale) e
  l'SDI (il codice destinatario adesso viaggia anche nel CSV clienti, ma
  `FatturaPA` e `p7m` restano a zero).
- **Scudo** (15 commit, 3 mordono — l'app che si è mossa di più, **+1.217
  righe**): verifica periodica delle attrezzature ed export delle azioni.
  Nessun verdetto si muove.

## ⛔ E una prova è invecchiata per la SECONDA volta sulla stessa riga

«gli export CSV sono **quattro**» era già una correzione di «tre» fatta il
06/08. Oggi sono **cinque**. Il verdetto non cambia — una copia di sicurezza
nasce per essere **ri-caricata**, non consegnata a un ispettore — ma il fatto
che quel conto scada a **ogni export nuovo** dice una cosa sul **documento**,
non sul prodotto:

> **È il numero sbagliato da scrivere.** La riga vive del `grep` su
> `xlsx|excel|jspdf`, che dà zero anche oggi; il conto dei CSV invecchia da
> solo e, invecchiando, rende **non credibile un verdetto giusto**.

È la terza forma di invecchiamento raccolta in `CLAUDE.md`, colta **due volte
sulla stessa riga** — che è il segno che la riga andava scritta diversamente,
non ridatata meglio.

## Prove

- `documenti-invecchiati`: **6 documenti, arretrato totale 0, di cui 0 che
  mordono**.
- Giro `node` sulla copia di quello che si committava: **23 comandi, 0
  caduti**.

## In volo

⏳ Il **giro del browser**, porta **8823**, `scratchpad/io-core/giro-7.txt`,
copia di `958018d`, pid 28054. **2.223 righe**.

## Prossimo passo atomico

⛔ **Raccogliere `giro-7.txt` quando finisce** (in coda scrive `USCITA <n>`):
1. prima le righe **«non ho guardato»** — su Genesi il banco del contrasto
   dichiara **69 classi mai comparse** (22 misurate, 47 solo elencate);
2. **poi** i KO, togliendo le **controprove** (l'intestazione le dichiara);
3. uscita **2** = si è dichiarato **non valido** e va rifatto.

Poi, a giro fermo:
- ⏱️ **Togliere le 59 righe inerti** (import mai usati) e portare la quinta
  domanda di `nomi-liberi` a regola. L'elenco lo stampa la suite
  (`[misura] quinta forma`): si rilancia e si legge, non si ricopia. Un'unità
  per app, un file per commit.

⚠️ E l'arretrato a zero **non resta a zero da solo**: ogni commit che aggiunge
una `export function` o un `<button>` a un'app lo fa risalire. La direttiva 7
(«chi chiude un'unità aggiorna la riga del documento che gliel'aveva
proposta») è quello che lo tiene giù; il conto serve a vedere quando non è
stata seguita.

## Blocchi
Nessuno.
