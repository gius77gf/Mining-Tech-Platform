# Il ricettore di cui non si sa quanto è lontano

**Data:** 01/08/2026 · **Area:** `apps/sentinella/sentinella-data.js` (dimostrazione), banco degli stati
**Unità precedente:** `20260801-235950_nominata-e-senza-la-formazione-sotto.md`

## Secondo dei tre stati veri

E non è un dettaglio d'anagrafica: la **distanza del ricettore** è il
denominatore della distanza scalata e il primo numero che un ente guarda. Senza,
su quel ricettore non si può dire quasi niente — quindi la sua assenza è
proprio il motivo per cui tutto il resto resta sospeso.

La riga lo scrive già («distanza non indicata») invece di lasciare il posto
vuoto, e non lo vedeva nessuno: tutti e tre i ricettori d'esempio la distanza ce
l'avevano.

## Il caso, e perché è additivo

`rc4`: una cascina aggiunta **dopo un esposto**, con la distanza da misurare
sulla mappa catastale. Storia vera — il ricettore lo si registra quando arriva
la segnalazione, la distanza si misura dopo.

Additivo: nessun punto di misura è collegato a questo ricettore, quindi nessun
conteggio del report cambia. `run-kpi` 1123/0 e `run-demo` 8/0 senza toccare
altro.

## Le due metà della riga

- il banco nomina **il ricettore**: gli altri tre dicono «N m dalla cava», e una
  regex sulla sola frase non avrebbe distinto quale riga stava guardando;
- il `vietato` dice l'altra metà, ed è quella che conta: **un ricettore senza
  distanza non è a zero metri dalla cava**. Uno «0 m» lì sarebbe la lettura più
  allarmante possibile, scritta al posto di un dato che nessuno ha misurato.

## La controprova

Rimessa la guardia sbagliata (`numeroIt(+r.distanza || 0) + " m dalla cava"`,
una sola occorrenza): la riga torna a dire «0 m dalla cava» su un ricettore mai
misurato, e il banco cade sul caso giusto.

## Verifica

`stati-non-misurati` **82/0** — 47 stati cercati, 6 app (erano 79/0 e 46).
`run-kpi` 1123/0, `run-demo` 8/0.

## Prossimo passo atomico

L'**ultimo** dei tre stati veri: **Sentinella · «norma non indicata sul
progetto»** — un limite di progetto senza la norma da cui è preso, nella
tabella previsto-contro-misurato del report per l'ente. Da misurare **dove**
compare davvero prima di decidere: la dimostrazione ha una sola volata con
previsione (`b3`) e la norma ce l'ha, quindi il caso probabilmente non c'è.
Se aggiungerlo significasse togliere la norma all'unica previsione, sarebbe
**strutturale** e andrebbe rifiutato o digitato — la decisione va presa col
documento alla mano, non a intuito.
Chiuso quello, la lista dei tre stati veri è finita e la classifica va
**ricontata**: quello che resta sono ripieghi di campo già dichiarati, quindi
il filone va considerato concluso e si riparte dalla roadmap.
