# Checkpoint — le tendine tagliate, e una sonda che non guardava niente

- **Tipo**: una unità di estetica nata da uno screenshot **guardato**
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `1676a00` (le tendine)

## Da dove è partita

Avevo scattato lo screenshot di Conti per verificare il bottone nuovo — e
guardandolo, non solo producendolo, ho visto la tendina dell'IVA che leggeva
«22% — ordinari», col taglio netto che sembra un **errore di battitura**.

## La sonda che diceva «tutto a posto» senza guardare

La prima misura ha risposto *«nessuna tendina taglia il testo»*. Era falsa, e
per il motivo peggiore: scartava gli elementi con **altezza zero**, cioè tutte
le tendine delle sezioni non aperte — e la IVA era fra quelle. Il controllo non
guardava dove credeva di guardare.

È lo stesso difetto della regola 12 di stamattina (il filtro che cercava
`.some(` e non vedeva i `Set`) e della controprova del banco degli id (che
iniettava dentro i modelli di stampa). **Tre volte in un giorno la stessa forma:
lo strumento di misura che manca il bersaglio e risponde «pulito».**

## Le due misure, e perché la seconda conta più della prima

Rifatta sezione per sezione: **84 tendine** nelle sei app, **19** che tagliano
almeno un'opzione a 390 px.

Poi la domanda giusta: *tagliata* non vuol dire *dannosa*. Il danno vero è **non
capire cosa è selezionato**, e succede solo se due opzioni, tagliate, diventano
la stessa cosa. Misurato: **zero casi**. Nessuno rischia di scegliere la cosa
sbagliata.

Quella seconda misura ha **evitato diciannove correzioni inutili** — e questo è
un risultato, non un mancato lavoro.

## Cosa ho corretto davvero

Due cose, non venti:

1. **I puntini di sospensione** sulle tendine, nello stile condiviso: sono la
   differenza fra «è tagliato» e «è sbagliato».
2. **L'unità davanti** nel listino di Conti: «€/t — tonnellata» invece di
   «€ a tonnellata (€/t)». La parte tagliata era proprio il **simbolo**, cioè
   l'unica che conta. Ora entra tutta.

Le aliquote IVA restano come sono: la percentuale è già in testa, e quello che
si perde è la spiegazione — che si legge aprendo la tendina.

⚠️ Nota onesta sul compromesso: i puntini **tolgono un altro carattere** dove il
taglio era di pochi pixel. Vanno bene quando manca molto (dicono «continua»),
meno quando manca poco — per quello il caso stretto l'ho risolto accorciando il
testo, non con i puntini.

## Prossimo passo atomico

Leggere il **RIEPILOGO del giro definitivo** (in corso). Da adesso, fino a
quando non è finito, **niente modifiche alle pagine né allo stile**: il giro
precedente è stato buttato proprio perché i primi banchi leggevano file diversi
dagli ultimi, e un risultato misto è peggio di nessun risultato — sembra
completo.

## Bloccanti

- Nessuno.
