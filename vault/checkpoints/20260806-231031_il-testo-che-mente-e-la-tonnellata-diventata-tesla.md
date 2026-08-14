# Checkpoint — 2026-08-06 23:10:31 UTC

## Tipo
unit-complete (tre unità dopo il checkpoint delle 22:07: il singolare finito nel
core, il banco `uno-solo`, i tre cantieri del testo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6c738f7` — *Il testo che mente: tre cantieri, 53 frasi sbagliate, e su un DDT
stampato la tonnellata era diventata un tesla*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 86 | **il singolare finito nel core** (`1aa02b8`) | **32** punti, e 3 dialetti trovati |
| 87 | **il banco `uno-solo.mjs`** (`6c738f7`) | 67 schermate, 176.000 caratteri |
| 88 | **Conti, Terra, Genesi · il testo** (`6c738f7`) | **53** frasi sbagliate |

## ⛔ Il filo nuovo: *il testo che mente*
Aperto stasera perché quattro difetti erano usciti **per caso** cercando altro.
In una sera, su tre app:

| dove | che cosa leggeva l'utente | perché conta |
|---|---|---|
| **Conti** | «LORDO (T)», «TARA (T)» a schermo **e sul DDT stampato** | su un documento ex DPR 472/1996 la **tonnellata** diventava un **tesla** |
| **Terra** | sul foglio per l'**ente**: «1 di qualità topografica, **1 indicativi**, 1 senza metodo» | le altre due voci dello stesso elenco erano giuste |
| **Genesi** | PPV «2,8 mm/s», e basta | il numero cambia da 6,4 accendendo una legge di sito che il modulo dichiara **provvisoria**, e tre superfici non lo dicevano |
| **Conti** | «(1 giorni di ritardo)» su un **sollecito** | esce dall'azienda |
| **Campo** | «(1 rapportini ancora senza data)» | trovato dal banco nuovo, non da un cantiere |

⛔ **E tutti e tre i cantieri hanno trovato la stessa cosa senza saperlo l'uno
dell'altro: una copia debole di `conta`/`plurale` dentro la propria app.** Conti
la chiamava `plur` (103 usi), Genesi `_ricPlur`, e Terra ne stava scrivendo una
**terza** mentre correggeva — e l'ha buttata via provandola contro l'originale.
Tutte più deboli allo stesso modo: su «1» arrivato come stringa da un CSV
rispondevano «1 fori», su `null` scrivevano «null fori». È la conferma, dal
vivo, dei **359** ternari contati poche ore prima.

## ⛔ La lezione di metodo: *il `grep` conosce solo i dialetti che gli hai insegnato*
Ripulendo il core, il censimento a testo ha detto «non resta niente» — e la
pagina, resa con **un solo** rapportino, diceva ancora «1 rapportini · 1 fori».
Il codice scrive quella frase in **tre dialetti**:
  · `${n} fori` — quello che cercavo
  · `+' fori'` — concatenazione: il motivo non lega
  · `<b>${n}</b> fori` — il tag in mezzo: idem
Sono serviti **tre giri**, e ogni giro è cominciato dal browser. Da lì il banco
`uno-solo.mjs`, che non cerca nel file ma nel **testo reso**.
⚠️ E anche la seconda sonda ha sbagliato: camminando sui **nodi di testo** non
trovava niente, perché il numero e la parola stanno in due nodi diversi
(`<b>1</b> fori`). Il testo che l'utente legge è la **concatenazione**.

## ⚠️ E il banco nuovo ha accusato un innocente al primo giro
«1 MEZZI» in Flotta — che erano **due piastrelle di KPI** unite dall'a capo di
`innerText`. Adesso fra il numero e la parola accetta solo uno spazio vero.
È la terza volta oggi che un controllo mio accusa il prodotto a torto (dopo la
regola 26 sul catalogo degli inneschi di Genesi): **la direzione che accusa
costa di più, e va provata come si prova quella che assolve.**

## Stato delle prove
Prove `node` **2.190** (run-kpi **1787**, stile 291), copertura **660/660**,
banchi del browser **112**. Giro `node` 21 comandi, 0 caduti sulla copia di ciò
che si committa, a ogni commit.
Banchi rilanciati sulla copia del commit: `uno-solo` 3/0 (+ controprova, 14
frasi rotte viste), `conti-frasi` 22/0, `terra-frasi-da-uno` **35/35**,
`genesi-frasi-limite` **31/31** (19 frasi messe alla prova nei casi limite).
✅ Gli ultimi due erano ancora in corso al momento del commit `6c738f7`, che lo
dichiarava: sono arrivati verdi, e questa riga chiude la promessa invece di
lasciarla appesa.

## Che cosa sta girando adesso
**Tre cantieri** che chiudono il giro del testo sulle app rimaste: **Scudo**,
**Flotta**, e **Campo + Sentinella** insieme. Hanno in mano `uno-solo.mjs` come
misura rapida del prima/dopo.

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**: indice da `HEAD` per `run-kpi.mjs` e
   `tutti.mjs` (si toccano in più mani), numeri dei documenti **rimisurati sulla
   copia**, e `uno-solo.mjs` rilanciato su tutte le superfici come prova che il
   giro è chiuso.
2. **Le decisioni**: le 19 scadono **venerdì 07/08**, cioè adesso. Se non arriva
   risposta si procede con la colonna «la mia risposta», dichiarandolo nel
   commit; restano ferme le 6 che richiedono il fondatore.
3. **La ricerca continua su Campo** (`docs/RICERCA_CONTINUA_CAMPO.md`, il
   rapporto di fine turno con le fonti) è scritta e va tradotta in unità — con
   la regola di sempre: niente entra in roadmap sulla parola dell'agente.
4. `unita-maiuscole.mjs` **non ha `t`, `kg`, `mc`, `h` nudi** nel suo elenco:
   dichiarato dal cantiere di Conti, ed è il motivo per cui diceva «nessuna
   unità in maiuscolo» mentre «LORDO (T)» era a schermo. Cambiarlo tocca 14
   superfici: è un'unità sua.

## Code aperte, dichiarate
- Su **Scudo** il banco delle modali apre 2 modali su 34: «pulita» è vero su due.
- La tendina `#ppv-scelta` di Sentinella taglia un'opzione: dichiarata e non
  corretta, il dettaglio compare subito sotto per disegno.
- Il **7,5%** del motore dei grafici e il **minimo di visibilità** che appiattisce
  i valori piccoli fra loro: misurati, dichiarati, non corretti.
- In **Conti**, `.meta.pesa` taglia 15 px su 1 riga DDT su 5: la parte che
  distingue resta (il badge «DDT INCOMPLETO»), accettato e misurato.

## Blocchi
Nessuno.
