# Checkpoint — 31/07/2026 06:45 UTC

## Task completato
**Terza iterazione sul lato Campo del ponte P2.** Le tre chieste dalla direttiva
sono fatte, su entrambi i capi del ponte.

| Commit | Cosa |
|---|---|
| `9a2df65` | Gerarchia invece di un muro di testo, e la seconda domanda aperta chiusa |

## Il problema, e il vero scambio
La seconda iterazione aveva lasciato il caso parziale a **178 px**: un paragrafo di
sette righe in una schermata dove si lavora, tutto allo stesso peso, senza un punto
da cui cominciare a leggere.

**Due note invece di una** — che è già la convenzione dell'app: qui sopra
«Rapportini consegnati» e «Produzione di oggi» sono note separate, e Terra fa lo
stesso. I numeri nella prima, la spiegazione nella seconda, che così porta il
colore dell'avvertenza senza tingere anche le cifre.

Il costo, misurato e non nascosto: il caso parziale **cresce** a 209 px, perché due
note hanno due padding. Il caso normale **scende** da 130 a 115. Ho stretto il
testo dove era ridondante — la data del rilievo **è** la fine del periodo, e dirla
due volte costava una riga — e il caso senza densità è scemato da 120 a 101.
Trentun pixel in più su due casi comprano un testo che si legge invece di un blocco
che si salta. È lo scambio giusto, e va detto così invece di far finta che sia
rimpicciolito.

## La seconda domanda aperta, chiusa
**Nessuna tendina del periodo**, al contrario di Terra, e la ragione sta nel codice:
chi compila un rapportino guarda il periodo appena chiuso — è quello in cui ha
lavorato — e lo storico degli intervalli è una domanda da quadro di controllo, che
sta in Terra col suo grafico. Una tendina qui aggiungerebbe una scelta in una
schermata dove si è venuti a scrivere, non a indagare.

Con questa e con quella sulle tessere, le due differenze fra i due capi del ponte
sono **decisioni scritte** e non omissioni. È il punto della direttiva sul
confronto affiancato: dove il nostro è diverso dal riferimento, o si corregge o si
spiega.

## Stato
Suite: **293 KPI**, **72 stile**, 7 demo, 43 helper, 23 pointcloud, 9 manifest.
Tutte verdi.

## Prossimo passo atomico
**Il grafico non è mai stato provato con etichette diverse da `A B C D`.** Tutte le
prove sui buchi e sul grafico dei turni usano etichette di un carattere; nella
realtà sull'asse x ci sono date («15/05»), e in altre app mesi e nomi. Quattro
punti a 390 px con etichette lunghe è il posto tipico in cui il testo si sovrappone
o esce dal disegno — e i difetti peggiori della settimana sui grafici (uno gonfiato
del 250%, le unità in maiuscolo) si sono visti solo **guardando**.

Cosa fare, in ordine:
1. misurare le etichette dell'asse x nel grafico dei turni di Terra a 390 px:
   riquadri di ognuna, e se due si sovrappongono;
2. provare il caso peggiore plausibile — sei o otto intervalli invece di quattro,
   che con voli quindicinali sono tre mesi di storico: si costruisce servendo un
   modulo dati con più rilievi, per intercettazione;
3. se si sovrappongono, il motore condiviso ha già `sparkline` e `barre` che
   affrontano lo stesso problema: guardare **come** lo risolvono prima di
   inventare una terza strada (ruotare le etichette, tenerne una su due, o
   accorciare il formato della data).

⚠️ Nota di metodo per questa unità: è una modifica al motore **condiviso**, quindi
valgono le due regole di ieri — prima verificare chi ne dipende, dopo provare che i
grafici di riferimento non sono cambiati **carattere per carattere**.

Restano aperti e già scritti: la larghezza dei comandi di Scudo (36–38 px invece di
44, compromesso misurato), il badge dell'idoneità (caso che la WCAG 2.5.8 esenta),
la copertura mancante sui campi interi di Genesi (tutti dentro modali: verificati
per montaggio e non per digitazione), e i tre punti che aspettano il fondatore —
progetto Firebase (10 minuti), permessi per ruolo, blocco del turno chiuso lato
server.
