# Conti — fatturazione e vendita inerti: roadmap onesta

Documento per Giuseppe. Sintesi di una ricerca sul settore fatturazione/vendita
inerti in Italia e su cosa Conti può adottare NEL BROWSER (senza backend/costi) vs
cosa richiede un servizio esterno a pagamento. Onestà prima di tutto: dove Conti
"prepara un file o un calcolo" lo dico; dove servirebbe un canale fiscale
accreditato (a pagamento) lo dico altrettanto chiaro.

## La linea rossa (leggere prima)
Conti può essere **il quaderno amministrativo della cava nel browser**: anagrafiche,
listini, DDT/pesate a mano, fattura, scadenzario, e **generare** i documenti (anche
l'XML della fattura elettronica). Ciò che **non** può fare da solo, e non va promesso:
- **inviare la fattura allo SdI** (serve PEC o un intermediario/portale accreditato);
- **conservare a norma 10 anni** (serve un conservatore/servizio);
- **leggere il peso dalla pesa a ponte** (serve hardware + software del bilanciaio).
La cosa onesta: Conti prepara, e per la parte fiscale-legale ci si appoggia ai
**servizi GRATUITI dell'Agenzia delle Entrate** (portale Fatture e Corrispettivi per
l'invio, conservazione gratuita dell'Agenzia). Nessun costo prima della vendita.

## Cosa fare — ordinato per valore/fattibilità

### Fascia 1 — alto valore, 100% in browser, costo zero
1. **Listino inerti + anagrafica prodotti**: sabbia/ghiaia/pietrisco/misto con prezzo
   €/t o €/m³ (con **densità** per prodotto: €/t e €/m³ NON sono interscambiabili
   senza la massa volumica!), sconto cliente, maggiorazione trasporto/distanza.
2. **Registro DDT / pesate**: tara / lordo / **netto = lordo − tara**, prodotto,
   €/t → importo; inseribili a mano o via CSV. Poi **fattura differita riepilogativa
   mensile** (entro il 15 del mese dopo) che richiama i DDT del mese. È il flusso
   REALE della cava (vendita a peso, tanti viaggi → una fattura) e oggi manca del tutto.
3. **Motore IVA corretto**: gli inerti sono **vendita di BENI → IVA 22%** ordinaria.
   Il **reverse charge edilizia** NON si applica alla semplice fornitura di materiali
   (solo a servizi/subappalti): metterlo **solo come flag opzionale per riga** con nota
   "verifica col commercialista", MAI automatico. Riepilogo IVA per aliquota nel totale.
4. ✅ **[FATTO] Correzione "DSO"**: il KPI "DSO medio" era mal etichettato (non è il
   DSO); rinominato "**Età media credito**". Prossimo: **fido/limite credito per
   cliente** + alert superamento, e un semplice **rischio cliente** (ritardo medio,
   % scaduto storico) — dati che Conti già possiede.

### Fascia 2 — alto valore, in browser ma più impegnativo
5. ✅ **[FATTO il 02/09, in tre unità]** il generatore nel modulo (`xmlFatturaPA`
   in `conti-data.js`, tracciato FPR12 scritto a memoria della v1.2: **va passato
   dal controllo formale del portale prima del primo invio vero**), i campi che
   servono (sede a campi, regime fiscale e modalità di pagamento a tendina — mai
   decisi dal programma), e il bottone «XML per lo SdI» sulla fattura, che con
   un dato mancante NON scarica e lo nomina. La riga di onestà qui sotto compare
   ogni volta. Sulla dimostrazione la differita di Edilcave esce pronta.
   **Generatore XML FatturaPA** valido lato client (schema pubblico, dati che Conti
   già ha) con **controllo formale** prima dell'export. Nota onesta: per B2B/B2C la
   **firma digitale NON è obbligatoria** (lo è solo verso la PA/gare). L'utente scarica
   l'`.xml` e lo trasmette dal portale gratuito dell'Agenzia.
6. **Export commercialista** (CSV registro IVA vendite + eventuale ZIP di XML) e **PDF
   di cortesia** di fattura/DDT/estratto conto (il PDF è copia leggibile, NON il
   documento fiscale — quello è l'XML).
7. **Cash flow completo** (incassi attesi — già presenti — + uscite fornitori) e
   **storico solleciti** (data/livello inviato).

### Fascia 3 — NON dentro Conti: indirizzare a servizi terzi (dirlo in chiaro)
8. **Invio allo SdI** → portale Agenzia (gratis, SPID/CIE) o PEC dell'utente.
9. **Conservazione a norma 10 anni** → servizio gratuito dell'Agenzia.
10. **Automazione pesa a ponte** → software del bilanciaio (hardware). Conti importa
    i dati a valle, non pilota la bilancia.

**Regola di onestà nell'interfaccia** (dove Conti tocca la fattura elettronica):
mostrare una riga fissa tipo «Conti prepara il file XML e i documenti; l'invio allo
SdI e la conservazione a norma si fanno gratis sul portale dell'Agenzia delle Entrate
o col tuo commercialista». Utile davvero, senza promettere ciò che non può fare.

## Cosa serve alla tua decisione
Le Fascia 1 sono fattibili e ad alto valore: dimmi da quale partire (proposta: 1
listino → 2 DDT/fattura differita, che insieme coprono il ciclo vendita-a-peso). La
5 (XML FatturaPA) è di grande valore percepito ma va accompagnata dal messaggio
onesto sull'invio/conservazione. Verificare aliquote/regole IVA col commercialista
prima di renderle "di default".

---
### Fonti principali
- SdI / FatturaPA: https://www.fatturapa.gov.it/it/sistemainterscambio/cose-il-sdi/ · https://www.agenziaentrate.gov.it/portale/web/guest/aree-tematiche/fatturazione-elettronica/guida-fatturazione-elettronica/come-predisporre-inviare-ricevere-fe/come-inviare-fe-al-cliente
- Firma non obbligatoria B2B: https://www.fatturapa.gov.it/it/comefare/operatori-economici/firmare-la-fatturapa/
- Procedura web + conservazione gratuita Agenzia: https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica/guida-fatturazione-elettronica/i-servizi-dell-agenzia-fe/la-procedura-web-fe · https://www.agenziaentrate.gov.it/portale/aree-tematiche/fatturazione-elettronica/guida-fatturazione-elettronica/come-predisporre-inviare-ricevere-fe/come-si-conservano-fe
- DDT e fattura differita: https://www.danea.it/blog/ddt-documento-di-trasporto/ · https://biblus.acca.it/fattura-differita-cos-e-quando-si-emette/
- IVA edilizia / reverse charge (solo servizi): https://www.ediltecnico.it/43494/iva-in-edilizia-trattamento-aliquote/ · https://fiscomania.com/reverse-charge-edilizia/
- Gestionali cava/pesa: https://www.vincro.it/software-di-pesatura/software-gestione-cave/ · https://infominds.eu/settori/edilizia/produttori-inerti-calcestruzzo-cave/
- Generazione XML lato client: https://forum.italia.it/t/creazione-xml-client-based/10191
