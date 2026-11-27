# Checkpoint — Genesi: la pianta si legge e si tocca dal telefono

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
Quello che contiene questo file («fix(genesi): la pianta si misura in px di
schermo…»). Il precedente, `5041da86` (la parola del campo e la frase sulla
tela), è confermato dal giro `node` completo: 47 comandi a posto, 4526
asserzioni (letto dal registro).

## Il difetto, misurato prima di toccare
- La tela della pianta ha 960 punti di larghezza, mostrata al massimo a 560
  px. Tutto era scritto in punti: su un telefono da 320 (tela a 292 px) il
  numero di un foro era alto 2,7 px, le quote 3,3 px; la pianta era una
  striscia alta 98 px. Sul computer i testi erano 5-7 px.
- Il raggio con cui si prende un foro era 18 punti = 5,5 px sul telefono.
  Premendo: a 320 un tocco a 6 px dal centro di un foro ne CREAVA uno nuovo
  (a 430 da 8 px, a 1280 da 14 px).

## Che cosa è stato fatto
- `apps/genesi/genesi.html`, `drawDesign2D`: una trasformazione sola in cima
  (`kT`, da `scalaTestoTela`), e da lì in giù larghezza, margini, corpi e
  raggi sono px di schermo. `D2._m` resta in punti di tela e porta `u`.
  Layout `stretta` (< 420 px) e `bassa` (meno di 44 px fra fronte e prima
  fila). Legende in tre funzioni (`_legendaVoci`, `_legendaRighe`,
  `_legendaDisegna`) che vanno a capo; `_presaPx` per il raggio di presa;
  tolleranze di aggancio e guida in px di schermo; il piede del foro sopra
  il pallino; la pianta si ridisegna quando lo schermo cambia larghezza.
- `apps/genesi/genesi-data.js`: `raggioForoTela`, `raggioPresaTela`,
  `righeDiVoci`; `d2HitTest` e `d2HitTestPt` accettano il raggio.
- Prove `node`: `run-kpi` 3262 → 3266.
- Banco nuovo `apps/deepwork-id/tests/browser/genesi-pianta-schermo.mjs`
  (porta 8702), registrato in `tutti.mjs` con due controprove: 117 controlli
  nel passaggio sano; `--controprova` (la pianta torna in punti: 33 KO, fra
  cui i due per cui la correzione esiste); `--controprova=dettagli` (sei
  difetti rimessi UNO PER VOLTA, ognuno fa cadere il suo controllo: 6 su 6).
- Banchi ritoccati perché citavano le righe cambiate o le distanze di prima:
  `genesi-maglia-assente`, `genesi-snap-estremo`, `genesi-guida-allineamento`,
  `genesi-foro-per-foro` (rombo e piede: letti dove sono adesso; il piede
  guardato senza l'alone del foro scelto).

## Verifiche (lette dai registri)
- Giro `node` completo sullo stato committato (lanciato sull'indice, prima
  del commit, senza cantieri aperti): **47 comandi a posto, 0 caduti, 4531
  asserzioni**.
- Sulla COPIA con le modifiche (prima del piede sopra il pallino): tutti i
  54 banchi `genesi-*.mjs`, 53 a uscita 0; il 54°, `genesi-foro-per-foro`,
  cadeva su 3 controlli (rombo e piede cercati alle distanze di prima) ed è
  214/214 dopo la correzione.
- Sull'albero vero, stato finale: i 16 banchi che toccano la pianta tutti a
  uscita 0 (fra cui `genesi-pianta-schermo` 117/117, `genesi-foro-per-foro`
  214/214, `genesi-maglia-assente` 40/40, `genesi-campi-assenti` 64/64);
  controprove di `genesi-pianta-schermo` (tutt'e due), `genesi-maglia-assente`
  (documenti), `genesi-snap-estremo`, `genesi-guida-allineamento`: tutte con
  le iniezioni sul bersaglio e il rosso voluto.
  La controprova di `genesi-foro-per-foro`: 72 iniezioni su 72 sul
  bersaglio, 122 controlli caduti come voluto.
- ⚠️ NON rigirati sullo stato finale: gli altri 38 banchi di Genesi (girati
  sulla copia prima dell'ultima modifica, il piede sopra il pallino). Il
  giro completo dei banchi di Genesi sul committato parte adesso.
- Scatti guardati: 11 stati × 3 larghezze della tela, più la pagina intera a
  320 e 1280 con una volata inclinata.

## Numeri dichiarati nei documenti
3.768 prove senza rete (3266 + 330 + 83 + 40 + 9 + 8 + 7 + 3 + 22) · giro
4531 su 47 comandi · condivisi 388 su 388 · `genesi-data.js` 214/214 · pagina
di Genesi 153 funzioni (53 estraibili; tabella 25/44/18/19/47) · 469
esecuzioni nel browser da 215 file di banco.

## Prossimo passo atomico
1. Leggere l'esito del giro dei 55 banchi di Genesi sul committato
   (registro in scratchpad `tela/dopo/esiti.txt`); se un banco cade,
   correggere in un commit a parte.
2. Poi **E7, il resto**: le finestre (modali) del Progetto 2D e i comandi
   sopra la scena 3D con le due domande di `genesi-colonna-progetto.mjs`
   (bordo dello schermo ≥ 12 px, bersaglio ≥ 44×44) a 320 e 430 — quel banco
   dichiara di non guardarli. Prima MISURARE (contare quanti comandi stanno
   sotto 44 e quanti toccano il bordo), poi correggere.
3. A parte, voce aperta in roadmap: la pianta non ha l'ingrandimento (oltre
   20 fori per fila sul telefono i pallini si toccano).

## Blocchi (del fondatore)
Decisioni 28, 33 (⚠ quale foro usa la gittata), 34 (lettore LAZ), 35 (spalla
al piede), 36 (accenti nei CSV: prima la prova con Excel); 32 rimandata.
