# Checkpoint — 2026-09-13T04:54:28Z

## Tipo
difetto trovato, non ancora corretto (dichiarato per nome, con la misura)

## App
Genesi (direttiva del fondatore ancora in vigore: solo Genesi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ee998848` (nessun commit da questa unità: solo misura)

## Completato

Proseguendo la verifica visiva su schermate non ancora coperte, aperto il
modale "Riconciliazione (previsto vs reale)" a 320/390/430px. Lo
screenshot a 320px mostrava l'intestazione della griglia tagliata
("Sc..." invece di "Scostamento"). **Misurato invece di dedurlo dallo
screenshot**, con `scrollWidth`/`clientWidth` sul contenitore della
griglia (`#riconBody > div[style*="grid-template-columns"]`):

| larghezza | scrollWidth | clientWidth | serve scorrere? |
|---|---|---|---|
| 320px | 318 | 238 | **sì** |
| 360px | 318 | 278 | **sì** |
| 390px | 318 | 308 | **sì** |
| 430px | 348 | 348 | no |

La griglia (4 colonne: Metrica/Previsto/Reale/Scostamento, ciascuna con
un campo `<input style="width:70px">`) ha già `overflow-x:auto` sul
proprio contenitore — non fa scorrere la PAGINA di lato (la regola già
in vigore in questo repository, verificata: `document.body.scrollWidth`
resta entro la finestra a tutte le larghezze) — ma **serve scorrere
DENTRO il riquadro** per vedere la colonna del verdetto colorato
(verde/giallo/rosso) a 320, 360 e 390px, cioè alle larghezze più comuni
di telefono. Solo da 430px in su la griglia sta intera senza scorrere.

**Perché non l'ho corretto in questa unità**: la causa più probabile è
che le colonne sono dichiarate a `fr` semplici (`1.1fr .8fr 1fr 1.2fr`,
riga ~4076 di `genesi.html`) invece di `minmax(0,…fr)`, quindi non si
restringono sotto la larghezza minima del loro contenuto — e il
contenuto include un `<input>` a **larghezza fissa 70px** per cella.
Una correzione rapida (`minmax(0,Nfr)`) rischia di far uscire l'input
dalla propria cella invece che dal contenitore intero — lo stesso
principio "non si distingue un difetto risolto da uno spostato" di
questo repository. La correzione giusta richiede una scelta di
interfaccia (input più stretto? etichette abbreviate — "Scarto" invece
di "Scostamento"? colonne che vanno a capo invece di restare in riga?),
non solo un numero da cambiare — e "farla a metà è peggio di non
farla".

## Stato roadmap

Nessuna voce toccata.

## Blocchi e limiti noti

**Nuovo, dichiarato per nome**: il modale di riconciliazione richiede
scorrimento orizzontale interno per vedere lo scostamento a 320-390px.
Non blocca l'uso (il dato è raggiungibile scorrendo, non nascosto), ma
è un'esperienza peggiore di quanto questo repository accetta di solito
("l'eccellenza è lo standard"). Non tocca la geometria del fronte, il
flyrock o il burden — nessuna relazione col blocco di sicurezza aperto.

## Prossimo passo atomico

Progettare (non solo correggere) la griglia della riconciliazione per le
larghezze strette: valutare `minmax(0,…)` sulle colonne **insieme** a un
input più stretto o a un'etichetta più corta per "Scostamento", poi
verificare con lo stesso script di misura (`scrollWidth`/`clientWidth`
sul contenitore) a 320/360/390/430px prima di dichiararlo risolto. Se
si preferisce rimandare: resta un candidato dichiarato per la prossima
passata di qualità, non un difetto dimenticato.
