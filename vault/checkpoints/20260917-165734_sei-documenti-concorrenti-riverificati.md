# Checkpoint — 2026-09-17T16:57:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
4760cdc4

## Cosa è stato completato
Chiusa la "seconda iterazione" sui sei documenti `docs/CONCORRENTI_*.md`,
tutti stale secondo l'ultima misura completa di `documenti-invecchiati.mjs`
(268 commit di arretrato totale, 134 che mordono). Riverificati uno per
uno, stesso metodo per tutti e sei:
1. lette le righe ancora "CONFERMATO ASSENTE"/"CONFERMATA" per intero
   (non quelle "A METÀ" o già "C'È");
2. cercati i loro termini **solo nelle righe aggiunte** dell'intero
   intervallo di arretrato (`git diff <verificato>..HEAD -- apps/<app>/
   shared/dw-ponti.js | grep '^+' | grep -iE '...'`), non nel codice intero
   (che troverebbe anche occorrenze preesistenti già scartate);
3. ogni colpo verificato a mano per escludere falsi positivi (parole
   italiane o nomi di variabili che contengono il termine cercato);
4. corretta la citazione del commit di verifica con l'ultimo commit che
   ha DAVVERO toccato la cartella dell'app (`git log --format=%H -1 --
   apps/<app>/`), mai un canarino o un commit che tocca solo `vault/`.

Risultato — **zero mancanze chiuse, una annotata**:
- Campo (commit `565b250b`): 11 mancanze, tutte confermate.
- Conti (`d0a632fb`): 4 mancanze, tutte confermate.
- Flotta (`805b742c`): 3 mancanze, tutte confermate (due righe della
  tabella erano già state chiuse prima di questo arretrato).
- Scudo (`04689298`): 3 mancanze, tutte confermate — ma "notifiche
  automatiche" ha guadagnato un'annotazione: il 16/09 è salito un
  contatore di notifiche IN-APP (`notificheScadenzeNonLette`), un "primo
  passo" dichiarato dal suo stesso commento, non la chiusura della riga
  (niente esce ancora verso un telefono spento).
- Sentinella (`554674ef`): 11 mancanze, tutte confermate.
- Terra (`4760cdc4`): 4 mancanze, tutte confermate.

Verificato con `documenti-invecchiati.mjs` dopo ogni commit: tutti e sei
i documenti ora a 0 commit dopo (tranne Scudo, a 3 — i miei stessi commit
successivi in questo blocco). Arretrato totale sceso da 268 a 3 commit,
da 134 a 0 mordenti. `numeri-nei-documenti.mjs` e `prove-grep-scadute.mjs`
sempre puliti dopo ogni singolo commit.

## Stato roadmap
Il fronte "documenti concorrenti stale" è chiuso per ora. Il fronte "42
KO del giro completo del browser" è chiuso (checkpoint precedente,
commit fino a `5ad3c864`).

## Prossimo passo atomico
Proseguire con la lista "SE LA ROADMAP SEMBRA FINITA" di CLAUDE.md, in
ordine:
1. Una sovrapposizione NUOVA nella mappa ecosistema (`docs/
   MAPPA_ECOSISTEMA.md` §1/§6) — al 12/09 zero sovrapposizioni non
   collegate, quindi va prima CENSITA una sovrapposizione nuova, non
   costruito un ponte già noto.
2. La passata in profondità su un'app (aprire ogni schermata, premere
   ogni bottone che produce un file, cercare i numeri tranquilli).
3. Nuove ricerche a rotazione (tre cantieri insieme, mai sulla parola
   dell'agente — ogni finding si riverifica a mano prima di agire).
Il giro completo del browser NON va rilanciato finché non c'è altro
lavoro di codice pendente (costa ore): con zero KO noti in partenza,
il prossimo lancio darà la prima misura pulita da settimane su quel
fronte, quindi conviene farlo quando si è pronti a leggerlo per intero.

## Blocchi
Nessuno.
