# Checkpoint — chi va fermato, e chi invece no

- **Tipo**: unità (7 prove su `lavoratoriScoperti`)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `ab1e9e0`

## Cosa difende

`lavoratoriScoperti` è il numero in cima al Quadro di Scudo: **le persone che
oggi non possono lavorare**. Sotto c'è `abilitazioneLavoratore`, che distingue
ciò che **blocca** da ciò che è solo un'**attenzione**.

Quella distinzione sbaglia in due versi opposti, e sono costosi tutti e due:

- **attenzione trattata come blocco** → si ferma gente che può lavorare. Un'app
  che ferma per niente viene aggirata entro una settimana, ed è il modo peggiore
  di perdere una difesa: non si rompe, si smette di guardarla.
- **blocco trattato come attenzione** → sale su un mezzo chi non doveva.

## Le regole bloccate

| situazione | esito |
|---|---|
| requisito **mancante** | ferma |
| requisito **scaduto** | ferma |
| requisito **in scadenza** | *non* ferma — è un'attenzione |
| **non più in forza** | ferma, qualunque carta abbia |
| **non idoneo** alla visita | ferma |
| **idoneo con prescrizioni** | *non* ferma: si lavora, con le prescrizioni |

E una che riguarda la leggibilità del Quadro: una persona bloccata su due
mansioni compare **una volta sola**, con entrambe le mansioni elencate e il
motivo comune **non ripetuto**.

## La controprova

Ho scambiato di posto «scaduta» e «in scadenza» — un difetto che nel codice si
scrive spostando due parole, e che nessun errore segnalerebbe. Sono cadute
**tre** prove, due nuove e una che già esisteva a livello di
`abilitazioneLavoratore`: quindi l'area aveva una copertura parziale, e adesso è
protetto anche il numero che l'utente legge per primo.

## Stato

- **485** KPI (433 all'inizio della giornata) → **744** prove `node`, verdi
- **52 prove nuove** nella giornata su funzioni che nessuna suite nominava
- giro a 19 banchi: ancora ai banchi dei campi interi (sono i due più lenti:
  digitano davvero in 29 campi su nove superfici, due volte)

## Prossimo passo atomico

`coperturaControlli` di Flotta — dice quali mezzi hanno il giro macchina fatto e
quali no, ed è il dato su cui si decide se un mezzo può uscire. Poi
`consumoPerMezzo`. Stessa disciplina: se la prova nasce rossa si legge il codice
prima di accusarlo, e ogni prova va vista fallire col difetto rimesso.

## Bloccanti

- Nessuno.
