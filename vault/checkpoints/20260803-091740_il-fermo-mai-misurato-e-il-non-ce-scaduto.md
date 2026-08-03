# Checkpoint — 2026-08-03 09:17:40 UTC

## Tipo
unit-complete (due unità: il rapporto stampato di Campo, la riverifica del delta)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`adce399` — *Il delta di Campo riverificato: una riga cambia verdetto, e nella
direzione che costa*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 36 | **il rapporto stampato di Campo** (`6048442`) | un fermo mai misurato e uno da 55 minuti erano **la stessa riga** |
| 37 | **la riverifica del delta di Campo** (`adce399`) | arretrato di Campo da **12 commit a 0**; totale da 40 a **27** |

⛔ **La copia debole, nel posto che CLAUDE.md indica.** La tabella «Fermi per
causale» del *Rapporto di fine turno* si componeva con `riepilogoFermi` (solo
`conto`); lo schermo e la consegna usano `paretoFermi`, che i minuti li ha —
la consegna era stata corretta stamattina, il foglio stampato no.
Misurato **premendo il bottone**, non leggendo:
`Guasto meccanico | 1` → `Guasto meccanico | 1 | senza minuti`, più la riga
«1 fermo/i su 2 senza i minuti registrati: il tempo perso qui sopra è un minimo».
Attenuante scritta nel commit per non gonfiare: più sotto, la tabella
«Disponibilità del turno» il tempo perso lo riportava già.

## ⛔ E la prima misura era FALSA, con la trappola già scritta in CLAUDE.md
Le due copie — `HEAD` e quella da committare — davano un'uscita **identica**,
7549 caratteri tutt'e due. Non erano uguali: il secondo server aveva trovato la
porta occupata dal primo e stavo misurando **due volte lo stesso albero**. È «la
forma silenziosa» del paragrafo sui banchi che alzano un server, e costa poco
solo se ci si accorge — qui si sarebbe concluso «la correzione non cambia
niente». Col **contrassegno col proprio pid riletto dal server**: 7513 contro
8114. La difesa era scritta e non l'avevo montata: adesso è dentro la sonda.

## La riga che ha cambiato verdetto
**Contractor induction compliance**, da CONFERMATO ASSENTE a ⏱️ SCADUTA IN
PARTE. La prova era buona, il problema era **quando**: riga scritta `f3432f4`
01/08 16:55, anagrafe appaltatori di Scudo entrata `425bf40` 01/08 **19:28**.
È lo stesso caso che CLAUDE.md cita come esempio del «non c'è» scaduto — e
finora era rimasto lì come racconto senza che la riga che lo produceva fosse
corretta. Conteggi: 11 + 2 + 3 + 6 = 22 ✔; tabella condivisa aggiornata in tutti
e sei i documenti (confermate 48 → **47**).
**Nuova mancanza più importante di Campo, riverificata e non ereditata:** il
**near-miss segnalabile dal fronte** (zero in Campo, giro completo in Scudo con
il riepilogo L. 198/2025). Non manca all'ecosistema: **non sta dove sta la
persona**.

## Stato delle prove
Sulla **copia di ciò che si committa**: giro `node` **20 su 20** tutt'e due le
volte. Sul disco no, e la ragione è dichiarata: i tre cantieri hanno già scritto
(copertura 646, 69 banchi contro i 642/67 scritti nei documenti), quindi
`numeri-nei-documenti` sul disco dà 7 falliti che **non sono nel committato**.
Si sistemano raccogliendo i cantieri, app per app.

## Che cosa sta girando adesso
- **il giro completo del browser** (`scratchpad/capo/giro4.txt`, pid 26681,
  vivo): è il primo col core accessibile **e** popolato. Le righe rosse lette
  finora sono **controprove** («il banco SA fallire»), non guasti. Restano i
  **4 KO di contrasto sul core**: `.sync-badge.nonsalva` 4,22:1,
  `.notif-badge` 3,49:1, `.av-cv` 2,36:1, `.av-fc` 3,45:1;
- **tre cantieri**: Conti (i documenti stampati), Sentinella (il report per
  l'ente), Flotta (il libretto e il giro macchina). Tutt'e tre hanno già
  scritto: `run-kpi.mjs`, `tutti.mjs` e `copertura-funzioni.mjs` sono toccati da
  più di uno → si raccolgono **costruendo l'indice da `HEAD`** e tagliando la
  banda dell'app, mai con `git add` diretto.

## Prossimo passo atomico
1. **Le 4 violazioni AA del core**, tutte insieme e con lo scatto prima/dopo.
   Le regole stanno in `index.html`: `.av-fc` 7448, `.av-cv` 7450,
   `.notif-badge` 7338, `.sync-badge.nonsalva` 7348 (e `.toast.info` 7660, da
   verificare: il 1,45:1 potrebbe essere l'artefatto del fondo a gradiente).
   Sono la palette del core, quindi **si scurisce il minimo indispensabile
   tenendo la tinta**, e si rimisura con `contrasto --solo=core`.
2. Leggere la coda di `giro4.txt` (cerca `USCITA=`) quando finisce.
3. Raccogliere i tre cantieri, app per app.
4. Poi: il **near-miss dal fronte** in Campo, che è la mancanza appena
   riverificata come la più importante.

## Code aperte, dichiarate
Immutate. Le **19 decisioni** del fondatore procedono **venerdì 07/08** se non
arriva risposta, e vanno dichiarate nel commit.

## Blocchi
Nessuno.
