# Sentinella — vibrazioni da volata: cosa può fare (roadmap onesta)

Documento per Giuseppe. Sintesi di una ricerca sugli standard aperti del
monitoraggio vibrazioni da volata (blast vibration monitoring) e su cosa
Sentinella può adottare NEL BROWSER, senza hardware, in modo ONESTO.

## Il punto più importante (onestà)
C'è una linea netta che Sentinella **non può superare senza strumenti**:
- **PREVEDERE e DOCUMENTARE** un valore atteso (con formule e limiti pubblici) →
  **si può fare nel browser**, con i dati inseriti a mano.
- **MISURARE** il PPV, la frequenza e l'airblast REALI di una volata →
  **richiede un sismografo/microfono calibrato**. Non è possibile nel browser.

Quindi ogni numero che Sentinella produce va etichettato **"PREVISTO/STIMA"**, mai
"misura". Presentarlo come misura sarebbe la stessa gonfiatura che vogliamo evitare.
Questo è il messaggio da mettere in chiaro nell'app.

## Cosa è pubblico e implementabile (formule + tabelle di lookup)

### Limiti di vibrazione (dipendono dalla FREQUENZA)
Tutti gli standard alzano il limite di velocità man mano che la frequenza sale
(le basse frequenze sono più dannose: risonanza con l'edificio). Sono numeri
pubblici, implementabili come lookup selezionabile:
- **DIN 4150-3** (Germania, il riferimento europeo/italiano di fatto): valori
  guida per banda di frequenza e tipo di edificio (industriale / residenziale /
  sensibile-storico).
- **USBM RI 8507** e **curva a Z OSMRE**: limiti frequency-based per case
  residenziali (intonaco/cartongesso).
- **Tabella OSMRE PPV-vs-distanza** (per chi non ha il sismografo).
- **BS 7385-2** (UK).
- **UNI 9916** (Italia): è una norma di METODO, rimanda ai valori DIN 4150-3.

**Verità italiana importante:** NON esiste un limite numerico nazionale unico di
PPV per le cave. DPR 128/1959 e D.Lgs. 624/1996 disciplinano sicurezza/esplosivi
ma **non fissano una soglia**: il limite lo impone caso per caso l'autorità
(Regione/Provincia) nelle prescrizioni, di solito richiamando UNI 9916/DIN 4150-3.
→ Le soglie in Sentinella devono restare **parametriche/configurabili**, non
"valore di legge italiano" (che non esiste).

### Predizione del PPV (già in parte in Sentinella)
Legge di attenuazione pubblica: **PPV = K · (SD)^-β**, con SD = R/√W (distanza
scalata, già presente). β tipico ≈ **1,6**; K dipende dal terreno (roccia dura →
basso, terreni sciolti → alto). I valori VERI di K/β si ricavano solo con
regressione su dati MISURATI (sismografo): senza, si usano valori conservativi di
letteratura → il risultato è una **previsione cautelativa**, non una taratura del
sito.

### Carica massima per ritardo (già in Sentinella: caricaMax)
Inversione: **W = (D/Ds)²** o inversione della legge di attenuazione per
rispettare una soglia scelta a una distanza data. Progettazione conservativa.

### Airblast (sovrappressione d'aria)
dB lineari con distanza scalata a radice cubica R/W^(1/3); limiti pubblici (USBM
RI 8485 = 133 dB; OSMRE per risposta in frequenza). Predizione, non misura.

### Frequenza dominante — il confine hardware
Il limite ammissibile dipende dalla frequenza dominante, che **si misura solo con
un sismografo** (forma d'onda campionata → zero-crossing o FFT). Senza:
- approccio ONESTO e corretto → usare il **ramo più cautelativo** della curva
  (come se fosse bassa frequenza), con avviso "frequenza non misurata → limite
  conservativo applicato". È esattamente ciò che le norme prevedono in assenza di
  misura.

## Cosa può adottare Sentinella SUBITO (ordinato, onesto)
Legenda: ✅ previsione/lookup (fattibile in browser, è STIMA) · ⛔ misura (serve hardware).
1. ✅ **Libreria soglie normative** selezionabile (DIN 4150-3 / USBM / OSMRE / BS
   7385), soglie **configurabili** (Italia = prescrizione locale). Alta fattibilità.
2. ✅ **Predittore PPV** con K/β configurabili (default conservativi), output
   marcato "PPV PREVISTO (stima conservativa)".
3. ✅ **Carica max per ritardo** per rispettare una soglia a distanza data.
4. ✅ **Frequenza non misurata → limite conservativo automatico**, con avviso.
5. ✅ **Predittore airblast** in dB (scaled distance cubica) vs 133 dB.
6. ✅ **Report di conformità PDF/stampa** dal brogliaccio volate: evento,
   distanza, carica/ritardo (MIC), SD, PPV previsto, limite citato, esito/margine,
   ogni valore etichettato PREVISTO/MISURATO. Alto valore commerciale.
7. ✅ **Registro storico** eventi con esito per ricettore/vicino (già in parte).
8. ⛔ **Misura reale** di PPV/frequenza/airblast → hardware. Evoluzione futura
   possibile: IMPORT di file da sismografi terzi (CSV) per elaborare misure
   ALTRUI (resta "elaborazione", non misura propria).

**Disclaimer da mettere nell'app:** «Sentinella prevede e documenta le vibrazioni
sulla base di formule e limiti normativi pubblici. Non è uno strumento di misura:
PPV, frequenza e airblast sono stime conservative, non misure certificate. Per una
misura di conformità reale serve un sismografo calibrato.»

## Cosa serve alla decisione del fondatore
Molte di queste (1–7) sono fattibili e ad alto valore, ma vanno fatte con
attenzione e nel tuo stile; le soglie normative vanno **verificate sui testi
ufficiali** prima di inserirle (DIN 4150-3 e BS 7385 sono a pagamento: si possono
implementare i VALORI numerici come lookup, non il testo della norma). Dimmi da
quale partire; la n.6 (report di conformità) è probabilmente quella a più alto
valore commerciale.

---
### Fonti (verificare i numeri esatti sui testi ufficiali prima di hard-codare le soglie)
- USBM RI 8507 / limiti: https://explosives.org/vibration-basics/limits/ · https://tbredblast.com/posts/blastvibration7
- OSMRE 30 CFR 816.67: https://www.law.cornell.edu/cfr/text/30/816.67 · https://www.ecfr.gov/current/title-30/chapter-VII/subchapter-K/part-816/section-816.67
- Airblast RI 8485 (133 dB): https://files.dep.state.pa.us/Mining/BureauOfMiningPrograms/BMPPortalFiles/Blasting_Research_Papers/2011WVDEP%20%20Airblast%20Research%20Final.pdf
- DIN 4150-3: https://micromega-dynamics.com/din-4150-3-vibration-limits-buildings/ · https://profound.nl/din-4150-3-explained-what-do-the-limit-values-mean-in-practice/
- BS 7385-2: https://www.sensorbee.com/guides/construction-vibration-monitoring-ppv-bs7385
- UNI 9916: https://ediliziainrete.it/norme/uni-9916
- Attenuazione/Devine: https://www.sciencedirect.com/science/article/pii/S1674775518302476
- Italia cave (nessuna soglia nazionale): https://www.gazzettaufficiale.it/eli/id/1959/04/11/059U0128/sg · https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/polizia-mineraria
