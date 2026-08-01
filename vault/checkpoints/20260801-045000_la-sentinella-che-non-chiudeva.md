# La sentinella prometteva di chiudersi da sola

**Data:** 01/08/2026 · **Area:** `.github/workflows/canarino.yml`
**Unità precedente:** `20260801-041500_due-banchi-che-non-lanciava-nessuno.md`

## Perché sono andato a guardare lì

Tre unità di fila su guardie scollegate — una bandiera che nessuno legge, una
suite che nessuno lancia, un timestamp che nessuno verifica — portano a una
domanda sola: **e la guardia più esterna di tutte?**

`canarino.yml` gira sui computer di GitHub, quindi funziona anche se ogni
sessione di Claude è morta. È l'unica difesa indipendente dall'infrastruttura
che esegue i cicli: quando il lavoro automatico si ferma, è lei a dirlo al
fondatore. Se è rotta, non se ne accorge nessuno — **per definizione**.

## ⚠️ Prima cosa: un difetto che ho creduto di trovare e non c'era

Il corpo della segnalazione si costruisce con un heredoc il cui terminatore, nel
file, è **indentato di dieci spazi**. In bash un `<<TESTO` pretende il
terminatore a colonna zero, quindi sembrava che il passo dell'allarme non
potesse nemmeno partire — l'ho riprodotto in uno script e infatti dava
`unexpected EOF`.

**Era la mia riproduzione a essere sbagliata.** In YAML un blocco `run: |` viene
**dedentato** prima di arrivare a bash: il terminatore, per bash, sta a colonna
zero. Estraendo i passi col parser YAML invece che copiandoli a mano, tutti e
tre passano `bash -n`.

È esattamente la trappola numero 3 dell'elenco di `CLAUDE.md` — *l'iniezione non
ha iniettato niente* — commessa da me, e il rimedio è stato quello di sempre:
misurare la cosa vera invece della mia idea della cosa vera. Lo scrivo perché
quel «difetto» stava per finire in un commit come un fatto.

## ⛔ Il difetto vero

Il testo dell'allarme dice, in fondo:

> *Segnalazione automatica. **Si chiude da sola quando il canarino torna a
> cantare** — puoi chiuderla a mano appena vedi il commit.*

**Nessun passo la chiudeva.** Il job conosceva `gh issue list`, `comment` e
`create`. Nient'altro. Verificato elencando i passi: trovare il canarino,
avvisare se ≥ 6 ore, e un `echo` di «tutto a posto».

E non è solo una promessa non mantenuta. Il passo dell'allarme **deduplica**:
se trova una segnalazione aperta, invece di aprirne una nuova ci aggiunge un
commento. Con una segnalazione che non si chiude mai, **ogni allarme futuro
diventa un commento su quella vecchia** — il cui titolo continua a dire le ore
del **primo** guasto. Cioè la sentinella **peggiora dopo il primo incidente**,
proprio mentre continua a sembrare che funzioni.

## La correzione

Il ramo «tutto a posto» adesso, se trova una segnalazione aperta, **la commenta
e la chiude** (`--reason completed`). Il commento dice quando il canarino ha
cantato, così nell'archivio resta la durata reale del fermo.

Provato **eseguendo il passo davvero**, con un `gh` finto sul `PATH`, nei due
versi:

- **con** una segnalazione aperta (#42) → commenta *«Il canarino ha cantato di
  nuovo (ultimo: …): la routine ha lavorato circa 2 ore fa. Chiudo»* e chiude;
- **senza** → «Nessuna segnalazione aperta da chiudere», uscita 0.

E già che c'era, il ramo dell'allarme è stato eseguito allo stesso modo: il
corpo dell'issue esce pulito e ben formattato. È un ramo che **per costruzione
gira solo quando tutto il resto è rotto**, quindi era l'unico modo di sapere che
funziona senza aspettare un guasto vero.

## Verifica

YAML di `canarino.yml` e `ci.yml` validati con un parser; i tre passi estratti e
passati a `bash -n`; il passo nuovo eseguito nei due casi con `gh` finto.
Nessuna suite `node` toccata da questa unità.

Il giro del browser in corso non è stato disturbato — **309 asserzioni**,
nessun «GIRO NON VALIDO»: i file dei workflow non sono fra quelli di cui prende
l'impronta.

## Prossimo passo atomico

Il giro è al banco «niente fuori schermo», circa il decimo su 37, dopo un'ora e
un quarto. Leggerlo fino in fondo resta il passo che chiude la giornata di
verifiche. In parallelo, restano da guardare a schermo — quando la CPU si
libera — le **cinque righe nuove di Scudo**, che il loro cantiere ha dichiarato
non viste.
