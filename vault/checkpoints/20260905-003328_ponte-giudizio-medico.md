# Checkpoint — 2026-09-05T00:33Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
71161b02

## Completato
- Ricerca Scudo sulla sorveglianza sanitaria (metà sul mondo + delta dal
  meccanismo, commit f798f311) e i candidati (a) e (c) fatti: il ponte
  Scudo→Campo legge il giudizio del medico (`giudizio`, `prescrizioni`,
  stato «non-idoneo» che vince sui documenti), Campo lo scrive nella nota e
  nella riga col badge «Non idoneo» accanto a «In forza», Scudo mostra il
  testo delle prescrizioni; le due dimostrazioni portano i tre casi. run-kpi
  2603, controprova che cade; scudo-documenti 89/0, stati-non-misurati 81/81;
  giro node sulla copia 38/0.
- Documenti: prove 3.084, asserzioni 3.513, copertura 816/816.

## Prossimo passo atomico
Scudo, candidato (b) della stessa ricerca: quando il badge dell'idoneità
passa a «prescrizioni» o «non idoneo» (gestore `data-idon` in
`apps/scudo/index.html`, oggi cicla con `idoneitaSuccessivo` senza chiedere
niente), aprire la modale del core (`chiediValore`, già usata in quattro
punti) che chiede il TESTO delle prescrizioni (obbligatorio per
«prescrizioni», facoltativo per «non idoneo») e la DATA del giudizio
(`giudizioIl`, ISO, facoltativa); salvare `{ idoneita, prescrizioni,
giudizioIl }`; scrivere «giudizio del …» nella riga e nel CSV del personale
(colonna in coda, `csvPersonale` — verificare con `grep -n "idoneita;"`).
Niente «ricorso entro 30 giorni». Prove in run-kpi (la funzione pura che
valida il giudizio, es. `giudizioIdoneita(stato, testo, data)` → oggetto o
motivo), banco browser che tocca il badge e legge la modale, controprova.

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.
