# Checkpoint — 2026-07-21T03:13:59Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — feature Conti priorità incasso)

## Completato
Conti — **priorità di incasso** (quale fattura sollecitare per prima).
- conti-data.js: `prioritaIncasso(fatture, oggi)` → fatture aperte
  ordinate per ritardo (più scadute prima) e, a parità, per importo (più
  grosse prima); ogni voce porta i giorni di ritardo (0 se non scaduta,
  0 anche se senza data → non finisce in cima per errore).
- index.html: la sezione "Priorità" del quadro ora usa questo ordinamento
  (prima le fatture più urgenti, poi le gare in scadenza).
- run-kpi.mjs: +2 test (ordinamento ritardo+importo, esclude incassate;
  senza data=ritardo 0). Suite KPI 86→88; totale CI 196→198.
Verifica: KPI 88/0, syntax OK, screenshot (Edilcave 18.300 scaduta da 14
gg in cima, poi per importo). Coerente shell.

## Contesto (aggiornamento al fondatore, 21/07 notte)
Il fondatore ha chiesto un update ed è stato informato: ricerca su 7 app
fatta, 12 PR mergiate (#185-#198), suite 167→198, revisione pulita. Gli è
stato segnalato che il "ciclo chiuso" (il salto di qualità più grande)
richiede una SUA decisione architetturale (collezione condivisa → regole
Firestore) — vedi ecosistema-vault "Progetto — Ciclo chiuso dati di cava".

## Stato roadmap
Continuano le unità in-app che NON richiedono decisioni del fondatore né
ponti tra app. Restano epiche M isolate (Scudo matrice competenze, Campo
rapportino turno strutturato, Flotta work order+ricambi, Conti solleciti a
livelli) e i ponti/integrazioni (gated).

## Prossimo passo atomico
Aprire PR; dopo merge, RESTART da origin/main. Prossima unità isolata a
scelta: Conti — solleciti a livelli (helper `livelloSollecito` dalle fasce
di ritardo) OPPURE un'altra rifinitura per app. Continuare fino a
esaurimento crediti.

## Blocchi
Ciclo chiuso e integrazioni: gated (decisione fondatore). Genesi
frammentazione: gated (motore fisico).
