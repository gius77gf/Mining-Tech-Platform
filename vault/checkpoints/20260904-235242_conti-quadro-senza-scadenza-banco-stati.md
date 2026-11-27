# Checkpoint — 2026-09-04T23:52Z

## Tipo
unit-complete

## Branch
claude/scheduled-tasks-remote-control-bk4ap6

## Ultimo commit
6cd053bf

## Completato
- Il banco `stati-non-misurati` (4 KO su 79 già prima di stasera): due cause
  trovate aprendo le schermate — il report di Sentinella apre sugli ultimi 30
  giorni e le volate della dimostrazione sono di luglio (banco: periodo
  scritto); il Quadro di Conti tagliava fuori dalle tre righe la fattura
  senza scadenza (prodotto: riga sua, corta perché il meta è a due righe,
  misurato a 320). Banco 81/81, controprova che cade; giro node 38/0.
- Verificato dal meccanismo che il ciclo del DSS in Scudo ESISTE (`cicloDss`,
  `dssDaSeguire`, `descriviCicloDss`…): la riga del delta del 14/08 «Ciclo DSS
  non è seguito» è superata e non va riproposta.

## Prossimo passo atomico
Scegliere fra: (a) Sentinella (c) — il punto ricorda il preset scelto
(`sogliaPreset` salvato alla creazione, campo facoltativo), i preset
dichiarano la banda scritta nella loro etichetta (`bandaHz`), e una lettura
con `extra.freq` fuori dalla banda della soglia porta un tag dichiarativo
(«f 18 Hz: fuori dalla banda della soglia, <10 Hz») senza inventare un
limite — provare in scratchpad, run-kpi, banco `sentinella-evento-import`
esteso; (b) la ricerca a rotazione su Scudo su un tema non fatto — la
formazione obbligatoria in cava (chi, quante ore, rinnovi; Accordo
Stato-Regioni) — metà sul mondo con WebSearch e delta dal meccanismo
(`grep -c formazione apps/scudo/scudo-data.js` prima di dire «non c'è»).

## Blocchi
Nessuno tecnico. Decisioni del fondatore aperte: 5b, 19-27, Q1; registro
esplosivi; TD24 / IPA / split payment; registro dei terzi.
