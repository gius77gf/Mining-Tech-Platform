# Checkpoint — «sta ancora scrivendo?» tarato: 25 secondi sono il minimo

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Tarata una regola che c'era già, e che stavo per applicare male.**

Andando a leggere il giro del browser (pid 21084, vivo da 2h33) ho fatto la
domanda giusta — *sta ancora scrivendo?* — ma con l'intervallo sbagliato: due
`stat` a **20 secondi**. Risposta: `0 byte`, e il registro fermo subito dopo
un'intestazione di sezione — cioè **esattamente la firma del piantone** che
`CLAUDE.md` descrive (un giro che si ferma a metà e le passate mai eseguite non
compaiono in nessuna riga).
Era un **falso allarme**: rimisurato su 55 secondi, sono arrivati **727 byte**.
Il giro era sanissimo, solo lento fra una schermata e l'altra.

Il costo di quell'errore non è teorico: avrei ucciso un giro da tre ore, o
peggio avrei scritto in un checkpoint che il giro si era piantato — e una
diagnosi sbagliata scritta con sicurezza manda il cantiere dopo a non provare la
strada giusta (è successo oggi, coi server orfani).

## La correzione, in `CLAUDE.md`
I venticinque secondi restano, ma dichiarati per quello che sono: **un minimo,
non la risposta**. E accanto c'è la domanda che **non ha falsi allarmi**, perché
non guarda il file ma il processo:
`ps -eo pid=,ppid=,time=` → il giro ha un **figlio vivo**, e il suo tempo di CPU
sale? Un figlio che macina sta lavorando. Nessun figlio, o un figlio a CPU ferma
da minuti, è il piantone vero.
⚠️ È la stessa forma di tutte le lezioni di oggi: **non calcolare a mano una
cosa che il sistema sa già dire.** «Il file è cresciuto» è un indizio;
«il processo figlio esiste e consuma» è la risposta.

## Stato
Il giro del browser è ancora in corso (2h34 al momento del controllo, banco
corrente vivo da 4 minuti). Non è ancora leggibile: `leggi-giro.mjs` va lanciato
a giro finito, partendo dalla **sezione 0** — attesta un commit di quindici
indietro, quindi i suoi KO andranno letti come vecchi di quindici commit.

## Prossimo passo atomico
Quando il giro finisce: `node apps/deepwork-id/tests/browser/leggi-giro.mjs
<registro>` → sezione 0 (età), poi le righe «**non ho guardato**», poi i KO,
separando il rosso VOLUTO con i marcatori `⚠️ CONTROPROVA` / `FINE CONTROPROVA`.
La domanda da fargli: **quali controprove non sanno più fallire** sul codice di
oggi.
In parallelo, e già pronto: portare al livello «aperto col browser» i nove
documenti di Conti fermi alla lettura, estendendo
`conti-documenti-che-escono.mjs`.

## Blocchi
Nessuno.
