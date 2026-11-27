# Checkpoint — 2026-09-18T09:57:46Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0eade5fc — fix(deepwork-id): la guardia sull'ultimo owner è atomica, e un membro rimosso/declassato perde subito la sessione

## Cosa è stato completato
Dal deep-pass QA su Deepwork ID (apps/deepwork-id/, esclusa tests/;
agente ab5116e35adea9d78) — i due difetti più gravi trovati finora in
questa sessione, perché toccano direttamente l'isolamento multi-tenant
fra organizzazioni concorrenti (il requisito fondante dell'ecosistema).

1. **Race TOCTOU su `countActiveOwners`** (`functions/index.js`,
   `updateMemberRole`/`removeMember`): il conteggio degli owner attivi
   veniva letto FUORI dalla transazione che poi scriveva. Due chiamate
   concorrenti su un'org con esattamente due owner attivi (una che ne
   declassa/rimuove uno, l'altra l'altro) potevano leggere entrambe "2",
   superare entrambe il controllo "<= 1" e scrivere entrambe:
   l'organizzazione restava a ZERO owner attivi, bloccata per sempre
   (`allow update: if isOwner(orgId)` diventa impossibile da
   soddisfare, nessuna funzione la recupera). Fix: lettura del
   conteggio (`tx.get(ownersQuery)`) e scrittura (`tx.update`/
   `tx.delete`) nella STESSA `db.runTransaction`, stesso meccanismo già
   in uso in `createOrganization`. Firestore serializza le transazioni
   in conflitto: la seconda vede il conteggio aggiornato dalla prima e
   fallisce col `failed-precondition` corretto.
2. **Nessuna revoca dei refresh token** dopo `removeMember`/
   `updateMemberRole`: i custom claims cambiano solo nel PROSSIMO
   token, ma l'ID token già in mano al client resta valido fino a
   un'ora o finché non lo rinfresca da sé, e le security rules si
   fidano ciecamente del claim nel token. Un membro appena rimosso o
   declassato poteva continuare a leggere/scrivere i dati dell'org da
   cui è appena uscito, in qualunque app dell'ecosistema. Fix:
   `revocaSessioni(uid)` (`admin.auth().revokeRefreshTokens`) chiamata
   sempre su `removeMember`, e su `updateMemberRole` solo quando il
   nuovo ruolo è meno privilegiato del precedente (`RUOLO_LIVELLO`:
   owner=3, admin=2, member=1) — mai su una promozione, dove un token
   vecchio sotto-privilegia e forzare un logout sarebbe UX inutile.

## Verifica
- Nuovo test di concorrenza in `run-fns.mjs`: due `updateMemberRole`
  simultanei (`Promise.allSettled`) sui due unici owner di un'org —
  exactly una delle due chiamate riesce, l'org resta con esattamente un
  owner attivo.
- Due nuovi test sulla revoca: un declassamento cambia
  `tokensValidAfterTime` (letto via `aauth.getUser`), una promozione
  no; `removeMember` la cambia sempre.
  ⚠️ **Nota di metodo**: la prima stesura di questi due test era
  scritta senza aver misurato lo strumento, ed è caduta: 3 KO al primo
  giro sull'emulatore. Misurato con uno script isolato contro
  l'emulatore Auth vero: `tokensValidAfterTime` ha risoluzione al
  SECONDO (stringa `toUTCString()`, niente millisecondi) — due
  chiamate a pochi millisecondi di distanza (com'erano scritte le
  prove) danno lo STESSO valore anche quando la revoca è avvenuta
  davvero; a 1500ms di distanza sono diversi. Corretto aggiungendo
  un'attesa esplicita di 1100ms prima di ogni azione che deve
  revocare, e usando persone nuove create apposta invece di riusare
  `amm` (già toccato dalla prova di corsa), per non dipendere dal suo
  stato residuo. Il terzo KO era un effetto a cascata: la prima
  versione rotta lasciava `amm` in uno stato non ripristinato, e un
  test successivo ("una membership SENZA utente Auth non uccide
  onMemberWrite") falliva per un motivo estraneo (login come `amm` con
  un ruolo sbagliato). Risolto insieme al fix principale.
- Suite `run-fns.mjs` sotto emulatori Firestore+Auth+Functions: 21 → 24
  test, **tutti verdi (0 falliti)**. Le 21 preesistenti restano verdi
  invariate: nessuna regressione sui guardrail già coperti (permessi
  owner/admin, ultimo owner sequenziale, inviti, `redeemInvites`).
- Giro completo `node` su worktree isolata: **41/41, 0 caduti**.
  Asserzioni: 4138 (invariato — `functions/index.js` non è importato
  da nessuna suite node-only, gira solo sotto emulatore).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti — inclusa la
  scomposizione della sicurezza aggiornata (141 → **144**, addendo
  funzioni 21 → **24**) in `docs/DEVELOPMENT.md` e
  `docs/STATO_PRODOTTO.md`, confermata contro le suite vere.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md (non toccato in questa unità: il
conteggio "141 con l'emulatore" non è la stessa famiglia della
narrativa storica dei fix delle app verticali — nessuna riga lì lo
dichiara come numero sorvegliato).

## Coda di lavoro — due unità verificate da agenti in background
1. **Campo — `testoConsegnaTurno` non mostra lo stato di un'azione
   correttiva HSE già aperta in Scudo**, a differenza di
   `rapportoGiornata` (righe 3572-3586) e dello schermo
   (`index.html:2870`). Il chiamante in `index.html:4618-4619` non
   passa `azioni: AZI_HSE` (a differenza della chiamata gemella a
   `rapportoGiornata`, `index.html:4639-4640`). Fix: passare `azioni`
   e usare `vociNonAPosto` in `testoConsegnaTurno` come già fa
   `rapportoGiornata`.
2. **Sentinella — `dataIt` locale in `sentinella-data.js:431-435` non
   valida il calendario** (a differenza della versione condivisa
   `shared/deepwork-id-client/dw-shell.js:1686-1689`, che usa
   `dataISOEsiste`): `dataIt("2026-02-30")` → `"30/02/2026"` invece di
   `"—"`. Usata nei documenti che escono (`reportConformita`,
   `rispostaReclamo`, `fogliaVolata`, bozze di azione correttiva);
   lo schermo usa la versione condivisa corretta. Un commento nel
   codice (`sentinella-data.js:2725-2729`) dichiara un comportamento
   che la funzione non ha — verificato falso eseguendo il codice.

## Prossimo passo atomico
Scegliere una fra le due unità sopra e isolarla in una nuova worktree.
Continuare "mai fermarsi": dopo aver chiuso una di queste, dispatchare
nuovi agenti di deep-pass QA in background su superfici non ancora
coperte in questa sessione (Genesi/pointcloud, shared/dw-app-ui.js, la
struttura estetica/browser), per mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
