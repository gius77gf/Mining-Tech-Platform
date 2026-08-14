# Checkpoint — 2026-08-07 21:1x UTC

## Tipo
unit-complete (il punto decimale nelle sei app: misurato, risultato negativo)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`8d9ed88` — *Il punto decimale nelle sei app: misurato, e non c'e' — con la prova*

## Che cosa è stato completato

| # | unità | il numero che la giustifica |
|---|-------|------------------------------|
| 202 | **la misura sulle sei app** (`8d9ed88`) | **0** su **41 sezioni** aperte davvero |

## ⛔ Un «non c'è» con la prova accanto, non una dichiarazione
`docs/PUNTO_DECIMALE_NELLE_APP_202608.md`. Senza quella pagina il cantiere dopo
rifà la stessa ricerca — ed è la regola della direttiva 5 applicata a una
misura **nostra** invece che a una ricerca.
La ragione dello zero non è fortuna: quelle app **hanno** il formattatore
italiano — le stesse copie diventate alias di `perLettura` un'ora fa. Il core
era l'unico **senza**, ed è per questo che era l'unico a sbagliare.

## ⛔ E la prima misura diceva 217, tutti falsi — vale più del risultato
Cercavo `\d{1,7}\.\d{1,3}` e contavo «€ 40.450,00», «981.400 m³ su 1.200.000
m³», «3.210 h»: **migliaia scritte bene**. Il segno che era il **righello** era
leggibile **prima** di aprire un cantiere — il conto era alto proprio nelle app
che il formattatore **ce l'hanno** (terra 83, flotta 69, conti 60) e **zero**
in scudo e sentinella. *Un difetto che si concentra dove la difesa è più forte
non è un difetto.*
Il discriminante: in italiano il punto separa le migliaia e ne porta sempre
**tre**; un decimale ne porta **una o due**.

## ⚠️ Controprovato, perché «zero dappertutto» non dimostra niente
4 decimali veri su 4 presi, 0 persi, e nessuna forma italiana toccata.

## ⚠️ Il denominatore, da leggere PRIMA del risultato
Quattro superfici hanno aperto **0 sezioni** e **non sono misurate**: **genesi**
— che non ha la barra `.nav button[id]` da cui la sonda ricava le sezioni, ed è
anche l'app con più numeri di tutte: **è il buco più grosso** — e le tre di
deepwork-id. La frase giusta è «nelle sei app verticali con barra di
navigazione, zero», non «in tutto l'ecosistema».

## Stato delle prove
Prove **2.300** (`run-kpi` 1885), copertura **702/702**, banchi **153**,
regole **68**, giro `node` **23 comandi, 0 caduti**, verificato sulla copia di
quello che si committava.

## Che cosa sta girando adesso
⛔ Il giro completo partito alle 19:08 su `2ab9535`, a **199 sezioni** — vicino
alla fine.
⚠️ Gira su un commit vecchio di **venti**.

## Prossimo passo atomico
1. ⛔ **Raccogliere il giro** appena finisce (è a 199 sezioni): PRIMA le righe
   «non ho guardato» — stasera ne è uscito un difetto vero, la Dashboard — poi
   i KO, distinguendo le controprove. Poi **rilanciarlo sul commit corrente**.
2. ⏱️ **Genesi non è misurata da questa sonda**, e non solo per i numeri: non
   ha la barra da cui si ricavano le sezioni, quindi ogni sonda scritta su
   quella forma la salta **in silenzio**. Vale la pena controllare **quali
   altri banchi** hanno lo stesso elenco e quindi la stessa cecità — è la
   regola «se un elenco di soggetti è copiato dalla forma di un'app, provarlo
   su una superficie che quella forma non ce l'ha».
3. ⛔ **Il tema che scala invece di fissare** — cantiere su `shared/`.
4. **Il Quadro nel core** (decisione 15), coi sei ponti scritti **uno solo**.

## Code aperte, dichiarate
- Le 21 prove delle Cloud Functions non girano in questo contenitore.
- `firestore.rules` è cambiato ma **non è pubblicato**: lo fa il fondatore.
- Le altre dei checkpoint precedenti.

## Blocchi
Nessuno.
