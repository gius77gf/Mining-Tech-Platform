# Checkpoint — 2026-08-07 10:35:00 UTC

## Tipo
unit-complete (tre unità: la regola 27, i due KO del giro che erano del banco, e
le lezioni in CLAUDE.md)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e9e7b4d` — *CLAUDE.md: un numero atteso scritto dentro un banco invecchia col
crescere della dimostrazione*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 135 | **regola 27** (`1476d45`) | 8 superfici senza i tre temi, tutte dichiarate; stile 293 → **294** |
| 136 | **i due KO del giro** (`96d96f2`) | banco **19 → 34** prove, e il prodotto era sano |
| 137 | **le lezioni in CLAUDE.md** (`e9e7b4d`) | — |

## ⛔ I due soli KO del giro pulito erano del BANCO, non del prodotto
La prima cosa chiesta al cantiere non è stata «correggi», è stata: **schermo e
PDF, stesso istante, stesso stato — quali numeri?**

    schermo (riquadro KPI, periodo TOTALE)   46 fori · 419 m · 3466
    PDF     (piede della tabella)            46 fori · 419.0 · 3466.1

Coincidono. Il banco pretendeva `2395.1 / 317 / 34`: erano **esatti fino al
06/08**, quando la dimostrazione ha guadagnato un quinto rapportino. Da quel
giorno accusava il core di sommare i turni mai misurati mentre il foglio diceva
la stessa identica cosa del riquadro sopra il bottone.
⚠️ E il `2395.1` che «leggeva sullo schermo» era il totale **per operatore** di
un'altra riga, pescato come **sottostringa** da 600 caratteri di `innerText`:
una controprova che cerca una sottostringa risponde ok qualunque cosa succeda
al numero che deve sorvegliare.

⛔ **E crollando ne nascondeva altre undici.** Un `page.click` scaduto lo ha
ucciso a metà: il registro ha stampato **19 prove invece di 30**, e un totale
più basso non è un buco che si vede. La causa sotto: i casi iniettati nel
letterale di `DB` e buttati un istante dopo da un `DB.volate = [...]` aggiunto il
06/08 — con la riga «i casi hanno agganciato la pagina» che diceva **ok**,
perché guardava il **file** invece dello **stato**.
Adesso i totali sono **derivati** (dalla somma di quello che il foglio stesso ha
stampato, e dal riquadro letto **per selettore**), il banco non muore ma
dichiara, e la dimostrazione servita ha un turno riaperto **senza il quale somma
ingenua e somma giusta coincidevano** — cioè le due prove non distinguevano
niente.

## ⛔ Regola 27: Genesi non ha la modalità sole, e nessuno lo diceva
Misurando il contrasto nei tre temi è saltato fuori che **Genesi non carica
`shared/dw-tema.js`**: chi progetta una volata non ha il tema per leggere il
telefono in cava. Non è per forza un difetto (la sua palette è dichiarata fuori
perimetro), ma **un'assenza scoperta per caso vale come non saperla**.
⚠️ E due errori miei, presi dalla regola stessa al primo giro: l'elenco delle
eccezioni scritto **a memoria** ne mancava tre, e la prima stesura cercava la
**menzione** invece del **caricamento** — il core nomina `dw-tema.js` in un
commento. Terza volta oggi che un commento viene preso per la cosa che nomina.

## Stato delle prove
Giro `node` **23 comandi, 0 caduti**. Prove **2.249** (`run-stile` 294),
copertura **677/677**, banchi **129**.

## Che cosa sta girando adesso
1. **Il giro pulito su `4643be7`**: trenta sezioni. I due KO del core sono ora
   spiegati e chiusi; restano quello del prospetto di **Terra** (esce dalla
   larghezza del foglio a 390 px) e i due sul nome del file di fine turno di
   **Campo** — tutt'e tre in app tenute da un cantiere.
2. **Quattro cantieri** ancora vivi sui temi chiari (Flotta, Conti, Scudo,
   Campo, Terra). ⚠️ Quello di Conti sta correggendo la **regola 24** di
   `run-stile` — il secondo difetto che il cantiere di Sentinella aveva
   dichiarato e non corretto: la stessa mappa piatta poteva **accusare un colore
   sano o smettere di guardare quello vero** a seconda di come lo si scriveva.

## Prossimo passo atomico
1. **Raccogliere i cantieri man mano che chiudono**, verificando sulla copia di
   quello che si committa e scrivendo io i conti dei documenti.
2. **Le tre KO nuove del giro** vanno date ai cantieri che tengono quelle app
   quando riconsegnano.
3. **La geometria del gradiente** nel righello: cantiere a sé, dichiarato.
4. **Registrare `--tema=chiaro` e `--tema=sole` in `tutti.mjs`** solo quando le
   sei app sono a zero.
5. ⚠️ **Le 19 decisioni**: è venerdì 07/08, si applicano **a fine giornata** se
   non è arrivata risposta, dichiarandolo nel commit.

## Code aperte, dichiarate
- A periodo aperto il report del core esce `Report_tecnico__.pdf`: due salvataggi
  si sovrascrivono.
- Il piede del report somma anche le righe **senza data** — voluto e
  documentato, ma la frase sotto la tabella non lo dichiara come dichiara le
  altre due esclusioni.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
