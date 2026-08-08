# Checkpoint — 2026-08-08T02:09:44Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8136ab2` — *nomi-liberi: la terza domanda — un nome RIFERITO che non esiste*

## Che cosa è stato completato

Scritta la **terza domanda**, con la misura già in mano dall'unità precedente.
`${nome}` dentro un template è il modo in cui queste pagine compongono **ogni
riga di interfaccia**, e un nome libero lì **uccide il disegno** esattamente
come una chiamata inesistente uccide il tocco. La prima domanda non lo vede
(guarda `nome(`), la seconda nemmeno.

⚠️ **Si cerca sul TESTO e non sul codice mascherato**, ed è l'unico punto di
quel file dove serve: i template **vivono dentro le stringhe**, e
`mascheraCodice` — la cosa giusta per i dialoghi — qui spegnerebbe proprio ciò
che si vuole leggere. Il file adesso usa **i due tokenizzatori dove servono**,
e lo dice.

⚠️ E l'ampiezza era **già misurata prima** di scriverla: **3.771 usi su 10
pagine, zero liberi**. I due allarmi della misura di un'ora fa erano tutt'e due
del **righello**, ed è per questo che qui si riusano `nomiDichiarati` e
`GLOBALI` veri invece di scriverne di nuovi.

**La controprova ha la forma esatta che le altre due non vedono**:
`RIPOSO_MINIMO_ORE` è importata da Campo e usata **due volte, tutt'e due dentro
un template**, mai chiamata. Tolta dall'import, la pagina si aprirebbe e
morirebbe al primo disegno dell'appello. La prova pretende **quattro** cose:
che il nome non sia legato altrove, che la **prima** domanda resti cieca (non
c'è nessuna `(` da vedere), che la **terza** lo veda, e che sulla pagina
**sana** non accusi nessuno.

⚠️ La prima stesura della controprova cercava il soggetto **con una regex
furba** e non lo trovava: dichiarava «serve almeno un nome importato e usato
dentro un template» e cadeva. Sostituita da un soggetto **scelto e verificato a
mano** — una controprova che non trova il proprio bersaglio non è severa, è
rotta.

## Prove

`nomi-liberi` **12 → 15** prove. Giro `node`: **23 comandi, 0 caduti**, sulla
copia di quello che si committava. Il riepilogo porta ora i tre denominatori:
*18.657 chiamate · 6.699 nei moduli · 3.771 riferimenti `${…}`*.

## Prossimo passo atomico

⛔ **Raccogliere il giro del browser** (`scratchpad/io-core/giro-5.txt`, pid
7002, porta 8823) **e rilanciarlo sul commit corrente** — quello in corso parte
da un `HEAD` di oltre cinquanta commit fa, quindi il suo verde non riguarda
quello che c'è adesso. Ordine: prima le righe **«non ho guardato»**
(denominatori, superfici non raggiunte, «0 su N»), poi i KO, distinguendo le
**controprove**, dove il rosso è quello voluto — l'intestazione lo dichiara.

Poi:

1. ⏱️ **La terza domanda sui MODULI**, che oggi gira solo sulle pagine — stessa
   forma della seconda, e stessa regola: **misurare gli allarmi prima**.
2. ⏱️ **La regola dei trattini su Flotta**, ferma a misura: i tre legittimi
   stanno fuori da qualunque tabella. La via che regge è dare a quelle tessere
   un'**intestazione leggibile dal DOM**, non allargare la regola.

## Blocchi
Nessuno.
