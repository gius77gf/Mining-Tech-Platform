# Checkpoint — 2026-08-09T15:05:12Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`b9d4724`

## Task completato

**Il buco «`contrasto.mjs` non apre le modali» è chiuso, e la controprova
COMPLETA — quella che il commit `b9d4724` dichiarava ancora in corso mentre lo
scrivevo — è tornata e va riportata.**

| | |
|---|---|
| superfici avvelenate | **9** |
| superfici che hanno bocciato | **9** |
| testimone `color-mix` bocciato | **0 volte su 9** (deve essere 0) |
| superfici che non hanno potuto dire niente | **5, e sono NOMINATE** |

## La cosa imparata

⛔ **UN SOGGETTO CHE NON SI PUÒ MISURARE VA NOMINATO, NON CONTATO.** Su cinque
superfici — `vetrina`, `id · non autorizzato`, `genesi · accesso`,
`id · accesso`, `id · profilo` — la passata forzata misura **0 testi**, perché
lì non si apre nessuna finestra: non c'è niente da avvelenare, quindi la
controprova non può né passare né cadere.

Le uscite possibili erano tre, e due sono sbagliate in modi opposti:
1. contarle fra le **cieche** → il banco si accuserebbe di un difetto che non
   ha, e cinque accuse false su quattordici insegnano a non guardare il
   verdetto;
2. contarle fra le **prese** → il verdetto direbbe «14 su 14» e il banco
   sembrerebbe misurare il doppio di quello che misura. È il denominatore
   gonfiato, che CLAUDE.md dichiara **peggiore** di nessun denominatore;
3. **nominarle**, che è quello che fa: *«⚠️ NON MISURATE (nessuna finestra si è
   aperta, quindi niente da avvelenare): vetrina, id · non autorizzato, genesi ·
   accesso, id · accesso, id · profilo. Non vuol dire «a posto»: vuol dire che
   lì questa controprova non ha potuto dire niente.»*

⚠️ La differenza fra (2) e (3) non è di severità, è di **leggibilità**: un
numero non si può riaprire, cinque nomi sì. Chi domani si chiedesse perché la
vetrina non è coperta trova la risposta scritta invece di doverla ricostruire.

## Le due passate stanno INSIEME, e va detto perché

Non sono una la versione migliore dell'altra: rispondono a due domande diverse,
e ognuna è cieca dove l'altra vede.
- `--modali` **raggiunge le finestre col gesto** (90 su 186 candidate, 4.686
  testi): copre il **corpo** che ogni app si costruisce con classi sue;
- `--forzate` **fa comparire quelle che il gesto non raggiunge** (206 aperture
  su 9 superfici, 124 testi distinti): copre le **parole della struttura
  condivisa** — titolo, corpo, bottoni del piede — le stesse per tutte le
  conferme, e che nessun gesto apre da solo.

Il riepilogo del banco lo scrive da sé, così nessuno può leggerne una e credere
di aver coperto tutto.

## Verifiche
- controprova completa: **9 avvelenate, 9 bocciate**, testimone `color-mix` a 0
- passata sana: **124 testi misurati, 0 sotto soglia**
- 343 classi mai comparse durante il giro → **276 fatte comparire e misurate**,
  0 sotto soglia; 67 col fondo non coprente, giudicate col caso **peggiore** e
  con la forbice stampata accanto
- 255 animazioni portate al loro ultimo fotogramma prima di misurare (in secondo
  piano Chromium non le fa avanzare: senza, si misurerebbe a metà)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo dalle **13:03:34Z** su una copia di `c6694e7`, a due ore d'età quando
scrivo, e **sta ancora scrivendo** (267 KB, verificato guardando il figlio vivo
e non solo il file). ⚠️ Attesta **161** banchi: NON contiene `--modali` né
`--forzate`, che sono arrivati dopo e portano il conto a **167**. La loro
assenza lì dentro **non va letta come «il buco è aperto»**.

## Cantieri paralleli aperti
Tre, su tre app diverse, nessuno dei quali committa:
**Terra** (direttiva 7 sul suo documento, 2 commit d'arretrato di cui 1 che
morde), **Campo** (direttiva 7, 1 commit che non morde) e **Genesi** (B3: la
prossima fetta fuori dalla pagina).

## Prossimo passo atomico
1. Raccogliere i tre cantieri, **rimisurare** ciò che riferiscono (niente entra
   sulla parola dell'agente) e committare io.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**. Lì dentro c'è la risposta su **`#vf-esito`** di
   Scudo, che il mio righello non è riuscito ad aprire da solo.
3. Il colore delle finestre è misurato solo a **430 px**: mancano **390 e 320**.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — l'ultima delle sette
tendine; **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso in cui nessuno ha
registrato fermi.
