# Checkpoint — 2026-08-09T12:42:35Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`659ddaa`

## Task completato

**Chiusa la riga «non ho guardato» più grossa del giro**: il core era fuori dal
banco delle etichette della barra, e il registro ne dava una **causa
inventata**.

| | prima | adesso |
|---|---|---|
| core nel banco | **NON misurato**, 4 righe a giro | **16 etichette su 4 barre** |
| fuori posto trovati | — | **0** (a 430/390/360/320) |
| le sei app | 164 etichette | invariate (Conti 40 prima e dopo) |

## La cosa imparata

⛔ **UN WIDENING APPLICATO A UNA DELLE DUE DOMANDE È MORTO IL GIORNO IN CUI LO
SCRIVI.** Il banco chiedeva `querySelectorAll('button')` per sapere *se* la
barra avesse etichette; il core le voci le ha come `<div class="bn">`. Quindi
usciva sempre dalla guardia, e la riga dieci righe più sotto che allarga la
ricerca a `.bn` — commit `4ac0790`, **lo stesso giorno della guardia** — non
veniva **mai raggiunta**.

⛔ **E IL DANNO NON È IL BUCO: È LA FRASE.** «barra senza etichette (**non
ancora costruita**)» è una **causa inventata dal banco**, e falsa: la barra del
core è costruita e piena, quello che manca è nel righello. Per due giorni il
registro l'ha ripetuta quattro volte a giro, e chi la leggeva pensava a un
problema di **tempi** — cioè andava a cercare dove non c'era niente.
⚠️ La regola generale: **un controllo che non trova il suo soggetto dice quali
selettori ha cercato, non perché secondo lui non c'è.** La diagnosi è un'altra
domanda, e inventarla manda a lavorare nel posto sbagliato.

⚠️ E la cura strutturale è la stessa di stamattina sulla soglia: **la domanda
«ci sono etichette?» e la domanda «quanto larghe sono?» devono guardare la
STESSA lista.** Finché sono due elenchi, allargarne uno solo non produce un
errore — produce una **cecità che si dichiara con parole rassicuranti**.

## Verifiche
- misurata **prima** la barra vera del core con un righello mio: 4 voci, la più
  larga «Volate» a 44,8 px, `overflow: visible` sulle voci — quindi **niente
  può nascondere un difetto**, e lo zero è uno zero vero
- passata sana: core **16/0**, Conti **40/0** (invariata)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- server mio su porta libera, contrassegno col pid **riletto dal server**, e
  tolto dal repository a fine misura

## Dichiarato, non taciuto
⏱️ La **controprova completa** sulle quattordici superfici era **ancora in
corso** al momento del commit (una passata da quindici minuti buoni). La
riporto appena finisce; se non mordesse più, si sistema nell'unità dopo. Quello
che è verde adesso è la passata **sana**.

## Cantieri paralleli aperti
**Scudo** (4 tendine `#vf-verbale`), **Sentinella** (2 `#ppv-scelta`), **Conti**
(disegni e dato assente — ha già un banco nuovo, `conti-numeri-tranquilli.mjs`).
⛔ I loro file sono su disco e **non committati**: non si mette nell'indice un
file che un cantiere sta modificando.

## Prossimo passo atomico
1. Leggere l'esito della controprova completa e, se serve, sistemarla.
2. Raccogliere i tre cantieri quando rientrano, **rimisurando** ogni difetto e
   ogni numero prima di scriverlo, e aggiornare i quattro documenti sorvegliati
   **una volta sola** con le cifre rimisurate.
3. Poi un **giro nuovo del browser** sul committato: quello letto stamattina
   attestava `494863f` ed è ormai vecchio di oltre sessanta commit.
   ⚠️ Prima di lanciarlo, guardare **chi tiene la porta**, non solo se è libera.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11), **quali** delle 47
mancanze confermate diventino lavoro, e se `disponibilitaTurno` debba restare
**100%** su un turno chiuso in cui nessuno ha registrato fermi.
