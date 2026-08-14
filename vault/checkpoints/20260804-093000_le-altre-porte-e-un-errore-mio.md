# Checkpoint — le altre porte d'ingresso, la regola 18, e un errore mio

**Commit:** `bdcd5ba` (regola 18), `78d1234` (le cinque porte)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## 1. Un errore di procedura, e va scritto per primo

Ho modificato **tre moduli dati** (`sentinella-data.js`, `scudo-data.js`,
`terra-data.js`) **mentre girava un giro del browser**. È esattamente la regola
che `CLAUDE.md` scrive e che avevo rispettato per tutta la giornata: finché gira
un giro si lavora su `docs/`, `vault/` e le suite `node`, perché una pagina
modificata a metà corsa fa misurare al banco una cosa che non esiste.

Il giro era al secondo blocco. L'ho **buttato e rilanciato** sul codice finale
(`giro25.log`): un risultato di cui non ci si può fidare è peggio di nessun
risultato, perché ha l'aspetto di una verifica.

*Come non ripeterlo: la domanda da farsi prima di ogni `Edit` non è «questo file
è un test?» ma «questo file lo carica una pagina?». `sentinella-data.js` è un
modulo, e i moduli li carica il browser.*

## 2. Le altre cinque porte d'ingresso

Il difetto della data illeggibile era stato trovato nell'import delle **scadenze
di Scudo**. Cercandolo altrove — che è il passo che di solito non si fa — lo
stesso filtro `/^\d{4}-\d{2}-\d{2}$/`, che controlla la **forma** e non
l'esistenza, stava in altre **sette** letture:

| dove | che cosa lasciava passare |
|---|---|
| Scudo · **infortuni** | una data impossibile **negli indici infortunistici** e nel riepilogo annuale |
| Terra · **rilievi** | un volume **nell'anno sbagliato** del riepilogo, che è un documento per l'ente |
| Sentinella · **adempimenti** | un adempimento che **non scade mai** |
| Sentinella · **volate** | una volata fuori dalla serie storica |
| Sentinella · **letture** (×3) | «2026-02-30» **non veniva scartato**: `Date.parse` lo fa scivolare al 2 marzo, e il punto finiva sul grafico nel **giorno sbagliato** |

Tutte e sette passano ora da `dataISOEsiste`, nato stamattina in `dw-shell.js`.
È la regola del `shared/` applicata per quello che è: una regola che serve a
più posti vive in **uno**.

Una prova nuova, marcata ⛔, prova tutte e quattro le porte con «2026-13-45» e
«2026-02-30», e porta con sé la guardia contro il troppo zelo: il **29 febbraio
di un bisestile** è una data vera e deve entrare.

## 3. Regola 18 — una mappa di stati copre tutti gli stati della sua funzione

Nata dal difetto di stamattina. Quando `statoScadenzaHSE` ha guadagnato la
quarta risposta, la mappa dei badge di Scudo ne aveva tre: `B[st][0]` avrebbe
ucciso la pagina **al disegno del primo riquadro**. Non un errore di sintassi —
quindi nessun controllo esistente lo vedeva.

**Due letture sbagliate al primo colpo**, ed è la solita famiglia:
- le risposte cercate come `return "…"` perdevano quelle dentro un **ternario**
  (`return g <= pre ? "in-scadenza" : "a-posto"`), cioè metà di quelle di Terra;
- le chiavi della mappa pretendevano una virgola davanti, e così la **prima**
  non veniva mai vista: il controllo diceva che mancava «scaduta», che c'era.

Le ha viste subito la guardia sul **«quante coppie ho davvero letto»**, che sta
lì apposta. Controprova: tolta «senza data» dalle due mappe, su copie — due su
due cadono col motivo giusto.

## Numeri

- `run-kpi` **1005** · `run-stile` **262 → 264** · totale `node` **1.359**
- copertura **9 soggetti a posto**, sonda del vuoto **verde** (8 dichiarati,
  0 rossi)
- `CLAUDE.md`: regole di stile **diciassette → diciotto**

## In corso

Il **giro a 25 banchi** è ripartito da zero (`giro25.log`) sul codice finale.
Finché gira: `docs/`, `vault/` e **solo** i file di test — non i moduli.

## Prossimo passo atomico

1. **leggere l'esito del giro**;
2. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
3. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2;
4. **Conti — nota di credito**, dalla prova su `tempoMedioPagamento`.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
