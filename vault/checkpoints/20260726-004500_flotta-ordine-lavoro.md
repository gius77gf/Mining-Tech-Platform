# Checkpoint — 2026-07-26T00:45:00Z

## Tipo
unit-complete (revisione fondatore 25/07 — Flotta differenziata: ordine di
lavoro + registro interventi)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato
La chiusura di una manutenzione non CANCELLA più e basta: è diventata un
**ordine di lavoro** che lascia traccia (la proposta della ricerca
FLOTTA_MANUTENZIONE_ROADMAP, ora autorizzata dalla revisione):
1. Alla chiusura (✓) l'app chiede **costo** e **note** dell'intervento;
2. scarica il ricambio dal magazzino (come prima);
3. registra l'intervento nel nuovo **Registro interventi** (collezione
   `interventi`, demo+live): data, titolo, mezzo, ricambio, costo, note —
   il libretto-macchina che vale in garanzia e alla rivendita;
4. se c'è un costo, crea da sola la voce in **Costi** ("Manutenzione: …");
5. registro esportabile in **CSV** (csvCell anti-injection).
Verificato in browser: chiusura → 3 dialoghi → intervento in cima al
registro con €350 e note; contatore 1→2; demo 7 e KPI 174 verdi; zero
errori JS. Screenshot salvato.

## Ultimo commit
(questo commit)

## Prossimo passo atomico
Differenziazione successiva nell'ordine del valore: Campo (funzioni
operative specifiche — dalla ricerca CAMPO_TURNI_ROADMAP il rapporto di
turno c'è già; candidato: pianificazione squadre/attività con avanzamento
per cantiere) oppure seconda passata estetica core sulle verticali.
