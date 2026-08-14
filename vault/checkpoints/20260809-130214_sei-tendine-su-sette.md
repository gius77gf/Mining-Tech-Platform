# Checkpoint — 2026-08-09T13:02:14Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`6645782`

## Task completato

**Tre cantieri paralleli raccolti, ognuno rimisurato da me.** Le tendine
tagliate scendono da 7 a 1, e quell'una aspetta te.

| cantiere | prima | dopo | rimisurato da me |
|---|---|---|---|
| Scudo `#vf-verbale` | 5 KO | **1** (solo `#vf-ente`) | `modali-dentro --solo=scudo` |
| Sentinella `#ppv-scelta` | 2 KO | **0** | `modali-dentro --solo=sentinella` |
| Conti, consegne senza valore | taciute | **dichiarate** | `venditePerProdotto` sulla demo |

## Le tre cose imparate

1. ⛔ **UNA CORREZIONE PUÒ FUNZIONARE ESATTAMENTE DOVE NESSUNO LA USA.** I 6 px
   che mancavano a Sentinella a 390 px sembravano chiudibili col carattere, e
   **col puntatore fine** — quello con cui gira il banco — 15 px si ottengono e
   bastavano. Ma dentro `@media (hover:none),(pointer:coarse)` il foglio
   condiviso scrive `font-size:16px !important`: col puntatore **grossolano**,
   cioè **il telefono in cava dove il prodotto vive**, restano 16. Chiudere il
   righello invece del prodotto è la forma di verde falso più difficile da
   vedere, perché la misura che la smaschera è *l'ambiente del cliente*, non
   il numero.
2. ⛔ **UN DIFETTO LATENTE STA DOVE LA DIMOSTRAZIONE È TROPPO COMPLETA.** La
   voce «— nessun verbale collegato —» è quella **selezionata di default** su
   una verifica appena aperta, e a 320 px chiedeva 217,9 px in 196. Nessun
   banco lo diceva: nella dimostrazione **tutt'e due** le verifiche il verbale
   ce l'hanno già, quindi lo stato iniziale non si presenta mai. Il caso più
   comune per l'utente — il campo appena aperto — era quello che nessuno vedeva.
3. ⛔ **LA DISCRIMINAZIONE VA TENUTA ANCHE QUANDO COSTA.** In Conti la strada
   comoda era dedurre «non valorizzabile» da «senza densità». Sono diverse:
   «Misto di cava», venduto **a tonnellata** senza densità, ha un valore
   perfettamente calcolabile — la deduzione avrebbe messo un avviso su una riga
   sana. Verificato da me: resta `parziale false`. Un avviso sbagliato costa la
   credibilità di tutti gli altri.

## Verifiche
- Scudo **5 → 1 KO**, denominatori intatti (12 aperture, 120 voci di tendina)
- Sentinella **2 → 0**, denominatori **identici** al prima
- Conti rimisurato sul modulo: *Sabbia lavata 68,3 t per €605, di cui **24,3 t**
  non valorizzabili* — più di un terzo, prima dichiarati da nessuna parte
- i quattro documenti aggiornati **una volta sola** con le cifre rimisurate:
  **2.425** prove (run-kpi 1973), copertura **722/722**, **161** esecuzioni da
  **72** file distinti
- `giro-node` **34 comandi a posto, 0 caduti** sulla copia del committato

## E due segnalazioni su di me, rimisurate e smentite
Un cantiere ha riferito un «Chromium orfano da 6h24, appeso» e un file estraneo
in radice. Misurato: il processo era la **mia** controprova, viva da **undici
minuti**, che stava producendo output (e infatti ha poi trovato tre superfici
dove l'iniezione non morde); `ppid=1` non è orfanità, è come si presenta un
`nohup &`. Il file l'avevo già tolto.
⚠️ È la regola «niente entra sulla parola dell'agente» nella direzione meno
attesa: qui avrebbe fatto **uccidere una misura viva e sana**.

## Prossimo passo atomico
⛔ **Un giro nuovo del browser sul committato**, che è avanti di oltre settanta
commit rispetto a quello letto stamattina — e adesso il registro dirà da sé
**quando è partito** e **se è arrivato in fondo**.
⚠️ Prima di lanciarlo: guardare **chi tiene la porta**, non solo se è libera.
Poi, mentre cammina: chiudere `accorciaVoceTendina` in `shared/dw-ponti.js`
(alias, non seconda copia) — è la sola cosa che i due cantieri non potevano
fare da soli.

## Blocchi
In attesa del fondatore: **`#vf-ente`** (art. 71 c.11) — è l'ultima delle sette
tendine; **quali** delle 47 mancanze confermate diventino lavoro; e se
`disponibilitaTurno` debba restare **100%** su un turno chiuso in cui nessuno ha
registrato fermi.
