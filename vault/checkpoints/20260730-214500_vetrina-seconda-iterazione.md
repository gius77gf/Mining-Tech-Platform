# Checkpoint — vetrina, seconda iterazione: quello che si vede e quello che si conta

- **Tipo**: seconda iterazione della vetrina (regola dell'eccellenza: almeno tre)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `e8c7995` (le anteprime) e `5e7ef9c` (i ponti e i conti)

## 1. Nove segnaposto uguali al posto di nove prodotti diversi

Le anteprime avevano `loading="lazy"`. Misurato su un telefono da 390 px:
**all'arrivo era caricata UNA anteprima su nove**; scendendo di corsa fino a metà
pagina se ne vedevano sette, e le altre restavano la miniatura disegnata — che è
la **stessa per tutte le schede**. Su una pagina il cui unico mestiere è far
vedere nove prodotti diversi, quello che si vedeva erano nove segnaposto uguali,
proprio nel momento in cui qualcuno la guarda per la prima volta.

Il risparmio a cui si rinuncia: **213 kB in tutto**, meno di una fotografia.

La parte che vale la pena ricordare è **perché nessuna prova poteva vederlo**:
l'immagine c'è nel sorgente, il file esiste, la pagina risponde 200. Mancava solo
il **momento** in cui arriva, e quello lo dice soltanto il browser. Ora il banco
apre la vetrina su uno schermo da telefono — su un monitor largo entrano più
schede sopra la piega e la pigrizia si vede molto meno — e pretende nove immagini
caricate senza scorrere.

**Un falso allarme, da raccontare perché costa tempo.** Guardando lo screenshot
di pagina intera sembrava che Flotta e Scudo mostrassero ancora il segnaposto.
Misurato: erano caricate, tutte e nove, 760×475. Quello che vedevo era la mia
immagine **rimpicciolita**: a quella scala una schermata vera di Flotta *è* una
serie di barre rosa. Prima di correggere un difetto visto in uno screenshot
ridotto, va guardato a grandezza naturale.

## 2. Tre numeri, tre valori diversi

I ponti scritti nel codice sono **sei**; l'apertura ne annunciava **cinque**; in
pagina ce n'erano **quattro**. Su una pagina fatta per essere guardata da un
cliente che conta.

I due che mancavano esistono come gli altri: **Campo → Genesi** (il consuntivo di
carico torna nella riconciliazione previsto-vs-reale) e **Sentinella → Scudo**
(un superamento o un reclamo diventano una non conformità da chiudere). Adesso
sono in pagina, e l'apertura dice sei.

Stesso genere l'altro conto: l'apertura dice «8 strumenti» e «1 accesso», ma
sotto compaiono **nove** riquadri. I numeri erano giusti — il nono riquadro è
l'accesso, già contato a parte — ma **un conto che torna solo se lo spieghi non
torna**. Una riga nel punto in cui si guarda la griglia toglie l'unica obiezione
facile della pagina.

Il difetto è tipico di una vetrina: il numero si scrive una volta, poi il
prodotto cresce. Ora il banco **confronta** il numero annunciato con quello che
c'è in pagina — sia la cifra dell'apertura sia il numero scritto a parole nel
sottotitolo — e il confronto si rifà da solo.

## Prossimo passo atomico

**Terza iterazione della vetrina**, quella che la regola dell'eccellenza chiede e
che ancora manca: mettere la pagina accanto alle migliori vetrine di prodotto in
circolazione e correggere dove la nostra è più povera. Da guardare per prime:
l'altezza sul telefono (7.200 px, otto schermate) e le intestazioni di famiglia,
che oggi sono più silenziose delle schede che introducono.

## Bloccanti

- Nessuno.
