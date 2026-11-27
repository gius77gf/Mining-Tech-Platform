# Checkpoint — 2026-09-14T20:10:24Z

## Tipo
unit-complete (chiude G47c)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
43ed5e9a

## Completato

**G47c-2** — la primitiva di disegno libero vera: `D2.tratti`, una
polilinea senza la semantica di prodotto di foro/fronte/piede. Serve ad
annotare la pianta con quello che nessuno dei tre tipi fissi può
rappresentare (una faglia, una pista di transito, un confine di
concessione).

- Un clic aggiunge un punto al tratto in costruzione
  (`D2.tratti[...].aperto===true`); "Fine tratto" lo chiude; il clic
  successivo ne apre uno NUOVO invece di allungare quello appena
  chiuso — questo è il caso che il banco e la sua controprova
  verificano esplicitamente.
- Quarto strumento nella barra (Fori/Fronte/Piede/**Tratto**), colore
  neutro nel disegno (non deve competere con l'arancio del fronte o il
  giallo del piede, che hanno un significato di progetto), inquadratura
  della pianta estesa a includere anche i tratti disegnati fuori dalla
  maglia esistente.
- `d2Snap`/`d2ApplySnap` (G47c-1) **estesi dal primo giorno** a
  includere `D2.tratti`: l'annulla/ripristina copre la nuova entità fin
  da subito, non recuperato dopo con un secondo passaggio.

**Con questa fetta G47c è chiusa nella sua interezza** — era stata
scoperta in due parti lavorando su G47a: G47c-1 (il prerequisito
mancante, annulla/ripristina) e G47c-2 (la primitiva vera che la voce
originale della roadmap descriveva: "mancano linee/polilinee libere,
forme, testo"). Testo e forme restano fuori da questa fetta — solo la
polilinea, per tenere l'unità piccola e verificabile; se servirà testo
o una forma chiusa (poligono), è un'estensione futura dello stesso
`D2.tratti`, non un'entità nuova.

## Verificato

- `sintassi-pagine.mjs`: 34/34. `numeri-nei-documenti.mjs`: 43/0 (dopo
  la correzione della cifra 3.913→3.914 segnalata dal giro stesso).
- `iniezioni-fresche.mjs`: 563 sul bersaglio. `copertura-funzioni.mjs`
  invariato.
- Screenshot Playwright: tre clic costruiscono un tratto con tre punti,
  "Fine tratto" lo chiude senza aggiungere un punto, un clic successivo
  apre un SECONDO tratto separato (non allunga il primo), Ctrl+Z toglie
  il tratto appena aperto, "Reset tratti" + annulla restituisce il
  tratto tolto.
- **Banco browser committato**: `apps/deepwork-id/tests/browser/
  genesi-tratti.mjs` (10 prove) + controprova (rimette il difetto
  esatto che la guardia `aperto` esiste per prendere — un clic dopo
  "Fine tratto" che allunga il tratto vecchio invece di aprirne uno
  nuovo — e cade su 1/11 prove, esattamente quella). Registrato in
  `tutti.mjs`.
- Giro completo su worktree isolata: **rilanciato due volte**, stesso
  schema delle ultime due unità. Il primo giro ha segnalato che i
  documenti dichiaravano ancora 3.913 asserzioni dove il giro ne
  eseguiva 3.914 (il nuovo file fa salire `suite-collegate.mjs` di
  uno) — corretto, rilanciato: **40 comandi a posto, 0 caduti**.

## Corretto in cascata (`docs/DEVELOPMENT.md`, `docs/STATO_PRODOTTO.md`,
`docs/DECISIONI_WEEKEND.md`, `vault/ROADMAP_SETTIMANA.md`)

- 283→285 esecuzioni del browser, 121→122 file di banco distinti.
- 3.913→3.914 asserzioni del giro completo.
- Tabella di `genesi-estraibili.mjs` (59→60 "una o due", 67→68
  estraibili, 153→154 totali): una funzione nuova, `syncTrattoUI`.

## Stato roadmap

G47a, G47c-1, G47c-2 (= tutta G47c) chiuse. Restano **G47b** (livelli
di disegno veri) e **G47d** (import DXF), nell'ordine già scelto:
a → c → b → d — G47b è la prossima perché meno rischiosa di G47d, che
resta per ultima per il rischio di convenzione degli assi già
segnalato dalla ricerca del 13/09.

## Prossimo passo atomico

**G47b — livelli di disegno veri.** Oggi `D2.iso`/`rel`/`ene`/`inn`/
`snap` sono interruttori booleani ad-hoc che mostrano/nascondono un
CALCOLO o una vista (isocrone, relief, energia, innesco, griglia di
aggancio) — non un gruppo di disegno con colore/blocco/creazione
proprio. Un vero livello CAD separerebbe le ENTITÀ disegnabili (fori,
fronte, piede, e i nuovi tratti di G47c-2), ciascuna mostrabile,
nascondibile, e — la parte nuova — **bloccabile** (un livello bloccato
non riceve click in `d2Down`, per proteggere un profilo finito mentre
si continua a disegnare un tratto sopra).
Scope minimo per questa fetta:
- `D2.layers` — registro `{fori:{visibile,bloccato}, fronte:{...},
  piede:{...}, tratti:{...}}` (nomi fissi per ora, non layer creabili
  dall'utente: quattro entità esistenti, non un sistema aperto — se
  servirà creare layer nuovi è un'estensione, non va fatta a priori
  "per sicurezza" senza un secondo consumatore, principio già scritto
  in CLAUDE.md sulle firme troppo strette);
- pannello nella scheda 2D (probabilmente vicino a `#d2-layers`, che
  esiste già nell'HTML — verificare cosa contiene oggi prima di
  aggiungere, potrebbe già essere il posto giusto) con un
  occhio/lucchetto per entità;
- `drawDesign2D` rispetta `visibile` (non disegna l'entità nascosta);
- `d2Down`/`d2Move` rispettano `bloccato` (un'entità bloccata non
  riceve click né trascinamento — verificare CIASCUN branch: fori,
  fronte/piede, tratto);
- NON serve estendere `d2Snap`/`d2ApplySnap`: `D2.layers` è stato
  dell'INTERFACCIA (cosa si vede/tocca), non dati disegnati — un
  annulla non deve "disfare" uno show/hide, sarebbe sorprendente per
  chi lo preme aspettandosi di annullare un disegno.
Verificare con screenshot + banco browser committato + giro isolato
prima di dichiarare la fetta fatta, come le tre precedenti. Poi G47d
(import DXF con validazione della convenzione degli assi prima di
disegnare qualunque punto importato — stessa cautela del gate
boretrack, non lo stesso gate).

Nessuno stop volontario: si prosegue subito con G47b.
