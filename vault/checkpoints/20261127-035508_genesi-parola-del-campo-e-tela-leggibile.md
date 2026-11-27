# Checkpoint — Genesi: dove la pianta non è disegnabile, la parola è quella del campo e la frase sulla tela si legge

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): dove la pianta non è
disegnabile…»). Il precedente, `cdc50257` (banco `genesi-campi-assenti`
riscritto), è confermato dal giro `node` completo: **47 comandi a posto, 0
caduti, 4524 asserzioni** (letto dal registro).

## Che cosa è stato fatto
1. **La parola.** `fraseMagliaAssente(motivo)` in `apps/genesi/genesi-data.js`:
   «manca la spalla» / «manca l'interasse» / «mancano la spalla e
   l'interasse». La usano la tela della pianta, la scheda, la riga che resta
   in Home e `nonEsceSenzaPianta` (che con due dati dice «Scrivi i due
   dati…»). Lo STATO (`D2.magliaAssente === 'burden'`) non è cambiato.
   Anche «Manca il burden o l'interasse di oggi» (confronto delle spalle) →
   «Manca la spalla o l'interasse di oggi».
2. **La tela.** Misurato nei pixel: la frase sulla pianta era alta 4 px a
   320 e 5,9 px a 430 (corpo 13 su una tela da 960 punti mostrata a 292 /
   402 px). `scalaTestoTela(larghezzaInterna, larghezzaMostrata)` nel modulo;
   la pagina scrive due righe (15 e 14 px veri) e riscrive la frase quando
   lo schermo cambia larghezza.
3. **Prove.** `run-kpi` 3260 → 3262 (due prove nuove, una ritoccata);
   `genesi-maglia-assente.mjs` 34 → 40 controlli: il nome del campo letto
   dalla pagina, e la frase sulla tela misurata nei pixel a 430 e a 320.
   Controprova `--controprova=documenti`: 4 iniezioni su 4, 22 controlli
   cadono (i sei sulla tela con «righe alte 4-5,9 px»). `genesi-campi-assenti`
   64/64, controprova 21 su 21.
4. Scatti guardati (320 e 430, tre casi): tela, scheda, messaggio del
   comando fermato.

## Verifiche su questo stato (lette, non dedotte)
run-kpi 3262/0 · sintassi-pagine 34/0 · nomi-liberi 32/0 · copertura 11
soggetti a posto (`genesi-data.js` 211/211, condivisi 385 su 385) ·
run-stile 330/0 · numeri-nei-documenti 43/0 · iniezioni-fresche 836 su 836 ·
suite-collegate 3/0 · import-esistenti 342/0. Il giro `node` completo parte
dopo il push: atteso 47 comandi, **4526** asserzioni (scritto per somma).

## Numeri dichiarati nei documenti
3.764 prove senza rete (3262 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4526 su 47 comandi · condivisi 385 su 385 · `genesi-data.js` 211/211.

## Prossimo passo atomico
**I testi della pianta sul telefono** (voce aperta in roadmap «sul telefono
i testi della pianta sono scritti a 3-4 px»).
1. MISURARE prima di toccare: aprire la dimostrazione di Genesi nel 2D a
   320 e 430, scattare la tela (`#d2-canvas`, `scrollIntoView` al centro) e
   GUARDARLA; contare i testi che `drawDesign2D` scrive (righe 6660-6935 di
   `apps/genesi/genesi.html`, corpi 9-12 punti) e il loro corpo vero =
   corpo × larghezza mostrata / 960.
2. Decidere con lo scatto quali testi servono sul telefono (numero del
   foro, quote S e B, «FRONTE — faccia libera», sequenza, legenda) e quali
   si sovrappongono se scalati: NON scalare tutto alla cieca.
3. Usare `scalaTestoTela` (già nel modulo) con un tetto, e misurare nei
   pixel col metodo di `fraseSullaTela` (`genesi-maglia-assente.mjs`): se
   serve a due banchi, spostarlo in un file condiviso dei banchi.
4. Banco nuovo o sezione in `genesi-colonna-progetto.mjs`, con controprova.

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
