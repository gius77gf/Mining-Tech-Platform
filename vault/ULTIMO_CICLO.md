# Ultimo ciclo automatico

- **Quando**: 2026-08-07 22:12:27 UTC
- **Commit di partenza**: `2b2e827`
- **Branch**: claude/scheduled-tasks-remote-control-bk4ap6

## Che cosa sto per fare

Riprendo dal "Prossimo passo atomico" del checkpoint più recente **per data di
git** (`20260807-221xxx_due-date-due-orologi.md`):

1. ⛔ **Raccogliere il giro completo del browser**, partito alle 19:08 su
   `2ab9535` e ora a **212 sezioni**, dentro il blocco delle controprove.
   Si leggono **PRIMA** le righe «non ho guardato» — stasera ne è uscito un
   difetto vero, la Dashboard che nessun banco aveva mai aperto — **poi** i KO,
   distinguendo le controprove (l'intestazione lo dichiara).
2. ⛔ Poi **rilanciarlo sul commit corrente**: quello vecchio non copre
   **ventisei** commit di lavoro.
3. ⛔ **Guardare la CI** su `80345a3`/`2b2e827`: il rosso di stanotte era la
   prova di Flotta che dipendeva dall'orologio del muro, corretta e verificata
   nei due fusi. Se torna verde è chiusa; se no la causa è un'altra e va
   cercata **senza** riusare quella diagnosi.

## Filo della settimana
«I numeri che mentono con la faccia tranquilla», funzione per funzione.
