# Checkpoint — 2026-08-09T00:43:18Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`98c1014`

## Task completato

**La SECONDA gamba della domanda di casa (il PDF / il foglio stampato), e il
censimento diventato un controllo.**

Due unità dentro lo stesso filo:
1. `stampe-fs` dichiarava «resta fuori **Campo** … non è dimenticanza, **è il
   lavoro dopo**». Falso su tutt'e due le metà: l'impianto che raccoglie il
   popup **è in quel file** (costruito per Terra), e il lavoro c'era già —
   `campo-foglio-turno` chiede a Campo **la domanda di `stampe-fs`** sul foglio
   e sulla consegna `.txt`;
2. il censimento è diventato `apps/deepwork-id/tests/fogli-guardati.mjs`, in
   `npm test`: **8 superfici su 8**, 79 banchi letti, elenco delle superfici
   **derivato** da `SUPERFICI` di `giro.mjs`.

## Le tre cose imparate

1. ⛔ **Un censimento che conosce N convenzioni chiama «mancante» la N+1.** La
   prima stesura del controllo dichiarava **Genesi scoperta**: non lo era.
   «Premere un foglio» qui è scritto in **quattro** modi — `emulateMedia`,
   l'evento `popup`, il gancio `__stampa`, e `window.open` **sostituita** in un
   `addInitScript` — e la quarta è proprio quella di Genesi e Campo. È lo
   stesso errore del censimento delle iniezioni e di quello che poche ore prima
   è costato **trecento righe** di banco buttate. Perciò i gesti sono
   **dichiarati e contati**, e una prova pretende che servano ancora tutti e
   quattro: quando il controllo accusa, la prima domanda è *«è nata una quinta
   convenzione?»*, non «chi ha dimenticato il banco?».
2. ⛔ **La controprova ha trovato un buco nel controllo stesso.** Lo spoglio
   dei commenti stava dal **chiamante**: un secondo chiamante col testo grezzo
   perdeva la difesa, e un gesto scritto **dentro un commento** contava come
   codice. È la guardia scollegata (regola 17) nel posto più beffardo — dentro
   il controllo scritto per non farsi ingannare. Adesso `senzaCommenti` sta
   **dentro `chiPreme`**, dove la decisione si prende.
   Il costo di quel buco, misurato: senza spoglio il core risultava premuto da
   **25** banchi (ne sono 12) e Campo restava «coperto» **anche cancellando il
   suo unico banco vero**.
3. ⏱️ **Terza riga in una notte che propone un lavoro già chiuso** (le altre:
   la geometria dei gradienti in `CLAUDE.md`, la scala `--nav-scala`). E il
   documento del censimento — `docs/I_FOGLI_CHE_NESSUN_BANCO_PREME.md` — la
   correzione **l'aveva già fatta**: a restare indietro era il **commento nel
   codice**, cioè il posto che uno legge mentre lavora, non quello che si apre
   per fare il punto.

## Verifiche
- `fogli-guardati`: **7 prove, 0 falliti**, con **quattro** controprove nei due
  versi (una superficie che nessuno preme viene vista; un banco che NOMINA la
  pagina senza premere non conta; uno che preme davvero conta; la parola
  «stampato» in un commento non basta)
- `node giro-node.mjs`: **32 → 34 comandi a posto, 0 caduti**
- identità della patch verificata, e il controllo **rilanciato sulla copia** di
  ciò che si committa
- `suite-collegate` 3/0 su 118 file (il file nuovo è registrato)

## Stato roadmap
Filone «i numeri che mentono con la faccia tranquilla»: **prima gamba** (il CSV)
chiusa su tutte le superfici, **terza** (la frase) su sei, **seconda** (il
foglio stampato) censita e adesso sorvegliata. Nessuna domanda di prodotto in
sospeso.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`) quando ha finito — alle 00:43 era a **36
passate** su ~196, con circa 1h35 di cammino alle spalle.
⛔ Prima domanda: **«sta ancora scrivendo?»** (processo figlio vivo, file che
cresce), non «che cosa dice».
Poi `node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` in
quest'ordine: **sezione 0** (età) → **righe «non ho guardato»** → **KO veri**.
⚠️ Quel giro attesta `7cddb59`, cioè **prima** delle nove unità di stanotte: i
suoi KO su Conti, sul core e su Genesi vanno riverificati sul commit di adesso
prima di aprirci un cantiere. È esattamente il caso per cui la sezione 0 esiste.

## Blocchi
Nessuno.

## Note
Nove unità in questo blocco, tutte committate e spinte: `fe55bb6`, `cc8225e`,
`bfa4517`, `7581402`, `ba76ecb`, `34e20c3`, `47bb21d`, `7880b5f` e `98c1014`.
