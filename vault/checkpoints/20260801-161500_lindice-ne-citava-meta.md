# Checkpoint — l'indice del fondatore ne citava 26 su 46

- **Tipo**: unità (documentazione, sicura mentre gira il giro dei banchi)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `1f1c1f4`

## Come è saltato fuori

Cercavo lavoro che non toccasse le pagine mentre il giro dei 17 banchi gira.
Guardando `docs/INDICE_FONDATORE.md` — la porta d'ingresso ai documenti per chi
non è tecnico — ho contato quanti dei 46 documenti fossero raggiungibili da lì:
**26**.

## Il controllo che mi ha quasi ingannato

Il primo conto lo avevo fatto con `[A-Z_]*\.md`, che **non può** riconoscere un
nome con delle cifre dentro: tutti i `RICERCA_*_202607.md` sarebbero risultati
mancanti anche se citati. Rifatto con l'espressione giusta — e per fortuna il
risultato reggeva. Ma è la quarta volta oggi che un filtro non guarda dove
crede, e stavolta l'avrei scoperto solo scrivendo un elenco sbagliato nel
commit.

## Cosa mancava davvero

- **Tutte e dodici le ricerche**, cioè la fonte da cui nascono le unità.
- I **due documenti sull'estetica** (`SPECIFICA_ESTETICA_CORE`, `PALETTE_APP`),
  quelli che le regole di lavoro danno per vincolanti.
- Le roadmap di **Campo e Terra** — e qui il difetto era più insidioso: la riga
  che elenca le roadmap per app ne nominava **quattro su sei**. Non era
  un'omissione visibile: era una frase che sembrava completa e diceva il falso.
  A leggerla, quelle due app sembravano senza un piano.
- La normativa cave, le fonti scientifiche di Genesi, `ROUTINE_AUTOMATICA`, i
  due documenti sull'isolamento.

## Il verso che nessuno aveva mai controllato

Non solo «tutti i documenti sono citati», ma anche «tutti i citati esistono»:
**51 puntatori verificati, nessuno morto**. Un indice con un puntatore morto è
peggio di uno incompleto — la ricerca finisce e sembra colpa di chi cerca.

## Prossimo passo atomico

Leggere il riepilogo del giro a **17 banchi** (in corso, lanciato e lasciato in
pace). Nel frattempo, il candidato successivo fra i documenti è
`docs/ROUTINE_AUTOMATICA.md`: descrive come lavorano i cicli automatici, e il
processo è cambiato oggi (controprove a tappeto, 17 banchi invece di 15) —
va verificato se dice ancora la verità.

## Bloccanti

- Nessuno.
