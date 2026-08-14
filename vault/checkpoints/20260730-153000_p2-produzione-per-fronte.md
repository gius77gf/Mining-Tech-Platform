# Checkpoint — P2, primo pezzo: la regola condivisa

- **Tipo**: ponte fra le app (l'ultimo che mancava), prima metà
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `6c854de`

## Cosa mancava

La roadmap segnava P2 (Campo → Terra) come «l'unico ponte che resta». Il pezzo
che già c'era dice a Terra **quanto** è stato cavato fra un rilievo e l'altro;
quello che mancava è **da dove**: l'avanzamento di ogni fronte resta fermo
all'ultimo volo del drone, e chi guarda il piano di coltivazione vuole sapere se
il Nord sta correndo e il Sud è fermo.

## Cosa è stato fatto

`produzionePerFronte(rapportini, fronti, dal, al, densita)` in
`shared/dw-ponti.js`, ri-esportata da Campo e da Terra. Il test pretende
l'**identità** (`campo.X === ponti.X`), non il comportamento.

Restituisce: le righe per fronte con quota, la produzione **senza fronte** e
quella con un **fronte che non esiste più**, tenute separate, il totale, e la
**copertura** — quanto del totale si sa da dove viene.

### Le quattro cose che si rifiuta di fare

1. **Accoppiare per nome.** La squadra ha un campo `area` che dice «fronte Est»
   e sarebbe comodo confrontarlo col nome del fronte: è la scorciatoia che in
   questo progetto ha già fatto danni. Basta rinominare un fronte e la
   produzione finisce su quello sbagliato — un errore muto su un numero che va
   nella denuncia annuale.
2. **Ripartire a intuito** quello che non ha un fronte: resta dichiarato a parte.
3. **Convertire le tonnellate senza densità**, e contare i viaggi come metri
   cubi (manca la portata del mezzo).
4. **Confondere «non indicato» con «fronte cancellato»**: sono due problemi
   diversi e chiedono due rimedi diversi.

La quota percentuale si calcola sull'**attribuito**, non sul totale: dire «il
Nord è il 55%» quando metà non si sa da dove viene è un modo elegante di mentire.

## Prove

Otto nuove in `run-kpi.mjs`, totale da **325 a 333**. Controprova: rimesso
l'accoppiamento per nome dentro la funzione vera, la guardia cade.

## Prossimo passo atomico

**P2, secondo pezzo: Campo deve registrare il fronte.** Oggi il rapportino di
Campo non ha `fronteId`, quindi la funzione nuova non ha da chi farsi dare il
dato. Serve, in quest'ordine:
1. `api.frontiTerra()` in `campo-data.js` — stesso schema già usato per
   `rilieviTerra` e `autorizzazioniTerra` (seconda istanza dell'SDK su «terra»,
   sola lettura, `null` se Terra non c'è: non si inventa un elenco vuoto);
2. la tendina del fronte nel rapportino di Campo, con «non indicato» esplicito e
   non come opzione di ripiego silenziosa;
3. `fronteId` nei rapportini dimostrativi, coerenti coi fronti di Terra;
4. poi Terra mostra la ripartizione stimata dai turni, **tenuta separata** dalla
   misura del drone.

## Bloccanti

- Nessuno.
