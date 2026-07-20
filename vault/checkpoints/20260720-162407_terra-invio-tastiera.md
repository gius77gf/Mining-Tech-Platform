# Checkpoint — 2026-07-20T16:24:07Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
27bb68f

## Completato
Terra UX: Invio-per-inviare (enterSubmit) su form fronte (fro-*→btn-fro) e
rilievo (new-ril-*→btn-add-ril). Playwright: TERRA ENTER-SUBMIT OK.
PATTERN enterSubmit ora COMPLETO su tutte e 6 le app (come clearErr).

## Stato roadmap
Ciclo lunghissimo e produttivo (~33 unità, PR #128-#155). Coperti in modo
uniforme su tutte le app: tap-KPI, stati vuoti, validazioni con feedback,
recupero errore su input (clearErr), invio da tastiera (enterSubmit),
conferme sulle azioni distruttive; + sicurezza (2 XSS chiusi + parser CSV
puro) e suite test 113→148. Tutto via PR con CI verde e checkpoint per
unità.

## Prossimo passo atomico
Merge PR terra-invio (dopo CI verde), riparti branch da main. Le seconde
iterazioni UX trasversali (tap-KPI, stati vuoti, validazione+recupero
errore, invio tastiera, conferme delete) sono ora COMPLETE e uniformi su
tutte le 6 app. Prossima iterazione possibile: (a) focus automatico sul
primo campo del form quando si apre la relativa pagina, per iniziare a
digitare subito; (b) tornare al punto 4/5 (nuovi test o revisione core).
Scegliere UNA cosa piccola, verificare, commit+checkpoint+PR. Il lavoro
non finisce: continuare fino a esaurimento crediti.

## Blocchi
Nessuno.
