# Checkpoint — 29/07/2026 19:50 UTC

## Task completati
Due cantieri chiusi dopo la verifica: **Conti** (`3b00a52`, record in questo
checkpoint) e **Flotta** (`4c70110`).

### Conti — la data di incasso vera
Era l'ultimo buco dati dell'ecosistema: l'incasso ripiegava sulla data di
emissione, quindi ogni analisi sui tempi di pagamento era finta. Ora si
registra quando il denaro è arrivato davvero, e in più parziali — in cava è
la norma, un acconto e un saldo.

Il punto delicato era la compatibilità, ed è risolto bene: una fattura già
marcata incassata **senza data** resta incassata e dichiara che la data non
è registrata, invece di sparire dai conti o di inventarsene una. Finché non
si registra un incasso nuovo, nessun totale si muove.

Il grafico emesso-contro-incassato, che prima di questo dato non si poteva
fare onestamente, con un mese solo di dati **non disegna nessuna linea**:
dice che sarebbe un andamento inventato e mostra i numeri veri.

### Flotta — ordine di lavoro e fermi macchina
La manutenzione era un evento senza lavorazione; ora è il documento
dell'officina, e il costo che ne esce finisce in magazzino, nei costi del
mezzo e nel fascicolo. Un ricambio senza prezzo **non passa per gratis**:
viene contato a parte, perché «non scritto» e «zero euro» non sono la stessa
cosa.

Difetto suo, trovato in verifica e corretto, che vale la pena ricordare: la
proposta di scorta suggeriva di **abbassare** una soglia sulla base di un
solo consumo — il modo migliore per ritrovarsi la macchina ferma.

## La verifica indipendente
Su entrambi non mi sono fidato del resoconto: ho eseguito le funzioni.

**Conti**, 10 asserzioni sul punto d'ingresso reale: acconto 3.000,50 +
saldo 6.749,50 = 9.750,00 con residuo a zero; col solo acconto la fattura
resta parziale e «Da incassare» scende **del solo acconto**; 33 giorni reali
fra emissione e saldo; fattura vecchia incassata senza data che resta
incassata e non inventa un residuo; collezione incassi assente che non rompe
niente. Tutte passate.

**Flotta**, 9 asserzioni: manodopera 4h×32 + 2,5h×40 = 228, ricambi
2×31,50 + 48 = 111, totale con 50 di spese = **389 esatto**; ricambio senza
prezzo contato a parte; manutenzione vecchia senza stato che risulta «da
fare»; disponibilità 100% senza fermi e 95% con 3 giorni persi su 60
giorni-macchina; fermo ancora aperto che conta fino a oggi; fermo di un
mezzo non in parco tenuto fuori dal conto e dichiarato; fermo fuori finestra
che non entra. Tutte passate.

**Nota di metodo, perché si ripeta.** Al primo giro cinque asserzioni
risultavano fallite. Erano tutte **mie**: nomi di campo indovinati
(`quantita` invece di `qta`, `altre` invece di `altreSpese`, `dal/al` invece
di `inizio/fine`), e una funzione di basso livello chiamata al posto del
punto d'ingresso che l'app usa davvero. Prima di dichiarare un difetto va
letto come il codice si aspetta i dati: una prova sbagliata che accusa il
codice fa perdere più tempo di nessuna prova.

## Un problema operativo da tenere presente
La cartella scratchpad è **condivisa** fra i cantieri paralleli, e più di un
agente ci ha sovrascritto i file di prova degli altri — è successo anche al
mio script di verifica, che a metà lavoro eseguiva il test di un'altra app.
Ho spostato i miei in una sottocartella dedicata. Nei prossimi cicli va
detto agli agenti fin dall'inizio.

## Cantieri ancora aperti
Due: **Scudo** (matrice formazione e nomine, registro DPI — dagli screenshot
di prova la navigazione mostra già le sei voci con «Ispezioni», quindi sta
lavorando) e **Terra+Sentinella** (verbale di rilievo stampabile, confronto
fra due rilievi, programma di monitoraggio, andamento per ricettore).

## Prossimo passo atomico
Raccogliere Scudo e Terra+Sentinella con la stessa verifica indipendente.
Poi il **Blocco 4, i ponti fra le app**, che è dove sta il valore
dell'ecosistema: un dato inserito una volta che serve in cinque posti. Il
primo è **Genesi → Campo → Genesi**: il piano di carico esce già da Genesi e
Campo lo importa, ma la carica reale foro per foro che Campo registra non
torna indietro a Genesi per la riconciliazione — ed è proprio il dato che
farebbe funzionare la calibrazione.
