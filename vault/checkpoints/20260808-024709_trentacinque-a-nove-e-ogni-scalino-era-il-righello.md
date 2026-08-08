# Checkpoint — 2026-08-08T02:47:09Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`4b87ed4` — *nomi-liberi: 35 → 9, e ogni scalino era il righello*

## Che cosa è stato completato

La misura sulla quarta forma è scesa **35 → 34 → 9**, e il **percorso vale più
del numero d'arrivo**: nessuno dei tre scalini era il prodotto.

### ⛔ La prima diagnosi era sbagliata, ed è la parte da leggere

Nel commit precedente avevo scritto che i tre `chiave` del core erano
**commenti**, e che quindi la quarta forma avrebbe richiesto `senzaCommenti`
sopra `mascheraCodice`. **Falso.** Verificato mascherando il core e cercando il
nome nel codice **vivo**: `chiave` sopravvive alla maschera perché sta in

    for(const[campo,chiave]of[['granulometria','gran'],…])

— **`const[` senza spazio**. Il riconoscitore chiedeva `\s+` e quella
dichiarazione **non la vedeva affatto**. `mascheraCodice` i commenti li toglie
già (sono `COMMENTO`, non `CODICE`): **il tokenizzatore era quello giusto, a
sbagliare era il riconoscitore**.

Corretto con `\b…\b\s*` più un lookahead. E la correzione **non riguarda solo
questa forma**: `nomiDichiarati` sta sotto la **prima** e la **seconda**
domanda — un nome dichiarato così era libero per tutte.

⚠️ La lezione, che è la stessa di stanotte in una veste nuova: **una diagnosi
scritta con sicurezza manda il cantiere dopo a non provare la strada giusta.**
Qui avrebbe mandato ad aggiungere un tokenizzatore che non serviva.

### Poi gli elenchi

Undici globali veri del browser e cinque parole chiave, entrati in `GLOBALI` e
`PAROLE` **con la ragione**: `NaN`, `Infinity`, `innerWidth`, `innerHeight`,
`devicePixelRatio`, `AbortSignal`, `caches`, `export`, `from`, `as`, `get`,
`set`… Le prime tre domande non li incontravano — non si chiamano e non stanno
dentro un `${…}`.

## ⏱️ I nove che restano, censiti uno per uno

Perché chi chiude la forma non li ricerchi:
- `XLSX ×8` (core) — libreria da **CDN**: va in `DA_CDN`;
- `dwGrafici ×5/×3/×6` (Campo, Sentinella, Terra) — **script fratello** che non
  si espone con `window.X =`, la forma che il lettore cerca;
- `gu ×1` (Conti) — i **flag di una regex**;
- `nuovoCli ×4`, `aliquota ×3`, `carburante ×1`, `i ×1` — ⛔ il **dichiaratore
  su più righe**:

      const numero = $("ft-num").value.trim(), scelta = $("ft-cli").value,
            nuovoCli = $("ft-cli-nuovo").value.trim(),

  `nomiDichiarati` si ferma al `\n`. È la **stessa causa** di `_fSW` un'ora
  prima, e vale anche per la prima e la seconda domanda.

**Per questo la quarta forma resta MISURA e non diventa regola**: oggi
accuserebbe **codice sano**, e una guardia che accusa a vuoto insegna a non
guardarla.

## Prove

Giro `node`: **23 comandi, 0 caduti**.

## Prossimo passo atomico

⛔ **Chiudere il dichiaratore su più righe in `nomiDichiarati`**: oggi si ferma
al `\n` a livello zero, e va invece fermato solo su `;` o su un **a capo che
chiude davvero la dichiarazione** (cioè quando l'ultimo carattere non vuoto
prima non è una virgola). È il passo che chiude la quarta forma **e** rende più
severe la prima e la seconda.
⚠️ Prima di irrigidire, la regola di casa: **contare gli allarmi su una copia**.
Qui il rischio è l'opposto del solito — un a capo interpretato male *lega*
nomi che non dovrebbe, cioè rende il controllo più **cieco**, non più rumoroso.
La controprova va quindi scritta nei **due versi**.

Poi:
1. ⏱️ `XLSX` in `DA_CDN`, `dwGrafici` nel lettore degli script fratelli, i flag
   di regex esclusi — e allora la quarta forma è a **zero** e diventa regola.
2. ⏱️ **Raccogliere `giro-6.txt`** (porta 8831), prima le righe «non ho
   guardato», poi i KO senza le controprove.

## Blocchi
Nessuno.
