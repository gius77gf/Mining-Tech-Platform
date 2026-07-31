# Checkpoint — i numeri nei documenti, e una mezza verità

- **Tipo**: unità (documentazione: `STATO_PRODOTTO` e `DEVELOPMENT`)
- **Branch**: `claude/scheduled-tasks-remote-control-bk4ap6`
- **Commit**: `ab72550` (stato prodotto), `0bed265` (development)

## Cosa non tornava

Tre documenti dichiaravano **662 prove** e **13 banchi**: i numeri del 31/07.
Oggi sono **692** e **17**. Li ho ricontati **rilanciando le suite**, non
sommando i numeri che avevo in testa — la stessa regola che il documento
stesso si dà («contato, non a memoria») e che è facile tradire proprio quando
si aggiorna un documento.

## La mezza verità, che valeva più dei numeri

`STATO_PRODOTTO.md` diceva: *«Ognuno ha la sua controprova: si rimette il
difetto e si pretende che il controllo fallisca»*. Scritto così suona come una
garanzia — e per tutta la giornata di oggi si è visto che **non lo è**: la
regola sui dialoghi del browser quella controprova ce l'aveva, e passava,
mentre era cieca su gran parte del codice.

Un documento che promette al fondatore una garanzia più forte di quella che
c'è è un difetto come gli altri, solo che sta in un file di testo. Corretto: la
frase adesso porta con sé la lezione — *una controprova va misurata anche nella
sua **copertura***.

## E la cosa NON fatta, scritta apposta

Nella sezione del 1º agosto c'è anche quello che **non** è stato fatto: i 127
messaggi d'errore letti uno per uno, la conclusione che vanno già bene, e
nessuna riscrittura. Un elenco di lavori fatti in cui non compare mai «ho
guardato e andava bene» insegna a trovare sempre qualcosa da cambiare.

## Dove è andata la lezione

- `CLAUDE.md` → la regola vincolante
- `DEVELOPMENT.md` → i **quattro punti operativi** per chi scrive un controllo
  nuovo (iniettare nei file veri, nei punti difficili, stampare quanti soggetti
  si sono guardati, asserire l'elenco atteso) e il puntatore agli aiuti che
  esistono già
- `STATO_PRODOTTO.md` → il racconto per il fondatore, senza gergo

## Prossimo passo atomico

Leggere il riepilogo del giro a **17 banchi**, ancora in corso (è al primo
banco: i campi interi e la sua controprova da soli prendono quasi mezz'ora).
Se è verde, il lavoro rimasto non gated torna sul prodotto.

## Bloccanti

- Nessuno.
