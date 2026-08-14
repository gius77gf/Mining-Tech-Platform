# Ultimo ciclo di lavoro automatico

- **Quando**: 2026-08-14, 08:58 UTC
- **Commit di partenza**: `869b9b69`
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa sta per succedere

Il ciclo riprende dal checkpoint `20260814-080815_il-ripiego-silenzioso-chiuso-in-sei-app.md`.
Sul disco c'è il lavoro **non committato** di due cantieri: quello di **Genesi**
(consegnato e completo — tre correzioni misurate sulla pagina, cinque prove
nuove) e quello sulle **sottrazioni fra due insiemi**, morto sul limite di
sessione mentre stava correggendo le proprie fixture.

⚠️ Alle 08:24 la piattaforma ha dato **«You've hit your session limit · resets
8:40am (UTC)»** e ha ucciso due cantieri: è l'unico stop legittimo previsto
dalla regola del fondatore, e infatti il ciclo riprende invece di chiudersi.

Il primo passo è **misurare il disco prima di committarlo** — mai alla cieca —
e raccogliere le unità una per volta, con l'indice costruito da HEAD più il solo
blocco di ciascuna: dentro `run-kpi.mjs` hanno scritto fino a tre cantieri
insieme.

## Dove eravamo arrivati (blocco precedente, 03:46 → 08:24 UTC)

Quindici unità committate e spinte. Il filo della settimana — **i numeri che
mentono con la faccia tranquilla** — chiuso su sei app più `shared/`:
Flotta (1 pezzo per intervento invece di 3), Conti (`dovuto: 0` su soldi dovuti
a un ente), Sentinella (`0/0/0` nel registro che va all'ARPA, e «Conforme» su un
superamento), Terra («Riserva residua 0 m³ · ~0 anni» dove nessuno aveva
scritto), `shared/dw-ponti.js` (un rilievo che non ha misurato niente contava
come rilievo e spostava la data dell'ultima misura).

E **il giro del browser adesso arriva in fondo**: era 198 passate = 13,5 ore,
cioè più di una sessione, e due notti di fila era stato spento a metà. Con
`--solo=` un ciclo verifica le superfici che ha toccato in mezz'ora — due giri
finiti, 0 e 2 KO veri, e i due KO erano tutt'e due del banco.
