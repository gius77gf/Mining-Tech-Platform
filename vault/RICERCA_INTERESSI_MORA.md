# Ricerca — interessi di mora e termini di pagamento (backlog per Conti)

Data: 2026-07-21 · Ricerca di prodotto per **Conti** (crediti e solleciti).
Obiettivo: dare a Conti un **numero vero** da mettere in un sollecito — gli
interessi di mora di legge sulle fatture insolute — così il recupero credito è
più efficace di un generico "pagate".

⚠️ **Onestà**: riferimento operativo, non consulenza legale. Il tasso cambia
ogni semestre; la %default va aggiornata e il calcolo confermato col
commercialista prima di inviare cifre a un cliente.

## Cosa dice la legge (D.Lgs 231/2002, transazioni commerciali B2B)
- **Interessi di mora automatici**: decorrono dal giorno successivo alla
  scadenza, **senza bisogno di messa in mora** (nessuna raccomandata
  preventiva necessaria).
- **Tasso**: tasso di riferimento BCE (rifinanziamento principale) **+ 8 punti**.
  - **1° semestre 2026: 10,15%** (BCE 2,15% + 8) — GU n. 15 del 20/01/2026.
  - (per alcune derrate deperibili: +2 punti, non derogabile).
- **€40 forfettari** di rimborso spese di recupero (art. 6), dovuti in automatico
  in aggiunta agli interessi.
- **Termini**: in genere **30 giorni**; in certi casi fino a **60 giorni**.
- Le parti possono pattuire un tasso diverso, ma non uno "gravemente iniquo" a
  danno del creditore (nullità).

## Come diventa lavoro in Conti (backlog, non gated)
1. **`interessiMora(importo, giorniRitardo, tassoAnnuo = 10.15)`** (pura,
   testabile): interessi maturati = importo × tasso/100 × giorni/365. Ritorna
   {interessi, giorni, tasso}. Zero se non ancora scaduta.
2. **Costo forfettario €40** (art. 6): esposto a parte, si aggiunge quando c'è
   ritardo.
3. **Nel sollecito / esposizione**: accanto a una fattura insoluta, mostrare
   "interessi di mora stimati €X (tasso 10,15%, N gg) + €40 spese" — così il
   sollecito ha un numero concreto. La %tasso è un parametro impostabile
   (default aggiornabile a ogni semestre), con nota "da confermare".
4. (Futuro) Tabella dei tassi per semestre, aggiornata quando esce la GU.

Il passo 1–3 è il naturale prossimo incremento di Conti (stesso pattern di
`livelloSollecito`/`prioritaIncasso`), con framing onesto (tasso di riferimento,
da confermare col commercialista).

## Fonti (secondarie, concordanti)
- Art. 5 D.Lgs 231/2002 — saggio degli interessi:
  https://www.codiceappalti.it/dlgs_231_2002/Art__5__Saggio_degli_interessi/5928
- Interessi moratori nelle transazioni commerciali (Altalex):
  https://www.altalex.com/documents/altalexpedia/2025/07/31/interessi-moratori-transazioni-commerciali
- Interessi di mora commerciali — saggio e calcolo (Legge in chiaro):
  https://leggeinchiaro.it/interessi-mora-commerciali-saggio-231/
- D.Lgs 231/2002 testo (Bosetti & Gatti):
  https://www.bosettiegatti.eu/info/norme/statali/2002_0231.htm
