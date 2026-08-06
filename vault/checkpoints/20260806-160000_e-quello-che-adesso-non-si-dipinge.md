# Checkpoint — 2026-08-06 16:00:00 UTC

## Tipo
unit-complete (una unità, più il canarino e un guasto di contenitore)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`d2f86db` — *Due colori del core sotto AA per giorni, e nessuna prova poteva
vederli*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| — | **canarino** (`a3ddf6c`) | la copia locale era **102 commit indietro** |
| 58 | **le classi che non si dipingono** (`d2f86db`) | `.av-su` **2,65:1** e `.av-mz` **3,35:1**, invisibili a tre suite verdi |

## ⛔ Prima dell'unità: il contenitore mentiva, e va saputo riconoscere
Il blocco precedente si è fermato sull'**unico stop legittimo** — il limite
settimanale della piattaforma — uccidendo tre cantieri a metà. Alla ripartenza
la copia locale del repository era ferma al `45617e9` del **2 agosto**, **102
commit** dietro il ramo remoto, e sopra quella base i cantieri morti avevano
lasciato dieci file modificati.

Un `git pull` normale si rifiutava; un merge alla cieca avrebbe **rimesso
indietro tre giorni di lavoro**. È la stessa forma del difetto misurato il
03/08 — un cantiere che ricostruiva un file da una base vecchia e riportava un
fondo da 38 a 37 — moltiplicata per cento.

⛔ **La prova che decide, e va rifatta ogni volta che si trova un albero così:**
confrontare ogni file del disco con la **sua versione remota**, non col
committato locale. Tutti e dieci risultavano più poveri (migliaia di righe
solo-remoto), e le righe «solo disco» erano **versioni vecchie riconoscibili**:
`aggiornaBadgeNotifiche`, rinominata da un commit successivo, e la prova
`testoPromemoria: null se regolare, senza lavoratore o senza data` — cioè
esattamente quella che `1857d83` aveva **corretto perché blindava un difetto**.
Nessun lavoro nuovo da salvare. Patch e copie integrali restano comunque in
`scratchpad/orfani/`, dichiarate e non buttate.

## ⛔ L'unità, e la domanda che la genera
Il banco del contrasto misura **343 testi** sul core e risponde **«0 sotto
soglia»**. È vero. E per giorni la roadmap ha portato cinque violazioni AA del
core mentre il banco ne diceva zero.

Tre erano già state chiuse da `71875c1`: la riga era **scaduta** — il difetto
della direttiva 7 fatto da noi, in casa nostra.
Le altre due erano vive, e nessuna prova poteva vederle, perché **nello stato
di partenza quei colori non ci sono**. Il pallino delle notifiche compare se ci
sono notifiche, la pillola «non salva» se il salvataggio fallisce, il toast
quando c'è qualcosa da dire, gli avatar dei ruoli solo nelle liste che li usano.
**Un colore che si vede in un momento difficile non è un colore meno
importante: è quello che l'utente legge quando ha più fretta.**
È la stessa forma di «68 modali da aprire, 0 aperte»: il numero verde è onesto e
non dice niente su ciò che non è comparso. Il rimedio non è più severità — è
**una seconda domanda**, e la risposta la sa già il foglio di stile.

## ⚠️ E il censimento ha sbagliato tre volte prima di funzionare
Tutte e tre della stessa famiglia — *il controllo che non guarda dove crede*:
1. **una regola di stile ORA ha `cssRules`.** Era scritto `if (r.cssRules)
   { scendi(); continue; }` — «se ha figli è un contenitore», vero fino a ieri.
   Col CSS annidato Chromium la dà (vuota) anche alle regole normali: **620
   regole su 649 saltate**, e la risposta era «0 classi candidate». Un numero
   che sembrava una risposta;
2. il primo `.catch(() => [])` **ingoiava l'eccezione** e stampava lo stesso
   zero. Tolto: se non gira, lo si LEGGE;
3. la prima versione accusava `.chart-bar` a 1,56:1 — una barra di grafico non
   contiene testo, e il testo ce l'avevo messo io per misurarla. Adesso entra
   solo chi dichiara `background` **E** `color` nella stessa regola: è la sola
   dichiarazione d'intenzione che un foglio di stile sappia dare.

Il limite è **dichiarato, non nascosto**: si fanno comparire solo le classi con
un fondo proprio e coprente (per quelle il contesto non conta); le altre — 47
sul core — si elencano e basta, perché misurarle in un contenitore inventato
vuol dire accusare un colore per il posto in cui ce l'ho messo io.

## Stato delle prove
Giro `node` **21 comandi, 0 caduti** sulla copia di ciò che si committa. Banchi
del browser **84 → 85** (la controprova nuova), aggiornati nei documenti.
Le due controprove che il banco aveva già passano ancora. Scatto prima/dopo dei
due avatar nella riga vera del core (`.sitem`, testo vero), guardato: «MR» sul
blu chiaro è slavato, sul blu profondo è netto.

## Che cosa sta girando adesso
**Tre cantieri**, riaperti dopo il limite: **Scudo** (dichiarazione «dati di
esempio» sui fogli + la tendina `#nm-chi`, da **rimisurare** prima di toccare),
**Campo** (dichiarazione sul rapporto di fine turno), **i CSV** di
conti/flotta/sentinella/terra/genesi.

⚠️ La CI del canarino è rossa per un **guasto di GitHub Actions**
(`Failed to resolve action download info: Service Unavailable`, tre tentativi),
non per il codice: quel commit tocca un solo markdown. Il push successivo la
rilancia.

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **app per app**: indice costruito **da `HEAD`**
   tagliando la banda dell'app, worktree **ricreata** ogni volta, numeri di
   `docs/` riletti **dalla copia**. Marcatori di banda concordati in
   `run-kpi.mjs`: `// ═══ SCUDO · la dimostrazione dichiarata (06/08)`,
   `// ═══ CAMPO · la dimostrazione dichiarata (06/08)`,
   `// ═══ I CSV E LA DIMOSTRAZIONE DICHIARATA (06/08)`.
2. ⚠️ Il cantiere dei CSV ha il **divieto** di toccare `shared/`: se conclude
   che serve una funzione condivisa, arriva come **proposta**.
3. Poi: far girare il censimento delle classi mai comparse **sulle altre sei
   superfici** — sul core ha trovato due difetti al primo colpo, e non c'è
   ragione di credere che le app siano diverse.
4. Poi: le tre proposte della ricerca su Scudo, **rimisurate una per una**.

## Code aperte, dichiarate
Le **19 decisioni** procedono **venerdì 07/08** (domani) se non arriva
risposta, dichiarandolo nel commit. Restano ferme le 6 che richiedono il
fondatore. La riga **DUVRI** aspetta lui col suo RSPP.

## Blocchi
Nessuno.
