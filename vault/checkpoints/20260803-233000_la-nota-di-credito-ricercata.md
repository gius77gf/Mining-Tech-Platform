# Checkpoint — la nota di credito, ricercata e misurata prima di scriverla

**Commit:** *(questo)*
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/RICERCA_NOTE_DI_CREDITO_202608.md`

## Perché questa e perché adesso

È la prima voce del censimento di Conti, e la ragione è forte: **l'app scrive
da sola che sta facendo la cosa sbagliata**. Nella finestra che elimina una
fattura c'è, testuale, «una fattura realmente emessa non va cancellata, va
gestita con una nota di credito» — e poi la finestra offre **un solo bottone**,
che è quello che la regola la viola.

Il giro del browser è ancora vivo, quindi moduli e pagine non si toccano: la
scheda è l'unità giusta da fare adesso, ed è quella che rende l'unità di codice
successiva **meccanica**.

## La scorciatoia ovvia, misurata (e cade)

«Una nota di credito è una fattura col meno davanti.» Sei numeri, presi facendo
girare le funzioni vere su una fattura da 1.220 € e una nota da −610 €:

| | risposta | |
|---|---|---|
| `kpiFrom(...).daIncassare` | 1.220 → **610** | ✅ il numero grosso sembra giusto |
| `esposizioneClienti` | **1.220** | ❌ la nota è **saltata** (`imp <= 0`) |
| `agingIncassi` | `g1_30 {conto:1, importo:−610}` | ❌ contata **fra le scadute da sollecitare** |
| `prossimoNumero(["NC/2026/001",…])` | **`2026/001`** | ❌ un numero **della serie fatture**, già usato |

Il difetto non è che «non funziona»: è che dà il numero **giusto dove si
guarda** e **sbagliato dove non si guarda**. Due totali della stessa app che si
contraddicono, e quello tranquillo è in prima pagina.

**Una previsione mia sbagliata, scritta nella scheda.** Davo per buono che
`apertoDi` schiacciasse i negativi a zero — c'è un `Math.max(0, …)` proprio lì.
Sta nell'**altro ramo**: una nota senza incassi prende
`round2(+f.importo || 0)`, e il meno se lo tiene. La regola «misurare prima di
irrigidire» ha pagato di nuovo.

## La trappola che vale la scheda

Una nota di credito **totale** su una fattura mai pagata porta il residuo a
zero. Ma **nessuno ha pagato**. Se da lì scattasse `saldata`,
`tempoMedioPagamento`, `tempiPagamentoClienti` ed `emessoIncassato`
conterebbero come «pagata in N giorni» una fattura **annullata**: il cliente
peggiore diventerebbe il più puntuale.

È il principio già applicato in tre app — **l'assenza di un dato non è un dato
favorevole** — con un travestimento nuovo: qui il dato assente è il pagamento, e
si nasconde dentro un residuo a zero.

## Le quattro decisioni

1. **Non è una fattura negativa**: documento con tipo proprio, importi
   **positivi**, effetto dichiarato sulla fattura collegata. (E combacia col
   formato: nel tracciato della fattura elettronica gli importi negativi **non
   sono ammessi** — il verso lo dà solo `TD04`.)
2. **Serie dedicata** `NC/AAAA/NNN`, con `prossimoNumero` esteso a un prefisso
   facoltativo — perché oggi quella serie **non la sa leggere**.
3. **La causale si chiede**, e da lì l'avviso sui 12 mesi: comma 2 senza
   termine (nullità, risoluzione, sconti contrattuali), comma 3 entro l'anno
   (accordo sopravvenuto, errore). L'app **avvisa e non blocca** — la materia ha
   eccezioni che un software non può giudicare, e sbagliare per eccesso di
   blocco è comunque sbagliare.
4. **Stornata ≠ saldata**: lo stato diventa a tre vie (aperta / saldata /
   stornata). La terza esce da esposizione, aging e KPI del credito, ma **non
   entra mai** nelle statistiche dei tempi di pagamento.

## Sette funzioni pure da scrivere

`CAUSALI_NOTA` · `prossimoNumero(..., prefisso)` · `validaNota` ·
`notaDaFattura` · `stornatoDi` · `statoFattura` · e l'adeguamento di
`apertoDi` / `esposizioneClienti` / `agingIncassi` / `kpiFrom`.

**Il primo test da scrivere non è l'aritmetica**: è che una fattura stornata al
100% **non** compaia in `tempoMedioPagamento`. È il difetto che la scheda esiste
per impedire, ed è quello che passerebbe inosservato più a lungo.

## In corso

Il **giro a 25 banchi** del browser è ancora vivo. Finché gira: `docs/`,
`vault/` e le suite `node`; nessuna modifica a moduli e pagine.

## Prossimo passo atomico

Quando il giro finisce, in ordine:

1. **Genesi unità A** (il piano è già misurato e scritto:
   `docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`, e sei prove dicono se è
   stato fatto);
2. **Conti — nota di credito**, dalle sette funzioni di questa scheda,
   cominciando dalla prova su `tempoMedioPagamento`;
3. **Conti — registro costi**, la porta d'ingresso obbligata per marginalità e
   pareggio.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
