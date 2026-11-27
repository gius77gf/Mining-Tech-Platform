# Checkpoint — 2026-09-21T10:07:14Z

## Tipo
manutenzione (nessun codice di prodotto toccato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
61e075a7 (test(genesi): banco per il giro di andata e ritorno del piano di innesco XML)

## Cosa è stato completato
Il `giro-node.mjs` lanciato in background dopo l'unità precedente ha
segnalato `date-checkpoint.mjs` caduto — **terza volta in questo stesso
blocco di lavoro** che un mio checkpoint è datato dopo il suo vero
ingresso in git: `20260921-095430_genesi-piano3d-chiuso.md`, entrato
alle 09:51:19Z, nome 09:54:30 (3 minuti e 11 secondi avanti) — questa
volta senza nemmeno la parola "circa": una stima pura.

- [x] Rinominato con `git mv` a `20260921-095119_…` (stesso contenuto,
  data corretta anche nell'intestazione del file).
- [x] Aggiunta l'ottava voce in `SCUSATI` di `date-checkpoint.mjs` per
  il percorso vecchio, con una nota esplicita sulla causa vera: non è
  la disattenzione su un file, è che la lettura di `date -u` non era
  diventata un passo **obbligato e separato**, chiamato come azione a
  sé immediatamente prima di ogni nome — tre volte nello stesso blocco
  lo dimostra.
- [x] Verificato: `date-checkpoint.mjs` torna **10/0**.
- [x] Rilanciato `giro-node.mjs` completo per avere il numero vero di
  asserzioni (il run precedente aveva contato 4274, ma con
  `date-checkpoint.mjs` caduto il conto non era pulito): in corso, da
  leggere alla prossima unità prima di propagare qualunque numero nei
  documenti tracciati — niente si scrive per stima, nemmeno un totale.

## Verifica prima del commit
`date-checkpoint.mjs`: **10/0**. `giro-node.mjs` completo in corso
(task in background), il suo esito decide il prossimo passo.

## Stato roadmap
Nessun codice di prodotto toccato.

## Prossimi passi
- **Prossimo passo atomico**: leggere l'esito del `giro-node.mjs`
  rilanciato, propagare il numero vero di asserzioni in
  `docs/DEVELOPMENT.md`/`docs/STATO_PRODOTTO.md` (oggi dicono 4283, un
  numero scritto nel run precedente e mai confermato pulito), poi
  proseguire. **Disciplina personale da questo momento**: chiamare
  `date -u` come azione a sé, separata, immediatamente prima di ogni
  nome di checkpoint — mai riusare un orario letto anche pochi minuti
  prima o dedotto dal contesto.
- Mandato del fondatore invariato: solo Genesi, massimo sforzo.

## Blocchi
Nessuno.
