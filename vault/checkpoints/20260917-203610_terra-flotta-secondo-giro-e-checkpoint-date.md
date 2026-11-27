# Checkpoint — 2026-09-17T20:36:10Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7c59b210

## Cosa è stato completato
Due unità, entrambe verificate con giro node completo su worktree isolata
prima del commit.

**Checkpoint mal datato (commit `fe0d1d46`)**: il checkpoint scritto nel
blocco precedente (`20260917-195500_...md`) è entrato in git alle 19:52:40Z
col nome che dichiarava 19:55:00 — due minuti e venti secondi avanti, stessa
causa già presa due volte (13/08, 15/09): il nome scritto stimando l'ora
invece di leggerla da `date -u` prima di creare il file. Rinominato col nome
giusto (`20260917-195240_...md`, stesso contenuto) e aggiunta la terza
eccezione dichiarata in `SCUSATI` di `date-checkpoint.mjs` per il percorso
vecchio, che resta nella storia (riscriverla è distruttivo, fermo al
fondatore). Presa dal PRIMO giro node completo lanciato su worktree isolata
per il blocco successivo.

**Terra + Flotta, secondo giro di deep-pass (commit `7c59b210`)**: due
agenti QA in background hanno chiuso il secondo giro su tutte le app +
core aperto nei blocchi precedenti (Terra e Flotta erano gli ultimi due).
- Terra: `sequenzaLotto` scriveva "il 80%" invece di "l'80%" (articolo a
  mano invece di `articoloNumero`), visibile sul badge "fuori sequenza"
  della dimostrazione.
- Flotta, tre difetti: (1) CSV con decimali punto-inglese invece di
  virgola italiana; (2) il libretto macchina non riportava mai il costo
  orario completo (`costoOrarioMezzo`) — aggiunta la riga; (3) `etaMezzo`
  mai mostrata a schermo, solo nel CSV — aggiunta all'intestazione della
  scheda, verificato dal vivo con Playwright.
- Dalla ricerca continua su Mestiere (tornata 3, libretto d'uso e
  manutenzione): `PIANI_TAGLIANDO` non dichiarava la fonte dei suoi passi
  a ore — aggiunto un campo `fonte`.
Ogni fix con test + controprova. Aggiornati i quattro documenti che
dichiarano il totale prove (3.610) e corretta in due di essi la falsa
affermazione «il totale del giro oscilla a parità di codice» (era il
confronto fra un numero di un commit vecchio e una misura fresca).
Giro finale: 41/41 comandi, 0 caduti, **4095** asserzioni.

Anche la ricerca continua su DeepworkID (angolo: token già in mano a un
membro rimosso) ha prodotto la **voce 37** di `DECISIONI_WEEKEND.md`
(commit precedente `60997e7c`): né `removeMember` né `updateMemberRole`
chiamano `revokeRefreshTokens`, e lo stato `disabled` dichiarato non lo
scrive nessuna funzione. Non implementato di iniziativa: tocca
l'isolamento multi-tenant e introduce un logout forzato visibile.

## Stato roadmap
Deep-pass **secondo giro completo** su tutte le sei app + core (Conti,
Scudo, Sentinella, Genesi, Core, Terra, Flotta tutti chiusi in questa
sessione). Ricerca continua: Campo, Core, Norme, DeepworkID, Mestiere
fatti in questa sessione; prossimo file più stale da ricontrollare con
`git log -1 --format=%ci -- docs/RICERCA_CONTINUA_*.md`.
Decisioni aperte in `docs/DECISIONI_WEEKEND.md`: **24**.

## Prossimo passo atomico
1. Determinare il prossimo topic di ricerca continua a rotazione (il più
   stale dopo Mestiere) e lanciare un agente in background.
2. In parallelo, aprire almeno altri due cantieri (regola delle tre app
   insieme): terza iterazione deep-pass su un'app a scelta, o
   implementazione di una delle decisioni 33-37 SE arriva una risposta
   (nessuna finora in questa sessione).
3. Continuare a lavorare fino a esaurimento crediti, senza fermarsi.

## Blocchi
Nessuno.
