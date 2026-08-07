# Il punto decimale nelle sei app — misurato, e non c'è

**07/08/2026.** Risultato **negativo**, scritto perché un «non c'è» vale solo
con la prova accanto — e perché senza questa pagina il cantiere dopo rifà la
stessa ricerca.

## La domanda

Il core scriveva **undici** numeri col punto decimale a schermo («1071.0 mc»,
«3466.1», «787.5 mc») accanto a date italiane, ed è stato corretto lo stesso
giorno con `perLettura` in `shared/`. Domanda ovvia: **e le sei app?**

## La risposta

**Zero.** Su **41 sezioni** aperte davvero in sei app, nessun numero scritto
col separatore decimale inglese.

| app | sezioni aperte | numeri col punto decimale |
|---|---|---|
| campo | 5 / 5 | 0 |
| conti | 10 / 10 | 0 |
| flotta | 6 / 6 | 0 |
| scudo | 8 / 8 | 0 |
| sentinella | 6 / 6 | 0 |
| terra | 6 / 6 | 0 |

La ragione è nota e non è fortuna: quelle app **hanno il formattatore
italiano** (`campo.numeroIt`, `mostra` di Flotta, i loro gemelli) — le stesse
copie che lo stesso giorno sono diventate alias di `perLettura`. Il core era
l'unico **senza**, ed è per questo che era l'unico a sbagliare.

## ⛔ E la prima misura diceva 217, tutti falsi

Vale più del risultato. La prima passata cercava `\d{1,7}\.\d{1,3}` e ha
contato **217** «difetti»: erano quasi tutti **migliaia scritte bene** —
«€ 40.450,00», «981.400 m³ estratti su 1.200.000 m³», «3.210 h».

Il segno che era il righello e non il prodotto era leggibile **prima** di
aprire un cantiere: il conto era alto proprio nelle app che il formattatore
**ce l'hanno** (terra 83, flotta 69, conti 60) e a **zero** in scudo e
sentinella. Un difetto che si concentra dove la difesa è più forte non è un
difetto.

Il discriminante è **quante cifre seguono il punto**: in italiano il punto
separa le migliaia e ne porta sempre **tre**; un separatore decimale ne porta
**una o due**.

## La controprova del righello

Un controllo che risponde «zero» dappertutto va provato contro il difetto:

| testo | atteso | esito |
|---|---|---|
| `1071.0 mc` (era nel core) | decimale | preso |
| `787.5 mc` | decimale | preso |
| `3466.1` | decimale | preso |
| `12.5 h` | decimale | preso |
| `€ 40.450,00` | migliaia, giusto | non preso |
| `981.400 m³` | migliaia, giusto | non preso |
| `1.200.000 m³` | migliaia, giusto | non preso |
| `30/07/2026` | data | non preso |

**4 decimali veri su 4 presi, 0 persi.** L'unico falso positivo è `v3.5` — una
versione, non un numero — e la sonda lo scarta a parte.

## ⚠️ Il denominatore: che cosa NON è stato guardato

Va letto prima del risultato, se no lo «zero» promette più di quel che vale.
Quattro superfici hanno aperto **0 sezioni** e quindi **non sono misurate**:

- **genesi** — la sua pagina non ha la barra `.nav button[id]` da cui la sonda
  ricava le sezioni. È anche l'app con più numeri di tutte (ritardi, cariche,
  frammentazione): **è il buco più grosso di questa misura**;
- **id · accesso**, **id · profilo**, **id · amministrazione** — stessa ragione.

Quindi la frase giusta è: **«nelle sei app verticali con barra di navigazione,
zero»**, non «in tutto l'ecosistema».

## Come si rifà

`apps/deepwork-id/tests/browser/giro.mjs` (`apriSuperficie` + `vaiA`) con un
server statico sulla porta scelta, camminando i **nodi di testo** visibili con
un `TreeWalker` — non `querySelectorAll`, che non vede le scatole anonime. Le
voci della barra si leggono **dalla pagina**, così l'elenco non si accorcia da
solo.
