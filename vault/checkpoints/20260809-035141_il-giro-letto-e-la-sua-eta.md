# Checkpoint — 2026-08-09T03:51:41Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`cfb1d7d`

## Task completato

**Il giro del browser è finito ed è stato letto** (4h42, pid 32676,
`scratchpad/resp/giro/registro4.txt`, copia salvata in
`scratchpad/sing/registro4-salvato.txt`), nell'ordine che la regola impone:
**età → righe «non ho guardato» → KO veri**.

## Quello che dice, con l'età davanti

⛔ **SEZIONE 0 — attesta `7cddb59`: il branch è avanti di 39 commit, di cui 17
toccano le superfici misurate.** Ogni KO è vero **a quel commit**, non adesso.
È esattamente il caso per cui la sezione 0 esiste, e stavolta il numero è
grosso: nessuno di questi KO va aperto come cantiere prima di riverificarlo.

**Esito grezzo:** 157 passate, **134 a posto, 23 da guardare**.
Il lettore, tolte le controprove (il cui rosso è VOLUTO) e il riepilogo finale
(che è una ripetizione), conta: **20 KO veri · 52 righe «non ho guardato» ·
1.284 KO voluti tenuti fuori · 23 passate cadute ricontate nel riepilogo**.

⚠️ **E IL REGISTRO È TRONCO, LO DICE IL LETTORE:** il giro ha stampato il suo
riepilogo completo («134 banchi a posto, 23 da guardare», più le tre passate
più lente) ma **manca la riga «USCITA»**. Cioè manca la **dichiarazione di
validità** del runner — la guardia dell'impronta, quella che direbbe se
qualcosa è cambiato sotto ai piedi del giro. Il giro girava su una `git
worktree` immobile, quindi il rischio è basso; ma «basso» non è «misurato», e
va detto invece che dedotto. In mezzo c'è stato anche un **riavvio del
contenitore**, a cui il giro è sopravvissuto.

## I 20 KO veri, raggruppati (da riverificare, non da aprire)

| famiglia | quanti | nota |
|---|---|---|
| `dentro le modali`: tendine tagliate in Scudo (@390 e @320) e Sentinella | 7 | la più numerosa; testo dell'`<option>` più largo del `<select>` |
| `quali punti conta la nuvola` (Genesi) | 4 | frasi sul ritaglio/sottocampionamento |
| `foglio di turno · coi dati veri tace` (Campo) | 3 | la consegna non dichiara i dati d'esempio |
| `conti_costi_<periodo>.csv` | 2 | ⏱️ **probabilmente già chiusi**: è il fronte lavorato stanotte (`riepilogoCosti`, le voci senza importo dichiarate invece che sparite) |
| `stati «non misurato» visibili` (Campo) | 2 | |
| `le barre di peso di Conti` | 1 | |
| `la manina promette un tocco che c'è` (Campo) | 1 | 33 voci, 1 promette e non mantiene |

## La cosa imparata
⛔ **Un giro lungo si legge con la sottrazione davanti, se no si lavora sul
passato.** Qui la sottrazione dice **39 commit, 17 che mordono**: senza quella
riga, i due KO del CSV di Conti avrebbero aperto un cantiere su un difetto
**chiuso stanotte**. La sezione 0 è costata un `git rev-list` e ha pagato al
primo giro in cui è servita davvero.

## Verifiche
- lettura fatta con `leggi-giro.mjs`, che separa i **1.284** rossi voluti dai
  20 veri e scarta il riepilogo ripetuto: contarli a mano avrebbe dato **43**
  invece di 20
- registro conservato in `scratchpad/sing/registro4-salvato.txt` prima di
  qualunque altro giro

## Prossimo passo atomico
**Riverificare i 20 KO sul commit di adesso**, uno alla volta e col banco che
li ha prodotti, partendo dai due più promettenti:
1. `conti-documenti-che-escono.mjs` sul CSV dei costi — attesa: **già verdi**,
   perché è il fronte chiuso stanotte;
2. `modali-dentro.mjs --solo=scudo` sulle 7 tendine tagliate — è la famiglia
   più numerosa e non è stata toccata da nessuna unità di stanotte, quindi è la
   più probabile fra i difetti **ancora veri**.
Solo dopo la riverifica si apre un cantiere, e sulla famiglia, non sui singoli.

## Blocchi
Nessuno.
