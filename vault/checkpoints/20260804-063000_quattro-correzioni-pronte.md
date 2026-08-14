# Checkpoint — quattro correzioni pronte, e la peggiore stava in `shared/`

**Commit:** `80ab0a3` (vocabolario dell'ecosistema), `e0448da` (la sonda in `shared/`)
**Branch:** `claude/scheduled-tasks-remote-control-bk4ap6`
**Documento:** `docs/IL_CONFORME_CHE_NESSUNO_HA_MISURATO.md`

## La peggiore, e non è dormiente

```js
// shared/dw-ponti.js
export function statoScadenzaHSE(dataISO, oggi = new Date()) {
  const t = Date.parse(String(dataISO || "") + "T00:00:00");
  if (Number.isNaN(t)) return "regolare";        // ← una data illeggibile è «regolare»
```

Si vede in **Scudo**, l'app della sicurezza, dove `statoScadenza` è l'alias di
questa e viene chiamato una **trentina** di volte.

Ci si arriva **da un import CSV**: `parseScadenzeCsv` filtra con
`/^\d{4}-\d{2}-\d{2}$/`, che controlla la **forma** e non l'esistenza.
**`2026-13-45` passa.** Misurato:

```
2026-13-45  ->  regolare      ← la visita medica che nessuno segnalerà mai
2025-01-10  ->  scaduta
2027-01-10  ->  regolare
```

Una scadenza di **idoneità sanitaria** con un errore di battitura entra in
archivio e resta **verde per sempre**: fuori dalle urgenti, fuori dal muro,
niente promemoria.

E **dodici righe sotto, nello stesso file**, `idoneitaOperatore` apre col
commento «non esistono risposte mancanti, esistono risposte che dicono *non lo
so* e perché» — e infatti risponde `non-collegato`, `collegamento-rotto`,
`senza-scadenze`. Due funzioni, stesso file, trattamento opposto.

**Perché la sonda l'ha trovata solo adesso**: guardava le sei app. La regola
vincolante dice che ciò che serve a due app vive in `shared/` — cioè **dove un
difetto si moltiplica per sei**. Era il posto più importante ed era fuori dal
perimetro. Adesso ci sono anche `dw-ponti.js`, `dw-shell.js` e `pointcloud.js`.

## Il vocabolario dell'assenza è dell'ecosistema, non di un'app

Allargato il controllo a tutte e sei: **«senza data» è già la convenzione di
TRE** (Flotta, Scudo, Terra), «… n.d.» di **due**. **11 etichette su 213.**
Da lì la decisione che restava aperta: il punto di misura importato senza
storico si chiamerà **«senza data»**, non un termine nuovo — e anche
`statoScadenzaHSE` risponderà così.

## Quattro correzioni, tutte con le prove già scritte e già cadute

| correzione | prove | cadono oggi |
|---|---|---|
| **Sentinella** — «mai misurato» invece di «Conforme» a zero letture | 6 | **5** |
| **Flotta** — la guardia su `orePreviste` (allarme inventato, «tra NaN h», «a 0 h») | 6 | **4** |
| **Conti** — `mesi` non accetta una data (oggi la pagina muore di memoria) | 1 (in processo figlio) | **1** |
| **shared + Scudo** — data illeggibile ≠ «regolare», e l'import la scarta | 7 | **4** |

In ognuna, le prove che **passano** oggi sono le **guardie contro la correzione
eccessiva**: la lettura a zero che deve restare Conforme, il conto buono di
`urgenzaOre`, le due righe CSV valide che devono entrare comunque.

E una l'ho dovuta riscrivere per questo: la B2 chiedeva «il totale fa due» e
falliva anche oggi, senza distinguere «ho scartato la riga rotta» da «ho
scartato tutto». Adesso chiede che le **due righe buone ci siano**.

## In corso

Il **giro a 25 banchi** è al diciannovesimo. Finché gira: `docs/`, `vault/` e le
suite `node` — ed è la ragione per cui queste quattro sono **pronte e non
fatte**. Nessuna di esse è in produzione: PR #322 è aperta, non fusa.

## Prossimo passo atomico

Quando il giro finisce, in quest'ordine — le prime quattro sono ormai
**meccaniche**, perché le prove esistono e si sa quali devono cambiare esito:

1. **shared + Scudo — la data illeggibile** (è la più grave: è live e sta nella
   sicurezza);
2. **Sentinella — «mai misurato»**, con `sonda-vuoto.mjs` che entra in
   `npm test` nello stesso commit;
3. **Flotta — la guardia su `orePreviste`** (tre righe);
4. **Conti — la guardia su `mesi`** (due righe);
5. **Genesi unità A** (`docs/LA_STRUTTURA_DEL_CORE_SCRITTA_SEI_VOLTE.md`);
6. **Terra/Genesi — tracciabilità del volume**, unità 1 e 2.

## Nessun blocco

Restano aperte le decisioni del fondatore in `DECISIONI_WEEKEND.md` (punti
5a/5b, 10, 11, 12, 13, 14, 15) più la domanda su **Firebase Storage** per le
foto di Scudo.
