# Checkpoint — quattro difetti chiusi, e uno era live nella sicurezza

**Commit:** `706cbb1` (la data illeggibile), `59c8601` (il «Conforme» mai
misurato), `c985af2` (le due guardie)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`

## Una decisione da spiegare: il giro del browser è stato fermato

Girava da un'ora e mezza ed era al **decimo banco su venticinque**, tutti verdi.
L'ho **interrotto** perché le quattro correzioni toccano cinque moduli e tre
pagine: quel giro sarebbe stato **invalidato comunque**, e portarlo a termine per
poi rifarlo era tempo speso due volte. Rilanciato **dopo** le correzioni, così
copre anche loro. Il risultato parziale è agli atti: dieci banchi, ogni prova
verde e ogni controprova caduta come deve.

## 1. Una data che non si può leggere non è una scadenza a posto — **live**

`statoScadenzaHSE` (in `shared/`, cioè dove un difetto si moltiplica per sei)
rispondeva **«regolare»** su una data illeggibile. In Scudo è `statoScadenza`,
chiamato una **trentina** di volte. E non era dormiente: `parseScadenzeCsv`
filtrava con `/^\d{4}-\d{2}-\d{2}$/`, che guarda la **forma** — «2026-13-45»
passava, entrava in archivio e restava **verde per sempre**. Una visita medica
con un errore di battitura fuori dalle urgenti, fuori dal muro, senza promemoria.

**Sei correzioni per un difetto solo**, ed è la parte istruttiva:

| dove | che cosa nascondeva |
|---|---|
| `statoScadenzaHSE` | «regolare» invece di «senza data» |
| `idoneitaOperatore` | lo stesso difetto **un piano più su**: l'operatore risultava «regolare» |
| il `peso` dell'ordinamento | un valore nuovo avrebbe dato `NaN` — ordinamento rotto **in silenzio** |
| `livelloScadenza` (Scudo) | diceva già «senza data», ma **in verde** |
| la mappa `B` dei badge | senza la quarta voce `B[st]` è `undefined` e **la pagina muore al disegno** |
| tutta la famiglia in **Terra** | stesso difetto, altri nomi (`a-posto`) |

E `dataISOEsiste` in `dw-shell.js`, perché **`Date.parse` da solo non basta**:
«2026-02-30» non è `NaN`, JavaScript lo fa scivolare al 2 marzo — una scadenza
spostata di due giorni **in silenzio** è peggio di una scartata a voce alta.

⚠️ **Due prove blindavano il difetto**, e i loro nomi lo dicevano: «senza data
non allarma», «una scadenza SENZA data non allarma (= regolare)». Non erano
sviste: erano la convinzione del momento **messa per iscritto**. Una terza (il
riepilogo di Terra) **quadrava lo stesso**, perché la riga illeggibile finiva fra
le «a posto»: il conto tornava e diceva una cosa falsa.

## 2. Il «Conforme» che nessuno ha misurato

Sei punti appena configurati e il cartellone diceva «**6 punti entro soglia**».
Corretto riusando quello che Sentinella **dice già** (`stato: "mai"`, «Mai
misurato», `warn`) e il rilevatore giusto (`ultimaLettura`, che valida data e
valore).

**Il confine è stato spostato due volte prima di essere giusto.** La prima
stesura faceva scattare «mai misurato» su qualunque punto senza letture: **dodici
prove cadute**, e fra quelle una marcata ⛔ col suo perché già scritto — «un
punto senza storico è comunque un superamento […] farlo sparire toglierebbe
dall'elenco un superamento **vero**». Quella decisione era già stata presa, e
vale.

> **La lezione, e vale più del difetto:** prima di aggiungere uno stato, cercare
> se il caso è **già stato deciso**. Qui la decisione era scritta, con la sua
> ragione, dentro il **nome di una prova** — e l'ho trovata solo perché la prova
> è caduta.

## 3 e 4. Due guardie che poggiavano sulla memoria dei chiamanti

- **`urgenzaOre`** aveva la guardia su **metà funzione**: su `oreAttuali` sì
  (scritta bene, col suo commento), su `orePreviste` no. Con `null` rispondeva
  «**SCADUTA (+500 h)» in rosso** — un allarme **inventato**, ed è la ragione
  per cui la sonda dei valori *tranquilli* non l'aveva visto: sbagliava
  dall'altra parte.
- **`incassoPerMese`** è l'unica funzione del suo file in cui il secondo posto è
  un **conteggio** (le sorelle hanno `oggi`). Con una data lì dentro il ciclo
  girava **1.785.456.000.000** volte e la scheda **moriva di memoria**.

Tutt'e due **dormienti** — misurato — ma protette solo da chi si ricorda.

## Numeri

- `run-kpi` **999 → 1004** · `run-helpers` **43 → 48** · totale `node`
  **1.346 → 1.356**, aggiornato nei tre documenti che lo dichiarano
- copertura: **9 soggetti a posto**, e il censimento ha preteso la prova per
  `dataISOEsiste` **appena nata** — la regola corretta stamattina ha funzionato
  sulla funzione successiva
- `sonda-vuoto.mjs` è **verde**: 8 tranquilli, 8 dichiarati, 0 rossi. E per tre
  volte ha preteso di **togliere** un'eccezione diventata inutile: è il secondo
  verso del controllo, quello che impedisce all'elenco di invecchiare

## In corso

Il **giro a 25 banchi** è ripartito (`giro24.log`) e adesso copre anche
Sentinella, Scudo e Terra. Finché gira: `docs/`, `vault/` e le suite `node`.

## Prossimo passo atomico

1. **leggere l'esito del giro** e, se verde, riprendere con
   **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
2. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2
   (`docs/RICERCA_TRACCIABILITA_VOLUME_202608.md`);
3. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`
   (`docs/RICERCA_NOTE_DI_CREDITO_202608.md`).

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
