# Checkpoint — 2026-09-18T09:29:26Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
f35fbf70 — fix(shared): leggiCsv rispetta la distinzione quotato/non-quotato, come parseCsvLine

## Cosa è stato completato
Terzo e ultimo difetto del deep-pass su `shared/deepwork-id-client/dw-shell.js`
(agente a8b61df04b0af6417) — dopo `_combacia` e l'ordine trim/guardia di
`parseCsvLine` (già chiusi nel commit precedente, c3edd823).

`leggiCsv` non rispettava la distinzione quotato/non-quotato che
`parseCsvLine` dichiara esplicitamente: il suo `senzaGuardia` trimmava
OGNI campo con la stessa riga, indipendentemente dal fatto che fosse fra
virgolette — mentre le virgolette servono proprio a preservare gli spazi
di contorno. Una causale bancaria scritta apposta fra virgolette
(«  SALDO  ») li perdeva comunque, solo in `leggiCsv`: stessa regola
scritta due volte, una più debole dell'altra.

Aggiunto un tracciamento del "quotato" per campo (`campoQ`/`rigaQ`),
stessa forma dell'array `quotato` già usato in `parseCsvLine`;
`senzaGuardia(s, quotato)` trimma solo se il campo non era quotato, poi
toglie l'apostrofo di guardia anti-formula — stessa forma esatta delle
due funzioni gemelle, non due regole scritte a somiglianza.

## Verifica
- Nuovo test dedicato in `run-kpi.mjs` con quattro casi: campo quotato
  con spazi di contorno (preservati), campo non quotato con spazi
  (ripulito come sempre), giro andata/ritorno della guardia anti-formula
  su un numero negativo (`csvCell("-12,5")` → `leggiCsv` → `"-12,5"`),
  apostrofo vero dentro un campo quotato (spazi e apostrofo intatti,
  perché quello che segue l'apostrofo non è un innesco di formula).
  KPI: 3142 → **3143**.
- Giro completo su worktree isolata (`/tmp/wt-leggicsv`): **41 comandi a
  posto, 0 caduti**. Asserzioni: **4138**. 9-suite sum: **3.637**
  (3143+330+83+32+9+8+7+3+22), addendi verificati uno per uno dal giro
  stesso.
- **Nota di metodo**: il primo giro completo ha fatto cadere
  `numeri-nei-documenti.mjs` perché in `docs/STATO_PRODOTTO.md` esisteva
  una SECONDA occorrenza del totale (riga 215, la coda della narrativa
  storica dell'app — non la riga 235 già aggiornata) rimasta stale
  dall'unità precedente (parseCsvLine/_combacia), mai trovata dai miei
  `grep` mirati sul numero. Solo il giro completo, che confronta il
  numero VERO stampato con OGNI occorrenza sorvegliata nei documenti,
  l'ha presa. Corretta, poi rilanciato un secondo giro completo pulito
  prima di committare: 41/41, `numeri-nei-documenti.mjs` 43/0.
- Diff isolato a 6 file, staged da copia worktree via
  hash-object+update-index, mai toccato l'albero di lavoro principale
  prima del commit.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md. L'intero report di deep-pass su
dw-shell.js (tre difetti) è ora chiuso.

## Coda di lavoro — tre unità verificate da agenti in background, non ancora implementate
Durante questa unità sono arrivati tre report di deep-pass QA
indipendenti, tutti con evidenza diretta (file:riga, comandi eseguiti
ora, non dedotti). Nessuno ancora implementato:

1. **Campo — `testoConsegnaTurno` non mostra lo stato di un'azione
   correttiva HSE già aperta in Scudo**, a differenza di
   `rapportoGiornata` (stesso file, righe 3572-3586) e dello schermo
   (`index.html:2870`). Il chiamante in `index.html:4618-4619` non passa
   nemmeno `azioni: AZI_HSE` (a differenza della chiamata gemella a
   `rapportoGiornata`, `index.html:4639-4640`). Fix: passare `azioni` al
   chiamante e usare `vociNonAPosto` in `testoConsegnaTurno` come già fa
   `rapportoGiornata`.
2. **Deepwork ID — due difetti di sicurezza in `functions/index.js`**,
   i più gravi trovati finora in questa sessione (toccano l'isolamento
   multi-tenant):
   a. Race TOCTOU su `countActiveOwners` (righe 176-224,
      `updateMemberRole`/`removeMember`): due chiamate concorrenti
      possono entrambe superare il controllo "ultimo owner" e lasciare
      l'organizzazione a ZERO owner attivi, bloccata permanentemente
      (nessuna funzione la recupera). Manca un `runTransaction` (unico
      uso esistente: `createOrganization:111`).
   b. Refresh token non revocato dopo `removeMember`/`updateMemberRole`
      (nessuna chiamata a `admin.auth().revokeRefreshTokens(uid)`,
      verificato `grep` → 0 righe): un membro rimosso mantiene accesso
      Firestore effettivo fino a ~1h. Già "confermato" via grep
      indipendente in `docs/RICERCA_CONTINUA_DEEPWORKID.md:585-589`
      (non ancora in roadmap), riverificato ora sul codice attuale.
3. **Sentinella — `dataIt` locale in `sentinella-data.js:431-435` non
   valida il calendario** (a differenza della versione condivisa
   `shared/deepwork-id-client/dw-shell.js:1686-1689`, che usa
   `dataISOEsiste`): `dataIt("2026-02-30")` → `"30/02/2026"` invece di
   `"—"`. Usata nei documenti che escono (`reportConformita`,
   `rispostaReclamo`, `fogliaVolata`, bozze di azione correttiva, ecc.);
   lo schermo usa invece la versione condivisa corretta (import in
   `index.html:1907`). Innesco pratico limitato oggi (i tre percorsi
   d'ingresso filtrano già con `dataISOEsiste`), ma è la stessa famiglia
   "copia debole" già corretta nel core con lo stesso nome di funzione.
   Un commento nel codice (`sentinella-data.js:2725-2729`) dichiara un
   comportamento che la funzione non ha — verificato falso eseguendo il
   codice.

## Prossimo passo atomico
Scegliere una fra le tre unità sopra e isolarla in una nuova worktree.
Priorità suggerita per gravità: (2) Deepwork ID prima (sicurezza
multi-tenant fra organizzazioni concorrenti — il requisito fondante),
poi (1) Campo, poi (3) Sentinella. Continuare "mai fermarsi": dopo aver
chiuso una di queste, dispatchare nuovi agenti di deep-pass QA in
background su superfici non ancora coperte in questa sessione (es.
Genesi pointcloud, shared/dw-app-ui.js, la parte browser/estetica), per
mantenere ≥3 cantieri paralleli.

## Blocchi
Nessuno.
