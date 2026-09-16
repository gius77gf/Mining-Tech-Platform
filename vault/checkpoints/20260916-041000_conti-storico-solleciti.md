# Checkpoint — 2026-09-16T04:10:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
343e896f

## Cosa completato
- Implementato il **delta più pronto della ricerca continua su Conti**
  (decimo giro, riverificato indipendentemente il 16/09): `statoRecupero`
  in `apps/conti/conti-data.js`. `livelloSollecito`/`testoSollecito`
  ricalcolano il livello dal solo ritardo di oggi, ogni volta, senza
  sapere se una lettera è già PARTITA — un log leggero
  (`fattura.solleciti: [{livello, data, canale}]`, scritto SOLO quando
  l'utente conferma un invio già avvenuto, nessun invio automatico) rende
  "mai comunicato" uno stato dichiarato invece di un livello zero, e
  confronta il livello segnato con quello che il ritardo attuale
  implicherebbe.
- Vocabolari chiusi `LIVELLI_SOLLECITO_VALIDI` (1-3), `CANALI_SOLLECITO`
  (email/pec/telefono/altro) + `nomeCanaleSollecito`: righe corrotte
  (livello fuori scala, data inesistente, canale ignoto) si scartano
  come fa ogni altro lettore di questa app.
- Wiring: bottone "Segna come inviato" accanto a "Sollecito" (solo su
  fatture scadute), modale con lo storico + form data/canale, possibilità
  di rimuovere una registrazione sbagliata (si toglie e si rifà, come
  per gli incassi). Nell'elenco fatture, un badge compare SOLO quando
  c'è qualcosa da segnalare — "Mai comunicato" o "Sollecito da
  aggiornare" — per non affollare la riga con uno stato quieto (`.meta`
  è già clampata a due righe, CLAUDE.md docet).
- Demo arricchita: f1 (Edilcave, 2026/031) porta un sollecito di livello
  1 mandato il 15/07/2026, mentre il ritardo di oggi (~70 gg) implica il
  livello 3 — mostra il caso vero per cui la funzione esiste.
- Test in `run-kpi.mjs`: `statoRecupero` (mai comunicato, ordine per
  DATA non per posizione, righe corrotte scartate, canale ignoto →
  `null`, fattura non scaduta), `nomeCanaleSollecito`,
  `LIVELLI_SOLLECITO_VALIDI`/`CANALI_SOLLECITO` (referenziati per nome:
  `copertura-funzioni.mjs` li marcava scoperti finché non sono citati
  esplicitamente `conti.X`, non basta che li usi `statoRecupero`
  internamente).
- Nuovo banco browser permanente `tests/browser/conti-solleciti-storico.mjs`:
  il bottone deve aprire la modale sulla fattura GIUSTA (controprova:
  l'ID scambiato per il NUMERO della fattura — un refuso plausibile, due
  stringhe sullo stesso oggetto — non lo vedrebbe nessuna suite `node`),
  e la registrazione deve sopravvivere alla chiusura della modale (letta
  dal record salvato dopo il refresh, non dallo stato transitorio del
  form). 12/12 in normale, controprova cade come atteso (5 ok, 3 KO).
  Registrato in `tutti.mjs`.
- Verifica: `run-kpi` 3055→3058, `run-stile` 330/0, `classi-orfane` 0/0,
  `funzioni-mai-usate` 0 da collegare, `nomi-liberi` 0 fuori scope.
  Giro isolato su worktree (rilanciato due volte, la seconda dopo la
  correzione della copertura di Conti 205→214 fondo): **4022** asserzioni,
  40/40 comandi a posto, 0 caduti. `numeri-nei-documenti.mjs`: 43/0.
- Doc-cascade aggiornato in tutti e quattro i documenti: run-kpi
  3055→3058, somma nove suite 3.549→3.552, giro completo 4018→4022,
  copertura sei app 1027/1027→1031/1031, banchi browser 297→299 (129
  file distinti).
- Commit `343e896f`, pushato su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Unità collaterale (stesso blocco)
Ricerca in background (haiku) sulla denuncia INAIL in Scudo, appesa a
`docs/RICERCA_CONTINUA_SCUDO.md` (undicesimo giro), con ogni "non c'è"
riverificato a mano col suo `grep`. Confrontata con `docs/
DECISIONI_WEEKEND.md` PRIMA di scrivere: il tema non era nuovo (decisione
22, ottavo giro, 15/09, già copre le tre scadenze INAIL) — invece di
aprire una decisione duplicata ho aggiunto un addendum alla 22 col solo
dettaglio davvero nuovo (i termini decorrerebbero dalla data di
ricezione del certificato medico, non dall'evento — non verificato sulla
norma primaria, dichiarato tale). Commit `3ac4ace7`, già pushato.

## Stato roadmap
Vedi `vault/ROADMAP_SETTIMANA.md`. Aperti: manutenzione su condizione di
Flotta (da verificare in cava prima del codice), curva di costo/vita
economica e costo per tonnellata di Flotta (serve prima un ponte
Flotta↔Terra), rischio chimico/anagrafica attrezzature/notifiche
automatiche di Scudo, piani di rientro di Conti, e la decisione 22 di
Scudo (quale delle tre strade INAIL) che aspetta il fondatore.

## Prossimo passo atomico
Candidati aperti, in ordine di prontezza:
1. Piani di rientro in Conti (dal delta della ricerca continua, decimo
   giro): un percorso a rate tracciato per un cliente che non onora una
   fattura, che sospende l'escalation del sollecito finché il piano
   regge e la riapre da sé al primo mancato pagamento di una rata. Si
   colloca fra `statoRecupero` (appena chiuso) e la messa in mora
   formale. Costo da stimare leggendo per intero la voce nel documento
   di ricerca prima di scrivere codice.
2. Rotazione ricerca continua: Conti e Scudo hanno avuto un decimo/
   undicesimo giro nelle ultime ore; un secondo passaggio su Campo,
   Sentinella o Terra è il prossimo candidato per bilanciare la
   rotazione, oppure un tema già aperto in `RICERCA_CONTINUA_FLOTTA.md`
   che non richieda una decisione del fondatore.
3. Non fermarsi qui per la regola del fondatore (esaurimento crediti):
   proseguire immediatamente con l'unità successiva.

## Blocchi
Nessuno.
