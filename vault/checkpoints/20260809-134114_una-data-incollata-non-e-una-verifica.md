# Checkpoint — 2026-08-09T13:41:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`cecdac6`

## Task completato

**Direttiva 7 sulle due app che ho toccato oggi: 19 verdetti rilanciati, tutti
reggono, e tre prove riscritte perché non si riproducevano più.**

| | verdetti | prove che non tornavano |
|---|---|---|
| Scudo (6 righe) | **6 su 6 reggono** | **0** |
| Sentinella (13 righe) | **13 su 13 reggono** | **3** |
| arretrato dei documenti | 6 commit, 5 indietro | **4 commit, 3 indietro** |
| puntatore roadmap | un nome scritto a mano | **il comando** |

## Le due cose imparate

1. ⛔ **LA STESSA CAUSA, TRE VOLTE, IN UN DOCUMENTO SOLO — e una quarta nel
   sostituto.** Tutte e tre le prove marce di Sentinella erano **un termine
   corto dentro parole comuni**: `COV` pescava «viewport-fit=**cov**er», `API`
   pescava «ca**pi**re / ca**pi**ta / ca**pi**sce» (22 righe dove il documento
   ne dichiarava 4), `ios` pescava «silenz**ios**a» e «inch**ios**tro» (9 dove
   dichiarava 0). E **riscrivendole ho rifatto l'errore**: il sostituto `REST`
   combacia con «**rest**a» e «**rest**ituisce» — **176 righe**. Il segno che
   un termine non va bene è che il conto è *grande*, non che è diverso da zero.
   ⚠️ Nessuno dei tredici verdetti cambia. È la **quarta forma
   dell'invecchiamento**: la riga resta vera e a marcire è **il modo in cui è
   scritta**, perché il repository cresce.
2. ⛔ **IL CONTROLLO MI HA PRESO MENTRE INCOLLAVO UNA DATA.** Avevo
   stampigliato tutt'e due i documenti con `HEAD` — che però non aveva toccato
   né i documenti né le app. `documenti-invecchiati` lo dice con le sue parole:
   *«il commit esiste ma non ha mai toccato né il documento né l'app: una data
   incollata non è una verifica»*, in tre secondi, **sulla copia del
   committato**. La stampiglia giusta è **l'ultimo commit che ha toccato
   l'app**.
   ⚠️ Vale la pena scriverlo perché stavo facendo esattamente la cosa contro
   cui quel controllo è stato costruito, **subito dopo** aver rilanciato
   diciannove verifiche a mano: la parte noiosa la si sbaglia proprio quando si
   è appena fatta bene quella difficile.

## Verifiche
- i **sei** comandi di Scudo rilanciati: `0 e 0` tutti e sei
- i **dodici** insiemi di termini di Sentinella rilanciati, e i tre sostituti
  **misurati prima** di scriverli (`webhook|endpoint|OAuth` → 0 e 0;
  `SO2|NO2|benzene|camino` → 0 e 0; `android|play store|app store|app nativa|
  react native|capacitor` → 0 e 0)
- il conto sorvegliato delle mancanze resta **47** (campo 11 · conti 8 ·
  flotta 5 · scudo 6 · sentinella 13 · terra 4)
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## Il giro del browser
Vivo dalle **13:03:34Z** su una copia di `c6694e7`.
⚠️ Da allora sono stati fatti **sei** commit: la sottrazione la farà la sezione
0 di `leggi-giro`, non la faccio a mente.

## Cantieri paralleli aperti
**Contrasto dentro le modali** (un buco mai misurato: `contrasto.mjs` non apre
nessuna finestra) e **Terra** (disegni + dato assente). Nessuno dei due committa.

## Prossimo passo atomico
1. Restano indietro **campo** (1 commit che morde), **flotta** (1) e **conti**
   (2, nessuno che morde): stesso metodo, rilanciare i comandi delle loro righe
   e ristampigliare **con l'ultimo commit che ha toccato l'app**.
2. Leggere il giro quando finisce: `leggi-giro.mjs`, ordine **età → righe «non
   ho guardato» → KO veri**. Lì dentro c'è la risposta su **`#vf-esito`** di
   Scudo, che il mio righello non è riuscito ad aprire da solo.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — l'ultima delle sette
tendine; **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso in cui nessuno ha
registrato fermi.
