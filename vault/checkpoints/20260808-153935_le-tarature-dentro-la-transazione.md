# Checkpoint — 2026-08-08 15:39 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`9407423` — fix(sentinella): le tarature dentro la transazione

## Che cosa è stato completato
Tre siti su tre delle **tarature**, che sono **documenti**: una taratura persa
vuol dire una lettura che nel report per l'ente risulta **non coperta**.
- **aggiunta a mano**: il controllo «c'è già una taratura con queste due date»
  si **rifà dentro** la transazione. Farlo solo fuori vuol dire deciderlo su una
  lettura vecchia — ed è esattamente il caso di due persone che registrano la
  stessa taratura insieme. Quando è doppia **non si scrive affatto** e la frase
  lo dice;
- **import in blocco**: si aggiunge alle tarature **vere del momento**;
- **rimozione**: si toglie da quelle vere, non da un elenco calcolato prima —
  chi nel frattempo ne avesse aggiunta una la **perdeva**.

## ⚠️ Un mio errore, e come è stato preso
Avevo scritto il filtro della rimozione su **due** chiavi (data, scadenza)
mentre l'originale ne usa **tre** — anche il numero di **certificato** — e il
codice **compilava**. `nomi-liberi` taceva perché nel file c'è un altro
`tar` in scope: è l'**omonimo** che questo repository ha già censito come il
caso che spegne quel controllo.
L'ha preso il **rileggere il blocco**, non una prova. Vale come promemoria che
il verde di quella suite non è una promessa sul **significato** di un nome.

## Verifiche
Giro `node` **27/27** sul disco e sulla copia (patch identica); pagina di
Sentinella aperta davvero (**32 ok / 0 KO**).

## Restano DUE siti dei dodici
La **correzione** di una lettura già dentro (l'unico caso in cui si tocca un
elemento **in mezzo** all'elenco) e il punto che scrive `letture` insieme a
`valore` dalla scheda.

## Prossimo passo atomico
Gli ultimi due siti, poi la 5b ha finito la parte «conflitti» e resta solo la
**coda offline** — che va per ultima e **nel browser**, perché
`enableIndexedDbPersistence` in `node` non si misura.

## Da guardare
⚠️ **L'esito della CI su `d4c7bea`** (il rifiuto non gestito): in casa la
controprova non riproduce la corsa, quindi è la CI a dirlo. Da quel commit in
poi non è arrivata nessuna segnalazione di fallimento — ma «nessuna notizia» non
è una prova, e va guardato.
⏳ Il **giro del browser** (PID 16670, ~4h) attesta `c3888fe`.

## Blocchi
Nessuno.
