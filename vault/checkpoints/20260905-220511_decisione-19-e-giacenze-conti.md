# Checkpoint — 2026-09-05T22:05:11Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
e05b2e81 — Documenti: la decisione 19 e il «non c'è» scaduto delle giacenze di Conti

## Completato
Decisione 19 in `DECISIONI_WEEKEND` (il ricettore delle polveri, da che parte
sta rispetto alla cava: regola risolta, campo e interpretazione al fondatore,
NON costruita) con la riga nella tabella d'ingresso; la riga «Gestione
magazzino / giacenze prodotto» di `CONCORRENTI_CONTI` riscritta «C'È A METÀ»
(inventari dei cumuli di Terra nel triangolo) con i comandi e ciò che resta
assente; B4 conti 6 → 5, totale 41. Giro `node` sulla copia: 40 comandi a
posto. Canarino delle 21:45Z pushato (f39f98f6).

⚠️ Il primo giro di questa unità è MORTO con la fine del turno (registro
fermo alle 20:41, nessun processo): lanciato con `&` dentro un comando
normale, non sopravvive alla fine del turno. Rilanciato come comando in
background del harness, che lo tiene vivo e avvisa alla fine.

## Stato roadmap
Voce `[x]` «Due righe di documento, prima di aprire cantieri (05/09, notte)».

## Prossimo passo atomico
Dalla tabella in fondo a `docs/MAPPA_ECOSISTEMA.md`: il prossimo ponte di
dati NON ancora chiuso (leggere la tabella, non il testo della routine, che
è del 26/08 e cita Flotta→Conti «a metà» quando potrebbe non esserlo più).
Per quello: (1) la funzione condivisa in `shared/dw-ponti.js` se manca,
provata in scratchpad; (2) la lettura vera dall'altra app con l'SDK sull'
`appId` giusto (mai percorsi a mano); (3) i dati di dimostrazione nelle due
app COERENTI fra loro (stessa cava, stessa scala); (4) il punto nella pagina
con lo stato «non leggibile» distinto da «nessun dato»; (5) run-kpi, banco,
scatto; (6) la riga della tabella della mappa aggiornata col commit.

## Blocchi
Nessuno.
