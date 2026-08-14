# Checkpoint — 2026-08-14 10:05 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit di questo tratto
- `79a4ea1e` — il censimento vedeva il 73% della famiglia
- `7c413334` — le sottrazioni fra due insiemi: 28 guardate, 4 rotte
- `8c50640f` — direttiva 7: arretrato da 24 commit a **ZERO**
- `1bc18042` — Genesi: il giro di andata e ritorno perdeva l'onestà del file
- `4d106dea` — B6: ventisei contatori dicevano «0» prima che i dati arrivassero

## Che cosa è stato completato

**B6 — chiusa, e il candidato era un difetto.** **19 schermate su 19**
fotografate dentro la finestra fra l'apertura della pagina e l'arrivo dei dati,
**42 numeri misurati**: **26 contatori dicevano «0»** dove non era stato misurato
niente. Dopo: **0 numeri tranquilli su 42**, e il verso opposto misurato apposta
— dopo l'arrivo dei dati **nessun contatore resta «—»** (54 guardati).
⛔ E il censimento per parola che aveva aperto la voce era **un falso positivo
per intero**: l'`1` di Campo è un commento sulla foto, i `2` di Terra sono la
data di caricamento *nel visore*. La forma giusta era **nella stessa pagina, due
righe più su** — il «—» dei KPI.

**Le sottrazioni fra due insiemi — 28 guardate, 4 rotte.** Flotta dichiarava
**33,3% di disponibilità dove il vero è 66,7%** (due fermi contati due volte:
adesso `giorniDistinti` fa l'**unione**, riverificato — 30 e non 60); Conti
diceva «saldata» con **3.000 € da rimborsare in nessun campo**; l'ordine di
lavoro faceva **sparire tre pezzi** dall'inventario. Undici invarianti reggono
**per costruzione**, tredici sono ipotesi che non fanno danno.

**Genesi — il giro di andata e ritorno perdeva l'onestà del file.** L'export
scriveva `null`, l'import faceva `parseFloat(x.kg)||50`: **MIC 600 kg dove il
vero è `null`** — e la MIC è il numero da cui dipende il PPV. La forma peggiore
era la **media mista**: 6 fori dichiarati e 6 no davano **40 kg**, un numero che
non appartiene a nessun foro.

**Direttiva 7 — arretrato da 24 commit a ZERO.** 106 righe di verdetto
riguardate, **0 verdetti cambiati**, 12 prove rifatte. E il risultato che vale
più delle dodici: **i due documenti che portavano ancora i numeri di riga sono
esattamente i due con cinque prove marcite ciascuno** — su 39 citazioni
campionate ne reggevano **4**. Tolte 114: il contatore passa da **63 a 19**.

## ⛔ Tre volte i miei righelli hanno sbagliato, e a prenderli è stata la misura
Le sottrazioni contate **6 invece di 38**; il censimento che vedeva il **73%**
della famiglia e stampava quel numero come totale; e la stessa forma che conta
`String(`, `Math.`, `Number.` come costanti (**14 dei 56** su quattro app).
Tutte e tre le volte il numero sbagliato era **già stato stampato**.

## Le misure
`run-kpi` **2303**, prove **2.759**, copertura app **755/755**, giro `node`
**35 comandi a posto, 0 caduti**, **3.131** asserzioni, banchi **200**, **CI
verde**. Arretrato direttiva 7: **0/0**.

## Prossimo passo atomico
Aprire tre cantieri nuovi sui perimetri liberi (tutti liberi adesso) e lanciare
un **giro mirato** `--solo=campo-,scudo-,sentinella-,genesi-` sulle superfici
appena cambiate: sono quattro app toccate in cinque commit e il giro finito costa
mezz'ora. Il candidato più forte che resta è **i comandi morti dentro la finestra
di caricamento** — premuto «Aggiungi» non succede niente, nessun toast, nessun
errore: è la famiglia di `chiediDati`, e vuole una decisione su *che cosa* deve
dire la pagina.

## Blocchi
- **Force-with-lease sul ramo**: fermo al fondatore.
- **B0-septies**, le **soglie di sicurezza** e **`dRecFreq` intero all'ingresso**:
  fermi al fondatore.
