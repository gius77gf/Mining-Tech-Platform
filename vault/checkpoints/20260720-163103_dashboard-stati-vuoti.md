# Checkpoint — 2026-07-20T16:31:03Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7ea8ad6

## Completato
Stati vuoti nelle liste del QUADRO (dashboard): Campo oggi-list ("Nessuna
attività in corso: la giornata è tranquilla.") e Terra dash-fronti
("Nessun fronte: aggiungine uno dalla sezione Fronti."). Erano le ultime
due liste dell'ecosistema senza stato vuoto (le liste-sezione erano già
coperte in un'unità precedente). Syntax OK; Playwright: CAMPO DASH EMPTY
OK (con attività=[] rende il messaggio).

## Stato roadmap
Ora TUTTE le liste dell'ecosistema (sezioni + riassunti del quadro) hanno
uno stato vuoto. Ciclo enorme: UX uniforme (tap-KPI, stati vuoti completi,
validazione+recupero errore, invio tastiera, focus-return, conferme
delete) + sicurezza (2 XSS) + suite test 113→148.

## Prossimo passo atomico
Merge PR dashboard-stati-vuoti (dopo CI verde), riparti branch da main.
Le seconde iterazioni UX trasversali sono ora molto complete. Prossimo:
diversificare — candidato punto 4 (test): aggiungere a run-kpi un test su
scudo.statoScadenza per il caso dataISO vuoto/assente (oggi la funzione fa
new Date(undefined+"T00:00:00") → Invalid Date → giorni NaN; verificare il
comportamento reale e, se problematico, gestirlo; se accettabile,
documentarlo con un test). In alternativa: un ulteriore controllo di
sicurezza mirato sul core, o tornare al punto 1 con focus-return sui form
secondari. Scegliere UNA cosa piccola, verificare, commit+checkpoint+PR.
Continuare fino a esaurimento crediti.

## Blocchi
Nessuno.
