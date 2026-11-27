# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0d3afe04

## Completato
Unità 117 — ricerca a rotazione, quarto giro, Conti: «quando lo SdI
risponde — scarto, mancata consegna e il tipo documento della differita».
Metà sul mondo di seconda mano; delta dal meccanismo: TD01 fisso dove la
fattura cita i DDT (correzione), nessun esito dello SdI sulla fattura (voce
aperta), l'avviso del cassetto fiscale solo prima dell'invio. Solo documenti.

## Imparato
- Una funzione può sapere di fare una cosa (le DatiDDT) e dichiararne
  un'altra (TD01): il codice giusto stava a una riga dal posto in cui il
  file la calcola.
- Un termine di legge (cinque giorni) entra come promemoria con la sua
  fonte accanto, non come un conto che decide: la differenza sta in chi
  prende la decisione.

## Prossimo passo atomico
Unità 118, Conti: `TD24`/`TD01` in `xmlFatturaPA` con l'avviso; `sdi: {
stato, il, nota }` sulla fattura (form della fattura, quattro stati più «da
inviare»); `statoSdi(f, oggi)` → { stato, giorniDa, testo, perche } — la
scartata «come non emessa» col promemoria della riemissione (fonte accanto,
seconda mano), la mancata consegna «emessa, nel cassetto fiscale», senza
stato «esito non registrato»; `testoSollecito` e `prioritaIncasso` non
sollecitano una scartata e lo dicono; l'estratto conto scrive la mancata
consegna; prove in run-kpi (prima in scratchpad), screenshot a 430 px. Prima:
leggere il giro del browser su `755ef985` quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.
