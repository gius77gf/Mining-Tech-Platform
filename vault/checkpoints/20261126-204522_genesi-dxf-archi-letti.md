# Checkpoint — 2026-11-26T20:45:22Z — il lettore DXF legge gli archi

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Commit
quello che contiene questo file (il precedente è 9ff1407f; giro node su
9ff1407f confermato: 43/43, 4346)

## Completato — Genesi: DXF, archi e tratti curvi
- **Modulo** (`genesi-data.js`, 198 → 199 con `DXF_FRECCIA_ARCO_M`): in
  `dxfLeggi` ARC e CIRCLE entrano come tratti; i vertici di LWPOLYLINE e di
  POLYLINE portano la curvatura come numero (`bulge`), e
  `_dxfPoliConArchi` rende ogni tratto ad arco a spezzata. `_dxfLati` conta i
  lati dalla freccia (2 cm), mai meno di uno ogni 30°, al massimo 1440.
  L'estrusione (OCS) si applica dopo, a ogni punto. L'esito porta
  `archiSpezzati`; `archiComeCorde` non esiste più.
- **Verità**: `campioni/dxf-da-cad/genera.py` scrive per ogni curva le
  PRIMITIVE esatte di ezdxf (`virtual_entities`, centro/raggio/angoli in
  coordinate mondo), non la curva appiattita (che su 100 m di raggio sbaglia
  di 27 mm). 29 campioni: i 23 di prima INVARIATI al byte, 6 nuovi; cambiano
  solo `verita.json` e `genera.py`.
- **Suite** `dxf-da-cad.mjs` 26 → 32: per ogni curva vertici sulla curva vera
  (1e-6), freccia ≤ 2 cm, lunghezza entro il 2%. Controprova 8 → 13 difetti,
  ognuno fa cadere almeno un campione.
- **Pagina**: il bilancio dell'import dice «N archi o cerchi sono entrati come
  spezzate: dalla curva vera non si scosta più di 2 cm»; «entrano linee,
  polilinee, archi e cerchi». Banco `genesi-dxf-import.mjs` 22 → 25,
  controprova 2/2. Scatto guardato: archi, cerchio, bordo tondo, curva a S.
- **run-kpi** resta 3249: due prove esistenti aggiornate con la ragione (il
  giro di andata e ritorno col nostro DXF ora riporta anche i cerchi dei fori
  come contorni — mai come fori).

## Numeri scritti nei documenti
3.749 prove senza rete (invariato: `dxf-da-cad` non è fra le nove suite di
quel conto); giro node 4357 (per somma: +6 e +5; da confermare); condivisi
373/373, `genesi-data.js` 199/199.

## Stato roadmap
Aperte per Genesi: DXF blocchi inseriti (INSERT); F6b inclinazione per foro.
In attesa del fondatore: decisioni 33 (quale carica usano le previsioni) e
34 (decodificatore LAZ di terzi); canarino su main (serve una PR).

## Prossimo passo atomico — DXF: i blocchi inseriti (INSERT)
1. `_dxfStruttura` oggi tiene SOLO la sezione ENTITIES (di proposito: le
   definizioni dei blocchi non sono il disegno). Serve raccogliere a parte la
   sezione BLOCKS: per ogni `BLOCK` (nome nel codice 2, punto base 10/20) le
   sue entità fino a `ENDBLK`, in `st.blocchi[nome]`.
2. In `dxfLeggi`, davanti a un INSERT (nome 2, punto 10/20, scale 41/42,
   rotazione 50, estrusione 210..): prendere le entità del blocco, leggerle
   con lo STESSO codice delle entità normali (estrarre il corpo del ciclo in
   una funzione `leggiEntita(lista, trasforma)`), e applicare a ogni punto
   `p' = inserimento + R(rot)·S(sx,sy)·(p − base)`; blocchi dentro blocchi con
   un limite di profondità dichiarato (es. 8) e un conto di quelli tagliati.
   ⚠️ Con scala NON uniforme un arco diventa un'ellisse: la spezzata si
   trasforma punto per punto ed è giusta lo stesso, ma la freccia va
   ricontrollata sul raggio scalato (rendere l'arco DOPO aver scelto i lati
   sul raggio più grande).
3. Verità: `ref.virtual_entities()` di ezdxf (già in coordinate mondo).
   Campioni nuovi: blocco inserito semplice, ruotato, scalato, specchiato
   (scala negativa), nidificato, con attributi; `blocco_inserito` e
   `blocco_con_attributi` cambiano attese (oggi: `nonLette: {INSERT: 1}`).
4. La pagina: «N blocchi inseriti espansi» nel bilancio.
Ambiente: venv con ezdxf in scratchpad `interop/venv` (se manca:
`python3 -m venv v && v/bin/pip install ezdxf==1.4.5`).

## Blocchi
Nessuno per il lavoro in corso.
