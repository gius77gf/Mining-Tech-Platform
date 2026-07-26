# Checkpoint — 2026-07-22T19:45:00Z

## Tipo
unit-complete (skill settimanale — funzione di ricerca continua · direttiva fondatore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — weekly-kickoff: ricerca continua)

## Completato
Inserita la funzione di ricerca nella skill settimanale (richiesta fondatore
21/07: "una /deep-research ogni volta che puoi… soprattutto nei tempi morti…
inserisci anche la funzione di ricerca nella skill settimanale").
- `.claude/skills/weekly-kickoff/SKILL.md`:
  - nuova sezione "Funzione di ricerca continua (deep-research)": lancia la
    ricerca in BACKGROUND (Workflow deep-research; fallback Agent+WebSearch se il
    workflow fallisce), a rotazione sulle app, domanda-tipo su fondamenta
    open-source dei competitor e migliorie concrete IN STILE, traduzione in unità
    verificate, con l'avvertenza di NON gonfiare (passi, non parità);
  - aggiornato il prompt-contratto della routine (sezione 5): aggiunto punto 7
    (nuove deep-research a rotazione) alla lista "SE LA ROADMAP SEMBRA FINITA" e
    un paragrafo "RICERCA NEI TEMPI MORTI".

Nota tecnica: la routine live NON si può aggiornare nel prompt in place
(`prompt_update_disabled`); erediterà il nuovo contratto al prossimo
/weekly-kickoff (che fa delete+create). La ricerca è comunque già attiva in
questa sessione (deep-research sui fondamenti open-source dei competitor lanciata
in background).

## Prossimo passo atomico
Aprire PR della skill. Attendere/usare i risultati della deep-research in corso
per proporre migliorie a Genesi in stile (dopo il via del fondatore sulla PR
estetica #321). Continuare, nei tempi morti, con deep-research a rotazione sulle
altre app.

## Blocchi
PR #321 (estetica Genesi) lasciata aperta per il giudizio del fondatore.
Decisioni gated in DECISIONI_WEEKEND.md. Non gonfiare i risultati.
