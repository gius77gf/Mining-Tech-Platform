# Scudo — HSE cava: confronto onesto e roadmap (ricerca in tempi morti)

Nota di ricerca (fallback dei cicli automatici, zero modifiche al codice): dove sta
Scudo rispetto ai software HSE per cave/miniere, e quali passi sono **fattibili nel
browser** senza tradire la filosofia Deepwork (semplice, economico, multi-tenant).
Le modifiche al modello dati restano gated sul fondatore.

## Cosa fa Scudo OGGI (dal codice)
- **Scadenze** per lavoratore con stato/livello (visite mediche, formazione, DPI…):
  `statoScadenza`, `livelloScadenza`, preset `SCADENZE_PRESET`.
- **Idoneità sanitaria**: label/criticità/prossimo stato (`idoneita*`).
- **Copertura formazione**: `coperturaFormazione` sulle scadenze.
- **Infortuni / near-miss**: registro + `riepilogoInfortuni` (indice, giorni senza
  infortuni), import CSV, filtro, campo luogo, blocco date future (fix 22/07).
- **Promemoria**: `testoPromemoria` pronto da inviare. **KPI** `kpiFrom`.
Base solida: gestione scadenze + registro eventi + promemoria, tutta org-isolata.

## Cosa fanno i leader (ricerca)
I software HSE minerari (Safetymint, SmartQHSE, Ecesis, TECH EHS, Taro) ruotano su:
1. **Incident/near-miss con workflow d'indagine a step**: dettagli → squadra →
   valutazione rischio → identificazione pericolo → **azione correttiva/preventiva
   (CAPA)** → chiusura.
2. **Azioni correttive con responsabile e scadenza**, tracciate fino a chiusura.
3. **Ispezioni/audit** di sito e attrezzatura con checklist ricorrenti.
4. **Registro documentale** (induzioni, manuali, policy, attestati) con completamento.
5. **Valutazione rischi / registro pericoli** (in Italia: DVR, D.Lgs 81/2008).
6. Dashboard in tempo reale (Scudo ha già i KPI).

## Divario e passi FATTIBILI nel browser (ordinati per impatto/fattibilità)
1. **Loop azione correttiva** (impatto ALTO, riuso ALTO): a un near-miss/infortunio
   si aggancia una **azione correttiva** (cosa fare, responsabile, scadenza) che
   entra nella STESSA macchina di scadenze/promemoria già esistente. Chiude il ciclo
   "segnala → correggi → chiudi" che i leader mettono al centro, riusando codice che
   Scudo ha già. È il passo con più valore per meno lavoro. *(tocca il modello dati →
   conferma del fondatore prima di costruire.)*
2. **Ispezioni/checklist ricorrenti** (impatto medio): checklist di sicurezza
   periodiche (es. mensili) con esito e voci non conformi → generano azioni
   correttive (punto 1). Fattibile lato browser, dati org-isolati.
3. **Registro attestati formazione** (impatto medio): allegare/annotare l'attestato
   per la scadenza di formazione (numero, data, ente) → la copertura formazione
   diventa verificabile, non solo "fatta/da fare". *(Allegati file = scelta storage
   → fondatore.)*
4. **DVR-lite / registro pericoli** (impatto alto ma PESANTE): un vero DVR è
   documento firmato dal datore di lavoro/RSPP — Scudo può al più tenerne un
   **registro dei pericoli** con misure e revisioni, NON sostituire il DVR legale.
   Da dichiarare esplicitamente per non illudere (coerente col richiamo all'onestà).

## Limiti onesti
- Scudo è uno **strumento di gestione/promemoria**, non un sostituto degli obblighi
  di legge (DVR, sorveglianza sanitaria del medico competente, formazione erogata da
  enti abilitati): tiene in ordine scadenze ed eventi, non certifica.
- Ogni passo che aggiunge campi/allegati tocca il modello dati multi-tenant: si fa
  solo col via libera del fondatore, passando sempre da `orgCollection`.

## Prossimo passo (quando il fondatore sceglie)
Consigliato il **punto 1** (loop azione correttiva): massimo valore, riusa la
macchina scadenze/promemoria, piccolo delta di modello dati. Da confermare con lui.

## Fonti
- [Farmonaut — Mining Safety Management Software](https://farmonaut.com/mining/mining-safety-management-software-7-ways-for-safer-mining)
- [Safetymint — Mining](https://www.safetymint.com/mining.htm)
- [SmartQHSE — Mining HSE](https://www.smartqhse.com/hse-software/mining)
- [Ecesis — Mining EHS](https://www.ecesis.net/Mining-EHS-Software.aspx)
- [Taro — Quarrying](https://taro.solutions/taro-quarrying/)
