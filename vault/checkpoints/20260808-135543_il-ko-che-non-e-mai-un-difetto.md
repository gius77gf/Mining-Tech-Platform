# Checkpoint — 2026-08-08 13:55 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`2f88c56` — test(csv): con una app sola il denominatore può
essere zero per natura

## Che cosa è stato completato
`csv-dimostrazione --solo=scudo` dava **«33 ok, 1 KO»** anche su una copia
**pulita di `HEAD`** — misurato apposta prima di dare la colpa al mio lavoro.
Il KO era la guardia del denominatore («il controllo dei decimali ha guardato 0
numeri veri») e **non era un difetto del prodotto**: nei CSV di Scudo, nella
dimostrazione, non c'è **nessun** numero decimale. Il controllo non aveva un
soggetto guasto: non aveva un soggetto.

**Un KO che non può mai essere un difetto insegna a non guardare i KO.** È la
stessa famiglia del rosso di una controprova letto per rosso vero, e costa allo
stesso modo — qualcuno apre un cantiere su niente, o smette di leggere la
colonna. La forma giusta è quella che questo repository usa già per i soggetti
mai comparsi: una riga **«NON HO GUARDATO»**, che si legge **prima** dei KO.
Il KO resta dov'è vero: sul **giro intero**, dove i numeri sono 215 e uno zero
vorrebbe dire che il banco non sta più leggendo i file.

⚠️ La soglia era **già** stata abbassata a `>0` sotto `--solo` per Terra (7
numeri): Scudo ne ha **zero**, quindi nemmeno quella bastava. Non è una regola
più permissiva — è la stessa regola col suo denominatore, e quando il
denominatore è zero la risposta onesta è «non misurato».

## Verifiche (controprova nei due versi, perché una guardia che tace sempre
sarebbe peggio di quella che gridava)
- `--solo=scudo` (0 numeri) → la riga **NON MISURATO**, **33 ok / 0 KO**;
- `--solo=terra` (7 numeri) → l'asserzione **c'è ancora** e passa, 25 ok / 0 KO;
- **giro intero** → 215 numeri, asserzione piena, **225 ok / 0 KO**;
- giro `node` **27/27** sulla copia di ciò che si committava (patch identica).

✅ E quel giro intero vale anche come **verifica di tutto lo spostamento di
oggi**: i sette file che si ri-caricano sono ora tutti composti nei moduli, e il
banco misura gli **stessi** 215 numeri, gli **stessi** 41 bottoni e le **stesse**
33 righe su 34 di prima. Cioè: sei compositori spostati, zero differenze
osservabili.

## Prossimo passo atomico
**Raccogliere il giro del browser** (PID 16670, ~2h20 di vita, registro in
`scratchpad/nomi4/giro-nuovo.txt`) con
`node apps/deepwork-id/tests/browser/leggi-giro.mjs <registro>` — **sezione 1
prima della sezione 2**, poi la riga «le tre passate più lente» per ritarare il
limite di 30 minuti.
⚠️ Attesta `c3888fe`: le sei unità di oggi **non ci sono dentro**.
⚠️ Nel registro il rosso di una **controprova** è il verde del banco:
l'intestazione lo dichiara, si legge quella riga prima di aprire un cantiere.
⚠️ E la prima domanda su un registro lungo è **«sta ancora scrivendo?»**, non
«che cosa dice»: un registro troncato a metà sembra completo.

## Blocchi
Nessuno.
