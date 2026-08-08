# Checkpoint — Conti, il residuo che ignorava le note di credito

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
**Due difetti veri in Conti, tutt'e due sulla stessa domanda: chi decide il
residuo di una fattura?**

### 1 · `conti_incassi.csv` — il file che va in banca
È il file che il commercialista incrocia con l'estratto conto. Il residuo lo
calcolava come `importiFattura(f).totale - incassato`: quel totale è il **lordo**
della fattura, e `importiFattura` le note di credito non le guarda. Lo schermo
passa invece da `statoFattura(f, INC, NOT)`, che toglie lo stornato e ricava
l'**esigibile** — tanto che il foglio stampato lo dice a parole: «Da incassare …
(dopo la nota di credito)».
Misurato su una fattura da 1.000 € con una nota da 200 € e un acconto da 500 €:
il foglio stampato diceva **300**, il file scriveva **500**.
⚠️ Ed è lo stesso difetto che il CSV della **situazione fatture**, quaranta
righe più su nello stesso file, aveva **già corretto**, col commento che lo
racconta. Terza volta in un giorno che una correzione risulta fatta a un export
e non all'altro (dopo le due di Flotta).
⚠️ La colonna `totale_fattura` **non cambia significato**: resta il lordo, che è
quello che il commercialista si aspetta accanto al numero di fattura. Quello che
mancava si **aggiunge** — `note_di_credito` — così la differenza si vede invece
di comparire dentro un numero che si chiama in un altro modo.

### 2 · e la RIGA della lista, che è peggio perché si legge tutti i giorni
La riga leggeva `f.residuo` **dal record**, e una nota di credito quel campo non
lo riscrive: è salvato quando si registra un incasso, e le note vivono in
un'altra collezione. Sullo stesso caso la riga diceva «residuo 500», il foglio
stampato «300», e il totale in fondo alla **stessa lista** era già note-aware
(`apertoDi(f, NOT)`). La schermata si smentiva da sola in tre punti, e quello
sbagliato era proprio quello che si guarda ogni giorno.

## La cosa imparata, ed è la più forte della giornata
⛔ **DUE COPIE DEBOLI CHE SBAGLIANO NELLO STESSO MODO SI DANNO RAGIONE A
VICENDA, e una prova che le confronta fra loro resta VERDE.** Il banco
confrontava il residuo del file con quello della riga. Con tutt'e due i difetti
rimessi diventano **500 tutt'e due** — sbagliati insieme, quindi d'accordo — e
quell'asserzione **non cadeva**. È la regola di casa sull'andata e ritorno che
resta verde quando le due metà sbagliano insieme, in una veste nuova: non
scrittore/lettore, ma **due lettori dello stesso dato**.
La cura è un **terzo testimone che non sia nessuno dei due**: qui il riquadro in
fondo alla lista, che dichiara la nota di credito, è note-aware da prima di oggi
e nessuna delle due iniezioni lo tocca. Con lui la controprova cade.
⚠️ E il terzo testimone l'ho scelto male la prima volta: guardavo il **totale in
cifre** di quel riquadro, che col filtro «tutte» è il **fatturato lordo** e non
il residuo (la vista passa ad `apertoDi` solo sui filtri del credito). Il pezzo
note-aware è la riga che dichiara la nota, non il totale.

## Altre due, minori ma pagate
⚠️ **Un commento dentro un template literal**: la spiegazione che avevo scritto
dentro `CASI` conteneva backtick, che hanno chiuso la stringa a metà e la pagina
non partiva più. È la regola di `CLAUDE.md` sui commenti dentro una stringa,
rifatta un'ora dopo averla riletta. Il commento va **fuori**.
⚠️ **Il campo della nota si chiama `totale`, non `importo`** (`stornatoDi` somma
`Math.abs(+n.totale || 0)`). Col nome sbagliato la nota entrava nell'archivio e
valeva zero: è «l'iniezione che non inietta», e l'ha presa la sola prova che
guardava il **dato** invece del confronto — se il banco avesse avuto solo
l'asserzione sul residuo, avrebbe detto verde su un caso che non esisteva.

## Verifiche
- banco nuovo `browser/conti-documenti-che-escono.mjs`: **14 passati, 0 falliti**;
  in controprova **2 KO voluti** coi 2 difetti rimessi davvero
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)
- documenti in pari: banchi del browser **157**, giro completo **2.663**, addendi
  che sommano (297; 2.366 + 297 = 2.663)

## Stato roadmap
Domanda *«chi decide i numeri di ciò che ESCE?»*:
Campo 6/6, Sentinella 5/5, Terra 3/3 puliti · core 2/2 (un difetto, corretto) ·
**Flotta 9/9** (quattro difetti, corretti) · **Conti 1/12** (due difetti,
corretti) · Scudo 5 e Genesi 9 in analisi.

## Prossimo passo atomico
**Conti, gli altri cinque export che compongono il CSV dentro la pagina**:
clienti (5661), costi (5870), listino prezzi (5894), pesate/DDT (6026),
preventivi (6799). Il censimento strutturale è già fatto — sei su dodici
delegano al modulo, sei compongono in pagina — e il difetto sta sempre fra
questi ultimi. Si aggiungono al banco appena scritto.
⚠️ Portarsi dietro la lezione del terzo testimone: nel confronto file↔schermo
serve **una terza superficie** che le due iniezioni non tocchino, se no due
copie deboli si danno ragione a vicenda.

## Blocchi
Nessuno.

## Note
Il giro del browser (pid 21084) è ancora vivo sulla sua copia; da leggere con
`leggi-giro.mjs` partendo dalla sezione 0 (l'età) e dalle righe «non ho
guardato».
