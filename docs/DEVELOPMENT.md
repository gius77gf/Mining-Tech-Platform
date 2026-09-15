# Sviluppo — come si lavora su questo repository

*Aggiornato il 31/07/2026. La versione precedente era ferma alla primissima
fase («v1.0 Field Operations Platform», «localStorage per persistenza dati») e
descriveva un prodotto che non esiste più: chi la leggeva si faceva un'idea
sbagliata di tutto — di dove stanno i dati, di quante superfici ci sono, di
cosa è già coperto da prove.*

## Cos'è, in due righe

Un monorepo di applicazioni web **senza framework e senza build**: HTML, CSS e
JavaScript a moduli, aperti direttamente dal browser. I dati stanno su
**Firestore**, isolati per organizzazione; senza login le app mostrano una
**demo** con dati finti, così si possono aprire e far vedere senza configurare
niente.

## Le superfici

| Dove | Cos'è |
|---|---|
| `index.html` (radice) | il **core** Deepwork: un monolite di ~8.000 righe, PWA |
| `apps/index.html` | la **vetrina** dell'ecosistema |
| `apps/<nome>/` | le sei app verticali: `campo`, `conti`, `flotta`, `scudo`, `sentinella`, `terra` |
| `apps/genesi/` | il simulatore di volata |
| `apps/deepwork-id/` | accesso, abbonamenti, isolamento (la «Fase 0») |
| `shared/` | stile vincolante + SDK identità + motore grafici + convenzioni comuni |

Ogni app verticale è fatta di due file: `index.html` (la pagina) e
`<nome>-data.js` (le **funzioni pure**: calcoli, letture CSV, riepiloghi). La
divisione non è estetica — è quello che rende le app **provabili senza
browser**.

## Aprire il progetto in locale

```sh
python3 -m http.server 8823        # dalla radice del repo
# poi: http://127.0.0.1:8823/apps/       (la vetrina)
#      http://127.0.0.1:8823/apps/conti/ (una app)
```

⚠️ **Il core (`/index.html`) non si apre in locale, e non è colpa del login.**
Tutto il suo programma sta in un `<script type="module">` che importa Firebase
da `gstatic.com`: senza rete l'import fallisce, il modulo non parte e restano i
segnaposto («Funzione nav non ancora pronta»). Per aprirlo davvero si monta
`apps/deepwork-id/tests/browser/finto-firebase.mjs` **prima** di navigare.

## Le prove

**3.495 prove girano senza rete e senza browser**, con `node` (contate lanciandole, non a memoria — al 15/09: 3011 + 328 + 75 + 32 + 9 + 8 + 7 + 3 + 22), dopo aver aggiunto a `run-kpi` la prova che «saldata» e «parziale» non sono mai vere insieme in `statoFattura` di Conti, a `claims-convergenza` il limite a tre scritture, a `kpiFrom` di Scudo un `oggi` fisso, alla conformità di Terra il fronte conteso fra due lotti, a `tagliandiInScadenza` di Flotta lo stesso criterio di `urgenzaManutenzione`, a `fogliaVolata` di Sentinella la lettura trovata per valore e non solo per (data, ora), a `applicaIncassi` di Conti la cecità alle note di credito, a `cancellazioneLasciaBuco` la numerazione DDT senza salti dichiarata ma non imposta, al margine fra esaurimento e scadenza in `vitaCava` di Terra, alla sospensione temporanea in `abilitazioneLavoratore` di Scudo, a `reclamiPerRicettore` di Sentinella l'aggregazione per punto, a `costoControStoria` di Flotta il costo medio per intervento contro la sua storia, a `varianzaMensilePiano` di Terra lo scarto del mese corrente dal piano annuo, a `prioritaOperative` di Flotta le voci "trend" sul consumo e sul costo fuori tolleranza, a `avvisiChiusuraTurno` di Campo gli avvisi (non bloccanti) sull'appello e sulle attività aperte alla chiusura del turno, a `tendenzaRitmo` di Terra il ritmo corto contro quello lungo, a `testoSollecito` di Conti l'escalation per livello del sollecito, a `fattureOltre90` di Conti l'elenco per il commercialista, e a `cartellaLavoratore` di Scudo gli infortuni della persona collegati al fascicolo:

> ⚠️ **E quel numero conta NOVE suite, non tutto quello che gira.** Il giro
> `node` completo esegue **3.918** asserzioni su **40** comandi.
> ⏱️ **Dal 09/08 quel numero non si scrive più a mano: lo stampa il giro**
> (`node apps/deepwork-id/tests/giro-node.mjs`, riga «Asserzioni eseguite dal
> giro»), col suo denominatore accanto — 22 comandi su 34 hanno una riga da
> sommare, e gli altri **12 sono nominati** invece che contati.
> ⛔ *E «lo stampa il giro» non bastava: era rimasto **2.757** mentre il giro ne
> eseguiva 2.815 — stale di cinquantotto — perché stamparlo e ricopiarlo a mano
> sono la stessa cosa. Dal 09/08 il giro, dopo aver stampato il totale,* **apre
> questi due documenti e pretende che dicano lo stesso numero**: se no scrive
> quale documento sbaglia e *esce diverso da zero. Un dato si sorveglia dove
> nasce — qui, che è l'unico posto che li ha lanciati tutti; in*
> `numeri-nei-documenti.mjs` *vorrebbe dire rilanciare il giro dentro il giro.*
> ⛔ *Prima era ricopiato a mano e diceva **2.663**, poi **2.728**: il vero è
> 2.757. E il difetto stava anche nel modo di misurarlo — il primo righello
> scritto per automatizzarlo prendeva il **primo** «N passati» dell'uscita di
> ogni comando, e* `orologio-cliente.mjs` *RILANCIA tre suite in ora italiana
> stampandone i riepiloghi: il conto si riprendeva il «1984 passati» di*
> `run-kpi` *una seconda volta e diceva **4741**, gonfiato del 72% da un comando
> solo. È una RIPETIZIONE contata come roba nuova — la stessa famiglia del
> riepilogo del giro del browser — e l'ha presa solo il confronto fra due
> righelli indipendenti. La forma che regge: si legge l'**ultima** riga, cioè il
> verdetto che il comando dà **di sé**.*
> ⚠️ *Fra i 12 non contati ci sono le controprove, che stampano un verdetto
> invece di un totale: girano davvero, e le loro asserzioni sono vere, ma su un
> difetto messo apposta.*
> ⚠️ *Questa nota era ferma al 07/08 e diceva 2.474 e «il numero da citare resta
> 2.251» mentre il titolo sopra diceva già 2.310: il controllo sorveglia il
> **totale**, non la prosa che lo spiega. È la quarta forma di invecchiamento
> raccolta in `CLAUDE.md`.*
> **Il numero da citare resta 3.203**, e la ragione è che le altre dieci contano
> **file, non prove**: `import esistenti` fa un'asserzione per file e `classi
> orfane` una per pagina, quindi il loro totale si muove ogni volta che nasce un
> file — un numero che cresce senza che nessuno abbia scritto una prova è un
> numero che non vuol dire niente. Le sei suite contano **casi**, e per questo
> sono quelle sorvegliate da `numeri-nei-documenti.mjs`.

E **1006 funzioni pure su 1006** sono chiamate per nome da quelle prove: tutte e
sei le app al 100%. Non è «provate bene» — è «non ce n'è nessuna che nessuno ha
ancora guardato», che è il minimo e finora non c'era.

⚠️ **Quel 802 conta le sei app, non i moduli condivisi**, e la riga di riepilogo
lo dice («in 6 app»). I condivisi si contano a parte — **332 su 332** in cinque
moduli: `dw-shell.js` **61/61**, `dw-ponti.js` **89/89**, `genesi-data.js` **168/168**, `genesi-formato.js` **9/9**, `pointcloud.js` **5/5**. Vanno guardati
con più attenzione delle app, non con meno: una funzione sbagliata lì sbaglia in
sei posti insieme.
⏱️ **Questi sei numeri sono invecchiati due volte in due giorni, e la seconda
volta sotto la riga che spiegava perché sarebbe successo.** Prima erano fermi a
«593 · 23/23 · 31/31 · 5/5», cioè a un perimetro di **tre** moduli; corretti
l'08/08 a «142 · 46/46 · 46/46 · 37/37», l'09/08 erano di nuovo falsi in cinque
valori su sei (165 · 47/47 · 47/47 · **58**/58). E accanto c'era scritto: *«il
controllo sorveglia il totale delle app, non questa scomposizione: rimisurati a
mano»*. **Dichiarare un punto cieco non lo illumina** — è la stessa lezione
della tabella di Genesi qui sopra, nello stesso documento, lo stesso giorno.
Da adesso li sorveglia `numeri-nei-documenti.mjs`, **modulo per modulo**, con
l'elenco dei moduli **derivato dall'uscita del censimento**: un modulo condiviso
nuovo entra da sé, e non c'è nessun elenco a mano che possa non sapere che
esiste.

⛔ **E il 100% vale per il perimetro misurato, non per tutto il prodotto.**
Le sei app hanno la loro logica in `apps/<nome>/<nome>-data.js`, che `node`
importa. **Genesi no**: le sue **136 funzioni** stanno dentro
`apps/genesi/genesi.html`, e da lì non si importano — di Genesi entrano nel
conto solo i moduli già tirati fuori (`pointcloud.js`, `genesi-formato.js`,
`genesi-data.js`, elencati con i loro conti nella tabella dei condivisi qui
sopra). ⏱️ *Fino al 09/08 questa riga diceva «entra solo `pointcloud.js`», ed
era vera il 01/08: gli altri due sono nati dopo. Terza riga dello stesso
documento invecchiata nella stessa giornata, e la sola difesa che ha funzionato
è stata un censimento che conta i numeri dichiarati e guarda quanti ne
sorveglia una regola.* Non è una svista da correggere in una riga — ma dal
01/08 «è un cantiere intero» ha smesso di essere una frase ed è diventato un
**numero**, perché una frase non dice da dove si comincia né quanto si è
avanzati. `node apps/deepwork-id/tests/genesi-estraibili.mjs` misura quante
funzioni si possono portare fuori **senza cambiargli la firma**:

| variabili del modulo che legge | funzioni |
|---|---|
| nessuna — si porta fuori com'è | **23** |
| una o due | **39** |
| da tre a cinque | 17 |
| da sei a dieci | 18 |
| più di dieci — lì è un rifacimento | 39 |

Cioè **47 su 136 si estraggono senza rifare il modo in cui Genesi tiene il suo
stato**, e le restanti 89 sono una decisione di architettura.
⏱️ *49→48, 57→56 e 143→142 il 14/09 (B3, stesso giorno): `_snapXY(D2, v)`,
l'ultimo "legame di una riga" rimasto nel blocco G34 (l'aggancio opzionale
alla griglia) — componeva solo `snapAGriglia` già pura. Dieci punti di
chiamata nella pagina, tutti dentro gli event handler del mouse dell'editor
2D, tutti aggiornati a passare `D2` (sostituzione globale sicura: `_snapXY(`
non compare in nessun altro contesto). Nessun wrapper lasciato. Stesso
margine dello strumento già visto su `activeProf`: `d2Move` guadagna
`renderInspector` nel proprio elenco "chiama" (chiamata presente nel suo
corpo da sempre, prima mascherata da `_snapXY`) — bucket "3-5" invariato.*
⏱️ *48→47, 56→55 e 142→141 il 15/09 (B3, cantiere ripreso dopo la misura
sul costo di `selRoccia`/`selEsplosivo`/`selInnesco`, vedi checkpoint
`20260914-234319`): `computeInnesco2D(D2)`. Il G39 del 14/09 aveva già
estratto `innescoSuMaglia`, ma aveva lasciato in pagina il legame a zero
argomenti — stessa forma di `computeEnergia2D`/`computeRelief2D` prima di
loro, e nessuna ragione strutturale per fermarsi un passo prima: unico
chiamante (`computeSeq2D`) già con `D2` in scope. Non lascia un wrapper
(era già zero-arg, ora è un'importazione). Difetto iniettato provato e
rimesso: uno scambio S/B è invisibile per costruzione (usati solo dentro
un `Math.max` simmetrico); il difetto verificabile è sulla sorgente dei
fori. Unico effetto collaterale: `computeSeq2D` perde `computeInnesco2D`
dal proprio elenco "chiama" (stessa famiglia già vista su
`computeEnergia2D`/`computeRelief2D`).*
⏱️ *47→46, 55→54 e 141→140 il 15/09 (B3, stesso giorno): `_sigDetTimes`
è uscita del tutto dalla pagina (nessuna funzione nuova nel modulo:
componeva SOLO `tempiDetonazione(D2)`, già esattamente la forma che
`genesi-data.js` espone dal G23 del 10/09 — un alias senza logica
propria, come `sitoStore`). I suoi due chiamanti (la modale del PPV
composito, il nome del file esportato) chiamano `tempiDetonazione(D2)`
direttamente. Nessuno spostamento di bucket per altre funzioni,
misurato confrontando `--elenco` prima/dopo.*
⏱️ *46→42, 54→50 e 140→139 il 15/09 (B3, stesso giorno): `mdlProfSnap`
è uscita del tutto dalla pagina (nessuna funzione nuova: componeva SOLO
`scattoProfili(P.profilo, D2.piede)`, già pura dal blocco G30 dell'11/09).
I suoi tre chiamanti (`mdlPushUndo`, `mdlUndo`, `mdlRedo`, la stessa
famiglia undo/redo del modello 3D) chiamano `scattoProfili` direttamente.
⚠️ **Effetto collaterale reale, non un margine dello strumento**: i tre
chiamanti leggevano `mdlUndoStack` (e `mdlRedoStack`/`MDL_UNDO_MAX`) e
basta — `P`/`D2` restavano dentro `mdlProfSnap()`, quindi mascherati.
Inlineando la composizione dentro i loro corpi, `P` e `D2` diventano
letture dirette e tutti e tre salgono dal bucket "1-2" al "3-5" (bucket
"1-2" 46→42, "3-5" 14→17: −4 e +3, non −1 e +0 come nelle unità
precedenti). Misurato confrontando `--elenco` prima/dopo su una
worktree, non dedotto.*
⏱️ *42→41, 50→49 e 139→138 il 15/09 (B3, stesso giorno): `crestZ` è
uscita del tutto dalla pagina (nessuna funzione nuova: componeva SOLO
`quotaCresta(P.profilo, x)`, già pura dal blocco G24 del 10/09). I sei
chiamanti — sparsi su funzioni non correlate (la scheda dei fori, la
sincronizzazione 3D del modello, l'esportazione del piede) — chiamano
`quotaCresta(P.profilo, x)` direttamente. A differenza di `mdlProfSnap`,
nessuno spostamento di bucket per altre funzioni: i sei chiamanti
leggevano già altre variabili proprie in numero sufficiente da non
cambiare scaglione con l'aggiunta di `P`, misurato confrontando
`--elenco` prima/dopo.*
⏱️ *41→40, 49→48, 168 su 168 condivisi (era 167) e 138→137 il 15/09
(B3, stesso giorno): `measureGeom2D(design)`. Il G35 del 13/09 aveva
già estratto `misuraGeom2D` ma lasciato in pagina il legame a zero
argomenti — sette punti di chiamata, tenuto per il nome corto invece
di ripetere tre campi ad ogni chiamata. Nessuna ragione per lasciarlo
in pagina: stesso nome, salito nel modulo con lo stato come primo
argomento esplicito. Difetto iniettato provato e rimesso: uno scambio
dei due campi nel composer si vede SOLO nel caso senza fori (con fori
veri la spaziatura si ricalcola dalle posizioni, stessa famiglia di
`_spazTipico`/`computeInnesco2D`), catturato dal test dedicato.
Nessuno spostamento di bucket per altre funzioni: i sette chiamanti
leggevano già abbastanza altre variabili di modulo, come per `crestZ`
e a differenza di `mdlProfSnap`, misurato confrontando `--elenco`
prima/dopo.*
⏱️ *40→39, 48→47 e 137→136 il 15/09 (B3, stesso giorno): `interpFronte`
è uscita del tutto dalla pagina
(nessuna funzione nuova: componeva SOLO `interpProf(D2.profilo, mx)`,
già pura dal blocco G9 del 09/08). Il legame più grande chiuso finora
per punti di chiamata (sedici, sparsi su funzioni di rendering non
correlate — il disegno 2D, la mappa dell'energia, la rete di
collegamento, l'editor del piede), sostituito con uno script Python
di replace globale (sicuro: la sottostringa non compare altrove,
confermato con `grep -c` prima e dopo). Nessuno spostamento di bucket
per altre funzioni, misurato confrontando `--elenco` prima/dopo: i
sedici chiamanti erano già in buckets più alti. Resta deferred il
gruppo `selRoccia`/`selEsplosivo`/`selInnesco` (46 punti di chiamata,
quasi tre volte questo).*
⏱️ *52→49, 60→57 e 146→143 il 14/09 (B3, stesso giorno): TRE funzioni uscite
insieme — `activeProf(D2)`, `d2HitTest(D2, px, py)`, `d2HitTestPt(D2, px, py)`
— perché `d2HitTest`/`d2HitTestPt` compongono `puntoTela`/`indicePiuVicino`
già pure e `d2HitTestPt` compone anche `activeProf`: non potevano cambiare
firma separatamente. `activeProf` è la prima fetta di B3 senza una funzione
pura preesistente da comporre — calcola direttamente da `D2.tool`, pura di
suo. `d2HitTest` sostituisce `interpFronte(mx)` (wrapper di pagina, resta:
sedici altri punti di chiamata) con `interpProf(D2.profilo, mx)` diretto,
come già per G41. Nessuna delle tre lascia un wrapper: sei punti di chiamata
in tutto.
⚠️ Effetto collaterale nel censimento, non un bucket-shift: `d2Move` mostra
`computeSeq2D` nel proprio elenco "chiama" dove prima non compariva — quella
chiamata è nel suo corpo da sempre (riga non toccata da questa unità), il
censimento la vedeva mascherata mentre elencava `activeProf`. Margine noto
dello strumento, non un difetto di questa fetta.*
⏱️ *54→52, 62→60 e 148→146 il 14/09 (B3, stesso giorno): DUE funzioni
indipendenti in un'unica unità — `_spazTipico(D2, H)` (componeva solo
`spaziaturaTipica` già pura dal blocco G24) e `innTaglioOk(D2, dt)`
(componeva solo `taglioRealizzabile` già pura dal blocco G25). Non
accoppiate come `scatterMs`/`computeRelief2D`: erano semplicemente gli
ultimi due "legami di una riga" rimasti nei rispettivi blocchi. Nessuna
delle due lascia un wrapper (tre punti di chiamata in tutto). Nessuno
spostamento di bucket per altre funzioni.*
⏱️ *55→54, 15→14, 63→62 e 150→148 il 14/09 (B3, stesso giorno): DUE funzioni in un'unica
unità, perché accoppiate — `scatterMs(D2)` (dal bucket "3-5": un falso
positivo del censimento, leggeva solo `D2` più tre parole corte di un
commento vicino) e `computeRelief2D(D2)` (dal bucket "1-2"), che chiama
`scatterMs` e quindi non poteva cambiare firma da sola. Componevano solo
`scatterInnesco`/`reliefSuMaglia` già pure. Nessuno dei due lascia un
wrapper (tre punti di chiamata in tutto, tutti aggiornati a passare `D2`).
Unico effetto collaterale reale: `computeSeq2D` perde `computeRelief2D`
dal proprio elenco "chiama" (stessa famiglia di `computeEnergia2D`).*
⏱️ *56→55, 64→63 e 151→150 il 14/09 (B3, stesso giorno): `isoPasso`, stesso
schema (`isoPasso(D2)`), componeva solo `passoIsocrone` già pura dal blocco
G24 (10/09) — come `computeEnergia2D`, esce DEL TUTTO dalla pagina (nessun
wrapper: due punti di chiamata, entrambi aggiornati a `isoPasso(D2)`).
Nessuno spostamento di bucket per altre funzioni.*
⏱️ *57→56, 65→64 e 152→151 il 14/09 (B3, stesso giorno): `computeEnergia2D`
è uscita dalla pagina DEL TUTTO (non lascia un wrapper: era void, un solo
punto di chiamata dentro `computeSeq2D`), stesso schema
(`computeEnergia2D(D2)`), componeva solo `energiaSuMaglia` già pura dal
blocco G41 (14/09). Unico effetto collaterale misurato confrontando
`--elenco` prima/dopo: `computeSeq2D` perde `computeEnergia2D` dal proprio
elenco "chiama" (non è più una funzione della pagina, è un import) —
nessuno spostamento di bucket vero.*
⏱️ *58→57, 66→65 e 153→152 il 14/09 (B3, stesso giorno): `reliefCls` è
uscita dalla pagina, stesso cambio di firma (`reliefCls(D2, r)`).
Componeva solo `classeRelief`, già pura in `genesi-data.js` dal blocco G26
(10/09) — la prima volta che B3 tocca un "legame di una riga" già marcato
"resta come legame" da un cantiere precedente, invece di uno senza quel
commento: la nota descriveva l'architettura di quel momento, non un
divieto a finire l'estrazione dopo. I suoi due chiamanti (`drawDesign2D`,
`renderInspector`) leggono già `D2` per conto proprio: nessuno spostamento
di bucket, misurato confrontando `--elenco` prima/dopo su una worktree.*
⏱️ *59→58, 67→66 e 154→153 il 14/09 (B3, stesso giorno): `pieDev` è
uscita dalla pagina, stesso cambio di firma (`pieDev(D2, x)`). Effetto
collaterale VERO, non rumore dello strumento: `mdlBuild` (che la
chiama) è passata dal bucket "sei-dieci" a "più di dieci" (19→18,
38→39) perché ora scrive `D2` esplicitamente nella chiamata — quel
token è nel suo corpo per davvero, non nel commento di qualcun altro.
Misurato confrontando `--elenco` prima/dopo: è l'unica funzione che ha
cambiato bucket.*
⏱️ *60→59, 68→67 e 155→154 il 14/09 (B3, cantiere del trasloco di Genesi,
ripreso dopo G47): `pfNominale` è uscita dalla pagina, con CAMBIO DI
FIRMA (`pfNominale(D2)` invece di leggere `D2` dalla chiusura) — lo
stesso schema già usato per ogni altro "legame di una riga" di questa
fascia. Componeva solo due funzioni già pure (`consumoSpecifico`,
`volumeForo`, già in `genesi-data.js`): nessun calcolo nuovo, solo
l'argomento esplicito. I cinque punti che la chiamavano nella pagina
passano ora `D2`.*
⏱️ *61→60, 18→19 e 69→68 il 14/09 (G47d, ULTIMA fetta di G47), e come per
G47a QUESTA VOLTA NON È UN CANTIERE VERO: `d2Snap` (una riga, legge solo
`D2` davvero) è finita nel bucket "sei-dieci" perché il commento italiano
appena scritto sopra di lei contiene le parole «dxf», «pts», «e», «a»,
«lo» — lo stesso margine accettato dello strumento già misurato su G47a.
`d2Down`/`drawDesign2D` hanno guadagnato "tratti" nel loro elenco per la
stessa ragione (il commento su G47d nomina "tratti" più volte). 155 non
cambia: nessuna funzione nuova, solo tre lette come se leggessero più
variabili di quante ne leggano davvero.*
⏱️ *60→61, 68→69 e 154→155 il 14/09 (G47b): una funzione nuova
(`syncStratiUI`, i livelli veri — mostra/nascondi/blocca per entità,
non i vecchi interruttori di un calcolo).*
⏱️ *59→60, 67→68 e 153→154 il 14/09 (G47c-2): una funzione nuova
(`syncTrattoUI`, la primitiva di disegno libero — tratti/polilinee senza
la semantica di prodotto di foro/fronte/piede), anche lei nel bucket
"una o due" (legge poco `D2`/`D2.tratti`).*
⏱️ *53→59, 61→67 e 147→153 il 14/09 (G47c-1): sei funzioni nuove
(`d2Snap`, `d2BtnSync`, `d2PushUndo`, `d2ApplySnap`, `d2Undo`, `d2Redo`),
l'annulla/ripristina per l'editor 2D che l'editor di modellazione 3D già
aveva (`mdlUndo`/`mdlRedo`) e l'editor 2D no. Tutte e sei nel bucket "una
o due": leggono poco stato del modulo (soprattutto `D2` e le due pile
`d2UndoStack`/`d2RedoStack`, dichiarate lì per lì), quindi si estraggono
senza rifare niente — il 86 (le funzioni che sono una vera decisione di
architettura) non si tocca.*
⏱️ *19→18 e 37→38 il 14/09 (G47a, prima fetta di "Genesi simile a un CAD" —
il fondatore ha risposto "tutto" alla domanda di chiarimento), e QUESTA VOLTA
NON È UN CANTIERE VERO: è il margine accettato dello strumento stesso
(intestazione di `genesi-estraibili.mjs`, "contenuto di stringa o commento
scambiato per una dipendenza da variabile del modulo"). Misurato confrontando
l'elenco `--elenco` prima/dopo in una worktree su HEAD: il commento italiano
aggiunto contiene 4 volte la parola «da» e il codice dichiara 5 volte `dy`
(il nome del nuovo campo "spalla") — due token corti che lo strumento tratta
come nomi di variabili del modulo ovunque compaiano nel testo, non solo dove
sono davvero letti. Sette funzioni lontanissime dal punto toccato
(`riconRender`, `_riconCampoHtml`, `sitoRender`, `applyDesign`,
`_riconForiHtml`, `sentRender`, `drawIsocrone2D`, `salvaVolata`,
`rockTextures`, `drawInnesco2D`, `flyrockInv`…) hanno guadagnato "da" o "dy"
nel proprio elenco di letture senza che una sola riga del loro corpo sia
cambiata — la riga numeri è la stessa, solo spostata più in basso nel file.
61 non si tocca: nessuna funzione ha cambiato bucket per una ragione vera.*
⏱️ *38→37 il 14/09 (G42), stesso giorno, ULTIMA fetta del gruppo:
`computeSeq2D` è diventata un legame di poche righe (`sequenzaSuMaglia` è
salita in `genesi-data.js`), settima volta sulla stessa famiglia di falso
positivo di G39/G40/G41. Il 60 sale a 61 per la stessa ragione.*
⏱️ *39→38 il 14/09 (G41), stesso giorno: `computeEnergia2D` è diventata un
legame di una riga (`energiaSuMaglia` è salita in `genesi-data.js`), sesta
volta sulla stessa famiglia di falso positivo di G39/G40. Il 59 sale a 60 per
la stessa ragione (bucket "più di dieci" → "una o due").*
⏱️ *20→19 il 14/09 (G40), stesso giorno: `computeRelief2D` è diventata un
legame di una riga (`reliefSuMaglia` è salita in `genesi-data.js`), stessa
famiglia esatta di G39 appena sopra. Il 59 sale di uno per la stessa ragione.*
⏱️ *21→20 il 14/09 (G39): `computeInnesco2D` è diventata un legame di una
riga (`innescoSuMaglia` è salita in `genesi-data.js`), e il legame stesso
legge una sola variabile del modulo — scivolato da "sei-dieci" a "una o
due". Il 58 sale di uno per la stessa ragione.*
⏱️ *22→21 e 38→39 il 14/09: `genMaglia2D` ha guadagnato una variabile del
modulo in più (la dichiarazione della maglia assente, G37/B0-septies) ed è
scivolata da "sei-dieci" a "più di dieci". Il 57 non cambia: le due colonne
che lo formano restano ferme.*

✅ **13/09 (G34): 147 → 148.** `_snapXY`, l'aggancio opzionale alla griglia nel
Progetto 2D (disegno di precisione — secondo pezzo di "tutte e tre le
alternative"), è nuova nella pagina e legge due variabili del modulo
(`D2.snap`, `D2.snapPasso`): cade nel bucket "una o due" e alza sia il totale
sia gli estraibili (55 → 56).

✅ **13/09 (G35), stesso giorno: `measureGeom2D` è salita in genesi-data.js
come `misuraGeom2D`.** Il totale nella pagina resta 148 (il wrapper c'è
ancora, una riga sola), ma la sua forma ridotta a `return
misuraGeom2D(D2.holes, D2.S, D2.B);` sposta il conteggio del censimento
statico dal bucket "3-5" (dove viveva per un falso positivo del
tokenizzatore sulle variabili locali `o`/`minx`) al bucket "una o due" (17→16,
48→49): il totale estraibile sale di uno (56→57), perché il wrapper stesso è
ormai un legame di una riga.

✅ **13/09 (G36), stesso giorno: `_puntiNuvola` è salita in genesi-data.js
con lo stesso nome, senza lasciare un wrapper.** Non leggeva `D2` per
niente: il censimento la marcava legata a nove variabili del modulo
(«lo, conta, c, locale, n, riga, a, si, su») per lo stesso falso positivo
già preso tre volte su questo file — lettere e parole dentro le sue
STRINGHE («nel ritaglio», «caricati», «disegnati su») e nei suoi commenti.
Effetto: il totale nella pagina scende **148 → 147** (nessun wrapper resta,
l'import la sostituisce), il bucket "6-10" scende **23 → 22**, gli
estraibili restano **57** (non erano mai stati contati lì: una funzione
tolta dalla pagina non è più "da estrarre", è già uscita).

⚠️ **13/09, stesso giorno: `d2Down` passa dal bucket "3-5" a "11+" per un
commento, non per il codice.** Aggiungendo la memoria dell'ultima selezione
(`D2.selPrev`, per la misura fra due fori qualunque — vedi G34quinquies in
`genesi.html`) è entrato anche un commento esplicativo di sei righe: il
tokenizzatore del censimento conta le parole sull'indentazione, non
distingue prosa da codice, e alcune parole del commento sono finite lette
come variabili del modulo. Non è un difetto della funzione (che legge
sempre `D2` e basta): 16→**15**, 37→**38**.

✅ **12/09 (unità 121, 122 e 124): 151 → 147.** `_sitoParseCsv`, `_sentCell`,
`esplCardHtml` e `innCardHtml` sono salite in `genesi-data.js`: il censimento
le marcava legate a variabili del modulo per due varianti dello stesso falso
positivo del suo tokenizzatore — lettere dentro le regex della funzione
(`_sitoParseCsv`, `_sentCell`) o dentro le sue STRINGHE (`esplCardHtml`,
`innCardHtml`: `'ritardi '`, `"es-nome"`) — lette a mano non leggevano nessuno
stato. I 55 estraibili non cambiano: erano già in quel conto, solo nel bucket
sbagliato.

⏱️ **Questi sette numeri erano tutt'e sette diversi fino al 09/08** — 46 · 64 ·
27 · 31 · 24, cioè «110 su 192» — e non perché qualcuno li avesse sbagliati:
erano veri il 01/08, e nel frattempo tre fette di Genesi sono uscite dalla
pagina. Erano scritti qui, e **identici** dentro il commento dello strumento
che li produce, sotto un avvertimento che diceva testualmente *«se un giorno
divergono, ha ragione l'uscita e torto il commento»*. Sono diversi da giorni.
Adesso li sorveglia `numeri-nei-documenti.mjs`, che lancia il censimento e
pretende che questa tabella sia la sua uscita: **dichiarare un punto cieco non
lo illumina**, sorvegliarlo sì. La domanda giusta non era
«quante sono», era «quante dipendono da uno stato condiviso»: una funzione che
legge una variabile del modulo non è una funzione pura scritta nel posto
sbagliato, è una funzione che va richiamata da capo in ogni punto che la usa (tirarne fuori
un modulo dati resta un cantiere intero), ma il numero non deve poter essere letto
per più di quello che è: dal 01/08 lo dichiara il censimento stesso, in fondo
alla sua uscita, e il conto lo **misura** invece di scriverlo a mano. Lo conta
`copertura-funzioni.mjs`, e questo numero lo verifica `numeri-nei-documenti.mjs`:
era già finito sbagliato due volte perché scritto a memoria.

```sh
node apps/deepwork-id/tests/run-kpi.mjs        # i calcoli delle sei app + i lettori CSV
node apps/deepwork-id/tests/run-stile.mjs      # le regole di stile vincolanti, rese verificabili
node apps/deepwork-id/tests/run-helpers.mjs    # numeri, unità, soldi, CSV condivisi
node apps/deepwork-id/tests/run-pointcloud.mjs # lettura nuvole di punti
node apps/deepwork-id/tests/run-manifest.mjs   # i manifest delle PWA
node apps/deepwork-id/tests/run-demo.mjs       # i dati della demo

# ⚠️ E POI, SEMPRE, con l'orologio del cliente. Questo contenitore è a
# Greenwich; le cave sono in Italia. Il 31/07 tre punti del prodotto
# sbagliavano il giorno OGNI GIORNO, e in UTC erano tutti verdi.
node apps/deepwork-id/tests/orologio-cliente.mjs   # le suite sensibili alla data, in TZ=Europe/Rome

# I numeri scritti QUI SOPRA e nei documenti del fondatore sono quelli veri?
# Il 31/07 tre conteggi erano invecchiati senza che nessuno se ne accorgesse:
# un numero in un documento non fallisce, sta lì.
node apps/deepwork-id/tests/numeri-nei-documenti.mjs

# Quante funzioni delle app sono davvero PROVATE? Per due giorni questo numero
# è stato contato a mano, e due volte è finito sbagliato in un documento.
# Stampa quante funzioni ha GUARDATO, e ha un FONDO per app: se scende, cade.
node apps/deepwork-id/tests/copertura-funzioni.mjs
node apps/deepwork-id/tests/copertura-funzioni.mjs --elenco   # dice anche QUALI mancano

# Lo stesso nome esportato da due app: è un alias o una copia? La regola del
# `shared/` era scritta in CLAUDE.md, cioè affidata alla memoria — e in un
# giorno solo ne sono uscite cinque violazioni. Qui o le due cose sono lo
# STESSO oggetto, o la differenza va DICHIARATA con la ragione.
# Guarda DUE coppie, e la seconda è arrivata dopo: app contro app, e app
# contro `shared/` — che è quella più facile da sbagliare, e per due giorni
# non la guardava nessuno. Stampa quanti confronti ha fatto.
node apps/deepwork-id/tests/nomi-doppi.mjs
```

**139 con l'emulatore Firestore** (**91** regole di sicurezza, 19 SDK, 21
funzioni, 8 primo avvio) — servono `firebase-tools` e Java.
✅ *Rimisurati il 05/09 in questo contenitore, in un solo* `emulators:exec
--only firestore,auth,functions` *(la CLI con* `npx --yes firebase-tools@13`*, le
dipendenze già installate): 81 + 19 + 8 + 21, tutti verdi, in circa un minuto.*
⏱️ **Qui c'era scritto 125, e i quattro addendi accanto ne fanno 123**: due
numeri che si contraddicono **nella stessa frase**, che è peggio di un numero
vecchio perché fanno dubitare di tutti gli altri. `STATO_PRODOTTO.md`, con gli
stessi quattro addendi, diceva **123** — cioè i due documenti del fondatore si
smentivano a vicenda. Trovato il 09/08 con un censimento dei numeri dichiarati
che nessuna regola sorveglia; adesso lo sorveglia `numeri-nei-documenti.mjs`,
in **tutt'e due** i documenti e **addendo per addendo**.
⚠️ E la distinzione che quel controllo ha reso chiara: le **21** sulle funzioni
si possono **contare** come le altre tre — sono `test(` scritti in
`run-fns.mjs`, e contarli non chiede nessun emulatore. Quello che non si può
verificare è che **passino**. «Non misurabile» riguardava il verde, non il
numero: tenerle fuori dal conto le lasciava invecchiare da sole. Il vecchio **106** portava un **58** sulle
regole di sicurezza che era fermo da tempo:

```sh
cd apps/deepwork-id && firebase emulators:exec --project demo-deepwork "cd tests && npm test"
```

⚠️ **Nel contenitore di sviluppo quel comando non parte**, e la ragione non è un
difetto nostro: `firebase` non è sul PATH e le `node_modules` non ci sono. Il
giro che gira davvero è uno solo:

```sh
node apps/deepwork-id/tests/giro-sicurezza.mjs   # 139 prove: 91 regole, 19 SDK, 8 primo avvio, 21 funzioni
```

Un comando solo, che alza l'emulatore da sé, ripiega su `npx firebase-tools@13`
quando `firebase` non c'è, e **dichiara in fondo quello che non ha potuto
guardare** — oggi **niente**. Se gli attrezzi o le dipendenze mancano si ferma
dicendo quale `npm ci` lanciare (uscita 2) invece di stampare «0 caduti», che
sarebbe il verde più falso che ci sia.

⛔ **Fino al 13/08 questa riga diceva 102, e le 21 prove sulle funzioni erano
dichiarate «verificabili solo in CI» perché «l'emulatore delle funzioni chiede
la rete e la politica del contenitore la nega».** Era falso. L'emulatore parte;
le 21 cadevano con `functions/not-found` perché
`apps/deepwork-id/functions/node_modules` era **vuota**. Un `npm ci` lì dentro e
fanno **21 passati, 0 falliti**. Per cinque giorni le difese che contano di più
— un'email non verificata non riscatta inviti, un utente anonimo non crea
un'organizzazione — sono state fuori dalla verifica di casa **per una cartella
vuota**, e nessuno ha riletto quel messaggio d'errore perché **la spiegazione
c'era già**. Il segno da riconoscere non è l'errore: è la **rinuncia scritta
accanto**.

**291 esecuzioni che aprono davvero le pagine** in Chromium — banchi distinti,
ognuno seguito dalla sua **controprova** (Chromium è già installato in
`/opt/pw-browsers/chromium`, **non** si lancia `playwright install`):

```sh
node apps/deepwork-id/tests/browser/tutti.mjs
```

### La regola che vale più del numero di prove

**Una prova che non sa fallire non dimostra niente** — e, dal 01/08, anche:
**una controprova va misurata nella sua COPERTURA, non solo nel suo esito.**

Il caso che l'ha insegnato: la regola che vieta i dialoghi del browser aveva la
sua controprova, e passava. Ma iniettava il difetto in **tre superfici a un
punto ciascuna**. Rimettendolo in tutti i punti dove la scansione era in
difficoltà, **764 iniezioni su 1030 non venivano viste**: la regola era cieca su
gran parte del codice, core compreso, mentre rispondeva «a posto».

Quindi, quando si scrive un controllo nuovo:

1. si rimette il difetto **nei file veri**, non su tre righe inventate — su tre
   righe inventate funzionava benissimo anche quella cieca;
2. lo si rimette **dove il codice è difficile** (dentro i template, dopo le
   stringhe), non in fondo al file, che è il posto più facile;
3. si **stampa quanti soggetti si sono guardati davvero** (`9 superfici`,
   `1030 iniezioni`, `84 tendine misurate`). Un numero che non torna si vede;
   uno «zero violazioni» ottenuto su zero soggetti no;
4. se il controllo ha un elenco di soggetti attesi, lo si **asserisce**: è così
   che è saltata fuori una settima superficie di cui non sapevamo.

Gli aiuti per farlo esistono già in `run-stile.mjs`: `controprovaSuiVeri(...)`
per i difetti che si **aggiungono**, e il blocco della regola 12 come esempio
per quelli che si **tolgono** (lì il difetto è l'assenza di una difesa).

Il dettaglio di ogni banco sta in `apps/deepwork-id/tests/browser/LEGGIMI.md`.

### Due cose da sapere prima di aggiungere una prova

1. **Va inserita PRIMA del blocco di riepilogo finale**, che chiude con
   `process.exit`: appesa in coda non viene mai eseguita, e il totale resta
   fermo senza che niente lo segnali.
2. **Si controlla che il totale sia SALITO**, non solo che i falliti siano
   zero: un file di prova inerte dice «0 falliti» esattamente come uno che
   funziona.

E ogni controllo nuovo va **provato contro il difetto**: si rimette il difetto
e si pretende che il controllo fallisca. Le ragioni, con i casi veri in cui è
servito, stanno in `CLAUDE.md`.

## Credenziali di prova

**Non sono elencate qui.** Nel core esistono utenti storici con password in
chiaro nel sorgente: è un problema noto e tracciato in
`docs/AUDIT_SICUREZZA.md`, con la mitigazione già scritta e **non attivata** in
`docs/MITIGAZIONE_PASSWORD.md` (aspetta una decisione del fondatore). Copiarle
in un secondo documento aumenta la superficie senza aggiungere niente: chi
sviluppa le trova nel core, chi legge questo file deve sapere che **esistono e
vanno sistemate**, non quali sono.

## Le regole che non sono opinioni

Stanno in `CLAUDE.md` e valgono per chiunque tocchi il codice: lo **stile**
identico al core con la palette propria di ogni app, l'**isolamento
multi-tenant** che passa sempre dall'SDK, e la regola che una **logica usata da
due app vive in `shared/`** e si chiama, non si ricopia. `run-stile.mjs` ne
rende **diciannove** verificabili in automatico.
