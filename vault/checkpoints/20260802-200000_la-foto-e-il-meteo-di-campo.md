# Checkpoint — la foto dell'anomalia e il meteo di Campo

**Commit:** `dce4bca`
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`

## Che cosa è stato fatto

18 prove sul secondo gruppo di funzioni scoperte di Campo. Due famiglie
molto diverse fra loro, e vale la pena tenerle distinte.

### La foto: è anche una questione di sicurezza

`eFotoValida` è **l'ultima cosa** che sta fra un `data:` costruito a mano
e un tag `<img>` della pagina (`docs/AUDIT_SICUREZZA.md`). Adesso è
bloccata: passano solo `data:image/(jpeg|png|webp);base64,…`; **non**
passano gli SVG (che possono contenere codice) né i `javascript:`.

Il resto della famiglia decide se una foto da 8 MB entra in un documento
Firestore da 1 MB:

- il peso si conta **in byte, non in caratteri base64** — il base64 è un
  terzo più lungo, e leggere la lunghezza del testo farebbe credere che
  una foto da 210 kB ne pesi 280, con la scaletta che rimpicciolisce per
  niente;
- la scaletta dei tentativi **scende sempre** (lato e qualità), e il
  tetto resta ben sotto il mega;
- una foto piccola **non viene mai stirata**: ingrandirla non aggiunge
  dettaglio e fa pesare di più la stessa immagine;
- misure assenti o assurde danno `1×1`, mai zero e mai `NaN`.

### Il meteo: quello che conta è quando non c'è

`meteoAvverso(null)` è `false` — ma **non vuol dire bel tempo**. La prova
lo scrive insieme alla ragione per cui quel `false` non diventa un verde:
la pagina disegna il cartellone **solo quando `riassuntoMeteo` dice
qualcosa**, e l'export scrive «non registrato». Le due cose vanno
insieme, ed è per questo che stanno nella stessa asserzione: se un giorno
quel legame si rompesse, un turno mai compilato si mostrerebbe come un
turno senza problemi. È il difetto n. 7 della giornata di ieri, in
un'altra app.

Stessa forma sulla checklist: una voce lasciata **in bianco non conta
come «a posto»**. Se contasse, la checklist diventerebbe esattamente la
firma finta che esiste per evitare.

## Controprova

Nove difetti rimessi in una copia del modulo (`apps/campo/_tmp-cp.js`),
**9 su 9** fanno cadere la prova col loro nome, con i caratteri cambiati
stampati. Fra questi: l'SVG che passa per foto valida, il peso contato in
caratteri, la foto piccola stirata, la visibilità «Ridotta» promossa ad
avversa, la voce in bianco contata come a posto, la checklist di una
squadra valida per tutte, il tetto della foto alzato quasi al mega, i MB
scritti col punto.

## Numeri

- Campo: **49 → 65 funzioni coperte su 73** (contate rileggendo gli
  export, non stimate). Restano fuori solo tre lettori di numeri
  condivisi, due liste e il lettore del piano.
- `run-kpi.mjs`: **808 → 826**; totale `node`: **1.091 → 1.109**.
- I documenti che dichiarano quei numeri corretti dal controllo che li
  rilegge.

## Stato del giro del browser

In corso: primo banco (campi interi su nove superfici) **passato**,
adesso gira la sua controprova. Log in
`scratchpad/giro-campo/giro21.log`. Finché gira: niente modifiche a
moduli dati e pagine.

## Prossimo passo atomico

Passare a **Flotta**, che con 36 funzioni coperte su 71 è ora la meno
difesa. Stesso metodo: elencare gli export scoperti, sonda per **misurare
il comportamento** invece di indovinarlo, blocco di prove prima del
riepilogo finale di `run-kpi.mjs`, controprova su copia
(`apps/flotta/_tmp-cp.js`), verifica che il totale sia salito, commit e
checkpoint.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md`
(punti 5a/5b, 10, 11, 12, 13).
