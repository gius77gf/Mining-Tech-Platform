# Il giro del browser su una copia — piano di lavoro

*Scritto il 05/08/2026, mentre il giro girava e il cantiere era fermo ad
aspettarlo. È la ragione per cui esiste.*

---

## Il problema, misurato

Il giro completo (`tests/browser/tutti.mjs`, 35 banchi) dura fra **un'ora e
mezza e due ore** su questo contenitore, e per tutto quel tempo **non si può
toccare `apps/` né `shared/`**: i banchi servono la cartella viva, quindi
un'edit sotto i piedi li fa misurare un misto di prima e dopo. La difesa
esiste — `impronta.mjs` prende l'impronta dei file prima e dopo ogni banco e
dichiara il giro **NON VALIDO** se qualcosa si muove — ma è una difesa, non
una soluzione: protegge il risultato **fermando il lavoro**.

Il costo si vede in giornate come questa: il giro è stato lanciato due volte
(una buttata perché l'avevo affamato con altre sessioni di Chromium), e nel
frattempo tre unità già progettate e provate sono rimaste in coda.

E c'è un secondo costo, più insidioso: **la regola è stata violata due volte
in due giorni**, la seconda dal cantiere che il giorno prima aveva scritto il
paragrafo. Una regola che chiede di non lavorare per due ore verrà violata
ancora, e ogni violazione è un giro buttato o — peggio — un giro verde che non
vale.

## L'idea

**I banchi non servono la cartella viva: servono una copia congelata.** Se la
copia è immobile per costruzione, `impronta.mjs` non ha più niente da
sorvegliare e il cantiere può continuare mentre il giro cammina.

Il modo più semplice e già disponibile è una **git worktree** temporanea.
Provata oggi: `git worktree add --detach <dir> HEAD` costa **pochi secondi**
(857 file) e produce una copia completa e coerente, che si rimuove con
`git worktree remove --force`.

## ⛔ La trappola, e va risolta prima di scrivere una riga

Una worktree su `HEAD` contiene il **committato**, non quello che c'è su disco.
Se il cantiere ha modifiche non committate, il giro proverebbe **codice
diverso da quello che si sta guardando** — e uscirebbe verde su una versione
che non esiste da nessuna parte. Sarebbe la forma peggiore del difetto che
questo progetto insegue da settimane: **un risultato tranquillo ottenuto senza
guardare la cosa giusta**, e stavolta prodotto proprio dallo strumento che
dovrebbe garantirla.

La regola quindi è una sola, e non è negoziabile:

> Il giro **dichiara su cosa sta girando**. Se `git status --short` non è
> vuoto, o si rifiuta di partire, o stampa a caratteri grossi che sta provando
> `HEAD` e quali file restano fuori — mai in silenzio.

La forma preferibile è la **seconda con l'elenco**: rifiutarsi rimetterebbe il
cantiere ad aspettare, che è il problema di partenza. Ma l'elenco dei file
esclusi va stampato **in cima e in fondo** al riepilogo, perché un avviso
stampato solo all'inizio, dopo un'ora e mezza di scorrimento, non l'ha letto
nessuno.

## La forma

1. **Ogni banco prende la radice da `DW_RADICE`**, con l'attuale percorso come
   ripiego. Sono **sei** file che oggi scrivono `const R =
   "/home/user/Mining-Tech-Platform"`, tutti con la stessa riga: la sostituzione
   è meccanica.
   ```js
   const R = process.env.DW_RADICE || "/home/user/Mining-Tech-Platform";
   ```
2. **`tutti.mjs` crea la copia**, alza il server statico **dentro la copia**,
   esporta `DW_RADICE`, e la rimuove alla fine (anche se il giro fallisce).
3. **`impronta.mjs` resta**, ma cambia mestiere: invece di sorvegliare la
   cartella viva sorveglia la **copia**, che non deve muoversi mai. Se si muove
   è un difetto del giro, non del cantiere — e questo la rende una prova più
   forte di prima, perché adesso un allarme significa davvero qualcosa.
4. **La dichiarazione di cui sopra**, con l'elenco dei file non committati.

## Come si prova che funziona

La controprova non è «il giro passa»: quella passerebbe anche servendo la
cartella viva. Le due che contano:

1. **Si modifica un file di `apps/` mentre il giro cammina** e si pretende che
   il giro **non** se ne accorga e resti valido — cioè l'opposto di quello che
   `impronta.mjs` pretende oggi. È la prova che la copia è davvero scollegata.
2. **Si lascia una modifica non committata prima di partire** e si pretende che
   il riepilogo la **nomini**. Se non la nomina, il giro sta misurando una
   versione che nessuno ha guardato, ed è esattamente il difetto che questa
   scheda esiste per non introdurre.

E, come sempre, va stampato **quanti file** la copia contiene: una worktree
creata male e mezza vuota darebbe banchi verdi per assenza di soggetti.

## Cosa questo piano NON risolve

- **La durata.** Il giro continua a durare un'ora e mezza: cambia che non
  blocca più nessuno. Ridurla è un altro lavoro, e la misura di oggi dice dove
  guardare — i primi due banchi (`interi-superfici` e la sua controprova)
  valgono da soli **circa metà** del tempo totale.
- **La contesa di CPU.** Due Chromium su quattro core si affamano a vicenda:
  misurato oggi, ~3,5 volte più lento. La copia non c'entra — quella regola
  («mentre gira il giro non si aprono altri browser») resta.
