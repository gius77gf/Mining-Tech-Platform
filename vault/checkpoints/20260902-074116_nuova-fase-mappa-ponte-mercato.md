# Checkpoint — 2026-09-02T07:41:16Z

## Tipo
unit-complete (punto di compattazione)

## Branch
claude/scheduled-tasks-remote-control-bk4ap6 — allineato con origin, albero pulito

## Ultimo commit
398860c1

## La fase è cambiata (26–27/08)
Vetrina consegnata e online (`https://deepworksic.netlify.app/apps/`, anche
senza rete). Il fondatore ha aperto la fase dei **dettagli su ogni app**, con
tre lavori: nomi, loghi, funzioni e collegamenti.

## Che cosa è stato fatto, dall'ultimo checkpoint
1. **`docs/MAPPA_ECOSISTEMA.md`** — 6 ponti di dati su 56 direzioni; sei
   famiglie di sovrapposizioni; Genesi non esce dal browser (`localStorage`,
   zero `orgCollection`); il ponte Genesi→Sentinella esiste **come file** CSV.
2. **`docs/NOMI_E_MARCHI.md`** — nomi e temi **SOSPESI** dal fondatore
   («in un altro momento»). Dentro: la bilancia come stemma di Conti (deciso,
   da ricordargli ai loghi), Genesi intoccabile (nome e marchio, unica app oltre
   a Deepwork ad averli), il sistema del marchio-iniziale, e sei strade di nomi
   già scartate con la ragione. **Fino alla ripresa i nomi restano quelli.**
3. **Primo ponte, metà fatta**: `confrontoCostiMezzi` in `shared/dw-ponti.js`
   (+7 prove in run-kpi, 2396→2403, controprova nei due versi). Manca la
   **lettura vera** dei costi di Flotta da Conti (istanza SDK pigra come il
   ponte con Terra), i dati di dimostrazione (`costiFlotta`) e il punto nella
   pagina — che c'è già, dove Conti scrive «anche in Flotta».
4. **`docs/MERCATO_E_CONCORRENTI.md`** — 3.378 cave in Italia; i tre
   concorrenti italiani stanno sulla pesa; suite integrate solo straniere;
   prezzi 500–2.000 €/anno per l'azienda piccola; modello **per cava**. Tutto
   di seconda mano, dichiarato.
5. PR aperta: **#345** (mappa + nomi + ponte + mercato). CI da verificare.

## Prossimo passo atomico
Completare il ponte Flotta→Conti: in `apps/conti/conti-data.js` aggiungere
`api.costiFlotta` sul modello di `api.rilieviTerra` (righe ~2936–2947: istanza
pigra, `null` se non raggiungibile), `costiFlotta: async () => mem.costiFlotta
|| []` nella modalità dimostrazione con dati coerenti con `DEMO.costi`, poi
nella pagina sostituire il badge «anche in Flotta» (`apps/conti/index.html`
riga ~4921) con il confronto vero via `confrontoCostiMezzi`. Provare col
browser che con Flotta assente NON compaia uno zero.

## Decisioni del fondatore da non perdere
- crowdfunding: **non ora** (zero clienti = valutazione al minimo); prima il
  primo cliente, poi bandi/startup innovativa, equity crowdfunding dopo;
- il vincolo «nessuna spesa prima della commercializzazione» resta;
- prossime cose sue, non mie: prezzo, primo cliente, prima spesa.

## Blocchi
Nessuno.
