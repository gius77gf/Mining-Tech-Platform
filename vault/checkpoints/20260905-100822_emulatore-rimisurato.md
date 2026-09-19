# Checkpoint — 2026-09-05T10:08:22Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
316f8df2 — docs: le quattro suite dell'emulatore rimisurate in questo contenitore

## Completato
Punto 4 della lista «se la roadmap sembra finita»: le quattro suite
dell'emulatore lanciate in un solo `emulators:exec --only
firestore,auth,functions` (dipendenze già installate in `tests/` e
`functions/`): regole **81/0**, SDK **19/0**, primo avvio **8/0**, funzioni
**21/0** — i numeri dichiarati tornano. `STATO_PRODOTTO.md` portava ancora la
rinuncia falsa («le 21 restano non verificate: chiede la rete»): corretta
scrivendo la correzione accanto; `DEVELOPMENT.md` ha la riga della
rimisurazione. `numeri-nei-documenti` verde.

## Stato roadmap
Invariata (docs). Nessun candidato aperto nelle ricerche.

## Prossimo passo atomico
La domanda del giorno applicata a **Scudo**, l'app con più documenti che
escono e non toccata oggi: «che cosa esce, e chi decide i suoi numeri?» sul
**verbale DPI** e sulle stampe. Comando di partenza:
`grep -n "window.open\|\.print()\|download=" apps/scudo/index.html | head -20`
e per ogni uscita trovare la funzione del modulo che compone le righe; se
una stampa compone i numeri nella pagina (non dal modulo), è la copia debole
da spostare — prima misurare aprendo il documento nel browser (il banco
`scudo-documenti.mjs` ha già i ganci `__scaricati`). Se tutte passano dal
modulo, dirlo nel checkpoint e passare a Campo con la stessa domanda. Alla
prossima accensione della routine: canarino prima di tutto.

## Blocchi
Nessuno tecnico. Decisioni del fondatore ancora aperte: 5b, 19-27, Q1,
registro esplosivi, TD24/IPA/split payment, registro dei terzi, trasmissione
del report.
