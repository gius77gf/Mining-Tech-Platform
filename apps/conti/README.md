# Conti

App amministrazione & gare. Buyer: titolare / amministrazione.

Due file soli: `index.html` (interfaccia) e `conti-data.js` (dati e calcoli
puri). Nessuna libreria esterna, nessun CDN. Ogni accesso ai dati passa dallo
SDK `deepwork-id-client` (`orgCollection`): mai percorsi Firestore a mano.

## Cosa sa fare

**Ciclo di vendita della cava**

- **Listino prodotti** — pezzatura, prezzo in **€/t oppure €/m³**, **densità**
  (t/m³) e aliquota IVA. €/t e €/m³ non sono la stessa cosa: senza densità la
  conversione non si fa, e Conti non se la inventa.
- **Registro pesate / DDT** (DPR 472/1996) — lordo, tara, **netto calcolato**
  (mai digitato), prodotto dal listino, mezzo/targa, destinatario, data.
  Numerazione progressiva per anno. Prezzo, densità e IVA vengono
  **fotografati** sul documento: se domani il listino cambia, il DDT già
  consegnato non si muove.
- **Fattura differita dai DDT** — si scelgono più DDT di uno stesso cliente in
  un periodo e nasce **una fattura sola**, con le righe raggruppate per
  prodotto (a parità di prezzo, unità e aliquota) e i numeri dei DDT dentro
  ogni riga. I DDT usati restano marcati come fatturati.
- **Fattura con IVA** — imponibile, imposta, totale e riepilogo per aliquota;
  numero **progressivo per anno** proposto dall'app.
- **Canoni / diritti di escavazione** — aliquota in €/t o €/m³ **impostata
  dall'utente** (mai cablata: cambia da regione a regione) e dovuto calcolato
  sul materiale delle pesate nel periodo, con dettaglio per prodotto.

**Crediti e commerciale** — scadenzario, aging, interessi di mora
(D.Lgs 231/2002), solleciti ed estratti conto pronti da copiare, esposizione e
fido per cliente, anagrafica clienti, gare d'appalto, report e previsione
incassi, venduto per prodotto.

## Compatibilità dei dati già salvati

Le fatture inserite prima avevano solo `importo` (importo secco). Valgono come
**imponibile con IVA 0** (`importiFattura`): non cambia un centesimo e nessun
elenco si rompe. Le fatture nuove salvano `imponibile` + `ivaImporto` +
`totale` e tengono `importo` = **totale**, perché aging, esposizione, incassi e
solleciti leggono quel campo. Per completare una fattura vecchia basta aprirla
con la matita e scegliere l'aliquota.

## Collezioni (`organizations/{org}/apps/conti/`)

| Collezione | Campi principali |
|---|---|
| `fatture` | numero, cliente, clienteId, importo (= totale), imponibile, aliquotaIva, ivaImporto, totale, righe[], ddtIds[], tipo, emessa, scadenza, incassata, dataIncasso |
| `clienti` | ragioneSociale, piva, sdi, indirizzo, sconto, fido, note |
| `prodotti` | nome, unitaPrezzo (`t`/`m3`), prezzo, densita (t/m³), iva |
| `pesate` | numero, data, clienteId, cliente, prodottoId, prodotto, lordo, tara, netto, unitaVendita, quantita, densita, prezzoUnitario, aliquotaIva, mezzo, destinatario, fatturaId |
| `gare` | titolo, base, scadenza, stato |
| `impostazioni` | canoneUnita (`t`/`m3`), canoneAliquota, canoneNota |

## Conti prepara, non invia

L'app prepara documenti e calcoli. **L'invio allo SdI e la conservazione a
norma non si fanno da qui**: si fanno gratis dal portale Fatture e
Corrispettivi dell'Agenzia delle Entrate, o tramite il commercialista. Anche il
canone di escavazione è una **stima da confermare** con l'ente concedente.

Analisi e fonti: `docs/RICERCA_CONTI_202607.md`.
