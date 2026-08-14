# Checkpoint — la lezione di stamattina, applicata alle altre regole

- **Tipo**: unità (controprove sui file veri per le regole 11, 13, 14)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `255c34c`

## Da dove nasce

Dalla giornata di poche ore fa: la regola 1 era cieca su gran parte delle
superfici **e la sua controprova diceva ok**, perché guardava tre superfici a
un punto ciascuna. La lezione — *una controprova va misurata anche nella sua
copertura* — è finita in `CLAUDE.md`. Qui viene applicata invece che solo
scritta.

Le regole 11, 13 e 14 avevano controprove **sintetiche**: dimostravano che la
funzione sa fallire su tre righe inventate. È lo stesso identico livello di
prova che aveva la regola 1 prima di scoprire il buco — e su tre righe inventate
anche la regola 1 andava benissimo.

## Cosa è entrato

Un aiuto solo, `controprovaSuiVeri`, che rimette il difetto **nei file veri** e
proprio dove la scansione è più in difficoltà: nei punti in cui un template di
primo livello si chiude, cioè gli stessi che alla regola 1 erano fatali. Non in
fondo al file, che è il posto più facile e non dimostra niente.

- regola 11 (euro scritto in casa): **10 superfici, 61 punti**
- regola 13 (due export con lo stesso nome): **6 superfici, 48 punti**
- regola 14 (la nota del modo usata come lavagna): **7 superfici, 50 punti**

Ogni prova **stampa** quante superfici e quanti punti ha toccato, e pretende
almeno tre superfici: un «zero violazioni» ottenuto su zero soggetti è
precisamente il difetto raccolto in `CLAUDE.md`.

## La verifica che rende la difesa una difesa

Ho reso **cieca** la regola 14 apposta (le ho tolto la forma che riconosce
l'identificativo) e la controprova nuova l'ha vista subito: *50 iniezioni su 50
non viste*, su sette superfici. Poi ripristinata.

Il difetto l'ho iniettato **dopo** aver committato, come dice la regola che mi
ero scritto dopo aver perso tre volte del lavoro con `git checkout`.

## Stato

- **174** prove di stile (149 stamattina), **433** KPI, 43 helper, 23
  pointcloud, 9 manifest, 7 demo — tutte verdi
- 15 banchi del browser: verdi (giro completo di stanotte)

## Prossimo passo atomico

Restano con la sola controprova sintetica le regole **9, 10 e 12**. La 12 (i
doppioni dentro il file) è quella che vale di più, perché il suo filtro è già
caduto una volta: cercava la forma `.some(` e non vedeva i quattro gestori
scritti col `Set`. Darle un'iniezione sui file veri — un gestore
d'importazione a cui si toglie la difesa — e verificare che la regola lo veda.

## Bloccanti

- Nessuno.
