# Checkpoint — 2026-09-13T11:02:20Z

## Tipo
unit-complete

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
`548f70a6`

## Completato

Terzo completamento del disegno di precisione (dopo G34 aggancio alla
griglia e G34bis coordinata x): il burden e l'interasse **veri** del
foro selezionato — già calcolati da `computeEnergia2D` e già scritti
come testo nel pannello laterale — ora si disegnano anche sulla pianta
stessa, come farebbe un CAD: due segmenti tratteggiati con l'etichetta
del valore accanto al foro.

⚠️ **Questa unità è l'esempio positivo della regola "uno scatto propone,
una misura decide" applicata al contrario: qui lo scatto ha trovato un
difetto vero che la sola lettura del codice non avrebbe visto.**
Ho aperto davvero la pagina con Playwright (server statico +
`data-go="design"` per entrare in Progetto 2D, click sul canvas per
selezionare un foro, screenshot) — non per costume, ma perché questo
file impone di testare le modifiche UI in un browser vero prima di
dichiararle complete. Due giri di correzione:
1. Prima stesura: etichetta centrata sul punto medio del segmento
   verticale del burden. Per il foro 1 (prima fila, burden basso) quel
   punto medio cadeva quasi esattamente sulla riga dove `drawDesign2D`
   scrive già "FRONTE — faccia libera" (testo fisso, non legato al
   foro selezionato): le due stringhe si sovrapponevano, illeggibili
   ("facria" al posto di "faccia").
2. Spostata l'etichetta accanto al foro (sopra), la sovrapposizione
   RESTAVA — stavolta con una quota NOMINALE che la pagina disegna già
   da sempre vicino alla prima fila (`S ⟨D2.S⟩ m` e `B ⟨D2.B⟩ m`,
   righe ~5945-5947, indipendenti da quale foro è selezionato). Il
   foro 1 sta esattamente dove quella quota fissa scrive.
Corretto spostando entrambe le etichette SOTTO al foro: la zona alta
(dove vivono "FRONTE" e la quota nominale) resta libera qualunque foro
si scelga. Riverificato su due fori diversi (il foro 1, dove la
collisione c'era, e il foro 7 in mezzo alla fila): entrambi leggibili,
nessuna sovrapposizione — screenshot salvati in scratchpad.

Nessuna funzione nuova nella pagina (solo disegno dentro
`drawDesign2D`, nessun nuovo `function`), quindi nessun numero di
censimento è cambiato: verificato con `genesi-estraibili.mjs`
(148 funzioni, invariato) e `numeri-nei-documenti.mjs` (43 passati,
0 falliti, nessun documento da aggiornare).

Verificato sulla copia (git worktree) di quello che si sta committando:
`giro-node.mjs` → **40 comandi a posto, 0 caduti**.

## Stato roadmap

Nessuna voce dedicata toccata.

## Blocchi e limiti noti

Blocco di sicurezza su geometria/flyrock/burden invariato: disegna
soltanto numeri già calcolati altrove (`computeEnergia2D`), non calcola
niente di nuovo.

Resta aperta la domanda posta al fondatore su "aspetto più
professionale in stile CAD" vs. "struttura identica al core" —
nessuna risposta ancora arrivata.

## Prossimo passo atomico

Con "tutte e tre le alternative" ora coperte per la parte tecnica
sicura (DXF export G33; disegno di precisione G34/G34bis/G34ter:
aggancio alla griglia, coordinata in chiaro, quote a schermo), le
strade aperte restano:

1. Attendere la risposta del fondatore sulla tensione CAD-vs-struttura-
   del-core prima di disegnare qualunque toolbar/pannello in stile CAD
   (il terzo pezzo di "tutte e tre").
2. Nel frattempo: tornare al giro di ricerca continua (prossima app in
   rotazione dopo Genesi) o alla verifica visiva rimasta in sospeso
   (scheda signature-hole, citata nei checkpoint precedenti).
3. O un'altra piccola unità di rifinitura su Genesi, sempre rispettando
   il blocco di sicurezza su geometria/flyrock/burden.

Continuare senza fermarsi (regola del fondatore).
