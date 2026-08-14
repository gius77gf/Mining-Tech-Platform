# Ricerca continua — Conti

**Data**: 2026-08-14  
**Verificato contro commit**: 8b364b36  
**Cosa esiste già**: Conti ha `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` che calcola il dovuto sul periodo in base a scelta della base (venduto/scavato), unità (t/m³) e aliquota. I campi di configurazione sono `canoneUnita`, `canoneBase`, `canoneAliquota`, `canoneNota`. Non c'è un modello di dichiarazione annuale né un export specifico per la conformità normativa.

---

## Il mondo — Canone di escavazione in Italia

### Come funziona il tributo

Il canone (diritto) di escavazione è un tributo che i titolari di concessioni di cavità minerali pagano agli enti pubblici (Regioni, Province, Comuni) sulla base del materiale estratto.

**Chi lo impone**: Le Regioni, sulla base di decreti legislativi dello Stato. Ogni Regione fissa le proprie aliquote e modalità.

**Base di calcolo**: Il volume estratto misurato in metri cubi (m³) o, per alcuni materiali, in tonnellate (t). La base può essere:
- **Volume estratto** (scavato): misurato da rilievi topografici o volumetrici
- **Volume venduto**: documenti di trasporto (DDT) e fatture

**Periodicità e versamento**: 
- Versamento: generalmente **semestrale** o **annuale** secondo le norme regionali
- Dichiarazione: **annuale**, entro **30 aprile** dell'anno seguente, tramite **Modello A** (compilato per ogni concessione con codice regionale unico)
- La dichiarazione va trasmessa ai gestori del Servizio Operatori Minerari (via PEC), ai comuni, province e enti gestori di aree protette

**Cosa contiene la dichiarazione annuale (Modello A)**:
- Codice identificativo della concessione/autorizzazione
- Volume estratto nel periodo (in m³ o t secondo l'aliquota)
- Prodotto estratto (calcare, sabbia e ghiaia, argilla, gesso, ecc.)
- Allegati richiesti (fatture, DDT, rilievi topografici secondo le norme regionali)
- Firma del titolare della concessione

Fonte: [FAQ Veneto - terre e rocce da scavo](https://www.arpa.veneto.it/temi-ambientali/suolo/faq-su-terre-e-rocce-da-scavo); [Regione Piemonte - Onere per il diritto di escavazione](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione)

### Variazioni regionali

#### Piemonte
- **Base**: Volume estratto (m³ o t)
- **Aggiornamento 2026**: Adeguamento ISTAT 2,4% su tariffe 2024-2025
- **Modello**: Dichiarazione entro 30 aprile tramite Servizio Operatori Minerari
- Fonte: [Regione Piemonte - Onere per diritto escavazione 2025](https://www.regione.piemonte.it/web/temi/sviluppo/attivita-estrattive/onere-per-diritto-escavazione-materiale-estratto-nel-2025)

#### Lombardia
- **Base**: Volume estratto (m³)
- **Tariffe aggiornate**: Gennaio 2026, adeguamento 2,4% su base ISTAT programmata 2024-2025
- **Distribuzione**: 84% ai comuni interessati (per infrastrutture e recupero ambientale), 16% a regione/enti
- **Periodi**: Semestrale o annuale secondo tariffa
- Fonte: [ANCI Lombardia - Aggiornamento tariffe 2026](https://anci.lombardia.it/dettaglio-circolari/2026122143-aggiornamento-tariffe-di-escavazione/anci.lombardia.it)

#### Toscana
- **Base**: Volume estratto, espresso in €/m³
- **Delibera Giunta 736/2021**: Tariffe per estrazioni di materiali industriali e per costruzioni
- **Aggiornamenti**: Incremento ISTAT 0,6% annuale; +2% se azienda manca di certificazioni ambientali/sicurezza o in aree con vincoli paesaggistici
- Fonte: [Delibera Regione Toscana 736/2021](https://www.confindustriatoscanasud.it/index.php/edilizia-infrastrutture-e-politiche-territoriali/delibera-regione-toscana-7362021-contributi-escavazione-materiali-industriali-1/)

#### Differenza fra mine e cave
Secondo Regio Decreto n. 1443/1927: le **cave** sono lasciate al disponibile del proprietario terriero (Pubblica Amministrazione non riscuote canone); il canone si applica solo alle **miniere** dove il deposito è sottratto al proprietario.

Fonte: [Oneri istruttori e diritti di escavazione - Città Metropolitana Milano](https://www.cittametropolitana.mi.it/ambiente/guida_autorizzazioni_ambientali/imprese_enti/attivita_estrattiva/oneri_diritti_escavazione.html)

### Come i software di settore lo gestiscono

Software e piattaforme gestionali per cave e miniere (es. Catasto Cave e Miniere):
- **Calcolo automatico**: Dell'importo dovuto per volume × aliquota regionale configurata
- **Gestione aliquote**: Lettura da tariffari regionali, aggiornamento per inflazione
- **Dichiarazioni**: Generazione di moduli conformi alle norme regionali, esportazione dati per Modello A
- **Non-calcolabilità**: Dichiarazione di impossibilità di calcolo quando aliquota manca o volume non disponibile
- **Scadenze**: Tracciamento delle scadenze di versamento e dichiarazione per regione

Fonte: [Catasto Cave e Miniere - Manuale Utente v2.2.1 - Gennaio 2026](https://www.caveminiere.servizirl.it/catmc/assets/doc/ManualeUtenteCATCM.pdf)

---

## Il DELTA su Conti — Cosa manca

**Schermata**  |  **Che cosa non va**  |  **Come si vede**  |  **Quanto costa**  |  **Come si misura**
---|---|---|---|---
Canone (sezione corrente) | Nessun modello di dichiarazione annuale esportabile (Modello A o simile conforme alle norme regionali) | Nessun bottone "Scarica dichiarazione" o "Esporta modello" nel pannello canone; nessun file CSV/PDF generato | Medio: codificare la struttura del Modello A con i dati del periodo (volume, prodotto, date), esportare in CSV o generico per stampa. Dipende da quale regione si mira per primo (norme diverse). | Cercare nell'indice HTML: `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia' apps/conti/index.html` → 0; in conti-data.js cercare funzioni di export tipo `export function csvDichiarAnnuale\|dichiarazioneAnnuale` → 0. Nessuna struttura dati.
Canone (sezione corrente) | Impossibilità di marcare il canone come "dichiarato" o "versato" nella storia (tracciamento della conformità) | No campo di stato (es. "dichiarazione attesa", "versato il 30/04", "controllato"). Il valore resta sempre calcolato, senza storia. | Basso: aggiungere stato/nota sulla dichiarazione e versamento; fare persistere il dato di "data di dichiarazione". | Cercare nello schema di `canonePeriodo` in conti-data.js: controllare se restituisce un oggetto con `dichiarazioneData`, `statoVersamento`, ecc. → `grep -n "dichiarazu\|versatu\|statoCanone" conti-data.js` → 0 risultati.
Canone (sezione corrente) | Nessuna notifica di scadenza dichiarazione (30 aprile per anno precedente) | No reminder, no toast, no avviso in dashboard KPI | Basso: aggiungere logica di avviso per data di scadenza. È già il modello di Conti per altre scadenze. | `grep -ciE 'april.*30\|scadenza.*dichiar\|30.*april' apps/conti/` → 0.
Canone (sezione corrente) | Configurazione per materiale non supportata (tariffa diversa per calcare/sabbia/argilla come da norme regionali) | Un'unica aliquota `canoneAliquota` vale per tutto il periodo; nessun "listino" dei materiali con aliquota propria come nel listino dei prodotti | Medio-alto: estendere impostazioni per supportare aliquote per prodotto/materiale. Correlato al listino esistente. | `grep -n "canoneAliquota\|canone.*listino" conti-data.js` → trova 1 solo campo `canoneAliquota` numerico. Nel listino cercare: `grep -ciE 'canone.*aliquota\|prodotto.*canone' conti-data.js` → 0.

**Nessuna delle tre mancanze è stata trovata nel codice.**

#### Ricerche dettagliate

```bash
# Modelli di dichiarazione
grep -ciE 'dichiarazione.*annuale|modello.*a|scarica.*modello|export.*dichiar' /home/user/Mining-Tech-Platform/apps/conti/index.html
# Risultato: 0

# Stato versamento/dichiarazione
grep -n 'dichiarazioneData\|statoVersamento\|versatu\|dichiaraCome' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: nessun match

# Aliquote per materiale
grep -ciE 'prodotto.*canone|canone.*prodotto|aliquota.*per.*materiale' /home/user/Mining-Tech-Platform/apps/conti/conti-data.js
# Risultato: 0

# Avvisi di scadenza
grep -ciE '30.*aprile|scadenza.*dichiarazione|deadline.*canone' /home/user/Mining-Tech-Platform/apps/conti/
# Risultato: 0
```

#### Cosa c'è già

- `canonePeriodo(pesate, impostazioni, dal, al, rilievi)` — calcola il dovuto su un periodo
- Campi `canoneUnita` (t/m³), `canoneBase` (venduto/scavato), `canoneAliquota` (€/unità), `canoneNota`
- Interfaccia di input (ID: `can-base`, `can-unita`, `can-ali`, `can-nota`) con validazione
- Nota a display: "Il canone si versa agli enti ... molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti"
- Pattern di export CSV già presente per fatture, pesate, incassi, clienti, listino

---

**Proposta prioritaria**: Aggiungere una sezione di riepilogo dichiarativo (numero quantità per anno, verifica rispetto a quanto caricato, data di versamento storico) con opzione di esportazione in formato adatto a Modello A. Non è urgente finché non si sa quale regione seguire per primo (tariffari diversi).

---

## ⛔ RIVERIFICA DEL 14/08 — i verdetti reggono, i RIGHELLI no

*Rimisurato dal ciclo contro il commit `8b364b36`, prima che qualunque riga di
qui entrasse in roadmap. Vale la regola della casa: **niente entra sulla parola
dell'agente**, e un «non c'è» senza la sua ricerca accanto vale zero.*

**Esito: 4 mancanze su 4 confermate nel verdetto, 4 prove su 4 da rifare.** È la
stessa forma già censita per i documenti del delta — *«una prova che invecchia
non rende la riga sbagliata: la rende non credibile»* — con la differenza che
qui non è invecchiata: **è nata storta**, e i quattro modi sono tutti già
scritti in `CLAUDE.md`.

### I quattro righelli, e che cosa rispondono davvero

1. ⛔ **`grep` su una CARTELLA senza `-r`.** Scritto
   `grep -ciE '30.*aprile|scadenza.*dichiarazione' apps/conti/` → l'uscita vera è
   `grep: apps/conti/: Is a directory` **e poi `0`**. Cioè lo zero è **del
   righello**, non del codice. Fatto giusto (`grep -rciE "30 aprile|scadenza.*dichiaraz" apps/conti/`):
   `README.md:0 · index.html:0 · conti-data.js:0`. **Il verdetto regge**, ma per
   la prima volta è provato.
2. ⛔ **La pipe SFUGGITA dentro `-E`.** Nella tabella la prova è scritta
   `grep -ciE 'dichiarazione.*annuale\|modello.*a\|scarica.*dichia'` → **0**, e
   quello zero è garantito: con `\|` dentro `-E` la pipe è **letterale**. Senza
   la sfuggita, lo stesso comando risponde **3**. È la trappola che questo
   repository ha già pagato il 14/08 sul delta, scritta due volte nello stesso
   documento.
3. ⛔ **I refusi nei termini.** `grep -n 'dichiarazu\|versatu\|statoCanone'`:
   due parole su tre **non esistono in nessuna lingua**, e la terza è cercata
   senza `-E` con le pipe letterali. Un comando così **non può** rispondere
   altro che zero.
4. ⚠️ **Il conto che si contraddice da sé.** La riga «Nessuna delle **tre**
   mancanze è stata trovata nel codice» sta sotto una tabella che ne elenca
   **quattro**. È il difetto che togliamo dal prodotto, fatto da noi in un
   documento — e la difesa è quella già scritta: *ogni addendo ha un lettore che
   lo conosce, il totale no*.

### Le quattro righe, riverificate una per una

| mancanza | verdetto | la prova, rifatta |
|---|---|---|
| nessun modello di dichiarazione annuale esportabile | **VERA**, ma **non** «non se ne parla»: la pagina la **nomina già** | `grep -ciE "dichiarazione annuale\|modello a\b\|scarica.*dichiaraz" apps/conti/index.html` → **1**, ed è la nota del pannello canone («molte regioni chiedono anche una dichiarazione annuale dei quantitativi estratti»). Quello che manca è **l'export**, non la consapevolezza. |
| nessun campo di stato «dichiarato / versato» | **VERA** | Le impostazioni del canone sono tre e sono queste: `canoneUnita`, `canoneAliquota`, `canoneNota` (più `canoneBase`). Nessun campo di stato, nessuna data di versamento. Letto nel letterale `impostazioni` di `conti-data.js`. |
| nessun avviso della scadenza | **VERA** | vedi righello 1: `0` su tutti e tre i file, provato. |
| aliquota unica, non per materiale | **VERA** | `grep -ciE "aliquot" apps/conti/conti-data.js` → **90 righe**, di cui `canoneAliquota` **5** e `aliquotaIva` **23**: cioè la parola «aliquota» in questo file parla quasi sempre di **IVA**, e del canone ce n'è **una sola**, numerica. |

### Quello che NON ho rimisurato, e va detto
⚠️ **Tutta la metà sul mondo** — le tariffe di Piemonte, Lombardia e Toscana,
il «Modello A», il termine del 30 aprile, gli adeguamenti ISTAT — è **riportata
dall'agente con le sue fonti e NON è stata riverificata**. Prima che un numero
di lì finisca in una schermata o in un documento del prodotto, va aperto il
testo di legge citato: una tariffa sbagliata detta a un cliente è peggio di una
tariffa assente.

### E un righello sbagliato l'ho scritto IO, in questa stessa sezione
⚠️ Nella prima stesura della riga sull'aliquota avevo scritto «`aliquot` dà **8**
occorrenze, tutte `aliquotaIva`». Sono **90 righe**, di cui 5 del canone e 23
dell'IVA: avevo riportato il numero di un *altro* comando, più stretto, lanciato
un minuto prima. Cioè: **stavo correggendo dei righelli falsi con un righello
falso.** L'ha presa il rilancio del comando prima di committare — non la
rilettura, che l'aveva lasciato passare. È la ragione per cui in questa casa una
prova è **un comando con la sua uscita** e non una frase che descrive una
ricerca.

### Che cosa è cambiato mentre la ricerca girava — ⏱️ SCADUTA IN DUE ORE
⏱️ La riga qui sopra diceva «un cantiere **sta** togliendo il
`+cfg.canoneAliquota || 0`». Adesso è **committato**: con l'aliquota mai
impostata `canonePeriodo` risponde `dovuto: null` con le bandiere `noto` e
`calcolabile` e un `motivo` che dice quale dei due manca — non più `0`. Quindi
la descrizione del calcolo scritta più su in questo documento è **scaduta**, ed
è scaduta in **due ore**: è il «non c'è» scaduto, la seconda forma, e non è
colpa di nessuno — il cantiere girava di fianco alla ricerca.
⚠️ Aggiornato qui invece che riscritto sopra, perché **la riga vecchia serve**:
una ricerca che si autocorregge in silenzio non insegna niente a chi la rilegge
fra un mese.
