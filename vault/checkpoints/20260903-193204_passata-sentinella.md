# Checkpoint — 2026-09-03T19:32:04Z

## Tipo
unit-complete (Sentinella, seconda tornata della passata in profondità)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
b80fdc71

## Completato
Sentinella, seconda tornata: 7 banchi verdi, modali/filtri/tendine misurati
a 390/320 nei due temi, 5 file aperti (pari alla soglia coerente in tre
posti), demo svuotata in 10 casi. Un difetto vero: le due spunte verdi del
Quadro su una cava senza punti di misura, corrette. Runner del browser:
`--solo=` non è più preso per la porta (812c04c2).

## In corso
La passata completa su Scudo (`apps/scudo/*` modificato sul disco); il giro
filtrato del browser (--solo=conti,terra,campo,genesi,core, 89 passate su 229)
sulla copia di `e2199a84`, pid 6638: a 91 sezioni, 1 KO da riverificare (le
voci di tendina del core a 320: il banco non è entrato nell'app,
`__provaUtente` assente).

## Prossimo passo atomico
Raccogliere Scudo → copia, giro node, commit, checkpoint. Leggere il giro
filtrato a fine corsa; riverificare il KO del core (banco o prodotto?);
aggiornare in roadmap la voce «I 20 KO del giro del 09/08». Poi Flotta
(seconda tornata) e Conti (terza), e il core in profondità.

## Blocchi
Nessuno. Decisioni del fondatore aperte: 5b, 19, 20, 21, Q1.
