# Ricerca — scadenze HSE di una cava (backlog per Scudo)

Data: 2026-07-21 · Ricerca di prodotto per **Scudo** (l'app HSE del personale).
Obiettivo: capire QUALI adempimenti/scadenze deve davvero seguire una cava, per
proporli in Scudo come **tipi preimpostati** (come le soglie normative di
Sentinella) invece di farli scrivere a mano.

⚠️ **Onestà**: questo foglio è un **riferimento operativo, non consulenza
legale**. Le periodicità esatte dipendono dalla valutazione dei rischi (DVR/
DSS), dal medico competente e dalle prescrizioni autorizzative. Ogni voce va
**confermata con l'RSPP / il medico competente** dell'azienda. Le fonti sotto
sono secondarie e concordanti.

## Il doppio binario normativo della cava
Una cava non segue solo il Testo Unico generale, ma anche una norma
**specifica dell'industria estrattiva**:
- **D.Lgs 81/2008** (Testo Unico salute e sicurezza) — vale per tutti:
  sorveglianza sanitaria (art. 41), formazione (art. 37), DPI, ecc.
- **D.Lgs 624/1996** (attività estrattive, recepisce direttive 92/91 e
  92/104/CEE) — specifico per cave/miniere: introduce il **DSS (Documento di
  Sicurezza e Salute)**, l'equivalente "estrattivo" del DVR, il **sorvegliante
  designato**, e obblighi di comunicazione all'autorità di vigilanza (il DSS
  va trasmesso prima dell'inizio attività e ad ogni aggiornamento).

Questo doppio binario è la "personalità" di Scudo rispetto a un gestionale HSE
generico: può parlare la lingua della cava (DSS, sorvegliante, polizia
mineraria), non solo quella dell'ufficio.

## Adempimenti a scadenza — proposta di tipi preimpostati per Scudo
Raggruppati per categoria. Le periodicità "tipiche" sono indicative
(**da confermare**).

### Persona (per lavoratore)
- **Sorveglianza sanitaria — visita periodica** (art. 41). Periodicità decisa
  dal medico competente (spesso annuale/biennale; più stretta con rumore,
  vibrazioni, **silice/polveri**, movimentazione carichi).
- **Idoneità alla mansione** (esito della visita) — già gestita in Scudo
  (idoneo / con prescrizioni / non idoneo).
- **Formazione generale + specifica** (art. 37, Accordo Stato-Regioni) e
  **aggiornamento** (tipicamente quinquennale).
- **Formazione preposto** e **dirigente** (con i rispettivi aggiornamenti).
- **Primo soccorso** (addetti) — aggiornamento tipico triennale.
- **Antincendio** (addetti) — aggiornamento periodico secondo il livello di
  rischio.
- **RLS** (rappresentante lavoratori) — aggiornamento periodico (annuale nelle
  aziende sopra una certa soglia di addetti).
- **Abilitazioni/patentini attrezzature** (escavatori, pale, PLE, gru,
  carrelli — Accordo 22/02/2012) — aggiornamento tipico quinquennale.
- **Fochino / brillamento mine** — abilitazione specifica per l'uso di
  esplosivi in cava (dove previsto).

### Azienda / sito (non legati a una persona)
- **DSS — Documento di Sicurezza e Salute** (D.Lgs 624/96): revisione/
  aggiornamento e trasmissione all'autorità.
- **DVR** (dove applicabile) — aggiornamento a ogni cambiamento significativo.
- **Verifiche periodiche attrezzature** (D.M. 11/04/2011): apparecchi di
  sollevamento, ecc. — periodicità per tipologia.
- **Nomine** (RSPP, medico competente, addetti emergenze, sorvegliante) —
  da tenere aggiornate.
- **Riunione periodica di sicurezza** (art. 35) — tipicamente annuale.

## Come diventa lavoro in Scudo (backlog, unità piccole)
1. **Preset dei tipi di scadenza** (come SOGLIE_PRESET di Sentinella): una
   lista `SCADENZE_PRESET` con categoria (persona/azienda) ed etichetta, da
   scegliere nel form invece di digitare. Ogni voce con avviso `daVerificare`.
   *Pura, testabile, nessun rischio.*
2. **Filtro persona/azienda** nello scadenzario (già c'è il campo aziendale).
3. **Promemoria multi-soglia** già presenti (livelloScadenza 7/30 gg): valutare
   una soglia lunga (60/90 gg) per gli adempimenti che richiedono preavviso
   (es. rinnovo visite di gruppo).
4. (Futuro, gated) Collegamento DSS ↔ Sentinella (le misure ambientali che il
   DSS richiede) — è un pezzo del "ciclo chiuso".

Il passo 1 è il naturale prossimo incremento di Scudo, coerente con il pattern
già usato in Sentinella e senza affermare periodicità di legge come certe.

## Fonti (secondarie, concordanti)
- Art. 41 D.Lgs 81/2008 — sorveglianza sanitaria:
  https://tussl.it/titolo-i-principi-comuni/capo-iii-gestione-della-prevenzione-nei-luoghi-di-lavoro/sezione-v-sorveglianza-sanitaria/art-41
- Sorveglianza sanitaria, quando effettuarla (Vega Engineering):
  https://www.vegaengineering.com/news/sorveglianza-sanitaria-quando-effettuarla/
- D.Lgs 624/1996, testo (Parlamento):
  https://www.parlamento.it/parlam/leggi/deleghe/96624dl.htm
- DSS per le attività estrattive (Studio Essepi):
  https://www.studioessepi.it/magazine/sicurezza-sul-lavoro/documento-di-sicurezza-e-salute-dss-attivita-estrattive
- Salute e sicurezza industrie estrattive D.Lgs 624/96 (Certifico):
  https://www.certifico.com/sicurezza-lavoro/documenti-sicurezza/documenti-riservati-sicurezza/salute-e-sicurezza-lavoratori-industrie-estrattive-d-lgs-624-1996
