# Checkpoint — %Y-%m-%dT%H:%M:%SZ

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
c858f739

## Completato
Unità 107 — ricerca a rotazione, terzo giro, Flotta: «leasing, verifica
periodica e i numeri della telematica». Metà sul mondo, delta dal meccanismo
contro `ab12321f`: una voce aperta in due pezzi (il costo di possesso nel
costo orario; il preset «fine leasing / riscatto»), due dichiarate
(l'utilizzo, la telematica), una non misurabile scritta come tale (il
minimo), una a posto (le verifiche). Solo documenti.

## Imparato
- Un solo hit su «leasing» era il classificatore delle voci di costo: il
  grep dice «c'è», la lettura dice «entra come spesa, non come contratto».
  La riga del delta deve dire tutt'e due le cose.
- Un numero del mondo che il prodotto non può misurare (il tempo al minimo)
  si scrive come limite, non come mancanza da colmare.

## Prossimo passo atomico
Unità 108, Flotta: `costoPossessoAnnuo` e `possessoDal` sul mezzo (campi nel
form del mezzo, salvati nel record), `euroOraPossesso` in `costoOrarioMezzo`
(ore all'anno dal ritmo misurato; `null` con `perche` quando non si sanno o
il possesso non è registrato), le tre voci nel libretto (`csvLibretto`) e nel
fascicolo del mezzo, il preset «fine-leasing» in `SCADENZE_PRESET` di Flotta;
prove in `run-kpi` (prima in scratchpad), dimostrazione con un mezzo col
possesso, screenshot a 430 px. Poi leggere il giro del browser su `2766bf9b`
quando `ultimo-exit.txt` compare.

## Blocchi
Nessuno.
