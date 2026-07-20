# Checkpoint — 2026-07-20T16:58:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
222b49c

## Completato
Test: ogni stato nei dati demo è noto (Flotta mezzi, Conti gare, Terra
fronti/rilievi/piano), così un refuso di stato — che manderebbe in crash
il badge MB[stato]/GB[stato]/... nel tour — viene intercettato. Campo lo
faceva già. Verificato che le mappe badge coprono tutti gli stati
raggiungibili (mezzo "verifica", gara "persa" presenti → nessun crash
possibile dai pulsanti). run-demo verde 6/6 (assertion su test esistenti,
conteggio invariato).

## Stato roadmap
Integrità dati demo (tour) molto forte: id unici, tipi, date, riferimenti,
stati noti. Suite ~151. UX esaustiva. Sicurezza verificata (app+core
export clean, 2 XSS + 1 DSO corretti).

## Prossimo passo atomico
Merge PR test-demo-stati-noti (dopo CI verde), riparti branch da main.
NOTA per il fondatore/prossimo ciclo: il backlog autonomo sulle app
verticali è ora molto saturo. Vetrina tour: manca solo la dimostrazione
degli stati "conclusa" (attività Campo) e "persa" (gara Conti) — si
potrebbero aggiungere ai dati demo per mostrare tutti i badge, ma è una
scelta di vetrina (dati fantasia): valutare se farlo. Altri assi ad alto
valore richiedono il fondatore (Genesi, Firebase, dati reali, mitigazione
password) o sono fuori scope in questa sessione (repo ricerca
ecosistema-vault). Prossimo passo atomico possibile senza fondatore:
aggiungere ai dati demo un'attività "conclusa" (Campo) e una gara "persa"
(Conti) per completare la vetrina del tour — sono dati di esempio, sicuri
da toccare — con verifica visiva/Playwright. Poi continuare.

## Blocchi
Nessuno di tecnico. Nota: molte delle voci ad alto valore rimaste sono
decisioni del fondatore (weekend).
