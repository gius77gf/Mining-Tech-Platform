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

## Numeri scritti a mano: la virgola decimale

In cava chi compila scrive **«1.250,75»**, non «1250.75». Fino a ieri i campi
degli importi erano `<input type="number">`, e quel tipo di campo **non è
neutro rispetto alla virgola**: la specifica HTML gli impone come valore un
numero col PUNTO, e il browser butta via il resto. Misurato in Chromium
(identico in locale `en-US` e `it-IT`, quindi `lang="it"` non c'entra):

| digitato da tastiera | `.value` che arrivava al codice | `checkValidity()` |
|---|---|---|
| `2,4` | `24` — dieci volte tanto | **true** |
| `1.250,75` | `1.25075` — mille volte meno | false, ma nessuno lo chiedeva |

Una fattura da milleduecentocinquanta euro diventava una da un euro e
venticinque, in silenzio. Nessun `replace(",", ".")` può rimediare: la virgola
è già stata scartata prima che JS veda il valore.

**Adesso tutti i campi decimali sono `<input type="text" inputmode="decimal">`**
(sul telefono la tastiera resta numerica) e il numero lo legge
`numeroDaCampo()` in `conti-data.js`, che accetta `2,4` · `2.4` · `1.250,75` ·
`1,250.75` · `€ 1.250,75`. `min`/`max`/`step` del browser non valgono più: la
validazione è nostra. Campi convertiti: `ft-imp`, `pes-lordo`, `pes-tara`,
`pr-prezzo`, `pr-dens`, `can-ali`, `cl-sconto`, `cl-fido`, `gar-base` e
`inc-imp` (modale degli incassi). In Conti **non resta nessun campo intero**:
le aliquote IVA sono menù a tendina.

**Per un valore non capito non si salva zero.** Vuoto e `""` non sono zero: il
salvataggio si ferma e il toast del core dice cosa non torna.

### Il punto ambiguo, che non si tira a indovinare
`1.250` in Italia è milleduecentocinquanta; per il computer è
uno-virgola-due-cinque. Le due letture distano **mille volte**: su un importo è
la differenza fra una fattura e uno scontrino. Quando entrambe le letture
stanno nei limiti del campo, Conti **non scegli**: dice le due letture e chiede
come si scrive. Quando invece una sola è possibile per quel campo (uno sconto
di 1250% non esiste, quindi `1.250` in «Sconto %» è 1,25), l'altra è impossibile
e non c'è niente da indovinare.

### Quello che NON è cambiato
I numeri **scambiati** restano col punto decimale e senza separatore delle
migliaia: CSV di import/export e ponte Terra ↔ Conti (`cavatoPeriodo`,
`vendutoPeriodo`, `riconciliazione`, `valoreCavato`) sono **dati**, non testo.
E resta la regola d'onestà: **senza densità dichiarata non si converte**.
