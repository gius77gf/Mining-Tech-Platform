# Checkpoint — il principio scritto un'ora fa, usato come lente

- **Tipo**: unità (**ottavo difetto di prodotto**) + un metodo nuovo che ha
  funzionato al primo colpo
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `7949c50`

## Il metodo, che è la parte che vale

Un'ora fa ho scritto in `CLAUDE.md` il principio trovato in tre app
indipendenti: **l'assenza di un dato non è un dato favorevole**, e il segno che
è stato violato è sempre lo stesso — *un numero o un colore tranquillo dove non
è stato misurato niente*.

Invece di lasciarlo lì, l'ho usato come **lente**: un piccolo audit che chiama
**ogni funzione pura delle sei app con input vuoti** e stampa che cosa
rispondono, cercando le risposte rassicuranti.

```
2058 chiamate riuscite, 281 rifiutate dalla firma
39 funzioni rispondono qualcosa di RASSICURANTE con input vuoti
```

Trentanove candidati, letti **uno per uno**. La maggior parte erano falsi
positivi (le funzioni di validazione tornano `ok: false`, e la parola «ok»
compariva nell'oggetto degli errori; le etichette «senza data» sono oneste).
Tre meritavano un esame vero, e **uno era un difetto**.

## Il difetto

`tagliandiInScadenza` l'aveva **già capito**, e l'aveva scritto nel commento:

> «zero ore» e «non lo so» sono due cose diverse: con `|| 0` un mezzo senza
> contatore diventava un mezzo nuovo di fabbrica, e il tagliando sembrava
> lontano.

Là il mezzo senza contatore finisce fra quelli **da stimare**, col perché. Ma il
**badge della lista Manutenzioni** passava ancora da `urgenzaOre` con le ore
convertite a zero: su un mezzo di cui non sappiamo il contatore mostrava
**«tra 500 h» in verde**.

Adesso la funzione dichiara di non sapere — nessun colore, e l'etichetta dice
solo a quante ore il tagliando è previsto, la stessa frase che la pagina già
usava quando il mezzo non è nel parco. **Lo zero resta una lettura buona**: una
macchina nuova ha davvero zero ore, e la prova blocca anche quella direzione.
Corretti anche i due punti della pagina che convertivano **prima** di chiamare,
togliendo alla funzione la possibilità di distinguere.

## ⚠️ E una prova invecchiata, corretta invece che aggirata

Ne esisteva una che pretendeva l'**opposto** — *«urgenzaOre: ore attuali
mancanti trattate come 0 (niente crash)»* — e teneva in piedi il difetto.

Non è stata resa più permissiva: è stata resa più **giusta**. Adesso pretende
che l'app dichiari di non sapere, e il «niente crash» — che era il suo scopo
vero — resta. Il commento accanto racconta perché è cambiata, così nessuno la
«ripristina» credendo di correggere una regressione.

## Gli altri due candidati, guardati e lasciati stare

- **`urgenzaOre` che restituiva «tra NaN h»**: nell'audit veniva da una chiamata
  senza argomenti. Nella pagina **non è raggiungibile** — tutti e tre i punti
  che la chiamano sono dentro un `if (n.orePreviste)`. Misurato, non corretto.
- **`abilitazioneLavoratore({})` → «può»**: con una mansione senza requisiti,
  chiunque risulta abilitato. È il caso «la mansione esiste ma nessuno ha ancora
  detto che cosa serve», e merita una decisione di prodotto più che una
  correzione al volo. **Segnato per il fondatore**, non toccato.

## Stato

- **747** KPI (433 all'inizio della giornata) → **1030** prove `node`, verdi in
  UTC **e** in ora italiana
- **314 prove nuove** in giornata, **8 difetti di prodotto** trovati e corretti,
  **1 prova invecchiata** corretta

## Prossimo passo atomico

Portare la domanda rimasta al fondatore in `docs/DECISIONI_WEEKEND.md`: **una
mansione senza requisiti deve dire «può andare» o «nessuno ha ancora detto che
cosa serve»?** Poi continuare la copertura su Flotta (29/71) e Terra (23/39),
che restano le meno coperte.

## Bloccanti

- Nessuno.
