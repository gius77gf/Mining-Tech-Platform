# Checkpoint — 2026-09-06T08:19:37Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
84632457 — Ponte Conti → Flotta come regola, prima metà

## Completato
Le cinque funzioni del ponte in `shared/dw-ponti.js`, ri-esportate da Conti e
Flotta (identità provata), le righe di dimostrazione collegate (c90/k5 → n2),
run-kpi +7 (2789), copertura shared 241/241. CONCORRENTI_FLOTTA riga «Link
fatture a ordini di lavoro» → C'È A METÀ.

## Stato roadmap
Voce `[x]` «IL PONTE CONTI → FLOTTA COME REGOLA, PRIMA METÀ (06/09)».

## Prossimo passo atomico
LA SECONDA METÀ DEL PONTE, le due pagine:
1. `apps/conti/conti-data.js`: nel ramo live `api.ordiniFlotta` (istanza pigra
   `DeepworkID.init({appId:"flotta"})`, `getDocs(orgCollection("manutenzioni"))`
   → `ordiniFlottaPerConti(...)`, `null` se non risponde); nel ramo demo
   `ordiniFlotta: async () => mem.ordiniFlotta || []`.
2. `apps/conti/index.html`: nel form del registro costi (accanto a `co-nota`,
   riga 1458) una `<select id="co-odl">` «— ordine di lavoro di Flotta
   (facoltativo) —» popolata in `refresh()` da `db.ordiniFlotta()` con
   `etichettaOrdineFlotta`; se `null`, l'opzione unica dice «Flotta non
   raggiungibile»; al salvataggio (riga ~6747) `ordineFlotta: {id, titolo,
   mezzo}` quando scelto; in `rigaCosto` la pastiglia «ordine di lavoro» e
   nel meta «ordine: <etichetta>» quando `riferimentoOrdineFlotta(c)`.
3. `apps/flotta/index.html`: nella scheda dell'ordine (`odl-testa`, ~3560)
   una riga `note` con `confrontoOrdineConti(q.totale, costiDiOrdine(n.id,
   CC)).testo` (`CC` è già letto a riga 1729; `null` = non raggiungibile).
4. Prove: run-kpi (grep di pagina: la tendina, il salvataggio col
   riferimento, la frase in Flotta); banco `tests/browser/ponte-conti-flotta-
   odl.mjs` (Conti: la tendina ha n2 e n4, salva un costo collegato, la riga
   porta la pastiglia; Flotta: aprire n2 e leggere «una spesa in Conti:
   200,00 €, cioè 21,50 € più…») con controprova per file, registrato in
   `tutti.mjs`; scatti guardati; pin (banchi 263/111); roadmap: la voce
   passa da «prima metà» a chiusa e CONCORRENTI_FLOTTA da C'È A METÀ a C'È;
   B4 flotta 4→3, totale 38→37; MAPPA_ECOSISTEMA: 17 ponti.
5. Giro `node` sulla COPIA, commit con `-F`, checkpoint, push.

## Blocchi
Nessuno. Merge di PR #345 fermo al fondatore.
