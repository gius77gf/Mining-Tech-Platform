# Checkpoint — 2026-08-07 01:40:43 UTC

## Tipo
unit-complete (tre unità: il 7,5% misurato, Genesi raccolta, Campo raccolta)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`3e03c7c` — *Campo: 2.300 t su un rapporto DATATO, attribuite a un giorno che
nessuno aveva dichiarato*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 97 | **il 7,5% misurato** (`88fa076`) | non «tutti»: **uno su tre** (Terra ×0,925) |
| 98 | **Genesi · i file che escono** (`d07ca2f`) | 9 download aperti, **32** numeri confrontati, **4** difetti |
| 99 | **Campo · i file che escono** (`3e03c7c`) | 22 documenti, **347** celle, il difetto grave |

## ⛔ La domanda che continua a pagare: *chi decide i numeri di ciò che ESCE*
Il 03/08 aveva trovato 24 difetti su cinque app. Portata sulle due che erano
rimaste fuori:

| app | il difetto peggiore | perché conta |
|---|---|---|
| **Genesi** | il file di scambio scriveva lo **scatter d'innesco** invece del ritardo nominale (`42` → `42,332516881726825`), e il giro di andata e ritorno riportava una volata da **42 ms a 25** | è il file con cui una volata si riapre |
| **Campo** | rapporto **datato 07/08** con `2.510 t`, di cui `2.300 t` da un rapportino **senza data** — e zero dichiarazioni, mentre lo schermo lo dice **due volte** | è il foglio che si consegna e si archivia |

⚠️ E in Campo il **numero non era sbagliato**: 2.510 è quello dello schermo.
Mancava la dichiarazione — per questo il banco pretende che i due totali restino
**uguali**: chiedere un numero diverso sarebbe chiedere un difetto nuovo.
La regola giusta era già nel modulo (`registrazioniSenzaGiorno`), usata dallo
storico e non dai due documenti: la copia debole **dove il documento si compone**,
esattamente dove CLAUDE.md dice di cercarla.

## ⚠️ E dove le app erano già a posto — col conto accanto, che è ciò che lo rende credibile
Campo: i tre CSV composti a mano sono **puliti**, `ore_lavorate` resta **vuota**
(non `0`) quando manca un orario — provato su 5 persone in 5 stati; nessuna
unità in maiuscolo in **22** documenti. Genesi: puliti `legge_di_sito`,
`piano_innesco`, `piano_carico`, `signature_composito` e il file per Sentinella
— quest'ultimo il **solo** che già dichiarasse la legge provvisoria.

## ⚠️ Il 7,5%, e una nostra dichiarazione corretta
Il 06/08 avevamo scritto «**ogni** grafico di **ogni** app dipinge a 368 su 398».
Misurato: **Terra ×0,925**, Flotta **×1**, Sentinella **×1**. Dove l'ospite è già
il riquadro del disegno il difetto non c'è. Uno su tre, non tutti — e manda a
lavorare in un posto diverso.
La correzione è **progettata e provata su una copia** (`this.wrap || this.el`:
si misura il riquadro del disegno, non l'ospite; rapporto medio 0,975 → **1**) e
**non è committata**: `shared/dw-grafici.js` lo caricano tutte le pagine e i
cantieri stanno misurando. Racconto e misure: `docs/IL_GRAFICO_DISEGNATO_ALLA_MISURA_DI_FUORI.md`.

## Stato delle prove
Prove `node` **2.193** (run-kpi **1789**), copertura **662/662**, banchi del
browser **120**. Giro `node` 21 comandi, 0 caduti sulla copia di ciò che si
committa, a ogni commit. Le controprove dei due cantieri **rilanciate da me**:
Campo 14 iniezioni su 14 e 24 prove cadute, Genesi 5 su 5 e 21 cadute.

## Che cosa sta girando adesso
**Tre cantieri**: **Scudo** (banco con un dato solo + le due classi orfane
`.fld` e `.acc`), **il core** (le modali: ne apre 11 su 68, ed è la superficie
che il fondatore mostra per prima), **Conti** (con un dato solo, col metodo
`rotte` che in Flotta ha trovato 24 frasi).

## Prossimo passo atomico
1. **Raccogliere i tre cantieri**, con la procedura di stanotte: indice,
   verifica sulla **copia di ciò che si committa**, controprove **rilanciate da
   me** (non prese dal riepilogo), contatori dei documenti **rimisurati**.
2. **Poi, e solo quando nessun cantiere è dentro le pagine**: far atterrare la
   correzione del motore dei grafici, **insieme** al suo banco registrato — mai
   prima, o un banco che fallisce rende rosso il giro di tutti. Manca la misura
   **a tappeto** e il caso «grafico dentro una sezione nascosta», dove
   `.dwg-plot` è largo zero e il ripiego dà un numero plausibile e sbagliato.
3. **Il censimento delle classi orfane nei test** (oggi è in scratchpad): 15
   eccezioni da dichiarare una per una, e l'elenco è stantio finché i cantieri
   lavorano.
4. **I 4 CSV di Scudo** senza il marchio della dimostrazione, fra cui il
   registro infortuni.
5. **Le 19 decisioni scadono oggi, venerdì 07/08.**

## Code aperte, dichiarate
- `.dw-btn.mini` resta duplicata nel `<style>` di **Scudo** e **Campo**: da
  togliere quando i cantieri chiudono (misurato: 11px lo stesso).
- **Genesi**: l'XML scrive l'id interno dell'esplosivo dove il fratello porta id
  **e** nome (cambiarlo romperebbe chi già lo legge); e la Home esporta lo stato
  del 3D invece di quello appena aperto — **non è una copia debole**, il file è
  d'accordo col suo schermo: è una decisione su quale stato debba uscire.
- Il **minimo di visibilità** che appiattisce i valori piccoli, la tendina
  `#ppv-scelta` di Sentinella, `.meta.pesa` di Conti: misurati, dichiarati.

## Blocchi
Nessuno.
