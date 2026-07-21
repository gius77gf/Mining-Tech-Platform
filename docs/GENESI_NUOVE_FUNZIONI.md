# Genesi — le funzioni recenti (in parole semplici, con onestà)

_Per Giuseppe · aggiornato 2026-07-21_

**Premessa onesta e importante.** Genesi NON è al livello dei concorrenti, e non
lo sarà "facilmente". Aziende come Orica, Maxam, Maptek, O-Pitblast hanno
database di volate reali costruiti in decenni, modelli **calibrati sul campo**,
integrazione con perforatrici e detonatori veri, team di ingegneri e geologi,
supporto e certificazioni. Noi abbiamo un simulatore che gira nel browser. Le
funzioni qui sotto sono **primi passi nella direzione giusta**, non una parità:
sono utili, ma **non ancora validate su dati reali di una tua cava**. Vanno
lette così.

---

## 1. Riconciliazione: previsto vs reale

**Cosa fa.** Dopo la volata, puoi confrontare quello che Genesi aveva *previsto*
(pezzatura x50, vibrazioni PPV, flyrock) con quello che è *successo davvero*.

**Perché è utile.** Confrontarsi col reale è il modo giusto per migliorare: si
vede se il modello tende a sbagliare, e di quanto.

**Il limite.** È un confronto grezzo su numeri inseriti a mano: **non** calibra
automaticamente il modello, e senza uno storico di volate reali della tua cava
resta indicativo. I leader su questo hanno anni di dati; noi no (ancora).

**Come si usa.** Scheda dedicata: inserisci i valori reali; la tabella mostra lo
scarto (verde/giallo/rosso). Salvi lo storico ed esporti in CSV.

---

## 2. Signature-hole: le vibrazioni dall'onda vera

**Cosa fa.** Importi la registrazione di un **foro singolo** (CSV del
sismografo) e Genesi la "somma" secondo i ritardi della volata, stimando la
vibrazione composita.

**Perché è utile.** È lo stesso *principio* dei metodi avanzati (es. Orica AVM):
tiene conto della tua roccia e del tuo timing meglio di una formula generica.

**Il limite (dichiarato anche nell'app).** La nostra versione è **semplificata**:
assume che i fori contribuiscano in modo simile, e non è validata con misure di
controllo. È una **stima**, non una previsione certificata. Il metodo dei big è
molto più raffinato.

**Come si usa.** Importi il CSV del foro-firma; vedi il picco composito,
l'amplificazione e un grafico, con la nota di onestà.

---

## 3. Export del piano di innesco (XML in stile IREDES)

**Cosa fa.** Dal Progetto 2D esporti un file XML col piano (maglia, esplosivo,
innesco, sequenza, ritardi, e i fori con posizione/carica/ritardo), per passarlo
a detonatori elettronici o software di terzi.

**Il limite (dichiarato nel file).** È una **bozza di interscambio**, **non**
una conformità IREDES certificata. Va provata con lo strumento reale del cliente
prima di fidarsi.

**Come si usa.** Pulsante "Esporta piano di innesco (XML IREDES-like)". Per il
fochino resta il "piano di carico" in CSV.

---

## Quanto siamo distanti dai leader (senza girarci intorno)

- **Validazione sul campo**: loro calibrano i modelli su migliaia di volate
  reali. Noi non abbiamo ancora questo dato. È il divario più grande.
- **Hardware e integrazioni**: loro dialogano con perforatrici MWD e sistemi di
  detonatori elettronici reali. Il nostro export è una bozza, non un
  collegamento certificato.
- **Immagine/ML**: loro misurano la pezzatura reale da foto del cumulo con
  modelli addestrati. Noi no (richiede un backend e un dataset).
- **Persone e supporto**: loro hanno team dedicati e assistenza. Noi siamo
  all'inizio.

## Cosa Genesi NON fa ancora (rimandato di proposito, per sicurezza)

Il **burden reale per foro** e l'**import della deviazione dei fori**
(boretrack) toccano la geometria del fronte: un avviso di flyrock sbagliato
sarebbe **pericoloso per il fochino**. Non li spediamo finché non confermi tu
come va letta la geometria del fronte, meglio con un caso reale della tua cava.

## In una riga

Genesi ha fatto **primi passi utili** (riconciliazione, signature-hole
semplificato, export in bozza), ma resta **molto distante dai leader**: la
strada seria passa dalla **validazione sul campo** con dati reali della tua
cava. Nessuna scorciatoia.
