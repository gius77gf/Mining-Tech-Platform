# Checkpoint — 2026-07-22 — Sentinella: rimuovi sensore (fatto)

## Task completato
Seconda iterazione, app Sentinella: CRUD delete mancante sui sensori.
I monitoraggi non si potevano rimuovere — un sensore aggiunto per
errore restava bloccato. Aggiunta la ✕ "Rimuovi sensore" su ogni riga
(con conferma che avverte della perdita dello storico misure),
coerente col pattern ✕ già usato in flotta (dismetti), campo (elimina
bozza), terra (annulla rilievo).

Verifica: sintassi OK; Playwright — rimosso "Vibrazioni V2", lista
5->4, sensore non più presente, nessun errore; screenshot (✕ integrata
col design .arr).

## Stato tema correggibilità/CRUD app
- Conti: annulla incasso (#117)
- Sentinella: registro bidirezionale (#118) + rimuovi sensore (questo)
- Campo: richiama rapportino (#119)
- Terra/Flotta/Scudo: già correggibili/completi (verificato)

## Commit
- 19d3a4c  Sentinella: rimozione di un sensore (CRUD delete mancante)

## Prossimo passo atomico
Push + PR + merge a CI verde. Prossima 2a iterazione: valutare Flotta
(rimozione voce di costo errata?) e Conti (elimina gara/fattura
sbagliata prima dell'incasso), sempre con screenshot. MAI fermarsi.
