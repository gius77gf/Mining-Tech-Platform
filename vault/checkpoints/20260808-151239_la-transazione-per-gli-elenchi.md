# Checkpoint — 2026-08-08 15:12 UTC

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`81f6e76` — fix(sentinella): due import di letture sullo stesso punto non ne perdono più uno

## Che cosa è stato completato
Terzo passo della 5b, e tocca il dato più delicato: le **letture di un punto di
monitoraggio** finiscono nel **report per l'ARPA**.

Per gli **elenchi** il percorso puntato non arriva (un indice di array non si
scrive così) e `arrayUnion` non copre né la **correzione** di una lettura già
dentro, né il **taglio** a `MAX_LETTURE`, né un **import in blocco** —
misurato punto per punto, non dedotto. Serve rileggere e riscrivere senza che
nessuno si infili in mezzo: una **transazione**.

`trasformaAtomico` e `trasformaInMemoria` in `shared/dw-ponti.js`, con le
primitive passate come **argomenti** (il modulo è puro e gira anche in `node`).
Le due strade hanno lo **stesso contratto** — stessa firma, «niente da fare non
scrive», stessa frase se la riga non c'è più: se divergono, la dimostrazione
smette di dimostrare.

Convertiti **due** dei sette punti a elenco, i due di `letture`: la misura a
mano (che tiene il taglio, cioè la ragione per cui `arrayUnion` non bastava) e
l'import in blocco, che ora si unisce alle letture **vere del momento** con la
stessa `unisciLetture` che decide l'anteprima.

## Verifiche
- ⛔ **contro l'emulatore, nei due versi** (caso 7 della misura): con la
  transazione le tre letture ci sono **tutte**; con le stesse due scritture
  lette prima, come faceva la pagina, resta **`[1,3]` — una si perde**;
- **guardia collegata**: si passa dal db vero dell'app in modo dimostrazione
  (`sentinellaData()`, mode `demo`) e si pretende che `trasforma` ci sia e
  faccia quello che dice. Controprovata: facendo scrivere la transazione anche
  quando non c'è niente da fare, **cade**;
- `run-kpi` **1905 → 1908**; giro `node` **27/27** sul disco e sulla copia
  (patch identica); pagina di Sentinella aperta davvero (**32 ok / 0 KO**).

## ⚠️ Un mio errore, corretto per strada
Avevo scritto `uniscoLetture`, che **non esiste** — la funzione vera è
`unisciLetture`, e prende le letture con la loro **provenienza**. L'ho corretto
rileggendo, prima di lanciare qualunque prova.
⚠️ E la prima stesura di questo checkpoint diceva, senza averlo misurato, che
l'aveva presa «la lettura umana, non una prova». **Rimisurato rimettendo il
nome inventato**: `nomi-liberi` lo prende — *23 passati, 1 fallito*, «nessun
nome chiamato che non esiste da nessuna parte». Cioè la rete c'era; io sono
arrivato prima. Scrivere il contrario avrebbe fatto credere a un buco che non
c'è, ed è esattamente il genere di frase che in questa casa non deve entrare
senza misura.

## Restano CINQUE punti, dichiarati
Sentinella `letture` (la **correzione** di una lettura già dentro) e
`tarature` ×3, Scudo `azioniId` e `misure`. Vogliono lo stesso
`trasforma`, che oggi ce l'ha **solo Sentinella**: quando servirà a Scudo va
aggiunto al suo livello dati — **la funzione condivisa c'è già e non va
ricopiata**.

## Prossimo passo atomico
`trasforma` nel livello dati di **Scudo** (due strade, stesso contratto) e i
suoi due punti (`azioniId`, `misure`); poi le `tarature` di Sentinella.
⛔ La **coda offline** resta per ultima.

⏳ Il **giro del browser** (PID 16670, ~3h36) è ancora vivo: quando finisce,
`leggi-giro.mjs`, **sezione 1 prima della 2**.
⚠️ Attesta `c3888fe`: nessuna delle undici unità di oggi è dentro.

## Blocchi
Nessuno.
