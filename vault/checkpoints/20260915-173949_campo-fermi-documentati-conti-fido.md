# Checkpoint — 2026-09-15T17:39:49Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
1b0ca038

## Cosa è stato completato
Due unità.

**Unità 36 — implementata la fetta più piccola del delta di Campo**
sulla consegna di turno (dalla riverifica del sesto giro di ricerca,
checkpoint precedente): `avvisiChiusuraTurno` contava solo le
attività "in-corso" e le anomalie SENZA minuti come "da segnalare".
Un'anomalia con causale e minuti già scritti resta comunque "aperta"
(lo stato non passa mai da solo a "conclusa"), ma spariva
dall'avviso appena qualcuno finiva di compilarne la scheda — un
impianto ancora fermo veniva segnalato come "niente da fare". Aggiunto
`fermiDocumentati` (complementare a `fermiSenzaMinuti` sullo stesso
insieme di anomalie) al conteggio e al gate `niente`; mostrato in coda
al messaggio di chiusura turno, senza inventare nessuna nuova soglia
(non serviva: qui il criterio era binario, documentato/non
documentato, non "quanto" — a differenza del delta di Flotta che
aspetta una decisione del fondatore sulla soglia).

**Unità 37 — riverifica del quarto giro di ricerca su Conti** (fido
cliente, confrontato con prassi B2B e sistemi enterprise che sommano
anche gli "unbilled orders" all'esposizione). Verificato di persona:
`esposizioneClienti` non ha nessun parametro per le pesate/DDT, tutte
le quattro chiamate nella pagina passano solo `FAT`; 8 pesate in demo
con `fatturaId: null` restano fuori dal conto usato da
`avvisoFidoPesata`. Conti aveva già il meccanismo (dal terzo giro,
11/09) sulle fatture — il delta è specifico: in un ciclo a
fatturazione differita un cliente vicino al fido può restare "in
regola" per settimane mentre il materiale già consegnato lo ha già
superato. Committato l'append, nessun codice toccato.

Con questa il conto delle ricerche riverificate di persona oggi sale a
8 su 8 (7 vere as-is, 1 — la mancanza n. 2 di Flotta — corretta prima
di tradurla in codice).

## Verifica
- `run-kpi.mjs`: 3024 passati, 0 falliti (era 3023)
- `run-stile.mjs`: 328 passati, 0 falliti
- Controprova su `avvisiChiusuraTurno`: tolto `fermiDocumentati` dal
  gate `niente`, la prova nuova cade; ripristinato byte-identico
- `copertura-funzioni.mjs`: 0 funzioni scoperte (1013/1013)
- Giro isolato su worktree (`giro-node.mjs`, terzo lancio della
  sessione): 39/40 comandi a posto — l'unico caduto è il doc-cascade
  check, atteso. Misura reale "asserzioni eseguite dal giro": **3.931**
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti dopo la correzione
  finale della cascata
- Grep di riverifica su Conti: due comandi rilanciati, uscita
  identica a quella citata dall'agente
- Push riuscito al primo tentativo su entrambi i commit:
  `6bf213d9..e6420486`, `e6420486..1b0ca038`

## Stato roadmap
Campo: il delta sulla consegna di turno ha ora una fetta fatta
(fermi documentati ma aperti visti dall'avviso); resta la mancanza più
cara (conferma di ricezione per singola voce), dichiarata esplicitamente
come tale, da riprendere con più tempo perché serve un meccanismo
nuovo, non un campo in più su un oggetto esistente.
Conti: il delta sul fido/esposizione è documentato con un "non c'è"
verificato; tradurlo in codice richiede decidere se e come sommare le
pesate non ancora fatturate all'esposizione — non un lavoro a rischio
tecnico ma una scelta di prodotto (che succede a un valore "impegnato"
quando la fattura viene emessa: si scala? si somma comunque finché
non è incassata?), quindi da proporre come voce di
`docs/DECISIONI_WEEKEND.md` piuttosto che implementare a naso.

## Prossimo passo atomico
Il ciclo prosegue senza fermarsi. Strade aperte, in ordine di
prontezza:
1. Scrivere le voci #25 (soglia di sostituzione mezzi, Flotta) e #26
   (esposizione fido: sommare le pesate non fatturate, Conti) in
   `docs/DECISIONI_WEEKEND.md`, sul modello delle voci #22-#24 già
   scritte oggi — entrambe richiedono la parola del fondatore prima di
   diventare codice.
2. Lanciare un nuovo giro di ricerca in background (rotazione:
   Sentinella o Terra, i cui documenti sono i più vecchi rimasti fra
   le sei app dopo gli aggiornamenti di oggi su Genesi, Flotta, Campo,
   Conti e Deepwork ID).
3. In alternativa, continuare con seconde iterazioni delle app
   verticali (punto 1 della lista "se la roadmap sembra finita" di
   CLAUDE.md): CRUD mancanti, filtri, validazioni, stati vuoti.
Se questa unità si esaurisce prima di scegliere, la prossima riparte
da qui. Il ciclo continua senza fermarsi (regola del fondatore, mai in
pausa).
