# Checkpoint — la struttura del core chiusa, e la copertura piena

**Commit:** `4845eb1` (`perCampo`), `58f6fd1` (`go(id)`)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il giro del browser è finito verde

**19 banchi a posto, 0 da guardare.** Era partito dopo che tutte e sei le
pagine erano cambiate (la struttura del core in un posto solo), e per tutta la
sua durata si è lavorato solo su `docs/`, `vault/` e le suite `node`, come
vuole la regola. Un allarme letto e chiarito per strada: sette KO su «si torna
all'ecosistema» sembravano una regressione — erano la **controprova** di quel
banco, che toglie apposta il comando di ritorno. Misurato anche a mano nel
browser: il comando è 47×44, cioè a norma.

## 1. `perCampo` in un posto solo — copertura 411 su 411

Era identica **carattere per carattere** in `dw-shell.js` e in
`flotta-data.js`, 219 caratteri. Lo script della correzione confronta i due
corpi **prima** di toccare il file e si ferma se non sono identici: un alias
messo su due implementazioni diverse cambierebbe il comportamento in silenzio,
che è precisamente il difetto che si sta chiudendo.

La prova d'identità non si ferma a `flotta.perCampo === shell.perCampo`:
blinda anche **che cosa regge quella riga**, cioè che dentro un campo il punto
delle migliaia non ci va (6375 resta «6375», in Node come in Chromium). Se ci
finisse, rientrerebbe dal lettore come ambiguo e l'app rifiuterebbe **un valore
che ha proposto lei**.

Verificato nel browser, non solo in `node`: Flotta si apre senza errori, il
modulo parte, e `perCampo` chiamata dalla pagina viva dà «1250,5», «6375»,
«12,3» e «» sul dato che manca.

Con questa, il censimento arriva a **411 funzioni su 411** — copertura piena su
tutte e sei le app — e `nomi-doppi` torna verde: 14 alias, 5 divergenze
dichiarate, **0 da sistemare**.

## 2. `go(id)` in un posto solo — e sparisce l'ultimo blocco classico

Sei copie, due versioni. Nella condivisa è entrato il **soprainsieme**, e la
distinzione è quella che conta:

- la **mappa** è una *funzione* di Flotta — ha otto pagine e sei voci di
  pillola, la scheda del mezzo e l'ordine di lavoro si aprono da dentro e
  tengono acceso il segnalibro del **padre**. Passa dall'aggancio, come il
  selettore dell'alone;
- le **guardie** sono una *protezione*, e vanno a tutti.

Onestà sulla gravità, **misurata prima di irrigidire**: nessuna app chiama oggi
`go()` verso una pagina che non esiste. Le guardie servono contro l'id di
**domani** — senza, la riga solleva un errore e la navigazione si ferma lì:
schermo fermo, nessun messaggio.

**4.064 caratteri** tolti dalle sei pagine, e con loro **sparisce l'ultimo
blocco `<script>` classico di ogni app**: dentro non era rimasto altro che
`go`. Le sei app adesso hanno solo i tre script condivisi e il proprio modulo.

### Come è stato verificato

**Provando la navigazione, non guardando se la pagina si apre** — la lezione
pagata il 02/08 con cinque pagine rotte che rispondevano «tutto a posto». Per
ognuna delle sei app si preme ogni voce della pillola e si pretende **una sola**
pagina attiva e **un solo** segnalibro acceso; in Flotta che `sch` e `odl`
accendano il padre; in tutte che `go()` con un id inventato **non fermi** la
navigazione. **62 asserzioni, 44 navigazioni, zero rosse.** Screenshot guardati
per tutte e sei.

La controprova serve alla pagina la versione **senza guardie** — quella delle
cinque app di prima — e ne fa cadere **sei**, una per app. Il banco è entrato
nella suite (`tests/browser/navigazione.mjs`): **19 → 21** esecuzioni. Una
difesa che resta nello scratchpad, alla sessione dopo non esiste.

E `go` è entrato nella **regola 17**, così una copia locale non può più tornare.

## Il censimento delle sei app (agenti in parallelo, sola lettura)

Mentre il giro girava, sei agenti hanno confrontato ogni scheda di ricerca col
codice vero. Bilancio onesto, per app:

| app | fatte | parziali | da fare | le prime tre aperte |
|---|---|---|---|---|
| **Campo** | 14 | 2 | 7 | disponibilità di turno (S) · offline vero (M) · evento sicurezza → Scudo (M) |
| **Conti** | 11 | 3 | 8 | **sconto cliente mai applicato** (S/M) · note di credito (M) · registro costi (M) |
| **Flotta** | 8 | 3 | 3 | consumo contro la propria media (S/M) · €/ora per mezzo (S/M) · segnalazione guasto (S) |
| **Scudo** | 7 | 6 | 5 | foto nel near-miss (S) · foto per voce di checklist (M) · 5 Perché (S) |
| **Sentinella** | 7 | 5 | 3 | volate nel report di conformità (S) · scadenze ricorrenti (S) · regole di allarme (M) |
| **Terra** | 8 | 4 | 5 | provenienza del volume tracciata (S) · riconciliazione in Terra (M) · oneri su m³ (S) |

**Due cose vanno dette al fondatore, non nascoste in una tabella:**

1. **Conti — lo sconto cliente è salvato e non viene mai applicato.** La scheda
   cliente dichiara «sconto 5%», e ogni DDT e ogni fattura differita escono al
   **prezzo pieno** di listino: `rigaPesata` non riceve il cliente. È un difetto
   sui soldi, non una funzione mancante, ed è la prima cosa da chiudere.
2. **Scudo — le due proposte ad alta priorità rimaste sono bloccate dalla
   stessa cosa**: la foto. E la foto, con più immagini in un solo documento
   Firestore, sfonda il limite: chiuderle bene vuol dire prima decidere su
   **Firebase Storage**, che è una decisione del fondatore (piano a pagamento).

## Numeri

- KPI **976**, stile **252**, totale `node` **1.310**
- copertura funzioni pure: **411 su 411**
- banchi del browser: **19 → 21**
- documenti col numero vecchio corretti **dal controllo che li legge**

## Prossimo passo atomico

1. **Conti: lo sconto cliente entra nel prezzo.** È il difetto più grave dei
   sei censimenti, e tocca i soldi. `rigaPesata` deve ricevere il cliente, lo
   sconto applicato va **fotografato sulla pesata** come già si fa con densità
   e prezzo, e deve comparire nell'anteprima della differita e nel CSV;
2. **l'amministrazione di Deepwork ID** passa a `dw-app-ui.js` (caso facile);
3. **Genesi**, il caso difficile della struttura: id diversi e `chiediValore`
   col terzo parametro incompatibile.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13, 14, 15) — a cui si aggiunge la domanda su
**Firebase Storage** per le foto di Scudo.
