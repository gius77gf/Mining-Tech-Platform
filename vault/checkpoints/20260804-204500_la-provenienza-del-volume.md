# Checkpoint — la provenienza del volume, trasferita

**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Suite:** 1.384 → **1.391** · copertura **432/432**

`origineDi` e `descriviOrigine` sono in `terra-data.js` con le loro **7 prove**,
e `vault/pronte/` è stata **cancellata**: ci era rimasta un ciclo solo, come il
suo LEGGIMI pretendeva. *Una copia che resta lì più a lungo è la duplicazione
che il repository combatte.*

## La regola che le due funzioni portano

`origine` assente **non vale «inserita a mano»**: vale *non lo sappiamo*. Il
verbale, per un rilievo senza provenienza, scrive che il numero **non è
riproducibile** invece di tacere — perché una riga che tace lascia credere che
il numero sia verificabile.

E per un rilievo dal visore **a metà** dichiara che cosa manca: un elenco di
parametri con dentro solo quelli che c'erano sembra completo a chi legge.

La prova che regge tutto: la frase d'assenza **non deve contenere nessuna
cifra**. Non «non deve nominare i parametri» — li nomina apposta, per dire che
non ci sono — ma nessun numero, perché un valore scritto lì sarebbe una misura
inventata.

## ⚠️ Seconda volta oggi: l'ancora che è sottostringa di un altro nome

`O.` → `terra.` ha trasformato `PIENO.origine` in `PIENterra.origine`. Stamattina
`N.` → `conti.` aveva trasformato `JSON.` in `JSOconti.`. Stesso giorno, stesso
errore, due volte:

> Una sostituzione «meccanica» su un testo è meccanica solo finché l'ancora non
> compare **dentro un altro nome**.

Vista subito perché la suite gira: quattro prove rosse con `PIENO is not
defined`, non un difetto silenzioso.

## Prossimo passo atomico

1. **il giro completo**, e pretendere **29 su 29**: i tre banchi riparati non
   sono mai stati misurati davvero dentro l'elenco;
2. il resto della tracciabilità: il **visore conserva** quello che ha già
   calcolato (unità 1), il **ponte di Terra li porta dentro** con la data che
   non si inventa (unità 2), il **verbale li stampa** (unità 3);
3. la nota di credito nell'export per il commercialista.
