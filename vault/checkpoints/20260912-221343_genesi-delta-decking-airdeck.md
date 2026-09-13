# Checkpoint — 2026-09-12T22:13:43Z

## Tipo
delta dalla ricerca (analisi del meccanismo — nessun codice cambiato, per scelta)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8ad64469`

## Completato

Raccolta la ricerca di fianco su decking/air-decking (lanciata nell'unità
precedente) e fatto il delta partendo dal MECCANISMO, non dal nome, come
vuole la regola di questo file:

**Verificato nel codice** (`grep -n "deckStem\|D2\.decks" apps/genesi/*`):
Genesi ha già il decking (1-3 cariche/foro, campo `deckStem` = "borraggio
tra deck", 0,3-4 m) ma il gap fra i deck è **sempre e solo borraggio
inerte**, mai aria — nessun campo di tipo materiale, nessuna riga di
codice distingue i due casi. La ricerca conferma che questo è un gap
reale rispetto al mondo: l'**air-decking** è una tecnica distinta e
nominata, non solo un'etichetta diversa per lo stesso borraggio — usa
un'intercapedine d'aria che riflette le onde d'urto (teoria Melnikov),
con benefici misurati di risparmio esplosivo (10-35% range confermato da
più fonti) e riduzione di backbreak/vibrazione (numeri meno solidi, in
parte da fonti commerciali).

**Perché non è stata tradotta in un delta di prodotto ora**: il
miglioramento REALE (risparmio esplosivo quantificabile, minor
vibrazione) richiederebbe di codificare un NUMERO nel motore fisico di
Genesi (es. "con aria selezionata, riduci la carica suggerita del X%") —
esattamente il tipo di scelta che questo repository vieta di fare sulla
parola di un agente, perché anche il numero meglio supportato (10-35%)
è un RANGE dipendente dalla roccia e dalla geometria, non una costante.
Un'aggiunta puramente cosmetica (etichetta "aria" invece di "borraggio"
nel diagramma/report, senza nessun effetto sul calcolo) è stata valutata
e scartata per ora: darebbe l'illusione di una funzione mentre non
cambia nessun numero — il tipo di "corregere a metà" che CLAUDE.md
segnala come peggio di non correggere affatto.

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

Nessuno nuovo. Non tocca in nessun modo il blocco di sicurezza su
geometria/flyrock/burden (è un tema di carica, non di posizione del
fronte).

## Prossimo passo atomico

Con quattro ricerche di fianco raccolte in questo blocco e nessuna
tradotta in codice senza fonti solide, le strade aperte sono:
1. Attendere la risposta del fondatore sulla segnalazione di sicurezza
   principale (`docs/DECISIONI_WEEKEND.md` §6).
2. Se si vuole comunque procedere sull'air-decking: la scelta onesta
   sarebbe una funzione DIDATTICA (mostra il range 10-35% come stima di
   letteratura, dichiarata "di seconda mano, da verificare sul proprio
   sito", non applicata al calcolo) — ma è una decisione di prodotto
   (che tipo di funzione vogliamo: un calcolo o un'informazione?) più
   che un'unità atomica, quindi non presa qui.
3. Una nuova ricerca di fianco su un angolo Genesi ancora scoperto, se
   se ne trova uno.
