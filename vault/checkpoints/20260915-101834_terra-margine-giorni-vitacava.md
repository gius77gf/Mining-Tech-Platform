# Checkpoint — 2026-09-15T10:18:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
014f20b7 (pushato)

## Cosa è stato completato

Secondo fix di codice del quinto giro di ricerca (Terra, la lacuna più
economica delle tre). `vitaCava()` calcolava già i due ingredienti (giorni
alla scadenza del titolo, anni residui al ritmo medio) ma restituiva solo
`scadePrimaIlTitolo` — un booleano che dice CHI arriva prima, non DI
QUANTO: un mese di scarto e un decennio di scarto leggevano la stessa
frase, sia nel modulo sia nel riquadro "Quanto resta del volume
autorizzato" della pagina.

**La correzione**: aggiunto `margineGiorni` al valore di ritorno di
`vitaCava` (`terra-data.js:1074`) — la differenza fra i giorni alla
scadenza e i giorni all'esaurimento stimato, non un dato nuovo da
raccogliere. La pagina (`index.html`, riquadro vita cava) mostra ora il
margine sotto la frase su chi scade prima: in giorni sotto i due mesi
(dove un "circa N mesi" nasconderebbe l'urgenza), in mesi sopra.

**Verifica**:
- Nuovo test in `run-kpi.mjs`: due scenari costruiti (ritmo alto su
  residuo scarso → il volume finisce prima; ritmo basso su residuo
  abbondante → il titolo scade prima), verificando verdetto, positività
  del margine e che scali col ritmo; terzo caso senza `dataScadenza`: né
  booleano né margine si inventano (`null`, non un numero a caso).
- Controprova: rimesso `margineGiorni` sempre a `null` nel sorgente, il
  test è caduto esattamente sull'asserzione attesa; ripristinato,
  riverificato verde.
- Nessuna funzione nuova: `margineGiorni` è calcolato dagli stessi due
  ingredienti già presenti nella funzione, nessun rischio di "copia
  debole" perché non c'è una seconda implementazione da tenere allineata.
- Giro isolato su worktree separata, scoped esattamente ai 7 file di
  questa unità: **40 comandi a posto, 0 caduti**.

## Stato roadmap

Quinto giro di ricerca: 2 delle 5 lacune confermate trasformate in fix
(Campo, Terra). Restano: Scudo (sospensione disciplinare temporanea,
campo assente dal modello del lavoratore) e le due lacune più costose di
Terra (varianza mensile piano-vs-reale, ~3-4 ore; finestra corta contro
lunga per rilevare accelerazione del ritmo, ~4-6 ore) — entrambe
dichiarate ma non ancora affrontate, restano candidati per un blocco
successivo.

## Prossimo passo atomico

Scudo — aggiungere il campo `sospesoFinoa: ISO|null` al modello del
lavoratore e una riga bloccante in `abilitazioneLavoratore`
(`scudo-data.js`, vicino a dove si controlla `l.attivo`), sul modello
esatto già usato per le altre condizioni bloccanti della stessa funzione.
Chiude l'ultima lacuna "economica" del quinto giro. In parallelo o
subito dopo, per non fermarsi: un nuovo giro di ricerca mirata su
un'area non coperta in questo blocco (Flotta, Sentinella, Conti o
Deepwork ID, secondo passaggio più approfondito) — con `isolation:
"worktree"` per ogni agente in background stavolta, e controllando prima
la convenzione di maiuscole/minuscole dei nomi file di destinazione.
Nessuno stop volontario: si prosegue subito.
