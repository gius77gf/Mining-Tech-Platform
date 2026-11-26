# Checkpoint — 2026-11-26T20:25:44Z — nuvole LAS e LAZ contro file scritti da laspy

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 1f268c67, F6a; giro node su
1f268c67 confermato: 43/43, 4344)

## Completato — Genesi: il lettore di nuvole provato su file di un altro programma
- **Campioni** in `apps/deepwork-id/tests/campioni/las-da-laspy/`: nove coppie
  `.las` / `.laz` con gli stessi punti (LAS 1.2, 1.3, 1.4; formati punto 0-3 e
  6-8; un file con VLR e byte extra; un file da un punto solo), scritte da
  `laspy` + `lazrs`; `genera.py` e `verita.json` lì accanto. 100 kB in tutto.
- **Prove** in `run-pointcloud.mjs` (36 → 38): i nove LAS letti con punti e
  colori esatti; i nove LAZ riconosciuti come compressi e mai letti come punti.
  Controprova: guardando il bit sbagliato del formato ne cadono 2; ripristino
  da copia, `diff -q` identico.
- **Un messaggio solo per il LAZ**: `LAZ_NON_LETTO` in `apps/genesi/pointcloud.js`
  (6/6 esportazioni); `nuvola-poc.html` passa il `.laz` da `parseLAS` invece di
  avere un suo testo. Provato nel browser: `.laz` vero, lo stesso rinominato
  `.las`, e il gemello `.las` che si apre (120 punti).
- ⛔ **Il decodificatore LAZ non è entrato.** `laz-perf` (Apache 2.0, ~300 kB)
  scaricato nello scratchpad, MAI eseguito: la regola di sicurezza della
  sessione ha negato l'esecuzione di codice di terzi appena scaricato, e non
  l'ho aggirata. Decisione 34 in `docs/DECISIONI_WEEKEND.md` (sì/no del
  fondatore). Se arriva il sì: la misura da fare per prima è già scritta —
  decomprimere ogni `.laz` dei campioni, ricostruire il LAS e pretendere che
  `parseLAS` dia gli stessi punti del gemello (bozza dello script:
  scratchpad `laz/misura.mjs`, non nel repository perché non è mai girata).

## Numeri scritti nei documenti
3.749 prove senza rete (run-pointcloud 38); giro node 4346 (per somma: +2; da
confermare); condivisi 372/372, `pointcloud.js` 6/6.

## Stato roadmap
Foro per foro: F1–F5 ✅, capienza ✅, F6a ✅; F6b (inclinazione) aperta.
In attesa del fondatore: decisioni 33 e 34; canarino su main (serve una PR).

## Prossimo passo atomico — DXF: blocchi, archi e bulge
Il lettore DXF (`dxfLeggi`) oggi DICHIARA ciò che non legge: `nonLette`
(archi, cerchi, spline, punti, INSERT) e `archiComeCorde`. Il passo:
1. `node apps/deepwork-id/tests/dxf-da-cad.mjs --dimmi` e
   `cat apps/deepwork-id/tests/campioni/dxf-da-cad/verita.json | head -80` per
   vedere quali campioni portano archi (ARC), cerchi, polilinee con bulge e
   blocchi inseriti (INSERT), e che cosa pretende oggi la verità;
2. ARC e bulge → poligonali: un arco si discretizza (corda massima, es. 5 cm
   di freccia o 10° — scegliere con una misura sull'ingombro del campione);
   `archiComeCorde` deve scendere a zero per i campioni coperti;
3. INSERT → le entità del blocco trasformate (scala, rotazione, traslazione,
   nidificazione) — la parte più lunga: farla dopo gli archi, come unità a sé;
4. la verità per i nuovi casi la deve scrivere `genera.py` con ezdxf (che sa
   «appiattire» archi e blocchi: `ezdxf.path` / `virtual_entities`), NON la
   suite: serve il venv con ezdxf (scratchpad `interop/venv`; se manca,
   `pip install ezdxf`).

## Blocchi
Nessuno per il lavoro in corso.
