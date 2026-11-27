# Checkpoint — 2026-09-05T07:39:40Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
8daceaaf — Sentinella: proponiMappa e proponiColonneEvento sopra la mappa condivisa — i quattro lettori per nome sono uno

## Completato
- `mappaColonne`: modi «parola»/«esatto»/«dentro» e colonne `presi`;
  Sentinella `proponiMappa`/`proponiColonneEvento` sopra di lei, ripiego sui
  dati intatto. run-kpi +2 (2643/0), banco `sentinella-evento-import` 56/0.
- Giro `node` sulla copia verde, 3.555 asserzioni; documenti 3.124 prove.
  Ricerca Flotta (c) chiusa su tutt'e quattro le app; roadmap voce chiusa.

## Prossimo passo atomico
Punto 6 della lista: ricerca a rotazione sul MONDO per Sentinella, solo
WebSearch (WebFetch risponde EGRESS_BLOCKED: dichiararlo), fonti citate e
marcate di seconda mano, in coda a `docs/RICERCA_CONTINUA_SENTINELLA.md`.
Argomento: «la relazione periodica delle vibrazioni da volata per Comune/ARPA
in una cava italiana: sezioni, tabelle, frequenza di invio, che cosa chiede
un ispettore» (UNI 9916:2014, DIN 4150-3, prescrizioni tipiche di
autorizzazione). Formato: fatti dal mondo con fonte → «domande per il delta
(sul meccanismo)», SENZA scrivere il delta. Poi il delta lo fa il ciclo
aprendo `reportPeriodo`, `csvReport` e `fogliaReport` di Sentinella (grep
prima dei nomi: `grep -n "^export function .*[Rr]eport" apps/sentinella/sentinella-data.js`).

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19-27, Q1, registro esplosivi,
TD24/IPA/split payment, registro dei terzi.
