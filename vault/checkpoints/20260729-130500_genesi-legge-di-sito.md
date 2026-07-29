# Checkpoint — 29/07/2026 13:05 UTC

## Task completato
**Genesi G3 — la legge di sito K/β dai referti del sismografo.**
Commit `f388a3f`, spinto sul branch `claude/scheduled-tasks-remote-control-bk4ap6`.

Prima: la vibrazione al recettore si stimava con K e β presi dalla litologia
— valori da manuale, identici per tutte le cave sulla stessa roccia.
Adesso: chi ha un sismografo inserisce i referti (distanza, carica per
ritardo, PPV misurata) e Genesi ricava la legge della **sua** roccia.

Cosa è entrato:
- **Regressione** ai minimi quadrati sulla forma logaritmica di Devine
  (`ln PPV = ln K − β·ln SD`), con R², numero di referti e intervallo di
  distanza scalata effettivamente calibrato.
- **Riga di progetto al 95° percentile** (media + 1,645 × scarto dei
  residui), non la media: sulla media metà delle volate finirebbe sopra.
  Coerente con la stima da litologia, che è anch'essa cautelativa.
- **Rifiuti espliciti** quando una retta onesta non esce: meno di 3 referti,
  tutti alla stessa distanza scalata (pendenza indeterminata), pendenza
  fuori da 0,5–3 (referti di siti diversi mescolati, o carica totale al
  posto della carica per ritardo). Sotto gli 8 referti la legge è
  dichiarata **provvisoria**.
- **Avviso di estrapolazione**: se la volata in corso ha una distanza
  scalata fuori dall'intervallo calibrato, la scheda validatori lo dice.
- **Diagramma bilogaritmico** SD-PPV con i referti, la retta media
  tratteggiata, quella di progetto piena, il limite di norma e la posizione
  della volata in corso. Su telefono riquadro più stretto e alto, così le
  scritte restano leggibili.
- **Import CSV** dei referti con scelta delle colonne (i sismografi
  esportano formati tutti diversi), separatore `;`/tab, decimali con la
  virgola, intestazione riconosciuta, doppioni e righe vuote scartati.
- **Interruttore** «usa questa legge nei calcoli»: senza di esso non cambia
  niente, si resta sulla stima da litologia. La scheda validatori dichiara
  sempre da dove vengono K e β.

## Verifiche fatte
- **18 prove sulla regressione** (`node`, estraendo `sitoFit` dal file):
  ritrova K=1000 e β=1,6 su dati sintetici perfetti con R²=1; K95=K senza
  dispersione; con dispersione reale K95>K e nessun referto sopra la riga
  di progetto mentre 4 su 8 stanno sopra la media; i tre casi di rifiuto
  scattano tutti. **Tutte passate.**
- **Giro completo nel browser headless** (Chromium): inserimento a mano,
  attivazione della legge, PPV del progetto che passa da `K≈1906/β≈1,55
  (Calcare, da manuale)` a `K≈660/β≈1,56 (dai tuoi 4 referti)` con
  l'avviso di estrapolazione, cancellazione dei referti e ritorno alla
  litologia. Nessun errore di pagina.
- **Import CSV** provato con intestazione, decimali a virgola, un doppione
  e una riga vuota: «4 referti importati · 1 doppione scartato · 1 riga non
  valida».
- **Screenshot a 1280 e 390 px**, guardati e corretti in tre passaggi: la β
  del titolo diventava «B» per il maiuscolo, le etichette del grafico si
  sovrapponevano, le tacche dell'asse X erano quasi assenti su intervalli
  stretti, le rette uscivano dal riquadro, il modulo a 4 colonne era
  inusabile sul telefono.
- Sintassi JS dello script inline: `node --check`, pulita.

## Vincoli rispettati
- Soglie USBM/DIN **non toccate** (`ppvLimit` invariata): la calibrazione
  agisce solo su K e β, ed è opt-in dell'utente.
- Nessun riferimento ai dati di esempio del fondatore.
- Nessuna libreria esterna: grafico in SVG scritto a mano, parser CSV
  scritto a mano.

## Stato dei cantieri in parallelo (Blocco 2)
Sei agenti aperti, uno per app, sui file separati `apps/<nome>/`:
Scudo (S2 near-miss, S3 ispezioni), Conti (N1–N5 listino/IVA/DDT/fattura
differita/canoni), Terra (R4 riepilogo annuale, R5 scavo-vs-cumulo),
Campo (C1–C3 squadre/obiettivo di turno/storico), Flotta (L2 giro macchina,
L1 fascicolo, L3 piani ricorrenti, L4 carburante), Sentinella (T1 import
CSV, T2 ricettori, T3 report conformità, T4 reclami).
Al rientro di ognuno: verifica degli screenshot, commit per app.

## Prossimo passo atomico
**Raccogliere i sei cantieri Blocco 2 man mano che rientrano**: per ciascuno
guardare gli screenshot prodotti, rifare la prova funzionale dichiarata,
committare l'app e spuntare la voce in ROADMAP_SETTIMANA.md.
Nel frattempo, sul fronte Genesi (nessun agente sopra, file libero):
**G5 — mappa dell'energia (powder factor locale foro per foro)**, che chiude
la serie «Genesi dice quanto, non dice dove» insieme a G1 isocrone e G2
relief già in opera. Poi **G4 — editor visuale della sequenza di sparo**.
Resta aperto il buco dati su Conti: la `dataIncasso` vera sulle fatture
(oggi ripiegata sulla data di emissione) e il grafico emesso-contro-incassato.
