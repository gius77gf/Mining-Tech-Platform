# Checkpoint — 2026-08-09T11:38:57Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`56b3d0a`

## Task completato

**La miniatura del Quadro di Sentinella non disegnava NIENTE**, sulla
dimostrazione e sulla prima schermata dell'app. Trovata dal cantiere parallelo,
**riprodotta e corretta da me** — niente entra sulla parola dell'agente.

| | |
|---|---|
| percorso | `M2.0 NaN…` |
| riga della soglia | `y1="NaN"` |
| linea e area | **0×0 px** |
| errori in console | **0** |
| prove rosse | **0** |

## Le tre cose imparate

1. ⛔ **UN CONTRATTO ALLARGATO A METÀ È PEGGIO DI UN CONTRATTO STRETTO.** Il
   06/08 `soglia` era passata da numero a «numero **oppure** `{valore,
   inclusiva}`» per far coincidere miniatura e badge. L'allargamento è stato
   fatto **dove si legge il verdetto**, e non quaranta righe più su **dove si
   costruisce la scala**: `Math.min(10, {valore:40})` fa `NaN`. La causa vera
   non è la riga — sono **due sorelle con due contratti** (`disegnaLinea`
   accettava solo l'oggetto, `disegnaSpark` tutt'e due, ognuna normalizzando
   per conto suo). È la *firma troppo stretta* di `CLAUDE.md` nella veste in
   cui ad allargarsi è **una metà sola**.
2. ⛔ **E SI ROMPEVA SOLO DOVE AVEVA QUALCOSA DA DIRE.** Un punto **senza**
   soglia la miniatura lo disegnava benissimo. Cioè il difetto stava
   esattamente sui punti che il prodotto esiste per far vedere — e per questo
   nessuna schermata «normale» lo mostrava.
3. ⛔ **LA CONTROPROVA HA BOCCIATO LA MIA PRIMA STESURA, ED È IL MOTIVO PER CUI
   SI FA.** Avevo scritto un aiuto `scalaRegge` che **rifaceva in tre righe** il
   calcolo della scala, e ci avevo appeso tre asserzioni. Col difetto vero
   rimesso restavano **verdi**: non guardavano `disegnaSpark` — era una **copia
   debole** della riga della scala, scritta *dentro la difesa contro una copia
   debole*. È la **quarta causa** di «non distingue»: l'iniezione era vera e la
   prova guardava un'altra funzione. La riga della scala non si chiama da
   `node` (vuole un DOM), quindi la sua difesa è **sul sorgente**: nessun
   `min`/`max` ricavato dalla soglia grezza.

## Verifiche
- riprodotto **da me** leggendo il motore e poi numericamente: la forma di
  Sentinella dava scala non finita, il numero nudo no
- misurato **prima** di unificare: tutti e quattro i chiamanti di `linea`
  passano già l'oggetto → nessun comportamento cambia
- `run-helpers` **71 → 75**; due iniezioni **mirate**, ognuna fa cadere la prova
  giusta (la scala grezza → 2 punti trovati; due normalizzazioni → 1 chiamante)
- ripristino **da copia** + `diff -q` muto, mai `git checkout`
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato
- i **quattro** documenti aggiornati addendi compresi (2.380 → 2.384) —
  **roadmap compresa**: è la prima volta che il controllo la prende, ed è
  entrata nell'elenco stamattina

## Cantieri
**Sentinella** e **Campo** rientrati (il loro lavoro è ancora su disco, **non
committato**: `run-kpi.mjs` lo tocca anche **Flotta**, che sta ancora
lavorando — non si mette nell'indice un file che un cantiere sta modificando).
**Flotta** ancora aperto.

## Il giro del browser
Vivo dalle **06:56:09Z** (~4h42), su `graf-scala.mjs --controprova --stretto`.
⚠️ È una controprova: il suo rosso è **voluto**, e il registro lo dichiara.

## Prossimo passo atomico
1. Aspettare che **Flotta** chiuda, poi committare i tre cantieri **insieme**,
   rimisurando: `run-kpi`, `copertura-funzioni`, i banchi toccati, e i numeri
   dei quattro documenti **una volta sola** (le prove sono già a 2401+ su disco
   e la copertura a 719/719 — cifre da **rimisurare**, non da copiare da qui).
2. ⛔ **Poi il giro del browser ha la precedenza**: `leggi-giro.mjs` nell'ordine
   **età → righe «non ho guardato» → KO veri**; nessun KO diventa cantiere prima
   di essere riprodotto **con la sua passata** e **con l'iniezione viva**.
   ⚠️ Quel giro gira su una copia di `494863f` e la miniatura era rotta lì:
   i suoi KO su Sentinella vanno letti sapendolo.

## Blocchi
Nessuno di tecnico. In attesa del fondatore: le **7 tendine tagliate**
(Scudo 5 + Sentinella 2), **`#vf-ente`** (art. 71 c.11), la scelta di **quali**
delle 47 mancanze confermate diventino lavoro, e — nuovo, dal cantiere di
Campo — se `disponibilitaTurno` debba restare **100%** su un turno chiuso in cui
nessuno ha registrato fermi («nessuno ha scritto un fermo» non è «non ci si è
fermati»): è una decisione dichiarata nel modulo, non una svista, e non l'ho
toccata da solo.
