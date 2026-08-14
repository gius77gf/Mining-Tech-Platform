# Checkpoint — 2026-08-09T20:25:43Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`56d83d8`

## Task completato

**Il checkout locale è tornato indietro da solo, e per venti minuti ho creduto
che qualcuno stesse scrivendo nell'albero.**

## Che cosa è successo, in ordine

1. `iniezioni-fresche` è caduta sulla copia del committato: un'iniezione citava
   cinque righe che il cantiere della frammentazione aveva riscritto. **Difetto
   vero**, e l'ho corretto accorciando l'ancora.
2. Rilanciandola, il file **non esisteva più**. E `git status` mostrava
   modifiche a Conti, Sentinella e `shared/dw-ponti.js` — file che nessuno dei
   miei cantieri aveva in mano.
3. La mia prima diagnosi è stata **«un'altra sessione sta scrivendo qui»**.
   Sbagliata.
4. La misura che l'ha smentita: `git rev-parse HEAD` dava **`9daa90d`**, un
   commit che non avevo mai visto, e **nessuno** dei miei undici commiti
   esisteva più in locale. Non era una scrittura: era **il terreno**.
5. `git fetch` ha detto la verità in una riga: `9daa90d..56d83d8`. Cioè il
   locale era un **antenato** del remoto — il contenitore è stato rifatto su
   uno snapshot più vecchio, e **tutto il lavoro spinto era salvo su origin**.

## La cosa imparata

⛔ **QUANDO UNA MISURA IMPOSSIBILE SI PRESENTA, LA PRIMA DOMANDA NON È «CHI
STA SCRIVENDO» MA «SONO DOVE CREDO DI ESSERE».** Un file che sparisce, un
`git status` pieno di file altrui e un test che prima passava sono i sintomi di
**due** cose diversissime: qualcuno che scrive, oppure il checkout che si è
mosso. Le distingue **una riga**: `git rev-parse --short HEAD` confrontato con
l'ultimo commit che ricordi di aver fatto. Io ci ho messo tre comandi e una
diagnosi sbagliata.
⚠️ È la stessa famiglia di tutta la giornata — *il sospettato è il righello, non
il soggetto* — con il righello diventato **il repository stesso**.

✅ **E la difesa ha funzionato senza che io la scegliessi**: `git merge
--ff-only` si è **rifiutato** di procedere perché tutti e dieci i file sporchi
erano fra quelli da aggiornare. Un `git pull` distratto avrebbe fatto un merge;
un `reset --hard` alla cieca avrebbe buttato via lavoro senza guardarlo. Il
rifiuto mi ha dato l'elenco esatto dei conflitti, ed è stato lui a farmi capire
che i dieci file erano **la stessa roba, in versione più vecchia**.

⛔ **E PRIMA DI BUTTARE VIA HO PROVATO CHE NON PERDEVO NIENTE**, invece di
dedurlo: `shared/dw-ponti.js` in locale conteneva `no-misura` (2 volte) ma
**non** `misura-zero` (**0**); sul remoto ci sono **tutt'e due** (2 e 2). Cioè
il locale era un intermedio **meno completo** di ciò che era già committato.
Solo dopo quella misura ho fatto il `reset --hard`, e le patch erano comunque
salvate in `scratchpad/salvataggio/`.

## Verifiche (dopo l'allineamento)
- HEAD **`56d83d8`**, albero **pulito**, allineato a `origin`
- `iniezioni-fresche` **309/309** · `numeri-nei-documenti` **34/0** con 176
  banchi · `copertura` 11 soggetti a posto, 0 scoperte · `run-kpi` **2005/0** ·
  `run-stile` **318/0**

## Che cosa è andato perso, dichiarato
⛔ Il lavoro **non committato** del cantiere sulla frammentazione (`pf` e `x50`
non calcolabili, `run-kpi` a 2016): quel cantiere è morto per il **limite di
sessione della piattaforma** prima di poter essere raccolto, e il suo lavoro
stava solo nell'albero locale. **Va rifatto.** Il difetto misurato resta quello:
con `kg` illeggibile `pf` esce **0,00 kg/m³** (rassicurante) e X50 passa da
**27 a 97 cm** (allarmante), e `Math.max(0.05, pf)` / `Math.max(1, P.kg)` sono
**clamp, non guardie**.

## Prossimo passo atomico
1. **Rifare** il cantiere `pf`/`x50` (sopra c'è tutto quello che serve per
   ripartire, misure comprese).
2. Riprendere i due tagli di `#sm-cava` (core) e `#ppv-scelta` (Sentinella): da
   `7717de1` `modali-dentro` è **rossa lì**, di proposito, e la domanda che
   conta è se `#ppv-scelta` la componga `accorciaVoceTendina` con un budget
   calcolato col righello vecchio.
3. Rileggere il giro con `leggi-giro.mjs` **quando finisce**.

## Blocchi
In attesa del fondatore: **quali** delle 47 mancanze confermate diventino
lavoro; se `disponibilitaTurno` debba restare **100%** su un turno chiuso senza
fermi; le righe dell'Allegato VII da aggiungere a `SCADENZE_PRESET`.
