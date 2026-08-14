# Checkpoint — 2026-08-09T10:15:00Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`a883ac3`

## Task completato

**La terza fetta di B3 non è stato altro codice spostato: è il RIGHELLO.**
Aperti a mano tutti i candidati rimasti nella colonna «si portano fuori come
sono», **quasi nessuno era un trasloco**.

| | prima | dopo |
|---|---|---|
| «si portano fuori come sono» | 23 | **6** |
| estraibili in totale | 81 | **62** |
| davvero pure fra le 6, verificate a mano | — | **1** (`_sentOggi`, e non serve) |

## Le tre cose imparate

1. ⛔ **QUANDO LA LISTA È SBAGLIATA, SI CORREGGE LA LISTA — non si continua a
   lavorarci sopra.** La tentazione era la terza estrazione: c'erano venti nomi
   in colonna. Aprendoli: otto leggono `localStorage`, due creano una
   `<canvas>`, due maneggiano THREE, una ferma nodi Web Audio, una riceve un
   elemento del DOM. Estrarre da quella lista voleva dire **lavorare dove non
   si può**; correggerla vale per tutte le volte dopo. È lo stesso conto della
   regola di casa: mezz'ora che restituisce ore.
2. ⛔ **UNA DOMANDA NUOVA VA PROPAGATA, se no risponde di no a metà dei
   colpevoli.** La prima stesura della seconda domanda guardava solo il **corpo**
   della funzione: `sitoLegge` risultava pura perché è `sitoStore()` che legge
   `localStorage`, e `gvv` perché è `gLeggi` che tocca il campo. Il tocco
   all'ambiente **si eredita per chiamata**, e si chiude a punto fisso in poche
   righe. Effetto: 8 → 6, cioè due falsi che sarebbero costati due aperture.
3. ⛔ **E IL RIGHELLO DICHIARA QUELLO CHE ANCORA NON VEDE, invece di stringere
   a metà.** Delle 6 rimaste, cinque non sono pure e il controllo non può
   saperlo: uno stato in un `let` che l'euristica delle globali salta
   (`cancelAudio`), un oggetto THREE **ricevuto come argomento** (`worldJitter`,
   `jitterGeo`, `mdlSet`), una funzione di libreria. Distinguerle vuol dire
   sapere i **tipi**, e un righello «un po' meno sbagliato» è peggio di uno che
   dichiara il suo dubbio — è la regola pagata su `contrasto.mjs`. Quindi
   l'uscita stampa, ogni volta, che delle 6 solo `_sentOggi` è pura e che **la
   colonna è esaurita**.

## Il numero onesto di B3, adesso
Il cantiere che resta **non è un trasloco**: sono le **56** funzioni che
leggono una o due variabili del modulo, e portarle fuori vuol dire **cambiare
la firma** — cioè toccare tutti i punti che le chiamano. Va chiamato col suo
nome invece di finire in una stima ottimistica, che è quello che la riga di
roadmap diceva già e che il numero adesso conferma.

## Verifiche
- `genesi-estraibili` **163 funzioni · 6 «come sono» · 62 estraibili**
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- `iniezioni-fresche` **296/296**

## Il giro del browser
Vivo dalle 07:55Z su una copia di `494863f`; a 10:15 il registro cresce ancora.
⚠️ Nel frattempo il branch è andato avanti parecchio, con **tre commit che
toccano `genesi.html`**: la **sezione 0** lo dirà, e va letta prima dei KO.

## Prossimo passo atomico
⛔ **Quando il giro finisce ha la precedenza**: `leggi-giro.mjs`, nell'ordine
**età → righe «non ho guardato» → KO veri**, e nessun KO diventa cantiere prima
di essere riprodotto **con la sua passata** e **con l'iniezione viva** — oggi
sei KO su venti del giro precedente erano del banco, non del prodotto.
Se il giro non è ancora finito: unità su `docs/`, `vault/` e suite `node`. La
prima della fila è **B4** (le mancanze confermate del delta, in ordine di
quanto le chiede un ispettore), che è lettura e scrittura di documenti.
⚠️ **Non** iniziare la fetta delle 56 di B3 a contesto quasi esaurito: è un
cambio di firma su un file da 5.000 righe, e va aperto con spazio davanti.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2) e **`#vf-ente`** (termine dell'art. 71 c.11).
