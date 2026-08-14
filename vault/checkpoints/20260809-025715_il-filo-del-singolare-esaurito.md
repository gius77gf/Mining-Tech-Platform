# Checkpoint — 2026-08-09T02:57:15Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`305c842`

## Task completato

**Il filo del singolare, chiuso su tutte e sette le superfici** — e chiuso
davvero, non lasciato a metà: **115 candidati → 17**, e i 17 rimasti hanno
**tutti** una ragione scritta accanto.

## Le due cose imparate

1. ⛔ **UNA FRASE PUÒ SAPER DISTINGUERE PER METÀ.** In `flotta-data`:
   ```
   "le letture del contatore coprono " + giorni + (giorni === 1 ? " giorno" : " giorni")
     + ": per stimare " + orizzonte + " giorni servono almeno " + minGiorni
   ```
   La **prima** metà distingue il singolare, la **seconda** no — nella stessa
   frase, a otto parole di distanza. Chi l'ha scritta conosceva la regola e
   l'ha applicata al primo numero; il secondo è passato perché nessuno lo
   guardava. Non è distrazione: è che la regola viveva **nella testa di chi
   scriveva**, non in una funzione.
2. ⛔ **UN SOGGETTO SANO NON SI TOCCA PERCHÉ LO SEGNALA UN CONTROLLO** — tre
   volte stanotte, e ogni volta avrei peggiorato il prodotto: il foglio di
   Scudo accusato dal righello (che avrebbe fatto togliere una colonna al
   verbale chiesto per primo in ispezione), `quantiMesi` corretto e poi
   **ripristinato**, e adesso le tre **ore motore** di Flotta — un piano a
   **un'ora** motore non è un caso del mestiere — dichiarate invece che
   cambiate.

## Il conto finale, per famiglia
| famiglia | quanti | perché |
|---|---|---|
| commenti / testo della roadmap | 6 | limite dichiarato del righello (non toglie i commenti multi-riga) |
| dominio che non contiene 1 | 4 | `quantiMesi` {12,6,4}, `v.slice(1)` {6,12,24}, `c.termine` {12,24} e il `mesi > c.termine` che ne discende |
| obbligati a ≥ 2 da un'altra variabile | 4 | `p.n` (`minLetture` è `Math.max(2,…)`), `m.n` (`nums.length < 2` esce prima), `righe.length` (≥ `varianti.size` > 1), la voce senza data di Conti |
| ore motore di Flotta | 3 | un piano a un'ora motore non esiste nel mestiere |

Correzioni fatte, per superficie: **Sentinella 7 · Genesi 10 · Campo 5 ·
Scudo 3 · Flotta 7 · core 1** = **33 punti**.
⚠️ Restano al plurale **dichiarati**: «campioni» di un'onda sismografica
(migliaia — un'onda da un campione non è un'onda) e «foto», invariabile in
italiano.

## Verifiche
- `giro-node` **34 comandi a posto, 0 caduti** dopo ogni unità, e rifatto sulla
  **copia** di ciò che si committa
- KPI **1922/0** · `sintassi-pagine` 34/0 · `iniezioni-fresche` **215/215**

## Stato roadmap
Riga «I ternari del singolare»: aggiornata col conto per famiglia. Il filo è
**esaurito**, non abbandonato — chi lo riapre trova scritto perché ogni riga
rimasta è rimasta.

## Prossimo passo atomico
**Leggere il giro del browser** (pid 32676,
`scratchpad/resp/giro/registro4.txt`, attesta `7cddb59`). Alle 02:57 era vivo
da **3h47** ed è **sopravvissuto al riavvio del contenitore**: figlio vivo su
`barra-etichette`, secondo dei tre temi. Mancano ~3 passate.
Ordine di lettura: `node apps/deepwork-id/tests/browser/leggi-giro.mjs
<registro>` → **sezione 0 (età)** → **righe «non ho guardato»** → **KO veri**.
⛔ Quel giro attesta un commit di **quattordici unità fa**: la sezione 0 dirà
di quanti commit il branch è andato avanti, e i suoi KO vanno riverificati sul
commit di adesso prima di aprirci un cantiere.

## Blocchi
Nessuno.
