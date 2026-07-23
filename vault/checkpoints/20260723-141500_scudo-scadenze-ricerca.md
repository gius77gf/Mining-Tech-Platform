# Checkpoint — 2026-07-23T14:15:00Z

## Tipo
unit-complete (seconda iterazione — ricerca + conteggio nelle scadenze Scudo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
(questo commit — apps/scudo/index.html)

## Completato
La lista **scadenze** di Scudo è il cuore della compliance HSE (visite mediche,
corsi, formazione, DPI di tutti i lavoratori) e può diventare lunga, ma aveva solo
filtri+ordinamento, non la ricerca. Aggiunta ricerca libera `#scad-cerca` (per tipo
o lavoratore) + conteggio `#scad-count` ("N · su TOT"), stesso pattern delle liste
principali. Stato vuoto dedicato. Ora Scudo ha ricerca+conteggio su ENTRAMBE le liste
(personale e scadenze).

## Verifica
Syntax OK. Screenshot Playwright (demo): "5 scadenze"; cerca "corso" → "1 scadenza ·
su 5" con la voce giusta; ricerca inesistente → stato vuoto; zero errori console.

## Prossimo passo atomico
Never-stop: rotazione fallback. Le liste chiave hanno ricerca+conteggio+filtri+
ordinamento+modifica+conferme+validazioni+export. Prossimo: altre liste secondarie ad
alto uso (es. Conti gare, Flotta ricambi) se genuinamente utile, o test/ricerca.

## Blocchi
Nessuno (pura UX). Gated: passo 3 drone, #321 estetica.
