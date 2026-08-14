# La funzione che non guardava niente

**Data:** 01/08/2026 · **App:** Conti + `shared/`
**Unità precedente:** `20260801-030000_terra-il-ponte-lotti-rilievi.md`

## Il difetto

`statoMese` sa dire «questa voce è arrivata **dopo** che avevi dichiarato il
mese completo». È scritta, è provata in `run-kpi`, e **non poteva scattare
mai**: il campo su cui si regge, `registratoIl`, non veniva scritto da nessuna
parte. La pagina salvava il costo senza.

È lo stesso difetto che questa giornata ha già visto tre volte — un controllo
che dice di guardare una cosa e non guarda niente — ma in un vestito nuovo:
stavolta non è un **controllo**, è una **funzione di prodotto**. E nessuna
prova di `node` poteva accorgersene, perché il difetto non era nel modulo ma in
**chi lo chiama**.

## Cosa è stato fatto

1. La pagina scrive `registratoIl` quando salva un costo.
2. Il banco lo prova **per comportamento, non per campo**: chiude un mese, ci
   registra dentro un costo, e pretende che la pagina lo dichiari come arrivo
   tardivo. Guardare il campo direttamente vorrebbe dire fidarsi che chi lo
   legge poi lo usi.
3. Quinta iniezione nella controprova: il costo salvato **senza** quel campo.
   Cadono 13 prove su 44.

## ⛔ E il banco ha trovato subito un secondo difetto, più fine

Con la prima correzione la prova **continuava a fallire**: chiusura e
registrazione capitano lo **stesso giorno**, e `"2026-08-01" > "2026-08-01"` è
falso. Al giorno, «dopo» non esiste — e il caso non è di laboratorio: si chiude
il mese, ci si ricorda di una bolletta, la si registra. Cinque minuti dopo.

Da lì `istanteLocale` in `shared/`: `AAAA-MM-GGTHH:MM:SS`, ordinabile come
stringa, coi primi dieci caratteri che restano il giorno **locale**. I secondi
non sono precisione, sono **necessità**: al minuto due gesti fatti di seguito
cadono nello stesso istante e l'ordine si perde.

⛔ Costruito dai getter locali, **mai** da `toISOString()` — la trappola già in
`CLAUDE.md`.

## ⚠️ E la prova di quella trappola, la prima volta, non provava niente

La controprova (rimettere `toISOString()`) **non distingueva**. Il caso che
avevo scelto erano le 23:30 italiane — ma alle 23:30 d'estate Greenwich segna
le 21:30 dello **stesso giorno**. Misurato: è a **mezzanotte e mezza** che
l'Italia è già il 2 agosto e Greenwich è ancora l'1.

Corretto il caso, la controprova cade. È la terza volta oggi che una prova
passa per una ragione diversa da quella scritta nel suo nome, e tutte e tre le
volte l'ha detto la controprova, non la lettura.

## Le prove

`run-helpers` **48 → 49** (con la sua controprova), banco `registro-costi`
**40 → 44** prove e **cinque** iniezioni. Prove `node` **1.438**, copertura
**454/454**, `run-stile` 268.

## Prossimo passo atomico

Verificare e committare le due **schermate** in lavorazione nei cantieri
paralleli — i lotti in Terra e l'analisi della causa in Scudo — guardando gli
scatti, non solo leggendo i resoconti.

Poi il **giro completo del browser** sul codice finale, da solo e senza altri
browser aperti; e, quando ci sarà spazio, il **giro su una copia**
(`docs/PIANO_GIRO_SU_COPIA.md`), che toglie la ragione per cui la regola «non
si tocca il cantiere mentre gira il giro» viene violata.
