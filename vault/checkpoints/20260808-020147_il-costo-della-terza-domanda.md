# Checkpoint — 2026-08-08T02:01:47Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`219f2cf` — *nomi-liberi: misurato il costo della terza domanda (i riferimenti), 2 falsi su 3.742*

## Che cosa è stato completato

Misurata **prima di scrivere una riga di codice nuovo** l'ampiezza della terza
domanda — i nomi **riferiti** dentro un template (`${nome}`), che è la forma
con cui queste pagine compongono ogni riga di interfaccia e che oggi **non
guarda nessuno**: la prima domanda vede solo i nomi *chiamati*.

**3.742 riferimenti su 12 pagine, 2 allarmi, tutt'e due FALSI:**
- `CSS`, globale del browser già dichiarato in `GLOBALI` — la misura usava un
  elenco corto scritto per l'occasione;
- `_fSW` di Genesi, che è il **terzo dichiaratore** di un `const` spezzato su
  **due righe**: il riconoscitore largo si ferma al ritorno a capo.

Cioè il rumore atteso è **zero**, purché il controllo riusi `nomiDichiarati`
(che i dichiaratori multi-riga li sa già leggere) e l'elenco `GLOBALI` vero.
Il lavoro è piccolo, ed è scritto nell'intestazione del file **col numero**,
così chi lo farà non debba rifare la misura.

⛔ **Ed è la terza volta in una notte che i falsi allarmi vengono dal RIGHELLO e
non dalla domanda** — dopo `gx`/`jsPDF` nella seconda domanda e i «(fuori
tabella)» di Flotta. Sta diventando il segno più affidabile che ho: quando un
controllo nuovo accusa poco e in modo strano, il sospettato è lo strumento.

## Prove

Giro `node`: **23 comandi, 0 caduti**.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre cinquanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **Scrivere la terza domanda**, con la misura già fatta: riusare
   `nomiDichiarati` e `GLOBALI`, cercare `\$\{\s*([A-Za-z_$][\w$]*)\s*(\.|\}|\s|\[|\?)`
   sul **testo** (non sul codice mascherato: i template vivono dentro le
   stringhe), e pretendere zero. Controprova: togliere un nome dall'import di
   una pagina che lo usa **solo** dentro un `${…}`.
2. ⏱️ **La regola dei trattini su Flotta**, oggi ferma a misura: i tre
   legittimi stanno fuori da qualunque tabella. La via che regge è dare a
   quelle tessere un'**intestazione leggibile dal DOM**, non allargare la
   regola.

## Blocchi
Nessuno.
