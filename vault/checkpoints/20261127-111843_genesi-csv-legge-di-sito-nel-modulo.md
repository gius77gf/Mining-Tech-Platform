# Checkpoint — Genesi: il CSV della legge di sito lo compone il modulo (fetta di B3)

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («refactor(genesi): il CSV della legge di
sito lo compone il modulo»). Stato dei precedenti: vedi «Verifiche».

## Che cosa è stato fatto
- `apps/genesi/genesi-data.js`: `csvLeggeDiSito(punti)` (228 → 229 provate),
  identica carattere per carattere alla riga che stava nell'`onclick`.
- `apps/genesi/genesi.html` (`sitoExport`): chiama il modulo; se torna vuoto
  dice «Nessun referto da esportare». Tolti 1037 caratteri dalla pagina.
- `run-kpi` 3273 → 3274 (prova nuova; «i tre file chiamano DAVVERO csvCell»
  riancorata sul modulo). `documenti-dimostrazione`: 170 documenti, 28 di
  Genesi.
- Per chi usa l'app non cambia niente.

## Verifiche (lette dai registri)
- Giro `node` sullo stato in indice: 47 comandi a posto, 0 caduti, 4540.
- Sull'albero vero: `genesi-numeri-tranquilli` 39/39 (preme «sitoExport» e
  legge il file: l'apostrofo di guardia c'è ancora) e controprova (8 difetti
  su 8, 19 prove cadute); `genesi-documenti-che-escono` 101/101 e
  controprova (16 difetti su 16, 30 prove cadute).
- `08d02801` (Genesi nel controllo dei documenti; contiene `baa549f9`, il
  bottone «MIC»): giro `node` sul committato 47 comandi a posto, 4539.
  ⚠️ Il giro dei 56 banchi su quella copia era a 10 su 56 (10 a uscita 0)
  quando questo file è stato scritto (`scratchpad/giro52-banchi.txt`): va
  letto fino in fondo.
- ⚠️ NON rigirati su questo stato: gli altri banchi di Genesi.

## Numeri dichiarati nei documenti
3.776 prove senza rete (3274 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4540 su 47 comandi · condivisi 403 su 403 · `genesi-data.js` 229/229 · pagina
162 funzioni · 471 esecuzioni nel browser da 216 file.

## Prossimo passo atomico
**La prossima fetta di B3: `genesi_confronto_AB.csv`** (composto in
`cmpExport`, attorno a «QUESTO ERA L'ULTIMO DEI QUATTRO FILE DI GENESI SENZA
`csvCell`»). Niente è ancora scritto. Passi:
1. LEGGERE l'`onclick` di `cmpExport` fino a `a.download='genesi_confronto_AB.csv'`:
   che cosa prende dalla pagina (`cmpScatti()`, `cmpForiPropri`, `_base`,
   `_fpNoto`) e che cosa è già nel modulo.
2. Contare PRIMA le iniezioni dei banchi che citano quelle righe
   (`grep -n "confronto_AB\|cmpExport" apps/deepwork-id/tests/browser/*.mjs`)
   e guardare che i banchi applichino PER FILE: spostando il codice nel
   modulo un'iniezione sulla pagina smette di mordere in silenzio.
3. Funzione pura `csvConfrontoAB(A, B)` nel modulo, identità carattere per
   carattere sugli stessi due scatti contro la riga di prima; prova in
   `run-kpi`; voce in `documenti-dimostrazione`.
⚠️ Visto e NON toccato in questa unità: il CSV della legge di sito scrive i
decimali col punto («6.4»). È la stessa domanda della decisione 36.
⚠️ Guardato e a posto: il numero del foro nel piano di carico (posto
nell'ordine dei ritardi) e quello della pianta e del foglio (`seq + 1`)
nascono dallo stesso ordinamento stabile per ritardo — coincidono.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel), 37 (sul telefono:
trascinare un foro subito o dopo averlo scelto); 32 rimandata.
