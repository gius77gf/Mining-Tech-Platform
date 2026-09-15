# Ricerca Continua — Terra (gestione cava)

**Data creazione**: 2026-09-15T09:41:28Z

**Tema**: Meccanismo di riconciliazione piano-vs-reale e proiezione di esaurimento autorizzazione.

---

## Ricerca sul mondo (mine planning software)

**Fonti consultate**:
- [Datamine Mine Planning & Reconciliation](https://dataminesoftware.com/solutions/planning/)
- [K-MINE Mining Software](https://k-mine.com/mining-software/)
- [Best Mining Production Reconciliation Software 2026](https://fleetrabbit.com/industry/mining-fleet-software/best-mining-production-reconciliation-software-2026)

### Che cosa sa fare il software professionale

1. **Schedule Variance (scarti piano-vs-reale)**: Datamine e K-MINE calcolano la differenza fra il programma di produzione pianificato e ciò che è stato realmente estratto, misurata in volumi o giorni [proposto da ricerca, non verificato]. Permette di capire se la cava è "in anticipo" o "in ritardo" rispetto al piano.

2. **Dual-constraint depletion forecast**: Confrontano il TEMPO residuo dell'autorizzazione (giorni fino alla data di scadenza) con la CAPACITÀ residua (volume concesso - estratto) e il ritmo attuale, per identificare quale vincolo "arriva per primo" (esaurimento volume prima della scadenza, o scadenza prima dell'esaurimento) [proposto da ricerca, non verificato].

3. **Production forecasting con cambio di ritmo**: I software moderni (Deswik.Sched, IFS Cloud) calcolano il ritmo corrente su finestre temporali diverse (ultimi 30 giorni, ultimi 3 mesi, ultimi 12 mesi) per rilevare accelerazioni o decelerazioni significative e re-proiettare il consumo [proposto da ricerca, non verificato].

4. **Reconciliation fra survey reale e piano geometrico**: La riconciliazione combina dati di produzione, survey topografico/drone e piano di coltivazione per evidenziare gap fra volumi previsti per lotto e volumi realmente misurati per fronte [proposto da ricerca, non verificato].

---

## Verifica nel codice di Terra

**Lettura file**: `apps/terra/terra-data.js` (83 funzioni) + `apps/terra/index.html`.

### Che cosa ESISTE

✅ **Proiezione annuale**: `proiezioneAnnua()` (riga 655) calcola il consumo stimato di fine anno e lo confronta col piano annuo, con stato "danger" / "warn" / "ok".

✅ **Residuo vita cava**: `vitaCava()` (riga 1074) calcola volume residuo, percentuale consumata, giorni residui al ritmo medio e confronta se la scadenza dell'atto arriva prima o dopo l'esaurimento del volume.

✅ **Ritmo medio annuo**: `ritmoMedioAnnuo()` (riga 1041) calcola il ritmo medio storico su finestra dichiarata (campo `anniRitmo` dell'atto).

✅ **Conformità progetto**: `conformitaProgetto()` confronta fronti con lotti e rileva fronti assegnati a più lotti.

✅ **Volumi per mese**: `volumiPerMese()` (riga 861) compila storico dei volumi elaborati per mese.

### Che cosa POTREBBE MANCARE

#### 1. Schedule variance mensile — non trovato

**Ricerca nel codice**:
```bash
grep -i "varianza\|variance\|scarto.*piano\|anticipato\|ritardato\|avanti.*mese\|indietro.*mese" apps/terra/terra-data.js
# Risultato: 0 match su questi termini nella forma di una metrica calcolata
```

**Schermata**: Quadro / Pianificazione (oppure sezione dedicata "Analisi ritmo").

**Che cosa non va**: Il grafico `volumiPerMese()` mostra i volumi reali per mese, ma non calcolato il confronto fra "volume pianificato del mese" (= pianificatoAnnuoM3 / 12) e "volume reale del mese". Una cava che estrae 150 k/mese quando il piano è 125 k/mese non vede il dato "avanti di 25 k" né la proiezione "al ritmo attuale finiremo a maggio invece di dicembre".

**Come si vede**: Una riga aggiuntiva nel grafico `volumiPerMese`, o una metrica nel KPI: "Avanzamento sul ritmo mensile: +18% (25 k m³ in più di quanto pianificato)".

**Quanto costa**: Stima 3-4 ore (una funzione `varianzaMensile()` che legge `volumiPerMese` + `pianificatoAnnuoM3`, e una riga di visualizzazione nel Quadro).

**Come si misura**: Un test che verifica: 
- Cava che estrae 150 k/mese vs piano 125 k → varianza +25 k (positiva = in anticipo)
- Dopo 6 mesi di estrazione al ritmo +25 k/mese, la proiezione di fine anno scende di 6 mesi

---

#### 2. Proiezione sulla SCADENZA DELL'AUTORIZZAZIONE (non disponibile in forma quantitativa)

**Ricerca nel codice**:
```bash
grep -n "annoEsaurimento\|scadePrimaIlTitolo\|dataScadenza.*giorni" apps/terra/terra-data.js
# Risultato: riga 1114 in vitaCava: scadePrimaIlTitolo (booleano), annoEsaurimento (anno stimato)
```

**Schermata**: Contatore vita cava / Titolo.

**Che cosa non va**: `vitaCava()` calcola `annoEsaurimento` (anno in cui finisce il volume al ritmo medio) e `scadePrimaIlTitolo` (booleano: vero se l'atto scade prima), ma non comunica in giorni o mesi **QUANTO MARGINE RESTA fra i due vincoli**. Una cava con scadenza 2029-12-31 e esaurimento stimato 2029-07-15 dovrebbe mostrare "margine residuo: ~6 mesi" (199 giorni). La visualizzazione sulla pagina (riga 2009-2011 in index.html) dice solo quale "arriva per primo", non il margine quantitativo.

**Come si vede**: Nel riquadro vita cava, una riga aggiuntiva: "Margine fra esaurimento e scadenza: **199 giorni** (prioritario: scade il titolo prima che finisca il volume)".

**Quanto costa**: Stima 2-3 ore (calcolare giorni fra annoEsaurimento e dataScadenza; visualizzare nel riquadro vita cava).

**Come si misura**: Un test con atto che scade 2029-12-31, ritmo 100 k/anno, residuo 700 k → annoEsaurimento = 2029-07, margine = ~200 giorni.

---

#### 3. Metrica di accelerazione/decelerazione del ritmo — non trovata

**Ricerca nel codice**:
```bash
grep -n "ultimi.*giorni\|ultimi.*mesi\|trend\|accelera\|decelera\|volatilita" apps/terra/terra-data.js | head -10
# Risultato: riga 1064 in ritmoMedioAnnuo: legge rilievi da finestra dichiarata (anniRitmo), ma nessun confronto fra ritmiBrevi vs ritmiLunghi
```

**Schermata**: Quadro / KPI ritmo oppure sezione "Trend".

**Che cosa non va**: `ritmoMedioAnnuo()` calcola un singolo valore di ritmo medio (es. 125 k/anno ultimi 3 anni), ma non comunica se il ritmo è **stabile** oppure **in accelerazione/decelerazione**. Una cava che negli ultimi 3 mesi ha estratto 150 k (ritmo 600 k/anno) mentre la media storica è 125 k/anno (cambio +48%) dovrebbe ricevere un avviso (es. badge "warn") o una riga esplicita: "Ritmo recente (+48% vs media) — la proiezione di fine anno è rivista verso il basso".

**Come si vede**: Nel Quadro, una riga: "Ritmo ultimi 90 giorni: 150 k/anno (+48% vs media 3 anni). Proiezione rivista: esaurimento stimato 2028 Q3 (era Q2)".

**Quanto costa**: Stima 4-6 ore (calcolare ritmo su finestre multiple — 90 giorni, 180 giorni, 12 mesi — e confrontare; visualizzare trend; rivedereletiche proiezioni se significativo).

**Come si misura**: Test con cava da 125 k/anno media storica, ultimi 3 mesi 150 k/anno → `ritmoDeltaPercent` = +48 / Uscire "warn" se delta > 30%. Verificare che proiezione di fine anno si aggiorna di conseguenza.

---

## Conclusione

Terra ha i FONDAMENTALI della riconciliazione (vita cava, proiezione annuale, confronto con scadenza del titolo). Non ha le **metriche comparative** che permettono al direttore di cava di capire rapidamente se è "in anticipo" o "in ritardo" rispetto al piano mensile, se il ritmo sta cambiando, e di quanto il margine fra autorizzazione e esaurimento si sta riducendo.

Queste tre lacune non sono critiche per il funzionamento base, ma sono i "numeri da guardare ogni mattina" in una cavazione professionale: permettono al direttore di capire se correggere il ritmo di estrazione prima che sia troppo tardi.

