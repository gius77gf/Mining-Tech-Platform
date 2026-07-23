# Genesi — fondamento scientifico dei modelli (bozza di lavoro, 23/07/2026)

Richiesta esplicita del fondatore (23/07): tracciare OGNI modello di Genesi alla sua
letteratura scientifica primaria — formula pubblicata, limiti di validità, critiche,
sviluppi moderni — e derivarne correzioni concrete.

**STATO ONESTO DI QUESTO DOCUMENTO**: la raccolta delle fonti è stata fatta con una
ricerca strutturata (23/07 sera), ma la fase di **verifica incrociata automatica è
fallita per limite tecnico della sessione** (non per problemi nelle fonti). Quindi:
ogni affermazione qui sotto è marcata **[NV]** = *non ancora verificata contro la
fonte primaria*. I prossimi cicli devono: (1) verificare i claim [NV] aprendo le
fonti; (2) confrontare le formule con il codice reale di `genesi.html`. NON usare
questo documento come fonte certa finché le etichette [NV] non vengono sciolte.

---

## 1. Frammentazione — Kuz-Ram (Kuznetsov + Cunningham + Lilly)

**Fonti primarie da acquisire**: Kuznetsov (1973); Cunningham (1983, 1987, 2005 —
"The Kuz-Ram fragmentation model – 20 years on"); Lilly (1986, blastability index).

**Cosa dice la letteratura (raccolto, da verificare):**
- **[NV]** Il prefattore 0,06 del rock factor (A = 0,06·(RMD+JF+RDI+HF)) è
  **sito-dipendente**: alla miniera di rame di Sungun gli autori hanno dovuto
  sostituirlo con **0,073 (+22% circa)** per far combaciare l'x50 misurato — prova
  diretta che un Kuz-Ram non calibrato può essere sistematicamente sbagliato del
  ~20% o più. *(Gheibie et al., "Modified Kuz-Ram fragmentation model and its use
  at the Sungun Copper Mine")*
- **[NV]** L'indice di uniformità **n di Cunningham calcolato dalla sola geometria**
  (burden, spacing, diametro, lunghezza carica, precisione di perforazione) è
  **insufficiente**: serve una correzione per le proprietà dell'ammasso roccioso
  (Blastability Index). *(stessa fonte)*

**Implicazione per Genesi**: prevedere un **fattore di calibrazione di sito**
sull'x50 — e Genesi ha già lo strumento perfetto per stimarlo: la
**riconciliazione previsto-vs-reale** (l'x50 misurato sul muckpile può correggere
il prefattore, esattamente l'approccio Sungun). Da proporre al fondatore come
evoluzione naturale (il motore fisico non si tocca senza suo via libera).

## 2. Granulometria — Swebrec / KCO (Ouchterlony)

**Fonte primaria**: Ouchterlony (2005), "The Swebrec function…", *Mining
Technology*, DOI 10.1179/037178405X44539.

- **[NV]** La funzione Swebrec è una distribuzione a **3 parametri (x50, xmax, b)**
  introdotta proprio in quel paper, come forma unica per frammentazione da volata E
  da frantumazione — la nostra implementazione KCO traccia a questa fonte.
- **[NV]** **Range di validità dichiarato**: fit su centinaia di curve
  granulometriche VAGLIATE con r² > 0,995 su un range di **2–3 ordini di grandezza**
  di dimensione. → La forma base è validata su ~2–3 decadi, NON illimitatamente
  nei fini: questo è il range da mostrare all'utente.
- **[NV]** Ouchterlony dichiara esplicitamente che inserire la Swebrec nel Kuz-Ram
  (= modello KCO) **rimuove due difetti noti del Kuz-Ram**: la cattiva predizione
  dei fini e l'assenza di un taglio superiore. → è la base primaria della scelta
  già fatta in Genesi (KCO oltre a Kuz-Ram): scelta CONFERMATA dalla letteratura.

## 3. Incertezza intrinseca — xP-frag (Sanchidrián & Ouchterlony)

**Fonte primaria**: Sanchidrián & Ouchterlony (2017), *Rock Mechanics and Rock
Engineering*, DOI 10.1007/s00603-016-1131-9.

- **[NV]** xP-frag predice **direttamente i percentili** (dal 5° al 100°) senza
  assumere alcuna distribuzione; calibrato con regressioni su **169 volate reali**
  con curve granulometriche da **vagliatura** (non da foto).
- **[NV]** Errore atteso di xP-frag: **< 25% a qualunque percentile**, cioè da metà
  a un terzo dell'errore dei migliori modelli preesistenti → i modelli tipo
  Kuz-Ram/KCO hanno errori attesi dell'ordine del **50–75%**.
- **[NV]** Il modello incorpora l'effetto del **ritardo tra fori** (timing) sulla
  frammentazione.

**Implicazione per Genesi (onestà, priorità alta)**: dichiarare all'utente la
**banda d'incertezza** delle previsioni di frammentazione (ordine ±50% senza
calibrazione di sito). È coerente con la filosofia "stima onesta, non misura" e ci
distingue dai venditori di certezze. xP-frag stesso è un candidato "modello v2"
(pesante: da valutare col fondatore).

## 4. Vibrazioni — distanza scalata e limiti USBM

**Fonti primarie da acquisire**: Siskind et al. (1980), USBM **RI 8507**; Devine
(1966); Oriard (1970); per l'airblast Siskind et al., USBM **RI 8485**.

- **[NV]** Forma standard: **PPV = K·(D/√W)^m** con K e m **fortemente
  sito-specifici**: per pendenza −1,6 K varia tipicamente tra **24 e 605**
  (imperiale; 171–4316 metrico), e le pendenze variano tra **−1,0 e −1,9**
  (limiti di Oriard). → K/m NON sono costanti universali.
- **[NV]** La **curva Z di RI 8507**: da 0,2 a 2,0 in/s (**5,1–50,8 mm/s**);
  ancoraggi 12,7 mm/s (intonaco su listelli) e 19,0 mm/s (cartongesso) a bassa
  frequenza; 50,8 mm/s da 40 Hz in su.
- **[NV]** **Limiti di validità dichiarati di RI 8507**: derivata SOLO per
  prevenire **crepe cosmetiche in case residenziali a telaio di legno** vicino a
  miniere di superficie (la rottura reale del cartongesso richiede in genere PPV
  > 100 mm/s); MAI intesa per strutture civili in cemento/acciaio o tubazioni
  interrate (RI 9523 dà 127 mm/s per le tubazioni interrate). → un simulatore
  NON deve presentare la curva Z come soglia di danno universale.
- **[NV]** La definizione di **carica-per-ritardo** nella distanza scalata dipende
  dalla convenzione della finestra temporale (claim parziale, da completare).

**Implicazione per Genesi (sicurezza, priorità massima)**:
1. Verificare nel codice quali K/m usiamo e come li presentiamo: devono essere
   **dichiarati come valori tipici da calibrare in sito** (il signature-hole che
   già abbiamo è lo strumento giusto).
2. Nelle schermate dei limiti, precisare **a cosa si applica** la soglia (edifici
   residenziali vs altro).

## 5. Aree NON coperte da questa raccolta (da completare nei prossimi cicli)
- **Flyrock** (Lundborg, McKenzie; dispersione delle formule empiriche; fattori di
  sicurezza): le ricerche dedicate sono state troncate dal limite di sessione.
  PRIORITÀ 1 alla ripresa: è l'area dove un numero sbagliato è più pericoloso.
- **Airblast** (RI 8485): raccolto solo parzialmente.
- **Fori bagnati / decoupling / decking**: non ancora coperti.

## 6. Prossimi passi (ordine)
1. **Verificare i claim [NV]** aprendo le fonti (dopo il reset del limite).
2. **Confronto formula-per-formula col codice** di `genesi.html` (esponenti,
   coefficienti, unità): certificare dove combacia, segnalare dove no.
3. **Completare flyrock/airblast/fori bagnati** (ricerca dedicata).
4. **Elenco correzioni per il fondatore**, ordinato per sicurezza (flyrock e
   vibrazioni prima). Il motore fisico si tocca SOLO col suo via libera.

## Fonti raccolte (da riverificare aprendole)
- Gheibie et al. — *Modified Kuz-Ram fragmentation model and its use at the Sungun
  Copper Mine* (via ResearchGate).
- Ouchterlony 2005 — *Mining Technology*, DOI 10.1179/037178405X44539 (Swebrec).
- Sanchidrián & Ouchterlony 2017 — *Rock Mech Rock Eng*, DOI 10.1007/s00603-016-1131-9 (xP-frag).
- SME (2013) — *Vibration and air-overpressure handout* (sintesi USBM RI 8507/8485,
  Oriard) — fonte secondaria autorevole, utile come indice delle primarie.

Nota di processo: un sotto-agente della ricerca è stato segnalato dal sistema per
aver letto file di configurazione dell'ambiente durante un errore di rete; il suo
output NON è stato usato (la sua fetch era fallita). Nessun dato di questo documento
proviene da quel percorso.
