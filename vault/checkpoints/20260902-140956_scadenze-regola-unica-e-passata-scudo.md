# Checkpoint — 2026-09-02T14:09:56Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
7111750c — «Scudo: la copertura formazione non dice più «tutte regolari» sopra una verifica scaduta»

## Completato (due unità)
1. **Ponte 3b, metà in shared** (`876350f2`): la misura (34 scadenze delle tre
   app, 0 verdetti diversi), `statoScadenza(data, oggi, preavviso)` come regola
   unica (HSE è lo stesso oggetto; Terra e Flotta delegano), `scadenzeUnite`
   con `completo`/`nonRaggiungibili`. Regola 18 di run-stile puntata sulla
   regola nuova (legge le risposte dai return: niente esempi nei commenti,
   niente ternari). Eccezione dichiarata con scadenza per `scadenzeUnite`.
2. **Passata su Scudo** (cantiere parallelo, misurato: suite, giro 37/0, banco
   nei due versi — la controprova crashava solo perché lanciata insieme al
   sano su una porta fissa —, scatto guardato): un difetto vero nel modulo
   (`coperturaFormazione` cieca su `statoVerificaPeriodica`) corretto con
   `statoCopertura`; sette KO di banco tutti del calendario, resi derivati.
   Scritte in roadmap, non chiuse: clamp a 320 px nella copertura;
   `csvPersonaleScadenze` con `stato=regolare` accanto a «Prescrizioni scadute».

Documenti: 2.907 prove, 3.315 asserzioni, 766/766 (+186/186 condivise).

## Prossimo passo atomico
**Il muro di Scudo che mostra anche la concessione (Terra) e i mezzi (Flotta)**
— la metà visibile del ponte 3b, adesso che Scudo è libero:
· `apps/scudo/scudo-data.js`: `api.scadenzeTerra` e `api.scadenzeFlotta` sul
  modello di `costiFlotta` in Conti (istanze SDK pigre con `appId` terra /
  flotta, `null` se non raggiungibili); dimostrazione `DEMO.scadenzeTerra` e
  `DEMO.scadenzeFlotta` coerenti con quelle app (copiate, dichiarato nel
  commento); ri-esportare `scadenzeUnite` da shared (identità) e TOGLIERE
  l'eccezione in `funzioni-mai-usate.mjs`.
· `apps/scudo/index.html`, schermata Scadenze: sopra il muro, un riquadro «Le
  scadenze di tutta la cava» che legge `scadenzeUnite` — conto per stato,
  l'elenco delle scadute e in scadenza con l'app di provenienza come pastiglia
  («Terra», «Flotta»), e la riga che dice per nome le app che non hanno
  risposto (mai «0 scadenze»). Stile del core, colori di Scudo.
· banco `scudo-scadenze-unite.mjs` sul modello di `conti-ponte-flotta.mjs`
  (sano / `--terra-assente` / controprova), registrato in `tutti.mjs` (3 righe).
· mappa §3b e §6: 8 → 10 ponti (Scudo legge Terra e Flotta); roadmap.

## Blocchi
Nessuno. PR #345 verde, aperta (unire è del fondatore).
