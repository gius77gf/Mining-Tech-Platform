# Checkpoint — 2026-08-06 17:07:45 UTC

## Tipo
unit-complete (dodici commit: il canarino, sei unità mie, i tre cantieri
raccolti, il trasloco in `shared/`)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8042b15` — *La regola dei CSV di dimostrazione sale in shared/, e il segno era
la prova che doveva leggere il sorgente*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| — | **canarino** (`a3ddf6c`) | la copia locale era **102 commit indietro** |
| 58 | **le classi che non si dipingono** (`d2f86db`) | `.av-su` **2,65:1**, `.av-mz` **3,35:1** |
| 59 | **il censimento su 14 superfici** (`80d3a37`) | 4.443 testi, **0** sotto soglia |
| 60 | **i numeri di B3 ricontati** (`ce1076b`) | 171 e **87**, non 174 e «circa 90» |
| 61 | **la ricerca smentita** (`18b86f8`) | citazione inventata **coi numeri di riga giusti** |
| 62 | **il punto della sonda dichiarato** (`cbd6f8c`) | 7 statici su 7 |
| 63 | **Campo · la dimostrazione dichiarata** (`5d3730d`) | grep **0 → 4**, più un secondo difetto |
| 64 | **Scudo · idem** (`41a5a21`) | grep **0 → 3**, sul verbale ex art. 77 |
| 65 | **i CSV** (`a700392`) | **25 export su 4 app**, e 2 forme escluse dai numeri |
| 66 | **il banco che confessa** (`a7b6053`) | 30 candidati, 6800 provati, 0 modali |
| 67 | **`marchiaCsv` in `shared/`** (`8042b15`) | 4 copie, **una sola impronta md5** |

## ⛔ Il filo del blocco, ed è uno: *dove il documento esce, e chi glielo dice*
La domanda «un documento prodotto in dimostrazione dice di esserlo?» ha chiuso
oggi su **tutte e sei le app più il core**, sui fogli stampati e sui CSV. I due
casi più pesanti: il **verbale di consegna DPI** di Scudo — nome, date, righe
per le firme, la citazione dell'art. 77 D.Lgs 81/2008 — usciva dalla stampante
indistinguibile da uno vero; e il **rapporto di fine turno** di Campo, che
passa di mano fra due turni anche in versione `.txt`.

## ⛔ Le quattro cose che valgono oltre le unità

1. **IL CONTENITORE MENTIVA.** La copia locale era ferma al `45617e9` del 2
   agosto, **102 commit** dietro il remoto, con sopra dieci file lasciati dai
   cantieri uccisi dal limite settimanale. La prova che decide, da rifare ogni
   volta che si trova un albero così: confrontare ogni file del disco con la
   **sua versione remota**, non col committato locale. Tutti e dieci più
   poveri, e le righe «solo disco» riconoscibilmente vecchie — fra cui la prova
   che `1857d83` aveva corretto **perché blindava un difetto**.
2. **LA RICERCA HA INVENTATO UNA CITAZIONE DI CODICE**, dentro un riquadro, con
   i **numeri di riga giusti** e il `grep` vero accanto. Non un fatto
   inventato: una citazione inventata **dentro una prova che sembra
   verificata**. È una forma nuova, più difficile da vedere di quella già
   scritta in CLAUDE.md. La difesa costa dieci secondi: aprire il file alla
   riga citata.
3. **DUE RIGHE DI ROADMAP ERANO SCADUTE.** Quella delle cinque violazioni AA
   (tre già chiuse da `71875c1`) e quella della cecità sulle modali, che diceva
   «misura in corso» mentre la misura era arrivata e diceva **di no**. Più i
   numeri di B3, vecchi di tre unità. La roadmap ha lo stesso difetto che
   `documenti-invecchiati.mjs` misura sui documenti del delta, **e su di lei
   non lo misura nessuno**.
   ⚠️ Ho provato a meccanizzarlo e il disegno ovvio era **sbagliato**: la
   roadmap la si tocca tre volte al giorno, quindi «quanto è vecchia»
   risponderebbe sempre «fresca» contenendo righe scadute — un numero
   tranquillo dove non è misurato niente. Scartato prima di scriverlo.
4. **IL TRASLOCO IN `shared/` HA RESO CIECA LA CONTROPROVA**, ed è il rischio
   vero di ogni trasloco: il banco iniettava il difetto cercando la definizione
   nelle pagine, e dopo lo spostamento rispondeva «4 iniezioni MANCATE». È la
   quarta delle cinque cause. Seguendo l'iniezione ci si guadagna: adesso
   spegne la decisione in `shared/` e toglie le chiamate nelle pagine, cioè
   prova che i due strati sono separabili.

## ⚠️ La misura che ha ribaltato un ragionamento
Sui CSV la scelta sembrava fra quattro forme. Scritte tutte e quattro e rilette
**con i nostri lettori sui 23 file veri** usciti dai bottoni: la riga di
commento in cima e la riga in coda vengono lette **come un DATO** da 6 lettori
su 9 — un ricambio in più, un mezzo in più, un ricettore in più. La frase
scritta per dire «questi numeri non sono veri» diventava **essa stessa un
numero falso**. Restano il nome del file (montato) e la colonna in più
(proposta, col costo misurato: 25 intestazioni e ~40 modelli di riga).

## Stato delle prove
**2.131** prove senza rete (run-kpi **1730**), copertura **650/650** +
condivise (dw-shell **40/40**), banchi del browser **92**. Giro `node` 21
comandi, 0 caduti sulla copia di ciò che si committa, a ogni commit.

## ⚠️ La CI è rossa e NON è il codice
Cinque commit di fila, due dei quali toccano solo markdown. GitHub Actions non
riesce a scaricare le action: `Failed to resolve action download info: Service
Unavailable`, tre tentativi per job, poi un timeout. Verificato sui log di
quattro job diversi. Non c'è niente da correggere: si rilancia da sé.

## Prossimo passo atomico
1. **`avvisoEsempio` è la TERZA copia** (Conti, Terra, Scudo) e Campo ne ha una
   quarta variante per il testo. Stesso trattamento di `marchiaCsv`: in
   `shared/` la **decisione** (che cosa è dimostrazione, che cosa comporta per
   quel tipo di foglio), nelle pagine l'impianto. ⚠️ Prima di traslocare,
   **guardare dove i banchi iniettano il difetto**: `stampe-fs.mjs`,
   `scudo-documenti.mjs` e `campo-foglio-turno.mjs` mirano tutti alla pagina, e
   il trasloco li acceca come ha fatto oggi con i CSV.
2. La **colonna in più nei CSV**, se si decide di aprirla: è un lavoro diverso,
   non un rifinire — 25 intestazioni e ~40 modelli, e attenzione ai sei file di
   Flotta che uniscono con `\r\n` (uno `split("\n")` raddoppiava le righe **in
   silenzio**).
3. `marchiaCsv` **non** è in Campo, di proposito: metterlo lì creerebbe una
   seconda decisione «sono in demo» nella stessa pagina. Adesso che la regola è
   in `shared/` il problema non c'è più: Campo può importarla.
4. Poi: le tre proposte della ricerca su Scudo, **rimisurate una per una**.

## Code aperte, dichiarate
Le **19 decisioni** procedono **domani, venerdì 07/08**, se non arriva
risposta, dichiarandolo nel commit; restano ferme le 6 che richiedono il
fondatore. La riga **DUVRI** aspetta lui col suo RSPP. Il core resta con la
dimostrazione quasi vuota: 30 comandi cliccabili e 68 modali nel programma del
banco — o si popola, o quel banco non guarderà mai il core.

## Blocchi
Nessuno.
