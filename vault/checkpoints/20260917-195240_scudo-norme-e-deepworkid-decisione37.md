# Checkpoint — 2026-09-17T19:55:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
60997e7c

## Cosa è stato completato
Chiuso il compito interrotto dalla compattazione precedente: verificare (non
credere sulla parola) il report dell'agente di ricerca continua su NORME
prima di agire, poi due cantieri in parallelo mentre girava la verifica.

**Scudo (commit `60997e7c`)**: riverificato di persona `apps/scudo/scudo-data.js:3198-3262`
(`scadenzaDenunciaInail`) e `apps/scudo/index.html:1572` prima di fidarmi del
report. Confermato: le soglie numeriche erano già corrette (2 giorni
ordinario, 24 ore mortale, soglia 3 giorni), ma il campo/commento
descrivevano la ricezione del "certificato medico" — prassi pre-2015. Dal
D.Lgs 151/2015 il certificato va dal medico a INAIL per via telematica; il
datore riceve dal lavoratore solo il NUMERO identificativo. Corretti:
etichetta+title del campo, il commento della funzione, le due frasi
`motivo` mostrate all'utente. Aggiornato anche il test che ne verifica il
testo (`run-kpi.mjs:21158`, regex più larga). Controprova fatta: rimesso il
vecchio testo → 3112/1 (test cade); ripristinato → 3113/0.
`docs/RICERCA_CONTINUA_NORME.md` committato come append puro (verificato
`git diff --stat`, 59 inserimenti, 0 rimozioni).

**Deepwork ID → decisione 37**: una seconda ricerca continua (angolo nuovo:
il token già in mano a un membro rimosso, non chi lo assegna) ha trovato che
né `removeMember` (`functions/index.js:206`) né `updateMemberRole` (riga
182) chiamano `revokeRefreshTokens` — un ex membro mantiene un token valido
coi permessi vecchi fino a un'ora. Verificato di persona coi due `grep`
citati nel report (entrambi a zero risultati, confermando il "non c'è").
Trovato anche che lo stato `disabled` (`ARCHITETTURA.md:47`) non lo scrive
nessuna funzione. Aggiunta **voce 37** a `docs/DECISIONI_WEEKEND.md` come
nuova sezione in cima (porta d'ingresso 23→24, verificato con
`numeri-nei-documenti.mjs`: 43 passati, roadmap-index coerente). Non
implementato di iniziativa: tocca l'isolamento multi-tenant e introduce un
logout forzato visibile — merita conferma esplicita, non un ritocco
silenzioso.

**Verifica**: worktree isolata (`git worktree add --detach HEAD` +
`git diff --cached | git apply` + `git add -A`), giro node completo lanciato
in background mentre correvano tre agenti (ricerca DeepworkID, deep-pass
Terra secondo giro, deep-pass Flotta secondo giro — nessuno dei tre ancora
tornato). Esito: **41/41 comandi, 0 caduti, 4092 asserzioni** — stesso
numero di ieri sera, confermando che la "instabilità" del totale era
davvero un falso allarme chiuso nel checkpoint precedente.

## Stato roadmap
Deep-pass completa su tutte le superfici (round 1) + round 2 in corso su
Conti/Scudo/Sentinella/Genesi/Core (chiusi) e Terra/Flotta (in corso,
agenti non ancora tornati). Ricerca continua: Campo, Core, Norme, DeepworkID
fatti in questa sessione; restano Mestiere, Parole, Assenza, Terra, Conti,
Sentinella, Scudo, Genesi, Flotta per il prossimo giro di rotazione (via
`git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`).
Decisioni aperte in `docs/DECISIONI_WEEKEND.md`: **24** (33-37 aggiunte in
questa sessione).

## Prossimo passo atomico
1. Attendere il ritorno dei due agenti di deep-pass (Terra, Flotta) e
   dell'agente di ricerca DeepworkID (quest'ultimo già tornato e chiuso in
   questo checkpoint) — verificare ogni finding di persona prima di agire,
   come sempre.
2. In assenza di nuovi ritorni: continuare la rotazione di ricerca continua
   sul prossimo file più stale (`git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`
   dopo questo commit — probabile DeepworkID di nuovo aggiornato, quindi il
   prossimo sarà Mestiere o Parole, dedurre dalla data reale).
3. Continuare a lavorare fino a esaurimento crediti, senza fermarsi: se non
   arrivano nuovi ritorni entro breve, aprire un nuovo cantiere (terza
   iterazione deep-pass, o nuova ricerca) invece di aspettare fermi.

## Blocchi
Nessuno.
