# Genesi — le nuove funzioni "da grandi" (in parole semplici)

_Per Giuseppe · aggiornato 2026-07-21_

Genesi è il simulatore di volata (drill & blast) che gira nel browser. In
questi cicli ha guadagnato tre funzioni che lo avvicinano agli strumenti dei
big del settore (Orica, Maxam, O-Pitblast…). Qui sotto: **a cosa servono**,
**perché contano** e **come si usano**. Tutte lavorano nel browser, senza
server e senza costi.

---

## 1. Riconciliazione: previsto vs reale

**A cosa serve.** Dopo la volata, confronti quello che Genesi aveva *previsto*
(pezzatura x50, vibrazioni PPV, flyrock) con quello che è *successo davvero* in
cava. È il modo in cui i professionisti "chiudono il cerchio" e migliorano le
volate successive.

**Perché conta.** Un simulatore che non si confronta col reale resta un
giocattolo. Con la riconciliazione, Genesi *impara dalla cava*: vedi subito se
tende a sovrastimare o sottostimare, e di quanto.

**Come si usa.** Nella scheda dedicata: inserisci i valori reali misurati; la
tabella mostra lo scarto (verde se vicino, giallo/rosso se lontano). Puoi
salvare lo storico ed esportarlo in CSV.

---

## 2. Signature-hole: le vibrazioni dall'onda vera

**A cosa serve.** Invece di stimare le vibrazioni solo con una formula
generica, importi la **registrazione di un foro singolo** (un file CSV del
sismografo) e Genesi la "somma" secondo i ritardi della tua volata, ottenendo
la vibrazione composita prevista al ricettore.

**Perché conta.** È il metodo che usano i grandi (es. Orica AVM): tiene conto
della *tua* roccia e del *tuo* timing, quindi è molto più preciso della sola
legge di Devine. Aiuta a rispettare i limiti verso le case vicine.

**Come si usa.** Importi il CSV del foro-firma; Genesi mostra il picco
composito, l'amplificazione rispetto al singolo foro e un grafico. C'è una nota
onesta: il metodo assume che i fori contribuiscano in modo simile — è una
stima, non una misura certificata.

---

## 3. Export del piano di innesco (XML in stile IREDES)

**A cosa serve.** Dal Progetto 2D esporti un file XML con **tutto il piano**:
maglia, diametro, esplosivo, tipo di innesco, sequenza, ritardi, e la lista dei
fori (posizione, profondità, carica, borraggio, ritardo). Serve per passare il
piano a **detonatori elettronici** o a **software di terzi**.

**Perché conta.** In fase commerciale, poter "parlare" con gli strumenti che il
cliente già usa è un punto a favore: non lo costringi a reinserire tutto a mano.

**Come si usa.** Pulsante "Esporta piano di innesco (XML IREDES-like)". Onestà:
è una **bozza di interscambio**, non una conformità IREDES certificata (lo
dichiara il file stesso). Per il fochino resta il "piano di carico" in CSV.

---

## Cosa Genesi NON fa ancora (e perché aspettiamo te)

Due funzioni molto potenti — il **burden reale per foro** (dal 3D del fronte) e
l'**import della deviazione dei fori** (boretrack) — sono **rimandate di
proposito**. Richiedono di interpretare la geometria del fronte, e un avviso
sbagliato di flyrock sarebbe **pericoloso per il fochino**. Le faremo solo dopo
una tua conferma sui dati geometrici. È una scelta di sicurezza, non un ritardo.

---

## In una riga

Genesi ora **si confronta col reale** (riconciliazione), **stima le vibrazioni
sull'onda vera** (signature-hole) e **parla con gli strumenti dei clienti**
(export innesco). Restano da sbloccare, con la tua conferma, le funzioni che
toccano la geometria del fronte.
