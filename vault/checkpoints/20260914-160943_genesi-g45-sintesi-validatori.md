# Checkpoint — 2026-09-14T16:09:43Z

## Tipo
unit-complete (G45, candidato preso e costruito)

## App
Genesi

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Completato

Preso il candidato G45, dichiarato "non preso" nel checkpoint
`20260914-005111`-adiacente (14/09, mattina): un verdetto di sintesi
sopra la scheda validatori (`renderScheda2D`), nella forma (a) già
scelta in roadmap — sintesi scoperta esplicitamente, senza aspettare la
fusione col pannello KPI (forma (b), un cantiere più grande).

**Il badge**: conta quanti dei 22 indicatori VALIDATI (esclusi i tre
`sv-info` puramente descrittivi — Pressione det., Resistenza all'acqua a
secco, Presplit non previsto) sono `sv-warn`/`sv-bad`, e mostra un
riquadro rosso/giallo/verde in cima alla scheda, PRIMA delle righe di
dettaglio. Il non-calcolabile conta come "fuori fascia" di proposito
(stessa `cls:'sv-warn'` di `verdettoValidatore`): un indicatore che non
si può contare non è un indicatore a posto.

**La frase di perimetro resta sempre visibile**, anche nel caso verde:
"Non copre vibrazione, airblast né flyrock: guarda il pannello KPI qui
sopra" — è la clausola che la roadmap identificava come indispensabile
per non promettere una garanzia di sicurezza che il badge non dà.

**Trovato e corretto un difetto di layout nella stessa unità**,
rispettando la regola del confronto affiancato: la prima stesura usava
`display:flex` a tre "colonne" (emoji, conteggio in grassetto, frase di
perimetro), che a 430px spezzava il testo su righe innaturalmente
strette invece di scorrere come un paragrafo — vista con uno screenshot,
non indovinata. Tolto il flex: il testo scorre come le altre righe "why"
già presenti nella scheda.

## Verificato

- `sintassi-pagine.mjs`: 34/34. `run-stile.mjs`: 328/328.
- `genesi-estraibili.mjs`: 147 funzioni, invariato (nessuna funzione
  nuova, solo markup dentro `renderScheda2D`).
- **Screenshot a 430px e 1400px**, sul caso con difetti veri (progetto
  demo: 3 indicatori gravi, 11 su 22 fuori fascia) — badge rosso ben
  leggibile, testo che scorre naturalmente, coerente con lo stile
  esistente della scheda in entrambe le larghezze.
- `genesi-campi-assenti.mjs` (55/0) e `genesi-frasi-limite.mjs` (36/0),
  che esercitano `renderScheda2D` sui casi limite (campi assenti, leggi
  di sito provvisorie/multiple referti) — nessun conteggio di riga
  cambiato, confermano che il nuovo `<div>` non ha toccato la struttura
  esistente.
- `numeri-nei-documenti.mjs`: 43/0 — indice delle voci aperte
  riallineato (G45 tolta, era già chiusa nel corpo del documento).
- Giro completo su worktree isolata: **40 comandi a posto, 0 caduti**,
  3910 asserzioni — invariate rispetto all'unità precedente (nessun
  banco `node` misura il markup della scheda).

## Stato roadmap

G45 chiusa (`- [x] ✅`), tolta dall'indice delle voci aperte. Resta
aperta solo G46 (frammentazione misurata, candidato non costruito per
la regola SOLDI).

## Blocchi e limiti noti

Nessuno nuovo. La forma (b) del G45 originale (fondere scheda
validatori e pannello KPI in un'unica sintesi) resta esplicitamente non
presa — un cantiere di struttura, non implicito in questa unità.

## Prossimo passo atomico

Il giro completo del browser (`tutti.mjs`), lanciato alle 13:44Z su una
copia congelata del commit `477ac992`, è ancora in esecuzione alle
16:09Z — oltre due ore e mezza. Il ramo è andato avanti di **7 commit**
da allora, di cui **tre** toccano `apps/genesi/genesi.html` (G8 firma,
G45 sintesi, e i fix precedenti) — tutti verificati separatamente con
screenshot e banchi mirati in questo blocco, quindi eventuali KO del
giro su quelle righe vanno letti sapendo che sono già stati controllati
altrove. Da raccogliere con `leggi-giro.mjs` appena finisce, guardando
la sua sezione 0 per lo scarto reale.

Backlog di ricerca e censimento estrazione entrambi sostanzialmente
esauriti. G46 resta l'unico candidato dichiarato non costruito. Prossime
strade, nessuna legata al CAD: la coda offline/rete (5b, in
`docs/DECISIONI_WEEKEND.md`) non è Genesi-specifica quindi fuori
perimetro; il cantiere B3 (53 funzioni "una o due variabili") resta
un'opzione se serve un'unità più grande.

Nessuno stop volontario: si prosegue subito.
