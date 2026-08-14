# Checkpoint — 2026-08-08 13:47 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`e715665` — refactor(campo,scudo): gli ultimi tre CSV escono dalla pagina, e
l'accordo AZIENDA diventa una prova

## Che cosa è stato completato
Chiude la famiglia aperta dall'unità precedente: dei **sette** file che si
ri-caricano davvero, gli ultimi tre erano ancora composti da una stringa
**dentro la pagina** — `campo_squadre.csv`, `scudo_registro_infortuni.csv`,
`scudo_personale_scadenze.csv`. Adesso li scrivono `csvSquadre`,
`csvRegistroInfortuni` e `csvPersonaleScadenze`, con `documenti` passato come
**argomento** (era un `vfCella` chiuso su `DOC`): la firma allargata invece
della copia.

### ⛔ Il pezzo che vale più del refactor
Il foglio del personale scrive `AZIENDA;;;;…` per le scadenze rimaste senza la
loro persona, e `parseLavoratoriCsv` salta quella riga **per nome**
(`/^(nome|azienda)$/i`). Finché il file lo componeva la pagina, quell'accordo
era tenuto da una **coincidenza fra due posti che non si parlano**: cambiando
quella parola in un template si sarebbe importato un **lavoratore fantasma**
chiamato «SOCIETÀ» — nessun errore, nessuna prova rossa, e nessuna suite `node`
in grado di vederlo, perché lo scrittore non era chiamabile.
Adesso c'è la prova, e la controprova la fa cadere.

### Il controllo svuotato
Il controllo che contava i `csvCell(` nel sorgente **non c'è più**: era un
ripiego per gli export composti nella pagina, e a furia di spostarli il suo
elenco si era **svuotato**. Lasciare un `for` su zero soggetti sarebbe stato
peggio che toglierlo — *un ciclo che non fallisce mai continua a sembrare un
controllo*. Al suo posto la regola che adesso regge: **nessuno dei sette è
composto dentro la pagina**, col conto dei soggetti (sette) perché non diventi
verde per il motivo sbagliato. È stata lei a **nominare l'ultimo rimasto**
mentre la scrivevo.

## Verifiche
- `run-kpi` **1897 → 1899**;
- **controprova**: iniettate tre volte nei file veri — «zero persone» al posto
  della cella vuota, e `AZIENDA` → `SOCIETÀ` — cadono **2 prove**; ripristinato
  da copia con `diff -q`;
  ⚠️ la terza iniezione ha detto «**non distingue**», ed è la **seconda causa**
  dell'elenco (difesa in profondità), non un buco: togliendo la guardia
  `aperta ? "" : …` il file resta **identico carattere per carattere**, perché
  `giornateAssenza` risponde già `null` e un `null` dentro un `join` è una cella
  vuota. Per vedere il danno si toglie **tutto lo strato** — si scrive `0`,
  cioè ciò che la decisione 17 vieta — e allora la prova cade. Scritto accanto
  alla prova perché nessuno rifaccia la diagnosi;
- giro `node` **27/27** sul disco **e** sulla copia di ciò che si committava
  (patch identica);
- **bottoni premuti davvero**: `--solo=campo` **38 ok / 0 KO**, `--solo=scudo`
  **33 ok / 1 KO**.
  ⚠️ Quel KO **non è di questa unità**: è la guardia del denominatore del banco,
  che con `--solo=scudo` guarda **0** numeri decimali (nel giro intero ne guarda
  **215** e passa). Misurato lanciando lo stesso comando su una **copia pulita
  di `HEAD`**: 33 ok, 1 KO, riga identica.

## Numeri
2.338 → **2.340**, copertura 706 → **710**.

## Prossimo passo atomico
Due cose, in quest'ordine:
1. **Raccogliere il giro del browser** (PID 16670, ~2h11 di vita, registro in
   `scratchpad/nomi4/giro-nuovo.txt`) con
   `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` — **sezione 1
   prima della 2**, poi la riga «le tre passate più lente» per ritarare il
   limite di 30 minuti. ⚠️ Attesta `c3888fe`: le unità di oggi non ci sono
   dentro. ⚠️ Il rosso di una **controprova** è il verde del banco.
2. **Il KO che non è mai un difetto**: con `--solo=<app>` la guardia del
   denominatore di `csv-dimostrazione` esce come **KO** invece che come
   non-misurazione dichiarata. Un KO che non è mai un difetto insegna a non
   guardare i KO — è la stessa famiglia del rosso della controprova. Va reso
   una riga «non ho guardato» quando `--solo=` è attivo, tenendo il KO sul giro
   intero.

## Blocchi
Nessuno.
