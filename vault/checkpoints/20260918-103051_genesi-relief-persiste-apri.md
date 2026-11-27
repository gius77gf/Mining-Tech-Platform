# Checkpoint — 2026-09-18T10:30:51Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
0c319961 — fix(genesi): la finestra del relief (relLo/relHi) persiste su "Apri", come dir/costi/errColl/dev

## Cosa è stato completato
Dal deep-pass QA su Genesi (agente a4a598fd97c867b83): `D2.relLo`/
`D2.relHi` (la finestra del relief, stessa card di errColl/dev nel form)
non entravano mai in `volSnapshot` e il gestore "Apri" non li
azzerava — stessa identica famiglia già corretta TRE volte oggi stesso
nello stesso file (tratti, poi dir/costi, poi errColl/dev), rimasta
fuori dal censimento "34 campi" di quelle unità. Decidono la classe
sv-bad/sv-warn/sv-ok della riga "Relief per foro" nella Scheda
Validatori (rischio blocchi/vibrazioni/proiezioni): un progetto B
aperto dopo un progetto A che aveva alzato la finestra ereditava la
soglia di A, senza avviso.

Corretto con lo stesso pattern esatto delle tre unità precedenti:
`relLo`/`relHi` in `volSnapshot`, fallback esplicito ai default (5/15)
su "Apri", sincronizzazione in `syncDesignInputs()`.

## Verifica
- Nuovo banco browser `genesi-relief-non-persiste-su-apri.mjs`: 6 prove
  nei due versi, controprova pulita (2 KO), iniezione 1/1.
- **Nota di metodo**: il primo giro completo ha fatto cadere
  `iniezioni-fresche.mjs` — inserire il fallback di relLo/relHi fra la
  fine del fallback di errColl/dev e la riga `if(D2.holes.length)
  computeSeq2D();` ha rotto l'ancora del banco GEMELLO
  (`genesi-errcoll-dev-non-persistono-su-apri.mjs`), che citava
  quell'intera sequenza come blocco unico — la stessa famiglia di
  ancoraggio-che-si-sposta già presa due volte oggi nella stessa unità
  dw-shell.js/Genesi. Ri-ancorato fermando l'ancora dove finisce il SUO
  fallback, senza dipendere da cosa viene dopo; verificato normale 6/6,
  controprova 2 KO puliti (non un crash).
- Giro completo su worktree isolata: **41/41, 0 caduti**. Asserzioni:
  **4141**. Banchi: 347 → **349** esecuzioni, 153 → **154** file
  distinti. 9-suite sum invariato (3.639: relLo/relHi sono stato del
  form, nessuna funzione pura da coprire in `run-kpi.mjs`).
  `numeri-nei-documenti.mjs`: 43 passati, 0 falliti — inclusa una TERZA
  occorrenza di «21 sulle funzioni» in `docs/DECISIONI_WEEKEND.md`
  rimasta indietro dall'unità Deepwork ID (functions) precedente,
  trovata solo ora e corretta a 24.

## Stato roadmap
Vedi vault/ROADMAP_SETTIMANA.md.

## Coda di lavoro — sei unità verificate da agenti in background
1. **Sentinella**: `dataIt` locale in `sentinella-data.js:431-435` non
   valida il calendario (vs. `dw-shell.js:1686-1689` con
   `dataISOEsiste`). Usata nei documenti che escono; lo schermo usa la
   versione condivisa corretta.
2. **Genesi — `pointcloud.js:parseXYZ`** (righe 11-19): su un file XYZ
   con righe miste (con/senza RGB), `pos`/`col` si disallineano
   indice-a-indice dal primo "buco" in poi. `nuvola-poc.html:151-158`
   passa i due array come `BufferAttribute` di `count` diverso sulla
   stessa geometria: colori scalati sui punti sbagliati. Nessun test
   in `run-pointcloud.mjs` copre righe miste.
3. **shared/dw-app-ui.js — Genesi: toast di errore senza CSS
   distintivo**: Genesi non carica `dw-app-ui.css` ma usa il `toast()`
   JS condiviso (chiamato con `tipo:"err"`); il CSS locale definisce
   solo `#toast`/`#toast.show`, nessuna regola `.err`/`.success`/
   `.warn` — un errore ha lo stesso colore ambra neutro di un
   messaggio qualunque.
4. **Toast senza `role="status" aria-live="polite"`** in Genesi e
   deepwork-id/admin (le altre sei superfici ce l'hanno).
5. **Nessuna trappola del focus nella modale** nonostante
   `aria-modal="true"` su tutte le 8 pagine: `dwUiAggancia()` gestisce
   `Escape` ma non `Tab`, nessun `inert`/`aria-hidden` sul resto della
   pagina — Tab ripetuto porta il focus su elementi sotto il backdrop.
6. **Listener accumulato su `#modal-foot` in Conti**
   (`index.html:6165`, flusso "Scrivi il verbale"): ogni apertura
   aggiunge un `addEventListener` in più, mai rimosso.

**NON in coda — verificato e SCARTATO in questa unità**: il presunto
"`.item.tocca` è un no-op, la manina torna su ogni riga di tutte e sei
le app" (agente a2cd701aa80f1f010, difetto #1). Verificato empiricamente
nel browser (`getComputedStyle` su Conti e Scudo): entrambe le app
hanno già un `.item{cursor:default}` locale che, per ordine di
sorgente nell'HTML (il loro `<style>` viene dopo il `<link>` al foglio
condiviso), vince la parità di specificità sulla regola condivisa
`.item{cursor:pointer}` — `.item.tocca` funziona correttamente
(`cursor:pointer` misurato) e `.item` senza tocca mostra `default`
come previsto. Campo non usa affatto `.tocca` (verificato `conTocca:
null`) e dipende invece dalla convenzione opposta (base pointer, marca
le ferme), che il bug condiviso non tocca. Il codice condiviso resta
architettonicamente ridondante (`.item.tocca` è inerte in isolamento),
ma NON è un difetto vivo oggi in nessuna delle sei app: non richiede
un fix, richiederebbe una migrazione "senza fretta" già dichiarata
tale nel commento del 01/08 — non un'unità di questa sessione.

## Prossimo passo atomico
Scegliere una fra le cinque unità rimaste in coda (Sentinella, Genesi
pointcloud, o le tre di dw-app-ui.js/accessibilità) e isolarla in una
nuova worktree. Continuare "mai fermarsi".

## Blocchi
Nessuno.
