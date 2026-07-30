# Checkpoint — il segno d'avvio, otto superfici su otto

- **Tipo**: unità (completamento della copertura lasciata aperta)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `8a108e0`

## Cosa mancava

L'unità precedente copriva le sei app e lasciava scoperti **core, vetrina e
Genesi**, dicendolo. Qui si chiude.

## I segni, tutti misurati e nessuno indovinato

| superficie | segno | vivo | morto |
|---|---|---|---|
| le sei app | la nota del modo | 57-72 caratteri | **0** |
| il core | `window.nav` | la funzione vera | il **segnaposto** |
| Genesi | i comandi con un gestore | 64 | **0** |
| la vetrina | *nessuno: zero moduli, è statica* | — | — |

## Il core è il caso che dimostra la tesi

Vivo e morto hanno **lo stesso testo visibile**: 258 caratteri, la schermata
d'accesso. Nessuna misura di «quanto c'è in pagina» potrà mai distinguerli —
non è che la soglia sia tarata male, è che **quella grandezza non contiene
l'informazione**. Il segno vero è che `window.nav` sia la funzione vera invece
del segnaposto che il core installa apposta, ed è precisamente quello che
`CLAUDE.md` racconta da settimane senza che nessuna prova lo controllasse.

## La vetrina, esclusa per dichiarazione

Zero moduli: è una pagina statica, e non c'è nessun programma di cui pretendere
l'avvio. Lo scrivo perché «coperte otto su nove» detto senza spiegare la nona
somiglia troppo a una dimenticanza.

## Il dettaglio piccolo che valeva la pena

L'etichetta del core diceva «window.nav non è il segnaposto» **anche quando lo
era**: la riga rossa raccontava il contrario di quello che era successo. Adesso
dice il valore misurato. Una prova che fallisce con la motivazione sbagliata fa
perdere più tempo di una che tace.

## Stato

- **17 banchi** del browser · controprova su tutti tranne quelli puramente
  descrittivi
- **177** prove di stile, **433** KPI, 43 helper, 23 pointcloud, 9 manifest,
  7 demo — tutte verdi

## Prossimo passo atomico

Rilanciare il **giro completo dei 17 banchi** (l'ultimo giro completo è di
stanotte ed era a 15): serve a verificare che i due banchi nuovi convivano con
gli altri e che nulla sia regredito con le modifiche alle tre pagine. Lanciarlo
**e lasciarlo in pace**, leggendo solo il riepilogo.

## Bloccanti

- Nessuno.
