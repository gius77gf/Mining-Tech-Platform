# Checkpoint — 2026-09-16T04:52:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0caac90b

## Cosa completato
- Implementato il **secondo delta del decimo giro di ricerca su Conti**
  (dopo `statoRecupero`): `statoPianoRientro` in `apps/conti/conti-data.js`
  — un accordo di pagamento a rate su una fattura scaduta, fra il
  sollecito e la messa in mora formale. Le rate sono lette come una
  CASCATA (ogni rata copre il cumulato fino a lì, non un incasso a sé) e
  tre esiti dichiarati, mai un "a posto" tacito: `rispettato` (le rate
  scadute sono coperte), `in-ritardo` (una rata sola, la successiva non
  ancora scaduta), `decaduto` (la rata in ritardo resta scoperta anche
  quando scade anche la rata dopo — il beneficio del termine si perde e
  il residuo torna nell'escalation intera del sollecito).
- **Prima fetta**, come `componentiDelMezzo`/`sezionePeggiore`: calcolo
  e lettura completi e testati (cascata, i tre esiti, rate corrotte
  scartate, movimenti filtrati per `fatturaId` e non un totale
  generico, piano assente vs piano senza rate valide). Il form per
  registrare un piano dalla fattura resta il passo successivo,
  additivo. **Deliberatamente NON tocca** sollecito/mora/aging/badge
  esistenti — sospendere l'escalation mentre un piano regge (come
  descritto nel documento di ricerca) è un secondo passo, perché quelle
  funzioni le misurano già decine di altre prove.
- Nuova collezione `pianiRientro` (live + demo) aggiunta a
  `CONTI_COLLEZIONI` — letta, scaricabile da "Scarica tutto".
- Wiring: badge in sola lettura nell'elenco fatture. Demo su f2
  (Stradesud): nessuna rata mai onorata, e la seconda è scaduta anche
  lei — il caso "decaduto", che mostra proprio la regola per cui la
  funzione esiste. **Deliberatamente non tocca `incassi` esistenti**:
  aggiungerne di nuovi a una fattura reale avrebbe spostato l'aging e
  l'esposizione di Stradesud, misurati già da decine di altre prove —
  lezione applicata da questa stessa sessione (Flotta/Scudo).
- Test in `run-kpi.mjs`: `statoPianoRientro` (cascata, "decaduto" solo
  con doppio mancato pagamento, movimenti di un'altra fattura non
  contano, rate corrotte, piano/rate assenti).
- Nuovo banco browser permanente `tests/browser/conti-piano-rientro.mjs`
  con controprova (il badge deve comparire sulla fattura GIUSTA: un
  refuso plausibile — confronto per `id` invece che per `fatturaId` —
  non lo vedrebbe nessuna suite `node`). 5/5 in normale, controprova
  cade come atteso (5 ok, 1 KO). Registrato in `tutti.mjs`.
- Verifica: `run-kpi` 3059/0, `run-stile` 330/0, `classi-orfane` 0/0,
  `funzioni-mai-usate` 0 da collegare, `nomi-liberi` 0 fuori scope,
  `copertura-funzioni` 0 senza prova. Giro isolato rilanciato due volte
  (la seconda dopo la correzione della copertura di Conti 214→215 e dei
  quattro documenti): **4024** asserzioni, 40/40 comandi a posto, 0
  caduti. `numeri-nei-documenti.mjs`: 43/0.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi
  3058→3059, somma nove suite 3.552→3.553, giro completo 4022→4024,
  copertura sei app 1031/1031→1032/1032, banchi browser 299→301 (130
  file distinti).
- Commit `0caac90b`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Nota tecnica per chi riprende
Il container di questa sessione si è riavviato UNA VOLTA a metà unità
(dopo aver scritto il codice e prima del primo giro isolato): l'albero
di lavoro (modifiche non committate) è sopravvissuto intatto, ma i
processi in background (il giro lanciato, `nomi-liberi.mjs`) sono stati
persi silenziosamente — ripartiti da capo senza perdita di lavoro, solo
di tempo. Vale la regola già scritta in CLAUDE.md sul contenitore che
torna indietro: dopo un'interruzione sospetta, `git status`/`git log`
per capire dove si è, non fidarsi che un processo lanciato prima sia
ancora vivo.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Con questa unità sono chiusi ENTRAMBI
i temi più pronti del decimo giro di ricerca su Conti (storico solleciti
+ piano di rientro). Restano aperti: la decisione 22 di Scudo (quale
strada INAIL, con l'addendo sul certificato medico), manutenzione su
condizione di Flotta (verifica in cava), curva di costo/vita economica
e costo per tonnellata di Flotta (serve un ponte Flotta↔Terra), rischio
chimico/anagrafica attrezzature/notifiche automatiche di Scudo.

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Il form per registrare un piano di rientro dalla fattura (la
   "seconda fetta" di questa unità): un modulo che scrive `rate` su
   `pianiRientro`, e la sospensione dell'escalation del sollecito
   mentre il piano è `rispettato`/`in-ritardo` (riaperta da sé su
   `decaduto`) — tocca `statoScadenzaFattura`, la mora, l'aging: da
   fare con calma, misurando prima quante prove esistenti leggono quei
   punti.
2. Rotazione ricerca continua: Conti ha avuto un decimo giro completo
   (quattro temi, tutti e quattro tradotti in codice); il prossimo
   candidato è un secondo passaggio su Campo, Sentinella o Terra,
   oppure un tema già aperto in `RICERCA_CONTINUA_FLOTTA.md` che non
   richieda una decisione del fondatore.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
