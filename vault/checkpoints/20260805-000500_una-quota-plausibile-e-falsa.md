# Checkpoint — una quota plausibile e falsa, vista solo guardando

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Il fatto

Fatto vedere il lato cella, ho preso lo screenshot — che la direttiva pretende e
che serve a **guardare**, non a produrre un file. La riga diceva:

> volume ≈ 1.362 m³ *(griglia 0,49 m, base **−2,85 m** — stima)*

Su un cono di prova la cui base sta a **quota 340**.

## Perché

Il visore toglie il **baricentro** dalla nuvola per disegnarla (`offset`), quindi
`zBase` e la scatola del ritaglio sono nel **suo** sistema di coordinate, non in
quello del rilievo. L'esportazione del ritaglio l'offset lo rimetteva già (riga
~281); il salvataggio dei parametri no, perché l'ho scritto io due unità fa
prendendo i valori così com'erano.

## Perché è grave e non è una rifinitura

Quel numero finisce nel **verbale che va all'ente**, sotto il titolo «Come è
stato ottenuto il numero», scritto come una quota in metri. Una base a −2,85 m
non è un errore che si nota: è **plausibile e falsa** — sembra misurata e non è
quello che dice di essere.

È esattamente il difetto che questa unità esiste per impedire, arrivato **dalla
correzione stessa**: avevo reso tracciabile il calcolo salvando i parametri, e i
parametri erano nel sistema sbagliato.

E vale per il **ritaglio** allo stesso modo: X, Y e Z della scatola erano
anch'essi nel sistema del visore. Adesso tutti e sette i numeri tornano in
coordinate reali, con la stessa operazione che fa l'esportazione.

**Dopo:** *(griglia 0,49 m, base **340,09 m** — stima)*.

## La lezione, che è già scritta ma è stata pagata di nuovo

> *Gli screenshot vanno **guardati**, non solo prodotti.*

Nel codice non si vedeva niente: `v.zBase` è un nome giusto, il salvataggio è
una riga ordinata, e nessuna prova `node` poteva accorgersene — le 7 prove su
`descriviOrigine` verificano che la frase **dica** la quota, non che la quota sia
nel sistema giusto. Serviva un numero vero, davanti agli occhi.

## Prossimo passo atomico

1. **una prova che blindi il verso**: caricare la nuvola sintetica e pretendere
   che la quota di base stia **dentro l'intervallo Z della nuvola** — è la forma
   generale del difetto, e non dipende dal cono;
2. la seconda metà dell'unità 5 (la cella si cambia);
3. la nota di credito nell'export per il commercialista.
