# Checkpoint — 2026-09-15T02:44:01Z

## Tipo
unit-complete (chiude il cantiere B12)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6d6ffcc8 (pushato)

## Cosa è stato completato

Con B3 esaurito dei suoi candidati economici (checkpoint
`20260915-020918`), ho lanciato un agente Explore per il prossimo
elemento di roadmap non bloccato dal fondatore. Ha trovato — e ho
verificato di persona ogni sua affermazione, per regola di questa casa
— che **B12** (`vault/ROADMAP_SETTIMANA.md`, "IL RIPIEGO SILENZIOSO NEL
CORE") era ancora aperto: il censimento era chiuso ma restavano "due
candidati geometrici (`Math.max(0,Hm-cal)` con freccia > altezza) da
misurare".

**Misurato, non dedotto**: i due `Math.max(0,Hm-cal)` nei disegni (3D,
canvas SVG della sezione galleria) erano già al sicuro — quel clamp
tiene `wallH` non negativo comunque. Il difetto vero stava un piano
sotto, in `galleriaArcY` (usata SOLO da `generaGalleria` per piazzare
i fori), che quella stessa difesa non aveva:

    node -e '... galleriaArcY({fronte:{lunghezza_m:5,altezza_m:4,calotta_m:10}}, 0.4) ...'
    → -3.06

Con la freccia della calotta (arco superiore di una galleria) scritta
più alta dell'altezza della sezione, la funzione scende sotto il
pavimento vicino alle pareti. `generaGalleria` piazza lì i fori di
contorno (`add(x, galleriaArcY(v,x)-0.15, 'cont')`), e `add()` scarta
ogni punto con y<0,25: quei fori sparivano in silenzio dallo schema
generato — reachable dalla UI vera, perché `calotta_m` è un
`<input type="text">` senza nessun limite superiore e `magliaGenerabile`
controllava solo che i tre campi fossero SCRITTI, non che la loro
relazione fosse fisicamente sensata.

**Correzione**: **non** ho toccato `galleriaArcY` — un secondo clamp lì
avrebbe rotto l'invariante "al centro (t=0) il valore è sempre
l'altezza intera", verificato a mano prima di scartare quella strada
(un clamp ingenuo su `(H-cal)` dava 10 al centro invece di 4). La
difesa sta a monte: `magliaGenerabile` ora blocca la generazione con
un messaggio quando la calotta scritta supera l'altezza scritta,
prima che `galleriaArcY` venga mai chiamata con quello stato.

Verifica standard rispettata (adattata al core, che `node` non
importa: le funzioni si estraggono dal sorgente):
- Estrazione a **graffe bilanciate** (come `genesi-estraibili.mjs`),
  non a riga sola: il `prendi` esistente per la calotta funziona solo
  perché quelle tre funzioni sono su una riga sola — `magliaGenerabile`
  e `magliaDetta` non lo sono, e un `prendi` a riga sola le avrebbe
  tagliate a metà. Provato PRIMA di fidarmene (misurato che la vecchia
  forma restituiva 2310 caratteri per `calottaDetta`, che è una sola
  riga di ~110 caratteri — il regex stava leggendo fino al primo `}`
  di un'altra funzione, molto più giù nel file).
- Nuova prova dedicata, verificata contro un difetto iniettato reale
  (il controllo tolto per intero): la prova cade come previsto,
  ripristinato subito.
- ⚠️ **Autotrappola presa e corretta**: il commento che scrivevo per
  spiegare il difetto citava letteralmente `calotta_m||1` in prosa — lo
  stesso pattern che una prova PRE-ESISTENTE cerca nel sorgente per
  confermare che sia sparito. Il mio commento lo faceva ricomparire.
  Stessa famiglia già presa due volte in questa sessione su
  `genesi.html` (commenti che citano testualmente il codice che
  descrivono), qui nel core.
- ⚠️ **Seconda trappola presa nei documenti**: la frase con la somma
  aritmetica delle prove in `docs/DEVELOPMENT.md` usa un regex che
  cattura fino alla PRIMA parentesi chiusa dopo "prove girano senza
  rete" — scrivendo "(B12, core)" DENTRO la parentesi che contiene la
  catena di addendi, il regex si fermava lì e leggeva zero addendi.
  Riscritta la frase senza parentesi annidate.
- `run-kpi.mjs`: 2984 passati, 0 falliti.
- `numeri-nei-documenti.mjs`: 43 passati, 0 falliti (comprese le
  correzioni sopra).
- `sintassi-pagine.mjs`: 34/34.
- Giro isolato su worktree dedicata: **sopravvissuto a un riavvio del
  contenitore a metà del primo tentativo** (il processo in background
  è morto senza errore visibile, come già successo una volta in questo
  ciclo) — ricreata la worktree da zero e rilanciato: **40 comandi a
  posto, 0 caduti**, 3.930 asserzioni (era 3.929, corretto subito dopo
  la lettura del giro, non prima).

B12 è ora chiuso per intero nella roadmap (checkbox `[x]`, tolto
dall'indice delle voci aperte).

## Stato roadmap

B12 chiuso. B3 in pausa (candidati economici esauriti, vedi checkpoint
precedente). Storia append-only aggiornata in `vault/ROADMAP_SETTIMANA.md`.

## Prossimo passo atomico

Nessun altro elemento concretamente azionabile e non bloccato dal
fondatore è stato identificato con certezza dall'agente Explore
(ponti dell'ecosistema apparentemente esauriti per quanto verificabile
senza il fondatore; le decisioni aperte della roadmap sono quasi tutte
esplicitamente del fondatore). Il fallback indicato e verificato: una
passata in profondità su **Scudo** o **Campo** — le due app meno
toccate di recente (`git log` per cartella: ultimo commit 09/11 per
entrambe, contro 09/12 per Conti/Sentinella e 09/15 per Genesi; solo 5
checkpoint ciascuna negli ultimi 4 giorni contro 6-97 delle altre).

Prossima unità: aprire Scudo, guardare ogni schermata, premere ogni
bottone che produce un file e aprire il file, cercare i numeri
tranquilli dove non è stato misurato niente — la stessa disciplina già
applicata al core con la calotta della galleria.

Nessuno stop volontario: si prosegue subito.
