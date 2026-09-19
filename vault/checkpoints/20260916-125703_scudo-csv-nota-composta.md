# Checkpoint — 2026-09-16T12:57:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
cb482cdc

## Cosa è stato completato
Revisione di qualità post-commit sull'unità precedente (`scadenzaDenunciaInail`,
checkpoint `20260916-120640`): trovato che lo schermo mostrava già l'avviso di
denuncia INAIL nell'elenco eventi e nel modale "Perché è successo", ma i DUE
documenti che ESCONO verso un consulente/ispettore — `csvRegistroInfortuni` e
`fogliaCartella` — non lo portavano. È la stessa famiglia già scritta in
CLAUDE.md: *"dove un documento compone qualcosa che esce, chi decide i suoi
numeri deve essere la stessa funzione che li decide a schermo"*.

Modifiche a `apps/scudo/scudo-data.js`:
- `csvRegistroInfortuni`: la settima colonna ("nota") non sceglie più UN
  avviso con un `? :`, ma COMPONE un array (prognosi aperta · visita di
  rientro · denuncia INAIL), unito con " · ".
- `csvRegistroInfortuni` ha guadagnato un `oggi = new Date()` iniettabile
  (prima usava `new Date()` fisso internamente — bug di testabilità reale,
  trovato scrivendo il test: un termine "regolare" appariva "scaduto" perché
  il codice guardava la data vera del sandbox, non quella del test).
- `fogliaCartella` (che già usava `oggi` iniettabile): la sezione "Infortuni"
  del fascicolo ora porta la stessa nota di denuncia INAIL.

Test aggiunti/corretti in `run-kpi.mjs` (3094→3096): due nuovi blocchi che
coprono la composizione multipla di note, il caso "nessuna nota", il caso
"denuncia già presentata" (niente avviso pendente), e la data iniettabile nei
due sensi (regolare/scaduta). Durante la scrittura ho confuso
`cartellaLavoratore` (oggetto piatto senza `.sezioni`) con `fogliaCartella`
(che le sezioni le ha) — corretto puntando il test alla funzione giusta.

Ri-ancorata in `apps/deepwork-id/tests/browser/scudo-documenti.mjs` (punto 4
della tabella `DIFETTI`) l'iniezione che il refactor aveva reso orfana: la
vecchia citazione `aperta ? NOTA_PROGNOSI_APERTA : "",` non esiste più (la
riga è ora `if (aperta) note.push(NOTA_PROGNOSI_APERTA);`), e
`iniezioni-fresche.mjs` l'aveva presa correttamente (era caduta nel primo
giro isolato: `580 sul bersaglio su 581`). Ri-ancorata, poi confermata
`581 sul bersaglio su 581`.

Controprova: patch Python temporanea che disattivava il push della nota INAIL
nell'array (`if (false)`), confermato il test nuovo cadere col messaggio
atteso, ripristinato via `cp` + `diff`, confermato verde di nuovo.

Doc-cascade aggiornato in tutti e quattro i documenti sorvegliati
(`docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
`vault/ROADMAP_SETTIMANA.md`): run-kpi 3094→3096, somma nove suite
3.588→3.590, giro-totale 4066→**4068** (predetto e poi confermato due volte
dal giro isolato). `numeri-nei-documenti.mjs`: 43 passati, 0 falliti.

Verifica su worktree isolata: PRIMO giro (prima della ri-ancoratura
dell'iniezione) → 39/40 comandi, 1 caduto (`iniezioni-fresche.mjs`, atteso:
è esattamente il difetto di "documento invecchiato" che CLAUDE.md descrive —
il codice si è mosso perché è migliorato). Ri-ancorata l'iniezione, ricostruita
la worktree, SECONDO giro isolato → **40/40 comandi, 0 caduti, 4068
asserzioni**, addendi verificati (3096+330+83+32+9+8+7+3+22), matching coi
documenti. Aggiornato `docs/RICERCA_CONTINUA_SCUDO.md` con la chiusura di
questo finding (da fare nel prossimo passo, vedi sotto — non ancora chiuso al
momento di scrivere questo checkpoint).

Push: `cb482cdc` su `claude/scheduled-tasks-remote-control-bk4ap6`.

## Stato roadmap
Nessun task esplicito della roadmap settimanale interessato (era un finding
di revisione qualità, non un task pianificato). La riga di
`docs/RICERCA_CONTINUA_SCUDO.md` che segnalava questo gap va chiusa con ✅ e
l'hash `cb482cdc` — prossimo passo atomico.

## Prossimo passo atomico
1. Aprire `docs/RICERCA_CONTINUA_SCUDO.md`, trovare l'addendum più recente
   (quello che dice "⚠️ 16/09 — trovato in una revisione di qualità dopo il
   commit, non ancora chiuso... Non implementato ora...") e trasformarlo in
   una nota di chiusura ✅ che cita il commit `cb482cdc`.
2. Committare questo solo cambiamento di documentazione (append-only, non
   serve un giro isolato per un file `docs/` che nessuna pagina carica — ma
   verificare comunque con `numeri-nei-documenti.mjs` se la riga contiene
   numeri sorvegliati).
3. Poi, per la regola del non fermarsi mai: proseguire con la prossima unità.
   Candidati già emersi e non ancora scelti: (a) ASSENZA P2 (colonna di
   vocabolario condiviso su 11 CSV — più grande, richiede una decisione di
   design); (b) i validatori B/D e S/B di Genesi (bloccati: `computeKPI()`
   vive in `genesi.html` leggendo variabili globali di pagina, non testabile
   da `run-kpi.mjs` — serve uno scenario Playwright dedicato, non ancora
   scoping); (c) una nuova sovrapposizione nella mappa ecosistema
   (`docs/MAPPA_ECOSISTEMA.md` §1/§6 — al 12/09 "sovrapposizioni non
   collegate: 0", quindi va prima CENSITA una sovrapposizione nuova prima di
   costruire un ponte); (d) una passata "in profondità" su un'app scelta,
   aprendo ogni schermata, premendo ogni bottone che produce un file, come
   richiesto esplicitamente dal ciclo corrente del fondatore (kickoff del
   16/09, 12:45 UTC).
   Scelta consigliata per continuità: (c), perché la fase aperta dal
   fondatore il 26/08 privilegia esplicitamente "il prossimo ponte della
   mappa" come primo binario di lavoro, e il censimento di una sovrapposizione
   nuova è un'unità piccola e ben delimitata.

## Blocchi
Nessuno. Repository raggiungibile, worktree pulite dopo l'uso
(`git worktree list` → solo la working tree principale).
