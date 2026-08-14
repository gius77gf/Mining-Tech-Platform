# Checkpoint — 2026-08-10T05:13:17Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`ff1d013` — *fix(flotta,sentinella): «1 superamenti» — e la stessa didascalia
scritta tre volte, ognuna più debole*
(prima: `2e77cb7` tendine del core, `3cec34f` recettore di Genesi)

## Che cosa è stato fatto — tre cantieri raccolti, uno per volta

### Genesi · B0-decies — non un numero tranquillo, un'**accusa falsa**
Con `design.recDist:null`, a **zero clic**: PPV **67.627,4 mm/s**, Airblast
**172 dB(L)** (il *tetto* della formula, contro i 127 veri), flyrock **rosso**, e
«gittata ammessa ~75 m … il progetto **NON li rispetta**». L'app accusava il
progetto di violare un limite che si era inventata.
⛔ **Le tre ragioni dell'esclusione non reggevano nessuna delle tre**: `ppvLimit`
gestiva **già** la frequenza assente (il `Math.max(2,…)` non proteggeva una
soglia, la **distruggeva**); l'allarme di `psCharge` **c'era già** a zero clic e
il clamp lo **nascondeva** al secondo.
⛔ Nessuna soglia toccata, e verificato da me: nel diff le uniche righe che
nominano `ppvLimit`/USBM/DIN sono **commenti** e la riga di `import`.
Il «null m» erano **tre**, e due **nei file** — `Norma PPV;DIN residenziale @
null Hz` nel CSV e nel file per Sentinella: la copia debole dove il documento si
compone.

### Tendine del core · B4-bis — da banco morto a **268 finestre**
La cura è **un argomento** (`montaFintoFirebase` ad `apriSuperficie`), non una
seconda implementazione. Prova d'ingresso stampata a ogni larghezza: **699
caratteri e 8 comandi** contro i 258 del guscio, e il guscio si riconosce **per
nome**, non per soglia.
⛔ E il banco ha trovato **tre difetti in sé stesso**, uno serio: usava
`ko === 0` come prova del «rosso voluto», ma su una superficie non pretesa
quella domanda è «ho guardato?» — vera **anche col difetto dentro**.
⚠️ Il taglio di `#sm-cava` a 430 **non si è riprodotto** (178 e 174 px in una
scatola da **352**): scritto, non taciuto.
⏱️ Servivano **due passate a sé** in `tutti.mjs`: senza argomenti il banco guarda
solo Scudo, quindi la correzione da sola non rimetteva il core nel giro — la
morte era la causa, la cecità l'effetto.

### Flotta e Sentinella — la stessa didascalia scritta **tre volte**
Ognuna teneva la guardia su una **metà diversa**: due dicevano «1 superamenti»,
la terza «1 letture» — e proprio quella aveva sopra il commento che spiega
perché lì si **sente**, visto che la legge uno screen reader. Ora la compone
`ariaSerie(apertura, s)` **nel modulo**, e `apertura` è **un argomento**.
In Flotta, **cinque** copie deboli di `oreMotoreTx` — il seguito del 06/08, che
ne aveva chiuse quattro — e una era **ancora il CSV del libretto**.
Censimento con denominatore: **2292 slot → 197 candidati → 103 scoperti → 35
punti veri in 24 frasi**.
⛔ **La trappola scritta nel mandato si è avverata sullo strumento del
cantiere**: cercando la guardia in un intorno largo, due difetti veri erano
assolti dalla guardia del **ramo accanto**. Stringendo: **+2 falsi allarmi, +2
difetti veri**.
⚠️ **Tre delle cinque proposte che la roadmap gli dava erano false**, smentite
leggendo: `[6,12,24]` è un elenco letterale, `aff.finestra` sta fra
{7,30,90,365}. Scritte come non-difetti **con la misura accanto**.
⚠️ E **due prove blindavano il difetto** (`csvAmbiente`: «1 inserite a mano»):
rese **più giuste, non più permissive**. Erano i 2 rossi di `run-kpi`.

## Numeri
`run-kpi` **2046 → 2054** · copertura **724/724 → 726/726** (fondo `genesi-data`
58→61, `sentinella-data` 133→134) · esecuzioni del browser **178 → 186**, file
di banco **74 → 77** · giro `node` **2829 → 2839**.

## ⚠️ Due errori miei, della stessa famiglia
Estraendo i blocchi di prove consegnati dai cantieri ho preso **anche la prosa**:
la prima volta *dopo* l'ultima graffa, la seconda *prima* della recinzione
```` ``` ````. Tutt'e due hanno rotto la sintassi e le ha prese `node` subito.
**Si estrae solo il contenuto fra i delimitatori del blocco di codice**, non
«dal primo `test(` in poi».
E un'iniezione di `genesi-documenti-che-escono` è diventata stale **nel commit
che migliorava il codice** — quarta volta: si ancora al pezzo **più corto che
sia unico**, non a un blocco di righe contigue.

## Verifica
Ogni unità sulla **copia di ciò che si committa**: 34 comandi a posto, 0 caduti.
Ogni banco **rimisurato da me** prima di committare: recettore **19/0** (e
controprova 3/16, 15/15 iniezioni), tendine `--solo=core` **6/0**, frasi
**33/0 · 0 scene non raggiunte** (e controprova 24/9, 13/13).
⚠️ Le due cifre del totale del giro corrette **dopo** l'ultima misura (2.834 →
2.839) non le legge nessuna suite tranne il controllo del giro stesso: il primo
giro della prossima unità le conferma.

## Stato roadmap
Chiuse oggi: **B0-quinquies, B0-sexies, B0-octies, B0-nonies, B0-decies,
B0-undecies, B3-bis, B3-ter, B4-bis, C1**.
Aperte: **B0-duodecies** (i 36 candidati di core/Campo/Scudo), **B0-bis**;
**B0-septies** ferma al fondatore.

## Prossimo passo atomico
Aprire tre cantieri nuovi (nessuno è vivo adesso) sulle voci rimaste, e in
parallelo lanciare il **giro del browser** — che stanotte non è mai stato
rilanciato perché i cantieri tenevano Chromium, e adesso ci sono **186
esecuzioni** registrate di cui **otto nate stanotte** che nel giro completo non
hanno mai girato insieme.

## Blocchi
Nessuno tecnico. Fermi al fondatore: **B0-septies** (che cosa vede chi apre il
2D di una volata senza maglia) e le **soglie di sicurezza**.
