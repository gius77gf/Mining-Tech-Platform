# Checkpoint — Campo: un export che nessun banco apre, e perché

## Tipo
unit-complete (misura + limite dichiarato)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Task completato
Portando il confronto **frase↔file** verso Campo, la prima domanda era quale
banco preme i suoi bottoni d'esportazione. Misurato su **tutti** i banchi, non
solo su quelli che nominano `apps/campo`:

| bottone | banchi che lo premono |
|---|---|
| `btn-consegna` | 2 |
| `btn-att-export` · `btn-pre-export` · `btn-set-export` · `btn-squ-export` | 1 ciascuno |
| **`btn-piano-export`** | **0** |

⚠️ **E lo zero non è negligenza: è una superficie CONDIZIONATA.** Quel bottone
nasce `style="display:none"` e compare solo quando `PIANO.length` — cioè solo
dopo che un **piano di carico è arrivato da Genesi** attraverso il ponte. Un
banco che apre Campo e basta non lo vede, e non perché non guardi: perché non
c'è.
Che cosa lo difende nel frattempo: l'export delega a **`pianoConsuntivoCsv(PIANO)`**,
una funzione del modulo — quindi la domanda «chi decide i suoi numeri?» ha già
la risposta giusta, e le prove `node` la possono chiamare senza browser.
Quello che manca è la misura sul file vero, e per averla un banco deve prima
**iniettare un PIANO** nello stato: è lavoro vero, non tre righe.

## Perché questa riga esiste
Un «0 banchi» letto senza la ragione accanto si legge come una lacuna e manda
qualcuno a scrivere un banco che non serviva, oppure — peggio — si legge come
«coperto» perché nessuno ha guardato il conto. È la regola delle righe «non ho
guardato», che in questa casa si leggono **prima** dei KO: qui il conto è
dichiarato e la ragione anche.

## Stato della domanda «chi decide i numeri di ciò che ESCE?»
- **CSV/file**: 51 su 51 resi conto, **otto difetti** corretti
- **PDF/stampe**: censite; il limite del core (`jsPDF` da CDN) misurato e scritto
- **frasi di riepilogo**: **23 confrontate** (Flotta 8, Conti 12, Scudo 3),
  **due difetti** trovati e corretti — i preventivi che dicevano 8 su 9 righe, e
  i lavoratori senza scadenze che il file dichiarava e la frase taceva

## Prossimo passo atomico
**Agganciare il confronto frase↔file al banco di Campo**
(`campo-numeri-tranquilli.mjs`, che preme già cinque bottoni su sei).
⚠️ Non è l'aggancio di tre righe che è bastato per Scudo: quel banco cattura il
file in `window.__csv` e lo rilegge in **tre punti diversi**, dentro scenari suoi
— quindi il confronto va inserito dove ciascuno scenario legge, non in un ciclo
in coda, se no si misura il file di un altro scenario. Va letto il flusso prima
di toccarlo.
Poi **Genesi** e il **core**, che scaricano ognuno a modo suo.
E resta il **giro del browser** (pid 21084, oltre tre ore e mezza): quando
finisce, `leggi-giro.mjs` dalla sezione 0 — attesta un commit ormai di
ventiquattro indietro.

## Blocchi
Nessuno.
