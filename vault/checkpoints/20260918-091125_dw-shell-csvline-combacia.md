# Checkpoint — 2026-09-18T09:11:25Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c3edd823 — fix(shared): dw-shell.js — ordine trim/guardia in parseCsvLine, _combacia stringe a prefisso contiguo

## Cosa è stato completato
Dal deep-pass su `shared/deepwork-id-client/dw-shell.js` (agente
a8b61df04b0af6417, tre difetti veri trovati), chiusi i primi due:

1. **`parseCsvLine` perdeva lo spazio bianco protetto dalla guardia
   anti-formula** su `" =cmd"` e `"\t=cmd"` (il terzo caso, `"\r=cmd"`,
   sopravviveva per un motivo collaterale — `\r` fa scattare le
   virgolette a monte). Il `.trim()` sui campi non quotati arrivava
   DOPO aver tolto l'apostrofo di guardia messo da `csvCell`, quindi lo
   spazio protetto restava scoperto in prima posizione e veniva
   tagliato. Scambiato l'ordine: trim prima (un apostrofo non è spazio
   bianco, il trim non lo tocca), guardia dopo.
   Verifica: nuovo test isolato diretto su `shell.parseCsvLine`/
   `shell.csvCell`, SENZA passare dall'array condiviso `CATTIVI` — il
   primo tentativo lì aveva prodotto 16 falsi KO, perché quasi tutti i
   lettori applicativi trimmano già il campo "nome" per conto proprio
   dopo `parseCsvLine` (scelta ragionevole, un nome non comincia con un
   tab). Il fix resta corretto rispetto al contratto dichiarato di
   `parseCsvLine`; il test isolato lo prova senza contaminare i round
   trip applicativi.

2. **`_combacia`/`fileDiAltraTabella`**: il riconoscimento "inizio di
   una tabella nota" accettava sottosequenze CON BUCHI dell'header, non
   solo prefissi contigui — un file legittimo con un sottoinsieme di
   colonne dai nomi comuni ("nome;area;stato") veniva scambiato per il
   file di un'altra app. Misurato PRIMA di stringere (regola CLAUDE.md):
   i cross-match a buco erano una parte misurabile dei match totali
   rilevati contro `CSV_TABELLE`; dopo la stretta a prefisso-contiguo
   restano solo le ambiguità di prefisso vere (stesso inizio letterale
   di header, inevitabili). Nuovo test con un caso a buchi (rifiutato
   dopo il fix) e un vero prefisso contiguo (ancora riconosciuto).

## Verifica
- KPI: 3140 → **3142**.
- Giro completo su worktree isolata (`/tmp/wt-shell`): **41 comandi a
  posto, 0 caduti**. Asserzioni: **4137** (documenti corretti da 4135).
  9-suite sum: **3.636** (3142+330+83+32+9+8+7+3+22), addendi
  verificati uno per uno contro la loro suite dal giro stesso.
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti, confermato PRIMA
  del commit.
- Diff isolato a 6 file (`shared/deepwork-id-client/dw-shell.js`,
  `apps/deepwork-id/tests/run-kpi.mjs`, `docs/DEVELOPMENT.md`,
  `docs/STATO_PRODOTTO.md`, `docs/DECISIONI_WEEKEND.md`,
  `vault/ROADMAP_SETTIMANA.md`), staged da copia worktree via
  hash-object+update-index, mai toccato l'albero di lavoro principale.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Prossimo passo atomico
1. **Terzo difetto dello stesso report, non ancora implementato**:
   `leggiCsv` vs `parseCsvLine` — `leggiCsv` (~righe 1595-1628) applica
   il suo `senzaGuardia` a OGNI campo indipendentemente dal fatto che
   fosse quotato, senza rispettare la distinzione quotato/non-quotato
   che `parseCsvLine` dichiara esplicitamente: un campo quotato apposta
   per preservare spazi di contorno (es. una causale bancaria
   `"  SALDO  "`) li perde comunque in `leggiCsv`. Leggere per intero
   `leggiCsv`, capire quanti consumatori dipendono dal comportamento
   attuale prima di stringere, poi isolare in una worktree nuova.
2. Item minore, non un difetto attivo: `scadenzeDiChiLavora`
   (shared/dw-ponti.js, ponte P3 lato Scudo) importato/ri-esportato da
   Scudo ma mai chiamato — Scudo reimplementa a mano la stessa logica
   in index.html:2789-2813. Nessuna divergenza misurata oggi; da
   tenere d'occhio, non da correggere ora.
3. Continuare "mai fermarsi": mantenere ≥3 cantieri paralleli. Dopo
   questa unità dispatchare nuovi agenti di deep-pass QA in background
   su superfici con copertura più leggera (o un ulteriore giro su
   app già coperte), sempre verificando ogni finding contro il codice
   attuale prima di agire.

## Blocchi
Nessuno.
