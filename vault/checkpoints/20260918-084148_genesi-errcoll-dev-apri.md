# Checkpoint — 2026-09-18T08:41:48Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
a8ed1d29 — fix(genesi): errore al colletto e deviazione persistono su Apri/export

## Cosa è stato completato
Dal terzo giro di deep-pass su Genesi (agente a9e03772971dd3763),
stessa identica famiglia del secondo giro appena chiuso (dir/costi):

`D2.errColl` (errore al colletto, m) e `D2.dev` (deviazione, % della
lunghezza) — due input veri del form, stessa card di B/S/diam — non
venivano scritti da `volSnapshot()`: gli UNICI due campi assenti su 34
censiti fra form/applyDesign/syncDesignInputs/guardie. Alimentano
`simulaPerforazione()` → la riga "Precisione di perforazione" della
scheda validatori (rischio proiezioni, badge colorato). Impatto reale
verificato dal vivo dall'agente: aprendo un secondo progetto senza
reload, il pannello mostrava il rischio calcolato con i valori del
progetto PRECEDENTE (caso riprodotto con `window.__genesi.D2`
iniettato: 0.9/14 di un progetto A restavano su un progetto B che non
li aveva mai salvati).

Applicato esattamente lo stesso pattern già usato per dir/costi:
scritti in `volSnapshot`, riletti su "Apri" con fallback esplicito ai
default del form (0,15 m / 2,5%) solo quando il progetto non li porta.

## Verifica
- Nuovo banco `genesi-errcoll-dev-non-persistono-su-apri.mjs`: 6/6
  normale, controprova isolata 4/6 (2 KO, i due giusti).
- Ri-ancorato `genesi-dir-costi-non-persistono-su-apri.mjs`: le due
  nuove righe del fallback si sono inserite fra `D2.valMat=…` e
  `if(D2.holes.length)…`, spezzando la sua ancora precedente.
  **Prima correzione tentata era sbagliata**: rimuovere anche `const
  _dsg=arr[i].design||{};` dall'ancora rompeva le righe successive di
  errColl/dev (che leggono `_dsg`), causando un `ReferenceError` reale
  e "la volata non si è aperta nel 2D" invece del KO atteso — l'errore
  si è visto solo lanciando la controprova, non leggendo il diff.
  Corretto lasciando `_dsg` intatta, revertendo solo le cinque
  assegnazioni. Verificato: normale 6/6, controprova 4/6 (2 KO).
- `iniezioni-fresche.mjs`: 622/622 dopo entrambi i fix (era 621/622
  con l'ancora rotta — la stessa unità ha corretto due ancore diverse,
  una propria e una sorella).
- Registrate 2 righe in `tutti.mjs` per il nuovo banco.
- Giro completo su worktree isolata: **41 comandi a posto, 0 caduti**.
  Asserzioni: **4134** (documenti corretti da 4133). Banchi: 345 → **347**
  (+2). File distinti: 152 → **153**. 9-suite sum invariata (**3.633**,
  nessun test in run-kpi.mjs per questa unità). `numeri-nei-documenti.mjs`:
  43 passati, 0 falliti, confermato PRIMA del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. Unità Genesi chiusa. **Quinta ondata
(core + Scudo + ponti + Genesi) completa.**

## Cantiere lanciato e ancora in corso
**shared/deepwork-id-client/dw-shell.js**, deep-pass (agente
a8b61df04b0af6417) — mai letto per intero in questa sessione, segnalato
esplicitamente come scoperto dal precedente agente sui ponti
(dw-ponti.js). In corso.

## Prossimo passo atomico
1. Raccogliere il report su dw-shell.js quando arriva — verificare ogni
   difetto contro il codice ATTUALE prima di agire (lezione ripetuta
   più volte in questa sessione: uno dei report di oggi, il quarto giro
   su Scudo, era completamente stale).
2. Continuare "mai fermarsi": mantenere ≥3 cantieri paralleli aprendone
   di nuovi man mano che si chiudono. Candidati non ancora esplorati in
   questa sessione: ricerca continua sul mestiere della cava (rapporto
   di fine turno, denuncia annuale, ispettore) per un'app a rotazione;
   un secondo giro dedicato ai concorrenti per un'app diversa da
   Genesi; una revisione di qualità/sicurezza generale su ciò che è già
   su main.
3. Nessun riepilogo di chiusura, nessuna dichiarazione di sessione
   conclusa: al completamento di ogni unità si apre subito la
   successiva, fino all'esaurimento dei crediti.

## Blocchi
Nessuno.
