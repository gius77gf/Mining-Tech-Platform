# La nota di credito in Conti — ricerca prima di scriverla

*03/08. È la voce in cima al censimento di Conti, e la ragione è che **l'app
stessa dice che sta facendo la cosa sbagliata**: nella finestra che elimina una
fattura c'è scritto, testuale, «una fattura realmente emessa non va cancellata,
va gestita con una nota di credito» (`apps/conti/index.html:3018`). Il documento
di cui parla non esiste. Questa scheda decide come farlo, e parte da due
verifiche: che cosa chiede la norma, e che cosa succede oggi al codice se si
prova la scorciatoia ovvia.*

---

## 1. La scorciatoia ovvia, misurata (e non funziona)

La tentazione è: *«una nota di credito è una fattura col meno davanti»*. Prima
di irrigidire, la misura — sei numeri, presi facendo girare le funzioni vere di
`conti-data.js` su una fattura da **1.220 €** e su una nota da **−610 €** che ne
storna la metà.

| funzione | risposta | che cosa vuol dire |
|---|---|---|
| `apertoDi(nota)` | **−610** | **non** viene azzerata: il `Math.max(0, …)` protegge solo il ramo del residuo, e una nota senza incassi cade nell'altro |
| `kpiFrom(...).daIncassare` | 1.220 → **610** | ✅ il numero grosso in cima **sembra** giusto |
| `esposizioneClienti` | **1.220**, non 610 | ❌ la nota viene **saltata** (`if (imp <= 0) continue`): il fido del cliente non si libera |
| `agingIncassi` | `g1_30: {conto: 1, importo: −610}` | ❌ la nota è contata **come una fattura scaduta da sollecitare** |
| `statoIncasso(nota)` | `totale −610, residuo −610` | ❌ un documento perennemente «da incassare» per un importo negativo |
| `prossimoNumero(["NC/2026/001","NC/2026/002"], 2026)` | **`2026/001`** | ❌ una serie dedicata non viene nemmeno riconosciuta: riparte da capo **dentro la serie delle fatture** |

**Una previsione sbagliata, e vale la pena scriverla.** Prima di misurare avevo
dato per buono che `apertoDi` schiacciasse i negativi a zero — c'è un
`Math.max(0, …)` proprio lì. Non è così: quel massimo sta nel ramo che legge
`residuo`, e una nota senza incassi registrati prende l'altro ramo,
`round2(+f.importo || 0)`, che il meno se lo tiene. Mezz'ora di misura invece di
una correzione che rompe in silenzio — è la regola già scritta in `CLAUDE.md`, e
qui ha pagato di nuovo.

Il punto vero però è il **terzo e il quarto rigo**: la scorciatoia dà il numero
giusto **dove si guarda** (il KPI in cima) e sbagliato **dove non si guarda**
(esposizione, fido, aging, solleciti). È la forma peggiore di difetto per questa
app: due numeri che si contraddicono, e quello tranquillo in prima pagina.

> **Decisione 1 — una nota di credito NON è una fattura negativa.** È un
> documento con un tipo suo, importi **positivi**, e un effetto **dichiarato**
> sulla fattura collegata. Non entra nelle liste delle fatture aperte per
> sottrazione: entra come storno di una fattura precisa.

E non è solo un'esigenza nostra: nel tracciato della **fattura elettronica** gli
importi negativi **non sono ammessi** — imponibile e imposta si scrivono
positivi, e il verso «in diminuzione» lo dà **soltanto** il tipo documento
`TD04`. La forma che ci serve per non rompere i totali è la stessa che il
formato pretende.

---

## 2. Che cosa chiede la norma (art. 26 DPR 633/1972)

### Il documento

- **`TD04`** è l'unico tipo che valga come nota di credito nella fattura
  elettronica.
- Deve riportare **numero e data della fattura originaria** (nel tracciato:
  `DatiFattureCollegate` → `IdDocumento` + `Data`). Senza quel collegamento la
  nota è formalmente valida ma fiscalmente **orfana**, e apre contestazioni.
- Deve indicare la **causale** della rettifica.
- Può essere **totale** (annulla l'operazione) o **parziale** (la fattura resta
  valida per la parte residua).
- La emette **lo stesso soggetto** che ha emesso la fattura.

### La numerazione

Una serie **dedicata non è obbligatoria**: si può proseguire la numerazione
delle fatture oppure tenerne una propria (`NC/2026/001`). Quello che conta è che
dentro la serie scelta la numerazione sia **unica, progressiva e senza salti**.

> **Decisione 2 — serie dedicata, e `prossimoNumero` va esteso.** La serie
> propria è più leggibile per il cliente di cava («NC/2026/004» si capisce
> senza aprire il documento) e tiene la numerazione delle fatture pulita. Ma la
> misura qui sopra dice che `prossimoNumero` **non sa leggerla**: su
> `["NC/2026/001","NC/2026/002"]` risponde `2026/001`, cioè un numero **della
> serie delle fatture**, e già usato. Va esteso con un prefisso facoltativo, e
> la prova che lo blinda è quella che oggi fallirebbe.

### Il termine

Qui la norma si divide in due, e la differenza cambia che cosa l'app deve
chiedere all'utente:

| | causale | termine |
|---|---|---|
| **comma 2** | nullità, annullamento, revoca, risoluzione, rescissione e simili; abbuoni e sconti **previsti dal contratto** | **nessun limite di tempo** |
| **comma 3** | sopravvenuto accordo fra le parti; **errore** di chi ha fatturato | **un anno** dall'effettuazione dell'operazione |

*(Sul comma 3 la dottrina è più larga di così: quando l'accordo interviene per
chiudere una controversia anche solo potenziale, l'orientamento — documento AIDC
2023 — è che il termine annuale non si applichi. Motivo in più perché l'app
**avvisi** invece di **bloccare**.)*

> **Decisione 3 — la causale si chiede, e da lì si ricava l'avviso.** Sei voci,
> con scritto accanto sotto quale comma cadono. Se la causale è di comma 3 e
> sono passati più di 12 mesi dall'emissione della fattura, la finestra lo
> **dice** — «oltre i dodici mesi: l'IVA potrebbe non essere recuperabile,
> verifica col commercialista» — e lascia procedere. L'app **non dichiara
> nulla di legale**: la nota «da confermare col commercialista» c'è già
> nell'estratto conto ed è il registro giusto.

---

## 3. Come si innesta su quello che Conti ha già

### Che cosa esiste

| pezzo | dove | serve a |
|---|---|---|
| `prossimoNumero(numeri, anno, cifre)` | `conti-data.js:823` | la numerazione — **da estendere** |
| `importiFattura(fattura)` | `:784` | imponibile / IVA / totale |
| `statoIncasso(fattura, incassi)` | `:876` | quanto è stato incassato davvero |
| `apertoDi(fattura)` | `:928` | quanto resta aperto |
| `esposizioneClienti` | `:578` | il rischio per cliente, col fido |
| `agingIncassi`, `kpiFrom` | `:277`, `:255` | scaduto e credito |
| `movimentiDiFattura` | `:854` | gli incassi collegati |

### La trappola vera, ed è quella che vale la scheda

Una nota di credito **totale** su una fattura mai pagata porta il residuo a
zero. Ma quella fattura **non è stata incassata**: nessuno ha pagato niente.

Se il residuo a zero facesse scattare `saldata`, tutto quello che misura i
**tempi di pagamento** — `tempoMedioPagamento`, `tempiPagamentoClienti`,
`emessoIncassato`, `giorniPagamento` — comincerebbe a contare come «pagata in
N giorni» una fattura che è stata **annullata**. Il cliente peggiore
diventerebbe il più puntuale.

È esattamente il principio che il prodotto applica già in tre app: **l'assenza
di un dato non è un dato favorevole**. Qui il dato assente è il pagamento, e il
travestimento è il residuo a zero.

> **Decisione 4 — stornata ≠ saldata.** Lo stato di una fattura diventa a tre
> vie: **aperta**, **saldata** (soldi arrivati), **stornata** (annullata da una
> nota di credito). La terza esce da esposizione, aging e KPI del credito — non
> è più esigibile — ma **non entra mai** nelle statistiche dei tempi di
> pagamento. E una fattura **parzialmente** stornata resta aperta per il
> residuo, che è la stessa aritmetica dell'acconto: `totale − incassato −
> stornato`.

### Che cosa cambia nell'eliminazione

Il bottone «elimina fattura» **resta** — serve davvero, per l'inserimento
sbagliato di dieci secondi fa — ma smette di essere l'unica strada. Nella
finestra, accanto a «Elimina», compare **«Emetti nota di credito»**, che è
l'azione giusta per una fattura **realmente emessa**. Oggi quella finestra
spiega la regola e poi offre un solo bottone, che è quello che la viola.

---

## 4. Le funzioni pure che ne escono (unità di lavoro)

Tutte testabili in `run-kpi.mjs` senza rete e senza browser:

1. `CAUSALI_NOTA` — le sei voci con comma e termine, e la ragione scritta;
2. `prossimoNumero(numeri, anno, cifre, prefisso)` — il quarto parametro
   facoltativo, con la prova sulla serie `NC/`;
3. `validaNota(nota, fattura, oggi)` — dice **perché** non si può emettere
   (nessuna fattura collegata, importo oltre il residuo stornabile, causale
   mancante) e **avvisa** sui dodici mesi senza bloccare;
4. `notaDaFattura(fattura, righe, causale)` — la nota totale o parziale a
   partire dalla fattura, importi **positivi**;
5. `stornatoDi(fatturaId, note)` — quanto è già stato stornato (perché le note
   parziali possono essere più d'una, e la somma non può superare il totale);
6. `statoFattura(fattura, incassi, note)` — le tre vie: aperta / saldata /
   stornata, con il residuo giusto;
7. e l'aggiornamento di `apertoDi`, `esposizioneClienti`, `agingIncassi`,
   `kpiFrom` perché leggano lo storno **senza** che una nota compaia mai come
   riga a sé nelle fatture aperte.

**Il primo test da scrivere non è l'aritmetica**: è che una fattura stornata al
100% **non** compaia in `tempoMedioPagamento`. È il difetto che questa scheda
esiste per impedire, ed è quello che passerebbe inosservato più a lungo.

---

## 4-bis. Quanto costa **oggi** non averla — misurato il 04/08

La scheda del 03/08 ha misurato la scorciatoia *futura* (la nota come fattura
negativa). Mancava la misura della scorciatoia **presente**: senza note di
credito, chi deve annullare una fattura realmente emessa ha due strade, e
tutt'e due sporcano un numero.

1. **cancellarla** — l'app stessa scrive che è sbagliato, e si perde il
   documento;
2. **registrare un incasso che non c'è stato**, per portarla a residuo zero. È
   quello che fa chi non vuole cancellare, e non lascia traccia di essere una
   finzione.

Misurato sulle funzioni vere, due fatture da **1.488,40 €** emesse il 10/01 con
scadenza 09/02:

| | `giorniPagamento` | `tempoMedioPagamento` |
|---|---|---|
| pagata davvero il 09/02 | 30 | `{giorni: 30, ritardo: 0}` |
| **annullata** col finto incasso del 30/06 | 171 | `{giorni: 171, ritardo: 141}` |
| **le due insieme** | | **`{giorni: 101, ritardo: 71}`** |

Cioè: **una sola fattura annullata porta il tempo medio di pagamento da 30 a
101 giorni**, e il ritardo medio da 0 a 71. Il numero che dovrebbe dire «i miei
clienti pagano bene» dice il contrario, per un documento che nessuno doveva
pagare.

E la direzione dell'errore **dipende dalla data che si mette nel finto
incasso**: chi la scrive uguale alla scadenza fa comparire un pagamento
puntuale mai avvenuto. Lo stesso identico gesto può gonfiare il numero in un
verso o nell'altro — che è peggio di un errore costante, perché non si corregge
guardando la media.

*(Ricontrollato lo stesso giorno: `prossimoNumero(["NC/2026/001",
"NC/2026/002"], 2026)` risponde ancora **`2026/001`** — un numero della serie
delle fatture, e già usato. La sua arità è **1**: `anno` e `cifre` hanno un
valore di serie, e il prefisso non c'è proprio.)*

---

## 5. Che cosa questa scheda NON decide

- **XML FatturaPA**: la nota `TD04` è la metà di una voce che nel censimento sta
  più in basso («XML FatturaPA»). Qui si prepara il **dato** perché quel giorno
  l'XML sia solo una trascrizione — importi positivi, tipo documento, fattura
  collegata — ma il file non si scrive adesso.
- **Il termine dei 12 mesi come vincolo duro**: l'app avvisa, non impedisce. La
  materia ha eccezioni che un software non può giudicare, e sbagliare per
  **eccesso di blocco** è comunque sbagliare.
- **La nota di debito** (`TD05`, variazione in aumento): esiste, è la simmetrica,
  e in cava serve molto meno. Si guarda dopo aver visto la nota di credito in
  uso.

---

## Fonti

- [Art. 26 DPR 633/1972 — Variazioni dell'imponibile o dell'imposta (Brocardi)](https://www.brocardi.it/testo-unico-iva/titolo-ii/art26.html)
- [Le note di variazione IVA: nota di credito e nota di debito (FISCOeTASSE)](https://www.fiscoetasse.com/approfondimenti/15421-le-note-di-variazione-iva-nota-di-credito-e-nota-di-debito.html)
- [Note di variazione IVA art. 26 — circolare Studio Bandera (PDF)](https://studiobandera.it/wp-content/uploads/2023/02/Studio-Bandera-CIRCOLARE-8_2023.pdf)
- [Agenzia delle Entrate — risposta a interpello n. 359/2023 sulle note di variazione (PDF)](https://www.agenziaentrate.gov.it/portale/documents/20143/5329468/Risposta+n.+3592023+all'interpello.pdf/a11f4c56-267c-b4a7-cdc6-dbd1c665faa3)
- [Nota di credito elettronica TD04: guida con esempi (Fatturah)](https://www.fatturah.it/blog/nota-di-credito-elettronica)
- [TD04 Nota di credito — tipo documento fattura elettronica](https://www.1c-erp.it/supporto/guida-utente-gestionale/fattura-elettronica/td04-nota-di-credito/)
- [Nota di credito e numerazione: come gestirla correttamente (Sibill)](https://sibill.com/gestione-finanziaria/nota-di-credito-e-numerazione-come-gestirla-correttamente/)
- [Note credito per accordi transattivi: le linee guida AIDC (MySolution)](https://www.mysolution.it/fisco/approfondimenti/commenti/20232/09/note-credito-per-accordi-transattivi-laidc-detta-le-linee-guida-setti/)
- [Senza limiti di tempo la nota di credito per accordi mirati a evitare una lite (Commercialista Telematico)](https://www.commercialistatelematico.com/articoli/2023/09/senza-limiti-tempo-emissione-nota-credito-sopravvenuti-accordi-per-evitare-lite-tra-parti.html)
