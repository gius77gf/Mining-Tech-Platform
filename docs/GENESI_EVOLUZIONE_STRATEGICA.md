# Genesi — come farlo evolvere in qualcosa di più (ricerca su richiesta del fondatore, 13/09)

_Per Giuseppe. Il fondatore ha chiesto direttamente in conversazione: "vorrei
capire come fare evolvere genesi in qualcosa di più". Questo documento
raccoglie **solo il mondo** (due ricerche, con fonti e livello di
attendibilità dichiarato) e poi il delta — letto da chi ha il codice in
mano — separato con chiarezza da ciò che è ricerca e ciò che è lettura._

⚠️ **Regola di questo repository, applicata qui**: niente entra in roadmap
sulla parola di un agente di ricerca. Ogni numero sotto è marcato "di
seconda mano" e, dove non c'è una seconda fonte indipendente, è dichiarato
"fonte isolata" — da non trattare come fatto solido. Le decisioni
commerciali (a chi rivolgersi, cosa costruire per primo) restano del
fondatore: qui si preparano, non si prendono.

---

## Parte 1 — Il mondo (due ricerche via WebSearch, nessun confronto col codice)

Le due ricerche complete, con tutte le fonti e le cautele, sono conservate
integralmente in:
- `docs/RICERCA_CONTINUA_GENESI.md` non le contiene (sono di natura diversa
  dalle ricerche tecniche lì raccolte) — restano qui sotto, riassunte ma
  fedeli, con ogni fonte citata.

### 1.1 — Il mercato delle piccole/medie cave (sottoservito o no?)

- **Prezzi dei concorrenti**: nessun prezzo pubblico confermato in modo
  indipendente per Orica SHOTPlus, Maptek BlastLogic, Maxam RIOBLAST,
  JKSimBlast. Solo O-Pitblast ha una cifra reperita (~6.320 $/anno), ma da
  **fonte isolata** (stesso rivenditore in due query separate) — da NON
  citare come prezzo di mercato certo. Confermata invece la **struttura**
  di questi prodotti: licenze enterprise, posti aggiuntivi a pagamento
  separato, manutenzione a parte, e per JKSimBlast una chiave elettronica
  (dongle) — tutti segnali di complessità/costo che vanno oltre una
  singola cifra.
- **Segnale più forte trovato**: nel 2026 **Orica** — il produttore leader
  del settore — ha lanciato un'iniziativa dichiarata esplicitamente per
  portare il proprio ecosistema digitale (BlastIQ, versioni di FRAGTrack
  più semplici) anche a "cave e miniere più piccole" in Nord America
  [fonte: geomechanics.io e im-mining.com, due testate indipendenti
  concordi]. Un leader di mercato non investe in un segmento che considera
  morto: è un indizio concreto, non una prova diretta, che il segmento
  piccolo è visto come un'area di crescita.
- **Quante sono le piccole cave**: in Europa circa 20.000-26.000 cave, in
  maggioranza PMI [fonti indipendenti concordanti: UEPG/Aggregates
  Business e Commissione Europea]. Negli USA il 41% delle aziende del
  settore estrattivo è a conduzione familiare [fonte: U.S. Small Business
  Administration]. Un dato più aggressivo circolato ("90% PMI nel
  settore aggregati") **non ha una fonte primaria verificabile** ed è
  stato scartato.
- **Alternative gratuite esistenti**: **nessuna trovata**, paragonabile a
  Genesi, per la progettazione di volate a cielo aperto. Solo un progetto
  universitario isolato (limitato alla sola frammentazione) e uno
  strumento gratuito del governo USA (NIOSH, "DRIFT") ma per un dominio
  diverso (gallerie sotterranee, non cave a cielo aperto). **Nella fascia
  gratuita e generale, Genesi non ha concorrenti diretti trovati.**
- **Cosa cercano i clienti piccoli**: nessuna discussione diretta di
  utenti reali trovata (Reddit/LinkedIn non hanno restituito nulla di
  utile). Ma il mercato risponde già a una domanda implicita: prodotti
  come "Smart Blasting Mobile" (offline, pensato per un "brillatore
  medio" non uno specialista) e BLADES di MineExcellence (esplicitamente
  "prima approssimazione, semplice, per operatori di cava") esistono
  apposta per chi trova gli strumenti enterprise troppo complessi.
- **Regioni in crescita digitale ma con barriera di costo**: confermato
  in generale per l'estrazione mineraria (Africa, Indonesia, India), MA
  **nessun programma trovato che nomini esplicitamente "blast design a
  basso costo"** come obiettivo — è un contesto favorevole, non una prova
  diretta di domanda per questo prodotto specifico.

### 1.2 — Dove sta andando il settore nei prossimi 2-3 anni

- **Automazione**: la fonte più solida (**McKinsey**) dice esplicitamente
  che perforazione e trasporto autonomi sono già "commercializzati su
  piena scala", mentre **volata e scavo automatizzati sono ancora "in
  fase di test"** — cioè il settore stesso non ha ancora risolto questo
  pezzo. Non c'è fretta di inseguire una "volata 100% automatica": nessuno
  ce l'ha ancora, davvero.
- **"Digital twin"** (ricostruzione 3D del fronte/cumulo da drone/LiDAR):
  tecnologia matura e diffusa fra i grandi (Strayos, 3GSM), ma i benefici
  numerici dichiarati (8% di energia risparmiata, ecc.) vengono **tutti**
  dai produttori stessi, mai da uno studio indipendente. Genesi ha già un
  piede in questo mondo (l'editor del fronte 3D), ma qualunque sviluppo
  qui rientra nell'area della geometria del fronte — quella su cui ti ho
  già scritto una segnalazione a parte che aspetta una tua risposta.
- **Dati dalla perforatrice in tempo reale (MWD)**: la raccolta dati è
  matura sulle perforatrici di fascia alta (Epiroc, Sandvik), ma il
  collegamento automatico "durezza rilevata → carica di quel foro" è
  offerto solo da un produttore enterprise (Maptek) e richiede hardware
  specifico sulla perforatrice — **fuori portata per un'app che gira nel
  browser senza hardware collegato**.
- **Progettazione automatica del pattern (fori + carica + tempi)**: qui
  c'è la scoperta più concreta. **Maptek vende già oggi** un modulo
  (BlastMCF) che, dato un obiettivo, genera *da solo* la maglia dei fori,
  la carica e i tempi di innesco con un algoritmo genetico — non
  intelligenza artificiale complicata, un'ottimizzazione classica.
  **Non è ricerca accademica: è già un prodotto in vendita.** E un
  algoritmo genetico è leggero abbastanza da girare nel browser, senza
  server.
- **Impronta di CO2 per singola volata**: qui il mercato ha un vero buco.
  I tre grandi produttori di esplosivo (Orica, Maxam, Enaex) stanno
  investendo forte nella decarbonizzazione **delle loro fabbriche**, e il
  tema ESG/sostenibilità è in forte crescita nel settore — ma **nessuno
  strumento trovato calcola l'impronta di carbonio di una singola volata**
  in cava (kg di esplosivo consumato → CO2 equivalente). Genesi i chili
  di esplosivo per volata li ha già.
- **Condivisione dati fra cave per migliorare le previsioni insieme**:
  terreno quasi del tutto vergine — esistono solo standard tecnici di
  formato (non di condivisione volontaria) e piccoli dataset accademici.
  Un'idea interessante ma che richiederebbe un server condiviso, cosa che
  Genesi oggi non ha.

---

## Parte 2 — Il delta (letto da chi ha il codice in mano, non deciso qui)

Due direzioni sono emerse con più forza delle altre, e sono di natura
diversa — una è "a chi lo vendiamo", l'altra è "cosa costruiamo dopo":

**A. Posizionamento**: Genesi potrebbe smettere di misurarsi solo contro
"i grandi" e puntare esplicitamente alle cave piccole/medie che oggi non
si possono permettere o non vogliono la complessità di uno SHOTPlus o un
BlastLogic — un segmento reale (decine di migliaia di cave in Europa e
USA, in maggioranza a conduzione familiare) dove anche il leader di
mercato sta investendo ora. Questa è una decisione commerciale, non
tecnica: cambia come si presenta l'app, forse il tono dei testi, non il
motore fisico.

**B. Due candidati tecnici concreti, diversi per rischio**:
1. **Impronta di CO2 per volata** — rischio basso, dato già in mano
   (kg di esplosivo), nessuna soglia di sicurezza toccata, nessuna novità
   sul motore fisico. Il tipo di funzione che si può costruire e
   verificare in un'unità piccola.
2. **Progettazione automatica del pattern per un obiettivo** (es. "minimizza
   la carica mantenendo questa pezzatura") — tecnicamente alla portata di
   un'app browser (ottimizzazione classica, non serve un server), ma è un
   cantiere serio: tocca la geometria della maglia, quindi — per la stessa
   prudenza della segnalazione di sicurezza già aperta — andrebbe iniziato
   solo con un tuo via libera esplicito, non deciso da un ciclo automatico.

**Non conviene inseguire ora**: l'integrazione con l'hardware delle
perforatrici (serve hardware reale, fuori portata di un'app browser) e la
condivisione dati fra cave (serve un server condiviso, che Genesi non ha).

## Decisione che serve dal fondatore

Nessuna, per ora — questo documento è la ricerca che avevi chiesto. Se
vuoi procedere su una delle due direzioni tecniche (A o B), dimmelo e la
registro come si fa sempre in `docs/DECISIONI_WEEKEND.md` prima di
costruire qualcosa.
