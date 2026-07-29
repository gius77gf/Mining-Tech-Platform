# Terra

App estrattivo & rilievo. Buyer: direttore cava.

## Come Terra conta i volumi

Ogni rilievo elaborato porta una **provenienza**:

- **scavo** — materiale nuovo tolto dal fronte. Consuma il volume concesso
  dall'autorizzazione, entra nel contatore vita cava, nell'avanzamento del
  piano, nei volumi per mese e per fronte, nel valore del materiale.
- **cumulo** — materiale già estratto in passato e ripreso da un mucchio sul
  piazzale. Si conta **a parte**: non consuma il concesso e non entra nei
  totali di estrazione, perché quel metro cubo era già stato scavato (e già
  scalato) a suo tempo.

I rilievi salvati **prima** che il campo esistesse non hanno `provenienza` e
valgono **scavo**: si comportano esattamente come prima, nessun numero
mostrato cambia e non si perde nulla. Vale anche per l'import CSV, dove la
colonna `provenienza` è la sesta e facoltativa (vale `cumulo` solo se scritta
così).

## Riepilogo annuale (scheda Denuncia)

Vista per anno pensata per chi compila la comunicazione periodica dei volumi
all'ente: mese per mese (compresi i mesi a zero, che nei moduli vanno
dichiarati), ripartizione per fronte, cumulato sotto il titolo con pregresso,
confronto col volume concesso e residuo, storico anno per anno.

Si consegna in due modi: **stampa** (pagina bianca con firma, salvabile in
PDF) ed **export CSV**.

Terra non conosce nessuna regola regionale: modello, termini e modalità di
invio cambiano da regione a regione e restano da verificare presso l'ente.
