# Checkpoint — 2026-08-09T03:11:34Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`15df310`

## Task completato

**La larghezza della carta sale in `giro.mjs`** (`larghezzaCarta`, `regolaPage`,
`FORMATI_CARTA`), e **il sospetto su `stampe-fs` si risolve al contrario di
come l'avevo scritto**.

## Le due cose imparate

1. ⛔ **LA TERZA COPIA SI FERMA PRIMA CHE NASCA, NON DOPO.** Nello stesso
   blocco la stessa decisione — *quanto è larga la carta su cui questo foglio
   si stampa?* — è nata in **due** banchi (`scudo-documenti` e
   `genesi-foglio-in-cava`), e la terza era già in vista (`stampe-fs`, con la
   domanda dichiarata aperta in roadmap). La regola di casa dice di scrivere
   una volta sola **a quel punto**, e non «quando servirà».
   ⚠️ E i **ripieghi** restano a carico di chi chiama, di proposito: Scudo
   legge la sua `@page` dal foglio di stile e non ripiega mai; Genesi non
   dichiara nessuna `@page` e passa `bordoMm: 10` — il margine di serie del
   browser — che il banco **stampa a ogni passata**. Un numero inventato in
   silenzio è peggio di un ripiego scritto.
2. ⏱️ **HO CORRETTO UNA MIA RIGA DI UN'ORA PRIMA, E LA CORREZIONE È IL METODO.**
   Avevo messo in roadmap che il difetto del prospetto di Terra («435 px dentro
   390») poteva essere un'**accusa falsa**, perché misurato contro la finestra
   invece che contro la carta. Ragionato fino in fondo, **non lo è e non può
   esserlo**: 390 px è più **stretto** di 718, quindi un foglio che ci sta in
   390 ci sta per forza sulla carta. `stampe-fs` non può produrre **assoluzioni
   false**; le sue accuse chiedono al foglio **più** di quanto chieda la
   stampante — e chiedere di più è difendibile, un prospetto leggibile anche su
   un telefono è meglio.
   Quello che resta vero del sospetto è **il nome**: chiamare «larghezza del
   foglio» una misura contro la finestra è il modo in cui qualcuno la copierà
   dove il denominatore conta davvero. La differenza è **dove vive il foglio**:
   un popup si misura contro la **finestra**, un `@media print` contro la
   **carta**.
   ⚠️ Scrivere un sospetto come sospetto è servito: se l'avessi scritto come
   fatto, il cantiere dopo avrebbe «corretto» `stampe-fs` rendendolo più
   permissivo — cioè avrebbe tolto una difesa vera per inseguire un errore che
   non c'era.

## Verifiche
- `scudo-documenti`: **88 ok · 0 KO** (688 px letti dalla pagina)
- `genesi-foglio-in-cava`: **36 passati · 0 falliti** (718 px, ripiego
  dichiarato a ogni passata)
- `giro-node`: **34 comandi a posto, 0 caduti**, rifatto sulla **copia** di ciò
  che si committa

## Stato roadmap
- ✅ la riga dei fogli stampati è chiusa su **tutte e otto** le superfici che
  stampano
- ✅ la riga su `stampe-fs` non è più un sospetto aperto: è una **distinzione
  scritta** (finestra ≠ carta) con la ragione per cui quel banco **non** va
  cambiato

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`). Alle 03:11 era vivo
da **4h02**, sopravvissuto al riavvio del contenitore, alla passata **~99 su
157** — quindi mancano ancora un paio d'ore. Un attendente è armato sul suo
pid e avvisa quando finisce.
Ordine: `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` →
**sezione 0 (età)** → **righe «non ho guardato»** → **KO veri**.
⛔ Attesta un commit di **venti unità fa**: la sezione 0 dirà di quanti commit
il branch è andato avanti e quanti toccano le superfici misurate, e i suoi KO
vanno riverificati sul commit di adesso prima di aprirci un cantiere.

## Blocchi
Nessuno.
