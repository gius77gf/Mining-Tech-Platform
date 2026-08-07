# Checkpoint — 2026-08-07 15:05:00 UTC

## Tipo
unit-complete (tre unità: il canarino, le undici uscite del core, la geometria
del gradiente nel righello — più la ricerca su Terra e la sua verifica)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`fb8e585` — *Il righello legge inchiostro e fondo nello stesso punto: la forbice
larga passa da 63 casi a 5, e i verdetti non cambiano*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|---|---|
| 167 | **canarino** (`f073124`) | ciclo vivo alle 14:51 UTC, riparte da `efcf16f` |
| 168 | **ricerca sulla denuncia annuale** (`9bae83a`) | 123 righe, 18 con fonte o `[dedotto]`, **1** Regione documentata |
| 169 | **la verifica che ha fermato una correzione sbagliata** (`ea05f7a`) | il prospetto non stampa **nessuna** tonnellata |
| 170 | **le undici uscite del core** (`6e7cc92`) | banco **30 → 67** prove, 8 famiglie di difetti chiuse |
| 171 | **la geometria del gradiente** (`fb8e585`) | forbice ≥4 da **63 casi a 5**, 0 verdetti cambiati |

## ⛔ Il core ha undici uscite, non nove — e quella che mancava era la peggiore
Censite **per effetto**: il mio elenco ne diceva nove. `exportRapportiniXLSX`
(un Excel a due fogli) non lo premeva nessun banco, ed è quella che ha prodotto
più difetti.
Il più grave sta sul numero più sorvegliato dell'app: su una volata caricata a
metà il PDF scriveva **«56 kg»** senza una parola, mentre **la tabella dello
stesso foglio** mostrava cinque righe con «-» nella colonna Carica. Il documento
portava il proprio smentimento e dichiarava il numero come definitivo.
Altre sette famiglie della stessa specie, fra cui l'Excel che scriveva la maglia
**«0»** nel foglio che tre colonne più in là la dichiara mancante.
⚠️ E una trappola per chiunque scriva un banco sul core: la libreria Excel si
scarica **quando si preme il bottone**, cioè quando il **service worker** già
controlla la pagina e le rotte di Playwright non passano più. «Le rotte
funzionano» era vero e falso a seconda di *quando* si chiede.

## ⛔ Il righello: la mia strada era sbagliata, e il cantiere l'ha smentita con un caso
Avevo suggerito i **quattro angoli**. Costano uguale e su **548 testi** danno un
numero più alto del vero; e il caso che li smentisce è stato costruito: fondo
grigio uniforme, inchiostro dal nero al bianco lungo le lettere — **4,56 e 4,61
ai due capi, 1,17 in mezzo**. Illeggibile dove nessuno guardava, e promosso da
tutt'e due i righelli precedenti. Adesso è `--controprova-gradiente`, registrata
in `tutti.mjs` (banchi 137 → **138**).
Validato contro gli **scatti veri**: 288 punti su 32 gradienti, scarto peggiore
**2/255**. E il vecchio righello sbagliava anche fuori dai KO (Genesi `.l` 4,83
contro 5,46 veri).

## ⚠️ E una correzione che stavo per fare io, fermata dalla misura
La ricerca su Terra proponeva di dichiarare la densità nel prospetto della
denuncia. Misurato: quel prospetto **non stampa nessuna tonnellata** (zero
occorrenze di `tonnellate|ton|t/m³` fra le sue 220 righe) e i due CSV nemmeno.
La densità non entra in **nessun** documento che esce da Terra: dichiararla lì
sarebbe rumore. Dove la domanda vale è il **ponte Terra ↔ Conti**.
Terza volta oggi che un «non c'è» va riscritto, e la prima in cui stavo per agire.

## Stato delle prove
Sul committato: giro `node` **23 comandi, 0 caduti**, verificato sulla copia a
ogni commit. Banchi **138**. Prove 2.251 nelle sei suite sorvegliate.

## Che cosa sta girando adesso
**Due cantieri**: la barra di Sentinella a 320 px e i tre campi della verifica
periodica in Scudo. Otto file non committati sono loro.

## Prossimo passo atomico
1. **Raccogliere Sentinella e Scudo**, sulla copia di quello che si committa.
   ⚠️ Il cantiere di Scudo ha aggiunto funzioni **e** prove: al commit i conti
   dei documenti vanno riscritti (le suite ne eseguono 2260 e la copertura è
   688/688 sul disco vivo).
2. ⛔ **`contrasto-non-testo.mjs` ha lo stesso accoppiamento a tappeto** sui
   gradienti che il righello ha appena smesso di avere: è il prossimo cantiere
   naturale, e finché non è fatto la WCAG 1.4.11 è misurata col righello vecchio.
3. ⛔ **Le quindici decisioni verdi a fine giornata**, col piano scritto in
   roadmap (`ae2255d`): sette si applicano scrivendole, otto vogliono un
   cantiere, ognuna dichiarata **decisa dal ciclo** nel commit.

## Code aperte, dichiarate
- Le due uscite 3D del core sono irraggiungibili nella dimostrazione, e
  **lette** hanno un nome di file **fisso**: due fronti diversi si
  sovrascrivono. Non corretto perché non misurabile.
- L'elenco delle volate del core è una terza copia debole: la forma giusta
  finirebbe dove il testo viene tagliato. Va deciso con uno scatto.
- Il righello ai pixel non regge l'inchiostro a gradiente da capo a capo.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
