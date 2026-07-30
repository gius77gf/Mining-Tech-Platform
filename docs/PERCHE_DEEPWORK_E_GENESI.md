# Perché esistono sia Deepwork sia Genesi

*Scheda per il fondatore — 30/07. Serve a rispondere in dieci secondi alla
domanda che arriverà alla presentazione: «ma la volata non la fa già Deepwork?».*
**La divisione proposta in fondo è una decisione di prodotto: va confermata da
te. Finché non la confermi, qui non si tocca niente.**

---

## La domanda

Chi guarda l'ecosistema per la prima volta vede due posti in cui compare la
parola «volata»:

- nel **core Deepwork** c'è una schermata «Volate (fochino)» con l'elenco delle
  volate, i fori, i chilogrammi, un modello 3D e la condivisione;
- in **Genesi** c'è la progettazione della volata, con lo schema dei fori in 2D,
  la simulazione 3D, le colonne di carica, i ritardi e la previsione delle
  vibrazioni.

Se non si spiega la differenza, sembra la stessa cosa fatta due volte. Non lo è,
ma **oggi il confine non è scritto da nessuna parte**, e questo è il problema
vero: non che le due app si sovrappongano, ma che nessuno possa dire in una
frase chi fa cosa.

## Cosa fanno davvero, guardando il codice

**Il core registra quello che è stato fatto.** La schermata volate lavora su
`DB.rapportini` e `DB.rapportiniFoc` (`index.html`, `applicaFiltriVolate`, riga
~2171): sono *rapportini*, cioè fogli che qualcuno compila a fine giornata. I
filtri sono per data, cava e persona; il riepilogo somma volate, fori e
chilogrammi (riga ~2179). Le altre funzioni sono dello stesso tipo: aprire una
volata in sola lettura (`openVolataReadonly`), condividerla
(`condividiVolata`), allegarci il referto del sismografo (`openSismoForm`).
Anche il 3D del core (`build3D`, riga ~3851) disegna una volata **già
avvenuta**: prende `v.fori`, `v.maglia`, `v.fronte` da un documento salvato e li
mostra. È un visualizzatore di archivio, non uno strumento di studio.

In una parola: **il core è il diario dell'azienda**. Chi ha fatto cosa, dove,
quando, con quanto materiale. È quello che serve quando arriva un controllo,
quando si cerca un documento, quando si vuole sapere com'è andato il mese.

**Genesi studia quello che si farà.** Genesi non ha rapportini: ha una
progettazione (schermata «2D»), una simulazione (schermata «3D») e gli strumenti
che servono a decidere *prima* — le colonne di carica, i ritardi foro per foro,
la mappa dell'energia, la banda d'incertezza da precisione di perforazione, la
legge di sito ricavata dai referti del sismografo. E ha la riconciliazione:
confrontare quello che era stato previsto con quello che è successo davvero.

In una parola: **Genesi è il tavolo da disegno**. Serve a rispondere a «quanti
fori, quanto esplosivo, con quali ritardi, e cosa succederà alle case vicine».

## La frase da dire alla presentazione

> Deepwork è il **diario** della cava: registra quello che è stato fatto e tiene
> in ordine i documenti. Genesi è il **tavolo da disegno**: progetta la volata
> prima che venga fatta e prevede come andrà. Il diario dice *com'è andata*, il
> tavolo da disegno dice *come farla*. Il ponte fra i due è la
> **riconciliazione**: quello che il diario ha registrato torna indietro e
> corregge il modello, così la volata dopo è più precisa di quella prima.

Questa non è una toppa per giustificare due prodotti: è la ragione per cui i due
insieme valgono più della somma. Un progettista senza consuntivi tara i suoi
modelli a occhio; un archivio senza progettista è un raccoglitore.

## Le tre sovrapposizioni reali, e cosa proporrei

Sono tre, e sono tutte nel core. Nessuna è grave, tutte e tre confondono chi
guarda.

**1. Il 3D della volata è in tutti e due.** Il core ne ha uno (`build3D`),
Genesi ne ha uno molto più avanti. Quello del core è nato prima ed è più povero:
non ha le colonne di carica a colori, non ha i ritardi, non ha la banda
d'incertezza.
*Proposta*: il core smette di disegnare e **apre Genesi in sola lettura** sulla
volata scelta. Un motore 3D solo, mantenuto in un posto solo. Chi guarda una
volata vecchia dal diario finisce dentro Genesi e capisce da sé a cosa serve
Genesi — che alla vendita non guasta.

**2. La maglia e i fori sono salvati in due formati diversi.** Il core li ha
dentro il documento della volata (`v.maglia`, `v.fori`); Genesi ha il suo
progetto. Sono gli stessi numeri scritti in due modi.
*Proposta*: un ponte come gli altri già fatti — la volata del diario porta il
riferimento al progetto di Genesi, non una seconda copia dei numeri. È la stessa
regola che vale per tutto il resto dell'ecosistema: **una cosa vive in un posto
solo, gli altri la citano.**

**3. La parola «volata» significa due cose.** Nel core è *il rapportino di una
volata fatta*; in Genesi è *il progetto di una volata da fare*. Sono due oggetti
diversi con lo stesso nome, ed è il modo migliore per far litigare due persone
in riunione.
*Proposta*: nel core si chiamano **rapportini di volata**, in Genesi **progetti
di volata**. Costa mezz'ora di testi e toglie un equivoco per sempre.

## Cosa NON propongo

Non propongo di togliere la sezione volate dal core. Chi apre il diario per
ritrovare una volata di tre mesi fa deve trovarla lì, dove sta tutto il resto
dell'archivio: spostarla in Genesi vorrebbe dire chiedere a un capocava di
imparare un secondo programma per una cosa che già sa fare. Il core resta il
posto dove si **cerca**; Genesi resta il posto dove si **progetta**.

## Cosa serve da te

1. **Confermi la divisione** «diario / tavolo da disegno»? È la frase che finisce
   nel materiale di presentazione e nei testi delle due app.
2. Delle tre sovrapposizioni, **quali chiudiamo e in che ordine**? La più
   economica è la terza (i nomi); la più visibile è la prima (un 3D solo).
3. Alla presentazione le mostriamo come **due app distinte** o come **una app con
   due modi**? Cambia il modo di raccontarle, non il codice.

Finché non rispondi, il codice resta com'è: nessuna di queste proposte è stata
applicata.
