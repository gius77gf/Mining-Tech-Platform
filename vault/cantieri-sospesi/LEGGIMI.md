# Cantieri sospesi

Qui stanno, come `patch` da `git apply`, i lavori di cantieri morti PRIMA di
consegnare il rapporto — cioè codice che nessuno ha verificato. Non entrano nel
prodotto finché qualcuno non li rimisura: si applica la patch su una copia
(`git worktree`), si prova nei due versi, e si tiene solo ciò che regge.
Una patch va TOLTA da qui il giorno in cui il cantiere è raccolto o rifatto.

- `20260904-flotta-tagliando-contatore.patch` — Flotta: il tagliando a ore
  con il contatore di riferimento (dopo il contatore sostituito, `urgenzaOre`
  diceva «tra 5.790 h»). Morto due volte per i crediti, il 04/09.
- `20260904-sentinella-lettura-colonne.patch` — Sentinella: la lettura a più
  colonne (PPV per asse, risultante, frequenza, sovrapressione) nella mappa di
  `preparaLetture`. Morto due volte per i crediti, il 04/09.
