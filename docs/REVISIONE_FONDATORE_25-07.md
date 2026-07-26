# Revisione del fondatore — 25/07/2026 (piano di lavoro)

Revisione completa del lavoro 19–24/07 fatta da Giuseppe sull'anteprima
della PR #321. Questo documento traduce ogni sua osservazione in unità di
lavoro tracciabili. Verdetto sintetico del fondatore:

> "L'ecosistema sta crescendo, l'estetica è decisamente migliorata, ma siamo
> lontani dall'obiettivo. Genesi è la più avanzata ma ancora primordiale. Le
> altre app sembrano la fotocopia l'una dell'altra: non trasmettono ancora
> valore aggiunto."

---

## ⛔ REGOLA FERREA (priorità zero — già applicata)

I dati che il fondatore fornì all'inizio erano **solo orientativi** (servivano
a spiegare i video che mostrava). **Non devono comparire da nessuna parte**:
archivio dei 190 video, 6/23 volate misurate, maglia 4,5×3,5, Nonel 25 ms,
15–20 fori, calcare come "dominio di validità". Si possono usare internamente
per i calcoli, **mai mostrare né citare**. Regola immutabile, non va più
ripetuta → scritta in `CLAUDE.md`.

- [x] Rimosse tutte le citazioni dall'interfaccia, dal titolo, dal manifest
      PWA, dall'export del piano e dai file di calibrazione/documentazione.

---

## GENESI (priorità assoluta)

### G1 — Home: da vetrina spoglia a cuore dell'app
Oggi mostra due sole voci. Deve diventare il centro di comando con accesso a
tutte le funzioni:
- **storico delle volate** create (elenco, apertura, duplicazione);
- **import volate da Deepwork** con collegamento vivo nei due sensi (inviare
  un progetto di volata da Genesi a Deepwork e viceversa);
- **riquadro immagini drone / nuvole di punti** con lo storico di tutte le
  lavorazioni fatte;
- accesso diretto a ogni funzionalità (oggi sono nascoste dentro le schermate).
- Obiettivo dichiarato: livello **Paradigm**. Stato attuale giudicato
  "spoglio, poco professionale, poco attraente".

### G2 — Schermata 2D (ex "Progetto")
- [x] **Via i dati di riferimento** (regola ferrea).
- [x] Rinominare la voce di menu **"Progetto" → "2D"**.
- [ ] Rinominare la sezione **"Geometria maglia" → "Geometria volata"**.
- [ ] **Carica e sequenza**: si deve poter inserire il **quantitativo totale
      di esplosivo previsto per la volata**; l'app lo distribuisce da sola sui
      fori e ricalcola gli altri dati di conseguenza.
- [ ] **Indice esplosivi**: eliminare la sezione autonoma. La scelta
      dell'esplosivo va **dentro la progettazione** (2D e possibilmente anche
      3D), mostrando **solo la dicitura** dell'esplosivo. L'approfondimento
      compare **solo su richiesta**, in un riquadro dedicato.

### G3 — Scheda volata: compattezza e professionalità
- [ ] I riquadri in basso: **lasciare nome e valore numerico**, togliere la
      descrizione sotto; la spiegazione compare **al clic** (approfondimento
      per chi non conosce il termine). Deve risultare più compatta e
      professionale.
- "Carattere energetico" e "rapporto di rigidità": restano come sono per ora.
- Il resto delle voci in basso resta, si rivede più avanti.

### G4 — Schermata 3D (ex "Simulazione") — funzionamento
- [x] Rinominare la voce di menu **"Simulazione" → "3D"**.
- [ ] Aprendo il 3D **direttamente** si deve partire da un **fronte vergine da
      disegnare** e da **parametri standard non precompilati**. La volata già
      impostata compare **solo** arrivando da "Simula questa volata" nel 2D.
- [ ] Il pannello di sinistra va rifatto come **strumento di programmazione**:
      i dati si aggiornano mano a mano che si inseriscono, i parametri si
      ricalcolano di conseguenza.
- [ ] **Inclinazione**: oggi inclina l'intero fronte; deve inclinare **il foro**.
- [ ] **Trasparenza del fronte**: oggi non produce alcun effetto; deve mostrare
      i **singoli fori**, con possibilità di **interagire con ciascuno**.

### G5 — Schermata 3D — estetica (giudizio severo: "da rifare")
- [ ] Il **blocco che sta per saltare** è disegnato diversamente dal resto del
      fronte: deve essere **identico** e separarsi solo dopo lo sparo.
- [ ] Il **suolo** sotto il fronte ha una colorazione "maculata" che disegna in
      anticipo l'area delle proiezioni: da eliminare.
- [ ] Il fronte appare **staccato** dal resto, con difetti visibili.
- [ ] Aggiungendo file, ogni fila diventa un blocco squadrato: sembra
      "pietre messe lì per saltare", non un fronte di cava reale.
- [ ] Serve **ricerca vera** sul rendering di roccia/fronte e un rifacimento,
      non ritocchi: è la richiesta ripetuta da settimane ("il salto di
      qualità").

### G6 — Login
Va bene così per ora; cercare alternative migliori, ma **bassa priorità**.

---

## LE APP VERTICALI — problema comune

Giudizio: "sembrano la fotocopia l'una dell'altra; cambiano le voci ma non il
valore". Direzione richiesta:
1. **Personalizzare ogni app** su ciò che le altre non hanno, in modo che
   ognuna abbia una ragione d'acquisto propria.
2. **Copiare al 100 % l'estetica di Deepwork** (giudicata "anni luce avanti")
   e personalizzare **solo i colori** per app (es. Terra in verde), così
   ognuna è riconoscibile.

### SCUDO — deve giustificare la propria esistenza
- [ ] Anagrafiche vere: **tutti i dipendenti** e **tutti i cantieri**.
- [ ] **Ricerca sulla legge italiana** in materia di sicurezza sul lavoro:
      cosa è obbligatorio, quali documenti, quali scadenze.
- [ ] **Documenti fisici allegabili**: es. il **POS collegato al cantiere**;
      foto/scansioni delle firme dei dipendenti per la **consegna DPI** e
      altra documentazione.

### CAMPO
- [ ] Oggi estende funzioni che Deepwork già svolge → nessun valore aggiunto.
      Servono **funzioni specifiche e più approfondite** che giustifichino
      l'acquisto. Fare ricerca su come arricchirla.

### FLOTTA / CONTI / SENTINELLA / TERRA
- [ ] Stessa richiesta: funzionalità che valga la pena comprare, forte
      personalizzazione, differenziazione reale tra le app.

---

## Ordine di lavoro proposto

1. ✅ Regola ferrea applicata ovunque (fatto per primo).
2. Rinomine e pulizie a basso rischio del 2D/3D (menu, "Geometria volata").
3. Scheda volata compatta (descrizioni al clic) — miglioria estetica immediata.
4. Esplosivo dentro la progettazione + approfondimento su richiesta.
5. Carica per quantitativo totale.
6. 3D: avvio da fronte vergine + pannello di programmazione.
7. 3D: inclinazione del foro, trasparenza con fori interattivi.
8. Ricerca + rifacimento estetico del fronte e del terreno.
9. Home di Genesi come centro di comando (storico, ponte Deepwork, drone).
10. App verticali: estetica Deepwork + differenziazione, una app per volta,
    partendo da Scudo (che ha la richiesta più concreta).
