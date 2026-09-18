# Checkpoint — 2026-09-18T04:30:21Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
fe342727

## Cosa è stato completato
Terza e ultima delle tre unità correlate (Terra ✅, Sentinella ✅, Campo ✅)
preparate insieme in un solo blocco di lavoro e committate una per una con
verifica isolata separata (worktree a strati: layer1 = solo Terra, layer2
= + Sentinella, layer3 = + Campo, ciascuna con `giro-node.mjs` completo
prima del commit).

Campo, terzo giro di deep-pass (agente adaf5869ccec0571f): `rapportoGiornata`
(rapporto di fine turno stampato e firmato) non portava né i near-miss del
turno né il giudizio di idoneità medica, mentre `testoConsegnaTurno` aveva
già i near-miss e nessuno dei due documenti aveva l'idoneità pur essendo
già visibile nel Quadro schermo. Corretto in `campo-data.js` (nuova
sezione "Segnalazioni del turno" in `rapportoGiornata`, nuova sezione
"IDONEITÀ DEL TURNO" in entrambi i documenti) e in `index.html` (wiring
dei nuovi parametri su entrambe le chiamate). Verificato dal vivo con
Playwright su entrambi i documenti. Un'iniezione di controprova in
`campo-numeri-tranquilli.mjs` è scaduta per effetto del fix (il codice si
è mosso perché è migliorato) ed è stata riancorata, verificata nei due
versi. Giro isolato finale: 41/41, 3.621 prove, 4118 asserzioni.

Con questo si chiudono tutti e tre i difetti confermati dai giri di
deep-pass recenti che erano pronti per il commit.

## Stato roadmap
Difetti CONFERMATI e ancora DA CORREGGERE (trovati da agenti in
background, verificati dal vivo, non ancora implementati — in ordine di
scoperta):
- **Conti** (agente af0b750375363ec94, quarto giro): `registroVendite`/
  `csvRegistroVendite` non controlla `riepilogoIvaFattura(f).quadra` — a
  differenza delle sorelle `csvSituazioneFatture`/`xmlFatturaPA` — quindi
  una fattura corretta con la matita (righe vecchie, totali nuovi) esce
  nel registro IVA con imponibile/imposta dalle righe vecchie e
  totale_documento dai totali nuovi, senza avviso.
- **Genesi** (agente a4a466a27e1e80730, quarto giro): il bottone "Apri"
  non azzera mai `D2.tratti` — un tratto disegnato a mano su un progetto
  sopravvive e si attacca alla volata aperta dopo, e se si salva diventa
  permanente. Stessa famiglia già chiusa per `D2.magliaAssente`.
- **Flotta** (agente ade005a3e1c9bacf0, quarto giro): doppio invio
  silenzioso su `btn-rif` (rifornimento + voce di costo gemella) e
  `btn-cos` (costo generico) — nessuno dei due usa il meccanismo
  `occupato()`/`salva()` già introdotto e usato da altri bottoni della
  stessa pagina (es. `btn-giro-salva`). Un doppio tocco raddoppia
  silenziosamente un dato finanziario/di consumo reale (litri, euro).
  Verificato solo su questi due bottoni; probabile la stessa vulnerabilità
  su ricambi/mezzi/scadenze/budget, non ancora misurata.
- **Scudo** (agente a76e56f7569610db8, quarto giro), due difetti:
  1. `abilitazioneLavoratore`/`pillReq` gestiscono solo 3 dei 4 stati che
     `statoRequisito` può restituire (manca "senza data"): un corso/visita
     con scadenza illeggibile sparisce da bloccanti/attenzioni e risulta
     "può andare" — lo stesso principio "l'assenza non è un dato
     favorevole" applicato correttamente altrove, sfuggito qui nel
     consumo del risultato.
  2. `csvRegistroInfortuni` non porta `categoria`/`anonimo`/
     `gravitaPotenziale` dei near-miss, mostrati a schermo — un giro
     export→import perde questi campi in silenzio.
- **Deepwork ID** (ricerca continua, non deep-pass): il ciclo di vita
  dell'invito non fa deduplica (due inviti alla stessa email/org restano
  record indipendenti) e l'accettazione riscatta tutti gli inviti
  pendenti in un colpo solo, senza conferma per organizzazione — rilevante
  per il consulente su cave concorrenti. Proposta, non ancora verificata
  come priorità.

Nota di processo: il volume di difetti confermati-ma-non-corretti sta
crescendo più in fretta di quanto si riescano a committare uno per uno.
Prossimo blocco: dare priorità alla correzione di questi cinque invece di
aprire nuovi giri di deep-pass, per non lasciare che l'elenco si allunghi
senza controllo (è il principio "niente entra in roadmap sulla parola
dell'agente" applicato al contrario: un elenco di conferme vere ma non
committate è comunque lavoro non finito).

## Prossimo passo atomico
1. Correggere **Conti** (`registroVendite` senza `riepilogoIvaFattura(f).quadra`):
   guardare come le sorelle `csvSituazioneFatture`/`xmlFatturaPA` gestiscono
   il caso (righe 2264-2271 e 4381-4410 di `conti-data.js` secondo l'agente),
   decidere se usare i totali registrati anche per imponibile/imposta o
   aggiungere una colonna che dichiara la non quadratura, poi seguire il
   ciclo consueto (test puro con controprova, banco browser se serve,
   worktree isolata, giro, commit, checkpoint, push).
2. Poi **Genesi** (`D2.tratti` non azzerato su "Apri", `genesi.html:5311-5359`).
3. Poi **Flotta** (doppio invio su `btn-rif`/`btn-cos`, `index.html:~5119-5164`
   e `~4523`) — probabilmente il fix giusto è generalizzare `occupato()` a
   questi due bottoni, verificando anche ricambi/mezzi/scadenze/budget.
4. Poi **Scudo** (due difetti: `abilitazioneLavoratore`/`pillReq` senza il
   ramo "senza data"; `csvRegistroInfortuni` senza categoria/anonimato).
5. Verificare `docs/MAPPA_ECOSISTEMA.md`, modificato da un agente di
   ricerca sui ponti (a219f0738b2b4685d) ancora in corso/appena tornato:
   leggere il diff prima di committare, per assicurarsi che sia solo
   l'aggiornamento di una riga di stato come da mandato.
6. Mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
