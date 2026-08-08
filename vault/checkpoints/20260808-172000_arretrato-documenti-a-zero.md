# Checkpoint — 2026-08-08 17:20 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`57b6ca3` — docs: l'arretrato dei sei documenti del delta torna a ZERO

## Che cosa è stato completato

`documenti-invecchiati.mjs` segnava **due ⛔** — Scudo e Sentinella — e un
arretrato di **11 commit**. Erano lì per **due modifiche mie di poche ore
prima**: è la direttiva 7 nel suo caso più diretto, *chi chiude un'unità
aggiorna il documento che quell'unità tocca*.

Riverificato **leggendo**, non incollando una data. La distinzione conta: la
suite pretende che il commit dichiarato esista e abbia toccato il documento o
l'app — cioè guarda **le date**, non le righe. Che le righe reggano lo dice
solo chi le riapre.

| documento | intervallo | commit | che mordono | esito |
|---|---|---|---|---|
| Scudo | `924c442`→`079ebe3` | 1 | 1 | i sei verdetti reggono |
| Sentinella | `db04ac5`→`079ebe3` | 9 | 1 | le tredici reggono |
| Terra | `8583a0b`→`57c78cf` | 4 | **0** | niente da riaprire |

**Le prove, rifatte invece che ricordate.**
- Scudo: zero `xlsx`, `excel`, `jspdf`, `notific`, `controllo version`,
  `versionamento`, `offline` sui due file di oggi **e** sulle 93 righe aggiunte.
  E il conto degli export — la riga già scaduta **due volte** — resta
  **cinque**, ricontato aprendo i nomi dei file: `scudo_azioni_correttive`,
  `scudo_azioni_copia`, `scudo_personale_scadenze`, `scudo_registro_infortuni`,
  `scudo_riepilogo_near_miss`. L'unità di stasera ha cambiato *che cosa c'è
  dentro* una colonna, non *quanti file escono*: è esattamente la distinzione
  che quella riga, scadendo due volte, insegna a fare.
- Sentinella: nessuna delle tredici confermate riguarda il responsabile, e non
  è un giudizio a occhio — quelle tredici parlano di **condizioni della misura**
  (umidità, temperatura, vento), di **come esce il documento** (report
  periodico, FFT, PDF/Excel) e di **quanto ci si mette ad accorgersene**
  (allarmi). Una funzione che sceglie una *frase* non costruisce niente di ciò.
- Terra: nessun commit morde, e aprendo il diff si vede perché — un inchiostro
  alzato per il contrasto (`--ink-dg`, 3,88 → 5,72 sul fondo più chiaro), un
  `m³` avvolto nella sua `<span class="u">`, il passaggio ad `applicaPercorsi`.

⚠️ **Terra è stata scritta anche se non mordeva**, ed è il punto meno ovvio: un
arretrato che nessuno chiude si legge come un ritardo anche quando è **rumore**.
Dichiararlo rumore costa quattro righe e toglie una domanda a chi legge.

## Misura

**Arretrato 11 → 0 commit, 2 ⛔ → 0**, tutti e sei ✓ — la prima volta che i sei
documenti del delta sono tutti allineati al committato. Verificato sulla copia
di ciò che si committava (worktree da `HEAD` + `diff --cached | git apply`).

## Prossimo passo atomico

Raccogliere il **giro del browser** (PID 16670, oltre 5h30, registro
`scratchpad/nomi4/giro-nuovo.txt`): controllare **prima** che stia ancora
crescendo (due `stat` a venti secondi), poi
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` — **sezione 1
prima della 2**, e dentro la 2 le righe «**non ho guardato**» prima dei KO.
⚠️ Attesta `c3888fe`: nessuna delle quattro unità di oggi ci sta dentro, quindi
i suoi KO vanno letti come «su quel commit», non «adesso».
⚠️ E nel registro il rosso di una **controprova** è il verde del banco:
l'intestazione lo dichiara, ma va letta.

## Blocchi

Nessuno.
