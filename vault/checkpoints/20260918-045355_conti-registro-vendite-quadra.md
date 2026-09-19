# Checkpoint — 2026-09-18T04:53:55Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
01e0c0d2

## Cosa è stato completato
Primo dei cinque difetti confermati-ma-non-corretti elencati nel
checkpoint precedente (20260918-043021): Conti, `registroVendite`/
`csvRegistroVendite` non controllava `riepilogoIvaFattura(f).quadra` — a
differenza delle sorelle `csvSituazioneFatture`/`xmlFatturaPA` — quindi
una fattura corretta con la matita (righe mai toccate, totali riscritti)
usciva nel registro IVA con imponibile/imposta dalle righe VECCHIE e un
totale_documento dai totali NUOVI.

Corretto ripiegando, quando i totali sono registrati e non tornano più
con le righe, sulla stessa forma già usata per una fattura senza righe
(una banda sola coi totali registrati) più un avviso in colonna
`causale`. **Prima stesura sbagliata, corretta subito**: condizionare
solo su `!rie.quadra` accendeva falsi positivi su ogni fattura fatta di
sole righe mai corrette (il caso normale della differita, dove `quadra`
è naturalmente falso perché i totali registrati sono 0 per costruzione).
Il controllo giusto — `haTotali && rie.daRighe && !rie.quadra` — è stato
trovato dai DUE test preesistenti (non nuovi) che sono andati in rosso
alla prima stesura: la disciplina "si lancia la suite dopo ogni modifica,
non solo il test nuovo" ha funzionato esattamente come deve.

Nuovo test puro con controprova in `run-kpi.mjs`. Giro isolato (worktree
a due strati: Conti da solo, poi Conti+Terra insieme — vedi sotto):
41/41, 3.622 prove, 4119 asserzioni.

## Stato roadmap
Rimangono da correggere, in ordine (vedi checkpoint 20260918-043021 per i
dettagli completi):
- **Genesi**: `D2.tratti` non azzerato su "Apri" (agente a4a466a27e1e80730).
- **Flotta**: doppio invio silenzioso su `btn-rif`/`btn-cos`, nessun
  `occupato()` (agente ade005a3e1c9bacf0).
- **Scudo**: due difetti — `abilitazioneLavoratore`/`pillReq` senza il
  ramo "senza data"; `csvRegistroInfortuni` senza categoria/anonimato
  (agente a76e56f7569610db8).

Aggiunti al blocco dal quinto giro di deep-pass appena arrivato:
- **Terra** (agente aa6670b8016ce8fa9): `anniConVolumi` — ultima copia
  della guardia calendario debole — GIÀ CORRETTO nel working tree, in
  attesa del prossimo commit (vedi "Prossimo passo atomico").
- **Conti**, DUE nuovi difetti dal quinto giro di deep-pass (agente
  a8b791e876bd4d072), NON ancora corretti:
  1. Una fattura "come non emessa" (scartata dallo SdI) resta credito
     vero in `kpiFrom`/`agingIncassi`/`fattureOltre90`/
     `esposizioneClienti`/`avvisoFidoPesata`/`concentrazionePortafoglio`
     — nessuna delle sei legge `statoSdi(f).nonEmessa`, mentre
     `sollecitabile`/`testoSollecito`/`estrattoContoCliente` la escludono
     già correttamente. Un cliente può risultare "oltre fido" con
     credito scaduto basato su un documento che, per la logica stessa
     dell'app, va prima rispedito perché non esiste ancora fiscalmente.
  2. `rigaPesata` (prezzo del DDT alla pesa) non applica MAI gli
     scaglioni di quantità, a differenza della sorella `rigaPreventivo`
     — il commento del modulo dichiara che ENTRAMBE fanno parte della
     stessa catena scaglioni/sconto/ordine, ma solo una lo fa davvero.
     La maggioranza dei DDT demo (pesata diretta, senza ordine) usa
     proprio il percorso cieco agli scaglioni.

## Prossimo passo atomico
1. **Committare il fix Terra** (`anniConVolumi`, già scritto e verificato
   con controprova nel working tree): costruire una worktree isolata da
   HEAD con SOLO `apps/terra/terra-data.js` e la porzione di `run-kpi.mjs`
   relativa (file già pronto in `/tmp/split2-run-kpi-conti-terra.mjs`, che
   ora coincide col working tree — verificare che `git diff` sia solo
   questi due file prima di `git add` diretto, senza bisogno di
   `hash-object`), lanciare `giro-node.mjs`, aggiornare i numeri se
   servono, commit, checkpoint, push. Il testo di roadmap per questa
   unità è già scritto in coda a `vault/ROADMAP_SETTIMANA.md` nel working
   tree (sezione "Terra — sesto anno-fantasma").
2. Poi, in ordine: Genesi (`D2.tratti`), Flotta (doppio invio),
   Scudo (due difetti), Conti (SdI-come-non-emessa, poi scaglioni su
   `rigaPesata` — quest'ultimo è il più delicato: tocca un prezzo di
   vendita, verificare con cura come vengono trattati i DDT già emessi
   prima di cambiare il calcolo per i nuovi).
3. **Nota di processo**: il volume di difetti confermati-ma-non-corretti
   continua a crescere (ora 2 nuovi solo da Conti). Considerare di
   rallentare la dispatch di nuovi giri di deep-pass finché l'elenco non
   si accorcia, per non lasciare accumulare lavoro trovato ma non fatto.
4. Mantenere ≥3 cantieri paralleli quando possibile, dando priorità però
   al fix del backlog rispetto a nuove scoperte.

## Blocchi
Nessuno.
