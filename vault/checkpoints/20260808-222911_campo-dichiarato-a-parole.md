# Checkpoint — Campo: una riga dichiarata a parole, non con un numero

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
Il confronto **frase↔file** agganciato al banco di Campo, e — come dichiarato nel
checkpoint precedente — **non con un ciclo in coda**: quel banco rilegge il file
dentro scenari suoi, ognuno con la propria FIXTURE, quindi un ciclo finale
avrebbe misurato il file di uno scenario contro la frase di un altro. Il
confronto sta dove ciascuno scenario legge.

**Esito: le due frasi di Campo tornano. Nessun difetto.**

## Il caso nuovo che ha insegnato qualcosa: «dichiarato a parole»
Lo scenario dei fermi muti esportava **8** righe di dato mentre la frase diceva
«Esportate **7** giornate… in coda c'è **la riga** senza giorno con 15
rapportini».
La frase è **onesta**: dice che quella riga c'è, e dice perfino quanti
rapportini porta. Semplicemente **non la conta**: la dichiara a parole.
È un terzo modo, diverso dai due già visti:
- i **preventivi** di Conti dicevano un numero e il file ne aveva un altro →
  difetto, corretto aggiungendo il secondo numero;
- i **lavoratori scoperti** di Scudo il file li scriveva e la frase li taceva →
  difetto, corretto nominandoli;
- qui la frase li **nomina senza numerarli** → **non è un difetto**.
La regola condivisa non è stata allargata per farlo passare: allargarla avrebbe
fatto passare anche il caso in cui una riga **sparisce davvero**. Il caso si
dichiara **al punto di chiamata** (`inPiu = 1`), con la ragione scritta lì.

## ⚠️ E un difetto dello strumento, piccolo e costoso
Il primo KO ha stampato **`[object Object]`**: il `dice` di questo banco fa
`String(x)` sull'extra, quindi un oggetto diventa illeggibile e la prova **non
si può giudicare**. Ho dovuto rifare la misura a mano per sapere che cosa
accusava. Adesso il confronto gli passa già una frase.
La regola generale: **un banco che non sa dire PERCHÉ è caduto costringe chi
legge a rifare la misura** — e chi la rifà, spesso, la rifà peggio.

## Verifiche
- Campo: **53 verifiche passate, 0 fallite**; controprova **25 cadute su 53 coi
  14 difetti rimessi** — distingue ancora
- `node giro-node.mjs` → **32 comandi a posto, 0 caduti**, rifatto su una copia
  di ciò che si committa (identità della patch verificata)

## Stato della domanda «chi decide i numeri di ciò che ESCE?»
- **CSV/file**: 51 su 51, otto difetti corretti
- **PDF/stampe**: censite, col limite del core misurato e scritto
- **frasi di riepilogo**: **25 confrontate** (Flotta 8, Conti 12, Scudo 3,
  Campo 2), **due difetti** trovati e corretti, **un terzo modo** censito e
  dichiarato non-difetto

## Prossimo passo atomico
Restano **Genesi** e il **core**. Nessuno dei due ha un `scarica` comune:
- per **Genesi**, `genesi-documenti-che-escono.mjs` scarica a modo suo — va
  letto il flusso come è stato fatto per Campo;
- per il **core**, attenzione al limite già misurato: i suoi PDF nascono da
  `jsPDF` **da CDN** e offline non esistono, quindi lì il confronto vale solo
  per i CSV.
E resta il **giro del browser** (pid 21084, quasi quattro ore): quando finisce,
`leggi-giro.mjs` dalla **sezione 0** — attesta un commit ormai di venticinque
indietro.

## Blocchi
Nessuno.
